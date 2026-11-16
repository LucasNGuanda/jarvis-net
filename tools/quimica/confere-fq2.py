#!/usr/bin/env python3
"""Confere, fora do navegador, os números dos exemplos fixos, dos chefões e dos laboratórios do módulo F (Físico-química II). Uso: python3 tools/quimica/confere-fq2.py"""
import math
R = 8.31
def kk(Ea, T1, T2, r=R): return math.exp(Ea * 1000 / r * (1 / T1 - 1 / T2))
print("F04 Arrhenius")
print("  Ea 50 kJ/mol, 300 -> 310 K: %.3f (R = 8,31) e %.3f (R = 8,314); Ea 100: %.2f" % (kk(50, 300, 310), kk(50, 300, 310, 8.314), kk(100, 300, 310)))
print("  dobrar de 300 a 310 K: Ea = %.1f kJ/mol; triplicar: %.1f" % (R * math.log(2) / (1 / 300 - 1 / 310) / 1000, R * math.log(3) / (1 / 300 - 1 / 310) / 1000))
print("  choques: raiz(310/300) = %.4f" % math.sqrt(310 / 300))
print("  chefão: 298 -> 278 K: %.2f; dura %.0f dias; 298 -> 255 K: %.1f; dura %.0f dias; catalisador 60 -> 40 a 298 K: %.0f; a 300 K com 20 kJ: %.0f" % (kk(60, 278, 298), 3 * kk(60, 278, 298), kk(60, 255, 298), 3 * kk(60, 255, 298), math.exp(20000 / (R * 298)), math.exp(20000 / (R * 300))))
