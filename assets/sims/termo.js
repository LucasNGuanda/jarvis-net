/* Simulações da Termodinâmica (módulo T). T01 quatro termômetros; T02 parede de duas camadas; */
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

  /* ---------- T01 · quatro termômetros: Celsius, Fahrenheit, Kelvin e uma escala inventada ---------- */
  SIM.escalas = (el, F) => {
    const W = 680, H = 300;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("temperatura (°C)", "c", -60, 160, 1, 25)}${sl("escala X: leitura no gelo fundente", "xg", -50, 50, 1, 20)}${sl("escala X: leitura na água fervendo", "xv", 60, 300, 1, 220)}</div>
      <div class="status">Os quatro termômetros estão no mesmo lugar, à mesma temperatura: só os números pintados no vidro mudam. Toda escala linear é definida por dois pontos fixos (gelo fundente e água fervendo, ao nível do mar); entre eles, a coluna sobe proporcionalmente. Por isso a conversão é uma regra de três: (C − 0)/(100 − 0) = (F − 32)/(212 − 32) = (X − X_gelo)/(X_vapor − X_gelo).</div>`);
    const q = (s) => el.querySelector(s);
    SIM.escalas._conta = (c, xg, xv) => ({ f: 1.8 * c + 32, k: c + 273.15, x: xg + ((xv - xg) * c) / 100 });
    anima(el, F, () => {
      const c = val(el, "c"), xg = val(el, "xg"), xv = Math.max(val(el, "xv"), xg + 10), r = SIM.escalas._conta(c, xg, xv);
      q("[data-o=c]").textContent = n2(c, 0) + " °C"; q("[data-o=xg]").textContent = n2(xg, 0) + " °X"; q("[data-o=xv]").textContent = n2(xv, 0) + " °X";
      const base = 250, topo = 40, fr = (c + 60) / 220, yC = base - fr * (base - topo);
      const yDe = (v) => base - ((v + 60) / 220) * (base - topo);
      let sv = "";
      [["Celsius", 110, [[0, "0"], [100, "100"]]], ["Fahrenheit", 260, [[0, "32"], [100, "212"]]], ["Kelvin", 410, [[0, "273,15"], [100, "373,15"]]], ["X (sua escala)", 560, [[0, n2(xg, 0)], [100, n2(xv, 0)]]]].forEach(([nome, x, marcas]) => {
        sv += D.termo(x, base, base - topo + 10, fr, "", "var(--bad)") + D.txt(x, base + 34, nome, "tx2");
        marcas.forEach(([cc, rot]) => (sv += `<line x1="${x - 16}" x2="${x + 16}" y1="${yDe(cc)}" y2="${yDe(cc)}" style="stroke:var(--ink3);stroke-dasharray:3 3"/>` + D.txt(x - 20, yDe(cc) + 4, rot, "tx2", "end")));
      });
      sv += `<line x1="70" x2="620" y1="${yC}" y2="${yC}" style="stroke:var(--warn);stroke-width:1.2;stroke-dasharray:6 4"/>` + D.txt(640, yC - 6, "agora", "tx2", "end");
      sv += D.txt(14, yDe(0) + 4, "gelo", "tx2", "start") + D.txt(14, yDe(100) + 4, "vapor", "tx2", "start");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("Celsius", n2(c, 1) + " °C") + vis("Fahrenheit 1,8·C + 32", n2(r.f, 1) + " °F") + vis("Kelvin C + 273,15", n2(r.k, 2) + " K") + vis("escala X", n2(r.x, 1) + " °X");
    });
  };

  /* ---------- T02 · parede de duas camadas: fluxo de calor e perfil de temperatura ---------- */
  SIM.parede = (el, F) => {
    const W = 680, H = 300;
    let fase = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("camada 1: condutividade k₁ (W/m·K)", "k1", 0.02, 2, 0.01, 0.6)}${sl("camada 1: espessura (cm)", "L1", 1, 30, 1, 15)}${sl("camada 2: condutividade k₂ (W/m·K)", "k2", 0.02, 2, 0.01, 0.04)}${sl("camada 2: espessura (cm)", "L2", 1, 30, 1, 5)}${sl("temperatura de dentro (°C)", "Tq", 0, 40, 1, 22)}${sl("temperatura de fora (°C)", "Tf", -20, 40, 1, 2)}</div>
      <div class="status">Uma parede de 1 m² feita de duas camadas (por exemplo, tijolo e isopor). Em regime estacionário, o mesmo fluxo de calor atravessa as duas camadas, como a mesma corrente atravessa dois resistores em série. Cada camada tem resistência térmica L/(kA); o salto de temperatura em cada uma é proporcional à resistência dela. A camada isolante, mesmo fina, fica com quase toda a queda de temperatura.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.parede._conta = (k1, L1, k2, L2, Tq, Tf) => { const R1 = L1 / k1, R2 = L2 / k2, phi = (Tq - Tf) / (R1 + R2); return { R1, R2, phi, Ti: Tq - phi * R1 }; };
    anima(el, F, (dt) => {
      const k1 = val(el, "k1"), L1 = val(el, "L1") / 100, k2 = val(el, "k2"), L2 = val(el, "L2") / 100, Tq = val(el, "Tq"), Tf = val(el, "Tf"), c = SIM.parede._conta(k1, L1, k2, L2, Tq, Tf);
      mostra(el, ["k1", "k2"], 2); mostra(el, ["L1", "L2"], 0); q("[data-o=Tq]").textContent = n2(Tq, 0) + " °C"; q("[data-o=Tf]").textContent = n2(Tf, 0) + " °C";
      fase = (fase + dt * Math.min(3, Math.abs(c.phi) / 20 + 0.2)) % 1;
      const esc = 600, x1 = 200, xa = x1 + L1 * esc, xb = xa + L2 * esc, yT = (T) => 250 - ((T + 20) / 60) * 200;
      let sv = `<rect x="${x1}" y="40" width="${xa - x1}" height="210" style="fill:color-mix(in srgb,var(--bad) 25%,transparent);stroke:var(--ink3)"/><rect x="${xa}" y="40" width="${xb - xa}" height="210" style="fill:color-mix(in srgb,var(--mA) 22%,transparent);stroke:var(--ink3)"/>`;
      sv += D.txt((x1 + xa) / 2, 32, "camada 1", "tx2") + D.txt((xa + xb) / 2, 20, "camada 2", "tx2") + D.txt(100, 32, "dentro", "tx2") + D.txt(Math.min(620, xb + 60), 32, "fora", "tx2");
      sv += `<path d="M40 ${yT(Tq)} L${x1} ${yT(Tq)} L${xa} ${yT(c.Ti)} L${xb} ${yT(Tf)} L${W - 20} ${yT(Tf)}" style="fill:none;stroke:var(--warn);stroke-width:3"/>`;
      sv += D.txt(50, yT(Tq) - 8, n2(Tq, 0) + " °C", "tx2", "start") + D.txt(xa + 4, yT(c.Ti) - 8, n2(c.Ti, 1) + " °C", "tx2", "start") + D.txt(W - 24, yT(Tf) - 8, n2(Tf, 0) + " °C", "tx2", "end");
      if (Math.abs(c.phi) > 0.01) for (let k = 0; k < 3; k++) { const s = (fase + k / 3) % 1, x = 60 + s * (W - 120), dir = c.phi > 0 ? 1 : -1, xx = dir > 0 ? x : W - x; sv += D.seta(xx, 270, xx + dir * 26, 270, "var(--bad)", 2); }
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("resistências L/(kA): 1 | 2", n2(c.R1, 3) + " | " + n2(c.R2, 3) + " K/W") + vis("fluxo de calor (1 m²)", n2(c.phi, 1) + " W") + vis("temperatura na junção", n2(c.Ti, 1) + " °C") + vis("energia perdida por dia", n2((c.phi * 86400) / 3.6e6, 2) + " kWh");
    });
  };
})();
