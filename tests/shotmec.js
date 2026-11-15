const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
const { chromium } = require('playwright');
const [cod, ...sels] = process.argv.slice(2);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); await require('./adm')(p);
  await p.goto(RAIZ + '#/' + cod); await p.waitForTimeout(1800);
  let i = 0;
  for (const s of sels) { const [sel, idx] = s.split('@'); const el = (await p.$$(sel))[+idx || 0]; if (!el) { console.log('não achei', s); continue; } await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(700); await el.screenshot({ path: require("path").join(__dirname, "capturas", `m-${cod}-${i++}.png`) }); }
  await b.close(); })();
