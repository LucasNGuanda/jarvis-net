// tmoleculas.js: aba Moléculas da Química (visualizador 3D e construtor VSEPR). Uso: node tests/tmoleculas.js
const { chromium } = require('playwright'); const path = require('path');
const RAIZ = 'file://' + path.resolve(__dirname, '..', 'index.html');
let falhas = 0; const ok = (c, m) => { console.log((c ? 'ok ' : 'FALHA ') + m); if (!c) falhas++; };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const erros = []; p.on('pageerror', (e) => erros.push(String(e)));
  await require('./adm')(p);
  // ----- o catálogo não é baixado enquanto ninguém abre o visualizador -----
  await p.goto(RAIZ + '#/quimica'); await p.waitForTimeout(1200);
  ok(await p.evaluate(() => !window.MOLECULAS && !document.querySelector('script[src*="moleculas-dados"]')), 'catálogo: não é carregado na página da Química (só quando o visualizador abre)');
  const abas = await p.evaluate(() => [...document.querySelectorAll('.topo .abas-materia .aba')].map((a) => a.textContent.trim()));
  ok(abas.join() === 'Química,Experimentos,Moléculas', 'aba Moléculas à direita de Experimentos → ' + abas.join(', '));
  await p.goto(RAIZ + '#/quimica-moleculas'); await p.waitForTimeout(1200);
  ok(await p.evaluate(() => /Moléculas em 3D/.test(document.querySelector('.hero2 h1').textContent) && !!document.querySelector('.hero2 svg[aria-label*="tetra"]') && !window.MOLECULAS), 'página da aba: título, desenho próprio, e o catálogo ainda não foi baixado');
  // ----- visualizador -----
  await p.goto(RAIZ + '#/quimica/MV01'); await p.waitForTimeout(2000);
  const ini = await p.evaluate(() => ({ n: window.MOLECULAS && window.MOLECULAS.lista.length, itens: document.querySelectorAll('.mv-it').length, ab: document.querySelector('#lab-moleculas').dataset.abertos, nota: document.querySelector('[data-v=nota]').textContent, pal: document.querySelector('.mv-palco').getBoundingClientRect(), dir: document.querySelector('.mv-dir').getBoundingClientRect() }));
  ok(ini.n === 36 && ini.itens === 36 && ini.ab === 'h2o', 'visualizador: 36 moléculas no catálogo e na lista; abre na água → ' + ini.n + ', ' + ini.itens + ', ' + ini.ab);
  ok(/só encontra moléculas deste catálogo/.test(ini.nota) && /não desenha molécula nova/.test(ini.nota), 'aviso escrito: a busca por SMILES só encontra moléculas do catálogo');
  ok(Math.abs(ini.pal.width - ini.pal.height) < 2 && ini.pal.width > 480 && ini.dir.left >= ini.pal.right && ini.dir.width > 250, 'desenho: quadrado grande (' + Math.round(ini.pal.width) + ' px) e painel de busca à direita (' + Math.round(ini.dir.width) + ' px)');
  const pintado = () => p.evaluate(() => { const c = document.querySelector('#lab-moleculas canvas'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4 * 50) if (d[i] > 0) n++; return n; });
  ok((await pintado()) > 50, 'o canvas tem desenho');
  // conferência dos dados: fórmula escrita × átomos das coordenadas, em todas
  const conf = await p.evaluate(() => { const ruins = []; window.MOLECULAS.lista.forEach((m) => { if (m.tipo === 'ionico') return; const d = {}; m.atomos.forEach((a) => (d[a[0]] = (d[a[0]] || 0) + 1)); const e = {}; m.formula.replace(/[\^].*$|[+-]$/, '').replace(/([A-Z][a-z]?)(\d*)/g, (_, x, n) => { e[x] = (e[x] || 0) + (+n || 1); }); const k = (o) => Object.keys(o).sort().map((x) => x + o[x]).join(''); const q = m.atomos.reduce((t, a) => t + a[4], 0), qe = /\^(\d)([+-])$/.test(m.formula) ? +RegExp.$1 * (RegExp.$2 === '+' ? 1 : -1) : /\+$/.test(m.formula) ? 1 : /-$/.test(m.formula) ? -1 : 0; if (k(d) !== k(e) || q !== qe) ruins.push(m.id); }); return ruins; });
  ok(conf.length === 0, 'dados: em todas as moléculas, os átomos e a carga das coordenadas batem com a fórmula escrita' + (conf.length ? ' → ' + conf.join(',') : ''));
  // busca
  const busca = (t) => p.evaluate((t) => SIM.qMolBusca(window.MOLECULAS.lista, t).itens.map((x) => x.m.id + ':' + x.como), t);
  const casos = [['agua', 'h2o'], ['ÁGUA', 'h2o'], ['h2o', 'h2o'], ['H₂O', 'h2o'], ['OH2', 'h2o'], ['water', 'h2o'], ['cafeina', 'cafeina'], ['caffeine', 'cafeina'], ['CCO', 'etanol'], ['c1ccccc1', 'c6h6'], ['nh4+', 'nh4'], ['CO3^2-', 'co3'], ['acido sulfurico', 'h2so4'], ['benzno', 'c6h6'], ['NaCl', 'nacl']];
  for (const [t, id] of casos) { const r = await busca(t); ok(r.length >= 1 && r[0].split(':')[0] === id, 'busca "' + t + '" → ' + (r.slice(0, 3).join(', ') || 'nada')); }
  { const r = await busca('etanl'); ok(r.length === 2 && r.some((x) => x.startsWith('etanol:')) && r.some((x) => x.startsWith('c2h6:')), 'busca "etanl" (erro de digitação): oferece etanol e etano → ' + r.join(', ')); }
  ok((await busca('C1CCCCC1')).length === 0 && (await busca('xyzzy')).length === 0, 'busca: SMILES de fora do catálogo (ciclo-hexano) e texto sem sentido não acham nada');
  await p.fill('#mv-q', 'C2H6O'); await p.waitForTimeout(300);
  const iso = await p.evaluate(() => ({ ab: document.querySelector('#lab-moleculas').dataset.abertos, txt: document.querySelector('[data-v=achou]').textContent, fichas: document.querySelectorAll('.mv-fc').length, n: SIM.qMoleculas._ult.pal.estado().n }));
  ok(iso.ab === 'etanol,eterdim' && /2 isômeros/.test(iso.txt) && iso.fichas === 2 && iso.n === 2, 'fórmula com isômeros: C2H6O abre etanol e éter dimetílico lado a lado, com o aviso → ' + iso.txt.slice(0, 60));
  await p.fill('#mv-q', 'c4h8'); await p.waitForTimeout(300); ok((await p.evaluate(() => document.querySelector('#lab-moleculas').dataset.abertos)) === 'cisbut,transbut', 'C4H8: cis e trans-but-2-eno lado a lado');
  await p.fill('#mv-q', 'glicose'); await p.waitForTimeout(300); ok((await p.evaluate(() => document.querySelector('#lab-moleculas').dataset.abertos)) === 'glicose', 'um resultado só: abre direto');
  // botões
  const vis = () => p.evaluate(() => { SIM.qMoleculas._ult.pal.pintaJa(); return SIM.qMoleculas._ult.pal.estado().atomos[0]; });
  const todos = await vis(); await p.click('#lab-moleculas [data-b=h]'); const semH = await vis(); await p.click('#lab-moleculas [data-b=h]');
  ok(todos === 24 && semH === 12, 'hidrogênios: glicose com 24 átomos, 12 sem os H → ' + todos + ', ' + semH);
  await p.click('#lab-moleculas [data-b=e]'); const esq = await vis(); await p.click('#lab-moleculas [data-b=e]'); ok(esq === 17, 'só o esqueleto: somem os 7 H presos a carbono, ficam os 5 dos OH → ' + esq);
  const lp = await p.evaluate(() => { const o = {}; ['h2o', 'nh3', 'ch4', 'co2', 'sf4', 'clf3', 'xef2', 'xef4', 'no3', 'etanol', 'hcl', 'n2', 'o3', 'so2'].forEach((id) => (o[id] = SIM.qMolPares(window.MOLECULAS.lista.find((m) => m.id === id)))); return o; });
  ok(lp.h2o === 2 && lp.nh3 === 1 && lp.ch4 === 0 && lp.co2 === 4 && lp.sf4 === 13 && lp.clf3 === 11 && lp.xef2 === 9 && lp.xef4 === 14 && lp.no3 === 8 && lp.etanol === 2 && lp.hcl === 3 && lp.n2 === 2 && lp.o3 === 6 && lp.so2 === 5, 'pares isolados (contagem de Lewis): H₂O 2, NH₃ 1, CH₄ 0, CO₂ 4, SF₄ 13, ClF₃ 11, XeF₂ 9, XeF₄ 14, NO₃⁻ 8, O₃ 6, SO₂ 5 → ' + JSON.stringify(lp));
  await p.fill('#mv-q', 'agua'); await p.waitForTimeout(300);
  const fa = await p.evaluate(() => document.querySelector('.mv-fc').textContent.replace(/\s+/g, ' '));
  ok(/ângulo no modelo\s*104,0°/.test(fa) && /ângulo de livro\s*104,5°/.test(fa) && /NIST/.test(fa) && /modelo é aproximação/.test(fa) && /water/.test(fa) && /SMILES/.test(fa) && /usos/.test(fa), 'ficha da água: ângulo do modelo (104,0°) ao lado do de livro (104,5°, com a fonte), nome em inglês, SMILES, usos');
  await p.click('#lab-moleculas [data-b=a]'); ok((await p.evaluate(() => SIM.qMoleculas._ult.estado().angs[0])) === 0, 'ângulos de ligação: começa no átomo central (o oxigênio)'); await p.click('#lab-moleculas [data-b=a]');
  // arrastar gira; rodinha aproxima
  await p.click('#lab-moleculas [data-b=g]'); const c = await p.locator('#lab-moleculas canvas').boundingBox(); const R1 = await p.evaluate(() => JSON.stringify(SIM.qMoleculas._ult.pal.estado().R));
  await p.mouse.move(c.x + 200, c.y + 250); await p.mouse.down(); await p.mouse.move(c.x + 320, c.y + 290, { steps: 6 }); await p.mouse.up();
  const R2 = await p.evaluate(() => JSON.stringify(SIM.qMoleculas._ult.pal.estado().R)); await p.mouse.wheel(0, -300); await p.waitForTimeout(100);
  ok(R1 !== R2 && (await p.evaluate(() => SIM.qMoleculas._ult.pal.estado().zoom)) > 1, 'mouse: arrastar gira e a rodinha aproxima');
  // composto iônico
  await p.fill('#mv-q', 'sal de cozinha'); await p.waitForTimeout(200); await p.fill('#mv-q', 'cloreto de sodio'); await p.waitForTimeout(300);
  const ion = await p.evaluate(() => ({ n: SIM.qMoleculas._ult.pal.estado().atomos, txt: document.querySelector('.mv-aviso').textContent, off: ['h', 'e', 'p', 'a'].every((k) => document.querySelector('#lab-moleculas [data-b=' + k + ']').disabled) }));
  ok(ion.n.join() === '2,27' && /no sólido é uma rede, não uma molécula/.test(ion.txt) && /EQ18/.test(ion.txt) && ion.off, 'NaCl: 2 íons separados + pedaço do retículo com 27 íons, aviso "é uma rede, não uma molécula", menção ao EQ18, botões de molécula desligados');
  // ----- construtor -----
  await p.goto(RAIZ + '#/quimica/MV02'); await p.waitForTimeout(2000);
  const mu = (c, l, e) => p.evaluate(([c, l, e]) => { SIM.qVsepr3d._ult.poe(c, l, e); const el = document.querySelector('#lab-vsepr3d'); return el.dataset.geo + '|' + el.dataset.mu; }, [c, l, e]);
  const esperado = [['C', ['H', 'H', 'H', 'H'], 0, 'tetraédrica', 0], ['C', ['Cl', 'Cl', 'Cl', 'Cl'], 0, 'tetraédrica', 0], ['C', ['Cl', 'H', 'H', 'H'], 0, 'tetraédrica', 0.96], ['C', ['Cl', 'Cl', 'H', 'H'], 0, 'tetraédrica', 1.109], ['O', ['H', 'H'], 2, 'angular', 1.432], ['N', ['H', 'H', 'H'], 1, 'piramidal', 0.84], ['C', ['O', 'O'], 0, 'linear', 0], ['B', ['F', 'F', 'F'], 0, 'trigonal plana', 0], ['S', ['F', 'F', 'F', 'F'], 1, 'gangorra', 1.4], ['Cl', ['F', 'F', 'F'], 2, 'forma de T', 0.82], ['Xe', ['F', 'F'], 3, 'linear', 0], ['Xe', ['F', 'F', 'F', 'F'], 2, 'quadrada plana', 0], ['S', ['F', 'F', 'F', 'F', 'F', 'F'], 0, 'octaédrica', 0], ['P', ['Cl', 'Cl', 'Cl', 'Cl', 'Cl'], 0, 'bipirâmide trigonal', 0]];
  let ruim = []; for (const [c2, l, e, g, m] of esperado) { const r = (await mu(c2, l, e)).split('|'); if (r[0] !== g || Math.abs(+r[1] - m) > 0.002) ruim.push(c2 + l.join('') + ' → ' + r.join(' ')); }
  ok(ruim.length === 0, 'construtor: geometria e soma dos dipolos de 14 espécies iguais às do Python (tools/moleculas/confere.py)' + (ruim.length ? ' → ' + ruim.join('; ') : ''));
  await mu('C', ['H', 'H', 'H', 'H'], 0); await p.selectOption('#lab-vsepr3d select[data-k="0"]', 'Cl');
  ok(/polar/.test(await p.evaluate(() => document.querySelector('#lab-vsepr3d [data-v=lt]').textContent)) && (await p.evaluate(() => document.querySelector('#lab-vsepr3d').dataset.mu)) === '0.960', 'construtor: trocar um H do CH₄ por Cl faz a seta aparecer (0,96) e o leitor dizer "polar"');
  await p.click('#lab-vsepr3d [data-x="6"]'); ok(await p.evaluate(() => [1, 2, 3].every((n) => document.querySelector('#lab-vsepr3d [data-e="' + n + '"]').disabled) && !document.querySelector('#lab-vsepr3d [data-e="0"]').disabled && document.querySelectorAll('#lab-vsepr3d select[data-k]').length === 6), 'construtor: com 6 átomos ligados, os pares isolados ficam desligados (passaria de 6 regiões) e aparecem 6 seletores');
  // ----- desempenho: cafeína girando -----
  await p.goto(RAIZ + '#/quimica/MV01'); await p.waitForTimeout(1500); await p.fill('#mv-q', 'cafeina'); await p.waitForTimeout(300); await p.click('#lab-moleculas [data-b=p]');
  const fps = await p.evaluate(() => new Promise((fim) => { let n = 0; const t0 = performance.now(); const q = (t) => { n++; t - t0 < 1500 ? requestAnimationFrame(q) : fim(Math.round((n * 1000) / (t - t0))); }; requestAnimationFrame(q); }));
  ok(fps >= 40, 'desempenho: cafeína (24 átomos) girando com os pares isolados → ' + fps + ' quadros por segundo');
  // ----- acesso: segue a Química -----
  const v = await b.newPage({ viewport: { width: 1280, height: 900 } }); await v.goto(RAIZ + '#/quimica/MV01'); await v.waitForTimeout(1500);
  ok(await v.evaluate(() => !document.querySelector('#lab-moleculas') && !window.MOLECULAS), 'visitante (sem código): não vê o visualizador e o catálogo não é baixado'); await v.close();
  ok(erros.length === 0, 'sem erros de JS' + (erros.length ? ' → ' + erros.slice(0, 3).join(' | ') : ''));
  console.log('FALHAS (' + falhas + '):'); await b.close(); process.exit(falhas ? 1 : 0);
})();
