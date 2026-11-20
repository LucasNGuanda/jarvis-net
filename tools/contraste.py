#!/usr/bin/env python3
"""Revisão básica de contraste (WCAG 2) das cores do tema, lidas de assets/estilo.css.
Uso: python3 tools/contraste.py
Texto normal pede 4,5:1 (AA); texto grande (a partir de 24 px, ou 18,66 px em negrito) e elementos gráficos pedem 3:1."""
import re, os
css = open(os.path.join(os.path.dirname(__file__), '..', 'assets', 'estilo.css'), encoding='utf-8').read()
def bloco(ini):
    i = css.index(ini); return css[i:css.index('}', i)]
def cores(b):
    return {k: v for k, v in re.findall(r'(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\b', b)}
def lum(h):
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
def razao(a, b):
    x, y = sorted((lum(a), lum(b)), reverse=True); return (x + 0.05) / (y + 0.05)
temas = {'escuro': cores(bloco(':root{')), 'claro': {}}
m = re.search(r'\[data-tema="?claro"?\]\s*\{', css) or re.search(r'\.claro\s*\{', css)
if m: temas['claro'] = cores(css[m.start():css.index('}', m.start())])
ruins = 0
for nome, c in temas.items():
    if not c: continue
    c = {**temas['escuro'], **c} if nome == 'claro' else c
    print(f'\nTema {nome}: fundo {c["--bg"]}, cartão {c["--card"]}')
    for k in sorted(c):
        if k in ('--bg', '--bg2', '--card', '--card2', '--line', '--line2'): continue
        rb, rc = razao(c[k], c['--bg']), razao(c[k], c['--card2'] if '--card2' in c else c['--card'])
        pior = min(rb, rc); nota = 'ok (AA)' if pior >= 4.5 else 'só texto grande ou gráfico' if pior >= 3 else 'BAIXO'
        if pior < 4.5: ruins += 1
        print(f'  {k:10s} {c[k]}  no fundo {rb:5.2f}:1 · no cartão {rc:5.2f}:1  {nota}')
    for k in ('--line', '--line2'):
        if k in c: print(f'  {k:10s} {c[k]}  (borda) no fundo {razao(c[k], c["--bg"]):5.2f}:1')
print(f'\ncores abaixo de 4,5:1 em algum fundo: {ruins}')
