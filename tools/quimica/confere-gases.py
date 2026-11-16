#!/usr/bin/env python3
"""Confere, fora do navegador, os números dos laboratórios e dos exemplos fixos do módulo E (gases). Uso: python3 tools/quimica/confere-gases.py"""
R = 0.082
P = lambda n, T, V: n * R * T / V
V = lambda n, T, P_: n * R * T / P_
print("E01 pistão")
print("  1 mol, 273 K, 1 atm → V = %.2f L" % V(1, 273, 1))
print("  1 mol, 300 K, 24,6 L → P = %.3f atm" % P(1, 300, 24.6))
print("  Boyle: 12,3 L → %.3f atm (dobra)" % P(1, 300, 12.3))
print("  Charles: 600 K a 1 atm → %.1f L (dobra)" % V(1, 600, 1))
print("  Gay-Lussac: 600 K em 24,6 L → %.3f atm (dobra)" % P(1, 600, 24.6))
print("  Avogadro: 2 mol a 1 atm e 300 K → %.1f L (dobra)" % V(2, 300, 1))
print("E01 exemplos e chefão")
print("  densidade do CO2 a 1 atm e 300 K: %.3f g/L" % (44 / (R * 300)))
print("  volume molar: 0 °C %.2f L; 25 °C %.2f L" % (R * 273, R * 298))
n = 1.00 * 2460 / (R * 300); V2 = n * R * 220 / 0.100
print("  balão: n = %.1f mol; m = %.0f g; V2 = %.0f L (%.2f vezes); ar deslocado %.0f g; carga %.0f g; d(He) %.3f; d(ar) %.2f; rígido %.3f atm; com °C: %.0f L" % (n, 4 * n, V2, V2 / 2460, 29 * n, 29 * n - 4 * n - 1500, 4 / (R * 300), 29 / (R * 300), 220 / 300, 2460 * 10 * (-53) / 27))
import math
print("E02 velocidades (v_rms = raiz(3RT/M), R = 8,314 J/(mol·K))")
for g, M in [("H2", 2), ("He", 4), ("N2", 28), ("O2", 32), ("CO2", 44)]: print("  %-3s 300 K: %.0f m/s" % (g, math.sqrt(3 * 8.314 * 300 / (M / 1000))))
print("  razões da distribuição de Maxwell: 3D 1 : %.3f : %.3f ; 2D 1 : %.3f : %.3f ; v_rms/v_média 2D = %.3f" % (math.sqrt(4 / math.pi), math.sqrt(1.5), math.sqrt(math.pi / 2), math.sqrt(2), math.sqrt(2) / math.sqrt(math.pi / 2)))
VDW = {"He": (0.0346, 0.0238), "H2": (0.2476, 0.02661), "N2": (1.37, 0.0387), "CH4": (2.283, 0.04278), "CO2": (3.6, 0.04267), "NH3": (4.225, 0.0371)}
def vdw(g, T, Vm):
    a = VDW[g][0] / 1.01325; b = VDW[g][1]; Pi = R * T / Vm; Pr = R * T / (Vm - b) - a / Vm**2
    return Pi, Pr, Pr * Vm / (R * T), 8 * a / (27 * R * b)
print("E02 van der Waals")
for g, T, Vm in [("CO2", 320, 0.2), ("He", 300, 0.2), ("CO2", 320, 50), ("He", 300, 50), ("NH3", 430, 50), ("N2", 300, 0.1)]:
    print("  %-3s %d K, Vm %.2f L: ideal %.2f atm; real %.2f atm; Z = %.3f; Tc do modelo %.0f K" % ((g, T, Vm) + vdw(g, T, Vm)))
print("E03 misturas")
def mist(nA, MA, nB, MB, T, V):
    n = nA + nB; PA = nA * R * T / V; PB = nB * R * T / V; M = (nA * MA + nB * MB) / n
    return PA, PB, PA + PB, nA / n, nB / n, M, (PA + PB) * M / (R * T)
print("  1 + 1 mol, 300 K, 24,6 L: PA %.2f PB %.2f P %.2f xA %.2f xB %.2f M %.1f d %.2f" % mist(1, 28, 1, 32, 300, 24.6))
print("  3 N2 + 1 O2, 300 K, 49,2 L: PA %.2f PB %.2f P %.2f xA %.2f xB %.2f M %.1f d %.2f" % mist(3, 28, 1, 32, 300, 49.2))
print("  ar modelo 80%% N2 + 20%% O2: M = %.1f g/mol" % (0.8 * 28 + 0.2 * 32))
print("  H2 sobre água a 25 °C, 763,8 mmHg, 0,246 L: P seca %.1f mmHg; n = %.5f mol; sem descontar: %.5f mol" % (763.8 - 23.8, (740 / 760) * 0.246 / (R * 298), (763.8 / 760) * 0.246 / (R * 298)))
