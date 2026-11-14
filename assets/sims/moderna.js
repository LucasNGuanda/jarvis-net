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
})();
