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
