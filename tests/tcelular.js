// Celular (β 11.5): tabela periódica e moléculas com tela de celular e toque. Uso: node tests/tcelular.js
// Mede em 375×812 e 390×844 (com toque). O teclado do celular é imitado encolhendo a altura da tela: o Playwright não tem teclado de verdade.
const { chromium } = require('playwright'); const path = require('path');
const base = 'file://' + path.resolve(__dirname, '..', 'index.html');
const falhas = []; const conf = (ok, txt, extra) => { console.log((ok ? 'ok     ' : 'FALHA  ') + txt + (extra !== undefined ? ' → ' + extra : '')); if (!ok) falhas.push(txt); };
const AVISO = 'Obs.: no celular esta ferramenta não funciona muito bem. Para a melhor experiência, use um computador.';
(async () => { const b = await chromium.launch();
  for (const [w, h] of [[375, 812], [390, 844]]) { const T = `${w}×${h}: `;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true }), p = await ctx.newPage(); const erros = []; p.on('pageerror', (e) => erros.push(e.message)); await require('./adm')(p);
    const cdp = await ctx.newCDPSession(p);
    const toque = async (tipo, pts) => cdp.send('Input.dispatchTouchEvent', { type: tipo, touchPoints: pts.map(([x, y], i) => ({ x, y, id: i })) });
    const arrasta = async (x0, y0, x1, y1) => { await toque('touchStart', [[x0, y0]]); for (let k = 1; k <= 8; k++) { await toque('touchMove', [[x0 + ((x1 - x0) * k) / 8, y0 + ((y1 - y0) * k) / 8]]); await p.waitForTimeout(16); } await toque('touchEnd', []); await p.waitForTimeout(350); };
    const ret = (s) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom }; }, s);
    const largo = () => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);

    /* ---------- tabela periódica ---------- */
    await p.goto(base + '#/quimica'); await p.waitForTimeout(800); await p.evaluate(() => TABELA.ligaSalvo(true)); await p.waitForTimeout(600);
    let r = await ret('.tp-barra'); conf(r && r.h >= 44 && r.b <= h + 0.5, T + 'a barra do rodapé tem pelo menos 44 px e está dentro da tela', r && r.h);
    await p.tap('.tp-barra'); await p.waitForTimeout(600); conf(await p.evaluate(() => !!document.querySelector('.tp-aberta')), T + 'tocar na barra abre a gaveta');
    const av = await p.evaluate(() => { const a = document.querySelector('.tp-gaveta .av-cel'); return a && { txt: a.querySelector('span').textContent, vis: getComputedStyle(a).display !== 'none', bt: a.querySelector('button').getBoundingClientRect().width }; });
    conf(av && av.txt === AVISO && av.vis && av.bt >= 44, T + 'tabela: o aviso de celular aparece com o texto combinado e botão de fechar de 44 px');
    let g = await p.evaluate(() => { const gr = document.querySelector('.tp-grade'), cs = [...gr.querySelectorAll('.tp-c')].map((c) => c.getBoundingClientRect()); return { sw: gr.scrollWidth, cw: gr.clientWidth, sh: gr.scrollHeight, ch: gr.clientHeight, minW: Math.min(...cs.map((c) => c.width)), minH: Math.min(...cs.map((c) => c.height)) }; });
    conf(g.minW >= 44 && g.minH >= 44, T + 'cada elemento tem pelo menos 44 × 44 px', `${g.minW} × ${g.minH}`);
    conf(g.sw > g.cw, T + 'a tabela é mais larga que a tela e rola dentro da gaveta', `${g.sw} > ${g.cw}`);
    r = await ret('.tp-grade'); await arrasta(r.x + r.w - 30, r.y + 150, r.x + 30, r.y + 150); let sc = await p.evaluate(() => document.querySelector('.tp-grade').scrollLeft); conf(sc > 100, T + 'arrastar o dedo para o lado rola a tabela', sc);
    await arrasta(r.x + 150, r.y + r.h - 40, r.x + 150, r.y + 40); const st = await p.evaluate(() => document.querySelector('.tp-grade').scrollTop); conf(st > 20 || st >= g.sh - g.ch - 1, T + 'arrastar o dedo para cima rola a tabela até onde ela tem para rolar', `${st} de ${g.sh - g.ch}`);
    conf((await largo()) <= 0, T + 'a página não ganha rolagem para o lado com a gaveta aberta');
    const fora = await p.evaluate(() => [...document.querySelectorAll('.tp-topo b, .tp-topo input, .tp-x, .tp-ctl, .tp-rod')].filter((e) => { const r = e.getBoundingClientRect(); return r.left < -0.5 || r.right > innerWidth + 0.5 || r.top < -0.5 || r.bottom > innerHeight + 0.5; }).map((e) => e.className || e.tagName)); conf(!fora.length, T + 'título, busca, X, controles e rodapé da gaveta ficam dentro da tela', fora.join());
    const peq = await p.evaluate(() => [...document.querySelectorAll('.tp-modos .bt, .tp-x, .tp-topo input')].map((e) => e.getBoundingClientRect()).filter((r) => r.height < 44 || r.width < 44).length); conf(peq === 0, T + 'botões de modo, busca e X têm pelo menos 44 px', peq);
    /* ficha em tela cheia */
    await p.evaluate(() => { const gr = document.querySelector('.tp-grade'); gr.scrollLeft = 0; gr.scrollTop = 0; }); await p.tap('.tp-c[data-z="11"]'); await p.waitForTimeout(500);
    r = await ret('.tp-dir'); const fx = await ret('.tp-fx'); const tit = await p.evaluate(() => document.querySelector('.tp-dir h4').textContent);
    conf(r && r.x <= 0.5 && r.y <= 0.5 && r.w >= w - 0.5 && r.h >= h - 0.5, T + 'tocar num elemento abre a ficha em tela cheia', r && `${r.w} × ${r.h}`);
    conf(/^Na/.test(tit), T + 'a ficha é a do elemento tocado (sódio)', tit);
    conf(fx && fx.h >= 44 && fx.w >= 44 && fx.r <= w && fx.y >= 0, T + 'a ficha tem botão de fechar de pelo menos 44 px, dentro da tela');
    const cob = await p.evaluate(() => { const e = document.elementFromPoint(innerWidth / 2, innerHeight - 10); return !!(e && e.closest('.tp-dir')); }); conf(cob, T + 'a ficha cobre a tela até embaixo (a barra do rodapé some enquanto ela está aberta)');
    await arrasta(w / 2, h - 120, w / 2, 200); const fs = await p.evaluate(() => document.querySelector('.tp-dir').scrollTop); conf(fs > 20, T + 'a ficha rola com o dedo', fs);
    await p.tap('.tp-fx'); await p.waitForTimeout(450); conf(await p.evaluate(() => !document.querySelector('.tp-fon') && !!document.querySelector('.tp-aberta')), T + 'o botão de fechar volta para a tabela (a gaveta continua aberta)');
    /* busca da tabela com o teclado: Enter abre a ficha */
    await p.tap('.tp-topo input'); await p.keyboard.type('ferro'); await p.keyboard.press('Enter'); await p.waitForTimeout(450); conf(await p.evaluate(() => !!document.querySelector('.tp-fon') && /^Fe/.test(document.querySelector('.tp-dir h4').textContent)), T + 'buscar "ferro" e tocar em "ir" no teclado abre a ficha do ferro');
    await p.tap('.tp-fx'); await p.waitForTimeout(300); await p.fill('.tp-topo input', ''); 
    /* fechar: X, e puxar o cabeçalho para baixo */
    await p.tap('.tp-x'); await p.waitForTimeout(450); conf(await p.evaluate(() => !document.querySelector('.tp-aberta')), T + 'o X fecha a gaveta');
    await p.tap('.tp-barra'); await p.waitForTimeout(500); r = await ret('.tp-topo b'); await arrasta(r.x + 20, r.y + 8, r.x + 20, r.y + 200); conf(await p.evaluate(() => !document.querySelector('.tp-aberta')), T + 'puxar o cabeçalho para baixo com o dedo fecha a gaveta');
    /* aviso: fecha, e não volta */
    await p.tap('.tp-barra'); await p.waitForTimeout(500); await p.tap('.tp-gaveta .av-cel button'); await p.waitForTimeout(150);
    const k1 = await p.evaluate(() => localStorage.getItem('fisica:aviso-cel')); conf(!(await p.$('.tp-gaveta .av-cel')) && k1 === '{"tabela":true}', T + 'fechar o aviso da tabela guarda só a tabela', k1);
    await p.reload(); await p.waitForTimeout(900); await p.tap('.tp-barra'); await p.waitForTimeout(500); conf(!(await p.$('.tp-gaveta .av-cel')), T + 'depois de fechado, o aviso da tabela não volta ao recarregar');
    await p.evaluate(() => TABELA.ligaSalvo(false)); await p.waitForTimeout(350);

    /* ---------- moléculas (MV01) ---------- */
    await p.goto(base + '#/quimica/MV01'); await p.waitForTimeout(3200); await p.evaluate(() => { document.querySelector('.mv [data-b=g]').click(); document.querySelector('.mv-palco').scrollIntoView({ block: 'center' }); }); await p.waitForTimeout(400);
    r = await ret('.mv-palco canvas'); conf(r.w >= w - 70 && r.h >= w - 70 && r.r <= w, T + 'MV01: o modelo ocupa a largura da tela', `${Math.round(r.w)} × ${Math.round(r.h)}`);
    conf((await largo()) <= 0, T + 'MV01: a página não rola para o lado');
    conf(!(await p.$('.mv .av-cel')), T + 'MV01: com uma molécula só, não há aviso');
    const est = () => p.evaluate(() => { const e = SIM.qMoleculas._ult.pal.estado(); return { R: JSON.stringify(e.R), zoom: e.zoom }; });
    let e0 = await est(); const cx = r.x + r.w / 2, cy = r.y + r.h / 2; const sy0 = await p.evaluate(() => scrollY);
    await arrasta(cx - 60, cy, cx + 60, cy + 30); let e1 = await est(); conf(e1.R !== e0.R && e1.zoom === e0.zoom, T + 'MV01: um dedo arrastando gira o modelo (e não mexe no zoom)');
    conf((await p.evaluate(() => scrollY)) === sy0, T + 'MV01: girar com o dedo não rola a página');
    /* pinça: dois dedos se afastando e depois se aproximando */
    const pinca = async (d0, d1) => { await toque('touchStart', [[cx - d0, cy], [cx + d0, cy]]); for (let k = 1; k <= 8; k++) { const d = d0 + ((d1 - d0) * k) / 8; await toque('touchMove', [[cx - d, cy], [cx + d, cy]]); await p.waitForTimeout(16); } await toque('touchEnd', []); await p.waitForTimeout(300); };
    e0 = await est(); await pinca(30, 90); e1 = await est(); conf(e1.zoom > e0.zoom * 1.5 && e1.R === e0.R, T + 'MV01: pinça abrindo aproxima (e não gira)', `${e0.zoom} → ${e1.zoom.toFixed(2)}`);
    await pinca(90, 30); const e2 = await est(); conf(e2.zoom < e1.zoom * 0.6 && e2.R === e1.R, T + 'MV01: pinça fechando afasta', `${e1.zoom.toFixed(2)} → ${e2.zoom.toFixed(2)}`);
    conf((await p.evaluate(() => (window.visualViewport ? visualViewport.scale : 1))) === 1, T + 'MV01: a pinça no modelo não dá zoom na página');
    let pq = await p.evaluate(() => [...document.querySelectorAll('.mv button, .mv input')].filter((e) => e.offsetParent).map((e) => [e.textContent.trim().slice(0, 12), e.getBoundingClientRect()]).filter(([, r]) => r.height < 44 || r.width < 44).map((x) => x[0])); conf(!pq.length, T + 'MV01: todos os botões, a busca e os itens da lista têm pelo menos 44 px', pq.slice(0, 5).join());
    /* busca com o teclado aberto (imitado: a tela encolhe) */
    await p.tap('#mv-q'); await p.waitForTimeout(450); await p.setViewportSize({ width: w, height: 470 }); await p.waitForTimeout(450); await p.keyboard.type('etanol', { delay: 20 }); await p.waitForTimeout(450);
    const bk = await p.evaluate(() => { const i = document.querySelector('#mv-q').getBoundingClientRect(), its = [...document.querySelectorAll('.mv-it')].map((x) => x.getBoundingClientRect()).filter((r) => r.top >= 0 && r.bottom <= innerHeight); return { top: i.top, bottom: i.bottom, vis: its.length, fs: parseFloat(getComputedStyle(document.querySelector('#mv-q')).fontSize) }; });
    conf(bk.top >= 0 && bk.bottom < 235 && bk.vis >= 1, T + 'MV01: com o teclado aberto, o campo fica no alto e o resultado aparece logo abaixo', JSON.stringify(bk));
    conf(bk.fs >= 16, T + 'MV01: a letra do campo tem 16 px (abaixo disso o iPhone dá zoom sozinho ao focar)', bk.fs);
    await p.tap('.mv-it'); await p.setViewportSize({ width: w, height: h }); await p.waitForTimeout(900); const ab = await p.evaluate(() => { const r = document.querySelector('.mv-palco').getBoundingClientRect(); return { ab: SIM.qMoleculas._ult.estado().abertos.join(), vis: r.top >= 0 && r.bottom <= innerHeight, foco: document.activeElement.id }; });
    conf(ab.ab === 'etanol' || /etanol|ethanol|c2h6o/.test(ab.ab), T + 'MV01: tocar num resultado abre a molécula', ab.ab); conf(ab.vis && ab.foco !== 'mv-q', T + 'MV01: depois de escolher, o teclado fecha e a tela volta para o modelo');
    /* isômeros lado a lado: é onde não fica bom → aviso, uma vez */
    await p.evaluate(() => SIM.qMoleculas._ult.abre(['butan-1-ol', 'butan-2-ol'].filter(() => true))); await p.waitForTimeout(200); await p.fill('#mv-q', 'c4h10o'); await p.waitForTimeout(500);
    const a2 = await p.evaluate(() => { const a = document.querySelector('.mv .av-cel'); return { n: SIM.qMoleculas._ult.estado().mods, txt: a && a.querySelector('span').textContent, vis: a && getComputedStyle(a).display !== 'none' }; }); conf(a2.n > 1 && a2.txt === AVISO && a2.vis, T + 'MV01: com isômeros lado a lado, aparece o aviso de celular', a2.n + ' modelos');
    await p.tap('.mv .av-cel button'); await p.waitForTimeout(150); const k2 = JSON.parse(await p.evaluate(() => localStorage.getItem('fisica:aviso-cel'))); conf(k2.moleculas === true && k2.tabela === true && !(await p.$('.mv .av-cel')), T + 'MV01: fechar guarda o aviso das moléculas separado do da tabela');
    await p.reload(); await p.waitForTimeout(3000); await p.fill('#mv-q', 'c4h10o'); await p.waitForTimeout(500); conf(!(await p.$('.mv .av-cel')), T + 'MV01: fechado uma vez, o aviso não volta');

    /* ---------- construtor (MV02) ---------- */
    await p.goto(base + '#/quimica/MV02'); await p.waitForTimeout(2500); await p.evaluate(() => { document.querySelector('.vc [data-b=g]').click(); document.querySelector('.vc .mv-palco').scrollIntoView({ block: 'center' }); }); await p.waitForTimeout(400);
    r = await ret('.vc canvas'); conf(r.w >= w - 70 && r.r <= w && (await largo()) <= 0, T + 'MV02: o modelo ocupa a largura da tela e a página não rola para o lado', Math.round(r.w));
    pq = await p.evaluate(() => [...document.querySelectorAll('.vc button, .vc select')].filter((e) => e.offsetParent).map((e) => [e.textContent.trim().slice(0, 8), e.getBoundingClientRect()]).filter(([, r]) => r.height < 44 || r.width < 44).map((x) => x[0])); conf(!pq.length, T + 'MV02: todos os botões e seletores têm pelo menos 44 px', pq.slice(0, 5).join());
    const im0 = await p.evaluate(() => document.querySelector('.vc canvas').toDataURL()); const c2x = r.x + r.w / 2, c2y = r.y + r.h / 2; await arrasta(c2x - 60, c2y, c2x + 60, c2y + 20); const im1 = await p.evaluate(() => document.querySelector('.vc canvas').toDataURL()); conf(im0 !== im1, T + 'MV02: um dedo arrastando gira o modelo (o desenho muda)');
    await toque('touchStart', [[c2x - 30, c2y], [c2x + 30, c2y]]); for (let k = 1; k <= 8; k++) { await toque('touchMove', [[c2x - 30 - 8 * k, c2y], [c2x + 30 + 8 * k, c2y]]); await p.waitForTimeout(16); } await toque('touchEnd', []); await p.waitForTimeout(300); const im2 = await p.evaluate(() => document.querySelector('.vc canvas').toDataURL()); conf(im2 !== im1, T + 'MV02: a pinça muda o tamanho do modelo (o desenho muda)');
    conf(!(await p.$('.vc .av-cel')), T + 'MV02: sem aviso (não precisou)');
    /* contraprova: sem o estilo de celular, a medida dos botões acusa */
    const semCss = await p.evaluate(() => { const s = document.getElementById('mv-css'); s.textContent = s.textContent.replace(/@media \(max-width:700px\)/, '@media (max-width:1px)'); return [...document.querySelectorAll('.vc button')].filter((e) => e.offsetParent && e.getBoundingClientRect().height < 44).length; }); conf(semCss > 0, T + 'contraprova: sem o estilo de celular, a mesma medida acusa botões pequenos', semCss);
    conf(!erros.length, T + 'nenhum erro de JavaScript', erros.slice(0, 2).join(' | ')); await ctx.close(); }

  /* ---------- computador (1280 px): nada do celular entra ---------- */
  { const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }), p = await ctx.newPage(); await require('./adm')(p); await p.goto(base + '#/quimica'); await p.waitForTimeout(700); await p.evaluate(() => { TABELA.ligaSalvo(true); TABELA.abre(true); }); await p.waitForTimeout(600); await p.click('.tp-c[data-z="11"]'); await p.waitForTimeout(300);
    const d = await p.evaluate(() => { const c = (s) => getComputedStyle(document.querySelector(s)), r = (s) => document.querySelector(s).getBoundingClientRect(); return { fon: !!document.querySelector('.tp-fon'), fx: c('.tp-fx').display, dirPos: c('.tp-dir').position, dirW: r('.tp-dir').width, barra: r('.tp-barra').height, gav: r('.tp-gaveta').height, aviso: !!document.querySelector('.av-cel'), cel: r('.tp-c').width, sw: document.querySelector('.tp-grade').scrollWidth - document.querySelector('.tp-grade').clientWidth, chave: localStorage.getItem('fisica:aviso-cel') }; });
    conf(!d.fon && d.fx === 'none' && d.dirPos === 'static' && d.dirW === 330 && d.barra === 32 && d.gav === 712 && !d.aviso && d.sw <= 0 && d.chave === null, '1280 px: a tabela continua como era (ficha ao lado com 330 px, barra de 32 px, gaveta de 712 px, sem aviso, sem botão de fechar a ficha)', JSON.stringify(d));
    await p.evaluate(() => TABELA.ligaSalvo(false)); await p.goto(base + '#/quimica/MV01'); await p.waitForTimeout(3000); await p.fill('#mv-q', 'c4h10o'); await p.waitForTimeout(400);
    const m = await p.evaluate(() => ({ cols: getComputedStyle(document.querySelector('.mv')).gridTemplateColumns.split(' ').length, bt: document.querySelector('.mv [data-b=g]').getBoundingClientRect().height, aviso: !!document.querySelector('.av-cel'), inp: getComputedStyle(document.querySelector('#mv-q')).fontSize })); conf(m.cols === 2 && m.bt < 40 && !m.aviso && m.inp === '14px', '1280 px: o visualizador continua em duas colunas, com os botões do tamanho de antes e sem aviso', JSON.stringify(m)); await ctx.close(); }
  console.log(falhas.length ? `\nFALHAS (${falhas.length}):\n  ` + falhas.join('\n  ') : '\nFALHAS (0):'); await b.close(); process.exit(falhas.length ? 1 : 0); })();
