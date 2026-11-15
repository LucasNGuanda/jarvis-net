const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
const { chromium } = require('playwright');
const res = []; const ok = (c, m) => res.push([c, m]);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('requestfailed', r => errs.push('falhou ' + r.url()));
  const base = RAIZ;
  // 1. sem hash abre a tela inicial
  await p.goto(base); await p.waitForTimeout(1200);
  let s = await p.evaluate(() => ({ home: !!document.querySelector('.jv'), modo: document.body.classList.contains('modo-home'), topo: getComputedStyle(document.querySelector('.topo')).display, menu: getComputedStyle(document.querySelector('.menu')).display, titulo: document.querySelector('.jv-cab h1').textContent, mats: [...document.querySelectorAll('.jv-mat')].map(m => [m.dataset.materia, m.tagName, m.classList.contains('desativada'), m.textContent.includes('em breve')]) }));
  ok(s.home && s.modo && s.topo === 'none' && s.menu === 'none', 'sem hash: abre a tela inicial, sem a faixa e o menu da física → ' + JSON.stringify([s.home, s.modo, s.topo, s.menu]));
  ok(/^Jarvisβ \d+\.\d+$/.test(s.titulo), 'título do projeto, com a versão ao lado (desde a β 3.4) → ' + s.titulo);
  ok(JSON.stringify(s.mats) === JSON.stringify([['fisica', 'A', false, false], ['quimica', 'A', false, false], ['matematica', 'A', false, false], ['russo', 'DIV', true, true]]), 'Física, Química e Matemática são links (β 3.7); Russo desativado com "em breve" → ' + JSON.stringify(s.mats));
  const perg = await p.evaluate(() => { const f = document.querySelector('.jv-pergunta'); return [f.querySelector('input').disabled, f.querySelector('button').disabled, f.textContent.includes('em breve')]; });
  ok(perg.every(Boolean), 'campo de pergunta desativado com "em breve" → ' + perg);
  await p.screenshot({ path: 'home-escuro.png' });
  // 2. clicar numa desativada não muda nada
  await p.click('.jv-mat[data-materia="russo"]', { force: true }); await p.waitForTimeout(300);
  ok(/index\.html$|#\/home$/.test(p.url()) || !p.url().includes('#/r'), 'clicar em Russo não navega → ' + p.url().split('/').pop());
  // 3. Física leva para o site de física igual
  await p.click('.jv-mat[data-materia="fisica"]'); await p.waitForTimeout(1200);
  s = await p.evaluate(() => ({ hash: location.hash, modo: document.body.classList.contains('modo-home'), topo: getComputedStyle(document.querySelector('.topo')).display, titulo: document.querySelector('#pagina h1') && document.querySelector('#pagina h1').textContent, abaAtual: document.querySelector('.topo .aba.atual') && document.querySelector('.topo .aba.atual').dataset.area }));
  ok(s.hash === '#/inicio' && !s.modo && s.topo !== 'none' && /Física/.test(s.titulo) && s.abaAtual === 'fisica', 'Física → #/inicio, com faixa e menu da física → ' + JSON.stringify(s));
  // 4. botão Home na faixa, ao lado do átomo
  const ordem = await p.evaluate(() => [...document.querySelectorAll('.topo nav.abas .aba')].map(a => a.getAttribute('href')));
  ok(ordem[0] === '#/home' && ordem[1] === '#/inicio' && ordem.length === 5, 'faixa: Home antes do átomo da Física, resto igual → ' + ordem);
  await p.screenshot({ path: 'fisica-com-home.png' });
  await p.click('.topo .aba-home'); await p.waitForTimeout(800);
  ok(await p.evaluate(() => location.hash === '#/home' && !!document.querySelector('.jv')), 'botão Home volta para a tela inicial');
  // 5. tema da física e progresso no mesmo localStorage
  await p.goto(base + '#/C01'); await p.waitForTimeout(1500);
  ok(await p.evaluate(() => !!document.querySelector('.ex') && !document.body.classList.contains('modo-home')), 'tema C01 continua abrindo normal');
  await p.evaluate(() => document.querySelector('.ex .certeza button').click());
  await p.goto(base + '#/home'); await p.waitForTimeout(800); await p.goto(base + '#/C01'); await p.waitForTimeout(1500);
  ok(await p.evaluate(() => !!localStorage.getItem('fisica:marca:C01-1') && document.querySelector('.ex .certeza button[aria-pressed="true"]') !== null), 'marcação no C01 sobrevive à ida e volta pela tela inicial (mesmo localStorage)');
  // 6. matéria registrada que não existe: página "em breve", nunca em branco
  await p.goto(base + '#/russo/inicio'); await p.waitForTimeout(800);
  s = await p.evaluate(() => ({ txt: document.querySelector('#pagina').textContent, modo: document.body.classList.contains('modo-home') }));
  ok(/Russo/.test(s.txt) && /em breve/.test(s.txt) && s.modo, '#/russo/inicio mostra "Russo · em breve" → ' + s.txt.trim().slice(0, 40));
  await p.goto(base + '#/fisica'); await p.waitForTimeout(900);
  ok(await p.evaluate(() => location.hash === '#/inicio'), '#/fisica redireciona para #/inicio');
  // 7. registrar uma matéria nova só pela configuração
  await p.goto(base + '#/home'); await p.waitForTimeout(600);
  const nova = await p.evaluate(() => { MATERIAS.push({ id: 'biologia', nome: 'Biologia', desc: 'teste', rota: '#/biologia/inicio', cor: '--mX', icone: 'frasco', pronta: false, prefixo: 'biologia' }); JARVIS.home(document.getElementById('pagina')); const n = document.querySelectorAll('.jv-mat').length; MATERIAS.pop(); return n; });
  ok(nova === 5, 'acrescentar uma matéria em MATERIAS faz o botão aparecer, sem mexer nas rotas → ' + nova);
  // 8. tema claro
  await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'light')); await p.goto(base + '#/home'); await p.waitForTimeout(600);
  await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'light')); await p.screenshot({ path: 'home-claro.png' });
  console.log(res.filter(r => r[0]).length + ' de ' + res.length + ' ok'); process.exitCode = res.every((r) => r[0]) ? 0 : 1; /* β 3.7: falha vira código de erro */ res.forEach(r => console.log((r[0] ? 'ok     ' : 'FALHA  ') + r[1]));
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros JS');
  await b.close(); })();
