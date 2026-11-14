/* Simulações da Termodinâmica (módulo T). T01 quatro termômetros; */
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
})();
