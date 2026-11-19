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

  /* ---------- SPG02 ---------- */
  /* nome: "A PG: multiplicar sempre pela mesma razão" · matéria: Matemática · tema: SPG02 */
  SIM.alPG = (el, F) => { let a1 = 2, qq = 2, n = 6;
    const sl = (k, t, lo, hi, v, st) => `<label style="font-size:13px;color:var(--ink2)">${t} <input type="range" data-v="${k}" min="${lo}" max="${hi}" step="${st}" value="${v}" style="vertical-align:middle;width:130px"> <b data-r="${k}" style="color:var(--ink);display:inline-block;width:34px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("a", "a₁", 1, 8, 2, 1)}${sl("q", "razão q", -2, 3, 2, 0.25)}${sl("n", "n", 2, 10, 6, 1)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const t = A.pg(a1, qq, n), soma = t.reduce((x, y) => x + y, 0); return { a1, q: qq, n, termos: t, an: t[n - 1], soma, formula: qq === 1 ? a1 * n : (a1 * (qq ** n - 1)) / (qq - 1), tipo: qq > 1 ? "crescente" : qq === 1 ? "constante" : qq > 0 ? "decrescente" : qq === 0 ? "zera" : "alternada" }; };
    const poe = (o) => { ({ a1, q: qq, n } = { a1, q: qq, n, ...o }); a1 = Math.max(1, Math.min(8, Math.round(+a1))); qq = Math.max(-2, Math.min(3, Math.round(+qq * 4) / 4)); n = Math.max(2, Math.min(10, Math.round(+n))); desenha(); };
    const desenha = () => { const e = est(); q("[data-v=a]").value = String(a1); q("[data-v=q]").value = String(qq); q("[data-v=n]").value = String(n); q("[data-r=a]").textContent = a1; q("[data-r=q]").textContent = F.nt(qq, 2); q("[data-r=n]").textContent = n;
      q("[data-v=pal]").innerHTML = A.barras(e.termos.map((v) => +v.toFixed(2)), null, { h: 230 });
      q("[data-v=lt]").innerHTML = vis("último termo", F.nt(e.an, 3)) + vis("soma dos " + n, F.nt(e.soma, 3)) + vis("é", e.tipo);
      q("[data-v=st]").innerHTML = `Cada barra é a anterior <b>vezes</b> ${F.nt(qq, 2)}. ` + ({ crescente: "Razão maior que 1: cada passo aumenta mais que o anterior, e o último termo sozinho pesa mais do que parece na soma.", constante: "Razão 1: todos os termos são iguais.", decrescente: "Razão entre 0 e 1: os termos encolhem e nunca chegam a zero. A soma cresce cada vez menos: está se aproximando de um teto.", zera: "Razão 0: depois do primeiro, tudo zera.", alternada: "Razão negativa: os sinais se alternam, um para cima, um para baixo." })[e.tipo] + ` Uma PG é uma função exponencial olhada só nos inteiros.`; };
    ["a", "q", "n"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [{ a: "a1", q: "q", n: "n" }[k]]: ev.target.value })));
    SIM.alPG._ult = { poe, est }; desenha(); };

  /* nome: "A soma infinita que não passa do teto" · matéria: Matemática · tema: SPG02 */
  SIM.alSomaInfinita = (el, F) => { let qq = 0.5, n = 4;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">razão q <input type="range" data-v="q" min="0.1" max="0.9" step="0.1" value="0.5" style="vertical-align:middle;width:150px"> <b data-r="q" style="color:var(--ink);display:inline-block;width:30px"></b></label><label style="font-size:13px;color:var(--ink2)">parcelas somadas <input type="range" data-v="n" min="1" max="40" step="1" value="4" style="vertical-align:middle;width:200px"> <b data-r="n" style="color:var(--ink)"></b></label></div></div></div><div class="palco" data-v="pal" style="padding:8px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    /* primeiro termo 1: parcial = (1 − qⁿ)/(1 − q); teto = 1/(1 − q) */
    const est = () => { const parcial = (1 - qq ** n) / (1 - qq), teto = 1 / (1 - qq); return { q: qq, n, parcial, teto, falta: teto - parcial, direta: Array.from({ length: n }, (_, k) => qq ** k).reduce((x, y) => x + y, 0) }; };
    const poe = (o) => { ({ q: qq, n } = { q: qq, n, ...o }); qq = Math.max(0.1, Math.min(0.9, Math.round(+qq * 10) / 10)); n = Math.max(1, Math.min(40, Math.round(+n))); desenha(); };
    const desenha = () => { const e = est(), W = 480, X = (v) => 40 + (v / e.teto) * W; q("[data-v=q]").value = String(qq); q("[data-v=n]").value = String(n); q("[data-r=q]").textContent = F.nt(qq, 1); q("[data-r=n]").textContent = n;
      let s = `<rect x="40" y="26" width="${W}" height="34" rx="4" style="fill:none;stroke:var(--ink3);stroke-width:1.4"/>`, ac = 0; for (let k = 0; k < n; k++) { const v = qq ** k; if ((v / e.teto) * W > 0.4) s += `<rect x="${X(ac).toFixed(2)}" y="26" width="${((v / e.teto) * W).toFixed(2)}" height="34" style="fill:${A.COR[k % 4]};opacity:.82;stroke:var(--bg);stroke-width:1"/>`; ac += v; }
      s += `<line x1="${X(e.teto)}" y1="18" x2="${X(e.teto)}" y2="68" style="stroke:var(--warn);stroke-width:2.4"/>` + A.T(X(e.teto), 12, `teto: ${F.nt(e.teto, 4)}`, { f: 12, w: 600, a: "end" }) + A.T(40, 82, "0", { f: 11, c: "var(--ink2)" });
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 90" width="100%" style="max-width:560px">${s}</svg>`;
      q("[data-v=lt]").innerHTML = vis("soma de " + n + (n === 1 ? " parcela" : " parcelas"), F.nt(e.parcial, 6)) + vis("teto 1/(1 − q)", F.nt(e.teto, 6)) + vis("falta", e.falta < 1e-6 ? "menos de 0,000001" : F.nt(e.falta, 6));
      q("[data-v=st]").innerHTML = `A soma é 1 + ${F.nt(qq, 1)} + ${F.nt(qq * qq, 2)} + ${F.nt(qq ** 3, 3)} + ... Cada parcela nova tapa uma fração fixa do que <b>faltava</b> para o teto, e por isso a soma chega tão perto dele quanto se queira, sem nunca passar: depois de ${n} ${n === 1 ? "parcela" : "parcelas"} falta ${e.falta < 1e-6 ? "menos de 0,000001" : F.nt(e.falta, 6)}. É isso que significa dizer que a soma dos infinitos termos <b>é</b> ${F.nt(e.teto, 4)}.`; };
    ["q", "n"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.alSomaInfinita._ult = { poe, est }; desenha(); };

  /* ---------- SPG03 ---------- */
  A.medias = (a, b) => ({ ma: (a + b) / 2, mg: Math.sqrt(a * b), mh: (2 * a * b) / (a + b) });
  /* nome: "Os inversos em fila: da PA para a PH" · matéria: Matemática · tema: SPG03 */
  SIM.alPH = (el, F) => { let a = 2, d = 3, n = 6;
    const sl = (k, t, lo, hi, v) => `<label style="font-size:13px;color:var(--ink2)">${t} <input type="range" data-v="${k}" min="${lo}" max="${hi}" step="1" value="${v}" style="vertical-align:middle;width:130px"> <b data-r="${k}" style="color:var(--ink);display:inline-block;width:22px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("a", "1º termo da PA", 1, 6, 2)}${sl("d", "razão da PA", 1, 4, 3)}${sl("n", "n", 3, 8, 6)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const pa = A.pa(a, d, n); return { a, d, n, pa, ph: pa.map((v) => M.fr(1, v)), phTxt: pa.map((v) => (v === 1 ? "1" : `1/${v}`)), difs: pa.slice(1).map((v, k) => 1 / v - 1 / pa[k]) }; };
    const poe = (o) => { ({ a, d, n } = { a, d, n, ...o }); a = Math.max(1, Math.min(6, Math.round(+a))); d = Math.max(1, Math.min(4, Math.round(+d))); n = Math.max(3, Math.min(8, Math.round(+n))); desenha(); };
    const desenha = () => { const e = est(); ["a", "d", "n"].forEach((k) => { q(`[data-v=${k}]`).value = String({ a, d, n }[k]); q(`[data-r=${k}]`).textContent = { a, d, n }[k]; });
      q("[data-v=pal]").innerHTML = `<div style="font-size:12px;color:var(--ink2);text-align:center">PA (os inversos)</div>` + A.barras(e.pa, null, { h: 120, idx: false }) + `<div style="font-size:12px;color:var(--ink2);text-align:center">PH (os termos)</div>` + A.barras(e.pa.map((v) => 1 / v), null, { h: 120, rot: false, idx: false, cor: () => "var(--ok)" });
      q("[data-v=lt]").innerHTML = vis("PA", e.pa.join(", ")) + vis("PH", e.phTxt.join(", "));
      q("[data-v=st]").innerHTML = `Uma progressão harmônica é uma sequência cujos <b>inversos</b> formam uma PA. Na PA de cima, os degraus são iguais (${d}); na PH de baixo, <b>não</b>: as diferenças entre termos vizinhos vão encolhendo. Por isso nunca se trabalha direto na PH: inverte-se, resolve-se na PA e inverte-se de volta.`; };
    ["a", "d", "n"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.alPH._ult = { poe, est }; desenha(); };

  /* nome: "As três médias de dois números" · matéria: Matemática · tema: SPG03 */
  SIM.alMedias = (el, F) => { let a = 4, b = 16;
    const sl = (k, v) => `<label style="font-size:13px;color:var(--ink2)">${k} <input type="range" data-v="${k}" min="1" max="20" step="1" value="${v}" style="vertical-align:middle;width:200px"> <b data-r="${k}" style="color:var(--ink);display:inline-block;width:22px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("a", 4)}${sl("b", 16)}</div></div></div><div class="palco" data-v="pal" style="padding:8px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const m = A.medias(a, b); return { a, b, ...m, produto: m.ma * m.mh, mg2: m.mg * m.mg, ordem: m.mh <= m.mg + 1e-12 && m.mg <= m.ma + 1e-12 }; };
    const poe = (o) => { ({ a, b } = { a, b, ...o }); a = Math.max(1, Math.min(20, Math.round(+a))); b = Math.max(1, Math.min(20, Math.round(+b))); desenha(); };
    const desenha = () => { const e = est(), X = (v) => 40 + (v / 20) * 480; q("[data-v=a]").value = String(a); q("[data-v=b]").value = String(b); q("[data-r=a]").textContent = a; q("[data-r=b]").textContent = b;
      let s = `<line x1="40" y1="60" x2="520" y2="60" style="stroke:var(--ink3);stroke-width:1.4"/>`; for (let v = 0; v <= 20; v += 2) s += `<line x1="${X(v)}" y1="56" x2="${X(v)}" y2="64" style="stroke:var(--ink3)"/>` + A.T(X(v), 80, v, { f: 10, c: "var(--ink3)" });
      s += `<line x1="${X(Math.min(a, b))}" y1="60" x2="${X(Math.max(a, b))}" y2="60" style="stroke:var(--ink2);stroke-width:4"/>`;
      [[e.mh, "MH", A.COR[1], 22], [e.mg, "MG", A.COR[2], 36], [e.ma, "MA", A.COR[0], 22]].forEach(([v, t, c, y]) => (s += `<line x1="${X(v)}" y1="${y + 4}" x2="${X(v)}" y2="60" style="stroke:${c};stroke-width:2"/><circle cx="${X(v)}" cy="60" r="5" style="fill:${c}"/>` + A.T(X(v), y, t, { f: 12, w: 700, c })));
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 90" width="100%" style="max-width:560px">${s}</svg>`;
      q("[data-v=lt]").innerHTML = vis("harmônica MH", F.nt(e.mh, 4)) + vis("geométrica MG", F.nt(e.mg, 4)) + vis("aritmética MA", F.nt(e.ma, 4)) + vis("MA × MH", F.nt(e.produto, 4));
      q("[data-v=st]").innerHTML = a === b ? `Com os dois números iguais, as três médias coincidem com eles.` : `As três médias ficam entre ${Math.min(a, b)} e ${Math.max(a, b)}, sempre na mesma ordem: MH &lt; MG &lt; MA. A harmônica puxa para o número menor; a aritmética fica bem no meio. E repare na última caixa: MA × MH = ${F.nt(e.produto, 4)} = ${a} × ${b}, que é MG ao quadrado. A média geométrica é a média geométrica das outras duas.`; };
    ["a", "b"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.alMedias._ult = { poe, est }; desenha(); };

  /* nome: "A soma harmônica: cresce devagar, mas não para" · matéria: Matemática · tema: SPG03 */
  SIM.alSerieHarm = (el, F) => { let k = 3;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">número de parcelas: 2 elevado a <input type="range" data-v="k" min="0" max="20" step="1" value="3" style="vertical-align:middle;width:220px"> <b data-r="k" style="color:var(--ink)"></b></label></div></div></div><div class="palco" data-v="pal" style="padding:8px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const H = (n) => { let s = 0; for (let j = n; j >= 1; j--) s += 1 / j; return s; };
    /* blocos: 1 | 1/2 | 1/3 + 1/4 | 1/5 + ... + 1/8 | ...: cada bloco depois do primeiro soma pelo menos 1/2 */
    const est = () => { const n = 2 ** k, blocos = [1]; for (let j = 1; j <= k; j++) { let s = 0; for (let t = 2 ** (j - 1) + 1; t <= 2 ** j; t++) s += 1 / t; blocos.push(s); } return { k, n, H: H(n), blocos, piso: 1 + k / 2 }; };
    const poe = (o) => { k = Math.max(0, Math.min(20, Math.round(+o.k))); desenha(); };
    const desenha = () => { const e = est(), X = (v) => 40 + (v / 15) * 480; q("[data-v=k]").value = String(k); q("[data-r=k]").textContent = `${k} = ${F.nt(e.n, 0)}`; let s = `<line x1="40" y1="64" x2="520" y2="64" style="stroke:var(--ink3);stroke-width:1.2"/>`, ac = 0;
      for (let v = 0; v <= 15; v++) s += `<line x1="${X(v)}" y1="60" x2="${X(v)}" y2="68" style="stroke:var(--ink3)"/>` + A.T(X(v), 82, v, { f: 10, c: "var(--ink3)" });
      e.blocos.forEach((b, j) => { s += `<rect x="${X(ac).toFixed(1)}" y="30" width="${(X(ac + b) - X(ac)).toFixed(1)}" height="24" style="fill:${A.COR[j % 4]};opacity:.82;stroke:var(--bg);stroke-width:1"/>`; ac += b; });
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 92" width="100%" style="max-width:560px">${s}</svg>`;
      q("[data-v=lt]").innerHTML = vis("parcelas", F.nt(e.n, 0)) + vis("soma", F.nt(e.H, 4)) + vis("garantido: 1 + k/2", F.nt(e.piso, 1));
      q("[data-v=st]").innerHTML = `Soma de 1 + 1/2 + 1/3 + ... até 1/${F.nt(e.n, 0)}. Cada bloco colorido termina numa potência de 2: (1), (1/2), (1/3 + 1/4), (1/5 + ... + 1/8)... Cada bloco, depois do primeiro, soma <b>pelo menos 1/2</b>. Então, dobrando o número de parcelas, a soma ganha sempre mais meio: ela passa de qualquer número, mas a um custo absurdo. Com mais de um milhão de parcelas, ainda não chegou a 15.`; };
    q("[data-v=k]").addEventListener("input", (ev) => poe({ k: ev.target.value }));
    SIM.alSerieHarm._ult = { poe, est }; desenha(); };
})();
