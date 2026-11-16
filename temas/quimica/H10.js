/* Química H10 · Reações de adição: H₂, halogênios, HX e água em alcenos e alcinos; regra de Markovnikov e efeito do peróxido; testes de insaturação.
   REAÇÕES: SIM.org.RX (tipos ad-h2, ad-2h2, ad-x2, ad-hx, ad-hx-anti, ad-h2o), tabela GERADA por tools/quimica/gera-reacoes.py. O RDKit confere produto principal e secundário,
     a regra (no produto de Markovnikov, o carbono que recebeu X é o que tinha menos H; com peróxido, o contrário) e o balanço de átomos. Nomes conferidos no PubChem.
   REGRAS E CONDIÇÕES (tools/quimica/dadosH.json, com trecho): hidrogenação com catalisador metálico, Pt, Pd ou Ni (Wikipedia "Hydrogenation", OpenStax Organic);
     regra de Markovnikov e formação do carbocátion mais substituído; estabilidade terciário > secundário > primário > metila (OpenStax Organic 7.9);
     anti-Markovnikov com HBr e peróxido, efeito Kharasch, mecanismo radicalar (Wikipedia "Markovnikov's rule"); água de bromo descora com alcenos e alcinos (Wikipedia "Bromine test");
     reagente de Baeyer = KMnO₄ alcalino, de violeta a marrom com duplas e triplas (Wikipedia "Baeyer's reagent"); hidratação catalisada por ácido (Wikipedia "Alcohol").
   Conferido em Python (confere-py): massas com C 12, H 1, O 16, Cl 35,5, Br 80; volume molar 22,4 L/mol (CNTP), dito no enunciado.
     Ex. 7 (1ª versão): 14 g de eteno (28 g/mol) = 0,5 mol → 0,5·160 = 80 g de Br₂. Chefão: 2,8 g absorvem 8,0 g de Br₂ (0,05 mol) → M = 56 g/mol → C₄H₈. */
