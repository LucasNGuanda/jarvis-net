// tlabsR.js: dados, laboratórios e gabaritos dos temas de russo. Uso: node tests/tlabsR.js
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const RAIZ = 'file://' + path.resolve(__dirname, '..', 'index.html');
let falhas = 0; const ok = (c, m) => { console.log((c ? 'ok ' : 'FALHA ') + m); if (!c) falhas++; };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const erros = []; p.on('pageerror', (e) => erros.push(String(e))); await require('./adm')(p);
  const temas = new Set(fs.readdirSync(path.resolve(__dirname, '..', 'temas', 'russo')).map((f) => f.replace('.js', '')));
  const abre = async (cod) => { await p.goto(RAIZ + '#/russo/' + cod); await p.waitForTimeout(1500); };
  // ----- dados gerados (SIM.RU) -----
  await abre('RG01');
  const d = await p.evaluate(() => { const R = SIM.RU, A = R.ALF; return { n: A.length, ordem: A.map((x) => x.M).join(''), minus: A.every((x) => x.M.toLowerCase() === x.m), tipos: ['vogal', 'consoante', 'semivogal', 'sinal'].map((t) => A.filter((x) => x.tipo === t).length), grupos: ['amiga', 'falsa', 'nova'].map((g) => A.filter((x) => x.grupo === g).map((x) => x.M).join('')), exOk: A.every((x) => x.ex && x.ex.ru.toLowerCase().includes(x.m) && x.ex.pt), pal: Object.keys(R.PAL).length, palOk: Object.entries(R.PAL).every(([w, x]) => x.ac.replace(/́/g, '') === w && x.tr && x.pt && x.cl && [...x.ac].filter((c) => c === '́').length <= 1), listas: Object.values(R.LISTA).every((l) => l.length >= 5 && l.every((w) => R.PAL[w])), vog: R.VOG.map((x) => x.join('')).join(' '), dur: R.DUR.sempreDura.join('') + ' ' + R.DUR.sempreMole.join(''), par: R.PAR.every((x) => x.a.ac !== x.b.ac && x.a.ac.replace(/́/g, '') === x.ru && x.b.ac.replace(/́/g, '') === x.ru), wt: R.WT.map((x) => x.join('=')).join(' ') }; });
  // a ordem das 33 letras é conferida contra a ordenação russa do próprio navegador (Intl.Collator), que não vem dos nossos dados; o Ё fica logo depois do Е
  const ordNav = await p.evaluate(() => { const c = new Intl.Collator('ru'); return [...'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'].every((x, i, a) => !i || c.compare(a[i - 1], x) < 0) && SIM.RU.ALF.map((x) => x.M).filter((x) => x !== 'Ё').join('') === 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ' && SIM.RU.ALF[6].M === 'Ё'; });
  ok(d.n === 33 && d.minus && ordNav, 'dados: 33 letras, na ordem da ordenação russa do navegador, com o Ё depois do Е; minúscula de cada maiúscula');
  ok(d.tipos.join(',') === '10,20,1,2', 'dados: 10 vogais, 20 consoantes, 1 semivogal, 2 sinais (' + d.tipos.join(',') + ')');
  ok(d.grupos[0] === 'АЕКМОТ' && d.grupos[1] === 'ВНРСУХ' && [...d.grupos[2]].length === 21, 'dados: amigas А Е К М О Т; falsas amigas В Н Р С У Х; 21 novas');
  ok(d.exOk, 'dados: toda letra tem exemplo da tabela, o exemplo contém a letra e tem tradução');
  ok(d.pal >= 70 && d.palOk && d.listas, 'dados: ' + d.pal + ' palavras; a forma acentuada é a mesma palavra, com no máximo um acento; leitura, classe e tradução presentes; listas dos laboratórios só com palavras que têm dado');
  ok(d.vog === 'АЯ ЭЕ ЫИ ОЁ УЮ' && d.dur === 'ЖШЦ ЙЧЩ', 'dados: pares de vogais А/Я Э/Е Ы/И О/Ё У/Ю; sempre duras Ж Ш Ц; sempre moles Й Ч Щ');
  ok(d.par && d.wt.startsWith('ж=ž х=x ц=c ч=č ш=š щ=šč й=j'), 'dados: pares de acento com acentos diferentes; convenção do Wiktionary (ž x c č š šč j)');
  // ----- RG01: laboratório do alfabeto -----
  if (temas.has('RG01')) {
    const e = (l, f) => p.evaluate(([l, f]) => { SIM.ruAlfabeto._ult.poe(l, f); return SIM.ruAlfabeto._ult.est(); }, [l, f]);
    const n = await e('Н', 'todas'), v = await e('н', 'vogal'), s = await e('ъ', 'sinal'), c = await e('Й', 'consoante'), f = await e('Щ', 'falsa');
    ok(n.M === 'Н' && n.grupo === 'falsa' && n.tr === 'n' && n.acesas.length === 33 && v.M === 'Н' && v.acesas.join('') === 'АЕЁИОУЫЭЮЯ' && s.acesas.join('') === 'ЪЬ' && s.tipo === 'sinal' && c.acesas.length === 21 && c.dm === 'Always soft' && f.acesas.join('') === 'ВНРСУХ' && f.grupo === 'nova', 'RG01 alfabeto: Н é falsa amiga (n); filtros: 33 letras, 10 vogais, 2 sinais, 21 consoantes (com o Й), 6 falsas amigas');
    const tela = await p.evaluate(() => { SIM.ruAlfabeto._ult.poe('Р', 'todas'); const el = document.getElementById('lab-alfabeto'); return { bts: el.querySelectorAll('[data-l]').length, txt: el.querySelector('[data-v=ficha]').textContent }; });
    ok(tela.bts === 33 && /эр/.test(tela.txt) && /falsa amiga/.test(tela.txt) && /река/.test(tela.txt) && /rio/.test(tela.txt), 'RG01 alfabeto: 33 botões; a ficha do Р mostra o nome (эр), o grupo e o exemplo da tabela com a tradução');
    // ----- RG01: laboratório de leitura (sorteio com semente: mesmo resultado sempre) -----
    const seq = (sem, niv, k) => p.evaluate(([sem, niv, k]) => { const u = SIM.ruLeitura._ult; u.nivel(niv); u.semente(sem); const o = [u.est().palavra]; for (let i = 1; i < k; i++) { u.prox(); o.push(u.est().palavra); } return o; }, [sem, niv, k]);
    const nC = await p.evaluate(() => SIM.RU.LISTA.cognatas.length), nT = await p.evaluate(() => SIM.RU.LISTA.todas.length);
    const a1 = await seq(7, 'cognatas', nC * 2), a2 = await seq(7, 'cognatas', nC * 2), a3 = await seq(8, 'cognatas', nC * 2), t1 = await seq(3, 'todas', nT);
    ok(a1.join() === a2.join() && a1.join() !== a3.join(), 'RG01 leitura: mesma semente, mesma sequência; outra semente, outra sequência');
    ok(new Set(a1.slice(0, nC)).size === nC && new Set(a1.slice(nC)).size === nC && a1[nC - 1] !== a1[nC] && new Set(t1).size === nT, 'RG01 leitura: cada volta passa por todas as palavras da lista uma vez (' + nC + ' parecidas, ' + nT + ' no total), sem repetir na virada');
    const esc = await p.evaluate(() => { const u = SIM.ruLeitura._ult, el = document.getElementById('lab-leitura'); u.nivel('cognatas'); u.semente(1); const x = u.est(), antes = el.querySelector('[data-v=pal]').textContent + el.querySelector('[data-v=lt]').textContent + el.querySelector('[data-v=st]').textContent; u.mostra(true, false); const meio = el.querySelector('[data-v=lt]').textContent; u.mostra(true, true); const fim = el.querySelector('[data-v=lt]').textContent + el.querySelector('[data-v=pal]').textContent; return { x, antes, meio, fim }; });
    ok(!esc.antes.includes(esc.x.tr) && !esc.antes.includes(esc.x.pt) && !esc.antes.includes('́') && esc.meio.includes(esc.x.tr) && !esc.meio.includes(esc.x.pt) && esc.fim.includes(esc.x.pt) && esc.fim.includes(esc.x.ac), 'RG01 leitura: antes de clicar, nem leitura, nem acento, nem tradução aparecem; "mostrar a leitura" não entrega a tradução');
    // ----- RG01: contas dos exercícios por outro caminho -----
    const ex = await p.evaluate(() => { const o = {}; const c = new Intl.Collator('ru'); document.querySelectorAll('.ex').forEach((e, i) => { const d = e._d || {}, alts = [...e.querySelectorAll('.alts .alt')], fig = (e.querySelector('svg text') || {}).textContent || ''; o[i + 1] = { certa: d.certa, alts: alts.map((x) => x.textContent.replace(/^[A-E]\)?\s*/, '').trim()), num: d.num ? d.num.v : null, fig }; }); const q = o[9].fig.split('·').map((s) => s.trim()); o.prim = [...q].sort(c.compare)[0]; return o; });
    const certaTxt = (k) => ex[k].alts['ABCDE'.indexOf(ex[k].certa)] || '';
    ok(certaTxt(9).includes(ex.prim), 'RG01 ex. 9: a primeira palavra na ordem do dicionário, pela ordenação russa do navegador, é a do gabarito (' + ex.prim + ')');
    ok(ex[11].num === [...ex[11].fig].filter((ch) => 'ВНРСУХ'.includes(ch)).length, 'RG01 ex. 11: número de falsas amigas contado direto na figura (' + ex[11].fig + ': ' + ex[11].num + ')');
    ok(ex[13].num === [...ex[13].fig.toLowerCase()].filter((ch) => 'аеёиоуыэюя'.includes(ch)).length, 'RG01 ex. 13: número de vogais contado direto na figura (' + ex[13].fig + ': ' + ex[13].num + ')');
    const figs = await p.evaluate(() => [...document.querySelectorAll('.ex')].map((e) => { const d = e._d || {}, r = String(d.resp || ''), f = [...e.querySelectorAll('svg text')].map((t) => t.textContent).join(' '); const naFig = [...e.querySelectorAll('.alts .alt')].filter((x) => f.includes(x.textContent.replace(/^[A-E]\)?\s*/, '').replace(/\.$/, '').trim())).length; /* figura que mostra todas as alternativas (ex.: quatro palavras para ordenar) não entrega nada */ return r.length > 1 && naFig < 2 && f.toLowerCase().includes(r.toLowerCase()) ? (e.id || '?') + ': ' + r : null; }).filter(Boolean));
    ok(figs.length === 0, 'RG01: nenhuma figura de exercício traz escrita a resposta' + (figs.length ? ' → ' + figs.join('; ') : ''));
  }
  // ----- gabaritos: em todo exercício de alternativas, clicar na letra do gabarito tem de dar "certo" -----
  for (const cod of [...temas].sort()) { await abre(cod);
    const g = await p.evaluate(() => { const o = { n: 0, ruins: [] }; document.querySelectorAll('.ex').forEach((e) => { const bts = [...e.querySelectorAll('.alts .alt')]; if (!bts.length) return; o.n++; const d = e._d || {}; const b = bts.find((x) => x.dataset.l === d.certa); if (!b) return o.ruins.push((e.id || '?') + ' sem letra ' + d.certa); b.click(); if (!b.classList.contains('certa')) o.ruins.push((e.id || '?') + ' não aceitou'); }); return o; });
    if (g.n) ok(g.ruins.length === 0, cod + ': os ' + g.n + ' exercícios de alternativas aceitam a letra do gabarito' + (g.ruins.length ? ' → ' + g.ruins.join('; ') : ''));
    const k = await p.evaluate(() => document.querySelectorAll('.katex-error').length); ok(k === 0, cod + ': nenhuma fórmula quebrada'); }
  ok(erros.length === 0, 'nenhum erro de JavaScript' + (erros.length ? ': ' + erros.join(' | ') : ''));
  await b.close(); console.log(falhas ? `\n${falhas} FALHA(S)` : '\ntudo certo'); process.exit(falhas ? 1 : 0);
})();
