#!/usr/bin/env python3
"""Confere, fora do navegador, os números dos laboratórios e dos exemplos fixos do módulo E (soluções). Uso: python3 tools/quimica/confere-solucoes.py
As tabelas são as de tools/quimica/dadosE.json (as mesmas que o site usa em SIM.SOLUB)."""
import json, os
D = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "dadosE.json"), encoding="utf8"))
SOL = {k: v["g_por_100mL"] for k, v in D["solubilidade"]["sais"].items()}
def S(sal, T):
    pts = sorted((int(t), v) for t, v in SOL[sal].items() if v is not None)
    T = max(pts[0][0], min(pts[-1][0], T))
    for (a, va), (b, vb) in zip(pts, pts[1:]):
        if T <= b: return va + (vb - va) * (T - a) / (b - a)
    return pts[-1][1]
print("E05 solubilidade (g por 100 mL de água, da fonte)")
print("  KNO3: 20 °C %.1f; 60 °C %.1f; 80 °C %.1f; 70 °C (tabela) %.1f; 65 °C (interpolado) %.1f" % (S("KNO3", 20), S("KNO3", 60), S("KNO3", 80), S("KNO3", 70), S("KNO3", 65)))
print("  KCl a 70 °C (buraco na fonte, interpolado entre 60 e 80): %.2f" % S("KCl", 70))
print("  250 g de água a 20 °C dissolvem %.1f g de KNO3" % (S("KNO3", 20) * 2.5))
print("  80 g em 100 mL: a 60 °C insaturada (%.1f); a 20 °C cristalizam %.1f g" % (S("KNO3", 60), 80 - S("KNO3", 20)))
print("  saturada a 60 °C → 20 °C: cristalizam %.1f g" % (S("KNO3", 60) - S("KNO3", 20)))
print("  263,2 g de solução saturada a 20 °C: %.1f g de sal" % (263.2 * S("KNO3", 20) / (100 + S("KNO3", 20))))
print("  chute: sal em 100 g de solução saturada a 20 °C: %.1f g" % (100 * 31.6 / 131.6))
a = 100 * 100 / S("KNO3", 80)
print("  chefão: água %.1f g; NaCl que cabe a 80 °C %.1f g; KNO3 que fica a 0 °C %.2f g; cristais %.1f g; NaCl que cabe a 0 °C %.1f g; com o dobro de água: ficam %.1f, cristais %.1f; razão das solubilidades do KNO3 %.1f" % (a, S("NaCl", 80) * a / 100, S("KNO3", 0) * a / 100, 100 - S("KNO3", 0) * a / 100, S("NaCl", 0) * a / 100, S("KNO3", 0) * 2 * a / 100, 100 - S("KNO3", 0) * 2 * a / 100, S("KNO3", 80) / S("KNO3", 0)))
print("  Henry: CO2 a 4 atm: %.3f mol/L = %.2f g/L; razão kH(CO2)/kH(O2) = %.0f" % (0.034 * 4, 0.034 * 4 * 44, 0.034 / 0.0013))
print("E06 concentração, diluição e mistura")
print("  11,7 g de NaCl em 500 mL: %.1f g/L; %.3f mol/L" % (11.7 / 0.5, 11.7 / 58.5 / 0.5))
print("  50 mL de 2,0 mol/L a 250 mL: %.2f mol/L; 100 mL de 2,0 + 300 mL de água: %.2f mol/L, %.2f g/L de NaCl, %.3f mol, %.1f g" % (2 * 50 / 250, 2 * 100 / 400, 2 * 100 / 400 * 58.5, 0.2, 0.2 * 58.5))
print("  200 mL a 1,0 + 300 mL a 3,0: %.2f mol/L" % ((1 * 200 + 3 * 300) / 500))
print("  título 20%%, d 1,2: %.0f g/L; NaOH: %.1f mol/L; H2SO4 49%%, d 1,4: %.1f mol/L" % (1000 * 1.2 * 0.2, 240 / 40, 1000 * 1.4 * 0.49 / 98))
print("  soro: 500 mL → %.1f g; %.3f mol/L; estoque 200 g/L: %.1f mL; mistura 300 mL a 9 g/L + 200 mL a 30 g/L: %.1f g/L; rótulo errado: %.3f g em 500 mL (faltam %.2f g)" % (4.5, 9 / 58.5, 9 * 500 / 200, (9 * 0.3 + 30 * 0.2) / 0.5, 0.154 * 0.5, 4.5 - 0.154 * 0.5))
import math
print("E07 titulação (25,0 mL de ácido 0,100 mol/L com NaOH 0,100 mol/L; Kw = 1e-14; pKa 4,756)")
def ph(Ka, Vb, Ca=0.1, Va=25, Cb=0.1):
    V = (Va + Vb) / 1000; na = Ca * Va / 1000; nb = Cb * Vb / 1000
    if Ka is None:
        d = (na - nb) / V; return -math.log10((d + math.sqrt(d * d + 4e-14)) / 2)
    C = na / V; Na = nb / V; lo, hi = -14.5, 0.5
    for _ in range(80):
        m = (lo + hi) / 2; x = 10 ** m
        if x + Na - 1e-14 / x - C * Ka / (Ka + x) > 0: hi = m
        else: lo = m
    return -(lo + hi) / 2
print("  HCl: " + "; ".join("%s mL %.2f" % (v, ph(None, v)) for v in (0, 12.5, 24.95, 25, 25.05)))
print("  acético: " + "; ".join("%s mL %.2f" % (v, ph(10 ** -4.756, v)) for v in (0, 12.5, 25, 25.05)))
print("  chefão: biftalato %.5f mol; NaOH %.3f mol/L; vinagre %.3f mol/L = %.2f g/100 mL; com o rótulo: %.2f; passando 0,5 mL: %.2f" % (0.816 / 204, 0.816 / 204 / 0.020, 0.2 * 17.5 / 10, 0.2 * 17.5 / 10 * 60 / 10, 0.25 * 17.5 / 10 * 6, 0.2 * 18 / 10 * 6))
print("E08 coligativas (água: Kf 1,86; Kb 0,512; P° 23,8 mmHg a 25 °C)")
def col(W, i):
    n = W * i; x = n / (n + 1000 / 18); return -1.86 * n, 100 + 0.512 * n, 23.8 * (1 - x), n * 0.082 * 298
for W, i in [(1, 1), (1, 2), (0.154, 2), (0.5, 1)]: print("  W = %s, i = %s: congela %.2f °C; ferve %.2f °C; %.2f mmHg; %.1f atm" % ((W, i) + col(W, i)))
print("  crioscopia: 2,56 g em 100 g de benzeno, ΔT 1,024: M = %.0f g/mol" % (2.56 / ((1.024 / 5.12) * 0.1)))
W = 35.1 / 58.5; i = 2.01 / (1.86 * W)
print("  chefão: W %.3f; ideal %.2f °C; i %.2f; ebulição %.2f °C; π %.1f atm (%.0f m de água); x %.4f; P %.2f mmHg" % (W, -1.86 * W * 2, i, 100 + 0.512 * W * 1.8, 1.8 * W * 0.082 * 298, 1.8 * W * 0.082 * 298 * 10.33, 1.08 / (1.08 + 1000 / 18), 23.8 * (1 - 1.08 / (1.08 + 1000 / 18))))
