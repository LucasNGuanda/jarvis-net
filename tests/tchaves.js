const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
const { chromium } = require('playwright');
const cods = process.argv.slice(2);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); await require('./adm')(p);
  for (const c of cods) {
    await p.goto(RAIZ + '#/' + c); await p.waitForTimeout(1400);
    const achados = new Set();
    const coleta = async () => { const t = await p.evaluate(() => { const el = document.querySelector('#pagina').cloneNode(true); el.querySelectorAll('.katex').forEach((k) => k.remove()); el.querySelectorAll('.rev-painel, .passo').forEach((x) => { x.hidden = false; }); return el.textContent; }); const re = /.{0,25}(\{,\}|\\frac|\\cdot|\$|undefined|NaN).{0,25}/g; let m; while ((m = re.exec(t))) achados.add(m[0].replace(/\s+/g, ' ')); };
    await coleta();
    const n = await p.evaluate(() => document.querySelectorAll('.exemplo .escolha .bt').length);
    for (let i = 0; i < n; i++) for (let k = 0; k < 5; k++) { await p.evaluate((i) => { document.querySelectorAll('.exemplo .escolha .bt')[i].click(); const e = document.querySelector('.exemplo'); const par = e.querySelector('[data-a=par]'); if (par) par.click(); const tudo = e.querySelector('[data-a=tudo]'); if (tudo) tudo.click(); }, i); await p.waitForTimeout(60); await coleta(); }
    console.log(c, achados.size ? [...achados].slice(0, 10).join('  ||  ') : 'ok');
  }
  await b.close(); })();
