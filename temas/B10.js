/* B10 · Espelhos planos (base: Halliday vol. 4, cap. 34, e conteúdo de ensino médio, com as minhas palavras). Conferido em Python:
   número de imagens 360°/α − 1: 90° → 3, 72° → 4, 60° → 5, 45° → 7, 120° → 2; espelho de corpo inteiro para 1,80 m: 0,90 m (olhos a 1,70 m: borda de baixo a 0,85 m);
   girar o espelho de θ gira o raio refletido de 2θ. */
F.registrar("B10", {
  retoma: ["B09"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Espelhos planos",
      casos: [
        { nome: "Espelhos em ângulo", gerar: (p) => {
          const a = p ? 60 : F.escolha([30, 36, 40, 45, 60, 72, 90, 120]), n = 360 / a - 1;
          return { enun: R`<p>Dois espelhos planos formam um ângulo de ${a}°. Quantas imagens de um objeto colocado entre eles você vê?</p>`, fig: "",
            passos: [
              R`<p>Cada espelho forma uma imagem do objeto; essa imagem serve de objeto para o outro espelho, e assim por diante. Todas ficam sobre uma circunferência centrada no vértice.</p>`,
              R`<p>Com $\frac{360°}{\alpha}$ inteiro: $n = \frac{360°}{\alpha} - 1 = \frac{360}{${a}} - 1 = ${n}$.</p>`,
              R`<p>${a === 90 ? "Em 90°, as 3 imagens são como os quatro quadrantes de um plano: é o \"espelho que não inverte\" (a imagem do canto mostra você como os outros te veem)." : a <= 45 ? "Ângulos pequenos dão muitas imagens: é o caleidoscópio." : "Confira no laboratório, inclusive mexendo na posição do objeto: com 360°/α inteiro, o número não muda."}</p>`,
            ] };
        } },
        { nome: "Espelho girando", gerar: (p) => {
          const t = p ? 10 : F.escolha([5, 10, 15, 20, 30]);
          return { enun: R`<p>Um raio de luz fixo bate num espelho plano. O espelho gira ${t}°. De quanto gira o raio refletido?</p>`, fig: "",
            passos: [
              R`<p>Girar o espelho de $\theta$ gira a normal de $\theta$. O ângulo de incidência muda $\theta$, e o de reflexão também.</p>`,
              R`<p>O raio refletido, que faz com o incidente um ângulo de $2i$, passa a fazer $2(i + \theta)$: gira $2\theta = ${2 * t}°$.</p>`,
              R`<p>Esse fator 2 é usado para amplificar rotações minúsculas: um feixe de laser refletido num espelhinho preso a um fio mede torções pequeníssimas (balança de torção de Cavendish, galvanômetros antigos).</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O retrorrefletor e as medidas da distância da Lua",
      enun: R`<p>(a) Dois espelhos planos formam um ângulo de 90°. Mostre que qualquer raio, no plano perpendicular aos dois, que reflete nos dois volta exatamente <b>paralelo e em sentido contrário</b> ao incidente. (b) Generalize: três espelhos mutuamente perpendiculares (um "canto de cubo") fazem isso para qualquer raio no espaço. Mostre usando vetores: cada reflexão num espelho perpendicular a um eixo troca o sinal de uma componente da direção. (c) Os astronautas da Apollo deixaram painéis desses na Lua. Um pulso de laser vai e volta em 2,56 s. Qual a distância Terra–Lua? Com resolução de tempo de 10 ps, que precisão se consegue?</p>`,
      fig: "",
      dicas: [R`<p>(a) A soma dos ângulos internos do triângulo formado pelos dois espelhos e o raio.</p>`, R`<p>(b) Reflexão num espelho perpendicular a $\hat x$: $(d_x, d_y, d_z) \to (-d_x, d_y, d_z)$.</p>`],
      sol: R`<p><b>(a)</b> Na 1ª reflexão, o raio é girado de $2\theta_1$; na 2ª, de $2\theta_2$, onde $\theta_1 + \theta_2 = 90°$ (os dois espelhos são perpendiculares). Rotação total: $2\cdot90° = 180°$: o raio sai paralelo e invertido, para qualquer ângulo de entrada.</p>
        <p><b>(b)</b> Três reflexões, uma em cada espelho: $(d_x, d_y, d_z) \to (-d_x, -d_y, -d_z)$, ou seja, $\vec d \to -\vec d$ ∎. A ordem não importa.</p>
        <p><b>(c)</b> $d = \frac{c\,t}{2} = \frac{3\times10^8\cdot2{,}56}{2} \approx 3{,}84\times10^8$ m. Com 10 ps: $\Delta d = \frac{c\,\Delta t}{2} = 1{,}5$ mm. As medidas mostram que a Lua se afasta ~3,8 cm por ano, e testam a relatividade geral. Os olhos de gato de bicicleta e as faixas refletivas de roupa são o mesmo truque, em miniatura.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Óptica · espelhos planos</div>
        <div class="q">O espelho troca a direita com a esquerda. Por que ele não troca o de cima com o de baixo?</div>
        <p>Ele não troca nenhum dos dois: ele troca a frente com o trás (a direção perpendicular a ele). A "troca de lados" é uma ilusão de quem se imagina virando para ficar no lugar da imagem. Para entender, basta uma lei: ângulo de incidência igual ao de reflexão.</p></div>`),

      F.secao("lei", "Leis da reflexão e a imagem", R`
        ${F.formula(R`\theta_\text{incidência} = \theta_\text{reflexão}\qquad\text{(medidos a partir da normal, no mesmo plano)}`, "Leis da reflexão")}
        <p>Ela sai do princípio de Fermat (o caminho mais rápido entre dois pontos passando pelo espelho) ou da construção de Huygens ${F.ret("B12")}. Num espelho plano, todos os raios que saem de um ponto P e refletem parecem vir de um ponto P′ atrás do espelho:</p>
        <ul><li>P′ é o <b>simétrico</b> de P em relação ao plano do espelho: mesma distância, do outro lado.</li>
          <li>A imagem é <b>virtual</b> (os raios não passam por lá de verdade), <b>direita</b> e do <b>mesmo tamanho</b>.</li>
          <li>É <b>enantiomorfa</b>: uma mão direita vira uma mão esquerda. A troca é na direção perpendicular ao espelho, por isso texto aparece "ao contrário" (AMBULÂNCIA escrita espelhada na frente da ambulância, para ser lida no retrovisor).</li></ul>
        ${F.demo("o espelho de corpo inteiro tem metade da sua altura", R`<p>(i) Para ver os pés, o raio que sai dos pés reflete no espelho e chega ao olho. Pela lei da reflexão, ele bate no espelho na metade da altura entre os pés e os olhos.</p>
          <p>(ii) Para ver o topo da cabeça, o raio bate na metade da altura entre os olhos e o topo.</p>
          <p>(iii) O espelho precisa ir de um ponto ao outro: metade da sua altura (0,90 m para 1,80 m), <b>não importa a distância</b> até ele ∎. A borda de baixo fica na metade da altura dos olhos.</p>`)}
        <p><b>Deslocamentos</b>: se você se afasta $d$ do espelho, sua imagem se afasta $d$ dele, e $2d$ de você. Se o <b>espelho</b> anda $d$, a imagem anda $2d$. Se o espelho gira $\theta$, o raio refletido gira $2\theta$.</p>`),

      F.secao("associacao", "Espelhos em ângulo", R`
        <div id="lab-cal"></div>
        ${F.formula(R`n = \frac{360°}{\alpha} - 1\qquad\text{(quando } \tfrac{360°}{\alpha} \text{ é inteiro)}`, "Número de imagens entre dois espelhos")}
        <p>Com espelhos <b>paralelos</b> ($\alpha \to 0$), as imagens são infinitas: o "corredor infinito" dos elevadores (cada vez mais escuro, porque cada reflexão perde ~5–10% da luz). O caleidoscópio usa três espelhos a 60°: as imagens enchem o plano com um padrão de simetria hexagonal.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Quantas imagens se formam entre dois espelhos a 90°? E a 45°? E a 72°?</p>`, fig: "", dicas: [R`<p>$n = 360/\alpha - 1$.</p>`, R`<p>Os três dão 360/α inteiro.</p>`], resp: R`3, 7 e 4.`, sol: R`<p>Confira no laboratório.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Uma pessoa de 1,80 m, com os olhos a 1,70 m do chão, quer se ver de corpo inteiro num espelho plano vertical. Qual a altura mínima do espelho e a que altura do chão fica a borda de baixo?</p>`, fig: "", dicas: [R`<p>Metade da altura.</p>`, R`<p>Borda de baixo: metade da altura dos olhos.</p>`], resp: R`$0{,}90$ m de espelho, com a borda de baixo a $0{,}85$ m.`, sol: R`<p>A borda de cima fica a $1{,}75$ m (metade entre olhos e topo da cabeça). Afastar-se não ajuda nem atrapalha.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Você está a 2 m de um espelho plano e anda 0,5 m em direção a ele. Qual era e qual passou a ser a distância entre você e sua imagem? Com que velocidade a imagem se aproxima de você se você anda a 1 m/s?</p>`, fig: "", dicas: [R`<p>A imagem fica à mesma distância atrás do espelho.</p>`, R`<p>Em relação a você, a imagem anda o dobro.</p>`], resp: R`De 4 m para 3 m; a imagem se aproxima de você a 2 m/s.`, sol: R`<p>Em relação ao espelho, a imagem anda a 1 m/s (simétrica a você).</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Um raio de laser fixo reflete num espelho que gira 15°. De quanto gira o raio refletido? Num galvanômetro de espelho, a escala está a 2 m: uma rotação de 0,1° do espelho desloca a mancha de luz de quanto?</p>`, fig: "", dicas: [R`<p>O raio gira o dobro.</p>`, R`<p>Arco: $s \approx d\cdot2\theta$ (rad).</p>`], resp: R`30°; $\approx 7$ mm.`, sol: R`<p>$2\cdot0{,}1° = 0{,}2° = 3{,}49\times10^{-3}$ rad; $2\times3{,}49\times10^{-3} \approx 7$ mm. Uma alavanca óptica sem peso.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Por que a palavra AMBULÂNCIA é escrita espelhada na frente das ambulâncias? Que letras maiúsculas ficam iguais no espelho?</p>`, fig: "", dicas: [R`<p>O motorista da frente vê a ambulância pelo retrovisor.</p>`, R`<p>Letras com eixo de simetria vertical.</p>`], resp: R`Para o motorista ler certo no retrovisor; A, H, I, M, O, T, U, V, W, X, Y.`, sol: R`<p>Letras simétricas em relação a um eixo vertical não mudam quando a frente e o trás se trocam (pensando no espelho ao lado delas). É por isso que a palavra OTTO fica igual.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Dois espelhos formam um ângulo de 90°. Um objeto está entre eles. Mostre que a imagem formada por <b>duas</b> reflexões fica na posição simétrica ao objeto em relação ao vértice (rotação de 180°), e que ela <b>não</b> é invertida como as outras.</p>`, fig: "", dicas: [R`<p>Coloque os espelhos nos eixos $x$ e $y$. Refletir no eixo $x$: $(x, y) \to (x, -y)$.</p>`, R`<p>Duas reflexões: $(x, y) \to (-x, -y)$.</p>`], resp: R`$(x, y) \to (-x, -y)$: rotação de 180°, que preserva a "mão" (direita continua direita).`, sol: R`<p>Uma reflexão inverte a orientação; duas reflexões dão uma rotação, que não inverte. Por isso, no canto de dois espelhos a 90°, você se vê como os outros te veem (levante a mão direita: a imagem levanta a do mesmo lado).</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Um ponto luminoso está entre dois espelhos paralelos distantes 1 m, a 0,3 m do espelho da esquerda. Onde ficam as quatro primeiras imagens (duas de cada lado)?</p>`, fig: "", dicas: [R`<p>Ponha o espelho esquerdo em $x = 0$ e o direito em $x = 1$; o ponto em $x = 0{,}3$.</p>`, R`<p>Refletir em $x = 0$: $x \to -x$; em $x = 1$: $x \to 2 - x$.</p>`], resp: R`$x = -0{,}3$; $1{,}7$; $-1{,}7$; $2{,}3$ m (e assim por diante, infinitas).`, sol: R`<p>No esquerdo: $-0{,}3$. No direito: $1{,}7$. A imagem de $1{,}7$ no esquerdo: $-1{,}7$. A de $-0{,}3$ no direito: $2{,}3$. Elas se repetem com período $2$ m (duas vezes a distância entre os espelhos).</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-cal"); e.outerHTML = F.lab("Dois espelhos em ângulo", "lab-cal"); SIM.caleidoscopio(document.getElementById("lab-cal"), F); },
});
