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
})();
