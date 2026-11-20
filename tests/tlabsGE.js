// Geometria (módulo GE da Matemática): núcleo, laboratórios e gabaritos. Rodar: node tests/tlabsGE.js [códigos]
// O teste de cada tema fica em tests/ge/<COD>.js e exporta async (p, ok) => { ... }, chamado com a página do tema já aberta.
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1280, height: 900 } }), erros = []; let falhas = 0;
  await require('./adm')(p); p.on('pageerror', (e) => erros.push(e.message));
  const ok = (c, m) => { console.log((c ? 'ok ' : 'FALHA ') + m); if (!c) falhas++; };
  const pedidos = process.argv.slice(2), dir = path.resolve(__dirname, 'ge');
  const temas = fs.readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => f.replace('.js', '')).filter((c) => !pedidos.length || pedidos.includes(c)).sort();
  const abre = async (cod) => { await p.goto('file://' + path.resolve(__dirname, '..', 'index.html') + '#/matematica/' + cod); await p.waitForSelector('.ex', { timeout: 20000 }); await p.waitForTimeout(500); };
  for (const cod of temas) { await abre(cod); await require(path.join(dir, cod + '.js'))(p, ok);
    // gabaritos: em todo exercício de alternativas, clicar na letra do gabarito dá "certo"; nenhuma alternativa repetida
    for (let rod = 0; rod < 3; rod++) { await p.reload(); await p.waitForSelector('.ex', { timeout: 20000 }); await p.waitForTimeout(400);
      const g = await p.evaluate(() => { const o = { n: 0, ruins: [] }; document.querySelectorAll('.ex').forEach((e) => { const bts = [...e.querySelectorAll('.alts .alt')]; if (!bts.length) return; o.n++; const d = e._d || {}, txs = bts.map((x) => x.textContent.trim()); if (new Set(txs).size !== txs.length) o.ruins.push((e.id || '?') + ' alternativas repetidas'); const bt = bts.find((x) => x.dataset.l === d.certa); if (!bt) return o.ruins.push((e.id || '?') + ' sem letra ' + d.certa); bt.click(); if (!bt.classList.contains('certa')) o.ruins.push((e.id || '?') + ' não aceitou'); }); return o; });
      if (rod === 0 || g.ruins.length) ok(g.ruins.length === 0, cod + ': os ' + g.n + ' exercícios de alternativas aceitam a letra do gabarito e não têm alternativa repetida' + (rod ? ' (recarga ' + rod + ')' : '') + (g.ruins.length ? ' → ' + g.ruins.join('; ') : '')); }
    const k = await p.evaluate(() => document.querySelectorAll('.katex-error').length); ok(k === 0, cod + ': nenhuma fórmula quebrada'); }
  ok(erros.length === 0, 'nenhum erro de JavaScript' + (erros.length ? ': ' + erros.join(' | ') : ''));
  await b.close(); console.log(falhas ? `\n${falhas} FALHA(S)` : '\ntudo certo'); process.exit(falhas ? 1 : 0);
})();
