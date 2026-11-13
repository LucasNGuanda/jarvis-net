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
  SIM.jogoLorentz = (el, F) => {
    const W = 760, H = 420; const [cv, cx] = canvas(el, W, H);
    el.insertAdjacentHTML("beforeend", `<div class="leitor" data-v="l"></div><div class="ctrls">
      <div class="ctrl"><label>B (saindo + / entrando −)</label><input type="range" min="-3" max="3" step="0.05" value="1" data-c="B"><output data-o="B"></output></div>
      <div class="ctrl"><label>velocidade v</label><input type="range" min="60" max="400" step="5" value="200" data-c="v"><output data-o="v"></output></div>
      <div class="ctrl" data-s="E"><label>campo E (para baixo)</label><input type="range" min="0" max="600" step="5" value="0" data-c="E"><output data-o="E"></output></div>
      <div class="bts"><button class="bt peq" data-a="q" aria-pressed="false">Carga negativa</button><button class="bt peq pri" data-a="fogo">🚀 Disparar</button><button class="bt peq" data-a="prev" aria-pressed="false">Mostrar a trajetória prevista (cola)</button></div></div>
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
          if (bate(bala.x, bala.y) || bala.t > 10) { const todos = acertos.size === lv().alvos.length; msg = todos ? "🎯 Acertou!" : "Errou. Ajuste e tente de novo."; if (todos && nv < NIVEIS.length - 1) setTimeout(() => { nv++; acertos = new Set(); bala = null; msg = "Próximo nível!"; }, 900); else if (todos) msg = "🏆 Zerou o jogo! Agora tente de cabeça, sem a cola."; bala = null; } } }
      desenha(); requestAnimationFrame(loop);
    }
    el.querySelectorAll("[data-c]").forEach((r) => r.addEventListener("input", () => { const k = r.dataset.c, val = +r.value; if (k === "B") B = val; if (k === "v") v = val; if (k === "E") E = val; }));
    q('[data-a="q"]').addEventListener("click", (ev) => { qs = -qs; ev.currentTarget.setAttribute("aria-pressed", qs < 0); });
    q('[data-a="prev"]').addEventListener("click", (ev) => { prev = !prev; ev.currentTarget.setAttribute("aria-pressed", prev); });
    q('[data-a="fogo"]').addEventListener("click", () => { acertos = new Set(); msg = ""; bala = { x: 40, y: 210, vx: v, vy: 0, tr: [[40, 210]], t: 0 }; });
    requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };
})();
