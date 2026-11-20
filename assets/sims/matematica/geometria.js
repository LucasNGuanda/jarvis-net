/* Matemática · módulo GE (Geometria): núcleo SIM.ge e laboratórios do GP01 (ângulos e conceitos iniciais).
   Núcleo: contas de geometria no plano (dist, ang, medio, area, pe, inter, rot, circun, incentro, baricentro, ortocentro, …),
   desenho EM ESCALA (fig: a mesma escala nos dois eixos, sempre) e o palco de arrastar pontos (arrasta), usado por todos os laboratórios do módulo.
   Coordenadas matemáticas (y para cima); o desenho converte para a tela. Contas conferidas em Python (tools/matematica/confere-ge.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, { vis, T } = A, G = (SIM.ge = SIM.ge || {});
  const nt = (v, d = 2) => (+(+v).toFixed(d)).toLocaleString("pt-BR", { maximumFractionDigits: d }).replace("-", "−");
  G.nt = nt; G.gr = (v, d = 1) => nt(v, d) + "°";
  const RAD = Math.PI / 180;

  /* ---------- contas ---------- */
  G.dist = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
  G.medio = (P, Q) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
  G.soma = (P, Q) => [P[0] + Q[0], P[1] + Q[1]]; G.sub = (P, Q) => [P[0] - Q[0], P[1] - Q[1]]; G.esc = (P, k) => [P[0] * k, P[1] * k];
  G.vet = (P, Q) => (P[0] * Q[1] - P[1] * Q[0]); G.pint = (P, Q) => P[0] * Q[0] + P[1] * Q[1];
  /* ângulo AVB em graus (0 a 180) */
  G.ang = (Pa, V, Pb) => { const u = G.sub(Pa, V), w = G.sub(Pb, V); return Math.atan2(Math.abs(G.vet(u, w)), G.pint(u, w)) / RAD; };
  /* direção (graus, 0 a 360) do vetor P → Q */
  G.dir = (P, Q) => ((Math.atan2(Q[1] - P[1], Q[0] - P[0]) / RAD) % 360 + 360) % 360;
  G.polar = (C, r, graus) => [C[0] + r * Math.cos(graus * RAD), C[1] + r * Math.sin(graus * RAD)];
  G.rot = (P, C, graus) => { const c = Math.cos(graus * RAD), s = Math.sin(graus * RAD), x = P[0] - C[0], y = P[1] - C[1]; return [C[0] + x * c - y * s, C[1] + x * s + y * c]; };
  /* área (com sinal trocado para positivo) e perímetro de um polígono */
  G.area = (ps) => Math.abs(ps.reduce((t, P, i) => t + G.vet(P, ps[(i + 1) % ps.length]), 0)) / 2;
  G.perim = (ps) => ps.reduce((t, P, i) => t + G.dist(P, ps[(i + 1) % ps.length]), 0);
  /* pé da perpendicular de P à reta AB; interseção das retas AB e CD (null se paralelas) */
  G.pe = (P, Pa, Pb) => { const d = G.sub(Pb, Pa), t = G.pint(G.sub(P, Pa), d) / G.pint(d, d); return G.soma(Pa, G.esc(d, t)); };
  G.inter = (Pa, Pb, Pc, Pd) => { const r = G.sub(Pb, Pa), s = G.sub(Pd, Pc), den = G.vet(r, s); if (Math.abs(den) < 1e-12) return null; const t = G.vet(G.sub(Pc, Pa), s) / den; return G.soma(Pa, G.esc(r, t)); };
  /* pontos notáveis do triângulo */
  G.baricentro = (Pa, Pb, Pc) => [(Pa[0] + Pb[0] + Pc[0]) / 3, (Pa[1] + Pb[1] + Pc[1]) / 3];
  G.circun = (Pa, Pb, Pc) => { const d = 2 * (Pa[0] * (Pb[1] - Pc[1]) + Pb[0] * (Pc[1] - Pa[1]) + Pc[0] * (Pa[1] - Pb[1])), q = (P) => P[0] * P[0] + P[1] * P[1]; if (Math.abs(d) < 1e-12) return null; return [(q(Pa) * (Pb[1] - Pc[1]) + q(Pb) * (Pc[1] - Pa[1]) + q(Pc) * (Pa[1] - Pb[1])) / d, (q(Pa) * (Pc[0] - Pb[0]) + q(Pb) * (Pa[0] - Pc[0]) + q(Pc) * (Pb[0] - Pa[0])) / d]; };
  G.incentro = (Pa, Pb, Pc) => { const a = G.dist(Pb, Pc), b = G.dist(Pa, Pc), c = G.dist(Pa, Pb), p = a + b + c; return [(a * Pa[0] + b * Pb[0] + c * Pc[0]) / p, (a * Pa[1] + b * Pb[1] + c * Pc[1]) / p]; };
  G.ortocentro = (Pa, Pb, Pc) => G.inter(Pa, G.pe(Pa, Pb, Pc), Pb, G.pe(Pb, Pa, Pc));
  /* lados (a oposto a A, …), ângulos e área de um triângulo */
  G.tri = (Pa, Pb, Pc) => { const a = G.dist(Pb, Pc), b = G.dist(Pa, Pc), c = G.dist(Pa, Pb); return { a, b, c, A: G.ang(Pb, Pa, Pc), B: G.ang(Pa, Pb, Pc), C: G.ang(Pa, Pc, Pb), area: G.area([Pa, Pb, Pc]), p: a + b + c }; };
  /* triângulo de lados a, b, c com A na origem e B no eixo x (para desenhar em escala a partir das medidas) */
  G.deLados = (a, b, c) => { const x = (b * b + c * c - a * a) / (2 * c), y = Math.sqrt(Math.max(0, b * b - x * x)); return [[0, 0], [c, 0], [x, y]]; };
  G.regular = (n, r = 1, C = [0, 0], ini = 90) => Array.from({ length: n }, (_, i) => G.polar(C, r, ini + (360 * i) / n));

  /* ---------- desenho em escala ----------
     o = { pols: [{ pts, cor, op, trac, larg }], segs: [[P, Q, { cor, trac, larg }]], retas: [[P, Q, { … }]] (prolongadas até a borda),
           circs: [[C, r, { cor, op, trac }]], arcos: [[C, r, g0, g1, { cor, larg }]] (arco de circunferência, em graus, sentido anti-horário),
           angs: [[A, V, B, { rot, r, cor, reto }]] (marca do ângulo AVB), pts: [[P, rótulo, { pos: [dx, dy], cor, r }]],
           meds: [[P, Q, texto, { lado: 1 | −1, cor }]] (medida escrita ao lado do segmento), txt: [[P, texto, { f, cor, w, a }]],
           vista: [xmin, xmax, ymin, ymax] (senão, calculada dos pontos), W, hmax, marg } */
  G.caixa = (o) => { const ps = []; (o.pols || []).forEach((p) => ps.push(...p.pts)); (o.segs || []).forEach((s) => ps.push(s[0], s[1])); (o.pts || []).forEach((p) => ps.push(p[0])); (o.circs || []).forEach(([C, r]) => ps.push([C[0] - r, C[1] - r], [C[0] + r, C[1] + r])); (o.arcos || []).forEach(([C, r]) => ps.push([C[0] - r, C[1] - r], [C[0] + r, C[1] + r])); (o.txt || []).forEach((t) => ps.push(t[0]));
    const xs = ps.map((p) => p[0]), ys = ps.map((p) => p[1]); return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]; };
  G.vista = (o) => { const [x0, x1, y0, y1] = o.vista || G.caixa(o), W = o.W || 560, mg = o.marg === undefined ? 34 : o.marg, hmax = o.hmax || 300, dx = Math.max(x1 - x0, 1e-9), dy = Math.max(y1 - y0, 1e-9), k = Math.min((W - 2 * mg) / dx, (hmax - 2 * mg) / dy), H = Math.round(dy * k + 2 * mg), ox = (W - dx * k) / 2;
    return { W, H, k, X: (x) => ox + (x - x0) * k, Y: (y) => H - mg - (y - y0) * k, inv: (sx, sy) => [x0 + (sx - ox) / k, y0 + (H - mg - sy) / k], lim: [x0, x1, y0, y1] }; };
  const est = (e, pad) => { e = e || {}; return `stroke:${e.cor || pad};stroke-width:${e.larg || 2}${e.trac ? ";stroke-dasharray:6 5" : ""}`; };
  G.svgDe = (o, v) => { v = v || G.vista(o); const { X, Y, k } = v, f = (n) => n.toFixed(1), xy = (P) => `${f(X(P[0]))},${f(Y(P[1]))}`; let s = "";
    (o.pols || []).forEach((p) => (s += `<polygon points="${p.pts.map(xy).join(" ")}" style="fill:${p.cor || "var(--mod)"};fill-opacity:${p.op === undefined ? 0.16 : p.op};${est(p, p.cor || "var(--mod)")};stroke-linejoin:round"/>`));
    (o.circs || []).forEach(([C, r, e]) => (s += `<circle cx="${f(X(C[0]))}" cy="${f(Y(C[1]))}" r="${f(r * k)}" style="fill:${(e && e.cor) || "var(--mod)"};fill-opacity:${e && e.op !== undefined ? e.op : 0};${est(e, "var(--ink2)")}"/>`));
    (o.retas || []).forEach(([P, Q, e]) => { const d = G.sub(Q, P), L = 1e3 / Math.max(G.dist(P, Q) * k, 1e-9), a = G.soma(P, G.esc(d, -L)), b = G.soma(P, G.esc(d, 1 + L)); s += `<line x1="${f(X(a[0]))}" y1="${f(Y(a[1]))}" x2="${f(X(b[0]))}" y2="${f(Y(b[1]))}" style="${est(e, "var(--ink2)")}"/>`; });
    (o.segs || []).forEach(([P, Q, e]) => (s += `<line x1="${f(X(P[0]))}" y1="${f(Y(P[1]))}" x2="${f(X(Q[0]))}" y2="${f(Y(Q[1]))}" style="${est(e, "var(--ink2)")};stroke-linecap:round"/>`));
    (o.arcos || []).forEach(([C, r, g0, g1, e]) => { const a = G.polar(C, r, g0), b = G.polar(C, r, g1), gr = (((g1 - g0) % 360) + 360) % 360; s += `<path d="M ${xy(a).replace(",", " ")} A ${f(r * k)} ${f(r * k)} 0 ${gr > 180 ? 1 : 0} 0 ${xy(b).replace(",", " ")}" style="fill:none;${est(e, "var(--warn)")}"/>`; });
    (o.angs || []).forEach(([Pa, V, Pb, e]) => { e = e || {}; const cor = e.cor || "var(--warn)", rp = e.r || 22, d0 = G.dir(V, Pa), d1 = G.dir(V, Pb); let g0 = d0, g1 = d1; if ((((g1 - g0) % 360) + 360) % 360 > 180) [g0, g1] = [g1, g0]; const ab = (((g1 - g0) % 360) + 360) % 360, vx = X(V[0]), vy = Y(V[1]), pt = (g, rr) => [vx + rr * Math.cos(g * RAD), vy - rr * Math.sin(g * RAD)];
      if (e.reto) { const q = rp * 0.6, p1 = pt(g0, q), p2 = pt(g0 + ab / 2, q * Math.SQRT2), p3 = pt(g1, q); s += `<path d="M ${f(p1[0])} ${f(p1[1])} L ${f(p2[0])} ${f(p2[1])} L ${f(p3[0])} ${f(p3[1])}" style="fill:none;stroke:${cor};stroke-width:1.6"/>`; }
      else { const p1 = pt(g0, rp), p2 = pt(g1, rp); s += `<path d="M ${f(vx)} ${f(vy)} L ${f(p1[0])} ${f(p1[1])} A ${rp} ${rp} 0 0 0 ${f(p2[0])} ${f(p2[1])} Z" style="fill:${cor};fill-opacity:.22;stroke:${cor};stroke-width:1.6"/>`; }
      if (e.rot !== undefined && e.rot !== "") { const m = pt(g0 + ab / 2, rp + (e.dr || 15)); s += T(m[0], m[1] + 4, e.rot, { f: e.f || 11, w: 700, c: cor }); } });
    (o.meds || []).forEach(([P, Q, t, e]) => { e = e || {}; const m = G.medio(P, Q), d = G.sub(Q, P), L = Math.hypot(d[0], d[1]) || 1, nx = -d[1] / L, ny = d[0] / L, af = (e.af || 14) * (e.lado || 1); s += T(X(m[0]) + nx * af, Y(m[1]) - ny * af + 4, t, { f: e.f || 12, w: 700, c: e.cor || "var(--ink)" }); });
    (o.pts || []).forEach(([P, r, e]) => { e = e || {}; const dp = e.pos || [0, 14]; s += `<circle cx="${f(X(P[0]))}" cy="${f(Y(P[1]))}" r="${e.r || 3.5}" style="fill:${e.cor || "var(--ink)"}"/>` + (r ? T(X(P[0]) + dp[0], Y(P[1]) - dp[1] + 4, r, { f: 12, w: 700, c: e.cor || "var(--ink2)" }) : ""); });
    (o.txt || []).forEach(([P, t, e]) => { e = e || {}; s += T(X(P[0]), Y(P[1]) + 4, t, { f: e.f || 12, w: e.w || 600, c: e.cor || "var(--ink2)", a: e.a }); });
    return s; };
  G.fig = (o, D) => { const v = G.vista(o), s = G.svgDe(o, v); return D ? D.svg(v.W, v.H, s, "figura") : `<svg viewBox="0 0 ${v.W} ${v.H}" style="width:100%;max-width:${v.W}px;display:block;margin:0 auto">${s}</svg>`; };
  /* rótulo de um vértice empurrado para fora do polígono (para não cair em cima dos lados) */
  G.fora = (P, centro, af = 15) => { const d = G.sub(P, centro), L = Math.hypot(d[0], d[1]) || 1; return [(d[0] / L) * af, (d[1] / L) * af]; };
  G.vertices = (ps, nomes, e) => { const c = [ps.reduce((t, p) => t + p[0], 0) / ps.length, ps.reduce((t, p) => t + p[1], 0) / ps.length]; return ps.map((P, i) => [P, nomes[i], Object.assign({ pos: G.fora(P, c) }, e || {})]); };

  /* ---------- palco de arrastar ----------
     G.arrasta(el, { vista, W, hmax, pts: { A: [x, y], … }, limita(nome, pos, P) → pos, cena(P) → o (como em G.fig; os pontos arrastáveis são desenhados por cima),
                     leitor(P) → html, status(P) → html, rot: { A: "A" } }) → { poe(obj), est(), P }
     Os pontos são arrastados com mouse ou dedo; poe({ A: [x, y] }) faz o mesmo por código (é o que o teste usa, além de um arrasto de verdade). */
  G.arrasta = (el, cfg) => { const P = {}; Object.keys(cfg.pts).forEach((k) => (P[k] = cfg.pts[k].slice())); const v = G.vista({ vista: cfg.vista, W: cfg.W, hmax: cfg.hmax || 330, marg: cfg.marg === undefined ? 20 : cfg.marg });
    el.insertAdjacentHTML("beforeend", `${cfg.ctrls || ""}<div class="palco" style="padding:6px 0"><svg data-v="svg" viewBox="0 0 ${v.W} ${v.H}" style="width:100%;max-width:${v.W}px;display:block;margin:0 auto;touch-action:none;user-select:none"><g data-v="cena"></g><g data-v="alcas"></g></svg></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const svg = el.querySelector("[data-v=svg]"), q = (s) => el.querySelector(s), [x0, x1, y0, y1] = v.lim;
    const prende = (k, pos) => { let p = [Math.max(x0, Math.min(x1, pos[0])), Math.max(y0, Math.min(y1, pos[1]))]; if (cfg.limita) p = cfg.limita(k, p, P) || p; return p; };
    const desenha = () => { q("[data-v=cena]").innerHTML = G.svgDe(cfg.cena(P), v);
      q("[data-v=alcas]").innerHTML = Object.keys(P).map((k) => { const sx = v.X(P[k][0]), sy = v.Y(P[k][1]), r = (cfg.rot && cfg.rot[k]) === undefined ? k : cfg.rot[k], dp = (cfg.posRot && cfg.posRot(k, P)) || [0, 18]; return `<circle data-p="${k}" cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="9" style="fill:var(--warn);fill-opacity:.9;stroke:var(--bg);stroke-width:2;cursor:grab"/>` + (r ? T(sx + dp[0], sy - dp[1] + 4, r, { f: 13, w: 700, c: "var(--ink)" }) : ""); }).join("");
      if (cfg.leitor) q("[data-v=lt]").innerHTML = cfg.leitor(P); if (cfg.status) q("[data-v=st]").innerHTML = cfg.status(P); };
    const poe = (o) => { Object.keys(o || {}).forEach((k) => { if (P[k]) P[k] = prende(k, o[k]); }); desenha(); };
    let pego = null; const onde = (ev) => { const r = svg.getBoundingClientRect(); return v.inv(((ev.clientX - r.left) / r.width) * v.W, ((ev.clientY - r.top) / r.height) * v.H); };
    svg.addEventListener("pointerdown", (ev) => { const k = ev.target && ev.target.dataset && ev.target.dataset.p; if (!k) return; pego = k; try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* sem captura, segue pelo movimento sobre o svg */ } ev.preventDefault(); });
    svg.addEventListener("pointermove", (ev) => { if (!pego) return; P[pego] = prende(pego, onde(ev)); desenha(); });
    const solta = () => (pego = null); svg.addEventListener("pointerup", solta); svg.addEventListener("pointercancel", solta); svg.addEventListener("pointerleave", (ev) => { if (pego && !svg.hasPointerCapture(ev.pointerId)) solta(); });
    desenha(); return { poe, P, redesenha: desenha, vista: v }; };

  /* ---------- GP01 ---------- */
  /* triângulo com os ângulos A e B dados (graus) e o lado AB = c, A na origem */
  G.deAngs = (Aa, Bb, c = 1) => { const Cc = 180 - Aa - Bb, b = (c * Math.sin(Bb * RAD)) / Math.sin(Cc * RAD); return [[0, 0], [c, 0], G.polar([0, 0], b, Aa)]; };
  /* raios saindo de um vértice: dirs = direções em graus; marcas = [[i, j, rótulo, { reto, cor, r }]] (ângulo entre os raios i e j) */
  G.raios = (dirs, marcas, D, o = {}) => { const V = [0, 0], L = 1, ps = dirs.map((d) => G.polar(V, L, d)); return G.fig({ segs: ps.map((P) => [V, P, { cor: "var(--ink2)" }]), angs: (marcas || []).map(([i, j, r, e]) => [ps[i], V, ps[j], Object.assign({ rot: r, r: 34 }, e || {})]), pts: [[V, o.v === undefined ? "O" : o.v, { pos: o.posV || [-10, -12] }]].concat((o.nomes || []).map((n, i) => [ps[i], n, { pos: G.fora(ps[i], V, 13), r: 0.1 }])), hmax: o.hmax || 190, vista: o.vista }, D); };
  /* duas paralelas (r em cima, s embaixo) cortadas por uma transversal de inclinação th (graus, entre 20 e 160).
     posições: "r1" (acima à direita, vale th), "r2" (acima à esquerda), "r3" (abaixo à esquerda, vale th), "r4" (abaixo à direita); o mesmo em s. */
  G.parVal = (th, pos) => (pos[1] === "1" || pos[1] === "3" ? th : 180 - th);
  G.paralelas = (th, marcas, D, o = {}) => { const h = 1.5, t = Math.tan(th * RAD), Ps = [0, 0], Pr = [h / t, h], x0 = Math.min(0, Pr[0]) - 1.7, x1 = Math.max(0, Pr[0]) + 1.7, u = [Math.cos(th * RAD), Math.sin(th * RAD)], ex = 0.9, T0 = G.sub(Ps, G.esc(u, ex)), T1 = G.soma(Pr, G.esc(u, ex));
    const braco = { 1: [[1, 0], u], 2: [u, [-1, 0]], 3: [[-1, 0], G.esc(u, -1)], 4: [G.esc(u, -1), [1, 0]] };
    const angs = Object.keys(marcas || {}).map((pos) => { const V = pos[0] === "r" ? Pr : Ps, [a, b] = braco[pos[1]], m = marcas[pos], e = typeof m === "object" ? m : { rot: m }; return [G.soma(V, a), V, G.soma(V, b), Object.assign({ r: 24 }, e)]; });
    return G.fig({ segs: [[[x0, h], [x1, h], {}], [[x0, 0], [x1, 0], {}], [T0, T1, { cor: "var(--mod)" }]], angs, txt: [[[x1 + 0.12, h], "r", { a: "start" }], [[x1 + 0.12, 0], "s", { a: "start" }], [G.soma(T1, [0.16, 0.05]), o.t || "t", { cor: "var(--mod)", a: "start" }]], hmax: o.hmax || 210, vista: [x0 - 0.1, x1 + 0.45, -0.95, h + 0.95] }, D); };
  /* triângulo desenhado em escala a partir de dois ângulos; rot = rótulos dos ângulos A, B, C ("" esconde); ext: ângulo externo em C (prolonga BC… na verdade AB além de B) */
  G.triAng = (Aa, Bb, rot, D, o = {}) => { const ps = G.deAngs(Aa, Bb, 1), [Pa, Pb, Pc] = ps, cen = G.baricentro(Pa, Pb, Pc), nomes = o.nomes || ["A", "B", "C"], angs = [[Pb, Pa, Pc, { rot: rot[0] }], [Pc, Pb, Pa, { rot: rot[1] }], [Pa, Pc, Pb, { rot: rot[2] }]].filter((a, i) => rot[i] !== null), segs = [], extra = [];
    if (o.ext !== undefined) { const E = [1.45, 0]; segs.push([Pb, E, { trac: true }]); angs.push([E, Pb, Pc, { rot: o.ext, cor: "var(--ok)" }]); extra.push(E); }
    return G.fig({ pols: [{ pts: ps }], segs, angs, pts: G.vertices(ps, nomes, { r: 0.1 }).concat(extra.map((E) => [E, "", { r: 0.1 }])), meds: o.meds ? o.meds.map((t, i) => (t ? [ps[(i + 1) % 3], ps[(i + 2) % 3], t, { lado: -1 }] : null)).filter(Boolean) : [], hmax: o.hmax || 220 }, D); };
  /* relógio de ponteiros às h horas e m minutos (em escala: o ângulo desenhado é o verdadeiro) */
  G.angRelogio = (h, m) => { const d = Math.abs(30 * (h % 12) - 5.5 * m); return Math.min(d, 360 - d); };
  G.relogio = (h, m, D, o = {}) => { const C = [0, 0], gh = 90 - (30 * (h % 12) + 0.5 * m), gm = 90 - 6 * m, Ph = G.polar(C, 0.55, gh), Pm = G.polar(C, 0.85, gm);
    return G.fig({ circs: [[C, 1, { cor: "var(--mod)", op: 0.06 }]], segs: Array.from({ length: 12 }, (_, i) => [G.polar(C, 0.92, 30 * i), G.polar(C, 1, 30 * i), { cor: "var(--ink3)", larg: 1.5 }]).concat([[C, Ph, { cor: "var(--ink)", larg: 4 }], [C, Pm, { cor: "var(--mod)", larg: 2.6 }]]), txt: [12, 3, 6, 9].map((n) => [G.polar(C, 0.76, 90 - 30 * n), String(n), { f: 11, cor: "var(--ink3)" }]), angs: o.marca ? [[Ph, C, Pm, { rot: o.marca, r: 26 }]] : [], pts: [[C, "", { r: 4 }]], hmax: 220, vista: [-1.1, 1.1, -1.1, 1.1] }, D); };

  /* nome: "Arraste os vértices: a soma dos ângulos do triângulo" · matéria: Matemática · tema: GP01 */
  SIM.geTriAng = (el, F) => { const pa = G.arrasta(el, { vista: [0, 10, 0, 6], pts: { A: [1.5, 1], B: [7, 1], C: [3.5, 5] },
      cena: (P) => { const t = G.tri(P.A, P.B, P.C), d = G.sub(P.B, P.A), L = G.dist(P.A, P.B) || 1, E = G.soma(P.B, G.esc(d, 1.6 / L));
        return { pols: [{ pts: [P.A, P.B, P.C] }], segs: [[P.B, E, { trac: true }]], angs: [[P.B, P.A, P.C, { rot: G.gr(t.A), cor: "#e5484d", r: 26 }], [P.C, P.B, P.A, { rot: G.gr(t.B), cor: "#4c8dff", r: 26 }], [P.A, P.C, P.B, { rot: G.gr(t.C), cor: "#3fb950", r: 26 }], [E, P.B, P.C, { rot: G.gr(180 - t.B), cor: "var(--ink3)", r: 40, dr: 20 }]] }; },
      posRot: (k, P) => { const c = G.baricentro(P.A, P.B, P.C), f = G.fora(P[k], c, 20); return [f[0], f[1]]; },
      leitor: (P) => { const t = G.tri(P.A, P.B, P.C); return vis("Â", G.gr(t.A)) + vis("B̂", G.gr(t.B)) + vis("Ĉ", G.gr(t.C)) + vis("soma", G.gr(t.A + t.B + t.C)) + vis("externo em B", G.gr(180 - t.B)) + vis("Â + Ĉ", G.gr(t.A + t.C)); },
      status: (P) => { const t = G.tri(P.A, P.B, P.C); return t.area < 0.05 ? "Os três pontos estão (quase) alinhados: não há triângulo." : `Arraste A, B ou C. Os três ângulos mudam, mas a soma fica presa em <b>180°</b>. O ângulo externo em B (cinza, ${G.gr(180 - t.B)}) é sempre igual à soma dos dois internos que não encostam nele: Â + Ĉ = ${G.gr(t.A)} + ${G.gr(t.C)} = ${G.gr(t.A + t.C)}. ${Math.max(t.A, t.B, t.C) > 90.5 ? "Este triângulo é obtusângulo (tem um ângulo maior que 90°)." : Math.abs(Math.max(t.A, t.B, t.C) - 90) <= 0.5 ? "Este triângulo é (praticamente) retângulo." : "Este triângulo é acutângulo (os três ângulos são menores que 90°)."}`; } });
    SIM.geTriAng._ult = { poe: pa.poe, est: () => Object.assign({ A: pa.P.A.slice(), B: pa.P.B.slice(), C: pa.P.C.slice() }, (() => { const t = G.tri(pa.P.A, pa.P.B, pa.P.C); return { angA: t.A, angB: t.B, angC: t.C, soma: t.A + t.B + t.C, externoB: 180 - t.B, area: t.area }; })()) }; };

  /* nome: "Paralelas e transversal: arraste e veja os oito ângulos" · matéria: Matemática · tema: GP01 */
  SIM.geParalelas = (el, F) => { const yr = 4.3, ys = 1.7, pa = G.arrasta(el, { vista: [0, 10, 0, 6], pts: { P: [6.2, yr], Q: [3.6, ys] }, rot: { P: "P", Q: "Q" },
      limita: (k, p, P) => { const y = k === "P" ? yr : ys, outro = k === "P" ? P.Q[0] : P.P[0]; let x = Math.max(1.2, Math.min(8.8, p[0])); const dy = yr - ys, dx = k === "P" ? x - outro : outro - x, th = Math.atan2(dy, dx) / RAD; if (th < 25) x = k === "P" ? outro + dy / Math.tan(25 * RAD) : outro - dy / Math.tan(25 * RAD); if (th > 155) x = k === "P" ? outro + dy / Math.tan(155 * RAD) : outro - dy / Math.tan(155 * RAD); return [Math.max(0.6, Math.min(9.4, x)), y]; },
      cena: (P) => { const th = G.dir(P.Q, P.P), u = [Math.cos(th * RAD), Math.sin(th * RAD)], a = "#e5484d", b = "#4c8dff", br = { 1: [[1, 0], u], 2: [u, [-1, 0]], 3: [[-1, 0], G.esc(u, -1)], 4: [G.esc(u, -1), [1, 0]] }, angs = [];
        [P.P, P.Q].forEach((V) => [1, 2, 3, 4].forEach((n) => angs.push([G.soma(V, br[n][0]), V, G.soma(V, br[n][1]), { rot: G.gr(n % 2 ? th : 180 - th, 0), cor: n % 2 ? a : b, r: 24, dr: 17, f: 10 }])));
        return { segs: [[[0.2, yr], [9.8, yr], {}], [[0.2, ys], [9.8, ys], {}]], retas: [[P.Q, P.P, { cor: "var(--mod)" }]], angs, txt: [[[9.75, yr + 0.3], "r", { a: "end" }], [[9.75, ys + 0.3], "s", { a: "end" }]] }; },
      posRot: () => [-20, 22],
      leitor: (P) => { const th = G.dir(P.Q, P.P); return vis("ângulos vermelhos", G.gr(th)) + vis("ângulos azuis", G.gr(180 - th)) + vis("vermelho + azul", "180°"); },
      status: (P) => { const th = G.dir(P.Q, P.P); return `Arraste P ou Q para inclinar a transversal. Dos oito ângulos, só existem <b>dois valores</b>: ${G.gr(th)} (vermelhos) e ${G.gr(180 - th)} (azuis). Em volta de P, os opostos pelo vértice são iguais; e o que acontece em P se repete em Q, porque r e s são paralelas: correspondentes iguais, alternos internos iguais, colaterais internos somando 180°.${Math.abs(th - 90) < 0.6 ? " Com a transversal perpendicular, os oito são retos." : ""}`; } });
    SIM.geParalelas._ult = { poe: pa.poe, est: () => { const th = G.dir(pa.P.Q, pa.P.P); return { P: pa.P.P.slice(), Q: pa.P.Q.slice(), agudoOuObtuso: th, outro: 180 - th, marcas: el.querySelectorAll("[data-v=cena] path").length }; } }; };

  /* ---------- GP02 ---------- */
  /* parâmetro t da projeção de P sobre AB (0 em A, 1 em B) e o ponto de parâmetro t */
  G.param = (P, Pa, Pb) => { const d = G.sub(Pb, Pa); return G.pint(G.sub(P, Pa), d) / (G.pint(d, d) || 1); };
  G.em = (Pa, Pb, t) => G.soma(Pa, G.esc(G.sub(Pb, Pa), t));
  /* feixe de três paralelas cortado por duas transversais, EM ESCALA: na da esquerda os segmentos medem a e b; na da direita, c e d (com c/a = d/b).
     rot = [texto de a, de b, de c, de d] */
  G.tales = (a, b, c, d, rot, D, o = {}) => { const r = c / a, S75 = Math.sin(75 * RAD), al = r >= 1 ? 75 : Math.asin(S75 * r) / RAD, be = r >= 1 ? Math.asin(S75 / r) / RAD : 75, h1 = a * Math.sin(al * RAD), h2 = b * Math.sin(al * RAD), larg = 0.9 * (h1 + h2) + 0.5;
      const Ht = h1 + h2, Wd = 0.9 * Ht + 0.5, esq = (y) => [y / Math.tan(al * RAD), y], dirt = (y) => [Wd - y / Math.tan(be * RAD), y];
      const E0 = esq(0), E1 = esq(-h1), E2 = esq(-h1 - h2), D0 = dirt(0), D1 = dirt(-h1), D2 = dirt(-h1 - h2), xs = [E0, E2, D0, D2].map((p) => p[0]), x0 = Math.min(...xs) - 0.12 * larg, x1 = Math.max(...xs) + 0.12 * larg, u = 0.1 * (h1 + h2);
      const ext = (P, Q) => [G.em(P, Q, -0.12), G.em(P, Q, 1.12)];
      return G.fig({ segs: [0, -h1, -h1 - h2].map((y) => [[x0, y], [x1, y], {}]).concat([[...ext(E0, E2), { cor: "var(--mod)" }], [...ext(D0, D2), { cor: "var(--mod)" }]]), meds: [[E0, E1, rot[0], { lado: 1 }], [E1, E2, rot[1], { lado: 1 }], [D0, D1, rot[2], { lado: -1 }], [D1, D2, rot[3], { lado: -1 }]], pts: [E0, E1, E2, D0, D1, D2].map((P) => [P, "", { r: 3 }]), txt: [[[x1 + u * 0.4, 0], "r", { a: "start" }], [[x1 + u * 0.4, -h1], "s", { a: "start" }], [[x1 + u * 0.4, -h1 - h2], "t", { a: "start" }]], hmax: o.hmax || 250, vista: [x0, x1 + u * 1.5, -h1 - h2 - u * 1.6, u * 1.6] }, D); };
  /* triângulo ABC (dado pelos vértices) com DE paralelo a BC, D em AB e E em AC, AD = k · AB. rot = { AD, DB, AE, EC, DE, BC } (só os que vierem) */
  G.triPar = (ps, k, rot, D, o = {}) => { const [Pa, Pb, Pc] = ps, Dd = G.em(Pa, Pb, k), E = G.em(Pa, Pc, k), cen = G.baricentro(Pa, Pb, Pc), ld = G.vet(G.sub(Pb, Pa), G.sub(Pc, Pa)) > 0 ? -1 : 1, meds = [];
      const m = (P, Q, t, lado) => { if (t !== undefined) meds.push([P, Q, t, { lado }]); };
      m(Pa, Dd, rot.AD, ld); m(Dd, Pb, rot.DB, ld); m(Pa, E, rot.AE, -ld); m(E, Pc, rot.EC, -ld); m(Dd, E, rot.DE, ld); m(Pb, Pc, rot.BC, ld); if (rot.AB !== undefined) meds.push([Pa, Pb, rot.AB, { lado: ld, af: 30 }]);
      return G.fig({ pols: [{ pts: ps }, { pts: [Pa, Dd, E], cor: "var(--warn)", op: 0.18 }], segs: [[Dd, E, { cor: "var(--warn)" }]], meds, pts: G.vertices(ps, o.nomes || ["A", "B", "C"], { r: 0.1 }).concat([[Dd, (o.nomes2 || ["D", "E"])[0], { pos: G.fora(Dd, cen, 15), r: 3 }], [E, (o.nomes2 || ["D", "E"])[1], { pos: G.fora(E, cen, 15), r: 3 }]]), hmax: o.hmax || 250 }, D); };
  /* dois triângulos semelhantes lado a lado, em escala: lados (a, b, c) e razão k. rot1 e rot2 = textos dos lados [a (BC), b (CA), c (AB)] */
  G.semelhantes = (a, b, c, k, rot1, rot2, D, o = {}) => { const t1 = G.deLados(a, b, c), t2 = G.deLados(a * k, b * k, c * k).map((P) => [P[0] + c + Math.max(c, c * k) * 0.25, P[1]]), lados = (t, r) => [[t[1], t[2], r[0]], [t[2], t[0], r[1]], [t[0], t[1], r[2]]].filter((x) => x[2] !== undefined && x[2] !== "").map(([P, Q, tx]) => [P, Q, tx, { lado: -1 }]);
      const marcas = (t) => [[t[1], t[0], t[2], { rot: "", cor: "#e5484d", r: 16 }], [t[2], t[1], t[0], { rot: "", cor: "#4c8dff", r: 16 }]];
      return G.fig({ pols: [{ pts: t1 }, { pts: t2, cor: "var(--warn)" }], meds: lados(t1, rot1).concat(lados(t2, rot2)), angs: marcas(t1).concat(marcas(t2)), hmax: o.hmax || 230 }, D); };

  /* nome: "Tales: arraste as retas e compare as razões" · matéria: Matemática · tema: GP02 */
  SIM.geTales = (el, F) => { const yT = 5.3, yB = 0.7; let tB = 0.4;
    const pa = G.arrasta(el, { vista: [0, 10, 0, 6], pts: { A: [2.2, yT], C: [1, yB], D: [6.6, yT], F: [8.8, yB], B: [0, 0] }, rot: { A: "A", C: "C", D: "D", F: "F", B: "B" },
      limita: (k, p, P) => { if (k === "A" || k === "D") return [Math.max(0.6, Math.min(9.4, p[0])), yT]; if (k === "C" || k === "F") return [Math.max(0.6, Math.min(9.4, p[0])), yB]; tB = Math.max(0.12, Math.min(0.88, (yT - p[1]) / (yT - yB))); return G.em(P.A, P.C, tB); },
      cena: (P) => { P.B = G.em(P.A, P.C, tB); const E = G.em(P.D, P.F, tB), y = P.B[1];
        return { segs: [[[0.2, yT], [9.8, yT], {}], [[0.2, y], [9.8, y], {}], [[0.2, yB], [9.8, yB], {}], [P.A, P.B, { cor: "#e5484d", larg: 3 }], [P.B, P.C, { cor: "#4c8dff", larg: 3 }], [P.D, E, { cor: "#e5484d", larg: 3 }], [E, P.F, { cor: "#4c8dff", larg: 3 }]], pts: [[E, "E", { pos: [16, 12], r: 4 }]], meds: [[P.A, P.B, nt(G.dist(P.A, P.B)), { lado: P.A[0] <= P.C[0] ? 1 : -1, cor: "#e5484d" }], [P.B, P.C, nt(G.dist(P.B, P.C)), { lado: P.A[0] <= P.C[0] ? 1 : -1, cor: "#4c8dff" }], [P.D, E, nt(G.dist(P.D, E)), { lado: P.D[0] <= P.F[0] ? -1 : 1, cor: "#e5484d" }], [E, P.F, nt(G.dist(E, P.F)), { lado: P.D[0] <= P.F[0] ? -1 : 1, cor: "#4c8dff" }]] }; },
      posRot: (k) => (k === "B" ? [-18, 14] : k === "A" || k === "D" ? [0, 18] : [0, -20]),
      leitor: (P) => { const e = est(P); return vis("AB ÷ BC", nt(e.r1, 3)) + vis("DE ÷ EF", nt(e.r2, 3)) + vis("AB ÷ DE", nt(e.q1, 3)) + vis("BC ÷ EF", nt(e.q2, 3)); },
      status: (P) => { const e = est(P); return `Arraste B para subir ou descer a paralela do meio; arraste A, C, D, F para inclinar as transversais. Os comprimentos mudam todos, mas a razão entre os pedaços vermelho e azul é a <b>mesma nas duas transversais</b>: ${nt(e.AB)} ÷ ${nt(e.BC)} = ${nt(e.r1, 3)} e ${nt(e.DE)} ÷ ${nt(e.EF)} = ${nt(e.r2, 3)}. É o teorema de Tales. Repare que a razão só depende da altura da paralela do meio, não da inclinação das transversais.`; } });
    function est(P) { P = P || pa.P; const E = G.em(P.D, P.F, tB), AB = G.dist(P.A, P.B), BC = G.dist(P.B, P.C), DE = G.dist(P.D, E), EF = G.dist(E, P.F); return { A: P.A.slice(), B: P.B.slice(), C: P.C.slice(), D: P.D.slice(), E, F: P.F.slice(), AB, BC, DE, EF, r1: AB / BC, r2: DE / EF, q1: AB / DE, q2: BC / EF }; };
    pa.redesenha(); SIM.geTales._ult = { poe: pa.poe, est: () => est() }; };

  /* nome: "Triângulos semelhantes: arraste e compare lados e áreas" · matéria: Matemática · tema: GP02 */
  SIM.geSemelhanca = (el, F) => { let t = 0.6;
    const pa = G.arrasta(el, { vista: [0, 10, 0, 6], pts: { A: [4.6, 5.4], B: [1.2, 0.8], C: [8.6, 0.8], D: [0, 0] }, rot: { A: "A", B: "B", C: "C", D: "D" },
      limita: (k, p, P) => { if (k !== "D") return p; t = Math.max(0.1, Math.min(0.95, G.param(p, P.A, P.B))); return G.em(P.A, P.B, t); },
      cena: (P) => { P.D = G.em(P.A, P.B, t); const E = G.em(P.A, P.C, t); return { pols: [{ pts: [P.A, P.B, P.C] }, { pts: [P.A, P.D, E], cor: "var(--warn)", op: 0.2 }], segs: [[P.D, E, { cor: "var(--warn)", larg: 3 }]], pts: [[E, "E", { pos: G.fora(E, G.baricentro(P.A, P.B, P.C), 16), r: 4 }]], meds: [[P.D, E, nt(G.dist(P.D, E)), { lado: G.vet(G.sub(P.B, P.A), G.sub(P.C, P.A)) > 0 ? 1 : -1, cor: "var(--warn)" }], [P.B, P.C, nt(G.dist(P.B, P.C)), { lado: G.vet(G.sub(P.B, P.A), G.sub(P.C, P.A)) > 0 ? 1 : -1 }]] }; },
      posRot: (k, P) => G.fora(P[k], G.baricentro(P.A, P.B, P.C), 20),
      leitor: (P) => { const e = est(P); return vis("AD ÷ AB", nt(e.k1, 3)) + vis("AE ÷ AC", nt(e.k2, 3)) + vis("DE ÷ BC", nt(e.k3, 3)) + vis("área ADE ÷ área ABC", nt(e.ka, 3)) + vis("k²", nt(e.k1 * e.k1, 3)); },
      status: (P) => { const e = est(P); return e.area < 0.3 ? "Os pontos A, B e C estão quase alinhados: não há triângulo." : `DE é sempre paralelo a BC. Arraste D sobre o lado AB (ou mexa em A, B, C): o triângulo laranja ADE é uma <b>cópia reduzida</b> de ABC. Os três lados encolhem na mesma razão k = ${nt(e.k1, 3)}, e a área encolhe em k² = ${nt(e.k1 * e.k1, 3)} (não em k!). ${Math.abs(t - 0.5) < 0.012 ? "Com D no ponto médio, DE é a base média: metade de BC, e a área é um quarto." : ""}`; } });
    function est(P) { P = P || pa.P; const E = G.em(P.A, P.C, t), ar = G.area([P.A, P.B, P.C]); return { A: P.A.slice(), B: P.B.slice(), C: P.C.slice(), D: P.D.slice(), E, t, k1: G.dist(P.A, P.D) / G.dist(P.A, P.B), k2: G.dist(P.A, E) / G.dist(P.A, P.C), k3: G.dist(P.D, E) / G.dist(P.B, P.C), ka: ar ? G.area([P.A, P.D, E]) / ar : 0, area: ar, paralelo: Math.abs(G.vet(G.sub(E, P.D), G.sub(P.C, P.B))) }; };
    pa.redesenha(); SIM.geSemelhanca._ult = { poe: pa.poe, est: () => est() }; };
})();
