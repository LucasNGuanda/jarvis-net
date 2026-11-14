/* Simulações do módulo F (Fundamentos e a matemática do físico):
   F01 referenciais (bola jogada num trem), F02 vetores, F03 círculo trigonométrico, F04 derivada como inclinação e integral como área,
   F05 polinômios de Taylor, A19 análise dimensional (solucionador de expoentes e a bola de fogo de G. I. Taylor). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${k === ativo}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : Math.abs(v) < 0.5 * Math.pow(10, -d) ? "0" : (+v.toFixed(d)).toString().replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const seta = (x1, y1, x2, y2, cor, w = 1.6) => { const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1), c = Math.min(9, L * 0.4); if (L < 0.5) return ""; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${cor};stroke-width:${w}"/><path d="M${x2 - c * Math.cos(a - 0.4)} ${y2 - c * Math.sin(a - 0.4)} L${x2} ${y2} L${x2 - c * Math.cos(a + 0.4)} ${y2 - c * Math.sin(a + 0.4)}" style="fill:none;stroke:${cor};stroke-width:${w}"/>`; };
  const anima = (el, F, desenha) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; desenha(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const val = (el, c) => +el.querySelector(`[data-c=${c}]`).value;
  const mostra = (el, cs, dec = {}) => cs.forEach((c) => (el.querySelector(`[data-o=${c}]`).textContent = n2(val(el, c), dec[c] ?? 1)));

  /* ---------- F01 · a mesma bola vista de dois referenciais ---------- */
  SIM.referencial = (el, F) => {
    const g = 9.8, W = 680, H = 300;
    let ref = "chao", t = 0, trilha = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("velocidade do trem V (m/s)", "V", 0, 6, 0.1, 3)}${sl("velocidade da bola para cima u (m/s)", "u", 1, 8, 0.1, 5)}
      <div class="bts">${botoes([["trem", "visto de dentro do trem"], ["chao", "visto da plataforma"]], "r", ref)}<button class="bt pri" data-a="go">Jogar de novo</button></div></div>
      <div class="status">Uma pessoa dentro de um trem que anda com velocidade constante V joga uma bola para cima e a pega de volta. Para ela, a bola sobe e desce em linha reta. Para quem está na plataforma, a bola sai inclinada e faz uma parábola. A trajetória depende do referencial; o tempo de voo e a altura, não.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.referencial._voo = (u, V) => ({ tvoo: (2 * u) / g, hmax: (u * u) / (2 * g), dx: (V * 2 * u) / g, v0: Math.hypot(u, V), ang: (Math.atan2(u, V) * 180) / Math.PI });
    anima(el, F, (dt) => {
      mostra(el, ["V", "u"]);
      const V = val(el, "V"), u = val(el, "u"), r = SIM.referencial._voo(u, V), esc = 26, chao = H - 40, x0 = 60;
      t += dt; if (t > r.tvoo + 0.6) { t = 0; trilha = []; }
      const tt = Math.min(t, r.tvoo), yb = u * tt - 0.5 * g * tt * tt, xt = ref === "chao" ? V * t : 0, xb = ref === "chao" ? V * tt : 0;
      trilha.push([xb, yb]);
      const X = (x) => x0 + 120 + x * esc, Y = (y) => chao - 70 - y * esc;
      let s = `<line x1="0" x2="${W}" y1="${chao + 20}" y2="${chao + 20}" style="stroke:var(--ink3);stroke-width:2"/>`;
      if (ref === "trem") for (let i = 0; i < 12; i++) { const px = ((i * 70 - V * t * esc) % W + W) % W; s += `<line x1="${px}" x2="${px}" y1="${chao + 20}" y2="${chao + 30}" style="stroke:var(--ink3)"/>`; }
      s += `<rect x="${X(xt) - 110}" y="${chao - 150}" width="240" height="160" rx="12" style="fill:color-mix(in srgb,var(--mod) 12%,transparent);stroke:var(--mod);stroke-width:2"/>`;
      s += `<circle cx="${X(xt) - 70}" cy="${chao + 14}" r="9" style="fill:var(--ink3)"/><circle cx="${X(xt) + 90}" cy="${chao + 14}" r="9" style="fill:var(--ink3)"/>`;
      s += `<line x1="${X(xt) - 30}" y1="${chao + 8}" x2="${X(xt) - 30}" y2="${Y(0) + 26}" style="stroke:var(--ink2);stroke-width:3"/><circle cx="${X(xt) - 30}" cy="${Y(0) + 18}" r="8" style="fill:none;stroke:var(--ink2);stroke-width:2"/><line x1="${X(xt) - 30}" y1="${Y(0) + 30}" x2="${X(xt) - 4}" y2="${Y(0)}" style="stroke:var(--ink2);stroke-width:2"/>`;
      s += `<path d="${trilha.map(([x, y], i) => (i ? "L" : "M") + X(x).toFixed(1) + " " + Y(y).toFixed(1)).join("")}" style="fill:none;stroke:var(--warn);stroke-width:2;stroke-dasharray:4 3"/>`;
      s += `<circle cx="${X(xb)}" cy="${Y(yb)}" r="7" style="fill:var(--warn)"/>`;
      if (ref === "chao" && V > 0) s += seta(X(xt) + 140, chao - 160, X(xt) + 140 + V * 12, chao - 160, "var(--mod)") + `<text class="tx2" x="${X(xt) + 140}" y="${chao - 168}">V</text>`;
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("tempo de voo 2u/g (igual nos dois)", n2(r.tvoo) + " s") + vis("altura que a bola sobe u²/2g", n2(r.hmax) + " m") + vis("velocidade inicial vista da plataforma √(u² + V²)", n2(r.v0) + " m/s") + vis("ângulo de lançamento visto da plataforma", n2(r.ang, 1) + "°") + vis("o trem anda durante o voo", n2(r.dx) + " m");
    });
    q("[data-a=go]").addEventListener("click", () => { t = 0; trilha = []; });
    liga(el, "r", (v) => { ref = v; t = 0; trilha = []; });
  };

  /* ---------- F02 · vetores: soma, diferença, produto escalar e vetorial ---------- */
  SIM.vetores = (el, F) => {
    const W = 460, H = 420;
    let op = "soma";
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg><div class="leitor" data-v="lt" style="flex-direction:column;align-items:stretch"></div></div>
      <div class="ctrls">${sl("|A|", "a", 0, 5, 0.1, 4)}${sl("ângulo de A (graus)", "ta", -180, 180, 1, 20)}${sl("|B|", "b", 0, 5, 0.1, 3)}${sl("ângulo de B (graus)", "tb", -180, 180, 1, 100)}
      <div class="bts">${botoes([["soma", "A + B"], ["dif", "A − B"], ["esc", "A · B (projeção)"], ["vet", "A × B (área)"]], "o", op)}</div></div>
      <div class="status" data-v="txt"></div>`);
    const q = (s) => el.querySelector(s);
    const txt = { soma: "Soma pela regra do paralelogramo (ou ponta com cauda): some as componentes, x com x e y com y. O módulo da soma vem da lei dos cossenos: |A + B|² = A² + B² + 2AB cos θ.", dif: "A − B = A + (−B): é o vetor que vai da ponta de B até a ponta de A. É assim que se calcula a velocidade relativa e o deslocamento.", esc: "O produto escalar A · B = AB cos θ = AxBx + AyBy é um número: |A| vezes a projeção de B sobre A (o segmento laranja). É zero quando os vetores são perpendiculares. Trabalho é um produto escalar: W = F · d.", vet: "O produto vetorial A × B é perpendicular ao plano (aqui, sai ou entra na tela). O módulo AB sen θ é a área do paralelogramo. Torque e força magnética são produtos vetoriais. Regra da mão direita: positivo = saindo da tela." };
    SIM.vetores._calc = (a, ta, b, tb) => { const r = Math.PI / 180, A = [a * Math.cos(ta * r), a * Math.sin(ta * r)], B = [b * Math.cos(tb * r), b * Math.sin(tb * r)]; return { A, B, S: [A[0] + B[0], A[1] + B[1]], D: [A[0] - B[0], A[1] - B[1]], esc: A[0] * B[0] + A[1] * B[1], vet: A[0] * B[1] - A[1] * B[0] }; };
    anima(el, F, () => {
      mostra(el, ["a", "b", "ta", "tb"], { ta: 0, tb: 0 });
      const c = SIM.vetores._calc(val(el, "a"), val(el, "ta"), val(el, "b"), val(el, "tb")), esc = 38, O = [W / 2, H / 2], P = ([x, y]) => [O[0] + x * esc, O[1] - y * esc];
      let s = `<line x1="0" x2="${W}" y1="${O[1]}" y2="${O[1]}" style="stroke:var(--line2)"/><line x1="${O[0]}" x2="${O[0]}" y1="0" y2="${H}" style="stroke:var(--line2)"/>`;
      const A = P(c.A), B = P(c.B);
      if (op === "soma") { const S = P(c.S); s += `<line x1="${A[0]}" y1="${A[1]}" x2="${S[0]}" y2="${S[1]}" style="stroke:var(--ink3);stroke-dasharray:4 4"/><line x1="${B[0]}" y1="${B[1]}" x2="${S[0]}" y2="${S[1]}" style="stroke:var(--ink3);stroke-dasharray:4 4"/>` + seta(O[0], O[1], S[0], S[1], "var(--warn)", 2.6); }
      if (op === "dif") { const D = P(c.D); s += seta(B[0], B[1], A[0], A[1], "var(--warn)", 2.6) + `<line x1="${O[0]}" y1="${O[1]}" x2="${D[0]}" y2="${D[1]}" style="stroke:var(--ink3);stroke-dasharray:4 4"/>` + seta(O[0], O[1], D[0], D[1], "color-mix(in srgb,var(--warn) 50%,transparent)", 1.6); }
      if (op === "esc") { const a2 = c.A[0] ** 2 + c.A[1] ** 2, k = a2 > 1e-9 ? c.esc / a2 : 0, Pr = P([c.A[0] * k, c.A[1] * k]); s += `<line x1="${B[0]}" y1="${B[1]}" x2="${Pr[0]}" y2="${Pr[1]}" style="stroke:var(--ink3);stroke-dasharray:4 4"/><line x1="${O[0]}" y1="${O[1]}" x2="${Pr[0]}" y2="${Pr[1]}" style="stroke:var(--warn);stroke-width:5;opacity:.7"/>`; }
      if (op === "vet") { const S = P(c.S); s += `<polygon points="${O.join(",")} ${A.join(",")} ${S.join(",")} ${B.join(",")}" style="fill:color-mix(in srgb,var(--warn) 25%,transparent);stroke:var(--warn)"/>`; const z = c.vet; s += `<circle cx="${W - 40}" cy="40" r="14" style="fill:none;stroke:var(--ink2);stroke-width:2"/>` + (z > 0 ? `<circle cx="${W - 40}" cy="40" r="4" style="fill:var(--ink2)"/>` : z < 0 ? `<path d="M${W - 48} 32 L${W - 32} 48 M${W - 32} 32 L${W - 48} 48" style="stroke:var(--ink2);stroke-width:2"/>` : "") + `<text class="tx2" x="${W - 40}" y="72" text-anchor="middle">${z > 0 ? "saindo" : z < 0 ? "entrando" : "zero"}</text>`; }
      s += seta(O[0], O[1], A[0], A[1], "var(--mod)", 2.4) + seta(O[0], O[1], B[0], B[1], "var(--ink)", 2.4) + `<text class="tx2" x="${A[0] + 6}" y="${A[1] - 6}" style="fill:var(--mod);font-weight:700">A</text><text class="tx2" x="${B[0] + 6}" y="${B[1] - 6}" style="font-weight:700">B</text>`;
      q("[data-v=sv]").innerHTML = s; q("[data-v=txt]").textContent = txt[op];
      const ang = Math.abs(((val(el, "tb") - val(el, "ta") + 540) % 360) - 180);
      q("[data-v=lt]").innerHTML = vis("A = (Ax, Ay)", `(${n2(c.A[0])}; ${n2(c.A[1])})`) + vis("B = (Bx, By)", `(${n2(c.B[0])}; ${n2(c.B[1])})`) + vis("ângulo entre A e B", n2(ang, 0) + "°") + vis("|A + B|", n2(Math.hypot(...c.S))) + vis("|A − B|", n2(Math.hypot(...c.D))) + vis("A · B = AB cos θ", n2(c.esc)) + vis("(A × B)z = AB sen θ", n2(c.vet));
    });
    liga(el, "o", (v) => (op = v));
  };

  /* ---------- F03 · o círculo trigonométrico ---------- */
  SIM.circulo = (el, F) => {
    const W = 700, H = 300;
    let girando = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("ângulo θ (graus)", "t", 0, 720, 1, 30)}<div class="bts"><button class="bt pri" data-a="gira">Girar (MCU)</button></div></div>
      <div class="status">O ponto anda no círculo de raio 1. A sombra dele no eixo horizontal é o cosseno; no vertical, o seno. Girando com velocidade constante (MCU), as sombras fazem um MHS: é por isso que seno e cosseno aparecem em toda oscilação. À direita, o seno desenhado contra o ângulo.</div>`);
    const q = (s) => el.querySelector(s);
    anima(el, F, (dt) => {
      if (girando) { const i = q("[data-c=t]"); i.value = (+i.value + dt * 60) % 720; }
      mostra(el, ["t"], { t: 0 });
      const td = val(el, "t"), t = (td * Math.PI) / 180, R = 110, O = [150, H / 2], P = [O[0] + R * Math.cos(t), O[1] - R * Math.sin(t)];
      let s = `<circle cx="${O[0]}" cy="${O[1]}" r="${R}" style="fill:none;stroke:var(--ink3)"/><line x1="${O[0] - R - 20}" x2="${O[0] + R + 20}" y1="${O[1]}" y2="${O[1]}" style="stroke:var(--line2)"/><line x1="${O[0]}" x2="${O[0]}" y1="${O[1] - R - 20}" y2="${O[1] + R + 20}" style="stroke:var(--line2)"/>`;
      const ar = 26; s += `<path d="M${O[0] + ar} ${O[1]} A${ar} ${ar} 0 ${(t % (2 * Math.PI)) > Math.PI ? 1 : 0} 0 ${O[0] + ar * Math.cos(t)} ${O[1] - ar * Math.sin(t)}" style="fill:none;stroke:var(--ink2)"/>`;
      s += `<line x1="${O[0]}" y1="${O[1]}" x2="${P[0]}" y2="${P[1]}" style="stroke:var(--ink);stroke-width:2"/>`;
      s += `<line x1="${O[0]}" y1="${O[1]}" x2="${P[0]}" y2="${O[1]}" style="stroke:var(--mod);stroke-width:4"/><line x1="${P[0]}" y1="${O[1]}" x2="${P[0]}" y2="${P[1]}" style="stroke:var(--warn);stroke-width:4"/>`;
      s += `<circle cx="${P[0]}" cy="${P[1]}" r="6" style="fill:var(--ink)"/><text class="tx2" x="${O[0] + R * Math.cos(t) / 2}" y="${O[1] + 18}" text-anchor="middle" style="fill:var(--mod)">cos θ</text><text class="tx2" x="${P[0] + 8}" y="${(O[1] + P[1]) / 2}" style="fill:var(--warn)">sen θ</text>`;
      const g0 = 320, g1 = W - 20, Xg = (a) => g0 + ((g1 - g0) * a) / (4 * Math.PI), Yg = (v) => O[1] - v * R;
      let d = "", d2 = ""; for (let i = 0; i <= 200; i++) { const a = (4 * Math.PI * i) / 200; d += (i ? "L" : "M") + Xg(a).toFixed(1) + " " + Yg(Math.sin(a)).toFixed(1); d2 += (i ? "L" : "M") + Xg(a).toFixed(1) + " " + Yg(Math.cos(a)).toFixed(1); }
      s += `<line x1="${g0}" x2="${g1}" y1="${O[1]}" y2="${O[1]}" style="stroke:var(--line2)"/><path d="${d2}" style="fill:none;stroke:var(--mod);stroke-width:1.5;opacity:.5"/><path d="${d}" style="fill:none;stroke:var(--warn);stroke-width:2"/>`;
      s += `<line x1="${P[0]}" y1="${P[1]}" x2="${Xg(t)}" y2="${P[1]}" style="stroke:var(--ink3);stroke-dasharray:3 3"/><circle cx="${Xg(t)}" cy="${Yg(Math.sin(t))}" r="5" style="fill:var(--warn)"/>`;
      [1, 2, 3, 4].forEach((k) => (s += `<text class="tx2" x="${Xg((k * Math.PI))}" y="${O[1] + R + 22}" text-anchor="middle">${k === 1 ? "π" : k + "π"}</text>`));
      q("[data-v=sv]").innerHTML = s;
      const tn = Math.abs(Math.cos(t)) < 1e-9 ? NaN : Math.tan(t);
      q("[data-v=lt]").innerHTML = vis("θ em radianos", n2(t, 3) + " rad") + vis("sen θ", n2(Math.sin(t), 3)) + vis("cos θ", n2(Math.cos(t), 3)) + vis("tg θ", isFinite(tn) && Math.abs(tn) < 1e4 ? n2(tn, 3) : "não existe") + vis("sen²θ + cos²θ", n2(Math.sin(t) ** 2 + Math.cos(t) ** 2, 3)) + (td > 0 && td <= 90 ? vis("erro de usar sen θ ≈ θ", n2((100 * (t - Math.sin(t))) / Math.sin(t), 2) + "%") : "");
    });
    q("[data-a=gira]").addEventListener("click", (e) => { girando = !girando; e.currentTarget.textContent = girando ? "Parar" : "Girar (MCU)"; });
  };

  /* ---------- F04 · derivada = inclinação, integral = área ---------- */
  SIM.derivada = (el, F) => {
    const W = 680, H = 400;
    const FS = { muv: { nome: "MUV: x = 2 + 4t − t²", x: (t) => 2 + 4 * t - t * t, v: (t) => 4 - 2 * t }, osc: { nome: "oscilação: x = 3 sen t", x: (t) => 3 * Math.sin(t), v: (t) => 3 * Math.cos(t) }, cub: { nome: "cúbica: x = t³ − 6t² + 9t", x: (t) => t ** 3 - 6 * t * t + 9 * t, v: (t) => 3 * t * t - 12 * t + 9 } };
    let k = "muv";
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("instante t (s)", "t", 0, 5, 0.01, 1)}<div class="bts">${botoes(Object.entries(FS).map(([kk, f]) => [kk, f.nome]), "f", k)}</div></div>
      <div class="status">Em cima, a posição x(t) e a reta tangente no instante t: a inclinação dela é a velocidade, v = dx/dt. Embaixo, a velocidade v(t): a área entre a curva e o eixo, de 0 até t (com sinal: abaixo do eixo conta negativo), é o deslocamento x(t) − x(0). Derivada e integral são operações inversas (Teorema Fundamental do Cálculo).</div>`);
    const q = (s) => el.querySelector(s);
    SIM.derivada._num = (kk, t) => { const f = FS[kk], n = 2000; let A = 0; for (let i = 0; i < n; i++) { const a = (t * i) / n, b = (t * (i + 1)) / n; A += ((f.v(a) + f.v(b)) / 2) * (b - a); } return { x: f.x(t), v: f.v(t), area: A, dx: f.x(t) - f.x(0) }; };
    anima(el, F, () => {
      mostra(el, ["t"], { t: 2 });
      const f = FS[k], t = val(el, "t"), x0 = 60, x1 = W - 20, Xt = (tt) => x0 + ((x1 - x0) * tt) / 5;
      let xmin = Infinity, xmax = -Infinity, vmin = Infinity, vmax = -Infinity;
      for (let i = 0; i <= 200; i++) { const tt = (5 * i) / 200; xmin = Math.min(xmin, f.x(tt)); xmax = Math.max(xmax, f.x(tt)); vmin = Math.min(vmin, f.v(tt)); vmax = Math.max(vmax, f.v(tt)); }
      xmin = Math.min(xmin, 0); vmin = Math.min(vmin, 0); vmax = Math.max(vmax, 0);
      const Yx = (x) => 170 - ((x - xmin) / (xmax - xmin || 1)) * 150, Yv = (v) => 380 - ((v - vmin) / (vmax - vmin || 1)) * 160;
      let s = `<line x1="${x0}" x2="${x1}" y1="${Yx(0)}" y2="${Yx(0)}" style="stroke:var(--line2)"/><line x1="${x0}" x2="${x1}" y1="${Yv(0)}" y2="${Yv(0)}" style="stroke:var(--line2)"/><text class="tx2" x="${x0 - 8}" y="30" text-anchor="end">x</text><text class="tx2" x="${x0 - 8}" y="230" text-anchor="end">v</text>`;
      let dx = "", dv = "", area = `M${Xt(0)} ${Yv(0)}`;
      for (let i = 0; i <= 200; i++) { const tt = (5 * i) / 200; dx += (i ? "L" : "M") + Xt(tt).toFixed(1) + " " + Yx(f.x(tt)).toFixed(1); dv += (i ? "L" : "M") + Xt(tt).toFixed(1) + " " + Yv(f.v(tt)).toFixed(1); }
      for (let i = 0; i <= 100; i++) { const tt = (t * i) / 100; area += ` L${Xt(tt).toFixed(1)} ${Yv(f.v(tt)).toFixed(1)}`; } area += ` L${Xt(t)} ${Yv(0)} Z`;
      s += `<path d="${area}" style="fill:color-mix(in srgb,var(--warn) 30%,transparent)"/><path d="${dx}" style="fill:none;stroke:var(--mod);stroke-width:2.5"/><path d="${dv}" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
      const v = f.v(t), xt = f.x(t), sc = ((Xt(1) - Xt(0)) / 1);
      const ta = t - 1.2, tb = t + 1.2; s += `<line x1="${Xt(ta)}" y1="${Yx(xt + v * (ta - t))}" x2="${Xt(tb)}" y2="${Yx(xt + v * (tb - t))}" style="stroke:var(--warn);stroke-width:2"/>`;
      s += `<circle cx="${Xt(t)}" cy="${Yx(xt)}" r="5" style="fill:var(--warn)"/><line x1="${Xt(t)}" x2="${Xt(t)}" y1="20" y2="${H - 10}" style="stroke:var(--ink3);stroke-dasharray:3 3"/>`;
      [0, 1, 2, 3, 4, 5].forEach((tt) => (s += `<text class="tx2" x="${Xt(tt)}" y="${H - 2}" text-anchor="middle">${tt}</text>`));
      q("[data-v=sv]").innerHTML = s;
      const r = SIM.derivada._num(k, t);
      q("[data-v=lt]").innerHTML = vis("posição x(t)", n2(r.x)) + vis("v(t) = inclinação da tangente", n2(r.v)) + vis("área sob v de 0 a t", n2(r.area)) + vis("x(t) − x(0)", n2(r.dx));
      void sc;
    });
    liga(el, "f", (v) => (k = v));
  };

  /* ---------- F05 · polinômios de Taylor ---------- */
  SIM.taylor = (el, F) => {
    const W = 680, H = 340;
    const fat = (n) => (n <= 1 ? 1 : n * fat(n - 1));
    const FS = {
      sen: { nome: "sen x", f: Math.sin, c: (n) => (n % 2 ? ((n - 1) / 2) % 2 ? -1 / fat(n) : 1 / fat(n) : 0), dom: [-7, 7] },
      cos: { nome: "cos x", f: Math.cos, c: (n) => (n % 2 ? 0 : (n / 2) % 2 ? -1 / fat(n) : 1 / fat(n)), dom: [-7, 7] },
      exp: { nome: "eˣ", f: Math.exp, c: (n) => 1 / fat(n), dom: [-4, 3] },
      raiz: { nome: "√(1 + x)", f: (x) => (x >= -1 ? Math.sqrt(1 + x) : NaN), c: (n) => { let c = 1; for (let i = 0; i < n; i++) c *= (0.5 - i) / (i + 1); return c; }, dom: [-1, 3] },
      geo: { nome: "1/(1 − x)", f: (x) => 1 / (1 - x), c: () => 1, dom: [-1.5, 0.95] },
      ln: { nome: "ln(1 + x)", f: (x) => (x > -1 ? Math.log(1 + x) : NaN), c: (n) => (n === 0 ? 0 : (n % 2 ? 1 : -1) / n), dom: [-0.95, 2] },
    };
    let k = "sen";
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("grau do polinômio N", "n", 0, 12, 1, 3)}${sl("ponto x onde comparar", "x", -3, 3, 0.01, 0.5)}<div class="bts">${botoes(Object.entries(FS).map(([kk, f]) => [kk, f.nome]), "f", k)}</div></div>
      <div class="status">A curva cinza é a função; a laranja é o polinômio de Taylor em torno de 0 até o grau N. Perto de 0, poucos termos já bastam (é o que a física usa: sen x ≈ x, √(1 + x) ≈ 1 + x/2). Longe, precisa de mais termos, e para √(1 + x), 1/(1 − x) e ln(1 + x) a série só converge para |x| < 1 (ou ≤ 1): fora disso, mais termos pioram.</div>`);
    const q = (s) => el.querySelector(s);
    const P = (kk, N, x) => { let s = 0; for (let n = 0; n <= N; n++) s += FS[kk].c(n) * x ** n; return s; };
    SIM.taylor._P = P; SIM.taylor._f = (kk, x) => FS[kk].f(x);
    anima(el, F, () => {
      mostra(el, ["n", "x"], { n: 0, x: 2 });
      const f = FS[k], N = val(el, "n"), xv = val(el, "x"), [a, b] = f.dom, x0 = 40, x1 = W - 20, Ymax = 3.2, X = (x) => x0 + ((x1 - x0) * (x - a)) / (b - a), Y = (y) => H / 2 - (Math.max(-Ymax, Math.min(Ymax, y)) * (H / 2 - 16)) / Ymax;
      let s = `<line x1="${x0}" x2="${x1}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--line2)"/>` + (a < 0 && b > 0 ? `<line x1="${X(0)}" x2="${X(0)}" y1="8" y2="${H - 8}" style="stroke:var(--line2)"/>` : "");
      let df = "", dp = "", pen = false;
      for (let i = 0; i <= 400; i++) { const x = a + ((b - a) * i) / 400, y = f.f(x); if (isFinite(y) && Math.abs(y) < 50) { df += (pen ? "L" : "M") + X(x).toFixed(1) + " " + Y(y).toFixed(1); pen = true; } else pen = false; dp += (i ? "L" : "M") + X(x).toFixed(1) + " " + Y(P(k, N, x)).toFixed(1); }
      s += `<path d="${df}" style="fill:none;stroke:var(--ink2);stroke-width:3;opacity:.7"/><path d="${dp}" style="fill:none;stroke:var(--warn);stroke-width:2"/>`;
      if (xv >= a && xv <= b) s += `<line x1="${X(xv)}" x2="${X(xv)}" y1="8" y2="${H - 8}" style="stroke:var(--ink3);stroke-dasharray:3 3"/>`;
      q("[data-v=sv]").innerHTML = s;
      const fv = f.f(xv), pv = P(k, N, xv);
      q("[data-v=lt]").innerHTML = vis(`f(x) = ${f.nome}`, isFinite(fv) ? n2(fv, 5) : "não definida") + vis(`polinômio de grau ${N}`, n2(pv, 5)) + vis("erro relativo", isFinite(fv) && Math.abs(fv) > 1e-12 ? n2((100 * Math.abs(pv - fv)) / Math.abs(fv), 3) + "%" : "—");
    });
    liga(el, "f", (v) => (k = v));
  };

  /* ---------- A19 · análise dimensional ---------- */
  SIM.dimensional = (el, F) => {
    const D = { L: [0, 1, 0], g: [0, 1, -2], m: [1, 0, 0], k: [1, 0, -2], T: [1, 1, -2], mu: [1, -1, 0], E: [1, 2, -2], rho: [1, -3, 0], t: [0, 0, 1], hb: [1, 2, -1], G: [-1, 3, -2], c: [0, 1, -1], lam: [0, 1, 0], h: [0, 1, 0] };
    const PROB = {
      pend: { nome: "período do pêndulo", alvo: ["T", [0, 0, 1]], vars: [["L", "comprimento L"], ["g", "gravidade g"], ["m", "massa m"]] },
      mola: { nome: "período massa–mola", alvo: ["T", [0, 0, 1]], vars: [["m", "massa m"], ["k", "constante k"]] },
      corda: { nome: "velocidade na corda", alvo: ["v", [0, 1, -1]], vars: [["T", "tração T"], ["mu", "densidade linear μ"]] },
      queda: { nome: "velocidade de queda", alvo: ["v", [0, 1, -1]], vars: [["g", "gravidade g"], ["h", "altura h"]] },
      agua: { nome: "ondas em água funda", alvo: ["v", [0, 1, -1]], vars: [["g", "gravidade g"], ["lam", "comprimento de onda λ"]] },
      planck: { nome: "comprimento de Planck", alvo: ["ℓ", [0, 1, 0]], vars: [["hb", "ħ"], ["G", "G"], ["c", "c"]] },
      bomba: { nome: "bola de fogo (Taylor)", alvo: ["R", [0, 1, 0]], vars: [["E", "energia E"], ["rho", "densidade do ar ρ"], ["t", "tempo t"]] },
    };
    const NOME = { L: "L", g: "g", m: "m", k: "k", T: "T", mu: "μ", E: "E", rho: "ρ", t: "t", hb: "ħ", G: "G", c: "c", lam: "λ", h: "h" };
    /* resolve Σ x_j·D_j = alvo por eliminação de Gauss (3 equações, n incógnitas) */
    const resolve = (vars, alvo) => {
      const n = vars.length, A = [0, 1, 2].map((i) => [...vars.map((v) => D[v][i]), alvo[i]]);
      let lin = 0; const piv = [];
      for (let col = 0; col < n; col++) { let p = -1; for (let i = lin; i < 3; i++) if (Math.abs(A[i][col]) > 1e-12) { p = i; break; } if (p < 0) return null; [A[lin], A[p]] = [A[p], A[lin]]; const d = A[lin][col]; A[lin] = A[lin].map((x) => x / d); for (let i = 0; i < 3; i++) if (i !== lin) { const f = A[i][col]; A[i] = A[i].map((x, j) => x - f * A[lin][j]); } piv.push(col); lin++; }
      for (let i = lin; i < 3; i++) if (Math.abs(A[i][n]) > 1e-9) return null;
      return piv.map((_, i) => A[i][n]);
    };
    const frac = (x) => { for (let d = 1; d <= 12; d++) { const nn = Math.round(x * d); if (Math.abs(nn / d - x) < 1e-9) return d === 1 ? String(nn).replace("-", "−") : (nn < 0 ? "−" : "") + Math.abs(nn) + "/" + d; } return n2(x, 3); };
    SIM.dimensional._resolve = (k) => resolve(PROB[k].vars.map((v) => v[0]), PROB[k].alvo[1]);
    SIM.dimensional._bomba = (Ekt, tms, rho = 1.2) => Math.pow((Ekt * 4.184e12 * (tms / 1000) ** 2) / rho, 0.2);
    let k = "pend";
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="pc" style="padding:14px 18px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="bts">${botoes(Object.entries(PROB).map(([kk, p]) => [kk, p.nome]), "p", k)}</div>
      <div data-v="cb" style="display:none">${sl("energia E (quilotons de TNT)", "E", 1, 50, 1, 20)}${sl("tempo depois da explosão t (ms)", "t", 1, 100, 1, 25)}</div></div>
      <div class="status">Cada grandeza tem dimensão M^a L^b T^c. Para a fórmula estar certa, os expoentes de M, L e T precisam bater dos dois lados: isso dá um sistema linear para os expoentes das variáveis. A análise dimensional não dá a constante numérica (o 2π do pêndulo, por exemplo), mas dá todo o resto, e às vezes mostra que uma variável nem entra (a massa no pêndulo).</div>`);
    const q = (s) => el.querySelector(s);
    anima(el, F, () => {
      const p = PROB[k], vars = p.vars.map((v) => v[0]), x = resolve(vars, p.alvo[1]), dim = (d) => ["M", "L", "T"].map((s, i) => (d[i] ? s + (d[i] === 1 ? "" : "<sup>" + String(d[i]).replace("-", "−") + "</sup>") : "")).join(" ") || "1";
      q("[data-v=cb]").style.display = k === "bomba" ? "contents" : "none";
      let tab = `<table class="tb" style="margin:0 auto"><tr><th>grandeza</th><th>dimensão</th><th>expoente</th></tr>` + p.vars.map(([v, nome], i) => `<tr><td>${nome}</td><td>${dim(D[v])}</td><td><b>${x ? frac(x[i]) : "?"}</b></td></tr>`).join("") + `<tr><td><b>${p.alvo[0]}</b> (o que se quer)</td><td>${dim(p.alvo[1])}</td><td></td></tr></table>`;
      const formula = x ? `${p.alvo[0]} ∝ ` + vars.map((v, i) => (Math.abs(x[i]) < 1e-12 ? "" : NOME[v] + (Math.abs(x[i] - 1) < 1e-12 ? "" : "<sup>" + frac(x[i]) + "</sup>"))).filter(Boolean).join(" · ") : "sem solução";
      const some = x ? vars.filter((v, i) => Math.abs(x[i]) < 1e-12).map((v) => NOME[v]) : [];
      q("[data-v=pc]").innerHTML = tab + `<p style="text-align:center;font-size:20px;margin:12px 0 0">${formula}</p>` + (some.length ? `<p style="text-align:center;color:var(--ink2)">${some.join(", ")} não entra: o expoente deu zero.</p>` : "");
      if (k === "bomba") { mostra(el, ["E", "t"], { E: 0, t: 0 }); const R = SIM.dimensional._bomba(val(el, "E"), val(el, "t")); q("[data-v=lt]").innerHTML = vis("raio da bola de fogo R ≈ (Et²/ρ)^(1/5)", n2(R, 0) + " m") + vis("E em joules (1 kt = 4,184 × 10¹² J)", F.cient(val(el, "E") * 4.184e12, 2) + " J"); }
      else q("[data-v=lt]").innerHTML = vis("sistema", `${vars.length} incógnitas, 3 equações (M, L, T)`) + vis("solução", x ? "única" : "não existe");
    });
    liga(el, "p", (v) => (k = v));
  };
})();
