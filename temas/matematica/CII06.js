/* CII06 · Gradiente, máximos e mínimos, multiplicadores de Lagrange. Conferido com sympy (scratchpad cii2.py):
   ∇(x²y) em (1, 2) = (4, 1), derivada direcional em (3, 4)/5 = 16/5; x³ − 3x + y²: mínimo em (1, 0), sela em (−1, 0);
   caixa sem tampa de 32 → 4 × 4 × 2, área 48; mínimos quadrados de (1; 2,1), (2; 3,9), (3; 6,2) → y = 2,05x − 0,033; plano x + 2y + 2z = 9 → (1, 2, 2), distância 3. */
F.registrar("matematica/CII06", {
  retoma: ["CII05", "CI05"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Gradiente e otimização",
      casos: [
        { nome: "Classificar ponto crítico", gerar: (p) => {
          const a = p ? 1 : F.escolha([1, 2, -1, 3]), b = p ? 1 : F.escolha([1, 2, 4, -2]), c = p ? 3 : F.escolha([1, 2, 3, -1]);
          const Dd = 4 * a * c - b * b, tipo = Dd > 0 ? (a > 0 ? "mínimo local" : "máximo local") : Dd < 0 ? "ponto de sela" : "inconclusivo";
          return { enun: R`<p>Classifique o ponto crítico $(0, 0)$ de $f(x, y) = ${F.c(a)}x^2 ${b < 0 ? "-" : "+"} ${F.c(Math.abs(b))}xy ${c < 0 ? "-" : "+"} ${F.c(Math.abs(c))}y^2$.</p>`, fig: "",
            passos: [
              R`<p>$f_x = ${2 * a}x ${b < 0 ? "-" : "+"} ${F.c(Math.abs(b))}y$ e $f_y = ${F.c(b)}x ${c < 0 ? "-" : "+"} ${Math.abs(2 * c)}y$: os dois zeram em $(0, 0)$, então é crítico.</p>`,
              R`<p>Segundas derivadas: $f_{xx} = ${2 * a}$, $f_{yy} = ${2 * c}$, $f_{xy} = ${b}$. Discriminante (hessiano): $D = f_{xx}f_{yy} - f_{xy}^2 = ${2 * a}\cdot${2 * c < 0 ? `(${2 * c})` : 2 * c} - ${b < 0 ? `(${b})` : b}^2 = ${Dd}$.</p>`,
              R`<p>${Dd > 0 ? `$D > 0$ e $f_{xx} ${a > 0 ? "> 0" : "< 0"}$: <b>${tipo}</b> (a superfície é uma tigela ${a > 0 ? "virada para cima" : "virada para baixo"}).` : Dd < 0 ? "$D < 0$: <b>ponto de sela</b>: sobe numa direção e desce em outra, como uma sela de cavalo (ou o passo entre duas montanhas)." : "$D = 0$: o teste não decide."}</p>`,
            ] };
        } },
        { nome: "Máximo no círculo (Lagrange)", gerar: (p) => {
          const a = p ? 3 : F.escolha([1, 3, 5, 6]), b = p ? 4 : F.escolha([2, 4, 8]), Rr = p ? 2 : F.escolha([1, 2, 5]);
          const n = Math.hypot(a, b), M = Rr * n;
          return { enun: R`<p>Ache o máximo de $f = ${F.c(a)}x + ${F.c(b)}y$ sobre o círculo $x^2 + y^2 = ${Rr * Rr}$.</p>`, fig: "",
            passos: [
              R`<p>Restrição $g = x^2 + y^2$. Lagrange: $\nabla f = \lambda\nabla g$, ou seja, $(${a}, ${b}) = \lambda(2x, 2y)$.</p>`,
              R`<p>Então $x = \frac{${a}}{2\lambda}$, $y = \frac{${b}}{2\lambda}$: o ponto está na direção do vetor $(${a}, ${b})$. Pondo na restrição: $\frac{${a * a + b * b}}{4\lambda^2} = ${Rr * Rr}$.</p>`,
              R`<p>$(x, y) = ${Rr}\cdot\frac{(${a}, ${b})}{${F.n(n, 3)}}$ e $f_\text{máx} = ${Rr}\sqrt{${a * a + b * b}} \approx ${F.n(M, 4)}$. (O sinal oposto dá o mínimo, $-${F.n(M, 4)}$.)</p>`,
              R`<p>Leitura geométrica: $f$ é um produto escalar, $(${a}, ${b})\cdot(x, y)$; é máximo quando $(x, y)$ aponta na mesma direção.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Por que a natureza escolhe e^(−E/kT)",
      enun: R`<p>Um sistema pode estar nos estados $1, 2, \dots, n$, com probabilidades $p_i$. A <b>entropia</b> é $S = -\sum_ip_i\ln p_i$.</p><p>(a) Usando multiplicadores de Lagrange, mostre que, só com o vínculo $\sum p_i = 1$, a entropia é máxima quando todos os $p_i$ são iguais.</p><p>(b) Agora acrescente o vínculo de energia média fixa, $\sum p_iE_i = \bar E$. Mostre que o máximo de $S$ é a <b>distribuição de Boltzmann</b> $p_i = \frac{e^{-\beta E_i}}{Z}$.</p>`,
      fig: "",
      dicas: [R`<p>$\frac{\partial S}{\partial p_i} = -\ln p_i - 1$.</p>`, R`<p>(b) Dois vínculos, dois multiplicadores: $-\ln p_i - 1 = \alpha + \beta E_i$.</p>`],
      sol: R`<p><b>(a)</b> $\nabla S = \alpha\nabla\left(\sum p_i\right)$: $-\ln p_i - 1 = \alpha$ para todo $i$. Então $\ln p_i$ é o mesmo para todos: $p_i = \frac1n$. (E é máximo, porque $S$ é côncava.)</p>
        <p><b>(b)</b> $-\ln p_i - 1 = \alpha + \beta E_i \Rightarrow p_i = e^{-1-\alpha}e^{-\beta E_i}$. A constante $e^{-1-\alpha}$ é fixada pela normalização: $p_i = \frac{e^{-\beta E_i}}{Z}$, com $Z = \sum_je^{-\beta E_j}$ (a "função de partição"). O multiplicador $\beta$ acaba sendo $\frac{1}{kT}$: <b>a temperatura é um multiplicador de Lagrange</b> ∎.</p>
        <p class="det" style="color:var(--ink2)">Daí saem a distribuição de velocidades de Maxwell–Boltzmann ${F.ret("CE02")}, a lei da atmosfera exponencial $p(h) \propto e^{-mgh/kT}$ e, com a quantização, a radiação de Planck.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 2 · 6</div>
        <div class="q">Num morro, para onde a água escorre?</div>
        <p>Para onde o terreno desce mais rápido, cortando as curvas de nível em ângulo reto. Essa direção é dada pelo <b>gradiente</b>, o vetor das derivadas parciais. Com ele: o campo elétrico sai do potencial, a otimização com várias variáveis vira "gradiente igual a zero", e os vínculos viram multiplicadores de Lagrange.</p></div>`),

      F.secao("gradiente", "O gradiente", R`
        ${F.formula(R`\nabla f = \left(\frac{\partial f}{\partial x},\ \frac{\partial f}{\partial y}\right),\qquad D_{\hat u}f = \nabla f\cdot\hat u`, "Gradiente e derivada direcional")}
        <p>A <b>derivada direcional</b> $D_{\hat u}f$ é a taxa de variação andando na direção do vetor unitário $\hat u$ (regra da cadeia ${F.ret("CII05")}). Como é um produto escalar, $D_{\hat u}f = |\nabla f|\cos\theta$. Consequências:</p>
        <ul><li>$\nabla f$ aponta para onde $f$ <b>sobe mais rápido</b> ($\theta = 0$), e $|\nabla f|$ é essa taxa máxima.</li>
          <li>$-\nabla f$ é a descida mais íngreme (por onde a água escorre).</li>
          <li>Na direção perpendicular a $\nabla f$, $f$ não muda: o gradiente é <b>perpendicular às curvas de nível</b>.</li></ul>
        ${F.caixa("fisico", R`<p>$\vec E = -\nabla V$ (o campo é perpendicular às equipotenciais e aponta para o potencial menor ${F.ret("fisica/C04")}); $\vec F = -\nabla U$ (força conservativa); $\vec q = -k\nabla T$ (o calor flui do quente para o frio, lei de Fourier). Os três são "descer a ladeira".</p>`)}`),

      F.secao("extremos", "Máximos, mínimos e selas", R`
        <p>Num máximo ou mínimo local (no interior, com $f$ derivável), todas as parciais zeram: $\nabla f = \vec0$. Os pontos com $\nabla f = \vec0$ são os <b>pontos críticos</b>. Em 2D aparece um tipo novo: o <b>ponto de sela</b>, máximo numa direção e mínimo em outra ($x^2 - y^2$ no laboratório da CII05).</p>
        ${F.formula(R`D = f_{xx}f_{yy} - f_{xy}^2:\quad D > 0,\ f_{xx} > 0 \Rightarrow \text{mínimo};\quad D > 0,\ f_{xx} < 0 \Rightarrow \text{máximo};\quad D < 0 \Rightarrow \text{sela}`, "Teste da 2ª derivada (hessiano)")}
        ${F.demo("o melhor ajuste de uma reta (mínimos quadrados)", R`<p>(i) Você mediu pontos $(x_i, y_i)$ e quer a reta $y = ax + b$ que passa "mais perto". Critério: minimizar a soma dos quadrados dos desvios, $S(a, b) = \sum(y_i - ax_i - b)^2$.</p>
          <p>(ii) $\frac{\partial S}{\partial a} = -2\sum x_i(y_i - ax_i - b) = 0$ e $\frac{\partial S}{\partial b} = -2\sum(y_i - ax_i - b) = 0$.</p>
          <p>(iii) Isso dá duas equações lineares (as "equações normais"): $a\sum x_i^2 + b\sum x_i = \sum x_iy_i$ e $a\sum x_i + bn = \sum y_i$.</p>
          <p>(iv) Exemplo: pontos $(1;\ 2{,}1)$, $(2;\ 3{,}9)$, $(3;\ 6{,}2)$ dão $a = 2{,}05$ e $b \approx -0{,}03$. É o que a planilha faz quando você pede "linha de tendência", e é como se tira $g$ de várias medidas de pêndulo com comprimentos diferentes ($T^2 \times \ell$ é uma reta de inclinação $4\pi^2/g$).</p>`)}`),

      F.secao("lagrange", "Multiplicadores de Lagrange", R`
        <p>Otimizar $f$ <b>presa</b> a um vínculo $g = c$ (andar só sobre uma curva). No ponto ótimo, a curva de nível de $f$ encosta na curva do vínculo sem cortá-la: as duas são tangentes, e os gradientes são paralelos.</p>
        ${F.formula(R`\nabla f = \lambda\,\nabla g,\qquad g(x, y) = c`, "Condição de Lagrange")}
        <div id="lab-lag"></div>
        ${F.demo("o retângulo de maior área com perímetro fixo", R`<p>(i) Maximizar $A = xy$ com $2x + 2y = P$.</p>
          <p>(ii) $\nabla A = (y, x)$ e $\nabla g = (2, 2)$. Lagrange: $y = 2\lambda$ e $x = 2\lambda$, então $x = y$.</p>
          <p>(iii) É um quadrado, de lado $\frac P4$ ∎. Sem Lagrange, daria para isolar $y$ e cair em Cálculo 1; com três ou mais variáveis e vínculos complicados, Lagrange é muito mais limpo.</p>`)}
        <p><b>O que é o λ?</b> Ele mede quanto o ótimo de $f$ melhora se você afrouxar o vínculo um pouquinho: $\lambda = \frac{df_\text{ótimo}}{dc}$. Na mecânica, os multiplicadores dos vínculos são exatamente as <b>forças de vínculo</b> (a tração do pêndulo, a normal de uma superfície) ${F.ret("fisica/U03")}. Na termodinâmica, a temperatura (chefão).</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Para $f(x, y) = x^2y$: calcule $\nabla f$ em $(1, 2)$, a derivada direcional na direção $(3, 4)$ e a maior taxa de crescimento possível nesse ponto.</p>`, fig: "", dicas: [R`<p>$\nabla f = (2xy, x^2)$.</p>`, R`<p>Normalize: $\hat u = (3, 4)/5$.</p>`], resp: R`$\nabla f = (4, 1)$; $D_{\hat u}f = \frac{16}{5} = 3{,}2$; máximo $|\nabla f| = \sqrt{17} \approx 4{,}12$.`, sol: R`<p>$(4, 1)\cdot(0{,}6;\ 0{,}8) = 2{,}4 + 0{,}8 = 3{,}2$. Nenhuma direção dá mais que $\sqrt{17}$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>O potencial numa região é $V(x, y) = x^2 - y^2$ (volts, com $x$, $y$ em metros). Qual o campo elétrico em $(1, 2)$?</p>`, fig: "", dicas: [R`<p>$\vec E = -\nabla V$.</p>`, R`<p>$\nabla V = (2x, -2y)$.</p>`], resp: R`$\vec E = (-2, 4)$ V/m.`, sol: R`<p>$-\nabla V = (-2x, 2y) = (-2, 4)$. Esse potencial (uma sela) aparece perto do centro de uma armadilha de íons (armadilha de Paul).</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Ache e classifique os pontos críticos de $f(x, y) = x^3 - 3x + y^2$.</p>`, fig: "", dicas: [R`<p>$f_x = 3x^2 - 3$, $f_y = 2y$.</p>`, R`<p>$f_{xx} = 6x$, $f_{yy} = 2$, $f_{xy} = 0$.</p>`], resp: R`$(1, 0)$: mínimo local; $(-1, 0)$: ponto de sela.`, sol: R`<p>Em $(1, 0)$: $D = 6\cdot2 = 12 > 0$, $f_{xx} > 0$. Em $(-1, 0)$: $D = -12 < 0$.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Maximize $xy$ com $x + y = 10$ por Lagrange.</p>`, fig: "", dicas: [R`<p>$(y, x) = \lambda(1, 1)$.</p>`, R`<p>$x = y$.</p>`], resp: R`$x = y = 5$, máximo 25.`, sol: R`<p>De novo, o "mais equilibrado" ganha: a média geométrica de dois números com soma fixa é máxima quando eles são iguais.</p>` }),
        F.exercicio({ n: 5, marcas: ["!"], enun: R`<p>Uma caixa sem tampa deve ter volume de 32 litros (dm³). Que dimensões usam o mínimo de material?</p>`, fig: "", dicas: [R`<p>Área $= xy + 2xz + 2yz$; elimine $z = \frac{32}{xy}$.</p>`, R`<p>$A(x, y) = xy + \frac{64}{y} + \frac{64}{x}$; zere as duas parciais.</p>`], resp: R`$4 \times 4 \times 2$ dm, área 48 dm².`, sol: R`<p>$A_x = y - \frac{64}{x^2} = 0$ e $A_y = x - \frac{64}{y^2} = 0$ dão $x = y = 4$, e $z = 2$: a altura é metade do lado, porque falta a tampa.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>No experimento do pêndulo, você mediu os pontos $(\ell, T^2)$: $(0{,}5;\ 2{,}02)$, $(0{,}75;\ 3{,}02)$, $(1{,}0;\ 4{,}03)$ (m e s²). Ache a inclinação da reta de mínimos quadrados e o $g$ correspondente. (Esses números são <b>ilustrativos</b>, não são medidas reais.)</p>`, fig: "", dicas: [R`<p>$T^2 = \frac{4\pi^2}{g}\ell$: a inclinação é $\frac{4\pi^2}{g}$.</p>`, R`<p>Use as equações normais com $n = 3$.</p>`], resp: R`Inclinação $\approx 4{,}02$ s²/m; $g \approx 9{,}82$ m/s².`, sol: R`<p>$\sum x = 2{,}25$, $\sum y = 9{,}07$, $\sum x^2 = 1{,}8125$, $\sum xy = 7{,}305$. $a = \frac{3\cdot7{,}305 - 2{,}25\cdot9{,}07}{3\cdot1{,}8125 - 2{,}25^2} = \frac{1{,}5075}{0{,}375} = 4{,}02$ s²/m, e $b \approx 0{,}008$ (quase zero, como a teoria prevê). $g = 4\pi^2/4{,}02 \approx 9{,}82$ m/s². Ajustar uma reta usa todos os pontos e diminui o erro aleatório.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Qual o ponto do plano $x + 2y + 2z = 9$ mais perto da origem? E a distância?</p>`, fig: "", dicas: [R`<p>Minimize $x^2 + y^2 + z^2$ com o vínculo.</p>`, R`<p>$(2x, 2y, 2z) = \lambda(1, 2, 2)$: o ponto é paralelo ao vetor normal.</p>`], resp: R`$(1, 2, 2)$, distância 3.`, sol: R`<p>$(x, y, z) = t(1, 2, 2)$, e $t + 4t + 4t = 9 \Rightarrow t = 1$. Distância $\sqrt{1 + 4 + 4} = 3$, que confere com a fórmula $\frac{|9|}{\sqrt{1 + 4 + 4}}$.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-lag"); e.outerHTML = F.lab("Lagrange: o ótimo é onde os gradientes ficam paralelos", "lab-lag"); SIM.lagrange(document.getElementById("lab-lag"), F); },
});
