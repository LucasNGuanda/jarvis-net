/* Química · aba Experimentos, módulo Eletroquímica (EQ09 a EQ11).
   DADOS: potenciais padrão e massas molares de SIM.ELETRO (assets/sims/quimica/eletro.js, com fonte em tools/quimica/dadosG.json); F = 96485 C/mol.
   EQ09 SIM.eqDaniell: pilha Zn | Zn²⁺ || Cu²⁺ | Cu com o tempo correndo. I = E/R (E pela equação de Nernst, a 25 °C); a cada instante dn = I·dt/(2F):
     o zinco perde massa, o cobre ganha, [Zn²⁺] sobe e [Cu²⁺] cai (100 mL em cada béquer). Sem ponte salina ou com a chave aberta, I = 0.
   EQ10 SIM.eqEletrolise: lei de Faraday com o tempo correndo. Água: 2 H₂O → 2 H₂ + O₂ (4 e⁻ por O₂, 2 e⁻ por H₂). Cobre com eletrodos de cobre: o ânodo perde
     o que o cátodo ganha (2 e⁻ por Cu). NaCl fundido: Na no cátodo (1 e⁻) e Cl₂ no ânodo (2 e⁻). Volume dos gases a 25 °C e 1 atm: 24,47 L/mol (R·T/P, R = 0,082057).
   EQ11 SIM.eqCorrosao: ferro em contato com outro metal. QUEM corrói é decidido pelos potenciais padrão (corrói o de menor E° de redução); precisa de água e de oxigênio.
     A VELOCIDADE é ilustrativa (cresce com a diferença de potencial; dito na tela): não é dado medido.
   Conferido em Python (tools/quimica/confere-exp-eletro.py): 965 C = 0,0100 mol de e⁻ → 0,3175 g de Cu, 0,0050 mol de H₂ (122,3 mL) e 0,0025 mol de O₂ (61,2 mL);
     pilha de Daniell padrão: 1,10 V; com [Zn²⁺] = 1,9 e [Cu²⁺] = 0,1: 1,062 V. */
