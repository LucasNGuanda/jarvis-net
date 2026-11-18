/* Simulações da Química, módulo G (Eletroquímica): G01 a G04.
   DADOS (tools/quimica/dadosG.json, com fonte, endereço e trecho de cada valor; conferência: tools/quimica/confere-eletro.py):
   SIM.ELETRO.M: semicélulas metal/íon: [símbolo, íon em texto, carga n, E° de redução (V, 25 °C), massa molar (g/mol), cor do desenho].
     E°: apêndice L do OpenStax Chemistry 2e, arredondado a duas casas (como nas tabelas de prova): Mg −2,37; Al −1,66; Zn −0,76; Cr −0,74; Ni −0,26; Sn −0,14; Pb −0,13;
       Cu +0,34; Ag +0,80; Au +1,50. Fe: −0,44 (data page da Wikipedia e texto do cap. 17.6 do OpenStax; o apêndice L dá −0,447). Divergências entre as fontes, todas menores
       que 0,03 V nestes metais: Sn −0,13 (Wikipedia); Au +1,52 (Wikipedia). O dicromato (1,33 na Wikipedia e 1,232 no OpenStax) fica FORA da tabela dos temas por isso.
     Massas molares: as arredondadas de prova já usadas no site (SIM.MA), mais Ni 58,7, Sn 119 e Au 197 (IUPAC: 58,693; 118,71; 196,97). F = 96485 C/mol; fator de Nernst 0,0592 V.
   SIM.ELETRO.T: tabela de potenciais padrão de redução mostrada nos temas (mesmas fontes, duas casas).
   CONTAS:
   pilha: cátodo = semicélula de MAIOR E° de redução; E°(pilha) = E°(cátodo) − E°(ânodo). Elétrons trocados: n = mmc(n₁, n₂).
   Nernst: E = E° − (RT/nF)·ln Q, com Q = [íon do ânodo]^(n/nₐ) / [íon do cátodo]^(n/n_c); R = 8,314 J/(mol·K); F = 96485 C/mol; a 25 °C, (RT/F)·ln 10 = 0,05916 V.
   Faraday: m = (i·t/F)·(M/n). Corrosão: par galvânico: corrói (é ânodo) o metal de MENOR E° de redução; o outro fica protegido. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const nf = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sg = (v, d = 2) => (v > 0 ? "+" : "") + nf(v, d);
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const f1 = (x) => x.toFixed(1);
  const mdc = (a, b) => (b ? mdc(b, a % b) : a), mmc = (a, b) => (a * b) / mdc(a, b);

  const FAR = 96485, RG = 8.314;
  const EL = (SIM.ELETRO = {
    F: FAR,
    M: { Mg: ["Mg", "Mg²⁺", 2, -2.37, 24, "#b9c2cc"], Al: ["Al", "Al³⁺", 3, -1.66, 27, "#c7ccd2"], Zn: ["Zn", "Zn²⁺", 2, -0.76, 65, "#9fb0c4"], Cr: ["Cr", "Cr³⁺", 3, -0.74, 52, "#a9b8c9"], Fe: ["Fe", "Fe²⁺", 2, -0.44, 56, "#8f9aa6"], Ni: ["Ni", "Ni²⁺", 2, -0.26, 58.7, "#a8b89a"], Sn: ["Sn", "Sn²⁺", 2, -0.14, 119, "#c2c2b8"], Pb: ["Pb", "Pb²⁺", 2, -0.13, 207, "#7f8794"], Cu: ["Cu", "Cu²⁺", 2, 0.34, 63.5, "#c9853d"], Ag: ["Ag", "Ag⁺", 1, 0.8, 108, "#d5d9de"], Au: ["Au", "Au³⁺", 3, 1.5, 197, "#d9b441"] },
    /* tabela para os temas: [semirreação de redução em \\ce, texto simples, E° (V)], em ordem crescente de E° */
    T: [["Li+ + e- -> Li", "Li⁺ + e⁻ → Li", -3.04], ["K+ + e- -> K", "K⁺ + e⁻ → K", -2.93], ["Ca^2+ + 2 e- -> Ca", "Ca²⁺ + 2 e⁻ → Ca", -2.87], ["Na+ + e- -> Na", "Na⁺ + e⁻ → Na", -2.71], ["Mg^2+ + 2 e- -> Mg", "Mg²⁺ + 2 e⁻ → Mg", -2.37], ["Al^3+ + 3 e- -> Al", "Al³⁺ + 3 e⁻ → Al", -1.66], ["2 H2O + 2 e- -> H2 + 2 OH-", "2 H₂O + 2 e⁻ → H₂ + 2 OH⁻", -0.83], ["Zn^2+ + 2 e- -> Zn", "Zn²⁺ + 2 e⁻ → Zn", -0.76], ["Cr^3+ + 3 e- -> Cr", "Cr³⁺ + 3 e⁻ → Cr", -0.74], ["Fe^2+ + 2 e- -> Fe", "Fe²⁺ + 2 e⁻ → Fe", -0.44], ["Ni^2+ + 2 e- -> Ni", "Ni²⁺ + 2 e⁻ → Ni", -0.26], ["Sn^2+ + 2 e- -> Sn", "Sn²⁺ + 2 e⁻ → Sn", -0.14], ["Pb^2+ + 2 e- -> Pb", "Pb²⁺ + 2 e⁻ → Pb", -0.13], ["2 H+ + 2 e- -> H2", "2 H⁺ + 2 e⁻ → H₂", 0], ["Cu^2+ + 2 e- -> Cu", "Cu²⁺ + 2 e⁻ → Cu", 0.34], ["O2 + 2 H2O + 4 e- -> 4 OH-", "O₂ + 2 H₂O + 4 e⁻ → 4 OH⁻", 0.4], ["I2 + 2 e- -> 2 I-", "I₂ + 2 e⁻ → 2 I⁻", 0.54], ["Fe^3+ + e- -> Fe^2+", "Fe³⁺ + e⁻ → Fe²⁺", 0.77], ["Ag+ + e- -> Ag", "Ag⁺ + e⁻ → Ag", 0.8], ["Br2 + 2 e- -> 2 Br-", "Br₂ + 2 e⁻ → 2 Br⁻", 1.09], ["O2 + 4 H+ + 4 e- -> 2 H2O", "O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O", 1.23], ["Cl2 + 2 e- -> 2 Cl-", "Cl₂ + 2 e⁻ → 2 Cl⁻", 1.36], ["Au^3+ + 3 e- -> Au", "Au³⁺ + 3 e⁻ → Au", 1.5], ["MnO4- + 8 H+ + 5 e- -> Mn^2+ + 4 H2O", "MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O", 1.51], ["F2 + 2 e- -> 2 F-", "F₂ + 2 e⁻ → 2 F⁻", 2.87]],
    /* pilha entre duas semicélulas a e b (chaves de M) */
    pilha: (a, b) => { const A = EL.M[a], B = EL.M[b], cat = A[3] >= B[3] ? a : b, an = cat === a ? b : a, n = mmc(EL.M[cat][2], EL.M[an][2]); return { cat, an, n, E0: EL.M[cat][3] - EL.M[an][3] }; },
    /* Nernst: ca = concentração do íon do ânodo, cc = do íon do cátodo, T em kelvin */
    nernst: (a, b, ca, cc, T = 298.15) => { const p = EL.pilha(a, b), Q = Math.pow(ca, p.n / EL.M[p.an][2]) / Math.pow(cc, p.n / EL.M[p.cat][2]); return { ...p, Q, E: p.E0 - ((RG * T) / (p.n * FAR)) * Math.log(Q), lnK: (p.n * FAR * p.E0) / (RG * T) }; },
    /* Faraday: massa (g) depositada do metal k por corrente i (A) em t (s) */
    faraday: (k, i, t) => { const m = EL.M[k], q = i * t, ne = q / FAR; return { q, ne, n: ne / m[2], m: (ne / m[2]) * m[4] }; },
  });

  /* ---------- G01 · pilha ---------- */
  /* nome: "Pilha: escolha os dois metais e veja para onde vão os elétrons" · matéria: Química · tema: G01 */
  SIM.qPilha = (el, F) => {
    const W = 700, H = 270, LISTA = ["Mg", "Al", "Zn", "Fe", "Ni", "Pb", "Cu", "Ag"]; let a = "Zn", b = "Cu", tt = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 6px;font-size:13.5px;color:var(--ink2)">Eletrodo da esquerda</p><div class="bts">${botoes(LISTA.map((x) => [x, x]), "a", a)}</div></div><div><p style="margin:0 0 6px;font-size:13.5px;color:var(--ink2)">Eletrodo da direita</p><div class="bts">${botoes(LISTA.map((x) => [x, x]), "b", b)}</div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "a", (v) => (a = v)); liga(el, "b", (v) => (b = v));
    const est = () => ({ a, b, igual: a === b, ...EL.pilha(a, b) });
    SIM.qPilha._ult = { poe: (x, y) => { a = x; b = y; el.querySelectorAll("[data-a]").forEach((e) => e.setAttribute("aria-pressed", e.dataset.a === a)); el.querySelectorAll("[data-b]").forEach((e) => e.setAttribute("aria-pressed", e.dataset.b === b)); }, est };
    anima(el, F, (dt) => { tt += dt; const e = est(), A = EL.M[a], B = EL.M[b], esqAn = e.an === a && !e.igual, dir = e.igual ? 0 : esqAn ? 1 : -1;
      const bq = (x, m, an) => `<rect x="${x}" y="110" width="150" height="120" rx="6" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="${x + 2}" y="140" width="146" height="88" rx="4" style="fill:${m[5]};opacity:.22"/><rect x="${x + 62}" y="80" width="${an ? 22 : 30}" height="130" rx="3" style="fill:${m[5]};stroke:var(--ink2);stroke-width:1.2"/>` + D.txt(x + 75, 250, `${m[0]} | ${m[1]} 1 mol/L`, "tx2") + D.txt(x + 75, 72, e.igual ? "" : an ? "ânodo (−): oxida" : "cátodo (+): reduz", "tx2", "middle", `style="fill:${an ? "var(--bad, #e5484d)" : "var(--ok)"};font-weight:700"`);
      let h = bq(110, A, esqAn) + bq(440, B, !esqAn && !e.igual);
      /* fio, voltímetro e ponte salina */
      h += `<path d="M185 80V40H515V80" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="312" y="24" width="76" height="32" rx="8" style="fill:var(--bg);stroke:var(--ink2);stroke-width:2"/>` + D.txt(350, 45, nf(e.E0, 2) + " V", "tx2", "middle", 'style="font-weight:700"');
      h += `<path d="M240 150V124H460V150" style="fill:none;stroke:var(--ink3);stroke-width:12;stroke-linejoin:round;opacity:.6"/>` + D.txt(350, 112, "ponte salina", "tx2");
      if (dir) { for (let k = 0; k < 5; k++) { const u = ((tt * 0.35 + k / 5) % 1), s = dir > 0 ? u : 1 - u, x = 185 + s * 330; if (x < 306 || x > 394) h += `<circle cx="${f1(x)}" cy="40" r="4" style="fill:var(--warn)"/>`; } h += D.seta(dir > 0 ? 230 : 470, 26, dir > 0 ? 290 : 410, 26, "var(--warn)", 2) + D.txt(dir > 0 ? 260 : 440, 18, "e⁻", "tx2", "middle", 'style="fill:var(--warn)"');
        h += D.seta(dir > 0 ? 400 : 300, 124, dir > 0 ? 300 : 400, 124, "var(--mod)", 1.6) + D.txt(350, 142, "ânions →  ânodo", "tx2"); }
      q("[data-v=sv]").innerHTML = h;
      const C = EL.M[e.cat], N = EL.M[e.an];
      q("[data-v=lt]").innerHTML = vis(`E° ${A[1]}/${A[0]}`, sg(A[3]) + " V") + vis(`E° ${B[1]}/${B[0]}`, sg(B[3]) + " V") + vis("E° da pilha", nf(e.E0, 2) + " V") + vis("elétrons trocados", e.igual ? "—" : String(e.n)) + vis("notação", e.igual ? "—" : `${N[0]} | ${N[1]} || ${C[1]} | ${C[0]}`);
      q("[data-v=st]").innerHTML = e.igual ? "Dois eletrodos iguais, com a mesma concentração: nenhum tem mais tendência a reduzir que o outro, e a pilha dá 0 V. Troque um deles." : `O ${C[0]} tem o <b>maior</b> potencial de redução (${sg(C[3])} V): o íon ${C[1]} ganha elétrons e o eletrodo de ${C[0]} é o <b>cátodo</b> (polo +), que engrossa. O ${N[0]} (${sg(N[3])} V) é obrigado a <b>oxidar</b>: é o <b>ânodo</b> (polo −), que se desgasta. Os elétrons vão pelo fio do ânodo para o cátodo. E° = E°(cátodo) − E°(ânodo) = ${sg(C[3])} − (${sg(N[3])}) = ${nf(e.E0, 2)} V. A ponte salina fecha o circuito: ânions para o ânodo, cátions para o cátodo. Potenciais de tabela, a 25 °C e 1 mol/L.`; });
  };

  /* ---------- G02 · Nernst ---------- */
  /* nome: "Nernst: mude as concentrações e veja a tensão responder" · matéria: Química · tema: G02 */
  SIM.qNernst = (el, F) => {
    const W = 700, H = 250, PARES = [["Zn", "Cu"], ["Zn", "Ag"], ["Fe", "Cu"], ["Cu", "Ag"], ["Cu", "Cu"]]; let par = 0, la = 0, lc = 0, T = 298.15;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(PARES.map((p, i) => [i, p[0] === p[1] ? "pilha de concentração (Cu | Cu)" : `${p[0]} | ${p[1]}`]), "p", par)}</div><div class="bts" style="margin-top:8px"><button class="bt peq" data-a="padrao">voltar ao padrão (1 mol/L)</button></div></div>
        <div>${sl("Íon do ânodo (mol/L)", "la", -6, 0.3, 0.1, la)}${sl("Íon do cátodo (mol/L)", "lc", -6, 0.3, 0.1, lc)}</div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), sci = SIM.sci10 || ((v) => v.toExponential(1));
    liga(el, "p", (v) => (par = +v)); q("[data-c=la]").addEventListener("input", (e) => (la = +e.target.value)); q("[data-c=lc]").addEventListener("input", (e) => (lc = +e.target.value));
    q("[data-a=padrao]").addEventListener("click", () => { la = lc = 0; q("[data-c=la]").value = 0; q("[data-c=lc]").value = 0; });
    /* na pilha de concentração as duas semicélulas são iguais: o lado diluído é o ânodo (trato a = ânodo, c = cátodo, como nos rótulos) */
    const est = () => { const [a, b] = PARES[par], conc = a === b, ca = Math.pow(10, la), cc = Math.pow(10, lc); if (conc) { const n = EL.M[a][2], Q = ca / cc; return { conc, an: a, cat: a, n, E0: 0, Q, E: -((RG * T) / (n * FAR)) * Math.log(Q), lnK: 0, ca, cc }; } return { conc, ...EL.nernst(a, b, ca, cc, T), ca, cc }; };
    SIM.qNernst._ult = { poe: (p, a, c) => { par = p; la = a; lc = c; q("[data-c=la]").value = a; q("[data-c=lc]").value = c; el.querySelectorAll("[data-p]").forEach((x) => x.setAttribute("aria-pressed", +x.dataset.p === par)); }, est };
    anima(el, F, () => { const e = est(), N = EL.M[e.an], C = EL.M[e.cat]; q("[data-o=la]").textContent = sci(e.ca, 1); q("[data-o=lc]").textContent = sci(e.cc, 1);
      /* gráfico E × log Q */
      const gx = 80, gy = 30, gw = 540, gh = 170, lqm = 14, inc = ((RG * T) / (e.n * FAR)) * Math.LN10, Emax = Math.max(0.3, e.E0 + inc * lqm) * 1.05, Emin = Math.min(-0.3, e.E0 - inc * lqm) * 1.05, X = (l) => gx + ((l + lqm) / (2 * lqm)) * gw, Y = (v) => gy + ((Emax - v) / (Emax - Emin)) * gh, lq = Math.log10(e.Q);
      let h = D.seta(gx, Y(0), gx + gw + 12, Y(0), "var(--ink2)", 1.3) + D.seta(gx, gy + gh, gx, gy - 12, "var(--ink2)", 1.3) + D.txt(gx - 8, gy - 2, "E (V)", "tx2", "end") + D.txt(gx + gw + 8, Y(0) + 18, "log Q", "tx2", "end");
      [-12, -6, 0, 6, 12].forEach((l) => (h += `<line x1="${f1(X(l))}" y1="${f1(Y(0) - 4)}" x2="${f1(X(l))}" y2="${f1(Y(0) + 4)}" style="stroke:var(--ink2)"/>` + D.txt(X(l), Y(0) + 18, String(l), "tx2")));
      h += `<line x1="${f1(X(-lqm))}" y1="${f1(Y(e.E0 + inc * lqm))}" x2="${f1(X(lqm))}" y2="${f1(Y(e.E0 - inc * lqm))}" style="stroke:var(--mod);stroke-width:2.6"/><line x1="${gx}" y1="${f1(Y(e.E0))}" x2="${f1(X(0))}" y2="${f1(Y(e.E0))}" style="stroke:var(--ink3);stroke-dasharray:3 4"/>` + D.txt(gx - 6, Y(e.E0) + 4, "E° " + nf(e.E0, 2), "tx2", "end");
      h += `<circle cx="${f1(X(Math.max(-lqm, Math.min(lqm, lq))))}" cy="${f1(Y(e.E))}" r="6.5" style="fill:${e.E > 1e-9 ? "var(--ok)" : "var(--bad, #e5484d)"};stroke:var(--bg);stroke-width:2"/>`;
      const lk = e.lnK / Math.LN10; if (!e.conc && lk < lqm) h += `<circle cx="${f1(X(lk))}" cy="${f1(Y(0))}" r="4.5" style="fill:var(--warn)"/>` + D.txt(X(lk), Y(0) - 10, "E = 0: Q = K", "tx2", "middle", 'style="fill:var(--warn)"');
      h += D.txt(gx + gw, gy - 8, e.conc ? "Cu | Cu²⁺ (diluído) || Cu²⁺ (concentrado) | Cu" : `${N[0]} | ${N[1]} || ${C[1]} | ${C[0]}`, "tx2", "end", 'style="font-weight:700"');
      q("[data-v=sv]").innerHTML = h;
      q("[data-v=lt]").innerHTML = vis("E° (padrão)", nf(e.E0, 3) + " V") + vis("n", String(e.n)) + vis("Q", sci(e.Q, 1)) + vis("E (Nernst)", nf(e.E, 3) + " V") + vis("queda por década de Q", nf(inc * 1000, 1) + " mV") + (e.conc ? "" : vis("K (onde E = 0)", "10^" + nf(lk, 1)));
      q("[data-v=st]").innerHTML = (e.conc ? `Mesmos eletrodos, concentrações diferentes: E° = 0, e a tensão vem só da diferença de concentração. O lado <b>diluído</b> é o ânodo (o metal oxida para aumentar a concentração ali). ${e.E < -1e-9 ? "Do jeito que está, o lado que você chamou de ânodo é o mais concentrado: E saiu negativo, ou seja, a pilha funciona ao contrário." : ""}` : `Q = [${N[1]}]${e.n / N[2] > 1 ? "^" + e.n / N[2] : ""} / [${C[1]}]${e.n / C[2] > 1 ? "^" + e.n / C[2] : ""}. Aumentar o produto (íon do ânodo) ou diminuir o reagente (íon do cátodo) aumenta Q e <b>baixa</b> a tensão: é Le Chatelier em volts. Cada fator 10 em Q tira ${nf(inc * 1000, 1)} mV (0,0592 V dividido por n). ${e.E < -1e-9 ? "<b>E ficou negativo</b>: nessas concentrações a reação espontânea é a inversa." : "A pilha só \"morre\" (E = 0) quando Q chega a K, um número gigantesco: por isso a tensão quase não cai durante quase toda a vida da pilha."}`) + " Temperatura: 25 °C."; });
  };

  /* ---------- G03 · eletrólise e leis de Faraday ---------- */
  /* nome: "Eletrólise: corrente, tempo e a massa que se deposita" · matéria: Química · tema: G03 */
  SIM.qEletrolise = (el, F) => {
    const W = 700, H = 250, LISTA = ["Cu", "Ag", "Ni", "Zn", "Cr", "Au"]; let k = "Cu", I = 2, tmin = 30, frac = 0, rod = false, tt = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(LISTA.map((x) => [x, EL.M[x] ? EL.M[x][1] : x]), "k", k)}</div><div class="bts" style="margin-top:8px"><button class="bt" data-a="liga">ligar a fonte ▶</button><button class="bt peq" data-a="zera">de novo</button></div></div>
        <div>${sl("Corrente (A)", "I", 0.5, 10, 0.5, I)}${sl("Tempo (min)", "t", 5, 120, 5, tmin)}</div></div>
      <div class="status" data-v="st">A fonte obriga os elétrons a entrarem pelo <b>cátodo</b> (polo −, aqui), onde o íon do metal se reduz e se deposita. Escolha o íon, a corrente e o tempo, e ligue. A carga é Q = i·t; os mols de elétrons são Q/F; cada íon precisa de n elétrons. Compare prata (n = 1) com ouro ou cromo (n = 3) na mesma carga: a mesma quantidade de elétrons deposita menos mols quando a carga do íon é maior.</div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "k", (v) => { k = v; frac = 0; rod = false; }); q("[data-c=I]").addEventListener("input", (e) => { I = +e.target.value; frac = 0; rod = false; }); q("[data-c=t]").addEventListener("input", (e) => { tmin = +e.target.value; frac = 0; rod = false; });
    q("[data-a=liga]").addEventListener("click", () => { frac = 0; rod = true; }); q("[data-a=zera]").addEventListener("click", () => { frac = 0; rod = false; });
    const est = () => ({ k, I, t: tmin * 60, carga: EL.M[k][2], M: EL.M[k][4], ...EL.faraday(k, I, tmin * 60) });
    SIM.qEletrolise._ult = { poe: (kk, i, t) => { k = kk; I = i; tmin = t; frac = 1; rod = false; q("[data-c=I]").value = i; q("[data-c=t]").value = t; el.querySelectorAll("[data-k]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.k === k)); }, est };
    anima(el, F, (dt) => { tt += dt; if (rod) { frac = Math.min(1, frac + dt / 4); if (frac >= 1) rod = false; } const e = est(), m = EL.M[k]; q("[data-o=I]").textContent = nf(I, 1) + " A"; q("[data-o=t]").textContent = tmin + " min";
      const esp = Math.min(26, 2 + 3.2 * Math.sqrt(e.m * frac));
      let h = `<rect x="120" y="90" width="300" height="140" rx="6" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="122" y="118" width="296" height="110" rx="4" style="fill:${m[5]};opacity:.2"/>`;
      h += `<rect x="${f1(190 - esp / 2)}" y="70" width="${f1(14 + esp)}" height="140" rx="3" style="fill:${m[5]};opacity:.95"/><rect x="190" y="70" width="14" height="140" rx="2" style="fill:var(--ink3)"/><rect x="336" y="70" width="14" height="140" rx="2" style="fill:var(--ink3)"/>`;
      h += `<path d="M197 70V34H250M290 34H343V70" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="250" y="20" width="40" height="28" rx="4" style="fill:var(--bg);stroke:var(--ink2);stroke-width:2"/>` + D.txt(270, 39, "fonte", "tx2") + D.txt(197, 62, "−", "tx", "middle") + D.txt(343, 62, "+", "tx", "middle") + D.txt(160, 246, "cátodo: reduz", "tx2") + D.txt(380, 246, "ânodo: oxida", "tx2");
      if (rod) for (let j = 0; j < 6; j++) { const u = (tt * 0.6 + j / 6) % 1; h += `<circle cx="${f1(330 - u * 110)}" cy="${f1(140 + ((j * 23) % 70))}" r="4" style="fill:${m[5]}"/>`; }
      /* relógio e balança */
      h += D.txt(560, 60, `t = ${nf(tmin * frac, 0)} min`, "tx2") + `<rect x="490" y="150" width="140" height="46" rx="6" style="fill:var(--bg);stroke:var(--ink2);stroke-width:2"/>` + D.txt(560, 180, nf(e.m * frac, 3) + " g", "tx", "middle", 'style="font-weight:700"') + D.txt(560, 140, `massa de ${m[0]} depositada`, "tx2");
      q("[data-v=sv]").innerHTML = h;
      q("[data-v=lt]").innerHTML = vis("carga Q = i·t", nf(e.q, 0) + " C") + vis("mols de elétrons", nf(e.ne, 4) + " mol") + vis(`mols de ${m[0]} (÷ ${m[2]})`, nf(e.n, 4) + " mol") + vis("massa no fim", nf(e.m, 3) + " g") + vis("M / n", nf(m[4] / m[2], 1) + " g por mol de e⁻"); });
  };

  /* ---------- G04 · corrosão e proteção ---------- */
  /* nome: "Corrosão: o prego de ferro e quem está encostado nele" · matéria: Química · tema: G04 */
  SIM.qCorrosao = (el, F) => {
    const W = 700, H = 240, PARC = [["nada", "sozinho"], ["Zn", "zinco"], ["Mg", "magnésio"], ["Cu", "cobre"], ["Sn", "estanho"], ["tinta", "tinta"]]; let pc = "nada", agua = true, ar = true, sal = false, risco = false, tt = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 6px;font-size:13.5px;color:var(--ink2)">O prego de ferro está em contato com:</p><div class="bts">${botoes(PARC, "p", pc)}</div></div>
        <div><div class="bts"><button class="bt peq" data-o2="agua" aria-pressed="true">água</button><button class="bt peq" data-o2="ar" aria-pressed="true">oxigênio</button><button class="bt peq" data-o2="sal" aria-pressed="false">sal dissolvido</button><button class="bt peq" data-o2="risco" aria-pressed="false">revestimento riscado</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "p", (v) => (pc = v));
    el.querySelectorAll("[data-o2]").forEach((b) => b.addEventListener("click", () => { const k = b.dataset.o2, v = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", v); if (k === "agua") agua = v; if (k === "ar") ar = v; if (k === "sal") sal = v; if (k === "risco") risco = v; }));
    /* quem corrói: sem água ou sem oxigênio, nada. Com parceiro metálico: o de menor E° de redução é o ânodo. Tinta: barreira, que falha se riscada. */
    const est = () => { const Fe = EL.M.Fe[3]; let ferro = "corrói", quem = "Fe", motivo = "sozinho";
      if (!agua || !ar) { ferro = "não corrói"; quem = null; motivo = "falta"; }
      else if (pc === "tinta") { if (risco) { ferro = "corrói no risco"; motivo = "barreira-riscada"; } else { ferro = "não corrói"; quem = null; motivo = "barreira"; } }
      else if (pc !== "nada") { const E = EL.M[pc][3]; if (E < Fe) { ferro = "protegido"; quem = pc; motivo = "sacrificio"; } else { ferro = "corrói mais rápido"; quem = "Fe"; motivo = "acelera"; } }
      return { pc, agua, ar, sal, risco, ferro, quem, motivo, dE: pc !== "nada" && pc !== "tinta" ? EL.M[pc][3] - Fe : null }; };
    SIM.qCorrosao._ult = { poe: (p, a, o, s, r) => { pc = p; agua = a; ar = o; sal = s; risco = !!r; el.querySelectorAll("[data-p]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.p === pc)); [["agua", agua], ["ar", ar], ["sal", sal], ["risco", risco]].forEach(([k, v]) => q(`[data-o2=${k}]`).setAttribute("aria-pressed", v)); }, est };
    anima(el, F, (dt) => { tt += dt; const e = est(), fer = e.quem === "Fe", corP = pc !== "nada" && pc !== "tinta" ? EL.M[pc][5] : "#c9853d";
      let h = `<rect x="120" y="60" width="460" height="150" rx="8" style="fill:none;stroke:var(--ink2);stroke-width:2"/>` + (agua ? `<rect x="122" y="100" width="456" height="108" rx="6" style="fill:rgba(90,150,230,${sal ? ".34" : ".2"})"/>` : "") + D.txt(350, 50, `${agua ? (sal ? "água salgada" : "água") : "ambiente seco"} · ${ar ? "com oxigênio" : "sem oxigênio"}`, "tx2");
      /* prego */
      h += `<rect x="250" y="146" width="220" height="16" rx="4" style="fill:#8f9aa6;stroke:var(--ink2);stroke-width:1"/><rect x="238" y="138" width="14" height="32" rx="3" style="fill:#8f9aa6;stroke:var(--ink2);stroke-width:1"/>`;
      if (pc === "tinta") h += `<rect x="236" y="136" width="236" height="36" rx="6" style="fill:rgba(60,160,120,.45);stroke:var(--ok);stroke-width:1.4"/>` + (risco ? `<rect x="350" y="134" width="10" height="40" style="fill:var(--bg)"/><rect x="350" y="146" width="10" height="16" style="fill:#8f9aa6"/>` : "");
      else if (pc !== "nada") h += `<rect x="300" y="126" width="60" height="20" rx="3" style="fill:${corP};stroke:var(--ink2);stroke-width:1"/>` + D.txt(330, 120, EL.M[pc][0], "tx2");
      if (fer) { const nb = sal || e.motivo === "acelera" ? 9 : 5; for (let j = 0; j < nb; j++) { const x = (e.motivo === "barreira-riscada" ? 350 : 260) + ((j * 37) % (e.motivo === "barreira-riscada" ? 10 : 200)), a2 = 0.5 + 0.4 * Math.sin(tt * 2 + j); h += `<circle cx="${x}" cy="${150 + ((j * 11) % 10)}" r="${e.motivo === "barreira-riscada" ? 3 : 5}" style="fill:rgba(176,82,40,${a2.toFixed(2)})"/>`; } }
      if (e.motivo === "sacrificio") for (let j = 0; j < 5; j++) { const u = (tt * 0.5 + j / 5) % 1; h += `<circle cx="${f1(305 + j * 12)}" cy="${f1(126 - u * 22)}" r="3" style="fill:${corP};opacity:${(1 - u).toFixed(2)}"/>`; }
      q("[data-v=sv]").innerHTML = h;
      q("[data-v=lt]").innerHTML = vis("o ferro", e.ferro) + vis("quem oxida (ânodo)", e.quem === null ? "ninguém" : e.quem === "Fe" ? "o ferro" : EL.M[e.quem][0]) + (e.dE !== null ? vis(`E°(${EL.M[pc][0]}) − E°(Fe)`, sg(e.dE) + " V") : "") + vis("E° Fe²⁺/Fe", sg(EL.M.Fe[3]) + " V");
      const T = { falta: "A ferrugem precisa de <b>água e oxigênio juntos</b>. Sem um dos dois não há quem receba os elétrons do ferro (ou não há meio para os íons andarem), e o prego fica intacto.", sozinho: "Ferro, água e oxigênio: o ferro oxida (Fe → Fe²⁺ + 2 e⁻) e o oxigênio reduz. Forma-se a ferrugem.", barreira: "A tinta separa o ferro da água e do oxigênio: é proteção por <b>barreira</b>. Funciona enquanto estiver inteira.", "barreira-riscada": "A barreira falhou no risco: ali o ferro encontra água e oxigênio e corrói. Barreira não protege o que ficou descoberto.", sacrificio: `O ${pc !== "nada" && pc !== "tinta" ? PARC.find((x) => x[0] === pc)[1] : ""} tem potencial de redução <b>menor</b> que o do ferro: é ele que oxida (ânodo de sacrifício), mandando elétrons para o ferro, que vira cátodo e <b>não corrói</b>, mesmo descoberto e mesmo com o revestimento riscado.`, acelera: `O ${pc !== "nada" && pc !== "tinta" ? PARC.find((x) => x[0] === pc)[1] : ""} tem potencial de redução <b>maior</b> que o do ferro: no par, o ferro vira ânodo e corrói <b>mais depressa</b> do que sozinho. ${pc === "Sn" ? "É o problema da lata estanhada riscada: inteiro, o estanho protege por barreira; riscado, piora." : ""}` };
      q("[data-v=st]").innerHTML = T[e.motivo] + (sal && e.quem ? " O sal dissolvido deixa a água mais condutora e <b>acelera</b> a corrosão (não muda quem corrói)." : "") + " Este laboratório decide <b>quem</b> corrói pelos potenciais padrão de tabela; a velocidade mostrada é só ilustrativa."; });
  };
})();
