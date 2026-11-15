/* Teste rápido das páginas de experimento: fórmulas, erros de JS, laboratório montado e animando (o SVG/canvas muda com o tempo).
   uso: node tests/texp.js EP11 EP12 ...   (sem argumentos: todos os EP do catálogo) */
const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(RAIZ + '#/experimentos'); await p.waitForTimeout(600);
  let cods = process.argv.slice(2);
  if (!cods.length) cods = await p.evaluate(() => window.CATALOGO.filter((m) => m.area === 'exp').flatMap((m) => m.temas.filter((t) => t[3]).map((t) => t[0])));
  let falhas = 0;
  for (const c of cods) {
    await p.goto(RAIZ + '#/' + c); await p.waitForTimeout(1500);
    const foto = () => p.evaluate(() => { const l = document.querySelector('.lab'); if (!l) return ''; const s = l.querySelector('svg, canvas'); if (!s) return ''; return s.tagName === 'CANVAS' ? s.toDataURL().slice(-200) : s.innerHTML; });
    const a = await foto(); await p.waitForTimeout(700); const z = await foto();
    const r = await p.evaluate(() => ({ katex: document.querySelectorAll('.katex-error').length, lab: document.querySelectorAll('.lab').length, vis: document.querySelectorAll('.lab .vis').length, texto: document.querySelector('#pagina').innerText.length }));
    const ok = r.katex === 0 && r.lab > 0 && !!a && r.texto > 800; /* "anima" é informativo: jogos como o EP04 só se mexem depois de um clique */
    if (!ok) falhas++;
    console.log((ok ? 'ok    ' : 'FALHA ') + c, JSON.stringify({ ...r, anima: a !== z }));
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros JS');
  console.log('falhas: ' + falhas);
  await b.close();
})();
