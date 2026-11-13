/* EP09 · Duas massas e três molas. Equações e solução exata conferidas com sympy (scratchpad exp3.py). */
F.registrar("EP09", {
  retoma: ["B15", "EP02"],
  html(F) {
    const R = String.raw;
    const fig = D.svg(560, 130, `<rect x="20" y="30" width="10" height="70" style="fill:var(--ink3)"/><rect x="530" y="30" width="10" height="70" style="fill:var(--ink3)"/>` + D.comp("resistor", 30, 65, 170, 65, { rot: "k", L: 90 }) + `<rect x="170" y="43" width="44" height="44" style="fill:var(--mU)"/>${D.txt(192, 70, "m", "tx", "middle", 'style="fill:#fff;font-weight:700"')}` + D.comp("resistor", 214, 65, 346, 65, { rot: "k_c", L: 90 }) + `<rect x="346" y="43" width="44" height="44" style="fill:var(--mA)"/>${D.txt(368, 70, "m", "tx", "middle", 'style="fill:#fff;font-weight:700"')}` + D.comp("resistor", 390, 65, 530, 65, { rot: "k", L: 90 }) + `${D.seta(192, 110, 232, 110, "var(--ink2)", 1.4)}${D.txt(212, 126, "x₁", "txm")}${D.seta(368, 110, 408, 110, "var(--ink2)", 1.4)}${D.txt(388, 126, "x₂", "txm")}`, "duas massas e três molas");
    const ex = F.exercicio({ n: 1, enun: R`<p><b>Exercício.</b> Duas massas iguais $m = 1{,}0$ kg, molas das pontas $k = 10$ N/m e mola do meio $k_c = 1{,}5$ N/m. A massa 1 é deslocada $30$ cm e as duas são soltas do repouso. (a) Escreva $x_1(t)$ e $x_2(t)$. (b) Depois de quanto tempo a massa 1 fica (quase) parada e a 2 oscila com a amplitude máxima?</p>`, fig: fig,
      dicas: [R`<p>(a) Use a solução geral com $A = 0{,}30$ m e $B = 0$.</p>`, R`<p>(b) $x_1 = 0{,}30\cos\left(\frac{\omega_2-\omega_1}{2}t\right)\cos\left(\frac{\omega_1+\omega_2}{2}t\right)$: a envoltória zera quando $\frac{\omega_2-\omega_1}{2}t = \frac\pi2$.</p>`],
      resp: R`(a) $x_{1,2} = 0{,}15\cos(3{,}162t) \pm 0{,}15\cos(3{,}606t)$; (b) $t \approx 7{,}1$ s.`,
      sol: R`<p>$\omega_1 = \sqrt{10} = 3{,}162$ rad/s, $\omega_2 = \sqrt{13} = 3{,}606$ rad/s. (b) $t = \frac{\pi}{\omega_2 - \omega_1} = \frac{\pi}{0{,}4434} \approx 7{,}09$ s. Toda a energia passou para a massa 2; em mais 7,1 s, volta para a 1. Confira no experimento (botão "Batimento").</p>` });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mola · exercício</div><div class="q">Você puxa só uma das massas e solta. Por que, depois de alguns segundos, ela para e a <b>outra</b> é que está balançando?</div></div>`),
      F.secao("experimento", "Experimento", R`<p>Teste os dois modos normais e depois o batimento. Deixe $k_c$ pequeno (acoplamento fraco) para ver a energia passando de uma massa para a outra.</p><div id="lab-mol"></div>`),
      F.secao("lagrange", "A dedução pela lagrangiana", R`${F.fig(fig, "x₁ e x₂: deslocamentos a partir do equilíbrio (com as molas relaxadas).")}
        ${F.demo("energias e equações", R`
          <p>(i) <b>Coordenadas:</b> $x_1$ e $x_2$. (ii) $T = \frac12m\dot x_1^2 + \frac12m\dot x_2^2$.</p>
          <p>(iii) <b>Potencial elástico</b> das três molas: a da esquerda estica $x_1$, a do meio estica $x_2 - x_1$, a da direita comprime $x_2$:</p>
          ${F.formula(R`V = \tfrac12kx_1^2 + \tfrac12k_c(x_2 - x_1)^2 + \tfrac12kx_2^2`)}
          <p>(iv) Euler–Lagrange: $\frac{d}{dt}(m\dot x_1) - \left[-kx_1 + k_c(x_2 - x_1)\right] = 0$, e o mesmo para $x_2$:</p>
          ${F.formula(R`m\ddot x_1 = -kx_1 - k_c(x_1 - x_2),\qquad m\ddot x_2 = -kx_2 - k_c(x_2 - x_1)`)}`)}
        ${F.demo("modos normais e equação de posição", R`
          <p>(v) Some e subtraia as equações. Com $S = x_1 + x_2$ e $D = x_1 - x_2$:</p>
          ${F.formula(R`m\ddot S = -kS,\qquad m\ddot D = -(k + 2k_c)D`)}
          <p>Dois MHS independentes ${F.ret("B15")}: $\omega_1 = \sqrt{k/m}$ (as massas juntas; a mola do meio nem estica) e $\omega_2 = \sqrt{(k + 2k_c)/m}$ (opostas).</p>
          <p>(vi) Soltas do repouso em $x_1(0) = A$, $x_2(0) = B$: $S = (A + B)\cos\omega_1t$, $D = (A - B)\cos\omega_2t$. Voltando para $x_1 = \frac{S+D}{2}$, $x_2 = \frac{S-D}{2}$:</p>
          ${F.formula(R`x_1(t) = \frac{A+B}{2}\cos\omega_1t + \frac{A-B}{2}\cos\omega_2t,\qquad x_2(t) = \frac{A+B}{2}\cos\omega_1t - \frac{A-B}{2}\cos\omega_2t`, "Equações de posição")}
          <p>(Conferido com sympy: satisfaz as duas equações e as condições iniciais.)</p>`)}
        <h3>Batimento</h3>
        <p>Com $B = 0$ e soma de cossenos em produto: $x_1 = A\cos\left(\frac{\omega_2-\omega_1}{2}t\right)\cos\left(\frac{\omega_1+\omega_2}{2}t\right)$ e $x_2 = A\sin\left(\frac{\omega_2-\omega_1}{2}t\right)\sin\left(\frac{\omega_1+\omega_2}{2}t\right)$. Uma oscilação rápida dentro de uma envoltória lenta: a energia vai e volta entre as massas com período $\frac{2\pi}{\omega_2 - \omega_1}$. É o mesmo batimento de duas notas quase iguais no violão ${F.ret("B18")} e o mesmo que liga os dois modos do pêndulo duplo ${F.ret("EP02")}.</p>`),
      F.secao("exercicio", "Exercício", ex),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-mol"); e.outerHTML = F.lab("Duas massas e três molas", "lab-mol"); SIM.duasMolas(document.getElementById("lab-mol"), F); },
});
