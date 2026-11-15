/* Simulações dos experimentos da β 3.4 (EP11–EP18). EP11 máquina de Carnot; EP12 demônio de Maxwell; EP13 van der Waals; EP14 fenda dupla; */
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

  /* ---------- EP12 · demônio de Maxwell: portinha controlada, temperatura e entropia de cada lado, custo de informação ---------- */
  SIM.demonio = (el, F) => {
    const W = 680, H = 300, bx = 20, by = 20, bw = 440, bh = 240, meio = bx + bw / 2, porta = 56, r = 4;
    let ps = [], aberta = false, segurando = false, auto = false, bits = 0, S0 = 0, vmed = 0, ultAberta = false, passou = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv" style="touch-action:none"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("número de partículas", "N", 20, 120, 2, 60)}
      <div class="bts"><button class="bt pri" data-a="abre">Segure para abrir a portinha</button><button class="bt" data-a="auto" aria-pressed="false">Demônio automático</button><button class="bt" data-a="re">Misturar de novo</button></div></div>
      <div class="status">Vermelhas: mais rápidas que a mediana; azuis: mais lentas. Abra a portinha (segurando o botão, ou a tecla espaço com o laboratório em foco) só quando uma vermelha vier da esquerda ou uma azul vier da direita: o lado direito esquenta, o esquerdo esfria, e a entropia do gás diminui, sem gastar energia (a porta não empurra nada). Parece violar a 2ª lei. O que salva a lei é o custo de informação do demônio: cada decisão é 1 bit de memória, e apagar 1 bit gera pelo menos k·ln 2 de entropia (princípio de Landauer).</div>`);
    const q = (s) => el.querySelector(s);
    const raiz2 = Math.sqrt(2);
    const reinicia = () => {
      const N = val(el, "N"); ps = [];
      for (let i = 0; i < N; i++) { const v = 60 * Math.sqrt(-2 * Math.log(1 - Math.random() * 0.999)), a = Math.random() * 2 * Math.PI, esq = i % 2 === 0; ps.push({ x: (esq ? bx + 10 : meio + 10) + Math.random() * (bw / 2 - 20), y: by + 10 + Math.random() * (bh - 20), vx: v * Math.cos(a), vy: v * Math.sin(a) }); }
      const vs = ps.map((p) => Math.hypot(p.vx, p.vy)).sort((a, b) => a - b); vmed = vs[Math.floor(vs.length / 2)];
      bits = 0; S0 = ent().S; void raiz2;
    };
    /* gás ideal 2D (m = 1, k = 1): kT = ⟨v²⟩/2 por partícula; S/k = N[ln(A/N) + ln T] + constante, para cada lado */
    const lado = (f) => { const l = ps.filter(f), N = l.length; if (!N) return { N: 0, T: 0, S: 0 }; const T = l.reduce((s, p) => s + p.vx * p.vx + p.vy * p.vy, 0) / (2 * N); return { N, T, S: N * (Math.log((bw / 2) * bh / N) + Math.log(T)) }; };
    const ent = () => { const e = lado((p) => p.x < meio), d = lado((p) => p.x >= meio); return { e, d, S: e.S + d.S }; };
    SIM.demonio._ent = ent;
    reinicia();
    const bA = q("[data-a=abre]");
    const on = () => (segurando = true), off = () => (segurando = false);
    bA.addEventListener("pointerdown", on); bA.addEventListener("pointerup", off); bA.addEventListener("pointerleave", off);
    el.tabIndex = 0; el.addEventListener("keydown", (e) => { if (e.code === "Space") { e.preventDefault(); segurando = true; } }); el.addEventListener("keyup", (e) => { if (e.code === "Space") segurando = false; });
    q("[data-a=auto]").addEventListener("click", (e) => { auto = !auto; e.target.setAttribute("aria-pressed", auto); });
    q("[data-a=re]").addEventListener("click", reinicia); q("[data-c=N]").addEventListener("input", reinicia);
    anima(el, F, (dt) => {
      mostra(el, ["N"], 0);
      const y0 = by + bh / 2 - porta / 2, y1 = y0 + porta;
      if (auto) { aberta = ps.some((p) => p.y > y0 + r && p.y < y1 - r && ((p.x < meio && p.x > meio - 22 && p.vx > 0 && Math.hypot(p.vx, p.vy) > vmed) || (p.x >= meio && p.x < meio + 22 && p.vx < 0 && Math.hypot(p.vx, p.vy) <= vmed))); }
      else aberta = segurando;
      /* bits: 1 por partícula que o demônio deixa passar (ele teve de medi-la) e 1 por abertura em que nenhuma passou (decidiu à toa) */
      if (!aberta && ultAberta && !passou) bits++; if (aberta && !ultAberta) passou = false; ultAberta = aberta;
      const n = 4, h = dt / n;
      for (let k = 0; k < n; k++) for (const p of ps) {
        const xa = p.x; p.x += p.vx * h; p.y += p.vy * h;
        if (p.y < by + r) { p.y = 2 * (by + r) - p.y; p.vy = -p.vy; } if (p.y > by + bh - r) { p.y = 2 * (by + bh - r) - p.y; p.vy = -p.vy; }
        if (p.x < bx + r) { p.x = 2 * (bx + r) - p.x; p.vx = -p.vx; } if (p.x > bx + bw - r) { p.x = 2 * (bx + bw - r) - p.x; p.vx = -p.vx; }
        const cruzou = (xa < meio) !== (p.x < meio);
        if (cruzou) { if (aberta && p.y > y0 && p.y < y1) { bits++; passou = true; } else { p.x = 2 * meio - p.x; p.vx = -p.vx; } }
      }
      const E = ent(), dSg = E.S - S0, custo = bits * Math.LN2;
      let sv = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
      sv += `<rect x="${bx}" y="${by}" width="${bw / 2}" height="${bh}" style="fill:color-mix(in srgb,var(--mA) ${Math.round(Math.min(30, 4 + 200 / Math.max(E.e.T, 1)))}%,transparent)"/><rect x="${meio}" y="${by}" width="${bw / 2}" height="${bh}" style="fill:color-mix(in srgb,var(--bad) ${Math.round(Math.min(30, E.d.T / 400))}%,transparent)"/>`;
      sv += `<line x1="${meio}" x2="${meio}" y1="${by}" y2="${y0}" style="stroke:var(--ink2);stroke-width:4"/><line x1="${meio}" x2="${meio}" y1="${y1}" y2="${by + bh}" style="stroke:var(--ink2);stroke-width:4"/>`;
      sv += aberta ? `<line x1="${meio}" x2="${meio + 22}" y1="${y0}" y2="${y0 - 14}" style="stroke:var(--warn);stroke-width:4"/>` : `<line x1="${meio}" x2="${meio}" y1="${y0}" y2="${y1}" style="stroke:var(--warn);stroke-width:4"/>`;
      ps.forEach((p) => (sv += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r}" style="fill:${Math.hypot(p.vx, p.vy) > vmed ? "var(--bad)" : "var(--mA)"}"/>`));
      /* o demônio: um bonequinho com olhinhos em cima da porta */
      sv += `<g transform="translate(${meio} ${by + bh + 18})"><circle r="9" style="fill:color-mix(in srgb,var(--mF) 60%,transparent);stroke:var(--mF)"/><circle cx="-3" cy="-2" r="1.6" style="fill:var(--ink)"/><circle cx="3" cy="-2" r="1.6" style="fill:var(--ink)"/><path d="M-6 -8 l-3 -6 M6 -8 l3 -6" style="stroke:var(--mF);stroke-width:2"/></g>`;
      /* barras de entropia: gás (pode cair) + memória do demônio (sempre sobe) */
      const gx = 500, gy = 150, esc = 6;
      sv += `<line x1="${gx - 6}" x2="${gx + 160}" y1="${gy}" y2="${gy}" style="stroke:var(--ink3)"/>` + D.txt(gx - 10, gy + 4, "0", "tx2", "end");
      const barra = (x, v, cor, rot) => { const hh = Math.max(-120, Math.min(120, v * esc)); return `<rect x="${x}" y="${hh >= 0 ? gy - hh : gy}" width="36" height="${Math.abs(hh)}" style="fill:color-mix(in srgb,${cor} 50%,transparent);stroke:${cor}"/>` + D.txt(x + 18, hh >= 0 ? gy + 16 : gy - 6, rot, "tx2"); };
      sv += barra(gx, dSg, "var(--mA)", "gás") + barra(gx + 56, custo, "var(--warn)", "memória") + barra(gx + 112, dSg + custo, "var(--ok)", "total");
      sv += D.txt(gx + 75, 22, "variação de entropia (em k)", "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("temperatura: esquerda | direita", n2(E.e.T, 0) + " | " + n2(E.d.T, 0)) + vis("ΔS do gás (em k)", n2(dSg, 2)) + vis("bits de decisão | custo k·ln 2 cada", bits + " | " + n2(custo, 2)) + vis("ΔS total com a memória (≥ 0?)", n2(dSg + custo, 2));
    });
  };

  /* ---------- EP13 · gás de van der Waals: isotermas, construção de Maxwell, ponto crítico e condensação ---------- */
  SIM.vanDerWaals = (el, F) => {
    const W = 680, H = 330, R = 0.08314; /* L·bar/(mol·K) */
    const gases = { co2: [3.64, 0.04267], h2o: [5.536, 0.03049], n2: [1.37, 0.0387], he: [0.0346, 0.0238] };
    let ideal = false, fase = 0, cache = { k: "" };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("a: atração entre moléculas (L²·bar/mol²)", "a", 0.03, 6, 0.01, 3.64)}${sl("b: volume próprio das moléculas (L/mol)", "b", 0.02, 0.06, 0.0005, 0.0427)}${sl("temperatura T / T_c", "tr", 0.75, 1.4, 0.01, 0.9)}
      <div class="bts">${botoes([["co2", "CO₂"], ["h2o", "água"], ["n2", "N₂"], ["he", "hélio"]], "gas", "co2")}<button class="bt" data-a="ideal" aria-pressed="false">Sobrepor o gás ideal</button></div></div>
      <div class="status">Van der Waals corrigiu o gás ideal com duas ideias: as moléculas ocupam volume (b) e se atraem (a): (p + a/v²)(v − b) = RT. Abaixo da temperatura crítica, a isoterma faz uma "onda" que não acontece de verdade: no trecho em que a pressão subiria ao comprimir, o gás se divide em líquido e vapor, a pressão fica constante (a reta da construção de Maxwell, que corta a onda em duas áreas iguais) e o pistão desce condensando o gás. Acima de T_c, não há condensação: só existe um fluido.</div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "gas", (k) => { q("[data-c=a]").value = gases[k][0]; q("[data-c=b]").value = gases[k][1]; });
    q("[data-a=ideal]").addEventListener("click", (e) => { ideal = !ideal; e.target.setAttribute("aria-pressed", ideal); });
    const pv = (v, T, a, b) => (R * T) / (v - b) - a / (v * v);
    /* raízes de p_vdW(v) = P (a cúbica P v³ − (Pb + RT) v² + a v − ab = 0), por varredura e bisseção */
    const raizes = (P, T, a, b) => { const out = []; let v0 = b * 1.0005, f0 = pv(v0, T, a, b) - P; for (let i = 1; i <= 600; i++) { const v1 = b * 1.0005 * Math.pow(400, i / 600), f1 = pv(v1, T, a, b) - P; if (f0 * f1 < 0) { let lo = v0, hi = v1; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2, fm = pv(m, T, a, b) - P; if ((fm < 0) === (f0 < 0)) lo = m; else hi = m; } out.push((lo + hi) / 2); } v0 = v1; f0 = f1; } return out; };
    const maxwell = (T, a, b) => {
      const vs = [], ps = []; for (let i = 0; i <= 1500; i++) { const v = b * 1.002 * Math.pow(300, i / 1500); vs.push(v); ps.push(pv(v, T, a, b)); }
      const ext = []; for (let i = 1; i < ps.length - 1; i++) if ((ps[i] - ps[i - 1]) * (ps[i + 1] - ps[i]) < 0) ext.push(ps[i]);
      if (ext.length < 2) return null;
      let lo = Math.max(ext[0], 1e-6), hi = ext[1], P = 0, vl = 0, vg = 0;
      for (let k = 0; k < 80; k++) { P = (lo + hi) / 2; const r = raizes(P, T, a, b); if (r.length < 3) { if (r.length && r[0] > 3 * b) hi = P; else lo = P; continue; } vl = r[0]; vg = r[r.length - 1]; const f = R * T * Math.log((vg - b) / (vl - b)) + a / vg - a / vl - P * (vg - vl); if (f > 0) lo = P; else hi = P; }
      return { P, vl, vg };
    };
    SIM.vanDerWaals._maxwell = maxwell; SIM.vanDerWaals._pv = pv;
    anima(el, F, (dt) => {
      const a = val(el, "a"), b = val(el, "b"), tr = val(el, "tr"), Tc = (8 * a) / (27 * R * b), pc = a / (27 * b * b), vc = 3 * b, T = tr * Tc;
      mostra(el, ["a"], 2); mostra(el, ["b"], 4); mostra(el, ["tr"], 2);
      const chave = a + "|" + b + "|" + tr;
      if (cache.k !== chave) { /* as contas pesadas (Maxwell e o domo) só são refeitas quando um controle muda */
        const dom = []; for (let t = 0.76; t < 0.995; t += 0.012) { const m = maxwell(t * Tc, a, b); if (m && m.vl) dom.push(m); }
        cache = { k: chave, mx: tr < 1 ? maxwell(T, a, b) : null, dom };
      }
      const mx = cache.mx;
      /* pistão: o volume vai e volta (escala log) entre 0,45 v_c e 12 v_c */
      fase = (fase + dt / 14) % 1; const ida = fase < 0.5 ? fase * 2 : 2 - fase * 2, vAt = vc * 0.45 * Math.pow(12 / 0.45, 1 - ida);
      let pAt, xl = 0, estado;
      if (mx && vAt > mx.vl && vAt < mx.vg) { pAt = mx.P; xl = (mx.vg - vAt) / (mx.vg - mx.vl); estado = "mistura: " + n2(xl * 100, 0) + "% líquido"; }
      else { pAt = pv(vAt, T, a, b); estado = mx && vAt <= mx.vl ? "líquido" : tr >= 1 ? "fluido supercrítico / gás" : "gás"; }
      /* diagrama p × v (v em escala log) */
      const gx = 60, gy = 290, gw = 380, gh = 250, lv0 = Math.log(vc * 0.4), lv1 = Math.log(vc * 14), pmax = 2 * pc;
      const X = (v) => gx + ((Math.log(v) - lv0) / (lv1 - lv0)) * gw, Y = (p) => gy - (Math.max(-0.15 * pc, Math.min(p, pmax)) / pmax) * gh;
      let sv = D.seta(gx, gy, gx + gw + 10, gy, "var(--ink2)", 1.4) + D.seta(gx, gy + 30, gx, gy - gh - 10, "var(--ink2)", 1.4) + D.txt(gx + gw + 10, gy + 16, "v (log)", "tx2", "end") + D.txt(gx + 6, gy - gh - 2, "p", "txm", "start");
      sv += `<line x1="${gx}" x2="${gx + gw}" y1="${Y(pc)}" y2="${Y(pc)}" style="stroke:var(--line2);stroke-dasharray:2 4"/>` + D.txt(gx - 4, Y(pc) + 4, "p_c", "tx2", "end");
      const curva = (TT) => { let d = ""; for (let i = 0; i <= 200; i++) { const v = Math.exp(lv0 + ((lv1 - lv0) * i) / 200); if (v <= b * 1.01) continue; d += (d ? "L" : "M") + X(v).toFixed(1) + " " + Y(pv(v, TT, a, b)).toFixed(1); } return d; };
      [0.8, 0.9, 1, 1.1, 1.25].forEach((t) => (sv += `<path d="${curva(t * Tc)}" style="fill:none;stroke:var(--line2);stroke-width:1"/>`));
      /* domo de coexistência (pontos de Maxwell de várias temperaturas) */
      let dl = "", dg = ""; for (const m of cache.dom) { dl += (dl ? "L" : "M") + X(m.vl).toFixed(1) + " " + Y(m.P).toFixed(1); dg = "L" + X(m.vg).toFixed(1) + " " + Y(m.P).toFixed(1) + dg; }
      sv += `<path d="${dl}L${X(vc).toFixed(1)} ${Y(pc).toFixed(1)}${dg}" style="fill:color-mix(in srgb,var(--mA) 10%,transparent);stroke:var(--mA);stroke-dasharray:4 3"/>`;
      if (ideal) { let d = ""; for (let i = 0; i <= 200; i++) { const v = Math.exp(lv0 + ((lv1 - lv0) * i) / 200); d += (i ? "L" : "M") + X(v).toFixed(1) + " " + Y((R * T) / v).toFixed(1); } sv += `<path d="${d}" style="fill:none;stroke:var(--ok);stroke-width:2;stroke-dasharray:6 4"/>` + D.txt(X(vc * 0.5), Y((R * T) / (vc * 0.5)) - 8, "gás ideal", "tx2", "start"); }
      sv += `<path d="${curva(T)}" style="fill:none;stroke:var(--mF);stroke-width:2.5"/>`;
      if (mx && mx.vl) {
        let a1 = `M${X(mx.vl)} ${Y(mx.P)}`, a2 = ""; for (let i = 0; i <= 80; i++) { const v = mx.vl * Math.pow(mx.vg / mx.vl, i / 80), pp = pv(v, T, a, b); a1 += "L" + X(v).toFixed(1) + " " + Y(pp).toFixed(1); }
        sv += `<path d="${a1}Z" style="fill:color-mix(in srgb,var(--warn) 25%,transparent);stroke:none"/><line x1="${X(mx.vl)}" x2="${X(mx.vg)}" y1="${Y(mx.P)}" y2="${Y(mx.P)}" style="stroke:var(--warn);stroke-width:3"/>` + D.txt(X(mx.vg) + 6, Y(mx.P) - 6, "áreas iguais", "tx2", "start"); void a2;
      }
      sv += `<circle cx="${X(vc)}" cy="${Y(pc)}" r="5" style="fill:var(--bad)"/>` + D.txt(X(vc) + 8, Y(pc) - 8, "ponto crítico", "tx2", "start") + `<circle cx="${X(vAt)}" cy="${Y(pAt)}" r="6" style="fill:var(--ink)"/>`;
      /* cilindro: altura proporcional a log v; líquido embaixo com a fração em volume */
      const cx = 500, cw = 110, base = 290, hmax = 230, hmin = 30, hh = hmin + ((Math.log(vAt) - lv0) / (lv1 - lv0)) * (hmax - hmin);
      const fracVolLiq = mx && xl > 0 ? Math.min(1, (xl * mx.vl) / vAt) : estado === "líquido" ? 1 : 0;
      sv += `<path d="M${cx} ${base - hmax - 20} L${cx} ${base} L${cx + cw} ${base} L${cx + cw} ${base - hmax - 20}" style="fill:none;stroke:var(--ink2);stroke-width:3"/>`;
      sv += `<rect x="${cx + 2}" y="${base - hh}" width="${cw - 4}" height="${hh - 1}" style="fill:color-mix(in srgb,var(--mF) 15%,transparent)"/><rect x="${cx + 2}" y="${base - hh * fracVolLiq}" width="${cw - 4}" height="${hh * fracVolLiq}" style="fill:color-mix(in srgb,var(--mA) 55%,transparent)"/>`;
      if (xl > 0 && xl < 1) for (let i = 0; i < 6; i++) { const yy = base - hh * fracVolLiq - 8 - ((fase * 40 + i * 17) % Math.max(10, hh * (1 - fracVolLiq) - 10)); sv += `<circle cx="${cx + 15 + i * 16}" cy="${yy}" r="2.5" style="fill:var(--mA)"/>`; }
      sv += `<rect x="${cx + 2}" y="${base - hh - 10}" width="${cw - 4}" height="10" style="fill:var(--ink3)"/><line x1="${cx + cw / 2}" x2="${cx + cw / 2}" y1="${base - hh - 10}" y2="${base - hh - 34}" style="stroke:var(--ink3);stroke-width:4"/>` + D.txt(cx + cw / 2, base + 18, estado, "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("ponto crítico: T_c | p_c | v_c", n2(Tc, 0) + " K | " + n2(pc, 1) + " bar | " + n2(vc, 3) + " L/mol") + vis("temperatura agora", n2(T, 0) + " K") + vis("pressão de vapor (Maxwell)", mx && mx.vl ? n2(mx.P, 1) + " bar" : "não há (T ≥ T_c)") + vis("p real ÷ p do gás ideal agora", n2(pAt / ((R * T) / vAt), 2));
    });
  };

  /* ---------- EP14 · fenda dupla: onda clássica × um fóton por vez ---------- */
  SIM.fendaDupla = (el, F) => {
    const W = 680, H = 320, YJ = 15; /* janela da tela: ±15 mm */
    let modo = "onda", fotons = [], t = 0, chave = "", acum = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><canvas width="${W * 2}" height="${H * 2}" style="width:100%;max-width:${W}px;aspect-ratio:${W}/${H}" data-v="cv"></canvas></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("comprimento de onda λ (nm)", "lam", 380, 750, 5, 550)}${sl("separação das fendas d (mm)", "d", 0.05, 1, 0.01, 0.25)}${sl("distância até a tela L (m)", "L", 0.5, 3, 0.05, 1)}${sl("largura de cada fenda (mm)", "a", 0.01, 0.1, 0.005, 0.04)}
      <div class="bts">${botoes([["onda", "onda clássica"], ["foton", "um fóton por vez"]], "modo", "onda")}<button class="bt" data-a="limpa">Limpar a tela</button></div></div>
      <div class="status">À esquerda, as ondas saindo das duas fendas; à direita, a tela. Onde as duas ondas chegam em fase (diferença de caminho d·sen θ = mλ), há franja clara; meio comprimento de onda fora de fase, escura. As marquinhas ao lado da tela são as posições previstas pela fórmula y = mλL/d. No modo "um fóton por vez", cada fóton chega num ponto aleatório, mas a chance de chegar em cada lugar segue a mesma figura: as franjas aparecem sozinhas, ponto a ponto.</div>`);
    const q = (s) => el.querySelector(s), cv = q("[data-v=cv]"), cx = cv.getContext("2d");
    const css = (v) => getComputedStyle(el).getPropertyValue(v).trim() || "#888";
    liga(el, "modo", (k) => { modo = k; fotons = []; });
    q("[data-a=limpa]").addEventListener("click", () => (fotons = []));
    /* intensidade relativa na tela (aproximação de ângulo pequeno): interferência das duas fendas × difração de cada uma */
    const I = (ymm, lam, d, L, a) => { const y = ymm / 1000, k = Math.PI / (lam * 1e-9 * L), b1 = k * d * 1e-3 * y, b2 = k * a * 1e-3 * y, s = Math.abs(b2) < 1e-9 ? 1 : Math.sin(b2) / b2; return Math.cos(b1) ** 2 * s * s; };
    SIM.fendaDupla._I = I; SIM.fendaDupla._dy = (lam, d, L) => (lam * 1e-9 * L) / (d * 1e-3) * 1000; /* espaçamento das franjas em mm */
    const corLam = (l) => { let r = 0, g = 0, b = 0; if (l < 440) { r = (440 - l) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; } else if (l < 510) { g = 1; b = (510 - l) / 20; } else if (l < 580) { r = (l - 510) / 70; g = 1; } else if (l < 645) { r = 1; g = (645 - l) / 65; } else r = 1; const f = l < 420 ? 0.3 + (0.7 * (l - 380)) / 40 : l > 700 ? 0.3 + (0.7 * (750 - l)) / 50 : 1; return [r * f, g * f, b * f].map((x) => Math.round(255 * Math.pow(x, 0.8))); };
    anima(el, F, (dt) => {
      const lam = val(el, "lam"), d = val(el, "d"), L = val(el, "L"), a = Math.min(val(el, "a"), d * 0.9);
      mostra(el, ["lam"], 0); mostra(el, ["d", "L"], 2); mostra(el, ["a"], 3);
      const k2 = [lam, d, L, a].join("|"); if (k2 !== chave) { chave = k2; fotons = []; }
      t += dt;
      const [cr, cg, cb] = corLam(lam), cor = (al) => `rgba(${cr},${cg},${cb},${al})`;
      cx.setTransform(2, 0, 0, 2, 0, 0); cx.clearRect(0, 0, W, H);
      /* barreira com as duas fendas e ondas circulares (comprimento de onda e separação fora de escala, só ilustrativos) */
      const xb = 120, yc = 160, sep = 14 + d * 60, ondaPx = 6 + (lam - 380) / 20;
      cx.fillStyle = css("--ink3"); cx.fillRect(xb - 3, 20, 6, yc - sep / 2 - 4 - 20); cx.fillRect(xb - 3, yc - sep / 2 + 4, 6, sep - 8); cx.fillRect(xb - 3, yc + sep / 2 + 4, 6, H - 20 - (yc + sep / 2 + 4));
      cx.lineWidth = 1.2;
      for (let i = 0; i < 9; i++) { const xx = 20 + ((t * 40 + i * ondaPx) % (xb - 20)); cx.strokeStyle = cor(0.5); cx.beginPath(); cx.moveTo(xx, 30); cx.lineTo(xx, H - 30); cx.stroke(); }
      [yc - sep / 2, yc + sep / 2].forEach((ys) => { for (let i = 0; i < 26; i++) { const rr = ((t * 40) % ondaPx) + i * ondaPx; if (xb + rr > 470) break; cx.strokeStyle = cor(Math.max(0, 0.55 - rr / 700)); cx.beginPath(); cx.arc(xb, ys, rr, -1.2, 1.2); cx.stroke(); } });
      /* tela */
      const xs = 480, ws = 60, Y = (ymm) => yc - (ymm / YJ) * 140;
      cx.fillStyle = "#05070a"; cx.fillRect(xs, 20, ws, 280);
      if (modo === "onda") { for (let py = 20; py < 300; py++) { const ymm = ((yc - py) / 140) * YJ, it = I(ymm, lam, d, L, a); cx.fillStyle = cor(it); cx.fillRect(xs, py, ws, 1); } }
      else {
        acum += dt * Math.min(400, 3 + fotons.length / 2); const n = Math.floor(acum); acum -= n; /* começa com uns poucos fótons por segundo e vai acelerando */ for (let k = 0; k < n && fotons.length < 8000; k++) { for (let tent = 0; tent < 200; tent++) { const ymm = (Math.random() * 2 - 1) * YJ; if (Math.random() < I(ymm, lam, d, L, a)) { fotons.push([xs + 2 + Math.random() * (ws - 4), Y(ymm)]); break; } } }
        cx.fillStyle = cor(0.9); fotons.forEach(([px, py]) => cx.fillRect(px, py, 1.3, 1.3));
      }
      /* gráfico da intensidade ao lado e marcas previstas y = mλL/d */
      const gx = 560, gw = 100; cx.strokeStyle = css("--ink3"); cx.beginPath(); cx.moveTo(gx, 20); cx.lineTo(gx, 300); cx.stroke();
      cx.strokeStyle = cor(1); cx.lineWidth = 1.6; cx.beginPath(); for (let py = 20; py <= 300; py++) { const ymm = ((yc - py) / 140) * YJ, xx = gx + I(ymm, lam, d, L, a) * gw; py === 20 ? cx.moveTo(xx, py) : cx.lineTo(xx, py); } cx.stroke();
      if (modo === "foton" && fotons.length > 50) { const nb = 70, bins = new Array(nb).fill(0); fotons.forEach(([, py]) => { const k = Math.floor(((py - 20) / 280) * nb); if (k >= 0 && k < nb) bins[k]++; }); const mx = Math.max(...bins); cx.fillStyle = css("--ink2"); cx.globalAlpha = 0.35; bins.forEach((c, k) => cx.fillRect(gx, 20 + (k * 280) / nb, (c / mx) * gw, 280 / nb - 0.5)); cx.globalAlpha = 1; }
      const dy = SIM.fendaDupla._dy(lam, d, L); cx.strokeStyle = css("--warn"); cx.lineWidth = 1.5;
      for (let m = -40; m <= 40; m++) { const ym = m * dy; if (Math.abs(ym) > YJ) continue; const py = Y(ym); cx.beginPath(); cx.moveTo(xs - 10, py); cx.lineTo(xs - 2, py); cx.stroke(); }
      cx.fillStyle = css("--ink2"); cx.font = "11px Inter, sans-serif"; cx.fillText("tela", xs + 16, 14); cx.fillText("±15 mm", xs + 8, 314); cx.fillText("intensidade", gx + 6, 14); cx.fillText("fendas", xb - 18, 14);
      q("[data-v=lt]").innerHTML = vis("espaçamento previsto λL/d", n2(dy, 3) + " mm") + vis("máximos previstos na janela de ±15 mm", String(2 * Math.floor(YJ / dy) + 1)) + vis("diferença de caminho na 1ª franja", n2(lam, 0) + " nm = 1λ") + vis(modo === "foton" ? "fótons que chegaram" : "modo", modo === "foton" ? String(fotons.length) : "onda clássica");
    });
  };
})();
