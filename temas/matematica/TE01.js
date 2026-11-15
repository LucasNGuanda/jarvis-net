/* TE01 · Princípio de Hamilton e equações de Euler–Lagrange (cálculo das variações). Conferido em Python:
   EL de y′² + y² → y″ = y; mínimo de ∫(y′² + y²) com y(0) = 0, y(1) = 1: y = senh x/senh 1, J = coth 1 = 1,3130;
   cicloide de R = 1 m até o ponto mais baixo (π, 2): T = π√(R/g) = 1,0030 s (integral numérica igual); pela reta: 1,1890 s;
   D = 2 m, H = 1 m: cicloide 0,8056 s × reta 1,0096 s; tautócrona com R = 0,25 m: período 4π√(R/g) = 2,006 s. */
F.registrar("matematica/TE01", {
  retoma: ["CI05", "CII08", "fisica/U03", "fisica/U04"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Euler–Lagrange na prática",
      casos: [
        { nome: "Equação de um funcional", gerar: (p) => {
          const a = p ? 1 : F.escolha([1, 2, 3]), k = p ? 4 : F.escolha([1, 4, 9, 16]), w = Math.sqrt(k / a);
          return { enun: R`<p>Ache a equação de Euler–Lagrange do funcional $J[y] = \int\left(${F.c(a)}\,y'^2 - ${k}\,y^2\right)dx$ e a solução geral.</p>`, fig: "",
            passos: [
              R`<p>$F(y, y') = ${F.c(a)}y'^2 - ${k}y^2$. Derivadas: $\frac{\partial F}{\partial y} = -${2 * k}y$ e $\frac{\partial F}{\partial y'} = ${2 * a}y'$.</p>`,
              R`<p>Euler–Lagrange: $\frac{d}{dx}\left(${2 * a}y'\right) = -${2 * k}y \Rightarrow y'' = -${F.n(k / a)}\,y$.</p>`,
              R`<p>É um MHS em $x$ ${F.ret("CII08")}: $y = A\cos(${F.n(w, 3)}x) + B\sin(${F.n(w, 3)}x)$. Com $x$ = tempo, $a = m/2$ e $k$ = constante da mola/2, isso é exatamente a lagrangiana do oscilador.</p>`,
            ] };
        } },
        { nome: "Corrida: cicloide × reta", gerar: (p) => {
          const g = 9.81, D = p ? 2 : F.escolha([1, 1.5, 2, 3]), H = p ? 1 : F.escolha([0.5, 1, 1.5]);
          let lo = 1e-6, hi = 2 * Math.PI - 1e-6; const f = (T) => (T - Math.sin(T)) / (1 - Math.cos(T)) - D / H;
          for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; }
          const th = (lo + hi) / 2, Rc = H / (1 - Math.cos(th)), Tc = th * Math.sqrt(Rc / g), L = Math.hypot(D, H), Tr = L * Math.sqrt(2 / (g * H));
          return { enun: R`<p>Uma conta desliza sem atrito, a partir do repouso, de $A = (0, 0)$ até $B$, ${F.nt(D)} m para o lado e ${F.nt(H)} m abaixo. Compare o tempo pela reta e pela braquistócrona.</p>`, fig: "",
            passos: [
              R`<p>Reta: comprimento $L = ${F.n(L, 3)}$ m, aceleração constante $g\frac{H}{L}$, então $T = L\sqrt{\frac{2}{gH}} \approx ${F.n(Tr, 3)}$ s.</p>`,
              R`<p>Cicloide $x = R(\theta - \sin\theta)$, $y = R(1 - \cos\theta)$ passando por $B$: $\frac{\theta - \sin\theta}{1 - \cos\theta} = \frac{D}{H} = ${F.n(D / H, 3)}$, resolvido numericamente: $\theta_B \approx ${F.n(th, 3)}$ rad e $R \approx ${F.n(Rc, 3)}$ m.</p>`,
              R`<p>Tempo na cicloide: $T = \theta_B\sqrt{R/g} \approx ${F.n(Tc, 3)}$ s, ${F.nt((100 * (Tr - Tc)) / Tr, 0)}% mais rápido que a reta.${th > Math.PI ? " Aqui $\\theta_B > \\pi$: a curva passa abaixo de B e sobe no final, e ainda assim ganha." : ""}</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A braquistócrona de Johann Bernoulli",
      enun: R`<p>Em 1696, Johann Bernoulli desafiou os matemáticos da Europa: qual curva leva uma conta, sem atrito e a partir do repouso, de um ponto $A$ a um ponto $B$ mais baixo no menor tempo? (Newton resolveu em uma noite e mandou a resposta anônima; Bernoulli reconheceu "o leão pela garra".) Use $y$ para baixo, com $A$ na origem. (a) Escreva o tempo como um funcional $T[y] = \int F(y, y')\,dx$. (b) Como $F$ não depende de $x$, use a identidade de Beltrami e chegue a $y(1 + y'^2) = 2R$ (constante). (c) Mostre que a cicloide $x = R(\theta - \sin\theta)$, $y = R(1 - \cos\theta)$ satisfaz essa equação. (d) Mostre que o tempo até o ângulo $\theta$ é $T = \theta\sqrt{R/g}$ e calcule-o para $R = 1$ m até o ponto mais baixo.</p>`,
      fig: "",
      dicas: [R`<p>(a) Conservação de energia: $v = \sqrt{2gy}$, e $dt = ds/v$, com $ds = \sqrt{1 + y'^2}\,dx$.</p>`, R`<p>(c) Calcule $y' = \frac{dy/d\theta}{dx/d\theta} = \frac{\sin\theta}{1 - \cos\theta}$ e use $1 + \cot^2\frac\theta2 = \frac{1}{\sin^2(\theta/2)}$.</p>`],
      sol: R`<p><b>(a)</b> $T = \int\frac{ds}{v} = \int_0^{x_B}\sqrt{\frac{1 + y'^2}{2gy}}\,dx$, com $F = \sqrt{\frac{1 + y'^2}{2gy}}$.</p>
        <p><b>(b)</b> Beltrami: $F - y'\frac{\partial F}{\partial y'} = C$. Como $\frac{\partial F}{\partial y'} = \frac{y'}{\sqrt{2gy(1 + y'^2)}}$: $\frac{1 + y'^2 - y'^2}{\sqrt{2gy(1 + y'^2)}} = C$, ou seja, $y(1 + y'^2) = \frac{1}{2gC^2} \equiv 2R$.</p>
        <p><b>(c)</b> $y' = \frac{\sin\theta}{1 - \cos\theta} = \cot\frac\theta2$, então $1 + y'^2 = \frac{1}{\sin^2(\theta/2)}$ e $y(1 + y'^2) = R(1 - \cos\theta)\cdot\frac{1}{\sin^2(\theta/2)} = R\cdot2\sin^2\tfrac\theta2\cdot\frac{1}{\sin^2(\theta/2)} = 2R$. ✓</p>
        <p><b>(d)</b> $ds = \sqrt{x_\theta^2 + y_\theta^2}\,d\theta = R\sqrt{2(1 - \cos\theta)}\,d\theta$ e $v = \sqrt{2gR(1 - \cos\theta)}$, então $dt = \sqrt{R/g}\,d\theta$: o tempo cresce <b>uniformemente</b> com $\theta$! Até o ponto mais baixo ($\theta = \pi$): $T = \pi\sqrt{1/9{,}81} \approx 1{,}003$ s, contra 1,189 s pela reta. (O laboratório calcula a integral numericamente e dá o mesmo valor.)</p>
        <p>Bônus: na cicloide, uma conta solta de qualquer altura chega ao fundo no mesmo tempo, $\pi\sqrt{R/g}$ (exercício 7). É a <b>tautócrona</b> de Huygens (1673), que ele usou para tentar fazer um relógio de pêndulo perfeito.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo · teoremas</div>
        <div class="q">Qual é a curva mais rápida?</div>
        <p>No cálculo comum ${F.ret("CI05")}, você procura o <b>número</b> $x$ que minimiza uma função $f(x)$: deriva e iguala a zero. No cálculo das variações, você procura a <b>função inteira</b> $y(x)$ que minimiza uma integral: o caminho mais curto, a curva de descida mais rápida, a forma de uma corrente pendurada. A resposta é sempre uma equação diferencial, a de Euler–Lagrange. E a física inteira cabe nela: a natureza escolhe o caminho que deixa a ação estacionária ${F.ret("fisica/U04")}.</p></div>`),

      F.secao("funcional", "Funcionais e a variação", R`
        <p>Um <b>funcional</b> recebe uma função e devolve um número: $J[y] = \int_a^b F(x, y, y')\,dx$. Exemplos: comprimento de uma curva ($F = \sqrt{1 + y'^2}$), tempo de descida, ação ($F = T - V$).</p>
        <p>Suponha que $y(x)$ seja o mínimo, com as pontas fixas. Deforme: $y + \varepsilon\eta(x)$, com $\eta(a) = \eta(b) = 0$. Então $J(\varepsilon)$ é uma função comum de um número, com mínimo em $\varepsilon = 0$, e a derivada lá tem de ser zero.</p>
        ${F.formula(R`\frac{dJ}{d\varepsilon}\bigg|_0 = \int_a^b\left(\frac{\partial F}{\partial y}\eta + \frac{\partial F}{\partial y'}\eta'\right)dx = \int_a^b\left(\frac{\partial F}{\partial y} - \frac{d}{dx}\frac{\partial F}{\partial y'}\right)\eta\,dx = 0`, "Primeira variação")}
        <p>Na segunda igualdade, integramos por partes o termo com $\eta'$ ${F.ret("CII01")}: o termo de borda $\left[\frac{\partial F}{\partial y'}\eta\right]_a^b$ some porque $\eta$ zera nas pontas.</p>
        ${F.demo("lema fundamental do cálculo das variações", R`<p>Se $\int_a^b g(x)\eta(x)\,dx = 0$ para <b>toda</b> $\eta$ contínua que zera nas pontas, então $g \equiv 0$. Prova: se $g(x_0) > 0$, por continuidade $g > 0$ num intervalinho em volta de $x_0$; escolha $\eta$ um "calombo" positivo só nesse intervalinho. A integral daria positiva, contradição.</p>`)}
        ${F.formula(R`\frac{d}{dx}\left(\frac{\partial F}{\partial y'}\right) = \frac{\partial F}{\partial y}`, "Equação de Euler–Lagrange")}`),

      F.secao("lab", "A curva mais rápida", R`
        <p>Primeiro exemplo: a menor distância entre dois pontos. $F = \sqrt{1 + y'^2}$ não depende de $y$, então $\frac{\partial F}{\partial y'} = \frac{y'}{\sqrt{1 + y'^2}}$ é constante: $y'$ é constante, e a curva é uma <b>reta</b>. O cálculo das variações confirma o óbvio.</p>
        <p>Agora o não óbvio: a curva de descida mais rápida (braquistócrona). O chefão faz a conta; o laboratório faz a corrida.</p>
        <div id="lab-bq"></div>
        ${F.formula(R`\frac{\partial F}{\partial x} = 0\ \Longrightarrow\ F - y'\frac{\partial F}{\partial y'} = \text{constante}`, "Identidade de Beltrami")}
        <p>Quando $F$ não depende de $x$, Euler–Lagrange tem uma "integral primeira" (derive o lado esquerdo e use E–L para ver que dá zero). É o análogo da conservação de energia, e não é coincidência: veja o Teorema de Noether ${F.ret("TE05")}.</p>
        ${F.caixa("fisico", R`<p><b>Fermat e Snell</b> ${F.ret("fisica/O08")}: a luz minimiza o tempo $\int n(y)\sqrt{1 + y'^2}\,dx/c$. Como $F$ não depende de $x$, Beltrami dá $\frac{n(y)}{\sqrt{1 + y'^2}} = $ constante, que é $n\sin\theta = $ constante (com $\theta$ medido da vertical): a lei de Snell em meios estratificados. Miragens e o "dobrar" da luz na atmosfera saem daí.</p>`)}`),

      F.secao("hamilton", "Princípio de Hamilton", R`
        ${F.formula(R`\delta\int_{t_1}^{t_2}L(q, \dot q, t)\,dt = 0\qquad\Longleftrightarrow\qquad \frac{d}{dt}\frac{\partial L}{\partial\dot q} = \frac{\partial L}{\partial q}`, "Princípio de Hamilton")}
        <p>Troque $x \to t$, $y \to q$ e $F \to L = T - V$: Euler–Lagrange vira a equação de movimento ${F.ret("fisica/U03")}. Para $L = \frac12m\dot x^2 - V(x)$: $m\ddot x = -V'(x)$, a 2ª lei de Newton. Com várias coordenadas $q_1, \dots, q_n$, a mesma conta, com $\eta_i$ independentes, dá uma equação para cada $q_i$.</p>
        ${F.caixa("pegadinha", R`<p><b>"Mínimo" ou "estacionário"?</b> A condição $\delta J = 0$ diz só que a primeira variação zera: pode ser mínimo, máximo ou sela. Na mecânica, para tempos curtos é mínimo; para tempos longos, nem sempre (veja a U04). Para garantir mínimo, olha-se a segunda variação (condição de Legendre: $\partial^2F/\partial y'^2 > 0$).</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Corrente pendurada (catenária)</b>: minimizar a energia potencial $\int y\sqrt{1 + y'^2}\,dx$ com comprimento fixo, ou achar a película de sabão entre dois anéis (área $\int 2\pi y\sqrt{1 + y'^2}\,dx$). Beltrami dá $\frac{y}{\sqrt{1 + y'^2}} = c$, cuja solução é $y = c\cosh\frac{x - x_0}{c}$. Aparece em provas russas e no ITA de vez em quando.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Ache a equação de Euler–Lagrange de $J = \int y'^2\,dx$ e a curva que liga $(0, 0)$ a $(1, 3)$.</p>`, fig: "", dicas: [R`<p>$\partial F/\partial y = 0$.</p>`, R`<p>Então $2y'$ é constante.</p>`], resp: R`$y'' = 0$; a reta $y = 3x$.`, sol: R`<p>Esse funcional é a "energia" de uma partícula livre: ela anda em linha reta com velocidade constante.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Mostre que a função que minimiza $J = \int_0^1(y'^2 + y^2)\,dx$ com $y(0) = 0$ e $y(1) = 1$ é $y = \frac{\sinh x}{\sinh 1}$ e calcule o valor mínimo de $J$.</p>`, fig: "", dicas: [R`<p>Euler–Lagrange: $y'' = y$.</p>`, R`<p>Para o valor: integre $y'^2$ por partes e use $y'' = y$: $J = [yy']_0^1$.</p>`], resp: R`$J_\text{mín} = \coth 1 \approx 1{,}313$.`, sol: R`<p>$\int y'^2 = [yy'] - \int yy''$ e $yy'' = y^2$, então $J = [yy']_0^1 = 1\cdot\frac{\cosh1}{\sinh1} = \coth1$. Confira com qualquer outra curva, como $y = x$: $J = 1 + \frac13 \approx 1{,}333 > 1{,}313$.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Use Euler–Lagrange com $L = \frac12m\dot x^2 - \frac12kx^2$ para achar a equação de movimento.</p>`, fig: "", dicas: [R`<p>$\partial L/\partial\dot x = m\dot x$.</p>`, R`<p>$\partial L/\partial x = -kx$.</p>`], resp: R`$m\ddot x = -kx$.`, sol: R`<p>O mesmo que Newton, mas sem desenhar forças. A vantagem aparece com vínculos ${F.ret("fisica/U03")}.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>A luz atravessa um meio com índice $n(y)$ que só depende da altura. Mostre, pelo princípio de Fermat e pela identidade de Beltrami, que $n(y)\sin\theta = $ constante, onde $\theta$ é o ângulo do raio com a vertical.</p>`, fig: "", dicas: [R`<p>$F = n(y)\sqrt{1 + y'^2}$ (tempo $\times c$).</p>`, R`<p>Beltrami: $F - y'F_{y'} = \frac{n}{\sqrt{1 + y'^2}}$. E $\frac{1}{\sqrt{1 + y'^2}} = \cos\alpha$, com $\alpha$ o ângulo com a horizontal.</p>`], resp: R`$\frac{n}{\sqrt{1 + y'^2}} = n\cos\alpha = n\sin\theta = $ constante.`, sol: R`<p>É a lei de Snell aplicada camada por camada. Em dia quente, o ar perto do asfalto tem $n$ menor, e o raio vindo do céu se curva para cima: miragem ${F.ret("fisica/O08")}.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma conta desce do repouso até o ponto mais baixo de uma cicloide de $R = 1$ m (deslocamento $\pi R$ para o lado e $2R$ para baixo). Quanto tempo leva? E pela reta entre os mesmos pontos?</p>`, fig: "", dicas: [R`<p>Cicloide: $T = \theta\sqrt{R/g}$, com $\theta = \pi$.</p>`, R`<p>Reta: $T = L\sqrt{2/(gH)}$, com $L = \sqrt{\pi^2 + 4}$ e $H = 2$.</p>`], resp: R`$\approx 1{,}003$ s pela cicloide; $\approx 1{,}189$ s pela reta.`, sol: R`<p>A cicloide é <b>mais comprida</b> que a reta (meio arco tem $4R = 4$ m, contra 3,72 m) e mesmo assim chega 0,19 s antes, porque desce rápido no começo. Confira no laboratório com D = 3,14 e H = 2.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Mostre que a curva que minimiza $\int y\sqrt{1 + y'^2}\,dx$ (catenária) satisfaz $y = c\cosh\frac{x - x_0}{c}$.</p>`, fig: "", dicas: [R`<p>Beltrami: $\frac{y}{\sqrt{1 + y'^2}} = c$.</p>`, R`<p>Isole $y' = \frac{\sqrt{y^2 - c^2}}{c}$ e separe as variáveis: $\int\frac{dy}{\sqrt{y^2 - c^2}} = \cosh^{-1}\frac yc$.</p>`], resp: R`$\cosh^{-1}(y/c) = (x - x_0)/c$, ou seja, $y = c\cosh\frac{x - x_0}{c}$.`, sol: R`<p>O Gateway Arch de St. Louis é uma catenária invertida: o arco que só trabalha em compressão, sem flexão.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Na cicloide, $dt = \sqrt{R/g}\,d\theta$ (veja o chefão). Use isso para mostrar que uma conta solta de <b>qualquer</b> ponto leva o mesmo tempo até o fundo (tautócrona), e calcule o período de oscilação numa cicloide com $R = 0{,}25$ m.</p>`, fig: "", dicas: [R`<p>Pela simetria, perto do fundo a cicloide é um poço onde a "força restauradora" é proporcional ao comprimento de arco $s$ medido do fundo.</p>`, R`<p>Comprimento de arco a partir do fundo: $s = 4R\cos(\theta/2)$; a aceleração tangencial é $-g\sin\phi$, com $\sin\phi = s/(4R)$. MHS com $\omega^2 = g/(4R)$.</p>`], resp: R`Período $4\pi\sqrt{R/g} \approx 2{,}006$ s, independente da amplitude.`, sol: R`<p>$\ddot s = -\frac{g}{4R}s$ vale <b>exatamente</b>, sem aproximação de ângulo pequeno: é um pêndulo de comprimento $4R = 1$ m que não sofre a correção de amplitude do pêndulo comum ${F.ret("fisica/EP01")}. Huygens construiu "bochechas" de cicloide no relógio para forçar o fio a seguir essa curva.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-bq"); e.outerHTML = F.lab("Corrida de quatro curvas", "lab-bq"); SIM.braquisto(document.getElementById("lab-bq"), F); },
});
