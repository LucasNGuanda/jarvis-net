/* Laboratórios menores de eletrostática: eletroscópio, dipolo em campo uniforme,
   lei de Gauss (fluxo numérico) e placa condutora (cargas relaxando). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const K = 8.99e9, EPS0 = 8.854e-12;
  const cssv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  /* ---------- 1. Eletroscópio (modelo qualitativo de indução) ----------
     Bastão com carga −Qb. Fração induzida p = 1/(1+(d/d0)^2).
     Isolado: esfera +pQb + Qe/2, folhas −pQb + Qe/2.  Aterrado: as folhas ficam neutras e a esfera fica com +pQb (Qe = +pQb).
     Folhas abrem com ângulo ~ sqrt(|carga nas folhas|). */
  /* nome: "Eletroscópio e indução" · matéria: Física · tema: C01 */
  SIM.eletroscopio = (el, F) => {
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 640 330" width="640" aria-label="eletroscópio"><g class="g"></g></svg></div>
      <div class="ctrls"><div class="ctrl"><label>Distância do bastão</label><input type="range" min="0" max="100" step="1" value="100" data-c="d"><output></output></div>
      <div class="bts"><button class="bt peq" data-a="terra" aria-pressed="false">⏚ Ligar à terra</button><button class="bt peq" data-a="encostar">Encostar e afastar</button><button class="bt peq" data-a="zerar">Descarregar tudo</button></div></div>
      <div class="status" data-v="st"></div>`);
    const st = { d: 100, terra: false, Qe: 0 }, Qb = 6;
    const q = (s) => el.querySelector(s);
    function estado() {
      const p = 1 / (1 + Math.pow(st.d / 22, 2)) * (st.d >= 100 ? 0 : 1);
      let esfera, folhas;
      if (st.terra) { st.Qe = p * Qb; esfera = p * Qb; folhas = 0; }
      else { esfera = p * Qb + st.Qe / 2; folhas = -p * Qb + st.Qe / 2; }
      return { p, esfera, folhas };
    }
    function sinais(n, cx, cy, raio, txt) { let s = ""; const k = Math.round(Math.abs(n)); for (let i = 0; i < k; i++) { const a = (i / Math.max(1, k)) * Math.PI * 2 + 0.3; s += `<text x="${cx + raio * Math.cos(a)}" y="${cy + raio * Math.sin(a) + 5}" text-anchor="middle" style="font:700 15px Inter;fill:${n > 0 ? "#ef5b5b" : "#4f8dff"}">${txt || (n > 0 ? "+" : "−")}</text>`; } return s; }
    function desenha() {
      const e = estado(), ang = Math.min(55, 22 * Math.sqrt(Math.abs(e.folhas)));
      const bx = 395 - 2.6 * st.d;
      let g = "";
      // eletroscópio
      g += `<rect x="330" y="150" width="200" height="150" rx="14" class="ln2" style="fill:color-mix(in srgb,var(--card) 70%,transparent)"/>`;
      g += `<circle cx="430" cy="90" r="30" class="ln" style="fill:var(--card2)"/><line x1="430" y1="120" x2="430" y2="215" class="ln"/>`;
      g += `<g transform="translate(430 215)"><line x1="0" y1="0" x2="${(-62 * Math.sin((ang * Math.PI) / 180)).toFixed(1)}" y2="${(62 * Math.cos((ang * Math.PI) / 180)).toFixed(1)}" style="stroke:var(--warn);stroke-width:5;stroke-linecap:round"/><line x1="0" y1="0" x2="${(62 * Math.sin((ang * Math.PI) / 180)).toFixed(1)}" y2="${(62 * Math.cos((ang * Math.PI) / 180)).toFixed(1)}" style="stroke:var(--warn);stroke-width:5;stroke-linecap:round"/></g>`;
      g += sinais(e.esfera, 430, 90, 18) + sinais(e.folhas / 2, 410, 262, 10) + sinais(e.folhas / 2, 450, 262, 10);
      if (st.terra) g += `<path d="M430 300 v18 M414 318 h32 M419 324 h22 M424 330 h12" class="ln"/><line x1="430" y1="215" x2="430" y2="300" class="ln" style="stroke-dasharray:4 4"/>`;
      // bastão (PVC atritado: negativo)
      if (st.d < 100) { g += `<rect x="${bx - 150}" y="78" width="150" height="24" rx="10" style="fill:#c9a86a;stroke:var(--ink);stroke-width:1.5"/>`; for (let i = 0; i < 6; i++) g += `<text x="${bx - 135 + 24 * i}" y="96" style="font:700 15px Inter;fill:#1a3a8a">−</text>`; }
      else g += `<text x="40" y="96" class="tx2">bastão de PVC atritado com lã (negativo), longe</text>`;
      q(".g").innerHTML = g;
      q("output").textContent = st.d >= 100 ? "longe" : F.t((st.d / 100) * 30, 0) + " cm";
      let s;
      if (st.terra && e.p > 0) s = "<b>Aterrado com o bastão perto:</b> os elétrons repelidos fogem pela terra. As folhas ficam neutras e fecham; a esfera fica positiva (presa pela atração do bastão).";
      else if (st.terra) s = "<b>Aterrado:</b> qualquer excesso de carga escoa para a terra.";
      else if (e.p > 0 && Math.abs(st.Qe) < 0.01) s = "<b>Indução:</b> o bastão negativo empurra elétrons para as folhas. A esfera fica +, as folhas ficam − e se repelem. A carga total do eletroscópio continua <b>zero</b>.";
      else if (Math.abs(st.Qe) > 0.01) s = `<b>Eletroscópio carregado</b> com carga ${st.Qe > 0 ? "positiva" : "negativa"}. ${e.p > 0 ? "O bastão perto muda a distribuição." : "Sem o bastão, a carga se espalha e as folhas ficam abertas."}`;
      else s = "Eletroscópio neutro: folhas fechadas. Aproxime o bastão.";
      q('[data-v="st"]').innerHTML = s + ' <span style="color:var(--ink3)">(modelo qualitativo)</span>';
      q('[data-a="terra"]').setAttribute("aria-pressed", st.terra);
    }
    q('[data-c="d"]').addEventListener("input", (ev) => { st.d = +ev.target.value; desenha(); });
    q('[data-a="terra"]').addEventListener("click", () => { st.terra = !st.terra; desenha(); });
    q('[data-a="encostar"]').addEventListener("click", () => { st.Qe += -2; st.d = 100; q('[data-c="d"]').value = 100; desenha(); });
    q('[data-a="zerar"]').addEventListener("click", () => { st.Qe = 0; st.terra = false; st.d = 100; q('[data-c="d"]').value = 100; desenha(); });
    desenha();
  };

  /* ---------- 2. Dipolo em campo uniforme ----------
     I θ'' = −p E sen θ − b θ'.  τ = p × E,  U = −p·E = −pE cos θ. */
  /* nome: "Dipolo girando num campo uniforme" · matéria: Física · tema: C03 */
  SIM.dipolo = (el, F) => {
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 360 260" width="360" class="d1"></svg><svg viewBox="0 0 360 260" width="360" class="d2"></svg></div>
      <div class="leitor" data-v="l"></div>
      <div class="ctrls"><div class="ctrl"><label>Campo E</label><input type="range" min="0" max="3" step="0.1" value="1.5" data-c="E"><output data-o="E"></output></div>
      <div class="ctrl"><label>Ângulo inicial</label><input type="range" min="0" max="179" step="1" value="70" data-c="th"><output data-o="th"></output></div>
      <div class="bts"><button class="bt peq pri" data-a="soltar">▶ Soltar</button><button class="bt peq" data-a="amort" aria-pressed="false">Amortecimento</button></div></div>
      <div class="status">O dipolo tem p = 2,0 × 10⁻⁹ C·m e momento de inércia I = 2,0 × 10⁻¹² kg·m². E em 10⁴ N/C.</div>`);
    const P = 2e-9, I = 2e-12; let E = 1.5e4, th = (70 * Math.PI) / 180, w = 0, rodando = false, amort = false, vivo = true;
    const q = (s) => el.querySelector(s);
    function desenha() {
      const L = 70, cx = 180, cy = 130, c = Math.cos(th), s = Math.sin(th);
      let g = ""; for (let y = 30; y <= 230; y += 40) g += `<line x1="20" y1="${y}" x2="330" y2="${y}" style="stroke:var(--ink3);stroke-width:1.2;opacity:${E ? 0.7 : 0.15}"/><polygon points="340,${y} 328,${y - 5} 328,${y + 5}" style="fill:var(--ink3);opacity:${E ? 0.7 : 0.15}"/>`;
      g += `<text x="300" y="20" class="tx2">E →</text>`;
      g += `<line x1="${cx - L * c}" y1="${cy + L * s}" x2="${cx + L * c}" y2="${cy - L * s}" style="stroke:var(--ink);stroke-width:4"/>`;
      g += `<circle cx="${cx + L * c}" cy="${cy - L * s}" r="15" fill="#ef5b5b"/><text x="${cx + L * c}" y="${cy - L * s + 5}" text-anchor="middle" style="font:700 14px Inter;fill:#fff">+</text>`;
      g += `<circle cx="${cx - L * c}" cy="${cy + L * s}" r="15" fill="#4f8dff"/><text x="${cx - L * c}" y="${cy + L * s + 5}" text-anchor="middle" style="font:700 14px Inter;fill:#fff">−</text>`;
      if (E) { const f = 26 * E / 1.5e4; g += D.seta(cx + L * c, cy - L * s, cx + L * c + f, cy - L * s, "var(--warn)", 2.6) + D.seta(cx - L * c, cy + L * s, cx - L * c - f, cy + L * s, "var(--warn)", 2.6); }
      q(".d1").innerHTML = g;
      // gráfico de U(θ)
      const x0 = 40, y0 = 130, sx = (a) => x0 + ((a + Math.PI) / (2 * Math.PI)) * 290, sy = (u) => y0 - u * 80;
      let d = ""; for (let k = 0; k <= 120; k++) { const a = -Math.PI + (2 * Math.PI * k) / 120; d += (k ? "L" : "M") + sx(a).toFixed(1) + " " + sy(-Math.cos(a)).toFixed(1); }
      const a = Math.atan2(Math.sin(th), Math.cos(th));
      q(".d2").innerHTML = `<line x1="${x0}" y1="${y0}" x2="${x0 + 295}" y2="${y0}" class="ln2"/><line x1="${sx(0)}" y1="30" x2="${sx(0)}" y2="230" class="ln2" style="stroke-dasharray:3 4"/>
        <path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.5"/><circle cx="${sx(a)}" cy="${sy(-Math.cos(a))}" r="7" style="fill:var(--warn);stroke:var(--card);stroke-width:2"/>
        <text x="${x0}" y="24" class="tx2">U/pE = −cos θ</text><text x="${x0 - 4}" y="${y0 + 18}" class="tx2">−180°</text><text x="${sx(0)}" y="${y0 + 18}" class="tx2" text-anchor="middle">0</text><text x="${x0 + 290}" y="${y0 + 18}" class="tx2" text-anchor="end">180°</text>`;
      const tau = P * E * Math.sin(th), U = -P * E * Math.cos(th);
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>θ</small><b>${F.t((a * 180) / Math.PI, 0)}°</b></div><div class="vis"><small>torque τ = pE sen θ</small><b>${F.t(tau * 1e6, 2)} µN·m</b></div><div class="vis"><small>U = −pE cos θ</small><b>${F.t(U * 1e6, 2)} µJ</b></div><div class="vis"><small>período pequenas osc.</small><b>${E ? F.t(2 * Math.PI * Math.sqrt(I / (P * E)) * 1000, 1) + " ms" : "—"}</b></div>`;
      q('[data-o="E"]').textContent = F.t(E / 1e4, 1) + "×10⁴ N/C"; q('[data-o="th"]').textContent = q('[data-c="th"]').value + "°";
    }
    let t0 = performance.now();
    function loop(t) {
      if (!vivo) return;
      const dt = Math.min(0.03, (t - t0) / 1000) * 0.02; t0 = t; // câmera lenta 50×
      if (rodando) { for (let k = 0; k < 10; k++) { const h = dt / 10, al = (-P * E * Math.sin(th) - (amort ? 2e-11 : 0) * w) / I; w += al * h; th += w * h; } desenha(); }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
    q('[data-c="E"]').addEventListener("input", (ev) => { E = +ev.target.value * 1e4; desenha(); });
    q('[data-c="th"]').addEventListener("input", (ev) => { rodando = false; w = 0; th = (+ev.target.value * Math.PI) / 180; desenha(); });
    q('[data-a="soltar"]').addEventListener("click", () => { rodando = true; w = 0; th = (+q('[data-c="th"]').value * Math.PI) / 180; });
    q('[data-a="amort"]').addEventListener("click", (ev) => { amort = !amort; ev.target.setAttribute("aria-pressed", amort); });
    desenha();
  };

  /* ---------- 3. Lei de Gauss: fluxo numérico por uma esfera ----------
     Cargas pontuais (nC) no plano z = 0; esfera gaussiana de centro arrastável.
     Φ calculado somando E·n̂ dA em 4000 pontos (espiral de Fibonacci) e comparado com q_int/ε0. */
  /* nome: "Lei de Gauss: fluxo numérico" · matéria: Física · tema: C03b */
  SIM.gauss = (el, F) => {
    const W = 760, H = 380, PX = 10;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" style="background:var(--bg);border-radius:8px;cursor:grab" aria-label="superfície gaussiana"><g class="g"></g></svg></div>
      <div class="leitor" data-v="l"></div>
      <div class="ctrls"><div class="ctrl"><label>Raio da esfera</label><input type="range" min="2" max="18" step="0.5" value="8"><output></output></div>
      <div class="bts"><button class="bt peq" data-p="0">1 carga</button><button class="bt peq" data-p="1">+ e − (dipolo)</button><button class="bt peq" data-p="2">3 cargas</button></div></div>
      <div class="status">Arraste as cargas e o centro da esfera (o "+" cinza). Na borda: <b style="color:#ef5b5b">vermelho</b> = campo saindo, <b style="color:#4f8dff">azul</b> = entrando. A esfera é 3D; você vê o corte dela.</div>`);
    const PRE = [[{ x: 38, y: 19, q: 2 }], [{ x: 33, y: 19, q: 2 }, { x: 45, y: 19, q: -2 }], [{ x: 34, y: 17, q: 3 }, { x: 44, y: 22, q: -1 }, { x: 60, y: 12, q: 2 }]];
    let cargas = PRE[0].map((c) => ({ ...c })), cen = { x: 38, y: 19 }, R = 8, arr = null;
    const q = (s) => el.querySelector(s);
    const N = 4000, dirs = []; const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) { const z = 1 - (2 * (i + 0.5)) / N, r = Math.sqrt(1 - z * z); dirs.push([r * Math.cos(ga * i), r * Math.sin(ga * i), z]); }
    function E(x, y, z) { let ex = 0, ey = 0, ez = 0; for (const c of cargas) { const dx = (x - c.x) / 100, dy = (y - c.y) / 100, dz = z / 100, r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2); if (r < 1e-5) continue; const e = (K * c.q * 1e-9) / r2; ex += (e * dx) / r; ey += (e * dy) / r; ez += (e * dz) / r; } return [ex, ey, ez]; }
    function fluxo() { let s = 0; const dA = (4 * Math.PI * (R / 100) ** 2) / N; for (const [nx, ny, nz] of dirs) { const e = E(cen.x + R * nx, cen.y + R * ny, R * nz); s += (e[0] * nx + e[1] * ny + e[2] * nz) * dA; } return s; }
    function desenha() {
      let g = "";
      for (let x = 0; x <= W; x += 50) g += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" class="grade"/>`;
      for (let y = 0; y <= H; y += 50) g += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" class="grade"/>`;
      // borda colorida por E·n
      const M = 90, ens = []; for (let k = 0; k < M; k++) { const am = (2 * Math.PI * (k + 0.5)) / M, e = E(cen.x + R * Math.cos(am), cen.y + R * Math.sin(am), 0); ens.push(e[0] * Math.cos(am) + e[1] * Math.sin(am)); }
      const emax = Math.max(...ens.map(Math.abs)) || 1;
      for (let k = 0; k < M; k++) { const a1 = (2 * Math.PI * k) / M, a2 = (2 * Math.PI * (k + 1)) / M, en = ens[k]; const a = Math.min(1, 0.2 + 0.8 * Math.sqrt(Math.abs(en) / emax));
        g += `<line x1="${(cen.x + R * Math.cos(a1)) * PX}" y1="${(cen.y + R * Math.sin(a1)) * PX}" x2="${(cen.x + R * Math.cos(a2)) * PX}" y2="${(cen.y + R * Math.sin(a2)) * PX}" style="stroke:${en > 0 ? "#ef5b5b" : "#4f8dff"};stroke-width:5;opacity:${a.toFixed(2)};stroke-linecap:round"/>`; }
      g += `<circle cx="${cen.x * PX}" cy="${cen.y * PX}" r="${R * PX}" style="fill:color-mix(in srgb,var(--mod) 7%,transparent)"/><path d="M${cen.x * PX - 7} ${cen.y * PX} h14 M${cen.x * PX} ${cen.y * PX - 7} v14" style="stroke:var(--ink3);stroke-width:2"/>`;
      for (const c of cargas) g += `<circle cx="${c.x * PX}" cy="${c.y * PX}" r="${11 + 2 * Math.abs(c.q)}" fill="${c.q > 0 ? "#ef5b5b" : "#4f8dff"}" style="stroke:var(--bg);stroke-width:2"/><text x="${c.x * PX}" y="${c.y * PX + 4.5}" text-anchor="middle" style="font:700 13px Inter;fill:#fff">${c.q > 0 ? "+" : "−"}${Math.abs(c.q)}</text>`;
      q(".g").innerHTML = g;
      const phi = fluxo(), qin = cargas.filter((c) => Math.hypot(c.x - cen.x, c.y - cen.y) < R).reduce((s, c) => s + c.q, 0), borda = cargas.some((c) => Math.abs(Math.hypot(c.x - cen.x, c.y - cen.y) - R) < 0.6);
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>Φ numérico (soma de E·dA)</small><b>${F.t(phi, 0)} N·m²/C</b></div><div class="vis"><small>q dentro</small><b>${qin} nC</b></div><div class="vis"><small>q_int / ε₀</small><b>${F.t((qin * 1e-9) / EPS0, 0)} N·m²/C</b></div>` + (borda ? `<div class="vis"><small>atenção</small><b style="color:var(--warn)">carga na superfície</b></div>` : "");
      q("output").textContent = F.t(R, 1) + " cm";
    }
    const svg = q("svg");
    const pos = (ev) => { const r = svg.getBoundingClientRect(); return { x: ((ev.clientX - r.left) * (W / r.width)) / PX, y: ((ev.clientY - r.top) * (H / r.height)) / PX }; };
    svg.addEventListener("pointerdown", (ev) => { const p = pos(ev); arr = cargas.find((c) => Math.hypot(c.x - p.x, c.y - p.y) < 2) || (Math.hypot(cen.x - p.x, cen.y - p.y) < 2 ? cen : null); if (arr) svg.setPointerCapture(ev.pointerId); });
    svg.addEventListener("pointermove", (ev) => { if (!arr) return; const p = pos(ev); arr.x = Math.max(1, Math.min(W / PX - 1, p.x)); arr.y = Math.max(1, Math.min(H / PX - 1, p.y)); desenha(); });
    svg.addEventListener("pointerup", () => (arr = null));
    q("input").addEventListener("input", (ev) => { R = +ev.target.value; desenha(); });
    el.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { cargas = PRE[+b.dataset.p].map((c) => ({ ...c })); desenha(); }));
    desenha();
  };

  /* ---------- 4. Placa condutora fina (vista de cima) ----------
     N cargas iguais presas a uma placa plana fina, repulsão 1/r² (3D). Elas relaxam até o equilíbrio:
     a componente do campo ao longo da placa vai a zero e a densidade cresce nas bordas e pontas. */
  /* nome: "Placa condutora: onde as cargas param" · matéria: Física · tema: C05 */
  SIM.placa = (el, F) => {
    const W = 760, H = 380;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><canvas width="${W * 2}" height="${H * 2}" style="width:${W}px;height:${H}px;border-radius:8px;background:var(--bg)"></canvas></div>
      <div class="leitor" data-v="l"></div>
      <div class="ctrls"><div class="bts"><button class="bt peq" data-f="disco">Disco</button><button class="bt peq" data-f="gota" aria-pressed="true">Gota (com ponta)</button><button class="bt peq" data-f="ret">Retângulo</button></div>
      <div class="bts"><button class="bt peq pri" data-a="soltar">↺ Espalhar as cargas de novo</button></div></div>
      <div class="status">Cada ponto é um pacote de carga. Eles se repelem e se espalham pela placa até a força ao longo dela zerar. Repare onde eles se juntam.</div>`);
    const cv = el.querySelector("canvas"), cx = cv.getContext("2d"); cx.scale(2, 2);
    const FORMAS = {
      disco: (t) => [380 + 150 * Math.cos(t), 190 + 150 * Math.sin(t)],
      gota: (t) => [380 + 210 * Math.cos(t), 190 + 160 * Math.sin(t) * Math.pow(Math.abs(Math.sin(t / 2)), 1.6)],
      ret: (t) => { const c = Math.cos(t), s = Math.sin(t), m = Math.max(Math.abs(c) / 260, Math.abs(s) / 120); return [380 + c / m, 190 + s / m]; },
    };
    let forma = "gota", poli = [], pts = [], vivo = true, iter = 0;
    const N = 140;
    function fazPoli() { poli = []; for (let k = 0; k < 240; k++) poli.push(FORMAS[forma]((2 * Math.PI * k) / 240)); }
    function dentro(x, y) { let c = false; for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) { const [xi, yi] = poli[i], [xj, yj] = poli[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; }
    function projeta(p) { let best = null, bd = 1e9; for (let i = 0; i < poli.length; i++) { const [ax, ay] = poli[i], [bx, by] = poli[(i + 1) % poli.length]; const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((p.x - ax) * dx + (p.y - ay) * dy) / (dx * dx + dy * dy))); const qx = ax + t * dx, qy = ay + t * dy, d = Math.hypot(p.x - qx, p.y - qy); if (d < bd) { bd = d; best = [qx, qy]; } } p.x = best[0]; p.y = best[1]; }
    function semeia() { pts = []; let tries = 0; while (pts.length < N && tries < 1e5) { tries++; const x = 380 + (Math.random() - 0.5) * 120, y = 190 + (Math.random() - 0.5) * 80; if (dentro(x, y)) pts.push({ x, y }); } iter = 0; }
    function relaxa() {
      const passo = 2.2 * Math.exp(-iter / 900) + 0.15;
      const f = pts.map((p) => { let fx = 0, fy = 0; for (const o of pts) { if (o === p) continue; const dx = p.x - o.x, dy = p.y - o.y, r2 = dx * dx + dy * dy + 4, r = Math.sqrt(r2); fx += dx / (r2 * r); fy += dy / (r2 * r); } return [fx, fy]; });
      pts.forEach((p, i) => { const m = Math.hypot(f[i][0], f[i][1]) || 1; p.x += (passo * f[i][0]) / m; p.y += (passo * f[i][1]) / m; if (!dentro(p.x, p.y)) projeta(p); });
      iter++;
    }
    function desenha() {
      const ink = cssv("--ink"), ink3 = cssv("--ink3"), mod = cssv("--mod") || "#c58af0";
      cx.clearRect(0, 0, W, H);
      cx.beginPath(); poli.forEach(([x, y], i) => (i ? cx.lineTo(x, y) : cx.moveTo(x, y))); cx.closePath();
      cx.fillStyle = "rgba(150,160,180,.12)"; cx.fill(); cx.strokeStyle = ink3; cx.lineWidth = 2; cx.stroke();
      cx.fillStyle = "#ef5b5b"; for (const p of pts) { cx.beginPath(); cx.arc(p.x, p.y, 3.4, 0, 7); cx.fill(); }
      // "força ao longo da placa" residual num ponto interior (média), comparada com a de uma carga isolada
      const borda = pts.filter((p) => { const t = { x: p.x, y: p.y }; return !dentro(t.x + 3, t.y) || !dentro(t.x - 3, t.y) || !dentro(t.x, t.y + 3) || !dentro(t.x, t.y - 3); }).length;
      el.querySelector('[data-v="l"]').innerHTML = `<div class="vis"><small>passos de relaxação</small><b>${iter}</b></div><div class="vis"><small>cargas na borda</small><b>${borda} de ${N} (${F.t((100 * borda) / N, 0)}%)</b></div>`;
    }
    function loop() { if (!vivo) return; if (iter < 2500) { for (let k = 0; k < 3; k++) relaxa(); desenha(); } requestAnimationFrame(loop); }
    el.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { forma = b.dataset.f; el.querySelectorAll("[data-f]").forEach((x) => x.setAttribute("aria-pressed", x === b)); fazPoli(); semeia(); }));
    el.querySelector('[data-a="soltar"]').addEventListener("click", semeia);
    fazPoli(); semeia(); requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };
})();
