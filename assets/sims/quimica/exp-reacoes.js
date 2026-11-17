/* Química · aba Experimentos, módulo Reações (EQ05 a EQ08 e EQ21). Simulações com partículas e semente (ver exp-gases.js: SIM.expGas).
   EQ05 SIM.eqColisoes: A + B → 2 C só quando a energia do choque ao longo da linha dos centros passa de Ea. Para discos rígidos, a fração de choques
     com essa energia acima de Ea é exatamente e^(−Ea/kT): é o fator de Arrhenius, e o teste mede isso.
   EQ06 SIM.eqCatalisador: a mesma reação em duas caixas, com e sem catalisador (energia de ativação menor); mesmos reagentes, mesmos produtos, mesmo ΔH.
   EQ07 SIM.eqLeChatelier: N₂O₄ ⇌ 2 NO₂ com partículas: dissociação com taxa que cresce com T, associação quando dois NO₂ se chocam. Volume, temperatura e injeção.
   EQ08 SIM.eqBureta: titulação com gotas caindo no tempo (usa SIM.titula, do módulo J: pH por balanço de carga, indicadores com faixa da fonte).
   EQ21 SIM.eqBalanca: equações de SIM.EQS; átomos em bolinhas dos dois lados e uma balança que só fica na horizontal quando a massa confere.
   MODELOS (ditos na tela): energias de ativação e taxas das simulações EQ05 a EQ07 são números escolhidos para a simulação, não medidas de reações reais. */
