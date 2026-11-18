/* Bancada do fio: 2ª lei de Ohm  R = ρ L / A,  A = π d²/4,  e  ρ(θ) = ρ20 [1 + α (θ − 20 °C)].
   Valores típicos a 20 °C (ordens de grandeza de tabelas usuais). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const MAT = {
    cobre: { n: "Cobre", rho: 1.69e-8, a: 4.3e-3, cor: "#d9864a" },
    aluminio: { n: "Alumínio", rho: 2.75e-8, a: 4.4e-3, cor: "#b9c2cc" },
    tungstenio: { n: "Tungstênio", rho: 5.25e-8, a: 4.5e-3, cor: "#8f9aa6" },
    ferro: { n: "Ferro", rho: 9.68e-8, a: 6.5e-3, cor: "#7d7466" },
    constantan: { n: "Constantan", rho: 4.9e-7, a: 1e-5, cor: "#c9a86a" },
    nicromo: { n: "Nicromo", rho: 1.10e-6, a: 4e-4, cor: "#a3a08f" },
  };
  SIM.MATERIAIS = MAT;
  const fmtR = (F, R) => { const [v, u] = R >= 1e3 ? [R / 1e3, " kΩ"] : R >= 1 ? [R, " Ω"] : [R * 1e3, " mΩ"]; return F.t(v, Math.max(0, 2 - Math.floor(Math.log10(Math.abs(v) || 1)))) + u; }; /* 3 algarismos significativos */
  /* nome: "Bancada do fio: R = ρL/A" · matéria: Física · tema: C07 */
  SIM.fio = (el, F) => {
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 640 190" width="640" aria-label="fio"><g class="g"></g></svg></div>
      <div class="leitor"><div class="vis"><small>ρ (a θ)</small><b data-v="rho"></b></div><div class="vis"><small>Área A</small><b data-v="A"></b></div><div class="vis"><small>Resistência R</small><b data-v="R"></b></div><div class="vis"><small>i com 1,5 V</small><b data-v="i"></b></div></div>
      <div class="ctrls">
        <div class="ctrl"><label>Comprimento L</label><input type="range" min="0.1" max="10" step="0.1" value="1" data-c="L"><output data-o="L"></output></div>
        <div class="ctrl"><label>Diâmetro d</label><input type="range" min="0.1" max="2" step="0.01" value="0.5" data-c="d"><output data-o="d"></output></div>
        <div class="ctrl"><label>Temperatura θ</label><input type="range" min="20" max="400" step="1" value="20" data-c="T"><output data-o="T"></output></div>
        <div class="bts"><button class="bt peq" data-a="esticar">↔ Esticar ×2 (mesmo volume)</button><button class="bt peq" data-a="reset">Voltar ao início</button></div>
        <div class="bts" style="grid-column:1/-1">${Object.entries(MAT).map(([k, m], j) => `<button class="bt peq" data-m="${k}" aria-pressed="${k === "nicromo"}">${m.n}</button>`).join("")}</div>
      </div><div class="status" data-v="st"></div>`);
    const st = { L: 1, d: 0.5, T: 20, m: "nicromo" };
    const q = (s) => el.querySelector(s);
    const ini = { ...st };
    function desenha() {
      const M = MAT[st.m];
      const rho = M.rho * (1 + M.a * (st.T - 20)), A = (Math.PI * Math.pow(st.d * 1e-3, 2)) / 4, R = (rho * st.L) / A;
      const comp = 60 + 500 * Math.min(1, st.L / 10), raio = 4 + 16 * (st.d / 2);
      const brilho = Math.max(0, Math.min(1, (st.T - 300) / 100)); // começa a avermelhar perto de 400 °C
      q(".g").innerHTML = `<g style="--mod:${M.cor}">${D.cilindro(320 - comp / 2, 85, comp, raio)}</g>` +
        (brilho > 0 ? `<rect x="${320 - comp / 2}" y="${85 - raio}" width="${comp}" height="${2 * raio}" fill="#ff5a1a" opacity="${0.5 * brilho}"/>` : "") +
        `<path class="ln2" d="M${320 - comp / 2} ${120 + raio} v8 H${320 + comp / 2} v-8"/>` + D.txt(320, 150 + raio, `L = ${F.t(st.L, 1)} m`, "tx") +
        `<path class="ln2" d="M${320 + comp / 2 + 14} ${85 - raio} h6 V${85 + raio} h-6"/>` + D.txt(320 + comp / 2 + 26, 90, `d = ${F.t(st.d, 2)} mm`, "tx2", "start");
      q('[data-o="L"]').textContent = F.t(st.L, 1) + " m";
      q('[data-o="d"]').textContent = F.t(st.d, 2) + " mm";
      q('[data-o="T"]').textContent = st.T + " °C";
      q('[data-v="rho"]').textContent = F.t(rho * 1e8, rho * 1e8 >= 100 ? 0 : rho * 1e8 >= 10 ? 1 : 2) + " × 10⁻⁸ Ω·m"; /* 3 algarismos */
      q('[data-v="A"]').textContent = F.t(A * 1e6, 3) + " mm²";
      q('[data-v="R"]').textContent = fmtR(F, R);
      const i = 1.5 / R;
      q('[data-v="i"]').textContent = i >= 1 ? F.t(i, i >= 10 ? 1 : 2) + " A" : F.t(i * 1000, i * 1000 >= 100 ? 0 : 1) + " mA"; /* 3 algarismos */
      q('[data-v="st"]').innerHTML = `${M.n}: ρ₂₀ = ${F.t(M.rho * 1e8, M.rho * 1e8 >= 100 ? 0 : M.rho * 1e8 >= 10 ? 1 : 2)} × 10⁻⁸ Ω·m, α = ${F.cient(M.a, 1)} /°C. ` +
        (i > 10 ? `<b class="warn">Com uma pilha real de 1,5 V a corrente não chegaria a ${F.t(i, 0)} A:</b> a resistência interna da pilha (C10) mandaria antes.` : "Dobre L: R dobra. Dobre d: A fica 4 vezes maior e R cai para 1/4.") +
        (st.T > 20 && st.m !== "constantan" ? " O modelo linear em θ é aproximado: vale bem para variações de algumas centenas de graus." : "");
    }
    el.querySelectorAll("[data-c]").forEach((r) => r.addEventListener("input", () => { st[r.dataset.c] = +r.value; desenha(); }));
    el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { st.m = b.dataset.m; el.querySelectorAll("[data-m]").forEach((x) => x.setAttribute("aria-pressed", x === b)); desenha(); }));
    const sinc = () => el.querySelectorAll("[data-c]").forEach((r) => (r.value = st[r.dataset.c]));
    q('[data-a="esticar"]').addEventListener("click", () => {
      if (st.L * 2 > 10 || st.d / Math.SQRT2 < 0.1) { q('[data-v="st"]').innerHTML = "<b>Não cabe mais na bancada:</b> volte ao início."; return; }
      st.L *= 2; st.d /= Math.SQRT2; sinc(); desenha();
      q('[data-v="st"]').innerHTML += " <b>Esticou ×2:</b> L dobrou e, com o volume fixo, A caiu pela metade. Resultado: R ficou 4 vezes maior.";
    });
    q('[data-a="reset"]').addEventListener("click", () => { Object.assign(st, ini); sinc(); desenha(); });
    desenha();
  };
})();
