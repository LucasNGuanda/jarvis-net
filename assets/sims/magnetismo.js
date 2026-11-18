/* Laboratórios de magnetismo e indução (β 0.6):
   partícula em B (círculo, seletor, cíclotron, cicloide), espira/motor, campo de correntes,
   indução (ímã e espira; barra nos trilhos), RLC, fasores em CA e onda eletromagnética. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const MU0 = 4e-7 * Math.PI, EPS0 = 8.854e-12, C = 2.998e8, E_ = 1.602e-19;
  const cssv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const fmt = (F, v, u) => (SIM.fmtSI ? SIM.fmtSI(F, v, u) : F.t(v, 3) + " " + u);
  const canvas = (el, W, H) => { el.insertAdjacentHTML("beforeend", `<div class="palco"><canvas width="${W * 2}" height="${H * 2}" style="width:${W}px;height:${H}px;border-radius:8px;background:var(--bg)"></canvas></div>`); const cv = el.querySelector("canvas"); const cx = cv.getContext("2d"); cx.scale(2, 2); return [cv, cx]; };
  const seta = (cx, x1, y1, x2, y2, c, w = 2) => { const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1); if (L < 2) return; cx.strokeStyle = c; cx.fillStyle = c; cx.lineWidth = w; cx.beginPath(); cx.moveTo(x1, y1); cx.lineTo(x2 - 6 * Math.cos(a), y2 - 6 * Math.sin(a)); cx.stroke(); cx.beginPath(); cx.moveTo(x2, y2); cx.lineTo(x2 - 9 * Math.cos(a - 0.4), y2 - 9 * Math.sin(a - 0.4)); cx.lineTo(x2 - 9 * Math.cos(a + 0.4), y2 - 9 * Math.sin(a + 0.4)); cx.fill(); };
  const xis = (cx, x, y, dentro, c) => { cx.strokeStyle = c; cx.lineWidth = 1.2; cx.beginPath(); cx.arc(x, y, 5, 0, 7); cx.stroke(); if (dentro) { cx.beginPath(); cx.moveTo(x - 3.2, y - 3.2); cx.lineTo(x + 3.2, y + 3.2); cx.moveTo(x + 3.2, y - 3.2); cx.lineTo(x - 3.2, y + 3.2); cx.stroke(); } else { cx.fillStyle = c; cx.beginPath(); cx.arc(x, y, 1.6, 0, 7); cx.fill(); } };

  /* ---------- 1. Partícula num campo magnético ----------
     Unidades de tela: ω = ω0·(B/Bref); raio = v/ω. Valores físicos mostrados com a partícula escolhida. */
  /* nome: "Círculo, seletor, cíclotron" · matéria: Física · tema: C12, C13 */
  SIM.particulaB = (el, F) => {
    const W = 760, H = 400; const [cv, cx] = canvas(el, W, H);
    el.insertAdjacentHTML("beforeend", `<div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="bts" style="grid-column:1/-1">${[["circ", "Só B"], ["sel", "Seletor de velocidades"], ["cic", "Cíclotron"], ["cicl", "Parte do repouso em E × B"]].map(([k, t], i) => `<button class="bt peq" data-m="${k}" aria-pressed="${i === 0}">${t}</button>`).join("")}
        <span style="width:16px"></span><button class="bt peq" data-p="e" aria-pressed="true">elétron</button><button class="bt peq" data-p="p">próton</button></div>
      <div class="ctrl"><label>B</label><input type="range" min="0.5" max="2" step="0.05" value="1" data-c="b"><output data-o="b"></output></div>
      <div class="ctrl"><label>v</label><input type="range" min="0.3" max="1.5" step="0.05" value="1" data-c="v"><output data-o="v"></output></div>
      <div class="ctrl"><label>ângulo entre v e B</label><input type="range" min="10" max="90" step="1" value="90" data-c="a"><output data-o="a"></output></div>
    </div><div class="status" data-v="st"></div>`);
    const P = { e: { m: 9.109e-31, q: -E_, v0: 1e7, B0: 1e-3, nome: "elétron" }, p: { m: 1.673e-27, q: E_, v0: 1e6, B0: 0.1, nome: "próton" } };
    const st = { m: "circ", p: "e", b: 1, v: 1, a: 90 }; const W0 = (2 * Math.PI) / 2.6;
    let ps = [], vivo = true, emis = 0, voltas = 0;
    const q = (s) => el.querySelector(s);
    function reinicia() {
      ps = []; voltas = 0; const s = Math.sign(P[st.p].q), om = W0 * st.b;
      if (st.m === "circ") { const v = 120 * st.v * Math.sin((st.a * Math.PI) / 180); ps.push({ x: W / 2 + (s > 0 ? -1 : 1) * (v / om), y: H / 2, vx: 0, vy: -v, tr: [] }); }
      if (st.m === "cicl") ps.push({ x: 60, y: H / 2 + 120, vx: 0, vy: 0, tr: [] });
      if (st.m === "cic") ps.push({ x: W / 2, y: H / 2, vx: 0, vy: -10, tr: [] });
    }
    function passo(dt) {
      const s = Math.sign(P[st.p].q), om = s * W0 * st.b, vsel = 120;
      let Ey = 0; if (st.m === "sel") Ey = om * vsel; if (st.m === "cicl") Ey = om * 90;
      if (st.m === "sel") { emis += dt; if (emis > 0.18) { emis = 0; const v = vsel * (0.55 + 0.9 * Math.random()); ps.push({ x: 0, y: H / 2, vx: v, vy: 0, tr: [], v0: v }); } }
      for (const p of ps) {
        const n = 30, h = dt / n;
        for (let k = 0; k < n; k++) {
          // a = s(E + v×B), B saindo da tela (ẑ) para s>0 => v×B = (vy, -vx)·ω
          let ax = om * p.vy, ay = -om * p.vx + Ey;
          if (st.m === "cic" && Math.abs(p.x - W / 2) < 14) p.vx += Math.sign(p.vx || -1) * 260 * h; // empurrão na fenda, sempre a favor
          p.vx += ax * h; p.vy += ay * h; p.x += p.vx * h; p.y += p.vy * h;
        }
        p.tr.push([p.x, p.y]); if (p.tr.length > 900) p.tr.shift();
      }
      ps = ps.filter((p) => p.x > -40 && p.x < W + 40 && p.y > -40 && p.y < H + 40 && (st.m !== "cic" || Math.hypot(p.x - W / 2, p.y - H / 2) < 185));
      if (st.m === "cic" && ps.length === 0) reinicia();
    }
    function desenha() {
      const ink3 = cssv("--ink3"), mod = cssv("--mod") || "#c58af0", warn = cssv("--warn"), s = Math.sign(P[st.p].q);
      cx.clearRect(0, 0, W, H);
      for (let x = 30; x < W; x += 50) for (let y = 25; y < H; y += 50) xis(cx, x, y, true, "rgba(140,150,170,.35)");
      if (st.m === "sel" || st.m === "cicl") { cx.fillStyle = "rgba(239,91,91,.5)"; cx.fillRect(0, 0, W, 6); cx.fillStyle = "rgba(79,141,255,.5)"; cx.fillRect(0, H - 6, W, 6); cx.fillStyle = cssv("--ink2"); cx.font = "13px Inter"; cx.fillText("placa +", 8, 22); cx.fillText("placa −", 8, H - 14); }
      if (st.m === "sel") { cx.fillStyle = cssv("--ink"); cx.fillRect(W - 14, 0, 8, H / 2 - 10); cx.fillRect(W - 14, H / 2 + 10, 8, H / 2 - 10); }
      if (st.m === "cic") { cx.strokeStyle = ink3; cx.lineWidth = 2; cx.beginPath(); cx.arc(W / 2 - 14, H / 2, 185, Math.PI / 2, (3 * Math.PI) / 2); cx.closePath(); cx.stroke(); cx.beginPath(); cx.arc(W / 2 + 14, H / 2, 185, -Math.PI / 2, Math.PI / 2); cx.closePath(); cx.stroke(); cx.fillStyle = "rgba(232,176,75,.10)"; cx.fillRect(W / 2 - 14, H / 2 - 185, 28, 370); }
      for (const p of ps) {
        cx.strokeStyle = st.m === "sel" ? (Math.abs(p.v0 - 120) < 6 ? warn : mod) : mod; cx.lineWidth = 1.8; cx.beginPath(); p.tr.forEach(([x, y], i) => (i ? cx.lineTo(x, y) : cx.moveTo(x, y))); cx.stroke();
        cx.fillStyle = s < 0 ? "#4f8dff" : "#ef5b5b"; cx.beginPath(); cx.arc(p.x, p.y, 6, 0, 7); cx.fill();
      }
      cx.fillStyle = cssv("--ink2"); cx.font = "13px Inter"; cx.fillText("B ⊗ (entrando na tela)", W - 170, 20);
    }
    function leitura() {
      const pa = P[st.p], B = pa.B0 * st.b, v = pa.v0 * st.v, al = (st.a * Math.PI) / 180;
      const r = (pa.m * v * Math.sin(al)) / (Math.abs(pa.q) * B), T = (2 * Math.PI * pa.m) / (Math.abs(pa.q) * B), passo = v * Math.cos(al) * T;
      q('[data-o="b"]').textContent = fmt(F, B, "T"); q('[data-o="v"]').textContent = fmt(F, v, "m/s"); q('[data-o="a"]').textContent = st.a + "°";
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>raio r = mv⊥/|q|B</small><b>${fmt(F, r, "m")}</b></div><div class="vis"><small>período T = 2πm/|q|B</small><b>${fmt(F, T, "s")}</b></div><div class="vis"><small>passo da hélice</small><b>${st.a === 90 ? "—" : fmt(F, passo, "m")}</b></div>` + (st.m === "sel" ? `<div class="vis"><small>passa reto se</small><b>v = E/B</b></div>` : "");
      q('[data-v="st"]').innerHTML = { circ: `O ${pa.nome} faz um círculo (a força é sempre perpendicular à velocidade: o módulo de v não muda). Repare: o <b>período não depende de v</b>. Com o ângulo menor que 90°, o movimento real é uma <b>hélice</b>; a tela mostra a projeção no plano perpendicular a B.`, sel: "Campo elétrico (placas) e magnético cruzados. Só passa reto pela fenda quem tem v = E/B (trajetórias em laranja). Os mais rápidos e os mais lentos curvam para lados opostos.", cic: "Cíclotron: a cada passagem pela fenda entre os dês, um campo elétrico alternado dá um empurrão. Como o período não depende de v, a frequência da tensão alternada pode ficar fixa. O raio cresce a cada meia volta.", cicl: "Partindo do repouso num campo E × B, a partícula descreve uma <b>cicloide</b>: a curva de um ponto na borda de uma roda que rola. A velocidade média (de deriva) é E/B, na direção de E × B, qualquer que seja o sinal da carga." }[st.m];
    }
    let t0 = performance.now();
    function loop(t) { if (!vivo) return; const dt = Math.min(0.03, (t - t0) / 1000); t0 = t; passo(dt); desenha(); requestAnimationFrame(loop); }
    el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { st.m = b.dataset.m; el.querySelectorAll("[data-m]").forEach((x) => x.setAttribute("aria-pressed", x === b)); reinicia(); leitura(); }));
    el.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { st.p = b.dataset.p; el.querySelectorAll("[data-p]").forEach((x) => x.setAttribute("aria-pressed", x === b)); reinicia(); leitura(); }));
    el.querySelectorAll("[data-c]").forEach((r) => r.addEventListener("input", () => { st[r.dataset.c] = +r.value; reinicia(); leitura(); }));
    reinicia(); leitura(); requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };

  /* ---------- 2. Espira num campo uniforme: torque e motor ----------
     Vista de cima do eixo: a espira é um segmento que gira; τ = N i A B sen θ. */
  /* nome: "Espira num campo: torque e motor" · matéria: Física · tema: C13 */
  SIM.espira = (el, F) => {
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 340 260" width="340" class="e1"></svg><svg viewBox="0 0 340 260" width="340" class="e2"></svg></div>
      <div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="ctrl"><label>corrente i</label><input type="range" min="0" max="2" step="0.05" value="1" data-c="i"><output data-o="i"></output></div>
      <div class="bts"><button class="bt peq" data-a="com" aria-pressed="false">Comutador (motor)</button><button class="bt peq" data-a="atr" aria-pressed="true">Atrito</button><button class="bt peq" data-a="emp">↻ Empurrãozinho</button></div></div>
      <div class="status" data-v="st"></div>`);
    const N = 50, A = 0.01, B = 0.2, I = 2e-4; let i = 1, th = 1.2, w = 0, com = false, atr = true, vivo = true;
    const q = (s) => el.querySelector(s);
    const ief = () => (com && Math.sin(th) < 0 ? -i : i);
    const tau = () => -N * ief() * A * B * Math.sin(th);
    function desenha() {
      const L = 90, c = Math.cos(th), s = Math.sin(th), x1 = 170 - L * s, y1 = 130 - L * c, x2 = 170 + L * s, y2 = 130 + L * c; // normal = (cos, -sin)... desenho
      let g = ""; for (let y = 30; y <= 230; y += 40) g += D.seta(10, y, 330, y, "var(--ink3)", 1.1);
      g += `<text x="300" y="20" class="tx2">B →</text><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:var(--ink);stroke-width:4"/>`;
      const sg = ief() >= 0 ? 1 : -1;
      const sim = (x, y, dentro) => `<circle cx="${x}" cy="${y}" r="11" style="fill:var(--card);stroke:var(--ink);stroke-width:2"/>` + (dentro ? `<path d="M${x - 6} ${y - 6} l12 12 M${x + 6} ${y - 6} l-12 12" class="ln"/>` : `<circle cx="${x}" cy="${y}" r="3" style="fill:var(--ink)"/>`);
      g += sim(x1, y1, sg > 0) + sim(x2, y2, sg < 0);
      if (i > 0) { const f = 40 * (i / 2) + 10; g += D.seta(x1, y1, x1, y1 + (sg > 0 ? -f : f), "var(--warn)", 2.4) + D.seta(x2, y2, x2, y2 + (sg > 0 ? f : -f), "var(--warn)", 2.4); }
      g += D.seta(170, 130, 170 + 50 * c, 130 - 50 * s, "var(--mod)", 2) + `<text x="${170 + 58 * c}" y="${130 - 58 * s}" class="tx2" style="fill:var(--mod)">μ</text>`;
      q(".e1").innerHTML = g;
      const x0 = 30, y0 = 130, sx = (a) => x0 + (a / (2 * Math.PI)) * 290, sy = (t) => y0 - t * 90;
      let d = ""; for (let k = 0; k <= 160; k++) { const a = (2 * Math.PI * k) / 160, ie = com && Math.sin(a) < 0 ? -1 : 1; d += (k ? "L" : "M") + sx(a).toFixed(1) + " " + sy(-ie * Math.sin(a)).toFixed(1); }
      const a = ((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      q(".e2").innerHTML = `<line x1="${x0}" y1="${y0}" x2="${x0 + 295}" y2="${y0}" class="ln2"/><path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.5"/><circle cx="${sx(a)}" cy="${sy(tau() / (N * 2 * A * B))}" r="6.5" style="fill:var(--warn);stroke:var(--card);stroke-width:2"/>${D.txt(x0, 22, "torque τ(θ)" + (com ? " com comutador" : ""), "tx2", "start")}${D.txt(x0 + 290, y0 + 18, "360°", "tx2", "end")}${D.txt(x0, y0 + 18, "0", "tx2")}`;
      q('[data-o="i"]').textContent = F.t(i, 2) + " A";
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>θ entre μ e B</small><b>${F.t((a * 180) / Math.PI, 0)}°</b></div><div class="vis"><small>τ = N i A B sen θ</small><b>${F.t(tau() * 1000, 2)} mN·m</b></div><div class="vis"><small>U = −μ·B</small><b>${F.t(-N * ief() * A * B * Math.cos(th) * 1000, 2)} mJ</b></div>`;
      q('[data-v="st"]').innerHTML = com ? "<b>Com comutador:</b> a corrente inverte a cada meia volta, e o torque fica sempre no mesmo sentido: é o motor de corrente contínua." : "<b>Sem comutador:</b> a espira oscila em torno da posição em que μ fica alinhado com B (energia mínima), como uma bússola.";
    }
    let t0 = performance.now();
    function loop(t) { if (!vivo) return; const dt = Math.min(0.03, (t - t0) / 1000); t0 = t; for (let k = 0; k < 10; k++) { const h = dt / 10; w += ((tau() - (atr ? 4e-5 : 0) * w) / I) * h * 0.02; th += w * h; } desenha(); requestAnimationFrame(loop); }
    q('[data-c="i"]').addEventListener("input", (ev) => (i = +ev.target.value));
    q('[data-a="com"]').addEventListener("click", (ev) => { com = !com; ev.currentTarget.setAttribute("aria-pressed", com); });
    q('[data-a="atr"]').addEventListener("click", (ev) => { atr = !atr; ev.currentTarget.setAttribute("aria-pressed", atr); });
    q('[data-a="emp"]').addEventListener("click", () => (w += 3));
    requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };

  /* ---------- 3. Campo magnético de correntes retilíneas (perpendiculares à tela) ----------
     B = μ0 I /(2π r) φ̂. Linhas de campo = curvas de nível de A_z = −(μ0/2π) Σ I ln r. */
  /* nome: "Campo magnético de correntes" · matéria: Física · tema: C14 */
  SIM.camposB = (el, F) => {
    const W = 760, H = 400, PX = 10; const [cv, cx] = canvas(el, W, H);
    el.insertAdjacentHTML("beforeend", `<div class="leitor" data-v="l"></div><div class="ctrls"><div class="bts" style="grid-column:1/-1">
      ${["Um fio", "Mesmo sentido", "Sentidos opostos", "Solenoide (corte)"].map((t, i) => `<button class="bt peq" data-p="${i}">${t}</button>`).join("")}
      <button class="bt peq" data-a="vet" aria-pressed="false">Vetores B</button><button class="bt peq" data-a="for" aria-pressed="true">Forças entre fios</button></div></div>
      <div class="status">Correntes perpendiculares à tela: <b>⊙</b> saindo, <b>⊗</b> entrando. Arraste os fios; clique num deles para inverter a corrente. As linhas de campo são fechadas.</div>`);
    const PRE = [[{ x: 38, y: 20, i: 10 }], [{ x: 30, y: 20, i: 10 }, { x: 46, y: 20, i: 10 }], [{ x: 30, y: 20, i: 10 }, { x: 46, y: 20, i: -10 }], Array.from({ length: 16 }, (_, k) => ({ x: 14 + 3.2 * (k % 8) * 2, y: k < 8 ? 13 : 27, i: k < 8 ? 6 : -6 }))];
    let fios = PRE[1].map((f) => ({ ...f })), vet = false, forc = true, arr = null, moveu = false, mouse = null, sujo = true, fundo = null;
    function B(x, y) { let bx = 0, by = 0, A = 0; for (const f of fios) { const dx = (x - f.x) / 100, dy = (y - f.y) / 100, r2 = dx * dx + dy * dy; if (r2 < 1e-8) continue; const k = (MU0 * f.i) / (2 * Math.PI * r2); bx += -k * dy; by += k * dx; A += -(MU0 * f.i) / (2 * Math.PI) * 0.5 * Math.log(r2); } return { bx, by, A }; }
    function linhas() {
      const s = 2, nx = Math.ceil(W / s), ny = Math.ceil(H / s), As = new Float32Array(nx * ny), img = cx.createImageData(nx, ny);
      let mn = Infinity, mx = -Infinity; for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const a = B((i * s) / PX, (j * s) / PX).A; As[j * nx + i] = a; }
      const passo = 8e-7 * (fios.length > 4 ? 1.6 : 1);
      const n = (a) => Math.floor(a / passo);
      const ink = cssv("--ink2"), m = ink.match(/\d+/g) || [160, 170, 190];
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const k = j * nx + i, p = 4 * k, a = n(As[k]); const borda = (i + 1 < nx && n(As[k + 1]) !== a) || (j + 1 < ny && n(As[k + nx]) !== a); if (borda) { img.data[p] = 150; img.data[p + 1] = 165; img.data[p + 2] = 190; img.data[p + 3] = 200; } }
      const off = document.createElement("canvas"); off.width = nx; off.height = ny; off.getContext("2d").putImageData(img, 0, 0); return off;
    }
    function desenha() {
      cx.clearRect(0, 0, W, H);
      if (sujo || !fundo) { fundo = linhas(); sujo = false; } cx.drawImage(fundo, 0, 0, W, H);
      if (vet) for (let y = 2; y < H / PX; y += 3) for (let x = 2; x < W / PX; x += 3) { const b = B(x, y), m = Math.hypot(b.bx, b.by); if (!m) continue; const L = Math.min(13, 3 + 2.4 * Math.log10(1 + m / 2e-6)); seta(cx, x * PX - (L * b.bx) / m, y * PX - (L * b.by) / m, x * PX + (L * b.bx) / m, y * PX + (L * b.by) / m, cssv("--ink3"), 1.2); }
      if (forc && fios.length <= 4) for (const f of fios) { let fx = 0, fy = 0; for (const o of fios) { if (o === f) continue; const dx = (f.x - o.x) / 100, dy = (f.y - o.y) / 100, r = Math.hypot(dx, dy), k = (MU0 * f.i * o.i) / (2 * Math.PI * r); fx += (-k * dx) / r; fy += (-k * dy) / r; } const m = Math.hypot(fx, fy); if (m) { const L = 30 + 20 * Math.log10(1 + m / 1e-4); seta(cx, f.x * PX, f.y * PX, f.x * PX + (L * fx) / m, f.y * PX + (L * fy) / m, cssv("--warn"), 2.6); cx.fillStyle = cssv("--warn"); cx.font = "600 12px Inter"; cx.fillText(F.t(m * 1e6, 0) + " µN/m", f.x * PX + (L * fx) / m + 6, f.y * PX + (L * fy) / m - 4); } }
      for (const f of fios) { cx.fillStyle = cssv("--card"); cx.strokeStyle = f.i > 0 ? "#ef5b5b" : "#4f8dff"; cx.lineWidth = 2.5; cx.beginPath(); cx.arc(f.x * PX, f.y * PX, 11, 0, 7); cx.fill(); cx.stroke(); cx.fillStyle = cx.strokeStyle; if (f.i > 0) { cx.beginPath(); cx.arc(f.x * PX, f.y * PX, 3.2, 0, 7); cx.fill(); } else { cx.beginPath(); cx.moveTo(f.x * PX - 5, f.y * PX - 5); cx.lineTo(f.x * PX + 5, f.y * PX + 5); cx.moveTo(f.x * PX + 5, f.y * PX - 5); cx.lineTo(f.x * PX - 5, f.y * PX + 5); cx.stroke(); } }
      let h = ""; if (mouse) { const b = B(mouse.x, mouse.y); h += `<div class="vis"><small>|B| no cursor</small><b>${fmt(F, Math.hypot(b.bx, b.by), "T")}</b></div>`; }
      h += `<div class="vis"><small>corrente em cada fio</small><b>${Math.abs(fios[0].i)} A</b></div>`; el.querySelector('[data-v="l"]').innerHTML = h;
    }
    const pos = (ev) => { const r = cv.getBoundingClientRect(); return { x: ((ev.clientX - r.left) * (W / r.width)) / PX, y: ((ev.clientY - r.top) * (H / r.height)) / PX }; };
    cv.addEventListener("pointerdown", (ev) => { const p = pos(ev); arr = fios.find((f) => Math.hypot(f.x - p.x, f.y - p.y) < 1.6); moveu = false; if (arr) cv.setPointerCapture(ev.pointerId); });
    cv.addEventListener("pointermove", (ev) => { mouse = pos(ev); if (arr) { arr.x = Math.max(1, Math.min(W / PX - 1, mouse.x)); arr.y = Math.max(1, Math.min(H / PX - 1, mouse.y)); moveu = true; sujo = true; } desenha(); });
    cv.addEventListener("pointerup", () => { if (arr && !moveu) { arr.i = -arr.i; sujo = true; } arr = null; desenha(); });
    cv.addEventListener("pointerleave", () => { mouse = null; desenha(); });
    el.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { fios = PRE[+b.dataset.p].map((f) => ({ ...f })); sujo = true; desenha(); }));
    el.querySelector('[data-a="vet"]').addEventListener("click", (ev) => { vet = !vet; ev.currentTarget.setAttribute("aria-pressed", vet); desenha(); });
    el.querySelector('[data-a="for"]').addEventListener("click", (ev) => { forc = !forc; ev.currentTarget.setAttribute("aria-pressed", forc); desenha(); });
    F.ouvir("tema", () => { sujo = true; desenha(); });
    desenha();
  };

  /* ---------- 4. Indução: ímã e espira; barra nos trilhos ----------
     Ímã = dipolo pontual no eixo: Φ = μ0 m R² / (2 (R² + d²)^{3/2}) (exato), fem = −N dΦ/dt.
     Barra: fem = BLv, i = BLv/R, força magnética −B²L²v/R; com força F externa: v → FR/(B²L²). */
  /* nome: "Indução: ímã, espira e barra" · matéria: Física · tema: C15 */
  SIM.inducao = (el, F) => {
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 720 230" width="720" class="cena"></svg></div><div class="palco"><svg viewBox="0 0 720 150" width="720" class="gr"></svg></div>
      <div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="bts" style="grid-column:1/-1"><button class="bt peq" data-m="ima" aria-pressed="true">Ímã e espira</button><button class="bt peq" data-m="barra">Barra nos trilhos</button><span style="width:12px"></span><button class="bt peq" data-a="auto" aria-pressed="true">Movimento automático</button></div>
      <div class="ctrl" data-s="ima"><label>posição do ímã</label><input type="range" min="-40" max="40" step="0.5" value="-30" data-c="x"><output data-o="x"></output></div>
      <div class="ctrl" data-s="barra"><label>força puxando a barra</label><input type="range" min="0" max="1" step="0.02" value="0.4" data-c="f"><output data-o="f"></output></div>
      </div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const Rl = 0.05, Nl = 200, mdip = 2.0, Rres = 2; // ímã: m = 2 A·m²
    const Bb = 0.5, Lb = 0.4, mb = 0.1, Rb = 0.5;
    let modo = "ima", auto = true, x = -0.3, xa = x, t = 0, hist = [], vivo = true, vb = 0, xb = 0, Fb = 0.4;
    const fluxo = (d) => (MU0 * mdip * Rl * Rl) / (2 * Math.pow(Rl * Rl + d * d, 1.5));
    function cena(fem, i) {
      let g = "";
      if (modo === "ima") {
        const X = 360 + x * 700, cor = Math.abs(i) > 1e-4;
        g += `<ellipse cx="360" cy="115" rx="22" ry="70" style="fill:none;stroke:#c98a4a;stroke-width:6"/>`;
        g += `<rect x="${X - 60}" y="98" width="60" height="34" style="fill:#ef5b5b"/><rect x="${X}" y="98" width="60" height="34" style="fill:#4f8dff"/>${D.txt(X - 30, 121, "N", "tx", "middle", 'style="fill:#fff;font-weight:700"')}${D.txt(X + 30, 121, "S", "tx", "middle", 'style="fill:#fff;font-weight:700"')}`;
        g += `<line x1="360" y1="185" x2="360" y2="215" class="ln"/><line x1="360" y1="215" x2="480" y2="215" class="ln"/><circle cx="500" cy="215" r="13" style="fill:var(--card);stroke:var(--ink);stroke-width:2"/>${D.txt(500, 220, "G", "tx", "middle", 'style="font-weight:700"')}`;
        if (cor) { const s = i > 0 ? 1 : -1; g += D.seta(360 + 26, 115 - 50 * s, 360 + 26, 115 + 50 * s, "var(--warn)", 2.4) + D.txt(400, 60, "corrente induzida", "tx2", "start"); }
        // ponteiro do galvanômetro
        const ang = Math.max(-1, Math.min(1, i / 0.05)) * 1.1; g += `<line x1="500" y1="215" x2="${500 + 11 * Math.sin(ang)}" y2="${215 - 11 * Math.cos(ang)}" style="stroke:var(--bad);stroke-width:2"/>`;
      } else {
        const X = 120 + ((xb % 5) / 5) * 480;
        g += `<line x1="60" y1="40" x2="680" y2="40" class="ln"/><line x1="60" y1="190" x2="680" y2="190" class="ln"/>` + D.comp("resistor", 60, 40, 60, 190, { rot: "R", lado: -1 });
        for (let a = 90; a < 680; a += 45) for (let b = 65; b < 180; b += 40) g += `<circle cx="${a}" cy="${b}" r="5" style="fill:none;stroke:var(--ink3)"/><path d="M${a - 3} ${b - 3} l6 6 M${a + 3} ${b - 3} l-6 6" style="stroke:var(--ink3)"/>`;
        g += `<rect x="${X - 5}" y="34" width="10" height="162" style="fill:#c98a4a"/>` + D.seta(X + 8, 115, X + 8 + 60 * Fb, 115, "var(--mod)", 2.4) + D.txt(X + 14, 104, "F", "txm", "start");
        if (vb > 1e-3) g += D.seta(X - 8, 135, X - 8 - Math.min(90, (60 * (Bb * Bb * Lb * Lb * vb)) / Rb), 135, "var(--warn)", 2.4) + D.txt(X - 14, 156, "F_mag", "tx2", "end");
        g += D.txt(370, 222, "B ⊗ (entrando)", "tx2");
      }
      q(".cena").innerHTML = g;
    }
    function grafico() {
      const x0 = 40, w = 660, y1 = 70, y2 = 140, T = 6;
      const k1 = modo === "ima" ? "Φ" : "v", k2 = modo === "ima" ? "fem" : "i";
      const m1 = Math.max(1e-12, ...hist.map((h) => Math.abs(h[1]))), m2 = Math.max(1e-12, ...hist.map((h) => Math.abs(h[2])));
      const path = (idx, y0, m, amp) => hist.map((h, k) => (k ? "L" : "M") + (x0 + ((h[0] - (t - T)) / T) * w).toFixed(1) + " " + (y0 - (h[idx] / m) * amp).toFixed(1)).join("");
      q(".gr").innerHTML = `<line x1="${x0}" y1="${y1}" x2="${x0 + w}" y2="${y1}" class="ln2"/><line x1="${x0}" y1="${y2 - 30}" x2="${x0 + w}" y2="${y2 - 30}" class="ln2" style="opacity:.4"/>
        <path d="${path(1, y1, m1, modo === "ima" ? 55 : 55)}" style="fill:none;stroke:var(--mod);stroke-width:2.2"/><path d="${path(2, y2 - 30, m2, 30)}" style="fill:none;stroke:var(--warn);stroke-width:2.2"/>
        ${D.txt(6, 26, k1, "tx2", "start")}${D.txt(6, 104, k2, "tx2", "start")}`;
    }
    let t0 = performance.now();
    function loop(tt) {
      if (!vivo) return; const dt = Math.min(0.04, (tt - t0) / 1000); t0 = tt; t += dt;
      let fem = 0, i = 0, a, b;
      if (modo === "ima") {
        if (auto) x = 0.3 * Math.sin(t * 1.4); else x = xa;
        const d0 = x, d1 = x + 1e-4; // derivada espacial
        const dPhi = (fluxo(d1) - fluxo(d0)) / 1e-4, vel = auto ? 0.3 * 1.4 * Math.cos(t * 1.4) : (x - (hist.length ? hist[hist.length - 1][3] : x)) / Math.max(dt, 1e-3);
        fem = -Nl * dPhi * vel; i = fem / Rres; a = fluxo(x) * Nl; b = fem;
        q('[data-o="x"]').textContent = F.t(x * 100, 1) + " cm";
        q('[data-v="l"]').innerHTML = `<div class="vis"><small>fluxo NΦ</small><b>${fmt(F, Nl * fluxo(x), "Wb")}</b></div><div class="vis"><small>fem = −N dΦ/dt</small><b>${fmt(F, fem, "V")}</b></div><div class="vis"><small>corrente (R = 2 Ω)</small><b>${fmt(F, i, "A")}</b></div>`;
        q('[data-v="st"]').innerHTML = "A fem aparece só quando o fluxo <b>muda</b>: ímã parado, mesmo dentro da bobina, não induz nada. Aproximando o polo norte, a corrente induzida cria um polo norte virado para o ímã (repele); afastando, cria um sul (atrai). Isso é a lei de Lenz.";
        hist.push([t, a, b, x]);
      } else {
        const Fm = (Bb * Bb * Lb * Lb * vb) / Rb, ac = (Fb - Fm) / mb; vb += ac * dt; xb += vb * dt; fem = Bb * Lb * vb; i = fem / Rb;
        const vt = (Fb * Rb) / (Bb * Bb * Lb * Lb);
        q('[data-o="f"]').textContent = F.t(Fb, 2) + " N";
        q('[data-v="l"]').innerHTML = `<div class="vis"><small>v</small><b>${F.t(vb, 2)} m/s</b></div><div class="vis"><small>fem = BLv</small><b>${F.t(fem, 3)} V</b></div><div class="vis"><small>i</small><b>${F.t(i, 3)} A</b></div><div class="vis"><small>v terminal = FR/B²L²</small><b>${F.t(vt, 2)} m/s</b></div><div class="vis"><small>F·v × R·i²</small><b>${F.t(Fb * vb, 3)} × ${F.t(Rb * i * i, 3)} W</b></div>`;
        q('[data-v="st"]').innerHTML = "Barra de 0,1 kg em trilhos de 0,4 m de separação, B = 0,5 T, R = 0,5 Ω. A força magnética sempre se opõe ao movimento (Lenz). Na velocidade terminal, toda a potência que você fornece (F·v) vira calor no resistor (R·i²).";
        hist.push([t, vb, i, 0]);
      }
      hist = hist.filter((h) => h[0] > t - 6);
      cena(fem, i); grafico(); requestAnimationFrame(loop);
    }
    const mostra = () => el.querySelectorAll("[data-s]").forEach((d) => (d.style.display = d.dataset.s === modo ? "" : "none"));
    el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { modo = b.dataset.m; el.querySelectorAll("[data-m]").forEach((x) => x.setAttribute("aria-pressed", x === b)); hist = []; vb = 0; xb = 0; mostra(); }));
    q('[data-a="auto"]').addEventListener("click", (ev) => { auto = !auto; ev.currentTarget.setAttribute("aria-pressed", auto); vb = 0; xb = 0; xa = x; q('[data-c="x"]').value = x * 100; });
    q('[data-c="x"]').addEventListener("input", (ev) => { auto = false; q('[data-a="auto"]').setAttribute("aria-pressed", false); xa = +ev.target.value / 100; });
    q('[data-c="f"]').addEventListener("input", (ev) => (Fb = +ev.target.value));
    mostra(); requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };

  /* ---------- 5. RLC: oscilação e amortecimento; RL ----------
     L q'' + R q' + q/C = 0. Câmera lenta: o período aparece com ~2,5 s. */
  /* nome: "LC, RLC e RL" · matéria: Física · tema: C15b */
  SIM.rlc = (el, F) => {
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 360 230" width="360" class="g1"></svg><svg viewBox="0 0 300 230" width="300" class="g2"></svg></div>
      <div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="ctrl"><label>L</label><input type="range" min="1" max="100" step="1" value="10" data-c="L"><output data-o="L"></output></div>
      <div class="ctrl"><label>C</label><input type="range" min="0.1" max="10" step="0.1" value="1" data-c="C"><output data-o="C"></output></div>
      <div class="ctrl"><label>R</label><input type="range" min="0" max="400" step="1" value="20" data-c="R"><output data-o="R"></output></div>
      <div class="bts"><button class="bt peq pri" data-a="lc">⚡ Soltar o capacitor carregado</button><button class="bt peq" data-a="rl">Ligar RL (fonte 10 V)</button></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    let L = 0.01, Cc = 1e-6, R = 20, modo = "lc", qq = 1e-5, i = 0, t = 0, calor = 0, hist = [], vivo = true;
    const w0 = () => 1 / Math.sqrt(L * Cc), lento = () => (2.5 * w0()) / (2 * Math.PI); // fator de câmera lenta
    function inicia(m) { modo = m; t = 0; calor = 0; hist = []; if (m === "lc") { qq = 1e-5; i = 0; } else { qq = 0; i = 0; } }
    function passo(dtReal) {
      const dt = dtReal / lento(), n = 200, h = dt / n;
      for (let k = 0; k < n; k++) {
        if (modo === "lc") { const a = (-R * i - qq / Cc) / L; i += a * h; qq += i * h; calor += R * i * i * h; }
        else { const a = (10 - R * i) / L; i += a * h; calor += R * i * i * h; }
        t += h;
      }
      hist.push([t, modo === "lc" ? qq : i]); if (hist.length > 600) hist.shift();
    }
    function desenha() {
      const x0 = 30, y0 = 115, w = 320, T = 4 * (2 * Math.PI) / w0();
      const m = modo === "lc" ? 1e-5 : Math.max(1e-6, 10 / Math.max(R, 1));
      const d = hist.filter((h) => h[0] <= T).map((h, k) => (k ? "L" : "M") + (x0 + (h[0] / T) * w).toFixed(1) + " " + (y0 - (h[1] / m) * 95).toFixed(1)).join("");
      let env = ""; if (modo === "lc" && R > 0) { const a = R / (2 * L); for (let s = -1; s <= 1; s += 2) env += `<path d="${Array.from({ length: 80 }, (_, k) => { const tt = (T * k) / 79; return (k ? "L" : "M") + (x0 + (tt / T) * w).toFixed(1) + " " + (y0 - s * Math.exp(-a * tt) * 95).toFixed(1); }).join("")}" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/>`; }
      q(".g1").innerHTML = `<line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}" class="ln2"/>${env}<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.4"/>${D.txt(x0, 16, modo === "lc" ? "carga q(t) no capacitor" : "corrente i(t)", "tx2", "start")}`;
      const UE = (qq * qq) / (2 * Cc), UB = 0.5 * L * i * i, U0 = modo === "lc" ? (1e-10 / (2 * Cc)) : Math.max(UE + UB + calor, 1e-12), H = 170;
      const barra = (x, v, cor, nome) => { const hh = Math.max(0, (H * v) / U0); return `<rect x="${x}" y="${200 - hh}" width="56" height="${hh}" style="fill:${cor}"/>${D.txt(x + 28, 220, nome, "tx2")}`; };
      q(".g2").innerHTML = barra(30, UE, "#4f8dff", "elétrica") + barra(120, UB, "var(--warn)", "magnética") + barra(210, Math.min(calor, U0), "var(--bad)", "calor") + D.txt(150, 16, "energia (fração da inicial)", "tx2");
      const a = R / (2 * L), ww = w0(), reg = modo !== "lc" ? "RL" : R === 0 ? "sem resistência: oscila para sempre" : a < ww ? "subamortecido (oscila)" : Math.abs(a - ww) / ww < 0.03 ? "amortecimento crítico" : "superamortecido (não oscila)";
      q('[data-o="L"]').textContent = F.t(L * 1000, 0) + " mH"; q('[data-o="C"]').textContent = F.t(Cc * 1e6, 1) + " µF"; q('[data-o="R"]').textContent = R + " Ω";
      q('[data-v="l"]').innerHTML = modo === "lc" ? `<div class="vis"><small>f₀ = 1/(2π√LC)</small><b>${F.t(ww / (2 * Math.PI), 0)} Hz</b></div><div class="vis"><small>R crítico = 2√(L/C)</small><b>${F.t(2 * Math.sqrt(L / Cc), 0)} Ω</b></div><div class="vis"><small>regime</small><b>${reg}</b></div><div class="vis"><small>câmera lenta</small><b>×${F.t(lento(), 0)}</b></div>`
        : `<div class="vis"><small>τ = L/R</small><b>${R ? fmt(F, L / R, "s") : "∞"}</b></div><div class="vis"><small>i final = E/R</small><b>${R ? F.t(10 / R, 3) + " A" : "∞"}</b></div><div class="vis"><small>i agora</small><b>${F.t(i, 3)} A</b></div>`;
      q('[data-v="st"]').innerHTML = modo === "lc" ? "A energia vai e volta entre o campo elétrico do capacitor e o campo magnético do indutor, como entre a energia potencial e a cinética de uma mola. O resistor transforma um pouco em calor a cada ciclo." : "Ao ligar, o indutor se opõe à variação da corrente: ela cresce exponencialmente até E/R, com constante de tempo L/R.";
    }
    let t0 = performance.now();
    function loop(tt) { if (!vivo) return; const dt = Math.min(0.04, (tt - t0) / 1000); t0 = tt; if (hist.length < 600 && (hist.length === 0 || hist[hist.length - 1][0] < 4 * (2 * Math.PI) / w0())) passo(dt); desenha(); requestAnimationFrame(loop); }
    el.querySelectorAll("[data-c]").forEach((r) => r.addEventListener("input", () => { const v = +r.value; if (r.dataset.c === "L") L = v / 1000; if (r.dataset.c === "C") Cc = v * 1e-6; if (r.dataset.c === "R") R = v; inicia(modo); }));
    q('[data-a="lc"]').addEventListener("click", () => inicia("lc")); q('[data-a="rl"]').addEventListener("click", () => inicia("rl"));
    inicia("lc"); requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };

  /* ---------- 6. Fasores num RLC série alimentado ---------- */
  /* nome: "RLC série: fasores e ressonância" · matéria: Física · tema: C15c */
  SIM.fasores = (el, F) => {
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 300 280" width="300" class="f1"></svg><svg viewBox="0 0 360 280" width="360" class="f2"></svg></div>
      <div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="ctrl"><label>frequência f</label><input type="range" min="0.6" max="2.6" step="0.005" value="1.9" data-c="f"><output data-o="f"></output></div>
      <div class="ctrl"><label>R</label><input type="range" min="5" max="200" step="1" value="40" data-c="R"><output data-o="R"></output></div></div>
      <div class="status">RLC série com L = 0,5 H, C = 20 µF, fonte de 220 V (eficaz). À esquerda, os fasores girando (vistos a cada instante: a projeção no eixo vertical é o valor instantâneo). À direita, a curva de ressonância. (* = seta cortada, fora de escala)</div>`);
    const q = (s) => el.querySelector(s); const L = 0.5, Cc = 20e-6, V = 220; let f = Math.pow(10, 1.9), R = 40, vivo = true, fase = 0;
    function calc() { const w = 2 * Math.PI * f, XL = w * L, XC = 1 / (w * Cc), Z = Math.hypot(R, XL - XC), I = V / Z, phi = Math.atan2(XL - XC, R); return { w, XL, XC, Z, I, phi }; }
    function desenha() {
      const s = calc(), cx0 = 150, cy0 = 140, k = 110 / (V * Math.SQRT2 * 1.4);
      const vr = s.I * R * Math.SQRT2, vl = s.I * s.XL * Math.SQRT2, vc = s.I * s.XC * Math.SQRT2, a = fase;
      const vec = (amp, ang, cor, nome) => { const Lp = Math.min(125, k * amp), fora = k * amp > 125; nome += fora ? "*" : ""; const x = cx0 + Lp * Math.cos(ang), y = cy0 - Lp * Math.sin(ang); return D.seta(cx0, cy0, x, y, cor, 2.6) + D.txt(x + 6 * Math.cos(ang), y - 6 * Math.sin(ang) + 4, nome, "tx2", Math.cos(ang) > 0 ? "start" : "end"); };
      let g = `<circle cx="${cx0}" cy="${cy0}" r="110" style="fill:none;stroke:var(--line)"/><line x1="20" y1="${cy0}" x2="280" y2="${cy0}" class="ln2" style="opacity:.4"/>`;
      g += vec(vr, a, "var(--ink)", "V_R ∥ I") + vec(Math.min(vl, 1e4), a + Math.PI / 2, "var(--warn)", "V_L") + vec(Math.min(vc, 1e4), a - Math.PI / 2, "#4f8dff", "V_C") + vec(V * Math.SQRT2, a + s.phi, "var(--mod)", "V");
      q(".f1").innerHTML = g;
      const x0 = 40, y0 = 250, w = 300, h = 220, lx = (ff) => x0 + ((Math.log10(ff) - 0.6) / 2) * w, Imax = V / R;
      let d = ""; for (let n = 0; n <= 200; n++) { const ff = Math.pow(10, 0.6 + (2 * n) / 200), ww = 2 * Math.PI * ff, I = V / Math.hypot(R, ww * L - 1 / (ww * Cc)); d += (n ? "L" : "M") + lx(ff).toFixed(1) + " " + (y0 - (I / Imax) * h).toFixed(1); }
      const f0 = 1 / (2 * Math.PI * Math.sqrt(L * Cc));
      q(".f2").innerHTML = `<line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}" class="ln2"/><path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.4"/><line x1="${lx(f0)}" y1="${y0}" x2="${lx(f0)}" y2="${y0 - h}" class="ln2" style="stroke-dasharray:4 4"/>${D.txt(lx(f0), y0 + 16, "f₀", "tx2")}<circle cx="${lx(f)}" cy="${y0 - (s.I / Imax) * h}" r="6.5" style="fill:var(--warn);stroke:var(--card);stroke-width:2"/>${D.txt(x0, 18, "I eficaz / I máx", "tx2", "start")}${D.txt(x0 + w, y0 + 16, "f (log)", "tx2", "end")}`;
      q('[data-o="f"]').textContent = F.t(f, 1) + " Hz"; q('[data-o="R"]').textContent = R + " Ω";
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>X_L · X_C</small><b>${F.t(s.XL, 0)} · ${F.t(s.XC, 0)} Ω</b></div><div class="vis"><small>Z</small><b>${F.t(s.Z, 1)} Ω</b></div><div class="vis"><small>I eficaz</small><b>${F.t(s.I, 2)} A</b></div><div class="vis"><small>fase φ</small><b>${F.t((s.phi * 180) / Math.PI, 1)}°</b></div><div class="vis"><small>P média = I²R</small><b>${F.t(s.I * s.I * R, 0)} W</b></div><div class="vis"><small>f₀</small><b>${F.t(f0, 1)} Hz</b></div>`;
    }
    let t0 = performance.now();
    function loop(t) { if (!vivo) return; const dt = Math.min(0.04, (t - t0) / 1000); t0 = t; fase += dt * 1.2; desenha(); requestAnimationFrame(loop); }
    q('[data-c="f"]').addEventListener("input", (ev) => (f = Math.pow(10, +ev.target.value)));
    q('[data-c="R"]').addEventListener("input", (ev) => (R = +ev.target.value));
    requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };

  /* ---------- 7. Onda eletromagnética ---------- */
  /* nome: "Onda eletromagnética" · matéria: Física · tema: C15d */
  SIM.ondaEM = (el, F) => {
    const W = 760, H = 320; const [cv, cx] = canvas(el, W, H);
    el.insertAdjacentHTML("beforeend", `<div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="ctrl"><label>amplitude E₀</label><input type="range" min="10" max="1000" step="10" value="300" data-c="E"><output data-o="E"></output></div>
      <div class="ctrl"><label>comprimento de onda (na tela)</label><input type="range" min="120" max="500" step="10" value="260" data-c="l"><output data-o="l"></output></div>
      <div class="bts"><button class="bt peq" data-a="circ" aria-pressed="false">Polarização circular</button><button class="bt peq" data-a="pausa" aria-pressed="false">⏸ Pausar</button></div></div>
      <div class="status">E (vermelho) e B (azul) oscilam em fase, perpendiculares entre si e à direção de propagação (seta S, vetor de Poynting). B está desenhado em perspectiva, "saindo" do plano da tela. Em todo ponto, |E| = c|B|.</div>`);
    const q = (s) => el.querySelector(s); let E0 = 300, lam = 260, circ = false, pausa = false, fase = 0, vivo = true;
    function desenha() {
      cx.clearRect(0, 0, W, H); const y0 = 170, ax = 40, k = (2 * Math.PI) / lam, AE = 230, AB = 230, px = [-0.75, 0.55]; // eixo z em perspectiva
      cx.strokeStyle = cssv("--ink3"); cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(ax, y0); cx.lineTo(W - 20, y0); cx.stroke(); seta(cx, W - 80, y0, W - 20, y0, cssv("--mod"), 3); cx.fillStyle = cssv("--mod"); cx.font = "600 14px Inter"; cx.fillText("S (propagação)", W - 150, y0 - 10);
      const deE = [], deB = [];
      for (let x = ax; x < W - 30; x += 14) {
        const th = k * (x - ax) - fase; const ey = Math.cos(th), ez = circ ? Math.sin(th) : 0; // E = (0, ey, ez)
        const by = -ez, bz = ey; // B = k̂ × E / c
        const Ex = x + px[0] * ez * AE * 0.6, Ey = y0 - ey * AE * (E0 / 550) - px[1] * ez * AE * 0.6 * (E0 / 550);
        const Bx = x + px[0] * bz * AB * 0.6 * (E0 / 550), By = y0 - by * AB * (E0 / 550) - px[1] * bz * AB * 0.6 * (E0 / 550);
        deE.push([x, Ex, Ey]); deB.push([x, Bx, By]);
      }
      deE.forEach(([x, X, Y]) => { cx.strokeStyle = "rgba(239,91,91,.55)"; cx.lineWidth = 1.4; cx.beginPath(); cx.moveTo(x, y0); cx.lineTo(X, Y); cx.stroke(); });
      deB.forEach(([x, X, Y]) => { cx.strokeStyle = "rgba(79,141,255,.55)"; cx.lineWidth = 1.4; cx.beginPath(); cx.moveTo(x, y0); cx.lineTo(X, Y); cx.stroke(); });
      cx.lineWidth = 2.4; cx.strokeStyle = "#ef5b5b"; cx.beginPath(); deE.forEach(([, X, Y], i) => (i ? cx.lineTo(X, Y) : cx.moveTo(X, Y))); cx.stroke();
      cx.strokeStyle = "#4f8dff"; cx.beginPath(); deB.forEach(([, X, Y], i) => (i ? cx.lineTo(X, Y) : cx.moveTo(X, Y))); cx.stroke();
      cx.font = "600 14px Inter"; cx.fillStyle = "#ef5b5b"; cx.fillText("E", 20, y0 - 80); cx.fillStyle = "#4f8dff"; cx.fillText("B (×c)", 14, y0 + 110);
      const B0 = E0 / C, I = (E0 * E0) / (2 * MU0 * C);
      q('[data-o="E"]').textContent = E0 + " V/m"; q('[data-o="l"]').textContent = lam + " px";
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>B₀ = E₀/c</small><b>${fmt(F, B0, "T")}</b></div><div class="vis"><small>intensidade I = E₀²/(2μ₀c)</small><b>${F.t(I, 1)} W/m²</b></div><div class="vis"><small>pressão (absorvida) I/c</small><b>${fmt(F, I / C, "Pa")}</b></div>`;
    }
    let t0 = performance.now();
    function loop(t) { if (!vivo) return; const dt = Math.min(0.04, (t - t0) / 1000); t0 = t; if (!pausa) fase += dt * 3; desenha(); requestAnimationFrame(loop); }
    q('[data-c="E"]').addEventListener("input", (ev) => (E0 = +ev.target.value)); q('[data-c="l"]').addEventListener("input", (ev) => (lam = +ev.target.value));
    q('[data-a="circ"]').addEventListener("click", (ev) => { circ = !circ; ev.currentTarget.setAttribute("aria-pressed", circ); });
    q('[data-a="pausa"]').addEventListener("click", (ev) => { pausa = !pausa; ev.currentTarget.setAttribute("aria-pressed", pausa); });
    requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };
})();
