/* Simulações da aba Experimental (módulos FEm, FEg, FEr). FE01 lendo uma régua; */
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
})();
