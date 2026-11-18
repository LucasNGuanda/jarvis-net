/* Simulações da Mecânica (módulo A): A01 vai e volta (deslocamento × distância), A02 encontro de dois carros (MRU), A05 barco no rio, A06 lançamento oblíquo, A07 MCU e engrenagens, A08 Atwood e elevador, A09 plano com atrito, A10 curva, A11 pista de skate, A12 impulso (F × t), A12b barco e centro de massa, A13 colisão 1D, A14a corrida de rolamento, A14 gangorra, A15 órbita de Kepler, A16 canhão de Newton, A17 empuxo, A18 jato de Torricelli, A20 massa–mola,
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
  /* nome: "Vai e volta: deslocamento × distância" · matéria: Física · tema: A01 */
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
  /* nome: "Encontro de dois carros" · matéria: Física · tema: A02 */
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
  /* nome: "MUV: gráficos e freada" · matéria: Física · tema: A03 */
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
  /* nome: "Do gráfico v × t para s × t e a × t" · matéria: Física · tema: A04 */
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
  /* nome: "Barco atravessando o rio" · matéria: Física · tema: A05 */
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
  /* nome: "Lançamento oblíquo" · matéria: Física · tema: A06 */
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
  /* nome: "MCU e engrenagens" · matéria: Física · tema: A07 */
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
  /* nome: "Máquina de Atwood e elevador" · matéria: Física · tema: A08 */
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
  /* ---------- A09 · plano inclinado com atrito ---------- */
  /* nome: "Plano inclinado com atrito" · matéria: Física · tema: A09 */
  SIM.planoAtrito = (el, F) => {
    const W = 680, H = 330, g = 10;
    let x = 0, v = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("ângulo do plano θ (graus)", "th", 0, 60, 1, 30)}${sl("atrito estático μe", "me", 0, 1.2, 0.01, 0.7)}${sl("atrito cinético μc", "mc", 0, 1.2, 0.01, 0.5)}
      <div class="bts"><button class="bt pri" data-a="re">Recolocar o bloco</button></div></div>
      <div class="status">Aumente o ângulo devagar: enquanto tg θ ≤ μe, o atrito estático segura o bloco (ele vale exatamente mg sen θ, não μe·N). Quando tg θ passa de μe, o bloco escorrega e o atrito vira o cinético, μc·N, menor. Por isso é mais fácil manter algo deslizando do que tirá-lo do lugar.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.planoAtrito._conta = (thDeg, me, mc) => { const t = (thDeg * Math.PI) / 180, N = Math.cos(t), comp = Math.sin(t); const desliza = Math.tan(t) > me + 1e-12; return { desliza, a: desliza ? g * (comp - mc * N) : 0, fat: desliza ? mc * N * g : comp * g, Nm: N * g, crit: (Math.atan(me) * 180) / Math.PI }; };
    anima(el, F, (dt) => {
      const th = val(el, "th"), me = val(el, "me"), mc = Math.min(val(el, "mc"), val(el, "me"));
      q("[data-o=th]").textContent = n2(th, 0) + "°"; mostra(el, ["me", "mc"], 2);
      const c = SIM.planoAtrito._conta(th, me, mc);
      if (c.desliza && x < 2.4) { v += c.a * dt; x += v * dt * 0.5; } else if (!c.desliza) { v = 0; }
      const t = (th * Math.PI) / 180, L = 340, x0 = 150, y0 = 280, xt = x0 + L * Math.cos(t), yt = y0 - L * Math.sin(t);
      const s = 280 - Math.min(x, 2.4) * 100, cx = x0 + s * Math.cos(t), cy = y0 - s * Math.sin(t);
      let sv = `<polygon points="${x0},${y0} ${xt},${y0} ${xt},${yt}" style="fill:var(--line2);stroke:var(--ink2)"/>`;
      sv += `<g transform="translate(${cx} ${cy}) rotate(${-th})"><rect x="-22" y="-30" width="44" height="30" style="fill:color-mix(in srgb,var(--mA) 30%,transparent);stroke:var(--mA);stroke-width:2"/></g>`;
      const nx = -Math.sin(t), ny = -Math.cos(t), mx = cx + nx * 15, my = cy + ny * 15, k = 6;
      sv += D.seta(mx, my, mx, my + 10 * k, "var(--warn)", 2) + D.txt(mx + 8, my + 10 * k, "P", "txm", "start");
      sv += D.seta(mx, my, mx + nx * c.Nm * k, my + ny * c.Nm * k, "var(--mC)", 2) + D.txt(mx + nx * c.Nm * k - 6, my + ny * c.Nm * k, "N", "txm", "end");
      if (c.fat > 0.01) sv += D.seta(mx, my, mx + Math.cos(t) * c.fat * k, my - Math.sin(t) * c.fat * k, "var(--mT)", 2) + D.txt(mx + Math.cos(t) * c.fat * k + 8, my - Math.sin(t) * c.fat * k - 4, "f", "txm", "start");
      sv += `<text class="tx2" x="${x0 + 40}" y="${y0 - 8}">θ</text><text class="tx2" x="16" y="22">${c.desliza ? "deslizando: atrito cinético" : "parado: atrito estático"}</text>`;
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("ângulo crítico arctg μe", n2(c.crit, 1) + "°") + vis("normal (por kg) g cos θ", n2(c.Nm, 2) + " N") + vis("atrito (por kg)", n2(c.fat, 2) + " N") + vis("aceleração g(sen θ − μc cos θ)", n2(c.a, 2) + " m/s²");
    });
    q("[data-a=re]").addEventListener("click", () => { x = 0; v = 0; });
    ["th", "me"].forEach((c) => q(`[data-c=${c}]`).addEventListener("input", () => { if (!SIM.planoAtrito._conta(val(el, "th"), val(el, "me"), val(el, "mc")).desliza) { x = 0; v = 0; } }));
  };
  /* ---------- A10 · carro na curva (plana ou inclinada, com atrito) ---------- */
  /* nome: "Carro na curva" · matéria: Física · tema: A10 */
  SIM.curva = (el, F) => {
    const W = 680, H = 330, g = 10;
    let ang = 0, sai = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("velocidade v (m/s)", "v", 1, 40, 0.5, 18)}${sl("raio da curva R (m)", "R", 20, 200, 5, 80)}${sl("atrito estático μe", "mu", 0, 1.2, 0.01, 0.5)}${sl("inclinação da pista θ (graus)", "th", 0, 45, 1, 0)}
      <div class="bts"><button class="bt pri" data-a="re">Recomeçar</button></div></div>
      <div class="status">Visto de cima (à esquerda) e em corte (à direita). Para fazer a curva, a resultante precisa apontar para o centro e valer mv²/R. Na pista plana, quem faz isso é o atrito. Na pista inclinada, a normal também ajuda: existe uma velocidade em que nem precisa de atrito, v = √(gR tg θ). Passando de v_máx, o carro escapa pela tangente.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.curva._conta = (R, thDeg, mu) => { const t = (thDeg * Math.PI) / 180, s = Math.sin(t), c = Math.cos(t); const den = c - mu * s; return { vmax: den > 0 ? Math.sqrt((R * g * (s + mu * c)) / den) : Infinity, vmin: s > mu * c ? Math.sqrt((R * g * (s - mu * c)) / (c + mu * s)) : 0, vsem: Math.sqrt(R * g * Math.tan(t)) }; };
    anima(el, F, (dt) => {
      const v = val(el, "v"), Rr = val(el, "R"), mu = val(el, "mu"), th = val(el, "th"), c = SIM.curva._conta(Rr, th, mu);
      mostra(el, ["v", "R", "mu"], 2); q("[data-o=th]").textContent = n2(th, 0) + "°";
      const ok = v <= c.vmax + 1e-9 && v >= c.vmin - 1e-9;
      const cx = 170, cy = 165, Rp = 120;
      if (ok) { sai = 0; ang += (v / Rr) * dt * 2; } else sai += dt * v * 3;
      const px = cx + Rp * Math.cos(ang), py = cy - Rp * Math.sin(ang), tx = -Math.sin(ang), ty = -Math.cos(ang);
      const X = px + tx * sai, Y = py + ty * sai;
      let sv = `<circle cx="${cx}" cy="${cy}" r="${Rp}" style="fill:none;stroke:var(--ink3);stroke-width:14;opacity:.35"/><circle cx="${cx}" cy="${cy}" r="3" style="fill:var(--ink)"/>`;
      sv += `<circle cx="${X}" cy="${Y}" r="9" style="fill:${ok ? "var(--mA)" : "var(--bad)"}"/>` + D.seta(X, Y, X + tx * 40, Y + ty * 40, "var(--ink2)", 1.6) + (ok ? D.seta(X, Y, X + (cx - X) * 0.35, Y + (cy - Y) * 0.35, "var(--warn)", 2.2) : "");
      /* corte da pista */
      const t = (th * Math.PI) / 180, bx = 500, by = 230;
      sv += `<g transform="translate(${bx} ${by}) rotate(${-th})"><line x1="-110" y1="0" x2="110" y2="0" style="stroke:var(--ink2);stroke-width:4"/><rect x="-25" y="-22" width="50" height="22" style="fill:color-mix(in srgb,var(--mA) 30%,transparent);stroke:var(--mA);stroke-width:2"/></g>`;
      sv += D.seta(bx, by - 12, bx - 70, by - 12, "var(--warn)", 2) + D.txt(bx - 74, by - 18, "para o centro", "tx2", "end");
      sv += `<text class="tx2" x="16" y="22">${ok ? "fazendo a curva" : v > c.vmax ? "rápido demais: escapa para fora" : "devagar demais: escorrega para dentro"}</text>`;
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("aceleração centrípeta v²/R", n2((v * v) / Rr, 2) + " m/s²") + vis("velocidade máxima", isFinite(c.vmax) ? n2(c.vmax, 1) + " m/s" : "sem limite") + vis("velocidade mínima", n2(c.vmin, 1) + " m/s") + vis("velocidade sem precisar de atrito √(gR tg θ)", n2(c.vsem, 1) + " m/s");
    });
    q("[data-a=re]").addEventListener("click", () => { sai = 0; ang = 0; });
  };
  /* ---------- A11 · pista de skate: energia cinética, potencial e dissipada ---------- */
  /* nome: "Pista de skate: energia" · matéria: Física · tema: A11 */
  SIM.pista = (el, F) => {
    const W = 680, H = 340, g = 10, m = 50;
    const yDe = (x) => 3.2 + 2.8 * Math.cos((Math.PI * x) / 10) * (1 - 0.15 * Math.abs(x - 10) / 10) - 0.9 * Math.exp(-((x - 13) ** 2) / 2) + 0.8 * Math.exp(-((x - 6) ** 2) / 1.5);
    let x = 0.4, dir = 1, Ed = 0, E0 = null, parado = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("posição de largada (m)", "x0", 0, 4, 0.1, 0.4)}${sl("atrito (μ)", "mu", 0, 0.15, 0.005, 0)}
      <div class="bts"><button class="bt pri" data-a="re">Soltar</button></div></div>
      <div class="status">Um skatista de 50 kg é solto do repouso. Sem atrito, a energia mecânica (cinética + potencial) é constante: ele volta exatamente à altura de onde saiu e nunca passa dela. Com atrito, parte vira calor (a barra vermelha), e cada subida é mais baixa. A energia total (as três barras somadas) continua constante.</div>`);
    const q = (s) => el.querySelector(s);
    const reinicia = () => { x = val(el, "x0"); dir = 1; Ed = 0; E0 = m * g * yDe(x); parado = false; };
    SIM.pista._v = (h0, h) => Math.sqrt(Math.max(0, 2 * g * (h0 - h)));
    reinicia();
    anima(el, F, (dt) => {
      const mu = val(el, "mu"); mostra(el, ["x0"], 1); mostra(el, ["mu"], 3);
      const n = 40, h = dt / n;
      for (let i = 0; i < n && !parado; i++) {
        const Ep = m * g * yDe(x), Ec = E0 - Ed - Ep;
        if (Ec <= 0) { const dy = (yDe(x + 1e-3) - yDe(x - 1e-3)) / 2e-3; if (mu > 0 && Math.abs(dy) < mu) { parado = true; break; } dir = dy > 0 ? -1 : 1; x += dir * 0.003; continue; } /* ponto de virada: segue morro abaixo */
        const v = Math.sqrt((2 * Ec) / m), dydx = (yDe(x + 1e-4) - yDe(x - 1e-4)) / 2e-4, cosA = 1 / Math.sqrt(1 + dydx * dydx), dx = dir * v * cosA * h;
        Ed += mu * m * g * Math.abs(dx); x += dx;
        if (x < 0) { x = 0; dir = 1; } if (x > 20) { x = 20; dir = -1; }
      }
      const X = (xx) => 30 + xx * 25, Y = (yy) => 300 - yy * 42;
      let d = ""; for (let i = 0; i <= 200; i++) { const xx = i / 10; d += (i ? "L" : "M") + X(xx).toFixed(1) + " " + Y(yDe(xx)).toFixed(1); }
      let sv = `<path d="${d} L${X(20)} 320 L${X(0)} 320 Z" style="fill:var(--line2)"/><path d="${d}" style="fill:none;stroke:var(--ink2);stroke-width:3"/>`;
      sv += `<line x1="${X(0)}" x2="${X(20)}" y1="${Y(E0 / (m * g))}" y2="${Y(E0 / (m * g))}" style="stroke:var(--warn);stroke-dasharray:6 5"/><text class="tx2" x="${X(20)}" y="${Y(E0 / (m * g)) - 6}" text-anchor="end">altura de largada</text>`;
      sv += `<circle cx="${X(x)}" cy="${Y(yDe(x)) - 9}" r="9" style="fill:var(--mA)"/>`;
      const Ep = m * g * yDe(x), Ec = Math.max(0, E0 - Ed - Ep), tot = E0, bw = 26, bh = 200, bx = 560;
      [[Ec, "var(--mA)", "Ec"], [Ep, "var(--mC)", "Ep"], [Ed, "var(--bad)", "calor"]].forEach(([e, cor, r], i) => { const hh = (e / tot) * bh; sv += `<rect x="${bx + i * (bw + 8)}" y="${40 + bh - hh}" width="${bw}" height="${hh}" style="fill:${cor}"/><text class="tx2" x="${bx + i * (bw + 8) + bw / 2}" y="${40 + bh + 16}" text-anchor="middle">${r}</text>`; });
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("energia cinética", n2(Ec, 0) + " J") + vis("energia potencial (mgh)", n2(Ep, 0) + " J") + vis("dissipada pelo atrito", n2(Ed, 0) + " J") + vis("velocidade", n2(Math.sqrt((2 * Ec) / m), 2) + " m/s");
    });
    q("[data-a=re]").addEventListener("click", reinicia);
    q("[data-c=x0]").addEventListener("input", reinicia);
  };

  /* ---------- A12 · impulso: a mesma Δp com tempos de contato diferentes ---------- */
  /* nome: "Impulso: força × tempo de contato" · matéria: Física · tema: A12 */
  SIM.impulso = (el, F) => {
    const W = 680, H = 320;
    let t = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("massa da bola m (kg)", "m", 0.1, 2, 0.05, 0.4)}${sl("velocidade de chegada v (m/s)", "v", 1, 30, 0.5, 10)}${sl("fração da velocidade que volta", "r", 0, 1, 0.05, 0.8)}${sl("tempo de contato Δt (ms)", "dt", 5, 200, 1, 20)}
      <div class="bts"><button class="bt pri" data-a="re">Recomeçar</button></div></div>
      <div class="status">Uma bola bate numa parede e volta. A variação da quantidade de movimento, Δp = m(v + v'), é a área sob o gráfico F × t (o impulso). Aumentar o tempo de contato (bola mais mole, luva, airbag, dobrar os joelhos) não muda a área, mas abaixa o pico de força. A curva tracejada é o mesmo choque durando 100 ms. O contato aparece em câmera lenta.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.impulso._conta = (m, v, r, dtms) => { const dp = m * v * (1 + r), Fm = dp / (dtms / 1000); return { dp, Fm, Fp: (Math.PI / 2) * Fm, p0: m * v, p1: -m * r * v }; };
    anima(el, F, (dt) => {
      const m = val(el, "m"), v = val(el, "v"), r = val(el, "r"), dc = val(el, "dt"), c = SIM.impulso._conta(m, v, r, dc);
      mostra(el, ["m", "r"], 2); mostra(el, ["v"], 1); q("[data-o=dt]").textContent = n2(dc, 0) + " ms";
      t = (t + dt) % 3.6;
      const xw = 300, R0 = 18, x0 = 40, cy = 170, lim = xw - R0;
      let xb = x0, sq = 0, fase = -1, vel = 0;
      if (t < 1.2) { xb = x0 + (lim - x0) * (t / 1.2); vel = 1; }
      else if (t < 1.8) { fase = (t - 1.2) / 0.6; sq = Math.sin(Math.PI * fase); xb = lim + sq * 7; }
      else if (t < 3.0) { xb = lim - (lim - x0) * r * ((t - 1.8) / 1.2); vel = -r; }
      else xb = lim - (lim - x0) * r;
      let sv = `<rect x="${xw}" y="70" width="16" height="150" style="fill:var(--line2);stroke:var(--ink3)"/><line x1="20" x2="${xw}" y1="${cy + R0}" y2="${cy + R0}" style="stroke:var(--ink3)"/>`;
      sv += `<ellipse cx="${xb}" cy="${cy}" rx="${R0 * (1 - 0.35 * sq)}" ry="${R0 * (1 + 0.2 * sq)}" style="fill:var(--mA)"/>`;
      if (vel) sv += D.seta(xb, cy - 34, xb + vel * 60, cy - 34, "var(--ink2)", 1.8) + D.txt(xb + vel * 30, cy - 42, vel > 0 ? "v" : "v' = r·v", "tx2");
      if (fase >= 0) sv += D.seta(xb, cy, xb - 30 - 40 * sq, cy, "var(--warn)", 2.4) + D.txt(xb - 40, cy - 26, "F da parede", "tx2", "end");
      /* gráfico F × t: escala vertical fixa para cada Δp (cheia com Δt = 10 ms) */
      const gx = 380, gy = 280, gw = 270, gh = 210, ys = gh / ((Math.PI / 2) * c.dp / 0.01), X = (ms) => gx + (ms * gw) / 200;
      sv += `<line x1="${gx}" x2="${gx + gw + 6}" y1="${gy}" y2="${gy}" style="stroke:var(--ink2)"/><line x1="${gx}" x2="${gx}" y1="${gy}" y2="${gy - gh - 10}" style="stroke:var(--ink2)"/>`;
      sv += D.txt(gx + gw, gy - 8, "t (ms)", "tx2", "end") + D.txt(gx - 6, gy - gh - 2, "F", "tx2", "end");
      [0, 50, 100, 150, 200].forEach((k) => (sv += D.txt(X(k), gy + 14, String(k), "tx2")));
      const curva = (dur, Fp) => { let d = ""; for (let k = 0; k <= 60; k++) { const tm = (dur * k) / 60; d += (k ? "L" : "M") + X(tm).toFixed(1) + " " + (gy - Math.min(Fp * Math.sin((Math.PI * k) / 60) * ys, gh)).toFixed(1); } return d; };
      sv += `<path d="${curva(100, (Math.PI / 2) * c.dp / 0.1)}" style="fill:none;stroke:var(--ink3);stroke-dasharray:5 4;stroke-width:1.5"/>`;
      sv += `<path d="${curva(dc, c.Fp)} Z" style="fill:color-mix(in srgb,var(--mA) 30%,transparent);stroke:var(--mA);stroke-width:2"/>`;
      if (c.Fp * ys > gh) sv += D.txt(X(dc) + 6, gy - gh + 4, "pico fora da escala ↑", "tx2", "start");
      if (fase >= 0) sv += `<line x1="${X(fase * dc)}" x2="${X(fase * dc)}" y1="${gy}" y2="${gy - gh}" style="stroke:var(--warn);stroke-width:1.5"/>`;
      sv += D.txt(gx + gw, gy - gh - 2, "área = Δp", "tx2", "end");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("impulso = Δp", n2(c.dp, 2) + " N·s") + vis("força média Δp/Δt", n2(c.Fm, 0) + " N") + vis("força de pico", n2(c.Fp, 0) + " N") + vis("a força média equivale ao peso de", n2(c.Fm / 10, 1) + " kg");
    });
    q("[data-a=re]").addEventListener("click", () => (t = 0));
  };

  /* ---------- A12b · pessoa andando num barco: o centro de massa não sai do lugar ---------- */
  /* nome: "Andando num barco: o CM não se move" · matéria: Física · tema: A12b */
  SIM.barcoCM = (el, F) => {
    const W = 680, H = 280;
    let s = 0, ind = 1;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("massa da pessoa m (kg)", "m", 20, 120, 5, 80)}${sl("massa do barco M (kg)", "M", 20, 400, 10, 120)}${sl("comprimento do barco L (m)", "L", 2, 8, 0.5, 4)}
      <div class="bts"><button class="bt pri" data-a="re">Recomeçar</button></div></div>
      <div class="status">A água não tem atrito na horizontal, então ninguém de fora empurra o sistema pessoa + barco: o centro de massa (linha tracejada) fica parado. Quando a pessoa anda para a direita, o barco desliza para a esquerda, de modo que m·(deslocamento da pessoa) = M·(deslocamento do barco), ambos em relação à água.</div>`);
    const q = (s0) => el.querySelector(s0);
    SIM.barcoCM._conta = (m, M, L) => ({ barco: (m * L) / (m + M), pessoa: (M * L) / (m + M), vb: m / (m + M) });
    anima(el, F, (dt) => {
      const m = val(el, "m"), M = val(el, "M"), L = val(el, "L"), c = SIM.barcoCM._conta(m, M, L);
      mostra(el, ["m", "M"], 0); mostra(el, ["L"], 1);
      s += ind * dt * 1; if (s > L + 0.8) { s = 0; } const sp = Math.min(Math.max(s, 0), L);
      const esc = 52, x0 = 340, xb = -(m * sp) / (m + M), xcm0 = (m * 0 + M * (L / 2)) / (m + M) - L / 2;
      /* barco: de xb - L/2 a xb + L/2 (o meio do barco começa na origem); a pessoa está em xb - L/2 + sp */
      const X = (xx) => x0 + xx * esc, yA = 180;
      let sv = `<rect x="0" y="${yA}" width="${W}" height="${H - yA}" style="fill:color-mix(in srgb,var(--mA) 14%,transparent)"/>`;
      sv += `<path d="M${X(xb - L / 2) - 12} ${yA - 24} L${X(xb + L / 2) + 12} ${yA - 24} L${X(xb + L / 2) - 10} ${yA + 8} L${X(xb - L / 2) + 10} ${yA + 8} Z" style="fill:color-mix(in srgb,var(--mC) 35%,transparent);stroke:var(--mC);stroke-width:2"/>`;
      const px = X(xb - L / 2 + sp), py = yA - 24;
      sv += `<circle cx="${px}" cy="${py - 58}" r="9" style="fill:none;stroke:var(--ink);stroke-width:2.5"/><line x1="${px}" y1="${py - 49}" x2="${px}" y2="${py - 22}" style="stroke:var(--ink);stroke-width:2.5"/><line x1="${px}" y1="${py - 22}" x2="${px - 8 * Math.sin(s * 6)}" y2="${py}" style="stroke:var(--ink);stroke-width:2.5"/><line x1="${px}" y1="${py - 22}" x2="${px + 8 * Math.sin(s * 6)}" y2="${py}" style="stroke:var(--ink);stroke-width:2.5"/><line x1="${px - 10}" y1="${py - 40}" x2="${px + 10}" y2="${py - 40}" style="stroke:var(--ink);stroke-width:2.5"/>`;
      sv += `<line x1="${X(xcm0)}" x2="${X(xcm0)}" y1="30" y2="${H - 10}" style="stroke:var(--warn);stroke-width:2;stroke-dasharray:6 5"/>` + D.txt(X(xcm0) + 6, 44, "centro de massa", "tx2", "start");
      sv += `<line x1="${X(-L / 2)}" x2="${X(-L / 2)}" y1="${yA + 14}" y2="${yA + 40}" style="stroke:var(--ink3)"/>` + D.txt(X(-L / 2), yA + 56, "popa no início", "tx2");
      for (let k = -6; k <= 6; k++) sv += `<line x1="${X(k)}" x2="${X(k)}" y1="${H - 14}" y2="${H - 4}" style="stroke:var(--ink3)"/>`;
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("o barco recua (total)", n2(c.barco, 2) + " m") + vis("a pessoa avança, vista da água", n2(c.pessoa, 2) + " m") + vis("agora: barco já recuou", n2(-xb, 2) + " m") + vis("velocidade do barco se a pessoa anda a 1 m/s no barco", n2(c.vb, 2) + " m/s");
    });
    q("[data-a=re]").addEventListener("click", () => (s = 0));
    ["m", "M", "L"].forEach((k) => q(`[data-c=${k}]`).addEventListener("input", () => (s = 0)));
  };

  /* ---------- A13 · colisão em 1D com coeficiente de restituição ---------- */
  /* nome: "Colisões em 1D" · matéria: Física · tema: A13 */
  SIM.colisao = (el, F) => {
    const W = 680, H = 250;
    let x1, x2, u1, u2, bateu, t;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("massa 1 (kg)", "m1", 0.5, 5, 0.5, 2)}${sl("massa 2 (kg)", "m2", 0.5, 5, 0.5, 3)}${sl("velocidade 1 (m/s)", "v1", -2, 4, 0.5, 3)}${sl("velocidade 2 (m/s)", "v2", -3, 2, 0.5, 0)}${sl("coeficiente de restituição e", "e", 0, 1, 0.05, 1)}
      <div class="bts"><button class="bt pri" data-a="re">Recomeçar</button></div></div>
      <div class="status">e = 1: colisão elástica (a velocidade relativa só troca de sinal e a energia cinética se conserva). e = 0: perfeitamente inelástica (os dois saem juntos). A quantidade de movimento total é a mesma antes e depois em qualquer caso; a energia cinética perdida é ½·μ·v_rel²·(1 − e²), com μ = m₁m₂/(m₁+m₂).</div>`);
    const q = (s) => el.querySelector(s);
    SIM.colisao._conta = (m1, m2, v1, v2, e) => { const M = m1 + m2, p = m1 * v1 + m2 * v2, w1 = (p - m2 * e * (v1 - v2)) / M, w2 = (p + m1 * e * (v1 - v2)) / M, E0 = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2, E1 = 0.5 * m1 * w1 * w1 + 0.5 * m2 * w2 * w2; return { p, w1, w2, E0, E1, perda: E0 - E1, vcm: p / M }; };
    const larg = (m) => 0.35 + 0.18 * Math.sqrt(m);
    const reinicia = () => { x1 = 2.5; x2 = 6.5; u1 = val(el, "v1"); u2 = val(el, "v2"); bateu = false; t = 0; };
    reinicia();
    anima(el, F, (dt) => {
      const m1 = val(el, "m1"), m2 = val(el, "m2"), e = val(el, "e"), c = SIM.colisao._conta(m1, m2, val(el, "v1"), val(el, "v2"), e);
      mostra(el, ["m1", "m2", "v1", "v2"], 1); mostra(el, ["e"], 2);
      t += dt;
      const sub = 10;
      for (let k = 0; k < sub; k++) {
        x1 += (u1 * dt) / sub; x2 += (u2 * dt) / sub;
        if (!bateu && x2 - x1 <= (larg(m1) + larg(m2)) / 2 && u1 > u2) { u1 = c.w1; u2 = c.w2; bateu = true; }
      }
      if (t > 7 || (bateu && (x1 < -1 || x2 > 12)) || (!bateu && u1 <= u2 && t > 3)) reinicia();
      const esc = 56, X = (xx) => 20 + xx * esc, yT = 170;
      let sv = `<line x1="10" x2="${W - 10}" y1="${yT}" y2="${yT}" style="stroke:var(--ink2);stroke-width:2"/>`;
      for (let k = 0; k <= 11; k++) sv += `<line x1="${X(k)}" x2="${X(k)}" y1="${yT}" y2="${yT + 6}" style="stroke:var(--ink3)"/>`;
      [[x1, m1, u1, "var(--mA)", "1"], [x2, m2, u2, "var(--mC)", "2"]].forEach(([xx, m, u, cor, r]) => {
        const w = larg(m) * esc, h = 26 + 8 * Math.sqrt(m);
        sv += `<rect x="${X(xx) - w / 2}" y="${yT - h}" width="${w}" height="${h}" rx="4" style="fill:color-mix(in srgb,${cor} 35%,transparent);stroke:${cor};stroke-width:2"/>` + D.txt(X(xx), yT - h / 2 + 5, r, "tx2");
        if (Math.abs(u) > 0.05) sv += D.seta(X(xx), yT - h - 14, X(xx) + u * 22, yT - h - 14, cor, 2) + D.txt(X(xx) + u * 11, yT - h - 22, n2(u, 2) + " m/s", "tx2");
      });
      sv += D.txt(16, 24, bateu ? "depois da colisão" : "antes da colisão", "tx2", "start");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("quantidade de movimento total", n2(c.p, 2) + " kg·m/s") + vis("velocidades depois (1 | 2)", n2(c.w1, 2) + " | " + n2(c.w2, 2) + " m/s") + vis("energia cinética antes → depois", n2(c.E0, 2) + " → " + n2(c.E1, 2) + " J") + vis("energia perdida", n2(c.perda, 2) + " J");
    });
    q("[data-a=re]").addEventListener("click", reinicia);
    ["v1", "v2", "m1", "m2", "e"].forEach((k) => q(`[data-c=${k}]`).addEventListener("input", reinicia));
  };

  /* ---------- A14a · corrida de rolamento num plano inclinado ---------- */
  /* nome: "Corrida de rolamento" · matéria: Física · tema: A14a */
  SIM.rolamento = (el, F) => {
    const W = 680, H = 350, g = 10;
    const corpos = [["esfera maciça", 2 / 5, "var(--mA)"], ["disco (cilindro maciço)", 1 / 2, "var(--mC)"], ["esfera oca", 2 / 3, "var(--warn)"], ["anel (cilindro oco)", 1, "var(--bad)"]];
    let t = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("inclinação θ (graus)", "th", 5, 50, 1, 20)}${sl("comprimento da rampa L (m)", "L", 1, 5, 0.5, 3)}
      <div class="bts"><button class="bt pri" data-a="re">Soltar de novo</button></div></div>
      <div class="status">Quatro corpos rolam sem deslizar, soltos juntos do repouso. Com I = k·M·R², a aceleração é a = g·sen θ / (1 + k): não depende da massa nem do raio, só da forma (de k). Quem tem a massa mais perto do eixo (k pequeno) gasta menos energia girando e chega primeiro.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.rolamento._conta = (k, thDeg, L) => { const a = (g * Math.sin((thDeg * Math.PI) / 180)) / (1 + k); return { a, t: Math.sqrt((2 * L) / a), v: Math.sqrt(2 * a * L) }; };
    anima(el, F, (dt) => {
      const th = val(el, "th"), L = val(el, "L"), tr = (th * Math.PI) / 180;
      q("[data-o=th]").textContent = n2(th, 0) + "°"; mostra(el, ["L"], 1);
      t += dt;
      const Lp = Math.min(440, 180 / Math.sin(tr)), esc = Lp / L, dx = Math.cos(tr), dy = Math.sin(tr), r = 13;
      const tmax = Math.max(...corpos.map(([, k]) => SIM.rolamento._conta(k, th, L).t));
      if (t > tmax + 1.5) t = 0;
      let sv = "";
      corpos.forEach(([nome, k, cor], i) => {
        const ax = 60, ay = 36 + i * 42, bx = ax + dx * Lp, by = ay + dy * Lp;
        sv += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" style="stroke:var(--ink3);stroke-width:2"/>` + D.txt(bx + 30, by + 2, nome, "tx2", "start");
        const c = SIM.rolamento._conta(k, th, L), sp = Math.min(0.5 * c.a * t * t, L) * esc;
        const px = ax + dx * sp + r * dy, py = ay + dy * sp - r * dx, ang = sp / r;
        sv += `<circle cx="${px}" cy="${py}" r="${r}" style="fill:color-mix(in srgb,${cor} 35%,transparent);stroke:${cor};stroke-width:2"/><line x1="${px}" y1="${py}" x2="${px + r * Math.cos(ang)}" y2="${py + r * Math.sin(ang)}" style="stroke:${cor};stroke-width:2"/>`;
      });
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = corpos.map(([nome, k]) => { const c = SIM.rolamento._conta(k, th, L); return vis(nome + " (k = " + n2(k, 2) + ")", n2(c.t, 2) + " s · " + n2(c.v, 2) + " m/s"); }).join("");
    });
    q("[data-a=re]").addEventListener("click", () => (t = 0));
    ["th", "L"].forEach((k) => q(`[data-c=${k}]`).addEventListener("input", () => (t = 0)));
  };

  /* ---------- A14 · gangorra: torques dos dois lados ---------- */
  /* nome: "Gangorra: torques" · matéria: Física · tema: A14 */
  SIM.gangorra = (el, F) => {
    const W = 680, H = 290, g = 10;
    let ang = 0, w = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("massa da esquerda (kg)", "m1", 5, 80, 5, 30)}${sl("distância da esquerda ao apoio (m)", "d1", 0, 2.5, 0.1, 2)}${sl("massa da direita (kg)", "m2", 5, 80, 5, 40)}${sl("distância da direita ao apoio (m)", "d2", 0, 2.5, 0.1, 1.5)}
      <div class="bts"><button class="bt pri" data-a="re">Nivelar</button></div></div>
      <div class="status">A gangorra (tábua leve, apoio no meio) fica em equilíbrio quando o torque que gira para um lado é igual ao que gira para o outro: m₁·g·d₁ = m₂·g·d₂. Uma criança leve longe do apoio equilibra um adulto perto dele. O apoio faz uma força para cima igual à soma dos pesos.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.gangorra._conta = (m1, d1, m2, d2) => ({ t1: m1 * g * d1, t2: m2 * g * d2, liq: m2 * g * d2 - m1 * g * d1, N: (m1 + m2) * g, d2eq: (m1 * d1) / m2 });
    anima(el, F, (dt) => {
      const m1 = val(el, "m1"), d1 = val(el, "d1"), m2 = val(el, "m2"), d2 = val(el, "d2"), c = SIM.gangorra._conta(m1, d1, m2, d2);
      mostra(el, ["m1", "m2"], 0); mostra(el, ["d1", "d2"], 1);
      const lim = 0.22, Ieff = (m1 * d1 * d1 + m2 * d2 * d2 + 20) * 1;
      w += ((c.liq * Math.cos(ang)) / Ieff - 2.5 * w) * dt; ang += w * dt;
      if (ang > lim) { ang = lim; w = 0; } if (ang < -lim) { ang = -lim; w = 0; }
      const cx = 340, cy = 190, esc = 105, deg = (ang * 180) / Math.PI;
      let sv = `<path d="M${cx - 26} ${cy + 60} L${cx + 26} ${cy + 60} L${cx} ${cy + 4} Z" style="fill:var(--line2);stroke:var(--ink3)"/><line x1="40" x2="640" y1="${cy + 60}" y2="${cy + 60}" style="stroke:var(--ink2)"/>`;
      sv += `<g transform="rotate(${deg} ${cx} ${cy})"><rect x="${cx - 2.7 * esc}" y="${cy - 6}" width="${5.4 * esc}" height="10" rx="3" style="fill:color-mix(in srgb,var(--mC) 35%,transparent);stroke:var(--mC)"/>`;
      for (let k = -2.5; k <= 2.51; k += 0.5) sv += `<line x1="${cx + k * esc}" x2="${cx + k * esc}" y1="${cy + 4}" y2="${cy + 10}" style="stroke:var(--ink3)"/>`;
      const caixa = (x, m, cor) => { const s = 18 + m * 0.45; return `<rect x="${x - s / 2}" y="${cy - 6 - s}" width="${s}" height="${s}" style="fill:color-mix(in srgb,${cor} 35%,transparent);stroke:${cor};stroke-width:2"/>` + D.txt(x, cy - 14 - s, m + " kg", "tx2"); };
      sv += caixa(cx - d1 * esc, m1, "var(--mA)") + caixa(cx + d2 * esc, m2, "var(--warn)") + `</g>`;
      sv += D.txt(cx, 30, Math.abs(c.liq) < 1e-6 ? "equilíbrio: torques iguais" : c.liq > 0 ? "gira para a direita" : "gira para a esquerda", "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("torque da esquerda m₁gd₁", n2(c.t1, 0) + " N·m") + vis("torque da direita m₂gd₂", n2(c.t2, 0) + " N·m") + vis("força do apoio", n2(c.N, 0) + " N") + vis("distância que equilibraria a direita", n2(c.d2eq, 2) + " m");
    });
    q("[data-a=re]").addEventListener("click", () => { ang = 0; w = 0; });
  };

  /* ---------- A15 · órbita de Kepler: elipse, áreas iguais e 3ª lei ---------- */
  /* nome: "Órbita de Kepler" · matéria: Física · tema: A15 */
  SIM.orbita = (el, F) => {
    const W = 680, H = 330;
    let t = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("excentricidade e", "e", 0, 0.9, 0.01, 0.5)}${sl("semieixo maior a (UA)", "a", 0.4, 30, 0.1, 1)}
      <div class="bts"><button class="bt pri" data-a="re">Recomeçar</button></div></div>
      <div class="status">O planeta percorre uma elipse com o Sol num dos focos (1ª lei). As duas regiões sombreadas são varridas no mesmo intervalo de tempo e têm a mesma área (2ª lei): perto do Sol ele anda muito mais rápido. O período só depende do semieixo maior: T² = a³, com T em anos e a em UA (3ª lei). O tamanho do desenho é fixo; mudar a muda só o período.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.orbita._conta = (a, e) => ({ T: Math.pow(a, 1.5), rp: a * (1 - e), ra: a * (1 + e), razao: (1 + e) / (1 - e) });
    const kepler = (M, e) => { let E = M; for (let k = 0; k < 30; k++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); return E; };
    anima(el, F, (dt) => {
      const e = val(el, "e"), a = val(el, "a"), c = SIM.orbita._conta(a, e);
      mostra(el, ["e"], 2); mostra(el, ["a"], 1);
      t += dt;
      const A = Math.min(250, 145 / Math.sqrt(1 - e * e)), B = A * Math.sqrt(1 - e * e), fx = 340 + A * e, fy = 165, Tanim = 7;
      const pos = (M) => { const E = kepler(M, e); return [fx + A * (Math.cos(E) - e), fy - B * Math.sin(E)]; };
      const setor = (M0, M1, cor) => { let d = `M${fx} ${fy}`; for (let k = 0; k <= 30; k++) { const [x, y] = pos(M0 + ((M1 - M0) * k) / 30); d += `L${x.toFixed(1)} ${y.toFixed(1)}`; } return `<path d="${d}Z" style="fill:color-mix(in srgb,${cor} 30%,transparent);stroke:${cor}"/>`; };
      let sv = `<ellipse cx="${fx - A * e}" cy="${fy}" rx="${A}" ry="${B}" style="fill:none;stroke:var(--ink3);stroke-width:1.5"/>`;
      sv += setor(-0.35, 0.35, "var(--mA)") + setor(Math.PI - 0.35, Math.PI + 0.35, "var(--mC)");
      sv += `<circle cx="${fx}" cy="${fy}" r="11" style="fill:var(--warn)"/>` + D.txt(fx, fy + 28, "Sol (foco)", "tx2");
      if (e > 0.02) sv += `<circle cx="${fx - 2 * A * e}" cy="${fy}" r="3" style="fill:var(--ink3)"/>` + D.txt(fx - 2 * A * e, fy + 18, "outro foco", "tx2");
      const M = ((2 * Math.PI * t) / Tanim) % (2 * Math.PI), [px, py] = pos(M);
      sv += `<line x1="${fx}" y1="${fy}" x2="${px}" y2="${py}" style="stroke:var(--ink2);stroke-dasharray:3 3"/><circle cx="${px}" cy="${py}" r="8" style="fill:var(--mA)"/>`;
      sv += D.txt(fx + A * (1 - e) + 8, fy - 8, "periélio", "tx2", "start") + D.txt(fx - A * (1 + e) + 8, fy - 8, "afélio", "tx2", "start");
      q("[data-v=sv]").innerHTML = sv;
      const E = kepler(M, e), r = a * (1 - e * Math.cos(E)), vr = Math.sqrt((2 / r - 1 / a) / (2 / c.ra - 1 / a));
      q("[data-v=lt]").innerHTML = vis("período T = a^1,5", n2(c.T, 2) + (n2(c.T, 2) === "1" ? " ano" : " anos")) + vis("periélio | afélio", n2(c.rp, 2) + " | " + n2(c.ra, 2) + " UA") + vis("v no periélio ÷ v no afélio", n2(c.razao, 2)) + vis("agora: distância | v ÷ v(afélio)", n2(r, 2) + " UA | " + n2(vr, 2));
    });
    q("[data-a=re]").addEventListener("click", () => (t = 0));
  };

  /* ---------- A16 · canhão de Newton: queda, órbita e escape ---------- */
  /* nome: "O canhão de Newton" · matéria: Física · tema: A16 */
  SIM.canhao = (el, F) => {
    const W = 680, H = 340, GM = 398600, RT = 6371;
    let r, v, rastros = [], atual = "", t = 0, fim = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("velocidade horizontal v (km/s)", "v", 3, 12, 0.1, 7.8)}${sl("altura da montanha h (km)", "h", 100, 2000, 50, 400)}
      <div class="bts"><button class="bt pri" data-a="go">Disparar</button><button class="bt" data-a="lp">Limpar</button></div></div>
      <div class="status">A ideia de Newton: um canhão no alto de uma montanha (altíssima, fora do ar) atira na horizontal. Devagar, a bala cai. Mais rápido, ela cai mais longe, porque a Terra se curva embaixo dela. Na velocidade orbital, ela cai para sempre sem chegar ao chão: está em órbita. Acima dela, órbitas elípticas; a partir da velocidade de escape, ela não volta mais.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.canhao._conta = (vv, h) => { const r0 = RT + h, beta = (r0 * vv * vv) / GM, r2 = beta < 2 ? r0 / (2 / beta - 1) : Infinity; const vc = Math.sqrt(GM / r0), ve = Math.sqrt((2 * GM) / r0); return { vc, ve, r2, E: (vv * vv) / 2 - GM / r0, tipo: vv >= ve ? "escapa (não volta)" : r2 < RT ? "cai no chão" : Math.abs(vv - vc) < 0.05 ? "órbita circular" : "órbita elíptica" }; };
    const esc = 62 / RT, cx = 340, cy = 170, P = (x, y) => (cx + x * esc).toFixed(1) + " " + (cy - y * esc).toFixed(1);
    const dispara = () => { if (atual) { rastros.push(atual); if (rastros.length > 6) rastros.shift(); } const h = val(el, "h"); r = [0, RT + h]; v = [val(el, "v"), 0]; atual = "M" + P(r[0], r[1]); t = 0; fim = false; };
    dispara();
    anima(el, F, (dt) => {
      const vv = val(el, "v"), h = val(el, "h"), c = SIM.canhao._conta(vv, h);
      mostra(el, ["v"], 1); mostra(el, ["h"], 0);
      if (!fim) {
        const passo = 5, n = Math.round((dt * 900) / passo);
        for (let k = 0; k < n && !fim; k++) {
          let d = Math.hypot(r[0], r[1]), a = -GM / (d * d * d);
          v[0] += a * r[0] * passo * 0.5; v[1] += a * r[1] * passo * 0.5;
          r[0] += v[0] * passo; r[1] += v[1] * passo; t += passo;
          d = Math.hypot(r[0], r[1]); a = -GM / (d * d * d);
          v[0] += a * r[0] * passo * 0.5; v[1] += a * r[1] * passo * 0.5;
          if (k % 4 === 0) atual += "L" + P(r[0], r[1]);
          if (d < RT) fim = true;
          if (d > 4 * RT || t > 4e5) fim = true;
          if (t > 600 && r[0] < 0 && r[0] + v[0] * passo >= 0 && r[1] > 0) fim = true; /* deu uma volta */
        }
      }
      let sv = `<circle cx="${cx}" cy="${cy}" r="${RT * esc}" style="fill:color-mix(in srgb,var(--mA) 30%,transparent);stroke:var(--mA)"/>`;
      sv += `<path d="M${cx - 8} ${cy - RT * esc} L${cx} ${cy - (RT + h) * esc} L${cx + 8} ${cy - RT * esc} Z" style="fill:var(--ink3)"/>`;
      rastros.forEach((d) => (sv += `<path d="${d}" style="fill:none;stroke:var(--ink3);stroke-width:1.2;opacity:.6"/>`));
      sv += `<path d="${atual}" style="fill:none;stroke:var(--warn);stroke-width:2"/><circle cx="${cx + r[0] * esc}" cy="${cy - r[1] * esc}" r="4" style="fill:var(--warn)"/>`;
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("velocidade orbital √(GM/r)", n2(c.vc, 2) + " km/s") + vis("velocidade de escape √(2GM/r)", n2(c.ve, 2) + " km/s") + vis("com esta velocidade", c.tipo) + vis("energia por kg (v²/2 − GM/r)", n2(c.E, 1) + " MJ/kg");
    });
    q("[data-a=go]").addEventListener("click", dispara);
    q("[data-a=lp]").addEventListener("click", () => { rastros = []; dispara(); });
  };

  /* ---------- A17 · empuxo: bloco pendurado num dinamômetro e mergulhado ---------- */
  /* nome: "Empuxo no dinamômetro" · matéria: Física · tema: A17 */
  SIM.empuxo = (el, F) => {
    const W = 680, H = 340, g = 10, V = 0.001, a = 0.1;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("densidade do bloco (kg/m³)", "rb", 200, 3000, 50, 2500)}${sl("densidade do líquido (kg/m³)", "rl", 600, 1800, 10, 1000)}${sl("quanto do bloco está mergulhado (%)", "im", 0, 100, 1, 50)}
      <div class="bts">${botoes([["800", "óleo"], ["1000", "água"], ["1030", "água do mar"], ["1260", "glicerina"]], "liq", "1000")}</div></div>
      <div class="status">Um cubo de 10 cm (1 litro) pendurado num dinamômetro. O líquido empurra o bloco para cima com o peso do líquido deslocado: E = ρ_líquido·V_mergulhado·g (Arquimedes). O dinamômetro marca o "peso aparente", P − E. Se o bloco for menos denso que o líquido, o fio afrouxa antes de o bloco afundar inteiro: solto, ele flutuaria com a fração ρ_bloco/ρ_líquido mergulhada.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.empuxo._conta = (rb, rl, fr) => { const P = rb * V * g, E = rl * V * fr * g; return { P, E, T: P - E, frac: rb / rl }; };
    liga(el, "liq", (k) => { q("[data-c=rl]").value = k; });
    anima(el, F, () => {
      const rb = val(el, "rb"), rl = val(el, "rl"), im = val(el, "im") / 100, c = SIM.empuxo._conta(rb, rl, im);
      mostra(el, ["rb", "rl"], 0); q("[data-o=im]").textContent = n2(im * 100, 0) + "%";
      const esc = 900, lado = a * esc, tx = 230, tw = 220, base = 320, nivel0 = 200;
      const sobe = (lado * lado * im) / tw; /* o volume deslocado sobe o nível do tanque (desenho em corte) */
      const nivel = nivel0 - sobe, by = nivel - lado * (1 - im), bx = tx + tw / 2 - lado / 2;
      let sv = `<rect x="${tx}" y="${nivel}" width="${tw}" height="${base - nivel}" style="fill:color-mix(in srgb,var(--mA) ${Math.round(12 + (rl - 600) / 60)}%,transparent)"/><path d="M${tx} 120 L${tx} ${base} L${tx + tw} ${base} L${tx + tw} 120" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
      sv += `<line x1="${tx - 30}" x2="${tx}" y1="${nivel0}" y2="${nivel0}" style="stroke:var(--ink3);stroke-dasharray:3 3"/>` + D.txt(tx - 34, nivel0 + 4, "nível sem bloco", "tx2", "end");
      sv += `<rect x="${bx}" y="${by}" width="${lado}" height="${lado}" style="fill:color-mix(in srgb,var(--mC) ${Math.round(25 + rb / 100)}%,transparent);stroke:var(--mC);stroke-width:2"/>`;
      const topo = 20, mola = by - 46;
      sv += `<line x1="${tx - 20}" x2="${tx + tw + 20}" y1="${topo}" y2="${topo}" style="stroke:var(--ink2);stroke-width:3"/><rect x="${bx + lado / 2 - 18}" y="${topo}" width="36" height="${Math.max(30, mola - topo)}" rx="6" style="fill:var(--line2);stroke:var(--ink3)"/>`;
      sv += `<line x1="${bx + lado / 2}" x2="${bx + lado / 2}" y1="${Math.max(topo + 30, mola)}" y2="${by}" style="stroke:var(--ink);stroke-width:${c.T > 0 ? 1.6 : 0.8};${c.T > 0 ? "" : "stroke-dasharray:3 3"}"/>`;
      if (im > 0) sv += D.seta(bx + lado + 26, by + lado, bx + lado + 26, by + lado - Math.min(80, c.E * 2.4), "var(--mA)", 2.2) + D.txt(bx + lado + 32, by + lado - 10, "E", "txm", "start");
      sv += D.seta(bx - 26, by + lado / 2, bx - 26, by + lado / 2 + Math.min(80, c.P * 2.4), "var(--bad)", 2.2) + D.txt(bx - 32, by + lado / 2 + 20, "P", "txm", "end");
      sv += D.txt(bx + lado / 2, topo + 22, n2(Math.max(0, c.T), 1) + " N", "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("peso P = ρ_bloco·V·g", n2(c.P, 1) + " N") + vis("empuxo E = ρ_líq·V_merg·g", n2(c.E, 1) + " N") + vis("dinamômetro (P − E)", c.T >= 0 ? n2(c.T, 2) + " N" : "fio frouxo") + vis(c.frac < 1 ? "solto, flutuaria com" : "solto, ele", c.frac < 1 ? n2(c.frac * 100, 0) + "% mergulhado" : "afunda");
    });
  };

  /* ---------- A18 · Torricelli: o jato que sai de um furo na caixa d'água ---------- */
  /* nome: "O jato da caixa d'água" · matéria: Física · tema: A18 */
  SIM.torricelli = (el, F) => {
    const W = 680, H = 330, g = 10;
    let t = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("altura da água no tanque H (m)", "H", 0.5, 2.5, 0.05, 2)}${sl("altura do furo y (m)", "y", 0, 2.5, 0.05, 0.5)}
      <div class="bts"><button class="bt pri" data-a="meio">Furo no meio</button></div></div>
      <div class="status">Pela equação de Bernoulli, a água sai do furo com a velocidade de quem caísse da superfície até ali: v = √(2g(H − y)) (Torricelli). Depois, o jato é um lançamento horizontal. Furo baixo: sai rápido mas cai logo; furo alto: tem tempo de queda mas sai devagar. O alcance máximo, igual a H, é com o furo exatamente no meio. Furos à mesma distância do meio, acima e abaixo, dão o mesmo alcance.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.torricelli._conta = (Hh, y) => { const v = Math.sqrt(Math.max(0, 2 * g * (Hh - y))), tq = Math.sqrt((2 * y) / g); return { v, tq, x: v * tq, xmax: Hh }; };
    q("[data-a=meio]").addEventListener("click", () => { q("[data-c=y]").value = val(el, "H") / 2; });
    anima(el, F, (dt) => {
      let Hh = val(el, "H"), y = val(el, "y");
      if (y > Hh) { y = Hh; q("[data-c=y]").value = y; }
      mostra(el, ["H", "y"], 2);
      const c = SIM.torricelli._conta(Hh, y);
      t = (t + dt) % 10;
      const esc = 110, x0 = 150, y0 = 300, X = (xx) => x0 + xx * esc, Y = (yy) => y0 - yy * esc;
      let sv = `<line x1="20" x2="${W - 10}" y1="${y0}" y2="${y0}" style="stroke:var(--ink2);stroke-width:2"/>`;
      sv += `<rect x="${X(-1)}" y="${Y(Hh)}" width="${esc}" height="${Hh * esc}" style="fill:color-mix(in srgb,var(--mA) 28%,transparent)"/><path d="M${X(-1)} ${Y(2.7)} L${X(-1)} ${y0} L${X(0)} ${y0} L${X(0)} ${Y(2.7)}" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
      if (c.v > 0) {
        let d = ""; for (let k = 0; k <= 40; k++) { const s = (c.tq * k) / 40; d += (k ? "L" : "M") + X(c.v * s).toFixed(1) + " " + Y(y - 5 * s * s).toFixed(1); }
        sv += `<path d="${d}" style="fill:none;stroke:var(--mA);stroke-width:3"/>`;
        for (let k = 0; k < 6; k++) { const s = ((t * 0.6 + k / 6) % 1) * c.tq; sv += `<circle cx="${X(c.v * s)}" cy="${Y(y - 5 * s * s)}" r="3" style="fill:var(--mA)"/>`; }
        /* referência: jato do furo no meio */
        const vm = Math.sqrt(g * Hh), tm = Math.sqrt(Hh / g); let dm = ""; for (let k = 0; k <= 40; k++) { const s = (tm * k) / 40; dm += (k ? "L" : "M") + X(vm * s).toFixed(1) + " " + Y(Hh / 2 - 5 * s * s).toFixed(1); }
        sv += `<path d="${dm}" style="fill:none;stroke:var(--ink3);stroke-dasharray:5 4"/>`;
      }
      sv += `<circle cx="${X(0)}" cy="${Y(y)}" r="4" style="fill:var(--warn)"/>` + D.seta(X(-1) - 14, Y(0), X(-1) - 14, Y(Hh), "var(--ink3)", 1.2) + D.txt(X(-1) - 20, Y(Hh / 2), "H", "txm", "end");
      sv += `<line x1="${X(c.x)}" x2="${X(c.x)}" y1="${y0}" y2="${y0 + 8}" style="stroke:var(--warn);stroke-width:2"/>` + D.txt(X(c.x), y0 + 22, "alcance", "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("velocidade de saída √(2g(H − y))", n2(c.v, 2) + " m/s") + vis("tempo de queda √(2y/g)", n2(c.tq, 2) + " s") + vis("alcance 2√(y(H − y))", n2(c.x, 2) + " m") + vis("alcance máximo (furo em H/2)", n2(c.xmax, 2) + " m");
    });
  };

  /* ---------- A20 · massa–mola com amortecimento e o gráfico x × t ---------- */
  /* nome: "Massa–mola: MHS e amortecimento" · matéria: Física · tema: A20 */
  SIM.mhs = (el, F) => {
    const W = 680, H = 320;
    let x, v, t, hist;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("constante da mola k (N/m)", "k", 5, 100, 1, 40)}${sl("massa m (kg)", "m", 0.2, 5, 0.1, 1)}${sl("amplitude inicial A (m)", "A", 0.05, 0.5, 0.01, 0.3)}${sl("amortecimento b (kg/s)", "b", 0, 3, 0.05, 0)}
      <div class="bts"><button class="bt pri" data-a="re">Soltar de novo</button></div></div>
      <div class="status">Um bloco preso a uma mola, sobre uma mesa sem atrito, é puxado até x = A e solto. A força da mola, −kx, produz um movimento harmônico simples: x = A·cos(ωt), com ω = √(k/m). O período não depende da amplitude. Com amortecimento (uma força −bv, como a do ar ou de um líquido), a amplitude cai exponencialmente e a energia vai embora.</div>`);
    const q = (s) => el.querySelector(s);
    SIM.mhs._conta = (k, m, A) => { const w = Math.sqrt(k / m); return { w, T: (2 * Math.PI) / w, vmax: A * w, amax: A * w * w, E: 0.5 * k * A * A }; };
    const reinicia = () => { x = val(el, "A"); v = 0; t = 0; hist = []; };
    reinicia();
    anima(el, F, (dt) => {
      const k = val(el, "k"), m = val(el, "m"), A = val(el, "A"), b = val(el, "b"), c = SIM.mhs._conta(k, m, A);
      mostra(el, ["k"], 0); mostra(el, ["m", "b"], 2); mostra(el, ["A"], 2);
      const n = 20, h = dt / n;
      for (let i = 0; i < n; i++) { const a0 = (-k * x - b * v) / m; x += v * h + 0.5 * a0 * h * h; const a1 = (-k * x - b * (v + a0 * h)) / m; v += 0.5 * (a0 + a1) * h; t += h; }
      hist.push([t, x]); while (hist.length && t - hist[0][0] > 8) hist.shift();
      const esc = 300, x0 = 200, y0 = 80;
      let sv = `<line x1="20" x2="380" y1="${y0 + 26}" y2="${y0 + 26}" style="stroke:var(--ink2);stroke-width:2"/><rect x="20" y="${y0 - 40}" width="10" height="66" style="fill:var(--ink3)"/>`;
      const px = x0 + x * esc, nm = 14; let d = `M30 ${y0}`; for (let i = 1; i <= nm; i++) d += `L${30 + ((px - 52) * i) / nm} ${y0 + (i % 2 ? -12 : 12)}`; d += `L${px - 22} ${y0}`;
      sv += `<path d="${d}" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="${px - 22}" y="${y0 - 22}" width="44" height="44" rx="4" style="fill:color-mix(in srgb,var(--mA) 35%,transparent);stroke:var(--mA);stroke-width:2"/>`;
      sv += `<line x1="${x0}" x2="${x0}" y1="${y0 + 26}" y2="${y0 + 36}" style="stroke:var(--warn);stroke-width:2"/>` + D.txt(x0, y0 + 50, "x = 0", "tx2");
      /* gráfico x × t (últimos 8 s) */
      const gx = 40, gy = 230, gw = 620, gh = 70, t0 = Math.max(0, t - 8);
      sv += `<line x1="${gx}" x2="${gx + gw}" y1="${gy}" y2="${gy}" style="stroke:var(--ink3)"/><line x1="${gx}" x2="${gx}" y1="${gy - gh - 6}" y2="${gy + gh + 6}" style="stroke:var(--ink3)"/>` + D.txt(gx + gw, gy - 6, "t", "tx2", "end") + D.txt(gx - 6, gy - gh, "x", "tx2", "end");
      if (b > 0) { let e1 = "", e2 = ""; for (let i = 0; i <= 60; i++) { const tt = t0 + (8 * i) / 60, env = A * Math.exp((-b * tt) / (2 * m)); e1 += (i ? "L" : "M") + (gx + ((tt - t0) / 8) * gw).toFixed(1) + " " + (gy - (env / 0.5) * gh).toFixed(1); e2 += (i ? "L" : "M") + (gx + ((tt - t0) / 8) * gw).toFixed(1) + " " + (gy + (env / 0.5) * gh).toFixed(1); } sv += `<path d="${e1}" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/><path d="${e2}" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/>`; }
      let dg = ""; hist.forEach(([tt, xx], i) => (dg += (i ? "L" : "M") + (gx + ((tt - t0) / 8) * gw).toFixed(1) + " " + (gy - (xx / 0.5) * gh).toFixed(1)));
      sv += `<path d="${dg}" style="fill:none;stroke:var(--mA);stroke-width:2"/>`;
      q("[data-v=sv]").innerHTML = sv;
      const E = 0.5 * k * x * x + 0.5 * m * v * v;
      q("[data-v=lt]").innerHTML = vis("ω = √(k/m) | período T", n2(c.w, 2) + " rad/s | " + n2(c.T, 2) + " s") + vis("velocidade máxima Aω", n2(c.vmax, 2) + " m/s") + vis("energia inicial ½kA²", n2(c.E, 2) + " J") + vis("energia agora", n2(E, 2) + " J");
    });
    q("[data-a=re]").addEventListener("click", reinicia);
    ["k", "m", "A"].forEach((kk) => q(`[data-c=${kk}]`).addEventListener("input", reinicia));
  };
})();
