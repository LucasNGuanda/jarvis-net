#!/usr/bin/env python3
"""Confere em Python as funções de onda do hidrogênio usadas no experimento EQ15 (orbitais em 3D) e os ângulos das geometrias do EQ16.
Uso: python3 tools/quimica/confere-exp-atomos.py   (unidades atômicas: a0 = 1)"""
import math

R = {
    (1, 0): lambda r: 2 * math.exp(-r),
    (2, 0): lambda r: (1 / (2 * math.sqrt(2))) * (2 - r) * math.exp(-r / 2),
    (2, 1): lambda r: (1 / (2 * math.sqrt(6))) * r * math.exp(-r / 2),
    (3, 0): lambda r: (2 / (81 * math.sqrt(3))) * (27 - 18 * r + 2 * r * r) * math.exp(-r / 3),
    (3, 1): lambda r: (8 / (27 * math.sqrt(6))) * r * (1 - r / 6) * math.exp(-r / 3),
    (3, 2): lambda r: (4 / (81 * math.sqrt(30))) * r * r * math.exp(-r / 3),
}
def integra(f, a=0.0, b=80.0, n=200000):
    h = (b - a) / n
    return sum(f(a + (i + .5) * h) for i in range(n)) * h
print("normalização ∫R²r²dr, raio médio ⟨r⟩ (teoria: (3n² − l(l+1))/2) e nós radiais (n − l − 1):")
for (n, l), f in R.items():
    norma = integra(lambda r: f(r) ** 2 * r * r)
    rm = integra(lambda r: f(r) ** 2 * r ** 3)
    nos = []; ant = f(1e-6)
    for i in range(1, 60000):
        r = i * 0.001; v = f(r)
        if ant * v < 0: nos.append(round(r, 2))
        ant = v
    print(f"  n={n} l={l}: norma = {norma:.6f}  <r> = {rm:.4f} (teoria {(3 * n * n - l * (l + 1)) / 2})  nós radiais em r = {nos}")

# partes angulares reais: ∫|Y|² dΩ = 1 (grade em θ, φ)
def Y(nome, x, y, z):
    c = {"s": 1 / math.sqrt(4 * math.pi), "pz": math.sqrt(3 / (4 * math.pi)) * z, "px": math.sqrt(3 / (4 * math.pi)) * x, "py": math.sqrt(3 / (4 * math.pi)) * y,
         "dz2": math.sqrt(5 / (16 * math.pi)) * (3 * z * z - 1), "dxz": math.sqrt(15 / (4 * math.pi)) * x * z, "dyz": math.sqrt(15 / (4 * math.pi)) * y * z,
         "dxy": math.sqrt(15 / (4 * math.pi)) * x * y, "dx2y2": math.sqrt(15 / (16 * math.pi)) * (x * x - y * y)}
    return c[nome]
print("normalização das partes angulares:")
for nome in ["s", "pz", "px", "py", "dz2", "dxz", "dyz", "dxy", "dx2y2"]:
    s = 0.0; nt, nf = 400, 400
    for i in range(nt):
        th = (i + .5) * math.pi / nt
        for j in range(nf):
            ph = (j + .5) * 2 * math.pi / nf
            x, y, z = math.sin(th) * math.cos(ph), math.sin(th) * math.sin(ph), math.cos(th)
            s += Y(nome, x, y, z) ** 2 * math.sin(th) * (math.pi / nt) * (2 * math.pi / nf)
    print(f"  {nome}: {s:.5f}")
print("ângulo tetraédrico: %.2f°" % math.degrees(math.acos(-1 / 3)))
