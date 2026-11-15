/* Simulações de Fluidos (N01–N07): Euler × Lagrange e derivada material, bocal (continuidade), Torricelli e Venturi (Bernoulli),
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
    /* β 4.7 (correção autorizada pelo Lucas): no regime permanente o fluxo n·v é o mesmo em toda seção, então a densidade de bolinhas
       tem que ser ∝ 1/v. Como todas levam o mesmo tempo T para dar a volta, começar espalhadas por igual em x nunca se desfazia, e as
       janelas só concordavam na média de um ciclo inteiro. Agora elas ficam igualmente espaçadas no TEMPO DE PERCURSO τ(x) = ∫dx/v:
       cada janela vê uma bolinha a cada T/N. Conferido em Python (n02.py): antes, janelas de 2 s discordavam até 69%; agora, no
       máximo 2%, com média 20,13 bolinhas/s para N/T = 20,15 (D₁ = 2, D₂ = 0,5, v₁ = 1). Quando D₁ ou D₂ mudam, cada bolinha vai para a
       mesma fração de τ no perfil novo (a ordem se mantém). Mudar só v₁ multiplica todas as velocidades: o espaçamento continua certo. */
    const velPx = (x, d1, d2, v1) => v1 * (d1 / (2 * perfil(x, d1, d2))) ** 2 * 60;
    const tabela = (d1, d2) => { const M = 1000, xs = [], tau = [0]; for (let i = 0; i <= M; i++) xs.push((W * i) / M);
      for (let i = 0; i < M; i++) tau.push(tau[i] + (xs[i + 1] - xs[i]) * 0.5 * (1 / velPx(xs[i], d1, d2, 1) + 1 / velPx(xs[i + 1], d1, d2, 1))); return { xs, tau, T: tau[M] }; };
    const xDeTau = (t, tb) => { let lo = 1, hi = tb.tau.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (tb.tau[m] < t) lo = m + 1; else hi = m; } const k = lo, f = (t - tb.tau[k - 1]) / (tb.tau[k] - tb.tau[k - 1]); return tb.xs[k - 1] + f * (tb.xs[k] - tb.xs[k - 1]); };
    const tauDeX = (x, tb) => { const M = tb.xs.length - 1, k = Math.max(1, Math.min(M, Math.floor((x / W) * M) + 1)), f = (x - tb.xs[k - 1]) / (tb.xs[k] - tb.xs[k - 1]); return tb.tau[k - 1] + f * (tb.tau[k] - tb.tau[k - 1]); };
    let perfilAtual = null; /* [d1, d2, tabela] */
    const inicia = () => { const d1 = +q("[data-c=d1]").value, d2 = +q("[data-c=d2]").value, tb = tabela(d1, d2); perfilAtual = [d1, d2, tb];
      pts = Array.from({ length: N }, (_, i) => [xDeTau(((i + 0.5) * tb.T) / N, tb), Math.random() * 2 - 1]); };
    function passo(dt) {
      const d1 = +q("[data-c=d1]").value, d2 = +q("[data-c=d2]").value, v1 = +q("[data-c=v1]").value, esc = 60;
      if (perfilAtual && (perfilAtual[0] !== d1 || perfilAtual[1] !== d2)) { /* o bocal mudou: cada bolinha vai para a mesma fração do tempo de percurso no perfil novo */
        const velho = perfilAtual[2], novo = tabela(d1, d2); pts.forEach((p) => { p[0] = xDeTau((tauDeX(p[0], velho) / velho.T) * novo.T, novo); }); perfilAtual = [d1, d2, novo]; }
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
  /* ---------- N05 · o termo viscoso é difusão de momento: placa posta em movimento de repente (1º problema de Stokes) ---------- */
  const erfc = (x) => { /* Abramowitz–Stegun 7.1.26, erro < 1,5e-7 */ const s = x < 0 ? -1 : 1, z = Math.abs(x), t = 1 / (1 + 0.3275911 * z); const y = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))) * Math.exp(-z * z); return s > 0 ? y : 2 - y; };
  SIM.stokes1 = (el, F) => {
    const FL = { agua: ["água", 1.0e-6], oleo: ["óleo de motor", 1.1e-4], mel: ["mel", 7e-3] };
    let fl = "agua", t = 0, vivo = true, ult = null, rodando = true;
    const W = 640, H = 320, U = 1;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("altura da janela (mm)", "L", 2, 60, 1, 10)}${sl("velocidade da simulação (× tempo real)", "ac", 0.1, 20, 0.1, 1)}
      <div class="bts">${botoes(Object.entries(FL).map(([k, c]) => [k, c[0]]), "f", fl)}<button class="bt pri" data-a="re">Recomeçar</button><button class="bt peq" data-a="pa">Pausar</button></div></div>
      <div class="status">No instante 0, a placa de baixo passa a andar a 1 m/s; o fluido acima estava parado. Navier–Stokes, neste caso, vira ∂u/∂t = ν ∂²u/∂y²: a mesma equação do calor. O movimento "se espalha" para cima por difusão, e a espessura da camada que já foi arrastada cresce como √(νt), não proporcional a t. A curva laranja é a solução exata u = U·erfc(y / 2√(νt)); as setas são a velocidade em cada altura.</div>`);
    const q = (s) => el.querySelector(s);
    const u = (y, tt, nu) => (tt <= 0 ? (y <= 0 ? U : 0) : U * erfc(y / (2 * Math.sqrt(nu * tt))));
    SIM.stokes1._u = (y, tt, nu) => u(y, tt, nu);
    function desenha(dt) {
      const Lmm = +q("[data-c=L]").value, ac = +q("[data-c=ac]").value, nu = FL[fl][1];
      q("[data-o=L]").textContent = n2(Lmm, 0); q("[data-o=ac]").textContent = n2(ac, 1);
      if (rodando) t += dt * ac;
      const L = Lmm / 1000, x0 = 60, x1 = 330, base = H - 30, topo = 20, Y = (y) => base - (y / L) * (base - topo), X = (v) => x0 + v * (x1 - x0);
      let s = `<rect x="${x0 - 10}" y="${base}" width="${x1 - x0 + 40}" height="10" style="fill:var(--ink3)"/>`;
      s += seta(x0 + 20, base + 22, x0 + 90, base + 22, "var(--ink2)", 1.6) + `<text class="tx2" x="${x0 + 96}" y="${base + 26}">placa: U = 1 m/s</text>`;
      for (let i = 1; i <= 12; i++) { const y = (L * i) / 12.5, v = u(y, t, nu); if (v > 0.004) s += seta(x0, Y(y), X(v), Y(y), "#7ab8e6", 1.6); }
      let d = ""; for (let i = 0; i <= 120; i++) { const y = (L * i) / 120; d += (i ? "L" : "M") + X(u(y, t, nu)).toFixed(1) + " " + Y(y).toFixed(1); }
      s += `<path d="${d}" style="fill:none;stroke:var(--warn);stroke-width:2.5"/><line x1="${x0}" x2="${x0}" y1="${topo}" y2="${base}" style="stroke:var(--ink3)"/>`;
      const delta = 3.64 * Math.sqrt(nu * t); /* onde u cai a 1% de U: erfc(η) = 0,01 em η ≈ 1,82 */
      if (delta < L) s += `<line x1="${x0}" x2="${x1}" y1="${Y(delta)}" y2="${Y(delta)}" style="stroke:var(--ink3);stroke-dasharray:4 4"/><text class="tx2" x="${x1 + 6}" y="${Y(delta) + 4}">u = 1% de U</text>`;
      [0, 0.5, 1].forEach((v) => (s += `<text class="tx2" x="${X(v)}" y="${topo - 6}" text-anchor="middle">${n2(v, 1)}</text>`));
      /* gráfico δ × t à direita */
      const gx0 = 420, gx1 = W - 20, gy0 = base, gy1 = topo + 20, T = Math.max(1, t * 1.2), Dm = 3.64 * Math.sqrt(nu * T);
      s += `<line x1="${gx0}" x2="${gx1}" y1="${gy0}" y2="${gy0}" style="stroke:var(--ink3)"/><line x1="${gx0}" x2="${gx0}" y1="${gy0}" y2="${gy1}" style="stroke:var(--ink3)"/><text class="tx2" x="${(gx0 + gx1) / 2}" y="${gy0 + 18}" text-anchor="middle">tempo</text><text class="tx2" x="${gx0 - 6}" y="${gy1 - 6}">espessura arrastada</text>`;
      let g = ""; for (let i = 0; i <= 60; i++) { const tt = (T * i) / 60; g += (i ? "L" : "M") + (gx0 + ((gx1 - gx0) * tt) / T).toFixed(1) + " " + (gy0 - ((gy0 - gy1) * 3.64 * Math.sqrt(nu * tt)) / Dm).toFixed(1); }
      s += `<path d="${g}" style="fill:none;stroke:var(--mod);stroke-width:2"/><circle cx="${gx0 + ((gx1 - gx0) * t) / T}" cy="${gy0 - ((gy0 - gy1) * delta) / Dm}" r="4" style="fill:var(--warn)"/>`;
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("tempo desde a partida", n2(t, 2) + " s") + vis(`viscosidade cinemática ν (${FL[fl][0]})`, F.cient(nu, 2) + " m²/s") + vis("espessura arrastada (u > 1% de U) ≈ 3,64√(νt)", n2(delta * 1000, 2) + " mm") + vis("u na metade da janela", n2(u(L / 2, t, nu), 3) + " m/s");
    }
    function laco(ts) { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; desenha(dt); requestAnimationFrame(laco); }
    q("[data-a=re]").addEventListener("click", () => { t = 0; rodando = true; q("[data-a=pa]").textContent = "Pausar"; });
    q("[data-a=pa]").addEventListener("click", (e) => { rodando = !rodando; e.currentTarget.textContent = rodando ? "Pausar" : "Continuar"; });
    liga(el, "f", (v) => { fl = v; t = 0; });
    SIM.stokes1._t = (v) => { t = v; rodando = false; };
    requestAnimationFrame(laco); F.aoSair(() => (vivo = false));
  };

  /* ---------- N06 · Couette, Poiseuille plano e Hagen–Poiseuille ---------- */
  SIM.canal = (el, F) => {
    let modo = "canal", vivo = true, ult = null, fase = 0;
    const W = 640, H = 320, mu = 1.0e-3, rho = 1000; /* água */
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div data-v="cc" style="display:contents">${sl("velocidade da placa de cima U (mm/s)", "U", -20, 20, 0.5, 10)}${sl("gradiente de pressão G = −dp/dx (Pa/m)", "G", -40, 40, 0.5, 0)}${sl("distância entre as placas h (mm)", "h", 0.5, 4, 0.1, 2)}</div>
      <div data-v="ct" style="display:none">${sl("gradiente de pressão G = −dp/dx (Pa/m)", "Gt", 1, 100, 1, 20)}${sl("raio do cano R (mm)", "R", 0.2, 3, 0.05, 1)}</div>
      <div class="bts">${botoes([["canal", "entre placas (Couette + Poiseuille)"], ["tubo", "cano (Hagen–Poiseuille)"]], "m", modo)}</div></div>
      <div class="status" data-v="txt"></div>`);
    const q = (s) => el.querySelector(s);
    const txt = { canal: "Água entre duas placas paralelas muito largas. Duas causas de movimento: a placa de cima andando (Couette: perfil reto) e a diferença de pressão empurrando (Poiseuille: perfil parabólico). Como a equação ficou linear, os perfis simplesmente se somam: u(y) = U·y/h + (G/2μ)·y(h − y). Com G negativo (pressão crescendo no sentido da placa) dá para ter fluido voltando perto da placa de baixo.", tubo: "Água num cano fino, empurrada pela diferença de pressão. O perfil é um paraboloide: u(r) = G(R² − r²)/(4μ), máximo no centro e zero na parede. A vazão é Q = πGR⁴/(8μ): com metade do raio, a vazão cai 16 vezes. Por isso uma artéria um pouco entupida é tão perigosa." };
    const perfil = (y, U, G, h) => U * (y / h) + (G / (2 * mu)) * y * (h - y);
    SIM.canal._u = perfil; SIM.canal._Q = (G, R) => (Math.PI * G * R ** 4) / (8 * mu);
    function desenha(dt) {
      fase += dt;
      q("[data-v=cc]").style.display = modo === "canal" ? "contents" : "none"; q("[data-v=ct]").style.display = modo === "tubo" ? "contents" : "none"; q("[data-v=txt]").textContent = txt[modo];
      ["U", "G", "h", "Gt", "R"].forEach((c) => (q(`[data-o=${c}]`).textContent = n2(+q(`[data-c=${c}]`).value, c === "h" || c === "R" ? 2 : 1)));
      const x0 = 80, x1 = W - 80, yb = H - 50, yt = 50, mid = (x0 + x1) / 2;
      let s = "";
      if (modo === "canal") {
        const U = +q("[data-c=U]").value / 1000, G = +q("[data-c=G]").value, h = +q("[data-c=h]").value / 1000;
        const us = []; for (let i = 0; i <= 60; i++) us.push(perfil((h * i) / 60, U, G, h));
        const umax = Math.max(1e-6, ...us.map(Math.abs)), esc = (x1 - mid - 30) / umax, Y = (y) => yb - (y / h) * (yb - yt);
        s += `<rect x="${x0}" y="${yb}" width="${x1 - x0}" height="8" style="fill:var(--ink3)"/><rect x="${x0}" y="${yt - 8}" width="${x1 - x0}" height="8" style="fill:var(--ink3)"/><line x1="${mid}" x2="${mid}" y1="${yt}" y2="${yb}" style="stroke:var(--ink3);stroke-dasharray:3 3"/>`;
        if (Math.abs(U) > 1e-6) s += seta(x1 - 80, yt - 20, x1 - 80 + 50 * Math.sign(U), yt - 20, "var(--ink2)", 1.8) + `<text class="tx2" x="${x1 - 80}" y="${yt - 26}" text-anchor="middle">U</text>`;
        for (let i = 1; i < 12; i++) { const y = (h * i) / 12, v = perfil(y, U, G, h); if (Math.abs(v * esc) > 3) s += seta(mid, Y(y), mid + v * esc, Y(y), "#7ab8e6", 1.6); }
        s += `<path d="${us.map((v, i) => (i ? "L" : "M") + (mid + v * esc).toFixed(1) + " " + Y((h * i) / 60).toFixed(1)).join("")}" style="fill:none;stroke:var(--warn);stroke-width:2.5"/>`;
        for (let i = 0; i < 14; i++) { const yy = (h * (i + 0.5)) / 14, v = perfil(yy, U, G, h), xx = x0 + ((((fase * v * esc * 0.6 + i * 37) % (x1 - x0)) + (x1 - x0)) % (x1 - x0)); s += `<circle cx="${xx.toFixed(1)}" cy="${Y(yy).toFixed(1)}" r="2.5" style="fill:var(--mod);opacity:.7"/>`; }
        const Qw = (U * h) / 2 + (G * h ** 3) / (12 * mu), tb = mu * (U / h + (G * h) / (2 * mu)), tt = mu * (U / h - (G * h) / (2 * mu));
        const volta = us.some((v) => v < -1e-9) && us.some((v) => v > 1e-9);
        q("[data-v=lt]").innerHTML = vis("vazão por metro de largura Q/b = Uh/2 + Gh³/12μ", n2(Qw * 1e6, 2) + " mm²/s") + vis("velocidade média", n2((Qw / h) * 1000, 2) + " mm/s") + vis("tensão na placa de baixo τ = μ du/dy", n2(tb * 1000, 2) + " mPa") + vis("tensão na placa de cima", n2(tt * 1000, 2) + " mPa") + vis("tem fluido voltando?", volta ? "sim" : "não");
      } else {
        const G = +q("[data-c=Gt]").value, R = +q("[data-c=R]").value / 1000, umax = (G * R * R) / (4 * mu), Q = SIM.canal._Q(G, R), vm = Q / (Math.PI * R * R), Re = (rho * vm * 2 * R) / mu;
        const Y = (r) => (yb + yt) / 2 - (r / R) * ((yb - yt) / 2), esc = (x1 - mid - 30) / umax;
        s += `<rect x="${x0}" y="${yb}" width="${x1 - x0}" height="8" style="fill:var(--ink3)"/><rect x="${x0}" y="${yt - 8}" width="${x1 - x0}" height="8" style="fill:var(--ink3)"/><line x1="${mid}" x2="${mid}" y1="${yt}" y2="${yb}" style="stroke:var(--ink3);stroke-dasharray:3 3"/>`;
        for (let i = -10; i <= 10; i++) { if (i === -10 || i === 10) continue; const r = (R * i) / 10, v = (G * (R * R - r * r)) / (4 * mu); s += seta(mid, Y(r), mid + v * esc, Y(r), "#7ab8e6", 1.6); }
        let d = ""; for (let i = -40; i <= 40; i++) { const r = (R * i) / 40; d += (i > -40 ? "L" : "M") + (mid + ((G * (R * R - r * r)) / (4 * mu)) * esc).toFixed(1) + " " + Y(r).toFixed(1); } s += `<path d="${d}" style="fill:none;stroke:var(--warn);stroke-width:2.5"/>`;
        q("[data-v=lt]").innerHTML = vis("velocidade no centro GR²/4μ", n2(umax * 1000, 2) + " mm/s") + vis("vazão Q = πGR⁴/8μ", F.cient(Q * 1e6, 3) + " mL/s") + vis("velocidade média (metade da máxima)", n2(vm * 1000, 2) + " mm/s") + vis("número de Reynolds ρv̄D/μ", n2(Re, 1)) + vis("tensão na parede τ = GR/2", n2((G * R) / 2 * 1000, 2) + " mPa");
      }
      q("[data-v=sv]").innerHTML = s;
    }
    function laco(ts) { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; desenha(dt); requestAnimationFrame(laco); }
    liga(el, "m", (v) => { modo = v; });
    requestAnimationFrame(laco); F.aoSair(() => (vivo = false));
  };

  /* ---------- N07 · o experimento de Reynolds (1883): filete de corante num cano ---------- */
  SIM.reynolds = (el, F) => {
    const FL = { agua: ["água", 1000, 1.0e-3], ar: ["ar", 1.2, 1.8e-5], oleo: ["óleo de motor", 900, 0.1], glic: ["glicerina", 1260, 1.4] };
    let fl = "agua", vivo = true, ult = null, tt = 0;
    const W = 680, H = 300;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("velocidade média v (m/s)", "v", 0.01, 3, 0.01, 0.05)}${sl("diâmetro do cano D (cm)", "D", 0.5, 10, 0.1, 2)}
      <div class="bts">${botoes(Object.entries(FL).map(([k, c]) => [k, c[0]]), "f", fl)}</div></div>
      <div class="status">Reynolds injetou um filete de corante no meio de um cano de vidro. Com Re = ρvD/μ baixo, o filete segue reto (<b>laminar</b>); acima de uns 2300 começam a aparecer "baforadas" turbulentas (<b>transição</b>); acima de uns 4000, o corante se mistura no cano inteiro logo depois de entrar (<b>turbulento</b>). O desenho é uma ilustração qualitativa; os números (Re, regime, fator de atrito) são calculados de verdade.</div>`);
    const q = (s) => el.querySelector(s);
    const regime = (Re) => (Re < 2300 ? "laminar" : Re < 4000 ? "transição" : "turbulento");
    const atrito = (Re) => (Re < 2300 ? 64 / Re : 0.316 * Math.pow(Re, -0.25));
    SIM.reynolds._Re = (rho, v, D, mu) => (rho * v * D) / mu; SIM.reynolds._f = atrito; SIM.reynolds._regime = regime;
    /* ruído suave determinístico */
    const rn = (x) => { const s = Math.sin(x * 12.9898) * 43758.5453; return s - Math.floor(s); };
    const ruido = (x) => { const i = Math.floor(x), f = x - i, a = rn(i), b = rn(i + 1); return a + (b - a) * f * f * (3 - 2 * f) - 0.5; };
    function desenha(dt) {
      tt += dt;
      const v = +q("[data-c=v]").value, D = +q("[data-c=D]").value / 100, [nome, rho, mu] = FL[fl], Re = SIM.reynolds._Re(rho, v, D, mu), reg = regime(Re);
      q("[data-o=v]").textContent = n2(v, 2); q("[data-o=D]").textContent = n2(D * 100, 1);
      const x0 = 30, x1 = W - 30, cy = H / 2, r = 70;
      let s = `<rect x="${x0}" y="${cy - r - 6}" width="${x1 - x0}" height="6" style="fill:var(--ink3)"/><rect x="${x0}" y="${cy + r}" width="${x1 - x0}" height="6" style="fill:var(--ink3)"/>`;
      s += `<rect x="${x0 - 14}" y="${cy - 4}" width="30" height="8" rx="3" style="fill:var(--ink2)"/>`;
      /* intensidade da bagunça: 0 (laminar) → 1 (turbulento); na transição, liga e desliga em baforadas */
      let amp = Re < 2300 ? 0 : Re < 4000 ? (ruido(tt * 0.8) > 0.05 ? (Re - 2300) / 1700 : 0) : 1;
      const linhas = amp > 0.6 ? 7 : 1;
      for (let L = 0; L < linhas; L++) {
        let d = "";
        for (let x = x0 + 16; x <= x1; x += 4) {
          const s0 = (x - x0) / (x1 - x0), cresce = Math.min(1, s0 * (amp > 0.6 ? 6 : 2.5)), off = L === 0 ? 0 : (L - 3) * 14 * cresce;
          const y = cy + off + amp * cresce * r * 0.85 * (ruido((x - tt * 260) * 0.035 + L * 7.1) * 1.6 + 0.6 * ruido((x - tt * 300) * 0.11 + L * 3.3));
          d += (x > x0 + 16 ? "L" : "M") + x + " " + Math.max(cy - r + 3, Math.min(cy + r - 3, y)).toFixed(1);
        }
        s += `<path d="${d}" style="fill:none;stroke:#d9468a;stroke-width:${L === 0 ? 2.5 : 1.6};opacity:${L === 0 ? 0.95 : 0.55}"/>`;
      }
      if (amp > 0.6) s += `<rect x="${x0 + 120}" y="${cy - r}" width="${x1 - x0 - 120}" height="${2 * r}" style="fill:#d9468a;opacity:.12"/>`;
      s += `<text class="tx2" x="${W / 2}" y="${H - 12}" text-anchor="middle">${reg}</text>`;
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis(`Re = ρvD/μ (${nome})`, Re >= 1e5 ? F.cient(Re, 2) : n2(Re, Re < 10 ? 2 : 0)) + vis("regime", reg) + vis(Re < 2300 ? "fator de atrito 64/Re" : "fator de atrito (Blasius) 0,316·Re^(−1/4)", n2(atrito(Re), 4)) + vis("queda de pressão por metro Δp/L = f·ρv²/2D", n2((atrito(Re) * rho * v * v) / (2 * D), 2) + " Pa/m");
    }
    function laco(ts) { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; desenha(dt); requestAnimationFrame(laco); }
    liga(el, "f", (v) => { fl = v; });
    requestAnimationFrame(laco); F.aoSair(() => (vivo = false));
  };
})();
