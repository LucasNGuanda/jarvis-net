#!/usr/bin/env python3
"""Confere o equilíbrio iônico (F08 a F10): (1) cada constante de SIM.AB e SIM.KPS contra tools/quimica/dadosF.json; (2) o pH que o site calcula (bisseção no balanço
de carga) contra as raízes do polinômio do mesmo equilíbrio, achadas por numpy; (3) solubilidades, precipitação e íon comum, substituindo de volta no Kps."""
import json, subprocess, math, os, sys
import numpy as np
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
d = json.load(open(os.path.join(RAIZ, "tools/quimica/dadosF.json")))
casos = [["sol", "forteA", 0.01, 0], ["sol", "forteA", 1e-8, 0], ["sol", "forteB", 0.001, 0], ["sol", "fracoA", 0.1, 1.8e-5], ["sol", "fracoA", 1e-4, 1.8e-5], ["sol", "fracoB", 0.1, 1.8e-5], ["sol", "fracoA", 0.05, 4.9e-10],
         ["tam", 1.8e-5, 0.1, 0.1, 0], ["tam", 1.8e-5, 0.1, 0.1, 0.01], ["tam", 1.8e-5, 0.1, 0.1, -0.01], ["tam", 1.8e-5, 0, 0.1, 0], ["tam", 1e-14 / 1.8e-5, 0.1, 0, 0], ["tam", 1e-14 / 1.8e-5, 0.2, 0.1, 0], ["tam", 1.8e-5, 0.3, 0.1, 0.05]]
js = "global.window={};global.D={};" + open(os.path.join(RAIZ, "assets/sims/quimica/acidobase.js")).read() + """;const S=window.SIM,C=%s;
console.log(JSON.stringify({AB:S.AB,KPS:S.KPS,ph:C.map(c=>c[0]==='sol'?S.phSol(c[1],c[2],c[3]).pH:S.phTampao(c[1],c[2],c[3],1,c[4]).pH),
 s:Object.fromEntries(Object.keys(S.KPS).map(k=>[k,S.kps.s(k)])),pp:[['AgCl',1e-3,1e-3],['CaF2',1e-2,1e-2],['Ag2CrO4',1e-2,1e-3],['BaSO4',1e-6,1e-6],['MgOH2',1e-1,1e-3]].map(c=>[c,S.kps.precip(...c)]),
 ci:[['AgCl',0.1,'an'],['CaF2',0.1,'an'],['CaF2',0.1,'cat'],['Ag2CrO4',0.01,'an'],['MgOH2',1e-3,'an']].map(c=>[c,S.kps.comum(...c)])}))""" % json.dumps(casos)
T = json.loads(subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout)
falhas = 0
def tem(lista, v):
    return any(isinstance(e["valor"], (int, float)) and abs(e["valor"] - v) <= 1e-9 * abs(v) for e in (lista or []))
A = d["acidos"]; mapa = {"acetico": A["acetico"], "formico": A["formico"], "HF": A["fluoridrico"], "HCN": A["cianidrico"], "HClO": A["hipocloroso"], "HNO2": A["nitroso"], "carbonico1": A["carbonico"]["pKa1"], "carbonico2": A["carbonico"]["pKa2"], "fosforico1": A["fosforico"]["pKa1"], "fosforico2": A["fosforico"]["pKa2"], "fosforico3": A["fosforico"]["pKa3"]}
n = 0
for k, v in T["AB"]["Ka"].items():
    n += 1
    if not tem(mapa[k], v): print("FALHA Ka", k, v); falhas += 1
n += 1
if not tem(A["amonio"], T["AB"]["Kb"]["amonia"]): print("FALHA Kb amônia"); falhas += 1
for t, v in T["AB"]["Kw"].items():
    n += 1
    lista = d["agua"]["Kw"][f"{t} °C"] + d["agua"]["Kw"]["texto"]
    if not any(isinstance(e["valor"], (int, float)) and (abs(e["valor"] * 1e-14 - v) < 1e-9 * v or abs(e["valor"] - v) < 1e-9 * v) for e in lista): print("FALHA Kw", t, v); falhas += 1
ck = {"MgOH2": "Mg(OH)2", "CaOH2": "Ca(OH)2", "FeOH3": "Fe(OH)3"}
for k, v in T["KPS"].items():
    n += 1
    if not tem(d["kps"][ck.get(k, k)], v[5]): print("FALHA Kps", k, v[5]); falhas += 1
print(f"dados: {n} constantes conferidas contra dadosF.json; falhas: {falhas}")
def raiz(ca, cb, CT, Ka, Kw=1e-14):
    r = np.roots([1, Ka + cb - ca, (cb - ca) * Ka - Kw - CT * Ka, -Kw * Ka]); r = [x.real for x in r if abs(x.imag) < 1e-12 and x.real > 0]; return -math.log10(r[0])
print("\npH do site × pH pelas raízes do polinômio:")
for c, ph in zip(casos, T["ph"]):
    if c[0] == "sol":
        tipo, C, K = c[1:]
        if tipo == "forteA": ref = raiz(C, 0, 0, 1)
        elif tipo == "forteB": ref = raiz(0, C, 0, 1)
        elif tipo == "fracoA": ref = raiz(0, 0, C, K)
        else: ref = raiz(0, C, C, 1e-14 / K)   # base B total C: equivale ao par BH+/B só com a forma básica
    else:
        Ka, na, nb, f = c[1:]; ref = raiz(max(0, f), nb + max(0, -f), na + nb, Ka)
    okk = abs(ref - ph) < 2e-4; falhas += not okk
    print(f"  {'ok   ' if okk else 'FALHA'} {c} → site {ph:.4f}; polinômio {ref:.4f}")
print("\nsolubilidade em água pura (mol/L), e o produto de volta:")
for k, s in T["s"].items():
    a, b, K = T["KPS"][k][3:6]; p = (a * s) ** a * (b * s) ** b; okk = abs(p / K - 1) < 1e-9; falhas += not okk
    print(f"  {'ok   ' if okk else 'FALHA'} {k:8s} s = {s:.3e}")
print("\nprecipitação (concentrações finais devolvem o Kps):")
for c, r in T["pp"]:
    a, b, K = T["KPS"][c[0]][3:6]; p = r["c1"] ** a * r["c2"] ** b; okk = (abs(p / K - 1) < 1e-6) if r["ppt"] else (r["x"] == 0 and r["Q"] <= K); falhas += not okk
    print(f"  {'ok   ' if okk else 'FALHA'} {c}: Q = {r['Q']:.2e}; precipita {r['x']:.3e} mol/L; sobram {r['c1']:.3e} e {r['c2']:.3e}")
print("\níon comum (a solubilidade devolve o Kps):")
for c, s in T["ci"]:
    a, b, K = T["KPS"][c[0]][3:6]; p = (a * s) ** a * (c[1] + b * s) ** b if c[2] == "an" else (c[1] + a * s) ** a * (b * s) ** b; okk = abs(p / K - 1) < 1e-6; falhas += not okk
    print(f"  {'ok   ' if okk else 'FALHA'} {c}: s = {s:.3e} mol/L")
print("\nFALHAS:", falhas); sys.exit(1 if falhas else 0)
