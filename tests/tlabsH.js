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
    ok(await p.evaluate(() => document.querySelectorAll('#desafios .ex svg.figura line').length >= 20 && document.querySelectorAll('#desafios .ex svg.figura text').length >= 15), 'H01: as figuras dos exercícios têm estruturas desenhadas (traços e átomos)'); }
  // ----- H02: nomenclatura -----
  if (temas.has('H02')) { await abre('H02');
    const nm = (n, t, pi, sb) => p.evaluate(([n, t, pi, sb]) => { SIM.qNomenclatura._ult.poe(n, t, pi, sb); return SIM.qNomenclatura._ult.est(); }, [n, t, pi, sb]);
    const a = await nm(5, 0, 1, [[2, 'metil']]); ok(a.seu === '2-metilpentano' && a.igual && a.formula === 'C₆H₁₄', 'H02: pentano com metil no 2 → 2-metilpentano, nome oficial');
    const b2 = await nm(5, 0, 1, [[4, 'metil']]); ok(b2.seu === '4-metilpentano' && b2.iupac === '2-metilpentano' && b2.motivo === 'numeracao', 'H02: "4-metilpentano" é acusado: numeração pela outra ponta → 2-metilpentano');
    const c = await nm(4, 0, 1, [[2, 'etil']]); ok(c.seu === '2-etilbutano' && c.iupac === '3-metilpentano' && c.motivo === 'cadeia' && c.nPrinc === 5, 'H02: "2-etilbutano" é acusado: a cadeia principal tem 5 carbonos → 3-metilpentano');
    const d = await nm(4, 2, 3, []); ok(d.seu === 'but-3-eno' && d.iupac === 'but-1-eno', 'H02: "but-3-eno" → but-1-eno');
    const e = await nm(4, 3, 2, [[2, 'metil']]); ok(e.imp && e.motivo === 'impossivel', 'H02: metil em carbono de tripla → o laboratório avisa que a molécula não existe (cinco ligações)');
    const f = await nm(5, 2, 2, [[4, 'metil']]), g2 = await nm(4, 2, 1, [[3, 'metil']]); ok(f.iupac === '4-metilpent-2-eno' && f.igual && g2.iupac === '3-metilbut-1-eno' && g2.igual, 'H02: a insaturação manda na numeração: 4-metilpent-2-eno e 3-metilbut-1-eno');
    const h = await nm(1, 0, 1, []), i2 = await nm(8, 0, 1, []); ok(h.iupac === 'metano' && i2.iupac === 'octano', 'H02: extremos do controle: metano e octano');
    ok(await p.evaluate(() => { const o = SIM.org; return ['CC(C)CC(C)(C)C', 'CCC(CC)C(C)C', 'C=CC=C', 'C=CCC#C', 'CC(C)C#CC'].map((s) => o.nome(s)).join('|'); }) === '2,2,4-trimetilpentano|3-etil-2-metilpentano|buta-1,3-dieno|pent-1-en-4-ino|4-metilpent-2-ino', 'H02: nomes de conferência: 2,2,4-trimetilpentano; 3-etil-2-metilpentano; buta-1,3-dieno; pent-1-en-4-ino; 4-metilpent-2-ino'); await nm(5, 0, 1, [[2, 'metil']]); }
  // ----- H03: caça às funções -----
  if (temas.has('H03')) { await abre('H03');
    const fn = (nome, ms) => p.evaluate(([nome, ms]) => { const u = SIM.qFuncoes._ult; u.poe(u.MOL.indexOf(nome), ms); return u.est(); }, [nome, ms]);
    const a = await fn('ácido acetilsalicílico', ['éster', 'ácido carboxílico']); ok(a.certo && a.tem.sort().join(',') === 'ácido carboxílico,éster' && a.formula === 'C₉H₈O₄', 'H03: ácido acetilsalicílico (C₉H₈O₄): éster e ácido carboxílico; marcação certa é aceita');
    const b2 = await fn('ácido acetilsalicílico', ['cetona', 'álcool', 'éter']); ok(!b2.certo, 'H03: marcar "cetona, álcool e éter" no ácido acetilsalicílico é recusado (o erro clássico)');
    const c = await fn('vanilina', ['aldeído', 'éter', 'fenol']), d = await fn('fenol', ['álcool']), e = await fn('propano-1,2,3-triol', ['álcool']); ok(c.certo && !d.certo && d.tem[0] === 'fenol' && e.certo && e.fs.length === 3, 'H03: vanilina = aldeído, éter e fenol; fenol não é álcool; a glicerina tem três grupos álcool');
    await p.evaluate(() => { const u = SIM.qFuncoes._ult; u.poe(u.MOL.indexOf('etanoato de etila'), ['éster']); u.confere(); }); await p.waitForTimeout(150); ok(/Certo/.test(await p.evaluate(() => document.querySelector('#lab-funcoes .status').textContent)) && await p.evaluate(() => document.querySelectorAll('#lab-funcoes svg circle').length >= 3), 'H03: "conferir" responde "Certo" e destaca os átomos do grupo éster');
    ok(await p.evaluate(() => { const o = SIM.org; return o.COMP.every((c) => { try { o.svg(c[2]); return true; } catch (e) { return false; } }); }), 'H03: os 73 compostos da tabela são desenhados sem erro'); }
  // ----- H04: caça às funções com N e halogênio -----
  if (temas.has('H04')) { await abre('H04');
    const fn = (nome, ms) => p.evaluate(([nome, ms]) => { const u = SIM.qFuncoesN._ult; u.poe(u.MOL.indexOf(nome), ms); return u.est(); }, [nome, ms]);
    const a = await fn('paracetamol', ['amida', 'fenol']), b2 = await fn('paracetamol', ['amina', 'fenol']); ok(a.certo && !b2.certo, 'H04: paracetamol = amida e fenol; "amina e fenol" é recusado');
    const c = await fn('alanina', ['amina', 'ácido carboxílico']), d = await fn('ureia', ['amida']); ok(c.certo && d.certo && d.fs.length === 1, 'H04: alanina = amina e ácido carboxílico (aminoácido); ureia = amida, com os dois N no mesmo grupo');
    const e = await fn('N,N-dimetilmetanamina', ['amina']), f = await fn('etanamina', ['amina']), g2 = await fn('N-metilmetanamina', ['amina']); ok(e.fs[0].cls === 3 && f.fs[0].cls === 1 && g2.fs[0].cls === 2, 'H04: classes de amina pelo nitrogênio: etanamina 1ª, N-metilmetanamina 2ª, N,N-dimetilmetanamina 3ª');
    const h = await fn('clorobenzeno', ['haleto de arila']), i2 = await fn('cloreto de etanoíla', ['haleto de acila']), j = await fn('2-cloropropano', ['haleto de alquila']); ok(h.certo && i2.certo && j.certo && j.fs[0].cls === 2, 'H04: os três tipos de haleto são distinguidos; 2-cloropropano é secundário');
    ok(await p.evaluate(() => !/amin|amid|nitr|clor/i.test(document.querySelector('#lab-funcoesn .ctrls .bts').textContent)), 'H04: os botões das moléculas não mostram o nome (que entregaria a função)'); }
  //MAIS
  // ----- gabaritos: em todo exercício de alternativas, clicar na letra do gabarito tem de dar "certo" -----
  for (const cod of ['H01', 'H02', 'H03', 'H04', 'H05', 'H06', 'H07', 'H08', 'H09', 'H10', 'H11', 'H12', 'H13'].filter((c) => temas.has(c))) { await p.goto(RAIZ + '#/quimica/' + cod); await p.waitForTimeout(1300);
    const g = await p.evaluate(() => { const o = { n: 0, ruins: [] }; document.querySelectorAll('.ex').forEach((e) => { const bts = [...e.querySelectorAll('.alts .alt')]; if (!bts.length) return; o.n++; const d = e._d || {}; const bt = bts.find((x) => x.dataset.l === d.certa); if (!bt) return o.ruins.push((e.id || '?') + ' sem letra ' + d.certa); bt.click(); if (!bt.classList.contains('certa')) o.ruins.push((e.id || '?') + ' não aceitou'); }); return o; });
    if (g.n) ok(g.ruins.length === 0, cod + ': os ' + g.n + ' exercícios de alternativas aceitam a letra do gabarito' + (g.ruins.length ? ' → ' + g.ruins.join('; ') : '')); }
  ok(erros.length === 0, 'sem erros de JS' + (erros.length ? ' → ' + erros.slice(0, 3).join(' | ') : ''));
  console.log('FALHAS (' + falhas + '):'); await b.close(); process.exit(falhas ? 1 : 0);
})();
