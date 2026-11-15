const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
const { chromium } = require('playwright');
const res = [];
const num = (t) => parseFloat(String(t).replace(/−/g, '-').replace(/\./g, '').replace(',', '.'));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('requestfailed', r => errs.push('falhou ' + r.url()));
  const vai = async (c) => { await p.goto(RAIZ + '#/' + c); await p.waitForTimeout(1200); };
  const le = (id, o, cl = [], espera = 250) => p.evaluate(async ([id, o, cl, espera]) => { cl.forEach(s => document.querySelector(`#${id} ${s}`).click()); for (const [k, v] of Object.entries(o)) { const i = document.querySelector(`#${id} input[data-c="${k}"]`); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); } await new Promise(r => setTimeout(r, espera)); return Object.fromEntries([...document.querySelectorAll(`#${id} .vis`)].map(v => [v.querySelector('small').textContent.trim(), v.querySelector('b').textContent.trim()])); }, [id, o, cl, espera]);
  const ac = (o, k) => o[Object.keys(o).find(x => x.toLowerCase().includes(k.toLowerCase()))];
  const perto = (a, b, t = 0.01) => Math.abs(a - b) <= t * Math.max(1e-12, Math.abs(b));
  const ok = (cond, msg) => res.push([cond, msg]);
  // N05
  await vai('N05');
  let u = await p.evaluate(() => [SIM.stokes1._u(0.01, 109.9, 1e-6), SIM.stokes1._u(3.6428e-3, 1, 1e-6), SIM.stokes1._u(0, 5, 1e-6)]);
  ok(perto(u[0], 0.5, 0.002) && perto(u[1], 0.01, 0.01) && perto(u[2], 1, 1e-6), 'N05 erfc: meia velocidade a 1 cm em 110 s; 1% em 3,64√(νt); u(0) = U → ' + u.map(x => x.toFixed(5)));
  await p.evaluate(() => SIM.stokes1._t(60)); let o = await le('lab-sto', { L: 40, ac: 1 });
  ok(perto(num(ac(o, 'espessura')), 3.64 * Math.sqrt(60), 0.005), 'N05 água, t = 60 s: camada de 1% = 28,2 mm → ' + ac(o, 'espessura'));
  // N06
  await vai('N06'); o = await le('lab-can', { U: 0, G: 10, h: 2 });
  ok(perto(num(ac(o, 'vazão por metro')), 6.67, 0.01) && /mm²/.test(ac(o, 'vazão por metro')) && perto(num(ac(o, 'média')), 3.33, 0.01), 'N06 canal h = 2 mm, G = 10: Q/b = 6,67e-6 m²/s (0,0667 cm²/s), média 3,33 mm/s → ' + JSON.stringify(o));
  o = await le('lab-can', { U: 10, G: -15, h: 2 }); ok(Math.abs(num(ac(o, 'vazão por metro'))) < 1e-3 && ac(o, 'voltando') === 'sim', 'N06 G = −6μU/h²: vazão zero e fluido voltando → ' + ac(o, 'vazão por metro') + ', ' + ac(o, 'voltando'));
  o = await le('lab-can', { U: 10, G: 0, h: 2 }); ok(perto(num(ac(o, 'baixo')), 5, 0.01) && perto(num(ac(o, 'cima')), 5, 0.01), 'N06 Couette: τ = μU/h = 5 mPa nas duas placas → ' + ac(o, 'baixo') + ' / ' + ac(o, 'cima'));
  o = await le('lab-can', { Gt: 20, R: 1 }, ['[data-m="tubo"]']);
  ok(perto(num(ac(o, 'centro')), 5, 0.01) && perto(num(ac(o, 'média')), 2.5, 0.01) && perto(num(ac(o, 'parede')), 10, 0.01) && /7,85/.test(ac(o, 'vazão')), 'N06 cano R = 1 mm, G = 20: u_máx 5 mm/s, média 2,5, τ 10 mPa, Q 7,85e-3 mL/s → ' + JSON.stringify(o));
  o = await le('lab-can', { R: 0.5 }); ok(/4,909/.test(ac(o, 'vazão')), 'N06 metade do raio: Q/16 = 4,91e-4 mL/s → ' + ac(o, 'vazão'));
  // N07
  await vai('N07'); o = await le('lab-rey', { v: 0.05, D: 2 });
  ok(perto(num(ac(o, 're =')), 1000, 0.001) && ac(o, 'regime') === 'laminar' && perto(num(ac(o, 'fator')), 0.064, 0.001), 'N07 água 2 cm, 5 cm/s: Re 1000, laminar, f = 0,064 → ' + JSON.stringify(o));
  o = await le('lab-rey', { v: 0.15, D: 2 }); ok(ac(o, 'regime') === 'transição', 'N07 Re = 3000: transição → ' + ac(o, 'regime'));
  o = await le('lab-rey', { v: 2, D: 5 }); ok(/1,00 × 10⁵/.test(ac(o, 're =')) && ac(o, 'regime') === 'turbulento' && perto(num(ac(o, 'fator')), 0.0178, 0.003), 'N07 Re = 1e5: turbulento, Blasius 0,0178 → ' + JSON.stringify(o));
  // S02 imagens
  await vai('S02'); const im = await p.evaluate(() => [...document.querySelectorAll('img.scan')].map(i => [i.getAttribute('src'), i.naturalWidth]));
  ok(im.length === 13 && im.every(x => x[1] > 100), 'S02: 13 figuras do IME carregadas → ' + im.filter(x => x[1] <= 100).map(x => x[0]).join(',') + ' (' + im.length + ')');
  const nex = await p.evaluate(() => [...document.querySelectorAll('.ex .num')].map(x => x.textContent));
  ok(nex.length === 15 && nex[0] === 'S02.16' && nex[14] === 'S02.30', 'S02: questões 16 a 30 → ' + nex[0] + '…' + nex[nex.length - 1] + ' (' + nex.length + ')');
  for (const [c, n] of [['SC01', 20], ['SC02', 20]]) { await vai(c); const k = await p.evaluate(() => document.querySelectorAll('.ex').length); ok(k === n, `${c}: ${n} questões → ${k}`); }
  await vai('calculo'); const mods = await p.evaluate(() => document.body.innerText.includes('Simulados de Cálculo')); ok(mods, 'página Cálculo mostra o módulo "Simulados de Cálculo"');
  console.log(res.filter(r => r[0]).length + ' de ' + res.length + ' ok'); process.exitCode = res.every((r) => r[0]) ? 0 : 1; /* β 3.7: falha vira código de erro */
  res.forEach(r => console.log((r[0] ? 'ok     ' : 'FALHA  ') + r[1]));
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros JS');
  await b.close();
})();
