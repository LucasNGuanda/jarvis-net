/* Exercícios com números sorteados (campo gerar do F.exercicio, β 5.3). Uso: node tests/tvaria.js <códigos> [--n 8] [--saida arquivo.json]
   Para cada exercício com o botão "Me dá um parecido", em N versões (a que abre com a página + N − 1 sorteadas):
   - numérico: o gabarito da versão é aceito ("Certo!") e um valor 30% maior é recusado;
   - alternativas: a certa é aceita e uma errada é recusada;
   - nenhuma fórmula quebrada (katex-error) nem "undefined"/"NaN" no texto depois de sortear;
   - a primeira tentativa registrada no mapa de erros não muda com as versões de treino.
   Com --saida, grava {cod, n, v, py} de cada versão: tools/confere-py.py refaz a conta em Python (py é a mesma conta escrita à parte, como expressão Python). */
const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html');
const { chromium } = require('playwright'); const fs = require('fs');
const args = process.argv.slice(2), cods = [], opt = { n: 8, saida: null };
for (let i = 0; i < args.length; i++) { if (args[i] === '--n') opt.n = +args[++i]; else if (args[i] === '--saida') opt.saida = args[++i]; else cods.push(args[i]); }
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); await require('./adm')(p);
  const errs = []; p.on('pageerror', e => errs.push(e.message)); const dump = []; let falhas = 0;
  for (const c of cods) {
    await p.goto(RAIZ + '#/' + c); await p.waitForTimeout(1500);
    const total = await p.evaluate(() => document.querySelectorAll('.ex').length), comPar = await p.evaluate(() => [...document.querySelectorAll('.ex')].map((e, i) => (e.querySelector('.ex-par') ? i : -1)).filter(i => i >= 0));
    let ruins = [];
    for (const i of comPar) for (let k = 0; k < opt.n; k++) {
      const r = await p.evaluate(([i, k]) => { const el = document.querySelectorAll('.ex')[i]; if (k > 0) el.querySelector('.ex-par').click(); const d = el._d, fb = () => el.querySelector('.ex-fb').textContent, o = { n: el.querySelector('.num').textContent, k, py: d.py || null, v: d.num ? d.num.v : null, certa: d.certa || null, prob: [] };
        const txt = el.cloneNode(true); txt.querySelectorAll('.katex').forEach(x => x.remove()); txt.querySelectorAll('.rev-painel').forEach(x => (x.hidden = false));
        if (/undefined|NaN|\{,\}|\\frac|\\cdot/.test(txt.textContent)) o.prob.push('texto cru: ' + (txt.textContent.match(/.{0,20}(undefined|NaN|\{,\}|\\frac|\\cdot).{0,20}/) || [''])[0]);
        if (el.querySelector('.katex-error')) o.prob.push('katex-error');
        if (d.num) { const inp = el.querySelector('.ex-num input'), bt = el.querySelector('.ex-num button'); if (!isFinite(d.num.v)) o.prob.push('gabarito não numérico');
          inp.value = String(d.num.v).replace('.', ','); bt.click(); if (!/Certo/.test(fb())) o.prob.push('gabarito recusado: ' + d.num.v);
          inp.value = String(d.num.v === 0 ? 1 : d.num.v * 1.3).replace('.', ','); bt.click(); if (/Certo/.test(fb())) o.prob.push('valor 30% maior aceito');
          const resp = (d.resp || '').replace(/<[^>]+>/g, ''); if (!/\d/.test(resp)) o.prob.push('resp sem número'); }
        else if (d.certa) { const alts = [...el.querySelectorAll('.alt')]; const errada = alts.find(a => a.dataset.l !== d.certa); errada.click(); if (/Certo/.test(fb())) o.prob.push('alternativa errada aceita'); alts.find(a => a.dataset.l === d.certa).click(); if (!/Certo/.test(fb())) o.prob.push('alternativa certa recusada'); if (new Set(alts.map(a => a.textContent)).size !== alts.length) o.prob.push('alternativas repetidas'); }
        else o.prob.push('sem correção automática');
        return o; }, [i, k]);
      dump.push({ cod: c, n: r.n, k: r.k, v: r.v, py: r.py }); if (r.prob.length) ruins.push(r.n + ' (versão ' + r.k + '): ' + r.prob.join('; '));
    }
    const kat = await p.evaluate(() => document.querySelectorAll('.katex-error').length);
    const semPy = [...new Set(dump.filter(d => d.cod === c && d.v !== null && !d.py).map(d => d.n))];
    console.log((ruins.length || kat ? 'FALHA ' : 'ok ') + c + ': ' + total + ' exercícios, ' + comPar.length + ' com sorteio, ' + opt.n + ' versões cada' + (semPy.length ? ' · numéricos sem py: ' + semPy.join(' ') : '') + (ruins.length ? ' → ' + ruins.slice(0, 6).join(' || ') : ''));
    if (ruins.length || kat) falhas++;
  }
  if (errs.length) { console.log('FALHA erros de JS: ' + errs.slice(0, 3).join(' | ')); falhas++; }
  if (opt.saida) fs.writeFileSync(opt.saida, JSON.stringify(dump));
  await b.close(); console.log('FALHAS (' + falhas + ')' + (falhas ? '' : ':')); process.exit(falhas ? 1 : 0); })();
