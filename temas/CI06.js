/* CI06 · Integral definida e somas de Riemann. Conferido em Python (scratchpad ci2.py):
   Σ(k/n)²(1/n) = (2n² + 3n + 1)/(6n²) → 1/3; esquerda n = 4 de x² em [0, 2] = 1,75; trapézio n = 2 de eˣ em [0, 1] = 1,7539;
   média de sen em [0, π] = 2/π; Σ n/(n² + k²) → π/4. */
F.registrar("CI06", {
  retoma: ["CI01"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Somas de Riemann à mão",
      casos: [
        { nome: "Soma da esquerda", gerar: (p) => {
          const b = p ? 2 : F.escolha([1, 2, 3]), n = p ? 4 : F.escolha([2, 4, 5]), h = b / n;
          const xs = Array.from({ length: n }, (_, i) => i * h), ys = xs.map((x) => x * x), S = ys.reduce((a, c) => a + c, 0) * h, ex = b ** 3 / 3;
          return { enun: R`<p>Estime $\int_0^{${b}}x^2\,dx$ com ${n} retângulos pela esquerda.</p>`, fig: "",
            passos: [
              R`<p>Largura de cada fatia: $\Delta x = \frac{${b} - 0}{${n}} = ${F.n(h, 3)}$. Pontos da esquerda: $${xs.map((x) => F.n(x, 3)).join(",\\ ")}$.</p>`,
              R`<p>Alturas $f(x_i) = x_i^2$: $${ys.map((y) => F.n(y, 4)).join(",\\ ")}$. Soma das alturas: $${F.n(ys.reduce((a, c) => a + c, 0), 4)}$.</p>`,
              R`<p>Área estimada: $${F.n(ys.reduce((a, c) => a + c, 0), 4)}\times${F.n(h, 3)} = ${F.n(S, 4)}$.</p>`,
              R`<p>O valor exato é $\frac{${b}^3}{3} = ${F.n(ex, 4)}$ (próximo tema mostra o atalho). A soma da esquerda <b>subestima</b>, porque $x^2$ é crescente: cada retângulo fica abaixo da curva. Erro: $${F.n(ex - S, 4)}$.</p>`,
            ] };
        } },
        { nome: "Distância por v(t)", gerar: (p) => {
          const a = p ? 2 : F.escolha([1, 2, 3]), T1 = p ? 3 : F.escolha([2, 3, 4]), T2 = p ? 5 : T1 + F.escolha([1, 2, 3]);
          const d1 = (a * T1 * T1) / 2, d2 = a * T1 * (T2 - T1);
          return { enun: R`<p>Um carro parte do repouso com aceleração $${a}$ m/s² até $t = ${T1}$ s e depois segue com velocidade constante até $t = ${T2}$ s. Que distância ele percorre?</p>`, fig: "",
            passos: [
              R`<p>Distância é a área sob o gráfico $v \times t$: $d = \int_0^{${T2}}v(t)\,dt$. Aqui $v(t) = ${F.c(a)}t$ até ${T1} s, e depois $v = ${a * T1}$ m/s.</p>`,
              R`<p>1º trecho: triângulo de base ${T1} e altura ${a * T1}: $\frac{${T1}\cdot${a * T1}}{2} = ${d1}$ m.</p>`,
              R`<p>2º trecho: retângulo ${T2 - T1} × ${a * T1}: $${d2}$ m.</p>`,
              R`<p>Total: $${d1 + d2}$ m. Toda vez que você calculou distância pela "área do gráfico" no MUV, já estava fazendo uma integral.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Esconde-esconde de integrais",
      enun: R`<p>Calcule os limites, reconhecendo cada um como uma soma de Riemann:</p>
        $$\text{(a)}\ \lim_{n\to\infty}\sum_{k=1}^{n}\frac{n}{n^2 + k^2}\qquad\text{(b)}\ \lim_{n\to\infty}\frac1n\sum_{k=1}^{n}\operatorname{sen}\frac{k\pi}{n}\qquad\text{(c)}\ \lim_{n\to\infty}\frac{1^4 + 2^4 + \dots + n^4}{n^5}$$
        <p>Pode usar as primitivas que já viu: $(\arctan x)' = \frac1{1+x^2}$, $(-\cos x)' = \operatorname{sen}x$, $(x^5/5)' = x^4$ (o Teorema Fundamental vem no próximo tema).</p>`,
      fig: "",
      dicas: [R`<p>Procure a forma $\frac1n\sum f\left(\frac kn\right)$, que tende a $\int_0^1f(x)\,dx$.</p>`, R`<p>(a) Divida em cima e embaixo por $n^2$: $\frac1n\cdot\frac{1}{1 + (k/n)^2}$.</p>`],
      sol: R`<p><b>(a)</b> $\frac{n}{n^2 + k^2} = \frac1n\cdot\frac{1}{1 + (k/n)^2}$, soma da direita de $\frac{1}{1 + x^2}$ em $[0, 1]$. Limite: $\arctan1 - \arctan0 = \frac\pi4$.</p>
        <p><b>(b)</b> Com $x = k/n$: $\frac1n\sum\operatorname{sen}(\pi x_k) \to \int_0^1\operatorname{sen}(\pi x)\,dx = \left[-\frac{\cos\pi x}{\pi}\right]_0^1 = \frac2\pi$.</p>
        <p><b>(c)</b> $\frac1n\sum\left(\frac kn\right)^4 \to \int_0^1x^4\,dx = \frac15$.</p>
        <p class="det" style="color:var(--ink2)">Conferi com $n = 1000$: (a) dá 0,78515 (o limite é 0,785398) e (b) 0,636619. Truque de olimpíada: limite de soma com $k$ e $n$ juntos quase sempre é uma integral disfarçada.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 1 · 6</div>
        <div class="q">Um carro anda com velocidade que muda o tempo todo. Quanto ele andou?</div>
        <p>Com velocidade constante, $d = v\,t$: a área de um retângulo no gráfico $v \times t$. Com velocidade variável, quebre o tempo em pedacinhos em que $v$ é quase constante, some os retângulos e faça os pedacinhos encolherem. O resultado é a <b>integral</b>: a área embaixo da curva.</p></div>`),

      F.secao("riemann", "Somas de Riemann", R`
        <p>Divida $[a, b]$ em $n$ fatias de largura $\Delta x = \frac{b - a}{n}$. Em cada fatia, escolha um ponto $x_i^*$ (esquerda, direita, meio…) e faça um retângulo de altura $f(x_i^*)$:</p>
        ${F.formula(R`S_n = \sum_{i=1}^{n}f(x_i^*)\,\Delta x\qquad\qquad \int_a^bf(x)\,dx = \lim_{n\to\infty}S_n`, "Soma de Riemann e integral definida")}
        <p>Se o limite existe e não depende da escolha dos pontos, $f$ é <b>integrável</b>. Toda função contínua é (e até funções com alguns saltos). O símbolo $\int$ é um "S" esticado, de <i>summa</i> (Leibniz), e o $dx$ lembra o $\Delta x$ que encolheu.</p>
        <div id="lab-rie"></div>`),

      F.secao("primeira", "A primeira integral, só com somas", R`
        ${F.demo("∫₀¹ x² dx = 1/3", R`<p>(i) Retângulos pela direita: $\Delta x = \frac1n$ e $x_k = \frac kn$. Então $S_n = \sum_{k=1}^n\left(\frac kn\right)^2\frac1n = \frac{1}{n^3}\sum_{k=1}^nk^2$.</p>
          <p>(ii) Soma dos quadrados: $\sum_{k=1}^nk^2 = \frac{n(n+1)(2n+1)}{6}$. (Prova: some $(k+1)^3 - k^3 = 3k^2 + 3k + 1$ de $k = 1$ até $n$; à esquerda tudo cancela e sobra $(n+1)^3 - 1$, e daí isola $\sum k^2$.)</p>
          <p>(iii) $S_n = \frac{n(n+1)(2n+1)}{6n^3} = \frac{2n^2 + 3n + 1}{6n^2} = \frac13 + \frac{1}{2n} + \frac{1}{6n^2}$.</p>
          <p>(iv) $n \to \infty$: $S_n \to \frac13$ ∎. Arquimedes chegou a esse $\frac13$ (área do segmento de parábola) por volta de 250 a.C., com um argumento de exaustão parecido.</p>`)}
        <p>Repare no $\frac{1}{2n}$: o erro da soma da direita cai como $\frac1n$. Dobrar o $n$ só corta o erro pela metade. No laboratório, compare com o ponto médio e o trapézio ($\frac{1}{n^2}$) e com Simpson ($\frac{1}{n^4}$): é por isso que computadores usam regras melhores que "retângulo pela esquerda".</p>`),

      F.secao("propriedades", "Propriedades e significado", R`
        <ul><li><b>Linearidade:</b> $\int(af + bg) = a\int f + b\int g$.</li>
          <li><b>Emendar intervalos:</b> $\int_a^bf + \int_b^cf = \int_a^cf$.</li>
          <li><b>Orientação:</b> $\int_b^af = -\int_a^bf$ e $\int_a^af = 0$.</li>
          <li><b>Área com sinal:</b> onde $f < 0$, a integral conta negativo. $\int_0^{2\pi}\operatorname{sen}x\,dx = 0$, mesmo com área total (sem sinal) 4.</li>
          <li><b>Comparação:</b> se $f \leq g$, então $\int f \leq \int g$.</li>
          <li><b>Valor médio:</b> $\bar f = \frac{1}{b - a}\int_a^bf\,dx$, a altura do retângulo com a mesma área. A média de $\operatorname{sen}$ em $[0, \pi]$ é $\frac2\pi \approx 0{,}637$.</li></ul>
        <table class="tb"><tr><th>integral</th><th>na física</th></tr>
          <tr><td>$\Delta x = \int v\,dt$</td><td>deslocamento (área do gráfico v × t)</td></tr>
          <tr><td>$\Delta v = \int a\,dt$</td><td>variação de velocidade</td></tr>
          <tr><td>$Q = \int i\,dt$</td><td>carga que passou ${F.ret("C06")}</td></tr>
          <tr><td>$W = \int F\,dx$</td><td>trabalho de força variável</td></tr>
          <tr><td>$I = \int F\,dt$</td><td>impulso</td></tr></table>
        ${F.caixa("fisico", R`<p><b>Valor eficaz da tomada:</b> os 127 V são a raiz da <i>média</i> de $V^2$ num período: $V_\text{ef} = \sqrt{\overline{V^2}} = \frac{V_\text{pico}}{\sqrt2}$, porque a média de $\operatorname{sen}^2$ num período é $\frac12$ ${F.ret("C15c")}.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $1 + 2 + \dots + 100$. Depois use $\sum_{k=1}^nk = \frac{n(n+1)}2$ para mostrar, por somas da direita, que $\int_0^1x\,dx = \frac12$.</p>`, fig: "", dicas: [R`<p>É o Я(100) do gam fresco ${F.ret("X01")}.</p>`, R`<p>$S_n = \frac1{n^2}\sum k$.</p>`], resp: R`$5050$; $S_n = \frac{n+1}{2n} \to \frac12$.`, sol: R`<p>$S_n = \frac{n(n+1)}{2n^2} = \frac12 + \frac{1}{2n}$. Confere com a área do triângulo de base 1 e altura 1.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Estime $\int_0^2x^2\,dx$ com 4 retângulos pela esquerda e com 4 pela direita. O valor exato está entre os dois?</p>`, fig: "", dicas: [R`<p>$\Delta x = 0{,}5$. Esquerda: 0; 0,5; 1; 1,5.</p>`, R`<p>Direita: 0,5; 1; 1,5; 2.</p>`], resp: R`Esquerda $1{,}75$; direita $3{,}75$; exato $\frac83 \approx 2{,}667$ fica no meio.`, sol: R`<p>Esquerda: $(0 + 0{,}25 + 1 + 2{,}25)\times0{,}5 = 1{,}75$. Direita: $(0{,}25 + 1 + 2{,}25 + 4)\times0{,}5 = 3{,}75$. Para função crescente, esquerda subestima e direita superestima. A média das duas (2,75) é o trapézio.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Sem fazer conta: quanto vale $\int_{-3}^{3}x^5\cos x\,dx$? E $\int_0^{2\pi}\operatorname{sen}x\,dx$?</p>`, fig: "", dicas: [R`<p>$x^5\cos x$ é ímpar: $f(-x) = -f(x)$.</p>`, R`<p>Área com sinal.</p>`], resp: R`Os dois são $0$.`, sol: R`<p>Função ímpar em intervalo simétrico: as áreas da esquerda e da direita se cancelam. No seno, o morro de $[0, \pi]$ cancela o vale de $[\pi, 2\pi]$.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>A corrente num fio é $i(t) = 3t^2$ (A, com $t$ em s). Quanta carga passa entre $t = 0$ e $t = 2$ s? Use $\int_0^bt^2\,dt = \frac{b^3}{3}$ (que sai igual à demonstração com $b$ no lugar de 1).</p>`, fig: "", dicas: [R`<p>$Q = \int i\,dt$.</p>`, R`<p>$3\cdot\frac{8}{3}$.</p>`], resp: R`$Q = 8$ C.`, sol: R`<p>$Q = 3\int_0^2t^2dt = 3\cdot\frac83 = 8$ C.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Qual o valor médio de $\operatorname{sen}x$ em $[0, \pi]$? Use que a área de um arco do seno é 2.</p>`, fig: "", dicas: [R`<p>$\bar f = \frac{1}{b - a}\int f$.</p>`, R`<p>$\frac2\pi$.</p>`], resp: R`$\frac2\pi \approx 0{,}637$.`, sol: R`<p>$\frac{1}{\pi}\cdot2$. Na corrente alternada retificada, é a razão entre a média e o pico.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Estime $\int_0^1e^x\,dx$ com a regra do trapézio usando 2 fatias. Compare com o exato, $e - 1$.</p>`, fig: "", dicas: [R`<p>Trapézio: $\frac{\Delta x}2[f(x_0) + 2f(x_1) + f(x_2)]$.</p>`, R`<p>$\Delta x = 0{,}5$, $f(0{,}5) = \sqrt e \approx 1{,}6487$.</p>`], resp: R`$\approx 1{,}7539$; exato $1{,}7183$; erro $\approx 0{,}036$.`, sol: R`<p>$0{,}25(1 + 3{,}2974 + 2{,}7183) = 1{,}7539$. Superestima porque $e^x$ é convexa (a corda fica acima da curva).</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Uma força de atrito do ar vale $F(v) = 0{,}2v^2$ (N). Um ciclista mantém $v = 10$ m/s por 1 km. Quanto trabalho ele faz contra o ar? E se fizer metade do caminho a 5 m/s e metade a 15 m/s?</p>`, fig: "", dicas: [R`<p>$W = \int F\,dx$, com $F$ constante em cada trecho.</p>`, R`<p>Compare $0{,}2\cdot100\cdot1000$ com $0{,}2(25\cdot500 + 225\cdot500)$.</p>`], resp: R`$20$ kJ; no segundo caso, $25$ kJ.`, sol: R`<p>Constante: $20\cdot1000 = 20\,000$ J. Variando: $0{,}2\cdot500\cdot(25 + 225) = 25\,000$ J. A média de $v^2$ é maior que o quadrado da média de $v$: andar em velocidade constante gasta menos (desigualdade de Jensen).</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-rie"); e.outerHTML = F.lab("Somas de Riemann: cinco regras, um limite", "lab-rie"); SIM.riemann(document.getElementById("lab-rie"), F); },
});
