// Lista de buscas realistas do Jarvis, com o resultado esperado de cada uma. Mede quantas acertam no 1º resultado e no top 3.
// Uso: node tests/tbuscalista.js [--json arquivo] [--min1 N] [--min3 N]   (com --min1/--min3, falha se acertar menos que isso)
// "espera" = grupos aceitos (qualquer um serve): "tema:A02", "tema:quimica/D04", "el:11" (elemento na tabela periódica), "mol:h2o" (molécula no visualizador).
const iR = process.argv.indexOf('--raiz'); /* --raiz <pasta>: mede outra cópia do site (para o antes × depois) */
const RAIZ = 'file://' + require('path').resolve(iR > 0 ? process.argv[iR + 1] : require('path').join(__dirname, '..'), 'index.html');
const { chromium } = require('playwright'); const fs = require('fs');
const LISTA = [
  /* sem acento, caixa e espaços */
  ['eletrostatica', ['tema:C01', 'tema:C02', 'tema:C03'], 'sem acento'],
  ['TERMODINAMICA', ['tema:T07', 'tema:T08', 'tema:T06'], 'maiúsculas'],
  ['  Leis   de  newton ', ['tema:A08'], 'espaços sobrando'],
  ['calorimetria', ['tema:T04'], 'título exato'],
  ['Efeito Fotoelétrico', ['tema:C17'], 'com acento'],
  ['binomio de newton', ['tema:matematica/BW01'], 'sem acento'],
  /* erro de digitação */
  ['eletromagnetimso', ['mod:C', 'tema:C15', 'tema:C15d', 'tema:C12'], 'letras trocadas'],
  ['pendlo', ['tema:A20', 'tema:EP01', 'tema:EP02', 'tema:EP03', 'tema:EP09'], 'letra faltando'],
  ['logaritimo', ['tema:matematica/LOG02', 'tema:matematica/LOG03'], 'letra a mais'],
  ['estequiometira', ['mod:QD', 'tema:quimica/D06', 'tema:quimica/D04'], 'letras trocadas'],
  ['cinematca', ['tema:A01', 'tema:A05'], 'letra faltando'],
  ['termodinamcia', ['tema:T07', 'tema:T08', 'tema:T06'], 'letras trocadas'],
  ['derivda', ['tema:matematica/CI03', 'tema:matematica/CI04', 'tema:F04'], 'letra faltando'],
  /* plural e singular */
  ['matriz', ['tema:matematica/MD01'], 'singular de título no plural'],
  ['determinante', ['tema:matematica/MD02'], 'singular'],
  ['lentes', ['tema:O09'], 'plural exato'],
  ['espelho esferico', ['tema:O07'], 'singular de título no plural'],
  ['polinomio', ['tema:matematica/PL01', 'tema:matematica/PL02'], 'singular'],
  ['gas', ['tema:T05', 'tema:quimica/E01'], 'singular irregular (gás → gases)'],
  /* abreviações */
  ['mru', ['tema:A02'], 'abreviação'],
  ['mruv', ['tema:A03'], 'abreviação'],
  ['ddp', ['tema:C04', 'tema:C07', 'tema:C10'], 'abreviação'],
  ['mhs', ['tema:A20'], 'abreviação'],
  ['mcu', ['tema:A07'], 'abreviação'],
  ['pa', ['tema:matematica/SPG01'], 'abreviação curta'],
  ['tfc', ['tema:matematica/CI07'], 'abreviação'],
  /* sinônimos */
  ['lei de ohm', ['tema:C07'], 'título parcial'],
  ['resistencia eletrica', ['tema:C07', 'tema:C08'], 'sinônimo de resistores'],
  ['bhaskara', ['tema:matematica/MB05', 'tema:matematica/FX03'], 'nome popular'],
  ['numeros complexos', ['tema:matematica/NCP02', 'tema:matematica/NCP01'], 'nome do assunto'],
  ['queda livre', ['tema:A03', 'tema:A06'], 'sinônimo'],
  ['regra de tres', ['tema:matematica/MB04'], 'nome popular'],
  ['baskara', ['tema:matematica/MB05', 'tema:matematica/FX03'], 'nome popular com erro'],
  /* pedaço de palavra */
  ['termod', ['tema:T07', 'tema:T08', 'tema:T06'], 'pedaço de palavra'],
  ['eletroq', ['mod:QG', 'tema:quimica/G01', 'tema:quimica/G02', 'tema:quimica/G03'], 'pedaço de palavra (nome de módulo)'],
  ['logar', ['tema:matematica/LOG02', 'tema:matematica/LOG03'], 'pedaço de palavra'],
  /* fórmula química e elemento */
  ['h2o', ['mol:h2o'], 'fórmula química'],
  ['NaCl', ['mol:nacl'], 'fórmula química com maiúsculas'],
  ['sodio', ['el:11'], 'nome de elemento sem acento'],
  ['Oxigênio', ['el:8'], 'nome de elemento'],
];
/* Lista de CONTROLE (--controle): escrita DEPOIS das mudanças da busca e sem ajustar nada por ela. Serve para ver se a melhora vale fora da lista principal. */
const CONTROLE = [
  ['impulso', ['tema:A12'], 'título parcial'], ['fotoeletrico', ['tema:C17'], 'sem acento'], ['entropya', ['tema:T08b', 'tema:quimica/F03'], 'erro de digitação'],
  ['capacitor', ['tema:C11'], 'singular'], ['kirchoff', ['tema:C10b'], 'erro de digitação em nome'], ['refracao da luz', ['tema:O08'], 'frase'],
  ['progresao geometrica', ['tema:matematica/SPG02'], 'erro de digitação'], ['sistema linear', ['tema:matematica/MD03'], 'singular'], ['dopler', ['tema:O04'], 'erro de digitação'],
  ['co2', ['mol:co2'], 'fórmula química'], ['ferro', ['el:26'], 'nome de elemento'], ['titulacao', ['tema:quimica/E07', 'tema:quimica/J03', 'tema:quimica/EQ08'], 'sinônimo de título'],
  ['meia vida', ['tema:quimica/F05', 'tema:quimica/B08', 'tema:quimica/EQ13', 'tema:C19'], 'termo'], ['integral por partes', ['tema:matematica/CII01'], 'frase'],
];
if (process.argv.includes('--controle')) LISTA.splice(0, LISTA.length, ...CONTROLE);
module.exports.LISTA = LISTA;
if (require.main === module) (async () => { const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
  const b = await chromium.launch(), p = await b.newPage(); await require('./adm')(p); await p.goto(RAIZ + '#/home'); await p.waitForTimeout(700);
  const res = await p.evaluate(async (L) => { await JARVIS.carregaIndice(); if (JARVIS.carregaExtras) await JARVIS.carregaExtras(); JARVIS._busca.un = null; return L.map(([q]) => JARVIS.buscar(q, { max: 3 }).livres.map((r) => ({ g: r.u.grupo, n: (r.u.cod ? r.u.cod + ' ' : '') + (r.u.nome || r.u.titulo || '') }))); }, LISTA);
  let a1 = 0, a3 = 0; const linhas = LISTA.map(([q, esp, tipo], i) => { const r = res[i], p1 = r[0] && esp.includes(r[0].g), p3 = r.some((x) => esp.includes(x.g)); if (p1) a1++; if (p3) a3++; return { q: q.trim(), tipo, esperado: esp.join(' | '), primeiro: r[0] ? r[0].n : '(nada)', top1: !!p1, top3: !!p3 }; });
  linhas.forEach((l) => console.log(`${l.top1 ? '1º ' : l.top3 ? 'top3' : 'NÃO '} ${l.q.padEnd(22)} → ${l.primeiro.slice(0, 48).padEnd(48)} (${l.tipo})`));
  console.log(`\n${LISTA.length} buscas: ${a1} no 1º resultado, ${a3} no top 3`);
  if (arg('--json')) fs.writeFileSync(arg('--json'), JSON.stringify({ a1, a3, n: LISTA.length, linhas }, null, 1));
  const m1 = +(arg('--min1') || 0), m3 = +(arg('--min3') || 0), ruim = a1 < m1 || a3 < m3; console.log(ruim ? `FALHA: mínimo pedido ${m1} no 1º e ${m3} no top 3` : 'FALHAS (0):'); await b.close(); process.exit(ruim ? 1 : 0); })();
