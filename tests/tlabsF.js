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
  //MAIS
  // ----- gabaritos: em todo exercício de alternativas, clicar na letra do gabarito tem de dar "certo" -----
  for (const cod of ['F01', 'F02', 'F03', 'F04', 'F05', 'F06', 'F07', 'F08', 'F09', 'F10'].filter((c) => temas.has(c))) { await p.goto(RAIZ + '#/quimica/' + cod); await p.waitForTimeout(1300);
    const g = await p.evaluate(() => { const o = { n: 0, ruins: [] }; document.querySelectorAll('.ex').forEach((e) => { const bts = [...e.querySelectorAll('.alts .alt')]; if (!bts.length) return; o.n++; const d = e._d || {}; const bt = bts.find((x) => x.dataset.l === d.certa); if (!bt) return o.ruins.push((e.id || '?') + ' sem letra ' + d.certa); bt.click(); if (!bt.classList.contains('certa')) o.ruins.push((e.id || '?') + ' não aceitou'); }); return o; });
    if (g.n) ok(g.ruins.length === 0, cod + ': os ' + g.n + ' exercícios de alternativas aceitam a letra do gabarito' + (g.ruins.length ? ' → ' + g.ruins.join('; ') : '')); }
  ok(erros.length === 0, 'sem erros de JS' + (erros.length ? ' → ' + erros.slice(0, 3).join(' | ') : ''));
  console.log('FALHAS (' + falhas + '):'); await b.close(); process.exit(falhas ? 1 : 0);
})();
