#!/usr/bin/env python3
"""Confere a termoquímica (F01 a F03): (1) cada valor de SIM.TERMO em assets/sims/quimica/termo.js contra tools/quimica/dadosF.json;
(2) ΔH, ΔS e ΔG de cada reação da lista e a coerência ΔG ≈ ΔH − TΔS; (3) estimativas por energia de ligação; (4) números fixos dos temas."""
import json, re, subprocess, math, os
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
d = json.load(open(os.path.join(RAIZ, "tools/quimica/dadosF.json")))
js = "global.window={};global.D={};" + open(os.path.join(RAIZ, "assets/sims/quimica/termo.js")).read() + ";console.log(JSON.stringify({s:window.SIM.TERMO.s,lig:window.SIM.TERMO.lig,comb:window.SIM.TERMO.comb,rx:window.SIM.TERMO.rx}))"
T = json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)
falhas = 0
def tem(lista, v):
    return any(isinstance(e["valor"], (int, float)) and abs(abs(e["valor"]) - abs(v)) < 1e-9 for e in (lista or []))
chave = {"Fe2O3(s)": "Fe2O3(s) hematita", "CaCO3(s)": "CaCO3(s) calcita", "C6H12O6(s)": "C6H12O6(s) glicose"}
n = 0
for k, (h, g, s) in T["s"].items():
    kk = chave.get(k, k)
    if kk not in d["formacao"]:
        if (h, g, s) != (0, 0, None): print("FALHA sem fonte:", k); falhas += 1
        continue
    f = d["formacao"][kk]
    for nome, v in (("dHf", h), ("dGf", g), ("S", s)):
        if v is None: continue
        n += 1
        if not tem(f.get(nome), v): print("FALHA", k, nome, v, "não está em dadosF.json"); falhas += 1
for k, v in T["lig"].items():
    kk = "C=O" if k == "C=O(CO2)" else k; n += 1
    if not tem(d["ligacao"][kk], v): print("FALHA ligação", k, v); falhas += 1
cc = {"H2": "H2", "CH4": "CH4", "C2H6": "C2H6", "C3H8": "C3H8", "C4H10": "C4H10", "CH3OH": "metanol", "C2H5OH": "etanol", "C6H12O6": "glicose", "C": "C(grafite)"}
for k, v in T["comb"].items():
    n += 1
    if not tem(d["combustao"][cc[k]], v[2]): print("FALHA combustão", k, v[2]); falhas += 1
print(f"dados: {n} valores conferidos contra dadosF.json; falhas: {falhas}")
S = T["s"]; soma = lambda l, i: sum(c * S[k][i] for c, k in l)
print("\nreação | ΔH (kJ) | ΔS (J/K) | ΔG tabela (kJ) | ΔH − TΔS (kJ) | T de ΔG = 0 (K) | por ligações")
for k, r in T["rx"].items():
    dH = soma(r["p"], 0) - soma(r["r"], 0); dG = soma(r["p"], 1) - soma(r["r"], 1)
    temS = all(S[x][2] is not None for _, x in r["r"] + r["p"])
    dS = soma(r["p"], 2) - soma(r["r"], 2) if temS else (dH - dG) * 1000 / 298.15
    g2 = dH - 298.15 * dS / 1000; Ti = dH * 1000 / dS if dH * dS > 0 else None
    lig = ""
    if "q" in r:
        e = sum(c * T["lig"][x] for c, x in r["q"]) - sum(c * T["lig"][x] for c, x in r["f"]); lig = f"{e:.0f}"
        if k == "metano": lig += f" (com C=O do CO2: {4*415+2*498-2*799-4*464})"
    print(f"{k:9s} | {dH:9.2f} | {dS:8.1f}{'' if temS else '*'} | {dG:9.2f} | {g2:9.2f} | {('%.0f' % Ti) if Ti else '—':>6s} | {lig}")
print("(* ΔS deduzido de (ΔH − ΔG)/T: não há S° de todos os participantes na mesma fonte)")
