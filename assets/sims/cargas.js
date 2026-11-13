/* Laboratório de cargas (eletrostática 2D de cargas pontuais 3D no plano).
   Unidades: posição em cm (1 cm = PX pixels), carga em µC, k = 8,99e9.
   E = k q r̂ / r²,  V = k q / r,  F = q E.  Linhas de campo integradas por RK4.
   Modos: forças, linhas, vetores, equipotenciais, carga de prova (dinâmica com energia).
   Uso: SIM.cargas(el, F, {cargas:[{x,y,q}], modos:{...}, fixar:false, prova:false}) */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const K = 8.99e9, PX = 10; // 10 px por cm
  SIM.cargas = (el, F, cfg = {}) => {
    const W = 760, H = 420;
    const modos = Object.assign({ forcas: false, linhas: true, vetores: false, equi: false }, cfg.modos || {});
    const presets = cfg.presets || {
      "Duas iguais": [{ x: 26, y: 21, q: 2 }, { x: 50, y: 21, q: 2 }],
      "Dipolo": [{ x: 28, y: 21, q: 2 }, { x: 48, y: 21, q: -2 }],
      "Três cargas": [{ x: 25, y: 28, q: 2 }, { x: 51, y: 28, q: 2 }, { x: 38, y: 10, q: -2 }],
      "+3 e −1": [{ x: 30, y: 21, q: 3 }, { x: 48, y: 21, q: -1 }],
    };
    let cargas = (cfg.cargas || Object.values(presets)[0]).map((c) => ({ ...c }));
    el.insertAdjacentHTML("beforeend", `<div class="palco" style="position:relative"><canvas width="${W * 2}" height="${H * 2}" style="width:${W}px;height:${H}px;cursor:grab;border-radius:8px;background:var(--bg)"></canvas></div>
      <div class="leitor" data-v="leitor"></div>
      <div class="ctrls">
        <div class="bts" style="grid-column:1/-1"><span style="color:var(--ink2);font-size:14px;align-self:center">Mostrar:</span>
          <button class="bt peq" data-m="forcas">Forças</button><button class="bt peq" data-m="linhas">Linhas de campo</button><button class="bt peq" data-m="vetores">Vetores E</button><button class="bt peq" data-m="equi">Equipotenciais</button>
          ${cfg.prova ? `<button class="bt peq" data-a="prova">Soltar carga de prova</button>` : ""}</div>
        <div class="bts" style="grid-column:1/-1"><span style="color:var(--ink2);font-size:14px;align-self:center">Montar:</span>
          ${Object.keys(presets).map((k) => `<button class="bt peq" data-p="${k}">${k}</button>`).join("")}
          <button class="bt peq" data-a="mais">+ carga +</button><button class="bt peq" data-a="menos">+ carga −</button></div>
      </div>
      <div class="status">Arraste as cargas. <b>Clique numa carga</b> para mudar o valor (+1 → +2 → +3 → −1 → −2 → −3). <b>Duplo clique</b> remove. Passe o mouse para ver E e V no ponto.</div>`);
    const cv = el.querySelector("canvas"), cx = cv.getContext("2d");
    cx.scale(2, 2);
    const leitor = el.querySelector('[data-v="leitor"]');
    let mouse = null, arrasto = null, moveu = false, prova = null, esperando = false, sujo = true;
    const cor = () => { const s = getComputedStyle(document.documentElement); const g = (n) => s.getPropertyValue(n).trim(); return { ink: g("--ink"), ink2: g("--ink2"), ink3: g("--ink3"), line: g("--line"), pos: "#ef5b5b", neg: "#4f8dff", mod: g("--mod") || "#c58af0", warn: g("--warn"), bg: g("--bg") }; };

    // campo e potencial (SI) num ponto em cm
    function campo(x, y) {
      let Ex = 0, Ey = 0, V = 0;
      for (const c of cargas) { const dx = (x - c.x) / 100, dy = (y - c.y) / 100, r2 = dx * dx + dy * dy, r = Math.sqrt(r2); if (r < 1e-4) continue; const e = (K * c.q * 1e-6) / r2; Ex += (e * dx) / r; Ey += (e * dy) / r; V += (K * c.q * 1e-6) / r; }
      return { Ex, Ey, V };
    }
    const fmt = (v, u) => { const a = Math.abs(v); if (a >= 1e6) return F.t(v / 1e6, 2) + " M" + u; if (a >= 1e3) return F.t(v / 1e3, 2) + " k" + u; return F.t(v, 2) + " " + u; };

    function linha(x0, y0, sinal) {
      // integra dr/ds = sinal * Ê, passo em cm
      const pts = [[x0, y0]]; let x = x0, y = y0; const h = 0.35;
      const dir = (x, y) => { const e = campo(x, y), m = Math.hypot(e.Ex, e.Ey) || 1; return [(sinal * e.Ex) / m, (sinal * e.Ey) / m]; };
      for (let k = 0; k < 900; k++) {
        const k1 = dir(x, y), k2 = dir(x + (h / 2) * k1[0], y + (h / 2) * k1[1]), k3 = dir(x + (h / 2) * k2[0], y + (h / 2) * k2[1]), k4 = dir(x + h * k3[0], y + h * k3[1]);
        x += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
        pts.push([x, y]);
        if (x < -5 || y < -5 || x > W / PX + 5 || y > H / PX + 5) break;
        if (cargas.some((c) => Math.sign(c.q) === -sinal && Math.hypot(x - c.x, y - c.y) < 0.8)) break;
      }
      return pts;
    }

    let fundo = null; // cache das equipotenciais
    function desenhaEqui(C) {
      const s = 3, nx = Math.ceil(W / s), ny = Math.ceil(H / s);
      const img = cx.createImageData(nx, ny);
      const Vs = new Float32Array(nx * ny);
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) Vs[j * nx + i] = campo((i * s) / PX, (j * s) / PX).V;
      const nivel = (v) => Math.sign(v) * Math.floor(Math.log(1 + Math.abs(v) / 2e4) / 0.35);
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const v = Vs[j * nx + i], n = nivel(v), p = 4 * (j * nx + i);
        const borda = (i + 1 < nx && nivel(Vs[j * nx + i + 1]) !== n) || (j + 1 < ny && nivel(Vs[(j + 1) * nx + i]) !== n);
        const a = Math.min(0.55, Math.abs(n) * 0.06);
        const rgb = v > 0 ? [239, 91, 91] : [79, 141, 255];
        if (borda) { img.data[p] = rgb[0]; img.data[p + 1] = rgb[1]; img.data[p + 2] = rgb[2]; img.data[p + 3] = 230; }
        else { img.data[p] = rgb[0]; img.data[p + 1] = rgb[1]; img.data[p + 2] = rgb[2]; img.data[p + 3] = Math.round(255 * a * 0.45); }
      }
      const off = document.createElement("canvas"); off.width = nx; off.height = ny; off.getContext("2d").putImageData(img, 0, 0);
      return off;
    }

    function seta(x1, y1, x2, y2, c, w = 2) {
      const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1); if (L < 2) return;
      cx.strokeStyle = c; cx.fillStyle = c; cx.lineWidth = w; cx.beginPath(); cx.moveTo(x1, y1); cx.lineTo(x2 - 6 * Math.cos(a), y2 - 6 * Math.sin(a)); cx.stroke();
      cx.beginPath(); cx.moveTo(x2, y2); cx.lineTo(x2 - 9 * Math.cos(a - 0.4), y2 - 9 * Math.sin(a - 0.4)); cx.lineTo(x2 - 9 * Math.cos(a + 0.4), y2 - 9 * Math.sin(a + 0.4)); cx.fill();
    }

    function desenha() {
      const C = cor();
      cx.clearRect(0, 0, W, H);
      // grade de 1 cm (fraca) e 5 cm
      cx.lineWidth = 1;
      for (let x = 0; x <= W; x += PX) { cx.strokeStyle = x % (5 * PX) === 0 ? C.line : "rgba(128,128,128,.07)"; cx.beginPath(); cx.moveTo(x + 0.5, 0); cx.lineTo(x + 0.5, H); cx.stroke(); }
      for (let y = 0; y <= H; y += PX) { cx.strokeStyle = y % (5 * PX) === 0 ? C.line : "rgba(128,128,128,.07)"; cx.beginPath(); cx.moveTo(0, y + 0.5); cx.lineTo(W, y + 0.5); cx.stroke(); }
      if (modos.equi) { if (sujo || !fundo) fundo = desenhaEqui(C); cx.imageSmoothingEnabled = true; cx.drawImage(fundo, 0, 0, W, H); }
      sujo = false;
      if (modos.vetores) {
        for (let y = 2; y < H / PX; y += 3) for (let x = 2; x < W / PX; x += 3) {
          const e = campo(x, y), m = Math.hypot(e.Ex, e.Ey); if (!m) continue;
          const L = Math.min(13, 3 + 2.2 * Math.log10(1 + m / 1e4)); // comprimento ~ log|E|
          seta(x * PX - (L * e.Ex) / m, y * PX - (L * e.Ey) / m, x * PX + (L * e.Ex) / m, y * PX + (L * e.Ey) / m, C.ink3, 1.3);
        }
      }
      if (modos.linhas) {
        const soma = cargas.reduce((s, c) => s + c.q, 0);
        const fontes = cargas.filter((c) => (soma >= 0 ? c.q > 0 : c.q < 0));
        cx.strokeStyle = C.ink2; cx.lineWidth = 1.4;
        for (const c of fontes) {
          const n = 8 * Math.abs(c.q), sinal = Math.sign(c.q);
          for (let k = 0; k < n; k++) {
            const a = (2 * Math.PI * (k + 0.5)) / n, pts = linha(c.x + 0.9 * Math.cos(a), c.y + 0.9 * Math.sin(a), sinal);
            cx.beginPath(); pts.forEach(([x, y], i) => (i ? cx.lineTo(x * PX, y * PX) : cx.moveTo(x * PX, y * PX))); cx.stroke();
            // setinha no meio indicando o sentido de E
            const m = Math.floor(pts.length / 3); if (pts.length > 12) { const [xa, ya] = pts[m], [xb, yb] = pts[m + 2]; const s2 = sinal; seta(xa * PX, ya * PX, xa * PX + (s2 > 0 ? 1 : -1) * (xb - xa) * PX * 2.5, ya * PX + (s2 > 0 ? 1 : -1) * (yb - ya) * PX * 2.5, C.ink2, 1.2); }
          }
        }
      }
      if (modos.forcas) {
        for (const c of cargas) {
          let Fx = 0, Fy = 0;
          for (const o of cargas) { if (o === c) continue; const dx = (c.x - o.x) / 100, dy = (c.y - o.y) / 100, r = Math.hypot(dx, dy); if (r < 1e-3) continue; const f = (K * c.q * o.q * 1e-12) / (r * r); Fx += (f * dx) / r; Fy += (f * dy) / r; }
          const m = Math.hypot(Fx, Fy); if (!m) continue;
          const L = Math.min(120, 30 + 34 * Math.log10(1 + 10 * m)); // seta ~ log|F|
          seta(c.x * PX, c.y * PX, c.x * PX + (L * Fx) / m, c.y * PX + (L * Fy) / m, C.warn, 2.6);
          cx.fillStyle = C.warn; cx.font = "600 12px Inter"; cx.fillText(F.t(m, 2) + " N", c.x * PX + (L * Fx) / m + 6, c.y * PX + (L * Fy) / m - 4);
        }
      }
      // carga de prova
      if (prova) {
        cx.strokeStyle = C.mod; cx.lineWidth = 1.5; cx.beginPath(); prova.rastro.forEach(([x, y], i) => (i ? cx.lineTo(x * PX, y * PX) : cx.moveTo(x * PX, y * PX))); cx.stroke();
        cx.fillStyle = C.mod; cx.beginPath(); cx.arc(prova.x * PX, prova.y * PX, 6, 0, 7); cx.fill();
      }
      for (const c of cargas) {
        const r = 11 + 2 * Math.abs(c.q);
        cx.fillStyle = c.q > 0 ? C.pos : C.neg; cx.beginPath(); cx.arc(c.x * PX, c.y * PX, r, 0, 7); cx.fill();
        cx.strokeStyle = C.bg; cx.lineWidth = 2; cx.stroke();
        cx.fillStyle = "#fff"; cx.font = "700 13px Inter"; cx.textAlign = "center"; cx.fillText((c.q > 0 ? "+" : "−") + Math.abs(c.q), c.x * PX, c.y * PX + 4.5); cx.textAlign = "start";
      }
      // leitor no mouse
      let html = "";
      if (mouse) { const e = campo(mouse.x, mouse.y); html += `<div class="vis"><small>|E| no cursor</small><b>${fmt(Math.hypot(e.Ex, e.Ey), "N/C")}</b></div><div class="vis"><small>V no cursor</small><b>${fmt(e.V, "V")}</b></div>`; }
      html += `<div class="vis"><small>carga total</small><b>${cargas.reduce((s, c) => s + c.q, 0)} µC</b></div>`;
      if (prova) html += `<div class="vis"><small>prova: K + U</small><b>${F.t(prova.K * 1e3, 1)} + ${F.t(prova.U * 1e3, 1)} = ${F.t((prova.K + prova.U) * 1e3, 1)} mJ</b></div>`;
      leitor.innerHTML = html;
    }

    // dinâmica da carga de prova: q0 = +0,1 µC, m = 1 g (sem gravidade, sem atrito), Verlet
    const Q0 = 0.1e-6, M0 = 1e-3;
    function passoProva(dt) {
      const p = prova; const ac = (x, y) => { const e = campo(x, y); return [(Q0 * e.Ex) / M0, (Q0 * e.Ey) / M0]; };
      for (let k = 0; k < 20; k++) {
        const h = dt / 20, a = ac(p.x, p.y);
        p.vx += (a[0] * h) / 2; p.vy += (a[1] * h) / 2; p.x += p.vx * h * 100; p.y += p.vy * h * 100;
        const b = ac(p.x, p.y); p.vx += (b[0] * h) / 2; p.vy += (b[1] * h) / 2;
        if (cargas.some((c) => Math.hypot(p.x - c.x, p.y - c.y) < 1.2)) { p.parou = "bateu"; break; }
      }
      p.K = 0.5 * M0 * (p.vx * p.vx + p.vy * p.vy); p.U = Q0 * campo(p.x, p.y).V;
      p.rastro.push([p.x, p.y]); if (p.rastro.length > 600) p.rastro.shift();
      if (p.x < -20 || p.y < -20 || p.x > W / PX + 20 || p.y > H / PX + 20) p.parou = "fugiu";
    }

    let vivo = true, t0 = performance.now();
    function loop(t) {
      if (!vivo) return;
      const dt = Math.min(0.04, (t - t0) / 1000); t0 = t;
      if (prova && !prova.parou) { passoProva(dt * 0.05); desenha(); }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    F.aoSair(() => (vivo = false));

    // interação
    const pos = (ev) => { const r = cv.getBoundingClientRect(); return { x: ((ev.clientX - r.left) * (W / r.width)) / PX, y: ((ev.clientY - r.top) * (H / r.height)) / PX }; };
    const achar = (p) => cargas.find((c) => Math.hypot(c.x - p.x, c.y - p.y) < 2);
    cv.addEventListener("pointerdown", (ev) => { const p = pos(ev); arrasto = achar(p); moveu = false; if (arrasto) { cv.setPointerCapture(ev.pointerId); cv.style.cursor = "grabbing"; } else if (esperando) { esperando = false; prova = { x: p.x, y: p.y, vx: 0, vy: 0, rastro: [[p.x, p.y]], K: 0, U: 0 }; } });
    cv.addEventListener("pointermove", (ev) => { const p = pos(ev); mouse = p; if (arrasto) { arrasto.x = Math.max(1, Math.min(W / PX - 1, p.x)); arrasto.y = Math.max(1, Math.min(H / PX - 1, p.y)); moveu = true; sujo = true; prova = null; } desenha(); });
    cv.addEventListener("pointerup", () => { if (arrasto && !moveu) { const seq = [1, 2, 3, -1, -2, -3]; arrasto.q = seq[(seq.indexOf(arrasto.q) + 1) % seq.length]; sujo = true; } arrasto = null; cv.style.cursor = "grab"; desenha(); });
    cv.addEventListener("pointerleave", () => { mouse = null; desenha(); });
    cv.addEventListener("dblclick", (ev) => { const c = achar(pos(ev)); if (c && cargas.length > 1) { cargas = cargas.filter((x) => x !== c); sujo = true; desenha(); } });
    const pinta = () => el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", !!modos[b.dataset.m]));
    el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { modos[b.dataset.m] = !modos[b.dataset.m]; pinta(); sujo = true; desenha(); }));
    el.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { cargas = presets[b.dataset.p].map((c) => ({ ...c })); prova = null; sujo = true; desenha(); }));
    const add = (q) => { if (cargas.length >= 8) return; cargas.push({ x: 10 + Math.random() * 56, y: 8 + Math.random() * 26, q }); sujo = true; desenha(); };
    el.querySelector('[data-a="mais"]').addEventListener("click", () => add(1));
    el.querySelector('[data-a="menos"]').addEventListener("click", () => add(-1));
    const bp = el.querySelector('[data-a="prova"]');
    if (bp) bp.addEventListener("click", () => { prova = null; esperando = true; el.querySelector(".status").innerHTML = "<b>Clique no lugar onde a carga de prova (+0,1 µC, 1 g) vai ser solta do repouso.</b> Ela não tem atrito: repare que K + U fica constante."; });
    F.ouvir("tema", () => { sujo = true; desenha(); });
    pinta(); desenha();
    el.ajusta = (o) => { if (o.cargas) cargas = o.cargas.map((c) => ({ ...c })); if (o.modos) Object.assign(modos, o.modos); pinta(); sujo = true; desenha(); };
    return el;
  };
})();
