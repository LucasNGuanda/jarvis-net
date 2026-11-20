"""Confere as contas escritas à mão no módulo AR (Aritmética). Rodar: python3 tools/matematica/confere-ar.py
Cada linha é uma afirmação do texto de um tema; se alguma falhar, o script sai com código 1.
Sem biblioteca além da padrão: inteiros, frações exatas (Fraction) e, onde for preciso, Decimal."""
from fractions import Fraction as Fr
from math import gcd, factorial
import itertools
import sys

falhas = 0


def ok(cond, msg):
    global falhas
    print(("ok " if cond else "FALHA ") + msg)
    falhas += 0 if cond else 1


def mmc(a, b):
    return a * b // gcd(a, b)


def divs(n):
    return [d for d in range(1, n + 1) if n % d == 0]


def fat(n):
    f, d = {}, 2
    while d * d <= n:
        while n % d == 0:
            f[d] = f.get(d, 0) + 1
            n //= d
        d += 1
    if n > 1:
        f[n] = f.get(n, 0) + 1
    return f


def euclides(a, b):
    p = []
    while b:
        p.append((a, b, a // b, a % b))
        a, b = b, a % b
    return p


# ---------- TN01 ----------
ok(47 == 5 * 9 + 2 and 47 == 5 * 8 + 7 and -7 == 3 * (-3) + 2 and (-7) % 3 == 2, "TN01: 47 = 5·9 + 2 (e 5·8 + 7 não serve); −7 = 3·(−3) + 2")
ok(42 % 6 == 0 and 44 % 6 != 0 and 30 % 6 == 0 and 72 == 6 * 12 and 12 == 6 * 2 and 42 * 5 - 30 * 3 == 120 == 6 * 20, "TN01 teorema 1: 6 divide 42, 30, 72, 12 e 42·5 − 30·3 = 120; não divide 44")
ok([p for p in range(2, 30) if len(divs(p)) == 2] == [2, 3, 5, 7, 11, 13, 17, 19, 23, 29] and fat(360) == {2: 3, 3: 2, 5: 1}, "TN01: os dez primeiros primos; 360 = 2³·3²·5")
ok(fat(72) == {2: 3, 3: 2} and divs(72) == [1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72] and all(a * b == 72 for a, b in [(1, 72), (2, 36), (3, 24), (4, 18), (6, 12), (8, 9)]), "TN01 teorema 2 e figura: 72 = 2³·3² tem os 12 divisores listados, em 6 pares de produto 72")
ok(all(len(divs(n)) == eval("*".join(str(e + 1) for e in fat(n).values())) for n in range(2, 2000)), "TN01 teorema 2: (e₁ + 1)…(eₖ + 1) é a quantidade de divisores, para todo n de 2 a 1999")
ok(divs(18) == [1, 2, 3, 6, 9, 18] and divs(24) == [1, 2, 3, 4, 6, 8, 12, 24] and gcd(18, 24) == 6, "TN01: divisores de 18 e de 24; mdc 6")
ok(euclides(252, 198) == [(252, 198, 1, 54), (198, 54, 3, 36), (54, 36, 1, 18), (36, 18, 2, 0)] and gcd(252, 198) == 18, "TN01 teorema 3 e abertura: Euclides de 252 e 198; mdc 18")
ok(4 * 252 - 5 * 198 == 18 and 54 - 36 == 18 and 198 - 3 * 54 == 36 and 252 - 198 == 54, "TN01 Bézout: 18 = 4·252 − 5·198")
ok(mmc(12, 18) == 36 and fat(84) == {2: 2, 3: 1, 7: 1} and fat(120) == {2: 3, 3: 1, 5: 1} and gcd(84, 120) == 12 and mmc(84, 120) == 840 and 12 * 840 == 10080 == 84 * 120, "TN01 teorema 4: mmc(12, 18) = 36; 84 e 120: mdc 12, mmc 840, produto 10 080")
ok(all(gcd(a, b) * mmc(a, b) == a * b for a in range(1, 200) for b in range(1, 200)), "TN01 teorema 4: mdc·mmc = a·b para todos os pares até 199")
ok(gcd(gcd(2, 4), 6) == 2 and mmc(mmc(2, 4), 6) == 12 and 2 * 12 == 24 and 2 * 4 * 6 == 48, "TN01 pegadinha: com 2, 4 e 6 o produto mdc·mmc é 24, não 48")
ok(4725 == 9 * 525 and 4 + 7 + 2 + 5 == 18 and 4 * 999 + 7 * 99 + 2 * 9 + 18 == 4725, "TN01 teorema 5: 4725 = 9·525, soma dos algarismos 18")
ok(all((n % 9) == (sum(map(int, str(n))) % 9) for n in range(1, 100001)), "TN01 teorema 5: número e soma dos algarismos têm o mesmo resto por 9 (até 100 000)")
alt = lambda n: sum((-1) ** i * int(c) for i, c in enumerate(reversed(str(n))))
ok(all((n % 11 == 0) == (alt(n) % 11 == 0) for n in range(1, 100001)) and 9273 == 11 * 843 and 3 - 7 + 2 - 9 == -11, "TN01: critério do 11 (até 100 000); 9273 = 11·843, soma alternada −11")
ok(all((n % 4 == 0) == (int(str(n)[-2:]) % 4 == 0) for n in range(1, 100001)), "TN01: critério do 4 pelos dois últimos algarismos (até 100 000)")
ok(all((n ** 3 - n) % 6 == 0 and n ** 3 - n == (n - 1) * n * (n + 1) for n in range(-50, 51)), "TN01 chefão (a): n³ − n = (n − 1)n(n + 1) é múltiplo de 6")
ok(all(gcd(2 * n + 1, 3 * n + 1) == 1 for n in range(1, 2001)), "TN01 chefão (b): mdc(2n + 1, 3n + 1) = 1 para n até 2000")
ok(len(str(factorial(100))) - len(str(factorial(100)).rstrip("0")) == 24 and 100 // 5 == 20 and 100 // 25 == 4, "TN01 chefão (c): 100! termina em 24 zeros")
ok(17 * (-2) + 5 * 7 == 1 and 17 == 3 * 5 + 2 and 5 == 2 * 2 + 1 and 17 * (-2 + 5) + 5 * (7 - 17) == 1, "TN01 chefão (d): 17·(−2) + 5·7 = 1")
ok(min(n for n in range(1, 3000) if len(divs(n)) == 12) == 60 and [2 ** 11, 2 ** 5 * 3, 2 ** 3 * 9, 4 * 3 * 5] == [2048, 96, 72, 60], "TN01 chefão (e): o menor número com 12 divisores é 60")
ok(gcd(84, 120) == 12 and all(len(euclides(a, b)) > 0 for a, b in [(252, 198), (306, 136), (420, 96), (323, 136), (504, 180), (275, 120), (391, 153), (462, 198)]), "TN01 exemplo 1: os oito pares do sorteio têm Euclides bem definido")
ok(mmc(mmc(12, 18), 30) == 180 and gcd(180, 252) == 36 and (180 // 36) * (252 // 36) == 35, "TN01 exemplo 3 (primeiro acesso): faróis em 180 s; chapa 180 × 252: lado 36, 35 quadrados")
ok(len([x for x in range(1, 101) if x % 2 == 0 or x % 3 == 0]) == 67 == 50 + 33 - 16, "TN01 exercício 10 (primeiro acesso): 67 múltiplos de 2 ou de 3 até 100")
ok(1014 % 6 == 0 and all(x % 6 for x in [1004, 1010, 1015, 1021]) and 40 % gcd(12, 18) != 0, "TN01 exercícios 8 e 13 (primeiro acesso): só 1014 é divisível por 6; 40 não é múltiplo de 6")

print("\n" + ("tudo certo" if not falhas else f"{falhas} FALHA(S)"))
sys.exit(1 if falhas else 0)
