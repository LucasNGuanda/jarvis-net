/* EP10 · Dois discos rolando sem deslizar, ligados por duas molas, entre duas paredes (colisões com e = 1).
   Modelo: φ, ψ (horário positivo = rolar para a direita), centros em x = X₀ + rφ, M = diag(3/2·m₁r₁², 3/2·m₂r₂²).
   Molas horizontais no equilíbrio: a 1 na altura r₁ + a, a 2 na altura r₂ − b (é a configuração em que a matriz do vídeo é a linearização certa).
   "exato": geometria completa das molas girando com os discos; "linear": M q̈ + K q = 0 com a matriz do vídeo.
   Colisões: impulso generalizado elástico com a restrição de rolamento mantida. Conferido em Python (scratchpad discos.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${k === ativo}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : Math.abs(v) < 0.5 * Math.pow(10, -d) ? "0" : (+v.toFixed(d)).toString().replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;

  /* geometria fixa (m) */
  const G = { r1: 0.3, r2: 0.25, a: 0.1, b: 0.08, X1: 0.55, X2: 1.45, wL: 0, wR: 2.0 };
  G.h1 = G.r1 + G.a; G.h2 = G.r2 - G.b;
  /* pontos de ancoragem: [disco, d, θ] (θ a partir da vertical, horário) */
  const anc = (disco, h) => { const r = disco === 1 ? G.r1 : G.r2; return [h - r >= 0 ? h - r : r - h, h - r >= 0 ? 0 : Math.PI]; };
  const MOLAS = [{ p: anc(1, G.h1), q: anc(2, G.h1) }, { p: anc(1, G.h2), q: anc(2, G.h2) }];
  const L0 = G.X2 - G.X1;
  const ponto = (disco, ang, [d, th]) => { const r = disco === 1 ? G.r1 : G.r2, X = disco === 1 ? G.X1 : G.X2; return [X + r * ang + d * Math.sin(ang + th), r + d * Math.cos(ang + th)]; };
  const dponto = (disco, ang, [d, th]) => { const r = disco === 1 ? G.r1 : G.r2; return [r + d * Math.cos(ang + th), -d * Math.sin(ang + th)]; };

  /* modelo físico puro (também usado nos testes) */
  const modelo = (P) => {
    const A = 1.5 * P.m1 * G.r1 ** 2, B = 1.5 * P.m2 * G.r2 ** 2, ks = [P.k1, P.k2], kappa = P.k1 * G.h1 ** 2 + P.k2 * G.h2 ** 2;
    const forcas = (f, s) => {
      if (P.modo === "linear") { const t = kappa * (s - f); return [t, -t]; }
      let Qf = 0, Qs = 0;
      MOLAS.forEach((m, i) => { const p = ponto(1, f, m.p), q = ponto(2, s, m.q), dx = p[0] - q[0], dy = p[1] - q[1], l = Math.hypot(dx, dy), T = ks[i] * (l - L0) / l, Fp = [-T * dx, -T * dy], dp = dponto(1, f, m.p), dq = dponto(2, s, m.q); Qf += Fp[0] * dp[0] + Fp[1] * dp[1]; Qs -= Fp[0] * dq[0] + Fp[1] * dq[1]; });
      return [Qf, Qs];
    };
    const deriv = (y) => { const [Qf, Qs] = forcas(y[0], y[1]); return [y[2], y[3], Qf / A, Qs / B]; };
    const energia = (y) => {
      let U;
      if (P.modo === "linear") U = 0.5 * kappa * (y[1] - y[0]) ** 2;
      else U = MOLAS.reduce((acc, m, i) => { const p = ponto(1, y[0], m.p), q = ponto(2, y[1], m.q); return acc + 0.5 * ks[i] * (Math.hypot(p[0] - q[0], p[1] - q[1]) - L0) ** 2; }, 0);
      return 0.5 * A * y[2] ** 2 + 0.5 * B * y[3] ** 2 + U;
    };
    /* colisões: devolve o novo estado e se bateu */
    const colide = (y) => {
      let bateu = 0;
      const x1 = G.X1 + G.r1 * y[0], x2 = G.X2 + G.r2 * y[1];
      if (x1 - G.r1 <= G.wL && y[2] < 0) { y[2] = -y[2]; bateu++; }
      if (x2 + G.r2 >= G.wR && y[3] > 0) { y[3] = -y[3]; bateu++; }
      const gv = [-G.r1, G.r2], gdot = gv[0] * y[2] + gv[1] * y[3];
      if (x2 - x1 <= 2 * Math.sqrt(G.r1 * G.r2) && gdot < 0) { const lam = (-2 * gdot) / (gv[0] ** 2 / A + gv[1] ** 2 / B); y[2] += (lam * gv[0]) / A; y[3] += (lam * gv[1]) / B; bateu++; }
      return bateu;
    };
    const passo = (y, h) => { const k1 = deriv(y), k2 = deriv(y.map((v, i) => v + (h / 2) * k1[i])), k3 = deriv(y.map((v, i) => v + (h / 2) * k2[i])), k4 = deriv(y.map((v, i) => v + h * k3[i])); return y.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); };
    return { A, B, kappa, omega: Math.sqrt(kappa * (1 / A + 1 / B)), deriv, energia, colide, passo };
  };
  /* simulação "seca" para testes: devolve [estado, colisões, energia inicial, energia final] */
  SIM.discosRodar = (P, y0, T, h = 2e-4) => { const M = modelo(P); let y = [...y0], n = 0; const E0 = M.energia(y); for (let t = 0; t < T; t += h) { y = M.passo(y, h); n += M.colide(y); } return { y, n, E0, E1: M.energia(y), omega: M.omega, kappa: M.kappa, A: M.A, B: M.B }; };

  SIM.discos = (el, F) => {
    const W = 720, H = 300, esc = 320, x0p = 40, chao = H - 40, X = (x) => x0p + x * esc, Y = (y) => chao - y * esc;
    let modo = "exato", y, n, E0, vivo = true, ult = null, rodando = true, t = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("ângulo inicial do disco 1, φ₀ (graus)", "f0", -45, 60, 1, 40)}${sl("empurrão inicial no disco 2, ψ̇₀ (rad/s)", "w0", -12, 12, 0.5, 6)}${sl("k₁ (N/m)", "k1", 5, 80, 1, 40)}${sl("k₂ (N/m)", "k2", 5, 80, 1, 30)}${sl("massa m₁ (kg)", "m1", 0.5, 4, 0.1, 2)}${sl("massa m₂ (kg)", "m2", 0.5, 4, 0.1, 1)}
      <div class="bts">${botoes([["exato", "molas de verdade (não linear)"], ["linear", "linearizado (matriz do vídeo)"]], "m", modo)}<button class="bt pri" data-a="re">Soltar de novo</button><button class="bt peq" data-a="pa">Pausar</button></div></div>
      <div class="status">Os discos rolam sem deslizar (μ ≠ 0) e batem entre si e nas paredes sem perder energia (e = 1). As molas estão horizontais quando φ = ψ = 0: a de cima na altura r₁ + a, a de baixo na altura r₂ − b. Mude φ₀ ou ψ̇₀ ou as molas e clique em "Soltar de novo". No modo linearizado, a força das molas é a da matriz K do vídeo; com ângulos grandes, ele se afasta do modelo exato.</div>`);
    const q = (s) => el.querySelector(s);
    const P = () => ({ m1: +q("[data-c=m1]").value, m2: +q("[data-c=m2]").value, k1: +q("[data-c=k1]").value, k2: +q("[data-c=k2]").value, modo });
    let M = modelo(P());
    const reinicia = () => { M = modelo(P()); y = [(+q("[data-c=f0]").value * Math.PI) / 180, 0, 0, +q("[data-c=w0]").value]; n = 0; t = 0; E0 = M.energia(y); };
    const mola = (p, qq, voltas = 10, larg = 7) => { const dx = qq[0] - p[0], dy = qq[1] - p[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L; let d = `M${p[0].toFixed(1)} ${p[1].toFixed(1)}`; const n0 = 2 * voltas; for (let i = 1; i < n0; i++) { const s = 0.08 + (0.84 * i) / n0, o = (i % 2 ? 1 : -1) * larg; d += ` L${(p[0] + ux * L * s - uy * o).toFixed(1)} ${(p[1] + uy * L * s + ux * o).toFixed(1)}`; } return d + ` L${qq[0].toFixed(1)} ${qq[1].toFixed(1)}`; };
    function desenha(dt) {
      ["f0", "w0", "k1", "k2", "m1", "m2"].forEach((c) => (q(`[data-o=${c}]`).textContent = n2(+q(`[data-c=${c}]`).value, c === "m1" || c === "m2" || c === "w0" ? 1 : 0)));
      if (rodando) { const nP = 60, h = Math.min(dt, 0.04) / nP; for (let i = 0; i < nP; i++) { y = M.passo(y, h); n += M.colide(y); } t += Math.min(dt, 0.04); }
      const x1 = G.X1 + G.r1 * y[0], x2 = G.X2 + G.r2 * y[1];
      let s = `<line x1="${X(G.wL) - 20}" x2="${X(G.wR) + 20}" y1="${chao}" y2="${chao}" style="stroke:var(--ink2);stroke-width:2"/>`;
      for (let i = 0; i < 44; i++) s += `<line x1="${X(G.wL) + i * 15}" y1="${chao}" x2="${X(G.wL) + i * 15 - 8}" y2="${chao + 8}" style="stroke:var(--ink3)"/>`;
      s += `<rect x="${X(G.wL) - 8}" y="${Y(0.75)}" width="8" height="${0.75 * esc}" style="fill:var(--ink3)"/><rect x="${X(G.wR)}" y="${Y(0.75)}" width="8" height="${0.75 * esc}" style="fill:var(--ink3)"/>`;
      [[1, x1, G.r1, y[0], "--mU"], [2, x2, G.r2, y[1], "--mA"]].forEach(([d, xc, r, ang, cor]) => {
        s += `<circle cx="${X(xc)}" cy="${Y(r)}" r="${r * esc}" style="fill:color-mix(in srgb,var(${cor}) 18%,transparent);stroke:var(${cor});stroke-width:2.5"/>`;
        s += `<line x1="${X(xc)}" y1="${Y(r)}" x2="${X(xc + r * Math.sin(ang))}" y2="${Y(r + r * Math.cos(ang))}" style="stroke:var(${cor});stroke-width:1.5;stroke-dasharray:4 3"/><circle cx="${X(xc)}" cy="${Y(r)}" r="3" style="fill:var(--ink)"/>`;
        s += `<text class="tx2" x="${X(xc)}" y="${chao + 26}" text-anchor="middle">${d === 1 ? "P" : "Q"}</text>`;
      });
      MOLAS.forEach((m, i) => { const p = ponto(1, y[0], m.p), qq = ponto(2, y[1], m.q), pp = [X(p[0]), Y(p[1])], qp = [X(qq[0]), Y(qq[1])]; s += `<path d="${mola(pp, qp, 9, 6)}" style="fill:none;stroke:${i ? "var(--ink2)" : "var(--warn)"};stroke-width:1.6"/><circle cx="${pp[0]}" cy="${pp[1]}" r="3.5" style="fill:var(--bg);stroke:var(--ink)"/><circle cx="${qp[0]}" cy="${qp[1]}" r="3.5" style="fill:var(--bg);stroke:var(--ink)"/>`; });
      s += `<text class="tx2" x="${W / 2}" y="${24}" text-anchor="middle">número total de colisões: ${n}</text>`;
      q("[data-v=sv]").innerHTML = s;
      const E = M.energia(y);
      q("[data-v=lt]").innerHTML = vis("colisões", n) + vis("φ e ψ", n2((y[0] * 180) / Math.PI, 0) + "° e " + n2((y[1] * 180) / Math.PI, 0) + "°") + vis("ω do modo que oscila (linear) √(κ(1/A + 1/B))", n2(M.omega, 2) + " rad/s") + vis("energia total", n2(E, 3) + " J") + vis("variação da energia (deve ser ~0)", n2((100 * (E - E0)) / Math.max(1e-9, E0), 3) + "%");
    }
    function laco(ts) { if (!vivo) return; const dt = ult === null ? 0 : (ts - ult) / 1000; ult = ts; desenha(dt); requestAnimationFrame(laco); }
    q("[data-a=re]").addEventListener("click", () => { reinicia(); rodando = true; q("[data-a=pa]").textContent = "Pausar"; });
    q("[data-a=pa]").addEventListener("click", (e) => { rodando = !rodando; e.currentTarget.textContent = rodando ? "Pausar" : "Continuar"; });
    ["k1", "k2", "m1", "m2", "f0", "w0"].forEach((c) => q(`[data-c=${c}]`).addEventListener("change", reinicia));
    liga(el, "m", (v) => { modo = v; reinicia(); });
    reinicia();
    requestAnimationFrame(laco); F.aoSair(() => (vivo = false));
  };
})();
