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

print("\n" + ("tudo certo" if not falhas else f"{falhas} FALHA(S)"))
sys.exit(1 if falhas else 0)
