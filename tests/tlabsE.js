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
  //MAIS
  ok(erros.length === 0, 'sem erros de JS' + (erros.length ? ' → ' + erros.slice(0, 3).join(' | ') : ''));
  console.log('FALHAS (' + falhas + '):'); await b.close(); process.exit(falhas ? 1 : 0);
})();
