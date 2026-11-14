const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
const { chromium } = require('playwright');
const cods = process.argv.slice(2);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  for (const c of cods) {
    await p.goto(RAIZ + '#/' + c); await p.waitForTimeout(1600);
    const r = await p.evaluate(() => ({ katex: document.querySelectorAll('.katex-error').length, ex: document.querySelectorAll('.ex').length, auto: document.querySelectorAll('.ex .ex-num, .ex .alts.clicaveis').length, figs: document.querySelectorAll('.ex .fig svg, .exemplo svg').length, lab: !!document.querySelector('.lab .vis'), chefao: !!document.querySelector('.chefao'), casos: document.querySelectorAll('.exemplo .escolha .bt').length, caixas: [...new Set([...document.querySelectorAll('.caixa')].map(x => x.className.replace('caixa ', '')))].join(','), demos: document.querySelectorAll('.caixa.demo').length, texto: document.querySelector('#pagina').innerText.length, folha: !!document.querySelector('#formulas') }));
    /* corrige: responde a 1ª numérica com a resposta certa (lida do gabarito escondido) e a 1ª alternativa clicável com uma letra errada */
    const t = await p.evaluate(() => {
      const out = {};
      const num = document.querySelector('.ex .ex-num'); if (num) { const ex = num.closest('.ex'); const resp = ex.querySelector('.rev-painel.resp').textContent; const m = resp.match(/Resposta:\s*([−-]?[\d.,]+)/); if (m) { num.querySelector('input').value = m[1]; num.querySelector('button').click(); out.num = ex.querySelector('.ex-fb').textContent; } }
      const alt = document.querySelector('.ex .alts.clicaveis'); if (alt) { const bts = alt.querySelectorAll('.alt'); bts[0].click(); const ex = alt.closest('.ex'); out.alt = ex.querySelector('.ex-fb').textContent; }
      return out;
    });
    console.log(c, JSON.stringify(r), JSON.stringify(t));
  }
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros JS');
  await b.close(); })();
