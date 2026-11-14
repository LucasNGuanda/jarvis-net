/* Simulações de Ondas (O01–O04): corda (onda viajante, longitudinal e pulso com reflexão), interferência de duas fontes,
   ondas estacionárias (corda e tubos) e efeito Doppler com cone de Mach. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${k === ativo}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v.toFixed(d)).toString().replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;

  /* ---------- O01 · a onda na corda ---------- */
  SIM.ondaCorda = (el, F) => {
    const W = 680, H = 260, Lx = 4;
    let modo = "trans", fim = "fixa", vivo = true, t0 = performance.now();
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("amplitude A (cm)", "A", 1, 10, 0.5, 5)}${sl("comprimento de onda λ (m)", "l", 0.5, 4, 0.05, 1.5)}${sl("frequência f (Hz, em câmera lenta)", "f", 0.1, 2, 0.05, 0.5)}
      <div class="bts">${botoes([["trans", "transversal"], ["long", "longitudinal"], ["pulso", "pulso"]], "m", modo)}</div>
      <div class="bts" data-v="fim">${botoes([["fixa", "ponta presa"], ["livre", "ponta solta"]], "e", fim)}</div></div>
      <div class="status">Cada bolinha é um pedaço do meio. A <b style="color:var(--bad)">vermelha</b> só sobe e desce (ou vai e volta): quem anda é a <b>forma</b> da onda, não a matéria. No modo pulso, veja a reflexão: na ponta presa o pulso volta de cabeça para baixo; na ponta solta, volta igual.</div>`);
    const q = (s) => el.querySelector(s);
    function desenha() {
      const A = +q("[data-c=A]").value, lam = +q("[data-c=l]").value, f = +q("[data-c=f]").value;
      ["A", "l", "f"].forEach((c) => (q(`[data-o=${c}]`).textContent = n2(+q(`[data-c=${c}]`).value)));
      q("[data-v=fim]").style.display = modo === "pulso" ? "" : "none";
      const t = (performance.now() - t0) / 1000, k = (2 * Math.PI) / lam, w = 2 * Math.PI * f, v = lam * f;
      const X = (x) => 30 + (x / Lx) * (W - 60), Y = (y) => H / 2 - y * 9;
      let s = `<line x1="20" x2="${W - 20}" y1="${H / 2}" y2="${H / 2}" style="stroke:var(--line)"/>`;
      const N = modo === "long" ? 60 : 80;
      if (modo === "pulso") {
        const vp = 1.2, Tvolta = (2 * Lx) / vp + 1.5, tt = t % Tvolta, sg = fim === "fixa" ? -1 : 1, g = (u) => A * Math.exp(-(((u - 0.4) / 0.25) ** 2));
        let d = "";
        for (let i = 0; i <= 200; i++) { const x = (Lx * i) / 200, y = g(x - vp * tt) + sg * g(2 * Lx - x - vp * tt); d += (i ? "L" : "M") + X(x).toFixed(1) + " " + Y(y).toFixed(1); }
        s += `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.6"/><rect x="${X(Lx)}" y="${H / 2 - 50}" width="${fim === "fixa" ? 10 : 4}" height="100" style="fill:${fim === "fixa" ? "#9aa3ad" : "var(--ink3)"}"/>`;
        if (fim === "livre") s += `<circle cx="${X(Lx)}" cy="${Y(g(Lx - vp * tt) + g(Lx - vp * tt))}" r="5" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
        q("[data-v=lt]").innerHTML = vis("reflexão na ponta " + (fim === "fixa" ? "presa" : "solta"), fim === "fixa" ? "invertida" : "sem inverter") + vis("velocidade do pulso", "1,2 m/s (fixa)");
      } else {
        for (let i = 0; i <= N; i++) {
          const x0 = (Lx * i) / N, fase = k * x0 - w * t, red = i === Math.round(N * 0.5);
          if (modo === "trans") s += `<circle cx="${X(x0)}" cy="${Y(A * Math.sin(fase))}" r="${red ? 6 : 3.6}" style="fill:${red ? "var(--bad)" : "var(--mod)"}"/>`;
          else { const dx = (A / 100) * 1.4 * Math.sin(fase); for (let j = -2; j <= 2; j++) s += `<circle cx="${X(x0 + dx)}" cy="${H / 2 + j * 18}" r="${red ? 5 : 3}" style="fill:${red ? "var(--bad)" : "var(--mod)"};opacity:${red ? 1 : 0.8}"/>`; }
        }
        s += `<line x1="${X(0.2)}" x2="${X(0.2 + lam)}" y1="${H - 22}" y2="${H - 22}" style="stroke:var(--warn);stroke-width:2"/><text class="tx2" x="${X(0.2 + lam / 2)}" y="${H - 8}" text-anchor="middle">λ</text>`;
        q("[data-v=lt]").innerHTML = vis("velocidade v = λf", n2(v) + " m/s") + vis("período T = 1/f", n2(1 / f) + " s") + vis("número de onda k = 2π/λ", n2(k) + " rad/m") + vis("velocidade máx. da bolinha Aω", n2((A / 100) * w, 3) + " m/s");
      }
      q("[data-v=sv]").innerHTML = s;
    }
    function laco() { if (!vivo) return; desenha(); requestAnimationFrame(laco); }
    liga(el, "m", (v) => { modo = v; t0 = performance.now(); });
    liga(el, "e", (v) => { fim = v; t0 = performance.now(); });
    requestAnimationFrame(laco); F.aoSair(() => (vivo = false));
  };

  /* ---------- O02 · interferência de duas fontes ---------- */
  SIM.interferencia = (el, F) => {
    const N = 200, PX = 2; /* grade de 200 × 200, mostrada em 400 × 400 */
    let vivo = true, mic = [140, 60], nodais = true, t0 = performance.now();
    el.insertAdjacentHTML("beforeend", `<div class="palco grade2" style="align-items:center"><div style="position:relative;width:400px;max-width:100%;margin:auto"><canvas width="${N}" height="${N}" style="width:100%;border-radius:8px;image-rendering:auto;touch-action:none;cursor:crosshair"></canvas><svg viewBox="0 0 ${N} ${N}" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" data-v="sv"></svg></div><div class="leitor" data-v="lt" style="flex-direction:column;align-items:stretch"></div></div>
      <div class="ctrls">${sl("distância entre as fontes d (cm)", "d", 1, 12, 0.5, 6)}${sl("comprimento de onda λ (cm)", "l", 1, 6, 0.1, 2.7)}
      <div class="bts"><button class="bt peq" data-a="nod" aria-pressed="true">linhas nodais</button></div></div>
      <div class="status">Duas fontes em fase (como dois dedos batendo juntos numa cuba de água) mandam ondas circulares. Onde a diferença de caminho é um número inteiro de λ, as cristas chegam juntas (interferência construtiva); onde é meio λ a mais, uma crista encontra um vale e a água fica parada (linhas nodais, tracejadas). <b>Clique</b> para mudar de lugar o microfone (o ponto branco).</div>`);
    const q = (s) => el.querySelector(s), cv = q("canvas"), cx = cv.getContext("2d"), img = cx.createImageData(N, N);
    const ESC = 0.12; /* cm por pixel da grade: o tanque tem 24 × 24 cm */
    cv.addEventListener("pointerdown", (ev) => { const r = cv.getBoundingClientRect(); mic = [((ev.clientX - r.left) / r.width) * N, ((ev.clientY - r.top) / r.height) * N]; });
    q("[data-a=nod]").addEventListener("click", (ev) => { nodais = !nodais; ev.target.setAttribute("aria-pressed", nodais); });
    function quadro() {
      if (!vivo) return;
      const d = +q("[data-c=d]").value, lam = +q("[data-c=l]").value; q("[data-o=d]").textContent = n2(d, 1); q("[data-o=l]").textContent = n2(lam, 1);
      const t = (performance.now() - t0) / 1000, w = 2 * Math.PI * 1.2, k = (2 * Math.PI) / lam;
      const f1 = [N / 2 - d / 2 / ESC, N - 12], f2 = [N / 2 + d / 2 / ESC, N - 12];
      const escuro = !document.documentElement.getAttribute("data-tema");
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const r1 = Math.hypot(i - f1[0], j - f1[1]) * ESC + 0.3, r2 = Math.hypot(i - f2[0], j - f2[1]) * ESC + 0.3;
        const y = (Math.cos(k * r1 - w * t) / Math.sqrt(r1) + Math.cos(k * r2 - w * t) / Math.sqrt(r2)) * 0.9;
        const o = 4 * (j * N + i), c = Math.max(-1, Math.min(1, y));
        if (escuro) { img.data[o] = 40 + 60 * c; img.data[o + 1] = 110 + 90 * c; img.data[o + 2] = 170 + 80 * c; } else { img.data[o] = 150 + 90 * c; img.data[o + 1] = 190 + 60 * c; img.data[o + 2] = 225 + 30 * c; }
        img.data[o + 3] = 255;
      }
      cx.putImageData(img, 0, 0);
      /* linhas nodais: |r1 − r2| = (m + ½)λ */
      let s = `<circle cx="${f1[0]}" cy="${f1[1]}" r="3" style="fill:#f2c94c"/><circle cx="${f2[0]}" cy="${f2[1]}" r="3" style="fill:#f2c94c"/>`;
      let nn = 0;
      if (nodais) for (let m = 0; (m + 0.5) * lam < d; m++) for (const sg of [-1, 1]) {
        nn++; const D = (m + 0.5) * lam * sg; let path = "";
        for (let j = 0; j < N; j += 2) { /* resolve |r1 − r2| = D na linha j por bissecção em i */
          let lo = 0, hi = N, ok = false; const fx = (i) => (Math.hypot(i - f1[0], j - f1[1]) - Math.hypot(i - f2[0], j - f2[1])) * ESC - D;
          if (fx(lo) * fx(hi) < 0) { ok = true; for (let it = 0; it < 30; it++) { const md = (lo + hi) / 2; if (fx(lo) * fx(md) <= 0) hi = md; else lo = md; } }
          if (ok) path += (path ? "L" : "M") + ((lo + hi) / 2).toFixed(1) + " " + j;
        }
        s += `<path d="${path}" style="fill:none;stroke:#fff;stroke-width:.7;stroke-dasharray:3 3;opacity:.8"/>`;
      }
      else for (let m = 0; (m + 0.5) * lam < d; m++) nn += 2;
      s += `<circle cx="${mic[0]}" cy="${mic[1]}" r="4" style="fill:#fff;stroke:#111;stroke-width:1"/>`;
      q("[data-v=sv]").innerHTML = s;
      const r1 = Math.hypot(mic[0] - f1[0], mic[1] - f1[1]) * ESC, r2 = Math.hypot(mic[0] - f2[0], mic[1] - f2[1]) * ESC, dl = Math.abs(r1 - r2) / lam, frac = dl - Math.floor(dl);
      const amp = Math.abs(Math.cos(Math.PI * dl));
      q("[data-v=lt]").innerHTML = vis("d/λ", n2(d / lam)) + vis("linhas nodais (2 × ⌊d/λ + ½⌋)", 2 * Math.floor(d / lam + 0.5)) + vis("diferença de caminho no microfone", n2(dl, 2) + " λ") + vis("amplitude no microfone (relativa)", n2(amp, 2) + (amp > 0.9 ? " (construtiva)" : amp < 0.15 ? " (destrutiva)" : ""));
      requestAnimationFrame(quadro);
    }
    requestAnimationFrame(quadro); F.aoSair(() => (vivo = false));
  };

  /* ---------- O03 · ondas estacionárias ---------- */
  SIM.estacionaria = (el, F) => {
    const W = 680, H = 280;
    let modo = "corda", viajantes = false, vivo = true, t0 = performance.now();
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("harmônico n", "n", 1, 6, 1, 1)}${sl("comprimento L (m)", "L", 0.2, 2, 0.01, 0.65)}
      <div data-v="corda" style="display:contents">${sl("tração T (N)", "T", 10, 300, 1, 123)}${sl("densidade linear μ (g/m)", "mu", 1, 20, 0.5, 6)}</div>
      <div class="bts">${botoes([["corda", "corda presa nas pontas"], ["aberto", "tubo aberto–aberto"], ["fechado", "tubo fechado–aberto"]], "m", modo)}<button class="bt peq" data-a="via" aria-pressed="false">mostrar as duas ondas viajantes</button></div></div>
      <div class="status">Uma onda indo e outra voltando, iguais, somam uma onda que não anda: há pontos parados (<b>nós</b>, N) e pontos que vibram ao máximo (<b>ventres</b>, V). Na corda presa, as pontas são nós. No tubo, as pontas abertas são ventres de deslocamento do ar, e a fechada é nó: por isso o tubo fechado só tem harmônicos ímpares. Valores iniciais: a corda Lá (110 Hz) de um violão.</div>`);
    const q = (s) => el.querySelector(s);
    q("[data-a=via]").addEventListener("click", (ev) => { viajantes = !viajantes; ev.target.setAttribute("aria-pressed", viajantes); });
    function desenha() {
      const n = +q("[data-c=n]").value, L = +q("[data-c=L]").value, T = +q("[data-c=T]").value, mu = +q("[data-c=mu]").value / 1000;
      ["n", "L", "T", "mu"].forEach((c) => (q(`[data-o=${c}]`).textContent = n2(+q(`[data-c=${c}]`).value)));
      q("[data-v=corda]").style.display = modo === "corda" ? "contents" : "none";
      const v = modo === "corda" ? Math.sqrt(T / mu) : 343, m = modo === "fechado" ? 2 * n - 1 : n;
      const lam = modo === "fechado" ? (4 * L) / m : (2 * L) / m, f = v / lam;
      const t = (performance.now() - t0) / 1000, ws = 2 * Math.PI * 0.6; /* câmera lenta */
      const X = (u) => 40 + u * (W - 80), Y = (y) => H / 2 - y * 70;
      /* forma: corda/aberto → sen ou cos; deslocamento no tubo: aberto–aberto cos(mπu), fechado (u = 0 fechado) sen(mπu/2) */
      const forma = modo === "corda" ? (u) => Math.sin(m * Math.PI * u) : modo === "aberto" ? (u) => Math.cos(m * Math.PI * u) : (u) => Math.sin((m * Math.PI * u) / 2);
      let s = "";
      if (modo !== "corda") s += `<rect x="${X(0)}" y="${H / 2 - 80}" width="${X(1) - X(0)}" height="160" style="fill:color-mix(in srgb,var(--mod) 6%,transparent);stroke:var(--ink3);stroke-width:1.5"/>` + (modo === "fechado" ? `<rect x="${X(0) - 8}" y="${H / 2 - 84}" width="8" height="168" style="fill:#9aa3ad"/>` : "");
      else s += `<rect x="${X(0) - 8}" y="${H / 2 - 30}" width="8" height="60" style="fill:#9aa3ad"/><rect x="${X(1)}" y="${H / 2 - 30}" width="8" height="60" style="fill:#9aa3ad"/>`;
      let env1 = "", env2 = "", d = "", d1 = "", d2 = "";
      for (let i = 0; i <= 240; i++) {
        const u = i / 240, a = forma(u), xx = X(u).toFixed(1);
        env1 += (i ? "L" : "M") + xx + " " + Y(a).toFixed(1); env2 += (i ? "L" : "M") + xx + " " + Y(-a).toFixed(1);
        d += (i ? "L" : "M") + xx + " " + Y(a * Math.cos(ws * t)).toFixed(1);
        if (viajantes && modo === "corda") { const kk = m * Math.PI; d1 += (i ? "L" : "M") + xx + " " + Y(0.5 * Math.sin(kk * u - ws * t)).toFixed(1); d2 += (i ? "L" : "M") + xx + " " + Y(0.5 * Math.sin(kk * u + ws * t)).toFixed(1); }
      }
      s += `<path d="${env1}" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/><path d="${env2}" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/>`;
      if (modo === "corda") { s += `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:3"/>`; if (viajantes) s += `<path d="${d1}" style="fill:none;stroke:#7ab8e6;stroke-width:1.5;opacity:.8"/><path d="${d2}" style="fill:none;stroke:#e88fd0;stroke-width:1.5;opacity:.8"/>`; }
      else { /* partículas de ar indo e vindo na horizontal */ for (let i = 0; i <= 44; i++) for (let j = -3; j <= 3; j++) { const u = i / 44, dx = 0.022 * forma(u) * Math.cos(ws * t); s += `<circle cx="${X(Math.min(1, Math.max(0, u + dx)))}" cy="${H / 2 + j * 20}" r="2.4" style="fill:var(--mod);opacity:.85"/>`; } }
      /* nós e ventres */
      for (let i = 0; i <= 480; i++) { const u = i / 480, a = Math.abs(forma(u)); const ant = Math.abs(forma(Math.max(0, u - 1 / 480))), pos = Math.abs(forma(Math.min(1, u + 1 / 480)));
        if (a < 1e-9 || (a <= ant && a <= pos && a < 0.02)) s += `<text class="tx2" x="${X(u)}" y="${H - 14}" text-anchor="middle" style="fill:var(--bad);font-weight:700">N</text>`;
        else if (a > 0.999 && a >= ant && a >= pos) s += `<text class="tx2" x="${X(u)}" y="${H - 14}" text-anchor="middle" style="fill:var(--ok);font-weight:700">V</text>`; }
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("velocidade da onda", n2(v, 1) + " m/s") + vis("harmônico", modo === "fechado" ? `${m}º (só ímpares)` : `${m}º`) + vis("comprimento de onda", n2(lam, 3) + " m") + vis("frequência", n2(f, 1) + " Hz");
    }
    function laco() { if (!vivo) return; desenha(); requestAnimationFrame(laco); }
    liga(el, "m", (v) => { modo = v; if (v !== "corda") q("[data-c=L]").value = 0.6; });
    requestAnimationFrame(laco); F.aoSair(() => (vivo = false));
  };

  /* ---------- O04 · efeito Doppler e cone de Mach ---------- */
  SIM.doppler = (el, F) => {
    const W = 680, H = 320, v = 1; /* velocidade do som = 1 unidade; período de emissão 0,35 */
    let vivo = true, frentes = [], xs = 60, t = 0, ult = null, tEmit = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("velocidade da fonte vₛ / v (som)", "u", 0, 2, 0.05, 0.5)}${sl("frequência da fonte f (Hz)", "f", 200, 1000, 10, 700)}</div>
      <div class="status">A fonte emite uma frente de onda circular a cada período. Andando, ela "alcança" as frentes que mandou para a frente (amontoadas: λ menor, som mais agudo) e se afasta das de trás (espaçadas: mais grave). Com vₛ = v, todas as frentes se acumulam numa parede: a "barreira do som". Acima disso, a fonte passa à frente das próprias ondas, e as frentes formam um cone (o estrondo sônico) com sen θ = v/vₛ.</div>`);
    const q = (s) => el.querySelector(s);
    function desenha(dt) {
      const u = +q("[data-c=u]").value, f = +q("[data-c=f]").value; q("[data-o=u]").textContent = n2(u); q("[data-o=f]").textContent = f;
      const esc = 160, Tp = 0.35;
      t += dt; xs += u * v * esc * dt; tEmit += dt;
      if (tEmit >= Tp) { tEmit -= Tp; frentes.push([xs, t]); }
      if (xs > W + 40) { xs = -10; frentes = []; }
      frentes = frentes.filter(([, t0]) => (t - t0) * v * esc < 900);
      let s = `<line x1="0" x2="${W}" y1="${H / 2}" y2="${H / 2}" style="stroke:var(--line)"/>`;
      frentes.forEach(([x0, t0]) => { const r = (t - t0) * v * esc; s += `<circle cx="${x0}" cy="${H / 2}" r="${r}" style="fill:none;stroke:var(--mod);stroke-width:1.3;opacity:${Math.max(0.15, 1 - r / 900)}"/>`; });
      if (u > 1) { const th = Math.asin(1 / u), Lc = 900; s += `<path d="M${xs} ${H / 2} L${xs - Lc * Math.cos(th)} ${H / 2 - Lc * Math.sin(th)} M${xs} ${H / 2} L${xs - Lc * Math.cos(th)} ${H / 2 + Lc * Math.sin(th)}" style="stroke:var(--warn);stroke-width:2.5"/>`; }
      s += `<circle cx="${xs}" cy="${H / 2}" r="7" style="fill:var(--warn)"/><circle cx="${W - 30}" cy="${H / 2}" r="6" style="fill:#7ab8e6"/><text class="tx2" x="${W - 30}" y="${H / 2 - 12}" text-anchor="middle">na frente</text><circle cx="30" cy="${H / 2}" r="6" style="fill:#e88fd0"/><text class="tx2" x="30" y="${H / 2 - 12}" text-anchor="middle">atrás</text>`;
      q("[data-v=sv]").innerHTML = s;
      const vs = u * 343, frente = u < 1 ? n2((f * 343) / (343 - vs), 0) + " Hz" : u === 1 ? "parede de som" : "o som chega depois da fonte", tras = n2((f * 343) / (343 + vs), 0) + " Hz";
      q("[data-v=lt]").innerHTML = vis("vₛ (com som a 343 m/s)", n2(vs, 0) + " m/s") + vis("quem está na frente ouve", frente) + vis("quem está atrás ouve", tras) + vis("meio ângulo do cone de Mach", u > 1 ? n2((Math.asin(1 / u) * 180) / Math.PI, 1) + "°" : "não há cone");
    }
    function laco(ts) { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; desenha(dt); requestAnimationFrame(laco); }
    q("[data-c=u]").addEventListener("input", () => { frentes = []; xs = 60; });
    requestAnimationFrame(laco); F.aoSair(() => (vivo = false));
  };
})();