F.registrar("quimica/H10", {
  retoma: ["H09", "H01", "H08"],
  html(F) {
    const R = String.raw, vg = SIM.vg, O = SIM.org, RX = O.RX;
    const fig = (conteudo, h = 150) => D.svg(560, h, conteudo, "figura");
    const cap = (s) => s[0].toUpperCase() + s.slice(1), tx = (v, d = 1) => vg(v, d).replace(",", "{,}");
    const M = (n) => O.massa(O.smiN(n)), T = (t) => RX.filter((x) => x.t === t);
    const op5 = (certo, pool, p) => { const L = [...new Set(pool)].filter((x) => x && x !== certo), e = p ? L.slice(0, 4) : [...L].sort(() => Math.random() - 0.5).slice(0, 4); return SIM.alt5(cap(certo) + ".", e.map((x) => cap(x) + "."), p); };
    const eq = (x, oculta = true) => O.reacao(x, { oculta });
    const H2 = T("ad-h2"), X2 = T("ad-x2"), HX = T("ad-hx"), HXm = HX.filter((x) => x.s), HXs = HX.filter((x) => !x.s), AG = T("ad-h2o"), AGm = AG.filter((x) => x.s), ANTI = T("ad-hx-anti");
    const HAL = [...new Set(RX.filter((x) => /^ad-hx/.test(x.t)).flatMap((x) => [x.p, x.s]))].filter(Boolean), ALC = ["etanol", "propan-1-ol", "propan-2-ol", "butan-1-ol", "butan-2-ol", "2-metilpropan-2-ol", "2-metilpropan-1-ol", "2-metilbutan-2-ol", "3-metilbutan-2-ol"];
    const ALCENOS = ["eteno", "propeno", "but-1-eno", "but-2-eno", "2-metilpropeno", "2-metilbut-2-eno", "pent-1-eno", "pent-2-eno"];
    const INS = [["C=C", 1], ["C#C", 2], ["C=CC=C", 2], ["C#CC", 2], ["C=CCC=C", 2], ["C1=CCCCC1", 1], ["C=CC#C", 3], ["CC=CC", 1]];

    const exemplos = F.exemplo({
      titulo: "Prever o produto de uma adição",
      casos: [
        { nome: "Fácil: HX num alceno assimétrico", gerar: (p) => { const x = SIM.pega(HXm, p, 0), X = O.INO(x.i).slice(1);
          return { enun: R`<p>Qual é o produto principal da adição de ${O.INO(x.i)} ao ${x.r[0]}?</p>`, fig: eq(x),
            passos: [R`<p>(i) Localize a dupla e conte os H de cada carbono dela.</p>`, R`<p>(ii) Regra de Markovnikov: o <b>H</b> do ${O.INO(x.i)} vai para o carbono da dupla que <b>já tem mais H</b>.</p>`, R`<p>(iii) O ${X} vai para o outro carbono, o mais substituído. O motivo: o carbocátion intermediário mais substituído é o mais estável.</p>`, R`<p>(iv) Produto principal: <b>${x.p}</b>. O outro, ${x.s}, forma-se em quantidade pequena.</p>`], resp: x.p }; } },
        { nome: "Médio: massa de bromo consumida", gerar: (p) => { const x = SIM.pega(X2.filter((y) => y.i === "Br2"), p, 0), n = p ? 0.5 : F.escolha([0.1, 0.25, 0.5, 0.75]), m = n * M(x.r[0]), v = n * 160;
          return { enun: R`<p>Que massa de bromo ($\ce{Br2}$) reage completamente com ${F.nt(m, 1)} g de ${x.r[0]}? (C = 12, H = 1, Br = 80.)</p>`, fig: eq(x, false),
            passos: [R`<p>(i) Uma dupla, um $\ce{Br2}$: proporção 1 : 1.</p>`, R`<p>(ii) $M(\text{${x.r[0]}}) = ${M(x.r[0])}$ g/mol, então $n = ${tx(m, 1)}/${M(x.r[0])} = ${tx(n, 2)}$ mol.</p>`, R`<p>(iii) $n(\ce{Br2}) = ${tx(n, 2)}$ mol, e $M(\ce{Br2}) = 160$ g/mol.</p>`, R`<p>(iv) $m = ${tx(n, 2)} \cdot 160 = ${tx(v, 1)}$ g. Produto: ${x.p}.</p>`], resp: `${vg(v, 1)} g` }; } },
        { nome: "Difícil: descobrir o alceno pela massa de bromo", gerar: (p) => { const nC = p ? 3 : F.escolha([2, 3, 4, 5]), Ma = 14 * nC, n = p ? 0.1 : F.escolha([0.05, 0.1, 0.2]), m = n * Ma, mb = n * 160;
          return { enun: R`<p>${F.nt(m, 1)} g de um alceno de cadeia aberta, com uma única dupla, descoram exatamente ${F.nt(mb, 1)} g de bromo. Qual é a fórmula molecular do alceno? (C = 12, H = 1, Br = 80.)</p>`, fig: fig(D.txt(280, 48, "CₙH₂ₙ + Br₂ → CₙH₂ₙBr₂", "tx", "middle", 'style="font-size:20px;font-weight:700"') + D.txt(280, 80, `${vg(m, 1)} g de alceno · ${vg(mb, 1)} g de bromo`, "tx2"), 105),
            passos: [R`<p>(i) $n(\ce{Br2}) = ${tx(mb, 1)}/160 = ${tx(n, 2)}$ mol.</p>`, R`<p>(ii) Uma dupla por molécula: $n(\text{alceno}) = ${tx(n, 2)}$ mol.</p>`, R`<p>(iii) $M = ${tx(m, 1)}/${tx(n, 2)} = ${Ma}$ g/mol.</p>`, R`<p>(iv) Alceno: $\ce{C_nH_{2n}}$, massa $14n$. Logo $14n = ${Ma}$, $n = ${nC}$: $\ce{C${nC}H${2 * nC}}$.</p>`], resp: `C${nC}H${2 * nC}` }; } },
      ],
    });

    const chefao = F.chefao({
      titulo: "O hidrocarboneto X",
      enun: R`<p>Um hidrocarboneto X, de cadeia aberta, tem as seguintes propriedades: (1) 2,8 g de X descoram exatamente 8,0 g de bromo; (2) com HBr, X dá <b>um único</b> produto, mesmo sem considerar a regra de Markovnikov; (3) a ozonólise de X (com zinco) dá um único composto orgânico. (a) Qual é a massa molar e a fórmula molecular de X? (b) Quais isômeros de cadeia aberta têm essa fórmula? (c) Qual deles é X? Justifique com (2) e (3). (d) Qual é o produto de X com HBr? Ele tem carbono quiral? (e) A reação de (d) produz um enantiômero só ou os dois? (f) Que volume de $\ce{H2}$, nas CNTP (22,4 L/mol), hidrogena os 2,8 g de X? (C = 12, H = 1, Br = 80.)</p>`,
      fig: fig(SIM.dq.tab(60, 14, [220, 220], [["pista", "dado"], ["(1) bromo", "2,8 g de X · 8,0 g de Br₂"], ["(2) HBr", "um único produto"], ["(3) ozonólise", "um único composto"]]), 130),
      dicas: [R`<p>(a) 8,0 g de bromo são 0,05 mol. Uma dupla por molécula.</p>`, R`<p>(c) Um produto só com HBr e um só na ozonólise: a molécula é simétrica em relação à dupla.</p>`, R`<p>(e) O carbocátion intermediário é plano: o brometo pode entrar pelos dois lados.</p>`],
      sol: R`<p><b>(a)</b> $n(\ce{Br2}) = 8{,}0/160 = 0{,}05$ mol = $n(\text{X})$. $M = 2{,}8/0{,}05 = 56$ g/mol. $14n = 56$: $\ce{C4H8}$.</p>
        <p><b>(b)</b> But-1-eno, but-2-eno e 2-metilpropeno ${F.ret("H07")}.</p>
        <p><b>(c)</b> <b>But-2-eno</b>. É o único em que os dois carbonos da dupla são equivalentes: com HBr, qualquer orientação dá 2-bromobutano; na ozonólise, os dois pedaços são etanal. (But-1-eno e 2-metilpropeno dariam dois produtos com HBr e dois compostos diferentes na ozonólise.)</p>
        <p><b>(d)</b> 2-bromobutano. Tem: o carbono 2 segura H, Br, $\ce{CH3}$ e $\ce{C2H5}$ ${F.ret("H08")}.</p>
        <p><b>(e)</b> Os dois, em partes iguais: o carbocátion intermediário é plano e o $\ce{Br-}$ ataca com a mesma probabilidade pelas duas faces. Forma-se a mistura racêmica, opticamente inativa.</p>
        <p><b>(f)</b> $0{,}05$ mol de $\ce{H2}$: $0{,}05 \cdot 22{,}4 = 1{,}12$ L.</p>`,
    });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", gerar: (p) => { const x = SIM.pega(H2, p, 1), a5 = op5(x.p, ["etano", "propano", "butano", "metilpropano", "2-metilbutano", "cicloexano", "pentano"], p);
        return { enun: R`<p>Qual é o produto da hidrogenação catalítica?</p>`, fig: eq(x), ...a5, resp: x.p, dicas: [R`<p>Cada carbono da dupla ganha um H. O esqueleto não muda.</p>`], sol: R`<p>${cap(O.reacaoTxt(x))}. A dupla vira simples; o esqueleto de carbonos é o mesmo do alceno.</p>` }; } }),
      F.exercicio({ n: 2, nivel: "Físico", gerar: (p) => { const x = SIM.pega(X2, p, 2), a5 = op5(x.p, ["1,2-dibromoetano", "1,2-dicloroetano", "1,2-dibromopropano", "2,3-dibromobutano", "1,2-dibromobutano", "2-bromopropano", "bromoetano", "2-bromobutano"], p);
        return { enun: R`<p>Qual é o produto da reação?</p>`, fig: eq(x), ...a5, resp: x.p, dicas: [R`<p>Os dois átomos de halogênio entram, um em cada carbono da dupla.</p>`], sol: R`<p>${cap(O.reacaoTxt(x))}. Os halogênios ficam em carbonos <b>vizinhos</b> (os que formavam a dupla).</p>` }; } }),
      F.exercicio({ n: 3, nivel: "Físico", gerar: (p) => { const x = SIM.pega(HXm, p, 1), a5 = op5(x.p, [x.s, ...HAL], p);
        return { enun: R`<p>Qual é o produto <b>principal</b> da reação?</p>`, fig: eq(x), ...a5, resp: x.p, dicas: [R`<p>Markovnikov: o H vai para o carbono da dupla que já tem mais H.</p>`, R`<p>O halogênio fica no carbono mais substituído.</p>`], sol: R`<p>${cap(O.reacaoTxt(x))}. O H entra no carbono da dupla com mais H; o halogênio, no outro. O produto secundário seria ${x.s}.</p>` }; } }),
      F.exercicio({ n: 4, nivel: "Físico", gerar: (p) => { const x = SIM.pega(AG, p, 1), a5 = op5(x.p, [x.s, ...ALC], p);
        return { enun: R`<p>Qual é o álcool formado como produto principal na hidratação?</p>`, fig: eq(x), ...a5, resp: x.p, dicas: [R`<p>A água entra como H e OH. Markovnikov vale: o H vai para o carbono com mais H.</p>`], sol: R`<p>${cap(O.reacaoTxt(x))}. ${x.s ? `O OH fica no carbono mais substituído; ${x.s} seria o produto secundário.` : "O alceno é simétrico: há um álcool só."}</p>` }; } }),
      F.exercicio({ n: 5, nivel: "Físico", gerar: (p) => { const x = SIM.pega(ANTI, p, 0), a5 = op5(x.p, [x.s, ...HAL], p);
        return { enun: R`<p>Qual é o produto principal da adição de HBr <b>na presença de peróxido</b>?</p>`, fig: eq(x), ...a5, resp: x.p, dicas: [R`<p>O peróxido muda o mecanismo (radicalar) e inverte a orientação.</p>`], sol: R`<p>${cap(O.reacaoTxt(x))}. Com peróxido a adição é <b>anti-Markovnikov</b>: o Br vai para o carbono com mais H. Sem peróxido, o produto seria ${x.s}.</p>` }; } }),
      F.exercicio({ n: 6, nivel: "Físico", gerar: (p) => { const m = SIM.pega(INS, p, 2), v = m[1];
        return { enun: R`<p>Quantos mols de $\ce{H2}$ são necessários para saturar completamente 1 mol do hidrocarboneto da figura?</p>`, fig: O.fig([{ smi: m[0] }], { L: 44 }), num: { v, tol: 0.001, un: "mol" }, py: `${O.sigmapi(m[0]).pi}`, dicas: [R`<p>Conte as ligações π: uma por dupla, duas por tripla.</p>`, R`<p>Cada ligação π consome um $\ce{H2}$. Anel não conta.</p>`], resp: `${v} mol`, sol: R`<p>A molécula tem ${v} ligação(ões) π. Cada uma recebe um $\ce{H2}$: ${v} mol.</p>` }; } }),
      F.exercicio({ n: 7, nivel: "Físico", gerar: (p) => { const x = SIM.pega(X2.filter((y) => y.i === "Br2"), p, 0), n = p ? 0.5 : F.escolha([0.1, 0.2, 0.25, 0.4]), m = n * M(x.r[0]), v = n * 160;
        return { enun: R`<p>Que massa de $\ce{Br2}$, em g, reage completamente com ${F.nt(m, 1)} g de ${x.r[0]}? (C = 12, H = 1, Br = 80.)</p>`, fig: eq(x, false), num: { v, tol: 0.02, un: "g" }, py: `${m}/${M(x.r[0])}*160`, dicas: [R`<p>Proporção 1 : 1.</p>`, R`<p>$M = ${M(x.r[0])}$ g/mol para o alceno e 160 g/mol para o bromo.</p>`], resp: `${vg(v, 1)} g`, sol: R`<p>$n = ${tx(m, 1)}/${M(x.r[0])} = ${tx(n, 2)}$ mol; $m(\ce{Br2}) = ${tx(n, 2)} \cdot 160 = ${tx(v, 1)}$ g.</p>` }; } }),
      F.exercicio({ n: 8, nivel: "Físico", gerar: (p) => { const c = SIM.pega(["propeno", "but-1-eno", "cicloexeno", "etino", "but-2-eno"], p, 0), a5 = op5(c, ["propano", "butano", "cicloexano", "benzeno", "etano", "pentano"], p);
        return { enun: R`<p>Qual destes hidrocarbonetos descora rapidamente a água de bromo (de amarela a incolor), no escuro e sem catalisador?</p>`, fig: fig(D.copo(180, 30, 70, 90, 0.7, "#c9a227") + D.seta(270, 78, 320, 78) + D.copo(340, 30, 70, 90, 0.7, "#8aa0b8") + D.txt(215, 138, "água de bromo", "tx2") + D.txt(375, 138, "incolor", "tx2"), 150), ...a5, resp: c, dicas: [R`<p>A água de bromo é teste de insaturação: dupla ou tripla entre carbonos.</p>`, R`<p>O benzeno, apesar das "duplas", não adiciona bromo.</p>`], sol: R`<p>${cap(c)}: tem ligação π entre carbonos e <b>adiciona</b> o bromo. Alcanos e cicloalcanos não têm insaturação; o benzeno é aromático e não faz adição ${F.ret("H09")}.</p>` }; } }),
      F.exercicio({ n: 9, nivel: "Máximo", gerar: (p) => { const c = SIM.pega(["but-2-eno", "eteno", "2,3-dimetilbut-2-eno"], p, 0), a5 = op5(c, ["propeno", "but-1-eno", "2-metilpropeno", "2-metilbut-2-eno", "pent-1-eno"], p);
        return { enun: R`<p>Qual destes alcenos, ao adicionar HBr, forma <b>um único</b> haleto, de modo que a regra de Markovnikov nem precisa ser usada?</p>`, fig: fig(D.txt(280, 50, "os dois carbonos da dupla equivalentes", "tx", "middle", 'style="font-size:19px;font-weight:700"') + D.txt(280, 80, "um produto só", "tx2"), 105), ...a5, resp: c, dicas: [R`<p>Procure o alceno simétrico em relação à dupla.</p>`], sol: R`<p>${cap(c)}: os dois carbonos da dupla têm os mesmos grupos. Pôr o H em um ou no outro dá a mesma molécula.</p>` }; } }),
      F.exercicio({ n: 10, nivel: "Máximo", gerar: (p) => { const x = SIM.pega(AGm, p, 0), a5 = op5(x.r[0], ALCENOS, p);
        return { enun: R`<p>Qual alceno, por hidratação em meio ácido, dá <b>${x.p}</b> como produto principal?</p>`, fig: O.fig([{ smi: O.smiN(x.p), leg: x.p + " (produto desejado)" }], { L: 40 }), ...a5, resp: x.r[0], dicas: [R`<p>De trás para a frente: o carbono do OH e um vizinho formavam a dupla.</p>`, R`<p>Confira com Markovnikov: o OH tem de ter ficado no carbono mais substituído.</p>`], sol: R`<p>${cap(x.r[0])}: ${O.reacaoTxt(x)}. O OH entra no carbono mais substituído da dupla.</p>` }; } }),
      F.exercicio({ n: 11, nivel: "Máximo", gerar: (p) => { const x = SIM.pega(H2.filter((y) => y.r[0] !== "cicloexeno"), p, 0), n = p ? 0.25 : F.escolha([0.1, 0.2, 0.25, 0.5]), m = n * M(x.r[0]), v = n * 22.4;
        return { enun: R`<p>Que volume de $\ce{H2}$, em L, nas CNTP (volume molar 22,4 L/mol), hidrogena completamente ${F.nt(m, 1)} g de ${x.r[0]}? (C = 12, H = 1.)</p>`, fig: eq(x, false), num: { v, tol: 0.02, un: "L" }, py: `${m}/${M(x.r[0])}*22.4`, dicas: [R`<p>Uma dupla, um $\ce{H2}$.</p>`], resp: `${vg(v, 2)} L`, sol: R`<p>$n = ${tx(m, 1)}/${M(x.r[0])} = ${tx(n, 2)}$ mol de alceno e de $\ce{H2}$; $V = ${tx(n, 2)} \cdot 22{,}4 = ${tx(v, 2)}$ L.</p>` }; } }),
      F.exercicio({ n: 12, nivel: "Máximo", gerar: (p) => { const x = SIM.pega([...HXm, ...HXs], p, 3), v = M(x.p), mi = { HBr: 81, HCl: 36.5 }[x.i];
        return { enun: R`<p>Qual é a massa molar, em g/mol, do produto da adição de ${O.INO(x.i)} ao ${x.r[0]}? (C = 12, H = 1, Cl = 35,5, Br = 80.)</p>`, fig: eq(x), num: { v, tol: 0.005, un: "g/mol" }, py: `${M(x.r[0])}+${mi}`, dicas: [R`<p>Adição não perde nada: a massa do produto é a soma das massas dos reagentes.</p>`], resp: `${vg(v, 1)} g/mol`, sol: R`<p>$M = ${M(x.r[0])} + ${tx(mi, 1)} = ${tx(v, 1)}$ g/mol (${x.p}). Na adição, todos os átomos dos reagentes vão para um único produto.</p>` }; } }),
      F.exercicio({ n: 13, nivel: "Máximo", gerar: (p) => { const nC = p ? 4 : F.escolha([2, 3, 4, 5, 6]), n = p ? 0.05 : F.escolha([0.05, 0.1, 0.25]), m = n * 14 * nC, mb = n * 160;
        return { enun: R`<p>${F.nt(m, 1)} g de um alceno de cadeia aberta, com uma única dupla, reagem exatamente com ${F.nt(mb, 1)} g de $\ce{Br2}$. Quantos átomos de carbono tem a molécula do alceno? (C = 12, H = 1, Br = 80.)</p>`, fig: fig(D.txt(280, 48, "CₙH₂ₙ + Br₂ → CₙH₂ₙBr₂", "tx", "middle", 'style="font-size:20px;font-weight:700"') + D.txt(280, 80, "n = ?", "tx2"), 105), num: { v: nC, tol: 0.001, un: "" }, py: `${m}/(${mb}/160)/14`, dicas: [R`<p>Mols de bromo = mols de alceno. Daí sai a massa molar.</p>`, R`<p>Alceno $\ce{C_nH_{2n}}$: massa molar $14n$.</p>`], resp: String(nC), sol: R`<p>$n(\ce{Br2}) = ${tx(mb, 1)}/160 = ${tx(n, 2)}$ mol; $M = ${tx(m, 1)}/${tx(n, 2)} = ${14 * nC}$ g/mol; $14n = ${14 * nC}$, $n = ${nC}$.</p>` }; } }),
    ];

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Química orgânica</div>
        <div class="q">Óleo vegetal é líquido; margarina, feita do mesmo óleo, é pastosa. Entre uma coisa e outra, a fábrica só borbulhou hidrogênio no óleo, com um metal em pó. O que o hidrogênio fez?</div>
        <p>Entrou nas <b>duplas ligações</b> das moléculas do óleo. Numa <b>adição</b>, a ligação π se desfaz e cada carbono dela ganha um átomo ou grupo: duas moléculas viram <b>uma só</b>, sem sobrar nada. É a reação típica de alcenos e alcinos.</p></div>
        ${F.chute({ q: "o propeno reage com HBr. Onde o bromo vai parar?", ops: ["No carbono 1 (o da ponta, CH₂)", "No carbono 2 (o do meio)", "Metade em cada um", "No carbono 3 (o CH₃)"], certa: 1, exp: "No carbono 2: forma-se principalmente 2-bromopropano. O H vai para o carbono da dupla que já tinha mais H (regra de Markovnikov), porque assim o carbocátion intermediário é o mais estável." })}`),

      F.secao("laboratorio", "Laboratório: o que entra na dupla", R`<p>Escolha a reação, preveja o produto principal e o secundário, e só então clique em mostrar.</p><div id="lab-adicao"></div>`),

      F.secao("simples", "H₂ e halogênios: os dois carbonos ganham o mesmo", R`
        <p>A ligação π é mais fraca que a σ e fica exposta, acima e abaixo do plano da dupla ${F.ret("H01")}. Por isso alcenos e alcinos reagem onde os alcanos não reagem. O esquema geral:</p>
        ${F.formula(R`\ce{>C=C< + X-Y -> >CX-CY<}`, "Adição a uma dupla: a ligação π vira duas ligações σ")}
        ${F.fig(eq(H2[1], false), "Hidrogenação catalítica: alceno + H₂ → alcano. Sem o metal (Pt, Pd ou Ni), a reação não anda.")}
        ${F.fig(eq(X2.find((x) => x.r[0] === "propeno"), false), "Halogenação: os dois bromos entram em carbonos vizinhos. A cor do bromo desaparece.")}
        ${F.demo("Teorema 1: a contabilidade das ligações π", R`<p><b>Afirmação.</b> Um mol de um hidrocarboneto com $k$ ligações π entre carbonos (não aromáticas) consome $k$ mol de $\ce{H2}$ (ou de $\ce{Br2}$) para saturar.</p>
          <p><b>Demonstração.</b> (i) Cada adição desfaz <b>uma</b> ligação π e cria duas σ, uma em cada carbono. (ii) Uma dupla tem uma π: um $\ce{H2}$. (iii) Uma tripla tem duas π: o primeiro $\ce{H2}$ a leva a dupla, o segundo, a simples. (iv) Duplas separadas reagem cada uma por si. Somando: $k$ ligações π, $k$ moléculas de $\ce{H2}$. (v) Anéis não entram: o anel conta no IDH ${F.ret("H01")}, mas não tem ligação π para desfazer. Daí: (IDH) − (mols de $\ce{H2}$ absorvidos) = número de anéis.</p>`)}
        ${F.formula(R`n(\ce{H2}) = n(\ce{Br2}) = k\cdot n(\text{hidrocarboneto})\qquad k = \text{nº de ligações } \pi`, "Estequiometria da saturação")}
        ${F.caixa("fisico", R`<p>A água de bromo (amarelo-alaranjada) e a solução de permanganato (violeta, reagente de Baeyer) são os <b>testes de insaturação</b>: com alceno ou alcino, a primeira fica incolor e a segunda passa a marrom. Alcanos e benzeno não mudam a cor. Um químico diante de um hidrocarboneto desconhecido começa por aí: uma gota do reagente responde "tem ligação π reativa?" em segundos. Se, além disso, medir <b>quanto</b> bromo foi consumido, descobre <b>quantas</b>.</p>`, "Pense como químico")}`),

      F.secao("markovnikov", "HX e água: para onde vai o H", R`
        <p>Quando o reagente é assimétrico (H–Cl, H–Br, H–OH) e o alceno também, há dois produtos possíveis. Quem decide é a <b>regra de Markovnikov</b>:</p>
        ${F.formula(R`\text{o H entra no carbono da dupla que já tem mais H;}\quad \text{X (ou OH) entra no carbono mais substituído}`, "Regra de Markovnikov")}
        ${F.fig(eq(HXm[0], false), "Propeno + HBr: forma-se principalmente 2-bromopropano.")}
        ${F.demo("Teorema 2: por que Markovnikov funciona", R`<p><b>Afirmação.</b> Na adição de HX a um alceno, o produto principal vem do <b>carbocátion mais substituído</b>.</p>
          <p><b>Demonstração.</b> (i) A reação tem duas etapas. Primeiro, os elétrons π atacam o $\ce{H+}$ do ácido: o H liga-se a <b>um</b> dos carbonos da dupla, e o outro fica com carga positiva (um carbocátion). (ii) Depois, o $\ce{X-}$ liga-se ao carbono positivo. Então o X termina no carbono que <b>não</b> recebeu o H. (iii) A primeira etapa é a lenta, e tem dois caminhos: H num carbono ou no outro. Cada caminho dá um carbocátion diferente. (iv) A estabilidade dos carbocátions cresce com a substituição: terciário > secundário > primário > metila (os grupos alquila vizinhos ajudam a espalhar a carga). (v) O caminho que leva ao carbocátion mais estável tem a menor barreira de energia e é o mais rápido ${F.ret("F05")}. (vi) Para o carbocátion ficar no carbono mais substituído, o H tem de ir para o <b>outro</b>, que é justamente o que tem mais H. É a regra.</p>`)}
        ${F.fig(eq(AGm[0], false), "Hidratação (água com catalisador ácido): mesma regra, e o produto é um álcool.")}
        ${F.fig(eq(ANTI[0], false), "A exceção: HBr com peróxido. O mecanismo passa a ser radicalar e a orientação se inverte (anti-Markovnikov).")}
        ${F.caixa("pegadinha", R`<p><b>"O H vai para o carbono com menos H."</b> É o contrário: "quem tem mais, ganha mais".</p>
          <p><b>Aplicar Markovnikov a H₂ ou Br₂.</b> Reagente simétrico não tem orientação: os dois carbonos recebem a mesma coisa.</p>
          <p><b>Peróxido com HCl.</b> A inversão vale para o <b>HBr</b>. Não generalize para HCl e HI.</p>
          <p><b>Alceno simétrico.</b> But-2-eno + HBr dá um produto só: não há o que escolher.</p>
          <p><b>Benzeno.</b> Não adiciona bromo nem HX nessas condições: substitui ${F.ret("H09")}.</p>
          <p><b>Esquecer a estereoquímica.</b> Se o carbono que recebe o X fica com quatro grupos diferentes, forma-se a mistura racêmica ${F.ret("H08")}.</p>`)}
        ${F.caixa("pegadinha", R`<p>Bromo líquido e água de bromo são tóxicos e corrosivos; HBr e HCl são gases irritantes; hidrogênio com catalisador metálico é inflamável e explosivo. <b>Nada disto é para casa.</b> O teste da água de bromo e o do permanganato diluído são feitos em laboratório escolar, com gotas, óculos e professor; os resíduos com bromo e manganês vão para o frasco de descarte, não para a pia.</p>`, "Segurança e descarte")}
        ${F.caixa("olimpiada", R`<p><b>Como isso é cobrado.</b> (1) Produto principal de alceno + HX ou + água (Markovnikov), com nome. (2) Efeito do peróxido na adição de HBr. (3) Estequiometria: massa de bromo ou volume de $\ce{H2}$ consumidos; descobrir o número de duplas ou a fórmula do alceno. (4) Testes de insaturação e o que cada um distingue. (5) Qual alceno dá certo álcool ou haleto. (6) Em olimpíada: identificar um hidrocarboneto por um conjunto de pistas (bromo, HBr, ozonólise ${F.ret("H12")}), estereoquímica do produto, adição em dienos e alcinos.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, a adição de $\ce{Br2}$ revela um intermediário cíclico (o íon bromônio), que explica por que os dois bromos entram por lados opostos da dupla. A hidrogenação acontece na superfície do metal. E surgem maneiras de obter o álcool anti-Markovnikov e de controlar qual enantiômero se forma, com catalisadores quirais.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-adicao"); e.outerHTML = F.lab("Reações de adição: o que entra na dupla", "lab-adicao"); SIM.qAdicao(document.getElementById("lab-adicao"), F); },
});
