/* Matemática · módulo AL (Álgebra): laboratórios de exponencial e logaritmo, LOG01 a LOG04.
   LOG01: SIM.alExpo (y = aˣ, mexendo na base), SIM.alDuplica (dobrar e reduzir à metade em tempos iguais) e SIM.alNumeroE ((1 + 1/n)ⁿ).
   Contas conferidas em Python (tools/matematica/confere-al.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, { vis, rng, mn } = A;

  /* ---------- LOG01 ---------- */
  /* nome: "A exponencial y = aˣ: mexa na base" · matéria: Matemática · tema: LOG01 */
  SIM.alExpo = (el, F) => { let a = 2, x = 1;
    const sl = (n, lo, hi, v, st, w) => `<label style="font-size:13px;color:var(--ink2)">${n} <input type="range" data-v="${n}" min="${lo}" max="${hi}" step="${st}" value="${v}" style="vertical-align:middle;width:${w}px"> <b data-r="${n}" style="color:var(--ink);display:inline-block;width:34px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("base a", 0.2, 4, 2, 0.1, 190).replace(/data-v="base a"/, 'data-v="a"').replace(/data-r="base a"/, 'data-r="a"')}${sl("x", -4, 4, 1, 0.5, 170)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => ({ a, x, y: a ** x, tipo: a > 1 ? "crescente" : a < 1 ? "decrescente" : "constante", razao: a ** (x + 1) / a ** x });
    const poe = (o) => { ({ a, x } = { a, x, ...o }); a = Math.max(0.2, Math.min(4, Math.round(+a * 10) / 10)); x = Math.max(-4, Math.min(4, Math.round(+x * 2) / 2)); desenha(); };
    const desenha = () => { const e = est(); q("[data-v=a]").value = String(a); q("[data-v=x]").value = String(x); q("[data-r=a]").textContent = F.nt(a, 1); q("[data-r=x]").textContent = F.nt(x, 1);
      q("[data-v=pal]").innerHTML = A.plano({ x: [-4.5, 4.5], y: [-1, 9], h: 260, fs: [{ f: (t) => a ** t }], pts: [{ x: 0, y: 1, cor: "var(--ok)", rot: "(0; 1)", dx: -9 }].concat(e.y <= 9 ? [{ x, y: e.y }] : []), segs: e.y <= 9 ? [{ x1: x, y1: 0, x2: x, y2: e.y }] : [] });
      q("[data-v=lt]").innerHTML = vis("função", `y = ${F.nt(a, 1)}ˣ`) + vis("x", F.nt(x, 1)) + vis("y", F.nt(e.y, 4)) + vis("é", e.tipo);
      q("[data-v=st]").innerHTML = a === 1 ? `Com base 1 a função é constante: 1 elevado a qualquer coisa é 1. Por isso a base 1 fica de fora da definição.` : `Cada passo de 1 para a direita <b>multiplica</b> y por ${F.nt(a, 1)}${a > 1 ? ": a curva sobe cada vez mais depressa" : ", que é menor que 1: a curva desce, cada vez mais devagar, sem nunca tocar o eixo"}. O ponto (0; 1) não se mexe quando a base muda: todo número elevado a 0 dá 1. E y nunca é zero nem negativo.`; };
    ["a", "x"].forEach((n) => q(`[data-v=${n}]`).addEventListener("input", (ev) => poe({ [n]: ev.target.value })));
    SIM.alExpo._ult = { poe, est }; desenha(); };

  /* nome: "Dobrar e reduzir à metade: o tempo que não muda" · matéria: Matemática · tema: LOG01 */
  SIM.alDuplica = (el, F) => { let T = 2, t = 6, decai = false; const N0 = 100;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-m="0">crescimento (dobra)</button><button class="bt peq" data-m="1">decaimento (meia-vida)</button><label style="font-size:13px;color:var(--ink2)">período T <input type="range" data-v="T" min="1" max="5" step="1" value="2" style="vertical-align:middle;width:110px"> <b data-r="T" style="color:var(--ink)"></b></label><label style="font-size:13px;color:var(--ink2)">tempo t <input type="range" data-v="t" min="0" max="20" step="1" value="6" style="vertical-align:middle;width:170px"> <b data-r="t" style="color:var(--ink)"></b></label></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const N = (tt) => N0 * (decai ? 0.5 : 2) ** (tt / T);
    const est = () => ({ T, t, decai, N: N(t), periodos: t / T, fator: N(t) / N0 });
    const poe = (o) => { ({ T, t, decai } = { T, t, decai, ...o }); T = Math.max(1, Math.min(5, Math.round(+T))); t = Math.max(0, Math.min(20, Math.round(+t))); decai = !!decai; desenha(); };
    const desenha = () => { const e = est(), ymax = decai ? 110 : 1700; q("[data-v=T]").value = String(T); q("[data-v=t]").value = String(t); q("[data-r=T]").textContent = T + " h"; q("[data-r=t]").textContent = t + " h"; el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(!!+b.dataset.m === decai)));
      const marcos = []; for (let k = 0; k * T <= 20; k++) if (N(k * T) <= ymax) marcos.push({ x: k * T, y: N(k * T), r: 3.5, cor: "var(--ok)" });
      q("[data-v=pal]").innerHTML = A.plano({ x: [0, 21], y: [0, ymax], h: 250, px: 2, py: decai ? 20 : 400, rx: "t (h)", ry: "N", fs: [{ f: N }], pts: marcos.concat(e.N <= ymax ? [{ x: t, y: e.N }] : []) });
      q("[data-v=lt]").innerHTML = vis("começo", N0) + vis("períodos passados", F.nt(e.periodos, 3)) + vis("fator", F.nt(e.fator, 4)) + vis("N agora", F.nt(e.N, 2));
      q("[data-v=st]").innerHTML = decai ? `A cada ${T} h sobra <b>metade</b> do que havia, seja qual for a quantidade: 100, 50, 25, 12,5... (os pontos verdes). Em ${t} h passaram ${F.nt(e.periodos, 3)} meias-vidas, e o fator é (1/2) elevado a ${F.nt(e.periodos, 3)}.` : `A cada ${T} h a quantidade <b>dobra</b>, seja qual for: 100, 200, 400, 800... (os pontos verdes). Em ${t} h passaram ${F.nt(e.periodos, 3)} períodos, e o fator é 2 elevado a ${F.nt(e.periodos, 3)}.`; };
    ["T", "t"].forEach((n) => q(`[data-v=${n}]`).addEventListener("input", (ev) => poe({ [n]: ev.target.value }))); el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => poe({ decai: !!+b.dataset.m })));
    SIM.alDuplica._ult = { poe, est }; desenha(); };

  /* nome: "Juros cada vez mais frequentes: de onde sai o número e" · matéria: Matemática · tema: LOG01 */
  SIM.alNumeroE = (el, F) => { const NS = [1, 2, 4, 12, 52, 365, 8760, 525600, 31536000], NOME = ["1 vez (ao ano)", "2 vezes (semestre)", "4 vezes (trimestre)", "12 vezes (mês)", "52 vezes (semana)", "365 vezes (dia)", "8 760 vezes (hora)", "525 600 vezes (minuto)", "31 536 000 vezes (segundo)"]; let i = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">juros de 100% ao ano, pagos em <input type="range" data-v="i" min="0" max="8" step="1" value="0" style="vertical-align:middle;width:220px"></label></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:14px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const n = NS[i], v = (1 + 1 / n) ** n; return { i, n, v, falta: Math.E - v }; };
    const poe = (o) => { i = Math.max(0, Math.min(8, Math.round(+o.i))); desenha(); };
    const desenha = () => { const e = est(); q("[data-v=i]").value = String(i);
      q("[data-v=pal]").innerHTML = `<div style="font-size:14px;color:var(--ink2)">${NOME[i]}</div><div style="font:700 40px/1.3 Inter,system-ui,sans-serif">(1 + 1/${F.nt(e.n, 0)})<sup style="font-size:22px">${F.nt(e.n, 0)}</sup> = <span style="color:var(--mod)">${F.nt(e.v, 6)}</span></div>`;
      q("[data-v=lt]").innerHTML = vis("1 real vira", F.nt(e.v, 6) + " reais") + vis("falta para e", F.nt(e.falta, 6));
      q("[data-v=st]").innerHTML = `Com 100% ao ano pagos de uma vez, 1 real vira 2. ${e.n === 1 ? "Dividindo os mesmos 100% em vários pagamentos" : "Dividindo os mesmos 100% em " + F.nt(e.n, 0) + " pagamentos"}, cada um rende sobre o anterior, e o total cresce. Mas <b>não cresce sem limite</b>: quanto mais se divide, mais o resultado se aproxima de um número fixo, e ≈ ${F.nt(Math.E, 6)}. Esse número é a base "natural" das exponenciais.`; };
    q("[data-v=i]").addEventListener("input", (ev) => poe({ i: ev.target.value }));
    SIM.alNumeroE._ult = { poe, est }; desenha(); };
})();
