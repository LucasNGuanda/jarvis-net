/* Simulações da Termodinâmica (módulo T). T01 quatro termômetros; T02 parede de duas camadas; T03 chapa com furo e bimetálica; T04 calorímetro; T04b curva de aquecimento; T05 gás ideal p × V; T05b gás de moléculas 2D; T06 dois corpos em contato; T07 os quatro processos; */
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

  /* ---------- T03 · chapa com furo e lâmina bimetálica aquecidas (dilatação exagerada no desenho) ---------- */
  SIM.dilatacao = (el, F) => {
    const W = 680, H = 300, alfas = { aco: 12e-6, aluminio: 23e-6, cobre: 17e-6, vidro: 9e-6, invar: 1.2e-6 };
    let mat = "aco";
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("variação de temperatura ΔT (°C)", "dT", -100, 300, 5, 150)}${sl("lado da chapa L₀ (cm)", "L", 10, 100, 1, 50)}${sl("exagero do desenho (×)", "ex", 1, 300, 1, 150)}
      <div class="bts">${botoes([["aco", "aço"], ["aluminio", "alumínio"], ["cobre", "cobre"], ["vidro", "vidro"], ["invar", "invar"]], "mat", "aco")}</div></div>
      <div class="status">A chapa (à esquerda) dilata em todas as direções, e o furo dilata junto, como se fosse feito do mesmo material: tudo se amplia na mesma proporção, como uma foto ampliada. A lâmina bimetálica (à direita) é aço colado com alumínio: o alumínio dilata mais, e a lâmina se curva para o lado do aço. No desenho a dilatação está exagerada; os números são os reais.</div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "mat", (k) => (mat = k));
    SIM.dilatacao._conta = (alfa, L0, dT) => ({ dL: L0 * alfa * dT, dA: L0 * L0 * 2 * alfa * dT, dV: L0 ** 3 * 3 * alfa * dT, fator: 1 + alfa * dT });
    anima(el, F, () => {
      const dT = val(el, "dT"), L0 = val(el, "L"), ex = val(el, "ex"), a = alfas[mat], c = SIM.dilatacao._conta(a, L0, dT);
      q("[data-o=dT]").textContent = n2(dT, 0) + " °C"; mostra(el, ["L"], 0); q("[data-o=ex]").textContent = "×" + n2(ex, 0);
      const s = 1 + Math.max(-0.3, Math.min(0.5, a * dT * ex)), lado = 160 * s, cx = 190, cy = 150, furo = 40 * s;
      let sv = `<rect x="${cx - 80}" y="${cy - 80}" width="160" height="160" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/><circle cx="${cx}" cy="${cy}" r="40" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/>`;
      sv += `<path d="M${cx - lado / 2} ${cy - lado / 2} h${lado} v${lado} h${-lado} Z M${cx + furo} ${cy} A${furo} ${furo} 0 1 0 ${cx - furo} ${cy} A${furo} ${furo} 0 1 0 ${cx + furo} ${cy} Z" style="fill:color-mix(in srgb,${dT >= 0 ? "var(--bad)" : "var(--mA)"} ${Math.round(15 + Math.abs(dT) / 15)}%,transparent);stroke:var(--mT);stroke-width:2;fill-rule:evenodd"/>`;
      sv += D.txt(cx, 284, "tracejado: antes", "tx2");
      /* lâmina bimetálica: aço (12e-6) em cima, alumínio (23e-6) embaixo, comprimento 200 px, espessura total 1 mm */
      const x0 = 440, y0 = 150, Lb = 200;
      let kpx = ((3 * (23e-6 - 12e-6) * dT) / (2 * 1e-3) / 4000) * (ex / 40); /* curvatura (1/px): lâmina de 5 cm e 1 mm, exagerada */
      kpx = Math.max(-3 / Lb, Math.min(3 / Lb, kpx));
      let d1 = "", d2 = "";
      for (let i = 0; i <= 40; i++) { const sa = (Lb * i) / 40, th = sa * kpx, x = Math.abs(kpx) < 1e-7 ? x0 + sa : x0 + Math.sin(th) / kpx, y = Math.abs(kpx) < 1e-7 ? y0 : y0 - (1 - Math.cos(th)) / kpx, nx = -Math.sin(th), ny = -Math.cos(th); d1 += (i ? "L" : "M") + (x + 4 * nx).toFixed(1) + " " + (y + 4 * ny).toFixed(1); d2 += (i ? "L" : "M") + (x - 4 * nx).toFixed(1) + " " + (y - 4 * ny).toFixed(1); }
      sv += `<rect x="${x0 - 14}" y="${y0 - 30}" width="14" height="60" style="fill:var(--ink3)"/><path d="${d1}" style="fill:none;stroke:var(--ink2);stroke-width:8"/><path d="${d2}" style="fill:none;stroke:var(--warn);stroke-width:8"/>`;
      sv += D.txt(x0 + 100, 284, "aço (cinza) + alumínio (laranja)", "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("α do material", n2(a * 1e6, 1) + " × 10⁻⁶ /°C") + vis("ΔL do lado (αL₀ΔT)", n2(c.dL * 10, 3) + " mm") + vis("ΔA da chapa (2αA₀ΔT)", n2(c.dA, 2) + " cm²") + vis("diâmetro do furo multiplicado por", n2(c.fator, 5));
    });
  };

  /* ---------- T04 · calorímetro: água quente + gelo a 0 °C ---------- */
  SIM.calorimetro = (el, F) => {
    const W = 680, H = 300;
    let t = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("massa de água (g)", "ma", 50, 500, 10, 200)}${sl("temperatura da água (°C)", "Ta", 1, 100, 1, 30)}${sl("massa de gelo a 0 °C (g)", "mg", 0, 300, 5, 100)}
      <div class="bts"><button class="bt pri" data-a="re">Misturar de novo</button></div></div>
      <div class="status">Num calorímetro ideal (nada de calor entra ou sai), a água esfria e o gelo recebe esse calor: primeiro para derreter (80 cal por grama, sem mudar de temperatura), depois para esquentar. O primeiro passo é sempre testar: o calor que a água libera até chegar a 0 °C basta para derreter todo o gelo? Se não bastar, sobra gelo e a mistura fica a 0 °C.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.calorimetro._conta = (ma, Ta, mg) => { const disp = ma * Ta, prec = 80 * mg; if (disp <= prec) return { T: 0, derretido: disp / 80, sobra: mg - disp / 80, disp, prec }; return { T: (disp - prec) / (ma + mg), derretido: mg, sobra: 0, disp, prec }; };
    q("[data-a=re]").addEventListener("click", () => (t = 0));
    ["ma", "Ta", "mg"].forEach((k) => q(`[data-c=${k}]`).addEventListener("input", () => (t = 0)));
    anima(el, F, (dt) => {
      const ma = val(el, "ma"), Ta = val(el, "Ta"), mg = val(el, "mg"), c = SIM.calorimetro._conta(ma, Ta, mg);
      mostra(el, ["ma", "mg"], 0); q("[data-o=Ta]").textContent = n2(Ta, 0) + " °C";
      t = Math.min(1, t + dt / 3); const s = 1 - Math.pow(1 - t, 2);
      const Tnow = Ta + (c.T - Ta) * s, geloNow = mg - (mg - c.sobra) * s;
      const x0 = 150, y0 = 40, w = 220, h = 220, nivel = Math.min(0.9, (ma + mg) / 900 + 0.2);
      let sv = D.copo(x0, y0, w, h, nivel, Tnow > 40 ? "var(--bad)" : "var(--mA)");
      const nCub = Math.round(geloNow / 20);
      for (let i = 0; i < nCub; i++) { const cx = x0 + 20 + (i % 6) * 32, cy = y0 + h - h * nivel + 4 + Math.floor(i / 6) * 26; sv += `<rect x="${cx}" y="${cy}" width="24" height="20" rx="3" style="fill:color-mix(in srgb,var(--ink) 55%,transparent);stroke:var(--ink2)"/>`; }
      sv += D.termo(430, 250, 200, Math.max(0, Math.min(1, Tnow / 100)), n2(Tnow, 1) + " °C");
      /* barras de energia */
      const bx = 520, esc = 180 / Math.max(c.disp, c.prec, 1);
      sv += `<rect x="${bx}" y="${250 - c.disp * esc}" width="34" height="${c.disp * esc}" style="fill:color-mix(in srgb,var(--bad) 50%,transparent)"/><rect x="${bx + 50}" y="${250 - c.prec * esc}" width="34" height="${c.prec * esc}" style="fill:color-mix(in srgb,var(--mA) 50%,transparent)"/>`;
      sv += D.txt(bx + 17, 268, "água até 0 °C", "tx2") + D.txt(bx + 67, 284, "derreter tudo", "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("calor da água até 0 °C (m·c·ΔT)", n2(c.disp, 0) + " cal") + vis("calor para derreter todo o gelo (m·L)", n2(c.prec, 0) + " cal") + vis("temperatura final", n2(c.T, 2) + " °C") + vis("gelo que sobra", n2(c.sobra, 1) + " g");
    });
  };

  /* ---------- T04b · curva de aquecimento com potência constante e perdas (Newton) ---------- */
  SIM.aquecimento = (el, F) => {
    const W = 680, H = 300;
    let t, Q, hist;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("massa de gelo (g)", "m", 50, 500, 10, 200)}${sl("potência do aquecedor (cal/s)", "P", 50, 500, 10, 200)}${sl("perdas para o ar a 20 °C (cal/s por °C)", "h", 0, 4, 0.1, 0)}
      <div class="bts"><button class="bt pri" data-a="re">Recomeçar</button></div></div>
      <div class="status">Gelo a −20 °C recebe calor a uma taxa constante. Nos trechos inclinados, a temperatura sobe com inclinação P/(mc): o gelo (c = 0,5) esquenta duas vezes mais rápido que a água (c = 1). Nos patamares, o calor vai para a mudança de fase. Com perdas (lei de Newton: perda proporcional a T − 20 °C), a curva se achata e pode nem chegar a ferver: o equilíbrio é onde a potência que entra iguala a que sai.</div>`);
    const q = (s) => el.querySelector(s);
    /* estado pela energia recebida Q (cal) a partir de −20 °C */
    const estado = (m, Qr) => { const e1 = m * 0.5 * 20, e2 = e1 + 80 * m, e3 = e2 + 100 * m, e4 = e3 + 540 * m; if (Qr < e1) return [-20 + Qr / (m * 0.5), "gelo"]; if (Qr < e2) return [0, "derretendo: " + n2(((Qr - e1) / (80 * m)) * 100, 0) + "%"]; if (Qr < e3) return [(Qr - e2) / m, "água"]; if (Qr < e4) return [100, "fervendo: " + n2(((Qr - e3) / (540 * m)) * 100, 0) + "% virou vapor"]; return [100 + (Qr - e4) / (0.48 * m), "vapor"]; };
    SIM.aquecimento._estado = estado;
    SIM.aquecimento._tempos = (m, P) => ({ t1: (m * 10) / P, t2: (m * 90) / P, t3: (m * 190) / P, t4: (m * 730) / P });
    const reinicia = () => { t = 0; Q = 0; hist = []; };
    reinicia();
    q("[data-a=re]").addEventListener("click", reinicia);
    ["m", "P", "h"].forEach((k) => q(`[data-c=${k}]`).addEventListener("input", reinicia));
    anima(el, F, (dt) => {
      const m = val(el, "m"), P = val(el, "P"), h = val(el, "h"), tp = SIM.aquecimento._tempos(m, P), tmax = tp.t4 * 1.1;
      mostra(el, ["m", "P"], 0); mostra(el, ["h"], 1);
      const passo = (tmax / 12) * dt, n = 20;
      for (let i = 0; i < n && t < tmax; i++) { const [T] = estado(m, Q); Q += (P - h * (T - 20)) * (passo / n); if (Q < 0) Q = 0; t += passo / n; }
      const [T, fase] = estado(m, Q); hist.push([t, T]);
      const gx = 70, gy = 250, gw = 560, gh = 200, X = (tt) => gx + (tt / tmax) * gw, Y = (TT) => gy - ((TT + 20) / 140) * gh;
      let sv = `<line x1="${gx}" x2="${gx + gw}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--line2);stroke-dasharray:3 4"/><line x1="${gx}" x2="${gx + gw}" y1="${Y(100)}" y2="${Y(100)}" style="stroke:var(--line2);stroke-dasharray:3 4"/>`;
      sv += D.seta(gx, gy + 4, gx, gy - gh - 10, "var(--ink2)", 1.4) + D.seta(gx, Y(-20), gx + gw + 12, Y(-20), "var(--ink2)", 1.4) + D.txt(gx - 6, Y(0) + 4, "0", "tx2", "end") + D.txt(gx - 6, Y(100) + 4, "100", "tx2", "end") + D.txt(gx - 6, Y(-20) + 4, "−20", "tx2", "end") + D.txt(gx + gw, Y(-20) + 18, "tempo", "tx2", "end") + D.txt(gx + 6, gy - gh - 4, "θ (°C)", "tx2", "start");
      let d = ""; hist.forEach(([tt, TT], i) => (d += (i ? "L" : "M") + X(tt).toFixed(1) + " " + Y(Math.min(TT, 118)).toFixed(1)));
      sv += `<path d="${d}" style="fill:none;stroke:var(--mT);stroke-width:2.5"/>`;
      if (h > 0) { const Teq = 20 + P / h; if (Teq < 118) sv += `<line x1="${gx}" x2="${gx + gw}" y1="${Y(Teq)}" y2="${Y(Teq)}" style="stroke:var(--warn);stroke-dasharray:6 4"/>` + D.txt(gx + gw, Y(Teq) - 6, "equilíbrio com perdas", "tx2", "end"); }
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("temperatura", n2(T, 1) + " °C") + vis("estado", fase) + vis("sem perdas: começa a ferver em", n2(tp.t3, 0) + " s") + vis("sem perdas: termina de ferver em", n2(tp.t4, 0) + " s");
    });
  };

  /* ---------- T05 · gás ideal no cilindro e no diagrama p × V ---------- */
  SIM.gas = (el, F) => {
    const W = 680, H = 320, R = 0.082;
    let modo = "T", rastro = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("quantidade de gás n (mol)", "n", 0.2, 2, 0.05, 1)}${sl("volume V (L)", "V", 5, 50, 0.5, 24.6)}${sl("temperatura T (K)", "T", 100, 600, 5, 300)}
      <div class="bts">${botoes([["T", "isotérmica (T fixa)"], ["p", "isobárica (p fixa)"], ["V", "isocórica (V fixo)"]], "modo", "T")}<button class="bt" data-a="lp">Limpar rastro</button></div></div>
      <div class="status">Escolha o que fica fixo e mexa nos controles: o programa ajusta o resto pela equação de Clapeyron, pV = nRT (R = 0,082 atm·L/mol·K). No diagrama p × V, as curvas tracejadas são isotermas (hipérboles, pV = constante). Isotérmica anda sobre uma delas; isobárica é uma reta horizontal; isocórica, uma reta vertical.</div>`);
    const q = (s) => el.querySelector(s);
    let p = (1 * R * 300) / 24.6;
    SIM.gas._conta = (n, V, T) => (n * R * T) / V;
    const trava = () => { q("[data-c=T]").disabled = modo === "T"; q("[data-c=V]").disabled = modo === "V"; };
    liga(el, "modo", (k) => { modo = k; p = SIM.gas._conta(val(el, "n"), val(el, "V"), val(el, "T")); trava(); });
    q("[data-a=lp]").addEventListener("click", () => (rastro = []));
    /* na isobárica, mexer em V muda T (e vice-versa) para manter p; nas outras, a pressão é que se ajusta */
    const ajusta = (quem) => {
      if (modo !== "p") return;
      const n = val(el, "n");
      let V = val(el, "V"), T = val(el, "T");
      if (quem === "V") T = (p * V) / (n * R); else V = (n * R * T) / p;
      q("[data-c=V]").value = Math.max(5, Math.min(50, V)); q("[data-c=T]").value = Math.max(100, Math.min(600, T));
    };
    ["n", "V", "T"].forEach((k) => q(`[data-c=${k}]`).addEventListener("input", () => ajusta(k)));
    trava();
    anima(el, F, () => {
      const n = val(el, "n"), V = val(el, "V"), T = val(el, "T"); p = (n * R * T) / V;
      mostra(el, ["n"], 2); mostra(el, ["V"], 1); mostra(el, ["T"], 0);
      if (!rastro.length || Math.hypot(rastro[rastro.length - 1][0] - V, rastro[rastro.length - 1][1] - p) > 0.05) { rastro.push([V, p]); if (rastro.length > 400) rastro.shift(); }
      /* cilindro */
      let sv = D.pistao(40, 40, 120, 240, V / 55, "", "var(--mT)");
      for (let i = 0; i < Math.round(n * 12); i++) { const x = 52 + ((i * 37) % 96), y = 280 - 8 - ((i * 53) % Math.max(10, (240 * V) / 55 - 24)); sv += `<circle cx="${x}" cy="${y}" r="3" style="fill:var(--warn)"/>`; }
      /* diagrama p × V */
      const gx = 250, gy = 280, gw = 400, gh = 240, pmax = 5 * n, X = (v) => gx + (v / 55) * gw, Y = (pp) => gy - (Math.min(pp, pmax) / pmax) * gh;
      sv += D.seta(gx, gy, gx + gw + 10, gy, "var(--ink2)", 1.4) + D.seta(gx, gy, gx, gy - gh - 10, "var(--ink2)", 1.4) + D.txt(gx + gw + 10, gy + 18, "V (L)", "tx2", "end") + D.txt(gx + 8, gy - gh - 4, "p (atm)", "tx2", "start");
      [10, 20, 30, 40, 50].forEach((v) => (sv += D.txt(X(v), gy + 16, String(v), "tx2")));
      [0.25, 0.5, 0.75, 1].map((f) => +(f * pmax).toFixed(2)).forEach((pp) => (sv += D.txt(gx - 6, Y(pp) + 4, String(pp), "tx2", "end")));
      [200, 300, 400, 500, 600].forEach((TT) => { let d = ""; for (let v = 5; v <= 52; v += 0.5) { const pp = (n * R * TT) / v; if (pp > pmax) continue; d += (d ? "L" : "M") + X(v).toFixed(1) + " " + Y(pp).toFixed(1); } sv += `<path d="${d}" style="fill:none;stroke:var(--ink3);stroke-dasharray:3 4"/>`; const pe = (n * R * TT) / 12; if (pe < pmax) sv += D.txt(X(12) + 4, Y(pe) - 4, TT + " K", "tx2", "start"); });
      let d = ""; rastro.forEach(([v, pp], i) => (d += (i ? "L" : "M") + X(v).toFixed(1) + " " + Y(pp).toFixed(1)));
      sv += `<path d="${d}" style="fill:none;stroke:var(--warn);stroke-width:2"/><circle cx="${X(V)}" cy="${Y(p)}" r="6" style="fill:var(--mT)"/>`;
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("pressão p = nRT/V", n2(p, 2) + " atm") + vis("volume", n2(V, 1) + " L") + vis("temperatura", n2(T, 0) + " K (" + n2(T - 273.15, 0) + " °C)") + vis("pV/T (= nR)", n2((p * V) / T, 4) + " atm·L/K");
    });
  };

  /* ---------- T05b · gás de discos em 2D: colisões, histograma de velocidades e pressão nas paredes ---------- */
  SIM.moleculas = (el, F) => {
    const W = 680, H = 320, L = 260, r = 4;
    let ps = [], imp = 0, tAc = 0, pMed = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("número de moléculas N", "N", 20, 120, 5, 80)}${sl("temperatura (escala do programa)", "T", 20, 400, 5, 100)}
      <div class="bts"><button class="bt pri" data-a="re">Recomeçar (todas com a mesma velocidade)</button></div></div>
      <div class="status">As moléculas começam todas com a mesma velocidade, em direções sorteadas. Batendo umas nas outras (choques elásticos), elas espalham as velocidades até chegar à distribuição de Maxwell (em 2D, a curva tracejada), sozinhas. A pressão nas paredes é medida somando os impulsos 2mv das batidas; ela confere com a teoria cinética, p·A = N·m⟨v²⟩/2 em 2D (p·V = N·m⟨v²⟩/3 em 3D), a menos de uns 10%: as moléculas daqui têm tamanho e ocupam parte da caixa, o que a teoria do gás ideal despreza. Descontando a área "proibida" (como na equação de van der Waals), a previsão bate.</div>`);
    const q = (s) => el.querySelector(s);
    const reinicia = () => { const N = val(el, "N"), v0 = Math.sqrt(val(el, "T")) * 6; ps = []; for (let i = 0; i < N; i++) { const a = Math.random() * 2 * Math.PI; ps.push({ x: r + Math.random() * (L - 2 * r), y: r + Math.random() * (L - 2 * r), vx: v0 * Math.cos(a), vy: v0 * Math.sin(a) }); } imp = 0; tAc = 0; pMed = 0; };
    SIM.moleculas._pTeo = (N, v2med) => (N * v2med) / 2 / ((L - 2 * r) * (L - 2 * r)); /* m = 1; pressão 2D (força por comprimento); o centro das moléculas só anda num quadrado de lado L − 2r */
    reinicia();
    q("[data-a=re]").addEventListener("click", reinicia);
    q("[data-c=N]").addEventListener("input", reinicia);
    q("[data-c=T]").addEventListener("input", () => { const alvo = Math.sqrt(val(el, "T")) * 6, atual = Math.sqrt(ps.reduce((s, p) => s + p.vx * p.vx + p.vy * p.vy, 0) / ps.length), f = alvo / atual; ps.forEach((p) => { p.vx *= f; p.vy *= f; }); imp = 0; tAc = 0; });
    anima(el, F, (dt) => {
      mostra(el, ["N", "T"], 0);
      const n = 6, h = dt / n;
      for (let s = 0; s < n; s++) {
        for (const p of ps) { p.x += p.vx * h; p.y += p.vy * h; if (p.x < r) { p.x = 2 * r - p.x; p.vx = -p.vx; imp += 2 * Math.abs(p.vx); } if (p.x > L - r) { p.x = 2 * (L - r) - p.x; p.vx = -p.vx; imp += 2 * Math.abs(p.vx); } if (p.y < r) { p.y = 2 * r - p.y; p.vy = -p.vy; imp += 2 * Math.abs(p.vy); } if (p.y > L - r) { p.y = 2 * (L - r) - p.y; p.vy = -p.vy; imp += 2 * Math.abs(p.vy); } }
        for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) { const a = ps[i], b = ps[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy; if (d2 < 4 * r * r && d2 > 1e-9) { const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (vn < 0) { a.vx += vn * nx; a.vy += vn * ny; b.vx -= vn * nx; b.vy -= vn * ny; } } }
        tAc += h;
      }
      if (tAc > 2) { pMed = imp / (4 * (L - 2 * r)) / tAc; imp = 0; tAc = 0; }
      const v2 = ps.reduce((s, p) => s + p.vx * p.vx + p.vy * p.vy, 0) / ps.length, pT = SIM.moleculas._pTeo(ps.length, v2);
      const bx = 30, by = 30;
      let sv = `<rect x="${bx}" y="${by}" width="${L}" height="${L}" style="fill:color-mix(in srgb,var(--mT) 8%,transparent);stroke:var(--ink2);stroke-width:2"/>`;
      ps.forEach((p, i) => (sv += `<circle cx="${(bx + p.x).toFixed(1)}" cy="${(by + p.y).toFixed(1)}" r="${r}" style="fill:${i === 0 ? "var(--bad)" : "var(--warn)"}"/>`));
      /* histograma de |v| comparado com Maxwell 2D: f(v) = (v/σ²) e^(−v²/2σ²), σ² = ⟨v²⟩/2 */
      const gx = 340, gy = 280, gw = 310, gh = 210, vmax = 3 * Math.sqrt(v2), nb = 15, bins = new Array(nb).fill(0);
      ps.forEach((p) => { const v = Math.hypot(p.vx, p.vy), k = Math.floor((v / vmax) * nb); if (k < nb) bins[k]++; });
      const s2 = v2 / 2, fmax = 1 / Math.sqrt(s2) * Math.exp(-0.5), dv = vmax / nb, esc = gh / (ps.length * dv * fmax * 1.3);
      bins.forEach((c, k) => (sv += `<rect x="${gx + (k * gw) / nb + 1}" y="${gy - c * esc}" width="${gw / nb - 2}" height="${c * esc}" style="fill:color-mix(in srgb,var(--mT) 45%,transparent)"/>`));
      let d = ""; for (let i = 0; i <= 60; i++) { const v = (vmax * i) / 60, f = (v / s2) * Math.exp(-(v * v) / (2 * s2)); d += (i ? "L" : "M") + (gx + (v / vmax) * gw).toFixed(1) + " " + (gy - f * ps.length * dv * esc).toFixed(1); }
      sv += `<path d="${d}" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4"/>` + D.seta(gx, gy, gx + gw + 10, gy, "var(--ink2)", 1.4) + D.txt(gx + gw + 10, gy + 18, "|v|", "tx2", "end") + D.txt(gx, gy - gh - 6, "quantas moléculas", "tx2", "start");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("velocidade quadrática média √⟨v²⟩", n2(Math.sqrt(v2), 1) + " px/s") + vis("pressão medida nas paredes", pMed ? n2(pMed, 2) : "medindo…") + vis("pressão prevista N⟨v²⟩/(2A)", n2(pT, 2)) + vis("prevista descontando o tamanho das moléculas", n2((ps.length * v2) / 2 / ((L - 2 * r) ** 2 - ps.length * 2 * Math.PI * r * r), 2)) + vis("energia cinética média", n2(v2 / 2, 0) + " (∝ T)");
    });
  };

  /* ---------- T06 · dois corpos em contato térmico caminhando para o equilíbrio ---------- */
  SIM.contato = (el, F) => {
    const W = 680, H = 300;
    let T1, T2, t, hist;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("capacidade térmica do corpo A (J/K)", "C1", 20, 500, 10, 100)}${sl("capacidade térmica do corpo B (J/K)", "C2", 20, 500, 10, 300)}${sl("temperatura inicial de A (°C)", "Ta", 0, 100, 1, 80)}${sl("temperatura inicial de B (°C)", "Tb", 0, 100, 1, 20)}${sl("condutância do contato G (W/K)", "G", 0.5, 10, 0.5, 2)}
      <div class="bts"><button class="bt pri" data-a="re">Encostar de novo</button></div></div>
      <div class="status">Dois corpos isolados do resto do mundo são encostados. O calor flui do mais quente para o mais frio, a uma taxa G·(T_A − T_B), até as temperaturas ficarem iguais: o equilíbrio térmico. A temperatura final é a média ponderada pelas capacidades térmicas, e a diferença entre os dois cai exponencialmente, com tempo característico τ = C_A·C_B / (G·(C_A + C_B)).</div>`);
    const q = (s) => el.querySelector(s);
    SIM.contato._conta = (C1, C2, Ta, Tb, G) => ({ Teq: (C1 * Ta + C2 * Tb) / (C1 + C2), tau: (C1 * C2) / (G * (C1 + C2)) });
    const reinicia = () => { T1 = val(el, "Ta"); T2 = val(el, "Tb"); t = 0; hist = []; };
    reinicia();
    q("[data-a=re]").addEventListener("click", reinicia);
    ["C1", "C2", "Ta", "Tb", "G"].forEach((k) => q(`[data-c=${k}]`).addEventListener("input", reinicia));
    anima(el, F, (dt) => {
      const C1 = val(el, "C1"), C2 = val(el, "C2"), G = val(el, "G"), c = SIM.contato._conta(C1, C2, val(el, "Ta"), val(el, "Tb"), G);
      mostra(el, ["C1", "C2"], 0); q("[data-o=Ta]").textContent = n2(val(el, "Ta"), 0) + " °C"; q("[data-o=Tb]").textContent = n2(val(el, "Tb"), 0) + " °C"; mostra(el, ["G"], 1);
      const tmax = 5 * c.tau, passo = (tmax / 8) * dt, n = 20;
      for (let i = 0; i < n && t < tmax; i++) { const P = G * (T1 - T2), h = passo / n; T1 -= (P / C1) * h; T2 += (P / C2) * h; t += h; }
      hist.push([t, T1, T2]);
      const cor = (T) => `color-mix(in srgb,var(--bad) ${Math.round(T)}%,var(--mA))`;
      const w1 = 40 + C1 / 6, w2 = 40 + C2 / 6;
      let sv = `<rect x="${150 - w1}" y="60" width="${w1}" height="100" style="fill:${cor(T1)};opacity:.55;stroke:var(--ink2)"/><rect x="150" y="60" width="${w2}" height="100" style="fill:${cor(T2)};opacity:.55;stroke:var(--ink2)"/>`;
      sv += D.txt(150 - w1 / 2, 115, "A", "txm") + D.txt(150 + w2 / 2, 115, "B", "txm") + D.txt(150 - w1 / 2, 180, n2(T1, 1) + " °C", "tx2") + D.txt(150 + w2 / 2, 180, n2(T2, 1) + " °C", "tx2");
      if (Math.abs(T1 - T2) > 0.3) sv += D.seta(T1 > T2 ? 130 : 170, 40, T1 > T2 ? 170 : 130, 40, "var(--bad)", 2) + D.txt(150, 30, "calor", "tx2");
      const gx = 330, gy = 260, gw = 320, gh = 220, X = (tt) => gx + (tt / tmax) * gw, Y = (T) => gy - (T / 100) * gh;
      sv += D.seta(gx, gy, gx + gw + 10, gy, "var(--ink2)", 1.4) + D.seta(gx, gy, gx, gy - gh - 10, "var(--ink2)", 1.4) + D.txt(gx + gw + 10, gy + 18, "tempo", "tx2", "end") + D.txt(gx + 6, gy - gh - 4, "T (°C)", "tx2", "start");
      sv += `<line x1="${gx}" x2="${gx + gw}" y1="${Y(c.Teq)}" y2="${Y(c.Teq)}" style="stroke:var(--ink3);stroke-dasharray:5 4"/>` + D.txt(gx + gw, Y(c.Teq) - 6, "equilíbrio", "tx2", "end");
      [1, 2, 3, 4].forEach((k) => (sv += `<line x1="${X(k * c.tau)}" x2="${X(k * c.tau)}" y1="${gy}" y2="${gy + 5}" style="stroke:var(--ink3)"/>` + D.txt(X(k * c.tau), gy + 18, k + "τ", "tx2")));
      let d1 = "", d2 = ""; hist.forEach(([tt, a, b], i) => { d1 += (i ? "L" : "M") + X(tt).toFixed(1) + " " + Y(a).toFixed(1); d2 += (i ? "L" : "M") + X(tt).toFixed(1) + " " + Y(b).toFixed(1); });
      sv += `<path d="${d1}" style="fill:none;stroke:var(--bad);stroke-width:2.5"/><path d="${d2}" style="fill:none;stroke:var(--mA);stroke-width:2.5"/>`;
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("temperatura de equilíbrio", n2(c.Teq, 2) + " °C") + vis("tempo característico τ", n2(c.tau, 1) + " s") + vis("tempo agora", n2(t, 0) + " s") + vis("calor já transferido de A para B", n2(C1 * (val(el, "Ta") - T1), 0) + " J");
    });
  };

  /* ---------- T07 · os quatro processos no diagrama p × V: trabalho, calor e energia interna ---------- */
  SIM.processos = (el, F) => {
    const W = 680, H = 320, R = 8.314, Ra = 0.082, VA = 24.6, TA = 300, pA = (Ra * TA) / VA;
    let proc = "p", f = 3;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("volume final V_B (L)", "VB", 5, 50, 0.5, 40)}${sl("temperatura final T_B (K), só na isocórica", "TB", 100, 900, 10, 600)}
      <div class="bts">${botoes([["p", "isobárico"], ["V", "isocórico"], ["T", "isotérmico"], ["Q", "adiabático"]], "proc", "p")}${botoes([["3", "monoatômico"], ["5", "diatômico"]], "f", "3")}</div></div>
      <div class="status">1 mol de gás ideal sai do estado A (1 atm, 24,6 L, 300 K). A área sob a curva no diagrama p × V é o trabalho que o gás faz (positivo se ele expande). A energia interna só depende da temperatura: ΔU = n·(f/2)·R·ΔT. O calor sai da 1ª lei: Q = ΔU + W. Na adiabática não entra calor: o trabalho sai da energia interna, e o gás esfria ao expandir.</div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "proc", (k) => (proc = k));
    liga(el, "f", (k) => (f = +k));
    SIM.processos._conta = (pr, ff, VB, TBv) => {
      const Cv = (ff / 2) * R, g = (ff + 2) / ff;
      let TB, Wj, curva;
      if (pr === "p") { TB = (TA * VB) / VA; Wj = pA * (VB - VA) * 101.325; curva = (v) => pA; }
      else if (pr === "V") { VB = VA; TB = TBv; Wj = 0; curva = null; }
      else if (pr === "T") { TB = TA; Wj = R * TA * Math.log(VB / VA); curva = (v) => (Ra * TA) / v; }
      else { TB = TA * Math.pow(VA / VB, g - 1); Wj = Cv * (TA - TB); curva = (v) => pA * Math.pow(VA / v, g); }
      const dU = Cv * (TB - TA);
      return { VB, TB, pB: (Ra * TB) / VB, W: Wj, dU, Q: dU + Wj, curva, g };
    };
    anima(el, F, () => {
      const c = SIM.processos._conta(proc, f, val(el, "VB"), val(el, "TB"));
      mostra(el, ["VB"], 1); mostra(el, ["TB"], 0);
      q("[data-c=VB]").disabled = proc === "V"; q("[data-c=TB]").disabled = proc !== "V";
      const gx = 70, gy = 280, gw = 560, gh = 240, pmax = 4, X = (v) => gx + (v / 55) * gw, Y = (p) => gy - (Math.min(p, pmax) / pmax) * gh;
      let sv = D.seta(gx, gy, gx + gw + 10, gy, "var(--ink2)", 1.4) + D.seta(gx, gy, gx, gy - gh - 10, "var(--ink2)", 1.4) + D.txt(gx + gw + 10, gy + 18, "V (L)", "tx2", "end") + D.txt(gx + 6, gy - gh - 4, "p (atm)", "tx2", "start");
      [10, 20, 30, 40, 50].forEach((v) => (sv += D.txt(X(v), gy + 16, String(v), "tx2")));
      [1, 2, 3, 4].forEach((p) => (sv += D.txt(gx - 6, Y(p) + 4, String(p), "tx2", "end")));
      [150, 300, 600, 900].forEach((T) => { let d = ""; for (let v = 3; v <= 52; v += 0.5) { const p = (Ra * T) / v; if (p > pmax) continue; d += (d ? "L" : "M") + X(v).toFixed(1) + " " + Y(p).toFixed(1); } sv += `<path d="${d}" style="fill:none;stroke:var(--line2);stroke-dasharray:3 4"/>`; });
      if (c.curva) {
        const a = Math.min(VA, c.VB), b = Math.max(VA, c.VB); let d = "", area = `M${X(a)} ${gy}`;
        for (let i = 0; i <= 60; i++) { const v = a + ((b - a) * i) / 60, p = c.curva(v); d += (i ? "L" : "M") + X(v).toFixed(1) + " " + Y(p).toFixed(1); area += "L" + X(v).toFixed(1) + " " + Y(p).toFixed(1); }
        area += `L${X(b)} ${gy} Z`;
        sv += `<path d="${area}" style="fill:color-mix(in srgb,${c.W >= 0 ? "var(--mT)" : "var(--mA)"} 22%,transparent)"/><path d="${d}" style="fill:none;stroke:var(--warn);stroke-width:3"/>`;
      } else sv += `<line x1="${X(VA)}" x2="${X(VA)}" y1="${Y(pA)}" y2="${Y(c.pB)}" style="stroke:var(--warn);stroke-width:3"/>`;
      sv += `<circle cx="${X(VA)}" cy="${Y(pA)}" r="6" style="fill:var(--ink)"/><circle cx="${X(c.VB)}" cy="${Y(c.pB)}" r="6" style="fill:var(--warn)"/>` + D.txt(X(VA) + 8, Y(pA) - 8, "A", "txm", "start") + D.txt(X(c.VB) + 8, Y(c.pB) - 8, "B", "txm", "start");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("estado B", n2(c.pB, 2) + " atm · " + n2(c.VB, 1) + " L · " + n2(c.TB, 0) + " K") + vis("trabalho do gás W (área)", n2(c.W, 0) + " J") + vis("variação da energia interna ΔU", n2(c.dU, 0) + " J") + vis("calor recebido Q = ΔU + W", n2(c.Q, 0) + " J");
    });
  };
})();
