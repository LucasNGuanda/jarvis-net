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

  /* ---------- FX04 ---------- */
  /* reta numérica com um intervalo pintado. o = { min, max, a, b, fora (pinta fora de [a, b]), fa, fb (extremo fechado?), semRot } */
  A.intervalo = (o, D) => { const W = 560, x0 = 40, x1 = 520, X = (v) => x0 + ((v - o.min) / (o.max - o.min)) * (x1 - x0), y = 34; let s = `<line x1="${x0 - 10}" y1="${y}" x2="${x1 + 10}" y2="${y}" style="stroke:var(--ink3);stroke-width:1.4"/>`;
    for (let v = Math.ceil(o.min); v <= o.max; v++) s += `<line x1="${X(v)}" y1="${y - 3}" x2="${X(v)}" y2="${y + 3}" style="stroke:var(--ink3)"/>`;
    const seg = (p, q2) => `<line x1="${p}" y1="${y}" x2="${q2}" y2="${y}" style="stroke:var(--mod);stroke-width:5;stroke-linecap:round"/>`;
    s += o.fora ? seg(x0 - 10, X(o.a)) + seg(X(o.b), x1 + 10) : seg(X(o.a), X(o.b));
    [[o.a, o.fa], [o.b, o.fb]].forEach(([v, f]) => (s += `<circle cx="${X(v)}" cy="${y}" r="6" style="fill:${f ? "var(--mod)" : "var(--card)"};stroke:var(--mod);stroke-width:2.4"/>` + (o.semRot ? "" : A.T(X(v), y + 24, mn(v), { w: 600 }))));
    return D ? D.svg(W, 68, s, "figura") : `<svg viewBox="0 0 ${W} 68" width="100%" style="max-width:${W}px">${s}</svg>`; };

  /* nome: "O módulo é uma distância: |x − a| na reta" · matéria: Matemática · tema: FX04 */
  SIM.alModulo = (el, F) => { let a = 2, r = 3, maior = false;
    const sl = (n, lo, hi, v) => `<label style="font-size:13px;color:var(--ink2)">${n} <input type="range" data-v="${n}" min="${lo}" max="${hi}" step="1" value="${v}" style="vertical-align:middle;width:150px"> <b data-r="${n}" style="color:var(--ink);display:inline-block;width:26px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("a", -4, 4, 2)}${sl("r", 0, 5, 3)}<button class="bt peq" data-m="0">|x − a| &lt; r</button><button class="bt peq" data-m="1">|x − a| &gt; r</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => ({ a, r, maior, esq: a - r, dir: a + r, inteiros: maior ? null : Math.max(0, 2 * r - 1), sol: r === 0 && !maior ? "nenhum x" : maior ? `x < ${mn(a - r)} ou x > ${mn(a + r)}` : `${mn(a - r)} < x < ${mn(a + r)}` });
    const poe = (o) => { ({ a, r, maior } = { a, r, maior, ...o }); a = Math.max(-4, Math.min(4, Math.round(+a))); r = Math.max(0, Math.min(5, Math.round(+r))); maior = !!maior; desenha(); };
    const desenha = () => { const e = est(); q("[data-v=a]").value = String(a); q("[data-v=r]").value = String(r); q("[data-r=a]").textContent = mn(a); q("[data-r=r]").textContent = r; el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(!!+b.dataset.m === maior)));
      q("[data-v=pal]").innerHTML = A.plano({ x: [-10, 10], y: [-1, 8], h: 210, px: 2, fs: [{ f: (x) => Math.abs(x - a) }, { f: () => r, cor: "var(--warn)", tr: true }], pts: [{ x: a - r, y: r, r: 4 }, { x: a + r, y: r, r: 4 }, { x: a, y: 0, cor: "var(--ok)", rot: "a", dy: 18 }] }) + (r === 0 && !maior ? "" : A.intervalo({ min: -10, max: 10, a: a - r, b: a + r, fora: maior, fa: false, fb: false }));
      q("[data-v=lt]").innerHTML = vis("centro a", mn(a)) + vis("raio r", r) + vis("solução", e.sol);
      q("[data-v=st]").innerHTML = `|x − ${a < 0 ? "(" + mn(a) + ")" : a}| é a <b>distância</b> de x até ${mn(a)}. ` + (maior ? `Distância maior que ${r}: os pontos que ficam <b>fora</b> do intervalo de centro ${mn(a)} e raio ${r}. São dois pedaços, um de cada lado.` : r === 0 ? `Distância menor que 0 não existe: nenhum x serve.` : `Distância menor que ${r}: os pontos a menos de ${r} de ${mn(a)}, isto é, entre ${mn(a - r)} e ${mn(a + r)}. No gráfico, é onde o V fica abaixo da linha tracejada.`); };
    ["a", "r"].forEach((n) => q(`[data-v=${n}]`).addEventListener("input", (ev) => poe({ [n]: ev.target.value }))); el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => poe({ maior: !!+b.dataset.m })));
    SIM.alModulo._ult = { poe, est }; desenha(); };

  A.DOBRA = [
    { n: "x − 2", f: (x) => x - 2 }, { n: "x² − 4", f: (x) => x * x - 4 }, { n: "−x² + 2x + 3", f: (x) => -x * x + 2 * x + 3 },
    { n: "x³/4 − x", f: (x) => (x * x * x) / 4 - x }, { n: "−2x + 1", f: (x) => -2 * x + 1 }, { n: "x² + 1", f: (x) => x * x + 1 }];
  /* nome: "Dobre o gráfico: de f(x) para |f(x)|" · matéria: Matemática · tema: FX04 */
  SIM.alDobra = (el, F) => { let i = 1, mod = false;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">f(x) = <select data-v="f" class="bt peq" style="font-size:14px">${A.DOBRA.map((d, k) => `<option value="${k}">${d.n}</option>`).join("")}</select></label><button class="bt peq" data-v="m">aplicar o módulo</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const f = A.DOBRA[i].f; let neg = false, mi = Infinity; for (let x = -5; x <= 5.0001; x += 0.01) { const y = f(x); if (y < -1e-9) neg = true; mi = Math.min(mi, mod ? Math.abs(y) : y); } return { i, mod, temNegativo: neg, minimo: mi, muda: neg }; };
    const poe = (o) => { ({ i, mod } = { i, mod, ...o }); i = Math.max(0, Math.min(A.DOBRA.length - 1, Math.round(+i))); mod = !!mod; desenha(); };
    const desenha = () => { const e = est(), f = A.DOBRA[i].f; q("[data-v=f]").value = String(i); q("[data-v=m]").textContent = mod ? "tirar o módulo" : "aplicar o módulo"; q("[data-v=m]").setAttribute("aria-pressed", String(mod));
      q("[data-v=pal]").innerHTML = A.plano({ x: [-5, 5], y: [-6, 8], h: 250, py: 2, fs: mod ? [{ f, cor: "var(--ink3)", tr: true }, { f: (x) => Math.abs(f(x)) }] : [{ f }] });
      q("[data-v=lt]").innerHTML = vis("gráfico de", mod ? `|${A.DOBRA[i].n}|` : A.DOBRA[i].n) + vis("tem parte abaixo do eixo?", mod ? "não" : e.temNegativo ? "sim" : "não");
      q("[data-v=st]").innerHTML = mod ? (e.muda ? `O módulo deixa como está o que já era positivo e <b>rebate para cima</b>, como uma dobra de papel no eixo x, tudo o que era negativo (a curva tracejada é a original). Onde a função cruzava o eixo aparece um bico.` : `Esta função nunca é negativa: o módulo não muda nada, e |f(x)| = f(x).`) : `Antes de clicar: que parte deste gráfico vai mudar quando se aplicar o módulo, e para onde ela vai?`; };
    q("[data-v=f]").addEventListener("change", (ev) => poe({ i: ev.target.value, mod: false })); q("[data-v=m]").addEventListener("click", () => poe({ mod: !mod }));
    SIM.alDobra._ult = { poe, est }; desenha(); };

  /* ---------- FX05 ---------- */
  const cb = (x) => Math.cbrt(x);
  A.CLASS = [
    { n: "x²", tex: "x^2", f: (x) => x * x, dom: "todos os reais", im: "y ≥ 0", par: "par", cres: "decresce até 0, cresce depois" },
    { n: "x³", tex: "x^3", f: (x) => x * x * x, dom: "todos os reais", im: "todos os reais", par: "ímpar", cres: "crescente sempre" },
    { n: "√x", tex: "\\sqrt{x}", f: (x) => (x < 0 ? NaN : Math.sqrt(x)), dom: "x ≥ 0", im: "y ≥ 0", par: "nem par nem ímpar", cres: "crescente sempre" },
    { n: "∛x", tex: "\\sqrt[3]{x}", f: cb, dom: "todos os reais", im: "todos os reais", par: "ímpar", cres: "crescente sempre" },
    { n: "1/x", tex: "\\dfrac{1}{x}", f: (x) => (x === 0 ? NaN : 1 / x), dom: "x ≠ 0", im: "y ≠ 0", par: "ímpar", cres: "decrescente em cada ramo" },
    { n: "1/x²", tex: "\\dfrac{1}{x^2}", f: (x) => (x === 0 ? NaN : 1 / (x * x)), dom: "x ≠ 0", im: "y > 0", par: "par", cres: "cresce até 0, decresce depois" },
    { n: "|x|", tex: "|x|", f: (x) => Math.abs(x), dom: "todos os reais", im: "y ≥ 0", par: "par", cres: "decresce até 0, cresce depois" },
    { n: "⌊x⌋", tex: "\\lfloor x \\rfloor", f: (x) => Math.floor(x + 1e-12), dom: "todos os reais", im: "os inteiros", par: "nem par nem ímpar", cres: "nunca decresce (sobe em degraus)" }];
  /* curva de uma função clássica, com o corte em x = 0 das hipérboles (dois ramos) e os degraus do piso */
  A.ramos = (c, g) => { const f = g || c.f; if (c.n === "1/x" || c.n === "1/x²") return [{ f: (x) => (x < -0.02 ? f(x) : NaN) }, { f: (x) => (x > 0.02 ? f(x) : NaN), cor: "var(--mod)" }]; return [{ f }]; };
  A.figClass = (c, D, o = {}) => A.plano({ x: [-5, 5], y: [-5, 5], h: 230, iso: true, ...(c.n === "⌊x⌋" ? { fs: [], segs: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => ({ x1: k, y1: k, x2: k + 1, y2: k, cor: "var(--mod)", tr: false, w: 2.4 })), pts: [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => ({ x: k, y: k, r: 3, cor: "var(--mod)" })) } : { fs: A.ramos(c).map((r) => ({ ...r, cor: "var(--mod)" })) }), ...o }, D);

  /* nome: "A galeria das funções clássicas" · matéria: Matemática · tema: FX05 */
  SIM.alGaleria = (el, F) => { let i = 4, x = 2;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">f(x) = <select data-v="f" class="bt peq" style="font-size:14px">${A.CLASS.map((c, k) => `<option value="${k}">${c.n}</option>`).join("")}</select></label><label style="font-size:13px;color:var(--ink2)">x <input type="range" data-v="x" min="-5" max="5" step="0.25" value="2" style="vertical-align:middle;width:220px"></label></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const c = A.CLASS[i], y = c.f(x); return { i, nome: c.n, x, y: Number.isFinite(y) ? y : null, dom: c.dom, im: c.im, par: c.par, cres: c.cres }; };
    const poe = (o) => { ({ i, x } = { i, x, ...o }); i = Math.max(0, Math.min(A.CLASS.length - 1, Math.round(+i))); x = Math.max(-5, Math.min(5, Math.round(+x * 4) / 4)); desenha(); };
    const desenha = () => { const e = est(), c = A.CLASS[i], vis2 = e.y !== null && Math.abs(e.y) <= 5; q("[data-v=f]").value = String(i); q("[data-v=x]").value = String(x);
      q("[data-v=pal]").innerHTML = A.figClass(c, null, { h: 300, pts: (c.n === "⌊x⌋" ? [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => ({ x: k, y: k, r: 3, cor: "var(--mod)" })) : []).concat(vis2 ? [{ x, y: e.y }] : []), segs: (c.n === "⌊x⌋" ? [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => ({ x1: k, y1: k, x2: k + 1, y2: k, cor: "var(--mod)", tr: false, w: 2.4 })) : []).concat(vis2 ? [{ x1: x, y1: 0, x2: x, y2: e.y }] : []) });
      q("[data-v=lt]").innerHTML = vis("x", F.nt(x, 2)) + vis("f(x)", e.y === null ? "não existe" : F.nt(e.y, 3)) + vis("domínio", c.dom) + vis("imagem", c.im) + vis("simetria", c.par);
      q("[data-v=st]").innerHTML = `f(x) = ${c.n}: ${c.cres}. ` + ({ "1/x": "Quanto mais perto de 0 está x, maior fica 1/x em tamanho; quanto maior o x, mais perto de 0 fica 1/x, sem nunca chegar. O gráfico (hipérbole) tem dois ramos e nunca toca os eixos.", "1/x²": "Parecida com 1/x, mas o quadrado deixa tudo positivo: os dois ramos ficam acima do eixo.", "√x": "Só existe para x ≥ 0 e cresce cada vez mais devagar: é a metade de cima de uma parábola deitada.", "∛x": "Existe para todo x, inclusive negativo: ∛(−8) = −2. É o gráfico de x³ com os eixos trocados.", "x³": "Negativa à esquerda, positiva à direita, e crescente o tempo todo, mesmo passando por 0 quase na horizontal.", "⌊x⌋": "O maior inteiro que não passa de x. Cuidado com os negativos: ⌊−2,5⌋ = −3, não −2. Em cada degrau, a bolinha cheia fica na esquerda.", "x²": "A parábola: simétrica em relação ao eixo y.", "|x|": "O V do módulo." })[c.n]; };
    q("[data-v=f]").addEventListener("change", (ev) => poe({ i: ev.target.value })); q("[data-v=x]").addEventListener("input", (ev) => poe({ x: ev.target.value }));
    SIM.alGaleria._ult = { poe, est }; desenha(); };

  /* nome: "Transforme o gráfico: desloque, estique, espelhe" · matéria: Matemática · tema: FX05 */
  SIM.alTransforma = (el, F) => { let i = 0, h = 2, k = 1, c = 1; const BASES = [0, 2, 4, 6, 1];
    const sl = (n, lo, hi, v, st) => `<label style="font-size:13px;color:var(--ink2)">${n} <input type="range" data-v="${n}" min="${lo}" max="${hi}" step="${st}" value="${v}" style="vertical-align:middle;width:120px"> <b data-r="${n}" style="color:var(--ink);display:inline-block;width:30px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">f(x) = <select data-v="f" class="bt peq" style="font-size:14px">${BASES.map((b, j) => `<option value="${j}">${A.CLASS[b].n}</option>`).join("")}</select></label>${sl("h", -4, 4, 2, 1)}${sl("k", -4, 4, 1, 1)}${sl("c", -2, 2, 1, 0.5)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const g = (x) => c * A.CLASS[BASES[i]].f(x - h) + k;
    const est = () => ({ base: A.CLASS[BASES[i]].n, h, k, c, g0: g(h + 1), ponto: [1 + h, c * A.CLASS[BASES[i]].f(1) + k] });
    const poe = (o) => { ({ i, h, k, c } = { i, h, k, c, ...o }); i = Math.max(0, Math.min(BASES.length - 1, Math.round(+i))); h = Math.max(-4, Math.min(4, Math.round(+h))); k = Math.max(-4, Math.min(4, Math.round(+k))); c = Math.max(-2, Math.min(2, Math.round(+c * 2) / 2)); if (c === 0) c = 0.5; desenha(); };
    const desenha = () => { const e = est(), b = A.CLASS[BASES[i]]; q("[data-v=f]").value = String(i); ["h", "k", "c"].forEach((n) => { q(`[data-v=${n}]`).value = String({ h, k, c }[n]); q(`[data-r=${n}]`).textContent = F.nt({ h, k, c }[n], 1); });
      q("[data-v=pal]").innerHTML = A.plano({ x: [-7, 7], y: [-7, 7], h: 300, iso: true, fs: [...A.ramos(b).map((r) => ({ ...r, cor: "var(--ink3)", tr: true })), ...A.ramos(b, null).map((r) => ({ f: (x) => { const y = r.f(x - h); return c * y + k; }, cor: "var(--mod)" }))], pts: [{ x: 1, y: b.f(1), r: 4, cor: "var(--ink3)" }, { x: e.ponto[0], y: e.ponto[1], r: 5 }] });
      const arg = h === 0 ? "x" : `x ${h > 0 ? "−" : "+"} ${Math.abs(h)}`;
      q("[data-v=lt]").innerHTML = vis("nova função", `${c === 1 ? "" : c === -1 ? "−" : F.nt(c, 1) + " · "}f(${arg})${k === 0 ? "" : k > 0 ? ` + ${k}` : ` − ${-k}`}`) + vis("o ponto (1; " + F.nt(b.f(1), 2) + ") foi para", `(${F.nt(e.ponto[0], 2)}; ${F.nt(e.ponto[1], 2)})`);
      q("[data-v=st]").innerHTML = `A curva tracejada é a original, f(x) = ${b.n}. <b>h</b> desloca para os lados: trocar x por x − ${Math.abs(h) || "h"} anda para a ${h < 0 ? "esquerda (porque h é negativo)" : "<b>direita</b>, ao contrário do que o sinal de menos sugere"}. <b>k</b> desloca para cima e para baixo. <b>c</b> estica na vertical${c < 0 ? " e, por ser negativo, espelha o gráfico no eixo x" : ""}.`; };
    q("[data-v=f]").addEventListener("change", (ev) => poe({ i: ev.target.value })); ["h", "k", "c"].forEach((n) => q(`[data-v=${n}]`).addEventListener("input", (ev) => poe({ [n]: ev.target.value })));
    SIM.alTransforma._ult = { poe, est, g: (x) => g(x) }; desenha(); };

  /* ---------- FX06 ---------- */
  A.MAQ = [
    { n: "2x + 3", f: (x) => 2 * x + 3 }, { n: "x²", f: (x) => x * x }, { n: "x − 4", f: (x) => x - 4 },
    { n: "3x", f: (x) => 3 * x }, { n: "√x", f: (x) => (x < 0 ? NaN : Math.sqrt(x)) }, { n: "1/x", f: (x) => (x === 0 ? NaN : 1 / x) }];
  /* nome: "Duas máquinas em série: g(f(x)) e f(g(x))" · matéria: Matemática · tema: FX06 */
  SIM.alComposta = (el, F) => { let i = 0, j = 1, x = 2;
    const se = (n, v) => `<label style="font-size:13px;color:var(--ink2)">${n}(x) = <select data-v="${n}" class="bt peq" style="font-size:14px">${A.MAQ.map((m, k) => `<option value="${k}"${k === v ? " selected" : ""}>${m.n}</option>`).join("")}</select></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${se("f", 0)}${se("g", 1)}<label style="font-size:13px;color:var(--ink2)">x <input type="range" data-v="x" min="-4" max="6" step="1" value="2" style="vertical-align:middle;width:170px"></label></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), num = (v) => (Number.isFinite(v) ? F.nt(v, 3) : "não existe");
    const est = () => { const f = A.MAQ[i].f, g = A.MAQ[j].f, fx = f(x), gx = g(x), gf = Number.isFinite(fx) ? g(fx) : NaN, fg = Number.isFinite(gx) ? f(gx) : NaN, v = (t) => (Number.isFinite(t) ? t : null); return { f: A.MAQ[i].n, g: A.MAQ[j].n, x, fx: v(fx), gx: v(gx), gf: v(gf), fg: v(fg), iguais: Number.isFinite(gf) && Number.isFinite(fg) && Math.abs(gf - fg) < 1e-9 }; };
    const poe = (o) => { ({ i, j, x } = { i, j, x, ...o }); i = Math.max(0, Math.min(5, Math.round(+i))); j = Math.max(0, Math.min(5, Math.round(+j))); x = Math.max(-4, Math.min(6, Math.round(+x))); desenha(); };
    const cx = (x0, y, t, cor) => `<rect x="${x0}" y="${y}" width="84" height="40" rx="8" style="fill:var(--card2);stroke:${cor};stroke-width:2"/>${A.T(x0 + 42, y + 25, t, { w: 700, f: 15 })}`, seta = (x0, y, t) => `<line x1="${x0}" y1="${y}" x2="${x0 + 46}" y2="${y}" style="stroke:var(--ink3);stroke-width:1.6"/><path d="M${x0 + 46} ${y} l-7 -4 v8 z" style="fill:var(--ink3)"/>${A.T(x0 + 23, y - 7, t, { f: 12, c: "var(--ink2)" })}`;
    const linha = (y, a, b, m, r, c1, c2) => A.T(30, y + 25, mn(x), { w: 700, f: 16 }) + seta(50, y + 20, "") + cx(104, y, a, c1) + seta(196, y + 20, m) + cx(250, y, b, c2) + seta(342, y + 20, "") + A.T(440, y + 26, r, { w: 700, f: 17, c: "var(--warn)" });
    const desenha = () => { const e = est(); q("[data-v=f]").value = String(i); q("[data-v=g]").value = String(j); q("[data-v=x]").value = String(x);
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 130" width="100%" style="max-width:560px">${linha(8, "f", "g", num(e.fx === null ? NaN : e.fx), "g(f(x)) = " + num(e.gf === null ? NaN : e.gf), A.COR[0], A.COR[1])}${linha(74, "g", "f", num(e.gx === null ? NaN : e.gx), "f(g(x)) = " + num(e.fg === null ? NaN : e.fg), A.COR[1], A.COR[0])}</svg>`;
      q("[data-v=lt]").innerHTML = vis("x", mn(x)) + vis("f(x)", num(e.fx === null ? NaN : e.fx)) + vis("g(f(x))", num(e.gf === null ? NaN : e.gf)) + vis("g(x)", num(e.gx === null ? NaN : e.gx)) + vis("f(g(x))", num(e.fg === null ? NaN : e.fg));
      q("[data-v=st]").innerHTML = `Em g(f(x)), o x passa <b>primeiro pela f</b> e a saída dela entra na g: lê-se de dentro para fora. ` + (e.gf === null || e.fg === null ? `Aqui uma das composições não existe: a saída da primeira máquina está fora do domínio da segunda.` : e.iguais ? `Neste x as duas ordens deram o mesmo valor; mude o x e veja se isso se mantém.` : `As duas ordens deram valores diferentes: compor funções <b>não é comutativo</b>.`); };
    ["f", "g"].forEach((n) => q(`[data-v=${n}]`).addEventListener("change", (ev) => poe(n === "f" ? { i: ev.target.value } : { j: ev.target.value }))); q("[data-v=x]").addEventListener("input", (ev) => poe({ x: ev.target.value }));
    SIM.alComposta._ult = { poe, est }; desenha(); };

  A.INV = [
    { n: "2x + 1", f: (x) => 2 * x + 1, inv: (y) => (y - 1) / 2, invN: "(x − 1)/2", dom: [-5, 5] },
    { n: "x³", f: (x) => x * x * x, inv: (y) => Math.cbrt(y), invN: "∛x", dom: [-5, 5] },
    { n: "x² (com x ≥ 0)", f: (x) => (x < 0 ? NaN : x * x), inv: (y) => (y < 0 ? NaN : Math.sqrt(y)), invN: "√x", dom: [0, 5] },
    { n: "x² (todos os reais)", f: (x) => x * x, inv: null, dom: [-5, 5] },
    { n: "1/x", f: (x) => (Math.abs(x) < 0.03 ? NaN : 1 / x), inv: (y) => (Math.abs(y) < 0.03 ? NaN : 1 / y), invN: "1/x (ela mesma)", dom: [-5, 5] },
    { n: "|x| − 2", f: (x) => Math.abs(x) - 2, inv: null, dom: [-5, 5] }];
  A.injetora = (c) => { const ys = []; for (let x = c.dom[0]; x <= c.dom[1] + 1e-9; x += 0.05) { const y = c.f(x); if (!Number.isFinite(y)) continue; if (ys.some((v) => Math.abs(v - y) < 1e-9)) return false; ys.push(y); } return true; };
  /* nome: "O espelho na reta y = x: a função e a sua inversa" · matéria: Matemática · tema: FX06 */
  SIM.alInversa = (el, F) => { let i = 0, ver = false, t = 1;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">f(x) = <select data-v="f" class="bt peq" style="font-size:14px">${A.INV.map((c, k) => `<option value="${k}">${c.n}</option>`).join("")}</select></label><label style="font-size:13px;color:var(--ink2)">ponto <input type="range" data-v="t" min="-2" max="2" step="0.25" value="1" style="vertical-align:middle;width:140px"></label><button class="bt peq" data-v="ver">espelhar</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const c = A.INV[i], y = c.f(t); return { i, nome: c.n, ver, t, y: Number.isFinite(y) ? y : null, injetora: A.injetora(c), temInversa: !!c.inv, invN: c.invN || null, volta: c.inv && Number.isFinite(y) ? c.inv(y) : null }; };
    const poe = (o) => { if (o.i !== undefined && +o.i !== i) ver = false; ({ i, ver, t } = { i, ver, t, ...o }); i = Math.max(0, Math.min(A.INV.length - 1, Math.round(+i))); t = Math.max(-2, Math.min(2, +t)); ver = !!ver; desenha(); };
    const desenha = () => { const e = est(), c = A.INV[i], ok = e.y !== null && Math.abs(e.y) <= 5; q("[data-v=f]").value = String(i); q("[data-v=t]").value = String(t); q("[data-v=ver]").textContent = ver ? "esconder o espelho" : "espelhar";
      /* a curva espelhada é desenhada como pontos (y, x): assim aparece mesmo quando não é função */
      const esp = []; if (ver) for (let x = c.dom[0]; x <= c.dom[1] + 1e-9; x += 0.04) { const y = c.f(x); if (Number.isFinite(y) && Math.abs(y) <= 5) esp.push({ x: y, y: x, r: 1.3, cor: "var(--ok)" }); }
      q("[data-v=pal]").innerHTML = A.plano({ x: [-5, 5], y: [-5, 5], h: 320, iso: true, fs: [{ f: (x) => x, cor: "var(--ink3)", tr: true }, ...(c.n === "1/x" ? [{ f: (x) => (x < -0.03 ? 1 / x : NaN), cor: "var(--mod)" }, { f: (x) => (x > 0.03 ? 1 / x : NaN), cor: "var(--mod)" }] : [{ f: c.f, cor: "var(--mod)", dom: c.dom }])], pts: esp.concat(ok ? [{ x: t, y: e.y, r: 5 }].concat(ver ? [{ x: e.y, y: t, r: 5, cor: "var(--ok)" }] : []) : []), segs: ok && ver ? [{ x1: t, y1: e.y, x2: e.y, y2: t }] : [] });
      q("[data-v=lt]").innerHTML = vis("ponto de f", ok ? `(${F.nt(t, 2)}; ${F.nt(e.y, 2)})` : "fora") + vis("ponto espelhado", ver && ok ? `(${F.nt(e.y, 2)}; ${F.nt(t, 2)})` : "?") + vis("inversa", ver ? (e.temInversa ? e.invN : "não existe") : "?");
      q("[data-v=st]").innerHTML = !ver ? `A reta tracejada é y = x. Antes de espelhar: se você trocar x por y em cada ponto do gráfico, a curva nova ainda será o gráfico de uma função?` : e.temInversa ? `Cada ponto (a, b) de f virou (b, a): a curva verde é o gráfico da inversa, ${e.invN}. Ela passa no teste da reta vertical porque f passava no da reta <b>horizontal</b> (f é injetora).` : `A curva verde <b>não é função</b>: há retas verticais que a cortam duas vezes. Isso acontece porque f repete valores (não é injetora): duas entradas diferentes com a mesma saída não dá para desfazer.`; };
    q("[data-v=f]").addEventListener("change", (ev) => poe({ i: ev.target.value })); q("[data-v=t]").addEventListener("input", (ev) => poe({ t: ev.target.value })); q("[data-v=ver]").addEventListener("click", () => poe({ ver: !ver }));
    SIM.alInversa._ult = { poe, est }; desenha(); };
})();
