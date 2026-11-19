"""Confere as contas escritas à mão no módulo AL (Álgebra). Rodar: python3 tools/matematica/confere-al.py
Cada linha é uma afirmação do texto de um tema; se alguma falhar, o script sai com código 1.
Sem biblioteca de álgebra: frações exatas (Fraction), inteiros e, onde há raiz ou logaritmo, Decimal com 50 casas."""
from fractions import Fraction as Fr
from decimal import Decimal, getcontext
import itertools
import math
import sys

getcontext().prec = 60
falhas = 0
G = [Fr(-3), Fr(-1), Fr(1, 2), Fr(2), Fr(5)]  # grade de frações para identidades


def ok(cond, msg):
    global falhas
    print(("ok " if cond else "FALHA ") + msg)
    falhas += 0 if cond else 1


# ---------- FX01 ----------
ok(2 * 2 + 3 == 7 and 2 * 5 + 3 == 13 and 2 * (-1) + 3 == 1, "FX01: f(x) = 2x + 3 leva 2 em 7, 5 em 13 e −1 em 1")
ok((1 + 2) ** 2 == 9 and 1 ** 2 + 2 ** 2 == 5, "FX01 pegadinha: f(1 + 2) = 9 e f(1) + f(2) = 5 para f(x) = x²")
ok(3 ** 2 + 4 ** 2 == 25 and 3 ** 2 + (-4) ** 2 == 25, "FX01 teorema 1: (3, 4) e (3, −4) estão na circunferência x² + y² = 25")
ok(4 ** 2 - 2 * 4 - 3 == 5 and 3 ** 2 - 2 * 3 - 3 == 0 and (-1) ** 2 + 2 - 3 == 0 and 1 - 2 - 3 == -4, "FX01 figura: x² − 2x − 3 vale 5 em 4, zera em 3 e −1, mínimo −4 em 1")
f = lambda x: x ** 3 + 2 * x ** 2 - 5 * x + 4
ok(all((f(x) + f(-x)) / 2 == 2 * x ** 2 + 4 and (f(x) - f(-x)) / 2 == x ** 3 - 5 * x for x in G), "FX01 chefão (c) e teorema 2: parte par 2x² + 4 e parte ímpar x³ − 5x")
ok(all(((x ** 2 + 3 * x) + ((-x) ** 2 - 3 * x)) / 2 == x ** 2 for x in G), "FX01 teorema 2: a parte par de x² + 3x é x²")
h = lambda x: 2 / x - x
ok(all(h(x) + 2 * h(1 / x) == 3 * x for x in G) and h(Fr(2)) == -1 and h(Fr(1, 2)) == Fr(7, 2), "FX01 chefão (e): f(x) = 2/x − x resolve f(x) + 2f(1/x) = 3x; f(2) = −1; f(1/2) = 7/2")
ok(2 ** 3 == 8, "FX01 chefão (a): 2³ = 8 funções de {1, 2, 3} em {a, b}")
ok([x for x in range(-3, 4) if 4 - x * x >= 0 and x != 1] == [-2, -1, 0, 2], "FX01 chefão (b): inteiros do domínio de √(4 − x²)/(x − 1)")
ok(3 * 0 == 0 and 3 * 5 == 15 and 3 * (-2) == -6, "FX01 chefão (d): f(x) = 3x dá f(0) = 0, f(5) = 15, f(−2) = −6")
ok(2 ** 4 - 3 * 4 == 4 and 8 - 6 == 2 and -8 + 6 == -2 and 4 + 6 == 10 and 4 - 6 == -2, "FX01 exemplo 3: valores em 2 e −2 de x⁴ − 3x², x³ − 3x e x² + 3x")
ok(2 * (-2) + 3 == -1 and 0 - 4 == -4 and 9 - 4 == 5 and -1 - 4 + 5 == 0, "FX01 exemplo 2: f(−2) = −1, f(0) = −4, f(3) = 5, soma 0")

# ---------- FX02 ----------
g2 = lambda x: 2 * x - 3
ok([g2(x) for x in range(5)] == [-3, -1, 1, 3, 5] and g2(Fr(3, 2)) == 0, "FX02: tabela de 2x − 3 e zero 3/2")
ok(Fr(g2(4) - g2(1), 3) == 2 and Fr(g2(2) - g2(0), 2) == 2, "FX02 teorema 1: taxa 2 de 1 a 4 e de 0 a 2")
ok(all(((a * x2 + b) - (a * x1 + b)) / (x2 - x1) == a for a in G for b in G for x1 in G for x2 in G if x1 != x2), "FX02 teorema 1: taxa de variação constante, em geral")
ok(Fr(5 - 1, 3 - 1) == 2 and 1 - 2 * 1 == -1 and 2 * 3 - 1 == 5, "FX02 teorema 3: por (1, 1) e (3, 5), a = 2 e b = −1")
ok(all(Fr(y2 - y1, x2 - x1) * x1 + (y1 - Fr(y2 - y1, x2 - x1) * x1) == y1 and Fr(y2 - y1, x2 - x1) * x2 + (y1 - Fr(y2 - y1, x2 - x1) * x1) == y2 for x1 in range(-3, 3) for x2 in range(3, 6) for y1 in range(-2, 3) for y2 in range(-2, 3)), "FX02 teorema 3: a e b das fórmulas passam pelos dois pontos")
ok(5 + 3 * 5 == 20 and 5 + 3 * 10 == 35 and 35 < 2 * 20, "FX02 chute: táxi, 5 km = 20 reais, 10 km = 35 reais")
ok(Fr(11 - 5, 5 - 2) == 2 and 5 - 2 * 2 == 1, "FX02 chefão (a): f(x) = 2x + 1")
ok(all(a * 1 + b == b * 1 + a for a in G for b in G), "FX02 chefão (b): ax + b e bx + a coincidem em x = 1")
ok([m for m in range(-4, 5) if m * m - 4 < 0] == [-1, 0, 1], "FX02 chefão (c): m² − 4 < 0 só para −2 < m < 2")
f3 = lambda x: 2 * x + 3
ok(all(f3(f3(x)) == 4 * x + 9 and f3(f3(f3(x))) == 8 * x + 21 for x in G) and 2 ** 3 == 8 and 7 * 3 == 21, "FX02 chefão (e): f(x) = 2x + 3 dá f(f(x)) = 4x + 9 e f(f(f(x))) = 8x + 21")
ok(all(a * (a * x + b) + b == a * a * x + (a + 1) * b for a in G for b in G for x in G), "FX02: f(f(x)) = a²x + (a + 1)b")
ok(2 * 2 - 5 == -1 and 2 * 5 - 5 == 5 and Fr(5 - (-1), 3) == 2, "FX02 exemplo 1: por (2, −1) e (5, 5), a = 2 e b = −5")
ok(-2 * 3 + 6 == 0 and 6 - 2 * 5 == -4 and -2 * 7 + 6 == -8, "FX02 exemplo 2: −2x + 6 zera em 3; −2x + 6 ≥ −4 dá x ≤ 5; f(7) = −8")
ok(abs((50 - 20) / (0.5 - 0.2) - 100) < 1e-9 and 20 + 0.5 * 100 == 70, "FX02 exemplo 3: planos empatam em 100 minutos, a 70 reais")

