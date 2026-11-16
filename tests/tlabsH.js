// tlabsH.js: laboratórios do módulo H da Química (Química orgânica) e gabaritos. Uso: node tests/tlabsH.js
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
  // ----- H01: leitor de cadeias -----
  if (temas.has('H01')) { await abre('H01');
    const cd = (i, m) => p.evaluate(([i, m]) => { SIM.qCadeia._ult.poe(i, m); return SIM.qCadeia._ult.est(); }, [i, m]);
    const nomes = await p.evaluate(() => SIM.qCadeia._ult.MOL.map((x) => x[0])), ix = (n) => nomes.indexOf(n);
    const a = await cd(ix('2,2,4-trimetilpentano'), 'classe'); ok(a.formula === 'C₈H₁₈' && a.cnt.slice(1).join(',') === '5,1,1,1' && a.aberta && a.ramificada && a.saturada && a.idh === 0 && a.sigma === 25, 'H01: 2,2,4-trimetilpentano: C₈H₁₈, 5 primários, 1 secundário, 1 terciário, 1 quaternário; 25 σ; aberta, ramificada, saturada');
    const b2 = await cd(ix('benzeno'), 'hib'); ok(b2.formula === 'C₆H₆' && b2.idh === 4 && b2.sigma === 12 && b2.pi === 3 && b2.aromatica && b2.hb.every((h) => h === 'sp2'), 'H01: benzeno: C₆H₆, IDH 4, 12 σ e 3 π, seis carbonos sp², aromática');
    const c = await cd(ix('but-2-ino'), 'hib'); ok(c.hb.filter((h) => h === 'sp').length === 2 && c.pi === 2 && c.idh === 2 && !c.saturada, 'H01: but-2-ino: dois carbonos sp, 2 π, IDH 2, insaturada');
    const d = await cd(ix('etoxietano'), 'classe'), e = await cd(ix('etanol'), 'classe'); ok(!d.homogenea && e.homogenea, 'H01: etoxietano é heterogênea (O entre carbonos); etanol é homogênea (O na ponta)');
    const f = await cd(ix('metilciclopentano'), 'classe'); ok(!f.aberta && f.ramificada && f.idh === 1 && f.sigma === 18, 'H01: metilciclopentano: fechada, ramificada, IDH 1 (o anel), 18 σ');
    await p.waitForTimeout(200); const l = await leitor('lab-cadeia'); ok(/C₆H₁₂/.test(l['fórmula molecular']) && /fechada, ramificada, saturada, homogênea/.test(l['cadeia']), 'H01: mostrador: ' + l['fórmula molecular'] + ' · ' + l['cadeia']);
    ok(await p.evaluate(() => document.querySelectorAll('#desafios .ex svg.figura line').length > 40 && document.querySelectorAll('#desafios .ex svg.figura text').length > 30), 'H01: as figuras dos exercícios têm estruturas desenhadas (traços e átomos)'); }
  //MAIS
  // ----- gabaritos: em todo exercício de alternativas, clicar na letra do gabarito tem de dar "certo" -----
  for (const cod of ['H01', 'H02', 'H03', 'H04', 'H05', 'H06', 'H07', 'H08', 'H09', 'H10', 'H11', 'H12', 'H13'].filter((c) => temas.has(c))) { await p.goto(RAIZ + '#/quimica/' + cod); await p.waitForTimeout(1300);
    const g = await p.evaluate(() => { const o = { n: 0, ruins: [] }; document.querySelectorAll('.ex').forEach((e) => { const bts = [...e.querySelectorAll('.alts .alt')]; if (!bts.length) return; o.n++; const d = e._d || {}; const bt = bts.find((x) => x.dataset.l === d.certa); if (!bt) return o.ruins.push((e.id || '?') + ' sem letra ' + d.certa); bt.click(); if (!bt.classList.contains('certa')) o.ruins.push((e.id || '?') + ' não aceitou'); }); return o; });
    if (g.n) ok(g.ruins.length === 0, cod + ': os ' + g.n + ' exercícios de alternativas aceitam a letra do gabarito' + (g.ruins.length ? ' → ' + g.ruins.join('; ') : '')); }
  ok(erros.length === 0, 'sem erros de JS' + (erros.length ? ' → ' + erros.slice(0, 3).join(' | ') : ''));
  console.log('FALHAS (' + falhas + '):'); await b.close(); process.exit(falhas ? 1 : 0);
})();
