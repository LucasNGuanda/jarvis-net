"""Escolhe cores novas para matéria/módulo, longe de TODAS as cores da paleta do site (método usado no russo, alemão e sânscrito).
   Lê --m*, --ok, --warn, --bad, --acc do :root (tema escuro) e do :root[data-tema="claro"] em assets/estilo.css, procura em HSL só
   dentro da faixa de claridade e saturação (Lab) que a paleta já usa (para não sair berrante) e maximiza a menor distância em Lab
   até a paleta e entre as escolhidas. Uso: python3 tools/escolhe-cor.py [quantas, padrão 1]   → imprime a cor do tema escuro e a do claro."""
import re, colorsys, itertools, os, sys
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = open(os.path.join(RAIZ, 'assets', 'estilo.css')).read()
def bloco(ini):
    i = s.index(ini); j = s.index('}', i); return dict(re.findall(r'--(m[A-Za-z0-9]+|ok|warn|bad|acc):(#[0-9a-fA-F]{6})', s[i:j]))
def lab(h):
    r, g, b = [int(h[i:i+2], 16) / 255 for i in (1, 3, 5)]
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = f(r), f(g), f(b)
    X = (0.4124*r + 0.3576*g + 0.1805*b) / 0.95047; Y = 0.2126*r + 0.7152*g + 0.0722*b; Z = (0.0193*r + 0.1192*g + 0.9505*b) / 1.08883
    t = lambda u: u ** (1/3) if u > 0.008856 else 7.787*u + 16/116
    return (116*t(Y) - 16, 500*(t(X) - t(Y)), 200*(t(Y) - t(Z)))
d = lambda a, b: sum((x - y) ** 2 for x, y in zip(lab(a), lab(b))) ** .5
hsl = lambda h, sa, l: '#%02x%02x%02x' % tuple(round(c * 255) for c in colorsys.hls_to_rgb(h / 360, l, sa))
def escolhe(pal, n, lums, sats):
    cor = [k for k in pal if k.startswith('m') and k != 'mF']
    Ls = [lab(pal[k])[0] for k in cor]; Cs = [(lab(pal[k])[1] ** 2 + lab(pal[k])[2] ** 2) ** .5 for k in cor]
    ok = lambda h: min(Ls) <= lab(h)[0] <= max(Ls) and min(Cs) <= (lab(h)[1] ** 2 + lab(h)[2] ** 2) ** .5 <= max(Cs)
    cands = [h for h in (hsl(hh, sa, l) for hh in range(0, 360, 4) for sa in sats for l in lums) if ok(h)]
    top = sorted(cands, key=lambda h: -min(d(h, v) for v in pal.values()))[:60]
    melhor = max(itertools.combinations(top, n), key=lambda c: min([d(h, v) for h in c for v in pal.values()] + [d(a, b) for a, b in itertools.combinations(c, 2)] or [0]))
    return melhor
n = int(sys.argv[1]) if len(sys.argv) > 1 else 1
esc = bloco(':root{'); cla = bloco(':root[data-tema="claro"]{')
for h in escolhe(esc, n, (0.55, 0.6, 0.65, 0.7), (0.55, 0.65, 0.75, 0.85)):
    hue = colorsys.rgb_to_hls(*[int(h[i:i+2], 16) / 255 for i in (1, 3, 5)])[0] * 360
    cc = [hsl(x, sa, l) for x in range(int(hue) - 14, int(hue) + 15, 2) for sa in (0.6, 0.7, 0.8, 0.9, 1.0) for l in (0.28, 0.32, 0.36, 0.4, 0.44)]
    Lc = [lab(cla[k])[0] for k in cla if k.startswith('m') and k != 'mF']; cc = [c for c in cc if min(Lc) <= lab(c)[0] <= max(Lc)] or cc
    hc = max(cc, key=lambda c: min(d(c, v) for v in cla.values()))
    print(f'escuro {h} (menor distância à paleta {min(d(h, v) for v in esc.values()):.1f}) · claro {hc} ({min(d(hc, v) for v in cla.values()):.1f})')
