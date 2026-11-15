/* Simulações da Química, módulo A (Introdução à química), temas A06 a A09.
   A06 SIM.fenomenos: físico ou químico? Caixas de partículas antes e depois de oito processos (desenho esquemático, sem escala).
   A07 SIM.solubilidade: curva de solubilidade em g de sal por 100 g de água (valores de tabela, interpolados em linha reta entre os pontos):
     T (°C)   0     20    40    60    80    100
     KNO₃    13,3  31,6  63,9  110   169   246
     KCl     27,6  34,0  40,0  45,5  51,1  56,7
     NaCl    35,7  36,0  36,6  37,3  38,4  39,8
   A08 SIM.menisco: erro de paralaxe na proveta de 100 mL. Modelo geométrico: 100 mL em 20 cm de altura (1 mL = 0,2 cm; raio interno 1,26 cm),
     escala na parede da frente, olho a 30 cm do eixo e a uma altura h acima do menisco: a linha de visada cruza a escala h·1,26/30 cm acima do menisco,
     isto é, erro = h·1,26/30/0,2 mL (h = 10 cm → +2,1 mL; h = −10 cm → −2,1 mL; h = 0 → 0). Conferido em Python.
   A09 SIM.exatidao: cinco medidas da densidade do alumínio (2,70 g/cm³) com um erro sistemático e um espalhamento aleatório escolhidos. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };

  /* ---------- A06 · físico ou químico? as partículas antes e depois ---------- */
  SIM.fenomenos = (el, F) => {
    const W = 680, H = 250, C = { H: "#e8edf5", O: "#ef5350", Fe: "#8d99ae", Na: "#b48cf5", Cl: "#3fbf8a", I: "#a06bd6", Cu: "#5b8def", S: "#ecd04a" };
    /* glifos: lista de átomos [dx, dy, elemento, raio] */
    const G = { H2O: [[0, 0, "O", 6], [-6, 5, "H", 3.5], [6, 5, "H", 3.5]], H2: [[-4, 0, "H", 3.5], [4, 0, "H", 3.5]], O2: [[-5, 0, "O", 6], [5, 0, "O", 6]], Fe: [[0, 0, "Fe", 6.5]], Fe2O3: [[-7, 0, "Fe", 6.5], [7, 0, "Fe", 6.5], [0, -7, "O", 5], [0, 7, "O", 5], [14, 6, "O", 5]], Na: [[0, 0, "Na", 5]], Cl: [[0, 0, "Cl", 7]], I2: [[-6, 0, "I", 7], [6, 0, "I", 7]], Az: [[0, 0, "Cu", 7], [-10, -6, "O", 3.5], [10, -6, "O", 3.5], [-10, 7, "O", 3.5], [10, 7, "O", 3.5], [0, 12, "O", 3.5]], Br: [[0, 0, "Cu", 7]] };
    const rede = (n, cols, dx, dy, x0, y0) => Array.from({ length: n }, (_, i) => [x0 + (i % cols) * dx, y0 - Math.floor(i / cols) * dy]);
    const solto = (n, s) => Array.from({ length: n }, (_, i) => [20 + ((i * 97 + s * 31) % 170), 22 + ((i * 61 + s * 47) % 150)]);
    const P = [
      { k: "gelo", nome: "gelo derretendo", tipo: "físico", a: [["H2O", rede(12, 4, 26, 24, 62, 170)]], d: [["H2O", rede(12, 6, 30, 22, 28, 172).map(([x, y], i) => [x + (i % 2) * 6, y + ((i * 7) % 9)])]], ex: "As moléculas de água são as mesmas antes e depois: só saíram dos lugares fixos. Mudança de estado é fenômeno físico." },
      { k: "ferve", nome: "água fervendo", tipo: "físico", a: [["H2O", rede(12, 6, 30, 22, 28, 172)]], d: [["H2O", solto(12, 3)]], ex: "O vapor é feito das mesmas moléculas de água, agora afastadas. Nenhuma ligação dentro da molécula foi quebrada." },
      { k: "sal", nome: "sal dissolvendo na água", tipo: "físico", a: [["Na", rede(6, 3, 24, 24, 24, 172)], ["Cl", rede(6, 3, 24, 24, 36, 160)], ["H2O", solto(8, 5).map(([x, y]) => [x, y * 0.5])]], d: [["Na", solto(6, 2)], ["Cl", solto(6, 7)], ["H2O", solto(8, 5)]], ex: "Os íons do sal se espalharam entre as moléculas de água, mas continuam os mesmos íons. Evaporando a água, o sal volta igual. No ensino médio, dissolução é classificada como fenômeno físico." },
      { k: "iodo", nome: "iodo sublimando (vapor violeta)", tipo: "físico", a: [["I2", rede(8, 4, 34, 26, 46, 172)]], d: [["I2", solto(8, 4)]], ex: "Apareceu cor e apareceu um gás, e mesmo assim é físico: são as mesmas moléculas de iodo, que passaram de sólido a vapor. Mudança de cor e formação de gás são pistas, não provas." },
      { k: "h2", nome: "hidrogênio queimando", tipo: "químico", a: [["H2", solto(8, 2)], ["O2", solto(4, 9)]], d: [["H2O", solto(8, 6)]], ex: "As moléculas de hidrogênio e de oxigênio sumiram e apareceram moléculas de água: os átomos trocaram de companhia. Substâncias novas, fenômeno químico." },
      { k: "eletr", nome: "eletrólise da água", tipo: "químico", a: [["H2O", rede(8, 4, 34, 24, 46, 172)]], d: [["H2", solto(8, 2)], ["O2", solto(4, 9)]], ex: "A corrente elétrica quebrou as moléculas de água. O que borbulha não é vapor de água: são dois gases novos, hidrogênio e oxigênio." },
      { k: "ferrugem", nome: "ferro enferrujando", tipo: "químico", a: [["Fe", rede(12, 6, 26, 22, 34, 172)], ["O2", solto(6, 3).map(([x, y]) => [x, y * 0.45])]], d: [["Fe2O3", rede(6, 3, 52, 36, 46, 170)]], ex: "Ferro e oxigênio do ar se ligaram e formaram óxido de ferro, um sólido com outra cor, outra densidade e que nem é atraído por ímã do mesmo jeito." },
      { k: "cuso4", nome: "sulfato de cobre azul aquecido", tipo: "químico", a: [["Az", rede(6, 3, 54, 40, 46, 168)]], d: [["Br", rede(6, 3, 30, 24, 60, 172)], ["H2O", solto(10, 4).map(([x, y]) => [x, y * 0.55])]], ex: "O cristal azul tem água presa na sua fórmula. O aquecimento solta essa água e sobra outra substância, branca. Pingando água, o azul volta: a transformação é reversível e, ainda assim, química. Reversível não quer dizer físico." },
    ];
    let k = 0, palpite = null, acertos = {};
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div style="grid-column:1/-1"><div class="bts">${botoes(P.map((p, i) => [i, p.nome]), "p", 0)}</div></div>
        <div class="bts"><button class="bt pri" data-r="físico">É fenômeno físico</button><button class="bt pri" data-r="químico">É fenômeno químico</button></div></div>
      <div class="status" data-v="msg"></div>`);
    const q = (s) => el.querySelector(s);
    const caixa = (x, grupos, rot) => `<rect x="${x}" y="30" width="210" height="190" rx="6" style="fill:var(--bg);stroke:var(--ink3);stroke-width:1.5"/>` + D.txt(x + 105, 20, rot, "tx2") + grupos.map(([g, pos]) => pos.map(([a, b]) => G[g].map(([dx, dy, e, r]) => `<circle cx="${(x + a + dx).toFixed(1)}" cy="${(30 + b + dy).toFixed(1)}" r="${r}" style="fill:${C[e]};stroke:#10131a;stroke-width:.8"/>`).join("")).join("")).join("");
    SIM.fenomenos._tipo = (i) => P[i].tipo;
    const desenha = () => {
      const p = P[k];
      q("[data-v=sv]").innerHTML = caixa(60, p.a, "antes") + D.seta(290, 125, 390, 125, "var(--ink2)") + (palpite ? caixa(410, p.d, "depois") : `<rect x="410" y="30" width="210" height="190" rx="6" style="fill:none;stroke:var(--ink3);stroke-width:1.5;stroke-dasharray:6 5"/>` + D.txt(515, 130, "dê o seu palpite", "tx2"));
      q("[data-v=lt]").innerHTML = vis("processo", p.nome) + vis("seu palpite", palpite || "?") + vis("acertos", Object.values(acertos).filter(Boolean).length + " de " + P.length);
      q("[data-v=msg]").innerHTML = palpite ? (palpite === p.tipo ? `<b class="ok">Certo: fenômeno ${p.tipo}.</b> ` : `<b class="bad">Não: é fenômeno ${p.tipo}.</b> `) + p.ex : "Olhe as partículas de antes, pense no que acontece com elas e dê o palpite. A pergunta que decide: <b>as partículas de depois são as mesmas de antes?</b> Cada bolinha é um átomo e cada cor é um elemento; o desenho é esquemático.";
    };
    liga(el, "p", (i) => { k = +i; palpite = null; desenha(); });
    el.querySelectorAll("[data-r]").forEach((b) => b.addEventListener("click", () => { if (!palpite && !(k in acertos)) acertos[k] = b.dataset.r === P[k].tipo; palpite = b.dataset.r; desenha(); }));
    desenha();
  };

  /* ---------- A07 · curva de solubilidade ---------- */
  SIM.solubilidade = (el, F) => {
    const W = 680, H = 300, TS = [0, 20, 40, 60, 80, 100], SAL = { kno3: ["nitrato de potássio", [13.3, 31.6, 63.9, 110, 169, 246], "var(--mod)"], kcl: ["cloreto de potássio", [27.6, 34.0, 40.0, 45.5, 51.1, 56.7], "var(--ok)"], nacl: ["cloreto de sódio", [35.7, 36.0, 36.6, 37.3, 38.4, 39.8], "var(--warn)"] };
    let sal = "kno3";
    SIM.solubilidade._sol = (s, T) => { const v = SAL[s][1], i = Math.min(4, Math.floor(T / 20)), f = (T - TS[i]) / 20; return v[i] + (v[i + 1] - v[i]) * f; };
    SIM.solubilidade._conta = (s, T, m) => { const S = SIM.solubilidade._sol(s, T); return { S, dis: Math.min(m, S), fundo: Math.max(0, m - S), tipo: m < S - 1e-9 ? "insaturada" : m > S + 1e-9 ? "saturada com corpo de fundo" : "saturada" }; };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("temperatura (°C)", "T", 0, 100, 1, 40)}${sl("sal colocado (g)", "m", 0, 250, 1, 50)}
        <div style="grid-column:1/-1"><div class="bts">${botoes([["kno3", "nitrato de potássio (KNO₃)"], ["kcl", "cloreto de potássio (KCl)"], ["nacl", "cloreto de sódio (NaCl)"]], "sal", "kno3")}</div></div></div>
      <div class="status">Cada curva mostra o máximo de sal que 100 g de água conseguem dissolver em cada temperatura (o coeficiente de solubilidade). O ponto amarelo é a sua mistura. <b>Abaixo da curva</b>: tudo dissolve e ainda caberia mais (insaturada). <b>Na curva</b>: saturada. <b>Acima da curva</b>: a água dissolve só até a curva, e o resto fica no fundo do béquer. Ponha 100 g de nitrato de potássio, aqueça até dissolver tudo e depois esfrie devagar: os cristais que aparecem são a distância vertical entre o ponto e a curva. Valores de tabela, ligados por retas entre os pontos.</div>`);
    const q = (s) => el.querySelector(s), val = (c) => +q(`[data-c=${c}]`).value;
    liga(el, "sal", (k) => (sal = k));
    anima(el, F, () => {
      const T = val("T"), m = val("m"), c = SIM.solubilidade._conta(sal, T, m);
      q("[data-o=T]").textContent = T + " °C"; q("[data-o=m]").textContent = m + " g";
      /* béquer */
      const bx = 60, by = 70, bw = 150, bh = 170, hf = Math.min(70, c.fundo * 0.55);
      let sv = `<rect x="${bx + 2}" y="${by + 40}" width="${bw - 4}" height="${bh - 42}" style="fill:color-mix(in srgb,var(--mA) ${Math.round(14 + Math.min(40, c.dis / 5))}%,transparent)"/><rect x="${bx + 2}" y="${by + bh - 2 - hf}" width="${bw - 4}" height="${hf}" style="fill:var(--ink);opacity:.8"/><path d="M${bx} ${by} L${bx} ${by + bh} L${bx + bw} ${by + bh} L${bx + bw} ${by}" style="fill:none;stroke:var(--ink2);stroke-width:2.5"/>` + D.txt(bx + bw / 2, by + 90, "100 g de água", "tx2") + D.txt(bx + bw / 2, by + 108, "+ " + n2(c.dis, 1) + " g dissolvidos", "tx2") + (c.fundo > 0.05 ? D.txt(bx + bw / 2, by + bh + 20, "corpo de fundo: " + n2(c.fundo, 1) + " g", "tx2") : D.txt(bx + bw / 2, by + bh + 20, "sem corpo de fundo", "tx2")) + D.termo(bx + bw + 30, by + bh - 20, 130, T / 100, T + " °C", T >= 50 ? "var(--bad)" : "var(--mA)") + D.txt(bx + bw / 2, 40, SAL[sal][0], "tx", "middle", 'style="font-weight:700"');
      /* gráfico */
      const o = { x0: 340, y0: 250, w: 290, h: 200, xmax: 100, ymin: 0, ymax: 250, xlab: "", ylab: "g de sal / 100 g de água", xt: [0, 20, 40, 60, 80, 100], yt: [50, 100, 150, 200, 250], curvas: Object.keys(SAL).map((s) => ({ pts: TS.map((t, i) => [t, SAL[s][1][i]]), cor: s === sal ? SAL[s][2] : "var(--line2)" })) };
      sv += D.graf(o) + D.txt(o.x0 + o.w / 2, o.y0 + 36, "temperatura (°C)", "tx2");
      const px = o.x0 + (T / 100) * o.w, py = o.y0 - (Math.min(m, 250) / 250) * o.h, pc = o.y0 - (Math.min(c.S, 250) / 250) * o.h;
      if (c.fundo > 0.5) sv += `<line x1="${px}" x2="${px}" y1="${py}" y2="${pc}" style="stroke:var(--bad);stroke-width:2;stroke-dasharray:4 3"/>` + D.txt(px + 8, (py + pc) / 2 + 4, n2(c.fundo, 1) + " g no fundo", "tx2", px > o.x0 + o.w - 90 ? "end" : "start");
      sv += `<circle cx="${px}" cy="${pc}" r="4" style="fill:none;stroke:var(--ink);stroke-width:1.5"/><circle cx="${px}" cy="${py}" r="5.5" style="fill:var(--warn)"/>`;
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("solubilidade a " + T + " °C", n2(c.S, 1) + " g/100 g") + vis("dissolvido", n2(c.dis, 1) + " g") + vis("corpo de fundo", n2(c.fundo, 1) + " g") + vis("a solução está", c.tipo);
    });
  };

  /* ---------- A08 · leia o menisco: o erro de paralaxe ---------- */
  SIM.menisco = (el, F) => {
    const W = 680, H = 300;
    let nivel = 46.0;
    SIM.menisco._erro = (h) => (h * 1.26) / 30 / 0.2;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("altura do olho (cm)", "h", -15, 15, 0.5, 10)}
        <div class="bts"><button class="bt pri" data-a="novo">Sortear outro nível</button><button class="bt" data-a="zero">Alinhar o olho</button></div></div>
      <div class="status">Uma proveta de 100 mL vista de lado. O líquido molha o vidro e forma uma superfície curva, o <b>menisco</b>; lê-se sempre pela <b>parte de baixo</b> da curva, com o olho na mesma altura dela. Suba ou desça o olho: a linha de visada (tracejada) passa pela base do menisco, no meio do tubo, e cruza a escala, na parede da frente, em outro ponto. Olho alto demais lê a mais; olho baixo demais lê a menos. Esse é o <b>erro de paralaxe</b>. O modelo é geométrico: proveta de 20 cm de altura útil, olho a 30 cm do eixo.</div>`);
    const q = (s) => el.querySelector(s), val = (c) => +q(`[data-c=${c}]`).value;
    q("[data-a=novo]").addEventListener("click", () => (nivel = 20 + Math.round(Math.random() * 120) / 2));
    q("[data-a=zero]").addEventListener("click", () => { q("[data-c=h]").value = 0; });
    SIM.menisco._nivel = () => nivel;
    anima(el, F, () => {
      const h = val("h"), err = SIM.menisco._erro(h), lido = nivel + err;
      q("[data-o=h]").textContent = n2(h, 1) + " cm";
      /* vista ampliada: 10 mL de escala em torno do nível; 1 mL = 18 px */
      const cx = 200, cy = 150, esc = 18, yDe = (mL) => cy - (mL - nivel) * esc, r = 60;
      let sv = `<rect x="${cx - r}" y="20" width="${2 * r}" height="260" style="fill:var(--bg);stroke:var(--ink2);stroke-width:2.5"/><path d="M${cx - r + 2} ${cy - 9} Q${cx} ${cy + 9} ${cx + r - 2} ${cy - 9} L${cx + r - 2} 278 L${cx - r + 2} 278 Z" style="fill:color-mix(in srgb,var(--mA) 30%,transparent)"/><path d="M${cx - r + 2} ${cy - 9} Q${cx} ${cy + 9} ${cx + r - 2} ${cy - 9}" style="fill:none;stroke:var(--mA);stroke-width:2"/>`;
      for (let v = Math.ceil(nivel - 7); v <= nivel + 7; v++) { const y = yDe(v), dez = v % 5 === 0; if (y < 24 || y > 276) continue; sv += `<line x1="${cx + r}" x2="${cx + r - (dez ? 22 : 12)}" y1="${y}" y2="${y}" style="stroke:var(--ink);stroke-width:${dez ? 1.8 : 1}"/>` + (dez ? D.txt(cx + r + 8, y + 4, String(v), "tx2", "start") : ""); }
      /* olho e linha de visada: olho à direita, na altura h (desenho: 6 px por cm) */
      const ex = 350, ey = cy - h * 8.568, ys = yDe(lido); /* 8,568 px por cm: com o olho em x = 350, a linha tracejada cruza a escala exatamente na leitura */
      sv += `<line x1="${cx}" y1="${cy}" x2="${ex - 14}" y2="${ey}" style="stroke:var(--warn);stroke-width:1.6;stroke-dasharray:6 4"/><circle cx="${cx}" cy="${cy}" r="3.5" style="fill:var(--warn)"/><circle cx="${cx + r}" cy="${ys}" r="4.5" style="fill:none;stroke:var(--bad);stroke-width:2"/>`;
      sv += `<path d="M${ex - 14} ${ey} Q${ex + 2} ${ey - 13} ${ex + 18} ${ey} Q${ex + 2} ${ey + 13} ${ex - 14} ${ey} Z" style="fill:var(--bg);stroke:var(--ink);stroke-width:1.8"/><circle cx="${ex}" cy="${ey}" r="5" style="fill:var(--ink)"/>` + D.txt(ex + 2, ey - 20, "olho", "tx2") + D.txt(cx, 14, "vista ampliada (escala em mL)", "tx2") + D.txt(cx - r - 8, cy + 4, "base do menisco", "tx2", "end") + D.txt(470, cy + 4, "← altura certa do olho", "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("leitura com o olho aí", n2(lido, 1) + " mL") + vis("valor verdadeiro", n2(nivel, 1) + " mL") + vis("erro de paralaxe", (err > 0 ? "+" : "") + n2(err, 1) + " mL") + vis("erro relativo", n2((Math.abs(err) / nivel) * 100, 1) + "%");
    });
  };

  /* ---------- A09 · exato ou preciso? cinco medidas de uma densidade ---------- */
  SIM.exatidao = (el, F) => {
    const W = 680, H = 240, REAL = 2.7;
    let vals = [], z = [0.3, -1.1, 0.8, -0.2, 1.4];
    SIM.exatidao._resumo = (v) => { const n = v.length, med = v.reduce((a, b) => a + b, 0) / n, amp = Math.max(...v) - Math.min(...v); return { med, amp, errp: ((med - REAL) / REAL) * 100 }; };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("erro sistemático (g/cm³)", "b", -0.3, 0.3, 0.01, 0)}${sl("espalhamento aleatório (g/cm³)", "s", 0, 0.15, 0.005, 0.02)}
        <div class="bts"><button class="bt pri" data-a="mede">Medir de novo (5 medidas)</button></div></div>
      <div class="status" data-v="msg"></div>`);
    const q = (s) => el.querySelector(s), val = (c) => +q(`[data-c=${c}]`).value;
    const gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += Math.random(); return (s - 3) / Math.sqrt(0.5); };
    q("[data-a=mede]").addEventListener("click", () => (z = z.map(gauss)));
    anima(el, F, () => {
      const b = val("b"), s = val("s"); vals = z.map((x) => +(REAL + b + s * x).toFixed(2));
      q("[data-o=b]").textContent = (b > 0 ? "+" : "") + n2(b, 2); q("[data-o=s]").textContent = n2(s, 3);
      const r = SIM.exatidao._resumo(vals), X = (v) => 60 + ((v - 2.2) / 1.0) * 560, y = 120;
      let sv = `<line x1="60" x2="620" y1="${y}" y2="${y}" style="stroke:var(--ink2);stroke-width:2"/>`;
      for (let v = 2.2; v <= 3.201; v += 0.1) sv += `<line x1="${X(v)}" x2="${X(v)}" y1="${y - 6}" y2="${y + 6}" style="stroke:var(--ink3)"/>` + D.txt(X(v), y + 24, n2(v, 1), "tx2");
      sv += `<line x1="${X(REAL)}" x2="${X(REAL)}" y1="40" y2="${y + 8}" style="stroke:var(--ok);stroke-width:2.5"/>` + D.txt(X(REAL), 32, "valor aceito: 2,70", "tx2", "middle", 'style="fill:var(--ok)"');
      vals.forEach((v, i) => (sv += `<circle cx="${X(Math.max(2.2, Math.min(3.2, v)))}" cy="${y - 14 - (i % 3) * 12}" r="6" style="fill:var(--warn);opacity:.85;stroke:#10131a"/>`));
      sv += `<line x1="${X(Math.max(2.2, Math.min(3.2, r.med)))}" x2="${X(Math.max(2.2, Math.min(3.2, r.med)))}" y1="${y - 54}" y2="${y + 44}" style="stroke:var(--mod);stroke-width:2;stroke-dasharray:5 4"/>` + D.txt(X(Math.max(2.2, Math.min(3.2, r.med))), y + 60, "média: " + n2(r.med, 2), "tx2", "middle", 'style="fill:var(--mod)"') + D.txt(340, y + 92, "densidade medida (g/cm³)", "tx2");
      q("[data-v=sv]").innerHTML = sv;
      const exato = Math.abs(r.errp) <= 2, preciso = r.amp <= 0.08;
      q("[data-v=lt]").innerHTML = vis("as cinco medidas", vals.map((v) => n2(v, 2)).join("  ")) + vis("média", n2(r.med, 2) + " g/cm³") + vis("amplitude (maior − menor)", n2(r.amp, 2)) + vis("erro percentual da média", (r.errp > 0 ? "+" : "") + n2(r.errp, 1) + "%");
      q("[data-v=msg]").innerHTML = `Resultado: <b>${exato ? "exato" : "inexato"}</b> e <b>${preciso ? "preciso" : "impreciso"}</b>. ` + (exato && preciso ? "As medidas estão juntas e em cima do valor aceito." : !exato && preciso ? "As medidas concordam entre si, mas todas longe do valor aceito: é a marca do <b>erro sistemático</b> (balança descalibrada, paralaxe sempre para o mesmo lado). Repetir não resolve; tem de achar a causa." : exato && !preciso ? "A média caiu perto do valor aceito, mas as medidas estão espalhadas: <b>erro aleatório</b> grande. Mais repetições melhoram a média." : "Espalhadas e longe: os dois tipos de erro juntos.") + " Critérios usados aqui: exato se o erro da média for de até 2%; preciso se a amplitude for de até 0,08 g/cm³. Medem-se cinco pedaços de alumínio; cada bolinha é uma medida.";
    });
  };
})();
