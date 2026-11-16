#!/usr/bin/env python3
"""Confere, no PubChem, que cada nome em inglês da tabela SIM.org.COMP (assets/sims/quimica/organica.js) corresponde à estrutura (SMILES) que o site desenha.
Consulta: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/<nome>/property/.../JSON. As respostas ficam em tools/quimica/pubchem-nomes.json; sem rede, o script
usa esse arquivo (opção --offline). A comparação é feita pelo SMILES canônico do RDKit, sem estereoquímica. Precisa do RDKit. Uso: python3 tools/quimica/confere-pubchem.py"""
import json, subprocess, os, sys, time, urllib.parse
from rdkit import Chem, RDLogger
RDLogger.DisableLog('rdApp.*')
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CACHE = os.path.join(RAIZ, "tools/quimica/pubchem-nomes.json")
js = "global.window={SIM:{}};" + open(os.path.join(RAIZ, "assets/sims/quimica/organica.js"), encoding="utf8").read() + ";console.log(JSON.stringify(window.SIM.org.COMP))"
COMP = json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)
cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
off = "--offline" in sys.argv
def can(s):
    m = Chem.MolFromSmiles(s)
    if m is None: return None
    Chem.RemoveStereochemistry(m); return Chem.MolToSmiles(m)
def busca(nome):
    if nome in cache or off: return cache.get(nome)
    url = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + urllib.parse.quote(nome) + "/property/SMILES,ConnectivitySMILES,IUPACName,MolecularFormula/JSON"
    r = subprocess.run(["curl", "-sS", "-m", "40", "-A", "curl", url], capture_output=True, text=True)
    try: p = json.loads(r.stdout)["PropertyTable"]["Properties"][0]
    except Exception: p = {"erro": r.stdout[:200] or r.stderr[:200]}
    cache[nome] = {"url": url, **p}; time.sleep(0.25); return cache[nome]
falhas = 0; semresp = []
for pt, en, smi in COMP:
    p = busca(en)
    if not p or "erro" in p: semresp.append(en); continue
    s2 = p.get("ConnectivitySMILES") or p.get("SMILES") or p.get("CanonicalSMILES")
    partes = {can(x) for x in (s2 or '').split('.')}   # alguns registros do PubChem repetem a mesma molécula várias vezes (ex.: propane-1,2,3-triol)
    if not (can(smi) == can(s2) or partes == {can(smi)}): falhas += 1; print(f"FALHA {pt} ({en}): site {smi} × PubChem {s2} [{p.get('IUPACName')}]")
json.dump(cache, open(CACHE, "w"), ensure_ascii=False, indent=1, sort_keys=True)
print(f"{len(COMP)} compostos; {len(COMP) - len(semresp)} conferidos no PubChem; diferenças: {falhas}")
if semresp: print("sem resposta do PubChem para:", ", ".join(semresp))
sys.exit(1 if falhas or semresp else 0)
