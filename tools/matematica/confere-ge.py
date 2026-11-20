"""Confere as contas escritas à mão no módulo GE (Geometria). Rodar: python3 tools/matematica/confere-ge.py
Cada linha é uma afirmação do texto de um tema; se alguma falhar, o script sai com código 1.
A geometria é conferida POR COORDENADAS: monta-se a figura com pontos e mede-se (distância, ângulo, área),
em vez de repetir a fórmula que o texto usa. Sem biblioteca além da padrão."""
from fractions import Fraction as Fr
from math import gcd, sqrt, sin, cos, tan, atan2, acos, pi, hypot, radians, degrees, isclose
import random
import sys

falhas = 0
random.seed(20261120)


def ok(cond, msg):
    global falhas
    print(("ok " if cond else "FALHA ") + msg)
    falhas += 0 if cond else 1


def dist(p, q):
    return hypot(p[0] - q[0], p[1] - q[1])


def ang(a, v, b):
    """ângulo AVB em graus, de 0 a 180"""
    u = (a[0] - v[0], a[1] - v[1]); w = (b[0] - v[0], b[1] - v[1])
    return degrees(atan2(abs(u[0] * w[1] - u[1] * w[0]), u[0] * w[0] + u[1] * w[1]))


def area(ps):
    return abs(sum(ps[i][0] * ps[(i + 1) % len(ps)][1] - ps[i][1] * ps[(i + 1) % len(ps)][0] for i in range(len(ps)))) / 2


def polar(c, r, g):
    return (c[0] + r * cos(radians(g)), c[1] + r * sin(radians(g)))


def de_angs(a, b, c=1.0):
    """triângulo com ângulos a (em A) e b (em B) e lado AB = c"""
    cc = 180 - a - b
    return [(0.0, 0.0), (c, 0.0), polar((0, 0), c * sin(radians(b)) / sin(radians(cc)), a)]


def inter(a, b, c, d):
    r = (b[0] - a[0], b[1] - a[1]); s = (d[0] - c[0], d[1] - c[1]); den = r[0] * s[1] - r[1] * s[0]
    t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den
    return (a[0] + r[0] * t, a[1] + r[1] * t)


def incentro(a, b, c):
    la, lb, lc = dist(b, c), dist(a, c), dist(a, b); p = la + lb + lc
    return ((la * a[0] + lb * b[0] + lc * c[0]) / p, (la * a[1] + lb * b[1] + lc * c[1]) / p)


def perto(x, y, tol=1e-7):
    return abs(x - y) <= tol * max(1.0, abs(x), abs(y))


def tri_sorteado():
    while True:
        ps = [(random.uniform(0, 10), random.uniform(0, 10)) for _ in range(3)]
        if area(ps) > 1:
            return ps


# ---------- GP01 ----------
ok(all(perto(sum(ang(t[(i + 1) % 3], t[i], t[(i + 2) % 3]) for i in range(3)), 180) for t in [tri_sorteado() for _ in range(500)]), "GP01 teorema 3: em 500 triângulos sorteados, os três ângulos medidos por coordenadas somam 180°")
def externo_(t):
    a, b, c = t; e = (b[0] + (b[0] - a[0]), b[1] + (b[1] - a[1]))  # prolonga AB além de B
    return perto(ang(e, b, c), ang(b, a, c) + ang(a, c, b))
ok(all(externo_(tri_sorteado()) for _ in range(500)), "GP01 teorema 4: em 500 triângulos, o ângulo externo em B (medido) é a soma dos internos em A e C")
ok(all(perto(ang(*[de_angs(a, b)[i] for i in (1, 0, 2)]), a) and perto(ang(*[de_angs(a, b)[i] for i in (0, 1, 2)]), b) for a in range(20, 100, 7) for b in range(20, 75, 6)), "GP01 figuras: o triângulo construído a partir de dois ângulos tem mesmo esses ângulos (é o que garante a escala)")
def bico_(a, b):
    h = 1.5; pa = (0, h); v = ((h / 2) / tan(radians(a)), h / 2); pb = (v[0] - (h / 2) / tan(radians(b)), 0)
    return perto(ang((1, h), pa, v), a) and perto(ang((pb[0] + 1, 0), pb, v), b) and perto(ang(pa, v, pb), a + b)
ok(all(bico_(a, b) for a in range(30, 65, 5) for b in range(25, 55, 5)), "GP01 exemplo 3 e exercício 12: no bico entre paralelas, o ângulo medido é a + b (e os ângulos desenhados são os do enunciado)")
def bis_(a, b):
    t = de_angs(a, b); i = incentro(*t)
    return perto(ang(t[1], i, t[2]), 90 + a / 2) and perto(ang(t[0], t[1], i), b / 2)
ok(all(bis_(a, b) for a in range(40, 101, 10) for b in range(30, 61, 10)), "GP01 exercício 13 e chefão (c): o ângulo BIC medido com o incentro é 90° + A/2")
def rel_(h, m):
    gh = 90 - (30 * h + 0.5 * m); gm = 90 - 6 * m
    med = ang(polar((0, 0), 1, gh), (0, 0), polar((0, 0), 1, gm)); d = abs(30 * h - 5.5 * m)
    return perto(med, min(d, 360 - d), 1e-6)
ok(all(rel_(h, m) for h in range(1, 12) for m in range(0, 60, 10)) and min(abs(90 + 15 - 180), 360) == 75, "GP01 exercício 14: o ângulo entre os ponteiros, medido no desenho, é |30h − 5,5m| (ou o replemento); às 3 h 30 min, 75°")
ok(90 - 35 == 55 and 180 - 125 == 55 and Fr(180 * 3, 4) == 135 and 180 - 50 - 60 == 70 and 45 + 65 == 110 and Fr(180 - 40, 2) == 70 and Fr(180 * 3, 6) == 90 and Fr(70 + 50, 2) == 60 and 35 + 45 == 80 and 90 + 40 == 130 and 180 - 50 - 70 == 60, "GP01 exercícios (primeiro acesso): 55°; 55°; 135°; 70°; 110°; 70°; 90°; 60°; 80°; 130°; 60°")
ok(3 * 30 - 10 == 30 + 50 == 80 and (30 + 10) + 60 + (90 - 10) == 180 and 180 - 65 == 115 and 40 + 30 == 70, "GP01 exercício 3 e exemplos (primeiro acesso): opostos pelo vértice de 80°; ângulos 40°, 60° e 80°; 115°; bico de 70°")
est_ = [polar((0, 0), 1, 90 + 72 * i) for i in range(5)]
ok(all(perto(ang(est_[(i + 2) % 5], est_[i], est_[(i + 3) % 5]), 36) for i in range(5)) and 5 * 36 == 180 and Fr(180, 11) == 16 + Fr(4, 11) and perto(6 * 180 / 11, 90 + 0.5 * 180 / 11) and round(4 / 11 * 60) == 22, "GP01 chefão (d) e (e): cada ponta da estrela regular mede 36° (5 · 36 = 180); ponteiros sobrepostos às 3 h e 180/11 min")

print("\n" + ("tudo certo" if not falhas else f"{falhas} FALHA(S)"))
sys.exit(1 if falhas else 0)
