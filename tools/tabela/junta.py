# Passo final dos dados da tabela periódica: parte do tabela-dados.js gerado pelo gera.py (fontes baixadas) e aplica as decisões de revisão.
# Uso: python3 -I junta.py <saída.js>
# Decisões (todas listadas no cabeçalho do arquivo gerado):
#  1. tipo (metal, ametal, semimetal): da coluna GroupBlock do PubChem.
#  2. ano e autor: quando PubChem e Wikipedia discordam do ano, fica o ano do PubChem e o autor fica null (em branco), em vez de escolher um lado.
#     Quando o PubChem diz "Ancient" e a Wikipedia traz data moderna (Al, Ca), ano e autor ficam null.
#  3. massa: nas seis em que o PubChem abrevia (Ar, Zn, Ru, Sm, Os, Pb), fica o valor do NIST.
#  4. meia-vida do U-238: 4,468 × 10⁹ anos (lista de nuclídeos por meia-vida), em vez de 4,463 (outra página baixada).
#  5. estrelas (★) e lacunas de Mendeleiev: listas à parte, no fim do arquivo.
import json, re, sys
B = '/tmp/claude-0/-home-user/9131d9ca-1f25-5c09-b019-7a0262a7b166/scratchpad/elementos/'
src = open(B + 'tabela-dados.js', encoding='utf8').read()
pc = json.load(open(B + 'bruto/pubchem.json'))['Table']
cols = pc['Columns']['Column']; rows = [dict(zip(cols, r['Cell'])) for r in pc['Row']]
TIPO = {'Nonmetal': 'ametal', 'Halogen': 'ametal', 'Noble gas': 'ametal', 'Metalloid': 'semimetal'}
NIST = {'Ar': 39.948, 'Zn': 65.38, 'Ru': 101.07, 'Sm': 150.36, 'Os': 190.23, 'Pb': 207.2}
linhas = src.split('\n'); saida = []; rel = {'ano_pubchem_autor_branco': [], 'ano_autor_branco': [], 'massa_nist': [], 'tipo': {}}
for ln in linhas:
    m = re.match(r'^(\s*)\{ z:(\d+), (.*)\},?\s*$', ln)
    if not m:
        saida.append(ln); continue
    z = int(m.group(2)); r = rows[z - 1]; s = r['Symbol']; corpo = m.group(3).rstrip()
    assert ('s:"%s"' % s) in corpo, (z, s)
    am = re.search(r'ano:(null|\d+), autor:("(?:[^"\\]|\\.)*"|null)', corpo); assert am, corpo
    ano = None if am.group(1) == 'null' else int(am.group(1)); autor = am.group(2)
    yp = r['YearDiscovered']
    if yp == 'Ancient':
        if ano is not None:  # Wikipedia dá data moderna: fontes discordam
            ano, autor = None, 'null'; rel['ano_autor_branco'].append(s)
    else:
        yp = int(yp)
        if ano != yp:
            ano, autor = yp, 'null'; rel['ano_pubchem_autor_branco'].append(s)
    corpo = corpo.replace(am.group(0), 'ano:%s, autor:%s' % ('null' if ano is None else ano, autor))
    if s in NIST:
        corpo, n = re.subn(r'massa:[\d.]+', 'massa:%s' % NIST[s], corpo); assert n == 1; rel['massa_nist'].append(s)
    if s == 'U':
        assert '4,463' in corpo; corpo = corpo.replace('4,463', '4,468')
    tipo = TIPO.get(r['GroupBlock'], 'metal'); rel['tipo'][tipo] = rel['tipo'].get(tipo, 0) + 1
    saida.append('%s{ z:%d, %s, tipo:"%s" },' % (m.group(1), z, corpo.rstrip(', '), tipo))
txt = '\n'.join(saida)
txt = txt.replace('// Unidades:', '''// Revisão (junta.py), depois do gera.py:
//  - tipo: "metal", "ametal" ou "semimetal", da coluna GroupBlock do PubChem (Nonmetal, Halogen e Noble gas = ametal; Metalloid = semimetal; o resto = metal).
//  - ano e autor: onde PubChem e Wikipedia discordam do ano, ficou o ano do PubChem e autor: null (EM BRANCO, para o Lucas decidir).
//    Al e Ca: o PubChem diz "Ancient" e a Wikipedia traz data moderna: ano e autor null.
//  - massa de Ar, Zn, Ru, Sm, Os e Pb: valor do NIST (o PubChem abrevia para uma casa).
//  - U-238: 4,468 × 10⁹ anos (duas páginas baixadas discordam: 4,463 e 4,468).
//  - estrelas: lista de números atômicos com ★. É um CRITÉRIO DO JARVIS (elementos que mais aparecem em questões de química geral de OBQ e ITA), NÃO é estatística de provas. Edite à vontade.
//  - mendeleiev: lacunas previstas no artigo de 1871 (fonte: https://en.wikipedia.org/wiki/Mendeleev%27s_predicted_elements).
// Unidades:''', 1)
fim = txt.rstrip().rstrip(';').rstrip()
assert fim.endswith('}'), fim[-40:]
fim = fim[:-1].rstrip()
if not fim.endswith(','): fim += ','
fim += '''
  estrelas: [1, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 24, 25, 26, 29, 30, 35, 47, 53, 56, 79, 80, 82, 92],
  anoMendeleiev: 1871,
  mendeleiev: [ { z:21, eka:"eka-boro" }, { z:31, eka:"eka-alumínio" }, { z:32, eka:"eka-silício" }, { z:43, eka:"eka-manganês" } ],
};
'''
open(sys.argv[1], 'w', encoding='utf8').write(fim)
print(json.dumps(rel, ensure_ascii=False))
