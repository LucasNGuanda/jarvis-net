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

# ---------- GP02 ----------
def em_(a, b, t): return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
def tales_():
    y0, y1, y2 = 5.0, random.uniform(1, 4), 0.0
    a, c = (random.uniform(0, 10), y0), (random.uniform(0, 10), y2); d, f = (random.uniform(0, 10), y0), (random.uniform(0, 10), y2)
    b = inter(a, c, (0, y1), (1, y1)); e = inter(d, f, (0, y1), (1, y1))
    return perto(dist(a, b) / dist(b, c), dist(d, e) / dist(e, f))
ok(all(tales_() for _ in range(500)), "GP02 teorema 1: em 500 feixes sorteados (três paralelas, duas transversais), a razão dos segmentos é a mesma nas duas transversais")
def par_():
    a, b, c = tri_sorteado(); k = random.uniform(0.1, 0.9); d = em_(a, b, k); e = inter(d, (d[0] + c[0] - b[0], d[1] + c[1] - b[1]), a, c)
    return perto(dist(a, e) / dist(a, c), k) and perto(dist(d, e) / dist(b, c), k) and perto(area([a, d, e]) / area([a, b, c]), k * k) and perto(dist(a, d) / dist(d, b), dist(a, e) / dist(e, c))
ok(all(par_() for _ in range(500)), "GP02 teoremas 1, 3 e 4: em 500 triângulos, a paralela a BC por D corta AC na mesma razão, os lados ficam na razão k e a área na razão k²")
def bis2_():
    a, b, c = tri_sorteado(); i = incentro(a, b, c); d = inter(a, i, b, c)
    return perto(dist(b, d) / dist(d, c), dist(a, b) / dist(a, c)) and perto(ang(b, a, d), ang(d, a, c))
ok(all(bis2_() for _ in range(500)) and Fr(10 * 6, 15) == 4, "GP02 teorema 2 e exercício 10: a bissetriz (pelo incentro) divide BC na razão AB/AC em 500 triângulos; com 6, 9 e 10, BD = 4")
ok(Fr(6 * 6, 4) == 9 and Fr(15 * 6, 10) == 9 and Fr(18 * 4, 12) == 6 and Fr(6 * 4, 3) == 8 and Fr(10 * 2, 5) == 4 and Fr(6 * 6, 4) == 9 and Fr(12 * 3, 9) == 4 and Fr(5 * 3, 2) == Fr(15, 2) and 24 * Fr(5, 2) == 60 and 12 * 9 == 108 and Fr(16 * 3, 8) == 6 and 7 == 14 // 2, "GP02 exemplos e exercícios 1 a 9 (primeiro acesso): 9; 9; 6 m; 8; 4; 9; 4; 7,5; 60 cm; 108 cm²; 6 m; 7")
ok(6 * 1000 ** 2 // 10000 == 600 and Fr(5 * 6, 10) == 3 and Fr(12 * 6, 18) == 4 and Fr(3 * 4, 5) == Fr(12, 5) and 45 * (1 - Fr(4, 9)) == 25 and Fr(6 * 3, 9) == 2, "GP02 exercícios 11 a 16 (primeiro acesso): 600 m²; 3; 4; 2,4; 25; 2 m")
def trap_(a, b, h):
    ps = [(0, 0), (b, 0), ((b - a) / 2 + a + 0.6, h), ((b - a) / 2 + 0.6, h)]; i = inter(ps[0], ps[2], ps[1], ps[3]); return perto(i[1], h * b / (a + b))
def quad_(b, h):
    x = b * h / (b + h); ap = 0.4 * b; x0 = ap * x / h
    return perto(inter((0, 0), (ap, h), (0, x), (1, x))[0], x0) and perto(inter((b, 0), (ap, h), (0, x), (1, x))[0], x0 + x)
def cabo_(a, b, d): return perto(inter((0, a), (d, 0), (d, b), (0, 0))[1], a * b / (a + b))
def alt_(b, c, a):
    ps = [(0, 0), (a, 0), (b * b / a, b * c / a)]; return perto(dist(ps[0], ps[2]), b) and perto(dist(ps[1], ps[2]), c) and perto(ang(ps[0], ps[2], ps[1]), 90)
ok(all(trap_(a, b, h) for a, b, h in [(4, 6, 5), (3, 9, 8), (2, 6, 4), (5, 10, 6), (6, 9, 10), (4, 12, 8)]) and all(quad_(b, h) for b, h in [(12, 6), (6, 3), (10, 15), (12, 4), (6, 6), (20, 5), (8, 8)]) and all(cabo_(a, b, d) for a, b in [(6, 3), (4, 4), (6, 12), (10, 15), (8, 8), (3, 6), (12, 4)] for d in (3, 6, 8, 10, 25)) and all(alt_(*t) for t in [(3, 4, 5), (6, 8, 10), (5, 12, 13), (9, 12, 15), (8, 15, 17), (12, 16, 20)]), "GP02 exercícios 12, 13, 14 e 16, todos os sorteios, medidos por coordenadas: diagonais do trapézio; quadrado inscrito (os dois vértices de cima caem sobre os lados); cabos cruzados (para 5 distâncias diferentes); triângulo retângulo com a altura bc/a")
def med_():
    a, b, c = tri_sorteado(); d = em_(a, b, .5); e = em_(a, c, .5)
    return perto(dist(d, e), dist(b, c) / 2) and abs((e[0] - d[0]) * (c[1] - b[1]) - (e[1] - d[1]) * (c[0] - b[0])) < 1e-9
ok(all(med_() for _ in range(300)) and 90 * Fr(1, 9) == 10 and 90 * Fr(4, 9) - 10 == 30 and 90 - 40 == 50 and Fr(27, 12) == Fr(9, 4) == Fr(3, 2) ** 2 and Fr(4, 10) == Fr(6, 15), "GP02 chefão (b) e (e) e teorema 4: base média em 300 triângulos; áreas 10, 30 e 50; 27/12 = 1,5²")

print("\n" + ("tudo certo" if not falhas else f"{falhas} FALHA(S)"))
sys.exit(1 if falhas else 0)
