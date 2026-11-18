/* Química D01 · Funções inorgânicas e nomenclatura. Conferido (Node, tests/tnucleo.js, e Python via tools/confere-py.py nas versões sorteadas):
   regra de força dos oxiácidos, m = (nº de O) − (nº de H ionizáveis): HClO 0 (fraco); H3BO3 0 (fraco); HNO2 1 (moderado); H2SO3 1; H3PO4 1; HClO2 1; HNO3 2 (forte); H2SO4 2; HClO3 2; HClO4 3 (muito forte).
     Exceção clássica: H2CO3 tem m = 1 e é fraco (decompõe-se em CO2 e água); o H3PO3 só tem 2 H ionizáveis (um H está ligado ao P).
   fórmula do sal pela neutralidade (SIM.sal): Al2(SO4)3; Ca3(PO4)2; (NH4)2SO4; Fe(OH)3;
   neutralização total (SIM.balanceia): H2SO4 + 2 NaOH; 2 H3PO4 + 3 Ca(OH)2; 3 H2SO4 + 2 Al(OH)3; 2 HCl + Ca(OH)2; H3PO4 + 3 NaOH; 2 HNO3 + Mg(OH)2;
   massas molares com as massas atômicas arredondadas de prova (SIM.MA), sempre ditas no enunciado: H2SO4 98; Ca(OH)2 74; Al2(SO4)3 342; CaCO3 100; NaOH 40; HNO3 63; Fe2O3 160; Na2CO3 106.
   Nomes: regra usual dos livros brasileiros (carga do metal em algarismos romanos quando ele tem mais de uma). O banco de 80 compostos fica em SIM.NOMES. */
