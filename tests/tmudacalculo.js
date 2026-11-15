/* Mudança da aba Cálculo da física para a matemática (β 4.0). Uso: node tests/tmudacalculo.js
   Simula um progresso salvo pela versão antiga (tudo em fisica:) e confere a migração, os links antigos e cruzados, as abas,
   o sumário, a busca, o "continuar de onde parei" e os contadores das duas matérias. */
const { chromium } = require('playwright');
const BASE = 'file:///home/user/site-fisica/index.html#/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 860 } }); await require('./adm')(p);
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  const res = []; const ok = (c, m) => res.push([c, m]);
  /* 1. progresso "da versão antiga": tudo em fisica: */
  await p.goto(BASE + 'home'); await p.waitForTimeout(400);
  await p.evaluate(() => { Object.keys(localStorage).filter((k) => /^(fisica|mat|qui|rus|jarvis):/.test(k)).forEach((k) => localStorage.removeItem(k));
    const S = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    S('fisica:codigos', 2); S('fisica:feitos', { CI07: 111, A01: 222, TE03: 333 }); S('fisica:marca:CI07-1', '●'); S('fisica:marca:CI07-2', '/'); S('fisica:resultado:CI07-1', { r: 'certo', dada: '2' });
    S('fisica:chefao:TE03', true); S('fisica:marca:A04-1', 'X'); S('fisica:ultimo:calculo', { cod: 'CI07', secao: null, t: 1 }); S('fisica:ultimo:fisica', { cod: 'A04', secao: null, t: 2 }); S('fisica:tema', 'escuro'); });
  await p.reload(); await p.waitForTimeout(600);
  const m = await p.evaluate(() => { const g = (k) => localStorage.getItem(k); return { feitosMat: JSON.parse(g('mat:feitos') || '{}'), marca1: g('mat:marca:CI07-1'), marca2: g('mat:marca:CI07-2'), res: g('mat:resultado:CI07-1'), chefao: g('mat:chefao:TE03'), ult: g('mat:ultimo:matcalc'), fisFeitos: JSON.parse(g('fisica:feitos')), fisMarca: g('fisica:marca:CI07-1'), fisA04: g('fisica:marca:A04-1'), matA04: g('mat:marca:A04-1'), backup: JSON.parse(g('jarvis:backup:antes-calculo') || 'null'), flag: g('mat:migrou-calculo') }; });
  ok(m.feitosMat.CI07 === 111 && m.feitosMat.TE03 === 333 && !('A01' in m.feitosMat), 'temas feitos do Cálculo copiados para mat:feitos (e os da física não) ' + JSON.stringify(m.feitosMat));
  ok(m.marca1 === '"●"' && m.marca2 === '"/"' && /certo/.test(m.res) && m.chefao === 'true' && /CI07/.test(m.ult), 'marcações ● X /, acertos/erros, chefão destravado e "continuar" do Cálculo vão para mat:');
  ok(m.fisFeitos.CI07 === 111 && m.fisMarca === '"●"' && m.fisA04 === '"X"' && !m.matA04, 'não destrutiva: nada é apagado de fisica:; a física não vai para mat:');
  ok(m.backup && m.backup.chaves['fisica:marca:CI07-1'] === '"●"' && m.flag === '1', 'cópia de segurança jarvis:backup:antes-calculo feita antes de migrar');
  /* migração roda uma vez só e não sobrescreve progresso novo da matemática */
  await p.evaluate(() => { localStorage.setItem('mat:marca:CI07-1', JSON.stringify('X')); localStorage.setItem('fisica:marca:CI07-1', JSON.stringify('/')); }); await p.reload(); await p.waitForTimeout(400);
  ok(await p.evaluate(() => localStorage.getItem('mat:marca:CI07-1') === '"X"'), 'recarregar não migra de novo nem apaga o que foi marcado depois');
  ok(await p.evaluate(() => { localStorage.setItem('fisica:marca:CI08-3', JSON.stringify('●')); const n = F.migraCalculo(true); return n >= 1 && localStorage.getItem('mat:marca:CI08-3') === '"●"' && localStorage.getItem('mat:marca:CI07-1') === '"X"'; }), 'importar um backup antigo: o progresso do Cálculo que faltava é copiado, sem sobrescrever');
  await p.goto(BASE + 'matematica-calculo'); await p.waitForTimeout(500);
  ok((await p.evaluate(() => document.querySelector('.continuar')?.getAttribute('href'))) === '#/matematica/CI07', '"Continuar de onde parei" migrado: o Cálculo da matemática leva ao CI07 (o último aberto na versão antiga)');
  /* 2. o tema na matemática mostra o progresso */
  await p.goto(BASE + 'matematica/CI07'); await p.waitForTimeout(900);
  const t = await p.evaluate(() => ({ h1: document.querySelector('#pagina h1')?.textContent, marca: document.querySelector('.ex .certeza button[aria-pressed="true"]')?.dataset.m, feito: document.getElementById('bt-feito')?.textContent, area: F.area, aba: document.querySelector('.topo .aba.atual')?.dataset.area, bola: !!document.querySelector('#menu-mods a[data-cod="CI07"] .bola.feito') }));
  ok(/CI07/.test(t.h1) && t.marca === 'X' && /Feito/.test(t.feito) && t.area === 'matcalc' && t.aba === 'matcalc' && t.bola, 'CI07 abre na matemática com a marcação, "feito" e a bolinha verde ' + JSON.stringify(t));
  /* 3. links antigos */
  for (const [de, para] of [['CI07', '#/matematica/CI07'], ['CI07/exercicios', '#/matematica/CI07/exercicios'], ['TE05', '#/matematica/TE05'], ['calculo', '#/matematica-calculo'], ['SC02', '#/matematica/SC02']]) { await p.goto(BASE + de); await p.waitForTimeout(500); ok((await p.evaluate(() => location.hash)) === para, `link antigo #/${de} → ${para}`); }
  /* 4. links cruzados: física → cálculo e cálculo → física */
  await p.goto(BASE + 'A04'); await p.waitForTimeout(900);
  const r = await p.evaluate(() => [...document.querySelectorAll('#pagina a.ret')].filter((a) => /CI0[67]/.test(a.textContent)).map((a) => [a.textContent, a.getAttribute('href'), a.classList.contains('breve')]));
  ok(r.length >= 2 && r.every(([txt, h, br]) => /^\[CI0[67]\]←$/.test(txt) && h === '#/matematica/' + txt.slice(1, 5) && !br), 'física → Cálculo: [CI06]← e [CI07]← do A04 apontam para a matemática ' + JSON.stringify(r));
  await p.click('#pagina a.ret[href="#/matematica/CI07"]'); await p.waitForTimeout(800);
  ok(await p.evaluate(() => location.hash === '#/matematica/CI07' && /CI07/.test(document.querySelector('#pagina h1').textContent)), 'clicar no [CI07]← da física abre o CI07 na matemática');
  await p.goto(BASE + 'matematica/CE03'); await p.waitForTimeout(900);
  const r2 = await p.evaluate(() => [...document.querySelectorAll('#pagina a.ret')].map((a) => [a.textContent, a.getAttribute('href'), a.classList.contains('breve')]));
  ok(r2.length > 3 && r2.every(([txt, h, br]) => !br && !/\//.test(txt)) && r2.some(([txt, h]) => txt === '[U01]←' && h === '#/U01'), 'Cálculo → física: os [n]← do CE03 levam à física (ex.: [U01]← → #/U01), nenhum "em breve"');
  /* 5. abas, módulos e contadores */
  await p.goto(BASE + 'inicio'); await p.waitForTimeout(600);
  const fi = await p.evaluate(() => ({ abas: [...document.querySelectorAll('.topo .abas-materia .aba')].map((a) => a.textContent.trim()).join('|'), prog: document.querySelector('.cartao .tit').textContent, cont: document.querySelector('.continuar')?.textContent || '', temCalcMenu: [...document.querySelectorAll('#menu-mods .mod')].some((m) => /^K[1-5]$/.test(m.dataset.mod) && getComputedStyle(m).display !== 'none') }));
  ok(fi.abas === 'Física|Experimentos|Experimental', 'física com 3 abas: ' + fi.abas);
  ok(/de 96 temas feitos · 96 já escritos/.test(fi.prog), 'contador da aba Física: os mesmos 96 temas de antes (o Cálculo era outra aba) → ' + fi.prog);
  ok(/A04/.test(fi.cont) && !fi.temCalcMenu, '"continuar" da física continua no A04 e o menu da física não tem o Cálculo');
  await p.goto(BASE + 'matematica-calculo'); await p.waitForTimeout(600);
  const mc = await p.evaluate(() => ({ mods: [...document.querySelectorAll('.modc h3')].map((h) => h.textContent).join('|'), prog: document.querySelector('.cartao .tit').textContent, cont: document.querySelector('.continuar')?.getAttribute('href') }));
  ok(mc.mods === 'Cálculo 1|Cálculo 2|Cálculo 3|Cálculo 4|Funções especiais e integrais|Teoremas|Simulados de Cálculo', 'aba Cálculo da matemática: os 5 módulos na ordem + Cálculo 3 e 4 → ' + mc.mods);
  ok(/2 de 27 temas feitos · 27 já escritos/.test(mc.prog), 'contador do Cálculo: 2 de 27 feitos (CI07 e TE03), 27 escritos → ' + mc.prog);
  ok(mc.cont === '#/matematica/CE03', '"Continuar de onde parei" do Cálculo leva ao último tema aberto (CE03) → ' + mc.cont);
  /* 6. sumário, busca, legenda */
  await p.goto(BASE + 'sumario'); await p.waitForTimeout(400);
  ok(await p.evaluate(() => { const t = document.querySelector('#pagina').innerText; return /CI07/.test(t) && !!document.querySelector('#pagina a[href="#/matematica/CI07"]') && !!document.querySelector('#pagina a[href="#/matematica/CI07/teoria"]'); }), 'sumário do Cálculo (na matemática) lista o CI07 com links certos');
  await p.goto(BASE + 'inicio'); await p.waitForTimeout(300); await p.goto(BASE + 'sumario'); await p.waitForTimeout(400);
  ok(await p.evaluate(() => !/CI07|CII04|TE05/.test(document.querySelector('#pagina').innerText)), 'sumário da física não tem mais o Cálculo');
  await p.fill('#busca', 'Limite'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => ![...document.querySelectorAll('#menu-mods li')].some((li) => li.offsetParent && /CI0/.test(li.textContent))), 'busca na física não mostra temas do Cálculo');
  await p.fill('#busca', ''); await p.goto(BASE + 'matematica-calculo'); await p.waitForTimeout(300); await p.fill('#busca', 'Limite'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => [...document.querySelectorAll('#menu-mods li')].some((li) => li.offsetParent && /CI0/.test(li.textContent))), 'busca no Cálculo da matemática acha os temas');
  await p.fill('#busca', '');
  ok(await p.evaluate(() => !!document.querySelector('#detalhes > button')), 'botão "Legenda e símbolos" no Cálculo');
  /* 7. laboratórios */
  await p.goto(BASE + 'matematica/CII04'); await p.waitForTimeout(1200);
  const lab = await p.evaluate(() => ({ k: typeof SIM.taylorK === 'function', vis: document.querySelectorAll('.lab .vis').length, txt: document.querySelector('.lab')?.innerText || '' }));
  ok(lab.k && lab.vis > 0, 'CII04 usa o laboratório de Taylor do Cálculo (SIM.taylorK) ' + JSON.stringify({ k: lab.k, vis: lab.vis }));
  await p.goto(BASE + 'F05'); await p.waitForTimeout(1000);
  ok(await p.evaluate(() => typeof SIM.taylor === 'function' && !!SIM.taylor._P && document.querySelectorAll('.lab .vis').length > 0), 'F05 (física) continua com o laboratório dele');
  await p.evaluate(() => Object.keys(localStorage).filter((k) => /^(fisica|mat|qui|rus|jarvis):/.test(k)).forEach((k) => localStorage.removeItem(k)));
  ok(!errs.length, 'sem erros de JavaScript ' + errs.slice(0, 3).join(' | '));
  console.log(res.filter((r) => r[0]).length + ' de ' + res.length + ' ok'); process.exitCode = res.every((r) => r[0]) ? 0 : 1; res.forEach((r) => console.log((r[0] ? 'ok     ' : 'FALHA  ') + r[1]));
  await b.close();
})();