# ---------- FX03 ----------
ok(all(x * x - 6 * x + 5 == (x - 3) ** 2 - 4 == (x - 1) * (x - 5) for x in G), "FX03: x² − 6x + 5 = (x − 3)² − 4 = (x − 1)(x − 5)")
GA = [Fr(-2), Fr(-1, 2), Fr(1), Fr(3)]
ok(all(a * x * x + b * x + c == a * (x + b / (2 * a)) ** 2 - (b * b - 4 * a * c) / (4 * a) for a in GA for b in G for c in G for x in G), "FX03 teorema 1: ax² + bx + c = a(x + b/2a)² − Δ/4a, em 500 casos")
ok(all(a * ((h + t) - h) ** 2 + k == a * ((h - t) - h) ** 2 + k for a in GA for h in G for k in G for t in G), "FX03 teorema 2: f(h + t) = f(h − t)")
ok((3 - 1) * (3 - 5) == -4 and (6 - 1) * (6 - 5) == 5 and (0 - 1) * (0 - 5) == 5, "FX03 teorema 3: (x − 1)(x − 5) em 3, 6 e 0")
ok(max(x * (20 - x) for x in range(1, 20)) == 100 and 19 * 1 == 19 and 10 * 10 == 100, "FX03 chute: cerca de 40 m, máximo 100 no quadrado; 19 × 1 = 19")
ok(max(Fr(x, 4) * (20 - 2 * Fr(x, 4)) for x in range(0, 41)) == 50 and 5 * 10 == 50, "FX03 exemplo 3: 20 m de tela com muro, máximo 50 m² (5 por 10)")
ok(all(L * L / 8 == Fr(L, 4) * Fr(L, 2) for L in (20, 24, 28, 32, 40)), "FX03: com muro, área máxima L²/8 = (L/4)(L/2)")
p3 = lambda x: x * x - 4 * x + 3
ok(p3(0) == 3 and p3(1) == 0 and p3(2) == -1, "FX03 chefão (a): x² − 4x + 3 passa por (0, 3), (1, 0), (2, −1)")
ok([m for m in range(-6, 7) if m * m - 16 < 0] == list(range(-3, 4)), "FX03 chefão (b): Δ = m² − 16 < 0 para −4 < m < 4")
ok(all((x - 1) ** 2 + (x - 3) ** 2 + (x - 8) ** 2 == 3 * x * x - 24 * x + 74 for x in G) and 9 + 1 + 16 == 26 and Fr(1 + 3 + 8, 3) == 4, "FX03 chefão (c): 3x² − 24x + 74, mínimo 26 em x = 4 (a média)")
ok(max(Fr(x, 10) * (6 - Fr(3, 4) * Fr(x, 10)) for x in range(0, 81)) == 12 and 4 * 3 == 12 and 6 * 8 // 2 == 24, "FX03 chefão (d): retângulo de área máxima 12 (4 por 3)")
ok(all(x * x == -x * x + 4 * x + 6 for x in (-1, 3)) and (-1) ** 2 == 1 and 3 ** 2 == 9, "FX03 chefão (e): cruzam em (−1, 1) e (3, 9)")
ok(30 ** 2 / 20 == 45 and 30 * 3 - 5 * 9 == 45 and 40 / 5 == 8, "FX03: h = 30t − 5t² tem máximo 45 m em t = 3 s; 40t − 5t² volta ao chão em 8 s")
ok(all(2 * x * x - 2 * S * x + S * S == x * x + (S - x) ** 2 for x in G for S in (4, 10, 30)) and 2 * 5 ** 2 == 50, "FX03: x² + (S − x)² = 2x² − 2Sx + S²; para S = 10, mínimo 50")
ok(25 * (100 - 2 * 25) == 1250 and max(q * (100 - 2 * q) for q in range(0, 51)) == 1250, "FX03: receita p(100 − 2p) máxima em p = 25")

# ---------- FX04 ----------
GM = [Fr(-7), Fr(-3), Fr(-1, 2), Fr(0), Fr(2), Fr(5)]
ok(abs(3 - 8) == 5 and abs(-5) == 5 and abs(0) == 0, "FX04: |3 − 8| = 5, |−5| = 5, |0| = 0")
ok(all(abs(a) ** 2 == a * a and abs(a * b) == abs(a) * abs(b) for a in GM for b in GM), "FX04 teorema 1: |a|² = a² e |ab| = |a||b|")
ok(all(Decimal(float(a * a)).sqrt() == abs(float(a)) for a in GM) and math.isqrt((-3) ** 2) == 3, "FX04 teorema 1: √(a²) = |a|; √((−3)²) = 3")
ok(all((abs(Fr(x, 4) - a) < r) == (a - r < Fr(x, 4) < a + r) for a in (-2, 0, 2) for r in (1, 3) for x in range(-40, 41)), "FX04 teorema 2: |x − a| < r ⇔ a − r < x < a + r")
ok([x for x in range(-10, 11) if abs(x - 2) < 3] == [0, 1, 2, 3, 4], "FX04 teorema 2: |x − 2| < 3 tem os inteiros 0 a 4 (−1 < x < 5)")
ok(all(abs(a + b) <= abs(a) + abs(b) and ((abs(a + b) == abs(a) + abs(b)) == (a * b >= 0)) for a in GM for b in GM), "FX04 teorema 3: desigualdade triangular, com igualdade só quando ab ≥ 0")
ok(abs(7 - 4) == 3 and abs(7) + abs(-4) == 11, "FX04 teorema 3: |7 + (−4)| = 3 e |7| + |−4| = 11")
ok(abs(-3 + 3) == 0 and abs(-3) + 3 == 6, "FX04 pegadinha: em x = −3, |x + 3| = 0 e |x| + 3 = 6")
ok(abs(2 * 5 - 4) == 6 and abs(2 * (-1) - 4) == 6, "FX04 exemplo 1: |2x − 4| = 6 tem soluções 5 e −1")
ok(abs(2 * 10 - 8) == 10 + 2 and abs(2 * 2 - 8) == 2 + 2, "FX04 exemplo 3: |2x − 8| = x + 2 tem soluções 10 e 2")
ok([x for x in range(-20, 21) if abs(x - 1) + abs(x - 3) == 4] == [0, 4], "FX04 chefão (a): |x − 1| + |x − 3| = 4 → 0 e 4")
ok(all((abs(Fr(x, 4) - 2) < abs(Fr(x, 4) + 4)) == (Fr(x, 4) > -1) for x in range(-60, 61)), "FX04 chefão (b): |x − 2| < |x + 4| ⇔ x > −1")
ok(min((abs(Fr(x, 4) - 1) + abs(Fr(x, 4) - 2) + abs(Fr(x, 4) - 6), Fr(x, 4)) for x in range(-40, 60)) == (5, 2), "FX04 chefão (c): mínimo 5, em x = 2")
n4 = sum(1 for x in range(-200, 200) for y in range(-200, 200) if abs(x + 0.5) + abs(y + 0.5) <= 200)
ok(4 * Fr(2 * 2, 2) == 8 and abs(n4 / 100 ** 2 - 8) < 0.05, "FX04 chefão (d): área de |x| + |y| ≤ 2 é 4 triângulos de área 2 = 8 (a contagem em grade de 1/100 dá 8,04: a borda entra inteira)")
ok(all(abs(abs(a) - abs(b)) <= abs(a - b) for a in GM for b in GM), "FX04 chefão (e): ||a| − |b|| ≤ |a − b|")
def nsol(k):
    s = set()
    for v in (4 + k, 4 - k):
        if v > 0:
            s |= {round(v ** 0.5, 9), -round(v ** 0.5, 9)}
        elif v == 0:
            s.add(0.0)
    return len(s)
ok([nsol(k) for k in (0, 1, 2, 3, 4, 5, 7)] == [2, 4, 4, 4, 3, 2, 2], "FX04: |x² − 4| = k tem 2, 4, 4, 4, 3, 2, 2 soluções para k = 0, 1, 2, 3, 4, 5, 7")

# ---------- FX05 ----------
ok(all(b ** 3 - a ** 3 == (b - a) * (a * a + a * b + b * b) and a * a + a * b + b * b == (a + b / 2) ** 2 + 3 * b * b / 4 for a in G for b in G), "FX05 teorema 1: b³ − a³ = (b − a)(a² + ab + b²) e a² + ab + b² = (a + b/2)² + 3b²/4")
ok((-2) ** 3 == -8 < 1 and (-3) ** 3 == -27 < -8 and (-3) ** 2 == 9 > 4, "FX05 teorema 1: exemplos com −2, −3 e o contraexemplo do quadrado")
ok(all(a ** 3 < b ** 3 for a in G for b in G if a < b), "FX05 teorema 1: x³ crescente na grade")
ok(all(1 / a - 1 / b == (b - a) / (a * b) and ((1 / a > 1 / b) == (a * b > 0)) for a in G for b in G if a < b), "FX05 teorema 2: 1/a − 1/b = (b − a)/(ab); decresce só quando a e b têm o mesmo sinal")
ok(Fr(1, 2) > Fr(1, 3) > Fr(1, 4) and Fr(1, -1) < Fr(1, 1), "FX05 abertura: 1/2 > 1/3 > 1/4, mas 1/(−1) < 1/1")
ok(math.floor(3.7) == 3 and math.floor(5) == 5 and math.floor(-2.5) == -3, "FX05: ⌊3,7⌋ = 3, ⌊5⌋ = 5, ⌊−2,5⌋ = −3")
ok(2 ** 2 == 4 and (5 - 3) ** 2 + 2 == 6, "FX05 teorema 3: (2, 4) em x² vai para (5, 6) em (x − 3)² + 2")
ok(all(((p + h) - h) ** 2 + k == p * p + k for p in G for h in G for k in G), "FX05 teorema 3: g(p + h) = f(p) + k para f(x) = x²")
ok(2 - Fr(2, 3) == Fr(4, 3) and Fr(2, -2) + 3 == 2 and Fr(2 * 3 - 2, 3) == Fr(4, 3) and Fr(2 * 3 - 2, 2) == 2, "FX05 exemplo 1: 2/(x − 2) + 3 zera em 4/3 e corta o eixo y em 2")
ok(7 + 2 == 9 == (7 - 4) ** 2 and 2 + 2 == 4 == (2 - 4) ** 2 and 2 - 4 < 0 and 7 * 7 - 9 * 7 + 14 == 0 and 4 - 18 + 14 == 0, "FX05 exemplo 2: √(x + 2) = x − 4 → x² − 9x + 14 = 0; 7 serve, 2 é raiz falsa")
ok(all((s + a == (s - b) ** 2 and fa + a == (fa - b) ** 2 and fa - b < 0 <= s - b) for a, b, s, fa in [(2, 4, 7, 2), (-3, 5, 7, 4), (-2, 4, 6, 3), (-4, 6, 8, 5)]), "FX05 exemplo 2: os quatro casos têm uma raiz verdadeira e uma falsa")
ok(math.isqrt(4) - 2 == 0, "FX05 exemplo 3: g(7) = √4 − 2 = 0 para g(x) = √(x − 3) − 2")
ok(all((math.floor(2 * Fr(x, 20)) == 5) == (Fr(5, 2) <= Fr(x, 20) < 3) for x in range(0, 100)), "FX05 chefão (a): ⌊2x⌋ = 5 ⇔ 2,5 ≤ x < 3")
ok(all(x + 1 / x >= 2 and ((x + 1 / x == 2) == (x == 1)) for x in [Fr(1, 5), Fr(1, 2), Fr(1), Fr(3, 2), Fr(7)]), "FX05 chefão (b): x + 1/x ≥ 2, com igualdade só em x = 1")
ok(1 / Fr(1 - 2) + 1 == 0 and 1 / Fr(0 - 2) + 1 == Fr(1, 2), "FX05 chefão (c): 1/(x − 2) + 1 zera em 1 e vale 1/2 em 0")
ok([x for x in range(-5, 6) if x ** 3 == x] == [-1, 0, 1] and all((Fr(x, 4) ** 3 > Fr(x, 4)) == (-1 < Fr(x, 4) < 0 or Fr(x, 4) > 1) for x in range(-20, 21)), "FX05 chefão (d): x³ = x em −1, 0, 1; x³ > x para −1 < x < 0 ou x > 1")
ok(all(math.floor(Fr(x, 4)) + math.floor(-Fr(x, 4)) == (0 if x % 4 == 0 else -1) for x in range(-40, 41)), "FX05 chefão (e): ⌊x⌋ + ⌊−x⌋ é 0 nos inteiros e −1 fora deles")
ok(all((1 / Fr(x, 4) < Fr(1, 2)) == (Fr(x, 4) < 0 or Fr(x, 4) > 2) for x in range(-40, 41) if x != 0), "FX05: 1/x < 1/2 ⇔ x < 0 ou x > 2")
ok(0.25 ** 0.5 == 0.5 > 0.25 > 0.25 ** 2 > 0.25 ** 3 and 2 ** 3 > 2 ** 2 > 2 > 2 ** 0.5, "FX05: ordem de √x, x, x², x³ antes e depois de 1")

# ---------- FX06 ----------
ok((2 * 2 + 3) ** 2 == 49 and 2 * 2 ** 2 + 3 == 11, "FX06: g(f(2)) = 49 e f(g(2)) = 11 para f = 2x + 3, g = x²")
ok(all(5 * (2 * x + 3) - 1 == 10 * x + 14 and 2 * (5 * x - 1) + 3 == 10 * x + 1 for x in G), "FX06 teorema 1: 5(2x + 3) − 1 = 10x + 14 e 2(5x − 1) + 3 = 10x + 1")
ok(all(a2 * (a1 * x + b1) + b2 == a1 * a2 * x + (a2 * b1 + b2) for a1 in G for b1 in G for a2 in G for b2 in G for x in (Fr(2), Fr(-1, 3))), "FX06 teorema 1: composta de afins, em geral")
ok((7 - 3) / 2 == 2 and all(((2 * x + 3) - 3) / 2 == x for x in G), "FX06: inversa de 2x + 3 é (x − 3)/2")
ok(Fr(2 + 7, 2) == Fr(9, 2) and Fr(2 - 7, 7 - 2) == -1, "FX06 teorema 3: ponto médio de (2, 7) e (7, 2) é (4,5; 4,5); inclinação −1")
ok(all((2 * ((3 * x - 5) / 2) + 5) / 3 == x for x in G) and (3 * 2 - 5) / Fr(2) == Fr(1, 2) and (2 * Fr(1, 2) + 5) / 3 == 2, "FX06 exemplo 2: inversa de (3x − 5)/2 é (2x + 5)/3; f(2) = 1/2 e volta a 2")
ok(3 ** 2 - 4 == 5 and math.isqrt(5 + 4) == 3, "FX06 exemplo 3: f(3) = 5 e f⁻¹(5) = 3 para x² − 4 com x ≥ 0")
fi = lambda x: (2 * x + 1) / (x - 3)
gi = lambda x: (3 * x + 1) / (x - 2)
ok(all(gi(fi(x)) == x for x in G if x != 3 and fi(x) != 2) and all(fi(gi(x)) == x for x in (Fr(-3), Fr(-1), Fr(1, 2), Fr(5))), "FX06 chefão (a): inversa de (2x + 1)/(x − 3) é (3x + 1)/(x − 2)")
si = lambda x: (x + 1) / (x - 1)
ok(all(si(si(x)) == x for x in G if x != 1), "FX06 chefão (b): (x + 1)/(x − 1) é a própria inversa")
ok(len(list(itertools.permutations([1, 2, 3]))) == 6, "FX06 chefão (c): 6 bijeções de {1, 2, 3}")
ok(all(abs((2 + Decimal(float(x * x - 4 * x) + 4).sqrt()) - Decimal(float(x))) < Decimal("1e-20") for x in (Fr(2), Fr(3), Fr(5), Fr(13, 2))), "FX06 chefão (d): 2 + √(x + 4) desfaz x² − 4x para x ≥ 2")
ok((2 * 4 + 1) % (4 - 3) == 0 and Fr(2 * 4 + 1, 4 - 3) == 9, "FX06 exercício 10 (números fixos): f(4) = 9")
ok(all(m * ((a * x + b) - b) + d == a * m * x + d for a in (2, 3) for b in G for m in G for d in G for x in G), "FX06 exercício 16: f(u) = m(u − b) + d satisfaz f(ax + b) = am·x + d")

# ---------- LOG01 ----------
ok([Fr(2) ** k for k in range(-2, 5)] == [Fr(1, 4), Fr(1, 2), 1, 2, 4, 8, 16], "LOG01: tabela de 2ˣ de −2 a 4")
ok(Fr(1, 10) * 2 ** 30 / 10 ** 6 > 100 and 2 ** 10 == 1024, "LOG01 chute: 0,1 mm × 2³⁰ passa de 100 km (em mm: dividir por 10⁶)")
ok(Fr(2 ** 3, 2 ** 0) == 8 and Fr(2 ** 5, 2 ** 2) == 8, "LOG01 teorema 1: f(3)/f(0) = f(5)/f(2) = 8")
ok(all(k * a ** (x + h) / (k * a ** x) == a ** h for k in (Fr(3), Fr(1, 2)) for a in (Fr(2), Fr(1, 3), Fr(5, 4)) for x in range(-3, 4) for h in range(0, 4)), "LOG01 teorema 1: f(x + h)/f(x) = aʰ")
ok(all((Fr(a) ** x < Fr(a) ** y) == (a > 1) for a in (Fr(2), Fr(3, 2), Fr(1, 2), Fr(9, 10)) for x in range(-4, 4) for y in range(x + 1, 5)), "LOG01 teorema 2: crescente para a > 1, decrescente para 0 < a < 1")
ok(2 ** 10 == 1024 and 10 * 2 == 20 and 10 ** 2 == 100, "LOG01 pegadinha: em x = 10, 2ˣ = 1024, 2x = 20, x² = 100")
ok(all(2 ** x + 2 ** x == 2 ** (x + 1) for x in range(0, 8)), "LOG01 pegadinha: 2ˣ + 2ˣ = 2^(x + 1)")
ok(1.5 ** 2 == 2.25, "LOG01: 1,5² = 2,25")
ok(all(sum(2 ** k for k in range(n)) == 2 ** n - 1 for n in range(1, 70)) and 1 + 2 + 4 + 8 == 15, "LOG01 teorema 3 e chefão (c): 1 + 2 + ... + 2^(n − 1) = 2ⁿ − 1 (até n = 69)")
ok(all(8 ** (x - 2) == 4 ** (x + 3) for x in (12,)) and 3 * (12 - 2) == 2 * (12 + 3) == 30, "LOG01 exemplo 1: 8^(x − 2) = 4^(x + 3) em x = 12")
ok(all((m * pp + n * q) % (m - n) == 0 and (b ** m) ** ((m * pp + n * q) // (m - n) - pp) == (b ** n) ** ((m * pp + n * q) // (m - n) + q) for b, m, n, pp, q in [(2, 3, 2, 2, 3), (2, 3, 2, 4, 2), (3, 3, 2, 2, 4), (2, 2, 1, 3, 2), (3, 2, 1, 2, 4), (2, 3, 1, 2, 6)]), "LOG01 exemplo 1: os seis casos têm solução inteira que fecha")
ok(all((Fr(1, 2) ** (x - 3) > Fr(1, 4)) == (x < 5) for x in range(-5, 12)), "LOG01 exemplo 2: (1/2)^(x − 3) > 1/4 ⇔ x < 5")
ok(100 * 2 ** 3 == 800 and 100 * 2 ** 6 == 6400 and 6 * 20 == 120, "LOG01 exemplo 3: 800 em 1 h; 6400 em 120 min")
ok([x for x in range(-5, 6) if 4 ** x - 6 * 2 ** x + 8 == 0] == [1, 2], "LOG01: 4ˣ − 6·2ˣ + 8 = 0 em x = 1 e x = 2")
ok([x for x in range(-5, 8) if x * x - 5 * x == -6] == [2, 3] and 2 ** 6 == 64, "LOG01 chefão (a): x² − 5x = −6 em 2 e 3")
ok(2 ** 100 > 10 ** 30 and 1024 ** 10 == 2 ** 100, "LOG01 chefão (b): 2¹⁰⁰ = 1024¹⁰ > 10³⁰")
ok(all((Decimal(2) ** Decimal(x) + Decimal(2) ** Decimal(-x)) / 2 >= 1 for x in (-3, -1, 0, 1, 2)) and (Decimal(2) ** 0 + Decimal(2) ** 0) / 2 == 1, "LOG01 chefão (d): (2ˣ + 2⁻ˣ)/2 ≥ 1, igualdade em 0")
ok(3 ** 2 + 4 ** 2 == 5 ** 2 and Fr(9, 25) + Fr(16, 25) == 1 and all((Fr(3, 5) ** x + Fr(4, 5) ** x > 1) == (x < 2) for x in range(-3, 7) if x != 2), "LOG01 chefão (e): 3² + 4² = 5²; (3/5)ˣ + (4/5)ˣ é maior que 1 antes de 2 e menor depois")
vs = [(1 + Fr(1, n)) ** n for n in (1, 2, 4, 12, 52, 365)]
ok(vs[0] == 2 and vs[1] == Fr(9, 4) and all(vs[k] < vs[k + 1] for k in range(5)) and all(v < 3 for v in vs), "LOG01: (1 + 1/n)ⁿ cresce de 2 para 2,25 e continua crescendo, sempre abaixo de 3")
ok(1000 * Fr(11, 10) ** 2 == 1210 and 50000 * Fr(9, 10) ** 2 == 40500, "LOG01: 1000 a 10% por 2 meses = 1210; 50 000 perdendo 10% por 2 anos = 40 500")

# ---------- LOG02 ----------
lg10 = lambda x: Decimal(x).log10()
ok(2 ** 3 == 8 and 10 ** 2 == 100 and Fr(2) ** -3 == Fr(1, 8) and 2 ** 5 == 32 == 8 * 4, "LOG02: 2³ = 8, 10² = 100, 2⁻³ = 1/8; log₂ 8 + log₂ 4 = 3 + 2 = 5 = log₂ 32")
ok(abs(lg10(2) - Decimal("0.3010")) < Decimal("0.0001") and abs(lg10(3) - Decimal("0.4771")) < Decimal("0.0001") and round(float(lg10(2)), 2) == 0.30 and round(float(lg10(3)), 2) == 0.48, "LOG02: log 2 = 0,3010 e log 3 = 0,4771; com duas casas, 0,30 e 0,48")
ok(all(abs((Decimal(x) * Decimal(y)).log10() - lg10(x) - lg10(y)) < Decimal("1e-40") for x in (2, 7, 30) for y in (3, 5, 11)), "LOG02 teorema 1: log(xy) = log x + log y")
ok(all(abs((Decimal(x) ** n).log10() - n * lg10(x)) < Decimal("1e-40") for x in (2, 7, 30) for n in (2, 3, 5)) and 8 ** 2 == 64 == 2 ** 6, "LOG02 teorema 2: log xⁿ = n log x; log₂ 64 = 6")
ok(4 ** 3 == 64 and Fr(6, 2) == 3 and abs(1 / lg10(2) - Decimal("3.32")) < Decimal("0.005"), "LOG02 teorema 3: log₄ 64 = 6/2 = 3; log₂ 10 = 1/log 2 ≈ 3,32")
ok(all((r ** i) ** Fr(1) == r ** i and Fr(j, i) * i == j for r, i, j in [(2, 3, 5), (2, 2, 5), (2, 3, 2), (3, 2, 3), (3, 3, 2), (2, 4, 3), (5, 2, 3), (2, 3, 4)]) and 8 ** 5 == 32 ** 3, "LOG02 exemplo 1: log₈ 32 = 5/3 (8⁵ = 32³)")
ok(72 == 2 ** 3 * 3 ** 2 and abs(3 * 0.30 + 2 * 0.48 - 1.86) < 1e-9 and abs(float(lg10(72)) - 1.857) < 0.001, "LOG02 exemplo 2: log 72 ≈ 1,86 com os valores dados (real: 1,857)")
ok(abs(1.3 / 0.48 - 2.71) < 0.005 and abs(float(lg10(20) / lg10(3)) - 2.727) < 0.001 and 3 ** 2 == 9 < 20 < 27 == 3 ** 3, "LOG02 exemplo 3: 3ˣ = 20 → x ≈ 2,71 com os valores dados (real: 2,727), entre 2 e 3")
ok(all(len(str(2 ** n)) == int(n * 0.301) + 1 for n in (20, 30, 40, 50, 70, 100, 200)) and [len(str(2 ** n)) for n in (20, 30, 50, 100)] == [7, 10, 16, 31], "LOG02: número de algarismos de 2ⁿ pela conta com log 2 = 0,301 bate com a contagem direta (n = 20 a 200)")
ok(len(str(3 ** 100)) == 48 and int(100 * 0.4771) + 1 == 48, "LOG02 chefão (a): 3¹⁰⁰ tem 48 algarismos")
ok([x for x in range(3, 50) if x * (x - 2) == 8] == [4] and 4 * 2 == 8 and (-2) * (-4) == 8, "LOG02 chefão (b): x(x − 2) = 8 com x > 2 só em x = 4")
prod = Decimal(1)
for k in range(2, 8):
    prod *= lg10(k + 1) / lg10(k)
ok(abs(prod - 3) < Decimal("1e-40"), "LOG02 chefão (c): log₂ 3 · log₃ 4 ··· log₇ 8 = 3")
ok((2 ** 2) ** 3 == 2 ** 6, "LOG02 chefão (d): (a²)³ = a⁶")
ok(all(2 ** pp % 2 == 0 and 3 ** q % 2 == 1 for pp in range(1, 40) for q in range(1, 40)), "LOG02 chefão (e): 2ᵖ é par e 3^q é ímpar")
ok(all(-(-la // lt) == math.ceil(la / lt) for la in (0.301, 0.4771) for lt in (0.0414, 0.0792)) and [math.ceil(la / lt) for la in (0.301, 0.4771) for lt in (0.0414, 0.0792)] == [8, 4, 12, 7] and [math.ceil(float(lg10(a) / lg10(Decimal(t)))) for a in (2, 3) for t in ("1.1", "1.2")] == [8, 4, 12, 7], "LOG02: meses para dobrar e triplicar a 10% e 20%: 8, 4, 12, 7 (com os logs dados e com os exatos)")
ok(abs(lg10("1.1") - Decimal("0.0414")) < Decimal("0.0001") and abs(lg10("1.2") - Decimal("0.0792")) < Decimal("0.0001"), "LOG02: log 1,1 = 0,0414 e log 1,2 = 0,0792")
ok(all(abs(float(lg10(N)) - lN) < 0.012 for N, lN in [(5, 0.7), (20, 1.3), (50, 1.7), (40, 1.6), (25, 1.4), (200, 2.3), (80, 1.9)]), "LOG02: os logaritmos montados com log 2 = 0,30 (5, 20, 25, 40, 50, 80, 200) diferem do valor real em menos de 0,012")
pr = Fr(1)
for k in range(1, 100):
    pr *= Fr(k, k + 1)
ok(pr == Fr(1, 100), "LOG02: (1/2)(2/3)···(99/100) = 1/100")

# ---------- LOG03 ----------
lb = lambda a, x: Decimal(x).ln() / Decimal(a).ln()
ok(2 ** 20 == 1048576 and 2 ** 30 > 10 ** 9 and abs(lb(2, 10 ** 6) - 20) < Decimal("0.1") and abs(lb(2, 10 ** 9) - 30) < Decimal("0.2"), "LOG03 chute: log₂ de um milhão ≈ 20 e de um bilhão ≈ 30")
ok([Fr(2) ** k for k in (-2, -1, 0, 1, 2, 3, 4)] == [Fr(1, 4), Fr(1, 2), 1, 2, 4, 8, 16], "LOG03: tabela de log₂ x (linhas de 2ˣ trocadas)")
XS = [Decimal("0.125"), Decimal(1), Decimal(3), Decimal(10)]
ok(all(lb(2, x) < lb(2, y) and lb("0.5", x) > lb("0.5", y) for x in XS for y in (11, 40, 1000)), "LOG03 teorema 2: log₂ crescente e log na base 1/2 decrescente")
ok(all(abs(lb("0.5", x) + lb(2, x)) < Decimal("1e-40") for x in (3, 8, 100)) and Fr(1, 2) ** -3 == 8, "LOG03 teorema 3: log na base 1/2 é o oposto do log na base 2; (1/2)⁻³ = 8")
ok(all(((x * x - 5 * x + 4) > 0) == (x < 1 or x > 4) for x in [Fr(k, 4) for k in range(-20, 40)]), "LOG03: x² − 5x + 4 > 0 ⇔ x < 1 ou x > 4")
ok(all(((x - 2) * (x - 5) > 0) == (x < 2 or x > 5) for x in [Fr(k, 4) for k in range(-20, 40)]) and (6 - 2) * (6 - 5) == 4 and (3 - 2) * (3 - 5) == -2, "LOG03 exemplo 1: domínio de log(x² − 7x + 10); valores em 6 e em 3")
ok(Fr(3 * 4 + 1, 4) == Fr(13, 4) and Fr(13, 4) - 3 == Fr(1, 4) and lb(2, 1) + 2 == 2, "LOG03 exemplo 2: log₂(x − 3) + 2 zera em 13/4 e vale 2 em x = 4")
ok(all((lb("0.5", x - 2) > -3) == (x < 10) for x in (Decimal("2.5"), 3, 5, 9, Decimal("9.9"), Decimal("10.5"), 12, 30)) and lb("0.5", 2) == -1, "LOG03 exemplo 3: log na base 1/2 de (x − 2) > −3 ⇔ 2 < x < 10; em x = 4 vale −1")
ok([x for x in range(-5, 30) if x > 0 and lb("0.5", x) > -3] == list(range(1, 8)), "LOG03: log na base 1/2 de x > −3 tem os inteiros 1 a 7")
ok(all((x - 1 > 0 and x - 1 != 1 and 5 - x > 0) == (1 < x < 5 and x != 2) for x in [Fr(k, 4) for k in range(-8, 32)]), "LOG03 chefão (a): domínio 1 < x < 5, x ≠ 2")
ok(abs(lb(2, 2)) == 1 and abs(lb(2, "0.5")) == 1, "LOG03 chefão (b): |log₂ x| = 1 em 2 e em 1/2")
ok(3 ** 2 == 9 > 8 == 2 ** 3 and lb(2, 3) > Decimal("1.5"), "LOG03 chefão (c): 9 > 8, logo log₂ 3 > 3/2")
ok(all(abs((Decimal(x) + (Decimal(x) ** 2 + 1).sqrt()) * ((Decimal(x) ** 2 + 1).sqrt() - Decimal(x)) - 1) < Decimal("1e-40") for x in (0, 1, 3, 7)), "LOG03 chefão (d): (x + √(x² + 1))(√(x² + 1) − x) = 1")
ok(len([n for n in range(1, 100) if 8 <= n <= 32]) == 25, "LOG03 chefão (e): 25 inteiros de 8 a 32")
ok(all(b ** n * c % (b ** n - 1) == 0 and b ** n * c // (b ** n - 1) > c for b, n, c in [(2, 2, 3), (2, 1, 3), (2, 1, 5), (3, 1, 2), (3, 1, 4), (2, 2, 6), (2, 3, 7), (3, 2, 8), (2, 1, 7)]), "LOG03 exercício 16: os nove casos têm cruzamento inteiro dentro do domínio")

# ---------- LOG04 ----------
ok([x for x in range(-10, 20) if x * (x - 2) == 8] == [-2, 4] and math.log2(4) + math.log2(2) == 3, "LOG04 abertura e exemplo 1: x(x − 2) = 8 em −2 e 4; log₂ 4 + log₂ 2 = 3")
ok(all(x * (x - c) == 2 ** k and x > c and -(2 ** k) // x * 1 == -(2 ** k // x) and (2 ** k // x) * x == 2 ** k and math.log2(x) + math.log2(x - c) == k for c, k, x in [(2, 3, 4), (6, 4, 8), (7, 3, 8), (4, 5, 8), (12, 6, 16), (14, 5, 16)]), "LOG04 exemplo 1: os seis casos fecham (raiz boa maior que c, raiz falsa negativa)")
ok(3 ** 2 == 9 and 3 ** 3 == 27 and 2 + 3 == 5 and 2 * 3 == 6, "LOG04 exemplo 2: (log₃ x)² − 5 log₃ x + 6 = 0 → 9 e 27")
ok(all((2 * x - 4 > 0 and x + 3 > 0 and 2 * x - 4 <= x + 3) == (2 < x <= 7) for x in [Fr(k, 4) for k in range(-20, 60)]), "LOG04 exemplo 3: log₃(2x − 4) ≤ log₃(x + 3) ⇔ 2 < x ≤ 7")
ok(3 * 5 - 4 == 11 == 5 + 6 and (-2 - 5) < 0 and 2 * (-2) - 3 < 0, "LOG04 teorema 1: 3x − 4 = x + 6 em x = 5 (valor 11); log(x − 5) = log(2x − 3) daria x = −2, sem logaritmo")
ok(2 ** 3 == 8 and Fr(1, 2) ** -3 == 8 and abs(1 / lg10(2) - Decimal("3.32")) < Decimal("0.005") and 8 < 10 < 16, "LOG04 teoremas 2 e 3: fronteiras em 8; 2ˣ = 10 → x ≈ 3,32")
ok(len([x for x in (10, -10) if x * x == 100]) == 2, "LOG04: log(x²) = 2 tem duas soluções (10 e −10); 2 log x = 2 tem só a positiva")
ok((3 + 1) * (3 - 1) == 8, "LOG04 chefão (a): (x + 1)(x − 1) = 8 em x = 3")
ok(4 ** 2 == 16 and Fr(1, 4) ** -2 == 16, "LOG04 chefão (b): 4² = 16 e (1/4)⁻² = 16")
ok(all((lb(3, x) > lb(9, x + 2)) == (x > 2) for x in (Decimal("0.5"), 1, Decimal("1.9"), Decimal("2.1"), 3, 10)), "LOG04 chefão (c): log₃ x > log₉(x + 2) ⇔ x > 2")
xd = Decimal("0.4771") / (Decimal("0.4771") - Decimal("0.3010"))
ok(abs(xd - Decimal("2.71")) < Decimal("0.005") and abs(Decimal(2) ** xd - Decimal(3) ** (xd - 1)) < Decimal("0.01"), "LOG04 chefão (d): x = 0,4771/0,1761 ≈ 2,71, e 2ˣ ≈ 3^(x − 1)")
ok(math.log2(1) == 1 - 1 and math.log2(2) == 2 - 1, "LOG04 chefão (e): log₂ x = x − 1 em 1 e 2")
ok(all(abs(n / 0.30 - v) < 0.01 for n, v in [(1, 3.33), (2, 6.67), (3, 10)]) and abs(float(lb("0.5", "0.1")) - 3.32) < 0.01, "LOG04: meias-vidas para restar 10%, 1% e 0,1%: 3,33; 6,67; 10 com log 2 = 0,30 (valor real para 10%: 3,32)")
ok(all(x * y == 10 ** round(math.log10(x * y)) for x, y in [(20, 5), (25, 4), (50, 2), (40, 25), (100, 10), (125, 8), (200, 5)]), "LOG04 exercício 15: os produtos são potências de 10")
ok(all(Fr(5, 2) == t + 1 / Fr(t) for t in (2, Fr(1, 2))), "LOG04 exercício 14: t + 1/t = 5/2 em t = 2 e t = 1/2")

# ---------- SPG01 ----------
pa = lambda a1, r, n: [a1 + k * r for k in range(n)]
ok(pa(5, 3, 4) == [5, 8, 11, 14] and 5 + 99 * 3 == 302, "SPG01: (5, 8, 11, 14, ...) tem 100º termo 302")
ok(all(sum(pa(a1, r, n)) * 2 == (a1 + a1 + (n - 1) * r) * n for a1 in range(-5, 6) for r in range(-4, 5) for n in range(1, 30)), "SPG01 teorema 2: Sₙ = (a₁ + aₙ)n/2, em 2871 casos")
ok(sum(range(1, 101)) == 5050 and 101 * 100 == 10100, "SPG01: 1 + 2 + ... + 100 = 5050")
ok(all(sum(2 * k - 1 for k in range(1, n + 1)) == n * n for n in range(1, 200)) and 1 + 3 + 5 + 7 + 9 == 25, "SPG01 teorema 3: soma dos n primeiros ímpares = n²")
ok(len(pa(7, 3, 31)) == 31 and pa(7, 3, 31)[-1] == 97 and (97 - 7) // 3 == 30, "SPG01 chute: (7, 10, ..., 97) tem 31 termos")
ok(all(a + 2 * d == 2 * (a + d) - a for a in G for d in G) and all((am - d * r) + (am + d * r) == 2 * am for am in G for d in (1, 2, 3) for r in G), "SPG01: termo do meio e termos equidistantes")
ok((35 - 15) // 5 == 4 and 15 - 2 * 4 == 7 and 7 + 19 * 4 == 83, "SPG01 exemplo 1: a₃ = 15, a₈ = 35 → r = 4, a₁ = 7, a₂₀ = 83")
ok(len(pa(5, 3, 100)) == 100 and pa(5, 3, 100)[-1] == 302 and sum(pa(5, 3, 100)) == 15350, "SPG01 exemplo 2: 5 + 8 + ... + 302 tem 100 termos e soma 15 350")
ok(2 + 5 + 8 == 15 and 2 * 5 * 8 == 80 and 25 - 9 == 16 == 80 // 5, "SPG01 exemplo 3: soma 15 e produto 80 → 2, 5, 8")
ok(sum(x for x in range(1, 101) if x % 3) == 3367 and sum(range(3, 100, 3)) == 1683 and len(range(3, 100, 3)) == 33, "SPG01 chefão (a): 5050 − 1683 = 3367")
ok(sum(range(1, 21)) == 210 and 20 * 20 + 20 - 420 == 0, "SPG01 chefão (b): n = 20")
ok(all((3 * r) ** 2 + (4 * r) ** 2 == (5 * r) ** 2 for r in (1, 2, Fr(7, 3))), "SPG01 chefão (c): 3r, 4r, 5r")
ok(all((b * b - a * c) - (a * a - b * c) == (b - a) * (a + b + c) and (c * c - a * b) - (b * b - a * c) == (c - b) * (a + b + c) for a in G for b in G for c in G), "SPG01 chefão (d): as duas diferenças fatoram com (a + b + c)")
ok(sum(Fr(1, k * (k + 3)) for k in range(1, 29, 3)) == Fr(10, 31), "SPG01 chefão (e): 1/(1·4) + ... + 1/(28·31) = 10/31")
ok(all((a * k * k + b * k) - (a * (k - 1) ** 2 + b * (k - 1)) == 2 * a * k - a + b for a in (1, 2, 3) for b in range(-3, 4) for k in range(2, 20)), "SPG01 exercício 11: aₖ = Sₖ − Sₖ₋₁ = 2ak − a + b (PA de razão 2a)")
ok(all(a1 + (a1 // -r + 1) * r < 0 <= a1 + (a1 // -r) * r for a1 in range(20, 201, 7) for r in range(-9, -1)), "SPG01 exercício 15: o primeiro termo negativo está na posição ⌊a₁/|r|⌋ + 2")

# ---------- SPG02 ----------
pgl = lambda a1, q, n: [a1 * Fr(q) ** k for k in range(n)]
ok(pgl(3, 2, 4) == [3, 6, 12, 24] and 3 * 2 ** 9 == 1536, "SPG02: (3, 6, 12, 24, ...) tem 10º termo 1536")
ok(all(sum(pgl(a1, q, n)) == a1 * (Fr(q) ** n - 1) / (Fr(q) - 1) for a1 in (1, 3, 5) for q in (2, 3, -2, Fr(1, 2), Fr(-2, 3)) for n in range(1, 15)), "SPG02 teorema 2: soma finita, em 210 casos (inclusive razões negativas e fracionárias)")
ok(1 + 2 + 4 + 8 + 16 == 31 == 32 - 1, "SPG02: 1 + 2 + 4 + 8 + 16 = 31")
ok(all(abs(sum(pgl(a1, q, 400)) - a1 / (1 - Fr(q))) < Fr(1, 10 ** 30) for a1 in (1, 12) for q in (Fr(1, 2), Fr(1, 3), Fr(-1, 2), Fr(3, 4))), "SPG02 teorema 3: 400 parcelas ficam a menos de 10⁻³⁰ de a₁/(1 − q)")
ok([sum(Fr(1, 2 ** k) for k in range(1, n + 1)) for n in (1, 2, 3, 4)] == [Fr(1, 2), Fr(3, 4), Fr(7, 8), Fr(15, 16)], "SPG02 teorema 3: parciais 1/2, 3/4, 7/8, 15/16")
ok(all(Fr(a1) / (1 - Fr(n, d)) == S for a1, n, d, S in [(12, 1, 2, 24), (18, 1, 3, 27), (6, 2, 3, 18), (24, 1, 4, 32), (10, 1, 2, 20), (12, -1, 2, 8), (8, 1, 3, 12), (9, 2, 3, 27), (20, 3, 4, 80), (15, -1, 2, 10)]), "SPG02 exercício 6: as dez somas infinitas da lista")
ok(48 // 6 == 8 == 2 ** 3 and 6 // 2 == 3 and 3 * 2 ** 7 == 384, "SPG02 exemplo 1: a₂ = 6, a₅ = 48 → q = 2, a₁ = 3, a₈ = 384")
ok(sum(pgl(2, 3, 7)) == 2186 and pgl(2, 3, 7)[-1] == 1458 and 3 * 1458 - 2 == 4372 == 2 * 2186, "SPG02 exemplo 2: 2 + 6 + ... + 1458 = 2186 (7 termos); 3S − S = 4372")
ok(all(Fr(ab, 100) / (1 - Fr(1, 100)) == Fr(ab, 99) for ab in (27, 36, 45, 18, 54, 63, 12, 15, 24)) and Fr(27, 99) == Fr(3, 11) and abs(3 / 11 - 0.272727) < 1e-6, "SPG02 exemplo 3: 0,2727... = 27/99 = 3/11")
ok(all(h + 2 * (h * Fr(fn, fd)) / (1 - Fr(fn, fd)) == h * m for h in (4, 6, 9, 12) for fn, fd, m in [(1, 2, 3), (1, 3, 2), (2, 3, 5), (3, 4, 7)]), "SPG02 exercício 11: distância total da bola = h(1 + f)/(1 − f)")
ok(all(Fr(L * L) / (1 - Fr(1, 2)) == 2 * L * L for L in (2, 4, 6, 10, 20)), "SPG02 exercício 16: soma das áreas dos quadrados = 2L²")
ok(Fr(9, 10) / (1 - Fr(1, 10)) == 1, "SPG02 chefão (a): 0,9 + 0,09 + ... = 1")
ok(Fr(100) / (1 - Fr(1, 10)) == Fr(1000, 9) and abs(1000 / 9 - 111.1) < 0.02, "SPG02 chefão (b): 100 + 10 + 1 + ... = 1000/9 ≈ 111,1")
ok(1 / (1 - Fr(2, 3)) == 3, "SPG02 chefão (c): q = 2/3")
ok(all(abs(sum((x - 2) ** k for k in range(300)) - 1 / (3 - x)) < Fr(1, 10 ** 20) for x in (Fr(3, 2), Fr(2), Fr(5, 2), Fr(11, 4))), "SPG02 chefão (d): soma = 1/(3 − x) para 1 < x < 3")
ok(abs(sum((k + 1) * Fr(1, 2) ** k for k in range(300)) - 4) < Fr(1, 10 ** 20) and 1 / (1 - Fr(1, 2)) ** 2 == 4, "SPG02 chefão (e): 1 + 2·(1/2) + 3·(1/4) + ... = 4")
ok(all((x // q) * x * (x * q) == x ** 3 and x % q == 0 for x, q in [(6, 3), (4, 2), (6, 2), (10, 2), (9, 3), (8, 2), (12, 2), (4, 4), (12, 3), (10, 5)]), "SPG02 exercício 8: os dez trios são inteiros e têm produto x³")

# ---------- SPG03 ----------
mhf = lambda a, b: Fr(2 * a * b, a + b)
ok([2 + k * 3 for k in range(4)] == [2, 5, 8, 11] and 2 + 9 * 3 == 29, "SPG03: (1/2, 1/5, 1/8, 1/11, ...) tem inversos em PA; 10º termo 1/29")
ok(Fr(1, 3) - Fr(1, 4) == Fr(1, 4) - Fr(1, 6) and mhf(3, 6) == 4, "SPG03 teorema 1: 3, 4, 6 em PH; MH(3, 6) = 4")
ok(all(1 / mhf(a, c) == (Fr(1, a) + Fr(1, c)) / 2 for a in range(1, 15) for c in range(1, 15)), "SPG03 teorema 1: 1/b é a média de 1/a e 1/c exatamente quando b = 2ac/(a + c)")
ok(all(mhf(a, b) == m for a, b, m in [(3, 6, 4), (2, 6, 3), (4, 12, 6), (6, 12, 8), (10, 15, 12), (20, 30, 24), (12, 24, 16), (30, 60, 40), (40, 60, 48), (60, 90, 72)]), "SPG03: as dez médias harmônicas da lista")
ok(Fr(4 + 16, 2) == 10 and math.isqrt(64) == 8 and mhf(4, 16) == Fr(32, 5) and 10 * Fr(32, 5) == 64, "SPG03 teorema 2: médias de 4 e 16: 10, 8 e 6,4; 10 × 6,4 = 64")
ok(all(Fr(a + b, 2) * mhf(a, b) == a * b and mhf(a, b) ** 2 <= a * b <= Fr(a + b, 2) ** 2 and ((mhf(a, b) == Fr(a + b, 2)) == (a == b)) for a in range(1, 25) for b in range(1, 25)), "SPG03 teorema 2: MA·MH = ab e MH² ≤ ab ≤ MA², com igualdade só para a = b (576 pares)")
ok(Fr(240, 5) == 48 and mhf(60, 40) == 48 and Fr(60 + 40, 2) == 50, "SPG03 chute e chefão (b): ida e volta a 60 e 40 → 48; metade do tempo → 50")
ok(all(Fr(v1 * v2, 5) % v1 == 0 and Fr(v1 * v2, 5) % v2 == 0 and Fr(2 * v1 * v2 // 5) / (Fr(v1 * v2 // 5, v1) + Fr(v1 * v2 // 5, v2)) == m for v2, v1, m in [(40, 60, 48), (20, 30, 24), (30, 60, 40), (60, 90, 72), (10, 15, 12)]), "SPG03 exemplo 2: com d = v₁v₂/5 os tempos são inteiros e a média bate")
ok(mhf(9, 16) == Fr(288, 25) and Fr(25, 2) * Fr(288, 25) == 144 and mhf(4, 9) == Fr(72, 13), "SPG03 exemplo 3: MH(9, 16) = 288/25 e MH(4, 9) = 72/13")
Hn = lambda n: sum(Fr(1, k) for k in range(1, n + 1))
ok([Hn(n) for n in (3, 4, 5, 6)] == [Fr(11, 6), Fr(25, 12), Fr(137, 60), Fr(49, 20)], "SPG03: somas harmônicas 11/6, 25/12, 137/60, 49/20")
ok([min(n for n in range(1, 100) if Hn(n) > alvo) for alvo in (2, Fr(5, 2), 3)] == [4, 7, 11], "SPG03: a soma passa de 2 com 4 parcelas, de 2,5 com 7 e de 3 com 11")
ok(all(sum(Fr(1, t) for t in range(2 ** (j - 1) + 1, 2 ** j + 1)) >= Fr(1, 2) for j in range(1, 12)) and all(Hn(2 ** k) >= 1 + Fr(k, 2) for k in range(0, 11)), "SPG03 teorema 3: cada bloco soma pelo menos 1/2 e H(2^k) ≥ 1 + k/2 (k até 10)")
ok(Fr(1, 3) + Fr(1, 4) > Fr(1, 2) and sum(Fr(1, k) for k in range(5, 9)) > Fr(1, 2) and 1 + Fr(18, 2) == 10, "SPG03 chefão (e): blocos maiores que 1/2; k = 18 garante pelo menos 10")
ok(sum(Fr(1, k * (k + 1)) for k in range(1, 100)) == Fr(99, 100), "SPG03 chefão (d): 1/(1·2) + ... + 1/(99·100) = 99/100")
ok(all(((a + c) ** 2 == 4 * a * c) == (a == c) for a in range(1, 30) for c in range(1, 30)), "SPG03 chefão (c): (a + c)² = 4ac só com a = c")
ok(all(1 / (Fr(2, b) - Fr(1, a)) == c for a, b, c in [(2, 3, 6), (3, 4, 6), (4, 6, 12), (6, 8, 12), (10, 12, 15), (20, 24, 30), (12, 16, 24)]), "SPG03 exercício 14: os sete trios em PH")
ok(all(3 / (Fr(1, a) + Fr(1, b) + Fr(1, c)) == m for a, b, c, m in [(20, 30, 60, 30), (10, 15, 30, 15), (40, 60, 120, 60), (12, 20, 30, 18), (30, 60, 20, 30), (24, 40, 60, 36)]), "SPG03 exercício 15: médias harmônicas de três velocidades")
ok(all(Fr(2 * Q) / (Fr(Q, p1) + Fr(Q, p2)) == m for p1, p2, m, Q in [(2, 3, Fr(12, 5), 60), (4, 6, Fr(24, 5), 120), (5, 20, 8, 500), (3, 6, 4, 90), (4, 12, 6, 240), (2, 6, 3, 60)]), "SPG03 exercício 9: preço médio = média harmônica dos preços")
ok(all((a + b) * (Fr(1, a) + Fr(1, b)) >= 4 and (a + b + c) * (Fr(1, a) + Fr(1, b) + Fr(1, c)) >= 9 for a in range(1, 8) for b in range(1, 8) for c in range(1, 8)), "SPG03 exercício 16: (soma)(soma dos inversos) ≥ 4 e ≥ 9")

# ---------- MD01 ----------
def mmul(a, b):
    return [[sum(a[i][k] * b[k][j] for k in range(len(b))) for j in range(len(b[0]))] for i in range(len(a))]
def mpot(a, n):
    r = [[1 if i == j else 0 for j in range(len(a))] for i in range(len(a))]
    for _ in range(n):
        r = mmul(r, a)
    return r
def mT(a):
    return [list(l) for l in zip(*a)]
def madd(a, b):
    return [[a[i][j] + b[i][j] for j in range(len(a[0]))] for i in range(len(a))]
I2 = [[1, 0], [0, 1]]
ok(2 * 5 + 3 * 4 == 22, "MD01: linha (2 3) vezes coluna (5, 4) = 22")
ok(mmul([[2, 3], [-1, 4]], [[5, -2], [3, 6]]) == [[19, 14], [7, 26]], "MD01 exemplo 1: produto 2 × 2")
ok(mmul([[2, 0], [3, 4]], [[0, 5], [2, 3]]) == [[0, 10], [8, 27]] and mmul([[0, 5], [2, 3]], [[2, 0], [3, 4]]) == [[15, 20], [13, 12]], "MD01 exemplo 2: AB e BA diferentes")
ok(3 * 6 + 2 * 8 + 4 * 3 == 46 and 5 * 6 + 0 * 8 + 2 * 3 == 36, "MD01 exemplo 3: contas de 46 e 36 reais")
GM2 = [[[a, b], [c, d]] for a in (-1, 2) for b in (0, 3) for c in (1, -2) for d in (2, 5)]
ok(all(mmul(X, I2) == X == mmul(I2, X) for X in GM2), "MD01 teorema 2: AI = IA = A")
ok(all(mT(mmul(X, Y)) == mmul(mT(Y), mT(X)) for X in GM2 for Y in GM2), "MD01 chefão (e): (AB)ᵀ = BᵀAᵀ em 256 pares")
ok(all(mmul(X, mmul(Y, [[x], [y]])) == mmul(mmul(X, Y), [[x], [y]]) for X in GM2 for Y in GM2[:6] for x, y in ((1, 1), (2, -3))), "MD01 teorema 1: A(Bv) = (AB)v")
ok(mmul([[1, 2], [0, 1]], [[1], [1]]) == [[3], [1]] and mmul([[2, 0], [1, 1]], [[3], [1]]) == [[6], [4]] and mmul([[2, 0], [1, 1]], [[1, 2], [0, 1]]) == [[2, 4], [1, 3]] and mmul([[2, 4], [1, 3]], [[1], [1]]) == [[6], [4]], "MD01 teorema 1: (1, 1) → (3, 1) → (6, 4), e AB = [[2, 4], [1, 3]] leva direto")
ok(all(mmul(X, [[1], [0]]) == [[X[0][0]], [X[1][0]]] and mmul(X, [[0], [1]]) == [[X[0][1]], [X[1][1]]] for X in GM2), "MD01 teorema 3: as colunas são as imagens de (1, 0) e (0, 1)")
ok([mpot([[1, 1], [1, 0]], n) for n in (2, 3, 4, 5)] == [[[2, 1], [1, 1]], [[3, 2], [2, 1]], [[5, 3], [3, 2]], [[8, 5], [5, 3]]], "MD01 chefão (a): potências de [[1, 1], [1, 0]]")
ok(all(mmul(madd(X, Y), madd(X, Y)) == madd(madd(mmul(X, X), mmul(X, Y)), madd(mmul(Y, X), mmul(Y, Y))) for X in GM2 for Y in GM2), "MD01 chefão (b): (A + B)² = A² + AB + BA + B²")
ok(mmul([[0, 1], [0, 0]], [[0, 1], [0, 0]]) == [[0, 0], [0, 0]], "MD01 chefão (c): [[0, 1], [0, 0]]² = 0")
ok(all((mmul([[a, b], [c, d]], [[1, 1], [0, 1]]) == mmul([[1, 1], [0, 1]], [[a, b], [c, d]])) == (c == 0 and a == d) for a in range(-2, 3) for b in range(-2, 3) for c in range(-2, 3) for d in range(-2, 3)), "MD01 chefão (d): comuta com [[1, 1], [0, 1]] exatamente quando c = 0 e a = d (625 matrizes)")
ok(all(mpot([[1, k], [0, 1]], n) == [[1, n * k], [0, 1]] for k in (1, 2, 3, 4) for n in range(0, 30)), "MD01 exercício 14: [[1, k], [0, 1]]ⁿ = [[1, nk], [0, 1]]")
Rg = [[0, -1], [1, 0]]
ok(mpot(Rg, 2) == [[-1, 0], [0, -1]] and mpot(Rg, 4) == I2 and all(mpot(Rg, n) != I2 for n in (1, 2, 3)), "MD01 exercício 16: R² = −I, R⁴ = I e nenhum expoente menor serve")

# ---------- MD02 ----------
def det2(m):
    return m[0][0] * m[1][1] - m[0][1] * m[1][0]
def det3(m):
    return sum((-1) ** j * m[0][j] * det2([[m[i][k] for k in range(3) if k != j] for i in (1, 2)]) for j in range(3))
def sarrus(m):
    (a, b, c), (d, e, f), (g, h, i) = m
    return a * e * i + b * f * g + c * d * h - c * e * g - a * f * h - b * d * i
GM3 = [[[a, 1, c], [2, e, -1], [g, 3, i]] for a in (-1, 2) for c in (0, 3) for e in (1, -2) for g in (2, 5) for i in (-3, 4)]
ok(3 * 2 - 1 * 1 == 5 and 3 * 2 - 1 * 0 == 6, "MD02: det (3,1;1,2) = 5 e det (3,1;0,2) = 6 (base 3, altura 2)")
ok(all((a * a + c * c) * (b * b + d * d) - (a * b + c * d) ** 2 == (a * d - b * c) ** 2 for a in G for b in G for c in G for d in G), "MD02 teorema 1: (a² + c²)(b² + d²) − (ab + cd)² = (ad − bc)² na grade")
ok(mmul([[2, 1], [0, 3]], [[1, 2], [1, 1]]) == [[3, 5], [3, 3]] and det2([[3, 5], [3, 3]]) == -6 == det2([[2, 1], [0, 3]]) * det2([[1, 2], [1, 1]]), "MD02 teorema 2: exemplo numérico, det(AB) = −6 = 6 · (−1)")
ok(all(det2(mmul(X, Y)) == det2(X) * det2(Y) for X in GM2 for Y in GM2), "MD02 teorema 2: det(AB) = det A · det B em 256 pares")
ok(all((a * e + b * g) * (c * f + d * h) - (a * f + b * h) * (c * e + d * g) == (a * d - b * c) * (e * h - f * g) for a in G[:4] for b in G[:4] for c in G[:4] for d in G[:4] for e in G[:3] for f in G[:3] for g in G[:3] for h in G[:3]), "MD02 teorema 2: identidade em frações")
ok(all(sarrus(X) == det3(X) for X in GM3), "MD02: Sarrus = expansão pela primeira linha (32 matrizes)")
ok(sarrus([[2, 0, 3], [4, -2, 5], [3, 2, 0]]) == 22 and (2 * -2 * 0, 0 * 5 * 3, 3 * 4 * 2) == (0, 0, 24) and (3 * -2 * 3, 2 * 5 * 2, 0 * 4 * 0) == (-18, 20, 0), "MD02 exemplo 1: (0 + 0 + 24) − (−18 + 20 + 0) = 22")
ok(det2([[2, 5], [3, 8]]) == 1 and mmul([[2, 5], [3, 8]], [[8, -5], [-3, 2]]) == I2 and mmul([[8, -5], [-3, 2]], [[2, 5], [3, 8]]) == I2, "MD02 exemplo 2 e teorema 3: inversa de (2,5;3,8) é (8,−5;−3,2)")
ok(all(mmul([[a, b], [c, d]], [[d, -b], [-c, a]]) == [[a * d - b * c, 0], [0, a * d - b * c]] for a in G for b in G for c in G for d in G), "MD02 teorema 3: A · (matriz trocada) = (ad − bc) I")
ok(4 * 5 - 2 * 2 == 16 and 16 // 2 == 8, "MD02 exemplo 3: triângulo (0,0), (4,2), (2,5) tem área 8")
ok(3 * 4 - 1 * 1 == 11, "MD02 chefão (a): lados (3, 1) e (1, 4), det 11, área 11/2")
ok(all(sarrus([[1, 1, 1], [a, b, c], [a * a, b * b, c * c]]) == (b - a) * (c - a) * (c - b) == b * c * c + c * a * a + a * b * b - a * a * b - b * b * c - c * c * a for a in G for b in G for c in G), "MD02 chefão (b): Vandermonde na grade")
ok(18 + 3 + 4 - 2 - 12 - 9 == 2, "MD02 chefão (b): conferência com 1, 2, 3")
ok(all(det2(mmul(X, Y)) == det2(mmul(Y, X)) for X in GM2 for Y in GM2), "MD02 chefão (c): det(AB) = det(BA)")
ok(all(det2([[a, b], [c, d]]) in (0, 1) for a in range(-3, 4) for b in range(-3, 4) for c in range(-3, 4) for d in range(-3, 4) if mmul([[a, b], [c, d]], [[a, b], [c, d]]) == [[a, b], [c, d]]), "MD02 chefão (d): toda matriz inteira com A² = A (entradas de −3 a 3) tem det 0 ou 1")
ok(all(sarrus([X[1], X[0], X[2]]) == -sarrus(X) and sarrus([[2 * v for v in l] for l in X]) == 8 * sarrus(X) and sarrus(mT(X)) == sarrus(X) and sarrus([X[0], X[1], [3 * v for v in X[0]]]) == 0 for X in GM3), "MD02 tabela de propriedades: troca, kA (k³), transposta, linhas proporcionais")
ok(det2([[2, 1], [4, 2]]) == 0 and det2([[2, 1], [4, 3]]) == 2, "MD02 abertura: (2,1;4,2) tem det 0 e (2,1;4,3) tem det 2")
ok(all(sarrus([[0, b, 1], [1, b + m, 1], [t, b + m * t, 1]]) == 0 for b in range(-3, 4) for m in range(-3, 4) for t in range(2, 8)), "MD02 exercício 16: (0, b), (1, b + m), (t, b + mt) alinhados")
ok(all(sarrus([[p, 2, -3], [0, q, 4], [0, 0, r]]) == p * q * r for p in G for q in G for r in G), "MD02 exercício 13: triangular = produto da diagonal")

# ---------- MD03 ----------
def vale(co, b, sol):
    return all(sum(c * s for c, s in zip(l, sol)) == bb for l, bb in zip(co, b))
def troca_col(co, b, j):
    return [[b[i] if k == j else v for k, v in enumerate(l)] for i, l in enumerate(co)]
E1 = ([[1, 1, 1], [2, 1, -1], [1, -2, 2]], [3, 9, -8])
ok(vale(E1[0], E1[1], (2, 3, -2)) and sarrus(E1[0]) != 0, "MD03 exemplo 1: (2, 3, −2) resolve o sistema e o determinante não é zero")
ok([2 - 2 * 1, 1 - 2 * 1, -1 - 2 * 1, 9 - 2 * 3] == [0, -1, -3, 3] and [1 - 1, -2 - 1, 2 - 1, -8 - 3] == [0, -3, 1, -11] and [-3 - 3 * -1, 1 - 3 * -3, -11 - 3 * 3] == [0, 10, -20], "MD03 exemplo 1: as três operações do escalonamento, linha por linha")
ok(-20 // 10 == -2 and -3 - 3 * -2 == 3 and 3 - 3 - (-2) == 2, "MD03 exemplo 1: subida, z = −2, y = 3, x = 2")
E2 = ([[3, 2], [5, -2]], [12, 4])
ok(det2(E2[0]) == -16 and det2(troca_col(E2[0], E2[1], 0)) == -32 and det2(troca_col(E2[0], E2[1], 1)) == -48 and vale(E2[0], E2[1], (2, 3)), "MD03 exemplo 2 e teorema 2: D = −16, Dx = −32, Dy = −48, solução (2, 3)")
ok(all(det2([[2, 3], [4, k]]) == 2 * k - 12 for k in range(-5, 12)) and 2 * 5 == 10 and 2 * 3 == 6, "MD03 exemplo 3: D = 2k − 12; k = 6 e m = 10 são os valores críticos")
ok(all((a * d - b * c) * (e * d - b * f) * a + (a * d - b * c) * (a * f - e * c) * b == e * (a * d - b * c) ** 2 and c * (e * d - b * f) + d * (a * f - e * c) == f * (a * d - b * c) for a in G[:4] for b in G[:4] for c in G[:4] for d in G[:4] for e in G[:3] for f in G[:3]), "MD03 teorema 2: (Dx/D, Dy/D) satisfaz as duas equações (identidade em frações)")
ok(all(d * (a * x + b * y) - b * (c * x + d * y) == (a * d - b * c) * x and a * (c * x + d * y) - c * (a * x + b * y) == (a * d - b * c) * y for a in G[:4] for b in G[:4] for c in G[:4] for d in G[:4] for x in G[:3] for y in G[:3]), "MD03 teorema 2: as duas eliminações")
ok(vale([[1, 1], [2, 3]], [5, 12], (3, 2)) and 12 - 2 * 5 == 2, "MD03 teorema 1: exemplo numérico, (3, 2)")
ok(det2([[2, -5], [6, -15]]) == 0 and vale([[2, -5], [6, -15]], [0, 0], (5, 2)) and det2([[2, -5], [6, 1]]) == 32, "MD03 teorema 3: exemplos numéricos")
ok(all(a * b - b * a == 0 and c * b - d * a == -(a * d - b * c) for a in G for b in G for c in G for d in G), "MD03 teorema 3: (b, −a) é solução quando ad − bc = 0")
U = [[1, 1, 1]] * 3
ok(sarrus(U) == 0 and all(sarrus(troca_col(U, [1, 2, 3], j)) == 0 for j in range(3)), "MD03 chefão (c): x + y + z = 1, 2, 3 tem D = Dx = Dy = Dz = 0")
ok(all(vale([[1, 1, 1], [1, 2, 3], [1, 4, 7]], [6, 14, 30], (t - 2, 8 - 2 * t, t)) for t in G), "MD03 chefão (b): (t − 2, 8 − 2t, t) resolve o sistema com k = 7 e m = 30")
ok(all(sarrus([[1, 1, 1], [1, 2, 3], [1, 4, k]]) == k - 7 for k in range(-4, 15)) and 4 - 1 == 3 and 14 - 6 == 8 and 6 + 3 * 8 == 30, "MD03 chefão (a): D = k − 7; (k − 1) − 3·2 = k − 7 e m − 6 − 3·8 = m − 30")
ok(all(sarrus([[1, 1, 0], [0, 1, 1], [1, 0, 1]]) == 2 and (x + y) + (y + z) + (x + z) == 2 * (x + y + z) for x in G[:3] for y in G[:3] for z in G[:3]), "MD03 exercício 10: somar as três equações")
ok(all(Fr(x + y + z + 2 * (x - y) + (y - z), 3) == x for x in range(-3, 6) for y in range(-3, 6) for z in range(-3, 6)), "MD03 exercício 14: x = (S + 2d₁ + d₂)/3")
ok(vale([[1, 1], [2, 2]], [3, 6], (0, 3)) and vale([[1, 1], [2, 2]], [3, 6], (Fr(5, 2), Fr(1, 2))), "MD03 abertura e chute: (0, 3) e (2,5; 0,5) resolvem x + y = 3, 2x + 2y = 6")

# ---------- BW01 ----------
from math import comb as Cb, factorial as fat
def pol_mul(a, b):
    r = [0] * (len(a) + len(b) - 1)
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            r[i + j] += x * y
    return r
def pol_pot(a, n):
    r = [1]
    for _ in range(n):
        r = pol_mul(r, a)
    return r
ok(all(Cb(n, k) == Cb(n - 1, k - 1) + Cb(n - 1, k) for n in range(2, 31) for k in range(1, n)), "BW01 teorema 1: relação de Stifel até n = 30")
ok(Cb(5, 2) == 10 == Cb(4, 1) + Cb(4, 2) and (5 * 4) // 2 == 10, "BW01: C(5, 2) = 10 = 4 + 6")
ok(all(fat(n - 1) * (k + (n - k)) * fat(k) * fat(n - k) == fat(n) * fat(k) * fat(n - k) for n in range(2, 15) for k in range(1, n)), "BW01 teorema 1 pela fórmula: (n − 1)!·[k + (n − k)] = n!")
ok(pol_pot([2, 3], 4) == [16, 96, 216, 216, 81] and sum([16, 96, 216, 216, 81]) == 625 == 5 ** 4, "BW01 exemplo 1: (2x + 3)⁴ e a conferência com x = 1")
ok(all(pol_pot([p, q], n) == [Cb(n, k) * p ** (n - k) * q ** k for k in range(n + 1)] for p in (1, 2, 3) for q in (-3, -2, 1, 2, 3) for n in range(1, 8)), "BW01 teorema 2: coeficientes de (px + q)ⁿ por multiplicação direta")
ok(2 * 6 - 3 * 4 == 0 and Cb(6, 4) * 2 ** 4 == 240, "BW01 exemplo 2: k = 4 e termo independente 240")
ok(all(2 * n - 3 * (2 * n // 3) == 0 for n in (3, 6, 9)), "BW01 exemplo 2 e exercício 13: k = 2n/3 zera o expoente")
ok(Cb(5, 2) * 3 ** 3 * (-2) ** 2 == 1080 and pol_pot([3, -2], 5)[2] == 1080, "BW01 exemplo 3: coeficiente de x³ em (3x − 2)⁵")
ok(all(sum(Cb(n, k) for k in range(n + 1)) == 2 ** n and sum((-1) ** k * Cb(n, k) for k in range(n + 1)) == 0 and sum(Cb(n, k) for k in range(0, n + 1, 2)) == 2 ** (n - 1) for n in range(1, 31)), "BW01 teorema 3 e exercício 14: soma, soma alternada e soma das colunas pares")
ok(Cb(4, 1) * 2 ** 3 * 3 == 96, "BW01 pegadinha: coeficiente de x³ em (2x + 3)⁴ é 96")
ok(all(k * Cb(n, k) == n * Cb(n - 1, k - 1) for n in range(1, 25) for k in range(1, n + 1)) and all(sum(k * Cb(n, k) for k in range(n + 1)) == n * 2 ** (n - 1) for n in range(1, 25)) and 4 + 12 + 12 + 4 == 32, "BW01 chefão (a)")
ok(all(sum(Cb(n, k) ** 2 for k in range(n + 1)) == Cb(2 * n, n) for n in range(0, 20)) and 1 + 9 + 9 + 1 == 20 == Cb(6, 3), "BW01 chefão (b): soma dos quadrados")
c8 = [Cb(8, k) * 2 ** k for k in range(9)]
ok(max(c8) == 1792 and [k for k in range(9) if c8[k] == 1792] == [5, 6] and 56 * 32 == 1792 == 28 * 64 and all(Fr(c8[k + 1], c8[k]) == Fr(2 * (8 - k), k + 1) for k in range(8)), "BW01 chefão (c): maior coeficiente de (1 + 2x)⁸")
ok(11 ** 10 % 100 == 1 and Cb(10, 1) * 10 == 100, "BW01 chefão (d): 11¹⁰ termina em 01")
ok(all((1 + x) ** n >= 1 + n * x for n in range(1, 12) for x in G if x >= 0), "BW01 chefão (e): (1 + x)ⁿ ≥ 1 + nx na grade, x ≥ 0")
ok(all(pol_mul([1, c], pol_pot([1, 1], n))[j] == Cb(n, j) + c * Cb(n, j - 1) for n in range(5, 9) for c in (2, 3, -1, -2) for j in (2, 3, 4)), "BW01 exercício 15: coeficiente no produto (1 + cx)(1 + x)ⁿ")
ok(101 ** 3 == 1030301 and 99 ** 3 == 970299, "BW01 exercício 12: 101³ e 99³")
ok(sum([1, 5, 10, 10, 5, 1]) == 32, "BW01 chute: soma da linha 5")

print("\ntudo certo" if not falhas else f"\n{falhas} FALHA(S)")
sys.exit(1 if falhas else 0)
