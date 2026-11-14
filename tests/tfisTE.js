const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
const { chromium } = require('playwright');
const res = [];
const num = (t) => parseFloat(String(t).replace(/−/g, '-').replace(',', '.'));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const vai = async (c) => { await p.goto(RAIZ + '#/' + c); await p.waitForTimeout(1200); };
  const set = (id, o, cliques = []) => p.evaluate(([id, o, cl]) => { cl.forEach(s => document.querySelector(`#${id} ${s}`).click()); for (const [k, v] of Object.entries(o)) { const i = document.querySelector(`#${id} input[data-c="${k}"]`); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); } return Object.fromEntries([...document.querySelectorAll(`#${id} .vis`)].map(v => [v.querySelector('small').textContent.trim(), v.querySelector('b').textContent.trim()])); }, [id, o, cliques]);
  const perto = (a, b, t) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  // TE01
  await vai('TE01');
  let o = await set('lab-bq', { D: 3.14159, H: 2 }); let T = await p.evaluate(() => SIM.braquisto._tempos());
  res.push([perto(T.cicl, 1.00303, 2e-3) && perto(T.reta, 1.18904, 2e-3), `TE01 R=1 até o fundo: cicloide ${T.cicl.toFixed(4)} (1,0030), reta ${T.reta.toFixed(4)} (1,1890)`]);
  res.push([Object.values(T).every(v => v >= T.cicl - 1e-9), 'TE01 cicloide é a mais rápida: ' + JSON.stringify(Object.fromEntries(Object.entries(T).map(([k, v]) => [k, +v.toFixed(4)])))]);
  o = await set('lab-bq', { D: 2, H: 1 }); T = await p.evaluate(() => SIM.braquisto._tempos());
  res.push([perto(T.cicl, 0.80556, 2e-3) && perto(T.reta, 1.00964, 2e-3) && Object.values(T).every(v => v >= T.cicl - 1e-9), `TE01 D=2, H=1: cicloide ${T.cicl.toFixed(4)} (0,8056), reta ${T.reta.toFixed(4)} (1,0096)`]);
  o = await set('lab-bq', { D: 0.5, H: 2 }); T = await p.evaluate(() => SIM.braquisto._tempos());
  res.push([Object.values(T).every(v => v >= T.cicl - 1e-9), 'TE01 quase vertical (D=0,5, H=2): cicloide ainda a mais rápida ' + JSON.stringify(Object.fromEntries(Object.entries(T).map(([k, v]) => [k, +v.toFixed(4)])))]);
  // TE02
  await vai('TE02');
  for (const [k, n, x0] of [['quad', 1, 0.4], ['quad', 6, 0.4], ['misto', 8, -0.3], ['fonte', 3, 0], ['giro', 5, 1]]) {
    o = await set('lab-dv', { n, x0 }, [`[data-k="${k}"]`]); const v = Object.values(o).map(num);
    res.push([perto(v[0], v[1], 1e-6) && perto(v[1], v[2], 1e-6), `TE02 ${k}, n=${n}, x₀=${x0}: caixinhas ${v[0]} = borda ${v[1]} = ∬div ${v[2]}`]);
  }
  // TE03
  await vai('TE03');
  for (const [k, d, s] of [['circ', 1.5, 1], ['ret', 2, 1], ['tri', 0.5, 1.2], ['semi', 0, 1], ['semi', 1, 0.6]]) {
    o = await set('lab-pp', { d, s }, [`[data-k="${k}"]`]); const v = Object.values(o).map(num);
    res.push([perto(v[2], v[3], 2e-3), `TE03 ${k} d=${d} s=${s}: Pappus ${v[2]} × fatias ${v[3]}`]);
  }
  o = await set('lab-pp', { d: 1.5, s: 1 }, ['[data-k="circ"]']); res.push([perto(num(Object.values(o)[2]), 2 * Math.PI ** 2 * 2.5, 1e-3), `TE03 toro R=2,5 r=1: ${Object.values(o)[2]} (esperado ${(2 * Math.PI ** 2 * 2.5).toFixed(4)})`]);
  o = await set('lab-pp', { d: 0, s: 1 }, ['[data-k="semi"]']); res.push([perto(num(Object.values(o)[2]), 4 / 3 * Math.PI, 1e-3), `TE03 meio disco no eixo = esfera: ${Object.values(o)[2]} (4π/3 = 4,1888)`]);
  // TE04
  await vai('TE04');
  for (const k of ['giro', 'misto', 'grad']) for (const h of [-1.5, 0, 0.8, 1.5]) {
    o = await set('lab-sk', { h }, [`[data-k="${k}"]`]); const v = Object.values(o).map(num); const esp = { giro: 2 * Math.PI, misto: Math.PI, grad: 0 }[k];
    res.push([perto(v[0], esp, 1e-3) && perto(v[1], esp, 1e-3), `TE04 ${k} h=${h}: circulação ${v[0]}, fluxo ${v[1]} (esperado ${esp.toFixed(4)}), área ${v[2]}`]);
  }
  // TE05
  await vai('TE05');
  for (const [k, esp] of [['kepler', [1, 1, 0]], ['aniso', [1, 0, 0]], ['grav', [1, 0, 1]], ['pulsa', [0, 1, 0]]]) {
    await p.evaluate((k) => document.querySelector(`#lab-nt [data-k="${k}"]`).click(), k); await p.waitForTimeout(3500);
    const f = await p.evaluate(() => [...document.querySelectorAll('#lab-nt [data-v=gr] text')].filter(t => /conservado|varia/.test(t.textContent)).map(t => t.textContent === 'conservado' ? 1 : 0));
    res.push([JSON.stringify(f) === JSON.stringify(esp), `TE05 ${k}: (E, L, pₓ) conservados = ${f.join(',')} (esperado ${esp.join(',')})`]);
  }
  console.log(res.filter(r => r[0]).length + ' de ' + res.length + ' ok');
  res.forEach(r => console.log((r[0] ? 'ok     ' : 'FALHA  ') + r[1]));
  console.log(errs.length ? 'ERROS JS: ' + errs.join(' | ') : 'sem erros JS');
  await b.close();
})();
