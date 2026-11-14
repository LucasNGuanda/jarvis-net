/* CI08 · Integral indefinida e substituição. Conferido com sympy (scratchpad ci2.py):
   ∫x√(1 + x²) = (1 + x²)^(3/2)/3; ∫₀¹xe^(x²) = (e − 1)/2 ≈ 0,8591; ∫tg x = −ln|cos x|; ∫₀^(π/2) sen³x cos x = 1/4;
   ∫₀^(π/2) sen x/(sen x + cos x) = π/4; ∫dx/(1 + eˣ) = x − ln(1 + eˣ). */
F.registrar("CI08", {
  retoma: ["CI07"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Substituição passo a passo",
      casos: [
        { nome: "∫ (ax + b)ⁿ dx", gerar: (p) => {
          const a = p ? 3 : F.escolha([2, 3, 5]), b = p ? -1 : F.escolha([-1, 1, 4]), n = p ? 5 : F.escolha([3, 4, 5, 9]);
          const ab = `${F.c(a)}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
          return { enun: R`<p>Calcule $\displaystyle\int(${ab})^{${n}}\,dx$.</p>`, fig: "",
            passos: [
              R`<p>Chame o "miolo" de $u = ${ab}$. Então $du = ${a}\,dx$, ou seja, $dx = \frac{du}{${a}}$.</p>`,
              R`$$\int u^{${n}}\,\frac{du}{${a}} = \frac{1}{${a}}\cdot\frac{u^{${n + 1}}}{${n + 1}} + C$$`,
              R`<p>Volte para $x$: $\dfrac{(${ab})^{${n + 1}}}{${a * (n + 1)}} + C$. Confira derivando (cadeia): sai $\frac{${n + 1}(\ldots)^{${n}}\cdot${a}}{${a * (n + 1)}} = (${ab})^{${n}}$ ✓.</p>`,
            ] };
        } },
        { nome: "∫ x·(x² + c)ⁿ dx", gerar: (p) => {
          const c = p ? 1 : F.escolha([1, 4, 9]), n = p ? 3 : F.escolha([2, 3, 4]);
          return { enun: R`<p>Calcule $\displaystyle\int x\,(x^2 + ${c})^{${n}}\,dx$.</p>`, fig: "",
            passos: [
              R`<p>O $x$ solto na frente é (quase) a derivada do miolo $x^2 + ${c}$. É o sinal de que substituição funciona: $u = x^2 + ${c}$, $du = 2x\,dx$, então $x\,dx = \frac{du}{2}$.</p>`,
              R`$$\int u^{${n}}\,\frac{du}{2} = \frac{u^{${n + 1}}}{${2 * (n + 1)}} + C = \frac{(x^2 + ${c})^{${n + 1}}}{${2 * (n + 1)}} + C$$`,
              R`<p>Sem o $x$ na frente, $\int(x^2 + ${c})^{${n}}dx$ não sai por substituição (teria de expandir).</p>`,
            ] };
        } },
        { nome: "Definida, trocando os limites", gerar: (p) => {
          const k = p ? 2 : F.escolha([1, 2, 3]);
          const v = (Math.exp(k) - 1) / (2 * k);
          return { enun: R`<p>Calcule $\displaystyle\int_0^1x\,e^{${k === 1 ? "" : k}x^2}\,dx$.</p>`, fig: "",
            passos: [
              R`<p>$u = ${k === 1 ? "" : k}x^2$, $du = ${2 * k}x\,dx$. <b>Troque os limites junto:</b> $x = 0 \Rightarrow u = 0$; $x = 1 \Rightarrow u = ${k}$.</p>`,
              R`$$\int_0^{${k}}e^u\,\frac{du}{${2 * k}} = \frac{1}{${2 * k}}\left[e^u\right]_0^{${k}} = \frac{${k === 1 ? "e" : `e^{${k}}`} - 1}{${2 * k}} \approx ${F.n(v, 4)}$$`,
              R`<p>Trocando os limites, não precisa voltar para $x$. O erro clássico é trocar a variável e esquecer os limites.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A simetria que resolve sozinha",
      enun: R`<p>Calcule $\displaystyle I = \int_0^{\pi/2}\frac{\operatorname{sen}x}{\operatorname{sen}x + \cos x}\,dx$. Nenhuma primitiva "óbvia" funciona; use uma substituição esperta.</p><p>Bônus: calcule $\int\frac{dx}{1 + e^x}$.</p>`,
      fig: "",
      dicas: [R`<p>Troque $x = \frac\pi2 - u$. O que acontece com o seno e o cosseno? E com os limites?</p>`, R`<p>Você vai obter outra integral $J$ com $\cos$ em cima. Some $I + J$.</p>`],
      sol: R`<p>(i) Com $x = \frac\pi2 - u$: $\operatorname{sen}x = \cos u$, $\cos x = \operatorname{sen}u$, $dx = -du$, e os limites trocam ($0 \leftrightarrow \frac\pi2$). O sinal de $-du$ desvira os limites: $I = \int_0^{\pi/2}\frac{\cos u}{\cos u + \operatorname{sen}u}du = J$.</p>
        <p>(ii) $I + J = \int_0^{\pi/2}\frac{\operatorname{sen}x + \cos x}{\operatorname{sen}x + \cos x}dx = \frac\pi2$.</p>
        <p>(iii) Como $I = J$: $I = \frac\pi4$ ∎. Conferi numericamente.</p>
        <p><b>Bônus:</b> multiplique em cima e embaixo por $e^{-x}$: $\int\frac{e^{-x}}{e^{-x} + 1}dx$. Com $u = e^{-x} + 1$, $du = -e^{-x}dx$: $-\ln(1 + e^{-x}) + C$, que é o mesmo que $x - \ln(1 + e^x) + C$.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 1 · 8</div>
        <div class="q">Se a aceleração é constante, de onde vem o "½" do $\frac12at^2$?</div>
        <p>De integrar duas vezes: $a \to v = v_0 + at \to x = x_0 + v_0t + \frac12at^2$. As constantes $v_0$ e $x_0$ são os "+ C". Este tema ensina a achar primitivas, que pelo TFC é o mesmo que calcular integrais.</p></div>`),

      F.secao("indefinida", "A integral indefinida", R`
        ${F.formula(R`\int f(x)\,dx = F(x) + C\quad\iff\quad F'(x) = f(x)`, "Integral indefinida (primitiva)")}
        <p>Ela é uma <b>família</b> de funções: se $F$ é primitiva, $F + 7$ também é (a derivada de uma constante é zero). E não há outras: duas primitivas da mesma função diferem por uma constante (consequência do TVM ${F.ret("CI05")}). O $C$ se resolve com uma <b>condição inicial</b>, como a posição em $t = 0$.</p>
        <div id="lab-pri"></div>
        <table class="tb"><tr><th>f(x)</th><th>∫f dx</th><th>f(x)</th><th>∫f dx</th></tr>
          <tr><td>$x^n$ ($n \neq -1$)</td><td>$\frac{x^{n+1}}{n+1} + C$</td><td>$\frac1x$</td><td>$\ln|x| + C$</td></tr>
          <tr><td>$e^{kx}$</td><td>$\frac{e^{kx}}{k} + C$</td><td>$a^x$</td><td>$\frac{a^x}{\ln a} + C$</td></tr>
          <tr><td>$\operatorname{sen}kx$</td><td>$-\frac{\cos kx}{k} + C$</td><td>$\cos kx$</td><td>$\frac{\operatorname{sen}kx}{k} + C$</td></tr>
          <tr><td>$\frac{1}{1 + x^2}$</td><td>$\arctan x + C$</td><td>$\frac{1}{\sqrt{1 - x^2}}$</td><td>$\arcsin x + C$</td></tr></table>
        <p>Por que $\ln|x|$ e não $\ln x$? Para $x < 0$, $(\ln(-x))' = \frac{-1}{-x} = \frac1x$ também. O módulo cobre os dois lados.</p>`),

      F.secao("muv", "O MUV inteiro, de uma vez", R`
        ${F.demo("integrando a aceleração", R`<p>(i) $\frac{dv}{dt} = a$ (constante). Integrando: $v(t) = at + C_1$. Em $t = 0$, $v = v_0$, então $C_1 = v_0$: $v = v_0 + at$.</p>
          <p>(ii) $\frac{dx}{dt} = v_0 + at$. Integrando: $x(t) = v_0t + \frac12at^2 + C_2$, e $C_2 = x_0$:</p>
          ${F.formula(R`x(t) = x_0 + v_0t + \tfrac12at^2`)}
          <p>(iii) Torricelli, pela regra da cadeia: $a = \frac{dv}{dt} = \frac{dv}{dx}\frac{dx}{dt} = v\frac{dv}{dx}$. Então $\int a\,dx = \int v\,dv$, ou seja, $a\Delta x = \frac{v^2 - v_0^2}{2}$ ✓.</p>`)}
        <p>Mesma ideia para qualquer força que dependa só do tempo. Se depender da velocidade (arrasto) ou da posição (mola), vira uma <b>equação diferencial</b> ${F.ret("CII08")}.</p>`),

      F.secao("substituicao", "Substituição: a cadeia ao contrário", R`
        ${F.formula(R`\int f\bigl(g(x)\bigr)\,g'(x)\,dx = \int f(u)\,du\qquad(u = g(x),\ du = g'(x)\,dx)`, "Regra da substituição")}
        <p>Ela é a regra da cadeia lida de trás para a frente: se $F' = f$, então $\bigl(F(g(x))\bigr)' = f(g(x))\,g'(x)$. A receita:</p>
        <p>(i) Procure um "miolo" $u = g(x)$ cuja derivada também aparece (a menos de uma constante). (ii) Troque tudo para $u$, inclusive o $dx$. (iii) Integre em $u$. (iv) Volte para $x$ (ou, numa integral definida, troque os limites).</p>
        <p>Exemplos: $\int2x\cos(x^2)dx = \operatorname{sen}(x^2) + C$; $\int\operatorname{tg}x\,dx = \int\frac{\operatorname{sen}x}{\cos x}dx = -\ln|\cos x| + C$ (com $u = \cos x$); $\int\frac{dx}{ax + b} = \frac1a\ln|ax + b| + C$.</p>
        ${F.caixa("pegadinha", R`<p>Toda a expressão tem de virar $u$. Em $\int x^2\cos(x^2)\,dx$, $u = x^2$ dá $du = 2x\,dx$ e sobra um $x$ solto: não funciona (essa integral nem tem primitiva elementar). Se sobrou $x$ depois de trocar, a substituição foi errada.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $\int(3x^2 - 4x + 5)\,dx$ e $\int\left(\frac2x + e^{-x}\right)dx$.</p>`, fig: "", dicas: [R`<p>Termo a termo.</p>`, R`<p>$\int e^{-x}dx = -e^{-x}$.</p>`], resp: R`$x^3 - 2x^2 + 5x + C$; $\ 2\ln|x| - e^{-x} + C$.`, sol: R`<p>Confira derivando. Uma constante só no final basta.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule $\int\cos(3x)\,dx$ e $\int\operatorname{sen}(\omega t + \varphi)\,dt$.</p>`, fig: "", dicas: [R`<p>$u = 3x$.</p>`, R`<p>$u = \omega t + \varphi$, $du = \omega\,dt$.</p>`], resp: R`$\frac{\operatorname{sen}3x}{3} + C$; $\ -\frac{\cos(\omega t + \varphi)}{\omega} + C$.`, sol: R`<p>O segundo dá a posição de um MHS a partir da velocidade: dividir por $\omega$ aparece toda vez.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Calcule $\int x\sqrt{1 + x^2}\,dx$.</p>`, fig: "", dicas: [R`<p>$u = 1 + x^2$.</p>`, R`<p>$\int\sqrt u\,\frac{du}2$.</p>`], resp: R`$\frac13(1 + x^2)^{3/2} + C$.`, sol: R`<p>$\frac12\cdot\frac{u^{3/2}}{3/2} = \frac{u^{3/2}}{3}$.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Calcule $\int_0^1x\,e^{x^2}dx$ e $\int_0^{\pi/2}\operatorname{sen}^3x\cos x\,dx$.</p>`, fig: "", dicas: [R`<p>Primeira: $u = x^2$.</p>`, R`<p>Segunda: $u = \operatorname{sen}x$; limites $0 \to 1$.</p>`], resp: R`$\frac{e - 1}{2} \approx 0{,}859$ e $\frac14$.`, sol: R`<p>$\frac12[e^u]_0^1$ e $\left[\frac{u^4}{4}\right]_0^1$.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma partícula tem $a(t) = 6t$ (m/s²), $v(0) = 2$ m/s e $x(0) = 1$ m. Ache $x(t)$ e a posição em $t = 2$ s.</p>`, fig: "", dicas: [R`<p>$v = 3t^2 + C_1$.</p>`, R`<p>$x = t^3 + 2t + C_2$.</p>`], resp: R`$x(t) = t^3 + 2t + 1$; $x(2) = 13$ m.`, sol: R`<p>$C_1 = 2$, $C_2 = 1$. Aceleração que cresce no tempo dá $t^3$: o "jerk" (derivada da aceleração) é 6 m/s³.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Um capacitor descarrega com corrente $i(t) = I_0e^{-t/\tau}$. Que carga sai dele entre $t = 0$ e $t \to \infty$? E até $t = \tau$?</p>`, fig: "", dicas: [R`<p>$Q = \int i\,dt$, com $\int e^{-t/\tau}dt = -\tau e^{-t/\tau}$.</p>`, R`<p>Até $\tau$: $I_0\tau(1 - e^{-1})$.</p>`], resp: R`Total $I_0\tau$; até $t = \tau$, $I_0\tau(1 - 1/e) \approx 63\%$ do total.`, sol: R`<p>$\int_0^Ti\,dt = I_0\tau\left(1 - e^{-T/\tau}\right)$. É de onde vem o "63% em uma constante de tempo" do circuito RC ${F.ret("C10b")}. (O limite $T \to \infty$ é uma integral imprópria, ${F.ret("CII02")}.)</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Calcule $\int\operatorname{tg}x\,dx$ e $\int\frac{\ln x}{x}\,dx$.</p>`, fig: "", dicas: [R`<p>$\operatorname{tg} = \frac{\operatorname{sen}}{\cos}$, $u = \cos x$.</p>`, R`<p>$u = \ln x$, $du = \frac{dx}x$.</p>`], resp: R`$-\ln|\cos x| + C$; $\ \frac{(\ln x)^2}{2} + C$.`, sol: R`<p>No primeiro, $du = -\operatorname{sen}x\,dx$ e fica $-\int\frac{du}u$. No segundo, $\int u\,du$.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-pri"); e.outerHTML = F.lab("A família F(x) + C e o campo de direções", "lab-pri"); SIM.primitivas(document.getElementById("lab-pri"), F); },
});
