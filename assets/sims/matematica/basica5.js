/* Matemática · módulo MB: equações e problemas (MB05).
   Acrescenta a SIM.mb: quad (equação do 2º grau com coeficientes inteiros: discriminante, número de raízes e as raízes exatas, como frações
   ou na forma (−b ± k√m)/(2a)), sis (sistema 2×2 por determinantes, com frações exatas), cxy (escrita de ax + by) e figSis (cartão com as
   duas equações). Laboratórios: SIM.mbParabola (a parábola, o discriminante e as raízes), SIM.mbSistema (duas retas e a solução do sistema)
   e SIM.mbTraduz (do português para a equação). Contas conferidas em Python (tools/matematica/confere-mb.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb;
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const T = (x, y, s, o) => `<text x="${x}" y="${y}" text-anchor="${(o && o.a) || "middle"}" style="font:${(o && o.w) || 500} ${(o && o.f) || 13}px Inter,system-ui,sans-serif;fill:${(o && o.c) || "var(--ink)"}">${s}</text>`;
  const mn = (v) => String(v).replace("-", "−");
  /* equação ax² + bx + c = 0, coeficientes inteiros, a ≠ 0 */
  M.quad = (a, b, c) => { const D = b * b - 4 * a * c, S = M.fr(-b, a), P = M.fr(c, a), o = { a, b, c, delta: D, soma: S, prod: P, vx: M.fr(-b, 2 * a), vy: M.fr(-D, 4 * a) };
    if (D < 0) return { ...o, n: 0, r: [], txt: "sem raiz real" };
    if (D === 0) { const r = M.fr(-b, 2 * a); return { ...o, n: 1, r: [r], rac: true, txt: M.txt(r) }; }
    const { k, m } = M.raiz(D);
    if (m === 1) { const r = [M.fr(-b - k, 2 * a), M.fr(-b + k, 2 * a)].sort((x, y) => M.val(x) - M.val(y)); return { ...o, n: 2, r, rac: true, txt: r.map(M.txt).join(" e ") }; }
    const g = M.mdc(M.mdc(Math.abs(b), k), 2 * Math.abs(a)), s = a < 0 ? -1 : 1, nb = (s * -b) / g, nk = k / g, nd = (s * 2 * a) / g, num = `${nb === 0 ? "" : mn(nb) + " "}± ${M.rzTxt(nk, m)}`;
    return { ...o, n: 2, r: [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].sort((x, y) => x - y), rac: false, k, m, txt: nd === 1 ? num.trim() : `(${num.trim()}) / ${nd}` }; };
  /* sistema a1 x + b1 y = c1, a2 x + b2 y = c2 */
  M.sis = (a1, b1, c1, a2, b2, c2) => { const det = a1 * b2 - a2 * b1; if (det !== 0) return { det, tipo: "uma", x: M.fr(c1 * b2 - c2 * b1, det), y: M.fr(a1 * c2 - a2 * c1, det) }; return { det, tipo: c1 * b2 - c2 * b1 === 0 && a1 * c2 - a2 * c1 === 0 ? "infinitas" : "nenhuma", x: null, y: null }; };
  /* escrita de ax + by, sem "1x" e sem "+ −": texto e TeX */
  const cxy = (a, b, tex) => { const m = tex ? "-" : "−", t = (k, v, pri) => (k === 0 ? "" : (pri ? (k < 0 ? m : "") : k < 0 ? ` ${m} ` : " + ") + (Math.abs(k) === 1 ? "" : Math.abs(k)) + v); const s = t(a, "x", true) + t(b, "y", a === 0); return s || "0"; };
  M.cxy = cxy;
  M.figSis = (e1, e2, D, sub) => D.svg(560, sub ? 126 : 106, `<rect x="110" y="8" width="340" height="88" rx="12" style="fill:var(--card2);stroke:var(--line)"/><path d="M134 20 q-12 0 -12 12 v10 q0 10 -8 10 q8 0 8 10 v10 q0 12 12 12" style="fill:none;stroke:var(--ink2);stroke-width:2"/>` + T(290, 44, e1, { w: 700, f: 21 }) + T(290, 78, e2, { w: 700, f: 21 }) + (sub ? T(280, 116, sub, { c: "var(--ink2)" }) : ""), "figura");

  /* nome: "A parábola, o discriminante e as raízes" · matéria: Matemática · tema: MB05 */
  SIM.mbParabola = (el, F) => { let a = 1, b = -2, c = -3;
    const sl = (n, lo, hi, v) => `<label style="font-size:13px;color:var(--ink2)">${n} <input type="range" data-v="${n}" min="${lo}" max="${hi}" step="1" value="${v}" style="vertical-align:middle;width:150px"> <b data-r="${n}" style="color:var(--ink);display:inline-block;width:26px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">a <select data-v="a" class="bt peq" style="font-size:15px"><option>1</option><option>2</option><option>-1</option></select></label>${sl("b", -8, 8, -2)}${sl("c", -10, 10, -3)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const z = M.quad(a, b, c); return { a, b, c, delta: z.delta, n: z.n, txt: z.txt, soma: M.txt(z.soma), prod: M.txt(z.prod), vx: M.val(z.vx), vy: M.val(z.vy), eq: M.polTxt([a, b, c]) + " = 0" }; };
    const poe = (o) => { ({ a, b, c } = { a, b, c, ...o }); a = [1, 2, -1].includes(+a) ? +a : 1; b = Math.max(-8, Math.min(8, Math.round(+b))); c = Math.max(-10, Math.min(10, Math.round(+c))); desenha(); };
    const desenha = () => { const e = est(), X = (x) => 280 + x * 28, Y = (y) => 110 - y * 7.5, z = M.quad(a, b, c); q("[data-v=a]").value = String(a); ["b", "c"].forEach((n) => { q(`[data-v=${n}]`).value = String({ b, c }[n]); q(`[data-r=${n}]`).textContent = mn({ b, c }[n]); });
      let o = `<line x1="42" y1="${Y(0)}" x2="518" y2="${Y(0)}" style="stroke:var(--ink3);stroke-width:1.4"/><line x1="${X(0)}" y1="12" x2="${X(0)}" y2="208" style="stroke:var(--ink3);stroke-width:1.4"/>`;
      for (let x = -8; x <= 8; x += 2) if (x) o += `<line x1="${X(x)}" y1="${Y(0) - 3}" x2="${X(x)}" y2="${Y(0) + 3}" style="stroke:var(--ink3)"/>` + T(X(x), Y(0) + 15, mn(x), { f: 10, c: "var(--ink3)" });
      let d = "", cima = false; for (let x = -8.5; x <= 8.501; x += 0.05) { const y = a * x * x + b * x + c; if (y > 13.5 || y < -13.5) { cima = false; continue; } d += `${cima ? "L" : "M"}${X(x).toFixed(1)} ${Y(y).toFixed(1)}`; cima = true; }
      o += `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.4"/>`;
      if (z.n) (z.rac ? z.r.map(M.val) : z.r).forEach((r) => { if (Math.abs(r) <= 8.5) o += `<circle cx="${X(r)}" cy="${Y(0)}" r="6" style="fill:var(--warn)"/>`; });
      if (Math.abs(e.vx) <= 8.5 && Math.abs(e.vy) <= 13.5) o += `<circle cx="${X(e.vx)}" cy="${Y(e.vy)}" r="4" style="fill:var(--ink)"/>`;
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 220" width="100%" style="max-width:560px">${o}</svg>`;
      q("[data-v=lt]").innerHTML = vis("equação", e.eq) + vis("Δ = b² − 4ac", mn(e.delta)) + vis("raízes", e.txt) + vis("soma e produto", `${e.soma} e ${e.prod}`);
      q("[data-v=st]").innerHTML = (e.n === 2 ? `Δ &gt; 0: a parábola corta o eixo x em dois pontos, e a equação tem duas raízes reais${z.rac ? "" : " (irracionais, porque Δ não é quadrado perfeito)"}.` : e.n === 1 ? `Δ = 0: a parábola só encosta no eixo x, no vértice. A equação tem uma raiz só (uma raiz dupla).` : `Δ &lt; 0: a parábola não toca o eixo x. Nenhum número real resolve a equação.`) + ` O vértice (ponto pequeno) fica em x = ${F.nt(e.vx, 2)}, bem no meio das raízes: é a metade da soma, −b/(2a).`; };
    q("[data-v=a]").addEventListener("change", (ev) => poe({ a: ev.target.value })); ["b", "c"].forEach((n) => q(`[data-v=${n}]`).addEventListener("input", (ev) => poe({ [n]: ev.target.value })));
    SIM.mbParabola._ult = { poe, est }; desenha(); };

  /* nome: "Duas retas, uma solução: o sistema no gráfico" · matéria: Matemática · tema: MB05 */
  SIM.mbSistema = (el, F) => { let k = [1, 1, 5, 1, -1, 1], ver = false, r = rng(3), tipo = "uma";
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-t="uma">uma solução</button><button class="bt peq" data-t="nenhuma">nenhuma</button><button class="bt peq" data-t="infinitas">infinitas</button><button class="bt peq" data-v="novo">outro sistema</button><button class="bt peq" data-v="ver">mostrar</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1)), nz = (lo, hi) => { let v = 0; while (!v) v = ri(lo, hi); return v; };
    const est = () => { const z = M.sis(...k); return { k: k.slice(), det: z.det, tipo: z.tipo, x: z.x && M.txt(z.x), y: z.y && M.txt(z.y), ver, eq1: `${M.cxy(k[0], k[1])} = ${mn(k[2])}`, eq2: `${M.cxy(k[3], k[4])} = ${mn(k[5])}` }; };
    const novo = () => { let ok = false; while (!ok) { const x0 = ri(-4, 4), y0 = ri(-4, 4), a1 = nz(-3, 3), b1 = nz(-3, 3); let a2 = nz(-3, 3), b2 = nz(-3, 3), c2;
        if (tipo === "uma") { c2 = a2 * x0 + b2 * y0; ok = a1 * b2 - a2 * b1 !== 0; } else { const f = [2, -1, 3, -2][ri(0, 3)]; a2 = f * a1; b2 = f * b1; c2 = f * (a1 * x0 + b1 * y0) + (tipo === "nenhuma" ? nz(-4, 4) : 0); ok = true; }
        k = [a1, b1, a1 * x0 + b1 * y0, a2, b2, c2]; ok = ok && M.sis(...k).tipo === tipo; } ver = false; desenha(); };
    const reta = (a, b, c, X, Y, cor) => { const p = []; if (b !== 0) [-7, 7].forEach((x) => p.push([x, (c - a * x) / b])); else [-7, 7].forEach((y) => p.push([c / a, y])); return `<line x1="${X(p[0][0]).toFixed(1)}" y1="${Y(p[0][1]).toFixed(1)}" x2="${X(p[1][0]).toFixed(1)}" y2="${Y(p[1][1]).toFixed(1)}" style="stroke:${cor};stroke-width:2.4" clip-path="url(#mbsis)"/>`; };
    const desenha = () => { const e = est(), z = M.sis(...k), X = (x) => 280 + x * 30, Y = (y) => 110 - y * 15; el.querySelectorAll("[data-t]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.t === tipo)));
      let o = `<defs><clipPath id="mbsis"><rect x="70" y="5" width="420" height="210"/></clipPath></defs><line x1="70" y1="${Y(0)}" x2="490" y2="${Y(0)}" style="stroke:var(--ink3);stroke-width:1.2"/><line x1="${X(0)}" y1="5" x2="${X(0)}" y2="215" style="stroke:var(--ink3);stroke-width:1.2"/>`;
      for (let v = -6; v <= 6; v += 2) if (v) o += T(X(v), Y(0) + 14, mn(v), { f: 10, c: "var(--ink3)" }) + T(X(0) - 6, Y(v) + 4, mn(v), { f: 10, c: "var(--ink3)", a: "end" });
      o += reta(k[0], k[1], k[2], X, Y, M.COR[1]) + reta(k[3], k[4], k[5], X, Y, M.COR[2]);
      if (ver && z.tipo === "uma") o += `<circle cx="${X(M.val(z.x))}" cy="${Y(M.val(z.y))}" r="6" style="fill:var(--warn)"/>`;
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 220" width="100%" style="max-width:560px">${o}</svg>`;
      q("[data-v=lt]").innerHTML = vis("equação 1 (verde)", e.eq1) + vis("equação 2 (dourada)", e.eq2) + vis("solução", ver ? (z.tipo === "uma" ? `x = ${e.x}, y = ${e.y}` : z.tipo) : "?");
      q("[data-v=st]").innerHTML = !ver ? `Cada equação é uma reta: os pontos da reta são os pares (x, y) que a satisfazem. A solução do sistema é o ponto que está nas <b>duas</b>. Leia no gráfico, confira nas equações e clique em "mostrar".` : z.tipo === "uma" ? `As retas se cruzam em um ponto só: x = ${e.x}, y = ${e.y}. Substitua nas duas equações e veja que fecha. O número a₁b₂ − a₂b₁ = ${mn(z.det)} não é zero: é isso que garante retas com inclinações diferentes.` : z.tipo === "nenhuma" ? `As retas são paralelas: nenhum ponto está nas duas. O lado esquerdo da equação 2 é um múltiplo do lado esquerdo da equação 1, mas o lado direito não acompanha: as equações se contradizem. a₁b₂ − a₂b₁ = 0.` : `As duas equações são a mesma reta (uma é a outra multiplicada por um número): todo ponto dela é solução. Infinitas soluções. a₁b₂ − a₂b₁ = 0.`; };
    el.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => { tipo = b.dataset.t; novo(); })); q("[data-v=novo]").addEventListener("click", novo); q("[data-v=ver]").addEventListener("click", () => { ver = true; desenha(); });
    SIM.mbSistema._ult = { est, novo, mostra: () => { ver = true; desenha(); }, poe: (o) => { if (o.tipo) tipo = o.tipo; if (o.k) { k = o.k.slice(); tipo = M.sis(...k).tipo; } ver = false; desenha(); }, semente: (s) => { r = rng(s); novo(); } }; desenha(); };

  /* nome: "Do português para a equação" · matéria: Matemática · tema: MB05 */
  SIM.mbTraduz = (el, F) => { let r = rng(11), it = null, pontos = 0, feitas = 0, resp = -1;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="pal" style="padding:12px 16px"></div><div class="ctrls"><div><div class="bts" data-v="ops"></div><div class="bts" style="margin-top:6px"><button class="bt peq" data-v="novo">outra frase</button></div></div></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const MULT = { 2: "dobro", 3: "triplo", 4: "quádruplo", 5: "quíntuplo" };
    const moldes = [
      () => { const a = ri(2, 5), b = ri(2, 9), c = a * ri(2, 8) + b; return [`O ${MULT[a]} de um número, mais ${b}, é igual a ${c}.`, `${a}x + ${b} = ${c}`, [`${a}(x + ${b}) = ${c}`, `x + ${a} + ${b} = ${c}`, `${a}x = ${c} + ${b}`], "Primeiro multiplica-se o número; só depois se soma."]; },
      () => { const a = ri(2, 5), b = ri(2, 9), c = a * (ri(1, 8) + b); return [`O ${MULT[a]} da soma de um número com ${b} é igual a ${c}.`, `${a}(x + ${b}) = ${c}`, [`${a}x + ${b} = ${c}`, `x + ${a * b} = ${c}`, `${a} + x + ${b} = ${c}`], "\"Da soma\": soma-se primeiro, e o resultado inteiro é multiplicado. Daí o parêntese."]; },
      () => { const b = ri(2, 9), c = ri(2, 12); return [`A metade de um número, menos ${b}, é igual a ${c}.`, `x/2 − ${b} = ${c}`, [`(x − ${b})/2 = ${c}`, `2x − ${b} = ${c}`, `x/2 = ${c} − ${b}`], "Tira-se a metade do número, e do resultado se subtrai."]; },
      () => { const n = ri(2, 9), c = n * n + n; return [`Um número somado ao seu quadrado dá ${c}.`, `x² + x = ${c}`, [`2x + x = ${c}`, `x² · x = ${c}`, `(x + x)² = ${c}`], "O quadrado é só do número; depois se soma o próprio número."]; },
      () => { const b = ri(3, 20); return [`Daqui a ${b} anos, Ana terá o dobro da idade que tem hoje.`, `x + ${b} = 2x`, [`x + ${b} = 2(x + ${b})`, `2x + ${b} = x`, `x − ${b} = 2x`], "A idade futura é x + " + b + "; o dobro é da idade de hoje, x."]; },
      () => { const a = ri(2, 5), n = ri(a + 1, 9), c = n * n - a * n; return [`A diferença entre o quadrado de um número e o seu ${MULT[a]} é ${c}.`, `x² − ${a}x = ${c}`, [`(x − ${a})² = ${c}`, `${a}x − x² = ${c}`, `x² − ${a} = ${c}`], "Nesta ordem: quadrado do número, menos o " + MULT[a] + " do número."]; },
      () => { const b = ri(2, 9), t = ri(3, 20); return [`Um número é ${b} unidades maior que outro, e a soma dos dois é ${2 * t + b}. Chame o menor de x.`, `x + (x + ${b}) = ${2 * t + b}`, [`x + ${b}x = ${2 * t + b}`, `x + (x − ${b}) = ${2 * t + b}`, `2x = ${2 * t + b} + ${b}`], "Se o menor é x, o maior é x + " + b + "."]; },
    ];
    const novo = () => { const [frase, certa, erradas, porque] = moldes[ri(0, moldes.length - 1)](); const ops = [certa, ...erradas].map((t, i) => [t, i === 0, r()]).sort((p, s) => p[2] - s[2]); it = { frase, porque, ops: ops.map((o) => o[0]), certa: ops.findIndex((o) => o[1]) }; resp = -1; desenha(); };
    const responde = (i) => { if (resp >= 0) return; resp = i; feitas++; if (i === it.certa) pontos++; desenha(); };
    const est = () => ({ frase: it.frase, ops: it.ops.slice(), certa: it.certa, resp, pontos, feitas });
    const desenha = () => { q("[data-v=pal]").innerHTML = `<div style="font:600 19px/1.5 Inter,system-ui,sans-serif;text-align:center">${it.frase}</div>`;
      q("[data-v=ops]").innerHTML = it.ops.map((t, i) => `<button class="bt peq" data-o="${i}" style="font-size:15px${resp >= 0 && i === it.certa ? ";border-color:var(--ok);color:var(--ok)" : resp === i ? ";border-color:var(--warn);color:var(--warn)" : ""}">${t}</button>`).join("");
      el.querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => responde(+b.dataset.o)));
      q("[data-v=lt]").innerHTML = vis("acertos nesta sessão", `${pontos} de ${feitas}`);
      q("[data-v=st]").innerHTML = resp < 0 ? "Qual equação diz exatamente o que a frase diz? Não precisa resolver: só traduzir." : (resp === it.certa ? "Certo. " : "Ainda não: a certa está marcada. ") + it.porque; };
    q("[data-v=novo]").addEventListener("click", novo);
    SIM.mbTraduz._ult = { est, novo, responde, semente: (s) => { r = rng(s); pontos = 0; feitas = 0; novo(); } }; novo(); };
})();