F.registrar("quimica/D01", {
  retoma: ["C01", "C02", "B06"],
  html(F) {
    const R = String.raw, q = SIM.dq, sf = SIM.subFormula, ce = SIM.ce;
    const fig = (conteudo, h = 150) => D.svg(560, h, conteudo, "figura");
    const rot = (f, sub = "") => fig(q.frasco(280, 100, "", "var(--mA)", 0.55, true) + `<rect x="246" y="62" width="68" height="24" rx="4" style="fill:var(--bg);stroke:var(--ink2)"/>` + D.txt(280, 79, sf(f), "tx2", "middle", 'style="fill:var(--ink);font-weight:700"') + (sub ? D.txt(280, 138, sub, "tx2") : ""), 150);
    const cartao = (t, sub = "") => fig(q.rotulo(150, 30, 260, [t].concat(sub ? [sub] : [])), sub ? 110 : 90);
    const N = SIM.NOMES, TODOS = Object.entries(N).flatMap(([g, l]) => l.map((x) => [x[0], x[1], g]));
    const FUNCAO = { "ácidos": "ácido", "bases": "base", "sais": "sal", "óxidos": "óxido" };
    /* [fórmula, O, H ionizáveis, força] */
    const OXI = [["HNO3", 3, 1], ["H2SO4", 4, 2], ["HClO4", 4, 1], ["HClO3", 3, 1], ["HNO2", 2, 1], ["H2SO3", 3, 2], ["H3PO4", 4, 3], ["HClO2", 2, 1], ["HClO", 1, 1], ["H3BO3", 3, 3]];
    const forca = (m) => (m >= 3 ? "muito forte" : m === 2 ? "forte" : m === 1 ? "moderado" : "fraco");
    const nomeDe = (f) => (TODOS.find((x) => x[0] === f) || [])[1];
    const nomeSal = (f) => (f === "Na3PO4" ? "fosfato de sódio" : f === "Mg(NO3)2" ? "nitrato de magnésio" : f === "AlCl3" ? "cloreto de alumínio" : f === "K2SO4" ? "sulfato de potássio" : nomeDe(f));
    /* cátions e ânions para montar sais: [chave do SIM.sal, nome, carga] */
    const CT = [["Na", "sódio", 1], ["K", "potássio", 1], ["NH4", "amônio", 1], ["Ag", "prata", 1], ["Ca", "cálcio", 2], ["Ba", "bário", 2], ["Mg", "magnésio", 2], ["Al", "alumínio", 3], ["Fe3", "ferro(III)", 3], ["Cu", "cobre(II)", 2], ["Pb", "chumbo(II)", 2]];
    const AN = [["NO3", "nitrato", 1, "HNO3", "nítrico"], ["Cl", "cloreto", 1, "HCl", "clorídrico"], ["SO4", "sulfato", 2, "H2SO4", "sulfúrico"], ["CO3", "carbonato", 2, "H2CO3", "carbônico"], ["S", "sulfeto", 2, "H2S", "sulfídrico"], ["PO4", "fosfato", 3, "H3PO4", "fosfórico"]];
    const NEUT = [["H2SO4", "NaOH", "Na2SO4"], ["H3PO4", "Ca(OH)2", "Ca3(PO4)2"], ["H2SO4", "Al(OH)3", "Al2(SO4)3"], ["HCl", "Ca(OH)2", "CaCl2"], ["H3PO4", "NaOH", "Na3PO4"], ["HNO3", "Mg(OH)2", "Mg(NO3)2"], ["HCl", "Al(OH)3", "AlCl3"], ["H2SO4", "KOH", "K2SO4"]];
    const OXAGUA = [["SO3", "H2SO4", "ácido"], ["CO2", "H2CO3", "ácido"], ["N2O5", "HNO3", "ácido"], ["SO2", "H2SO3", "ácido"], ["CaO", "Ca(OH)2", "básico"], ["Na2O", "NaOH", "básico"], ["MgO", "Mg(OH)2", "básico"], ["P2O5", "H3PO4", "ácido"]];
    const TIPOX = [["CaO", "básico"], ["Na2O", "básico"], ["MgO", "básico"], ["SO3", "ácido"], ["CO2", "ácido"], ["P2O5", "ácido"], ["N2O5", "ácido"], ["Al2O3", "anfótero"], ["ZnO", "anfótero"], ["CO", "neutro"], ["NO", "neutro"], ["N2O", "neutro"], ["H2O2", "peróxido"], ["Na2O2", "peróxido"]];
    const VAR = [["FeCl3", "ferro", 3, "Cl", 1, 3], ["FeSO4", "ferro", 2, "SO4", 2, 1], ["Fe2(SO4)3", "ferro", 3, "SO4", 2, 3], ["Cu2O", "cobre", 1, "O", 2, 1], ["CuO", "cobre", 2, "O", 2, 1], ["FeO", "ferro", 2, "O", 2, 1], ["Fe2O3", "ferro", 3, "O", 2, 3], ["CuSO4", "cobre", 2, "SO4", 2, 1], ["PbCl2", "chumbo", 2, "Cl", 1, 2], ["Fe(OH)3", "ferro", 3, "OH", 1, 3], ["Cu(OH)2", "cobre", 2, "OH", 1, 2]];
    const MMS = ["H2SO4", "Ca(OH)2", "Al2(SO4)3", "CaCO3", "NaOH", "HNO3", "Fe2O3", "Na2CO3", "H3PO4", "Mg(OH)2", "KNO3", "CaO"];
    const pyMM = (f) => { const a = SIM.atomos(f); return Object.keys(a).map((k) => a[k] + "*" + SIM.MA[k]).join(" + "); };
    const romano = ["", "I", "II", "III", "IV"];

    const exemplos = F.exemplo({
      titulo: "Do nome à fórmula e de volta",
      casos: [
        { nome: "Fácil: que ácido é esse?", gerar: (p) => { const o = SIM.pega(OXI, p, 5), m = o[1] - o[2];
          return { enun: R`<p>Dê o nome do ácido $${ce(o[0])}$ e classifique a sua força pela regra dos oxiácidos.</p>`, fig: rot(o[0]),
            passos: [R`<p>(i) Tem oxigênio: é um <b>oxiácido</b>. O nome vem do elemento central e do número de oxigênios: o ácido "padrão" termina em <b>-ico</b>; com um oxigênio a menos, <b>-oso</b>; com dois a menos, <b>hipo…oso</b>; com um a mais, <b>per…ico</b>.</p>`,
              R`<p>(ii) $${ce(o[0])}$ é o <b>${nomeDe(o[0])}</b>.</p>`,
              R`<p>(iii) Força: $m = (\text{nº de O}) - (\text{nº de H ionizáveis}) = ${o[1]} - ${o[2]} = ${m}$.</p>`,
              R`<p>(iv) $m = ${m}$: ácido <b>${forca(m)}</b>. (Escala: 0, fraco; 1, moderado; 2, forte; 3, muito forte.)</p>`] }; } },
        { nome: "Médio: monte o sal", gerar: (p) => { const c = SIM.pega(CT, p, 7), a = SIM.pega(AN, p, 2), f = SIM.sal(c[0], a[0]), g = SIM.mdc(c[2], a[2]);
          return { enun: R`<p>Escreva a fórmula do ${a[1]} de ${c[1]}.</p>`, fig: cartao(a[1] + " de " + c[1], "fórmula?"),
            passos: [R`<p>(i) O nome do sal é "ânion de cátion". Ânion ${a[1]}: vem do ácido ${a[4]} ($${ce(a[3])}$), que perde ${a[2]} H⁺: carga ${a[2]}−.</p>`,
              R`<p>(ii) Cátion ${c[1]}: carga ${c[2]}+.</p>`,
              R`<p>(iii) Neutralidade ${F.ret("C01")}: menor múltiplo comum de ${c[2]} e ${a[2]} é ${(c[2] * a[2]) / g}. São ${a[2] / g} cátion${a[2] / g > 1 ? "s" : ""} e ${c[2] / g} ânion${c[2] / g > 1 ? "s" : ""}.</p>`,
              R`<p>(iv) Fórmula: $${ce(f)}$. Íon com mais de um átomo que aparece mais de uma vez vai entre parênteses.</p>`] }; } },
        { nome: "Olimpíada: neutralização total", gerar: (p) => { const n = SIM.pega(NEUT, p, 1), c = SIM.balanceia([n[0], n[1]], [n[2], "H2O"]), hA = SIM.atomos(n[0]).H, oh = SIM.atomos(n[1]).H;
          return { enun: R`<p>Escreva a equação balanceada da neutralização total de $${ce(n[0])}$ com $${ce(n[1])}$ e dê o nome do sal formado.</p>`, fig: fig(q.frasco(190, 100, sf(n[0]), "var(--bad)", 0.5) + D.txt(280, 80, "+", "tx") + q.frasco(370, 100, sf(n[1]), "var(--mA)", 0.5), 140),
            passos: [R`<p>(i) Neutralização: cada $\ce{H+}$ do ácido encontra um $\ce{OH-}$ da base e forma água. O ácido tem ${hA} H ionizáve${hA > 1 ? "is" : "l"} por fórmula; a base, ${oh} $\ce{OH-}$.</p>`,
              R`<p>(ii) Para todos se encontrarem: ${c[0]} de ácido ($${c[0]}\cdot${hA} = ${c[0] * hA}$ H⁺) e ${c[1]} de base ($${c[1]}\cdot${oh} = ${c[1] * oh}$ OH⁻): ${c[0] * hA} moléculas de água.</p>`,
              R`<p>(iii) O que sobra (cátion da base e ânion do ácido) forma o sal: $${ce(n[2])}$.</p>`,
              R`<p>(iv) $${SIM.eqTex([n[0], n[1]], [n[2], "H2O"], c)}$. Sal: <b>${nomeSal(n[2])}</b>.</p>`] }; } },
      ],
    });

    const exNome = (n, nivel, grupo, i0, pergunta) => F.exercicio({ n, nivel, gerar: (p) => { const c = SIM.pega(N[grupo], p, i0), a = SIM.alt5(c[1], N[grupo].map((x) => x[1]), p);
      return Object.assign({ enun: R`<p>${pergunta} $${ce(c[0])}$?</p>`, fig: rot(c[0]), dicas: [grupo === "ácidos" ? R`<p>Sem oxigênio: -ídrico. Com oxigênio: -ico, -oso, hipo…oso, per…ico.</p>` : grupo === "bases" ? R`<p>Hidróxido de (nome do cátion). Se o metal tem mais de uma carga, ela vai em algarismos romanos.</p>` : grupo === "sais" ? R`<p>Nome do ânion + de + nome do cátion. -ídrico vira -eto; -ico vira -ato; -oso vira -ito.</p>` : R`<p>Metal: óxido de (metal). Ametal: prefixos mono, di, tri… para contar os átomos.</p>`], resp: a.certa, sol: R`<p>$${ce(c[0])}$ é <b>${c[1]}</b>.</p>` }, a); } });
    const exFormula = (n, nivel, grupo, i0) => F.exercicio({ n, nivel, gerar: (p) => { const c = SIM.pega(N[grupo], p, i0), a = SIM.alt5(c[0], N[grupo].map((x) => x[0]), p);
      return { enun: R`<p>Qual é a fórmula do composto <b>${c[1]}</b>?</p>`, fig: cartao(c[1], "fórmula?"), alts: a.alts.map((x) => "$" + ce(x) + "$"), certa: a.certa, dicas: [R`<p>Ache as cargas do cátion e do ânion e iguale o total de cargas positivas e negativas.</p>`], resp: a.certa, sol: R`<p><b>${c[1]}</b>: $${ce(c[0])}$.</p>` }; } });

    const chefao = F.chefao({
      titulo: "Cinco frascos sem rótulo",
      enun: R`<p>Numa prateleira há cinco frascos, A a E, cada um com uma destas substâncias, sem repetição: ácido sulfúrico, hidróxido de cálcio, carbonato de sódio, óxido de cálcio e dióxido de enxofre. As pistas: (1) A e C são sólidos brancos que deixam a água básica; A reage com água liberando muito calor e se transforma na substância de C. (2) B é um gás que, borbulhado em água, a deixa ácida. (3) D é um líquido denso; misturado com a solução de C, forma um sal pouco solúvel e água. (4) E é um sólido branco; misturado com D, solta um gás que apaga a chama de um fósforo. (a) Identifique cada frasco, com nome e fórmula. (b) Classifique cada substância (ácido, base, sal, óxido ácido, óxido básico). (c) Escreva e balanceie as reações das pistas 1, 2, 3 e 4, com os nomes dos produtos. (d) Qual é a massa molar do sal da pista 3? (Massas atômicas: H = 1; C = 12; O = 16; Na = 23; S = 32; Ca = 40.) (e) O gás de B é o anidrido de qual ácido? Por que esse ácido é mais fraco que o do frasco D?</p>`,
      fig: fig(["A", "B", "C", "D", "E"].map((l, i) => q.frasco(90 + i * 95, 100, "", ["var(--ink2)", "var(--warn)", "var(--ink2)", "var(--bad)", "var(--ink2)"][i], 0.45, true) + D.txt(90 + i * 95, 128, l, "tx")).join(""), 145),
      dicas: [R`<p>Pista 1: óxido básico + água → base. Qual das cinco é óxido de metal?</p>`, R`<p>Pista 4: ácido + carbonato → sal + água + $\ce{CO2}$.</p>`, R`<p>(e) Compare $m$ = (nº de O) − (nº de H ionizáveis) de $\ce{H2SO3}$ e $\ce{H2SO4}$.</p>`],
      sol: R`<p><b>(a) e (b)</b> A: óxido de cálcio, $\ce{CaO}$ (óxido básico). B: dióxido de enxofre, $\ce{SO2}$ (óxido ácido). C: hidróxido de cálcio, $\ce{Ca(OH)2}$ (base). D: ácido sulfúrico, $\ce{H2SO4}$ (ácido). E: carbonato de sódio, $\ce{Na2CO3}$ (sal).</p>
        <p><b>(c)</b> Pista 1: $\ce{CaO + H2O -> Ca(OH)2}$ (hidróxido de cálcio). Pista 2: $\ce{SO2 + H2O -> H2SO3}$ (ácido sulfuroso). Pista 3: $\ce{H2SO4 + Ca(OH)2 -> CaSO4 + 2 H2O}$ (sulfato de cálcio e água). Pista 4: $\ce{H2SO4 + Na2CO3 -> Na2SO4 + H2O + CO2}$ (sulfato de sódio, água e dióxido de carbono; o ácido carbônico que se formaria se decompõe na hora).</p>
        <p><b>(d)</b> $\ce{CaSO4}$: $40 + 32 + 4\cdot16 = 136$ g/mol.</p>
        <p><b>(e)</b> Do ácido sulfuroso, $\ce{H2SO3}$. Nele $m = 3 - 2 = 1$ (moderado); no sulfúrico, $m = 4 - 2 = 2$ (forte). Cada oxigênio a mais, ligado só ao enxofre, puxa elétrons e facilita a saída do $\ce{H+}$. Balanceamentos conferidos com o balanceador automático do site.</p>`,
    });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", gerar: (p) => { const c = SIM.pega(TODOS, p, 33), a = SIM.alt5(FUNCAO[c[2]], ["ácido", "base", "sal", "óxido", "hidreto metálico"], p);
        return Object.assign({ enun: R`<p>A substância $${ce(c[0])}$ pertence a qual função inorgânica?</p>`, fig: rot(c[0]), dicas: [R`<p>Começa com H e não é água? Termina em OH? Só dois elementos, um deles oxigênio? Nenhuma dessas: sal.</p>`], resp: a.certa, sol: R`<p>${c[1]}: <b>${FUNCAO[c[2]]}</b>.</p>` }, a); } }),
      exNome(2, "Físico", "ácidos", 7, "Qual é o nome do ácido"),
      exNome(3, "Físico", "bases", 3, "Qual é o nome da base"),
      exFormula(4, "Físico", "sais", 6),
      exNome(5, "Físico", "óxidos", 10, "Qual é o nome do óxido"),
      F.exercicio({ n: 6, nivel: "Físico", gerar: (p) => { const b = SIM.pega(N.bases.filter((x) => x[0] !== "NH4OH"), p, 6), oh = SIM.atomos(b[0]).H;
        return { enun: R`<p>Quantos íons $\ce{OH-}$ são liberados na dissociação de uma fórmula de ${b[1]}, $${ce(b[0])}$?</p>`, fig: rot(b[0]), num: { v: oh, un: "íons", tol: 0.001 }, py: String(oh), dicas: [R`<p>É o índice do grupo OH na fórmula.</p>`], resp: oh + " íons hidróxido", sol: R`<p>$${ce(b[0])}$ tem ${oh} grupo${oh > 1 ? "s" : ""} OH por fórmula: libera ${oh} $\ce{OH-}$. O cátion tem carga ${oh}+.</p>` }; } }),
      F.exercicio({ n: 7, nivel: "Físico", gerar: (p) => { const a = SIM.pega(AN, p, 3), alt = SIM.alt5(a[1], AN.map((x) => x[1]).concat(["sulfito", "nitrito", "hipoclorito"]), p);
        return Object.assign({ enun: R`<p>O ânion que vem do ácido ${a[4]}, $${ce(a[3])}$, depois de perder todos os hidrogênios ionizáveis, chama-se:</p>`, fig: cartao("ácido " + a[4], "ânion?"), dicas: [R`<p>-ídrico → -eto; -ico → -ato; -oso → -ito.</p>`], resp: alt.certa, sol: R`<p>Ácido ${a[4]} → ânion <b>${a[1]}</b> (carga ${a[2]}−).</p>` }, alt); } }),
      F.exercicio({ n: 8, nivel: "Físico", gerar: (p) => { const o = SIM.pega(TIPOX, p, 7), alt = SIM.alt5(o[1], ["básico", "ácido", "anfótero", "neutro", "peróxido"], p);
        return Object.assign({ enun: R`<p>O óxido $${ce(o[0])}$ é classificado como:</p>`, fig: rot(o[0]), dicas: [R`<p>Metal dos grupos 1 e 2: básico. Ametal: ácido. Al e Zn: anfótero. CO, NO e N₂O: neutros. Oxigênio com carga 1−: peróxido.</p>`], resp: alt.certa, sol: R`<p>$${ce(o[0])}$: óxido <b>${o[1]}</b>.</p>` }, alt); } }),
      F.exercicio({ n: 9, nivel: "Máximo", gerar: (p) => { const o = SIM.pega(OXI, p, 1), m = o[1] - o[2];
        return { enun: R`<p>Para o oxiácido $${ce(o[0])}$ (${nomeDe(o[0])}), em que todos os ${o[2]} hidrogênio${o[2] > 1 ? "s são ionizáveis" : " é ionizável"}, calcule $m$ = (nº de oxigênios) − (nº de hidrogênios ionizáveis), o número que mede a força do ácido.</p>`, fig: rot(o[0], o[2] + " H ionizáve" + (o[2] > 1 ? "is" : "l")), num: { v: m, tol: 0.001, abs: 0.01, un: "" }, py: o[1] + " - " + o[2], dicas: [R`<p>Conte os O e os H da fórmula.</p>`], resp: m + " (ácido " + forca(m) + ")", sol: R`<p>$m = ${o[1]} - ${o[2]} = ${m}$: ácido ${forca(m)}.</p>` }; } }),
      F.exercicio({ n: 10, nivel: "Máximo", gerar: (p) => { const c = SIM.pega(CT, p, 4), a = SIM.pega(AN, p, 5), f = SIM.sal(c[0], a[0]), alt = SIM.alt5(f, CT.map((x) => SIM.sal(x[0], a[0])).concat(AN.map((x) => SIM.sal(c[0], x[0]))), p);
        return { enun: R`<p>Qual é a fórmula do ${a[1]} de ${c[1]}? (Cátion de carga ${c[2]}+; ânion de carga ${a[2]}−.)</p>`, fig: cartao(a[1] + " de " + c[1], c[2] + "+ e " + a[2] + "−"), alts: alt.alts.map((x) => "$" + ce(x) + "$"), certa: alt.certa, dicas: [R`<p>Total de cargas positivas = total de negativas. Use o menor múltiplo comum.</p>`], resp: alt.certa, sol: R`<p>${a[2] / SIM.mdc(c[2], a[2])} cátion(s) e ${c[2] / SIM.mdc(c[2], a[2])} ânion(s): $${ce(f)}$.</p>` }; } }),
      F.exercicio({ n: 11, nivel: "Máximo", gerar: (p) => { const f = SIM.pega(MMS, p, 2), M = SIM.mm(f), a = SIM.atomos(f);
        return { enun: R`<p>Calcule a massa molar do composto <b>${nomeDe(f) || f}</b>. Primeiro escreva a fórmula. ${SIM.dadosMA([f])}</p>`, fig: cartao(nomeDe(f), "massa molar?"), num: { v: M, tol: 0.005, un: "g/mol" }, py: pyMM(f), dicas: [R`<p>Fórmula: $${ce(f)}$.</p>`, R`<p>Some (número de átomos) × (massa atômica) de cada elemento.</p>`], resp: SIM.vg(M, 1) + " g/mol", sol: R`<p>$${ce(f)}$: $${Object.keys(a).map((k) => a[k] + R`\cdot` + F.n(SIM.MA[k], 1)).join(" + ")} = ${F.n(M, 1)}$ g/mol.</p>` }; } }),
      F.exercicio({ n: 12, nivel: "Máximo", gerar: (p) => { const n = SIM.pega(NEUT, p, 2), c = SIM.balanceia([n[0], n[1]], [n[2], "H2O"]);
        return { enun: R`<p>Na neutralização total de $${ce(n[0])}$ com $${ce(n[1])}$, balanceada com os menores números inteiros, qual é o coeficiente da <b>água</b>?</p>`, fig: fig(q.eq(280, 60, n[0] + " + " + n[1] + " -> " + n[2] + " + H2O") + D.txt(280, 100, "(não balanceada)", "tx2"), 120), num: { v: c[3], tol: 0.001, un: "" }, py: String(SIM.atomos(n[0]).H) + " * " + c[0], dicas: [R`<p>Cada H⁺ do ácido forma uma água com um OH⁻ da base.</p>`, R`<p>Iguale o número total de H⁺ ao de OH⁻.</p>`], resp: c[3] + " moléculas de água", sol: R`<p>$${SIM.eqTex([n[0], n[1]], [n[2], "H2O"], c)}$. Água: ${c[3]}.</p>` }; } }),
      F.exercicio({ n: 13, nivel: "Máximo", gerar: (p) => { const v = SIM.pega(VAR, p, 2);
        return { enun: R`<p>No composto $${ce(v[0])}$, qual é a carga do íon de ${v[1]}? (Dê só o número; o ânion é $${ce(v[3] + "^" + (v[4] > 1 ? v[4] : "") + "-")}$.)</p>`, fig: rot(v[0]), num: { v: v[2], tol: 0.001, un: "+" }, py: String(v[5] * v[4]) + " / " + (SIM.atomos(v[0])[v[1] === "ferro" ? "Fe" : v[1] === "cobre" ? "Cu" : "Pb"]), dicas: [R`<p>Some as cargas negativas e divida pelo número de cátions.</p>`], resp: v[2] + "+ (" + v[1] + "(" + romano[v[2]] + "))", sol: R`<p>Cargas negativas: $${v[5]}\cdot${v[4]} = ${v[5] * v[4]}$. Divididas pelos cátions da fórmula: carga ${v[2]}+. Nome: ${nomeDe(v[0]) || "composto de " + v[1] + "(" + romano[v[2]] + ")"}.</p>` }; } }),
      F.exercicio({ n: 14, nivel: "Máximo", enun: R`<p>O sal $\ce{NaHSO4}$, formado na neutralização <b>parcial</b> do ácido sulfúrico, chama-se:</p>`, fig: rot("NaHSO4"), alts: ["sulfato de sódio", "sulfito de sódio", "hidrogenossulfato de sódio (bissulfato de sódio)", "sulfeto de sódio", "hidróxido de sódio"], certa: "C", dicas: [R`<p>Sobrou um hidrogênio ionizável no ânion.</p>`], resp: "C", sol: R`<p>O ânion $\ce{HSO4-}$ é o hidrogenossulfato: é um sal ácido. O mesmo padrão do $\ce{NaHCO3}$, hidrogenocarbonato (bicarbonato) de sódio.</p>` }),
      F.exercicio({ n: 15, nivel: "Máximo", gerar: (p) => { const o = SIM.pega(OXAGUA, p, 0), alt = SIM.alt5(o[1], OXAGUA.map((x) => x[1]).concat(["H2S", "HCl"]), p);
        return { enun: R`<p>O óxido $${ce(o[0])}$ reage com água. Qual é o produto?</p>`, fig: fig(q.eq(280, 60, o[0] + " + H2O -> ?"), 100), alts: alt.alts.map((x) => "$" + ce(x) + "$"), certa: alt.certa, dicas: [R`<p>Óxido de ametal + água → ácido. Óxido de metal + água → base.</p>`], resp: alt.certa, sol: R`<p>Óxido ${o[2]}: forma ${o[2] === "ácido" ? "o ácido" : "a base"} $${ce(o[1])}$ (${nomeDe(o[1])}).</p>` }; } }),
      F.exercicio({ n: 16, nivel: "Máximo", gerar: (p) => { const n = SIM.pega(NEUT, p, 5), alt = SIM.alt5(nomeSal(n[2]), NEUT.map((x) => nomeSal(x[2])).concat(["sulfito de sódio", "nitrito de magnésio"]), p);
        return Object.assign({ enun: R`<p>Qual é o nome do sal formado na neutralização total de $${ce(n[0])}$ com $${ce(n[1])}$?</p>`, fig: fig(q.frasco(190, 100, sf(n[0]), "var(--bad)", 0.5) + D.txt(280, 80, "+", "tx") + q.frasco(370, 100, sf(n[1]), "var(--mA)", 0.5), 140), dicas: [R`<p>Ânion do ácido + cátion da base.</p>`], resp: alt.certa, sol: R`<p>$${ce(n[2])}$: <b>${nomeSal(n[2])}</b>.</p>` }, alt); } }),
    ];

    const tabela = (cab, linhas) => `<table class="tb"><tr>${cab.map((c) => `<th>${c}</th>`).join("")}</tr>${linhas.map((l) => `<tr>${l.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table>`;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Reações e estequiometria · os nomes das coisas</div>
        <div class="q">Suco de limão, soda cáustica, sal de cozinha e gás carbônico. Um arde na língua, outro queima a pele, um tempera a comida e o último faz o refrigerante espumar. O que cada um tem na fórmula que explica o comportamento?</div>
        <p>Quase todas as substâncias da química inorgânica cabem em quatro gavetas: ácidos, bases, sais e óxidos. Saber em qual gaveta a fórmula cai diz como ela reage; saber dar o nome e escrever a fórmula é o alfabeto de tudo o que vem neste módulo. É decoreba com lógica: poucas regras, muita repetição.</p></div>
        ${F.chute({ q: "o ácido HClO₃ é o ácido clórico. Qual é o nome do HClO₄, com um oxigênio a mais?", ops: ["ácido cloroso", "ácido hipocloroso", "ácido perclórico", "ácido clorídrico"], certa: 2, exp: "Um oxigênio a mais que o ácido padrão (-ico): prefixo per-. A escada completa do cloro: HClO, hipocloroso; HClO₂, cloroso; HClO₃, clórico; HClO₄, perclórico. E o HCl, sem oxigênio nenhum, é o clorídrico." })}`),

      F.secao("acidos", "Ácidos", R`
        <p><b>Ácido</b> (Arrhenius): substância que, em água, se ioniza liberando $\ce{H+}$ como único cátion. $\ce{HCl -> H+ + Cl-}$. São compostos moleculares ${F.ret("C02")}: os íons só aparecem na água.</p>
        ${tabela(["Tipo", "Regra do nome", "Exemplos"], [["hidrácido (sem oxigênio)", "ácido + elemento + <b>ídrico</b>", R`$\ce{HCl}$ clorídrico; $\ce{H2S}$ sulfídrico; $\ce{HCN}$ cianídrico`], ["oxiácido padrão", "ácido + elemento + <b>ico</b>", R`$\ce{HNO3}$ nítrico; $\ce{H2SO4}$ sulfúrico; $\ce{H2CO3}$ carbônico; $\ce{H3PO4}$ fosfórico; $\ce{HClO3}$ clórico`], ["um oxigênio a menos", "… <b>oso</b>", R`$\ce{HNO2}$ nitroso; $\ce{H2SO3}$ sulfuroso; $\ce{HClO2}$ cloroso`], ["dois a menos", "<b>hipo</b> … <b>oso</b>", R`$\ce{HClO}$ hipocloroso`], ["um a mais", "<b>per</b> … <b>ico</b>", R`$\ce{HClO4}$ perclórico`]])}
        <h3>Teorema 1: a força de um oxiácido sai da fórmula</h3>
        ${F.demo("m = oxigênios − hidrogênios ionizáveis", R`<p>(i) Num oxiácido, cada H ionizável está ligado a um oxigênio (O–H), e esse oxigênio ao átomo central.</p>
          <p>(ii) Os oxigênios <b>sem</b> hidrogênio são muito eletronegativos ${F.ret("B07")} e puxam elétrons do átomo central, que puxa dos O–H: o hidrogênio sai mais fácil como $\ce{H+}$.</p>
          <p>(iii) O número desses oxigênios "livres" é $m = (\text{nº de O}) - (\text{nº de H ionizáveis})$.</p>
          <p>(iv) Escala prática: $m = 0$, fraco ($\ce{HClO}$); $m = 1$, moderado ($\ce{HNO2}$, $\ce{H3PO4}$); $m = 2$, forte ($\ce{HNO3}$, $\ce{H2SO4}$); $m = 3$, muito forte ($\ce{HClO4}$).</p>
          <p>(v) Para os hidrácidos, decore: $\ce{HCl}$, $\ce{HBr}$ e $\ce{HI}$ são fortes; os outros ($\ce{HF}$, $\ce{H2S}$, $\ce{HCN}$) são fracos ou moderados.</p>`)}
        ${F.formula(R`m = (\text{nº de O}) - (\text{nº de H ionizáveis})\qquad m \ge 2:\ \text{ácido forte}`, "Força dos oxiácidos")}`),

      F.secao("bases", "Bases e sais", R`
        <p><b>Base</b> (Arrhenius): substância que, em água, libera $\ce{OH-}$ como único ânion. $\ce{NaOH -> Na+ + OH-}$. Nome: <b>hidróxido de</b> + nome do cátion. Se o metal tem mais de uma carga possível, ela vai em algarismos romanos: $\ce{Fe(OH)2}$, hidróxido de ferro(II); $\ce{Fe(OH)3}$, hidróxido de ferro(III).</p>
        <p>Bases fortes e solúveis: as dos metais alcalinos ($\ce{NaOH}$, $\ce{KOH}$). As dos alcalinoterrosos são fortes e pouco solúveis; as demais, fracas e insolúveis. A amônia em água, $\ce{NH4OH}$, é fraca e volátil.</p>
        <p><b>Sal</b>: composto iônico ${F.ret("C01")} formado pelo cátion de uma base e pelo ânion de um ácido. Nasce na <b>neutralização</b>: ácido + base → sal + água.</p>
        <h3>Teorema 2: o nome do ânion vem do nome do ácido</h3>
        ${tabela(["Ácido termina em", "Ânion termina em", "Exemplos"], [["<b>ídrico</b>", "<b>eto</b>", R`clorídrico → cloreto ($\ce{Cl-}$); sulfídrico → sulfeto ($\ce{S^2-}$)`], ["<b>ico</b>", "<b>ato</b>", R`nítrico → nitrato ($\ce{NO3-}$); sulfúrico → sulfato ($\ce{SO4^2-}$); carbônico → carbonato ($\ce{CO3^2-}$); fosfórico → fosfato ($\ce{PO4^3-}$)`], ["<b>oso</b>", "<b>ito</b>", R`nitroso → nitrito ($\ce{NO2-}$); sulfuroso → sulfito ($\ce{SO3^2-}$); hipocloroso → hipoclorito ($\ce{ClO-}$)`]])}
        ${F.demo("do ácido ao sal, sem decorar o sal", R`<p>(i) Tire do ácido todos os H ionizáveis: sobra o ânion, com uma carga negativa para cada H retirado. $\ce{H2SO4}$ perde 2 H⁺: $\ce{SO4^2-}$.</p>
          <p>(ii) Troque a terminação: -ídrico → -eto; -ico → -ato; -oso → -ito. Sulfúrico → sulfato. (Frase dos cursinhos: "mosqu<b>ito</b> teim<b>oso</b>, te m<b>ato</b>, te p<b>ico</b>, te m<b>eto</b> no v<b>ídrico</b>".)</p>
          <p>(iii) Junte o cátion e acerte os índices pela neutralidade ${F.ret("C01")}: $\ce{Al^3+}$ e $\ce{SO4^2-}$: 6 cargas de cada lado: $\ce{Al2(SO4)3}$.</p>
          <p>(iv) Nome: ânion + de + cátion: <b>sulfato de alumínio</b>.</p>
          <p>(v) Se sobrar H no ânion (neutralização parcial), o sal é ácido: $\ce{NaHCO3}$, hidrogenocarbonato de sódio, o bicarbonato.</p>`)}
        ${F.formula(R`\text{ídrico} \to \text{eto}\qquad\text{ico} \to \text{ato}\qquad\text{oso} \to \text{ito}`, "Do nome do ácido ao nome do ânion")}
        ${F.fig(fig(q.ponte(280, 60, "ácido + base", "sal + água", "neutralização") + q.eq(280, 115, "H2SO4 + 2NaOH -> Na2SO4 + 2H2O"), 140), "Neutralização total: cada H⁺ encontra um OH⁻.")}
        <div id="lab-nomes"></div>`),

      F.secao("oxidos", "Óxidos", R`
        <p><b>Óxido</b>: composto de dois elementos em que o oxigênio é o mais eletronegativo (por isso $\ce{OF2}$ não é óxido).</p>
        ${tabela(["Tipo", "Quem forma", "Comportamento", "Exemplos"], [["básico", "metais dos grupos 1 e 2 (e outros de carga baixa)", "com água dá base; com ácido dá sal e água", R`$\ce{Na2O}$, $\ce{CaO}$, $\ce{MgO}$`], ["ácido (anidrido)", "ametais", "com água dá ácido; com base dá sal e água", R`$\ce{CO2}$, $\ce{SO2}$, $\ce{SO3}$, $\ce{N2O5}$, $\ce{P2O5}$`], ["anfótero", "Al, Zn (e alguns outros)", "reage com ácido e com base", R`$\ce{Al2O3}$, $\ce{ZnO}$`], ["neutro", "poucos ametais", "não reage com água, ácido nem base", R`$\ce{CO}$, $\ce{NO}$, $\ce{N2O}$`], ["peróxido", "H, alcalinos, alcalinoterrosos", R`contém $\ce{O2^2-}$ (oxigênio com carga 1−)`, R`$\ce{H2O2}$, $\ce{Na2O2}$`]])}
        <p><b>Nomes.</b> Óxido de metal: "óxido de" + metal (com a carga em romanos, se variar): $\ce{FeO}$, óxido de ferro(II); $\ce{Fe2O3}$, óxido de ferro(III). Óxido de ametal: prefixos que contam os átomos: $\ce{CO}$, monóxido de carbono; $\ce{CO2}$, dióxido de carbono; $\ce{N2O5}$, pentóxido de dinitrogênio.</p>
        ${F.caixa("pegadinha", R`<p><b>Os erros que mais derrubam.</b> (1) Trocar -ato por -ito: sulf<b>ato</b> é $\ce{SO4^2-}$ (do ácido sulfúr<b>ico</b>), sulf<b>ito</b> é $\ce{SO3^2-}$, sulf<b>eto</b> é $\ce{S^2-}$. São três substâncias diferentes. (2) Esquecer os parênteses: $\ce{Ca(OH)2}$ tem dois grupos OH; "CaOH2" não existe. (3) Achar que todo composto com H é ácido: $\ce{NH3}$, $\ce{CH4}$ e $\ce{NaOH}$ têm hidrogênio e não são. Na fórmula de um ácido, o H ionizável vem escrito na frente. (4) Contar todos os H como ionizáveis: no $\ce{H3PO3}$ só dois são (o terceiro está ligado direto ao fósforo). (5) $\ce{H2CO3}$ tem $m = 1$, mas na prática é fraco, porque quase todo ele se desfaz em $\ce{CO2}$ e água.</p>`)}
        ${F.caixa("fisico", R`<p><b>Leia a fórmula antes de ler o nome.</b> Três perguntas, nessa ordem: começa com H (e não é água)? Ácido. Termina em OH e começa com metal (ou $\ce{NH4}$)? Base. Tem só dois elementos, e um é oxigênio? Óxido. Não é nenhum dos três e tem metal (ou $\ce{NH4}$) com ametal? Sal. Com a função na mão, o nome sai por regra, e você já sabe com quem a substância reage: ácido com base, óxido ácido com base, óxido básico com ácido.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Em casa, pode:</b> testar ácidos e bases fracos da cozinha com suco de repolho roxo como indicador (vinagre e limão deixam rosa; bicarbonato e sabão deixam azul-esverdeado). Juntar vinagre e bicarbonato numa tigela, em pouca quantidade: sai $\ce{CO2}$. <b>Nunca em casa:</b> ácidos e bases fortes. Soda cáustica ($\ce{NaOH}$) e ácido muriático ($\ce{HCl}$ impuro) são vendidos em mercado e causam queimaduras graves e cegueira; nunca misture produtos de limpeza (água sanitária com ácido libera cloro; com amoníaco, cloraminas). <b>No laboratório da escola:</b> óculos e jaleco sempre; o ácido se despeja <b>na</b> água, devagar, nunca o contrário; resíduos ácidos e básicos são neutralizados antes do descarte, com orientação do professor.</p>`, "Segurança e descarte")}
        ${F.caixa("olimpiada", R`<p><b>Como isso é cobrado.</b> (1) Dar o nome a partir da fórmula e a fórmula a partir do nome, inclusive de sais com metal de carga variável e de sais ácidos. (2) Classificar: função, força do ácido (regra dos oxigênios), tipo de óxido. (3) Escrever reações de neutralização total e parcial e de óxidos com água, ácidos e bases. (4) Em olimpíada, a nomenclatura quase nunca é a pergunta: ela é o <b>pedágio</b>. O enunciado dá "sulfito de sódio" e a questão é de estequiometria; quem escreve a fórmula errada perde tudo o que vem depois.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, a definição de Arrhenius (H⁺ e OH⁻ em água) é só a primeira de três. Brønsted e Lowry: ácido doa próton, base recebe próton, em qualquer solvente; assim a amônia é base sem precisar de "$\ce{NH4OH}$". Lewis: ácido aceita um par de elétrons, base doa (o $\ce{BF3}$ de octeto incompleto ${F.ret("C02")} vira ácido). A força deixa de ser "forte ou fraco" e vira número: a constante de acidez $K_a$ e o pH ${F.ret("F08")}. E a nomenclatura de complexos e a da IUPAC para todos os compostos ganham regras próprias.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-nomes"); e.outerHTML = F.lab("Treino rápido de nomenclatura", "lab-nomes"); SIM.nomenclatura(document.getElementById("lab-nomes"), F); },
});
