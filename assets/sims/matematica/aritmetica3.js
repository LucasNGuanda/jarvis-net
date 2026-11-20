/* Matemática · módulo AR (Aritmética): laboratórios do CNJ01 (conjuntos), CNJ02 (conjuntos numéricos) e RLM01 (raciocínio lógico).
   Acrescenta ao núcleo SIM.ar: venn (diagrama de Venn de 2 ou 3 conjuntos, com regiões pintadas e rótulos), EXPR (operações entre conjuntos como funções das regiões),
   regioes (conta os elementos de cada região) e conj (escreve um conjunto por extenso).
   Contas conferidas em Python (tools/matematica/confere-ar.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, R = SIM.ar, { vis, T, mn } = A, sl = R.sl;
  let nV = 0;

  /* ---------- CNJ01 ---------- */
  /* Região = máscara de bits: bit 0 = está em A, bit 1 = em B, bit 2 = em C. A região 0 fica fora de todos.
     o = { pinta: [máscaras pintadas], rot: { máscara: texto }, nomes: ["A", "B", "C"], h, cor } */
  const GEO = { 2: { W: 560, H: 210, c: [[232, 105], [328, 105]], r: 78, pos: { 1: [196, 110], 2: [364, 110], 3: [280, 110], 0: [96, 190] }, nome: [[170, 30], [390, 30]] },
    3: { W: 560, H: 262, c: [[242, 96], [318, 96], [280, 162]], r: 72, pos: { 1: [204, 82], 2: [356, 82], 4: [280, 206], 3: [280, 70], 5: [236, 142], 6: [324, 142], 7: [280, 118], 0: [96, 240] }, nome: [[170, 30], [390, 30], [360, 232]] } };
  R.venn = (k, D, o = {}) => { const g = GEO[k], id = "vn" + ++nV, nomes = o.nomes || ["A", "B", "C"], cor = o.cor || "var(--mod)"; let defs = "", s = "";
    g.c.forEach(([x, y], i) => (defs += `<clipPath id="${id}c${i}"><circle cx="${x}" cy="${y}" r="${g.r}"/></clipPath>`));
    for (let m = 0; m < 2 ** k; m++) { defs += `<mask id="${id}m${m}"><rect x="0" y="0" width="${g.W}" height="${g.H}" fill="#fff"/>${g.c.map(([x, y], i) => ((m >> i) & 1 ? "" : `<circle cx="${x}" cy="${y}" r="${g.r}" fill="#000"/>`)).join("")}</mask>`; }
    s += `<rect x="40" y="6" width="${g.W - 80}" height="${g.H - 12}" rx="12" style="fill:none;stroke:var(--line2);stroke-width:1.5"/>`;
    (o.pinta || []).forEach((m) => { let el = `<rect x="40" y="6" width="${g.W - 80}" height="${g.H - 12}" rx="12" mask="url(#${id}m${m})" data-reg="${m}" style="fill:${cor};fill-opacity:.42"/>`; for (let i = 0; i < k; i++) if ((m >> i) & 1) el = `<g clip-path="url(#${id}c${i})">${el}</g>`; s += el; });
    g.c.forEach(([x, y], i) => (s += `<circle cx="${x}" cy="${y}" r="${g.r}" style="fill:none;stroke:var(--ink2);stroke-width:2"/>` + T(g.nome[i][0], g.nome[i][1], nomes[i], { f: 15, w: 700, c: "var(--ink2)" })));
    if (o.U !== false) s += T(g.W - 56, 26, "U", { f: 13, c: "var(--ink3)" });
    Object.entries(o.rot || {}).forEach(([m, t]) => { if (g.pos[m] && t !== null && t !== undefined && t !== "") s += T(g.pos[m][0], g.pos[m][1], String(t), { f: String(t).length > 9 ? 10 : String(t).length > 5 ? 11.5 : 14, w: 600 }); });
    return D ? D.svg(g.W, g.H, `<defs>${defs}</defs>` + s, "figura") : `<svg viewBox="0 0 ${g.W} ${g.H}" style="width:100%;max-width:${g.W}px;display:block;margin:0 auto"><defs>${defs}</defs>${s}</svg>`; };
  /* operações: cada uma diz, para a região m, se ela entra no resultado (a, b, c = está em A, B, C) */
  R.EXPR = [
    { id: "uni", txt: "A ∪ B", tex: "A \\cup B", f: (a, b) => a || b, fala: "está em A ou em B (ou nos dois)" },
    { id: "int", txt: "A ∩ B", tex: "A \\cap B", f: (a, b) => a && b, fala: "está em A e em B ao mesmo tempo" },
    { id: "amb", txt: "A − B", tex: "A - B", f: (a, b) => a && !b, fala: "está em A e não está em B" },
    { id: "bma", txt: "B − A", tex: "B - A", f: (a, b) => b && !a, fala: "está em B e não está em A" },
    { id: "sim", txt: "A Δ B", tex: "A \\,\\Delta\\, B", f: (a, b) => a !== b, fala: "está em exatamente um dos dois" },
    { id: "ca", txt: "Aᶜ", tex: "A^c", f: (a) => !a, fala: "não está em A" },
    { id: "cuni", txt: "(A ∪ B)ᶜ", tex: "(A \\cup B)^c", f: (a, b) => !(a || b), fala: "não está em A nem em B" },
    { id: "cint", txt: "(A ∩ B)ᶜ", tex: "(A \\cap B)^c", f: (a, b) => !(a && b), fala: "não está nos dois ao mesmo tempo" },
    { id: "dm1", txt: "Aᶜ ∩ Bᶜ", tex: "A^c \\cap B^c", f: (a, b) => !a && !b, fala: "está fora de A e fora de B" },
    { id: "dm2", txt: "Aᶜ ∪ Bᶜ", tex: "A^c \\cup B^c", f: (a, b) => !a || !b, fala: "está fora de A ou fora de B" },
  ];
  R.mascaras = (e, k = 2) => { const ms = []; for (let m = 0; m < 2 ** k; m++) if (e.f(!!(m & 1), !!(m & 2), !!(m & 4))) ms.push(m); return ms; };
  /* elementos de U por região: sets = [fA, fB, fC] (funções que dizem se x pertence) */
  R.regioes = (U, sets) => { const r = {}; for (let m = 0; m < 2 ** sets.length; m++) r[m] = []; U.forEach((x) => { let m = 0; sets.forEach((f, i) => { if (f(x)) m |= 1 << i; }); r[m].push(x); }); return r; };
  R.conj = (v) => (v.length ? "{" + v.join(", ") + "}" : "∅");

  /* nome: "Diagrama de Venn: pinte a operação" · matéria: Matemática · tema: CNJ01 */
  SIM.arVenn = (el, F) => { let id = "uni", a = 2, b = 3; const U = Array.from({ length: 12 }, (_, i) => i + 1);
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts escolha">${R.EXPR.map((e) => `<button class="bt peq" data-e="${e.id}" aria-pressed="${e.id === id}">${e.txt}</button>`).join("")}</div><div class="bts" style="margin-top:8px">${sl("a", "A = múltiplos de", 2, 6, a, 110)}${sl("b", "B = múltiplos de", 2, 6, b, 110)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const e = R.EXPR.find((x) => x.id === id), reg = R.regioes(U, [(x) => x % a === 0, (x) => x % b === 0]), ms = R.mascaras(e), res = ms.flatMap((m) => reg[m]).sort((x, y) => x - y), igual = R.EXPR.filter((x) => x.id !== id && R.mascaras(x).join() === ms.join()).map((x) => x.txt); return { id, a, b, mascaras: ms, resultado: res, n: res.length, reg, A: U.filter((x) => x % a === 0), B: U.filter((x) => x % b === 0), igual }; };
    const poe = (o) => { ({ id, a, b } = { id, a, b, ...o }); if (!R.EXPR.some((x) => x.id === id)) id = "uni"; a = Math.max(2, Math.min(6, Math.round(+a))); b = Math.max(2, Math.min(6, Math.round(+b))); desenha(); };
    const desenha = () => { const s = est(), e = R.EXPR.find((x) => x.id === id); el.querySelectorAll("[data-e]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.e === id)); ["a", "b"].forEach((k) => { q(`[data-v=${k}]`).value = String({ a, b }[k]); q(`[data-r=${k}]`).textContent = { a, b }[k]; });
      q("[data-v=pal]").innerHTML = R.venn(2, null, { pinta: s.mascaras, rot: { 0: s.reg[0].join(" "), 1: s.reg[1].join(" "), 2: s.reg[2].join(" "), 3: s.reg[3].join(" ") } });
      q("[data-v=lt]").innerHTML = vis("A", R.conj(s.A)) + vis("B", R.conj(s.B)) + vis(e.txt, R.conj(s.resultado)) + vis("elementos", s.n);
      q("[data-v=st]").innerHTML = `U = {1, 2, …, 12}. Um elemento entra em ${e.txt} quando ${e.fala}. ${s.igual.length ? `Repare: a região pintada é exatamente a de <b>${s.igual.join("</b> e de <b>")}</b>. ${/ᶜ/.test(e.txt) && s.igual.some((t) => /ᶜ/.test(t)) ? "São as leis de De Morgan: o complementar da união é a interseção dos complementares, e o complementar da interseção é a união dos complementares." : ""}` : ""}`; };
    el.querySelectorAll("[data-e]").forEach((x) => x.addEventListener("click", () => poe({ id: x.dataset.e }))); ["a", "b"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.arVenn._ult = { poe, est }; desenha(); };

  /* nome: "Três conjuntos: conte cada região uma vez só" · matéria: Matemática · tema: CNJ01 */
  SIM.arTres = (el, F) => { let N = 60, a = 2, b = 3, c = 5;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("N", "U = {1, …, N}, N", 20, 120, N, 150)}${sl("a", "A: múltiplos de", 2, 9, a, 90)}${sl("b", "B: múltiplos de", 2, 9, b, 90)}${sl("c", "C: múltiplos de", 2, 9, c, 90)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const U = Array.from({ length: N }, (_, i) => i + 1), fs = [(x) => x % a === 0, (x) => x % b === 0, (x) => x % c === 0], reg = R.regioes(U, fs), n = {}; for (const m in reg) n[m] = reg[m].length;
      const nA = n[1] + n[3] + n[5] + n[7], nB = n[2] + n[3] + n[6] + n[7], nC = n[4] + n[5] + n[6] + n[7], nAB = n[3] + n[7], nAC = n[5] + n[7], nBC = n[6] + n[7], nABC = n[7], uniao = N - n[0];
      return { N, a, b, c, n, nA, nB, nC, nAB, nAC, nBC, nABC, uniao, formula: nA + nB + nC - nAB - nAC - nBC + nABC, soUm: n[1] + n[2] + n[4], exatDois: n[3] + n[5] + n[6] }; };
    const poe = (o) => { ({ N, a, b, c } = { N, a, b, c, ...o }); N = Math.max(20, Math.min(120, Math.round(+N))); [a, b, c] = [a, b, c].map((v) => Math.max(2, Math.min(9, Math.round(+v)))); desenha(); };
    const desenha = () => { const e = est(); ["N", "a", "b", "c"].forEach((k) => { q(`[data-v=${k}]`).value = String({ N, a, b, c }[k]); q(`[data-r=${k}]`).textContent = { N, a, b, c }[k]; });
      q("[data-v=pal]").innerHTML = R.venn(3, null, { rot: e.n, pinta: [7] });
      q("[data-v=lt]").innerHTML = vis("n(A), n(B), n(C)", `${e.nA}, ${e.nB}, ${e.nC}`) + vis("de dois em dois", `${e.nAB}, ${e.nAC}, ${e.nBC}`) + vis("nos três", e.nABC) + vis("na união", e.uniao);
      q("[data-v=st]").innerHTML = `Cada número do diagrama é a quantidade de elementos daquela região (os de fora não estão em nenhum conjunto). Somar n(A) + n(B) + n(C) = ${e.nA + e.nB + e.nC} conta duas vezes quem está em dois conjuntos e três vezes quem está nos três. Corrigindo: ${e.nA + e.nB + e.nC} − (${e.nAB} + ${e.nAC} + ${e.nBC}) + ${e.nABC} = ${e.formula}, exatamente o número de elementos da união (${e.uniao}). Em só um conjunto: ${e.soUm}; em exatamente dois: ${e.exatDois}.`; };
    ["N", "a", "b", "c"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.arTres._ult = { poe, est }; desenha(); };
})();
