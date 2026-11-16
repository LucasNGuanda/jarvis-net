#!/usr/bin/env python3
"""Gera SIM.org.EST (dados de estereoisomeria) em assets/sims/quimica/organica.js, entre /*EST-INI*/ e /*EST-FIM*/.
Para cada composto da lista (nome em português, nome em inglês, SMILES sem estereoquímica), o RDKit calcula:
  c: índices dos carbonos quirais (centros de quiralidade; a ordem dos átomos é a do SMILES, a mesma do desenho do site);
  d: índices [a, b] dos carbonos de cada dupla que admite cis/trans;
  n: número de estereoisômeros DIFERENTES (enumeração completa, repetições eliminadas pelo SMILES canônico);
  meso: quantos deles são meso (têm centros de quiralidade, mas são iguais à própria imagem no espelho);
  quirais: quantos são quirais (formam pares de enantiômeros).
O nome em inglês é conferido no PubChem (estrutura sem estereoquímica); as respostas ficam em tools/quimica/pubchem-estereo.json (opção --offline usa só o arquivo).
Precisa do RDKit. Uso: python3 tools/quimica/gera-estereo.py"""
import json, os, re, subprocess, sys, urllib.parse
from rdkit import Chem, RDLogger
from rdkit.Chem.EnumerateStereoisomers import EnumerateStereoisomers, StereoEnumerationOptions
RDLogger.DisableLog('rdApp.*')
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
L = [
 ["butan-2-ol", "butan-2-ol", "CCC(C)O"], ["2-clorobutano", "2-chlorobutane", "CCC(C)Cl"], ["2-bromobutano", "2-bromobutane", "CCC(C)Br"],
 ["ácido 2-hidroxipropanoico (láctico)", "lactic acid", "CC(O)C(=O)O"], ["ácido 2-aminopropanoico (alanina)", "alanine", "CC(N)C(=O)O"],
 ["3-metil-hexano", "3-methylhexane", "CCCC(C)CC"], ["pentan-2-ol", "pentan-2-ol", "CCCC(C)O"], ["2-metilbutan-1-ol", "2-methylbutan-1-ol", "CCC(C)CO"],
 ["propan-2-ol", "propan-2-ol", "CC(C)O"], ["pentan-3-ol", "pentan-3-ol", "CCC(O)CC"], ["2-metilbutano", "2-methylbutane", "CCC(C)C"], ["butan-1-ol", "butan-1-ol", "CCCCO"],
 ["2-cloropropano", "2-chloropropane", "CC(C)Cl"], ["ácido propanoico", "propanoic acid", "CCC(=O)O"], ["3-metilpentano", "3-methylpentane", "CCC(C)CC"],
 ["bromoclorofluorometano", "bromochlorofluoromethane", "FC(Cl)Br"], ["1-cloro-1-fluoroetano", "1-chloro-1-fluoroethane", "CC(F)Cl"],
 ["ácido 2,3-di-hidroxibutanodioico (tartárico)", "tartaric acid", "OC(=O)C(O)C(O)C(=O)O"], ["2,3-diclorobutano", "2,3-dichlorobutane", "CC(Cl)C(C)Cl"],
 ["butano-2,3-diol", "butane-2,3-diol", "CC(O)C(C)O"], ["2,3-dibromobutano", "2,3-dibromobutane", "CC(Br)C(C)Br"],
 ["2-bromo-3-clorobutano", "2-bromo-3-chlorobutane", "CC(Br)C(C)Cl"], ["3-clorobutan-2-ol", "3-chlorobutan-2-ol", "CC(Cl)C(C)O"],
 ["2,3,4,5,6-penta-hidroxi-hexanal (glicose, cadeia aberta)", "aldehydo-D-glucose", "OCC(O)C(O)C(O)C(O)C=O"],
 ["2,3,4-tri-hidroxibutanal", "2,3,4-trihydroxybutanal", "OCC(O)C(O)C=O"], ["2,3-di-hidroxipropanal (gliceraldeído)", "glyceraldehyde", "OCC(O)C=O"],
 ["but-2-eno", "but-2-ene", "CC=CC"], ["pent-2-eno", "pent-2-ene", "CC=CCC"], ["hex-3-eno", "hex-3-ene", "CCC=CCC"], ["hex-2-eno", "hex-2-ene", "CC=CCCC"],
 ["1,2-dicloroeteno", "1,2-dichloroethene", "ClC=CCl"], ["1,2-dibromoeteno", "1,2-dibromoethene", "BrC=CBr"], ["1-cloropropeno", "1-chloroprop-1-ene", "CC=CCl"],
 ["ácido but-2-enodioico", "but-2-enedioic acid", "OC(=O)C=CC(=O)O"], ["ácido but-2-enoico", "but-2-enoic acid", "CC=CC(=O)O"],
 ["but-1-eno", "but-1-ene", "C=CCC"], ["propeno", "propene", "C=CC"], ["2-metilpropeno", "2-methylpropene", "C=C(C)C"], ["2-metilbut-2-eno", "2-methylbut-2-ene", "CC=C(C)C"],
 ["1,1-dicloroeteno", "1,1-dichloroethene", "C=C(Cl)Cl"], ["pent-1-eno", "pent-1-ene", "C=CCCC"], ["2,3-dimetilbut-2-eno", "2,3-dimethylbut-2-ene", "CC(C)=C(C)C"],
 ["3-metilpent-2-eno", "3-methylpent-2-ene", "CC=C(C)CC"],
 ["pent-3-en-2-ol", "pent-3-en-2-ol", "CC=CC(C)O"], ["4-cloropent-2-eno", "4-chloropent-2-ene", "CC=CC(C)Cl"], ["hexa-2,4-dieno", "hexa-2,4-diene", "CC=CC=CC"],
 ["hepta-2,5-dieno", "hepta-2,5-diene", "CC=CCC=CC"], ["3-metilpent-1-eno", "3-methylpent-1-ene", "C=CC(C)CC"], ["but-3-en-2-ol", "but-3-en-2-ol", "C=CC(C)O"],
]
ARQ = os.path.join(RAIZ, "tools", "quimica", "pubchem-estereo.json")
cache = json.load(open(ARQ)) if os.path.exists(ARQ) else {}
def plano(s):
    m = Chem.MolFromSmiles(s); Chem.RemoveStereochemistry(m); return Chem.MolToSmiles(m)
