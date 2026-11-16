/* Base comum das matérias (β 3.7). Uso: node tests/tmaterias.js
   Confere: as 9 páginas iniciais (Física 4, Matemática 3, Química 2) com o mesmo esqueleto e os mesmos estilos (tirando a cor),
   abas do topo só da matéria atual, módulos do catálogo, animação, "Continuar de onde parei", componentes num tema de teste
   dentro da Química, mhchem (\ce{}), links da tela inicial e o link antigo #/quimica/inicio. */
const { chromium } = require('playwright');
const BASE = 'file:///home/user/site-fisica/index.html#/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 860 } }); await require('./adm')(p);
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  const falhas = []; const ok = (c, msg) => { if (!c) falhas.push(msg); console.log((c ? 'ok   ' : 'FALHA ') + msg); };
  const PAGS = { fisica: ['inicio', 'experimentos', 'experimental'], matematica: ['matematica', 'matematica-calculo', 'olimpiada'], quimica: ['quimica', 'quimica-experimentos'], russo: ['russo', 'russo-leitura'] };
  /* estilos que não podem mudar de uma matéria para outra (cores ficam de fora de propósito) */
  const ESTILO = () => { const g = (sel, props) => { const e = document.querySelector(sel); if (!e) return null; const cs = getComputedStyle(e); return props.map((k) => cs[k]).join(' '); };
    const T = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight'], B = ['paddingTop', 'paddingLeft', 'borderTopLeftRadius', 'borderTopWidth', 'borderTopStyle'];
    return { topo: g('.topo', ['height', 'position', 'backgroundColor', 'borderBottomWidth']), aba: g('.topo .aba', [...T, ...B]), abaAtual: g('.topo .aba.atual', ['backgroundColor']), links: g('.topo nav.links', T), legenda: g('#detalhes > button', [...T, ...B, 'backgroundColor']),
      menu: g('#menu', ['width', 'backgroundColor', 'paddingTop']), busca: g('#busca', [...T, ...B, 'backgroundColor']), filtro: g('#bt-breve', [...T, ...B]), modBt: g('#menu-mods .mod>button', [...T, ...B]), letraMenu: g('#menu-mods .mod .letra', ['width', 'height', 'borderTopLeftRadius']),
      h1: g('.hero2 h1', [...T, 'color']), hero: g('.hero2', ['display', 'gridTemplateColumns', 'gap']), anim: g('.hero2 .anim', ['width', 'height']), cartao: g('.cartao', [...T, ...B, 'backgroundColor']), barra: g('.cartao .barra', ['height', 'borderTopLeftRadius']),
      h2: g('#pagina h2', [...T, 'color']), modc: g('.modc', [...T, ...B]), modcH3: g('.modc h3', T), modcLetra: g('.modc .letra', ['width', 'height', 'borderTopLeftRadius']), corpo: g('body', ['backgroundColor', 'fontFamily']) }; };
  let ref = null;
  for (const [mat, rotas] of Object.entries(PAGS)) for (const r of rotas) {
    await p.goto(BASE + r); await p.waitForTimeout(700);
    const i = await p.evaluate(() => ({ h1: document.querySelector('.hero2 h1')?.textContent, abas: [...document.querySelectorAll('.topo .abas-materia .aba')].map((a) => a.dataset.area), atual: document.querySelector('.topo .aba.atual')?.dataset.area, area: F.area, mods: document.querySelectorAll('.modc').length, esperado: CATALOGO.filter((m) => (m.area || 'fisica') === F.area).length, menuEsperado: (() => { const ms = CATALOGO.filter((m) => (m.area || 'fisica') === F.area), esc = ms.filter((m) => m.temas.some((t) => t[3])); return esc.length ? esc.length : ms.length; })(), /* módulo vazio só aparece com "Mostrar temas em breve", a não ser que a área inteira esteja vazia */ anim: (document.querySelector('.hero2 .anim svg')?.innerHTML || '').length, prog: !!document.querySelector('.cartao .barra'), legenda: !!document.querySelector('#detalhes > button'), config: !!document.querySelector('#bt-config'), home: !!document.querySelector('.topo .aba-home'), materia: document.body.dataset.materia, menuVis: [...document.querySelectorAll('#menu-mods .mod')].filter((m) => getComputedStyle(m).display !== 'none').length }));
    const esperadas = await p.evaluate((m) => AREAS.filter((a) => (a.materia || 'fisica') === m).map((a) => a.id), mat);
    ok(i.h1 && i.abas.join() === esperadas.join() && i.atual === i.area && i.materia === mat, `${r}: título "${i.h1}", abas só da ${mat} (${i.abas.join(',')}), aba atual ${i.atual}`);
    ok(i.mods === i.esperado && i.anim > 300 && i.prog && i.legenda && i.config && i.home, `${r}: ${i.mods} módulos (catálogo ${i.esperado}), desenho, progresso, Legenda, configurações e Home`);
    ok(i.esperado === 0 || i.menuVis === i.menuEsperado, `${r}: menu lateral mostra os ${i.menuEsperado} módulos da área (${i.menuVis})`);
    if (r === 'inicio' || r === 'matematica' || r === 'quimica' || r === 'russo') { const e = await p.evaluate(ESTILO); if (!ref) ref = e; else { const dif = Object.keys(ref).filter((k) => ref[k] !== e[k]); ok(!dif.length, `${r}: estilos iguais aos da Física (fora a cor) ${dif.map((k) => k + ': ' + ref[k] + ' ≠ ' + e[k]).join(' | ')}`); } }
  }
  /* animações mexem (todas, menos as de movimento reduzido) */
  for (const r of ['matematica', 'olimpiada', 'quimica', 'quimica-experimentos', 'russo', 'russo-leitura']) { await p.goto(BASE + r); await p.waitForTimeout(400); const a = await p.evaluate(() => document.querySelector('.hero2 .anim svg').innerHTML); await p.waitForTimeout(700); const c = await p.evaluate(() => document.querySelector('.hero2 .anim svg').innerHTML); ok(a !== c, `${r}: o desenho é animado`); }
  /* tela inicial: Matemática e Química viram links; Russo continua em breve */
  await p.goto(BASE + 'home'); await p.waitForTimeout(500);
  const h = await p.evaluate(() => [...document.querySelectorAll('.jv-mat')].map((m) => [m.dataset.materia, m.tagName, m.getAttribute('href')]));
  ok(JSON.stringify(h) === JSON.stringify([['fisica', 'A', '#/inicio'], ['quimica', 'A', '#/quimica'], ['matematica', 'A', '#/matematica'], ['russo', 'A', '#/russo']]), 'tela inicial: as quatro matérias abrem ' + JSON.stringify(h));
  await p.click('.jv-mat[data-materia=quimica]'); await p.waitForTimeout(500); ok(await p.evaluate(() => location.hash === '#/quimica' && F.area === 'qui'), 'botão Química da tela inicial leva para #/quimica');
  await p.goto(BASE + 'quimica/inicio'); await p.waitForTimeout(500); ok(await p.evaluate(() => location.hash === '#/quimica'), 'link antigo #/quimica/inicio → #/quimica');
  /* mhchem */
  const ce = await p.evaluate(() => { try { return katex.renderToString('\\ce{2H2 + O2 -> 2H2O}').includes('katex') && !katex.renderToString('\\ce{SO4^2-}', { throwOnError: false }).includes('katex-error'); } catch (e) { return 'erro: ' + e.message; } });
  ok(ce === true, 'mhchem carregado: \\ce{} funciona → ' + ce);
  /* componentes dentro da Química: tema de teste em memória (não fica salvo nem aparece no site) */
  await p.goto(BASE + 'quimica'); await p.waitForTimeout(400);
  await p.evaluate(() => { CATALOGO.find((m) => m.id === 'QA').temas.push(['QTESTE', 'Tema de teste', ['★'], true]);
    F.registrar('quimica/QTESTE', { html: (F) => F.secao('abertura', 'Pergunta', F.chute({ q: 'teste?', ops: ['a', 'b'], certa: 0, exp: 'x' }) + `<p>Água: $\\ce{2H2 + O2 -> 2H2O}$ e $\\ce{H2SO4}$.</p>` + F.caixa('pegadinha', '<p>x</p>') + F.formula('n = \\frac{m}{M}', 'mol') + F.formula('PV = nRT', 'gases') + F.revela([{ rot: 'Dica', html: '<p>d</p>' }]))
      + F.secao('lab', 'Lab', F.lab('Teste', 'lab-t')) + F.secao('desafios', 'Exercícios', F.exercicio({ n: 1, nivel: 'Físico', enun: '<p>Quantos mols em 18 g de água?</p>', num: { v: 1, tol: 0.01, un: 'mol' }, resp: '1', sol: '<p>18/18</p>' }) + F.chefao({ titulo: 'Chefão', enun: '<p>c</p>', dicas: ['<p>d</p>'], sol: '<p>s</p>' })), montar() {} }); });
  await p.goto(BASE + 'quimica/QTESTE'); await p.waitForTimeout(800);
  const t = await p.evaluate(() => ({ katexErr: document.querySelectorAll('.katex-error').length, ce: document.querySelectorAll('.mhchem, .katex').length, chute: !!document.querySelector('.chute'), ex: !!document.querySelector('.ex .ex-num'), chefao: !!document.querySelector('.chefao'), lab: !!document.querySelector('.lab'), caixa: !!document.querySelector('.caixa.pegadinha'), folha: !!document.querySelector('#formulas'), menuAtual: !!document.querySelector('#menu-mods a.atual'), aba: document.querySelector('.topo .aba.atual')?.dataset.area }));
  ok(t.katexErr === 0 && t.ce > 0 && t.chute && t.ex && t.chefao && t.lab && t.caixa && t.folha && t.aba === 'qui', 'componentes funcionam num tema da Química (chute, exercício, chefão, lab, caixa, folha de fórmulas, \\ce{}) ' + JSON.stringify(t));
  await p.evaluate(() => document.querySelector('.ex input').value = '1'); await p.click('.ex .ex-num button'); ok(/Certo/.test(await p.evaluate(() => document.querySelector('.ex .ex-fb').textContent)), 'correção automática funciona na Química');
  await p.goto(BASE + 'quimica'); await p.waitForTimeout(500); ok(await p.evaluate(() => /QTESTE/.test(document.querySelector('.continuar')?.textContent || '')), '"Continuar de onde parei" aparece na Química');
  /* β 3.8: prefixos por matéria e rotas com a matéria na frente */
  const pref = await p.evaluate(() => ({ qui: localStorage.getItem('qui:ultimo:qui'), fis: localStorage.getItem('fisica:ultimo:qui') }));
  ok(pref.qui && !pref.fis, 'progresso da Química fica em qui: (e não em fisica:) ' + JSON.stringify(pref));
  await p.goto(BASE + 'quimica/QTESTE'); await p.waitForTimeout(600); await p.click('.ex .certeza button'); await p.click('#bt-feito');
  const marc = await p.evaluate(() => ({ qui: Object.keys(localStorage).filter((k) => k.startsWith('qui:')), fisFeito: JSON.parse(localStorage.getItem('fisica:feitos') || '{}').QTESTE }));
  ok(marc.qui.includes('qui:feitos') && marc.qui.some((k) => k.startsWith('qui:marca:QTESTE')) && !marc.fisFeito, 'marcação ● X / e "feito" da Química vão para qui: ' + marc.qui.join(','));
  await p.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('qui:')).forEach((k) => localStorage.removeItem(k)));
  for (const [rota, mat, cod, mod] of [['quimica/A01', 'quimica', 'A01', 'QA'], ['A01', 'fisica', 'A01', 'A'], ['matematica/TN01', 'matematica', 'TN01', 'AR'], ['russo/RG13', 'russo', 'RG13', 'RG'], ['quimica/EQ09', 'quimica', 'EQ09', 'EQe']]) {
    await p.goto(BASE + rota); await p.waitForTimeout(500);
    const r = await p.evaluate(() => ({ h1: document.querySelector('#pagina h1')?.textContent, mat: F.materia(), area: F.area, atual: document.querySelector('.topo .aba.atual')?.dataset.area }));
    const esp = await p.evaluate(([c, m]) => { const i = F.achar(c, m); return i && { nome: i.nome, mod: i.mod.id, area: i.mod.area || 'fisica' }; }, [cod, mat]);
    ok(esp && esp.mod === mod && r.mat === mat && r.h1.includes(esp.nome) && r.area === esp.area, `#/${rota}: tema ${cod} da ${mat} (módulo ${esp && esp.mod}), sem confundir com o de outra matéria → ${r.h1}`); }
  const links = await p.evaluate(() => { const errados = []; document.querySelectorAll('#menu-mods .mod').forEach((m) => { const mod = CATALOGO.find((x) => x.id === m.dataset.mod), mat = AREAS.find((a) => a.id === (mod.area || 'fisica')).materia; m.querySelectorAll('a[data-cod]').forEach((a) => { const h = a.getAttribute('href'); if (h !== (mat === 'fisica' ? '#/' + a.dataset.cod : '#/' + mat + '/' + a.dataset.cod)) errados.push(h); }); }); return { n: document.querySelectorAll('#menu-mods a[data-cod]').length, errados }; });
  ok(!links.errados.length, `links do menu: ${links.n} temas, cada um com a rota da sua matéria (errados: ${links.errados.slice(0, 5).join(' ')})`);
  const cont = await p.evaluate(() => { const c = {}; CATALOGO.forEach((m) => { const mat = AREAS.find((a) => a.id === (m.area || 'fisica')).materia; c[mat] = (c[mat] || 0) + m.temas.filter((t) => t[0] !== 'QTESTE').length; }); return c; });
  ok(cont.fisica === 125 && cont.matematica === 141 && cont.quimica === 106 && cont.russo === 26, 'temas: física 125 (152 − 27 do Cálculo), matemática 141 (114 + 27), química 106 (97 + EQ19 a EQ25 + MV01 e MV02), russo 26 → ' + JSON.stringify(cont));
  await p.goto(BASE + 'russo-leitura'); await p.waitForTimeout(400);
  ok(await p.evaluate(() => { const b = [...document.querySelectorAll('#pagina button')].find((x) => /Anki/.test(x.textContent)); return !!b && b.disabled; }), 'botão "Exportar para o Anki" previsto e desativado (em breve)');
  await p.evaluate(() => { localStorage.removeItem('fisica:ultimo:qui'); });
  ok(!errs.length, 'sem erros de JavaScript ' + errs.join(' | '));
  console.log(falhas.length ? falhas.length + ' FALHA(S)' : 'tudo ok'); await b.close(); process.exit(falhas.length ? 1 : 0);
})();
