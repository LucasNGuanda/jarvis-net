#!/usr/bin/env python3
"""Gráficos de funções: confere os valores calculados pelo leitor de expressões do site contra a MESMA conta escrita à parte em Python.

Uso:  node tests/tgraf.js --saida v.json  &&  python3 tools/matematica/confere-graficos.py v.json
Cada item de tests/graficos-lista.json traz a expressão como se digita no site ("e") e, escrita à mão, a conta em Python ("py").
Aqui só o Python faz conta: o que o site calculou (vs) é comparado ponto a ponto. Fora do domínio, o Python dá erro e o site tem de ter dado "sem valor".
"""
import json, math, sys

LETRAS = {"Ж": "Zh", "Ф": "F", "Я": "Ya", "Ш": "Sh"}  # nomes dos parâmetros russos nas contas em Python
BASE = {k: getattr(math, k) for k in ("sin", "cos", "tan", "asin", "acos", "atan", "log", "log10", "sqrt", "exp", "pi", "e", "copysign", "nan")}
BASE["abs"] = abs


def conta(py, x, P):
    amb = dict(BASE)
    amb["x"] = x
    for k, v in P.items():
        amb[LETRAS.get(k, k)] = v
    try:
        v = eval(py, {"__builtins__": {}}, amb)  # ferramenta de teste: as expressões vêm do nosso arquivo, não de quem usa o site
    except (ValueError, ZeroDivisionError, OverflowError):
        return None
    if isinstance(v, complex) or v != v or abs(v) == float("inf"):
        return None
    return float(v)


def confere(itens, quieto=False):
    erros, pontos = [], 0
    for it in itens:
        for x, vs in zip(it["xs"], it["vs"]):
            pontos += 1
            ref = conta(it["py"], x, it["P"])
            if ref is None or vs is None:
                bate = ref is None and vs is None
            else:
                bate = abs(ref - vs) <= 1e-9 * (1 + abs(ref))
            if not bate:
                erros.append(f'{it["e"]!r} em x = {x}: site {vs} × Python {ref}')
    if not quieto:
        for e in erros:
            print("FALHA  " + e)
    return erros, pontos


def main():
    itens = json.load(open(sys.argv[1], encoding="utf-8"))
    erros, pontos = confere(itens)
    fora = sum(1 for it in itens for v in it["vs"] if v is None)
    print(f"{len(itens)} expressões, {pontos} pontos conferidos ({fora} fora do domínio, nos dois lados)")
    # contraprova: estraga um valor de propósito e exige que a conferência acuse
    import copy
    ruim = copy.deepcopy(itens)
    alvo = next(it for it in ruim if it["vs"][0] is not None)
    alvo["vs"][0] += 1e-6 * (1 + abs(alvo["vs"][0]))
    e2, _ = confere(ruim, quieto=True)
    ruim2 = copy.deepcopy(itens)
    alvo2 = next(it for it in ruim2 if None in it["vs"])
    alvo2["vs"][alvo2["vs"].index(None)] = 0.0
    e3, _ = confere(ruim2, quieto=True)
    prova = len(e2) == len(erros) + 1 and len(e3) == len(erros) + 1
    print("ok     contraprova: um valor trocado em 1e-6 e um 'sem valor' trocado por 0 são acusados" if prova else "FALHA  contraprova: a conferência não acusou um valor errado")
    ruins = len(erros) + (0 if prova else 1)
    print(f"FALHAS ({ruins})" + ("" if ruins else ": tudo certo"))
    sys.exit(1 if ruins else 0)


if __name__ == "__main__":
    main()
