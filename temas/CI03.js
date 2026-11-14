/* CI03 · Derivada: definição e significado. Conferido com sympy (scratchpad ci.py): √4,1 ≈ 2,02485 (aprox. 2,025); f(x) = x² sen(1/x) tem f′(0) = 0. */
F.registrar("CI03", {
  retoma: ["CI01", "CI02"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Derivada pela definição",
      casos: [
        { nome: "ax² + bx + c", gerar: (p) => {
          const a = p ? 3 : F.escolha([1, 2, 3, -1, 5]), b = p ? -2 : F.escolha([-4, -2, 1, 3]), c = p ? 1 : F.escolha([0, 1, 5]), x0 = p ? 2 : F.escolha([-1, 1, 2, 3]);
          const fx = (x) => a * x * x + b * x + c, d = 2 * a * x0 + b, sg = (v) => (v < 0 ? "-" : "+");
          const pol = `${a === 1 ? "" : a === -1 ? "-" : a}x^2 ${b < 0 ? "-" : "+"} ${F.c(Math.abs(b))}x${c ? " + " + c : ""}`;
          return { enun: R`<p>Use a definição para calcular $f'(${x0})$, com $f(x) = ${pol}$.</p>`, fig: "",
            passos: [
              R`$$f'(${x0}) = \lim_{h\to0}\frac{f(${x0} + h) - f(${x0})}{h}$$<p>Calcule $f(${x0}) = ${fx(x0)}$.</p>`,
              R`<p>Expanda $f(${x0} + h) = ${F.c(a)}(${x0} + h)^2 ${b < 0 ? "-" : "+"} ${F.c(Math.abs(b))}(${x0} + h)${c ? " + " + c : ""} = ${fx(x0)} ${sg(d)} ${F.c(Math.abs(d))}h ${sg(a)} ${F.c(Math.abs(a))}h^2$ (confira!).</p>`,
              R`<p>Subtraia $f(${x0})$ e divida por $h$: $\frac{${F.c(d)}h ${sg(a)} ${F.c(Math.abs(a))}h^2}{h} = ${d} ${sg(a)} ${F.c(Math.abs(a))}h$. O $h$ de baixo sumiu: acabou a indeterminação.</p>`,
              R`<p>$h \to 0$: $f'(${x0}) = ${d}$. Atalho (próximo tema): $f'(x) = ${2 * a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}$, e em $x = ${x0}$ dá ${d} ✓. A reta tangente é $y = ${fx(x0)} ${d < 0 ? "-" : "+"} ${F.c(Math.abs(d))}(x ${x0 < 0 ? "+" : "-"} ${Math.abs(x0)})$.</p>`,
            ] };
        } },
        { nome: "Aproximação linear de √", gerar: (p) => {
          const n = p ? 4 : F.escolha([4, 9, 16, 25, 36, 49]), dx = p ? 0.1 : F.escolha([0.1, 0.2, 0.5, -0.3]), r = Math.sqrt(n), ap = r + dx / (2 * r), ex = Math.sqrt(n + dx);
          return { enun: R`<p>Estime $\sqrt{${F.n(n + dx, 1)}}$ sem calculadora.</p>`, fig: "",
            passos: [
              R`<p>Perto de um ponto, uma função derivável é quase a sua reta tangente: $f(a + h) \approx f(a) + f'(a)\,h$. Use $f(x) = \sqrt x$, $a = ${n}$ (raiz exata) e $h = ${F.n(dx, 1)}$.</p>`,
              R`<p>$f'(x) = \frac{1}{2\sqrt x}$ (pela definição, com o conjugado, como no exemplário de CI01). Então $f'(${n}) = \frac{1}{${2 * r}}$.</p>`,
              R`$$\sqrt{${F.n(n + dx, 1)}} \approx ${r} + \frac{${F.n(dx, 1)}}{${2 * r}} = ${F.n(ap, 5)}$$<p>Valor verdadeiro: $${F.n(ex, 5)}$. Erro: $${F.n(Math.abs(ap - ex), 5)}$, que cresce como $h^2$ (a curvatura que a reta ignora).</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A derivada que existe mas não é contínua",
      enun: R`<p>Seja $f(x) = x^2\operatorname{sen}\frac1x$ para $x \neq 0$ e $f(0) = 0$.</p><p>(a) Prove que $f$ é derivável em $x = 0$ e calcule $f'(0)$. (b) Calcule $f'(x)$ para $x \neq 0$. (c) Mostre que $\lim_{x\to0}f'(x)$ <b>não existe</b>. Conclusão: uma função pode ter derivada em todo ponto e essa derivada não ser contínua.</p>`,
      fig: "",
      dicas: [R`<p>(a) Use a definição: $\frac{f(h) - f(0)}{h} = h\operatorname{sen}\frac1h$. Já viu esse limite em CI02.</p>`, R`<p>(b) Produto e cadeia: $(x^2)'\operatorname{sen}\frac1x + x^2\cos\frac1x\cdot\left(-\frac1{x^2}\right)$.</p>`],
      sol: R`<p><b>(a)</b> $\frac{f(h) - 0}{h} = h\operatorname{sen}\frac1h$, e $|h\operatorname{sen}\frac1h| \leq |h| \to 0$. Logo $f'(0) = 0$.</p>
        <p><b>(b)</b> $f'(x) = 2x\operatorname{sen}\frac1x - \cos\frac1x$.</p>
        <p><b>(c)</b> O primeiro termo vai a 0, mas $\cos\frac1x$ oscila entre $-1$ e $1$ infinitas vezes perto de 0 (em $x = \frac{1}{2k\pi}$ vale 1; em $x = \frac{1}{(2k+1)\pi}$ vale $-1$). Então $f'(x)$ fica oscilando entre $\approx -1$ e $\approx 1$, e não tem limite ∎.</p>
        <p class="det" style="color:var(--ink2)">Mesmo assim, o teorema de Darboux garante que uma derivada nunca dá "salto": ela pode oscilar, mas tem a propriedade do valor intermediário. Coisas de Análise Real.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 1 · 3</div>
        <div class="q">O velocímetro lê 72 km/h. O que exatamente ele está medindo?</div>
        <p>A velocidade média num intervalo de tempo cada vez menor. O limite dessa média é a <b>derivada</b>: a taxa de variação instantânea. Newton a chamou de "fluxão" e a inventou justamente para fazer física.</p></div>`),

      F.secao("definicao", "A definição", R`
        <p>Velocidade média entre $t$ e $t + h$: $\frac{x(t + h) - x(t)}{h}$. Fazendo $h \to 0$:</p>
        ${F.formula(R`f'(a) = \lim_{h\to0}\frac{f(a + h) - f(a)}{h}`, "Derivada de f no ponto a")}
        <p>Geometricamente, a fração é a inclinação da reta <b>secante</b> que liga $(a, f(a))$ a $(a + h, f(a + h))$. Quando $h \to 0$, a secante gira até virar a <b>tangente</b>. A derivada é a inclinação da tangente.</p>
        <p><b>Notações:</b> $f'(x)$ (Lagrange), $\frac{df}{dx}$ (Leibniz: "um pedacinho de $f$ sobre um pedacinho de $x$"), $\dot x$ (Newton, para derivada em relação ao tempo, a que aparece nas lagrangianas dos experimentos).</p>
        <div id="lab-sec"></div>`),

      F.secao("calculos", "As primeiras derivadas, da definição", R`
        ${F.demo("f(x) = xⁿ, com n = 2 e n = 3", R`<p>(i) $n = 2$: $\frac{(x+h)^2 - x^2}{h} = \frac{2xh + h^2}{h} = 2x + h \to 2x$.</p>
          <p>(ii) $n = 3$: $(x + h)^3 = x^3 + 3x^2h + 3xh^2 + h^3$, então a fração é $3x^2 + 3xh + h^2 \to 3x^2$.</p>
          <p>(iii) Padrão (binômio de Newton): $(x+h)^n = x^n + nx^{n-1}h + (\text{termos com } h^2)$, então $(x^n)' = nx^{n-1}$.</p>`)}
        ${F.demo("f(x) = sen x", R`<p>(i) Pela fórmula da soma: $\operatorname{sen}(x + h) = \operatorname{sen}x\cos h + \cos x\operatorname{sen}h$.</p>
          <p>(ii) $\frac{\operatorname{sen}(x+h) - \operatorname{sen}x}{h} = \operatorname{sen}x\cdot\frac{\cos h - 1}{h} + \cos x\cdot\frac{\operatorname{sen}h}{h}$.</p>
          <p>(iii) Pelos limites fundamentais ${F.ret("CI02")}: $\frac{\cos h - 1}{h} \to 0$ e $\frac{\operatorname{sen}h}{h} \to 1$. Logo $(\operatorname{sen}x)' = \cos x$. Do mesmo jeito, $(\cos x)' = -\operatorname{sen}x$.</p>`)}
        ${F.demo("f(x) = eˣ", R`<p>$\frac{e^{x+h} - e^x}{h} = e^x\cdot\frac{e^h - 1}{h} \to e^x\cdot1$. A exponencial é a sua própria derivada: é isso que torna o $e$ especial (com outra base $a$, sai $(a^x)' = a^x\ln a$).</p>`)}
        <table class="tb"><tr><th>f(x)</th><td>$c$</td><td>$x^n$</td><td>$\operatorname{sen}x$</td><td>$\cos x$</td><td>$e^x$</td><td>$\ln x$</td><td>$\frac1x$</td><td>$\sqrt x$</td></tr>
          <tr><th>f′(x)</th><td>$0$</td><td>$nx^{n-1}$</td><td>$\cos x$</td><td>$-\operatorname{sen}x$</td><td>$e^x$</td><td>$\frac1x$</td><td>$-\frac1{x^2}$</td><td>$\frac1{2\sqrt x}$</td></tr></table>`),

      F.secao("fisica", "O que a derivada é, na física", R`
        <table class="tb"><tr><th>derivada</th><th>significado</th></tr>
          <tr><td>$v = \frac{dx}{dt}$, $\ a = \frac{dv}{dt} = \frac{d^2x}{dt^2}$</td><td>cinemática</td></tr>
          <tr><td>$i = \frac{dq}{dt}$</td><td>corrente é a taxa de passagem de carga ${F.ret("C06")}</td></tr>
          <tr><td>$P = \frac{dW}{dt}$</td><td>potência</td></tr>
          <tr><td>$F = -\frac{dU}{dx}$</td><td>força a partir da energia potencial: aponta "ladeira abaixo"</td></tr>
          <tr><td>$\varepsilon = -\frac{d\Phi_B}{dt}$</td><td>lei de Faraday ${F.ret("C15")}</td></tr>
          <tr><td>$E = -\frac{dV}{dx}$</td><td>campo elétrico a partir do potencial ${F.ret("C04")}</td></tr></table>
        ${F.demo("o MHS sai de duas derivadas", R`<p>(i) $x(t) = A\cos(\omega t)$. Derivando (com a regra da cadeia, próximo tema): $v = -A\omega\operatorname{sen}(\omega t)$.</p>
          <p>(ii) Derivando de novo: $a = -A\omega^2\cos(\omega t) = -\omega^2x$.</p>
          <p>(iii) Com $F = ma = -kx$: $-m\omega^2x = -kx \Rightarrow \omega = \sqrt{k/m}$. A fórmula do período da mola, $T = 2\pi\sqrt{m/k}$, é uma conta de derivada.</p>`)}`),

      F.secao("derivavel", "Derivável × contínua", R`
        <p><b>Derivável implica contínua:</b> $f(a + h) - f(a) = \frac{f(a+h) - f(a)}{h}\cdot h \to f'(a)\cdot0 = 0$. Então $f(a + h) \to f(a)$ ∎.</p>
        <p><b>A volta é falsa:</b> $|x|$ é contínua em 0, mas pela direita a secante tem inclinação $+1$ e pela esquerda $-1$ (teste no laboratório com "h negativo"). Em "bicos", não existe tangente. Weierstrass construiu, em 1872, uma função contínua <i>em todo lugar</i> e derivável <i>em lugar nenhum</i>: um bico em cada ponto. O movimento browniano tem trajetórias assim.</p>
        <h3>O gráfico de f′ conta a história de f</h3>
        <p>$f' > 0$: $f$ cresce. $f' < 0$: decresce. $f' = 0$: tangente horizontal (candidato a máximo ou mínimo, ${F.ret("CI05")}). No laboratório, o gráfico de baixo é $f'$: compare onde ele cruza o zero com os topos e vales de cima.</p>
        <h3>Aproximação linear</h3>
        ${F.formula(R`f(a + h) \approx f(a) + f'(a)\,h\qquad(h \text{ pequeno})`)}
        <p>É a ideia de "diferencial": $df = f'(x)\,dx$. É como os físicos propagam erros e fazem quase toda aproximação ${F.ret("F05")}.</p>`),

      F.secao("exemplos", "Exemplos", exemplario),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Pela definição, calcule a derivada de $f(x) = \frac1x$.</p>`, fig: "", dicas: [R`<p>$\frac1{x+h} - \frac1x = \frac{x - (x+h)}{x(x+h)}$.</p>`, R`<p>Sobra $\frac{-1}{x(x+h)}$.</p>`], resp: R`$f'(x) = -\frac1{x^2}$.`, sol: R`<p>$\frac{-h}{x(x+h)h} = \frac{-1}{x(x+h)} \to -\frac1{x^2}$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Uma pedra cai com $y(t) = 80 - 4{,}9t^2$ (m). Qual a velocidade em $t = 2$ s? E a aceleração?</p>`, fig: "", dicas: [R`<p>$v = \dot y$.</p>`, R`<p>$a = \dot v$.</p>`], resp: R`$v(2) = -19{,}6$ m/s; $a = -9{,}8$ m/s².`, sol: R`<p>$\dot y = -9{,}8t$, $\ddot y = -9{,}8$. O sinal negativo é "para baixo".</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Ache a reta tangente a $y = x^3$ em $x = 1$. Onde ela corta de novo a curva?</p>`, fig: "", dicas: [R`<p>$y' = 3x^2$; no ponto $(1, 1)$, inclinação 3.</p>`, R`<p>Resolva $x^3 = 3x - 2$; já sabe que $x = 1$ é raiz (dupla!).</p>`], resp: R`$y = 3x - 2$; corta de novo em $(-2, -8)$.`, sol: R`<p>$x^3 - 3x + 2 = (x - 1)^2(x + 2)$. A raiz dupla em 1 é a tangência; a outra é $x = -2$. Tangente não quer dizer "toca num ponto só".</p>` }),
        F.exercicio({ n: 4, enun: R`<p>A energia potencial de uma partícula é $U(x) = 2x^2 - x^4$ (J, com $x$ em m). Qual a força em $x = 0{,}5$ m? Onde estão os pontos de equilíbrio?</p>`, fig: "", dicas: [R`<p>$F = -U'(x)$.</p>`, R`<p>Equilíbrio: $F = 0$.</p>`], resp: R`$F(0{,}5) = -1{,}5$ N; equilíbrio em $x = 0$ e $x = \pm1$.`, sol: R`<p>$U' = 4x - 4x^3$, então $F = -4x + 4x^3$, e $F(0{,}5) = -2 + 0{,}5 = -1{,}5$ N (puxa de volta para 0). $F = 0 \iff x(x^2 - 1) = 0$. Em $x = 0$, $U$ tem um vale (estável); em $\pm1$, picos (instáveis).</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Estime $\sqrt{26}$ e $\operatorname{sen}(0{,}1)$ por aproximação linear. Compare com a calculadora.</p>`, fig: "", dicas: [R`<p>$\sqrt{25 + 1} \approx 5 + \frac{1}{10}$.</p>`, R`<p>Perto de 0, $\operatorname{sen}x \approx x$.</p>`], resp: R`$\sqrt{26} \approx 5{,}1$ (real $5{,}0990$); $\operatorname{sen}0{,}1 \approx 0{,}1$ (real $0{,}09983$).`, sol: R`<p>Erros de $0{,}001$ e $0{,}00017$: pequenos porque $h$ é pequeno e o erro vai com $h^2$ (no seno, com $h^3$, porque o termo $h^2$ é zero).</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Para que valores de $a$ e $b$ a função $f(x) = \begin{cases}x^2, & x \leq 1\\ ax + b, & x > 1\end{cases}$ é derivável em $x = 1$?</p>`, fig: "", dicas: [R`<p>Primeiro, precisa ser contínua: $a + b = 1$.</p>`, R`<p>As derivadas laterais precisam bater: $2 = a$.</p>`], resp: R`$a = 2$, $b = -1$.`, sol: R`<p>Continuidade: $1 = a + b$. Derivadas laterais: $2\cdot1 = a$. Então $b = -1$: a reta é exatamente a tangente à parábola em $x = 1$, e a "emenda" não tem bico.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Uma esfera de raio $r$ tem volume $V = \frac43\pi r^3$. Calcule $\frac{dV}{dr}$. Que figura geométrica é essa derivada? Explique por quê.</p>`, fig: "", dicas: [R`<p>$\frac{dV}{dr} = 4\pi r^2$.</p>`, R`<p>Aumentar o raio em $dr$ acrescenta uma casca fina.</p>`], resp: R`$4\pi r^2$, a área da superfície.`, sol: R`<p>$dV \approx (\text{área})\times dr$: o volume novo é uma casca de espessura $dr$. Do mesmo jeito, $\frac{d}{dr}(\pi r^2) = 2\pi r$ (o perímetro). É o mesmo truque das cascas no chefão da gama ${F.ret("CE02")}.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-sec"); e.outerHTML = F.lab("Da secante à tangente, e o gráfico de f′", "lab-sec"); SIM.secante(document.getElementById("lab-sec"), F); },
});
