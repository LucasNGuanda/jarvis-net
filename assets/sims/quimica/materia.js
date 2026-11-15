/* Simulações da Química, módulo A (Introdução à química), temas A02 a A05.
   A02 SIM.densidade: a amostra misteriosa (massa na balança, volume por deslocamento na proveta, reta m × V de cada material).
     Densidades a 20 °C, g/cm³: alumínio 2,70; pirita 5,0; ferro 7,87; cobre 8,96; prata 10,5; chumbo 11,3; ouro 19,3.
   A03 SIM.estados: em que estado está cada substância numa temperatura (1 atm). PF e PE em °C: oxigênio −218,8 e −183,0; nitrogênio −210,0 e −195,8;
     etanol −114,1 e 78,4; mercúrio −38,8 e 356,7; água 0 e 100; naftaleno 80,3 e 218; enxofre 115,2 e 444,6; chumbo 327,5 e 1749; ferro 1538 e 2862.
     Regra: T < PF sólido; PF < T < PE líquido; T > PE gás. Escala do eixo: x = asinh(T/100) (só para caber de −250 a 3000 °C).
   A04 SIM.qCurvas: curvas de aquecimento ESQUEMÁTICAS (sem números reais) dos quatro casos: substância pura (dois patamares), mistura comum (duas faixas),
     mistura eutética (fusão em patamar, ebulição em faixa), mistura azeotrópica (fusão em faixa, ebulição em patamar).
   A05 SIM.separacao: monte a separação. Regras conferidas à mão para os três desafios (areia + sal + ferro; água + óleo + sal; água + álcool + areia). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };

  /* ---------- A02 · a amostra misteriosa: densidade é intensiva, massa e volume são extensivas ---------- */
  SIM.densidade = (el, F) => {
    const W = 680, H = 300, MAT = { al: ["alumínio", 2.7, "#b8c4d6"], pi: ["pirita", 5.0, "#cbb86a"], fe: ["ferro", 7.87, "#8d99ae"], cu: ["cobre", 8.96, "#d08a5b"], ag: ["prata", 10.5, "#dfe6f0"], pb: ["chumbo", 11.3, "#7d8597"], au: ["ouro", 19.3, "#f2c84b"] };
    let mat = "al", misterio = null, revelado = true;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("volume do pedaço (cm³)", "V", 2, 40, 1, 20)}
        <div><div class="bts">${botoes(Object.keys(MAT).map((k) => [k, MAT[k][0]]), "mat", "al")}</div></div>
        <div class="bts"><button class="bt pri" data-a="mist">Sortear amostra misteriosa</button><button class="bt" data-a="rev">Revelar</button></div></div>
      <div class="status">Mude o volume do pedaço: a <b>massa</b> e o <b>volume</b> mudam juntos (são extensivas), mas o ponto anda sempre sobre a mesma reta, porque a razão m/V, a <b>densidade</b>, não muda (é intensiva). Cada material tem a sua reta; a inclinação é a densidade. Sorteie uma amostra misteriosa, leia a balança e a proveta, faça a conta e descubra o material antes de revelar. O volume é medido pelo deslocamento da água: o nível sobe exatamente o volume do pedaço.</div>`);
    const q = (s) => el.querySelector(s), val = (c) => +q(`[data-c=${c}]`).value;
    liga(el, "mat", (k) => { mat = k; misterio = null; revelado = true; });
    q("[data-a=mist]").addEventListener("click", () => { const ks = Object.keys(MAT); misterio = ks[Math.floor(Math.random() * ks.length)]; revelado = false; el.querySelectorAll("[data-mat]").forEach((x) => x.setAttribute("aria-pressed", false)); });
    q("[data-a=rev]").addEventListener("click", () => (revelado = true));
    SIM.densidade._conta = (k, V) => ({ m: MAT[k][1] * V, d: MAT[k][1] });
    SIM.densidade._atual = () => misterio || mat;
    anima(el, F, () => {
      const k = misterio || mat, V = val("V"), c = SIM.densidade._conta(k, V), cor = revelado ? MAT[k][2] : "var(--ink3)";
      q("[data-o=V]").textContent = V + " cm³";
      const lado = 14 + 9 * Math.cbrt(V);
      /* balança */
      let sv = `<rect x="30" y="232" width="170" height="34" rx="6" style="fill:var(--card2);stroke:var(--ink3);stroke-width:1.5"/><rect x="45" y="226" width="140" height="7" rx="2" style="fill:var(--ink3)"/><rect x="70" y="239" width="90" height="21" rx="4" style="fill:var(--bg);stroke:var(--line)"/>` + D.txt(115, 255, n2(c.m, 1) + " g", "tx", "middle", 'style="font-weight:700"');
      sv += `<rect x="${115 - lado / 2}" y="${226 - lado}" width="${lado}" height="${lado}" rx="2" style="fill:${cor};stroke:var(--ink2);stroke-width:1.5"/>` + D.txt(115, 28, "1) pese", "tx2");
      /* proveta de 100 mL: 50 mL de água + o pedaço */
      const px = 250, pb = 262, ph = 220, yDe = (mL) => pb - (mL / 100) * ph, nivel = 50 + V;
      sv += `<rect x="${px + 2}" y="${yDe(nivel)}" width="46" height="${pb - yDe(nivel)}" style="fill:color-mix(in srgb,var(--mA) 26%,transparent)"/><path d="M${px} ${pb - ph - 8} L${px} ${pb} L${px + 50} ${pb} L${px + 50} ${pb - ph - 8}" style="fill:none;stroke:var(--ink2);stroke-width:2.2"/>`;
      for (let mL = 10; mL <= 100; mL += 10) sv += `<line x1="${px + 50}" x2="${px + (mL % 50 ? 42 : 36)}" y1="${yDe(mL)}" y2="${yDe(mL)}" style="stroke:var(--ink3)"/>` + (mL % 50 ? "" : D.txt(px + 56, yDe(mL) + 4, String(mL), "tx2", "start"));
      const lp = Math.min(40, lado * 0.8);
      sv += `<rect x="${px + 25 - lp / 2}" y="${pb - 3 - lp}" width="${lp}" height="${lp}" rx="2" style="fill:${cor};stroke:var(--ink2);stroke-width:1.2"/><line x1="${px - 8}" x2="${px + 50}" y1="${yDe(50)}" y2="${yDe(50)}" style="stroke:var(--warn);stroke-dasharray:4 3"/>` + D.txt(px - 12, yDe(50) + 4, "antes: 50 mL", "tx2", "end") + D.txt(px - 12, yDe(nivel) + 4, "agora: " + nivel + " mL", "tx2", "end") + D.txt(px + 25, 28, "2) mergulhe", "tx2");
      /* gráfico m × V */
      const o = { x0: 380, y0: 250, w: 190, h: 190, xmax: 42, ymin: 0, ymax: 820, xlab: "", ylab: "massa (g)", xt: [10, 20, 30, 40], yt: [200, 400, 600, 800], curvas: Object.keys(MAT).map((j) => ({ pts: [[0, 0], [Math.min(42, 820 / MAT[j][1]), Math.min(820, MAT[j][1] * 42)]], cor: revelado && j === k ? "var(--mod)" : "var(--line2)" })) };
      sv += D.graf(o) + D.txt(o.x0 + o.w / 2, o.y0 + 36, "volume (cm³)", "tx2");
      /* nomes das retas, numa coluna à direita, de cima para baixo, sem encostar um no outro */
      let yAnt = -99; Object.keys(MAT).sort((a, b) => MAT[b][1] - MAT[a][1]).forEach((j) => { const ye = o.y0 - (Math.min(820, MAT[j][1] * 42) / 820) * o.h, yr = Math.max(ye + 4, yAnt + 14); yAnt = yr; sv += `<line x1="${o.x0 + o.w}" x2="${o.x0 + o.w + 10}" y1="${ye}" y2="${yr - 4}" style="stroke:var(--line2)"/>` + D.txt(o.x0 + o.w + 13, yr, MAT[j][0], "tx2", "start", revelado && j === k ? 'style="fill:var(--mod);font-weight:700"' : 'style="opacity:.7"'); });
      sv += `<circle cx="${o.x0 + (V / 42) * o.w}" cy="${o.y0 - (Math.min(c.m, 820) / 820) * o.h}" r="5.5" style="fill:var(--warn)"/>`;
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("massa (balança)", n2(c.m, 1) + " g") + vis("volume (proveta)", nivel + " − 50 = " + V + " cm³") + vis("densidade m/V", revelado ? n2(c.d, 2) + " g/cm³" : "faça a conta") + vis("material", revelado ? MAT[k][0] : "?");
    });
  };

  /* ---------- A03 · em que estado está? PF e PE de nove substâncias e um modelo de partículas ---------- */
  SIM.estados = (el, F) => {
    const W = 680, H = 320, SUB = [["oxigênio", -218.8, -183.0], ["nitrogênio", -210.0, -195.8], ["etanol", -114.1, 78.4], ["mercúrio", -38.8, 356.7], ["água", 0, 100], ["naftaleno", 80.3, 218], ["enxofre", 115.2, 444.6], ["chumbo", 327.5, 1749], ["ferro", 1538, 2862]];
    const X0 = Math.asinh(-2.5), X1 = Math.asinh(30), xDe = (T) => (Math.asinh(T / 100) - X0) / (X1 - X0), TDe = (u) => 100 * Math.sinh(X0 + u * (X1 - X0));
    let sel = 4;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("temperatura (°C), a 1 atm", "u", 0, 1000, 1, Math.round(xDe(25) * 1000))}
        <div><div class="bts">${botoes(SUB.map((s, i) => [i, s[0]]), "sub", 4)}</div></div></div>
      <div class="status">Cada barra é uma substância: <b style="color:var(--mA)">azul</b> onde ela é sólida, <b style="color:var(--ok)">verde</b> onde é líquida, <b style="color:var(--warn)">amarelo</b> onde é gás. As fronteiras são o ponto de fusão e o ponto de ebulição a 1 atm. A regra é só comparar: abaixo do PF, sólido; entre o PF e o PE, líquido; acima do PE, gás. A caixa mostra o modelo de partículas da substância escolhida: no sólido elas vibram presas no lugar; no líquido continuam juntas, mas trocam de lugar; no gás ficam longe umas das outras e ocupam a caixa toda. O eixo é comprimido nas temperaturas altas, só para caber tudo.</div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "sub", (k) => (sel = +k));
    SIM.estados._estado = (pf, pe, T) => (T < pf ? "sólido" : T < pe ? "líquido" : "gás");
    const NP = 30, bx = 20, by = 60, bw = 170, bh = 190, P = Array.from({ length: NP }, (_, i) => ({ lx: bx + 22 + (i % 6) * 25, ly: by + bh - 16 - Math.floor(i / 6) * 25, x: bx + 22 + (i % 6) * 25, y: by + bh - 16 - Math.floor(i / 6) * 25, vx: 0, vy: 0, f: i * 1.7 }));
    let tt = 0;
    anima(el, F, (dt) => {
      tt += dt;
      const T = Math.round(TDe(+q("[data-c=u]").value / 1000)), s = SUB[sel], est = SIM.estados._estado(s[1], s[2], T);
      q("[data-o=u]").textContent = T + " °C";
      /* partículas */
      P.forEach((p) => {
        if (est === "sólido") { const a = 1.2 + 2.2 * Math.max(0, Math.min(1, (T + 273) / (s[1] + 273))); p.x += (p.lx + a * Math.sin(tt * 14 + p.f) - p.x) * 0.25; p.y += (p.ly + a * Math.cos(tt * 12 + p.f * 1.3) - p.y) * 0.25; p.vx = p.vy = 0; }
        else if (est === "líquido") { /* juntas, mas sem lugar fixo: balançam bastante e, de vez em quando, duas vizinhas trocam de lugar */ p.x += (p.lx + 7 * Math.sin(tt * 3.1 + p.f) - p.x) * 0.12; p.y += (p.ly + 6 * Math.cos(tt * 2.3 + p.f * 1.7) - p.y) * 0.12; p.vx = p.vy = 0; }
        else { const v = Math.hypot(p.vx, p.vy) || 1, alvo = 150; if (v < 20) { const a = Math.random() * 6.283; p.vx = alvo * Math.cos(a); p.vy = alvo * Math.sin(a); } else { p.vx *= alvo / v; p.vy *= alvo / v; } p.x += p.vx * dt; p.y += p.vy * dt; if (p.y < by + 8) { p.y = by + 8; p.vy = Math.abs(p.vy); } }
        if (p.x < bx + 8) { p.x = bx + 8; p.vx = Math.abs(p.vx); } if (p.x > bx + bw - 8) { p.x = bx + bw - 8; p.vx = -Math.abs(p.vx); } if (p.y > by + bh - 8) { p.y = by + bh - 8; p.vy = -Math.abs(p.vy); }
      });
      if (est === "líquido" && Math.random() < dt * 6) { const i = Math.floor(Math.random() * (NP - 1)), a = P[i], b = P[i + 1]; if (i % 6 !== 5) { [a.lx, b.lx] = [b.lx, a.lx]; [a.ly, b.ly] = [b.ly, a.ly]; } }
      const corE = { "sólido": "var(--mA)", "líquido": "var(--ok)", "gás": "var(--warn)" };
      let sv = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="6" style="fill:var(--bg);stroke:var(--ink3);stroke-width:1.5"/>` + P.map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="7" style="fill:${corE[est]};opacity:.85"/>`).join("") + D.txt(bx + bw / 2, by - 26, s[0] + " a " + T + " °C", "tx2") + D.txt(bx + bw / 2, by - 8, est, "tx", "middle", `style="font-weight:700;fill:${corE[est]}"`);
      /* barras */
      const gx = 300, gw = 350, X = (T2) => gx + Math.max(0, Math.min(1, xDe(T2))) * gw;
      SUB.forEach((r, i) => { const y = 34 + i * 26, e = SIM.estados._estado(r[1], r[2], T);
        sv += D.txt(gx - 8, y + 13, r[0], "tx2", "end", i === sel ? 'style="fill:var(--ink);font-weight:700"' : "") + `<rect x="${gx}" y="${y}" width="${X(r[1]) - gx}" height="18" style="fill:var(--mA);opacity:.75"/><rect x="${X(r[1])}" y="${y}" width="${X(r[2]) - X(r[1])}" height="18" style="fill:var(--ok);opacity:.75"/><rect x="${X(r[2])}" y="${y}" width="${gx + gw - X(r[2])}" height="18" style="fill:var(--warn);opacity:.75"/>` + (i === sel ? `<rect x="${gx - 1}" y="${y - 1}" width="${gw + 2}" height="20" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>` : "") + `<circle cx="${gx + gw + 12}" cy="${y + 9}" r="5" style="fill:${corE[e]}"/>`; });
      const ya = 34 + SUB.length * 26 + 6;
      [-200, 0, 100, 500, 1000, 3000].forEach((t) => (sv += `<line x1="${X(t)}" x2="${X(t)}" y1="${ya - 4}" y2="${ya + 4}" style="stroke:var(--ink3)"/>` + D.txt(X(t), ya + 18, String(t).replace("-", "−"), "tx2")));
      sv += `<line x1="${gx}" x2="${gx + gw}" y1="${ya}" y2="${ya}" style="stroke:var(--ink3)"/><line x1="${X(T)}" x2="${X(T)}" y1="26" y2="${ya}" style="stroke:var(--ink);stroke-width:2"/>` + D.txt(gx + gw / 2, ya + 38, "temperatura (°C)", "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("temperatura", T + " °C") + vis(s[0] + ": ponto de fusão", n2(s[1], 1) + " °C") + vis("ponto de ebulição", n2(s[2], 1) + " °C") + vis("estado", est);
    });
  };

  /* ---------- A04 · a curva denuncia: substância pura, mistura comum, eutética ou azeotrópica (curvas esquemáticas) ---------- */
  SIM.qCurvas = (el, F) => {
    const W = 680, H = 300, TIPOS = { pura: ["substância pura", 0, 0], comum: ["mistura comum", 9, 9], eut: ["mistura eutética", 0, 9], aze: ["mistura azeotrópica", 9, 0] };
    const ordem = ["pura", "comum", "eut", "aze"].sort(() => Math.random() - 0.5), LET = ["A", "B", "C", "D"];
    let am = 0, t = 0, quente = false, resp = {}, msg = "Escolha uma amostra, aqueça e olhe a curva. Depois diga o que ela é.";
    /* curva: sólido 0–15, fusão 15–35, líquido 35–55, ebulição 55–85, gás 85–100 (tempo em unidades arbitrárias) */
    SIM.qCurvas._curva = (tipo, x) => { const [, df, de] = TIPOS[tipo], Tf = 30, Te = 64; if (x < 15) return 8 + ((Tf - 8) * x) / 15; if (x < 35) return Tf + (df * (x - 15)) / 20; if (x < 55) return Tf + df + ((Te - Tf - df) * (x - 35)) / 20; if (x < 85) return Te + (de * (x - 55)) / 30; return Te + de + ((92 - Te - de) * (x - 85)) / 15; };
    SIM.qCurvas._fase = (x) => (x < 15 ? "sólido" : x < 35 ? "fundindo" : x < 55 ? "líquido" : x < 85 ? "fervendo" : "gás");
    SIM.qCurvas._ordem = () => ordem.slice();
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(LET.map((l, i) => [i, "amostra " + l]), "am", 0)}</div></div>
        <div class="bts"><button class="bt pri" data-a="aq">Aquecer</button><button class="bt" data-a="zera">Esfriar e recomeçar</button></div>
        <div style="grid-column:1/-1"><div class="bts">${Object.keys(TIPOS).map((k) => `<button class="bt peq" data-r="${k}">é ${TIPOS[k][0]}</button>`).join("")}</div></div></div>
      <div class="status" data-v="msg"></div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "am", (k) => { am = +k; t = 0; quente = false; msg = "Amostra " + LET[am] + " no béquer, ainda sólida. Aqueça."; });
    q("[data-a=aq]").addEventListener("click", () => (quente = true));
    q("[data-a=zera]").addEventListener("click", () => { t = 0; quente = false; });
    el.querySelectorAll("[data-r]").forEach((b) => b.addEventListener("click", () => {
      if (t < 85) { msg = "Espere a curva passar pela fusão e pela ebulição antes de decidir: é nelas que está a pista."; return; }
      const certo = b.dataset.r === ordem[am]; resp[am] = certo;
      const exp = { pura: "dois patamares: funde e ferve em temperatura constante.", comum: "duas faixas inclinadas: a temperatura sobe durante a fusão e durante a ebulição.", eut: "patamar na fusão e faixa na ebulição: funde como se fosse pura, mas ferve como mistura.", aze: "faixa na fusão e patamar na ebulição: ferve como se fosse pura, mas funde como mistura." };
      msg = (certo ? `<b class="ok">Certo.</b> ` : `<b class="bad">Ainda não.</b> `) + "A amostra " + LET[am] + (certo ? " é " + TIPOS[ordem[am]][0] + ": " + exp[ordem[am]] : " não é " + TIPOS[b.dataset.r][0] + ". Olhe de novo os dois trechos de mudança de estado: cada um é reto na horizontal ou inclinado?");
    }));
    anima(el, F, (dt) => {
      if (quente) t = Math.min(100, t + dt * 9);
      const tipo = ordem[am], T = SIM.qCurvas._curva(tipo, t), fase = SIM.qCurvas._fase(t);
      /* béquer na chama */
      let sv = D.copo(70, 110, 110, 110, 0.5, fase === "sólido" ? "var(--ink3)" : fase === "gás" ? "var(--warn)" : "var(--mA)") + `<line x1="50" x2="200" y1="222" y2="222" style="stroke:var(--ink2);stroke-width:3"/>` + (quente && t < 100 ? D.chama(125, 262, 1.2) : "") + D.termo(210, 200, 130, T / 100, "", "var(--bad)") + D.txt(125, 96, "amostra " + LET[am], "tx2") + D.txt(125, 286, fase, "tx", "middle", 'style="font-weight:700"');
      if (fase === "fervendo" || fase === "fundindo") for (let i = 0; i < 6; i++) { const s = (t * 0.8 + i / 6) % 1; sv += `<circle cx="${85 + i * 16}" cy="${214 - s * 46}" r="2.6" style="fill:none;stroke:var(--ink);stroke-width:1.1;opacity:${fase === "fervendo" ? 0.8 : 0.25}"/>`; }
      /* gráfico */
      const o = { x0: 300, y0: 250, w: 330, h: 200, xmax: 100, ymin: 0, ymax: 100, xlab: "", ylab: "temperatura", xt: [], yt: [], curvas: [{ pts: D.amostra((x) => SIM.qCurvas._curva(tipo, x), 0, Math.max(0.01, t), 120), cor: "var(--mod)" }] };
      sv += D.graf(o) + D.txt(o.x0 + o.w / 2, o.y0 + 22, "tempo de aquecimento (escala esquemática, sem números)", "tx2") + `<circle cx="${o.x0 + (t / 100) * o.w}" cy="${o.y0 - (T / 100) * o.h}" r="5" style="fill:var(--warn)"/>`;
      if (t >= 35) sv += D.txt(o.x0 + 0.25 * o.w, o.y0 - 0.2 * o.h, "fusão", "tx2"); if (t >= 85) sv += D.txt(o.x0 + 0.7 * o.w, o.y0 - 0.54 * o.h, "ebulição", "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("amostra", LET[am]) + vis("o que está acontecendo", fase) + vis("classificadas certo", Object.values(resp).filter(Boolean).length + " de 4");
      q("[data-v=msg]").innerHTML = msg + " <b>As curvas são esquemáticas</b>: o desenho mostra a forma (patamar ou faixa), não temperaturas medidas.";
    });
  };

  /* ---------- A05 · monte a separação: escolha a fração, escolha o método, veja o que sai ---------- */
  SIM.separacao = (el, F) => {
    const W = 680, H = 250, COR = { areia: "#c9a66b", sal: "#e8edf5", ferro: "#8d99ae", água: "#5b8def", óleo: "#e0c341", álcool: "#9ad1c9" };
    const DES = { 1: ["areia", "sal", "ferro"], 2: ["água", "óleo", "sal"], 3: ["água", "álcool", "areia"] }, LIQ = ["água", "óleo", "álcool"];
    const MET = [["ima", "ímã"], ["agua", "acrescentar água"], ["filtra", "filtração"], ["decanta", "funil de decantação"], ["evapora", "evaporação"], ["dsimples", "destilação simples"], ["dfrac", "destilação fracionada"]];
    let fr = [], sel = 0, passos = 0, msg = "";
    /* regra de cada método sobre uma fração (lista de componentes). Devolve {partes, msg} ou {msg} quando não separa nada. */
    SIM.separacao._aplica = (f, m) => {
      const tem = (x) => f.includes(x), sem = (...xs) => f.filter((x) => !xs.includes(x)), liq = f.filter((x) => LIQ.includes(x));
      const retidos = f.filter((x) => x === "areia" || x === "ferro" || (x === "sal" && !tem("água")));
      if (f.length < 2) return { msg: "Essa fração já tem um componente só: não há o que separar." };
      if (m === "ima") return tem("ferro") ? { partes: [["ferro"], sem("ferro")], msg: "O ímã puxou o ferro (propriedade usada: magnetismo)." } : { msg: "Nada aqui é atraído pelo ímã." };
      if (m === "agua") return tem("água") ? { msg: "Essa fração já tem água." } : tem("sal") ? { partes: [f.concat("água")], msg: "O sal dissolveu na água; o que é insolúvel continua sólido (dissolução fracionada: usa a diferença de solubilidade). Agora há líquido para filtrar." } : { msg: "Nada aqui se dissolve em água: acrescentar água não ajuda." };
      if (m === "filtra") return !liq.length ? { msg: "Sem líquido não há o que passar pelo papel. Sólido com sólido pede outro caminho." } : !retidos.length ? { msg: tem("sal") ? "O sal está dissolvido: passa pelo papel junto com a água. Filtração só segura sólido que não dissolveu." : "Não há sólido para o papel segurar." } : { partes: [retidos, sem(...retidos)], msg: "O papel reteve " + retidos.join(" e ") + "; o líquido passou (filtrado). Propriedade usada: tamanho das partículas." };
      if (m === "decanta") return tem("água") && tem("óleo") ? { partes: [["óleo"], sem("óleo")], msg: "Óleo e água não se misturam e o óleo é menos denso: ficou por cima, e a torneira do funil deixou sair primeiro a camada de baixo." } : { msg: liq.length > 1 ? "Esses dois líquidos se misturam (formam uma fase só): não aparecem camadas para o funil separar." : "O funil de decantação serve para dois líquidos que não se misturam." };
      const soSalmoura = tem("água") && tem("sal") && f.length === 2;
      if (m === "evapora") return soSalmoura ? { partes: [["sal"]], msg: "A água evaporou e o sal ficou. Atenção: a água foi embora para o ar. Se você precisasse dela, o método certo seria a destilação simples." } : { msg: retidos.length ? "Tire antes o sólido que não dissolveu, senão ele fica misturado com o que sobrar." : liq.length > 1 ? "Evaporar levaria embora os líquidos juntos." : "Não há sólido dissolvido para ficar." };
      if (m === "dsimples") return soSalmoura ? { partes: [["sal"], ["água"]], msg: "A água ferveu, o vapor condensou no condensador e foi recolhido; o sal ficou no balão. Recuperou os dois (diferença grande de ponto de ebulição)." } : { msg: tem("água") && tem("álcool") ? "Os pontos de ebulição são próximos (78 °C e 100 °C): na destilação simples os dois vapores sobem juntos. Use a fracionada." : retidos.length ? "Tire antes o sólido que não dissolveu." : "A destilação simples separa um sólido dissolvido do seu solvente." };
      if (m === "dfrac") return tem("água") && tem("álcool") && !retidos.length && !tem("óleo") ? { partes: [["álcool"], sem("álcool")], msg: "A coluna de fracionamento deixou subir primeiro o mais volátil, o álcool (78 °C). Na vida real ele sai com cerca de 4% de água: é a mistura azeotrópica do tema A04." } : { msg: retidos.length ? "Tire antes o sólido que não dissolveu." : "A destilação fracionada separa líquidos miscíveis com pontos de ebulição diferentes." };
      return { msg: "?" };
    };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div style="grid-column:1/-1"><div class="bts">${botoes([[1, "desafio 1: areia + sal + ferro"], [2, "desafio 2: água + óleo + sal"], [3, "desafio 3: água + álcool + areia"]], "des", 1)}</div></div>
        <div style="grid-column:1/-1"><div class="bts" data-v="frs"></div></div>
        <div style="grid-column:1/-1"><div class="bts">${MET.map(([k, n]) => `<button class="bt peq" data-m="${k}">${n}</button>`).join("")}</div></div></div>
      <div class="status" data-v="msg"></div>`);
    const q = (s) => el.querySelector(s);
    const pronto = () => fr.every((f) => f.length === 1);
    const desenha = () => {
      const n = fr.length, larg = Math.min(120, (W - 40) / n - 14);
      let sv = "";
      fr.forEach((f, i) => { const x = 20 + (i + 0.5) * ((W - 40) / n) - larg / 2, h = 120, y = 40, cam = h * 0.8 / f.length;
        sv += f.map((c, j) => `<rect x="${x + 2}" y="${y + h - (j + 1) * cam}" width="${larg - 4}" height="${cam}" style="fill:${COR[c]};opacity:.8"/>` + D.txt(x + larg / 2, y + h - (j + 0.5) * cam + 4, c, "tx2", "middle", 'style="fill:#10131a;font-weight:600"')).join("") + `<path d="M${x} ${y} L${x} ${y + h} L${x + larg} ${y + h} L${x + larg} ${y}" style="fill:none;stroke:${i === sel ? "var(--mod)" : "var(--ink2)"};stroke-width:${i === sel ? 3.5 : 2}"/>` + D.txt(x + larg / 2, y + h + 22, "fração " + (i + 1), "tx2", "middle", i === sel ? 'style="fill:var(--ink);font-weight:700"' : "") + D.txt(x + larg / 2, y + h + 42, f.length === 1 ? "✓ separado" : f.length + " componentes juntos", "tx2", "middle", f.length === 1 ? 'style="fill:var(--ok)"' : ""); });
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=frs]").innerHTML = fr.map((f, i) => `<button class="bt peq" data-f="${i}" aria-pressed="${i === sel}">fração ${i + 1}: ${f.join(" + ")}</button>`).join("");
      el.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { sel = +b.dataset.f; desenha(); }));
      q("[data-v=lt]").innerHTML = vis("frações", String(n)) + vis("etapas usadas", String(passos)) + vis("situação", pronto() ? "tudo separado" : "ainda há mistura");
      q("[data-v=msg]").innerHTML = msg + (pronto() ? ` <b class="ok">Pronto: cada componente está sozinho, em ${passos} etapas.</b> Tente outro desafio, ou refaça com menos etapas.` : "") + " Escolha uma fração e depois um método. Toda separação usa uma diferença de propriedade: antes de clicar, diga qual.";
    };
    const comeca = (k) => { fr = [DES[k].slice()]; sel = 0; passos = 0; msg = "Tudo misturado num béquer só."; desenha(); };
    liga(el, "des", (k) => comeca(+k));
    el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => {
      const r = SIM.separacao._aplica(fr[sel], b.dataset.m);
      if (r.partes) { fr.splice(sel, 1, ...r.partes); passos++; sel = Math.max(0, fr.findIndex((f) => f.length > 1)); }
      msg = (r.partes ? `<b class="ok">Funcionou.</b> ` : `<b class="warn">Não separou.</b> `) + r.msg; desenha();
    }));
    SIM.separacao._estado = () => ({ fr: fr.map((f) => f.slice()), passos, pronto: pronto() });
    comeca(1);
  };
})();
