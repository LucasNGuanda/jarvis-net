// tlabsF.js: física dos laboratórios do módulo F da Química (Físico-química II) e gabaritos. Uso: node tests/tlabsF.js
const { chromium } = require('playwright'); const path = require('path');
const RAIZ = 'file://' + path.resolve(__dirname, '..', 'index.html');
let falhas = 0; const ok = (c, m) => { console.log((c ? 'ok ' : 'FALHA ') + m); if (!c) falhas++; };
const perto = (a, b, tol = 0.005) => Math.abs(a - b) <= tol * Math.max(1e-9, Math.abs(b));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const erros = []; p.on('pageerror', (e) => erros.push(String(e))); await require('./adm')(p);
  const temas = new Set(await p.evaluate(() => 1).then(() => require('fs').readdirSync(path.resolve(__dirname, '..', 'temas', 'quimica')).map((f) => f.replace('.js', ''))));
  const abre = async (cod) => { await p.goto(RAIZ + '#/quimica/' + cod); await p.waitForTimeout(1500); };
  const leitor = (id) => p.evaluate((id) => { const o = {}; document.querySelectorAll('#' + id + ' .vis').forEach((v) => (o[v.querySelector('small').textContent.trim()] = v.querySelector('b').textContent.trim())); return o; }, id);
  // ----- F01: calorímetro -----
  if (temas.has('F01')) { await abre('F01');
    const cal = (k, m, ma, ef) => p.evaluate(([k, m, ma, ef]) => { SIM.qCalorimetro._ult.poe(k, m, ma, ef); return SIM.qCalorimetro._ult.est(); }, [k, m, ma, ef]);
    const c1 = await cal('C2H5OH', 2.3, 500, 1); ok(perto(c1.n, 0.05, 1e-6) && perto(c1.q, 68.35, 1e-4) && perto(c1.dT, 68350 / (500 * 4.18), 1e-6), 'F01: 2,30 g de etanol (0,0500 mol) → 68,35 kJ → ΔT = ' + c1.dT.toFixed(1) + ' °C em 500 g de água');
    const c2 = await cal('CH4', 1.6, 1000, 1); ok(perto(c2.q, 89.07, 1e-4) && perto(c2.porg, 55.67, 1e-3) && perto(c2.medido, 890.7, 1e-6), 'F01: 1,6 g de metano → 89,07 kJ; 55,7 kJ/g; o ΔH medido com 100% de aproveitamento é o de tabela');
    const c3 = await cal('C2H5OH', 1, 500, 0.4); ok(perto(c3.medido, 0.4 * 1367, 1e-6) && perto(c3.util, 0.4 * c3.q, 1e-9), 'F01: com 40% de aproveitamento o ΔH medido cai para ' + c3.medido.toFixed(0) + ' kJ/mol (erro sistemático da lamparina)');
    const c4 = await cal('C4H10', 3, 100, 1); ok(c4.ferve === true, 'F01: calor demais para a água (3 g de butano, 100 g de água) → o laboratório avisa que ferveria');
    const c5 = await cal('H2', 1, 1000, 1), c6 = await cal('C4H10', 1, 1000, 1); ok(c5.porg > 2.8 * c6.porg && c5.q < 5 * c6.q, 'F01: hidrogênio rende ' + c5.porg.toFixed(0) + ' kJ/g contra ' + c6.porg.toFixed(1) + ' do butano'); }
  // ----- F02: lei de Hess -----
  if (temas.has('F02')) { await abre('F02');
    const hs = (k, m) => p.evaluate(([k, m]) => { SIM.qHess._ult.poe(k, m); return SIM.qHess._ult.est(); }, [k, m]);
    const h1 = await hs('metano', 'form'); ok(perto(h1.hr, -74.6, 1e-6) && perto(h1.hp, -877.15, 1e-5) && perto(h1.dH, -802.55, 1e-5), 'F02: metano pelos elementos: −74,6 → 0 → −877,15; ΔH = −802,55 kJ');
    const h2 = await hs('metano', 'lig'); ok(h2.quebra === 2656 && h2.forma === 3338 && h2.dHlig === -682 && h2.dHligCO2 === -798, 'F02: metano pelas ligações: 2656 − 3338 = −682 kJ; com a C=O do CO₂ (799), −798 kJ');
    const h3 = await hs('amonia', 'lig'); ok(h3.dHlig === -86 && perto(h3.dH, -91.8, 1e-6), 'F02: amônia: −86 kJ pelas ligações, −91,8 pela formação');
    const h4 = await hs('hcl', 'lig'), h5 = await hs('agua', 'lig'), h6 = await hs('eteno', 'lig'); ok(h4.dHlig === -185 && h5.dHlig === -486 && h6.dHlig === -128 && perto(h4.dH, -184.614, 1e-5) && perto(h5.dH, -483.64, 1e-6) && perto(h6.dH, -136.4, 1e-6), 'F02: HCl −185 (−184,6), água −486 (−483,6), eteno −128 (−136,4): estimativa perto da tabela');
    await p.waitForTimeout(200); const l2 = await leitor('lab-hess'); ok(/−128/.test(l2['ΔH estimado']) && /−136,4/.test(l2['ΔH pela tabela de formação']), 'F02: o mostrador põe a estimativa ao lado do valor de tabela → ' + l2['ΔH estimado'] + ' · ' + l2['ΔH pela tabela de formação']); }
  // ----- F03: energia livre -----
  if (temas.has('F03')) { await abre('F03');
    const gb = (k, t, h, s) => p.evaluate(([k, t, h, s]) => { SIM.qGibbs._ult.poe(k, t, h, s); return SIM.qGibbs._ult.est(); }, [k, t, h, s]);
    const g1 = await gb('amonia', 298); ok(perto(g1.dH, -91.8, 1e-6) && perto(g1.dS, -198.1, 1e-4) && perto(g1.dG, -91.8 + 298 * 0.1981, 1e-4) && perto(g1.Tinv, 463.4, 1e-3) && g1.esp, 'F03: amônia a 298 K: ΔG = ' + g1.dG.toFixed(1) + ' kJ; vira em ' + g1.Tinv.toFixed(0) + ' K');
    const g2 = await gb('amonia', 600); ok(g2.dG > 0 && !g2.esp, 'F03: amônia a 600 K: ΔG positivo (' + g2.dG.toFixed(1) + ' kJ)');
    const g3 = await gb('calcario', 298); ok(g3.ded && perto(g3.dG, 131.44, 2e-3) && perto(g3.Tinv, 1131, 2e-3), 'F03: calcinação: ΔS deduzido de (ΔH − ΔG)/T, avisado na tela; ΔG = 0 em ' + g3.Tinv.toFixed(0) + ' K');
    const g4 = await gb('ozonio', 1000), g5 = await gb('metanoL', 1000); ok(g4.Tinv === null && g4.dG > 0 && g5.dG < 0, 'F03: 3 O₂ → 2 O₃ nunca é espontânea (ΔH > 0, ΔS < 0); queimar metano é, a 1000 K');
    const g6 = await gb('livre', 500, 50, 100); ok(perto(g6.dG, 0, 1e-9) || Math.abs(g6.dG) < 1e-9, 'F03: reação genérica com ΔH = 50 kJ e ΔS = 100 J/K → ΔG = 0 exatamente em 500 K'); ok(perto(g6.Tinv, 500, 1e-9), 'F03: temperatura de virada = ΔH/ΔS = 500 K');
    const g7 = await gb('livre', 298, -60, 0); ok(perto(g7.lnK, 60000 / (8.314 * 298), 1e-9) && Math.abs(g7.lnK / Math.LN10 - 10.52) < 0.01, 'F03: ΔG = −60 kJ a 298 K → K = 10^' + (g7.lnK / Math.LN10).toFixed(2) + ' (esperado 10^10,52)'); await gb('vapor', 298); }
  // ----- F04: colisões -----
  if (temas.has('F04')) { await abre('F04');
    const col = (t, ea, c, n, k = 3000) => p.evaluate(([t, ea, c, n, k]) => { let ef = 0, tot = 0; for (let r = 0; r < 4; r++) { SIM.qColisoes._ult.poe(t, ea, c, n); SIM.qColisoes._ult.passos(k); const e = SIM.qColisoes._ult.est(); ef += e.efet; tot += e.total; } return { fr: ef / tot, tot, teor: SIM.qColisoes._ult.est().teor }; }, [t, ea, c, n, k]);
    const dg = await p.evaluate(() => { const d = SIM.qColisoes._diag; d.n = d.s2 = d.c1 = d.c25 = 0; for (let k = 0; k < 6; k++) { SIM.qColisoes._ult.poe(300, 100, false, 140); SIM.qColisoes._ult.passos(2400); } return Object.assign({}, d); });
    ok(perto(dg.s2 / dg.n / 16200, 1, 0.03) && Math.abs(dg.c1 / dg.n - Math.exp(-1)) < 0.015 && Math.abs(dg.c25 / dg.n - Math.exp(-2.5)) < 0.008, 'F04: sem reação (' + dg.n + ' choques), a fração com energia ≥ 1 RT é ' + (dg.c1 / dg.n).toFixed(3) + ' (exp(−1) = 0,368) e ≥ 2,5 RT é ' + (dg.c25 / dg.n).toFixed(4) + ' (exp(−2,5) = 0,0821)');
    let r = await col(300, 1, false, 140); ok(perto(r.teor, Math.exp(-1), 1e-6) && r.fr > 0.24 && r.fr < 0.40, 'F04: com reação, barreira 1 RT a 300 K → fração efetiva ' + r.fr.toFixed(3) + ' (prevista 0,368; fica abaixo porque as rápidas reagem primeiro)');
    const r2 = await col(300, 2.5, false, 140); ok(r2.fr < r.fr * 0.5, 'F04: barreira maior (2,5 RT) → fração bem menor: ' + r2.fr.toFixed(3));
    const r3 = await col(600, 2.5, false, 140); ok(r3.fr > r2.fr * 2, 'F04: dobrar a temperatura com a mesma barreira → fração ' + r3.fr.toFixed(3) + ' (mais que o dobro)');
    const r4 = await col(300, 2.5, true, 140); ok(perto(r4.teor, Math.exp(-1.25), 1e-6) && r4.fr > r2.fr * 2, 'F04: catalisador (barreira pela metade) a 300 K → fração ' + r4.fr.toFixed(3) + ', sem mudar a temperatura');
    ok(perto(await p.evaluate(() => SIM.arrhenius(50, 300, 310)), 1.909, 0.002) && perto(await p.evaluate(() => SIM.arrhenius(100, 300, 310)), 3.64, 0.003), 'F04: Arrhenius, 300 → 310 K: 1,91 vez com 50 kJ/mol e 3,64 com 100 kJ/mol'); }
  // ----- F05: ordem de reação -----
  if (temas.has('F05')) { await abre('F05');
    const od = (n, a, k) => p.evaluate(([n, a, k]) => { SIM.qOrdem._ult.poe(n, a, k); return SIM.qOrdem._ult.est(); }, [n, a, k]);
    const o0 = await od(0, 1, 0.1), o1 = await od(1, 1, 0.1), o2 = await od(2, 1, 0.1);
    ok(perto(o0.meia, 5) && perto(o1.meia, 6.931, 0.001) && perto(o2.meia, 10), 'F05: [A]₀ = 1,00 e k = 0,100 → meias-vidas 5,00 s (ordem 0), 6,93 s (ordem 1), 10,0 s (ordem 2)');
    ok(o0.c10 === 0 && perto(o1.c10, 0.3679, 0.001) && perto(o2.c10, 0.5), 'F05: em t = 10 s restam 0 (ordem 0: acabou), 0,368 (ordem 1) e 0,500 mol/L (ordem 2)');
    const d1 = await od(1, 2, 0.1), d0 = await od(0, 2, 0.1), d2 = await od(2, 2, 0.1);
    ok(perto(d1.meia, o1.meia) && perto(d0.meia, 2 * o0.meia) && perto(d2.meia, o2.meia / 2), 'F05: dobrando [A]₀, a meia-vida não muda na ordem 1, dobra na ordem 0 e cai pela metade na ordem 2');
    await p.waitForTimeout(200); const l5 = await leitor('lab-ordem'); ok(/\[A\]²/.test(l5['lei de velocidade']) && /L\/\(mol·s\)/.test(l5['unidade de k']), 'F05: o mostrador dá a lei e a unidade de k da ordem escolhida → ' + l5['lei de velocidade'] + ' · ' + l5['unidade de k']); }
  // ----- F06: equilíbrio dinâmico -----
  if (temas.has('F06')) { await abre('F06');
    const eqv = (kd, ki, f, k = 3600) => p.evaluate(([kd, ki, f, k]) => { let s = 0, n = 0; for (let r = 0; r < 6; r++) { SIM.qEquilibrio._ult.poe(kd, ki, f); SIM.qEquilibrio._ult.passos(k); for (let j = 0; j < 20; j++) { SIM.qEquilibrio._ult.passos(30); s += SIM.qEquilibrio._ult.est().fb; n++; } } const e = SIM.qEquilibrio._ult.est(); return { fb: s / n, K: e.K, prev: e.prev, idas: e.idas3, voltas: e.voltas3 }; }, [kd, ki, f, k]);
    const a1 = await eqv(0.3, 0.1, 0), b1 = await eqv(0.3, 0.1, 1);
    ok(perto(a1.K, 3) && perto(a1.prev, 0.75) && Math.abs(a1.fb - 0.75) < 0.03 && Math.abs(b1.fb - 0.75) < 0.03, 'F06: kd = 0,30 e ki = 0,10 (K = 3) → 75% de B, partindo só de A (' + a1.fb.toFixed(3) + ') ou só de B (' + b1.fb.toFixed(3) + ')');
    const c1 = await eqv(0.1, 0.1, 0); ok(Math.abs(c1.fb - 0.5) < 0.03, 'F06: constantes iguais (K = 1) → metade de cada → ' + c1.fb.toFixed(3));
    ok(a1.idas > 5 && a1.voltas > 5 && Math.abs(a1.idas - a1.voltas) < 0.6 * Math.max(a1.idas, a1.voltas), 'F06: no equilíbrio as duas reações continuam e empatam (A → B: ' + a1.idas + ' e B → A: ' + a1.voltas + ' nos últimos 3 s)');
    ok(perto(await p.evaluate(() => SIM.eqAB.B(0.3, 0.1, 0, 2.5)), 0.75 * (1 - Math.exp(-1)), 1e-6), 'F06: a curva prevista chega a 63% do caminho em 1/(kd + ki) = 2,5 s'); }
  // ----- F07: Le Chatelier -----
  if (temas.has('F07')) { await abre('F07');
    const lc = (acoes) => p.evaluate((acoes) => { const u = SIM.qLeChatelier._ult; u.zera(); u.passos(300); const sai = [u.est()]; for (const a of acoes) { u.acao(a); sai.push(u.est()); u.passos(1500); sai.push(u.est()); } return sai; }, acoes);
    const prev = (n0, V, T) => p.evaluate(([n0, V, T]) => SIM.n2o4.eq(n0, V, T), [n0, V, T]);
    const i0 = (await lc([]))[0]; ok(perto(i0.K, 6.53e-3, 1e-3) && perto(i0.alfa, 0.120, 0.01) && perto(i0.Q, i0.K, 0.01), 'F07: começo em equilíbrio: 0,100 mol em 1,00 L a 25 °C, K = 6,53·10⁻³, 12,0% dissociado → ' + (100 * i0.alfa).toFixed(1) + '%');
    const c = await lc(['comp']), pc = await prev(0.1, 0.5, 298.15); ok(perto(c[1].Q / c[1].K, 2, 0.01) && perto(c[2].alfa, pc.alfa, 0.01) && perto(c[2].alfa, 0.086, 0.01) && c[2].n2 < c[0].n2, 'F07: comprimir à metade dobra Q; o equilíbrio vai para o N₂O₄ → ' + (100 * c[2].alfa).toFixed(1) + '% dissociado (previsto 8,6%)');
    const e = await lc(['exp']); ok(perto(e[1].Q / e[1].K, 0.5, 0.01) && perto(e[2].alfa, 0.165, 0.01), 'F07: expandir ao dobro divide Q por 2; vai para o NO₂ → ' + (100 * e[2].alfa).toFixed(1) + '% (previsto 16,5%)');
    const q = await lc(['quente']); ok(perto(q[1].K, 2.61e-2, 0.01) && perto(q[1].Q, q[0].Q, 1e-6) && perto(q[2].alfa, 0.225, 0.01), 'F07: esquentar 20 °C muda K (2,61·10⁻²) e não mexe em Q na hora; no fim, ' + (100 * q[2].alfa).toFixed(1) + '% (previsto 22,5%)');
    const f = await lc(['frio']); ok(perto(f[1].K, 1.33e-3, 0.01) && perto(f[2].alfa, 0.056, 0.02), 'F07: esfriar 20 °C → K = 1,33·10⁻³ e ' + (100 * f[2].alfa).toFixed(1) + '% (previsto 5,6%)');
    const m = await lc(['mais1']), pm = await prev(0.15, 1, 298.15); ok(m[1].Q < m[1].K && perto(m[2].n2, pm.n2, 0.01) && m[2].n1 > m[0].n1 && m[2].n1 < m[1].n1, 'F07: + N₂O₄ → Q < K, anda para a direita e gasta só PARTE do que entrou (N₂O₄: ' + m[0].n1.toFixed(4) + ' → ' + m[1].n1.toFixed(4) + ' → ' + m[2].n1.toFixed(4) + ' mol)');
    const m2 = await lc(['mais2']); ok(m2[1].Q > m2[1].K && m2[2].n2 < m2[1].n2 && perto(m2[2].Q, m2[2].K, 0.01), 'F07: + NO₂ → Q > K, anda para a esquerda até Q = K');
    const ci = await lc(['cat', 'inerte']); ok(perto(ci[1].Q, ci[0].Q, 1e-6) && perto(ci[4].n2, ci[0].n2, 0.002) && perto(ci[3].Q, ci[3].K, 0.01), 'F07: catalisador e gás inerte a volume fixo não deslocam nada (NO₂ fica em ' + ci[4].n2.toFixed(4) + ' mol)');
    await p.evaluate(() => { SIM.qLeChatelier._ult.acao('cat'); SIM.qLeChatelier._ult.zera(); }); }
  // ----- F08: escala de pH -----
  if (temas.has('F08')) { await abre('F08');
    const ph = (k, l, t) => p.evaluate(([k, l, t]) => { SIM.qPH._ult.poe(k, l, t); return SIM.qPH._ult.est(); }, [k, l, t]);
    const a1 = await ph('HCl', -2, 25), a2 = await ph('NaOH', -3, 25); ok(perto(a1.pH, 2, 1e-4) && perto(a2.pH, 11, 1e-4) && perto(a2.pOH, 3, 1e-4), 'F08: HCl 0,010 mol/L → pH 2,00; NaOH 0,0010 mol/L → pOH 3,00 e pH 11,00');
    const a3 = await ph('HCl', -8, 25); ok(Math.abs(a3.pH - 6.978) < 0.002 && a3.ingenuo === 8, 'F08: HCl 10⁻⁸ mol/L → pH ' + a3.pH.toFixed(3) + ' (a conta direta daria 8; o laboratório avisa)');
    const a4 = await ph('HAc', -1, 25), a5 = await ph('HAc', -5, 25); ok(Math.abs(a4.pH - 2.875) < 0.002 && Math.abs(a4.alfa - 0.0133) < 0.0005 && a5.alfa > 0.7 && a5.alfa < 0.73, 'F08: acético 0,10 mol/L → pH ' + a4.pH.toFixed(2) + ', ' + (100 * a4.alfa).toFixed(1) + '% ionizado; a 10⁻⁵ mol/L, ' + (100 * a5.alfa).toFixed(0) + '% (Ostwald)');
    const a6 = await ph('NH3', -1, 25); ok(Math.abs(a6.pH - 11.125) < 0.002, 'F08: amônia 0,10 mol/L → pH ' + a6.pH.toFixed(2));
    const a7 = await ph('agua', -2, 50), a8 = await ph('agua', -2, 100), a9 = await ph('agua', -2, 0); ok(Math.abs(a7.pH - 6.638) < 0.002 && Math.abs(a8.pH - 6.125) < 0.002 && Math.abs(a9.pH - 7.475) < 0.002 && perto(a7.h, a7.oh, 1e-6), 'F08: água pura: pH ' + a9.pH.toFixed(2) + ' a 0 °C, ' + a7.pH.toFixed(2) + ' a 50 °C e ' + a8.pH.toFixed(2) + ' a 100 °C, sempre com [H⁺] = [OH⁻]');
    await p.evaluate(() => { SIM.qPH._ult.poe('agua', -2, 50); document.querySelector('#lab-ph [data-k=HAc]').click(); }); const a10 = await p.evaluate(() => SIM.qPH._ult.est()); ok(a10.T === 25, 'F08: escolher um eletrólito fraco volta a temperatura para 25 °C (as constantes são de 25 °C)'); await ph('HCl', -2, 25); }
  // ----- F09: tampão -----
  if (temas.has('F09')) { await abre('F09');
    const tp = (pr, a, b, f) => p.evaluate(([pr, a, b, f]) => { SIM.qTampao._ult.poe(pr, a, b, f); return SIM.qTampao._ult.est(); }, [pr, a, b, f]);
    const t0 = await tp('ac', 0.1, 0.1, 0), t1 = await tp('ac', 0.1, 0.1, 0.01), t2 = await tp('ac', 0.1, 0.1, -0.01); ok(Math.abs(t0.pH - 4.745) < 0.002 && Math.abs(t1.pH - 4.658) < 0.002 && Math.abs(t2.pH - 4.832) < 0.002 && perto(t1.agua, 2, 1e-3) && perto(t2.agua, 12, 1e-3), 'F09: tampão acético 0,10/0,10: pH ' + t0.pH.toFixed(2) + '; com 0,010 mol de HCl, ' + t1.pH.toFixed(2) + ' (a água vai a 2,00); com NaOH, ' + t2.pH.toFixed(2) + ' (a água vai a 12,00)');
    ok(Math.abs(t1.hh - t1.pH) < 0.005, 'F09: dentro da faixa, a fórmula de Henderson-Hasselbalch (' + t1.hh.toFixed(3) + ') coincide com o cálculo exato (' + t1.pH.toFixed(3) + ')');
    const t3 = await tp('ac', 0.1, 0.1, 0.1), t4 = await tp('ac', 0.1, 0.1, 0.11); ok(t3.estourou && t3.hh === null && Math.abs(t3.pH - 2.72) < 0.01 && Math.abs(t4.pH - 1.99) < 0.01, 'F09: com 0,100 mol de HCl o acetato acaba (pH ' + t3.pH.toFixed(2) + ', fórmula "não vale"); com 0,110 mol, pH ' + t4.pH.toFixed(2));
    const t5 = await tp('ac', 0, 0.1, 0), t6 = await tp('am', 0.1, 0, 0); ok(Math.abs(t5.pH - 8.872) < 0.002 && Math.abs(t6.pH - 5.128) < 0.002, 'F09: hidrólise: acetato de sódio 0,10 mol/L → pH ' + t5.pH.toFixed(2) + '; cloreto de amônio 0,10 mol/L → pH ' + t6.pH.toFixed(2));
    const t7 = await tp('am', 0.1, 0.1, 0); ok(Math.abs(t7.pH - 9.255) < 0.002, 'F09: tampão amônio/amônia 0,10/0,10 → pH ' + t7.pH.toFixed(2) + ' (= pKa do amônio)');
    await tp('ac', 0.1, 0.1, 0); await p.click('#lab-tampao [data-a=h]'); await p.click('#lab-tampao [data-a=h]'); const t8 = await p.evaluate(() => SIM.qTampao._ult.est()); ok(perto(t8.forte, 0.02, 1e-9) && Math.abs(t8.pH - (4.7447 + Math.log10(0.08 / 0.12))) < 0.003, 'F09: dois cliques em "+ HCl" somam 0,020 mol → pH ' + t8.pH.toFixed(2)); }
  // ----- F10: Kps -----
  if (temas.has('F10')) { await abre('F10');
    const kp = (k, a, b) => p.evaluate(([k, a, b]) => { SIM.qKps._ult.poe(k, a, b); return SIM.qKps._ult.est(); }, [k, a, b]);
    const k1 = await kp('AgCl', -3, -3); ok(k1.ppt && perto(k1.c1 * k1.c2, 1.77e-10, 1e-6) && perto(k1.c1, 1.330e-5, 1e-3) && perto(k1.s, 1.330e-5, 1e-3), 'F10: AgCl com 10⁻³ de cada íon: precipita e sobram ' + k1.c1.toExponential(2) + ' mol/L de cada (= solubilidade em água pura)');
    const k2 = await kp('AgCl', -6, -6); ok(!k2.ppt && k2.x === 0 && perto(k2.Q, 1e-12, 1e-9), 'F10: AgCl com 10⁻⁶ de cada: Q = 10⁻¹² < Kps, não precipita');
    const k3 = await kp('CaF2', -2, -2); ok(k3.ppt && perto(k3.c1 * k3.c2 * k3.c2, 3.9e-11, 1e-6) && perto(k3.x, 4.956e-3, 1e-3) && k3.c2 < k3.c1 / 10, 'F10: CaF₂ com 10⁻² de cada: o fluoreto (em falta, sai de 2 em 2) quase some: ' + k3.c2.toExponential(2) + ' contra ' + k3.c1.toExponential(2) + ' de Ca²⁺');
    const k4 = await kp('Ag2CrO4', -2, -3); ok(k4.ppt && perto(k4.c1 * k4.c1 * k4.c2, 1.12e-12, 1e-6), 'F10: Ag₂CrO₄: as concentrações finais devolvem o Kps com o expoente 2 na prata');
    ok(perto(await p.evaluate(() => SIM.kps.s('MgOH2')), 1.119e-4, 1e-3) && perto(await p.evaluate(() => SIM.kps.comum('AgCl', 0.1)), 1.77e-9, 1e-4), 'F10: Mg(OH)₂: s = 1,12·10⁻⁴ mol/L; AgCl em Cl⁻ 0,10 mol/L: s = 1,77·10⁻⁹ mol/L (íon comum)');
    /* a resposta em notação "1,33e-5" tem de ser aceita no campo */
    const acc = await p.evaluate(() => { const ex = [...document.querySelectorAll('.ex')].find((e) => e.querySelector('.ex-num')); const t = ex._d.num.v.toExponential(2).replace('.', ','); ex.querySelector('.ex-num input').value = t; ex.querySelector('.ex-num button').click(); const a = t + ' ' + ex.querySelector('.ex-fb').textContent; ex.querySelector('.ex-num input').value = t.replace('e', '·10^'); ex.querySelector('.ex-num button').click(); return [a, ex.querySelector('.ex-fb').textContent]; }); ok(/Certo/.test(acc[0]) && /Certo/.test(acc[1]), 'F10: o exercício 1 aceita a resposta digitada em notação científica (com "e" ou com "·10^") → ' + acc.join(' / ')); }
  //MAIS
  // ----- gabaritos: em todo exercício de alternativas, clicar na letra do gabarito tem de dar "certo" -----
  for (const cod of ['F01', 'F02', 'F03', 'F04', 'F05', 'F06', 'F07', 'F08', 'F09', 'F10'].filter((c) => temas.has(c))) { await p.goto(RAIZ + '#/quimica/' + cod); await p.waitForTimeout(1300);
    const g = await p.evaluate(() => { const o = { n: 0, ruins: [] }; document.querySelectorAll('.ex').forEach((e) => { const bts = [...e.querySelectorAll('.alts .alt')]; if (!bts.length) return; o.n++; const d = e._d || {}; const bt = bts.find((x) => x.dataset.l === d.certa); if (!bt) return o.ruins.push((e.id || '?') + ' sem letra ' + d.certa); bt.click(); if (!bt.classList.contains('certa')) o.ruins.push((e.id || '?') + ' não aceitou'); }); return o; });
    if (g.n) ok(g.ruins.length === 0, cod + ': os ' + g.n + ' exercícios de alternativas aceitam a letra do gabarito' + (g.ruins.length ? ' → ' + g.ruins.join('; ') : '')); }
  ok(erros.length === 0, 'sem erros de JS' + (erros.length ? ' → ' + erros.slice(0, 3).join(' | ') : ''));
  console.log('FALHAS (' + falhas + '):'); await b.close(); process.exit(falhas ? 1 : 0);
})();
