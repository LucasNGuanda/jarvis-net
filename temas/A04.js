/* A04 · Análise Gráfica. Conferido em Python:
   v de 0 a 10 m/s em 4 s e depois constante até 10 s: 80 m, a = 2,5 m/s², v̄ = 8 m/s; s = t²: v(3) = 6 m/s, v̄ de 1 a 3 s = 4 m/s;
   a = 3 m/s² por 4 s com v₀ = 2: 14 m/s; v = 8 (0–3 s) e −4 (3–6 s): deslocamento 12 m, distância 36 m;
   meia elipse de semieixos 5 s e 5 m/s: 39,3 m; trapézio 0→12 (3 s), 12 até 7 s, 12→0 até 10 s: 84 m;
   v = 6 − 2t volta à origem em 6 s; a de 6 a 0 em 4 s, do repouso: 12 m/s;
   chefão: A a 10 m/s; B parte 2 s depois com 2 m/s² até 20 m/s: distância máxima 45 m em t = 7 s; alcança em t = 14 s (140 m);
   com teto de 15 m/s: t = 17,25 s (172,5 m); com teto de 10 m/s: nunca. */
F.registrar("A04", {
  retoma: ["A02", "A03", "F04"],
  html(F) {
    const R = String.raw;
    const graf = (o, h = 210) => D.svg(560, h, D.graf({ x0: 60, y0: h - 30, w: 420, h: h - 70, ...o }), "gráfico");
    const exemplos = F.exemplo({
      titulo: "Lendo gráficos",
      casos: [
        { nome: "Fácil: área e velocidade média", gerar: (p) => {
          const vm = p ? 10 : F.escolha([8, 10, 12]), t1 = p ? 4 : F.escolha([2, 4, 5]), T = p ? 10 : F.escolha([8, 10, 12]), area = 0.5 * t1 * vm + vm * (T - t1);
          return { enun: R`<p>Um carro parte do repouso, chega a ${vm} m/s em ${t1} s (aceleração constante) e segue com essa velocidade até $t = ${T}$ s. Pelo gráfico $v \times t$, quanto ele andou e qual a velocidade média?</p>`,
            fig: graf({ xmax: T + 1, ymax: vm * 1.3, xlab: "t (s)", ylab: "v (m/s)", xt: [0, t1, T], yt: [vm], curvas: [{ pts: [[0, 0], [t1, vm], [T, vm]], cor: "var(--mA)", area: true }] }),
            passos: [R`<p>(i) Deslocamento = área sob o gráfico: um triângulo (0 a ${t1} s) mais um retângulo (${t1} a ${T} s).</p>`, R`<p>(ii) $\Delta s = \frac12\cdot${t1}\cdot${vm} + ${vm}\cdot${T - t1} = ${F.n(0.5 * t1 * vm)} + ${vm * (T - t1)} = ${F.n(area)}$ m.</p>`, R`<p>(iii) $v_m = \frac{${F.n(area)}}{${T}} = ${F.n(area / T, 3)}$ m/s. A aceleração no começo é a inclinação: $\frac{${vm}}{${t1}} = ${F.n(vm / t1, 3)}$ m/s².</p>`] };
        } },
        { nome: "Médio: de a × t para v × t", gerar: (p) => {
          const v0 = p ? 2 : F.escolha([0, 2, 5]), a1 = p ? 3 : F.escolha([2, 3, 4]), t1 = p ? 4 : F.escolha([3, 4]), a2 = p ? -2 : F.escolha([-1, -2, -3]), t2 = p ? 3 : F.escolha([2, 3]);
          const v1 = v0 + a1 * t1, v2 = v1 + a2 * t2;
          return { enun: R`<p>Um corpo tem $v_0 = ${v0}$ m/s. O gráfico mostra a aceleração: ${a1} m/s² por ${t1} s e depois ${a2} m/s² por ${t2} s. Qual a velocidade no fim? Esboce $v \times t$.</p>`,
            fig: graf({ xmax: t1 + t2 + 1, ymin: Math.min(a2, 0) - 1, ymax: a1 + 1, xlab: "t (s)", ylab: "a (m/s²)", xt: [0, t1, t1 + t2], yt: [a1, a2], curvas: [{ pts: [[0, a1], [t1, a1]], cor: "var(--mO)", area: true }, { pts: [[t1, a2], [t1 + t2, a2]], cor: "var(--mT)", area: true }] }),
            passos: [R`<p>(i) Área sob $a \times t$ é a variação da velocidade ${F.ret("F04")}: primeiro trecho, $\Delta v = ${a1}\cdot${t1} = ${a1 * t1}$ m/s, então $v_1 = ${v1}$ m/s.</p>`, R`<p>(ii) Segundo trecho (área negativa): $\Delta v = ${a2}\cdot${t2} = ${a2 * t2}$ m/s, então $v_2 = ${v2}$ m/s.</p>`, R`<p>(iii) O gráfico $v \times t$ são duas retas: sobe de ${v0} a ${v1} (inclinação ${a1}) e ${v2 < v1 ? "desce" : "sobe"} até ${v2} (inclinação ${a2}).${v2 < 0 ? " A velocidade troca de sinal no meio: o corpo para e começa a voltar." : ""}</p>`] };
        } },
        { nome: "Olimpíada: o gráfico que parece um círculo", gerar: (p) => {
          const T = p ? 10 : F.escolha([8, 10, 12]), V = p ? 5 : F.escolha([4, 5, 6]), area = (Math.PI * (T / 2) * V) / 2;
          return { enun: R`<p>O gráfico $v \times t$ de um corpo é a metade de cima de uma curva que, no papel, parece um semicírculo: começa em $v = 0$ em $t = 0$, chega a ${V} m/s em $t = ${T / 2}$ s e volta a zero em $t = ${T}$ s. Quanto o corpo andou?</p>`,
            fig: graf({ xmax: T + 1, ymax: V * 1.3, xlab: "t (s)", ylab: "v (m/s)", xt: [0, T / 2, T], yt: [V], curvas: [{ pts: D.amostra((t) => V * Math.sqrt(Math.max(0, 1 - ((t - T / 2) / (T / 2)) ** 2)), 0, T, 80), cor: "var(--mA)", area: true }] }),
            passos: [R`<p>(i) A pegadinha: os eixos têm unidades diferentes, então a curva <b>não</b> é um círculo, é uma <b>elipse</b>, com semieixos ${F.n(T / 2)} s (horizontal) e ${V} m/s (vertical). "Raio" não faz sentido aqui.</p>`, R`<p>(ii) A área de uma elipse de semieixos $p$ e $q$ é $\pi pq$; metade dela: $\frac{\pi pq}2$.</p>`, R`<p>(iii) $\Delta s = \frac{\pi\cdot${F.n(T / 2)}\cdot${V}}{2} \approx ${F.n(area, 3)}$ m. Quem usa "$\frac{\pi r^2}2$" com $r = ${V}$ ou $r = ${F.n(T / 2)}$ acerta só por coincidência quando os números são iguais, e mesmo assim com a unidade errada.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A perseguição pelo gráfico",
      enun: R`<p>O carro A passa por um ponto P em $t = 0$, com velocidade constante de 10 m/s. O carro B estava parado em P e parte em $t = 2$ s, com aceleração de 2 m/s², até atingir 20 m/s; depois segue com essa velocidade. Resolva <b>só com o gráfico</b> $v \times t$ (áreas e inclinações):</p>
        <p>(a) Em que instante a distância entre os carros é máxima, e quanto ela vale? (b) Em que instante e posição B alcança A? (c) Esboce o gráfico da distância entre eles contra o tempo, indicando máximos e zeros. (d) Se B só pudesse chegar a 15 m/s, ele alcançaria A? Quando? (e) E se o máximo de B fosse 10 m/s?</p>`,
      fig: graf({ xmax: 16, ymax: 24, xlab: "t (s)", ylab: "v (m/s)", xt: [0, 2, 7, 12, 14], yt: [10, 20], curvas: [{ pts: [[0, 10], [16, 10]], cor: "var(--mT)" }, { pts: [[0, 0], [2, 0], [12, 20], [16, 20]], cor: "var(--mA)" }] }, 230),
      dicas: [R`<p>(a) A distância cresce enquanto A for mais rápido. Ela é a área entre as duas curvas.</p>`, R`<p>(b) B alcança quando a área sob a curva de B iguala a de A.</p>`],
      sol: R`<p><b>(a)</b> A distância cresce enquanto $v_A > v_B$ e para de crescer quando as velocidades se igualam: B chega a 10 m/s depois de 5 s acelerando, em $t = 7$ s. Nesse instante, A andou $10\cdot7 = 70$ m e B andou a área do triângulo $\frac12\cdot5\cdot10 = 25$ m: distância máxima de <b>45 m</b>.</p>
        <p><b>(b)</b> B chega a 20 m/s em $t = 12$ s, depois de andar $\frac12\cdot10\cdot20 = 100$ m; A está em 120 m. Daí em diante B tira 10 m por segundo: alcança 2 s depois, em $t = 14$ s, na posição <b>140 m</b>. (Pela igualdade de áreas: $10t = 100 + 20(t - 12)$.)</p>
        <p><b>(c)</b> A distância $d(t) = s_A - s_B$ é: reta $10t$ até $t = 2$ s (20 m); depois uma parábola com concavidade para baixo até o máximo de 45 m em $t = 7$ s; depois cai, primeiro como parábola até $t = 12$ s (20 m) e então como reta, a 10 m/s, até zero em $t = 14$ s. Depois fica negativa (B na frente).</p>
        <p><b>(d)</b> Com teto de 15 m/s: B acelera 7,5 s (até $t = 9{,}5$ s) andando $\frac12\cdot7{,}5\cdot15 = 56{,}25$ m. Depois: $56{,}25 + 15(t - 9{,}5) = 10t \Rightarrow t = 17{,}25$ s, em 172,5 m.</p>
        <p><b>(e)</b> Com teto de 10 m/s, depois de acelerar B fica com a mesma velocidade de A e a distância para de mudar (45 m, para sempre): <b>nunca</b> alcança. Conferido numericamente.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Pelo gráfico, quanto o carro andou de 0 a 10 s?</p>`, fig: graf({ xmax: 11, ymax: 13, xlab: "t (s)", ylab: "v (m/s)", xt: [0, 4, 10], yt: [10], curvas: [{ pts: [[0, 0], [4, 10], [10, 10]], cor: "var(--mA)", area: true }] }), num: { v: 80, un: "m" }, dicas: [R`<p>Triângulo + retângulo.</p>`], resp: "80 m", sol: R`<p>$\frac12\cdot4\cdot10 + 10\cdot6 = 20 + 60 = 80$ m.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>No mesmo gráfico, qual a aceleração nos primeiros 4 s?</p>`, num: { v: 2.5, un: "m/s²" }, dicas: [R`<p>Inclinação da reta no gráfico $v \times t$.</p>`], resp: "2,5 m/s²", sol: R`<p>$\frac{10 - 0}{4} = 2{,}5$ m/s².</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>O gráfico mostra $s = t^2$ (SI). Qual a velocidade instantânea em $t = 3$ s (a inclinação da reta tangente)?</p>`, fig: graf({ xmax: 5, ymax: 25, xlab: "t (s)", ylab: "s (m)", xt: [0, 1, 2, 3, 4], yt: [9], curvas: [{ pts: D.amostra((t) => t * t, 0, 5, 50), cor: "var(--mA)" }, { pts: [[1.5, 0], [4.5, 18]], cor: "var(--warn)", trac: true }], pontos: [[3, 9]] }), num: { v: 6, un: "m/s" }, dicas: [R`<p>$v = \frac{ds}{dt}$ ${F.ret("F04")}.</p>`], resp: "6 m/s", sol: R`<p>$v = 2t = 6$ m/s. A tangente tracejada passa por $(1{,}5;\ 0)$ e $(3;\ 9)$: inclinação $\frac{9}{1{,}5} = 6$.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Um corpo tem $v_0 = 2$ m/s e aceleração constante de 3 m/s² por 4 s (gráfico $a \times t$). Qual a velocidade final?</p>`, fig: graf({ xmax: 5, ymax: 4, xlab: "t (s)", ylab: "a (m/s²)", xt: [0, 4], yt: [3], curvas: [{ pts: [[0, 3], [4, 3]], cor: "var(--mO)", area: true }] }), num: { v: 14, un: "m/s" }, dicas: [R`<p>Área sob $a \times t$ é $\Delta v$.</p>`], resp: "14 m/s", sol: R`<p>$\Delta v = 12$, $v = 2 + 12 = 14$ m/s.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>A velocidade de um corpo é 8 m/s de 0 a 3 s e −4 m/s de 3 a 6 s. Qual o deslocamento total?</p>`, fig: graf({ xmax: 7, ymin: -6, ymax: 10, xlab: "t (s)", ylab: "v (m/s)", xt: [0, 3, 6], yt: [8, -4], curvas: [{ pts: [[0, 8], [3, 8]], cor: "var(--mA)", area: true }, { pts: [[3, -4], [6, -4]], cor: "var(--mT)", area: true }] }), num: { v: 12, un: "m" }, dicas: [R`<p>Área abaixo do eixo conta negativa.</p>`], resp: "12 m", sol: R`<p>$24 - 12 = 12$ m. A distância percorrida seria $24 + 12 = 36$ m.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>No exercício 1, qual a velocidade média de 0 a 10 s?</p>`, num: { v: 8, un: "m/s" }, dicas: [R`<p>Área total sobre o intervalo de tempo.</p>`], resp: "8 m/s", sol: R`<p>$\frac{80}{10} = 8$ m/s: é a altura de um retângulo com a mesma área.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>No gráfico $s = t^2$ do exercício 3, qual a velocidade média entre 1 s e 3 s (inclinação da reta secante)?</p>`, num: { v: 4, un: "m/s" }, dicas: [R`<p>$\frac{s(3) - s(1)}{3 - 1}$.</p>`], resp: "4 m/s", sol: R`<p>$\frac{9 - 1}{2} = 4$ m/s, igual à velocidade em $t = 2$ s (o meio do intervalo): no MUV a velocidade média é a do instante do meio ${F.ret("A03")}.</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>Um metrô acelera uniformemente de 0 a 12 m/s em 3 s, anda com 12 m/s até $t = 7$ s e freia uniformemente até parar em $t = 10$ s. Qual a distância entre as estações?</p>`, fig: graf({ xmax: 11, ymax: 15, xlab: "t (s)", ylab: "v (m/s)", xt: [0, 3, 7, 10], yt: [12], curvas: [{ pts: [[0, 0], [3, 12], [7, 12], [10, 0]], cor: "var(--mA)", area: true }] }), num: { v: 84, un: "m" }, dicas: [R`<p>É um trapézio.</p>`], resp: "84 m", sol: R`<p>Trapézio de bases 10 s e 4 s, altura 12: $\frac{(10 + 4)}{2}\cdot12 = 84$ m.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>O gráfico $v \times t$ é metade de uma "curva redonda": vai de 0 em $t = 0$ a 5 m/s em $t = 5$ s e volta a 0 em $t = 10$ s. Quanto o corpo andou?</p>`, fig: graf({ xmax: 11, ymax: 7, xlab: "t (s)", ylab: "v (m/s)", xt: [0, 5, 10], yt: [5], curvas: [{ pts: D.amostra((t) => 5 * Math.sqrt(Math.max(0, 1 - ((t - 5) / 5) ** 2)), 0, 10, 80), cor: "var(--mA)", area: true }] }), num: { v: 25 * Math.PI / 2, tol: 0.01, un: "m" }, dicas: [R`<p>É meia elipse de semieixos 5 s e 5 m/s.</p>`], resp: "≈ 39,3 m", sol: R`<p>$\frac{\pi\cdot5\cdot5}2 \approx 39{,}3$ m.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>A velocidade de um corpo é $v = 6 - 2t$ (SI), partindo da origem. Em que instante ele volta à origem?</p>`, fig: graf({ xmax: 7, ymin: -7, ymax: 7, xlab: "t (s)", ylab: "v (m/s)", xt: [0, 3, 6], yt: [6, -6], curvas: [{ pts: [[0, 6], [3, 0]], cor: "var(--mA)", area: true }, { pts: [[3, 0], [6, -6]], cor: "var(--mT)", area: true }] }), num: { v: 6, un: "s" }, dicas: [R`<p>Volta à origem quando a área total (com sinal) for zero.</p>`, R`<p>Os dois triângulos são iguais.</p>`], resp: "6 s", sol: R`<p>$\Delta s = 6t - t^2 = 0 \Rightarrow t = 6$ s. Pelo gráfico: o triângulo positivo (0 a 3 s, área 9) é cancelado pelo negativo (3 a 6 s).</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>O gráfico $s \times t$ de um corpo é uma parábola com concavidade para baixo e vértice em $t = 4$ s. Qual afirmação é verdadeira?</p>`, fig: graf({ xmax: 9, ymax: 18, xlab: "t (s)", ylab: "s (m)", xt: [0, 4, 8], yt: [16], curvas: [{ pts: D.amostra((t) => 8 * t - t * t, 0, 8, 60), cor: "var(--mA)" }] }),
        alts: ["A velocidade é sempre positiva e a aceleração é negativa.", "A velocidade é positiva antes de 4 s, zero em 4 s e negativa depois; a aceleração é negativa o tempo todo.", "A aceleração é zero em $t = 4$ s.", "A velocidade é máxima em $t = 4$ s.", "A aceleração muda de sinal em $t = 4$ s."], certa: "B",
        dicas: [R`<p>Inclinação da tangente = velocidade; concavidade = sinal da aceleração.</p>`], resp: "B", sol: R`<p>Tangente subindo antes do vértice, horizontal nele, descendo depois. Concavidade para baixo $\Rightarrow a < 0$ constante (é um MUV). <b>C</b> é a confusão clássica entre $v = 0$ e $a = 0$.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Um corpo parte do repouso e sua aceleração cai linearmente de 6 m/s² a zero em 4 s. Qual a velocidade em $t = 4$ s?</p>`, fig: graf({ xmax: 5, ymax: 7, xlab: "t (s)", ylab: "a (m/s²)", xt: [0, 4], yt: [6], curvas: [{ pts: [[0, 6], [4, 0]], cor: "var(--mO)", area: true }] }), num: { v: 12, un: "m/s" }, dicas: [R`<p>Área do triângulo sob $a \times t$.</p>`], resp: "12 m/s", sol: R`<p>$\frac12\cdot4\cdot6 = 12$ m/s. Depois de 4 s, ele segue em MRU a 12 m/s.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · gráficos</div>
        <div class="q">É possível saber quanto um carro andou olhando só o gráfico do velocímetro?</div>
        <p>É: é a área sob a curva. E a inclinação dessa mesma curva dá a aceleração. Ler gráficos é a habilidade mais cobrada em cinemática (em prova e no laboratório), e ela vale para qualquer movimento, não só para o MRU e o MUV.</p></div>`),

      F.secao("inclinacao", "Inclinação: velocidade e aceleração", R`
        <h3>Teorema 1: secante e tangente no gráfico $s \times t$</h3>
        ${F.demo("demonstração", R`<p>(i) Entre dois instantes, a reta secante ao gráfico $s \times t$ tem inclinação $\frac{s(t_2) - s(t_1)}{t_2 - t_1} = v_m$: a <b>secante</b> dá a velocidade média.</p>
          <p>(ii) Aproximando $t_2$ de $t_1$, a secante vira a reta <b>tangente</b>, e o limite da inclinação é a velocidade instantânea ${F.ret("F04")}. $\blacksquare$</p>`)}
        ${F.formula(R`v_m = \text{inclinação da secante de } s\times t,\qquad v = \frac{ds}{dt} = \text{inclinação da tangente},\qquad a = \frac{dv}{dt} = \text{inclinação da tangente de } v\times t`, "Inclinações")}
        <p>O mesmo raciocínio no gráfico $v \times t$: a inclinação da tangente é a aceleração instantânea.</p>
        <h3>Teorema 2: concavidade e sinal da aceleração</h3>
        ${F.demo("demonstração", R`<p>(i) A inclinação do gráfico $s \times t$ é $v$. Se $a > 0$, $v$ cresce: a inclinação aumenta da esquerda para a direita, e a curva fica com a <b>concavidade para cima</b>.</p>
          <p>(ii) Se $a < 0$, a inclinação diminui: concavidade para baixo. Se $a = 0$, reta (MRU). $\blacksquare$</p>`)}
        ${F.caixa("pegadinha", R`<p><b>$v = 0$ não é $a = 0$.</b> No vértice da parábola de $s \times t$ (ponto mais alto de um lançamento vertical, por exemplo), a tangente é horizontal: $v = 0$. Mas a concavidade continua a mesma: $a$ continua lá. E o gráfico $s \times t$ <b>não</b> é a trajetória do corpo: um corpo em linha reta pode ter um $s \times t$ todo curvo.</p>`)}
        <div id="lab-graf"></div>`),

      F.secao("area", "Área: deslocamento e variação de velocidade", R`
        <h3>Teorema 3: área sob $v \times t$ é o deslocamento (para qualquer movimento)</h3>
        ${F.demo("demonstração", R`<p>(i) Divida o intervalo de $t_1$ a $t_2$ em $n$ pedaços pequenos de duração $\Delta t$.</p>
          <p>(ii) Em cada pedaço, a velocidade quase não muda: o corpo anda aproximadamente $v_k\,\Delta t$, que é a área de um retângulo fininho sob o gráfico.</p>
          <p>(iii) Somando: $\Delta s \approx \sum_k v_k\,\Delta t$, uma soma de Riemann ${F.ret("matematica/CI06")}. Com $n \to \infty$, a soma vira a área exata sob a curva: $\Delta s = \int_{t_1}^{t_2}v\,dt$. Onde $v < 0$, os retângulos ficam abaixo do eixo e contam negativos. $\blacksquare$</p>`)}
        ${F.formula(R`\Delta s = \text{área sob } v\times t,\qquad \Delta v = \text{área sob } a\times t,\qquad d = \text{área sob } |v|\times t`, "As três áreas")}
        <h3>Teorema 4: zero da velocidade ⇔ extremo da posição</h3>
        ${F.demo("demonstração", R`<p>(i) Enquanto $v > 0$, a área acumulada cresce: $s$ aumenta. Quando $v < 0$, ela diminui.</p>
          <p>(ii) No instante em que $v$ troca de sinal, $s$ para de crescer e começa a cair (ou o contrário): é um máximo (ou mínimo) de $s$, e é onde o corpo inverte o sentido. $\blacksquare$</p>`)}
        <table class="tb"><tr><th>gráfico</th><th>inclinação</th><th>área</th></tr><tr><td>$s \times t$</td><td>velocidade</td><td>(sem significado útil)</td></tr><tr><td>$v \times t$</td><td>aceleração</td><td>deslocamento</td></tr><tr><td>$a \times t$</td><td>(arrancada, "jerk")</td><td>variação da velocidade</td></tr></table>
        ${F.caixa("fisico", R`<p><b>Unidades nas áreas</b>: a "área" de um gráfico $v \times t$ tem unidade de (m/s)·s = m. Não pense em centímetros quadrados do papel: leia sempre os valores nos eixos. É por isso que uma curva que parece um semicírculo no papel é uma elipse em unidades físicas (exemplo de olimpíada).</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Perseguições pelo gráfico</b>: a distância entre dois corpos que saem do mesmo ponto é a área entre as curvas $v \times t$ deles. Ela é máxima quando as velocidades se igualam (as curvas se cruzam) e zera quando as áreas ficam iguais. Isso resolve em segundos problemas que dariam um sistema de equações (veja o chefão).</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, isso é o Teorema Fundamental do Cálculo ${F.ret("matematica/CI07")}: derivar (inclinação) e integrar (área) são operações inversas. No laboratório, a análise gráfica vira ajuste de curvas: linearizar dados para achar parâmetros (módulo Experimental, ${F.ret("FE07")}).</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-graf"); e.outerHTML = F.lab("Do gráfico v × t para s × t e a × t", "lab-graf"); SIM.graficos(document.getElementById("lab-graf"), F); },
});
