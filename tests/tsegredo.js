/* Teste da surpresa da página inicial dos Experimentos (não documentada no site de propósito). */
const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); await require('./adm')(p);
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(RAIZ + '#/experimentos'); await p.waitForTimeout(800);
  await p.evaluate(() => localStorage.removeItem('fisica:segredo:x'));
  await p.reload(); await p.waitForTimeout(800);
  const conf = (ok, txt) => console.log((ok ? 'ok     ' : 'FALHA  ') + txt);
  /* passar o mouse longe da bolinha não faz nada */
  await p.mouse.move(100, 700); await p.waitForTimeout(300);
  conf(await p.evaluate(() => !document.querySelector('.anim .x').innerHTML), 'mouse longe: nada acontece');
  /* perseguir a bolinha verde */
  let pegou = false;
  for (let k = 0; k < 400 && !pegou; k++) {
    const c = await p.evaluate(() => { const bs = document.querySelectorAll('.anim .p circle'); const r = bs[1] && bs[1].getBoundingClientRect(); return r ? [r.x + r.width / 2, r.y + r.height / 2] : null; });
    if (c) await p.mouse.move(c[0], c[1]);
    pegou = await p.evaluate(() => !!document.querySelector('.anim .x').innerHTML);
  }
  conf(pegou, 'encostar na bolinha verde destrava');
  conf(await p.evaluate(() => localStorage.getItem('fisica:segredo:x') === '1'), 'guardou no localStorage');
  await p.waitForTimeout(1300); await (await p.$('.anim')).screenshot({ path: require('path').join(__dirname, 'capturas', 'segredo-1.png') });
  await p.waitForTimeout(3000); await (await p.$('.anim')).screenshot({ path: require('path').join(__dirname, 'capturas', 'segredo-2.png') });
  conf(await p.evaluate(() => !!document.querySelector('.anim .gx-gato')), 'o gato aparece');
  const g = await p.evaluate(() => { const r = document.querySelector('.anim .gx-gato').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
  await p.mouse.click(g[0], g[1]); await p.waitForTimeout(800);
  conf(await p.evaluate(() => location.hash === '#/EP17'), 'clicar no gato leva ao EP17');
  /* volta e confere o selinho e o retorno ao normal */
  await p.goto(RAIZ + '#/experimentos'); await p.waitForTimeout(800);
  conf(await p.evaluate(() => document.querySelector('.anim .p').innerHTML.includes('M206 -212')), 'selinho discreto aparece depois de descoberto');
  conf(await p.evaluate(() => !/buraco|segredo|easter/i.test(document.body.innerText)), 'nenhum texto da página revela a surpresa');
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros JS');
  await b.close();
})();
