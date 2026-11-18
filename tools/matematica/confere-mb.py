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

# ---------- MB04 ----------
ok(Fr(2, 3) == Fr(6, 9) and 2 * 9 == 3 * 6 == 18 and Fr(2 + 6, 3 + 9) == Fr(2, 3), "MB04: 2/3 = 6/9; 2·9 = 3·6 = 18; (2 + 6)/(3 + 9) = 2/3")
ok(Fr(12, 18) == Fr(2, 3) and Fr(12, 30) == Fr(2, 5), "MB04: 12 meninos e 18 meninas: 2/3; meninos sobre o total: 2/5")
# teorema 1 e teorema 2 numa grade de frações exatas
G4 = [Fr(-3), Fr(-1), Fr(1, 2), Fr(2), Fr(5)]
ok(all((a / b == c / d) == (a * d == b * c) for a in G4 for b in G4 for c in G4 for d in G4), "MB04 teorema 1: a/b = c/d ⇔ ad = bc em 625 casos")
ok(all((k * b + k * d) / (b + d) == k for k in G4 for b in G4 for d in G4 if b + d != 0), "MB04 teorema 2: (a + c)/(b + d) = a/b quando a = kb e c = kd")
ok(Fr(1, 2) + Fr(1, 3) != Fr(1 + 1, 2 + 3), "MB04: somar numeradores e denominadores NÃO é somar frações (1/2 + 1/3 ≠ 2/5)")
ok([Fr(120) * w / 6 for w in (1, 2, 3)] == [20, 40, 60], "MB04: 120 em 1 : 2 : 3 = 20, 40, 60")
inv = [Fr(1), Fr(1, 2), Fr(1, 3)]
ok([120 * w / sum(inv) for w in inv] == [Fr(720, 11), Fr(360, 11), Fr(240, 11)], "MB04: 120 inversamente a 1, 2, 3 = 720/11, 360/11, 240/11")
ok(6 * 12 == 72 == 9 * 8 and 1 * 72 == 2 * 36 == 3 * 24 == 72 and Fr(12 * 9, 6) == 18, "MB04: 6 operários × 12 dias = 72 = 9 × 8; tabela 1×72, 2×36, 3×24; o erro 'em cruz' daria 18")
ok(2 * 120 == 240 and 3 * 120 == 360 and 5 * 120 == 600 and 240 + 360 + 600 == 1200, "MB04 exemplo: 1200 em 2 : 3 : 5 = 240, 360, 600")
ok(Fr(12, 10) * Fr(13, 10) == Fr(156, 100) and 200 * Fr(156, 100) == 312 and 56 - 20 - 30 == 6 and Fr(30, 100) * 20 == 6, "MB04 exemplo: 1,2 × 1,3 = 1,56; 200 → 312; os 6% a mais são 30% de 20%")
ok(Fr(35, 100) * 240 == 84, "MB04: 35% de 240 = 84")
ok(Fr(120, 100) * Fr(80, 100) == Fr(96, 100) and Fr(20, 100) * 120 == 24 and 120 - 24 == 96, "MB04: +20% e −20%: 100 → 120 → 96")
ok(all((1 + Fr(q, 100)) * (1 - Fr(q, 100)) == 1 - Fr(q * q, 10000) for q in range(1, 100)), "MB04 teorema 3: (1 + p/100)(1 − p/100) = 1 − p²/10000, p de 1 a 99")
ok(Fr(5, 4) * Fr(4, 5) == 1 and 1 - Fr(4, 5) == Fr(20, 100), "MB04 chefão (a): depois de +25%, a queda que desfaz é de 20%")
ok(Fr(1, 100) * 100 == 1 and 1 / Fr(2, 100) == 50, "MB04 chefão (b): 1 kg de sólido; 2% do peso final → 50 kg")
ok(Fr(120, 60) == 2 and Fr(120, 40) == 3 and Fr(240, 5) == 48 and Fr(2 * 60 * 40, 60 + 40) == 48, "MB04 chefão (c): 240 km em 5 h = 48 km/h = 2·60·40/(60 + 40)")
ok(Fr(1, 6) + Fr(1, 4) - Fr(1, 12) == Fr(1, 3), "MB04 chefão (d): 1/6 + 1/4 − 1/12 = 1/3 do tanque por hora → 3 h")
ok(all(((Fr(2, 3) * b) ** 2 + (Fr(2, 3) * d) ** 2) / (b * b + d * d) == Fr(4, 9) and (Fr(2, 3) * b + Fr(2, 3) * d) / (b + d) == Fr(2, 3) for b in (1, 3, 7) for d in (2, 5, 9)), "MB04 chefão (e): (a + c)/(b + d) = 2/3 e (a² + c²)/(b² + d²) = 4/9")
ok(Fr(1, 3) + Fr(1, 6) == Fr(1, 2), "MB04 pegadinha: 1/3 + 1/6 = 1/2 do serviço por hora → 2 h")

# ---------- MB05 ----------
def q2(a, b, c, x):
    return a * x * x + b * x + c
