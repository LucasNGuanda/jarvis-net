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
L = sorted(cand)
js = "global.window={SIM:{MA:{H:1,C:12,N:14,O:16,F:19,S:32,Cl:35.5,Br:80,I:127,Na:23,K:39,P:31}}};" + open(os.path.join(RAIZ, "assets/sims/quimica/organica.js"), encoding="utf8").read() + ";const o=window.SIM.org,r={};for(const s of %s){try{const sp=o.sigmapi(s),c=o.cadeia(s);r[s]={f:o.formula(s,'ce'),cl:o.classes(s).filter(x=>x!==null),hb:o.hib(s).filter(Boolean),sg:sp.sigma,pi:sp.pi,an:c.ciclos,idh:o.idh(s)}}catch(e){r[s]={erro:e.message}}};console.log(JSON.stringify(r))" % json.dumps(L)
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
    if erros: falhas += 1; print("FALHA", s, "; ".join(erros))
print(f"{len(L)} SMILES achados nos arquivos; {len(L) - len(naolidos)} lidos pelo site e comparados com o RDKit; diferenças: {falhas}")
if naolidos: print("fora do subconjunto que o site lê (não usados em figura):", ", ".join(naolidos))
sys.exit(1 if falhas else 0)
