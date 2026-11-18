/* Química A02 · Matéria, energia e propriedades da matéria. Conferido em Python:
   densidades (g/cm³, 20 °C): Al 2,70; pirita 5,0; Fe 7,87; Cu 8,96; Zn 7,14; Ag 10,5; Pb 11,3; Au 19,3; etanol 0,789; água 0,998; gelo 0,917;
   150 kcal = 627,6 kJ; exemplo 1: 54,0/20,0 = 2,70 (Al); 157,4/20 = 7,87 (Fe); 179,2/20 = 8,96 (Cu); 226,0/20 = 11,3 (Pb);
   exemplo 2 (coroa de 1000 g, ouro + prata): 700 g de ouro → 64,8 cm³; 800 g → 60,5 cm³; 500 g → 73,5 cm³; ouro puro 51,8 cm³;
   exemplo 3: 5,0e−5 cm³ sobre 500 cm² → 1,0e−7 cm = 1,0 nm (4,0e−5/400 = 1,0 nm; 6,0e−5/500 = 1,2 nm);
   exercícios: 3) 135/50 = 2,70; 4) 2500 cm³; 6) 2000·0,789 = 1578 g; 7) 59,0/7,5 = 7,87; 8) 250·4,184 = 1046 kJ;
   10) 300/8,96 + 100/7,14 = 47,49 cm³ → 400/47,49 = 8,42; 11) 19 300 kg/m³; 12) 97,2/2,70 = 36,0 cm³ sobre 30 000 cm² = 0,0012 cm = 12 µm;
   chefão: 50,0·0,998 + 50,0·0,789 = 89,35 g; aditivo 0,8935; real 89,35/96,4 = 0,927 g/mL; contração 3,6 mL (3,6%);
   fraude: 162,0 g em 200 mL = 0,810 g/mL; supondo volumes aditivos, fração de água em volume (0,810 − 0,789)/(0,998 − 0,789) = 10,0% → 20 mL. */
