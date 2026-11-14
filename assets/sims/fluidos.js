/* Simulações de Fluidos (N01–N04): Euler × Lagrange e derivada material, bocal (continuidade), Torricelli e Venturi (Bernoulli),
   deformação de um elemento de fluido e tensões viscosas. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${k === ativo}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : Math.abs(v) < 0.5 * Math.pow(10, -d) ? "0" : (+v.toFixed(d)).toString().replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const seta = (x1, y1, x2, y2, cor, w = 1.2) => { const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1), c = Math.min(5, L * 0.45); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${cor};stroke-width:${w}"/><path d="M${x2 - c * Math.cos(a - 0.45)} ${y2 - c * Math.sin(a - 0.45)} L${x2} ${y2} L${x2 - c * Math.cos(a + 0.45)} ${y2 - c * Math.sin(a + 0.45)}" style="fill:none;stroke:${cor};stroke-width:${w}"/>`; };

  /* ---------- N01 · Euler × Lagrange: a derivada material ---------- */
  SIM.euleriano = (el, F) => {
    const FL = {
      estag: { nome: "ponto de estagnação (kx, −ky)", v: (x, y, t) => [x, -y], dvdt: () => [0, 0], ini: [-1.9, 1.9] },
      bocal: { nome: "bocal acelerando", v: (x, y, t) => [0.6 * (1 + (x + 2) / 2), (-0.6 * y) / 2], dvdt: () => [0, 0], ini: [-2, 0.8] },
      giro: { nome: "rotação rígida (−ωy, ωx)", v: (x, y, t) => [-y, x], dvdt: () => [0, 0], ini: [1.2, 0] },
      osc: { nome: "uniforme oscilando U sen ωt", v: (x, y, t) => [0.9 * Math.sin(1.5 * t), 0.25], dvdt: (x, y, t) => [0.9 * 1.5 * Math.cos(1.5 * t), 0], ini: [0, -1.8] },
    };
    let k = "estag", P, trilha, t, vivo = true, ult = null;
    const W = 460, H = 420, S = 2.3, X = (x) => W / 2 + (x * (W / 2 - 20)) / S, Y = (y) => H / 2 - (y * (H / 2 - 20)) / S;
    const sonda = [1.2, -1.2];
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv" style="cursor:crosshair;touch-action:none"></svg><div class="leitor" data-v="lt" style="flex-direction:column;align-items:stretch"></div></div>
      <div class="ctrls"><div class="bts">${botoes(Object.entries(FL).map(([kk, c]) => [kk, c.nome]), "k", k)}</div></div>
      <div class="status">As setas cinza são a descrição de <b>Euler</b>: a velocidade em cada ponto fixo do espaço. A bolinha laranja é a de <b>Lagrange</b>: uma partícula de fluido que a gente segue (clique para soltá-la em outro lugar). O <b>sensor</b> verde fica parado e mede a velocidade que passa por ele. Num escoamento estacionário, o sensor lê sempre o mesmo valor (∂v/∂t = 0), mas a partícula acelera: a aceleração dela é a derivada material, Dv/Dt = ∂v/∂t + (v·∇)v.</div>`);
    const q = (s) => el.querySelector(s);
    const reinicia = (pt) => { P = [...(pt || FL[k].ini)]; trilha = []; t = 0; };
    q("[data-v=sv]").addEventListener("pointerdown", (ev) => { const r = ev.currentTarget.getBoundingClientRect(); const x = (((ev.clientX - r.left) / r.width) * W - W / 2) * (S / (W / 2 - 20)), y = -(((ev.clientY - r.top) / r.height) * H - H / 2) * (S / (H / 2 - 20)); reinicia([x, y]); });
    const acelFormula = (x, y, tt) => { const C = FL[k], h = 1e-4, v = C.v(x, y, tt), vx1 = C.v(x + h, y, tt), vx0 = C.v(x - h, y, tt), vy1 = C.v(x, y + h, tt), vy0 = C.v(x, y - h, tt), dt = C.dvdt(x, y, tt);
      return [dt[0] + v[0] * (vx1[0] - vx0[0]) / (2 * h) + v[1] * (vy1[0] - vy0[0]) / (2 * h), dt[1] + v[0] * (vx1[1] - vx0[1]) / (2 * h) + v[1] * (vy1[1] - vy0[1]) / (2 * h)]; };
    function passo(dt) {
      const C = FL[k], f = (p, tt) => C.v(p[0], p[1], tt), n = 10, h = dt / n;
      for (let i = 0; i < n; i++) { const k1 = f(P, t), k2 = f([P[0] + (h / 2) * k1[0], P[1] + (h / 2) * k1[1]], t + h / 2), k3 = f([P[0] + (h / 2) * k2[0], P[1] + (h / 2) * k2[1]], t + h / 2), k4 = f([P[0] + h * k3[0], P[1] + h * k3[1]], t + h);
        P = [P[0] + (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), P[1] + (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])]; t += h; }
      trilha.push([...P]); if (trilha.length > 500) trilha.shift();
      if (Math.abs(P[0]) > S * 1.05 || Math.abs(P[1]) > S * 1.05) reinicia();
    }
    function desenha() {
      const C = FL[k];
      let s = "";
      for (let i = -2.2; i <= 2.21; i += 0.4) for (let j = -2.2; j <= 2.21; j += 0.4) { const [u, v] = C.v(i, j, t), m = Math.hypot(u, v); if (m < 1e-9) continue; const L = 0.12 * Math.min(1.5, m) + 0.04; s += seta(X(i - (u / m) * L), Y(j - (v / m) * L), X(i + (u / m) * L), Y(j + (v / m) * L), "var(--ink3)", 1); }
      s += `<path d="${trilha.map(([x, y], i) => (i ? "L" : "M") + X(x).toFixed(1) + " " + Y(y).toFixed(1)).join("")}" style="fill:none;stroke:var(--warn);stroke-width:2;opacity:.7"/><circle cx="${X(P[0])}" cy="${Y(P[1])}" r="7" style="fill:var(--warn);stroke:var(--card);stroke-width:2"/>`;
      const vs = C.v(sonda[0], sonda[1], t); s += `<rect x="${X(sonda[0]) - 7}" y="${Y(sonda[1]) - 7}" width="14" height="14" rx="3" style="fill:none;stroke:var(--ok);stroke-width:2.5"/>` + seta(X(sonda[0]), Y(sonda[1]), X(sonda[0] + vs[0] * 0.3), Y(sonda[1] + vs[1] * 0.3), "var(--ok)", 2);
      q("[data-v=sv]").innerHTML = s;
      const v = C.v(P[0], P[1], t), a = acelFormula(P[0], P[1], t), dv = C.dvdt(P[0], P[1], t);
      q("[data-v=lt]").innerHTML = vis("velocidade da partícula |v|", n2(Math.hypot(...v))) + vis("parte local ∂v/∂t (no ponto)", n2(Math.hypot(...dv))) + vis("aceleração da partícula |Dv/Dt|", n2(Math.hypot(...a))) + vis("sensor parado: |v| agora", n2(Math.hypot(...vs)));
    }
    function laco(ts) { if (!vivo) return; if (ult !== null) passo(Math.min(0.04, (ts - ult) / 1000)); ult = ts; desenha(); requestAnimationFrame(laco); }
    liga(el, "k", (v) => { k = v; reinicia(); });
    reinicia(); requestAnimationFrame(laco); F.aoSair(() => (vivo = false));
    SIM.euleriano._acel = (x, y, tt) => acelFormula(x, y, tt);
  };

  /* ---------- N02 · continuidade num bocal ---------- */
  SIM.bocal = (el, F) => {
    const W = 680, H = 260, N = 160;
    let pts = [], vivo = true, ult = null, cont = [0, 0], tCont = 0, taxa = ["—", "—"];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("diâmetro na entrada D₁ (cm)", "d1", 1, 4, 0.1, 2)}${sl("diâmetro no estreitamento D₂ (cm)", "d2", 0.5, 4, 0.1, 1)}${sl("velocidade na entrada v₁ (m/s, câmera lenta)", "v1", 0.2, 2, 0.05, 1)}</div>
      <div class="status">A água (incompressível) não pode se acumular em lugar nenhum: o que entra por segundo numa seção sai pela outra. Por isso, no estreitamento, ela anda mais rápido: A₁v₁ = A₂v₂. Repare que as bolinhas ficam mais espaçadas na direção do movimento onde é mais rápido, mas o número delas passando por segundo (contado nas duas janelas tracejadas) é o mesmo.</div>`);
    const q = (s) => el.querySelector(s);
    const perfil = (x, d1, d2) => { /* larga → estreita (no meio) → larga */ const a = 0.5 * (1 + Math.tanh((x - W * 0.36) / 22)), b = 0.5 * (1 + Math.tanh((x - W * 0.66) / 22)); const d = d1 + (d2 - d1) * a + (d1 - d2) * b; return d / 2; };
    const inicia = () => { pts = Array.from({ length: N }, (_, i) => [Math.random() * W, Math.random() * 2 - 1]); };
    function passo(dt) {
      const d1 = +q("[data-c=d1]").value, d2 = +q("[data-c=d2]").value, v1 = +q("[data-c=v1]").value, esc = 60;
      const janelas = [W * 0.14, W * 0.51];
      pts.forEach((p) => { const r = perfil(p[0], d1, d2), v = v1 * (d1 / (2 * r)) ** 2; const xa = p[0]; p[0] += v * esc * dt; janelas.forEach((jx, k) => { if (xa < jx && p[0] >= jx) cont[k]++; }); if (p[0] > W) { p[0] -= W; p[1] = Math.random() * 2 - 1; } });
      tCont += dt; if (tCont >= 2) { taxa = cont.map((c) => n2(c / tCont, 1)); cont = [0, 0]; tCont = 0; }
    }
    function desenha() {
      const d1 = +q("[data-c=d1]").value, d2 = +q("[data-c=d2]").value, v1 = +q("[data-c=v1]").value; ["d1", "d2", "v1"].forEach((c) => (q(`[data-o=${c}]`).textContent = n2(+q(`[data-c=${c}]`).value)));
      const Ey = 26, Y = (y) => H / 2 - y * Ey;
      let cima = "", baixo = ""; for (let x = 0; x <= W; x += 4) { const r = perfil(x, d1, d2); cima += (x ? "L" : "M") + x + " " + Y(r).toFixed(1); baixo += (x ? "L" : "M") + x + " " + Y(-r).toFixed(1); }
      let s = `<path d="${cima} L${W} 0 L0 0 Z" style="fill:var(--card2)"/><path d="${baixo} L${W} ${H} L0 ${H} Z" style="fill:var(--card2)"/><path d="${cima}" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="${baixo}" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
      [W * 0.14, W * 0.51].forEach((jx) => { const r = perfil(jx, d1, d2); s += `<line x1="${jx}" x2="${jx}" y1="${Y(r)}" y2="${Y(-r)}" style="stroke:var(--warn);stroke-width:1.5;stroke-dasharray:4 3"/>`; });
      pts.forEach(([x, f]) => { const r = perfil(x, d1, d2); s += `<circle cx="${x.toFixed(1)}" cy="${Y(f * r * 0.9).toFixed(1)}" r="2.6" style="fill:#7ab8e6"/>`; });
      q("[data-v=sv]").innerHTML = s;
      const A1 = (Math.PI * (d1 / 100) ** 2) / 4, A2 = (Math.PI * (d2 / 100) ** 2) / 4, v2 = (v1 * A1) / A2;
      q("[data-v=lt]").innerHTML = vis("v₁", n2(v1) + " m/s") + vis("v₂ = v₁·(D₁/D₂)²", n2(v2) + " m/s") + vis("vazão Q = A₁v₁", n2(A1 * v1 * 1000, 3) + " L/s") + vis("bolinhas/s nas duas janelas", taxa.join(" e "));
    }
    function laco(ts) { if (!vivo) return; if (ult !== null) passo(Math.min(0.04, (ts - ult) / 1000)); ult = ts; desenha(); requestAnimationFrame(laco); }
    inicia(); requestAnimationFrame(laco); F.aoSair(() => (vivo = false));
  };

  /* ---------- N03 · Bernoulli: Torricelli e Venturi ---------- */
  SIM.bernoulli = (el, F) => {
    const g = 9.81, W = 680, H = 330;
    let modo = "tanque", h = 1, t = 0, vivo = true, ult = null, rodando = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div data-v="ct" style="display:contents">${sl("altura do furo y (m)", "y", 0.05, 0.95, 0.01, 0.5)}${sl("área do tanque ÷ área do furo", "r", 20, 400, 10, 100)}</div>
      <div data-v="cv" style="display:none">${sl("velocidade na parte larga v₁ (m/s)", "v1", 0.2, 3, 0.05, 1)}${sl("área larga ÷ área estreita", "ra", 1, 4, 0.1, 2)}</div>
      <div class="bts">${botoes([["tanque", "tanque com furo (Torricelli)"], ["venturi", "tubo de Venturi"]], "m", modo)}<button class="bt pri" data-a="go">Esvaziar o tanque</button><button class="bt peq" data-a="re">Encher de novo</button></div></div>
      <div class="status" data-v="txt"></div>`);
    const q = (s) => el.querySelector(s);
    const textos = { tanque: "Tanque de 1 m de altura com um furo pequeno. Bernoulli entre a superfície (parada, pressão atmosférica) e o jato (também na pressão atmosférica): v = √(2g·Δh), a mesma velocidade de uma pedra caindo dessa altura. O jato vai mais longe com o furo no meio da coluna. Esvaziando, o jato enfraquece e o nível desce cada vez mais devagar.", venturi: "No estreitamento, a água anda mais rápido (continuidade) e, por Bernoulli, a pressão cai: p₁ − p₂ = ½ρ(v₂² − v₁²). Os tubinhos verticais (manômetros) mostram a pressão como altura de coluna de água. É assim que se mede vazão em encanamentos, e é o princípio do carburador e do borrifador." };
    function desenha(dt) {
      const yb = +q("[data-c=y]").value, r = +q("[data-c=r]").value, v1 = +q("[data-c=v1]").value, ra = +q("[data-c=ra]").value;
      ["y", "r", "v1", "ra"].forEach((c) => (q(`[data-o=${c}]`).textContent = n2(+q(`[data-c=${c}]`).value)));
      q("[data-v=ct]").style.display = modo === "tanque" ? "contents" : "none"; q("[data-v=cv]").style.display = modo === "venturi" ? "contents" : "none";
      q("[data-a=go]").style.display = q("[data-a=re]").style.display = modo === "tanque" ? "" : "none";
      q("[data-v=txt]").textContent = textos[modo];
      let s = "";
      if (modo === "tanque") {
        if (rodando && h > yb) { const n = 20; for (let i = 0; i < n; i++) { h -= ((dt / n) / r) * Math.sqrt(2 * g * Math.max(0, h - yb)); } t += dt; if (h <= yb + 1e-4) { h = yb; rodando = false; } }
        const esc = 230, x0 = 70, base = H - 40, Y = (y) => base - y * esc, X = (x) => x0 + 80 + x * esc;
        const v = Math.sqrt(2 * g * Math.max(0, h - yb)), tq = Math.sqrt((2 * yb) / g), alc = v * tq;
        s += `<line x1="0" x2="${W}" y1="${base}" y2="${base}" style="stroke:var(--ink2);stroke-width:2"/><rect x="${x0}" y="${Y(1)}" width="80" height="${esc}" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
        s += `<rect x="${x0 + 1}" y="${Y(h)}" width="78" height="${Y(0) - Y(h)}" style="fill:#7ab8e6;opacity:.55"/>`;
        if (v > 0.01) { let d = ""; for (let i = 0; i <= 40; i++) { const tt = (tq * i) / 40, x = v * tt, y = yb - 0.5 * g * tt * tt; d += (i ? "L" : "M") + X(x).toFixed(1) + " " + Y(Math.max(0, y)).toFixed(1); } s += `<path d="${d}" style="fill:none;stroke:#7ab8e6;stroke-width:4;stroke-linecap:round"/>`; }
        s += `<circle cx="${x0 + 80}" cy="${Y(yb)}" r="3" style="fill:var(--ink)"/><text class="tx2" x="${x0 - 8}" y="${Y(1) + 4}" text-anchor="end">1 m</text>`;
        const tTot = r * Math.sqrt((2 * (1 - yb)) / g);
        q("[data-v=lt]").innerHTML = vis("velocidade do jato √(2g(h − y))", n2(v) + " m/s") + vis("alcance no chão", n2(alc) + " m") + vis("tempo para esvaziar até o furo", n2(tTot, 1) + " s") + vis("tempo passado", n2(t, 1) + " s");
      } else {
        const v2 = v1 * ra, dp = 0.5 * 1000 * (v2 * v2 - v1 * v1), dh = dp / (1000 * g);
        const cy = 230, Y = (y) => cy - y, r1 = 40, r2 = r1 / Math.sqrt(ra), perf = (x) => { const a = 0.5 * (1 + Math.tanh((x - 260) / 25)), b = 0.5 * (1 + Math.tanh((x - 420) / 25)); return r1 + (r2 - r1) * a + (r1 - r2) * b; };
        let c = "", bx = ""; for (let x = 20; x <= W - 20; x += 4) { c += (x > 20 ? "L" : "M") + x + " " + Y(perf(x)).toFixed(1); bx += (x > 20 ? "L" : "M") + x + " " + Y(-perf(x)).toFixed(1); }
        s += `<path d="${c}" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="${bx}" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
        const h1 = 120, h2 = Math.max(4, h1 - dh * 400), esc = 400;
        [[150, h1], [340, h2]].forEach(([x, hh]) => { const top = cy - perf(x); s += `<rect x="${x - 7}" y="${top - 150}" width="14" height="150" style="fill:none;stroke:var(--ink3)"/><rect x="${x - 6}" y="${top - hh}" width="12" height="${hh}" style="fill:#7ab8e6;opacity:.7"/>`; });
        s += `<path d="M${150 + 14} ${cy - perf(150) - h1} L${340 - 14} ${cy - perf(150) - h1}" style="stroke:var(--ink3);stroke-dasharray:3 3"/>` + seta(160, cy - perf(150) - h1, 160, cy - perf(340) - h2, "var(--warn)", 1.6) + `<text class="tx2" x="168" y="${cy - perf(150) - h1 + 30}">Δh = ${n2(dh * 100, 1)} cm</text>`;
        for (let i = 0; i < 9; i++) { const x = 60 + ((performance.now() / 1000) * 40 * v1 + i * 70) % (W - 120); s += seta(x, cy, x + 12 * (r1 / perf(x)) ** 2, cy, "#7ab8e6", 1.6); }
        q("[data-v=lt]").innerHTML = vis("v₂ = v₁·(A₁/A₂)", n2(v2) + " m/s") + vis("p₁ − p₂ = ½ρ(v₂² − v₁²)", n2(dp, 0) + " Pa") + vis("diferença nos tubinhos Δh", n2(dh * 100, 1) + " cm");
      }
      q("[data-v=sv]").innerHTML = s;
    }
    function laco(ts) { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; desenha(dt); requestAnimationFrame(laco); }
    q("[data-a=go]").addEventListener("click", () => { rodando = true; });
    q("[data-a=re]").addEventListener("click", () => { h = 1; t = 0; rodando = false; });
    q("[data-c=y]").addEventListener("input", () => { h = 1; t = 0; rodando = false; });
    liga(el, "m", (v) => { modo = v; });
    requestAnimationFrame(laco); F.aoSair(() => (vivo = false));
  };

  /* ---------- N04 · o elemento de fluido: rotação, deformação e tensão viscosa ---------- */
  SIM.elemento = (el, F) => {
    const FL = { cis: ["cisalhamento u = (γ̇y, 0)", [[0, 1], [0, 0]]], def: ["deformação pura (εx, −εy)", [[1, 0], [0, -1]]], rot: ["rotação (−Ωy, Ωx)", [[0, -1], [1, 0]]] };
    const VISC = { agua: ["água", 1.0e-3], mel: ["mel", 10], ar: ["ar", 1.8e-5] };
    let k = "cis", fl = "agua", t = 0, vivo = true, ult = null;
    const W = 420, H = 380;
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg><div class="leitor" data-v="lt" style="flex-direction:column;align-items:stretch"></div></div>
      <div class="ctrls">${sl("taxa (1/s): γ̇, ε ou Ω", "g", 0.2, 2, 0.05, 1)}
      <div class="bts">${botoes(Object.entries(FL).map(([kk, c]) => [kk, c[0]]), "k", k)}</div><div class="bts">${botoes(Object.entries(VISC).map(([kk, c]) => [kk, c[0]]), "f", fl)}</div></div>
      <div class="status">Um quadradinho de fluido (com uma "cruz" pintada dentro) é levado pelo escoamento. O gradiente de velocidade ∇v se separa em duas partes: a <b>simétrica</b> D (taxa de deformação: estica, achata, entorta os ângulos) e a <b>antissimétrica</b> W (rotação rígida, metade da vorticidade). Só a deformação gera tensão viscosa: τ = 2μD. Na rotação pura, o quadrado gira sem se deformar e a tensão viscosa é zero. O cisalhamento é deformação + rotação.</div>`);
    const q = (s) => el.querySelector(s);
    const expm = (A, s) => { /* exp(A·s) para 2×2 por série */ let R = [[1, 0], [0, 1]], T = [[1, 0], [0, 1]]; for (let n = 1; n < 30; n++) { T = [[(T[0][0] * A[0][0] + T[0][1] * A[1][0]) * s / n, (T[0][0] * A[0][1] + T[0][1] * A[1][1]) * s / n], [(T[1][0] * A[0][0] + T[1][1] * A[1][0]) * s / n, (T[1][0] * A[0][1] + T[1][1] * A[1][1]) * s / n]]; R = [[R[0][0] + T[0][0], R[0][1] + T[0][1]], [R[1][0] + T[1][0], R[1][1] + T[1][1]]]; } return R; };
    function desenha(dt) {
      const gg = +q("[data-c=g]").value; q("[data-o=g]").textContent = n2(gg);
      t += dt; if (t > 2.2) t = 0;
      const G = FL[k][1].map((r) => r.map((x) => x * gg)), M = expm(G, t);
      const esc = 70, X = (x) => W / 2 + x * esc, Y = (y) => H / 2 - y * esc, P = ([x, y]) => [M[0][0] * x + M[0][1] * y, M[1][0] * x + M[1][1] * y];
      let s = "";
      for (let i = -2.5; i <= 2.51; i += 0.5) for (let j = -2.5; j <= 2.51; j += 0.5) { const u = G[0][0] * i + G[0][1] * j, v = G[1][0] * i + G[1][1] * j, m = Math.hypot(u, v); if (m < 1e-9) continue; const L = 0.08 + 0.06 * Math.min(2, m); s += seta(X(i - (u / m) * L), Y(j - (v / m) * L), X(i + (u / m) * L), Y(j + (v / m) * L), "var(--ink3)", 1); }
      const sq = [[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8]].map(P);
      s += `<polygon points="${[[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8]].map(([x, y]) => X(x) + "," + Y(y)).join(" ")}" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/>`;
      s += `<polygon points="${sq.map(([x, y]) => X(x).toFixed(1) + "," + Y(y).toFixed(1)).join(" ")}" style="fill:color-mix(in srgb,var(--mod) 25%,transparent);stroke:var(--mod);stroke-width:2.5"/>`;
      const a = P([-0.8, 0]), b = P([0.8, 0]), c = P([0, -0.8]), d = P([0, 0.8]);
      s += `<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" style="stroke:var(--warn);stroke-width:2.5"/><line x1="${X(c[0])}" y1="${Y(c[1])}" x2="${X(d[0])}" y2="${Y(d[1])}" style="stroke:var(--warn);stroke-width:2.5"/>`;
      q("[data-v=sv]").innerHTML = s;
      const D = [[G[0][0], (G[0][1] + G[1][0]) / 2], [(G[0][1] + G[1][0]) / 2, G[1][1]]], wz = G[1][0] - G[0][1], mu = VISC[fl][1];
      const ang = (Math.acos(Math.max(-1, Math.min(1, ((b[0] - a[0]) * (d[0] - c[0]) + (b[1] - a[1]) * (d[1] - c[1])) / (Math.hypot(b[0] - a[0], b[1] - a[1]) * Math.hypot(d[0] - c[0], d[1] - c[1]))))) * 180) / Math.PI;
      const fmt = (x) => (Math.abs(x) < 1e-12 ? "0" : F.cient(x, 2)) + " Pa";
      q("[data-v=lt]").innerHTML = vis("taxa de deformação D", `[${n2(D[0][0])}  ${n2(D[0][1])} ; ${n2(D[1][0])}  ${n2(D[1][1])}]`) + vis("vorticidade ω = ∂v/∂x − ∂u/∂y", n2(wz) + " 1/s") + vis("ângulo da cruz (era 90°)", n2(ang, 1) + "°") + vis(`tensão viscosa τₓᵧ = 2μDₓᵧ (${VISC[fl][0]})`, fmt(2 * mu * D[0][1])) + vis("tensão normal extra 2μDₓₓ", fmt(2 * mu * D[0][0]));
    }
    function laco(ts) { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; desenha(dt); requestAnimationFrame(laco); }
    liga(el, "k", (v) => { k = v; t = 0; });
    liga(el, "f", (v) => { fl = v; });
    requestAnimationFrame(laco); F.aoSair(() => (vivo = false));
  };
})();
