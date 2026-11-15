/* O03 · Ondas estacionárias. Conferido em Python:
   corda Lá do violão (L = 0,65 m, 110 Hz): v = 143 m/s; com μ = 6 g/m, T = 122,7 N; meio tom acima: T × 2^(2/12) = 137,7 N;
   tubo aberto de 0,6 m e fechado de 0,3 m: 285,8 Hz; micro-ondas com nós a 6,1 cm: 2,46 GHz;
   tubo de ressonância (440 Hz, ressonâncias a 19 cm e 57,5 cm): λ = 0,77 m, v = 338,8 m/s, correção de ponta 0,25 cm;
   corda pinçada no meio: bₙ ∝ sen(nπ/2)/n² (pares somem); a 1/5: o 5º some. */
F.registrar("O03", {
  retoma: ["O01", "O02", "matematica/CII04"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Harmônicos",
      casos: [
        { nome: "Corda de instrumento", gerar: (p) => {
          const L = p ? 0.65 : F.escolha([0.33, 0.65, 1.0]), f1 = p ? 110 : F.escolha([82.4, 110, 196, 329.6]), mu = p ? 6 : F.escolha([2, 4, 6]);
          const v = 2 * L * f1, T = (mu / 1000) * v * v;
          return { enun: R`<p>Uma corda de ${F.n(L)} m e densidade ${mu} g/m deve vibrar com fundamental de ${F.n(f1)} Hz. Qual a velocidade das ondas, a tração necessária e os 3 primeiros harmônicos?</p>`, fig: "",
            passos: [R`<p>Fundamental da corda presa: $\lambda_1 = 2L$, então $v = 2Lf_1 = ${F.n(v, 1)}$ m/s.</p>`, R`<p>$T = \mu v^2 = ${F.n(mu / 1000)}\cdot${F.n(v, 1)}^2 \approx ${F.n(T, 1)}$ N.</p>`, R`<p>Harmônicos: $f_n = nf_1$: ${F.n(f1, 1)}, ${F.n(2 * f1, 1)} e ${F.n(3 * f1, 1)} Hz. Todos juntos dão o "timbre" da nota.</p>`] };
        } },
        { nome: "Tubos: aberto × fechado", gerar: (p) => {
          const L = p ? 0.6 : F.escolha([0.3, 0.6, 1.2]), v = 343;
          return { enun: R`<p>Um tubo de ${F.n(L)} m. Quais os 3 primeiros harmônicos se ele for aberto nas duas pontas? E se uma ponta for fechada? (som a 343 m/s)</p>`, fig: "",
            passos: [R`<p>Aberto–aberto: ventres nas duas pontas, $\lambda_n = \frac{2L}{n}$, $f_n = \frac{nv}{2L}$: ${[1, 2, 3].map((n) => F.n((n * v) / (2 * L), 1)).join("; ")} Hz.</p>`, R`<p>Fechado–aberto: nó na ponta fechada e ventre na aberta, $\lambda = \frac{4L}{m}$ com $m$ <b>ímpar</b>: $f = \frac{mv}{4L}$ = ${[1, 3, 5].map((m) => F.n((m * v) / (4 * L), 1)).join("; ")} Hz.</p>`, R`<p>O fechado soa uma oitava abaixo e sem os harmônicos pares: um som "oco" (o clarinete se comporta assim; a flauta, como tubo aberto).</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Onde pinçar a corda",
      enun: R`<p>Uma corda presa em $x = 0$ e $x = L$ é puxada no ponto $x = a$ até uma altura $h$ (forma de triângulo) e solta do repouso. A forma inicial se escreve como soma de harmônicos (série de Fourier): $y(x, 0) = \sum b_n\sin\frac{n\pi x}{L}$, com $b_n = \frac{2hL^2}{\pi^2a(L - a)}\cdot\frac{\sin(n\pi a/L)}{n^2}$. (a) Que harmônicos <b>não</b> aparecem se a corda for pinçada no meio? (b) E a 1/5 do comprimento? (c) Por que os harmônicos altos são fracos? (d) Por que um violonista toca perto da boca do violão (perto da ponta) para um som "brilhante", e perto do meio para um som "doce"?</p>`,
      fig: "",
      dicas: [R`<p>(a) $\sin(n\pi/2) = 0$ para $n$ par.</p>`, R`<p>(c) Olhe o $1/n^2$.</p>`],
      sol: R`<p><b>(a)</b> No meio, $\sin(n\pi/2) = 0$ para todo $n$ par: só sobram os harmônicos ímpares (1º, 3º, 5º…), com $b_3/b_1 = -1/9$, $b_5/b_1 = 1/25$.</p>
        <p><b>(b)</b> Em $a = L/5$: $\sin(n\pi/5) = 0$ para $n = 5, 10, 15\dots$ Some o 5º harmônico e os seus múltiplos. Faz sentido: o ponto pinçado não pode ser nó de um modo que ele mesmo excita.</p>
        <p><b>(c)</b> O $1/n^2$: a forma triangular tem "bico" (inclinação descontínua), e cada derivada que falta na suavidade da forma inicial custa um fator $1/n$ nos coeficientes ${F.ret("matematica/CII04")}. Um martelo de piano (bem mais "duro") excita harmônicos mais altos que um dedo.</p>
        <p><b>(d)</b> Perto da ponta ($a$ pequeno), $\sin(n\pi a/L) \approx n\pi a/L$, e os $b_n$ caem só como $1/n$: muitos harmônicos altos, som brilhante e metálico. No meio, os pares somem e os altos caem rápido: som mais puro e doce. A física do timbre é Fourier.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Ondas · ondas estacionárias</div>
        <div class="q">Por que uma corda de violão só toca certas notas?</div>
        <p>Porque a onda vai, bate na ponta, volta e se soma com ela mesma. Na maioria das frequências, as idas e voltas se embaralham e se cancelam. Só em algumas, as <b>ressonâncias</b>, elas se reforçam e formam um padrão que não anda: uma onda estacionária. As notas possíveis são uma escada: $f$, $2f$, $3f$… Isso é a música, e também é a quantização da energia no átomo ${F.ret("C17b")}.</p></div>`),

      F.secao("superposicao", "Duas ondas que não andam", R`
        ${F.formula(R`A\sin(kx - \omega t) + A\sin(kx + \omega t) = 2A\sin(kx)\cos(\omega t)`, "Onda estacionária")}
        <p>Cada ponto oscila com amplitude $2A|\sin kx|$, fixa no lugar. Onde $\sin kx = 0$ (a cada $\lambda/2$), o ponto fica parado: <b>nó</b>. No meio entre dois nós, amplitude máxima: <b>ventre</b>. A distância entre nós vizinhos é $\lambda/2$. A energia não viaja: fica indo e vindo entre cinética (corda reta, rápida) e potencial (corda curvada, parada).</p>
        <div id="lab-est"></div>
        ${F.caixa("fisico", R`<p><b>Nós em casa</b>: o micro-ondas tem ondas estacionárias dentro (por isso o prato gira). Tire o prato, ponha uma barra de chocolate por 20 segundos e meça a distância entre as manchas derretidas (ventres): ~6,1 cm $= \lambda/2$. Então $\lambda \approx 12{,}2$ cm e $c = \lambda f = 0{,}122\cdot2{,}45\times10^9 \approx 3\times10^8$ m/s: a velocidade da luz medida na cozinha.</p>`)}`),

      F.secao("modos", "Cordas e tubos", R`
        ${F.formula(R`\text{corda presa / tubo aberto: } f_n = \frac{nv}{2L},\ n = 1, 2, 3\dots\qquad \text{tubo fechado: } f_m = \frac{mv}{4L},\ m = 1, 3, 5\dots`, "Frequências de ressonância")}
        <table class="tb"><tr><th>sistema</th><th>pontas</th><th>cabe</th><th>harmônicos</th></tr>
          <tr><td>corda presa nas duas pontas</td><td>nó, nó</td><td>$L = n\frac\lambda2$</td><td>todos</td></tr>
          <tr><td>tubo aberto nas duas pontas</td><td>ventre, ventre (de deslocamento)</td><td>$L = n\frac\lambda2$</td><td>todos</td></tr>
          <tr><td>tubo fechado numa ponta</td><td>nó, ventre</td><td>$L = m\frac\lambda4$, $m$ ímpar</td><td>só ímpares</td></tr></table>
        <p>No ar dentro do tubo, "nó de deslocamento" (o ar não se mexe) é <b>ventre de pressão</b> (ele é comprimido e descomprimido ao máximo), e vice-versa. Na ponta aberta, a pressão é a da atmosfera: nó de pressão. (Na verdade, o ventre fica um pouquinho para fora do tubo: a "correção de ponta", ~0,6 × o raio.)</p>
        ${F.caixa("olimpiada", R`<p><b>Escala musical</b>: subir uma oitava é dobrar a frequência; um semitom é multiplicar por $2^{1/12} \approx 1{,}0595$. No violão, apertar a casa $k$ encurta a corda para $L\cdot2^{-k/12}$; a 12ª casa fica exatamente no meio. Para afinar meio tom acima apertando a tarraxa, a tração tem de subir $2^{2/12} - 1 \approx 12\%$ (porque $f \propto \sqrt T$).</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Uma corda de 1 m presa nas pontas tem ondas a 200 m/s. Quais as 3 primeiras frequências de ressonância?</p>`, fig: "", dicas: [R`<p>$f_n = nv/(2L)$.</p>`, R`<p>$f_1 = 100$ Hz.</p>`], resp: R`100, 200 e 300 Hz.`, sol: R`<p>No 2º harmônico, há um nó no meio: encostar o dedo levemente ali (sem apertar) mata o 1º e deixa o 2º: é o "harmônico" que os violonistas tocam na 12ª casa.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>A corda Lá de um violão tem 0,65 m, fundamental de 110 Hz e densidade de 6 g/m. Qual a tração? E para afinar meio tom acima (116,5 Hz)?</p>`, fig: "", dicas: [R`<p>$v = 2Lf = 143$ m/s; $T = \mu v^2$.</p>`, R`<p>$f \propto \sqrt T$: $T' = T\cdot2^{2/12}$.</p>`], resp: R`$\approx 122{,}7$ N; $\approx 137{,}7$ N.`, sol: R`<p>São uns 12 kgf na corda. Um violão com 6 cordas aguenta uns 70 kgf no braço.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Um tubo aberto de 60 cm e um tubo fechado de 30 cm: quais as fundamentais? Eles soam igual?</p>`, fig: "", dicas: [R`<p>Aberto: $v/2L$. Fechado: $v/4L$.</p>`, R`<p>Compare os harmônicos seguintes.</p>`], resp: R`Os dois têm 285,8 Hz, mas não soam igual: o aberto tem 571,7 Hz como 2º harmônico; o fechado pula para 857,5 Hz.`, sol: R`<p>Mesma nota, timbres diferentes: o espectro de harmônicos é a "cor" do som.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Onde fica a 12ª casa de um violão de escala 65 cm? E a 7ª (uma quinta acima)?</p>`, fig: "", dicas: [R`<p>Comprimento vibrando: $L\cdot2^{-k/12}$.</p>`, R`<p>A casa fica a $L - L\cdot2^{-k/12}$ da pestana.</p>`], resp: R`12ª: a 32,5 cm (o meio). 7ª: a $65(1 - 2^{-7/12}) \approx 21{,}6$ cm.`, sol: R`<p>$2^{-7/12} \approx 0{,}667$: quase $2/3$. Por isso a quinta "soa bem": a razão de frequências é quase exatamente $3/2$.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Num micro-ondas sem prato giratório, as manchas derretidas de um chocolate ficam a 6,1 cm uma da outra. Qual a frequência do aparelho?</p>`, fig: "", dicas: [R`<p>Manchas = ventres; distância entre ventres = $\lambda/2$.</p>`, R`<p>$f = c/\lambda$.</p>`], resp: R`$\approx 2{,}46$ GHz (o valor de fábrica é 2,45 GHz).`, sol: R`<p>Ótimo experimento caseiro: mede $c$ com erro de ~1%.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Mostre que $A\sin(kx - \omega t) + A\sin(kx + \omega t) = 2A\sin kx\cos\omega t$ e que os nós ficam a cada $\lambda/2$.</p>`, fig: "", dicas: [R`<p>$\sin(\alpha - \beta) + \sin(\alpha + \beta) = 2\sin\alpha\cos\beta$.</p>`, R`<p>Nós: $\sin kx = 0 \Rightarrow kx = n\pi$.</p>`], resp: R`Nós em $x = n\pi/k = n\lambda/2$.`, sol: R`<p>No laboratório, ligue "mostrar as duas ondas viajantes": a soma das duas (azul e rosa) é a corda.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Num tubo de ressonância (fechado embaixo pela água), com um diapasão de 440 Hz, as ressonâncias aparecem com a coluna de ar de 19,0 cm e de 57,5 cm. Ache a velocidade do som e a correção de ponta.</p>`, fig: "", dicas: [R`<p>Entre duas ressonâncias seguidas, a coluna cresce $\lambda/2$ (a correção de ponta cancela).</p>`, R`<p>A primeira ressonância é $L_1 + e = \lambda/4$.</p>`], resp: R`$\lambda = 0{,}77$ m, $v \approx 338{,}8$ m/s, $e \approx 0{,}25$ cm.`, sol: R`<p>Usar a diferença $L_2 - L_1$ elimina o erro sistemático da correção de ponta: é o mesmo truque de "medir a diferença" que você vai ver na física experimental.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-est"); e.outerHTML = F.lab("Cordas e tubos", "lab-est"); SIM.estacionaria(document.getElementById("lab-est"), F); },
});
