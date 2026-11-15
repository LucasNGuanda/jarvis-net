#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gera.py: gera tabela-dados.js (118 elementos) e brancos.md (= brancos_manual.md + relatório automático) a partir dos brutos.

Rodar (o -I isola o Python dos arquivos baixados):
    python3 -I gera.py

Entradas (pasta bruto/, ao lado deste script; são DADOS, nunca código):
    pubchem.json                                         fonte principal (PubChem)
    nist_weights.txt                                     massas NIST (só para comparar)
    wiki_Timeline_of_chemical_element_discoveries.wikitext   ano e descobridor
    wiki_List_of_elements_by_stability_of_isotopes.wikitext  meia-vida (sem isótopo primordial)
    wiki_Isotopes_of_bismuth/thorium/uranium.wikitext        meia-vida de Bi, Th, U
    wiki_List_of_radioactive_nuclides_by_half-life.wikitext  só para comparar Bi, Th, U
    wiki_Mendeleev_predicted_elements.wikitext               só citada no brancos_manual.md
    rsc/<Z>.html                                             páginas da RSC (extrai_usos.py -> usos_rsc_en.txt)
Entrada escrita à mão:
    brancos_manual.md   explicações escritas à mão (por que cada campo ficou null, Mendeleiev)
    usos_pt.json    frases de uso em português, resumidas das páginas da RSC (bruto/rsc/<Z>.html)

