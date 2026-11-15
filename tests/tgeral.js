const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
// Varredura geral em 1280 px: todas as páginas do catálogo + páginas fixas.
const { chromium } = require('playwright');
const U = RAIZ;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  let errs = []; p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto(U + '#/inicio'); await p.waitForTimeout(800);
  /* β 3.8: cada tema com a rota da sua matéria (física #/A01; outras #/quimica/A01) */
  const cat = await p.evaluate(() => CATALOGO.map(m => ({ area: m.area || 'fisica', mod: m.id, temas: m.temas.map(t => [t[0], !!t[3], F.href(t[0], m)]) })));
  const todos = cat.flatMap(m => m.temas.map(([c, pr, h]) => ({ c, pr, h, area: m.area })));
  const problemas = []; const resumo = { paginas: 0, escritas: 0, links: 0, exercicios: 0, labs: 0, katex: 0 };
  const rotas = await p.evaluate(() => AREAS.map((a) => a.inicio).concat('sumario'));
  for (const r of rotas) { errs = []; await p.goto(U + '#/' + r); await p.waitForTimeout(500); if (errs.length) problemas.push(r + ': ' + errs.join(' | ')); }
  for (const t of todos) {
    errs = []; resumo.paginas++;
    await p.goto(U + t.h); await p.waitForTimeout(t.pr ? 900 : 250);
    const r = await p.evaluate(async (pr) => {
      const out = { h1: document.querySelector('#pagina h1')?.textContent || '', secoes: document.querySelectorAll('#pagina .secao').length, ex: document.querySelectorAll('.ex').length, labs: document.querySelectorAll('.lab').length, txt: document.querySelector('#pagina').innerText.length };
      // dicas e respostas fechadas por padrão
      out.abertos = [...document.querySelectorAll('#pagina .rev-painel')].filter(d => !d.hidden).length + [...document.querySelectorAll('#pagina .rev-bt[aria-expanded=true]')].length;
      // links internos
      const ruins = [];
      for (const a of document.querySelectorAll('#pagina a[href^="#/"]')) {
        const pd = a.getAttribute('href').slice(2).split('/'), ns = MATERIAS.some((m) => m.id === pd[0] && m.id !== 'fisica') && pd[1], mid = ns ? pd[0] : 'fisica', cod = ns ? pd[1] : pd[0], anc = ns ? pd[2] : pd[1];
        if (AREAS.some((x) => x.inicio === cod) || cod === 'sumario' || (!ns && MATERIAS.some((m) => m.id === cod))) continue;
        const info = F.achar(cod, mid);
        if (!info) ruins.push('link para tema inexistente: ' + a.getAttribute('href'));
        else if (anc && info.chave === (mid === 'fisica' ? location.hash.slice(2).split('/')[0] : location.hash.slice(2).split('/').slice(0, 2).join('/')) && !document.getElementById(anc)) ruins.push('âncora sem alvo: ' + a.getAttribute('href'));
      }
      out.links = document.querySelectorAll('#pagina a[href^="#/"]').length;
      // retomas que apontam para temas não escritos
      out.retNaoEscrito = [...document.querySelectorAll('#pagina a.ret')].map(a => a.getAttribute('href').slice(2)).filter(c => { const i = F.achar(c); return i && !i.pronto; });
      // abre tudo e conta katex-error
      document.querySelectorAll('#pagina details').forEach(d => d.open = true); document.querySelectorAll('#pagina .rev-painel').forEach(d => d.hidden = false);
      out.katex = document.querySelectorAll('#pagina .katex-error').length;
      out.katexMsg = [...document.querySelectorAll('#pagina .katex-error')].slice(0, 2).map(e => (e.getAttribute('title') || '').slice(0, 90));
      out.ruins = ruins;
      out.nanTexto = /\bNaN\b|undefined|\[object Object\]/.test(document.querySelector('#pagina').innerText);
      return out;
    }, t.pr);
    resumo.links += r.links; resumo.exercicios += r.ex; resumo.labs += r.labs; resumo.katex += r.katex;
    const pb = [];
    if (t.pr) {
      resumo.escritas++;
      if (r.secoes < 2 || r.txt < 1500) pb.push(`conteúdo curto (seções ${r.secoes}, ${r.txt} caracteres)`);
      if (r.abertos) pb.push(`${r.abertos} dica/resposta já aberta`);
    } else if (!/ainda não foi escrito/.test(await p.textContent('#pagina'))) pb.push('página de tema não escrito sem aviso');
    if (r.katex) pb.push(`${r.katex} katex-error: ${r.katexMsg.join(' ; ')}`);
    if (r.ruins.length) pb.push(r.ruins.join('; '));
    if (r.retNaoEscrito.length) pb.push('[n]← para tema não escrito: ' + r.retNaoEscrito.join(', '));
    if (r.nanTexto) pb.push('NaN/undefined no texto');
    if (errs.length) pb.push(errs.slice(0, 3).join(' | '));
    if (pb.length) problemas.push(`${t.h.slice(2)}: ${pb.join(' || ')}`);
  }
  console.log(JSON.stringify(resumo));
  console.log(problemas.length ? problemas.join('\n') : 'nenhum problema');
  await b.close();
})();
