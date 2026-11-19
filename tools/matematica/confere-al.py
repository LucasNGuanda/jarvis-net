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

print("\ntudo certo" if not falhas else f"\n{falhas} FALHA(S)")
sys.exit(1 if falhas else 0)
