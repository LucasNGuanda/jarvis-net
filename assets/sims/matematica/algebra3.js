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

  /* ---------- LOG02 ---------- */
  const fracTxt = (n, d) => { const f = M.fr(n, d); return M.txt(f); };
  /* nome: "Logaritmo é expoente: aˣ = b" · matéria: Matemática · tema: LOG02 */
  SIM.alLogDef = (el, F) => { let a = 2, x = 3;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">base <select data-v="a" class="bt peq" style="font-size:15px">${[2, 3, 5, 10].map((v) => `<option>${v}</option>`).join("")}</select></label><label style="font-size:13px;color:var(--ink2)">expoente x <input type="range" data-v="x" min="-3" max="6" step="0.5" value="3" style="vertical-align:middle;width:240px"></label></div></div></div><div class="palco" data-v="pal" style="padding:8px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => ({ a, x, b: a ** x, log: Math.log(a ** x) / Math.log(a), inteiro: Number.isInteger(x) });
    const poe = (o) => { ({ a, x } = { a, x, ...o }); a = [2, 3, 5, 10].includes(+a) ? +a : 2; x = Math.max(-3, Math.min(6, Math.round(+x * 2) / 2)); desenha(); };
    const desenha = () => { const e = est(), X = (k) => 40 + ((k + 3) / 9) * 480; q("[data-v=a]").value = String(a); q("[data-v=x]").value = String(x);
      let o = `<line x1="30" y1="60" x2="530" y2="60" style="stroke:var(--ink3);stroke-width:1.4"/>`; for (let k = -3; k <= 6; k++) { const val = k >= 0 ? String(a ** k) : `1/${a ** -k}`; o += `<line x1="${X(k)}" y1="54" x2="${X(k)}" y2="66" style="stroke:var(--ink3)"/>` + A.T(X(k), 44, val, { f: val.length > 6 ? 9 : val.length > 4 ? 11 : 13, w: 600 }) + A.T(X(k), 84, mn(k), { f: 12, c: "var(--ink2)" }); }
      o += `<circle cx="${X(x)}" cy="60" r="7" style="fill:var(--warn)"/>` + A.T(22, 44, "b", { f: 12, c: "var(--ink2)" }) + A.T(22, 84, "x", { f: 12, c: "var(--ink2)" });
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 96" width="100%" style="max-width:560px">${o}</svg>`;
      const bt = e.inteiro && x < 0 ? `1/${a ** -x}` : F.nt(e.b, 4);
      q("[data-v=lt]").innerHTML = vis("potência", `${a} elevado a ${F.nt(x, 1)} = ${bt}`) + vis("logaritmo", `log de ${bt} na base ${a} = ${F.nt(x, 1)}`);
      q("[data-v=st]").innerHTML = `São a <b>mesma informação</b> escrita de dois jeitos. A linha de cima da régua tem os números b; a de baixo, os expoentes x. O logaritmo lê a régua de cima para baixo: dado o número, devolve o expoente. ` + (e.inteiro ? (x < 0 ? `Logaritmo negativo não é erro: quer dizer que o número é menor que 1.` : x === 0 ? `O logaritmo de 1 é 0 em qualquer base.` : ``) : `Entre duas potências inteiras, o logaritmo é um número "quebrado": ${F.nt(e.b, 4)} está entre ${a ** Math.floor(x) >= 1 ? a ** Math.floor(x) : "1/" + a ** -Math.floor(x)} e ${a ** Math.ceil(x) >= 1 ? a ** Math.ceil(x) : "1/" + a ** -Math.ceil(x)}.`); };
    q("[data-v=a]").addEventListener("change", (ev) => poe({ a: ev.target.value })); q("[data-v=x]").addEventListener("input", (ev) => poe({ x: ev.target.value }));
    SIM.alLogDef._ult = { poe, est }; desenha(); };

  /* nome: "A régua de cálculo: somar logaritmos para multiplicar" · matéria: Matemática · tema: LOG02 */
  SIM.alReguaLog = (el, F) => { let m = 2, n = 3;
    const sl = (k, v) => `<label style="font-size:13px;color:var(--ink2)">${k} <input type="range" data-v="${k}" min="1" max="10" step="1" value="${v}" style="vertical-align:middle;width:170px"> <b data-r="${k}" style="color:var(--ink);display:inline-block;width:22px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("m", 2)}${sl("n", 3)}</div></div></div><div class="palco" data-v="pal" style="padding:8px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), L = (v) => Math.log10(v);
    const est = () => ({ m, n, lm: L(m), ln: L(n), soma: L(m) + L(n), prod: m * n, volta: 10 ** (L(m) + L(n)) });
    const poe = (o) => { ({ m, n } = { m, n, ...o }); m = Math.max(1, Math.min(10, Math.round(+m))); n = Math.max(1, Math.min(10, Math.round(+n))); desenha(); };
    const desenha = () => { const e = est(), X = (v) => 40 + (L(v) / 2) * 480; q("[data-v=m]").value = String(m); q("[data-v=n]").value = String(n); q("[data-r=m]").textContent = m; q("[data-r=n]").textContent = n;
      let o = `<line x1="40" y1="96" x2="520" y2="96" style="stroke:var(--ink2);stroke-width:1.6"/>`; [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].forEach((v) => { const g = [1, 2, 3, 5, 10, 20, 30, 50, 100].includes(v); o += `<line x1="${X(v)}" y1="${g ? 86 : 90}" x2="${X(v)}" y2="96" style="stroke:var(--ink3)"/>` + (g ? A.T(X(v), 112, v, { f: 11, c: "var(--ink2)" }) : ""); });
      o += `<rect x="${X(1)}" y="28" width="${X(m) - X(1)}" height="16" rx="3" style="fill:var(--mod);opacity:.8"/>` + (m > 1 ? A.T((X(1) + X(m)) / 2, 22, `log ${m}`, { f: 11 }) : "") + `<rect x="${X(m)}" y="52" width="${X(m * n) - X(m)}" height="16" rx="3" style="fill:var(--ok);opacity:.8"/>` + (n > 1 ? A.T((X(m) + X(m * n)) / 2, 82, `log ${n}`, { f: 11 }) : "") + `<line x1="${X(m * n)}" y1="26" x2="${X(m * n)}" y2="96" style="stroke:var(--warn);stroke-width:2"/><circle cx="${X(m * n)}" cy="96" r="5" style="fill:var(--warn)"/>`;
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 120" width="100%" style="max-width:560px">${o}</svg>`;
      q("[data-v=lt]").innerHTML = vis(`log ${m}`, F.nt(e.lm, 4)) + vis(`log ${n}`, F.nt(e.ln, 4)) + vis("soma", F.nt(e.soma, 4)) + vis(`log ${m * n}`, F.nt(L(m * n), 4));
      q("[data-v=st]").innerHTML = `Nesta régua, a distância do 1 até um número é o logaritmo dele (base 10). Emendando a barra de comprimento log ${m} com a de comprimento log ${n}, chega-se exatamente em <b>${m * n}</b>: somar logaritmos é multiplicar números. É esse o princípio da régua de cálculo, e é por isso que, nesta escala, de 1 a 10 há o mesmo espaço que de 10 a 100.`; };
    ["m", "n"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.alReguaLog._ult = { poe, est }; desenha(); };

  /* nome: "De cabeça: quanto vale este logaritmo?" · matéria: Matemática · tema: LOG02 */
  SIM.alLogQuiz = (el, F) => { let r = rng(7), it = null, resp = -1, pontos = 0, feitas = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="pal" style="text-align:center;padding:14px 10px"></div><div class="ctrls"><div><div class="bts" data-v="ops" style="justify-content:center"></div><div class="bts" style="margin-top:6px;justify-content:center"><button class="bt peq" data-v="novo">outro</button></div></div></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const novo = () => { let raiz, i, j; do { raiz = [2, 3, 5, 10][ri(0, 3)]; i = ri(1, raiz === 2 ? 4 : raiz === 10 ? 1 : 2); j = ri(-3, raiz === 2 ? 6 : raiz === 10 ? 4 : 4); } while (j === 0 && r() < 0.7 || raiz ** Math.abs(j) > 100000);
      const base = raiz ** i, arg = j >= 0 ? String(raiz ** j) : `1/${raiz ** -j}`, val = M.fr(j, i), cand = [M.fr(i, j || 1), M.fr(-j, i), M.fr(j * i, 1), M.fr(j - i, 1), M.fr(j + 1, i), M.fr(j, i + 1)].map(M.txt).filter((t, k, a2) => t !== M.txt(val) && a2.indexOf(t) === k).slice(0, 3);
      const ops = [M.txt(val), ...cand].map((t, k) => [t, k === 0, r()]).sort((p, s) => p[2] - s[2]); it = { base, arg, raiz, i, j, val: M.txt(val), ops: ops.map((o) => o[0]), certa: ops.findIndex((o) => o[1]) }; resp = -1; desenha(); };
    const responde = (k) => { if (resp >= 0) return; resp = k; feitas++; if (k === it.certa) pontos++; desenha(); };
    const est = () => ({ ...it, resp, pontos, feitas, num: it.j / it.i });
    const desenha = () => { q("[data-v=pal]").innerHTML = `<div style="font:700 38px/1.3 Inter,system-ui,sans-serif">log<sub style="font-size:20px">${it.base}</sub> ${it.arg} = ?</div>`;
      q("[data-v=ops]").innerHTML = it.ops.map((t, k) => `<button class="bt peq" data-o="${k}" style="font-size:16px;min-width:56px${resp >= 0 && k === it.certa ? ";border-color:var(--ok);color:var(--ok)" : resp === k ? ";border-color:var(--warn);color:var(--warn)" : ""}">${t}</button>`).join("");
      el.querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => responde(+b.dataset.o)));
      q("[data-v=lt]").innerHTML = vis("acertos nesta sessão", `${pontos} de ${feitas}`);
      q("[data-v=st]").innerHTML = resp < 0 ? `Faça a pergunta certa: "${it.base} elevado a quanto dá ${it.arg}?"` : (resp === it.certa ? "Certo. " : "Ainda não: a certa está marcada. ") + (it.i === 1 ? `${it.base} elevado a ${mn(it.j)} dá ${it.arg}.` : `Tudo é potência de ${it.raiz}: ${it.base} = ${it.raiz}${M.sup(it.i)} e ${it.arg} = ${it.raiz}${M.sup(it.j)}. De (${it.raiz}${M.sup(it.i)})ˣ = ${it.raiz}${M.sup(it.j)} vem ${it.i}x = ${mn(it.j)}, x = ${it.val}.`); };
    q("[data-v=novo]").addEventListener("click", novo);
    SIM.alLogQuiz._ult = { est, novo, responde, semente: (s) => { r = rng(s); pontos = 0; feitas = 0; novo(); } }; novo(); };

  /* ---------- LOG03 ---------- */
  A.logb = (a, x) => Math.log(x) / Math.log(a);
  /* nome: "Exponencial e logaritmo: uma é o espelho da outra" · matéria: Matemática · tema: LOG03 */
  SIM.alLogGraf = (el, F) => { let a = 2, x = 4;
    const sl = (n, d, lo, hi, v, st, w) => `<label style="font-size:13px;color:var(--ink2)">${n} <input type="range" data-v="${d}" min="${lo}" max="${hi}" step="${st}" value="${v}" style="vertical-align:middle;width:${w}px"> <b data-r="${d}" style="color:var(--ink);display:inline-block;width:34px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("base a", "a", 0.2, 4, 2, 0.1, 170)}${sl("x", "x", 0.25, 8, 4, 0.25, 190)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => ({ a, x, y: A.logb(a, x), tipo: a > 1 ? "crescente" : "decrescente", volta: a ** A.logb(a, x) });
    const poe = (o) => { ({ a, x } = { a, x, ...o }); a = Math.max(0.2, Math.min(4, Math.round(+a * 10) / 10)); if (a === 1) a = 1.1; x = Math.max(0.25, Math.min(8, Math.round(+x * 4) / 4)); desenha(); };
    const desenha = () => { const e = est(), dentro = Math.abs(e.y) <= 6; q("[data-v=a]").value = String(a); q("[data-v=x]").value = String(x); q("[data-r=a]").textContent = F.nt(a, 1); q("[data-r=x]").textContent = F.nt(x, 2);
      q("[data-v=pal]").innerHTML = A.plano({ x: [-6, 8.5], y: [-6, 8.5], h: 330, iso: true, fs: [{ f: (t) => t, cor: "var(--ink3)", tr: true }, { f: (t) => a ** t, cor: "var(--ok)" }, { f: (t) => (t > 0.004 ? A.logb(a, t) : NaN), cor: "var(--mod)" }], pts: dentro ? [{ x, y: e.y, rot: "log", dy: 16 }, { x: e.y, y: x, cor: "var(--ok)", rot: "exp", dx: -9 }] : [], segs: dentro ? [{ x1: x, y1: e.y, x2: e.y, y2: x }] : [] });
      q("[data-v=lt]").innerHTML = vis("x", F.nt(x, 2)) + vis(`log de x na base ${F.nt(a, 1)}`, F.nt(e.y, 4)) + vis("é", e.tipo) + vis("domínio", "x > 0");
      q("[data-v=st]").innerHTML = `A curva verde é y = ${F.nt(a, 1)}ˣ; a roxa é o logaritmo de base ${F.nt(a, 1)}, a sua inversa: uma é o espelho da outra na reta tracejada y = x. O ponto (${F.nt(x, 2)}; ${F.nt(e.y, 2)}) do logaritmo é o ponto (${F.nt(e.y, 2)}; ${F.nt(x, 2)}) da exponencial. Por isso o que era "a exponencial nunca toca o eixo x" vira "o logaritmo nunca toca o eixo y": ele só existe para x > 0. ${a > 1 ? "Base maior que 1: as duas crescem." : "Base entre 0 e 1: as duas decrescem."}`; };
    ["a", "x"].forEach((n) => q(`[data-v=${n}]`).addEventListener("input", (ev) => poe({ [n]: ev.target.value })));
    SIM.alLogGraf._ult = { poe, est }; desenha(); };

  /* funções de dentro do logaritmo, com o domínio de log(g(x)) escrito e os zeros de g */
  A.LDOM = [
    { n: "x − 2", g: (x) => x - 2, dom: "x > 2", z: [2] }, { n: "4 − x", g: (x) => 4 - x, dom: "x < 4", z: [4] },
    { n: "x² − 4", g: (x) => x * x - 4, dom: "x < −2 ou x > 2", z: [-2, 2] }, { n: "9 − x²", g: (x) => 9 - x * x, dom: "−3 < x < 3", z: [-3, 3] },
    { n: "x² + 1", g: (x) => x * x + 1, dom: "todo x real", z: [] }, { n: "2x + 6", g: (x) => 2 * x + 6, dom: "x > −3", z: [-3] },
    { n: "x² − 5x + 4", g: (x) => x * x - 5 * x + 4, dom: "x < 1 ou x > 4", z: [1, 4] }, { n: "−x² − 1", g: (x) => -x * x - 1, dom: "nenhum x", z: [] }];
  /* nome: "Onde o logaritmo existe? O domínio de log(g(x))" · matéria: Matemática · tema: LOG03 */
  SIM.alLogDominio = (el, F) => { let i = 2, ver = false, x = 3;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">f(x) = log ( <select data-v="g" class="bt peq" style="font-size:14px">${A.LDOM.map((d, k) => `<option value="${k}">${d.n}</option>`).join("")}</select> )</label><label style="font-size:13px;color:var(--ink2)">teste x <input type="range" data-v="x" min="-6" max="6" step="0.5" value="3" style="vertical-align:middle;width:150px"></label><button class="bt peq" data-v="ver">mostrar o domínio</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const d = A.LDOM[i], g = d.g(x); return { i, nome: d.n, x, g, existe: g > 0, dom: d.dom, ver, valor: g > 0 ? Math.log10(g) : null }; };
    const poe = (o) => { if (o.i !== undefined && +o.i !== i) ver = false; ({ i, ver, x } = { i, ver, x, ...o }); i = Math.max(0, Math.min(A.LDOM.length - 1, Math.round(+i))); x = Math.max(-6, Math.min(6, Math.round(+x * 2) / 2)); ver = !!ver; desenha(); };
    const desenha = () => { const e = est(), d = A.LDOM[i]; q("[data-v=g]").value = String(i); q("[data-v=x]").value = String(x);
      const faixa = []; if (ver) for (let t = -6; t < 6; t += 0.1) if (d.g(t + 0.05) > 0) faixa.push({ x1: t, y1: 0, x2: t + 0.1, y2: 0, cor: "var(--ok)", tr: false, w: 6 });
      q("[data-v=pal]").innerHTML = A.plano({ x: [-6.5, 6.5], y: [-8, 10], h: 250, py: 2, fs: [{ f: d.g }], segs: faixa, pts: (ver ? d.z.map((z) => ({ x: z, y: 0, oco: true, cor: "var(--ok)", r: 5 })) : []).concat(Math.abs(e.g) <= 10 ? [{ x, y: e.g, cor: e.existe ? "var(--ok)" : "var(--warn)" }] : []) });
      q("[data-v=lt]").innerHTML = vis("x testado", F.nt(x, 1)) + vis(`valor de ${d.n}`, F.nt(e.g, 2)) + vis("log existe aqui?", e.existe ? "sim" : "não") + vis("domínio", ver ? d.dom : "?");
      q("[data-v=st]").innerHTML = `O gráfico é o do que está <b>dentro</b> do logaritmo. O log só existe onde esse valor é positivo: onde a curva está acima do eixo x. ` + (ver ? `A faixa verde no eixo é o domínio: ${d.dom}. As bolinhas vazias são os zeros, que <b>não</b> entram (log de 0 não existe).` : `Teste alguns valores de x, decida qual é o domínio e clique em "mostrar o domínio".`); };
    q("[data-v=g]").addEventListener("change", (ev) => poe({ i: ev.target.value })); q("[data-v=x]").addEventListener("input", (ev) => poe({ x: ev.target.value })); q("[data-v=ver]").addEventListener("click", () => poe({ ver: true }));
    SIM.alLogDominio._ult = { poe, est }; desenha(); };

  /* nome: "Escala comum e escala logarítmica" · matéria: Matemática · tema: LOG03 */
  SIM.alEscalaLog = (el, F) => { let log = false; const NS = [1, 10, 100, 1000, 10000, 100000];
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-m="0">escala comum</button><button class="bt peq" data-m="1">escala logarítmica</button></div></div></div><div class="palco" data-v="pal" style="padding:10px 0"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const pos = (v) => (log ? Math.log10(v) / 5 : (v - 1) / 99999);
    const est = () => ({ log, pos: NS.map(pos), espacos: NS.slice(1).map((v, k) => pos(v) - pos(NS[k])) });
    const poe = (o) => { log = !!o.log; desenha(); };
    const desenha = () => { el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(!!+b.dataset.m === log))); const X = (v) => 40 + pos(v) * 480;
      let o = `<line x1="40" y1="50" x2="520" y2="50" style="stroke:var(--ink2);stroke-width:1.6"/>`; NS.forEach((v, k) => { o += `<circle cx="${X(v)}" cy="50" r="6" style="fill:${A.COR[k % 4]}"/>` + (log || v >= 10000 ? A.T(X(v), k % 2 ? 80 : 30, F.nt(v, 0), { f: 12, w: 600 }) : ""); }); if (!log) o += A.T(40, 84, "1, 10, 100 e 1000 (um por cima do outro)", { f: 12, w: 600, a: "start" });
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 96" width="100%" style="max-width:560px">${o}</svg>`;
      q("[data-v=st]").innerHTML = log ? `Na escala logarítmica, a posição é o <b>logaritmo</b> do número: 1, 10, 100, 1000... ficam igualmente espaçados, porque cada um é 10 vezes o anterior e log 10 = 1. Distâncias iguais significam <b>razões</b> iguais.` : `Na escala comum, distâncias iguais significam <b>diferenças</b> iguais. Com números de tamanhos tão diferentes, 1, 10, 100 e 1000 ficam todos amontoados no começo: não dá para vê-los.`; };
    el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => poe({ log: !!+b.dataset.m })));
    SIM.alEscalaLog._ult = { poe, est }; desenha(); };

  /* ---------- LOG04 ---------- */
  /* nome: "Resolva e confira: a raiz que não serve" · matéria: Matemática · tema: LOG04 */
  SIM.alEqLog = (el, F) => { let c = 2, k = 3, passo = 0, r = rng(2);
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="novo">outra equação</button><button class="bt peq" data-v="prox">próximo passo</button></div></div></div><div class="palco" data-v="pal" style="padding:12px 16px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    /* log₂ x + log₂(x − c) = k  →  x(x − c) = 2^k. Com x = 2^m e x − c = 2^(k − m): raízes 2^m (serve) e −2^(k − m) (não serve) */
    const est = () => { const N = 2 ** k, D = c * c + 4 * N, s = Math.sqrt(D), boa = (c + s) / 2, falsa = (c - s) / 2; return { c, k, N, delta: D, boa, falsa, passo, eq: `log₂ x + log₂ (x − ${c}) = ${k}`, existeBoa: boa > 0 && boa - c > 0, existeFalsa: falsa > 0 && falsa - c > 0 }; };
    const novo = () => { let m; do { k = 3 + Math.floor(r() * 5); m = 1 + Math.floor(r() * k); } while (2 * m <= k); c = 2 ** m - 2 ** (k - m); passo = 0; desenha(); };
    const avanca = () => { if (passo < 4) passo++; desenha(); };
    const desenha = () => { const e = est(), L = [e.eq, `junte os logaritmos (soma vira produto): log₂ [x(x − ${c})] = ${k}`, `volte para a potência: x(x − ${c}) = 2${M.sup(k)} = ${e.N}, isto é, x² − ${c}x − ${e.N} = 0`, `resolva: Δ = ${e.delta}, x = ${mn(e.falsa)} ou x = ${e.boa}`, `confira a existência (x > 0 e x − ${c} > 0): ${e.boa} serve; ${mn(e.falsa)} não serve, porque não existe log de número negativo`];
      q("[data-v=pal]").innerHTML = `<ol style="max-width:540px;margin:0 auto;font-size:16px;line-height:1.9;text-align:left">${L.slice(0, passo + 1).map((x, i) => `<li style="${i === passo ? "font-weight:700" : "color:var(--ink2)"}">${x}</li>`).join("")}</ol>`;
      q("[data-v=lt]").innerHTML = vis("candidatos", passo >= 3 ? `${mn(e.falsa)} e ${e.boa}` : "?") + vis("solução", passo >= 4 ? `x = ${e.boa}` : "?");
      q("[data-v=st]").innerHTML = passo < 4 ? `Tente dar o próximo passo no papel antes de clicar. Ao juntar os logaritmos, a equação "esquece" que x e x − ${c} precisavam ser positivos: é aí que a raiz falsa entra.` : `Só uma das duas raízes da equação do 2º grau resolve a equação original. A condição de existência não é burocracia: ela decide a resposta.`; q("[data-v=prox]").disabled = passo >= 4; };
    q("[data-v=novo]").addEventListener("click", novo); q("[data-v=prox]").addEventListener("click", avanca);
    SIM.alEqLog._ult = { est, novo, avanca, poe: (o) => { ({ c, k } = { c, k, ...o }); passo = 0; desenha(); }, semente: (s) => { r = rng(s); novo(); } }; desenha(); };

  /* nome: "A inequação no gráfico: acima ou abaixo da linha" · matéria: Matemática · tema: LOG04 */
  SIM.alIneqLog = (el, F) => { let a = 2, c = 1, k = 2, maior = true;
    const sl = (n, lo, hi, v) => `<label style="font-size:13px;color:var(--ink2)">${n} <input type="range" data-v="${n}" min="${lo}" max="${hi}" step="1" value="${v}" style="vertical-align:middle;width:120px"> <b data-r="${n}" style="color:var(--ink);display:inline-block;width:26px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-a="2">base 2</button><button class="bt peq" data-a="0.5">base 1/2</button><button class="bt peq" data-m="1">log &gt; k</button><button class="bt peq" data-m="0">log &lt; k</button>${sl("c", -3, 3, 1)}${sl("k", -2, 3, 2)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    /* log_a(x − c) ? k. Fronteira: x = c + a^k. Depois da fronteira o log é maior se a > 1 e menor se a < 1 */
    const est = () => { const f = c + a ** k, depois = (a > 1) === maior; return { a, c, k, maior, fronteira: f, tipo: depois ? "depois" : "entre", sol: depois ? `x > ${F.nt(f, 3)}` : `${mn(c)} < x < ${F.nt(f, 3)}`, lo: depois ? f : c, hi: depois ? null : f }; };
    const poe = (o) => { ({ a, c, k, maior } = { a, c, k, maior, ...o }); a = +a === 0.5 ? 0.5 : 2; c = Math.max(-3, Math.min(3, Math.round(+c))); k = Math.max(-2, Math.min(3, Math.round(+k))); maior = !!maior; desenha(); };
    const desenha = () => { const e = est(); q("[data-v=c]").value = String(c); q("[data-v=k]").value = String(k); q("[data-r=c]").textContent = mn(c); q("[data-r=k]").textContent = mn(k); el.querySelectorAll("[data-a]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.a === a))); el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(!!+b.dataset.m === maior)));
      q("[data-v=pal]").innerHTML = A.plano({ x: [-4, 12], y: [-5, 5], h: 230, fs: [{ f: (x) => (x - c > 0.004 ? A.logb(a, x - c) : NaN) }, { f: () => k, cor: "var(--warn)", tr: true }], segs: [{ x1: c, y1: -5, x2: c, y2: 5, cor: "var(--ok)" }], pts: e.fronteira <= 12 ? [{ x: e.fronteira, y: k }] : [] }) + A.intervalo({ min: -4, max: 12, a: e.lo, b: e.hi === null ? 30 : e.hi, fa: false, fb: false, semRot: true });
      q("[data-v=lt]").innerHTML = vis("inequação", `log de (x − ${c < 0 ? "(" + mn(c) + ")" : c}) na base ${a === 2 ? "2" : "1/2"} ${maior ? ">" : "<"} ${mn(k)}`) + vis("fronteira", F.nt(e.fronteira, 3)) + vis("solução", e.sol);
      q("[data-v=st]").innerHTML = `A reta verde (x = ${mn(c)}) é a parede do domínio: à esquerda dela o logaritmo não existe. A curva cruza a linha tracejada em x = ${mn(c)} + ${a === 2 ? "2" : "(1/2)"}${M.sup(k)} = ${F.nt(e.fronteira, 3)}. ` + (a > 1 ? `Base maior que 1: a curva sobe, e fica ${maior ? "acima" : "abaixo"} da linha ${maior ? "depois" : "antes"} do cruzamento.` : `Base menor que 1: a curva <b>desce</b>, e fica ${maior ? "acima" : "abaixo"} da linha ${maior ? "antes" : "depois"} do cruzamento. É a inversão do sinal, vista no gráfico.`) + (e.tipo === "entre" ? ` A parede do domínio fecha a solução pela esquerda.` : ``); };
    ["c", "k"].forEach((n) => q(`[data-v=${n}]`).addEventListener("input", (ev) => poe({ [n]: ev.target.value }))); el.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => poe({ a: b.dataset.a }))); el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => poe({ maior: !!+b.dataset.m })));
    SIM.alIneqLog._ult = { poe, est }; desenha(); };
})();
