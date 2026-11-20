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

# ---------- TN02 ----------
R200 = range(1, 201)
ok(all(sum(range(1, n + 1)) == n * (n + 1) // 2 for n in R200) and sum(range(1, 5)) == 10 and sum(range(1, 6)) == 15, "TN02 teorema 1: 1 + … + n = n(n + 1)/2 até 200; 10 e 15")
ok(all(6 * sum(k * k for k in range(1, n + 1)) == n * (n + 1) * (2 * n + 1) for n in R200) and 1 + 4 + 9 == 14 and 14 + 16 == 30 == 4 * 5 * 9 // 6, "TN02 teorema 2: soma dos quadrados até 200; 14 e 30")
ok(all(sum(k ** 3 for k in range(1, n + 1)) == (n * (n + 1) // 2) ** 2 for n in R200), "TN02 e chefão (a): soma dos cubos = quadrado da soma, até 200")
ok(all(sum(2 * k - 1 for k in range(1, n + 1)) == n * n for n in R200) and sum(range(1, 14, 2)) == 49 and 49 + 15 == 64, "TN02: soma dos ímpares = n²; 1 + 3 + … + 13 = 49 e 49 + 15 = 64")
ok(all(3 * sum(k * (k + 1) for k in range(1, n + 1)) == n * (n + 1) * (n + 2) for n in R200) and all(sum(2 * k for k in range(1, n + 1)) == n * (n + 1) for n in R200), "TN02 exemplo 1: 1·2 + … + n(n + 1) = n(n + 1)(n + 2)/3 e 2 + 4 + … + 2n = n(n + 1), até 200")
G5 = [Fr(-3), Fr(0), Fr(1, 2), Fr(2), Fr(7)]
ok(all(k * (k + 1) * (k + 2) / 3 + (k + 1) * (k + 2) == (k + 1) * (k + 2) * (k + 3) / 3 and k * k + 2 * k + 1 == (k + 1) ** 2 and k * (k + 1) + 2 * (k + 1) == (k + 1) * (k + 2) for k in G5), "TN02 exemplo 1: as três contas do passo são identidades")
ok(all(k * (k + 1) / 2 + (k + 1) == (k + 1) * (k + 2) / 2 and k * (k + 1) * (2 * k + 1) / 6 + (k + 1) ** 2 == (k + 1) * (k + 2) * (2 * k + 3) / 6 and 2 * k * k + 7 * k + 6 == (k + 2) * (2 * k + 3) for k in G5), "TN02 teoremas 1 e 2: os passos são identidades")
ok(all((k * (k + 1) / 2) ** 2 + (k + 1) ** 3 == ((k + 1) * (k + 2) / 2) ** 2 for k in G5), "TN02 chefão (a): o passo da soma dos cubos é identidade")
ok(all((a ** n - 1) % (a - 1) == 0 for a in (4, 5, 6, 7, 9) for n in range(1, 60)) and (4 ** 4 - 1) == 255 == 3 * 85, "TN02 teorema 3 e exemplo 2: aⁿ − 1 é múltiplo de a − 1; 255 = 3·85")
ok(all((4 ** n + 6 * n - 1) % 9 == 0 for n in range(1, 80)), "TN02 exercício 10: 4ⁿ + 6n − 1 é múltiplo de 9")
ok([n for n in range(1, 60) if not 2 ** n > n * n] == [2, 3, 4] and all(2 * k * k >= (k + 1) ** 2 for k in range(3, 300)) and 2 * 2 * 2 < 9, "TN02 teorema 4: 2ⁿ > n² falha só em 2, 3, 4; 2k² ≥ (k + 1)² a partir de k = 3")
ok(max(n for n in range(1, 60) if not factorial(n) > 2 ** n) == 3 and max(n for n in range(1, 60) if not factorial(n) > 3 ** n) == 6 and max(n for n in range(1, 60) if not 2 ** n > n ** 3) == 9 and max(n for n in range(1, 60) if not 2 ** n > 10 * n) == 5, "TN02 exercício 6: n! > 2ⁿ desde 4; n! > 3ⁿ desde 7; 2ⁿ > n³ desde 10; 2ⁿ > 10n desde 6")
ok(all((1 + x) ** n >= 1 + n * x for x in [Fr(-1), Fr(-1, 2), Fr(0), Fr(1, 3), Fr(2)] for n in range(1, 40)), "TN02 chefão (b): Bernoulli em cinco valores de x")


def hanoi(n):
    return 1 if n == 1 else 2 * hanoi(n - 1) + 1


ok(all(hanoi(n) == 2 ** n - 1 for n in range(1, 20)), "TN02 exercício 11: a recorrência a(n + 1) = 2a(n) + 1 dá 2ⁿ − 1")
ok(all(sum(Fr(1, k * (k + 1)) for k in range(1, n + 1)) == Fr(n, n + 1) for n in range(1, 120)), "TN02 exercício 8: 1/(1·2) + … + 1/(n(n + 1)) = n/(n + 1)")
ok(all(sum(k * factorial(k) for k in range(1, n + 1)) == factorial(n + 1) - 1 for n in range(1, 30)) and [1, 5, 23, 119] == [factorial(n + 1) - 1 for n in range(1, 5)], "TN02 exercício 15: 1·1! + … + n·n! = (n + 1)! − 1; somas parciais 1, 5, 23, 119")
ok([1 + n * (n + 1) // 2 for n in (1, 2, 3)] == [2, 4, 7], "TN02 exercício 13: 1, 2 e 3 retas dão 2, 4 e 7 regiões")
primo = lambda v: v > 1 and all(v % q for q in range(2, int(v ** 0.5) + 1))
ok(all(primo(n * n + n + 41) for n in range(40)) and 40 * 40 + 40 + 41 == 1681 == 41 * 41 and 41 * 41 + 41 + 41 == 1763 == 41 * 43 and [n for n in range(46) if not primo(n * n + n + 41)] == [40, 41, 44], "TN02 abertura: n² + n + 41 é primo de 0 a 39; 1681 = 41²; 1763 = 41·43")
fib = [0, 1, 1]
while len(fib) < 60:
    fib.append(fib[-1] + fib[-2])
ok(all(sum(fib[1:n + 1]) == fib[n + 2] - 1 for n in range(1, 50)) and fib[1:10] == [1, 1, 2, 3, 5, 8, 13, 21, 34], "TN02 chefão (d): F₁ + … + Fₙ = Fₙ₊₂ − 1")
ok(all(any(v == 3 * a + 5 * b for a in range(40) for b in range(25)) for v in range(8, 100)) and not any(7 == 3 * a + 5 * b for a in range(4) for b in range(3)), "TN02 chefão (e): 3 e 5 pagam todo valor de 8 a 99; o 7 não")
ok(fat(60) == {2: 2, 3: 1, 5: 1} and 6 * 10 == 60, "TN02 teorema 5: 60 = 6·10 = 2·3·2·5")
ok(1 != 1 * 2 // 2 + 5 and all(k * (k + 1) / 2 + 5 + (k + 1) == (k + 1) * (k + 2) / 2 + 5 for k in G5), "TN02 pegadinha e exercício 9: o passo da fórmula falsa é identidade, e a base falha (1 ≠ 6)")

# ---------- TN03 ----------
ok(38 % 12 == 14 % 12 == 2 and (38 - 14) % 12 == 0 and 16 % 7 == 2 and 24 % 7 == 3 and 40 == 7 * 5 + 5 and 16 * 24 == 384 == 7 * 54 + 6, "TN03: 38 ≡ 14 (mod 12); 16 ≡ 2 e 24 ≡ 3 (mod 7); 40 → 5; 384 → 6")
ok(all((a + c) % m == (a % m + c % m) % m and (a * c) % m == ((a % m) * (c % m)) % m and (a - c) % m == (a % m - c % m) % m for m in range(2, 25) for a in range(0, 41) for c in range(0, 41)), "TN03 teorema 1: soma, diferença e produto podem ser feitos nos restos (m até 24, números até 40)")
ok(all(pow(a, n, m) == pow(a % m, n, m) == (a ** n) % m for m in range(2, 20) for a in range(1, 30) for n in range(1, 12)), "TN03 teorema 1: potência com a base trocada pelo resto")
ok(6 % 4 == 2 % 4 and 3 % 4 != 1 % 4 and (-5) % 7 == 2 and (12 * 19) % 7 == 4 == (5 * 5) % 7 and 12 % 7 == 5 == 19 % 7 and 228 == 7 * 32 + 4, "TN03 pegadinha e chute: 6 ≡ 2 mas 3 ≢ 1 (mod 4); −5 ≡ 2 (mod 7); 12·19 = 228 → 4")
ok([pow(7, k, 10) for k in range(1, 6)] == [7, 9, 3, 1, 7] and 2026 == 4 * 506 + 2 and pow(7, 2026, 10) == 9 and len(str(7 ** 2026)) == 1713, "TN03 abertura: ciclo 7, 9, 3, 1; 7²⁰²⁶ termina em 9 e tem 1713 algarismos")
ok([pow(3, k, 7) for k in range(1, 7)] == [3, 2, 6, 4, 5, 1] and [pow(2, k, 10) for k in range(1, 9)] == [2, 4, 8, 6, 2, 4, 8, 6], "TN03 teorema 2: potências de 3 módulo 7 e de 2 módulo 10")


def periodo(a, m):
    visto, v, k = {}, a % m, 1
    while v not in visto:
        visto[v] = k
        v = v * a % m
        k += 1
    return visto[v] - 1, k - visto[v]


ok(all((periodo(a, m)[0] == 0 and pow(a, periodo(a, m)[1], m) == 1) for m in range(2, 60) for a in range(1, 60) if gcd(a, m) == 1), "TN03 teorema 2: com mdc 1 o ciclo começa no início e passa pelo 1 (a e m até 59)")
primos = [q for q in range(2, 100) if all(q % d for d in range(2, q))]
ok(all(pow(a, q - 1, q) == 1 for q in primos for a in range(1, 200) if a % q), "TN03 teorema 3 (Fermat): a^(p − 1) ≡ 1 para os primos até 97")
ok(sorted((3 * k) % 7 for k in range(1, 7)) == [1, 2, 3, 4, 5, 6] and [(3 * k) % 7 for k in range(1, 7)] == [3, 6, 2, 5, 1, 4] and 3 ** 6 == 729 == 7 * 104 + 1, "TN03 teorema 3: 3, 6, 2, 5, 1, 4 e 3⁶ = 729 = 7·104 + 1")
ok(all(sorted((a * k) % q for k in range(1, q)) == list(range(1, q)) for q in primos for a in range(1, q)), "TN03 teorema 3: a, 2a, …, (p − 1)a são 1, …, p − 1 em outra ordem")
ok((5 * 3) % 7 == 1 and (3 * 3) % 7 == 2 and (5 * 2) % 7 == 3 and (3 * 7) % 10 == 1 and [(4 * k) % 10 for k in range(1, 6)] == [4, 8, 2, 6, 0] and gcd(4, 10) == 2, "TN03 teorema 4: inverso de 5 (mod 7) é 3; 5x ≡ 3 dá x ≡ 2; 3·7 ≡ 1 (mod 10); 4 não tem inverso módulo 10")
ok(all((gcd(a, m) == 1) == any((a * u) % m == 1 for u in range(m)) for m in range(2, 61) for a in range(1, m)), "TN03 teorema 4: existe inverso exatamente quando o mdc é 1 (m até 60)")
ok(pow(3, 100, 7) == 4 and 100 == 6 * 16 + 4 and pow(3, 4, 7) == 4, "TN03 exemplo 1 (primeiro acesso): 3¹⁰⁰ ≡ 4 (mod 7)")
ok(all(pow(8, n, 7) == 1 and (2 ** (3 * n) - 1) % 7 == 0 for n in range(1, 60)), "TN03 chefão (a): 2^(3n) − 1 é múltiplo de 7")
ok(sorted(set(x * x % 4 for x in range(100))) == [0, 1] and 2023 == 4 * 505 + 3 and not any(x * x + y * y == 2023 for x in range(46) for y in range(46)), "TN03 chefão (b): quadrados deixam 0 ou 1 por 4; 2023 ≡ 3; x² + y² = 2023 não tem solução")
ok(pow(3, 2025, 7) == 6 and 2025 == 6 * 337 + 3 and pow(7, 2026, 100) == 49 and [pow(7, k, 100) for k in range(1, 5)] == [7, 49, 43, 1] and 43 * 7 == 301, "TN03 chefão (c) e (d): 3²⁰²⁵ ≡ 6 (mod 7); 7²⁰²⁶ termina em 49")
ok(min(x for x in range(1, 100) if x % 3 == 2 and x % 5 == 3) == 8 and [x for x in range(1, 50) if x % 3 == 2 and x % 5 == 3] == [8, 23, 38], "TN03 chefão (e): menor solução 8, e as outras de 15 em 15")
ok(sorted(set(x * x % 10 for x in range(10))) == [0, 1, 4, 5, 6, 9] and [x * x % 10 for x in range(10)] == [0, 1, 4, 9, 6, 5, 6, 9, 4, 1], "TN03 exercício 15: últimos algarismos dos quadrados")
ok(pow(2, 100, 13) == 3 and (347 * 26) % 9 == (5 * 8) % 9 == 4 and 347 * 26 == 9022 and 9122 % 9 == 5 and (-5) % 7 == 100 % 7 == 2, "TN03 exercícios 11, 13 e 8 (primeiro acesso): 2¹⁰⁰ ≡ 3 (mod 13); 347·26 = 9022 e 9122 falha na prova dos nove; −5 ≡ 100 (mod 7)")
ok(all(int(str(d) * k) % 11 == (d if k % 2 else 0) and int(str(d) * k) % 9 == (d * k) % 9 for d in range(1, 10) for k in range(1, 60)), "TN03 exercício 16: resto de dd…d por 11 e por 9")

# ---------- BN01 ----------
DIG = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"


def base(n, b):
    if n == 0:
        return "0"
    d = ""
    while n:
        d = DIG[n % b] + d
        n //= b
    return d


ok(base(45, 2) == "101101" and base(45, 8) == "55" and base(45, 16) == "2D" and 32 + 8 + 4 + 1 == 45 and 5 * 8 + 5 == 45, "BN01: 45 = 101101₂ = 55₈ = 2D₁₆")
ok(base(2026, 2) == "11111101010" and base(2026, 8) == "3752" and base(2026, 16) == "7EA" and 1024 + 512 + 256 + 128 + 64 + 32 + 8 + 2 == 2026 and 2 * 1000 + 2 * 10 + 6 == 2026, "BN01 chefão (b) e exemplo 3: 2026 em binário, octal e hexadecimal")
ok(all(int(base(n, b), b) == n for n in range(0, 5001) for b in range(2, 17)), "BN01 teorema 1: ida e volta de base para n até 5000, bases de 2 a 16")
passos, n = [], 45
while n:
    passos.append((n, n // 2, n % 2))
    n //= 2
ok(passos == [(45, 22, 1), (22, 11, 0), (11, 5, 1), (5, 2, 1), (2, 1, 0), (1, 0, 1)], "BN01 teorema 1: divisões sucessivas de 45 por 2")
ok(all(len(base(n, b)) == k for b in range(2, 17) for k in range(1, 6) for n in (b ** (k - 1), b ** k - 1)) and all(b ** (len(base(n, b)) - 1) <= n < b ** len(base(n, b)) for n in range(1, 3000) for b in range(2, 17)), "BN01 teorema 3: k algarismos exatamente quando b^(k − 1) ≤ n < b^k")
ok(int("1000", 2) == 8 and int("1111", 2) == 15 and 2 ** 9 == 512 <= 1000 < 1024 == 2 ** 10 and len(base(1000, 2)) == 10 and 2 ** 10 - 1 == 1023, "BN01 teorema 3 e abertura: 1000 tem 10 algarismos binários; dez dedos contam até 1023")
ok(all(sum(DIG.index(c) for c in base(n, b)) % (b - 1) == n % (b - 1) for n in range(1, 4000) for b in range(3, 17)), "BN01 teorema 4 e chefão (a): soma dos algarismos ≡ número (mod b − 1)")
ok(base(2026, 7) == "5623" and 5 * 343 + 6 * 49 + 2 * 7 + 3 == 2026 and 5 + 6 + 2 + 3 == 16 and 2026 % 6 == 16 % 6 == 4, "BN01 teorema 4: 5623₇ = 2026; soma 16; resto 4 por 6")
ok(all(base(n, 8) == "".join(str(int(g, 2)) for g in [base(n, 2).zfill(-(-len(base(n, 2)) // 3) * 3)[i:i + 3] for i in range(0, -(-len(base(n, 2)) // 3) * 3, 3)]).lstrip("0") for n in range(1, 5000)), "BN01 teorema 2: agrupar de 3 em 3 dá o octal (n até 4999)")
ok(all(base(n, 16) == "".join(DIG[int(g, 2)] for g in [base(n, 2).zfill(-(-len(base(n, 2)) // 4) * 4)[i:i + 4] for i in range(0, -(-len(base(n, 2)) // 4) * 4, 4)]).lstrip("0") for n in range(1, 5000)), "BN01 teorema 2: agrupar de 4 em 4 dá o hexadecimal (n até 4999)")
ok(base(11 + 6, 2) == "10001" and base(11, 2) == "1011" and base(6, 2) == "110", "BN01: 1011₂ + 110₂ = 10001₂")
ok([b for b in range(5, 40) if (b + 3) * 4 == b * b] == [6] and int("13", 6) == 9 and base(36, 6) == "100", "BN01 chefão (c): 13·4 = 100 só na base 6")
ok(len(str(2 ** 100)) == 31 and int(100 * 0.30103) == 30, "BN01 chefão (d): 2¹⁰⁰ tem 31 algarismos")
pesos = sorted(set(a * 1 + b * 3 + c * 9 + d * 27 for a in (-1, 0, 1) for b in (-1, 0, 1) for c in (-1, 0, 1) for d in (-1, 0, 1)))
ok(27 - 9 + 3 - 1 == 20 and pesos == list(range(-40, 41)) and 3 ** 4 == 81, "BN01 chefão (e): 20 = 27 − 9 + 3 − 1; os pesos 1, 3, 9, 27 dão todo inteiro de −40 a 40, sem repetir")
ok(Fr(1, 2) + Fr(1, 8) == Fr(5, 8) and float(Fr(5, 8)) == 0.625 and base(181, 2) == "10110101" and base(194, 5) == "1234" and base(100, 3) == "10201" and base(37, 2) == "100101", "BN01 exercícios (primeiro acesso): 0,101₂ = 0,625; 181, 194, 100 e 37 nas bases 2, 5, 3 e 2")
ok(int("142", 7) == 79 and 2026 % 7 == 3 and 80 == 2 ** 4 * 5 and base(80, 2) == "1010000" and 4 * 5 ** 2 == 100 and (int("101101", 2), int("56", 8), int("2C", 16), int("133", 5)) == (45, 46, 44, 43), "BN01 exercícios 10 a 14 (primeiro acesso)")

# ---------- CNJ01 ----------
A1, B1 = {1, 2, 3, 4, 5, 6}, {4, 5, 6, 7, 8}
ok(A1 | B1 == set(range(1, 9)) and A1 & B1 == {4, 5, 6} and A1 - B1 == {1, 2, 3} and B1 - A1 == {7, 8} and 6 + 5 - 3 == 8, "CNJ01: operações com A = {1..6} e B = {4..8}; 6 + 5 − 3 = 8")
ok(all(len(list(itertools.chain.from_iterable(itertools.combinations(range(n), k) for k in range(n + 1)))) == 2 ** n for n in range(0, 13)), "CNJ01 teorema 1: 2ⁿ subconjuntos, listando todos (n até 12)")
ok(len([c for k in range(4) for c in itertools.combinations([1, 2, 3], k)]) == 8, "CNJ01 teorema 1: {1, 2, 3} tem 8 subconjuntos")
U12 = set(range(1, 13))
A2, B2 = {x for x in U12 if x % 2 == 0}, {x for x in U12 if x % 3 == 0}
ok(A2 | B2 == {2, 3, 4, 6, 8, 9, 10, 12} and U12 - (A2 | B2) == {1, 5, 7, 11} and U12 - A2 == {1, 3, 5, 7, 9, 11} and U12 - B2 == {1, 2, 4, 5, 7, 8, 10, 11} and (U12 - A2) & (U12 - B2) == {1, 5, 7, 11}, "CNJ01 teorema 2: exemplo de De Morgan com múltiplos de 2 e de 3 até 12")
U5 = set(range(1, 6))
sub5 = [set(c) for k in range(6) for c in itertools.combinations(sorted(U5), k)]
ok(all(U5 - (X | Y) == (U5 - X) & (U5 - Y) and U5 - (X & Y) == (U5 - X) | (U5 - Y) for X in sub5 for Y in sub5), "CNJ01 teorema 2: as duas leis de De Morgan nos 1024 pares de subconjuntos de {1, …, 5}")
ok(all(X - (Y | W) == (X - Y) & (X - W) for X in sub5 for Y in sub5 for W in sub5), "CNJ01 chefão (a): A − (B ∪ C) = (A − B) ∩ (A − C) nos 32 768 trios")
ok(all((X | Y == Y and X & Y == X) for X in sub5 for Y in sub5 if X <= Y), "CNJ01 chefão (b): se A ⊂ B, então A ∪ B = B e A ∩ B = A")
ok(25 + 18 - 10 == 33 and 40 - 33 == 7 and 25 + 18 == 43, "CNJ01 abertura e teorema 3: 25 + 18 − 10 = 33 e 7 de fora")
ok(all(len(X | Y) == len(X) + len(Y) - len(X & Y) for X in sub5 for Y in sub5), "CNJ01 teorema 3: n(A ∪ B) = n(A) + n(B) − n(A ∩ B)")
M2, M3, M5 = [{x for x in range(1, 61) if x % k == 0} for k in (2, 3, 5)]
ok((len(M2), len(M3), len(M5), len(M2 & M3), len(M2 & M5), len(M3 & M5), len(M2 & M3 & M5)) == (30, 20, 12, 10, 6, 4, 2) and len(M2 | M3 | M5) == 44 == 30 + 20 + 12 - 10 - 6 - 4 + 2, "CNJ01 teorema 4: de 1 a 60, 44 múltiplos de 2, 3 ou 5")
ok(all(len(X | Y | W) == len(X) + len(Y) + len(W) - len(X & Y) - len(X & W) - len(Y & W) + len(X & Y & W) for X in sub5 for Y in sub5 for W in sub5), "CNJ01 teorema 4: inclusão e exclusão com três conjuntos, em todos os trios")
ok(2 ** 8 == 256 == len([c for k in range(11) for c in itertools.combinations(range(1, 11), k) if 1 in c and 2 not in c]), "CNJ01 chefão (c): 256 subconjuntos de {1, …, 10} com o 1 e sem o 2")
ok(70 + 75 + 80 - 200 == 25 == 100 - (30 + 25 + 20), "CNJ01 chefão (d): pelo menos 25%")
ok(len([x for x in range(1, 101) if x % 2 and x % 3 and x % 5]) == 26 and 50 + 33 + 20 - 16 - 10 - 6 + 3 == 74, "CNJ01 chefão (e): 26 números de 1 a 100 não são múltiplos de 2, 3 nem 5")
r = {7: 5, 3: 7, 5: 4, 6: 6, 1: 12, 2: 9, 4: 10, 0: 8}
ok(sum(r.values()) == 61 and r[1] + r[3] + r[5] + r[7] == 28 and r[2] + r[3] + r[6] + r[7] == 27 and r[4] + r[5] + r[6] + r[7] == 25 and 28 - 7 - 4 - 5 == 12, "CNJ01 exemplo 3 (primeiro acesso): 61 estudantes; 28, 27 e 25; só a primeira: 12")
ok(15 + 8 + 10 + 7 == 40 and 28 + 25 - 40 == 13 and 100 - (50 + 33 - 16) == 33 and 4 * 3 == 12 and 2 ** 5 - 1 == 31, "CNJ01 exemplo 2 e exercícios 7, 13, 14 e 15 (primeiro acesso)")

# ---------- CNJ02 ----------
from decimal import Decimal, getcontext
getcontext().prec = 60
ok(not any(Fr(p_, q_) ** 2 == 2 or Fr(p_, q_) ** 2 == 3 for q_ in range(1, 2001) for p_ in (int(q_ * 1.41421356), int(q_ * 1.41421356) + 1, int(q_ * 1.7320508), int(q_ * 1.7320508) + 1)), "CNJ02 teorema 1 e chefão (a): nenhuma fração de denominador até 2000 tem quadrado 2 ou 3")
ok(Fr(141, 100) ** 2 == Fr(19881, 10000) and Fr(142, 100) ** 2 == Fr(20164, 10000) and abs(Fr(99, 70) ** 2 - 2) < abs(Fr(141, 100) ** 2 - 2) and Fr(99, 70) ** 2 != 2, "CNJ02: 1,41² = 1,9881; 1,42² = 2,0164; 99/70 aproxima melhor que 141/100 e não é exata")
ok(all((round(n ** 0.5) ** 2 == n) == any(Fr(a, b) ** 2 == n for b in range(1, 40) for a in range(1, 800)) for n in range(1, 200)), "CNJ02 teorema 1: até 199, √n só é fração (denominador até 39) quando n é quadrado perfeito")


def geratriz(per, k):
    return Fr(per, 10 ** k - 1)


def expande(fr_, casas=40):
    n, d, s = fr_.numerator, fr_.denominator, ""
    r = n % d
    for _ in range(casas):
        r *= 10
        s += str(r // d)
        r %= d
    return s


ok(geratriz(3, 1) == Fr(1, 3) and geratriz(27, 2) == Fr(3, 11) and geratriz(9, 1) == 1 and Fr(11, 90) == Fr(1, 10) + Fr(2, 90) and expande(Fr(11, 90)).startswith("12222222"), "CNJ02 teorema 2 e chefão (c): 0,333… = 1/3; 0,(27) = 3/11; 0,999… = 1; 0,1222… = 11/90")
ok(all(expande(geratriz(per, 2)) == (str(per).zfill(2) * 20) for per in range(10, 99)), "CNJ02 teorema 2: per/99 volta a ser 0,(per) para todo período de 2 algarismos")
ok(Fr(36, 99) == Fr(4, 11) and Fr(27, 99).denominator == 11, "CNJ02 exemplo 2 e exercício 3 (primeiro acesso): 27/99 = 3/11 e 36/99 = 4/11")


def periodo10(d):
    return [k for k in range(1, 100) if (10 ** k - 1) % d == 0][0]


ok([periodo10(d) for d in (7, 11, 13, 27, 37, 41, 21, 33)] == [6, 2, 6, 3, 3, 5, 6, 2] and expande(Fr(1, 7)).startswith("142857142857"), "CNJ02 exercício 14: períodos de 1/7, 1/11, 1/13, 1/27, 1/37, 1/41, 1/21, 1/33")
ok(all(a < (a + b) / 2 < b for a in [Fr(1, 3), Fr(-2, 5), Fr(7, 9)] for b in [Fr(1, 2), Fr(5, 6), Fr(8, 9)] if a < b) and (Fr(1, 3) + Fr(1, 2)) / 2 == Fr(5, 12), "CNJ02 teorema 3: a média fica entre os dois; entre 1/3 e 1/2 está 5/12")
r2, r3, r7, r8 = Decimal(2).sqrt(), Decimal(3).sqrt(), Decimal(7).sqrt(), Decimal(8).sqrt()
ok(abs(r2 * r8 - 4) < Decimal("1e-50") and abs((r7 + r3) * (r7 - r3) - 4) < Decimal("1e-50") and Fr(1, 3) < Fr(4714, 10000) < Fr(1, 2) and abs(r2 / 3 - Decimal("0.4714045")) < Decimal("1e-6") and abs(3 + r2 - Decimal("4.4142135")) < Decimal("1e-6"), "CNJ02: √2·√8 = 4; (√7 + √3)(√7 − √3) = 4; √2/3 ≈ 0,4714 fica entre 1/3 e 1/2; 3 + √2 ≈ 4,41421")


def dentro(I, x):
    a, b, fa, fb = I
    return (x > a or (x == a and fa)) and (x < b or (x == b and fb))


A_, B_ = (-3, 2, True, False), (0, 5, True, True)
xs = [Fr(k, 2) for k in range(-12, 16)]
ok(all((dentro(A_, x) or dentro(B_, x)) == dentro((-3, 5, True, True), x) and (dentro(A_, x) and dentro(B_, x)) == dentro((0, 2, True, False), x) and (dentro(A_, x) and not dentro(B_, x)) == dentro((-3, 0, True, False), x) for x in xs), "CNJ02 figura e exemplo 3: [−3, 2[ e [0, 5]: união [−3, 5], interseção [0, 2[, diferença [−3, 0[")
ok(len([x for x in range(-2, 6) if dentro((-2, 5, False, True), x)]) == 7 and len([x for x in range(2, 6)]) == 4 and 3 - 1 == 2, "CNJ02 exercícios 5 e 6 e pegadinha (primeiro acesso): ]−2, 5] tem 7 inteiros; [2, 5] tem 4; ]1, 3] mede 2")
ok(len([n for n in range(1, 101) if round(n ** 0.5) ** 2 == n]) == 10 and 50 - 7 == 43 and 7 * 7 < 50 < 8 * 8 and (0.2 + 0.25) / 2 == 0.225, "CNJ02 exercícios 8, 10, 12 e 16 (primeiro acesso)")

# ---------- RLM01 ----------
BB = [(True, True), (True, False), (False, True), (False, False)]
imp = lambda a, b: (not a) or b
col = lambda f: [f(p_, q_) for p_, q_ in BB]
ok(col(lambda p_, q_: p_ and q_) == [True, False, False, False] and col(lambda p_, q_: p_ or q_) == [True, True, True, False] and col(imp) == [True, False, True, True] and col(lambda p_, q_: p_ == q_) == [True, False, False, True], "RLM01: tabelas de e, ou, se… então e se, e somente se")
ok(col(imp) == col(lambda p_, q_: (not p_) or q_) == col(lambda p_, q_: imp(not q_, not p_)), "RLM01 teorema 1: p → q ≡ ¬p ∨ q ≡ ¬q → ¬p")
ok(col(lambda p_, q_: imp(q_, p_)) == [True, True, False, True] != col(imp) and col(lambda p_, q_: imp(not p_, not q_)) == col(lambda p_, q_: imp(q_, p_)), "RLM01 teorema 1: a recíproca tem coluna V, V, F, V (diferente) e a inversa tem a mesma coluna da recíproca")
ok(col(lambda p_, q_: not (p_ and q_)) == col(lambda p_, q_: (not p_) or (not q_)) and col(lambda p_, q_: not (p_ or q_)) == col(lambda p_, q_: (not p_) and (not q_)) and col(lambda p_, q_: not imp(p_, q_)) == col(lambda p_, q_: p_ and not q_), "RLM01 teorema 2: De Morgan e ¬(p → q) ≡ p ∧ ¬q")
ok(all(imp(imp(p_, q_) and imp(q_, r_), imp(p_, r_)) for p_ in (True, False) for q_ in (True, False) for r_ in (True, False)), "RLM01 chefão (a): a transitividade da condicional é tautologia nas 8 linhas")
ok(12 % 6 == 0 and 12 % 2 == 0 and 8 % 6 != 0 and 8 % 2 == 0 and all(n % 2 == 0 for n in range(-600, 600) if n % 6 == 0), "RLM01: todo múltiplo de 6 é par; 8 é par e não é múltiplo de 6")
ok(not (8 % 2 == 0 and all(8 % d for d in range(2, 8))) and (9 % 2 == 1 and 9 % 3 == 0), "RLM01 teorema 2: '8 é par e primo' é falsa; 9 é ímpar e não é primo")


def pior_caso(casas, k):
    # maior número de objetos que ainda NÃO obriga k numa casa (busca exaustiva em distribuições não crescentes)
    melhor = 0

    def rec(i, usado, lim):
        nonlocal melhor
        if i == casas:
            melhor = max(melhor, usado)
            return
        for c in range(0, min(lim, k - 1) + 1):
            rec(i + 1, usado + c, c)

    rec(0, 0, k - 1)
    return melhor


ok(all(pior_caso(n_, k_) + 1 == n_ * (k_ - 1) + 1 for n_ in range(1, 7) for k_ in range(2, 6)), "RLM01 teorema 3: com n(k − 1) objetos ainda dá para evitar k numa casa, e com um a mais não dá (busca em casos pequenos)")
ok((2 - 1) * 12 + 1 == 13 and 3 + 1 == 4 and 4 * (3 - 1) + 1 == 9 and 2 ** 4 == 16, "RLM01 exercícios 6, 10, 11 e 16 (primeiro acesso): 16 linhas; 13 pessoas; 4 meias; 9 cartas")
sols = [(a, b, c) for a in (True, False) for b in (True, False) for c in (True, False) if a == (not b) and b == (not c) and c == ((not a) and (not b))]
ok(sols == [(False, True, False)], "RLM01 exemplo 3 e exercício 13: no problema dos três, só o segundo fala a verdade (solução única)")
sols2 = [(a, b) for a in (True, False) for b in (True, False) if a == ((not a) or (not b))]
ok(sols2 == [(True, False)], "RLM01 chefão (d): quem diz 'pelo menos um de nós mente' é veraz e o outro mente")
vogal, par = lambda c: c in "AEIOU", lambda c: c in "02468"
precisa = [c for c in "AK47" if any((vogal(c) and not par(o)) or (vogal(o) and c.isdigit() and not par(c)) for o in ("A", "K", "4", "7") if o.isdigit() != c.isdigit())]
ok(precisa == ["A", "7"], "RLM01 chefão (e): só A e 7 podem esconder uma violação da regra 'vogal → par'")
ok(len([1 for p_ in (True, False) for q_ in (True, False) for r_ in (True, False) if imp(p_ or q_, r_)]) == 5 and all(any((x - y) % 10 == 0 for i, x in enumerate(L11) for y in L11[i + 1:]) for L11 in ([3, 14, 25, 36, 47, 58, 69, 70, 81, 92, 103], list(range(100, 111)))), "RLM01 exercício 14 (primeiro acesso): (p ∨ q) → r é verdadeira em 5 linhas; chefão (c) em dois exemplos de 11 inteiros")

# ---------- EF01 ----------
f_ = lambda p_: 1 + Fr(p_, 100)
ok(80 * f_(15) == 92 and 80 * f_(-15) == 68 and f_(20) * f_(-20) == Fr(96, 100) == f_(-20) * f_(20), "EF01: 80 com +15% dá 92 e com −15% dá 68; +20% e −20% dá 0,96 nas duas ordens")
ok(250 * f_(-20) == 200 and 200 * f_(-10) == 180 and 250 * Fr(72, 100) == 180 and 250 * f_(-10) == 225 and 225 * f_(-20) == 180 and 1 - f_(-20) * f_(-10) == Fr(28, 100), "EF01 teorema 1 e exemplo 1: 250 → 200 → 180; desconto único de 28%")
ok(all(f_(p_) * f_(-p_) == 1 - Fr(p_ * p_, 10000) for p_ in range(0, 101)), "EF01 teorema 2 e chefão (a): (1 + p/100)(1 − p/100) = 1 − p²/10 000")
ok(all(f_(p_) * (1 - Fr(100 * p_, 100 + p_) / 100) == 1 for p_ in range(1, 400)) and Fr(100 * 25, 125) == 20 and all(f_(-p_) * (1 + Fr(100 * p_, 100 - p_) / 100) == 1 for p_ in range(1, 100)), "EF01 teorema 3: o desconto 100p/(100 + p)% desfaz +p%; o aumento 100p/(100 − p)% desfaz −p%")
ok(150 / f_(25) == 120 and 150 * f_(-25) == Fr(225, 2) and Fr(30, 150) == Fr(20, 100) and Fr(100 * 20, 80) == 25 and Fr(100 * 50, 50) == 100, "EF01 exemplo 2: 150 ÷ 1,25 = 120 (e não 112,50); −20% pede +25%; −50% pede +100%")
ok(Fr(10, 100) * 2 == Fr(2, 10) and Fr(40, 100) * 3 == Fr(12, 10) and (Fr(2, 10) + Fr(12, 10)) / 5 == Fr(28, 100) and Fr(10 + 40, 2) == 25, "EF01 teorema 4 e exemplo 3: 2 L a 10% com 3 L a 40% dão 28% (a média simples seria 25%)")
ok(all(min(c1, c2) <= Fr(c1 * m1 + c2 * m2, m1 + m2) <= max(c1, c2) for c1 in range(0, 101, 10) for c2 in range(0, 101, 10) for m1 in range(1, 6) for m2 in range(1, 6)), "EF01 teorema 4: a concentração da mistura fica entre as duas")
ok(Fr(55, 100) * Fr(80, 100) == Fr(44, 100) and Fr(11, 10) ** 3 == Fr(1331, 1000) and Fr(20, 100) * 5 == 1 and 1 / Fr(25, 100) == 4 and Fr(20, 80) == Fr(25, 100), "EF01 chefão (b) a (e): 1,1³ = 1,331; 1 kg de sal em 4 kg é 25%; 20/80 = 25%; 55% de 80% = 44%")
ok(100 * Fr(1, 100) / Fr(2, 100) == 50 and Fr(16 * 25, 100) == 4 and f_(10) * f_(20) == Fr(132, 100) and f_(25) * f_(-20) == 1 and (f_(10) ** 3 - 1) * 100 == Fr(331, 10), "EF01 exercícios 12 a 16 (primeiro acesso): 33,1%; área +32%; 16% de 25 = 4; carga de 50 kg; gasto igual")
ok(Fr(35 * 240, 100) == 84 and 350 * f_(-20) == 280 and Fr(92 - 80, 80) == Fr(15, 100) and Fr(14, 40) == Fr(35, 100) and 80 * f_(25) == 100 and Fr(20, 100) == Fr(100 - 80, 100) and Fr(3 * 20 + 2 * 45, 5) == 30 and Fr(12 - 10, 10) == Fr(20, 100) and Fr(101, 100) * Fr(102, 100) == Fr(10302, 10000), "EF01 exercícios 1 a 11 (primeiro acesso) e a conta 1,01·1,02 = 1,0302")

# ---------- EF02 ----------
g_ = lambda i_: 1 + Fr(i_, 100)
ok([1000 * (1 + Fr(10, 100) * k) for k in range(4)] == [1000, 1100, 1200, 1300] and [1000 * g_(10) ** k for k in range(4)] == [1000, 1100, 1210, 1331] and 1331 - 1300 == 31, "EF02: 1000 a 10% por 3 períodos: 1300 (simples) e 1331 (compostos)")
ok(all(g_(i_) ** t >= 1 + Fr(i_, 100) * t and ((g_(i_) ** t == 1 + Fr(i_, 100) * t) == (t <= 1)) for i_ in range(1, 60) for t in range(0, 25)), "EF02 teorema 3 e chefão (a): (1 + i)ᵗ ≥ 1 + it, com igualdade só em t = 0 e t = 1")
ok(all(float(g_(i_)) ** 0.5 < 1 + i_ / 200 for i_ in range(1, 100)), "EF02 teorema 3: para meio período a reta fica acima da curva (√(1 + i) < 1 + i/2)")
ok(abs(float(g_(2) ** 12 - 1) * 100 - 26.82) < 0.005 and g_(10) ** 2 == Fr(121, 100) and g_(20) ** 2 == Fr(144, 100) and 12 * 2 == 24, "EF02 teorema 4, abertura e chute: 1,02¹² − 1 ≈ 26,82%; 1,1² = 1,21; 1,2² = 1,44")
ok(Fr(200, 5) == 40 and 1210 / g_(10) ** 2 == 1000 and 1000 * (g_(10) ** 3 + g_(10) ** 2 + g_(10)) == 3641, "EF02 chefão (b) e (e) e valor presente: 40 meses; 1210 vale 1000 hoje; três depósitos somam 3641")
x_ = (-1 + 8.2 ** 0.5) / 2
ok(abs(0.5 * x_ + 0.5 * x_ * x_ - 0.9) < 1e-12 and abs(x_ - 0.9318) < 5e-5 and abs((1 / x_ - 1) * 100 - 7.32) < 0.005, "EF02 chefão (d): x ≈ 0,9318 resolve 0,5x + 0,5x² = 0,9; taxa de cerca de 7,32% ao mês")
ok(800 * (1 + Fr(3, 100) * 5) == 920 and Fr(100, 3) == Fr(100, 3) and 1000 * g_(10) ** 3 == 1331 and (g_(10) ** 3 - 1) * 100 == Fr(331, 10), "EF02 exemplos 1 e 2 (primeiro acesso): 920 reais; 1331 reais e taxa de 33,1%")
ok(1000 * Fr(95, 100) == 950 and abs(float(500 + 500 / g_(2)) - 990.196) < 0.001 and 950 < 500 + 500 / g_(2), "EF02 exemplo 3 (primeiro acesso): 950 à vista contra 990,20 a prazo")
ok(Fr(600 * 2 * 8, 100) == 96 and 1500 * (1 + Fr(12, 100) * 3) == 2040 and Fr(2000 * 15 * 10, 1000) == 300 and Fr(200, 5) == 40 and 2000 * g_(10) ** 2 == 2420 and 5000 * g_(20) ** 3 - 5000 == 3640 and 4000 * g_(10) ** 2 == 4840, "EF02 exercícios 1 a 7 (primeiro acesso)")
ok([t for t in range(1, 200) if g_(10) ** t >= 2][0] == 8 and 1000 * Fr(97, 100) == 970 and abs(float(500 + 500 / g_(4)) - 980.769) < 0.001 and (2000 * g_(10) - 1200) * g_(10) == 1100 and abs(float(g_(10) / g_(4) - 1) * 100 - 5.769) < 0.001 and abs(float(1000 / (1 / g_(10) + 1 / g_(10) ** 2)) - 576.19) < 0.005 and 2100 / (1 / g_(10) + 1 / g_(10) ** 2) == 1210, "EF02 exercícios 11 a 16 (primeiro acesso): dobra em 8 anos; 970 × 980,77; saldo 1100; ganho real 5,77%; parcela 576,19")

# ---------- EF03 ----------
from itertools import product as prod_
def est_(v):
    n = len(v); m = Fr(sum(v), n); o = sorted(v)
    med = o[n // 2] if n % 2 else Fr(o[n // 2 - 1] + o[n // 2], 2)
    return dict(m=m, med=med, amp=o[-1] - o[0], dm=sum(abs(x - m) for x in v) / n, var=sum((x - m) ** 2 for x in v) / n)
e_ = est_([2, 4, 4, 5, 7, 8])
ok(e_["m"] == 5 and e_["med"] == Fr(9, 2) and e_["amp"] == 6 and e_["dm"] == Fr(5, 3) and e_["var"] == 4 and abs(float(e_["dm"]) - 1.67) < 0.005 and sum(x * x for x in [2, 4, 4, 5, 7, 8]) == 174 and Fr(174, 6) - 25 == 4, "EF03: 2, 4, 4, 5, 7, 8: média 5, mediana 4,5, amplitude 6, desvio médio 5/3 ≈ 1,67, variância 4; quadrados somam 174 e 29 − 25 = 4")
ok(all(sum(x - Fr(sum(v), 4) for x in v) == 0 and est_(list(v))["var"] == Fr(sum(x * x for x in v), 4) - Fr(sum(v), 4) ** 2 for v in prod_(range(7), repeat=4)), "EF03 teoremas 1 e 2: desvios somam zero e variância = média dos quadrados − quadrado da média (as 2401 listas de 4 inteiros de 0 a 6)")
ok(all(est_([x + c for x in v])["var"] == est_(list(v))["var"] and est_([k * x for x in v])["var"] == k * k * est_(list(v))["var"] and est_([x + c for x in v])["m"] == est_(list(v))["m"] + c for v in prod_(range(5), repeat=4) for c in (3, -2) for k in (2, -3, Fr(1, 2))), "EF03 teorema 3: somar c não muda a variância; multiplicar por k multiplica por k²")
ok(est_([5, 7, 7, 8, 10, 11])["m"] == 8 and est_([5, 7, 7, 8, 10, 11])["var"] == 4 and est_([4, 8, 8, 10, 14, 16])["m"] == 10 and est_([4, 8, 8, 10, 14, 16])["var"] == 16 and 36 + 4 + 4 + 0 + 16 + 36 == 96, "EF03 teorema 3, números: somando 3, média 8 e variância 4; dobrando, média 10 e variância 16")
xs_, fs_ = [4, 5, 6, 7, 8, 9], [1, 3, 6, 5, 3, 2]
tab_ = [x for x, f in zip(xs_, fs_) for _ in range(f)]
ok(len(tab_) == 20 and sum(tab_) == 132 and est_(tab_)["m"] == Fr(66, 10) and sum(x * x for x in tab_) == 906 and est_(tab_)["var"] == Fr(174, 100) and Fr(906, 20) == Fr(453, 10) and Fr(66, 10) ** 2 == Fr(4356, 100), "EF03 exemplo 2 (primeiro acesso): 20 alunos, soma 132, média 6,6, soma dos quadrados 906 (média 45,3), variância 45,3 − 43,56 = 1,74")
ok(Fr(20 * 6 + 30 * 7, 50) == Fr(66, 10) and 20 * 6 == 120 and 30 * 7 == 210, "EF03 teorema 4: 20 alunos com 6 e 30 com 7 dão média 6,6")
e1_ = est_([8, 4, 2, 7, 4, 5])
ok(e1_["m"] == 5 and e1_["med"] == Fr(9, 2) and e1_["amp"] == 6 and e1_["dm"] == Fr(5, 3) and e1_["var"] == 4 and Fr(5 * 2 + 6 * 3 + 9 * 5, 10) == Fr(73, 10) and Fr(7 * 10 - 10 - 18, 5) == Fr(42, 5), "EF03 exemplos 1 e 3 (primeiro acesso): 8, 4, 2, 7, 4, 5 tem as mesmas medidas; terceira nota 8,4")
ok(Fr(7 + 3 + 9 + 5 + 6, 5) == 6 and est_([9, 2, 7, 4, 12, 5])["med"] == 6 and Fr(6 * 1 + 8 * 2 + 5 * 3, 6) == Fr(37, 6) and est_([12, 7, 19, 4, 15])["amp"] == 15 and est_([2, 6, 7, 9])["dm"] == 2 and est_([3, 5, 5, 7, 10])["var"] == Fr(28, 5) and est_([2, 4, 4, 4, 5, 5, 7, 9])["var"] == 4, "EF03 exercícios 1 a 8 (primeiro acesso): média 6; mediana 6; ponderada 37/6; amplitude 15; desvio médio 2; variância 5,6; desvio padrão 2")
ok(Fr(0 * 3 + 1 * 8 + 2 * 6 + 3 * 3, 20) == Fr(29, 20) and est_([1, 1, 2, 2, 2, 2, 3, 3])["var"] == Fr(1, 2) and 7 * 4 - 6 * 3 == 10 and 4 * 3 ** 2 == 36 and Fr(4 * 5, 5) == 4 and Fr(10 * 15 - 51 + 15, 10) == Fr(114, 10), "EF03 exercícios 9 a 16 (primeiro acesso): 1,45 irmão; variância 0,5; nota 10; variância 36; variância 4; média corrigida 11,4")
ch_ = [2, 5, 7, 8, 8]
ok(est_(ch_)["m"] == 6 and est_(ch_)["med"] == 7 and est_(ch_)["amp"] == 6 and 150 - 9 * 14 == 24 and Fr(20 * (4 + 36) + 30 * (1 + 49), 50) == 46 and 46 - Fr(66, 10) ** 2 == Fr(244, 100), "EF03 chefão: 2, 5, 7, 8, 8; saiu o 24; variância conjunta 46 − 43,56 = 2,44")
# o item (c) do chefão tem solução única: todas as listas ordenadas de 5 inteiros
sol_ = [v for v in prod_(range(0, 15), repeat=5) if list(v) == sorted(v) and sum(v) == 30 and v[2] == 7 and v[4] - v[0] == 6 and v.count(8) > max([v.count(x) for x in set(v) if x != 8] + [0])]
ok(sol_ == [(2, 5, 7, 8, 8)], "EF03 chefão (c): busca exaustiva (inteiros de 0 a 14) acha uma única lista, 2, 5, 7, 8, 8")
# variância conjunta conferida numa realização concreta das duas turmas
A_ = [4] * 10 + [8] * 10; B_ = [6] * 15 + [8] * 15
ok(est_(A_)["m"] == 6 and est_(A_)["var"] == 4 and est_(B_)["m"] == 7 and est_(B_)["var"] == 1 and est_(A_ + B_)["m"] == Fr(66, 10) and est_(A_ + B_)["var"] == Fr(244, 100), "EF03 chefão (e): turmas concretas (média 6, variância 4; média 7, variância 1) juntas dão 6,6 e 2,44")

# ---------- EF04 ----------
from itertools import product as prd_
from math import isqrt as isq_
ok(Fr(4 + 16, 2) == 10 and isq_(4 * 16) == 8 and Fr(2 * 4 * 16, 20) == Fr(64, 10) and Fr(16 + 256, 2) == 136 and abs(136 ** 0.5 - 11.66) < 0.005 and (4 - 2) ** 2 == 4 and 20 - 16 == 4, "EF04: 4 e 16: aritmética 10, geométrica 8, harmônica 6,4, quadrática √136 ≈ 11,66")
# cadeia com inteiros, sem raiz: MH ≤ MG ⇔ 4a²b² ≤ ab(a+b)²; MG ≤ MA ⇔ 4ab ≤ (a+b)²; MA ≤ MQ ⇔ (a+b)² ≤ 2(a²+b²)
ok(all((4 * a * a * b * b <= a * b * (a + b) ** 2) and (4 * a * b <= (a + b) ** 2) and ((a + b) ** 2 <= 2 * (a * a + b * b)) and ((4 * a * b == (a + b) ** 2) == (a == b)) and (((a + b) ** 2 == 2 * (a * a + b * b)) == (a == b)) and ((4 * a * a * b * b == a * b * (a + b) ** 2) == (a == b)) for a in range(1, 41) for b in range(1, 41)), "EF04 teoremas 1 e 2: harmônica ≤ geométrica ≤ aritmética ≤ quadrática nos 1600 pares de 1 a 40, com igualdade só em a = b")
ok(all(Fr(a + b, 2) ** 2 - Fr(a - b, 2) ** 2 == a * b for a in range(1, 30) for b in range(1, 30)), "EF04 figura: ((a + b)/2)² − ((a − b)/2)² = ab (altura do semicírculo)")
ok([x * (10 - x) for x in range(1, 6)] == [9, 16, 21, 24, 25] and all(x * (S - x) == Fr(S, 2) ** 2 - (x - Fr(S, 2)) ** 2 for S in range(2, 40) for x in range(1, S)) and 9 * 1 == 9 and 7 * 3 == 21, "EF04 teorema 3 e abertura: soma 10 dá produtos 9, 16, 21, 24, 25; x(S − x) = (S/2)² − (x − S/2)²")
ok(all((a + b + c) ** 3 >= 27 * a * b * c and (((a + b + c) ** 3 == 27 * a * b * c) == (a == b == c)) for a, b, c in prd_(range(1, 10), repeat=3)) and all((a + b + c + d) ** 4 >= 256 * a * b * c * d for a, b, c, d in prd_(range(1, 10), repeat=4)), "EF04 teorema 4: aritmética ≥ geométrica para ternas e quádruplas de 1 a 9 (igualdade nas ternas só com os três iguais)")
ok(Fr(15, 4) == Fr(375, 100) and abs(64 ** 0.25 - 2.83) < 0.005 and abs(14 / 3 - 4.67) < 0.005 and round(64 ** (1 / 3), 9) == 4, "EF04 teorema 4, números: 1, 2, 4, 8 → 3,75 e ≈ 2,83; 2, 4, 8 → ≈ 4,67 e 4")
ok(Fr(240, 3 + 2) == 48 and Fr(120, 40) == 3 and Fr(120, 60) == 2 and Fr(2 * 40 * 60, 100) == 48, "EF04 chute: 240 km em 5 h dão 48 km/h, a média harmônica de 40 e 60")
ok(2 * 3 + Fr(18, 3) == 12 and isq_(2 * 18) == 6 and Fr(18, 2) == 9 and Fr(40 * 40, 8) == 200 and 20 + 2 * 10 == 40 and 20 * 10 == 200, "EF04 exemplos 2 e 3 (primeiro acesso): mínimo 12 em x = 3; cercado de 200 m² (20 por 10)")
ok(all(a * (L - 2 * a) <= L * L / 8 + 1e-9 for L in (20, 24, 40, 60, 80, 100) for a in [k / 100 for k in range(1, 50 * L)]), "EF04 exemplo 3: numa grade fina, nenhuma largura dá área acima de L²/8")
ok(Fr(7 + 12, 2) == Fr(19, 2) and isq_(3 * 12) == 6 and Fr(2 * 3 * 6, 9) == 4 and Fr(1 + 49, 2) == 25 and Fr(14, 2) ** 2 == 49 and 2 * 6 == 12 and 2 * 5 == 10 and Fr(36, 4) ** 2 == 81 and 4 * 9 == 36, "EF04 exercícios 1 a 11 (primeiro acesso): 9,5; 6; 4; 5; 49; 12; 10; 81 cm²; 36 m")
ok(2 * 4 * 8 == 4 ** 3 and Fr(24 * 24, 24) == 24 and 2 * 6 == 3 * 4 == 12 and 2 * isq_(3 * 12) == 12 and Fr(12, 3) ** 3 == 64 and Fr(180, 100) * Fr(125, 100) == Fr(225, 100) and Fr(15, 10) ** 2 == Fr(225, 100), "EF04 exercícios 12 a 16 (primeiro acesso): 4; 24 (x = 6, y = 4); 12; 64 dm³; 50% ao ano")
gr_ = [k / 1000 for k in range(1, 20000)]
ok(abs(min(x * x + 16 / x for x in gr_) - 12) < 1e-9 and 2 ** 2 + Fr(16, 2) == 12 and 2 * 2 * Fr(8, 2) * Fr(8, 2) == 64 and abs(max(x * x * (6 - 2 * x) for x in gr_ if x < 3) - 8) < 1e-9 and 2 * 2 * (6 - 4) == 8, "EF04 chefão (c) e (e): numa grade fina, mínimo de x² + 16/x é 12 (em x = 2) e máximo de x²(6 − 2x) é 8 (em x = 2)")
ok(all(Fr(a, b) + Fr(b, a) >= 2 and (a + b) * (Fr(1, a) + Fr(1, b)) >= 4 for a in range(1, 30) for b in range(1, 30)) and all(a * a + b * b + c * c >= a * b + b * c + c * a for a, b, c in prd_(range(1, 12), repeat=3)), "EF04 chefão (a), (b) e (d): conferidos em todos os inteiros pequenos")

print("\n" + ("tudo certo" if not falhas else f"{falhas} FALHA(S)"))
sys.exit(1 if falhas else 0)
