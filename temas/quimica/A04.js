/* Química A04 · Substâncias puras e misturas; alotropia. Conferido em Python:
   solda eutética: 63% de estanho e 37% de chumbo em massa, funde a 183 °C; 250 g → 157,5 g de Sn e 92,5 g de Pb;
   azeótropo etanol–água: 95,6% de etanol em massa, ferve a 78,2 °C (etanol puro: 78,4 °C); 500 g → 478 g de etanol e 22 g de água;
   carbono: grafite 2,26 g/cm³, diamante 3,51 g/cm³; 12,0 g: 5,31 cm³ e 3,42 cm³ (35,6% menor);
   queima do carbono: 12 g de C + 32 g de O₂ → 44 g de CO₂, isto é, 3,67 g de CO₂ por grama de carbono; 0,600 g → 2,20 g; 1,50 g → 5,50 g;
   ozônio: 48 g de O₃ viram 48 g de O₂ (1,5 vez 32 g); enxofre rômbico → monoclínico a 95,5 °C;
   chefão: liga com 31,5 g de Sn em 50,0 g = 63,0%; 0,600 g de cada sólido preto/transparente → 2,20 g de CO₂. */
F.registrar("quimica/A04", {
  retoma: ["A02", "A03"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    /* caixa de partículas: lista de "moléculas"; cada uma é uma lista de átomos [dx, dy, cor] em torno de (x, y) */
    const A = "var(--mA)", B = "var(--bad)", C = "var(--warn)";
    const mol = (x, y, ats) => ats.map(([dx, dy, c]) => `<circle cx="${x + dx}" cy="${y + dy}" r="6" style="fill:${c};stroke:var(--bg);stroke-width:1"/>`).join("");
    const caixa = (x, rot, mols) => `<rect x="${x}" y="14" width="110" height="100" rx="5" style="fill:var(--bg);stroke:var(--ink3);stroke-width:1.5"/>` + mols.map(([a, b, ats]) => mol(x + a, 14 + b, ats)).join("") + D.txt(x + 55, 134, rot, "tx2");
    const d2 = (c) => [[-5, 0, c], [5, 0, c]], h2o = [[0, 0, B], [-8, 6, A], [8, 6, A]], um = (c) => [[0, 0, c]];
    const P6 = [[22, 22], [60, 18], [90, 34], [30, 58], [68, 60], [50, 84]];
    const simples = caixa(20, "I", P6.map(([a, b]) => [a, b, d2(A)])), composta = caixa(155, "II", P6.map(([a, b]) => [a, b, h2o])), mistura = caixa(290, "III", P6.map(([a, b], i) => [a, b, i % 2 ? d2(A) : d2(B)])), mono = caixa(425, "IV", P6.map(([a, b]) => [a, b, um(C)]));
    const quatro = fig(simples + composta + mistura + mono, 150);
    /* béquer com camadas: lista de [fração, cor, rótulo] de baixo para cima */
    const bequer = (x, camadas, rot) => { let y = 130, s = ""; camadas.forEach(([f, c, r]) => { const h = 96 * f; y -= h; s += `<rect x="${x - 38}" y="${y}" width="76" height="${h}" style="fill:color-mix(in srgb,${c} 38%,transparent)"/>` + (r ? D.txt(x, y + h / 2 + 4, r, "tx2") : ""); }); return s + `<path d="M${x - 40} 26 L${x - 40} 130 L${x + 40} 130 L${x + 40} 26" style="fill:none;stroke:var(--ink2);stroke-width:2"/>` + D.txt(x, 150, rot, "tx2"); };
    /* curva de aquecimento esquemática: df e de = quanto a temperatura sobe na fusão e na ebulição (0 = patamar) */
    const pts = (df, de) => [[0, 8], [15, 30], [35, 30 + df], [55, 64], [85, 64 + de], [100, 92]];
    const curva = (df, de, rot = "", x0 = 70, w = 420, h = 130) => D.graf({ x0, y0: 170, w, h, xmax: 100, ymin: 0, ymax: 100, xlab: w > 200 ? "tempo" : "", ylab: "T", xt: [], yt: [], curvas: [{ pts: pts(df, de), cor: "var(--mod)" }] }) + (rot ? D.txt(x0 + w / 2, 196, rot, "tx2") : "");
    const curvaFig = (df, de, extra = "") => D.svg(560, 205, curva(df, de) + extra, "gráfico");
    const quatroCurvas = D.svg(560, 205, curva(0, 0, "A", 30, 100, 120) + curva(9, 9, "B", 165, 100, 120) + curva(0, 9, "C", 300, 100, 120) + curva(9, 0, "D", 435, 100, 120), "gráfico");
    /* grafite (camadas) e diamante (rede) */
    const grafite = (x) => [0, 1, 2].map((k) => `<path d="M${x - 44} ${50 + k * 30} l22 -8 l22 8 l22 -8 l22 8" style="fill:none;stroke:var(--ink);stroke-width:2"/>` + [0, 1, 2, 3, 4].map((i) => `<circle cx="${x - 44 + i * 22}" cy="${50 + k * 30 - (i % 2 ? 8 : 0)}" r="4.5" style="fill:var(--ink)"/>`).join("")).join("") + D.txt(x, 150, "grafite: camadas", "tx2");
    const diamante = (x) => `<path d="M${x} 30 L${x - 34} 62 L${x} 94 L${x + 34} 62 Z M${x} 30 L${x} 94 M${x - 34} 62 L${x + 34} 62 M${x - 34} 62 L${x - 17} 116 L${x} 94 L${x + 17} 116 L${x + 34} 62" style="fill:none;stroke:var(--ink);stroke-width:2"/>` + [[0, 30], [-34, 62], [34, 62], [0, 94], [-17, 116], [17, 116], [0, 62]].map(([a, b]) => `<circle cx="${x + a}" cy="${b}" r="4.5" style="fill:var(--ink)"/>`).join("") + D.txt(x, 150, "diamante: rede 3D", "tx2");

    const SIST = [
      { nome: "água líquida com cubos de gelo", comp: 1, fases: 2, cam: [[0.6, A, "água"], [0.25, "var(--ink)", "gelo"]], por: "gelo e água são a mesma substância, $\\ce{H2O}$, em dois estados: um componente, duas fases" },
      { nome: "água, óleo e areia", comp: 3, fases: 3, cam: [[0.2, C, "areia"], [0.45, A, "água"], [0.2, "var(--ok)", "óleo"]], por: "nenhum dos três se dissolve nos outros: cada um é uma fase" },
      { nome: "água com sal totalmente dissolvido e óleo", comp: 3, fases: 2, cam: [[0.6, A, "água + sal"], [0.25, "var(--ok)", "óleo"]], por: "o sal dissolvido some dentro da água (uma fase só, a solução); o óleo fica separado" },
      { nome: "água com muito sal: parte dissolveu e parte ficou no fundo", comp: 2, fases: 2, cam: [[0.15, "var(--ink)", "sal"], [0.65, A, "água + sal"]], por: "a solução é uma fase e o sal que sobrou no fundo é outra" },
    ];
    const exemplos = F.exemplo({
      titulo: "Classificar e medir",
      casos: [
        { nome: "Fácil: contar fases e componentes", gerar: (p) => {
          const s = p ? SIST[0] : F.escolha(SIST);
          return { enun: R`<p>Um béquer contém ${s.nome}. Quantos componentes e quantas fases tem esse sistema? Ele é homogêneo ou heterogêneo? É uma substância pura ou uma mistura?</p>`, fig: fig(bequer(280, s.cam, "")),
            passos: [R`<p>(i) <b>Componentes</b> = substâncias diferentes presentes. Aqui: ${s.comp}.</p>`,
              R`<p>(ii) <b>Fases</b> = porções com aspecto uniforme, separadas por uma superfície visível. Aqui: ${s.fases}, porque ${s.por}.</p>`,
              R`<p>(iii) Mais de uma fase: o sistema é <b>heterogêneo</b>.</p>`,
              R`<p>(iv) ${s.comp === 1 ? "Há um componente só: é uma <b>substância pura</b>, apesar de o sistema ser heterogêneo. Cuidado: \"heterogêneo\" não quer dizer \"mistura\"." : "Há mais de um componente: é uma <b>mistura</b> heterogênea."} Regra geral: o número de fases não diz o número de componentes, e vice-versa.</p>`] };
        } },
        { nome: "Médio: a curva diz o que é", gerar: (p) => {
          const k = p ? 2 : F.escolha([0, 1, 2, 3]), T = [[0, 0, "substância pura", "os dois trechos de mudança de estado são patamares"], [9, 9, "mistura comum", "a temperatura sobe durante a fusão e durante a ebulição"], [0, 9, "mistura eutética", "a fusão é um patamar, mas a ebulição é uma faixa"], [9, 0, "mistura azeotrópica", "a fusão é uma faixa, mas a ebulição é um patamar"]][k];
          return { enun: R`<p>Um sólido desconhecido é aquecido com potência constante e dá a curva da figura. Ele é uma substância pura, uma mistura comum, uma mistura eutética ou uma mistura azeotrópica?</p>`, fig: curvaFig(T[0], T[1], D.txt(175, T[0] ? 118 : 128, "fusão", "tx2") + D.txt(360, T[1] ? 72 : 82, "ebulição", "tx2")),
            passos: [R`<p>(i) Ache os dois trechos de mudança de estado: são os que vêm depois de cada "quebra" da curva, entre as rampas mais inclinadas.</p>`,
              R`<p>(ii) Fusão: ${T[0] ? "a temperatura <b>sobe</b> enquanto o sólido derrete (faixa de fusão)" : "a temperatura fica <b>parada</b> (patamar)"}. Ebulição: ${T[1] ? "a temperatura <b>sobe</b> enquanto o líquido ferve (faixa de ebulição)" : "a temperatura fica <b>parada</b> (patamar)"}.</p>`,
              R`<p>(iii) Conclusão: ${T[3]}. É uma <b>${T[2]}</b>.</p>`,
              R`<p>(iv) ${k === 0 ? "Dois patamares é o critério experimental de pureza: é assim que um laboratório confere se um produto está puro." : k === 2 ? "Exemplo real: a solda de estanho (63%) e chumbo (37%) funde inteira a 183 °C, abaixo dos dois metais puros (232 °C e 327,5 °C)." : k === 3 ? "Exemplo real: etanol com 4,4% de água ferve inteiro a 78,2 °C. Por isso a destilação não passa do álcool 96." : "Exemplo real: água com sal. O gelo salgado começa a derreter abaixo de 0 °C, e a salmoura ferve acima de 100 °C, cada vez mais quente."}</p>`] };
        } },
        { nome: "Olimpíada: grafite sob pressão", gerar: (p) => {
          const m = p ? 12 : F.escolha([12, 6, 24]), Vg = m / 2.26, Vd = m / 3.51;
          return { enun: R`<p>Grafite ($d = 2{,}26$ g/cm³) e diamante ($d = 3{,}51$ g/cm³) são feitos só de átomos de carbono. Para ${F.t(m, 1)} g de carbono: (a) que volume ocupa cada forma? (b) De quantos por cento o volume diminui quando o grafite vira diamante? (c) Use isso para explicar por que se fabrica diamante sintético com pressões enormes.</p>`,
            fig: fig(grafite(170) + D.seta(250, 80, 310, 80, "var(--ink2)") + D.txt(280, 68, "pressão", "tx2") + diamante(400)),
            passos: [R`<p>(i) $V = \frac md$ ${F.ret("A02")}. Grafite: $\frac{${F.m(m, 1)}}{2{,}26} = ${F.m(Vg, 2)}$ cm³. Diamante: $\frac{${F.m(m, 1)}}{3{,}51} = ${F.m(Vd, 2)}$ cm³.</p>`,
              R`<p>(ii) Variação: $\frac{${F.m(Vd, 2)} - ${F.m(Vg, 2)}}{${F.m(Vg, 2)}} = ${F.n((Vd / Vg - 1), 3)}$: o volume cai ${F.nt((1 - Vd / Vg) * 100, 1)}% (e o resultado não depende da massa escolhida, porque é uma razão de densidades).</p>`,
              R`<p>(iii) Os mesmos átomos, mais apertados: no diamante cada carbono se liga a quatro vizinhos numa rede em três dimensões; no grafite, a três vizinhos em camadas afastadas umas das outras.</p>`,
              R`<p>(iv) Apertar um material favorece a forma que ocupa menos espaço. Por isso a pressão muito alta (dezenas de milhares de atmosferas, com temperatura alta) empurra o carbono para a forma diamante. Em condições ambientes o grafite é a forma mais estável, e o diamante só não vira grafite porque a transformação é lentíssima.</p>`] };
        } },
      ],
    });

    const chefao = F.chefao({
      titulo: "Quatro frascos sem rótulo e dois pós que são o mesmo",
      enun: R`<p>Um laboratório recebeu quatro sólidos (A, B, C, D) e registrou a curva de aquecimento de cada um (figura, esquemática). Sabe-se que entre eles há: um metal puro, uma liga de solda (estanho e chumbo), uma salmoura congelada e um álcool hidratado congelado na composição em que ele ferve como se fosse puro.</p>
        <p>(a) Diga qual frasco é qual, justificando pela curva. (b) A análise da liga mostrou 31,5 g de estanho em 50,0 g de amostra. Qual a porcentagem em massa de cada metal? (c) O dono da liga diz: "ela funde numa temperatura só, então é uma substância pura". Que medida derruba essa afirmação? (d) Outro cliente trouxe um pó preto e um cristal transparente e duríssimo. Queimando 0,600 g de cada um em oxigênio de sobra, os dois deram 2,20 g de $\ce{CO2}$ e nenhum outro produto. O que isso prova? Use a lei de Lavoisier para achar a massa de oxigênio consumida. (e) Os dois sólidos do item (d) são a mesma substância? Dê duas propriedades que mostram que não. (f) Um aluno conclui: "se dois materiais têm a mesma composição, têm as mesmas propriedades". Corrija a frase em uma linha.</p>`,
      fig: quatroCurvas,
      dicas: [R`<p>(a) Para cada curva, olhe os dois trechos de mudança de estado: patamar ou faixa? São quatro combinações, uma para cada frasco.</p>`,
        R`<p>(c) Uma mistura eutética imita a substância pura numa das duas mudanças de estado. Em qual ela se entrega?</p>`,
        R`<p>(d) Mesma massa de sólido, mesma massa de $\ce{CO2}$, nada mais formado. Sistema fechado: massa do que reagiu = massa do que se formou ${F.ret("A01")}.</p>`],
      sol: R`<p><b>(a)</b> <b>A</b>: dois patamares → substância pura: o metal puro. <b>B</b>: duas faixas → mistura comum: a salmoura. <b>C</b>: fusão em patamar e ebulição em faixa → mistura eutética: a solda. <b>D</b>: fusão em faixa e ebulição em patamar → mistura azeotrópica: o álcool hidratado.</p>
        <p><b>(b)</b> Estanho: $\frac{31{,}5}{50{,}0} = 63{,}0\%$. Chumbo: $100 - 63{,}0 = 37{,}0\%$. É exatamente a composição eutética da solda.</p>
        <p><b>(c)</b> O ponto de ebulição. A liga eutética funde numa temperatura só (183 °C), mas não ferve numa temperatura só: a ebulição é uma faixa. Substância pura exige <b>os dois</b> patamares. Outra saída: mudar um pouco a composição (60% de estanho, por exemplo) e ver a fusão virar faixa, coisa que não aconteceria com uma substância, cuja composição não se escolhe.</p>
        <p><b>(d)</b> Os dois são feitos só de carbono, e na mesma quantidade por grama: mesma massa de sólido deu a mesma massa do mesmo único produto. Oxigênio consumido: $2{,}20 - 0{,}600 = 1{,}60$ g em cada queima (confere com a proporção fixa 12 g de carbono para 32 g de oxigênio: $0{,}600\cdot\frac{32}{12} = 1{,}60$ g).</p>
        <p><b>(e)</b> Não: são duas substâncias simples diferentes do mesmo elemento, isto é, <b>alótropos</b> (grafite e diamante). Diferem na dureza (o diamante risca tudo; o grafite risca o papel porque se desfaz em camadas), na densidade (3,51 contra 2,26 g/cm³), na condução de eletricidade (o grafite conduz; o diamante não) e na cor.</p>
        <p><b>(f)</b> "As propriedades dependem da composição <b>e da estrutura</b>: os mesmos átomos arrumados de outro jeito formam outra substância." Contas conferidas em Python.</p>`,
    });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Cada bolinha é um átomo; cores diferentes são elementos diferentes. Qual caixa representa uma <b>substância composta</b>?</p>`, fig: quatro, alts: ["I", "II", "III", "IV", "I e IV"], certa: "B", dicas: [R`<p>Composta: um tipo só de molécula, e essa molécula tem mais de um elemento.</p>`], resp: "B", sol: R`<p>II: todas as moléculas são iguais e cada uma tem dois elementos. I e IV são substâncias simples (um elemento só); III tem dois tipos de molécula: é mistura.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Na mesma figura, qual caixa representa uma <b>mistura</b>?</p>`, fig: quatro, alts: ["I", "II", "III", "IV", "Nenhuma."], certa: "C", dicas: [R`<p>Conte quantos tipos diferentes de partícula há em cada caixa.</p>`], resp: "C", sol: R`<p>III tem dois tipos de molécula misturados (duas substâncias simples). Repare: III e II têm os mesmos dois elementos, mas em II eles estão <b>ligados</b> na mesma molécula.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Um copo tem água líquida e três cubos de gelo. Quantas fases e quantos componentes há no sistema?</p>`, fig: fig(bequer(280, SIST[0].cam, "")), alts: ["1 fase e 1 componente.", "2 fases e 2 componentes.", "4 fases e 1 componente.", "2 fases e 1 componente.", "4 fases e 2 componentes."], certa: "D", dicas: [R`<p>Pedaços separados da mesma coisa, com o mesmo aspecto, contam como uma fase só.</p>`], resp: "D", sol: R`<p>Os três cubos são a mesma fase (gelo); a água líquida é a outra. E tudo é $\ce{H2O}$: um componente. Sistema heterogêneo, substância pura.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Qual dos sistemas é uma mistura <b>homogênea</b>?</p>`, fig: fig(bequer(130, [[0.2, C, "areia"], [0.6, A, "água"]], "I") + bequer(280, [[0.8, A, "água + sal"]], "II") + bequer(430, [[0.5, A, "água"], [0.3, "var(--ok)", "óleo"]], "III")), alts: ["I: água e areia.", "II: água com sal dissolvido.", "III: água e óleo.", "I e III.", "Nenhum."], certa: "B", dicas: [R`<p>Homogênea: uma fase só, mesmo aspecto em todo ponto.</p>`], resp: "B", sol: R`<p>O sal dissolvido se espalha partícula por partícula pela água: uma fase só (uma solução). Em I e III vê-se a superfície de separação.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Oxigênio ($\ce{O2}$) e ozônio ($\ce{O3}$) são:</p>`, fig: fig(mol(170, 70, [[-9, 0, B], [9, 0, B]]) + D.txt(170, 110, "O₂", "tx2") + mol(390, 70, [[-14, 6, B], [0, -4, B], [14, 6, B]]) + D.txt(390, 110, "O₃", "tx2"), 130), alts: ["a mesma substância em estados diferentes.", "substâncias compostas diferentes.", "alótropos: substâncias simples diferentes do mesmo elemento.", "uma mistura homogênea.", "isótopos do oxigênio."], certa: "C", dicas: [R`<p>O elemento é o mesmo. O que muda de uma molécula para a outra?</p>`], resp: "C", sol: R`<p>Mesmo elemento, número de átomos por molécula (atomicidade) diferente: alotropia. São substâncias com propriedades bem diferentes: respiramos $\ce{O2}$; o $\ce{O3}$ é tóxico e tem cheiro forte.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Uma solda eutética tem 63% de estanho em massa. Quantos gramas de estanho há num rolo de 250 g?</p>`, fig: fig(D.bloco(130, 60, 189, 44, "var(--ink3)", "estanho 63%") + D.bloco(319, 60, 111, 44, "var(--mA)", "chumbo 37%") + D.txt(280, 130, "250 g", "tx2"), 150), num: { v: 157.5, un: "g" }, dicas: [R`<p>63% de 250.</p>`], resp: "157,5 g", sol: R`<p>$0{,}63\cdot250 = 157{,}5$ g de estanho (e 92,5 g de chumbo).</p>` }),
      F.exercicio({ n: 7, nivel: "Máximo", enun: R`<p>Qual das curvas de aquecimento é de uma <b>mistura azeotrópica</b>?</p>`, fig: quatroCurvas, alts: ["A", "B", "C", "D", "Nenhuma."], certa: "D", dicas: [R`<p>Azeotrópica: ferve em temperatura constante, mas funde numa faixa.</p>`], resp: "D", sol: R`<p>D: faixa na fusão, patamar na ebulição. A é substância pura; B, mistura comum; C, eutética (o contrário de D).</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>Um sistema tem água, sal totalmente dissolvido, óleo e três pedras de gelo. Quantas fases ele tem?</p>`, fig: fig(bequer(280, [[0.5, A, "água + sal"], [0.15, "var(--ink)", "gelo"], [0.2, "var(--ok)", "óleo"]], "")), num: { v: 3, un: "fases" }, dicas: [R`<p>Sal dissolvido não é fase própria. As três pedras de gelo são uma fase só.</p>`], resp: "3 fases", sol: R`<p>Solução de água e sal (1), gelo (2), óleo (3). São três componentes (água, sal, óleo) e três fases, mas por coincidência: o gelo é uma fase a mais da água, e o sal não acrescenta nenhuma.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Quanto de $\ce{CO2}$ se forma na queima completa de 1,50 g de diamante? (12 g de carbono formam 44 g de $\ce{CO2}$.)</p>`, fig: fig(diamante(180) + D.seta(260, 80, 330, 80, "var(--bad)") + D.txt(295, 68, "+ O₂", "tx2") + D.txt(420, 85, "CO₂: ? g", "tx"), 165), num: { v: 5.5, un: "g" }, dicas: [R`<p>Diamante é carbono puro. Regra de três com 12 g → 44 g.</p>`], resp: "5,50 g", sol: R`<p>$1{,}50\cdot\frac{44}{12} = 5{,}50$ g. O mesmo resultado sairia para 1,50 g de grafite: foi assim que se provou, no fim do século XVIII, que o diamante é carbono.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>O álcool 96 das farmácias é a mistura azeotrópica: 95,6% de etanol em massa. Quantos gramas de água há em 500 g dele?</p>`, fig: fig(bequer(280, [[0.76, C, "etanol"], [0.08, A, ""]], "500 g, 95,6% de etanol"), 165), num: { v: 22, un: "g" }, dicas: [R`<p>A água é o que falta para 100%.</p>`], resp: "22 g", sol: R`<p>$100 - 95{,}6 = 4{,}4\%$ de água: $0{,}044\cdot500 = 22$ g. Essa água não sai por destilação, porque a mistura ferve inteira a 78,2 °C, como se fosse uma substância só.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Sobre grafite e diamante, é correto afirmar:</p>`, fig: fig(grafite(170) + diamante(400)), alts: ["São feitos de elementos diferentes.", "Têm as mesmas propriedades físicas, porque têm a mesma composição.", "Queimados, dão produtos diferentes.", "São misturas de carbono com impurezas diferentes.", "Diferem na arrumação dos átomos, o que explica durezas e densidades diferentes."], certa: "E", dicas: [R`<p>O que a figura mostra de diferente entre os dois?</p>`], resp: "E", sol: R`<p>Mesmo elemento, estruturas diferentes: camadas que deslizam (grafite, mole, 2,26 g/cm³) contra rede em três dimensões (diamante, duríssimo, 3,51 g/cm³). Queimados, os dois dão só $\ce{CO2}$.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Um aluno observa um líquido incolor, de aspecto uniforme, e conclui que é uma substância pura. O teste que pode mostrar que ele está errado é:</p>`, fig: curvaFig(9, 9, D.txt(280, 30, "se a curva sair assim…", "tx2")), alts: ["olhar o líquido contra a luz.", "medir a massa numa balança melhor.", "aquecer e acompanhar a temperatura durante a ebulição.", "trocar o líquido de frasco.", "medir o volume numa proveta."], certa: "C", dicas: [R`<p>Homogêneo a olho nu pode ser solução. Qual propriedade é constante só nas substâncias puras?</p>`], resp: "C", sol: R`<p>Substância pura ferve em temperatura constante; se a temperatura subir durante a ebulição, é mistura (água com sal ou com açúcar, por exemplo). Ser homogêneo não basta: toda solução é homogênea.</p>` }),
    ];

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Introdução à química · o que é uma coisa só</div>
        <div class="q">A água mineral do rótulo diz "pura". O ar da montanha é "puro". O ouro 18 quilates é "ouro". Para um químico, nenhum dos três é uma substância pura. O que falta?</div>
        <p>Falta o critério. "Puro" na conversa quer dizer limpo; em química quer dizer <b>uma substância só</b>, e existe um teste de laboratório que decide isso sem discussão.</p></div>
        ${F.chute({ q: "a água mineral de garrafa, transparente e sem nada visível, é…", ops: ["uma substância pura, porque é só água.", "uma mistura homogênea: água com sais dissolvidos.", "uma mistura heterogênea.", "uma substância simples."], certa: 1, exp: "Mistura homogênea (uma solução). O próprio rótulo lista os sais dissolvidos: bicarbonatos, cálcio, sódio, magnésio. Ela parece uma coisa só porque tem uma fase só, mas aparência uniforme não é pureza. Substância pura, mesmo, é a água destilada." })}`),

      F.secao("substancias", "Substância pura: simples ou composta", R`
        <p>Uma <b>substância pura</b> tem um tipo só de partícula (molécula ou conjunto de íons), composição fixa e propriedades constantes: densidade, ponto de fusão e ponto de ebulição sempre os mesmos, nas mesmas condições ${F.ret("A02")}. Ela pode ser:</p>
        <ul><li><b>simples</b>: formada por um elemento só. Exemplos: $\ce{O2}$, $\ce{N2}$, $\ce{Fe}$, $\ce{O3}$, $\ce{S8}$.</li>
          <li><b>composta</b>: formada por dois ou mais elementos, ligados em proporção fixa. Exemplos: $\ce{H2O}$, $\ce{CO2}$, $\ce{NaCl}$.</li></ul>
        <p>Uma <b>mistura</b> tem duas ou mais substâncias, em proporção que pode variar: ar (principalmente $\ce{N2}$ e $\ce{O2}$), água do mar, ouro 18 quilates.</p>
        ${F.fig(quatro, "I: substância simples. II: substância composta. III: mistura de duas substâncias simples. IV: substância simples de átomos soltos (um gás nobre, por exemplo).")}
        ${F.caixa("pegadinha", R`<p><b>Elemento não é substância simples.</b> "Oxigênio" pode ser o elemento (o tipo de átomo, presente na água, no gás carbônico, na ferrugem) ou a substância simples $\ce{O2}$ (o gás que respiramos). A água <b>contém</b> o elemento oxigênio, mas não contém a substância oxigênio: não dá para respirar dentro d'água. Leia a frase e decida qual dos dois o enunciado quer.</p>`)}
        ${F.caixa("fisico", R`<p><b>Composta ou mistura? Pergunte se os elementos estão ligados.</b> Hidrogênio e oxigênio misturados num frasco são uma mistura (dois gases, proporção qualquer, cada um com suas propriedades; a mistura explode com uma faísca). Hidrogênio e oxigênio <b>ligados</b> formam água: proporção fixa (2 para 1), propriedades novas (apaga fogo). Separar a mistura é trabalho físico; separar os elementos da água exige reação química.</p>`, "Pense como químico")}`),

      F.secao("misturas", "Misturas: fases e componentes", R`
        <p><b>Fase</b> é cada porção de um sistema com aspecto e propriedades uniformes. Um sistema com uma fase é <b>homogêneo</b>; com duas ou mais, <b>heterogêneo</b>. <b>Componente</b> é cada substância presente. As duas contagens são independentes.</p>
        ${F.fig(fig(bequer(100, [[0.8, A, "água + sal"]], "1 fase, 2 componentes") + bequer(280, SIST[0].cam, "2 fases, 1 componente") + bequer(460, SIST[1].cam, "3 fases, 3 componentes")), "Número de fases e número de componentes não precisam coincidir.")}
        <h3>Teorema 1: como contar fases sem errar</h3>
        ${F.demo("cinco regras", R`<p>(i) <b>Gases</b> sempre se misturam por completo: qualquer mistura de gases é uma fase só.</p>
          <p>(ii) <b>Sólido dissolvido</b> não é fase: sal dissolvido na água faz parte da fase líquida. Se sobrar sólido no fundo (corpo de fundo), aí sim ele é uma fase.</p>
          <p>(iii) <b>Líquidos</b>: os que se misturam (água e álcool) dão uma fase; os que não se misturam (água e óleo), uma fase cada.</p>
          <p>(iv) <b>Sólidos diferentes, em pedaços</b>: em geral, cada sólido é uma fase (granito: quartzo, feldspato e mica, três fases). A exceção são as ligas metálicas bem fundidas, que são soluções sólidas.</p>
          <p>(v) <b>Pedaços separados do mesmo material</b> são uma fase só: dez cubos de gelo contam um. E estados diferentes da mesma substância são fases diferentes: água com gelo tem duas.</p>`)}
        ${F.formula(R`\text{sistema homogêneo}: 1\ \text{fase}\qquad\qquad \text{sistema heterogêneo}: 2\ \text{ou mais fases}`, "Fases")}
        ${F.caixa("pegadinha", R`<p><b>Homogêneo a olho nu, heterogêneo no microscópio.</b> Leite, sangue, maionese e neblina parecem uniformes, mas ao microscópio mostram gotículas ou partículas espalhadas: são misturas heterogêneas (coloides e suspensões). O critério da prova é o do instrumento, não o do olho. E o contrário também engana: água com gelo é heterogênea e é uma substância pura.</p>`)}`),

      F.secao("curvas", "O teste que decide: a curva de aquecimento", R`
        <p>No tema anterior, a substância pura mostrou dois patamares ${F.ret("A03")}. Uma mistura comum não mostra nenhum: funde e ferve em <b>faixas</b> de temperatura, porque a composição do que ainda não mudou de estado vai mudando pelo caminho. E existem dois casos especiais, que imitam a substância pura pela metade.</p>
        ${F.fig(quatroCurvas, "A: substância pura. B: mistura comum. C: mistura eutética. D: mistura azeotrópica.")}
        <table class="tb"><tr><th></th><th>Fusão</th><th>Ebulição</th><th>Exemplo</th></tr>
          <tr><td><b>substância pura</b></td><td>patamar</td><td>patamar</td><td>água destilada: 0 °C e 100 °C</td></tr>
          <tr><td><b>mistura comum</b></td><td>faixa</td><td>faixa</td><td>água com sal</td></tr>
          <tr><td><b>mistura eutética</b></td><td>patamar</td><td>faixa</td><td>solda: 63% de estanho e 37% de chumbo, funde a 183 °C</td></tr>
          <tr><td><b>mistura azeotrópica</b></td><td>faixa</td><td>patamar</td><td>etanol com 4,4% de água, ferve a 78,2 °C</td></tr></table>
        ${F.formula(R`\text{substância pura}\iff \text{PF constante}\ \ \textbf{e}\ \ \text{PE constante}`, "Critério de pureza")}
        <p>As misturas eutética e azeotrópica só existem numa composição exata: mude a proporção e as duas viram mistura comum.</p>
        <div id="lab-curvas"></div>
        <h3>Teorema 2: composição em porcentagem de massa</h3>
        ${F.demo("quanto de cada coisa", R`<p>(i) A fração em massa de um componente é a massa dele dividida pela massa total da mistura. Multiplicada por 100, é a porcentagem em massa.</p>
          <p>(ii) Solda com 157,5 g de estanho em 250 g: $\frac{157{,}5}{250} = 0{,}63 = 63\%$. O chumbo é o resto: $100 - 63 = 37\%$, porque as porcentagens de todos os componentes somam 100.</p>
          <p>(iii) No sentido contrário: 500 g de álcool com 95,6% de etanol têm $0{,}956\cdot500 = 478$ g de etanol e $500 - 478 = 22$ g de água.</p>
          <p>(iv) A porcentagem em massa é uma razão de duas massas: é intensiva ${F.ret("A02")}. Uma gota e um tanque da mesma mistura têm a mesma composição. É isso que permite analisar uma amostra pequena e concluir sobre o lote inteiro.</p>`)}
        ${F.formula(R`\%\,\text{em massa de A} = \frac{m_\text{A}}{m_\text{total}}\times100\%\qquad\qquad \sum \% = 100\%`, "Composição de uma mistura")}`),

      F.secao("alotropia", "Alotropia: o mesmo elemento, substâncias diferentes", R`
        <p><b>Alotropia</b> é a propriedade de um elemento formar mais de uma substância simples. As formas, chamadas <b>alótropos</b>, diferem em uma de duas coisas: no número de átomos por molécula (atomicidade) ou na arrumação dos átomos (estrutura).</p>
        <table class="tb"><tr><th>Elemento</th><th>Alótropos</th><th>O que muda</th><th>Mais estável (condições ambientes)</th></tr>
          <tr><td><b>oxigênio</b></td><td>$\ce{O2}$ (gás oxigênio) e $\ce{O3}$ (ozônio)</td><td>atomicidade</td><td>$\ce{O2}$</td></tr>
          <tr><td><b>carbono</b></td><td>grafite, diamante, fulerenos ($\ce{C60}$), grafeno, nanotubos</td><td>estrutura</td><td>grafite</td></tr>
          <tr><td><b>fósforo</b></td><td>branco ($\ce{P4}$) e vermelho (cadeias longas)</td><td>atomicidade e estrutura</td><td>vermelho (entre esses dois)</td></tr>
          <tr><td><b>enxofre</b></td><td>rômbico e monoclínico (os dois de $\ce{S8}$)</td><td>arrumação dos anéis no cristal</td><td>rômbico (abaixo de 95,5 °C)</td></tr></table>
        ${F.fig(fig(grafite(170) + diamante(400)), "Os mesmos átomos de carbono. No grafite, camadas que deslizam; no diamante, uma rede rígida em três dimensões.")}
        <p>O grafite é mole, cinza e conduz eletricidade; o diamante é o mais duro dos materiais naturais, transparente e isolante. Mesmo assim, queimados, os dois dão exatamente o mesmo produto, na mesma quantidade: 12 g de qualquer um formam 44 g de $\ce{CO2}$. É a prova de que são o mesmo elemento. O ozônio, alótropo do oxigênio, é tóxico para respirar e, lá no alto da atmosfera, protege a Terra dos raios ultravioleta.</p>
        ${F.caixa("pegadinha", R`<p><b>Só no laboratório da escola, e a maior parte nem lá.</b> Nada desta seção se testa em casa. O <b>fósforo branco</b> pega fogo sozinho em contato com o ar e é muito tóxico: guarda-se debaixo d'água e não é material de aula. O <b>ozônio</b> irrita os pulmões mesmo em pouca quantidade: nada de "purificador de ozônio" em quarto fechado. Queimar enxofre libera $\ce{SO2}$, gás tóxico: só em capela. Grafite de lápis e a tabela de dados bastam para estudar alotropia.</p>`, "Segurança e descarte")}
        ${F.caixa("olimpiada", R`<p><b>Como isso é cobrado.</b> Três formatos. (1) Caixas de bolinhas coloridas para classificar em substância simples, composta ou mistura (às vezes com a pergunta "quantas substâncias há na caixa?"). (2) Contagem de fases e componentes em sistemas montados para confundir: gelo na água, sal dissolvido com sal no fundo, mistura de gases. (3) Quatro curvas de aquecimento para associar a pura, comum, eutética e azeotrópica. Em alotropia, o que se pede é reconhecer os pares (e não confundir com isótopos, que são átomos, nem com isômeros, que são substâncias compostas) e saber qual forma é a mais estável.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, eutético e azeótropo deixam de ser casos soltos e viram pontos de um mapa, o <b>diagrama de fases</b> de dois componentes, com a regra das fases de Gibbs por trás ($F = C - P + 2$, em que $C$ é o número de componentes e $P$ o de fases). E a pergunta "qual alótropo é o mais estável?" é respondida com a energia livre de Gibbs ${F.ret("F03")}: o diamante é instável em relação ao grafite a 1 atm, e só sobrevive porque a barreira para a transformação é enorme (estabilidade cinética, não termodinâmica).</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-curvas"); e.outerHTML = F.lab("A curva denuncia: pura, comum, eutética ou azeotrópica?", "lab-curvas"); SIM.qCurvas(document.getElementById("lab-curvas"), F); },
});
