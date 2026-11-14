/* Simulações de Física Moderna (C17 fotoelétrico, C17b Bohr, C18 relatividade).
   Relógio de luz: Δt = γΔt₀ com γ = 1/√(1 − v²/c²). Fotoelétrico: K_máx = hf − φ (hc = 1240 eV·nm; funções trabalho aproximadas).
   Bohr: Eₙ = −13,6 eV/n², rₙ = 0,0529 nm·n², λ = 1240/ΔE (conferido: Hα ≈ 656 nm, Lyman α ≈ 122 nm). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small style="text-transform:none">${r}</small><b>${v}</b></div>`;
  const HC = 1239.84;
  const corLambda = (l) => {
    let r = 0, g = 0, b = 0;
    if (l >= 380 && l < 440) { r = -(l - 440) / 60; b = 1; } else if (l >= 440 && l < 490) { g = (l - 440) / 50; b = 1; } else if (l >= 490 && l < 510) { g = 1; b = -(l - 510) / 20; }
    else if (l >= 510 && l < 580) { r = (l - 510) / 70; g = 1; } else if (l >= 580 && l < 645) { r = 1; g = -(l - 645) / 65; } else if (l >= 645 && l <= 780) { r = 1; }
    const k = l < 420 ? 0.3 + (0.7 * (l - 380)) / 40 : l > 700 ? 0.3 + (0.7 * (780 - l)) / 80 : 1;
    return l < 380 || l > 780 ? null : `rgb(${Math.round(255 * r * k)},${Math.round(255 * g * k)},${Math.round(255 * b * k)})`;
  };
  const corOuCinza = (l) => corLambda(l) || (l < 380 ? "#b18cff" : "#c0604a");
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${k === ativo}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));

  /* ---------- C18 · relógio de luz ---------- */
  SIM.relogio = (el, F) => {
    const W = 760, H = 330;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>velocidade da nave v/c</label><input type="range" min="0" max="0.99" step="0.01" value="0.6" data-c="b"><output data-o="b"></output></div>
      <div class="bts"><button class="bt peq" data-p="0.6">0,6c</button><button class="bt peq" data-p="0.8">0,8c</button><button class="bt peq" data-p="0.99">0,99c</button><button class="bt peq" data-a="pausa">Pausar</button></div></div>
      <div class="status">Esquerda: o relógio visto por quem está <b>dentro</b> da nave (a luz sobe e desce, distância 2L). Direita: o mesmo relógio visto da Terra, com a nave passando: a luz faz um zigue-zague, caminho mais longo. Como a luz tem a <b>mesma velocidade c</b> para os dois, o "tique" visto da Terra demora mais. Os contadores mostram quantos tiques cada um viu.</div>`);
    const q = (s) => el.querySelector(s);
    let beta = 0.6, t = 0, ult = null, vivo = true, pausa = false;
    const L = 120, T0 = 1.6; /* tempo próprio de um tique (ida e volta), em segundos da animação */
    function quadro(dt) {
      const g = 1 / Math.sqrt(1 - beta * beta);
      t += dt;
      const fase0 = (t % T0) / T0, tiques0 = Math.floor(t / T0), Tt = T0 * g, faseT = (t % Tt) / Tt, tiquesT = Math.floor(t / Tt);
      const yA = (f) => (f < 0.5 ? 2 * f : 2 - 2 * f);
      let s = `<line x1="380" y1="10" x2="380" y2="${H - 10}" style="stroke:var(--line)"/>`;
      s += `<text class="tx2" x="190" y="24" text-anchor="middle">referencial da nave (tempo próprio)</text><text class="tx2" x="570" y="24" text-anchor="middle">referencial da Terra</text>`;
      const espelhos = (x) => `<line x1="${x - 30}" y1="60" x2="${x + 30}" y2="60" style="stroke:var(--ink);stroke-width:4"/><line x1="${x - 30}" y1="${60 + L}" x2="${x + 30}" y2="${60 + L}" style="stroke:var(--ink);stroke-width:4"/>`;
      s += espelhos(190) + `<circle cx="190" cy="${60 + L - L * yA(fase0)}" r="7" style="fill:#f2c94c"/>`;
      /* Terra: a nave anda para a direita e volta (em loop) para caber na tela */
      const desloc = Math.min(beta * 140, 150), x0 = 570 - desloc, xA = x0 + 2 * desloc * faseT;
      s += espelhos(xA) + `<polyline points="${x0},${60 + L} ${x0 + desloc},60 ${x0 + 2 * desloc},${60 + L}" style="fill:none;stroke:#f2c94c;stroke-width:1.5;stroke-dasharray:4 4;opacity:.7"/>`;
      s += `<circle cx="${xA}" cy="${60 + L - L * yA(faseT)}" r="7" style="fill:#f2c94c"/>`;
      s += `<text class="tx" x="190" y="${H - 50}" text-anchor="middle">tiques: ${tiques0}</text><text class="tx" x="570" y="${H - 50}" text-anchor="middle">tiques: ${tiquesT}</text>`;
      s += `<text class="tx2" x="570" y="${H - 25}" text-anchor="middle">caminho da luz por tique: 2√(L² + (vΔt/2)²)</text><text class="tx2" x="190" y="${H - 25}" text-anchor="middle">caminho por tique: 2L</text>`;
      q("[data-v=sv]").innerHTML = s;
    }
    function leitor() {
      const g = 1 / Math.sqrt(1 - beta * beta);
      q("[data-o=b]").textContent = F.t(beta, 2);
      q("[data-v=lt]").innerHTML = vis("γ = 1/√(1 − v²/c²)", F.t(g, 3)) + vis("1 s na nave dura, na Terra", F.t(g, 3) + " s") + vis("comprimento de 1 m da nave, medido da Terra", F.t(1 / g, 3) + " m");
    }
    function laco(ts) { if (!vivo) return; if (ult !== null && !pausa) quadro(Math.min(0.05, (ts - ult) / 1000)); ult = ts; requestAnimationFrame(laco); }
    q("[data-c=b]").addEventListener("input", () => { beta = +q("[data-c=b]").value; t = 0; leitor(); });
    el.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { q("[data-c=b]").value = b.dataset.p; beta = +b.dataset.p; t = 0; leitor(); }));
    q("[data-a=pausa]").addEventListener("click", (ev) => { pausa = !pausa; ev.target.textContent = pausa ? "Continuar" : "Pausar"; });
    leitor(); quadro(0); requestAnimationFrame(laco);
    F.aoSair(() => (vivo = false));
  };

  /* ---------- C17 · efeito fotoelétrico ---------- */
  SIM.fotoeletrico = (el, F) => {
    const METAIS = { cs: ["césio", 2.1], na: ["sódio", 2.3], zn: ["zinco", 4.3] };
    let m = "na", ult = null, vivo = true, eletrons = [], acum = 0;
    const W = 760, H = 300;
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:start"><svg viewBox="0 0 400 ${H}" width="400" data-v="sv"></svg><div><b>K<sub>máx</sub> × frequência</b><svg viewBox="0 0 340 ${H - 40}" width="340" data-v="s2"></svg></div></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>comprimento de onda λ (nm)</label><input type="range" min="150" max="750" step="1" value="400" data-c="l"><output data-o="l"></output></div>
      <div class="ctrl"><label>intensidade da luz</label><input type="range" min="0" max="100" step="1" value="50" data-c="i"><output data-o="i"></output></div>
      <div class="bts">${botoes(Object.entries(METAIS).map(([k, v]) => [k, `${v[0]} (φ ≈ ${String(v[1]).replace(".", ",")} eV)`]), "m", m)}</div></div>
      <div class="status">Cada fóton tem energia hf = hc/λ e é absorvido inteiro por um elétron. Se hf &lt; φ (a "função trabalho" do metal), nenhum elétron sai, <b>por mais forte que seja a luz</b>. Acima do limiar, a intensidade só muda <b>quantos</b> elétrons saem; a velocidade máxima de cada um depende só da cor. Isso a física clássica não explicava, e deu o Nobel a Einstein.</div>`);
    const q = (s) => el.querySelector(s);
    function estado() {
      const lam = +q("[data-c=l]").value, I = +q("[data-c=i]").value, phi = METAIS[m][1], E = HC / lam, K = E - phi;
      return { lam, I, phi, E, K };
    }
    function grafico() {
      const { lam, phi, E, K } = estado(), Wd = 340, Hd = H - 40, l = 40, r = 10, t = 10, b = 30;
      const fmax = 2.0, X = (f) => l + (f / fmax) * (Wd - l - r), Y = (k) => Hd - b - ((k + 5) / 10) * (Hd - t - b); /* f em 10¹⁵ Hz, K de −5 a 5 eV */
      let s = `<rect x="${l}" y="${t}" width="${Wd - l - r}" height="${Hd - t - b}" style="fill:none;stroke:var(--line)"/>`;
      [0, 0.5, 1, 1.5, 2].forEach((f) => (s += `<text class="tx2" x="${X(f)}" y="${Hd - 12}" text-anchor="middle">${String(f).replace(".", ",")}</text>`));
      [-4, -2, 0, 2, 4].forEach((k) => (s += `<line class="grade" x1="${l}" x2="${Wd - r}" y1="${Y(k)}" y2="${Y(k)}"/><text class="tx2" x="${l - 5}" y="${Y(k) + 4}" text-anchor="end">${k}</text>`));
      s += `<text class="tx2" x="${Wd - r - 4}" y="${Hd - b - 6}" text-anchor="end">f (10¹⁵ Hz)</text><text class="tx2" x="${l + 6}" y="${t + 14}">K (eV)</text>`;
      const hEv = 4.1357; /* h em eV·(10⁻¹⁵ s) */
      s += `<defs><clipPath id="clfe"><rect x="${l}" y="${t}" width="${Wd - l - r}" height="${Hd - t - b}"/></clipPath></defs><g clip-path="url(#clfe)">`;
      Object.entries(METAIS).forEach(([k, v]) => { const f0 = v[1] / hEv; s += `<line x1="${X(0)}" y1="${Y(-v[1])}" x2="${X(fmax)}" y2="${Y(hEv * fmax - v[1])}" style="stroke:${k === m ? "var(--mod)" : "var(--ink3)"};stroke-width:${k === m ? 2.2 : 1};stroke-dasharray:${k === m ? "0" : "4 3"}"/>`; s += `<circle cx="${X(f0)}" cy="${Y(0)}" r="3" style="fill:${k === m ? "var(--mod)" : "var(--ink3)"}"/>`; });
      s += `</g>`;
      const f = E / hEv; if (f <= fmax) s += `<circle cx="${X(f)}" cy="${Y(Math.max(K, -5))}" r="6" style="fill:${corOuCinza(lam)};stroke:var(--card);stroke-width:2"/>`;
      q("[data-v=s2]").innerHTML = s;
    }
    function quadro(dt) {
      const { lam, I, K } = estado(), cor = corOuCinza(lam);
      if (K > 0) { acum += dt * I * 0.25; while (acum > 1) { acum -= 1; eletrons.push({ x: 120, y: 60 + Math.random() * 180, v: (30 + 160 * Math.sqrt(K / 5)) * (0.4 + 0.6 * Math.random()), a: (Math.random() - 0.5) * 1.2 }); } }
      eletrons.forEach((e) => { e.x += e.v * Math.cos(e.a) * dt; e.y += e.v * Math.sin(e.a) * dt; });
      eletrons = eletrons.filter((e) => e.x < 400 && e.y > 0 && e.y < H);
      let s = `<rect x="60" y="40" width="60" height="220" style="fill:#9aa3ad;stroke:var(--ink2)"/><text class="tx2" x="90" y="280" text-anchor="middle">metal</text>`;
      const nraios = Math.round(I / 12);
      for (let i = 0; i < nraios; i++) { const y = 60 + (i * 180) / Math.max(1, nraios - 1 || 1); s += `<path d="M5 ${y - 30} q8 6 16 0 t16 0 t16 0 L60 ${y}" style="fill:none;stroke:${cor};stroke-width:2"/>`; }
      eletrons.forEach((e) => (s += `<circle cx="${e.x}" cy="${e.y}" r="3.5" style="fill:#7ab8e6"/>`));
      q("[data-v=sv]").innerHTML = s;
    }
    function leitor() {
      const { lam, I, phi, E, K } = estado(); q("[data-o=l]").textContent = lam; q("[data-o=i]").textContent = I + "%";
      q("[data-v=lt]").innerHTML = vis("energia do fóton hc/λ", F.t(E, 2) + " eV") + vis("K_máx = hf − φ", K > 0 ? F.t(K, 2) + " eV" : "nenhum elétron sai") + vis("potencial de corte", K > 0 ? F.t(K, 2) + " V" : "—") + vis("λ de corte (limiar)", F.t(HC / phi, 0) + " nm");
      grafico();
    }
    function laco(ts) { if (!vivo) return; if (ult !== null) quadro(Math.min(0.05, (ts - ult) / 1000)); ult = ts; requestAnimationFrame(laco); }
    el.querySelectorAll("input").forEach((i) => i.addEventListener("input", leitor));
    liga(el, "m", (v) => { m = v; eletrons = []; leitor(); });
    leitor(); quadro(0); requestAnimationFrame(laco);
    F.aoSair(() => (vivo = false));
  };

  /* ---------- C17b · níveis de Bohr e espectro do hidrogênio ---------- */
  SIM.bohr = (el, F) => {
    const W = 760, H = 380, E = (n) => -13.6 / (n * n);
    let ni = 3, nf = 2;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="bts"><b style="margin-right:6px">nível inicial:</b>${botoes([2, 3, 4, 5, 6].map((n) => [String(n), "n = " + n]), "i", "3")}</div>
      <div class="bts"><b style="margin-right:6px">nível final:</b>${botoes([1, 2, 3, 4, 5].map((n) => [String(n), "n = " + n]), "f", "2")}</div></div>
      <div class="status">Esquerda: as órbitas de Bohr (raio ∝ n²; fora de escala para caber). Meio: os níveis de energia, Eₙ = −13,6 eV/n². Ao cair de um nível para outro mais baixo, o elétron emite um fóton com a diferença de energia. Direita: as linhas que o hidrogênio emite. Só as da série de Balmer (caindo para n = 2) são visíveis.</div>`);
    const q = (s) => el.querySelector(s);
    function desenha() {
      let s = "";
      /* órbitas */
      const cx = 130, cy = 190;
      for (let n = 1; n <= 6; n++) { const r = 14 + 26 * Math.sqrt(n * n) * 0.62; s += `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:none;stroke:${n === ni || n === nf ? "var(--mod)" : "var(--ink3)"};stroke-width:${n === ni || n === nf ? 2 : 1}"/>`; }
      s += `<circle cx="${cx}" cy="${cy}" r="6" style="fill:#e8706a"/>`;
      const rn = (n) => 14 + 26 * n * 0.62;
      s += `<circle cx="${cx + rn(ni) * Math.cos(-0.6)}" cy="${cy + rn(ni) * Math.sin(-0.6)}" r="5" style="fill:#7ab8e6"/>`;
      /* níveis */
      const x0 = 290, x1 = 470, Y = (e) => 40 + ((e + 14) / 14.4) * 0 + (330 * (-e)) / 14;
      const Yl = (e) => 30 + 320 * (1 - (e + 13.6) / 13.6) * 0 + 30 + (-e / 13.6) * 300;
      for (let n = 1; n <= 6; n++) { const y = 40 + 300 * Math.pow(-E(n) / 13.6, 0.5); s += `<line x1="${x0}" x2="${x1}" y1="${y}" y2="${y}" style="stroke:${n === ni || n === nf ? "var(--mod)" : "var(--ink2)"};stroke-width:2"/><text class="tx2" x="${x0 - 6}" y="${y + 4}" text-anchor="end">n=${n}</text><text class="tx2" x="${x1 + 6}" y="${y + 4}">${F.t(E(n), 2)} eV</text>`; }
      const yN = (n) => 40 + 300 * Math.pow(-E(n) / 13.6, 0.5);
      if (ni !== nf) {
        const lam = HC / Math.abs(E(ni) - E(nf)), cor = corOuCinza(lam), desce = ni > nf;
        s += `<line x1="${(x0 + x1) / 2}" y1="${yN(ni)}" x2="${(x0 + x1) / 2}" y2="${yN(nf)}" style="stroke:${cor};stroke-width:3"/>` + `<path d="M${(x0 + x1) / 2 - 7} ${yN(nf) + (desce ? -12 : 12)} L${(x0 + x1) / 2} ${yN(nf)} L${(x0 + x1) / 2 + 7} ${yN(nf) + (desce ? -12 : 12)}" style="fill:none;stroke:${cor};stroke-width:3"/>`;
      }
      s += `<text class="tx2" x="${(x0 + x1) / 2}" y="365" text-anchor="middle">escala vertical comprimida perto do topo (n grande)</text>`;
      /* espectro de Balmer + linha atual */
      const sx0 = 560, sx1 = 745, L = (l) => sx0 + ((l - 380) / (720 - 380)) * (sx1 - sx0);
      s += `<rect x="${sx0}" y="60" width="${sx1 - sx0}" height="60" fill="#000"/>`;
      for (let n = 3; n <= 8; n++) { const l = HC / (E(n) - E(2)); if (l >= 380) s += `<line x1="${L(l)}" x2="${L(l)}" y1="62" y2="118" style="stroke:${corOuCinza(l)};stroke-width:3"/>`; }
      [400, 500, 600, 700].forEach((l) => (s += `<text class="tx2" x="${L(l)}" y="136" text-anchor="middle">${l}</text>`));
      s += `<text class="tx2" x="${(sx0 + sx1) / 2}" y="50" text-anchor="middle">linhas visíveis (Balmer), nm</text>`;
      if (ni !== nf) { const l = HC / Math.abs(E(ni) - E(nf)); s += `<text class="tx" x="${(sx0 + sx1) / 2}" y="190" text-anchor="middle">λ = ${F.t(l, 1)} nm</text><rect x="${sx0 + 40}" y="205" width="${sx1 - sx0 - 80}" height="40" rx="6" fill="${corOuCinza(l)}" opacity="${corLambda(l) ? 1 : 0.35}"/><text class="tx2" x="${(sx0 + sx1) / 2}" y="265" text-anchor="middle">${l < 380 ? "ultravioleta (invisível)" : l > 720 ? "infravermelho (invisível)" : "visível"}</text>`; }
      q("[data-v=sv]").innerHTML = s;
      const serie = { 1: "Lyman", 2: "Balmer", 3: "Paschen", 4: "Brackett", 5: "Pfund" }[Math.min(ni, nf)];
      if (ni === nf) { q("[data-v=lt]").innerHTML = vis("transição", "escolha níveis diferentes"); return; }
      const dE = E(ni) - E(nf);
      q("[data-v=lt]").innerHTML = vis("ΔE = E(final) − E(inicial)", F.t(-dE, 3) + " eV") + vis(dE > 0 ? "fóton emitido" : "fóton absorvido", F.t(HC / Math.abs(dE), 1) + " nm") + vis("série", serie);
    }
    liga(el, "i", (v) => { ni = +v; desenha(); });
    liga(el, "f", (v) => { nf = +v; desenha(); });
    desenha();
  };
  /* ================= Moderna, parte 2 (C16, C19, C19b, C20, C21) ================= */
  const quadroM = (o) => ({ X: (x) => o.l + ((x - o.x0) / (o.x1 - o.x0)) * (o.W - o.l - o.r), Y: (y) => o.H - o.b - ((y - o.y0) / (o.y1 - o.y0)) * (o.H - o.t - o.b) });
  const eixosM = (o, P, xt, yt, xl, yl, fx = (v) => v, fy = (v) => v) => {
    let s = `<rect x="${o.l}" y="${o.t}" width="${o.W - o.l - o.r}" height="${o.H - o.t - o.b}" style="fill:none;stroke:var(--line)"/>`;
    xt.forEach((v) => (s += `<line class="grade" x1="${P.X(v)}" x2="${P.X(v)}" y1="${o.t}" y2="${o.H - o.b}"/><text class="tx2" x="${P.X(v)}" y="${o.H - o.b + 16}" text-anchor="middle">${fx(v)}</text>`));
    yt.forEach((v) => (s += `<line class="grade" x1="${o.l}" x2="${o.W - o.r}" y1="${P.Y(v)}" y2="${P.Y(v)}"/><text class="tx2" x="${o.l - 6}" y="${P.Y(v) + 4}" text-anchor="end">${fy(v)}</text>`));
    if (xl) s += `<text class="tx2" x="${o.W - o.r - 4}" y="${o.H - o.b - 6}" text-anchor="end">${xl}</text>`;
    if (yl) s += `<text class="tx2" x="${o.l + 6}" y="${o.t + 14}">${yl}</text>`;
    return s;
  };
  const numPt = (v, d = 2) => String(+(+v).toFixed(d)).replace(".", ",");

  /* ---------- C16 · corpo negro: Planck × Rayleigh–Jeans ---------- */
  SIM.corponegro = (el, F) => {
    const h = 6.626e-34, c = 2.998e8, k = 1.381e-23, b = 2.898e-3;
    const o = { W: 640, H: 340, l: 50, r: 26, t: 12, b: 32, x0: 0, x1: 3000 };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${o.W} ${o.H}" width="${o.W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>temperatura T (K)</label><input type="range" min="1500" max="12000" step="10" value="5772" data-c="T"><output data-o="T"></output></div>
      <div class="bts"><button class="bt peq" data-p="3000">lâmpada (3000 K)</button><button class="bt peq" data-p="5772">Sol (5772 K)</button><button class="bt peq" data-p="10000">estrela azul (10 000 K)</button><button class="bt peq" data-a="rj" aria-pressed="true">Mostrar Rayleigh–Jeans</button></div></div>
      <div class="status">Curva cheia: a lei de Planck (energia quantizada em pacotes hf). Tracejada: a previsão clássica de Rayleigh–Jeans, que concorda nos comprimentos de onda longos mas explode no ultravioleta (a "catástrofe do ultravioleta"). A faixa colorida marca o visível. Aumente T: o pico anda para a esquerda (Wien) e a área cresce como T⁴ (Stefan–Boltzmann).</div>`);
    const q = (s) => el.querySelector(s);
    let rj = true;
    const planck = (lam, T) => (2 * h * c * c) / lam ** 5 / Math.expm1((h * c) / (lam * k * T));
    const rjl = (lam, T) => (2 * c * k * T) / lam ** 4;
    function desenha() {
      const T = +q("[data-c=T]").value; q("[data-o=T]").textContent = T;
      const pico = planck(b / T, T), oo = { ...o, y0: 0, y1: pico * 1.25 }, P = quadroM(oo);
      let s = `<defs><clipPath id="clcn"><rect x="${oo.l}" y="${oo.t}" width="${oo.W - oo.l - oo.r}" height="${oo.H - oo.t - oo.b}"/></clipPath></defs>`;
      for (let l = 380; l < 750; l += 5) { const cor = corLambda(l); if (cor) s += `<rect x="${P.X(l)}" y="${oo.t}" width="${P.X(l + 5) - P.X(l) + 0.5}" height="${oo.H - oo.t - oo.b}" fill="${cor}" opacity=".18"/>`; }
      s += eixosM(oo, P, [0, 500, 1000, 1500, 2000, 2500, 3000], [], "λ (nm)", "intensidade (relativa)");
      let d = "", d2 = "";
      for (let i = 1; i <= 600; i++) { const l = (3000 * i) / 600, lm = l * 1e-9; d += (i > 1 ? "L" : "M") + P.X(l).toFixed(1) + " " + P.Y(planck(lm, T)).toFixed(1); d2 += (i > 1 ? "L" : "M") + P.X(l).toFixed(1) + " " + Math.max(-50, P.Y(rjl(lm, T))).toFixed(1); }
      s += `<g clip-path="url(#clcn)">` + (rj ? `<path d="${d2}" style="fill:none;stroke:var(--ink2);stroke-width:1.6;stroke-dasharray:6 4"/>` : "") + `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.6"/>`;
      s += `<line x1="${P.X((b / T) * 1e9)}" x2="${P.X((b / T) * 1e9)}" y1="${P.Y(pico)}" y2="${oo.H - oo.b}" style="stroke:var(--ink);stroke-dasharray:3 3"/></g>`;
      q("[data-v=sv]").innerHTML = s;
      const sig = 5.670e-8;
      q("[data-v=lt]").innerHTML = vis("pico (Wien) λ = b/T", numPt((b / T) * 1e9, 0) + " nm") + vis("potência por m² (σT⁴)", F.cient(sig * T ** 4, 2) + " W/m²") + vis("comparado com o Sol", numPt((T / 5772) ** 4, 2) + "×");
    }
    q("[data-c=T]").addEventListener("input", desenha);
    el.querySelectorAll("[data-p]").forEach((x) => x.addEventListener("click", () => { q("[data-c=T]").value = x.dataset.p; desenha(); }));
    q("[data-a=rj]").addEventListener("click", (ev) => { rj = !rj; ev.target.setAttribute("aria-pressed", rj); desenha(); });
    desenha();
  };

  /* ---------- C19 · decaimento radioativo (aleatório) ---------- */
  SIM.decaimento = (el, F) => {
    const N0 = 400, cols = 25;
    let vivos, t, hist, vivo = true, rodando = false, ult = null;
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:start"><svg viewBox="0 0 300 260" width="300" data-v="s1"></svg><svg viewBox="0 0 360 260" width="360" data-v="s2"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>meia-vida (s de simulação)</label><input type="range" min="1" max="10" step="0.5" value="3" data-c="T"><output data-o="T"></output></div>
      <div class="bts"><button class="bt pri" data-a="ir">Começar</button><button class="bt" data-a="zera">Recomeçar</button></div></div>
      <div class="status">400 núcleos. A cada instante, cada um tem a mesma chance de decair (λ·dt), sem memória: um núcleo velho não está "mais perto" de decair que um novo. Ninguém sabe <b>qual</b> vai decair, mas o <b>número</b> que sobra segue a exponencial N₀e^(−λt) (a curva tracejada), cada vez melhor quanto mais núcleos houver.</div>`);
    const q = (s) => el.querySelector(s);
    const zera = () => { vivos = Array(N0).fill(true); t = 0; hist = [[0, N0]]; rodando = false; q("[data-a=ir]").textContent = "Começar"; desenha(); };
    function passo(dt) {
      const T = +q("[data-c=T]").value, lam = Math.LN2 / T, p = 1 - Math.exp(-lam * dt);
      for (let i = 0; i < N0; i++) if (vivos[i] && Math.random() < p) vivos[i] = false;
      t += dt; const n = vivos.filter(Boolean).length; hist.push([t, n]);
      if (n === 0 || t > 6 * T) { rodando = false; q("[data-a=ir]").textContent = "Continuar"; }
    }
    function desenha() {
      const T = +q("[data-c=T]").value; q("[data-o=T]").textContent = numPt(T, 1);
      let s = "";
      for (let i = 0; i < N0; i++) { const x = 14 + (i % cols) * 11, y = 14 + Math.floor(i / cols) * 14.5; s += `<circle cx="${x}" cy="${y}" r="4" style="fill:${vivos[i] ? "#f2c94c" : "var(--ink3)"};opacity:${vivos[i] ? 1 : 0.35}"/>`; }
      q("[data-v=s1]").innerHTML = s;
      const o = { W: 360, H: 260, l: 40, r: 10, t: 10, b: 30, x0: 0, x1: 6 * T, y0: 0, y1: N0 }, P = quadroM(o);
      let g = eixosM(o, P, [0, T, 2 * T, 3 * T, 4 * T, 5 * T, 6 * T], [0, 100, 200, 300, 400], "t", "N", (v) => numPt(v / T, 0) + "T½");
      let d = ""; for (let i = 0; i <= 120; i++) { const tt = (6 * T * i) / 120; d += (i ? "L" : "M") + P.X(tt).toFixed(1) + " " + P.Y(N0 * Math.pow(0.5, tt / T)).toFixed(1); }
      g += `<path d="${d}" style="fill:none;stroke:var(--ink2);stroke-dasharray:5 4"/><polyline points="${hist.map(([a, n]) => `${P.X(Math.min(a, 6 * T))},${P.Y(n)}`).join(" ")}" style="fill:none;stroke:var(--mod);stroke-width:2.2"/>`;
      q("[data-v=s2]").innerHTML = g;
      const n = vivos.filter(Boolean).length;
      q("[data-v=lt]").innerHTML = vis("tempo", numPt(t, 1) + " s = " + numPt(t / T, 2) + " meias-vidas") + vis("restam", n) + vis("previsto N₀·2^(−t/T½)", numPt(N0 * Math.pow(0.5, t / T), 1));
    }
    function laco(ts) { if (!vivo) return; if (rodando && ult !== null) { const dt = Math.min(0.05, (ts - ult) / 1000); passo(dt); desenha(); } ult = ts; requestAnimationFrame(laco); }
    q("[data-a=ir]").addEventListener("click", (ev) => { rodando = !rodando; ev.target.textContent = rodando ? "Pausar" : "Continuar"; });
    q("[data-a=zera]").addEventListener("click", zera);
    q("[data-c=T]").addEventListener("input", zera);
    zera(); requestAnimationFrame(laco);
    F.aoSair(() => (vivo = false));
  };

  /* ---------- C19 · curva de energia de ligação (fórmula semiempírica) ---------- */
  SIM.ligacao = (el, F) => {
    /* Weizsäcker (MeV): volume, superfície, Coulomb, assimetria; Z do vale de estabilidade */
    const BA = (A) => { const Z = A / (1.98 + 0.0155 * Math.pow(A, 2 / 3)); const B = 15.75 * A - 17.8 * Math.pow(A, 2 / 3) - (0.711 * Z * (Z - 1)) / Math.pow(A, 1 / 3) - (23.7 * (A - 2 * Z) ** 2) / A; return [B / A, Z]; };
    const REAIS = [["²H", 2, 1.112], ["⁴He", 4, 7.074], ["¹²C", 12, 7.680], ["¹⁶O", 16, 7.976], ["⁵⁶Fe", 56, 8.790], ["²³⁵U", 235, 7.591], ["²³⁸U", 238, 7.570]];
    const o = { W: 640, H: 330, l: 46, r: 14, t: 12, b: 32, x0: 0, x1: 250, y0: 0, y1: 9.5 }, P = quadroM(o);
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${o.W} ${o.H}" width="${o.W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>número de massa A</label><input type="range" min="10" max="250" step="1" value="56" data-c="A"><output data-o="A"></output></div></div>
      <div class="status">Energia de ligação por núcleon: quanto "custa" arrancar, em média, cada próton ou nêutron. Curva: a fórmula semiempírica (modelo da gota líquida). Pontos: valores medidos. O máximo fica perto do ferro. Juntar núcleos leves (fusão) ou partir núcleos pesados (fissão) sobe a curva, e a diferença sai como energia.</div>`);
    const q = (s) => el.querySelector(s);
    function desenha() {
      const A = +q("[data-c=A]").value; q("[data-o=A]").textContent = A;
      let s = eixosM(o, P, [0, 50, 100, 150, 200, 250], [0, 2, 4, 6, 8], "A", "B/A (MeV)");
      let d = ""; for (let a = 8; a <= 250; a++) d += (a > 8 ? "L" : "M") + P.X(a).toFixed(1) + " " + P.Y(BA(a)[0]).toFixed(1);
      s += `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.4"/>`;
      REAIS.forEach(([n, a, v]) => (s += `<circle cx="${P.X(a)}" cy="${P.Y(v)}" r="4.5" style="fill:var(--ink)"/><text class="tx2" x="${P.X(a) + (a === 235 ? -8 : 6)}" y="${P.Y(v) + (a === 235 ? 18 : -6)}" text-anchor="${a === 235 ? "end" : "start"}">${n}</text>`));
      s += `<path d="M${P.X(20)} ${P.Y(3.2)} L${P.X(52)} ${P.Y(7.6)}" style="stroke:var(--ok);stroke-width:2.5;marker-end:none"/><text class="tx2" x="${P.X(22)}" y="${P.Y(2.6)}" style="fill:var(--ok)">fusão →</text>`;
      s += `<path d="M${P.X(225)} ${P.Y(6.2)} L${P.X(130)} ${P.Y(7.4)}" style="stroke:var(--warn);stroke-width:2.5"/><text class="tx2" x="${P.X(180)}" y="${P.Y(5.3)}" style="fill:var(--warn)">← fissão</text>`;
      const [v, Z] = BA(A);
      s += `<line x1="${P.X(A)}" x2="${P.X(A)}" y1="${o.t}" y2="${o.H - o.b}" style="stroke:var(--ink3);stroke-dasharray:3 3"/><circle cx="${P.X(A)}" cy="${P.Y(v)}" r="6" style="fill:var(--warn);stroke:var(--card);stroke-width:2"/>`;
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("B/A pela fórmula", numPt(v, 2) + " MeV") + vis("energia de ligação total", numPt(v * A, 0) + " MeV") + vis("Z mais estável (vale)", numPt(Z, 0));
    }
    q("[data-c=A]").addEventListener("input", desenha); desenha();
  };

  /* ---------- C19b · reação em cadeia ---------- */
  SIM.reacaoCadeia = (el, F) => {
    const o = { W: 640, H: 300, l: 54, r: 14, t: 12, b: 32, x0: 0, x1: 60 };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${o.W} ${o.H}" width="${o.W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>fator de multiplicação k</label><input type="range" min="0.8" max="1.25" step="0.005" value="1" data-c="k"><output data-o="k"></output></div>
      <div class="bts"><button class="bt peq" data-p="0.95">subcrítico</button><button class="bt peq" data-p="1">crítico (reator)</button><button class="bt peq" data-p="1.1">supercrítico</button></div></div>
      <div class="status">Cada fissão solta 2 ou 3 nêutrons. k é quantos deles, em média, causam uma <b>nova</b> fissão (os outros escapam ou são absorvidos). Começando com 1000 nêutrons, o gráfico mostra quantos há em cada geração (eixo vertical em escala logarítmica). Um reator opera com k = 1 exatamente, controlado por barras que absorvem nêutrons.</div>`);
    const q = (s) => el.querySelector(s);
    function desenha() {
      const k = +q("[data-c=k]").value; q("[data-o=k]").textContent = numPt(k, 3);
      const oo = { ...o, y0: 0, y1: 8 }, P = quadroM(oo);
      let s = eixosM(oo, P, [0, 10, 20, 30, 40, 50, 60], [0, 2, 4, 6, 8], "geração", "nêutrons", (v) => v, (v) => "10^" + v);
      let d = ""; for (let g = 0; g <= 60; g++) { const N = 1000 * Math.pow(k, g), y = Math.max(0, Math.min(8.2, Math.log10(N))); d += (g ? "L" : "M") + P.X(g).toFixed(1) + " " + P.Y(y).toFixed(1); }
      s += `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.6"/>`;
      q("[data-v=sv]").innerHTML = s;
      const tipo = Math.abs(k - 1) < 0.0026 ? "crítico: constante" : k < 1 ? "subcrítico: a reação morre" : "supercrítico: cresce exponencialmente";
      q("[data-v=lt]").innerHTML = vis("regime", tipo) + vis("depois de 60 gerações", F.cient(1000 * Math.pow(k, 60), 2)) + vis("tempo de 60 gerações (~1 ms cada, com moderador)", "≈ 60 ms");
    }
    q("[data-c=k]").addEventListener("input", desenha);
    el.querySelectorAll("[data-p]").forEach((x) => x.addEventListener("click", () => { q("[data-c=k]").value = x.dataset.p; desenha(); }));
    desenha();
  };

  /* ---------- C20 · bandas de energia ---------- */
  SIM.bandas = (el, F) => {
    const MAT = { metal: ["metal (cobre)", 0], si: ["semicondutor (silício)", 1.12], ge: ["semicondutor (germânio)", 0.67], iso: ["isolante (diamante)", 5.5] };
    let m = "si", dop = "nenhuma";
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 640 300" width="640" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="ctrl"><label>temperatura (K)</label><input type="range" min="50" max="600" step="5" value="300" data-c="T"><output data-o="T"></output></div>
      <div class="bts">${botoes(Object.entries(MAT).map(([k, v]) => [k, v[0]]), "m", m)}</div>
      <div class="bts"><b style="margin-right:6px">dopagem:</b>${botoes([["nenhuma", "nenhuma"], ["n", "tipo n (fósforo)"], ["p", "tipo p (boro)"]], "d", dop)}</div></div>
      <div class="status">Num sólido, os níveis de energia dos átomos se juntam em <b>bandas</b>. Embaixo, a banda de valência (cheia); em cima, a de condução. Para conduzir, um elétron precisa de um lugar vazio logo acima dele. No metal, a banda já está pela metade. No semicondutor, a agitação térmica joga alguns elétrons por cima do "gap", deixando lacunas (bolinhas vazias). No isolante, o gap é grande demais.</div>`);
    const q = (s) => el.querySelector(s);
    function desenha() {
      const T = +q("[data-c=T]").value, [nome, Eg] = MAT[m]; q("[data-o=T]").textContent = T;
      const kT = 8.617e-5 * T;
      const nexc = Eg === 0 ? 0 : Math.min(14, Math.round(4 * Math.exp(-Eg / (2 * kT)) / Math.exp(-1.12 / (2 * 8.617e-5 * 300)))), yv = 240, gapPx = Eg === 0 ? 0 : Math.min(150, 25 + Eg * 22);
      let s = "";
      if (Eg === 0) { s += `<rect x="120" y="70" width="400" height="160" rx="8" style="fill:color-mix(in srgb,#7ab8e6 22%,transparent);stroke:#7ab8e6"/><rect x="120" y="150" width="400" height="80" rx="0" style="fill:color-mix(in srgb,#7ab8e6 40%,transparent)"/><text class="tx2" x="320" y="62" text-anchor="middle">uma banda parcialmente cheia</text>`;
        for (let i = 0; i < 24; i++) s += `<circle cx="${140 + (i % 12) * 32}" cy="${170 + Math.floor(i / 12) * 30}" r="5" style="fill:#7ab8e6"/>`; }
      else {
        const yc = yv - 70 - gapPx;
        s += `<rect x="120" y="${yv - 70}" width="400" height="70" rx="8" style="fill:color-mix(in srgb,#7ab8e6 35%,transparent);stroke:#7ab8e6"/><text class="tx2" x="530" y="${yv - 30}">valência</text>`;
        s += `<rect x="120" y="${yc - 60}" width="400" height="60" rx="8" style="fill:color-mix(in srgb,#f2c94c 14%,transparent);stroke:#f2c94c"/><text class="tx2" x="530" y="${yc - 25}">condução</text>`;
        s += `<line x1="100" x2="100" y1="${yv - 70}" y2="${yc}" style="stroke:var(--ink2)"/><text class="tx2" x="94" y="${(yv - 70 + yc) / 2 + 4}" text-anchor="end">Eg = ${numPt(Eg, 2)} eV</text>`;
        for (let i = 0; i < 24; i++) { const x = 140 + (i % 12) * 32, y = yv - 50 + Math.floor(i / 12) * 28, buraco = i < nexc; s += `<circle cx="${x}" cy="${y}" r="5" style="fill:${buraco ? "none" : "#7ab8e6"};stroke:#7ab8e6;stroke-width:1.5"/>`; }
        for (let i = 0; i < nexc; i++) s += `<circle cx="${140 + (i % 12) * 32}" cy="${yc - 30}" r="5" style="fill:#f2c94c"/>`;
        if (dop === "n") { s += `<line x1="140" x2="500" y1="${yc + 12}" y2="${yc + 12}" style="stroke:var(--ok);stroke-dasharray:4 4"/><text class="tx2" x="320" y="${yc + 26}" text-anchor="middle" style="fill:var(--ok)">níveis doadores (elétrons extras logo abaixo da condução)</text>`; for (let i = 0; i < 6; i++) s += `<circle cx="${330 + i * 30}" cy="${yc - 30}" r="5" style="fill:var(--ok)"/>`; }
        if (dop === "p") { s += `<line x1="140" x2="500" y1="${yv - 82}" y2="${yv - 82}" style="stroke:var(--bad);stroke-dasharray:4 4"/><text class="tx2" x="320" y="${yv - 88}" text-anchor="middle" style="fill:var(--bad)">níveis aceitadores (capturam elétrons da valência)</text>`; for (let i = 0; i < 6; i++) s += `<circle cx="${330 + i * 30}" cy="${yv - 50}" r="5" style="fill:var(--card);stroke:var(--bad);stroke-width:2"/>`; }
      }
      q("[data-v=sv]").innerHTML = s;
      const cond = Eg === 0 ? "ótima (sempre)" : Eg > 3 ? "praticamente nenhuma" : dop !== "nenhuma" ? "boa (dopagem domina)" : nexc > 0 ? "pequena, cresce rápido com T" : "quase nenhuma";
      const fat = Eg === 0 ? "—" : F.cient(Math.exp(-Eg / (2 * kT)), 1);
      q("[data-v=lt]").innerHTML = vis("kT", numPt(kT * 1000, 1) + " meV") + vis("fator e^(−Eg/2kT)", fat) + vis("condução", cond) + (Eg > 0 ? vis("λ da luz que cruza o gap", numPt(1240 / Eg, 0) + " nm") : "");
    }
    q("[data-c=T]").addEventListener("input", desenha);
    liga(el, "m", (v) => { m = v; desenha(); });
    liga(el, "d", (v) => { dop = v; desenha(); });
    desenha();
  };

  /* ---------- C21 · montador de hádrons com quarks ---------- */
  SIM.quarks = (el, F) => {
    const Q = { u: ["u", 2 / 3, 0, "#e8706a"], d: ["d", -1 / 3, 0, "#7ab8e6"], s: ["s", -1 / 3, -1, "#7ad08f"] };
    const NOMES = { uud: "próton (p)", udd: "nêutron (n)", uuu: "Δ⁺⁺", ddd: "Δ⁻", uds: "Λ⁰ ou Σ⁰", uus: "Σ⁺", dds: "Σ⁻", uss: "Ξ⁰", dss: "Ξ⁻", sss: "Ω⁻ (previsto por Gell-Mann em 1962, achado em 1964)",
      "u|d": "píon π⁺", "d|u": "píon π⁻", "u|u": "píon π⁰ (mistura com dd̄)", "d|d": "píon π⁰ (mistura com uū)", "u|s": "káon K⁺", "d|s": "káon K⁰", "s|u": "káon K⁻", "s|d": "anti-káon K̄⁰", "s|s": "méson φ (ss̄)" };
    let modo = "barion", sel = ["u", "u", "d"], anti = ["u", "d"];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 640 220" width="640" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="bts">${botoes([["barion", "bárion (3 quarks)"], ["meson", "méson (quark + antiquark)"]], "m", modo)}</div><div data-v="esc"></div></div>
      <div class="status">Quarks têm carga fracionária: u = +2/3, d = −1/3, s = −1/3 (e o s tem "estranheza" −1). Eles nunca aparecem sozinhos: só em trios (bárions) ou em pares quark–antiquark (mésons), sempre com carga total inteira. O antiquark tem carga oposta à do quark.</div>`);
    const q = (s) => el.querySelector(s);
    function escolhas() {
      const n = modo === "barion" ? 3 : 2;
      let h = "";
      for (let i = 0; i < n; i++) h += `<div class="bts"><b style="margin-right:6px">${modo === "meson" && i === 1 ? "antiquark" : "quark " + (i + 1)}:</b>${["u", "d", "s"].map((x) => `<button class="bt peq" data-pos="${i}" data-q="${x}" aria-pressed="${(modo === "barion" ? sel : anti)[i] === x}">${x}${modo === "meson" && i === 1 ? "̄" : ""}</button>`).join("")}</div>`;
      q("[data-v=esc]").innerHTML = h;
      q("[data-v=esc]").querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => { (modo === "barion" ? sel : anti)[+b.dataset.pos] = b.dataset.q; escolhas(); desenha(); }));
    }
    function desenha() {
      const lista = modo === "barion" ? sel : anti;
      let s = "", carga = 0, estr = 0;
      lista.forEach((x, i) => { const [n, qq, st, cor] = Q[x], ehAnti = modo === "meson" && i === 1, cx = modo === "barion" ? 230 + i * 90 : 270 + i * 100;
        s += `<circle cx="${cx}" cy="110" r="36" style="fill:${ehAnti ? "var(--card)" : cor};stroke:${cor};stroke-width:3;opacity:.95"/><text class="tx" x="${cx}" y="116" text-anchor="middle" style="font-size:22px;fill:${ehAnti ? cor : "#111"}">${n}${ehAnti ? "̄" : ""}</text><text class="tx2" x="${cx}" y="168" text-anchor="middle">${ehAnti ? (qq > 0 ? "−" : "+") : qq > 0 ? "+" : "−"}${Math.abs(qq) > 0.5 ? "2/3" : "1/3"}</text>`;
        carga += ehAnti ? -qq : qq; estr += ehAnti ? -st : st; });
      s += `<ellipse cx="320" cy="110" rx="${modo === "barion" ? 175 : 150}" ry="70" style="fill:none;stroke:var(--ink3);stroke-dasharray:6 5"/>`;
      q("[data-v=sv]").innerHTML = s;
      const chave = modo === "barion" ? [...sel].sort((a, b) => "uds".indexOf(a) - "uds".indexOf(b)).join("") : anti[0] + "|" + anti[1];
      const cargaTxt = Math.abs(carga - Math.round(carga)) < 1e-9 ? (Math.round(carga) > 0 ? "+" : "") + Math.round(carga) : numPt(carga, 2);
      q("[data-v=lt]").innerHTML = vis("carga total", cargaTxt + " e") + vis("número bariônico", modo === "barion" ? "1" : "0") + vis("estranheza", estr) + vis("partícula", NOMES[chave] || "—");
    }
    liga(el, "m", (v) => { modo = v; escolhas(); desenha(); });
    escolhas(); desenha();
  };
})();
