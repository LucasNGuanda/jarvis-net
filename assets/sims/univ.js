/* Simulações da Universitária (U01–U06).
   U01 campo vetorial com div e rot locais (roda de pás); U02 fluxo de cargas em 2D (Gauss: fluxo = 2πq_dentro); U03 conta num aro girando (lagrangiana, RK4);
   U04 ação S = ∫(T − V)dt numa família de caminhos (mínimo no caminho real); U05 FDTD 1D de Yee (E e B), reflexão (n − 1)/(n + 1); U06 poço infinito e superposição. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small style="text-transform:none">${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${k === ativo}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const seta = (x1, y1, x2, y2, cor, w = 1.4) => { const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1), c = Math.min(6, L * 0.45); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${cor};stroke-width:${w}"/><path d="M${x2 - c * Math.cos(a - 0.45)} ${y2 - c * Math.sin(a - 0.45)} L${x2} ${y2} L${x2 - c * Math.cos(a + 0.45)} ${y2 - c * Math.sin(a + 0.45)}" style="fill:none;stroke:${cor};stroke-width:${w}"/>`; };
  const n2 = (v, d = 2) => (Math.abs(v) < 5e-13 ? "0" : String(+(+v).toFixed(d)).replace(".", ",").replace("-", "−"));

  /* ---------- U01 · divergente e rotacional locais ---------- */
  /* nome: "Rodinha de pás num campo" · matéria: Física · tema: U01 */
  SIM.campoVetorial = (el, F) => {
    const CAMPOS = {
      fonte: { nome: "(x, y): fonte", f: (x, y) => [x, y] },
      giro: { nome: "(−y, x): redemoinho", f: (x, y) => [-y, x] },
      cis: { nome: "(y, 0): correnteza", f: (x, y) => [y, 0] },
      harm: { nome: "(x² − y², −2xy)", f: (x, y) => [x * x - y * y, -2 * x * y] },
      misto: { nome: "(x − y, x + y)", f: (x, y) => [x - y, x + y] },
    };
    const W = 440, H = 440, S = 2.2, X = (x) => W / 2 + (x * (W / 2 - 20)) / S, Y = (y) => H / 2 - (y * (H / 2 - 20)) / S;
    let k = "giro", ang = 0, ult = null, vivo = true;
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg><div class="leitor" data-v="lt" style="flex-direction:column;align-items:stretch"></div></div>
      <div class="ctrls"><div class="ctrl"><label>x do ponto</label><input type="range" min="-1.8" max="1.8" step="0.02" value="0.8" data-c="x"><output data-o="x"></output></div>
      <div class="ctrl"><label>y do ponto</label><input type="range" min="-1.8" max="1.8" step="0.02" value="0.4" data-c="y"><output data-o="y"></output></div>
      <div class="bts">${botoes(Object.entries(CAMPOS).map(([kk, c]) => [kk, c.nome]), "k", k)}</div></div>
      <div class="status">Uma rodinha de pás é colocada no ponto escolhido: ela gira com velocidade angular igual a metade do <b>rotacional</b> (sentido anti-horário = positivo). O círculo em volta fica <b>verde</b> se mais campo sai do que entra (divergente positivo, uma "fonte") e <b>vermelho</b> se mais entra (um "sumidouro"). As duas grandezas são derivadas parciais calculadas no ponto.</div>`);
    const q = (s) => el.querySelector(s);
    const derivs = (C, x, y) => { const h = 1e-4, [ax, ay] = C.f(x + h, y), [bx, by] = C.f(x - h, y), [cx, cy] = C.f(x, y + h), [dx, dy] = C.f(x, y - h); return { dPx: (ax - bx) / (2 * h), dQx: (ay - by) / (2 * h), dPy: (cx - dx) / (2 * h), dQy: (cy - dy) / (2 * h) }; };
    function desenha() {
      const C = CAMPOS[k], x0 = +q("[data-c=x]").value, y0 = +q("[data-c=y]").value; q("[data-o=x]").textContent = n2(x0); q("[data-o=y]").textContent = n2(y0);
      const d = derivs(C, x0, y0), div = d.dPx + d.dQy, rot = d.dQx - d.dPy;
      let s = `<line x1="0" x2="${W}" y1="${H / 2}" y2="${H / 2}" style="stroke:var(--line)"/><line y1="0" y2="${H}" x1="${W / 2}" x2="${W / 2}" style="stroke:var(--line)"/>`;
      for (let i = -2; i <= 2.001; i += 0.4) for (let j = -2; j <= 2.001; j += 0.4) { const [u, v] = C.f(i, j), m = Math.hypot(u, v); if (m < 1e-9) continue; const L = 0.14 * Math.min(1.6, Math.sqrt(m)) + 0.04; s += seta(X(i - (u / m) * L), Y(j - (v / m) * L), X(i + (u / m) * L), Y(j + (v / m) * L), "var(--ink3)", 1.2); }
      const cx = X(x0), cy = Y(y0);
      s += `<circle cx="${cx}" cy="${cy}" r="30" style="fill:color-mix(in srgb,${div > 1e-6 ? "var(--ok)" : div < -1e-6 ? "var(--bad)" : "var(--ink3)"} ${Math.min(45, 10 + 12 * Math.abs(div))}%,transparent);stroke:var(--ink2)"/>`;
      for (let p = 0; p < 4; p++) { const a = ang + (p * Math.PI) / 2; s += `<line x1="${cx}" y1="${cy}" x2="${cx + 22 * Math.cos(a)}" y2="${cy - 22 * Math.sin(a)}" style="stroke:var(--mod);stroke-width:3;stroke-linecap:round"/>`; }
      s += `<circle cx="${cx}" cy="${cy}" r="4" style="fill:var(--ink)"/>`;
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("F no ponto", `(${n2(C.f(x0, y0)[0])}; ${n2(C.f(x0, y0)[1])})`) + vis("div F = ∂P/∂x + ∂Q/∂y", n2(div)) + vis("rot F = ∂Q/∂x − ∂P/∂y", n2(rot)) + vis("velocidade da rodinha (rot/2)", n2(rot / 2) + " rad/s");
      return rot;
    }
    function laco(ts) { if (!vivo) return; if (ult !== null) { const C = CAMPOS[k], d = derivs(C, +q("[data-c=x]").value, +q("[data-c=y]").value); ang += ((d.dQx - d.dPy) / 2) * Math.min(0.05, (ts - ult) / 1000); desenha(); } ult = ts; requestAnimationFrame(laco); }
    el.querySelectorAll("input").forEach((i) => i.addEventListener("input", desenha));
    liga(el, "k", (v) => { k = v; desenha(); });
    desenha(); requestAnimationFrame(laco);
    F.aoSair(() => (vivo = false));
  };

  /* ---------- U02 · Gauss em 2D: fluxo por uma curva fechada ---------- */
  /* nome: "Fluxo por uma curva fechada" · matéria: Física · tema: U02 */
  SIM.fluxoCargas = (el, F) => {
    const CARGAS = [[-1.0, 0.5, 2], [0.9, 0.2, -1], [0.1, -1.0, 1]];
    const W = 460, H = 460, S = 2.3, X = (x) => W / 2 + (x * (W / 2 - 15)) / S, Y = (y) => H / 2 - (y * (H / 2 - 15)) / S;
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg><div class="leitor" data-v="lt" style="flex-direction:column;align-items:stretch"></div></div>
      <div class="ctrls"><div class="ctrl"><label>centro x</label><input type="range" min="-2" max="2" step="0.02" value="-0.6" data-c="cx"><output data-o="cx"></output></div>
      <div class="ctrl"><label>centro y</label><input type="range" min="-2" max="2" step="0.02" value="0.3" data-c="cy"><output data-o="cy"></output></div>
      <div class="ctrl"><label>raio</label><input type="range" min="0.2" max="2" step="0.02" value="0.8" data-c="r"><output data-o="r"></output></div></div>
      <div class="status">Três cargas fixas (+2, −1, +1) num mundo 2D, onde o campo de uma carga cai como 1/r (é o campo de um fio infinito visto de lado). O fluxo do campo pela curva é calculado numericamente, somando E·n em 2000 pedacinhos. Ele só depende de quanta carga está <b>dentro</b>: fluxo = 2π × carga interna (em 3D seria 4π). Cargas de fora contribuem com zero: o que entra, sai.</div>`);
    const q = (s) => el.querySelector(s);
    const E = (x, y) => { let ex = 0, ey = 0; CARGAS.forEach(([a, b, qq]) => { const dx = x - a, dy = y - b, r2 = dx * dx + dy * dy; ex += (qq * dx) / r2; ey += (qq * dy) / r2; }); return [ex, ey]; };
    function desenha() {
      const cx = +q("[data-c=cx]").value, cy = +q("[data-c=cy]").value, r = +q("[data-c=r]").value; ["cx", "cy", "r"].forEach((c) => (q(`[data-o=${c}]`).textContent = n2(+q(`[data-c=${c}]`).value)));
      let s = "";
      for (let i = -2.2; i <= 2.21; i += 0.25) for (let j = -2.2; j <= 2.21; j += 0.25) { const [u, v] = E(i, j), m = Math.hypot(u, v); if (!isFinite(m) || m < 1e-6 || m > 60) continue; const L = 0.1 * Math.min(1.4, Math.sqrt(m)) + 0.02; s += seta(X(i - (u / m) * L), Y(j - (v / m) * L), X(i + (u / m) * L), Y(j + (v / m) * L), "var(--ink3)", 1.1); }
      let fl = 0; const N = 2000;
      for (let n = 0; n < N; n++) { const t = (2 * Math.PI * (n + 0.5)) / N, x = cx + r * Math.cos(t), y = cy + r * Math.sin(t), [u, v] = E(x, y); fl += (u * Math.cos(t) + v * Math.sin(t)) * ((2 * Math.PI * r) / N); }
      s += `<circle cx="${X(cx)}" cy="${Y(cy)}" r="${X(cx + r) - X(cx)}" style="fill:color-mix(in srgb,var(--mod) 10%,transparent);stroke:var(--mod);stroke-width:2.5"/>`;
      let qin = 0;
      CARGAS.forEach(([a, b, qq]) => { const dentro = Math.hypot(a - cx, b - cy) < r; if (dentro) qin += qq; s += `<circle cx="${X(a)}" cy="${Y(b)}" r="13" style="fill:${qq > 0 ? "#e8706a" : "#7ab8e6"};stroke:${dentro ? "var(--ink)" : "none"};stroke-width:2.5"/><text class="tx" x="${X(a)}" y="${Y(b) + 5}" text-anchor="middle" style="fill:#111;font-weight:700">${qq > 0 ? "+" + qq : "−" + -qq}</text>`; });
      q("[data-v=sv]").innerHTML = s;
      const perto = CARGAS.some(([a, b]) => Math.abs(Math.hypot(a - cx, b - cy) - r) < 0.04);
      q("[data-v=lt]").innerHTML = vis("fluxo calculado ∮E·n ds", n2(fl, 3)) + vis("fluxo / 2π", n2(fl / (2 * Math.PI), 3)) + vis("carga dentro da curva", qin) + (perto ? `<p class="det" style="color:var(--warn);margin:4px 0 0">Uma carga está em cima da curva: o campo explode ali e a soma numérica fica imprecisa.</p>` : "");
    }
    el.querySelectorAll("input").forEach((i) => i.addEventListener("input", desenha)); desenha();
  };

  /* ---------- U03 · conta num aro que gira (lagrangiana) ---------- */
  /* nome: "Conta no aro girando" · matéria: Física · tema: U03 */
  SIM.aro = (el, F) => {
    const g = 9.81, R = 0.1;
    let th = 0.3, om = 0, vivo = true, ult = null;
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:start"><svg viewBox="0 0 320 320" width="320" data-v="s1"></svg><div><b>Potencial efetivo U_ef(θ)</b><svg viewBox="0 0 360 260" width="360" data-v="s2"></svg></div></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>velocidade angular do aro ω (rad/s)</label><input type="range" min="0" max="25" step="0.1" value="6" data-c="w"><output data-o="w"></output></div>
      <div class="bts"><button class="bt peq" data-a="emp">Dar um empurrãozinho</button><button class="bt peq" data-p="6">ω &lt; ω_c</button><button class="bt peq" data-p="15">ω &gt; ω_c</button></div></div>
      <div class="status">Uma conta desliza sem atrito (com um amortecimento leve) num aro vertical de raio 10 cm que gira em torno do eixo vertical. Abaixo de ω_c = √(g/R) ≈ 9,9 rad/s, o fundo é estável. Acima, o fundo vira instável e a conta sobe até θ* = arccos(g/(ω²R)): o vale do potencial efetivo se divide em dois (uma "bifurcação").</div>`);
    const q = (s) => el.querySelector(s);
    const acel = (t, o, w) => Math.sin(t) * (w * w * Math.cos(t) - g / R) - 0.6 * o;
    const Uef = (t, w) => -g * R * Math.cos(t) - 0.5 * w * w * R * R * Math.sin(t) ** 2;
    function passo(dt) {
      const w = +q("[data-c=w]").value, n = 20, h = dt / n;
      for (let i = 0; i < n; i++) { const k1 = [om, acel(th, om, w)], k2 = [om + (h / 2) * k1[1], acel(th + (h / 2) * k1[0], om + (h / 2) * k1[1], w)], k3 = [om + (h / 2) * k2[1], acel(th + (h / 2) * k2[0], om + (h / 2) * k2[1], w)], k4 = [om + h * k3[1], acel(th + h * k3[0], om + h * k3[1], w)];
        th += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); om += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); }
    }
    function desenha() {
      const w = +q("[data-c=w]").value; q("[data-o=w]").textContent = n2(w, 1);
      const cx = 160, cy = 160, Rp = 120, fase = (performance.now() / 1000) * w;
      let s = `<line x1="${cx}" y1="10" x2="${cx}" y2="310" style="stroke:var(--ink3);stroke-dasharray:5 5"/>`;
      s += `<ellipse cx="${cx}" cy="${cy}" rx="${Math.abs(Rp * Math.cos(fase)) + 1}" ry="${Rp}" style="fill:none;stroke:#7ab8e6;stroke-width:3"/>`;
      const bx = cx + Rp * Math.sin(th) * Math.cos(fase), by = cy + Rp * Math.cos(th);
      s += `<circle cx="${bx}" cy="${by}" r="9" style="fill:#f2c94c;stroke:var(--card);stroke-width:2"/><text class="tx2" x="${cx}" y="18" text-anchor="middle">eixo de rotação</text>`;
      q("[data-v=s1]").innerHTML = s;
      const o = { l: 40, r: 22, t: 26, b: 30, W: 360, H: 260 }, X = (t) => o.l + ((t + Math.PI) / (2 * Math.PI)) * (o.W - o.l - o.r);
      const us = []; for (let i = 0; i <= 200; i++) { const t = -Math.PI + (2 * Math.PI * i) / 200; us.push([t, Uef(t, w)]); }
      const lo = Math.min(...us.map((u) => u[1])), hi = Math.max(...us.map((u) => u[1])), Y = (u) => o.H - o.b - ((u - lo) / (hi - lo || 1)) * (o.H - o.t - o.b);
      let h = `<rect x="${o.l}" y="${o.t}" width="${o.W - o.l - o.r}" height="${o.H - o.t - o.b}" style="fill:none;stroke:var(--line)"/>`;
      [-180, -90, 0, 90, 180].forEach((dg) => (h += `<text class="tx2" x="${X((dg * Math.PI) / 180)}" y="${o.H - 10}" text-anchor="middle">${dg}°</text>`));
      h += `<path d="${us.map(([t, u], i) => (i ? "L" : "M") + X(t).toFixed(1) + " " + Y(u).toFixed(1)).join("")}" style="fill:none;stroke:var(--mod);stroke-width:2.4"/>`;
      const tn = Math.atan2(Math.sin(th), Math.cos(th));
      h += `<circle cx="${X(tn)}" cy="${Y(Uef(tn, w))}" r="6" style="fill:#f2c94c;stroke:var(--card);stroke-width:2"/><text class="tx2" x="${(o.l + o.W - o.r) / 2}" y="16" text-anchor="middle">θ medido a partir do fundo</text>`;
      q("[data-v=s2]").innerHTML = h;
      const wc = Math.sqrt(g / R), eq = w > wc ? (Math.acos(g / (w * w * R)) * 180) / Math.PI : 0;
      q("[data-v=lt]").innerHTML = vis("ω_c = √(g/R)", n2(wc, 2) + " rad/s") + vis("equilíbrio estável", w > wc ? "θ* = ±" + n2(eq, 1) + "°" : "θ = 0 (fundo)") + vis("ângulo atual", n2((tn * 180) / Math.PI, 1) + "°");
    }
    function laco(ts) { if (!vivo) return; if (ult !== null) passo(Math.min(0.03, (ts - ult) / 1000)); ult = ts; desenha(); requestAnimationFrame(laco); }
    q("[data-a=emp]").addEventListener("click", () => (om += 3));
    el.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { q("[data-c=w]").value = b.dataset.p; th += 0.05; }));
    requestAnimationFrame(laco);
    F.aoSair(() => (vivo = false));
  };

  /* ---------- U04 · princípio da mínima ação ---------- */
  /* nome: "Caminhos e ação" · matéria: Física · tema: U04 */
  SIM.acao = (el, F) => {
    const g = 9.81, T = 2, m = 1, xr = (t) => (g / 2) * t * (T - t);
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:start"><div><b>Caminhos x(t)</b><svg viewBox="0 0 360 280" width="360" data-v="s1"></svg></div><div><b>Ação S(ε)</b><svg viewBox="0 0 330 280" width="330" data-v="s2"></svg></div></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>deformação ε (m)</label><input type="range" min="-3" max="3" step="0.02" value="1.2" data-c="e"><output data-o="e"></output></div>
      <div class="bts">${botoes([["1", "deformação sen(πt/T)"], ["2", "deformação sen(2πt/T)"]], "m", "1")}</div></div>
      <div class="status">Uma bola é lançada para cima e volta ao chão em T = 2 s. Curva grossa: o movimento real (parábola). Curva colorida: um caminho "inventado", com as mesmas pontas, x(t) = real + ε·deformação. Para cada caminho, calculamos a ação S = ∫(T − V)dt. A natureza escolhe o caminho em que S é <b>estacionária</b> (aqui, mínima): o mínimo da curva da direita cai exatamente em ε = 0.</div>`);
    const q = (s) => el.querySelector(s);
    let modo = 1;
    const eta = (t) => Math.sin((modo * Math.PI * t) / T), deta = (t) => ((modo * Math.PI) / T) * Math.cos((modo * Math.PI * t) / T);
    const S = (ep) => { const n = 400, h = T / n; let s = 0; for (let i = 0; i <= n; i++) { const t = i * h, v = g * (T / 2 - t) + ep * deta(t), x = xr(t) + ep * eta(t), Lg = 0.5 * m * v * v - m * g * x; s += (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * Lg; } return (s * h) / 3; };
    function desenha() {
      const ep = +q("[data-c=e]").value; q("[data-o=e]").textContent = n2(ep, 2);
      const o = { l: 36, r: 10, t: 10, b: 28, W: 360, H: 280 }, X = (t) => o.l + (t / T) * (o.W - o.l - o.r), Y = (x) => o.H - o.b - ((x + 3.5) / 11) * (o.H - o.t - o.b);
      let s = `<rect x="${o.l}" y="${o.t}" width="${o.W - o.l - o.r}" height="${o.H - o.t - o.b}" style="fill:none;stroke:var(--line)"/><line x1="${o.l}" x2="${o.W - o.r}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--ink3)"/>`;
      [0, 0.5, 1, 1.5, 2].forEach((t) => (s += `<text class="tx2" x="${X(t)}" y="${o.H - 10}" text-anchor="middle">${String(t).replace(".", ",")} s</text>`));
      const cam = (f, est) => { let d = ""; for (let i = 0; i <= 100; i++) { const t = (T * i) / 100; d += (i ? "L" : "M") + X(t).toFixed(1) + " " + Y(f(t)).toFixed(1); } return `<path d="${d}" style="fill:none;${est}"/>`; };
      s += cam(xr, "stroke:var(--ink);stroke-width:3") + cam((t) => xr(t) + ep * eta(t), "stroke:var(--mod);stroke-width:2.2;stroke-dasharray:6 4");
      q("[data-v=s1]").innerHTML = s;
      const o2 = { l: 44, r: 10, t: 10, b: 28, W: 330, H: 280 }, eps = []; for (let i = 0; i <= 120; i++) { const e = -3 + (6 * i) / 120; eps.push([e, S(e)]); }
      const lo = Math.min(...eps.map((p) => p[1])), hi = Math.max(...eps.map((p) => p[1])), X2 = (e) => o2.l + ((e + 3) / 6) * (o2.W - o2.l - o2.r), Y2 = (v) => o2.H - o2.b - ((v - lo) / (hi - lo || 1)) * (o2.H - o2.t - o2.b);
      let h = `<rect x="${o2.l}" y="${o2.t}" width="${o2.W - o2.l - o2.r}" height="${o2.H - o2.t - o2.b}" style="fill:none;stroke:var(--line)"/>`;
      [-3, -2, -1, 0, 1, 2, 3].forEach((e) => (h += `<text class="tx2" x="${X2(e)}" y="${o2.H - 10}" text-anchor="middle">${e}</text>`));
      h += `<path d="${eps.map(([e, v], i) => (i ? "L" : "M") + X2(e).toFixed(1) + " " + Y2(v).toFixed(1)).join("")}" style="fill:none;stroke:var(--mod);stroke-width:2.4"/><line x1="${X2(0)}" x2="${X2(0)}" y1="${o2.t}" y2="${o2.H - o2.b}" style="stroke:var(--ink3);stroke-dasharray:3 3"/>`;
      h += `<circle cx="${X2(ep)}" cy="${Y2(S(ep))}" r="6" style="fill:var(--warn);stroke:var(--card);stroke-width:2"/>`;
      q("[data-v=s2]").innerHTML = h;
      q("[data-v=lt]").innerHTML = vis("S do caminho real", n2(S(0), 3) + " J·s") + vis("S do caminho inventado", n2(S(ep), 3) + " J·s") + vis("diferença", "+" + n2(S(ep) - S(0), 3) + " J·s");
    }
    q("[data-c=e]").addEventListener("input", desenha);
    liga(el, "m", (v) => { modo = +v; desenha(); });
    desenha();
  };

  /* ---------- U05 · onda eletromagnética 1D (FDTD de Yee) ---------- */
  /* nome: "Maxwell numa grade (FDTD)" · matéria: Física · tema: U05 */
  SIM.fdtd = (el, F) => {
    const N = 500, W = 700, H = 300;
    let Ez, Hy, t, vivo = true, n = 1.5, fim = "aberto", rodando = true;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>índice de refração da região da direita n</label><input type="range" min="1" max="4" step="0.05" value="1.5" data-c="n"><output data-o="n"></output></div>
      <div class="bts"><button class="bt pri" data-a="pulso">Novo pulso</button><button class="bt peq" data-a="pausa">Pausar</button>${botoes([["aberto", "fim aberto"], ["metal", "parede de metal"]], "f", fim)}</div></div>
      <div class="status">As equações de Maxwell resolvidas passo a passo numa grade (método de Yee, 1966): E (amarelo) atualiza B (azul, desenhado como cB), B atualiza E, e a onda anda sozinha. Na região sombreada, a luz é mais lenta (v = c/n): o pulso encolhe, e parte reflete com amplitude (n − 1)/(n + 1), invertida. No metal (E = 0 na parede), reflete tudo, invertido.</div>`);
    const q = (s) => el.querySelector(s);
    const zera = () => { Ez = new Float64Array(N); Hy = new Float64Array(N); t = 0; };
    /* unidades normalizadas, número de Courant S = 0,5; bordas abertas com a condição de Mur de 1ª ordem */
    let antE = [0, 0, 0, 0];
    function passo() {
      const meio = N / 2, eps = (i) => (i >= meio ? n * n : 1);
      const e0 = Ez[0], e1 = Ez[1], eN = Ez[N - 1], eN1 = Ez[N - 2];
      for (let i = 0; i < N - 1; i++) Hy[i] += 0.5 * (Ez[i + 1] - Ez[i]);
      for (let i = 1; i < N - 1; i++) Ez[i] += (0.5 / eps(i)) * (Hy[i] - Hy[i - 1]);
      if (t < 120) Ez[40] += Math.exp(-(((t - 40) / 12) ** 2));
      const cE = 0.5, kE = (cE - 1) / (cE + 1);
      Ez[0] = e1 + kE * (Ez[1] - e0);
      if (fim === "metal") Ez[N - 1] = 0;
      else { const cD = 0.5 / n, kD = (cD - 1) / (cD + 1); Ez[N - 1] = eN1 + kD * (Ez[N - 2] - eN); }
      t++;
    }
    function desenha() {
      const X = (i) => 20 + (i / (N - 1)) * (W - 40), Y = (v) => H / 2 - v * 100;
      let s = `<rect x="${X(N / 2)}" y="10" width="${X(N - 1) - X(N / 2)}" height="${H - 20}" style="fill:color-mix(in srgb,#7ab8e6 ${Math.round(8 + 10 * (n - 1))}%,transparent)"/><line x1="20" x2="${W - 20}" y1="${H / 2}" y2="${H / 2}" style="stroke:var(--ink3)"/>`;
      if (fim === "metal") s += `<rect x="${W - 22}" y="10" width="8" height="${H - 20}" style="fill:#9aa3ad"/>`;
      let dE = "", dH = ""; for (let i = 0; i < N; i++) { dE += (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(Ez[i]).toFixed(1); dH += (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(Hy[i]).toFixed(1); }
      s += `<path d="${dH}" style="fill:none;stroke:#7ab8e6;stroke-width:1.6;opacity:.8"/><path d="${dE}" style="fill:none;stroke:#f2c94c;stroke-width:2.2"/>`;
      s += `<text class="tx2" x="30" y="24">vácuo (n = 1)</text><text class="tx2" x="${X(N / 2) + 10}" y="24">meio com n = ${n2(n, 2)}</text>`;
      q("[data-v=sv]").innerHTML = s;
      q("[data-o=n]").textContent = n2(n, 2);
      q("[data-v=lt]").innerHTML = vis("velocidade no meio", "c/" + n2(n, 2)) + vis("amplitude refletida (n−1)/(n+1)", "−" + n2((n - 1) / (n + 1), 3)) + vis("energia refletida", n2(100 * ((n - 1) / (n + 1)) ** 2, 1) + "%");
    }
    function laco() { if (!vivo) return; if (rodando) for (let k = 0; k < 3; k++) passo(); desenha(); requestAnimationFrame(laco); }
    q("[data-c=n]").addEventListener("input", () => { n = +q("[data-c=n]").value; zera(); });
    q("[data-a=pulso]").addEventListener("click", zera);
    q("[data-a=pausa]").addEventListener("click", (ev) => { rodando = !rodando; ev.target.textContent = rodando ? "Pausar" : "Continuar"; });
    liga(el, "f", (v) => { fim = v; zera(); });
    zera(); requestAnimationFrame(laco);
    F.aoSair(() => (vivo = false));
  };

  /* ---------- U06 · poço infinito: estados e superposição ---------- */
  /* nome: "Poço infinito e superposição" · matéria: Física · tema: U06 */
  SIM.poco = (el, F) => {
    const W = 700, H = 330;
    let n1 = 1, n2s = 2, modo = "um", vivo = true, t0 = performance.now();
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="bts">${botoes([["um", "um estado"], ["sup", "superposição de dois"]], "m", modo)}</div>
      <div class="bts"><b style="margin-right:6px">estado n:</b>${botoes([1, 2, 3, 4, 5].map((k) => [String(k), "n = " + k]), "a", "1")}</div>
      <div class="bts" data-v="seg"><b style="margin-right:6px">2º estado:</b>${botoes([1, 2, 3, 4, 5].map((k) => [String(k), "n = " + k]), "b", "2")}</div></div>
      <div class="status">Elétron preso entre duas paredes intransponíveis (largura 1 nm). Esquerda: os níveis de energia, Eₙ = n²·0,376 eV. Direita: a função de onda ψ (curva fina) e a densidade de probabilidade |ψ|² (área colorida). Um estado só é <b>estacionário</b>: |ψ|² não muda com o tempo. Uma superposição de dois estados "balança" de um lado para o outro com frequência (E₂ − E₁)/h: é o que um átomo faz quando emite luz.</div>`);
    const q = (s) => el.querySelector(s);
    const E1 = 0.376;
    function desenha() {
      const tt = (performance.now() - t0) / 1000, sup = modo === "sup" && n1 !== n2s;
      q("[data-v=seg]").style.display = modo === "sup" ? "" : "none";
      let s = `<line x1="40" x2="40" y1="20" y2="${H - 20}" style="stroke:var(--ink);stroke-width:3"/><line x1="200" x2="200" y1="20" y2="${H - 20}" style="stroke:var(--ink);stroke-width:3"/>`;
      const Ye = (e) => H - 30 - (e / (25 * E1)) * (H - 60);
      for (let k = 1; k <= 5; k++) { const sel = k === n1 || (sup && k === n2s); s += `<line x1="44" x2="196" y1="${Ye(k * k * E1)}" y2="${Ye(k * k * E1)}" style="stroke:${sel ? "var(--mod)" : "var(--ink3)"};stroke-width:${sel ? 2.5 : 1.2}"/><text class="tx2" x="206" y="${Ye(k * k * E1) + 4}">n=${k}: ${(k * k * E1).toFixed(2).replace(".", ",")} eV</text>`; }
      const x0 = 330, x1 = 680, cy = H / 2 + 40, A = 85, X = (u) => x0 + u * (x1 - x0);
      s += `<line x1="${x0}" x2="${x0}" y1="30" y2="${H - 20}" style="stroke:var(--ink);stroke-width:3"/><line x1="${x1}" x2="${x1}" y1="30" y2="${H - 20}" style="stroke:var(--ink);stroke-width:3"/><line x1="${x0}" x2="${x1}" y1="${cy}" y2="${cy}" style="stroke:var(--ink3)"/>`;
      const fase = (k) => (2 * Math.PI * k * k * 0.25 * tt); /* tempo da animação em escala lenta */
      let dpsi = "", dprob = `M${x0} ${cy}`, xm = 0, norm = 0;
      for (let i = 0; i <= 200; i++) {
        const u = i / 200, p1 = Math.SQRT2 * Math.sin(n1 * Math.PI * u);
        let re, im, prob;
        if (!sup) { re = p1; im = 0; prob = p1 * p1; }
        else { const p2 = Math.SQRT2 * Math.sin(n2s * Math.PI * u), c = Math.SQRT1_2; re = c * (p1 * Math.cos(fase(n1)) + p2 * Math.cos(fase(n2s))); im = -c * (p1 * Math.sin(fase(n1)) + p2 * Math.sin(fase(n2s))); prob = re * re + im * im; }
        xm += u * prob; norm += prob;
        dpsi += (i ? "L" : "M") + X(u).toFixed(1) + " " + (cy - (A / 1.6) * re).toFixed(1);
        dprob += "L" + X(u).toFixed(1) + " " + (cy - (A / 2.2) * prob).toFixed(1);
      }
      dprob += `L${x1} ${cy}Z`;
      s += `<path d="${dprob}" style="fill:color-mix(in srgb,var(--mod) 35%,transparent);stroke:var(--mod);stroke-width:1.5"/><path d="${dpsi}" style="fill:none;stroke:var(--ink);stroke-width:1.4;opacity:.7"/>`;
      const xmed = xm / norm; s += `<line x1="${X(xmed)}" x2="${X(xmed)}" y1="${cy + 6}" y2="${cy + 22}" style="stroke:var(--warn);stroke-width:3"/><text class="tx2" x="${X(xmed)}" y="${cy + 36}" text-anchor="middle">posição média</text>`;
      q("[data-v=sv]").innerHTML = s;
      const dE = Math.abs(n2s * n2s - n1 * n1) * E1;
      q("[data-v=lt]").innerHTML = vis("E do estado " + n1, n2(n1 * n1 * E1, 3) + " eV") + (sup ? vis("E₂ − E₁", n2(dE, 3) + " eV") + vis("luz emitida na transição", n2(1240 / dE, 0) + " nm") : vis("nós de ψ dentro do poço", n1 - 1)) + vis("posição média", n2(xmed, 3) + " nm");
    }
    function laco() { if (!vivo) return; desenha(); requestAnimationFrame(laco); }
    liga(el, "m", (v) => { modo = v; });
    liga(el, "a", (v) => { n1 = +v; });
    liga(el, "b", (v) => { n2s = +v; });
    requestAnimationFrame(laco);
    F.aoSair(() => (vivo = false));
  };
})();
