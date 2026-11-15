/* Simulações do módulo Teoremas (Cálculo): TE01 braquistócrona (corrida de 4 curvas), TE02 divergência como soma de caixinhas,
   TE03 Pappus (volume de revolução por dois caminhos), TE04 Stokes (o mesmo fluxo do rotacional por qualquer "chapéu"),
   TE05 Noether (o que se conserva em cada potencial). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${k === ativo}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 3) => (!isFinite(v) ? "—" : Math.abs(v) < 0.5 * Math.pow(10, -d) ? "0" : (+v.toFixed(d)).toString().replace(".", ",").replace("-", "−"));
  const seta = (x1, y1, x2, y2, cor, w = 1.3) => { const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1), c = Math.min(5, L * 0.45); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${cor};stroke-width:${w}"/><path d="M${x2 - c * Math.cos(a - 0.45)} ${y2 - c * Math.sin(a - 0.45)} L${x2} ${y2} L${x2 - c * Math.cos(a + 0.45)} ${y2 - c * Math.sin(a + 0.45)}" style="fill:none;stroke:${cor};stroke-width:${w}"/>`; };
  const GL = [[-0.9061798459386640, 0.2369268850561891], [-0.5384693101056831, 0.4786286704993665], [0, 0.5688888888888889], [0.5384693101056831, 0.4786286704993665], [0.9061798459386640, 0.2369268850561891]];
  const gl = (f, a, b) => { const c = (a + b) / 2, h = (b - a) / 2; return GL.reduce((s, [x, w]) => s + w * f(c + h * x), 0) * h; };

  /* ---------- TE01 · braquistócrona: corrida de quatro curvas ---------- */
  SIM.braquisto = (el, F) => {
    const g = 9.81, W = 640, H = 330, cores = { reta: "#7ab8e6", arco: "#f2c94c", parab: "#e88fd0", cicl: "var(--ok)" };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>distância horizontal D (m)</label><input type="range" min="0.5" max="4" step="0.05" value="3.14" data-c="D"><output data-o="D"></output></div>
      <div class="ctrl"><label>desnível H (m)</label><input type="range" min="0.3" max="2" step="0.05" value="2" data-c="H"><output data-o="H"></output></div>
      <div class="bts"><button class="bt pri" data-a="vai">Soltar as bolinhas</button></div></div>
      <div class="status">Quatro bolinhas saem do repouso no mesmo ponto e deslizam sem atrito até o mesmo ponto final, cada uma por uma curva. O tempo de cada curva é T = ∫ ds/√(2gy), calculado numericamente. A <b style="color:var(--ok)">cicloide</b> (a curva de Euler–Lagrange) ganha sempre, mesmo sendo mais comprida que a reta: ela "mergulha" primeiro e ganha velocidade cedo. Com D/H > π/2, a cicloide desce abaixo do ponto final e sobe de novo, e ainda assim vence. Galileu (1638) provou que o arco de circunferência ganha da reta e achou que ele era o mais rápido de todos; o cálculo das variações mostrou que não.</div>`);
    const q = (s) => el.querySelector(s);
    let corrida = null, vivo = true;
    function curvas(D, Hh) {
      /* cicloide pelos dois pontos: (θ − sen θ)/(1 − cos θ) = D/H */
      let lo = 1e-6, hi = 2 * Math.PI - 1e-6; const f = (T) => (T - Math.sin(T)) / (1 - Math.cos(T)) - D / Hh;
      for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; }
      const Tf = (lo + hi) / 2, Rc = Hh / (1 - Math.cos(Tf));
      /* arco de circunferência com tangente vertical em A: centro (r, 0); y para baixo = −r·sen φ, com φ indo de π até φ_B ∈ (π, 2π) */
      const r = (D * D + Hh * Hh) / (2 * D), phiB = 2 * Math.PI + Math.atan2(-Hh, D - r);
      const L = {
        reta: (u) => [D * u, Hh * u],
        parab: (u) => [D * u, Hh * (2 * u - u * u)],
        cicl: (u) => [Rc * (u * Tf - Math.sin(u * Tf)), Rc * (1 - Math.cos(u * Tf))],
      };
      L.arco = (u) => { const ph = Math.PI + u * (phiB - Math.PI); return [r + r * Math.cos(ph), -r * Math.sin(ph)]; };
      return { L, Rc, Tf };
    }
    function tempo(P) {
      /* u = w² tira a singularidade 1/√y do início; tabela t(u) para animar */
      const N = 3000, tab = [[0, 0]]; let t = 0;
      for (let k = 0; k < N; k++) {
        const w = (k + 0.5) / N, u = w * w, du = 1e-6;
        const [x1, y1] = P(Math.max(0, u - du)), [x2, y2] = P(Math.min(1, u + du)), [, y] = P(u);
        const ds = Math.hypot(x2 - x1, y2 - y1) / (Math.min(1, u + du) - Math.max(0, u - du));
        t += (ds * 2 * w) / Math.sqrt(2 * g * Math.max(y, 1e-12)) / N;
        tab.push([((k + 1) / N) ** 2, t]);
      }
      return { t, tab };
    }
    let C, T;
    function calcula() {
      const D = +q("[data-c=D]").value, Hh = +q("[data-c=H]").value;
      q("[data-o=D]").textContent = n2(D, 2); q("[data-o=H]").textContent = n2(Hh, 2);
      C = curvas(D, Hh); T = {}; for (const k in C.L) T[k] = tempo(C.L[k]);
      corrida = null; desenha(0);
    }
    function desenha(tAgora) {
      const D = +q("[data-c=D]").value, Hh = +q("[data-c=H]").value;
      const ymax = Math.max(Hh, 2 * C.Rc) * 1.05, esc = Math.min((W - 80) / D, (H - 50) / ymax), X = (x) => 40 + x * esc, Y = (y) => 25 + y * esc;
      let s = `<line x1="20" x2="${W - 20}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--line)"/>`;
      const nomes = { reta: "reta", arco: "arco de circunferência", parab: "parábola", cicl: "cicloide" };
      for (const k in C.L) {
        let d = ""; for (let i = 0; i <= 160; i++) { const [x, y] = C.L[k](i / 160); d += (i ? "L" : "M") + X(x).toFixed(1) + " " + Y(y).toFixed(1); }
        s += `<path d="${d}" style="fill:none;stroke:${cores[k]};stroke-width:${k === "cicl" ? 3 : 2}"/>`;
        /* posição da bolinha no instante tAgora */
        const tab = T[k].tab; let u = 1;
        if (tAgora < T[k].t) { let lo = 0, hi = tab.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (tab[m][1] < tAgora) lo = m; else hi = m; } const [u0, t0] = tab[lo], [u1, t1] = tab[hi]; u = u0 + ((tAgora - t0) / (t1 - t0 || 1)) * (u1 - u0); }
        const [bx, by] = C.L[k](u); s += `<circle cx="${X(bx)}" cy="${Y(by)}" r="7" style="fill:${cores[k]};stroke:var(--card);stroke-width:2"/>`;
      }
      s += `<circle cx="${X(0)}" cy="${Y(0)}" r="4" style="fill:var(--ink)"/><circle cx="${X(D)}" cy="${Y(Hh)}" r="5" style="fill:none;stroke:var(--ink);stroke-width:2"/><text class="tx2" x="${X(0) + 8}" y="${Y(0) - 8}">A</text><text class="tx2" x="${X(D) + 8}" y="${Y(Hh) + 4}">B</text>`;
      if (corrida) s += `<text class="tx" x="${W - 20}" y="22" text-anchor="end">t = ${n2(tAgora, 2)} s</text>`;
      q("[data-v=sv]").innerHTML = s;
      const melhor = Object.keys(T).reduce((a, b) => (T[a].t < T[b].t ? a : b));
      q("[data-v=lt]").innerHTML = Object.keys(T).map((k) => vis(`<span style="color:${cores[k]}">●</span> ${nomes[k]}`, `${T[k].t.toFixed(3).replace(".", ",")} s${k === melhor ? " ★" : ""}`)).join("") ;
    }
    function laco(ts) { if (!vivo || !corrida) return; const t = (ts - corrida) / 1000; desenha(t); if (t < Math.max(...Object.values(T).map((x) => x.t)) + 0.6) requestAnimationFrame(laco); else corrida = null; }
    el.querySelectorAll("input").forEach((i) => i.addEventListener("input", calcula));
    q("[data-a=vai]").addEventListener("click", () => { corrida = performance.now(); requestAnimationFrame(laco); });
    calcula();
    F.aoSair(() => (vivo = false));
    SIM.braquisto._tempos = () => Object.fromEntries(Object.entries(T).map(([k, v]) => [k, v.t]));
  };

  /* ---------- TE02 · divergência: a soma das caixinhas ---------- */
  SIM.divCaixas = (el, F) => {
    const CAMPOS = {
      fonte: { nome: "(x, y)", P: (x, y) => x, Q: (x, y) => y, div: () => 2 },
      quad: { nome: "(x², y)", P: (x, y) => x * x, Q: (x, y) => y, div: (x) => 2 * x + 1 },
      giro: { nome: "(−y, x)", P: (x, y) => -y, Q: (x, y) => x, div: () => 0 },
      misto: { nome: "(xy², x²y)", P: (x, y) => x * y * y, Q: (x, y) => x * x * y, div: (x, y) => x * x + y * y },
    };
    let k = "quad"; const W = 420, H = 420;
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg><div class="leitor" data-v="lt" style="flex-direction:column;align-items:stretch"></div></div>
      <div class="ctrls"><div class="ctrl"><label>caixinhas por lado n</label><input type="range" min="1" max="8" step="1" value="4" data-c="n"><output data-o="n"></output></div>
      <div class="ctrl"><label>centro da região x₀</label><input type="range" min="-1" max="1" step="0.05" value="0.4" data-c="x0"><output data-o="x0"></output></div>
      <div class="bts">${botoes(Object.entries(CAMPOS).map(([kk, c]) => [kk, c.nome]), "k", k)}</div></div>
      <div class="status">A região (um quadrado de lado 2) é cortada em n × n caixinhas. Cada caixinha mostra o fluxo que <b>sai</b> dela (verde: sai mais do que entra; vermelho: entra mais). Some todas: o fluxo pelas paredes internas se cancela (o que sai de uma entra na vizinha) e sobra só o fluxo pela borda de fora. Com n grande, cada caixinha vale div F × área: é o teorema da divergência sendo demonstrado.</div>`);
    const q = (s) => el.querySelector(s);
    const fluxoRet = (C, x1, y1, x2, y2) => gl((y) => C.P(x2, y) - C.P(x1, y), y1, y2) + gl((x) => C.Q(x, y2) - C.Q(x, y1), x1, x2);
    function desenha() {
      const C = CAMPOS[k], n = +q("[data-c=n]").value, x0 = +q("[data-c=x0]").value; q("[data-o=n]").textContent = n; q("[data-o=x0]").textContent = n2(x0, 2);
      const S = 2.2, X = (x) => W / 2 + ((x - x0 * 0) * (W / 2 - 20)) / S, Y = (y) => H / 2 - (y * (H / 2 - 20)) / S;
      const a = x0 - 1, b = x0 + 1, c = -1, d = 1, hx = 2 / n;
      let s = "", soma = 0, maxf = 0; const fl = [];
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const f = fluxoRet(C, a + i * hx, c + j * hx, a + (i + 1) * hx, c + (j + 1) * hx); fl.push([i, j, f]); soma += f; maxf = Math.max(maxf, Math.abs(f)); }
      fl.forEach(([i, j, f]) => { const op = maxf ? Math.min(0.75, 0.12 + (0.6 * Math.abs(f)) / maxf) : 0.1; s += `<rect x="${X(a + i * hx)}" y="${Y(c + (j + 1) * hx)}" width="${X(a + hx) - X(a)}" height="${Y(c) - Y(c + hx)}" style="fill:${f >= 0 ? "var(--ok)" : "var(--bad)"};fill-opacity:${Math.abs(f) < 1e-12 ? 0.05 : op};stroke:var(--ink3);stroke-width:.8"/>`; if (n <= 4) s += `<text class="tx2" x="${X(a + (i + 0.5) * hx)}" y="${Y(c + (j + 0.5) * hx) + 4}" text-anchor="middle">${n2(f, 2)}</text>`; });
      for (let x = -2; x <= 2.01; x += 0.4) for (let y = -2; y <= 2.01; y += 0.4) { const u = C.P(x, y), v = C.Q(x, y), m = Math.hypot(u, v); if (m < 1e-9) continue; const L = 0.13; s += seta(X(x - (u / m) * L), Y(y - (v / m) * L), X(x + (u / m) * L), Y(y + (v / m) * L), "var(--ink3)", 1); }
      s += `<rect x="${X(a)}" y="${Y(d)}" width="${X(b) - X(a)}" height="${Y(c) - Y(d)}" style="fill:none;stroke:var(--mod);stroke-width:2.5"/>`;
      q("[data-v=sv]").innerHTML = s;
      const borda = fluxoRet(C, a, c, b, d), integ = gl((x) => gl((y) => C.div(x, y), c, d), a, b);
      q("[data-v=lt]").innerHTML = vis("soma dos fluxos das " + n * n + " caixinhas", n2(soma, 4)) + vis("fluxo pela borda de fora ∮ F·n ds", n2(borda, 4)) + vis("∬ div F dA", n2(integ, 4));
    }
    el.querySelectorAll("input").forEach((i) => i.addEventListener("input", desenha));
    liga(el, "k", (v) => { k = v; desenha(); });
    desenha();
  };

  /* ---------- TE03 · Pappus: volume de revolução ---------- */
  SIM.pappus = (el, F) => {
    const FORMAS = {
      ret: { nome: "retângulo", fatia: (y, d, s) => (Math.abs(y) <= s / 2 ? [d, d + s] : null), ymax: (s) => s / 2, area: (s) => s * s, xc: (d, s) => d + s / 2 },
      tri: { nome: "triângulo", fatia: (y, d, s) => (Math.abs(y) <= s / 2 ? [d, d + s * (1 - (2 * Math.abs(y)) / s)] : null), ymax: (s) => s / 2, area: (s) => (s * s) / 2, xc: (d, s) => d + s / 3 },
      semi: { nome: "semicírculo", fatia: (y, d, s) => (Math.abs(y) <= s ? [d, d + Math.sqrt(s * s - y * y)] : null), ymax: (s) => s, area: (s) => (Math.PI * s * s) / 2, xc: (d, s) => d + (4 * s) / (3 * Math.PI) },
      circ: { nome: "círculo (toro)", fatia: (y, d, s) => (Math.abs(y) <= s ? [d + s - Math.sqrt(s * s - y * y), d + s + Math.sqrt(s * s - y * y)] : null), ymax: (s) => s, area: (s) => Math.PI * s * s, xc: (d, s) => d + s },
    };
    let k = "circ"; const W = 560, H = 330;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>distância da figura ao eixo d</label><input type="range" min="0" max="3" step="0.05" value="1.5" data-c="d"><output data-o="d"></output></div>
      <div class="ctrl"><label>tamanho s</label><input type="range" min="0.3" max="1.6" step="0.05" value="1" data-c="s"><output data-o="s"></output></div>
      <div class="bts">${botoes(Object.entries(FORMAS).map(([kk, c]) => [kk, c.nome]), "k", k)}</div></div>
      <div class="status">A figura gira em volta do eixo tracejado e gera um sólido (a sombra do outro lado é a mesma figura, meia volta depois). O volume é calculado de dois jeitos: por Pappus, V = 2π·x̄·A (área vezes o caminho percorrido pelo centroide, a bolinha), e "na força bruta", somando fatias horizontais (arruelas) π(x²<sub>fora</sub> − x²<sub>dentro</sub>)·dy. Dão o mesmo número.</div>`);
    const q = (s) => el.querySelector(s);
    function desenha() {
      const Fm = FORMAS[k], d = +q("[data-c=d]").value, s = +q("[data-c=s]").value; q("[data-o=d]").textContent = n2(d, 2); q("[data-o=s]").textContent = n2(s, 2);
      const esc = 52, X = (x) => W / 2 + x * esc, Y = (y) => H / 2 - y * esc;
      const ym = Fm.ymax(s), N = 2000; let Vf = 0; const pts = [], ptsE = [];
      for (let i = 0; i < N; i++) { const y = -ym + ((i + 0.5) * 2 * ym) / N, f = Fm.fatia(y, d, s); if (f) Vf += Math.PI * (f[1] * f[1] - f[0] * f[0]) * ((2 * ym) / N); }
      for (let i = 0; i <= 200; i++) { const y = -ym + (i * 2 * ym) / 200, f = Fm.fatia(y, d, s) || [d, d]; pts.push([f[1], y]); ptsE.unshift([f[0], y]); }
      const contorno = [...pts, ...ptsE], path = (sg) => contorno.map(([x, y], i) => (i ? "L" : "M") + X(sg * x).toFixed(1) + " " + Y(y).toFixed(1)).join("") + "Z";
      const A = Fm.area(s), xc = Fm.xc(d, s), Vp = 2 * Math.PI * xc * A;
      let g = `<line x1="${X(0)}" x2="${X(0)}" y1="10" y2="${H - 10}" style="stroke:var(--ink2);stroke-width:1.5;stroke-dasharray:7 5"/><text class="tx2" x="${X(0) + 6}" y="22">eixo</text>`;
      g += `<ellipse cx="${X(0)}" cy="${Y(ym)}" rx="${(d + (k === "circ" ? 2 * s : s)) * esc}" ry="10" style="fill:none;stroke:var(--ink3);stroke-dasharray:3 4"/><ellipse cx="${X(0)}" cy="${Y(-ym)}" rx="${(d + (k === "circ" ? 2 * s : s)) * esc}" ry="10" style="fill:none;stroke:var(--ink3);stroke-dasharray:3 4"/>`;
      g += `<path d="${path(-1)}" style="fill:color-mix(in srgb,var(--mod) 12%,transparent);stroke:var(--mod);stroke-opacity:.45;stroke-dasharray:5 4"/><path d="${path(1)}" style="fill:color-mix(in srgb,var(--mod) 30%,transparent);stroke:var(--mod);stroke-width:2"/>`;
      g += `<ellipse cx="${X(0)}" cy="${Y(0)}" rx="${xc * esc}" ry="${Math.max(6, xc * esc * 0.18)}" style="fill:none;stroke:var(--warn);stroke-width:1.5;stroke-dasharray:4 4"/><circle cx="${X(xc)}" cy="${Y(0)}" r="5.5" style="fill:var(--warn);stroke:var(--card);stroke-width:2"/><text class="tx2" x="${X(xc) + 8}" y="${Y(0) - 8}">centroide</text>`;
      q("[data-v=sv]").innerHTML = g;
      q("[data-v=lt]").innerHTML = vis("área A", n2(A, 4)) + vis("distância do centroide x̄", n2(xc, 4)) + vis("V por Pappus = 2π x̄ A", n2(Vp, 4)) + vis("V somando fatias", n2(Vf, 4));
    }
    el.querySelectorAll("input").forEach((i) => i.addEventListener("input", desenha));
    liga(el, "k", (v) => { k = v; desenha(); });
    desenha();
  };

  /* ---------- TE04 · Stokes: qualquer chapéu com a mesma borda ---------- */
  SIM.stokesChapeu = (el, F) => {
    const CAMPOS = {
      giro: { nome: "(−y, x, 0)", F: (x, y, z) => [-y, x, 0], rot: (x, y, z) => [0, 0, 2] },
      misto: { nome: "(z − y, xz, y)", F: (x, y, z) => [z - y, x * z, y], rot: (x, y, z) => [1 - x, 1, z + 1] },
      grad: { nome: "(yz, xz, xy) = ∇(xyz)", F: (x, y, z) => [y * z, x * z, x * y], rot: () => [0, 0, 0] },
    };
    let k = "misto"; const W = 560, H = 330;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>altura do chapéu h (superfície z = h(1 − x² − y²))</label><input type="range" min="-1.5" max="1.5" step="0.05" value="0.8" data-c="h"><output data-o="h"></output></div>
      <div class="bts">${botoes(Object.entries(CAMPOS).map(([kk, c]) => [kk, c.nome]), "k", k)}</div></div>
      <div class="status">A borda é sempre o círculo x² + y² = 1 no plano z = 0 (em destaque). A superfície é um "chapéu" que você estica para cima ou para baixo. A área muda, o rotacional que atravessa cada pedaço muda, mas o fluxo total do rotacional não muda: ele só depende da borda, e é igual à circulação ∮F·dl. Com h = 0, o chapéu vira o disco plano (teorema de Green).</div>`);
    const q = (s) => el.querySelector(s);
    function desenha() {
      const C = CAMPOS[k], h = +q("[data-c=h]").value; q("[data-o=h]").textContent = n2(h, 2);
      /* circulação na borda */
      let circ = 0; const N = 4000; for (let i = 0; i < N; i++) { const t = (2 * Math.PI * (i + 0.5)) / N, [Fx, Fy] = C.F(Math.cos(t), Math.sin(t), 0); circ += (Fx * -Math.sin(t) + Fy * Math.cos(t)) * ((2 * Math.PI) / N); }
      /* fluxo do rotacional e área (polares, Gauss nos dois sentidos) */
      let fluxo = 0, area = 0; const NP = 96, rs = [];
      for (let k = 0; k < 24; k++) GL.forEach(([u, w]) => rs.push([(k + (u + 1) / 2) / 24, w / 48])); /* Gauss–Legendre composto em r */
      for (const [r, wr] of rs) for (let j = 0; j < NP; j++) {
        const p = (2 * Math.PI * (j + 0.5)) / NP, x = r * Math.cos(p), y = r * Math.sin(p), z = h * (1 - r * r);
        const n = [2 * h * x, 2 * h * y, 1], R = C.rot(x, y, z), dA = r * wr * ((2 * Math.PI) / NP);
        fluxo += (R[0] * n[0] + R[1] * n[1] + R[2] * n[2]) * dA; area += Math.hypot(...n) * dA;
      }
      /* desenho em perspectiva */
      const P = (x, y, z) => [W / 2 + 150 * x - 70 * y * 0.6, 200 - 90 * z + 45 * y * 0.6 - 30 * 0];
      let g = "";
      for (let i = 1; i <= 6; i++) { const r = i / 6; let d = ""; for (let j = 0; j <= 60; j++) { const p = (2 * Math.PI * j) / 60, [sx, sy] = P(r * Math.cos(p), r * Math.sin(p), h * (1 - r * r)); d += (j ? "L" : "M") + sx.toFixed(1) + " " + sy.toFixed(1); } g += `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-opacity:${i === 6 ? 0 : 0.5};stroke-width:1"/>`; }
      for (let j = 0; j < 16; j++) { const p = (2 * Math.PI * j) / 16; let d = ""; for (let i = 0; i <= 20; i++) { const r = i / 20, [sx, sy] = P(r * Math.cos(p), r * Math.sin(p), h * (1 - r * r)); d += (i ? "L" : "M") + sx.toFixed(1) + " " + sy.toFixed(1); } g += `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-opacity:.35;stroke-width:1"/>`; }
      let bd = ""; for (let j = 0; j <= 80; j++) { const p = (2 * Math.PI * j) / 80, [sx, sy] = P(Math.cos(p), Math.sin(p), 0); bd += (j ? "L" : "M") + sx.toFixed(1) + " " + sy.toFixed(1); }
      g += `<path d="${bd}" style="fill:none;stroke:var(--warn);stroke-width:3"/>`;
      const [ax, ay] = P(Math.cos(0.35), Math.sin(0.35), 0), [bx, by] = P(Math.cos(0.6), Math.sin(0.6), 0); g += seta(ax, ay, bx, by, "var(--warn)", 2.5);
      const [tx, ty] = P(0, 0, h); g += seta(tx, ty, tx, ty - 40, "var(--ink)", 1.6) + `<text class="tx2" x="${tx + 6}" y="${ty - 32}">n</text>`;
      q("[data-v=sv]").innerHTML = g;
      q("[data-v=lt]").innerHTML = vis("circulação na borda ∮ F·dl", n2(circ, 4)) + vis("fluxo do rotacional ∬ (∇×F)·dA", n2(fluxo, 4)) + vis("área do chapéu", n2(area, 3));
    }
    el.querySelectorAll("input").forEach((i) => i.addEventListener("input", desenha));
    liga(el, "k", (v) => { k = v; desenha(); });
    desenha();
  };

  /* ---------- TE05 · Noether: o que se conserva ---------- */
  SIM.noether = (el, F) => {
    const POT = {
      kepler: { nome: "central: V = −k/r", a: (x, y, t) => { const r3 = Math.pow(x * x + y * y, 1.5); return [-x / r3, -y / r3]; }, V: (x, y) => -1 / Math.hypot(x, y), s0: [1, 0, 0, 1.15], dt: 0.002, sim: "rotação (e o tempo)", esc: 70, c: [0.4, 0] },
      aniso: { nome: "oscilador desigual: V = ½(x² + 4y²)", a: (x, y) => [-x, -4 * y], V: (x, y) => 0.5 * (x * x + 4 * y * y), s0: [1.4, 0, 0, 0.9], dt: 0.002, sim: "só o tempo", esc: 95, c: [0, 0] },
      grav: { nome: "gravidade: V = g·y", a: () => [0, -1], V: (x, y) => y, s0: [-2.2, -1, 0.9, 2], dt: 0.002, sim: "deslizar em x (e o tempo)", esc: 75, c: [0, 0] },
      pulsa: { nome: "central pulsando: V = −k(t)/r", a: (x, y, t) => { const k = 1 + 0.4 * Math.sin(2 * t), r3 = Math.pow(x * x + y * y, 1.5); return [(-k * x) / r3, (-k * y) / r3]; }, V: (x, y, t) => -(1 + 0.4 * Math.sin(2 * t)) / Math.hypot(x, y), s0: [1, 0, 0, 1.1], dt: 0.002, sim: "só a rotação", esc: 70, c: [0, 0] },
    };
    let k = "kepler", s, t, hist, rastro, vivo = true;
    const W = 340, H = 320;
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:start"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg><div><svg viewBox="0 0 330 300" width="330" data-v="gr"></svg></div></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="bts">${botoes(Object.entries(POT).map(([kk, c]) => [kk, c.nome]), "k", k)}<button class="bt peq" data-a="re">Recomeçar</button></div></div>
      <div class="status">Uma partícula (m = 1) se move no plano. À direita, como variam ao longo do tempo a energia E, o momento angular L = xp<sub>y</sub> − yp<sub>x</sub> e o momento p<sub>x</sub>. Uma grandeza só fica constante quando o potencial tem a simetria correspondente: tempo → energia; rotação → momento angular; deslizar em x → p<sub>x</sub>. É o teorema de Noether.</div>`);
    const q = (s) => el.querySelector(s);
    const reinicia = () => { s = [...POT[k].s0]; t = 0; hist = []; rastro = []; };
    function passo() {
      const P = POT[k], h = P.dt, f = (st, tt) => { const [ax, ay] = P.a(st[0], st[1], tt); return [st[2], st[3], ax, ay]; };
      for (let i = 0; i < 8; i++) {
        const k1 = f(s, t), k2 = f(s.map((v, j) => v + (h / 2) * k1[j]), t + h / 2), k3 = f(s.map((v, j) => v + (h / 2) * k2[j]), t + h / 2), k4 = f(s.map((v, j) => v + h * k3[j]), t + h);
        s = s.map((v, j) => v + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])); t += h;
      }
      const E = 0.5 * (s[2] ** 2 + s[3] ** 2) + P.V(s[0], s[1], t), L = s[0] * s[3] - s[1] * s[2];
      hist.push([t, E, L, s[2]]); if (hist.length > 600) hist.shift();
      rastro.push([s[0], s[1]]); if (rastro.length > 900) rastro.shift();
      if (k === "grav" && s[1] < -3) reinicia();
    }
    function desenha() {
      const P = POT[k], X = (x) => W / 2 + (x - P.c[0]) * P.esc, Y = (y) => H / 2 - (y - P.c[1]) * P.esc;
      let g = k === "kepler" || k === "pulsa" ? `<circle cx="${X(0)}" cy="${Y(0)}" r="7" style="fill:var(--warn)"/>` : k === "aniso" ? `<ellipse cx="${X(0)}" cy="${Y(0)}" rx="${1.4 * P.esc}" ry="${0.7 * P.esc}" style="fill:none;stroke:var(--line2);stroke-dasharray:4 4"/>` : "";
      g += `<path d="${rastro.map(([x, y], i) => (i ? "L" : "M") + X(x).toFixed(1) + " " + Y(y).toFixed(1)).join("")}" style="fill:none;stroke:var(--mod);stroke-width:1.6;opacity:.8"/><circle cx="${X(s[0])}" cy="${Y(s[1])}" r="6" style="fill:var(--ink)"/>`;
      q("[data-v=sv]").innerHTML = g;
      /* três gráficos */
      const rot = [["energia E", 1, "#f2c94c"], ["momento angular L", 2, "#7ab8e6"], ["momento pₓ", 3, "#e88fd0"]];
      let gg = "", lt = "";
      rot.forEach(([nome, idx, cor], r) => {
        const y0 = 10 + r * 98, hh = 80, vals = hist.map((v) => v[idx]); if (!vals.length) return;
        const ref = vals[0], var_ = Math.max(...vals.map((v) => Math.abs(v - ref))), cons = var_ < 1e-3 * Math.max(1, Math.abs(ref));
        const lo = Math.min(...vals), hi = Math.max(...vals), meio = (lo + hi) / 2, faixa = Math.max(hi - lo, 0.5);
        const Yg = (v) => y0 + hh / 2 - ((v - meio) / faixa) * (hh - 10);
        gg += `<rect x="40" y="${y0}" width="280" height="${hh}" style="fill:none;stroke:var(--line)"/><text class="tx2" x="46" y="${y0 + 14}">${nome}</text><text class="tx2" x="314" y="${y0 + 14}" text-anchor="end" style="fill:${cons ? "var(--ok)" : "var(--bad)"};font-weight:700">${cons ? "conservado" : "varia"}</text>`;
        gg += `<path d="${vals.map((v, i) => (i ? "L" : "M") + (40 + (280 * i) / 599).toFixed(1) + " " + Yg(v).toFixed(1)).join("")}" style="fill:none;stroke:${cor};stroke-width:2"/>`;
        lt += vis(nome, `${n2(vals[vals.length - 1], 4)}${cons ? " ✓" : ""}`);
      });
      q("[data-v=gr]").innerHTML = gg;
      q("[data-v=lt]").innerHTML = lt + vis("simetria do potencial", P.sim);
    }
    function laco() { if (!vivo) return; for (let i = 0; i < 3; i++) passo(); desenha(); requestAnimationFrame(laco); }
    liga(el, "k", (v) => { k = v; reinicia(); });
    q("[data-a=re]").addEventListener("click", reinicia);
    reinicia(); requestAnimationFrame(laco);
    F.aoSair(() => (vivo = false));
  };
})();
