// tlabsE.js: física dos laboratórios do módulo E da Química (gases e soluções). Uso: node tests/tlabsE.js
const { chromium } = require('playwright'); const path = require('path');
const RAIZ = 'file://' + path.resolve(__dirname, '..', 'index.html');
let falhas = 0; const ok = (c, m) => { console.log((c ? 'ok ' : 'FALHA ') + m); if (!c) falhas++; };
const perto = (a, b, tol = 0.005) => Math.abs(a - b) <= tol * Math.max(1e-9, Math.abs(b));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const erros = []; p.on('pageerror', (e) => erros.push(String(e))); await require('./adm')(p);
  const abre = async (cod) => { await p.goto(RAIZ + '#/quimica/' + cod); await p.waitForTimeout(1500); };
  const leitor = (id) => p.evaluate((id) => { const o = {}; document.querySelectorAll('#' + id + ' .vis').forEach((v) => (o[v.querySelector('small').textContent.trim()] = v.querySelector('b').textContent.trim())); return o; }, id);
  // ----- E01: pistão -----
  await abre('E01');
  const pist = async (lei, x) => { await p.evaluate(([l, x]) => SIM.qPistao._ult.poe(l, x), [lei, x]); await p.waitForTimeout(120); return p.evaluate(() => SIM.qPistao._ult.st()); };
  let s = await pist('boyle', 24.6); ok(perto(s.P, 1.0), 'E01 Boyle: 1 mol, 300 K, 24,6 L → 1,00 atm → ' + s.P.toFixed(3));
  s = await pist('boyle', 12.3); ok(perto(s.P, 2.0), 'E01 Boyle: metade do volume, o dobro da pressão → ' + s.P.toFixed(3));
  s = await pist('charles', 600); ok(perto(s.V, 49.2) && perto(s.P, 1), 'E01 Charles: dobrar T (K) a P fixa dobra V → ' + s.V.toFixed(1) + ' L');
  s = await pist('gay', 600); ok(perto(s.P, 2.0) && perto(s.V, 24.6), 'E01 Gay-Lussac: dobrar T (K) a V fixo dobra P → ' + s.P.toFixed(3));
  s = await pist('avo', 2); ok(perto(s.V, 49.2), 'E01 Avogadro: dobrar n a P e T fixos dobra V → ' + s.V.toFixed(1));
  s = await pist('charles', 100); ok(perto(s.V, 8.2), 'E01 caso limite: 100 K a 1 atm → 8,2 L → ' + s.V.toFixed(2));
  const l1 = await leitor('lab-pistao'); ok(/0,082/.test(l1['PV / (nT)']) && /K = /.test(l1['temperatura']), 'E01: o mostrador PV/(nT) fica em 0,082 e a temperatura aparece em K e em °C → ' + l1['PV / (nT)']);
  ok(await p.evaluate(() => document.querySelectorAll('#lab-pistao svg circle').length > 5 && !!document.querySelector('#lab-pistao svg path')), 'E01: o cilindro e o gráfico estão desenhados');
  // ----- E02: velocidades e gás real -----
  await abre('E02');
  const mx0 = await p.evaluate(() => { SIM.qMaxwellGas._ult.inicia(); return SIM.qMaxwellGas._ult.est(); });
  ok(mx0.iguais && perto(mx0.razao, 1, 1e-6), 'E02 Maxwell: no começo todas as moléculas têm a mesma velocidade (v_rms / v_média = 1)');
  const mx1 = await p.evaluate(() => { SIM.qMaxwellGas._ult.passos(2400); return SIM.qMaxwellGas._ult.est(); });
  ok(!mx1.iguais && Math.abs(mx1.razao - 1.128) < 0.05 && perto(mx1.rms, mx0.rms, 1e-6), 'E02 Maxwell: depois de 20 s de colisões, v_rms / v_média vai para 1,128 (Maxwell em 2D) e a energia se conserva → ' + mx1.razao.toFixed(3));
  const mx2 = await p.evaluate(() => { const a = SIM.qMaxwellGas._ult.est().rms; SIM.qMaxwellGas._ult.poe(1200, 'N2'); const b = SIM.qMaxwellGas._ult.est().rms; SIM.qMaxwellGas._ult.poe(1200, 'H2'); const c = SIM.qMaxwellGas._ult.est().rms; return [b / a, c / b]; });
  ok(perto(mx2[0], 2, 0.01) && perto(mx2[1], Math.sqrt(14), 0.01), 'E02 Maxwell: quadruplicar T dobra a velocidade; trocar N₂ por H₂ multiplica por √14 → ' + mx2.map((x) => x.toFixed(3)).join(', '));
  ok(perto(await p.evaluate(() => SIM.vrms(300, 28)), 516.9, 0.002), 'E02: v_rms do N₂ a 300 K = 517 m/s');
  const vw = async (g, t, v) => { await p.evaluate(([g, t, v]) => SIM.qRealIdeal._ult.poe(g, t, v), [g, t, v]); await p.waitForTimeout(120); return p.evaluate(() => SIM.qRealIdeal._ult.est()); };
  let r = await vw('CO2', 320, 0.2); ok(perto(r.Pi, 131.2, 0.002) && perto(r.Pr, 77.96, 0.003) && perto(r.Z, 0.594, 0.003), 'E02 gás real: CO₂, 320 K, 0,2 L/mol → ideal 131,2 atm; van der Waals 78,0 atm; Z = 0,594 → ' + r.Pr.toFixed(2) + ', ' + r.Z.toFixed(3));
  r = await vw('He', 300, 0.2); ok(r.Z > 1 && perto(r.Z, 1.128, 0.003), 'E02 gás real: hélio a 300 K e 0,2 L/mol tem Z > 1 (1,128) → ' + r.Z.toFixed(3));
  r = await vw('CO2', 320, 50); ok(Math.abs(r.Z - 1) < 0.004, 'E02 caso limite: gás rarefeito (50 L/mol) → Z = 1 → ' + r.Z.toFixed(4));
  r = await vw('CO2', 150, 1); ok(r.T >= 315, 'E02: o controle não deixa o CO₂ ir abaixo da temperatura crítica do modelo (301 K) → mínimo ' + r.T + ' K');
  // ----- E03: mistura -----
  await abre('E03');
  const mi = async (...a) => { await p.evaluate((a) => SIM.qMistura._ult.poe(...a), a); await p.waitForTimeout(120); return p.evaluate(() => SIM.qMistura._ult.est()); };
  r = await mi('N2', 1, 'O2', 1, 300, 24.6); ok(perto(r.PA, 1) && perto(r.PB, 1) && perto(r.P, 2) && perto(r.xA, 0.5) && perto(r.M, 30), 'E03: 1 mol + 1 mol, 300 K, 24,6 L → 1,00 atm cada, 2,00 atm no total, M = 30');
  const pa = r.PA; r = await mi('N2', 1, 'O2', 3, 300, 24.6); ok(perto(r.PA, pa) && perto(r.xA, 0.25), 'E03: acrescentar gás B não muda a pressão parcial de A; a fração molar cai para 0,25');
  r = await mi('N2', 3, 'O2', 1, 300, 49.2); ok(perto(r.PA, 1.5) && perto(r.PB, 0.5) && perto(r.M, 29) && perto(r.d, 2.358, 0.002), 'E03: 3 N₂ + 1 O₂ em 49,2 L → 1,50 e 0,50 atm; M = 29,0; d = 2,36 g/L');
  r = await mi('N2', 1, 'CO2', 0, 300, 24.6); ok(perto(r.P, r.PA) && r.xA === 1 && r.PB === 0, 'E03 caso limite: sem gás B, a pressão total é a de A');
  const r2 = await mi('H2', 1, 'CO2', 1, 300, 24.6); ok(perto(r2.P, 2) && perto(r2.M, 23), 'E03: trocar os gases não muda as pressões (mesmos mols), mas muda a massa molar média (H₂ + CO₂: 23)');
  // ----- E04: diagrama de fases -----
  await abre('E04');
  const fa = (s, t, P) => p.evaluate(([s, t, P]) => SIM.fases.estado(s, t, P), [s, t, P]);
  const casosF = [['H2O', 298.15, 1, 'líquido'], ['H2O', 263, 1, 'sólido'], ['H2O', 393, 1, 'gás'], ['H2O', 393, 3, 'líquido'], ['H2O', 272.9, 1, 'sólido'], ['H2O', 272.9, 60, 'líquido'], ['H2O', 700, 300, 'fluido supercrítico'], ['H2O', 260, 0.0001, 'gás'], ['CO2', 298.15, 1, 'gás'], ['CO2', 180, 1, 'sólido'], ['CO2', 250, 30, 'líquido'], ['CO2', 250, 10, 'gás'], ['CO2', 320, 100, 'fluido supercrítico']];
  let ruim = []; for (const [s2, t, P, e] of casosF) { const g = await fa(s2, t, P); if (g !== e) ruim.push(s2 + ' ' + t + ' K ' + P + ' atm: ' + g); }
  ok(ruim.length === 0, 'E04: 13 pontos dos dois diagramas no estado certo (inclui o gelo que funde a 60 atm e o CO₂ que é gás a 25 °C e 1 atm)' + (ruim.length ? ' → ' + ruim.join('; ') : ''));
  const tr = await p.evaluate(() => ({ a1: SIM.fases.trans('H2O', 1), c1: SIM.fases.trans('CO2', 1), c10: SIM.fases.trans('CO2', 10), pv: SIM.fases.pvap('H2O', 298.15) * 760, pc: SIM.fases.pvap('CO2', 298.15), inc: SIM.fases.incl('H2O') }));
  ok(Math.abs(tr.a1.fus - 273.15) < 0.01 && Math.abs(tr.a1.eb - 373.15) < 0.01, 'E04: a 1 atm a água funde a 0,00 °C e ferve a 100,00 °C');
  ok(tr.c1.sub !== undefined && Math.abs(tr.c1.sub - 194.69) < 0.01 && tr.c10.eb !== undefined, 'E04: a 1 atm o CO₂ sublima a −78,46 °C; a 10 atm (acima do ponto triplo) ele funde e ferve');
  ok(tr.inc < 0 && perto(tr.pv, 22.7, 0.01) && perto(tr.pc, 63.8, 0.01), 'E04: a curva de fusão da água tem inclinação negativa (' + tr.inc.toFixed(0) + ' atm/K); o modelo dá 22,7 mmHg para a água a 25 °C (tabela: 23,8)');
  await p.evaluate(() => SIM.qFases._ult.poe('H2O', 300, 1)); await p.locator('#lab-fases svg').scrollIntoViewIfNeeded(); await p.waitForTimeout(200); const cx = await p.locator('#lab-fases svg').boundingBox();
  await p.mouse.move(cx.x + cx.width * 0.2, cx.y + cx.height * 0.3); await p.mouse.down(); await p.mouse.move(cx.x + cx.width * 0.15, cx.y + cx.height * 0.25, { steps: 4 }); await p.mouse.up(); await p.waitForTimeout(150);
  const arr = await p.evaluate(() => SIM.qFases._ult.est()); ok(arr.estado === 'sólido' && arr.T < 300, 'E04: arrastar o ponto para o canto de cima à esquerda leva ao sólido → ' + Math.round(arr.T) + ' K, ' + arr.P.toFixed(1) + ' atm, ' + arr.estado);
  // ----- E05: solubilidade -----
  await abre('E05');
  const so = async (fn, ...a) => { await p.evaluate(([fn, a]) => SIM.qSolubilidade._ult[fn](...a), [fn, a]); await p.waitForTimeout(100); return p.evaluate(() => SIM.qSolubilidade._ult.est()); };
  r = await so('poe', 'KNO3', 60, 80, false); ok(perto(r.S, 110) && r.tipo === 'insaturada' && perto(r.diss, 80), 'E05: 80 g de KNO₃ em 100 mL a 60 °C (solubilidade 110) → insaturada');
  r = await so('temp', 20); ok(r.tipo === 'saturada com corpo de fundo' && perto(r.fundo, 48.4, 0.003), 'E05: esfriando a 20 °C com agitação cristalizam 48,4 g → ' + r.fundo.toFixed(1));
  r = await so('poe', 'KNO3', 60, 80, true); r = await so('temp', 20); ok(r.tipo === 'supersaturada' && perto(r.diss, 80), 'E05: em repouso, a mesma solução esfriada fica supersaturada (80 g dissolvidos onde cabem 31,6)');
  await p.evaluate(() => SIM.qSolubilidade._ult.semear()); r = await p.evaluate(() => SIM.qSolubilidade._ult.est()); ok(r.tipo === 'saturada com corpo de fundo' && perto(r.fundo, 48.4, 0.003), 'E05: semeando um cristal, o excesso (48,4 g) cristaliza de uma vez');
  r = await so('poe', 'KNO3', 20, 31.6, false); ok(r.tipo === 'saturada', 'E05: exatamente 31,6 g a 20 °C → saturada, sem corpo de fundo');
  r = await so('poe', 'Ce2SO43', 0, 15, false); const f0 = r.fundo; r = await so('temp', 60); ok(f0 < 0.01 && perto(r.fundo, 15 - 3.87, 0.003), 'E05: sulfato de cério(III), menos solúvel a quente: 15 g dissolvidos a 0 °C, e a 60 °C sobram 11,1 g no fundo');
  ok(perto(await p.evaluate(() => SIM.solub('KCl', 70)), 48.55, 0.001), 'E05: buraco da tabela (KCl a 70 °C) interpolado entre 60 e 80 °C → 48,55');
  // ----- E06: diluição e mistura -----
  await abre('E06');
  const di = async (...a) => { await p.evaluate((a) => SIM.qDiluicao._ult.poe(...a), a); await p.waitForTimeout(100); return p.evaluate(() => SIM.qDiluicao._ult.est()); };
  r = await di('dil', 'NaCl', 2, 100, 0, 300); ok(perto(r.M, 0.5) && perto(r.n, 0.2) && r.V === 400, 'E06 diluição: 100 mL a 2,0 mol/L + 300 mL de água → 0,50 mol/L em 400 mL; 0,200 mol (não muda)');
  r = await di('mis', 'NaOH', 1, 200, 3, 300); ok(perto(r.M, 2.2) && perto(r.n, 1.1), 'E06 mistura: 200 mL a 1,0 + 300 mL a 3,0 → 2,2 mol/L');
  r = await di('dil', 'NaCl', 2, 100, 0, 0); ok(perto(r.M, 2), 'E06 caso limite: sem água acrescentada a concentração não muda');
  const l6 = await leitor('lab-dil'); ok(/g\/L/.test(l6['concentração comum']) && /mol\/L/.test(l6['molaridade']), 'E06: o mostrador dá a mesma solução em g/L e em mol/L → ' + l6['concentração comum'] + ' · ' + l6['molaridade']);
  // ----- E07: bureta -----
  await abre('E07');
  const ph = (a, v) => p.evaluate(([a, v]) => SIM.phTit(a, 0.1, 25, 0.1, v), [a, v]);
  const esp = [['HCl', 0, 1.0], ['HCl', 12.5, 1.477], ['HCl', 24.95, 4.0], ['HCl', 25, 7.0], ['HCl', 25.05, 10.0], ['HAc', 0, 2.88], ['HAc', 12.5, 4.756], ['HAc', 25, 8.73], ['HAc', 25.05, 10.0]];
  ruim = []; for (const [a, v, e] of esp) { const g = await ph(a, v); if (Math.abs(g - e) > 0.012) ruim.push(a + ' ' + v + ' mL: ' + g.toFixed(3)); }
  ok(ruim.length === 0, 'E07: 9 pontos das curvas de pH (forte: 1,00 → 7,00 → 10,00; fraco: 2,88; pH = pKa na meia equivalência; 8,73 no equivalente)' + (ruim.length ? ' → ' + ruim.join('; ') : ''));
  await p.evaluate(() => { SIM.qBureta._ult.poe('HCl', 'fen', 0.08); for (let k = 0; k < 400; k++) SIM.qBureta._ult.junta(0.05); }); await p.waitForTimeout(150);
  let bu = await p.evaluate(() => SIM.qBureta._ult.est()); ok(perto(bu.veq, 20) && perto(bu.Vb, 20, 0.001) && perto(bu.pH, 7, 0.01), 'E07 bureta: ácido 0,080 mol/L → equivalência em 20,00 mL; depois de 400 gotas o pH é 7,00');
  await p.evaluate(() => SIM.qBureta._ult.junta(0.05)); bu = await p.evaluate(() => SIM.qBureta._ult.est()); ok(bu.pH > 9.5 && /rosa|virando/.test(bu.cor), 'E07: uma gota depois do ponto, o pH salta para ' + bu.pH.toFixed(2) + ' e a fenolftaleína fica ' + bu.cor);
  const vi = await p.evaluate(() => ['fen', 'bro', 'ala'].map((i) => SIM.viragem('HAc', 0.1, 25, 0.1, i)));
  ok(Math.abs(vi[0] - 25) < 0.05 && vi[2] < 5, 'E07: com ácido acético, a fenolftaleína vira em ' + vi[0].toFixed(2) + ' mL (equivalência: 25,00) e o alaranjado de metila, em ' + vi[2].toFixed(2) + ' mL (indicador errado)');
  await p.evaluate(() => { for (let k = 0; k < 200; k++) SIM.qBureta._ult.junta(1); }); bu = await p.evaluate(() => SIM.qBureta._ult.est()); ok(bu.Vb === 50, 'E07 caso limite: a bureta para em 50 mL');
  //MAIS
  // ----- gabaritos: em todo exercício de alternativas, clicar na letra do gabarito tem de dar "certo" -----
  for (const cod of ['E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08']) { await p.goto(RAIZ + '#/quimica/' + cod); await p.waitForTimeout(1300);
    const g = await p.evaluate(() => { const o = { n: 0, ruins: [] }; document.querySelectorAll('.ex').forEach((e) => { const bts = [...e.querySelectorAll('.alts .alt')]; if (!bts.length) return; o.n++; const d = e._d || {}; const b = bts.find((x) => x.dataset.l === d.certa); if (!b) return o.ruins.push((e.id || '?') + ' sem letra ' + d.certa); b.click(); if (!b.classList.contains('certa')) o.ruins.push((e.id || '?') + ' não aceitou'); }); return o; });
    if (g.n) ok(g.ruins.length === 0, cod + ': os ' + g.n + ' exercícios de alternativas aceitam a letra do gabarito' + (g.ruins.length ? ' → ' + g.ruins.join('; ') : '')); }
  ok(erros.length === 0, 'sem erros de JS' + (erros.length ? ' → ' + erros.slice(0, 3).join(' | ') : ''));
  console.log('FALHAS (' + falhas + '):'); await b.close(); process.exit(falhas ? 1 : 0);
})();
