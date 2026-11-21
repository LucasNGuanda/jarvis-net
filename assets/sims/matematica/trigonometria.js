/* Matemática · módulo GE (Geometria), parte de trigonometria: núcleo SIM.tg e laboratórios do TG01 (arcos e ângulos).
   Usa o núcleo de geometria (SIM.ge: contas, desenho em escala e palco de arrastar). Acrescenta: emPi (escreve um ângulo em graus como múltiplo de π),
   rad/graus, det (primeira determinação positiva), quadrante e ciclo (a circunferência trigonométrica em SVG).
   Contas conferidas em Python (tools/matematica/confere-ge.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, G = SIM.ge, { vis, T: Tx } = A, T = (SIM.tg = SIM.tg || {}), nt = G.nt, RAD = Math.PI / 180;

  /* ---------- TG01 ---------- */
  T.rad = (g) => g * RAD; T.graus = (r) => r / RAD;
  /* ângulo em graus (inteiro) escrito como múltiplo de π: { n, d, tex, txt } com g = (n/d) · 180° */
  T.emPi = (g) => { const s = g < 0 ? -1 : 1, mdc = M.mdc(Math.abs(Math.round(g)), 180) || 180, n = Math.abs(Math.round(g)) / mdc, d = 180 / mdc, sn = s < 0 ? "-" : "", st = s < 0 ? "−" : "";
    if (n === 0) return { n: 0, d: 1, tex: "0", txt: "0" }; return { n: s * n, d, tex: d === 1 ? `${sn}${n === 1 ? "" : n}\\pi` : `${sn}\\dfrac{${n === 1 ? "" : n}\\pi}{${d}}`, txt: d === 1 ? `${st}${n === 1 ? "" : n}π` : `${st}${n === 1 ? "" : n}π/${d}` }; };
  /* primeira determinação positiva (0 ≤ resultado < 360), número de voltas completas e quadrante (0 = sobre um eixo) */
  T.det = (g) => ((g % 360) + 360) % 360;
  T.voltas = (g) => Math.floor(g / 360);
  T.quadrante = (g) => { const d = T.det(g); return d % 90 === 0 ? 0 : Math.floor(d / 90) + 1; };
  /* circunferência trigonométrica (raio 1, em escala). o = { pts: [[graus, rótulo, { cor }]], raios: [graus], arcos: [[g0, g1, { cor, r, rot }]], eixos: false para tirar,
     marcas: [graus] (tracinhos), extra: objeto G.fig a juntar, hmax, vista } */
  T.ciclo = (o, D) => { o = o || {}; const O = [0, 0], x = o.extra || {}, P = (g, r = 1) => G.polar(O, r, g), segs = o.eixos === false ? [] : [[[-1.25, 0], [1.25, 0], { cor: "var(--ink3)", larg: 1.2 }], [[0, -1.25], [0, 1.25], { cor: "var(--ink3)", larg: 1.2 }]];
    (o.raios || []).forEach((g) => segs.push([O, P(g), { cor: "var(--warn)", larg: 2 }])); (o.marcas || []).forEach((g) => segs.push([P(g, 0.95), P(g, 1.05), { cor: "var(--ink2)", larg: 1.4 }]));
    return G.fig({ circs: [[O, 1, { cor: "var(--mod)", op: 0.05 }]].concat(x.circs || []), pols: x.pols || [], setores: x.setores || [], segs: segs.concat(x.segs || []), arcos: (o.arcos || []).map(([g0, g1, e]) => [O, (e && e.r) || 0.3, g0, g1, { cor: (e && e.cor) || "var(--warn)", larg: 2 }]).concat(x.arcos || []), angs: x.angs || [], meds: x.meds || [],
      pts: (o.pts || []).map(([g, r, e]) => [P(g), r, Object.assign({ pos: G.fora(P(g), O, 15), r: 4, cor: "var(--warn)" }, e || {})]).concat(x.pts || []), txt: (o.eixos === false ? [] : [[[1.36, 0], "0°", { f: 10, cor: "var(--ink3)" }], [[0, 1.34], "90°", { f: 10, cor: "var(--ink3)" }], [[-1.42, 0], "180°", { f: 10, cor: "var(--ink3)" }], [[0, -1.34], "270°", { f: 10, cor: "var(--ink3)" }]].filter(() => !o.semGraus)).concat((o.arcos || []).filter((a) => a[2] && a[2].rot).map(([g0, g1, e]) => [P((g0 + g1) / 2, ((e && e.r) || 0.3) + 0.17), e.rot, { f: 11, w: 700, cor: e.cor || "var(--warn)" }])).concat(x.txt || []), hmax: o.hmax || 260, vista: o.vista || [-1.6, 1.6, -1.45, 1.45] }, D); };

  /* nome: "O radiano: enrole o raio na circunferência" · matéria: Matemática · tema: TG01 */
  SIM.tgRadiano = (el, F) => { const C = [5, 3];
    const pa = G.arrasta(el, { vista: [0, 10, 0, 6], pts: { A: [C[0] + 2, C[1]], P: G.polar(C, 2, 100) }, rot: { A: "A", P: "P" },
      limita: (k, p, P) => { if (k === "A") return [Math.max(C[0] + 1, Math.min(C[0] + 2.7, p[0])), C[1]]; return G.naCirc(p, C, G.dist(P.A, C)); },
      cena: (P) => { P.P = G.naCirc(P.P, C, G.dist(P.A, C)); const e = est(P), r = e.r, segs = [[C, P.A, { cor: "var(--ink2)", larg: 1.6 }], [C, P.P, { cor: "var(--ink2)", larg: 1.6 }]], pts = [[C, "O", { pos: [-12, -8], r: 3 }]], txt = [];
        for (let k = 1; k <= 6; k++) { const g = k / RAD; segs.push([G.polar(C, r * 0.93, g), G.polar(C, r * 1.07, g), { cor: "#4c8dff", larg: 2 }]); txt.push([G.polar(C, r + 0.38, g), k + " rad", { f: 10, cor: "#4c8dff", w: 700 }]); }
        return { circs: [[C, r, { cor: "var(--mod)", op: 0.05 }]], setores: [[C, r, 0, e.g, { cor: "var(--warn)", op: 0.2 }]], arcos: [[C, r, 0, e.g || 0.01, { cor: "var(--warn)", larg: 4 }]], segs, pts, txt, meds: [[C, P.A, "r = " + nt(r), { lado: -1 }]] }; },
      posRot: (k) => (k === "A" ? [20, 14] : [0, 18]),
      leitor: (P) => { const e = est(P); return vis("raio", nt(e.r)) + vis("arco AP", nt(e.arco)) + vis("arco ÷ raio (radianos)", nt(e.rad, 3)) + vis("em graus", G.gr(e.g)) + vis("em múltiplos de π", nt(e.rad / Math.PI, 3) + " π"); },
      status: (P) => { const e = est(P); return `O ângulo AÔP, medido em <b>radianos</b>, é quantas vezes o raio cabe no arco AP: ${nt(e.arco)} ÷ ${nt(e.r)} = <b>${nt(e.rad, 3)} rad</b> (${G.gr(e.g)}). As marcas azuis mostram onde o arco vale 1, 2, 3… raios. Arraste A para mudar o raio: o arco muda junto e a razão fica igual, porque círculos são semelhantes. Na volta inteira cabem 2π ≈ 6,28 raios; por isso 360° = 2π rad, e 1 rad ≈ 57,3°.`; } });
    function est(P) { P = P || pa.P; const r = G.dist(P.A, C), g = G.dir(C, P.P); return { r, g, rad: g * RAD, arco: g * RAD * r, A: P.A.slice(), P: P.P.slice() }; }
    SIM.tgRadiano._ult = { poe: pa.poe, est: () => est() }; };

  /* nome: "Arcos côngruos: dê voltas e veja onde o ponto para" · matéria: Matemática · tema: TG01 */
  SIM.tgVoltas = (el, F) => { const C = [5, 3], r = 2; let total = 50;
    const pa = G.arrasta(el, { vista: [0, 10, 0, 6], pts: { P: G.polar(C, r, 50) }, rot: { P: "P" }, ctrls: `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-d="-360">− 1 volta</button><button class="bt peq" data-d="360">+ 1 volta</button><button class="bt peq" data-d="-90">− 90°</button><button class="bt peq" data-d="90">+ 90°</button><button class="bt peq" data-d="zero">zerar</button></div></div></div>`,
      limita: (k, p, P) => { const novo = G.dir(C, p), velho = T.det(total); let dlt = novo - velho; if (dlt > 180) dlt -= 360; if (dlt <= -180) dlt += 360; total = Math.max(-1800, Math.min(1800, total + dlt)); return G.polar(C, r, total); },
      cena: (P) => { P.P = G.polar(C, r, total); const e = est(), esp = [], n = Math.max(8, Math.ceil(Math.abs(total) / 6)); for (let i = 0; i <= n; i++) { const g = (total * i) / n; esp.push(G.polar(C, 0.35 + (Math.abs(g) / 1800) * 1.25, g)); }
        return { circs: [[C, r, { cor: "var(--mod)", op: 0.05 }]], segs: [[[C[0] - 2.5, C[1]], [C[0] + 2.5, C[1]], { cor: "var(--ink3)", larg: 1.2 }], [[C[0], C[1] - 2.5], [C[0], C[1] + 2.5], { cor: "var(--ink3)", larg: 1.2 }], [C, P.P, { cor: "var(--warn)", larg: 2 }]].concat(esp.slice(1).map((Q, i) => [esp[i], Q, { cor: total >= 0 ? "#4c8dff" : "#e5484d", larg: 1.8 }])), pts: [[[C[0] + r, C[1]], "A", { pos: [14, -12], r: 3.5 }]], txt: [[[C[0] + 2, C[1] + 1.9], "1º", { f: 11, cor: "var(--ink3)" }], [[C[0] - 2, C[1] + 1.9], "2º", { f: 11, cor: "var(--ink3)" }], [[C[0] - 2, C[1] - 1.9], "3º", { f: 11, cor: "var(--ink3)" }], [[C[0] + 2, C[1] - 1.9], "4º", { f: 11, cor: "var(--ink3)" }]] }; },
      posRot: (k, P) => G.fora(P[k], C, 20),
      leitor: () => { const e = est(); return vis("ângulo percorrido", G.gr(e.total, 0)) + vis("em radianos", nt(e.total * RAD, 2)) + vis("voltas completas", e.voltas) + vis("1ª determinação positiva", G.gr(e.det, 0)) + vis("quadrante", e.quadrante ? e.quadrante + "º" : "sobre um eixo"); },
      status: () => { const e = est(); return `Arraste P em volta do círculo, quantas voltas quiser, nos dois sentidos (anti-horário é positivo, em azul; horário é negativo, em vermelho). O ponto já girou <b>${G.gr(e.total, 0)}</b>, mas está no mesmo lugar de quem girou só ${G.gr(e.det, 0)}: ${G.gr(e.total, 0)} = ${G.gr(e.det, 0)} ${e.voltas >= 0 ? "+" : "−"} ${Math.abs(e.voltas)} · 360°. Ângulos que diferem por voltas inteiras chamam-se <b>côngruos</b>: param no mesmo ponto. O menor deles que não é negativo é a primeira determinação positiva.`; } });
    function est() { const tt = Math.round(total * 1e6) / 1e6; return { total: tt, det: T.det(tt), voltas: T.voltas(tt), quadrante: T.quadrante(Math.round(tt * 1000) / 1000) }; }
    const poe = (o) => { if (o.total !== undefined) total = Math.max(-1800, Math.min(1800, +o.total)); pa.redesenha(); };
    el.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => poe({ total: b.dataset.d === "zero" ? 0 : total + +b.dataset.d })));
    SIM.tgVoltas._ult = { poe, est: () => est(), arrasta: pa.poe }; };

  /* ---------- TG02 ---------- */
  /* razões de um triângulo retângulo de catetos op (oposto ao ângulo) e adj: { hip, sen, cos, tg, g (graus) } */
  T.razoes = (op, adj) => { const hip = Math.hypot(op, adj); return { op, adj, hip, sen: op / hip, cos: adj / hip, tg: op / adj, g: Math.atan2(op, adj) / RAD }; };
  /* seno, cosseno e tangente de 30°, 45° e 60° escritos de forma exata (TeX e texto) */
  T.NOT = { 30: { sen: ["\\dfrac{1}{2}", "1/2"], cos: ["\\dfrac{\\sqrt{3}}{2}", "√3/2"], tg: ["\\dfrac{\\sqrt{3}}{3}", "√3/3"] }, 45: { sen: ["\\dfrac{\\sqrt{2}}{2}", "√2/2"], cos: ["\\dfrac{\\sqrt{2}}{2}", "√2/2"], tg: ["1", "1"] }, 60: { sen: ["\\dfrac{\\sqrt{3}}{2}", "√3/2"], cos: ["\\dfrac{1}{2}", "1/2"], tg: ["\\sqrt{3}", "√3"] } };

  /* nome: "Seno, cosseno e tangente: arraste o triângulo retângulo" · matéria: Matemática · tema: TG02 */
  SIM.tgRazoes = (el, F) => { const V = [1, 0.9]; let tq = 0.5;
    const pa = G.arrasta(el, { vista: [0, 10, 0, 6], pts: { P: [7, 4.5], Q: [4, 2.7] }, rot: { P: "P", Q: "Q" },
      limita: (k, p, P) => { if (k === "P") return [Math.max(V[0] + 1.5, Math.min(9.3, p[0])), Math.max(V[1] + 0.6, Math.min(5.6, p[1]))]; const d = G.sub(P.P, V); tq = Math.max(0.25, Math.min(0.85, G.pint(G.sub(p, V), d) / G.pint(d, d))); return G.soma(V, G.esc(d, tq)); },
      cena: (P) => { P.Q = G.soma(V, G.esc(G.sub(P.P, V), tq)); const H = [P.P[0], V[1]], Hq = [P.Q[0], V[1]];
        return { pols: [{ pts: [V, H, P.P], cor: "var(--mod)", op: 0.1 }, { pts: [V, Hq, P.Q], cor: "#4c8dff", op: 0.22 }], segs: [[V, P.P, { cor: "var(--ink)", larg: 2 }], [H, P.P, { cor: "var(--warn)", larg: 2.4 }], [V, H, { cor: "#3dd68c", larg: 2.4 }], [Hq, P.Q, { cor: "#4c8dff", larg: 1.8 }]],
          angs: [[V, H, P.P, { reto: true, cor: "var(--ink3)", r: 12 }], [V, Hq, P.Q, { reto: true, cor: "var(--ink3)", r: 9 }], [H, V, P.P, { rot: "α", r: 34, dr: 16 }]], pts: [[V, "V", { pos: [-12, -6], r: 3 }]],
          meds: [[H, P.P, "oposto", { lado: -1, cor: "var(--warn)", af: 36 }], [V, H, "adjacente", { lado: -1, cor: "#3dd68c" }]], txt: [] }; },
      posRot: (k) => (k === "P" ? [0, 18] : [-14, 14]),
      leitor: (P) => { const e = est(P); return vis("α", G.gr(e.g)) + vis("oposto", nt(e.op)) + vis("adjacente", nt(e.adj)) + vis("hipotenusa", nt(e.hip)) + vis("sen α", nt(e.sen, 3)) + vis("cos α", nt(e.cos, 3)) + vis("tg α", nt(e.tg, 3)); },
      status: (P) => { const e = est(P), q = e.peq; return `No triângulo grande: sen α = oposto ÷ hipotenusa = ${nt(e.op)} ÷ ${nt(e.hip)} = <b>${nt(e.sen, 3)}</b>; cos α = adjacente ÷ hipotenusa = ${nt(e.adj)} ÷ ${nt(e.hip)} = <b>${nt(e.cos, 3)}</b>; tg α = oposto ÷ adjacente = <b>${nt(e.tg, 3)}</b>. No triângulo azul, menor e com o mesmo ângulo: ${nt(q.op)} ÷ ${nt(q.hip)} = ${nt(q.sen, 3)}, ${nt(q.adj)} ÷ ${nt(q.hip)} = ${nt(q.cos, 3)} e ${nt(q.op)} ÷ ${nt(q.adj)} = ${nt(q.tg, 3)}: as mesmas razões, porque os dois triângulos são semelhantes. Arraste Q: os lados mudam e as razões ficam. Arraste P: o ângulo muda e as razões mudam com ele.`; } });
    function est(P) { P = P || pa.P; const e = T.razoes(P.P[1] - V[1], P.P[0] - V[0]); e.peq = T.razoes(P.Q[1] - V[1], P.Q[0] - V[0]); e.t = tq; e.P = P.P.slice(); e.Q = P.Q.slice(); return e; }
    SIM.tgRazoes._ult = { poe: (o) => { if (o.t !== undefined) { tq = Math.max(0.25, Math.min(0.85, o.t)); pa.redesenha(); } const q = {}; if (o.P) q.P = o.P; if (o.Q) q.Q = o.Q; if (o.P || o.Q) pa.poe(q); }, est: () => est() }; };

  /* nome: "Medir uma altura à distância: arraste o observador e o topo da torre" · matéria: Matemática · tema: TG02 */
  SIM.tgAltura = (el, F) => { const y0 = 0.8, xT = 8.6, U = 10;
    const pa = G.arrasta(el, { vista: [0, 10, 0, 6], pts: { O: [2.6, y0], T: [xT, 4.3] }, rot: { O: "O", T: "T" },
      limita: (k, p) => (k === "O" ? [Math.max(0.6, Math.min(xT - 1.2, p[0])), y0] : [xT, Math.max(y0 + 0.8, Math.min(5.6, p[1]))]),
      cena: (P) => { const B = [xT, y0], e = est(P);
        return { pols: [{ pts: [[xT - 0.22, y0], [xT + 0.22, y0], [xT + 0.22, P.T[1]], [xT - 0.22, P.T[1]]], cor: "var(--mod)", op: 0.35 }], segs: [[[0.2, y0], [9.8, y0], { cor: "var(--ink3)", larg: 1.6 }], [P.O, P.T, { cor: "var(--warn)", larg: 1.8, trac: true }]],
          angs: [[B, P.O, P.T, { rot: "α", r: 34, dr: 16 }]], meds: [[P.O, B, "d = " + nt(e.d, 1) + " m", { lado: -1 }], [B, P.T, "h", { lado: -1, cor: "var(--mod)", af: 24 }]] }; },
      posRot: (k) => (k === "O" ? [-4, 18] : [0, 18]),
      leitor: (P) => { const e = est(P); return vis("distância d", nt(e.d, 1) + " m") + vis("ângulo de elevação α", G.gr(e.g)) + vis("tg α", nt(e.tg, 3)) + vis("d · tg α", nt(e.d * e.tg, 1) + " m") + vis("altura da torre", nt(e.h, 1) + " m"); },
      status: (P) => { const e = est(P); return `O observador O olha para o topo T da torre. A linha de visada (tracejada) faz com o chão o <b>ângulo de elevação</b> α = ${G.gr(e.g)}. No triângulo retângulo formado, a altura é o cateto oposto e a distância é o adjacente: tg α = h ÷ d, logo <b>h = d · tg α</b> = ${nt(e.d, 1)} · ${nt(e.tg, 3)} = ${nt(e.h, 1)} m. É assim que se mede uma altura sem subir: basta a distância e o ângulo. Arraste O: chegando perto, o ângulo cresce, e o produto d · tg α não muda. Arraste T para mudar a torre.`; } });
    function est(P) { P = P || pa.P; const d = (xT - P.O[0]) * U, h = (P.T[1] - y0) * U, r = T.razoes(h, d); return { d, h, g: r.g, tg: r.tg, O: P.O.slice(), T: P.T.slice() }; }
    SIM.tgAltura._ult = { poe: pa.poe, est: () => est() }; };

  /* ---------- TG03 ---------- */
  /* redução ao 1º quadrante: { det, q (0 = sobre um eixo), ref (ângulo de referência, de 0 a 90), sSen, sCos, sTg (sinais: 1, −1 ou 0) } */
  T.ref = (g) => { const d = T.det(g), q = T.quadrante(d), ref = d <= 90 ? d : d <= 180 ? 180 - d : d <= 270 ? d - 180 : 360 - d, s = Math.sin(d * RAD), c = Math.cos(d * RAD), z = (v) => (Math.abs(v) < 1e-9 ? 0 : v > 0 ? 1 : -1); return { det: d, q, ref, sSen: z(s), sCos: z(c), sTg: z(s) * z(c) }; };
  /* valores exatos para múltiplos de 30° e de 45°: { sen, cos, tg }, cada um { tex, txt, v }; tg de 90° e de 270° é null */
  T.exato = (g) => { const r = T.ref(g), B = { 0: ["0", "0"], 30: ["\\dfrac{1}{2}", "1/2"], 45: ["\\dfrac{\\sqrt{2}}{2}", "√2/2"], 60: ["\\dfrac{\\sqrt{3}}{2}", "√3/2"], 90: ["1", "1"] }, TG = { 0: ["0", "0"], 30: ["\\dfrac{\\sqrt{3}}{3}", "√3/3"], 45: ["1", "1"], 60: ["\\sqrt{3}", "√3"] }; if (!B[r.ref]) return null;
    const com = (par, s, v) => (s === 0 ? { tex: "0", txt: "0", v: 0 } : { tex: (s < 0 ? "-" : "") + par[0], txt: (s < 0 ? "−" : "") + par[1], v });
    return { sen: com(B[r.ref], r.sSen, Math.sin(r.det * RAD)), cos: com(B[90 - r.ref], r.sCos, Math.cos(r.det * RAD)), tg: r.ref === 90 ? null : com(TG[r.ref], r.sTg, Math.tan(r.det * RAD)) }; };

  /* nome: "O ciclo trigonométrico: arraste o ponto P" · matéria: Matemática · tema: TG03 */
  SIM.tgCiclo = (el, F) => { const C = [4, 3], R = 2.2, Aa = [C[0] + R, C[1]], QD = ["sobre um eixo", "1º", "2º", "3º", "4º"], sn = (v) => (Math.abs(v) < 5e-7 ? "zero" : v > 0 ? "positivo" : "negativo");
    const pa = G.arrasta(el, { vista: [0, 10, 0, 6], pts: { P: G.polar(C, R, 40) }, rot: { P: "P" }, ctrls: `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-d="-15">− 15°</button><button class="bt peq" data-d="15">+ 15°</button><button class="bt peq" data-d="180">+ 180°</button><button class="bt peq" data-d="neg">trocar por −θ</button></div></div></div>`,
      limita: (k, p) => G.naCirc(p, C, R),
      cena: (P) => { const e = est(P), X = [P.P[0], C[1]], Y = [C[0], P.P[1]], segs = [[[C[0] - 2.7, C[1]], [C[0] + 2.9, C[1]], { cor: "var(--ink3)", larg: 1.2 }], [[C[0], 0.2], [C[0], 5.8], { cor: "var(--ink3)", larg: 1.2 }], [[Aa[0], 0.2], [Aa[0], 5.8], { cor: "#4c8dff", larg: 1, trac: true }], [P.P, X, { cor: "var(--ink3)", larg: 1, trac: true }], [P.P, Y, { cor: "var(--ink3)", larg: 1, trac: true }], [C, P.P, { cor: "var(--ink)", larg: 1.6 }], [C, X, { cor: "#3dd68c", larg: 4 }], [C, Y, { cor: "var(--warn)", larg: 4 }]], txt = [[[C[0] + 2.75, C[1] - 0.25], "cos", { f: 10, cor: "#3dd68c", w: 700 }], [[C[0] - 0.3, 5.7], "sen", { f: 10, cor: "var(--warn)", w: 700 }], [[Aa[0] + 0.3, 5.7], "tg", { f: 10, cor: "#4c8dff", w: 700 }], [[8.6, 5.2], "θ = " + G.gr(e.g), { f: 13, w: 700 }], [[8.6, 4.7], e.q ? e.q + "º quadrante" : "sobre um eixo", { f: 11, cor: "var(--ink2)" }]];
        if (e.tg !== null) { const yt = C[1] + R * e.tg; if (yt > 0.2 && yt < 5.8) { segs.push([Aa, [Aa[0], yt], { cor: "#4c8dff", larg: 4 }]); segs.push([C, [Aa[0], yt], { cor: "#4c8dff", larg: 1, trac: true }]); } else txt.push([[8.6, 4.2], "tg fora do desenho", { f: 10, cor: "#4c8dff" }]); } else txt.push([[8.6, 4.2], "tg não existe", { f: 10, cor: "#4c8dff" }]);
        return { circs: [[C, R, { cor: "var(--mod)", op: 0.05 }]], segs, txt, arcos: [[C, 0.45, 0, e.g || 0.01, { cor: "var(--ink2)", larg: 1.4 }]], pts: [[Aa, "A", { pos: [10, -12], r: 3 }], [C, "O", { pos: [-10, -10], r: 2.5 }]] }; },
      posRot: (k, P) => G.fora(P[k], C, 20),
      leitor: (P) => { const e = est(P), x = e.ex; return vis("θ", G.gr(e.g)) + vis("em radianos", e.pi ? e.pi : nt(e.g * RAD, 3)) + vis("cos θ (abscissa de P)", nt(e.cos, 3) + (x ? " = " + x.cos.txt : "")) + vis("sen θ (ordenada de P)", nt(e.sen, 3) + (x ? " = " + x.sen.txt : "")) + vis("tg θ", e.tg === null ? "não existe" : nt(e.tg, 3) + (x && x.tg ? " = " + x.tg.txt : "")) + vis("sen² θ + cos² θ", nt(e.sen * e.sen + e.cos * e.cos, 3)); },
      status: (P) => { const e = est(P); return `O círculo tem raio 1 e centro na origem. O ponto P é a extremidade do arco de ${G.gr(e.g)} que começa em A. Por definição, <b>cos θ é a abscissa de P</b> (em verde, sobre o eixo horizontal) e <b>sen θ é a ordenada de P</b> (em laranja, sobre o eixo vertical). A tangente é lida na reta vertical que passa por A: prolongue a reta OP até ela. Agora: ${e.q ? "P está no " + QD[e.q] + " quadrante" : "P está sobre um eixo"}, seno ${sn(e.sen)}, cosseno ${sn(e.cos)}, tangente ${e.tg === null ? "não existe (a reta OP é paralela à reta das tangentes)" : sn(e.tg)}. Como P está a uma unidade da origem, sen² θ + cos² θ = 1 em qualquer posição.`; } });
    function est(P) { P = P || pa.P; let g = G.dir(C, P.P); g = Math.round(g * 1e6) / 1e6; if (g >= 360) g = 0; const s = Math.sin(g * RAD), c = Math.cos(g * RAD), inteiro = Math.abs(g - Math.round(g)) < 1e-6, ex = inteiro ? T.exato(Math.round(g)) : null; return { g, sen: s, cos: c, tg: Math.abs(c) < 1e-9 ? null : s / c, q: T.quadrante(inteiro ? Math.round(g) : g), ex, pi: inteiro && Math.round(g) % 15 === 0 ? T.emPi(Math.round(g)).txt : "", P: P.P.slice() }; }
    const poe = (o) => { if (o.g !== undefined) pa.poe({ P: G.polar(C, R, T.det(o.g)) }); else pa.poe(o); };
    el.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => { const g = est().g, d = b.dataset.d; poe({ g: d === "neg" ? -g : Math.round(g / 15) * 15 + +d }); }));
    SIM.tgCiclo._ult = { poe, est: () => est() }; };

  /* nome: "Redução ao primeiro quadrante: os quatro pontos simétricos" · matéria: Matemática · tema: TG03 */
  SIM.tgReducao = (el, F) => { const C = [5, 3], R = 2.2, COR = ["var(--warn)", "#4c8dff", "#e5484d", "#3dd68c"];
    const pa = G.arrasta(el, { vista: [0, 10, 0, 6], pts: { P: G.polar(C, R, 150) }, rot: { P: "" },
      limita: (k, p) => G.polar(C, R, Math.round(G.dir(C, p))),
      cena: (P) => { const e = est(P), Q = e.quatro.map((g) => G.polar(C, R, g)), sobre = e.q === 0;
        return { circs: [[C, R, { cor: "var(--mod)", op: 0.05 }]], pols: sobre ? [] : [{ pts: Q, cor: "var(--ink3)", op: 0.06, trac: true, larg: 1.2 }], segs: [[[C[0] - 2.8, C[1]], [C[0] + 2.8, C[1]], { cor: "var(--ink3)", larg: 1.2 }], [[C[0], 0.3], [C[0], 5.7], { cor: "var(--ink3)", larg: 1.2 }]].concat(sobre ? [[C, P.P, { cor: "var(--ink)", larg: 1.6 }]] : Q.map((q, i) => [C, q, { cor: COR[i], larg: e.quatro[i] === e.gi ? 2.6 : 1.2 }])),
          arcos: sobre ? [] : [[C, 0.6, 0, e.ref, { cor: COR[0], larg: 1.6 }], [C, 0.6, 180 - e.ref, 180, { cor: COR[1], larg: 1.6 }], [C, 0.6, 180, 180 + e.ref, { cor: COR[2], larg: 1.6 }], [C, 0.6, 360 - e.ref, 360, { cor: COR[3], larg: 1.6 }]],
          pts: sobre ? [] : Q.map((q, i) => [q, G.gr(e.quatro[i], 0), { pos: G.fora(q, C, 24), cor: COR[i], r: 4 }]) }; },
      leitor: (P) => { const e = est(P); return vis("ângulo de P", G.gr(e.gi, 0)) + vis("quadrante", e.q ? e.q + "º" : "sobre um eixo") + vis("ângulo de referência", G.gr(e.ref, 0)) + vis("sen", `${e.sSen < 0 ? "−" : ""}sen ${G.gr(e.ref, 0)} = ${nt(e.sen, 3)}`) + vis("cos", `${e.sCos < 0 ? "−" : ""}cos ${G.gr(e.ref, 0)} = ${nt(e.cos, 3)}`); },
      status: (P) => { const e = est(P), a = G.gr(e.ref, 0); if (e.q === 0) return `P está sobre um eixo (${G.gr(e.gi, 0)}): aqui não há retângulo. Os valores são lidos direto nas coordenadas: sen = ${nt(e.sen, 0)} e cos = ${nt(e.cos, 0)}. Arraste P para dentro de um quadrante.`;
        return `Arraste P (o ponto maior). Os quatro pontos marcados são os vértices de um retângulo com lados paralelos aos eixos: todos fazem o mesmo ângulo de <b>${a}</b> com o eixo horizontal. Por isso têm coordenadas iguais, a menos do sinal: o seno de cada um é +sen ${a} ou −sen ${a}, e o cosseno é +cos ${a} ou −cos ${a}. Em ordem: ${e.quatro.map((g, i) => `${G.gr(g, 0)} (${["+", "+", "−", "−"][i]}sen, ${["+", "−", "−", "+"][i]}cos)`).join("; ")}. Reduzir ao primeiro quadrante é isto: achar o ângulo de referência e pôr o sinal do quadrante.`; } });
    function est(P) { P = P || pa.P; const gi = T.det(Math.round(G.dir(C, P.P))), r = T.ref(gi); return Object.assign({ gi, quatro: [r.ref, 180 - r.ref, 180 + r.ref, 360 - r.ref], sen: Math.sin(gi * RAD), cos: Math.cos(gi * RAD) }, r); }
    SIM.tgReducao._ult = { poe: (o) => (o.g !== undefined ? pa.poe({ P: G.polar(C, R, o.g) }) : pa.poe(o)), est: () => est() }; };
})();
