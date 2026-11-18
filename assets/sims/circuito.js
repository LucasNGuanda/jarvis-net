/* Circuito vivo: pilha + resistor + LED.
   Física:
   - LED ideal: não conduz abaixo de U_LED; acima, segura U_LED fixo -> i = (E - U_LED)/R
   - LED real (Shockley): i = Is (e^{V/(n Vt)} - 1). Com o resistor em série,
     E = R i + n Vt ln(1 + i/Is)  ->  i = (a/R) W( (Is R/a) e^{(E + Is R)/a} ) - Is,  a = n Vt.
   - Queima acima de 30 mA. Resistor comum aguenta 0,25 W. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const LEDS = { vermelho: { Vf: 2.0, cor: "#ff4a4a" }, verde: { Vf: 2.2, cor: "#4dff7a" }, azul: { Vf: 3.1, cor: "#4a8dff" } };
  const N = 2, VT = 0.025852, A = N * VT, IREF = 0.020; // Is escolhido para dar Vf em 20 mA
  const I_QUEIMA = 0.030, P_MAX_R = 0.25;

  // W de Lambert em forma logarítmica: resolve w + ln w = L  (w = W(e^L))
  function W_log(L) {
    if (L < -30) return Math.exp(L);
    let w = L > 1 ? L - Math.log(L) : Math.exp(L);
    for (let k = 0; k < 60; k++) { const g = w + Math.log(w) - L, d = 1 + 1 / w; const wn = w - g / d; if (!(wn > 0)) { w = w / 2; continue; } if (Math.abs(wn - w) < 1e-14 * Math.max(1, w)) { w = wn; break; } w = wn; }
    return w;
  }
  SIM.iLED = (E, R, Vf, real) => {
    if (!real) return E > Vf ? (E - Vf) / R : 0;
    const Is = IREF / Math.expm1(Vf / A);
    const L = Math.log((Is * R) / A) + (E + Is * R) / A;
    return Math.max(0, (A / R) * W_log(L) - Is);
  };
  SIM.vLED = (i, Vf, real) => { if (!real) return i > 0 ? Vf : 0; const Is = IREF / Math.expm1(Vf / A); return A * Math.log1p(i / Is); };

  /* nome: "Pilha + resistor + LED" · matéria: Física · tema: C07 */
  SIM.circuito = (el, F) => {
    el.insertAdjacentHTML("beforeend", `
      <div class="palco"><svg viewBox="0 0 640 330" width="640" aria-label="circuito com pilha, resistor e LED">
        <defs><radialGradient id="brilho"><stop offset="0" stop-color="var(--led)" stop-opacity=".95"/><stop offset=".35" stop-color="var(--led)" stop-opacity=".45"/><stop offset="1" stop-color="var(--led)" stop-opacity="0"/></radialGradient>
        <radialGradient id="calor"><stop offset="0" stop-color="#ff7a1a" stop-opacity=".8"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient></defs>
        <g class="fios"></g><g class="cargas"></g><g class="comps"></g><g class="fumaca"></g>
        <text class="tx" x="320" y="160" text-anchor="middle" style="font-size:30px;font-weight:700" data-v="i"></text>
        <text class="tx2" x="320" y="190" text-anchor="middle" style="font-size:15px" data-v="conta"></text>
        <text class="tx2" x="320" y="306" text-anchor="middle" data-v="leg"></text>
      </svg></div>
      <div class="leitor"><div class="vis"><small>Corrente i</small><b data-v="vi"></b></div><div class="vis"><small>U no resistor</small><b data-v="vr"></b></div><div class="vis"><small>U no LED</small><b data-v="vl"></b></div><div class="vis"><small>Potência no R</small><b data-v="pr"></b></div></div>
      <div class="ctrls">
        <div class="ctrl"><label>Tensão E</label><input type="range" min="0" max="12" step="0.1" value="5" data-c="E"><output data-o="E"></output></div>
        <div class="ctrl"><label>Resistência R</label><input type="range" min="10" max="1000" step="10" value="330" data-c="R"><output data-o="R"></output></div>
        <div class="bts" style="align-items:center">
          <span style="color:var(--ink2);font-size:14px">LED:</span>
          ${Object.keys(LEDS).map((k, i) => `<button class="bt peq" data-led="${k}" aria-pressed="${i === 0}">${k} (${F.t(LEDS[k].Vf, 1)} V)</button>`).join("")}
        </div>
        <div class="bts" style="align-items:center">
          <button class="bt peq" data-t="real" aria-pressed="false">Modelo real (exponencial)</button>
          <button class="bt peq" data-t="eletrons" aria-pressed="false">Ver elétrons</button>
          <button class="bt peq" data-t="pausa" aria-pressed="false">⏸ Pausar</button>
        </div>
      </div>
      <div class="status" data-v="status"></div>
      <div style="padding:0 18px 16px;display:none" data-v="troca"><button class="bt pri">Trocar o LED queimado</button></div>`);

    const q = (s) => el.querySelector(s);
    const st = { E: 5, R: 330, led: "vermelho", real: false, eletrons: false, pausa: false, queimado: false };
    // caminho: retângulo, sentido convencional horário saindo do + (em cima da pilha)
    const X0 = 90, X1 = 550, Y0 = 60, Y1 = 270;
    const cantos = [[X0, 165 - 12], [X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1], [X0, 165 + 12]];
    const segs = []; let P = 0;
    for (let k = 0; k < cantos.length - 1; k++) { const [a, b] = [cantos[k], cantos[k + 1]]; const L = Math.hypot(b[0] - a[0], b[1] - a[1]); segs.push({ a, b, L, s0: P }); P += L; }
    const ponto = (s) => { s = ((s % P) + P) % P; for (const g of segs) if (s <= g.s0 + g.L) { const t = (s - g.s0) / g.L; return [g.a[0] + t * (g.b[0] - g.a[0]), g.a[1] + t * (g.b[1] - g.a[1])]; } return cantos[0]; };

    q(".fios").innerHTML = D.fio([[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1], [X0, Y0]]);
    const NC = 30; const cargas = [];
    for (let k = 0; k < NC; k++) { const c = document.createElementNS("http://www.w3.org/2000/svg", "circle"); c.setAttribute("r", "4.5"); q(".cargas").appendChild(c); cargas.push(c); }

    function desenhaComps(i, pR) {
      const led = LEDS[st.led];
      el.style.setProperty("--led", led.cor);
      const brilho = st.queimado ? 0 : Math.min(1, i / 0.02);
      const quente = pR > P_MAX_R ? Math.min(1, (pR - P_MAX_R) / 0.5 + 0.3) : 0;
      q(".comps").innerHTML =
        `<rect x="${X0 - 18}" y="135" width="36" height="60" style="fill:var(--card)"/>` +
        D.comp("bateria", X0, 195, X0, 135, { mais: 1, lado: -1, rot: "E", sinais: false }) +
        (quente ? `<circle cx="320" cy="${Y0}" r="46" fill="url(#calor)" opacity="${quente}"/>` : "") +
        `<rect x="290" y="${Y0 - 14}" width="60" height="28" style="fill:var(--card)"/>` + D.comp("resistor", 290, Y0, 350, Y0, { rot: "R", lado: 1 }) +
        `<circle cx="${X1}" cy="165" r="${30 + 40 * brilho}" fill="url(#brilho)" opacity="${brilho}"/>` +
        `<rect x="${X1 - 16}" y="140" width="32" height="50" style="fill:var(--card)"/>` +
        `<g ${st.queimado ? 'style="--ink:#6b6b6b"' : ""}>${D.comp("led", X1, 140, X1, 190, { rot: "LED", lado: 1, dist: 26 })}</g>` +
        (st.queimado ? `<path d="M${X1 - 6} 158 l5 6 -4 4 6 7" style="stroke:var(--bad);stroke-width:2;fill:none"/>` : "") +
        D.txt(X0 - 30, 140, "+", "tx", "middle") + D.txt(X0 - 30, 200, "−", "tx", "middle");
    }

    let i = 0, uR = 0, uL = 0, pR = 0;
    function calcula() {
      const led = LEDS[st.led];
      i = st.queimado ? 0 : SIM.iLED(st.E, st.R, led.Vf, st.real);
      uL = st.queimado ? st.E : SIM.vLED(i, led.Vf, st.real);
      if (!st.real && !st.queimado && i === 0) uL = st.E; // circuito "aberto" no LED: toda a tensão fica nele
      uR = i * st.R; pR = i * i * st.R;
      if (!st.queimado && i > I_QUEIMA) { st.queimado = true; fumacaNova = 60; return calcula(); }
      atualiza();
    }
    function atualiza() {
      const led = LEDS[st.led];
      q('[data-o="E"]').textContent = F.t(st.E, 1) + " V";
      q('[data-o="R"]').textContent = st.R + " Ω";
      q('[data-v="i"]').textContent = `i = ${F.t(i * 1000, 1)} mA`;
      q('[data-v="conta"]').textContent = st.queimado ? "LED aberto: não passa corrente"
        : st.real ? `U_LED = ${F.t(uL, 3)} V  (resolvido com W de Lambert)`
        : i > 0 ? `(${F.t(st.E, 1)} − ${F.t(led.Vf, 1)}) V ÷ ${st.R} Ω` : `${F.t(st.E, 1)} V < ${F.t(led.Vf, 1)} V: o LED não conduz`;
      q('[data-v="leg"]').textContent = st.eletrons ? "bolinhas = elétrons (andam contra o sentido convencional)" : "bolinhas = cargas no sentido convencional (do + para o −)";
      q('[data-v="vi"]').textContent = F.t(i * 1000, 2) + " mA";
      q('[data-v="vr"]').textContent = F.t(uR, 2) + " V";
      q('[data-v="vl"]').textContent = F.t(uL, 2) + " V";
      q('[data-v="pr"]').textContent = (pR < 1 ? F.t(pR * 1000, 1) + " mW" : F.t(pR, 2) + " W");
      let s;
      if (st.queimado) s = `<b class="bad">LED: queimou.</b> A corrente passou de 30 mA. Com o LED aberto, a corrente cai a zero e a tensão inteira da pilha fica nos terminais dele.`;
      else if (i < 1e-4) s = `<b>LED: apagado</b>: falta empurrão. Abaixo de ~${F.t(led.Vf, 1)} V o LED ${st.real ? "deixa passar uma corrente desprezível" : "não conduz"}.`;
      else if (i > 0.025) s = `<b class="warn">LED: aceso, no limite.</b> Acima de 30 mA ele queima.`;
      else s = `<b class="ok">LED: aceso.</b> Brilho proporcional à corrente.`;
      if (pR > P_MAX_R) s += ` <b class="warn">Resistor esquentando:</b> ${F.t(pR, 2)} W passa do limite de 0,25 W de um resistor comum.`;
      q('[data-v="status"]').innerHTML = s;
      q('[data-v="troca"]').style.display = st.queimado ? "" : "none";
      desenhaComps(i, pR);
    }

    // fumaça
    let fumacaNova = 0; const part = [];
    function fumaca(dt) {
      if (fumacaNova > 0) { fumacaNova--; part.push({ x: X1 + (Math.random() - 0.5) * 10, y: 160, vx: (Math.random() - 0.5) * 18, vy: -30 - Math.random() * 30, r: 4, a: 0.8 }); }
      if (st.queimado && Math.random() < 0.05) part.push({ x: X1, y: 160, vx: (Math.random() - 0.5) * 8, vy: -20, r: 3, a: 0.4 });
      for (const p of part) { p.x += p.vx * dt; p.y += p.vy * dt; p.r += 10 * dt; p.a -= 0.35 * dt; }
      while (part.length && part[0].a <= 0) part.shift();
      q(".fumaca").innerHTML = part.filter((p) => p.a > 0).map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(1)}" fill="#9aa0a8" opacity="${p.a.toFixed(2)}"/>`).join("");
    }

    // animação: velocidade das bolinhas proporcional à corrente (fora de escala: 20 mA -> 70 px/s)
    let fase = 0, t0 = performance.now(), vivo = true;
    function quadro(t) {
      if (!vivo) return;
      const dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
      if (!st.pausa) {
        fase += (st.eletrons ? -1 : 1) * 3500 * i * dt;
        fumaca(dt);
      }
      const cor = st.eletrons ? "#5aa0ff" : "#5aa0ff";
      for (let k = 0; k < NC; k++) { const [x, y] = ponto(fase + (k * P) / NC); cargas[k].setAttribute("cx", x.toFixed(1)); cargas[k].setAttribute("cy", y.toFixed(1)); cargas[k].setAttribute("fill", cor); cargas[k].setAttribute("opacity", st.eletrons ? ".9" : ".85"); }
      requestAnimationFrame(quadro);
    }
    requestAnimationFrame(quadro);
    F.aoSair(() => (vivo = false));

    el.querySelectorAll("[data-c]").forEach((r) => r.addEventListener("input", () => { st[r.dataset.c] = +r.value; calcula(); }));
    el.querySelectorAll("[data-led]").forEach((b) => b.addEventListener("click", () => { st.led = b.dataset.led; el.querySelectorAll("[data-led]").forEach((x) => x.setAttribute("aria-pressed", x === b)); calcula(); }));
    el.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => { const k = b.dataset.t; st[k] = !st[k]; b.setAttribute("aria-pressed", st[k]); if (k === "pausa") b.textContent = st.pausa ? "▶ Continuar" : "⏸ Pausar"; calcula(); }));
    q('[data-v="troca"] button').addEventListener("click", () => { st.queimado = false; part.length = 0; calcula(); });
    // API para o "chuta antes de ver"
    el.ajusta = (o) => { Object.assign(st, o); el.querySelectorAll("[data-c]").forEach((r) => (r.value = st[r.dataset.c])); calcula(); };
    calcula();
    return el;
  };
})();
