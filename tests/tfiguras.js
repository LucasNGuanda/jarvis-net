/* Figura central da tela inicial (β 3.9). Uso: node tests/tfiguras.js
   Confere: cadastro (3 figuras, 1 padrão), cada uma desenha e se mexe, escolha pelo painel, cor própria × cor do tema,
   velocidade (0 = parado de verdade), salvo em jarvis:figura, recarregar mantém, exportar inclui, sem erro de JS. */
const { chromium } = require('playwright');
const URL = 'file:///home/user/site-fisica/index.html#/home';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  const res = []; const ok = (c, m) => res.push([c, m]);
  await p.goto(URL); await p.evaluate(() => localStorage.removeItem('jarvis:figura')); await p.reload(); await p.waitForTimeout(700);
  const cad = await p.evaluate(() => ({ n: FIGURAS.length, ids: FIGURAS.map((f) => f.id).join(), padrao: FIGURAS.filter((f) => f.padrao).map((f) => f.id).join(), atual: document.querySelector('.jv-ilu svg').classList.contains('jv-planeta') || document.querySelector('.jv-ilu svg').classList.contains('jv-globo') }));
  ok(cad.n === 3 && cad.ids === 'planeta,galaxia,buraconegro' && cad.padrao === 'planeta' && cad.atual, 'cadastro: 3 figuras, planeta é a padrão e aparece sem escolher nada → ' + JSON.stringify(cad));
  const foto = () => p.evaluate(() => document.querySelector('.jv-ilu svg').innerHTML + [...document.querySelectorAll('.jv-ilu svg *')].map((e) => e.getAttribute('style') || '').join(''));
  for (const id of ['planeta', 'galaxia', 'buraconegro']) {
    await p.evaluate((i) => JARVIS.figura({ id: i }), id); await p.waitForTimeout(300);
    const a = await foto(); await p.waitForTimeout(500); const c = await foto();
    const n = await p.evaluate(() => document.querySelectorAll('.jv-ilu svg path, .jv-ilu svg ellipse, .jv-ilu svg circle, .jv-ilu svg line').length);
    ok(n > 4 && a !== c, `${id}: desenha (${n} elementos) e se mexe`);
  }
  /* painel */
  await p.click('.jv-engrenagem'); await p.waitForTimeout(250);
  ok((await p.$$('.jv-painel-figbt')).length === 3, 'painel tem a seção "Figura central" com 3 miniaturas');
  ok(await p.evaluate(() => [...document.querySelectorAll('.jv-painel-figbt svg')].every((s) => s.innerHTML.length > 200)), 'miniaturas desenhadas');
  await p.click('.jv-painel-figbt[data-fig=galaxia]'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => !!document.querySelector('.jv-ilu .jv-galaxia') && JSON.parse(localStorage.getItem('jarvis:figura')).id === 'galaxia' && document.querySelector('.jv-painel-figbt[data-fig=galaxia]').getAttribute('aria-pressed') === 'true'), 'clicar na miniatura troca a figura e salva em jarvis:figura');
  /* cor própria × cor do tema */
  ok(await p.evaluate(() => document.querySelector('[data-f=cor]').disabled && !document.querySelector('.jv-ilu').style.getPropertyValue('--fg2')), 'padrão: acompanha a cor do tema (controle de cor desativado)');
  await p.click('[data-f=tema]'); await p.evaluate(() => { const r = document.querySelector('[data-f=cor]'); r.value = 120; r.dispatchEvent(new Event('input')); }); await p.waitForTimeout(150);
  const cor = await p.evaluate(() => ({ fg: document.querySelector('.jv-ilu').style.getPropertyValue('--fg2'), salvo: JSON.parse(localStorage.getItem('jarvis:figura')).hue, braco: getComputedStyle(document.querySelector('.jv-ilu .jv-braco')).stroke, titulo: getComputedStyle(document.querySelector('.jv-cab h1')).backgroundImage }));
  ok(/hsl\(120/.test(cor.fg) && cor.salvo === 120 && !/120/.test(cor.titulo), 'cor própria: muda só a figura (o título continua com a cor dele) → ' + cor.fg + ' / ' + cor.braco);
  await p.click('[data-f=tema]'); await p.waitForTimeout(100);
  ok(await p.evaluate(() => !document.querySelector('.jv-ilu').style.getPropertyValue('--fg2') && JSON.parse(localStorage.getItem('jarvis:figura')).hue === null), 'voltar a "acompanhar a cor do tema"');
  /* velocidade: 0 = parado */
  await p.evaluate(() => { const r = document.querySelector('[data-f=vel]'); r.value = 0; r.dispatchEvent(new Event('input')); }); await p.waitForTimeout(200);
  const v0 = await foto(); await p.waitForTimeout(700); const v1 = await foto();
  ok(v0 === v1 && (await p.evaluate(() => document.querySelector('[data-f=velt]').textContent)) === 'parado', 'velocidade 0: "parado" e a figura não se mexe');
  await p.evaluate(() => { const r = document.querySelector('[data-f=vel]'); r.value = 2; r.dispatchEvent(new Event('input')); }); await p.waitForTimeout(200);
  const w0 = await foto(); await p.waitForTimeout(400); ok(w0 !== (await foto()) && (await p.evaluate(() => document.querySelector('[data-f=velt]').textContent)) === '2×', 'velocidade 2×: volta a girar');
  /* recarregar mantém; exportar inclui */
  await p.reload(); await p.waitForTimeout(600);
  ok(await p.evaluate(() => !!document.querySelector('.jv-ilu .jv-galaxia') && JARVIS.figuraCfg().vel === 2), 'recarregar mantém figura e velocidade');
  await p.goto('file:///home/user/site-fisica/index.html#/inicio'); await p.waitForTimeout(400);
  const [dl] = await Promise.all([p.waitForEvent('download'), p.evaluate(() => document.getElementById('bt-exp').click())]);
  ok(/jarvis:figura/.test(require('fs').readFileSync(await dl.path(), 'utf8')), 'exportar progresso inclui a figura central');
  await p.evaluate(() => localStorage.removeItem('jarvis:figura'));
  ok(!errs.length, 'sem erros de JavaScript ' + errs.join(' | '));
  console.log(res.filter((r) => r[0]).length + ' de ' + res.length + ' ok'); process.exitCode = res.every((r) => r[0]) ? 0 : 1; res.forEach((r) => console.log((r[0] ? 'ok     ' : 'FALHA  ') + r[1]));
  await b.close();
})();
