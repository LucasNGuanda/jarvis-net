const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
const { chromium } = require('playwright');
const res = [];
const num = (t) => parseFloat(String(t).replace(/−/g, '-').replace(/\./g, '').replace(',', '.'));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('requestfailed', r => errs.push('falhou ' + r.url()));
  const vai = async (c) => { await p.goto(RAIZ + '#/' + c); await p.waitForTimeout(1200); };
  const le = (id, o, cl = [], espera = 250) => p.evaluate(async ([id, o, cl, espera]) => { cl.forEach(s => document.querySelector(`#${id} ${s}`).click()); for (const [k, v] of Object.entries(o)) { const i = document.querySelector(`#${id} input[data-c="${k}"]`); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); } await new Promise(r => setTimeout(r, espera)); return Object.fromEntries([...document.querySelectorAll(`#${id} .vis`)].map(v => [v.querySelector('small').textContent.trim(), v.querySelector('b').textContent.trim()])); }, [id, o, cl, espera]);
  const ac = (o, k) => o[Object.keys(o).find(x => x.toLowerCase().includes(k.toLowerCase()))];
  const perto = (a, b, t = 0.01) => Math.abs(a - b) <= t * Math.max(1e-9, Math.abs(b));
  const ok = (cond, msg) => res.push([cond, msg]);
  // F01
  await vai('F01'); let o = await le('lab-ref', { V: 3, u: 5 });
  ok(perto(num(ac(o, 'tempo de voo')), 1.02, 0.005) && perto(num(ac(o, 'sobe')), 1.28, 0.005) && perto(num(ac(o, 'velocidade inicial')), 5.83, 0.003) && perto(num(ac(o, 'ângulo')), 59.0, 0.002), 'F01 u = 5, V = 3: voo 1,02 s, sobe 1,28 m, 5,83 m/s a 59,0° → ' + JSON.stringify(o));
  // F02
  await vai('F02'); o = await le('lab-vet', { a: 3, ta: 0, b: 4, tb: 60 });
  ok(perto(num(ac(o, '|a + b|')), Math.sqrt(37), 0.003) && perto(num(ac(o, 'a · b')), 6, 0.001) && perto(num(ac(o, '(a × b)')), 12 * Math.sin(Math.PI / 3), 0.003), 'F02 3 e 4 a 60°: |A+B| = √37 = 6,08, A·B = 6, A×B = 10,39 → ' + JSON.stringify(o));
  o = await le('lab-vet', { a: 3, ta: 0, b: 4, tb: 90 }); ok(perto(num(ac(o, '|a + b|')), 5, 0.001) && Math.abs(num(ac(o, 'a · b'))) < 1e-9, 'F02 perpendiculares: 5 e produto escalar 0 → ' + ac(o, '|a + b|') + ', ' + ac(o, 'a · b'));
  // F03
  await vai('F03'); o = await le('lab-cir', { t: 10 }); ok(perto(num(ac(o, 'erro')), 0.51, 0.02) && perto(num(ac(o, 'sen θ')), 0.174, 0.003), 'F03 10°: erro de sen θ ≈ θ = 0,51% → ' + ac(o, 'erro'));
  o = await le('lab-cir', { t: 90 }); ok(ac(o, 'tg') === 'não existe' && num(ac(o, 'sen²')) === 1, 'F03 90°: tg não existe; sen² + cos² = 1 → ' + ac(o, 'tg'));
  // F04
  await vai('F04'); o = await le('lab-der', { t: 1 }); ok(perto(num(ac(o, 'posição')), 5, 0.001) && perto(num(ac(o, 'inclinação')), 2, 0.001) && perto(num(ac(o, 'área')), 3, 0.002), 'F04 MUV em t = 1: x = 5, v = 2, área = 3 = x(1) − x(0) → ' + JSON.stringify(o));
  o = await le('lab-der', { t: 3 }, ['[data-f="cub"]']); ok(Math.abs(num(ac(o, 'área'))) < 0.01 && Math.abs(num(ac(o, 'inclinação'))) < 0.01, 'F04 cúbica em t = 3: v = 0 e deslocamento 0 → ' + JSON.stringify(o));
  // F05
  await vai('F05'); o = await le('lab-tay', { n: 3, x: 0.5 }); ok(perto(num(ac(o, 'polinômio')), 0.5 - 0.125 / 6, 1e-4) && perto(num(ac(o, 'f(x)')), Math.sin(0.5), 1e-4), 'F05 sen 0,5 com grau 3: 0,47917 → ' + JSON.stringify(o));
  o = await le('lab-tay', { n: 1, x: 0.02 }, ['[data-f="raiz"]']); ok(perto(num(ac(o, 'polinômio')), 1.01, 1e-5), 'F05 √(1,02) ≈ 1 + x/2 = 1,01 → ' + ac(o, 'polinômio'));
  const pq = await p.evaluate(() => [SIM.taylor._P('exp', 10, 1), SIM.taylor._P('geo', 30, -1.2), SIM.taylor._P('ln', 40, 0.5)]);
  ok(perto(pq[0], Math.E, 1e-6) && Math.abs(pq[1]) > 10 && perto(pq[2], Math.log(1.5), 1e-6), 'F05 e¹ com grau 10; 1/(1−x) diverge em −1,2; ln 1,5 converge → ' + pq.map(x => x.toFixed(5)));
  // A19
  await vai('A19'); const sol = await p.evaluate(() => ['pend', 'mola', 'corda', 'agua', 'planck', 'bomba'].map(k => SIM.dimensional._resolve(k)));
  const esp = [[0.5, -0.5, 0], [0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [0.5, 0.5, -1.5], [0.2, -0.2, 0.4]];
  ok(sol.every((s, i) => s && s.every((x, j) => Math.abs(x - esp[i][j]) < 1e-9)), 'A19 expoentes: pêndulo (½, −½, 0), mola, corda, água, Planck (½, ½, −3/2), bomba (1/5, −1/5, 2/5) → ' + JSON.stringify(sol));
  const Rb = await p.evaluate(() => SIM.dimensional._bomba(20, 25)); ok(perto(Rb, 134.2, 0.002), 'A19 bola de fogo 20 kt em 25 ms: R ≈ 134 m → ' + Rb.toFixed(1));
  const txt = await p.evaluate(() => document.querySelector('#lab-dim .palco').textContent); ok(/m não entra/.test(txt), 'A19 pêndulo: mostra que a massa não entra');
  // EP10
  await vai('EP10');
  const r = await p.evaluate(() => {
    const P = { m1: 2, m2: 1, k1: 40, k2: 30, modo: 'exato' };
    const a = SIM.discosRodar(P, [40 * Math.PI / 180, 0, 0, 6], 20);
    const lin = SIM.discosRodar({ ...P, modo: 'linear' }, [2 * Math.PI / 180, 0, 0, 0], 3);
    const exa = SIM.discosRodar(P, [2 * Math.PI / 180, 0, 0, 0], 3);
    const semEmp = SIM.discosRodar({ ...P, modo: 'linear' }, [5 * Math.PI / 180, 0, 0, 0], 20);
    /* período medido: tempo entre cruzamentos de ψ − φ por zero, no modo linear */
    return { n: a.n, dE: (a.E1 - a.E0) / a.E0, omega: a.omega, kappa: a.kappa, linExa: Math.abs(lin.y[0] - exa.y[0]) / (2 * Math.PI / 180), nSem: semEmp.n };
  });
  ok(perto(r.kappa, 7.267, 1e-4) && perto(r.omega, 10.219, 1e-3), 'EP10 κ = 7,267 e ω = 10,22 rad/s (iguais à conta) → ' + r.kappa.toFixed(4) + ', ' + r.omega.toFixed(4));
  ok(r.n > 5 && Math.abs(r.dE) < 1e-4, 'EP10 exato com empurrão, 20 s: várias colisões e energia conservada → ' + r.n + ' colisões, ΔE/E = ' + r.dE.toExponential(2));
  ok(r.linExa < 0.02, 'EP10 com 2°, linear e exato coincidem depois de 3 s (diferença relativa < 2%) → ' + (100 * r.linExa).toFixed(3) + '%');
  ok(r.nSem === 0, 'EP10 linear, do repouso com 5°: nenhuma colisão (o modo zero não é excitado) → ' + r.nSem);
  const per = await p.evaluate(() => { const P = { m1: 2, m2: 1, k1: 40, k2: 30, modo: 'linear' }; let y = [0.05, 0, 0, 0]; const h = 1e-4; let t = 0, cruz = []; let prev = y[1] - y[0]; for (let i = 0; i < 40000; i++) { const r = SIM.discosRodar(P, y, h, h); y = r.y; t += h; const d = y[1] - y[0]; if (prev < 0 && d >= 0) cruz.push(t); prev = d; } return cruz[2] - cruz[1]; });
  ok(perto(per, 0.6148, 0.003), 'EP10 período medido na simulação linear = 2π/ω = 0,615 s → ' + per.toFixed(4));
  o = await le('lab-dis', {}, [], 1500); ok(/7,27|10,22/.test(JSON.stringify(o)) || perto(num(ac(o, 'ω do modo')), 10.22, 0.001), 'EP10 leitor mostra ω = 10,22 → ' + ac(o, 'ω do modo'));
  console.log(res.filter(r => r[0]).length + ' de ' + res.length + ' ok'); process.exitCode = res.every((r) => r[0]) ? 0 : 1; /* β 3.7: falha vira código de erro */
  res.forEach(r => console.log((r[0] ? 'ok     ' : 'FALHA  ') + r[1]));
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros JS');
  await b.close();
})();
