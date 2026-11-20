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

  /* ---------- CNJ02 ---------- */
  /* números para classificar: menor = menor conjunto a que pertence ("N", "Z", "Q" ou "I" de irracional) */
  R.NUMS = [
    { txt: "7", tex: "7", v: 7, menor: "N", porque: "é um número de contar" },
    { txt: "0", tex: "0", v: 0, menor: "N", porque: "aqui o zero é contado entre os naturais" },
    { txt: "−3", tex: "-3", v: -3, menor: "Z", porque: "é inteiro, mas negativo: não é natural" },
    { txt: "√9", tex: "\\sqrt{9}", v: 3, menor: "N", porque: "√9 = 3, um natural: a raiz é só o jeito de escrever" },
    { txt: "2/3", tex: "\\dfrac{2}{3}", v: 2 / 3, menor: "Q", porque: "é razão de dois inteiros e não é inteiro" },
    { txt: "0,75", tex: "0{,}75", v: 0.75, menor: "Q", porque: "decimal que termina: 0,75 = 3/4" },
    { txt: "0,333…", tex: "0{,}\\overline{3}", v: 1 / 3, menor: "Q", porque: "dízima periódica: 0,333… = 1/3" },
    { txt: "−12/4", tex: "-\\dfrac{12}{4}", v: -3, menor: "Z", porque: "−12/4 = −3: está escrito como fração, mas é inteiro" },
    { txt: "√2", tex: "\\sqrt{2}", v: Math.SQRT2, menor: "I", porque: "não é razão de inteiros (Teorema 1); a escrita decimal não termina nem se repete" },
    { txt: "π", tex: "\\pi", v: Math.PI, menor: "I", porque: "é irracional (fato conhecido, não demonstrado aqui)" },
    { txt: "−√5", tex: "-\\sqrt{5}", v: -Math.sqrt(5), menor: "I", porque: "5 não é quadrado perfeito, então √5 é irracional, e o oposto também" },
    { txt: "1,41", tex: "1{,}41", v: 1.41, menor: "Q", porque: "decimal que termina: 141/100. Parece √2, mas não é" },
    { txt: "22/7", tex: "\\dfrac{22}{7}", v: 22 / 7, menor: "Q", porque: "é razão de inteiros. Parece π, mas não é" },
    { txt: "√2 · √8", tex: "\\sqrt{2}\\cdot\\sqrt{8}", v: 4, menor: "N", porque: "√2 · √8 = √16 = 4: produto de dois irracionais que dá natural" },
  ];
  R.pertence = (menor) => ({ N: menor === "N", Z: menor === "N" || menor === "Z", Q: menor !== "I", I: menor === "I", R: true });
  /* caixas encaixadas ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ, com um número posto na região certa. o = { onde: "N"|"Z"|"Q"|"I", rot } */
  R.encaixe = (D, o = {}) => { const W = 560, H = 190, cx = { N: [150, 104], Z: [150, 62], Q: [150, 34], I: [440, 100] }, on = (k) => o.onde === k; let s = `<rect x="20" y="8" width="520" height="174" rx="14" style="fill:${on("I") ? "color-mix(in srgb,var(--warn) 16%,transparent)" : "none"};stroke:var(--ink3);stroke-width:1.5"/>` + T(516, 28, "ℝ", { f: 16, w: 700, c: "var(--ink2)" }) + T(440, 150, "irracionais", { f: 12, c: "var(--ink3)" });
    s += `<rect x="34" y="18" width="300" height="154" rx="12" style="fill:${on("Q") ? "color-mix(in srgb,var(--mod) 22%,var(--bg))" : "var(--bg)"};stroke:var(--ink3);stroke-width:1.5"/>` + T(312, 38, "ℚ", { f: 16, w: 700, c: "var(--ink2)" });
    s += `<rect x="48" y="46" width="230" height="116" rx="10" style="fill:${on("Z") ? "color-mix(in srgb,var(--mod) 22%,var(--bg))" : "var(--bg)"};stroke:var(--ink3);stroke-width:1.5"/>` + T(258, 66, "ℤ", { f: 16, w: 700, c: "var(--ink2)" });
    s += `<rect x="62" y="80" width="160" height="72" rx="9" style="fill:${on("N") ? "color-mix(in srgb,var(--mod) 22%,var(--bg))" : "var(--bg)"};stroke:var(--ink3);stroke-width:1.5"/>` + T(204, 100, "ℕ", { f: 16, w: 700, c: "var(--ink2)" });
    if (o.onde && o.rot) s += T(o.onde === "N" ? 130 : o.onde === "Z" ? 130 : o.onde === "Q" ? 130 : 440, o.onde === "N" ? 126 : o.onde === "Z" ? 70 : o.onde === "Q" ? 38 : 100, o.rot, { f: 17, w: 700, c: o.onde === "I" ? "var(--warn)" : "var(--mod)" }); void cx;
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`; };

  /* nome: "Em que conjuntos este número mora?" · matéria: Matemática · tema: CNJ02 */
  SIM.arClassifica = (el, F) => { let i = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts escolha">${R.NUMS.map((n, k) => `<button class="bt peq" data-k="${k}" aria-pressed="${k === 0}">${n.txt}</button>`).join("")}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const n = R.NUMS[i], p = R.pertence(n.menor); return { i, txt: n.txt, v: n.v, menor: n.menor, N: p.N, Z: p.Z, Q: p.Q, I: p.I, R: true }; };
    const poe = (o) => { ({ i } = { i, ...o }); i = Math.max(0, Math.min(R.NUMS.length - 1, Math.round(+i))); desenha(); };
    const desenha = () => { const n = R.NUMS[i], e = est(); el.querySelectorAll("[data-k]").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.k === i));
      q("[data-v=pal]").innerHTML = R.encaixe(null, { onde: n.menor, rot: n.txt });
      q("[data-v=lt]").innerHTML = ["N", "Z", "Q", "R"].map((k) => vis({ N: "natural (ℕ)", Z: "inteiro (ℤ)", Q: "racional (ℚ)", R: "real (ℝ)" }[k], e[k] ? "sim" : "não")).join("") + vis("irracional", e.I ? "sim" : "não");
      q("[data-v=st]").innerHTML = `${n.txt}: ${n.porque}. ${n.menor === "I" ? "Irracional é o real que não é racional: fica dentro de ℝ e fora de ℚ." : `Como ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ, quem está num conjunto está também em todos os maiores${n.menor === "N" ? ": todo natural é inteiro, racional e real" : n.menor === "Z" ? ": todo inteiro é racional e real" : ": todo racional é real"}.`}`; };
    el.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => poe({ i: +b.dataset.k })));
    SIM.arClassifica._ult = { poe, est }; desenha(); };

  /* intervalos: { a, b, fa, fb } (fa, fb = extremo incluído?). a pode ser −Infinity e b, +Infinity. Operações devolvem lista de intervalos disjuntos. */
  R.dentro = (I, x) => (x > I.a || (x === I.a && I.fa)) && (x < I.b || (x === I.b && I.fb));
  R.vazio = (I) => I.a > I.b || (I.a === I.b && !(I.fa && I.fb));
  R.iInter = (P, Q) => { const a = Math.max(P.a, Q.a), b = Math.min(P.b, Q.b), fa = (P.a > Q.a ? P.fa : Q.a > P.a ? Q.fa : P.fa && Q.fa), fb = (P.b < Q.b ? P.fb : Q.b < P.b ? Q.fb : P.fb && Q.fb), I = { a, b, fa, fb }; return R.vazio(I) ? [] : [I]; };
  /* A − B = (A ∩ o que fica à esquerda de B) ∪ (A ∩ o que fica à direita de B); na borda, o tipo do extremo de B se inverte */
  R.iDif = (P, Q) => { if (R.vazio(P)) return []; if (R.vazio(Q)) return [P]; return R.iInter(P, { a: -Infinity, b: Q.a, fa: false, fb: !Q.fa }).concat(R.iInter(P, { a: Q.b, b: Infinity, fa: !Q.fb, fb: false })); };
  R.iUni = (P, Q) => { if (R.vazio(P)) return R.vazio(Q) ? [] : [Q]; if (R.vazio(Q)) return [P]; const [X, Y] = P.a < Q.a || (P.a === Q.a && P.fa >= Q.fa) ? [P, Q] : [Q, P]; /* X começa antes */ if (Y.a < X.b || (Y.a === X.b && (X.fb || Y.fa))) { const fimX = X.b > Y.b || (X.b === Y.b && X.fb >= Y.fb); return [{ a: X.a, fa: X.fa, b: fimX ? X.b : Y.b, fb: fimX ? X.fb : Y.fb }]; } return [X, Y]; };
  const num = (v) => (v === Infinity ? "+∞" : v === -Infinity ? "−∞" : mn(v));
  R.iTxt = (I) => `${I.fa && Number.isFinite(I.a) ? "[" : "]"}${num(I.a)}, ${num(I.b)}${I.fb && Number.isFinite(I.b) ? "]" : "["}`;
  R.iLista = (L) => (L.length ? L.map(R.iTxt).join(" ∪ ") : "∅");
  /* reta com intervalos. o = { min, max, linhas: [{ ints: [...], rot, cor }] } */
  R.retaInt = (o, D) => { const W = 560, x0 = 70, x1 = 520, X = (v) => (v === -Infinity ? x0 - 14 : v === Infinity ? x1 + 14 : x0 + ((v - o.min) / (o.max - o.min)) * (x1 - x0)), H = 34 + o.linhas.length * 30; let s = "";
    o.linhas.forEach((l, k) => { const y = 16 + k * 30, cor = l.cor || "var(--mod)"; s += `<line x1="${x0 - 14}" y1="${y}" x2="${x1 + 14}" y2="${y}" style="stroke:var(--line2);stroke-width:1.2"/>` + T(8, y + 4, l.rot || "", { f: 12, w: 600, c: "var(--ink2)", a: "start" });
      l.ints.forEach((I) => { s += `<line x1="${X(I.a)}" y1="${y}" x2="${X(I.b)}" y2="${y}" style="stroke:${cor};stroke-width:5;stroke-linecap:butt"/>`; [[I.a, I.fa], [I.b, I.fb]].forEach(([v, f]) => { if (Number.isFinite(v)) s += `<circle cx="${X(v)}" cy="${y}" r="5" style="fill:${f ? cor : "var(--bg)"};stroke:${cor};stroke-width:2"/>`; }); }); });
    const yb = 16 + o.linhas.length * 30 - 8; for (let v = Math.ceil(o.min); v <= o.max; v++) s += T(X(v), yb + 14, mn(v), { f: 10, c: "var(--ink3)" }) + `<line x1="${X(v)}" y1="${yb - 4}" x2="${X(v)}" y2="${yb + 2}" style="stroke:var(--ink3)"/>`;
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`; };

  /* nome: "Intervalos na reta: união, interseção e diferença" · matéria: Matemática · tema: CNJ02 */
  SIM.arIntervalos = (el, F) => { let P = { a: -3, b: 2, fa: true, fb: false }, Q = { a: 0, b: 5, fa: true, fb: true };
    const linha = (k, I) => `<div class="bts" style="margin-top:6px"><b style="width:18px">${k}</b>${sl(k + "a", "de", -8, 8, I.a, 110)}${sl(k + "b", "até", -8, 8, I.b, 110)}<button class="bt peq" data-f="${k}a" aria-pressed="${I.fa}">inclui o começo</button><button class="bt peq" data-f="${k}b" aria-pressed="${I.fb}">inclui o fim</button></div>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div>${linha("A", P)}${linha("B", Q)}</div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => ({ A: { ...P }, B: { ...Q }, uni: R.iUni(P, Q), int: R.iInter(P, Q), dif: R.iDif(P, Q), txt: { A: R.iTxt(P), B: R.iTxt(Q), uni: R.iLista(R.iUni(P, Q)), int: R.iLista(R.iInter(P, Q)), dif: R.iLista(R.iDif(P, Q)) } });
    const poe = (o) => { if (o.A) P = { ...P, ...o.A }; if (o.B) Q = { ...Q, ...o.B }; [P, Q].forEach((I) => { I.a = Math.max(-8, Math.min(8, Math.round(+I.a))); I.b = Math.max(-8, Math.min(8, Math.round(+I.b))); if (I.b < I.a) I.b = I.a; I.fa = !!I.fa; I.fb = !!I.fb; }); desenha(); };
    const desenha = () => { const e = est(); [["A", P], ["B", Q]].forEach(([k, I]) => { q(`[data-v=${k}a]`).value = String(I.a); q(`[data-v=${k}b]`).value = String(I.b); q(`[data-r=${k}a]`).textContent = mn(I.a); q(`[data-r=${k}b]`).textContent = mn(I.b); q(`[data-f=${k}a]`).setAttribute("aria-pressed", I.fa); q(`[data-f=${k}b]`).setAttribute("aria-pressed", I.fb); });
      q("[data-v=pal]").innerHTML = R.retaInt({ min: -9, max: 9, linhas: [{ ints: R.vazio(P) ? [] : [P], rot: "A", cor: "var(--mod)" }, { ints: R.vazio(Q) ? [] : [Q], rot: "B", cor: "var(--ok)" }, { ints: e.uni, rot: "A ∪ B", cor: "var(--warn)" }, { ints: e.int, rot: "A ∩ B", cor: "var(--warn)" }, { ints: e.dif, rot: "A − B", cor: "var(--warn)" }] }, null);
      q("[data-v=lt]").innerHTML = vis("A", e.txt.A) + vis("B", e.txt.B) + vis("A ∪ B", e.txt.uni) + vis("A ∩ B", e.txt.int) + vis("A − B", e.txt.dif);
      q("[data-v=st]").innerHTML = `Bolinha cheia: o extremo pertence ao intervalo (colchete virado para dentro). Bolinha vazia: não pertence (colchete virado para fora). Na <b>interseção</b> um extremo só fica se pertencer aos dois; na <b>união</b>, basta pertencer a um; na <b>diferença</b> A − B, os extremos de B trocam de tipo: onde B incluía o ponto, A − B exclui, e vice-versa.`; };
    ["A", "B"].forEach((k) => { ["a", "b"].forEach((x) => { q(`[data-v=${k}${x}]`).addEventListener("input", (ev) => poe({ [k]: { [x]: ev.target.value } })); q(`[data-f=${k}${x}]`).addEventListener("click", () => poe({ [k]: { ["f" + x]: !(k === "A" ? P : Q)["f" + x] } })); }); });
    SIM.arIntervalos._ult = { poe, est }; desenha(); };

  /* ---------- RLM01 ---------- */
  /* fórmulas com p e q (f devolve verdadeiro ou falso) */
  R.LOG = [
    { id: "e", txt: "p ∧ q", tex: "p \\land q", f: (p, q) => p && q, fala: "p e q" },
    { id: "ou", txt: "p ∨ q", tex: "p \\lor q", f: (p, q) => p || q, fala: "p ou q" },
    { id: "se", txt: "p → q", tex: "p \\to q", f: (p, q) => !p || q, fala: "se p, então q" },
    { id: "sse", txt: "p ↔ q", tex: "p \\leftrightarrow q", f: (p, q) => p === q, fala: "p se, e somente se, q" },
    { id: "npouq", txt: "¬p ∨ q", tex: "\\lnot p \\lor q", f: (p, q) => !p || q, fala: "não p, ou q" },
    { id: "contra", txt: "¬q → ¬p", tex: "\\lnot q \\to \\lnot p", f: (p, q) => q || !p, fala: "se não q, então não p (contrapositiva)" },
    { id: "recip", txt: "q → p", tex: "q \\to p", f: (p, q) => !q || p, fala: "se q, então p (recíproca)" },
    { id: "inversa", txt: "¬p → ¬q", tex: "\\lnot p \\to \\lnot q", f: (p, q) => p || !q, fala: "se não p, então não q (inversa)" },
    { id: "nse", txt: "¬(p → q)", tex: "\\lnot(p \\to q)", f: (p, q) => p && !q, fala: "não é verdade que p implica q" },
    { id: "penq", txt: "p ∧ ¬q", tex: "p \\land \\lnot q", f: (p, q) => p && !q, fala: "p e não q" },
    { id: "ne", txt: "¬(p ∧ q)", tex: "\\lnot(p \\land q)", f: (p, q) => !(p && q), fala: "não (p e q)" },
    { id: "npounq", txt: "¬p ∨ ¬q", tex: "\\lnot p \\lor \\lnot q", f: (p, q) => !p || !q, fala: "não p ou não q" },
    { id: "nou", txt: "¬(p ∨ q)", tex: "\\lnot(p \\lor q)", f: (p, q) => !(p || q), fala: "não (p ou q)" },
    { id: "npenq", txt: "¬p ∧ ¬q", tex: "\\lnot p \\land \\lnot q", f: (p, q) => !p && !q, fala: "não p e não q" },
  ];
  const LIN = [[true, true], [true, false], [false, true], [false, false]];
  R.tabV = (e) => LIN.map(([p, q]) => !!e.f(p, q));
  R.vf = (b) => (b ? "V" : "F");
  /* tabela-verdade em SVG: colunas p, q e as fórmulas pedidas. o = { interroga: [índices de coluna trocados por "?"], destaca: [linhas] } */
  R.figTab = (es, D, o = {}) => { const W = 560, cw = Math.min(120, Math.floor(400 / es.length)), x0 = (W - (100 + cw * es.length)) / 2, H = 28 + 5 * 28; let s = "";
    const cel = (x, y, w, t, cab, cor) => `<rect x="${x}" y="${y}" width="${w}" height="26" rx="4" style="fill:${cab ? "var(--card2)" : cor || "none"};stroke:var(--line)"/>` + T(x + w / 2, y + 18, t, { f: cab ? 12.5 : 14, w: cab ? 700 : 600, c: t === "V" ? "var(--ok)" : t === "F" ? "var(--bad)" : "var(--ink)" });
    s += cel(x0, 8, 48, "p", true) + cel(x0 + 50, 8, 48, "q", true) + es.map((e, k) => cel(x0 + 100 + k * cw, 8, cw - 2, e.txt, true)).join("");
    LIN.forEach(([p, q], i) => { const y = 36 + i * 28, d = (o.destaca || []).includes(i) ? "color-mix(in srgb,var(--warn) 18%,transparent)" : null; s += cel(x0, y, 48, R.vf(p), false, d) + cel(x0 + 50, y, 48, R.vf(q), false, d) + es.map((e, k) => cel(x0 + 100 + k * cw, y, cw - 2, (o.interroga || []).includes(k) ? "?" : R.vf(e.f(p, q)), false, d)).join(""); });
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`; };

  /* nome: "Tabela-verdade: duas fórmulas dizem a mesma coisa?" · matéria: Matemática · tema: RLM01 */
  SIM.arTabela = (el, F) => { let a = "se", b = "contra";
    const linha = (k, v) => `<div class="bts escolha" style="margin-top:6px"><b style="width:76px;font-size:13px">${k === "a" ? "1ª fórmula" : "2ª fórmula"}</b>${R.LOG.map((e) => `<button class="bt peq" data-${k}="${e.id}" aria-pressed="${e.id === v}">${e.txt}</button>`).join("")}</div>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div>${linha("a", a)}${linha("b", b)}</div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), acha = (id) => R.LOG.find((e) => e.id === id) || R.LOG[0];
    const est = () => { const ea = acha(a), eb = acha(b), ta = R.tabV(ea), tb = R.tabV(eb), dif = ta.map((v, i) => (v !== tb[i] ? i : -1)).filter((i) => i >= 0); return { a, b, ta, tb, equivalentes: dif.length === 0, opostas: dif.length === 4, diferem: dif }; };
    const poe = (o) => { ({ a, b } = { a, b, ...o }); a = acha(a).id; b = acha(b).id; desenha(); };
    const desenha = () => { const e = est(), ea = acha(a), eb = acha(b); el.querySelectorAll("[data-a]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.a === a)); el.querySelectorAll("[data-b]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.b === b));
      q("[data-v=pal]").innerHTML = R.figTab([ea, eb], null, { destaca: e.diferem });
      q("[data-v=lt]").innerHTML = vis(ea.txt, e.ta.map(R.vf).join(" ")) + vis(eb.txt, e.tb.map(R.vf).join(" ")) + vis("equivalentes?", e.equivalentes ? "sim" : "não");
      q("[data-v=st]").innerHTML = e.equivalentes ? `As duas colunas são idênticas nas quatro linhas: "${ea.fala}" e "${eb.fala}" são <b>equivalentes</b>, isto é, dizem a mesma coisa em qualquer situação.` : e.opostas ? `As colunas são opostas em todas as linhas: cada fórmula é a <b>negação</b> da outra.` : `As colunas diferem ${e.diferem.length === 1 ? "na linha destacada" : "nas linhas destacadas"} (p = ${e.diferem.map((i) => R.vf(LIN[i][0]) + ", q = " + R.vf(LIN[i][1])).join("; p = ")}): as fórmulas <b>não</b> são equivalentes. Basta uma linha diferente.`; };
    el.querySelectorAll("[data-a]").forEach((x) => x.addEventListener("click", () => poe({ a: x.dataset.a }))); el.querySelectorAll("[data-b]").forEach((x) => x.addEventListener("click", () => poe({ b: x.dataset.b })));
    SIM.arTabela._ult = { poe, est }; desenha(); };

  /* frases com quantificador: a região do diagrama de que a frase fala, o que diz dela e qual é a negação */
  R.QUANT = [
    { id: "todo", txt: "Todo A é B", reg: 1, diz: "vazio", neg: "algumnao", fala: "não existe A fora de B" },
    { id: "algumnao", txt: "Algum A não é B", reg: 1, diz: "existe", neg: "todo", fala: "existe pelo menos um A fora de B" },
    { id: "nenhum", txt: "Nenhum A é B", reg: 3, diz: "vazio", neg: "algum", fala: "não existe nada que seja A e B ao mesmo tempo" },
    { id: "algum", txt: "Algum A é B", reg: 3, diz: "existe", neg: "nenhum", fala: "existe pelo menos um que é A e B ao mesmo tempo" },
  ];
  R.figQuant = (q, D, o = {}) => R.venn(2, D, { pinta: q.diz === "vazio" ? [q.reg] : [], rot: { [q.reg]: q.diz === "vazio" ? "vazio" : "●" }, cor: "var(--ink3)", U: false, nomes: o.nomes });

  /* nome: "Todo, algum, nenhum: a frase e a sua negação" · matéria: Matemática · tema: RLM01 */
  SIM.arQuant = (el, F) => { let id = "todo";
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts escolha">${R.QUANT.map((x) => `<button class="bt peq" data-k="${x.id}" aria-pressed="${x.id === id}">${x.txt}</button>`).join("")}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0;display:grid;grid-template-columns:1fr 1fr;gap:8px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), acha = (k) => R.QUANT.find((x) => x.id === k) || R.QUANT[0];
    const est = () => { const x = acha(id), n = acha(x.neg); return { id, frase: x.txt, negacao: n.txt, regiao: x.reg, diz: x.diz, negDiz: n.diz, mesmaRegiao: x.reg === n.reg }; };
    const poe = (o) => { ({ id } = { id, ...o }); id = acha(id).id; desenha(); };
    const desenha = () => { const x = acha(id), n = acha(x.neg); el.querySelectorAll("[data-k]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.k === id));
      q("[data-v=pal]").innerHTML = `<div>${R.figQuant(x, null)}</div><div>${R.figQuant(n, null)}</div>`;
      q("[data-v=lt]").innerHTML = vis("frase", x.txt) + vis("negação", n.txt);
      q("[data-v=st]").innerHTML = `À esquerda, a frase: "${x.txt}" diz que ${x.fala}. À direita, a negação: "${n.txt}", isto é, ${n.fala}. As duas falam da <b>mesma região</b> do diagrama, e dizem o contrário sobre ela: uma diz que está vazia, a outra diz que tem alguém (●). Por isso a negação de "todo" não é "nenhum": "nenhum" fala de outra região.`; };
    el.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => poe({ id: b.dataset.k })));
    SIM.arQuant._ult = { poe, est }; desenha(); };
})();
