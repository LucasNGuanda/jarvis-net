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
})();
