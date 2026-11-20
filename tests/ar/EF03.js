// EF03: as sete medidas de uma lista e a tabela de frequências.
module.exports = async (p, ok) => {
  const d = await p.evaluate(() => { const u = SIM.arDados._ult, ruins = []; let n = 0, s = 7;
    const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let k = 0; k < 400; k++) { const v = Array.from({ length: 6 }, () => Math.floor(rnd() * 21)); u.poe({ v }); const e = u.est(); n++;
      /* conta à parte, com inteiros: tudo multiplicado por 6 ou por 36 */
      const S = v.reduce((a, b) => a + b, 0), o = v.slice().sort((a, b) => a - b), med2 = o[2] + o[3], sq = v.reduce((a, b) => a + b * b, 0), var36 = 6 * sq - S * S, dm36 = v.reduce((a, x) => a + Math.abs(6 * x - S), 0);
      const cont = {}; v.forEach((x) => (cont[x] = (cont[x] || 0) + 1)); const mx = Math.max(...Object.values(cont)), modas = mx === 1 ? [] : Object.keys(cont).filter((x) => cont[x] === mx).map(Number).sort((a, b) => a - b);
      if (Math.abs(e.media * 6 - S) > 1e-9 || Math.abs(e.mediana * 2 - med2) > 1e-9 || e.amp !== o[5] - o[0] || Math.abs(e.var * 36 - var36) > 1e-7 || Math.abs(e.dm * 36 - dm36) > 1e-7 || Math.abs(e.dp * e.dp - e.var) > 1e-9 || e.modas.join() !== modas.join() || Math.abs(e.desvios.reduce((a, b) => a + b, 0)) > 1e-9) ruins.push(v.join(' ')); }
    u.poe({ v: [2, 4, 4, 5, 7, 8] }); const e = u.est(), pts = document.querySelectorAll('#lab-dad svg circle').length;
    document.querySelector('#lab-dad [data-b=mais]').click(); const m = u.est(); document.querySelector('#lab-dad [data-b=zera]').click(); document.querySelector('#lab-dad [data-b=vezes]').click(); const x = u.est(); document.querySelector('#lab-dad [data-b=zera]').click();
    u.poe({ v: [1, 2, 3, 4, 5, 6] }); const semModa = u.est().modas.length, txt = document.querySelector('#lab-dad .leitor').textContent; u.poe({ v: [2, 4, 4, 5, 7, 8] });
    return { ruins, n, e: [e.media, e.mediana, e.modas.join(), e.amp, e.dm.toFixed(4), e.var, e.dp].join('|'), pts, m: [m.media, m.var].join('|'), x: [x.media, x.var, x.dp].join('|'), semModa, txt }; });
  ok(d.ruins.length === 0 && d.e === '5|4.5|4|6|1.6667|4|2' && d.pts === 6 && d.m === '8|4' && d.x === '10|16|4' && d.semModa === 0 && /não há/.test(d.txt), `laboratório dos seis números: em ${d.n} listas sorteadas com semente fixa, média, mediana, moda, amplitude, desvio médio e variância coincidem com a conta feita à parte só com inteiros, e os desvios somam zero; 2, 4, 4, 5, 7, 8: média 5, mediana 4,5, moda 4, amplitude 6, desvio médio 1,6667, variância 4, desvio padrão 2; somar 3: média 8 e variância 4; dobrar: média 10, variância 16, desvio padrão 4; sem repetição: "não há" moda` + (d.ruins.length ? ' → ' + d.ruins.slice(0, 3).join('; ') : ''));
  const f = await p.evaluate(() => { const u = SIM.arFreq._ult, xs = [4, 5, 6, 7, 8, 9], ruins = []; let n = 0, s = 11;
    const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let k = 0; k < 300; k++) { const fs = xs.map(() => Math.floor(rnd() * 13)); if (!fs.some(Boolean)) continue; u.poe({ fs }); const e = u.est(); n++;
      const N = fs.reduce((a, b) => a + b, 0), S = xs.reduce((a, x, i) => a + x * fs[i], 0), Q = xs.reduce((a, x, i) => a + x * x * fs[i], 0);
      /* variância pela definição (desvios), comparada com o atalho que o laboratório mostra */
      const def = xs.reduce((a, x, i) => a + fs[i] * (x - S / N) ** 2, 0) / N;
      if (e.n !== N || e.sxf !== S || Math.abs(e.media - S / N) > 1e-9 || Math.abs(e.var - def) > 1e-9 || Math.abs(e.atalho - def) > 1e-9 || Math.abs(e.atalho * N * N - (N * Q - S * S)) > 1e-6) ruins.push(fs.join(' ')); }
    u.poe({ fs: [1, 3, 6, 5, 3, 2] }); const e = u.est(), st = document.querySelector('#lab-fre .status').textContent; u.poe({ fs: [0, 0, 0, 0, 0, 0] }); const z = u.est(), stz = document.querySelector('#lab-fre .status').textContent; u.poe({ fs: [1, 3, 6, 5, 3, 2] });
    return { ruins, n, e: [e.n, e.sxf, e.media.toFixed(4), e.var.toFixed(4), e.mediana, e.modas.join()].join('|'), st, vazio: !!z.vazio, stz }; });
  ok(f.ruins.length === 0 && f.e === '20|132|6.6000|1.7400|6.5|6' && /não pelo número de linhas/.test(f.st) && f.vazio && /pelo menos um aluno/.test(f.stz), `laboratório da tabela de frequências: em ${f.n} tabelas sorteadas com semente fixa, número de alunos, soma, média e variância conferem, e o atalho (média dos quadrados − quadrado da média) dá o mesmo que a definição pelos desvios; frequências 1, 3, 6, 5, 3, 2: 20 alunos, soma 132, média 6,6, variância 1,74, mediana 6,5, moda 6; tabela vazia não quebra` + (f.ruins.length ? ' → ' + f.ruins.slice(0, 3).join('; ') : ''));
  const n = await p.evaluate(() => { const Z = SIM.ar, a = Z.est([2, 5, 7, 8, 8]), b = Z.est([3, 1, 2]), c = Z.estF([1, 2, 3], [2, 4, 2]), d = Z.est([1, 1, 2, 2, 3]); return { a: [a.media, a.mediana, a.modas.join(), a.amp].join('|'), b: [b.mediana, b.modas.length].join('|'), c: [c.n, c.media, c.var].join('|'), d: d.modas.join() }; });
  ok(n.a === '6|7|8|6' && n.b === '2|0' && n.c === '8|2|0.5' && n.d === '1,2', 'núcleo: 2, 5, 7, 8, 8 tem média 6, mediana 7, moda 8 e amplitude 6; a mediana ordena antes (3, 1, 2 → 2); tabela 1, 2, 3 com frequências 2, 4, 2: 8 dados, média 2, variância 0,5; 1, 1, 2, 2, 3 tem duas modas');
};