ok(q2(1, 6, 5, -1) == 0 and q2(1, 6, 5, -5) == 0 and (-1 + 3) ** 2 == 4 and (-5 + 3) ** 2 == 4, "MB05: x² + 6x + 5 = 0 → (x + 3)² = 4 → x = −1 ou −5")
ok(q2(1, -5, 6, 2) == 0 and q2(1, -5, 6, 3) == 0 and 2 + 3 == 5 and 2 * 3 == 6, "MB05: x² − 5x + 6 = 0 tem raízes 2 e 3 (soma 5, produto 6)")
ok(49 - 24 == 25 and q2(2, -7, 3, Fr(1, 2)) == 0 and q2(2, -7, 3, 3) == 0 and Fr(1, 2) + 3 == Fr(7, 2), "MB05: 2x² − 7x + 3 = 0: Δ = 25, raízes 1/2 e 3, soma 7/2")
ok(16 - 20 == -4, "MB05: x² − 4x + 5 = 0 tem Δ = −4")
ok(q2(1, -7, 10, 2) == 0 and q2(1, -7, 10, 5) == 0 and 49 - 40 == 9, "MB05 exemplo: x² − 7x + 10 = 0: Δ = 9, raízes 2 e 5")
ok(2 * 3 + 3 * 2 == 12 and 5 * 3 - 3 * 2 == 9 and 12 + 9 == 21 == 7 * 3, "MB05 exemplo e teorema 1: 2x + 3y = 12, 5x − 3y = 9 → 7x = 21 → (3, 2)")
ok(2 * (8 + 5) == 26 and 8 * 5 == 40 and q2(1, -13, 40, 8) == 0 and q2(1, -13, 40, 5) == 0 and 169 - 160 == 9, "MB05 exemplo: perímetro 26 e área 40 → lados 8 e 5")
ok(3 + 2 == 5 and 3 - 2 == 1, "MB05: x + y = 5, x − y = 1 → (3, 2)")
ok(23 + 12 == 35 and 2 * 23 + 4 * 12 == 94 and 2 * 35 == 70 and (94 - 70) // 2 == 12, "MB05: 35 cabeças e 94 pés → 12 coelhos e 23 galinhas")
# teorema 2 (a fórmula) e teorema 3 (soma e produto), em equações de raízes racionais r e s: a(x − r)(x − s)
G5 = [Fr(-4), Fr(-3, 2), Fr(-1, 3), Fr(2), Fr(5, 2), Fr(7)]
ok(all(-(-a * (r + s)) / a == r + s and (a * r * s) / a == r * s and (a * (r + s)) ** 2 - 4 * a * (a * r * s) == (a * (r - s)) ** 2
       for a in (Fr(1), Fr(2), Fr(-3)) for r in G5 for s in G5), "MB05 teoremas 2 e 3: com raízes r e s, −b/a = r + s, c/a = rs e Δ = a²(r − s)²")
# o passo central da demonstração: 4a(ax² + bx + c) = (2ax + b)² − (b² − 4ac)
ok(all(4 * a * (a * x * x + b * x + c) == (2 * a * x + b) ** 2 - (b * b - 4 * a * c) for a in G5 for b in G5 for c in G5 for x in G5), "MB05 teorema 2: 4a(ax² + bx + c) = (2ax + b)² − Δ, em 1296 casos")
# teorema 1: eliminação
ok(all((a1 * b2 - a2 * b1) * x == (a1 * x + b1 * y) * b2 - (a2 * x + b2 * y) * b1 for a1 in G5 for b1 in G5 for a2 in G5 for b2 in G5 for x in (Fr(2), Fr(-1, 3)) for y in (Fr(5), Fr(3, 4))), "MB05 teorema 1: (a₁b₂ − a₂b₁)x = c₁b₂ − c₂b₁")
ok(Fr(2) + Fr(1, 2) == Fr(5, 2) and 2 * 4 - 5 * 2 + 2 == 0 and 25 - 16 == 9, "MB05 chefão (a): x + 1/x = 5/2 → 2 e 1/2")
ok(all(x ** 4 - 13 * x ** 2 + 36 == 0 for x in (2, -2, 3, -3)) and 4 + 9 == 13 and 4 * 9 == 36, "MB05 chefão (b): x⁴ − 13x² + 36 = 0 → ±2 e ±3")
ok(q2(1, -11, 18, 2) == 0 and q2(1, -11, 18, 9) == 0 and math.isqrt(9 + 7) == 4 == 9 - 5 and math.isqrt(2 + 7) == 3 != 2 - 5, "MB05 chefão (c): raízes 2 e 9; só o 9 serve na equação com raiz")
ok(all((2 * m) ** 2 - 4 * (m + 2) == 0 for m in (2, -1)) and q2(1, -1, -2, 2) == 0 and q2(1, -1, -2, -1) == 0, "MB05 chefão (d): raiz dupla para m = 2 e m = −1")
phi5 = (1 + Decimal(5).sqrt()) / 2
ok(abs(phi5 - (1 + 1 / phi5)) < Decimal(10) ** -50 and abs(phi5 - Decimal("1.618")) < Decimal("0.0005"), "MB05 chefão (e): x = 1 + 1/x → (1 + √5)/2 ≈ 1,618")
ok((1 + Decimal(2).sqrt()) ** 2 - 2 * (1 + Decimal(2).sqrt()) - 1 < Decimal(10) ** -50, "MB05: 1 + √2 é raiz de x² − 2x − 1")

print("\ntudo certo" if not falhas else f"\n{falhas} FALHA(S)")
sys.exit(1 if falhas else 0)
