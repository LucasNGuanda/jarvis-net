/* Simulações da aba Experimental (módulos FEm, FEg, FEr). FE01 lendo uma régua; FE02 cronômetro na mão; */
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
})();
