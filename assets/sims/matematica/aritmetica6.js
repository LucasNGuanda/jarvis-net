/* Matemática · módulo AR (Aritmética): laboratórios de probabilidade: PB01 (teoria das probabilidades) e PB02 (probabilidade condicional: duasRetiradas, arvoreP, teste).
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

  /* ---------- PB02 ---------- */
  /* duas retiradas de uma urna com a bolas vermelhas e b azuis: probabilidades (frações [num, den]) de cada ramo e de cada caminho */
  R.duasRetiradas = (a, b, rep) => { const t = a + b, t2 = rep ? t : t - 1, a2 = rep ? a : a - 1, b2 = rep ? b : b - 1, fr = (x, y) => (y > 0 ? R.pfr(x, y) : [0, 1]);
    return { p1: { V: fr(a, t), A: fr(b, t) }, p2: { VV: fr(a2, t2), VA: fr(b, t2), AV: fr(a, t2), AA: fr(b2, t2) }, cam: { VV: fr(a * a2, t * t2), VA: fr(a * b, t * t2), AV: fr(b * a, t * t2), AA: fr(b * b2, t * t2) }, mesmaCor: fr(a * a2 + b * b2, t * t2), segundaV: fr(a * a2 + b * a, t * t2) }; };
  /* árvore de probabilidades de dois níveis. o = { n1: [nomes], p1: [textos], n2: [[nomes], [nomes]], p2: [[textos], [textos]], fim: [[textos], [textos]], cores } */
  R.arvoreP = (o, D) => { const W = 560, H = o.h || 230, x0 = 40, x1 = 200, x2 = 380, ys1 = [H * 0.27, H * 0.75], dy = H * 0.14, y0 = H / 2, cor = o.cores || ["var(--mod)", "var(--mod)"]; let s = `<circle cx="${x0}" cy="${y0}" r="5" style="fill:var(--ink2)"/>`;
    o.n1.forEach((nome, i) => { const y = ys1[i]; s += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y}" style="stroke:var(--ink3);stroke-width:1.3"/>` + T((x0 + x1) / 2 - 6, (y0 + y) / 2 + (i ? 16 : -8), o.p1[i], { f: 12, w: 700, c: "var(--warn)" }) + `<circle cx="${x1}" cy="${y}" r="9" style="fill:${cor[i]}"/>` + T(x1, y - 14, nome, { f: 10, c: "var(--ink2)" });
      o.n2[i].forEach((n2, j) => { const yy = y + (j ? dy : -dy); s += `<line x1="${x1 + 9}" y1="${y}" x2="${x2}" y2="${yy}" style="stroke:var(--ink3);stroke-width:1.3"/>` + T((x1 + x2) / 2 + 6, (y + yy) / 2 + (j ? 15 : -7), o.p2[i][j], { f: 12, w: 700, c: "var(--warn)" }) + `<circle cx="${x2}" cy="${yy}" r="8" style="fill:${(o.cores2 || cor)[j]}"/>` + T(x2 + 16, yy + 4, n2 + (o.fim ? "   →   " + o.fim[i][j] : ""), { f: 11, c: "var(--ink)", a: "start" }); }); });
    return svg(W, H, s, D); };
  /* teste diagnóstico numa população de N pessoas: contagens esperadas */
  R.teste = (prev, sens, esp, N = 100000) => { const doentes = (N * prev) / 100, saos = N - doentes, VP = (doentes * sens) / 100, FN = doentes - VP, VN = (saos * esp) / 100, FP = saos - VN; return { N, doentes, saos, VP, FN, VN, FP, positivos: VP + FP, ppv: VP + FP > 0 ? VP / (VP + FP) : null, vpn: VN + FN > 0 ? VN / (VN + FN) : null }; };

  /* nome: "Duas retiradas: com ou sem reposição?" · matéria: Matemática · tema: PB02 */
  SIM.arUrna2 = (el, F) => { let a = 3, b = 2, rep = false;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("a", "bolas vermelhas", 1, 8, a, 140)}${sl("b", "bolas azuis", 1, 8, b, 140)}</div><div class="bts" style="margin-top:6px"><button class="bt peq" data-b="rep"></button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), f = (x) => R.pTxt(x[0], x[1]);
    const est = () => Object.assign({ a, b, rep }, R.duasRetiradas(a, b, rep));
    const poe = (o) => { ({ a, b, rep } = { a, b, rep, ...o }); a = Math.max(1, Math.min(8, Math.round(+a))); b = Math.max(1, Math.min(8, Math.round(+b))); rep = !!rep; desenha(); };
    const desenha = () => { const e = est(); ["a", "b"].forEach((k) => { q(`[data-v=${k}]`).value = String({ a, b }[k]); q(`[data-r=${k}]`).textContent = { a, b }[k]; }); q("[data-b=rep]").textContent = "devolver a 1ª bola antes de tirar a 2ª: " + (rep ? "sim (com reposição)" : "não (sem reposição)");
      q("[data-v=pal]").innerHTML = R.arvoreP({ n1: ["1ª vermelha", "1ª azul"], p1: [f(e.p1.V), f(e.p1.A)], n2: [["2ª vermelha", "2ª azul"], ["2ª vermelha", "2ª azul"]], p2: [[f(e.p2.VV), f(e.p2.VA)], [f(e.p2.AV), f(e.p2.AA)]], fim: [[f(e.cam.VV), f(e.cam.VA)], [f(e.cam.AV), f(e.cam.AA)]], cores: [R.CORES.vermelha, R.CORES.azul], h: 250 }, null);
      q("[data-v=lt]").innerHTML = vis("duas vermelhas", f(e.cam.VV)) + vis("cores iguais", f(e.mesmaCor)) + vis("cores diferentes", R.pTxt(e.mesmaCor[1] - e.mesmaCor[0], e.mesmaCor[1])) + vis("2ª vermelha (sem saber a 1ª)", f(e.segundaV));
      q("[data-v=st]").innerHTML = `Em cada galho está a probabilidade <b>daquele passo, dado o que já aconteceu</b>; a probabilidade de um caminho inteiro é o <b>produto</b> dos galhos. ${rep ? "Com reposição, a urna volta a ser a mesma: os galhos da 2ª retirada não dependem da 1ª (as retiradas são independentes)." : `Sem reposição, a 1ª bola muda a urna: depois de uma vermelha sobram ${a - 1} vermelha${a - 1 === 1 ? "" : "s"} em ${a + b - 1} bolas, e a probabilidade de outra vermelha cai de ${f(e.p1.V)} para ${f(e.p2.VV)}.`} As quatro pontas somam 1. E um fato curioso: a chance de a 2ª bola ser vermelha, sem saber qual foi a 1ª, é ${f(e.segundaV)}, a mesma da 1ª.`; };
    ["a", "b"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    q("[data-b=rep]").addEventListener("click", () => poe({ rep: !rep }));
    SIM.arUrna2._ult = { poe, est }; desenha(); };

  /* nome: "Teste positivo: qual é a chance de estar doente?" · matéria: Matemática · tema: PB02 */
  SIM.arBayes = (el, F) => { let prev = 1, sens = 99, esp = 95;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("prev", "doentes na população (%)", 1, 50, prev, 150)}${sl("sens", "o teste acerta nos doentes (%)", 50, 100, sens, 150)}${sl("esp", "o teste acerta nos sãos (%)", 50, 100, esp, 150)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => Object.assign({ prev, sens, esp }, R.teste(prev, sens, esp));
    const poe = (o) => { ({ prev, sens, esp } = { prev, sens, esp, ...o }); prev = Math.max(1, Math.min(50, Math.round(+prev))); sens = Math.max(50, Math.min(100, Math.round(+sens))); esp = Math.max(50, Math.min(100, Math.round(+esp))); desenha(); };
    const desenha = () => { const e = est(); ["prev", "sens", "esp"].forEach((k) => { q(`[data-v=${k}]`).value = String({ prev, sens, esp }[k]); q(`[data-r=${k}]`).textContent = { prev, sens, esp }[k]; });
      q("[data-v=pal]").innerHTML = M.tabela(["resultado do teste", "doentes", "sãos", "total"], [["positivo", nt(e.VP, 0), nt(e.FP, 0), nt(e.positivos, 0)], ["negativo", nt(e.FN, 0), nt(e.VN, 0), nt(e.FN + e.VN, 0)], ["total", nt(e.doentes, 0), nt(e.saos, 0), nt(e.N, 0)]], window.D, { larg: 150, w: 110 });
      q("[data-v=lt]").innerHTML = vis("positivos", nt(e.positivos, 0)) + vis("positivos doentes", nt(e.VP, 0)) + vis("P(doente | positivo)", e.ppv === null ? "—" : nt(100 * e.ppv, 1) + "%") + vis("P(são | negativo)", e.vpn === null ? "—" : nt(100 * e.vpn, 2) + "%");
      q("[data-v=st]").innerHTML = `Em ${nt(e.N, 0)} pessoas, ${nt(e.doentes, 0)} estão doentes e ${nt(e.saos, 0)} não. O teste dá positivo em ${nt(e.VP, 0)} doentes (acertos) e em ${nt(e.FP, 0)} pessoas sãs (alarmes falsos). Quem recebe um positivo é uma das ${nt(e.positivos, 0)} pessoas da coluna "positivo", e só ${nt(e.VP, 0)} delas estão doentes: ${e.ppv === null ? "—" : `${nt(e.VP, 0)} ÷ ${nt(e.positivos, 0)} = <b>${nt(100 * e.ppv, 1)}%</b>`}. ${e.ppv !== null && e.ppv < 0.5 ? "Menos da metade! A doença é rara, e os poucos alarmes falsos, tirados de uma multidão de sãos, superam os doentes de verdade." : "Quanto mais comum a doença e menos alarmes falsos, mais um positivo quer dizer doente."} (Números de um teste hipotético, para estudar a conta.)`; };
    ["prev", "sens", "esp"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.arBayes._ult = { poe, est }; desenha(); };
})();
