/* Simulações da Mecânica (módulo A): A01 vai e volta (deslocamento × distância), A02 encontro de dois carros (MRU), A05 barco no rio, A06 lançamento oblíquo, A07 MCU e engrenagens, A08 Atwood e elevador,
   A03 MUV com gráficos e freada, A04 do gráfico v × t para x × t e a × t (área e inclinação). */
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
  const carro = (x, y, cor, dir) => window.D ? D.carro(x, y, cor, dir) : "";

  /* ---------- A01 · vai e volta ---------- */
  SIM.vaiVolta = (el, F) => {
    const W = 680, H = 230;
    let t = 0, rodando = true;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("trecho 1: velocidade v₁ (m/s)", "v1", -10, 10, 0.5, 8)}${sl("trecho 1: duração t₁ (s)", "t1", 1, 10, 0.5, 5)}${sl("trecho 2: velocidade v₂ (m/s)", "v2", -10, 10, 0.5, -4)}${sl("trecho 2: duração t₂ (s)", "t2", 1, 10, 0.5, 5)}
      <div class="bts"><button class="bt pri" data-a="re">Recomeçar</button></div></div>
      <div class="status">O carrinho anda com velocidade v₁ por t₁ segundos e depois com v₂ por t₂ (velocidade negativa = andando para a esquerda, no sentido contrário ao da trajetória orientada). Compare o deslocamento (posição final − posição inicial, com sinal) com a distância percorrida (o caminho todo, sempre positivo), e as duas "velocidades médias".</div>`);
    const q = (s) => el.querySelector(s);
    SIM.vaiVolta._conta = (v1, t1, v2, t2) => { const ds = v1 * t1 + v2 * t2, d = Math.abs(v1) * t1 + Math.abs(v2) * t2, T = t1 + t2; return { ds, d, T, vm: ds / T, vmEsc: d / T }; };
    anima(el, F, (dt) => {
      mostra(el, ["v1", "t1", "v2", "t2"]);
      const v1 = val(el, "v1"), t1 = val(el, "t1"), v2 = val(el, "v2"), t2 = val(el, "t2"), r = SIM.vaiVolta._conta(v1, t1, v2, t2);
      if (rodando) { t += dt; if (t >= r.T + 1.2) t = 0; }
      const tt = Math.min(t, r.T), s = tt <= t1 ? v1 * tt : v1 * t1 + v2 * (tt - t1);
      const esc = 6, X = (x) => W / 2 + x * esc, y = 130;
      let sv = (window.D ? D.estrada(W / 2 - 300, W / 2 + 300, y + 10, esc, 10, "m", false) : "");
      for (let u = -50; u <= 50; u += 10) sv += `<text class="tx2" x="${X(u)}" y="${y + 30}" text-anchor="middle">${String(u).replace("-", "−")}</text>`;
      const s1 = v1 * t1, sF = r.ds;
      sv += `<line x1="${X(0)}" y1="${y - 52}" x2="${X(s1)}" y2="${y - 52}" style="stroke:var(--mA);stroke-width:3;opacity:.6"/><line x1="${X(s1)}" y1="${y - 44}" x2="${X(sF)}" y2="${y - 44}" style="stroke:var(--mT);stroke-width:3;opacity:.6"/>`;
      if (window.D && Math.abs(sF) > 0.5) sv += D.seta(X(0), y - 72, X(sF), y - 72, "var(--warn)", 2.4) + D.txt((X(0) + X(sF)) / 2, y - 80, "Δs", "txm");
      sv += `<circle cx="${X(0)}" cy="${y + 10}" r="4" style="fill:var(--ink)"/>` + carro(X(s), y + 4, "var(--mod)", (tt <= t1 ? v1 : v2) >= 0 ? 1 : -1);
      sv += `<text class="tx2" x="12" y="22">t = ${n2(tt, 1)} s · posição s = ${n2(s, 1)} m</text>`;
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("deslocamento Δs = v₁t₁ + v₂t₂", n2(r.ds, 1) + " m") + vis("distância percorrida", n2(r.d, 1) + " m") + vis("velocidade escalar média Δs/Δt", n2(r.vm) + " m/s") + vis("rapidez média (distância/Δt)", n2(r.vmEsc) + " m/s");
    });
    q("[data-a=re]").addEventListener("click", () => (t = 0));
  };

  /* ---------- A02 · encontro de dois móveis em MRU ---------- */
  SIM.encontro = (el, F) => {
    const W = 680, H = 360;
    let t = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("A: posição inicial s₀A (m)", "sa", 0, 200, 5, 0)}${sl("A: velocidade vA (m/s)", "va", -20, 20, 1, 15)}${sl("B: posição inicial s₀B (m)", "sb", 0, 200, 5, 150)}${sl("B: velocidade vB (m/s)", "vb", -20, 20, 1, -10)}
      <div class="bts"><button class="bt pri" data-a="re">Recomeçar</button></div></div>
      <div class="status">Dois carros em MRU na mesma estrada. Embaixo, as funções horárias s(t) = s₀ + vt: duas retas. O encontro é onde as retas se cruzam: s₀A + vA·t = s₀B + vB·t. Pela velocidade relativa: a distância inicial diminui a |vA − vB| por segundo.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.encontro._conta = (sa, va, sb, vb) => { if (va === vb) return null; const te = (sb - sa) / (va - vb); return te >= 0 ? { te, se: sa + va * te } : null; };
    anima(el, F, (dt) => {
      mostra(el, ["sa", "va", "sb", "vb"], 0);
      const sa = val(el, "sa"), va = val(el, "va"), sb = val(el, "sb"), vb = val(el, "vb"), e = SIM.encontro._conta(sa, va, sb, vb);
      const Tmax = e ? Math.max(4, Math.min(30, e.te * 1.5)) : 12;
      t += dt; if (t > Tmax) t = 0;
      const X = (x) => 40 + (x / 220) * (W - 80), yE = 70;
      let sv = window.D ? D.estrada(40, W - 40, yE + 8, (W - 80) / 220, 20, "m") : "";
      const xa = sa + va * t, xb = sb + vb * t;
      sv += carro(X(xa), yE + 2, "var(--mA)", va >= 0 ? 1 : -1) + carro(X(xb), yE + 2, "var(--mT)", vb >= 0 ? 1 : -1);
      sv += `<text class="tx2" x="${X(xa)}" y="${yE - 34}" text-anchor="middle" style="fill:var(--mA)">A</text><text class="tx2" x="${X(xb)}" y="${yE - 34}" text-anchor="middle" style="fill:var(--mT)">B</text>`;
      if (window.D) {
        const smin = Math.min(0, sa + va * Tmax, sb + vb * Tmax), smax = Math.max(220, sa + va * Tmax, sb + vb * Tmax);
        sv += D.graf({ x0: 70, y0: 335, w: W - 130, h: 200, xmax: Tmax, ymin: smin, ymax: smax, xlab: "t (s)", ylab: "s (m)", xt: [0, Math.round(Tmax / 4), Math.round(Tmax / 2), Math.round((3 * Tmax) / 4)], yt: [0, 100, 200].filter((v) => v >= smin && v <= smax),
          curvas: [{ pts: [[0, sa], [Tmax, sa + va * Tmax]], cor: "var(--mA)" }, { pts: [[0, sb], [Tmax, sb + vb * Tmax]], cor: "var(--mT)" }], pontos: e && e.te <= Tmax ? [[e.te, e.se, "encontro"]] : [] });
        const Xg = 70 + (Math.min(t, Tmax) / Tmax) * (W - 130); sv += `<line x1="${Xg}" x2="${Xg}" y1="135" y2="335" style="stroke:var(--ink3);stroke-dasharray:3 3"/>`;
      }
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("instante do encontro (s₀B − s₀A)/(vA − vB)", e ? n2(e.te) + " s" : "não se encontram") + vis("posição do encontro", e ? n2(e.se, 1) + " m" : "—") + vis("velocidade de A em relação a B", n2(va - vb, 0) + " m/s") + vis("tempo agora", n2(t, 1) + " s");
    });
    q("[data-a=re]").addEventListener("click", () => (t = 0));
  };

  /* ---------- A03 · MUV com gráficos e freada ---------- */
  SIM.muv = (el, F) => {
    const W = 680, H = 400;
    let t = 0, modo = "livre";
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("velocidade inicial v₀ (m/s)", "v0", -10, 30, 0.5, 20)}${sl("aceleração a (m/s²)", "a", -8, 8, 0.25, -4)}${sl("tempo de reação (s), só na freada", "tr", 0, 2, 0.1, 0.8)}
      <div class="bts">${botoes([["livre", "MUV desde t = 0"], ["freada", "freada com tempo de reação"]], "m", modo)}<button class="bt pri" data-a="re">Recomeçar</button></div></div>
      <div class="status" data-v="txt"></div>`);
    const q = (s) => el.querySelector(s);
    const txt = { livre: "Aceleração constante: v(t) = v₀ + at é uma reta e s(t) = s₀ + v₀t + at²/2 é uma parábola. A área sob o gráfico v × t (com sinal) é o deslocamento; a inclinação do gráfico v × t é a aceleração. Com a e v₀ de sinais opostos, o corpo freia, para (vértice da parábola) e volta.", freada: "O motorista vê o perigo, leva o tempo de reação andando a v₀ (MRU) e só então freia com desaceleração |a| até parar. Distância total = v₀·t_reação + v₀²/(2|a|): dobrar a velocidade quadruplica a parte da freada." };
    SIM.muv._freada = (v0, a, tr) => ({ dr: v0 * tr, df: (v0 * v0) / (2 * Math.abs(a)), tpara: tr + v0 / Math.abs(a) });
    anima(el, F, (dt) => {
      mostra(el, ["v0", "a", "tr"], 2);
      const v0 = val(el, "v0"), a = val(el, "a"), tr = val(el, "tr"), fre = modo === "freada";
      q("[data-v=txt]").textContent = txt[modo];
      const aE = fre ? -Math.abs(a || 1) : a, v0E = fre ? Math.max(0.5, v0) : v0;
      const Tmax = fre ? tr + v0E / Math.abs(aE) + 0.5 : 8;
      t += dt; if (t > Tmax + 0.8) t = 0;
      const tt = Math.min(t, Tmax);
      const vDe = (x) => (fre ? (x < tr ? v0E : Math.max(0, v0E + aE * (x - tr))) : v0 + a * x);
      const sDe = (x) => { if (!fre) return v0 * x + (a * x * x) / 2; if (x < tr) return v0E * x; const tf = Math.min(x - tr, v0E / Math.abs(aE)); return v0E * tr + v0E * tf + (aE * tf * tf) / 2; };
      const pts = (fn) => Array.from({ length: 81 }, (_, i) => [(Tmax * i) / 80, fn((Tmax * i) / 80)]);
      const sp = pts(sDe), vp = pts(vDe), smin = Math.min(0, ...sp.map((p) => p[1])), smax = Math.max(1, ...sp.map((p) => p[1])), vmin = Math.min(0, ...vp.map((p) => p[1])), vmax = Math.max(1, ...vp.map((p) => p[1]));
      let sv = "";
      const xR = (x) => 40 + ((x - smin) / (smax - smin || 1)) * (W - 80);
      sv += `<line x1="30" x2="${W - 30}" y1="60" y2="60" style="stroke:var(--ink2);stroke-width:2"/>` + carro(xR(sDe(tt)), 54, "var(--mod)", vDe(tt) >= 0 ? 1 : -1);
      if (window.D) {
        const vSel = vp.filter((p) => p[0] <= tt);
        sv += D.graf({ x0: 60, y0: 230, w: 260, h: 120, xmax: Tmax, ymin: smin, ymax: smax, xlab: "t", ylab: "s (m)", xt: [0, +(Tmax).toFixed(1)], yt: [+smin.toFixed(0), +smax.toFixed(0)].filter((v, i, ar) => ar.indexOf(v) === i), curvas: [{ pts: sp, cor: "var(--mA)" }], pontos: [[tt, sDe(tt)]] });
        sv += D.graf({ x0: 380, y0: 230, w: 260, h: 120, xmax: Tmax, ymin: vmin, ymax: vmax, xlab: "t", ylab: "v (m/s)", xt: [0, +(Tmax).toFixed(1)], yt: [+vmin.toFixed(1), +vmax.toFixed(1)].filter((v, i, ar) => ar.indexOf(v) === i), curvas: [{ pts: vSel.length > 1 ? vSel : vp.slice(0, 2), cor: "var(--warn)", area: true }, { pts: vp, cor: "var(--mT)" }], pontos: [[tt, vDe(tt)]] });
      }
      sv += `<text class="tx2" x="12" y="${H - 14}">t = ${n2(tt, 2)} s · s = ${n2(sDe(tt), 1)} m · v = ${n2(vDe(tt), 2)} m/s</text>`;
      q("[data-v=sv]").innerHTML = sv;
      if (fre) { const r = SIM.muv._freada(v0E, aE, tr); q("[data-v=lt]").innerHTML = vis("andou durante a reação v₀·t_r", n2(r.dr, 1) + " m") + vis("andou freando v₀²/(2|a|)", n2(r.df, 1) + " m") + vis("distância total até parar", n2(r.dr + r.df, 1) + " m") + vis("tempo até parar", n2(r.tpara, 2) + " s"); }
      else { const tv = a !== 0 ? -v0 / a : NaN; q("[data-v=lt]").innerHTML = vis("v(t) = v₀ + at, agora", n2(vDe(tt)) + " m/s") + vis("s(t) = v₀t + at²/2, agora", n2(sDe(tt), 1) + " m") + vis("instante em que para (v = 0)", tv > 0 ? n2(tv) + " s" : "não para") + vis("Torricelli: v² − v₀² = 2aΔs", n2(vDe(tt) ** 2 - v0 * v0, 1) + " = " + n2(2 * a * sDe(tt), 1)); }
    });
    q("[data-a=re]").addEventListener("click", () => (t = 0));
    liga(el, "m", (v) => { modo = v; t = 0; });
  };

  /* ---------- A04 · gráficos: v × t → s × t (área) e a × t (inclinação) ---------- */
  SIM.graficos = (el, F) => {
    const W = 680, H = 470, TS = [0, 2, 4, 6, 8, 10];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${TS.map((t, i) => sl(`v em t = ${t} s (m/s)`, "v" + i, -10, 10, 1, [0, 6, 6, 2, -4, -4][i])).join("")}${sl("instante para ler (s)", "tl", 0, 10, 0.1, 5)}</div>
      <div class="status">Você desenha o gráfico v × t (segmentos de reta entre os pontos). O site calcula os outros dois: s × t pela área acumulada embaixo de v × t (partindo de s = 0) e a × t pela inclinação de cada segmento. Onde v cruza o zero, s tem um máximo ou mínimo; onde a inclinação de v muda, o gráfico de a dá um salto.</div>`);
    const q = (s) => el.querySelector(s);
    const vDe = (vs, t) => { const i = Math.min(4, Math.floor(t / 2)), f = (t - TS[i]) / 2; return vs[i] + (vs[i + 1] - vs[i]) * f; };
    const sDe = (vs, t) => { let s = 0; for (let i = 0; i < 5; i++) { const a = TS[i], b = Math.min(TS[i + 1], t); if (b <= a) break; s += ((vDe(vs, a) + vDe(vs, b)) / 2) * (b - a); } return s; };
    const aDe = (vs, t) => { const i = Math.min(4, Math.floor(t / 2)); return (vs[i + 1] - vs[i]) / 2; };
    SIM.graficos._conta = (vs, t) => ({ v: vDe(vs, t), s: sDe(vs, t), a: aDe(vs, t), dist: (() => { let d = 0, n = 2000; for (let k = 0; k < n; k++) { const x = (t * (k + 0.5)) / n; d += Math.abs(vDe(vs, x)) * (t / n); } return d; })() });
    anima(el, F, () => {
      const vs = TS.map((_, i) => val(el, "v" + i)), tl = val(el, "tl");
      TS.forEach((_, i) => (q(`[data-o=v${i}]`).textContent = n2(vs[i], 0))); q("[data-o=tl]").textContent = n2(tl, 1);
      const sp = D.amostra((t) => sDe(vs, t), 0, 10, 100), smin = Math.min(0, ...sp.map((p) => p[1])), smax = Math.max(1, ...sp.map((p) => p[1]));
      const vp = TS.map((t, i) => [t, vs[i]]), vSel = D.amostra((t) => vDe(vs, t), 0, tl, 50);
      const ap = []; for (let i = 0; i < 5; i++) { const a = (vs[i + 1] - vs[i]) / 2; ap.push([TS[i], a], [TS[i + 1], a]); }
      const amax = Math.max(1, ...ap.map((p) => Math.abs(p[1])));
      let sv = D.graf({ x0: 60, y0: 120, w: 560, h: 95, xmax: 10, ymin: smin, ymax: smax, xlab: "t (s)", ylab: "s (m)", xt: TS.slice(0, 5), yt: [Math.round(smin), Math.round(smax)].filter((v, i, ar) => ar.indexOf(v) === i), curvas: [{ pts: sp, cor: "var(--mA)" }], pontos: [[tl, sDe(vs, tl)]] });
      sv += D.graf({ x0: 60, y0: 285, w: 560, h: 120, xmax: 10, ymin: -10, ymax: 10, xlab: "t (s)", ylab: "v (m/s)", xt: TS.slice(0, 5), yt: [-10, 0, 10], curvas: [{ pts: vSel.length > 1 ? vSel : vp.slice(0, 2), cor: "var(--warn)", area: true }, { pts: vp, cor: "var(--mT)" }], pontos: vp.map(([t, v]) => [t, v]) });
      sv += D.graf({ x0: 60, y0: 445, w: 560, h: 90, xmax: 10, ymin: -amax, ymax: amax, xlab: "t (s)", ylab: "a (m/s²)", xt: TS.slice(0, 5), yt: [-Math.round(amax), 0, Math.round(amax)], curvas: [{ pts: ap, cor: "var(--mO)" }] });
      sv += `<line x1="${60 + tl * 56}" x2="${60 + tl * 56}" y1="10" y2="${H - 10}" style="stroke:var(--ink3);stroke-dasharray:3 3"/>`;
      q("[data-v=sv]").innerHTML = sv;
      const r = SIM.graficos._conta(vs, tl);
      q("[data-v=lt]").innerHTML = vis("v no instante", n2(r.v, 2) + " m/s") + vis("s = área acumulada sob v × t", n2(r.s, 2) + " m") + vis("a = inclinação de v × t", n2(r.a, 2) + " m/s²") + vis("distância percorrida (área de |v|)", n2(r.dist, 2) + " m");
    });
  };
  /* ---------- A05 · barco atravessando o rio (composição de velocidades) ---------- */
  SIM.barcoRio = (el, F) => {
    const W = 680, H = 360, Lrio = 100;
    let t = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("velocidade do barco em relação à água u (m/s)", "u", 0.5, 6, 0.1, 4)}${sl("correnteza w (m/s)", "w", 0, 6, 0.1, 3)}${sl("ângulo da proa θ (graus, + = rio acima)", "th", -80, 80, 1, 0)}
      <div class="bts"><button class="bt pri" data-a="re">Atravessar de novo</button><button class="bt peq" data-a="reto">Proa para chegar em frente</button></div></div>
      <div class="status">O rio tem 100 m de largura. A velocidade do barco em relação à margem é a soma vetorial da velocidade em relação à água (para onde a proa aponta) com a da correnteza: v = u + w (vetores). O tempo de travessia só depende da componente perpendicular à margem, u·cos θ.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.barcoRio._conta = (u, w, thDeg) => { const th = (thDeg * Math.PI) / 180, vy = u * Math.cos(th), vx = w - u * Math.sin(th); return { vy, vx, v: Math.hypot(vx, vy), t: Lrio / vy, deriva: (vx * Lrio) / vy }; };
    anima(el, F, (dt) => {
      mostra(el, ["u", "w"], 1); q("[data-o=th]").textContent = n2(val(el, "th"), 0) + "°";
      const u = val(el, "u"), w = val(el, "w"), th = val(el, "th"), r = SIM.barcoRio._conta(u, w, th);
      t += dt * 4; if (t > r.t + 3) t = 0;
      const tt = Math.min(t, r.t), esc = 2.2, y0 = 300, X0 = 300, X = (x) => X0 + x * esc, Y = (y) => y0 - y * esc;
      let sv = `<rect x="0" y="${Y(Lrio)}" width="${W}" height="${Lrio * esc}" style="fill:color-mix(in srgb,var(--mC) 14%,transparent)"/><line x1="0" x2="${W}" y1="${y0}" y2="${y0}" style="stroke:var(--ink2);stroke-width:2"/><line x1="0" x2="${W}" y1="${Y(Lrio)}" y2="${Y(Lrio)}" style="stroke:var(--ink2);stroke-width:2"/>`;
      for (let i = 0; i < 7; i++) { const xx = ((i * 110 + t * w * esc * 3) % (W + 60)) - 30; sv += D.seta(xx, Y(Lrio / 2) + 30, xx + 26, Y(Lrio / 2) + 30, "color-mix(in srgb,var(--mC) 60%,transparent)", 1.2); }
      const bx = r.vx * tt, by = r.vy * tt;
      sv += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(r.deriva)}" y2="${Y(Lrio)}" style="stroke:var(--warn);stroke-dasharray:5 4;stroke-width:1.6"/><circle cx="${X(0)}" cy="${Y(0)}" r="4" style="fill:var(--ink)"/><circle cx="${X(0)}" cy="${Y(Lrio)}" r="4" style="fill:var(--ink3)"/>`;
      const bxp = X(bx), byp = Y(by), k = 9, ang = (Math.atan2(-u * Math.cos((th * Math.PI) / 180), -u * Math.sin((th * Math.PI) / 180)) * 180) / Math.PI;
      sv += `<g transform="translate(${bxp} ${byp}) rotate(${ang + 90})"><path d="M0 -14 L7 6 L-7 6 Z" style="fill:var(--mA)"/></g>`;
      sv += D.seta(bxp, byp, bxp - u * Math.sin((th * Math.PI) / 180) * k, byp - u * Math.cos((th * Math.PI) / 180) * k, "var(--mA)", 2) + D.seta(bxp, byp, bxp + w * k, byp, "var(--mC)", 2) + D.seta(bxp, byp, bxp + r.vx * k, byp - r.vy * k, "var(--warn)", 2.4);
      sv += `<text class="tx2" x="12" y="20"><tspan style="fill:var(--mA)">vetor u (proa)</tspan> + <tspan style="fill:var(--mC)">vetor w (correnteza)</tspan> = <tspan style="fill:var(--warn)">vetor v (em relação à margem)</tspan></text>`;
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("tempo de travessia L/(u cos θ)", r.vy > 0 ? n2(r.t, 1) + " s" : "não atravessa") + vis("deslocamento rio abaixo na chegada", n2(r.deriva, 1) + " m") + vis("velocidade em relação à margem |v|", n2(r.v) + " m/s") + vis("proa para chegar em frente (sen θ = w/u)", w <= u ? n2((Math.asin(w / u) * 180) / Math.PI, 1) + "°" : "impossível (w > u)");
    });
    q("[data-a=re]").addEventListener("click", () => (t = 0));
    q("[data-a=reto]").addEventListener("click", () => { const u = val(el, "u"), w = val(el, "w"); if (w <= u) { const i = q("[data-c=th]"); i.value = Math.round((Math.asin(w / u) * 180) / Math.PI); t = 0; } });
  };

  /* ---------- A06 · lançamento oblíquo ---------- */
  SIM.lancamento = (el, F) => {
    const W = 680, H = 360, g = 10;
    let t = 0, rastros = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("velocidade inicial v₀ (m/s)", "v0", 5, 30, 0.5, 20)}${sl("ângulo θ (graus)", "th", 0, 90, 1, 45)}${sl("altura de lançamento h (m)", "h", 0, 30, 1, 0)}
      <div class="bts"><button class="bt pri" data-a="go">Lançar</button><button class="bt peq" data-a="limpa">Apagar trajetórias</button><button class="bt peq" data-a="env">Mostrar parábola de segurança</button></div></div>
      <div class="status">Sem resistência do ar: na horizontal, MRU com v₀ cos θ; na vertical, MUV com aceleração −g (g = 10 m/s²). Lance várias vezes com a mesma velocidade e ângulos diferentes: 30° e 60° dão o mesmo alcance (do chão), e 45° dá o maior. A linha tracejada é a parábola de segurança: nenhum lançamento com essa v₀ passa dela.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.lancamento._conta = (v0, thDeg, h) => { const th = (thDeg * Math.PI) / 180, vx = v0 * Math.cos(th), vy = v0 * Math.sin(th), tv = (vy + Math.sqrt(vy * vy + 2 * g * h)) / g; return { tv, alc: vx * tv, H: h + (vy * vy) / (2 * g), ts: vy / g, vChao: Math.sqrt(v0 * v0 + 2 * g * h) }; };
    let env = false;
    anima(el, F, (dt) => {
      mostra(el, ["v0", "h"], 1); q("[data-o=th]").textContent = n2(val(el, "th"), 0) + "°";
      const v0 = val(el, "v0"), th = val(el, "th"), h = val(el, "h"), r = SIM.lancamento._conta(v0, th, h), thr = (th * Math.PI) / 180;
      t += dt; const tt = Math.min(t, r.tv);
      const esc = Math.min(580 / 100, 260 / 60), X = (x) => 60 + x * esc, Y = (y) => 320 - y * esc;
      let sv = `<line x1="40" x2="${W - 20}" y1="320" y2="320" style="stroke:var(--ink2);stroke-width:2"/>`;
      for (let x = 0; x <= 100; x += 10) sv += `<line x1="${X(x)}" x2="${X(x)}" y1="317" y2="323" style="stroke:var(--ink3)"/><text class="tx2" x="${X(x)}" y="340" text-anchor="middle">${x}</text>`;
      if (h > 0) sv += `<rect x="${X(0) - 18}" y="${Y(h)}" width="18" height="${h * esc}" style="fill:var(--line2)"/>`;
      if (env) { let d = ""; for (let i = 0; i <= 100; i++) { const x = i; const y = h + (v0 * v0) / (2 * g) - (g * x * x) / (2 * v0 * v0); if (y < 0) break; d += (i ? "L" : "M") + X(x).toFixed(1) + " " + Y(y).toFixed(1); } sv += `<path d="${d}" style="fill:none;stroke:var(--warn);stroke-width:1.6;stroke-dasharray:6 5"/>`; }
      rastros.forEach((rr) => (sv += `<path d="${rr}" style="fill:none;stroke:var(--ink3);stroke-width:1.4;opacity:.7"/>`));
      let d = ""; for (let i = 0; i <= 60; i++) { const s = (tt * i) / 60; d += (i ? "L" : "M") + X(v0 * Math.cos(thr) * s).toFixed(1) + " " + Y(h + v0 * Math.sin(thr) * s - (g * s * s) / 2).toFixed(1); }
      sv += `<path d="${d}" style="fill:none;stroke:var(--mA);stroke-width:2.4"/>`;
      const xb = v0 * Math.cos(thr) * tt, yb = h + v0 * Math.sin(thr) * tt - (g * tt * tt) / 2, vy = v0 * Math.sin(thr) - g * tt;
      sv += `<circle cx="${X(xb)}" cy="${Y(yb)}" r="6" style="fill:var(--mA)"/>` + D.seta(X(xb), Y(yb), X(xb) + v0 * Math.cos(thr) * 2.2, Y(yb), "var(--mC)", 1.8);
      sv += D.seta(X(xb), Y(yb), X(xb), Y(yb) - vy * 2.2, "var(--mT)", 1.8) + D.seta(X(xb), Y(yb), X(xb) + v0 * Math.cos(thr) * 2.2, Y(yb) - vy * 2.2, "var(--warn)", 2.2);
      sv += `<text class="tx2" x="12" y="20">t = ${n2(tt, 2)} s · <tspan style="fill:var(--mC)">vₓ = ${n2(v0 * Math.cos(thr), 2)} m/s (constante)</tspan> · <tspan style="fill:var(--mT)">v_y = ${n2(vy, 2)} m/s</tspan></text>`;
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("tempo de voo", n2(r.tv, 2) + " s") + vis("alcance horizontal", n2(r.alc, 2) + " m") + vis("altura máxima h + (v₀ sen θ)²/2g", n2(r.H, 2) + " m") + vis("velocidade ao chegar ao chão", n2(r.vChao, 2) + " m/s");
    });
    q("[data-a=go]").addEventListener("click", () => { const v0 = val(el, "v0"), th = (val(el, "th") * Math.PI) / 180, h = val(el, "h"), r = SIM.lancamento._conta(v0, val(el, "th"), h), esc = Math.min(580 / 100, 260 / 60); let d = ""; for (let i = 0; i <= 60; i++) { const s = (r.tv * i) / 60; d += (i ? "L" : "M") + (60 + v0 * Math.cos(th) * s * esc).toFixed(1) + " " + (320 - (h + v0 * Math.sin(th) * s - 5 * s * s) * esc).toFixed(1); } rastros.push(d); if (rastros.length > 8) rastros.shift(); t = 0; });
    q("[data-a=limpa]").addEventListener("click", () => (rastros = []));
    q("[data-a=env]").addEventListener("click", (e) => { env = !env; e.currentTarget.textContent = env ? "Esconder parábola de segurança" : "Mostrar parábola de segurança"; });
  };
  /* ---------- A07 · MCU e transmissão por engrenagens ---------- */
  SIM.circular = (el, F) => {
    const W = 680, H = 330;
    let modo = "mcu", ang = 0, ang2 = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("frequência f (voltas por segundo)", "f", 0.05, 1, 0.01, 0.25)}${sl("raio R (m), ou raio da engrenagem 1", "r1", 0.2, 1.2, 0.05, 0.8)}${sl("raio da engrenagem 2 (m)", "r2", 0.2, 1.2, 0.05, 0.4)}
      <div class="bts">${botoes([["mcu", "MCU: velocidade e aceleração"], ["eng", "duas engrenagens"]], "m", modo)}</div></div>
      <div class="status" data-v="txt"></div>`);
    const q = (s) => el.querySelector(s);
    const txt = { mcu: "No movimento circular uniforme, a rapidez é constante, mas a velocidade (seta azul, tangente) muda de direção o tempo todo. A aceleração (seta laranja) aponta sempre para o centro: a centrípeta, ω²R = v²/R.", eng: "Engrenagens em contato têm a mesma velocidade linear no ponto de contato (os dentes não escorregam): ω₁R₁ = ω₂R₂. A menor gira mais rápido, e no sentido contrário." };
    SIM.circular._conta = (f, R) => ({ w: 2 * Math.PI * f, v: 2 * Math.PI * f * R, ac: (2 * Math.PI * f) ** 2 * R, T: 1 / f });
    anima(el, F, (dt) => {
      const f = val(el, "f"), r1 = val(el, "r1"), r2 = val(el, "r2");
      mostra(el, ["f", "r1", "r2"], 2);
      q("[data-v=txt]").textContent = txt[modo];
      const w = 2 * Math.PI * f; ang += w * dt;
      let sv = "";
      if (modo === "mcu") {
        const esc = 120, cx = 230, cy = 165, Rp = r1 * esc, x = cx + Rp * Math.cos(ang), y = cy - Rp * Math.sin(ang), c = SIM.circular._conta(f, r1);
        sv += `<circle cx="${cx}" cy="${cy}" r="${Rp}" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/><circle cx="${cx}" cy="${cy}" r="3" style="fill:var(--ink)"/><line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" style="stroke:var(--ink3)"/>`;
        const kv = 40, ka = 22; sv += D.seta(x, y, x - Math.sin(ang) * c.v * kv, y - Math.cos(ang) * c.v * kv, "var(--mA)", 2.4) + D.seta(x, y, x - Math.cos(ang) * Math.min(90, c.ac * ka), y + Math.sin(ang) * Math.min(90, c.ac * ka), "var(--warn)", 2.4);
        sv += `<circle cx="${x}" cy="${y}" r="8" style="fill:var(--mod)"/><text class="tx2" x="${cx}" y="${cy + Rp + 22}" text-anchor="middle">R = ${n2(r1)} m</text>`;
        sv += `<text class="tx2" x="440" y="110" style="fill:var(--mA)">velocidade (tangente)</text><text class="tx2" x="440" y="134" style="fill:var(--warn)">aceleração (para o centro)</text><text class="tx2" x="440" y="170">θ = ${n2((ang % (2 * Math.PI)) * 180 / Math.PI, 0)}°</text>`;
        q("[data-v=lt]").innerHTML = vis("período T = 1/f", n2(c.T, 2) + " s") + vis("velocidade angular ω = 2πf", n2(c.w, 3) + " rad/s") + vis("rapidez v = ωR", n2(c.v, 3) + " m/s") + vis("aceleração centrípeta ω²R", n2(c.ac, 3) + " m/s²");
      } else {
        const esc = 110, c1 = [200, 165], c2 = [200 + (r1 + r2) * esc, 165], w2 = (w * r1) / r2; ang2 = -(ang * r1) / r2;
        const engr = ([cx, cy], R, a, cor) => { const n = Math.max(8, Math.round(R * 22)); let d = ""; for (let i = 0; i < 2 * n; i++) { const t = a + (i * Math.PI) / n, rr = R * esc + (i % 2 ? -5 : 5); d += (i ? "L" : "M") + (cx + rr * Math.cos(t)).toFixed(1) + " " + (cy - rr * Math.sin(t)).toFixed(1); } return `<path d="${d} Z" style="fill:color-mix(in srgb,${cor} 20%,transparent);stroke:${cor};stroke-width:2"/><line x1="${cx}" y1="${cy}" x2="${cx + R * esc * 0.85 * Math.cos(a)}" y2="${cy - R * esc * 0.85 * Math.sin(a)}" style="stroke:${cor};stroke-width:3"/><circle cx="${cx}" cy="${cy}" r="4" style="fill:var(--ink)"/>`; };
        sv += engr(c1, r1, ang, "var(--mA)") + engr(c2, r2, ang2 + Math.PI / Math.max(8, Math.round(r2 * 22)), "var(--mT)");
        q("[data-v=lt]").innerHTML = vis("ω₁ = 2πf", n2(w, 3) + " rad/s") + vis("ω₂ = ω₁R₁/R₂", n2(w2, 3) + " rad/s") + vis("rapidez no contato ω₁R₁", n2(w * r1, 3) + " m/s") + vis("f₂ (voltas por segundo)", n2(w2 / (2 * Math.PI), 3));
      }
      q("[data-v=sv]").innerHTML = sv;
    });
    liga(el, "m", (v) => (modo = v));
  };
  /* ---------- A08 · máquina de Atwood e elevador (peso aparente) ---------- */
  SIM.atwood = (el, F) => {
    const W = 680, H = 360, g = 10;
    let modo = "atwood", y = 0, v = 0, t = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("massa 1 (kg), ou massa da pessoa", "m1", 0.5, 80, 0.5, 3)}${sl("massa 2 (kg)", "m2", 0.5, 10, 0.5, 2)}${sl("aceleração do elevador a (m/s²)", "ae", -10, 10, 0.5, 2)}
      <div class="bts">${botoes([["atwood", "máquina de Atwood"], ["elev", "elevador com balança"]], "m", modo)}<button class="bt pri" data-a="re">Soltar de novo</button></div></div>
      <div class="status" data-v="txt"></div>`);
    const q = (s) => el.querySelector(s);
    const txt = { atwood: "Dois blocos ligados por um fio ideal numa polia ideal. A massa maior desce e puxa a menor com a mesma aceleração. Segunda lei em cada bloco: m₁g − T = m₁a e T − m₂g = m₂a. Somando, a = (m₁ − m₂)g/(m₁ + m₂). A tração fica entre os dois pesos.", elev: "Uma pessoa sobre uma balança dentro de um elevador. A balança mede a normal N, não o peso. Com o elevador acelerando para cima, N = m(g + a) é maior que mg; acelerando para baixo, menor; em queda livre (a = −g), a balança marca zero: \"sem peso\"." };
    SIM.atwood._conta = (m1, m2) => ({ a: ((m1 - m2) * g) / (m1 + m2), T: (2 * m1 * m2 * g) / (m1 + m2) });
    SIM.atwood._balanca = (m, a) => m * (g + a);
    anima(el, F, (dt) => {
      const m1 = val(el, "m1"), m2 = val(el, "m2"), ae = val(el, "ae");
      mostra(el, ["m1", "m2", "ae"], 1);
      q("[data-v=txt]").textContent = txt[modo];
      let sv = "";
      if (modo === "atwood") {
        const c = SIM.atwood._conta(m1, m2);
        if (Math.abs(y) < 0.75) { v += c.a * dt; y += v * dt * 0.25; } else { v = 0; y = Math.sign(y) * 0.75; }
        const cx = 300, cy = 50, r = 34, L1 = 120 + y * 100, L2 = 120 - y * 100, s1 = 20 + Math.cbrt(m1) * 10, s2 = 20 + Math.cbrt(m2) * 10;
        sv += `<line x1="${cx - 60}" y1="14" x2="${cx + 60}" y2="14" style="stroke:var(--ink2);stroke-width:4"/><line x1="${cx}" y1="14" x2="${cx}" y2="${cy}" style="stroke:var(--ink2);stroke-width:2"/><circle cx="${cx}" cy="${cy}" r="${r}" style="fill:color-mix(in srgb,var(--ink3) 25%,transparent);stroke:var(--ink2);stroke-width:2"/>`;
        sv += `<line x1="${cx - r}" y1="${cy}" x2="${cx - r}" y2="${cy + L1}" style="stroke:var(--ink);stroke-width:1.6"/><line x1="${cx + r}" y1="${cy}" x2="${cx + r}" y2="${cy + L2}" style="stroke:var(--ink);stroke-width:1.6"/>`;
        sv += `<rect x="${cx - r - s1 / 2}" y="${cy + L1}" width="${s1}" height="${s1}" style="fill:color-mix(in srgb,var(--mA) 35%,transparent);stroke:var(--mA);stroke-width:2"/><text class="tx2" x="${cx - r}" y="${cy + L1 + s1 / 2 + 4}" text-anchor="middle">1</text>`;
        sv += `<rect x="${cx + r - s2 / 2}" y="${cy + L2}" width="${s2}" height="${s2}" style="fill:color-mix(in srgb,var(--mT) 35%,transparent);stroke:var(--mT);stroke-width:2"/><text class="tx2" x="${cx + r}" y="${cy + L2 + s2 / 2 + 4}" text-anchor="middle">2</text>`;
        sv += D.seta(cx - r - s1 / 2 - 14, cy + L1 + 4, cx - r - s1 / 2 - 14, cy + L1 - 36, "var(--ink2)", 1.6) + D.txt(cx - r - s1 / 2 - 20, cy + L1 - 18, "T", "txm", "end") + D.seta(cx - r - s1 / 2 - 14, cy + L1 + s1 - 4, cx - r - s1 / 2 - 14, cy + L1 + s1 + 30, "var(--warn)", 1.6) + D.txt(cx - r - s1 / 2 - 20, cy + L1 + s1 + 24, "m₁g", "tx2", "end");
        q("[data-v=lt]").innerHTML = vis("aceleração (m₁ − m₂)g/(m₁ + m₂)", n2(c.a, 3) + " m/s²") + vis("tração 2m₁m₂g/(m₁ + m₂)", n2(c.T, 2) + " N") + vis("pesos m₁g e m₂g", n2(m1 * g, 1) + " N e " + n2(m2 * g, 1) + " N") + vis("quem desce", c.a > 0 ? "bloco 1" : c.a < 0 ? "bloco 2" : "ninguém (equilíbrio)");
      } else {
        t += dt; const N = SIM.atwood._balanca(m1, ae), ex = 200, ey = 40;
        sv += `<rect x="${ex}" y="${ey}" width="280" height="280" rx="6" style="fill:color-mix(in srgb,var(--mod) 8%,transparent);stroke:var(--mod);stroke-width:2"/><line x1="${ex + 140}" y1="0" x2="${ex + 140}" y2="${ey}" style="stroke:var(--ink2);stroke-width:2"/>`;
        sv += `<rect x="${ex + 100}" y="${ey + 250}" width="80" height="16" style="fill:var(--ink3)"/><text class="tx2" x="${ex + 140}" y="${ey + 246}" text-anchor="middle">${n2(Math.max(0, N), 0)} N</text>`;
        sv += `<circle cx="${ex + 140}" cy="${ey + 120}" r="16" style="fill:var(--warn)"/><line x1="${ex + 140}" y1="${ey + 136}" x2="${ex + 140}" y2="${ey + 200}" style="stroke:var(--warn);stroke-width:6"/><line x1="${ex + 140}" y1="${ey + 200}" x2="${ex + 124}" y2="${ey + 248}" style="stroke:var(--warn);stroke-width:5"/><line x1="${ex + 140}" y1="${ey + 200}" x2="${ex + 156}" y2="${ey + 248}" style="stroke:var(--warn);stroke-width:5"/>`;
        if (ae !== 0) sv += D.seta(ex + 320, ey + 140, ex + 320, ey + 140 - Math.sign(ae) * Math.min(90, Math.abs(ae) * 9), "var(--mA)", 2.4) + D.txt(ex + 334, ey + 140, "a", "txm", "start");
        q("[data-v=lt]").innerHTML = vis("peso real mg", n2(m1 * g, 0) + " N") + vis("balança marca N = m(g + a)", n2(Math.max(0, N), 0) + " N") + vis("\"peso aparente\" em kg", n2(Math.max(0, N) / g, 1) + " kg") + vis("situação", ae > 0 ? "parece mais pesado" : ae < 0 ? (ae <= -g ? "queda livre: sem peso aparente" : "parece mais leve") : "como parado (ou em MRU)");
      }
      q("[data-v=sv]").innerHTML = sv;
    });
    q("[data-a=re]").addEventListener("click", () => { y = 0; v = 0; });
    liga(el, "m", (k) => { modo = k; y = 0; v = 0; });
  };
})();
