/* Curva característica U × i de três componentes.
   - Resistor ôhmico: U = R i  (R = 400 Ω)
   - Lâmpada de filamento: lei empírica U = U0 (i/i0)^(1/0,6)  (U0 = 12 V em i0 = 30 mA). R cresce porque o filamento esquenta.
   - LED vermelho (Shockley): U = n Vt ln(1 + i/Is)
   Mostra a resistência "estática" U/i (reta pela origem) e a "dinâmica" dU/di (tangente). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const A = 2 * 0.025852, IS = 0.02 / Math.expm1(2.0 / A);
  const COMP = {
    resistor: { nome: "Resistor (400 Ω)", U: (i) => 400 * i, r: () => 400 },
    lampada: { nome: "Lâmpada de filamento", U: (i) => 12 * Math.pow(i / 0.03, 1 / 0.6), r: (i) => (12 * Math.pow(i / 0.03, 1 / 0.6)) / (0.6 * i) },
    led: { nome: "LED vermelho", U: (i) => A * Math.log1p(i / IS), r: (i) => A / (i + IS) },
  };
  SIM.curvas = (el, F) => {
    const W = 620, H = 340, x0 = 60, y0 = 300, w = 520, h = 270, IMAX = 0.035, UMAX = 16;
    const sx = (i) => x0 + (i / IMAX) * w, sy = (U) => y0 - (U / UMAX) * h;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" aria-label="gráfico U por i"><g class="base"></g><g class="din"></g></svg></div>
      <div class="leitor"><div class="vis"><small>i</small><b data-v="i"></b></div><div class="vis"><small>U</small><b data-v="U"></b></div><div class="vis"><small>R = U/i (estática)</small><b data-v="R"></b></div><div class="vis"><small>r = dU/di (dinâmica)</small><b data-v="r"></b></div></div>
      <div class="ctrls"><div class="ctrl"><label>Corrente i</label><input type="range" min="0.5" max="35" step="0.1" value="15"><output></output></div>
      <div class="bts">${Object.entries(COMP).map(([k, c], j) => `<button class="bt peq" data-k="${k}" aria-pressed="${j === 0}">${c.nome}</button>`).join("")}</div></div>
      <div class="status" data-v="st"></div>`);
    let k = "resistor", i = 0.015;
    const q = (s) => el.querySelector(s);
    function base() {
      let g = `<defs><clipPath id="clipc"><rect x="${x0}" y="${y0 - h}" width="${w}" height="${h}"/></clipPath></defs>`;
      for (let U = 0; U <= UMAX; U += 2) g += `<line class="grade" x1="${x0}" x2="${x0 + w}" y1="${sy(U)}" y2="${sy(U)}"/>${D.txt(x0 - 8, sy(U) + 4, U, "tx2", "end")}`;
      for (let m = 0; m <= 35; m += 5) g += `<line class="grade" y1="${y0}" y2="${y0 - h}" x1="${sx(m / 1000)}" x2="${sx(m / 1000)}"/>${D.txt(sx(m / 1000), y0 + 18, m, "tx2")}`;
      g += D.eixos({ x0, y0, w: w + 14, h: h + 14 }) + D.txt(x0 + w + 10, y0 + 34, "i (mA)", "tx2", "end") + D.txt(x0 - 8, y0 - h - 14, "U (V)", "tx2", "end");
      Object.entries(COMP).forEach(([kk, c]) => {
        let d = ""; for (let n = 0; n <= 300; n++) { const ii = (IMAX * n) / 300; d += (n ? "L" : "M") + sx(ii).toFixed(1) + " " + sy(Math.min(c.U(ii), UMAX * 1.2)).toFixed(1); }
        g += `<path d="${d}" clip-path="url(#clipc)" style="fill:none;stroke:${kk === k ? "var(--mod)" : "var(--ink3)"};stroke-width:${kk === k ? 3 : 1.3};opacity:${kk === k ? 1 : 0.5}"/>`;
      });
      q(".base").innerHTML = g;
    }
    function din() {
      const c = COMP[k], U = c.U(i), r = c.r(i), R = U / i;
      let g = "";
      // secante pela origem (R estática) e tangente (r dinâmica)
      g += `<line x1="${sx(0)}" y1="${sy(0)}" x2="${sx(IMAX)}" y2="${sy(R * IMAX)}" clip-path="url(#clipc)" style="stroke:var(--warn);stroke-width:1.6;stroke-dasharray:6 5"/>`;
      g += `<line x1="${sx(i - 0.01)}" y1="${sy(U - 0.01 * r)}" x2="${sx(i + 0.01)}" y2="${sy(U + 0.01 * r)}" clip-path="url(#clipc)" style="stroke:var(--ok);stroke-width:2"/>`;
      if (U <= UMAX) g += `<line class="ln2" x1="${sx(i)}" x2="${sx(i)}" y1="${y0}" y2="${sy(U)}" style="stroke-dasharray:3 4"/><circle cx="${sx(i)}" cy="${sy(U)}" r="6.5" style="fill:var(--mod);stroke:var(--card);stroke-width:2.5"/>`;
      g += `<g transform="translate(${x0 + 14} ${y0 - h + 14})"><line x1="0" x2="26" y1="0" y2="0" style="stroke:var(--warn);stroke-width:1.6;stroke-dasharray:6 5"/>${D.txt(32, 4, "R = U/i (reta pela origem)", "tx2", "start")}<line x1="0" x2="26" y1="20" y2="20" style="stroke:var(--ok);stroke-width:2"/>${D.txt(32, 24, "r = dU/di (tangente)", "tx2", "start")}</g>`;
      q(".din").innerHTML = g;
      q("output").textContent = F.t(i * 1000, 1) + " mA";
      q('[data-v="i"]').textContent = F.t(i * 1000, 1) + " mA";
      q('[data-v="U"]').textContent = F.t(U, 3) + " V";
      q('[data-v="R"]').textContent = F.t(R, 0) + " Ω";
      q('[data-v="r"]').textContent = F.t(r, r < 10 ? 2 : 0) + " Ω";
      q('[data-v="st"]').innerHTML = k === "resistor" ? "Ôhmico: a reta passa pela origem, então U/i e dU/di são iguais e não dependem de i."
        : k === "lampada" ? `Não ôhmico: o filamento esquenta e a resistência cresce com a corrente. A tangente é mais inclinada que a secante: r = U/(0,6 i) ≈ 1,67 R. ${U > UMAX ? "<b>(Ponto fora do gráfico.)</b>" : ""}`
        : `Não ôhmico: acima de ~2 V a tensão quase não muda e a corrente dispara. A resistência dinâmica é de poucos ohms; a estática é de ~${F.t(R, 0)} Ω. ${i > 0.03 ? '<b class="bad">Acima de 30 mA o LED queima.</b>' : ""}`;
    }
    q("input").addEventListener("input", (e) => { i = +e.target.value / 1000; din(); });
    el.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => { k = b.dataset.k; el.querySelectorAll("[data-k]").forEach((x) => x.setAttribute("aria-pressed", x === b)); base(); din(); }));
    base(); din();
  };
})();
