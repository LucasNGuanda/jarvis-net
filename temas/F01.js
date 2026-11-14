/* F01 · Fundamentos de Mecânica. Conferido em Python:
   bola no trem (u = 5, V = 3, g = 9,8): voo 1,02 s, sobe 1,28 m, vista da plataforma sai a 5,83 m/s e 59,0°;
   chuva a 8 m/s vista de carro a 6 m/s: 10 m/s, 36,9° com a vertical; média ida 60 / volta 40 = 48 km/h;
   trens a 100 km, 50 km/h cada, mosca a 75 km/h: 75 km (1ª ida 60 km, razão 1/5). */
F.registrar("F01", {
  retoma: ["F02", "FE01"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Unidades e velocidade média",
      casos: [
        { nome: "Converter km/h ↔ m/s", gerar: (p) => {
          const v = p ? 72 : F.escolha([36, 54, 72, 90, 108, 144]);
          return { enun: R`<p>Um carro anda a ${v} km/h. Quanto é isso em m/s? E quantos metros ele anda em 3 s?</p>`, fig: "",
            passos: [R`<p>1 km/h $= \frac{1000\text{ m}}{3600\text{ s}} = \frac1{3{,}6}$ m/s. Então divida por 3,6.</p>`, R`<p>$${v}\div3{,}6 = ${F.n(v / 3.6)}$ m/s.</p>`, R`<p>Em 3 s: $${F.n(v / 3.6)}\cdot3 = ${F.n(v / 1.2)}$ m. (Por isso a "regra dos 2 segundos" de distância no trânsito vale muito mais na estrada.)</p>`] };
        } },
        { nome: "Velocidade média em dois trechos", gerar: (p) => {
          const v1 = p ? 60 : F.escolha([40, 60, 80, 90]), v2 = p ? 40 : F.escolha([20, 30, 40, 120]), d = 120, vm = (2 * v1 * v2) / (v1 + v2);
          return { enun: R`<p>Um ônibus vai de A até B (${d} km) a ${v1} km/h e volta a ${v2} km/h. Qual a velocidade escalar média na viagem toda?</p>`, fig: "",
            passos: [R`<p>Velocidade média é distância total sobre tempo total, <b>não</b> a média das velocidades.</p>`, R`<p>Tempos: $\frac{${d}}{${v1}} = ${F.n(d / v1, 3)}$ h e $\frac{${d}}{${v2}} = ${F.n(d / v2, 3)}$ h. Total: $${F.n(d / v1 + d / v2, 3)}$ h.</p>`, R`<p>$v_m = \frac{${2 * d}}{${F.n(d / v1 + d / v2, 3)}} = ${F.n(vm, 2)}$ km/h, menor que $\frac{${v1} + ${v2}}{2} = ${F.n((v1 + v2) / 2)}$: o ônibus passa mais tempo no trecho lento. (É a média harmônica: $\frac{2v_1v_2}{v_1 + v_2}$.)</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A mosca entre os trens",
      enun: R`<p>Dois trens estão a 100 km um do outro, na mesma linha, indo um contra o outro a 50 km/h cada. Uma mosca sai da frente do trem A a 75 km/h em direção ao B; quando chega nele, volta para o A, e assim por diante, até os trens se encontrarem. (a) Quanto a mosca voa no total? Faça do jeito "esperto". (b) Agora faça do jeito "difícil": calcule a primeira ida da mosca, mostre que cada viagem é uma fração fixa da anterior e some a série. (c) Quantas viagens a mosca faz?</p>`,
      fig: "",
      dicas: [R`<p>(a) Quanto tempo até os trens se encontrarem?</p>`, R`<p>(b) Na 1ª ida, mosca e trem B se aproximam a $75 + 50$ km/h. Depois veja quanto sobrou de distância entre os trens.</p>`],
      sol: R`<p><b>(a)</b> Os trens se aproximam a 100 km/h: encontram-se em 1 h. A mosca voa 1 h a 75 km/h: <b>75 km</b>.</p>
        <p><b>(b)</b> 1ª ida: $\frac{100}{125} = 0{,}8$ h, a mosca voa 60 km. Nesse tempo, cada trem andou 40 km: sobram $100 - 80 = 20$ km entre eles, $\frac15$ do começo. A situação se repete em escala $\frac15$: as viagens são $60, 12, 2{,}4, \ldots$ Soma da PG ${F.ret("F05")}: $\frac{60}{1 - 1/5} = 75$ km. Bate.</p>
        <p><b>(c)</b> Infinitas, cada vez mais curtas: uma série infinita com soma finita. (É o mesmo tipo de raciocínio do paradoxo de Aquiles e a tartaruga, de Zenão.)</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Fundamentos · mecânica</div>
        <div class="q">Você está parado ou a 1700 km/h?</div>
        <p>Sentado na cadeira, você está parado em relação ao chão; o chão gira com a Terra a uns 1700 km/h no equador; a Terra anda a 30 km/s em volta do Sol. Todas as respostas estão certas: movimento só faz sentido em relação a alguma coisa. Antes de qualquer conta de mecânica, é preciso dizer <b>o que</b> se mede, <b>em que unidade</b> e <b>em relação a quem</b>.</p></div>`),

      F.secao("grandezas", "Grandezas e unidades", R`
        <p>Uma <b>grandeza física</b> é algo que se mede: um número <b>e</b> uma unidade. "O fio tem 0,75" não diz nada; "0,75 m" diz. O Sistema Internacional (SI) tem 7 unidades de base:</p>
        <table class="tb"><tr><th>grandeza</th><th>unidade</th></tr><tr><td>comprimento</td><td>metro (m)</td></tr><tr><td>massa</td><td>quilograma (kg)</td></tr><tr><td>tempo</td><td>segundo (s)</td></tr><tr><td>corrente elétrica</td><td>ampère (A)</td></tr><tr><td>temperatura</td><td>kelvin (K)</td></tr><tr><td>quantidade de matéria</td><td>mol</td></tr><tr><td>intensidade luminosa</td><td>candela (cd)</td></tr></table>
        <p>Todas as outras são combinações: newton $= $ kg·m/s², joule $= $ N·m, watt $= $ J/s. Os prefixos andam de mil em mil: k ($10^3$), M ($10^6$), G ($10^9$), m ($10^{-3}$), μ ($10^{-6}$), n ($10^{-9}$).</p>
        ${F.caixa("fisico", R`<p><b>Notação científica e algarismos significativos.</b> Escreva $a\times10^n$ com $1 \le a < 10$: a carga do elétron é $1{,}602\times10^{-19}$ C. Os algarismos de $a$ dizem a precisão: "$2{,}50$ m" é diferente de "$2{,}5$ m". Numa multiplicação, o resultado fica com o menor número de algarismos significativos dos fatores. O módulo Experimental ${F.ret("FE01")} trata disso com cuidado.</p>`)}
        ${exemplario}`),

      F.secao("referencial", "Referencial, posição e trajetória", R`
        <p>Um <b>referencial</b> é um corpo (ou um sistema de eixos) a partir do qual se medem posições. Com ele, a <b>posição</b> de um corpo é um vetor ${F.ret("F02")}, e a <b>trajetória</b> é a curva que ele desenha. A trajetória depende do referencial: no laboratório, a bola jogada para cima dentro do trem sobe e desce na vertical para quem está no trem, e faz uma parábola para quem está na plataforma.</p>
        <p>Quando o tamanho do corpo não importa para o problema, tratamos o corpo como um <b>ponto material</b>. A Terra é um ponto na órbita em volta do Sol, mas não quando se estuda a rotação dela.</p>
        <div id="lab-ref"></div>
        ${F.formula(R`\Delta\vec r = \vec r_\text{final} - \vec r_\text{inicial},\qquad \vec v_m = \frac{\Delta\vec r}{\Delta t},\qquad v_\text{escalar média} = \frac{\text{distância percorrida}}{\Delta t}`, "Deslocamento e velocidades médias")}
        <p>O <b>deslocamento</b> é um vetor (da posição inicial à final); a <b>distância percorrida</b> é o comprimento do caminho. Numa volta completa na pista, a distância é o perímetro e o deslocamento é zero.</p>
        ${F.caixa("ponte", R`<p><b>Mudando de referencial</b> (Galileu): se o referencial B anda com velocidade $\vec V$ em relação a A, então $\vec v_A = \vec v_B + \vec V$. A chuva que cai na vertical parece inclinada para quem está num carro; um barco atravessando um rio é levado pela correnteza. Essa soma vale enquanto as velocidades forem muito menores que a da luz ${F.ret("C18")}.</p>`)}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Converta 108 km/h para m/s e 25 m/s para km/h.</p>`, fig: "", dicas: [R`<p>De km/h para m/s, divide por 3,6.</p>`], resp: R`30 m/s; 90 km/h.`, sol: R`<p>$108/3{,}6 = 30$; $25\cdot3{,}6 = 90$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Um carro vai de São Paulo a Campinas (100 km) a 60 km/h e volta a 40 km/h. Qual a velocidade escalar média na viagem toda?</p>`, fig: "", dicas: [R`<p>Calcule o tempo de cada trecho.</p>`, R`<p>Distância total: 200 km.</p>`], resp: R`48 km/h.`, sol: R`<p>$\frac{100}{60} + \frac{100}{40} = \frac53 + \frac52 = \frac{25}6$ h. $\frac{200}{25/6} = 48$ km/h, não 50. E o deslocamento total é zero: a velocidade <b>vetorial</b> média é zero.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Um corredor dá uma volta e meia numa pista circular de raio 50 m. Qual a distância percorrida e o módulo do deslocamento?</p>`, fig: "", dicas: [R`<p>Uma volta: $2\pi R$.</p>`, R`<p>Depois de meia volta, ele está no ponto diametralmente oposto.</p>`], resp: R`$3\pi R \approx 471$ m; deslocamento $2R = 100$ m.`, sol: R`<p>A volta inteira não conta no deslocamento; sobra a meia volta, que leva ao outro lado do diâmetro.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>A chuva cai na vertical a 8 m/s. Um carro anda a 6 m/s. Com que velocidade e com que ângulo (em relação à vertical) o motorista vê a chuva chegar?</p>`, fig: "", dicas: [R`<p>$\vec v_\text{chuva, carro} = \vec v_\text{chuva, chão} - \vec v_\text{carro, chão}$.</p>`, R`<p>Triângulo 6-8-10.</p>`], resp: R`10 m/s, a $\approx 36{,}9°$ da vertical, vindo da frente.`, sol: R`<p>$\tan\alpha = 6/8$. Por isso o para-brisa molha mais com o carro andando, e o vidro de trás quase não molha.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Um retângulo mede 2,5 m por 1,25 m. Escreva a área com o número certo de algarismos significativos.</p>`, fig: "", dicas: [R`<p>2,5 tem 2 algarismos significativos; 1,25 tem 3.</p>`], resp: R`3,1 m².`, sol: R`<p>$2{,}5\cdot1{,}25 = 3{,}125$, mas o resultado não pode ser mais preciso que o fator menos preciso: 2 algarismos, 3,1 m².</p>` }),
        F.exercicio({ n: 6, enun: R`<p>Quantos segundos tem um ano, em notação científica e em ordem de grandeza?</p>`, fig: "", dicas: [R`<p>$365\cdot24\cdot3600$.</p>`], resp: R`$\approx 3{,}15\times10^7$ s; ordem de grandeza $10^7$.`, sol: R`<p>Um jeito de lembrar: um ano tem "π × 10⁷ segundos" (erro de 0,4%).</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Um barco que anda a 4 m/s em relação à água atravessa um rio de 80 m de largura, com correnteza de 3 m/s, apontando sempre perpendicular à margem. Quanto tempo leva? Quanto é arrastado rio abaixo? Qual a velocidade dele em relação à margem?</p>`, fig: "", dicas: [R`<p>As direções são independentes: a travessia só depende da componente perpendicular.</p>`, R`<p>Arrasto: correnteza × tempo.</p>`], resp: R`20 s; 60 m; 5 m/s.`, sol: R`<p>$t = 80/4 = 20$ s, independente da correnteza. Arrasto: $3\cdot20 = 60$ m. Velocidade: $\sqrt{4^2 + 3^2} = 5$ m/s. Para chegar exatamente em frente, ele teria que apontar um pouco rio acima (e demoraria mais) ${F.ret("F02")}.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-ref"); e.outerHTML = F.lab("A mesma bola vista de dois referenciais", "lab-ref"); SIM.referencial(document.getElementById("lab-ref"), F); },
});
