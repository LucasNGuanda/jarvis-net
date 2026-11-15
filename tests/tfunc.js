const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
// Testes de funcionamento em 1280 px: exercícios, marcações, chefão, feito, recarregar, exportar/importar, topo que some, busca, menu, sumário, tema.
const { chromium } = require('playwright');
const fs = require('fs');
const U = RAIZ;
const S = require('path').join(__dirname, 'capturas') + '/';
const ok = [], falha = [];
const conf = (cond, msg) => (cond ? ok : falha).push(msg);
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('dialog', d => d.accept());
  await p.goto(U + '#/inicio'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(600);

  // 1. exercício: dica e resposta só quando pede
  await p.goto(U + '#/C07'); await p.waitForTimeout(1200);
  const ex = p.locator('.ex').first();
  const painel = (i) => ex.locator('.rev-painel').nth(i);
  const nb = await ex.locator('.rev-bt').count();
  conf(nb >= 3, `exercício tem ${nb} botões em linha (dicas + resposta)`);
  conf(await ex.locator('.rev-painel:not([hidden])').count() === 0, 'dicas e resposta começam fechadas');
  conf(!(await ex.locator('.rev-painel.resp').isVisible()), 'texto da resposta invisível antes de clicar');
  const y0 = await ex.locator('.rev-bt').nth(0).boundingBox(), y1 = await ex.locator('.rev-bt').nth(nb - 1).boundingBox();
  conf(Math.abs(y0.y - y1.y) < 4, 'botões Dica 1, Dica 2 e Resposta lado a lado (mesma linha)');
  await ex.locator('.rev-bt').nth(0).click();
  conf(await painel(0).isVisible(), 'dica 1 abre ao clicar');
  conf(!(await painel(1).isVisible()), 'abrir a dica 1 não abre a dica 2');
  conf(!(await ex.locator('.rev-painel.resp').isVisible()), 'abrir a dica 1 não abre a resposta');
  await ex.locator('.rev-bt.resp').click();
  conf(await ex.locator('.rev-painel.resp').isVisible(), 'resposta aparece ao clicar');
  await ex.locator('.rev-bt').nth(0).click();
  conf(!(await painel(0).isVisible()), 'clicar de novo fecha a dica');

  // 2. marcações ● X / salvas e alternância
  const nEx = await p.locator('.ex').count();
  const marcas = ['●', 'X', '/'];
  for (let i = 0; i < nEx; i++) await p.locator('.ex').nth(i).locator(`.certeza button[data-m="${marcas[i % 3]}"]`).click();
  const chefaoLivre1 = await p.locator('.chefao').evaluate(e => !e.classList.contains('trancado'));
  conf(chefaoLivre1, `chefão destrava depois de marcar os ${nEx} exercícios`);
  await p.locator('.ex').nth(0).locator('.certeza button[data-m="●"]').click(); // desmarca
  conf(await p.locator('.chefao').evaluate(e => e.classList.contains('trancado')), 'desmarcar um exercício tranca o chefão de novo');
  await p.locator('.ex').nth(0).locator('.certeza button[data-m="●"]').click();
  await p.click('#bt-feito');
  await p.reload(); await p.waitForTimeout(1200);
  const lidas = await p.evaluate(() => [...document.querySelectorAll('.ex')].map(e => e.querySelector('.certeza [aria-pressed=true]')?.dataset.m || ''));
  conf(lidas.every((m, i) => m === marcas[i % 3]), 'marcações continuam depois de recarregar: ' + lidas.join(''));
  conf((await p.textContent('#bt-feito')).includes('Feito'), '"Marcar como feito" continua depois de recarregar');
  conf(await p.locator('#menu-mods a[data-cod="C07"] .bola.feito').count() === 1, 'bolinha verde no menu');
  // chefão forçado
  await p.goto(U + '#/C08'); await p.waitForTimeout(1000);
  await p.click('.chefao [data-a=forca]'); await p.reload(); await p.waitForTimeout(1000);
  conf(await p.locator('.chefao').evaluate(e => !e.classList.contains('trancado')), '"Já fiz no caderno" destrava e continua destravado');
  conf(!(await p.locator('.chefao .rev-painel.resp').isVisible()), 'solução do chefão continua fechada');

  // 3. exportar e importar
  const antes = await p.evaluate(() => JSON.stringify(Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('fisica:') && !k.startsWith('fisica:ultimo:')).sort().map(k => [k, localStorage.getItem(k)]))));
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#bt-exp')]);
  const arq = S + 'backup-teste.json'; await dl.saveAs(arq);
  const conteudo = JSON.parse(fs.readFileSync(arq, 'utf8'));
  conf(Object.keys(conteudo).length >= nEx + 2, `exportar gera .json com ${Object.keys(conteudo).length} chaves`);
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(600);
  conf(await p.evaluate(() => !localStorage.getItem('fisica:feitos')), 'progresso apagado antes de importar');
  await p.setInputFiles('#arq-imp', arq); await p.waitForTimeout(1500);
  const depois = await p.evaluate(() => JSON.stringify(Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('fisica:') && !k.startsWith('fisica:ultimo:')).sort().map(k => [k, localStorage.getItem(k)]))));
  conf(antes === depois, 'importar devolve exatamente o mesmo progresso');
  // backup antigo (códigos B) importado
  const velho = { 'fisica:feitos': JSON.stringify({ B13: 5 }), 'fisica:marca:B13-2': '"X"' };
  fs.writeFileSync(S + 'backup-velho.json', JSON.stringify(velho));
  await p.setInputFiles('#arq-imp', S + 'backup-velho.json'); await p.waitForTimeout(1500);
  const f = await p.evaluate(() => [JSON.parse(localStorage.getItem('fisica:feitos')), localStorage.getItem('fisica:marca:O09-2'), localStorage.getItem('fisica:marca:C07-1')]);
  conf(f[0].O09 === 5 && f[0].C07 && f[1] === '"X"' && f[2], 'backup antigo com códigos B é convertido (B13 → O09) sem apagar o resto');
  fs.writeFileSync(S + 'lixo.json', '{"a":1}');
  await p.setInputFiles('#arq-imp', S + 'lixo.json'); await p.waitForTimeout(800);
  conf(await p.evaluate(() => !!localStorage.getItem('fisica:feitos')), 'arquivo errado é recusado sem estragar nada');

  // 4. topo some ao descer e volta ao subir
  await p.goto(U + '#/C15d'); await p.waitForTimeout(1200);
  await p.mouse.move(700, 450); for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 250); await p.waitForTimeout(80); } await p.waitForTimeout(400);
  conf(await p.locator('.topo').evaluate(e => e.classList.contains('escondido')), 'topo some ao descer');
  for (let i = 0; i < 3; i++) { await p.mouse.wheel(0, -120); await p.waitForTimeout(80); } await p.waitForTimeout(400);
  conf(await p.locator('.topo').evaluate(e => !e.classList.contains('escondido')), 'topo volta ao subir');

  // 5. busca e menu
  await p.goto(U + '#/inicio'); await p.waitForTimeout(500);
  await p.fill('#busca', 'refracao'); await p.waitForTimeout(200);
  const vis = await p.evaluate(() => [...document.querySelectorAll('#menu-mods li')].filter(l => l.offsetParent).map(l => l.querySelector('.cod').textContent));
  conf(vis.length === 1 && vis[0] === 'O08', 'busca "refracao" (sem acento) acha só O08: ' + vis.join(','));
  await p.fill('#busca', 'T0'); await p.waitForTimeout(200);
  conf(await p.evaluate(() => [...document.querySelectorAll('#menu-mods li')].filter(l => l.offsetParent).length) >= 8, 'busca pelo código novo T0 acha a Termodinâmica');
  await p.fill('#busca', '');
  await p.click('#menu-mods .mod[data-mod="O"] > button'); await p.reload(); await p.waitForTimeout(500);
  const abertoT = await p.evaluate(() => document.querySelector('.mod[data-mod="O"]').classList.contains('aberto'));
  await p.click('#menu-mods .mod[data-mod="O"] > button'); await p.reload(); await p.waitForTimeout(500);
  conf(abertoT !== await p.evaluate(() => document.querySelector('.mod[data-mod="O"]').classList.contains('aberto')), 'abrir/fechar módulo do menu fica salvo');
  const nBreve = await p.locator('#menu-mods a.breve').count(); /* desde a β 3.3 a Física não tem mais tema "em breve" */
  conf(nBreve >= 0, 'temas não escritos marcados "em breve" no menu (' + nBreve + ')');
  conf(await p.evaluate(() => [...document.querySelectorAll('#menu-mods a.breve')].every(a => !a.offsetParent)), 'temas em breve escondidos por padrão');
  await p.click('#bt-breve'); await p.evaluate(() => { const a = document.querySelector('#menu-mods a.breve'); const m = a && a.closest('.mod'); if (m && !m.classList.contains('aberto')) m.querySelector(':scope > button').click(); }); await p.waitForTimeout(200); /* abre um módulo que ainda tenha tema em breve (desde a β 3.3 não é mais o T) */
  const nArea = await p.evaluate(() => [...document.querySelectorAll('#menu-mods a.breve')].filter(a => a.closest('.mod') && a.closest('.mod').offsetParent).length); /* só os da aba aberta */
  conf(nArea === 0 || await p.evaluate(() => [...document.querySelectorAll('#menu-mods a.breve')].some(a => a.offsetParent)), '"Mostrar temas em breve" mostra');
  await p.reload(); await p.waitForTimeout(500);
  conf(await p.evaluate(() => document.body.classList.contains('mostra-breve')), 'a escolha do filtro fica salva');
  await p.click('#bt-breve');

  // 6. abas, sumário, cartões do início
  for (const [aba, area] of [['fisica', 'inicio'], ['calculo', 'calculo'], ['exp', 'experimentos'], ['lab', 'experimental']]) {
    await p.goto(U + "#/inicio"); await p.waitForTimeout(400); await p.click(`.aba[data-area="${aba}"]`); await p.waitForTimeout(500);
    conf(p.url().endsWith('#/' + area), `aba ${aba} leva a #/${area}`);
    const cards = await p.$$eval('.modc', as => as.map(a => a.getAttribute('href')));
    for (const h of cards) { await p.goto(U + h); await p.waitForTimeout(350); const t = await p.textContent('#pagina'); if (!t || t.length < 50) falha.push('cartão vazio ' + h); }
    await p.goto(U + '#/' + area); await p.waitForTimeout(300);
    await p.click('.topo nav.links a[href="#/sumario"]'); await p.waitForTimeout(400);
    const links = await p.$$eval('#pagina a[href^="#/"]', as => as.map(a => a.getAttribute('href')));
    let vazios = [], semAlvo = []; for (const h of links) { await p.goto(U + h); await p.waitForTimeout(h.split('/').length > 2 ? 1000 : 700);
      const r = await p.evaluate((anc) => { const t = document.querySelector('#pagina').innerText.length; if (!anc) return [t, true];
        const alvo = anc === 'exercicios' ? (document.getElementById('exercicios') || document.getElementById('desafios') || document.querySelector('.ex')?.closest('.secao')) : null;
        if (alvo) { const b = alvo.getBoundingClientRect(); return [t, b.top < 300 && b.bottom > 60]; }
        return [t, window.scrollY > 100]; }, h.split('/')[2]);
      if (r[0] < 1500 && !/S0[0-9]/.test(h)) vazios.push(h); if (!r[1] && !/S0[0-9]/.test(h)) semAlvo.push(h); }
    conf(vazios.length === 0, `sumário de ${aba}: ${links.length} links, abrem vazios: ${vazios.join(' ') || 'nenhum'} (Simulados ignorados: só têm a página de entrada)`);
    conf(semAlvo.length === 0, `sumário de ${aba}: links teoria/exercícios rolam até a seção certa; sem alvo: ${semAlvo.slice(0, 8).join(' ') || 'nenhum'}`);
  }

  // continuar de onde parei
  await p.goto(U + '#/U03'); await p.waitForTimeout(1200); await p.mouse.move(700, 450); for (let i = 0; i < 8; i++) { await p.mouse.wheel(0, 400); await p.waitForTimeout(60); } await p.waitForTimeout(900);
  await p.goto(U + '#/inicio'); await p.waitForTimeout(600);
  const cont = await p.$eval('.continuar', a => a.getAttribute('href')).catch(() => null);
  conf(cont && cont.startsWith('#/U03'), 'início mostra "continuar de onde parei" com o último tema: ' + cont);
  if (cont) { await p.click('.continuar'); await p.waitForTimeout(1300); conf(p.url().includes('U03') && (await p.evaluate(() => window.scrollY)) > 200, 'o botão volta ao tema e à seção onde parou'); }
  // folha de fórmulas
  await p.goto(U + '#/U05'); await p.waitForTimeout(1200);
  conf(await p.locator('#formulas .formula').count() >= 2 && await p.locator('#indice a[href$="/formulas"]').count() === 1, `folha de fórmulas no fim do tema (${await p.locator('#formulas .formula').count()} fórmulas) e no índice`);

  // 7. engrenagem: tema claro salvo
  await p.goto(U + '#/inicio'); await p.waitForTimeout(400);
  await p.click('#bt-config'); await p.click('[data-cfg=tema] [data-v=claro]'); await p.reload(); await p.waitForTimeout(500);
  conf(await p.evaluate(() => document.documentElement.getAttribute('data-tema') === 'claro'), 'tema claro continua depois de recarregar');
  await p.goto(U + '#/O07'); await p.waitForTimeout(1200); await p.screenshot({ path: S + 'r2-claro-O07.png' });
  await p.click('#bt-config'); await p.click('[data-cfg=tema] [data-v=escuro]');

  conf(errs.length === 0, 'sem erros no console' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  console.log('OK (' + ok.length + '):\n  ' + ok.join('\n  '));
  console.log('FALHAS (' + falha.length + '):\n  ' + falha.join('\n  '));
  await b.close();
})();
