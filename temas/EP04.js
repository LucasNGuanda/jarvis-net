/* EP04 · Pêndulo pendurado num bloco com mola (do TikTok: canal VIBRATIONS, "Pendulum Attached to a Mass").
   Equações deduzidas com sympy e iguais às da imagem (scratchpad exp2.py). */
F.registrar("EP04", {
  retoma: ["EP01", "B15"],
  html(F) {
    const R = String.raw;
    const fig = D.svg(300, 300, `<rect x="90" y="20" width="120" height="270" style="fill:none;stroke:var(--ink3);stroke-width:2"/><path d="M150 20 l-10 8 20 8 -20 8 20 8 -20 8 20 8 -10 6" class="ln"/><rect x="120" y="86" width="60" height="40" style="fill:var(--card2);stroke:var(--ink);stroke-width:2"/>${D.txt(200, 110, "M", "txm", "start")}${D.txt(166, 50, "k", "txm", "start")}<line x1="150" y1="106" x2="200" y2="220" class="ln"/><circle cx="200" cy="220" r="12" style="fill:var(--mod)"/>${D.txt(214, 226, "m", "txm", "start")}${D.txt(184, 160, "ℓ", "txm", "start")}<line x1="150" y1="106" x2="150" y2="230" class="ln2" style="stroke-dasharray:3 4"/>${D.txt(160, 150, "φ", "txm", "start")}${D.seta(260, 70, 260, 140, "var(--ink2)", 1.4)}${D.txt(268, 110, "x", "txm", "start")}`, "bloco e pêndulo");
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 4 · do TikTok</div><div class="q">Um bloco quica numa mola e um pêndulo pende dele. Se você só puxar o bloco, sem balançar o pêndulo, ele começa a balançar sozinho?</div><p class="det">Figura e equações de referência: canal VIBRATIONS (Стивен), publicação 79, "Pendulum Attached to a Mass". Aqui a dedução completa.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Comece pela <b>ressonância 2 : 1</b>: o pêndulo começa quase parado, e a energia vai migrando da mola para ele.</p><div id="lab-p4"></div>`),
      F.secao("lagrange", "A dedução pela lagrangiana", R`${F.fig(fig)}
        ${F.demo("posições, velocidades e energias", R`
          <p>(i) <b>Coordenadas:</b> $x$ (deslocamento do bloco para <b>baixo</b>, a partir do comprimento natural da mola) e $\varphi$ (ângulo do pêndulo com a vertical). O bloco só anda na vertical (trilho sem atrito, $\mu = 0$).</p>
          <p>(ii) <b>Posições</b> (eixo $Y$ para baixo): bloco $(0,\ x)$; peso $(\ell\sin\varphi,\ x + \ell\cos\varphi)$.</p>
          <p>(iii) <b>Velocidade do peso:</b> $(\ell\cos\varphi\,\dot\varphi,\ \dot x - \ell\sin\varphi\,\dot\varphi)$, então $v_m^2 = \dot x^2 + \ell^2\dot\varphi^2 - 2\ell\dot x\dot\varphi\sin\varphi$.</p>
          <p>(iv) $T = \frac12M\dot x^2 + \frac12m\left(\dot x^2 + \ell^2\dot\varphi^2 - 2\ell\dot x\dot\varphi\sin\varphi\right)$.</p>
          <p>(v) $V = \frac12kx^2 - Mgx - mg(x + \ell\cos\varphi)$ (com $Y$ para baixo, a energia gravitacional é $-mgY$).</p>
          <p>(vi) $\mathcal L = T - V$.</p>`)}
        ${F.demo("Euler–Lagrange", R`
          <p>(vii) Para $x$: $\frac{\partial\mathcal L}{\partial\dot x} = (M+m)\dot x - m\ell\dot\varphi\sin\varphi$; derivando: $(M+m)\ddot x - m\ell\ddot\varphi\sin\varphi - m\ell\dot\varphi^2\cos\varphi$. E $\frac{\partial\mathcal L}{\partial x} = -kx + (M+m)g$.</p>
          ${F.formula(R`(M+m)\ddot x - m\ell\ddot\varphi\sin\varphi - m\ell\dot\varphi^2\cos\varphi + kx = (M+m)g`)}
          <p>(viii) Para $\varphi$: $\frac{\partial\mathcal L}{\partial\dot\varphi} = m\ell^2\dot\varphi - m\ell\dot x\sin\varphi$; derivando: $m\ell^2\ddot\varphi - m\ell\ddot x\sin\varphi - m\ell\dot x\dot\varphi\cos\varphi$. E $\frac{\partial\mathcal L}{\partial\varphi} = -m\ell\dot x\dot\varphi\cos\varphi - mg\ell\sin\varphi$. Os termos $\dot x\dot\varphi\cos\varphi$ se cancelam:</p>
          ${F.formula(R`m\ell^2\ddot\varphi - m\ell\ddot x\sin\varphi + mg\ell\sin\varphi = 0`)}
          <p>São exatamente as duas equações da imagem do TikTok (conferi com álgebra simbólica).</p>`)}`),
      F.secao("resultados", "Os resultados", R`
        <p><b>Equilíbrio:</b> $x_0 = (M+m)g/k$, $\varphi = 0$. <b>Pequenas oscilações:</b> em primeira ordem, os termos de acoplamento ($\ddot\varphi\sin\varphi$, $\dot\varphi^2$, $\ddot x\sin\varphi$) são de segunda ordem e somem: o bloco oscila com $\omega_m = \sqrt{k/(M+m)}$ e o pêndulo com $\omega_p = \sqrt{g/\ell}$, independentes.</p>
        <p><b>Mas o acoplamento não linear importa.</b> Divida a 2ª equação por $m\ell^2$: $\ddot\varphi + \frac{g - \ddot x}{\ell}\sin\varphi = 0$. É um pêndulo num "elevador" cuja gravidade efetiva $g - \ddot x$ oscila com a frequência da mola. Para ângulos pequenos, é a <b>equação de Mathieu</b>, e ela é instável quando a gravidade efetiva oscila no <b>dobro</b> da frequência natural do pêndulo:</p>
        ${F.formula(R`\omega_m = 2\,\omega_p\quad\Longleftrightarrow\quad k = \frac{4(M+m)g}{\ell}`, "Ressonância paramétrica")}
        <p>É o mesmo mecanismo de quem se balança num balanço subindo e agachando (duas vezes por ciclo), e do "pêndulo-mola" que troca energia entre modos. Fora da razão 2 : 1, o pêndulo quase não é afetado.</p>`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-p4"); e.outerHTML = F.lab("Bloco na mola com pêndulo", "lab-p4"); SIM.massaPendulo(document.getElementById("lab-p4"), F); },
});
