// β 4.1 — acesso por código: visitante, os três tipos de código, trava das páginas, sufixo da versão,
// pular animação, voltar a visitante, exportar e a troca de idioma. Uso: node tests/tacesso.js
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const base = 'file://' + path.resolve(__dirname, '..', 'index.html');
const falhas = []; const conf = (ok, txt, extra) => { console.log((ok ? 'ok     ' : 'FALHA  ') + txt + (extra !== undefined ? ' → ' + extra : '')); if (!ok) falhas.push(txt); };
const COD = { adm: '55_admfreee_will', tester: 'beta8976_@freewill_choise', fisica: 'frewill_físic98025_p', fisicaSemAcento: 'frewill_fisic98025_p', matematica: 'free-willp-mat98017', quimica: 'free_quimic', idiomas: 'let-me_slavic98716', config: 'give-meskinn', alemao: 'ich-will_deutsch4471', sanscrito: 'om_samskrta8840', jarvis: 'talk-to_jarvis_freewill01' };
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true }); const p = await ctx.newPage();
  const erros = []; p.on('pageerror', (e) => erros.push(e.message));
  const ir = async (h, ms = 500) => { await p.goto(base + h); await p.waitForTimeout(ms); };
  const zera = async (chaves) => { await ir('#/home', 200); await p.evaluate((ch) => { Object.keys(localStorage).forEach((k) => localStorage.removeItem(k)); if (ch) localStorage.setItem('jarvis:acesso', JSON.stringify({ chaves: ch })); }, chaves || null); await p.reload(); await p.waitForTimeout(500); };
  const chaves = () => p.evaluate(() => (JSON.parse(localStorage.getItem('jarvis:acesso') || '{"chaves":[]}').chaves || []).join(','));
  const bloqueada = async (h) => { await ir(h); return p.evaluate(() => !!document.querySelector('.jv-bloq')); };
  const cartao = (id) => p.evaluate((id) => { const a = [...document.querySelectorAll('.jv-materias a, .jv-materias .jv-mat')].find((x) => (x.getAttribute('href') || '') === '#/' + id || x.dataset.materia === id); return a ? { tranca: a.classList.contains('sem-acesso') || a.classList.contains('trancado'), dica: a.getAttribute('data-dica') || '' } : null; }, id);
  const versao = () => p.evaluate(() => document.querySelector('.jv-ver') ? document.querySelector('.jv-ver').textContent : document.getElementById('versao').textContent);
  const digita = async (linha, txt) => { await ir('#/codigos', 300); await p.fill(`.cod-linha[data-linha=${linha}] input`, txt); await p.press(`.cod-linha[data-linha=${linha}] input`, 'Enter'); await p.waitForTimeout(150); };
  const pula = async () => { const t = p.locator('.anim-pular'); if (await t.count()) await t.first().click({ force: true }); await p.waitForTimeout(400); };

  // 1. visitante
  await zera();
  const vis = await p.evaluate(() => ({ cards: [...document.querySelectorAll('.jv-materias a')].map((a) => a.getAttribute('href') + ':' + a.classList.contains('sem-acesso')).join(' '), roda: !!document.querySelector('.jv-ilu svg, .jv-ilu canvas'), campo: !!document.querySelector('.jv-pergunta input'), cad: document.querySelector('.jv-cadeado') ? document.querySelector('.jv-cadeado').getAttribute('href') : null, linguas: !!document.querySelector('.jv-linguas') }));
  conf(/#\/fisica:true/.test(vis.cards) || /#\/inicio:true/.test(vis.cards) || vis.cards.split(' ').every((c) => c.endsWith(':true')), 'visitante: todos os cartões de matéria com cadeado', vis.cards);
  conf(vis.cards.split(' ').filter(Boolean).every((c) => c.endsWith(':true')), 'visitante: nenhum cartão aberto', vis.cards);
  conf(vis.roda && vis.campo, 'visitante: figura central e campo do Jarvis continuam', JSON.stringify([vis.roda, vis.campo]));
  conf(vis.cad === '#/codigos', 'botão de cadeado ao lado da engrenagem leva a #/codigos', vis.cad);
  conf(!vis.linguas, 'visitante: sem barrinha de idiomas');
  const engr = await p.evaluate(() => document.querySelector('.jv-engrenagem').getAttribute('data-dica'));
  conf(engr === 'sem acesso · ir para códigos? duplo clique', 'visitante: engrenagem trancada com o aviso', engr);
  const dica = await p.evaluate(() => document.querySelector('.jv-materias a.sem-acesso').getAttribute('data-dica'));
  conf(dica === 'sem acesso · ir para códigos? duplo clique', 'aviso ao passar o mouse', dica);
  await p.click('.jv-materias a.sem-acesso', { force: true }); await p.waitForTimeout(300);
  conf((await p.evaluate(() => location.hash)) === '#/home', 'clique simples num cartão trancado não abre nada', await p.evaluate(() => location.hash));
  await p.dblclick('.jv-materias a.sem-acesso', { force: true }); await p.waitForTimeout(400);
  conf((await p.evaluate(() => location.hash)) === '#/codigos' && !!(await p.$('.cod-linha[data-linha=adm]')), 'duplo clique leva à página de códigos (3 linhas)', await p.evaluate(() => document.querySelectorAll('.cod-linha').length));
  for (const h of ['#/inicio', '#/A01', '#/experimentos', '#/experimental', '#/matematica', '#/matematica/CI07', '#/quimica', '#/russo', '#/alemao', '#/sanscrito-leitura']) conf(await bloqueada(h), `visitante: ${h} trancada`);
  conf((await versao()).indexOf('.') === (await versao()).indexOf('4.') + 1 && !/\.(ADM|tester)/.test(await versao()), 'visitante: versão sem sufixo', await versao());

  // 2. código errado: aviso discreto, nada de animação, nada gravado
  for (const [linha, txt] of [['adm', 'senha123'], ['tester', COD.adm], ['avulso', COD.tester], ['adm', COD.quimica]]) {
    await digita(linha, txt);
    const r = await p.evaluate((l) => ({ msg: document.querySelector(`.cod-linha[data-linha=${l}] .cod-msg`).textContent, anim: !!document.querySelector('.anim-acesso') }), linha);
    conf(r.msg === 'código não reconhecido' && !r.anim && (await chaves()) === '', `código errado na linha ${linha} ("${txt.slice(0, 6)}…"): só o aviso`, JSON.stringify(r));
  }

  // 3. códigos avulsos
  const AV = { fisica: { abre: ['#/inicio', '#/A01', '#/experimentos', '#/experimental'], fecha: ['#/matematica', '#/quimica', '#/russo'] }, matematica: { abre: ['#/matematica', '#/matematica-calculo', '#/matematica/CI07'], fecha: ['#/inicio', '#/quimica'] }, quimica: { abre: ['#/quimica', '#/quimica-experimentos'], fecha: ['#/A01', '#/matematica'] }, idiomas: { abre: ['#/russo', '#/russo-leitura'], fecha: ['#/inicio', '#/quimica', '#/alemao', '#/alemao-leitura', '#/sanscrito', '#/sanscrito-leitura'] }, alemao: { abre: ['#/alemao', '#/alemao-leitura', '#/alemao/DG01'], fecha: ['#/russo', '#/sanscrito', '#/inicio'] }, sanscrito: { abre: ['#/sanscrito', '#/sanscrito-leitura', '#/sanscrito/SL03'], fecha: ['#/russo', '#/alemao', '#/inicio'] }, jarvis: { abre: [], fecha: ['#/inicio', '#/matematica', '#/alemao'] }, config: { abre: [], fecha: ['#/inicio', '#/matematica'] } };
  for (const k of Object.keys(AV)) {
    await zera(); await digita('avulso', COD[k]);
    const anim = await p.evaluate(() => !!document.querySelector('.anim-acesso') && !document.querySelector('.anim-acesso.cheia'));
    await p.waitForTimeout(3200);
    const fim = await p.evaluate(() => ({ some: !document.querySelector('.anim-acesso'), toast: (document.querySelector('.toast-acesso') || {}).textContent || '', chips: [...document.querySelectorAll('.cod-chip')].map((c) => c.textContent).join(',') }));
    conf(anim && fim.some && /^acesso liberado · /.test(fim.toast) && (await chaves()) === k, `código avulso ${k}: animação curta (sem livro), aviso "${fim.toast}", chave gravada`, fim.chips);
    for (const h of AV[k].abre) conf(!(await bloqueada(h)), `  ${k}: ${h} abre`);
    for (const h of AV[k].fecha) conf(await bloqueada(h), `  ${k}: ${h} continua trancada`);
    await ir('#/home');
    conf(!/\.(ADM|tester)/.test(await versao()), `  ${k}: versão sem sufixo`, await versao());
    if (k === 'idiomas') conf(!!(await p.$('.jv-linguas')), '  idiomas: barrinha de idiomas aparece');
    if (k === 'config') {
      const g = await p.evaluate(() => ({ trancadas: document.querySelectorAll('.jv .trancado').length, cards: document.querySelectorAll('.jv-materias a.sem-acesso').length }));
      conf(g.cards === 4, '  config: as matérias continuam trancadas', g.cards);
      const engrL = await p.evaluate(() => document.querySelector('.jv-engrenagem').classList.contains('trancado'));
      conf(!engrL, '  config: engrenagem destrancada');
      await p.click('.jv-engrenagem'); await p.waitForTimeout(400);
      conf(await p.evaluate(() => !!document.querySelector('.jv-painel .jv-painel-fig')), '  config: a engrenagem abre o painel');
    }
  }
  // β 4.2: cada código vale uma vez ("código já usado"), sem animação e sem mudar nada
  await zera(); await digita('avulso', COD.quimica); await pula(); await digita('avulso', COD.quimica);
  { const r = await p.evaluate(() => ({ msg: document.querySelector('.cod-linha[data-linha=avulso] .cod-msg').textContent, anim: !!document.querySelector('.anim-acesso') })); conf(r.msg === 'código já usado' && !r.anim && (await chaves()) === 'quimica', 'código repetido: "código já usado", sem animação', JSON.stringify(r)); }
  await digita('adm', COD.adm); await pula(); await p.waitForTimeout(9500); await digita('adm', COD.adm);
  conf((await p.evaluate(() => document.querySelector('.cod-linha[data-linha=adm] .cod-msg').textContent)) === 'código já usado', 'ADM repetido também: "código já usado"');
  // β 4.2: só o código do russo → barrinha com alemão e sânscrito trancados (cadeado), cartão do russo aberto
  await zera(['idiomas']);
  { const r = await p.evaluate(() => ({ nome: document.querySelector('.jv-mat-idioma .jv-nome').textContent, tranc: [...document.querySelectorAll('.jv-linguas button.tranca')].map((b) => b.dataset.lingua).join(',') }));
    conf(r.nome === 'Russo' && r.tranc === 'alemao,sanscrito', 'código do russo: barrinha com alemão e sânscrito trancados', JSON.stringify(r)); }
  await p.click('.jv-linguas [data-lingua=alemao]'); await p.waitForTimeout(250);
  conf(await p.evaluate(() => document.querySelector('.jv-mat-idioma .jv-mat').classList.contains('sem-acesso')), 'trocar para o alemão sem o código dele: cartão com cadeado');
  // só o código do alemão (sem o do russo): a barrinha aparece e o cartão começa no alemão
  await zera(['alemao']);
  conf(await p.evaluate(() => !!document.querySelector('.jv-linguas') && document.querySelector('.jv-mat-idioma .jv-nome').textContent === 'Alemão' && !document.querySelector('.jv-mat-idioma .jv-mat').classList.contains('sem-acesso')), 'só o código do alemão: o cartão começa no alemão, aberto');
  // Jarvis: sem o código o campo fica desativado com "em breve"; com o código, ativo
  await zera(['fisica']);
  conf(await p.evaluate(() => document.querySelector('.jv-pergunta input').disabled && /em breve/.test(document.querySelector('.jv-pergunta').textContent)), 'sem o código do Jarvis: campo desativado com "em breve"');
  await zera(['jarvis']);
  conf(await p.evaluate(() => !document.querySelector('.jv-pergunta input').disabled && !/em breve/.test(document.querySelector('.jv-pergunta').textContent)), 'com o código do Jarvis: campo ativo');
  // física sem acento também vale
  await zera(); await digita('avulso', COD.fisicaSemAcento); await pula();
  conf((await chaves()) === 'fisica', 'código de física sem acento também vale', await chaves());

  // 4. tester
  await zera(); await digita('tester', COD.tester);
  conf(await p.evaluate(() => !!document.querySelector('.anim-acesso.cheia')), 'tester: animação de tela cheia começa');
  /* β 4.5: o livro já aparece aberto (as duas páginas) e os símbolos verdes chegam de todos os lados */
  await p.waitForTimeout(1300);
  { const r = await p.evaluate(() => { const sv = document.querySelector('.anim-acesso svg'), W = innerWidth, H = innerHeight, q = [0, 0, 0, 0];
      [...sv.querySelectorAll('text')].forEach((t) => { const b = t.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2; q[(x > W / 2 ? 1 : 0) + (y > H / 2 ? 2 : 0)]++; });
      return { esquerda: sv.querySelectorAll('rect[x="-76.0"][width="76.0"]').length, circulo: /stroke-dasharray:14 8/.test(sv.innerHTML), quadrantes: q }; });
    conf(r.esquerda >= 1 && r.circulo && r.quadrantes.every((n) => n >= 3), 'tester: livro aberto desde o começo, círculo de energia e símbolos verdes nos 4 cantos da tela', JSON.stringify(r)); }
  await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(600);
  conf(await p.evaluate(() => !document.querySelector('.anim-acesso') && location.hash === '#/home'), 'tester: Esc pula a animação e vai para a tela inicial', await p.evaluate(() => location.hash));
  conf(/β 4\.\d+\.tester$/.test((await versao()).trim()), 'tester: versão com .tester', await versao());
  conf(await p.evaluate(() => document.querySelector('.jv-ver .jv-suf').classList.contains('tester')), 'tester: ".tester" verde');
  /* β 4.5: cor esmeralda (título + figura) só para o tester (e o ADM); o tester não ganha o arco-íris */
  await p.hover('.jv-titulo h1'); await p.waitForTimeout(200);
  conf(await p.evaluate(() => !!document.querySelector('.jv-excl-esmeralda') && !document.querySelector('.jv-cor input[type=range]') && !document.querySelector('.jv-excl-dourado')), 'tester: só "esmeralda ✦" no seletor (sem arco-íris e sem dourado)');
  await p.click('.jv-excl-esmeralda'); await p.waitForTimeout(1200);
  conf(await p.evaluate(() => { const j = document.querySelector('.jv'), cs = getComputedStyle(j); return j.classList.contains('esmeralda') && cs.getPropertyValue('--jv2').trim() === '#2ee59d' && JSON.parse(localStorage.getItem('jarvis:cor')) === 'esmeralda' && document.querySelectorAll('.jv-ouro-p.esm').length > 0; }), 'tester: esmeralda no título e nas cores que a figura segue, salva, com símbolos verdes');
  await p.reload(); await p.waitForTimeout(600); conf(await p.evaluate(() => document.querySelector('.jv').classList.contains('esmeralda')), 'tester: esmeralda continua depois de recarregar');
  await p.evaluate(() => { const b = document.querySelector('.jv-cor button:not(.jv-ouro-bt)'); b.click(); }); await p.waitForTimeout(200);
  conf(await p.evaluate(() => !document.querySelector('.jv').classList.contains('esmeralda') && localStorage.getItem('jarvis:cor') === null), 'tester: "voltar à cor original" desliga o esmeralda');
  for (const h of ['#/inicio', '#/A01', '#/experimentos', '#/experimental']) conf(!(await bloqueada(h)), `tester: ${h} abre`);
  await ir('#/A01'); conf(/\.tester$/.test(await p.evaluate(() => document.getElementById('versao').textContent)), 'tester: sufixo também no topo', await p.evaluate(() => document.getElementById('versao').textContent));
  for (const h of ['#/matematica', '#/quimica', '#/russo', '#/alemao', '#/sanscrito']) { await ir(h); conf(await p.evaluate(() => !!document.querySelector('.jv-bloq') && document.querySelector('.jv-bloq .jv-breve').textContent === 'em construção'), `tester: ${h} trancada como "em construção"`); }
  await ir('#/home');
  const tq = await cartao('quimica');
  conf(tq && tq.tranca && /^em construção/.test(tq.dica), 'tester: cartão de Química com "em construção"', JSON.stringify(tq));
  conf(await p.evaluate(() => document.querySelector('.jv-engrenagem').classList.contains('trancado')), 'tester: engrenagem continua trancada');

  // 5. ADM: animação inteira, sem pular; a página não congela
  await zera(); await digita('adm', COD.adm);
  const quadros = await p.evaluate(() => new Promise((ok) => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(f); else ok(n); })(); }));
  conf(quadros > 40, 'ADM: a animação não congela a página (quadros em 2 s, no começo)', quadros);
  /* β 4.3: buraco negro no lugar do livro, com o conhecimento sendo sugado; e não trava nem no auge (mais símbolos na tela) */
  const bn = await p.evaluate(() => { const sv = document.querySelector('.anim-acesso svg'); return { buraco: !!sv.querySelector('#bn-cima-anim') && !!sv.querySelector('#bn-g-anim'), simbolos: sv.querySelectorAll('text').length, livro: /#f6ecd4/.test(sv.innerHTML) }; });
  conf(bn.buraco && !bn.livro && bn.simbolos > 20, 'ADM: buraco negro (sem o livro) sugando símbolos', JSON.stringify(bn));
  const quadros2 = await p.evaluate(() => new Promise((ok) => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(f); else ok(n); })(); }));
  conf(quadros2 > 40, 'ADM: não congela no auge (quadros em 2 s, entre 2 e 4 s)', quadros2);
  await p.waitForTimeout(5800); /* a animação dura 9,1 s */
  conf(await p.evaluate(() => !document.querySelector('.anim-acesso') && location.hash === '#/home'), 'ADM: animação termina sozinha na tela inicial');
  conf(/β 4\.\d+\.ADM$/.test((await versao()).trim()), 'ADM: versão com .ADM', await versao());
  conf(await p.evaluate(() => document.querySelector('.jv-ver .jv-suf').classList.contains('adm') && JARVIS.figuraCfg().id === 'buraconegro' && !!document.querySelector('.jv-ilu svg.jv-bn') && document.querySelector('.jv-ilu').style.visibility !== 'hidden' && !document.getElementById('pagina').style.transform), 'ADM (β 4.4): o buraco negro vira a figura central, ".ADM" dourado, nada escondido nem tremendo no fim');
  conf(await p.evaluate(() => !document.querySelector('.jv-ilu svg.jv-bn').classList.contains('real')), 'ADM (β 4.6): sem o título dourado, depois da explosão fica o buraco negro de arame');
  const adm = await p.evaluate(() => ({ cards: document.querySelectorAll('.jv-materias a.sem-acesso').length, tr: document.querySelectorAll('.jv .trancado').length, ling: !!document.querySelector('.jv-linguas') }));
  conf(adm.cards === 0 && adm.tr === 0 && adm.ling, 'ADM: nada trancado e barrinha de idiomas', JSON.stringify(adm));
  for (const h of ['#/inicio', '#/experimental', '#/matematica-olimpiada', '#/quimica-experimentos', '#/russo-leitura', '#/alemao', '#/sanscrito']) conf(!(await bloqueada(h)), `ADM: ${h} abre`);
  await ir('#/codigos'); conf((await p.evaluate(() => [...document.querySelectorAll('.cod-chip')].map((c) => c.textContent).join(','))).length > 0, 'página de códigos mostra o que está destravado', await p.evaluate(() => [...document.querySelectorAll('.cod-chip')].map((c) => c.textContent).join(',')));

  // β 4.3: ADM pula com Esc também; figura "buraco negro" e título dourado: ADM vê, mais ninguém
  await zera(); await digita('adm', COD.adm); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(600);
  conf(await p.evaluate(() => !document.querySelector('.anim-acesso') && location.hash === '#/home' && /\.ADM$/.test(document.querySelector('.jv-ver').textContent) && JARVIS.figuraCfg().id === 'buraconegro' && document.querySelector('.jv-ilu').style.visibility !== 'hidden'), 'ADM: Esc pula o buraco negro e já aplica o .ADM e a figura');
  await p.click('.jv-engrenagem'); await p.waitForTimeout(300);
  conf((await p.evaluate(() => [...document.querySelectorAll('.jv-painel-figbt')].map((b) => b.dataset.fig).join(','))) === 'planeta,galaxia,buraconegro', 'ADM: as 3 figuras no painel, com o buraco negro');
  await p.click('.jv-painel-figbt[data-fig=buraconegro]'); await p.waitForTimeout(200); await p.keyboard.press('Escape');
  await p.evaluate(() => { const b = document.querySelector('.jv-ouro-bt'); b && b.click(); }); await p.waitForTimeout(1500);
  conf(await p.evaluate(() => document.querySelector('.jv').classList.contains('dourado') && JSON.parse(localStorage.getItem('jarvis:cor')) === 'dourado' && document.querySelectorAll('.jv-ouro-p').length > 0), 'ADM: título dourado ligado, salvo e soltando símbolos');
  await p.waitForTimeout(3000); conf((await p.evaluate(() => document.querySelectorAll('.jv-ouro-p').length)) <= 7, 'título dourado discreto: no máximo 7 símbolos de cada vez', await p.evaluate(() => document.querySelectorAll('.jv-ouro-p').length));
  /* β 4.6: o buraco negro realista é só do título dourado; tirando o dourado, volta o de arame (com a animação de troca) */
  conf(await p.evaluate(() => document.querySelector('.jv-ilu svg.jv-bn').classList.contains('real')), 'com o dourado, o buraco negro é o realista (o da animação)');
  await p.evaluate(() => document.querySelector('.jv-cor button:not(.jv-ouro-bt)').click()); await p.waitForTimeout(400);
  conf(await p.evaluate(() => document.querySelector('.jv-ilu svg.jv-bn').classList.contains('trocando')), 'tirar o dourado: a troca é animada');
  await p.waitForTimeout(1300);
  conf(await p.evaluate(() => { const s = document.querySelector('.jv-ilu svg.jv-bn'); return !s.classList.contains('real') && !s.classList.contains('trocando') && getComputedStyle(s.querySelector('.bn-arame')).display !== 'none' && getComputedStyle(s.querySelector('.bn-real')).display === 'none'; }), 'sem o dourado: volta o buraco negro de arame');
  await p.evaluate(() => document.querySelector('.jv-excl-dourado').click()); await p.waitForTimeout(1500);
  conf(await p.evaluate(() => document.querySelector('.jv-ilu svg.jv-bn').classList.contains('real')), 'pôr o dourado de novo: volta o realista');
  conf(await p.evaluate(() => !!document.querySelector('.jv-excl-esmeralda') && !!document.querySelector('.jv-excl-dourado')), 'ADM: tem o dourado e também o esmeralda do tester');
  const TODOS_AVULSOS = ['fisica', 'matematica', 'quimica', 'idiomas', 'config', 'alemao', 'sanscrito', 'jarvis'];
  for (const ch of [['tester'], ['config'], TODOS_AVULSOS, TODOS_AVULSOS.concat('tester')]) {
    await p.evaluate((ch) => localStorage.setItem('jarvis:acesso', JSON.stringify({ chaves: ch })), ch); await p.reload(); await p.waitForTimeout(600); /* o que o ADM salvou continua no localStorage */
    const r = await p.evaluate(() => ({ dourado: document.querySelector('.jv').classList.contains('dourado'), bt: !!document.querySelector('.jv-excl-dourado'), part: document.querySelectorAll('.jv-ouro-p').length, fig: JARVIS.figuraCfg().id }));
    let figs = '(engrenagem trancada)'; if (await p.$('.jv-engrenagem:not(.trancado)')) { await p.click('.jv-engrenagem'); await p.waitForTimeout(250); figs = await p.evaluate(() => [...document.querySelectorAll('.jv-painel-figbt')].map((b) => b.dataset.fig).join(',')); await p.keyboard.press('Escape'); }
    const nome = ch.length > 2 ? (ch.includes('tester') ? 'todos os avulsos + tester' : 'todos os avulsos') : ch.join('+');
    conf(!r.dourado && !r.bt && !r.part && r.fig === 'planeta' && !/buraconegro/.test(figs), `${nome}: sem buraco negro (nem no painel) e sem título dourado`, `${JSON.stringify(r)} painel: ${figs}`);
    if (!ch.includes('tester')) { await p.evaluate(() => localStorage.setItem('jarvis:cor', JSON.stringify('esmeralda'))); await p.reload(); await p.waitForTimeout(500);
      conf(await p.evaluate(() => !document.querySelector('.jv').classList.contains('esmeralda') && !document.querySelector('.jv-excl-esmeralda')), `${nome}: sem o esmeralda (é do tester)`); await p.evaluate(() => localStorage.setItem('jarvis:cor', JSON.stringify('dourado'))); }
  }
  // 6. troca de idioma (como ADM)
  await ir('#/home');
  for (const [l, nome, rota, cor] of [['alemao', 'Alemão', '#/alemao', '--mDE'], ['sanscrito', 'Sânscrito', '#/sanscrito', '--mSA'], ['russo', 'Russo', '#/russo', '--mR']]) {
    await p.click(`.jv-linguas [data-lingua=${l}]`); await p.waitForTimeout(250);
    const r = await p.evaluate(() => { const c = document.querySelector('.jv-mat-idioma a'); return { nome: c.querySelector('.jv-nome').textContent, rota: c.getAttribute('href'), estilo: c.getAttribute('style') || '', salvo: JSON.parse(localStorage.getItem('jarvis:lingua')), apertado: (document.querySelector('.jv-linguas [aria-pressed=true]') || {}).dataset }; });
    conf(r.nome === nome && r.rota === rota && r.estilo.includes(cor) && r.salvo === l, `troca de idioma → ${nome} (nome, rota, cor ${cor}, salvo)`, JSON.stringify(r));
  }
  await p.click('.jv-linguas [data-lingua=alemao]'); await p.reload(); await p.waitForTimeout(500);
  conf((await p.evaluate(() => document.querySelector('.jv-mat-idioma .jv-nome').textContent)) === 'Alemão', 'o idioma escolhido continua depois de recarregar');
  await ir('#/alemao'); conf(await p.evaluate(() => document.querySelectorAll('.abas-materia .aba').length === 2 && !!document.querySelector('.jv-anim svg, .hero2 svg')), 'página do alemão: 2 abas e desenho');

  // 7. exportar leva jarvis:acesso e jarvis:lingua
  await ir('#/inicio', 700);
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#bt-exp')]);
  const js = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'));
  const tem = (k) => Object.keys(js).some((x) => x === k || x.endsWith(k)) || JSON.stringify(js).includes(k);
  conf(tem('jarvis:acesso') && tem('jarvis:lingua'), 'exportar leva jarvis:acesso e jarvis:lingua', Object.keys(js).filter((k) => /jarvis/.test(k)).join(','));

  // 8. voltar a visitante
  await ir('#/codigos'); await p.click('[data-a=zerar]'); await p.waitForTimeout(300);
  conf((await chaves()) === '' && /visitante/.test(await p.evaluate(() => document.querySelector('.cod-chips').textContent)), '"Voltar a visitante" apaga o acesso');
  await ir('#/home'); conf((await p.evaluate(() => document.querySelectorAll('.jv-materias a.sem-acesso').length)) === 4 && !/\.ADM/.test(await versao()), 'de volta a visitante: tudo trancado e versão sem sufixo', await versao());

  // 9. movimento reduzido: as animações pulam na hora
  const ctx2 = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }); const q = await ctx2.newPage();
  await q.goto(base + '#/codigos'); await q.waitForTimeout(400); await q.fill('.cod-linha[data-linha=tester] input', COD.tester); await q.press('.cod-linha[data-linha=tester] input', 'Enter'); await q.waitForTimeout(600);
  conf(await q.evaluate(() => !document.querySelector('.anim-acesso') && /\.tester/.test(document.querySelector('.jv-ver').textContent)), 'movimento reduzido: sem animação, acesso aplicado');

  conf(!erros.length, 'sem erros JS', erros.join(' | '));
  console.log(`\nFALHAS (${falhas.length}):\n  ` + falhas.join('\n  '));
  if (falhas.length) process.exitCode = 1;
  await b.close();
})();
