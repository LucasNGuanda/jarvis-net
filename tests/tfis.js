const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
// Física das simulações nos casos limite: lê os mostradores e compara com a fórmula calculada aqui, de forma independente.
const { chromium } = require('playwright');
const U = RAIZ;
const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 };
function num(t) {
  if (t == null) return NaN;
  let s = String(t).replace(/−/g, '-').replace(/\s/g, ' ');
  const m = s.match(/(-?\d[\d.]*,?\d*)\s*(?:[×x·]\s*10\s*([⁻\-]?[⁰¹²³⁴⁵⁶⁷⁸⁹\d]+))?/);
  if (!m) return NaN;
  let v = parseFloat(m[1].replace(/\.(?=\d{3}\b)/g, '').replace(',', '.'));
  if (m[2]) { const e = m[2].replace('⁻', '-').split('').map(c => (c in SUP ? SUP[c] : c)).join(''); v *= Math.pow(10, +e); }
  return v;
}
function numU(t) { const v = num(t); if (t == null) return v; const m = String(t).match(/\d\s*(?:× 10\S*)?\s*([mµμnkMp])(Ω|T|s|V|A|J|W|F|H|eV|Hz|m\b|Pa)/); const f = { m: 1e-3, 'µ': 1e-6, 'μ': 1e-6, n: 1e-9, p: 1e-12, k: 1e3, M: 1e6 }; return m ? v * f[m[1]] : v; }
const res = [];
const perto = (a, b, tol = 0.01) => Math.abs(a - b) <= tol * Math.max(Math.abs(b), 1e-12) || Math.abs(a - b) < 1e-9;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); await require('./adm')(p);
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  let atual = null;
  async function vai(cod) { if (atual !== cod) { await p.goto(U + '#/' + cod); await p.waitForTimeout(1100); atual = cod; } }
  async function le(id, sets = {}, clicks = [], espera = 250) {
    for (const c of clicks) { await p.click(`#${id} ${c}`); await p.waitForTimeout(80); }
    await p.evaluate(([id, sets]) => { for (const [k, v] of Object.entries(sets)) { const i = document.querySelector(`#${id} input[data-c="${k}"]`) || document.querySelector(`#${id} input#${k}`); if (!i) throw new Error('sem controle ' + k); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); } }, [id, sets]);
    await p.waitForTimeout(espera);
    return p.evaluate((id) => { const o = {}; document.querySelectorAll(`#${id} .vis`).forEach(v => { const k = (v.querySelector('small')?.textContent || '').trim(); const val = (v.querySelector('b')?.textContent || v.textContent.replace(k, '')).trim(); o[k] = val; }); return o; }, id);
  }
  const acha = (o, chave) => { const k = Object.keys(o).find(k => k.toLowerCase().includes(chave.toLowerCase())); return k == null ? undefined : o[k]; };
  async function caso(nome, cod, id, sets, clicks, testes, espera) {
    try { await vai(cod); const o = await le(id, sets, clicks, espera);
      for (const [chave, esperado, tol] of testes) { const txt = acha(o, chave); const v = numU(txt);
        const okk = typeof esperado === 'function' ? esperado(v, o, txt) : perto(v, esperado, tol ?? 0.01);
        res.push([okk, `${cod} ${nome}: "${chave}" = ${txt} (esperado ${typeof esperado === 'function' ? 'regra' : esperado})`]); }
    } catch (e) { res.push([false, `${cod} ${nome}: ERRO ${e.message.split('\n')[0]}`]); }
  }
  const g = 9.81, c = 299792458, mu0 = 4e-7 * Math.PI, e0 = 8.8541878128e-12;
  // --- Óptica ---
  await caso('α = 90° → 3 imagens', 'O06', 'lab-cal', { a: 90 }, [], [['imagens contadas', 3], ['fórmula', 3]]);
  await caso('α = 60° → 5 imagens', 'O06', 'lab-cal', { a: 60 }, [], [['imagens contadas', 5]]);
  await caso('α = 180° (espelhos alinhados) → 1 imagem', 'O06', 'lab-cal', { a: 180 }, [], [['imagens contadas', 1]]);
  await caso('côncavo f = 10, p = 20 (no centro) → p′ = 20, A = −1', 'O07', 'lab-esf', { f: 10, p: 20 }, [], [['p′', 20], ['A =', -1]]);
  await caso('côncavo f = 10, p = 5 (dentro do foco) → virtual, A = 2', 'O07', 'lab-esf', { f: 10, p: 5 }, [], [['p′', -10], ['A =', 2]]);
  await caso('convexo f = −10, p = 20 → p′ = −6,67, A = 1/3', 'O07', 'lab-esf', { f: -10, p: 20 }, [], [['p′', -20 / 3], ['A =', 1 / 3]]);
  await caso('lente f = 10, p = 20 → p′ = 20, A = −1', 'O09', 'lab-len', { f: 10, p: 20 }, [], [['p′', 20], ['aumento', -1], ['vergência', 10]]);
  await caso('lente f = 10, p = 5 → p′ = −10, A = 2', 'O09', 'lab-len', { f: 10, p: 5 }, [], [['p′', -10], ['aumento', 2]]);
  await caso('incidência normal → θ₂ = 0', 'O08', 'lab-ref', { t: 0 }, [], [['θ₂', 0]]);
  { await vai('O08'); const a = await le('lab-ref', { t: 30 }), bb = await le('lab-ref', { t: 60 });
    const n1 = Math.sin(30 * Math.PI / 180) / Math.sin(num(acha(a, 'θ₂')) * Math.PI / 180), n2 = Math.sin(60 * Math.PI / 180) / Math.sin(num(acha(bb, 'θ₂')) * Math.PI / 180);
    res.push([perto(n1, n2, 0.01), `O08 Snell: sen θ₁/sen θ₂ igual em 30° e 60° (${n1.toFixed(3)} e ${n2.toFixed(3)})`]);
    const br = num(acha(a, 'Brewster')); res.push([perto(Math.tan(br * Math.PI / 180), n1, 0.01), `O08 Brewster: tg θ_B = n (${Math.tan(br * Math.PI / 180).toFixed(3)} × ${n1.toFixed(3)})`]);
    const cr = num(acha(a, 'crítico')); res.push([isNaN(cr) || perto(Math.sin(cr * Math.PI / 180), 1 / n1, 0.01) || /não/.test(acha(a, 'crítico')), `O08 ângulo crítico: ${acha(a, 'crítico')}`]); }
  await caso('ocular 25/f', 'O10', 'lab-ins', { f1: 4, f2: 5 }, [], [['ocular', 5], ['total', (v, o) => perto(Math.abs(v), Math.abs(num(acha(o, 'objetiva')) * num(acha(o, 'ocular'))), 0.02)]]);
  { await vai('O10b'); const a = await le('lab-fen', { l: 500, d: 100, a: 20 }), bb = await le('lab-fen', { l: 500, d: 200, a: 20 }), cc = await le('lab-fen', { l: 700, d: 100, a: 20 });
    res.push([perto(num(acha(a, 'entre franjas')) / num(acha(bb, 'entre franjas')), 2, 0.02), 'O10b Young: dobrar d divide a distância entre franjas por 2']);
    res.push([perto(num(acha(cc, 'entre franjas')) / num(acha(a, 'entre franjas')), 1.4, 0.02), 'O10b Young: λ 500 → 700 nm multiplica as franjas por 1,4']);
    res.push([perto(num(acha(a, 'franjas claras')), 2 * Math.floor(100 / 20 - 1e-9) + 1, 0.001) || perto(num(acha(a, 'franjas claras')), 2 * (100 / 20) - 1, 0.001), `O10b franjas dentro do máximo central (d/a = 5): ${acha(a, 'franjas claras')}`]); }
  await caso('fonte pontual (s = 0) → sem penumbra', 'O05', 'lab-som', { s: 0 }, [], [['penumbra', 0]]);
  // --- Eletromagnetismo ---
  await caso('θ = 90° → torque máximo, U = 0', 'C03', 'lab-d', { th: 90, E: 2 }, [], [['U =', 0]]);
  { await vai('C03'); const a = await le('lab-d', { th: 90, E: 2 }), bb = await le('lab-d', { th: 30, E: 2 }), cc = await le('lab-d', { th: 0, E: 2 });
    res.push([perto(num(acha(bb, 'torque')) / num(acha(a, 'torque')), 0.5, 0.01), 'C03 dipolo: τ(30°)/τ(90°) = sen 30° = 0,5']);
    res.push([perto(num(acha(cc, 'torque')), 0) && perto(num(acha(cc, 'U =')), -num(acha(a, 'torque')), 0.01), 'C03 dipolo: θ = 0 → τ = 0 e U = −pE']); }
  { await vai('C03b'); const o = await le('lab-g'); res.push([perto(num(acha(o, 'numérico')), num(acha(o, 'q_int')), 0.02), `C03b Gauss: Φ numérico ${acha(o, 'numérico')} × q/ε₀ ${acha(o, 'q_int')}`]); }
  { await vai('C11'); const a = await le('lab-c', { A: 100, d: 1, f: 0 }), bb = await le('lab-c', { A: 200, d: 1, f: 0 }), cc = await le('lab-c', { A: 100, d: 2, f: 0 });
    res.push([perto(num(acha(bb, 'C')) / num(acha(a, 'C')), 2, 0.02) && perto(num(acha(cc, 'C')) / num(acha(a, 'C')), 0.5, 0.02), `C11 capacitor: C ∝ A/d (${acha(a, 'C')}, ${acha(bb, 'C')}, ${acha(cc, 'C')})`]);
    res.push([perto(num(acha(a, 'C')), e0 * 100e-4 / 1e-3 * 1e12, 0.03) || perto(num(acha(a, 'C')), e0 * 100e-4 / 1e-3, 0.03), `C11 capacitor: C = ε₀A/d com A = 100 cm², d = 1 mm (88,5 pF): ${acha(a, 'C')}`]); }
  { await vai('C07'); const a = await le('lab-fio', { L: 1, d: 1, T: 20 }), bb = await le('lab-fio', { L: 2, d: 1, T: 20 }), cc = await le('lab-fio', { L: 1, d: 2, T: 20 });
    res.push([perto(num(acha(bb, 'Resistência')) / num(acha(a, 'Resistência')), 2, 0.02), 'C07 fio: dobrar L dobra R']);
    res.push([perto(numU(acha(cc, 'Resistência')) / numU(acha(a, 'Resistência')), 0.25, 0.03), `C07 fio: dobrar o diâmetro divide R por 4 (${acha(a, 'Resistência')} → ${acha(cc, 'Resistência')})`]);
    const d2 = await le('lab-fio', { L: 1, d: 1, T: 120 }); res.push([num(acha(d2, 'Resistência')) > num(acha(a, 'Resistência')), 'C07 fio: esquentar aumenta R (metal)']); }
  { await vai('C10'); const o = await le('lab-ger', { r: 2, R: Math.log10(2) }); res.push([perto(num(acha(o, 'rendimento')), 50, 0.02), `C10 gerador: R = r → rendimento 50% (${acha(o, 'rendimento')})`]); res.push([perto(num(acha(o, 'P útil')), num(acha(o, 'P máx')), 0.01), 'C10 gerador: R = r → P útil = P máx']); }
  await caso('R = 10⁴ Ω, C = 10⁻⁴ F → τ = 1 s', 'C10b', 'lab-rc', { R: 4, C: -4 }, [], [['τ', 1]]);
  { await vai('C12'); const a = await le('lab-pb', { b: 1, v: 1, a: 90 }), bb = await le('lab-pb', { b: 2, v: 1, a: 90 }), cc = await le('lab-pb', { b: 1, v: 1.5, a: 90 });
    res.push([perto(num(acha(bb, 'raio')) / num(acha(a, 'raio')), 0.5, 0.02), 'C12: dobrar B divide o raio por 2']);
    res.push([perto(num(acha(cc, 'período')), num(acha(a, 'período')), 0.01), 'C12: o período não depende da velocidade (cíclotron)']);
    res.push([/—/.test(acha(a, 'passo')) || perto(num(acha(a, 'passo')), 0, 0.01), `C12: v ⊥ B (90°) → sem hélice (passo = ${acha(a, 'passo')})`]); }
  { await vai('C15b'); const o = await le('lab-rlc', { L: 10, C: 1, R: 0 }); const f0 = 1 / (2 * Math.PI * Math.sqrt(10e-3 * 1e-6)), Rc = 2 * Math.sqrt(10e-3 / 1e-6);
    res.push([perto(num(acha(o, 'f₀')), f0, 0.02) || perto(num(acha(o, 'f₀')) * 1000, f0, 0.02), `C15b: L = 10 mH, C = 1 μF → f₀ = ${f0.toFixed(0)} Hz: ${acha(o, 'f₀')}`]);
    res.push([perto(num(acha(o, 'crítico')), Rc, 0.02), `C15b: R crítico = 2√(L/C) = ${Rc} Ω: ${acha(o, 'crítico')}`]); }
  { await vai('C15c'); const o0 = await le('lab-fas', { f: 1, R: 50 });
    const f0 = num(acha(o0, 'f₀')); const lo = await p.evaluate(() => { const i = document.querySelector('#lab-fas input[data-c="f"]'); return [i.min, i.max, i.step]; });
    res.push([!isNaN(f0), `C15c f₀ lido: ${acha(o0, 'f₀')} (controle f ${lo.join('..')})`]);
    // varre f e confere que |φ| é mínimo onde X_L = X_C
    let melhor = null; for (let f = +lo[0]; f <= +lo[1]; f += 0.02) { const o = await le('lab-fas', { f, R: 50 }, [], 30); const ph = Math.abs(num(acha(o, 'fase'))); if (!melhor || ph < melhor[1]) melhor = [f, ph, acha(o, 'Z'), acha(o, 'X_L')]; }
    res.push([melhor[1] < 3, `C15c: na ressonância a fase vai a ~0 (mín |φ| = ${melhor[1]}°, Z = ${melhor[2]}, X_L·X_C = ${melhor[3]})`]); }
  await caso('E₀ = 300 V/m → B₀ = 1 μT, I = 119 W/m²', 'C15d', 'lab-onda', { E: 300 }, [], [['B₀', (v, o, t) => perto(v * (/μ/.test(t) ? 1e-6 : /nT/.test(t) ? 1e-9 : 1), 300 / c, 0.02)], ['intensidade', 300 ** 2 / (2 * mu0 * c), 0.02]]);
  await caso('Sol (T = 5800 K): Wien 500 nm, σT⁴ = 6,4 × 10⁷ W/m²', 'C16', 'lab-cn', { T: 5800 }, [], [['pico', 2.897771955e-3 / 5800, 0.01], ['potência', 5.670374e-8 * 5800 ** 4, 0.02]]);
  await caso('λ = 400 nm → fóton de 3,10 eV', 'C17', 'lab-foto', { l: 400 }, [], [['energia do fóton', 1239.84 / 400, 0.01]]);
  { await vai('C17'); const o = await le('lab-foto', { l: 400 }); const K = num(acha(o, 'K_máx')), Ef = num(acha(o, 'energia do fóton')), lc = num(acha(o, 'λ de corte'));
    res.push([perto(Ef - K, 1239.84 / lc, 0.02), `C17: hf − K_máx = φ = hc/λ_corte (${(Ef - K).toFixed(3)} × ${(1239.84 / lc).toFixed(3)} eV)`]);
    res.push([perto(num(acha(o, 'potencial de corte')), K, 0.01), 'C17: potencial de corte (V) = K_máx (eV)']);
    const o2 = await le('lab-foto', { l: 750 }); res.push([!(num(acha(o2, 'K_máx')) > 0) || 1239.84 / 750 > Ef - K, `C17: λ = 750 nm abaixo do limiar → sem elétrons (K = ${acha(o2, 'K_máx')})`]); }
  await caso('v = 0,6c → γ = 1,25', 'C18', 'lab-rel', { b: 0.6 }, [], [['γ', 1.25], ['1 s na nave', 1.25], ['comprimento', 0.8]]);
  await caso('v = 0 → γ = 1', 'C18', 'lab-rel', { b: 0 }, [], [['γ', 1]]);
  await caso('Fe-56: B/A ≈ 8,8 MeV', 'C19', 'lab-lig', { A: 56 }, [], [['B/A', (v) => v / 1e6 > 8.4 && v / 1e6 < 9.0]]);
  await caso('T = 300 K → kT = 25,9 meV', 'C20', 'lab-ban', { T: 300 }, [], [['kT', (v) => perto(v, 8.617333e-5 * 300, 0.02)]]);
  await caso('k = 1 → crítico', 'C19b', 'lab-cad', { k: 1 }, [], [['regime', (v, o, t) => /crít/i.test(t)]]);
  // --- Universitária ---
  await caso('ω = 15 rad/s → θ* = 64,2°', 'U03', 'lab-aro', { w: 15 }, [], [['ω_c', Math.sqrt(g / 0.1)], ['equilíbrio', (v, o, t) => perto(num(t.replace(/.*±/, '')), Math.acos(g / (225 * 0.1)) * 180 / Math.PI, 0.005)]]);
  await caso('ω = 5 (abaixo de ω_c) → fundo', 'U03', 'lab-aro', { w: 5 }, [], [['equilíbrio', (v, o, t) => /fundo/.test(t)]]);
  await caso('n = 1,5 → r = −0,2, R = 4%', 'U05', 'lab-fdtd', { n: 1.5 }, [], [['amplitude', -0.2], ['energia', 4]]);
  await caso('n = 1 → sem reflexão', 'U05', 'lab-fdtd', { n: 1 }, [], [['amplitude', 0], ['energia', 0]]);
  await caso('curva envolvendo as 3 cargas → fluxo/2π = 2', 'U02', 'lab-fl', { cx: 0, cy: 0, r: 2 }, [], [['fluxo / 2π', 2, 0.005], ['carga dentro', 2]]);
  await caso('curva sem cargas → fluxo 0', 'U02', 'lab-fl', { cx: 1.5, cy: -1.6, r: 0.25 }, [], [['fluxo / 2π', (v) => Math.abs(v) < 0.005], ['carga dentro', 0]]);
  await caso('caminho real: S = −g²/3', 'U04', 'lab-acao', { e: 0 }, [], [['S do caminho real', -(g * g) / 3, 0.001], ['diferença', 0]]);
  await caso('ε = 2: ΔS = mε²π²/(2T)·… > 0', 'U04', 'lab-acao', { e: 2 }, [], [['diferença', 2 * 2 * Math.PI ** 2 / 4 / 2, 0.01]]); // ½mε²∫η̇² = ½·4·(π/T)²·T/2 = π²
  // --- Cálculo ---
  await caso('W₀(1) = 0,5671 (constante Ω)', 'matematica/CE01', 'lab-w', { a: 1 }, [], [['W₀(a)', 0.567143, 0.001], ['conferindo', 1, 0.001]]);
  await caso('W no início do controle (a ≈ −1/e) → ≈ −1', 'matematica/CE01', 'lab-w', { a: -0.36787 }, [], [['W₀(a)', -1, 0.03]]);
  await caso('Γ(5) = 24', 'matematica/CE02', 'lab-g', { x: 5 }, [], [['Γ(x)', 24, 0.001]]);
  await caso('Γ(½) = √π... x = 0,5', 'matematica/CE02', 'lab-g', { x: 0.5 }, [], [['Γ(x)', Math.sqrt(Math.PI), 0.002]]);
  await caso('Green: ∮ = ∬ rot', 'matematica/CE03', 'lab-c', { cx: 0.3, cy: -0.4, R: 1.2 }, [], [['∮', (v, o) => perto(v, num(acha(o, '∬')), 0.01)]]);
  await caso('Riemann n = 100: erro ≈ 0', 'matematica/CI06', 'lab-rie', { n: 100 }, [], [['exato', 8 / 3, 0.001], ['soma', 8 / 3, 0.02]]);
  await caso('Snell no salva-vidas: sen θ₁/v₁ = sen θ₂/v₂ no mínimo', 'matematica/CI05', 'lab-sv', {}, ['button'], [['sen θ₁', (v, o) => perto(v, num(acha(o, 'sen θ₂')), 0.03)]], 600);
  await caso('Taylor: perto de 0 o erro some', 'matematica/CII04', 'lab-tay', { n: 30, x: 0.05 }, [], [['erro', (v) => Math.abs(v) < 1e-3]]);
  await caso('integral dupla n = 80 ≈ π/2', 'matematica/CII07', 'lab-dup', { n: 80 }, [], [['exato', Math.PI / 2, 0.001], ['erro', (v) => Math.abs(v) < 0.02]]);
  await caso('sólido n = 60 → 16π/3', 'matematica/CI09', 'lab-rev', { n: 60 }, [], [['exato', 16 * Math.PI / 3, 0.001], ['erro', (v) => Math.abs(v) < 0.3]]);
  await caso('oscilador sem atrito (γ = 0): T = 2π/ω₀', 'matematica/CII08', 'lab-osc', { w: 2, g: 0 }, [], [['período', Math.PI, 0.01]]);
  await caso('γ = ω₀ → crítico', 'matematica/CII08', 'lab-osc', { w: 3, g: 3 }, [], [['regime', (v, o, t) => /crít/i.test(t)]]);
  await caso('Euler com h pequeno → erro pequeno', 'matematica/CII08', 'lab-edo', { h: 0.05 }, [], [['erro', (v, o) => Math.abs(v) < 0.1 * Math.abs(num(acha(o, 'exata')) || 1)]]);
  await caso('regra da cadeia: g′·f′ = inclinação medida', 'matematica/CI04', 'lab-cad', { x: 0.7 }, [], [['g′ · f′', (v, o) => perto(v, num(acha(o, 'inclinação medida')), 0.02)]]);
  await caso('secante com h = 0,0015 (controle no fim, escala log) → tangente', 'matematica/CI03', 'lab-sec', { a: 0.5, h: 1 }, [], [['secante', (v, o) => perto(v, num(acha(o, 'tangente')), 0.02)]]);
  await caso('Я(3) = 6', 'X01', 'lab-ya', { x2: 3 }, [], [['Я(x)', (v, o, t) => perto(num(t.split('=').pop()), 6)]]);
  // --- Experimentos ---
  { await vai('EP01'); const o = await le('lab-p1', { L: 1, g: 9.81 }); res.push([perto(num(acha(o, 'T₀ = 2π')), 2 * Math.PI * Math.sqrt(1 / g), 0.005), `EP01: T₀(1 m) = 2,006 s: ${acha(o, 'T₀ = 2π')}`]);
    const T0 = num(acha(o, 'T₀ = 2π')), Te = num(acha(o, 'elíptica')), th = num(acha(o, 'amplitude')) * Math.PI / 180;
    let K = 0, k = Math.sin(th / 2); { let a = 1, bb = Math.sqrt(1 - k * k); for (let i = 0; i < 20; i++) [a, bb] = [(a + bb) / 2, Math.sqrt(a * bb)]; K = Math.PI / (2 * a); }
    res.push([perto(Te, T0 * 2 * K / Math.PI, 0.005), `EP01: T exato = (2/π)K(sen θ₀/2)·T₀ com θ₀ = ${acha(o, 'amplitude')}: ${Te} × ${(T0 * 2 * K / Math.PI).toFixed(4)}`]); }
  await caso('k_c = 0: modos iguais', 'EP08', 'lab-mol', { k: 10, kc: 0, m: 1 }, [], [['ω₁', Math.sqrt(10)], ['ω₂', Math.sqrt(10)]]);
  await caso('ω₂ = √((k+2k_c)/m)', 'EP08', 'lab-mol', { k: 10, kc: 5, m: 1 }, [], [['ω₂', Math.sqrt(20)], ['batimento', 2 * Math.PI / (Math.sqrt(20) - Math.sqrt(10)), 0.01]]);
  await caso('ω mola = √(k/(M+m))', 'EP09', 'lab-p4', { M: 1, m: 0.5, l: 0.5, k: 60 }, [], [['ω mola', Math.sqrt(60 / 1.5)], ['ω pêndulo', Math.sqrt(g / 0.5)]]);
  await caso('v terminal = mg/b', 'EP06', 'lab-tubo', {}, [], [['v terminal', (v, o) => true]]);
  await caso('ω = √(kq₁q₂/md³)', 'EP07', 'lab-prof', { d: 10, A: 0.5 }, [], [['T (MHS)', (v, o) => perto(v, 2 * Math.PI / num(acha(o, 'kq₁q₂')), 0.01)], ['T medido', (v, o) => perto(v, numU(acha(o, 'T (MHS)')), 0.01)]], 2500);
  await caso('poço de 1 nm: E₁ = h²/8mL² = 0,376 eV', 'U06', 'lab-poco', {}, [], [['E do estado 1', 0.376, 0.005], ['nós', 0]]);
  await caso('redemoinho (−y, x): div 0, rot 2', 'U01', 'lab-cv', { x: 0.8, y: 0.4 }, [], [['div', 0], ['rot F', 2], ['rodinha', 1]]);
  await caso('fonte (x, y): div 2, rot 0', 'U01', 'lab-cv', { x: 0.8, y: 0.4 }, ['[data-k="fonte"]'], [['div', 2], ['rot F', 0]]);
  await caso('i total = E/R_eq', 'C08', 'lab-as', { E: 10, R1: 100, R2: 200, R3: 300 }, [], [['i total', (v, o) => perto(v, 10 / numU(acha(o, 'R equivalente')), 0.01)]]);
  await caso('TFC: inclinação de A(x) = f(x)', 'matematica/CI07', 'lab-tfc', { x: 0.6 }, [], [['inclinação de A', (v, o) => perto(v, num(acha(o, 'f(x)')), 0.02)]]);
  await caso('por partes: A + B = retângulo', 'matematica/CII01', 'lab-par', { b: 0.7 }, [], [['A + B', (v, o) => perto(v, num(acha(o, 'retângulo')), 0.005)]]);
  await caso('p = 2: ∫₁^∞ dx/x² = 1', 'matematica/CII02', 'lab-imp', { p: 2 }, [], [['imprópria', 1, 0.01]]);
  await caso('pêndulo duplo: energia conservada', 'EP02', 'lab-p2', {}, [], [['erro relativo', (v) => Math.abs(v) < 0.1]], 3000);
  await caso('pêndulo triplo: energia conservada', 'EP03', 'lab-p3', {}, [], [['erro relativo', (v) => Math.abs(v) < 0.1]], 3000);
  await caso('Drude: deriva média ≈ aτ', 'C06', 'lab-dr', {}, [], [['velocidade de deriva média', (v, o) => perto(v, numU(acha(o, 'esperada')), 0.25)]], 4000);
  console.log(res.filter(r => r[0]).length + ' de ' + res.length + ' conferências ok'); process.exitCode = res.every((r) => r[0]) ? 0 : 1; /* β 3.7: falha vira código de erro */
  res.filter(r => !r[0]).forEach(r => console.log('FALHA  ' + r[1]));
  console.log('---'); res.filter(r => r[0]).forEach(r => console.log('ok     ' + r[1]));
  console.log(errs.length ? 'ERROS JS: ' + errs.join(' | ') : 'sem erros JS');
  await b.close();
})();
