// tlabsI.js: laboratórios do módulo I da Química (bioquímica e ambiental) e gabaritos. Uso: node tests/tlabsI.js
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
  // ----- I01: polímeros -----
  if (temas.has('I01')) { await abre('I01');
    const po = (k, n) => p.evaluate(([k, n]) => { SIM.qPolimero._ult.poe(k, n); return SIM.qPolimero._ult.est(); }, [k, n]);
    const a = await po('PVC', 1000), b2 = await po('PET', 100), c = await po('nylon_66', 10), d = await po('polietileno', 10000); ok(a.mu === 62.5 && a.massa === 62500 && a.aguas === 0 && a.tipo === 'adição' && b2.mu === 192 && b2.aguas === 200 && b2.tipo === 'condensação' && c.mu === 226 && c.aguas === 20 && d.massa === 280000, 'I01: PVC 62,5 g/mol por unidade (×1000 = 62 500, sem água); PET 192 (100 unidades liberam 200 águas); náilon 6,6 226; PE com 10 000 unidades = 280 000');
    ok(await p.evaluate(() => { const O = SIM.org, P = SIM.BIO.POL; return P.length === 13 && P.every((x) => { const m = x.mon.reduce((t, y) => t + O.massa(y[1]), 0); return Math.abs(m - 18 * x.aguas - x.mu) < 1e-9 && (x.tipo === 'adição') === (x.aguas === 0); }); }), 'I01: nos 13 polímeros, massa da unidade = soma dos monômeros − 18 por água; adição nunca libera água');
    ok(await p.evaluate(() => { const P = SIM.BIO.POL, d = (k) => P.find((x) => x.k === k).d; return d('PET') === 1.38 && d('PVC') === 1.4 && d('polipropileno') === 0.855 && d('polietileno')[1] === 0.96 && d('PTFE') === 2.2 && SIM.BIO.COD['1'] === 'PET' && SIM.BIO.COD['5'] === 'PP'; }), 'I01: densidades de fonte (PET 1,38; PVC 1,4; PP 0,855; PE até 0,96; PTFE 2,2) e códigos 1 PET, 5 PP');
    await p.evaluate(() => SIM.qPolimero._ult.poe('PVC', 1000, false)); const l0 = await leitor('lab-pol'); await p.click('#lab-pol [data-v=ver]'); const l1 = await leitor('lab-pol'); ok(l0['polimerização por'] === '?' && l1['polimerização por'] === 'adição' && /62\s?500/.test(l1['massa molar da cadeia']) && l1['código de reciclagem'] === '3', 'I01: mostrador escondido antes; depois adição, 62 500 g/mol e código 3 → ' + l1['massa molar da cadeia']); }
  //MAIS
  // ----- gabaritos: em todo exercício de alternativas, clicar na letra do gabarito tem de dar "certo" -----
  for (const cod of ['I01', 'I02', 'I03', 'I04', 'I05', 'I06', 'I07', 'I08', 'I09'].filter((c) => temas.has(c))) { await p.goto(RAIZ + '#/quimica/' + cod); await p.waitForTimeout(1300);
    const g = await p.evaluate(() => { const o = { n: 0, ruins: [] }; document.querySelectorAll('.ex').forEach((e) => { const bts = [...e.querySelectorAll('.alts .alt')]; if (!bts.length) return; o.n++; const d = e._d || {}; const bt = bts.find((x) => x.dataset.l === d.certa); if (!bt) return o.ruins.push((e.id || '?') + ' sem letra ' + d.certa); bt.click(); if (!bt.classList.contains('certa')) o.ruins.push((e.id || '?') + ' não aceitou'); }); return o; });
    if (g.n) ok(g.ruins.length === 0, cod + ': os ' + g.n + ' exercícios de alternativas aceitam a letra do gabarito' + (g.ruins.length ? ' → ' + g.ruins.join('; ') : '')); }
  ok(erros.length === 0, 'sem erros de JS' + (erros.length ? ' → ' + erros.slice(0, 3).join(' | ') : ''));
  console.log('FALHAS (' + falhas + '):'); await b.close(); process.exit(falhas ? 1 : 0);
})();
