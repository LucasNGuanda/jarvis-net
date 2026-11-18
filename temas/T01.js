/* T01 · Temperatura. Conferido em Python:
   25 °C = 77 °F; 98,6 °F = 37 °C; 300 K = 26,85 °C; −40 °C = −40 °F; Δ20 °C = Δ36 °F; 39 °C = 312,15 K;
   escala X (gelo 20, vapor 220): 50 °C → 120 °X; 100 °X → 40 °C; F = 2C em 160 °C; K = F em 574,59 K;
   coluna 4 cm (0 °C) e 24 cm (100 °C): 12 cm → 40 °C; termômetro de gás 100 kPa (0 °C) e 136,6 kPa (100 °C): zero em −273,2 °C;
   termômetro com gelo em −1 e vapor em 103: acerta em 25 °C;
   chefão: resistor de platina R = R0(1 + αT + βT²), α = 3,9083e-3, β = −5,775e-7, calibrado linearmente em 0 e 100 °C:
   lê 50,375 °C a 50 °C; erro = βT(T − 100)/(α + 100β), máximo 0,375 °C em 50 °C; lê 200 °C quando a verdadeira é 203,14 °C; a −50 °C lê −51,12 °C. */
F.registrar("T01", {
  retoma: ["F01", "A11"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    /* dois termômetros lado a lado */
    const dois = (fr1, r1, fr2, r2, extra = "") => fig(D.termo(200, 140, 120, fr1, r1) + D.termo(360, 140, 120, fr2, r2) + extra, 170);
    /* duas escalas verticais com os pontos fixos e uma marca "?" */
    const escalas = (A, a0, a1, B, b0, b1, marcaA = "", marcaB = "", fr = 0.5) => {
      const y0 = 145, y1 = 25, ym = y0 - (y0 - y1) * fr;
      const col = (x, nome, v0, v1, m) => `<line x1="${x}" x2="${x}" y1="${y1 - 10}" y2="${y0 + 10}" style="stroke:var(--ink2);stroke-width:2"/>` + [[y0, v0], [y1, v1]].map(([y, v]) => `<line x1="${x - 8}" x2="${x + 8}" y1="${y}" y2="${y}" style="stroke:var(--ink2)"/>` + D.txt(x + 14, y + 4, v, "tx2", "start")).join("") + (m ? `<line x1="${x - 8}" x2="${x + 8}" y1="${ym}" y2="${ym}" style="stroke:var(--warn);stroke-width:2"/>` + D.txt(x + 14, ym + 4, m, "tx2", "start") : "") + D.txt(x, y0 + 26, nome, "tx2");
      return fig(col(200, A, a0, a1, marcaA) + col(360, B, b0, b1, marcaB) + `<line x1="200" x2="360" y1="${ym}" y2="${ym}" style="stroke:var(--warn);stroke-dasharray:4 4"/>` + D.txt(120, y0 + 4, "gelo", "tx2", "end") + D.txt(120, y1 + 4, "vapor", "tx2", "end"), 180);
    };
    const gas = fig(D.graf({ x0: 120, y0: 140, w: 380, h: 120, xmax: 400, ymin: 0, ymax: 160, xlab: "θ (°C)", ylab: "p (kPa)", xt: [], yt: [100, 136.6], curvas: [{ pts: [[0, 0], [400, 146.4]], cor: "var(--ink3)", trac: true }, { pts: [[273.2, 100], [373.2, 136.6]], cor: "var(--mT)" }], pontos: [[273.2, 100, "0 °C"], [373.2, 136.6, "100 °C"], [0, 0, "?"]] }), 170);
    const exemplos = F.exemplo({
      titulo: "Escalas",
      casos: [
        { nome: "Fácil: o boletim do tempo em Nova York", gerar: (p) => {
          const f = p ? 86 : F.escolha([14, 50, 86, 104]), c = (f - 32) / 1.8;
          return { enun: R`<p>Um site americano diz que amanhã fará ${f} °F em Nova York. Quanto é isso em Celsius e em kelvin?</p>`, fig: dois((c + 30) / 80, `${f} °F`, (c + 30) / 80, "? °C"),
            passos: [R`<p>(i) Entre o gelo e o vapor há 100 divisões em Celsius (0 a 100) e 180 em Fahrenheit (32 a 212). Regra de três: $\frac{C - 0}{100} = \frac{F - 32}{180}$.</p>`, R`<p>(ii) $C = \frac{${f} - 32}{1{,}8} = \frac{${f - 32}}{1{,}8} \approx ${F.n(c, 3)}$ °C.</p>`, R`<p>(iii) $T = C + 273{,}15 \approx ${F.n(c + 273.15, 3)}$ K. Conferência rápida: 1 °C a mais vale 1,8 °F a mais, então ${f} °F está ${F.nt(f - 32)} °F acima do gelo, isto é, ${F.nt(c, 3)} °C.</p>`] };
        } },
        { nome: "Médio: a escala do laboratório", gerar: (p) => {
          const xg = p ? 20 : F.escolha([-10, 10, 20, 40]), xv = p ? 220 : F.escolha([140, 220, 260]), c = p ? 50 : F.escolha([30, 50, 70]), x = xg + ((xv - xg) * c) / 100;
          return { enun: R`<p>Um aluno inventa a escala X: o gelo fundente vale ${xg} °X e a água fervendo vale ${xv} °X. Quanto marca um termômetro em °X quando o Celsius marca ${c} °C?</p>`, fig: escalas("Celsius", "0", "100", "X", `${xg}`, `${xv}`, `${c}`, "?", c / 100),
            passos: [R`<p>(i) A mesma fração do caminho entre o gelo e o vapor nas duas escalas: $\frac{C - 0}{100 - 0} = \frac{X - ${xg}}{${xv} - (${xg})}$.</p>`, R`<p>(ii) $\frac{${c}}{100} = \frac{X - ${xg}}{${xv - xg}} \Rightarrow X = ${xg} + ${F.n(c / 100)}\cdot${xv - xg}$.</p>`, R`<p>(iii) $X = ${F.n(x, 3)}$ °X. Cada grau Celsius vale ${F.nt((xv - xg) / 100, 3)} °X.</p>`] };
        } },
        { nome: "Olimpíada: onde o termômetro errado acerta", gerar: (p) => {
          const g = p ? -1 : F.escolha([-2, -1, 1, 2]), v = p ? 103 : F.escolha([97, 98, 102, 103]), k = (v - g) / 100, Tok = Math.abs(k - 1) > 1e-9 ? -g / (k - 1) : NaN;
          return { enun: R`<p>Um termômetro de mercúrio mal graduado marca ${g} °C no gelo fundente e ${v} °C na água fervendo (ao nível do mar). Supondo a coluna linear, existe alguma temperatura em que ele marca o valor certo?</p>`, fig: escalas("verdadeira", "0", "100", "marcada", `${g}`, `${v}`, "T", "T?", 0.4),
            passos: [R`<p>(i) Leitura em função da temperatura verdadeira $T$: $L = ${g} + \frac{${v} - (${g})}{100}T = ${g} + ${F.n(k, 3)}\,T$.</p>`, R`<p>(ii) Acerta quando $L = T$: $${g} + ${F.n(k, 3)}T = T \Rightarrow T = \frac{${-g}}{${F.n(k - 1, 3)}}$.</p>`, R`<p>(iii) $T \approx ${F.n(Tok, 3)}$ °C${Tok < -273.15 ? ", abaixo do zero absoluto: na prática ele nunca acerta" : Tok > 100 || Tok < 0 ? ", fora do intervalo calibrado (mas a conta vale se a coluna continuar linear)" : ""}. Duas retas que não são paralelas sempre se cruzam: é a mesma conta de "onde Celsius e Fahrenheit coincidem" (−40).</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O termômetro de platina que mente um pouquinho",
      enun: R`<p>Termômetros de laboratório usam um fio de platina cuja resistência depende da temperatura (em °C) como $R = R_0(1 + \alpha T + \beta T^2)$, com $\alpha = 3{,}9083\times10^{-3}$ °C⁻¹ e $\beta = -5{,}775\times10^{-7}$ °C⁻² (valores da norma real). Um aparelho barato mede $R$ e converte para temperatura com uma <b>reta</b> calibrada em 0 °C e 100 °C. (a) Escreva a leitura $L$ do aparelho em função de $R$. (b) Quanto ele marca quando a temperatura verdadeira é 50 °C? (c) Mostre que o erro $L - T$ vale $\frac{\beta T(T - 100)}{\alpha + 100\beta}$ e ache onde ele é máximo entre 0 e 100 °C. (d) Num forno, o aparelho marca 200 °C. Qual a temperatura verdadeira? (e) Por que, então, o padrão de temperatura é definido com um termômetro de gás, e não com um de platina ou de mercúrio?</p>`,
      fig: fig(D.graf({ x0: 110, y0: 140, w: 380, h: 115, xmax: 300, ymin: 0, ymax: 1.2, xlab: "T (°C)", ylab: "R/R₀ − 1", xt: [100, 200, 300], yt: [], curvas: [{ pts: D.amostra((t) => 3.9083e-3 * t - 5.775e-7 * t * t, 0, 300), cor: "var(--mT)" }, { pts: [[0, 0], [300, 0.385055 * 3]], cor: "var(--ink3)", trac: true }] }) + D.txt(400, 30, "reta de calibração", "tx2"), 170),
      dicas: [R`<p>(a) Reta pelos pontos $(R_0, 0)$ e $(R_{100}, 100)$: $L = 100\frac{R - R_0}{R_{100} - R_0}$.</p>`, R`<p>(c) Substitua $R(T)$ em $L$ e subtraia $T$; o que sobra é uma parábola em $T$. Parábola com raízes em 0 e 100 tem o extremo no meio.</p>`, R`<p>(d) Resolva $L(T) = 200$, uma equação do 2º grau em $T$.</p>`],
      sol: R`<p><b>(a)</b> $L = 100\,\frac{R - R_0}{R_{100} - R_0}$, com $R_{100} - R_0 = R_0(100\alpha + 10^4\beta) = 0{,}385055\,R_0$.</p>
        <p><b>(b)</b> $R(50) - R_0 = R_0(0{,}195415 - 0{,}00144375) = 0{,}193971\,R_0$; $L = 100\cdot\frac{0{,}193971}{0{,}385055} \approx 50{,}375$ °C.</p>
        <p><b>(c)</b> $L = \frac{100(\alpha T + \beta T^2)}{100\alpha + 10^4\beta}$; $L - T = \frac{100\beta T^2 - 10^4\beta T}{100\alpha + 10^4\beta} = \frac{\beta T(T - 100)}{\alpha + 100\beta}$. Como $\beta < 0$ e $T(T - 100) < 0$ no intervalo, o erro é positivo, zero nos pontos de calibração e máximo no meio: $0{,}375$ °C em 50 °C.</p>
        <p><b>(d)</b> $\alpha T + \beta T^2 = 2\cdot0{,}385055 = 0{,}77011$. Resolvendo (conferi numericamente): $T \approx 203{,}1$ °C. Fora do intervalo de calibração o erro cresce e muda de sinal: o aparelho marca uns 3 °C a menos.</p>
        <p><b>(e)</b> Toda substância "termométrica" (platina, mercúrio, álcool) tem sua própria não linearidade, e cada uma discordaria das outras longe dos pontos fixos. Os gases rarefeitos, ao contrário, concordam entre si: $pV$ proporcional a $T$ para qualquer gás em baixa pressão ${F.ret("T05")}. Isso define uma temperatura que não depende do material, a temperatura absoluta, que a 2ª lei depois mostra ser universal ${F.ret("T08")}.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Converta 25 °C para Fahrenheit.</p>`, fig: dois(0.55, "25 °C", 0.55, "? °F"), num: { v: 77, un: "°F" }, dicas: [R`<p>$F = 1{,}8\,C + 32$.</p>`], resp: "77 °F", sol: R`<p>$1{,}8\cdot25 + 32 = 45 + 32 = 77$ °F.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>A temperatura normal do corpo humano, num termômetro americano, é 98,6 °F. Quanto é em Celsius?</p>`, fig: dois(0.66, "98,6 °F", 0.66, "? °C"), num: { v: 37, un: "°C" }, dicas: [R`<p>$C = \frac{F - 32}{1{,}8}$.</p>`], resp: "37 °C", sol: R`<p>$\frac{66{,}6}{1{,}8} = 37$ °C.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Converta 300 K para Celsius.</p>`, fig: dois(0.56, "300 K", 0.56, "? °C"), num: { v: 26.85, tol: 0.005, un: "°C" }, dicas: [R`<p>$C = T - 273{,}15$.</p>`], resp: "26,85 °C", sol: R`<p>$300 - 273{,}15 = 26{,}85$ °C, uma "temperatura ambiente" redonda em kelvin.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Em que temperatura as escalas Celsius e Fahrenheit marcam o mesmo número?</p>`, fig: escalas("Celsius", "0", "100", "Fahrenheit", "32", "212", "x", "x", 0.08), num: { v: -40, un: "°" }, dicas: [R`<p>Faça $F = C = x$ na fórmula de conversão.</p>`], resp: "−40", sol: R`<p>$x = 1{,}8x + 32 \Rightarrow -0{,}8x = 32 \Rightarrow x = -40$. Frio de Sibéria: −40 °C = −40 °F.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>A temperatura de um forno sobe 20 °C. Quanto ela subiu em Fahrenheit?</p>`, fig: dois(0.3, "antes", 0.55, "+20 °C"), num: { v: 36, un: "°F" }, dicas: [R`<p>Para <b>variações</b>, o 32 não entra: $\Delta F = 1{,}8\,\Delta C$.</p>`], resp: "36 °F", sol: R`<p>$1{,}8\cdot20 = 36$ °F. Quem faz $1{,}8\cdot20 + 32 = 68$ confundiu temperatura com variação de temperatura.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Uma variação de temperatura de 20 °C corresponde, em kelvin, a:</p>`, fig: dois(0.3, "θ", 0.55, "θ + 20 °C"), alts: ["20 K", "293,15 K", "36 K", "−253,15 K", "68 K"], certa: "A", dicas: [R`<p>O kelvin e o grau Celsius têm o mesmo "tamanho".</p>`], resp: "A", sol: R`<p>As duas escalas só diferem na origem: $\Delta T = \Delta C$. 293,15 K é a temperatura de 20 °C, não uma variação.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Uma pessoa com febre está a 39 °C. Quanto é isso em kelvin?</p>`, fig: dois(0.72, "39 °C", 0.72, "? K"), num: { v: 312.15, tol: 0.001, un: "K" }, dicas: [R`<p>Some 273,15.</p>`], resp: "312,15 K", sol: R`<p>$39 + 273{,}15 = 312{,}15$ K. (Kelvin não leva "grau": é "312 kelvins".)</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Na escala X, o gelo fundente vale 20 °X e a água fervendo, 220 °X. Quanto marca, em °X, um termômetro a 50 °C?</p>`, fig: escalas("Celsius", "0", "100", "X", "20", "220", "50", "?", 0.5), num: { v: 120, un: "°X" }, dicas: [R`<p>$\frac{C}{100} = \frac{X - 20}{200}$.</p>`], resp: "120 °X", sol: R`<p>Metade do caminho: $20 + 0{,}5\cdot200 = 120$ °X.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Na mesma escala X (gelo 20 °X, vapor 220 °X), um termômetro marca 100 °X. Quanto é em Celsius?</p>`, fig: escalas("X", "20", "220", "Celsius", "0", "100", "100", "?", 0.4), num: { v: 40, un: "°C" }, dicas: [R`<p>Que fração do caminho entre 20 e 220 é o 100?</p>`], resp: "40 °C", sol: R`<p>$\frac{100 - 20}{200} = 0{,}4$ do caminho: 40 °C.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Em que temperatura (em °C) a leitura em Fahrenheit é o dobro da leitura em Celsius?</p>`, fig: escalas("Celsius", "0", "100", "Fahrenheit", "32", "212", "x", "2x", 0.92), num: { v: 160, un: "°C" }, dicas: [R`<p>$1{,}8C + 32 = 2C$.</p>`], resp: "160 °C", sol: R`<p>$0{,}2C = 32 \Rightarrow C = 160$ °C $= 320$ °F. Temperatura de forno de bolo.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Em que temperatura (em kelvin) as escalas Kelvin e Fahrenheit marcam o mesmo número?</p>`, fig: escalas("Kelvin", "273,15", "373,15", "Fahrenheit", "32", "212", "x", "x", 0.95), num: { v: 574.5875, tol: 0.002, un: "K" }, dicas: [R`<p>$F = 1{,}8(T - 273{,}15) + 32$; faça $F = T$.</p>`], resp: "≈ 574,6 K", sol: R`<p>$T = 1{,}8T - 491{,}67 + 32 \Rightarrow 0{,}8T = 459{,}67 \Rightarrow T \approx 574{,}6$ K (≈ 301 °C).</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>A coluna de um termômetro tem 4 cm no gelo fundente e 24 cm na água fervendo. Num dia, ela mede 12 cm. Qual a temperatura?</p>`, fig: escalas("coluna", "4 cm", "24 cm", "Celsius", "0", "100", "12 cm", "?", 0.4), num: { v: 40, un: "°C" }, dicas: [R`<p>A coluna cresce 20 cm em 100 °C.</p>`], resp: "40 °C", sol: R`<p>$\frac{12 - 4}{20} = 0{,}4$: 40 °C. Quem faz $\frac{12}{24}$ esqueceu que a coluna já tinha 4 cm no zero.</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>Num termômetro de gás a volume constante, a pressão é 100 kPa a 0 °C e 136,6 kPa a 100 °C. Prolongando a reta, em que temperatura a pressão seria zero?</p>`, fig: gas, num: { v: -273.2, tol: 0.002, un: "°C" }, dicas: [R`<p>A pressão sobe 0,366 kPa por grau. Quantos graus abaixo de zero até perder os 100 kPa?</p>`], resp: "≈ −273 °C", sol: R`<p>$-\frac{100}{0{,}366} \approx -273{,}2$ °C: o zero absoluto. Qualquer gás rarefeito aponta para o mesmo ponto.</p>` }),
      F.exercicio({ n: 14, nivel: "Máximo", enun: R`<p>Um termômetro mal graduado marca −1 °C no gelo fundente e 103 °C na água fervendo. Em que temperatura ele marca o valor certo?</p>`, fig: escalas("verdadeira", "0", "100", "marcada", "−1", "103", "T", "T", 0.25), num: { v: 25, un: "°C" }, dicas: [R`<p>Leitura: $L = -1 + 1{,}04\,T$. Faça $L = T$.</p>`], resp: "25 °C", sol: R`<p>$-1 + 1{,}04T = T \Rightarrow T = 25$ °C.</p>` }),
      F.exercicio({ n: 15, nivel: "Máximo", enun: R`<p>Qual destas temperaturas <b>não</b> pode existir?</p>`, fig: dois(0.02, "−300 °C?", 0.1, "0 K"), alts: ["−300 °C", "−200 °C", "−400 °F", "10 K", "−40 °F"], certa: "A", dicas: [R`<p>Converta tudo para kelvin. Existe temperatura abaixo de 0 K?</p>`], resp: "A", sol: R`<p>−300 °C = −26,85 K: abaixo do zero absoluto, impossível. −400 °F ≈ −240 °C ≈ 33 K existe (e −200 °C também).</p>` }),
      F.exercicio({ n: 16, nivel: "Máximo", enun: R`<p>Numa manhã fria, uma barra de metal e um pedaço de madeira estão na mesma sala há horas. Ao tocar, o metal parece mais frio. Por quê?</p>`, fig: fig(D.bloco(140, 80, 120, 40, "var(--ink3)", "metal") + D.bloco(300, 80, 120, 40, "var(--warn)", "madeira") + D.txt(280, 150, "mesma sala, mesma temperatura", "tx2"), 165), alts: ["O metal está mais frio que a madeira.", "O metal tira calor da mão mais depressa: conduz melhor.", "A madeira produz calor.", "O metal tem temperatura negativa.", "É só ilusão: a mão não troca calor com nenhum dos dois."], certa: "B", dicas: [R`<p>Os dois estão em equilíbrio com a sala. O que a sua pele sente de fato: a temperatura do objeto ou o calor que sai dela?</p>`], resp: "B", sol: R`<p>Mesma temperatura (equilíbrio térmico ${F.ret("T06")}), mas o metal conduz calor muito melhor ${F.ret("T02")}: tira calor da mão depressa, e a pele esfria. Nossa pele é um mau termômetro.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Termodinâmica · temperatura</div>
        <div class="q">Um site americano diz que hoje faz 100 graus. É para sair de casaco ou de bermuda?</div>
        <p>De bermuda: 100 °F são uns 38 °C. Temperatura é uma grandeza física, mas o número depende de uma escala escolhida por gente. Antes de qualquer conta de calor, é preciso saber o que o número significa e como passar de uma escala para outra.</p></div>
        ${F.chute({ q: "existe alguma temperatura em que um termômetro Celsius e um Fahrenheit marcam exatamente o mesmo número?", ops: ["Não, nunca.", "Sim, em 0.", "Sim, em −40.", "Sim, em 100."], certa: 2, exp: "Sim: −40 °C = −40 °F. As duas escalas são retas com inclinações diferentes (1 e 1,8), e duas retas não paralelas sempre se cruzam. A conta está no exercício 4." })}`),

      F.secao("oque", "O que é temperatura", R`
        <p>No dia a dia, temperatura é "quente ou frio". Na física, é a grandeza que decide para que lado o calor flui: de quem está a temperatura maior para quem está a menor, até as duas ficarem iguais (equilíbrio térmico ${F.ret("T06")}). Microscopicamente, num gás ela mede a energia cinética média das moléculas ${F.ret("T05b")}.</p>
        <p>Para medir, usamos uma <b>propriedade termométrica</b> que muda com a temperatura: o comprimento de uma coluna de mercúrio, a pressão de um gás a volume constante, a resistência de um fio de platina. Escolhem-se dois <b>pontos fixos</b> fáceis de reproduzir (gelo fundente e água fervendo, a 1 atm) e divide-se o intervalo em partes iguais.</p>
        ${F.caixa("pegadinha", R`<p><b>Temperatura não é calor.</b> Uma banheira morna tem muito mais energia térmica que uma faísca a 1000 °C, mas a faísca está mais quente. Calor é energia em trânsito por causa de uma diferença de temperatura ${F.ret("T04")}.</p>`)}`),

      F.secao("escalas", "Escalas termométricas e conversão", R`
        ${F.formula(R`\frac{C - 0}{100 - 0} = \frac{F - 32}{212 - 32} = \frac{T - 273{,}15}{373{,}15 - 273{,}15}`, "Celsius, Fahrenheit e Kelvin")}
        <h3>Teorema 1: conversão entre escalas lineares quaisquer</h3>
        ${F.demo("demonstração", R`<p>(i) Numa escala linear, a leitura $X$ é uma função afim da temperatura: $X = a\,\theta + b$. Duas escalas $X$ e $Y$ lidas no mesmo estado: $X = a\theta + b$ e $Y = c\theta + d$.</p>
          <p>(ii) Nos pontos fixos (gelo e vapor), $X$ vale $X_g$ e $X_v$, e $Y$ vale $Y_g$ e $Y_v$. Subtraindo: $X - X_g = a(\theta - \theta_g)$ e $X_v - X_g = a(\theta_v - \theta_g)$; dividindo, $\frac{X - X_g}{X_v - X_g} = \frac{\theta - \theta_g}{\theta_v - \theta_g}$.</p>
          <p>(iii) O lado direito não depende da escala. Então:</p>
          ${F.formula(R`\frac{X - X_g}{X_v - X_g} = \frac{Y - Y_g}{Y_v - Y_g}`, "Conversão entre escalas (a fração do caminho é a mesma)")}
          <p>(iv) Geometricamente, é o teorema de Tales: duas réguas paralelas cortadas pelas mesmas retas horizontais. Com C e F: $\frac C{100} = \frac{F - 32}{180} \Rightarrow F = 1{,}8C + 32$. $\blacksquare$</p>`)}
        <div id="lab-escalas"></div>`),

      F.secao("absoluto", "O zero absoluto e a escala Kelvin", R`
        <h3>Teorema 2: o termômetro de gás aponta para −273,15 °C</h3>
        ${F.demo("demonstração", R`<p>(i) Num gás rarefeito a volume constante, a pressão é uma função afim da temperatura Celsius: $p = p_0(1 + \gamma\theta)$, e a experiência dá o mesmo $\gamma \approx \frac1{273{,}15}$ °C⁻¹ para todos os gases.</p>
          <p>(ii) A pressão não pode ser negativa. Ela se anularia em $1 + \gamma\theta = 0$, isto é, $\theta = -\frac1\gamma = -273{,}15$ °C.</p>
          <p>(iii) Mudando a origem para esse ponto, $T = \theta + 273{,}15$, a pressão fica proporcional a $T$: $p = p_0\gamma T$. É a escala absoluta (Kelvin), em que 0 K é o zero absoluto. $\blacksquare$</p>`)}
        ${F.formula(R`T\,(\text{K}) = C + 273{,}15,\qquad F = 1{,}8\,C + 32`, "Conversões mais usadas")}
        ${F.caixa("fisico", R`<p><b>Chegar a 0 K é impossível</b> (3ª lei da termodinâmica), mas dá para chegar muito perto: laboratórios resfriam átomos a bilionésimos de kelvin, onde aparecem os condensados de Bose–Einstein. O espaço vazio entre as galáxias está a 2,7 K, a temperatura da radiação cósmica de fundo.</p>`)}`),

      F.secao("variacoes", "Variações de temperatura", R`
        <h3>Teorema 3: variações não carregam o "+32"</h3>
        ${F.demo("demonstração", R`<p>(i) Subtraia as conversões em dois estados: $F_2 - F_1 = (1{,}8C_2 + 32) - (1{,}8C_1 + 32) = 1{,}8(C_2 - C_1)$.</p>
          <p>(ii) Do mesmo jeito, $T_2 - T_1 = C_2 - C_1$. As constantes somadas (32 e 273,15) se cancelam. $\blacksquare$</p>`)}
        ${F.formula(R`\Delta F = 1{,}8\,\Delta C,\qquad \Delta T = \Delta C`, "Variações de temperatura")}
        ${F.caixa("olimpiada", R`<p><b>Escala nova = reta nova.</b> Qualquer problema de "termômetro estranho" vira: escreva a leitura como $L = a\theta + b$, ache $a$ e $b$ pelos dois dados e resolva o que pedirem (até onde ele "acerta", onde duas escalas coincidem). Cuidado com a diferença entre temperatura e variação.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, a temperatura é definida sem nenhum material: $\frac1T = \frac{\partial S}{\partial U}$, a taxa com que a entropia cresce quando se dá energia ao sistema ${F.ret("T08b")}. Daí surgem até temperaturas "negativas" em sistemas especiais (que são mais quentes que qualquer positiva!). E desde 2019 o kelvin é definido fixando a constante de Boltzmann, $k_B = 1{,}380649\times10^{-23}$ J/K.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-escalas"); e.outerHTML = F.lab("Quatro termômetros", "lab-escalas"); SIM.escalas(document.getElementById("lab-escalas"), F); },
});
