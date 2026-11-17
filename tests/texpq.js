// texpq.js: experimentos da Química (aba Experimentos, EQ..). Página montada, sem fórmula quebrada, simulação animando, e a física de cada um
// conferida com semente fixa (mesma semente, mesmo resultado: o teste não depende de sorte). Uso: node tests/texpq.js [EQ01 EQ02 ...]
const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); await require('./adm')(p);
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(RAIZ + '#/quimica-experimentos'); await p.waitForTimeout(700);
  let cods = process.argv.slice(2);
  if (!cods.length) cods = await p.evaluate(() => window.CATALOGO.filter((m) => m.area === 'quiexp').flatMap((m) => m.temas.filter((t) => t[3]).map((t) => t[0])));
  const temas = new Set(cods); let falhas = 0;
  const ok = (c, msg) => { if (!c) falhas++; console.log((c ? 'ok ' : 'FALHA ') + msg); };
  const perto = (a, v, tol) => Math.abs(a - v) <= tol;
  const abre = async (c) => { await p.goto(RAIZ + '#/quimica/' + c); await p.waitForTimeout(1500); };
  for (const c of cods) {
    await abre(c);
    const foto = () => p.evaluate(() => { const l = document.querySelector('.lab'); const s = l && l.querySelector('svg, canvas'); return !s ? '' : s.tagName === 'CANVAS' ? s.toDataURL().slice(-200) : s.innerHTML; });
    const a = await foto(); await p.waitForTimeout(700); const z = await foto();
    const r = await p.evaluate(() => ({ katex: document.querySelectorAll('.katex-error').length, lab: document.querySelectorAll('.lab').length, texto: document.querySelector('#pagina').innerText.length, ex: document.querySelectorAll('.ex').length, cru: /\\ce\{|\$[^$]{1,80}\$|\{,\}/.test(document.querySelector('#pagina').innerText) }));
    ok(r.katex === 0 && r.lab === 1 && !!a && a !== z && r.texto > 1500 && r.ex === 0 && !r.cru, c + ': página montada, sem fórmula quebrada nem TeX solto, simulação animando, sem exercícios ' + JSON.stringify(r));
  }
  // ----- EQ01: difusão e efusão -----
  if (temas.has('EQ01')) { await abre('EQ01');
    const ef = (ga, gb, seg) => p.evaluate(([ga, gb, seg]) => { const u = SIM.eqDifusao._ult; u.semente(7); u.poe('ef', ga, gb); u.semente(7); u.avanca(seg); return u.est(); }, [ga, gb, seg]);
    const e1 = await ef('H2', 'O2', 600), e2 = await ef('N2', 'CO2', 3600), e3 = await ef('O2', 'O2', 600);
    ok(perto(e1.graham, 4, 1e-9) && e1.cB > 80 && Math.abs(e1.razao / 4 - 1) < 0.12, 'EQ01 efusão H₂ × O₂: ' + e1.cA + ' e ' + e1.cB + ' moléculas; razão ' + e1.razao.toFixed(2) + ' (Graham: 4,00), a menos de 12%');
    ok(Math.abs(e2.razao / e2.graham - 1) < 0.12 && Math.abs(e3.razao - 1) < 0.12, 'EQ01 efusão N₂ × CO₂: razão ' + e2.razao.toFixed(2) + ' (Graham: ' + e2.graham.toFixed(2) + '); dois gases iguais: ' + e3.razao.toFixed(2) + ' (esperado 1)');
    const e4 = await p.evaluate(() => { const u = SIM.eqDifusao._ult; u.semente(7); u.poe('ef', 'H2', 'O2'); u.denso(true); u.semente(7); u.avanca(600); return u.est(); });
    ok(e1.razao > 2.5 * e3.razao && e4.denso && !e1.denso && e4.razao < 3.4 && e4.razao > 1.5, 'EQ01: o teste distingue os casos (H₂ × O₂ rarefeito ' + e1.razao.toFixed(2) + '; dois gases iguais ' + e3.razao.toFixed(2) + '); com o gás denso, a razão cai para ' + e4.razao.toFixed(2) + ' (abaixo de Graham)');
    const d = await p.evaluate(() => { const u = SIM.eqDifusao._ult; u.semente(3); u.poe('dif', 'H2', 'CO2'); u.semente(3); u.avanca(3); const fechado = u.est(); u.abre(); u.avanca(4); const cedo = u.est(); u.avanca(120); return { fechado, cedo, fim: u.est() }; });
    ok(d.fechado.aD === 0 && d.fechado.bE === 0 && d.fechado.mist === 0 && d.cedo.aD > d.cedo.bE && perto(d.fim.aD, 0.5, 0.2) && perto(d.fim.bE, 0.5, 0.2) && d.fim.mist > 0.75, 'EQ01 difusão H₂ × CO₂: com a parede, nada passa; 4 s depois de tirar, o leve passou mais (' + Math.round(100 * d.cedo.aD) + '% contra ' + Math.round(100 * d.cedo.bE) + '%); no fim, mistura de ' + Math.round(100 * d.fim.mist) + '%'); }
  // ----- EQ02: pistão -----
  if (temas.has('EQ02')) { await abre('EQ02');
    const pis = (o, seg) => p.evaluate(([o, seg]) => { const u = SIM.eqPistao._ult; u.semente(11); u.poe(o); u.semente(11); u.avanca(15); const hs = [], rs = []; for (let i = 0; i < seg; i++) { u.avanca(1); const e = u.est(); hs.push(e.h); rs.push(e.razao); } const e = u.est(); return { ...e, hmed: hs.reduce((a, x) => a + x, 0) / hs.length, rmed: rs.reduce((a, x) => a + x, 0) / rs.length }; }, [o, seg]);
    const t1 = await pis({ livre: false, T: 300, N: 60, h: 120 }, 60), t2 = await pis({ livre: false, T: 600, N: 60, h: 120 }, 60);
    ok(perto(t1.rmed, 1, 0.05) && perto(t2.rmed, 1, 0.05) && perto(t2.Pm / t1.Pm, 2, 0.2), 'EQ02 pistão travado: PV/NkT = ' + t1.rmed.toFixed(3) + ' a 300 K e ' + t2.rmed.toFixed(3) + ' a 600 K; dobrar T multiplica a pressão por ' + (t2.Pm / t1.Pm).toFixed(2));
    const l1 = await pis({ livre: true, T: 300, N: 60, peso: 4050 }, 60), l2 = await pis({ livre: true, T: 450, N: 60, peso: 4050 }, 60), l3 = await pis({ livre: true, T: 300, N: 60, peso: 8100 }, 60), l4 = await pis({ livre: true, T: 300, N: 90, peso: 4050 }, 60);
    ok(perto(l1.hTeor, 120, 1e-9) && Math.abs(l1.hmed / 120 - 1) < 0.06 && Math.abs(l2.hmed / 180 - 1) < 0.06 && Math.abs(l3.hmed / 60 - 1) < 0.06 && Math.abs(l4.hmed / 180 - 1) < 0.06, 'EQ02 pistão livre: altura média ' + l1.hmed.toFixed(1) + ' (previsto 120); a 450 K, ' + l2.hmed.toFixed(1) + ' (180); com o dobro do peso, ' + l3.hmed.toFixed(1) + ' (60); com 90 moléculas, ' + l4.hmed.toFixed(1) + ' (180)'); }
  // ----- EQ03: Maxwell-Boltzmann -----
  if (temas.has('EQ03')) { await abre('EQ03');
    const m = await p.evaluate(() => { const u = SIM.eqMaxwell._ult; u.semente(5); u.poe('N2', 300); u.semente(5); const e0 = u.est(), E0 = u.energia(); u.avanca(25); const rs = []; for (let i = 0; i < 20; i++) { u.avanca(0.5); rs.push(u.est().razao); } const e1 = u.est(); return { e0, e1, dE: Math.abs(u.energia() - E0) / E0, rmed: rs.reduce((a, x) => a + x, 0) / rs.length }; });
    ok(perto(m.e0.razao, 1, 1e-9) && m.e0.cols === 0 && perto(m.rmed, Math.sqrt(Math.PI) / 2, 0.02) && m.e1.cols > 2000 && m.dE < 1e-9, 'EQ03: começa com v média / v rms = 1,000; depois de ' + m.e1.cols + ' colisões, ' + m.rmed.toFixed(3) + ' (Maxwell-Boltzmann 2D: 0,886); energia conservada (variação ' + m.dE.toExponential(1) + ')');
    const h = m.e1.hist, pico = h.indexOf(Math.max(...h)), soma = h.reduce((a, x) => a + x, 0);
    ok(pico >= 3 && pico <= 8 && soma > 0.97 && h[23] < h[pico] / 8 && h[0] < h[pico] / 2, 'EQ03: histograma com pico perto de v_rms/√2 (faixa ' + pico + ' de 24), cauda de rápidas e ' + (100 * soma).toFixed(0) + '% das moléculas dentro do gráfico');
    const v = await p.evaluate(() => { const g = SIM.expGas.vReal; return [g(300, 28), g(300, 2), g(1200, 28)]; });
    ok(perto(v[0].vp, 422.1, 0.2) && perto(v[0].vm, 476.3, 0.2) && perto(v[0].vrms, 516.9, 0.2) && perto(v[1].vrms / v[0].vrms, Math.sqrt(14), 1e-6) && perto(v[2].vrms / v[0].vrms, 2, 1e-6), 'EQ03: N₂ a 300 K: 422, 476 e 517 m/s; H₂ é √14 vezes mais rápido; quadruplicar T dobra a velocidade'); }
  // ----- EQ04: gás real -----
  if (temas.has('EQ04')) { await abre('EQ04');
    const b2 = await p.evaluate(() => [0.8, 1, 1.5, 2, 4].map((t) => SIM.expGas.B2(t)));
    ok(perto(b2[0], -1.8954, 0.003) && perto(b2[1], -0.9929, 0.003) && perto(b2[2], -0.0144, 0.003) && perto(b2[3], 0.3909, 0.003) && perto(b2[4], 0.8914, 0.003), 'EQ04: B₂(T) igual ao conferido em Python: ' + b2.map((x) => x.toFixed(3)).join(', ') + ' (muda de sinal perto de T = 1,5: temperatura de Boyle)');
    const md = (r, t, u) => p.evaluate(([r, t, u]) => { const s = SIM.eqReal._ult; s.semente(9); s.poe(r, t); s.semente(9); s.avanca(u); return s.est(); }, [r, t, u]);
    const a = await md(0.05, 1, 300), q = await md(0.05, 4, 300), d = await md(0.6, 2, 120), i = await md(0.3, 0.8, 120);
    ok(perto(a.Z, a.Zvirial, 0.03) && perto(q.Z, q.Zvirial, 0.03) && a.Z < 0.98 && q.Z > 1.02, 'EQ04 pouco denso (ρ = 0,05): frio (T = 1), Z = ' + a.Z.toFixed(3) + ' (virial: ' + a.Zvirial.toFixed(3) + '); quente (T = 4), Z = ' + q.Z.toFixed(3) + ' (virial: ' + q.Zvirial.toFixed(3) + ')');
    ok(d.Z > 1.8 && i.Z < 0.85 && perto(a.kT, 1, 0.08) && perto(d.kT, 2, 0.15) && i.vizinhos > a.vizinhos, 'EQ04: muito denso (ρ = 0,6, T = 2), Z = ' + d.Z.toFixed(2) + ' (repulsão); frio e médio (ρ = 0,3, T = 0,8), Z = ' + i.Z.toFixed(2) + ' (atração); o termostato segura a temperatura pedida'); }
  ok(errs.length === 0, errs.length ? 'ERROS de JS: ' + errs.join(' | ') : 'sem erros de JS');
  console.log('FALHAS (' + falhas + '):');
  await b.close(); process.exit(falhas ? 1 : 0);
})();
