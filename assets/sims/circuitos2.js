/* Laboratórios de circuitos (β 0.5): capacitor com dielétrico, deriva dos elétrons,
   associação de resistores animada, medidores, gerador real e circuito RC. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const EPS0 = 8.854e-12;
  const cssv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const NS = "http://www.w3.org/2000/svg";
  const fmtSI = (F, v, u) => { const a = Math.abs(v); const p = [[1e9, "G"], [1e6, "M"], [1e3, "k"], [1, ""], [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"], [1e-12, "p"]]; for (const [f, s] of p) if (a >= f * 0.9995 || f === 1e-12) return F.t(v / f, a / f >= 100 ? 0 : a / f >= 10 ? 1 : 2) + " " + s + u; };
  SIM.fmtSI = fmtSI;

  /* bolinhas andando por polilinhas, cada trecho com sua corrente */
  function correnteViva(g, trechos, F) {
    const bolas = [];
    trechos.forEach((t) => {
      let L = 0; const seg = [];
      for (let k = 0; k < t.pts.length - 1; k++) { const [a, b] = [t.pts[k], t.pts[k + 1]]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push({ a, b, l, s0: L }); L += l; }
      t.L = L; t.seg = seg; t.fase = 0; t.dots = [];
      const n = Math.max(2, Math.round(L / 24));
      for (let k = 0; k < n; k++) { const c = document.createElementNS(NS, "circle"); c.setAttribute("r", "3.6"); c.setAttribute("fill", "#5aa0ff"); g.appendChild(c); t.dots.push(c); }
    });
    const pos = (t, s) => { s = ((s % t.L) + t.L) % t.L; for (const q of t.seg) if (s <= q.s0 + q.l) { const u = (s - q.s0) / q.l; return [q.a[0] + u * (q.b[0] - q.a[0]), q.a[1] + u * (q.b[1] - q.a[1])]; } return t.pts[0]; };
    return {
      passo(dt, escala) { trechos.forEach((t) => { t.fase += Math.max(-320, Math.min(320, escala * t.i())) * dt; t.dots.forEach((c, k) => { const [x, y] = pos(t, t.fase + (k * t.L) / t.dots.length); c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", y.toFixed(1)); c.setAttribute("opacity", Math.abs(t.i()) < 1e-9 ? 0.25 : 0.9); }); }); },
    };
  }

  /* ---------- 1. Capacitor plano com dielétrico ---------- */
  /* nome: "Capacitor plano com dielétrico" · matéria: Física · tema: C11 */
  SIM.capacitor = (el, F) => {
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 640 300" width="640" aria-label="capacitor"><g class="g"></g></svg></div>
      <div class="leitor" data-v="l"></div>
      <div class="ctrls">
        <div class="ctrl"><label>Área A</label><input type="range" min="50" max="400" step="10" value="200" data-c="A"><output data-o="A"></output></div>
        <div class="ctrl"><label>Distância d</label><input type="range" min="0.5" max="4" step="0.1" value="2" data-c="d"><output data-o="d"></output></div>
        <div class="ctrl"><label>Dielétrico inserido</label><input type="range" min="0" max="1" step="0.01" value="0" data-c="f"><output data-o="f"></output></div>
        <div class="bts"><span style="color:var(--ink2);font-size:14px;align-self:center">κ =</span>${[2, 3, 5].map((k, i) => `<button class="bt peq" data-k="${k}" aria-pressed="${i === 1}">${k}</button>`).join("")}
          <button class="bt peq" data-a="bat" aria-pressed="true">Bateria ligada (V fixo)</button></div>
      </div><div class="status" data-v="st"></div>`);
    const st = { A: 200, d: 2, f: 0, k: 3, bat: true, V0: 100, Q: null };
    const q = (s) => el.querySelector(s);
    const C = () => ((EPS0 * st.A * 1e-4) / (st.d * 1e-3)) * (1 - st.f + st.k * st.f);
    function desenha() {
      const c = C(); let V, Q;
      if (st.bat) { V = st.V0; Q = c * V; st.Q = Q; } else { Q = st.Q; V = Q / c; }
      const E = V / (st.d * 1e-3), U = 0.5 * Q * V;
      const H = 60 + st.A * 0.5, gap = 30 + st.d * 40, x1 = 320 - gap / 2, x2 = 320 + gap / 2, y0 = 168 - H / 2;
      const hd = st.f * H; // dielétrico entra por baixo
      let g = `<rect x="${x1 - 8}" y="${y0}" width="8" height="${H}" style="fill:#ef5b5b"/><rect x="${x2}" y="${y0}" width="8" height="${H}" style="fill:#4f8dff"/>`;
      if (hd > 0) g += `<rect x="${x1}" y="${y0 + H - hd}" width="${gap}" height="${hd}" style="fill:color-mix(in srgb,var(--warn) 30%,transparent);stroke:var(--warn)"/>` + D.txt(320, y0 + H - hd / 2 + 5, "κ = " + st.k, "tx2");
      // linhas de campo: densidade ~ E (igual nas duas regiões, já que V é o mesmo)
      const nl = Math.max(2, Math.min(14, Math.round(E / 2.5e4)));
      for (let k = 0; k < nl; k++) { const y = y0 + ((k + 0.5) * H) / nl; g += `<line x1="${x1 + 3}" y1="${y}" x2="${x2 - 6}" y2="${y}" style="stroke:var(--ink2);stroke-width:1.2"/><polygon points="${x2 - 4},${y} ${x2 - 11},${y - 4} ${x2 - 11},${y + 4}" style="fill:var(--ink2)"/>`; }
      // cargas livres: densidade maior na parte com dielétrico (σ_livre = κ ε0 E)
      const sv = EPS0 * E, sd = st.k * EPS0 * E, esc = 1 / 1.6e-7;
      const sref = EPS0 * 5e4, marca = (ya, yb, s) => { const n = Math.min(40, Math.round((((yb - ya) / 22) * s) / sref)); let r = ""; for (let k = 0; k < n; k++) { const y = ya + ((k + 0.5) * (yb - ya)) / n; r += `<text x="${x1 - 22}" y="${y + 4}" style="font:700 12px Inter;fill:#ef5b5b">+</text><text x="${x2 + 12}" y="${y + 4}" style="font:700 12px Inter;fill:#4f8dff">−</text>`; } return r; };
      g += marca(y0, y0 + H - hd, sv) + marca(y0 + H - hd, y0 + H, sd);
      if (st.bat) g += `<path d="M${x1 - 4} ${y0} V36 H${300} M${340} 36 H${x2 + 4} V${y0}" class="ln"/>${D.comp("bateria", 300, 36, 340, 36, { mais: -1, rot: st.V0 + " V", lado: 1, dist: 22 })}`;
      else g += D.txt(320, 30, "isolado: Q constante", "tx2");
      q(".g").innerHTML = g;
      q('[data-o="A"]').textContent = st.A + " cm²"; q('[data-o="d"]').textContent = F.t(st.d, 1) + " mm"; q('[data-o="f"]').textContent = F.t(st.f * 100, 0) + "%";
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>C</small><b>${fmtSI(F, c, "F")}</b></div><div class="vis"><small>Q</small><b>${fmtSI(F, Q, "C")}</b></div><div class="vis"><small>V</small><b>${F.t(V, 1)} V</b></div><div class="vis"><small>E entre as placas</small><b>${fmtSI(F, E, "V/m")}</b></div><div class="vis"><small>energia U</small><b>${fmtSI(F, U, "J")}</b></div>`;
      const dC = ((EPS0 * st.A * 1e-4) / (st.d * 1e-3)) * (st.k - 1);
      q('[data-v="st"]').innerHTML = (st.bat ? "<b>Bateria ligada:</b> V fica fixo; enfiar o dielétrico aumenta C, Q e U (a bateria fornece o dobro do que fica guardado)." : "<b>Isolado:</b> Q fica fixo; enfiar o dielétrico aumenta C e diminui V e U.") + ` O campo é o mesmo nas duas partes (mesmo V, mesmo d), mas a parte com dielétrico precisa de κ vezes mais carga livre. ${st.f > 0 && st.f < 1 ? "O dielétrico é <b>puxado</b> para dentro." : ""}`;
    }
    el.querySelectorAll("[data-c]").forEach((r) => r.addEventListener("input", () => { st[r.dataset.c] = +r.value; desenha(); }));
    el.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => { st.k = +b.dataset.k; el.querySelectorAll("[data-k]").forEach((x) => x.setAttribute("aria-pressed", x === b)); desenha(); }));
    q('[data-a="bat"]').addEventListener("click", (ev) => { st.bat = !st.bat; ev.currentTarget.setAttribute("aria-pressed", st.bat); ev.currentTarget.textContent = st.bat ? "Bateria ligada (V fixo)" : "Bateria desligada (Q fixo)"; desenha(); });
    desenha();
  };

  /* ---------- 2. Deriva dos elétrons (modelo de Drude) ---------- */
  /* nome: "Deriva dos elétrons (modelo de Drude)" · matéria: Física · tema: C06 */
  SIM.deriva = (el, F) => {
    const W = 760, H = 240;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><canvas width="${W * 2}" height="${H * 2}" style="width:${W}px;height:${H}px;border-radius:8px;background:var(--bg)"></canvas></div>
      <div class="leitor" data-v="l"></div>
      <div class="ctrls"><div class="ctrl"><label>Campo no fio (unidades da simulação)</label><input type="range" min="0" max="100" step="1" value="40"><output></output></div>
      <div class="bts"><button class="bt peq" data-a="term" aria-pressed="true">Mostrar agitação térmica</button><button class="bt peq" data-a="rastro" aria-pressed="false">Rastro de um elétron</button></div></div>
      <div class="status">Cada elétron anda rápido e em zigue-zague (agitação térmica), batendo nos íons. O campo só adiciona uma deriva lenta, <b>contra</b> o campo. A linha tracejada conta quantos passam por segundo: é a corrente. <span style="color:var(--ink3)">(Fora de escala: num fio real, a velocidade térmica é ~10¹⁰ vezes maior que a de deriva.)</span></div>`);
    const cv = el.querySelector("canvas"), cx = cv.getContext("2d"); cx.scale(2, 2);
    const N = 90, VT = 180, TAU = 0.12; let campo = 40, term = true, rastro = false, vivo = true;
    const els = Array.from({ length: N }, () => { const a = Math.random() * 2 * Math.PI; return { x: Math.random() * W, y: 30 + Math.random() * (H - 60), vx: VT * Math.cos(a), vy: VT * Math.sin(a) }; });
    const ions = []; for (let x = 20; x < W; x += 44) for (let y = 44; y < H - 30; y += 44) ions.push([x, y]);
    let contagem = [], trilha = [];
    function quadro(dt) {
      const a = -campo * 9; // aceleração (px/s²) contra o campo (que aponta para a direita)
      let cruz = 0, somavx = 0;
      for (const e of els) {
        if (Math.random() < dt / TAU) { const ang = Math.random() * 2 * Math.PI, v = term ? VT : 0; e.vx = v * Math.cos(ang); e.vy = v * Math.sin(ang); }
        e.vx += a * dt;
        const x0 = e.x; e.x += e.vx * dt; e.y += e.vy * dt;
        if (e.y < 30) { e.y = 60 - e.y; e.vy *= -1; } if (e.y > H - 30) { e.y = 2 * (H - 30) - e.y; e.vy *= -1; }
        if ((x0 - W / 2) * (e.x - W / 2) < 0 && Math.abs(e.x - x0) < W / 2) cruz += e.x < x0 ? 1 : -1; // elétron indo para a esquerda = corrente para a direita
        if (e.x < 0) e.x += W; if (e.x > W) e.x -= W;
        somavx += e.vx;
      }
      contagem.push([performance.now(), cruz]); const agora = performance.now(); contagem = contagem.filter((c) => agora - c[0] < 3000);
      if (rastro) { trilha.push([els[0].x, els[0].y]); if (trilha.length > 400) trilha.shift(); }
      return somavx / N;
    }
    function desenha(vd) {
      const ink3 = cssv("--ink3"), line = cssv("--line");
      cx.clearRect(0, 0, W, H);
      cx.fillStyle = "rgba(150,160,180,.08)"; cx.fillRect(0, 30, W, H - 60);
      cx.strokeStyle = line; cx.strokeRect(0.5, 30.5, W - 1, H - 61);
      cx.fillStyle = ink3; for (const [x, y] of ions) { cx.beginPath(); cx.arc(x, y, 5, 0, 7); cx.fill(); }
      cx.setLineDash([5, 5]); cx.strokeStyle = cssv("--warn"); cx.beginPath(); cx.moveTo(W / 2, 22); cx.lineTo(W / 2, H - 22); cx.stroke(); cx.setLineDash([]);
      if (rastro && trilha.length > 1) { cx.strokeStyle = cssv("--mod"); cx.lineWidth = 1.5; cx.beginPath(); trilha.forEach(([x, y], i) => (i && Math.abs(x - trilha[i - 1][0]) < 100 ? cx.lineTo(x, y) : cx.moveTo(x, y))); cx.stroke(); }
      cx.fillStyle = "#5aa0ff"; for (const e of els) { cx.beginPath(); cx.arc(e.x, e.y, 3.2, 0, 7); cx.fill(); }
      cx.fillStyle = cssv("--ink2"); cx.font = "13px Inter"; cx.fillText("E →", W - 50, 18); cx.fillText("contagem", W / 2 + 6, 18);
      const corr = contagem.reduce((s, c) => s + c[1], 0) / 3;
      el.querySelector('[data-v="l"]').innerHTML = `<div class="vis"><small>velocidade de deriva média</small><b>${F.t(-vd, 1)} px/s ←</b></div><div class="vis"><small>v_d esperada (aτ)</small><b>${F.t(campo * 9 * TAU, 1)} px/s</b></div><div class="vis"><small>passagens líquidas/s</small><b>${F.t(corr, 1)}</b></div>`;
      el.querySelector("output").textContent = campo;
    }
    let t0 = performance.now(), media = 0;
    function loop(t) { if (!vivo) return; const dt = Math.min(0.04, (t - t0) / 1000); t0 = t; const vd = quadro(dt); media = 0.97 * media + 0.03 * vd; desenha(media); requestAnimationFrame(loop); }
    requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
    el.querySelector("input").addEventListener("input", (ev) => { campo = +ev.target.value; });
    el.querySelector('[data-a="term"]').addEventListener("click", (ev) => { term = !term; ev.currentTarget.setAttribute("aria-pressed", term); });
    el.querySelector('[data-a="rastro"]').addEventListener("click", (ev) => { rastro = !rastro; trilha = []; ev.currentTarget.setAttribute("aria-pressed", rastro); });
  };

  /* ---------- 3. Associação de resistores animada ---------- */
  /* nome: "Associação de resistores" · matéria: Física · tema: C08 */
  SIM.associacao = (el, F) => {
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 600 320" width="600" aria-label="associação"><g class="fios"></g><g class="dots"></g><g class="comps"></g></svg></div>
      <div class="leitor" data-v="l"></div>
      <div class="ctrls">
        <div class="bts" style="grid-column:1/-1">${["série", "paralelo", "misto"].map((t, i) => `<button class="bt peq" data-t="${t}" aria-pressed="${i === 0}">${t[0].toUpperCase() + t.slice(1)}</button>`).join("")}</div>
        <div class="ctrl"><label>E</label><input type="range" min="1" max="12" step="0.5" value="9" data-c="E"><output data-o="E"></output></div>
        <div class="ctrl"><label>R₁</label><input type="range" min="10" max="1000" step="10" value="100" data-c="R1"><output data-o="R1"></output></div>
        <div class="ctrl"><label>R₂</label><input type="range" min="10" max="1000" step="10" value="220" data-c="R2"><output data-o="R2"></output></div>
        <div class="ctrl"><label>R₃</label><input type="range" min="10" max="1000" step="10" value="470" data-c="R3"><output data-o="R3"></output></div>
      </div><div class="status" data-v="st"></div>`);
    const st = { t: "série", E: 9, R1: 100, R2: 220, R3: 470 };
    const q = (s) => el.querySelector(s);
    let anim = null, vivo = true, sol = {};
    function resolve() {
      const { E, R1, R2, R3 } = st;
      if (st.t === "série") { const Re = R1 + R2 + R3, i = E / Re; return { Re, i, i1: i, i2: i, i3: i }; }
      if (st.t === "paralelo") { const i1 = E / R1, i2 = E / R2, i3 = E / R3; return { Re: 1 / (1 / R1 + 1 / R2 + 1 / R3), i: i1 + i2 + i3, i1, i2, i3 }; }
      const Rp = (R2 * R3) / (R2 + R3), Re = R1 + Rp, i = E / Re, Up = i * Rp; return { Re, i, i1: i, i2: Up / R2, i3: Up / R3 };
    }
    function monta() {
      const fios = q(".fios"), dots = q(".dots"), comps = q(".comps"); fios.innerHTML = dots.innerHTML = "";
      const X0 = 70, X1 = 530, Y0 = 50, Y1 = 280; let tr = [], c = "";
      const bat = `<rect x="${X0 - 16}" y="135" width="32" height="60" style="fill:var(--card)"/>` + D.comp("bateria", X0, 195, X0, 135, { mais: 1, rot: "E", lado: -1, sinais: false }) + D.txt(X0 - 28, 140, "+", "tx");
      const res = (x1, y1, x2, y2, rot) => { const vert = x1 === x2; return `<rect x="${vert ? x1 - 14 : (x1 + x2) / 2 - 30}" y="${vert ? (y1 + y2) / 2 - 30 : y1 - 14}" width="${vert ? 28 : 60}" height="${vert ? 60 : 28}" style="fill:var(--card)"/>` + D.comp("resistor", x1, y1, x2, y2, { rot, lado: vert ? -1 : 1 }); };
      if (st.t === "série") {
        fios.innerHTML = D.fio([[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1], [X0, Y0]]);
        c = bat + res(170, Y0, 250, Y0, "R₁") + res(370, Y0, 450, Y0, "R₂") + res(X1, 135, X1, 195, "R₃");
        tr = [{ pts: [[X0, 160], [X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1], [X0, 170]], i: () => sol.i }];
      } else if (st.t === "paralelo") {
        const xs = [250, 390, X1];
        fios.innerHTML = D.fio([[X0, Y0], [X1, Y0]]) + D.fio([[X0, Y1], [X1, Y1]]) + D.fio([[X0, Y0], [X0, Y1]]) + xs.map((x) => D.fio([[x, Y0], [x, Y1]])).join("") + xs.slice(0, 2).map((x) => D.no(x, Y0) + D.no(x, Y1)).join("");
        c = bat + xs.map((x, k) => res(x, 135, x, 195, ["R₁", "R₂", "R₃"][k])).join("");
        tr = [{ pts: [[X0, 160], [X0, Y0], [250, Y0]], i: () => sol.i }, { pts: [[250, Y0], [390, Y0]], i: () => sol.i2 + sol.i3 }, { pts: [[390, Y0], [X1, Y0]], i: () => sol.i3 },
          { pts: [[250, Y0], [250, Y1]], i: () => sol.i1 }, { pts: [[390, Y0], [390, Y1]], i: () => sol.i2 }, { pts: [[X1, Y0], [X1, Y1]], i: () => sol.i3 },
          { pts: [[X1, Y1], [390, Y1]], i: () => sol.i3 }, { pts: [[390, Y1], [250, Y1]], i: () => sol.i2 + sol.i3 }, { pts: [[250, Y1], [X0, Y1], [X0, 170]], i: () => sol.i }];
      } else {
        const xs = [390, X1];
        fios.innerHTML = D.fio([[X0, Y0], [X1, Y0]]) + D.fio([[X0, Y1], [X1, Y1]]) + D.fio([[X0, Y0], [X0, Y1]]) + xs.map((x) => D.fio([[x, Y0], [x, Y1]])).join("") + D.no(390, Y0) + D.no(390, Y1);
        c = bat + res(170, Y0, 250, Y0, "R₁") + res(390, 135, 390, 195, "R₂") + res(X1, 135, X1, 195, "R₃");
        tr = [{ pts: [[X0, 160], [X0, Y0], [390, Y0]], i: () => sol.i }, { pts: [[390, Y0], [X1, Y0]], i: () => sol.i3 }, { pts: [[390, Y0], [390, Y1]], i: () => sol.i2 }, { pts: [[X1, Y0], [X1, Y1], [390, Y1]], i: () => sol.i3 }, { pts: [[390, Y1], [X0, Y1], [X0, 170]], i: () => sol.i }];
      }
      comps.innerHTML = c;
      anim = correnteViva(dots, tr, F);
    }
    function atualiza() {
      sol = resolve();
      ["E", "R1", "R2", "R3"].forEach((k) => (q(`[data-o="${k}"]`).textContent = k === "E" ? F.t(st.E, 1) + " V" : st[k] + " Ω"));
      const U = (i, R) => F.t(i * R, 2);
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>R equivalente</small><b>${F.t(sol.Re, sol.Re >= 100 ? 0 : 1)} Ω</b></div><div class="vis"><small>i total</small><b>${F.t(sol.i * 1000, 2)} mA</b></div>` +
        [1, 2, 3].map((k) => `<div class="vis"><small>R${"₁₂₃"[k - 1]}: i · U</small><b>${F.t(sol["i" + k] * 1000, 1)} mA · ${U(sol["i" + k], st["R" + k])} V</b></div>`).join("");
      q('[data-v="st"]').innerHTML = st.t === "série" ? "Série: a <b>mesma corrente</b> em todos; as tensões se somam e o maior resistor fica com a maior fatia." : st.t === "paralelo" ? "Paralelo: a <b>mesma tensão</b> em todos; as correntes se somam nos nós (veja as bolinhas acelerando e desacelerando nos trechos de fio). O menor resistor leva a maior corrente." : "Misto: R₂ e R₃ em paralelo (mesma tensão), e o par em série com R₁ (mesma corrente total).";
    }
    let t0 = performance.now();
    function loop(t) { if (!vivo) return; const dt = Math.min(0.04, (t - t0) / 1000); t0 = t; if (anim) anim.passo(dt, 4000); requestAnimationFrame(loop); }
    el.querySelectorAll("[data-c]").forEach((r) => r.addEventListener("input", () => { st[r.dataset.c] = +r.value; atualiza(); }));
    el.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => { st.t = b.dataset.t; el.querySelectorAll("[data-t]").forEach((x) => x.setAttribute("aria-pressed", x === b)); monta(); atualiza(); }));
    monta(); atualiza(); requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };

  /* ---------- 4. Medidores ligados certo e errado ----------
     Circuito: bateria E = 9 V (r = 1 Ω), R1 = 220 Ω, R2 = 680 Ω. Valores verdadeiros: i = 9/901, U2 = 680 i. */
  /* nome: "Multímetro: ligações certas e erradas" · matéria: Física · tema: C09 */
  SIM.medidores = (el, F) => {
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 580 300" width="580" aria-label="medidores"><g class="g"></g></svg></div>
      <div class="leitor" data-v="l"></div>
      <div class="ctrls">
        <div class="bts" style="grid-column:1/-1">
          <button class="bt peq" data-m="vok" aria-pressed="true">V em paralelo com R₂ ✓</button><button class="bt peq" data-m="vserie">V em série ✗</button>
          <button class="bt peq" data-m="aok">A em série ✓</button><button class="bt peq" data-m="apar">A em paralelo com R₂ ✗</button><button class="bt peq" data-m="abat">A direto na bateria ✗✗</button></div>
        <div class="ctrl"><label>Resistência do voltímetro</label><input type="range" min="3" max="7" step="0.1" value="7" data-c="rv"><output data-o="rv"></output></div>
        <div class="ctrl"><label>Resistência do amperímetro</label><input type="range" min="-1" max="1.5" step="0.1" value="0" data-c="ra"><output data-o="ra"></output></div>
      </div><div class="status" data-v="st"></div>`);
    const E = 9, r = 1, R1 = 220, R2 = 680, FUS = 0.2;
    const st = { m: "vok", rv: 1e7, ra: 1 };
    const q = (s) => el.querySelector(s);
    function calcula() {
      const { rv, ra } = st; let leitura, unid, iTot, nota = "";
      if (st.m === "vok") { const Rp = (R2 * rv) / (R2 + rv); iTot = E / (r + R1 + Rp); leitura = iTot * Rp; unid = "V"; nota = `Valor verdadeiro sem o medidor: ${F.t((E * R2) / (r + R1 + R2), 3)} V. Quanto maior a resistência do voltímetro, menor o erro.`; }
      else if (st.m === "vserie") { iTot = E / (r + R1 + R2 + rv); leitura = iTot * rv; unid = "V"; nota = "O voltímetro em série vira um resistor gigante: a corrente quase some e ele lê praticamente a fem da bateria. O circuito para de funcionar."; }
      else if (st.m === "aok") { iTot = E / (r + R1 + R2 + ra); leitura = iTot; unid = "A"; nota = `Valor verdadeiro sem o medidor: ${F.t((1000 * E) / (r + R1 + R2), 3)} mA. Quanto menor a resistência do amperímetro, menor o erro.`; }
      else if (st.m === "apar") { const Rp = (R2 * ra) / (R2 + ra); iTot = E / (r + R1 + Rp); leitura = (iTot * Rp) / ra; unid = "A"; nota = "Em paralelo, o amperímetro (quase zero ohm) faz um <b>curto</b> em R₂: R₂ apaga e quase toda a corrente passa pelo medidor. Aqui R₁ ainda limita a corrente."; }
      else { iTot = E / (r + ra); leitura = iTot; unid = "A"; nota = "Amperímetro direto na bateria: só as resistências internas limitam a corrente."; }
      const queimou = unid === "A" && leitura > FUS;
      return { leitura, unid, iTot, nota, queimou };
    }
    function desenha() {
      const s = calcula(), X0 = 70, X1 = 480, Y0 = 50, Y1 = 260;
      let g = D.fio([[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1], [X0, Y0]]) + `<rect x="${X0 - 16}" y="125" width="32" height="60" style="fill:var(--card)"/>` + D.comp("bateria", X0, 185, X0, 125, { mais: 1, rot: "9 V", lado: -1, sinais: false });
      g += `<rect x="160" y="${Y0 - 14}" width="80" height="28" style="fill:var(--card)"/>` + D.comp("resistor", 160, Y0, 240, Y0, { rot: "R₁ = 220 Ω" });
      g += `<rect x="${X1 - 14}" y="120" width="28" height="70" style="fill:var(--card)"/>` + D.comp("resistor", X1, 120, X1, 190, { rot: "R₂ = 680 Ω", lado: -1, dist: 24 });
      const med = (x1, y1, x2, y2, l) => `<circle cx="${(x1 + x2) / 2}" cy="${(y1 + y2) / 2}" r="13" style="fill:var(--card)"/>` + D.comp("medidor", x1, y1, x2, y2, { letra: l });
      if (st.m === "vok") g += D.fio([[X1, 100], [535, 100], [535, 210], [X1, 210]]) + med(535, 140, 535, 170, "V") + D.no(X1, 100) + D.no(X1, 210);
      if (st.m === "vserie") g += med(320, Y0, 360, Y0, "V");
      if (st.m === "aok") g += med(320, Y0, 360, Y0, "A");
      if (st.m === "apar") g += D.fio([[X1, 100], [535, 100], [535, 210], [X1, 210]]) + med(535, 140, 535, 170, "A") + D.no(X1, 100) + D.no(X1, 210);
      if (st.m === "abat") g += D.fio([[X0, 110], [20, 110], [20, 200], [X0, 200]]) + med(20, 140, 20, 170, "A") + D.no(X0, 110) + D.no(X0, 200);
      if (s.queimou) g += `<text x="280" y="160" text-anchor="middle" style="font:700 18px Inter;fill:var(--bad)">Fusível do multímetro queimou!</text>`;
      q(".g").innerHTML = g;
      q('[data-o="rv"]').textContent = fmtSI(F, st.rv, "Ω"); q('[data-o="ra"]').textContent = fmtSI(F, st.ra, "Ω");
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>visor do multímetro</small><b>${s.queimou ? "0 (fusível)" : s.unid === "V" ? F.t(s.leitura, 3) + " V" : F.t(s.leitura * 1000, 2) + " mA"}</b></div><div class="vis"><small>corrente na bateria</small><b>${F.t(s.iTot * 1000, 2)} mA</b></div>`;
      q('[data-v="st"]').innerHTML = s.nota + (s.queimou ? ` <b class="bad">A corrente passou do limite de ${FUS * 1000} mA do fusível.</b>` : "");
    }
    q('[data-c="rv"]').addEventListener("input", (ev) => { st.rv = Math.pow(10, +ev.target.value); desenha(); });
    q('[data-c="ra"]').addEventListener("input", (ev) => { st.ra = Math.pow(10, +ev.target.value); desenha(); });
    el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { st.m = b.dataset.m; el.querySelectorAll("[data-m]").forEach((x) => x.setAttribute("aria-pressed", x === b)); desenha(); }));
    desenha();
  };

  /* ---------- 5. Gerador real: potência útil e rendimento ---------- */
  /* nome: "Gerador real: potência útil e rendimento" · matéria: Física · tema: C10 */
  SIM.gerador = (el, F) => {
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 320 240" width="320" class="p1"></svg><svg viewBox="0 0 320 240" width="320" class="p2"></svg></div>
      <div class="leitor" data-v="l"></div>
      <div class="ctrls"><div class="ctrl"><label>Resistência externa R</label><input type="range" min="-1" max="1.6" step="0.01" value="0.3" data-c="R"><output data-o="R"></output></div>
      <div class="ctrl"><label>Resistência interna r</label><input type="range" min="0.5" max="5" step="0.1" value="2" data-c="r"><output data-o="r"></output></div></div>
      <div class="status">Gerador de fem E = 12 V. À esquerda, a potência entregue ao resistor externo em função de R (escala log em R). À direita, a curva característica U = E − r i.</div>`);
    const E = 12; let R = 2, r = 2; const q = (s) => el.querySelector(s);
    function desenha() {
      const i = E / (R + r), U = E - r * i, P = U * i, Pmax = (E * E) / (4 * r), eta = U / E;
      const x0 = 40, y0 = 200, w = 260, h = 170, lmin = -1, lmax = 1.6, sx = (Rv) => x0 + ((Math.log10(Rv) - lmin) / (lmax - lmin)) * w, PM = 1.15 * Pmax, sy = (p) => y0 - (p / PM) * h;
      let d = ""; for (let k = 0; k <= 200; k++) { const Rv = Math.pow(10, lmin + ((lmax - lmin) * k) / 200); d += (k ? "L" : "M") + sx(Rv).toFixed(1) + " " + sy((E * E * Rv) / (Rv + r) ** 2).toFixed(1); }
      q(".p1").innerHTML = `<line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}" class="ln2"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="20" class="ln2"/><path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.5"/>
        <line x1="${sx(r)}" y1="${y0}" x2="${sx(r)}" y2="${sy(Pmax)}" class="ln2" style="stroke-dasharray:4 4"/>${D.txt(sx(r), y0 + 16, "R = r", "tx2")}<circle cx="${sx(R)}" cy="${sy(P)}" r="6.5" style="fill:var(--warn);stroke:var(--card);stroke-width:2"/>${D.txt(x0 + 4, 16, "P útil (W)", "tx2", "start")}${D.txt(x0 + w, y0 + 30, "R (log)", "tx2", "end")}`;
      const iM = E / 0.5, sxi = (iv) => x0 + (iv / (E / r)) * w * 0.95, syu = (u) => y0 - (u / E) * h;
      q(".p2").innerHTML = `<line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}" class="ln2"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="20" class="ln2"/><line x1="${sxi(0)}" y1="${syu(E)}" x2="${sxi(E / r)}" y2="${syu(0)}" style="stroke:var(--mod);stroke-width:2.5"/>
        <rect x="${x0}" y="${syu(U)}" width="${sxi(i) - x0}" height="${y0 - syu(U)}" style="fill:color-mix(in srgb,var(--warn) 25%,transparent)"/><circle cx="${sxi(i)}" cy="${syu(U)}" r="6.5" style="fill:var(--warn);stroke:var(--card);stroke-width:2"/>
        ${D.txt(x0 + 4, 16, "U (V)", "tx2", "start")}${D.txt(x0 + w, y0 + 30, "i", "tx2", "end")}${D.txt(sxi(E / r), y0 + 16, "i_cc", "tx2")}${D.txt(x0 - 6, syu(E) + 4, "E", "tx2", "end")}${D.txt((x0 + sxi(i)) / 2, (y0 + syu(U)) / 2 + 4, "P = U·i", "tx2")}`;
      q('[data-o="R"]').textContent = F.t(R, R < 10 ? 2 : 1) + " Ω"; q('[data-o="r"]').textContent = F.t(r, 1) + " Ω";
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>i</small><b>${F.t(i, 2)} A</b></div><div class="vis"><small>U nos terminais</small><b>${F.t(U, 2)} V</b></div><div class="vis"><small>P útil</small><b>${F.t(P, 2)} W</b></div><div class="vis"><small>P máx (R = r)</small><b>${F.t(Pmax, 2)} W</b></div><div class="vis"><small>rendimento</small><b>${F.t(100 * eta, 1)}%</b></div>`;
    }
    q('[data-c="R"]').addEventListener("input", (ev) => { R = Math.pow(10, +ev.target.value); desenha(); });
    q('[data-c="r"]').addEventListener("input", (ev) => { r = +ev.target.value; desenha(); });
    desenha();
  };

  /* ---------- 6. Circuito RC com gráfico ao vivo ---------- */
  /* nome: "Circuito RC: carga e descarga" · matéria: Física · tema: C10b */
  SIM.rc = (el, F) => {
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 300 220" width="300" class="c"><g class="fios"></g><g class="dots"></g><g class="comps"></g></svg><svg viewBox="0 0 340 220" width="340" class="gr"></svg></div>
      <div class="leitor" data-v="l"></div>
      <div class="ctrls"><div class="ctrl"><label>R</label><input type="range" min="3" max="5" step="0.05" value="4" data-c="R"><output data-o="R"></output></div>
      <div class="ctrl"><label>C</label><input type="range" min="-5" max="-3" step="0.05" value="-4" data-c="C"><output data-o="C"></output></div>
      <div class="bts"><button class="bt peq pri" data-a="carga">⚡ Carregar</button><button class="bt peq" data-a="desc">↯ Descarregar</button></div></div>
      <div class="status">Fonte de 10 V. O gráfico desenha V_C (roxo) e i (laranja) em tempo real; as linhas verticais marcam τ, 2τ, 3τ. Tempo real: τ = RC em segundos.</div>`);
    const E = 10; let R = 1e4, C = 1e-4, Vc = 0, modo = null, t = 0, hist = [], vivo = true;
    const q = (s) => el.querySelector(s);
    const tau = () => R * C;
    q(".fios").innerHTML = D.fio([[40, 40], [260, 40], [260, 180], [40, 180], [40, 40]]);
    q(".comps").innerHTML = `<rect x="24" y="80" width="32" height="60" style="fill:var(--card)"/>` + D.comp("bateria", 40, 140, 40, 80, { mais: 1, rot: "10 V", lado: -1, sinais: false }) + `<rect x="110" y="26" width="80" height="28" style="fill:var(--card)"/>` + D.comp("resistor", 110, 40, 190, 40, { rot: "R" }) + `<rect x="244" y="90" width="32" height="40" style="fill:var(--card)"/><line x1="246" y1="106" x2="274" y2="106" class="ln" style="stroke-width:3"/><line x1="246" y1="116" x2="274" y2="116" class="ln" style="stroke-width:3"/><line x1="260" y1="90" x2="260" y2="106" class="ln"/><line x1="260" y1="116" x2="260" y2="130" class="ln"/>` + D.txt(284, 116, "C", "tx", "start");
    const anim = correnteViva(q(".dots"), [{ pts: [[40, 100], [40, 40], [260, 40], [260, 100]], i: () => (modo ? i() : 0) }, { pts: [[260, 120], [260, 180], [40, 180], [40, 120]], i: () => (modo ? i() : 0) }], F);
    const i = () => (modo === "carga" ? (E - Vc) / R : modo === "desc" ? -Vc / R : 0);
    function grafico() {
      const x0 = 30, y0 = 190, w = 300, h = 160, T = 5 * tau(), sx = (tt) => x0 + (tt / T) * w, sv = (v) => y0 - (v / E) * h, si = (ii) => y0 - (Math.abs(ii) / (E / R)) * h;
      let g = `<line x1="${x0}" y1="${y0}" x2="${x0 + w}" y2="${y0}" class="ln2"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="20" class="ln2"/>`;
      for (let n = 1; n <= 4; n++) g += `<line x1="${sx(n * tau())}" y1="${y0}" x2="${sx(n * tau())}" y2="25" style="stroke:var(--line);stroke-dasharray:3 4"/>${D.txt(sx(n * tau()), y0 + 15, n + "τ", "tx2")}`;
      g += `<line x1="${x0}" y1="${sv(0.632 * E)}" x2="${x0 + w}" y2="${sv(0.632 * E)}" style="stroke:var(--line);stroke-dasharray:2 5"/>${D.txt(x0 + w, sv(0.632 * E) - 4, "63%", "tx2", "end")}`;
      const pv = hist.filter((p) => p[0] <= T).map((p, k) => (k ? "L" : "M") + sx(p[0]).toFixed(1) + " " + sv(p[1]).toFixed(1)).join("");
      const pi = hist.filter((p) => p[0] <= T).map((p, k) => (k ? "L" : "M") + sx(p[0]).toFixed(1) + " " + si(p[2]).toFixed(1)).join("");
      g += `<path d="${pv}" style="fill:none;stroke:var(--mod);stroke-width:2.5"/><path d="${pi}" style="fill:none;stroke:var(--warn);stroke-width:2"/>${D.txt(x0 + 6, 18, "V_C", "tx2", "start")}${D.txt(x0 + 50, 18, "|i|", "tx2", "start")}`;
      q(".gr").innerHTML = g;
      q('[data-o="R"]').textContent = fmtSI(F, R, "Ω"); q('[data-o="C"]').textContent = fmtSI(F, C, "F");
      q('[data-v="l"]').innerHTML = `<div class="vis"><small>τ = RC</small><b>${F.t(tau(), 2)} s</b></div><div class="vis"><small>t</small><b>${F.t(t, 2)} s</b></div><div class="vis"><small>V_C</small><b>${F.t(Vc, 2)} V</b></div><div class="vis"><small>i</small><b>${fmtSI(F, i(), "A")}</b></div><div class="vis"><small>energia em C</small><b>${fmtSI(F, 0.5 * C * Vc * Vc, "J")}</b></div>`;
    }
    let t0 = performance.now();
    function loop(tt) {
      if (!vivo) return; const dt = Math.min(0.05, (tt - t0) / 1000); t0 = tt;
      if (modo) { const alvo = modo === "carga" ? E : 0; Vc = alvo + (Vc - alvo) * Math.exp(-dt / tau()); t += dt; hist.push([t, Vc, i()]); if (t > 5 * tau()) modo = null; }
      anim.passo(dt, (150 * R) / E); grafico(); requestAnimationFrame(loop);
    }
    const inicia = (m) => { modo = m; t = 0; hist = [[0, Vc, i()]]; };
    q('[data-a="carga"]').addEventListener("click", () => inicia("carga"));
    q('[data-a="desc"]').addEventListener("click", () => inicia("desc"));
    q('[data-c="R"]').addEventListener("input", (ev) => { R = Math.pow(10, +ev.target.value); modo = null; hist = []; });
    q('[data-c="C"]').addEventListener("input", (ev) => { C = Math.pow(10, +ev.target.value); modo = null; hist = []; });
    requestAnimationFrame(loop); F.aoSair(() => (vivo = false));
  };
})();
