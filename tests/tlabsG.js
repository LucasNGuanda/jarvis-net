// tlabsG.js: física dos laboratórios do módulo G da Química (Eletroquímica) e gabaritos. Uso: node tests/tlabsG.js
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
  // ----- G01: pilha -----
  await abre('G01');
  const pl = (a, b) => p.evaluate(([a, b]) => { SIM.qPilha._ult.poe(a, b); return SIM.qPilha._ult.est(); }, [a, b]);
  const d1 = await pl('Zn', 'Cu'), d2 = await pl('Cu', 'Zn'); ok(perto(d1.E0, 1.10) && d1.an === 'Zn' && d1.cat === 'Cu' && d1.n === 2 && d2.an === 'Zn' && perto(d2.E0, 1.10), 'G01: Daniell: ânodo Zn, cátodo Cu, 1,10 V, n = 2, qualquer que seja o lado em que se põe cada metal');
  const d3 = await pl('Al', 'Ag'); ok(perto(d3.E0, 2.46) && d3.n === 3 && d3.an === 'Al', 'G01: Al | Ag: 2,46 V com n = 3 (mmc de 3 e 1); o E° não é multiplicado');
  const d4 = await pl('Mg', 'Ag'), d5 = await pl('Fe', 'Fe'); ok(perto(d4.E0, 3.17) && d5.igual && d5.E0 === 0, 'G01: Mg | Ag dá a maior tensão da lista (3,17 V); dois eletrodos iguais dão 0 V');
  await pl('Zn', 'Cu'); await p.waitForTimeout(250); const l1 = await leitor('lab-pilha'); ok(/1,10 V/.test(l1['E° da pilha']) && /Zn \| Zn²⁺ \|\| Cu²⁺ \| Cu/.test(l1['notação']), 'G01: mostrador: ' + l1['E° da pilha'] + ' · ' + l1['notação']);
  // ----- G02: Nernst -----
  await abre('G02');
  const nr = (par, a, c) => p.evaluate(([par, a, c]) => { SIM.qNernst._ult.poe(par, a, c); return SIM.qNernst._ult.est(); }, [par, a, c]);
  const n0 = await nr(0, 0, 0), n1 = await nr(0, 0, -2), n2 = await nr(0, -2, 0); ok(perto(n0.E, 1.10, 1e-9) && Math.abs(n1.E - 1.0408) < 2e-4 && Math.abs(n2.E - 1.1592) < 2e-4, 'G02: Daniell: 1,100 V no padrão; ' + n1.E.toFixed(3) + ' V com Cu²⁺ a 0,01; ' + n2.E.toFixed(3) + ' V com Zn²⁺ a 0,01');
  const n3 = await nr(1, -1, -2); ok(perto(n3.Q, 1000, 1e-6) && Math.abs(n3.E - (1.56 - 0.05916 / 2 * 3)) < 2e-4 && n3.n === 2, 'G02: Zn | Ag com 0,1 e 0,01: Q = [Zn²⁺]/[Ag⁺]² = 1000 e E = ' + n3.E.toFixed(3) + ' V');
  const n4 = await nr(4, -3, 0), n5 = await nr(4, 0, -3); ok(n4.conc && Math.abs(n4.E - 0.05916 / 2 * 3) < 2e-4 && n5.E < 0, 'G02: pilha de concentração de cobre (0,001 e 1): ' + (1000 * n4.E).toFixed(1) + ' mV com o ânodo no lado diluído; invertida, E negativo');
  ok(Math.abs(n0.lnK / Math.LN10 - 2 * 1.10 / 0.05916) < 0.01, 'G02: log K da Daniell = ' + (n0.lnK / Math.LN10).toFixed(1));
  // ----- G03: eletrólise -----
  await abre('G03');
  const el = (k, i, t) => p.evaluate(([k, i, t]) => { SIM.qEletrolise._ult.poe(k, i, t); return SIM.qEletrolise._ult.est(); }, [k, i, t]);
  const e1 = await el('Cu', 2, 30); ok(perto(e1.q, 3600, 1e-9) && perto(e1.ne, 3600 / 96485, 1e-9) && perto(e1.m, 3600 / 96485 / 2 * 63.5, 1e-9), 'G03: 2 A por 30 min em Cu²⁺: 3600 C; ' + e1.ne.toFixed(4) + ' mol de e⁻; ' + e1.m.toFixed(3) + ' g de cobre');
  const e2 = await el('Ag', 2, 30), e3 = await el('Au', 2, 30); ok(perto(e2.n, 2 * e1.n, 1e-9) && perto(e3.n, e2.n / 3, 1e-9), 'G03: mesma carga: o dobro de mols de prata (1 e⁻) em relação ao cobre (2 e⁻); ouro (3 e⁻), um terço da prata');
  const e4 = await el('Cu', 4, 30), e5 = await el('Cu', 2, 60); ok(perto(e4.m, 2 * e1.m, 1e-9) && perto(e5.m, 2 * e1.m, 1e-9), 'G03: dobrar a corrente ou dobrar o tempo dobra a massa (1ª lei de Faraday)');
  // ----- G04: corrosão -----
  await abre('G04');
  const co = (pc, a, o, s, r) => p.evaluate(([pc, a, o, s, r]) => { SIM.qCorrosao._ult.poe(pc, a, o, s, r); return SIM.qCorrosao._ult.est(); }, [pc, a, o, s, r]);
  const c1 = await co('nada', true, true, false, false), c2 = await co('nada', false, true, false, false), c3 = await co('nada', true, false, false, false); ok(c1.quem === 'Fe' && c2.quem === null && c3.quem === null, 'G04: ferro sozinho corrói com água e oxigênio; sem um dos dois, não');
  const c4 = await co('Zn', true, true, false, true), c5 = await co('Mg', true, true, true, false); ok(c4.quem === 'Zn' && c4.ferro === 'protegido' && c5.quem === 'Mg' && c4.dE < 0, 'G04: com zinco ou magnésio, quem oxida é o metal de sacrifício (mesmo com risco); E°(Zn) − E°(Fe) = ' + c4.dE.toFixed(2) + ' V');
  const c6 = await co('Cu', true, true, false, false), c7 = await co('Sn', true, true, false, false); ok(c6.quem === 'Fe' && c6.motivo === 'acelera' && c7.quem === 'Fe' && c7.dE > 0, 'G04: com cobre ou estanho, o ferro é o ânodo e corrói mais depressa');
  const c8 = await co('tinta', true, true, false, false), c9 = await co('tinta', true, true, false, true); ok(c8.quem === null && c9.quem === 'Fe' && c9.motivo === 'barreira-riscada', 'G04: tinta inteira protege (barreira); riscada, o ferro corrói no risco');
  await co('nada', true, true, false, false);
  // ----- gabaritos: em todo exercício de alternativas, clicar na letra do gabarito tem de dar "certo" -----
  for (const cod of ['G01', 'G02', 'G03', 'G04'].filter((c) => temas.has(c))) { await p.goto(RAIZ + '#/quimica/' + cod); await p.waitForTimeout(1300);
    const g = await p.evaluate(() => { const o = { n: 0, ruins: [] }; document.querySelectorAll('.ex').forEach((e) => { const bts = [...e.querySelectorAll('.alts .alt')]; if (!bts.length) return; o.n++; const d = e._d || {}; const bt = bts.find((x) => x.dataset.l === d.certa); if (!bt) return o.ruins.push((e.id || '?') + ' sem letra ' + d.certa); bt.click(); if (!bt.classList.contains('certa')) o.ruins.push((e.id || '?') + ' não aceitou'); }); return o; });
    if (g.n) ok(g.ruins.length === 0, cod + ': os ' + g.n + ' exercícios de alternativas aceitam a letra do gabarito' + (g.ruins.length ? ' → ' + g.ruins.join('; ') : '')); }
  ok(erros.length === 0, 'sem erros de JS' + (erros.length ? ' → ' + erros.slice(0, 3).join(' | ') : ''));
  console.log('FALHAS (' + falhas + '):'); await b.close(); process.exit(falhas ? 1 : 0);
})();
