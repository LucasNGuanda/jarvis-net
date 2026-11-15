/* Captura momentos das animações de liberação (β 4.1+). Uso, da raiz do repositório:
     node tools/captura-anim.js <adm|tester|fisica|matematica|quimica|idiomas|config|alemao|sanscrito|jarvis> 0.5,1.3,2.0
   Grava tests/capturas/anim-<tipo>-<t>.png (t em segundos desde o clique em "Liberar"). Começa sempre como visitante.
   No fim imprime: rota | versão | se a animação ainda está na tela | aviso final. */
const { chromium } = require('playwright'); const path = require('path');
const RAIZ = path.resolve(__dirname, '..'), URL = 'file://' + path.join(RAIZ, 'index.html'), SAI = path.join(RAIZ, 'tests', 'capturas');
const COD = { adm: ['adm', '55_admfreee_will'], tester: ['tester', 'beta8976_@freewill_choise'], fisica: ['avulso', 'frewill_fisic98025_p'], matematica: ['avulso', 'free-willp-mat98017'], quimica: ['avulso', 'free_quimic'], idiomas: ['avulso', 'let-me_slavic98716'], config: ['avulso', 'give-meskinn'], alemao: ['avulso', 'ich-will_deutsch4471'], sanscrito: ['avulso', 'om_samskrta8840'], jarvis: ['avulso', 'talk-to_jarvis_freewill01'] };
const [tipo, momentos] = [process.argv[2], (process.argv[3] || '1,2,3').split(',').map(Number)];
if (!COD[tipo]) { console.log('tipo desconhecido; use: ' + Object.keys(COD).join(', ')); process.exit(1); }
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(URL + '#/home'); await p.evaluate(() => Object.keys(localStorage).forEach((k) => localStorage.removeItem(k))); await p.goto(URL + '#/codigos'); await p.waitForTimeout(700);
  const [linha, codigo] = COD[tipo]; await p.fill(`.cod-linha[data-linha=${linha}] input`, codigo); const t0 = Date.now(); await p.click(`.cod-linha[data-linha=${linha}] button`);
  for (const m of momentos) { const falta = m * 1000 - (Date.now() - t0); if (falta > 0) await p.waitForTimeout(falta); await p.screenshot({ path: path.join(SAI, `anim-${tipo}-${m}.png`) }); }
  await p.waitForTimeout(1500); console.log(tipo, await p.evaluate(() => [location.hash, document.querySelector('.jv-ver')?.textContent, !!document.querySelector('.anim-acesso'), document.querySelector('.toast-acesso')?.textContent].join(' | ')), 'erros:', errs.join('|') || 'nenhum');
  await b.close(); })();
