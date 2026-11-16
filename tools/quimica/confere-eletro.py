#!/usr/bin/env python3
"""Confere a eletroquímica (G01 a G04): (1) cada E° de SIM.ELETRO (M e T) e cada massa molar contra tools/quimica/dadosG.json; (2) números fixos dos temas."""
import json, subprocess, math, os, re, sys
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
d = json.load(open(os.path.join(RAIZ, "tools/quimica/dadosG.json")))
js = "global.window={};global.D={};" + open(os.path.join(RAIZ, "assets/sims/quimica/eletro.js")).read() + """;const E=window.SIM.ELETRO;
console.log(JSON.stringify({M:E.M,T:E.T,dan:E.pilha('Zn','Cu'),alag:E.pilha('Al','Ag'),n1:E.nernst('Zn','Cu',1,0.01),n2:E.nernst('Zn','Cu',0.01,1),n3:E.nernst('Zn','Ag',0.1,0.01),f1:E.faraday('Cu',2,1800),f2:E.faraday('Ag',2,1800),f3:E.faraday('Cr',5,3600)}))"""
T = json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)
norm = lambda s: re.sub(r"[\s^]", "", s).replace("->", ">")
pot = {norm(k): [e["valor"] for e in v if e and isinstance(e.get("valor"), (int, float))] for k, v in d["potenciais"].items()}
falhas = 0; n = 0
def confere(chave, E, onde):
    global falhas, n
    n += 1; vs = pot.get(norm(chave))
    if not vs: print("FALHA sem fonte:", onde, chave); falhas += 1; return
    if not any(abs(round(v, 2) - E) < 0.0051 for v in vs): print("FALHA", onde, chave, E, "fontes:", vs); falhas += 1
for k, m in T["M"].items(): confere(f"{k}{m[2] if m[2] > 1 else ''}+ + {m[2] if m[2] > 1 else ''}e- -> {k}", m[3], "M")
for ce, txt, E in T["T"]: confere(ce.replace(" e-", "e-").replace("2 H", "2H").replace("4 H", "4H").replace("8 H", "8H").replace("2 OH", "2OH").replace("4 OH", "4OH").replace("2 I-", "2I-").replace("2 Br-", "2Br-").replace("2 Cl-", "2Cl-").replace("2 F-", "2F-"), E, "T")
ma = {k: v[0]["valor"] for k, v in d["massas"].items()}
for k, m in T["M"].items():
    n += 1
    if abs(m[4] - ma[k]) > 0.45: print("FALHA massa", k, m[4], ma[k]); falhas += 1
print(f"dados: {n} valores conferidos contra dadosG.json; falhas: {falhas}")
F, R = 96485, 8.314
def perto(a, b, t=1e-9): return abs(a - b) <= t * max(1, abs(b))
c = [("Daniell E°", T["dan"]["E0"], 0.34 + 0.76), ("Al|Ag E°", T["alag"]["E0"], 0.80 + 1.66), ("Al|Ag n", T["alag"]["n"], 3),
     ("Nernst Zn|Cu, [Cu2+] = 0,01", T["n1"]["E"], 1.10 - R * 298.15 / (2 * F) * math.log(100)), ("Nernst Zn|Cu, [Zn2+] = 0,01", T["n2"]["E"], 1.10 + R * 298.15 / (2 * F) * math.log(100)),
     ("Nernst Zn|Ag", T["n3"]["E"], 1.56 - R * 298.15 / (2 * F) * math.log(0.1 / 0.01 ** 2)), ("Faraday Cu 2 A 30 min", T["f1"]["m"], 2 * 1800 / F / 2 * 63.5), ("Faraday Ag", T["f2"]["m"], 2 * 1800 / F * 108), ("Faraday Cr 5 A 1 h", T["f3"]["m"], 5 * 3600 / F / 3 * 52)]
for nome, a, b in c:
    okk = perto(a, b, 1e-9); falhas += not okk; print(f"  {'ok   ' if okk else 'FALHA'} {nome}: site {a:.5f}; Python {b:.5f}")
print("fator de Nernst a 25 °C:", round(R * 298.15 / F * math.log(10), 5), "V (fontes: 0,05916 e 0,0592)")
print("FALHAS:", falhas); sys.exit(1 if falhas else 0)