def busca(nome):
    if nome in cache: return cache[nome]
    if "--offline" in sys.argv: return None
    url = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + urllib.parse.quote(nome) + "/property/SMILES,ConnectivitySMILES,IUPACName/JSON"
    r = subprocess.run(["curl", "-sS", "-m", "40", "-A", "curl", url], capture_output=True, text=True)
    try: p = json.loads(r.stdout)["PropertyTable"]["Properties"][0]
    except Exception: return None
    cache[nome] = {"cid": p.get("CID"), "smiles": p.get("ConnectivitySMILES") or p.get("SMILES"), "iupac": p.get("IUPACName")}
    return cache[nome]
linhas, ruins, sem = [], [], []
for pt, en, smi in L:
    m = Chem.MolFromSmiles(smi)
    assert [a.GetSymbol() for a in m.GetAtoms()] and m.GetNumAtoms() == len(re.findall(r"Cl|Br|[CNOFSIP]", smi)), smi
    r = busca(en)
    if r is None: sem.append(en)
    elif plano(r["smiles"]) != plano(smi): ruins.append((pt, en, r["smiles"]))
    cen = [i for i, _ in Chem.FindMolChiralCenters(m, includeUnassigned=True, useLegacyImplementation=False)]
    Chem.FindPotentialStereoBonds(m)
    dup = [[b.GetBeginAtomIdx(), b.GetEndAtomIdx()] for b in m.GetBonds() if b.GetBondType() == Chem.BondType.DOUBLE and b.GetStereo() == Chem.BondStereo.STEREOANY]
    iso = sorted({Chem.MolToSmiles(x) for x in EnumerateStereoisomers(Chem.MolFromSmiles(smi), options=StereoEnumerationOptions(unique=True, onlyUnassigned=False))})
    def espelho(s):
        mm = Chem.MolFromSmiles(s)
        for a in mm.GetAtoms():
            t = a.GetChiralTag()
            if t == Chem.ChiralType.CHI_TETRAHEDRAL_CW: a.SetChiralTag(Chem.ChiralType.CHI_TETRAHEDRAL_CCW)
            elif t == Chem.ChiralType.CHI_TETRAHEDRAL_CCW: a.SetChiralTag(Chem.ChiralType.CHI_TETRAHEDRAL_CW)
        return Chem.MolToSmiles(mm)
    aq = [s for s in iso if espelho(s) == s]
    meso = len(aq) if cen else 0
    assert all(espelho(s) in iso for s in iso), smi
    assert len(iso) <= 2 ** (len(cen) + len(dup)), smi
    linhas.append(f'    {json.dumps(pt, ensure_ascii=False)}: {{ smi: "{smi}", c: {json.dumps(cen)}, d: {json.dumps(dup)}, n: {len(iso)}, meso: {meso}, quirais: {len(iso) - len(aq)} }},')
json.dump(cache, open(ARQ, "w"), ensure_ascii=False, indent=1)
bloco = "/*EST-INI*/ /* GERADO por tools/quimica/gera-estereo.py (RDKit): não editar à mão. c: carbonos quirais (índices dos átomos no SMILES); d: duplas com cis/trans; n: estereoisômeros diferentes; meso; quirais */\n  SIM.org.EST = {\n" + "\n".join(linhas) + "\n  };\n  /*EST-FIM*/"
arq = os.path.join(RAIZ, "assets", "sims", "quimica", "organica.js"); t = open(arq, encoding="utf-8").read()
if "/*EST-INI*/" in t: t = re.sub(r"/\*EST-INI\*/.*?/\*EST-FIM\*/", lambda _: bloco, t, flags=re.S)
else: t = t.replace("  /*PROP-INI*/", "  " + bloco + "\n\n  /*PROP-INI*/", 1)
open(arq, "w", encoding="utf-8").write(t)
print(len(L), "compostos;", "PubChem: diferentes", len(ruins), ruins, "; sem resposta", len(sem), sem)
