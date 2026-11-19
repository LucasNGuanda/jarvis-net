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
})();
