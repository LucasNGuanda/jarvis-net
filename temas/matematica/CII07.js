/* CII07 · Integrais duplas e triplas. Conferido com sympy (scratchpad cii2.py):
   ∫₀²∫₀¹(x + 2y) dy dx = 4; ∬ xy no triângulo 0 ≤ y ≤ x ≤ 1 = 1/8; ∫₀¹∫ₓ¹ e^(y²) dy dx = (e − 1)/2; ∬_(r ≤ 2)(x² + y²) = 8π;
   disco com σ = σ₀r/R: M = 2πσ₀R²/3; ∬_(r ≤ R) e^(−r²) = π(1 − e^(−R²)); esfera rolando: a = (5/7) g sen θ. */
F.registrar("matematica/CII07", {
  retoma: ["CI09", "CII05"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Integrais duplas",
      casos: [
        { nome: "Retângulo (Fubini)", gerar: (p) => {
          const a = p ? 2 : F.escolha([1, 2, 3]), b = p ? 1 : F.escolha([1, 2]), m = p ? 1 : F.escolha([1, 2]), n = p ? 2 : F.escolha([1, 2, 3]);
          const v = (a ** (m + 1) / (m + 1)) * (b ** (n + 1) / (n + 1));
          const xm = m === 1 ? "x" : `x^{${m}}`, yn = n === 1 ? "y" : `y^{${n}}`;
          return { enun: R`<p>Calcule $\displaystyle\iint_Rx^{${m}}y^{${n}}\,dA$ no retângulo $0 \leq x \leq ${a}$, $0 \leq y \leq ${b}$.`.replace(`x^{${m}}y^{${n}}`, xm + yn) + "</p>", fig: "",
            passos: [
              R`<p>Fubini: integre primeiro em $y$ (com $x$ parado), depois em $x$: $\displaystyle\int_0^{${a}}\left(\int_0^{${b}}${xm}${yn}\,dy\right)dx$.</p>`,
              R`<p>Por dentro: $${xm}\left[\frac{y^{${n + 1}}}{${n + 1}}\right]_0^{${b}} = ${xm}\cdot\frac{${b ** (n + 1)}}{${n + 1}}$.</p>`,
              R`<p>Por fora: $\frac{${b ** (n + 1)}}{${n + 1}}\cdot\frac{${a ** (m + 1)}}{${m + 1}} = ${F.n(v, 4)}$. Quando o integrando é "produto de uma função de $x$ por uma de $y$" num retângulo, a dupla é o produto de duas simples.</p>`,
            ] };
        } },
        { nome: "Polares: ∬ (x² + y²)ⁿ no disco", gerar: (p) => {
          const n = p ? 1 : F.escolha([1, 2, 3]), Rr = p ? 2 : F.escolha([1, 2, 3]), v = (2 * Math.PI * Rr ** (2 * n + 2)) / (2 * n + 2);
          return { enun: R`<p>Calcule $\displaystyle\iint_D(x^2 + y^2)^{${n}}\,dA$ no disco $x^2 + y^2 \leq ${Rr * Rr}$.</p>`, fig: "",
            passos: [
              R`<p>Região redonda e integrando que só depende de $x^2 + y^2 = r^2$: polares. $dA = r\,dr\,d\theta$ (não esqueça o $r$!).</p>`,
              R`$$\int_0^{2\pi}\!\!\int_0^{${Rr}}r^{${2 * n}}\cdot r\,dr\,d\theta = 2\pi\left[\frac{r^{${2 * n + 2}}}{${2 * n + 2}}\right]_0^{${Rr}} = \frac{2\pi\cdot${Rr ** (2 * n + 2)}}{${2 * n + 2}} \approx ${F.n(v, 4)}$$`,
              R`<p>Em coordenadas $x, y$, essa conta exigiria $\sqrt{${Rr * Rr} - x^2}$ nos limites: possível, mas bem pior.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Qual chega primeiro lá embaixo?",
      enun: R`<p>Uma esfera maciça, um cilindro maciço e um anel fino (todos de massa $M$ e raio $R$) rolam sem deslizar por uma rampa de inclinação $\theta$, saindo juntos do repouso.</p><p>(a) Calcule os momentos de inércia por integral: anel $MR^2$, disco/cilindro $\frac12MR^2$, esfera maciça $\frac25MR^2$. (b) Mostre que a aceleração é $a = \frac{g\operatorname{sen}\theta}{1 + I/(MR^2)}$. (c) Quem chega primeiro?</p>`,
      fig: "",
      dicas: [R`<p>(a) $I = \int r_\perp^2\,dm$. Disco: anéis de raio $r$ e massa $dm = \sigma\cdot2\pi r\,dr$. Esfera: fatie em discos de raio $\sqrt{R^2 - z^2}$ e some os $\frac12dm\,r^2$ deles.</p>`, R`<p>(b) Energia: $Mgh = \frac12Mv^2 + \frac12I\omega^2$ com $\omega = v/R$. Isso dá $v^2 = \frac{2gh}{1 + I/MR^2}$, ou seja, um MUV com a aceleração acima.</p>`],
      sol: R`<p><b>(a)</b> Anel: toda a massa em $r = R$: $I = MR^2$. Disco: $\sigma = \frac{M}{\pi R^2}$, $I = \int_0^R r^2\sigma2\pi r\,dr = 2\pi\sigma\frac{R^4}{4} = \frac12MR^2$. Esfera: discos na altura $z$, raio $\rho^2 = R^2 - z^2$, massa $dm = \rho_v\pi\rho^2dz$; $I = \int_{-R}^R\frac12\rho_v\pi(R^2 - z^2)^2dz = \frac12\rho_v\pi\cdot\frac{16R^5}{15}$, e com $\rho_v = \frac{3M}{4\pi R^3}$: $I = \frac25MR^2$.</p>
        <p><b>(b)</b> Derivando a energia no tempo, $a = \frac{g\operatorname{sen}\theta}{1 + I/MR^2}$.</p>
        <p><b>(c)</b> Esfera $a = \frac57g\operatorname{sen}\theta \approx 0{,}714$; cilindro $\frac23 \approx 0{,}667$; anel $\frac12$ (em unidades de $g\operatorname{sen}\theta$). A esfera ganha, depois o cilindro, depois o anel, <b>independente de massa e raio</b>: só importa como a massa está distribuída. Quem tem mais massa longe do eixo gasta mais energia girando.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 2 · 7</div>
        <div class="q">Qual a massa de uma placa cuja densidade muda de ponto a ponto?</div>
        <p>Com densidade constante, massa = densidade × área. Se ela varia, fatie a placa em quadradinhos, some densidade × área de cada um e faça os quadradinhos encolherem: é a <b>integral dupla</b>. Em 3D, a tripla. Com elas: massa, carga, centro de massa, momento de inércia, fluxo, e a famosa integral de Gauss.</p></div>`),

      F.secao("dupla", "A integral dupla", R`
        ${F.formula(R`\iint_Df(x, y)\,dA = \lim\sum_{i,j}f(x_i, y_j)\,\Delta x\,\Delta y`, "Integral dupla")}
        <p>Com $f \geq 0$, é o <b>volume</b> embaixo da superfície $z = f(x, y)$ e acima da região $D$. Com $f = 1$, é a área de $D$. Com $f$ = densidade, é a massa.</p>
        <div id="lab-dup"></div>
        <h3>Como calcular: integrais iteradas (Fubini)</h3>
        <p>Fatie o volume em "paredes" e some as paredes: $\iint_Df\,dA = \int_a^b\left(\int_{y_1(x)}^{y_2(x)}f(x, y)\,dy\right)dx$. A integral de dentro é a área de uma parede (com $x$ parado); a de fora soma as paredes. Num retângulo, a ordem não importa.</p>
        ${F.demo("um triângulo e a troca de ordem", R`<p>(i) $\iint xy\,dA$ no triângulo $0 \leq y \leq x \leq 1$: para cada $x$, $y$ vai de 0 a $x$.</p>
          <p>(ii) $\int_0^1\left(\int_0^xxy\,dy\right)dx = \int_0^1x\cdot\frac{x^2}{2}dx = \frac18$.</p>
          <p>(iii) <b>Troca de ordem</b> salva integrais impossíveis: $\int_0^1\int_x^1e^{y^2}dy\,dx$ não sai na ordem dada ($e^{y^2}$ não tem primitiva). A mesma região descrita "por $y$": $0 \leq x \leq y$, $0 \leq y \leq 1$. Então $\int_0^1\left(\int_0^ye^{y^2}dx\right)dy = \int_0^1y\,e^{y^2}dy = \frac{e - 1}{2}$.</p>`)}`),

      F.secao("polares", "Coordenadas polares", R`
        ${F.formula(R`x = r\cos\theta,\ \ y = r\operatorname{sen}\theta,\qquad dA = r\,dr\,d\theta`)}
        <p>Por que o $r$? O "retângulo" polar entre $r$ e $r + dr$, $\theta$ e $\theta + d\theta$ tem lados $dr$ e $r\,d\theta$ (um arco): área $r\,dr\,d\theta$. Longe do centro, o mesmo $d\theta$ cobre mais área.</p>
        ${F.demo("a integral de Gauss, de novo", R`<p>(i) $\iint_{\mathbb R^2}e^{-(x^2 + y^2)}dA$, em polares: $\int_0^{2\pi}\int_0^\infty e^{-r^2}r\,dr\,d\theta = 2\pi\cdot\frac12 = \pi$.</p>
          <p>(ii) Em cartesianas, a mesma integral é $\left(\int e^{-x^2}dx\right)^2$. Logo $\int_{-\infty}^\infty e^{-x^2}dx = \sqrt\pi$ ${F.ret("CE02")}. No disco de raio $R$, sobra $\pi(1 - e^{-R^2})$, como no laboratório.</p>`)}`),

      F.secao("tripla", "Integrais triplas e coordenadas esféricas", R`
        ${F.formula(R`\iiint_Ef\,dV,\qquad\text{cilíndricas: } dV = r\,dr\,d\theta\,dz,\qquad\text{esféricas: } dV = r^2\operatorname{sen}\theta\,dr\,d\theta\,d\varphi`)}
        <p>Nas esféricas, $\theta$ é o ângulo a partir do eixo $z$ (de 0 a $\pi$) e $\varphi$ é o ângulo em volta dele (de 0 a $2\pi$). O fator $r^2\operatorname{sen}\theta$ é o volume do "tijolinho" curvo: lados $dr$, $r\,d\theta$ e $r\operatorname{sen}\theta\,d\varphi$.</p>
        ${F.demo("volume da esfera", R`<p>$V = \int_0^{2\pi}\!\int_0^\pi\!\int_0^Rr^2\operatorname{sen}\theta\,dr\,d\theta\,d\varphi = \frac{R^3}{3}\cdot[-\cos\theta]_0^\pi\cdot2\pi = \frac{R^3}{3}\cdot2\cdot2\pi = \frac43\pi R^3$ ✓.</p>`)}
        <p>Em geral, trocar de variáveis multiplica $dA$ ou $dV$ pelo <b>jacobiano</b>, o fator de "esticamento" da área ou do volume. O $r$ e o $r^2\operatorname{sen}\theta$ são os jacobianos das polares e das esféricas.</p>
        <table class="tb"><tr><th>grandeza</th><th>integral</th></tr>
          <tr><td>massa</td><td>$M = \iiint\rho\,dV$</td></tr>
          <tr><td>centro de massa</td><td>$\vec r_\text{cm} = \frac1M\iiint\vec r\,\rho\,dV$</td></tr>
          <tr><td>momento de inércia</td><td>$I = \iiint r_\perp^2\,\rho\,dV$ (distância ao eixo, ao quadrado)</td></tr>
          <tr><td>carga</td><td>$Q = \iiint\rho_q\,dV$; e daí $\oiint\vec E\cdot d\vec A = Q/\varepsilon_0$ ${F.ret("CE03")}</td></tr></table>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $\int_0^2\int_0^1(x + 2y)\,dy\,dx$.</p>`, fig: "", dicas: [R`<p>Por dentro: $[xy + y^2]_0^1 = x + 1$.</p>`, R`<p>$\int_0^2(x + 1)dx$.</p>`], resp: R`$4$.`, sol: R`<p>$2 + 2 = 4$. Confira trocando a ordem: dá o mesmo.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule $\iint_Dxy\,dA$ no triângulo de vértices $(0, 0)$, $(1, 0)$ e $(1, 1)$.</p>`, fig: "", dicas: [R`<p>Para cada $x$, $y$ vai de 0 a $x$.</p>`, R`<p>$\int_0^1\frac{x^3}{2}dx$.</p>`], resp: R`$\frac18$.`, sol: R`<p>É a demonstração da seção 1 (e uma das opções do laboratório).</p>` }),
        F.exercicio({ n: 3, marcas: ["!"], enun: R`<p>Calcule $\int_0^1\int_x^1e^{y^2}\,dy\,dx$.</p>`, fig: "", dicas: [R`<p>Desenhe a região: $x \leq y \leq 1$, $0 \leq x \leq 1$.</p>`, R`<p>Troque a ordem: $x$ de 0 a $y$.</p>`], resp: R`$\frac{e - 1}{2} \approx 0{,}859$.`, sol: R`<p>$\int_0^1y\,e^{y^2}dy = \frac12[e^{y^2}]_0^1$.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Calcule $\iint_D(x^2 + y^2)\,dA$ no disco de raio 2.</p>`, fig: "", dicas: [R`<p>Polares: $\int_0^{2\pi}\int_0^2r^2\cdot r\,dr\,d\theta$.</p>`, R`<p>$2\pi\cdot\frac{16}{4}$.</p>`], resp: R`$8\pi$.`, sol: R`<p>Com densidade 1, isso é o momento de inércia polar do disco: $\frac12MR^2$ com $M = 4\pi$ e $R = 2$ dá $8\pi$ ✓.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Mostre que o momento de inércia de um disco uniforme (massa $M$, raio $R$) em torno do eixo central é $\frac12MR^2$.</p>`, fig: "", dicas: [R`<p>Anéis: $dm = \frac{M}{\pi R^2}2\pi r\,dr$.</p>`, R`<p>$I = \int_0^Rr^2dm$.</p>`], resp: R`$I = \frac{2M}{R^2}\cdot\frac{R^4}{4} = \frac12MR^2$.`, sol: R`<p>Metade do de um anel de mesma massa: parte da massa está perto do eixo.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Um disco de raio $R$ tem densidade superficial que cresce para fora, $\sigma = \sigma_0\frac rR$. Calcule a massa.</p>`, fig: "", dicas: [R`<p>$M = \int_0^{2\pi}\int_0^R\sigma_0\frac rR\,r\,dr\,d\theta$.</p>`, R`<p>$2\pi\frac{\sigma_0}{R}\cdot\frac{R^3}{3}$.</p>`], resp: R`$M = \frac23\pi\sigma_0R^2$.`, sol: R`<p>Dois terços da massa que teria com $\sigma_0$ uniforme.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Use coordenadas esféricas para calcular a carga de uma esfera de raio $R$ com densidade $\rho = \rho_0\left(1 - \frac rR\right)$.</p>`, fig: "", dicas: [R`<p>$Q = \int_0^{2\pi}\int_0^\pi\int_0^R\rho_0\left(1 - \frac rR\right)r^2\operatorname{sen}\theta\,dr\,d\theta\,d\varphi$.</p>`, R`<p>A parte angular dá $4\pi$; a radial, $\frac{R^3}{3} - \frac{R^3}{4}$.</p>`], resp: R`$Q = \frac{\pi\rho_0R^3}{3}$.`, sol: R`<p>$4\pi\rho_0\cdot\frac{R^3}{12} = \frac{\pi\rho_0R^3}{3}$. É um quarto do que seria com $\rho_0$ uniforme ($\frac43\pi R^3\rho_0$).</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-dup"); e.outerHTML = F.lab("Integral dupla: somando prismas", "lab-dup"); SIM.dupla(document.getElementById("lab-dup"), F); },
});
