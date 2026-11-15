/* Química D07 · Oxirredução e balanceamento redox. Conferido de dois jeitos:
   (1) NOX: o valor de cada item está DIGITADO na lista; a conferência em Python refaz pela regra da soma (carga total − soma dos outros) ÷ número de átomos;
   (2) COEFICIENTES: digitados (gabarito de livro) e calculados pelo site com SIM.balanceia; tests/tnucleo.js confere ainda que, com esses coeficientes,
       elétrons cedidos = recebidos em todas as 12 equações do laboratório (SIM.REDOX).
   Elétrons por unidade: Fe²⁺ → Fe³⁺ 1; Zn → Zn²⁺ 2; Al → Al³⁺ 3; MnO₄⁻ → Mn²⁺ 5; Cr₂O₇²⁻ → 2 Cr³⁺ 6; MnO₂ → Mn²⁺ 2; HNO₃ → NO 3; HNO₃ → NO₂ 1; Cl₂ → 2 Cl⁻ 2; H₂O₂ → 2 H₂O 2; O₂ → 2 O²⁻ 4.
   Nox médios: Fe₃O₄ +8/3; S₄O₆²⁻ +2,5; C em C₂H₆O −2; C em C₂H₄O₂ 0; S em Na₂S₂O₃ +2; C em C₂O₄²⁻ +3.
   Chefão (bafômetro): 2 K₂Cr₂O₇ + 3 C₂H₆O + 8 H₂SO₄ → 2 Cr₂(SO₄)₃ + 3 C₂H₄O₂ + 2 K₂SO₄ + 11 H₂O (SIM.balanceia: 2, 3, 8, 2, 3, 2, 11);
     elétrons: etanol perde 4 (2 C, de −2 a 0); dicromato ganha 6: 3 × 4 = 2 × 6 = 12; 0,294 g de K₂Cr₂O₇ (294 g/mol) = 1,00·10⁻³ mol: oxida 1,50·10⁻³ mol = 0,069 g de etanol.
   H₂O₂ + MnO₄⁻ + H⁺ → O₂ + Mn²⁺ + H₂O: só com átomos e carga há infinitas soluções (SIM.balanceia devolve null); os elétrons fixam 5, 2, 6, 5, 2, 8. */
