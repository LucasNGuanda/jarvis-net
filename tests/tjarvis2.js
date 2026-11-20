// Jarvis (β 11.5): limpar o histórico de perguntas sem tocar em mais nada; elementos e moléculas na busca; acesso.
// Uso: node tests/tjarvis2.js
const { chromium } = require('playwright'); const path = require('path');
const base = 'file://' + path.resolve(__dirname, '..', 'index.html');
const falhas = []; const conf = (ok, txt, extra) => { console.log((ok ? 'ok     ' : 'FALHA  ') + txt + (extra !== undefined ? ' → ' + extra : '')); if (!ok) falhas.push(txt); };
(async () => { const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }), p = await ctx.newPage(); const erros = []; p.on('pageerror', (e) => erros.push(e.message));
  /* dados de mentira em TODOS os prefixos, para provar que só o histórico é apagado */
  const SEMENTE = { 'jarvis:acesso': JSON.stringify({ chaves: ['adm'] }), 'jarvis:buscas': JSON.stringify(['leis de newton', 'pendulo', 'h2o']), 'jarvis:adesivos': JSON.stringify([{ id: 'atomo', x: 0.2, y: 0.3 }]), 'jarvis:figura': JSON.stringify({ id: 'planeta' }), 'jarvis:cor': 'arcoiris', 'jarvis:lingua': 'russo',
    'fisica:feito:A01': '1', 'fisica:tema': 'escuro', 'fisica:ex:A01:3': JSON.stringify({ ok: true }), 'mat:feito:PL02': '1', 'qui:feito:A01': '1', 'rus:voz': JSON.stringify({ v: 0.85 }), 'rus:feito:RG01': '1', 'outra:coisa': 'x' };
  const poe = async (rota) => { await p.goto(base + '#/home'); await p.evaluate((S) => { localStorage.clear(); for (const k in S) localStorage.setItem(k, S[k]); }, SEMENTE); await p.goto(base + rota); await p.reload(); await p.waitForTimeout(600); };
  const tudo = () => p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; });
  const semHist = (o) => { const c = { ...o }; delete c['jarvis:buscas']; return JSON.stringify(Object.keys(c).sort().map((k) => [k, c[k]])); };
  const painel = () => p.evaluate(() => { const pn = document.querySelector('.jb-painel'); return { visivel: !!pn && !pn.hidden, itens: [...document.querySelectorAll('.jb-painel .jb-hist')].map((x) => x.textContent), limpa: !!document.querySelector('.jb-painel .jb-limpa'), xs: document.querySelectorAll('.jb-painel .jb-hx').length, texto: pn ? pn.textContent : '' }; });

  // 1. tela inicial: o histórico aparece com o botão e um X por item
  await poe('#/home'); const antes = await tudo(); await p.click('.jv-pergunta input'); await p.waitForTimeout(200); let t = await painel();
  conf(t.visivel && t.itens.length === 3 && t.limpa && t.xs === 3, 'o histórico aparece com "Limpar histórico" e um X em cada pergunta', JSON.stringify(t.itens));
  // 2. X apaga uma só, na hora
  await p.click('.jb-painel .jb-hx >> nth=1'); await p.waitForTimeout(150); t = await painel(); let d = await tudo();
  conf(t.itens.join('|') === 'leis de newton|h2o' && d['jarvis:buscas'] === JSON.stringify(['leis de newton', 'h2o']), 'o X apaga só aquela pergunta, e ela some da tela sem recarregar', t.itens.join('|'));
  conf(semHist(d) === semHist(antes), 'apagar uma pergunta não muda nenhuma outra chave do navegador');
  // 3. Limpar histórico pede confirmação; Cancelar não apaga
  await p.click('.jb-painel .jb-limpa'); await p.waitForTimeout(150); t = await painel();
  conf(t.texto.includes('Apagar todas as perguntas do Jarvis? Isso não apaga seu progresso.') && (await tudo())['jarvis:buscas'] === d['jarvis:buscas'], 'o botão pede confirmação com o texto combinado, e ainda não apagou nada');
  await p.click('.jb-painel .jb-nao'); await p.waitForTimeout(150); t = await painel();
  conf(t.itens.length === 2 && (await tudo())['jarvis:buscas'] === d['jarvis:buscas'], 'Cancelar volta ao histórico sem apagar');
  // 4. Apagar: só a chave do histórico some; o resto fica idêntico; a tela muda na hora
  await p.click('.jb-painel .jb-limpa'); await p.waitForTimeout(100); await p.click('.jb-painel .jb-sim'); await p.waitForTimeout(150); t = await painel(); d = await tudo();
  conf(!('jarvis:buscas' in d), 'Apagar remove a chave jarvis:buscas');
  conf(semHist(d) === semHist(antes) && Object.keys(d).length === Object.keys(antes).length - 1, 'progresso, adesivos, acesso, figura, cor, idioma e configurações ficam IDÊNTICOS (as outras ' + (Object.keys(antes).length - 1) + ' chaves, byte a byte)');
  conf(t.visivel && t.itens.length === 0 && !t.limpa && /digite um tema/.test(t.texto), 'o histórico some da tela na hora, sem recarregar');
  await p.reload(); await p.waitForTimeout(500); await p.click('.jv-pergunta input'); await p.waitForTimeout(200); t = await painel(); conf(t.itens.length === 0 && semHist(await tudo()) === semHist(antes), 'depois de recarregar continua vazio, e o resto continua igual');
  // 5. o mesmo no Ctrl K, dentro de um tema
  await poe('#/A01'); const antesA = await tudo(); /* abrir um tema já grava "último tema": a comparação parte daqui */ await p.keyboard.press('Control+k'); await p.waitForTimeout(300); t = await painel(); conf(t.itens.length === 3 && t.limpa, 'no Ctrl K (dentro de um tema) o histórico também tem o botão');
  await p.click('.jb-modal .jb-limpa'); await p.click('.jb-modal .jb-sim'); await p.waitForTimeout(150); d = await tudo(); conf(!('jarvis:buscas' in d) && semHist(d) === semHist(antesA), 'no Ctrl K: apaga só o histórico');
  // 6. provar que o teste acusa: uma limpeza que apagasse o progresso seria pega
  const errado = { ...antes }; delete errado['jarvis:buscas']; delete errado['fisica:feito:A01']; conf(semHist(errado) !== semHist(antes), 'contraprova: se uma chave de progresso sumisse, a comparação acusaria');

  // 7. elemento: "sodio" → ficha do sódio na tabela periódica
  await poe('#/home'); await p.evaluate(() => JARVIS.carregaIndice()); await p.fill('.jv-pergunta input', 'sodio'); await p.press('.jv-pergunta input', 'Enter'); await p.waitForTimeout(400);
  const el = await p.evaluate(() => { const a = document.querySelector('.jb-painel .jb-item'); return a && { el: a.dataset.el, txt: a.textContent }; }); conf(el && el.el === '11' && /Sódio|sódio/.test(el.txt), '"sodio" → primeiro resultado é o elemento sódio (Z = 11)', el && el.txt.slice(0, 60));
  await p.click('.jb-painel .jb-item'); await p.waitForTimeout(700); const tp = await p.evaluate(() => ({ aberta: !!document.querySelector('.tp-aberta'), sel: TABELA._.estado().sel, modo: TABELA._.estado().modo, hash: location.hash })); conf(tp.aberta && tp.sel === 11 && tp.modo === 'ficha' && tp.hash === '#/home', 'clicar abre a tabela periódica na ficha do sódio, sem sair da página', JSON.stringify(tp));
  // 8. molécula: "h2o" → visualizador com a água aberta
  await poe('#/home'); await p.evaluate(() => JARVIS.carregaIndice()); await p.fill('.jv-pergunta input', 'h2o'); await p.press('.jv-pergunta input', 'Enter'); await p.waitForTimeout(400);
  const ml = await p.evaluate(() => { const a = document.querySelector('.jb-painel .jb-item'); return a && { mol: a.dataset.mol, txt: a.textContent }; }); conf(ml && ml.mol === 'h2o', '"h2o" → primeiro resultado é a molécula da água', ml && ml.txt.slice(0, 60));
  await p.click('.jb-painel .jb-item'); await p.waitForTimeout(3500); const mv = await p.evaluate(() => ({ hash: location.hash, abertos: SIM.qMoleculas && SIM.qMoleculas._ult ? SIM.qMoleculas._ult.estado().abertos : null })); conf(/MV01/.test(mv.hash) && mv.abertos && mv.abertos.join() === 'h2o', 'clicar leva ao visualizador e abre a água', JSON.stringify(mv));
  // 9. acesso: quem não tem a Química não vê elemento nem molécula
  for (const ch of [['fisica', 'jarvis'], ['tester', 'jarvis']]) { await p.goto(base + '#/home'); await p.evaluate((ch) => { localStorage.clear(); localStorage.setItem('jarvis:acesso', JSON.stringify({ chaves: ch })); }, ch); await p.reload(); await p.waitForTimeout(500);
    const r = await p.evaluate(async () => { await JARVIS.carregaIndice(); JARVIS._busca.un = null; return ['sodio', 'h2o', 'oxigenio'].map((q) => JARVIS.buscar(q).livres.map((x) => x.u.tipo + ':' + x.u.mat)); }); conf(r.every((l) => l.every((x) => !/^(elemento|molecula)/.test(x) && /:fisica$/.test(x))), `${ch[0]}: elemento e molécula não aparecem para quem não tem a Química`, JSON.stringify(r.map((l) => l.slice(0, 2)))); }
  // 10. distância de edição e tolerância
  const lv = await p.evaluate(() => ({ a: JARVIS._lev('eletromagnetimso', 'eletromagnetismo', 3), b: JARVIS._lev('pendlo', 'pendulo', 2), c: JARVIS._lev('gato', 'rato', 2), d: JARVIS._lev('abc', 'xyz', 2), t: [3, 4, 6, 7, 10, 11, 16].map(JARVIS._tolera).join(',') })); conf(lv.a === 1 && lv.b === 1 && lv.c === 1 && lv.d === 3 && lv.t === '0,1,1,2,2,3,3', 'distância de edição: letras vizinhas trocadas contam 1; tolerância cresce com o tamanho (0 até 3 letras, 1 até 6, 2 até 10, 3 acima)', JSON.stringify(lv));
  conf(!erros.length, 'nenhum erro de JavaScript', erros.slice(0, 3).join(' | '));
  console.log(falhas.length ? `\nFALHAS (${falhas.length}):\n  ` + falhas.join('\n  ') : '\nFALHAS (0):'); await b.close(); process.exit(falhas.length ? 1 : 0); })();
