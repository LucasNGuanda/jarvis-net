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
  // ----- F05: ordem de reação -----
  if (temas.has('F05')) { await abre('F05');
    const od = (n, a, k) => p.evaluate(([n, a, k]) => { SIM.qOrdem._ult.poe(n, a, k); return SIM.qOrdem._ult.est(); }, [n, a, k]);
    const o0 = await od(0, 1, 0.1), o1 = await od(1, 1, 0.1), o2 = await od(2, 1, 0.1);
    ok(perto(o0.meia, 5) && perto(o1.meia, 6.931, 0.001) && perto(o2.meia, 10), 'F05: [A]₀ = 1,00 e k = 0,100 → meias-vidas 5,00 s (ordem 0), 6,93 s (ordem 1), 10,0 s (ordem 2)');
    ok(o0.c10 === 0 && perto(o1.c10, 0.3679, 0.001) && perto(o2.c10, 0.5), 'F05: em t = 10 s restam 0 (ordem 0: acabou), 0,368 (ordem 1) e 0,500 mol/L (ordem 2)');
    const d1 = await od(1, 2, 0.1), d0 = await od(0, 2, 0.1), d2 = await od(2, 2, 0.1);
    ok(perto(d1.meia, o1.meia) && perto(d0.meia, 2 * o0.meia) && perto(d2.meia, o2.meia / 2), 'F05: dobrando [A]₀, a meia-vida não muda na ordem 1, dobra na ordem 0 e cai pela metade na ordem 2');
    await p.waitForTimeout(200); const l5 = await leitor('lab-ordem'); ok(/\[A\]²/.test(l5['lei de velocidade']) && /L\/\(mol·s\)/.test(l5['unidade de k']), 'F05: o mostrador dá a lei e a unidade de k da ordem escolhida → ' + l5['lei de velocidade'] + ' · ' + l5['unidade de k']); }
  // ----- F06: equilíbrio dinâmico -----
  if (temas.has('F06')) { await abre('F06');
    const eqv = (kd, ki, f, k = 3600) => p.evaluate(([kd, ki, f, k]) => { let s = 0, n = 0; for (let r = 0; r < 6; r++) { SIM.qEquilibrio._ult.poe(kd, ki, f); SIM.qEquilibrio._ult.passos(k); for (let j = 0; j < 20; j++) { SIM.qEquilibrio._ult.passos(30); s += SIM.qEquilibrio._ult.est().fb; n++; } } const e = SIM.qEquilibrio._ult.est(); return { fb: s / n, K: e.K, prev: e.prev, idas: e.idas3, voltas: e.voltas3 }; }, [kd, ki, f, k]);
    const a1 = await eqv(0.3, 0.1, 0), b1 = await eqv(0.3, 0.1, 1);
    ok(perto(a1.K, 3) && perto(a1.prev, 0.75) && Math.abs(a1.fb - 0.75) < 0.03 && Math.abs(b1.fb - 0.75) < 0.03, 'F06: kd = 0,30 e ki = 0,10 (K = 3) → 75% de B, partindo só de A (' + a1.fb.toFixed(3) + ') ou só de B (' + b1.fb.toFixed(3) + ')');
    const c1 = await eqv(0.1, 0.1, 0); ok(Math.abs(c1.fb - 0.5) < 0.03, 'F06: constantes iguais (K = 1) → metade de cada → ' + c1.fb.toFixed(3));
    ok(a1.idas > 5 && a1.voltas > 5 && Math.abs(a1.idas - a1.voltas) < 0.6 * Math.max(a1.idas, a1.voltas), 'F06: no equilíbrio as duas reações continuam e empatam (A → B: ' + a1.idas + ' e B → A: ' + a1.voltas + ' nos últimos 3 s)');
    ok(perto(await p.evaluate(() => SIM.eqAB.B(0.3, 0.1, 0, 2.5)), 0.75 * (1 - Math.exp(-1)), 1e-6), 'F06: a curva prevista chega a 63% do caminho em 1/(kd + ki) = 2,5 s'); }
  // ----- F07: Le Chatelier -----
  if (temas.has('F07')) { await abre('F07');
    const lc = (acoes) => p.evaluate((acoes) => { const u = SIM.qLeChatelier._ult; u.zera(); u.passos(300); const sai = [u.est()]; for (const a of acoes) { u.acao(a); sai.push(u.est()); u.passos(1500); sai.push(u.est()); } return sai; }, acoes);
    const prev = (n0, V, T) => p.evaluate(([n0, V, T]) => SIM.n2o4.eq(n0, V, T), [n0, V, T]);
    const i0 = (await lc([]))[0]; ok(perto(i0.K, 6.53e-3, 1e-3) && perto(i0.alfa, 0.120, 0.01) && perto(i0.Q, i0.K, 0.01), 'F07: começo em equilíbrio: 0,100 mol em 1,00 L a 25 °C, K = 6,53·10⁻³, 12,0% dissociado → ' + (100 * i0.alfa).toFixed(1) + '%');
    const c = await lc(['comp']), pc = await prev(0.1, 0.5, 298.15); ok(perto(c[1].Q / c[1].K, 2, 0.01) && perto(c[2].alfa, pc.alfa, 0.01) && perto(c[2].alfa, 0.086, 0.01) && c[2].n2 < c[0].n2, 'F07: comprimir à metade dobra Q; o equilíbrio vai para o N₂O₄ → ' + (100 * c[2].alfa).toFixed(1) + '% dissociado (previsto 8,6%)');
    const e = await lc(['exp']); ok(perto(e[1].Q / e[1].K, 0.5, 0.01) && perto(e[2].alfa, 0.165, 0.01), 'F07: expandir ao dobro divide Q por 2; vai para o NO₂ → ' + (100 * e[2].alfa).toFixed(1) + '% (previsto 16,5%)');
    const q = await lc(['quente']); ok(perto(q[1].K, 2.61e-2, 0.01) && perto(q[1].Q, q[0].Q, 1e-6) && perto(q[2].alfa, 0.225, 0.01), 'F07: esquentar 20 °C muda K (2,61·10⁻²) e não mexe em Q na hora; no fim, ' + (100 * q[2].alfa).toFixed(1) + '% (previsto 22,5%)');
    const f = await lc(['frio']); ok(perto(f[1].K, 1.33e-3, 0.01) && perto(f[2].alfa, 0.056, 0.02), 'F07: esfriar 20 °C → K = 1,33·10⁻³ e ' + (100 * f[2].alfa).toFixed(1) + '% (previsto 5,6%)');
    const m = await lc(['mais1']), pm = await prev(0.15, 1, 298.15); ok(m[1].Q < m[1].K && perto(m[2].n2, pm.n2, 0.01) && m[2].n1 > m[0].n1 && m[2].n1 < m[1].n1, 'F07: + N₂O₄ → Q < K, anda para a direita e gasta só PARTE do que entrou (N₂O₄: ' + m[0].n1.toFixed(4) + ' → ' + m[1].n1.toFixed(4) + ' → ' + m[2].n1.toFixed(4) + ' mol)');
    const m2 = await lc(['mais2']); ok(m2[1].Q > m2[1].K && m2[2].n2 < m2[1].n2 && perto(m2[2].Q, m2[2].K, 0.01), 'F07: + NO₂ → Q > K, anda para a esquerda até Q = K');
    const ci = await lc(['cat', 'inerte']); ok(perto(ci[1].Q, ci[0].Q, 1e-6) && perto(ci[4].n2, ci[0].n2, 0.002) && perto(ci[3].Q, ci[3].K, 0.01), 'F07: catalisador e gás inerte a volume fixo não deslocam nada (NO₂ fica em ' + ci[4].n2.toFixed(4) + ' mol)');
    await p.evaluate(() => { SIM.qLeChatelier._ult.acao('cat'); SIM.qLeChatelier._ult.zera(); }); }
  //MAIS
  // ----- gabaritos: em todo exercício de alternativas, clicar na letra do gabarito tem de dar "certo" -----
  for (const cod of ['F01', 'F02', 'F03', 'F04', 'F05', 'F06', 'F07', 'F08', 'F09', 'F10'].filter((c) => temas.has(c))) { await p.goto(RAIZ + '#/quimica/' + cod); await p.waitForTimeout(1300);
    const g = await p.evaluate(() => { const o = { n: 0, ruins: [] }; document.querySelectorAll('.ex').forEach((e) => { const bts = [...e.querySelectorAll('.alts .alt')]; if (!bts.length) return; o.n++; const d = e._d || {}; const bt = bts.find((x) => x.dataset.l === d.certa); if (!bt) return o.ruins.push((e.id || '?') + ' sem letra ' + d.certa); bt.click(); if (!bt.classList.contains('certa')) o.ruins.push((e.id || '?') + ' não aceitou'); }); return o; });
    if (g.n) ok(g.ruins.length === 0, cod + ': os ' + g.n + ' exercícios de alternativas aceitam a letra do gabarito' + (g.ruins.length ? ' → ' + g.ruins.join('; ') : '')); }
  ok(erros.length === 0, 'sem erros de JS' + (erros.length ? ' → ' + erros.slice(0, 3).join(' | ') : ''));
  console.log('FALHAS (' + falhas + '):'); await b.close(); process.exit(falhas ? 1 : 0);
})();
