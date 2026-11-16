/* Simulações da Química, módulo E (Físico-química I), parte das soluções: E05 a E08.
   DADOS DE TABELA: todos lidos por script de páginas baixadas (tools/quimica/dadosE.json, com a fonte e o trecho de cada valor). Nada de memória.
   E05 SIM.qSolubilidade: curva de solubilidade e os três tipos de solução.
     SIM.SOLUB: gramas de soluto por 100 mL de água (é a unidade que a fonte declara: Wikipedia, "Solubility table"; 100 mL de água têm praticamente 100 g).
     Entre dois pontos da tabela, interpolação linear (os buracos da fonte, marcados null, são pulados). O sulfato de cério(III) da fonte é o di-hidrato e só vai até 60 °C.
     Regras do laboratório: com agitação, dissolve até a solubilidade e o resto vira corpo de fundo. "Em repouso", ao esfriar, o que estava dissolvido
     continua dissolvido (solução supersaturada) até alguém semear um cristal: aí o excesso cristaliza de uma vez.
     Conferido em Python (tools/quimica/confere-solucoes.py): KNO₃ a 60 °C: 110 g; 80 g em 100 mL a 60 °C é insaturada; esfriando a 20 °C (31,6 g) cristalizam 48,4 g. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const f1 = (x) => x.toFixed(1);

  /* ---------- E05 · curva de solubilidade ---------- */
  const T10 = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  SIM.SOLUB = {
    KNO3: { f: "KNO₃", nome: "nitrato de potássio", v: [13.3, 20.9, 31.6, 45.8, 63.9, 85.5, 110.0, 138, 169, 202, 246] },
    NH4Cl: { f: "NH₄Cl", nome: "cloreto de amônio", v: [29.4, 33.2, 37.2, 41.4, 45.8, 50.4, 55.3, 60.2, 65.6, 71.2, 77.3] },
    KCl: { f: "KCl", nome: "cloreto de potássio", v: [28, 31.2, 34.2, 37.2, 40.1, 42.6, 45.8, null, 51.3, 53.9, 56.3] },
    NaCl: { f: "NaCl", nome: "cloreto de sódio", v: [35.65, 35.72, 35.89, 36.09, 36.37, 36.69, 37.04, 37.46, 37.93, 38.47, 38.99] },
    NaNO3: { f: "NaNO₃", nome: "nitrato de sódio", v: [73, 80.8, 87.6, 94.9, 102, null, 122, null, 148, null, 180] },
    KClO3: { f: "KClO₃", nome: "clorato de potássio", v: [3.3, 5.2, 7.3, 10.1, 13.9, null, 23.8, null, 37.5, 46, 56.3] },
    Ce2SO43: { f: "Ce₂(SO₄)₃", nome: "sulfato de cério(III)", v: [21.4, null, 9.84, 7.24, 5.63, null, 3.87, null, null, null, null], tmax: 60 },
  };
  SIM.solub = (sal, T) => { const v = SIM.SOLUB[sal].v, pts = T10.map((t, i) => [t, v[i]]).filter((p) => p[1] !== null); T = Math.max(pts[0][0], Math.min(pts[pts.length - 1][0], T)); for (let k = 0; k < pts.length - 1; k++) if (T <= pts[k + 1][0]) return pts[k][1] + ((pts[k + 1][1] - pts[k][1]) * (T - pts[k][0])) / (pts[k + 1][0] - pts[k][0]); return pts[pts.length - 1][1]; };
  /* nome: "Curva de solubilidade: insaturada, saturada e supersaturada" · matéria: Química · tema: E05 */
  SIM.qSolubilidade = (el, F) => {
    const W = 700, H = 300; let sal = "KNO3", T = 60, m = 80, diss = 80, quieto = false, brilho = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(Object.keys(SIM.SOLUB).map((k) => [k, SIM.SOLUB[k].f]), "sal", sal)}</div>${sl("Soluto posto em 100 mL de água (g)", "m", 0, 260, 1, m)}</div><div>${sl("Temperatura (°C)", "T", 0, 100, 1, T)}<div class="bts" style="margin-top:8px"><button class="bt peq" data-a="quieto" aria-pressed="false">em repouso (sem agitar)</button><button class="bt peq" data-a="semear">semear um cristal</button></div></div></div>
      <div class="status">O béquer tem 100 mL de água. A curva é a <b>solubilidade</b>: o máximo de soluto que fica dissolvido em cada temperatura (dados de tabela, em g por 100 mL de água). Ponto <b>abaixo</b> da curva: solução insaturada. Ponto <b>na</b> curva: saturada, e o que passar disso vai para o fundo. Para ver uma <b>supersaturada</b>: dissolva tudo a quente, ligue "em repouso" e esfrie devagar: o ponto fica <b>acima</b> da curva, com tudo dissolvido. Aí semeie um cristal. No sulfato de cério(III), a curva desce: ele é menos solúvel a quente.</div>`);
    const q = (s) => el.querySelector(s), S = () => SIM.solub(sal, T);
    const regra = () => { if (!quieto) diss = Math.min(m, S()); else { diss = Math.min(diss, m); if (m - diss > 0.05 || diss < S()) diss = Math.min(m, S()); /* com cristais no fundo não há supersaturação; e, aquecendo, o corpo de fundo dissolve */ } };
    const tmax = () => SIM.SOLUB[sal].tmax || 100;
    liga(el, "sal", (v) => { sal = v; const sT = q("[data-c=T]"); sT.max = tmax(); if (T > tmax()) { T = tmax(); sT.value = T; } quieto = false; q("[data-a=quieto]").setAttribute("aria-pressed", false); regra(); });
    q("[data-c=m]").addEventListener("input", (e) => { const novo = +e.target.value; if (quieto && novo > m && diss > S() + 1e-9) { diss = Math.min(S(), novo); brilho = 1; } m = novo; regra(); }); /* jogar sólido numa supersaturada também semeia */
    q("[data-c=T]").addEventListener("input", (e) => { T = +e.target.value; regra(); });
    q("[data-a=quieto]").addEventListener("click", (e) => { quieto = !quieto; e.currentTarget.setAttribute("aria-pressed", quieto); regra(); });
    q("[data-a=semear]").addEventListener("click", () => { if (diss > S() + 1e-9) { diss = S(); brilho = 1; } });
    SIM.qSolubilidade._ult = { poe: (s, t, mm, qu) => { sal = s; T = t; m = mm; quieto = false; regra(); quieto = !!qu; q("[data-c=T]").max = tmax(); q("[data-c=T]").value = t; q("[data-c=m]").value = mm; q("[data-a=quieto]").setAttribute("aria-pressed", quieto); }, temp: (t) => { T = t; q("[data-c=T]").value = t; regra(); }, semear: () => q("[data-a=semear]").click(), est: () => ({ sal, T, m, diss, fundo: m - diss, S: S(), tipo: SIM.qSolubilidade._tipo() }) };
    SIM.qSolubilidade._tipo = () => (diss > S() + 0.05 ? "supersaturada" : m - diss > 0.05 ? "saturada com corpo de fundo" : Math.abs(diss - S()) <= 0.05 ? "saturada" : "insaturada");
    regra();
    anima(el, F, (dt) => {
      brilho = Math.max(0, brilho - dt * 0.7); const s = S(), fundo = m - diss, tipo = SIM.qSolubilidade._tipo(), COR = { insaturada: "var(--ok)", saturada: "var(--warn)", "saturada com corpo de fundo": "var(--warn)", supersaturada: "var(--bad)" };
      /* béquer */
      const bx = 50, by = 60, bw = 150, bh = 190; let h = `<rect x="${bx + 2}" y="${by + 50}" width="${bw - 4}" height="${bh - 52}" style="fill:color-mix(in srgb,var(--mod) ${Math.round(Math.min(60, 6 + diss * 0.35))}%,transparent)"/><path d="M${bx} ${by} L${bx} ${by + bh} L${bx + bw} ${by + bh} L${bx + bw} ${by}" style="fill:none;stroke:var(--ink2);stroke-width:2.5"/>`;
      const nc = Math.min(70, Math.round(fundo / 2.5)); for (let k = 0; k < nc; k++) { const cx = bx + 10 + ((k * 37) % (bw - 22)), cy = by + bh - 6 - Math.floor(k / 10) * 9 - ((k * 13) % 5); h += `<rect x="${cx}" y="${cy - 6}" width="7" height="7" transform="rotate(${(k * 31) % 60} ${cx + 3} ${cy - 3})" style="fill:var(--ink);opacity:${0.75 + 0.25 * brilho}"/>`; }
      if (brilho > 0) h += `<rect x="${bx + 2}" y="${by + 50}" width="${bw - 4}" height="${bh - 52}" style="fill:#fff;opacity:${(brilho * 0.35).toFixed(2)}"/>`;
      h += D.txt(bx + bw / 2, by + bh + 20, `100 mL de água a ${T} °C`, "tx2") + D.txt(bx + bw / 2, by - 10, tipo, "tx2", "middle", `style="fill:${COR[tipo]};font-weight:700"`);
      /* gráfico */
      const gx = 290, gy = 258, gw = 370, gh = 220, ymax = 260, X = (t) => gx + (t / 100) * gw, Y = (v) => gy - (Math.min(v, ymax) / ymax) * gh;
      h += D.seta(gx, gy, gx + gw + 14, gy, "var(--ink2)", 1.4) + D.seta(gx, gy, gx, gy - gh - 14, "var(--ink2)", 1.4) + D.txt(gx + gw + 10, gy + 32, "temperatura (°C)", "tx2", "end") + D.txt(gx + 6, gy - gh - 4, "g de soluto em 100 mL de água", "tx2", "start");
      [0, 20, 40, 60, 80, 100].forEach((t) => (h += D.txt(X(t), gy + 16, t, "tx2"))); [50, 100, 150, 200, 250].forEach((v) => (h += D.txt(gx - 6, Y(v) + 4, v, "tx2", "end") + `<line x1="${gx}" y1="${f1(Y(v))}" x2="${gx + gw}" y2="${f1(Y(v))}" style="stroke:var(--line2);stroke-dasharray:2 5"/>`));
      Object.keys(SIM.SOLUB).forEach((k) => { let d = ""; for (let t = 0; t <= (SIM.SOLUB[k].tmax || 100); t += 2) d += (d ? "L" : "M") + f1(X(t)) + " " + f1(Y(SIM.solub(k, t))); h += `<path d="${d}" style="fill:none;stroke:${k === sal ? "var(--mod)" : "var(--ink3)"};stroke-width:${k === sal ? 2.6 : 1.1};opacity:${k === sal ? 1 : 0.55}"/>`; });
      h += `<line x1="${f1(X(T))}" y1="${gy}" x2="${f1(X(T))}" y2="${f1(Y(Math.max(diss, s)))}" style="stroke:var(--ink3);stroke-dasharray:3 4"/><circle cx="${f1(X(T))}" cy="${f1(Y(s))}" r="4" style="fill:none;stroke:var(--mod);stroke-width:2"/><circle cx="${f1(X(T))}" cy="${f1(Y(diss))}" r="7" style="fill:${COR[tipo]};stroke:var(--bg);stroke-width:2"/>`;
      if (m > diss + 0.05 && m <= ymax) h += `<circle cx="${f1(X(T))}" cy="${f1(Y(m))}" r="4" style="fill:var(--ink3)"/>` + D.txt(X(T) + 8, Y(m) + 4, "total posto", "tx2", "start");
      q("[data-v=sv]").innerHTML = h;
      q("[data-v=lt]").innerHTML = vis("solubilidade do " + SIM.SOLUB[sal].f + " a " + T + " °C", n2(s, 1) + " g / 100 mL") + vis("dissolvido", n2(diss, 1) + " g") + vis("corpo de fundo", n2(Math.max(0, fundo), 1) + " g") + `<div class="vis"><small>a solução é</small><b style="color:${COR[tipo]}">${tipo}</b></div>`;
      q("[data-o=m]").textContent = m + " g"; q("[data-o=T]").textContent = T + " °C";
    });
  };

  /* ---------- E06 · diluição e mistura ----------
     Diluição: o soluto não muda, n = M₁V₁ = M₂V₂, com V₂ = volume FINAL (inicial + água). Mistura de duas soluções do mesmo soluto: n = M_A·V_A + M_B·V_B,
     V = V_A + V_B (volumes somados, hipótese de sala de aula dita na tela). Concentração comum C (g/L) = M (mol/L) × massa molar.
     Conferido em Python (tools/quimica/confere-solucoes.py): 100 mL de NaCl 2,0 mol/L + 300 mL de água: 0,50 mol/L, 29,25 g/L, 0,200 mol, 11,7 g;
     200 mL a 1,0 + 300 mL a 3,0: 2,2 mol/L; juntar com 0 mL não muda nada. */
  SIM.SOLUTOS = { NaCl: ["NaCl", 58.5, "var(--mA)"], NaOH: ["NaOH", 40, "var(--mT)"], glicose: ["glicose", 180, "var(--warn)"], KMnO4: ["KMnO₄", 158, "#b06fc0"], CuSO4: ["CuSO₄", 159.5, "#4f9be0"] };
  SIM.mistura2 = (MA, VA, MB, VB) => { const V = VA + VB, n = (MA * VA + MB * VB) / 1000; return { V, n, M: V ? (n * 1000) / V : 0 }; };
  /* nome: "Diluir e misturar: o soluto não some" · matéria: Química · tema: E06 */
  SIM.qDiluicao = (el, F) => {
    const W = 700, H = 280; let sol = "KMnO4", modo = "dil", MA = 2, VA = 100, MB = 0, VB = 300;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes([["dil", "diluir com água"], ["mis", "misturar duas soluções"]], "modo", modo)}</div><div class="bts" style="margin-top:8px">${botoes(Object.keys(SIM.SOLUTOS).map((k) => [k, SIM.SOLUTOS[k][0]]), "sol", sol)}</div>${sl("Solução A: concentração (mol/L)", "MA", 0, 4, 0.05, MA)}${sl("Solução A: volume (mL)", "VA", 0, 500, 10, VA)}</div><div data-v="cb"></div></div>
      <div class="status">O que entra no frasco final é a <b>soma dos volumes</b> e a <b>soma dos mols de soluto</b>. Na diluição, a água não traz soluto: os mols são os mesmos, espalhados num volume maior, e a cor clareia. Repare que a concentração final se calcula com o volume <b>final</b>, não com o volume de água posto. A linha de baixo mostra a mesma concentração em g/L (concentração comum) e em mol/L (molaridade): os números são diferentes, a solução é a mesma. Hipótese de sala de aula: os volumes se somam.</div>`);
    const q = (s) => el.querySelector(s);
    const ctrlB = () => { q("[data-v=cb]").innerHTML = (modo === "mis" ? sl("Solução B: concentração (mol/L)", "MB", 0, 4, 0.05, MB) : "") + sl(modo === "mis" ? "Solução B: volume (mL)" : "Água acrescentada (mL)", "VB", 0, 500, 10, VB); if (modo === "dil") MB = 0; el.querySelectorAll("[data-v=cb] input").forEach((i) => i.addEventListener("input", (e) => { if (i.dataset.c === "MB") MB = +e.target.value; else VB = +e.target.value; })); };
    liga(el, "modo", (v) => { modo = v; if (v === "mis" && MB === 0) MB = 1; ctrlB(); }); liga(el, "sol", (v) => (sol = v));
    q("[data-c=MA]").addEventListener("input", (e) => (MA = +e.target.value)); q("[data-c=VA]").addEventListener("input", (e) => (VA = +e.target.value));
    SIM.qDiluicao._ult = { poe: (m, s, ma, va, mb, vb) => { modo = m; sol = s; MA = ma; VA = va; MB = mb; VB = vb; el.querySelectorAll("[data-modo]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.modo === m)); ctrlB(); }, est: () => Object.assign({ MM: SIM.SOLUTOS[sol][1] }, SIM.mistura2(MA, VA, modo === "dil" ? 0 : MB, VB)) };
    ctrlB();
    anima(el, F, () => {
      const o = SIM.SOLUTOS[sol], mb = modo === "dil" ? 0 : MB, r = SIM.mistura2(MA, VA, mb, VB);
      const frasco = (x, vol, M, rot) => { const bw = 120, bh = 170, by = 50, hl = (Math.min(vol, 1000) / 1000) * (bh - 8), op = Math.min(0.9, 0.06 + M * 0.22); return `<rect x="${x + 2}" y="${f1(by + bh - hl)}" width="${bw - 4}" height="${f1(hl)}" style="fill:${M > 0 ? o[2] : "var(--mA)"};opacity:${M > 0 ? op.toFixed(2) : 0.12}"/><path d="M${x} ${by} L${x} ${by + bh} L${x + bw} ${by + bh} L${x + bw} ${by}" style="fill:none;stroke:var(--ink2);stroke-width:2.2"/>` + [250, 500, 750, 1000].map((v) => `<line x1="${x + bw - 14}" y1="${f1(by + bh - (v / 1000) * (bh - 8))}" x2="${x + bw}" y2="${f1(by + bh - (v / 1000) * (bh - 8))}" style="stroke:var(--ink3)"/>`).join("") + rot.map((t, k) => D.txt(x + bw / 2, by + bh + 18 + k * 16, t, "tx2")).join(""); };
      let h = frasco(50, VA, MA, ["A: " + n2(VA, 0) + " mL", n2(MA, 2) + " mol/L"]) + D.txt(210, 140, "+", "tx", "middle", 'style="font-size:26px"') + frasco(250, VB, mb, [(modo === "dil" ? "água: " : "B: ") + n2(VB, 0) + " mL", modo === "dil" ? "sem soluto" : n2(mb, 2) + " mol/L"]) + D.seta(392, 135, 462, 135, "var(--ink2)", 2) + frasco(490, r.V, r.M, ["final: " + n2(r.V, 0) + " mL", n2(r.M, 3) + " mol/L"]);
      h += D.txt(110, 30, "mols: " + n2((MA * VA) / 1000, 3), "tx2") + D.txt(310, 30, "mols: " + n2((mb * VB) / 1000, 3), "tx2") + D.txt(550, 30, "mols: " + n2(r.n, 3), "tx2", "middle", 'style="fill:var(--ink);font-weight:700"');
      q("[data-v=sv]").innerHTML = h;
      q("[data-v=lt]").innerHTML = r.V === 0 ? vis("frasco final", "vazio") : vis("volume final", n2(r.V, 0) + " mL") + vis("soluto (" + o[0] + ")", n2(r.n, 3) + " mol = " + n2(r.n * o[1], 2) + " g") + vis("molaridade", n2(r.M, 3) + " mol/L") + vis("concentração comum", n2(r.M * o[1], 2) + " g/L") + vis("a concentração de A ficou", MA > 0 && VA > 0 ? n2(MA / (r.M || 1), 2) + " vezes menor" : "—");
      q("[data-o=MA]").textContent = n2(MA, 2) + " mol/L"; q("[data-o=VA]").textContent = VA + " mL"; const ob = q("[data-o=MB]"); if (ob) ob.textContent = n2(MB, 2) + " mol/L"; q("[data-o=VB]").textContent = VB + " mL";
    });
  };

  /* ---------- E07 · titulação na bureta ----------
     Ácido no erlenmeyer (25,0 mL), base forte (NaOH 0,100 mol/L) na bureta. pH pela conta exata do balanço de cargas, a 25 °C (Kw = 1,0·10⁻¹⁴):
       ácido forte: [H⁺] − Kw/[H⁺] = (n_a − n_b)/V  →  [H⁺] = (d + √(d² + 4Kw))/2;
       ácido fraco HA (Ka): [H⁺] + [Na⁺] = Kw/[H⁺] + C·Ka/(Ka + [H⁺]), resolvida por bisseção.
     Ácido acético: pKa = 4,756 (Wikipedia, "Acetic acid"). Indicadores, faixas de viragem (Wikipedia, "pH indicator"): alaranjado de metila 3,1–4,4 (vermelho → amarelo);
       azul de bromotimol 6,0–7,6 (amarelo → azul); fenolftaleína 8,3–10,0 (incolor → rosa). Tudo lido por script: tools/quimica/dadosE.json.
     PONTO DE EQUIVALÊNCIA: mols de base = mols de ácido (é da reação). PONTO DE VIRAGEM: onde o indicador muda de cor (é do indicador); aqui, o volume em que o pH
       passa pelo meio da faixa. O laboratório mostra os dois e a diferença.
     Conferido em Python (tools/quimica/confere-solucoes.py), 25,0 mL de ácido 0,100 mol/L: HCl: pH 1,00 (0 mL); 1,48 (12,5 mL); 4,00 (24,95 mL); 7,00 (25,00 mL); 10,00 (25,05 mL).
       Acético: 2,88 (0 mL); 4,76 (12,5 mL = meia equivalência, pH = pKa); 8,73 (25,00 mL); 10,00 (25,05 mL). */
  const KW = 1e-14;
  SIM.ACIDOS = { HCl: { f: "HCl", nome: "ácido clorídrico (forte)", Ka: null }, HAc: { f: "CH₃COOH", nome: "ácido acético (fraco)", Ka: Math.pow(10, -4.756) } };
  SIM.INDIC = { fen: { nome: "fenolftaleína", a: 8.3, b: 10.0, c1: [255, 255, 255, 0.06], c2: [233, 70, 150, 0.75], n1: "incolor", n2: "rosa" }, bro: { nome: "azul de bromotimol", a: 6.0, b: 7.6, c1: [235, 205, 60, 0.7], c2: [60, 110, 230, 0.75], n1: "amarelo", n2: "azul" }, ala: { nome: "alaranjado de metila", a: 3.1, b: 4.4, c1: [230, 70, 60, 0.75], c2: [240, 200, 60, 0.7], n1: "vermelho", n2: "amarelo" } };
  SIM.phTit = (ac, Ca, Va, Cb, Vb) => { const V = (Va + Vb) / 1000, na = (Ca * Va) / 1000, nb = (Cb * Vb) / 1000, Ka = SIM.ACIDOS[ac].Ka; let h;
    if (Ka === null) { const d = (na - nb) / V; h = (d + Math.sqrt(d * d + 4 * KW)) / 2; }
    else { const C = na / V, Na = nb / V, f = (x) => x + Na - KW / x - (C * Ka) / (Ka + x); let lo = -14.5, hi = 0.5; for (let k = 0; k < 70; k++) { const m = (lo + hi) / 2; f(Math.pow(10, m)) > 0 ? (hi = m) : (lo = m); } h = Math.pow(10, (lo + hi) / 2); }
    return -Math.log10(h); };
  SIM.viragem = (ac, Ca, Va, Cb, ind) => { const alvo = (SIM.INDIC[ind].a + SIM.INDIC[ind].b) / 2; let lo = 0, hi = 60; if (SIM.phTit(ac, Ca, Va, Cb, 0) >= alvo) return 0; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; SIM.phTit(ac, Ca, Va, Cb, m) < alvo ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
  SIM.corInd = (ind, pH) => { const o = SIM.INDIC[ind], t = Math.max(0, Math.min(1, (pH - o.a) / (o.b - o.a))), c = o.c1.map((x, k) => x + (o.c2[k] - x) * t); return { css: `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${c[3].toFixed(2)})`, nome: t <= 0 ? o.n1 : t >= 1 ? o.n2 : "virando: " + o.n1 + " → " + o.n2 }; };
  /* nome: "A bureta: gota a gota até o ponto de viragem" · matéria: Química · tema: E07 */
  SIM.qBureta = (el, F) => {
    const W = 700, H = 330, VA = 25, CB = 0.1; let ac = "HCl", ind = "fen", Ca = 0.1, Vb = 0, aberta = false, oculto = false, pts = [[0, 0]], gota = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes([["HCl", "HCl (forte)"], ["HAc", "ácido acético (fraco)"]], "ac", ac)}</div><div class="bts" style="margin-top:8px">${botoes(Object.keys(SIM.INDIC).map((k) => [k, SIM.INDIC[k].nome]), "ind", ind)}</div>${sl("Concentração do ácido no erlenmeyer (mol/L)", "Ca", 0.02, 0.2, 0.002, Ca)}</div>
        <div><div class="bts"><button class="bt peq" data-a="gota">1 gota (0,05 mL)</button><button class="bt peq" data-a="ml">1 mL</button><button class="bt peq" data-a="abre" aria-pressed="false">abrir a torneira</button><button class="bt peq" data-a="zera">recomeçar</button></div><div class="bts" style="margin-top:8px"><button class="bt peq" data-a="surpresa">amostra desconhecida</button><button class="bt peq" data-a="revela" hidden>revelar a concentração</button></div><p data-v="msg" style="margin:8px 0 0;font-size:13.5px;color:var(--ink2)"></p></div></div>
      <div class="status">No erlenmeyer: 25,0 mL de ácido com gotas de indicador. Na bureta: NaOH 0,100 mol/L. Abra a torneira no começo e vá <b>gota a gota</b> quando a cor começar a demorar para sumir. O <b>ponto de equivalência</b> é o da reação: mols de base iguais aos mols de ácido. O <b>ponto de viragem</b> é o do indicador: onde a cor muda. Um bom indicador faz os dois quase coincidirem; troque de indicador com o ácido acético e veja um indicador ruim errar feio. Pode passar do ponto de propósito: o gráfico mostra o estrago. Em "amostra desconhecida", titule e calcule a concentração antes de revelar.</div>`);
    const q = (s) => el.querySelector(s), pH = (v) => SIM.phTit(ac, Ca, VA, CB, v), veq = () => (Ca * VA) / CB;
    const zera = () => { Vb = 0; pts = [[0, pH(0)]]; aberta = false; q("[data-a=abre]").setAttribute("aria-pressed", false); };
    const junta = (dv) => { if (Vb >= 50) { aberta = false; q("[data-a=abre]").setAttribute("aria-pressed", false); return; } Vb = Math.min(50, +(Vb + dv).toFixed(4)); pts.push([Vb, pH(Vb)]); gota = 1; };
    liga(el, "ac", (v) => { ac = v; zera(); }); liga(el, "ind", (v) => (ind = v));
    q("[data-c=Ca]").addEventListener("input", (e) => { Ca = +e.target.value; oculto = false; q("[data-a=revela]").hidden = true; zera(); });
    q("[data-a=gota]").addEventListener("click", () => junta(0.05)); q("[data-a=ml]").addEventListener("click", () => junta(1));
    q("[data-a=abre]").addEventListener("click", (e) => { aberta = !aberta; e.currentTarget.setAttribute("aria-pressed", aberta); }); q("[data-a=zera]").addEventListener("click", zera);
    q("[data-a=surpresa]").addEventListener("click", () => { Ca = +(0.04 + Math.random() * 0.14).toFixed(3); oculto = true; q("[data-a=revela]").hidden = false; q("[data-c=Ca]").value = 0.02; zera(); });
    q("[data-a=revela]").addEventListener("click", () => { oculto = false; q("[data-a=revela]").hidden = true; q("[data-c=Ca]").value = Ca; });
    SIM.qBureta._ult = { poe: (a, i, c) => { ac = a; ind = i; Ca = c; oculto = false; el.querySelectorAll("[data-ac]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.ac === a)); el.querySelectorAll("[data-ind]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.ind === i)); zera(); }, junta, est: () => ({ ac, ind, Ca, Vb, pH: pH(Vb), veq: veq(), vir: SIM.viragem(ac, Ca, VA, CB, ind), cor: SIM.corInd(ind, pH(Vb)).nome, oculto }), abre: (v) => (aberta = v) };
    let acum = 0; zera();
    anima(el, F, (dt) => {
      if (aberta) { acum += dt * 2.2; while (acum >= 0.05) { acum -= 0.05; junta(0.05); } }
      gota = Math.max(0, gota - dt * 5);
      const p = pH(Vb), cor = SIM.corInd(ind, p), ve = veq(), vir = SIM.viragem(ac, Ca, VA, CB, ind);
      /* bureta: 50 mL em 190 px */
      const bx = 96, bt = 14, bl = 190, niv = bt + (Vb / 50) * bl; let h = `<rect x="${bx}" y="${bt}" width="18" height="${bl}" style="fill:none;stroke:var(--ink2);stroke-width:1.8"/><rect x="${bx + 1}" y="${f1(niv)}" width="16" height="${f1(bt + bl - niv)}" style="fill:color-mix(in srgb,var(--mA) 30%,transparent)"/><path d="M${bx + 4} ${bt + bl} L${bx + 7} ${bt + bl + 22} L${bx + 11} ${bt + bl + 22} L${bx + 14} ${bt + bl}" style="fill:none;stroke:var(--ink2);stroke-width:1.6"/><rect x="${bx - 6}" y="${bt + bl + 4}" width="30" height="5" rx="2" style="fill:${aberta ? "var(--ok)" : "var(--ink3)"}"/>`;
      for (let v = 0; v <= 50; v += 10) h += `<line x1="${bx - 5}" y1="${bt + (v / 50) * bl}" x2="${bx}" y2="${bt + (v / 50) * bl}" style="stroke:var(--ink3)"/>` + D.txt(bx - 8, bt + (v / 50) * bl + 4, v, "tx2", "end");
      h += D.txt(bx + 9, bt - 2, "", "tx2") + D.txt(bx + 60, bt + 30, "NaOH", "tx2", "start") + D.txt(bx + 60, bt + 46, "0,100 mol/L", "tx2", "start");
      if (gota > 0) h += `<circle cx="${bx + 9}" cy="${f1(bt + bl + 24 + (1 - gota) * 34)}" r="3" style="fill:var(--mA)"/>`;
      const ex = bx + 9, ey = 300; h += `<path d="M${ex - 12} ${ey - 62} L${ex - 12} ${ey - 44} L${ex - 52} ${ey} L${ex + 52} ${ey} L${ex + 12} ${ey - 44} L${ex + 12} ${ey - 62}" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="M${ex - 30} ${ey - 24} L${ex - 50} ${ey - 2} L${ex + 50} ${ey - 2} L${ex + 30} ${ey - 24} Z" style="fill:${cor.css}"/>` + D.txt(ex, ey + 20, "25,0 mL de " + SIM.ACIDOS[ac].f, "tx2");
      /* curva de pH */
      const gx = 290, gy = 290, gw = 370, gh = 255, X = (v) => gx + (v / 50) * gw, Y = (y) => gy - (y / 14) * gh, o = SIM.INDIC[ind];
      h += D.seta(gx, gy, gx + gw + 14, gy, "var(--ink2)", 1.4) + D.seta(gx, gy, gx, gy - gh - 14, "var(--ink2)", 1.4) + D.txt(gx + gw + 10, gy + 32, "NaOH adicionado (mL)", "tx2", "end") + D.txt(gx - 6, gy - gh - 6, "pH", "tx2", "end");
      [0, 10, 20, 30, 40, 50].forEach((v) => (h += D.txt(X(v), gy + 16, v, "tx2"))); [2, 4, 6, 8, 10, 12].forEach((y) => (h += D.txt(gx - 6, Y(y) + 4, y, "tx2", "end")));
      h += `<rect x="${gx}" y="${f1(Y(o.b))}" width="${gw}" height="${f1(Y(o.a) - Y(o.b))}" style="fill:rgba(${o.c2[0]},${o.c2[1]},${o.c2[2]},.16)"/>` + D.txt(gx + gw - 4, Y(o.b) - 4, "faixa de viragem: " + o.nome, "tx2", "end") + `<line x1="${gx}" y1="${f1(Y(7))}" x2="${gx + gw}" y2="${f1(Y(7))}" style="stroke:var(--line2);stroke-dasharray:3 5"/>`;
      let d = ""; pts.forEach((pt, k) => (d += (k ? "L" : "M") + f1(X(pt[0])) + " " + f1(Y(pt[1])))); h += `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.4"/><circle cx="${f1(X(Vb))}" cy="${f1(Y(p))}" r="5.5" style="fill:var(--warn);stroke:var(--bg);stroke-width:2"/>`;
      if (!oculto && Vb >= ve) h += `<line x1="${f1(X(ve))}" y1="${gy}" x2="${f1(X(ve))}" y2="${gy - gh}" style="stroke:var(--ok);stroke-dasharray:5 4"/>` + D.txt(X(ve) + 4, gy - gh + 12, "equivalência", "tx2", "start", 'style="fill:var(--ok)"');
      q("[data-v=sv]").innerHTML = h;
      const passou = Vb - ve;
      q("[data-v=msg]").innerHTML = oculto ? "Amostra desconhecida: pare na viragem, leia o volume e calcule a concentração do ácido. Depois revele." : Vb < 0.001 ? "Bureta cheia. Comece." : passou > 0.3 ? `Passou do ponto: há ${n2(passou, 2)} mL de base a mais (${n2((passou / ve) * 100, 1)}% de erro no volume).` : passou >= -0.03 && passou <= 0.3 ? "Na região do ponto de equivalência." : "Ainda há ácido sobrando.";
      q("[data-v=lt]").innerHTML = vis("volume de NaOH gasto", n2(Vb, 2) + " mL") + vis("pH no erlenmeyer", n2(p, 2)) + vis("cor (" + o.nome + ")", cor.nome) + vis("ácido no erlenmeyer", oculto ? "? mol/L" : n2(Ca, 3) + " mol/L") + vis("equivalência · viragem", oculto ? "titule para descobrir" : n2(ve, 2) + " mL · " + n2(vir, 2) + " mL");
      q("[data-o=Ca]").textContent = oculto ? "?" : n2(Ca, 3) + " mol/L";
    });
  };

  /* ---------- E08 · propriedades coligativas lado a lado ----------
     Solvente: 1 kg de água. Constantes da água, de fonte (tools/quimica/dadosE.json): Kf = 1,86 K·kg/mol ("Freezing-point depression"); Kb = 0,512 K·kg/mol
     ("Ebullioscopic constant"); pressão de vapor a 25 °C = 23,8 mmHg ("Vapour pressure of water").
     Modelo de solução ideal diluída, com dissociação total dos eletrólitos (fator de van 't Hoff i = número de íons por fórmula):
       ΔTc = Kf·W·i; ΔTe = Kb·W·i; abaixamento relativo da pressão de vapor = fração molar das partículas de soluto = i·n/(i·n + 55,56);
       pressão osmótica π = i·M·R·T a 25 °C, tomando M ≈ W (1 kg de água ≈ 1 L de solução: só vale para solução diluída; a tela avisa).
     Conferido em Python (tools/quimica/confere-solucoes.py): 1 mol/kg de glicose: −1,86 °C; 100,51 °C; 23,38 mmHg; 24,4 atm.
       1 mol/kg de NaCl: −3,72 °C; 101,02 °C; 22,97 mmHg; 48,9 atm. 0,154 mol/kg de NaCl (soro): π = 7,5 atm. Sem soluto: 0 °C, 100 °C, 23,8 mmHg, 0 atm. */
  SIM.COLIG = { glicose: ["glicose", 1, "C₆H₁₂O₆"], ureia: ["ureia", 1, "CO(NH₂)₂"], NaCl: ["NaCl", 2, "Na⁺ + Cl⁻"], CaCl2: ["CaCl₂", 3, "Ca²⁺ + 2 Cl⁻"], AlCl3: ["AlCl₃", 4, "Al³⁺ + 3 Cl⁻"] };
  SIM.colig = (W, i) => { const np = W * i, x = np / (np + 1000 / 18); return { np, dTc: 1.86 * np, dTe: 0.512 * np, Tc: -1.86 * np, Te: 100 + 0.512 * np, x, Pv: 23.8 * (1 - x), pi: np * 0.082 * 298 }; };
  /* nome: "Coligativas lado a lado: o que conta é o número de partículas" · matéria: Química · tema: E08 */
  SIM.qColigativas = (el, F) => {
    const W = 700, H = 330; const st = [{ s: "glicose", w: 1 }, { s: "NaCl", w: 1 }];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${[0, 1].map((k) => `<div><div class="bts">solução ${k + 1}: ${botoes(Object.keys(SIM.COLIG).map((x) => [x, SIM.COLIG[x][0]]), "s" + k, st[k].s)}</div>${sl("Quantidade de soluto (mol por kg de água)", "w" + k, 0, 3, 0.05, st[k].w)}</div>`).join("")}</div>
      <div class="status">Três béqueres com 1 kg de água: água pura e duas soluções. Comece com 1 mol de glicose de um lado e 1 mol de NaCl do outro: mesmos mols de soluto, mas o NaCl se separa em <b>dois</b> íons e produz o <b>dobro</b> do efeito. As propriedades coligativas não querem saber quem é o soluto: só contam <b>partículas</b> dissolvidas. Modelo de solução ideal e diluída, com dissociação total; a pressão osmótica toma 1 kg de água como 1 L de solução, o que só é boa aproximação para soluções diluídas. Constantes da água: Kf = 1,86 e Kb = 0,512 K·kg/mol.</div>`);
    const q = (x) => el.querySelector(x);
    [0, 1].forEach((k) => { liga(el, "s" + k, (v) => (st[k].s = v)); q(`[data-c=w${k}]`).addEventListener("input", (e) => (st[k].w = +e.target.value)); });
    SIM.qColigativas._ult = { poe: (k, s, w) => { st[k].s = s; st[k].w = w; }, est: (k) => SIM.colig(st[k].w, SIM.COLIG[st[k].s][1]) };
    anima(el, F, () => {
      const R0 = SIM.colig(0, 1), r = st.map((o) => SIM.colig(o.w, SIM.COLIG[o.s][1])), col = [R0, r[0], r[1]], nomes = ["água pura", n2(st[0].w, 2) + " mol de " + SIM.COLIG[st[0].s][0], n2(st[1].w, 2) + " mol de " + SIM.COLIG[st[1].s][0]], COR = ["var(--ink3)", "var(--mA)", "var(--bad)"];
      let h = "";
      col.forEach((c, k) => { const x = 40 + k * 215, np = Math.min(60, Math.round(c.np * 9));
        h += `<rect x="${x + 2}" y="62" width="126" height="76" style="fill:color-mix(in srgb,var(--mA) 14%,transparent)"/><path d="M${x} 40 L${x} 140 L${x + 130} 140 L${x + 130} 40" style="fill:none;stroke:var(--ink2);stroke-width:2.2"/>`;
        for (let j = 0; j < np; j++) h += `<circle cx="${x + 10 + ((j * 41 + 7) % 110)}" cy="${72 + ((j * 29 + 5) % 60)}" r="3.4" style="fill:${COR[k]}"/>`;
        h += D.txt(x + 65, 26, nomes[k], "tx2", "middle", `style="fill:${k ? COR[k] : "var(--ink)"};font-weight:700"`) + D.txt(x + 65, 158, k ? n2(c.np, 2) + " mol de partículas" : "sem soluto", "tx2");
        /* quatro barras: congelamento, ebulição, pressão de vapor, pressão osmótica */
        const linha = (y, rot, val, fr, cor) => D.txt(x, y, rot, "tx2", "start") + `<rect x="${x}" y="${y + 5}" width="130" height="7" rx="3" style="fill:var(--line2)"/><rect x="${x}" y="${y + 5}" width="${f1(Math.max(0, Math.min(1, fr)) * 130)}" height="7" rx="3" style="fill:${cor}"/>` + D.txt(x + 130, y, val, "tx2", "end", 'style="fill:var(--ink);font-weight:700"');
        h += linha(186, "congela a", n2(c.Tc, 2) + " °C", c.dTc / 23, "var(--mA)") + linha(222, "ferve a", n2(c.Te, 2) + " °C", c.dTe / 6.3, "var(--bad)") + linha(258, "pressão de vapor", n2(c.Pv, 2) + " mmHg", c.Pv / 23.8, "var(--ok)") + linha(294, "pressão osmótica", n2(c.pi, 1) + " atm", c.pi / 300, "var(--warn)"); });
      q("[data-v=sv]").innerHTML = h;
      const raz = r[0].np > 0 ? r[1].np / r[0].np : null;
      q("[data-v=lt]").innerHTML = vis("solução 1: i (íons por fórmula)", SIM.COLIG[st[0].s][1] + " (" + SIM.COLIG[st[0].s][2] + ")") + vis("solução 2: i", SIM.COLIG[st[1].s][1] + " (" + SIM.COLIG[st[1].s][2] + ")") + vis("partículas: solução 2 ÷ solução 1", raz === null ? "—" : n2(raz, 2)) + vis("abaixamento do congelamento: 2 ÷ 1", raz === null ? "—" : n2(r[1].dTc / r[0].dTc, 2));
      [0, 1].forEach((k) => (q(`[data-o=w${k}]`).textContent = n2(st[k].w, 2) + " mol/kg"));
    });
  };
})();
