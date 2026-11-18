/* CI07 · Teorema Fundamental do Cálculo. Conferido com sympy (scratchpad ci2.py):
   ∫₁²(3x² + 1) = 8; ∫₀^(π/2) cos = 1; ∫₁ᵉ dx/x = 1; média de x² em [0, 3] = 3; d/dx ∫₀^(x³) sen t dt = 3x² sen x³; W = 8 J → v = 4 m/s. */
F.registrar("matematica/CI07", {
  retoma: ["CI06", "CI04"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Integrais pelo Teorema Fundamental",
      casos: [
        { nome: "Polinômio", gerar: (p) => {
          const a = p ? 1 : F.escolha([0, 1, -1]), b = p ? 3 : F.escolha([2, 3, 4]), c2 = p ? 3 : F.escolha([1, 3, 6]), c1 = p ? -2 : F.escolha([-4, -2, 2]), c0 = p ? 1 : F.escolha([0, 1, 5]);
          const Fp = (x) => (c2 * x ** 3) / 3 + (c1 * x * x) / 2 + c0 * x, v = Fp(b) - Fp(a);
          return { enun: R`<p>Calcule $\displaystyle\int_{${a}}^{${b}}\left(${F.c(c2)}x^2 ${c1 < 0 ? "-" : "+"} ${F.c(Math.abs(c1))}x${c0 ? " + " + c0 : ""}\right)dx$.</p>`, fig: "",
            passos: [
              R`<p>Ache uma primitiva $F$ (uma função cuja derivada é o integrando). Termo a termo, "sobe o expoente e divide pelo novo": $F(x) = ${c2 === 1 ? "\\frac{x^3}{3}" : F.c(c2 / 3) + "x^3"} ${c1 < 0 ? "-" : "+"} ${F.c(Math.abs(c1) / 2)}x^2${c0 ? " + " + F.c(c0) + "x" : ""}$.</p>`,
              R`<p>Confira derivando: $F'(x) = ${F.c(c2)}x^2 ${c1 < 0 ? "-" : "+"} ${F.c(Math.abs(c1))}x${c0 ? " + " + c0 : ""}$ ✓.</p>`,
              R`<p>TFC: $\int_a^bf = F(b) - F(a) = ${F.n(Fp(b), 4)} - (${F.n(Fp(a), 4)}) = ${F.n(v, 4)}$.</p><p>Sem nenhuma soma de Riemann. É essa a mágica.</p>`,
            ] };
        } },
        { nome: "Trigonométrica", gerar: (p) => {
          const k = p ? 2 : F.escolha([1, 2, 3, 4]), fim = p ? "\\pi/4" : F.escolha(["\\pi/2", "\\pi/4", "\\pi/6"]), fv = { "\\pi/2": Math.PI / 2, "\\pi/4": Math.PI / 4, "\\pi/6": Math.PI / 6 }[fim];
          const v = (1 - Math.cos(k * fv)) / k;
          return { enun: R`<p>Calcule $\displaystyle\int_0^{${fim}}\operatorname{sen}(${k === 1 ? "" : k}x)\,dx$.</p>`, fig: "",
            passos: [
              R`<p>Primitiva de $\operatorname{sen}(${F.c(k)}x)$: chute $-\cos(${F.c(k)}x)$; derivando sai $${F.c(k)}\operatorname{sen}(${F.c(k)}x)$, sobra um fator ${k}. Corrija: $F(x) = -\frac{\cos(${F.c(k)}x)}{${k}}$.</p>`,
              R`$$F\left(${fim}\right) - F(0) = -\frac{\cos(${k}\cdot${fim})}{${k}} + \frac{1}{${k}} = \frac{1 - (${F.n(Math.cos(k * fv), 4)})}{${k}} = ${F.n(v, 4)}$$`,
            ] };
        } },
        { nome: "Derivada de uma integral", gerar: (p) => {
          const n = p ? 2 : F.escolha([2, 3]);
          return { enun: R`<p>Calcule $\dfrac{d}{dx}\displaystyle\int_1^{x^{${n}}}\frac{e^t}{t}\,dt$. (Não tente calcular a integral: $\frac{e^t}{t}$ não tem primitiva elementar.)</p>`, fig: "",
            passos: [
              R`<p>Seja $A(u) = \int_1^u\frac{e^t}{t}dt$. Pelo TFC (parte 1), $A'(u) = \frac{e^u}{u}$, mesmo sem saber a fórmula de $A$.</p>`,
              R`<p>A expressão é $A(x^{${n}})$: regra da cadeia, $\frac{d}{dx}A(x^{${n}}) = A'(x^{${n}})\cdot${n}${n - 1 === 1 ? "x" : "x^{" + (n - 1) + "}"}$.</p>`,
              R`$$= \frac{e^{x^{${n}}}}{x^{${n}}}\cdot${n}${n - 1 === 1 ? "x" : "x^{" + (n - 1) + "}"} = \frac{${n}\,e^{x^{${n}}}}{x}$$`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A função que é a sua própria área",
      enun: R`<p>Ache todas as funções contínuas $f$ tais que</p>$$f(x) = 1 + \int_0^xf(t)\,dt\quad\text{para todo } x.$$<p>Depois, generalize: e se fosse $f(x) = 1 + k\int_0^xf(t)\,dt$? O que isso tem a ver com decaimento radioativo?</p>`,
      fig: "",
      dicas: [R`<p>O lado direito é derivável (TFC), então $f$ também é. Derive os dois lados.</p>`, R`<p>Sai $f' = f$, com $f(0) = 1$ (ponha $x = 0$ na equação). Olhe para $g(x) = f(x)e^{-x}$.</p>`],
      sol: R`<p>(i) Em $x = 0$: $f(0) = 1$. Derivando (TFC parte 1): $f'(x) = f(x)$.</p>
        <p>(ii) Unicidade: $g(x) = f(x)e^{-x}$ tem $g' = f'e^{-x} - fe^{-x} = 0$, então $g$ é constante (consequência do TVM ${F.ret("CI05")}), $g = g(0) = 1$, e $f(x) = e^x$. Só essa ∎.</p>
        <p>(iii) Com $k$: $f' = kf$, $f(0) = 1$, e $f = e^{kx}$. Com $k = -\lambda < 0$: é o decaimento radioativo, $N' = -\lambda N$ ("a taxa de decaimento é proporcional ao que sobrou"). Repare que a equação integral e a equação diferencial dizem a mesma coisa: o TFC transforma uma na outra.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 1 · 7</div>
        <div class="q">Por que derivada e integral são "contrárias"?</div>
        <p>Uma mede inclinação; a outra, área. Não parecem ter nada a ver. Mas Newton e Leibniz (independentemente, por volta de 1670) perceberam que uma desfaz a outra. Com isso, a área que Arquimedes levou um livro inteiro para calcular vira uma linha de conta. É o teorema mais importante do Cálculo.</p></div>`),

      F.secao("area", "A função área", R`
        <p>Fixe um ponto de partida $a$ e defina a área acumulada até $x$:</p>
        ${F.formula(R`A(x) = \int_a^xf(t)\,dt`)}
        <p>(A variável dentro, $t$, é "muda": só serve para varrer o intervalo.) Pergunta: quão rápido $A$ cresce quando $x$ anda um pouco?</p>
        <div id="lab-tfc"></div>`),

      F.secao("tfc", "O teorema", R`
        ${F.formula(R`\text{(1)}\ \ \frac{d}{dx}\int_a^xf(t)\,dt = f(x)\qquad\qquad\text{(2)}\ \ \int_a^bf(x)\,dx = F(b) - F(a)\ \text{ para qualquer } F \text{ com } F' = f`, "Teorema Fundamental do Cálculo")}
        ${F.demo("parte 1: a faixa fininha", R`<p>(i) $A(x + h) - A(x) = \int_x^{x+h}f(t)\,dt$: a área de uma faixa de largura $h$.</p>
          <p>(ii) Se $f$ é contínua, nessa faixa $f$ fica entre o seu mínimo $m_h$ e o seu máximo $M_h$. Então $m_h\,h \leq A(x+h) - A(x) \leq M_h\,h$.</p>
          <p>(iii) Divida por $h$: $m_h \leq \frac{A(x+h) - A(x)}{h} \leq M_h$.</p>
          <p>(iv) Quando $h \to 0$, a faixa encolhe para o ponto $x$ e, por continuidade, $m_h \to f(x)$ e $M_h \to f(x)$. Pelo confronto, $A'(x) = f(x)$ ∎.</p>
          <p>Em palavras: a área cresce a uma taxa igual à altura da curva. Faz sentido: a faixa nova é quase um retângulo de altura $f(x)$.</p>`)}
        ${F.demo("parte 2: calcular sem somar", R`<p>(i) Seja $F$ qualquer primitiva de $f$. Pela parte 1, $A$ também é. Então $(F - A)' = 0$.</p>
          <p>(ii) Derivada zero num intervalo $\Rightarrow$ constante (TVM): $F(x) = A(x) + C$.</p>
          <p>(iii) $F(b) - F(a) = [A(b) + C] - [A(a) + C] = A(b) - 0 = \int_a^bf$ ∎. A constante sempre cancela.</p>`)}
        <p><b>Notação:</b> $\left[F(x)\right]_a^b = F(b) - F(a)$. Exemplos: $\int_0^1x^2dx = \left[\frac{x^3}3\right]_0^1 = \frac13$ (a demonstração inteira da CI06 virou uma linha); $\int_0^\pi\operatorname{sen}x\,dx = [-\cos x]_0^\pi = 1 + 1 = 2$.</p>
        ${F.caixa("pegadinha", R`<p>O TFC exige $f$ contínua (ou pelo menos integrável) no intervalo todo. $\int_{-1}^1\frac{dx}{x^2} = \left[-\frac1x\right]_{-1}^1 = -2$ está <b>errado</b>: o integrando é positivo e vai a infinito em $x = 0$. A integral, na verdade, diverge (integrais impróprias, ${F.ret("CII02")}).</p>`)}`),

      F.secao("fisica", "O TFC na física", R`
        ${F.demo("o teorema trabalho–energia", R`<p>(i) $W = \int_{x_1}^{x_2}F\,dx$, com $F = ma = m\frac{dv}{dt}$.</p>
          <p>(ii) Troque a variável: $dx = v\,dt$, então $W = \int m\frac{dv}{dt}v\,dt = \int_{v_1}^{v_2}m\,v\,dv$.</p>
          <p>(iii) Primitiva de $mv$ em $v$: $\frac12mv^2$. TFC: $W = \frac12mv_2^2 - \frac12mv_1^2 = \Delta K$ ∎. A energia cinética é exatamente "a primitiva do momento".</p>`)}
        <p>Do mesmo jeito: $x(t) = x_0 + \int_0^tv\,dt'$; a energia potencial é $U(x) = -\int F\,dx$ (por isso $F = -U'$); o potencial elétrico é $V = -\int\vec E\cdot d\vec\ell$ ${F.ret("fisica/C04")}. Sempre que uma grandeza é taxa de outra, o TFC liga as duas.</p>
        <h3>Limites variáveis</h3>
        <p>Com a regra da cadeia: $\frac{d}{dx}\int_a^{g(x)}f(t)\,dt = f\bigl(g(x)\bigr)\,g'(x)$. Isso deriva até integrais "impossíveis", como $\int_0^xe^{-t^2}dt$ (a função erro, das probabilidades): a derivada é simplesmente $e^{-x^2}$.</p>`),

      F.secao("exemplos", "Exemplos", exemplario),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule: (a) $\int_1^2(3x^2 + 1)\,dx$; (b) $\int_0^{\pi/2}\cos x\,dx$; (c) $\int_1^e\frac{dx}{x}$.</p>`, fig: "", dicas: [R`<p>(a) $F = x^3 + x$.</p>`, R`<p>(c) $F = \ln x$.</p>`], resp: R`(a) $8$; (b) $1$; (c) $1$.`, sol: R`<p>(a) $(8 + 2) - (1 + 1) = 8$. (b) $\operatorname{sen}\frac\pi2 - 0 = 1$. (c) $\ln e - \ln1 = 1$. O (c) é a definição "de verdade" do número $e$: a área sob $1/x$ de 1 até $e$ vale 1.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule $\frac{d}{dx}\int_0^xe^{-t^2}dt$ e $\frac{d}{dx}\int_0^{x^3}\operatorname{sen}t\,dt$.</p>`, fig: "", dicas: [R`<p>TFC parte 1.</p>`, R`<p>No segundo, cadeia com $g(x) = x^3$.</p>`], resp: R`$e^{-x^2}$ e $3x^2\operatorname{sen}(x^3)$.`, sol: R`<p>No segundo, também dá para conferir: $\int_0^{x^3}\operatorname{sen}t\,dt = 1 - \cos(x^3)$, cuja derivada é $3x^2\operatorname{sen}(x^3)$ ✓.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Uma força $F(x) = 3x^2$ (N) empurra um bloco de 1 kg, que sai do repouso em $x = 0$. Qual a velocidade em $x = 2$ m?</p>`, fig: "", dicas: [R`<p>$W = \int_0^23x^2dx$.</p>`, R`<p>$W = \Delta K = \frac12mv^2$.</p>`], resp: R`$W = 8$ J, $v = 4$ m/s.`, sol: R`<p>$W = [x^3]_0^2 = 8$ J $= \frac12\cdot1\cdot v^2$, $v = 4$ m/s.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Qual o valor médio de $x^2$ em $[0, 3]$? Em que ponto a função atinge esse valor?</p>`, fig: "", dicas: [R`<p>$\bar f = \frac13\int_0^3x^2dx$.</p>`, R`<p>$x^2 = \bar f$.</p>`], resp: R`$\bar f = 3$, atingido em $x = \sqrt3$.`, sol: R`<p>$\frac13\cdot9 = 3$. O teorema do valor médio para integrais garante que uma função contínua atinge a sua média em algum ponto.</p>` }),
        F.exercicio({ n: 5, marcas: ["!"], enun: R`<p>Ache uma função contínua $f$ com $\int_0^xf(t)\,dt = x^2\operatorname{sen}x$ para todo $x$.</p>`, fig: "", dicas: [R`<p>Derive os dois lados.</p>`, R`<p>Regra do produto.</p>`], resp: R`$f(x) = 2x\operatorname{sen}x + x^2\cos x$.`, sol: R`<p>Pelo TFC, o lado esquerdo tem derivada $f(x)$. A da direita é $2x\operatorname{sen}x + x^2\cos x$. (Confira que em $x = 0$ os dois lados valem 0, como precisa.)</p>` }),
        F.exercicio({ n: 6, enun: R`<p>A velocidade de uma partícula é $v(t) = t^2 - 4t + 3$ (m/s). Calcule o deslocamento e a distância percorrida entre $t = 0$ e $t = 3$ s.</p>`, fig: "", dicas: [R`<p>Deslocamento: $\int_0^3v\,dt$. Distância: $\int_0^3|v|\,dt$.</p>`, R`<p>$v = (t-1)(t-3)$: negativa entre 1 e 3.</p>`], resp: R`Deslocamento $0$; distância $\frac83 \approx 2{,}67$ m.`, sol: R`<p>$F = \frac{t^3}3 - 2t^2 + 3t$: $F(3) - F(0) = 9 - 18 + 9 = 0$ (voltou ao ponto de partida). Distância: $\int_0^1v = F(1) = \frac43$ e $\int_1^3|v| = F(1) - F(3) = \frac43$; total $\frac83$ m.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Onde o erro está? "$\int_{-1}^{1}\frac{dx}{x^2} = \left[-\frac1x\right]_{-1}^{1} = -1 - 1 = -2$."</p>`, fig: "", dicas: [R`<p>O integrando é positivo. Pode a integral ser negativa?</p>`, R`<p>O TFC exige continuidade no intervalo inteiro.</p>`], resp: R`$\frac1{x^2}$ não é contínua (nem limitada) em $x = 0$; o TFC não se aplica, e a integral diverge.`, sol: R`<p>Separando em $\int_{-1}^0 + \int_0^1$, cada pedaço é $+\infty$ (imprópria com $p = 2 \geq 1$, ${F.ret("CII02")}). Moral: antes de aplicar a fórmula, olhe o gráfico.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-tfc"); e.outerHTML = F.lab("A área acumulada e a sua inclinação", "lab-tfc"); SIM.areaAcum(document.getElementById("lab-tfc"), F); },
});
