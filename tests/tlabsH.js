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
  // ----- H05: forças e propriedades -----
  if (temas.has('H05')) { await abre('H05');
    const pf = (a, b2) => p.evaluate(([a, b2]) => { SIM.qPropFisicas._ult.poe(a, b2); return SIM.qPropFisicas._ult.est(); }, [a, b2]);
    const a = await pf('etanol', 'metoximetano'); ok(a.a.ne === 26 && a.b.ne === 26 && a.a.lh && !a.b.lh && a.b.dipolo && a.maior === 'etanol' && a.motivo === 'lh' && perto(a.dif, 102.23, 1e-3), 'H05: etanol × metoximetano: 26 elétrons cada; só o etanol faz ligação de H; diferença de 102 °C');
    const b2 = await pf('pentano', 'dimetilpropano'); ok(b2.motivo === 'formato' && b2.maior === 'pentano' && !b2.a.dipolo, 'H05: pentano × dimetilpropano: mesma fórmula, decide o formato');
    const c = await pf('tetraclorometano', 'clorometano'); ok(c.maior === 'tetraclorometano' && !c.a.dipolo && c.b.dipolo && c.motivo === 'london' && c.a.ne === 74 && c.b.ne === 26, 'H05: CCl₄ (apolar, 74 elétrons) ferve acima de CH₃Cl (polar, 26): vence a força de London');
    const d = await pf('octano', 'pentano'), e = await pf('propano-1,2,3-triol', 'propan-1-ol'); ok(d.motivo === 'london' && e.maior === 'propano-1,2,3-triol' && e.a.don === 3, 'H05: octano × pentano: tamanho; glicerina tem 3 doadores de ligação de H');
    ok(await p.evaluate(() => { const P = SIM.org.PROP; return P.etanol.eb === 78.23 && P['butan-1-ol'].sol === 73 && P.cicloexano.sol === 'imiscível' && P['N-metilmetanamina'].sol === 1540 && Object.keys(P).length === 51; }), 'H05: tabela gerada das fontes: 51 compostos; etanol 78,23 °C; butan-1-ol 73 g/L; cicloexano imiscível');
    await pf('etanol', 'metoximetano'); await p.waitForTimeout(150); const l = await leitor('lab-prop'); ok(/ligação de H/.test(l['A: forças']) && !/ligação de H/.test(l['B: forças']) && /miscível/.test(l['A: em água']), 'H05: mostrador: A ' + l['A: forças'] + ' · B ' + l['B: forças']); }
  // ----- H06: escada de acidez -----
  if (temas.has('H06')) { await abre('H06');
    const ac = (a, b2, ph) => p.evaluate(([a, b2, ph]) => { SIM.qAcidez._ult.poe(a, b2, ph); return SIM.qAcidez._ult.est(); }, [a, b2, ph]);
    const a = await ac('ácido etanoico', 'etanol', 7); ok(a.pa === 4.76 && a.pb === 16 && a.forte === 'ácido etanoico' && perto(a.fator, 11.24, 1e-6) && perto(a.fa, 1 / (1 + Math.pow(10, 4.76 - 7)), 1e-9) && a.fb < 1e-8, 'H06: ácido etanoico × etanol: pKa 4,76 e 16,0; 10^11,2 vezes; em pH 7, ' + (100 * a.fa).toFixed(1) + '% do ácido como ânion');
    const b2 = await ac('fenol', 'etanol', 9.89), c = await ac('ácido etanoico', 'fenol', 4.76); ok(perto(b2.fa, 0.5, 1e-9) && perto(c.fa, 0.5, 1e-9) && perto(b2.fator, 6.11, 1e-6), 'H06: com pH = pKa, metade ionizado (fenol em 9,89; etanoico em 4,76); fenol é 10^6,1 vezes mais ácido que o etanol');
    const d = await ac('ácido tricloroetanoico', 'ácido cloroetanoico', 1), e = await ac('etino', 'etano', 14); ok(d.forte === 'ácido tricloroetanoico' && e.forte === 'etino' && e.fator === 25, 'H06: efeito indutivo (tricloro 0,66 < cloro 2,86) e hibridização (etino 25 < etano 50)');
    ok(await p.evaluate(() => { const o = SIM.org; return Math.abs(o.fracBase(4.19, 8) - 0.99985) < 1e-4 && Math.abs(o.fracBase(9.89, 8) - 0.0127) < 1e-3 && Math.abs(1 - o.fracBase(4.63, 1) - 0.99977) < 1e-4 && Object.keys(o.PKA).length === 23; }), 'H06: frações do chefão (benzoico em pH 8: 99,98%; fenol: 1,3%; anilina protonada em pH 1: 99,98%); 23 pKa na tabela gerada'); }
  // ----- H07: isômeros -----
  if (temas.has('H07')) { await abre('H07');
    const is = (f, a, b2) => p.evaluate(([f, a, b2]) => { SIM.qIsomeros._ult.poe(f, a, b2); return SIM.qIsomeros._ult.est(); }, [f, a, b2]);
    const n = await p.evaluate(() => Object.fromEntries(Object.entries(SIM.org.ISO).map(([k, v]) => [k, v.length])));
    ok(n.C4H10 === 2 && n.C5H12 === 3 && n.C6H14 === 5 && n.C4H8 === 5 && n.C5H10 === 10 && n.C2H6O === 2 && n.C3H8O === 3 && n.C4H10O === 7 && n.C4H9Cl === 4 && n.C3H9N === 4, 'H07: contagens da tabela gerada: C₄H₁₀ 2, C₅H₁₂ 3, C₆H₁₄ 5, C₄H₈ 5, C₅H₁₀ 10, C₂H₆O 2, C₃H₈O 3, C₄H₁₀O 7, C₄H₉Cl 4, C₃H₉N 4');
    const a = await is('C4H10O', 'butan-1-ol', 'etoxietano'), b2 = await is('C4H10O', 'butan-1-ol', 'butan-2-ol'), c = await is('C4H10O', 'butan-1-ol', '2-metilpropan-1-ol'), d = await is('C4H10O', 'etoxietano', '1-metoxipropano');
    ok(a.tipo === 'função' && b2.tipo === 'posição' && c.tipo === 'cadeia' && d.tipo === 'compensação', 'H07: C₄H₁₀O: função (álcool × éter), posição (butan-1-ol × butan-2-ol), cadeia (× 2-metilpropan-1-ol), compensação (etoxietano × 1-metoxipropano)');
    const e = await is('C4H8', 'but-1-eno', 'ciclobutano'), f = await is('C3H6O', 'propanal', 'propanona'), g2 = await is('C4H8', 'but-1-eno', 'but-2-eno'); ok(e.tipo === 'cadeia' && f.tipo === 'função' && g2.tipo === 'posição' && e.idh === 1, 'H07: alceno × cicloalcano = cadeia; propanal × propanona = função; but-1-eno × but-2-eno = posição');
    ok(await p.evaluate(() => Object.values(SIM.org.ISO).every((L) => L.every((x) => x[2] && SIM.org.formula(x[0]) === SIM.org.formula(L[0][0])) && new Set(L.map((x) => x[2])).size === L.length)), 'H07: em cada fórmula, todos os isômeros têm nome, os nomes não se repetem e a fórmula molecular é a mesma');
    await is('C4H10O'); await p.click('#lab-iso [data-i="0"]'); await p.click('#lab-iso [data-i="5"]'); const l = await leitor('lab-iso'); ok(/função/.test(l['isomeria entre os dois']), 'H07: clicando num álcool e num éter, o mostrador diz "de função" → ' + l['isomeria entre os dois']); }
  // ----- H08: estereoisômeros -----
  if (temas.has('H08')) { await abre('H08');
    const es = (n) => p.evaluate((n) => { SIM.qEstereo._ult.poe(n); return SIM.qEstereo._ult.est(); }, n);
    const a = await es('butan-2-ol'), b2 = await es('propan-2-ol'); ok(a.nc === 1 && a.n === 2 && a.pares === 1 && a.grupos[0].slice().sort().join() === ['C₂H₅', 'CH₃', 'H', 'OH'].sort().join() && b2.nc === 0 && b2.n === 1, 'H08: butan-2-ol: 1 carbono quiral (H, OH, CH₃, C₂H₅), 2 enantiômeros; propan-2-ol: nenhum');
    const c = await es('but-2-eno'), d = await es('but-1-eno'), e = await es('2-metilbut-2-eno'); ok(c.nd === 1 && c.n === 2 && c.cis[0] && d.nd === 0 && d.n === 1 && e.nd === 0, 'H08: but-2-eno tem cis e trans; but-1-eno e 2-metilbut-2-eno não');
    const f = await es('ácido 2,3-di-hidroxibutanodioico (tartárico)'), g2 = await es('2-bromo-3-clorobutano'); ok(f.nc === 2 && f.max === 4 && f.n === 3 && f.meso === 1 && f.pares === 1 && g2.n === 4 && g2.meso === 0 && g2.pares === 2, 'H08: tartárico: 2 centros, máximo 4, existem 3 (1 meso + 1 par); 2-bromo-3-clorobutano: 4, sem meso');
    const h = await es('2,3,4,5,6-penta-hidroxi-hexanal (glicose, cadeia aberta)'), i2 = await es('pent-3-en-2-ol'), j = await es('hexa-2,4-dieno'); ok(h.nc === 4 && h.n === 16 && i2.nc === 1 && i2.nd === 1 && i2.n === 4 && j.nd === 2 && j.n === 3, 'H08: glicose aberta: 4 centros, 16; pent-3-en-2-ol: 1 centro + 1 dupla, 4; hexa-2,4-dieno: 2 duplas, 3 (simetria)');
    ok(await p.evaluate(() => Object.values(SIM.org.EST).every((e) => e.n <= Math.pow(2, e.c.length + e.d.length) && e.meso + e.quirais <= e.n && e.quirais % 2 === 0) && Object.keys(SIM.org.EST).length === 49), 'H08: tabela gerada: 49 compostos, n ≤ 2ⁿ em todos, quirais sempre em pares');
    await p.evaluate(() => SIM.qEstereo._ult.poe('butan-2-ol', false)); const l0 = await leitor('lab-estereo'); await p.click('#lab-estereo [data-v=ver]'); const l1 = await leitor('lab-estereo'); ok(l0['carbonos quirais'] === '?' && l1['carbonos quirais'] === '1' && l1['estereoisômeros de verdade'] === '2' && await p.evaluate(() => document.querySelectorAll('#lab-estereo polygon').length === 2), 'H08: o mostrador esconde a resposta até clicar em mostrar; depois, 1 centro, 2 estereoisômeros e as duas imagens com cunha'); }
  // ----- H09 a H12: reações (tabela gerada e laboratórios) -----
  const rx = (lab, rot) => p.evaluate(([lab, rot]) => { SIM[lab]._ult.poe(rot); return SIM[lab]._ult.est(); }, [lab, rot]);
  if (temas.has('H09')) { await abre('H09');
    const a = await rx('qSubstituicao', '2-metilbutano + Cl₂'), b2 = await rx('qSubstituicao', 'dimetilpropano + Cl₂'), c = await rx('qSubstituicao', 'propano + Cl₂'); ok(a.n === 4 && a.hs.reduce((x, y) => x + y, 0) === 12 && b2.n === 1 && b2.hs[0] === 12 && c.n === 2 && c.prods.includes('2-cloropropano'), 'H09: monoclorados: 2-metilbutano 4 (12 H no total), dimetilpropano 1 (12 H equivalentes), propano 2');
    const d = await rx('qSubstituicao', 'bromoetano + NaOH'), e = await rx('qSubstituicao', 'metilbenzeno + HNO₃'), f = await rx('qSubstituicao', 'nitrobenzeno + HNO₃'); ok(d.p === 'etanol' && d.co === 'NaBr' && e.p === '1-metil-2-nitrobenzeno' && e.s === '1-metil-4-nitrobenzeno' && f.p === '1,3-dinitrobenzeno' && !f.s, 'H09: bromoetano + NaOH → etanol + NaBr; metilbenzeno nitra em orto e para; nitrobenzeno, em meta');
    const g2 = await rx('qSubstituicao', 'ácido etanoico + etanol'), h = await rx('qSubstituicao', 'etanoato de etila + NaOH'); ok(g2.p === 'etanoato de etila' && g2.co === 'H2O' && h.p === 'etanoato de sódio' && h.s === 'etanol', 'H09: esterificação dá etanoato de etila + água; saponificação dá etanoato de sódio + etanol');
    ok(await p.evaluate(() => { const O = SIM.org; return O.RX.length === 118 && O.RX.every((x) => x.r.every((n) => O.NOMES[n]) && (!x.p || O.NOMES[x.p]) && (!x.s || O.NOMES[x.s]) && O.TIPO[x.t] && O.REGRA(x)) && O.RAD.every((r) => r.p.reduce((t, y) => t + y[1], 0) === O.conta(O.parse(O.NOMES[r.r])).H); }), 'H09: tabela gerada: 118 reações, todo nome tem estrutura, todo tipo tem regra escrita; na radicalar os H somam o total do alcano');
    ok(await p.evaluate(() => { const O = SIM.org, f = (n) => JSON.stringify(O.conta(O.parse(O.NOMES[n]))); return O.RX.filter((x) => /^ad-(hx|h2o)|^el-(hx|h2o)/.test(x.t) && x.s).every((x) => f(x.p) === f(x.s)); }), 'H09: principal e secundário (Markovnikov, Zaitsev) são sempre isômeros');
    await p.evaluate(() => SIM.qSubstituicao._ult.poe('bromoetano + NaOH', false)); const l0 = await leitor('lab-subst'); await p.click('#lab-subst [data-v=ver]'); const l1 = await leitor('lab-subst'); ok(l0['produto principal'] === '?' && l1['produto principal'] === 'etanol', 'H09: o laboratório esconde o produto até clicar em mostrar → ' + l1['produto principal']); }
  //MAIS
  // ----- gabaritos: em todo exercício de alternativas, clicar na letra do gabarito tem de dar "certo" -----
  for (const cod of ['H01', 'H02', 'H03', 'H04', 'H05', 'H06', 'H07', 'H08', 'H09', 'H10', 'H11', 'H12', 'H13'].filter((c) => temas.has(c))) { await p.goto(RAIZ + '#/quimica/' + cod); await p.waitForTimeout(1300);
    const g = await p.evaluate(() => { const o = { n: 0, ruins: [] }; document.querySelectorAll('.ex').forEach((e) => { const bts = [...e.querySelectorAll('.alts .alt')]; if (!bts.length) return; o.n++; const d = e._d || {}; const bt = bts.find((x) => x.dataset.l === d.certa); if (!bt) return o.ruins.push((e.id || '?') + ' sem letra ' + d.certa); bt.click(); if (!bt.classList.contains('certa')) o.ruins.push((e.id || '?') + ' não aceitou'); }); return o; });
    if (g.n) ok(g.ruins.length === 0, cod + ': os ' + g.n + ' exercícios de alternativas aceitam a letra do gabarito' + (g.ruins.length ? ' → ' + g.ruins.join('; ') : '')); }
  ok(erros.length === 0, 'sem erros de JS' + (erros.length ? ' → ' + erros.slice(0, 3).join(' | ') : ''));
  console.log('FALHAS (' + falhas + '):'); await b.close(); process.exit(falhas ? 1 : 0);
})();
