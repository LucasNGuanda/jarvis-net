/* Simulações da Química, módulo F (Físico-química II), parte de termoquímica: F01 a F03.
   DADOS (tools/quimica/dadosF.json, com fonte, endereço e trecho de cada valor):
   SIM.TERMO.s: [ΔHf° (kJ/mol), ΔGf° (kJ/mol), S° (J/(mol·K))] a 25 °C, do apêndice G do OpenStax Chemistry 2e. Exceções, ditas aqui:
     CaCO₃(s) calcita: ΔHf° e ΔGf° da Wikipedia ("Standard enthalpy of formation": −1206,9 e −1129,1), porque o OpenStax traz −1220,0 e −1081,4, que divergem muito;
       o S° fica null (não uso o do OpenStax junto com ΔH e ΔG de outra fonte) e o ΔS da decomposição é DEDUZIDO de (ΔH − ΔG)/T, o que a tela diz.
     Glicose: Wikipedia (−1271; −910,56; 209,2). Cl₂, F₂, Br₂... não estão no arquivo de dados: só entram como elemento (ΔHf = 0 por definição), com S° null.
   SIM.TERMO.lig: energias médias de ligação (kJ/mol), Tabela 7.2 do OpenStax. "C=O(CO2)" = 799 é a nota de rodapé da tabela do LibreTexts (valor próprio do CO₂).
   SIM.TERMO.comb: calor de combustão (kJ/mol, água líquida), tabelas da Wikipedia "Heat of combustion" (glicose: "Glucose"). Massas molares com C 12, H 1, O 16.
   Água: c = 4,18 J/(g·°C) (Wikipedia, "Properties of water"); fusão 6,01 kJ/mol; vaporização 40,65 kJ/mol no ponto de ebulição.
   Conferido em Python (tools/quimica/confere-termo.py): ΔH, ΔS e ΔG de cada reação da lista, e ΔG contra ΔH − TΔS (diferença máxima dita lá). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const nf = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const f1 = (x) => x.toFixed(1);

  const T0 = 298.15;
  const TERMO = (SIM.TERMO = {
    s: { "H2O(l)": [-285.83, -237.1, 70.0], "H2O(g)": [-241.82, -228.59, 188.8], "CO2(g)": [-393.51, -394.36, 213.8], "CO(g)": [-110.52, -137.15, 197.7], "CH4(g)": [-74.6, -50.5, 186.3], "C2H6(g)": [-84.0, -32.0, 229.2], "C3H8(g)": [-103.8, -23.4, 270.3], "C2H4(g)": [52.4, 68.4, 219.3], "C2H2(g)": [227.4, 209.2, 200.9], "C6H6(l)": [49.1, 124.5, 173.4], "CH3OH(l)": [-239.2, -166.6, 126.8], "C2H5OH(l)": [-277.6, -174.8, 160.7], "NH3(g)": [-45.9, -16.5, 192.8], "NO(g)": [90.25, 87.6, 210.8], "NO2(g)": [33.2, 51.3, 240.1], "N2O4(g)": [11.1, 99.8, 304.4], "SO2(g)": [-296.83, -300.1, 248.2], "SO3(g)": [-395.72, -371.06, 256.76], "HCl(g)": [-92.307, -95.299, 186.9], "NaCl(s)": [-411.2, -384.1, 72.1], "CaCO3(s)": [-1206.9, -1129.1, null], "CaO(s)": [-634.9, -603.3, 38.1], "Fe2O3(s)": [-824.2, -742.2, 87.4], "Al2O3(s)": [-1676, -1582, 50.92], "H2O2(l)": [-187.78, -120.35, 109.6], "O3(g)": [142.7, 163.2, 238.9], "H2(g)": [0, 0, 130.7], "O2(g)": [0, 0, 205.2], "N2(g)": [0, 0, 191.6], "C(grafite)": [0, 0, 5.74], "C(diamante)": [1.89, 2.9, 2.38], "C6H12O6(s)": [-1271, -910.56, 209.2], "Cl2(g)": [0, 0, null], "Fe(s)": [0, 0, null], "Al(s)": [0, 0, null] },
    lig: { "H–H": 436, "C–H": 415, "C–C": 345, "C=C": 611, "C≡C": 837, "C–O": 350, "C=O": 741, "C=O(CO2)": 799, "O–H": 464, "O=O": 498, "N≡N": 946, "N–H": 390, "Cl–Cl": 243, "H–Cl": 432, "C–Cl": 330, "F–F": 160, "H–F": 569, "Br–Br": 190, "H–Br": 370, "I–I": 150, "H–I": 295 },
    /* [nome, fórmula em texto, ΔHc em kJ/mol (positivo = liberado), massa molar em g/mol] */
    comb: { H2: ["hidrogênio", "H₂", 285.83, 2], CH4: ["metano", "CH₄", 890.7, 16], C2H6: ["etano", "C₂H₆", 1560.7, 30], C3H8: ["propano", "C₃H₈", 2219.2, 44], C4H10: ["butano", "C₄H₁₀", 2877.5, 58], CH3OH: ["metanol", "CH₃OH", 726, 32], C2H5OH: ["etanol", "C₂H₅OH", 1367, 46], C6H12O6: ["glicose", "C₆H₁₂O₆", 2805, 180], C: ["carbono (grafite)", "C", 393.5, 12] },
    agua: { c: 4.18, fus: 6.01, vap: 40.65 },
    soma: (lados, i) => lados.reduce((a, [n, k]) => a + n * TERMO.s[k][i], 0),
    dH: (r) => TERMO.soma(r.p, 0) - TERMO.soma(r.r, 0),
    dG: (r) => TERMO.soma(r.p, 1) - TERMO.soma(r.r, 1),
    temS: (r) => [...r.r, ...r.p].every(([, k]) => TERMO.s[k][2] !== null),
    /* ΔS em J/K: pela tabela de S° quando todos têm; senão deduzido de (ΔH − ΔG)/T */
    dS: (r) => (TERMO.temS(r) ? TERMO.soma(r.p, 2) - TERMO.soma(r.r, 2) : ((TERMO.dH(r) - TERMO.dG(r)) * 1000) / T0),
    dHlig: (r, co2) => { const e = (k) => TERMO.lig[co2 && k === "C=O" ? "C=O(CO2)" : k]; return r.q.reduce((a, [n, k]) => a + n * e(k), 0) - r.f.reduce((a, [n, k]) => a + n * e(k), 0); },
    rx: {
      metano: { txt: "CH₄ + 2 O₂ → CO₂ + 2 H₂O(g)", ce: "CH4(g) + 2 O2(g) -> CO2(g) + 2 H2O(g)", r: [[1, "CH4(g)"], [2, "O2(g)"]], p: [[1, "CO2(g)"], [2, "H2O(g)"]], q: [[4, "C–H"], [2, "O=O"]], f: [[2, "C=O"], [4, "O–H"]] },
      metanoL: { txt: "CH₄ + 2 O₂ → CO₂ + 2 H₂O(l)", ce: "CH4(g) + 2 O2(g) -> CO2(g) + 2 H2O(l)", r: [[1, "CH4(g)"], [2, "O2(g)"]], p: [[1, "CO2(g)"], [2, "H2O(l)"]] },
      amonia: { txt: "N₂ + 3 H₂ → 2 NH₃", ce: "N2(g) + 3 H2(g) -> 2 NH3(g)", r: [[1, "N2(g)"], [3, "H2(g)"]], p: [[2, "NH3(g)"]], q: [[1, "N≡N"], [3, "H–H"]], f: [[6, "N–H"]] },
      eteno: { txt: "C₂H₄ + H₂ → C₂H₆", ce: "C2H4(g) + H2(g) -> C2H6(g)", r: [[1, "C2H4(g)"], [1, "H2(g)"]], p: [[1, "C2H6(g)"]], q: [[1, "C=C"], [1, "H–H"]], f: [[1, "C–C"], [2, "C–H"]] },
      agua: { txt: "2 H₂ + O₂ → 2 H₂O(g)", ce: "2 H2(g) + O2(g) -> 2 H2O(g)", r: [[2, "H2(g)"], [1, "O2(g)"]], p: [[2, "H2O(g)"]], q: [[2, "H–H"], [1, "O=O"]], f: [[4, "O–H"]] },
      hcl: { txt: "H₂ + Cl₂ → 2 HCl", ce: "H2(g) + Cl2(g) -> 2 HCl(g)", r: [[1, "H2(g)"], [1, "Cl2(g)"]], p: [[2, "HCl(g)"]], q: [[1, "H–H"], [1, "Cl–Cl"]], f: [[2, "H–Cl"]] },
      calcario: { txt: "CaCO₃ → CaO + CO₂", ce: "CaCO3(s) -> CaO(s) + CO2(g)", r: [[1, "CaCO3(s)"]], p: [[1, "CaO(s)"], [1, "CO2(g)"]] },
      n2o4: { txt: "N₂O₄ → 2 NO₂", ce: "N2O4(g) -> 2 NO2(g)", r: [[1, "N2O4(g)"]], p: [[2, "NO2(g)"]] },
      vapor: { txt: "H₂O(l) → H₂O(g)", ce: "H2O(l) -> H2O(g)", r: [[1, "H2O(l)"]], p: [[1, "H2O(g)"]] },
      ozonio: { txt: "3 O₂ → 2 O₃", ce: "3 O2(g) -> 2 O3(g)", r: [[3, "O2(g)"]], p: [[2, "O3(g)"]] },
      so3: { txt: "2 SO₂ + O₂ → 2 SO₃", ce: "2 SO2(g) + O2(g) -> 2 SO3(g)", r: [[2, "SO2(g)"], [1, "O2(g)"]], p: [[2, "SO3(g)"]] },
      diamante: { txt: "C(grafite) → C(diamante)", ce: "C(grafite) -> C(diamante)", r: [[1, "C(grafite)"]], p: [[1, "C(diamante)"]] },
      h2o2: { txt: "2 H₂O₂(l) → 2 H₂O(l) + O₂", ce: "2 H2O2(l) -> 2 H2O(l) + O2(g)", r: [[2, "H2O2(l)"]], p: [[2, "H2O(l)"], [1, "O2(g)"]] },
      termita: { txt: "2 Al + Fe₂O₃ → Al₂O₃ + 2 Fe", ce: "2 Al(s) + Fe2O3(s) -> Al2O3(s) + 2 Fe(s)", r: [[2, "Al(s)"], [1, "Fe2O3(s)"]], p: [[1, "Al2O3(s)"], [2, "Fe(s)"]] },
      co: { txt: "2 CO + O₂ → 2 CO₂", ce: "2 CO(g) + O2(g) -> 2 CO2(g)", r: [[2, "CO(g)"], [1, "O2(g)"]], p: [[2, "CO2(g)"]] },
      no: { txt: "N₂ + O₂ → 2 NO", ce: "N2(g) + O2(g) -> 2 NO(g)", r: [[1, "N2(g)"], [1, "O2(g)"]], p: [[2, "NO(g)"]] },
      etanol: { txt: "C₂H₅OH(l) + 3 O₂ → 2 CO₂ + 3 H₂O(l)", ce: "C2H5OH(l) + 3 O2(g) -> 2 CO2(g) + 3 H2O(l)", r: [[1, "C2H5OH(l)"], [3, "O2(g)"]], p: [[2, "CO2(g)"], [3, "H2O(l)"]] },
      etino: { txt: "C₂H₂ + 2 H₂ → C₂H₆", ce: "C2H2(g) + 2 H2(g) -> C2H6(g)", r: [[1, "C2H2(g)"], [2, "H2(g)"]], p: [[1, "C2H6(g)"]], q: [[1, "C≡C"], [2, "H–H"]], f: [[1, "C–C"], [4, "C–H"]] },
    },
  });
  /* calorímetro: ΔT = (aproveitamento · n · ΔHc) / (m_água · c) */
  SIM.qQueima = (comb, mg, magua, ef) => { const c = TERMO.comb[comb], n = mg / c[3], q = n * c[2], util = q * ef, dT = (util * 1000) / (magua * TERMO.agua.c); return { n, q, util, dT, porg: c[2] / c[3] }; };

  /* ---------- F01 · calorímetro ---------- */
  /* nome: "Calorímetro: queime o combustível e aqueça a água" · matéria: Química · tema: F01 */
  SIM.qCalorimetro = (el, F) => {
    const W = 700, H = 250; let comb = "C2H5OH", mg = 1, magua = 500, ef = 1, frac = 0, aceso = false, tt = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes([["C2H5OH", "etanol"], ["CH3OH", "metanol"], ["CH4", "metano"], ["C4H10", "butano"], ["H2", "hidrogênio"]], "k", comb)}</div><div class="bts" style="margin-top:8px"><button class="bt" data-a="queima">queimar ▶</button><button class="bt peq" data-a="zera">de novo</button></div></div>
        <div>${sl("Combustível (g)", "mg", 0.1, 3, 0.1, mg)}${sl("Água (g)", "ma", 100, 1000, 50, magua)}${sl("Aproveitamento (%)", "ef", 20, 100, 5, 100)}</div></div>
      <div class="status" data-v="st">A água começa a 20 °C. Escolha o combustível, a massa queimada e a massa de água, e aperte <b>queimar</b>. O calor liberado é n·ΔH de combustão (valores de tabela, com a água formada líquida); a água esquenta ΔT = Q/(m·c), com c = 4,18 J/(g·°C). No calorímetro ideal o aproveitamento é 100%; numa lamparina de verdade, boa parte do calor vai para o ar: baixe o aproveitamento e veja o que acontece com o valor que você mediria.</div>`);
    const q = (s) => el.querySelector(s), est = () => { const e = SIM.qQueima(comb, mg, magua, ef), Tf = 20 + e.dT; return { comb, mg, magua, ef, ...e, Tf, ferve: Tf > 100, medido: e.util / e.n }; };
    liga(el, "k", (v) => { comb = v; frac = 0; aceso = false; });
    [["mg", (v) => (mg = v)], ["ma", (v) => (magua = v)], ["ef", (v) => (ef = v / 100)]].forEach(([c, fn]) => q(`[data-c=${c}]`).addEventListener("input", (e) => { fn(+e.target.value); frac = 0; aceso = false; }));
    q("[data-a=queima]").addEventListener("click", () => { frac = 0; aceso = true; }); q("[data-a=zera]").addEventListener("click", () => { frac = 0; aceso = false; });
    SIM.qCalorimetro._ult = { poe: (k, m, ma, e) => { comb = k; mg = m; magua = ma; ef = e; frac = 1; aceso = false; }, est };
    anima(el, F, (dt) => { tt += dt; if (aceso) { frac = Math.min(1, frac + dt / 3); if (frac >= 1) aceso = false; }
      q("[data-o=mg]").textContent = nf(mg, 1) + " g"; q("[data-o=ma]").textContent = magua + " g"; q("[data-o=ef]").textContent = Math.round(ef * 100) + "%";
      const e = est(), Ta = Math.min(100, 20 + e.dT * frac), cx = 170, by = 210;
      /* béquer com água, termômetro e chama */
      const nivel = 60 + 50 * (magua / 1000), tom = Math.min(1, (Ta - 20) / 80);
      let h = `<rect x="${cx - 70}" y="${by - 150}" width="140" height="${150 - 52}" rx="4" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="${cx - 68}" y="${f1(by - 54 - nivel)}" width="136" height="${f1(nivel)}" style="fill:rgba(${Math.round(80 + 150 * tom)},${Math.round(150 - 40 * tom)},${Math.round(230 - 150 * tom)},.45)"/>`;
      h += `<rect x="${cx + 30}" y="${by - 190}" width="8" height="120" rx="4" style="fill:var(--bg);stroke:var(--ink2);stroke-width:1.4"/><rect x="${cx + 32}" y="${f1(by - 72 - (Ta / 100) * 112)}" width="4" height="${f1((Ta / 100) * 112 + 2)}" style="fill:var(--bad, #e5484d)"/><circle cx="${cx + 34}" cy="${by - 68}" r="6" style="fill:var(--bad, #e5484d)"/>` + D.txt(cx + 48, by - 180, nf(Ta, 1) + " °C", "tx2", "start");
      h += `<rect x="${cx - 22}" y="${by - 18}" width="44" height="18" rx="3" style="fill:var(--ink3)"/>`;
      if (aceso) { const a = 14 + 5 * Math.sin(tt * 23), b2 = 24 + 6 * Math.sin(tt * 17 + 1); h += `<path d="M${cx - 9} ${by - 18}Q${cx - a} ${by - 30} ${cx} ${by - 22 - b2}Q${cx + a} ${by - 30} ${cx + 9} ${by - 18}Z" style="fill:var(--warn)"/><path d="M${cx - 4} ${by - 18}Q${cx - 6} ${by - 26} ${cx} ${by - 20 - b2 / 2}Q${cx + 6} ${by - 26} ${cx + 4} ${by - 18}Z" style="fill:#7fb7ff"/>`; }
      h += D.txt(cx, by + 20, TERMO.comb[comb][0] + ": " + nf(mg * (1 - frac), 2) + " g restantes", "tx2");
      /* barras de energia */
      const bx = 380, bw = 250, emax = Math.max(e.q, 1), barra = (y, v, cor, rot) => `<rect x="${bx}" y="${y}" width="${f1((v / emax) * bw)}" height="20" rx="3" style="fill:${cor}"/>` + D.txt(bx, y - 6, rot, "tx2", "start");
      h += barra(60, e.q * frac, "var(--warn)", `calor liberado: ${nf(e.q * frac, 1)} kJ`) + barra(120, e.util * frac, "var(--mod)", `calor que chegou à água: ${nf(e.util * frac, 1)} kJ`) + barra(180, (e.q - e.util) * frac, "var(--ink3)", `calor perdido para o ar: ${nf((e.q - e.util) * frac, 1)} kJ`);
      q("[data-v=sv]").innerHTML = h;
      q("[data-v=lt]").innerHTML = vis("mols queimados", nf(e.n, 4) + " mol") + vis("ΔH de combustão", "−" + nf(TERMO.comb[comb][2], 1).replace("−", "") + " kJ/mol") + vis("por grama", nf(e.porg, 1) + " kJ/g") + vis("ΔT da água", e.ferve ? "ferveria" : nf(e.dT, 1) + " °C") + vis("ΔH que você mediria", "−" + nf(e.medido, 0) + " kJ/mol");
      if (frac >= 1) q("[data-v=st]").innerHTML = e.ferve ? "Calor demais para essa água: ela chegaria a 100 °C e começaria a ferver, e a conta Q = m·c·ΔT deixaria de valer. Use mais água ou menos combustível." : ef < 0.999 ? `Com ${Math.round(ef * 100)}% de aproveitamento, a água só recebeu ${nf(e.util, 1)} dos ${nf(e.q, 1)} kJ. Quem calcular o ΔH de combustão por essa medida acha −${nf(e.medido, 0)} kJ/mol, um valor <b>menor em módulo</b> que o de tabela. É o erro sistemático típico da lamparina.` : `Todo o calor foi para a água: Q = ${nf(magua, 0)} · 4,18 · ${nf(e.dT, 1)} = ${nf(e.util, 1)} kJ, que dividido por ${nf(e.n, 4)} mol devolve o valor de tabela.`; });
  };

  /* ---------- F02 · lei de Hess em níveis de energia ---------- */
  /* nome: "Lei de Hess: dois caminhos, a mesma diferença" · matéria: Química · tema: F02 */
  SIM.qHess = (el, F) => {
    const W = 700, H = 290, LISTA = ["metano", "amonia", "eteno", "agua", "hcl"]; let k = "metano", modo = "form";
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(LISTA.map((x) => [x, TERMO.rx[x].txt]), "k", k)}</div></div><div><div class="bts">${botoes([["form", "pelos elementos (ΔH de formação)"], ["lig", "pelos átomos (energias de ligação)"]], "m", modo)}</div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "k", (v) => (k = v)); liga(el, "m", (v) => (modo = v));
    const est = () => { const r = TERMO.rx[k], hr = TERMO.soma(r.r, 0), hp = TERMO.soma(r.p, 0), qb = r.q.reduce((a, [n, x]) => a + n * TERMO.lig[x], 0), fm = r.f.reduce((a, [n, x]) => a + n * TERMO.lig[x], 0); return { k, modo, hr, hp, dH: hp - hr, quebra: qb, forma: fm, dHlig: qb - fm, dHligCO2: k === "metano" ? TERMO.dHlig(r, true) : null }; };
    SIM.qHess._ult = { poe: (kk, m) => { k = kk; modo = m; el.querySelectorAll("[data-k]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.k === k)); el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === modo)); }, est };
    const lista = (l) => l.map(([n, x]) => `${n} ${x}`).join(" + ");
    anima(el, F, () => { const e = est(), r = TERMO.rx[k];
      /* níveis: reagentes (esquerda), intermediário (meio), produtos (direita) */
      const niv = modo === "form" ? [e.hr, 0, e.hp] : [0, e.quebra, e.quebra - e.forma], mn = Math.min(...niv), mx = Math.max(...niv), y0 = 232, y1 = 56, Y = (v) => (mx === mn ? 150 : y0 - ((v - mn) / (mx - mn)) * (y0 - y1)), xs = [90, 300, 510], larg = 130;
      const rot = modo === "form" ? ["reagentes", "elementos (zero)", "produtos"] : ["reagentes", "átomos soltos", "produtos"];
      let h = niv.map((v, i) => `<line x1="${xs[i]}" y1="${f1(Y(v))}" x2="${xs[i] + larg}" y2="${f1(Y(v))}" style="stroke:${i === 1 ? "var(--ink2)" : "var(--mod)"};stroke-width:3"/>` + D.txt(xs[i] + larg / 2, Y(v) + (i === 1 && modo === "lig" ? -10 : 20), rot[i], "tx2")).join("");
      const seta = (i, j, cor, txt, dx = 0) => { const xa = xs[i] + larg - 14 + dx, xb = xs[j] + 14 + dx; return D.seta(xa, Y(niv[i]), xb, Y(niv[j]), cor, 2) + D.txt((xa + xb) / 2, (Y(niv[i]) + Y(niv[j])) / 2 - 8, txt, "tx2", "middle", `style="fill:${cor}"`); };
      const sn = (v) => (v > 0 ? "+" : "−") + nf(Math.abs(v), 0);
      h += seta(0, 1, "var(--ink2)", sn(niv[1] - niv[0])) + seta(1, 2, "var(--ink2)", sn(niv[2] - niv[1]));
      /* caminho direto: seta vertical à esquerda, do nível dos reagentes ao dos produtos */
      const dh = niv[2] - niv[0]; h += `<line x1="46" y1="${f1(Y(niv[0]))}" x2="${xs[0]}" y2="${f1(Y(niv[0]))}" style="stroke:var(--warn);stroke-dasharray:4 4"/><line x1="46" y1="${f1(Y(niv[2]))}" x2="${xs[2]}" y2="${f1(Y(niv[2]))}" style="stroke:var(--warn);stroke-dasharray:4 4;opacity:.55"/>` + (Math.abs(Y(niv[0]) - Y(niv[2])) > 6 ? D.seta(46, Y(niv[0]), 46, Y(niv[2]), "var(--warn)", 2.4) : "") + D.txt(350, 281, `caminho direto: ΔH = ${sn(dh)} kJ`, "tx2", "middle", 'style="fill:var(--warn);font-weight:700"');
      h += D.txt(350, 22, r.txt + (modo === "lig" ? "  (tudo gasoso)" : ""), "tx2", "middle", 'style="font-weight:700"');
      q("[data-v=sv]").innerHTML = h;
      q("[data-v=lt]").innerHTML = modo === "form" ? vis("Σ ΔHf dos reagentes", nf(e.hr, 1) + " kJ") + vis("Σ ΔHf dos produtos", nf(e.hp, 1) + " kJ") + vis("ΔH = produtos − reagentes", nf(e.dH, 1) + " kJ") : vis("quebrar (gasta)", "+" + nf(e.quebra, 0) + " kJ") + vis("formar (libera)", "−" + nf(e.forma, 0) + " kJ") + vis("ΔH estimado", nf(e.dHlig, 0) + " kJ") + vis("ΔH pela tabela de formação", nf(e.dH, 1) + " kJ");
      q("[data-v=st]").innerHTML = modo === "form" ? `Desmonte os reagentes nos <b>elementos</b> (o contrário da formação: troca o sinal) e monte os produtos a partir deles. A soma dos dois passos é igual ao caminho direto, porque a entalpia só depende de onde se sai e de onde se chega: ΔH = Σ ΔHf(produtos) − Σ ΔHf(reagentes).` : `Quebre <b>todas</b> as ligações dos reagentes (${lista(r.q)}: sobe, gasta energia) e forme as dos produtos (${lista(r.f)}: desce, libera). ΔH ≈ quebradas − formadas. É uma <b>estimativa</b>: as energias de ligação são médias sobre muitas moléculas. Aqui ela dá ${nf(e.dHlig, 0)} kJ, e a tabela de formação dá ${nf(e.dH, 1)} kJ.` + (e.dHligCO2 !== null ? ` No metano a diferença é grande porque a ligação C=O do CO₂ é mais forte que a média das C=O (799 contra 741 kJ/mol): com o valor próprio do CO₂ a estimativa vai a ${nf(e.dHligCO2, 0)} kJ.` : ""); });
  };

  /* ---------- F03 · energia livre de Gibbs ---------- */
  /* nome: "Energia livre: quem ganha, a entalpia ou a entropia?" · matéria: Química · tema: F03 */
  SIM.qGibbs = (el, F) => {
    const W = 700, H = 270, LISTA = [["vapor", "ferver água"], ["calcario", "calcinar calcário"], ["amonia", "síntese da amônia"], ["n2o4", "N₂O₄ → 2 NO₂"], ["metanoL", "queimar metano"], ["ozonio", "3 O₂ → 2 O₃"], ["livre", "escolher ΔH e ΔS"]]; let k = "vapor", T = 298, dH = 44, dS = 119;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(LISTA, "k", k)}</div></div><div>${sl("Temperatura (K)", "T", 100, 1500, 5, T)}${sl("ΔH (kJ)", "dH", -300, 300, 5, 45)}${sl("ΔS (J/K)", "dS", -300, 300, 5, 120)}</div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const carrega = () => { if (k !== "livre") { const r = TERMO.rx[k]; dH = TERMO.dH(r); dS = TERMO.dS(r); } else { dH = +q("[data-c=dH]").value; dS = +q("[data-c=dS]").value; } ["dH", "dS"].forEach((c) => (q(`[data-c=${c}]`).closest(".ctrl").style.display = k === "livre" ? "" : "none")); };
    liga(el, "k", (v) => { k = v; carrega(); }); q("[data-c=T]").addEventListener("input", (e) => (T = +e.target.value)); ["dH", "dS"].forEach((c) => q(`[data-c=${c}]`).addEventListener("input", carrega)); carrega();
    const est = () => { const dG = dH - (T * dS) / 1000, Tinv = dH * dS > 0 ? (dH * 1000) / dS : null; return { k, T, dH, dS, dG, Tinv, lnK: (-dG * 1000) / (8.314 * T), esp: dG < 0, ded: k !== "livre" && !TERMO.temS(TERMO.rx[k]) }; };
    SIM.qGibbs._ult = { poe: (kk, t, h, s) => { k = kk; T = t; if (kk === "livre") { q("[data-c=dH]").value = h; q("[data-c=dS]").value = s; } carrega(); }, est };
    anima(el, F, () => { const e = est(); q("[data-o=T]").textContent = T + " K (" + nf(T - 273.15, 0) + " °C)"; q("[data-o=dH]").textContent = nf(dH, 0) + " kJ"; q("[data-o=dS]").textContent = nf(dS, 0) + " J/K";
      const gx = 70, gw = 560, gy0 = 30, gh = 200, g = (t) => dH - (t * dS) / 1000, lim = Math.max(20, Math.abs(g(100)), Math.abs(g(1500))) * 1.1, X = (t) => gx + ((t - 100) / 1400) * gw, Y = (v) => gy0 + gh / 2 - (v / lim) * (gh / 2);
      let h = `<rect x="${gx}" y="${gy0}" width="${gw}" height="${gh / 2}" style="fill:rgba(229,72,77,.07)"/><rect x="${gx}" y="${gy0 + gh / 2}" width="${gw}" height="${gh / 2}" style="fill:rgba(60,180,110,.09)"/>` + D.seta(gx, gy0 + gh / 2, gx + gw + 14, gy0 + gh / 2, "var(--ink2)", 1.3) + D.seta(gx, gy0 + gh, gx, gy0 - 12, "var(--ink2)", 1.3) + D.txt(gx - 8, gy0 + 4, "ΔG", "tx2", "end") + D.txt(gx + gw + 10, gy0 + gh / 2 + 18, "T (K)", "tx2", "end") + D.txt(gx + 8, gy0 + 16, "ΔG > 0: não espontânea", "tx2", "start") + D.txt(gx + 8, gy0 + gh - 8, "ΔG < 0: espontânea", "tx2", "start");
      [300, 600, 900, 1200, 1500].forEach((t) => (h += `<line x1="${f1(X(t))}" y1="${gy0 + gh / 2 - 4}" x2="${f1(X(t))}" y2="${gy0 + gh / 2 + 4}" style="stroke:var(--ink2)"/>` + D.txt(X(t), gy0 + gh + 16, String(t), "tx2")));
      h += `<line x1="${f1(X(100))}" y1="${f1(Y(g(100)))}" x2="${f1(X(1500))}" y2="${f1(Y(g(1500)))}" style="stroke:var(--mod);stroke-width:2.6"/><line x1="${f1(X(T))}" y1="${gy0}" x2="${f1(X(T))}" y2="${gy0 + gh}" style="stroke:var(--ink3);stroke-dasharray:3 4"/><circle cx="${f1(X(T))}" cy="${f1(Y(e.dG))}" r="6.5" style="fill:${e.esp ? "var(--ok)" : "var(--bad, #e5484d)"};stroke:var(--bg);stroke-width:2"/>`;
      if (e.Tinv && e.Tinv > 100 && e.Tinv < 1500) h += `<circle cx="${f1(X(e.Tinv))}" cy="${gy0 + gh / 2}" r="4.5" style="fill:var(--warn)"/>` + D.txt(Math.max(gx + 70, Math.min(gx + gw - 70, X(e.Tinv))), gy0 + gh / 2 + 22, `ΔG = 0 em ${nf(e.Tinv, 0)} K`, "tx2", "middle", 'style="fill:var(--warn)"');
      h += D.txt(gx + gw, gy0 - 14, k === "livre" ? "reação genérica" : TERMO.rx[k].txt, "tx2", "end", 'style="font-weight:700"');
      q("[data-v=sv]").innerHTML = h;
      const l10 = e.lnK / Math.LN10;
      q("[data-v=lt]").innerHTML = vis("ΔH", nf(dH, 1) + " kJ") + vis(e.ded ? "ΔS (deduzido)" : "ΔS", nf(dS, 1) + " J/K") + vis("−TΔS", nf((-T * dS) / 1000, 1) + " kJ") + vis("ΔG = ΔH − TΔS", nf(e.dG, 1) + " kJ") + vis("K = e^(−ΔG/RT)", "10^" + nf(l10, 1));
      const caso = dH < 0 && dS > 0 ? "ΔH negativo e ΔS positivo: os dois ajudam. Espontânea em <b>qualquer</b> temperatura." : dH > 0 && dS < 0 ? "ΔH positivo e ΔS negativo: os dois atrapalham. <b>Nunca</b> espontânea (só a reação inversa)." : dH < 0 ? `ΔH negativo e ΔS negativo: a entalpia ajuda e a entropia atrapalha. Espontânea só <b>abaixo</b> de ${nf(e.Tinv, 0)} K.` : dH > 0 ? `ΔH positivo e ΔS positivo: a entropia ajuda e a entalpia atrapalha. Espontânea só <b>acima</b> de ${nf(e.Tinv, 0)} K.` : "Com ΔH = 0, só a entropia decide.";
      q("[data-v=st]").innerHTML = caso + " A reta supõe ΔH e ΔS constantes (valores de 25 °C, com tudo no estado padrão): longe de 25 °C é uma aproximação" + (k === "vapor" ? ", e por isso a água aparece fervendo a " + nf(e.Tinv, 0) + " K, e não aos 373 K medidos." : ".") + (e.ded ? " O ΔS desta reação não saiu de uma tabela de entropias: foi deduzido de (ΔH − ΔG)/T com os dados de formação." : ""); });
  };
})();
