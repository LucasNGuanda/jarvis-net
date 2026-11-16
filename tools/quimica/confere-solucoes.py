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
