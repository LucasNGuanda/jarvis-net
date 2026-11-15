// β 4.2 — busca do Jarvis (sem IA): índice gerado e atualizado, buscas por nome, fórmula, cientista, código, erro de digitação,
// sinônimo, navegação, dúvida (personagem), "não achei", histórico, Ctrl K, e o ACESSO em cada nível (nada trancado vaza).
// Uso: node tests/tbusca.js
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const RAIZ = path.resolve(__dirname, '..'), base = 'file://' + path.join(RAIZ, 'index.html');
const falhas = []; const conf = (ok, txt, extra) => { console.log((ok ? 'ok     ' : 'FALHA  ') + txt + (extra !== undefined ? ' → ' + extra : '')); if (!ok) falhas.push(txt); };
(async () => {
  // 0. índice gerado, completo e em dia com os arquivos dos temas
  const { impressao } = require('../tools/gera-indice.js');
  global.window = {}; require('../assets/indice-busca.js'); const IDX = global.window.INDICE_BUSCA.temas; delete global.window;
  const velhos = Object.entries(IDX).filter(([k, t]) => { const arq = k.includes('/') ? `temas/${k}.js` : `temas/${k}.js`; return !fs.existsSync(path.join(RAIZ, arq)) || impressao(arq) !== t.h; }).map(([k]) => k);
  conf(!velhos.length, 'índice da busca em dia com os temas (senão: node tools/gera-indice.js)', velhos.slice(0, 8).join(','));
  for (const f of ['assets/jarvis-busca.js', 'assets/jarvis-config.js']) { const s = fs.readFileSync(path.join(RAIZ, f), 'utf8'); conf(!/\bfetch\s*\(|XMLHttpRequest|api[_-]?key|anthropic|openai|Authorization/i.test(s), `${f}: nenhuma chamada de API nem lugar esperando chave`); }

  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p = await ctx.newPage();
  const erros = []; p.on('pageerror', (e) => erros.push(e.message));
  const nivel = async (ch) => { await p.goto(base + '#/home'); await p.evaluate((ch) => { Object.keys(localStorage).forEach((k) => localStorage.removeItem(k)); if (ch) localStorage.setItem('jarvis:acesso', JSON.stringify({ chaves: ch })); }, ch); await p.reload(); await p.waitForTimeout(500); await p.evaluate(() => JARVIS.carregaIndice && JARVIS.carregaIndice()); };
  const R = (q) => p.evaluate((q) => { const r = JARVIS.responder(q), d = (x) => x && (x.u || x); return { tipo: r.tipo, nav: r.nav && r.nav.id, frase: r.frase, alvo: r.alvo && { chave: d(r.alvo).chave, href: d(r.alvo).href }, chaves: (r.livres || r.perto || []).map((x) => x.u.chave || x.u.tipo + ':' + x.u.titulo), perto: (r.perto || []).map((x) => x.u.tipo), mats: (r.livres || r.perto || []).map((x) => x.u.mat) }; }, q);
  const tela = async (q, enter = true) => { const inp = (await p.$('.jb-modal input')) ? '.jb-modal input' : '.jv-pergunta input'; await p.fill(inp, q); if (enter) await p.press(inp, 'Enter'); else await p.dispatchEvent(inp, 'input'); await p.waitForTimeout(enter ? 350 : 400); return p.evaluate(() => { const pn = document.querySelector('.jb-painel'); return pn && !pn.hidden ? { html: pn.innerHTML, texto: pn.textContent, itens: pn.querySelectorAll('.jb-item').length } : { html: '', texto: '', itens: 0 }; }); };

  // 1. ADM: buscas de todo tipo
  await nivel(['adm']);
  let r = await R('leis de newton'); conf(r.chaves[0] === 'A08', 'nome de tema: "leis de newton" → A08', r.chaves.slice(0, 3));
  r = await R('regra da cadeia'); conf(r.chaves[0] === 'matematica/CI04', 'nome de tema: "regra da cadeia" → CI04 (Matemática)', r.chaves.slice(0, 3));
  r = await R('onde fica Bernoulli?'); conf(r.tipo === 'lista' && r.chaves.slice(0, 2).includes('N03') && r.chaves.slice(0, 2).includes('A18'), '"onde fica Bernoulli?" → N03 e A18', r.chaves.slice(0, 3));
  r = await R('bernouli'); conf(r.chaves.slice(0, 2).includes('N03'), 'erro de digitação: "bernouli" acha Bernoulli', r.chaves.slice(0, 3));
  r = await R('pV = nRT'); conf(r.chaves[0] === 'T05', 'fórmula: "pV = nRT" → T05 (Gases)', r.chaves.slice(0, 3));
  r = await R('Einstein'); conf(r.chaves.slice(0, 3).some((k) => /^C1[67]/.test(k)), 'cientista: "Einstein" → C16/C17 nos 3 primeiros', r.chaves.slice(0, 3));
  r = await R('Arquimedes'); conf(r.chaves[0] === 'A17', 'cientista: "Arquimedes" → A17 (Hidrostática)', r.chaves.slice(0, 3));
  r = await R('o que explica meia-vida'); conf(r.tipo === 'lista' && r.chaves[0] === 'quimica/EQ13', '"o que explica meia-vida" é busca (não dúvida) → EQ13', r.chaves.slice(0, 2));
  r = await R('experimento de pêndulo'); conf(r.chaves[0] === 'EP01', '"experimento de pêndulo" → EP01', r.chaves.slice(0, 3));
  r = await R('mol'); conf(r.chaves[0] === 'quimica/D04', 'sinônimo/termo curto: "mol" → D04 (Mol, massa molar)', r.chaves.slice(0, 3));
  r = await R('queda livre'); conf(r.chaves.slice(0, 3).some((k) => /^A0[36]/.test(k)), 'sinônimo: "queda livre" → MRUV/Lançamentos', r.chaves.slice(0, 3));
  r = await R('A08'); conf(r.tipo === 'codigo' && r.alvo.href === '#/A08', 'código: "A08" na tela inicial leva ao A08 da Física', JSON.stringify(r.alvo));
  r = await R('ci07'); conf(r.tipo === 'codigo' && r.alvo.href === '#/matematica/CI07', 'código: "ci07" → #/matematica/CI07', JSON.stringify(r.alvo));
  r = await R('EP17'); conf(r.tipo === 'codigo' && r.alvo.href === '#/EP17', 'código: "EP17" → #/EP17');
  r = await R('ZZ99'); conf(r.tipo === 'nada', 'código que não existe: não inventa', r.tipo);
  r = await R('xyzzy blorft'); conf(r.tipo === 'nada' && !r.chaves.length, 'nada parecido: diz que não achou, sem inventar', r.tipo);
  r = await R('teorema de pitagoras'); conf(r.tipo === 'nada', 'tema que não existe no site ("teorema de pitagoras"): "não achei"', r.tipo + ' ' + r.chaves.slice(0, 3));
  r = await R('onde fica a legenda?'); conf(r.tipo === 'navegacao' && r.nav === 'legenda', 'navegação: "onde fica a legenda?"', r.nav);
  r = await R('onde exporto meu progresso?'); conf(r.tipo === 'navegacao' && r.nav === 'exportar', 'navegação: "onde exporto meu progresso?"', r.nav);
  r = await R('qual a fórmula de Bernoulli?'); conf(r.tipo === 'duvida' && ['N03', 'A18'].includes(r.alvo.chave) && r.perto.length === 3 && r.perto.every((t) => t === 'tema'), 'dúvida: "qual a fórmula de Bernoulli?" → personagem + link + 3 temas', JSON.stringify(r.alvo) + ' ' + r.perto);
  r = await R('como resolve essa integral?'); conf(r.tipo === 'duvida' && /CI0[689]|F04|CII0/.test(r.alvo.chave), 'dúvida: "como resolve essa integral?" → tema de integral', r.alvo && r.alvo.chave);
  const fr = await p.evaluate(() => { const s = new Set(); for (let i = 0; i < 400; i++) s.add(JARVIS.responder('qual a formula de Bernoulli?').frase); return { n: s.size, cfg: JARVIS_CFG.frases.length, distintas: new Set(JARVIS_CFG.frases).size }; });
  conf(fr.cfg === 13 && fr.distintas === 13 && fr.n === 13, '12+1 frases diferentes, todas sorteadas', JSON.stringify(fr));

  // 2. a tela: sugestão enquanto digita, trechinho com a palavra marcada, link com âncora, dúvida, histórico
  let t = await tela('bernoul', false); conf(t.itens >= 3 && /<mark>/.test(t.html), 'sugere enquanto digita, com o trechinho marcado', t.itens);
  conf(/href="#\/A18\/bernoulli"/.test(t.html), 'o resultado leva direto à seção (#/A18/bernoulli)');
  t = await tela('qual a fórmula de Bernoulli?'); const frs = await p.evaluate(() => JARVIS_CFG.frases.map((f) => f.split('{lugar}')[0].trim()));
  conf(frs.some((f) => t.texto.includes(f)) && /class="jb-lugar"/.test(t.html) && t.itens === 3, 'dúvida na tela: frase do personagem + link do tema + 3 temas embaixo', t.itens);
  t = await tela('pV = nRT'); conf(/katex/.test(t.html), 'fórmula achada aparece desenhada (KaTeX)');
  await p.fill('.jv-pergunta input', ''); await p.click('body', { position: { x: 5, y: 5 } }); await p.click('.jv-pergunta input'); await p.waitForTimeout(250);
  t = await p.evaluate(() => [...document.querySelectorAll('.jb-hist')].map((x) => x.textContent));
  conf(t[0] === 'pV = nRT' && t.includes('qual a fórmula de Bernoulli?'), 'histórico das últimas buscas (campo vazio)', t.slice(0, 3).join(' | '));
  conf(await p.evaluate(() => JSON.parse(localStorage.getItem('jarvis:buscas')).length >= 2), 'histórico salvo em jarvis:buscas (entra no exportar)');
  await tela('A08'); await p.waitForTimeout(500); conf((await p.evaluate(() => location.hash)) === '#/A08', 'Enter num código leva ao tema', await p.evaluate(() => location.hash));
  // atalho em outra página
  await p.keyboard.press('Control+k'); await p.waitForTimeout(250); conf(!!(await p.$('.jb-modal input')), 'Ctrl K abre a busca numa página de tema');
  t = await tela('regra da cadeia', false); conf(t.itens > 0, 'busca funciona na janelinha do Ctrl K', t.itens);
  await p.keyboard.press('ArrowDown'); await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  conf((await p.evaluate(() => location.hash)) === '#/matematica/CI04' && !(await p.$('.jb-modal')), 'setas + Enter abrem o resultado e fecham a janelinha', await p.evaluate(() => location.hash));
  await p.keyboard.press('Control+k'); await p.waitForTimeout(200); await p.keyboard.press('Escape'); await p.waitForTimeout(200); conf(!(await p.$('.jb-modal')), 'Esc fecha');
  await p.keyboard.press('Control+k'); await p.waitForTimeout(200); await tela('onde fica a legenda?'); await p.waitForTimeout(600);
  conf(await p.evaluate(() => !!document.querySelector('#detalhes.aberto') && /legenda/i.test((document.querySelector('.jb-toast') || {}).textContent || '')), 'navegação leva ao lugar e responde (legenda aberta + aviso)', await p.evaluate(() => location.hash));
  await p.keyboard.press('Control+k'); await p.waitForTimeout(200); await tela('onde exporto meu progresso?'); await p.waitForTimeout(700);
  conf(await p.evaluate(() => !!document.querySelector('#bt-exp.jb-pisca')), 'navegação: exportar → menu lateral, com o botão piscando');

  // 3. acesso: tester só acha Física
  await nivel(['tester', 'jarvis']);
  for (const q of ['regra da cadeia', 'Bernoulli', 'mol', 'Einstein', 'lei de faraday']) { r = await R(q); conf(r.mats.every((m) => m === 'fisica'), `tester: "${q}" só traz Física`, [...new Set(r.mats)].join(',') || r.tipo); }
  r = await R('CI07'); conf(r.tipo === 'trancado', 'tester: "CI07" (Matemática) → "existe, mas você ainda não tem acesso"', r.tipo);
  r = await R('derivada de x²'); conf(!r.chaves.some((k) => k.startsWith('matematica/')), 'tester: dúvida não aponta para a Matemática', r.alvo && r.alvo.chave);
  // visitante com o código do Jarvis: nada liberado → só a resposta de trancado
  await nivel(['jarvis']);
  for (const q of ['Bernoulli', 'A08', 'regra da cadeia', 'qual a fórmula de Bernoulli?', 'leis de newton', 'bernoul']) {
    t = await tela(q, !q.startsWith('bernoul')); conf(t.itens === 0 && /existe, mas você ainda não tem acesso/.test(t.texto) && !/Bernoulli|Newton|A08|Hidrodin|cadeia/i.test(t.texto.replace(q, '')), `visitante+Jarvis: "${q}" → só "existe, mas…", sem nome nem código`, t.texto.slice(0, 80)); }
  t = await tela('xyzzy'); conf(/Não achei/.test(t.texto), 'visitante+Jarvis: o que não existe → "não achei"');
  r = await R('onde fica a legenda?'); conf(r.tipo === 'navegacao', 'visitante+Jarvis: navegação continua respondendo');
  t = await tela('onde exporto meu progresso?'); conf(/não tem acesso a nenhuma matéria/.test(t.texto), 'visitante+Jarvis: exportar → explica que ainda não há matéria liberada', t.texto.slice(0, 120));
  // química: A08 vai para o da Química
  await nivel(['quimica', 'jarvis']); r = await R('A08'); conf(r.tipo === 'codigo' && r.alvo.href === '#/quimica/A08', 'só Química: "A08" → o A08 da Química', JSON.stringify(r.alvo));
  r = await R('Bernoulli'); conf(r.tipo === 'trancado', 'só Química: "Bernoulli" (Física) → trancado', r.tipo);
  await tela('onde fica a legenda?'); await p.waitForTimeout(700);
  conf(await p.evaluate(() => location.hash === '#/quimica' && !!document.querySelector('#detalhes.aberto') && !document.querySelector('.jv-bloq')), 'só Química: a legenda abre na Química (não numa página trancada)', await p.evaluate(() => location.hash));
  // sem o código do Jarvis
  await nivel(['fisica']);
  conf(await p.evaluate(() => document.querySelector('.jv-pergunta input').disabled), 'sem o código: campo desativado');
  await p.goto(base + '#/A08'); await p.waitForTimeout(800); await p.keyboard.press('Control+k'); await p.waitForTimeout(250);
  conf(!(await p.$('.jb-modal')), 'sem o código: Ctrl K não abre nada');

  conf(!erros.length, 'sem erros JS', erros.join(' | '));
  console.log(`\nFALHAS (${falhas.length}):\n  ` + falhas.join('\n  '));
  if (falhas.length) process.exitCode = 1;
  await b.close();
})();
