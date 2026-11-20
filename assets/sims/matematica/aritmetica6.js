/* Matemática · módulo AR (Aritmética): laboratórios de probabilidade, PB01 (teoria das probabilidades).
   Acrescenta ao núcleo SIM.ar: pfr (fração simplificada), pTxt e pTex (escrita de uma probabilidade), EVT (eventos com dois dados), contaDados,
   dadosFig (a tabela 6 × 6), urna (bolas coloridas numa caixa) e EXPS (experimentos do laboratório de lançamentos).
   Contas conferidas em Python (tools/matematica/confere-ar.py). Os sorteios usam gerador com semente (SIM.ar.gera), para o teste poder repetir. */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, R = SIM.ar, { vis, T } = A, sl = R.sl, nt = R.nt;
  const svg = (W, H, s, D) => (D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`);

  /* ---------- PB01 ---------- */
  R.pfr = (a, b) => { const g = M.mdc(Math.abs(a), Math.abs(b)) || 1; return [a / g, b / g]; };
  R.pTxt = (a, b) => { const [x, y] = R.pfr(a, b); return y === 1 ? String(x) : `${x}/${y}`; };
  R.pTex = (a, b) => { const [x, y] = R.pfr(a, b); return y === 1 ? String(x) : `\\dfrac{${x}}{${y}}`; };
  /* eventos com dois dados: fn(dado 1, dado 2, parâmetro) */
  R.EVT = [
    { id: "igual", nome: (s) => `a soma é ${s}`, fn: (i, j, s) => i + j === s, min: 2, max: 12 },
    { id: "pelomenos", nome: (s) => `a soma é ${s} ou mais`, fn: (i, j, s) => i + j >= s, min: 2, max: 12 },
    { id: "nomaximo", nome: (s) => `a soma é ${s} ou menos`, fn: (i, j, s) => i + j <= s, min: 2, max: 12 },
    { id: "iguais", nome: () => "os dois dados mostram o mesmo número", fn: (i, j) => i === j, min: 2, max: 2 },
    { id: "algum", nome: (s) => `pelo menos um dos dados mostra ${s}`, fn: (i, j, s) => i === s || j === s, min: 1, max: 6 },
  ];
  R.contaDados = (fn, s) => { let c = 0; for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) if (fn(i, j, s)) c++; return c; };
  /* tabela dos 36 resultados de dois dados; cada casa mostra a soma. o = { fn, s, semSoma } */
  R.dadosFig = (D, o = {}) => { const c = 34, x0 = 190, y0 = 44, W = 560, H = y0 + 6 * c + 14; let s = T(x0 + 3 * c, 14, "dado 2", { f: 10, c: "var(--ink3)" }) + T(x0 - 38, y0 + 3 * c + 4, "dado 1", { f: 10, c: "var(--ink3)", a: "end" });
    for (let k = 1; k <= 6; k++) s += T(x0 + (k - 0.5) * c, y0 - 8, k, { f: 11, w: 700, c: "var(--ink2)" }) + T(x0 - 12, y0 + (k - 0.5) * c + 4, k, { f: 11, w: 700, c: "var(--ink2)" });
    for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) { const on = o.fn ? o.fn(i, j, o.s) : false; s += `<rect data-on="${on ? 1 : 0}" x="${x0 + (j - 1) * c + 1.5}" y="${y0 + (i - 1) * c + 1.5}" width="${c - 3}" height="${c - 3}" rx="5" style="fill:${on ? "var(--warn)" : "var(--mod)"};fill-opacity:${on ? 0.5 : 0.1};stroke:${on ? "var(--warn)" : "var(--line)"};stroke-width:1.2"/>` + (o.semSoma ? "" : T(x0 + (j - 0.5) * c, y0 + (i - 0.5) * c + 4, i + j, { f: 11, w: on ? 700 : 400, c: on ? "var(--ink)" : "var(--ink3)" })); }
    return svg(W, H, s, D); };
  /* urna: grupos = [[cor CSS, quantidade], …] */
  R.urna = (grupos, D) => { const bolas = grupos.flatMap(([cor, n]) => Array(n).fill(cor)), porL = Math.min(10, Math.max(5, Math.ceil(Math.sqrt(bolas.length * 2.2)))), linhas = Math.ceil(bolas.length / porL), W = 560, bw = porL * 30 + 24, H = linhas * 30 + 40, x0 = (W - bw) / 2; let s = `<path d="M ${x0} 8 L ${x0} ${H - 10} Q ${x0} ${H - 2} ${x0 + 8} ${H - 2} L ${x0 + bw - 8} ${H - 2} Q ${x0 + bw} ${H - 2} ${x0 + bw} ${H - 10} L ${x0 + bw} 8" style="fill:var(--mod);fill-opacity:.05;stroke:var(--ink3);stroke-width:1.6"/>`;
    bolas.forEach((cor, i) => { const l = Math.floor(i / porL), k = i % porL; s += `<circle cx="${x0 + 27 + k * 30}" cy="${H - 20 - l * 30}" r="11.5" style="fill:${cor};stroke:var(--bg);stroke-width:1.5"/>`; });
    return svg(W, H, s, D); };
  R.CORES = { vermelha: "#e5484d", azul: "#4c8dff", verde: "#3fb950", amarela: "#e3b341", branca: "#d7dde8", preta: "#586174" };

  /* nome: "Dois dados: a tabela das 36 possibilidades" · matéria: Matemática · tema: PB01 */
  SIM.arDoisDados = (el, F) => { let t = 0, s = 7;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-b="tipo"></button></div><div class="bts" style="margin-top:6px">${sl("s", "n =", 1, 12, s, 220)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (x) => el.querySelector(x);
    const est = () => { const ev = R.EVT[t], fav = R.contaDados(ev.fn, s); return { tipo: ev.id, s, favoraveis: fav, prob: R.pfr(fav, 36), valor: fav / 36, pintadas: el.querySelectorAll("rect[data-on='1']").length, evento: ev.nome(s) }; };
    const poe = (o) => { if (o.tipo !== undefined) { const k = R.EVT.findIndex((e) => e.id === o.tipo); if (k >= 0) t = k; } if (o.s !== undefined) s = Math.round(+o.s); const ev = R.EVT[t]; s = Math.max(ev.min, Math.min(ev.max, s)); desenha(); };
    const desenha = () => { const ev = R.EVT[t]; q("[data-v=s]").min = String(ev.min); q("[data-v=s]").max = String(ev.max); q("[data-v=s]").value = String(s); q("[data-r=s]").textContent = ev.min === ev.max ? "—" : s; q("[data-v=s]").disabled = ev.min === ev.max;
      q("[data-b=tipo]").textContent = "evento: " + ev.nome("n") + "  ▸ trocar";
      q("[data-v=pal]").innerHTML = R.dadosFig(null, { fn: ev.fn, s }); const e = est();
      q("[data-v=lt]").innerHTML = vis("casos possíveis", 36) + vis("casos favoráveis", e.favoraveis) + vis("probabilidade", R.pTxt(e.favoraveis, 36)) + vis("em porcentagem", nt((100 * e.favoraveis) / 36, 2) + "%");
      q("[data-v=st]").innerHTML = `Evento: <b>${e.evento}</b>. Os 36 pares (dado 1, dado 2) têm todos a mesma chance; ${e.favoraveis === 0 ? "nenhum" : e.favoraveis} deles serve${e.favoraveis === 1 ? "" : "m"}. Probabilidade: ${e.favoraveis}/36${e.favoraveis && R.pTxt(e.favoraveis, 36) !== e.favoraveis + "/36" ? " = " + R.pTxt(e.favoraveis, 36) : ""}. ${ev.id === "igual" ? "Repare que as somas <b>não</b> têm a mesma chance: a soma 7 aparece em 6 casas (uma diagonal inteira), a soma 2 em uma só." : ev.id === "algum" ? "Não são 12 casas (6 + 6): a casa em que os dois dados mostram o número foi contada duas vezes. São 6 + 6 − 1 = 11." : ""}`; };
    q("[data-v=s]").addEventListener("input", (ev) => poe({ s: ev.target.value }));
    q("[data-b=tipo]").addEventListener("click", () => { t = (t + 1) % R.EVT.length; poe({ s: R.EVT[t].id === "algum" ? 6 : s }); });
    SIM.arDoisDados._ult = { poe, est }; desenha(); };

  /* experimentos do laboratório de lançamentos: p é a probabilidade exata; joga(rnd) devolve true se o evento aconteceu */
  const dado = (rnd) => 1 + Math.floor(rnd() * 6);
  R.EXPS = [
    { id: "moeda", nome: "sair cara numa moeda", p: [1, 2], joga: (rnd) => rnd() < 0.5 },
    { id: "seis", nome: "sair 6 num dado", p: [1, 6], joga: (rnd) => dado(rnd) === 6 },
    { id: "sete", nome: "a soma de dois dados ser 7", p: [1, 6], joga: (rnd) => dado(rnd) + dado(rnd) === 7 },
    { id: "algum6", nome: "sair pelo menos um 6 em dois dados", p: [11, 36], joga: (rnd) => { const a = dado(rnd), b = dado(rnd); return a === 6 || b === 6; } },
  ];

  /* nome: "Lance muitas vezes: a frequência se aproxima da probabilidade" · matéria: Matemática · tema: PB01 */
  SIM.arLanca = (el, F) => { let x = 0, n = 0, suc = 0, hist = [], rnd = R.gera(2026);
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-b="exp"></button></div><div class="bts" style="margin-top:6px"><button class="bt peq" data-k="1">lançar 1</button><button class="bt peq" data-k="10">lançar 10</button><button class="bt peq" data-k="100">lançar 100</button><button class="bt peq" data-k="1000">lançar 1000</button><button class="bt peq" data-b="zera">zerar</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const e = R.EXPS[x]; return { exp: e.id, n, sucessos: suc, freq: n ? suc / n : null, p: e.p[0] / e.p[1], diferenca: n ? Math.abs(suc / n - e.p[0] / e.p[1]) : null }; };
    const zera = () => { n = 0; suc = 0; hist = []; };
    const lanca = (k) => { const e = R.EXPS[x]; k = Math.max(0, Math.min(Math.round(+k), 200000 - n)); for (let i = 0; i < k; i++) { n++; if (e.joga(rnd)) suc++; if (n <= 200 || n % Math.ceil(n / 200) === 0) hist.push([n, suc / n]); } if (hist.length > 600) hist = hist.filter((_, i) => i % 2 === 0 || i === hist.length - 1); desenha(); };
    const poe = (o) => { if (o.exp !== undefined) { const k = R.EXPS.findIndex((e) => e.id === o.exp); if (k >= 0 && k !== x) { x = k; zera(); } } desenha(); };
    const semente = (s) => { rnd = R.gera(s); zera(); desenha(); };
    const desenha = () => { const e = R.EXPS[x], st = est(), W = 560, H = 210, x0 = 46, x1 = W - 16, y0 = H - 26, y1 = 14, X = (k) => x0 + (k / Math.max(n, 10)) * (x1 - x0), Y = (v) => y0 - v * (y0 - y1);
      q("[data-b=exp]").textContent = "evento: " + e.nome + "  ▸ trocar";
      let s = `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" style="stroke:var(--ink3)"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" style="stroke:var(--ink3)"/>` + [0, 0.5, 1].map((v) => T(x0 - 6, Y(v) + 4, nt(v, 1), { f: 10, c: "var(--ink3)", a: "end" })).join("") + T(x1, y0 + 16, nt(Math.max(n, 10), 0) + " lançamentos", { f: 10, c: "var(--ink3)", a: "end" }) + T(x0, y0 + 16, "0", { f: 10, c: "var(--ink3)" });
      s += `<line x1="${x0}" y1="${Y(st.p)}" x2="${x1}" y2="${Y(st.p)}" style="stroke:var(--ok);stroke-width:1.6;stroke-dasharray:6 5"/>` + T(x1 - 2, Y(st.p) - 6, "probabilidade " + R.pTxt(e.p[0], e.p[1]), { f: 10, w: 700, c: "var(--ok)", a: "end" });
      if (hist.length) s += `<polyline points="${hist.map(([k, f]) => X(k).toFixed(1) + "," + Y(f).toFixed(1)).join(" ")}" style="fill:none;stroke:var(--warn);stroke-width:2"/>`;
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`;
      q("[data-v=lt]").innerHTML = vis("lançamentos", nt(n, 0)) + vis("vezes que aconteceu", nt(suc, 0)) + vis("frequência", n ? nt(st.freq, 4) : "—") + vis("probabilidade", `${R.pTxt(e.p[0], e.p[1])} ≈ ${nt(st.p, 4)}`);
      q("[data-v=st]").innerHTML = n ? `Em ${nt(n, 0)} lançamentos o evento aconteceu ${nt(suc, 0)} vez${suc === 1 ? "" : "es"}: frequência ${nt(st.freq, 4)}, a ${nt(st.diferenca, 4)} da probabilidade. Com poucos lançamentos a linha laranja pula muito; com muitos, ela tende a ficar perto da linha tracejada. Isso é um <b>fato observado</b> (e um teorema da universidade, a lei dos grandes números), não uma garantia para cada sequência: a probabilidade não "corrige" os resultados passados.` : `Evento: <b>${e.nome}</b>, de probabilidade ${R.pTxt(e.p[0], e.p[1])}. Lance e acompanhe a frequência (quantas vezes aconteceu ÷ quantas vezes lançou).`; };
    el.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => lanca(+b.dataset.k)));
    q("[data-b=zera]").addEventListener("click", () => { zera(); desenha(); }); q("[data-b=exp]").addEventListener("click", () => poe({ exp: R.EXPS[(x + 1) % R.EXPS.length].id }));
    SIM.arLanca._ult = { poe, est, semente, lanca }; desenha(); };
})();
