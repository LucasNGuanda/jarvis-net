/* Laboratórios do módulo D da Química (β 5.3). Uso: node tests/tlabsD.js
   Mexe nos controles de cada laboratório e confere o que aparece contra a conta feita à parte (valores refeitos em Python na sessão):
   D01 treino de nomenclatura; D02 fila de reatividade e solubilidade; D03 Lavoisier e Proust; D04 ponte do mol; D05 balanceador; D06 limitante; D07 acerto de elétrons. */
const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html');
const { chromium } = require('playwright'); const res = []; const ok = (c, m) => res.push([!!c, m]);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); await require('./adm')(p);
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const abre = async (c) => { await p.goto(RAIZ + '#/quimica/' + c); await p.waitForTimeout(1500); };
  const leitor = (id) => p.evaluate((id) => { const o = {}; document.querySelectorAll('#' + id + ' .vis').forEach(v => { o[v.querySelector('small').textContent.trim()] = v.querySelector('b').textContent.trim(); }); return o; }, id);
  const sl = (id, c, v) => p.evaluate(([id, c, v]) => { const i = document.querySelector('#' + id + ' input[data-c="' + c + '"]'); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); }, [id, c, v]);

  await abre('D01');
  const n1 = await p.evaluate(() => { const el = document.getElementById('lab-nomes'), ops = el.querySelectorAll('[data-op]'); return { ops: ops.length, perg: el.querySelector('[data-v=perg]').textContent.length }; });
  ok(n1.ops === 4 && n1.perg > 0, 'D01 treino: pergunta com 4 alternativas → ' + JSON.stringify(n1));
  await p.click('#lab-nomes [data-op="0"]'); await p.waitForTimeout(200); let l = await leitor('lab-nomes');
  ok(/de 1$/.test(l['acertos']), 'D01 treino: responder conta no placar → ' + l['acertos']);
  const dist = await p.evaluate(() => { const S = window.SIM, F = window.F; let ruim = 0; for (let k = 0; k < 300; k++) { const q = S.nomenclatura._pergunta('todas'); if (q.ops.length !== 4 || new Set(q.ops).size !== 4 || !q.ops.includes(q.certo) || !q.ops.every(o => S.NOMES[q.grupo].includes(o))) ruim++; } return ruim; });
  ok(dist === 0, 'D01 treino: 300 perguntas sorteadas, sempre 4 opções distintas, da mesma função, com a certa entre elas → ' + dist + ' ruins');

  await abre('D02');
  await p.click('#lab-prever [data-m="Zn"]'); await p.click('#lab-prever [data-o="Cu"]'); l = await leitor('lab-prever'); ok(l['ocorre?'] === 'sim', 'D02: Zn desloca Cu → ' + l['ocorre?']);
  await p.click('#lab-prever [data-m="Cu"]'); await p.click('#lab-prever [data-o="Zn"]'); l = await leitor('lab-prever'); ok(l['ocorre?'] === 'não', 'D02: Cu não desloca Zn');
  await p.click('#lab-prever [data-m="Ag"]'); await p.click('#lab-prever [data-o="H"]'); l = await leitor('lab-prever'); ok(l['ocorre?'] === 'não', 'D02: Ag não reage com ácido');
  await p.click('#lab-prever [data-aba="dt"]'); await p.waitForTimeout(150); l = await leitor('lab-prever'); ok(l['ocorre?'] === 'sim' && /AgCl/.test(l['precipitado']), 'D02: AgNO₃ + NaCl precipita AgCl → ' + l['precipitado']);
  await p.click('#lab-prever [data-c1="K"]'); l = await leitor('lab-prever'); ok(l['ocorre?'] === 'não', 'D02: KNO₃ + NaCl não reage');
  await p.click('#lab-prever [data-c1="Ba"]'); await p.click('#lab-prever [data-a2="SO4"]'); l = await leitor('lab-prever'); ok(/BaSO₄/.test(l['precipitado']), 'D02: Ba(NO₃)₂ + Na₂SO₄ precipita BaSO₄ → ' + l['precipitado']);

  await abre('D03');
  await sl('lab-prop', 'a', 12); await sl('lab-prop', 'b', 12); l = await leitor('lab-prop');
  ok(/^12,0 g \+ 8,0 g$/.test(l['reagiu']) && /^20,0 g$/.test(l['produto (MgO)']) && /^4,0 g de O₂/.test(l['sobra']) && l['acabou primeiro'] === 'Mg', 'D03: 12 g de Mg + 12 g de O₂ → 20 g de MgO, sobram 4 g de O₂ → ' + JSON.stringify(l));
  await sl('lab-prop', 'a', 30); await sl('lab-prop', 'b', 20); l = await leitor('lab-prop'); ok(/nada/.test(l['sobra']) && /^50,0 g$/.test(l['produto (MgO)']), 'D03: proporção exata 30 : 20 → 50 g, nada sobra');
  await p.click('#lab-prop [data-k="H2O"]'); await sl('lab-prop', 'a', 10); await sl('lab-prop', 'b', 8); l = await leitor('lab-prop'); ok(/^9,0 g$/.test(l['produto (H₂O)']) && /^9,0 g de H₂/.test(l['sobra']), 'D03: 10 g de H₂ + 8 g de O₂ → 9 g de água, sobram 9 g de H₂ → ' + l['sobra']);

  await abre('D04');
  const mol = async (campo, v) => { await p.fill('#lab-mol [data-i="' + campo + '"]', v); await p.waitForTimeout(100); return p.evaluate(() => { const g = (i) => document.querySelector('#lab-mol [data-i="' + i + '"]').value; return { m: g('m'), n: g('n'), N: g('N'), V: g('V') }; }); };
  let m = await mol('m', '36'); ok(m.n === '2' && /1,20 × 10²⁴/.test(m.N) && /não é gás/.test(m.V), 'D04: 36 g de água = 2 mol = 1,20 × 10²⁴ moléculas; volume apagado → ' + JSON.stringify(m));
  await p.click('#lab-mol [data-k="CO2"]'); m = await mol('m', '88'); ok(m.n === '2' && m.V === '44,8', 'D04: 88 g de CO₂ = 2 mol = 44,8 L → ' + JSON.stringify(m));
  m = await mol('V', '11,2'); ok(m.n === '0,5' && m.m === '22', 'D04: digitando 11,2 L de CO₂ → 0,5 mol e 22 g → ' + JSON.stringify(m));
  m = await mol('N', '3,01e23'); ok(m.n === '0,5', 'D04: digitando 3,01e23 moléculas → 0,5 mol');

  await abre('D05');
  let e = await p.evaluate(() => SIM.balanceador._estado()); ok(!e.ok && JSON.stringify(e.gab) === '[2,1,2]', 'D05: começa desbalanceada (1, 1, 1); gabarito calculado 2, 1, 2');
  await p.click('#lab-bal [data-s="0"]'); await p.click('#lab-bal [data-s="2"]'); e = await p.evaluate(() => SIM.balanceador._estado()); l = await leitor('lab-bal');
  ok(e.ok && e.minimo && /balanceada ✓/.test(l['situação']) && l['cliques'] === '2', 'D05: dois cliques (2 H₂ e 2 H₂O) balanceiam → ' + l['situação']);
  await p.click('#lab-bal [data-s="0"]'); await p.click('#lab-bal [data-s="0"]'); await p.click('#lab-bal [data-s="1"]'); await p.click('#lab-bal [data-s="2"]'); await p.click('#lab-bal [data-s="2"]'); l = await leitor('lab-bal'); ok(/simplificar/.test(l['situação']), 'D05: 4, 2, 4 está balanceada, mas avisa que dá para simplificar → ' + l['situação']);
  const todas = await p.evaluate(() => { let ruim = 0; SIM.EQS.forEach((q, i) => { const g = SIM.balanceia(q.r, q.p); SIM.balanceador._poe(i, g); const s = SIM.balanceador._estado(); if (!s.ok || !s.minimo) ruim++; SIM.balanceador._poe(i, g.map((x) => x + (i % 2 ? 0 : 1) * 0 + (x === g[0] ? 1 : 0))); if (SIM.balanceador._estado().ok && g.length > 1) ruim++; }); return [SIM.EQS.length, ruim]; });
  ok(todas[1] === 0, 'D05: nas ' + todas[0] + ' equações, o gabarito fica todo verde e um coeficiente errado não → ' + todas[1] + ' ruins');
  await p.selectOption('#lab-bal [data-v=sel]', '6'); await p.click('#lab-bal [data-b=resp]'); e = await p.evaluate(() => SIM.balanceador._estado()); ok(JSON.stringify(e.coef) === '[1,5,3,4]' && e.ok, 'D05: "mostrar resposta" no propano → 1, 5, 3, 4');

  await abre('D06');
  await sl('lab-lim', 'a', 4); await sl('lab-lim', 'b', 3); l = await leitor('lab-lim'); ok(l['limitante'] === 'H₂' && /^4 mol = 72 g$/.test(l['produto (H₂O)']) && /1 mol de O₂/.test(l['excesso']), 'D06: 4 mol de H₂ + 3 mol de O₂ → limitante H₂, 4 mol de água (72 g), sobra 1 mol de O₂ → ' + JSON.stringify(l));
  await p.click('#lab-lim [data-k="1"]'); await sl('lab-lim', 'a', 2); await sl('lab-lim', 'b', 3); l = await leitor('lab-lim'); ok(l['limitante'] === 'H₂' && /^2 mol = 34 g$/.test(l['produto (NH₃)']) && /1 mol de N₂/.test(l['excesso']), 'D06: 2 mol de N₂ + 3 mol de H₂ → limitante H₂ (mais mols que o N₂!), 2 mol de NH₃, sobra 1 mol de N₂ → ' + l['excesso']);
  await sl('lab-lim', 'a', 2); await sl('lab-lim', 'b', 6); l = await leitor('lab-lim'); ok(/nenhum/.test(l['limitante']), 'D06: 2 : 6 é a proporção exata');

  await abre('D07');
  e = await p.evaluate(() => SIM.qRedox._estado()); ok(e.k === 1 && e.ele && e.ele[0] === 2 && e.ele[1] === 1 && !e.ok, 'D07: abre em Cu + Ag⁺, desbalanceada: 2 elétrons cedidos × 1 recebido');
  await p.click('#lab-redox [data-s="1"]'); await p.click('#lab-redox [data-s="3"]'); e = await p.evaluate(() => SIM.qRedox._estado()); ok(e.ok && e.minimo && e.ele[0] === 2 && e.ele[1] === 2, 'D07: com 2 Ag⁺ e 2 Ag, elétrons, átomos e carga igualam');
  await p.selectOption('#lab-redox [data-v=sel]', '6'); e = await p.evaluate(() => SIM.qRedox._estado()); ok(e.ele[0] === 1 && e.ele[1] === 5 && !e.ok, 'D07: MnO₄⁻ + Fe²⁺ com coeficientes 1: 1 elétron cedido × 5 recebidos');
  for (let k = 0; k < 4; k++) await p.click('#lab-redox [data-s="1"]'); e = await p.evaluate(() => SIM.qRedox._estado()); ok(e.ele[0] === 5 && e.ele[1] === 5 && !e.ok, 'D07: com 5 Fe²⁺ os elétrons igualam, mas átomos e carga ainda não');
  const red = await p.evaluate(() => { let ruim = 0; SIM.REDOX.forEach((q, i) => { SIM.qRedox._poe(i, SIM.balanceia(q.r, q.p)); const s = SIM.qRedox._estado(); if (!s.ok || !s.minimo || s.ele[0] !== s.ele[1]) ruim++; }); return [SIM.REDOX.length, ruim]; });
  ok(red[1] === 0, 'D07: nas ' + red[0] + ' equações, o gabarito iguala elétrons, átomos e carga → ' + red[1] + ' ruins');
  const txt = await p.evaluate(() => document.getElementById('lab-redox').textContent); ok(/oxida/.test(txt) && /reduz/.test(txt) && /carga/.test(txt), 'D07: marca quem oxida e quem reduz e mostra a linha da carga');

  ok(errs.length === 0, 'sem erros de JS → ' + errs.join(' | '));
  await b.close(); let f = 0; res.forEach(([c, m]) => { if (!c) f++; console.log((c ? 'ok ' : 'FALHA ') + m); }); console.log('FALHAS (' + f + ')' + (f ? '' : ':')); process.exit(f ? 1 : 0);
})();
