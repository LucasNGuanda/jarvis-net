#!/usr/bin/env python3
"""Gera a lista COMPLETA de isômeros constitucionais de algumas fórmulas moleculares e grava SIM.org.ISO em assets/sims/quimica/organica.js, entre /*ISO-INI*/ e /*ISO-FIM*/.
Método (RDKit): monta todas as árvores com os átomos pesados da fórmula (ligações simples, respeitando as valências C 4, N 3, O 2, Cl 1); se a fórmula tem uma insaturação,
acrescenta todas as duplas possíveis e todos os fechamentos de anel; elimina repetições pelo SMILES canônico; confere o número de hidrogênios.
Ficam de fora, por não serem estruturas estáveis de livro: enóis, peróxidos e ligações N–O, O–Cl e N–Cl. Conferência: o número de alcanos bate com a tabela de dadosH.json.
Para cada isômero grava: SMILES, esqueleto de carbonos (SMILES canônico só com os carbonos e ligações simples) e o nome, se o composto está na tabela SIM.org.COMP
ou se é hidrocarboneto de cadeia aberta (nome dado por SIM.org.nome). Precisa do RDKit. Uso: python3 tools/quimica/gera-isomeros.py"""
import json, re, os, subprocess, itertools
from rdkit import Chem, RDLogger
from rdkit.Chem.rdMolDescriptors import CalcMolFormula
RDLogger.DisableLog('rdApp.*')
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FORM = ["C4H10", "C5H12", "C6H14", "C4H8", "C5H10", "C2H6O", "C3H8O", "C4H10O", "C3H6O", "C3H7Cl", "C4H9Cl", "C3H9N"]
VAL = {"C": 4, "N": 3, "O": 2, "Cl": 1}
PROIB = [Chem.MolFromSmarts(x) for x in ["[OX2H]C=C", "OO", "[N]O", "OCl", "NCl", "C=C=C", "[OX2H]C[OX2H]", "C1=CC1", "O1CO1", "C1OC1=*", "[CX3]=[CX3]O[CX3]=O"]]
def conta(f): return {m[0]: int(m[1] or 1) for m in re.findall(r"([A-Z][a-z]?)(\d*)", f)}
def arvores(pes):
    nivel = set()
    for el in set(pes): 
        r = dict(pes); r[el] -= 1; nivel.add((el, tuple(sorted(r.items()))))
    feito = set()
    while nivel:
        prox = set()
        for smi, resto in nivel:
            r = dict(resto)
            if all(v == 0 for v in r.values()): feito.add(smi); continue
            m = Chem.MolFromSmiles(smi)
            for a in m.GetAtoms():
                if a.GetTotalNumHs() == 0: continue
                for el, q in r.items():
                    if q == 0: continue
                    rw = Chem.RWMol(m); j = rw.AddAtom(Chem.Atom(el)); rw.AddBond(a.GetIdx(), j, Chem.BondType.SINGLE)
                    try: Chem.SanitizeMol(rw)
                    except Exception: continue
                    r2 = dict(r); r2[el] -= 1; prox.add((Chem.MolToSmiles(rw), tuple(sorted(r2.items()))))
        nivel = prox
    return feito
def insat(smi):
    m = Chem.MolFromSmiles(smi); sai = set()
    for b in m.GetBonds():
        a, c = b.GetBeginAtom(), b.GetEndAtom()
        if a.GetTotalNumHs() and c.GetTotalNumHs():
            rw = Chem.RWMol(m); rw.GetBondBetweenAtoms(a.GetIdx(), c.GetIdx()).SetBondType(Chem.BondType.DOUBLE)
            try: Chem.SanitizeMol(rw); sai.add(Chem.MolToSmiles(rw))
            except Exception: pass
    for a, c in itertools.combinations(range(m.GetNumAtoms()), 2):
        if m.GetBondBetweenAtoms(a, c) is None and m.GetAtomWithIdx(a).GetTotalNumHs() and m.GetAtomWithIdx(c).GetTotalNumHs():
            rw = Chem.RWMol(m); rw.AddBond(a, c, Chem.BondType.SINGLE)
            try: Chem.SanitizeMol(rw); sai.add(Chem.MolToSmiles(rw))
            except Exception: pass
    return sai
