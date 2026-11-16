#!/usr/bin/env python3
"""Prova do gerador de nomes (SIM.org.nome, em assets/sims/quimica/organica.js). Monta, por construção, todos os hidrocarbonetos de cadeia aberta com 4 a 8 carbonos
descritos como "cadeia de n carbonos + ramificações metil/etil" (inclusive descrições erradas, como 3-metilbutano), com nenhuma, uma dupla ou uma tripla em cada posição.
Para cada um: o RDKit dá a identidade da molécula (SMILES canônico) e o site dá o nome. Exige: (1) toda descrição da MESMA molécula recebe o MESMO nome;
(2) moléculas diferentes recebem nomes diferentes; (3) o número de alcanos distintos bate com a tabela de isômeros (dadosH.json): 2, 3, 5, 9, 18.
Precisa do RDKit. Uso: python3 tools/quimica/confere-nomes.py"""
import json, subprocess, os, sys, itertools
from rdkit import Chem, RDLogger
RDLogger.DisableLog('rdApp.*')
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
d = json.load(open(os.path.join(RAIZ, "tools/quimica/dadosH.json")))
tab = {int(k[1:]): v[0]["valor"] for k, v in d["alcanos_isomeros"].items() if k[0] == "C" and k[1:].isdigit()}
def monta(n, ins, subs):
    s = ""
    for i in range(1, n + 1):
        s += "C"
        for (p, t) in subs:
            if p == i: s += "(CC)" if t == "etil" else "(C)"
        for (p, o) in ins:
            if p == i and i < n: s += "#" if o == 3 else "="
    return s
desc = []
for total in range(4, 9):
    for n in range(2, total + 1):
        resto = total - n
        # ramificações: multiconjuntos de (posição interna, tipo) com soma de carbonos = resto, no máximo 2 por carbono
        pos = [(p, t) for p in range(1, n + 1) for t in ("metil", "etil")]
        for k in range(0, resto + 1):
            for comb in itertools.combinations_with_replacement(pos, k):
                if sum(1 if t == "metil" else 2 for _, t in comb) != resto: continue
                if any(sum(1 for q, _ in comb if q == p) > 2 for p in range(1, n + 1)): continue
                for ins in [[]] + [[(p, o)] for p in range(1, n) for o in (2, 3)]:
                    s = monta(n, ins, list(comb)); m = Chem.MolFromSmiles(s)
                    if m is None: continue   # valência impossível (ex.: tripla em carbono com ramificação)
                    desc.append((s, Chem.MolToSmiles(m), total, bool(ins)))
smis = sorted({x[0] for x in desc})
js = "global.window={SIM:{}};" + open(os.path.join(RAIZ, "assets/sims/quimica/organica.js"), encoding="utf8").read() + ";const o=window.SIM.org,r={};for(const s of %s){try{r[s]=o.nome(s)}catch(e){r[s]='ERRO '+e.message}};console.log(JSON.stringify(r))" % json.dumps(smis)
N = json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True, env={**os.environ, "NODE_OPTIONS": "--max-old-space-size=2048"}).stdout)
falhas = 0; por_mol = {}; semnome = set()
for s, can, total, ins in desc:
    nm = N[s]
    if nm is None or str(nm).startswith("ERRO"): semnome.add(can); continue
    por_mol.setdefault(can, set()).add(nm)
for can, nomes in por_mol.items():
    if len(nomes) > 1: falhas += 1; print("FALHA mesma molécula, nomes diferentes:", can, sorted(nomes))
inv = {}
for can, nomes in por_mol.items():
    for nm in nomes: inv.setdefault(nm, set()).add(can)
for nm, cs in inv.items():
    if len(cs) > 1: falhas += 1; print("FALHA mesmo nome, moléculas diferentes:", nm, sorted(cs))
print(f"{len(desc)} descrições, {len(por_mol)} moléculas distintas com nome; sem nome (fora do universo metil/etil): {len(semnome - set(por_mol))}")
for c in range(4, 9):
    alc = {can for s, can, total, ins in desc if total == c and not ins}
    comnome = {x for x in alc if x in por_mol}
    okk = len(alc) == tab[c] and len(comnome) == tab[c]; falhas += not okk
    print(f"  {'ok   ' if okk else 'FALHA'} C{c}: {len(alc)} alcanos construídos, {len(comnome)} com nome; tabela: {tab[c]}")
print("exemplos:", "; ".join(sorted(next(iter(v)) for k, v in por_mol.items())[:12]))
print("FALHAS:", falhas); sys.exit(1 if falhas else 0)