(function () {
  const SIM = (window.SIM = window.SIM || {}), EL = SIM.ELETRO, FAR = 96485, VM = 0.082057 * 298.15;
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const T = (x, y, s, a = "middle", c = "tx2", t = 12) => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}" style="font-size:${t}px">${s}</text>`;
  const hms = (s) => (s < 120 ? n2(s, 0) + " s" : s < 7200 ? n2(s / 60, 1) + " min" : n2(s / 3600, 1) + " h");
  const beq = (x, y, w, h, cor, op) => `<path d="M${x},${y} v${h} h${w} v${-h}" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="${x + 2}" y="${y + 22}" width="${w - 4}" height="${h - 24}" style="fill:${cor};opacity:${op}"/>`;

  /* ---------- EQ09 · pilha de Daniell ---------- */
  /* nome: "Pilha de Daniell: os elétrons pelo fio, os íons pela ponte" · matéria: Química · tema: EQ09 */
  SIM.eqDaniell = (el, F) => { const W = 680, H = 310, VOL = 0.1, M0 = 10;
    let fechado = true, ponte = true, Rr = 2, acel = 600, cZn = 1, cCu = 1, mZn = M0, mCu = M0, t = 0, q = 0, fase = 0, hist = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${sl("resistência do circuito (Ω)", "R", 0.5, 20, 0.5, 2)}${sl("acelerar o tempo (vezes)", "a", 1, 3600, 1, 600)}</div>
      <div><div class="bts"><button class="bt" data-a="ch" aria-pressed="true">Chave fechada</button><button class="bt" data-a="po" aria-pressed="true">Ponte salina no lugar</button><button class="bt pri" data-a="re">Pilha nova</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const qs = (s) => el.querySelector(s);
    const E = () => (cCu <= 1e-9 || mZn <= 0 ? 0 : Math.max(0, EL.nernst("Zn", "Cu", cZn, Math.max(cCu, 1e-12)).E));
    const I = () => (fechado && ponte ? E() / Rr : 0);
    const reinicia = () => { cZn = 1; cCu = 1; mZn = M0; mCu = M0; t = 0; q = 0; hist = []; };
    const passo = (dt) => { fase += dt; let resto = dt * acel; while (resto > 0) { const h = Math.min(resto, 5), i = I(); if (i <= 0) break; let dn = i * h / (2 * FAR); dn = Math.min(dn, cCu * VOL, mZn / 65); cZn += dn / VOL; cCu -= dn / VOL; mZn -= dn * 65; mCu += dn * 63.5; q += dn * 2 * FAR; t += h; resto -= h; if (cCu < 1e-9) cCu = 0; }
      if (!hist.length || t - hist[hist.length - 1][0] > 30) { hist.push([t, E()]); if (hist.length > 500) hist = hist.filter((_, k) => k % 2 === 0); } };
    const est = () => ({ fechado, ponte, R: Rr, E: E(), I: I(), cZn, cCu, mZn, mCu, t, q, nZn: (M0 - mZn) / 65, nCu: (mCu - M0) / 63.5, ne: q / FAR });
    const desenha = () => { const e = est(); qs("[data-o=R]").textContent = n2(Rr, 1) + " Ω"; qs("[data-o=a]").textContent = acel + " ×";
      const wz = 6 + 22 * e.mZn / M0, wc = 6 + 22 * Math.min(2.2, e.mCu / M0), anda = e.I > 0;
      let s = beq(60, 120, 170, 150, "#9fb0c4", 0.25) + beq(330, 120, 170, 150, "#3f8fd6", Math.min(0.7, 0.08 + 0.5 * e.cCu));
      s += `<rect x="${130 - wz / 2}" y="100" width="${wz}" height="150" style="fill:#9fb0c4;stroke:var(--ink2)"/><rect x="${430 - wc / 2}" y="100" width="${wc}" height="150" style="fill:#c9853d;stroke:var(--ink2)"/>` + T(130, 292, "Zn (ânodo, −)", "middle", "tx", 12) + T(430, 292, "Cu (cátodo, +)", "middle", "tx", 12) + T(92, 262, "Zn²⁺", "middle", "tx2", 11) + T(470, 262, "Cu²⁺", "middle", "tx2", 11);
      if (ponte) s += `<path d="M190,150 v-34 q0,-14 14,-14 h132 q14,0 14,14 v34" style="fill:none;stroke:var(--ink2);stroke-width:12;opacity:.55"/><path d="M190,150 v-34 q0,-14 14,-14 h132 q14,0 14,14 v34" style="fill:none;stroke:var(--bg);stroke-width:7"/>` + T(270, 96, "ponte salina", "middle", "tx2", 10);
      s += `<path d="M130,100 V40 H${fechado ? 250 : 236}" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="M${fechado ? 250 : 264},${fechado ? 40 : 28} L310,40 H430 V100" style="fill:none;stroke:var(--ink2);stroke-width:2"/><circle cx="350" cy="40" r="17" style="fill:var(--bg);stroke:var(--ink2);stroke-width:2"/>` + T(350, 44, n2(e.fechado && e.ponte ? e.E : e.E, 2) + " V", "middle", "tx", 10);
      if (anda) { const v = 40 + 60 * Math.min(1, e.I / 0.6); for (let k = 0; k < 6; k++) { const u = ((fase * v + k * 60) % 360) / 360, x = u < 0.166 ? 130 : u > 0.833 ? 430 : 130 + (u - 0.166) / 0.667 * 300, y = u < 0.166 ? 100 - u / 0.166 * 60 : u > 0.833 ? 40 + (u - 0.833) / 0.167 * 60 : 40; if (Math.abs(x - 350) > 20 || y !== 40) s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" style="fill:var(--warn)"/>`; }
        for (let k = 0; k < 3; k++) { const u = (fase * 0.5 + k / 3) % 1; s += `<circle cx="${(130 + wz / 2 + 4 + 34 * u).toFixed(1)}" cy="${170 + 26 * k}" r="3" style="fill:#9fb0c4;opacity:${(1 - u).toFixed(2)}"/><circle cx="${(430 - wc / 2 - 38 + 34 * u).toFixed(1)}" cy="${170 + 26 * k}" r="3" style="fill:#3f8fd6;opacity:${u.toFixed(2)}"/>`; }
        const u = (fase * 0.4) % 1; s += `<circle cx="${(336 - 132 * u).toFixed(1)}" cy="102" r="2.6" style="fill:var(--mA)"/><circle cx="${(204 + 132 * u).toFixed(1)}" cy="102" r="2.6" style="fill:var(--bad)"/>`; s += T(280, 30, "e⁻ →", "middle", "tx2", 11); }
      const gx = 540, gy = 270, gw = 120, gh = 150; s += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" style="stroke:var(--ink3)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" style="stroke:var(--ink3)"/>` + T(gx + gw / 2, gy - gh - 8, "tensão × tempo", "middle", "tx2", 10) + T(gx - 4, gy - gh * 1.1 / 1.2 + 4, "1,1", "end", "tx2", 9);
      if (hist.length > 1) { const tm = Math.max(3600, hist[hist.length - 1][0]); s += `<path d="${hist.map((p, i) => (i ? "L" : "M") + (gx + gw * p[0] / tm).toFixed(1) + "," + (gy - gh * p[1] / 1.2).toFixed(1)).join("")}" style="fill:none;stroke:var(--warn);stroke-width:2"/>`; }
      qs("[data-v=sv]").innerHTML = s;
      qs("[data-v=lt]").innerHTML = vis("tensão", n2(e.E, 3) + " V") + vis("corrente", n2(1000 * e.I, 0) + " mA") + vis("[Zn²⁺] | [Cu²⁺] (mol/L)", n2(e.cZn, 2) + " | " + n2(e.cCu, 2)) + vis("massa: Zn | Cu (g)", n2(e.mZn, 2) + " | " + n2(e.mCu, 2)) + vis("tempo de uso", hms(e.t)) + vis("elétrons que passaram", n2(e.ne, 4) + " mol");
      qs("[data-v=st]").innerHTML = (!ponte ? "Sem a ponte salina, o béquer do zinco ficaria positivo e o do cobre, negativo, logo na primeira leva de elétrons: a corrente para. A ponte fecha o circuito por dentro, com íons. " : !fechado ? "Chave aberta: o voltímetro marca a tensão, mas não passa corrente e nada se gasta. " : e.E <= 0 ? "Pilha descarregada: acabou o Cu²⁺ (ou o zinco). " : "O zinco se oxida (Zn → Zn²⁺ + 2 e⁻) e vai para a solução; os elétrons seguem pelo fio; no cobre, o Cu²⁺ da solução os recebe e se deposita (Cu²⁺ + 2 e⁻ → Cu). O zinco afina, o cobre engrossa, o azul do Cu²⁺ desbota e a tensão cai aos poucos (equação de Nernst). Pela ponte, ânions vão para o lado do zinco e cátions para o lado do cobre. ") + "Béqueres de 100 mL, 1 mol/L no início, 25 °C; tensão padrão: 1,10 V (potenciais do OpenStax). Resistência interna desprezada."; };
    qs("[data-c=R]").addEventListener("input", () => { Rr = +qs("[data-c=R]").value; }); qs("[data-c=a]").addEventListener("input", () => { acel = +qs("[data-c=a]").value; });
    qs("[data-a=ch]").addEventListener("click", (ev) => { fechado = !fechado; ev.target.setAttribute("aria-pressed", String(fechado)); ev.target.textContent = fechado ? "Chave fechada" : "Chave aberta"; }); qs("[data-a=po]").addEventListener("click", (ev) => { ponte = !ponte; ev.target.setAttribute("aria-pressed", String(ponte)); ev.target.textContent = ponte ? "Ponte salina no lugar" : "Sem ponte salina"; }); qs("[data-a=re]").addEventListener("click", reinicia);
    reinicia(); anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqDaniell._ult = { poe: (o) => { if (o.fechado !== undefined) fechado = o.fechado; if (o.ponte !== undefined) ponte = o.ponte; if (o.R) Rr = o.R; if (o.acel) acel = o.acel; reinicia(); }, liga: (f, p) => { fechado = f; ponte = p; }, avanca: (seg) => { for (let i = 0; i < Math.round(seg * 60); i++) passo(1 / 60); desenha(); }, est }; };

  /* ---------- EQ10 · eletrólise ---------- */
  /* n de elétrons por unidade de produto e massa molar; cátodo (−) e ânodo (+) */
  SIM.ELETROLISE = {
    agua: { nome: "água (com um pouco de ácido)", cat: { f: "H₂", z: 2, gas: true }, an: { f: "O₂", z: 4, gas: true }, eq: "2 H₂O → 2 H₂ + O₂", liq: "#6fa8dc" },
    cobre: { nome: "CuSO₄ com eletrodos de cobre", cat: { f: "Cu", z: 2, M: 63.5, ganha: true }, an: { f: "Cu", z: 2, M: 63.5, perde: true }, eq: "ânodo: Cu → Cu²⁺ + 2 e⁻;  cátodo: Cu²⁺ + 2 e⁻ → Cu", liq: "#3f8fd6" },
    nacl: { nome: "NaCl fundido", cat: { f: "Na", z: 1, M: 23 }, an: { f: "Cl₂", z: 2, gas: true }, eq: "2 NaCl → 2 Na + Cl₂", liq: "#d9b48a" } };
  SIM.eletrolise = (tipo, q) => { const c = SIM.ELETROLISE[tipo], ne = q / FAR, pr = (p) => { const n = ne / p.z; return { f: p.f, n, m: p.M ? n * p.M : null, mL: p.gas ? n * VM * 1000 : null }; }; return { ne, cat: pr(c.cat), an: pr(c.an) }; };
  /* nome: "Eletrólise: a corrente obriga a reação" · matéria: Química · tema: EQ10 */
  SIM.eqEletrolise = (el, F) => { const W = 680, H = 310; let tipo = "agua", cor = 1, acel = 60, ligado = true, t = 0, q = 0, fase = 0, bolhas = [], sem = 1;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(Object.keys(SIM.ELETROLISE).map((k) => [k, SIM.ELETROLISE[k].nome]), "t", tipo)}</div>${sl("corrente (A)", "i", 0.1, 5, 0.1, 1)}</div>
      <div>${sl("acelerar o tempo (vezes)", "a", 1, 600, 1, 60)}<div class="bts"><button class="bt" data-a="lg" aria-pressed="true">Fonte ligada</button><button class="bt pri" data-a="re">Recomeçar</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const qs = (s) => el.querySelector(s), est = () => ({ tipo, i: cor, t, q, ligado, ...SIM.eletrolise(tipo, q) });
    const reinicia = () => { t = 0; q = 0; bolhas = []; };
    const ale = () => { sem = (sem * 16807) % 2147483647; return sem / 2147483647; };
    const passo = (dt) => { fase += dt; if (ligado) { t += dt * acel; q += cor * dt * acel; const C = SIM.ELETROLISE[tipo]; [[C.cat, 250], [C.an, 430]].forEach(([p, x]) => { if (p.gas && ale() < dt * cor * 8 / p.z * 2) bolhas.push({ x: x + (ale() - 0.5) * 16, y: 250, r: 2 + ale() * 2 }); }); }
      bolhas.forEach((b) => (b.y -= 70 * dt)); bolhas = bolhas.filter((b) => b.y > 96); };
    const desenha = () => { const e = est(), C = SIM.ELETROLISE[tipo]; qs("[data-o=i]").textContent = n2(cor, 1) + " A"; qs("[data-o=a]").textContent = acel + " ×";
      let s = beq(170, 90, 340, 190, C.liq, tipo === "cobre" ? 0.45 : 0.25);
      const wc = tipo === "cobre" ? 14 + Math.min(16, 40 * (e.cat.m || 0)) : 14, wa = tipo === "cobre" ? Math.max(3, 14 - Math.min(11, 40 * (e.an.m || 0))) : 14, mcor = tipo === "cobre" ? "#c9853d" : "#8f9aa6";
      s += `<rect x="${250 - wc / 2}" y="70" width="${wc}" height="190" style="fill:${mcor};stroke:var(--ink2)"/><rect x="${430 - wa / 2}" y="70" width="${wa}" height="190" style="fill:${mcor};stroke:var(--ink2)"/>` + T(250, 300, "cátodo (−): " + C.cat.f, "middle", "tx", 12) + T(430, 300, "ânodo (+): " + C.an.f, "middle", "tx", 12);
      s += `<path d="M250,70 V30 H318 M362,30 H430 V70" style="fill:none;stroke:var(--ink2);stroke-width:2"/><line x1="318" y1="18" x2="318" y2="42" style="stroke:var(--ink2);stroke-width:2"/><line x1="326" y1="24" x2="326" y2="36" style="stroke:var(--ink2);stroke-width:4"/><line x1="354" y1="18" x2="354" y2="42" style="stroke:var(--ink2);stroke-width:2"/><line x1="362" y1="24" x2="362" y2="36" style="stroke:var(--ink2);stroke-width:4"/>` + T(340, 14, "fonte", "middle", "tx2", 10) + T(310, 34, "−", "end", "tx", 13) + T(372, 34, "+", "start", "tx", 13);
      if (ligado) for (let k = 0; k < 4; k++) { const u = (fase * 0.7 + k / 4) % 1; s += `<circle cx="${(318 - 68 * Math.min(1, u * 2)).toFixed(1)}" cy="${(30 + 40 * Math.max(0, u * 2 - 1)).toFixed(1)}" r="3" style="fill:var(--warn)"/><circle cx="${430}" cy="${(70 - 40 * Math.min(1, u * 2)).toFixed(1)}" r="3" style="fill:var(--warn);opacity:${u < 0.5 ? 1 : 0}"/>`; }
      bolhas.forEach((b) => (s += `<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${b.r.toFixed(1)}" style="fill:none;stroke:var(--ink);stroke-width:1"/>`));
      if (tipo === "nacl" && e.cat.m > 0) s += `<ellipse cx="250" cy="116" rx="${Math.min(40, 6 + 30 * e.cat.m).toFixed(1)}" ry="5" style="fill:#d5d9de"/>` + T(250, 108, "Na", "middle", "tx2", 10);
      const tubo = (x, p, pr) => { if (!p.gas) return ""; const h = Math.min(150, (pr.mL || 0) * 0.25); return `<rect x="${x - 12}" y="60" width="24" height="170" style="fill:none;stroke:var(--ink3)"/><rect x="${x - 11}" y="61" width="22" height="${h.toFixed(1)}" style="fill:var(--ink);opacity:.18"/>` + T(x, 54, p.f, "middle", "tx2", 10); };
      s += tubo(206, C.cat, e.cat) + tubo(474, C.an, e.an);
      qs("[data-v=sv]").innerHTML = s;
      const linha = (p) => p.f + ": " + (p.m !== null ? n2(p.m, 3) + " g" : n2(p.mL, 0) + " mL");
      qs("[data-v=lt]").innerHTML = vis("tempo", hms(t)) + vis("carga, Q = i·t", n2(q, 0) + " C") + vis("elétrons", n2(e.ne, 4) + " mol") + vis("no cátodo", linha(e.cat)) + vis("no ânodo", (tipo === "cobre" ? "perde " : "") + linha(e.an));
      qs("[data-v=st]").innerHTML = C.eq + ". " + (tipo === "agua" ? "A fonte arranca elétrons de um lado e empurra para o outro: no cátodo a água é reduzida e sai hidrogênio; no ânodo é oxidada e sai oxigênio. O volume de H₂ é o dobro do de O₂: cada O₂ custa 4 elétrons, cada H₂ só 2. " : tipo === "cobre" ? "Com os dois eletrodos de cobre, o ânodo se dissolve e o cátodo engrossa exatamente o mesmo tanto: a concentração de Cu²⁺ (e o azul) não muda. É o princípio da cobreação. " : "Sal fundido: sem água, os íons Na⁺ e Cl⁻ estão livres. O Na⁺ recebe elétrons no cátodo e vira sódio metálico; o Cl⁻ perde elétrons no ânodo e sai cloro gasoso. ") + "Lei de Faraday: a quantidade de produto é proporcional à carga, 96 485 C por mol de elétrons. Gases a 25 °C e 1 atm (24,47 L/mol). O desenho é esquemático."; };
    liga(el, "t", (v) => { tipo = v; reinicia(); }); qs("[data-c=i]").addEventListener("input", () => { cor = +qs("[data-c=i]").value; }); qs("[data-c=a]").addEventListener("input", () => { acel = +qs("[data-c=a]").value; });
    qs("[data-a=lg]").addEventListener("click", (ev) => { ligado = !ligado; ev.target.setAttribute("aria-pressed", String(ligado)); ev.target.textContent = ligado ? "Fonte ligada" : "Fonte desligada"; }); qs("[data-a=re]").addEventListener("click", reinicia);
    anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqEletrolise._ult = { poe: (tp, i, a) => { tipo = tp; cor = i; acel = a; qs("[data-c=i]").value = i; qs("[data-c=a]").value = a; el.querySelectorAll("[data-t]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.t === tp))); reinicia(); }, liga: (v) => { ligado = !!v; }, avanca: (seg) => { for (let i = 0; i < Math.round(seg * 60); i++) passo(1 / 60); desenha(); }, est }; };

  /* ---------- EQ11 · corrosão e proteção catódica ---------- */
  /* par galvânico com o ferro: corrói o metal de menor E° de redução. Velocidade ilustrativa. */
  SIM.corrosaoPar = (outro, agua, o2, sal) => { const Fe = EL.M.Fe, O = outro ? EL.M[outro] : null; if (!agua || !o2) return { corroi: null, protegido: outro ? "os dois" : "o ferro", taxa: 0, dE: O ? Math.abs(O[3] - Fe[3]) : 0 };
    if (!O) return { corroi: "Fe", protegido: null, taxa: (sal ? 2 : 1), dE: 0 }; const dE = Math.abs(O[3] - Fe[3]), an = O[3] < Fe[3] ? outro : "Fe"; return { corroi: an, protegido: an === "Fe" ? outro : "Fe", taxa: (sal ? 2 : 1) * (1 + dE / 0.4), dE }; };
  /* nome: "Corrosão: quem se sacrifica pelo ferro" · matéria: Química · tema: EQ11 */
  SIM.eqCorrosao = (el, F) => { const W = 680, H = 300, OUT = ["", "Zn", "Mg", "Sn", "Cu"]; let outro = "", agua = true, o2 = true, sal = false, dFe = 0, dOu = 0, t = 0, fase = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">metal encostado no ferro</p><div class="bts">${botoes(OUT.map((k) => [k, k ? k : "nenhum"]), "m", outro)}</div></div>
      <div><div class="bts"><button class="bt" data-a="ag" aria-pressed="true">Com água</button><button class="bt" data-a="ox" aria-pressed="true">Com oxigênio</button><button class="bt" data-a="sl" aria-pressed="false">Sal na água</button><button class="bt pri" data-a="re">Peças novas</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const qs = (s) => el.querySelector(s), efet = () => (dOu >= 1 ? "" : outro), est = () => ({ outro, acabou: dOu >= 1, agua, o2, sal, dFe, dOu, t, ...SIM.corrosaoPar(efet(), agua, o2, sal) });
    const reinicia = () => { dFe = 0; dOu = 0; t = 0; };
    const passo = (dt) => { fase += dt; t += dt; const p = SIM.corrosaoPar(efet(), agua, o2, sal); if (p.corroi === "Fe") dFe = Math.min(1, dFe + 0.012 * p.taxa * dt); else if (p.corroi) dOu = Math.min(1, dOu + 0.012 * p.taxa * dt); };
    const desenha = () => { const e = est(), O = outro ? EL.M[outro] : null;
      let s = (agua ? `<rect x="40" y="110" width="600" height="160" style="fill:#6fa8dc;opacity:${sal ? 0.34 : 0.22}"/>` + T(630, 126, sal ? "água com sal" : "água", "end", "tx2", 11) : T(630, 126, "ar seco", "end", "tx2", 11)) + `<path d="M40,60 v210 h600 v-210" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
      const hf = 110 * (1 - 0.55 * dFe); s += `<rect x="200" y="${250 - hf}" width="200" height="${hf}" style="fill:#8f9aa6;stroke:var(--ink2)"/>` + T(300, 250 - hf / 2 + 4, "Fe", "middle", "tx", 14);
      if (dFe > 0.01) s += `<rect x="200" y="${250 - hf - 5}" width="200" height="${(4 + 16 * dFe).toFixed(1)}" style="fill:#9a4a2a;opacity:.9"/>` + T(300, 250 - hf - 12, "ferrugem", "middle", "tx2", 10);
      if (O) { const ho = 90 * (1 - 0.8 * dOu); s += `<rect x="400" y="${250 - ho}" width="90" height="${ho}" style="fill:${O[5]};stroke:var(--ink2)"/>` + T(445, 250 - ho / 2 + 4, outro, "middle", "tx", 14); }
      if (e.corroi) { const fe = e.corroi === "Fe", x0 = fe ? 240 : 445; for (let k = 0; k < 4; k++) { const u = (fase * 0.6 + k / 4) % 1; s += `<circle cx="${x0 + (k - 1.5) * 16}" cy="${(250 - (fe ? hf : 90 * (1 - 0.8 * dOu)) - 8 - 40 * u).toFixed(1)}" r="3" style="fill:${fe ? "#9a4a2a" : O[5]};opacity:${(1 - u).toFixed(2)}"/>`; }
        if (O && !e.acabou) for (let k = 0; k < 3; k++) { const u = (fase * 0.8 + k / 3) % 1, de = fe ? 300 : 445, pa = fe ? 445 : 300; s += `<circle cx="${(de + (pa - de) * u).toFixed(1)}" cy="240" r="3" style="fill:var(--warn)"/>`; }
        if (O && !e.acabou) s += T(372, 232, "e⁻", "middle", "tx2", 10); }
      if (o2 && agua) for (let k = 0; k < 5; k++) s += T(80 + 110 * k, 150 + 20 * Math.sin(fase + k), "O₂", "middle", "tx2", 10);
      qs("[data-v=sv]").innerHTML = s;
      qs("[data-v=lt]").innerHTML = vis("E° de redução: Fe²⁺/Fe", n2(EL.M.Fe[3], 2) + " V") + vis(O ? `E° de redução: ${O[1]}/${outro}` : "segundo metal", O ? n2(O[3], 2) + " V" : "—") + vis("quem corrói", e.corroi || "ninguém") + vis("quem fica protegido", e.protegido || "ninguém") + vis("ferro já corroído", n2(100 * dFe, 0) + " %");
      qs("[data-v=st]").innerHTML = (e.acabou && agua && o2 ? `O ${outro} acabou: sem o ânodo de sacrifício, o ferro volta a enferrujar. É por isso que os blocos precisam ser trocados. ` : !agua || !o2 ? "Sem água ou sem oxigênio, não há ferrugem: a corrosão do ferro precisa dos dois. É por isso que tinta, óleo e graxa protegem: isolam o metal. " : !O ? "Ferro, água e oxigênio: o ferro se oxida (Fe → Fe²⁺ + 2 e⁻), o oxigênio recebe os elétrons, e o produto final é a ferrugem. " : e.corroi === "Fe" ? `O ${outro} tem E° de redução maior que o do ferro: no par, quem perde elétrons é o ferro. Encostar ${outro} no ferro <b>piora</b> a corrosão; o ${outro} fica intacto. ` : `O ${outro} tem E° de redução menor que o do ferro: ele se oxida no lugar do ferro e manda elétrons para ele. Enquanto houver ${outro}, o ferro não enferruja. É o <b>ânodo de sacrifício</b>, usado para proteger estruturas de aço; a galvanização (ferro coberto de zinco) usa a mesma ideia. `) + (sal && agua && o2 ? "O sal deixa a água mais condutora e acelera tudo. " : "") + "Quem corrói: decidido pelos potenciais padrão (tabela do OpenStax). A velocidade do desenho é só ilustrativa."; };
    liga(el, "m", (v) => { outro = v; reinicia(); }); [["ag", () => (agua = !agua), () => agua, ["Com água", "Sem água"]], ["ox", () => (o2 = !o2), () => o2, ["Com oxigênio", "Sem oxigênio"]], ["sl", () => (sal = !sal), () => sal, ["Sal na água", "Sal na água"]]].forEach(([k, f, g, r]) => qs(`[data-a=${k}]`).addEventListener("click", (ev) => { f(); ev.target.setAttribute("aria-pressed", String(g())); ev.target.textContent = g() ? r[0] : r[1]; }));
    qs("[data-a=re]").addEventListener("click", reinicia);
    anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqCorrosao._ult = { poe: (m, a, o, s) => { outro = m; agua = a; o2 = o; sal = s; el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.m === m))); reinicia(); }, avanca: (seg) => { for (let i = 0; i < Math.round(seg * 60); i++) passo(1 / 60); desenha(); }, est }; };
})();
