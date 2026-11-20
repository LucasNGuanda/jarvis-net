// Verificação do site como ele é servido no GitHub Pages (numa subpasta /site-fisica/, por HTTP).
// Uso: node tools/verifica-site.js            (sobe um servidor local, percorre as páginas como ADM e imprime um relatório)
// Confere: arquivos que não carregam (404), links internos que não levam a lugar nenhum, links externos (só lista),
// imagens sem texto alternativo, e os tempos de carregamento da tela inicial.
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RAIZ = path.resolve(__dirname, '..'), PRE = '/site-fisica/';
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json' };
const srv = http.createServer((q, r) => { let u = decodeURIComponent(q.url.split('?')[0]); if (!u.startsWith(PRE)) { r.writeHead(404); return r.end('fora'); } u = u.slice(PRE.length) || 'index.html'; const f = path.join(RAIZ, u);
  if (!f.startsWith(RAIZ) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }); return r.end(fs.readFileSync(path.join(RAIZ, '404.html'))); }
  r.writeHead(200, { 'content-type': TIPOS[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
(async () => { await new Promise((ok) => srv.listen(0, ok)); const B = `http://127.0.0.1:${srv.address().port}${PRE}`;
  const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }), p = await ctx.newPage(); await require('../tests/adm')(p);
  const ruins404 = new Set(), errosJS = []; p.on('response', (r) => { if (r.status() >= 400) ruins404.add(r.status() + ' ' + r.url().replace(B, '')); }); p.on('pageerror', (e) => errosJS.push(String(e).slice(0, 160)));
  /* 1. carregamento da tela inicial */
  const reqs = []; p.on('requestfinished', async (r) => { try { const s = await r.sizes(); reqs.push([r.url().replace(B, ''), s.responseBodySize]); } catch (e) {} });
  await p.goto(B, { waitUntil: 'load' }); await p.waitForTimeout(1500);
  const nav = await p.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return { dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), scripts: document.querySelectorAll('script[src]').length, semDefer: [...document.querySelectorAll('script[src]')].filter((s) => !s.defer && !s.async).length }; });
  const inicial = reqs.slice(), total = inicial.reduce((s, x) => s + x[1], 0);
  console.log(`CARREGAMENTO da tela inicial (servidor local): ${inicial.length} arquivos, ${(total / 1024).toFixed(0)} KB; DOMContentLoaded em ${nav.dcl} ms, load em ${nav.load} ms; ${nav.scripts} scripts, ${nav.semDefer} sem defer`);
  console.log('  maiores: ' + inicial.sort((a, b) => b[1] - a[1]).slice(0, 8).map((x) => `${x[0]} ${(x[1] / 1024).toFixed(0)} KB`).join(' · '));
  /* 2. rotas: todas as do catálogo */
  const rotas = await p.evaluate(() => { const r = ['#/home', '#/inicio', '#/sumario', '#/codigos']; (window.MATERIAS || []).forEach((m) => r.push(m.rota)); (window.AREAS || []).forEach((a) => a.inicio && r.push('#/' + a.inicio)); (window.CATALOGO || []).forEach((m) => m.temas.forEach((t) => { if (!t[3]) return; for (const mt of window.MATERIAS) { const i = window.F.achar(t[0], mt.id); if (i && i.mod === m) { r.push(window.F.href(i.cod, i.mat)); break; } } })); return [...new Set(r)]; });
  await p.goto(B + '#/ZZZ99-rota-que-nao-existe'); await p.waitForTimeout(500); const assinaturaRuim = await p.evaluate(() => document.querySelector('main.principal').innerText.trim().slice(0, 80));
  const links = new Map(), externos = new Map(), semAlt = [], vazias = [];
  for (const r of rotas) { await p.goto(B + r); await p.waitForTimeout(160); const d = await p.evaluate(() => ({ as: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')), imgs: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt') || (i.getAttribute('alt').trim() === '' && i.getAttribute('role') !== 'presentation' && !i.hasAttribute('aria-hidden'))).map((i) => i.getAttribute('src')), svgs: [...document.querySelectorAll('main svg[role=img]')].filter((s) => !s.getAttribute('aria-label') && !s.querySelector('title')).length, txt: document.querySelector('main.principal').innerText.trim().length }));
    d.as.forEach((h) => { if (/^https?:/.test(h)) externos.set(h, r); else if (h.startsWith('#/')) { if (!links.has(h)) links.set(h, r); } else if (!h.startsWith('#') && !h.startsWith('mailto:') && !h.startsWith('javascript:')) links.set('ARQ ' + h, r); }); d.imgs.forEach((s) => semAlt.push(r + ' ' + s)); if (d.txt < 40) vazias.push(r); }
  console.log(`ROTAS percorridas: ${rotas.length}; páginas quase vazias: ${vazias.length}${vazias.length ? ' → ' + vazias.slice(0, 8).join(' ') : ''}`);
  /* 3. links internos: cada destino diferente é aberto */
  const quebrados = []; for (const [h, de] of links) { if (h.startsWith('ARQ ')) { const f = h.slice(4).split('#')[0].split('?')[0]; if (f && !fs.existsSync(path.join(RAIZ, f))) quebrados.push(`${h} (em ${de})`); continue; } if (rotas.includes(h.split('/').slice(0, h.split('/').length).join('/'))) continue; await p.goto(B + h); await p.waitForTimeout(140); const t = await p.evaluate(() => document.querySelector('main.principal').innerText.trim().slice(0, 80)); if (t === assinaturaRuim || t.length < 5) quebrados.push(`${h} (em ${de})`); }
  console.log(`LINKS internos diferentes: ${links.size}; quebrados: ${quebrados.length}${quebrados.length ? '\n  ' + quebrados.slice(0, 40).join('\n  ') : ''}`);
  console.log(`LINKS externos clicáveis: ${externos.size}${externos.size ? '\n  ' + [...externos].map(([h, de]) => `${h} (em ${de})`).join('\n  ') : ''}`);
  console.log(`IMAGENS sem texto alternativo: ${semAlt.length}${semAlt.length ? '\n  ' + semAlt.slice(0, 20).join('\n  ') : ''}`);
  console.log(`ARQUIVOS que não carregaram (4xx/5xx): ${ruins404.size}${ruins404.size ? '\n  ' + [...ruins404].slice(0, 30).join('\n  ') : ''}`);
  console.log(`ERROS de JavaScript: ${errosJS.length}${errosJS.length ? '\n  ' + [...new Set(errosJS)].slice(0, 10).join('\n  ') : ''}`);
  /* 4. a página 404 */
  const r404 = await p.goto(B + 'nao-existe/A01'); await p.waitForTimeout(200); const t404 = await p.evaluate(() => ({ h1: document.querySelector('h1').textContent, dica: !document.getElementById('dica').hidden, certo: document.getElementById('certo').getAttribute('href') }));
  console.log(`PÁGINA 404: status ${r404.status()}, título "${t404.h1}", sugestão visível: ${t404.dica} (${t404.certo})`);
  await b.close(); srv.close(); process.exit(quebrados.length || semAlt.length || errosJS.length ? 1 : 0); })();