F.registrar("quimica/A02", {
  retoma: ["A01"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const balanca = (x, leit, corpo = "", rot = "") => `<rect x="${x - 60}" y="134" width="120" height="30" rx="5" style="fill:var(--card2);stroke:var(--ink3);stroke-width:1.5"/><rect x="${x - 48}" y="128" width="96" height="6" rx="2" style="fill:var(--ink3)"/><rect x="${x - 40}" y="139" width="80" height="20" rx="4" style="fill:var(--bg);stroke:var(--line)"/>` + D.txt(x, 154, leit, "tx", "middle", 'style="font-weight:700"') + corpo + (rot ? D.txt(x, 16, rot, "tx2") : "");
    const cubo = (x, lado, cor = "var(--mod)") => `<rect x="${x - lado / 2}" y="${128 - lado}" width="${lado}" height="${lado}" rx="2" style="fill:color-mix(in srgb,${cor} 45%,transparent);stroke:${cor};stroke-width:2"/>`;
    /* proveta: base em y = 160, 100 mL = 130 px; nível em mL; pedaço opcional no fundo */
    const proveta = (x, mL, rot, pedaco = false, cor = "var(--mA)") => { const y = (v) => 160 - v * 1.3; return `<rect x="${x - 17}" y="${y(mL)}" width="34" height="${160 - y(mL)}" style="fill:color-mix(in srgb,${cor} 26%,transparent)"/><path d="M${x - 19} 22 L${x - 19} 160 L${x + 19} 160 L${x + 19} 22" style="fill:none;stroke:var(--ink2);stroke-width:2"/>` + [20, 40, 60, 80, 100].map((v) => `<line x1="${x + 19}" x2="${x + 11}" y1="${y(v)}" y2="${y(v)}" style="stroke:var(--ink3)"/>`).join("") + (pedaco ? `<rect x="${x - 9}" y="140" width="18" height="18" rx="2" style="fill:var(--ink3);stroke:var(--ink2)"/>` : "") + `<line x1="${x - 26}" x2="${x + 19}" y1="${y(mL)}" y2="${y(mL)}" style="stroke:var(--warn);stroke-dasharray:4 3"/>` + D.txt(x - 30, y(mL) + 4, rot, "tx2", "end"); };
    const tab = (x, y, larg, linhas) => linhas.map((l, i) => l.map((c, j) => D.txt(x + larg.slice(0, j).reduce((a, b) => a + b, 0) + larg[j] / 2, y + i * 22, c, "tx2", "middle", i ? "" : 'style="font-weight:700;fill:var(--ink)"')).join("")).join("") + `<line x1="${x}" x2="${x + larg.reduce((a, b) => a + b, 0)}" y1="${y + 7}" y2="${y + 7}" style="stroke:var(--ink3)"/>`;
    const tabDens = tab(330, 30, [110, 100], [["material", "d (g/cm³)"], ["alumínio", "2,70"], ["ferro", "7,87"], ["cobre", "8,96"], ["prata", "10,5"], ["chumbo", "11,3"], ["ouro", "19,3"]]);
    const dois = (a, b, ra, rb) => fig(cubo(170, a) + D.txt(170, 150, ra, "tx2") + cubo(390, b) + D.txt(390, 150, rb, "tx2") + `<line x1="60" x2="500" y1="128" y2="128" style="stroke:var(--ink2);stroke-width:2"/>`, 160);
    const copoLiq = (x, cor, rot, boia) => D.copo(x - 40, 40, 80, 90, 0.75, cor) + `<rect x="${x - 12}" y="${boia ? 56 : 104}" width="24" height="24" rx="3" style="fill:color-mix(in srgb,var(--ink) 55%,transparent);stroke:var(--ink)"/>` + D.txt(x, 150, rot, "tx2");

    const exemplos = F.exemplo({
      titulo: "Densidade e unidades",
      casos: [
        { nome: "Fácil: que metal é este?", gerar: (p) => {
          const [nome, d] = p ? ["alumínio", 2.7] : F.escolha([["alumínio", 2.7], ["ferro", 7.87], ["cobre", 8.96], ["chumbo", 11.3]]), V = 20, m = d * V;
          return { enun: R`<p>Um pedaço de metal sem identificação marca ${F.t(m, 1)} g na balança. Mergulhado numa proveta com 50,0 mL de água, faz o nível subir para 70,0 mL. Use a tabela e descubra o metal.</p>`,
            fig: fig(proveta(110, 50, "50,0 mL") + proveta(230, 70, "70,0 mL", true) + tabDens, 185),
            passos: [R`<p>(i) Volume do pedaço = volume de água deslocado: $V = 70{,}0 - 50{,}0 = 20{,}0$ mL $= 20{,}0$ cm³ (1 mL é exatamente 1 cm³).</p>`,
              R`<p>(ii) Densidade: $d = \frac mV = \frac{${F.m(m, 1)}}{20{,}0} = ${F.m(d, 2)}$ g/cm³.</p>`,
              R`<p>(iii) Na tabela, esse valor é o do <b>${nome}</b>. A massa e o volume, sozinhos, não diriam nada: um pedaço maior teria os dois maiores. A razão entre eles é que identifica o material.</p>`] };
        } },
        { nome: "Médio: a coroa de Arquimedes", gerar: (p) => {
          const x = p ? 700 : F.escolha([700, 800, 500]), V = +(x / 19.3 + (1000 - x) / 10.5).toFixed(1), xs = (V - 1000 / 10.5) / (1 / 19.3 - 1 / 10.5);
          return { enun: R`<p>Uma coroa de 1000 g, que deveria ser de ouro puro ($d = 19{,}3$ g/cm³), desloca ${F.t(V, 1)} cm³ de água. O ourives pode ter misturado prata ($d = 10{,}5$ g/cm³). Supondo que os volumes dos dois metais simplesmente se somam, quanto ouro há na coroa?</p>`,
            fig: fig(`<path d="M120 120 L132 60 L152 96 L172 52 L192 96 L212 60 L224 120 Z" style="fill:color-mix(in srgb,var(--warn) 45%,transparent);stroke:var(--warn);stroke-width:2"/>` + D.txt(172, 142, "1000 g", "tx2") + D.seta(240, 95, 280, 95, "var(--ink2)") + proveta(440, 62, F.t(V, 1) + " cm³ a mais", true, "var(--mA)"), 175),
            passos: [R`<p>(i) Teste rápido: 1000 g de ouro puro ocupariam $\frac{1000}{19{,}3} = 51{,}8$ cm³. A coroa ocupa $${F.m(V, 1)}$ cm³: volume demais para a massa que tem. Há um metal menos denso misturado.</p>`,
              R`<p>(ii) Seja $x$ a massa de ouro (em g). A prata é $1000 - x$. Volumes: $\frac{x}{19{,}3} + \frac{1000 - x}{10{,}5} = ${F.m(V, 1)}$.</p>`,
              R`<p>(iii) $\frac{1000}{10{,}5} = 95{,}24$. Então $x\left(\frac{1}{19{,}3} - \frac{1}{10{,}5}\right) = ${F.m(V, 1)} - 95{,}24$, isto é, $x\cdot(-0{,}04342) = ${F.m(V - 1000 / 10.5, 2)}$.</p>`,
              R`<p>(iv) $x \approx ${F.n(Math.round(xs / 10) * 10)}$ g de ouro e cerca de ${F.nt(1000 - Math.round(xs / 10) * 10)} g de prata. A balança sozinha não pegaria a fraude (a massa está certa); a densidade pegou.</p>`] };
        } },
        { nome: "Olimpíada: o tamanho de uma molécula", gerar: (p) => {
          const [V, A] = p ? [5, 500] : F.escolha([[5, 500], [4, 400], [6, 500]]), e = (V * 1e-5) / A;
          return { enun: R`<p>Uma gota com $${F.n(V)}{,}0\times10^{-5}$ cm³ de um óleo é posta sobre água parada. O óleo se espalha até formar uma mancha de ${A} cm², com uma única camada de moléculas de espessura. Estime o tamanho de uma molécula, em nanômetros.</p>`,
            fig: fig(`<rect x="80" y="110" width="400" height="40" style="fill:color-mix(in srgb,var(--mA) 25%,transparent)"/><rect x="140" y="106" width="280" height="4" style="fill:var(--warn)"/>` + D.txt(280, 96, `mancha de ${A} cm², uma molécula de altura`, "tx2") + D.txt(280, 136, "água", "tx2") + `<circle cx="280" cy="40" r="7" style="fill:var(--warn)"/>` + D.seta(280, 52, 280, 80, "var(--ink2)", 1.5) + D.txt(300, 44, "gota", "tx2", "start"), 160),
            passos: [R`<p>(i) A mancha é um "prisma" muito baixo: volume = área × espessura. O volume de óleo não muda ao se espalhar.</p>`,
              R`<p>(ii) Espessura: $e = \frac VA = \frac{${F.n(V)}{,}0\times10^{-5}}{${A}} = ${F.n(e * 1e7, 2)}\times10^{-7}$ cm.</p>`,
              R`<p>(iii) Unidades: 1 cm $= 10^{-2}$ m e 1 nm $= 10^{-9}$ m, então 1 cm $= 10^{7}$ nm. $e = ${F.n(e * 1e7, 2)}\times10^{-7}\cdot10^{7} = ${F.n(e * 1e7, 2)}$ nm.</p>`,
              R`<p>(iv) Se a camada tem uma molécula de altura, a molécula tem cerca de ${F.nt(e * 1e7, 2)} nm. Com uma gota, uma bacia e uma régua mede-se algo um milhão de vezes menor que um milímetro. A ideia é do século XVIII (Benjamin Franklin espalhou óleo num lago) e foi usada mais tarde para estimar o tamanho das moléculas.</p>`] };
        } },
      ],
    });

    const chefao = F.chefao({
      titulo: "O volume que some",
      enun: R`<p>A 20 °C, a água tem 0,998 g/mL e o etanol tem 0,789 g/mL. Você mede 50,0 mL de cada um, em provetas separadas, despeja os dois numa proveta de 100 mL e mistura. A balança mostra a soma exata das duas massas, mas o nível para em <b>96,4 mL</b>.</p>
        <p>(a) Qual a massa da mistura? (b) Que densidade você preveria se os volumes se somassem? E qual é a densidade de verdade? (c) O volume é uma propriedade extensiva: dobrar a quantidade de água dobra o volume. Então por que $50{,}0 + 50{,}0 \neq 100{,}0$? Dê uma explicação com o modelo de partículas e diga qual grandeza a balança garante que se soma. (d) Um posto vende "etanol" e um fiscal mede 162,0 g em 200,0 mL. Mostre que há algo errado e estime, supondo volumes aditivos, quantos mL de água há na amostra. (e) A estimativa do item (d) é maior ou menor que o valor real? Justifique com o que você viu em (b). (f) Por que o fiscal consegue fazer esse teste com uma amostra de qualquer tamanho?</p>`,
      fig: fig(proveta(100, 50, "água: 50,0 mL") + D.txt(165, 100, "+", "tx") + proveta(260, 50, "etanol: 50,0 mL", false, "var(--warn)") + D.seta(310, 100, 370, 100, "var(--ink2)") + proveta(470, 96.4, "96,4 mL", false, "var(--ok)"), 180),
      dicas: [R`<p>(a) e (b): massa de cada líquido = densidade × volume. As massas se somam sempre (lei de Lavoisier ${F.ret("A01")}).</p>`,
        R`<p>(c) Pense em um copo de feijão despejado sobre um copo de areia: cabem dois copos?</p>`,
        R`<p>(d) Chame de $x$ a fração do volume que é água: a densidade da mistura, com volumes aditivos, é $0{,}998x + 0{,}789(1 - x)$.</p>`],
      sol: R`<p><b>(a)</b> Água: $50{,}0\cdot0{,}998 = 49{,}90$ g. Etanol: $50{,}0\cdot0{,}789 = 39{,}45$ g. Total: <b>89,35 g</b>.</p>
        <p><b>(b)</b> Com volumes aditivos: $\frac{89{,}35}{100{,}0} = 0{,}894$ g/mL. De verdade: $\frac{89{,}35}{96{,}4} = $ <b>0,927 g/mL</b>. A mistura é mais densa do que a conta ingênua prevê, porque encolheu 3,6 mL (3,6%).</p>
        <p><b>(c)</b> "Extensiva" quer dizer que a grandeza é proporcional à quantidade <b>da mesma amostra</b>: 100 mL de água têm o dobro do volume de 50 mL de água. Isso não obriga volumes de substâncias <b>diferentes</b> a se somarem. As moléculas de água e de etanol se atraem e se encaixam umas nos espaços das outras, como a areia entra nos vãos do feijão. O que se soma sempre é a massa, porque nenhuma partícula sumiu.</p>
        <p><b>(d)</b> Densidade da amostra: $\frac{162{,}0}{200{,}0} = 0{,}810$ g/mL, maior que 0,789: há algo mais denso misturado. Com volumes aditivos: $0{,}998x + 0{,}789(1 - x) = 0{,}810 \Rightarrow x = \frac{0{,}810 - 0{,}789}{0{,}998 - 0{,}789} = \frac{0{,}021}{0{,}209} = 0{,}100$. Cerca de <b>20 mL de água</b> em 200 mL.</p>
        <p><b>(e)</b> É maior que o real. Em (b) vimos que a mistura fica mais densa do que a soma simples prevê. Então, para chegar a 0,810 g/mL, basta menos água do que a conta com volumes aditivos indica. A estimativa de 10% é um teto. (Na prática o fiscal usa uma tabela de densidade medida para cada composição, não a conta linear.)</p>
        <p><b>(f)</b> Porque a densidade é intensiva: 200 mL, 20 mL ou o tanque inteiro dão o mesmo valor. É por isso que uma propriedade intensiva serve para fiscalizar e uma extensiva não. Contas conferidas em Python.</p>`,
    });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Uma barra de ouro é cortada ao meio. Qual das propriedades de cada metade continua igual à da barra inteira?</p>`, fig: dois(70, 50, "barra inteira", "metade"), alts: ["A massa.", "O volume.", "A densidade.", "O peso.", "A quantidade de calor necessária para fundi-la."], certa: "C", dicas: [R`<p>Quais dessas grandezas dobram quando você junta duas metades?</p>`], resp: "C", sol: R`<p>Massa, volume, peso e o calor para fundir dependem da quantidade (extensivas). A densidade é a razão $\frac mV$: os dois caem pela metade e a razão não muda (intensiva).</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>"O etanol queima com chama azulada." Essa frase descreve uma propriedade:</p>`, fig: fig(D.copo(240, 80, 80, 50, 0.5, "var(--mA)") + D.chama(280, 78, 1.6) + D.txt(280, 156, "etanol", "tx2"), 165), alts: ["geral, porque todo material tem.", "física, porque a cor é vista a olho nu.", "organoléptica, porque envolve um sentido.", "química, porque só aparece quando o etanol se transforma em outras substâncias.", "extensiva, porque depende da quantidade."], certa: "D", dicas: [R`<p>Depois de queimar, o etanol ainda é etanol?</p>`], resp: "D", sol: R`<p>Combustibilidade é propriedade química: para observá-la, a substância tem de virar outra ($\ce{CO2}$ e água). A cor da chama se vê, mas o que está sendo descrito é a transformação.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Um bloco tem 135 g e 50 cm³. Qual a sua densidade, em g/cm³?</p>`, fig: fig(balanca(280, "135 g", cubo(280, 60), "50 cm³")), num: { v: 2.7, un: "g/cm³" }, dicas: [R`<p>$d = \frac mV$.</p>`], resp: "2,70 g/cm³", sol: R`<p>$\frac{135}{50} = 2{,}70$ g/cm³: é alumínio.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Uma garrafa tem 2,5 L de água. Quantos cm³ são?</p>`, fig: fig(`<path d="M250 150 L250 70 Q250 50 268 44 L268 22 L292 22 L292 44 Q310 50 310 70 L310 150 Z" style="fill:color-mix(in srgb,var(--mA) 22%,transparent);stroke:var(--ink2);stroke-width:2"/>` + D.txt(280, 105, "2,5 L", "tx2") + D.txt(400, 90, "1 L = 1 dm³", "tx2"), 165), num: { v: 2500, un: "cm³" }, dicas: [R`<p>1 dm = 10 cm. Eleve ao cubo.</p>`], resp: "2500 cm³", sol: R`<p>1 L $= 1$ dm³ $= (10\text{ cm})^3 = 1000$ cm³. Então $2{,}5\cdot1000 = 2500$ cm³ (ou 2500 mL).</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Você recebe um pó branco e quer saber se é sal de cozinha ou açúcar, sem provar. Qual medida ajuda mais?</p>`, fig: fig(D.bloco(120, 60, 130, 60, "var(--ink3)", "pó branco A") + D.bloco(310, 60, 130, 60, "var(--ink3)", "pó branco B") + D.txt(280, 150, "mesma cor, mesma massa, mesmo volume", "tx2"), 165), alts: ["A massa da amostra.", "O volume da amostra.", "A temperatura da amostra.", "O ponto de fusão.", "A cor."], certa: "D", dicas: [R`<p>Procure uma propriedade específica: uma que mude de substância para substância e não dependa da quantidade.</p>`], resp: "D", sol: R`<p>O ponto de fusão é específico e intensivo: o açúcar derrete (e escurece) perto de 186 °C, e o sal só a 801 °C. Massa e volume são gerais, qualquer coisa tem; a cor aqui é a mesma.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Qual a massa de 2,0 L de etanol ($d = 0{,}789$ g/mL)? Responda em gramas.</p>`, fig: fig(proveta(200, 77, "etanol", false, "var(--warn)") + D.txt(380, 80, "d = 0,789 g/mL", "tx2") + D.txt(380, 104, "V = 2,0 L", "tx2"), 175), num: { v: 1578, un: "g" }, dicas: [R`<p>Converta o volume para mL antes de multiplicar.</p>`], resp: "1578 g", sol: R`<p>$m = d\cdot V = 0{,}789\cdot2000 = 1578$ g. Dois litros de etanol pesam menos de 1,6 kg; dois litros de água pesam quase 2 kg.</p>` }),
      F.exercicio({ n: 7, nivel: "Máximo", enun: R`<p>Um parafuso marca 59,0 g. Numa proveta, o nível da água passa de 40,0 mL para 47,5 mL quando ele é mergulhado. Qual a densidade do parafuso, em g/cm³?</p>`, fig: fig(proveta(160, 40, "40,0 mL") + proveta(300, 47.5, "47,5 mL", true) + D.txt(430, 90, "59,0 g", "tx2"), 175), num: { v: 7.87, un: "g/cm³" }, dicas: [R`<p>O volume do parafuso é o quanto o nível subiu.</p>`], resp: "7,87 g/cm³", sol: R`<p>$V = 47{,}5 - 40{,}0 = 7{,}5$ cm³. $d = \frac{59{,}0}{7{,}5} = 7{,}87$ g/cm³: ferro (ou aço).</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>O rótulo de um chocolate informa 250 kcal por porção. Quanto é isso em kJ? (1 cal = 4,184 J)</p>`, fig: fig(D.bloco(190, 50, 180, 70, "var(--warn)", "250 kcal por porção") + D.txt(280, 150, "1 kcal = 1000 cal", "tx2"), 165), num: { v: 1046, un: "kJ" }, dicas: [R`<p>kcal para kJ usa o mesmo fator de cal para J, porque os dois "k" se cancelam.</p>`], resp: "1046 kJ", sol: R`<p>$250\text{ kcal}\cdot4{,}184\ \frac{\text{kJ}}{\text{kcal}} = 1046$ kJ.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Um cubo de gelo ($d = 0{,}917$ g/cm³) é posto num copo com água (0,998 g/cm³) e outro igual num copo com etanol (0,789 g/cm³). O que acontece?</p>`, fig: fig(copoLiq(170, "var(--mA)", "água: ?", true) + copoLiq(390, "var(--warn)", "etanol: ?", false)), alts: ["Boia nos dois.", "Afunda nos dois.", "Boia na água e afunda no etanol.", "Afunda na água e boia no etanol.", "Fica parado no meio dos dois."], certa: "C", dicas: [R`<p>Um corpo boia num líquido quando é menos denso que ele ${F.ret("fisica/A17")}.</p>`], resp: "C", sol: R`<p>$0{,}917 \lt 0{,}998$: boia na água. $0{,}917 > 0{,}789$: afunda no etanol. É um jeito clássico de mostrar que um líquido transparente não é água.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Um latão é feito fundindo 300 g de cobre ($8{,}96$ g/cm³) com 100 g de zinco ($7{,}14$ g/cm³). Supondo que os volumes se somam, qual a densidade da liga, em g/cm³?</p>`, fig: fig(cubo(150, 56, "var(--warn)") + D.txt(150, 150, "300 g de cobre", "tx2") + D.txt(225, 100, "+", "tx") + cubo(300, 44, "var(--ink3)") + D.txt(300, 150, "100 g de zinco", "tx2") + D.seta(350, 100, 400, 100, "var(--ink2)") + cubo(460, 64, "var(--ok)") + D.txt(460, 150, "400 g de latão", "tx2") + `<line x1="60" x2="520" y1="128" y2="128" style="stroke:var(--ink2);stroke-width:2"/>`, 165), num: { v: 8.423, tol: 0.01, un: "g/cm³" }, dicas: [R`<p>Não faça a média das densidades. Ache o volume de cada metal e some.</p>`, R`<p>$d = \frac{m_1 + m_2}{V_1 + V_2}$.</p>`], resp: "≈ 8,42 g/cm³", sol: R`<p>$V = \frac{300}{8{,}96} + \frac{100}{7{,}14} = 33{,}48 + 14{,}01 = 47{,}49$ cm³. $d = \frac{400}{47{,}49} = 8{,}42$ g/cm³. A média simples daria 8,05: errado, porque há três vezes mais cobre.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>A densidade do ouro é 19,3 g/cm³. Quanto é isso em kg/m³?</p>`, fig: fig(cubo(180, 22, "var(--warn)") + D.txt(180, 150, "1 cm³: 19,3 g", "tx2") + cubo(390, 100, "var(--warn)") + D.txt(390, 150, "1 m³: ? kg", "tx2") + `<line x1="60" x2="500" y1="128" y2="128" style="stroke:var(--ink2);stroke-width:2"/>`, 165), num: { v: 19300, un: "kg/m³" }, dicas: [R`<p>1 m³ tem $10^6$ cm³, e 1 kg tem $10^3$ g.</p>`], resp: "19 300 kg/m³", sol: R`<p>$19{,}3\ \frac{\text{g}}{\text{cm}^3}\cdot\frac{10^6\text{ cm}^3}{1\text{ m}^3}\cdot\frac{1\text{ kg}}{10^3\text{ g}} = 19\,300$ kg/m³. Regra prática: de g/cm³ para kg/m³, multiplique por 1000. Um metro cúbico de ouro pesa 19,3 toneladas.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Um rolo de papel-alumínio ($d = 2{,}70$ g/cm³) tem 30 cm de largura, 10 m de comprimento e 97,2 g de alumínio. Qual a espessura da folha, em micrômetros (µm)?</p>`, fig: fig(`<rect x="120" y="60" width="320" height="50" style="fill:color-mix(in srgb,var(--ink) 20%,transparent);stroke:var(--ink2);stroke-width:1.5"/><ellipse cx="120" cy="85" rx="14" ry="25" style="fill:var(--card2);stroke:var(--ink2);stroke-width:1.5"/>` + D.txt(280, 50, "10 m", "tx2") + D.txt(470, 90, "30 cm", "tx2", "start") + D.txt(280, 140, "97,2 g · espessura = ?", "tx2"), 160), num: { v: 12, un: "µm" }, dicas: [R`<p>Volume = massa ÷ densidade. E também volume = área × espessura.</p>`, R`<p>Trabalhe tudo em cm e só no fim converta: 1 cm = 10 000 µm.</p>`], resp: "12 µm", sol: R`<p>$V = \frac{97{,}2}{2{,}70} = 36{,}0$ cm³. Área: $30\cdot1000 = 30\,000$ cm². Espessura: $\frac{36{,}0}{30\,000} = 0{,}0012$ cm $= 12$ µm, cerca de um sexto da espessura de um fio de cabelo (uns 70 µm).</p>` }),
    ];

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Introdução à química · do que as coisas são feitas</div>
        <div class="q">Um quilo de chumbo e um quilo de algodão têm a mesma massa. Então o que, exatamente, é diferente entre os dois, e que número mede essa diferença?</div>
        <p>A resposta é a ideia mais útil deste tema: existem propriedades que dependem de <b>quanto</b> material você tem e propriedades que dependem só de <b>qual</b> material é. As segundas são as impressões digitais das substâncias.</p></div>
        ${F.chute({ q: "você corta uma barra de ouro ao meio. O que cai pela metade?", ops: ["A massa, o volume e a densidade.", "Só a densidade.", "A massa e o volume; a densidade fica igual.", "Nada: ouro é ouro."], certa: 2, exp: "Massa e volume caem pela metade, porque dependem da quantidade. A densidade é a divisão de um pelo outro: metade dividida por metade dá o mesmo número. É por isso que a densidade serve para reconhecer o ouro, e a massa não." })}`),

      F.secao("materia", "Matéria: massa e volume", R`
        <p><b>Matéria</b> é tudo o que tem massa e ocupa lugar no espaço. Um pedaço limitado de matéria é um <b>corpo</b> (uma tora de madeira); um corpo feito para um uso é um <b>objeto</b> (uma cadeira). A <b>massa</b> mede a quantidade de matéria e é a mesma em qualquer lugar; o <b>peso</b> é a força com que a Terra puxa essa massa, e muda na Lua. A balança de laboratório mede massa.</p>
        <table class="tb"><tr><th>Grandeza</th><th>Unidade do SI</th><th>Outras unidades comuns</th></tr>
          <tr><td>massa</td><td>quilograma (kg)</td><td>1 kg = 1000 g; 1 g = 1000 mg; 1 t = 1000 kg</td></tr>
          <tr><td>volume</td><td>metro cúbico (m³)</td><td>1 L = 1 dm³; 1 mL = 1 cm³; 1 m³ = 1000 L</td></tr>
          <tr><td>energia</td><td>joule (J)</td><td>1 cal = 4,184 J; 1 kcal = 1000 cal</td></tr></table>
        <h3>Teorema 1: por que 1 m³ tem um milhão de cm³</h3>
        ${F.demo("unidade elevada ao cubo", R`<p>(i) Um cubo de 1 m de lado tem 100 cm de lado. O volume é lado × lado × lado.</p>
          <p>(ii) $1\text{ m}^3 = (100\text{ cm})^3 = 100\cdot100\cdot100\text{ cm}^3 = 10^6$ cm³. O fator de conversão do comprimento (100) entra <b>três vezes</b>.</p>
          <p>(iii) Do mesmo jeito, $1\text{ L} = 1\text{ dm}^3 = (10\text{ cm})^3 = 1000$ cm³. Como 1 L = 1000 mL, sai que <b>1 mL = 1 cm³</b>, exatamente.</p>
          <p>(iv) Juntando: $1\text{ m}^3 = 10^6\text{ cm}^3 = 10^6\text{ mL} = 1000$ L.</p>`)}
        ${F.formula(R`1\ \text{mL} = 1\ \text{cm}^3;\qquad 1\ \text{L} = 1\ \text{dm}^3 = 1000\ \text{cm}^3;\qquad 1\ \text{m}^3 = 1000\ \text{L} = 10^6\ \text{cm}^3`, "Volume: conversões")}
        ${F.caixa("pegadinha", R`<p><b>Converter área e volume não é converter comprimento.</b> 1 m = 100 cm, mas 1 m² = 10 000 cm² e 1 m³ = 1 000 000 cm³. O erro mais comum em prova é multiplicar por 100 uma vez só. Escreva a unidade junto com o número e eleve os dois.</p>`)}`),

      F.secao("energia", "Energia", R`
        <p><b>Energia</b> é a capacidade de realizar trabalho ou de transferir calor. Ela não tem massa nem ocupa espaço, mas toda transformação da matéria vem acompanhada de troca de energia. As formas que mais aparecem em química:</p>
        <table class="tb"><tr><th>Forma</th><th>Onde está</th><th>Exemplo</th></tr>
          <tr><td>térmica</td><td>na agitação das partículas</td><td>água quente</td></tr>
          <tr><td>química</td><td>nas ligações entre os átomos</td><td>gasolina, comida, pilha</td></tr>
          <tr><td>elétrica</td><td>em cargas em movimento</td><td>eletrólise da água</td></tr>
          <tr><td>luminosa</td><td>na luz</td><td>fotossíntese, fogos de artifício</td></tr></table>
        <p>A energia não é criada nem destruída: só muda de forma (é a 1ª lei da termodinâmica ${F.ret("fisica/T07")}). Na combustão, energia química vira térmica e luminosa; na pilha, química vira elétrica; na fotossíntese, luminosa vira química. Um processo que <b>libera</b> calor para a vizinhança é <b>exotérmico</b> (queima, cal virgem jogada na água); um que <b>absorve</b> é <b>endotérmico</b> (gelo derretendo, bolsa de frio instantâneo). O balanço completo fica para a termoquímica ${F.ret("F01")}.</p>
        ${F.formula(R`1\ \text{cal} = 4{,}184\ \text{J};\qquad 1\ \text{kcal} = 1000\ \text{cal} = 4{,}184\ \text{kJ}`, "Energia: conversões")}
        <p>Exemplo de rótulo: um iogurte com 150 kcal tem $150\cdot4{,}184 = 627{,}6$ kJ. A "caloria" dos rótulos de comida (às vezes escrita Cal, com maiúscula) é a quilocaloria.</p>`),

      F.secao("propriedades", "Propriedades da matéria", R`
        <p>Propriedade é qualquer característica que se pode observar ou medir. A primeira divisão é entre as que todo material tem e as que distinguem um material do outro.</p>
        <table class="tb"><tr><th>Tipo</th><th>O que é</th><th>Exemplos</th></tr>
          <tr><td><b>gerais</b></td><td>toda matéria tem; não identificam nada</td><td>massa, volume (extensão), inércia, impenetrabilidade, divisibilidade, compressibilidade</td></tr>
          <tr><td><b>específicas físicas</b></td><td>medidas sem transformar a substância em outra</td><td>densidade, ponto de fusão, ponto de ebulição, solubilidade, dureza, condutividade</td></tr>
          <tr><td><b>específicas químicas</b></td><td>só aparecem quando a substância vira outra</td><td>queimar, enferrujar, reagir com ácido, azedar</td></tr>
          <tr><td><b>organolépticas</b></td><td>percebidas pelos sentidos</td><td>cor, brilho, odor, sabor, textura</td></tr></table>
        <p>A <b>dureza</b> é a resistência a ser riscado: um material risca todos os que são menos duros que ele (escala de Mohs, do talco, 1, ao diamante, 10). A <b>solubilidade</b>, o ponto de fusão e o de ebulição ganham tema próprio mais adiante ${F.ret("A07")}.</p>
        ${F.caixa("pegadinha", R`<p><b>Duro não é o mesmo que difícil de quebrar.</b> O diamante é o material natural mais duro (nada o risca), mas uma martelada o estilhaça: ele é duro e frágil. O aço é menos duro e muito mais tenaz. Dureza é riscar; tenacidade é aguentar pancada.</p>`)}
        ${F.caixa("pegadinha", R`<p><b>Propriedades organolépticas se observam de longe.</b> No laboratório, <b>nunca</b> se prova nada e nunca se cheira direto no frasco: abana-se o ar da boca do frasco em direção ao nariz, com a mão, e só quando o professor mandar. Sabor não é teste de laboratório em nenhuma circunstância: muitos venenos são doces. Em casa vale o mesmo para produto de limpeza: não misture, não cheire de perto.</p>`, "Segurança e descarte")}`),

      F.secao("intensivas", "Intensivas e extensivas: a ideia que identifica substâncias", R`
        <p>Segunda divisão, e a mais importante. Junte duas porções iguais de um material e pergunte o que aconteceu com cada propriedade:</p>
        <table class="tb"><tr><th>Tipo</th><th>Ao juntar duas porções iguais…</th><th>Exemplos</th></tr>
          <tr><td><b>extensiva</b></td><td>dobra: depende da quantidade</td><td>massa, volume, energia liberada na queima, calor para fundir</td></tr>
          <tr><td><b>intensiva</b></td><td>não muda: depende só do material (e das condições)</td><td>densidade, temperatura, ponto de fusão, ponto de ebulição, cor, dureza</td></tr></table>
        <h3>Teorema 2: a razão de duas extensivas é intensiva</h3>
        ${F.demo("por que a densidade não depende do tamanho", R`<p>(i) Pegue uma amostra de massa $m$ e volume $V$. Uma amostra $k$ vezes maior, do mesmo material, tem massa $k\,m$ e volume $k\,V$ (é isso que "extensiva" quer dizer).</p>
          <p>(ii) Razão na amostra maior: $\frac{k\,m}{k\,V} = \frac mV$. O fator $k$ cancela.</p>
          <p>(iii) Logo $\frac mV$ tem o mesmo valor em qualquer pedaço: é uma propriedade do material, não da amostra. Esse número é a <b>densidade</b>.</p>
          <p>(iv) O truque vale sempre: dividir uma extensiva por outra fabrica uma intensiva. Calor para fundir ÷ massa dá o calor latente; massa ÷ quantidade de matéria dá a massa molar ${F.ret("D04")}.</p>`)}
        ${F.formula(R`d = \frac{m}{V}\qquad\Longrightarrow\qquad m = d\,V,\qquad V = \frac{m}{d}`, "Densidade (g/cm³, g/mL ou kg/m³)")}
        <p>No gráfico de massa contra volume, cada material é uma reta que passa pela origem, e a inclinação da reta é a densidade. Veja isso acontecer:</p>
        <div id="lab-dens"></div>
        ${F.caixa("fisico", R`<p><b>Para reconhecer, use intensivas; para contar quanto tem, use extensivas.</b> Diante de uma amostra desconhecida, o químico mede densidade, ponto de fusão, ponto de ebulição: três números que não dependem do tamanho da amostra e que, juntos, quase nunca coincidem para duas substâncias diferentes. Massa e volume só respondem "quanto".</p>`, "Pense como químico")}
        <h3>Teorema 3: a densidade de uma mistura não é a média das densidades</h3>
        ${F.demo("300 g de cobre com 100 g de zinco", R`<p>(i) A massa sempre se soma: $m = m_1 + m_2 = 300 + 100 = 400$ g.</p>
          <p>(ii) Se os volumes também se somam (boa aproximação para muitas ligas): $V = \frac{m_1}{d_1} + \frac{m_2}{d_2} = \frac{300}{8{,}96} + \frac{100}{7{,}14} = 33{,}48 + 14{,}01 = 47{,}49$ cm³.</p>
          <p>(iii) $d = \frac{m_1 + m_2}{V_1 + V_2} = \frac{400}{47{,}49} = 8{,}42$ g/cm³.</p>
          <p>(iv) A média simples seria $\frac{8{,}96 + 7{,}14}{2} = 8{,}05$: errada, porque a liga tem três vezes mais cobre que zinco. O valor certo fica sempre entre as duas densidades, mais perto da do componente que ocupa mais volume.</p>`)}
        ${F.formula(R`d_\text{mistura} = \frac{m_1 + m_2}{V_1 + V_2} = \frac{m_1 + m_2}{\dfrac{m_1}{d_1} + \dfrac{m_2}{d_2}}\qquad(\text{se os volumes se somam})`, "Densidade de uma mistura")}
        ${F.caixa("olimpiada", R`<p><b>Como isso é cobrado.</b> Três formatos se repetem em olimpíada e vestibular difícil. (1) Identificar um material por densidade, com o volume medido por deslocamento de água (às vezes com o objeto oco, para atrapalhar). (2) Liga de dois metais: dá-se a massa e o volume e pede-se a composição, como na coroa de Arquimedes. (3) Classificar propriedades numa lista misturada: a armadilha é a temperatura (intensiva) ao lado do calor (extensiva), e a densidade ao lado da massa. Em todas, a conta de unidades é metade da questão.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, a divisão intensiva/extensiva vira a espinha da termodinâmica: energia interna, entropia e volume são extensivas; temperatura, pressão e potencial químico são as intensivas "conjugadas" a elas ${F.ret("fisica/T08b")}. E o caso dos volumes que não se somam (o chefão deste tema) é tratado com os <b>volumes parciais molares</b>: o quanto o volume da mistura aumenta por mol acrescentado de cada componente, um número que muda com a composição.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-dens"); e.outerHTML = F.lab("A amostra misteriosa: massa, volume e densidade", "lab-dens"); SIM.densidade(document.getElementById("lab-dens"), F); },
});
