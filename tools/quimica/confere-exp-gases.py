#!/usr/bin/env python3
"""Confere em Python os números dos experimentos de gases da Química (EQ01 a EQ04). Uso: python3 tools/quimica/confere-exp-gases.py
Imprime os valores que os temas e o teste tests/texpq.js usam."""
import math

# EQ01: lei de Graham
for a, b in [(2, 32), (28, 44), (4, 40)]:
    print(f"Graham M_A={a} M_B={b}: taxa A/B = {math.sqrt(b / a):.4f}")

# EQ03: distribuição de velocidades em 2D, f(v) = (v/s²) exp(−v²/2s²): ⟨v⟩ = s·√(π/2), v_rms = s·√2
s = 1.0
n = 200000; h = 12 / n
m1 = sum(((i + .5) * h) ** 2 / s**2 * math.exp(-((i + .5) * h) ** 2 / (2 * s * s)) * h for i in range(n))
m2 = sum(((i + .5) * h) ** 3 / s**2 * math.exp(-((i + .5) * h) ** 2 / (2 * s * s)) * h for i in range(n))
print(f"2D: <v>/v_rms = {m1 / math.sqrt(m2):.5f}  (√π/2 = {math.sqrt(math.pi) / 2:.5f})")
R = 8.314
for nome, M, T in [("N2", 28, 300), ("H2", 2, 300), ("CO2", 44, 300)]:
    k = R * T / (M / 1000)
    print(f"{nome} a {T} K: v_p = {math.sqrt(2 * k):.1f}  v_média = {math.sqrt(8 * k / math.pi):.1f}  v_rms = {math.sqrt(3 * k):.1f} m/s")

# EQ04: segundo coeficiente do virial de Lennard-Jones em 2D, com corte em rc = 2,5: B2 = −π ∫ (e^(−u/T) − 1) r dr
def B2(T, rc=2.5, n=400000):
    h = rc / n; s = 0.0
    for i in range(n):
        x = (i + .5) * h; u = 4 * (x**-12 - x**-6)
        s += (math.exp(-u / T) - 1) * x * h
    return -math.pi * s
for T in (0.8, 1.0, 1.5, 2.0, 3.0, 4.0):
    print(f"B2({T}) = {B2(T):+.4f}")
lo, hi = 1.0, 6.0
for _ in range(50):
    m = (lo + hi) / 2
    if B2(m, n=40000) < 0: lo = m
    else: hi = m
print(f"temperatura de Boyle (2D, corte 2,5): T* = {lo:.3f}")
