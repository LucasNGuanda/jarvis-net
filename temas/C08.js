/* C08 · Associação de Resistores
   Base: Halliday vol. 3, cap. 27 (resistores em série e em paralelo), reescrito e ampliado com técnicas de olimpíada.
   Contas conferidas em Python (c05b.py); a grade infinita foi conferida resolvendo uma grade 161×161. */
F.registrar("C08", {
  retoma: ["C07"],
  html(F) {
    const R = String.raw;
    const res = (x1, y1, x2, y2, rot, lado = 1) => { const v = x1 === x2; return `<rect x="${v ? x1 - 13 : (x1 + x2) / 2 - 28}" y="${v ? (y1 + y2) / 2 - 28 : y1 - 13}" width="${v ? 26 : 56}" height="${v ? 56 : 26}" style="fill:var(--card)"/>` + D.comp("resistor", x1, y1, x2, y2, { rot, lado }); };
    const figMisto = D.svg(440, 190, D.fio([[40, 40], [400, 40], [400, 160], [40, 160], [40, 40]]) + D.fio([[280, 40], [280, 160]]) + D.no(280, 40) + D.no(280, 160) + `<rect x="24" y="70" width="32" height="60" style="fill:var(--card)"/>` + D.comp("bateria", 40, 130, 40, 70, { mais: 1, rot: "12 V", lado: -1, sinais: false }) + res(130, 40, 210, 40, "4 Ω") + res(280, 70, 280, 130, "6 Ω", -1) + res(400, 70, 400, 130, "3 Ω", -1), "circuito misto");
    const figPonte = D.svg(360, 230, D.comp("resistor", 40, 115, 180, 30, { rot: "R₁", lado: 1 }) + D.comp("resistor", 180, 30, 320, 115, { rot: "R₂", lado: 1 }) + D.comp("resistor", 40, 115, 180, 200, { rot: "R₃", lado: -1 }) + D.comp("resistor", 180, 200, 320, 115, { rot: "R₄", lado: -1 }) + D.comp("resistor", 180, 30, 180, 200, { rot: "R₅", lado: -1 }) + D.borne(40, 115) + D.borne(320, 115) + D.txt(30, 108, "A", "tx", "end") + D.txt(330, 108, "B", "tx", "start") + D.no(180, 30) + D.no(180, 200), "ponte");
    const figCubo = D.svg(260, 230, `<path d="M50 80 L170 80 L170 200 L50 200 Z M50 80 L100 30 L220 30 L170 80 M220 30 L220 150 L170 200 M50 200 L100 150 L220 150 M100 30 L100 150" class="ln" style="fill:none"/>${D.no(50, 200)}${D.no(220, 30)}${D.txt(38, 214, "A", "tx")}${D.txt(232, 26, "B", "tx")}`, "cubo de resistores");
    const figEscada = D.svg(460, 140, D.fio([[20, 30], [440, 30]]) + D.fio([[20, 110], [440, 110]]) + [0, 1, 2].map((k) => res(60 + 130 * k, 30, 130 + 130 * k, 30, "R") + res(150 + 130 * k, 30, 150 + 130 * k, 110, "R", -1)).join("") + D.txt(452, 74, "…", "tx") + D.borne(20, 30) + D.borne(20, 110), "escada infinita");

    const exemplario = F.exemplo({ casos: [
      { nome: "Circuito misto", gerar: (p) => {
        const E = p ? 12 : F.escolha([6, 9, 12, 24]), R1 = p ? 4 : F.escolha([2, 4, 5, 10]), R2 = p ? 6 : F.escolha([3, 6, 12, 20]), R3 = p ? 3 : F.escolha([3, 4, 6, 30]);
        const Rp = (R2 * R3) / (R2 + R3), Re = R1 + Rp, i = E / Re, Up = i * Rp;
        return { enun: R`<p>Fonte de $${E}$ V; $R_1 = ${R1}\ \Omega$ em série com o paralelo de $R_2 = ${R2}\ \Omega$ e $R_3 = ${R3}\ \Omega$. Ache todas as correntes e tensões.</p>`, fig: figMisto,
          passos: [R`<p>De dentro para fora: $R_2 \parallel R_3 = \frac{R_2R_3}{R_2+R_3} = ${F.m(Rp, 3)}\ \Omega$ ("produto pela soma").</p>`, R`<p>Em série com $R_1$: $R_\text{eq} = ${F.m(Re, 3)}\ \Omega$; corrente total $i = E/R_\text{eq} = ${F.m(i, 3)}$ A.</p>`,
            R`<p>Voltando: $U_1 = R_1i = ${F.m(R1 * i, 2)}$ V e $U_p = ${F.m(Up, 2)}$ V (confere: soma $= ${E}$ V).</p>`, R`<p>$i_2 = U_p/R_2 = ${F.m(Up / R2, 3)}$ A, $i_3 = U_p/R_3 = ${F.m(Up / R3, 3)}$ A, somando $${F.m(i, 3)}$ A ✓.</p>`] }; } },
      { nome: "Divisor com carga", gerar: (p) => {
        const E = p ? 10 : F.escolha([5, 9, 10, 12]), Ra = p ? 10 : F.escolha([1, 4.7, 10]), Rb = p ? 10 : F.escolha([1, 4.7, 10]), Rl = p ? 10 : F.escolha([1, 10, 100]);
        const V0 = (E * Rb) / (Ra + Rb), Rp = (Rb * Rl) / (Rb + Rl), V = (E * Rp) / (Ra + Rp);
        return { enun: R`<p>Divisor de tensão: $${F.m(Ra, 1)}$ kΩ em cima, $${F.m(Rb, 1)}$ kΩ embaixo, $E = ${E}$ V. Quanto sai sem carga, e com uma carga de $${Rl}$ kΩ ligada na saída?</p>`, fig: "",
          passos: [R`<p>Sem carga: $V_0 = E\frac{R_b}{R_a+R_b} = ${F.m(V0, 2)}$ V.</p>`, R`<p>Com carga, embaixo fica $R_b \parallel R_L = ${F.m(Rp, 3)}$ kΩ: $V = E\frac{R_b\parallel R_L}{R_a + R_b\parallel R_L} = ${F.m(V, 2)}$ V.</p>`,
            R`<p>Queda de $${F.m((100 * (V0 - V)) / V0, 0)}\%$. Regra prática: o divisor só funciona bem se $R_L \gg R_b$. ${Rl >= 10 * Rb ? "Aqui está ok." : "Aqui a carga é pesada demais."}</p>`] }; } },
    ] });

    const X = F.exercicio;
    const exsF = [
      X({ n: 1, enun: R`<p>$100\ \Omega$, $220\ \Omega$ e $330\ \Omega$ em série numa fonte de $12$ V. Ache $R_\text{eq}$, a corrente e a tensão no de $220\ \Omega$.</p>`, fig: "", dicas: [R`<p>Série: soma.</p>`, R`<p>$i = 12/650$.</p>`], resp: R`$650\ \Omega$; $\approx 18{,}5$ mA; $\approx 4{,}1$ V.`, sol: R`<p>$i = 18{,}46$ mA; $U = 220i \approx 4{,}06$ V.</p>` }),
      X({ n: 2, enun: R`<p>$6\ \Omega$, $3\ \Omega$ e $2\ \Omega$ em paralelo. $R_\text{eq}$?</p>`, fig: "", alts: ["$11\\ \\Omega$", "$1\\ \\Omega$", "$2\\ \\Omega$", "$3{,}7\\ \\Omega$", "$0{,}5\\ \\Omega$"], dicas: [R`<p>Some os inversos.</p>`, R`<p>$1/6 + 1/3 + 1/2 = 1$.</p>`], resp: "B", sol: R`<p>$1/R = 1/6 + 2/6 + 3/6 = 1$. Sempre menor que o menor resistor. <b>A</b> é série; <b>C</b> é quem esqueceu de inverter no fim.</p>` }),
      X({ n: 3, marcas: ["★"], enun: R`<p>No circuito, ache a corrente em cada resistor.</p>`, fig: figMisto, dicas: [R`<p>$6 \parallel 3 = 2\ \Omega$.</p>`, R`<p>$R_\text{eq} = 6\ \Omega$, $i = 2$ A; o paralelo fica com $4$ V.</p>`], resp: R`$2$ A no de $4\ \Omega$; $0{,}67$ A no de $6\ \Omega$; $1{,}33$ A no de $3\ \Omega$.`, sol: R`<p>$U_p = 2\times2 = 4$ V; $i_6 = 4/6$, $i_3 = 4/3$ A.</p>` }),
      X({ n: 4, enun: R`<p>Divisor de $10$ kΩ / $10$ kΩ em $10$ V. Liga-se um voltímetro de $10$ kΩ na saída. O que ele marca?</p>`, fig: "", dicas: [R`<p>O voltímetro fica em paralelo com o resistor de baixo.</p>`, R`<p>$10 \parallel 10 = 5$ kΩ.</p>`], resp: R`$\approx 3{,}3$ V (em vez de $5$ V).`, sol: R`<p>$10\times5/15 \approx 3{,}33$ V. O medidor "pesa" no circuito ${F.ret("C09")}.</p>` }),
      X({ n: 5, marcas: ["?"], enun: R`<p>Duas lâmpadas iguais ligadas em série numa tomada. Uma queima. A outra:</p>`, fig: "", alts: ["brilha o dobro", "brilha igual", "apaga", "brilha 4 vezes mais", "brilha metade"], dicas: [R`<p>Série: um caminho só.</p>`, R`<p>Lâmpada queimada = circuito aberto.</p>`], resp: "C", sol: R`<p>Circuito aberto, corrente zero: as duas apagam. Em paralelo (como na casa), a outra continuaria acesa, com o mesmo brilho.</p>` }),
      X({ n: 6, enun: R`<p>Ponte de Wheatstone com $R_1 = 100\ \Omega$, $R_2 = 150\ \Omega$, $R_3 = 220\ \Omega$. Qual $R_4$ equilibra a ponte (corrente zero em $R_5$)?</p>`, fig: figPonte, dicas: [R`<p>Equilíbrio: os dois pontos do meio no mesmo potencial.</p>`, R`<p>$R_1/R_2 = R_3/R_4$.</p>`], resp: R`$330\ \Omega$.`, sol: R`<p>$R_4 = R_2R_3/R_1 = 330\ \Omega$. Com a ponte equilibrada, $R_5$ pode ser retirado (ou trocado por um fio) sem mudar nada.</p>` }),
    ];
    const exsM = [
      X({ n: 7, marcas: ["★", "!", "RU"], enun: R`<p>Doze resistores de $12\ \Omega$ formam as arestas de um cubo. Qual a resistência entre vértices opostos (A e B)? E entre vértices vizinhos?</p>`, fig: figCubo,
        dicas: [R`<p>Simetria: os 3 vizinhos de A estão no mesmo potencial (e os 3 vizinhos de B também). Pontos de mesmo potencial podem ser unidos por um fio.</p>`, R`<p>Opostos: 3 em paralelo, depois 6 em paralelo, depois 3 em paralelo: $\frac R3 + \frac R6 + \frac R3$.</p>`], resp: R`$10\ \Omega$ ($5R/6$); vizinhos: $7\ \Omega$ ($7R/12$).`, sol: R`<p>Opostos: $\frac{R}{3} + \frac{R}{6} + \frac{R}{3} = \frac{5R}{6} = 10\ \Omega$. Vizinhos: dá $7R/12$ (por superposição: injete $I$ em A, ela se divide igualmente pelas 3 arestas; retire $I$ de B; some). Conferi as duas resolvendo a rede numericamente.</p>` }),
      X({ n: 8, marcas: ["!", "★"], enun: R`<p>Uma escada infinita: resistores $R = 10\ \Omega$ em série no trilho de cima e resistores $R$ entre os trilhos, repetindo para sempre. Qual a resistência de entrada?</p>`, fig: figEscada, dicas: [R`<p>Tirando o primeiro "degrau", o que sobra é a mesma escada infinita.</p>`, R`<p>$R_\text{eq} = R + \frac{R\,R_\text{eq}}{R + R_\text{eq}}$.</p>`], resp: R`$R_\text{eq} = \frac{1+\sqrt5}{2}R \approx 16{,}2\ \Omega$.`, sol: R`<p>$R_\text{eq}^2 - RR_\text{eq} - R^2 = 0 \Rightarrow R_\text{eq} = R\frac{1+\sqrt5}{2}$: a <b>razão áurea</b>! Descarta-se a raiz negativa.</p>` }),
      X({ n: 9, marcas: ["!!"], enun: R`<p>Ponte desequilibrada: $R_1 = 10$, $R_2 = 20$, $R_3 = 30$, $R_4 = 40$ e $R_5 = 50\ \Omega$ (na posição da figura). Qual a resistência entre A e B?</p>`, fig: figPonte, dicas: [R`<p>Não é série nem paralelo. Use a transformação triângulo → estrela, ou as leis de Kirchhoff com potenciais nos nós ${F.ret("C10b")}.</p>`, R`<p>Ligue 1 V entre A e B, chame os potenciais do meio de $x$ (em cima) e $y$ (embaixo) e escreva a lei dos nós em cada um.</p>`], resp: R`$\approx 20{,}9\ \Omega$.`, sol: R`<p>Nós: $\frac{1-x}{10} = \frac{x}{20} + \frac{x-y}{50}$ e $\frac{1-y}{30} + \frac{x-y}{50} = \frac{y}{40}$. Resolvendo, a corrente total é $\frac{1-x}{10} + \frac{1-y}{30}$, e $R = 1/i \approx 20{,}95\ \Omega$ (conferido numericamente).</p>` }),
    ];

    const chefao = F.chefao({ titulo: "A grade infinita", fig: D.svg(300, 260, (() => { let s = ""; for (let k = 0; k < 6; k++) { s += `<line x1="20" y1="${30 + 40 * k}" x2="280" y2="${30 + 40 * k}" class="ln2"/><line x1="${30 + 48 * k}" y1="10" x2="${30 + 48 * k}" y2="250" class="ln2"/>`; } return s + D.no(126, 110) + D.no(174, 110) + D.txt(120, 100, "A", "tx", "end") + D.txt(182, 100, "B", "tx", "start"); })(), "grade"),
      enun: R`<p>Uma grade quadrada infinita é feita de resistores iguais $R$ em todas as arestas.</p>
        <ol type="a"><li>Qual a resistência entre dois nós <b>vizinhos</b> A e B? (Sem integrais: superposição.)</li><li>Faça o mesmo para uma grade <b>triangular</b> infinita (cada nó com 6 vizinhos) e para uma <b>hexagonal</b> (favo de mel, 3 vizinhos).</li><li>Generalize: rede infinita em que cada nó tem $z$ vizinhos e todos os nós são equivalentes.</li><li>Por que a resistência entre nós <b>distantes</b> numa grade 2D cresce sem limite (como $\ln d$), mas numa rede 3D tende a uma constante?</li></ol>`,
      dicas: [R`<p>(a) Situação 1: injete $I$ em A e deixe sair no infinito. Por simetria, $I/4$ vai por cada aresta de A. Situação 2: retire $I$ de B (entrando do infinito): $I/4$ chega por cada aresta de B.</p>`, R`<p>Somando as duas situações, na aresta AB passam $I/4 + I/4 = I/2$, e não entra nem sai nada do infinito. Então $V_{AB} = R\cdot I/2$.</p>`],
      sol: R`<p><b>(a)</b> Superpondo: $V_A - V_B = R\cdot\frac I2 \Rightarrow R_{AB} = \frac R2$. (Conferi resolvendo uma grade de 161×161 nós: $0{,}50002R$.)</p>
        <p><b>(b)</b> Triangular: $I/6 + I/6 = I/3$ na aresta, $R/3$. Hexagonal: $I/3 + I/3$, $\frac{2R}{3}$.</p>
        <p><b>(c)</b> $R_{AB} = \frac{2R}{z}$. Teste no cubo (finito, não vale!) e veja que não bate: a superposição precisa do "infinito" como terra simétrica.</p>
        <p><b>(d)</b> Uma corrente injetada num ponto se espalha: em 2D, a "área" atravessada a distância $r$ é $\propto r$ e $dR \propto dr/r$, que integra para $\ln r$ e diverge. Em 3D, a área é $\propto r^2$ e $\int dr/r^2$ converge. É o mesmo cálculo do aterramento ${F.ret("C07")} e da lei de Gauss em 2 e 3 dimensões ${F.ret("C03b")}.</p>` });

    return [
      F.secao("abertura", "Pergunta de abertura", R`<div class="abertura"><div class="det">Antes de tudo</div><div class="q">Por que, quando você liga o chuveiro, a luz do banheiro dá uma piscada?</div></div>`),
      F.secao("laboratorio", "Laboratório: série, paralelo e misto", R`<p>Troque a montagem e mexa nos resistores. A velocidade das bolinhas em cada trecho é proporcional à corrente nele.</p>
        ${F.chute({ q: "em paralelo, você aumenta só o R₃. A corrente em R₁:", ops: ["aumenta", "diminui", "não muda", "zera"], certa: 2, exp: R`<p><b>Não muda</b> (com fonte ideal): R₁ continua com a tensão inteira da fonte. Só a corrente total muda. Com uma fonte real, com resistência interna, a história muda: é a piscada da luz quando o chuveiro liga ${F.ret("C10")}.</p>` })}
        <div id="lab-as"></div>`),
      F.secao("ideia", "A ideia física", R`<p>Duas regras fazem tudo: <b>carga se conserva</b> (o que entra num nó sai) e <b>energia se conserva</b> (somando as quedas de tensão numa volta completa, dá zero). Em série, a carga só tem um caminho: mesma corrente. Em paralelo, os resistores estão ligados aos mesmos dois pontos: mesma tensão.</p>
        <p>A piscada do chuveiro: ele está em paralelo com a lâmpada, mas os fios até o quadro e a própria rede têm resistência. Quando o chuveiro puxa 25 A, a queda nesses fios aumenta e sobra menos tensão para a lâmpada.</p>`),
      F.secao("teoria", "Teoria completa", R`
        <h3>1. Série</h3>
        ${F.demo("resistência em série", R`<p>(i) Um caminho só: mesma corrente $i$ em todos. (ii) A tensão total é a soma: $U = R_1i + R_2i + \dots$ (iii) Comparando com $U = R_\text{eq}i$:</p>${F.formula(R`R_\text{eq} = R_1 + R_2 + \dots + R_n`)}`)}
        <p>Divisor de tensão: $U_k = U\frac{R_k}{R_\text{eq}}$. Quem tem mais resistência fica com mais tensão (e mais potência, $P = R i^2$).</p>
        <h3>2. Paralelo</h3>
        ${F.demo("resistência em paralelo", R`<p>(i) Todos ligados aos mesmos dois nós: mesma tensão $U$. (ii) Lei dos nós: $i = \frac U{R_1} + \frac U{R_2} + \dots$ (iii) Comparando com $i = U/R_\text{eq}$:</p>${F.formula(R`\frac{1}{R_\text{eq}} = \frac1{R_1} + \frac1{R_2} + \dots,\qquad R_1\parallel R_2 = \frac{R_1R_2}{R_1+R_2}`)}`)}
        <p>Divisor de corrente: $i_k = i\frac{R_\text{eq}}{R_k}$. O <b>menor</b> resistor leva a maior corrente. $n$ iguais: $R/n$. Condutâncias ($G = 1/R$, em siemens) em paralelo simplesmente somam.</p>
        <h3>3. Circuitos mistos</h3>
        ${F.fig(figMisto)}
        <p>Receita: (1) ache um grupo que seja puramente série ou paralelo; (2) troque pelo equivalente; (3) repita até sobrar um resistor; (4) volte o caminho, calculando correntes e tensões.</p>
        ${F.caixa("pegadinha", R`<p><b>Curto-circuito:</b> um fio ligando dois pontos põe os dois no mesmo potencial; tudo o que estava só entre eles fica sem corrente. Redesenhe o circuito juntando pontos ligados por fios sem resistência: muito "misto" vira simples.</p>`)}
        <h3>4. Pontes e simetria</h3>
        ${F.fig(figPonte)}
        <p><b>Ponte de Wheatstone equilibrada</b> ($R_1R_4 = R_2R_3$): os dois nós do meio estão no mesmo potencial, e $R_5$ não leva corrente, pode ser removido. Sem equilíbrio, use Kirchhoff ${F.ret("C10b")} ou a transformação triângulo–estrela.</p>
        ${F.formula(R`\Delta \to Y:\quad R_a = \frac{R_{ab}R_{ac}}{R_{ab}+R_{bc}+R_{ca}}\ \text{(e análogos)}`)}
        ${F.caixa("olimpiada", R`<p><b>Simetria e pontos de mesmo potencial</b> (cubo, polígonos, redes): pontos equivalentes por simetria têm o mesmo potencial e podem ser unidos ou separados à vontade. <b>Autossemelhança</b> (redes infinitas): a rede depois do primeiro bloco é igual à rede inteira. <b>Superposição</b> com injeção de corrente: o chefão.</p>`)}
        ${F.fig(figCubo)}`),
      F.secao("exemplos", "Exemplos passo a passo", exemplario),
      F.secao("resumo", "Resumo", R`<div class="resumo"><div class="r"><b>Série</b>$R = \sum R_i$; mesma corrente</div><div class="r"><b>Paralelo</b>$1/R = \sum1/R_i$; mesma tensão</div><div class="r"><b>Dois em paralelo</b>produto/soma</div><div class="r"><b>Wheatstone</b>equilíbrio: $R_1R_4 = R_2R_3$</div><div class="r"><b>Cubo</b>opostos $5R/6$; vizinhos $7R/12$</div><div class="r"><b>Grade infinita</b>vizinhos $2R/z$</div></div>`),
      F.secao("exercicios", "Exercícios", `<div class="exs-nivel"><h3>Nível Físico</h3><span class="selo">fixação</span></div>${exsF.join("")}<div class="exs-nivel"><h3>Nível Máximo</h3><span class="selo">OBF · ITA · RU</span></div>${exsM.join("")}`),
      F.secao("chefao", "Chefão", chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-as"); e.outerHTML = F.lab("Associação de resistores", "lab-as"); SIM.associacao(document.getElementById("lab-as"), F); },
});
