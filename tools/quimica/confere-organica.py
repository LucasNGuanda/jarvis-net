#!/usr/bin/env python3
"""Confere o núcleo da orgânica (assets/sims/quimica/organica.js) contra o RDKit, para todo SMILES que aparece nos temas H*.js e no próprio arquivo:
fórmula molecular, tipo de cada carbono (primário...), hibridização, número de ligações sigma e pi, número de anéis e índice de deficiência de hidrogênio.
Precisa do RDKit (pip install rdkit). Uso: python3 tools/quimica/confere-organica.py"""
import json, re, subprocess, os, sys, glob
from rdkit import Chem, RDLogger
RDLogger.DisableLog('rdApp.*')
from rdkit.Chem.rdMolDescriptors import CalcMolFormula
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
fontes = glob.glob(os.path.join(RAIZ, "temas/quimica/H*.js")) + glob.glob(os.path.join(RAIZ, "temas/quimica/I*.js")) + [os.path.join(RAIZ, "assets/sims/quimica/organica.js")]
cand = set()
for f in fontes:
    for m in re.finditer(r'"([A-Za-z0-9@+\-\[\]\(\)=#/\\\.]{1,80})"', open(f, encoding="utf8").read()):
        s = m.group(1)
        if not re.search(r"[CcNnOSFIP]", s) or re.search(r"[abd-km-mp-rt-z]", s.replace("Cl", "").replace("Br", "")): continue
        if re.fullmatch(r"[A-Z][a-z]?\d*", s) and s not in ("C", "N", "O", "CC", "CO", "CN"): continue   # símbolos e fórmulas soltas (Fe, H2...)
        mol = Chem.MolFromSmiles(s)
        if mol is not None and mol.GetNumAtoms() > 0 and any(a.GetSymbol() == "C" for a in mol.GetAtoms()): cand.add(s)
jsC = "global.window={SIM:{}};" + open(os.path.join(RAIZ, "assets/sims/quimica/organica.js"), encoding="utf8").read() + ";console.log(JSON.stringify((window.SIM.org.COMP||[]).map(c=>c[2])))"
cand |= set(json.loads(subprocess.run(["node", "-e", jsC], capture_output=True, text=True, check=True).stdout))
L = sorted(cand)
SMARTS = {"ácido carboxílico": "[CX3](=O)[OX2H1]", "éster": "[CX3](=O)[OX2H0][#6;!$(C=O)]", "anidrido": "[CX3](=O)[OX2][CX3](=O)", "aldeído": "[CX3;H1,H2;!$(C[OX2,N,F,Cl,Br,I])]=O", "cetona": "[#6][CX3](=O)[#6]",
          "álcool": "[OX2H][CX4]", "fenol": "[OX2H]c", "éter": "[OD2]([#6;!$(C=O)])[#6;!$(C=O)]", "amina": "[NX3+0;$(N[#6]);!$(NC=O)]", "amida": "[CX3](=O)[NX3]", "nitrila": "C#N", "nitrocomposto": "[N+](=O)[O-]",
          "haleto de alquila": "[F,Cl,Br,I;$(*[CX4])]", "haleto de arila": "[F,Cl,Br,I;$(*c)]", "haleto de acila": "[CX3](=O)[F,Cl,Br,I]"}
PAT = {k: Chem.MolFromSmarts(v) for k, v in SMARTS.items()}
js = "global.window={SIM:{MA:{H:1,C:12,N:14,O:16,F:19,S:32,Cl:35.5,Br:80,I:127,Na:23,K:39,P:31}}};" + open(os.path.join(RAIZ, "assets/sims/quimica/organica.js"), encoding="utf8").read() + ";const o=window.SIM.org,r={};for(const s of %s){try{const sp=o.sigmapi(s),c=o.cadeia(s);r[s]={f:o.formula(s,'ce'),cl:o.classes(s).filter(x=>x!==null),hb:o.hib(s).filter(Boolean),sg:sp.sigma,pi:sp.pi,an:c.ciclos,idh:o.idh(s),fn:o.funcoes(s).map(x=>x.f)}}catch(e){r[s]={erro:e.message}}};console.log(JSON.stringify(r))" % json.dumps(L)
R = json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)
falhas = 0; naolidos = []
HB = {Chem.HybridizationType.SP3: "sp3", Chem.HybridizationType.SP2: "sp2", Chem.HybridizationType.SP: "sp"}
for s in L:
    r = R[s]
    if "erro" in r: naolidos.append(s); continue
    m = Chem.MolFromSmiles(s); mh = Chem.AddHs(m)
    f = re.sub(r"[+-]\d*$", "", CalcMolFormula(m))
    cl = [max(1, sum(1 for v in a.GetNeighbors() if v.GetSymbol() == "C")) for a in m.GetAtoms() if a.GetSymbol() == "C"]
    hb = [HB.get(a.GetHybridization(), "?") for a in m.GetAtoms() if a.GetSymbol() == "C"]
    Chem.Kekulize(mh, clearAromaticFlags=True)
    sg = mh.GetNumBonds(); pi = sum(int(b.GetBondTypeAsDouble()) - 1 for b in mh.GetBonds())
    an = m.GetRingInfo().NumRings() if "." not in s else None
    erros = []
    if r["f"] != f: erros.append(f"fórmula {r['f']} × {f}")
    if sorted(r["cl"]) != sorted(cl): erros.append(f"classes {r['cl']} × {cl}")
    if sorted(r["hb"]) != sorted(hb): erros.append(f"hibridização {r['hb']} × {hb}")
    if r["sg"] != sg: erros.append(f"sigma {r['sg']} × {sg}")
    if r["pi"] != pi: erros.append(f"pi {r['pi']} × {pi}")
    if an is not None and r["an"] != an: erros.append(f"anéis {r['an']} × {an}")
    for f, pat in PAT.items():
        if f == "éster":   # um éster por carbonila ligada a O–C que não seja anidrido
            esp = len({x[0] for x in m.GetSubstructMatches(pat)})
        elif f == "anidrido": esp = len(m.GetSubstructMatches(pat)) // 2 if len(m.GetSubstructMatches(pat)) > 1 else len(m.GetSubstructMatches(pat))
        elif f == "amida": esp = len({x[0] for x in m.GetSubstructMatches(pat)})
        else: esp = len(m.GetSubstructMatches(pat))
        tem = r["fn"].count(f)
        if tem != esp: erros.append(f"{f}: site {tem} × RDKit {esp}")
    if erros: falhas += 1; print("FALHA", s, "; ".join(erros))
print(f"{len(L)} SMILES (temas e tabela de compostos); {len(L) - len(naolidos)} lidos pelo site e comparados com o RDKit (fórmula, carbonos, hibridização, sigma, pi, anéis e 15 funções orgânicas); diferenças: {falhas}")
if naolidos: print("fora do subconjunto que o site lê (não usados em figura):", ", ".join(naolidos))
sys.exit(1 if falhas else 0)
