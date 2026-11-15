/* TE05 · Teorema de Noether. Conferido em Python (RK4): carga num campo B uniforme com A = (−By/2, Bx/2, 0):
   o momento angular canônico m(xẏ − yẋ) + (qB/2)(x² + y²) fica constante (2,1000 → 2,1000), o mecânico não (1,1 → −1,96).
   No laboratório: V = −k/r conserva E e L; V = ½(x² + 4y²) só E; V = gy conserva E e pₓ; V = −k(t)/r só L. */
F.registrar("matematica/TE05", {
  retoma: ["TE01", "fisica/U03", "fisica/U04"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Simetria → conservação",
      casos: [
        { nome: "Qual grandeza se conserva?", gerar: (p) => {
          const L = [
            [R`L = \tfrac12m(\dot x^2 + \dot y^2) - mgy`, "não depende de $x$ (translação em $x$) nem de $t$", R`$p_x = m\dot x$ e a energia $E = \frac12mv^2 + mgy$`, "um projétil: a velocidade horizontal fica constante"],
            [R`L = \tfrac12m(\dot r^2 + r^2\dot\varphi^2) + \frac{k}{r}`, "não depende de $\\varphi$ (rotação) nem de $t$", R`$L_z = mr^2\dot\varphi$ e a energia`, "a órbita de Kepler: 2ª lei (áreas iguais) e energia"],
            [R`L = \tfrac12m\dot x^2 - \tfrac12k(t)x^2`, "não tem simetria nenhuma (a mola muda com o tempo)", R`nada: nem a energia`, "um balanço sendo \"bombeado\" ganha energia"],
            [R`L = \tfrac12m_1\dot x_1^2 + \tfrac12m_2\dot x_2^2 - V(x_1 - x_2)`, "não muda se as duas partículas andam juntas: $x_i \\to x_i + \\varepsilon$", R`o momento total $m_1\dot x_1 + m_2\dot x_2$ (e a energia)`, "uma colisão ou duas massas ligadas por mola: o centro de massa anda em linha reta"],
          ];
          const [lag, sim, cons, ex] = p ? L[1] : F.escolha(L);
          return { enun: R`<p>Que grandezas a lagrangiana $${lag}$ conserva?</p>`, fig: "",
            passos: [R`<p>Procure a simetria: a lagrangiana ${sim}.</p>`, R`<p>Noether: cada simetria contínua dá uma conservada. Aqui: ${cons}.</p>`, R`<p>Exemplo físico: ${ex}.</p>`] };
        } },
        { nome: "A carga Q de uma simetria", gerar: (p) => {
          const casos = [
            [R`rotação em torno de $z$: $\delta x = -\varepsilon y$, $\delta y = \varepsilon x$`, R`Q = p_x(-y) + p_y(x) = m(x\dot y - y\dot x)`, "o momento angular $L_z$"],
            [R`translação em $z$: $\delta z = \varepsilon$`, R`Q = p_z = m\dot z`, "o momento linear $p_z$"],
            [R`hélice: girar $\varepsilon$ em torno de $z$ e subir $\frac{b}{2\pi}\varepsilon$`, R`Q = L_z + \frac{b}{2\pi}p_z`, "uma mistura de momento angular e linear (porca num parafuso)"],
          ];
          const [tr, q, nome] = p ? casos[0] : F.escolha(casos);
          return { enun: R`<p>Uma partícula livre (ou num potencial com essa simetria). Ache a grandeza conservada associada a: ${tr}.</p>`, fig: "",
            passos: [R`<p>Receita: se a lagrangiana não muda com $q_i \to q_i + \varepsilon K_i(q)$, então $Q = \sum_i\frac{\partial L}{\partial\dot q_i}K_i$ é constante.</p>`, R`<p>Com $p_i = m\dot q_i$: $${q}$.</p>`, R`<p>É ${nome}.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O teorema, demonstrado",
      enun: R`<p>(a) Suponha que a lagrangiana $L(q, \dot q)$ não mude (em primeira ordem) com a transformação $q_i \to q_i + \varepsilon K_i(q)$. Use as equações de Euler–Lagrange ${F.ret("TE01")} para mostrar que $Q = \sum_i p_iK_i$ é constante, com $p_i = \partial L/\partial\dot q_i$. (b) Suponha agora que $L$ não dependa explicitamente do tempo. Mostre que $H = \sum_i p_i\dot q_i - L$ é constante. (c) Para $L = \frac12m\dot x^2 - \frac12k(t)x^2$, mostre que a energia $E = \frac12m\dot x^2 + \frac12k(t)x^2$ varia com $\frac{dE}{dt} = \frac12\dot k\,x^2$. (d) Explique com isso como uma criança "bombeia" um balanço (ressonância paramétrica, como no experimento EP09).</p>`,
      fig: "",
      dicas: [R`<p>(a) A invariância diz: $\delta L = \sum_i\left(\frac{\partial L}{\partial q_i}K_i + \frac{\partial L}{\partial\dot q_i}\dot K_i\right) = 0$. Troque $\frac{\partial L}{\partial q_i}$ por $\frac{d}{dt}p_i$.</p>`, R`<p>(b) Derive $H$ no tempo, use a regra da cadeia em $\frac{dL}{dt}$ e Euler–Lagrange.</p>`],
      sol: R`<p><b>(a)</b> Com Euler–Lagrange, $\frac{\partial L}{\partial q_i} = \dot p_i$. Então $0 = \sum_i(\dot p_iK_i + p_i\dot K_i) = \frac{d}{dt}\sum_ip_iK_i$. Logo $Q = \sum p_iK_i$ é constante. ∎</p>
        <p><b>(b)</b> $\frac{dL}{dt} = \sum_i\left(\frac{\partial L}{\partial q_i}\dot q_i + p_i\ddot q_i\right) + \frac{\partial L}{\partial t} = \sum_i(\dot p_i\dot q_i + p_i\ddot q_i) + \frac{\partial L}{\partial t} = \frac{d}{dt}\sum_ip_i\dot q_i + \frac{\partial L}{\partial t}$. Logo $\frac{dH}{dt} = -\frac{\partial L}{\partial t}$: se $L$ não depende de $t$, $H$ (a energia, quando $T$ é quadrática nas velocidades) é constante. ∎</p>
        <p><b>(c)</b> $\frac{dE}{dt} = m\dot x\ddot x + k x\dot x + \frac12\dot kx^2$. Euler–Lagrange: $m\ddot x = -kx$, então os dois primeiros termos se cancelam e sobra $\frac12\dot k\,x^2$. Confere com (b): $-\frac{\partial L}{\partial t} = \frac12\dot kx^2$.</p>
        <p><b>(d)</b> Pela fórmula de (c), a energia cresce quando $k$ <b>aumenta</b> enquanto $x^2$ é grande (perto dos extremos) e <b>diminui</b> enquanto $x^2$ é pequeno (passando pelo centro): assim a média de $\frac12\dot k\,x^2$ fica positiva a cada ciclo. Como $x^2$ tem dois máximos por oscilação, o ritmo certo é mexer $k$ <b>duas vezes por oscilação</b>: é a ressonância paramétrica 2:1, a mesma do experimento do bloco com pêndulo ${F.ret("fisica/EP09")}. No balanço de verdade, a criança muda o comprimento do pêndulo (sobe e agacha), o que muda o "$k$" efetivo $g/\ell$; a análise completa usa momento angular, mas a ideia é a mesma: a simetria no tempo foi quebrada de propósito, e por isso a energia não se conserva.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo · teoremas</div>
        <div class="q">Por que a energia se conserva?</div>
        <p>Porque as leis da física de hoje são as mesmas de ontem. E o momento linear se conserva porque as leis são as mesmas aqui e ali; o momento angular, porque não existe uma direção especial no espaço. Em 1915, Emmy Noether provou que isso não é poesia: <b>toda simetria contínua da ação gera uma grandeza conservada</b>, e dá a fórmula para achá-la. Einstein chamou o trabalho dela de "pensamento matemático penetrante". É, provavelmente, a ideia mais profunda da física teórica.</p></div>`),

      F.secao("enunciado", "O teorema", R`
        ${F.formula(R`L(q + \varepsilon K, \dot q + \varepsilon\dot K) = L(q, \dot q) + O(\varepsilon^2)\quad\Longrightarrow\quad Q = \sum_i\frac{\partial L}{\partial\dot q_i}K_i = \text{constante}`, "Teorema de Noether (mecânica)")}
        <p>Leia assim: se dá para "empurrar" o sistema na direção $K$ (deslizar, girar…) sem mudar a lagrangiana ${F.ret("fisica/U03")}, então a combinação $Q = \sum p_iK_i$ não muda com o tempo. A demonstração tem três linhas e usa só Euler–Lagrange (chefão). Para o tempo: se $L$ não depende de $t$, a <b>energia</b> $H = \sum p_i\dot q_i - L$ se conserva ${F.ret("fisica/U04")}.</p>
        <table class="tb"><tr><th>simetria (o que não muda a física)</th><th>grandeza conservada</th></tr>
          <tr><td>translação no tempo</td><td>energia</td></tr>
          <tr><td>translação no espaço</td><td>momento linear</td></tr>
          <tr><td>rotação</td><td>momento angular</td></tr>
          <tr><td>"boost" de Galileu (mudar de referencial inercial)</td><td>o centro de massa anda em linha reta</td></tr>
          <tr><td>fase da função de onda (simetria de gauge U(1))</td><td>carga elétrica</td></tr></table>
        <div id="lab-nt"></div>
        ${F.caixa("pegadinha", R`<p><b>Simetria da lagrangiana, não do desenho.</b> Uma bola num tigela redonda tem simetria de rotação (conserva $L_z$); numa tigela oval, não (no laboratório, o "oscilador desigual" só conserva a energia). E a simetria tem de ser <b>contínua</b>: simetrias discretas (espelho, girar 90°) não dão conservadas pelo teorema de Noether.</p>`)}`),

      F.secao("alem", "Além da mecânica", R`
        <ul><li><b>Momento canônico × mecânico</b>: com campo magnético, $\vec p = m\vec v + q\vec A$. Uma carga num $\vec B$ uniforme, com $\vec A = \frac B2(-y, x, 0)$, tem simetria de rotação, e o que se conserva é $m(x\dot y - y\dot x) + \frac{qB}{2}(x^2 + y^2)$, não o momento angular mecânico (que muda enquanto ela gira fora do centro).</li>
          <li><b>Kepler tem uma simetria escondida</b>: além de $E$ e $\vec L$, o potencial $-k/r$ conserva o vetor de Runge–Lenz (que aponta para o periélio). Ele vem de uma simetria que não é de espaço nem de tempo, e é por isso que as órbitas fecham (não precessam).</li>
          <li><b>Física de partículas</b>: o Modelo Padrão ${F.ret("fisica/C21")} é construído ao contrário: escolhem-se as simetrias, e as forças e as conservadas (carga, número bariônico…) saem delas.</li></ul>
        ${F.caixa("ponte", R`<p>O teorema tem uma 2ª parte, para simetrias "locais" (que podem mudar de ponto para ponto), que na relatividade geral explica por que a energia não tem uma conservação global simples num universo em expansão. E na teoria de campos, a versão para campos dá as correntes conservadas $\partial_\mu j^\mu = 0$, como a equação da continuidade.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Que grandezas se conservam para $L = \frac12m(\dot x^2 + \dot y^2) - mgy$? Associe cada uma a uma simetria.</p>`, fig: "", dicas: [R`<p>$L$ depende de $x$? De $t$?</p>`, R`<p>Translação em $x$ e translação no tempo.</p>`], resp: R`$p_x = m\dot x$ (translação em $x$) e a energia (tempo).`, sol: R`<p>$p_y$ não se conserva: a gravidade distingue alturas. No laboratório, é o caso "gravidade".</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Para um potencial central $V(r)$, mostre pela receita de Noether, com $K = (-y, x)$, que $L_z = m(x\dot y - y\dot x)$ se conserva.</p>`, fig: "", dicas: [R`<p>Uma rotação pequena $\delta x = -\varepsilon y$, $\delta y = \varepsilon x$ não muda $r$ nem $v^2$.</p>`, R`<p>$Q = p_xK_x + p_yK_y$.</p>`], resp: R`$Q = m\dot x(-y) + m\dot y(x) = L_z$.`, sol: R`<p>Daí sai a 2ª lei de Kepler (áreas iguais em tempos iguais) para qualquer força central, não só a gravidade.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Duas partículas numa reta interagem por $V(x_1 - x_2)$. Que simetria a lagrangiana tem e o que se conserva?</p>`, fig: "", dicas: [R`<p>O que acontece se você desloca as duas pelo mesmo $\varepsilon$?</p>`, R`<p>$K = (1, 1)$.</p>`], resp: R`Translação conjunta; conserva $m_1\dot x_1 + m_2\dot x_2$.`, sol: R`<p>É a 3ª lei de Newton disfarçada: como $V$ só depende da diferença, as forças são iguais e opostas.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>A conta no aro que gira com $\omega$ fixo (U03) tem $L = \frac12mR^2\dot\theta^2 + \frac12m\omega^2R^2\sin^2\theta + mgR\cos\theta$. A energia $T + V$ se conserva? O que se conserva?</p>`, fig: "", dicas: [R`<p>$L$ não depende de $t$: conserva $H = p\dot\theta - L$.</p>`, R`<p>Calcule $H$ e compare com $T + V$.</p>`], resp: R`$H = \frac12mR^2\dot\theta^2 - \frac12m\omega^2R^2\sin^2\theta - mgR\cos\theta$, que não é $T + V$.`, sol: R`<p>$T + V$ não se conserva porque o motor que mantém $\omega$ constante faz trabalho na conta. $H$ (a "integral de Jacobi") se conserva porque a lagrangiana não muda com o tempo ${F.ret("fisica/U03")}.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma partícula se move num potencial que só depende de $x^2 + y^2$ e de $z$ (simetria cilíndrica). Quais componentes do momento angular se conservam?</p>`, fig: "", dicas: [R`<p>Quais rotações deixam o potencial igual?</p>`, R`<p>Só a rotação em torno de $z$.</p>`], resp: R`Só $L_z$.`, sol: R`<p>Por exemplo, um elétron perto de um fio carregado e longo: $L_z$ e $p_z$ (se o fio é infinito) se conservam, $L_x$ e $L_y$ não.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Uma carga $q$ se move no plano sob um campo magnético uniforme $B\hat z$, com $\vec A = \frac B2(-y, x, 0)$ e $L = \frac12m\vec v^2 + q\vec v\cdot\vec A$. Mostre que a rotação em torno de $z$ é uma simetria e ache a grandeza conservada.</p>`, fig: "", dicas: [R`<p>Momentos canônicos: $p_x = m\dot x - \frac{qB}{2}y$, $p_y = m\dot y + \frac{qB}{2}x$.</p>`, R`<p>$Q = -yp_x + xp_y$.</p>`], resp: R`$Q = m(x\dot y - y\dot x) + \frac{qB}{2}(x^2 + y^2)$.`, sol: R`<p>Conferido numericamente: numa órbita circular fora da origem, o momento angular mecânico vai de 1,1 a −1,96, mas $Q$ fica em 2,1000. O momento que se conserva é o canônico, não o "$m\vec r\times\vec v$" da escola.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Uma conta desliza numa hélice (ou o potencial é invariante por "girar $\phi$ e subir $\frac{b}{2\pi}\phi$", como num parafuso de passo $b$). Qual grandeza se conserva?</p>`, fig: "", dicas: [R`<p>$K = (-y, x, \frac{b}{2\pi})$.</p>`, R`<p>$Q = p_xK_x + p_yK_y + p_zK_z$.</p>`], resp: R`$Q = L_z + \frac{b}{2\pi}p_z$.`, sol: R`<p>Nem $L_z$ nem $p_z$ sozinhos: a simetria é uma mistura, e a conservada também. É a lógica de uma porca girando num parafuso.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-nt"); e.outerHTML = F.lab("O que se conserva em cada potencial", "lab-nt"); SIM.noether(document.getElementById("lab-nt"), F); },
});
