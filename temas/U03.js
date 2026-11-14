/* U03 · Mecânica analítica: a lagrangiana (com as minhas palavras). Conferido em Python:
   Atwood 3 kg/2 kg: a = g/5 = 1,96 m/s²; pêndulo de 1 m: T = 2,01 s; plano 30°: 4,905 m/s²; haste girando (ω = 2, r₀ = 0,1 m até 1 m): t = arccosh(10)/2 = 1,50 s;
   cilindro rolando a 30°: (2/3)g sen θ = 3,27 m/s²; aro R = 0,1 m: ω_c = 9,90 rad/s; ω = 15: θ* = 64,2°, ω_osc = ω sen θ* = 13,50 rad/s; ω = 6: ω_osc = √(g/R − ω²) = 7,88 rad/s. */
F.registrar("U03", {
  retoma: ["U01", "CI05", "CII08"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Lagrange em ação",
      casos: [
        { nome: "Máquina de Atwood", gerar: (p) => {
          const m1 = p ? 3 : F.escolha([2, 3, 5, 8]), m2 = p ? 2 : F.escolha([1, 2, 4]), g = 9.81, a = ((m1 - m2) * g) / (m1 + m2);
          return { enun: R`<p>Uma polia ideal tem massas $m_1 = ${m1}$ kg e $m_2 = ${m2}$ kg penduradas. Ache a aceleração usando a lagrangiana, com uma coordenada só.</p>`, fig: "",
            passos: [
              R`<p>Coordenada: $x$ = quanto $m_1$ desceu ($m_2$ sobe $x$, o fio é inextensível). $T = \frac12(m_1 + m_2)\dot x^2 = ${F.n((m1 + m2) / 2)}\dot x^2$, $V = -m_1gx + m_2gx$.</p>`,
              R`<p>$L = ${F.n((m1 + m2) / 2)}\dot x^2 + (${m1} - ${m2})gx$. Euler–Lagrange: $\frac{d}{dt}\big(${m1 + m2}\dot x\big) = (${m1 - m2})g$.</p>`,
              R`<p>$\ddot x = \frac{${m1 - m2}}{${m1 + m2}}g \approx ${F.n(a, 2)}$ m/s². ${m1 === m2 ? "Massas iguais: equilíbrio." : a < 0 ? "Negativo: quem desce é a $m_2$." : ""} A tração do fio nem apareceu: forças de vínculo somem quando você escolhe bem a coordenada.</p>`,
            ] };
        } },
        { nome: "Conta no aro girando", gerar: (p) => {
          const Rr = p ? 0.1 : F.escolha([0.05, 0.1, 0.2, 0.5]), g = 9.81, wc = Math.sqrt(g / Rr), w = p ? 15 : +(wc * F.escolha([0.6, 1.3, 1.6, 2.2])).toFixed(1);
          const acima = w > wc, th = acima ? Math.acos(g / (w * w * Rr)) : 0;
          return { enun: R`<p>Uma conta desliza sem atrito num aro vertical de raio ${F.n(Rr)} m que gira a $\omega = ${F.n(w)}$ rad/s em torno do diâmetro vertical. Onde fica o equilíbrio estável e com que frequência a conta oscila em volta dele?</p>`, fig: "",
            passos: [
              R`<p>$\omega_c = \sqrt{g/R} = ${F.n(wc, 2)}$ rad/s. Equação (veja a seção do aro): $\ddot\theta = \sin\theta\,(\omega^2\cos\theta - g/R)$.</p>`,
              acima ? R`<p>$\omega &gt; \omega_c$: o fundo fica instável. Equilíbrio em $\cos\theta^* = \frac{g}{\omega^2R} = ${F.n(g / (w * w * Rr), 3)}$, ou seja, $\theta^* \approx ${F.n((th * 180) / Math.PI, 1)}°$.</p>` : R`<p>$\omega &lt; \omega_c$: o único equilíbrio estável é o fundo, $\theta = 0$.</p>`,
              acima ? R`<p>Linearizando em volta de $\theta^*$: $\omega_\text{osc} = \omega\sin\theta^* \approx ${F.n(w * Math.sin(th), 2)}$ rad/s.</p>` : R`<p>Linearizando em $\theta = 0$: $\omega_\text{osc} = \sqrt{g/R - \omega^2} \approx ${F.n(Math.sqrt(g / Rr - w * w), 2)}$ rad/s (mais lento que sem girar: a "força centrífuga" atrapalha a volta).</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A conta no aro, do começo ao fim",
      enun: R`<p>Uma conta de massa $m$ desliza sem atrito num aro de raio $R$, que gira com $\omega$ constante em torno do diâmetro vertical. Use o ângulo $\theta$ medido a partir do ponto mais baixo. (a) Escreva $T$, $V$ e a lagrangiana. (b) Ache a equação de movimento. (c) Ache os equilíbrios e mostre que o fundo deixa de ser estável acima de $\omega_c = \sqrt{g/R}$. (d) Calcule a frequência das pequenas oscilações em torno do equilíbrio estável para $\omega &gt; \omega_c$. (e) Números: $R = 10$ cm e $\omega = 15$ rad/s.</p>`,
      fig: "",
      dicas: [R`<p>(a) A conta tem velocidade $R\dot\theta$ ao longo do aro e $\omega R\sin\theta$ perpendicular a ele (giro em torno do eixo).</p>`, R`<p>(d) Escreva $\theta = \theta^* + \epsilon$ e expanda $\sin\theta(\omega^2\cos\theta - g/R)$ até primeira ordem em $\epsilon$.</p>`],
      sol: R`<p><b>(a)</b> $T = \frac12mR^2\dot\theta^2 + \frac12m\omega^2R^2\sin^2\theta$, $V = -mgR\cos\theta$. $L = T - V$.</p>
        <p><b>(b)</b> $\frac{\partial L}{\partial\dot\theta} = mR^2\dot\theta$; $\frac{\partial L}{\partial\theta} = m\omega^2R^2\sin\theta\cos\theta - mgR\sin\theta$. Então $\ddot\theta = \sin\theta\left(\omega^2\cos\theta - \frac{g}{R}\right)$.</p>
        <p><b>(c)</b> $\ddot\theta = 0$ quando $\sin\theta = 0$ (fundo ou topo) ou $\cos\theta^* = \frac{g}{\omega^2R}$, que só existe se $\omega^2R &gt; g$. Perto do fundo, $\ddot\theta \approx (\omega^2 - g/R)\theta$: com $\omega &lt; \omega_c$, é um MHS (estável); com $\omega &gt; \omega_c$, o sinal troca e o desvio cresce exponencialmente (instável).</p>
        <p><b>(d)</b> A derivada de $f(\theta) = \sin\theta(\omega^2\cos\theta - g/R)$ em $\theta^*$ é $\cos\theta^*\underbrace{(\omega^2\cos\theta^* - g/R)}_{0} - \omega^2\sin^2\theta^* = -\omega^2\sin^2\theta^*$. Logo $\ddot\epsilon = -(\omega\sin\theta^*)^2\epsilon$: $\omega_\text{osc} = \omega\sin\theta^*$.</p>
        <p><b>(e)</b> $\omega_c = \sqrt{98{,}1} \approx 9{,}90$ rad/s; $\cos\theta^* = \frac{9{,}81}{225\times0{,}1} = 0{,}436$, $\theta^* \approx 64{,}2°$; $\omega_\text{osc} = 15\times0{,}900 \approx 13{,}5$ rad/s.</p>
        <p>Isso é uma <b>bifurcação de forquilha</b>: um equilíbrio estável vira dois (à esquerda e à direita), e o sistema "escolhe" um lado. É o mesmo mecanismo matemático da quebra espontânea de simetria (o campo de Higgs ${F.ret("C21")}, ímãs que se magnetizam ao esfriar).</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Universitária · mecânica analítica</div>
        <div class="q">E se você nunca mais precisasse desenhar um diagrama de forças?</div>
        <p>Em 1788, Lagrange publicou a <i>Mécanique analytique</i> e se gabou no prefácio: o livro não tem nenhuma figura. Toda a mecânica de Newton sai de uma única função, $L = T - V$, e de uma receita que funciona em qualquer coordenada: ângulos, distâncias ao longo de um trilho, o que for mais cômodo. As forças de vínculo (normal, tração) simplesmente desaparecem da conta.</p></div>`),

      F.secao("lagrangiana", "A receita", R`
        ${F.formula(R`L(q, \dot q, t) = T - V\qquad\qquad \frac{d}{dt}\left(\frac{\partial L}{\partial\dot q}\right) = \frac{\partial L}{\partial q}`, "Lagrangiana e equação de Euler–Lagrange")}
        <ol><li>Escolha <b>coordenadas generalizadas</b> $q_1, q_2, \dots$: o mínimo de números que descreve a posição, respeitando os vínculos (um pêndulo precisa só de $\theta$; uma conta num trilho, só da posição ao longo dele). O número delas são os <b>graus de liberdade</b>.</li>
          <li>Escreva a energia cinética $T$ e a potencial $V$ em função de $q$ e $\dot q$.</li>
          <li>Monte $L = T - V$ e aplique Euler–Lagrange a cada coordenada. Pronto: uma equação de movimento por grau de liberdade ${F.ret("CII08")}.</li></ol>
        <p><b>Teste com uma mola</b>: $L = \frac12m\dot x^2 - \frac12kx^2$. Então $\frac{\partial L}{\partial\dot x} = m\dot x$, $\frac{\partial L}{\partial x} = -kx$, e a equação é $m\ddot x = -kx$. É Newton, sem desenhar nada.</p>
        <p><b>Pêndulo</b>: $T = \frac12ml^2\dot\theta^2$, $V = -mgl\cos\theta$. Euler–Lagrange: $ml^2\ddot\theta = -mgl\sin\theta$, ou $\ddot\theta = -\frac{g}{l}\sin\theta$. A tração do fio não apareceu em lugar nenhum.</p>
        ${F.caixa("pegadinha", R`<p><b>É $T - V$, não $T + V$</b>. A soma é a energia (que se conserva). A diferença não tem significado "físico" óbvio, mas é ela que gera as equações certas (a U04 explica por quê: o caminho real torna estacionária a integral de $T - V$). E cuidado com o sinal de $V$: para a gravidade com $\theta$ a partir do fundo, $V = -mgl\cos\theta$ (mínimo no fundo).</p>`)}`),

      F.secao("momento", "Momento generalizado e conservação", R`
        ${F.formula(R`p = \frac{\partial L}{\partial\dot q}\qquad\qquad \frac{\partial L}{\partial q} = 0\ \Longrightarrow\ p = \text{constante}`, "Coordenada cíclica")}
        <p>Se $L$ não depende de uma coordenada $q$ (só de $\dot q$), ela se chama <b>cíclica</b>, e o momento associado se conserva: Euler–Lagrange vira $\dot p = 0$.</p>
        <ul><li>Partícula livre: $L = \frac12m\dot x^2$ não depende de $x$, então $p = m\dot x$ é constante (momento linear).</li>
          <li>Força central em polares: $L = \frac12m(\dot r^2 + r^2\dot\varphi^2) - V(r)$ não depende de $\varphi$, então $p_\varphi = mr^2\dot\varphi$ é constante. É o <b>momento angular</b>, e daí sai a 2ª lei de Kepler.</li>
          <li>Se $L$ não depende do tempo, a energia $E = \sum\dot q\,p - L$ se conserva.</li></ul>
        ${F.caixa("ideia", R`<p><b>Teorema de Noether</b> (1918): cada <b>simetria</b> da lagrangiana gera uma grandeza conservada. Translação no espaço → momento linear; rotação → momento angular; translação no tempo → energia. Emmy Noether provou isso em geral, e virou a espinha dorsal da física moderna: as leis de conservação não são "sorte", são consequência das simetrias.</p>`)}`),

      F.secao("aro", "Um exemplo que Newton acharia difícil", R`
        <p>Uma conta presa num aro que gira em torno do eixo vertical com $\omega$ fixo. Com forças, você teria de lidar com a normal do aro (que muda de direção), a força de Coriolis e a centrífuga. Com Lagrange: uma coordenada só, $\theta$, e duas linhas de conta (o chefão faz tudo).</p>
        ${F.formula(R`L = \tfrac12mR^2\dot\theta^2 + \tfrac12m\omega^2R^2\sin^2\theta + mgR\cos\theta\ \ \Longrightarrow\ \ \ddot\theta = \sin\theta\left(\omega^2\cos\theta - \frac{g}{R}\right)`, "Conta no aro girando")}
        <div id="lab-aro"></div>
        <p>Na simulação, mexa em $\omega$ e veja o potencial efetivo $U_\text{ef}(\theta) = -mgR\cos\theta - \frac12m\omega^2R^2\sin^2\theta$: abaixo de $\omega_c$, ele tem um vale só (no fundo). Acima, o fundo vira um morrinho e aparecem dois vales simétricos.</p>
        ${F.caixa("olimpiada", R`<p><b>Quando usar Lagrange numa olimpíada</b>: sistemas com vínculos esquisitos (cunha que desliza num plano sem atrito com um bloco em cima, pêndulo duplo, pêndulo com suporte móvel), e quando a pergunta é "ache a frequência das pequenas oscilações". Truque: para pequenas oscilações em torno de um equilíbrio, $\omega^2 = \frac{V''(q_0)}{M_\text{ef}}$, onde $T = \frac12M_\text{ef}\dot q^2$.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Uma partícula se move em 1D com $V = \frac12kx^2$. Monte a lagrangiana e ache a equação de movimento.</p>`, fig: "", dicas: [R`<p>$T = \frac12m\dot x^2$.</p>`, R`<p>Calcule $\partial L/\partial\dot x$ e $\partial L/\partial x$.</p>`], resp: R`$m\ddot x = -kx$.`, sol: R`<p>MHS com $\omega = \sqrt{k/m}$. Para sistemas simples, Lagrange e Newton dão a mesma coisa; a vantagem aparece com vínculos.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Máquina de Atwood com $m_1 = 3$ kg e $m_2 = 2$ kg. Ache a aceleração por Lagrange.</p>`, fig: "", dicas: [R`<p>Uma coordenada: $x$, quanto $m_1$ desce.</p>`, R`<p>$T = \frac12(m_1 + m_2)\dot x^2$, $V = -(m_1 - m_2)gx$.</p>`], resp: R`$a = \frac{m_1 - m_2}{m_1 + m_2}g = \frac{g}{5} \approx 1{,}96$ m/s².`, sol: R`<p>Sem tração na conta. Para achar a tração, aí sim você volta a Newton num dos blocos: $T = m_2(g + a) \approx 23{,}5$ N.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Ache a equação do pêndulo simples por Lagrange e o período para pequenas oscilações com $l = 1$ m.</p>`, fig: "", dicas: [R`<p>$T = \frac12ml^2\dot\theta^2$, $V = -mgl\cos\theta$.</p>`, R`<p>Pequenos ângulos: $\sin\theta \approx \theta$.</p>`], resp: R`$\ddot\theta = -\frac{g}{l}\sin\theta$; $T \approx 2{,}01$ s.`, sol: R`<p>$2\pi\sqrt{1/9{,}81} \approx 2{,}006$ s. Um pêndulo de 1 m "bate o segundo" a cada meia oscilação: quase foi a definição do metro, no século XVIII.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Escreva a lagrangiana de uma partícula sob força central $V(r)$ em coordenadas polares e mostre que $mr^2\dot\varphi$ se conserva.</p>`, fig: "", dicas: [R`<p>Em polares, $v^2 = \dot r^2 + r^2\dot\varphi^2$.</p>`, R`<p>$L$ depende de $\varphi$?</p>`], resp: R`$L = \frac12m(\dot r^2 + r^2\dot\varphi^2) - V(r)$; $\varphi$ é cíclica, então $p_\varphi = mr^2\dot\varphi$ é constante.`, sol: R`<p>Esse é o momento angular. A área varrida por unidade de tempo é $\frac12r^2\dot\varphi = \frac{L}{2m}$: 2ª lei de Kepler, para <b>qualquer</b> força central.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Um bloco desliza sem atrito num plano inclinado de 30°. Use como coordenada a distância $s$ percorrida ao longo do plano e ache $\ddot s$.</p>`, fig: "", dicas: [R`<p>A altura cai $s\sin30°$.</p>`, R`<p>$L = \frac12m\dot s^2 + mgs\sin30°$.</p>`], resp: R`$\ddot s = g\sin30° \approx 4{,}9$ m/s².`, sol: R`<p>A normal não aparece: ela é força de vínculo e não faz trabalho num deslocamento permitido.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Uma conta desliza sem atrito numa haste horizontal que gira com $\omega = 2$ rad/s em torno de um eixo vertical por uma das pontas. Ela parte do repouso (em relação à haste) a $r_0 = 0{,}1$ m do eixo. Ache $r(t)$ e quanto tempo ela leva para chegar a 1 m.</p>`, fig: "", dicas: [R`<p>$T = \frac12m(\dot r^2 + \omega^2r^2)$, $V = 0$ (a haste é horizontal).</p>`, R`<p>$\ddot r = \omega^2r$: soluções $\cosh$ e $\sinh$.</p>`], resp: R`$r = r_0\cosh(\omega t)$; $t = \frac{\text{arccosh}(10)}{2} \approx 1{,}50$ s.`, sol: R`<p>Com $\dot r(0) = 0$, sobra só o cosseno hiperbólico. A distância cresce exponencialmente: é como a força centrífuga "empurra" a conta, vista de quem gira junto.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Um cilindro maciço rola sem deslizar num plano inclinado de 30°. Use a coordenada $s$ (distância ao longo do plano), com o vínculo $v = \omega r$, e ache a aceleração.</p>`, fig: "", dicas: [R`<p>$T = \frac12m\dot s^2 + \frac12I\omega^2$, com $I = \frac12mr^2$ e $\omega = \dot s/r$.</p>`, R`<p>Então $T = \frac34m\dot s^2$.</p>`], resp: R`$\ddot s = \frac23g\sin30° \approx 3{,}27$ m/s².`, sol: R`<p>Parte da energia vai para a rotação, por isso é mais lento que o bloco (4,9 m/s²). O atrito estático que faz rolar não aparece: ele não realiza trabalho no rolamento sem deslizamento.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-aro"); e.outerHTML = F.lab("Conta no aro girando", "lab-aro"); SIM.aro(document.getElementById("lab-aro"), F); },
});