(function () {
  const SIM = (window.SIM = window.SIM || {}), G = SIM.expGas;
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const T = (x, y, s, a = "middle", c = "tx2", t = 12) => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}" style="font-size:${t}px">${s}</text>`;
  const S0 = 60; /* desvio padrão de cada componente da velocidade a 300 K (px/s); kT = m·σ², com m = 1 */

  /* caixa de reação A + B → 2 C: discos de massa 1, paredes térmicas; Ea em unidades de kT a 300 K */
  const caixaR = (o) => { const c = { ps: [], nAB: 0, nEf: 0, t: 0, hist: [] }, r = 4;
    c.reinicia = (rnd, Tk) => { const s = S0 * Math.sqrt(Tk / 300); c.ps = []; c.nAB = 0; c.nEf = 0; c.t = 0; c.hist = []; for (let i = 0; i < 2 * o.N; i++) c.ps.push({ tipo: i % 2, x: o.x + r + rnd() * (o.w - 2 * r), y: o.y + r + rnd() * (o.h - 2 * r), vx: G.gauss(rnd) * s, vy: G.gauss(rnd) * s }); };
    c.zera = () => { c.nAB = 0; c.nEf = 0; };
    c.passo = (dt, rnd, Tk, Ea, reagir) => { const n = 8, h = dt / n, s = S0 * Math.sqrt(Tk / 300), nrm = () => s * Math.sqrt(-2 * Math.log(1 - rnd() * 0.999999)), tg = () => G.gauss(rnd) * s, ps = c.ps, EaJ = Ea * S0 * S0;
      for (let k = 0; k < n; k++) { for (const p of ps) { p.x += p.vx * h; p.y += p.vy * h;
          if (p.x < o.x + r) { p.x = o.x + r; p.vx = nrm(); p.vy = tg(); } if (p.x > o.x + o.w - r) { p.x = o.x + o.w - r; p.vx = -nrm(); p.vy = tg(); }
          if (p.y < o.y + r) { p.y = o.y + r; p.vy = nrm(); p.vx = tg(); } if (p.y > o.y + o.h - r) { p.y = o.y + o.h - r; p.vy = -nrm(); p.vx = tg(); } }
        for (let i = 0; i < ps.length; i++) { const a = ps[i]; for (let j = i + 1; j < ps.length; j++) { const b = ps[j], dx = b.x - a.x, dy = b.y - a.y; if (Math.abs(dx) > 2 * r || Math.abs(dy) > 2 * r) continue; const d2 = dx * dx + dy * dy; if (d2 >= 4 * r * r || d2 === 0) continue; const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (vn >= 0) continue;
            if (a.tipo + b.tipo === 1 && a.tipo < 2 && b.tipo < 2) { c.nAB++; if (0.25 * vn * vn >= EaJ) { c.nEf++; if (reagir) { a.tipo = 2; b.tipo = 2; } } }
            a.vx += vn * nx; a.vy += vn * ny; b.vx -= vn * nx; b.vy -= vn * ny; } } }
      c.t += dt; if (!c.hist.length || c.t - c.hist[c.hist.length - 1][0] > 0.25) { if (c.hist.length < 600) c.hist.push([c.t, c.resta()]); } };
    c.resta = () => c.ps.filter((p) => p.tipo === 0).length / o.N;
    c.desenha = () => `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" style="fill:none;stroke:var(--ink2);stroke-width:2"/>` + c.ps.map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r}" style="fill:${["var(--mA)", "var(--warn)", "var(--ok)"][p.tipo]}"/>`).join("");
    return c; };
  SIM.eqArrh = (Ea, Tk) => Math.exp(-Ea * 300 / Tk);

  /* ---------- EQ05 · colisões e energia de ativação ---------- */
  /* nome: "Colisões e energia de ativação: quem bate forte reage" · matéria: Química · tema: EQ05 */
  SIM.eqColisoes = (el, F) => { const W = 680, H = 290, cx = caixaR({ x: 20, y: 20, w: 420, h: 240, N: 60 }); let rnd = Math.random, Tk = 300, Ea = 2, reagir = true;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${sl("temperatura (K)", "T", 200, 900, 10, 300)}${sl("energia de ativação (em kT a 300 K)", "E", 0.5, 6, 0.1, 2)}</div>
      <div><div class="bts"><button class="bt pri" data-a="re">Recomeçar</button><button class="bt" data-a="rg" aria-pressed="true">Reagir de verdade</button></div><p style="margin:8px 0 0;font-size:13.5px;color:var(--ink2)">Azul e laranja: reagentes A e B. Verde: produto C.</p></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => ({ Tk, Ea, reagir, nAB: cx.nAB, nEf: cx.nEf, fr: cx.nAB ? cx.nEf / cx.nAB : null, teor: SIM.eqArrh(Ea, Tk), resta: cx.resta(), t: cx.t });
    const desenha = () => { const e = est(); q("[data-o=T]").textContent = Tk + " K"; q("[data-o=E]").textContent = n2(Ea, 1);
      const gx = 470, gy = 250, gw = 190, gh = 200; let s = cx.desenha() + `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" style="stroke:var(--ink3)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" style="stroke:var(--ink3)"/>` + T(gx + gw / 2, 16, "reagente A que ainda resta", "middle", "tx2", 11) + T(gx - 4, gy - gh + 4, "100%", "end", "tx2", 10) + T(gx + gw / 2, gy + 16, "tempo", "middle", "tx2", 10);
      if (cx.hist.length > 1) { const tm = Math.max(20, cx.hist[cx.hist.length - 1][0]); s += `<path d="${cx.hist.map((p, i) => (i ? "L" : "M") + (gx + gw * p[0] / tm).toFixed(1) + "," + (gy - gh * p[1]).toFixed(1)).join("")}" style="fill:none;stroke:var(--mA);stroke-width:2"/>`; }
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("choques entre A e B", e.nAB) + vis("choques eficazes", e.nEf) + vis("fração eficaz medida", e.fr === null ? "—" : n2(100 * e.fr, 1) + " %") + vis("fator de Arrhenius, e^(−Ea/kT)", n2(100 * e.teor, 1) + " %") + vis("reagente A restante", n2(100 * e.resta, 0) + " %");
      q("[data-v=st]").innerHTML = "A e B se chocam o tempo todo, mas só viram produto quando o choque tem energia de pelo menos Ea (conta a energia ao longo da linha que une os centros: batida de raspão não vale). A fração de choques eficazes é o fator de Arrhenius, e^(−Ea/kT). Aqueça: os choques ficam só um pouco mais frequentes, mas a fração eficaz dispara. Desligue \"reagir de verdade\" para só contar os choques, sem gastar os reagentes. Modelo em duas dimensões; a energia de ativação é um número da simulação, não de uma reação real."; };
    q("[data-c=T]").addEventListener("input", () => { const a = Tk; Tk = +q("[data-c=T]").value; const f = Math.sqrt(Tk / a); cx.ps.forEach((p) => { p.vx *= f; p.vy *= f; }); cx.zera(); }); q("[data-c=E]").addEventListener("input", () => { Ea = +q("[data-c=E]").value; cx.zera(); });
    q("[data-a=re]").addEventListener("click", () => cx.reinicia(rnd, Tk)); q("[data-a=rg]").addEventListener("click", (ev) => { reagir = !reagir; ev.target.setAttribute("aria-pressed", String(reagir)); cx.reinicia(rnd, Tk); });
    cx.reinicia(rnd, Tk); anima(el, F, (dt) => { cx.passo(dt, rnd, Tk, Ea, reagir); desenha(); });
    SIM.eqColisoes._ult = { semente: (n) => { rnd = G.rng(n); cx.reinicia(rnd, Tk); }, poe: (Tn, En, rg) => { Tk = Tn; Ea = En; reagir = !!rg; q("[data-c=T]").value = Tn; q("[data-c=E]").value = En; q("[data-a=rg]").setAttribute("aria-pressed", String(reagir)); cx.reinicia(rnd, Tk); }, avanca: (seg) => { for (let i = 0; i < Math.round(seg * 60); i++) cx.passo(1 / 60, rnd, Tk, Ea, reagir); desenha(); }, est }; };

  /* ---------- EQ06 · catalisador ---------- */
  /* nome: "Catalisador: outro caminho, mesma chegada" · matéria: Química · tema: EQ06 */
  SIM.eqCatalisador = (el, F) => { const W = 680, H = 330, c1 = caixaR({ x: 20, y: 24, w: 300, h: 170, N: 45 }), c2 = caixaR({ x: 360, y: 24, w: 300, h: 170, N: 45 }); let rnd = Math.random, Tk = 300, Ea = 4, Ec = 2;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${sl("temperatura (K)", "T", 200, 700, 10, 300)}${sl("Ea com catalisador (em kT a 300 K)", "C", 0.5, 4, 0.1, 2)}</div>
      <div><div class="bts"><button class="bt pri" data-a="re">Recomeçar as duas</button></div><p style="margin:8px 0 0;font-size:13.5px;color:var(--ink2)">Sem catalisador, Ea = 4 (fixa). As duas caixas têm os mesmos reagentes, na mesma temperatura.</p></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), reinicia = () => { c1.reinicia(rnd, Tk); c2.reinicia(rnd, Tk); };
    const est = () => ({ Tk, Ea, Ec, r1: 1 - c1.resta(), r2: 1 - c2.resta(), f1: c1.nAB ? c1.nEf / c1.nAB : null, f2: c2.nAB ? c2.nEf / c2.nAB : null, n1: c1.nAB, n2: c2.nAB, e1: c1.nEf, e2: c2.nEf, ganho: Math.exp((Ea - Ec) * 300 / Tk), t: c1.t });
    const desenha = () => { const e = est(); q("[data-o=T]").textContent = Tk + " K"; q("[data-o=C]").textContent = n2(Ec, 1);
      let s = c1.desenha() + c2.desenha() + T(170, 16, "sem catalisador", "middle", "tx", 12) + T(510, 16, "com catalisador", "middle", "tx", 12);
      const barra = (x, f) => `<rect x="${x}" y="200" width="300" height="8" rx="3" style="fill:none;stroke:var(--ink3)"/><rect x="${x}" y="200" width="${(300 * f).toFixed(1)}" height="8" rx="3" style="fill:var(--ok)"/>`; s += barra(20, e.r1) + barra(360, e.r2);
      /* perfil de energia: reagentes em 0, produtos em −1,5 (exotérmica), barreiras Ea e Ec */
      const px = 180, pw = 320, py = 318, u = 11, Y = (v) => py - 40 - v * u, curva = (E) => { let d = ""; for (let i = 0; i <= 60; i++) { const x = i / 60, g = Math.exp(-Math.pow((x - 0.5) / 0.13, 2)), lado = x < 0.5 ? 0 : -1.5, v = lado + (E - lado) * g; d += (i ? "L" : "M") + (px + pw * x).toFixed(1) + "," + Y(v).toFixed(1); } return d; };
      s += `<path d="${curva(Ea)}" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="${curva(Ec)}" style="fill:none;stroke:var(--ok);stroke-width:2;stroke-dasharray:6 4"/>` + T(px - 6, Y(0) + 4, "A + B", "end", "tx2", 11) + T(px + pw + 6, Y(-1.5) + 4, "2 C", "start", "tx2", 11) + T(px + pw / 2 + 46, Y(Ea) + 12, "sem", "start", "tx2", 10) + T(px + pw / 2 + 46, Y(Ec) + 12, "com", "start", "tx2", 10) + T(20, 300, "energia ao longo", "start", "tx2", 10) + T(20, 314, "do caminho", "start", "tx2", 10);
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("já reagiu, sem catalisador", n2(100 * e.r1, 0) + " %") + vis("já reagiu, com catalisador", n2(100 * e.r2, 0) + " %") + vis("fração eficaz: sem | com", (e.f1 === null ? "—" : n2(100 * e.f1, 1)) + " % | " + (e.f2 === null ? "—" : n2(100 * e.f2, 1)) + " %") + vis("previsto: com é quantas vezes mais rápido", n2(e.ganho, 1) + " ×");
      q("[data-v=st]").innerHTML = "O catalisador oferece outro caminho, com energia de ativação menor. Nas duas caixas os choques acontecem no mesmo ritmo; o que muda é quantos são eficazes. No perfil de energia, a partida (A + B) e a chegada (2 C) são as mesmas nos dois caminhos: o catalisador não muda a variação de entalpia nem a posição do equilíbrio, só a velocidade, e não é gasto. Deixe correr: as duas caixas acabam no mesmo lugar, uma bem antes da outra. Modelo: o catalisador não aparece como partícula; ele entra como uma barreira menor. Energias em unidades da simulação."; };
    q("[data-c=T]").addEventListener("input", () => { const a = Tk; Tk = +q("[data-c=T]").value; const f = Math.sqrt(Tk / a); [c1, c2].forEach((c) => { c.ps.forEach((p) => { p.vx *= f; p.vy *= f; }); c.zera(); }); }); q("[data-c=C]").addEventListener("input", () => { Ec = +q("[data-c=C]").value; reinicia(); });
    q("[data-a=re]").addEventListener("click", reinicia);
    reinicia(); anima(el, F, (dt) => { c1.passo(dt, rnd, Tk, Ea, true); c2.passo(dt, rnd, Tk, Ec, true); desenha(); });
    SIM.eqCatalisador._ult = { semente: (n) => { rnd = G.rng(n); reinicia(); }, poe: (Tn, Cn) => { Tk = Tn; Ec = Cn; q("[data-c=T]").value = Tn; q("[data-c=C]").value = Cn; reinicia(); }, avanca: (seg, reagir = true) => { for (let i = 0; i < Math.round(seg * 60); i++) { c1.passo(1 / 60, rnd, Tk, Ea, reagir); c2.passo(1 / 60, rnd, Tk, Ec, reagir); } desenha(); }, est }; };

  /* ---------- EQ07 · Le Chatelier com partículas: N₂O₄ ⇌ 2 NO₂ ---------- */
  /* nome: "Le Chatelier ao vivo: aperte, aqueça, injete" · matéria: Química · tema: EQ07 */
  SIM.eqLeChatelier = (el, F) => { const W = 680, H = 300, bx = 20, by = 20, bw0 = 400, bh = 230, kd0 = 0.25, Ed = 6, pa = 0.5;
    let rnd = Math.random, ps = [], Tk = 300, vol = 1, t = 0, hist = [], marcas = [], acQ = [], nd = 0, na = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${sl("volume (pistão)", "V", 0.4, 1, 0.01, 1)}${sl("temperatura (K)", "T", 250, 400, 5, 300)}</div>
      <div><div class="bts"><button class="bt pri" data-a="inj">Injetar NO₂</button><button class="bt" data-a="re">Recomeçar</button></div><p style="margin:8px 0 0;font-size:13.5px;color:var(--ink2)">Bolinha grande clara: N₂O₄. Bolinha pequena castanha: NO₂.</p></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), bw = () => bw0 * vol, sig = (m) => S0 * Math.sqrt(Tk / 300) / Math.sqrt(m), kd = () => kd0 * Math.exp(Ed * (1 - 300 / Tk));
    const mol = (tipo, x, y, vx, vy) => ({ tipo, m: tipo ? 2 : 1, r: tipo ? 5 : 3.5, x, y, vx, vy });
    const nova = (tipo) => { const s = sig(tipo ? 2 : 1); return mol(tipo, bx + 6 + rnd() * (bw() - 12), by + 6 + rnd() * (bh - 12), G.gauss(rnd) * s, G.gauss(rnd) * s); };
    const reinicia = () => { ps = []; t = 0; hist = []; marcas = []; acQ = []; nd = 0; na = 0; for (let i = 0; i < 30; i++) ps.push(nova(1)); for (let i = 0; i < 20; i++) ps.push(nova(0)); };
    const conta = () => { let a = 0, b = 0; for (const p of ps) p.tipo ? b++ : a++; return { nNO2: a, nN2O4: b, N: a + 2 * b, Q: b ? a * a / (b * vol) : null, fr: a / (a + 2 * b) }; };
    const passo = (dt) => { const n = 3, h = dt / n, L = bw();
      for (let k = 0; k < n; k++) { for (const p of ps) { const s = sig(p.m), nrm = () => s * Math.sqrt(-2 * Math.log(1 - rnd() * 0.999999)), tg = () => G.gauss(rnd) * s; p.x += p.vx * h; p.y += p.vy * h;
          if (p.x < bx + p.r) { p.x = bx + p.r; p.vx = nrm(); p.vy = tg(); } if (p.x > bx + L - p.r) { p.x = bx + L - p.r; p.vx = -nrm(); p.vy = tg(); }
          if (p.y < by + p.r) { p.y = by + p.r; p.vy = nrm(); p.vx = tg(); } if (p.y > by + bh - p.r) { p.y = by + bh - p.r; p.vy = -nrm(); p.vx = tg(); } }
        const junta = []; for (let i = 0; i < ps.length; i++) { const a = ps[i]; if (a.fora) continue; for (let j = i + 1; j < ps.length; j++) { const b = ps[j]; if (b.fora) continue; const dx = b.x - a.x, dy = b.y - a.y, R = a.r + b.r; if (Math.abs(dx) > R || Math.abs(dy) > R) continue; const d2 = dx * dx + dy * dy; if (d2 >= R * R || d2 === 0) continue; const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (vn >= 0) continue;
            if (!a.tipo && !b.tipo && rnd() < pa) { a.fora = b.fora = true; junta.push(mol(1, (a.x + b.x) / 2, (a.y + b.y) / 2, (a.vx + b.vx) / 2, (a.vy + b.vy) / 2)); na++; break; }
            const J = (2 * a.m * b.m / (a.m + b.m)) * vn; a.vx += (J / a.m) * nx; a.vy += (J / a.m) * ny; b.vx -= (J / b.m) * nx; b.vy -= (J / b.m) * ny; } }
        if (junta.length) ps = ps.filter((p) => !p.fora).concat(junta);
        const pd = kd() * h, novas = []; for (const p of ps) if (p.tipo && rnd() < pd) { p.fora = true; const an = rnd() * 2 * Math.PI, u = Math.abs(G.gauss(rnd)) * sig(1) + 20, cx = Math.cos(an), cy = Math.sin(an); novas.push(mol(0, p.x + 4 * cx, p.y + 4 * cy, p.vx + u * cx, p.vy + u * cy), mol(0, p.x - 4 * cx, p.y - 4 * cy, p.vx - u * cx, p.vy - u * cy)); nd++; }
        if (novas.length) ps = ps.filter((p) => !p.fora).concat(novas); }
      t += dt; const c = conta(); if (c.Q !== null) { acQ.push(c.Q); if (acQ.length > 180) acQ.shift(); } if (!hist.length || t - hist[hist.length - 1][0] > 0.3) { hist.push([t, c.fr]); if (hist.length > 400) { hist.shift(); } } };
    const est = () => { const c = conta(); return { ...c, Tk, vol, t, nd, na, Qmed: acQ.length ? acQ.reduce((a, x) => a + x, 0) / acQ.length : null, kd: kd() }; };
    const marca = (rot) => { marcas.push([t, rot]); acQ = []; };
    const desenha = () => { const e = est(), L = bw(); q("[data-o=V]").textContent = n2(vol, 2) + " ×"; q("[data-o=T]").textContent = Tk + " K";
      const cast = Math.min(0.55, 0.012 * e.nNO2 / vol);
      let s = `<rect x="${bx}" y="${by}" width="${L}" height="${bh}" style="fill:rgba(150,82,30,${cast.toFixed(3)});stroke:var(--ink2);stroke-width:2"/><rect x="${bx + L}" y="${by}" width="10" height="${bh}" style="fill:var(--ink2)"/><line x1="${bx + L + 10}" y1="${by + bh / 2}" x2="${bx + bw0 + 24}" y2="${by + bh / 2}" style="stroke:var(--ink2);stroke-width:4"/>`;
      ps.forEach((p) => (s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r}" style="fill:${p.tipo ? "#d9dde3" : "#b5672a"}"/>`));
      const gx = 470, gy = 250, gw = 190, gh = 200; s += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" style="stroke:var(--ink3)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" style="stroke:var(--ink3)"/>` + T(gx + gw / 2, 16, "fração do nitrogênio na forma de NO₂", "middle", "tx2", 11) + T(gx - 4, gy - gh + 4, "100%", "end", "tx2", 10) + T(gx - 4, gy + 4, "0", "end", "tx2", 10);
      if (hist.length > 1) { const t0 = hist[0][0], t1 = Math.max(t0 + 20, hist[hist.length - 1][0]), X = (v) => gx + gw * (v - t0) / (t1 - t0); s += `<path d="${hist.map((p, i) => (i ? "L" : "M") + X(p[0]).toFixed(1) + "," + (gy - gh * p[1]).toFixed(1)).join("")}" style="fill:none;stroke:#c9803f;stroke-width:2"/>`; marcas.filter((m) => m[0] >= t0).forEach((m) => (s += `<line x1="${X(m[0])}" y1="${gy}" x2="${X(m[0])}" y2="${gy - gh}" style="stroke:var(--warn);stroke-dasharray:3 3"/>` + T(X(m[0]) + 3, gy - gh + 14, m[1], "start", "tx2", 9))); }
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("moléculas de NO₂", e.nNO2) + vis("moléculas de N₂O₄", e.nN2O4) + vis("Q = [NO₂]²/[N₂O₄] (média de 3 s)", e.Qmed === null ? "—" : n2(e.Qmed, 1)) + vis("átomos de N (não muda sem injetar)", e.N);
      q("[data-v=st]").innerHTML = "N₂O₄ (incolor) ⇌ 2 NO₂ (castanho), reação direta endotérmica. Cada N₂O₄ pode se partir sozinho, tanto mais depressa quanto mais quente; dois NO₂ que se chocam podem se juntar. O equilíbrio é o empate entre os dois processos, que não param. <b>Aperte</b> o pistão: os NO₂ se encontram mais vezes, a associação ganha e o sistema vai para o lado com menos moléculas; depois de assentar, Q volta ao mesmo valor (K só depende da temperatura). <b>Aqueça</b>: a quebra acelera, forma-se mais NO₂ e o gás escurece; aqui K muda. <b>Injete NO₂</b>: parte dele é consumida. Modelo: taxas escolhidas para a simulação; cores e sentido do calor são os da reação real."; };
    q("[data-c=V]").addEventListener("input", () => { vol = +q("[data-c=V]").value; const L = bw(); for (const p of ps) if (p.x > bx + L - p.r) p.x = bx + L - p.r; }); q("[data-c=V]").addEventListener("change", () => marca("volume")); q("[data-c=T]").addEventListener("input", () => { const a = Tk; Tk = +q("[data-c=T]").value; const f = Math.sqrt(Tk / a); ps.forEach((p) => { p.vx *= f; p.vy *= f; }); }); q("[data-c=T]").addEventListener("change", () => marca("temp."));
    q("[data-a=inj]").addEventListener("click", () => { for (let i = 0; i < 12; i++) ps.push(nova(0)); marca("+NO₂"); }); q("[data-a=re]").addEventListener("click", reinicia);
    reinicia(); anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqLeChatelier._ult = { semente: (n) => { rnd = G.rng(n); reinicia(); }, poe: (Tn, Vn) => { const a = Tk; Tk = Tn; vol = Vn; q("[data-c=T]").value = Tn; q("[data-c=V]").value = Vn; const f = Math.sqrt(Tk / a), L = bw(); ps.forEach((p) => { p.vx *= f; p.vy *= f; if (p.x > bx + L - p.r) p.x = bx + L - p.r; }); acQ = []; }, injeta: (k = 12) => { for (let i = 0; i < k; i++) ps.push(nova(0)); acQ = []; }, avanca: (seg) => { for (let i = 0; i < Math.round(seg * 60); i++) passo(1 / 60); desenha(); },
      media: (seg) => { let sQ = 0, sF = 0, k = 0; for (let i = 0; i < Math.round(seg * 60); i++) { passo(1 / 60); const c = conta(); if (c.Q !== null) { sQ += c.Q; sF += c.fr; k++; } } desenha(); return { Q: sQ / k, fr: sF / k }; }, est }; };

  /* ---------- EQ08 · bureta com gotas de verdade ---------- */
  /* nome: "Bureta: abra a torneira e pare na viragem" · matéria: Química · tema: EQ08 */
  SIM.eqBureta = (el, F) => { const W = 680, H = 320, GOTA = 0.05, INDS = ["alaranjado_de_metila", "azul_de_bromotimol", "fenolftaleina"].map((k) => SIM.ANA.IND.find((x) => x.id === k));
    let id = "hcl", am = "A", ind = "fenolftaleina", v = 0, taxa = 0, gotas = [], acum = 0, ver = false, t = 0, pts = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes([["hcl", "HCl ← NaOH"], ["hac", "ácido acético ← NaOH"]], "t", id)}</div><div class="bts" style="margin-top:6px">${botoes([["A", "amostra A"], ["B", "amostra B"], ["C", "amostra C"]], "am", am)}</div><div class="bts" style="margin-top:6px">${botoes(INDS.map((i) => [i.id, i.nome]), "i", ind)}</div></div>
      <div>${sl("torneira (gotas por segundo)", "x", 0, 12, 0.5, 0)}<div class="bts"><button class="bt pri" data-a="g1">+ 1 gota</button><button class="bt" data-a="fe">Fechar</button><button class="bt" data-a="re">Encher de novo</button><button class="bt" data-a="ver" aria-pressed="false">Mostrar a concentração</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => ({ ...SIM.titula(id, am, v, ind), taxa, ngotas: Math.round(v / GOTA), noAr: gotas.length, ver, npts: pts.length });
    const reinicia = () => { v = 0; taxa = 0; gotas = []; acum = 0; ver = false; pts = [[0, SIM.titula(id, am, 0, ind).pH]]; q("[data-c=x]").value = 0; q("[data-a=ver]").setAttribute("aria-pressed", "false"); };
    const cai = () => { if (v + (gotas.length + 1) * GOTA <= 50) gotas.push(0); };
    const passo = (dt) => { t += dt; acum += taxa * dt; while (acum >= 1) { acum -= 1; cai(); } gotas = gotas.map((y) => y + 260 * dt); const ch = gotas.filter((y) => y >= 70).length; gotas = gotas.filter((y) => y < 70); for (let i = 0; i < ch; i++) { v = +(v + GOTA).toFixed(2); pts.push([v, SIM.titula(id, am, v, ind).pH]); } };
    const desenha = () => { const e = est(), niv = 14 + 2.6 * v; q("[data-o=x]").textContent = n2(taxa, 1);
      let s = `<rect x="62" y="14" width="16" height="130" style="fill:none;stroke:var(--ink2);stroke-width:1.6"/><rect x="63.5" y="${niv}" width="13" height="${144 - niv}" style="fill:#6fa8dc;opacity:.55"/><path d="M70,144 v14" style="stroke:var(--ink2);stroke-width:2"/><rect x="62" y="149" width="16" height="5" style="fill:${taxa > 0 ? "var(--ok)" : "var(--ink2)"}"/>` + [0, 10, 20, 30, 40, 50].map((m) => `<line x1="78" y1="${14 + 2.6 * m}" x2="84" y2="${14 + 2.6 * m}" style="stroke:var(--ink2)"/>` + T(88, 18 + 2.6 * m, m, "start", "tx2", 10)).join("");
      gotas.forEach((y) => (s += `<ellipse cx="70" cy="${160 + y}" rx="2.6" ry="3.6" style="fill:#6fa8dc"/>`));
      const bal = Math.sin(t * 5) * (gotas.length || taxa > 0 ? 2 : 0);
      s += `<path d="M62,232 v16 l-34,52 h84 l-34,-52 v-16" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="M${50 + bal},268 l-20,30 h80 l-20,-30 z" style="fill:${e.hex};opacity:${e.cor === "incolor" ? 0.25 : 0.85}"/>` + T(124, 34, "NaOH 0,1 mol/L", "start", "tx2", 12) + T(124, 270, "25,00 mL de amostra", "start", "tx2", 12) + T(124, 288, "cor: " + e.cor, "start", "tx", 12);
      const gx = 340, gy = 280, gw = 300, gh = 240, X = (x) => gx + gw * x / 50, Y = (p) => gy - gh * p / 14, I = SIM.ANA.IND.find((x) => x.id === ind);
      s += `<rect x="${gx}" y="${Y(I.hi)}" width="${gw}" height="${Y(I.lo) - Y(I.hi)}" style="fill:var(--ink3);opacity:.25"/><line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" style="stroke:var(--ink2)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" style="stroke:var(--ink2)"/>` + [0, 7, 14].map((p) => T(gx - 6, Y(p) + 4, p, "end", "tx2", 10)).join("") + [0, 10, 20, 30, 40, 50].map((m) => T(X(m), gy + 14, m, "middle", "tx2", 10)).join("") + T(gx + gw / 2, gy + 30, "volume gasto (mL)", "middle", "tx2", 11) + T(gx + 6, gy - gh - 2, "pH", "start", "tx2", 11) + T(gx + gw - 2, Y(I.hi) - 4, "faixa do indicador", "end", "tx2", 10);
      if (pts.length > 1) s += `<path d="${pts.map((p, i) => (i ? "L" : "M") + X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1)).join("")}" style="fill:none;stroke:var(--mod);stroke-width:2"/>`; s += `<circle cx="${X(v)}" cy="${Y(e.pH)}" r="5" style="fill:var(--warn);stroke:var(--bg);stroke-width:1.5"/>`;
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("volume gasto", v.toFixed(2).replace(".", ",") + " mL") + vis("gotas", e.ngotas) + vis("pH", n2(e.pH, 2)) + vis("cor", e.cor) + vis("equivalência", ver ? n2(e.veq, 2) + " mL" : "?") + vis("concentração da amostra", ver ? n2(e.ca, 4) + " mol/L" : "?");
      q("[data-v=st]").innerHTML = (ver ? `A equivalência é em ${n2(e.veq, 2)} mL: 0,1 mol/L × ${n2(e.veq, 2)} mL ÷ 25,00 mL = <b>${n2(e.ca, 4)} mol/L</b>. ${v > e.veq + 0.1 ? "Você passou " + n2(v - e.veq, 2) + " mL do ponto: a conta com o seu volume daria " + n2(100 * (v - e.veq) / e.veq, 1) + " % a mais." : v < e.veq - 0.1 ? "Você ainda não chegou lá." : "Você parou em cima do ponto."} ` : "Abra a torneira e veja a curva de pH se desenhar. Perto da viragem a cor aparece onde a gota cai e some ao agitar: é hora de fechar e ir gota a gota. Pare na primeira cor que fica, leia o volume e calcule a concentração antes de pedir para ver. Dá para passar do ponto de propósito e ver o salto de pH. ") + "Cada gota: 0,05 mL. pH pelo balanço de carga, a 25 °C; faixas dos indicadores: Wikipedia. Amostras hipotéticas."; };
    liga(el, "t", (x) => { id = x; reinicia(); }); liga(el, "am", (x) => { am = x; reinicia(); }); liga(el, "i", (x) => { ind = x; });
    q("[data-c=x]").addEventListener("input", () => { taxa = +q("[data-c=x]").value; }); q("[data-a=g1]").addEventListener("click", cai); q("[data-a=fe]").addEventListener("click", () => { taxa = 0; q("[data-c=x]").value = 0; }); q("[data-a=re]").addEventListener("click", reinicia); q("[data-a=ver]").addEventListener("click", () => { ver = !ver; q("[data-a=ver]").setAttribute("aria-pressed", String(ver)); });
    reinicia(); anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqBureta._ult = { poe: (i, a, indic) => { id = i; am = a; ind = indic || "fenolftaleina"; [["t", id], ["am", am], ["i", ind]].forEach(([k, x]) => el.querySelectorAll(`[data-${k}]`).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset[k] === x)))); reinicia(); }, torneira: (x) => { taxa = x; q("[data-c=x]").value = x; }, gota: cai, mostra: (x) => { ver = !!x; }, avanca: (seg) => { for (let i = 0; i < Math.round(seg * 60); i++) passo(1 / 60); desenha(); }, est }; };

  /* ---------- EQ21 · balanceador visual ---------- */
  const CORAT = { H: "#e8ecf2", O: "#e2504c", C: "#7d8590", N: "#4f7fe0", Cl: "#4fb36b", Na: "#9d6bd6", K: "#b784e0", Mg: "#6fbf8f", Al: "#b9c2cc", Fe: "#c9703a", S: "#e0c23c", P: "#e08a3c", Ca: "#8fbf5f" };
  SIM.eqSub = (f) => f.replace(/(\d)/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[+d]);
  /* nome: "Balanceador visual: átomos dos dois lados" · matéria: Química · tema: EQ21 */
  SIM.eqBalanca = (el, F) => { const W = 680, H = 330, EQ = SIM.EQS; let k = 0, coef = [], ang = 0, t = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts" data-v="cf"></div></div><div><div class="bts"><button class="bt pri" data-a="prox">Outra equação</button><button class="bt" data-a="zera">Voltar tudo para 1</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), eq = () => EQ[k], esp = () => eq().r.concat(eq().p);
    const est = () => { const e = eq(), tot = SIM.confere(e.r, e.p, coef), els = Object.keys(tot), ok = els.every((x) => tot[x][0] === tot[x][1]), sol = SIM.balanceia(e.r, e.p), minimo = ok && sol && sol.every((v, i) => v === coef[i]), mE = e.r.reduce((s, f, i) => s + coef[i] * SIM.mm(f), 0), mD = e.p.reduce((s, f, i) => s + coef[e.r.length + i] * SIM.mm(f), 0); return { k, coef: coef.slice(), tot, ok, minimo, sol, mE, mD, ang }; };
    const monta = () => { coef = esp().map(() => 1); const e = eq(); q("[data-v=cf]").innerHTML = esp().map((f, i) => `${i === e.r.length ? '<span style="align-self:center;padding:0 6px">→</span>' : ""}<span style="display:inline-flex;align-items:center;gap:2px"><button class="bt peq" data-m="${i}">−</button><b data-n="${i}" style="min-width:18px;text-align:center">1</b><button class="bt peq" data-p="${i}">+</button><span style="padding:0 6px 0 2px">${SIM.eqSub(f)}</span></span>`).join("");
      el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.m; coef[i] = Math.max(1, coef[i] - 1); })); el.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.p; coef[i] = Math.min(30, coef[i] + 1); })); };
    const passo = (dt) => { t += dt; const e = est(), alvo = Math.max(-14, Math.min(14, 40 * (e.mD - e.mE) / Math.max(e.mE, e.mD))); ang += (alvo - ang) * Math.min(1, 5 * dt); };
    const desenha = () => { const e = est(), E = eq(); coef.forEach((c, i) => { const b = q(`[data-n="${i}"]`); if (b) b.textContent = c; });
      const cx = W / 2, cy = 86, bra = 200, rad = ang * Math.PI / 180, xe = cx - bra * Math.cos(rad), ye = cy - bra * Math.sin(rad), xd = cx + bra * Math.cos(rad), yd = cy + bra * Math.sin(rad);
      let s = `<polygon points="${cx - 16},${cy + 60} ${cx + 16},${cy + 60} ${cx},${cy}" style="fill:var(--ink3)"/><line x1="${xe}" y1="${ye}" x2="${xd}" y2="${yd}" style="stroke:${e.ok ? "var(--ok)" : "var(--ink2)"};stroke-width:5;stroke-linecap:round"/>`;
      const prato = (x, y, lista, base) => { let o = `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 26}" style="stroke:var(--ink2)"/><rect x="${x - 110}" y="${y + 26}" width="220" height="5" rx="2" style="fill:var(--ink2)"/>`; const bolas = []; lista.forEach((f, i) => { const a = SIM.atomos(f); for (let c = 0; c < coef[base + i]; c++) bolas.push(a); });
        const mostra = bolas.slice(0, 12), larg = 220 / Math.max(1, Math.min(12, mostra.length)); mostra.forEach((a, i) => { let j = 0; for (const elx in a) { if (elx === "±") continue; for (let c = 0; c < Math.min(a[elx], 8); c++) { o += `<circle cx="${(x - 110 + larg * (i + 0.5) + ((j % 3) - 1) * 7).toFixed(1)}" cy="${(y + 18 - Math.floor(j / 3) * 9).toFixed(1)}" r="4.2" style="fill:${CORAT[elx] || "var(--mod)"};stroke:var(--bg);stroke-width:.6"/>`; j++; } } });
        if (bolas.length > 12) o += T(x, y - 8, "+" + (bolas.length - 12) + " moléculas", "middle", "tx2", 10); return o; };
      s += prato(xe, ye, E.r, 0) + prato(xd, yd, E.p, E.r.length);
      const els = Object.keys(e.tot), col = 620 / els.length; els.forEach((x, i) => { const [a, b] = e.tot[x], xc = 30 + col * (i + 0.5), igual = a === b; s += `<circle cx="${xc - 34}" cy="232" r="7" style="fill:${CORAT[x] || "var(--mod)"}"/>` + T(xc - 20, 237, x, "start", "tx", 14) + T(xc, 262, a + (igual ? " = " : a < b ? " &lt; " : " &gt; ") + b, "middle", "tx", 15) + `<rect x="${xc - 40}" y="272" width="80" height="6" rx="3" style="fill:${igual ? "var(--ok)" : "var(--bad)"}"/>`; });
      s += T(W / 2, 306, "átomos de cada elemento: reagentes  |  produtos", "middle", "tx2", 11);
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("equação", E.r.map((f, i) => (coef[i] > 1 ? coef[i] + " " : "") + SIM.eqSub(f)).join(" + ") + " → " + E.p.map((f, i) => (coef[E.r.length + i] > 1 ? coef[E.r.length + i] + " " : "") + SIM.eqSub(f)).join(" + ")) + vis("massa dos reagentes | dos produtos", n2(e.mE, 1) + " | " + n2(e.mD, 1)) + vis("situação", e.minimo ? "balanceada ✓" : e.ok ? "balanceada, mas dá para simplificar" : "ainda não");
      q("[data-v=st]").innerHTML = (e.minimo ? "Balanceada: cada elemento tem o mesmo número de átomos dos dois lados, e a balança fica na horizontal. Átomo não se cria nem se destrói numa reação: só muda de companhia. " : e.ok ? "Os átomos conferem, mas todos os coeficientes podem ser divididos por um mesmo número. A equação balanceada usa os menores inteiros. " : "Mexa só nos coeficientes (os números na frente), nunca nos índices das fórmulas. Um bom caminho: comece pelo elemento que aparece em menos substâncias e deixe hidrogênio e oxigênio para o fim. ") + "As massas usam as massas atômicas arredondadas do site. Cada prato mostra até 12 moléculas."; };
    q("[data-a=prox]").addEventListener("click", () => { k = (k + 1) % EQ.length; monta(); }); q("[data-a=zera]").addEventListener("click", () => { coef = esp().map(() => 1); });
    monta(); anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqBalanca._ult = { poe: (i, c) => { k = i; monta(); if (c) coef = c.slice(); }, avanca: (seg) => { for (let i = 0; i < Math.round(seg * 60); i++) passo(1 / 60); desenha(); }, clica: (i, mais) => q(`[data-${mais ? "p" : "m"}="${i}"]`).click(), est }; };
})();
