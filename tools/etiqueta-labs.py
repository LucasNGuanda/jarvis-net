#!/usr/bin/env python3
"""Etiqueta cada laboratório (simulação) com o nome por extenso, a matéria e o tema que o usa.
Ideia do Lucas (15/11/2026), depois do bug em que laboratórios da Química apagaram os de mesmo nome da Física.

Em cima de cada definição `SIM.nome = (el, …) => …` fica UMA linha de comentário:
    /* nome: "Dipolo girando num campo uniforme" · matéria: Física · tema: C03 */
É só comentário: não muda nome nem comportamento. O nome por extenso é o título que o tema passa ao F.lab("título", "id").
A matéria vem da pasta do arquivo (assets/sims/ = Física; assets/sims/matematica/ = Matemática; assets/sims/quimica/ = Química).
Pode rodar de novo à vontade: a linha antiga é trocada pela nova. O teste tests/tsim.js exige a etiqueta em todo laboratório.

Uso: python3 tools/etiqueta-labs.py            (mostra o que faria)
     python3 tools/etiqueta-labs.py --aplica   (grava)"""
import glob, os, re, sys
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
aplica = '--aplica' in sys.argv
MAT = lambda rel: 'Química' if '/quimica/' in rel else 'Matemática' if '/matematica/' in rel else 'Física'
temas = {}
for f in glob.glob(RAIZ + '/temas/**/*.js', recursive=True):
    rel = os.path.relpath(f, RAIZ + '/temas')[:-3]
    temas[rel] = open(f, encoding='utf8').read()
def usos(nome):
    achados = []
    for cod, s in temas.items():
        for m in re.finditer(r'SIM\.' + re.escape(nome) + r'\(document\.getElementById\("([^"]+)"\)', s):
            t = re.search(r'F\.lab\("((?:[^"\\]|\\.)*)",\s*"' + re.escape(m.group(1)) + r'"\)', s)
            achados.append((cod, t.group(1) if t else None))
    return achados
DEF = re.compile(r'^(\s*)SIM\.([A-Za-z_]\w*) = \(el\b')
total = sem = mudou = 0; orfaos = []
for f in sorted(glob.glob(RAIZ + '/assets/sims/**/*.js', recursive=True)):
    rel = os.path.relpath(f, RAIZ); linhas = open(f, encoding='utf8').read().split('\n'); novo = []
    for ln in linhas:
        m = DEF.match(ln)
        if m:
            total += 1; u = usos(m.group(2)); titulos = [t for _, t in u if t]
            nome = titulos[0] if titulos else '(nenhum tema usa este laboratório)'
            cods = ', '.join(sorted(set(c.split('/')[-1] for c, _ in u))) or '—'
            if not titulos: sem += 1; orfaos.append(rel + ': SIM.' + m.group(2))
            tag = '%s/* nome: "%s" · matéria: %s · tema: %s */' % (m.group(1), nome.replace('"', "'"), MAT('/' + rel), cods)
            if novo and re.match(r'^\s*/\* nome: "', novo[-1]):
                if novo[-1] != tag: mudou += 1
                novo[-1] = tag
            else:
                novo.append(tag); mudou += 1
        novo.append(ln)
    if aplica and novo != linhas: open(f, 'w', encoding='utf8').write('\n'.join(novo))
print('laboratórios: %d · etiquetas novas ou alteradas: %d · sem tema que use: %d%s' % (total, mudou, sem, '' if aplica else ' · (nada gravado: use --aplica)'))
for o in orfaos: print('  sem tema:', o)
