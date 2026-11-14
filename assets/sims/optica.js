/* Simulações de Óptica (B12 refração, B13 lentes, B14b óptica ondulatória).
   Refração: Snell + fórmulas de Fresnel para Rs e Rp (conferidas: R normal vidro = 4%, Brewster 56,3°, crítico 41,8°).
   Lentes: 1/f = 1/p + 1/p′ e A = −p′/p (conferido em Python). Fendas: I = (sen β/β)²·(sen Nα/(N sen α))². Filme: R ∝ sen²(2πnt/λ). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small style="text-transform:none">${r}</small><b>${v}</b></div>`;
  const grau = (x) => (x * 180) / Math.PI, rad = (x) => (x * Math.PI) / 180;
  /* cor aproximada de um comprimento de onda (nm) → [r, g, b] em 0..1 (aproximação clássica de Bruton) */
  const corLambda = (l) => {
    let r = 0, g = 0, b = 0;
    if (l >= 380 && l < 440) { r = -(l - 440) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; } else if (l < 510) { g = 1; b = -(l - 510) / 20; }
    else if (l < 580) { r = (l - 510) / 70; g = 1; } else if (l < 645) { r = 1; g = -(l - 645) / 65; } else if (l <= 780) { r = 1; }
    const fat = l < 420 ? 0.3 + (0.7 * (l - 380)) / 40 : l > 700 ? 0.3 + (0.7 * (780 - l)) / 80 : 1;
    return [r * fat, g * fat, b * fat];
  };
  const rgb = ([r, g, b], k = 1) => `rgb(${Math.round(255 * Math.min(1, r * k))},${Math.round(255 * Math.min(1, g * k))},${Math.round(255 * Math.min(1, b * k))})`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${k === ativo}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));

  function fresnel(n1, n2, ti) {
    const st = (n1 / n2) * Math.sin(ti);
    if (st >= 1) return { rs: 1, rp: 1, tt: NaN };
    const tt = Math.asin(st), ci = Math.cos(ti), ct = Math.cos(tt);
    return { rs: ((n1 * ci - n2 * ct) / (n1 * ci + n2 * ct)) ** 2, rp: ((n1 * ct - n2 * ci) / (n1 * ct + n2 * ci)) ** 2, tt };
  }

  /* ---------- B12 · refração, reflexão total, Brewster ---------- */
  SIM.refracao = (el, F) => {
    const MEIOS = { ar: ["ar", 1.0], agua: ["água", 1.33], vidro: ["vidro", 1.5], diam: ["diamante", 2.42] };
    let m1 = "ar", m2 = "vidro";
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:start"><svg viewBox="0 0 420 400" width="420" data-v="sv"></svg>
      <div><b>Quanto reflete (fórmulas de Fresnel)</b><svg viewBox="0 0 330 250" width="330" data-v="s2"></svg><div class="leitor" data-v="lt" style="flex-direction:column;align-items:stretch"></div></div></div>
      <div class="ctrls"><div class="ctrl"><label>ângulo de incidência θ₁</label><input type="range" min="0" max="89" step="0.1" value="35" data-c="t"><output data-o="t"></output></div>
      <div class="bts"><b style="margin-right:6px">de cima:</b>${botoes(Object.entries(MEIOS).map(([k, v]) => [k, v[0]]), "a", m1)}</div>
      <div class="bts"><b style="margin-right:6px">de baixo:</b>${botoes(Object.entries(MEIOS).map(([k, v]) => [k, v[0]]), "b", m2)}</div></div>
      <div class="status">A espessura de cada raio mostra quanta luz vai para ele. Indo do meio mais refringente para o menos (vidro → ar, por exemplo), passe do ângulo crítico: o raio refratado some e <b>toda</b> a luz reflete. No ângulo de Brewster, a luz polarizada "p" (no plano da figura) não reflete nada.</div>`);
    const q = (s) => el.querySelector(s);
    function desenha() {
      const n1 = MEIOS[m1][1], n2 = MEIOS[m2][1], tg = +q("[data-c=t]").value, ti = rad(tg); q("[data-o=t]").textContent = F.t(tg, 1) + "°";
      const fr = fresnel(n1, n2, ti), R = (fr.rs + fr.rp) / 2, T = 1 - R, ox = 210, oy = 200, L = 180;
      let g = `<rect x="0" y="0" width="420" height="${oy}" style="fill:color-mix(in srgb,#7ab8e6 ${Math.round((n1 - 1) * 30)}%,transparent)"/><rect x="0" y="${oy}" width="420" height="${400 - oy}" style="fill:color-mix(in srgb,#7ab8e6 ${Math.round(10 + (n2 - 1) * 30)}%,transparent)"/>`;
      g += `<line x1="0" x2="420" y1="${oy}" y2="${oy}" style="stroke:var(--ink2)"/><line x1="${ox}" x2="${ox}" y1="10" y2="390" style="stroke:var(--ink3);stroke-dasharray:5 5"/>`;
      g += `<text class="tx2" x="10" y="20">${MEIOS[m1][0]} (n = ${F.t(n1, 2)})</text><text class="tx2" x="10" y="390">${MEIOS[m2][0]} (n = ${F.t(n2, 2)})</text>`;
      const raio = (ang, sinal, w, cor) => `<line x1="${ox}" y1="${oy}" x2="${ox + L * Math.sin(ang)}" y2="${oy + sinal * L * Math.cos(ang)}" style="stroke:${cor};stroke-width:${w};stroke-linecap:round"/>`;
      g += `<line x1="${ox - L * Math.sin(ti)}" y1="${oy - L * Math.cos(ti)}" x2="${ox}" y2="${oy}" style="stroke:#f2c94c;stroke-width:5;stroke-linecap:round"/>`;
      g += raio(ti, -1, Math.max(0.6, 5 * R), "#f2c94c");
      if (isFinite(fr.tt)) g += raio(fr.tt, 1, Math.max(0.6, 5 * T), "#f2c94c");
      g += `<path d="M${ox} ${oy - 50} A50 50 0 0 0 ${ox - 50 * Math.sin(ti)} ${oy - 50 * Math.cos(ti)}" style="fill:none;stroke:var(--ink2)"/><text class="tx2" x="${ox - 22}" y="${oy - 58}" text-anchor="end">θ₁</text>`;
      if (isFinite(fr.tt)) g += `<path d="M${ox} ${oy + 50} A50 50 0 0 0 ${ox + 50 * Math.sin(fr.tt)} ${oy + 50 * Math.cos(fr.tt)}" style="fill:none;stroke:var(--ink2)"/><text class="tx2" x="${ox + 22}" y="${oy + 70}">θ₂</text>`;
      else g += `<text class="tx" x="${ox + 20}" y="${oy + 60}" style="fill:var(--warn)">reflexão interna total</text>`;
      q("[data-v=sv]").innerHTML = g;
      /* gráfico de R(θ) */
      const W = 330, H = 250, l = 36, r = 10, t = 10, b = 28, X = (a) => l + (a / 90) * (W - l - r), Y = (v) => H - b - v * (H - t - b);
      let h = `<rect x="${l}" y="${t}" width="${W - l - r}" height="${H - t - b}" style="fill:none;stroke:var(--line)"/>`;
      [0, 30, 60, 90].forEach((a) => (h += `<text class="tx2" x="${X(a)}" y="${H - 10}" text-anchor="middle">${a}°</text>`));
      [0, 0.5, 1].forEach((v) => (h += `<text class="tx2" x="${l - 5}" y="${Y(v) + 4}" text-anchor="end">${F.t(v * 100, 0)}%</text><line x1="${l}" x2="${W - r}" y1="${Y(v)}" y2="${Y(v)}" class="grade"/>`));
      const cur = (k, cor, est = "") => { let d = ""; for (let a = 0; a <= 89.9; a += 0.25) { const f = fresnel(n1, n2, rad(a)); d += (a ? "L" : "M") + X(a).toFixed(1) + " " + Y(f[k]).toFixed(1); } return `<path d="${d}" style="fill:none;stroke:${cor};stroke-width:2;${est}"/>`; };
      h += cur("rs", "#e88fd0") + cur("rp", "#7ab8e6") + `<line x1="${X(tg)}" x2="${X(tg)}" y1="${t}" y2="${H - b}" style="stroke:var(--ink);stroke-dasharray:3 3"/>`;
      h += `<text class="tx2" x="${l + 6}" y="${t + 14}" style="fill:#e88fd0">s (⊥ ao plano)</text><text class="tx2" x="${l + 6}" y="${t + 28}" style="fill:#7ab8e6">p (no plano)</text>`;
      q("[data-v=s2]").innerHTML = h;
      const crit = n1 > n2 ? grau(Math.asin(n2 / n1)) : NaN, brew = grau(Math.atan(n2 / n1));
      q("[data-v=lt]").innerHTML = vis("θ₂ (Snell)", isFinite(fr.tt) ? F.t(grau(fr.tt), 1) + "°" : "não existe") + vis("refletido (luz comum)", F.t(100 * R, 1) + "%") + vis("ângulo crítico", isFinite(crit) ? F.t(crit, 1) + "°" : "não há (n₁ < n₂)") + vis("ângulo de Brewster", F.t(brew, 1) + "°");
    }
    q("[data-c=t]").addEventListener("input", desenha);
    liga(el, "a", (v) => { m1 = v; desenha(); });
    liga(el, "b", (v) => { m2 = v; desenha(); });
    desenha();
  };

  /* ---------- B13 · lentes delgadas e os raios principais ---------- */
  SIM.lente = (el, F) => {
    const W = 760, H = 380, ox = 380, oy = 190, esc = 6.5, yo = 5;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>distância do objeto p (cm)</label><input type="range" min="3" max="55" step="0.1" value="25" data-c="p"><output data-o="p"></output></div>
      <div class="ctrl"><label>distância focal f (cm)</label><input type="range" min="-25" max="25" step="0.5" value="10" data-c="f"><output data-o="f"></output></div>
      <div class="bts"><button class="bt peq" data-pr="10,25">p &gt; 2f</button><button class="bt peq" data-pr="10,20">p = 2f</button><button class="bt peq" data-pr="10,15">f &lt; p &lt; 2f</button><button class="bt peq" data-pr="10,6">p &lt; f (lupa)</button><button class="bt peq" data-pr="-10,20">divergente</button></div></div>
      <div class="status">Raios principais: <b style="color:#f2c94c">(1)</b> entra paralelo ao eixo e sai passando pelo foco F′; <b style="color:#7ad08f">(2)</b> passa pelo centro da lente sem desviar; <b style="color:#e88fd0">(3)</b> passa pelo foco F e sai paralelo. Linhas cheias são raios de verdade; tracejadas são prolongamentos (onde a imagem é <b>virtual</b>, só os prolongamentos se cruzam). f negativo = lente divergente.</div>`);
    const q = (s) => el.querySelector(s);
    const X = (x) => ox + x * esc, Y = (y) => oy - y * esc;
    function desenha() {
      let f = +q("[data-c=f]").value; if (Math.abs(f) < 3) f = f < 0 ? -3 : 3; const p = +q("[data-c=p]").value;
      q("[data-o=p]").textContent = F.t(p, 1); q("[data-o=f]").textContent = F.t(f, 1);
      const inf = Math.abs(p - f) < 0.05, pp = inf ? Infinity : 1 / (1 / f - 1 / p), A = -pp / p, yi = A * yo;
      let g = `<line x1="0" x2="${W}" y1="${oy}" y2="${oy}" style="stroke:var(--ink3)"/>`;
      g += f > 0 ? `<path d="M${ox} ${oy - 150} Q${ox + 18} ${oy} ${ox} ${oy + 150} Q${ox - 18} ${oy} ${ox} ${oy - 150} Z" style="fill:color-mix(in srgb,#7ab8e6 30%,transparent);stroke:#7ab8e6;stroke-width:1.5"/>`
        : `<path d="M${ox - 12} ${oy - 150} L${ox + 12} ${oy - 150} Q${ox + 2} ${oy} ${ox + 12} ${oy + 150} L${ox - 12} ${oy + 150} Q${ox - 2} ${oy} ${ox - 12} ${oy - 150} Z" style="fill:color-mix(in srgb,#7ab8e6 30%,transparent);stroke:#7ab8e6;stroke-width:1.5"/>`;
      [[-f, "F"], [f, "F′"], [-2 * f, "2F"], [2 * f, "2F′"]].forEach(([x, n]) => { if (Math.abs(X(x) - ox) < ox - 5) g += `<circle cx="${X(x)}" cy="${oy}" r="3.5" style="fill:var(--ink)"/><text class="tx2" x="${X(x)}" y="${oy + 18}" text-anchor="middle">${n}</text>`; });
      g += `<line x1="${X(-p)}" y1="${oy}" x2="${X(-p)}" y2="${Y(yo)}" style="stroke:var(--ok);stroke-width:3"/><path d="M${X(-p) - 6} ${Y(yo) + 9} L${X(-p)} ${Y(yo)} L${X(-p) + 6} ${Y(yo) + 9}" style="fill:none;stroke:var(--ok);stroke-width:3"/>`;
      const seg = (x1, y1, x2, y2, cor, tr) => `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" style="stroke:${cor};stroke-width:1.8${tr ? ";stroke-dasharray:5 4;opacity:.75" : ""}"/>`;
      const xmax = (W - ox) / esc, xmin = -ox / esc, alem = (x0, y0, x1, y1, xf) => y0 + ((y1 - y0) * (xf - x0)) / (x1 - x0);
      const C1 = "#f2c94c", C2 = "#7ad08f", C3 = "#e88fd0";
      /* raio 1: paralelo → passa por F′ (convergente) ou parece vir de F (divergente) */
      g += seg(-p, yo, 0, yo, C1);
      g += seg(0, yo, xmax, alem(0, yo, f, 0, xmax), C1);
      if (f < 0 || pp < 0) g += seg(0, yo, xmin, alem(0, yo, f, 0, xmin), C1, true);
      /* raio 2: pelo centro */
      g += seg(-p, yo, xmax, alem(-p, yo, 0, 0, xmax), C2);
      if (pp < 0) g += seg(0, 0, xmin, alem(-p, yo, 0, 0, xmin), C2, true);
      /* raio 3: rumo a F → sai paralelo */
      if (!inf) {
        const yl = alem(-p, yo, -f, 0, 0);
        if (Math.abs(yl) < 150 / esc) { g += seg(-p, yo, 0, yl, C3) + seg(0, yl, xmax, yl, C3); if (pp < 0) g += seg(0, yl, xmin, yl, C3, true); if (f < 0) g += seg(-p, yo, -f, 0, C3, true); }
      }
      if (isFinite(pp) && Math.abs(pp) < xmax && Math.abs(yi) < 150 / esc) {
        const cor = pp > 0 ? "var(--warn)" : "var(--ink2)", tr = pp > 0 ? "" : ";stroke-dasharray:4 3";
        g += `<line x1="${X(pp)}" y1="${oy}" x2="${X(pp)}" y2="${Y(yi)}" style="stroke:${cor};stroke-width:3${tr}"/><path d="M${X(pp) - 6} ${Y(yi) + (yi > 0 ? 9 : -9)} L${X(pp)} ${Y(yi)} L${X(pp) + 6} ${Y(yi) + (yi > 0 ? 9 : -9)}" style="fill:none;stroke:${cor};stroke-width:3"/>`;
      }
      q("[data-v=sv]").innerHTML = g;
      const nat = inf ? "imagem no infinito (raios saem paralelos)" : `${pp > 0 ? "real" : "virtual"}, ${A < 0 ? "invertida" : "direita"}, ${Math.abs(A) > 1.001 ? "maior" : Math.abs(A) < 0.999 ? "menor" : "do mesmo tamanho"}`;
      q("[data-v=lt]").innerHTML = vis("p′ = 1/(1/f − 1/p)", inf ? "∞" : F.t(pp, 2) + " cm") + vis("aumento A = −p′/p", inf ? "—" : F.t(A, 3)) + vis("natureza da imagem", nat) + vis("vergência", F.t(100 / f, 1) + " di");
    }
    el.querySelectorAll("input").forEach((i) => i.addEventListener("input", desenha));
    el.querySelectorAll("[data-pr]").forEach((b) => b.addEventListener("click", () => { const [f, p] = b.dataset.pr.split(","); q("[data-c=f]").value = f; q("[data-c=p]").value = p; desenha(); }));
    desenha();
  };

  /* ---------- B14b · fendas: Young, fenda simples e rede ---------- */
  SIM.fendas = (el, F) => {
    const W = 640, Dm = 1, Ymax = 50e-3;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} 320" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>comprimento de onda λ (nm)</label><input type="range" min="400" max="700" step="1" value="600" data-c="l"><output data-o="l"></output></div>
      <div class="ctrl"><label>largura da fenda a (μm)</label><input type="range" min="5" max="100" step="1" value="20" data-c="a"><output data-o="a"></output></div>
      <div class="ctrl"><label>distância entre fendas d (μm)</label><input type="range" min="30" max="300" step="1" value="100" data-c="d"><output data-o="d"></output></div>
      <div class="bts"><b style="margin-right:6px">número de fendas N:</b>${botoes([["1", "1"], ["2", "2 (Young)"], ["3", "3"], ["5", "5"], ["10", "10 (rede)"]], "n", "2")}</div></div>
      <div class="status">Tela a 1 m das fendas. Em cima, a intensidade; embaixo, o que você veria na tela. A envoltória pontilhada é a difração de <b>uma</b> fenda (largura a); as franjas finas dentro dela são a interferência <b>entre</b> as fendas (distância d). Com mais fendas, os máximos ficam finos e brilhantes: é assim que uma rede de difração separa as cores.</div>`);
    const q = (s) => el.querySelector(s);
    let N = 2;
    function I(y, lam, a, d) {
      const s = y / Math.hypot(y, Dm), be = (Math.PI * a * s) / lam, al = (Math.PI * d * s) / lam;
      const dif = Math.abs(be) < 1e-9 ? 1 : (Math.sin(be) / be) ** 2;
      const sa = Math.sin(al), inter = N === 1 ? 1 : Math.abs(sa) < 1e-9 ? 1 : (Math.sin(N * al) / (N * sa)) ** 2;
      return [dif * inter, dif];
    }
    function desenha() {
      const lam = +q("[data-c=l]").value * 1e-9, a = +q("[data-c=a]").value * 1e-6, d = Math.max(+q("[data-c=d]").value * 1e-6, a * 1.05);
      q("[data-o=l]").textContent = Math.round(lam * 1e9); q("[data-o=a]").textContent = Math.round(a * 1e6); q("[data-o=d]").textContent = Math.round(d * 1e6);
      const cor = corLambda(lam * 1e9), l = 40, r = 30, X = (y) => l + ((y + Ymax) / (2 * Ymax)) * (W - l - r), Yg = (v) => 200 - v * 180;
      let g = `<rect x="${l}" y="20" width="${W - l - r}" height="180" style="fill:none;stroke:var(--line)"/>`;
      [-50, -25, 0, 25, 50].forEach((mm) => (g += `<text class="tx2" x="${X(mm / 1000)}" y="216" text-anchor="middle">${mm} mm</text>`));
      let dI = "", dE = "", faixa = "";
      const n = 900;
      for (let i = 0; i <= n; i++) { const y = -Ymax + (2 * Ymax * i) / n, [v, e] = I(y, lam, a, d); dI += (i ? "L" : "M") + X(y).toFixed(1) + " " + Yg(v).toFixed(1); dE += (i ? "L" : "M") + X(y).toFixed(1) + " " + Yg(e).toFixed(1);
        if (i < n) faixa += `<rect x="${X(y).toFixed(1)}" y="232" width="${((W - l - r) / n + 0.6).toFixed(2)}" height="70" fill="${rgb(cor, Math.pow(v, 0.6) * 1.2)}"/>`; }
      if (N > 1) g += `<path d="${dE}" style="fill:none;stroke:var(--ink3);stroke-dasharray:3 3"/>`;
      g += `<path d="${dI}" style="fill:none;stroke:${rgb(cor, 1.1)};stroke-width:2"/><rect x="${l}" y="232" width="${W - l - r}" height="70" fill="#000"/>${faixa}`;
      q("[data-v=sv]").innerHTML = g;
      const franja = (lam * Dm) / d, central = (2 * lam * Dm) / a;
      q("[data-v=lt]").innerHTML = (N > 1 ? vis("espaço entre franjas λD/d", F.t(franja * 1000, 2) + " mm") : "") + vis("largura do máximo central 2λD/a", F.t(central * 1000, 1) + " mm") + (N > 1 ? vis("franjas claras dentro do máximo central", Math.max(1, 2 * Math.floor(d / a - 1e-9) + 1)) : "");
    }
    el.querySelectorAll("input").forEach((i) => i.addEventListener("input", desenha));
    liga(el, "n", (v) => { N = +v; desenha(); });
    desenha();
  };

  /* ---------- B14b · cores de filme fino (bolha de sabão) ---------- */
  SIM.filme = (el, F) => {
    const W = 640;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} 330" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>espessura escolhida t (nm)</label><input type="range" min="0" max="1200" step="1" value="300" data-c="t"><output data-o="t"></output></div>
      <div class="ctrl"><label>índice do filme n</label><input type="range" min="1.2" max="1.6" step="0.01" value="1.33" data-c="n"><output data-o="n"></output></div></div>
      <div class="status">A faixa colorida é um filme de sabão (no ar) cuja espessura cresce da esquerda (0) para a direita (1200 nm), iluminado com luz branca: cada cor é a mistura das ondas que sobrevivem à interferência. Bem fino (à esquerda), ele fica <b>preto</b>: as duas reflexões se cancelam para todas as cores. Embaixo, quanto cada comprimento de onda reflete na espessura escolhida.</div>`);
    const q = (s) => el.querySelector(s);
    const Rl = (t, n, l) => Math.sin((2 * Math.PI * n * t) / l) ** 2; /* reflexão relativa (fase de π só na face de cima) */
    function cor(t, n) { let R = 0, G = 0, B = 0; for (let l = 400; l <= 700; l += 5) { const [r, g, b] = corLambda(l), k = Rl(t, n, l); R += r * k; G += g * k; B += b * k; } const s = 1 / 22; return [R * s, G * s, B * s]; }
    function desenha() {
      const t = +q("[data-c=t]").value, n = +q("[data-c=n]").value; q("[data-o=t]").textContent = t; q("[data-o=n]").textContent = F.t(n, 2);
      const l0 = 40, r0 = 34, X = (tt) => l0 + (tt / 1200) * (W - l0 - r0);
      let g = "";
      for (let tt = 0; tt < 1200; tt += 4) g += `<rect x="${X(tt).toFixed(1)}" y="10" width="${((W - l0 - r0) / 300 + 0.6).toFixed(2)}" height="110" fill="${rgb(cor(tt, n), 1.15)}"/>`;
      g += `<line x1="${X(t)}" x2="${X(t)}" y1="6" y2="124" style="stroke:var(--ink);stroke-width:2"/>`;
      [0, 300, 600, 900, 1200].forEach((tt) => (g += `<text class="tx2" x="${X(tt)}" y="138" text-anchor="middle">${tt} nm</text>`));
      const L = (lam) => l0 + ((lam - 400) / 300) * (W - l0 - r0), Yr = (v) => 310 - v * 140;
      g += `<rect x="${l0}" y="165" width="${W - l0 - r0}" height="145" style="fill:none;stroke:var(--line)"/>`;
      for (let lam = 400; lam < 700; lam += 2) g += `<rect x="${L(lam).toFixed(1)}" y="${Yr(Rl(t, n, lam)).toFixed(1)}" width="${((W - l0 - r0) / 150 + 0.5).toFixed(2)}" height="${(310 - Yr(Rl(t, n, lam))).toFixed(1)}" fill="${rgb(corLambda(lam))}"/>`;
      [400, 500, 600, 700].forEach((lam) => (g += `<text class="tx2" x="${L(lam)}" y="325" text-anchor="middle">${lam} nm</text>`));
      q("[data-v=sv]").innerHTML = g;
      const ms = []; for (let m = 0; m < 6; m++) { const lam = (2 * n * t) / (m + 0.5); if (lam >= 400 && lam <= 700) ms.push(Math.round(lam)); }
      q("[data-v=lt]").innerHTML = vis("caminho extra 2nt", F.t(2 * n * t, 0) + " nm") + vis("reforçados (2nt = (m + ½)λ)", ms.length ? ms.join(", ") + " nm" : "nenhum no visível");
    }
    el.querySelectorAll("input").forEach((i) => i.addEventListener("input", desenha));
    desenha();
  };
})();
