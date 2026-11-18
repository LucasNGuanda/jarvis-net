"""Confere as contas escritas à mão no módulo MB (Matemática Básica). Rodar: python3 tools/matematica/confere-mb.py
Cada linha é uma afirmação do texto de um tema; se alguma falhar, o script sai com código 1."""
from fractions import Fraction as Fr
import sys

falhas = 0


def ok(cond, msg):
    global falhas
    print(("ok " if cond else "FALHA ") + msg)
    falhas += 0 if cond else 1


def dizima(n, d):
    """parte inteira, algarismos antes do período, período"""
    inteiro, r = divmod(n, d)
    visto, dig = {}, []
    while r and r not in visto:
        visto[r] = len(dig)
        dig.append(r * 10 // d)
        r = r * 10 % d
    ini = len(dig) if r == 0 else visto[r]
    return inteiro, "".join(map(str, dig[:ini])), "".join(map(str, dig[ini:]))


# ---------- MB01 ----------
ok(Fr(1, 2) + Fr(1, 3) == Fr(5, 6), "MB01: 1/2 + 1/3 = 5/6")
ok(Fr(1, 2) + Fr(1, 3) + Fr(1, 6) == 1, "MB01: 1/2 + 1/3 + 1/6 = 1 (chute)")
ok(Fr(2, 3) * Fr(3, 4) == Fr(1, 2), "MB01: (2/3)(3/4) = 1/2")
ok(Fr(3, 4) / Fr(2, 5) == Fr(15, 8), "MB01: (3/4) ÷ (2/5) = 15/8")
ok(Fr(18, 24) == Fr(3, 4) and Fr(3, 4) == Fr(6, 8) == Fr(9, 12), "MB01: 18/24 = 3/4 = 6/8 = 9/12")
ok(Fr(5, 7) > Fr(6, 9) and 5 * 9 == 45 and 6 * 7 == 42, "MB01: 5/7 > 6/9 (45 > 42)")
ok(dizima(1, 7) == (0, "", "142857"), "MB01: 1/7 = 0,(142857)")
ok(dizima(1, 6) == (0, "1", "6"), "MB01: 1/6 = 0,1(6)")
ok(dizima(1, 3) == (0, "", "3") and Fr(3, 9) == Fr(1, 3), "MB01: 0,(3) = 3/9 = 1/3")
ok(Fr(27, 99) == Fr(3, 11) and dizima(3, 11) == (0, "", "27"), "MB01: 0,(27) = 27/99 = 3/11")
ok(Fr(375, 900) == Fr(5, 12) and dizima(5, 12) == (0, "41", "6"), "MB01: 0,41(6) = 375/900 = 5/12")
for n in (1, 2, 3, 9, 99):
    ok(sum(Fr(1, k * (k + 1)) for k in range(1, n + 1)) == Fr(n, n + 1), f"MB01: soma telescópica até {n} = {n}/{n + 1}")
ok(sum(Fr(1, k * (k + 2)) for k in range(1, 100, 2)) == Fr(50, 101), "MB01 chefão (e): 1/(1·3) + ... + 1/(99·101) = 50/101")
ok(Fr(18) / sum(Fr(1, k * (k + 1)) for k in range(1, 10)) == 20, "MB01 chefão (f): x = 20")
ok(Fr(12, 2) + Fr(12, 3) == 10, "MB01: x/2 + x/3 = 10 tem x = 12")
ok(Fr(3 + 1, 3 - 2) == 4 and Fr(5 + 7, 5 - 2) == 4, "MB01: (x + 1)/(x − 2) = 4 tem x = 3; (x + 7)/(x − 2) = 4 tem x = 5")
ok(3 * 5 + 4 == 19, "MB01: 3x + 4 = 19 tem x = 5")
phi = 1.0
for _ in range(60):
    phi = 1 + 1 / phi
ok(abs(phi - (1 + 5 ** 0.5) / 2) < 1e-12, "MB01 ponte: a fração contínua 1 + 1/(1 + 1/(1 + ...)) é a razão áurea")

# ---------- MB02 ----------
# Identidades de polinômios, sem biblioteca de álgebra: dois polinômios de grau no máximo 4 em cada variável que coincidem numa grade de
# 6 valores por variável são o mesmo polinômio. Os valores são frações exatas (inclusive não inteiras), então não há erro de arredondamento.
import itertools
GRADE = [Fr(-2), Fr(-1), Fr(0), Fr(1, 2), Fr(1), Fr(3)]
for nome, esq, dir_ in [
    ("(a + b)² = a² + 2ab + b²", lambda a, b, c: (a + b) ** 2, lambda a, b, c: a ** 2 + 2 * a * b + b ** 2),
    ("(a − b)² = a² − 2ab + b²", lambda a, b, c: (a - b) ** 2, lambda a, b, c: a ** 2 - 2 * a * b + b ** 2),
    ("(a + b)(a − b) = a² − b²", lambda a, b, c: (a + b) * (a - b), lambda a, b, c: a ** 2 - b ** 2),
    ("(a + b)³", lambda a, b, c: (a + b) ** 3, lambda a, b, c: a ** 3 + 3 * a ** 2 * b + 3 * a * b ** 2 + b ** 3),
    ("(a + b + c)²", lambda a, b, c: (a + b + c) ** 2, lambda a, b, c: a ** 2 + b ** 2 + c ** 2 + 2 * (a * b + b * c + c * a)),
    ("a³ + b³ = (a + b)(a² − ab + b²)", lambda a, b, c: a ** 3 + b ** 3, lambda a, b, c: (a + b) * (a ** 2 - a * b + b ** 2)),
    ("a³ − b³ = (a − b)(a² + ab + b²)", lambda a, b, c: a ** 3 - b ** 3, lambda a, b, c: (a - b) * (a ** 2 + a * b + b ** 2)),
    ("a³ + b³ = (a + b)³ − 3ab(a + b)", lambda a, b, c: a ** 3 + b ** 3, lambda a, b, c: (a + b) ** 3 - 3 * a * b * (a + b)),
    ("Sophie Germain: a⁴ + 4b⁴", lambda a, b, c: a ** 4 + 4 * b ** 4, lambda a, b, c: (a ** 2 + 2 * a * b + 2 * b ** 2) * (a ** 2 - 2 * a * b + 2 * b ** 2)),
    ("completar quadrado: x² + bx (a faz o papel de x)", lambda a, b, c: a ** 2 + b * a, lambda a, b, c: (a + b / 2) ** 2 - b ** 2 / 4),
    ("x² + 6x + 5 = (x + 3)² − 4", lambda a, b, c: a ** 2 + 6 * a + 5, lambda a, b, c: (a + 3) ** 2 - 4),
    ("x² + 5x + 6 = (x + 2)(x + 3)", lambda a, b, c: a ** 2 + 5 * a + 6, lambda a, b, c: (a + 2) * (a + 3)),
    ("xy + 3x + 2y + 6 = (x + 2)(y + 3)", lambda a, b, c: a * b + 3 * a + 2 * b + 6, lambda a, b, c: (a + 2) * (b + 3)),
    ("6x² + 15x = 3x(2x + 5)", lambda a, b, c: 6 * a ** 2 + 15 * a, lambda a, b, c: 3 * a * (2 * a + 5)),
    ("n⁴ + 4 = (n² + 2n + 2)(n² − 2n + 2)", lambda a, b, c: a ** 4 + 4, lambda a, b, c: (a ** 2 + 2 * a + 2) * (a ** 2 - 2 * a + 2)),
    ("n² − 2n + 2 = (n − 1)² + 1", lambda a, b, c: a ** 2 - 2 * a + 2, lambda a, b, c: (a - 1) ** 2 + 1),
    ("x³ − 8 = (x − 2)(x² + 2x + 4)", lambda a, b, c: a ** 3 - 8, lambda a, b, c: (a - 2) * (a ** 2 + 2 * a + 4))]:
    ok(all(esq(*v) == dir_(*v) for v in itertools.product(GRADE, repeat=3)), "MB02: " + nome)
# o conferidor acusa identidade falsa? (prova de que o teste serve)
ok(not all((a + b) ** 2 == a ** 2 + b ** 2 for a, b in itertools.product(GRADE, repeat=2)), "MB02: a identidade falsa (a + b)² = a² + b² é recusada pela grade")
ok(13 ** 2 == 169 and 49 * 51 == 2499 and 101 * 99 == 9999, "MB02: 13² = 169; 49·51 = 2499; 101·99 = 9999")
ok((3 + 4) ** 2 == 49 and 3 ** 2 + 4 ** 2 == 25 and 2 * 3 * 4 == 24, "MB02 chute: (3 + 4)² = 49, 3² + 4² = 25, diferença 24")
ok(5 ** 4 + 4 == 629 == 37 * 17 and 4 ** 4 + 4 == 260 == 26 * 10 and 10 ** 4 + 4 == 10004 == 122 * 82, "MB02: 5⁴ + 4 = 629 = 37·17; 4⁴ + 4 = 260 = 26·10; 10⁴ + 4 = 10004 = 122·82")
k = Fr(3)
ok(k ** 2 - 2 == 7 and k ** 3 - 3 * k == 18, "MB02: x + 1/x = 3 dá x² + 1/x² = 7 e x³ + 1/x³ = 18")
for m in (2, 3, 4, 10, 50):
    prod = Fr(1)
    for j in range(2, m + 1):
        prod *= 1 - Fr(1, j * j)
    ok(prod == Fr(m + 1, 2 * m), f"MB02 chefão: produto até {m} = {m + 1}/{2 * m}")
ok(Fr(3, 4) * Fr(8, 9) == Fr(2, 3) and Fr(2, 3) * Fr(15, 16) == Fr(5, 8), "MB02 chefão (a): P₃ = 2/3 e P₄ = 5/8")

# ---------- MB03 ----------
# Raízes: confere-se com inteiros, elevando ao quadrado (nada de ponto flutuante nas igualdades).
import math
from decimal import Decimal, getcontext
getcontext().prec = 60
ok(2 ** 3 * 2 ** 4 == 2 ** 7 and (2 ** 3) ** 2 == 2 ** 6 and Fr(2) ** -3 == Fr(1, 8) and 2 ** 0 == 1, "MB03: 2³·2⁴ = 2⁷; (2³)² = 2⁶; 2⁻³ = 1/8; 2⁰ = 1")
ok(-3 ** 2 == -9 and (-3) ** 2 == 9 and math.isqrt(9 + 16) == 5, "MB03 pegadinha: −3² = −9, (−3)² = 9, √(9 + 16) = 5")
ok(2 ** 3 == 8 and 2 ** 2 == 4 and 3 ** 3 == 27 and 3 ** 2 == 9 and 2 ** 4 == 16 and 2 ** 3 == 8, "MB03: 8^(2/3) = 4; 27^(2/3) = 9; 16^(3/4) = 8 (pela base)")
ok(6 * 6 * 2 == 72 and 36 * 2 == 72, "MB03: √72 = 6√2 (6²·2 = 72)")
ok(12 * 3 == 36 == 6 ** 2, "MB03: √12·√3 = √36 = 6")
ok(2 * 2 * 3 == 12 and 3 * 3 * 3 == 27 and 2 + 3 == 5, "MB03: √12 + √27 = 2√3 + 3√3 = 5√3")
ok(Fr(6, 3) == 2, "MB03: 6/√3 = 6√3/3 = 2√3")
ok(3 - 2 == 1, "MB03: 1/(√3 + √2) = (√3 − √2)/(3 − 2) = √3 − √2")
# (√2 + √3)² = 5 + 2√6 e (1 + √2)² = 3 + 2√2: partes racional e irracional
ok(2 + 3 == 5 and 2 * 3 == 6 and 1 + 2 == 3 and 1 * 2 == 2, "MB03: √(5 + 2√6) = √2 + √3 e √(3 + 2√2) = 1 + √2 (soma e produto)")
ok(abs((Decimal(5) + 2 * Decimal(6).sqrt()).sqrt() - Decimal(2).sqrt() - Decimal(3).sqrt()) < Decimal(10) ** -50, "MB03: √(5 + 2√6) = √2 + √3, com 50 casas")
ok(2 ** 30 == 8 ** 10 and 3 ** 20 == 9 ** 10 and 2 ** 30 < 3 ** 20, "MB03: 2³⁰ = 8¹⁰ < 9¹⁰ = 3²⁰")
ok(2 ** 300 == 8 ** 100 and 3 ** 200 == 9 ** 100 and 2 ** 300 < 3 ** 200, "MB03 chefão (b): 2³⁰⁰ < 3²⁰⁰")
ok(2 ** 10 == 1024 and len(str(2 ** 100)) == 31 and str(2 ** 100)[:3] == "126", "MB03 chefão (a): 2¹⁰ = 1024; 2¹⁰⁰ tem 31 algarismos e começa com 1,26...")
ok(abs(1.024 ** 10 - 1.27) < 0.005, "MB03 chefão (a): 1,024¹⁰ ≈ 1,27")
ok([7 ** k % 10 for k in range(1, 6)] == [7, 9, 3, 1, 7] and 2026 % 4 == 2 and pow(7, 2026, 10) == 9 and 2026 == 4 * 506 + 2, "MB03: ciclo do 7 é 7, 9, 3, 1; 7²⁰²⁶ termina em 9")
s = sum(1 / (Decimal(k).sqrt() + Decimal(k + 1).sqrt()) for k in range(1, 100))
ok(abs(s - 9) < Decimal(10) ** -50, "MB03 chefão (e): a soma de 1/(√k + √(k+1)), k = 1..99, é 9")
ok(Fr(7, 5) ** 2 == Fr(49, 25) and float(Fr(49, 25)) == 1.96 and Fr(17, 12) ** 2 == Fr(289, 144) and abs(289 / 144 - 2.007) < 0.0005, "MB03 teorema 3: (7/5)² = 1,96 e (17/12)² ≈ 2,007")
# nenhuma fração a/b com b até 2000 tem quadrado 2 (ilustração; a prova é a do texto)
ok(all(math.isqrt(2 * b * b) ** 2 != 2 * b * b for b in range(1, 2001)), "MB03 teorema 3: 2b² nunca é quadrado perfeito para b de 1 a 2000")
ok(3 * 4 == 12 and 5 - 2 == 3 and Fr(12, 10) == Fr(6, 5), "MB03: (3×10⁵)(4×10⁻²) = 12×10³ = 1,2×10⁴")
ok(abs(Decimal(2).sqrt() - Decimal("1.41421356")) < Decimal("1e-8") and 2 ** 20 == 1048576 and 2 ** 30 == 1073741824, "MB03: √2 = 1,41421356...; 2²⁰ ≈ 10⁶ e 2³⁰ ≈ 10⁹")
ok(Fr(9) ** Fr(1, 2).numerator == 9 and 3 * 3 == 9, "MB03 teorema 2: 3·3 = 9, então 9^(1/2) = 3")

print("\ntudo certo" if not falhas else f"\n{falhas} FALHA(S)")
sys.exit(1 if falhas else 0)
