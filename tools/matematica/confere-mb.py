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

print("\ntudo certo" if not falhas else f"\n{falhas} FALHA(S)")
sys.exit(1 if falhas else 0)
