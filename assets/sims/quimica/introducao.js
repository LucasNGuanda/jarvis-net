/* Simulações da Química, módulo A (Introdução à química). A01 experimento controlado com o comprimido efervescente.
   MODELO (inventado para o laboratório, não é medida de um comprimido real): o comprimido se dissolve pela superfície, então o raio de cada
   pedaço encolhe em ritmo constante e o tempo é proporcional ao raio inicial; N pedaços iguais têm raio N^(−1/3) vezes o do inteiro;
   a velocidade dobra a cada 10 °C; o volume de água não muda nada. t(T, N) = 60 s · 2^(−(T − 25)/10) · N^(−1/3).
   Conferido em Python: (25 °C, inteiro) 60 s; (35, 1) 30 s; (15, 1) 120 s; (5, 1) 240 s; (55, 1) 7,5 s; (25, 2) 47,62 s; (25, 4) 37,80 s; (25, 8) 30 s; (25, pó = 64) 15 s.
   Massa: copo 150 g + água (1 g/mL) + comprimido 4,00 g; o comprimido inteiro solta 0,50 g de gás; a fração solta é 1 − (r/r₀)³.
   Frasco aberto: a balança perde o gás que saiu. Frasco fechado: a leitura não muda. O cronômetro tem erro de reação (desvio de 0,4 s). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { if (b.disabled) return; el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const NOMES = { 1: "inteiro", 2: "2 pedaços", 4: "4 pedaços", 8: "8 pedaços", 64: "pó" };

  /* ---------- A01 · experimento controlado: o que manda no tempo de dissolução de um comprimido efervescente ---------- */
  /* nome: "Experimento controlado: o comprimido efervescente" · matéria: Química · tema: A01 */
  SIM.efervescente = (el, F) => {
    const W = 680, H = 300, GAS = 0.5, COPO = 150, COMP = 4;
    let N = 1, fechado = false, vel = 4, eixo = "T", rod = null, cad = [], ultimo = null, fase = 0, fim = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("temperatura da água (°C)", "T", 5, 55, 5, 25)}${sl("volume de água (mL)", "V", 100, 300, 50, 200)}
        <div><div class="bts" data-g="N">${botoes([[1, "inteiro"], [2, "2 pedaços"], [4, "4 pedaços"], [8, "8 pedaços"], [64, "pó"]], "n", 1)}</div></div>
        <div><div class="bts">${botoes([["a", "frasco aberto"], ["f", "frasco fechado"]], "tampa", "a")}</div></div>
        <div><div class="bts">${botoes([[1, "tempo ×1"], [4, "×4"], [16, "×16"]], "vel", 4)}</div></div>
        <div><div class="bts">${botoes([["T", "gráfico: temperatura"], ["N", "pedaços"], ["V", "volume"]], "eixo", "T")}</div></div>
        <div class="bts"><button class="bt pri" data-a="solta">Soltar o comprimido</button><button class="bt" data-a="limpa">Limpar o caderno</button></div></div>
      <div data-v="cad" style="padding:0 18px"></div>
      <div class="status">Pergunta do laboratório: <b>o que manda no tempo que o comprimido leva para sumir?</b> Faça um ensaio, mude <b>uma coisa só</b> e faça outro. No gráfico, os pontos cheios são os ensaios que só diferem do último na variável do eixo (comparação justa); os vazados mudaram mais de uma coisa ao mesmo tempo e não provam nada. Repita um ensaio igual: o cronômetro nunca dá exatamente o mesmo número. Troque para frasco fechado e olhe a balança. <b>Isto é um modelo</b> (regras escritas por mim, parecidas com as de um comprimido real, mas não medidas num de verdade).</div>`);
    const q = (s) => el.querySelector(s), val = (c) => +q(`[data-c=${c}]`).value;
    liga(el, "n", (k) => { N = +k; fim = false; }); liga(el, "tampa", (k) => { fechado = k === "f"; fim = false; }); el.querySelectorAll("[data-c]").forEach((x) => x.addEventListener("input", () => (fim = false))); liga(el, "vel", (k) => (vel = +k)); liga(el, "eixo", (k) => (eixo = k));
    SIM.efervescente._conta = (T, n) => ({ t: 60 * Math.pow(2, -(T - 25) / 10) * Math.pow(n, -1 / 3), gas: GAS });
    const gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += Math.random(); return (s - 3) / Math.sqrt(0.5); };
    const trava = (v) => el.querySelectorAll("[data-c],[data-n],[data-tampa]").forEach((x) => (x.disabled = v));
    const solta = () => {
      if (rod) return;
      const T = val("T"), V = val("V"), ideal = SIM.efervescente._conta(T, N).t;
      rod = { T, V, N, fechado, ideal, dur: Math.max(0.5, ideal + 0.4 * gauss()), t: 0 };
      trava(true); q("[data-a=solta]").disabled = true;
    };
    q("[data-a=solta]").addEventListener("click", solta);
    q("[data-a=limpa]").addEventListener("click", () => { cad = []; ultimo = null; fim = false; caderno(); });
    const caderno = () => {
      q("[data-v=cad]").innerHTML = cad.length ? `<table class="tb"><tr><th>ensaio</th><th>temperatura</th><th>comprimido</th><th>água</th><th>frasco</th><th>tempo</th><th>balança: antes → depois</th></tr>${cad.slice(-6).map((r) => `<tr><td>${r.i}</td><td>${r.T} °C</td><td>${NOMES[r.N]}</td><td>${r.V} mL</td><td>${r.fechado ? "fechado" : "aberto"}</td><td>${n2(r.dur, 1)} s</td><td>${n2(COPO + r.V + COMP)} → ${n2(COPO + r.V + COMP - (r.fechado ? 0 : GAS))} g</td></tr>`).join("")}</table>` : "";
    };
    SIM.efervescente._estado = () => ({ cad: cad.map((r) => ({ ...r })), rodando: !!rod });
    SIM.efervescente._pula = () => { if (rod) rod.t = rod.dur; };
    const XS = { T: { rot: "temperatura (°C)", max: 60, tk: [5, 15, 25, 35, 45, 55], x: (r) => r.T }, N: { rot: "comprimido", max: 5, tk: [], x: (r) => [1, 2, 4, 8, 64].indexOf(r.N) + 0.5 }, V: { rot: "volume (mL)", max: 350, tk: [100, 200, 300], x: (r) => r.V } };
    anima(el, F, (dt) => {
      q("[data-o=T]").textContent = val("T") + " °C"; q("[data-o=V]").textContent = val("V") + " mL";
      if (rod) {
        rod.t = Math.min(rod.dur, rod.t + dt * vel);
        if (rod.t >= rod.dur) { ultimo = { i: cad.length + 1, T: rod.T, V: rod.V, N: rod.N, fechado: rod.fechado, dur: rod.dur, ideal: rod.ideal }; cad.push(ultimo); fim = true; rod = null; trava(false); q("[data-a=solta]").disabled = false; caderno(); }
      }
      fase += dt * (rod ? vel : 1);
      const src = rod || (fim ? ultimo : null), T = src ? src.T : val("T"), V = src ? src.V : val("V"), n = src ? src.N : N, fe = src ? src.fechado : fechado;
      const fr = rod ? 1 - rod.t / rod.dur : fim ? 0 : 1, solto = GAS * (1 - fr * fr * fr), tcron = rod ? rod.t : fim ? ultimo.dur : 0;
      const massa = COPO + V + COMP - (fe ? 0 : solto);
      /* frasco sobre a balança */
      const cx = 150, base = 226, hw = 62, hc = 150, nivel = base - 4 - (V / 300) * (hc - 34);
      let sv = `<rect x="40" y="${base + 6}" width="220" height="34" rx="6" style="fill:var(--card2);stroke:var(--ink3);stroke-width:1.5"/><rect x="60" y="${base}" width="180" height="7" rx="2" style="fill:var(--ink3)"/><rect x="100" y="${base + 13}" width="100" height="21" rx="4" style="fill:var(--bg);stroke:var(--line)"/>` + D.txt(150, base + 29, n2(massa) + " g", "tx", "middle", 'style="font-weight:700;font-variant-numeric:tabular-nums"');
      sv += `<rect x="${cx - hw + 2}" y="${nivel}" width="${2 * hw - 4}" height="${base - nivel - 2}" style="fill:color-mix(in srgb,var(--mA) 26%,transparent)"/><path d="M${cx - hw} ${base - hc} L${cx - hw} ${base} L${cx + hw} ${base} L${cx + hw} ${base - hc}" style="fill:none;stroke:var(--ink2);stroke-width:2.5"/>`;
      if (fe) sv += `<rect x="${cx - hw - 5}" y="${base - hc - 12}" width="${2 * hw + 10}" height="13" rx="3" style="fill:var(--ink3)"/>` + D.txt(cx, base - hc - 18, "tampado", "tx2");
      /* pedaços do comprimido e bolhas */
      if (fr > 0.001) { const m = Math.min(n, 12), fora = !rod, r0 = (n === 64 ? 2.2 : 13 * Math.pow(n, -1 / 3)) * (fora ? 0.6 : 1), x0 = fora ? 73 : cx, larg = fora ? 20 : 96; for (let i = 0; i < m; i++) { const px = x0 + (m === 1 ? 0 : (i - (m - 1) / 2) * Math.min(22, larg / m)), py = base - (fora ? 5 : 8) - (n === 64 ? (i % 3) * 3 : 0); sv += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(r0 * fr * 1.25).toFixed(2)}" ry="${(r0 * fr * 0.62).toFixed(2)}" style="fill:var(--ink);opacity:.85"/>`; } }
      if (rod) { const nb = Math.min(28, Math.round(4 + 160 / rod.dur)); for (let i = 0; i < nb; i++) { const s = (fase * (0.5 + (i % 5) * 0.09) + i * 0.137) % 1, px = cx + ((i * 37) % 100 - 50) * 0.95 + 4 * Math.sin(fase * 3 + i), py = base - 10 - s * (base - 10 - nivel); sv += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(1.6 + (i % 3) * 0.8).toFixed(1)}" style="fill:none;stroke:var(--ink);stroke-width:1.1;opacity:.75"/>`; }
        if (!fe) for (let i = 0; i < 4; i++) { const s = (fase * 0.4 + i / 4) % 1; sv += D.txt(cx - 36 + i * 24, base - hc - 8 - s * 34, "CO₂", "tx2", "middle", `style="opacity:${(1 - s).toFixed(2)}"`); } }
      sv += D.termo(cx + hw + 34, base - 20, 120, (T - 0) / 60, T + " °C", T >= 35 ? "var(--bad)" : "var(--mA)");
      sv += D.txt(150, 22, rod ? "dissolvendo…" : fim ? "acabou: anotado no caderno" : "comprimido no prato, pronto para soltar", "tx2");
      /* gráfico tempo × variável escolhida */
      const cfg = XS[eixo], tmax = Math.max(60, ...cad.map((r) => r.dur)) * 1.15, pont = cad.map((r) => ({ r, igual: ultimo && ["T", "N", "V"].every((k) => k === eixo || r[k] === ultimo[k]) }));
      const o = { x0: 370, y0: 232, w: 260, h: 180, xmax: cfg.max, ymin: 0, ymax: tmax, xlab: "", ylab: "tempo (s)", xt: cfg.tk, yt: [Math.round(tmax / 2.3 / 10) * 10 || 10, Math.round(tmax / 1.15 / 10) * 10], curvas: [] };
      sv += D.graf(o) + D.txt(o.x0 + o.w / 2, o.y0 + 38, cfg.rot, "tx2");
      if (eixo === "N") [1, 2, 4, 8, 64].forEach((k, i) => (sv += D.txt(o.x0 + ((i + 0.5) / 5) * o.w, o.y0 + 17, k === 1 ? "1" : k === 64 ? "pó" : String(k), "tx2")));
      pont.forEach(({ r, igual }) => { const px = o.x0 + (cfg.x(r) / cfg.max) * o.w, py = o.y0 - (r.dur / tmax) * o.h; sv += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r === ultimo ? 5.5 : 4.2}" style="fill:${igual ? "var(--mod)" : "none"};stroke:${igual ? "var(--mod)" : "var(--ink3)"};stroke-width:1.6"/>`; });
      if (!cad.length) sv += D.txt(o.x0 + o.w / 2, o.y0 - o.h / 2, "cada ensaio vira um ponto aqui", "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("cronômetro", n2(tcron, 1) + " s") + vis("balança", n2(massa) + " g") + vis(fe ? "gás preso no frasco" : "gás que saiu para o ar", n2(solto) + " g") + vis("ensaios no caderno", String(cad.length));
    });
  };
})();
