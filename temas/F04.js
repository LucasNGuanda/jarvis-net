/* F04 · Derivada e integral para física. Conferido em Python:
   x = 5 + 3t − t²: v = 3 − 2t, para em t = 1,5 s com x = 7,25 m; ∫₀³ 2t dt = 9; mola k = 200, 0 → 0,1 m: 1 J; ∫₀² 6x² dx = 16 J;
   x = t³ − 6t² + 9t: para em t = 1 e 3; em [0, 3] deslocamento 0 e distância 8; a = 0,5t do repouso: em t = 4 s, v = 4 m/s e x = 16/3 m. */
F.registrar("F04", {
  retoma: ["matematica/CI03", "matematica/CI07", "F05"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Do x(t) para o v(t) e de volta",
      casos: [
        { nome: "Derivar a posição", gerar: (p) => {
          const a = p ? 1 : F.escolha([1, 2, -1]), b = p ? -6 : F.escolha([-6, -3, 2, 4]), c = p ? 9 : F.escolha([0, 5, 9]), t = p ? 2 : F.escolha([1, 2, 3]);
          const x = a * t ** 3 + b * t * t + c * t, v = 3 * a * t * t + 2 * b * t + c, ac = 6 * a * t + 2 * b;
          return { enun: R`<p>A posição de uma partícula é $x(t) = ${F.c(a)}t^3 ${b < 0 ? "-" : "+"} ${Math.abs(b)}t^2 ${c ? "+ " + c + "t" : ""}$ (SI). Ache $x$, $v$ e $a$ em $t = ${t}$ s.</p>`, fig: "",
            passos: [R`<p>$v = \frac{dx}{dt} = ${3 * a}t^2 ${2 * b < 0 ? "-" : "+"} ${Math.abs(2 * b)}t ${c ? "+ " + c : ""}$ e $a = \frac{dv}{dt} = ${6 * a}t ${2 * b < 0 ? "-" : "+"} ${Math.abs(2 * b)}$ (regra da potência: $\frac{d}{dt}t^n = nt^{n-1}$).</p>`, R`<p>Em $t = ${t}$: $x = ${x}$ m, $v = ${v}$ m/s, $a = ${ac}$ m/s².</p>`, R`<p>${v === 0 ? "A partícula está parada nesse instante (v = 0): é um ponto de virada." : v * ac > 0 ? "v e a com o mesmo sinal: o movimento é acelerado." : "v e a com sinais opostos: o movimento é retardado (freando)."}</p>`] };
        } },
        { nome: "Integrar a velocidade", gerar: (p) => {
          const v0 = p ? 2 : F.escolha([0, 2, 4, 10]), a = p ? 3 : F.escolha([1, 2, 3, -2]), T = p ? 4 : F.escolha([2, 3, 4, 5]), d = v0 * T + (a * T * T) / 2;
          return { enun: R`<p>A velocidade de um carro é $v(t) = ${v0} ${a < 0 ? "-" : "+"} ${Math.abs(a)}t$ (SI). Quanto ele se desloca de $t = 0$ a $t = ${T}$ s?</p>`, fig: "",
            passos: [R`<p>Deslocamento é a área sob $v(t)$: $\Delta x = \int_0^{${T}}(${v0} ${a < 0 ? "-" : "+"} ${Math.abs(a)}t)\,dt$.</p>`, R`<p>Primitiva: $${v0}t ${a < 0 ? "-" : "+"} \frac{${Math.abs(a)}}{2}t^2$. Em ${T}: $${v0 * T} ${a < 0 ? "-" : "+"} ${F.n((Math.abs(a) * T * T) / 2)} = ${F.n(d)}$ m.</p>`, R`<p>É a fórmula do MUV, $\Delta x = v_0t + \frac12at^2$, ou a área do trapézio.${v0 + a * T < 0 ? " Atenção: a velocidade troca de sinal no meio; a área abaixo do eixo conta negativa, e a distância percorrida é maior que o deslocamento." : ""}</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "As equações do movimento, por integração",
      enun: R`<p>(a) Partindo de $a$ constante, integre duas vezes e chegue em $v = v_0 + at$ e $x = x_0 + v_0t + \frac12at^2$. (b) Usando a regra da cadeia, mostre que $a = v\frac{dv}{dx}$ e integre em $x$ para chegar em Torricelli, $v^2 = v_0^2 + 2a\Delta x$. (c) Um carro parte do repouso com aceleração que cresce com o tempo, $a = 0{,}5t$ (SI). Ache $v(t)$, $x(t)$ e os valores em $t = 4$ s. (d) Por que Torricelli <b>não</b> vale no item (c)?</p>`,
      fig: "",
      dicas: [R`<p>(a) $\int_0^t a\,dt' = v - v_0$. (b) $a = \frac{dv}{dt} = \frac{dv}{dx}\frac{dx}{dt}$.</p>`, R`<p>(c) $v = \int_0^t0{,}5t'\,dt'$.</p>`],
      sol: R`<p><b>(a)</b> $v(t) - v_0 = \int_0^ta\,dt' = at$. Depois $x - x_0 = \int_0^t(v_0 + at')dt' = v_0t + \frac12at^2$.</p>
        <p><b>(b)</b> $a = \frac{dv}{dx}\cdot v$. Então $a\,dx = v\,dv$; integrando, $a\Delta x = \frac{v^2 - v_0^2}2$.</p>
        <p><b>(c)</b> $v = 0{,}25t^2$ e $x = \frac{0{,}25}3t^3$. Em $t = 4$: $v = 4$ m/s, $x = \frac{16}3 \approx 5{,}33$ m.</p>
        <p><b>(d)</b> Torricelli usa $a$ constante ao integrar $a\,dx$. Aqui, $v^2 = 16$ mas $2\bar a\Delta x$ com a aceleração final $a = 2$ daria $2\cdot2\cdot5{,}33 \approx 21{,}3$: não bate. As fórmulas do MUV são casos particulares; derivar e integrar resolve qualquer caso.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Fundamentos · cálculo</div>
        <div class="q">O velocímetro mostra a velocidade "agora". Mas o que é velocidade num instante, se num instante você não anda nada?</div>
        <p>É o limite da velocidade média num intervalo cada vez menor: a <b>derivada</b>. E o caminho de volta, somar pedacinhos $v\,\Delta t$ para achar o quanto se andou, é a <b>integral</b>. Newton inventou o cálculo justamente para fazer mecânica. Aqui vai o essencial para usar na física; o cálculo com rigor está na aba Cálculo ${F.ret("matematica/CI03")}.</p></div>`),

      F.secao("derivada", "Derivada: taxa de variação", R`
        ${F.formula(R`v = \frac{dx}{dt} = \lim_{\Delta t\to0}\frac{x(t + \Delta t) - x(t)}{\Delta t},\qquad a = \frac{dv}{dt} = \frac{d^2x}{dt^2}`, "Velocidade e aceleração instantâneas")}
        <p>No gráfico $x \times t$, a derivada é a <b>inclinação da reta tangente</b>. Onde a tangente é horizontal, $v = 0$: o corpo para (e talvez volte). Regras que resolvem quase tudo:</p>
        <table class="tb"><tr><th>função</th><th>derivada</th></tr><tr><td>$t^n$</td><td>$nt^{n-1}$</td></tr><tr><td>$\sin\omega t$</td><td>$\omega\cos\omega t$</td></tr><tr><td>$\cos\omega t$</td><td>$-\omega\sin\omega t$</td></tr><tr><td>$e^{kt}$</td><td>$ke^{kt}$</td></tr><tr><td>$\ln t$</td><td>$1/t$</td></tr><tr><td>$f(g(t))$</td><td>$f'(g(t))\cdot g'(t)$ (regra da cadeia)</td></tr></table>
        <div id="lab-der"></div>
        ${F.caixa("fisico", R`<p><b>Derivadas na física não são só em relação ao tempo.</b> A força é menos a derivada da energia potencial, $F = -\frac{dU}{dx}$ (a bola rola morro abaixo); a corrente é $i = \frac{dq}{dt}$; a potência é $P = \frac{dW}{dt}$. E máximos e mínimos saem de "derivada igual a zero": altura máxima, alcance máximo, potência máxima.</p>`)}`),

      F.secao("integral", "Integral: soma de pedacinhos", R`
        ${F.formula(R`\Delta x = \int_{t_1}^{t_2}v(t)\,dt,\qquad W = \int_{x_1}^{x_2}F(x)\,dx,\qquad \Delta v = \int a\,dt`, "Integral como área")}
        <p>No gráfico $v \times t$, a área sob a curva é o deslocamento (área abaixo do eixo conta negativa). No gráfico $F \times x$, a área é o trabalho. O Teorema Fundamental do Cálculo ${F.ret("matematica/CI07")} diz que integrar desfaz derivar: para calcular a área, ache uma função cuja derivada é o integrando.</p>
        ${F.caixa("pegadinha", R`<p><b>Deslocamento × distância:</b> $\int v\,dt$ dá o deslocamento (com sinal). A distância percorrida é $\int|v|\,dt$: se a velocidade troca de sinal, é preciso separar os trechos.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Truque:</b> $a = v\frac{dv}{dx}$ (regra da cadeia). Quando a força depende da posição, $F(x) = mv\frac{dv}{dx}$ integra direto em $\frac12mv^2$: é o teorema trabalho-energia saindo de $F = ma$.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Para $x(t) = 5 + 3t - t^2$ (SI), ache $v(t)$, $a(t)$, o instante em que a partícula para e a posição nesse instante.</p>`, fig: "", dicas: [R`<p>Derive termo a termo.</p>`, R`<p>Pare: $v = 0$.</p>`], resp: R`$v = 3 - 2t$, $a = -2$ m/s²; para em $t = 1{,}5$ s, em $x = 7{,}25$ m.`, sol: R`<p>É um MUV ($x$ é do 2º grau). O ponto em que para é o vértice da parábola.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>A velocidade de um corpo é $v = 2t$ (SI). Quanto ele anda de $t = 0$ a $t = 3$ s?</p>`, fig: "", dicas: [R`<p>Área do triângulo, ou $\int_0^3 2t\,dt$.</p>`], resp: R`9 m.`, sol: R`<p>$[t^2]_0^3 = 9$. Base 3, altura 6, área 9.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Qual o trabalho para esticar uma mola de $k = 200$ N/m de 0 a 10 cm? Por que não é simplesmente $F\cdot d$?</p>`, fig: "", dicas: [R`<p>$F = kx$ varia: integre.</p>`], resp: R`$\frac12kx^2 = 1$ J.`, sol: R`<p>$\int_0^{0{,}1}200x\,dx = 100\cdot0{,}01$. A força vai de 0 a 20 N: usar a força final daria 2 J, o dobro. A área do triângulo resolve.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Uma força variável $F = 6x^2$ (SI) empurra um corpo de $x = 0$ a $x = 2$ m. Qual o trabalho?</p>`, fig: "", dicas: [R`<p>$\int 6x^2\,dx = 2x^3$.</p>`], resp: R`16 J.`, sol: R`<p>$2\cdot8 - 0$.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma bola é lançada para cima a 20 m/s ($g = 10$ m/s²): $y = 20t - 5t^2$. Use a derivada para achar a altura máxima.</p>`, fig: "", dicas: [R`<p>Na altura máxima, $\dot y = 0$.</p>`], resp: R`20 m, em $t = 2$ s.`, sol: R`<p>$\dot y = 20 - 10t = 0$. Confira com Torricelli: $h = v_0^2/2g = 400/20$.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Para $x(t) = t^3 - 6t^2 + 9t$ (SI), de $t = 0$ a $t = 3$ s, calcule o deslocamento e a distância percorrida. (Confira no laboratório, função "cúbica".)</p>`, fig: "", dicas: [R`<p>$v = 3(t - 1)(t - 3)$: em que instante ela troca de sinal?</p>`, R`<p>Distância: some os trechos em módulo.</p>`], resp: R`Deslocamento 0; distância 8 m.`, sol: R`<p>$x(0) = 0$, $x(1) = 4$, $x(3) = 0$: vai 4 m e volta 4 m. A área sob $v$ de 0 a 3 dá zero (positiva e negativa se cancelam).</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Uma partícula tem energia potencial $U(x) = x^3 - 3x$ (SI). Ache a força, os pontos de equilíbrio e diga qual é estável.</p>`, fig: "", dicas: [R`<p>$F = -dU/dx$.</p>`, R`<p>Estável: mínimo de $U$ ($U'' > 0$).</p>`], resp: R`$F = 3 - 3x^2$; equilíbrios em $x = \pm1$; estável em $x = 1$.`, sol: R`<p>$U'' = 6x$: positivo em $x = 1$ (mínimo, estável), negativo em $x = -1$ (máximo, instável). Perto de $x = 1$, $U \approx U(1) + \frac12\cdot6(x - 1)^2$: um oscilador com "$k$" $= 6$ ${F.ret("F05")}.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-der"); e.outerHTML = F.lab("Derivada como inclinação, integral como área", "lab-der"); SIM.derivada(document.getElementById("lab-der"), F); },
});
