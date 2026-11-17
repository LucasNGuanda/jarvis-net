const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
const { chromium } = require('playwright');
const res = []; const ok = (c, m) => res.push([c, m]);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); await require('./adm')(p);
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const base = RAIZ;
  const gira = () => p.evaluate(async () => { const pega = () => { const e = document.querySelector('.jv-globo .jv-mer'), l = document.querySelector('.jv-globo .jv-lua'); return [+e.getAttribute('rx'), +l.getAttribute('cx')]; }; const a = pega(); await new Promise(r => setTimeout(r, 700)); const c = pega(); return Math.abs(a[0] - c[0]) > 0.5 && Math.abs(a[1] - c[1]) > 0.5; });
  await p.goto(base + '#/home'); await p.waitForTimeout(1200);
  await p.evaluate(() => localStorage.removeItem('jarvis:cor'));
  ok(await gira(), 'gira ao abrir');
  await p.click('.jv-mat[data-materia="fisica"]'); await p.waitForTimeout(1200); await p.click('.topo .aba-home'); await p.waitForTimeout(1200);
  ok(await gira(), 'gira depois de ir na Física e voltar pelo Home');
  await p.goto(base + '#/C01'); await p.waitForTimeout(1200); await p.goBack(); await p.waitForTimeout(1200);
  ok(await gira(), 'gira depois de abrir um tema e voltar pelo botão voltar');
  const p2 = await b.newPage(); await require('./adm')(p2); await p2.goto('about:blank'); await p2.bringToFront(); await p.waitForTimeout(1500); await p.bringToFront(); await p.waitForTimeout(1200);
  /* Depois de voltar de outra aba, o navegador pode demorar a religar a animação (era a causa da falha "de vez em quando": a medida de 0,7 s às vezes
     caía antes do primeiro quadro). Mede-se por até 6 s, e logo abaixo o teste PROVA que continua acusando figura parada. */
  const giraAte = (pg, ms) => pg.evaluate(async (ms) => { const pega = () => { const e = document.querySelector('.jv-globo .jv-mer'), l = document.querySelector('.jv-globo .jv-lua'); return [+e.getAttribute('rx'), +l.getAttribute('cx')]; }; const a = pega(), t0 = Date.now(); while (Date.now() - t0 < ms) { await new Promise(r => setTimeout(r, 250)); const c = pega(); if (Math.abs(a[0] - c[0]) > 0.5 && Math.abs(a[1] - c[1]) > 0.5) return true; } return false; }, ms);
  ok(await giraAte(p, 6000), 'gira depois de trocar de aba do navegador e voltar (em até 6 s)');
  { const p3 = await b.newPage({ viewport: { width: 1280, height: 900 } }); await require('./adm')(p3); await p3.goto(base + '#/home'); await p3.bringToFront(); await p3.waitForTimeout(1200);
    const antes = await giraAte(p3, 6000); await p3.evaluate(() => { window.requestAnimationFrame = () => 0; }); await p3.waitForTimeout(400); const parada = await giraAte(p3, 6000);
    ok(antes && !parada, 'prova do teste: com a animação travada de propósito, a mesma medida de 6 s acusa (girando: ' + antes + '; travada: ' + parada + ')'); await p3.close(); await p2.close(); await p.bringToFront(); await p.waitForTimeout(600); }
  ok(await p.evaluate(() => !document.querySelector('.jv-cab p') && !document.body.textContent.includes('meu sistema de estudo')), 'sem o texto "meu sistema de estudo"');
  // seletor de cor aparece ao passar o mouse
  const vis0 = await p.evaluate(() => getComputedStyle(document.querySelector('.jv-cor')).visibility);
  await p.hover('.jv-cab h1'); await p.waitForTimeout(400);
  const vis1 = await p.evaluate(() => getComputedStyle(document.querySelector('.jv-cor')).visibility);
  ok(vis0 === 'hidden' && vis1 === 'visible', 'seletor escondido, aparece ao passar o mouse no Jarvis → ' + vis0 + ' → ' + vis1);
  await p.screenshot({ path: 'cor-aberto.png' });
  const cores = () => p.evaluate(() => { const st = (s) => getComputedStyle(document.querySelector(s)); return { titulo: st('.jv-cab h1').backgroundImage, mer: st('.jv-globo .jv-mer').stroke, anel: st('.jv-globo .jv-anel').stroke }; });
  const c0 = await cores();
  /* mexe no controle até o vermelho (0) e até o lilás (285) */
  await p.hover('.jv-cor input');
  await p.evaluate(() => { const i = document.querySelector('.jv-cor input'); i.value = 0; i.dispatchEvent(new Event('input', { bubbles: true })); });
  const cV = await cores();
  ok(cV.titulo !== c0.titulo && cV.mer !== c0.mer && cV.anel !== c0.anel && /rgb\(2[2-5]\d, \d{1,2}, /.test(cV.mer), 'cor vermelha: título e planeta mudam juntos → ' + cV.mer);
  ok(cV.titulo.includes(cV.mer.replace(/\)$/, '')) || cV.titulo.includes(cV.mer), 'o degradê do título usa as mesmas cores do planeta → ' + cV.titulo.slice(0, 60));
  await p.evaluate(() => { const i = document.querySelector('.jv-cor input'); i.value = 285; i.dispatchEvent(new Event('input', { bubbles: true })); });
  const cL = await cores(); await p.screenshot({ path: 'cor-lilas.png' });
  ok(cL.mer !== cV.mer, 'cor lilás no outro extremo → ' + cL.mer);
  // guarda e volta depois de recarregar
  await p.reload(); await p.waitForTimeout(1200);
  const cR = await cores(); ok(cR.mer === cL.mer && await p.evaluate(() => JSON.parse(localStorage.getItem('jarvis:cor')) === 285), 'a cor escolhida fica salva (jarvis:cor) depois de recarregar');
  // voltar à cor original
  await p.hover('.jv-cab h1'); await p.waitForTimeout(300); await p.click('.jv-cor button'); await p.waitForTimeout(200);
  const cO = await cores();
  ok(cO.titulo === c0.titulo && cO.mer === c0.mer && cO.anel === c0.anel && await p.evaluate(() => localStorage.getItem('jarvis:cor') === null), 'botão "voltar à cor original" volta ao degradê original');
  // celular: tocar no título abre o seletor
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true }); await require('./adm')(m); await m.goto(base + '#/home'); await m.waitForTimeout(1000);
  await m.tap('.jv-cab h1'); await m.waitForTimeout(300);
  ok(await m.evaluate(() => getComputedStyle(document.querySelector('.jv-cor')).visibility === 'visible'), 'no celular, tocar no Jarvis abre o seletor');
  await m.tap('.jv-ilu'); await m.waitForTimeout(300);
  ok(await m.evaluate(() => getComputedStyle(document.querySelector('.jv-cor')).visibility === 'hidden'), 'tocar fora fecha');
  console.log(res.filter(r => r[0]).length + ' de ' + res.length + ' ok'); process.exitCode = res.every((r) => r[0]) ? 0 : 1; /* β 3.7: falha vira código de erro */ res.forEach(r => console.log((r[0] ? 'ok     ' : 'FALHA  ') + r[1]));
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros JS');
  await b.close(); })();