def esqueleto(smi):
    m = Chem.RWMol(Chem.MolFromSmiles(smi))
    for b in m.GetBonds(): b.SetBondType(Chem.BondType.SINGLE)
    for i in sorted([a.GetIdx() for a in m.GetAtoms() if a.GetSymbol() != "C"], reverse=True): m.RemoveAtom(i)
    try: Chem.SanitizeMol(m)
    except Exception: pass
    return ".".join(sorted(Chem.MolToSmiles(m).split(".")))
js = "global.window={SIM:{}};" + open(os.path.join(RAIZ, "assets/sims/quimica/organica.js"), encoding="utf8").read() + ";console.log(JSON.stringify(window.SIM.org.COMP))"
COMP = {Chem.MolToSmiles(Chem.MolFromSmiles(c[2])): c[0] for c in json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)}
EXTRA = {}
sai = {}; rel = []
for f in FORM:
    c = conta(f); H = c.pop("H"); hmax = 2 * c.get("C", 0) + 2 + c.get("N", 0) - c.get("Cl", 0); idh = (hmax - H) // 2
    cand = arvores(c)
    for _ in range(idh): cand = set().union(*[insat(s) for s in cand]) if cand else set()
    lista = []
    for s in sorted(cand):
        m = Chem.MolFromSmiles(s)
        if CalcMolFormula(m) != f: continue
        if any(m.HasSubstructMatch(p) for p in PROIB): continue
        lista.append(s)
    sai[f] = lista; rel.append(f"{f}: {len(lista)} isômeros")
d = json.load(open(os.path.join(RAIZ, "tools/quimica/dadosH.json")))["alcanos_isomeros"]
for n in (4, 5, 6):
    esp = d[f"C{n}"][0]["valor"]; tem = len(sai[f"C{n}H{2*n+2}"]); assert tem == esp, (n, tem, esp); rel.append(f"  alcano C{n}: {tem} = tabela {esp}")
todos = sorted({s for l in sai.values() for s in l})
js2 = "global.window={SIM:{}};" + open(os.path.join(RAIZ, "assets/sims/quimica/organica.js"), encoding="utf8").read() + ";const o=window.SIM.org,r={};for(const s of %s){let n=null;try{n=o.nome(s)}catch(e){};r[s]=n};console.log(JSON.stringify(r))" % json.dumps(todos)
NOME = json.loads(subprocess.run(["node", "-e", js2], capture_output=True, text=True, check=True).stdout)
linhas = []
for f, l in sai.items():
    itens = [[s, esqueleto(s), COMP.get(s) or NOME.get(s) or EXTRA.get(s)] for s in l]
    linhas.append(f'    {json.dumps(f)}: {json.dumps(itens, ensure_ascii=False)},')
bloco = "/*ISO-INI*/ /* GERADO por tools/quimica/gera-isomeros.py (RDKit): não editar à mão. Cada isômero: [SMILES, esqueleto de carbonos, nome ou null] */\n  SIM.org.ISO = {\n" + "\n".join(linhas) + "\n  };\n  /*ISO-FIM*/"
p = os.path.join(RAIZ, "assets/sims/quimica/organica.js"); s = open(p, encoding="utf8").read()
if "/*ISO-INI*/" in s: s = re.sub(r"/\*ISO-INI\*/.*?/\*ISO-FIM\*/", lambda m: bloco, s, flags=re.S)
else: i = s.rindex("})();"); s = s[:i] + "\n  " + bloco + "\n" + s[i:]
open(p, "w", encoding="utf8").write(s)
print("\n".join(rel))
for f in ("C4H8", "C3H8O", "C4H10O", "C3H6O", "C3H9N", "C4H9Cl", "C3H7Cl", "C5H10"): print(f, [(x, COMP.get(x) or NOME.get(x) or EXTRA.get(x)) for x in sai[f]])
