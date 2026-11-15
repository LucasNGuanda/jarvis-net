#!/usr/bin/env python3
"""Refaz em Python as contas dos exercícios sorteados.
Uso: node tests/tvaria.js quimica/D04 --n 12 --saida /tmp/v.json && python3 tools/confere-py.py /tmp/v.json
Cada versão sorteada de um exercício numérico traz `py`: a mesma conta, escrita à parte como expressão Python com os números já postos.
Aqui a expressão é avaliada e comparada com o gabarito (`v`). Diferença relativa acima de 1e-6 é FALHA."""
import json, math, sys
from fractions import Fraction
from math import gcd
dados = json.load(open(sys.argv[1], encoding='utf8'))
amb = {'__builtins__': {}, 'math': math, 'sqrt': math.sqrt, 'log10': math.log10, 'log': math.log, 'exp': math.exp, 'pi': math.pi, 'abs': abs, 'min': min, 'max': max, 'round': round, 'gcd': gcd, 'Fraction': Fraction, 'float': float, 'int': int, 'sum': sum}
ok = falha = sem = 0; vistos = {}
for d in dados:
    if d['v'] is None: continue
    if not d['py']: sem += 1; continue
    try: r = float(eval(d['py'], amb))
    except Exception as e:
        print('FALHA', d['cod'], d['n'], 'versão', d['k'], 'erro ao avaliar', d['py'], e); falha += 1; continue
    v = float(d['v']); dif = abs(r - v) / max(abs(v), 1e-12)
    if dif > 1e-6: print('FALHA', d['cod'], d['n'], 'versão', d['k'], ':', d['py'], '=', r, 'mas o gabarito é', v); falha += 1
    else: ok += 1; vistos.setdefault((d['cod'], d['n']), set()).add(round(v, 9))
fixos = sorted(n for (c, n), s in vistos.items() if len(s) == 1)
print('contas refeitas em Python: %d ok, %d com diferença, %d sem expressão py' % (ok, falha, sem))
if fixos: print('aviso: sempre o mesmo valor nas versões sorteadas (pouco sorteio?):', ' '.join(fixos))
print('FALHAS (%d)%s' % (falha, '' if falha else ':'))
sys.exit(1 if falha else 0)
