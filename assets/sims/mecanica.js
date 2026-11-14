/* Simulações da Mecânica (módulo A): A01 vai e volta (deslocamento × distância), A02 encontro de dois carros (MRU),
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
})();
