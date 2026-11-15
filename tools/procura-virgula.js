/* Varre TODAS as páginas de tema escritas, já montadas (com laboratórios), procurando texto fora das fórmulas com {,}, $ ou comando do
   TeX solto (\frac, \cdot…): sinal de F.n usado em texto comum, de "R$" abrindo fórmula ou de "<" colado em letra dentro de $…$.
   Complementa o tests/tchaves.js (que percorre as VARIAÇÕES sorteadas dos exercícios). Uso: node tools/procura-virgula.js (~3 min). */
const { chromium } = require('playwright'); const path = require('path'); const URL = 'file://' + path.join(path.resolve(__dirname, '..'), 'index.html');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); await require('../tests/adm')(p);
  await p.goto(URL + '#/home'); await p.waitForTimeout(500);
  const rotas = await p.evaluate(() => { const r = []; for (const m of CATALOGO) for (const t of m.temas) if (t[3]) r.push(F.href(t[0], m)); return r; });
  const achados = [];
  for (const h of rotas) { await p.goto(URL + '' + h); await p.waitForTimeout(h.includes('S0') ? 400 : 900);
    const r = await p.evaluate(() => { const out = []; const w = document.createTreeWalker(document.getElementById('pagina'), NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) { if (n.parentElement.closest('.katex, script, style')) continue; const t = n.textContent; let i = t.search(/\{,\}|\$|\\(frac|cdot|sqrt|times|approx|sum|int)\b/); if (i >= 0) out.push((n.parentElement.closest('svg') ? '[figura] ' : '') + t.slice(Math.max(0, i - 40), i + 30).replace(/\s+/g, ' ')); }
      return out; });
    if (r.length) achados.push([h, r]); }
  console.log('páginas varridas:', rotas.length); achados.forEach(([h, r]) => console.log(h, '→', r.length, '|', r.slice(0, 4).join(' ‖ ')));
  if (!achados.length) console.log('nenhum {,}, $ ou comando TeX solto fora das fórmulas'); await b.close(); })();
