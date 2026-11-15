/* Testes dos adesivos da tela inicial (β 3.6). Uso: node tests/tadesivos.js
   Confere: catálogo (28, 5 categorias, ids únicos, SVG sem animação), engrenagem, painel, arrastar (válido e proibido),
   girar, redimensionar, remover, limpar tudo, pointer-events fora do modo de edição, empurrão ao mudar a janela,
   persistência e exportação. Capturas em tests/capturas/ad-*.png */
const { chromium } = require('playwright');
const URL = 'file:///home/user/site-fisica/index.html#/home';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  const falhas = []; const ok = (cond, msg) => { if (!cond) falhas.push(msg); console.log((cond ? 'ok   ' : 'FALHA ') + msg); };
  await p.goto(URL); await p.evaluate(() => localStorage.removeItem('jarvis:adesivos')); await p.reload(); await p.waitForTimeout(900);
  const cat = await p.evaluate(() => { const A = window.ADESIVOS, ids = A.lista.map((a) => a.id); const svgs = A.lista.map((a) => A.svg(a)); return { n: A.lista.length, cats: A.categorias.length, unicos: new Set(ids).size === ids.length, porCat: A.categorias.map((k) => A.lista.filter((a) => a.cat === k.id).length), anim: svgs.filter((s) => /<animate|@keyframes|animation/.test(s)).length, vazios: A.lista.filter((a) => A.svg(a).length < 120).map((a) => a.id), trava: A.lista.every((a) => 'trava' in a && a.trava === null) }; });
  ok(cat.n === 28, 'catálogo com 28 adesivos (' + cat.n + ')'); ok(cat.cats === 6 && cat.porCat.join() === '6,5,6,5,3,3', 'categorias 6/5/6/5/3/3 (com Cientistas) (' + cat.porCat.join('/') + ')');
  ok(cat.unicos, 'ids únicos'); ok(cat.anim === 0, 'nenhuma animação nos SVG'); ok(!cat.vazios.length, 'nenhum desenho vazio ' + cat.vazios.join()); ok(cat.trava, 'campo trava preparado (null) em todos');
  ok(await p.$('.jv-engrenagem') !== null, 'engrenagem existe'); ok(await p.$eval('.jv-pergunta input', (i) => i.disabled), 'campo do Jarvis continua "em breve" (desativado)');
  await p.click('.jv-engrenagem'); await p.waitForTimeout(200);
  ok(await p.$('.jv-painel') !== null, 'painel abre'); ok((await p.$$('.jv-painel-ad')).length === 28, 'painel mostra os 28');
  await p.screenshot({ path: 'tests/capturas/ad-painel.png' });
  /* arrastar a maçã para um lugar livre (à esquerda do globo) */
  const arrasta = async (de, para) => { await p.mouse.move(de.x, de.y); await p.mouse.down(); await p.mouse.move(de.x + 10, de.y + 10, { steps: 3 }); await p.mouse.move(para.x, para.y, { steps: 12 }); await p.mouse.up(); await p.waitForTimeout(100); };
  const centro = async (sel) => { const r = await (await p.$(sel)).boundingBox(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
  await arrasta(await centro('.jv-painel-ad[data-id=maca]'), { x: 230, y: 420 });
  let n = await p.evaluate(() => JARVIS._ad.itens().length); ok(n === 1, 'arrastar para área livre cria o adesivo');
  /* mostrar zonas durante o arraste: captura no meio do movimento */
  const c1 = await centro('.jv-painel-ad[data-id=pendulo]'); await p.mouse.move(c1.x, c1.y); await p.mouse.down(); await p.mouse.move(c1.x - 30, c1.y, { steps: 3 }); await p.mouse.move(640, 130, { steps: 10 });
  ok((await p.$$('.jv-proibida')).length > 4, 'zonas proibidas aparecem durante o arraste'); await p.screenshot({ path: 'tests/capturas/ad-zonas.png' });
  await p.mouse.move(640, 300, { steps: 15 }); await p.mouse.move(640, 135, { steps: 15 }); await p.mouse.up(); await p.waitForTimeout(100); /* solta em cima de um botão de matéria */
  const sobre = await p.evaluate(() => { const Z = JARVIS._ad.zonas(), { W, H } = JARVIS._ad.dim(); return JARVIS._ad.itens().map((it) => JARVIS.adGeo.valida({ cx: W / 2 + it.x, cy: it.y, s: it.s, r: it.r }, Z, W, H)); });
  ok(sobre.every(Boolean), 'soltar em área proibida volta para a última posição válida (todos válidos: ' + sobre.join() + ')');
  /* novo adesivo solto direto em cima do campo, sem passar por área válida, não é criado */
  n = await p.evaluate(() => JARVIS._ad.itens().length);
  const c2 = await centro('.jv-painel-ad[data-id=pi]'), campo = await centro('.jv-pergunta'); await arrasta(c2, campo);
  const n2 = await p.evaluate(() => JARVIS._ad.itens().length), validos2 = await p.evaluate(() => { const Z = JARVIS._ad.zonas(), { W, H } = JARVIS._ad.dim(); return JARVIS._ad.itens().every((it) => JARVIS.adGeo.valida({ cx: W / 2 + it.x, cy: it.y, s: it.s, r: it.r }, Z, W, H)); });
  ok(validos2, 'adesivo solto no campo do Jarvis não fica em cima dele (' + n + ' → ' + n2 + ')');
  /* clicar num adesivo do painel (sem arrastar) põe num lugar livre */
  await p.click('.jv-painel-ad[data-id=buraconegro]'); await p.waitForTimeout(100);
  ok(await p.evaluate(() => JARVIS._ad.itens().some((i) => i.id === 'buraconegro')), 'clique no painel põe o adesivo num lugar livre');
  /* girar e redimensionar o selecionado (buraco negro) */
  const it0 = await p.evaluate(() => JARVIS._ad.itens().find((i) => i.id === 'buraconegro'));
  let h = await centro('.jv-ad.sel .giro'), cc = await centro('.jv-ad.sel'); await arrasta(h, { x: cc.x + 80, y: cc.y });
  const it1 = await p.evaluate(() => JARVIS._ad.itens().find((i) => i.id === 'buraconegro')); ok(Math.abs(it1.r - 90) <= 3 || it1.r === it0.r, 'girar: ' + it0.r + '° → ' + it1.r + '°');
  h = await centro('.jv-ad.sel .tam'); cc = await centro('.jv-ad.sel'); await arrasta(h, { x: cc.x + 30, y: cc.y + 30 });
  const it2 = await p.evaluate(() => JARVIS._ad.itens().find((i) => i.id === 'buraconegro')); ok(it2.s < it1.s, 'redimensionar: ' + it1.s + ' → ' + it2.s + ' px');
  /* todos os 28 na tela, para a captura */
  for (const id of await p.evaluate(() => ADESIVOS.lista.map((a) => a.id))) { if (!(await p.evaluate((i) => JARVIS._ad.itens().some((x) => x.id === i), id))) { await p.click(`.jv-painel-ad[data-id=${id}]`); } }
  await p.evaluate(() => JARVIS._ad.itens().forEach((it) => (it.s = 70))); await p.evaluate(() => JARVIS._ad.desenha());
  const nTodos = await p.evaluate(() => JARVIS._ad.itens().length); ok(nTodos >= 28, 'cabem os 28 (' + nTodos + ')');
  await p.screenshot({ path: 'tests/capturas/ad-editando.png' });
  /* remover pelo × */
  const antes = nTodos; await p.click('.jv-ad.sel .x'); ok((await p.evaluate(() => JARVIS._ad.itens().length)) === antes - 1, 'remover pelo ×');
  /* sair do modo de edição: camada atrás e sem eventos */
  await p.click('[data-p=fim]'); await p.waitForTimeout(100);
  const pe = await p.evaluate(() => { const c = document.querySelector('.jv-adesivos'), a = document.querySelector('.jv-ad'); return { cam: getComputedStyle(c).pointerEvents, ad: a ? getComputedStyle(a).pointerEvents : 'none', z: getComputedStyle(c).zIndex, painel: !!document.querySelector('.jv-painel') }; });
  ok(pe.cam === 'none' && pe.ad === 'none' && pe.z === '0' && !pe.painel, 'fora da edição: pointer-events none, camada atrás, painel fechado ' + JSON.stringify(pe));
  /* o botão Física continua clicável mesmo com adesivos perto */
  const fis = await centro('a.jv-mat'); const alvo = await p.evaluate(([x, y]) => document.elementFromPoint(x, y).closest('a.jv-mat') !== null, [fis.x, fis.y]); ok(alvo, 'botão Física continua recebendo o clique');
  /* nenhum adesivo em cima de algo clicável */
  const sobrepostos = await p.evaluate(() => { const Z = JARVIS._ad.zonas(); return [...document.querySelectorAll('.jv-ad')].filter((d) => { const r = d.getBoundingClientRect(), L = document.querySelector('.jv-adesivos').getBoundingClientRect(), cx = r.left + r.width / 2 - L.left, cy = r.top + r.height / 2 - L.top, it = JARVIS._ad.itens().find((i) => i.u === d.dataset.u); return !JARVIS.adGeo.valida({ cx, cy, s: it.s, r: it.r }, Z, L.width, L.height); }).length; });
  ok(sobrepostos === 0, 'nenhum adesivo em cima de algo clicável (' + sobrepostos + ')');
  await p.screenshot({ path: 'tests/capturas/ad-final.png' });
  /* persistência */
  await p.reload(); await p.waitForTimeout(800); ok((await p.$$('.jv-ad')).length === antes - 1, 'salvo no localStorage (recarregar mantém ' + (antes - 1) + ')');
  /* janela menor: empurrados para área válida, sem mudar o que está salvo */
  const salvoAntes = await p.evaluate(() => localStorage.getItem('jarvis:adesivos'));
  await p.setViewportSize({ width: 900, height: 760 }); await p.waitForTimeout(400);
  const sob2 = await p.evaluate(() => { const Z = JARVIS._ad.zonas(), L = document.querySelector('.jv-adesivos').getBoundingClientRect(); return [...document.querySelectorAll('.jv-ad')].filter((d) => { const r = d.getBoundingClientRect(), it = JARVIS._ad.itens().find((i) => i.u === d.dataset.u); return !JARVIS.adGeo.valida({ cx: r.left + r.width / 2 - L.left, cy: r.top + r.height / 2 - L.top, s: it.s, r: it.r }, Z, L.width, L.height); }).length; });
  ok(sob2 === 0, 'janela de 900 px: nenhum adesivo em cima de botão (' + sob2 + ')');
  ok(salvoAntes === (await p.evaluate(() => localStorage.getItem('jarvis:adesivos'))), 'empurrão não altera o que está salvo');
  await p.screenshot({ path: 'tests/capturas/ad-900.png' }); await p.setViewportSize({ width: 1280, height: 800 });
  /* limpar tudo */
  await p.click('.jv-engrenagem'); p.once('dialog', (d) => d.accept()); await p.click('[data-p=limpar]'); await p.waitForTimeout(100);
  ok((await p.evaluate(() => JARVIS._ad.itens().length)) === 0, 'limpar tudo'); await p.keyboard.press('Escape'); ok(!(await p.$('.jv-painel')), 'Esc fecha o painel');
  /* exportar inclui jarvis:adesivos */
  await p.evaluate(() => localStorage.setItem('jarvis:adesivos', JSON.stringify({ v: 1, itens: [{ u: 't', id: 'pi', x: -300, y: 400, s: 80, r: 10 }] })));
  await p.goto('file:///home/user/site-fisica/index.html#/inicio'); await p.waitForTimeout(500);
  const [dl] = await Promise.all([p.waitForEvent('download'), p.evaluate(() => document.getElementById('bt-exp').click())]);
  const txt = require('fs').readFileSync(await dl.path(), 'utf8'); ok(/jarvis:adesivos/.test(txt), 'exportar progresso inclui os adesivos');
  await p.evaluate(() => localStorage.removeItem('jarvis:adesivos'));
  ok(!errs.length, 'sem erros de JavaScript ' + errs.join(' | '));
  console.log(falhas.length ? falhas.length + ' FALHA(S)' : 'tudo ok'); await b.close(); process.exit(falhas.length ? 1 : 0);
})();
