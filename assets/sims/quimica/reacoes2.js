/* Simulações da Química, módulo D, parte 2 (usa o núcleo de reacoes.js: SIM.atomos, SIM.balanceia, SIM.confere, SIM.mm).
   D05 SIM.balanceador: balanceador visual. O usuário mexe nos coeficientes com − e +; para cada elemento, a contagem de átomos dos dois lados
     aparece lado a lado (barras e números) e fica verde quando iguala. Diz se está balanceada e se os coeficientes são os menores inteiros.
     O gabarito NÃO está digitado: é calculado por SIM.balanceia (espaço nulo da matriz de átomos), conferido em tests/tnucleo.js.
   D06 SIM.limitante: dois reagentes, quantidades em mol; avanço máximo = menor razão (mol disponível ÷ coeficiente). Mostra o limitante, o produto e o excesso.
     Conferido em Python: N₂ + 3 H₂ → 2 NH₃ com 2 mol de N₂ e 3 mol de H₂: razões 2 e 1: limitante H₂; 2 mol de NH₃; sobra 1 mol de N₂.
   D07 SIM.qRedox: o mesmo balanceador, com mais duas linhas: elétrons cedidos × recebidos (quem oxida e quem reduz vêm marcados, com a variação do nox)
     e, nas equações iônicas, a carga total de cada lado. Em cada equação, elétrons por unidade conferidos em tests/tnucleo.js:
     com os coeficientes do gabarito, cedidos = recebidos. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : String(+(+v).toFixed(d)).replace(".", ",").replace("-", "−"));
  const sf = (s) => SIM.subFormula(s);

  SIM.EQS = [["H2", "O2", ">", "H2O"], ["N2", "H2", ">", "NH3"], ["Mg", "O2", ">", "MgO"], ["Al", "O2", ">", "Al2O3"], ["Fe", "O2", ">", "Fe2O3"], ["CH4", "O2", ">", "CO2", "H2O"], ["C3H8", "O2", ">", "CO2", "H2O"], ["C2H6O", "O2", ">", "CO2", "H2O"], ["C2H6", "O2", ">", "CO2", "H2O"], ["KClO3", ">", "KCl", "O2"], ["H2O2", ">", "H2O", "O2"], ["Na", "H2O", ">", "NaOH", "H2"], ["Al", "HCl", ">", "AlCl3", "H2"], ["H2SO4", "NaOH", ">", "Na2SO4", "H2O"], ["H3PO4", "Ca(OH)2", ">", "Ca3(PO4)2", "H2O"], ["Fe2O3", "CO", ">", "Fe", "CO2"], ["NH3", "O2", ">", "NO", "H2O"], ["FeS2", "O2", ">", "Fe2O3", "SO2"], ["C8H18", "O2", ">", "CO2", "H2O"]]
    .map((l) => { const i = l.indexOf(">"); return { r: l.slice(0, i), p: l.slice(i + 1) }; });
  /* ox / red: [índice da espécie na lista reagentes+produtos, elétrons por unidade dessa espécie, descrição] */
  SIM.REDOX = [
    { r: ["Zn", "Cu^2+"], p: ["Zn^2+", "Cu"], ox: [0, 2, "Zn: 0 → +2"], red: [1, 2, "Cu: +2 → 0"] },
    { r: ["Cu", "Ag^+"], p: ["Cu^2+", "Ag"], ox: [0, 2, "Cu: 0 → +2"], red: [1, 1, "Ag: +1 → 0"] },
    { r: ["Al", "H^+"], p: ["Al^3+", "H2"], ox: [0, 3, "Al: 0 → +3"], red: [1, 1, "H: +1 → 0"] },
    { r: ["Fe2O3", "CO"], p: ["Fe", "CO2"], ox: [1, 2, "C: +2 → +4"], red: [0, 6, "Fe: +3 → 0 (2 átomos)"] },
    { r: ["NH3", "O2"], p: ["NO", "H2O"], ox: [0, 5, "N: −3 → +2"], red: [1, 4, "O: 0 → −2 (2 átomos)"] },
    { r: ["MnO2", "HCl"], p: ["MnCl2", "Cl2", "H2O"], ox: [3, 2, "Cl: −1 → 0 (2 átomos por Cl₂)"], red: [0, 2, "Mn: +4 → +2"] },
    { r: ["MnO4^-", "Fe^2+", "H^+"], p: ["Mn^2+", "Fe^3+", "H2O"], ox: [1, 1, "Fe: +2 → +3"], red: [0, 5, "Mn: +7 → +2"] },
    { r: ["Cr2O7^2-", "Fe^2+", "H^+"], p: ["Cr^3+", "Fe^3+", "H2O"], ox: [1, 1, "Fe: +2 → +3"], red: [0, 6, "Cr: +6 → +3 (2 átomos)"] },
    { r: ["Cu", "HNO3"], p: ["Cu(NO3)2", "NO", "H2O"], ox: [0, 2, "Cu: 0 → +2"], red: [3, 3, "N: +5 → +2 (só o N que vira NO)"] },
    { r: ["KMnO4", "HCl"], p: ["KCl", "MnCl2", "Cl2", "H2O"], ox: [4, 2, "Cl: −1 → 0 (2 átomos por Cl₂)"], red: [0, 5, "Mn: +7 → +2"] },
    { r: ["MnO4^-", "C2O4^2-", "H^+"], p: ["Mn^2+", "CO2", "H2O"], ox: [1, 2, "C: +3 → +4 (2 átomos)"], red: [0, 5, "Mn: +7 → +2"] },
    { r: ["Cl2", "OH^-"], p: ["Cl^-", "ClO3^-", "H2O"], ox: [3, 5, "Cl: 0 → +5"], red: [2, 1, "Cl: 0 → −1"] },
  ];
  const balanco = (el, F, lista, redox) => {
    let k = 0, coef = [], cliques = 0, viu = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco" style="padding:14px 12px"><div data-v="eq" style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px 4px;min-height:74px"></div><div data-v="tb" style="max-width:600px;margin:10px auto 0"></div></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><label class="tx2">equação <select data-v="sel" style="padding:5px 8px;border-radius:8px;border:1px solid var(--line2);background:var(--bg2);color:var(--ink);font:14px var(--f-text);max-width:420px">${lista.map((e, i) => `<option value="${i}">${i + 1}. ${e.r.map(sf).join(" + ")} → ${e.p.map(sf).join(" + ")}</option>`).join("")}</select></label></div><div class="bts"><button class="bt peq" data-b="zera">recomeçar</button><button class="bt peq" data-b="resp">mostrar resposta</button></div></div>
      <div class="status">${redox ? "Em oxirredução, comece pelos <b>elétrons</b>: ajuste os coeficientes de quem oxida e de quem reduz até os elétrons cedidos e recebidos ficarem iguais (primeira linha). Depois acerte os outros átomos, deixando hidrogênio e oxigênio por último; nas equações com íons, a <b>carga</b> total também tem de bater." : "Mexa nos coeficientes com − e +. Os índices das fórmulas não mudam nunca: mudar um índice é trocar de substância."} Cada linha compara o número de átomos de um elemento à esquerda e à direita da seta: verde quando iguala. A equação está balanceada quando todas as linhas estão verdes; o gabarito pede os <b>menores números inteiros</b>.</div>`);
    const q = (s) => el.querySelector(s), esp = () => lista[k].r.concat(lista[k].p);
    const estado = () => { const e = lista[k], tot = SIM.confere(e.r, e.p, coef), linhas = Object.keys(tot).map((a) => [a === "±" ? "carga" : a, tot[a][0], tot[a][1]]); let ele = null; if (redox) ele = [coef[e.ox[0]] * e.ox[1], coef[e.red[0]] * e.red[1]]; const ok = linhas.every((l) => l[1] === l[2]) && (!ele || ele[0] === ele[1]), g = coef.reduce((a, b) => SIM.mdc(a, b), 0); return { linhas, ele, ok, minimo: g === 1 }; };
    SIM[redox ? "qRedox" : "balanceador"]._estado = () => Object.assign({ k, coef: coef.slice(), gab: SIM.balanceia(lista[k].r, lista[k].p) }, estado());
    SIM[redox ? "qRedox" : "balanceador"]._poe = (i, c) => { k = i; coef = c.slice(); desenha(); };
    const desenha = () => { const e = lista[k], st = estado(), max = Math.max(1, ...st.linhas.map((l) => Math.max(Math.abs(l[1]), Math.abs(l[2]))), ...(st.ele || [0]));
      q("[data-v=eq]").innerHTML = esp().map((f, j) => (j === e.r.length ? `<span style="font-size:24px;margin:0 8px">→</span>` : j ? `<span style="font-size:20px;margin:0 2px">+</span>` : "") + `<span style="display:inline-flex;flex-direction:column;align-items:center;gap:2px"><span style="display:inline-flex;align-items:center;gap:3px"><button class="bt peq" data-m="${j}" aria-label="diminuir o coeficiente de ${sf(f)}" style="padding:1px 7px">−</button><b style="font-size:22px;min-width:22px;text-align:center;color:var(--warn)">${coef[j]}</b><button class="bt peq" data-s="${j}" aria-label="aumentar o coeficiente de ${sf(f)}" style="padding:1px 7px">+</button></span><span style="font:700 20px var(--f-text)">${sf(f)}</span>${redox && (j === e.ox[0] || j === e.red[0]) ? `<small style="color:${j === e.ox[0] ? "var(--mA)" : "var(--bad)"};font-size:11px">${j === e.ox[0] ? "oxida" : "reduz"} · ${(j === e.ox[0] ? e.ox : e.red)[2]}</small>` : ""}</span>`).join("");
      const lin = (rot, a, b, un) => { const igual = a === b, cor = igual ? "var(--ok)" : "var(--bad)", w = (v) => Math.round((Math.abs(v) / max) * 100); return `<div style="display:grid;grid-template-columns:1fr 50px 110px 50px 1fr;align-items:center;gap:6px;margin:3px 0;font:14px var(--f-text)"><div style="display:flex;justify-content:flex-end"><div style="height:12px;width:${w(a)}%;background:color-mix(in srgb,${cor} 55%,transparent);border-radius:4px 0 0 4px"></div></div><b style="text-align:right">${String(a).replace("-", "−")}</b><span style="text-align:center;color:${cor};font-weight:700">${rot} ${igual ? "✓" : "≠"}</span><b>${String(b).replace("-", "−")}</b><div><div style="height:12px;width:${w(b)}%;background:color-mix(in srgb,${cor} 55%,transparent);border-radius:0 4px 4px 0"></div></div></div>`; };
      q("[data-v=tb]").innerHTML = `<div style="display:grid;grid-template-columns:1fr 110px 1fr;font-size:12px;color:var(--ink2);text-align:center"><span>reagentes</span><span></span><span>produtos</span></div>` + (st.ele ? lin("elétrons", st.ele[0], st.ele[1]) : "") + st.linhas.map((l) => lin(l[0], l[1], l[2])).join("") + (st.ele ? `<div style="font-size:12px;color:var(--ink2);text-align:center">elétrons: cedidos (esquerda) × recebidos (direita)</div>` : "");
      q("[data-v=lt]").innerHTML = vis("situação", st.ok ? (st.minimo ? "balanceada ✓" : "balanceada, mas dá para simplificar") : "ainda não") + vis("linhas iguais", st.linhas.filter((l) => l[1] === l[2]).length + (st.ele && st.ele[0] === st.ele[1] ? 1 : 0) + " de " + (st.linhas.length + (st.ele ? 1 : 0))) + vis("cliques", cliques) + vis("resposta", viu ? "vista" : "não vista");
      el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { const j = +b.dataset.m; if (coef[j] > 1) { coef[j]--; cliques++; desenha(); } }));
      el.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => { const j = +b.dataset.s; if (coef[j] < 30) { coef[j]++; cliques++; desenha(); } })); };
    const nova = (i) => { k = i; coef = esp().map(() => 1); cliques = 0; viu = false; desenha(); };
    q("[data-v=sel]").addEventListener("change", (ev) => nova(+ev.target.value));
    q("[data-b=zera]").addEventListener("click", () => nova(k));
    q("[data-b=resp]").addEventListener("click", () => { const g = SIM.balanceia(lista[k].r, lista[k].p); if (g) { coef = g; viu = true; desenha(); } });
    nova(0);
  };
  SIM.balanceador = (el, F) => balanco(el, F, SIM.EQS, false);
  SIM.qRedox = (el, F) => balanco(el, F, SIM.REDOX, true);

  /* ---------- D06 · reagente limitante ---------- */
  SIM.LIM = [{ r: ["H2", "O2"], p: ["H2O"] }, { r: ["N2", "H2"], p: ["NH3"] }, { r: ["Mg", "HCl"], p: ["MgCl2", "H2"] }, { r: ["Al", "O2"], p: ["Al2O3"] }, { r: ["CH4", "O2"], p: ["CO2", "H2O"] }, { r: ["Fe2O3", "CO"], p: ["Fe", "CO2"] }];
  SIM.limitante = (el, F) => {
    const W = 680, H = 230; let k = 0, a = 4, b = 3;
    /* devolve tudo em mol: avanço x, limitante (0, 1 ou −1 se proporção exata), produtos, sobras */
    SIM.limitante._conta = (k, a, b) => { const e = SIM.LIM[k], c = SIM.balanceia(e.r, e.p), ra = a / c[0], rb = b / c[1], x = Math.min(ra, rb); return { c, x, ra, rb, lim: Math.abs(ra - rb) < 1e-12 ? -1 : ra < rb ? 0 : 1, prod: e.p.map((_, j) => x * c[2 + j]), sobraA: a - x * c[0], sobraB: b - x * c[1] }; };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("1º reagente (mol)", "a", 0, 12, 0.5, a)}${sl("2º reagente (mol)", "b", 0, 12, 0.5, b)}<div class="bts">${SIM.LIM.map((e, i) => `<button class="bt peq" data-k="${i}" aria-pressed="${i === 0}">${e.p.map(sf).join(" + ")}</button>`).join("")}</div></div>
      <div class="status">Uma receita pede os reagentes numa proporção fixa em mol (os coeficientes). Quem decide quanto produto sai não é quem tem menos massa nem menos mols: é quem tem a <b>menor razão</b> (mols disponíveis ÷ coeficiente). Esse é o <b>reagente limitante</b>; o outro sobra (excesso). Mexa nos dois e ache o ponto em que nada sobra: é a proporção estequiométrica.</div>`);
    const q = (s) => el.querySelector(s);
    const desenha = () => { const e = SIM.LIM[k], r = SIM.limitante._conta(k, a, b), ym = 12, esc = 150 / ym, y0 = 185, bar = (x, v, cor, rot, trac) => `<rect x="${x}" y="${y0 - v * esc}" width="50" height="${v * esc}" style="fill:${trac ? "none" : `color-mix(in srgb,${cor} 45%,transparent)`};stroke:${cor};stroke-width:1.6${trac ? ";stroke-dasharray:4 3" : ""}"/>` + D.txt(x + 25, y0 + 16, rot, "tx2") + D.txt(x + 25, y0 - v * esc - 5, n2(v) + " mol", "tx2", "middle", 'style="font-size:11px"');
      let sv = D.txt(340, 20, SIM.eqTxt(e.r.map((f, j) => (r.c[j] > 1 ? r.c[j] : "") + f).join(" + ") + " -> " + e.p.map((f, j) => (r.c[2 + j] > 1 ? r.c[2 + j] : "") + f).join(" + ")), "tx", "middle", 'style="font-size:17px;font-weight:700"');
      sv += bar(70, a, "var(--mA)", sf(e.r[0])) + bar(135, b, "var(--bad)", sf(e.r[1])) + D.seta(215, 120, 265, 120, "var(--ink2)") + e.p.map((f, j) => bar(295 + j * 65, r.prod[j], "var(--ok)", sf(f))).join("") + bar(295 + e.p.length * 65 + 30, r.sobraA, "var(--mA)", "sobra", r.sobraA < 1e-9) + bar(295 + e.p.length * 65 + 95, r.sobraB, "var(--bad)", "sobra", r.sobraB < 1e-9) + D.txt(110, 40, "antes", "tx2") + D.txt(430, 40, "depois", "tx2");
      q("[data-v=sv]").innerHTML = sv; q("[data-o=a]").textContent = n2(a) + " mol de " + sf(e.r[0]); q("[data-o=b]").textContent = n2(b) + " mol de " + sf(e.r[1]);
      q("[data-v=lt]").innerHTML = vis("razão do 1º (mol ÷ " + r.c[0] + ")", n2(r.ra)) + vis("razão do 2º (mol ÷ " + r.c[1] + ")", n2(r.rb)) + vis("limitante", r.lim === -1 ? "nenhum: proporção exata" : sf(e.r[r.lim])) + vis("produto (" + sf(e.p[0]) + ")", n2(r.prod[0]) + " mol = " + n2(r.prod[0] * SIM.mm(e.p[0]), 1) + " g") + vis("excesso", r.lim === -1 ? "0" : n2(r.lim === 0 ? r.sobraB : r.sobraA) + " mol de " + sf(e.r[r.lim === 0 ? 1 : 0])); };
    el.querySelectorAll("input[data-c]").forEach((i) => i.addEventListener("input", () => { if (i.dataset.c === "a") a = +i.value; else b = +i.value; desenha(); }));
    el.querySelectorAll("[data-k]").forEach((bt) => bt.addEventListener("click", () => { k = +bt.dataset.k; el.querySelectorAll("[data-k]").forEach((x) => x.setAttribute("aria-pressed", x === bt)); desenha(); }));
    desenha();
  };
})();
