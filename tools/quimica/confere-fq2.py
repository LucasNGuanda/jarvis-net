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
print("F05 leis de velocidade")
print("  tabela: k = %.2f L²/(mol²·s)" % (2.0e-3 / (0.10 * 0.10**2)))
print("  k = 0,0231: meia-vida %.1f s; 20%%: %.1f s" % (math.log(2) / 0.0231, math.log(5) / (math.log(2) / 30)))
print("  laboratório ([A]0 = 1, k = 0,1): meias-vidas %.2f; %.2f; %.2f; em 10 s: %.3f; %.3f; %.3f" % (1 / 0.2, math.log(2) / 0.1, 1 / 0.1, max(0, 1 - 1), math.exp(-1), 1 / 2))
q = 0; seq = []
for _ in range(4): q = q / 4 + 400; seq.append(q)
print("  chefão: k %.3f; 8 h: %.0f mg; 50 mg em %.0f h; depois das doses: %s; limite %.1f; antes %.1f; meia-vida 8 h: %.0f; 16 em 16 h: %.1f" % (math.log(2) / 4, 400 / 4, 4 * math.log2(8), seq, 400 / (1 - 1 / 4), 400 / (1 - 1 / 4) / 4, 400 / (1 - 1 / 2), 400 / (1 - 1 / 4)))
print("F06 equilíbrio")
K = 6.53e-3
x1 = (-K + math.sqrt(K * K + 16 * 0.1 * K)) / 8; x2 = (-K + math.sqrt(K * K + 8 * 0.1 * K)) / 4
print("  laboratório A ⇌ B: kd 0,30, ki 0,10: K = %.2f; fração de B %.3f; tempo característico %.2f s" % (0.3 / 0.1, 0.3 / 0.4, 1 / 0.4))
r = math.sqrt(50); x = r / (2 + r)
print("  H2 + I2, 1,00 mol/L cada, Kc 50: x = %.4f; [HI] = %.3f; [H2] = %.3f; confere K = %.1f" % (x, 2 * x, 1 - x, (2 * x)**2 / (1 - x)**2))
print("  N2O4: x = %.5f; alfa %.1f%%; [NO2] %.4f; [N2O4] %.4f; n %.4f; P %.3f atm; sem dissociar %.3f; Kp %.4f" % (x1, 100 * x1 / 0.1, 2 * x1, 0.1 - x1, 0.1 + x1, (0.1 + x1) * 0.082 * 298, 0.1 * 0.082 * 298, K * 0.082 * 298))
print("  dobrando o volume: Q = %.3e (K/2 = %.3e); x = %.5f; alfa %.1f%%; [NO2] novo %.4f" % ((x1)**2 / ((0.1 - x1) / 2), K / 2, x2, 100 * x2 / 0.1, x2))
