/* Simulações da aba Experimental (módulos FEm, FEg, FEr). FE01 lendo uma régua; FE02 cronômetro na mão; FE03 medidas repetidas; FE04 propagação; FE05 comparando resultados; FE06 barras de erro; FE07 linearização; FE08 log-log; */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${k === ativo}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : Math.abs(v) < 0.5 * Math.pow(10, -d) ? "0" : (+v.toFixed(d)).toString().replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const val = (el, c) => +el.querySelector(`[data-c=${c}]`).value;
  const mostra = (el, cs, d = 1) => cs.forEach((c) => (el.querySelector(`[data-o=${c}]`).textContent = n2(val(el, c), d)));
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };

  /* ---------- FE01 · medir uma barra com réguas de resoluções diferentes ---------- */
  SIM.reguaLeitura = (el, F) => {
    const W = 680, H = 240;
    let real = 0, div = 0.1, resp = "";
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div><div class="status" data-v="fb" style="font-weight:600"></div>
      <div class="ctrls"><div class="ctrl"><label>sua leitura (cm)</label><input type="text" inputmode="decimal" data-v="in" style="width:110px" placeholder="ex.: 7,35"><button class="bt pri" data-a="ok">Conferir</button></div>
      <div class="bts">${botoes([["1", "régua de 1 cm"], ["0.5", "régua de 0,5 cm"], ["0.1", "régua de 1 mm"]], "div", "0.1")}<button class="bt" data-a="nova">Outra barra</button></div></div>
      <div class="status">Leia a ponta da barra na régua. A regra: escreva todos os algarismos que a régua garante e mais um, estimado "de olho" entre dois tracinhos (o algarismo duvidoso). Com a régua de milímetros, isso dá duas casas decimais em centímetros. A leitura é aceita se estiver a menos de meia divisão do valor verdadeiro.</div>`);
    const q = (s) => el.querySelector(s);
    const nova = () => { real = 2.5 + Math.round(Math.random() * 6500) / 1000; resp = ""; };
    SIM.reguaLeitura._sig = (txt) => { const t = txt.replace(",", ".").replace(/^[-+]?0*\.?0*/, ""); return t.replace(".", "").length; };
    nova();
    liga(el, "div", (k) => { div = +k; resp = ""; });
    q("[data-a=nova]").addEventListener("click", nova);
    const confere = () => { const txt = q("[data-v=in]").value.trim(), v = F.lerNumero ? F.lerNumero(txt) : +txt.replace(",", "."); if (!txt || !isFinite(v)) { resp = "Escreva um número."; return; } const dec = (txt.split(/[.,]/)[1] || "").length, esperado = div === 0.1 ? 2 : 1, ok = Math.abs(v - real) <= div / 2 + 1e-9; resp = (ok ? "Dentro de meia divisão do valor verdadeiro. " : "Fora de meia divisão: confira de novo. ") + (dec === esperado ? "Número de casas certo." : dec < esperado ? `Faltou o algarismo duvidoso: com essa régua, ${esperado} casa${esperado > 1 ? "s" : ""} decimal${esperado > 1 ? "is" : ""} em cm.` : "Casas demais: essa régua não garante tanto.") + ` Valor verdadeiro: ${n2(real, 3)} cm.`; };
    q("[data-a=ok]").addEventListener("click", confere); q("[data-v=in]").addEventListener("keydown", (e) => { if (e.key === "Enter") confere(); });
    anima(el, F, () => {
      const esc = 58, x0 = 40, y0 = 80;
      let sv = `<rect x="${x0}" y="${y0 - 56}" width="${real * esc}" height="34" rx="3" style="fill:color-mix(in srgb,var(--mA) 40%,transparent);stroke:var(--mA);stroke-width:2"/>`;
      sv += D.regua(x0, y0, 10, esc, div) + `<line x1="${x0 + real * esc}" x2="${x0 + real * esc}" y1="${y0 - 60}" y2="${y0 + 4}" style="stroke:var(--warn);stroke-dasharray:2 3"/>`;
      sv += D.lupaRegua(340, 190, 420, real, div);
      q("[data-v=sv]").innerHTML = sv;
      const casas = div === 0.1 ? 2 : 1;
      q("[data-v=lt]").innerHTML = vis("menor divisão da régua", n2(div * 10, 0) + " mm") + vis("incerteza de leitura (meia divisão)", "± " + n2(div * 5, 1) + " mm") + vis("casas decimais esperadas (em cm)", String(casas)) ; q("[data-v=fb]").textContent = resp || "Digite a sua leitura e clique em Conferir.";
    });
  };

  /* ---------- FE02 · cronômetro manual: atraso (sistemático), espalhamento (tipo A) e resolução (tipo B) ---------- */
  SIM.reflexo = (el, F) => {
    const W = 680, H = 220;
    let estado = "pronto", t = 0, tAlvo = 0, medidas = [], msg = "Clique em Começar. Quando a bolinha cruzar a linha, aperte Agora! (ou a tecla espaço).";
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div><div class="status" data-v="fb" style="font-weight:600"></div>
      <div class="ctrls"><div class="bts"><button class="bt pri" data-a="go">Começar</button><button class="bt pri" data-a="ja">Agora!</button><button class="bt" data-a="zera">Apagar as medidas</button></div></div>
      <div class="status">A bolinha anda a velocidade constante e cruza a linha num instante que o programa conhece. Você para o cronômetro (de centésimos de segundo) quando vê ela cruzar. Repita várias vezes. O atraso médio é um erro sistemático (FE10); o espalhamento das suas medidas é a incerteza tipo A; a resolução do cronômetro (0,01 s) é a incerteza tipo B. Repare qual das duas manda.</div>`);
    const q = (s) => el.querySelector(s);
    const media = (a) => a.reduce((s, x) => s + x, 0) / a.length, dp = (a) => { const m = media(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
    SIM.reflexo._dp = dp;
    const comeca = () => { estado = "correndo"; t = 0; tAlvo = 1.5 + Math.random() * 2; msg = "Atenção..."; };
    const para = () => { if (estado !== "correndo") return; const erro = Math.round(t * 100) / 100 - tAlvo; medidas.push(erro); if (medidas.length > 30) medidas.shift(); estado = "pronto"; msg = `Você parou com ${erro >= 0 ? "atraso" : "adiantamento"} de ${n2(Math.abs(erro), 2)} s. Clique em Começar de novo.`; };
    q("[data-a=go]").addEventListener("click", comeca); q("[data-a=ja]").addEventListener("click", para);
    q("[data-a=zera]").addEventListener("click", () => { medidas = []; msg = "Medidas apagadas."; });
    el.tabIndex = 0; el.addEventListener("keydown", (e) => { if (e.code === "Space") { e.preventDefault(); estado === "correndo" ? para() : comeca(); } });
    anima(el, F, (dt) => {
      if (estado === "correndo") { t += dt; if (t > tAlvo + 1.5) { estado = "pronto"; msg = "A bolinha passou e você não apertou. Clique em Começar."; } }
      const xL = 470, v = (xL - 60) / Math.max(tAlvo, 0.1), xb = estado === "correndo" ? 60 + v * t : 60;
      let sv = `<line x1="40" x2="640" y1="90" y2="90" style="stroke:var(--ink3);stroke-width:2"/><line x1="${xL}" x2="${xL}" y1="50" y2="120" style="stroke:var(--warn);stroke-width:3"/><circle cx="${Math.min(xb, 660)}" cy="80" r="10" style="fill:var(--mA)"/>` + D.txt(xL, 42, "linha", "tx2");
      sv += `<rect x="40" y="140" width="150" height="50" rx="8" style="fill:var(--bg);stroke:var(--ink3)"/><text x="180" y="176" text-anchor="end" style="font:700 26px ui-monospace,monospace;fill:var(--ok)">${(Math.floor(t * 100) / 100).toFixed(2).replace(".", ",")} s</text>`;
      /* pontinhos das medidas (erro de cada uma) num eixo de −0,3 a +0,5 s */
      const ex0 = 260, ew = 380, X = (e) => ex0 + ((e + 0.3) / 0.8) * ew;
      sv += `<line x1="${ex0}" x2="${ex0 + ew}" y1="170" y2="170" style="stroke:var(--ink3)"/><line x1="${X(0)}" x2="${X(0)}" y1="150" y2="190" style="stroke:var(--ok);stroke-width:2"/>` + D.txt(X(0), 206, "0 (exato)", "tx2") + D.txt(ex0, 206, "−0,3 s", "tx2") + D.txt(ex0 + ew, 206, "+0,5 s", "tx2") + D.txt(ex0 + ew / 2, 146, "erro de cada medida", "tx2");
      medidas.forEach((e, i) => (sv += `<circle cx="${X(Math.max(-0.3, Math.min(0.5, e)))}" cy="${170 - ((i % 5) - 2) * 5}" r="4" style="fill:var(--warn)"/>`));
      if (medidas.length >= 2) { const m = media(medidas), s = dp(medidas); sv += `<rect x="${X(m - s)}" y="160" width="${X(m + s) - X(m - s)}" height="20" style="fill:color-mix(in srgb,var(--warn) 20%,transparent);stroke:var(--warn);stroke-dasharray:3 3"/>`; }
      q("[data-v=sv]").innerHTML = sv;
      const m = medidas.length ? media(medidas) : NaN, s = medidas.length >= 2 ? dp(medidas) : NaN;
      q("[data-v=lt]").innerHTML = vis("medidas feitas", String(medidas.length)) + vis("atraso médio (sistemático)", medidas.length ? n2(m, 3) + " s" : "—") + vis("espalhamento: desvio padrão (tipo A)", medidas.length >= 2 ? n2(s, 3) + " s" : "—") + vis("resolução do cronômetro (tipo B)", "0,01 s");
      q("[data-v=fb]").textContent = msg;
    });
  };

  /* ---------- FE03 · medidas repetidas: histograma, média, desvio padrão e desvio da média ---------- */
  SIM.repetidas = (el, F) => {
    const W = 680, H = 280, VERD = 10;
    let dados = [], exps = 0, acertos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("espalhamento de cada medida σ", "s", 0.05, 1, 0.05, 0.4)}${sl("medidas por experimento N", "N", 2, 100, 1, 10)}
      <div class="bts"><button class="bt pri" data-a="um">Fazer um experimento</button><button class="bt" data-a="cem">Fazer 100 experimentos</button><button class="bt" data-a="zera">Zerar</button></div></div>
      <div class="status">O valor verdadeiro (que na vida real você não conhece) é 10,00. Cada medida sai espalhada em volta dele, com desvio padrão σ. Num experimento, você faz N medidas, calcula a média e o desvio padrão da média, σ/√N. O histograma mostra as medidas do último experimento. O contador embaixo mostra em quantos experimentos o intervalo "média ± σ da média" conteve o valor verdadeiro: deve dar perto de 68% (um pouco menos com N pequeno, porque o próprio σ também é uma estimativa; com N = 2, uns 50%).</div>`);
    const q = (s) => el.querySelector(s);
    const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    const estat = (a) => { const n = a.length, m = a.reduce((s, x) => s + x, 0) / n, s = Math.sqrt(a.reduce((t, x) => t + (x - m) ** 2, 0) / (n - 1)); return { m, s, sm: s / Math.sqrt(n) }; };
    SIM.repetidas._estat = estat;
    const exp = () => { const N = val(el, "N"), s = val(el, "s"); dados = Array.from({ length: N }, () => VERD + s * gauss()); const e = estat(dados); exps++; if (Math.abs(e.m - VERD) <= e.sm) acertos++; };
    q("[data-a=um]").addEventListener("click", exp); q("[data-a=cem]").addEventListener("click", () => { for (let i = 0; i < 100; i++) exp(); });
    q("[data-a=zera]").addEventListener("click", () => { dados = []; exps = 0; acertos = 0; });
    ["s", "N"].forEach((k) => q(`[data-c=${k}]`).addEventListener("input", () => { exps = 0; acertos = 0; }));
    exp(); exps = 0; acertos = 0;
    anima(el, F, () => {
      const s = val(el, "s"); mostra(el, ["s"], 2); mostra(el, ["N"], 0);
      const e = dados.length > 1 ? estat(dados) : null, a = VERD - 4 * s, b = VERD + 4 * s, gx = 60, gw = 560, gy = 220, X = (v) => gx + ((v - a) / (b - a)) * gw;
      const nb = 24, bins = new Array(nb).fill(0); dados.forEach((x) => { const k = Math.floor(((x - a) / (b - a)) * nb); if (k >= 0 && k < nb) bins[k]++; });
      const mx = Math.max(1, ...bins), esc = 150 / Math.max(mx, (dados.length * (b - a)) / nb / (s * Math.sqrt(2 * Math.PI)));
      let sv = D.seta(gx, gy, gx + gw + 10, gy, "var(--ink2)", 1.4);
      bins.forEach((c, k) => (sv += `<rect x="${gx + (k * gw) / nb + 1}" y="${gy - c * esc}" width="${gw / nb - 2}" height="${c * esc}" style="fill:color-mix(in srgb,var(--mN) 45%,transparent)"/>`));
      let d = ""; for (let i = 0; i <= 80; i++) { const v = a + ((b - a) * i) / 80, fx = (dados.length * ((b - a) / nb) * Math.exp(-((v - VERD) ** 2) / (2 * s * s))) / (s * Math.sqrt(2 * Math.PI)); d += (i ? "L" : "M") + X(v).toFixed(1) + " " + (gy - fx * esc).toFixed(1); }
      sv += `<path d="${d}" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/>`;
      [-3, -2, -1, 0, 1, 2, 3].forEach((k) => (sv += `<line x1="${X(VERD + k * s)}" x2="${X(VERD + k * s)}" y1="${gy}" y2="${gy + 5}" style="stroke:var(--ink3)"/>` + D.txt(X(VERD + k * s), gy + 18, n2(VERD + k * s, 2), "tx2")));
      sv += `<line x1="${X(VERD)}" x2="${X(VERD)}" y1="40" y2="${gy}" style="stroke:var(--ok);stroke-width:2"/>` + D.txt(X(VERD), 34, "verdadeiro", "tx2");
      if (e) sv += `<rect x="${X(e.m - e.sm)}" y="244" width="${Math.max(2, X(e.m + e.sm) - X(e.m - e.sm))}" height="14" style="fill:color-mix(in srgb,var(--warn) 40%,transparent);stroke:var(--warn)"/><line x1="${X(e.m - e.s)}" x2="${X(e.m + e.s)}" y1="270" y2="270" style="stroke:var(--mN);stroke-width:2"/><circle cx="${X(e.m)}" cy="251" r="4" style="fill:var(--warn)"/>` + D.txt(X(e.m + e.s) + 6, 274, "média ± σ", "tx2", "start") + D.txt(X(e.m + e.sm) + 6, 256, "média ± σ/√N", "tx2", "start");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("média", e ? n2(e.m, 3) : "—") + vis("desvio padrão σ (espalhamento)", e ? n2(e.s, 3) : "—") + vis("desvio da média σ/√N (incerteza)", e ? n2(e.sm, 3) : "—") + vis("intervalos que contêm o verdadeiro", exps ? acertos + " de " + exps + " (" + n2((100 * acertos) / exps, 0) + "%)" : "—");
    });
  };

  /* ---------- FE04 · propagação de incertezas pela derivada logarítmica: quem contribui quanto ---------- */
  SIM.propaga = (el, F) => {
    const W = 680, H = 250;
    /* cada fórmula: f = k · Π x_i^a_i; variáveis com valor e incerteza (sliders) */
    const forms = {
      pend: { nome: "g = 4π² L / T²", k: 4 * Math.PI * Math.PI, un: "m/s²", vs: [["L", "comprimento L (m)", 1, 0.3, 2, 0.01, "ΔL (mm)", 2, 0.5, 10, 0.5, 1e-3], ["T", "período T (s)", -2, 1.1, 2.9, 0.001, "ΔT (ms)", 4, 1, 50, 1, 1e-3]] },
      esf: { nome: "ρ = 6m / (π d³)", k: 6 / Math.PI, un: "g/cm³", vs: [["m", "massa m (g)", 1, 5, 50, 0.1, "Δm (g)", 0.1, 0.01, 1, 0.01, 1], ["d", "diâmetro d (cm)", -3, 1, 4, 0.01, "Δd (mm)", 0.1, 0.05, 1, 0.05, 0.1]] },
      vel: { nome: "v = d / t", k: 1, un: "m/s", vs: [["d", "distância d (m)", 1, 1, 100, 0.5, "Δd (cm)", 50, 1, 100, 1, 0.01], ["t", "tempo t (s)", -1, 0.5, 20, 0.01, "Δt (s)", 0.05, 0.01, 0.3, 0.01, 1]] },
    };
    let fk = "pend";
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls" data-v="ct"></div><div class="bts" style="margin:6px 0">${botoes([["pend", "pêndulo: g = 4π²L/T²"], ["esf", "densidade de uma esfera"], ["vel", "velocidade média"]], "f", "pend")}</div>
      <div class="status">Pela derivada logarítmica, a incerteza relativa do resultado é a soma das incertezas relativas de cada medida, cada uma multiplicada pelo módulo do seu expoente: Δf/f = |a|·Δx/x + |b|·Δy/y. As barras mostram quanto cada medida contribui. A barra mais comprida é a que vale a pena melhorar. Também aparece a versão em quadratura (raiz da soma dos quadrados), usada na universidade.</div>`);
    const q = (s) => el.querySelector(s);
    const monta = () => { const f = forms[fk]; q("[data-v=ct]").innerHTML = f.vs.map(([id, rot, , mn, mx, ps, rotd, dv, dmn, dmx, dps]) => sl(rot, id, mn, mx, ps, id === "L" ? 0.5 : id === "T" ? 1.419 : id === "m" ? 20 : id === "d" && fk === "esf" ? 2 : id === "d" ? 100 : 12.5) + sl(rotd, "d" + id, dmn, dmx, dps, dv)).join(""); };
    SIM.propaga._rel = (pares) => { const termos = pares.map(([a, x, dx]) => Math.abs(a) * (dx / x)); return { termos, lin: termos.reduce((s, t) => s + t, 0), quad: Math.sqrt(termos.reduce((s, t) => s + t * t, 0)) }; };
    liga(el, "f", (k) => { fk = k; monta(); });
    monta();
    anima(el, F, () => {
      const f = forms[fk];
      const pares = f.vs.map(([id, , a, , , , , , , , , fat]) => [a, val(el, id), val(el, "d" + id) * fat]);
      f.vs.forEach(([id]) => { mostra(el, [id], 3); mostra(el, ["d" + id], 2); });
      const r = SIM.propaga._rel(pares), valor = pares.reduce((p, [a, x]) => p * Math.pow(x, a), f.k);
      const bx = 220, bw = 400, mx = Math.max(r.lin, 1e-9);
      let sv = D.txt(20, 30, f.nome, "txm", "start");
      pares.forEach(([a, x, dx], i) => { const t = r.termos[i], y = 60 + i * 50, nome = f.vs[i][0]; sv += D.txt(bx - 10, y + 16, `|${a}| · Δ${nome}/${nome} = ${n2(t * 100, 3)}%`, "tx2", "end") + `<rect x="${bx}" y="${y}" width="${(t / mx) * bw}" height="24" rx="3" style="fill:color-mix(in srgb,${i ? "var(--warn)" : "var(--mA)"} 50%,transparent);stroke:${i ? "var(--warn)" : "var(--mA)"}"/>`; });
      const yT = 60 + pares.length * 50 + 10;
      sv += `<line x1="${bx}" x2="${bx + bw}" y1="${yT - 6}" y2="${yT - 6}" style="stroke:var(--ink3)"/>` + D.txt(bx - 10, yT + 16, "soma (professor) = " + n2(r.lin * 100, 3) + "%", "tx2", "end") + `<rect x="${bx}" y="${yT}" width="${bw}" height="24" rx="3" style="fill:color-mix(in srgb,var(--ok) 40%,transparent);stroke:var(--ok)"/>`;
      sv += D.txt(bx - 10, yT + 56, "quadratura = " + n2(r.quad * 100, 3) + "%", "tx2", "end") + `<rect x="${bx}" y="${yT + 40}" width="${(r.quad / mx) * bw}" height="24" rx="3" style="fill:color-mix(in srgb,var(--ink3) 40%,transparent);stroke:var(--ink3)"/>`;
      q("[data-v=sv]").innerHTML = sv;
      const dv = valor * r.lin;
      q("[data-v=lt]").innerHTML = vis("resultado", n2(valor, 4) + " " + f.un) + vis("incerteza (soma das relativas)", "± " + n2(dv, 4) + " " + f.un) + vis("incerteza relativa", n2(r.lin * 100, 2) + "%") + vis("quem mais contribui", f.vs[r.termos.indexOf(Math.max(...r.termos))][0]);
    });
  };

  /* ---------- FE05 · resultado × valor de referência (e × outra medida): compatibilidade em unidades de Δ ---------- */
  SIM.compara = (el, F) => {
    const W = 680, H = 250;
    let ref = 9.81, dois = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("seu resultado x", "x", 9.3, 10.3, 0.01, 9.72)}${sl("sua incerteza Δx", "dx", 0.01, 0.5, 0.01, 0.06)}${sl("segunda medida y", "y", 9.3, 10.3, 0.01, 9.85)}${sl("incerteza Δy", "dy", 0.01, 0.5, 0.01, 0.05)}
      <div class="bts">${botoes([["9.81", "g padrão (9,81)"], ["9.786", "g em São Paulo (9,786)"]], "ref", "9.81")}<button class="bt" data-a="dois" aria-pressed="false">Comparar com a segunda medida</button></div></div>
      <div class="status">A pergunta não é "o resultado deu igual?", porque nunca dá. É: a diferença é grande ou pequena <b>comparada com a incerteza</b>? Critério usado aqui: até 2Δ, compatível; entre 2Δ e 3Δ, inconclusivo; acima de 3Δ, incompatível (alguma coisa está errada: um erro sistemático, ou a incerteza foi subestimada). Comparando duas medidas, a incerteza da diferença é Δx + Δy.</div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "ref", (k) => (ref = +k));
    q("[data-a=dois]").addEventListener("click", (e) => { dois = !dois; e.target.setAttribute("aria-pressed", dois); });
    const veredito = (n) => (n <= 2 ? ["compatível", "var(--ok)"] : n <= 3 ? ["inconclusivo", "var(--warn)"] : ["incompatível", "var(--bad)"]);
    SIM.compara._n = (a, b, d) => Math.abs(a - b) / d; SIM.compara._media = (a, da, b, db) => { const w1 = 1 / (da * da), w2 = 1 / (db * db); return { m: (w1 * a + w2 * b) / (w1 + w2), u: 1 / Math.sqrt(w1 + w2) }; };
    anima(el, F, () => {
      const x = val(el, "x"), dx = val(el, "dx"), y = val(el, "y"), dy = val(el, "dy"); mostra(el, ["x", "dx", "y", "dy"], 2);
      const a = 9.3, b = 10.3, X = (v) => 40 + ((v - a) / (b - a)) * 600;
      let sv = `<line x1="40" x2="640" y1="200" y2="200" style="stroke:var(--ink2)"/>`;
      for (let v = 9.4; v <= 10.25; v += 0.1) sv += `<line x1="${X(v)}" x2="${X(v)}" y1="196" y2="204" style="stroke:var(--ink3)"/>` + D.txt(X(v), 220, n2(v, 1), "tx2");
      [[3, "var(--bad)"], [2, "var(--warn)"], [1, "var(--ok)"]].forEach(([k, c]) => (sv += `<rect x="${X(x - k * dx)}" y="70" width="${X(x + k * dx) - X(x - k * dx)}" height="40" style="fill:color-mix(in srgb,${c} 14%,transparent)"/>`));
      sv += D.txt(X(x), 62, "x ± Δx, 2Δx, 3Δx", "tx2") + `<line x1="${X(x - dx)}" x2="${X(x + dx)}" y1="90" y2="90" style="stroke:var(--mN);stroke-width:3"/><circle cx="${X(x)}" cy="90" r="6" style="fill:var(--mN)"/>`;
      sv += `<line x1="${X(ref)}" x2="${X(ref)}" y1="40" y2="200" style="stroke:var(--ok);stroke-width:2;stroke-dasharray:5 4"/>` + D.txt(X(ref), 34, "referência " + n2(ref, 3), "tx2");
      const nR = SIM.compara._n(x, ref, dx), vR = veredito(nR);
      if (dois) { sv += `<line x1="${X(y - dy)}" x2="${X(y + dy)}" y1="150" y2="150" style="stroke:var(--warn);stroke-width:3"/><circle cx="${X(y)}" cy="150" r="6" style="fill:var(--warn)"/>` + D.txt(X(y), 138, "y ± Δy", "tx2"); const mm = SIM.compara._media(x, dx, y, dy); sv += `<line x1="${X(mm.m - mm.u)}" x2="${X(mm.m + mm.u)}" y1="178" y2="178" style="stroke:var(--ink);stroke-width:3"/><circle cx="${X(mm.m)}" cy="178" r="5" style="fill:var(--ink)"/>` + D.txt(X(mm.m + mm.u) + 6, 182, "média ponderada", "tx2", "start"); }
      q("[data-v=sv]").innerHTML = sv;
      const nXY = SIM.compara._n(x, y, dx + dy), vXY = veredito(nXY), mm = SIM.compara._media(x, dx, y, dy);
      q("[data-v=lt]").innerHTML = vis("desvio percentual |x − ref|/ref", n2((100 * Math.abs(x - ref)) / ref, 2) + "%") + vis("discrepância em unidades de Δx", n2(nR, 2) + " Δx: " + vR[0]) + (dois ? vis("x × y: |x − y|/(Δx + Δy)", n2(nXY, 2) + ": " + vXY[0]) + vis("média ponderada (1/Δ²)", n2(mm.m, 3) + " ± " + n2(mm.u, 3)) : "");
    });
  };

  /* ---------- FE06 · gráfico com barras de erro: ajuste a reta à mão e veja as retas extremas ---------- */
  SIM.barras = (el, F) => {
    const W = 680, H = 420, xs = [0.5, 1, 1.5, 2, 2.5, 3];
    let ruido = [0.12, -0.18, 0.05, 0.2, -0.1, -0.04], ext = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("inclinação da sua reta a (cm/N)", "a", 3, 5, 0.01, 3.6)}${sl("ponto onde ela corta o eixo b (cm)", "b", -1, 1, 0.01, 0.5)}${sl("tamanho das barras Δy (cm)", "dy", 0.05, 0.6, 0.01, 0.2)}
      <div class="bts"><button class="bt" data-a="ext" aria-pressed="false">Mostrar as retas extremas</button><button class="bt" data-a="novo">Novos dados</button></div></div>
      <div class="status">Uma mola foi esticada por pesos de 0,5 N a 3,0 N, e cada alongamento tem uma barra de erro de ±Δy. Mexa na sua reta até ela cruzar o máximo de barras. As <b>retas extremas</b> são a mais inclinada e a menos inclinada que ainda cruzam todas as barras: a inclinação vale a média delas, e a incerteza, metade da diferença. A constante da mola sai de k = 100/a (em N/m, com a em cm/N). No painel de baixo, a distância de cada ponto até a sua reta aparece ampliada: uma barra é cruzada quando toca a linha do zero. Se as barras forem pequenas demais, nenhuma reta cruza todas: aí ou as incertezas estão subestimadas, ou o modelo (a reta) está errado.</div>`);
    const q = (s) => el.querySelector(s);
    q("[data-a=ext]").addEventListener("click", (e) => { ext = !ext; e.target.setAttribute("aria-pressed", ext); });
    q("[data-a=novo]").addEventListener("click", () => { ruido = xs.map(() => { let s = 0; for (let i = 0; i < 6; i++) s += Math.random() - 0.5; return 0.15 * s * Math.SQRT2; }); });
    /* retas extremas: maior e menor inclinação de uma reta que cruza todas as barras verticais (o ótimo de um problema linear fica num vértice: duas barras tocadas na ponta) */
    SIM.barras._ext = (X, Y, DY) => { let mx = null, mn = null; for (let i = 0; i < X.length; i++) for (let j = i + 1; j < X.length; j++) for (const si of [-1, 1]) for (const sj of [-1, 1]) { const a = (Y[j] + sj * DY[j] - (Y[i] + si * DY[i])) / (X[j] - X[i]), b = Y[i] + si * DY[i] - a * X[i]; if (X.every((x, k) => Math.abs(a * x + b - Y[k]) <= DY[k] + 1e-9)) { if (!mx || a > mx[0]) mx = [a, b]; if (!mn || a < mn[0]) mn = [a, b]; } } return mx ? { mx, mn } : null; };
    anima(el, F, () => {
      const a = val(el, "a"), b = val(el, "b"), dy = val(el, "dy"); mostra(el, ["a", "b", "dy"], 2);
      const ys = xs.map((x, i) => 4 * x + ruido[i]), dys = xs.map(() => dy);
      const g = { x0: 70, y0: 260, w: 560, h: 230, xmax: 3.4, ymin: -1, ymax: 14, xlab: "F (N)", ylab: "alongamento (cm)", xt: [0.5, 1, 1.5, 2, 2.5, 3], yt: [0, 4, 8, 12] };
      const X = (x) => g.x0 + (x / g.xmax) * g.w, Yp = (y) => g.y0 - ((y - g.ymin) / (g.ymax - g.ymin)) * g.h;
      const linha = (aa, bb, cor, trac) => `<line x1="${X(0)}" y1="${Yp(bb)}" x2="${X(3.4)}" y2="${Yp(aa * 3.4 + bb)}" style="stroke:${cor};stroke-width:2${trac ? ";stroke-dasharray:6 4" : ""}"/>`;
      const r = SIM.barras._ext(xs, ys, dys);
      let sv = D.graf({ ...g, erros: xs.map((x, i) => [x, ys[i], dy]) });
      if (ext && r) sv += linha(r.mx[0], r.mx[1], "var(--warn)", true) + linha(r.mn[0], r.mn[1], "var(--warn)", true);
      sv += linha(a, b, "var(--mN)");
      let cruza = 0;
      xs.forEach((x, i) => { const ok = Math.abs(a * x + b - ys[i]) <= dy; if (ok) cruza++; sv += `<circle cx="${X(x)}" cy="${Yp(ys[i])}" r="5" style="fill:none;stroke:${ok ? "var(--ok)" : "var(--bad)"};stroke-width:2"/>`; });
      /* painel de resíduos ampliado: y − (a x + b) da SUA reta, com as barras; cruza a barra quem toca o zero */
      const ry0 = 360, esc = 48, XR = (x) => X(x);
      sv += D.txt(g.x0 + 10, 296, "resíduos (ampliado): y − (a·F + b) da sua reta, em cm", "tx2", "start") + `<line x1="${g.x0}" x2="${g.x0 + g.w}" y1="${ry0}" y2="${ry0}" style="stroke:var(--mN);stroke-width:1.6"/>` + [-1, 1].map((k) => `<line x1="${g.x0}" x2="${g.x0 + g.w}" y1="${ry0 - k * esc}" y2="${ry0 - k * esc}" style="stroke:var(--line2);stroke-dasharray:3 4"/>` + D.txt(g.x0 - 6, ry0 - k * esc + 4, (k > 0 ? "+" : "−") + "1", "tx2", "end")).join("") + D.txt(g.x0 - 6, ry0 + 4, "0", "tx2", "end");
      const cl = (v) => Math.max(ry0 - 56, Math.min(ry0 + 56, v));
      if (ext && r) [r.mx, r.mn].forEach(([aa, bb]) => (sv += `<line x1="${XR(0)}" y1="${cl(ry0 - esc * (bb - b))}" x2="${XR(3.4)}" y2="${cl(ry0 - esc * ((aa - a) * 3.4 + bb - b))}" style="stroke:var(--warn);stroke-width:1.6;stroke-dasharray:6 4"/>`));
      xs.forEach((x, i) => { const e = ys[i] - (a * x + b), ok = Math.abs(e) <= dy, c = ok ? "var(--ok)" : "var(--bad)"; sv += `<line x1="${XR(x)}" x2="${XR(x)}" y1="${cl(ry0 - esc * (e - dy))}" y2="${cl(ry0 - esc * (e + dy))}" style="stroke:${c};stroke-width:2"/><circle cx="${XR(x)}" cy="${cl(ry0 - esc * e)}" r="4" style="fill:${c}"/>`; });
      q("[data-v=sv]").innerHTML = sv;
      const res = r ? { a: (r.mx[0] + r.mn[0]) / 2, da: (r.mx[0] - r.mn[0]) / 2 } : null;
      q("[data-v=lt]").innerHTML = vis("barras que a sua reta cruza", cruza + " de " + xs.length) + vis("k pela sua reta", n2(100 / a, 1) + " N/m") +
        (ext ? (r ? vis("retas extremas: a máx · a mín", n2(r.mx[0], 2) + " · " + n2(r.mn[0], 2)) + vis("a ± Δa → k ± Δk", n2(res.a, 2) + " ± " + n2(res.da, 2) + " → " + n2(100 / res.a, 1) + " ± " + n2((100 / res.a) * (res.da / res.a), 1) + " N/m") : vis("retas extremas", "nenhuma reta cruza todas as barras")) : "");
    });
  };

  /* ---------- FE07 · linearização: escolha o que pôr em cada eixo até a curva virar reta ---------- */
  SIM.lineariza = (el, F) => {
    const W = 680, H = 300, ruido = [0.002, -0.003, 0.001, 0.003, -0.002, 0, -0.001, 0.002];
    /* cada fenômeno é uma lei de potência y = C·x^n; o parâmetro físico sai de C */
    const fen = {
      queda: { nome: "queda livre", xl: "t", xu: "s", yl: "h", yu: "m", a: 0.2, b: 0.6, C: 4.9, n: 2, par: (C) => ["g = 2C", 2 * C, "m/s²"], lei: "h = ½ g t²" },
      pend: { nome: "pêndulo simples", xl: "L", xu: "m", yl: "T", yu: "s", a: 0.2, b: 1.2, C: (2 * Math.PI) / Math.sqrt(9.8), n: 0.5, par: (C) => ["g = 4π²/C²", (4 * Math.PI * Math.PI) / (C * C), "m/s²"], lei: "T = 2π √(L/g)" },
      boyle: { nome: "gás a temperatura constante", xl: "V", xu: "L", yl: "P", yu: "atm", a: 1, b: 4, C: 4, n: -1, par: (C) => ["nRT = C", C, "atm·L"], lei: "P = nRT / V" },
      luz: { nome: "lâmpada pontual", xl: "d", xu: "m", yl: "I", yu: "W/m²", a: 0.2, b: 0.8, C: 0.32, n: -2, par: (C) => ["potência = 4πC", 4 * Math.PI * C, "W"], lei: "I = P / (4π d²)" },
    };
    const TX = [["1", "x"], ["2", "x²"], ["0.5", "√x"], ["-1", "1/x"], ["-2", "1/x²"]], TY = [["1", "y"], ["2", "y²"]];
    let fk = "queda", q_ = 1, p_ = 1;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="bts" style="grid-column:1/-1">${botoes(Object.entries(fen).map(([k, f]) => [k, f.nome]), "f", "queda")}</div>
      <div class="bts" style="grid-column:1/-1"><span class="tx2" style="margin-right:6px">eixo horizontal:</span><span data-v="bx"></span></div>
      <div class="bts" style="grid-column:1/-1"><span class="tx2" style="margin-right:6px">eixo vertical:</span><span data-v="by"></span></div></div>
      <div class="status">Os pontos foram medidos com uma pequena flutuação (cerca de 0,3%). Troque o que vai em cada eixo até os pontos ficarem em cima da reta ajustada (linha tracejada). Para uma lei y = C·xⁿ, o gráfico de y<sup>p</sup> × x<sup>q</sup> é uma reta exatamente quando q = p·n, e a inclinação vale C<sup>p</sup>. Daí sai o parâmetro físico. O indicador de curvatura é o maior desvio dos pontos até a reta, dividido pela altura total do gráfico.</div>`);
    const q = (s) => el.querySelector(s);
    const rotulos = () => { const f = fen[fk]; q("[data-v=bx]").innerHTML = botoes(TX.map(([k, r]) => [k, r.replace("x", f.xl)]), "tx", String(q_)); q("[data-v=by]").innerHTML = botoes(TY.map(([k, r]) => [k, r.replace("y", f.yl)]), "ty", String(p_)); liga(el, "tx", (k) => (q_ = +k)); liga(el, "ty", (k) => (p_ = +k)); };
    liga(el, "f", (k) => { fk = k; q_ = 1; p_ = 1; rotulos(); });
    rotulos();
    const bonito = (m) => { const e = Math.pow(10, Math.floor(Math.log10(m / 3))), k = m / 3 / e; return (k < 1.5 ? 1 : k < 3.5 ? 2 : 5) * e; };
    /* mínimos quadrados e curvatura (exportados para os testes) */
    SIM.lineariza._ajuste = (X, Y) => { const n = X.length, mx = X.reduce((s, v) => s + v, 0) / n, my = Y.reduce((s, v) => s + v, 0) / n; let sxy = 0, sxx = 0; X.forEach((x, i) => { sxy += (x - mx) * (Y[i] - my); sxx += (x - mx) ** 2; }); const a = sxy / sxx, b = my - a * mx, res = Y.map((y, i) => y - (a * X[i] + b)); return { a, b, curv: Math.max(...res.map(Math.abs)) / (Math.max(...Y) - Math.min(...Y)) }; };
    anima(el, F, () => {
      const f = fen[fk], xs = ruido.map((_, i) => f.a + ((f.b - f.a) * i) / 7), ys = xs.map((x, i) => f.C * Math.pow(x, f.n) * (1 + ruido[i]));
      const X = xs.map((x) => Math.pow(x, q_)), Y = ys.map((y) => Math.pow(y, p_)), aj = SIM.lineariza._ajuste(X, Y), reta = aj.curv < 0.015;
      const xmax = Math.max(...X) * 1.12, ymax = Math.max(...Y) * 1.15, tx = bonito(xmax), ty = bonito(ymax), xt = [], yt = [];
      for (let v = tx; v < xmax * 0.97; v += tx) xt.push(+v.toPrecision(3)); for (let v = ty; v < ymax * 0.97; v += ty) yt.push(+v.toPrecision(3));
      const nomeX = TX.find(([k]) => +k === q_)[1].replace("x", f.xl), nomeY = TY.find(([k]) => +k === p_)[1].replace("y", f.yl);
      const sv = D.graf({ x0: 80, y0: 255, w: 540, h: 215, xmax, ymin: 0, ymax, xlab: nomeX, ylab: nomeY, xt, yt, curvas: [{ pts: [[0, aj.b], [xmax, aj.a * xmax + aj.b]].map(([x, y]) => [x, Math.max(0, Math.min(ymax, y))]), cor: reta ? "var(--ok)" : "var(--ink3)", trac: true }], pontos: X.map((x, i) => [x, Y[i]]) }) + D.txt(620, 30, f.lei, "txm", "end");
      q("[data-v=sv]").innerHTML = sv;
      const par = f.par(Math.pow(Math.abs(aj.a), 1 / p_)), certo = Math.abs(q_ - p_ * f.n) < 1e-9;
      q("[data-v=lt]").innerHTML = vis("curvatura (maior desvio / altura)", n2(aj.curv * 100, 1) + "%") + vis("parece reta?", reta ? "sim!" : "não: ainda é curva") + vis("inclinação", n2(aj.a, 4)) + (reta && certo ? vis(par[0], n2(par[1], 3) + " " + par[2]) : vis("parâmetro", "acerte a reta primeiro"));
    });
  };

  /* ---------- FE08 · escalas: linear, mono-log e log-log; quem vira reta revela a lei ---------- */
  SIM.loglog = (el, F) => {
    const W = 680, H = 310, rn = [0.02, -0.015, 0.01, 0.018, -0.02, 0.005, -0.01, 0.015, -0.005, 0.01, -0.018];
    const sets = {
      kepler: { nome: "planetas (Kepler)", xl: "raio da órbita a (UA)", yl: "período T (anos)", x: [0.387, 0.723, 1, 1.524, 5.203, 9.537, 19.19, 30.07], y: [0.241, 0.615, 1, 1.881, 11.86, 29.46, 84.01, 164.8], nota: "dados reais do Sistema Solar" },
      decai: { nome: "fonte radioativa", xl: "tempo t (min)", yl: "contagens por minuto", x: rn.map((_, i) => 2 + 2 * i), f: (t) => 1000 * Math.pow(2, -t / 5) },
      resfria: { nome: "café esfriando", xl: "tempo t (min)", yl: "T − T_ambiente (°C)", x: rn.map((_, i) => 3 + 3 * i), f: (t) => 60 * Math.exp(-t / 12) },
      luz: { nome: "lâmpada pontual", xl: "distância d (m)", yl: "intensidade (W/m²)", x: rn.slice(0, 8).map((_, i) => 0.2 + (0.8 * i) / 7), f: (d) => 0.32 / (d * d) },
    };
    let sk = "kepler", esc = "lin";
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div class="bts" style="grid-column:1/-1">${botoes(Object.entries(sets).map(([k, s]) => [k, s.nome]), "s", "kepler")}</div>
      <div class="bts" style="grid-column:1/-1">${botoes([["lin", "escala linear"], ["mono", "mono-log (só o eixo y em log)"], ["log", "log-log (os dois eixos em log)"]], "e", "lin")}</div></div>
      <div class="status">Na escala log, distâncias iguais significam multiplicar pelo mesmo fator (1 → 10 → 100). Uma lei de potência y = C·xⁿ vira reta no log-log, com inclinação n. Uma exponencial y = A·e^(kx) vira reta no mono-log, e a inclinação (com log na base 10) vale k/ln 10. Os pontos têm ~1,5% de flutuação (os dos planetas são medidas reais).</div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "s", (k) => (sk = k)); liga(el, "e", (k) => (esc = k));
    const L = Math.log10;
    SIM.loglog._ajuste = (X, Y) => { const n = X.length, mx = X.reduce((s, v) => s + v, 0) / n, my = Y.reduce((s, v) => s + v, 0) / n; let sxy = 0, sxx = 0; X.forEach((x, i) => { sxy += (x - mx) * (Y[i] - my); sxx += (x - mx) ** 2; }); const a = sxy / sxx, b = my - a * mx; return { a, b, curv: Math.max(...Y.map((y, i) => Math.abs(y - (a * X[i] + b)))) / (Math.max(...Y) - Math.min(...Y)) }; };
    const fmt = (v) => (v >= 1 ? n2(v, 0) : n2(v, Math.ceil(-L(v))));
    const eixo = (lo, hi, log) => { const t = []; if (log) { for (let k = Math.floor(lo); k <= Math.ceil(hi); k++) for (let m = 1; m < 10; m++) { const v = k + L(m); if (v >= lo - 1e-9 && v <= hi + 1e-9) t.push([v, m === 1 || (hi - lo < 2.5 && (m === 2 || m === 5)) ? fmt(m * Math.pow(10, k)) : ""]); } } else { const p = Math.pow(10, Math.floor(L((hi - lo) / 4))), st = [1, 2, 5, 10].map((m) => m * p).find((s) => (hi - lo) / s <= 6); for (let v = Math.ceil(lo / st) * st; v <= hi + 1e-9; v += st) t.push([v, n2(v, st < 1 ? Math.ceil(-L(st)) : 0)]); } return t; };
    anima(el, F, () => {
      const s = sets[sk], ys = s.y || s.x.map((x, i) => s.f(x) * (1 + rn[i])), lx = esc === "log", ly = esc !== "lin";
      const X = s.x.map((x) => (lx ? L(x) : x)), Y = ys.map((y) => (ly ? L(y) : y)), aj = SIM.loglog._ajuste(X, Y), reta = aj.curv < 0.02;
      const pad = (a, b, z) => { const d = b - a; return z && a >= 0 ? [0, b + 0.08 * d] : [a - 0.08 * d, b + 0.08 * d]; };
      const [x0, x1] = pad(Math.min(...X), Math.max(...X), !lx), [y0, y1] = pad(Math.min(...Y), Math.max(...Y), !ly);
      const PX = (v) => 90 + ((v - x0) / (x1 - x0)) * 540, PY = (v) => 260 - ((v - y0) / (y1 - y0)) * 220;
      let sv = `<rect x="90" y="40" width="540" height="220" style="fill:none;stroke:var(--line2)"/>`;
      eixo(x0, x1, lx).forEach(([v, r]) => (sv += `<line x1="${PX(v)}" x2="${PX(v)}" y1="40" y2="260" style="stroke:var(--line2);${r ? "" : "opacity:.45;"}stroke-dasharray:${r ? "3 4" : "1 4"}"/>` + (r ? D.txt(PX(v), 278, r, "tx2") : "")));
      eixo(y0, y1, ly).forEach(([v, r]) => (sv += `<line x1="90" x2="630" y1="${PY(v)}" y2="${PY(v)}" style="stroke:var(--line2);${r ? "" : "opacity:.45;"}stroke-dasharray:${r ? "3 4" : "1 4"}"/>` + (r ? D.txt(84, PY(v) + 4, r, "tx2", "end") : "")));
      sv += `<line x1="${PX(x0)}" y1="${PY(aj.a * x0 + aj.b)}" x2="${PX(x1)}" y2="${PY(aj.a * x1 + aj.b)}" clip-path="url(#clp-ll)" style="stroke:${reta ? "var(--ok)" : "var(--ink3)"};stroke-width:2;stroke-dasharray:6 4"/>`;
      X.forEach((x, i) => (sv += `<circle cx="${PX(x)}" cy="${PY(Y[i])}" r="4.5" style="fill:var(--warn)"/>`));
      sv += D.txt(630, 300, s.xl + (lx ? " · log" : ""), "tx2", "end") + D.txt(90, 30, s.yl + (ly ? " · log" : ""), "tx2", "start") + (s.nota ? D.txt(630, 30, s.nota, "tx2", "end") : "");
      q("[data-v=sv]").innerHTML = `<defs><clipPath id="clp-ll"><rect x="90" y="40" width="540" height="220"/></clipPath></defs>` + sv;
      let lei = "—";
      if (reta && esc === "log") lei = "potência: n = " + n2(aj.a, 3) + ", C = " + n2(Math.pow(10, aj.b), 3);
      else if (reta && esc === "mono") { const k = aj.a * Math.LN10; lei = "exponencial: k = " + n2(k, 4) + (k < 0 ? " min⁻¹ → meia-vida " + n2(Math.LN2 / -k, 2) + " min, τ = " + n2(-1 / k, 2) + " min" : ""); }
      q("[data-v=lt]").innerHTML = vis("curvatura", n2(aj.curv * 100, 1) + "%") + vis("parece reta?", reta ? "sim!" : "não") + vis("inclinação", n2(aj.a, 4)) + vis("lei encontrada", lei);
    });
  };
})();
