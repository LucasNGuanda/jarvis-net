/* EP02 · Pêndulo duplo. Lagrangiana e equações conferidas com sympy (scratchpad exp.py); energia conservada no RK4 (erro ~1e-10 em 20 s). */
F.registrar("EP02", {
  retoma: ["EP01"],
  html(F) {
    const R = String.raw;
    const fig = D.svg(340, 320, `<line x1="100" y1="30" x2="240" y2="30" style="stroke:var(--ink3);stroke-width:5"/><line x1="170" y1="30" x2="170" y2="150" class="ln2" style="stroke-dasharray:4 4"/><line x1="170" y1="30" x2="230" y2="140" class="ln"/><circle cx="230" cy="140" r="12" style="fill:var(--mA)"/><line x1="230" y1="140" x2="230" y2="270" class="ln2" style="stroke-dasharray:4 4"/><line x1="230" y1="140" x2="170" y2="250" class="ln"/><circle cx="170" cy="250" r="12" style="fill:var(--mU)"/>${D.txt(182, 86, "θ₁", "txm", "start")}${D.txt(212, 196, "θ₂", "txm", "end")}${D.txt(212, 80, "ℓ₁", "txm", "start")}${D.txt(190, 190, "ℓ₂", "txm", "end")}${D.txt(250, 146, "m₁", "txm", "start")}${D.txt(150, 262, "m₂", "txm", "end")}`, "pêndulo duplo");
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 2</div><div class="q">Duas peças, duas equações determinísticas. Por que é impossível prever onde ele vai estar daqui a 30 segundos?</div></div>`),
      F.secao("experimento", "Experimento", R`<p>Arraste as massas para escolher os ângulos. Teste os modos normais (ângulos pequenos) e depois o caos (ângulos grandes) com o gêmeo ligado.</p><div id="lab-p2"></div>`),
      F.secao("lagrange", "A dedução pela lagrangiana", R`
        ${F.fig(fig)}
        ${F.demo("posições e velocidades", R`
          <p>(i) <b>Coordenadas generalizadas:</b> $\theta_1$ e $\theta_2$, ambos medidos a partir da vertical.</p>
          <p>(ii) <b>Posições</b> (origem na suspensão, $y$ para cima):</p>
          ${F.formula(R`x_1 = \ell_1\sin\theta_1,\quad y_1 = -\ell_1\cos\theta_1;\qquad x_2 = x_1 + \ell_2\sin\theta_2,\quad y_2 = y_1 - \ell_2\cos\theta_2`)}
          <p>(iii) <b>Derivando</b> (regra da cadeia):</p>
          ${F.formula(R`\dot x_1 = \ell_1\cos\theta_1\,\dot\theta_1,\quad \dot y_1 = \ell_1\sin\theta_1\,\dot\theta_1;\qquad \dot x_2 = \dot x_1 + \ell_2\cos\theta_2\,\dot\theta_2,\quad \dot y_2 = \dot y_1 + \ell_2\sin\theta_2\,\dot\theta_2`)}
          <p>(iv) <b>Quadrado das velocidades.</b> De cima: $v_1^2 = \dot x_1^2 + \dot y_1^2 = \ell_1^2\dot\theta_1^2$. De baixo:</p>
          ${F.formula(R`v_2^2 = \ell_1^2\dot\theta_1^2 + \ell_2^2\dot\theta_2^2 + 2\ell_1\ell_2\dot\theta_1\dot\theta_2(\cos\theta_1\cos\theta_2 + \sin\theta_1\sin\theta_2) = \ell_1^2\dot\theta_1^2 + \ell_2^2\dot\theta_2^2 + 2\ell_1\ell_2\dot\theta_1\dot\theta_2\cos(\theta_1 - \theta_2)`)}`)}
        ${F.demo("energias e lagrangiana", R`
          <p>(v) <b>Cinética:</b> $T = \frac12m_1v_1^2 + \frac12m_2v_2^2$:</p>
          ${F.formula(R`T = \frac12(m_1 + m_2)\ell_1^2\dot\theta_1^2 + \frac12m_2\ell_2^2\dot\theta_2^2 + m_2\ell_1\ell_2\dot\theta_1\dot\theta_2\cos(\theta_1 - \theta_2)`)}
          <p>(vi) <b>Potencial:</b> $V = m_1gy_1 + m_2gy_2$:</p>
          ${F.formula(R`V = -(m_1 + m_2)g\ell_1\cos\theta_1 - m_2g\ell_2\cos\theta_2`)}
          <p>(vii) $\mathcal L = T - V$.</p>`)}
        ${F.demo("as duas equações de Euler–Lagrange", R`
          <p>(viii) Para $\theta_1$: $\frac{\partial\mathcal L}{\partial\dot\theta_1} = (m_1 + m_2)\ell_1^2\dot\theta_1 + m_2\ell_1\ell_2\dot\theta_2\cos\Delta$, com $\Delta = \theta_1 - \theta_2$. Derivando em $t$ (cuidado: $\cos\Delta$ também depende do tempo):</p>
          $$\frac{d}{dt}\frac{\partial\mathcal L}{\partial\dot\theta_1} = (m_1+m_2)\ell_1^2\ddot\theta_1 + m_2\ell_1\ell_2\left[\ddot\theta_2\cos\Delta - \dot\theta_2(\dot\theta_1 - \dot\theta_2)\sin\Delta\right]$$
          $$\frac{\partial\mathcal L}{\partial\theta_1} = -m_2\ell_1\ell_2\dot\theta_1\dot\theta_2\sin\Delta - (m_1+m_2)g\ell_1\sin\theta_1$$
          <p>Subtraindo, os termos $\dot\theta_1\dot\theta_2\sin\Delta$ se cancelam, e dividindo por $\ell_1$:</p>
          ${F.formula(R`(m_1 + m_2)\ell_1\ddot\theta_1 + m_2\ell_2\ddot\theta_2\cos\Delta + m_2\ell_2\dot\theta_2^2\sin\Delta + (m_1 + m_2)g\sin\theta_1 = 0`)}
          <p>(ix) Para $\theta_2$, do mesmo jeito (divida por $m_2\ell_2$):</p>
          ${F.formula(R`\ell_2\ddot\theta_2 + \ell_1\ddot\theta_1\cos\Delta - \ell_1\dot\theta_1^2\sin\Delta + g\sin\theta_2 = 0`)}
          <p>(x) São duas equações lineares em $\ddot\theta_1$ e $\ddot\theta_2$. Resolvendo o sistema 2×2 (Cramer), com $\text{den} = 2m_1 + m_2 - m_2\cos2\Delta$:</p>
          ${F.formula(R`\ddot\theta_1 = \frac{-g(2m_1 + m_2)\sin\theta_1 - m_2g\sin(\theta_1 - 2\theta_2) - 2\sin\Delta\,m_2(\dot\theta_2^2\ell_2 + \dot\theta_1^2\ell_1\cos\Delta)}{\ell_1\,\text{den}}`)}
          ${F.formula(R`\ddot\theta_2 = \frac{2\sin\Delta\left[\dot\theta_1^2\ell_1(m_1 + m_2) + g(m_1 + m_2)\cos\theta_1 + \dot\theta_2^2\ell_2m_2\cos\Delta\right]}{\ell_2\,\text{den}}`)}
          <p>São essas as equações que o experimento integra (método de Runge–Kutta de 4ª ordem). Conferi a dedução com álgebra simbólica (sympy): as equações batem exatamente.</p>`)}
        ${F.caixa("fisico", R`<p>Não tem solução fechada. Mas há uma grandeza conservada: a energia $E = T + V$. O experimento mostra o erro relativo dela: se a integração numérica estivesse errada, ele cresceria.</p>`)}`),
      F.secao("resultados", "Os resultados", R`
        <h3>1. Pequenas oscilações: modos normais</h3>
        <p>Para ângulos pequenos, $\cos\Delta \approx 1$, $\sin \approx$ ângulo, e os termos com $\dot\theta^2$ (segunda ordem) somem. Com $m_1 = m_2 = m$ e $\ell_1 = \ell_2 = \ell$:</p>
        ${F.formula(R`2\ddot\theta_1 + \ddot\theta_2 + 2\frac g\ell\theta_1 = 0,\qquad \ddot\theta_1 + \ddot\theta_2 + \frac g\ell\theta_2 = 0`)}
        <p>Procurando soluções $\theta_i = A_i\cos\omega t$, sai $\omega^2 = \frac g\ell(2 \mp \sqrt2)$:</p>
        <ul><li><b>Modo lento</b> $\omega^2 = (2 - \sqrt2)\frac g\ell$: $\theta_2 = +\sqrt2\,\theta_1$ (os dois para o mesmo lado).</li><li><b>Modo rápido</b> $\omega^2 = (2 + \sqrt2)\frac g\ell$: $\theta_2 = -\sqrt2\,\theta_1$ (lados opostos).</li></ul>
        <p>Qualquer pequena oscilação é uma soma dos dois: os botões "modo normal" do experimento começam exatamente em cada um, e o movimento fica periódico e simples.</p>
        <h3>2. Ângulos grandes: caos</h3>
        <p>Com energia alta, o sistema é <b>caótico</b>: duas condições iniciais com 0,001 rad de diferença se afastam exponencialmente (o gráfico log da separação sobe quase em linha reta, e a inclinação é o <b>expoente de Lyapunov</b>). As equações são determinísticas, mas qualquer incerteza inicial, por menor que seja, explode: prever a longo prazo é impossível na prática.</p>
        ${F.caixa("ponte", R`<p>O mesmo fenômeno limita a previsão do tempo (~2 semanas) e aparece nas órbitas de três corpos. E as equações de Navier–Stokes, ponto final do site, também são caóticas na turbulência ${F.ret("N07")}.</p>`)}`),
      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, marcas: ["!"], enun: R`<p>Com $\ell = 1$ m e $g = 9{,}8$ m/s² (massas e fios iguais), quais os períodos dos dois modos normais? Meça no experimento.</p>`, fig: "", dicas: [R`<p>$T = 2\pi/\omega$.</p>`, R`<p>$\omega^2 = 9{,}8(2 \mp 1{,}414)$.</p>`], resp: R`$\approx 2{,}62$ s e $\approx 1{,}09$ s.`, sol: R`<p>Lento: $\omega = \sqrt{9{,}8\times0{,}586} = 2{,}40$ rad/s, $T = 2{,}62$ s. Rápido: $\omega = 5{,}78$ rad/s, $T = 1{,}09$ s.</p>` }),
        F.exercicio({ n: 2, marcas: ["!!"], enun: R`<p>Faça o limite $m_2 \to 0$ nas equações. O que acontece com a 1ª equação? E o que a 2ª descreve?</p>`, fig: "", dicas: [R`<p>Na 1ª, os termos com $m_2$ somem.</p>`, R`<p>A 2ª é um pêndulo pendurado num ponto que se move.</p>`], resp: R`A 1ª vira o pêndulo simples; a 2ª, um pêndulo leve forçado pelo movimento do de cima.`, sol: R`<p>$m_2 \to 0$: $\ell_1\ddot\theta_1 + g\sin\theta_1 = 0$ ${F.ret("EP01")}; a massa de baixo não perturba a de cima, mas é sacudida por ela (pêndulo com suspensão acelerada).</p>` }),
      ].join("")),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-p2"); e.outerHTML = F.lab("Pêndulo duplo", "lab-p2"); SIM.penduloDuplo(document.getElementById("lab-p2"), F); },
});
