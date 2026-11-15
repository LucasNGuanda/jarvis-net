/* Simulações dos experimentos da β 3.4 (EP11–EP18). EP11 máquina de Carnot; */
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

  /* ---------- EP11 · máquina de Carnot com pistão, calor entrando e saindo e um motor real para comparar ---------- */
  SIM.carnotMaquina = (el, F) => {
    const W = 680, H = 330, R = 8.314, g = 5 / 3, VA = 10;
    let s = 0, real = false, rastro = [], ciclos = 0, ultQ = -1;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("fonte quente T_q (K)", "Tq", 350, 1000, 10, 600)}${sl("fonte fria T_f (K)", "Tf", 200, 600, 10, 300)}${sl("expansão isotérmica V_B/V_A", "r", 1.5, 4, 0.1, 2.5)}${sl("velocidade da animação", "vel", 0.2, 2, 0.1, 1)}
      <div class="bts"><button class="bt" data-a="real" aria-pressed="false">Comparar com um motor real</button></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s0) => el.querySelector(s0);
    const fases = ["expansão isotérmica a T_q: entra calor da fonte quente", "expansão adiabática: o gás esfria sem trocar calor", "compressão isotérmica a T_f: sai calor para a fonte fria", "compressão adiabática: o gás esquenta sem trocar calor"];
    /* motor real (modelo endorreversível de Curzon–Ahlborn + 10% de atrito): a troca de calor por condutância finita faz o gás trabalhar entre T_q' < T_q e T_f' > T_f */
    SIM.carnotMaquina._conta = (Tq, Tf, r) => { const L = Math.log(r), x = Math.sqrt(Tf / Tq), Tqi = (Tq * (1 + x)) / 2, Tfi = (Tf * (1 + 1 / x)) / 2, Qq = R * Tq * L, Qf = R * Tf * L, Qqr = R * Tqi * L, Wr = 0.9 * R * (Tqi - Tfi) * L; return { Qq, Qf, W: Qq - Qf, eta: 1 - Tf / Tq, Tqi, Tfi, Qqr, Wr, Qfr: Qqr - Wr, etar: Wr / Qqr, Sger: (Qqr - Wr) / Tf - Qqr / Tq }; };
    q("[data-a=real]").addEventListener("click", (ev) => { real = !real; ev.target.setAttribute("aria-pressed", real); rastro = []; });
    ["Tq", "Tf", "r"].forEach((k) => q(`[data-c=${k}]`).addEventListener("input", () => (rastro = [])));
    anima(el, F, (dt) => {
      let Tq = val(el, "Tq"), Tf = val(el, "Tf"); if (Tf > Tq - 30) { Tf = Tq - 30; q("[data-c=Tf]").value = Tf; }
      const r = val(el, "r"), c = SIM.carnotMaquina._conta(Tq, Tf, r);
      mostra(el, ["Tq", "Tf"], 0); mostra(el, ["r", "vel"], 1);
      const T1 = real ? c.Tqi : Tq, T2 = real ? c.Tfi : Tf, VB = VA * r, k = Math.pow(T1 / T2, 1 / (g - 1)), VC = VB * k, VD = VA * k, P = (V, T) => (0.082 * T) / V;
      s = (s + (dt * val(el, "vel")) / 8) % 1; const fase = Math.floor(s * 4), u = s * 4 - fase;
      if (fase === 0 && ultQ === 3) ciclos++; ultQ = fase;
      let V, T;
      if (fase === 0) { V = VA * Math.pow(VB / VA, u); T = T1; } else if (fase === 1) { V = VB * Math.pow(VC / VB, u); T = T1 * Math.pow(VB / V, g - 1); } else if (fase === 2) { V = VC * Math.pow(VD / VC, u); T = T2; } else { V = VD * Math.pow(VA / VD, u); T = T2 * Math.pow(VD / V, g - 1); }
      const p = P(V, T);
      rastro.push([V, p, fase]); if (rastro.length > 900) rastro.shift();
      /* diagrama p × V (eixos em escala log para caber ciclos com razões grandes) */
      const gx = 40, gy = 290, gw = 300, gh = 250, lv0 = Math.log(VA * 0.8), VCid = VB * Math.pow(Tq / Tf, 1 / (g - 1)), lv1 = Math.log(Math.max(VCid, VA * 3) * 1.15), lp0 = Math.log(P(VCid, Tf) * 0.8), lp1 = Math.log(P(VA, Tq) * 1.2);
      const X = (v) => gx + ((Math.log(v) - lv0) / (lv1 - lv0)) * gw, Y = (pp) => gy - ((Math.log(pp) - lp0) / (lp1 - lp0)) * gh;
      let sv = D.seta(gx, gy, gx + gw + 10, gy, "var(--ink2)", 1.4) + D.seta(gx, gy, gx, gy - gh - 10, "var(--ink2)", 1.4) + D.txt(gx + gw + 10, gy + 16, "V", "txm", "end") + D.txt(gx + 6, gy - gh - 2, "p", "txm", "start") + D.txt(gx + gw, gy + 30, "(eixos em escala log)", "tx2", "end");
      if (real) { const ref = []; for (let i = 0; i <= 30; i++) { const v = VA * Math.pow(VB / VA, i / 30); ref.push([v, P(v, Tq)]); } for (let i = 0; i <= 30; i++) { const kk = Math.pow(Tq / Tf, 1.5), v = VB * Math.pow(kk, i / 30); ref.push([v, P(VB, Tq) * Math.pow(VB / v, g)]); } for (let i = 0; i <= 30; i++) { const kk = Math.pow(Tq / Tf, 1.5), v = VB * kk * Math.pow(VA * kk / (VB * kk), i / 30); ref.push([v, P(v, Tf)]); } for (let i = 0; i <= 30; i++) { const kk = Math.pow(Tq / Tf, 1.5), v = VA * kk * Math.pow(1 / kk, i / 30); ref.push([v, P(VA * kk, Tf) * Math.pow((VA * kk) / v, g)]); } let dd = ""; ref.forEach(([v, pp], i) => (dd += (i ? "L" : "M") + X(v).toFixed(1) + " " + Y(pp).toFixed(1))); sv += `<path d="${dd}" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/>` + D.txt(gx + gw - 4, gy - gh + 12, "tracejado: Carnot ideal", "tx2", "end"); }
      const cores = ["var(--bad)", "var(--ink2)", "var(--mA)", "var(--ink2)"]; let d = "", fa = -1;
      rastro.forEach(([v, pp, ff], i) => { if (ff !== fa) { if (d) sv += `<path d="${d}" style="fill:none;stroke:${cores[fa]};stroke-width:2.5"/>`; d = i ? `M${X(rastro[i - 1][0]).toFixed(1)} ${Y(rastro[i - 1][1]).toFixed(1)}` : ""; fa = ff; } d += (d ? "L" : "M") + X(v).toFixed(1) + " " + Y(pp).toFixed(1); });
      if (d) sv += `<path d="${d}" style="fill:none;stroke:${cores[fa]};stroke-width:2.5"/>`;
      sv += `<circle cx="${X(V)}" cy="${Y(p)}" r="6" style="fill:var(--warn)"/>`;
      /* cilindro com pistão: altura proporcional a log(V) */
      const cx = 400, cw = 90, base = 260, hmin = 40, hmax = 190, hgas = hmin + ((Math.log(V) - lv0) / (lv1 - lv0)) * (hmax - hmin), tcor = Math.round(Math.min(100, Math.max(0, ((T - 150) / 900) * 100)));
      sv += `<path d="M${cx} ${base - hmax - 30} L${cx} ${base} L${cx + cw} ${base} L${cx + cw} ${base - hmax - 30}" style="fill:none;stroke:var(--ink2);stroke-width:3"/>`;
      sv += `<rect x="${cx + 2}" y="${base - hgas}" width="${cw - 4}" height="${hgas - 1}" style="fill:color-mix(in srgb,var(--bad) ${tcor}%,var(--mA));opacity:.45"/><rect x="${cx + 2}" y="${base - hgas - 10}" width="${cw - 4}" height="10" style="fill:var(--ink3)"/><line x1="${cx + cw / 2}" x2="${cx + cw / 2}" y1="${base - hgas - 10}" y2="${base - hgas - 40}" style="stroke:var(--ink3);stroke-width:4"/>`;
      sv += D.txt(cx + cw / 2, base - hgas / 2 + 4, n2(T, 0) + " K", "tx2");
      const fonte = fase === 0 ? ["var(--bad)", "fonte quente " + n2(Tq, 0) + " K"] : fase === 2 ? ["var(--mA)", "fonte fria " + n2(Tf, 0) + " K"] : ["var(--ink3)", "isolante (Q = 0)"];
      sv += `<rect x="${cx - 10}" y="${base + 4}" width="${cw + 20}" height="22" rx="3" style="fill:color-mix(in srgb,${fonte[0]} 45%,transparent);stroke:${fonte[0]}"/>` + D.txt(cx + cw / 2, base + 42, fonte[1], "tx2");
      if (fase === 0) for (let i = 0; i < 3; i++) { const yy = base + 22 - ((u * 3 + i / 3) % 1) * 40; sv += D.seta(cx + 20 + i * 25, yy + 10, cx + 20 + i * 25, yy - 4, "var(--bad)", 2); }
      if (fase === 2) for (let i = 0; i < 3; i++) { const yy = base - 14 + ((u * 3 + i / 3) % 1) * 40; sv += D.seta(cx + 20 + i * 25, yy - 10, cx + 20 + i * 25, yy + 4, "var(--mA)", 2); }
      /* barras de rendimento */
      const bx = 540, bh = 220, by = 270;
      const barra = (x, eta, cor, rot) => `<rect x="${x}" y="${by - bh * eta}" width="40" height="${bh * eta}" style="fill:color-mix(in srgb,${cor} 55%,transparent);stroke:${cor}"/>` + D.txt(x + 20, by + 16, rot, "tx2") + D.txt(x + 20, by - bh * eta - 6, n2(eta * 100, 1) + "%", "tx2");
      sv += `<line x1="${bx - 6}" x2="${bx + 110}" y1="${by - bh}" y2="${by - bh}" style="stroke:var(--ink3);stroke-dasharray:3 3"/>` + D.txt(bx + 110, by - bh - 6, "100%", "tx2", "end") + barra(bx, c.eta, "var(--warn)", "Carnot") + (real ? barra(bx + 60, c.etar, "var(--bad)", "real") : "");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=st]").innerHTML = `<b>Agora:</b> ${fases[fase]}. ${real ? `Motor real: o calor só passa com uma diferença de temperatura, então o gás trabalha entre ${n2(c.Tqi, 0)} K e ${n2(c.Tfi, 0)} K (e perde 10% do trabalho em atrito). Rende ${n2(c.etar * 100, 1)}% e gera ${n2(c.Sger, 2)} J/K de entropia por ciclo.` : "Ciclo ideal e reversível: rendimento máximo possível entre essas duas fontes."} Ciclos completos: ${ciclos}.`;
      q("[data-v=lt]").innerHTML = vis("calor que entra Q_q", n2(real ? c.Qqr : c.Qq, 0) + " J") + vis("calor que sai Q_f", n2(real ? c.Qfr : c.Qf, 0) + " J") + vis("trabalho por ciclo W", n2(real ? c.Wr : c.W, 0) + " J") + vis("rendimento W/Q_q (limite 1 − T_f/T_q)", n2((real ? c.etar : c.eta) * 100, 1) + "% ≤ " + n2(c.eta * 100, 1) + "%");
    });
  };
})();
