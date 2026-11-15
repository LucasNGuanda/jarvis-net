/* Segundo segredo (β 3.8), na página inicial da Matemática. Detalhes só no PROGRESSO.md. Uso: node tests/tsegredo2.js */
const { chromium } = require('playwright');
const BASE = 'file:///home/user/site-fisica/index.html#/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 860 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  const res = []; const ok = (c, m) => { res.push([c, m]); };
  await p.goto(BASE + 'matematica'); await p.evaluate(() => { localStorage.removeItem('mat:segredo:t'); localStorage.removeItem('fisica:segredo:x'); }); await p.reload(); await p.waitForTimeout(800);
  /* nenhum texto do site revela o segredo antes de ele acontecer */
  let vaza = [];
  for (const r of ['home', 'inicio', 'matematica', 'matematica-calculo', 'olimpiada', 'quimica', 'russo', 'sumario']) { await p.goto(BASE + r); await p.waitForTimeout(350); if (/tesserat|hipercubo|4 dimens/i.test(await p.evaluate(() => document.body.innerText + (document.querySelector('#detalhes')?.textContent || '')))) vaza.push(r); }
  ok(!vaza.length, 'nenhum texto do site fala do segredo ' + vaza.join(','));
  await p.goto(BASE + 'matematica'); await p.waitForTimeout(700);
  ok(await p.evaluate(() => !document.querySelector('.hero2 .anim .sl').innerHTML), 'sem selinho antes de descobrir');
  const box = await (await p.$('.hero2 .anim svg')).boundingBox(), cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  const clica = async (n, pausa) => { for (let k = 0; k < n; k++) { await p.mouse.click(cx, cy); await p.waitForTimeout(pausa); } };
  await clica(3, 120); await p.waitForTimeout(900); ok(await p.evaluate(() => !document.querySelector('.falha-tela') && !F._seg.t()), '3 cliques não destravam');
  await clica(4, 900); await p.waitForTimeout(200); ok(await p.evaluate(() => !F._seg.t()), '4 cliques devagar (0,9 s) não destravam');
  await p.waitForTimeout(800); await clica(4, 110); await p.waitForTimeout(300);
  const f = await p.evaluate(() => { const c = document.querySelector('.falha-tela'); return c ? { pe: getComputedStyle(c).pointerEvents, z: getComputedStyle(c).zIndex } : null; });
  ok(f && f.pe === 'none', '4 cliques seguidos: começa a "falha no sistema", sem bloquear clique ' + JSON.stringify(f));
  const fisicaClicavel = await p.evaluate(() => { const r = document.querySelector('.topo .aba-home').getBoundingClientRect(); return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2).closest('.aba-home') !== null; });
  ok(fisicaClicavel, 'durante a falha, os botões continuam clicáveis');
  await p.waitForTimeout(2300);
  const t = await p.evaluate(() => ({ canvas: !!document.querySelector('.falha-tela'), linhas: document.querySelectorAll('.hero2 .anim svg .g line').length, leg: document.querySelector('.hero2 .anim svg .g text')?.textContent || '', salvo: localStorage.getItem('mat:segredo:t'), fis: localStorage.getItem('fisica:segredo:t'), transf: document.querySelector('.principal').style.transform }));
  ok(!t.canvas && t.transf === '', 'a falha acaba sozinha (~2 s) e a página volta ao lugar');
  ok(t.linhas === 32, 'depois aparece o hipercubo (32 arestas) → ' + t.linhas);
  ok(/tesserato/.test(t.leg), 'legendinha aparece');
  ok(t.salvo === '1' && !t.fis, 'descoberta guardada com o prefixo da Matemática (mat:)');
  const a1 = await p.evaluate(() => document.querySelector('.hero2 .anim svg .g').innerHTML); await p.waitForTimeout(300); const a2 = await p.evaluate(() => document.querySelector('.hero2 .anim svg .g').innerHTML);
  ok(a1 !== a2, 'o hipercubo gira');
  await p.waitForTimeout(6000); ok(await p.evaluate(() => !document.querySelector('.hero2 .anim svg .g text')), 'a legenda some depois de alguns segundos (fica ~6 s)');
  const h1 = await (await p.$('.hero2 h1')).boundingBox(); await p.mouse.click(h1.x + 20, h1.y + h1.height / 2); await p.waitForTimeout(200); /* fora do desenho, num lugar sem link */
  ok(await p.evaluate(() => !F._seg.t() && document.querySelectorAll('.hero2 .anim svg .g line').length === 30), 'clicar fora volta o poliedro (30 arestas)');
  ok(await p.evaluate(() => document.querySelector('.hero2 .anim .sl').innerHTML.includes('M152 -140')), 'selinho discreto aparece depois de descoberto');
  await p.reload(); await p.waitForTimeout(600); ok(await p.evaluate(() => document.querySelector('.hero2 .anim .sl').innerHTML.includes('M152 -140')), 'selinho continua depois de recarregar');
  /* volta sozinho depois de ~10 s de hipercubo */
  const b2 = await (await p.$('.hero2 .anim svg')).boundingBox(); for (let k = 0; k < 4; k++) { await p.mouse.click(b2.x + b2.width / 2, b2.y + b2.height / 2); await p.waitForTimeout(110); }
  await p.waitForTimeout(12600); ok(await p.evaluate(() => !F._seg.t() && document.querySelectorAll('.hero2 .anim svg .g line').length === 30), 'volta sozinho ao poliedro depois de uns 10 s');
  ok(!errs.length, 'sem erros JS ' + errs.join(' | '));
  await p.evaluate(() => localStorage.removeItem('mat:segredo:t'));
  console.log(res.filter((r) => r[0]).length + ' de ' + res.length + ' ok'); process.exitCode = res.every((r) => r[0]) ? 0 : 1; res.forEach((r) => console.log((r[0] ? 'ok     ' : 'FALHA  ') + r[1]));
  await b.close();
})();