F.registrar("quimica/D07", {
  retoma: ["D05", "D02", "C02", "B07"],
  html(F) {
    const R = String.raw, q = SIM.dq, sf = SIM.subFormula, ce = SIM.ce, vg = SIM.vg;
    const fig = (conteudo, h = 150) => D.svg(560, h, conteudo, "figura");
    const sinal = (v) => (v > 0 ? "+" + vg(v, 2) : v < 0 ? "−" + vg(-v, 2) : "0");
    const eqf = (r, p, sub = "") => fig(q.eq(280, 58, r.join(" + ") + " -> " + p.join(" + ")) + (sub ? D.txt(280, 96, sub, "tx2") : ""), sub ? 118 : 100);
    const rot = (f, sub) => fig(q.rotulo(170, 30, 220, [sf(f), sub]), 110);
    /* nox fixos usados na regra da soma (só para os OUTROS elementos da fórmula) */
    const FIXO = { H: 1, O: -2, F: -1, Na: 1, K: 1, Li: 1, Ca: 2, Mg: 2, Ba: 2, Al: 3 };
    /* [fórmula, elemento pedido, nox digitado, nome] */
    const NOXC = [["KMnO4", "Mn", 7, "permanganato de potássio"], ["K2Cr2O7", "Cr", 6, "dicromato de potássio"], ["H2SO4", "S", 6, "ácido sulfúrico"], ["HNO3", "N", 5, "ácido nítrico"], ["NH3", "N", -3, "amônia"], ["Na2SO3", "S", 4, "sulfito de sódio"], ["KClO3", "Cl", 5, "clorato de potássio"], ["CaCO3", "C", 4, "carbonato de cálcio"], ["MnO2", "Mn", 4, "dióxido de manganês"], ["H3PO4", "P", 5, "ácido fosfórico"], ["NaClO", "Cl", 1, "hipoclorito de sódio"], ["HClO4", "Cl", 7, "ácido perclórico"], ["CH4", "C", -4, "metano"], ["CO", "C", 2, "monóxido de carbono"], ["Fe2O3", "Fe", 3, "óxido de ferro(III)"], ["H2S", "S", -2, "sulfeto de hidrogênio"], ["CO2", "C", 4, "dióxido de carbono"], ["SO2", "S", 4, "dióxido de enxofre"]];
    const NOXI = [["SO4^2-", "S", 6, "sulfato"], ["NO3^-", "N", 5, "nitrato"], ["NH4^+", "N", -3, "amônio"], ["MnO4^-", "Mn", 7, "permanganato"], ["Cr2O7^2-", "Cr", 6, "dicromato"], ["CO3^2-", "C", 4, "carbonato"], ["PO4^3-", "P", 5, "fosfato"], ["ClO3^-", "Cl", 5, "clorato"], ["NO2^-", "N", 3, "nitrito"], ["SO3^2-", "S", 4, "sulfito"], ["ClO^-", "Cl", 1, "hipoclorito"]];
    const NOXE = [["H2O2", "O", -1, "água oxigenada: é um peróxido"], ["NaH", "H", -1, "hidreto de sódio: aqui o H é o mais eletronegativo"], ["OF2", "O", 2, "o flúor é mais eletronegativo que o oxigênio"], ["Na2O2", "O", -1, "peróxido de sódio"], ["CaH2", "H", -1, "hidreto de cálcio"], ["O2", "O", 0, "substância simples"], ["Fe", "Fe", 0, "substância simples"], ["Cl2", "Cl", 0, "substância simples"]];
    const NOXM = [["Fe3O4", "Fe", 8 / 3, "magnetita"], ["S4O6^2-", "S", 2.5, "tetrationato"], ["C2H6O", "C", -2, "etanol"], ["C2H4O2", "C", 0, "ácido acético"], ["Na2S2O3", "S", 2, "tiossulfato de sódio"], ["C2O4^2-", "C", 3, "oxalato"], ["C3H8", "C", -8 / 3, "propano"], ["N2O", "N", 1, "óxido nitroso"]];
    const pyNox = (f, el) => { const a = SIM.atomos(f), carga = a["±"] || 0; const outros = Object.keys(a).filter((k) => k !== el && k !== "±"); const fx = Object.assign({}, FIXO, el === "O" ? {} : {}, el === "H" ? {} : {}); return `(${carga} - (${outros.map((k) => a[k] + "*" + (fx[k] === undefined ? "0" : "(" + fx[k] + ")")).join(" + ") || "0"})) / ${a[el]}`; };
    const contaNox = (f, el) => { const a = SIM.atomos(f), carga = a["±"] || 0, outros = Object.keys(a).filter((k) => k !== el && k !== "±"); return { a, carga, outros, soma: outros.reduce((t, k) => t + a[k] * FIXO[k], 0) }; };
    const solNox = (f, el, v) => { const c = contaNox(f, el); return c.outros.length ? R`<p>Soma dos nox = ${c.carga === 0 ? "0 (espécie neutra)" : "carga do íon, " + sinal(c.carga)}. Conhecidos: ${c.outros.map((k) => k + " " + sinal(FIXO[k]) + (c.a[k] > 1 ? " (× " + c.a[k] + ")" : "")).join("; ")}, somando ${sinal(c.soma)}. Então $${c.a[el] > 1 ? c.a[el] : ""}x ${c.soma >= 0 ? "+" : "-"} ${Math.abs(c.soma)} = ${c.carga}$, e $x = ${F.n(v, 2)}$.</p>` : R`<p>Substância simples: nox zero, por definição (os átomos são iguais; ninguém puxa mais os elétrons).</p>`; };
    /* variações de nox: [de, para, e⁻ por unidade, descrição, tipo] */
    const VAR = [["Fe^2+", "Fe^3+", 1, "oxida"], ["Zn", "Zn^2+", 2, "oxida"], ["Al", "Al^3+", 3, "oxida"], ["Cu", "Cu^2+", 2, "oxida"], ["Sn^2+", "Sn^4+", 2, "oxida"], ["Cu^2+", "Cu", 2, "reduz"], ["Ag^+", "Ag", 1, "reduz"], ["Fe^3+", "Fe^2+", 1, "reduz"]];
    /* agentes oxidantes: [espécie, vira, e⁻ recebidos por unidade, explicação] */
    const OXID = [["MnO4^-", "Mn^2+", 5, "Mn: +7 → +2"], ["Cr2O7^2-", "Cr^3+", 6, "Cr: +6 → +3, dois átomos"], ["MnO2", "Mn^2+", 2, "Mn: +4 → +2"], ["Cl2", "Cl^-", 2, "Cl: 0 → −1, dois átomos"], ["O2", "H2O", 4, "O: 0 → −2, dois átomos"], ["H2O2", "H2O", 2, "O: −1 → −2, dois átomos"]];
    /* equações do laboratório, com o gabarito digitado e quem é quem */
    const G = [[1, 1, 1, 1], [1, 2, 1, 2], [2, 6, 2, 3], [1, 3, 2, 3], [4, 5, 4, 6], [1, 4, 1, 1, 2], [1, 5, 8, 1, 5, 4], [1, 6, 14, 2, 6, 7], [3, 8, 3, 2, 4], [2, 16, 2, 2, 5, 8], [2, 5, 16, 2, 10, 8], [3, 6, 5, 1, 3]];
    const RD = SIM.REDOX.map((e, i) => Object.assign({ g: G[i], s: e.r.concat(e.p), c: SIM.balanceia(e.r, e.p) }, e));
    /* agente oxidante e redutor (reagentes) de cada equação, na ordem de RD */
    const AG = [["Cu^2+", "Zn"], ["Ag^+", "Cu"], ["H^+", "Al"], ["Fe2O3", "CO"], ["O2", "NH3"], ["MnO2", "HCl"], ["MnO4^-", "Fe^2+"], ["Cr2O7^2-", "Fe^2+"], ["HNO3", "Cu"], ["KMnO4", "HCl"], ["MnO4^-", "C2O4^2-"], ["Cl2", "Cl2"]];
    const tex = (e, c) => SIM.eqTex(e.r, e.p, c);
    const NREDOX = [[["HCl", "NaOH"], ["NaCl", "H2O"]], [["AgNO3", "NaCl"], ["AgCl", "NaNO3"]], [["CaCO3"], ["CaO", "CO2"]], [["BaCl2", "Na2SO4"], ["BaSO4", "NaCl"]], [["H2SO4", "KOH"], ["K2SO4", "H2O"]], [["CaO", "H2O"], ["Ca(OH)2"]], [["Na2CO3", "HCl"], ["NaCl", "H2O", "CO2"]]];
    const SIMRED = [[["Zn", "HCl"], ["ZnCl2", "H2"]], [["Fe", "O2"], ["Fe2O3"]], [["Cu", "AgNO3"], ["Cu(NO3)2", "Ag"]], [["CH4", "O2"], ["CO2", "H2O"]], [["H2O2"], ["H2O", "O2"]], [["Na", "Cl2"], ["NaCl"]], [["Mg", "O2"], ["MgO"]]];

    const exemplos = F.exemplo({
      titulo: "Nox, elétrons e coeficientes",
      casos: [
        { nome: "Fácil: qual é o nox?", gerar: (p) => { const n = SIM.pega(NOXC.concat(NOXI), p, 0), c = contaNox(n[0], n[1]);
          return { enun: R`<p>Qual é o número de oxidação do ${n[1]} em $${ce(n[0])}$ (${n[3]})?</p>`, fig: rot(n[0], "nox do " + n[1] + "?"),
            passos: [R`<p>(i) Regra-mestra: a soma dos nox de todos os átomos é igual à carga da espécie: ${c.carga === 0 ? "zero, porque é neutra" : sinal(c.carga)}.</p>`,
              R`<p>(ii) Nox que você já sabe: ${c.outros.map((k) => k + " = " + sinal(FIXO[k])).join("; ")}.</p>`,
              R`<p>(iii) Equação: $${c.a[n[1]] > 1 ? c.a[n[1]] : ""}x + ${c.outros.map((k) => (c.a[k] > 1 ? c.a[k] + R`\cdot` : "") + "(" + (FIXO[k] > 0 ? "+" : "") + FIXO[k] + ")").join(" + ")} = ${c.carga}$.</p>`,
              R`<p>(iv) $${c.a[n[1]] > 1 ? c.a[n[1]] : ""}x = ${c.carga - c.soma}$, logo $x = ${sinal(n[2]).replace("−", "-")}$. Nox do ${n[1]}: <b>${sinal(n[2])}</b>.</p>`] }; } },
        { nome: "Médio: quem oxida, quem reduz?", gerar: (p) => { const i = p ? 6 : F.sorteio(0, 10), e = RD[i];
          return { enun: R`<p>Na reação $${tex(e, e.c)}$, identifique o agente oxidante, o agente redutor e quantos elétrons são transferidos, com os coeficientes escritos.</p>`, fig: eqf(e.r, e.p),
            passos: [R`<p>(i) Ache os nox que <b>mudam</b>. ${e.ox[2]} e ${e.red[2]}.</p>`,
              R`<p>(ii) Quem <b>aumenta</b> o nox perde elétrons: sofre <b>oxidação</b>. Quem diminui ganha elétrons: sofre <b>redução</b>.</p>`,
              R`<p>(iii) Os nomes vão trocados: o reagente que se oxida é o agente <b>redutor</b> ($${ce(AG[i][1])}$, ele provoca a redução do outro); o que se reduz é o agente <b>oxidante</b> ($${ce(AG[i][0])}$).</p>`,
              R`<p>(iv) Elétrons cedidos: $${e.c[e.ox[0]]}\cdot${e.ox[1]} = ${e.c[e.ox[0]] * e.ox[1]}$. Recebidos: $${e.c[e.red[0]]}\cdot${e.red[1]} = ${e.c[e.red[0]] * e.red[1]}$. Iguais, como tem de ser.</p>`] }; } },
        { nome: "Olimpíada: balancear pelos elétrons", gerar: (p) => { const i = p ? 9 : F.escolha([5, 6, 7, 8, 9, 10]), e = RD[i], m = (e.ox[1] * e.red[1]) / SIM.mdc(e.ox[1], e.red[1]);
          return { enun: R`<p>Balanceie pelo método da oxirredução: $${tex(e, null)}$.</p>`, fig: eqf(e.r, e.p, "(não balanceada)"),
            passos: [R`<p>(i) Nox que mudam: ${e.ox[2]} (oxidação) e ${e.red[2]} (redução).</p>`,
              R`<p>(ii) Elétrons por unidade: $${ce(e.s[e.ox[0]])}$ corresponde a ${e.ox[1]} elétron${e.ox[1] > 1 ? "s" : ""} cedido${e.ox[1] > 1 ? "s" : ""}; $${ce(e.s[e.red[0]])}$, a ${e.red[1]} recebido${e.red[1] > 1 ? "s" : ""}.</p>`,
              R`<p>(iii) Iguale: menor múltiplo comum de ${e.ox[1]} e ${e.red[1]} é ${m}. Coeficientes: ${m / e.ox[1]} para $${ce(e.s[e.ox[0]])}$ e ${m / e.red[1]} para $${ce(e.s[e.red[0]])}$${e.c[e.ox[0]] !== m / e.ox[1] ? " (no fim, tudo é multiplicado por " + e.c[e.ox[0]] / (m / e.ox[1]) + " para acertar os outros átomos com inteiros)" : ""}.</p>`,
              R`<p>(iv) Acerte o resto por tentativa, deixando H e O por último: $${tex(e, e.c)}$. Conferência dos elétrons: $${e.c[e.ox[0]]}\cdot${e.ox[1]} = ${e.c[e.red[0]]}\cdot${e.red[1]} = ${e.c[e.ox[0]] * e.ox[1]}$.</p>`] }; } },
      ],
    });

    const chefao = F.chefao({
      titulo: "A química do bafômetro",
      enun: R`<p>Nos bafômetros descartáveis antigos, o ar soprado passava por cristais alaranjados de dicromato de potássio em meio ácido. Havendo etanol, eles ficavam verdes: $\ce{K2Cr2O7 + C2H6O + H2SO4 -> Cr2(SO4)3 + C2H4O2 + K2SO4 + H2O}$ (não balanceada; $\ce{C2H4O2}$ é o ácido acético). (Massas atômicas: H = 1; C = 12; O = 16; K = 39; Cr = 52.) (a) Qual o nox do crômio antes e depois? (b) Qual o nox <b>médio</b> do carbono no etanol e no ácido acético? (c) Quantos elétrons cada molécula de etanol cede? Quantos cada fórmula de dicromato recebe? (d) Em que proporção em mol etanol e dicromato reagem? (e) Balanceie a equação completa. (f) Quem é o agente oxidante e quem é o redutor? Que íon é responsável pela cor verde? (g) Que massa de etanol é oxidada por 0,294 g de dicromato de potássio? (h) A reação $\ce{H2O2 + MnO4- + H+ -> O2 + Mn^2+ + H2O}$ pode ser "balanceada" de infinitas maneiras se você só contar átomos e cargas (por exemplo, 1, 2, 6, 3, 2, 4 e 5, 2, 6, 5, 2, 8 fecham as duas contagens). Qual é a certa, e por quê?</p>`,
      fig: fig(q.rotulo(50, 34, 190, ["antes: alaranjado", "K₂Cr₂O₇"]) + D.seta(255, 64, 305, 64, "var(--ink2)") + D.txt(280, 52, "etanol", "tx2") + q.rotulo(320, 34, 190, ["depois: verde", "Cr₂(SO₄)₃"]), 110),
      dicas: [R`<p>(b) No etanol: $2x + 6\cdot(+1) + (-2) = 0$.</p>`, R`<p>(d) Elétrons cedidos = recebidos: mínimo múltiplo comum de 4 e 6.</p>`, R`<p>(h) Na água oxigenada, o oxigênio (−1) vai a $\ce{O2}$ (0): 2 elétrons por molécula. O manganês recebe 5.</p>`],
      sol: R`<p><b>(a)</b> No $\ce{K2Cr2O7}$: $2(+1) + 2x + 7(-2) = 0$, $x = +6$. No $\ce{Cr2(SO4)3}$: $+3$.</p>
        <p><b>(b)</b> Etanol: $2x + 6 - 2 = 0$, $x = -2$. Ácido acético: $2x + 4 - 4 = 0$, $x = 0$.</p>
        <p><b>(c)</b> Etanol: 2 carbonos, cada um de −2 a 0: cede $2\cdot2 = 4$ elétrons. Dicromato: 2 crômios, cada um de +6 a +3: recebe $2\cdot3 = 6$.</p>
        <p><b>(d)</b> MMC de 4 e 6: 12 elétrons. 3 etanóis ($3\cdot4$) para 2 dicromatos ($2\cdot6$).</p>
        <p><b>(e)</b> $\ce{2 K2Cr2O7 + 3 C2H6O + 8 H2SO4 -> 2 Cr2(SO4)3 + 3 C2H4O2 + 2 K2SO4 + 11 H2O}$. Conferência: K 4 = 4; Cr 4 = 4; S 8 = 6 + 2; C 6 = 6; H 18 + 16 = 12 + 22; O 14 + 3 + 32 = 24 + 6 + 8 + 11.</p>
        <p><b>(f)</b> Oxidante: o dicromato de potássio (o crômio se reduz). Redutor: o etanol (o carbono se oxida). A cor verde é do íon $\ce{Cr^3+}$.</p>
        <p><b>(g)</b> $\frac{0{,}294}{294} = 1{,}00\cdot10^{-3}$ mol de dicromato. Etanol: $1{,}00\cdot10^{-3}\cdot\frac32 = 1{,}50\cdot10^{-3}$ mol $= 1{,}50\cdot10^{-3}\cdot46 = 0{,}069$ g.</p>
        <p><b>(h)</b> A certa é $\ce{5 H2O2 + 2 MnO4- + 6 H+ -> 5 O2 + 2 Mn^2+ + 8 H2O}$: elétrons cedidos $5\cdot2 = 10$; recebidos $2\cdot5 = 10$. Na outra, 1 $\ce{H2O2}$ cederia 2 elétrons e 2 $\ce{MnO4-}$ receberiam 10: os elétrons não fecham (o oxigênio a mais viria do permanganato, o que não acontece). Átomos e carga são condições <b>necessárias</b>; em oxirredução, só o balanço de elétrons diz qual reação é a real. Coeficientes conferidos pelo balanceador do site.</p>`,
    });

    const exNox = (n, nivel, pool, i0, dica) => F.exercicio({ n, nivel, gerar: (p) => { const x = SIM.pega(pool, p, i0);
      return { enun: R`<p>Qual é o número de oxidação${pool === NOXM ? " <b>médio</b>" : ""} do ${x[1]} em $${ce(x[0])}$${x[3] && pool !== NOXE ? " (" + x[3] + ")" : ""}? (Dê com sinal; fração em decimal.)</p>`, fig: rot(x[0], "nox do " + x[1] + "?"), num: { v: x[2], tol: 0.01, abs: 0.01, un: "" }, py: pyNox(x[0], x[1]), dicas: [dica, R`<p>A soma dos nox é igual à carga total da espécie.</p>`], resp: sinal(x[2]) + " (nox do " + x[1] + ")", sol: solNox(x[0], x[1], x[2]) + (pool === NOXE ? R`<p>Atenção: ${x[3]}.</p>` : "") }; } });

    const exs = [
      exNox(1, "Físico", NOXC, 0, R`<p>H vale +1 e O vale −2 (fora as exceções); metais alcalinos, +1.</p>`),
      exNox(2, "Físico", NOXI, 0, R`<p>Num íon, a soma dos nox não é zero: é a carga do íon.</p>`),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Numa reação de oxirredução, a espécie que <b>perde elétrons</b>:</p>`, fig: fig(D.txt(280, 55, "Zn → Zn²⁺ + 2 e⁻", "tx", "middle", 'style="font-size:17px;font-weight:700"') + D.txt(280, 92, "nox do zinco: 0 → +2", "tx2"), 115), alts: ["sofre redução e é o agente oxidante.", "sofre oxidação e é o agente redutor.", "sofre oxidação e é o agente oxidante.", "sofre redução e é o agente redutor.", "não muda de nox."], certa: "B", dicas: [R`<p>Perder elétrons (negativos) faz o nox subir. E quem perde elétrons os entrega a alguém.</p>`], resp: "B", sol: R`<p>Perde elétrons: o nox aumenta: <b>oxidação</b>. Ao ceder os elétrons, ela provoca a redução da outra espécie: é o agente <b>redutor</b>.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", gerar: (p) => { const i = p ? 0 : F.sorteio(0, 4), e = RD[i], a = SIM.alt5(ce(AG[i][0]), e.s.map(ce), p);
        return { enun: R`<p>Na reação $${tex(e, e.c)}$, qual é o agente <b>oxidante</b>?</p>`, fig: eqf(e.r, e.p), alts: a.alts.map((x) => "$" + x + "$"), certa: a.certa, dicas: [R`<p>Oxidante é o <b>reagente</b> que se reduz (ganha elétrons; nox diminui).</p>`], resp: a.certa, sol: R`<p>${e.red[2]}: o nox diminui. A espécie reagente que contém esse elemento, $${ce(AG[i][0])}$, é o agente oxidante. (Agentes são sempre reagentes, nunca produtos.)</p>` }; } }),
      F.exercicio({ n: 5, nivel: "Físico", gerar: (p) => { const v = SIM.pega(VAR, p, 2);
        return { enun: R`<p>Na transformação $${ce(v[0])} \to ${ce(v[1])}$, quantos elétrons cada átomo ${v[3] === "oxida" ? "perde" : "ganha"}?</p>`, fig: fig(q.eq(280, 60, v[0] + " -> " + v[1]), 100), num: { v: v[2], tol: 0.001, un: "elétrons" }, py: `abs(${SIM.atomos(v[1])["±"] || 0} - (${SIM.atomos(v[0])["±"] || 0}))`, dicas: [R`<p>É a variação do nox, em módulo.</p>`], resp: v[2] + " elétron" + (v[2] > 1 ? "s" : ""), sol: R`<p>Nox de ${sinal(SIM.atomos(v[0])["±"] || 0)} para ${sinal(SIM.atomos(v[1])["±"] || 0)}: variação de ${v[2]}. ${v[3] === "oxida" ? "O nox subiu: oxidação, perda" : "O nox desceu: redução, ganho"} de ${v[2]} elétron${v[2] > 1 ? "s" : ""}.</p>` }; } }),
      F.exercicio({ n: 6, nivel: "Físico", gerar: (p) => { const s = SIM.pega(SIMRED, p, 0), nao = (p ? NREDOX : SIM.emb(NREDOX)).slice(0, 4), t = (x) => SIM.eqTex(x[0], x[1], SIM.balanceia(x[0], x[1])), a = SIM.alt5(t(s), nao.map(t), p);
        return { enun: R`<p>Qual das reações é de <b>oxirredução</b>?</p>`, fig: fig(D.txt(280, 55, "nox muda?", "tx", "middle", 'style="font-size:20px;font-weight:700"') + D.txt(280, 88, "em qual delas algum átomo muda de nox?", "tx2"), 110), alts: a.alts.map((x) => "$" + x + "$"), certa: a.certa, dicas: [R`<p>Substância simples (nox zero) que vira composto, ou o contrário: o nox mudou com certeza.</p>`], resp: a.certa, sol: R`<p>$${t(s)}$: há substância simples de um lado e o mesmo elemento combinado do outro. Nas demais (neutralizações, precipitações, decomposição de carbonato), nenhum nox muda.</p>` }; } }),
      exNox(7, "Físico", NOXE, 0, R`<p>Cuidado com as exceções: peróxidos, hidretos metálicos, substâncias simples.</p>`),
      F.exercicio({ n: 8, nivel: "Físico", gerar: (p) => { const i = p ? 1 : F.escolha([0, 1, 2]), e = RD[i], v = e.c[e.ox[0]] * e.ox[1];
        return { enun: R`<p>Na equação balanceada $${tex(e, e.c)}$, quantos elétrons são transferidos no total (com os coeficientes escritos)?</p>`, fig: eqf(e.r, e.p), num: { v, tol: 0.001, un: "elétrons" }, py: `${e.g[e.ox[0]]} * ${e.ox[1]}`, dicas: [R`<p>Elétrons por átomo que oxida × número de átomos (o coeficiente).</p>`], resp: v + " elétrons", sol: R`<p>${e.ox[2]}: ${e.ox[1]} por unidade, vezes ${e.c[e.ox[0]]}: ${v} cedidos. Conferência pelo outro lado: $${e.c[e.red[0]]}\cdot${e.red[1]} = ${e.c[e.red[0]] * e.red[1]}$ recebidos.</p>` }; } }),
      F.exercicio({ n: 9, nivel: "Máximo", gerar: (p) => { const i = p ? 6 : F.sorteio(3, 10), e = RD[i], j = e.ox[0] < e.r.length ? e.ox[0] : 1;
        return { enun: R`<p>Balanceie pelo método redox, com os menores inteiros: $${tex(e, null)}$. Qual é o coeficiente de $${ce(e.s[j])}$?</p>`, fig: eqf(e.r, e.p, "(não balanceada)"), num: { v: e.c[j], tol: 0.001, un: "" }, py: String(e.g[j]), dicas: [R`<p>${e.ox[2]}; ${e.red[2]}.</p>`, R`<p>Iguale os elétrons cedidos e recebidos antes de mexer no resto.</p>`], resp: e.c[j] + " (coeficiente pedido)", sol: R`<p>$${tex(e, e.c)}$. Elétrons: $${e.c[e.ox[0]]}\cdot${e.ox[1]} = ${e.c[e.red[0]]}\cdot${e.red[1]}$.</p>` }; } }),
      F.exercicio({ n: 10, nivel: "Máximo", gerar: (p) => { const i = p ? 5 : F.sorteio(3, 11), e = RD[i], s = e.c.reduce((a, b) => a + b, 0);
        return { enun: R`<p>Balanceie com os menores inteiros e dê a <b>soma</b> dos coeficientes: $${tex(e, null)}$.</p>`, fig: eqf(e.r, e.p, "(não balanceada)"), num: { v: s, tol: 0.001, un: "" }, py: e.g.join(" + "), dicas: [R`<p>${e.ox[2]}; ${e.red[2]}.</p>`, R`<p>Depois dos elétrons: outros átomos, carga (se for iônica), hidrogênio e oxigênio.</p>`], resp: s + " (soma dos coeficientes)", sol: R`<p>$${tex(e, e.c)}$: soma ${s}.</p>` }; } }),
      F.exercicio({ n: 11, nivel: "Máximo", gerar: (p) => { const o = SIM.pega(OXID, p, 0);
        return { enun: R`<p>Quantos mols de elétrons 1 mol de $${ce(o[0])}$ recebe ao se transformar em $${ce(o[1])}$?</p>`, fig: fig(q.eq(280, 60, o[0] + " -> " + o[1]) + D.txt(280, 98, "(só a espécie que se reduz)", "tx2"), 118), num: { v: o[2], tol: 0.001, un: "mol de elétrons" }, py: String(o[2]), dicas: [R`<p>Variação do nox × número de átomos que mudam em cada fórmula.</p>`], resp: o[2] + " mol de elétrons", sol: R`<p>${o[3]}: ${o[2]} elétrons por unidade, isto é, ${o[2]} mol de elétrons por mol.</p>` }; } }),
      F.exercicio({ n: 12, nivel: "Máximo", gerar: (p) => { const i = p ? 9 : F.sorteio(3, 10), e = RD[i], a = SIM.alt5(ce(AG[i][1]), e.s.map(ce), p);
        return { enun: R`<p>Na reação $${tex(e, e.c)}$, qual é o agente <b>redutor</b>?</p>`, fig: eqf(e.r, e.p), alts: a.alts.map((x) => "$" + x + "$"), certa: a.certa, dicas: [R`<p>Redutor é o reagente que se <b>oxida</b>.</p>`], resp: a.certa, sol: R`<p>${e.ox[2]}: oxidação. O reagente que contém esse elemento, $${ce(AG[i][1])}$, é o agente redutor.</p>` }; } }),
      exNox(13, "Máximo", NOXM, 0, R`<p>Quando há mais de um átomo do elemento, a conta dá a <b>média</b>, que pode ser fracionária.</p>`),
      F.exercicio({ n: 14, nivel: "Máximo", gerar: (p) => { const i = p ? 7 : F.escolha([6, 7, 10]), e = RD[i], j = e.s.indexOf("H^+");
        return { enun: R`<p>Balanceie a equação iônica em meio ácido, com os menores inteiros: $${tex(e, null)}$. Qual é o coeficiente do $\ce{H+}$?</p>`, fig: eqf(e.r, e.p, "(não balanceada)"), num: { v: e.c[j], tol: 0.001, un: "" }, py: String(e.g[j]), dicas: [R`<p>Primeiro os elétrons; depois o oxigênio com $\ce{H2O}$; depois o hidrogênio com $\ce{H+}$.</p>`, R`<p>Confira a carga total dos dois lados.</p>`], resp: e.c[j] + " (coeficiente do H⁺)", sol: R`<p>$${tex(e, e.c)}$. Carga: ${SIM.confere(e.r, e.p, e.c)["±"][0]}+ de cada lado.</p>` }; } }),
      F.exercicio({ n: 15, nivel: "Máximo", gerar: (p) => { const i = p ? 6 : F.escolha([6, 7]), e = RD[i], n = p ? 0.02 : F.escolha([0.01, 0.02, 0.05, 0.1, 0.25]), v = (n * e.c[1]) / e.c[0];
        return { enun: R`<p>Em meio ácido, $${tex(e, e.c)}$. Quantos mols de $\ce{Fe^2+}$ são oxidados por ${vg(n, 2)} mol de $${ce(e.r[0])}$?</p>`, fig: eqf(e.r, e.p), num: { v, tol: 0.01, un: "mol" }, py: `${n} * ${e.red[1]} / ${e.ox[1]}`, dicas: [R`<p>Proporção dos coeficientes, que é a proporção dos elétrons.</p>`], resp: vg(v, 3) + " mol", sol: R`<p>Cada $${ce(e.r[0])}$ recebe ${e.red[1]} elétrons; cada $\ce{Fe^2+}$ cede 1: proporção 1 : ${e.red[1]}. $${F.n(n, 2)}\cdot${e.red[1]} = ${F.n(v, 3)}$ mol.</p>` }; } }),
      F.exercicio({ n: 16, nivel: "Máximo", enun: R`<p>Na reação $\ce{3 Cl2 + 6 OH- -> 5 Cl- + ClO3- + 3 H2O}$, o cloro:</p>`, fig: eqf(["Cl2", "OH^-"], ["Cl^-", "ClO3^-", "H2O"]), alts: ["só se oxida.", "só se reduz.", "se oxida e se reduz ao mesmo tempo: é agente oxidante e redutor (desproporcionamento).", "não muda de nox.", "é oxidado pelo oxigênio do hidróxido."], certa: "C", dicas: [R`<p>Nox do cloro: 0 no $\ce{Cl2}$; −1 no $\ce{Cl-}$; +5 no $\ce{ClO3-}$.</p>`], resp: "C", sol: R`<p>De 0 para −1 (redução, 5 átomos, 5 elétrons recebidos) e de 0 para +5 (oxidação, 1 átomo, 5 elétrons cedidos). A mesma substância faz os dois papéis: auto-oxirredução, ou desproporcionamento.</p>` }),
    ];

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Reações e estequiometria · elétrons que mudam de dono</div>
        <div class="q">Um prego enferruja, uma pilha acende uma lanterna, uma maçã cortada escurece, a água sanitária tira a mancha, o seu corpo queima açúcar. O que essas cinco coisas têm em comum?</div>
        <p>Em todas, elétrons saem de uma espécie e vão para outra. São reações de oxirredução, a maior família de reações que existe. Para acompanhá-las, os químicos inventaram uma contabilidade, o número de oxidação, e com ela um jeito de balancear as equações mais teimosas: igualando os elétrons.</p></div>
        ${F.chute({ q: "na reação Zn + Cu²⁺ → Zn²⁺ + Cu, quem é o agente oxidante?", ops: ["O zinco, porque ele se oxida.", "O íon Cu²⁺, porque ele recebe os elétrons e se reduz.", "O cobre metálico formado.", "Não há: nenhum oxigênio participa."], certa: 1, exp: "O zinco perde elétrons (oxida-se): ele é o agente redutor. Quem tira os elétrons dele é o Cu²⁺, que se reduz: esse é o agente oxidante. Os nomes parecem trocados porque descrevem o que cada um faz com o OUTRO. E 'oxidação' já não exige oxigênio: é perda de elétrons." })}`),

      F.secao("nox", "Número de oxidação", R`
        <p>O <b>número de oxidação</b> (nox) é a carga que o átomo teria se todos os elétrons de cada ligação fossem entregues ao átomo <b>mais eletronegativo</b> ${F.ret("B07")}. Em íons simples é a carga real; em moléculas é uma carga de faz de conta, útil para rastrear elétrons. (A carga formal ${F.ret("C02")} é outra contabilidade: lá o par era dividido meio a meio.)</p>
        <table class="tb"><tr><th>Regra</th><th>Nox</th><th>Exemplos e exceções</th></tr>
          <tr><td>substância simples</td><td>0</td><td>$\ce{O2}$, $\ce{Fe}$, $\ce{Cl2}$, $\ce{S8}$</td></tr>
          <tr><td>íon de um só átomo</td><td>a carga</td><td>$\ce{Na+}$: +1; $\ce{Fe^3+}$: +3; $\ce{Cl-}$: −1</td></tr>
          <tr><td>metais alcalinos; alcalinoterrosos; alumínio</td><td>+1; +2; +3</td><td>sempre, em compostos</td></tr>
          <tr><td>flúor</td><td>−1</td><td>sempre, em compostos</td></tr>
          <tr><td>hidrogênio</td><td>+1</td><td>exceção: −1 nos hidretos metálicos ($\ce{NaH}$)</td></tr>
          <tr><td>oxigênio</td><td>−2</td><td>exceções: −1 nos peróxidos ($\ce{H2O2}$); +2 no $\ce{OF2}$</td></tr>
          <tr><td><b>soma de todos</b></td><td>carga da espécie</td><td>zero em molécula ou composto neutro; a carga, em íon</td></tr></table>
        <h3>Teorema 1: o nox que falta sai da regra da soma</h3>
        ${F.demo("permanganato e dicromato", R`<p>(i) A soma dos nox de todos os átomos é a carga total da espécie.</p>
          <p>(ii) $\ce{KMnO4}$, neutro: K vale +1 e cada O vale −2. $(+1) + x + 4\cdot(-2) = 0$, logo $x = +7$.</p>
          <p>(iii) $\ce{Cr2O7^2-}$, carga 2−: $2x + 7\cdot(-2) = -2$, logo $2x = +12$ e $x = +6$.</p>
          <p>(iv) $\ce{NH4+}$: $x + 4\cdot(+1) = +1$, logo $x = -3$.</p>
          <p>(v) Quando o elemento aparece mais de uma vez, a conta dá a <b>média</b>, que pode ser fracionária: no $\ce{Fe3O4}$, $3x - 8 = 0$, $x = +\frac83$ (são dois ferros +3 e um +2).</p>`)}
        ${F.formula(R`\sum (\text{nox de cada átomo}) = \text{carga total da espécie}`, "Regra da soma dos nox")}`),

      F.secao("redox", "Oxidação e redução", R`
        <table class="tb"><tr><th></th><th>Oxidação</th><th>Redução</th></tr>
          <tr><td>elétrons</td><td>perde</td><td>ganha</td></tr><tr><td>nox</td><td>aumenta</td><td>diminui</td></tr>
          <tr><td>a espécie é o agente</td><td><b>redutor</b></td><td><b>oxidante</b></td></tr></table>
        <p>As duas sempre acontecem juntas: elétron que sai de um lugar entra em outro. O agente <b>redutor</b> é o reagente que se oxida (ele reduz o outro); o agente <b>oxidante</b> é o que se reduz. Uma reação é de oxirredução quando algum nox muda; neutralizações e precipitações ${F.ret("D02")} não são.</p>
        ${F.fig(fig(q.eq(280, 40, "Zn + Cu^2+ -> Zn^2+ + Cu") + D.txt(185, 78, "0", "tx2") + D.txt(248, 78, "+2", "tx2") + D.txt(322, 78, "+2", "tx2") + D.txt(388, 78, "0", "tx2") + `<path d="M185 88 Q254 122 322 88" style="fill:none;stroke:var(--mA);stroke-width:1.6"/><path d="M248 88 Q318 132 388 88" style="fill:none;stroke:var(--bad);stroke-width:1.6"/>` + D.txt(215, 122, "oxidação: perde 2 e⁻", "tx2", "middle", 'style="fill:var(--mA)"') + D.txt(360, 136, "redução: ganha 2 e⁻", "tx2", "middle", 'style="fill:var(--bad)"'), 150), "O zinco cede dois elétrons ao íon cobre(II). Zn: agente redutor. Cu²⁺: agente oxidante.")}
        <h3>Teorema 2: elétrons cedidos = elétrons recebidos</h3>
        ${F.demo("o método redox de balanceamento", R`<p>(i) Elétrons não ficam soltos na solução: todos os que uma espécie cede, outra recebe. Essa igualdade fixa a proporção entre o oxidante e o redutor.</p>
          <p>(ii) Exemplo: $\ce{KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O}$. Nox que mudam: Mn, de +7 a +2 (recebe 5); Cl, de −1 a 0 (cede 1 por átomo; 2 por $\ce{Cl2}$ formado).</p>
          <p>(iii) Iguale: MMC de 5 e 2 é 10. São 2 $\ce{KMnO4}$ ($2\cdot5 = 10$ recebidos) e 5 $\ce{Cl2}$ ($5\cdot2 = 10$ cedidos).</p>
          <p>(iv) O resto sai por contagem: 2 K: 2 $\ce{KCl}$. 2 Mn: 2 $\ce{MnCl2}$. Cloro à direita: $2 + 4 + 10 = 16$: 16 $\ce{HCl}$. 16 H: 8 $\ce{H2O}$. Oxigênio: $8 = 8$. Confere.</p>
          <p>(v) $\ce{2 KMnO4 + 16 HCl -> 2 KCl + 2 MnCl2 + 5 Cl2 + 8 H2O}$. Repare: dos 16 cloros do $\ce{HCl}$, só 10 se oxidaram; 6 ficaram como cloreto. Por isso se põe o coeficiente no $\ce{Cl2}$, e não no $\ce{HCl}$.</p>`)}
        ${F.formula(R`(\text{coef. do redutor})\cdot(\text{e}^-\text{ cedidos por unidade}) = (\text{coef. do oxidante})\cdot(\text{e}^-\text{ recebidos por unidade})`, "Balanço de elétrons")}
        <div id="lab-redox"></div>
        <h3>Teorema 3: semirreações em meio ácido</h3>
        ${F.demo("o método do íon-elétron", R`<p>(i) Separe em duas semirreações. $\ce{MnO4- + Fe^2+ -> Mn^2+ + Fe^3+}$ vira: redução, $\ce{MnO4- -> Mn^2+}$; oxidação, $\ce{Fe^2+ -> Fe^3+}$.</p>
          <p>(ii) Em cada uma: acerte os átomos diferentes de O e H; acerte o oxigênio somando $\ce{H2O}$; acerte o hidrogênio somando $\ce{H+}$.</p>
          <p>(iii) Redução: $\ce{MnO4- + 8 H+ -> Mn^2+ + 4 H2O}$. Carga: $+7$ à esquerda, $+2$ à direita: some 5 elétrons à esquerda. $\ce{MnO4- + 8 H+ + 5 e- -> Mn^2+ + 4 H2O}$.</p>
          <p>(iv) Oxidação: $\ce{Fe^2+ -> Fe^3+ + e-}$. Multiplique por 5 para igualar os elétrons.</p>
          <p>(v) Some e cancele os elétrons: $\ce{MnO4- + 5 Fe^2+ + 8 H+ -> Mn^2+ + 5 Fe^3+ + 4 H2O}$. Carga: $-1 + 10 + 8 = +17$; $2 + 15 = +17$. Confere.</p>`)}
        ${F.caixa("pegadinha", R`<p><b>Os erros clássicos.</b> (1) <b>Esquecer de igualar os elétrons</b> e tentar balancear redox só por tentativa: a contagem de átomos pode fechar com coeficientes errados (o chefão mostra um caso com infinitas "soluções"). (2) Trocar os agentes: o oxidante é quem <b>se reduz</b>. (3) Esquecer a <b>atomicidade</b>: no $\ce{Cr2O7^2-}$ são dois crômios, 6 elétrons por fórmula, não 3. (4) Pôr o coeficiente no lugar errado quando só <b>parte</b> do reagente muda de nox ($\ce{HCl}$ e $\ce{HNO3}$ fazem dois papéis: uma parte reage, outra só forma sal). (5) Dizer que o oxigênio é −2 em $\ce{H2O2}$ ou que o hidrogênio é +1 em $\ce{NaH}$. (6) Chamar de oxirredução uma reação em que nenhum nox muda. (7) Em equação iônica, não conferir a <b>carga</b>.</p>`)}
        ${F.caixa("fisico", R`<p><b>Siga os elétrons.</b> Diante de uma equação redox, não olhe os coeficientes: escreva os nox em cima dos átomos e procure só os que mudam. Dois números bastam para montar a reação inteira: quantos elétrons cada unidade do redutor cede e quantos cada unidade do oxidante recebe. O mínimo múltiplo comum deles é o total de elétrons trocados, e esse mesmo número reaparece em toda a eletroquímica: é ele que liga mols de substância a coulombs de carga ${F.ret("G03")}.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Em casa, pode:</b> ver a oxidação acontecer. Corte uma maçã e passe suco de limão numa metade: a vitamina C é um agente redutor e atrasa o escurecimento. Deixe um prego úmido e outro seco e mergulhado em óleo por uma semana: só o primeiro enferruja (precisa de água <b>e</b> oxigênio). O prego em sulfato de cobre do tema D02 é uma oxirredução. <b>Nunca em casa:</b> permanganato de potássio com glicerina ou com ácidos, dicromato (os compostos de crômio(VI) são tóxicos e cancerígenos, e por isso o bafômetro químico foi abandonado), água oxigenada concentrada, e qualquer mistura de água sanitária com outros produtos. <b>Na escola:</b> oxidantes fortes ficam longe de material combustível; resíduos com manganês ou crômio vão para frasco próprio.</p>`, "Segurança e descarte")}
        ${F.caixa("olimpiada", R`<p><b>Como isso é cobrado.</b> (1) Calcular nox, inclusive em íons, peróxidos e casos de nox médio. (2) Reconhecer se uma reação é de oxirredução e apontar os agentes oxidante e redutor. (3) Balancear pelo método redox: "soma dos menores coeficientes" é a pergunta típica do ITA, com permanganato, dicromato e ácido nítrico. (4) Balancear equações iônicas em meio ácido (e, em olimpíada, em meio básico) pelo método do íon-elétron. (5) Desproporcionamento. (6) Estequiometria de titulações redox: quantos mols de $\ce{Fe^2+}$ ou de oxalato um volume de solução de permanganato oxida ${F.ret("D06")}. (7) É a base de pilhas e eletrólise, onde os mesmos elétrons passam por um fio.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, as semirreações ganham um número: o <b>potencial-padrão de redução</b>, em volts. Com a tabela desses potenciais, você prevê se uma oxirredução é espontânea e quanta energia ela entrega; a fila de reatividade ${F.ret("D02")} é essa tabela resumida. A equação de Nernst ${F.ret("G02")} corrige o potencial para qualquer concentração, e é assim que funciona um eletrodo de pH. E o nox, que aqui é contabilidade, passa a ser medido: técnicas de espectroscopia de raios X distinguem $\ce{Fe^2+}$ de $\ce{Fe^3+}$ dentro de um sólido, e mostram que os "+8/3" do $\ce{Fe3O4}$ são mesmo dois tipos de ferro.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-redox"); e.outerHTML = F.lab("Acerto de elétrons: balanceador de oxirredução", "lab-redox"); SIM.qRedox(document.getElementById("lab-redox"), F); },
});
