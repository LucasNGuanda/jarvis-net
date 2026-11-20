// EF04: semicírculo das médias e retângulo de soma fixa.
module.exports = async (p, ok) => {
  const m = await p.evaluate(() => { const u = SIM.arMedias._ult, ruins = []; let n = 0;
    for (let a = 1; a <= 20; a++) for (let b = 1; b <= 20; b++) { u.poe({ a, b }); const e = u.est(); n++;
      /* contas à parte, sem raiz: comparar quadrados */
      if (Math.abs(e.ma * 2 - (a + b)) > 1e-9 || Math.abs(e.mg * e.mg - a * b) > 1e-7 || Math.abs(e.mh * (a + b) - 2 * a * b) > 1e-7 || Math.abs(e.mq * e.mq * 2 - (a * a + b * b)) > 1e-7) ruins.push('valor ' + a + ',' + b);
      const ordem = e.mh <= e.mg + 1e-12 && e.mg <= e.ma + 1e-12 && e.ma <= e.mq + 1e-12, empate = Math.abs(e.mh - e.mq) < 1e-9; if (!ordem || empate !== (a === b) || e.iguais !== (a === b)) ruins.push('ordem ' + a + ',' + b); }
    /* a figura: a altura desenhada e o raio desenhado têm a razão geométrica ÷ aritmética */
    const medeFig = (a, b) => { u.poe({ a, b }); const ls = [...document.querySelectorAll('#lab-med svg line')].map((l) => Math.abs(+l.getAttribute('y2') - +l.getAttribute('y1'))).filter((h) => h > 1); return ls[0] / ls[1]; };
    const r1 = medeFig(4, 16), r2 = medeFig(5, 5), r3 = medeFig(1, 20);
    u.poe({ a: 4, b: 16 }); const e = u.est(), st = document.querySelector('#lab-med .status').textContent; u.poe({ a: 7, b: 7 }); const sti = document.querySelector('#lab-med .status').textContent; u.poe({ a: 4, b: 16 });
    return { ruins, n, e: [e.mh, e.mg, e.ma, e.mq.toFixed(3)].join('|'), r1, r2, r3, st, sti }; });
  ok(m.ruins.length === 0 && m.e === '6.4|8|10|11.662' && Math.abs(m.r1 - 0.8) < 1e-6 && Math.abs(m.r2 - 1) < 1e-6 && Math.abs(m.r3 - Math.sqrt(20) / 10.5) < 1e-6 && /harmônica < geométrica < aritmética < quadrática/.test(m.st) && /coincidem/.test(m.sti), `laboratório do semicírculo: nos ${m.n} pares (1 a 20) as quatro médias conferem com contas feitas à parte, estão sempre na ordem harmônica ≤ geométrica ≤ aritmética ≤ quadrática e só empatam quando a = b; 4 e 16: 6,4, 8, 10 e 11,662; no desenho, altura ÷ raio = geométrica ÷ aritmética (0,8 para 4 e 16; 1 para 5 e 5)` + (m.ruins.length ? ' → ' + m.ruins.slice(0, 4).join('; ') : ''));
  const s = await p.evaluate(() => { const u = SIM.arSomaFixa._ult, ruins = []; let n = 0;
    for (let S = 4; S <= 40; S++) { let melhor = -1, onde = []; for (let x = 1; x < S; x++) { u.poe({ S, x }); const e = u.est(); n++; if (e.x !== x || e.y !== S - x || e.area !== x * (S - x) || Math.abs(e.area + e.falta - e.maxima) > 1e-9 || e.area > e.maxima + 1e-9 || e.perimetro !== 2 * S || e.quadrado !== (2 * x === S)) ruins.push(S + ',' + x); if (e.area > melhor) { melhor = e.area; onde = [x]; } else if (e.area === melhor) onde.push(x); }
      /* a maior área inteira fica no lado mais próximo de S/2 */
      if (!onde.every((x) => Math.abs(x - S / 2) <= 0.5)) ruins.push('máximo ' + S); }
    u.poe({ S: 20, x: 3 }); const e = u.est(), st = document.querySelector('#lab-som .status').textContent, rets = document.querySelectorAll('#lab-som svg rect').length; u.poe({ x: 10 }); const q = u.est(), stq = document.querySelector('#lab-som .status').textContent; u.poe({ S: 6, x: 30 }); const c = u.est(); u.poe({ S: 20, x: 4 });
    return { ruins, n, e: [e.area, e.maxima, e.falta].join('|'), st, rets, q: q.quadrado + '|' + q.area, stq, c: c.x + '|' + c.y }; });
  ok(s.ruins.length === 0 && s.e === '51|100|49' && /Faltam 49/.test(s.st) && s.rets === 2 && s.q === 'true|100' && /é o quadrado/.test(s.stq) && s.c === '5|1', `laboratório da soma fixa: nas ${s.n} combinações (soma de 4 a 40) a área é o produto dos lados, nunca passa de S²/4, e a diferença é exatamente (S/2 − largura)²; a maior área fica sempre no lado mais próximo de S/2; soma 20 e largura 3: área 51, faltam 49; largura 10: o quadrado, área 100; a largura nunca passa da soma (soma 6, pedido 30 → 5 por 1)` + (s.ruins.length ? ' → ' + s.ruins.slice(0, 4).join('; ') : ''));
  const n = await p.evaluate(() => { const Z = SIM.ar, a = Z.medias([2, 4, 8]), b = Z.medias([1, 2, 4, 8]), c = Z.medias([40, 60]); return { a: [a.ma.toFixed(3), a.mg.toFixed(6)].join('|'), b: [b.ma, b.mg.toFixed(3)].join('|'), c: c.mh.toFixed(6) }; });
  ok(n.a === '4.667|4.000000' && n.b === '3.75|2.828' && n.c === '48.000000', 'núcleo: 2, 4, 8 tem média aritmética 4,667 e geométrica 4; 1, 2, 4, 8: 3,75 e 2,828; harmônica de 40 e 60: 48');
};
