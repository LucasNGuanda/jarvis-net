/* Simulações da área de Cálculo · funções especiais (CE01–CE03).
   MAT.W(x, ramo): W de Lambert (ramo 0 ou -1), iteração de Halley. Conferida contra scipy.special.lambertw (erro < 1e-12).
   MAT.gama(x): Γ de Euler pela aproximação de Lanczos (g = 7, 9 coeficientes) + fórmula de reflexão para x < 1/2. Conferida contra scipy.special.gamma. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const MAT = (window.MAT = window.MAT || {});
  const E1 = Math.exp(-1);

  MAT.W = (x, ramo = 0) => {
    if (x < -E1 - 1e-15) return NaN;
    if (x <= -E1) return -1;
    if (ramo === -1 && x >= 0) return NaN;
    if (x === 0) return ramo === 0 ? 0 : -Infinity;
    let w;
    const p = Math.sqrt(2 * (Math.E * x + 1));
    if (ramo === 0) {
      if (x < -0.25) w = -1 + p - p * p / 3 + (11 / 72) * p * p * p;
      else if (x < 3) w = Math.log1p(x) * (1 - Math.log1p(Math.log1p(x)) / (2 + Math.log1p(x)));
      else { const L = Math.log(x); w = L - Math.log(L) + Math.log(L) / L; }
    } else {
      if (x < -0.25) w = -1 - p - p * p / 3 - (11 / 72) * p * p * p;
      else { const L = Math.log(-x); w = L - Math.log(-L); }
    }
    for (let i = 0; i < 60; i++) {
      const ew = Math.exp(w), f = w * ew - x;
      const dw = f / (ew * (w + 1) - ((w + 2) * f) / (2 * w + 2));
      if (!isFinite(dw)) break;
      w -= dw;
      if (Math.abs(dw) <= 1e-15 * (1 + Math.abs(w))) break;
    }
    return w;
  };

  const LZ = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  MAT.gama = (x) => {
    if (x < 0.5) { const s = Math.sin(Math.PI * x); return s === 0 ? NaN : Math.PI / (s * MAT.gama(1 - x)); }
    x -= 1;
    let a = LZ[0]; const t = x + 7.5;
    for (let i = 1; i < 9; i++) a += LZ[i] / (x + i);
    return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
  };

  /* utilidades de gráfico em SVG */
  const quadro = (o) => ({ sx: (x) => o.l + ((x - o.x0) / (o.x1 - o.x0)) * (o.W - o.l - o.r), sy: (y) => o.H - o.b - ((y - o.y0) / (o.y1 - o.y0)) * (o.H - o.t - o.b) });
  const num = (v) => String(+(+v).toFixed(2)).replace(".", ",").replace("-", "−");
  function grade(o, P, xt, yt, xl, yl) {
    let s = "";
    xt.forEach((v) => (s += `<line class="grade" x1="${P.sx(v)}" x2="${P.sx(v)}" y1="${o.t}" y2="${o.H - o.b}"/><text class="tx2" x="${P.sx(v)}" y="${o.H - o.b + 16}" text-anchor="middle">${num(v)}</text>`));
    yt.forEach((v) => (s += `<line class="grade" x1="${o.l}" x2="${o.W - o.r}" y1="${P.sy(v)}" y2="${P.sy(v)}"/><text class="tx2" x="${o.l - 6}" y="${P.sy(v) + 4}" text-anchor="end">${num(v)}</text>`));
    if (o.x0 < 0 && o.x1 > 0) s += `<line class="ln2" x1="${P.sx(0)}" x2="${P.sx(0)}" y1="${o.t}" y2="${o.H - o.b}"/>`;
    if (o.y0 < 0 && o.y1 > 0) s += `<line class="ln2" x1="${o.l}" x2="${o.W - o.r}" y1="${P.sy(0)}" y2="${P.sy(0)}"/>`;
    s += `<rect x="${o.l}" y="${o.t}" width="${o.W - o.l - o.r}" height="${o.H - o.t - o.b}" style="fill:none;stroke:var(--line)"/>`;
    if (xl) s += `<text class="txm" x="${o.W - o.r - 4}" y="${o.H - o.b - 6}" text-anchor="end">${xl}</text>`;
    if (yl) s += `<text class="txm" x="${o.l + 6}" y="${o.t + 15}">${yl}</text>`;
    return s;
  }
  const curva = (pts, P, est) => {
    let d = "", pen = false;
    pts.forEach(([x, y]) => { if (!isFinite(y)) { pen = false; return; } d += (pen ? "L" : "M") + P.sx(x).toFixed(1) + " " + P.sy(y).toFixed(1); pen = true; });
    return `<path d="${d}" style="fill:none;${est}"/>`;
  };
  const ponto = (x, y, cor, r = 6) => `<circle cx="${x}" cy="${y}" r="${r}" style="fill:${cor};stroke:var(--card);stroke-width:2.5"/>`;
  const clip = (id, o) => `<defs><clipPath id="${id}"><rect x="${o.l}" y="${o.t}" width="${o.W - o.l - o.r}" height="${o.H - o.t - o.b}"/></clipPath></defs>`;

  /* ---------- CE01 · W de Lambert: a função e a sua inversa ---------- */
  SIM.lambert = (el, F) => {
    const o = { W: 470, H: 470, l: 40, r: 14, t: 12, b: 30, x0: -4.2, x1: 4.2, y0: -4.2, y1: 4.2 }, P = quadro(o);
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:start"><svg viewBox="0 0 ${o.W} ${o.H}" width="${o.W}" data-v="sv"></svg>
      <div><div class="leitor" data-v="lt" style="flex-direction:column;align-items:stretch"></div><div data-v="nw" style="font-size:14px;margin-top:10px"></div></div></div>
      <div class="ctrls"><div class="ctrl"><label>a (resolver w·eʷ = a)</label><input type="range" min="-0.3679" max="4" step="0.0001" value="1" data-c="a"><output data-o="a"></output></div>
      <div class="bts"><button class="bt peq" data-p="${-E1}">−1/e</button><button class="bt peq" data-p="${-Math.log(2) / 2}">−ln2/2</button><button class="bt peq" data-p="0">0</button><button class="bt peq" data-p="${Math.E}">e</button><button class="bt peq" data-p="3.9">3,9</button>
      <button class="bt peq" data-a="esp" aria-pressed="true">Mostrar o espelho</button></div></div>
      <div class="status">A curva fina é <b>y = x·eˣ</b>. A grossa é a <b>W</b>: o espelho dela na reta y = x (trocar x com y é inverter a função). Para a entre −1/e e 0, a reta vertical corta a W <b>duas vezes</b>: são os dois ramos, W₀ (verde) e W₋₁ (laranja).</div>`);
    const q = (s) => el.querySelector(s);
    let esp = true;
    const ws = [], f = [];
    for (let i = 0; i <= 400; i++) { const w = -4.2 + (5.6 * i) / 400; f.push([w, w * Math.exp(w)]); }
    const w0 = f.filter(([w]) => w >= -1).map(([w, a]) => [a, w]), wm = f.filter(([w]) => w <= -1).map(([w, a]) => [a, w]);
    function desenha() {
      const a = +q("[data-c=a]").value; q("[data-o=a]").textContent = F.t(a, 4);
      let g = clip("clw", o) + grade(o, P, [-4, -2, 0, 2, 4], [-4, -2, 0, 2, 4], "x", "y");
      g += `<g clip-path="url(#clw)"><line x1="${P.sx(-4.2)}" y1="${P.sy(-4.2)}" x2="${P.sx(4.2)}" y2="${P.sy(4.2)}" style="stroke:var(--ink3);stroke-dasharray:5 5"/>`;
      g += `<line x1="${P.sx(-E1)}" x2="${P.sx(-E1)}" y1="${o.t}" y2="${o.H - o.b}" style="stroke:var(--bad);stroke-dasharray:2 4;opacity:.7"/>`;
      if (esp) g += curva(f, P, "stroke:var(--ink2);stroke-width:1.6");
      g += curva(w0, P, "stroke:var(--ok);stroke-width:3.2") + curva(wm, P, "stroke:var(--warn);stroke-width:3.2;stroke-dasharray:9 5");
      g += `<line x1="${P.sx(a)}" x2="${P.sx(a)}" y1="${o.t}" y2="${o.H - o.b}" style="stroke:var(--mod);stroke-width:1.4;opacity:.8"/>`;
      const W0 = MAT.W(a, 0), Wm = a < 0 ? MAT.W(a, -1) : NaN;
      [[W0, "var(--ok)"], [Wm, "var(--warn)"]].forEach(([w, c]) => {
        if (!isFinite(w) || w < -4.2) return;
        g += ponto(P.sx(a), P.sy(w), c);
        if (esp) g += `<line x1="${P.sx(a)}" y1="${P.sy(w)}" x2="${P.sx(w)}" y2="${P.sy(a)}" style="stroke:${c};stroke-dasharray:3 3"/>` + ponto(P.sx(w), P.sy(a), c, 4);
      });
      g += `</g><text class="tx2" x="${P.sx(-E1) - 4}" y="${o.t + 14}" text-anchor="end" style="fill:var(--bad)">x = −1/e</text>`;
      q("[data-v=sv]").innerHTML = g;
      const vis = (r, v) => `<div class="vis"><small style="text-transform:none">${r}</small><b>${v}</b></div>`;
      q("[data-v=lt]").innerHTML = vis("W₀(a)", F.t(W0, 6)) + (a < 0 ? vis("W₋₁(a)", F.t(Wm, 6)) : vis("W₋₁(a)", a >= 0 ? "não existe (a ≥ 0)" : "")) + vis("conferindo: W₀·e^W₀", F.t(W0 * Math.exp(W0), 6));
      /* Newton a partir de w = ln(1 + a) (ou −0,5 perto do ramo) */
      let w = a > -0.3 ? Math.log1p(Math.max(a, -0.3)) : -0.5, lin = "";
      for (let k = 0; k < 6; k++) { const ew = Math.exp(w); const prox = w - (w * ew - a) / (ew * (w + 1)); lin += `<tr><td>${k}</td><td>${F.t(w, 10)}</td></tr>`; w = prox; }
      q("[data-v=nw]").innerHTML = `<b>Newton</b>: $w_{k+1} = w_k - \\dfrac{w_ke^{w_k} - a}{e^{w_k}(w_k+1)}$<table class="tb" style="margin-top:6px"><tr><th style="text-transform:none">k</th><th style="text-transform:none">w<sub>k</sub></th></tr>${lin}</table><p class="det" style="color:var(--ink2)">Os dígitos certos dobram a cada passo (convergência quadrática). Perto de a = −1/e, onde a derivada de x·eˣ zera, ela fica lenta.</p>`;
      F.math(q("[data-v=nw]"));
    }
    q("[data-c=a]").addEventListener("input", desenha);
    el.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { q("[data-c=a]").value = b.dataset.p; desenha(); }));
    q("[data-a=esp]").addEventListener("click", (ev) => { esp = !esp; ev.target.setAttribute("aria-pressed", esp); desenha(); });
    desenha();
  };

  /* ---------- CE02 · Gama de Euler: o gráfico e a área ---------- */
  SIM.gama = (el, F) => {
    const o = { W: 470, H: 380, l: 40, r: 12, t: 12, b: 30, x0: -4.6, x1: 5.2, y0: -6, y1: 8 }, P = quadro(o);
    const o2 = { W: 400, H: 380, l: 40, r: 12, t: 12, b: 30, x0: 0, x1: 12, y0: 0, y1: 1.2 };
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:start"><div><b>Γ(x)</b><svg viewBox="0 0 ${o.W} ${o.H}" width="${o.W}" data-v="s1"></svg></div>
      <div><b>A área: t<sup>x−1</sup>e<sup>−t</sup> de 0 a ∞</b><svg viewBox="0 0 ${o2.W} ${o2.H}" width="${o2.W}" data-v="s2"></svg></div></div>
      <div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>x</label><input type="range" min="-4.4" max="5" step="0.01" value="2.5" data-c="x"><output data-o="x"></output></div>
      <div class="bts"><button class="bt peq" data-p="0.5">½</button><button class="bt peq" data-p="1">1</button><button class="bt peq" data-p="3">3</button><button class="bt peq" data-p="4">4</button><button class="bt peq" data-p="1.4616">fundo</button><button class="bt peq" data-p="-0.5">−½</button><button class="bt peq" data-p="-1.5">−3/2</button></div></div>
      <div class="status">Pontos pretos: os fatoriais, Γ(n) = (n−1)!. A curva passa por todos e preenche os buracos. Nos inteiros 0, −1, −2, … ela explode (polos). À direita, para x > 0, a área pintada <b>é</b> o Γ(x).</div>`);
    const q = (s) => el.querySelector(s);
    const pts = []; let ant = 0; for (let i = 0; i <= 1400; i++) { const x = o.x0 + ((o.x1 - o.x0) * i) / 1400; const y = MAT.gama(x); if (ant && Math.sign(y) !== Math.sign(ant)) pts.push([x, NaN]); pts.push([x, Math.abs(y) > 60 ? Math.sign(y) * 60 : y]); ant = y; } /* quebra a curva quando o sinal troca (polo) */
    function desenha() {
      const x = +q("[data-c=x]").value; q("[data-o=x]").textContent = F.t(x, 2);
      const Gx = MAT.gama(x), polo = x <= 0 && Math.abs(x - Math.round(x)) < 0.005;
      let g = clip("clg", o) + grade(o, P, [-4, -2, 0, 2, 4], [-6, -4, -2, 0, 2, 4, 6, 8], "x", "");
      for (let n = 0; n >= -4; n--) g += `<line x1="${P.sx(n)}" x2="${P.sx(n)}" y1="${o.t}" y2="${o.H - o.b}" style="stroke:var(--bad);stroke-dasharray:2 4;opacity:.6"/>`;
      g += `<g clip-path="url(#clg)">${curva(pts, P, "stroke:var(--mod);stroke-width:2.8")}`;
      [[1, 1], [2, 1], [3, 2], [4, 6]].forEach(([a, v]) => (g += ponto(P.sx(a), P.sy(v), "var(--ink)", 4.5)));
      if (!polo && isFinite(Gx)) g += `<line x1="${P.sx(x)}" x2="${P.sx(x)}" y1="${P.sy(0)}" y2="${P.sy(Gx)}" style="stroke:var(--ink2);stroke-dasharray:4 4"/>` + ponto(P.sx(x), P.sy(Gx), "var(--warn)");
      g += `</g><text class="tx2" x="${P.sx(4) - 8}" y="${P.sy(6) - 8}" text-anchor="end">Γ(4) = 3! = 6</text>`;
      q("[data-v=s1]").innerHTML = g;
      /* área */
      const P2 = quadro(o2);
      let h = grade(o2, P2, [0, 2, 4, 6, 8, 10, 12], [0, 0.5, 1], "t", "");
      let area = NaN;
      if (x > 0) {
        const fI = (t) => Math.pow(t, x - 1) * Math.exp(-t);
        let mx = 0; const amostra = []; for (let i = 1; i <= 600; i++) { const t = (12 * i) / 600; const v = fI(t); amostra.push([t, v]); if (v > mx) mx = v; }
        o2.y1 = x < 1 ? 2 : Math.max(0.3, mx * 1.15); const P3 = quadro(o2);
        h = clip("clh", o2) + grade(o2, P3, [0, 2, 4, 6, 8, 10, 12], [0, o2.y1 / 2, o2.y1].map((v) => +v.toFixed(2)), "t", "");
        let poli = `${P3.sx(0)},${P3.sy(0)} `; amostra.forEach(([t, v]) => (poli += `${P3.sx(t).toFixed(1)},${P3.sy(Math.min(v, o2.y1 * 1.05)).toFixed(1)} `)); poli += `${P3.sx(12)},${P3.sy(0)}`;
        h += `<g clip-path="url(#clh)"><polygon points="${poli}" style="fill:color-mix(in srgb,var(--mod) 25%,transparent);stroke:var(--mod);stroke-width:2"/></g>`;
        if (x < 1) h += `<text class="tx2" x="${P3.sx(0) + 8}" y="${o2.t + 16}">↑ vai ao infinito em t = 0 (mas a área é finita)</text>`;
        /* área numérica: com t = e^s, ∫ t^(x−1) e^(−t) dt = ∫ e^(x·s − e^s) ds (integrando liso; regra do trapézio em dois trechos) */
        const g = (s) => Math.exp(x * s - Math.exp(s)), trap = (a, b, n) => { const hh = (b - a) / n; let sm = (g(a) + g(b)) / 2; for (let i = 1; i < n; i++) sm += g(a + i * hh); return sm * hh; };
        area = trap(Math.min(-8, -45 / x), -8, x < 0.3 ? 30000 : 3000) + trap(-8, 4.5, 3000);
        h += `<text class="tx" x="${o2.W - o2.r - 10}" y="${o2.t + 40}" text-anchor="end">área ≈ ${F.t(area, 4)}</text>`;
      } else {
        h += `<text class="tx" x="${o2.W / 2 + 15}" y="${o2.H / 2 - 10}" text-anchor="middle">Para x ≤ 0 a área é infinita.</text><text class="tx2" x="${o2.W / 2 + 15}" y="${o2.H / 2 + 14}" text-anchor="middle">O valor vem da regra Γ(x) = Γ(x + 1)/x.</text>`;
      }
      q("[data-v=s2]").innerHTML = h;
      const vis = (r, v) => `<div class="vis"><small style="text-transform:none">${r}</small><b>${v}</b></div>`;
      const inteiro = Math.abs(x - Math.round(x)) < 0.005 && Math.round(x) >= 1;
      q("[data-v=lt]").innerHTML = vis("Γ(x)", polo ? "polo (±∞)" : F.t(Gx, 5)) + (x > 0 ? vis("área numérica", F.t(area, 5)) : vis("Γ(x+1)/x", polo ? "1/0" : F.t(MAT.gama(x + 1) / x, 5))) + (inteiro ? vis(`(${Math.round(x) - 1})!`, F.t(MAT.gama(Math.round(x)), 0)) : "");
    }
    q("[data-c=x]").addEventListener("input", desenha);
    el.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { q("[data-c=x]").value = b.dataset.p; desenha(); }));
    desenha();
  };

  /* ---------- CE03 · ∮: circulação e fluxo, Green na prática ---------- */
  SIM.circulacao = (el, F) => {
    const o = { W: 470, H: 470, l: 30, r: 10, t: 10, b: 24, x0: -3, x1: 3, y0: -3, y1: 3 }, P = quadro(o);
    const CAMPOS = {
      giro: { nome: "Redemoinho (−y, x)", f: (x, y) => [-y, x], rot: () => 2, div: () => 0 },
      fonte: { nome: "Fonte (x, y)", f: (x, y) => [x, y], rot: () => 0, div: () => 2 },
      fio: { nome: "Fio de corrente (−y, x)/r²", f: (x, y) => { const r2 = x * x + y * y; return [-y / r2, x / r2]; }, rot: () => 0, div: () => 0, sing: true },
      cis: { nome: "Correnteza (y, 0)", f: (x, y) => [y, 0], rot: () => -1, div: () => 0 },
    };
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:start"><svg viewBox="0 0 ${o.W} ${o.H}" width="${o.W}" data-v="sv"></svg><div class="leitor" data-v="lt" style="flex-direction:column;align-items:stretch"></div></div>
      <div class="ctrls"><div class="ctrl"><label>centro x</label><input type="range" min="-2" max="2" step="0.05" value="0.6" data-c="cx"><output data-o="cx"></output></div>
      <div class="ctrl"><label>centro y</label><input type="range" min="-2" max="2" step="0.05" value="0.3" data-c="cy"><output data-o="cy"></output></div>
      <div class="ctrl"><label>raio R</label><input type="range" min="0.2" max="1.6" step="0.05" value="1" data-c="R"><output data-o="R"></output></div>
      <div class="bts">${Object.entries(CAMPOS).map(([k, c], j) => `<button class="bt peq" data-k="${k}" aria-pressed="${j === 0}">${c.nome}</button>`).join("")}</div>
      <div class="bts"><button class="bt peq" data-m="circ" aria-pressed="true">Circulação ∮F·dr</button><button class="bt peq" data-m="fluxo" aria-pressed="false">Fluxo ∮F·n ds</button></div></div>
      <div class="status">A curva é percorrida no sentido anti-horário. Em <b>circulação</b>, cada pedacinho fica verde quando o campo empurra a favor do caminho e vermelho quando empurra contra. Em <b>fluxo</b>, verde é campo saindo e vermelho, entrando. O total à direita é a soma de todos os pedacinhos.</div>`);
    const q = (s) => el.querySelector(s);
    let k = "giro", modo = "circ";
    function desenha() {
      const cx = +q("[data-c=cx]").value, cy = +q("[data-c=cy]").value, R = +q("[data-c=R]").value, C = CAMPOS[k];
      ["cx", "cy", "R"].forEach((c) => (q(`[data-o=${c}]`).textContent = F.t(+q(`[data-c=${c}]`).value, 2)));
      let g = clip("clc", o) + grade(o, P, [-3, -2, -1, 0, 1, 2, 3], [-3, -2, -1, 1, 2, 3], "x", "y") + `<g clip-path="url(#clc)">`;
      /* setas do campo, com tamanho saturado */
      for (let i = -2.75; i <= 2.76; i += 0.5) for (let j = -2.75; j <= 2.76; j += 0.5) {
        const [u, v] = C.f(i, j), m = Math.hypot(u, v); if (!isFinite(m) || m === 0) continue;
        const L = 0.36 * Math.min(1, m / 2) + 0.06, ux = (u / m) * L, uy = (v / m) * L;
        g += D.seta(P.sx(i - ux / 2), P.sy(j - uy / 2), P.sx(i + ux / 2), P.sy(j + uy / 2), "var(--ink3)", 1.3);
      }
      if (C.sing) g += `<circle cx="${P.sx(0)}" cy="${P.sy(0)}" r="6" style="fill:var(--warn)"/><text class="tx2" x="${P.sx(0) + 10}" y="${P.sy(0) - 8}">fio (singular)</text>`;
      /* a curva, pintada pedaço a pedaço, e a soma numérica */
      const N = 2000; let tot = 0;
      for (let n = 0; n < N; n++) {
        const t = (2 * Math.PI * (n + 0.5)) / N, x = cx + R * Math.cos(t), y = cy + R * Math.sin(t);
        const [u, v] = C.f(x, y), ds = (2 * Math.PI * R) / N;
        const contrib = modo === "circ" ? (-u * Math.sin(t) + v * Math.cos(t)) * ds : (u * Math.cos(t) + v * Math.sin(t)) * ds;
        tot += contrib;
        if (n % 20 === 0) {
          const t2 = (2 * Math.PI * (n + 20)) / N, c = contrib > 1e-12 ? "var(--ok)" : contrib < -1e-12 ? "var(--bad)" : "var(--ink3)";
          g += `<line x1="${P.sx(cx + R * Math.cos(t - Math.PI / N))}" y1="${P.sy(cy + R * Math.sin(t - Math.PI / N))}" x2="${P.sx(cx + R * Math.cos(t2))}" y2="${P.sy(cy + R * Math.sin(t2))}" style="stroke:${c};stroke-width:5;stroke-linecap:round"/>`;
        }
      }
      const ta = Math.PI / 4; g += D.seta(P.sx(cx + R * Math.cos(ta)), P.sy(cy + R * Math.sin(ta)), P.sx(cx + R * Math.cos(ta) - 0.35 * Math.sin(ta)), P.sy(cy + R * Math.sin(ta) + 0.35 * Math.cos(ta)), "var(--ink)", 2);
      q("[data-v=sv]").innerHTML = g + "</g>";
      const area = Math.PI * R * R, dentro = Math.hypot(cx, cy) < R, dens = modo === "circ" ? C.rot() : C.div();
      let dupla = dens * area, extra = "";
      if (C.sing && modo === "circ") { extra = dentro ? "O fio está dentro: o ∬ “perde” um 2π escondido no ponto onde o campo não existe." : "O fio está fora: rot F = 0 em toda a região, e ∮ = 0."; }
      if (C.sing && modo === "fluxo") extra = "div F = 0 fora do fio, e o fluxo dá 0 mesmo com o fio dentro.";
      const vis = (r, v) => `<div class="vis"><small style="text-transform:none">${r}</small><b>${v}</b></div>`;
      const nome = modo === "circ" ? ["∮ F·dr (soma na curva)", "rot F (por área)", "∬ rot F dA (Green)"] : ["∮ F·n ds (soma na curva)", "div F (por área)", "∬ div F dA (Gauss no plano)"];
      q("[data-v=lt]").innerHTML = vis(nome[0], F.t(Math.abs(tot) < 1e-9 ? 0 : tot, 4)) + vis(nome[1], C.sing ? "0 (fora do fio)" : F.t(dens, 0)) + vis(nome[2], F.t(dupla, 4) + (C.sing && dentro && modo === "circ" ? " (+ 2π escondido no fio)" : "")) + vis("área do disco", F.t(area, 4)) + (extra ? `<p class="det" style="color:var(--ink2);margin:6px 0 0">${extra}</p>` : "");
    }
    el.querySelectorAll("input").forEach((i) => i.addEventListener("input", desenha));
    el.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => { k = b.dataset.k; el.querySelectorAll("[data-k]").forEach((x) => x.setAttribute("aria-pressed", x === b)); desenha(); }));
    el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { modo = b.dataset.m; el.querySelectorAll("[data-m]").forEach((x) => x.setAttribute("aria-pressed", x === b)); desenha(); }));
    desenha();
  };
  /* ================= CÁLCULO 1 (CI01–CI05) ================= */
  const visT = (r, v) => `<div class="vis"><small style="text-transform:none">${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${k === ativo}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));

  /* ---------- CI01 · ε e δ ---------- */
  SIM.limite = (el, F) => {
    const FS = {
      quad: { nome: "(x² − 4)/(x − 2) em 2", f: (x) => (x * x - 4) / (x - 2), a: 2, L: 4, buraco: true, v: [0, 4, 0, 8], e: [0.05, 2, 1], xt: [0, 1, 2, 3, 4], yt: [0, 2, 4, 6, 8] },
      sen: { nome: "sen x / x em 0", f: (x) => Math.sin(x) / x, a: 0, L: 1, buraco: true, v: [-9, 9, -0.4, 1.3], e: [0.02, 0.6, 0.2], xt: [-8, -4, 0, 4, 8], yt: [0, 0.5, 1] },
      osc: { nome: "x·sen(1/x) em 0", f: (x) => x * Math.sin(1 / x), a: 0, L: 0, buraco: true, v: [-0.6, 0.6, -0.6, 0.6], e: [0.01, 0.5, 0.2], xt: [-0.5, 0, 0.5], yt: [-0.5, 0, 0.5] },
      salto: { nome: "salto: x/|x| em 0", f: (x) => (x > 0 ? 1 : x < 0 ? -1 : 0), a: 0, L: 1, buraco: false, v: [-2, 2, -2, 2], e: [0.05, 2.5, 0.5], xt: [-2, -1, 0, 1, 2], yt: [-2, -1, 0, 1, 2] },
    };
    let k = "quad";
    const o = { W: 600, H: 380, l: 44, r: 14, t: 12, b: 30 };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${o.W} ${o.H}" width="${o.W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>ε (a faixa da resposta)</label><input type="range" min="0" max="1" step="0.001" value="0.5" data-c="e"><output data-o="e"></output></div>
      <div class="bts">${botoes(Object.entries(FS).map(([kk, c]) => [kk, c.nome]), "k", k)}</div></div>
      <div class="status">Faixa <b style="color:var(--mod)">horizontal</b>: os valores a menos de ε de L. Faixa <b style="color:var(--warn)">vertical</b>: o maior δ que o computador acha tal que, para todo x a menos de δ de a (tirando o próprio a), o gráfico fica dentro da faixa horizontal. Limite existe = para <b>todo</b> ε, por menor que seja, existe um δ.</div>`);
    const q = (s) => el.querySelector(s);
    const epsDe = (C) => C.e[0] * Math.pow(C.e[1] / C.e[0], +q("[data-c=e]").value);
    function delta(C, eps) {
      const larg = C.v[1] - C.v[0], n = 40000, passo = larg / n;
      for (let i = 1; i <= n; i++) { const d = i * passo; for (const s of [-1, 1]) { const x = C.a + s * d; if (x < C.v[0] || x > C.v[1]) return d - passo; if (!(Math.abs(C.f(x) - C.L) < eps)) return d - passo; } }
      return larg;
    }
    function desenha() {
      const C = FS[k], eps = epsDe(C); q("[data-o=e]").textContent = F.t(eps, 3);
      const oo = { ...o, x0: C.v[0], x1: C.v[1], y0: C.v[2], y1: C.v[3] }, P = quadro(oo), d = delta(C, eps);
      let g = clip("cll", oo) + grade(oo, P, C.xt, C.yt, "x", "") + `<g clip-path="url(#cll)">`;
      g += `<rect x="${oo.l}" y="${P.sy(C.L + eps)}" width="${oo.W - oo.l - oo.r}" height="${P.sy(C.L - eps) - P.sy(C.L + eps)}" style="fill:color-mix(in srgb,var(--mod) 18%,transparent)"/>`;
      if (d > 0) g += `<rect x="${P.sx(C.a - d)}" y="${oo.t}" width="${P.sx(C.a + d) - P.sx(C.a - d)}" height="${oo.H - oo.t - oo.b}" style="fill:color-mix(in srgb,var(--warn) 20%,transparent)"/>`;
      const pts = []; let ant = null;
      for (let i = 0; i <= 3000; i++) { const x = C.v[0] + ((C.v[1] - C.v[0]) * i) / 3000; if (Math.abs(x - C.a) < 1e-12) { pts.push([x, NaN]); continue; } const y = C.f(x); if (ant !== null && Math.abs(y - ant) > 1) pts.push([x, NaN]); pts.push([x, y]); ant = y; }
      g += curva(pts, P, "stroke:var(--ink);stroke-width:2.2");
      if (C.buraco) g += `<circle cx="${P.sx(C.a)}" cy="${P.sy(C.L)}" r="5" style="fill:var(--card);stroke:var(--ink);stroke-width:2"/>`;
      else g += ponto(P.sx(0), P.sy(0), "var(--ink)", 4) + `<circle cx="${P.sx(0)}" cy="${P.sy(1)}" r="5" style="fill:var(--card);stroke:var(--ink);stroke-width:2"/><circle cx="${P.sx(0)}" cy="${P.sy(-1)}" r="5" style="fill:var(--card);stroke:var(--ink);stroke-width:2"/>`;
      g += `</g><text class="tx2" x="${oo.l + 6}" y="${P.sy(C.L + eps) - 4}" style="fill:var(--mod)">L + ε</text><text class="tx2" x="${oo.l + 6}" y="${P.sy(C.L - eps) + 13}" style="fill:var(--mod)">L − ε</text>`;
      q("[data-v=sv]").innerHTML = g;
      q("[data-v=lt]").innerHTML = visT("candidato a limite L", F.t(C.L, 0)) + visT("ε", F.t(eps, 3)) + visT("maior δ que funciona", d > 0 ? F.t(d, 4) : "nenhum!") + (d > 0 ? "" : `<p class="det" style="color:var(--bad);margin:4px 0 0">Do lado esquerdo o gráfico vale −1, longe de L = 1. Com ε &lt; 2 nenhum δ funciona, e nenhum outro L salva os dois lados ao mesmo tempo: o limite não existe.</p>`);
    }
    q("[data-c=e]").addEventListener("input", desenha);
    liga(el, "k", (v) => { k = v; desenha(); });
    desenha();
  };

  /* ---------- CI02 · sen x / x pelas áreas ---------- */
  SIM.senox = (el, F) => {
    const S = 300, ox = 50, oy = 330;
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 420 360" width="420" data-v="sv"></svg><div class="leitor" data-v="lt" style="flex-direction:column;align-items:stretch"></div></div>
      <div class="ctrls"><div class="ctrl"><label>ângulo x (rad)</label><input type="range" min="0.02" max="0.8" step="0.005" value="0.7" data-c="x"><output data-o="x"></output></div></div>
      <div class="status">Raio 1. Triângulo <b style="color:var(--ok)">pequeno</b> (área sen x / 2) ⊂ setor <b style="color:var(--mod)">circular</b> (área x / 2) ⊂ triângulo <b style="color:var(--warn)">grande</b> (área tg x / 2). Diminua o ângulo: as três áreas ficam quase iguais.</div>`);
    const q = (s) => el.querySelector(s);
    function desenha() {
      const x = +q("[data-c=x]").value; q("[data-o=x]").textContent = F.t(x, 3);
      const X = (u) => ox + S * u, Y = (v) => oy - S * v, c = Math.cos(x), s = Math.sin(x), t = Math.tan(x);
      let g = `<path d="M${X(0)} ${Y(0)} L${X(1.08)} ${Y(0)}" class="ln2"/><path d="M${X(0)} ${Y(0)} L${X(0)} ${Y(1.08)}" class="ln2"/><path d="M${X(1)} ${Y(0)} A${S} ${S} 0 0 0 ${X(0)} ${Y(1)}" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/>`;
      g += `<polygon points="${X(0)},${Y(0)} ${X(1)},${Y(0)} ${X(1)},${Y(Math.min(t, 1.05))}" style="fill:color-mix(in srgb,var(--warn) 22%,transparent);stroke:var(--warn);stroke-width:2"/>`;
      g += `<path d="M${X(0)} ${Y(0)} L${X(1)} ${Y(0)} A${S} ${S} 0 0 0 ${X(c)} ${Y(s)} Z" style="fill:color-mix(in srgb,var(--mod) 30%,transparent);stroke:var(--mod);stroke-width:2"/>`;
      g += `<polygon points="${X(0)},${Y(0)} ${X(1)},${Y(0)} ${X(c)},${Y(s)}" style="fill:color-mix(in srgb,var(--ok) 35%,transparent);stroke:var(--ok);stroke-width:2"/>`;
      g += `<line x1="${X(c)}" y1="${Y(s)}" x2="${X(c)}" y2="${Y(0)}" style="stroke:var(--ink2);stroke-dasharray:3 3"/>${D.txt(X(c) - 6, Y(s / 2), "sen x", "tx2", "end")}${D.txt(X(1) + 6, Y(Math.min(t, 1.05) / 2), "tg x", "tx2", "start")}${D.txt(X(0.5), Y(0) + 18, "1", "tx2")}`;
      if (t > 1.05) g += D.txt(X(1) + 6, Y(1.05) + 4, "↑ (tg x sai da tela)", "tx2", "start");
      q("[data-v=sv]").innerHTML = g;
      q("[data-v=lt]").innerHTML = visT("sen x / 2", F.t(s / 2, 5)) + visT("x / 2 (setor)", F.t(x / 2, 5)) + visT("tg x / 2", t > 50 ? "enorme" : F.t(t / 2, 5)) + visT("cos x ≤ sen x / x ≤ 1", `${F.t(c, 5)} ≤ <span style="color:var(--mod)">${F.t(s / x, 5)}</span> ≤ 1`);
    }
    q("[data-c=x]").addEventListener("input", desenha); desenha();
  };

  /* ---------- CI02 · bissecção (valor intermediário) ---------- */
  SIM.bissecao = (el, F) => {
    const FS = {
      cos: { nome: "cos x = x", f: (x) => Math.cos(x) - x, ab: [0, 1], v: [-0.2, 1.2, -1, 1.2], tex: "cos x − x" },
      cub: { nome: "x³ = x + 1", f: (x) => x * x * x - x - 1, ab: [1, 2], v: [0.8, 2.2, -1.5, 5.5], tex: "x³ − x − 1" },
      om: { nome: "x·eˣ = 1 (o W(1))", f: (x) => x * Math.exp(x) - 1, ab: [0, 1], v: [-0.2, 1.2, -1.3, 2], tex: "x·eˣ − 1" },
    };
    let k = "cos", a, b, hist;
    const o = { W: 600, H: 320, l: 44, r: 14, t: 12, b: 30 };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${o.W} ${o.H}" width="${o.W}" data-v="sv"></svg></div><div data-v="tb" style="max-height:230px;overflow:auto"></div>
      <div class="ctrls"><div class="bts">${botoes(Object.entries(FS).map(([kk, c]) => [kk, c.nome]), "k", k)}</div>
      <div class="bts"><button class="bt pri" data-a="passo">Cortar ao meio</button><button class="bt" data-a="dez">10 cortes</button><button class="bt" data-a="zera">Recomeçar</button></div></div>
      <div class="status">A função troca de sinal entre a e b, e é contínua: pelo <b>teorema do valor intermediário</b>, tem uma raiz no meio. Corte o intervalo ao meio e fique com a metade em que o sinal ainda troca. Cada corte dá mais ou menos 1 casa decimal a cada 3,3 cortes (2¹⁰ ≈ 10³).</div>`);
    const q = (s) => el.querySelector(s);
    const zera = () => { [a, b] = FS[k].ab; hist = []; desenha(); };
    function corta() { const f = FS[k].f, m = (a + b) / 2, fm = f(m); hist.push([a, b, m, fm]); if (Math.sign(fm) === Math.sign(f(a))) a = m; else b = m; }
    function desenha() {
      const C = FS[k], oo = { ...o, x0: C.v[0], x1: C.v[1], y0: C.v[2], y1: C.v[3] }, P = quadro(oo);
      const xt = []; for (let v = Math.ceil(C.v[0] * 5) / 5; v <= C.v[1] + 1e-9; v += 0.2) xt.push(+v.toFixed(1));
      let g = clip("clb", oo) + grade(oo, P, xt, [C.v[2], 0, C.v[3]].map((v) => +v.toFixed(1)), "x", "") + `<g clip-path="url(#clb)">`;
      g += `<rect x="${P.sx(a)}" y="${oo.t}" width="${Math.max(1, P.sx(b) - P.sx(a))}" height="${oo.H - oo.t - oo.b}" style="fill:color-mix(in srgb,var(--warn) 22%,transparent)"/>`;
      const pts = []; for (let i = 0; i <= 600; i++) { const x = C.v[0] + ((C.v[1] - C.v[0]) * i) / 600; pts.push([x, C.f(x)]); }
      g += curva(pts, P, "stroke:var(--mod);stroke-width:2.6") + ponto(P.sx(a), P.sy(C.f(a)), "var(--bad)", 5) + ponto(P.sx(b), P.sy(C.f(b)), "var(--ok)", 5) + `</g>`;
      g += `<text class="tx" x="${oo.W - oo.r - 8}" y="${oo.t + 20}" text-anchor="end">f(x) = ${C.tex}</text>`;
      q("[data-v=sv]").innerHTML = g;
      const lin = hist.slice(-12).map(([aa, bb, m, fm], i) => `<tr><td>${hist.length - Math.min(12, hist.length) + i + 1}</td><td>${F.t(aa, 8)}</td><td>${F.t(bb, 8)}</td><td>${F.t(m, 8)}</td><td style="color:${fm > 0 ? "var(--ok)" : "var(--bad)"}">${fm > 0 ? "+" : "−"}</td></tr>`).join("");
      q("[data-v=tb]").innerHTML = `<table class="tb"><tr><th>corte</th><th>a</th><th>b</th><th>meio m</th><th>sinal de f(m)</th></tr>${lin}</table><p class="det" style="color:var(--ink2)">Largura do intervalo agora: ${F.t(b - a, 10)} (= ${C.ab[1] - C.ab[0]}/2^${hist.length}). A raiz está em [${F.t(a, 10)}; ${F.t(b, 10)}].</p>`;
    }
    q("[data-a=passo]").addEventListener("click", () => { corta(); desenha(); });
    q("[data-a=dez]").addEventListener("click", () => { for (let i = 0; i < 10; i++) corta(); desenha(); });
    q("[data-a=zera]").addEventListener("click", zera);
    liga(el, "k", (v) => { k = v; zera(); });
    zera();
  };

  /* ---------- CI03 · secante → tangente ---------- */
  SIM.secante = (el, F) => {
    const FS = {
      x2: { nome: "x²", f: (x) => x * x, d: (x) => 2 * x, v: [-2.5, 2.5, -1, 6], yd: [-5.5, 5.5] },
      cub: { nome: "x³ − 3x", f: (x) => x ** 3 - 3 * x, d: (x) => 3 * x * x - 3, v: [-2.5, 2.5, -4, 4], yd: [-4, 16] },
      sen: { nome: "sen x", f: Math.sin, d: Math.cos, v: [-4, 4, -1.6, 1.6], yd: [-1.6, 1.6] },
      exp: { nome: "eˣ", f: Math.exp, d: Math.exp, v: [-2.5, 2, -0.5, 7.5], yd: [-0.5, 7.5] },
      abs: { nome: "|x|", f: Math.abs, d: (x) => (x > 0 ? 1 : x < 0 ? -1 : NaN), v: [-2.5, 2.5, -0.5, 2.5], yd: [-1.6, 1.6] },
    };
    let k = "x2", neg = false;
    const o = { W: 600, H: 330, l: 44, r: 14, t: 12, b: 30 }, o2 = { W: 600, H: 200, l: 44, r: 14, t: 12, b: 30 };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${o.W} ${o.H}" width="${o.W}" data-v="s1"></svg><svg viewBox="0 0 ${o2.W} ${o2.H}" width="${o2.W}" data-v="s2"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>ponto a</label><input type="range" min="-2" max="2" step="0.01" value="1" data-c="a"><output data-o="a"></output></div>
      <div class="ctrl"><label>h (encolhe →)</label><input type="range" min="0" max="1" step="0.001" value="0.15" data-c="h"><output data-o="h"></output></div>
      <div class="bts">${botoes(Object.entries(FS).map(([kk, c]) => [kk, c.nome]), "k", k)}<button class="bt peq" data-a="neg" aria-pressed="false">h negativo</button></div></div>
      <div class="status">Em cima: a <b style="color:var(--warn)">secante</b> passa por (a, f(a)) e (a + h, f(a + h)); a <b style="color:var(--mod)">tangente</b> é o limite dela quando h → 0. Embaixo: o gráfico de f′, desenhado ponto a ponto pela inclinação da tangente. Mexa no a e veja o ponto de baixo andar sobre f′.</div>`);
    const q = (s) => el.querySelector(s);
    function desenha() {
      const C = FS[k], a = +q("[data-c=a]").value, h = (neg ? -1 : 1) * 1.5 * Math.pow(10, -3 * +q("[data-c=h]").value);
      q("[data-o=a]").textContent = F.t(a, 2); q("[data-o=h]").textContent = F.t(h, 4);
      const oo = { ...o, x0: C.v[0], x1: C.v[1], y0: C.v[2], y1: C.v[3] }, P = quadro(oo);
      const ax = (lo, hi, n) => { const r = []; for (let v = Math.ceil(lo); v <= hi; v += n) r.push(v); return r; };
      let g = clip("cls", oo) + grade(oo, P, ax(C.v[0], C.v[1], 1), ax(C.v[2], C.v[3], C.v[3] - C.v[2] > 6 ? 2 : 1), "x", "") + `<g clip-path="url(#cls)">`;
      const pts = []; for (let i = 0; i <= 600; i++) { const x = C.v[0] + ((C.v[1] - C.v[0]) * i) / 600; pts.push([x, C.f(x)]); }
      g += curva(pts, P, "stroke:var(--ink);stroke-width:2.4");
      const fa = C.f(a), fb = C.f(a + h), m = (fb - fa) / h, dv = C.d(a);
      const reta = (mm, est) => `<line x1="${P.sx(C.v[0])}" y1="${P.sy(fa + mm * (C.v[0] - a))}" x2="${P.sx(C.v[1])}" y2="${P.sy(fa + mm * (C.v[1] - a))}" style="${est}"/>`;
      if (isFinite(dv)) g += reta(dv, "stroke:var(--mod);stroke-width:1.8;stroke-dasharray:7 5");
      g += reta(m, "stroke:var(--warn);stroke-width:2") + ponto(P.sx(a), P.sy(fa), "var(--mod)", 5.5) + ponto(P.sx(a + h), P.sy(fb), "var(--warn)", 5) + `</g>`;
      q("[data-v=s1]").innerHTML = g;
      const ob = { ...o2, x0: C.v[0], x1: C.v[1], y0: C.yd[0], y1: C.yd[1] }, P2 = quadro(ob);
      let g2 = clip("cls2", ob) + grade(ob, P2, ax(C.v[0], C.v[1], 1), [C.yd[0], 0, C.yd[1]].map((v) => +v.toFixed(1)), "x", "f′(x)") + `<g clip-path="url(#cls2)">`;
      const pd = []; let antd = null; for (let i = 0; i <= 600; i++) { const x = C.v[0] + ((C.v[1] - C.v[0]) * i) / 600; const y = C.d(x); if (antd !== null && Math.abs(y - antd) > 1) pd.push([x, NaN]); pd.push([x, y]); antd = y; }
      g2 += curva(pd, P2, "stroke:var(--mod);stroke-width:2.2") + (isFinite(dv) ? ponto(P2.sx(a), P2.sy(dv), "var(--mod)", 5) : "") + ponto(P2.sx(a), P2.sy(Math.max(Math.min(m, C.yd[1]), C.yd[0])), "var(--warn)", 4) + `</g>`;
      q("[data-v=s2]").innerHTML = g2;
      q("[data-v=lt]").innerHTML = visT("inclinação da secante [f(a+h) − f(a)]/h", F.t(m, 6)) + visT("f′(a) (tangente)", isFinite(dv) ? F.t(dv, 6) : "não existe") + visT("diferença", isFinite(dv) ? F.t(m - dv, 6) : "—") + (k === "abs" && Math.abs(a) < 0.005 ? `<p class="det" style="color:var(--bad);margin:4px 0 0">Em a = 0, com h &gt; 0 a secante tem inclinação +1; com h &lt; 0, −1. Os limites laterais são diferentes: |x| não é derivável em 0 (tem um bico).</p>` : "");
    }
    el.querySelectorAll("input").forEach((i) => i.addEventListener("input", desenha));
    q("[data-a=neg]").addEventListener("click", (ev) => { neg = !neg; ev.target.setAttribute("aria-pressed", neg); desenha(); });
    liga(el, "k", (v) => { k = v; desenha(); });
    desenha();
  };

  /* ---------- CI04 · regra da cadeia ---------- */
  SIM.cadeia = (el, F) => {
    const FO = { sen: ["sen u", Math.sin, Math.cos, (g) => `sen(${g})`], exp: ["eᵘ", Math.exp, Math.exp, (g) => `e^(${g})`], quad: ["u²", (u) => u * u, (u) => 2 * u, (g) => `(${g})²`], cub: ["u³", (u) => u ** 3, (u) => 3 * u * u, (g) => `(${g})³`] };
    const GI = { dois: ["2x", (x) => 2 * x, () => 2], x2: ["x²", (x) => x * x, (x) => 2 * x], sen: ["sen x", Math.sin, Math.cos], cub: ["x³ − x", (x) => x ** 3 - x, (x) => 3 * x * x - 1] };
    let fo = "sen", gi = "x2";
    const o = { W: 600, H: 330, l: 44, r: 14, t: 12, b: 30, x0: -2, x1: 2 };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${o.W} ${o.H}" width="${o.W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>x</label><input type="range" min="-1.9" max="1.9" step="0.01" value="0.8" data-c="x"><output data-o="x"></output></div>
      <div class="bts"><b style="margin-right:6px">de fora f(u):</b>${botoes(Object.entries(FO).map(([kk, c]) => [kk, c[0]]), "f", fo)}</div>
      <div class="bts"><b style="margin-right:6px">de dentro u = g(x):</b>${botoes(Object.entries(GI).map(([kk, c]) => [kk, c[0]]), "g", gi)}</div></div>
      <div class="status">O gráfico é h(x) = f(g(x)). A regra da cadeia diz que a inclinação da tangente é o produto de duas taxas: quanto u muda por x (g′) vezes quanto f muda por u (f′ calculada em u = g(x)). O computador confere com a inclinação medida numericamente.</div>`);
    const q = (s) => el.querySelector(s);
    function desenha() {
      const x = +q("[data-c=x]").value; q("[data-o=x]").textContent = F.t(x, 2);
      const [fn, f, df, fmt] = FO[fo], [gn, g, dg] = GI[gi], H = (t) => f(g(t));
      const ys = []; for (let i = 0; i <= 400; i++) ys.push(H(-2 + i / 100));
      let lo = Math.max(-12, Math.min(...ys)), hi = Math.min(12, Math.max(...ys)); if (hi - lo < 1) { lo -= 0.5; hi += 0.5; } const pad = 0.08 * (hi - lo);
      const oo = { ...o, y0: lo - pad, y1: hi + pad }, P = quadro(oo);
      const passoY = (hi - lo) > 8 ? 4 : (hi - lo) > 3 ? 1 : 0.5, yt = []; for (let v = Math.ceil(oo.y0 / passoY) * passoY; v <= oo.y1; v += passoY) yt.push(+v.toFixed(2));
      let s = clip("clk", oo) + grade(oo, P, [-2, -1, 0, 1, 2], yt, "x", "") + `<g clip-path="url(#clk)">`;
      const pts = []; for (let i = 0; i <= 600; i++) { const t = -2 + (4 * i) / 600; pts.push([t, H(t)]); }
      const u = g(x), gp = dg(x), fp = df(u), m = gp * fp, num = (H(x + 1e-6) - H(x - 1e-6)) / 2e-6, y = H(x);
      s += curva(pts, P, "stroke:var(--ink);stroke-width:2.4") + `<line x1="${P.sx(-2)}" y1="${P.sy(y + m * (-2 - x))}" x2="${P.sx(2)}" y2="${P.sy(y + m * (2 - x))}" style="stroke:var(--mod);stroke-width:2;stroke-dasharray:7 5"/>` + ponto(P.sx(x), P.sy(y), "var(--mod)") + `</g>`;
      s += `<text class="tx" x="${oo.l + 10}" y="${oo.t + 20}">h(x) = ${fmt(gn)}</text>`;
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = visT("u = g(x)", F.t(u, 4)) + visT("g′(x)", F.t(gp, 4)) + visT("f′(u)", F.t(fp, 4)) + visT("g′ · f′ (regra da cadeia)", F.t(m, 4)) + visT("inclinação medida", F.t(num, 4));
    }
    q("[data-c=x]").addEventListener("input", desenha);
    liga(el, "f", (v) => { fo = v; desenha(); });
    liga(el, "g", (v) => { gi = v; desenha(); });
    desenha();
  };

  /* ---------- CI05 · salva-vidas (princípio de Fermat) ---------- */
  SIM.salvavidas = (el, F) => {
    const A = [0, 30], B = [40, -20], E = 7.2, ox = 30, oy = 255;
    const X = (x) => ox + E * x, Y = (y) => oy - E * y;
    const o2 = { W: 330, H: 300, l: 44, r: 12, t: 12, b: 30, x0: 0, x1: 40 };
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:start"><svg viewBox="0 0 360 420" width="360" data-v="sv"></svg><div><b>Tempo total T(p)</b><svg viewBox="0 0 ${o2.W} ${o2.H}" width="${o2.W}" data-v="s2"></svg></div></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>p (onde entra na água, m)</label><input type="range" min="0" max="40" step="0.05" value="20" data-c="p"><output data-o="p"></output></div>
      <div class="ctrl"><label>v na areia (m/s)</label><input type="range" min="1" max="8" step="0.1" value="5" data-c="v1"><output data-o="v1"></output></div>
      <div class="ctrl"><label>v nadando (m/s)</label><input type="range" min="0.5" max="5" step="0.1" value="1.5" data-c="v2"><output data-o="v2"></output></div>
      <div class="bts"><button class="bt pri" data-a="otimo">Ir para o mínimo (derivada = 0)</button></div></div>
      <div class="status">O salva-vidas (S) corre na areia e nada até a pessoa (P). A linha reta não é a mais rápida: vale a pena correr mais na areia, onde ele é veloz. No mínimo, sen θ₁ / v₁ = sen θ₂ / v₂, que é a <b>lei de Snell</b> da refração. A luz "escolhe" o caminho mais rápido (princípio de Fermat).</div>`);
    const q = (s) => el.querySelector(s);
    const T = (p, v1, v2) => Math.hypot(p - A[0], A[1]) / v1 + Math.hypot(B[0] - p, B[1]) / v2;
    function otimo(v1, v2) { let lo = 0, hi = 40; for (let i = 0; i < 200; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (T(m1, v1, v2) < T(m2, v1, v2)) hi = m2; else lo = m1; } return (lo + hi) / 2; }
    function desenha() {
      const p = +q("[data-c=p]").value, v1 = +q("[data-c=v1]").value, v2 = +q("[data-c=v2]").value;
      q("[data-o=p]").textContent = F.t(p, 2); q("[data-o=v1]").textContent = F.t(v1, 1); q("[data-o=v2]").textContent = F.t(v2, 1);
      let g = `<rect x="0" y="0" width="360" height="${Y(0)}" style="fill:color-mix(in srgb,#d9b56a 18%,transparent)"/><rect x="0" y="${Y(0)}" width="360" height="${420 - Y(0)}" style="fill:color-mix(in srgb,#3a8fd6 22%,transparent)"/>`;
      g += `<line x1="0" x2="360" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--ink2)"/>${D.txt(10, 20, "areia", "tx2", "start")}${D.txt(10, 410, "água", "tx2", "start")}`;
      g += `<line x1="${X(A[0])}" y1="${Y(A[1])}" x2="${X(B[0])}" y2="${Y(B[1])}" style="stroke:var(--ink3);stroke-dasharray:5 5"/>`;
      g += `<polyline points="${X(A[0])},${Y(A[1])} ${X(p)},${Y(0)} ${X(B[0])},${Y(B[1])}" style="fill:none;stroke:var(--mod);stroke-width:3"/>`;
      g += `<line x1="${X(p)}" x2="${X(p)}" y1="${Y(12)}" y2="${Y(-12)}" style="stroke:var(--ink3);stroke-dasharray:2 3"/>`;
      g += ponto(X(A[0]), Y(A[1]), "var(--ok)", 7) + ponto(X(B[0]), Y(B[1]), "var(--bad)", 7) + ponto(X(p), Y(0), "var(--warn)", 5) + D.txt(X(A[0]) + 12, Y(A[1]) + 4, "S", "txm", "start") + D.txt(X(B[0]) - 12, Y(B[1]) + 4, "P", "txm", "end") + D.txt(X(p) - 6, Y(5), "θ₁", "tx2", "end") + D.txt(X(p) + 6, Y(-6), "θ₂", "tx2", "start");
      q("[data-v=sv]").innerHTML = g;
      const P2 = { ...o2 }, ts = []; for (let i = 0; i <= 200; i++) ts.push(T((40 * i) / 200, v1, v2));
      P2.y0 = Math.floor(Math.min(...ts) * 0.95); P2.y1 = Math.ceil(Math.max(...ts) * 1.02); const Q = quadro(P2);
      const pts = ts.map((t, i) => [(40 * i) / 200, t]), po = otimo(v1, v2);
      let h = clip("clv", P2) + grade(P2, Q, [0, 10, 20, 30, 40], [P2.y0, Math.round((P2.y0 + P2.y1) / 2), P2.y1], "p (m)", "T (s)") + `<g clip-path="url(#clv)">` + curva(pts, Q, "stroke:var(--mod);stroke-width:2.4") + ponto(Q.sx(po), Q.sy(T(po, v1, v2)), "var(--ok)", 4) + ponto(Q.sx(p), Q.sy(T(p, v1, v2)), "var(--warn)", 5.5) + `</g>`;
      q("[data-v=s2]").innerHTML = h;
      const s1 = p / Math.hypot(p, A[1]), s2 = (B[0] - p) / Math.hypot(B[0] - p, B[1]);
      q("[data-v=lt]").innerHTML = visT("T(p)", F.t(T(p, v1, v2), 3) + " s") + visT("mínimo", `p = ${F.t(po, 2)} m, T = ${F.t(T(po, v1, v2), 3)} s`) + visT("linha reta", F.t(T(40 * 30 / 50, v1, v2), 3) + " s") + visT("sen θ₁ / v₁", F.t(s1 / v1, 4)) + visT("sen θ₂ / v₂", F.t(s2 / v2, 4));
    }
    el.querySelectorAll("input").forEach((i) => i.addEventListener("input", desenha));
    q("[data-a=otimo]").addEventListener("click", () => { q("[data-c=p]").value = otimo(+q("[data-c=v1]").value, +q("[data-c=v2]").value); desenha(); });
    desenha();
  };
})();
