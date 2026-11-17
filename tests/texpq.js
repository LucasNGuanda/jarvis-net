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
    const parado = ['EQ08', 'EQ20', 'EQ12'].includes(c); /* EQ20: construtor, só gira se pedir */ /* só se mexe com a torneira aberta (conferido mais abaixo) */
    ok(r.katex === 0 && r.lab === 1 && !!a && (parado || a !== z) && r.texto > 1500 && r.ex === 0 && !r.cru, c + ': página montada, sem fórmula quebrada nem TeX solto, simulação animando, sem exercícios ' + JSON.stringify(r));
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
  // ----- EQ05: colisões e energia de ativação -----
  if (temas.has('EQ05')) { await abre('EQ05');
    const col = (T, E, seg) => p.evaluate(([T, E, seg]) => { const u = SIM.eqColisoes._ult; u.semente(4); u.poe(T, E, false); u.semente(4); u.avanca(seg); return u.est(); }, [T, E, seg]);
    const a = await col(300, 2, 240), b2 = await col(600, 2, 240), c = await col(300, 4, 600);
    ok(a.nAB > 3000 && perto(a.fr, Math.exp(-2), 0.02) && perto(b2.fr, Math.exp(-1), 0.03) && perto(c.fr, Math.exp(-4), 0.006) && a.resta === 1, 'EQ05 só contando: Ea = 2 a 300 K, ' + (100 * a.fr).toFixed(1) + '% eficazes em ' + a.nAB + ' choques (Arrhenius: 13,5%); a 600 K, ' + (100 * b2.fr).toFixed(1) + '% (36,8%); Ea = 4, ' + (100 * c.fr).toFixed(2) + '% (1,83%)');
    ok(b2.nAB / a.nAB > 1.2 && b2.nAB / a.nAB < 1.65, 'EQ05: dobrar T aumenta os choques só ' + (b2.nAB / a.nAB).toFixed(2) + ' vezes (√2 = 1,41), mas a fração eficaz ' + (b2.fr / a.fr).toFixed(2) + ' vezes');
    const r = await p.evaluate(() => { const u = SIM.eqColisoes._ult; u.semente(4); u.poe(300, 2, true); u.semente(4); u.avanca(5); const e1 = u.est(); u.avanca(60); return [e1, u.est()]; });
    ok(r[0].resta < 1 && r[1].resta < r[0].resta && r[1].resta < 0.4, 'EQ05 reagindo: o reagente cai para ' + Math.round(100 * r[0].resta) + '% em 5 s e ' + Math.round(100 * r[1].resta) + '% em 65 s (cada vez mais devagar)'); }
  // ----- EQ06: catalisador -----
  if (temas.has('EQ06')) { await abre('EQ06');
    const k = await p.evaluate(() => { const u = SIM.eqCatalisador._ult; u.semente(6); u.poe(300, 2); u.semente(6); u.avanca(400, false); const conta = u.est(); u.semente(6); u.poe(300, 2); u.semente(6); u.avanca(25); const meio = u.est(); u.avanca(900); return { conta, meio, fim: u.est() }; });
    ok(perto(k.conta.ganho, Math.exp(2), 1e-9) && Math.abs((k.conta.f2 / k.conta.f1) / Math.exp(2) - 1) < 0.2 && Math.abs(k.conta.n2 / k.conta.n1 - 1) < 0.08, 'EQ06 só contando: os choques são iguais nas duas caixas (' + k.conta.n1 + ' e ' + k.conta.n2 + '); a fração eficaz com catalisador é ' + (k.conta.f2 / k.conta.f1).toFixed(1) + ' vezes maior (previsto e² = 7,4)');
    ok(k.meio.r2 > k.meio.r1 + 0.2 && k.fim.r1 > 0.9 && k.fim.r2 > 0.97, 'EQ06 reagindo: em 25 s, ' + Math.round(100 * k.meio.r1) + '% sem e ' + Math.round(100 * k.meio.r2) + '% com catalisador; no fim as duas chegam ao mesmo lugar (' + Math.round(100 * k.fim.r1) + '% e ' + Math.round(100 * k.fim.r2) + '%)'); }
  // ----- EQ07: Le Chatelier -----
  if (temas.has('EQ07')) { await abre('EQ07');
    const lc = await p.evaluate(() => { const u = SIM.eqLeChatelier._ult; u.semente(8); const N0 = u.est().N; u.avanca(60); const a = u.media(240); u.poe(300, 0.5); u.avanca(60); const b = u.media(240); const N1 = u.est().N; u.poe(360, 0.5); u.avanca(60); const c = u.media(240); u.poe(300, 1); u.avanca(60); const d0 = u.media(120); u.injeta(20); const logo = u.est(); u.avanca(60); const d1 = u.media(120); return { N0, N1, a, b, c, d0, logo, d1, N2: u.est().N }; });
    ok(lc.N0 === 80 && lc.N1 === 80 && lc.N2 === 100, 'EQ07: os átomos de N se conservam (80 antes e depois de apertar e aquecer; 100 depois de injetar 20 NO₂)');
    ok(Math.abs(lc.b.Q / lc.a.Q - 1) < 0.25 && lc.b.fr < lc.a.fr - 0.04, 'EQ07 apertar (volume 1 → 0,5, mesma T): Q médio ' + lc.a.Q.toFixed(1) + ' → ' + lc.b.Q.toFixed(1) + ' (o mesmo K); a fração de NO₂ cai de ' + Math.round(100 * lc.a.fr) + '% para ' + Math.round(100 * lc.b.fr) + '%');
    ok(lc.c.fr > lc.b.fr + 0.1 && lc.c.Q > 2 * lc.b.Q, 'EQ07 aquecer (300 → 360 K): a fração de NO₂ sobe para ' + Math.round(100 * lc.c.fr) + '% e Q vai a ' + lc.c.Q.toFixed(1) + ' (K mudou)');
    ok(lc.logo.nNO2 > lc.d1.fr * 0 && Math.abs(lc.d1.Q / lc.d0.Q - 1) < 0.3, 'EQ07 injetar NO₂: depois de assentar, Q volta de ' + lc.d0.Q.toFixed(1) + ' para ' + lc.d1.Q.toFixed(1)); }
  // ----- EQ08: bureta -----
  if (temas.has('EQ08')) { await abre('EQ08');
    const bu = await p.evaluate(() => { const u = SIM.eqBureta._ult; u.poe('hcl', 'A', 'fenolftaleina'); const e0 = u.est(); u.torneira(10); u.avanca(25.2); u.torneira(0); u.avanca(2); const e1 = u.est(); u.gota(); u.avanca(2); const e2 = u.est(); u.torneira(12); u.avanca(10); u.torneira(0); u.avanca(2); const e3 = u.est(); u.poe('hac', 'B', 'alaranjado_de_metila'); u.torneira(12); u.avanca(12); u.torneira(0); u.avanca(2); return { e0, e1, e2, e3, e4: u.est() }; });
    ok(bu.e0.v === 0 && perto(bu.e0.pH, 1.301, 0.005) && bu.e1.ngotas === Math.round(bu.e1.v / 0.05) && bu.e1.v > 12.3 && bu.e1.v <= 12.65 && bu.e1.noAr === 0, 'EQ08: HCl amostra A começa em pH 1,30; torneira a 10 gotas/s por 25 s → ' + bu.e1.v.toFixed(2) + ' mL (' + bu.e1.ngotas + ' gotas de 0,05 mL)');
    ok(perto(bu.e2.v - bu.e1.v, 0.05, 1e-9) && bu.e3.v > 18 && bu.e3.pH > 11.5 && bu.e3.cor === 'rosa' && bu.e3.npts > 300, 'EQ08: uma gota soma 0,05 mL; passando do ponto (' + bu.e3.v.toFixed(1) + ' mL), pH ' + bu.e3.pH.toFixed(1) + ' e cor rosa; a curva tem ' + bu.e3.npts + ' pontos');
    ok(bu.e4.cor === 'amarelo' && bu.e4.v < bu.e4.veq - 4 && bu.e4.pH < 6, 'EQ08: ácido acético com alaranjado de metila já está amarelo em ' + bu.e4.v.toFixed(1) + ' mL (pH ' + bu.e4.pH.toFixed(1) + '), longe da equivalência em ' + bu.e4.veq + ' mL'); }
  // ----- EQ21: balanceador -----
  if (temas.has('EQ21')) { await abre('EQ21');
    const ba = await p.evaluate(() => { const u = SIM.eqBalanca._ult, out = []; for (let i = 0; i < SIM.EQS.length; i++) { u.poe(i); const um = u.est(); u.poe(i, um.sol); u.avanca(3); const certo = u.est(); u.poe(i, um.sol.map((x) => 2 * x)); const dobro = u.est(); out.push({ i, umOk: um.ok, jaMinimo: um.sol.every((x) => x === 1), certo: certo.minimo && Math.abs(certo.mE - certo.mD) < 1e-6 && Math.abs(certo.ang) < 0.5, dobro: dobro.ok && !dobro.minimo }); } u.poe(0); u.avanca(3); const torto = u.est(); u.clica(0, true); u.clica(2, true); u.avanca(3); return { out, torto, depois: u.est() }; });
    ok(ba.out.length === 19 && ba.out.every((x) => x.certo && x.dobro && (x.umOk === x.jaMinimo)), 'EQ21: nas 19 equações, os coeficientes mínimos dão átomos e massas iguais e balança na horizontal; o dobro é acusado como "dá para simplificar"; com tudo em 1, só passa a que já é 1 : 1');
    ok(Math.abs(ba.torto.ang) > 1 && !ba.torto.ok && ba.depois.minimo && ba.depois.coef.join() === '2,1,2' && Math.abs(ba.depois.ang) < 0.5, 'EQ21: H₂ + O₂ → H₂O com tudo em 1 inclina a balança (' + ba.torto.ang.toFixed(1) + '°); clicando até 2, 1, 2 ela fica na horizontal'); }
  // ----- EQ09: pilha de Daniell -----
  if (temas.has('EQ09')) { await abre('EQ09');
    const d = await p.evaluate(() => { const u = SIM.eqDaniell._ult; u.poe({ fechado: true, ponte: true, R: 2, acel: 600 }); const e0 = u.est(); u.avanca(10); const e1 = u.est(); u.liga(false, true); u.avanca(5); const e2 = u.est(); u.liga(true, false); u.avanca(5); const e3 = u.est(); u.liga(true, true); u.poe({ R: 0.5, acel: 3600 }); u.avanca(60); return { e0, e1, e2, e3, fim: u.est(), nernst: SIM.ELETRO.nernst('Zn', 'Cu', 1.9, 0.1).E }; });
    ok(perto(d.e0.E, 1.1, 1e-9) && perto(d.e0.I, 0.55, 1e-9) && d.e1.E < 1.1 && d.e1.E > 1.05 && perto(d.e1.nZn, d.e1.nCu, 1e-9) && perto(d.e1.nZn, d.e1.ne / 2, 1e-9) && perto(d.e1.cZn + d.e1.cCu, 2, 1e-9), 'EQ09: começa em 1,100 V e 550 mA; depois de ' + Math.round(d.e1.t / 60) + ' min, ' + d.e1.E.toFixed(3) + ' V; mol de Zn gasto = mol de Cu depositado = metade dos elétrons (' + d.e1.nZn.toFixed(4) + ')');
    ok(d.e2.q === d.e1.q && d.e2.I === 0 && d.e2.E > 1 && d.e3.q === d.e1.q && d.e3.I === 0, 'EQ09: com a chave aberta ou sem a ponte salina, corrente zero e nada se gasta (a tensão continua lá: ' + d.e2.E.toFixed(3) + ' V)');
    ok(d.fim.E === 0 && d.fim.cCu === 0 && perto(d.fim.cZn, 2, 1e-6) && perto(d.fim.mZn, 10 - 6.5, 1e-3) && perto(d.fim.mCu, 16.35, 1e-3) && perto(d.nernst, 1.062, 0.001), 'EQ09: pilha gasta: [Cu²⁺] = 0, tensão 0; o zinco perdeu 6,50 g (0,1 mol) e o cobre ganhou 6,35 g; Nernst com 1,9 e 0,1 mol/L: ' + d.nernst.toFixed(3) + ' V'); }
  // ----- EQ10: eletrólise -----
  if (temas.has('EQ10')) { await abre('EQ10');
    const f = await p.evaluate(() => { const e = SIM.eletrolise, u = SIM.eqEletrolise._ult; u.poe('cobre', 2, 60); u.avanca(8.0417); const sim = u.est(); u.liga(false); u.avanca(3); const par = u.est(); u.liga(true); return { a: e('agua', 965), c: e('cobre', 965), n: e('nacl', 965), sim, par }; });
    ok(perto(f.a.ne, 0.0100016, 1e-6) && perto(f.a.cat.mL / f.a.an.mL, 2, 1e-9) && perto(f.a.cat.mL, 122.3, 0.2) && perto(f.a.an.mL, 61.2, 0.2) && perto(f.c.cat.m, 0.3175, 0.0002) && f.c.cat.m === f.c.an.m && perto(f.n.cat.m, 0.230, 0.001) && perto(f.n.an.mL, 122.3, 0.2), 'EQ10 Faraday, 965 C = 0,0100 mol de e⁻: 122 mL de H₂ e 61 mL de O₂ (2 : 1); 0,3175 g de Cu no cátodo e a mesma massa a menos no ânodo; 0,230 g de Na e 122 mL de Cl₂');
    ok(perto(f.sim.q, 965, 3) && perto(f.sim.cat.m, 0.3175, 0.001) && f.par.q === f.sim.q, 'EQ10 na simulação: 2 A por ' + Math.round(f.sim.t) + ' s = ' + Math.round(f.sim.q) + ' C → ' + f.sim.cat.m.toFixed(4) + ' g de Cu; com a fonte desligada, a carga para'); }
  // ----- EQ11: corrosão -----
  if (temas.has('EQ11')) { await abre('EQ11');
    const c = await p.evaluate(() => { const u = SIM.eqCorrosao._ult, r = {}; for (const m of ['', 'Zn', 'Mg', 'Sn', 'Cu']) { u.poe(m, true, true, false); u.avanca(10); r[m || 'so'] = u.est(); } u.poe('', false, true, false); u.avanca(10); r.seco = u.est(); u.poe('Cu', true, false, false); u.avanca(10); r.semO2 = u.est(); u.poe('', true, true, true); u.avanca(10); r.sal = u.est(); return r; });
    ok(c.so.corroi === 'Fe' && c.so.dFe > 0 && c.Zn.corroi === 'Zn' && c.Zn.dFe === 0 && c.Zn.dOu > 0 && c.Mg.corroi === 'Mg' && c.Mg.dFe === 0 && c.Mg.dOu > c.Zn.dOu, 'EQ11: sozinho, o ferro corrói; com Zn ou Mg, corrói o outro metal e o ferro fica intacto (o Mg, de potencial mais baixo, some mais depressa no desenho)');
    ok(c.Sn.corroi === 'Fe' && c.Cu.corroi === 'Fe' && c.Cu.dFe > c.Sn.dFe && c.Sn.dFe > c.so.dFe && c.Cu.dOu === 0, 'EQ11: com Sn ou Cu, quem corrói é o ferro, e mais depressa que sozinho (' + (100 * c.so.dFe).toFixed(0) + '% → ' + (100 * c.Sn.dFe).toFixed(0) + '% → ' + (100 * c.Cu.dFe).toFixed(0) + '% em 10 s)');
    const fimZn = await p.evaluate(() => { const u = SIM.eqCorrosao._ult; u.poe('Mg', true, true, true); u.avanca(3); const antes = u.est(); u.avanca(40); return [antes, u.est()]; });
    ok(fimZn[0].dFe === 0 && !fimZn[0].acabou && fimZn[1].acabou && fimZn[1].dFe > 0 && fimZn[1].corroi === 'Fe', 'EQ11: quando o ânodo de sacrifício acaba, o ferro volta a corroer');
    ok(c.seco.corroi === null && c.seco.dFe === 0 && c.semO2.corroi === null && c.semO2.dFe === 0 && c.sal.dFe > c.so.dFe, 'EQ11: sem água ou sem oxigênio, nada corrói; com sal, o ferro corrói mais depressa'); }
  // ----- EQ15: orbitais -----
  if (temas.has('EQ15')) { await abre('EQ15');
    const o = await p.evaluate(() => { const u = SIM.eqOrbitais._ult, r = {}; u.semente(2); for (const id of Object.keys(SIM.ORBITAIS)) { u.poe(id); const e = u.est(), pts = u.pontos(); r[id] = { ...e, perto2: pts.filter((q) => Math.abs(Math.hypot(q[0], q[1], q[2]) - 2) < 0.12).length, eixoZ: pts.filter((q) => Math.abs(q[2]) < 0.4).length / pts.length }; } return { r, psi: [SIM.psiH('1s', 0, 0, 1), SIM.psiH('2s', 0, 0, 2), SIM.psiH('2pz', 1, 0, 0), SIM.psiH('3pz', 0, 0, 6), SIM.psiH('3dz2', 0, 0, 3)] }; });
    const ids = Object.keys(o.r);
    ok(ids.length === 8 && ids.every((k) => o.r[k].N === 2600 && Math.abs(o.r[k].rmed / o.r[k].rteor - 1) < 0.04), 'EQ15: distância média dos 2600 pontos a menos de 4% da teoria: ' + ids.map((k) => k + ' ' + o.r[k].rmed.toFixed(2) + ' (' + o.r[k].rteor + ')').join('; '));
    ok(o.r['1s'].fpos === 1 && ['2pz', '3pz', '3dxz', '3dx2y2'].every((k) => Math.abs(o.r[k].fpos - 0.5) < 0.04) && o.r['2s'].perto2 < 12 && o.r['2s'].nosR === 1 && o.r['3s'].nosR === 2 && o.r['3pz'].nosR === 1 && o.r['3dz2'].nosA === 2 && o.r['2pz'].eixoZ < 0.05, 'EQ15: 1s tem um sinal só; p e d têm metade dos pontos de cada sinal; quase nenhum ponto no nó do 2s (r = 2: ' + o.r['2s'].perto2 + ' de 2600) nem no plano nodal do 2p');
    ok(perto(o.psi[0], 2 * Math.exp(-1) / Math.sqrt(4 * Math.PI), 1e-12) && Math.abs(o.psi[1]) < 1e-15 && Math.abs(o.psi[2]) < 1e-15 && Math.abs(o.psi[3]) < 1e-15 && o.psi[4] > 0, 'EQ15: ψ(1s) em r = 1 igual à fórmula; ψ = 0 no nó do 2s (r = 2), no plano nodal do 2p e no nó radial do 3p (r = 6)'); }
  // ----- EQ16: geometrias -----
  if (temas.has('EQ16')) { await abre('EQ16');
    const g = await p.evaluate(() => { const u = SIM.eqGeometrias._ult, r = {}; for (const k of u.lista()) { u.poe(k); r[k] = u.est(); } return r; });
    ok(Object.keys(g).length === 13 && g['4,0'].angs.join() === '109.5' && g['3,0'].angs.join() === '120' && g['2,0'].angs.join() === '180' && g['6,0'].angs.join() === '90,180' && g['5,0'].angs.join() === '90,120,180' && g['2,2'].forma === 'angular' && g['2,2'].arranjo === 'tetraédrica' && g['4,2'].forma === 'quadrada plana' && g['4,2'].angs.join() === '90,180' && g['3,1'].forma === 'piramidal' && g['2,3'].forma === 'linear' && g['2,3'].angs.join() === '180', 'EQ16: 13 geometrias; AX₄ 109,5°, AX₃ 120°, AX₂ 180°, AX₅ 90/120/180°, AX₆ 90/180°; AX₂E₂ angular (arranjo tetraédrico), AX₃E piramidal, AX₄E₂ quadrada plana, AX₂E₃ linear'); }
  // ----- EQ19: tabela periódica -----
  if (temas.has('EQ19')) { await abre('EQ19');
    const tb = await p.evaluate(() => { const u = SIM.eqTabela._ult, pos = SIM.eqPosTabela, E = window.TABELA_DADOS.elementos.filter(Boolean), s = (x) => E.find((e) => e.s === x); u.poe('en', 9); const en = u.est(); u.poe('ei', 2); const ei = u.est(); u.apaga(); u.avanca(1); const meio = u.est(); const todas = new Set(E.map((e) => pos(e.z).join())); return { n: u.celulas(), en, ei, meio, unicas: todas.size, pos: [pos(1), pos(2), pos(5), pos(26), pos(57), pos(72), pos(118), pos(92), pos(20), pos(31)].map((x) => x.join()), quebras: [s('Be').ei > s('B').ei, s('N').ei > s('O').ei, s('Li').ei < s('Be').ei, s('Na').ei < s('Li').ei] }; });
    ok(tb.n === 118 && tb.unicas === 118 && tb.pos.join(' ') === '1,1 18,1 13,2 8,4 3,8 4,6 18,7 6,9 2,4 13,4', 'EQ19: 118 células, nenhuma posição repetida; H (1,1), He (18,1), B (13,2), Fe (8,4), La (3,8), Hf (4,6), Og (18,7), U (6,9), Ca (2,4), Ga (13,4)');
    ok(tb.en.max === 'F' && tb.ei.max === 'He' && tb.en.comDado < 118 && tb.meio.frente === 40 && tb.quebras.every(Boolean), 'EQ19: maior eletronegatividade: F; maior energia de ionização: He; ' + tb.en.comDado + ' elementos com eletronegatividade (os outros aparecem como "sem dado"); as quebras Be → B e N → O estão nos dados'); }
  // ----- EQ20: construtor (o mesmo da aba Moléculas) -----
  if (temas.has('EQ20')) { await abre('EQ20');
    const c = await p.evaluate(() => { const f = SIM.qVseprConta; return [f('C', ['H', 'H', 'H', 'H'], 0).modMu, f('C', ['Cl', 'Cl', 'Cl', 'Cl'], 0).modMu, f('C', ['H', 'Cl', 'Cl', 'Cl'], 0).modMu, f('O', ['H', 'H'], 2).modMu, f('C', ['O', 'O'], 0).modMu, f('Xe', ['F', 'F', 'F', 'F'], 2).modMu, document.querySelectorAll('#exp-vsepr svg, #exp-vsepr canvas').length]; });
    ok(c[0] < 1e-9 && c[1] < 1e-9 && perto(c[2], 0.96, 0.01) && perto(c[3], 1.43, 0.01) && c[4] < 1e-9 && c[5] < 1e-9 && c[6] > 0, 'EQ20: o construtor está montado; CH₄, CCl₄, CO₂ e XeF₄ dão dipolo zero; CHCl₃ 0,96 e H₂O 1,43 (em Δχ)'); }
  // ----- EQ13: decaimento -----
  if (temas.has('EQ13')) { await abre('EQ13');
    const d = await p.evaluate(() => { const u = SIM.eqDecaimento._ult, r = []; u.semente(13); u.poe('C14'); u.semente(13); r.push(u.est()); for (let k = 0; k < 4; k++) { u.avanca(1); r.push(u.est()); } u.poe('I131'); return { r, i: u.est(), lei: [SIM.decai(400, 1, 1), SIM.decai(400, 3, 1), SIM.decai(1, 5700, 5700)] }; });
    const sg = (n, p) => Math.sqrt(n * p * (1 - p));
    ok(d.r[0].n === 400 && [1, 2, 3, 4].every((k) => Math.abs(d.r[k].n - 400 / 2 ** k) < 3 * sg(400, 1 / 2 ** k)) && d.r[1].n > d.r[2].n && d.r[2].n > d.r[3].n, 'EQ13: de 400 núcleos restam ' + [1, 2, 3, 4].map((k) => d.r[k].n).join(', ') + ' depois de 1, 2, 3 e 4 meias-vidas (lei: 200, 100, 50, 25), dentro de 3 desvios padrão');
    ok(d.r[0].meia === 5700 && perto(d.r[2].tReal, 11400, 1) && Math.abs(d.r[2].idade / 11400 - 1) < 0.15 && d.i.meia === 8.0249 && d.i.un === 'dias' && d.lei.join() === '200,50,0.5', 'EQ13: ¹⁴C com meia-vida de 5700 anos: em 11 400 anos, idade calculada pela fração: ' + Math.round(d.r[2].idade) + ' anos; ¹³¹I: 8,0249 dias'); }
  // ----- EQ12: fissão em cadeia -----
  if (temas.has('EQ12')) { await abre('EQ12');
    const f = await p.evaluate(() => { const u = SIM.eqFissao._ult, media = (L, P, B) => { u.semente(21); let s = 0, mx = 0, ne = 0; for (let k = 0; k < 30; k++) { u.poe(L, P, B); u.dispara(); const e = u.roda(); s += e.fracao; mx = Math.max(mx, e.fracao); ne += e.fis; } return { fr: s / 30, mx, fis: ne / 30 }; }; return { peq: media(5, 1, 0), gra: media(19, 1, 0), dil: media(19, 0.5, 0), bar: media(19, 1, 2), um: (() => { u.semente(21); u.poe(19, 1, 0); u.dispara(); return u.roda(); })() }; });
    ok(f.peq.fr < 0.35 && f.gra.fr > 0.6 && f.gra.fr > 2 * f.peq.fr && f.dil.fr < f.gra.fr / 2 && f.bar.fr < f.gra.fr, 'EQ12 (média de 30 disparos): amostra 5 × 5 fissiona ' + Math.round(100 * f.peq.fr) + '% dos núcleos; 19 × 19 pura, ' + Math.round(100 * f.gra.fr) + '%; com 50% de físseis, ' + Math.round(100 * f.dil.fr) + '%; com 2 barras de controle, ' + Math.round(100 * f.bar.fr) + '%');
    ok(f.um.voando === 0 && f.um.MeV === 200 * f.um.fis && f.um.ger.reduce((a, x) => a + x, 0) === f.um.fis && f.um.fis <= f.um.fisseis, 'EQ12: um disparo na amostra grande: ' + f.um.fis + ' fissões em ' + f.um.ger.length + ' gerações (' + f.um.ger.slice(0, 6).join(', ') + '…); energia = 200 MeV por fissão; cada núcleo fissiona no máximo uma vez'); }
  // ----- EQ14: fusão -----
  if (temas.has('EQ14')) { await abre('EQ14');
    const fu = await p.evaluate(() => { const u = SIM.eqFusao._ult, r = {}; for (const T of [20, 60, 120]) { u.semente(14); u.poe(T); u.semente(14); u.avanca(40); r[T] = u.est(); } return r; });
    ok(fu[20].fus <= 1 && fu[60].fus > fu[20].fus && fu[120].fus > fu[60].fus && Math.abs(fu[120].fr / fu[120].teor - 1) < 0.5, 'EQ14: em 40 s, ' + fu[20].fus + ' fusões a 20 milhões de K, ' + fu[60].fus + ' a 60 e ' + fu[120].fus + ' a 120; fração que funde a 120: ' + (100 * fu[120].fr).toFixed(1) + '% (modelo: ' + (100 * fu[120].teor).toFixed(1) + '%)');
    ok([20, 60, 120].every((T) => fu[T].He === fu[T].fus && fu[T].n === fu[T].fus && fu[T].D === 40 - fu[T].fus && fu[T].Tr === 40 - fu[T].fus && perto(fu[T].MeV, 17.6 * fu[T].fus, 1e-9)), 'EQ14: cada fusão consome um ²H e um ³H e dá um ⁴He e um nêutron; energia = 17,6 MeV por fusão'); }
  ok(errs.length === 0, errs.length ? 'ERROS de JS: ' + errs.join(' | ') : 'sem erros de JS');
  console.log('FALHAS (' + falhas + '):');
  await b.close(); process.exit(falhas ? 1 : 0);
})();