Nenhum valor é escrito de memória aqui dentro: tudo sai dos arquivos acima.
As únicas tabelas fixas do script são traduções de palavras (unidades, estado, "and" -> "e").
"""
import json, os, re, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
B = os.path.join(AQUI, 'bruto')
ACESSO = '15/11/2026'


def le(nome):
    with open(os.path.join(B, nome), encoding='utf-8', errors='replace') as f:
        return f.read()


# ---------------------------------------------------------------- PubChem
def pubchem():
    d = json.loads(le('pubchem.json'))
    cols = d['Table']['Columns']['Column']
    return [dict(zip(cols, r['Cell'])) for r in d['Table']['Row']]


def num(s):
    """texto -> número (int se for inteiro), '' -> None"""
    s = s.strip()
    if s == '':
        return None
    x = float(s)
    return int(x) if x == int(x) and '.' not in s else x


def conf(s):
    """'[Ar]4s2 3d10 (predicted)' -> ('[Ar] 4s2 3d10', True)"""
    previsto = '(predicted)' in s
    s = s.replace('(predicted)', '').strip()
    s = re.sub(r'\]\s*', '] ', s)
    return re.sub(r'\s+', ' ', s).strip(), previsto


def ox(s):
    """PubChem mistura '+6, +3' com '7, 5, 3, 1, -1': põe o + que falta nos positivos."""
    if s.strip() == '':
        return None
    out = []
    for p in s.split(','):
        p = p.strip()
        if re.fullmatch(r'\d+', p) and p != '0':
            p = '+' + p
        out.append(p)
    return ', '.join(out)


ESTADO = {'Solid': 'sólido', 'Liquid': 'líquido', 'Gas': 'gás'}   # 'Expected to be ...' -> None

# ---------------------------------------------------------------- NIST
def nist():
    """Z -> texto do 'Standard Atomic Weight' (primeiro isótopo de cada Z)."""
    t = le('nist_weights.txt')
    out = {}
    for m in re.finditer(r'Atomic Number = (\d+)\s.*?Standard Atomic Weight = ([^\n<]*)', t, re.S):
        out.setdefault(int(m.group(1)), m.group(2).strip().replace('&nbsp;', ''))
    return out


def compara_massa(z, s, mp, nt):
    """devolve None se bate (até 0,01 u) ou um texto de divergência"""
    if nt is None or nt == '':
        return f'{s} (Z={z}): o NIST não dá peso atômico padrão; PubChem {mp} (massa de um isótopo)'
    m = re.fullmatch(r'\[([\d.]+),([\d.]+)\]', nt)
    if m:                                     # intervalo
        a, b = float(m.group(1)), float(m.group(2))
        if a - 0.01 <= mp <= b + 0.01:
            return None
        return f'{s} (Z={z}): PubChem {mp} fora do intervalo NIST {nt}'
    m = re.fullmatch(r'\[(\d+)\]', nt)
    if m:                                     # radioativo: NIST dá só o número de massa
        a = int(m.group(1))
        if abs(mp - a) <= 0.5:
            return None
        return f'{s} (Z={z}): PubChem {mp} (massa de um isótopo) × NIST [{a}] (número de massa do isótopo mais estável na lista do NIST): isótopos diferentes'
    m = re.match(r'([\d.]+)', nt)
    if m:
        a = float(m.group(1))
        if abs(mp - a) <= 0.01:
            return None
        return f'{s} (Z={z}): PubChem {mp} × NIST {nt}'
    return f'{s} (Z={z}): NIST ilegível ({nt}); PubChem {mp}'


# ---------------------------------------------------------------- linha do tempo (Wikipedia)
def sem_ref(x):
    x = re.sub(r'<!--.*?-->', '', x, flags=re.S)
    x = re.sub(r'<ref[^>]*?/>', '', x)
    x = re.sub(r'<ref.*?</ref>', '', x, flags=re.S)
    return x.strip()


def chave(nome):
    return re.sub(r'[\s.]', '', nome).lower()


def limpa_alvo(a):
    a = re.sub(r'\s*\([^)]*\)$', '', a)          # "Charles Wood (ironmaster)"
    a = re.sub(r'#.*$', '', a)
    a = re.sub(r'^Sir ', '', a)
    return a.strip()


ABREV = re.compile(r'^[A-ZÀ-Ý]\.')               # começa por inicial: "H. Davy", "J.C.G. de ..."


class Nomes:
    """Expande 'H. Davy' -> 'Humphry Davy' usando só os links da própria tabela."""
    def __init__(self, texto):
        self.por_chave, self.alvos = {}, []
        for m in re.finditer(r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]', texto):
            alvo, mostra = limpa_alvo(m.group(1)), (m.group(2) or m.group(1)).strip()
            self.por_chave.setdefault(chave(mostra), alvo)
            if alvo not in self.alvos:
                self.alvos.append(alvo)
        self.nao_expandidos = set()

    def expande(self, nome):
        nome = nome.strip()
        if not ABREV.match(nome):
            return nome
        k = chave(nome)
        if k in self.por_chave:
            return self.por_chave[k]
        # pelo sobrenome, se for único e as iniciais forem compatíveis
        sobren = nome.split()[-1]
        inic = re.findall(r'([A-ZÀ-Ý])\.', nome)
        cand = []
        for a in self.alvos:
            p = a.replace(',', ' ').split()
            if sobren in p and all(any(q.startswith(i) for q in p) for i in inic):
                cand.append(a)
        if len(set(cand)) == 1:
            return cand[0]
        self.nao_expandidos.add(nome)
        return nome


def autores(cel, nomes):
    """célula 'By' do wikitexto -> texto em português, com nomes expandidos"""
    cel = sem_ref(cel)
    cel = re.sub(r'^(colspan|rowspan)=\d+\|', '', cel).strip()

    def link(m):
        alvo, mostra = limpa_alvo(m.group(1)), (m.group(2) or m.group(1)).strip()
        if ABREV.match(mostra) or len(mostra) <= 5 or ' in ' in mostra:   # "P.", "JINR", "GSI in Darmstadt"
            return alvo.replace(', ', '\u201a ')        # protege a vírgula de "Antoine François, comte de Fourcroy"
        return mostra.replace(', ', '\u201a ')
    cel = re.sub(r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]', link, cel)
    # institutos entre <small>(...)</small>
    insts = []

    def small(m):
        s = m.group(1).strip().strip('()')
        for k, v in (('JINR', 'Joint Institute for Nuclear Research'),
                     ('GSI in Darmstadt', 'GSI Helmholtz Centre for Heavy Ion Research')):
            if k in s and v not in s:
                assert chave(k) in nomes.por_chave, k          # a sigla tem de estar definida na própria página
                s = s.replace(k, nomes.por_chave[chave(k)])
        s = s.replace(' in ', ', ').replace(' and ', ' e ').replace('Japan', 'Japão')
        insts.append(s)
        return ' @%d@' % (len(insts) - 1)
    cel = re.sub(r'<small>(.*?)</small>', small, cel)
    cel = re.sub(r"'''", '', cel)
    cel = re.sub(r',?\s+and,?\s+', ' | ', cel)
    partes = [p.strip() for p in re.split(r'\s*[|,]\s*(?!Jr\.)', cel) if p.strip()]
    out = []
    for p in partes:
        m = re.match(r'^(.*?)(\s+et al\.)?(\s*@(\d+)@)?$', p)
        n = nomes.expande(m.group(1).strip()) if m.group(1).strip() else ''
        if m.group(2):
            n += ' et al.'
        if m.group(4) is not None:
            n += ' (' + insts[int(m.group(4))] + ')'
        out.append(n.strip())
    out = [o.replace('\u201a ', ', ') for o in out]
    if len(out) > 1:
        # "G. Münzenberg, P. Armbruster et al. (GSI)": o "et al." vale para o grupo, não leva "e"
        liga = ', ' if (' et al.' in out[-1] and not any(' et al.' in o for o in out[:-1])) else ' e '
        return ', '.join(out[:-1]) + liga + out[-1]
    return out[0] if out else None


def linha_do_tempo():
    t = le('wiki_Timeline_of_chemical_element_discoveries.wikitext')
    a = t.index('== Pre-modern and early modern discoveries ==')
    b = t.index('==Modern discoveries==')
    c = t.index('==See also==')
    antigos = {}
    for r in re.split(r'\n\|-[^\n]*\n', t[a:b])[1:]:
        cel = [x[1:].strip() for x in r.split('\n') if x.startswith('|') and not x.startswith('|}')]
        if cel and re.fullmatch(r'\d+', cel[0]):
            nota = re.sub(r'\s+', ' ', sem_ref(cel[6]))[:400] if len(cel) > 6 else ''
            uso = re.sub(r'^data-sort-value=[^|]*\|', '', sem_ref(cel[2])).replace('&nbsp;', ' ')
            uso = re.sub(r'\{\{circa\|(\d+)\}\}', r'c. \1', uso, flags=re.I)
            antigos[int(cel[0])] = {'uso': uso, 'nota': nota}
    mod = t[b:c]
    nomes = Nomes(mod)
    modernos = {}
    for r in re.split(r'\n\|-[^\n]*\n', mod)[1:]:
        cel = [x[1:].strip() for x in r.split('\n') if x.startswith('|') and not x.startswith('|}')]
        if len(cel) < 6:
            continue
        z = sem_ref(cel[0])
        if not re.fullmatch(r'\d+', z):
            continue
        anos = lambda s: [int(y) for y in re.findall(r'\b(1[5-9]\d\d|20\d\d)\b', sem_ref(s))]
        modernos[int(z)] = {
            'obs_anos': anos(cel[2]), 'obs_por': autores(cel[3], nomes) if sem_ref(cel[3]) else None,
            'iso_anos': anos(cel[4]), 'iso_por': autores(cel[5], nomes) if sem_ref(cel[5]) else None,
        }
    return antigos, modernos, nomes


# ---------------------------------------------------------------- meias-vidas
SUP = str.maketrans('0123456789-', '⁰¹²³⁴⁵⁶⁷⁸⁹⁻')
UN = {'yr': 'anos', 'y': 'anos', 'd': 'dias', 'h': 'horas', 'min': 'minutos', 's': 'segundos',
      'ms': 'milissegundos', 'μs': 'microssegundos'}


def fmt_meia(simb, A, mant, exp, un):
    v = mant.replace('.', ',')
    if exp:
        v += ' × 10' + str(int(exp)).translate(SUP)
    return f'{str(A).translate(SUP)}{simb}: {v} {UN[un]}'


def meias(simb_de):
    """Z -> string. Só os elementos sem isótopo estável."""
    out = {}
    t = le('wiki_List_of_elements_by_stability_of_isotopes.wikitext')
    sec = t[t.index('==Elements with no primordial isotopes=='):t.index('==See also==')]
    for lin in sec.split('\n'):
        m = re.match(r'\|\s*(\d+)\s*\|\|', lin)
        if not m:
            continue
        z = int(m.group(1))
        A = re.search(r'\{\{SimpleNuclide\|[^|]+\|(\d+)', lin).group(1)
        v = re.search(r'\{\{val\|([\d.]+)(?:\|e=(-?\d+))?\|ul=([^}|]+)\}\}', lin)
        if v:
            mant, exp, un = v.group(1), v.group(2), v.group(3)
        else:                                   # nobélio: "58 [[minute|min]]"
            v = re.search(r'\|\|\s*([\d.]+) \[\[[^|\]]+\|(\w+)\]\]', lin)
            mant, exp, un = v.group(1), None, v.group(2)
        out[z] = fmt_meia(simb_de[z], A, mant, exp, un)
    # Bi, Th, U: têm isótopo primordial, mas nenhum estável -> páginas "Isotopes of ..."
    for z, arq, nome, A in ((83, 'bismuth', 'Bismuth', 209), (90, 'thorium', 'Thorium', 232), (92, 'uranium', 'Uranium', 238)):
        t = le(f'wiki_Isotopes_of_{arq}.wikitext')
        i = t.index(f'|-id={nome}-{A}')
        v = (re.search(r'\{\{val\|([\d.]+)\|\(\d+\)\|\|e=(\d+)\|ul=y\}\}', t[i:i + 3000])
             or re.search(r"([\d.]+)\(\d+\)×10<sup>(\d+)</sup>&nbsp;y", t[i:i + 3000]))
        out[z] = fmt_meia(simb_de[z], A, v.group(1), v.group(2), 'y')
    return out


def meias_lista2():
    """Bi, Th, U na outra lista (só para a seção de divergências)."""
    t = le('wiki_List_of_radioactive_nuclides_by_half-life.wikitext')
    out = {}
    for nome in ('uranium-238', 'thorium-232', 'bismuth-209'):
        i = t.index(f'|[[{nome}]]||')
        cab = t.rfind('!class=unsortable|10<sup>', 0, i)
        cab = t.rfind('!class=unsortable|10<sup>', 0, cab)          # 1ª coluna = anos
        e = re.match(r'!class=unsortable\|10<sup>(\d+)</sup> years', t[cab:]).group(1)
        v = re.search(r'\{\{convert\|([\d.]+)\|yr', t[i:]).group(1)
        out[nome] = f'{v.replace(".", ",")} × 10{e.translate(SUP)} anos'
    return out


# ---------------------------------------------------------------- montagem
def js(v):
    if v is None:
        return 'null'
    if isinstance(v, str):
        return json.dumps(v, ensure_ascii=False)
    r = repr(v)
    if 'e' in r:                                  # 8.988e-05 -> 0.00008988 (mais fácil de editar à mão)
        from decimal import Decimal
        r = format(Decimal(r), 'f')
    return r


def main():
    pc = pubchem()
    assert len(pc) == 118 and [int(r['AtomicNumber']) for r in pc] == list(range(1, 119))
    simb = {int(r['AtomicNumber']): r['Symbol'] for r in pc}
    nw = nist()
    antigos, modernos, nomes = linha_do_tempo()
    assert len(antigos) + len(modernos) == 118 and not (set(antigos) & set(modernos)), (len(antigos), len(modernos))
    mv = meias(simb)
    sem_estavel = [43, 61, 83] + list(range(84, 119))
    assert sorted(mv) == sorted(sem_estavel), sorted(set(sem_estavel) ^ set(mv))
    usos = json.load(open(os.path.join(AQUI, 'usos_pt.json'), encoding='utf-8'))

    elementos, div_massa, div_ano, tab_ano, conf_prev, estado_esp, pf_pe = [], [], [], [], [], [], []
    for r in pc:
        z, s = int(r['AtomicNumber']), r['Symbol']
        massa = float(r['AtomicWeight'])
        d = compara_massa(z, s, massa, nw.get(z))
        if d:
            div_massa.append(d)
        cf, prev = conf(r['ElectronConfiguration'])
        if prev:
            conf_prev.append(s)
        est = ESTADO.get(r['StandardState'])
        if est is None:
            estado_esp.append(f'{s} ("{r["StandardState"]}")')
        # --- ano e autor
        yp = r['YearDiscovered']                                 # 'Ancient' ou ano
        if z in antigos:
            ano, autor, regra = None, 'conhecido desde a Antiguidade', 'antigo'
            if yp != 'Ancient':
                div_ano.append(f'{s} (Z={z}): PubChem dá {yp}; a Wikipedia põe na tabela dos pré-modernos (uso mais antigo: {antigos[z]["uso"]}). Ficou null / "conhecido desde a Antiguidade".')
        else:
            m = modernos[z]
            ypn = int(yp) if yp.isdigit() else None
            if ypn in m['obs_anos']:
                ano, autor, regra = ypn, m['obs_por'], 'observado = PubChem'
            elif ypn in m['iso_anos'] and m['iso_por']:
                ano, autor, regra = ypn, m['iso_por'], 'isolado = PubChem'
            else:
                ano, autor, regra = m['obs_anos'][0], m['obs_por'], 'observado (PubChem diverge)'
                div_ano.append(f'{s} (Z={z}): PubChem {yp} × Wikipedia observado {"–".join(map(str, m["obs_anos"]))} ({m["obs_por"]})'
                               + (f', isolado {"–".join(map(str, m["iso_anos"]))} ({m["iso_por"]})' if m['iso_anos'] else '')
                               + f'. Ficou {ano}, {autor}.')
            tab_ano.append((z, s, yp, m, ano, regra))
        pf, pe = num(r['MeltingPoint']), num(r['BoilingPoint'])
        if pf is not None and pe is not None and not pf < pe:
            pf_pe.append(f'{s}: pf {pf} K ≥ pe {pe} K')
        elementos.append({
            'z': z, 's': s, 'massa': massa, 'conf': cf,
            'en': num(r['Electronegativity']), 'raio': num(r['AtomicRadius']),
            'ei': num(r['IonizationEnergy']), 'ae': num(r['ElectronAffinity']),
            'ox': ox(r['OxidationStates']), 'estado': est,
            'pf': pf, 'pe': pe, 'dens': num(r['Density']),
            'ano': ano, 'autor': autor, 'meia': mv.get(z), 'usos': usos.get(str(z)),
        })

    fontes = [
        f'PubChem Periodic Table (NIH/NLM), https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON, acesso em {ACESSO}: massa, conf, en (Pauling), raio (raio de van der Waals, em pm), ei e ae (eV), ox, estado (a 25 °C), pf e pe (K), dens (g/cm³).',
        f'NIST, Atomic Weights and Isotopic Compositions, https://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl?ele=&all=all&ascii=ascii2, acesso em {ACESSO}: só para conferir as massas (divergências em brancos.md).',
        f'Wikipedia (inglês), Timeline of chemical element discoveries, https://en.wikipedia.org/wiki/Timeline_of_chemical_element_discoveries, acesso em {ACESSO}: ano e autor. Quando o ano do PubChem coincide com a coluna "isolado", ficou o ano e o autor do isolamento; nos outros casos, os da coluna "observado" (primeiro relato).',
        f'Wikipedia (inglês), List of elements by stability of isotopes, https://en.wikipedia.org/wiki/List_of_elements_by_stability_of_isotopes, e Isotopes of bismuth / thorium / uranium, acesso em {ACESSO}: meia (isótopo mais estável dos elementos sem isótopo estável).',
        f'Royal Society of Chemistry, Periodic Table, https://periodic-table.rsc.org/element/<Z> (seção "Uses"), acesso em {ACESSO}: usos (frases resumidas em português).',
        'Para Z > 98 podem existir isótopos ainda não descobertos mais estáveis que os conhecidos (nota da própria lista da Wikipedia). Configurações de Z ≥ 104 são previstas, não medidas (PubChem marca "predicted").',
    ]
    campos = ['z', 's', 'massa', 'conf', 'en', 'raio', 'ei', 'ae', 'ox', 'estado', 'pf', 'pe', 'dens', 'ano', 'autor', 'meia', 'usos']
    L = ['// tabela-dados.js: dados dos 118 elementos para a tabela periódica.',
         '// GERADO por gera.py a partir de arquivos-fonte baixados (nada de memória). Pode ser editado à mão;',
         '// se rodar o gera.py de novo, as edições manuais se perdem. null = sem valor na fonte (ver brancos.md).',
         '// Unidades: massa u; en Pauling; raio pm (van der Waals); ei, ae eV; pf, pe K; dens g/cm³; estado a 25 °C.',
         'window.TABELA_DADOS = {', '  fontes: [']
    L += ['    ' + js(f) + ',' for f in fontes]
    L += ['  ],', '  elementos: [']
    for e in elementos:
        L.append('    { ' + ', '.join(f'{c}:{js(e[c])}' for c in campos) + ' },')
    L += ['  ]', '};', '']
    with open(os.path.join(AQUI, 'tabela-dados.js'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(L))

    # ---------------- relatório automático (entra no brancos.md)
    R = ['<!-- GERADO por gera.py -->', '', '## Brancos (null) por campo', '']
    for c in campos:
        nul = [e['s'] for e in elementos if e[c] is None]
        R.append(f'- **{c}**: {len(nul)}' + (' — ' + ', '.join(nul) if nul else ''))
    R += ['', '## Configurações previstas (PubChem marca "(predicted)"; o valor foi mantido, sem a marca)', '', ', '.join(conf_prev), '',
          '## Estado "esperado" no PubChem (ficou null)', '', ', '.join(estado_esp), '',
          '## pf ≥ pe (exceções reais na fonte)', '', *(['- ' + x for x in pf_pe] or ['nenhuma']), '',
          '## Divergências de massa PubChem × NIST (> 0,01 u). Ficou sempre o PubChem.', '', *['- ' + x for x in div_massa], '',
          '## Massas que o PubChem dá com no máximo uma casa decimal (valor abreviado da IUPAC; mantido como está)', '',
          ', '.join(f'{r["Symbol"]} {r["AtomicWeight"]}' for r in pc if re.fullmatch(r'\d+(\.\d)?', r['AtomicWeight'])), '',
          '## Divergências de ano PubChem × Wikipedia', '', *['- ' + x for x in div_ano], '',
          '## Meia-vida de Bi, Th e U: duas páginas baixadas', '']
    l2 = meias_lista2()
    for z, k in ((83, 'bismuth-209'), (90, 'thorium-232'), (92, 'uranium-238')):
        R.append(f'- {simb[z]}: ficou "{mv[z]}" (página Isotopes of …); a lista "radioactive nuclides by half-life" dá {l2[k]}.')
    R += ['', '## Autores que ficaram com o nome abreviado (a tabela da Wikipedia não traz o nome completo)', '',
          ', '.join(sorted(n for n in nomes.nao_expandidos if any(n in (e['autor'] or '') for e in elementos))) or 'nenhum', '',
          '## Tabela completa de ano e autor (para decidir à mão)', '',
          '| Z | s | PubChem | Wikipedia observado | por | Wikipedia isolado | por | ficou | regra |', '|---|---|---|---|---|---|---|---|---|']
    for z, s, yp, m, ano, regra in sorted(tab_ano):
        R.append(f'| {z} | {s} | {yp} | {"–".join(map(str, m["obs_anos"]))} | {m["obs_por"]} | {"–".join(map(str, m["iso_anos"])) or "—"} | {m["iso_por"] or "—"} | {ano} | {regra} |')
    R += ['', '| Z | s | PubChem | Wikipedia: uso mais antigo | nota da Wikipedia (início) |', '|---|---|---|---|---|']
    for z in sorted(antigos):
        R.append(f'| {z} | {simb[z]} | {pc[z - 1]["YearDiscovered"]} | {antigos[z]["uso"]} | {antigos[z]["nota"][:160]}… |')
    manual = open(os.path.join(AQUI, 'brancos_manual.md'), encoding='utf-8').read()     # parte escrita à mão
    with open(os.path.join(AQUI, 'brancos.md'), 'w', encoding='utf-8') as f:
        f.write(manual.rstrip('\n') + '\n\n' + '\n'.join(R) + '\n')
    print('ok: 118 elementos; divergências de massa', len(div_massa), '; de ano', len(div_ano))


if __name__ == '__main__':
    main()
