// tlabsJ.js: laboratórios do módulo J da Química (analítica e coordenação) e gabaritos. Uso: node tests/tlabsJ.js
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
  // ----- J01: precipitação -----
  if (temas.has('J01')) { await abre('J01');
    const pc = (c, a) => p.evaluate(([c, a]) => { SIM.qPrecipita._ult.poe(c, a); return SIM.qPrecipita._ult.est(); }, [c, a]);
    const a = await pc('Ag+', 'Cl-'), b2 = await pc('Na+', 'Cl-'), c = await pc('Fe3+', 'OH-'), d = await pc('Al3+', 'SO4 2-'), e = await pc('Ca2+', 'PO4 3-'), f = await pc('Ba2+', 'SO4 2-'); ok(a.f === 'AgCl' && a.forma && a.cor === 'branco' && a.kps === 1.6e-10 && b2.f === 'NaCl' && !b2.forma && c.f === 'Fe(OH)₃' && c.forma && c.cor === 'castanho-avermelhado' && d.f === 'Al₂(SO₄)₃' && !d.forma && e.f === 'Ca₃(PO₄)₂' && e.forma && e.nc === 3 && e.na === 2 && f.forma && f.kps === 2.3e-8, 'J01: AgCl precipita (branco, Kps 1,6·10⁻¹⁰); NaCl não; Fe(OH)₃ castanho-avermelhado; Al₂(SO₄)₃ solúvel; Ca₃(PO₄)₂ (3 : 2) e BaSO₄ precipitam');
    ok(await p.evaluate(() => { const S = SIM.ANA.SOL, C = Object.keys(S); return C.length === 13 && C.every((c) => Object.keys(S[c]).length === 9 && S[c]['NO3-'] === 'S') && ['Na+', 'K+', 'NH4+'].every((c) => Object.entries(S[c]).every(([a, v]) => v === 'S' || a === 'S2-')) && S['Ag+']['Cl-'] === 'I' && S['Ba2+']['SO4 2-'] === 'I' && S['Cu2+']['OH-'] === 'I'; }), 'J01: tabela de solubilidade da fonte: 13 cátions × 9 ânions; todo nitrato solúvel; sais de Na⁺, K⁺ e NH₄⁺ solúveis; AgCl, BaSO₄ e Cu(OH)₂ insolúveis');
    ok(await p.evaluate(() => { const f = SIM.salF; return f('NH4+', 'SO4 2-').f === '(NH₄)₂SO₄' && f('Mg2+', 'OH-').f === 'Mg(OH)₂' && f('Ag+', 'S2-').f === 'Ag₂S' && f('Ca2+', 'CO3 2-').f === 'CaCO₃' && f('Fe3+', 'PO4 3-').f === 'FePO₄' && f('Al3+', 'S2-').f === 'Al₂S₃' && SIM.ion('NH4+') === 'NH₄⁺' && SIM.ion('SO4 2-') === 'SO₄²⁻' && SIM.ion('NO3-') === 'NO₃⁻' && f('Ca2+', 'NO3-').f === 'Ca(NO₃)₂' && SIM.precip('Pb2+', 'I-').pouco && SIM.precip('Pb2+', 'I-').cor === 'amarelo vivo'; }), 'J01: fórmulas montadas pelas cargas: (NH₄)₂SO₄, Mg(OH)₂, Ag₂S, CaCO₃, FePO₄, Al₂S₃');
    ok(await p.evaluate(() => { const A = SIM.ANA; return A.CHAMA.length === 11 && A.CHAMA.find((x) => x.el === 'K').cor === 'lilás' && A.GRUPOS.length === 6 && A.GRUPOS[0].cats.includes('Ag+') && A.GRUPOS[4].cats.join() === 'Ba2+,Ca2+,Sr2+' && A.PREC.length === 21 && A.PREC.filter((x) => x.kps).every((x) => x.kps > 0 && x.kps < 1e-4); }), 'J01: 11 cores de chama, 6 grupos de cátions (grupo 1 com Ag⁺; grupo 5 = Ba²⁺, Ca²⁺, Sr²⁺), 21 precipitados com Kps positivo e pequeno');
    await p.evaluate(() => SIM.qPrecipita._ult.poe('Cu2+', 'OH-', false)); const l0 = await leitor('lab-prec'); await p.click('#lab-prec [data-v=ver]'); const l1 = await leitor('lab-prec'); ok(l0['forma precipitado?'] === '?' && l1['forma precipitado?'] === 'sim' && l1['cor do precipitado'] === 'azul' && /2,2·10⁻²⁰/.test(l1['Kps (25 °C)']), 'J01: mostrador escondido antes; Cu²⁺ + OH⁻: precipitado azul, Kps ' + l1['Kps (25 °C)']); }
  //MAIS
  // ----- gabaritos: em todo exercício de alternativas, clicar na letra do gabarito tem de dar "certo" -----
  for (const cod of ['J01', 'J02', 'J03', 'J04'].filter((c) => temas.has(c))) { await p.goto(RAIZ + '#/quimica/' + cod); await p.waitForTimeout(1300);
    const g = await p.evaluate(() => { const o = { n: 0, ruins: [] }; document.querySelectorAll('.ex').forEach((e) => { const bts = [...e.querySelectorAll('.alts .alt')]; if (!bts.length) return; o.n++; const d = e._d || {}; const bt = bts.find((x) => x.dataset.l === d.certa); if (!bt) return o.ruins.push((e.id || '?') + ' sem letra ' + d.certa); bt.click(); if (!bt.classList.contains('certa')) o.ruins.push((e.id || '?') + ' não aceitou'); }); return o; });
    if (g.n) ok(g.ruins.length === 0, cod + ': os ' + g.n + ' exercícios de alternativas aceitam a letra do gabarito' + (g.ruins.length ? ' → ' + g.ruins.join('; ') : '')); }
  ok(erros.length === 0, 'sem erros de JS' + (erros.length ? ' → ' + erros.slice(0, 3).join(' | ') : ''));
  console.log('FALHAS (' + falhas + '):'); await b.close(); process.exit(falhas ? 1 : 0);
})();
