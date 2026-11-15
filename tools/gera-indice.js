/* Gera assets/indice-busca.js, o índice da busca do Jarvis (β 4.2), A PARTIR DOS PRÓPRIOS TEMAS: nada escrito à mão.
   Uso: node tools/gera-indice.js            (rodar depois de escrever ou mudar um tema; tests/tbusca.js acusa índice velho)
   Como funciona: abre o site no Chromium (Playwright), carrega cada tema escrito (pronto no catálogo), chama o html(F) dele
   SEM desenhar a página e tira daí: as seções (id + título + texto), as fórmulas (TeX) e os termos em negrito.
   Nomes de matérias, abas, módulos e temas (inclusive os "em breve") NÃO entram aqui: a busca lê direto dos catálogos.
   Cada tema guarda a impressão digital (h) do arquivo dele; o teste compara com o arquivo atual. */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const RAIZ = path.resolve(__dirname, '..');
const LIMITE = 20000; /* caracteres de texto por seção (β 4.2: medido, a maior seção tem ~9700; nenhuma é cortada) */
const impressao = (arq) => crypto.createHash('sha1').update(fs.readFileSync(path.join(RAIZ, arq))).digest('hex').slice(0, 12);
module.exports.impressao = impressao;

async function gera({ quieto } = {}) {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.addInitScript(() => document.addEventListener('readystatechange', () => { if (document.readyState === 'interactive') try { localStorage.setItem('jarvis:acesso', JSON.stringify({ chaves: ['adm'] })); } catch (e) {} }, { once: true }));
  const erros = []; p.on('pageerror', (e) => erros.push(e.message));
  await p.goto('file://' + path.join(RAIZ, 'index.html') + '#/home'); await p.waitForTimeout(600);
  const lista = await p.evaluate(() => { const r = []; for (const m of window.CATALOGO) for (const t of m.temas) if (t[3]) { const area = window.AREAS.find((a) => a.id === m.area), mat = (area && area.materia) || 'fisica'; r.push({ cod: t[0], mat, area: m.area, chave: mat === 'fisica' ? t[0] : mat + '/' + t[0], arq: mat === 'fisica' ? `temas/${t[0]}.js` : `temas/${mat}/${t[0]}.js` }); } return r; });
  const temas = {};
  for (const t of lista) {
    if (!fs.existsSync(path.join(RAIZ, t.arq))) { console.log('sem arquivo: ' + t.arq); continue; }
    const r = await p.evaluate(async (t) => {
      const F = window.F;
      if (!(F.temas && F.temas[t.chave])) await new Promise((ok, erro) => { const s = document.createElement('script'); s.src = t.arq; s.onload = ok; s.onerror = () => erro(new Error('não carregou ' + t.arq)); document.body.appendChild(s); });
      F.area = t.area; /* como na página de verdade: links e prefixos da matéria certa */
      const html = F.temas[t.chave].html(F);
      const doc = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html');
      const GREGO = { alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', Delta: 'Δ', epsilon: 'ε', varepsilon: 'ε', theta: 'θ', lambda: 'λ', mu: 'μ', nu: 'ν', pi: 'π', rho: 'ρ', sigma: 'σ', Sigma: 'Σ', tau: 'τ', phi: 'φ', varphi: 'φ', omega: 'ω', Omega: 'Ω', cdot: '·', times: '×', approx: '≈', le: '≤', ge: '≥', leq: '≤', geq: '≥', neq: '≠', infty: '∞', to: '→', int: '∫', sum: 'Σ', partial: '∂', nabla: '∇', sqrt: '√', pm: '±', degree: '°', circ: '°' };
      const leTex = (tx) => tx.replace(/\\(?:text|mathrm|mathbf|operatorname|ce)\{([^{}]*)\}/g, '$1').replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2').replace(/\\([A-Za-z]+)/g, (m0, n) => GREGO[n] || (/^(left|right|big|Big|bigl|bigr|Bigl|Bigr|bigg|Bigg|biggl|biggr|middle|quad|qquad|displaystyle|limits|,|;)$/.test(n) ? '' : n)).replace(/\\[,;!: ]/g, ' ').replace(/[{}]/g, '').replace(/\{,\}/g, ',').replace(/\s+/g, ' ').trim();
      const formulas = [];
      doc.querySelectorAll('.rev-painel .formula, .chute .exp .formula').forEach((f) => f.remove());
      doc.querySelectorAll('.formula').forEach((f) => { const m = f.textContent.match(/\$\$([\s\S]*?)\$\$/); if (m) formulas.push(m[1].trim()); f.remove(); });
      doc.querySelectorAll('svg, canvas, script, style, button, .rev-bt, .certeza, .rev-painel, .chute .exp').forEach((e) => e.remove()); /* dicas, resoluções e a explicação do chute ficam FORA: o trechinho da busca não pode entregar resposta */
      doc.querySelectorAll('p, div, li, h3, h4, h5, td, th, br, section, .caixa, .exemplo, .ex').forEach((e) => e.append(' ')); /* blocos não grudam no texto */
      const limpa = (s) => s.replace(/\$\$([\s\S]*?)\$\$|\$([^$]*)\$/g, (m0, a, c) => ' ' + leTex(a || c || '') + ' ').replace(/\s+/g, ' ').trim();
      const termos = [...new Set([...doc.querySelectorAll('b, strong, h3, h4, .caixa .tit')].map((e) => limpa(e.textContent)).filter((x) => x.length > 2 && x.length < 60))];
      const secoes = [...doc.querySelectorAll('section.secao')].map((s) => { const h2 = s.querySelector('h2'); const tit = h2 ? limpa([...h2.childNodes].filter((n) => !(n.classList && n.classList.contains('n'))).map((n) => n.textContent).join('')) : ''; if (h2) h2.remove(); return [s.id, tit, limpa(s.textContent).slice(0, t.limite)]; });
      return { secoes, formulas: [...new Set(formulas)].slice(0, 60), termos: termos.slice(0, 80) };
    }, { ...t, limite: LIMITE });
    temas[t.chave] = { h: impressao(t.arq), ...r };
  }
  await b.close();
  if (erros.length) console.log('erros JS ao gerar: ' + erros.join(' | '));
  return { temas, erros };
}
module.exports.gera = gera;

if (require.main === module) (async () => {
  const { temas, erros } = await gera();
  const saida = `/* GERADO por tools/gera-indice.js (β 4.2): NÃO EDITAR À MÃO. Rodar de novo depois de escrever ou mudar um tema.
   ${Object.keys(temas).length} temas escritos. As chaves são as de F.registrar; nomes e módulos vêm dos catálogos. */
window.INDICE_BUSCA = ${JSON.stringify({ versao: 1, temas })};
`;
  fs.writeFileSync(path.join(RAIZ, 'assets/indice-busca.js'), saida);
  const n = Object.values(temas).reduce((a, t) => a + t.secoes.length, 0);
  console.log(`índice: ${Object.keys(temas).length} temas, ${n} seções, ${(saida.length / 1024).toFixed(0)} KB${erros.length ? ', COM ERROS' : ''}`);
  if (erros.length) process.exitCode = 1;
})();
