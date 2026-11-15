/* Tabela periódica de rodapé (β 5.3). Uso: node tests/ttabela.js
   Confere: dados (118 elementos, sem undefined), posições na grade, interruptor ao lado do título da Química, barra no rodapé na largura inteira,
   gaveta que sobe e desce (clique, X, Esc), engrenagem só depois da primeira vez, uma ferramenta de rodapé por vez (tabela × calculadoras),
   os 11 recursos (ficha, mapa de calor, famílias, blocos, busca, termômetro, preenchimento, comparador, linha do tempo, radioativos, estrelas),
   persistência ao recarregar, visitante sem a ferramenta. Sempre em 1280 × 900. */
const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html');
const { chromium } = require('playwright');
const res = []; const ok = (c, m) => res.push([!!c, m]);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); await require('./adm')(p);
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(RAIZ + '#/home'); await p.waitForTimeout(900);
  await p.evaluate(() => { ['fisica:tabela', 'fisica:tabela-usada', 'fisica:calculadora', 'fisica:calculadora2'].forEach(k => localStorage.removeItem(k)); });
  await p.reload(); await p.waitForTimeout(900);

  // ----- dados -----
  const d = await p.evaluate(() => { const D = window.TABELA_DADOS, T = window.TABELA, E = D.elementos, campos = ['z', 's', 'massa', 'conf', 'en', 'raio', 'ei', 'ae', 'ox', 'estado', 'pf', 'pe', 'dens', 'ano', 'autor', 'meia', 'usos', 'tipo'];
    const und = []; E.forEach(e => campos.forEach(c => { if (e[c] === undefined) und.push(e.z + '.' + c); }));
    const pos = new Set(); for (let z = 1; z <= 118; z++) pos.add(T.pos(z).join(','));
    return { n: E.length, ordem: E.every((e, i) => e.z === i + 1), und, simb: E.every((e, i) => !window.SIM || !SIM.ELEM || SIM.ELEM.simb[i] === e.s), pos: pos.size, fontes: (D.fontes || []).length,
      fe: T.pos(26).join('/'), la: T.pos(57).join('/'), og: T.pos(118).join('/'), cr: T.excecao(24), fe2: T.excecao(26), h2o: [T.estado(1, 10), T.estado(80, 298), T.estado(26, 298), T.estado(2, 298)] }; });
  ok(d.n === 118 && d.ordem, 'dados: 118 elementos em ordem de Z → ' + d.n);
  ok(d.und.length === 0, 'dados: nenhum campo undefined (só valor ou null) → ' + d.und.slice(0, 8).join(' '));
  ok(d.simb, 'dados: símbolos iguais aos de SIM.ELEM');
  ok(d.fontes > 0, 'dados: fontes declaradas → ' + d.fontes);
  ok(d.pos === 118 && d.fe === '4/8' && d.la === '9/3' && d.og === '7/18', 'grade: 118 posições distintas; Fe 4/8, La 9/3, Og 7/18 → ' + [d.pos, d.fe, d.la, d.og].join(' '));
  ok(d.cr === true && d.fe2 === false, 'preenchimento: Cr é exceção à regra de Madelung e Fe não → ' + d.cr + ' ' + d.fe2);
  ok(d.h2o[1] === 'líquido' && d.h2o[2] === 'sólido' && d.h2o[3] === 'gás', 'termômetro: Hg líquido, Fe sólido e He gás a 298 K → ' + d.h2o.join(' '));

  // ----- antes de ligar -----
  const antes = await p.evaluate(() => ({ barra: !!document.querySelector('.tp-barra'), cfg: !!document.getElementById('cfg-tabela') }));
  ok(!antes.barra && !antes.cfg, 'antes da primeira vez: sem barra e sem entrada na engrenagem');
  await p.goto(RAIZ + '#/fisica'); await p.waitForTimeout(900);
  ok(await p.evaluate(() => !document.querySelector('.tp-sw')), 'página inicial da Física: sem interruptor ao lado do título');
  await p.goto(RAIZ + '#/quimica'); await p.waitForTimeout(1000);
  const sw = await p.evaluate(() => { const s = document.querySelector('.hero2 h1 .tp-sw'); if (!s) return null; const r = s.getBoundingClientRect(), h = document.querySelector('.hero2 h1').getBoundingClientRect(); return { title: s.title, on: s.getAttribute('aria-checked'), naLinha: r.top >= h.top - 4 && r.bottom <= h.bottom + 4 }; });
  ok(sw && sw.title === 'ativar tabela periódica' && sw.on === 'false' && sw.naLinha, 'Química: interruptor ao lado do título, desligado, com o texto "ativar tabela periódica" → ' + JSON.stringify(sw));

  // ----- ligar: barra na largura inteira -----
  await p.click('.hero2 h1 .tp-sw'); await p.waitForTimeout(500);
  const barra = await p.evaluate(() => { const r = document.querySelector('.tp-barra').getBoundingClientRect(), g = document.querySelector('.tp-gaveta'); return { x: r.left, w: r.width, baixo: Math.round(innerHeight - r.bottom), h: r.height, aberta: document.querySelector('.tp').classList.contains('tp-aberta'), vis: getComputedStyle(g).visibility, salvo: localStorage.getItem('fisica:tabela'), uso: localStorage.getItem('fisica:tabela-usada'), cfg: !!document.getElementById('cfg-tabela') }; });
  ok(barra.x === 0 && barra.w === 1280 && barra.baixo === 0 && barra.h <= 36, 'ligada: barra fina no rodapé, de ponta a ponta → ' + JSON.stringify(barra));
  ok(!barra.aberta && barra.vis === 'hidden', 'ligada: a tabela começa recolhida');
  ok(barra.salvo === 'true' && barra.uso === 'true' && barra.cfg, 'ligada: salvo em fisica:tabela, e a engrenagem ganha "Tabela periódica"');
  const ordemCfg = await p.evaluate(() => { const l = [...document.querySelectorAll('#painel-config .cfg-linha')].map(x => x.textContent.trim().slice(0, 16)); return l.join(' | '); });
  ok(/Calculadora 1.*Calculadora 2.*Tabela periódica/.test(ordemCfg), 'engrenagem: Tabela periódica abaixo das calculadoras → ' + ordemCfg);

  // ----- movimento -----
  const mov = await p.evaluate(() => { const g = getComputedStyle(document.querySelector('.tp-gaveta')), b = getComputedStyle(document.querySelector('.tp-barra')), c = getComputedStyle(document.querySelector('.tp-c')); return { g: g.transitionDuration, gp: g.transitionProperty, gt: g.transitionTimingFunction, b: b.transitionDuration, bt: b.transform, c: c.transitionProperty + ' ' + c.transitionDuration, vis: document.querySelector('.tp').classList.contains('tp-vis') }; });
  ok(/0\.3s/.test(mov.g) && /transform/.test(mov.gp) && /cubic-bezier/.test(mov.gt), 'movimento: a tabela desliza em 0,3 s, com curva não linear → ' + mov.g + ' · ' + mov.gt.split('),')[0] + ')');
  ok(mov.b === '0.28s' && mov.vis && (mov.bt === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(mov.bt)), 'movimento: a barra entra subindo (0,28 s) e termina no lugar → ' + mov.b + ' ' + mov.bt);
  ok(/background-color/.test(mov.c) && /0\.25s/.test(mov.c), 'movimento: as células transicionam a cor de fundo em 0,25 s → ' + mov.c);
  // ----- abrir e fechar -----
  await p.click('.tp-barra'); await p.waitForTimeout(700);
  const ab = await p.evaluate(() => { const g = document.querySelector('.tp-gaveta').getBoundingClientRect(), cs = [...document.querySelectorAll('.tp-c')], r = cs.map(c => c.getBoundingClientRect()); return { aberta: document.querySelector('.tp').classList.contains('tp-aberta'), w: g.width, topo: g.top, n: cs.length, dentro: r.every(x => x.width > 20 && x.height > 20 && x.top >= g.top && x.bottom <= innerHeight - 30), rolagem: document.documentElement.scrollWidth > innerWidth }; });
  ok(ab.aberta && ab.w === 1280 && ab.n === 118 && ab.dentro && !ab.rolagem, 'aberta: 118 células visíveis, dentro da gaveta, sem rolagem lateral → ' + JSON.stringify(ab));
  await p.screenshot({ path: 'tests/capturas/tabela-aberta.png' }).catch(() => {});
  await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => !document.querySelector('.tp').classList.contains('tp-aberta') && !document.querySelector('.tp').hidden), 'Esc: a tabela desce e a barra continua');
  await p.click('.tp-barra'); await p.waitForTimeout(500); await p.click('.tp-x'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => !document.querySelector('.tp').classList.contains('tp-aberta')), 'X: a tabela desce');
  await p.click('.tp-barra'); await p.waitForTimeout(500); await p.click('.tp-barra'); await p.waitForTimeout(500);
  ok(await p.evaluate(() => !document.querySelector('.tp').classList.contains('tp-aberta')), 'clicar de novo na barra: a tabela desce');

  // ----- recursos -----
  await p.click('.tp-barra'); await p.waitForTimeout(500);
  const dir = () => p.evaluate(() => document.querySelector('.tp-dir').textContent);
  await p.click('.tp-c[data-z="26"]'); let t = await dir();
  ok(/Fe/.test(t) && /ferro/i.test(t) && /número atômico/.test(t) && /configuração/.test(t) && /descoberta/.test(t) && /usos/.test(t) && /ponto de fusão/.test(t), '(2) ficha do ferro com os campos pedidos');
  await p.click('[data-modo=prop]'); await p.selectOption('.tp-ctl select', 'ae');
  const calor = await p.evaluate(() => ({ leg: document.querySelector('.tp-leg').textContent, he: document.querySelector('.tp-c[data-z="2"]').classList.contains('semd'), cl: document.querySelector('.tp-c[data-z="17"]').style.backgroundColor, ops: document.querySelectorAll('.tp-ctl option').length }));
  ok(calor.ops === 7 && /sem dado/.test(calor.leg) && calor.cl, '(1) mapa de calor: 7 propriedades, legenda com escala, cloro colorido → ' + calor.ops);
  ok(calor.he, '(1) afinidade eletrônica do hélio em branco ("sem dado"), não inventada');
  // desempenho: 118 células mudando de cor ao mesmo tempo
  const fps = await p.evaluate(() => new Promise((fim) => { let n = 0, t0 = performance.now(); const sel = document.querySelector('.tp-ctl select'), ops = ['pf', 'en', 'raio', 'dens']; let k = 0; const troca = setInterval(() => { sel.value = ops[k++ % 4]; sel.dispatchEvent(new Event('change')); }, 260); const q = (ts) => { n++; if (ts - t0 < 1300) requestAnimationFrame(q); else { clearInterval(troca); fim(Math.round((n * 1000) / (ts - t0))); } }; requestAnimationFrame(q); }));
  ok(fps >= 40, 'desempenho: trocando de mapa de calor 5 vezes em 1,3 s, a página segue acima de 40 quadros por segundo → ' + fps + ' fps');
  const meio = await p.evaluate(async () => { const sel = document.querySelector('.tp-ctl select'), c = document.querySelector('.tp-c[data-z="26"]'); sel.value = 'en'; sel.dispatchEvent(new Event('change')); await new Promise(r => setTimeout(r, 400)); const a = getComputedStyle(c).backgroundColor; sel.value = 'pf'; sel.dispatchEvent(new Event('change')); await new Promise(r => setTimeout(r, 110)); const m = getComputedStyle(c).backgroundColor; await new Promise(r => setTimeout(r, 400)); const z = getComputedStyle(c).backgroundColor; return { a, m, z }; });
  ok(meio.a !== meio.z && meio.m !== meio.a && meio.m !== meio.z, 'movimento: no meio da troca de escala, a cor do ferro é intermediária (não pula) → ' + [meio.a, meio.m, meio.z].join(' → '));
  await p.click('[data-modo=fam]'); await p.click('[data-fam=hal]');
  const fam = await p.evaluate(() => [...document.querySelectorAll('.tp-c:not(.apag)')].map(c => c.dataset.z).join(','));
  ok(fam === '9,17,35,53,85,117', '(3) família dos halogênios destacada → ' + fam);
  const nf = await p.evaluate(() => document.querySelectorAll('[data-fam]').length); ok(nf === 10, '(3) dez famílias → ' + nf);
  await p.click('[data-modo=bloco]');
  ok(await p.evaluate(() => { const c = (z) => document.querySelector('.tp-c[data-z="' + z + '"]').style.backgroundColor; return c(11) !== c(17) && c(17) !== c(26) && c(26) !== c(60) && c(11) === c(20); }), '(4) blocos s, p, d, f com cores diferentes');
  await p.click('[data-modo=ficha]'); await p.fill('.tp-topo input', 'ouro'); await p.waitForTimeout(200);
  const bs = await p.evaluate(() => ({ vis: [...document.querySelectorAll('.tp-c:not(.apag)')].map(c => c.dataset.z).join(','), dir: document.querySelector('.tp-dir h4').textContent }));
  ok(bs.vis === '79' && /Au/.test(bs.dir), '(5) busca por nome ("ouro") → ' + JSON.stringify(bs));
  await p.fill('.tp-topo input', 'Hg'); ok((await p.evaluate(() => document.querySelector('.tp-dir h4').textContent)).startsWith('Hg'), '(5) busca por símbolo');
  await p.fill('.tp-topo input', '92'); ok((await p.evaluate(() => document.querySelector('.tp-dir h4').textContent)).startsWith('U'), '(5) busca por Z');
  await p.fill('.tp-topo input', '');
  await p.click('[data-modo=temp]');
  const est = async (K) => { await p.evaluate((k) => { const s = document.querySelector('.tp-ctl input[type=range]'); s.value = k; s.dispatchEvent(new Event('input')); }, K); return p.evaluate(() => { const c = (z) => document.querySelector('.tp-c[data-z="' + z + '"]').style.backgroundColor; return [c(26), c(80), c(2)].join('|'); }); };
  const t1 = await est(298), t2 = await est(6000), t0 = await est(0);
  ok(t1.split('|').length === 3 && new Set(t1.split('|')).size === 3 && new Set(t2.split('|')).size <= 2 && t0 !== t1, '(6) termômetro de 0 a 6000 K muda as cores (298 K: Fe, Hg e He diferentes)');
  ok(await p.evaluate(() => { const s = document.querySelector('.tp-ctl input[type=range]'); return s.min === '0' && s.max === '6000'; }), '(6) faixa de 0 a 6000 K');
  await p.click('[data-modo=conf]'); await p.evaluate(() => { const s = document.querySelector('.tp-ctl input[type=range]'); s.value = 24; s.dispatchEvent(new Event('input')); });
  t = await dir(); ok(/Pauling/.test(t) && /3d⁴/.test(t) && /3d⁵/.test(t) && /Exceção/.test(t), '(7) preenchimento do crômio: regra (3d⁴), medida (3d⁵) e aviso de exceção');
  await p.click('[data-b=toca]'); await p.waitForTimeout(1200);
  ok(await p.evaluate(() => { const v = +document.querySelector('.tp-ctl input[type=range]').value; return v >= 3 && v < 30; }), '(7) o botão preenche orbital por orbital, andando sozinho');
  await p.click('[data-modo=cmp]'); await p.click('.tp-c[data-z="11"]'); await p.click('.tp-c[data-z="17"]');
  const cm = await p.evaluate(() => ({ t: document.querySelector('.tp-dir').textContent, maior: document.querySelectorAll('.tp-dir td.maior').length })); ok(/Na × Cl/.test(cm.t) && cm.maior >= 5, '(8) comparador Na × Cl com as diferenças destacadas → ' + cm.maior);
  await p.click('[data-modo=hist]');
  const hist = async (a) => { await p.evaluate((k) => { const s = document.querySelector('.tp-ctl input[type=range]'); s.value = k; s.dispatchEvent(new Event('input')); }, a); return p.evaluate(() => ({ ac: document.querySelectorAll('.tp-c:not(.apag):not(.buraco)').length, bur: [...document.querySelectorAll('.tp-c.buraco')].map(c => c.dataset.z).join(','), t: document.querySelector('.tp-dir').textContent })); };
  const h1 = await hist(1700), h2 = await hist(1872), h3 = await hist(2015);
  ok(h1.ac < h2.ac && h2.ac < h3.ac && h3.ac === 118, '(9) linha do tempo: a tabela se preenche com os anos → ' + [h1.ac, h2.ac, h3.ac].join(' < '));
  ok(/31/.test(h2.bur) && /32/.test(h2.bur) && /21/.test(h2.bur) && h3.bur === '' && /Mendeleiev/.test(h2.t), '(9) lacunas previstas por Mendeleiev aparecem tracejadas (Sc, Ga, Ge) → ' + h2.bur);
  ok(await p.evaluate(() => [...document.querySelectorAll('[data-modo][aria-pressed=true]')].map(b => b.dataset.modo).join(',')) === 'hist', 'só o botão do modo atual fica marcado');
  await p.click('[data-modo=rad]');
  const rad = await p.evaluate(() => ({ z: [...document.querySelectorAll('.tp-c:not(.apag)')].map(c => +c.dataset.z), fe: document.querySelector('.tp-c[data-z="26"]').classList.contains('apag') }));
  ok(rad.z.includes(43) && rad.z.includes(61) && rad.z.includes(92) && rad.fe && rad.z.filter(z => z >= 84).length === 35, '(10) radioativos marcados: Tc, Pm e todos de Z ≥ 84 → ' + rad.z.length);
  await p.click('.tp-c[data-z="92"]'); t = await dir(); ok(/isótopo mais estável/.test(t) && /anos/.test(t), '(10) meia-vida do isótopo mais estável do urânio na ficha');
  await p.click('[data-modo=est]'); const es = await p.evaluate(() => [...document.querySelectorAll('.tp-c:not(.apag)')].map(c => c.querySelector('.tp-m').textContent).join(''));
  ok(es.length >= 10 && /^★+$/.test(es), '(11) estrelas nos elementos mais cobrados → ' + es.length);
  ok(await p.evaluate(() => document.querySelectorAll('[data-modo]').length === 10 && !!document.querySelector('.tp-topo input[type=search]')), 'botões dos recursos acima da tabela (10 modos + busca)');
  const nota = await p.evaluate(() => { const r = document.querySelector('.tp-rod'), g = document.querySelector('.tp-gaveta').getBoundingClientRect(), b = r.getBoundingClientRect(); return { t: r.textContent, dentro: b.top >= g.top && b.bottom <= innerHeight - 30 && b.height > 10 }; });
  ok(/critério do Jarvis/.test(nota.t) && /não uma estatística de provas/.test(nota.t) && /van der Waals/.test(nota.t) && /não existe medido ou em que as fontes discordam/.test(nota.t) && nota.dentro, 'notinha fixa na tabela: ★ é critério do Jarvis; raio de van der Waals; o que significa "sem dado" → visível: ' + nota.dentro);
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);

  // ----- vale em qualquer matéria; persiste -----
  await p.goto(RAIZ + '#/A01'); await p.waitForTimeout(1200);
  ok(await p.evaluate(() => { const t = document.querySelector('.tp'); return t && !t.hidden && document.querySelector('.tp-barra').getBoundingClientRect().width === 1280; }), 'num tema da Física: a barra continua visível');
  await p.reload(); await p.waitForTimeout(1200);
  ok(await p.evaluate(() => { const t = document.querySelector('.tp'); return t && !t.hidden && document.getElementById('cfg-tabela').getAttribute('aria-checked') === 'true'; }), 'depois de recarregar: continua ligada e a engrenagem mostra ligada');

  // ----- uma ferramenta de rodapé por vez -----
  await p.click('#bt-config'); await p.waitForTimeout(300); await p.click('#cfg-calc'); await p.waitForTimeout(700);
  const u1 = await p.evaluate(() => ({ tp: document.querySelector('.tp').hidden, sw: document.getElementById('cfg-tabela').getAttribute('aria-checked'), calc: document.getElementById('cfg-calc').getAttribute('aria-checked'), salvo: localStorage.getItem('fisica:tabela') }));
  ok(u1.tp && u1.sw === 'false' && u1.calc === 'true' && u1.salvo === 'false', 'ligar a calculadora 1 desliga a tabela → ' + JSON.stringify(u1));
  await p.click('#cfg-tabela'); await p.waitForTimeout(700);
  const u2 = await p.evaluate(() => ({ tp: document.querySelector('.tp').hidden, calc: document.getElementById('cfg-calc').getAttribute('aria-checked'), c1: localStorage.getItem('fisica:calculadora') }));
  ok(!u2.tp && u2.calc === 'false' && u2.c1 === 'false', 'ligar a tabela pela engrenagem desliga a calculadora → ' + JSON.stringify(u2));
  await p.click('#cfg-calc2'); await p.waitForTimeout(700);
  ok(await p.evaluate(() => document.querySelector('.tp').hidden && document.getElementById('cfg-calc2').getAttribute('aria-checked') === 'true'), 'ligar a calculadora 2 também desliga a tabela');
  await p.click('#cfg-calc2'); await p.waitForTimeout(400);
  ok(/Só uma fica ligada por vez/.test(await p.evaluate(() => document.querySelector('#painel-config').textContent)), 'engrenagem: aviso "Só uma fica ligada por vez"');

  // ----- desligar pelo título esconde a barra -----
  await p.goto(RAIZ + '#/quimica'); await p.waitForTimeout(1000);
  await p.click('.hero2 h1 .tp-sw'); await p.waitForTimeout(400); ok(await p.evaluate(() => !document.querySelector('.tp').hidden && document.querySelector('.hero2 h1 .tp-sw').title === 'desativar tabela periódica'), 'ligar de novo pelo título');
  await p.click('.hero2 h1 .tp-sw'); await p.waitForTimeout(400); ok(await p.evaluate(() => document.querySelector('.tp').hidden && !document.body.classList.contains('tp-on')), 'desligar o interruptor esconde a barra');

  // ----- quem desligou animações no sistema: troca instantânea -----
  const r = await b.newPage({ viewport: { width: 1280, height: 900 } }); await require('./adm')(r); await r.emulateMedia({ reducedMotion: 'reduce' }); await r.goto(RAIZ + '#/quimica'); await r.waitForTimeout(1000);
  await r.evaluate(() => { localStorage.removeItem('fisica:tabela'); }); await r.reload(); await r.waitForTimeout(1000); await r.click('.hero2 h1 .tp-sw'); await r.waitForTimeout(200); await r.click('.tp-barra'); await r.waitForTimeout(80);
  const red = await r.evaluate(() => { const g = getComputedStyle(document.querySelector('.tp-gaveta')), bb = getComputedStyle(document.querySelector('.tp-barra')), c = getComputedStyle(document.querySelector('.tp-c')), d = document.querySelector('.tp-dir > *'); return { g: g.transitionDuration, b: bb.transitionDuration, c: c.transitionDuration, an: d ? getComputedStyle(d).animationName : '', topo: document.querySelector('.tp-gaveta').getBoundingClientRect().top < innerHeight - 200 }; });
  ok(/^0s/.test(red.g) && red.b === '0s' && /^0s/.test(red.c) && red.an === 'none' && red.topo, 'reduzir movimento: sem transição e sem animação; a tabela já está aberta 80 ms depois do clique → ' + JSON.stringify(red));
  await r.click('.hero2 h1 .tp-sw'); await r.waitForTimeout(60); ok(await r.evaluate(() => document.querySelector('.tp').hidden), 'reduzir movimento: desligar esconde na hora'); await r.close();

  // ----- visitante: nada -----
  const v = await b.newPage({ viewport: { width: 1280, height: 900 } }); await v.goto(RAIZ + '#/home'); await v.waitForTimeout(800);
  await v.evaluate(() => { localStorage.setItem('jarvis:acesso', JSON.stringify({ chaves: [] })); localStorage.setItem('fisica:tabela', 'true'); localStorage.setItem('fisica:tabela-usada', 'true'); }); await v.reload(); await v.waitForTimeout(900);
  ok(await v.evaluate(() => { const t = document.querySelector('.tp'); return (!t || t.hidden) && !document.getElementById('cfg-tabela'); }), 'visitante (sem código): sem barra e sem entrada na engrenagem, mesmo com a chave salva');

  ok(errs.length === 0, 'sem erros de JS → ' + errs.join(' | '));
  await b.close();
  let f = 0; res.forEach(([c, m]) => { if (!c) f++; console.log((c ? 'ok ' : 'FALHA ') + m); }); console.log('FALHAS (' + f + ')' + (f ? '' : ':')); process.exit(f ? 1 : 0);
})();
