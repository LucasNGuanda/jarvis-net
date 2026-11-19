/* Matemática · módulo AL (Álgebra): laboratórios das progressões, SPG01 a SPG03.
   Acrescenta a SIM.al: barras (gráfico de barras de uma sequência, com rótulos) e pa/pg (termos de uma progressão).
   SPG01: SIM.alPA (a PA em degraus) e SIM.alEscadas (somar de trás para a frente: duas escadas fazem um retângulo).
   Contas conferidas em Python (tools/matematica/confere-al.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, { vis, rng, mn } = A;
  A.pa = (a1, r, n) => Array.from({ length: n }, (_, k) => a1 + k * r);
  A.pg = (a1, q, n) => Array.from({ length: n }, (_, k) => a1 * q ** k);
  /* barras de uma sequência. o = { h, rot (mostra o valor em cima), idx (mostra o índice embaixo), cor(k), max, interroga: [índices trocados por "?"] } */
  A.barras = (vals, D, o = {}) => { const W = 560, H = o.h || 190, n = vals.length, mx = 30, y0 = H - 26, lo = Math.min(0, ...vals), hi = Math.max(o.max || 0, ...vals, 1), esc = (y0 - 22) / (hi - lo), w = Math.min(46, (W - 2 * mx) / n), x0 = (W - w * n) / 2, zero = y0 + lo * esc; let s = `<line x1="${x0 - 8}" y1="${zero}" x2="${x0 + w * n + 8}" y2="${zero}" style="stroke:var(--ink3);stroke-width:1.2"/>`;
    vals.forEach((v, k) => { const q2 = (o.interroga || []).includes(k), h = Math.abs(v) * esc, y = v >= 0 ? zero - h : zero; s += `<rect x="${(x0 + k * w + 3).toFixed(1)}" y="${y.toFixed(1)}" width="${(w - 6).toFixed(1)}" height="${Math.max(h, 1).toFixed(1)}" rx="3" style="fill:${q2 ? "var(--ink3)" : o.cor ? o.cor(k) : "var(--mod)"};opacity:${q2 ? 0.35 : 0.82}"/>` + (o.rot === false ? "" : A.T(x0 + k * w + w / 2, (v >= 0 ? y - 5 : y + h + 13).toFixed(1), q2 ? "?" : mn(+(+v).toFixed(2)), { f: w < 30 ? 10 : 12, w: 600 })) + (o.idx === false ? "" : A.T(x0 + k * w + w / 2, H - 8, k + 1, { f: 10, c: "var(--ink3)" })); });
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px">${s}</svg>`; };

  /* ---------- SPG01 ---------- */
  /* nome: "A PA em degraus: primeiro termo e razão" · matéria: Matemática · tema: SPG01 */
  SIM.alPA = (el, F) => { let a1 = 2, r = 3, n = 8;
    const sl = (k, t, lo, hi, v) => `<label style="font-size:13px;color:var(--ink2)">${t} <input type="range" data-v="${k}" min="${lo}" max="${hi}" step="1" value="${v}" style="vertical-align:middle;width:130px"> <b data-r="${k}" style="color:var(--ink);display:inline-block;width:26px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("a", "a₁", -10, 10, 2)}${sl("r", "razão r", -5, 5, 3)}${sl("n", "n", 2, 12, 8)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const t = A.pa(a1, r, n); return { a1, r, n, termos: t, an: t[n - 1], soma: t.reduce((x, y) => x + y, 0), formula: (n * (a1 + t[n - 1])) / 2, tipo: r > 0 ? "crescente" : r < 0 ? "decrescente" : "constante" }; };
    const poe = (o) => { ({ a1, r, n } = { a1, r, n, ...o }); a1 = Math.max(-10, Math.min(10, Math.round(+a1))); r = Math.max(-5, Math.min(5, Math.round(+r))); n = Math.max(2, Math.min(12, Math.round(+n))); desenha(); };
    const desenha = () => { const e = est(); q("[data-v=a]").value = String(a1); q("[data-v=r]").value = String(r); q("[data-v=n]").value = String(n); q("[data-r=a]").textContent = mn(a1); q("[data-r=r]").textContent = mn(r); q("[data-r=n]").textContent = n;
      q("[data-v=pal]").innerHTML = A.barras(e.termos, null, { h: 220 });
      q("[data-v=lt]").innerHTML = vis("último termo", mn(e.an)) + vis("soma dos " + n, mn(e.soma)) + vis("é", e.tipo);
      q("[data-v=st]").innerHTML = `Cada barra é a anterior mais ${r < 0 ? "(" + mn(r) + ")" : r}: os topos ficam em linha reta, porque uma PA é uma função afim olhada só nos inteiros. Para chegar ao ${n}º termo dão-se ${n - 1} passos (não ${n}): aₙ = ${mn(a1)} + ${n - 1} · ${r < 0 ? "(" + mn(r) + ")" : r} = ${mn(e.an)}. Soma: ${n} · (${mn(a1)} + ${e.an < 0 ? "(" + mn(e.an) + ")" : e.an}) ÷ 2 = ${mn(e.formula)}.`; };
    ["a", "r", "n"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [{ a: "a1", r: "r", n: "n" }[k]]: ev.target.value })));
    SIM.alPA._ult = { poe, est }; desenha(); };

  /* nome: "Some de trás para a frente: duas escadas fazem um retângulo" · matéria: Matemática · tema: SPG01 */
  SIM.alEscadas = (el, F) => { let n = 6, dupla = false;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">n <input type="range" data-v="n" min="2" max="14" step="1" value="6" style="vertical-align:middle;width:200px"> <b data-r="n" style="color:var(--ink)"></b></label><button class="bt peq" data-v="d">encaixar a segunda escada</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => ({ n, dupla, soma: (n * (n + 1)) / 2, direta: Array.from({ length: n }, (_, k) => k + 1).reduce((x, y) => x + y, 0), retangulo: n * (n + 1) });
    const poe = (o) => { ({ n, dupla } = { n, dupla, ...o }); n = Math.max(2, Math.min(14, Math.round(+n))); dupla = !!dupla; desenha(); };
    const desenha = () => { const e = est(), u = Math.min(22, 300 / (n + 1)), x0 = 280 - (n * u) / 2, y0 = 14 + (n + 1) * u; q("[data-v=n]").value = String(n); q("[data-r=n]").textContent = n; q("[data-v=d]").textContent = dupla ? "tirar a segunda escada" : "encaixar a segunda escada"; let s = "";
      for (let c = 0; c < n; c++) for (let l = 0; l <= n; l++) { const baixo = l < c + 1; if (!baixo && !dupla) continue; s += `<rect x="${(x0 + c * u + 1).toFixed(1)}" y="${(y0 - (l + 1) * u + 1).toFixed(1)}" width="${(u - 2).toFixed(1)}" height="${(u - 2).toFixed(1)}" rx="2" style="fill:${baixo ? "var(--mod)" : "var(--ok)"};opacity:.82"/>`; }
      s += A.T(280, y0 + 16, dupla ? `${n} colunas, todas com ${n + 1} quadradinhos` : `colunas de 1, 2, 3, ..., ${n} quadradinhos`, { f: 12, c: "var(--ink2)" });
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 ${y0 + 24}" width="100%" style="max-width:560px">${s}</svg>`;
      q("[data-v=lt]").innerHTML = vis(`1 + 2 + ... + ${n}`, dupla ? e.soma : "?") + vis("retângulo", dupla ? `${n} × ${n + 1} = ${e.retangulo}` : "?");
      q("[data-v=st]").innerHTML = dupla ? `A escada verde é a mesma soma escrita ao contrário: ${n} + ... + 2 + 1. Encaixadas, as duas formam um retângulo de ${n} por ${n + 1}, com ${e.retangulo} quadradinhos. A soma é a metade: ${e.soma}. Cada coluna tem "um termo do começo mais um termo do fim", e essa soma é sempre a mesma.` : `A escada roxa tem 1 + 2 + ... + ${n} quadradinhos. Somar um por um dá trabalho. Antes de clicar: o que acontece se uma cópia da escada, de cabeça para baixo, for encaixada em cima dela?`; };
    q("[data-v=n]").addEventListener("input", (ev) => poe({ n: ev.target.value, dupla: false })); q("[data-v=d]").addEventListener("click", () => poe({ dupla: !dupla }));
    SIM.alEscadas._ult = { poe, est }; desenha(); };
})();
