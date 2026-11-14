/* CII08 · Equações diferenciais ordinárias. Conferido com sympy/scipy (scratchpad cii2.py):
   café 90 °C → 70 °C em 5 min (ambiente 20 °C): k = 0,0673/min, chega a 40 °C em 18,6 min; y″ + 2y′ + 5y = 0 → e^(−t)(A cos 2t + B sen 2t);
   paraquedista m = 80 kg, c = 0,25 kg/m: v_t = 56 m/s, 90% em 8,41 s (conferido com integração numérica); Euler com h = 0,5 em y′ = y: 2,25 contra e. */
F.registrar("CII08", {
  retoma: ["CI08", "CII01"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Resolvendo EDOs",
      casos: [
        { nome: "Lei do resfriamento", gerar: (p) => {
          const Ta = p ? 20 : F.escolha([15, 20, 25]), T0 = p ? 90 : F.escolha([80, 90, 100]), T1 = p ? 70 : T0 - F.escolha([10, 15, 20]), t1 = p ? 5 : F.escolha([4, 5, 10]), Tf = p ? 40 : Ta + F.escolha([15, 20, 25]);
          const k = Math.log((T0 - Ta) / (T1 - Ta)) / t1, tf = Math.log((T0 - Ta) / (Tf - Ta)) / k;
          return { enun: R`<p>Um café a ${T0} °C, numa sala a ${Ta} °C, esfria para ${T1} °C em ${t1} min. Quando chega a ${Tf} °C? (Lei de Newton: $\frac{dT}{dt} = -k(T - T_a)$.)</p>`, fig: "",
            passos: [
              R`<p>Separe as variáveis, com $u = T - ${Ta}$: $\frac{du}{u} = -k\,dt \Rightarrow \ln|u| = -kt + C \Rightarrow T(t) = ${Ta} + ${T0 - Ta}\,e^{-kt}$.</p>`,
              R`<p>Ache $k$ com o dado: $${T1} = ${Ta} + ${T0 - Ta}e^{-${t1}k} \Rightarrow k = \frac{1}{${t1}}\ln\frac{${T0 - Ta}}{${T1 - Ta}} \approx ${F.n(k, 4)}$ por minuto.</p>`,
              R`<p>$${Tf} = ${Ta} + ${T0 - Ta}e^{-kt} \Rightarrow t = \frac1k\ln\frac{${T0 - Ta}}{${Tf - Ta}} \approx ${F.n(tf, 1)}$ min.</p>`,
            ] };
        } },
        { nome: "Equação característica", gerar: (p) => {
          const op = p ? 2 : F.escolha([0, 1, 2]);
          const [b, c] = op === 0 ? [0, 0] : op === 1 ? [F.escolha([2, 4, 6]), 0] : F.escolha([[2, 5], [4, 13], [4, 5], [2, 10]]);
          let B, C;
          if (op === 0) { const r1 = F.escolha([-1, -2, 1]), r2 = F.escolha([-3, -4, 2].filter((v) => v !== r1)); B = -(r1 + r2); C = r1 * r2; }
          else if (op === 1) { const r = -b / 2; B = b; C = r * r; } else { B = b; C = c; }
          const D = B * B - 4 * C, eq = `y'' ${B < 0 ? "-" : "+"} ${F.c(Math.abs(B))}y' ${C < 0 ? "-" : "+"} ${Math.abs(C)}y = 0`.replace(" + 0y' ", " ");
          let sol;
          if (D > 0) { const r1 = (-B + Math.sqrt(D)) / 2, r2 = (-B - Math.sqrt(D)) / 2; sol = R`<p>$\Delta = ${D} > 0$: raízes reais $r = ${r1}$ e $r = ${r2}$. Solução: $y = Ae^{${F.c(r1)}t} + Be^{${F.c(r2)}t}$ (sem oscilar).</p>`; }
          else if (D === 0) { const r = -B / 2; sol = R`<p>$\Delta = 0$: raiz dupla $r = ${r}$. Solução: $y = (A + Bt)e^{${F.c(r)}t}$ (o caso crítico: o $t$ extra aparece porque falta uma segunda exponencial).</p>`; }
          else { const al = -B / 2, w = Math.sqrt(-D) / 2; sol = R`<p>$\Delta = ${D} < 0$: raízes complexas $r = ${al} \pm ${F.c(w)}i$. Pela fórmula de Euler ${F.ret("CII04")}: $y = e^{${F.c(al)}t}\left(A\cos ${F.c(w)}t + B\operatorname{sen}${F.c(w)}t\right)$: oscilação que ${al < 0 ? "morre" : "cresce"}.</p>`; }
          return { enun: R`<p>Resolva $${eq}$.</p>`, fig: "",
            passos: [
              R`<p>Coeficientes constantes: chute $y = e^{rt}$. Como $y' = ry$ e $y'' = r^2y$, a equação vira $\left(r^2 ${B < 0 ? "-" : "+"} ${F.c(Math.abs(B))}r ${C < 0 ? "-" : "+"} ${Math.abs(C)}\right)e^{rt} = 0$.`.replace(" + 0r ", " ") + "</p>",
              R`<p>Equação característica: $r^2 ${B < 0 ? "-" : "+"} ${F.c(Math.abs(B))}r ${C < 0 ? "-" : "+"} ${Math.abs(C)} = 0$.`.replace(" + 0r ", " ") + "</p>",
              sol,
              R`<p>$A$ e $B$ saem das condições iniciais $y(0)$ e $y'(0)$: uma equação de 2ª ordem precisa de dois dados (posição e velocidade iniciais, como na 2ª lei de Newton).</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O paraquedista com arrasto quadrático",
      enun: R`<p>Um paraquedista de 80 kg cai com arrasto $F = cv^2$, $c = 0{,}25$ kg/m (antes de abrir o paraquedas). $g = 9{,}8$ m/s².</p><p>(a) Escreva a EDO e ache a velocidade terminal. (b) Resolva a EDO (saindo do repouso) e mostre que $v(t) = v_t\tanh\frac{gt}{v_t}$. (c) Em quanto tempo ele chega a 90% da terminal?</p>`,
      fig: "",
      dicas: [R`<p>$m\dot v = mg - cv^2$. Terminal: $\dot v = 0$.</p>`, R`<p>Separe: $\frac{dv}{v_t^2 - v^2} = \frac{g}{v_t^2}dt$, e use frações parciais ${F.ret("CII01")}: $\frac{1}{v_t^2 - v^2} = \frac{1}{2v_t}\left(\frac{1}{v_t - v} + \frac{1}{v_t + v}\right)$.</p>`],
      sol: R`<p><b>(a)</b> $\dot v = g - \frac cmv^2$. Terminal: $v_t = \sqrt{\frac{mg}{c}} = \sqrt{\frac{80\cdot9{,}8}{0{,}25}} = 56$ m/s (≈ 200 km/h).</p>
        <p><b>(b)</b> Com $\frac cm = \frac{g}{v_t^2}$: $\int\frac{dv}{v_t^2 - v^2} = \frac{g}{v_t^2}t$. O lado esquerdo dá $\frac{1}{2v_t}\ln\frac{v_t + v}{v_t - v}$. Então $\ln\frac{v_t + v}{v_t - v} = \frac{2gt}{v_t}$, e isolando $v$: $v = v_t\frac{e^{2gt/v_t} - 1}{e^{2gt/v_t} + 1} = v_t\tanh\frac{gt}{v_t}$ ∎.</p>
        <p><b>(c)</b> $\tanh u = 0{,}9 \Rightarrow u = \operatorname{arctanh}0{,}9 \approx 1{,}472$; $t = \frac{1{,}472\cdot56}{9{,}8} \approx 8{,}4$ s. Conferi integrando a EDO numericamente: em $t = 8{,}41$ s, $v = 0{,}900\,v_t$.</p>
        <p class="det" style="color:var(--ink2)">Com arrasto linear ($bv$), a resposta seria $v_t(1 - e^{-t/\tau})$ ${F.ret("CI01")}. O quadrático vale para corpos grandes e rápidos no ar; o linear, para corpos pequenos e lentos (gotículas, o experimento de Millikan).</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 2 · 8</div>
        <div class="q">$F = ma$ é uma equação. Qual é a incógnita?</div>
        <p>Não é um número: é uma <b>função</b>, a trajetória $x(t)$. Como $a = \ddot x$, a 2ª lei é uma equação que relaciona uma função com as suas derivadas: uma <b>equação diferencial</b>. Quase toda lei da física tem essa forma. Este tema é onde o Cálculo vira física de verdade.</p></div>`),

      F.secao("intro", "O que é uma EDO", R`
        <p>Uma EDO (equação diferencial ordinária) liga $y(t)$ às suas derivadas. A <b>ordem</b> é a da derivada mais alta. Resolver é achar todas as funções que a satisfazem; a resposta tem constantes livres (uma por ordem), fixadas pelas <b>condições iniciais</b>.</p>
        <table class="tb"><tr><th>equação</th><th>onde aparece</th><th>solução</th></tr>
          <tr><td>$\dot N = -\lambda N$</td><td>decaimento radioativo, descarga RC</td><td>$N_0e^{-\lambda t}$</td></tr>
          <tr><td>$\dot T = -k(T - T_a)$</td><td>resfriamento de Newton</td><td>$T_a + (T_0 - T_a)e^{-kt}$</td></tr>
          <tr><td>$m\dot v = mg - bv$</td><td>queda com arrasto linear</td><td>$v_t(1 - e^{-t/\tau})$</td></tr>
          <tr><td>$\ddot x = -\omega^2x$</td><td>MHS (mola, pêndulo pequeno, LC)</td><td>$A\cos(\omega t + \varphi)$</td></tr>
          <tr><td>$\ddot x + 2\gamma\dot x + \omega_0^2x = 0$</td><td>oscilador amortecido, RLC</td><td>laboratório 2</td></tr></table>
        <p><b>Existência e unicidade</b> (Picard): para $y' = f(t, y)$ com $f$ "boa", por cada ponto inicial passa <b>uma única</b> solução. As soluções nunca se cruzam. Por isso o futuro de um sistema mecânico é determinado pelo presente (posição e velocidade): é o determinismo de Laplace, e também a razão de o caos ser possível só a partir de 3 variáveis ${F.ret("EP02")}.</p>
        <div id="lab-edo"></div>`),

      F.secao("primeira", "Primeira ordem: separáveis e lineares", R`
        <p><b>Separável:</b> $\frac{dy}{dt} = g(t)h(y)$. Junte cada variável de um lado e integre: $\int\frac{dy}{h(y)} = \int g(t)\,dt$.</p>
        <p><b>Linear:</b> $y' + p(t)y = q(t)$. Truque do <b>fator integrante</b> $\mu = e^{\int p\,dt}$: multiplicando, o lado esquerdo vira $(\mu y)'$, e é só integrar.</p>
        ${F.demo("carga de um capacitor (RC)", R`<p>(i) Malha: $E = Ri + \frac qC$, com $i = \dot q$: $\dot q + \frac{1}{RC}q = \frac ER$.</p>
          <p>(ii) Fator integrante: $\mu = e^{t/RC}$. Então $\left(e^{t/RC}q\right)' = \frac ERe^{t/RC}$.</p>
          <p>(iii) Integrando: $e^{t/RC}q = CEe^{t/RC} + K$. Com $q(0) = 0$: $K = -CE$.</p>
          <p>(iv) $q(t) = CE\left(1 - e^{-t/RC}\right)$ ∎. A constante de tempo $\tau = RC$ aparece sozinha ${F.ret("C10b")}.</p>`)}
        ${F.caixa("ideia", R`<p><b>Método de Euler</b> (o do laboratório): $y_{n+1} = y_n + h\,f(t_n, y_n)$, andar em linha reta pela inclinação atual. Simples e com erro $\propto h$. Os experimentos do site usam o <b>Runge–Kutta de 4ª ordem</b> (RK4), que prova a inclinação em quatro pontos do passo e tem erro $\propto h^4$ ${F.ret("EP02")}.</p>`)}`),

      F.secao("segunda", "Segunda ordem: osciladores", R`
        ${F.formula(R`ay'' + by' + cy = 0\quad\xrightarrow{\ y = e^{rt}\ }\quad ar^2 + br + c = 0`, "Equação característica")}
        <p>Coeficientes constantes: o chute $e^{rt}$ transforma a EDO num polinômio. Raízes reais distintas: soma de exponenciais. Raiz dupla: $(A + Bt)e^{rt}$. Complexas $\alpha \pm i\omega$: $e^{\alpha t}(A\cos\omega t + B\operatorname{sen}\omega t)$, pela fórmula de Euler ${F.ret("CII04")}.</p>
        <div id="lab-osc"></div>
        ${F.demo("o oscilador amortecido", R`<p>(i) Massa $m$, mola $k$, atrito viscoso $b$: $m\ddot x = -kx - b\dot x$, ou $\ddot x + 2\gamma\dot x + \omega_0^2x = 0$ com $\gamma = \frac{b}{2m}$ e $\omega_0 = \sqrt{k/m}$.</p>
          <p>(ii) Característica: $r = -\gamma \pm \sqrt{\gamma^2 - \omega_0^2}$.</p>
          <p>(iii) $\gamma < \omega_0$ (sub): $x = Ae^{-\gamma t}\cos(\omega_dt + \varphi)$, com $\omega_d = \sqrt{\omega_0^2 - \gamma^2}$, um pouco mais lento que sem atrito.</p>
          <p>(iv) $\gamma = \omega_0$ (crítico): $(A + Bt)e^{-\omega_0t}$, o retorno mais rápido sem oscilar. $\gamma > \omega_0$ (super): duas exponenciais, retorno lento.</p>
          <p>(v) No circuito RLC, é a mesma equação com $L \leftrightarrow m$, $R \leftrightarrow b$, $\frac1C \leftrightarrow k$ ${F.ret("C15b")}.</p>`)}
        <p><b>Forçado e ressonância</b>: com uma força $F_0\cos\Omega t$, a resposta permanente tem amplitude $\frac{F_0/m}{\sqrt{(\omega_0^2 - \Omega^2)^2 + 4\gamma^2\Omega^2}}$, que dispara quando $\Omega \approx \omega_0$ e $\gamma$ é pequeno (balanço empurrado no ritmo certo, rádio sintonizando uma estação). A ressonância paramétrica do experimento da mola com pêndulo é um primo disso ${F.ret("EP04")}.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Resolva $y' = 3y$, com $y(0) = 2$. Depois, resolva $y' = 3y + 6$ com o mesmo valor inicial.</p>`, fig: "", dicas: [R`<p>Separável: $\frac{dy}{y} = 3\,dt$.</p>`, R`<p>No segundo, $u = y + 2$ satisfaz $u' = 3u$.</p>`], resp: R`$y = 2e^{3t}$; $\ y = 4e^{3t} - 2$.`, sol: R`<p>No segundo, $u(0) = 4$, $u = 4e^{3t}$, $y = u - 2$. O "+6" só desloca o ponto de equilíbrio para $y = -2$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Um café a 90 °C numa sala a 20 °C esfria para 70 °C em 5 minutos. Quando chega a 40 °C?</p>`, fig: "", dicas: [R`<p>$T = 20 + 70e^{-kt}$; $50 = 70e^{-5k}$.</p>`, R`<p>$20 = 70e^{-kt}$.</p>`], resp: R`$k \approx 0{,}0673$/min; $t \approx 18{,}6$ min.`, sol: R`<p>$k = \frac15\ln\frac75$, $t = \frac{\ln3{,}5}{k} \approx 18{,}6$ min. Repare: de 90 para 70 levou 5 min; de 70 para 40, mais 13,6, porque a diferença para o ambiente diminuiu.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Resolva $y'' + 4y = 0$ com $y(0) = 1$ e $y'(0) = 0$. Qual o período?</p>`, fig: "", dicas: [R`<p>$r^2 + 4 = 0$, $r = \pm2i$.</p>`, R`<p>$y = A\cos2t + B\operatorname{sen}2t$.</p>`], resp: R`$y = \cos2t$; período $\pi$.`, sol: R`<p>$A = 1$ e $B = 0$. É um MHS com $\omega = 2$.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Resolva $y'' + 2y' + 5y = 0$. Como é o movimento?</p>`, fig: "", dicas: [R`<p>$r^2 + 2r + 5 = 0$.</p>`, R`<p>$r = -1 \pm 2i$.</p>`], resp: R`$y = e^{-t}(A\cos2t + B\operatorname{sen}2t)$: oscilação amortecida.`, sol: R`<p>Subamortecido: $\gamma = 1 < \omega_0 = \sqrt5$. O envelope $e^{-t}$ cai pela metade a cada $\ln2 \approx 0{,}69$ s.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma massa de 1 kg numa mola de $k = 16$ N/m. Qual o $b$ (amortecimento) para o regime crítico? E o tempo característico de volta?</p>`, fig: "", dicas: [R`<p>Crítico: $\gamma = \omega_0$, com $\gamma = \frac{b}{2m}$.</p>`, R`<p>$\omega_0 = 4$ rad/s.</p>`], resp: R`$b = 8$ kg/s; tempo $\sim\frac{1}{\omega_0} = 0{,}25$ s.`, sol: R`<p>$b = 2m\omega_0 = 8$. Teste no laboratório 2 com $\omega_0 = 4$ e o botão "crítico".</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Use o método de Euler com $h = 0{,}5$ para estimar $y(1)$ em $y' = y$, $y(0) = 1$. Compare com o exato. Repita com $h = 0{,}25$.</p>`, fig: "", dicas: [R`<p>Cada passo multiplica por $(1 + h)$.</p>`, R`<p>Com $h = 0{,}5$: $1{,}5^2$.</p>`], resp: R`$2{,}25$ e $2{,}441$, contra $e \approx 2{,}718$.`, sol: R`<p>$(1 + h)^{1/h}$: com $h \to 0$, isso tende a $e$, o limite fundamental de CI02! Os erros, 0,47 e 0,28, caem mais ou menos pela metade quando $h$ cai pela metade.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Resolva $\dot v = g - \frac{b}{m}v$ (queda com arrasto linear) com $v(0) = 0$, e ache a velocidade terminal e a constante de tempo.</p>`, fig: "", dicas: [R`<p>Linear: $\dot v + \frac bmv = g$; fator integrante $e^{bt/m}$.</p>`, R`<p>Ou: $u = v - \frac{mg}{b}$ satisfaz $\dot u = -\frac bmu$.</p>`], resp: R`$v = \frac{mg}{b}\left(1 - e^{-bt/m}\right)$; $v_t = \frac{mg}b$, $\tau = \frac mb$.`, sol: R`<p>A mesma forma da carga do capacitor: $v_t \leftrightarrow CE$ e $\tau = \frac mb \leftrightarrow RC$. Matematicamente, é a mesma equação.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) {
    let e = document.getElementById("lab-edo"); e.outerHTML = F.lab("Campo de direções e o método de Euler", "lab-edo"); SIM.edo1(document.getElementById("lab-edo"), F);
    e = document.getElementById("lab-osc"); e.outerHTML = F.lab("Oscilador amortecido: os três regimes", "lab-osc"); SIM.oscilador(document.getElementById("lab-osc"), F);
  },
});
