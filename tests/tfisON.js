const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
const { chromium } = require('playwright');
const res = [];
const num = (t) => parseFloat(String(t).replace(/−/g, '-').replace(/\./g, '').replace(',', '.'));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const vai = async (c) => { await p.goto(RAIZ + '#/' + c); await p.waitForTimeout(1200); };
  const le = (id, o, cl = [], espera = 200) => p.evaluate(async ([id, o, cl, espera]) => { cl.forEach(s => document.querySelector(`#${id} ${s}`).click()); for (const [k, v] of Object.entries(o)) { const i = document.querySelector(`#${id} input[data-c="${k}"]`); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); } await new Promise(r => setTimeout(r, espera)); return Object.fromEntries([...document.querySelectorAll(`#${id} .vis`)].map(v => [v.querySelector('small').textContent.trim(), v.querySelector('b').textContent.trim()])); }, [id, o, cl, espera]);
  const ac = (o, k) => o[Object.keys(o).find(x => x.toLowerCase().includes(k.toLowerCase()))];
  const perto = (a, b, t = 0.01) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const ok = (cond, msg) => res.push([cond, msg]);
  // O01
  await vai('O01'); let o = await le('lab-oc', { A: 5, l: 2, f: 0.5 });
  ok(perto(num(ac(o, 'velocidade v')), 1) && perto(num(ac(o, 'período')), 2) && perto(num(ac(o, 'número de onda')), Math.PI) && perto(num(ac(o, 'máx')), 0.05 * Math.PI, 0.02), 'O01 λ = 2, f = 0,5: v = 1, T = 2, k = π, Aω = 0,157 → ' + JSON.stringify(o));
  // O02
  await vai('O02'); o = await le('lab-int', { d: 6, l: 2.7 }); ok(num(ac(o, 'linhas nodais')) === 4, 'O02 d = 6, λ = 2,7: 4 linhas nodais → ' + ac(o, 'linhas nodais'));
  o = await le('lab-int', { d: 6, l: 2 }); ok(num(ac(o, 'linhas nodais')) === 6, 'O02 d = 6, λ = 2: 6 linhas nodais → ' + ac(o, 'linhas nodais'));
  // O03
  await vai('O03'); o = await le('lab-est', { n: 1, L: 0.65, T: 123, mu: 6 });
  const v = Math.sqrt(123 / 0.006); ok(perto(num(ac(o, 'velocidade')), v, 0.002) && perto(num(ac(o, 'frequência')), v / 1.3, 0.002), `O03 corda: v = ${v.toFixed(1)}, f₁ = ${(v / 1.3).toFixed(1)} → ` + JSON.stringify(o));
  o = await le('lab-est', { n: 3 }); ok(perto(num(ac(o, 'frequência')), 3 * v / 1.3, 0.002), 'O03 3º harmônico = 3 f₁ → ' + ac(o, 'frequência'));
  o = await le('lab-est', { n: 1, L: 0.6 }, ['[data-m="aberto"]']); ok(perto(num(ac(o, 'frequência')), 343 / 1.2, 0.002), 'O03 tubo aberto 0,6 m: 285,8 Hz → ' + ac(o, 'frequência'));
  o = await le('lab-est', { n: 2, L: 0.6 }, ['[data-m="fechado"]']); ok(perto(num(ac(o, 'frequência')), 3 * 343 / 2.4, 0.002) && /3º/.test(ac(o, 'harmônico')), 'O03 tubo fechado, 2º modo = 3º harmônico: 428,75 Hz → ' + ac(o, 'frequência'));
  // O04
  await vai('O04'); o = await le('lab-dop', { u: 0.1, f: 700 });
  ok(perto(num(ac(o, 'frente')), 700 / 0.9, 0.002) && perto(num(ac(o, 'atrás')), 700 / 1.1, 0.002), 'O04 vₛ = 0,1v: 777,8 e 636,4 Hz → ' + ac(o, 'frente') + ' / ' + ac(o, 'atrás'));
  o = await le('lab-dop', { u: 2 }); ok(perto(num(ac(o, 'cone')), 30, 0.002), 'O04 Mach 2: cone de 30° → ' + ac(o, 'cone'));
  // N01
  await vai('N01'); let a = await p.evaluate(() => SIM.euleriano._acel(1, 1, 0)); ok(perto(a[0], 1, 1e-6) && perto(a[1], 1, 1e-6), 'N01 estagnação (k = 1) em (1,1): a = (1, 1) → ' + a.map(x => x.toFixed(6)));
  await p.evaluate(() => document.querySelector('#lab-eul [data-k="bocal"]').click()); a = await p.evaluate(() => SIM.euleriano._acel(0, 0, 0)); ok(perto(a[0], 1.2 * 0.3, 1e-6) && Math.abs(a[1]) < 1e-9, 'N01 bocal em (0,0): a = (0,36; 0) → ' + a.map(x => x.toFixed(6)));
  await p.evaluate(() => document.querySelector('#lab-eul [data-k="giro"]').click()); a = await p.evaluate(() => SIM.euleriano._acel(0.5, 0.3, 0)); ok(perto(a[0], -0.5, 1e-6) && perto(a[1], -0.3, 1e-6), 'N01 rotação: a = −ω²r → ' + a.map(x => x.toFixed(6)));
  // N02
  await vai('N02'); o = await le('lab-boc', { d1: 2, d2: 0.5, v1: 1 }, [], 4500);
  ok(perto(num(ac(o, 'v₂')), 16, 0.002) && perto(num(ac(o, 'vazão')), 0.314, 0.01), 'N02 2 cm → 0,5 cm: v₂ = 16, Q = 0,314 L/s → ' + JSON.stringify(o));
  const tx = ac(o, 'janelas').split(' e ').map(num); ok(tx.length === 2 && Math.abs(tx[0] - tx[1]) <= 0.25 * Math.max(tx[0], tx[1]), 'N02 bolinhas por segundo iguais nas duas janelas (ruído estatístico) → ' + ac(o, 'janelas'));
  // N03
  await vai('N03'); o = await le('lab-ber', { y: 0.2, r: 100 });
  ok(perto(num(ac(o, 'jato')), Math.sqrt(2 * 9.81 * 0.8), 0.002) && perto(num(ac(o, 'alcance')), 0.8, 0.005) && perto(num(ac(o, 'esvaziar')), 100 * Math.sqrt(1.6 / 9.81), 0.005), 'N03 furo a 0,2 m: v = 3,96, alcance 0,8, esvazia em 40,4 s → ' + JSON.stringify(o));
  o = await le('lab-ber', { v1: 1, ra: 2 }, ['[data-m="venturi"]']); ok(perto(num(ac(o, 'p₁')), 1500, 0.002) && perto(num(ac(o, 'Δh')), 15.3, 0.005), 'N03 Venturi: Δp = 1500 Pa, Δh = 15,3 cm → ' + JSON.stringify(o));
  // N04
  await vai('N04'); o = await le('lab-ele', { g: 1 }, ['[data-k="cis"]', '[data-f="agua"]']); ok(/0,001|1,00 × 10⁻³/.test(ac(o, 'τₓᵧ')), 'N04 cisalhamento γ̇ = 1, água: τ = 2μ·½ = 0,001 Pa → ' + ac(o, 'τₓᵧ'));
  o = await le('lab-ele', { g: 1 }, ['[data-k="rot"]'], 800); ok(/^0 Pa/.test(ac(o, 'τₓᵧ')) && perto(num(ac(o, 'ângulo')), 90, 0.001), 'N04 rotação: tensão zero e a cruz continua a 90° → ' + ac(o, 'τₓᵧ') + ', ' + ac(o, 'ângulo'));
  o = await le('lab-ele', { g: 1 }, ['[data-k="def"]', '[data-f="mel"]']); ok(perto(num(ac(o, 'normal')), 20, 0.001), 'N04 deformação pura no mel: 2με = 20 Pa → ' + ac(o, 'normal'));
  console.log(res.filter(r => r[0]).length + ' de ' + res.length + ' ok'); process.exitCode = res.every((r) => r[0]) ? 0 : 1; /* β 3.7: falha vira código de erro */
  res.forEach(r => console.log((r[0] ? 'ok     ' : 'FALHA  ') + r[1]));
  console.log(errs.length ? 'ERROS JS: ' + errs.join(' | ') : 'sem erros JS');
  await b.close();
})();
