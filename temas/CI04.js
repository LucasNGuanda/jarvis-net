/* CI04 · Regras de derivação e regra da cadeia. Conferido com sympy (scratchpad ci.py):
   (xˣ)′ em 1 = 1, em 2 = 6,7726; (x^(xˣ))′ em 1 = 1, em 2 = 107,11; propagação do pêndulo do Lucas: Δg/g = 0,00325 → Δg ≈ 0,03 m/s². */
F.registrar("CI04", {
  retoma: ["CI03"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Derivando com as regras",
      casos: [
        { nome: "Cadeia: (ax + b)ⁿ", gerar: (p) => {
          const a = p ? 3 : F.escolha([2, 3, 5]), b = p ? 1 : F.escolha([-1, 1, 4]), n = p ? 4 : F.escolha([3, 4, 5, 10]);
          return { enun: R`<p>Derive $h(x) = (${F.c(a)}x ${b < 0 ? "-" : "+"} ${Math.abs(b)})^{${n}}$.</p>`, fig: "",
            passos: [
              R`<p>É uma composição: <b>de fora</b> $f(u) = u^{${n}}$, <b>de dentro</b> $u = g(x) = ${F.c(a)}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}$.</p>`,
              R`<p>$f'(u) = ${n}u^{${n - 1}}$ e $g'(x) = ${a}$.</p>`,
              R`<p>Regra da cadeia: derivada de fora (calculada no de dentro) vezes derivada de dentro:</p>$$h'(x) = ${F.c(n)}(${F.c(a)}x ${b < 0 ? "-" : "+"} ${Math.abs(b)})^{${n - 1}}\cdot${a} = ${F.c(n * a)}(${F.c(a)}x ${b < 0 ? "-" : "+"} ${Math.abs(b)})^{${n - 1}}$$<p>Expandir a potência ${n} primeiro daria o mesmo resultado, com muito mais trabalho.</p>`,
            ] };
        } },
        { nome: "Produto: e^(ax)·sen(bx)", gerar: (p) => {
          const a = p ? -1 : F.escolha([-2, -1, 1, 2]), b = p ? 3 : F.escolha([1, 2, 3, 5]);
          return { enun: R`<p>Derive $y = e^{${a === -1 ? "-" : a === 1 ? "" : a}x}\operatorname{sen}(${b === 1 ? "" : b}x)$. ${a < 0 ? "(É uma oscilação amortecida: um MHS com atrito.)" : ""}</p>`, fig: "",
            passos: [
              R`<p>Produto $u\cdot v$ com $u = e^{${F.c(a)}x}$ e $v = \operatorname{sen}(${F.c(b)}x)$. Regra: $(uv)' = u'v + uv'$.</p>`,
              R`<p>Cada pedaço pela cadeia: $u' = ${F.c(a)}e^{${F.c(a)}x}$ e $v' = ${F.c(b)}\cos(${F.c(b)}x)$.</p>`,
              R`$$y' = ${F.c(a)}e^{${F.c(a)}x}\operatorname{sen}(${F.c(b)}x) + ${F.c(b)}e^{${F.c(a)}x}\cos(${F.c(b)}x) = e^{${F.c(a)}x}\left[${F.c(a)}\operatorname{sen}(${F.c(b)}x) + ${F.c(b)}\cos(${F.c(b)}x)\right]$$`,
              R`<p>Em $x = 0$: $y'(0) = ${b}$. A exponencial nunca zera, então a velocidade zera quando $\operatorname{tg}(${F.c(b)}x) = ${F.n(-b / a, 3)}$.</p>`,
            ] };
        } },
        { nome: "Quociente: (ax + b)/(x² + c)", gerar: (p) => {
          const a = p ? 2 : F.escolha([1, 2, 3]), b = p ? 1 : F.escolha([0, 1, -2]), c = p ? 1 : F.escolha([1, 4, 9]);
          const num = `${a === 1 ? "" : a}x${b ? (b > 0 ? " + " + b : " - " + -b) : ""}`;
          return { enun: R`<p>Derive $y = \dfrac{${num}}{x^2 + ${c}}$.</p>`, fig: "",
            passos: [
              R`<p>Quociente: $\left(\frac uv\right)' = \frac{u'v - uv'}{v^2}$ ("derivada de cima vezes a de baixo, menos a de cima vezes a derivada de baixo, sobre a de baixo ao quadrado").</p>`,
              R`<p>$u = ${num}$, $u' = ${a}$; $v = x^2 + ${c}$, $v' = 2x$.</p>`,
              R`$$y' = \frac{${F.c(a)}(x^2 + ${c}) - (${num})\cdot2x}{(x^2 + ${c})^2} = \frac{${F.c(-a)}x^2 ${-2 * b < 0 ? "-" : "+"} ${Math.abs(2 * b)}x + ${a * c}}{(x^2 + ${c})^2}$$`.replace("+ 0x ", "").replace("- 0x ", ""),
              R`<p>Os pontos de tangente horizontal saem do numerador: $${F.c(a)}x^2 ${2 * b < 0 ? "-" : "+"} ${Math.abs(2 * b)}x - ${a * c} = 0$.</p>`.replace("+ 0x ", "").replace("- 0x ", ""),
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A torre x^(x^x)",
      enun: R`<p>Calcule a derivada de $y = x^{x^x}$ (que quer dizer $x^{(x^x)}$) e o valor de $y'(1)$ e de $y'(2)$.</p>`,
      fig: "",
      dicas: [R`<p>Derivação logarítmica duas vezes. Primeiro: $(x^x)' = x^x(\ln x + 1)$.</p>`, R`<p>$\ln y = x^x\ln x$. Derive os dois lados (produto à direita).</p>`],
      sol: R`<p>(i) $\ln y = x^x\ln x$. Derivando: $\frac{y'}{y} = (x^x)'\ln x + x^x\cdot\frac1x = x^x(\ln x + 1)\ln x + x^{x-1}$.</p>
        <p>(ii) $y' = x^{x^x}\cdot x^x\left[(\ln x + 1)\ln x + \frac1x\right]$.</p>
        <p>(iii) Em $x = 1$: $1\cdot1\cdot[0 + 1] = 1$. Em $x = 2$: $2^4\cdot4\cdot\left[(\ln2 + 1)\ln2 + \frac12\right] = 64\times1{,}6736 \approx 107{,}1$. Conferi com álgebra simbólica (sympy).</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 1 · 4</div>
        <div class="q">No seu experimento do pêndulo, por que o erro de T conta <b>duas vezes</b> no erro de g?</div>
        <p>Porque $g = 4\pi^2\ell\,T^{-2}$, e a derivada de $T^{-2}$ traz o expoente para a frente. A "derivada logarítmica" que o seu professor usa é só a regra da cadeia aplicada ao $\ln$. Este tema monta a caixa de ferramentas para derivar qualquer coisa sem voltar à definição.</p></div>`),

      F.secao("regras", "As regras", R`
        ${F.formula(R`(af + bg)' = af' + bg'\qquad(fg)' = f'g + fg'\qquad\left(\frac fg\right)' = \frac{f'g - fg'}{g^2}`, "Linearidade, produto, quociente")}
        ${F.demo("regra do produto (o retângulo)", R`<p>(i) Pense em $f\cdot g$ como a área de um retângulo de lados $f$ e $g$.</p>
          <p>(ii) Quando $x$ muda de $h$, os lados viram $f + \Delta f$ e $g + \Delta g$. A área nova menos a velha: $\Delta(fg) = \Delta f\cdot g + f\cdot\Delta g + \Delta f\,\Delta g$ (duas faixas finas e um quadradinho no canto).</p>
          <p>(iii) Divida por $h$: $\frac{\Delta f}{h}g + f\frac{\Delta g}{h} + \frac{\Delta f}{h}\Delta g$. Quando $h \to 0$, o último termo vai a $f'\cdot0 = 0$ (o quadradinho é "de segunda ordem"). Sobra $f'g + fg'$ ∎.</p>`)}
        <p>Erro clássico: achar que $(fg)' = f'g'$. Teste com $f = g = x$: $(x^2)' = 2x$, mas $1\cdot1 = 1$.</p>`),

      F.secao("cadeia", "A regra da cadeia", R`
        ${F.formula(R`\frac{d}{dx}f\bigl(g(x)\bigr) = f'\bigl(g(x)\bigr)\cdot g'(x)\qquad\text{ou}\qquad\frac{dy}{dx} = \frac{dy}{du}\cdot\frac{du}{dx}`, "Regra da cadeia")}
        <p>Intuição das engrenagens: se $u$ gira 3 vezes mais rápido que $x$, e $y$ gira 2 vezes mais rápido que $u$, então $y$ gira $2\times3 = 6$ vezes mais rápido que $x$. As taxas se <b>multiplicam</b>. Na notação de Leibniz parece que "o $du$ cancela", e é um bom jeito de lembrar (embora não seja uma prova).</p>
        ${F.demo("a ideia da prova", R`<p>(i) $\frac{f(g(x+h)) - f(g(x))}{h} = \frac{f(g(x+h)) - f(g(x))}{g(x+h) - g(x)}\cdot\frac{g(x+h) - g(x)}{h}$ (quando o de baixo não é zero).</p>
          <p>(ii) Com $k = g(x+h) - g(x) \to 0$ (porque $g$ é contínua), o primeiro fator é $\frac{f(u + k) - f(u)}{k} \to f'(u)$ e o segundo vai a $g'(x)$ ∎.</p>
          <p class="det" style="color:var(--ink2)">(O caso em que $g(x+h) = g(x)$ para $h$ pequenos precisa de um ajuste técnico, mas o resultado não muda.)</p>`)}
        <div id="lab-cad"></div>
        <p>Exemplos rápidos: $(\operatorname{sen}\omega t)' = \omega\cos\omega t$; $(e^{-x^2})' = -2xe^{-x^2}$; $\left(\sqrt{1 + x^2}\right)' = \frac{x}{\sqrt{1 + x^2}}$. Na física, toda vez que você deriva em relação ao tempo algo que depende da posição, é cadeia: $\frac{dU}{dt} = \frac{dU}{dx}\frac{dx}{dt} = -F\,v$ (a potência da força).</p>`),

      F.secao("inversas", "Inversas, implícitas e logarítmicas", R`
        ${F.demo("derivada do ln (pela inversa)", R`<p>(i) $y = \ln x \iff e^y = x$.</p>
          <p>(ii) Derive os dois lados em $x$ (cadeia à esquerda): $e^y\,y' = 1$.</p>
          <p>(iii) $y' = \frac1{e^y} = \frac1x$ ∎. Do mesmo jeito: $(\arctan x)' = \frac{1}{1 + x^2}$ e $(\arcsin x)' = \frac{1}{\sqrt{1 - x^2}}$. A derivada da W de Lambert saiu exatamente assim ${F.ret("CE01")}.</p>`)}
        <h3>Derivação implícita</h3>
        <p>No círculo $x^2 + y^2 = R^2$, derive tudo em $x$, lembrando que $y$ depende de $x$: $2x + 2y\,y' = 0 \Rightarrow y' = -\frac xy$. A tangente é perpendicular ao raio (inclinação do raio: $\frac yx$; produto $= -1$).</p>
        <h3>Derivação logarítmica</h3>
        <p>Para produtos, quocientes e potências, tire o $\ln$ antes: os produtos viram somas. Exemplo: $y = x^x$. $\ln y = x\ln x \Rightarrow \frac{y'}y = \ln x + 1 \Rightarrow y' = x^x(\ln x + 1)$.</p>
        ${F.demo("propagação de incertezas (o método do seu professor)", R`<p>(i) $g = 4\pi^2\ell\,T^{-2}$. Tire o $\ln$: $\ln g = \ln(4\pi^2) + \ln\ell - 2\ln T$.</p>
          <p>(ii) Diferencie: $\frac{dg}{g} = \frac{d\ell}{\ell} - 2\frac{dT}{T}$.</p>
          <p>(iii) Para incertezas (pior caso), troque cada diferencial pelo erro e some os módulos:</p>
          ${F.formula(R`\frac{\Delta g}{g} = 1\cdot\frac{\Delta\ell}{\ell} + |-2|\cdot\frac{\Delta T}{T}`)}
          <p>(iv) Com os seus dados ($\ell = 0{,}750 \pm 0{,}001$ m, $T = 1{,}776 \pm 0{,}0017$ s): $\frac{\Delta g}{g} = 0{,}00133 + 2\times0{,}00096 = 0{,}00325$, e com $g = 9{,}39$ m/s², $\Delta g \approx 0{,}03$ m/s². É exatamente o $(9{,}39 \pm 0{,}03)$ do seu relatório. O expoente vira peso: é por isso que medir o período bem importa o dobro.</p>`)}`),

      F.secao("tabela", "Tabela final", R`
        <table class="tb"><tr><th>f</th><th>f′</th><th>f</th><th>f′</th></tr>
          <tr><td>$x^r$ ($r$ real)</td><td>$rx^{r-1}$</td><td>$\operatorname{tg}x$</td><td>$\sec^2x = 1 + \operatorname{tg}^2x$</td></tr>
          <tr><td>$e^x$</td><td>$e^x$</td><td>$a^x$</td><td>$a^x\ln a$</td></tr>
          <tr><td>$\ln x$</td><td>$\frac1x$</td><td>$\log_ax$</td><td>$\frac{1}{x\ln a}$</td></tr>
          <tr><td>$\operatorname{sen}x$</td><td>$\cos x$</td><td>$\arcsin x$</td><td>$\frac1{\sqrt{1-x^2}}$</td></tr>
          <tr><td>$\cos x$</td><td>$-\operatorname{sen}x$</td><td>$\arctan x$</td><td>$\frac1{1+x^2}$</td></tr></table>
        <p>Com essas linhas e as três regras, dá para derivar qualquer função escrita com fórmulas. Integrar é bem mais difícil ($e^{-x^2}$ não tem primitiva elementar), e é por isso que existem funções especiais ${F.ret("CE02")}.</p>`),

      F.secao("exemplos", "Exemplos", exemplario),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Derive: (a) $x^3\operatorname{sen}x$; (b) $\frac{x}{1 + x^2}$; (c) $\operatorname{sen}^2(3x)$.</p>`, fig: "", dicas: [R`<p>(a) produto, (b) quociente, (c) cadeia duas vezes.</p>`, R`<p>(c) $\operatorname{sen}^2(3x) = [\operatorname{sen}(3x)]^2$.</p>`], resp: R`(a) $3x^2\operatorname{sen}x + x^3\cos x$; (b) $\frac{1 - x^2}{(1 + x^2)^2}$; (c) $6\operatorname{sen}3x\cos3x = 3\operatorname{sen}6x$.`, sol: R`<p>(c) $2\operatorname{sen}(3x)\cdot\cos(3x)\cdot3$, e pela fórmula do arco duplo vira $3\operatorname{sen}(6x)$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Um pêndulo tem $\theta(t) = 0{,}2\cos(4t)$ rad. Calcule a velocidade angular e a aceleração angular máximas.</p>`, fig: "", dicas: [R`<p>$\dot\theta = -0{,}8\operatorname{sen}(4t)$.</p>`, R`<p>Máximo de $|\operatorname{sen}|$ é 1.</p>`], resp: R`$0{,}8$ rad/s e $3{,}2$ rad/s².`, sol: R`<p>$\ddot\theta = -3{,}2\cos(4t) = -16\,\theta$: confere com $\omega^2 = 16$.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Derive $x^x$ e calcule em $x = 1$ e $x = 2$. Em que $x$ a derivada zera?</p>`, fig: "", dicas: [R`<p>Derivação logarítmica.</p>`, R`<p>$\ln x + 1 = 0$.</p>`], resp: R`$x^x(\ln x + 1)$; $1$ e $\approx 6{,}77$; zera em $x = 1/e$.`, sol: R`<p>$4(\ln2 + 1) \approx 6{,}7726$. Em $x = 1/e \approx 0{,}368$, $x^x$ tem o mínimo $e^{-1/e} \approx 0{,}692$. Parente próximo do fundo do seu gam fresco ${F.ret("X01")}.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Ache a reta tangente à elipse $\frac{x^2}{4} + y^2 = 1$ no ponto $\left(1, \frac{\sqrt3}2\right)$.</p>`, fig: "", dicas: [R`<p>Implícita: $\frac x2 + 2yy' = 0$.</p>`, R`<p>$y' = -\frac{x}{4y}$.</p>`], resp: R`$y' = -\frac{1}{2\sqrt3}$; $\ y = \frac{\sqrt3}{2} - \frac{x - 1}{2\sqrt3}$.`, sol: R`<p>$y' = -\frac{1}{4\cdot\sqrt3/2} = -\frac{1}{2\sqrt3} \approx -0{,}289$.</p>` }),
        F.exercicio({ n: 5, marcas: ["!"], enun: R`<p>A resistência de um fio é $R = \rho\frac{L}{\pi r^2}$. Se $L$ tem erro de 1% e o raio $r$ tem erro de 2%, qual o erro percentual de $R$ (pior caso)?</p>`, fig: "", dicas: [R`<p>Derivação logarítmica: $\ln R = \ln\rho + \ln L - \ln\pi - 2\ln r$.</p>`, R`<p>O expoente $-2$ vira peso 2.</p>`], resp: R`$1\% + 2\times2\% = 5\%$.`, sol: R`<p>$\frac{\Delta R}{R} = \frac{\Delta L}{L} + 2\frac{\Delta r}{r}$. Medir o diâmetro do fio é o ponto crítico ${F.ret("C07")}.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Uma escada de 5 m está encostada numa parede. O pé dela escorrega a 0,5 m/s. Com que velocidade o topo desce quando o pé está a 3 m da parede?</p>`, fig: "", dicas: [R`<p>$x^2 + y^2 = 25$. Derive em $t$: cadeia.</p>`, R`<p>$2x\dot x + 2y\dot y = 0$; com $x = 3$, $y = 4$.</p>`], resp: R`$\dot y = -0{,}375$ m/s (descendo).`, sol: R`<p>$\dot y = -\frac{x\dot x}{y} = -\frac{3\cdot0{,}5}{4} = -0{,}375$ m/s. Quando $y \to 0$, $\dot y$ explode: o modelo deixa de valer antes (a escada desgruda da parede).</p>` }),
        F.exercicio({ n: 7, enun: R`<p>Derive $f(x) = \ln\left(\operatorname{sen}x\right)$ e $g(x) = \arctan\frac1x$. Simplifique o $g'$. O que isso diz sobre $\arctan x + \arctan\frac1x$?</p>`, fig: "", dicas: [R`<p>$f' = \frac{\cos x}{\operatorname{sen}x}$.</p>`, R`<p>$g' = \frac{1}{1 + 1/x^2}\cdot\left(-\frac1{x^2}\right)$.</p>`], resp: R`$f' = \operatorname{cotg}x$; $g' = -\frac1{1 + x^2}$; a soma é constante ($\frac\pi2$ para $x > 0$).`, sol: R`<p>$g' = -\frac{1}{x^2 + 1}$, o oposto de $(\arctan x)'$. A soma tem derivada zero, logo é constante em $x > 0$; em $x = 1$, vale $\frac\pi4 + \frac\pi4 = \frac\pi2$.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-cad"); e.outerHTML = F.lab("Regra da cadeia: as taxas se multiplicam", "lab-cad"); SIM.cadeia(document.getElementById("lab-cad"), F); },
});
