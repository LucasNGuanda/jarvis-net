/* Matemática · módulo AL (Álgebra): laboratórios das funções FX02 a FX06.
   FX02: SIM.alAfim (a reta de y = ax + b) e SIM.alDoisPontos (a função afim que passa por dois pontos).
   Contas conferidas em Python (tools/matematica/confere-al.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, { vis, rng, mn } = A;

  /* ---------- FX02 ---------- */
  /* nome: "A reta de y = ax + b: mexa em a e em b" · matéria: Matemática · tema: FX02 */
  SIM.alAfim = (el, F) => { let a = 2, b = -3;
    const sl = (n, lo, hi, v, st) => `<label style="font-size:13px;color:var(--ink2)">${n} <input type="range" data-v="${n}" min="${lo}" max="${hi}" step="${st}" value="${v}" style="vertical-align:middle;width:170px"> <b data-r="${n}" style="color:var(--ink);display:inline-block;width:34px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("a", -4, 4, 2, 0.5)}${sl("b", -6, 6, -3, 1)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => ({ a, b, zero: a === 0 ? null : -b / a, tipo: a > 0 ? "crescente" : a < 0 ? "decrescente" : "constante", f1: a + b });
    const poe = (o) => { ({ a, b } = { a, b, ...o }); a = Math.max(-4, Math.min(4, Math.round(+a * 2) / 2)); b = Math.max(-6, Math.min(6, Math.round(+b))); desenha(); };
    const desenha = () => { const e = est(); q("[data-v=a]").value = String(a); q("[data-v=b]").value = String(b); q("[data-r=a]").textContent = F.nt(a, 1); q("[data-r=b]").textContent = mn(b);
      const pts = [{ x: 0, y: b, rot: `(0; ${mn(b)})`, dx: -9, cor: "var(--ok)" }]; if (e.zero !== null && Math.abs(e.zero) <= 7) pts.push({ x: e.zero, y: 0, rot: "zero", dy: 18 });
      q("[data-v=pal]").innerHTML = A.plano({ x: [-7, 7], y: [-8, 8], h: 260, py: 2, fs: [{ f: (x) => a * x + b }], pts, segs: Math.abs(b + a) <= 8 ? [{ x1: 0, y1: b, x2: 1, y2: b, cor: "var(--warn)", tr: false, w: 2 }, { x1: 1, y1: b, x2: 1, y2: b + a, cor: "var(--warn)", tr: false, w: 2 }] : [] });
      q("[data-v=lt]").innerHTML = vis("função", `y = ${a === 0 ? mn(b) : (a === 1 ? "" : a === -1 ? "−" : F.nt(a, 1)) + "x" + (b === 0 ? "" : b > 0 ? ` + ${b}` : ` − ${-b}`)}`) + vis("zero", e.zero === null ? (b === 0 ? "todo x" : "não tem") : F.nt(e.zero, 3)) + vis("é", e.tipo);
      q("[data-v=st]").innerHTML = (a === 0 ? `Com a = 0 a função é constante: a reta é horizontal, na altura ${mn(b)}.` : `<b>a</b> é a taxa de variação: cada passo de 1 para a direita ${a > 0 ? "sobe" : "desce"} ${F.nt(Math.abs(a), 1)} (o degrau laranja). Por isso a reta é ${e.tipo}.`) + ` <b>b</b> é o valor em x = 0: o ponto onde a reta corta o eixo y. Mexer em b só desloca a reta para cima ou para baixo, sem mudar a inclinação.`; };
    ["a", "b"].forEach((n) => q(`[data-v=${n}]`).addEventListener("input", (ev) => poe({ [n]: ev.target.value })));
    SIM.alAfim._ult = { poe, est }; desenha(); };

  /* nome: "Dois pontos, uma reta: descubra a função" · matéria: Matemática · tema: FX02 */
  SIM.alDoisPontos = (el, F) => { let P = [1, 1, 3, 5], ver = false, r = rng(4);
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="novo">outros pontos</button><button class="bt peq" data-v="ver">mostrar</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const est = () => { const [x1, y1, x2, y2] = P, a = M.fr(y2 - y1, x2 - x1), b = M.sub(M.fr(y1), M.mul(a, M.fr(x1))); return { P: P.slice(), a: M.txt(a), b: M.txt(b), av: M.val(a), bv: M.val(b), ver }; };
    const novo = () => { let x1, x2, y1, y2; do { x1 = ri(-5, 4); x2 = ri(x1 + 1, 5); y1 = ri(-6, 6); y2 = ri(-6, 6); } while (x2 - x1 > 6); P = [x1, y1, x2, y2]; ver = false; desenha(); };
    const desenha = () => { const e = est(), [x1, y1, x2, y2] = P;
      q("[data-v=pal]").innerHTML = A.plano({ x: [-7, 7], y: [-8, 8], h: 260, py: 2, fs: ver ? [{ f: (x) => e.av * x + e.bv }] : [], pts: [{ x: x1, y: y1, rot: `(${mn(x1)}; ${mn(y1)})`, dx: -9 }, { x: x2, y: y2, rot: `(${mn(x2)}; ${mn(y2)})` }], segs: ver ? [{ x1, y1, x2, y2: y1, cor: "var(--ok)", tr: false, w: 2 }, { x1: x2, y1, x2, y2, cor: "var(--ok)", tr: false, w: 2 }] : [] });
      q("[data-v=lt]").innerHTML = vis("variação de x", mn(x2 - x1)) + vis("variação de y", ver ? mn(y2 - y1) : "?") + vis("a", ver ? e.a : "?") + vis("b", ver ? e.b : "?");
      q("[data-v=st]").innerHTML = ver ? `a = (variação de y) ÷ (variação de x) = ${mn(y2 - y1)} ÷ ${mn(x2 - x1)} = ${e.a}. Depois, b sai de qualquer um dos pontos: ${mn(y1)} = (${e.a}) · (${mn(x1)}) + b, então b = ${e.b}. Confira no outro ponto.` : `Ache a função afim cujo gráfico passa pelos dois pontos. Primeiro o a (quanto y varia quando x varia), depois o b. Calcule no papel e clique em "mostrar".`; };
    q("[data-v=novo]").addEventListener("click", novo); q("[data-v=ver]").addEventListener("click", () => { ver = true; desenha(); });
    SIM.alDoisPontos._ult = { est, novo, mostra: () => { ver = true; desenha(); }, poe: (o) => { P = o.P.slice(); ver = false; desenha(); }, semente: (s) => { r = rng(s); novo(); } }; desenha(); };

  /* ---------- FX03 ---------- */
  /* nome: "A parábola pela forma canônica: a, h e k" · matéria: Matemática · tema: FX03 */
  SIM.alVertice = (el, F) => { let a = 1, h = 1, k = -4;
    const sl = (n, lo, hi, v, st) => `<label style="font-size:13px;color:var(--ink2)">${n} <input type="range" data-v="${n}" min="${lo}" max="${hi}" step="${st}" value="${v}" style="vertical-align:middle;width:140px"> <b data-r="${n}" style="color:var(--ink);display:inline-block;width:34px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("a", -2, 2, 1, 0.5)}${sl("h", -5, 5, 1, 1)}${sl("k", -6, 6, -4, 1)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    /* a(x − h)² + k = ax² − 2ah·x + (ah² + k) */
    const est = () => { const b = -2 * a * h, c = a * h * h + k, D = b * b - 4 * a * c, z = D < 0 ? [] : D === 0 ? [h] : [h - Math.sqrt(-k / a), h + Math.sqrt(-k / a)]; return { a, h, k, b, c, delta: D, zeros: z, tipo: a > 0 ? "mínimo" : "máximo", imagem: a > 0 ? `y ≥ ${mn(k)}` : `y ≤ ${mn(k)}` }; };
    const poe = (o) => { ({ a, h, k } = { a, h, k, ...o }); a = Math.max(-2, Math.min(2, Math.round(+a * 2) / 2)); if (a === 0) a = 0.5; h = Math.max(-5, Math.min(5, Math.round(+h))); k = Math.max(-6, Math.min(6, Math.round(+k))); desenha(); };
    const desenha = () => { const e = est(); ["a", "h", "k"].forEach((n) => { q(`[data-v=${n}]`).value = String({ a, h, k }[n]); q(`[data-r=${n}]`).textContent = F.nt({ a, h, k }[n], 1); });
      q("[data-v=pal]").innerHTML = A.plano({ x: [-8, 8], y: [-9, 9], h: 270, py: 2, fs: [{ f: (x) => a * (x - h) * (x - h) + k }], segs: [{ x1: h, y1: -9, x2: h, y2: 9, cor: "var(--ok)" }], pts: [...e.zeros.filter((z) => Math.abs(z) <= 8).map((z) => ({ x: z, y: 0, r: 4 })), { x: h, y: k, cor: "var(--ok)", rot: `V (${mn(h)}; ${mn(k)})`, dy: a > 0 ? 18 : -10 }] });
      q("[data-v=lt]").innerHTML = vis("forma canônica", `${a === 1 ? "" : a === -1 ? "−" : F.nt(a, 1)}(x ${h < 0 ? "+" : "−"} ${Math.abs(h)})² ${k < 0 ? "−" : "+"} ${Math.abs(k)}`) + vis("valor " + e.tipo, mn(k)) + vis("imagem", e.imagem) + vis("zeros", e.zeros.length === 0 ? "nenhum" : e.zeros.map((z) => F.nt(z, 2)).join(" e "));
      q("[data-v=st]").innerHTML = `<b>h</b> e <b>k</b> são as coordenadas do vértice: h desloca a parábola para os lados, k para cima e para baixo. <b>a</b> ${a > 0 ? "positivo: boca para cima, e o vértice é o ponto mais baixo (valor mínimo " + mn(k) + ")" : "negativo: boca para baixo, e o vértice é o ponto mais alto (valor máximo " + mn(k) + ")"}. A reta tracejada verde, x = ${mn(h)}, é o eixo de simetria${e.zeros.length === 2 ? ": os dois zeros ficam à mesma distância dela" : ""}.`; };
    ["a", "h", "k"].forEach((n) => q(`[data-v=${n}]`).addEventListener("input", (ev) => poe({ [n]: ev.target.value })));
    SIM.alVertice._ult = { poe, est }; desenha(); };

  /* nome: "A cerca de perímetro fixo: qual retângulo tem a maior área?" · matéria: Matemática · tema: FX03 */
  SIM.alCerca = (el, F) => { let x = 4; const P = 40;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">largura x (m) <input type="range" data-v="x" min="1" max="19" step="0.5" value="4" style="vertical-align:middle;width:260px"></label></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => ({ x, y: P / 2 - x, area: x * (P / 2 - x), perimetro: 2 * x + 2 * (P / 2 - x), max: (P / 4) ** 2 });
    const poe = (o) => { x = Math.max(1, Math.min(19, Math.round(+o.x * 2) / 2)); desenha(); };
    const desenha = () => { const e = est(), u = 7; q("[data-v=x]").value = String(x);
      const ret = `<svg viewBox="0 0 200 172" style="width:200px;flex:none"><rect x="${100 - (x * u) / 2}" y="${76 - (e.y * u) / 2}" width="${x * u}" height="${e.y * u}" style="fill:color-mix(in srgb,var(--mod) 30%,transparent);stroke:var(--mod);stroke-width:2"/>${A.T(100, 166, F.nt(x, 1) + " m × " + F.nt(e.y, 1) + " m", { f: 12, w: 600 })}</svg>`;
      const graf = A.plano({ x: [0, 20], y: [0, 110], h: 200, px: 5, py: 20, rx: "x", ry: "área", fs: [{ f: (t) => t * (20 - t) }], pts: [{ x, y: e.area }], segs: [{ x1: x, y1: 0, x2: x, y2: e.area }] }).replace('width="100%" style="max-width:560px"', 'style="width:400px;flex:none"');
      q("[data-v=pal]").innerHTML = `<div style="display:flex;align-items:center;justify-content:center;gap:10px">${ret}${graf}</div>`;
      q("[data-v=lt]").innerHTML = vis("largura", F.nt(x, 1) + " m") + vis("altura", F.nt(e.y, 1) + " m") + vis("perímetro", e.perimetro + " m") + vis("área", F.nt(e.area, 2) + " m²");
      q("[data-v=st]").innerHTML = `Com 40 m de cerca, largura e altura somam sempre 20. A área, x · (20 − x), é uma função quadrática de boca para baixo: ` + (x === 10 ? `você está no vértice. O quadrado de lado 10 dá a maior área possível, 100 m².` : `tem um ponto mais alto. Você está em ${F.nt(e.area, 2)} m²; continue procurando o topo da parábola.`); };
    q("[data-v=x]").addEventListener("input", (ev) => poe({ x: ev.target.value }));
    SIM.alCerca._ult = { poe, est }; desenha(); };
})();
