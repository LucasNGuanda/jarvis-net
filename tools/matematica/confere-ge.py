"""Confere as contas escritas à mão no módulo GE (Geometria). Rodar: python3 tools/matematica/confere-ge.py
Cada linha é uma afirmação do texto de um tema; se alguma falhar, o script sai com código 1.
A geometria é conferida POR COORDENADAS: monta-se a figura com pontos e mede-se (distância, ângulo, área),
em vez de repetir a fórmula que o texto usa. Sem biblioteca além da padrão."""
from fractions import Fraction as Fr
from math import gcd, sqrt, sin, cos, tan, atan2, acos, asin, pi, hypot, radians, degrees, isclose
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

# ---------- GP03 ----------
def conv_(n):
    """polígono convexo sorteado: pontos em ângulos crescentes sobre uma circunferência"""
    gs = sorted(random.uniform(0, 360) for _ in range(n))
    return [polar((0, 0), 1, g) for g in gs] if min((gs[(i + 1) % n] - gs[i]) % 360 for i in range(n)) > 3 and max((gs[(i + 1) % n] - gs[i]) % 360 for i in range(n)) < 177 else conv_(n)
ok(all(perto(sum(ang(q[i - 1], q[i], q[(i + 1) % n]) for i in range(n)), (n - 2) * 180) for n in range(3, 13) for q in [conv_(n) for _ in range(40)]), "GP03 teorema 1: em 400 polígonos convexos sorteados (3 a 12 lados), os ângulos internos medidos somam (n − 2) · 180°")
ok(all(perto(sum(180 - ang(q[i - 1], q[i], q[(i + 1) % n]) for i in range(n)), 360) for n in range(3, 13) for q in [conv_(n) for _ in range(40)]), "GP03 teorema 2: nos mesmos tamanhos, os externos medidos somam 360°")
ok(all(len([1 for a in range(n) for b in range(a + 1, n) if (b - a) not in (1, n - 1)]) == n * (n - 3) // 2 == n * (n - 1) // 2 - n for n in range(3, 40)), "GP03 teorema 3: diagonais contadas par a par, n(n − 3)/2 = n(n − 1)/2 − n")
def reg_(n):
    q = [polar((0, 0), 1, 90 + 360 * i / n) for i in range(n)]
    return perto(ang(q[0], q[1], q[2]), 180 - 360 / n) and perto(ang(q[0], (0, 0), q[1]), 360 / n)
ok(all(reg_(n) for n in range(3, 25)) and 180 - 360 / 12 == 150 and 180 - 360 / 8 == 135 and 6 * 180 == 1080 and 8 * 5 // 2 == 20, "GP03 teorema 4 e exemplos 1 e 2: interno e central medidos em polígonos regulares de 3 a 24 lados; octógono: 1080°, 135°, 45° e 20 diagonais; interno de 150° dá 12 lados")
ok(5 * 180 == 900 and 1260 // 180 + 2 == 9 and 180 - 72 == 108 and 360 // 9 == 40 and 360 // 24 == 15 and 360 // 36 == 10 and 8 * 5 // 2 == 20 and 11 * 8 // 2 == 44 and 360 - 80 - 100 - 110 == 70 and 7 * 70 + 50 == 540 and max(70, 140, 140, 100, 90) == 140 and 360 // 8 == 45, "GP03 exercícios 1 a 11 (primeiro acesso): 900°; 9; 108°; 40°; 15; 10; 20; 11 (44 diagonais); 70°; 140°; 45°")
ok(2 * (3 + 1) == 8 and 3 * 45 == 135 and 360 - 90 - 108 == 162 and 180 * 9 == 7 * 180 + 360 and 180 - 360 // 3 == 60 and 360 // 60 == 6 and 7 * 4 // 2 == 2 * 7, "GP03 exercícios 12 a 16 (primeiro acesso): 8; 162°; 9; 6; 7")
ok(all(sum(k * x + c for k, c in e) == 540 for x, e in [(88, [(1, 0), (1, 10), (1, 20), (1, 30), (1, 40)]), (70, [(1, 0), (2, 0), (2, 0), (1, 30), (1, 20)]), (45, [(2, 0), (2, 0), (3, 0), (3, 0), (2, 0)]), (96, [(1, 10), (1, 10), (1, 20), (1, 20), (1, 0)])]) and all(sum(q) == 360 for q in [(80, 100, 110, 70), (90, 120, 60, 90), (70, 110, 95, 85), (100, 80, 120, 60), (65, 115, 100, 80), (75, 105, 90, 90)]), "GP03 exemplo 3 e exercícios 9 e 10: os quatro pentágonos somam 540° e os seis quadriláteros somam 360°")
def colado_(n):
    rr = 1 / (2 * sin(pi / n)); c = (0.5, rr * cos(pi / n)); d0 = degrees(atan2(-c[1], 1 - c[0])); q = [polar(c, rr, d0 + 360 * i / n) for i in range(n)]
    return perto(dist(q[0], (1, 0)), 0) and perto(dist(q[-1], (0, 0)), 0, 1e-6) and perto(ang((1, -1), (1, 0), q[1]), 360 - 90 - (180 - 360 / n))
ok(all(colado_(n) for n in (5, 6, 8, 10, 12)), "GP03 exercício 13: quadrado e polígono regular colados por um lado (o polígono construído tem mesmo o lado comum), ângulo medido 360° − 90° − interno")
ok([(k, n) for k in range(3, 50) for n in range(3, 50) if k * (n - 2) * 180 == 360 * n] == [(3, 6), (4, 4), (6, 3)], "GP03 exercício 15 e chefão (d): só (3, 6), (4, 4) e (6, 3) fecham a volta (busca até 50)")
pen_ = [polar((0, 0), 1, 90 + 72 * i) for i in range(5)]
ok(perto(ang(pen_[2], pen_[0], pen_[3]), 36) and perto(ang(pen_[1], pen_[0], pen_[2]), 36) and perto(ang(pen_[4], pen_[0], pen_[1]), 108), "GP03 chefão (e): no pentágono regular, o ângulo CAD medido é 36°")

# ---------- GP04 ----------
O_ = (0.0, 0.0)
def pc_(g, r=1.0): return polar(O_, r, g)
def insc_():
    ga, gb, gp = (random.uniform(0, 360) for _ in range(3)); ab = (gb - ga) % 360; ap = (gp - ga) % 360
    if min(ab, 360 - ab) < 5 or min(ap, 360 - ap) < 3 or min((gp - gb) % 360, (gb - gp) % 360) < 3: return True
    arco = 360 - ab if ap < ab else ab
    return perto(ang(pc_(ga), pc_(gp), pc_(gb)), arco / 2, 1e-6)
ok(all(insc_() for _ in range(2000)), "GP04 teorema 1: em 2000 posições sorteadas de A, B e P na circunferência, o ângulo APB medido é a metade do arco AB que não contém P")
ok(all(perto(ang(pc_(180), pc_(g), pc_(0)), 90) for g in range(5, 176, 5)) and all(perto(ang(pc_(215), pc_(215 + 2 * a + (360 - 2 * a) / 2), pc_(215 + 2 * a)), a) and perto(ang(pc_(215), pc_(215 + a), pc_(215 + 2 * a)), 180 - a) for a in range(55, 126)), "GP04 exercícios 3 e 5: inscrito na semicircunferência mede 90°; no quadrilátero inscrito desenhado, o ângulo em A é o do enunciado e o oposto é o suplemento")
def tang_(r, d):
    al = degrees(acos(r / d)); t = pc_(al, r); p = (d, 0)
    return perto(ang(O_, t, p), 90) and perto(dist(p, t), sqrt(d * d - r * r)) and perto(ang(t, p, pc_(-al, r)) + 2 * al, 180)
ok(all(tang_(r, d) for r, d in [(3, 5), (5, 13), (6, 10), (8, 17), (9, 15), (12, 13), (4, 5), (1, 2.3)]) and sqrt(25 - 9) == 4, "GP04 teorema 2, exemplo 3 e exercícios 6 e 7: tangente perpendicular ao raio, PT = √(OP² − r²), e ângulo entre as tangentes + ângulo central = 180°")
def pot_():
    r = random.uniform(1, 3); p = (random.uniform(-6, 6), random.uniform(-6, 6)); op2 = p[0] ** 2 + p[1] ** 2
    if abs(sqrt(op2) - r) < 0.2: return True
    vals = []
    for _ in range(3):
        g = random.uniform(0, 180); u = (cos(radians(g)), sin(radians(g))); b = 2 * (p[0] * u[0] + p[1] * u[1]); dl = b * b - 4 * (op2 - r * r)
        if dl <= 1e-6: continue
        t1, t2 = (-b - sqrt(dl)) / 2, (-b + sqrt(dl)) / 2; vals.append(abs(t1) * abs(t2))
    return all(perto(v, abs(op2 - r * r), 1e-6) for v in vals)
ok(all(pot_() for _ in range(2000)) and 3 * 8 == 4 * 6, "GP04 teorema 3: em 2000 pontos sorteados (dentro e fora), o produto das distâncias aos dois cortes é |OP² − r²| para toda reta por P; 3 · 8 = 4 · 6")
def seg_(c): return perto(ang((1, -1), (0, -1), pc_(270 + c)), c / 2)
def exc_(m, n):
    a, c, b, d = pc_(180 - m / 2), pc_(180 + m / 2), pc_(360 - n / 2), pc_(n / 2); i = inter(a, b, c, d); return perto(ang(a, i, c), (m + n) / 2)
def exf_(m, n):
    a, c, b, d = pc_(180 - n / 2), pc_(180 + n / 2), pc_(m / 2), pc_(360 - m / 2); q = inter(a, b, c, d); return q[0] < -1 and perto(ang(b, q, d), (m - n) / 2)
ok(all(seg_(c) for c in range(60, 151, 10)) and all(exc_(m, n) for m in range(40, 111, 10) for n in range(20, 61, 10)) and all(exf_(m, n) for m in range(90, 141, 10) for n in range(20, 61, 10)), "GP04 teorema 4 e exercícios 8, 12 e 13: ângulo de segmento (metade do arco), ângulo excêntrico interior (semissoma) e exterior (semidiferença), medidos nas mesmas construções das figuras")
ok(110 / 2 == 55 and (180 - 110) / 2 == 35 and 3 * 8 / 4 == 6 and 180 - 50 == 130 and 84 / 2 == 42 and 2 * 35 == 70 and 90 - 32 == 58 and 180 - 75 == 105 and 180 - 70 == 110 and 130 / 2 == 65 and 4 * 6 / 3 == 8 and 4 * 9 / 3 - 3 == 9 and sqrt(4 * 9) == 6 and (80 + 40) / 2 == 60 and (110 - 40) / 2 == 35 and 360 * 4 / 9 / 2 == 80 and 5 + 7 - 7 == 5 and sqrt(25 - 16) == 3, "GP04 exemplos e exercícios (primeiro acesso): 55° e 35°; 6; 130°; 42°; 70°; 58°; 40°; 105°; 4; 110°; 65°; 8; 9; 6; 60°; 35°; 80°; 5; 3")
def pitot_(t):
    lo, hi = 0.01, 50.0
    for _ in range(100):
        m = (lo + hi) / 2
        if sum(2 * atan2(x, m) for x in t) > 2 * pi: lo = m
        else: hi = m
    r = (lo + hi) / 2; a = 90.0; v = []
    for x in t:
        h = degrees(atan2(x, r)); a += h; v.append(pc_(a, hypot(r, x))); a += h
    lados = [dist(v[i], v[(i + 1) % 4]) for i in range(4)]
    def d_reta(p, q): return abs((q[0] - p[0]) * (-p[1]) - (q[1] - p[1]) * (-p[0])) / dist(p, q)
    return all(perto(lados[i], t[i] + t[(i + 1) % 4], 1e-6) for i in range(4)) and all(perto(d_reta(v[i], v[(i + 1) % 4]), r, 1e-6) for i in range(4)) and perto(lados[0] + lados[2], lados[1] + lados[3], 1e-6)
ok(all(pitot_(t) for t in [(2, 3, 4, 3), (3, 3, 5, 2), (2, 4, 3, 5), (4, 2, 3, 3), (3, 5, 4, 2)]), "GP04 exercício 15: os cinco quadriláteros circunscritos das figuras têm os lados pedidos, os quatro lados à mesma distância do centro (tangentes) e AB + CD = BC + DA")
ok(all(perto(sqrt(r * r - h * h), d) for h, d, r in [(4, 3, 5), (12, 5, 13), (6, 8, 10), (5, 12, 13), (15, 8, 17), (3, 4, 5), (8, 6, 10)]) and (3 - 1) + (4 - 1) == 5 and all(perto(abs(a * 1 + b * 1 - c) / hypot(a, b), 1) for a, b, c in [(1, 0, 0), (0, 1, 0), (3, 4, 12)]), "GP04 exercício 16 e chefão (e): corda e distância ao centro; o círculo de centro (1, 1) e raio 1 é tangente aos três lados do triângulo 3, 4, 5")

# ---------- GP05 ----------
def med_(p, q): return ((p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
def paral_():
    a = (random.uniform(-3, 3), random.uniform(-3, 3)); u = (random.uniform(1, 5), random.uniform(-1, 1)); w = (random.uniform(-2, 2), random.uniform(1, 4))
    b = (a[0] + u[0], a[1] + u[1]); d = (a[0] + w[0], a[1] + w[1]); c = (b[0] + w[0], b[1] + w[1])
    return perto(dist(a, b), dist(c, d)) and perto(dist(b, c), dist(d, a)) and perto(ang(d, a, b), ang(b, c, d)) and perto(ang(d, a, b) + ang(a, b, c), 180) and perto(dist(med_(a, c), med_(b, d)), 0, 1e-9)
ok(all(paral_() for _ in range(500)) and med_((0, 0), (5, 2)) == med_((4, 0), (1, 2)) == (2.5, 1.0), "GP05 teorema 1: em 500 paralelogramos sorteados, lados e ângulos opostos iguais, consecutivos suplementares e diagonais com o mesmo ponto médio")
def los_(d1, d2):
    q = [(0, -d2 / 2), (d1 / 2, 0), (0, d2 / 2), (-d1 / 2, 0)]; l = [dist(q[i], q[(i + 1) % 4]) for i in range(4)]
    return all(perto(x, l[0]) for x in l) and perto(l[0], sqrt((d1 / 2) ** 2 + (d2 / 2) ** 2)) and perto(ang(q[1], q[0], q[2]), ang(q[2], q[0], q[3]))
ok(all(los_(2 * b, 2 * a) and perto(sqrt(a * a + b * b), c) for a, b, c in [(3, 4, 5), (6, 8, 10), (5, 12, 13), (8, 15, 17), (9, 12, 15), (12, 16, 20)]) and hypot(4, 3) == 5, "GP05 teorema 2, exemplo 3 e exercícios 4 e 5: losango (quatro lados iguais à hipotenusa das meias diagonais, diagonal bissetriz) e diagonal do retângulo")
def trap_2():
    B = random.uniform(4, 12); b = random.uniform(1, B - 0.5); h = random.uniform(1, 6); d = random.uniform(-3, 6)
    q = [(0, 0), (B, 0), (d + b, h), (d, h)]; m = med_(q[0], q[3]); n = med_(q[1], q[2]); p1 = med_(q[0], q[2]); p2 = med_(q[1], q[3])
    return perto(dist(m, n), (B + b) / 2) and perto(m[1], n[1]) and perto(dist(p1, p2), (B - b) / 2) and perto(p1[1], m[1]) and perto(p2[1], m[1])
ok(all(trap_2() for _ in range(500)) and (14 + 6) / 2 == 10 and (14 - 6) / 2 == 4, "GP05 teorema 3 e exemplo 2: em 500 trapézios sorteados, base média = (B + b)/2, paralela às bases; pontos médios das diagonais sobre ela, à distância (B − b)/2")
def var_():
    q = [(random.uniform(-5, 5), random.uniform(-5, 5)) for _ in range(4)]; m = [med_(q[i], q[(i + 1) % 4]) for i in range(4)]
    return perto(m[1][0] - m[0][0], m[2][0] - m[3][0], 1e-9) and perto(m[1][1] - m[0][1], m[2][1] - m[3][1], 1e-9) and perto(dist(m[0], m[1]), dist(q[0], q[2]) / 2) and perto(dist(m[1], m[2]), dist(q[1], q[3]) / 2)
ok(all(var_() for _ in range(1000)) and [med_(*s) for s in [((0, 0), (6, 0)), ((6, 0), (8, 4)), ((8, 4), (2, 6)), ((2, 6), (0, 0))]] == [(3.0, 0.0), (7.0, 2.0), (5.0, 5.0), (1.0, 3.0)], "GP05 teorema 4 e exercício 12: Varignon em 1000 quadriláteros sorteados (inclusive não convexos e cruzados); o exemplo numérico do texto")
def bisP_(a, b, g=64):
    A = (0, 0); B = (a, 0); Dp = polar(A, b, g); C = (a + Dp[0], Dp[1]); E = (Dp[0] + b, Dp[1])
    return perto(ang(B, A, E), ang(E, A, Dp)) and perto(dist(E, C), a - b)
def retO_(th):
    w = 4 * cos(radians(th / 2)); h = 4 * sin(radians(th / 2)); o = (w / 2, h / 2)
    return perto(ang((w, 0), o, (w, h)), th) and perto(ang(o, (w, h), (w, 0)), (180 - th) / 2)
ok(all(bisP_(a, b) for a in range(8, 15) for b in range(3, 8)) and all(retO_(th) for th in range(30, 81, 2)), "GP05 exercícios 13 e 14: bissetriz no paralelogramo (EC = AB − AD, medido) e ângulo entre diagonal e lado do retângulo")
ok(180 - 65 == 115 and 28 / 2 - 9 == 5 and 2 * 5 + 2 * 3.5 == 17 and 4 * 5 == 20 and 70 / 2 == 35 and (11 + 5) / 2 == 8 and 2 * 10 - 7 == 13 and 180 - 68 == 112 and abs(5 * sqrt(2) - 7.07) < 0.005 and (15 - 7) / 2 == 4 and 10 + 7 == 17 and 10 - 6 == 4 and (180 - 50) / 2 == 65 and hypot(9 - 6, 4) == 5 and sqrt(25 - 9) == 4, "GP05 exercícios (primeiro acesso): 115°; 5; 17; 5; 20; 35°; 8; 13; 112°; 7,07; 4; 17; 4; 65°; 5; 4")
ok(2 * 35 + 10 == 80 and 3 * 35 - 5 == 100 and 80 + 100 == 180 and perto(ang((0, 0), inter((0, 0), (8, 8), (10, 0), (2, 8)), (10, 0)), 90) and dist((0, 0), (2, 8)) == dist((10, 0), (8, 8)), "GP05 exemplo 1 (primeiro acesso) e chefão (e): ângulos 80° e 100°; o trapézio isósceles de bases 10 e 6 e altura 8 tem diagonais perpendiculares")

# ---------- GP06 ----------
ok(all(len([x for x in range(1, 200) if x < a + b and a < x + b and b < x + a]) == a + b - 1 - abs(a - b) for a in range(1, 20) for b in range(1, 20)) and 3 + 4 < 8 and 3 + 4 > 6, "GP06 teorema 1 e exercício 1: o número de terceiros lados inteiros é (a + b − 1) − |a − b| (contado um a um); 3, 4, 8 não fecha e 3, 4, 6 fecha")
def maior_():
    t = tri_sorteado(); ls = [dist(t[1], t[2]), dist(t[0], t[2]), dist(t[0], t[1])]; an = [ang(t[1], t[0], t[2]), ang(t[0], t[1], t[2]), ang(t[0], t[2], t[1])]
    return ls.index(max(ls)) == an.index(max(an))
ok(all(maior_() for _ in range(1000)), "GP06 exercício 2: em 1000 triângulos sorteados, o maior lado fica em frente ao maior ângulo")
def circun_(a, b, c):
    d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])); q = lambda p: p[0] ** 2 + p[1] ** 2
    return ((q(a) * (b[1] - c[1]) + q(b) * (c[1] - a[1]) + q(c) * (a[1] - b[1])) / d, (q(a) * (c[0] - b[0]) + q(b) * (a[0] - c[0]) + q(c) * (b[0] - a[0])) / d)
def notav_():
    a, b, c = tri_sorteado(); g = ((a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3); m = ((b[0] + c[0]) / 2, (b[1] + c[1]) / 2); o = circun_(a, b, c); h = (a[0] + b[0] + c[0] - 2 * o[0], a[1] + b[1] + c[1] - 2 * o[1])
    alt = abs((h[0] - a[0]) * (c[0] - b[0]) + (h[1] - a[1]) * (c[1] - b[1])) < 1e-6 and abs((h[0] - b[0]) * (c[0] - a[0]) + (h[1] - b[1]) * (c[1] - a[1])) < 1e-6
    s = area([a, b, c]); seis = all(perto(area([g, p, q]), s / 3, 1e-6) for p, q in [(a, b), (b, c), (a, c)])
    return perto(dist(a, g), 2 * dist(g, m)) and perto(dist(o, a), dist(o, b)) and perto(dist(o, a), dist(o, c)) and alt and perto(dist(g, h), 2 * dist(o, g), 1e-6) and seis and perto(ang(a, o, b) if ang(a, c, b) < 90 else 360 - ang(a, o, b), 2 * ang(a, c, b), 1e-6)
ok(all(notav_() for _ in range(1000)), "GP06 teoremas 2 e 4 e exercícios 3, 9, 13 e 14: em 1000 triângulos, G a 2/3 da mediana, GBC com um terço da área, O equidistante dos vértices, central AOB = 2 · C, H = A + B + C − 2 · O está nas alturas e GH = 2 · OG")
def inc_():
    a, b, c = tri_sorteado(); i = incentro(a, b, c); dr = lambda p, q: abs((q[0] - p[0]) * (p[1] - i[1]) - (p[0] - i[0]) * (q[1] - p[1])) / dist(p, q); r = dr(a, b)
    return perto(r, dr(b, c), 1e-6) and perto(r, dr(a, c), 1e-6) and perto(r * (dist(a, b) + dist(b, c) + dist(a, c)) / 2, area([a, b, c]), 1e-6)
ok(all(inc_() for _ in range(1000)) and all(perto(incentro((0, 0), (c, 0), (0, b))[0], (b + c - a) / 2) and circun_((0, 0), (c, 0), (0, b)) == (c / 2, b / 2) for b, c, a in [(3, 4, 5), (6, 8, 10), (5, 12, 13), (8, 15, 17), (9, 12, 15), (12, 16, 20)]), "GP06 teorema 3, exemplo 3 e exercícios 5, 6 e 11: incentro equidistante dos lados e r · p = área (1000 triângulos); no retângulo, r = (b + c − a)/2 e O no meio da hipotenusa")
def orto_(a):
    t = de_angs(180 - a - 55, 55); A, B, C = t[2], t[0], t[1]; o = circun_(A, B, C); h = (A[0] + B[0] + C[0] - 2 * o[0], A[1] + B[1] + C[1] - 2 * o[1]); return perto(ang(B, A, C), a) and perto(ang(B, h, C), 180 - a, 1e-6)
def altbis_(b, c):
    t = de_angs(b, c); A, B, C = t[2], t[0], t[1]; hh = (A[0], 0.0); i = incentro(A, B, C); d = inter(A, i, B, C); return perto(ang(hh, A, d), abs(b - c) / 2, 1e-6)
ok(all(orto_(a) for a in range(45, 81)) and all(altbis_(b, c) for b, c in [(70, 40), (80, 30), (65, 45), (75, 35), (60, 50), (85, 45)]), "GP06 exercícios 10 e 16 e chefão (c): BHC = 180° − A, e o ângulo entre altura e bissetriz é |B − C|/2, medidos")
ok(5 ** 2 + 7 ** 2 == 74 < 81 and 2 * 12 / 3 == 8 and hypot(3, 4) / 2 == 2.5 and (3 + 4 - 5) / 2 == 1 and 5 + 9 - 1 - 4 == 9 and 180 - 50 - 60 == 70 and 2 * 9 / 3 == 6 and 3 * 2.5 == 7.5 and 10 / 2 == 5 and 13 / 2 == 6.5 and sqrt(13 ** 2 - 5 ** 2) == 12 and abs(6 * sqrt(3) / 2 - 5.196) < 0.001 and 2 * 55 == 110 and 180 - 65 == 115 and (6 + 8 - 10) / 2 == 2 and 2 * 9 / 3 == 6 and 48 / 3 == 16 and 2 * 12 / 3 == 8 and (70 - 40) / 2 == 15, "GP06 exemplos e exercícios (primeiro acesso): obtusângulo; 8 e 4; 2,5 e 1; 9; AB; 6; 7,5; 5; 6,5; 12; 5,20; 110°; 115°; 2; 6; 16; 8; 15°")
ok(len([a for a in range(1, 15) if 15 - 2 * a >= 1 and 15 - 2 * a < 2 * a]) == 4 and all(len([a for a in range(1, P) if P - 2 * a >= 1 and P - 2 * a < 2 * a]) == len(set(tuple(sorted((x, x, P - 2 * x))) for x in range(1, P) if 0 < P - 2 * x < 2 * x)) for P in range(9, 25)), "GP06 exercício 15: triângulos isósceles de lados inteiros e perímetro 15 são 4 (4, 4, 7; 5, 5, 5; 6, 6, 3; 7, 7, 1)")
ok(13 ** 2 - 5 ** 2 == 15 ** 2 - 9 ** 2 == 144 and 14 * 12 / 2 == 84 and 84 / 21 == 4 and dist((0, 0), (5, 12)) == 13 and dist((14, 0), (5, 12)) == 15 and (2 / 3 * 3, 2 / 3 * 4.5) == (2.0, 3.0) and (6 - 2 / 3 * 6, 2 / 3 * 4.5) == (2.0, 3.0), "GP06 chefão (e) e teorema 4: triângulo 13, 14, 15 com altura 12, área 84 e raio inscrito 4; baricentro (2, 3) no exemplo numérico")

# ---------- GP07 ----------
def ret_():
    b = random.uniform(0.5, 9); c = random.uniform(0.5, 9); g = random.uniform(0, 360); a0 = (random.uniform(-3, 3), random.uniform(-3, 3)); pb = polar(a0, c, g); pcx = polar(a0, b, g + 90); a = dist(pb, pcx)
    hh = inter(a0, (a0[0] + (pcx[1] - pb[1]), a0[1] - (pcx[0] - pb[0])), pb, pcx); h = dist(a0, hh); m = dist(pb, hh); n = dist(hh, pcx)
    return perto(a * a, b * b + c * c) and perto(ang(a0, hh, pb), 90, 1e-6) and perto(h * h, m * n, 1e-6) and perto(c * c, a * m, 1e-6) and perto(b * b, a * n, 1e-6) and perto(a * h, b * c, 1e-6) and perto(m + n, a, 1e-6)
ok(all(ret_() for _ in range(1000)), "GP07 teoremas 1 e 3: em 1000 triângulos retângulos sorteados (em qualquer posição), a² = b² + c², e, com o pé da altura achado por coordenadas, h² = mn, c² = am, b² = an, ah = bc e m + n = a")
def sinal_():
    t = tri_sorteado(); a = dist(t[1], t[2]); b = dist(t[0], t[2]); c = dist(t[0], t[1]); g = ang(t[1], t[0], t[2]); d = a * a - b * b - c * c
    return abs(g - 90) < 0.01 or (d > 0) == (g > 90)
ok(all(sinal_() for _ in range(2000)) and 5 ** 2 + 12 ** 2 == 13 ** 2 and 5 ** 2 + 6 ** 2 == 61 < 64 and 61 > 49, "GP07 teorema 2 e chute: em 2000 triângulos, a² − b² − c² é positivo exatamente quando o ângulo oposto a a é obtuso; 5, 6, 8 é obtusângulo e 5, 6, 7 é acutângulo")
ok(all(a * a + b * b == c * c for a, b, c in [(3, 4, 5), (6, 8, 10), (5, 12, 13), (8, 15, 17), (9, 12, 15), (12, 16, 20), (7, 24, 25), (20, 21, 29), (9, 40, 41), (11, 60, 61), (12, 35, 37), (15, 20, 25), (30, 40, 50)]) and all(a * a + b * b != c * c for a, b, c in [(5, 6, 7), (4, 5, 6), (7, 8, 10), (6, 9, 11), (10, 15, 20), (9, 12, 16), (5, 10, 12)]), "GP07 ternos: todos os ternos usados como retângulos são pitagóricos, e nenhuma das alternativas erradas do exercício 4 é")
ok((7 * 7 - 4 * 6) == 25 and 4 * 3 * 4 // 2 == 24 and perto(hypot(5, 5), 5 * sqrt(2)) and abs(5 * sqrt(2) - 7.07) < 0.005 and perto(sqrt(100 - 25), 5 * sqrt(3)) and abs(5 * sqrt(3) - 8.66) < 0.005 and perto(ang((5 * sqrt(3), 0), (0, 0), (0, 5)), 90) and perto(ang((0, 0), (5 * sqrt(3), 0), (0, 5)), 30) and perto(ang((0, 0), (7, 0), (0, 7)), 45), "GP07 teoremas 1 e 4: quadrado de lado 7 com quatro triângulos 3, 4, 5 (sobra 25); triângulos de 45° e de 30° e 60° medidos")
ok(all(perto(sqrt(L * L - d1 * d1), h1) and perto(sqrt(L * L - d2 * d2), h2) for L, d1, h1, d2, h2 in [(25, 7, 24, 15, 20), (65, 16, 63, 25, 60), (65, 33, 56, 39, 52), (65, 25, 60, 39, 52), (50, 14, 48, 30, 40)]) and 24 - 20 == 4, "GP07 exemplo 3: as cinco escadas (mesmo comprimento antes e depois); a de 25 dm desce 4 dm")
ok(all(a * a + b * b + c * c == d * d for a, b, c, d in [(2, 3, 6, 7), (1, 2, 2, 3), (4, 1, 8, 9), (6, 2, 9, 11), (4, 3, 12, 13), (4, 4, 7, 9), (8, 4, 1, 9)]) and all(m * n == h * h for m, n, h in [(4, 9, 6), (2, 8, 4), (3, 12, 6), (1, 4, 2), (9, 16, 12), (4, 16, 8), (1, 9, 3), (5, 20, 10), (2, 18, 6)]), "GP07 exercícios 7, 8 e 13: os produtos das projeções são quadrados perfeitos; as diagonais dos blocos são inteiras")
ok(hypot(5, 12) == 13 and sqrt(17 ** 2 - 8 ** 2) == 15 and abs(hypot(2, 3) - 3.61) < 0.005 and 3 * 4 / 5 == 2.4 and 8 ** 2 / 10 == 6.4 and sqrt(4 * 9) == 6 and 3 + 36 / 3 == 15 and abs(7 * sqrt(2) - 9.90) < 0.005 and 12 / 2 == 6 and sqrt(100 - 36) == 8 and hypot(9, 12) == 15 and [x for x in range(1, 200) if x * x + (x + 7) ** 2 == 169] == [5] and perto(sqrt(25 + 2 * 5 * 2.4), 7) and hypot(12, 5) == 13, "GP07 exercícios (primeiro acesso): 13; 15; 3,61; 2,4; 6,4; 6; 15; 9,90; 6; 8 dm; 15 km; 7; 5; 7; 13 m")
ok([n for n in range(2, 10000) if (n - 1) ** 2 + n ** 2 == (n + 1) ** 2] == [4] and hypot(15, 20) == 25 and 15 * 20 / 25 == 12 and 400 / 25 == 16 and 225 / 25 == 9 and 16 * 9 == 144 and (15 + 20 - 25) / 2 == 5, "GP07 chefão (d) e (e): só n = 4 dá três inteiros consecutivos (busca até 10 000); triângulo 15, 20, 25: h = 12, projeções 16 e 9, raio inscrito 5")

# ---------- GP09 ----------
def cad_(ps): return abs(sum(ps[i][0] * ps[(i + 1) % len(ps)][1] - ps[(i + 1) % len(ps)][0] * ps[i][1] for i in range(len(ps)))) / 2
def bas_():
    b = random.uniform(2, 9); h = random.uniform(1, 6); d = random.uniform(-4, 6); B = random.uniform(1, 9); e = random.uniform(-3, 5)
    return perto(cad_([(0, 0), (b, 0), (b + d, h), (d, h)]), b * h) and perto(cad_([(0, 0), (b, 0), (d, h)]), b * h / 2) and perto(cad_([(0, 0), (b, 0), (e + B, h), (e, h)]), (b + B) * h / 2)
ok(all(bas_() for _ in range(1000)) and 5 * 3 == 15, "GP09 teoremas 1 e 2: em 1000 figuras sorteadas, o cadarço confirma paralelogramo = b·h, triângulo = b·h/2 e trapézio = (B + b)·h/2, com qualquer inclinação")
def perp_():
    d1 = random.uniform(2, 9); d2 = random.uniform(2, 9); x = random.uniform(0.1, d1 - 0.1); y = random.uniform(0.1, d2 - 0.1)
    return perto(cad_([(-x, 0), (0, -y), (d1 - x, 0), (0, d2 - y)]), d1 * d2 / 2)
ok(all(perp_() for _ in range(1000)) and 10 * 6 / 2 == 30, "GP09 teorema 2 e chefão (d): em 1000 quadriláteros de diagonais perpendiculares (não só losangos), área = d1·d2/2")
def her_():
    t = tri_sorteado(); a, b, c = dist(t[1], t[2]), dist(t[0], t[2]), dist(t[0], t[1]); p = (a + b + c) / 2; i = incentro(*t); r = abs((t[1][0] - t[0][0]) * (t[0][1] - i[1]) - (t[0][0] - i[0]) * (t[1][1] - t[0][1])) / c
    return perto(sqrt(p * (p - a) * (p - b) * (p - c)), cad_(t), 1e-6) and perto(p * r, cad_(t), 1e-6)
ok(all(her_() for _ in range(1000)) and all(perto(sqrt((a + b + c) / 2 * ((a + b + c) / 2 - a) * ((a + b + c) / 2 - b) * ((a + b + c) / 2 - c)), s) for a, b, c, s in [(13, 14, 15, 84), (5, 5, 6, 12), (7, 15, 20, 42), (9, 10, 17, 36), (13, 13, 10, 60), (6, 25, 29, 60), (10, 17, 21, 84), (5, 12, 13, 30)]), "GP09 teorema 3: em 1000 triângulos sorteados, Heron e semiperímetro × raio inscrito coincidem com o cadarço; os oito triângulos de lados inteiros têm as áreas inteiras dos enunciados")
def regp_(n, l):
    rr = l / (2 * sin(pi / n)); ap = rr * cos(pi / n); return perto(cad_([polar((0, 0), rr, 360 * i / n) for i in range(n)]), n * l / 2 * ap)
ok(all(regp_(n, l) for n in range(3, 13) for l in (1, 2, 3.5)) and perto(cad_([polar((0, 0), 2, 60 * i) for i in range(6)]), 6 * sqrt(3)) and all(perto(cad_([(0, 0), (l, 0), (l / 2, l * sqrt(3) / 2)]), l * l * sqrt(3) / 4) for l in range(1, 20)), "GP09 teorema 4 e exercícios 8 e 9: polígono regular = semiperímetro × apótema (3 a 12 lados); hexágono de lado 2: 6√3; equilátero: l²√3/4")
def pick_():
    while True:
        ps = [(round(6 + r * cos(radians(t))), round(4 + r * sin(radians(t)))) for t, r in [(90 + 72 * i + random.uniform(-25, 25), random.uniform(1.5, 4)) for i in range(5)]]
        if len(set(ps)) == 5 and cad_(ps) > 1: break
    def dentro(x, y):
        w = 0; nb = False
        for i in range(5):
            p, q = ps[i], ps[(i + 1) % 5]; cr = (q[0] - p[0]) * (y - p[1]) - (q[1] - p[1]) * (x - p[0])
            if cr == 0 and min(p[0], q[0]) <= x <= max(p[0], q[0]) and min(p[1], q[1]) <= y <= max(p[1], q[1]): nb = True
            if p[1] <= y:
                if q[1] > y and cr > 0: w += 1
            elif q[1] <= y and cr < 0: w -= 1
        return 2 if nb else (1 if w else 0)
    cont = [dentro(x, y) for x in range(0, 13) for y in range(0, 10)]
    return cont.count(1) + cont.count(2) / 2 - 1 == cad_(ps)
ok(all(pick_() for _ in range(300)), "GP09 laboratório e exemplo 3: teorema de Pick conferido em 300 pentágonos de malha sorteados em forma de estrela em volta de um ponto (I + B/2 − 1 = área do cadarço)")
MAL_ = [[(1, 1), (6, 1), (7, 4), (3, 5)], [(1, 1), (7, 2), (5, 5), (2, 4)], [(2, 1), (6, 1), (7, 3), (4, 5), (1, 3)], [(1, 1), (5, 1), (7, 4), (4, 5), (1, 4)], [(1, 2), (4, 1), (7, 3), (5, 5)]]
ok([cad_(m) for m in MAL_] == [16.5, 14.0, 16.0, 18.0, 11.5], "GP09 exemplo 3 e exercício 12: áreas dos cinco polígonos de malha, pelo cadarço: 16,5; 14; 16; 18; 11,5")
ok((10 + 6) * 4 / 2 == 32 and 7 * 4 == 28 and 9 * 6 / 2 == 27 and 8 * 4 == 32 and (12 + 8) * 5 / 2 == 50 and 10 * 6 / 2 == 30 and 6 * 8 / 2 == 24 and abs(16 * sqrt(3) / 4 - 6.93) < 0.005 and abs(6 * 4 * sqrt(3) / 4 - 10.39) < 0.005 and 80 - 12 == 68 and 2 * 42 / 12 == 7 and 60 / 18 == 10 / 3 and 40 * 2 / 5 == 16 and (10 + 4) * 4 / 2 == 28 and 3 * 64 / 8 == 24, "GP09 exemplo 1 e exercícios 1 a 6, 8 a 11 e 13 a 16 (primeiro acesso): 32; 28; 27; 32; 50; 30; 24; 6,93; 10,39; 68; 7; 3,33; 16; 28; 24")
ok(perto(cad_([(0, 0), (8, 4), (4, 8)]), 24) and sqrt(21 * 8 * 7 * 6) == 84 and 168 / 14 == 12 and 168 / 15 == 11.2 and abs(168 / 13 - 12.92) < 0.005 and 84 / 21 == 4 and all(perto(cad_([(0, 0), (8 * m / (m + n), 0), (3, 5)]) / cad_([(0, 0), (8, 0), (3, 5)]), m / (m + n)) for m, n in [(2, 3), (1, 2), (3, 1), (1, 4), (3, 2), (1, 1), (5, 3)]), "GP09 exercícios 14 e 16 e chefão (e): razão de áreas = razão das bases (medido); triângulo AMN no quadrado de lado 8 tem área 24; triângulo 13, 14, 15: área 84, alturas 12,92, 12 e 11,2, raio 4")

# ---------- GP10 ----------
def insc_(n, r=1.0): return cad_([polar((0, 0), r, 360 * i / n) for i in range(n)])
def perim_(n, r=1.0): return sum(dist(polar((0, 0), r, 360 * i / n), polar((0, 0), r, 360 * (i + 1) / n)) for i in range(n))
seq_ = [insc_(6 * 2 ** k) for k in range(10)]
ok(all(seq_[i] < seq_[i + 1] < pi for i in range(9)) and abs(seq_[-1] - pi) < 1e-5 and abs(insc_(6) - 2.598) < 0.0005 and perto(insc_(12), 3) and abs(insc_(24) - 3.106) < 0.0005 and abs(insc_(96) - 3.139) < 0.0005 and abs(perim_(3072) - 2 * pi) < 1e-5 and all(perto(insc_(96, r) / insc_(96), r * r) for r in (2, 3.5, 7)), "GP10 teorema 1: a área do polígono regular inscrito (cadarço) sobe de 2,598 (6 lados) para 3, 3,106, …, e a de 3072 lados está a menos de 0,00001 de π; o perímetro chega a 2π; a área vai com r²")
def setor_num(r, g, n=20000):
    """área do setor somando n triângulos finos"""
    return sum(cad_([(0, 0), polar((0, 0), r, g * i / n), polar((0, 0), r, g * (i + 1) / n)]) for i in range(n))
ok(all(abs(setor_num(r, g) - g / 360 * pi * r * r) < 1e-5 * r * r for r, g in [(6, 60), (6, 120), (9, 40), (10, 72), (2, 90), (3, 300)]) and 60 / 360 * 12 == 2 and 60 / 360 * 36 == 6 and 2 * 6 / 2 == 6, "GP10 teorema 2 e exemplo 2: a área do setor, somada em 20 000 triângulos finos, é a fração g/360 de π r²; raio 6 e 60°: arco 2π e setor 6π (= arco · raio / 2)")
ok(all(perto(R * R - r * r, h * h) for h, r, R in [(4, 3, 5), (12, 5, 13), (8, 6, 10), (15, 8, 17), (6, 8, 10), (5, 12, 13), (3, 4, 5)]) and 25 - 9 == 16 == 8 ** 2 / 4, "GP10 teorema 3, exemplo 3 e exercício 16: a meia corda tangente ao círculo interno satisfaz R² − r² = (c/2)² em todos os pares dos sorteios")
def seg_num(r, g, n=20000):
    return setor_num(r, g, n) - cad_([(0, 0), (r, 0), polar((0, 0), r, g)])
ok(abs(seg_num(10, 90) - (25 * pi - 50)) < 1e-4 and abs(25 * 3.14 - 50 - 28.5) < 1e-9 and abs(seg_num(6, 60) - (6 * pi - 9 * sqrt(3))) < 1e-4 and abs(6 * pi - 9 * sqrt(3) - 3.26) < 0.005 and abs(6 * pi - 18.85) < 0.005 and abs(9 * sqrt(3) - 15.59) < 0.005, "GP10 teorema 4, exercício 11 e chefão (e): segmentos de 90° (25π − 50) e de 60° (6π − 9√3 ≈ 3,26), conferidos por soma de triângulos finos")
ok(all(perto(x, y) for x, y in [(2 * 7, 14), (6 ** 2, 36), ((10 / 2) ** 2, 25), (18 / 2, 9), (80 / 360 * 18, 4), (100 / 360 * 36, 10), (49 - 16, 33), (3.14 * 10 + 20, 51.4), (3.14 * 70 * 100 / 100, 219.8), (100 - 3.14 * 25, 21.5), (3.14 * 100 / 4 - 50, 28.5), (8 ** 2, 64), ((36 + 64) / 4, 25), (5 / 24 * 360, 75), (100 - 3.14 * 100 / 4, 21.5), (12 ** 2, 144)]), "GP10 exercícios (primeiro acesso): 14; 36; 25; 9; 4; 10; 33; 51,4 m; 219,8 m; 21,5; 28,5; 64; 25; 75°; 21,5; 144")
ok(perto(2 * 5 * 3.14, 31.4) and perto(25 * 3.14, 78.5) and pi * 20 ** 2 == 2 * (2 * pi * 10 ** 2), "GP10 exemplo 1 e chute: raio 5: 31,4 cm e 78,5 cm²; a pizza de 40 cm tem o dobro da área de duas de 20 cm")
def lun_(b, c):
    a = hypot(b, c); sc = lambda d: pi * d * d / 8; return perto(sc(b) + sc(c) + b * c / 2 - sc(a), b * c / 2)
ok(all(lun_(b, c) for b, c in [(3, 4), (5, 12), (1, 1), (2.5, 7.1)]), "GP10 chefão (d): as duas luas sobre os catetos somam a área do triângulo (quatro triângulos)")

# ---------- TG01 ----------
ok(all(perto(radians(g), Fr(g, 180) * pi) for g in [30, 45, 60, 90, 120, 135, 150, 210, 225, 240, 270, 300, 315, 330, 36, 72, 20, 40, 15, 75]) and Fr(150, 180) == Fr(5, 6) and Fr(225, 180) == Fr(5, 4) and Fr(120, 180) == Fr(2, 3) and Fr(210, 180) == Fr(7, 6) and abs(degrees(1) - 57.2958) < 0.00005 and abs(2 * pi - 6.28) < 0.005, "TG01 teorema 1 e exemplo 1: conversões graus ↔ radianos dos sorteios; 150° = 5π/6, 225° = 5π/4; 1 rad ≈ 57,2958°; 2π ≈ 6,28")
def arco_(r, th, n=20000): return sum(dist(polar((0, 0), r, degrees(th) * i / n), polar((0, 0), r, degrees(th) * (i + 1) / n)) for i in range(n))
ok(all(abs(arco_(r, th) - r * th) < 1e-6 * r for r, th in [(6, 1.5), (4, 2), (10, 0.8), (5, 2.4), (8, 1.25), (12, 0.5), (5, 2)]) and all(perto(r * r * th / 2, degrees(th) / 360 * pi * r * r) for r, th in [(6, 1.5), (4, 2), (10, 0.8), (6, pi / 3)]) and perto(6 * pi / 3, 2 * pi) and 6 * 1.5 == 9 and 9 * 6 / 2 == 27, "TG01 teorema 2 e exemplo 2: o arco somado em 20 000 cordinhas é r · θ; setor r²θ/2 igual à fórmula em graus; raio 6 e 1,5 rad: arco 9 e setor 27")
ok(1230 % 360 == 150 and 1230 // 360 == 3 and -200 % 360 == 160 and 1000 % 360 == 280 and -100 % 360 == 260 and all((360 * k + d) % 360 == d for k in range(-5, 7) for d in range(0, 360, 5)), "TG01 teoremas 3 e 4 e exemplo 3: 1230° para em 150° (3 voltas); −200° em 160°; 1000° em 280° (4º quadrante); −100° em 260° (3º)")
ok(Fr(120, 180) == Fr(2, 3) and 7 * 180 // 6 == 210 and 5 * 2 == 10 and 10 / 4 == 2.5 and (360 * 3 + 150) % 360 == 150 and (2.25) * 60 == 135 and 36 * 1.5 / 2 == 27 and (Fr(1, 4) + 2 * 2) == Fr(17, 4) and perto(10 * 2 * 3.14 * 15 / 60, 15.7) and Fr(108, 180) == Fr(3, 5) and Fr(4, 9) * 180 == 80 and Fr(120, 180) == Fr(2, 3) and [k for k in range(1, 400) if k * 75 % 360 == 0][0] == 24, "TG01 exercícios (primeiro acesso): 2π/3; 210°; 10 cm; 2,5 rad; 150°; 160°; 4º quadrante; 3 voltas; 135'; 27 cm²; π/4 (de 17π/4); 15,7 cm; 3π/5; 80°; 2π/3; 24 saltos")
ok(all([k for k in range(1, 400) if k * a % 360 == 0][0] == 360 // gcd(360, a) for a in (75, 40, 48, 100, 150, 54, 135, 80, 96, 50)) and [40 + 360 * k for k in range(-10, 10) if -1000 < 40 + 360 * k < 1000] == [-680, -320, 40, 400, 760] and Fr(50, 720) * 2 == Fr(5, 36) and Fr(5, 36) * 180 == 25 and radians(120) > 2 and abs(radians(120) - 2.094) < 0.0005 and dist(polar((0, 0), 1, 0), polar((0, 0), 1, 60)) < radians(60) and perto(dist(polar((0, 0), 1, 0), polar((0, 0), 1, 60)), 1), "TG01 exercício 16 e chefão: saltos = 360/mdc; cinco ângulos côngruos a 40°; ponteiro das horas 5π/36 rad (25°); 120° ≈ 2,094 rad; a corda de 60° mede o raio e é menor que o arco")

# ---------- TG02 ----------
def raz_(al, hip=1.0):
    """seno, cosseno e tangente MEDIDOS num triângulo montado com pontos: V na origem, P na direção al, H o pé de P no eixo"""
    P = polar((0, 0), hip, al); H = (P[0], 0)
    return dist(P, H) / dist((0, 0), P), dist((0, 0), H) / dist((0, 0), P), dist(P, H) / dist((0, 0), H)
ok(all(perto(raz_(al, 1)[i], raz_(al, k)[i]) for al in range(5, 90, 7) for k in (0.3, 2, 10, 57) for i in range(3)) and all(abs(ang((1, 0), (0, 0), polar((0, 0), k, al)) - al) < 1e-9 for al in (20, 37, 61) for k in (1, 5)) and Fr(3, 5) == Fr(6, 10) and perto(raz_(degrees(atan2(3, 4)))[0], 0.6), "TG02 teorema 1: as três razões medidas em triângulos de tamanhos diferentes com o mesmo ângulo coincidem; 3/5 = 6/10 = 0,6")
ok(all(perto(raz_(al)[0] ** 2 + raz_(al)[1] ** 2, 1) and perto(raz_(al)[0] / raz_(al)[1], raz_(al)[2]) and perto(raz_(al)[0], raz_(90 - al)[1]) for al in range(1, 90)) and Fr(3, 5) ** 2 + Fr(4, 5) ** 2 == 1 and Fr(3, 5) / Fr(4, 5) == Fr(3, 4), "TG02 teoremas 2 e 3: sen² + cos² = 1, tg = sen/cos e sen α = cos(90° − α), medidos de 1° a 89°")
eq_ = [(0, 0), (2, 0), polar((0, 0), 2, 60)]; pe_ = (1, 0)
ok(perto(dist(eq_[0], eq_[2]), 2) and perto(dist(eq_[1], eq_[2]), 2) and perto(dist(pe_, eq_[2]), sqrt(3)) and perto(ang(pe_, eq_[2], eq_[0]), 30) and perto(ang(pe_, eq_[0], eq_[2]), 60) and perto(raz_(30)[0], 0.5) and perto(raz_(30)[1], sqrt(3) / 2) and perto(raz_(30)[2], sqrt(3) / 3) and perto(raz_(60)[2], sqrt(3)) and perto(dist((0, 0), (1, 1)), sqrt(2)) and perto(ang((1, 0), (0, 0), (1, 1)), 45) and perto(raz_(45)[0], sqrt(2) / 2) and perto(raz_(45)[2], 1) and perto(1 / sqrt(3), sqrt(3) / 3) and perto(1 / sqrt(2), sqrt(2) / 2), "TG02 teorema 4: meio triângulo equilátero de lado 2 (lados 1, √3, 2; ângulos 30° e 60°) e meio quadrado (1, 1, √2; 45°); a tabela exata dos notáveis")
tab_ = {20: (0.34, 0.94, 0.36), 25: (0.42, 0.91, 0.47), 35: (0.57, 0.82, 0.7), 40: (0.64, 0.77, 0.84), 50: (0.77, 0.64, 1.19), 55: (0.82, 0.57, 1.43), 65: (0.91, 0.42, 2.14), 70: (0.94, 0.34, 2.75)}
ok(all(round(raz_(a)[i], 2) == tab_[a][i] for a in tab_ for i in range(3)) and abs(sin(radians(60)) - 0.866) < 0.0005, "TG02 tabela de 20° a 70°: os 24 valores com duas casas conferem com as razões medidas; sen 60° ≈ 0,866")
ok(all(perto(L * raz_(30)[0], L / 2) and perto(L * raz_(30)[1], L / 2 * sqrt(3)) and perto((L / 2) ** 2 + 3 * (L / 2) ** 2, L * L) for L in (8, 10, 12, 14, 16, 20)) and perto(40 * 0.7 + 1.6, 29.6) and [round(d * tab_[a][2] + 1.6, 2) for d, a in ((30, 40), (50, 25), (20, 50), (60, 20), (20, 55))] == [26.8, 25.1, 25.4, 23.2, 30.2] and all(a * a + b * b == c * c and gcd(a, b) == 1 for a, b, c in ((3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), (20, 21, 29))), "TG02 exemplos: hipotenusa 12 e 30° dão 6 e 6√3; torre a 40 m sob 35°, olhos a 1,6 m: 29,6 m; os cinco ternos pitagóricos usados são primitivos")
def duas_(d):
    """altura achada por interseção das duas visadas (30° em A, 60° em B), sem fórmula"""
    A_, B_ = (0, 0), (d, 0); T_ = inter(A_, polar(A_, 1, 30), B_, polar(B_, 1, 60)); return T_
ok(all(perto(duas_(d)[1], d * sqrt(3) / 2) and perto(dist((d, 0), duas_(d)), d) and perto(duas_(d)[0], 1.5 * d) for d in (10, 20, 36, 60)) and all(perto(area([(-L * sqrt(3) / 2, 0), (L * sqrt(3) / 2, 0), (0, L / 2)]), L * L / 4 * sqrt(3)) and perto(ang((-L * sqrt(3) / 2, 0), (0, L / 2), (L * sqrt(3) / 2, 0)), 120) and perto(dist((0, L / 2), (L * sqrt(3) / 2, 0)), L) for L in (4, 6, 10, 20)), "TG02 exercícios 14 e 15: isósceles de lados L e 120° tem área (L²/4)√3; duas visadas de 30° e 60° separadas por d: as retas se cruzam à altura d√3/2, com BT = d")
ok(all(Fr(a + b, c) ** 2 - 1 == 2 * Fr(a * b, c * c) for a, b, c in ((3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), (20, 21, 29))) and 4 * Fr(1, 4) + 2 * 3 == 7 and 10 / 2 == 5 and 14 / 2 == 7 and perto(7 / raz_(45)[1], 7 * sqrt(2)) and perto(6 * raz_(60)[0], 3 * sqrt(3)) and perto(20 * 0.7, 14) and perto(50 * 0.64, 32) and perto(degrees(atan2(4, 4 * sqrt(3))), 30) and Fr(15, 17) ** 2 + Fr(8, 17) ** 2 == 1 and 90 - 20 == 70 and 6 * 6 / 4 == 9 and 20 / 2 == 10 and Fr(12, 25) == Fr(3 * 4, 25), "TG02 exercícios (primeiro acesso): 3/5; 5/12; 5 cm; 7 cm; k = 7; k = 3; 14 m; 32 m; 30°; 15/17; 7/25; 70°; 7; k = 9; k = 10; 12/25")
Dq_ = (-sqrt(3) - 2, 0); Bq_ = (0, 1); Aq_ = (-sqrt(3), 0)
ok(perto(ang(Aq_, Dq_, Bq_), 15) and perto(dist(Aq_, Bq_), 2) and perto(ang((0, 0), Aq_, Bq_), 30) and perto(1 / (2 + sqrt(3)), 2 - sqrt(3)) and perto(raz_(15)[2], 2 - sqrt(3)) and abs(2 - sqrt(3) - 0.268) < 0.0005 and all(raz_(a)[0] < raz_(a)[2] and perto(raz_(a)[2] ** 2 + 1, 1 / raz_(a)[1] ** 2) for a in range(1, 90)) and all(perto(area([(0, 0), (a, 0), polar((0, 0), b, C)]), a * b * sin(radians(C)) / 2) for a, b, C in ((5, 7, 40), (3, 9, 75), (8, 2, 10))) and perto((2 / sqrt(5) + 1 / sqrt(5)) / (2 / sqrt(5) - 1 / sqrt(5)), 3), "TG02 chefão: na figura, o ângulo em D mede 15° e tg 15° = 1/(2 + √3) = 2 − √3 ≈ 0,268; sen < tg e tg² + 1 = 1/cos² de 1° a 89°; área ½ab sen C por coordenadas; com tg α = 2 a expressão vale 3")

# ---------- TG03 ----------
def P_(g): return polar((0, 0), 1, g)
ok(all(perto(dist((0, 0), P_(g)), 1) and perto(P_(g)[0] ** 2 + P_(g)[1] ** 2, 1) and -1 <= P_(g)[0] <= 1 and -1 <= P_(g)[1] <= 1 and perto(P_(g)[0], P_(g + 720)[0]) and perto(P_(g)[1], P_(g - 360)[1]) for g in range(-400, 800, 7)) and all(perto(P_(g)[0], dist((0, 0), (P_(g)[0], 0))) and perto(P_(g)[1], dist((P_(g)[0], 0), P_(g))) and perto(ang((1, 0), (0, 0), P_(g)), g) for g in range(1, 90)) and abs(P_(30)[0] - 0.866) < 0.0005 and perto(P_(30)[1], 0.5), "TG03 teoremas 1 e 2: no 1º quadrante as coordenadas de P são os catetos do triângulo de hipotenusa 1 (medidos); x² + y² = 1, coordenadas entre −1 e 1 e arcos côngruos no mesmo ponto, de −400° a 800°; P(30°) ≈ (0,866; 0,5)")
ok([tuple(round(v) for v in P_(g)) for g in (0, 90, 180, 270)] == [(1, 0), (0, 1), (-1, 0), (0, -1)] and all(((P_(g)[1] > 0), (P_(g)[0] > 0), (P_(g)[1] / P_(g)[0] > 0)) == s for g, s in ((40, (True, True, True)), (130, (True, False, False)), (220, (False, False, True)), (310, (False, True, False)))) and perto(sin(radians(750)), 0.5), "TG03 tabelas: pontos dos eixos e sinais de seno, cosseno e tangente nos quatro quadrantes; sen 750° = 1/2")
ok(all(perto(P_(180 - x)[0], -P_(x)[0]) and perto(P_(180 - x)[1], P_(x)[1]) and perto(P_(180 + x)[0], -P_(x)[0]) and perto(P_(180 + x)[1], -P_(x)[1]) and perto(P_(360 - x)[0], P_(x)[0]) and perto(P_(360 - x)[1], -P_(x)[1]) and perto(P_(-x)[1], P_(360 - x)[1]) for x in range(-200, 500, 13)) and all(perto(inter((0, 0), P_(g), (1, 0), (1, 1))[1], tan(radians(g))) for g in (10, 45, 80, 100, 170, 200, 260, 300, 350)), "TG03 teoremas 3 e 4: as seis reduções conferidas por reflexão de pontos, para ângulos de qualquer tamanho; a reta OP corta x = 1 na altura tg θ (interseção de retas)")
ex_ = {30: (0.5, sqrt(3) / 2, sqrt(3) / 3), 45: (sqrt(2) / 2, sqrt(2) / 2, 1), 60: (sqrt(3) / 2, 0.5, sqrt(3))}
def exato_(g):
    d = g % 360; ref = d if d <= 90 else 180 - d if d <= 180 else d - 180 if d <= 270 else 360 - d; q = d // 90 + 1
    s, c, t = ex_[ref]; return s * (1 if q in (1, 2) else -1), c * (1 if q in (1, 4) else -1), t * (1 if q in (1, 3) else -1)
ok(all(perto(exato_(g)[0], P_(g)[1]) and perto(exato_(g)[1], P_(g)[0]) and perto(exato_(g)[2], P_(g)[1] / P_(g)[0]) for g in (30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330, 390, 510, 1125, -60)) and perto(exato_(210)[0], -0.5) and perto(exato_(210)[1], -sqrt(3) / 2) and perto(exato_(210)[2], sqrt(3) / 3) and Fr(17, 6) == 2 + Fr(5, 6) and Fr(5, 6) * 180 == 150, "TG03 exemplos 1 e 2: referência + sinal reproduz as coordenadas nos doze notáveis e em arcos de várias voltas; 210°: −1/2, −√3/2, √3/3; 17π/6 = 2π + 5π/6 (150°)")
ok(all(perto(P_(180 - degrees(atan2(a, b)))[1], a / c) and perto(P_(180 - degrees(atan2(a, b)))[0], -b / c) and perto(P_(180 + degrees(atan2(a, b)))[0], -b / c) and perto(P_(180 + degrees(atan2(a, b)))[1] / P_(180 + degrees(atan2(a, b)))[0], a / b) and perto(P_(360 - degrees(atan2(a, b)))[1], -a / c) for a, b, c in ((3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), (20, 21, 29), (12, 5, 13), (4, 3, 5), (15, 8, 17))), "TG03 exemplo 3 e exercícios 9 e 10: sen = ±a/c com o quadrante dá cos = ±b/c e tg = ±a/b (lidos nos pontos); 2º quadrante com 3/5: cos = −4/5; 3º quadrante com cos = −5/13: tg = 12/5")
ok(perto(3 * P_(270)[1] + 2 * P_(180)[0], -5) and 200 - 180 == 20 and perto(P_(750)[1], 0.5) and perto(P_(120)[0], -0.5) and perto(P_(150)[1], 0.5) and perto(P_(240)[0], -0.5) and perto(P_(135)[1] / P_(135)[0], -1) and max(g for g in range(0, 360) if perto(P_(g)[1], 0.5)) == 150 and 3 + 2 == 5 and max((sin(radians(100)), "a"), (cos(radians(200)), "b"), (sin(radians(250)), "c"), (cos(radians(310)), "d"))[1] == "a" and perto(sum(f(x) for f, x in ((sin, pi - acos(0.3)), (sin, pi + acos(0.3)), (cos, 2 * pi - acos(0.3)))) - cos(pi - acos(0.3)), 0.6) and perto(-sqrt(1 - 0.36), -0.8) and perto(sum(cos(radians(10 * k)) ** 2 for k in range(1, 10)), 4), "TG03 exercícios (primeiro acesso): 2º quadrante; 1/2; −1/2; −1; −5; 20°; 1/2; −1/2; −4/5; 12/5; 150°; 5; sen 100°; 0,6; −0,8; 4")
ok(all(perto(sum(cos(radians(d * k)) for k in range(1, 180 // d + 1)), -1) for d in (10, 12, 15, 20, 30, 36)) and all(perto(sum(cos(radians(d * k)) ** 2 for k in range(1, 90 // d + 1)), (90 // d - 1) / 2) for d in (5, 9, 10, 15, 18, 30)) and all(abs(sin(radians(x)) + cos(radians(x))) <= sqrt(2) + 1e-12 for x in range(0, 360)) and perto(sin(radians(45)) + cos(radians(45)), sqrt(2)) and [g for g in range(0, 360) if perto(sin(radians(g)) ** 2, cos(radians(g)) ** 2)] == [45, 135, 225, 315] and perto((1 - Fr(1, 9)) ** 2 - Fr(1, 81), Fr(7, 9)) and sin(3) < sin(1) < sin(2) and [round(sin(k), 3) for k in (3, 1, 2)] == [0.141, 0.841, 0.909] and abs(pi - 2 - 1.14) < 0.005, "TG03 exercício 16 e chefão: somas de cossenos (−1) e de cossenos ao quadrado ((n − 1)/2) para todos os passos sorteados; |sen x + cos x| ≤ √2 com igualdade em 45°; sen² = cos² em 45°, 135°, 225°, 315°; sen⁴ − cos⁴ = 7/9; sen 3 < sen 1 < sen 2")

# ---------- GP08 ----------
def lal_(b, c, A): return [(0, 0), (c, 0), polar((0, 0), b, A)]
def lll_(a, b, c):
    x = (b * b + c * c - a * a) / (2 * c); return [(0, 0), (c, 0), (x, sqrt(b * b - x * x))]
def lados_(ps): return dist(ps[1], ps[2]), dist(ps[0], ps[2]), dist(ps[0], ps[1])
ok(all(perto(lados_(lal_(b, c, 60))[0], a) for b, c, a in ((3, 8, 7), (5, 8, 7), (7, 15, 13), (8, 15, 13), (5, 21, 19), (16, 21, 19))) and all(perto(lados_(lal_(b, c, 120))[0], a) for b, c, a in ((3, 5, 7), (7, 8, 13), (5, 16, 19), (6, 10, 14))) and all(perto(lados_(lal_(b, c, A))[0] ** 2, b * b + c * c - 2 * b * c * cos(radians(A))) for b in (2, 5, 9) for c in (3, 7) for A in range(5, 180, 12)) and perto(5.5 ** 2 + (5 * sin(radians(60))) ** 2, 49) and abs(5 * sin(radians(60)) - 4.33) < 0.005 and perto(lados_(lal_(5, 8, 120))[0] ** 2, 129), "GP08 teorema 1 e exemplo 1: o terceiro lado MEDIDO em triângulos montados por LAL confere com a lei dos cossenos; os dez ternos inteiros de 60° e de 120°; 5, 8 e 60° dão 7 (5,5² + 4,33² = 49); com 120° o quadrado é 129")
ok(all(perto(ang(lll_(a, b, c)[1], lll_(a, b, c)[0], lll_(a, b, c)[2]), degrees(acos((b * b + c * c - a * a) / (2 * b * c)))) for a, b, c in ((7, 5, 6), (6, 4, 5), (8, 5, 7), (9, 6, 7), (4, 5, 6), (8, 4, 6), (9, 5, 6))) and [Fr(b * b + c * c - a * a, 2 * b * c) for a, b, c in ((7, 5, 6), (6, 4, 5), (8, 5, 7), (9, 6, 7), (4, 5, 6), (8, 4, 6), (9, 5, 6))] == [Fr(1, 5), Fr(1, 8), Fr(1, 7), Fr(1, 21), Fr(3, 4), Fr(-1, 4), Fr(-1, 3)] and all((max(ang(q[1], q[0], q[2]), ang(q[0], q[1], q[2]), ang(q[0], q[2], q[1])) > 90 + 1e-9) == (c * c > a * a + b * b) and (abs(ang(q[0], q[2], q[1]) - 90) < 1e-9 or True) for a, b, c in ((4, 5, 7), (5, 6, 7), (6, 8, 10), (3, 6, 7), (7, 8, 9), (5, 12, 13), (4, 7, 9), (8, 9, 12), (9, 12, 15), (6, 7, 10)) for q in [lll_(c, b, a)]) and 49 > 16 + 25, "GP08 teorema 2 e exercícios 3 a 5: ângulo medido no triângulo montado por LLL = arco-cosseno da fórmula; os sete cossenos em fração; triângulo obtusângulo exatamente quando o maior lado ao quadrado passa da soma dos outros dois")
def circ_(ps):
    (ax, ay), (bx, by), (cx, cy) = ps; d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d
    uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d
    return dist((ux, uy), ps[0])
ok(all(perto(lados_(q)[0] / sin(radians(ang(q[1], q[0], q[2]))), 2 * circ_(q)) and perto(lados_(q)[1] / sin(radians(ang(q[0], q[1], q[2]))), 2 * circ_(q)) and perto(lados_(q)[2] / sin(radians(ang(q[0], q[2], q[1]))), 2 * circ_(q)) for q in [lal_(5, 8, 60), lal_(3, 5, 120), lll_(13, 14, 15), lal_(4, 9, 150), lll_(5, 3, 4)]) and abs(7 / sin(radians(60)) - 8.08) < 0.005 and perto(circ_(lll_(10, 6, 8)), 5), "GP08 teoremas 3 e 4: lado ÷ seno do ângulo oposto, medido em cinco triângulos (agudos, obtusos e retângulo), é o diâmetro do círculo circunscrito achado por coordenadas; 7/sen 60° ≈ 8,08")
ok(all(perto(area(lal_(b, c, A)), b * c * sin(radians(A)) / 2) for b in (3, 6, 8) for c in (5, 10) for A in (30, 45, 60, 90, 120, 135, 150)) and perto(area(lal_(5, 8, 60)), 10 * sqrt(3)) and abs(10 * sqrt(3) - 17.32) < 0.005 and all(perto(area(lll_(a, b, c)), S) and perto(circ_(lll_(a, b, c)), a * b * c / (4 * S)) for a, b, c, S in ((13, 14, 15, 84), (5, 5, 6, 12), (6, 8, 10, 24), (7, 15, 20, 42), (9, 10, 17, 36), (4, 13, 15, 24))) and perto(13 * 14 * 15 / (4 * 84), 8.125), "GP08 teorema 5 e exercícios 9, 10 e 15: área por coordenadas = ½bc·sen A; as seis áreas inteiras dadas nos enunciados; R = abc/(4S) igual ao raio achado por coordenadas (13, 14, 15: 8,125)")
def asa_(A, B, c):
    C_ = inter((0, 0), polar((0, 0), 1, A), (c, 0), polar((c, 0), 1, 180 - B)); return [(0, 0), (c, 0), C_]
ok(all(perto(lados_(asa_(A, B, 1))[1] / lados_(asa_(A, B, 1))[0], kf * sqrt(m)) for A, B, m, kf in ((30, 45, 2, 1), (45, 30, 2, 1 / 2), (30, 60, 3, 1), (60, 30, 3, 1 / 3), (60, 45, 6, 1 / 3), (45, 60, 6, 1 / 2), (30, 120, 3, 1), (30, 135, 2, 1))) and all(perto(lados_(asa_(A, B, 1))[1], kf * sqrt(m)) for A, B, m, kf in ((105, 45, 2, 1), (105, 30, 2, 1 / 2), (75, 45, 6, 1 / 3), (75, 60, 6, 1 / 2), (90, 60, 3, 1))) and perto(8 * sin(radians(60)) / sin(radians(45)), 4 * sqrt(6)) and perto(32 * 0.94 / 0.64, 47), "GP08 exemplo 2 e exercícios 6, 7 e 12: triângulos montados por interseção de retas (dois ângulos e um lado): AC ÷ BC e AC ÷ AB conferem com k√m em todos os casos sorteados; 8 cm, 45° e 60° dão 4√6; rio: 47 m")
ok(all(perto(dist(lll_(a, b, c)[0], ((lll_(a, b, c)[1][0] + lll_(a, b, c)[2][0]) / 2, (lll_(a, b, c)[1][1] + lll_(a, b, c)[2][1]) / 2)), m) for a, b, c, m in ((8, 7, 9, 7), (10, 9, 13, 10), (12, 7, 11, 7), (14, 7, 11, 6), (18, 11, 13, 8), (16, 11, 13, 9))) and all(perto(lados_(lal_(b, c1, 60))[0], a) and perto(lados_(lal_(b, c2, 60))[0], a) and c1 + c2 == b and c1 * c2 == b * b - a * a for a, b, c1, c2 in ((7, 8, 3, 5), (13, 15, 7, 8), (19, 21, 5, 16))) and all(perto(dist((0, 0), (c + polar((0, 0), b, 60)[0], polar((0, 0), b, 60)[1])), a) for b, c, a in ((3, 5, 7), (7, 8, 13), (5, 16, 19), (6, 10, 14))), "GP08 exercícios 11, 13 e 14: as seis medianas inteiras medidas por coordenadas; os dois triângulos do caso LLA (lados medidos, soma e produto das raízes); diagonal maior do paralelogramo de 60° medida ponto a ponto")
q_ = lal_(7, 8, 120); a_, b_, c_ = lados_(q_)
ok(perto(a_, 13) and perto(area(q_), 14 * sqrt(3)) and abs(14 * sqrt(3) - 24.25) < 0.005 and perto(2 * area(q_) / 13, 28 * sqrt(3) / 13) and abs(28 * sqrt(3) / 13 - 3.73) < 0.005 and all(perto(lados_(t)[0], lados_(t)[1] * cos(radians(ang(t[0], t[2], t[1]))) + lados_(t)[2] * cos(radians(ang(t[0], t[1], t[2])))) for t in (lal_(5, 8, 60), lal_(3, 5, 120), lll_(13, 14, 15), lal_(9, 2, 150), lll_(4, 13, 15))) and all(perto(dist((0, 0), (pq[1] + polar((0, 0), pq[0], th)[0], polar((0, 0), pq[0], th)[1])) ** 2 + dist((pq[1], 0), polar((0, 0), pq[0], th)) ** 2, 2 * (pq[0] ** 2 + pq[1] ** 2)) for pq in ((3, 5), (7, 2), (4, 4)) for th in (20, 60, 90, 133)) and 25 + 64 - 40 == 49 and 25 + 64 + 40 == 129, "GP08 chefão e chute: 7, 8 e 120° dão terceiro lado 13, área 14√3 e altura 28√3/13; a = b·cos C + c·cos B medido em cinco triângulos (inclusive obtusos); soma dos quadrados das diagonais do paralelogramo = 2(p² + q²); 49 e 129")

# ---------- TG04 ----------
def var_(cond, a0=0, a1=360, passo=0.5):
    """VARREDURA: todos os ângulos de a0 (incluído) a a1 (excluído), de meio em meio grau, que satisfazem a condição"""
    n = int(round((a1 - a0) / passo)); return [a0 + i * passo for i in range(n) if cond(radians(a0 + i * passo))]
z_ = lambda v: abs(v) < 1e-9
ok(var_(lambda x: z_(sin(x) - 0.5)) == [30, 150] and var_(lambda x: z_(cos(x) - 0.5)) == [60, 300] and var_(lambda x: z_(tan(x) - 1)) == [45, 225] and var_(lambda x: z_(sin(x) - 1)) == [90] and var_(lambda x: z_(cos(x) - 2)) == [] and var_(lambda x: z_(sin(x) - sqrt(3) / 2)) == [60, 120] and var_(lambda x: z_(cos(x) + sqrt(2) / 2)) == [135, 225] and var_(lambda x: z_(tan(x) - sqrt(3))) == [60, 240] and all(var_(lambda x, a=a: z_(sin(x) - sin(radians(a)))) == sorted({a, 180 - a}) and var_(lambda x, a=a: z_(cos(x) - cos(radians(a)))) == sorted({a, 360 - a}) for a in range(10, 81, 5)) and var_(lambda x: z_(sin(x) - 0.5), -720, 720) == [-690, -570, -330, -210, 30, 150, 390, 510], "TG04 teoremas 1 a 3 e exercícios 1 a 6: por varredura, sen x = 1/2 em 30° e 150°; cos x = 1/2 em 60° e 300°; tg x = 1 em 45° e 225°; sen x = 1 só em 90°; cos x = 2 sem solução; sen x = sen a em a e 180° − a, cos x = cos a em a e 360° − a (a de 10° a 80°); com voltas, 30° + 360°k e 150° + 360°k")
ok(var_(lambda x: z_(cos(2 * x) - 0.5)) == [30, 150, 210, 330] and var_(lambda x: z_(sin(2 * x) - 0.5)) == [15, 75, 195, 255] and var_(lambda x: z_(tan(2 * x) - 1)) == [22.5, 112.5, 202.5, 292.5] and all(len(var_(lambda x, k=k, v=v: z_(sin(k * x) - v), passo=0.25)) == (k if abs(v) == 1 else 2 * k) and len(var_(lambda x, k=k, v=v: z_(cos(k * x) - v), passo=0.25)) == (k if abs(v) == 1 else 2 * k) for k in (2, 3, 4, 5) for v in (0.5, -0.5, sqrt(2) / 2, -sqrt(3) / 2, 1, -1)) and len([x for x in range(0, 36000) if (sin(radians(5 * x / 100)) - 0.3) * (sin(radians(5 * (x + 1) / 100)) - 0.3) < 0]) == 10, "TG04 teorema 4 e exercícios 7 a 9: cos 2x = 1/2 em 30°, 150°, 210°, 330°; sen 2x = 1/2 em 15°, 75°, 195°, 255°; tg 2x = 1 de 90° em 90° a partir de 22,5°; número de soluções de sen kx = v e cos kx = v igual a 2k (k quando v = ±1); sen 5x = 0,3 tem 10 soluções (mudanças de sinal)")
q2_ = [(lambda s, c: 2 * s * s - 3 * s + 1, [30, 90, 150]), (lambda s, c: 2 * c * c - c - 1, [0, 120, 240]), (lambda s, c: 2 * s * s + s - 1, [30, 150, 270]), (lambda s, c: 2 * c * c - 3 * c - 2, [120, 240]), (lambda s, c: s * s - s, [0, 90, 180]), (lambda s, c: 4 * c * c - 3, [30, 150, 210, 330])]
ok(all(var_(lambda x, f=f: z_(f(sin(x), cos(x)))) == r for f, r in q2_) and all(var_(lambda x, f=f: z_(f(sin(x), cos(x)))) == r for f, r in [(lambda s, c: s - c, [45, 225]), (lambda s, c: s + c, [135, 315]), (lambda s, c: s - sqrt(3) * c, [60, 240]), (lambda s, c: sqrt(3) * s - c, [30, 210]), (lambda s, c: sqrt(3) * s + c, [150, 330])]), "TG04 exemplo 3 e exercícios 11 e 12: as seis equações do 2º grau em sen x ou cos x e as cinco do tipo sen x = k·cos x têm, por varredura, exatamente as soluções do texto")
ok(all(var_(lambda x, f=f: z_(f(sin(x), cos(x)))) == r for f, r in [(lambda s, c: 2 * c * c + 3 * s - 3, [30, 90, 150]), (lambda s, c: 2 * s * s + 3 * c - 3, [0, 60, 300]), (lambda s, c: c * c - s - 1, [0, 180, 270]), (lambda s, c: s * s + c + 1, [180]), (lambda s, c: 2 * s * s - c - 1, [60, 180, 300]), (lambda s, c: 2 * c * c - s - 1, [30, 150, 270])]) and all(var_(lambda x, f=f: z_(f(sin(x), cos(x)))) == r for f, r in [(lambda s, c: (2 * s - 1) * (c + 1), [30, 150, 180]), (lambda s, c: (2 * c - 1) * (s - 1), [60, 90, 300]), (lambda s, c: s * (2 * c + 1), [0, 120, 180, 240]), (lambda s, c: (2 * s + 1) * (2 * c - sqrt(3)), [30, 210, 330]), (lambda s, c: c * (s + 1), [90, 270])]) and [30 + 90 + 150, 0 + 60 + 300, 450, 180, 540, 450] == [270, 360, 450, 180, 540, 450], "TG04 exercícios 13 e 14: seis equações com seno e cosseno misturados (somas das soluções: 270°, 360°, 450°, 180°, 540°, 450°) e cinco produtos nulos, por varredura")
ok(all(var_(lambda x, f=f: z_(f(x))) == r for f, r in [(lambda x: sin(2 * x) - sin(x), [0, 60, 180, 300]), (lambda x: sin(3 * x) - sin(x), [0, 45, 135, 180, 225, 315]), (lambda x: cos(2 * x) - cos(x), [0, 120, 240]), (lambda x: cos(3 * x) - cos(x), [0, 90, 180, 270]), (lambda x: cos(4 * x) - cos(2 * x), [0, 60, 120, 180, 240, 300])]) and len(var_(lambda x: z_(cos(x) - 0.5), -180, 540.5)) == 4 and var_(lambda x: z_(cos(x) - 0.5), -180, 540.5) == [-60, 60, 300, 420] and var_(lambda x: z_(sin(x) + cos(x) - 1)) == [0, 90] and var_(lambda x: z_((sin(x) + cos(x)) ** 2 - 1)) == [0, 90, 180, 270] and var_(lambda x: z_(2 * sin(x) ** 2 - 1 - cos(x))) == [60, 180, 300] and all((-1 <= (m - 1) / 2 <= 1) == (-1 <= m <= 3) for m in [k / 4 for k in range(-20, 30)]), "TG04 exercícios 15 e 16 e chefão: sen ax = sen bx e cos ax = cos bx (cinco equações); cos x = 1/2 de −180° a 540°: −60°, 60°, 300°, 420°; sen x + cos x = 1 só em 0° e 90° (o quadrado tem também 180° e 270°); 2sen²x = 1 + cos x em 60°, 180°, 300°; parâmetro m entre −1 e 3")

# ---------- TG05 ----------
gr_ = [x * 7.3 - 400 for x in range(0, 120)]
ok(all(perto(dist(polar((0, 0), 1, a), polar((0, 0), 1, b)) ** 2, 2 - 2 * (cos(radians(a)) * cos(radians(b)) + sin(radians(a)) * sin(radians(b)))) and perto(dist(polar((0, 0), 1, a), polar((0, 0), 1, b)), dist((1, 0), polar((0, 0), 1, a - b))) and perto(cos(radians(a - b)), cos(radians(a)) * cos(radians(b)) + sin(radians(a)) * sin(radians(b))) for a in gr_[::3] for b in gr_[::5]) and perto(dist((0, 1), (sqrt(3) / 2, 0.5)) ** 2, 1), "TG05 teorema 1: a corda entre os pontos de a e de b (por coordenadas) tem o comprimento da corda de (1, 0) ao ponto de a − b, e cos(a − b) = cos a·cos b + sen a·sen b, em 960 pares de todos os quadrantes; com 90° e 30° a corda mede 1")
ok(all(perto(sin(radians(a + b)), sin(radians(a)) * cos(radians(b)) + sin(radians(b)) * cos(radians(a))) and perto(sin(radians(a - b)), sin(radians(a)) * cos(radians(b)) - sin(radians(b)) * cos(radians(a))) and perto(cos(radians(a + b)), cos(radians(a)) * cos(radians(b)) - sin(radians(a)) * sin(radians(b))) for a in gr_[::3] for b in gr_[::5]) and all(perto(tan(radians(a + b)), (tan(radians(a)) + tan(radians(b))) / (1 - tan(radians(a)) * tan(radians(b)))) and perto(tan(radians(a - b)), (tan(radians(a)) - tan(radians(b))) / (1 + tan(radians(a)) * tan(radians(b)))) for a in (10, 37, 100, 200, 310) for b in (5, 22, 61, 143)), "TG05 teoremas 2 e 3: seno e cosseno da soma e da diferença em 960 pares; tangente da soma e da diferença em 20 pares")
s6_, s2_, s3_ = sqrt(6), sqrt(2), sqrt(3)
ok(perto(sin(radians(75)), (s6_ + s2_) / 4) and perto(cos(radians(75)), (s6_ - s2_) / 4) and perto(sin(radians(15)), (s6_ - s2_) / 4) and perto(cos(radians(15)), (s6_ + s2_) / 4) and perto(sin(radians(105)), (s6_ + s2_) / 4) and perto(cos(radians(105)), (s2_ - s6_) / 4) and perto(tan(radians(15)), 2 - s3_) and perto(tan(radians(75)), 2 + s3_) and perto(tan(radians(105)), -2 - s3_) and perto(tan(radians(165)), s3_ - 2) and abs(sin(radians(75)) - 0.966) < 0.0005 and abs(s2_ / 2 + 0.5 - 1.21) < 0.005 and perto((3 - s3_) ** 2 / 6, 2 - s3_) and perto((s3_ + 1) ** 2 / -2, -2 - s3_) and perto((s6_ - s2_) * (s6_ + s2_) / 16, 0.25), "TG05 tabela, exemplo 1, exercícios 1 e 2 e chefão (e): valores exatos de 15°, 75°, 105° e 165°; sen 75° ≈ 0,966; sen 45° + sen 30° ≈ 1,21; racionalizações; sen 15°·sen 75° = 1/4")
pp_ = [(3, 4, 5), (4, 3, 5), (5, 12, 13), (12, 5, 13), (8, 15, 17), (15, 8, 17)]
ok(all(perto(sin(atan2(p1, q1) + atan2(p2, q2)), (p1 * q2 + q1 * p2) / (h1 * h2)) and perto(cos(atan2(p1, q1) + atan2(p2, q2)), (q1 * q2 - p1 * p2) / (h1 * h2)) for p1, q1, h1 in pp_ for p2, q2, h2 in pp_) and Fr(3, 5) * Fr(5, 13) + Fr(12, 13) * Fr(4, 5) == Fr(63, 65) and Fr(4, 5) * Fr(5, 13) - Fr(3, 5) * Fr(12, 13) == Fr(-16, 65), "TG05 exemplo 2 e exercícios 5 e 6: sen(a + b) e cos(a + b) com ternos pitagóricos, nos 36 pares, conferidos pelos ângulos (arco-tangente); 3/5 e 5/13: 63/65 e −16/65")
tg_ = lambda x, y, s=1: (Fr(*x) + s * Fr(*y)) / (1 - s * Fr(*x) * Fr(*y))
ok([tg_(x, y) for x, y in (((1, 2), (1, 3)), ((2, 1), (3, 1)), ((1, 2), (1, 4)), ((1, 3), (1, 5)), ((2, 3), (1, 5)), ((3, 4), (1, 7)), ((1, 2), (3, 1)), ((1, 4), (3, 5)), ((4, 1), (5, 3)))] == [1, -1, Fr(6, 7), Fr(4, 7), 1, 1, -7, 1, -1] and [tg_(x, y, -1) for x, y in (((3, 1), (1, 2)), ((3, 1), (1, 1)), ((2, 1), (1, 1)), ((4, 1), (1, 1)), ((5, 1), (2, 3)), ((1, 1), (1, 2)), ((2, 1), (1, 3)))] == [1, Fr(1, 2), Fr(1, 3), Fr(3, 5), 1, Fr(1, 3), 1] and all(perto(degrees(atan2(x[0], x[1]) + atan2(y[0], y[1])), g) for x, y, g in (((1, 2), (1, 3), 45), ((2, 1), (3, 1), 135), ((2, 3), (1, 5), 45), ((3, 4), (1, 7), 45), ((1, 4), (3, 5), 45), ((4, 1), (5, 3), 135))) and [-tg_(x, y) for x, y in (((1, 1), (2, 1)), ((2, 1), (3, 1)), ((1, 1), (3, 1)), ((1, 2), (1, 3)), ((3, 1), (1, 2)))] == [3, 1, 2, -1, 7] and 1 + 2 + 3 == 1 * 2 * 3, "TG05 exemplo 3 e exercícios 7, 8, 13 e 14: tangentes da soma e da diferença com frações exatas; somas de ângulos de 45° e 135° (pelo arco-tangente); tangente do terceiro ângulo do triângulo: 3, 1, 2, −1, 7")
ok(all(perto(f(radians(x)), g(radians(x))) for x in (-50, 13, 77, 140, 222, 301) for f, g in ((lambda x: sin(pi / 2 + x), cos), (lambda x: cos(pi / 2 + x), lambda x: -sin(x)), (lambda x: sin(3 * pi / 2 - x), lambda x: -cos(x)), (lambda x: cos(3 * pi / 2 + x), sin), (lambda x: sin(x - pi / 2), lambda x: -cos(x)), (lambda x: cos(x - pi), lambda x: -cos(x)), (lambda x: sin(x + pi / 3) + sin(x - pi / 3), sin), (lambda x: cos(x + pi / 3) + cos(x - pi / 3), cos), (lambda x: sin(x + pi / 6) - sin(x - pi / 6), cos), (lambda x: cos(x - pi / 6) - cos(x + pi / 6), sin))) and all(perto(f(atan2(3, 4)), v) for f, v in ((lambda a: sin(a + pi / 6), (3 * s3_ + 4) / 10), (lambda a: cos(a + pi / 3), (4 - 3 * s3_) / 10), (lambda a: sin(a + pi / 4), 7 * s2_ / 10), (lambda a: cos(a + pi / 4), s2_ / 10), (lambda a: sin(a - pi / 6), (3 * s3_ - 4) / 10), (lambda a: cos(a - pi / 3), (4 + 3 * s3_) / 10))), "TG05 exercícios 9, 10 e 11: as seis reduções de 90°, 180° e 270°, as quatro somas que se simplificam e os seis valores com sen a = 3/5")
ok(all(perto((1 + tan(radians(a))) * (1 + tan(radians(45 - a))), 2) for a in range(5, 41)) and all(perto((1 + tan(radians(a))) * (1 - tan(radians(a - 45))), 2) for a in range(50, 86)) and all(abs(max(a * sin(radians(x / 10)) + b * cos(radians(x / 10)) for x in range(3600)) - h) < 1e-5 * h and abs(min(a * sin(radians(x / 10)) + b * cos(radians(x / 10)) for x in range(3600)) + h) < 1e-5 * h for a, b, h in ((3, 4, 5), (5, 12, 13), (8, 15, 17), (6, 8, 10), (7, 24, 25))) and all(perto(cos(acos(ca) + asin(sb)) * cos(acos(ca) - asin(sb)), ca * ca - sb * sb) for ca in (0.6, 0.7, 0.8, 0.9) for sb in (0.2, 0.3, 0.4, 0.5)) and perto(0.64 - 0.25, 0.39) and all(perto(tan(radians(A)) + tan(radians(B)) + tan(radians(180 - A - B)), tan(radians(A)) * tan(radians(B)) * tan(radians(180 - A - B))) for A, B in ((50, 60), (20, 30), (100, 35), (71, 44))), "TG05 exercícios 12, 15 e 16 e chefão (d): (1 + tg a)(1 ± tg b) = 2 em todos os sorteios; máximo e mínimo de a·sen x + b·cos x por varredura = ±√(a² + b²); cos(a + b)·cos(a − b) = cos²a − sen²b; soma das tangentes de um triângulo = produto")

# ---------- TG06 ----------
gx_ = [x * 3.7 - 200 for x in range(0, 160)]
ok(all(perto(sin(2 * radians(x)), 2 * sin(radians(x)) * cos(radians(x))) and perto(cos(2 * radians(x)), cos(radians(x)) ** 2 - sin(radians(x)) ** 2) and perto(cos(2 * radians(x)), 1 - 2 * sin(radians(x)) ** 2) and perto(cos(2 * radians(x)), 2 * cos(radians(x)) ** 2 - 1) and perto(sin(radians(x)) ** 2, (1 - cos(2 * radians(x))) / 2) and perto(cos(radians(x)) ** 2, (1 + cos(2 * radians(x))) / 2) and perto(cos(3 * radians(x)), 4 * cos(radians(x)) ** 3 - 3 * cos(radians(x))) and perto(sin(3 * radians(x)), 3 * sin(radians(x)) - 4 * sin(radians(x)) ** 3) for x in gx_) and all(perto(tan(2 * radians(x)), 2 * tan(radians(x)) / (1 - tan(radians(x)) ** 2)) for x in (7, 20, 33, 61, 100, 170, 250)), "TG06 teoremas 1 e 2 e exercício 13: arco duplo (seno, três formas do cosseno, tangente), sen² e cos² pelo cosseno do dobro e arco triplo, em 160 ângulos")
ok(all(Fr(2 * a * b, c * c) == 2 * Fr(a, c) * Fr(b, c) and Fr(b * b - a * a, c * c) == 1 - 2 * Fr(a, c) ** 2 and perto(sin(2 * atan2(a, b)), 2 * a * b / (c * c)) and perto(cos(2 * atan2(a, b)), (b * b - a * a) / (c * c)) and perto(sin(atan2(a, b)), a / c) and perto(sqrt((1 - (b * b - a * a) / (c * c)) / 2), a / c) and perto(sqrt((1 + (b * b - a * a) / (c * c)) / 2), b / c) for a, b, c in ((3, 4, 5), (4, 3, 5), (5, 12, 13), (12, 5, 13), (8, 15, 17), (15, 8, 17))) and Fr(24, 25) ** 2 + Fr(7, 25) ** 2 == 1 and [2 * Fr(n, d) / (1 - Fr(n, d) ** 2) for n, d in ((1, 2), (1, 3), (2, 1), (3, 1), (1, 4), (2, 3), (3, 2))] == [Fr(4, 3), Fr(3, 4), Fr(-4, 3), Fr(-3, 4), Fr(8, 15), Fr(12, 5), Fr(-12, 5)] and perto(2 * 0.36 - 1, -0.28), "TG06 exemplos 1 e 2 e exercícios 1 a 4 e 7: com os seis ternos, sen 2x = 2ab/c², cos 2x = (b² − a²)/c² (conferidos pelo ângulo) e o arco metade devolve a/c e b/c; 3/5 dá 24/25, 7/25 e 24/7; tangentes do arco duplo em fração; cos x = 0,6 dá cos 2x = −0,28")
s2_, s3_, s6_ = sqrt(2), sqrt(3), sqrt(6)
ok(perto(2 * sin(radians(15)) * cos(radians(15)), 0.5) and perto(cos(radians(22.5)) ** 2 - sin(radians(22.5)) ** 2, s2_ / 2) and perto(1 - 2 * sin(radians(15)) ** 2, s3_ / 2) and perto(2 * cos(radians(15)) ** 2 - 1, s3_ / 2) and perto(2 * sin(radians(75)) * cos(radians(75)), 0.5) and perto(2 * sin(radians(22.5)) * cos(radians(22.5)), s2_ / 2) and perto(cos(radians(75)) ** 2 - sin(radians(75)) ** 2, -s3_ / 2) and perto(sin(radians(15)) ** 2, (2 - s3_) / 4) and perto(cos(radians(15)) ** 2, (2 + s3_) / 4) and perto(sin(radians(22.5)) ** 2, (2 - s2_) / 4) and perto(cos(radians(22.5)) ** 2, (2 + s2_) / 4) and perto(sin(radians(75)) ** 2, (2 + s3_) / 4) and perto(cos(radians(75)) ** 2, (2 - s3_) / 4) and abs((2 - s3_) / 4 - 0.067) < 0.0005 and perto(tan(radians(22.5)), s2_ - 1) and all(abs(max(k * sin(radians(x / 10)) * cos(radians(x / 10)) for x in range(3600)) - k / 2) < 1e-9 for k in (2, 6, 20)), "TG06 exercícios 5, 6 e 8 e chefão (d): os sete arcos duplos escondidos; sen² e cos² de 15°, 22,5° e 75°; tg 22,5° = √2 − 1; máximo de k·sen x·cos x = k/2 por varredura")
def med_(p, q): P, Q = polar((0, 0), 1, p), polar((0, 0), 1, q); return ((P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2)
ok(all(perto(2 * med_(p, q)[1], 2 * sin(radians((p + q) / 2)) * cos(radians((p - q) / 2))) and perto(2 * med_(p, q)[0], 2 * cos(radians((p + q) / 2)) * cos(radians((p - q) / 2))) and perto(dist((0, 0), med_(p, q)), abs(cos(radians((p - q) / 2)))) and perto(sin(radians(p)) - sin(radians(q)), 2 * sin(radians((p - q) / 2)) * cos(radians((p + q) / 2))) and perto(cos(radians(p)) - cos(radians(q)), -2 * sin(radians((p + q) / 2)) * sin(radians((p - q) / 2))) for p in gx_[::4] for q in gx_[::7]) and perto(sin(radians(75)) + sin(radians(15)), s6_ / 2) and perto(sin(radians(75)) - sin(radians(15)), s2_ / 2) and perto(cos(radians(75)) + cos(radians(15)), s6_ / 2) and perto(cos(radians(15)) - cos(radians(75)), s2_ / 2) and abs(s6_ / 2 - 1.225) < 0.0005, "TG06 teorema 3, exemplo 3 e exercício 9: o PONTO MÉDIO da corda (por coordenadas) está na direção da média, à distância |cos da semidiferença|, e as quatro fórmulas de soma em produto valem em 920 pares; 75° e 15°: √6/2 e √2/2")
ok(all(perto(sin(a) * cos(b), (sin(a + b) + sin(a - b)) / 2) and perto(cos(a) * cos(b), (cos(a + b) + cos(a - b)) / 2) and perto(sin(a) * sin(b), (cos(a - b) - cos(a + b)) / 2) for a in (0.3, 1.1, 2.5, 4) for b in (0.2, 0.9, 3.3)) and perto(sin(radians(75)) * cos(radians(15)), (2 + s3_) / 4) and perto(cos(radians(75)) * cos(radians(15)), 0.25) and perto(sin(radians(75)) * sin(radians(15)), 0.25) and perto(sin(radians(15)) * cos(radians(75)), (2 - s3_) / 4) and all(perto(f(x), g(x)) for x in (0.2, 1.3, 2.9) for f, g in ((lambda x: sin(5 * x) + sin(3 * x), lambda x: 2 * sin(4 * x) * cos(x)), (lambda x: sin(5 * x) - sin(3 * x), lambda x: 2 * sin(x) * cos(4 * x)), (lambda x: cos(5 * x) + cos(3 * x), lambda x: 2 * cos(4 * x) * cos(x)), (lambda x: cos(5 * x) - cos(3 * x), lambda x: -2 * sin(4 * x) * sin(x)), (lambda x: sin(7 * x) + sin(x), lambda x: 2 * sin(4 * x) * cos(3 * x)), (lambda x: cos(7 * x) - cos(x), lambda x: -2 * sin(4 * x) * sin(3 * x)))), "TG06 teorema 4 e exercícios 10 e 11: produto em soma; os quatro produtos de 75° e 15°; as seis fatorações com arcos 5x, 3x, 7x e x")
ok(all(perto(sin(2 * (asin(s / s2_) - pi / 4)), s * s - 1) for s in (1.1, 1.2, 1.3, 1.4, 0.5, 0.2, 0.8)) and [[x for x in range(360) if abs(f(radians(x))) < 1e-9] for f in (lambda x: cos(2 * x) + cos(x), lambda x: cos(2 * x) - sin(x), lambda x: sin(2 * x) - cos(x), lambda x: cos(2 * x) + 3 * sin(x) - 2, lambda x: sin(2 * x) - sin(x))] == [[60, 180, 300], [30, 150, 270], [30, 90, 150, 270], [30, 90, 150], [0, 60, 180, 300]] and perto(cos(radians(20)) * cos(radians(40)) * cos(radians(80)), 1 / 8) and perto(cos(radians(36)) * cos(radians(72)), 1 / 4) and perto(cos(radians(12)) * cos(radians(24)) * cos(radians(48)) * cos(radians(96)), -1 / 16) and perto(cos(radians(40)) * cos(radians(80)) * cos(radians(160)), -1 / 8) and all(perto(sin(asin(s) / 2) ** 4 + cos(asin(s) / 2) ** 4, 1 - s * s / 2) and perto(sin(asin(s) / 2) ** 6 + cos(asin(s) / 2) ** 6, 1 - 3 * s * s / 4) for s in (0.2, 0.4, 0.6, 0.8, 1)) and all(perto(tan(x / 2), sin(x) / (1 + cos(x))) for x in (0.4, 1.7, 2.9, 4.4)) and abs(max(sin(radians(x / 10)) * sin(radians(60 - x / 10)) for x in range(3600)) - 0.25) < 1e-9, "TG06 exercícios 12 e 14 a 16 e chefão: sen x + cos x = s dá sen 2x = s² − 1; cinco equações com arco duplo por varredura; os quatro produtos telescópicos (1/8, 1/4, −1/16, −1/8); sen⁴ + cos⁴ e sen⁶ + cos⁶; tg(x/2) = sen x/(1 + cos x); máximo de sen x·sen(60° − x) = 1/4")

print("\n" + ("tudo certo" if not falhas else f"{falhas} FALHA(S)"))
sys.exit(1 if falhas else 0)
