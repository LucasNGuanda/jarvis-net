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

print("\ntudo certo" if not falhas else f"\n{falhas} FALHA(S)")
sys.exit(1 if falhas else 0)
