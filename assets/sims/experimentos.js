/* Experimentos interativos (área "Experimentos"):
   pêndulo simples (exato × pequenos ângulos, espaço de fase), pêndulo duplo (caos) e o jogo da força de Lorentz.
   Integração: RK4. Equações conferidas com sympy (scratchpad exp.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const cssv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const rk4 = (f, s, h) => { const k1 = f(s), k2 = f(s.map((v, i) => v + (h / 2) * k1[i])), k3 = f(s.map((v, i) => v + (h / 2) * k2[i])), k4 = f(s.map((v, i) => v + h * k3[i])); return s.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); };
  const canvas = (el, W, H) => { el.insertAdjacentHTML("beforeend", `<div class="palco"><canvas width="${W * 2}" height="${H * 2}" style="width:${W}px;height:${H}px;border-radius:8px;background:var(--bg);touch-action:none"></canvas></div>`); const cv = el.querySelector("canvas"), cx = cv.getContext("2d"); cx.scale(2, 2); return [cv, cx]; };
  const pos = (cv, ev, W, H) => { const r = cv.getBoundingClientRect(); return [((ev.clientX - r.left) * W) / r.width, ((ev.clientY - r.top) * H) / r.height]; };

  /* ---------- 1. Pêndulo simples ----------  θ'' = −(g/L) sen θ  ×  aproximação θ'' = −(g/L) θ */
  /* nome: "Pêndulo simples: exato × pequenos ângulos" · matéria: Física · tema: EP01 */
  SIM.pendulo = (el, F) => {
    const W = 760, H = 380; const [cv, cx] = canvas(el, W, H);
    el.insertAdjacentHTML("beforeend", `<div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="ctrl"><label>comprimento L</label><input type="range" min="0.2" max="2" step="0.01" value="0.75" data-c="L"><output data-o="L"></output></div>
      <div class="ctrl"><label>g</label><input type="range" min="1.6" max="24.8" step="0.1" value="9.8" data-c="g"><output data-o="g"></output></div>
      <div class="bts"><button class="bt peq" data-a="fant" aria-pressed="true">Fantasma: pequenos ângulos</button><button class="bt peq" data-a="atr" aria-pressed="false">Atrito do ar</button><button class="bt peq" data-a="lua">g da Lua</button><button class="bt peq" data-a="terra">g da Terra</button></div></div>
      <div class="status"><b>Arraste o peso</b> para escolher o ângulo e solte. O fantasma cinza segue a equação linearizada (sen θ ≈ θ). À direita, o espaço de fase (θ, ω): cada órbita fechada é uma oscilação.</div>`);
    const st = { L: 0.75, g: 9.8, th: 0.52, w: 0, thf: 0.52, wf: 0, fant: true, atr: false, arr: false, t: 0, cruz: [], hist: [] };
    const q = (s) => el.querySelector(s);
    const ox = 240, oy = 50, esc = () => 280 / Math.max(st.L, 0.75);
    const T0 = () => 2 * Math.PI * Math.sqrt(st.L / st.g);
    const Kel = (k) => { let a = 1, b = Math.sqrt(1 - k * k); for (let i = 0; i < 25; i++) { const an = (a + b) / 2; b = Math.sqrt(a * b); a = an; } return Math.PI / (2 * a); }; // integral elíptica K(k) por média aritmético-geométrica
    let th0 = 0.52;
    function reset(th) { st.th = st.thf = th; st.w = st.wf = 0; st.t = 0; st.cruz = []; st.hist = []; th0 = Math.abs(th); }
    function passo(dt) {
      const n = 20, h = dt / n, b = st.atr ? 0.15 : 0;
      for (let k = 0; k < n; k++) {
        const prev = st.th;
        [st.th, st.w] = rk4(([t, w]) => [w, -(st.g / st.L) * Math.sin(t) - b * w], [st.th, st.w], h);
        [st.thf, st.wf] = rk4(([t, w]) => [w, -(st.g / st.L) * t - b * w], [st.thf, st.wf], h);
        st.t += h;
        if (prev < 0 && st.th >= 0) st.cruz.push(st.t);
      }
      st.hist.push([st.th, st.w]); if (st.hist.length > 700) st.hist.shift();
    }
    function desenha() {
      cx.clearRect(0, 0, W, H); const ink = cssv("--ink"), ink3 = cssv("--ink3"), mod = cssv("--mod") || "#5b9cf5";
      cx.fillStyle = ink3; cx.fillRect(ox - 60, oy - 6, 120, 6);
      const E = esc(), pp = (t) => [ox + st.L * E * Math.sin(t), oy + st.L * E * Math.cos(t)];
      if (st.fant) { const [fx, fy] = pp(st.thf); cx.strokeStyle = "rgba(150,160,180,.4)"; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(ox, oy); cx.lineTo(fx, fy); cx.stroke(); cx.fillStyle = "rgba(150,160,180,.35)"; cx.beginPath(); cx.arc(fx, fy, 15, 0, 7); cx.fill(); }
      const [x, y] = pp(st.th); cx.strokeStyle = ink; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(ox, oy); cx.lineTo(x, y); cx.stroke();
      cx.fillStyle = mod; cx.beginPath(); cx.arc(x, y, 15, 0, 7); cx.fill();
      cx.setLineDash([3, 4]); cx.strokeStyle = ink3; cx.beginPath(); cx.moveTo(ox, oy); cx.lineTo(ox, oy + st.L * E + 20); cx.stroke(); cx.setLineDash([]);
      // espaço de fase
      const px0 = 520, py0 = 190, sc = 60, sw = sc / Math.sqrt(st.g / st.L); // ω dividido por ω0: oscilações pequenas viram círculos
      cx.strokeStyle = ink3; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(px0 - 200, py0); cx.lineTo(px0 + 220, py0); cx.moveTo(px0, py0 - 170); cx.lineTo(px0, py0 + 170); cx.stroke();
      cx.fillStyle = cssv("--ink2"); cx.font = "13px Inter"; cx.fillText("θ", px0 + 210, py0 - 6); cx.fillText("ω", px0 + 6, py0 - 158); cx.fillText("−π", px0 - 3.14 * sc - 8, py0 + 16); cx.fillText("π", px0 + 3.14 * sc - 4, py0 + 16);
      cx.strokeStyle = mod; cx.lineWidth = 1.6; cx.beginPath(); st.hist.forEach(([t, w], i) => { const X = px0 + t * sc, Y = py0 - w * sw; i ? cx.lineTo(X, Y) : cx.moveTo(X, Y); }); cx.stroke();
      cx.fillStyle = cssv("--warn"); cx.beginPath(); cx.arc(px0 + st.th * sc, py0 - st.w * sw, 5, 0, 7); cx.fill();
      // leituras
      const k = Math.sin(th0 / 2), Tex = th0 < Math.PI - 1e-3 ? (2 / Math.PI) * Kel(k) * T0() : Infinity, ser = T0() * (1 + (th0 * th0) / 16);
      const Tm = st.cruz.length > 1 ? (st.cruz[st.cruz.length - 1] - st.cruz[0]) / (st.cruz.length - 1) : null;
      q('[data-o="L"]').textContent = F.t(st.L, 2) + " m"; q('[data-o="g"]').textContent = F.t(st.g, 1) + " m/s²";
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>amplitude θ₀</small><b>${F.t((th0 * 180) / Math.PI, 1)}°</b></div><div class="vis"><small>T₀ = 2π√(L/g)</small><b>${F.t(T0(), 3)} s</b></div><div class="vis"><small>T₀(1 + θ₀²/16)</small><b>${F.t(ser, 3)} s</b></div><div class="vis"><small>T exato (elíptica)</small><b>${isFinite(Tex) ? F.t(Tex, 3) + " s" : "∞"}</b></div><div class="vis"><small>T medido na simulação</small><b>${Tm ? F.t(Tm, 3) + " s" : "…"}</b></div>`;
    }
    let vivo = true, t0 = performance.now();
    function loop(t) { if (!vivo) return; const dt = Math.min(0.03, (t - t0) / 1000); t0 = t; if (!st.arr) passo(dt); desenha(); requestAnimationFrame(loop); }
    cv.addEventListener("pointerdown", (ev) => { st.arr = true; cv.setPointerCapture(ev.pointerId); });
    cv.addEventListener("pointermove", (ev) => { if (!st.arr) return; const [x, y] = pos(cv, ev, W, H); reset(Math.atan2(x - ox, y - oy)); });
    cv.addEventListener("pointerup", () => (st.arr = false));
    el.querySelectorAll("[data-c]").forEach((r) => r.addEventListener("input", () => { st[r.dataset.c] = +r.value; reset(th0 || 0.52); }));
    q('[data-a="fant"]').addEventListener("click", (ev) => { st.fant = !st.fant; ev.currentTarget.setAttribute("aria-pressed", st.fant); });
    q('[data-a="atr"]').addEventListener("click", (ev) => { st.atr = !st.atr; ev.currentTarget.setAttribute("aria-pressed", st.atr); });
    q('[data-a="lua"]').addEventListener("click", () => { st.g = 1.62; q('[data-c="g"]').value = 1.62; reset(th0); });
    q('[data-a="terra"]').addEventListener("click", () => { st.g = 9.8; q('[data-c="g"]').value = 9.8; reset(th0); });
    reset(0.52); requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };

  /* ---------- 2. Pêndulo duplo ----------
     Equações (forma explícita, deduzida da lagrangiana; conferida com sympy):
     θ1'' = [−g(2m1+m2) sen θ1 − m2 g sen(θ1−2θ2) − 2 sen Δ · m2 (ω2² L2 + ω1² L1 cos Δ)] / (L1 · den)
     θ2'' = [2 sen Δ (ω1² L1 (m1+m2) + g (m1+m2) cos θ1 + ω2² L2 m2 cos Δ)] / (L2 · den),  den = 2m1 + m2 − m2 cos 2Δ, Δ = θ1 − θ2 */
  /* nome: "Pêndulo duplo" · matéria: Física · tema: EP02 */
  SIM.penduloDuplo = (el, F) => {
    const W = 760, H = 440; const [cv, cx] = canvas(el, W, H);
    el.insertAdjacentHTML("beforeend", `<div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="ctrl"><label>m₁</label><input type="range" min="0.2" max="3" step="0.1" value="1" data-c="m1"><output data-o="m1"></output></div>
      <div class="ctrl"><label>m₂</label><input type="range" min="0.2" max="3" step="0.1" value="1" data-c="m2"><output data-o="m2"></output></div>
      <div class="ctrl"><label>L₁</label><input type="range" min="0.3" max="1.5" step="0.05" value="1" data-c="L1"><output data-o="L1"></output></div>
      <div class="ctrl"><label>L₂</label><input type="range" min="0.3" max="1.5" step="0.05" value="1" data-c="L2"><output data-o="L2"></output></div>
      <div class="bts" style="grid-column:1/-1"><button class="bt peq" data-a="gemeo" aria-pressed="true">Gêmeo com 0,001 rad de diferença</button><button class="bt peq" data-a="rastro" aria-pressed="true">Rastro</button>
        <button class="bt peq" data-a="m1">Modo normal lento</button><button class="bt peq" data-a="m2">Modo normal rápido</button><button class="bt peq" data-a="caos">Caos (ângulos grandes)</button><button class="bt peq" data-a="pausa">⏸ Pausar</button></div></div>
      <div class="status"><b>Arraste</b> as massas para escolher a posição inicial. O gêmeo (cinza) começa só 0,001 rad diferente: com ângulos grandes, em poucos segundos eles não têm mais nada a ver um com o outro (caos). A energia total fica constante.</div>`);
    const p = { m1: 1, m2: 1, L1: 1, L2: 1, g: 9.8 };
    let s = [2.0, 2.5, 0, 0], sg = [2.001, 2.5, 0, 0], gemeo = true, rastro = true, pausa = false, arr = 0, vivo = true, tempo = 0, trilha = [], E0 = 0, dist = [];
    const q = (x) => el.querySelector(x);
    const f = ([a1, a2, w1, w2]) => { const { m1, m2, L1, L2, g } = p, d = a1 - a2, den = 2 * m1 + m2 - m2 * Math.cos(2 * d);
      return [w1, w2, (-g * (2 * m1 + m2) * Math.sin(a1) - m2 * g * Math.sin(a1 - 2 * a2) - 2 * Math.sin(d) * m2 * (w2 * w2 * L2 + w1 * w1 * L1 * Math.cos(d))) / (L1 * den), (2 * Math.sin(d) * (w1 * w1 * L1 * (m1 + m2) + g * (m1 + m2) * Math.cos(a1) + w2 * w2 * L2 * m2 * Math.cos(d))) / (L2 * den)]; };
    const energia = ([a1, a2, w1, w2]) => { const { m1, m2, L1, L2, g } = p; return 0.5 * (m1 + m2) * L1 * L1 * w1 * w1 + 0.5 * m2 * L2 * L2 * w2 * w2 + m2 * L1 * L2 * w1 * w2 * Math.cos(a1 - a2) - (m1 + m2) * g * L1 * Math.cos(a1) - m2 * g * L2 * Math.cos(a2); };
    function inicia(a1, a2) { s = [a1, a2, 0, 0]; sg = [a1 + 0.001, a2, 0, 0]; tempo = 0; trilha = []; dist = []; E0 = energia(s); }
    const ox = 380, oy = 210, esc = () => 190 / (p.L1 + p.L2);
    const pts = (st) => { const e = esc(), x1 = ox + p.L1 * e * Math.sin(st[0]), y1 = oy + p.L1 * e * Math.cos(st[0]); return [x1, y1, x1 + p.L2 * e * Math.sin(st[1]), y1 + p.L2 * e * Math.cos(st[1])]; };
    function desenha() {
      cx.clearRect(0, 0, W, H); const ink = cssv("--ink"), mod = cssv("--mod") || "#5b9cf5", warn = cssv("--warn");
      if (rastro && trilha.length > 1) { cx.lineWidth = 1.4; for (let i = 1; i < trilha.length; i++) { cx.strokeStyle = `rgba(232,176,75,${(i / trilha.length) * 0.8})`; cx.beginPath(); cx.moveTo(...trilha[i - 1]); cx.lineTo(...trilha[i]); cx.stroke(); } }
      const bob = (st, cor, a) => { const [x1, y1, x2, y2] = pts(st); cx.globalAlpha = a; cx.strokeStyle = ink; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(ox, oy); cx.lineTo(x1, y1); cx.lineTo(x2, y2); cx.stroke(); cx.fillStyle = cor; cx.beginPath(); cx.arc(x1, y1, 8 + 4 * Math.sqrt(p.m1), 0, 7); cx.fill(); cx.beginPath(); cx.arc(x2, y2, 8 + 4 * Math.sqrt(p.m2), 0, 7); cx.fill(); cx.globalAlpha = 1; };
      if (gemeo) bob(sg, "rgb(150,160,180)", 0.45);
      bob(s, mod, 1);
      cx.fillStyle = cssv("--ink3"); cx.beginPath(); cx.arc(ox, oy, 4, 0, 7); cx.fill();
      // gráfico da separação entre gêmeos (log)
      if (gemeo && dist.length > 1) { const gx = 20, gy = 420, gw = 200, gh = 90; cx.strokeStyle = cssv("--line"); cx.strokeRect(gx, gy - gh, gw, gh); cx.strokeStyle = warn; cx.beginPath(); dist.forEach(([t, d], i) => { const X = gx + (t / Math.max(20, tempo)) * gw, Y = gy - ((Math.log10(Math.max(d, 1e-4)) + 4) / 4.5) * gh; i ? cx.lineTo(X, Y) : cx.moveTo(X, Y); }); cx.stroke(); cx.fillStyle = cssv("--ink2"); cx.font = "12px Inter"; cx.fillText("separação dos gêmeos (log)", gx, gy - gh - 6); }
      ["m1", "m2", "L1", "L2"].forEach((k) => (q(`[data-o="${k}"]`).textContent = F.t(p[k], 2) + (k[0] === "m" ? " kg" : " m")));
      const E = energia(s);
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>t</small><b>${F.t(tempo, 1)} s</b></div><div class="vis"><small>θ₁ · θ₂</small><b>${F.t((Math.atan2(Math.sin(s[0]), Math.cos(s[0])) * 180) / Math.PI, 0)}° · ${F.t((Math.atan2(Math.sin(s[1]), Math.cos(s[1])) * 180) / Math.PI, 0)}°</b></div><div class="vis"><small>energia E (J)</small><b>${F.t(E, 4)}</b></div><div class="vis"><small>erro relativo de E</small><b>${E0 ? F.t(Math.abs((E - E0) / E0) * 100, 5) + "%" : "—"}</b></div>`;
    }
    let t0 = performance.now();
    function loop(t) {
      if (!vivo) return; const dt = Math.min(0.03, (t - t0) / 1000); t0 = t;
      if (!pausa && !arr) { const n = 40, h = dt / n; for (let k = 0; k < n; k++) { s = rk4(f, s, h); if (gemeo) sg = rk4(f, sg, h); } tempo += dt; const P = pts(s); trilha.push([P[2], P[3]]); if (trilha.length > 500) trilha.shift(); if (gemeo) { const G = pts(sg); dist.push([tempo, Math.hypot(P[2] - G[2], P[3] - G[3]) / esc()]); if (dist.length > 2000) dist.shift(); } }
      desenha(); requestAnimationFrame(loop);
    }
    cv.addEventListener("pointerdown", (ev) => { const [x, y] = pos(cv, ev, W, H), P = pts(s); arr = Math.hypot(x - P[2], y - P[3]) < 25 ? 2 : Math.hypot(x - P[0], y - P[1]) < 25 ? 1 : 0; if (arr) cv.setPointerCapture(ev.pointerId); });
    cv.addEventListener("pointermove", (ev) => { if (!arr) return; const [x, y] = pos(cv, ev, W, H); if (arr === 1) s[0] = Math.atan2(x - ox, y - oy); else { const P = pts(s); s[1] = Math.atan2(x - P[0], y - P[1]); } inicia(s[0], s[1]); });
    cv.addEventListener("pointerup", () => (arr = 0));
    el.querySelectorAll("[data-c]").forEach((r) => r.addEventListener("input", () => { p[r.dataset.c] = +r.value; inicia(s[0], s[1]); }));
    const tog = (k, fn) => q(`[data-a="${k}"]`).addEventListener("click", fn);
    tog("gemeo", (ev) => { gemeo = !gemeo; ev.currentTarget.setAttribute("aria-pressed", gemeo); inicia(s[0], s[1]); });
    tog("rastro", (ev) => { rastro = !rastro; ev.currentTarget.setAttribute("aria-pressed", rastro); trilha = []; });
    tog("pausa", (ev) => { pausa = !pausa; ev.currentTarget.setAttribute("aria-pressed", pausa); });
    // modos normais para m1 = m2 e L1 = L2: θ2/θ1 = ±√2
    tog("m1", () => { Object.assign(p, { m1: 1, m2: 1, L1: 1, L2: 1 }); el.querySelectorAll("[data-c]").forEach((r) => (r.value = p[r.dataset.c])); inicia(0.1, 0.1 * Math.SQRT2); });
    tog("m2", () => { Object.assign(p, { m1: 1, m2: 1, L1: 1, L2: 1 }); el.querySelectorAll("[data-c]").forEach((r) => (r.value = p[r.dataset.c])); inicia(0.1, -0.1 * Math.SQRT2); });
    tog("caos", () => inicia(2.0, 2.5));
    inicia(2.0, 2.5); requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };

  /* ---------- 3. Jogo: acerte o alvo com a força de Lorentz ----------
     Tela em px; campo B uniforme na região sombreada: a = (q/m)(E + v × B). ω = (q/m)B. */
  /* nome: "Acerte o alvo com a força de Lorentz" · matéria: Física · tema: EP04 */
  SIM.jogoLorentz = (el, F) => {
    const W = 760, H = 420; const [cv, cx] = canvas(el, W, H);
    el.insertAdjacentHTML("beforeend", `<div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="ctrl"><label>B (unidades do jogo; + saindo, − entrando)</label><input type="range" min="-3" max="3" step="0.05" value="1" data-c="B"><output data-o="B"></output></div>
      <div class="ctrl"><label>velocidade v (px/s na tela)</label><input type="range" min="60" max="400" step="5" value="200" data-c="v"><output data-o="v"></output></div>
      <div class="ctrl" data-s="E"><label>campo E (unidades do jogo; para baixo)</label><input type="range" min="0" max="600" step="5" value="0" data-c="E"><output data-o="E"></output></div>
      <div class="bts"><button class="bt peq" data-a="q" aria-pressed="false">Carga negativa</button><button class="bt peq pri" data-a="fogo">Disparar</button><button class="bt peq" data-a="prev" aria-pressed="false">Mostrar a trajetória prevista (cola)</button></div></div>
      <div class="status" data-v="st"></div>`);
    const NIVEIS = [
      { nome: "Nível 1 · A curva", txt: "Acerte o alvo em cima. Só B. Lembre: r = mv/(qB).", alvos: [[430, 110]], paredes: [], E: false, campo: [140, 0, 620, 420] },
      { nome: "Nível 2 · Por cima do muro", txt: "O campo só existe na faixa sombreada. Faça a partícula sair dela mirando por cima do muro.", alvos: [[650, 40]], paredes: [[400, 160, 20, 140]], E: false, campo: [140, 0, 220, 420] },
      { nome: "Nível 3 · Seletor de velocidades", txt: "Agora há campo E. O alvo está atrás da fenda, em linha reta: ajuste para qE = qvB.", alvos: [[700, 210]], paredes: [[600, 0, 16, 190], [600, 230, 16, 190]], E: true, campo: [140, 0, 460, 420] },
      { nome: "Nível 4 · Meia-volta", txt: "O alvo está atrás do canhão, fora do campo. A partícula tem que dar meia-volta e voltar em linha reta. (Dica: diminua v.)", alvos: [[60, 330]], paredes: [[0, 250, 120, 14]], E: false, campo: [140, 0, 620, 420] },
      { nome: "Nível 5 · Dois alvos", txt: "Um disparo, dois alvos. Pense no raio certo.", alvos: [[267, 157], [320, 30]], paredes: [], E: false, campo: [140, 0, 620, 420] },
    ];
    let nv = 0, B = 1, v = 200, E = 0, qs = 1, bala = null, prev = false, acertos = new Set(), vivo = true, msg = "";
    const q = (x) => el.querySelector(x);
    const lv = () => NIVEIS[nv];
    const dentro = (x, y) => { const [a, b, w, h] = lv().campo; return x >= a && x <= a + w && y >= b && y <= b + h; };
    const acel = (x, y, vx, vy) => { if (!dentro(x, y)) return [0, 0]; const w = qs * B * 0.012 * 60, e = qs * (lv().E ? E : 0) * 0.5; return [w * vy * 1, -w * vx * 1 + e]; }; // B saindo da tela (+): força q v×B
    function simula(fn) { let x = 40, y = 210, vx = v, vy = 0; const h = 1 / 240; for (let k = 0; k < 2400; k++) { const [ax, ay] = acel(x, y, vx, vy); vx += ax * h; vy += ay * h; x += vx * h; y += vy * h; if (fn(x, y, k) === false) break; } }
    function bate(x, y) { if (x < 0 || x > W || y < 0 || y > H) return true; return lv().paredes.some(([a, b, w, h]) => x >= a && x <= a + w && y >= b && y <= b + h); }
    function desenha() {
      cx.clearRect(0, 0, W, H); const ink = cssv("--ink"), ink3 = cssv("--ink3"), mod = cssv("--mod") || "#c58af0", warn = cssv("--warn");
      const [a, b, w, h] = lv().campo; cx.fillStyle = B >= 0 ? "rgba(239,91,91,.06)" : "rgba(79,141,255,.07)"; cx.fillRect(a, b, w, h);
      for (let x = a + 20; x < a + w; x += 40) for (let y = b + 20; y < b + h; y += 40) { cx.strokeStyle = "rgba(150,160,180,.35)"; cx.lineWidth = 1; cx.beginPath(); cx.arc(x, y, 5, 0, 7); cx.stroke(); if (B >= 0) { cx.fillStyle = "rgba(150,160,180,.5)"; cx.beginPath(); cx.arc(x, y, 1.5, 0, 7); cx.fill(); } else { cx.beginPath(); cx.moveTo(x - 3, y - 3); cx.lineTo(x + 3, y + 3); cx.moveTo(x + 3, y - 3); cx.lineTo(x - 3, y + 3); cx.stroke(); } }
      if (lv().E && E > 0) for (let x = a + 40; x < a + w; x += 80) { cx.strokeStyle = "rgba(232,176,75,.5)"; cx.beginPath(); cx.moveTo(x, 20); cx.lineTo(x, 400); cx.stroke(); }
      cx.fillStyle = ink3; lv().paredes.forEach(([x, y, ww, hh]) => cx.fillRect(x, y, ww, hh));
      lv().alvos.forEach(([x, y], i) => { const ok = acertos.has(i); cx.strokeStyle = ok ? cssv("--ok") : warn; cx.lineWidth = 3; [16, 10, 4].forEach((r) => { cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.stroke(); }); });
      cx.fillStyle = ink; cx.fillRect(10, 200, 34, 20);
      if (prev) { cx.setLineDash([4, 5]); cx.strokeStyle = "rgba(150,160,180,.6)"; cx.lineWidth = 1.4; cx.beginPath(); cx.moveTo(40, 210); simula((x, y) => { cx.lineTo(x, y); return !bate(x, y); }); cx.stroke(); cx.setLineDash([]); }
      if (bala) { cx.strokeStyle = mod; cx.lineWidth = 2; cx.beginPath(); bala.tr.forEach(([x, y], i) => (i ? cx.lineTo(x, y) : cx.moveTo(x, y))); cx.stroke(); cx.fillStyle = qs > 0 ? "#ef5b5b" : "#4f8dff"; cx.beginPath(); cx.arc(bala.x, bala.y, 6, 0, 7); cx.fill(); }
      cx.fillStyle = cssv("--ink2"); cx.font = "600 14px Inter"; cx.fillText(lv().nome, 14, 22);
      const r = Math.abs(B) > 0.01 ? v / Math.abs(B * 0.72) : Infinity;
      q('[data-o="B"]').textContent = F.t(B, 2); q('[data-o="v"]').textContent = v; q('[data-o="E"]').textContent = E;
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>raio r = mv/|q|B (na tela)</small><b>${isFinite(r) ? F.t(r, 0) + " px" : "∞ (reta)"}</b></div>` + (lv().E ? `<div class="vis"><small>v que passa reto = E/B</small><b>${Math.abs(B) > 0.01 ? F.t((E * 0.5) / Math.abs(B * 0.72), 0) : "—"}</b></div>` : "") + `<div class="vis"><small>nível</small><b>${nv + 1} / ${NIVEIS.length}</b></div>`;
      q('[data-s="E"]').style.display = lv().E ? "" : "none";
      q('[data-v="st"]').innerHTML = (msg ? `<b>${msg}</b> ` : "") + lv().txt;
    }
    let t0 = performance.now();
    function loop(t) {
      if (!vivo) return; const dt = Math.min(0.03, (t - t0) / 1000); t0 = t;
      if (bala) { const n = 8, h = dt / n; for (let k = 0; k < n && bala; k++) { const [ax, ay] = acel(bala.x, bala.y, bala.vx, bala.vy); bala.vx += ax * h; bala.vy += ay * h; bala.x += bala.vx * h; bala.y += bala.vy * h; bala.tr.push([bala.x, bala.y]); lv().alvos.forEach(([x, y], i) => { if (Math.hypot(bala.x - x, bala.y - y) < 14) acertos.add(i); }); bala.t += h;
          if (bate(bala.x, bala.y) || bala.t > 10) { const todos = acertos.size === lv().alvos.length; msg = todos ? "Acertou!" : "Errou. Ajuste e tente de novo."; if (todos && nv < NIVEIS.length - 1) setTimeout(() => { nv++; acertos = new Set(); bala = null; msg = "Próximo nível!"; }, 900); else if (todos) msg = "Zerou o jogo! Agora tente de cabeça, sem a cola."; bala = null; } } }
      desenha(); requestAnimationFrame(loop);
    }
    el.querySelectorAll("[data-c]").forEach((r) => r.addEventListener("input", () => { const k = r.dataset.c, val = +r.value; if (k === "B") B = val; if (k === "v") v = val; if (k === "E") E = val; }));
    q('[data-a="q"]').addEventListener("click", (ev) => { qs = -qs; ev.currentTarget.setAttribute("aria-pressed", qs < 0); });
    q('[data-a="prev"]').addEventListener("click", (ev) => { prev = !prev; ev.currentTarget.setAttribute("aria-pressed", prev); });
    q('[data-a="fogo"]').addEventListener("click", () => { acertos = new Set(); msg = ""; bala = { x: 40, y: 210, vx: v, vy: 0, tr: [[40, 210]], t: 0 }; });
    requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };
})();

/* ===================== β 0.9: mais 5 experimentos ===================== */
(function () {
  const SIM = window.SIM;
  const cssv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const rk4 = (f, s, h) => { const k1 = f(s), k2 = f(s.map((v, i) => v + (h / 2) * k1[i])), k3 = f(s.map((v, i) => v + (h / 2) * k2[i])), k4 = f(s.map((v, i) => v + h * k3[i])); return s.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); };
  const canvas = (el, W, H) => { el.insertAdjacentHTML("beforeend", `<div class="palco"><canvas width="${W * 2}" height="${H * 2}" style="width:${W}px;height:${H}px;border-radius:8px;background:var(--bg);touch-action:none"></canvas></div>`); const cv = el.querySelector("canvas"), cx = cv.getContext("2d"); cx.scale(2, 2); return [cv, cx]; };
  const linha = (cx, pts, cor, w = 1.6) => { cx.strokeStyle = cor; cx.lineWidth = w; cx.beginPath(); pts.forEach(([x, y], i) => (i ? cx.lineTo(x, y) : cx.moveTo(x, y))); cx.stroke(); };
  const resolve = (A, b) => { const n = b.length, M = A.map((r, i) => [...r, b[i]]); for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r; [M[c], M[p]] = [M[p], M[c]]; for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; } } return M.map((r, i) => r[n] / r[i]); };

  /* ---------- EP09: pêndulo pendurado num bloco com mola (vertical) ----------
     (M+m)ẍ − mℓφ̈ sen φ − mℓφ̇² cos φ + kx = (M+m)g ;  mℓ²φ̈ − mℓẍ sen φ + mgℓ sen φ = 0   (x para baixo) */
  /* nome: "Bloco na mola com pêndulo" · matéria: Física · tema: EP09 */
  SIM.massaPendulo = (el, F) => {
    const W = 760, H = 420; const [cv, cx] = canvas(el, W, H);
    el.insertAdjacentHTML("beforeend", `<div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="ctrl"><label>M (bloco)</label><input type="range" min="0.2" max="3" step="0.1" value="1" data-c="M"><output data-o="M"></output></div>
      <div class="ctrl"><label>m (pêndulo)</label><input type="range" min="0.1" max="2" step="0.05" value="0.3" data-c="m"><output data-o="m"></output></div>
      <div class="ctrl"><label>ℓ</label><input type="range" min="0.2" max="1.2" step="0.05" value="0.5" data-c="l"><output data-o="l"></output></div>
      <div class="ctrl"><label>k</label><input type="range" min="5" max="200" step="1" value="60" data-c="k"><output data-o="k"></output></div>
      <div class="bts" style="grid-column:1/-1"><button class="bt peq pri" data-a="res">Ressonância 2 : 1 (mágica)</button><button class="bt peq" data-a="sol">Soltar com o pêndulo inclinado</button><button class="bt peq" data-a="caos">Caos (ângulo grande)</button><button class="bt peq" data-a="pausa">⏸ Pausar</button></div></div>
      <div class="status" data-v="st"></div>`);
    const p = { M: 1, m: 0.3, l: 0.5, k: 60, g: 9.8 }; let s = [0, 0, 0.5, 0], vivo = true, pausa = false, hist = [], tempo = 0, modo = "sol";
    const q = (x) => el.querySelector(x);
    const x0 = () => ((p.M + p.m) * p.g) / p.k; // equilíbrio do bloco
    const f = ([x, xd, fi, fd]) => { const { M, m, l, k, g } = p, sn = Math.sin(fi), cs = Math.cos(fi);
      const a = resolve([[M + m, -m * l * sn], [-m * l * sn, m * l * l]], [(M + m) * g - k * x + m * l * fd * fd * cs, -m * g * l * sn]); return [xd, a[0], fd, a[1]]; };
    const E = ([x, xd, fi, fd]) => { const { M, m, l, k, g } = p; return 0.5 * M * xd * xd + 0.5 * m * ((l * Math.cos(fi) * fd) ** 2 + (xd - l * Math.sin(fi) * fd) ** 2) - M * g * x - m * g * (x + l * Math.cos(fi)) + 0.5 * k * x * x; };
    function inicia(m) { modo = m; tempo = 0; hist = [];
      if (m === "res") { p.k = (4 * (p.M + p.m) * p.g) / p.l; q('[data-c="k"]').value = Math.min(200, p.k); s = [x0() + 0.06, 0, 0.02, 0]; }
      if (m === "sol") s = [x0(), 0, 0.5, 0]; if (m === "caos") s = [x0() + 0.1, 0, 2.6, 0];
    }
    let E0 = 0;
    function desenha() {
      cx.clearRect(0, 0, W, H); const ink = cssv("--ink"), ink3 = cssv("--ink3"), mod = cssv("--mod") || "#5b9cf5";
      const esc = 220, bx = 230, by = 40 + (s[0] - x0()) * esc + 110;
      cx.fillStyle = ink3; cx.fillRect(bx - 50, 20, 100, 8); cx.fillRect(bx - 50, 20, 6, 380); cx.fillRect(bx + 44, 20, 6, 380);
      // mola
      const n = 14, y1 = 28, y2 = by - 22; cx.strokeStyle = ink; cx.lineWidth = 1.8; cx.beginPath(); cx.moveTo(bx, y1); for (let i = 1; i < n; i++) cx.lineTo(bx + (i % 2 ? -12 : 12), y1 + ((y2 - y1) * i) / n); cx.lineTo(bx, y2); cx.stroke();
      cx.fillStyle = cssv("--card2"); cx.strokeStyle = ink; cx.fillRect(bx - 34, by - 22, 68, 44); cx.strokeRect(bx - 34, by - 22, 68, 44);
      const lx = bx + p.l * esc * 0.6 * Math.sin(s[2]), ly = by + p.l * esc * 0.6 * Math.cos(s[2]);
      cx.strokeStyle = ink; cx.lineWidth = 2.2; cx.beginPath(); cx.moveTo(bx, by); cx.lineTo(lx, ly); cx.stroke(); cx.fillStyle = mod; cx.beginPath(); cx.arc(lx, ly, 8 + 8 * Math.sqrt(p.m), 0, 7); cx.fill();
      // gráficos x(t) e φ(t)
      const gx = 420, gw = 320; cx.fillStyle = cssv("--ink2"); cx.font = "12px Inter"; cx.fillText("x − x₀ (bloco)", gx, 40); cx.fillText("φ (pêndulo)", gx, 230);
      cx.strokeStyle = cssv("--line"); cx.beginPath(); cx.moveTo(gx, 110); cx.lineTo(gx + gw, 110); cx.moveTo(gx, 300); cx.lineTo(gx + gw, 300); cx.stroke();
      const T = 15, mx = Math.max(0.02, ...hist.map((h) => Math.abs(h[1]))), mf = Math.max(0.05, ...hist.map((h) => Math.abs(h[2])));
      linha(cx, hist.map((h) => [gx + ((h[0] - Math.max(0, tempo - T)) / T) * gw, 110 - (h[1] / mx) * 60]), cssv("--warn"));
      linha(cx, hist.map((h) => [gx + ((h[0] - Math.max(0, tempo - T)) / T) * gw, 300 - (h[2] / mf) * 60]), mod);
      const wm = Math.sqrt(p.k / (p.M + p.m)), wp = Math.sqrt(p.g / p.l);
      ["M", "m", "l", "k"].forEach((k) => (q(`[data-o="${k}"]`).textContent = F.t(p[k], k === "k" ? 0 : 2) + { M: " kg", m: " kg", l: " m", k: " N/m" }[k]));
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>ω mola = √(k/(M+m))</small><b>${F.t(wm, 2)} rad/s</b></div><div class="vis"><small>ω pêndulo = √(g/ℓ)</small><b>${F.t(wp, 2)} rad/s</b></div><div class="vis"><small>razão</small><b>${F.t(wm / wp, 2)}</b></div><div class="vis"><small>erro relativo de E</small><b>${E0 ? F.t(Math.abs((E(s) - E0) / E0) * 100, 5) + "%" : "—"}</b></div>`;
      q('[data-v="st"]').innerHTML = modo === "res" ? "<b>Ressonância paramétrica 2 : 1.</b> A mola foi ajustada para oscilar no dobro da frequência do pêndulo. O pêndulo começa quase parado (0,02 rad) e a mola quicando; a energia passa da mola para o pêndulo e volta, de novo e de novo. Mexa em k e veja o efeito sumir." : "O bloco sobe e desce na mola; o pêndulo balança pendurado nele. As duas equações (do TikTok) estão acopladas pelos termos com sen φ e cos φ.";
    }
    let t0 = performance.now();
    function loop(t) { if (!vivo) return; const dt = Math.min(0.03, (t - t0) / 1000); t0 = t; if (!pausa) { if (!E0 || tempo === 0) E0 = E(s); for (let k = 0; k < 30; k++) s = rk4(f, s, dt / 30); tempo += dt; hist.push([tempo, s[0] - x0(), s[2]]); hist = hist.filter((h) => h[0] > tempo - 15); } desenha(); requestAnimationFrame(loop); }
    el.querySelectorAll("[data-c]").forEach((r) => r.addEventListener("input", () => { p[r.dataset.c] = +r.value; E0 = 0; inicia("sol"); }));
    q('[data-a="res"]').addEventListener("click", () => { E0 = 0; inicia("res"); }); q('[data-a="sol"]').addEventListener("click", () => { E0 = 0; inicia("sol"); }); q('[data-a="caos"]').addEventListener("click", () => { E0 = 0; inicia("caos"); });
    q('[data-a="pausa"]').addEventListener("click", (ev) => { pausa = !pausa; ev.currentTarget.setAttribute("aria-pressed", pausa); });
    inicia("res"); requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };

  /* ---------- EP05: como uma carga irradia (linhas de campo com "dobra") ----------
     Aproximação não relativística (v ≪ c): a parte da linha de campo a uma distância c(t − t_r) do ponto de emissão
     aponta radialmente a partir da posição que a carga TERIA se seguisse com a velocidade de t_r. Onde houve aceleração, aparece a dobra. */
  /* nome: "Linhas de campo de uma carga acelerada" · matéria: Física · tema: EP05 */
  SIM.radiacao = (el, F) => {
    const W = 760, H = 440; const [cv, cx] = canvas(el, W, H);
    el.insertAdjacentHTML("beforeend", `<div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="bts" style="grid-column:1/-1">${[["parada", "Parada"], ["const", "Velocidade constante"], ["freada", "Freada brusca"], ["osc", "Oscilando (antena)"]].map(([k, t], i) => `<button class="bt peq" data-m="${k}" aria-pressed="${i === 2}">${t}</button>`).join("")}<button class="bt peq" data-a="re">↺ Recomeçar</button></div>
      <div class="ctrl"><label>velocidade máxima (fração de c)</label><input type="range" min="0.1" max="0.6" step="0.05" value="0.4" data-c="v"><output></output></div></div>
      <div class="status" data-v="st"></div>`);
    const c = 110, N = 18; let modo = "freada", vmax = 0.4, t = 0, vivo = true;
    const q = (x) => el.querySelector(x);
    // trajetória: posição e velocidade (px, px/s) em função do tempo
    function traj(tt) {
      const v = vmax * c;
      if (modo === "parada") return [380, 0];
      if (modo === "const") return [200 + v * tt, v];
      if (modo === "freada") { const tf = 3, td = 0.25; if (tt < tf) return [140 + v * tt, v]; if (tt < tf + td) { const u = tt - tf; return [140 + v * tf + v * u - (v / (2 * td)) * u * u, v - (v / td) * u]; } return [140 + v * tf + (v * td) / 2, 0]; }
      const w = 2.2, A = v / w; return [380 + A * Math.sin(w * tt), A * w * Math.cos(w * tt)];
    }
    function desenha() {
      cx.clearRect(0, 0, W, H); const ink2 = cssv("--ink2"), y0 = H / 2;
      for (let i = 0; i < N; i++) {
        const th = (2 * Math.PI * (i + 0.5)) / N, nx = Math.cos(th), ny = Math.sin(th), pts = [];
        for (let tr = t; tr > t - 9; tr -= 0.02) { const [xr, vr] = traj(Math.max(tr, -50)), d = c * (t - tr), xe = xr + vr * (t - tr); pts.push([xe + d * nx, y0 + d * ny]); if (d > 520) break; }
        linha(cx, pts, ink2, 1.3);
      }
      cx.strokeStyle = "rgba(232,176,75,.35)"; cx.setLineDash([4, 6]); const [xa] = traj(modo === "freada" ? 3 : 0);
      if (modo === "freada" && t > 3) { cx.beginPath(); cx.arc(xa, y0, c * (t - 3), 0, 7); cx.stroke(); }
      cx.setLineDash([]);
      const [xq] = traj(t); cx.fillStyle = "#ef5b5b"; cx.beginPath(); cx.arc(xq, y0, 9, 0, 7); cx.fill(); cx.fillStyle = "#fff"; cx.font = "700 12px Inter"; cx.textAlign = "center"; cx.fillText("+", xq, y0 + 4); cx.textAlign = "start";
      q("output").textContent = F.t(vmax, 2) + " c";
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>t</small><b>${F.t(t, 1)} s</b></div><div class="vis"><small>c (na tela)</small><b>${c} px/s</b></div>`;
      q('[data-v="st"]').innerHTML = { parada: "Carga parada: linhas radiais, campo de Coulomb. Nada se propaga.", const: "Velocidade constante: as linhas continuam retas, saindo da posição <b>atual</b>. Uma carga em movimento uniforme não irradia (num referencial que anda com ela, ela está parada).", freada: "<b>Freada brusca:</b> dentro do círculo tracejado (raio c·Δt desde a freada), as linhas já \"sabem\" que a carga parou; fora, ainda apontam para onde ela estaria. A ligação entre as duas regiões é a <b>dobra</b>: um pulso de campo transversal que se afasta à velocidade da luz. Isso é radiação (raios X de freamento, \"bremsstrahlung\").", osc: "<b>Carga oscilando</b> (uma antena): ela gera dobras sem parar, que formam uma onda. As dobras são mais fortes perpendicularmente ao movimento (sen θ) e somem na direção do movimento." }[modo] + ' <span style="color:var(--ink3)">(Visualização aproximada, válida para v ≪ c.)</span>';
    }
    let t0 = performance.now();
    function loop(tt) { if (!vivo) return; const dt = Math.min(0.04, (tt - t0) / 1000); t0 = tt; t += dt; if ((modo === "freada" || modo === "const") && t > 9) t = 0; desenha(); requestAnimationFrame(loop); }
    el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { modo = b.dataset.m; t = 0; el.querySelectorAll("[data-m]").forEach((x) => x.setAttribute("aria-pressed", x === b)); }));
    q('[data-a="re"]').addEventListener("click", () => (t = 0)); q("input").addEventListener("input", (ev) => { vmax = +ev.target.value; t = 0; });
    requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };

  /* ---------- EP06: ímã caindo num tubo condutor ----------
     m dv/dt = mg − b v, com b = 45 μ0² μ² σ w / (1024 a⁴) (dipolo pontual, tubo de parede fina). */
  /* nome: "Ímã caindo: PVC × metal" · matéria: Física · tema: EP06 */
  SIM.imaTubo = (el, F) => {
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 340 420" width="340" class="cena"></svg><svg viewBox="0 0 340 300" width="340" class="gr"></svg></div>
      <div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="bts">${[["cobre", "Cobre"], ["aluminio", "Alumínio"], ["latao", "Latão"]].map(([k, t], i) => `<button class="bt peq" data-m="${k}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div>
      <div class="ctrl"><label>espessura da parede</label><input type="range" min="0.5" max="3" step="0.1" value="1" data-c="w"><output data-o="w"></output></div>
      <div class="bts"><button class="bt peq pri" data-a="soltar">⬇ Soltar os dois ímãs</button></div></div>
      <div class="status">À esquerda, tubo de PVC (isolante); à direita, tubo de metal. Mesmos ímãs (neodímio, 7,5 g, 1 cm). Em vermelho, os anéis de corrente induzida abaixo do ímã (repelem); em azul, acima (atraem). <span style="color:var(--ink3)">Modelo: dipolo pontual e parede fina (fórmula de b no texto).</span></div>`);
    const MAT = { cobre: 5.96e7, aluminio: 3.77e7, latao: 1.5e7 }; let mat = "cobre", w = 1e-3, vivo = true;
    const mass = 7.5e-3, mu = 1.3e-6 / (4e-7 * Math.PI), a = 8e-3, Ltubo = 1.0, MU0 = 4e-7 * Math.PI;
    const b = () => (45 * MU0 * MU0 * mu * mu * MAT[mat] * w) / (1024 * Math.pow(a, 4));
    let A = { y: 0, v: 0 }, P = { y: 0, v: 0 }, t = 0, hist = [], rodando = false;
    const q = (x) => el.querySelector(x);
    function desenha() {
      const sy = (y) => 30 + (y / Ltubo) * 360, vt = (mass * 9.8) / b();
      let g = "";
      [[80, "PVC", "var(--ink3)"], [250, mat, "#c98a4a"]].forEach(([x, n, cor]) => (g += `<rect x="${x - 22}" y="30" width="44" height="360" rx="4" style="fill:none;stroke:${cor};stroke-width:4"/>${D.txt(x, 410, n, "tx2")}`));
      const ima = (x, y) => `<rect x="${x - 12}" y="${sy(y) - 12}" width="24" height="12" style="fill:#ef5b5b"/><rect x="${x - 12}" y="${sy(y)}" width="24" height="12" style="fill:#4f8dff"/>`;
      g += ima(80, P.y) + ima(250, A.y);
      if (rodando && A.y < Ltubo) { const al = Math.min(1, A.v / vt); g += `<ellipse cx="250" cy="${sy(A.y) + 26}" rx="22" ry="6" style="fill:none;stroke:#ef5b5b;stroke-width:3;opacity:${al}"/><ellipse cx="250" cy="${sy(A.y) - 26}" rx="22" ry="6" style="fill:none;stroke:#4f8dff;stroke-width:3;opacity:${al}"/>`; }
      q(".cena").innerHTML = g;
      const x0 = 40, y0 = 260, gw = 280, gh = 220, Tm = Math.max(1, Ltubo / vt * 1.05), vm = vt * 1.5;
      const path = (k) => hist.map((h, i) => (i ? "L" : "M") + (x0 + (h[0] / Tm) * gw).toFixed(1) + " " + (y0 - (Math.min(h[k], vm * 1.08) / vm) * gh).toFixed(1)).join("");
      q(".gr").innerHTML = `<line x1="${x0}" y1="${y0}" x2="${x0 + gw}" y2="${y0}" class="ln2"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="30" class="ln2"/><line x1="${x0}" y1="${y0 - (vt / vm) * gh}" x2="${x0 + gw}" y2="${y0 - (vt / vm) * gh}" style="stroke:#c98a4a;stroke-dasharray:4 4"/>${D.txt(x0 + gw, y0 - (vt / vm) * gh - 6, "v terminal", "tx2", "end")}<path d="${path(1)}" style="fill:none;stroke:var(--ink3);stroke-width:2"/><path d="${path(2)}" style="fill:none;stroke:#c98a4a;stroke-width:2.4"/>${D.txt(x0, 22, "v (escala do metal; o PVC sai por cima)", "tx2", "start")}${D.txt(x0 + gw, y0 + 18, "t (s)", "tx2", "end")}`;
      q('[data-o="w"]').textContent = F.t(w * 1000, 1) + " mm";
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>b (amortecimento)</small><b>${F.t(b(), 2)} N·s/m</b></div><div class="vis"><small>v terminal = mg/b</small><b>${F.t(vt * 100, 1)} cm/s</b></div><div class="vis"><small>tempo no tubo de 1 m</small><b>${F.t(Ltubo / vt, 1)} s (PVC: 0,45 s)</b></div><div class="vis"><small>calor b·v² na terminal</small><b>${F.t(b() * vt * vt * 1000, 1)} mW</b></div>`;
    }
    let t0 = performance.now();
    function loop(tt) {
      if (!vivo) return; const dt = Math.min(0.03, (tt - t0) / 1000); t0 = tt;
      if (rodando) { for (let k = 0; k < 40; k++) { const h = dt / 40; if (A.y < Ltubo) { A.v += (9.8 - (b() / mass) * A.v) * h; A.y += A.v * h; } if (P.y < Ltubo) { P.v += 9.8 * h; P.y += P.v * h; } } t += dt; hist.push([t, Math.min(P.v, 99), A.v]); if (A.y >= Ltubo && P.y >= Ltubo) rodando = false; }
      desenha(); requestAnimationFrame(loop);
    }
    const solta = () => { A = { y: 0, v: 0 }; P = { y: 0, v: 0 }; t = 0; hist = []; rodando = true; };
    el.querySelectorAll("[data-m]").forEach((x) => x.addEventListener("click", () => { mat = x.dataset.m; el.querySelectorAll("[data-m]").forEach((y) => y.setAttribute("aria-pressed", y === x)); solta(); }));
    q('[data-c="w"]').addEventListener("input", (ev) => { w = +ev.target.value / 1000; solta(); });
    q('[data-a="soltar"]').addEventListener("click", solta);
    solta(); requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };

  /* ---------- EP07: conta num fio horizontal atraída por uma carga abaixo (exercício do professor) ----------
     F_x = −k q1 q2 x / (d² + x²)^{3/2}  ≈  −(k q1 q2 / d³) x  para x ≪ d. */
  /* nome: "Conta no fio: exato × MHS" · matéria: Física · tema: EP07 */
  SIM.profMHS = (el, F) => {
    const W = 760, H = 380; const [cv, cx] = canvas(el, W, H);
    el.insertAdjacentHTML("beforeend", `<div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="ctrl"><label>distância d</label><input type="range" min="5" max="30" step="0.5" value="10" data-c="d"><output data-o="d"></output></div>
      <div class="ctrl"><label>amplitude inicial x₀</label><input type="range" min="0.5" max="30" step="0.5" value="2" data-c="A"><output data-o="A"></output></div>
      <div class="bts"><button class="bt peq" data-a="fant" aria-pressed="true">Fantasma: MHS (x ≪ d)</button><button class="bt peq" data-a="re">↺ Soltar de novo</button></div></div>
      <div class="status" data-v="st"></div>`);
    const K = 8.99e9, q1 = 1e-6, q2 = 1e-6, m = 1e-3; let d = 0.1, A = 0.02, s = [0.02, 0], sf = [0.02, 0], fant = true, t = 0, hist = [], cruz = [], vivo = true;
    const q = (x) => el.querySelector(x);
    const w0 = () => Math.sqrt((K * q1 * q2) / (m * d ** 3));
    const fex = ([x, v]) => [v, (-K * q1 * q2 * x) / (m * Math.pow(d * d + x * x, 1.5))], fap = ([x, v]) => [v, -(w0() ** 2) * x];
    function reset() { s = [A, 0]; sf = [A, 0]; t = 0; hist = []; cruz = []; }
    function desenha() {
      cx.clearRect(0, 0, W, H); const ink = cssv("--ink"), ink3 = cssv("--ink3"), mod = cssv("--mod") || "#5b9cf5";
      const esc = 6 / 0.01, cx0 = 230, yf = 70, yq = yf + Math.min(260, d * 1000 * 0.9);
      cx.strokeStyle = ink3; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(20, yf); cx.lineTo(440, yf); cx.stroke();
      cx.setLineDash([3, 4]); cx.beginPath(); cx.moveTo(cx0, yf); cx.lineTo(cx0, yq); cx.stroke(); cx.setLineDash([]);
      cx.fillStyle = cssv("--ink2"); cx.font = "italic 15px Lora"; cx.fillText("d", cx0 + 8, (yf + yq) / 2);
      cx.fillStyle = "#4f8dff"; cx.beginPath(); cx.arc(cx0, yq, 11, 0, 7); cx.fill(); cx.fillStyle = "#fff"; cx.font = "700 12px Inter"; cx.textAlign = "center"; cx.fillText("−", cx0, yq + 4);
      const X = cx0 + s[0] * 1000 * 6;
      if (fant) { cx.fillStyle = "rgba(150,160,180,.4)"; cx.beginPath(); cx.arc(cx0 + sf[0] * 6000, yf, 10, 0, 7); cx.fill(); }
      cx.strokeStyle = "rgba(232,176,75,.6)"; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(X, yf); cx.lineTo(cx0, yq); cx.stroke();
      cx.fillStyle = "#ef5b5b"; cx.beginPath(); cx.arc(X, yf, 10, 0, 7); cx.fill(); cx.fillStyle = "#fff"; cx.fillText("+", X, yf + 4); cx.textAlign = "start";
      // gráfico
      const gx = 470, gy = 190, gw = 270, T = 0.4, mA = Math.max(...hist.map((h) => Math.max(Math.abs(h[1]), Math.abs(h[2]))), 1e-4);
      cx.strokeStyle = cssv("--line"); cx.beginPath(); cx.moveTo(gx, gy); cx.lineTo(gx + gw, gy); cx.stroke(); cx.fillStyle = cssv("--ink2"); cx.font = "12px Inter"; cx.fillText("x(t): exato (cor) × MHS (cinza)", gx, 40);
      const px = (h, k) => [gx + ((h[0] - Math.max(0, t - T)) / T) * gw, gy - (h[k] / mA) * 120];
      if (fant) linha(cx, hist.map((h) => px(h, 2)), "rgba(150,160,180,.6)"); linha(cx, hist.map((h) => px(h, 1)), mod, 2);
      const Tm = cruz.length > 1 ? (cruz[cruz.length - 1] - cruz[0]) / (cruz.length - 1) : null;
      q('[data-o="d"]').textContent = F.t(d * 100, 1) + " cm"; q('[data-o="A"]').textContent = F.t(A * 100, 1) + " cm";
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>ω = √(kq₁q₂/md³)</small><b>${F.t(w0(), 1)} rad/s</b></div><div class="vis"><small>T (MHS)</small><b>${F.t((2 * Math.PI) / w0() * 1000, 1)} ms</b></div><div class="vis"><small>T medido (exato)</small><b>${Tm ? F.t(Tm * 1000, 1) + " ms" : "…"}</b></div><div class="vis"><small>x₀/d</small><b>${F.t(A / d, 2)}</b></div>`;
      q('[data-v="st"]').innerHTML = `Cargas de 1 µC, conta de 1 g, câmera lenta ×10. ${A / d < 0.2 ? "Com x₀ ≪ d, o exato e o MHS ficam praticamente juntos." : "<b>x₀ não é pequeno perto de d:</b> a força real cresce menos que linearmente (o fator (d² + x²)^(3/2) aumenta), o período fica maior e o movimento deixa de ser senoidal."}`;
    }
    let t0 = performance.now();
    function loop(tt) { if (!vivo) return; const dt = Math.min(0.03, (tt - t0) / 1000) / 10; t0 = tt; for (let k = 0; k < 20; k++) { const prev = s[0]; s = rk4(fex, s, dt / 20); sf = rk4(fap, sf, dt / 20); t += dt / 20; if (prev < 0 && s[0] >= 0) cruz.push(t); } hist.push([t, s[0], sf[0]]); hist = hist.filter((h) => h[0] > t - 0.4); desenha(); requestAnimationFrame(loop); }
    el.querySelectorAll("[data-c]").forEach((r) => r.addEventListener("input", () => { if (r.dataset.c === "d") d = +r.value / 100; else A = +r.value / 100; reset(); }));
    q('[data-a="fant"]').addEventListener("click", (ev) => { fant = !fant; ev.currentTarget.setAttribute("aria-pressed", fant); });
    q('[data-a="re"]').addEventListener("click", reset);
    reset(); requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };

  /* ---------- EP03: pêndulo triplo (forma matricial geral do pêndulo de n elos) ----------
     Σ_j M_ij cos(θi−θj) ℓiℓj θ̈j = −Σ_j M_ij ℓiℓj sen(θi−θj) θ̇j² − g ℓi sen θi Σ_{k≥i} m_k,  M_ij = Σ_{k≥max(i,j)} m_k */
  /* nome: "Pêndulo triplo" · matéria: Física · tema: EP03 */
  SIM.penduloTriplo = (el, F) => {
    const W = 760, H = 560; const [cv, cx] = canvas(el, W, H);
    el.insertAdjacentHTML("beforeend", `<div class="leitor" data-v="l"></div><div class="ctrls"><div class="bts" style="grid-column:1/-1">
      <button class="bt peq" data-a="gemeo" aria-pressed="true">Gêmeo (0,001 rad)</button><button class="bt peq" data-a="caos">Caos</button><button class="bt peq" data-a="modo">Modo normal mais lento</button><button class="bt peq" data-a="pausa">⏸ Pausar</button></div></div>
      <div class="status"><b>Arraste</b> qualquer uma das três massas para mudar a posição inicial. Três massas de 1 kg, fios de 1 m (escala da tela). A energia total é conservada; o resto é imprevisível.</div>`);
    const n = 3, mm = [1, 1, 1], ll = [1, 1, 1], g = 9.8; let s = [2.4, 2.6, 2.9, 0, 0, 0], sg = null, gemeo = true, pausa = false, vivo = true, arr = -1, tr = [], tempo = 0, E0 = 0, dist = [];
    const q = (x) => el.querySelector(x);
    const Mij = (i, j) => { let s2 = 0; for (let k = Math.max(i, j); k < n; k++) s2 += mm[k]; return s2; };
    const f = (st) => { const th = st.slice(0, n), w = st.slice(n), A = [], b = [];
      for (let i = 0; i < n; i++) { A.push([]); let bi = 0; for (let j = 0; j < n; j++) { A[i].push(Mij(i, j) * ll[i] * ll[j] * Math.cos(th[i] - th[j])); bi -= Mij(i, j) * ll[i] * ll[j] * Math.sin(th[i] - th[j]) * w[j] * w[j]; } bi -= g * ll[i] * Math.sin(th[i]) * Mij(i, i); b.push(bi); }
      return [...w, ...resolve(A, b)]; };
    const energia = (st) => { let T = 0, V = 0, vx = 0, vy = 0, y = 0; for (let i = 0; i < n; i++) { vx += ll[i] * Math.cos(st[i]) * st[n + i]; vy += ll[i] * Math.sin(st[i]) * st[n + i]; y -= ll[i] * Math.cos(st[i]); T += 0.5 * mm[i] * (vx * vx + vy * vy); V += mm[i] * g * y; } return T + V; };
    const ox = 380, oy = 280, esc = 88; // raio total 3·88 = 264 px: cabe girando em qualquer direção
    const pts = (st) => { let x = ox, y = oy; const p = []; for (let i = 0; i < n; i++) { x += ll[i] * esc * Math.sin(st[i]); y += ll[i] * esc * Math.cos(st[i]); p.push([x, y]); } return p; };
    function inicia(a) { s = [...a, 0, 0, 0]; sg = [a[0] + 0.001, a[1], a[2], 0, 0, 0]; tr = []; tempo = 0; dist = []; E0 = energia(s); }
    function desenha() {
      cx.clearRect(0, 0, W, H); const ink = cssv("--ink"), cores = [cssv("--mA"), cssv("--mU"), cssv("--mC")];
      for (let i = 1; i < tr.length; i++) { cx.strokeStyle = `rgba(232,176,75,${(i / tr.length) * 0.8})`; cx.lineWidth = 1.3; cx.beginPath(); cx.moveTo(...tr[i - 1]); cx.lineTo(...tr[i]); cx.stroke(); }
      const bob = (st, cor, al) => { const p = pts(st); cx.globalAlpha = al; cx.strokeStyle = ink; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(ox, oy); p.forEach((q2) => cx.lineTo(...q2)); cx.stroke(); p.forEach((q2, i) => { cx.fillStyle = cor || cores[i]; cx.beginPath(); cx.arc(q2[0], q2[1], 11, 0, 7); cx.fill(); }); cx.globalAlpha = 1; };
      if (gemeo && sg) bob(sg, "rgb(150,160,180)", 0.45); bob(s, null, 1);
      cx.fillStyle = cssv("--ink3"); cx.fillRect(ox - 40, oy - 5, 80, 5);
      if (gemeo && dist.length > 1) { const gx = 14, gy = 550, gw = 150, gh = 70; cx.strokeStyle = cssv("--line"); cx.strokeRect(gx, gy - gh, gw, gh); cx.strokeStyle = cssv("--warn"); cx.beginPath(); dist.forEach(([t, d2], i) => { const X = gx + (t / Math.max(20, tempo)) * gw, Y = gy - ((Math.log10(Math.max(d2, 1e-4)) + 4) / 4.5) * gh; i ? cx.lineTo(X, Y) : cx.moveTo(X, Y); }); cx.stroke(); cx.fillStyle = cssv("--ink2"); cx.font = "12px Inter"; cx.fillText("separação dos gêmeos (log)", gx, gy - gh - 6); }
      const E = energia(s); q('[data-v="l"]').innerHTML = `<div class="vis"><small>t</small><b>${F.t(tempo, 1)} s</b></div><div class="vis"><small>energia</small><b>${F.t(E, 4)} J</b></div><div class="vis"><small>erro relativo de E</small><b>${F.t(Math.abs((E - E0) / E0) * 100, 5)}%</b></div>`;
    }
    let t0 = performance.now();
    function loop(t) { if (!vivo) return; const dt = Math.min(0.03, (t - t0) / 1000); t0 = t;
      if (!pausa && arr < 0) { for (let k = 0; k < 50; k++) { s = rk4(f, s, dt / 50); if (gemeo) sg = rk4(f, sg, dt / 50); } tempo += dt; const p = pts(s); tr.push(p[2]); if (tr.length > 450) tr.shift(); if (gemeo) { const pg = pts(sg); dist.push([tempo, Math.hypot(p[2][0] - pg[2][0], p[2][1] - pg[2][1]) / esc]); } }
      desenha(); requestAnimationFrame(loop); }
    const pos = (ev) => { const r = cv.getBoundingClientRect(); return [((ev.clientX - r.left) * W) / r.width, ((ev.clientY - r.top) * H) / r.height]; };
    cv.addEventListener("pointerdown", (ev) => { const [x, y] = pos(ev); const p = pts(s); arr = p.findIndex((q2) => Math.hypot(q2[0] - x, q2[1] - y) < 22); if (arr >= 0) cv.setPointerCapture(ev.pointerId); });
    cv.addEventListener("pointermove", (ev) => { if (arr < 0) return; const [x, y] = pos(ev); const p = pts(s), base = arr ? p[arr - 1] : [ox, oy]; const a = s.slice(0, 3); a[arr] = Math.atan2(x - base[0], y - base[1]); inicia(a); });
    cv.addEventListener("pointerup", () => (arr = -1));
    q('[data-a="gemeo"]').addEventListener("click", (ev) => { gemeo = !gemeo; ev.currentTarget.setAttribute("aria-pressed", gemeo); inicia(s.slice(0, 3)); });
    q('[data-a="caos"]').addEventListener("click", () => inicia([2.4, 2.6, 2.9]));
    // modo normal mais lento (m, ℓ iguais): ω² = 0,4158 g/ℓ, autovetor (1 ; 1,2921 ; 1,6312) (numpy)
    q('[data-a="modo"]').addEventListener("click", () => inicia([0.05, 0.05 * 1.2921, 0.05 * 1.6312]));
    q('[data-a="pausa"]').addEventListener("click", (ev) => { pausa = !pausa; ev.currentTarget.setAttribute("aria-pressed", pausa); });
    inicia([2.4, 2.6, 2.9]); requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };
})();

/* ---------- EP08: duas massas e três molas (parede–k–m–k_c–m–k–parede) ----------
   m ẍ1 = −k x1 − k_c (x1 − x2) ;  m ẍ2 = −k x2 − k_c (x2 − x1).  Solução exata (soltas do repouso):
   x1 = ½(A+B) cos ω1 t + ½(A−B) cos ω2 t ;  x2 = ½(A+B) cos ω1 t − ½(A−B) cos ω2 t ;  ω1 = √(k/m), ω2 = √((k+2k_c)/m) */
(function () {
  const SIM = window.SIM;
  const cssv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  /* nome: "Duas massas e três molas" · matéria: Física · tema: EP08 */
  SIM.duasMolas = (el, F) => {
    const W = 760, H = 400;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><canvas width="${W * 2}" height="${H * 2}" style="width:${W}px;height:${H}px;border-radius:8px;background:var(--bg);touch-action:none"></canvas></div>
      <div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="ctrl"><label>k (molas das pontas)</label><input type="range" min="2" max="40" step="0.5" value="10" data-c="k"><output data-o="k"></output></div>
      <div class="ctrl"><label>k_c (mola do meio)</label><input type="range" min="0" max="40" step="0.5" value="1.5" data-c="kc"><output data-o="kc"></output></div>
      <div class="ctrl"><label>m</label><input type="range" min="0.2" max="3" step="0.1" value="1" data-c="m"><output data-o="m"></output></div>
      <div class="bts"><button class="bt peq" data-a="m1">Modo 1 (juntas)</button><button class="bt peq" data-a="m2">Modo 2 (opostas)</button><button class="bt peq pri" data-a="bat">Batimento (só a 1ª deslocada)</button></div></div>
      <div class="status"><b>Arraste</b> qualquer massa para escolher o deslocamento inicial (elas partem do repouso). As curvas finas tracejadas são a fórmula exata x₁(t), x₂(t); as grossas, a simulação: ficam uma em cima da outra.</div>`);
    const cv = el.querySelector("canvas"), cx = cv.getContext("2d"); cx.scale(2, 2);
    const p = { k: 10, kc: 1.5, m: 1 }; let A = 0.3, B = 0, s = [0.3, 0, 0, 0], t = 0, hist = [], arr = -1, vivo = true;
    const q = (x) => el.querySelector(x);
    const w1 = () => Math.sqrt(p.k / p.m), w2 = () => Math.sqrt((p.k + 2 * p.kc) / p.m);
    const exato = (tt) => [0.5 * (A + B) * Math.cos(w1() * tt) + 0.5 * (A - B) * Math.cos(w2() * tt), 0.5 * (A + B) * Math.cos(w1() * tt) - 0.5 * (A - B) * Math.cos(w2() * tt)];
    const f = ([x1, x2, v1, v2]) => [v1, v2, (-p.k * x1 - p.kc * (x1 - x2)) / p.m, (-p.k * x2 - p.kc * (x2 - x1)) / p.m];
    const rk = (st, h) => { const k1 = f(st), k2 = f(st.map((v, i) => v + (h / 2) * k1[i])), k3 = f(st.map((v, i) => v + (h / 2) * k2[i])), k4 = f(st.map((v, i) => v + h * k3[i])); return st.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); };
    const inicia = (a, b) => { A = a; B = b; s = [a, b, 0, 0]; t = 0; hist = []; };
    const PX = 300, X1 = 260, X2 = 500, Y = 90;
    function mola(xa, xb, y, nv, cor) { cx.strokeStyle = cor; cx.lineWidth = 1.8; cx.beginPath(); cx.moveTo(xa, y); const n = nv, L = xb - xa; for (let i = 1; i < n; i++) cx.lineTo(xa + (L * i) / n, y + (i % 2 ? -10 : 10)); cx.lineTo(xb, y); cx.stroke(); }
    function desenha() {
      cx.clearRect(0, 0, W, H); const ink = cssv("--ink"), ink3 = cssv("--ink3"), mod = cssv("--mod") || "#43b8a6", warn = cssv("--warn");
      cx.fillStyle = ink3; cx.fillRect(40, Y - 40, 10, 80); cx.fillRect(W - 50, Y - 40, 10, 80); cx.fillRect(40, Y + 26, W - 80, 3);
      const xa = X1 + s[0] * PX, xb = X2 + s[1] * PX;
      mola(50, xa - 22, Y, 14, ink); mola(xa + 22, xb - 22, Y, 14, warn); mola(xb + 22, W - 50, Y, 14, ink);
      [[xa, mod], [xb, cssv("--mA")]].forEach(([x, c]) => { cx.fillStyle = c; cx.fillRect(x - 22, Y - 22, 44, 44); });
      cx.fillStyle = cssv("--ink2"); cx.font = "13px Inter"; cx.fillText("k", 120, Y - 18); cx.fillText("k_c", (xa + xb) / 2 - 8, Y - 18); cx.fillText("k", W - 140, Y - 18);
      // gráficos
      const gx = 60, gw = 660, T = 20, gy1 = 210, gy2 = 330, sc = 100;
      cx.strokeStyle = cssv("--line"); [gy1, gy2].forEach((y) => { cx.beginPath(); cx.moveTo(gx, y); cx.lineTo(gx + gw, y); cx.stroke(); });
      cx.fillStyle = cssv("--ink2"); cx.fillText("x₁(t)", 14, gy1 + 4); cx.fillText("x₂(t)", 14, gy2 + 4);
      const X = (tt) => gx + ((tt - Math.max(0, t - T)) / T) * gw;
      [[1, gy1, mod], [2, gy2, cssv("--mA")]].forEach(([k, y0, c]) => {
        cx.strokeStyle = c; cx.lineWidth = 3; cx.beginPath(); hist.forEach((h, i) => (i ? cx.lineTo(X(h[0]), y0 - h[k] * sc) : cx.moveTo(X(h[0]), y0 - h[k] * sc))); cx.stroke();
        cx.strokeStyle = ink; cx.lineWidth = 1; cx.setLineDash([3, 4]); cx.beginPath(); hist.forEach((h, i) => { const e = exato(h[0])[k - 1]; i ? cx.lineTo(X(h[0]), y0 - e * sc) : cx.moveTo(X(h[0]), y0 - e * sc); }); cx.stroke(); cx.setLineDash([]);
      });
      ["k", "kc", "m"].forEach((k) => (q(`[data-o="${k}"]`).textContent = F.t(p[k], 1) + (k === "m" ? " kg" : " N/m")));
      const Tb = p.kc > 0 ? (2 * Math.PI) / (w2() - w1()) : Infinity;
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>ω₁ = √(k/m)</small><b>${F.t(w1(), 3)} rad/s</b></div><div class="vis"><small>ω₂ = √((k+2k_c)/m)</small><b>${F.t(w2(), 3)} rad/s</b></div><div class="vis"><small>período do batimento 2π/(ω₂−ω₁)</small><b>${isFinite(Tb) ? F.t(Tb, 2) + " s" : "∞"}</b></div><div class="vis"><small>erro simulação × fórmula</small><b>${F.t(Math.abs(s[0] - exato(t)[0]) * 1000, 4)} mm</b></div>`;
    }
    let t0 = performance.now();
    function loop(tt) { if (!vivo) return; const dt = Math.min(0.03, (tt - t0) / 1000); t0 = tt; if (arr < 0) { for (let k = 0; k < 20; k++) s = rk(s, dt / 20); t += dt; hist.push([t, s[0], s[1]]); hist = hist.filter((h) => h[0] > t - 20); } desenha(); requestAnimationFrame(loop); }
    const pos = (ev) => { const r = cv.getBoundingClientRect(); return [((ev.clientX - r.left) * W) / r.width, ((ev.clientY - r.top) * H) / r.height]; };
    cv.addEventListener("pointerdown", (ev) => { const [x, y] = pos(ev); if (Math.abs(y - Y) > 30) return; const xa = X1 + s[0] * PX, xb = X2 + s[1] * PX; arr = Math.abs(x - xa) < 30 ? 0 : Math.abs(x - xb) < 30 ? 1 : -1; if (arr >= 0) cv.setPointerCapture(ev.pointerId); });
    cv.addEventListener("pointermove", (ev) => { if (arr < 0) return; const [x] = pos(ev); const d = Math.max(-0.5, Math.min(0.5, (x - (arr ? X2 : X1)) / PX)); if (arr === 0) inicia(d, s[1]); else inicia(s[0], d); });
    cv.addEventListener("pointerup", () => (arr = -1));
    el.querySelectorAll("[data-c]").forEach((r) => r.addEventListener("input", () => { p[r.dataset.c] = +r.value; inicia(A, B); }));
    q('[data-a="m1"]').addEventListener("click", () => inicia(0.25, 0.25)); q('[data-a="m2"]').addEventListener("click", () => inicia(0.25, -0.25)); q('[data-a="bat"]').addEventListener("click", () => inicia(0.3, 0));
    inicia(0.3, 0); requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };
})();
