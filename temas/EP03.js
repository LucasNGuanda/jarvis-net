/* EP03 · Pêndulo triplo. Forma matricial geral conferida contra sympy (resíduo ~1e-15, exp2.py); modos normais com numpy. */
F.registrar("EP03", {
  retoma: ["EP02"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 8</div><div class="q">Se o pêndulo duplo já é caótico, o que um terceiro elo acrescenta?</div></div>`),
      F.secao("experimento", "Experimento", R`<p>Arraste as massas. Teste o modo normal mais lento (ângulos pequenos) e depois o caos com o gêmeo ligado.</p><div id="lab-p3"></div>`),
      F.secao("lagrange", "A dedução pela lagrangiana, passo a passo", R`
        ${F.fig(D.svg(320, 380, `<line x1="100" y1="24" x2="220" y2="24" style="stroke:var(--ink3);stroke-width:5"/><line x1="160" y1="24" x2="200" y2="120" class="ln"/><circle cx="200" cy="120" r="11" style="fill:var(--mA)"/><line x1="200" y1="120" x2="150" y2="220" class="ln"/><circle cx="150" cy="220" r="11" style="fill:var(--mU)"/><line x1="150" y1="220" x2="200" y2="330" class="ln"/><circle cx="200" cy="330" r="11" style="fill:var(--mC)"/>${["θ₁", "θ₂", "θ₃"].map((t2, i) => D.txt([172, 186, 160][i], [64, 166, 270][i], t2, "txm", "start")).join("")}${D.txt(214, 126, "m₁", "txm", "start")}${D.txt(132, 226, "m₂", "txm", "end")}${D.txt(214, 336, "m₃", "txm", "start")}`, "pêndulo triplo"), "Três ângulos medidos da vertical. Origem na suspensão, y para cima.")}
        ${F.demo("1 · equações de posição", R`
          <p>Cada massa fica onde a anterior está, mais o seu fio:</p>
          ${F.formula(R`\begin{aligned}x_1 &= \ell_1\sin\theta_1, & y_1 &= -\ell_1\cos\theta_1\\ x_2 &= \ell_1\sin\theta_1 + \ell_2\sin\theta_2, & y_2 &= -\ell_1\cos\theta_1 - \ell_2\cos\theta_2\\ x_3 &= \ell_1\sin\theta_1 + \ell_2\sin\theta_2 + \ell_3\sin\theta_3, & y_3 &= -\ell_1\cos\theta_1 - \ell_2\cos\theta_2 - \ell_3\cos\theta_3\end{aligned}`)}`)}
        ${F.demo("2 · velocidades (derivando no tempo)", R`
          ${F.formula(R`\begin{aligned}\dot x_1 &= \ell_1\cos\theta_1\,\dot\theta_1, & \dot y_1 &= \ell_1\sin\theta_1\,\dot\theta_1\\ \dot x_2 &= \dot x_1 + \ell_2\cos\theta_2\,\dot\theta_2, & \dot y_2 &= \dot y_1 + \ell_2\sin\theta_2\,\dot\theta_2\\ \dot x_3 &= \dot x_2 + \ell_3\cos\theta_3\,\dot\theta_3, & \dot y_3 &= \dot y_2 + \ell_3\sin\theta_3\,\dot\theta_3\end{aligned}`)}
          <p>Ao elevar ao quadrado, cada par $(i, j)$ dá $\ell_i\ell_j\dot\theta_i\dot\theta_j(\cos\theta_i\cos\theta_j + \sin\theta_i\sin\theta_j) = \ell_i\ell_j\dot\theta_i\dot\theta_j\cos(\theta_i - \theta_j)$:</p>
          ${F.formula(R`\begin{aligned}v_1^2 &= \ell_1^2\dot\theta_1^2\\ v_2^2 &= \ell_1^2\dot\theta_1^2 + \ell_2^2\dot\theta_2^2 + 2\ell_1\ell_2\dot\theta_1\dot\theta_2\cos(\theta_1 - \theta_2)\\ v_3^2 &= v_2^2 + \ell_3^2\dot\theta_3^2 + 2\ell_1\ell_3\dot\theta_1\dot\theta_3\cos(\theta_1 - \theta_3) + 2\ell_2\ell_3\dot\theta_2\dot\theta_3\cos(\theta_2 - \theta_3)\end{aligned}`)}`)}
        ${F.demo("3 · energias e lagrangiana", R`
          <p>$T = \frac12m_1v_1^2 + \frac12m_2v_2^2 + \frac12m_3v_3^2$. Juntando os termos iguais:</p>
          ${F.formula(R`\begin{aligned}T = {}&\tfrac12(m_1+m_2+m_3)\ell_1^2\dot\theta_1^2 + \tfrac12(m_2+m_3)\ell_2^2\dot\theta_2^2 + \tfrac12m_3\ell_3^2\dot\theta_3^2\\ &+ (m_2+m_3)\ell_1\ell_2\dot\theta_1\dot\theta_2\cos(\theta_1-\theta_2) + m_3\ell_1\ell_3\dot\theta_1\dot\theta_3\cos(\theta_1-\theta_3) + m_3\ell_2\ell_3\dot\theta_2\dot\theta_3\cos(\theta_2-\theta_3)\end{aligned}`)}
          ${F.formula(R`V = m_1gy_1 + m_2gy_2 + m_3gy_3 = -(m_1+m_2+m_3)g\ell_1\cos\theta_1 - (m_2+m_3)g\ell_2\cos\theta_2 - m_3g\ell_3\cos\theta_3`)}
          <p>Repare no padrão: cada fio "carrega" a massa de tudo o que está abaixo dele. $\mathcal L = T - V$.</p>`)}
        ${F.demo("4 · Euler–Lagrange para θ₁ (com todas as contas)", R`
          <p>$\frac{\partial\mathcal L}{\partial\dot\theta_1} = (m_1+m_2+m_3)\ell_1^2\dot\theta_1 + (m_2+m_3)\ell_1\ell_2\dot\theta_2\cos(\theta_1-\theta_2) + m_3\ell_1\ell_3\dot\theta_3\cos(\theta_1-\theta_3)$.</p>
          <p>Derivando no tempo (regra do produto: $\frac{d}{dt}\cos(\theta_1-\theta_2) = -\sin(\theta_1-\theta_2)(\dot\theta_1-\dot\theta_2)$):</p>
          $$\begin{aligned}\tfrac{d}{dt}\tfrac{\partial\mathcal L}{\partial\dot\theta_1} = {}&(m_1+m_2+m_3)\ell_1^2\ddot\theta_1 + (m_2+m_3)\ell_1\ell_2\left[\ddot\theta_2\cos(\theta_1-\theta_2) - \dot\theta_2(\dot\theta_1-\dot\theta_2)\sin(\theta_1-\theta_2)\right]\\ &+ m_3\ell_1\ell_3\left[\ddot\theta_3\cos(\theta_1-\theta_3) - \dot\theta_3(\dot\theta_1-\dot\theta_3)\sin(\theta_1-\theta_3)\right]\end{aligned}$$
          <p>$\frac{\partial\mathcal L}{\partial\theta_1} = -(m_2+m_3)\ell_1\ell_2\dot\theta_1\dot\theta_2\sin(\theta_1-\theta_2) - m_3\ell_1\ell_3\dot\theta_1\dot\theta_3\sin(\theta_1-\theta_3) - (m_1+m_2+m_3)g\ell_1\sin\theta_1$.</p>
          <p>Subtraindo, os termos com $\dot\theta_1\dot\theta_2$ e $\dot\theta_1\dot\theta_3$ se cancelam e sobram os $\dot\theta^2$. Dividindo por $\ell_1$:</p>
          ${F.formula(R`(m_1{+}m_2{+}m_3)\ell_1\ddot\theta_1 + (m_2{+}m_3)\ell_2\ddot\theta_2\cos(\theta_1{-}\theta_2) + m_3\ell_3\ddot\theta_3\cos(\theta_1{-}\theta_3) + (m_2{+}m_3)\ell_2\dot\theta_2^2\sin(\theta_1{-}\theta_2) + m_3\ell_3\dot\theta_3^2\sin(\theta_1{-}\theta_3) + (m_1{+}m_2{+}m_3)g\sin\theta_1 = 0`, "Equação de θ₁")}`)}
        ${F.demo("5 · as outras duas (mesmo procedimento)", R`
          <p>Para $\theta_2$ (dividindo por $\ell_2$):</p>
          ${F.formula(R`(m_2{+}m_3)\ell_1\ddot\theta_1\cos(\theta_1{-}\theta_2) + (m_2{+}m_3)\ell_2\ddot\theta_2 + m_3\ell_3\ddot\theta_3\cos(\theta_2{-}\theta_3) - (m_2{+}m_3)\ell_1\dot\theta_1^2\sin(\theta_1{-}\theta_2) + m_3\ell_3\dot\theta_3^2\sin(\theta_2{-}\theta_3) + (m_2{+}m_3)g\sin\theta_2 = 0`, "Equação de θ₂")}
          <p>Para $\theta_3$ (dividindo por $m_3\ell_3$):</p>
          ${F.formula(R`\ell_1\ddot\theta_1\cos(\theta_1{-}\theta_3) + \ell_2\ddot\theta_2\cos(\theta_2{-}\theta_3) + \ell_3\ddot\theta_3 - \ell_1\dot\theta_1^2\sin(\theta_1{-}\theta_3) - \ell_2\dot\theta_2^2\sin(\theta_2{-}\theta_3) + g\sin\theta_3 = 0`, "Equação de θ₃")}
          <p>Conferi as três com álgebra simbólica (sympy): saem exatamente da lagrangiana.</p>`)}
        ${F.demo("6 · forma matricial (como o simulador usa)", R`
          <p>As três equações são lineares nas acelerações. Escrevendo $M_{ij} = \sum_{k\ge\max(i,j)}m_k$ (a massa "pendurada" abaixo do mais baixo dos dois fios):</p>
          ${F.formula(R`\sum_jM_{ij}\ell_i\ell_j\cos(\theta_i - \theta_j)\,\ddot\theta_j = -\sum_jM_{ij}\ell_i\ell_j\sin(\theta_i - \theta_j)\,\dot\theta_j^2 - gM_{ii}\ell_i\sin\theta_i`)}
          <p>A cada passo de tempo, o experimento monta essa matriz 3×3, resolve o sistema (eliminação de Gauss) e avança com Runge–Kutta. A mesma fórmula serve para $n$ elos; com $n = 2$ volta o pêndulo duplo ${F.ret("EP02")}.</p>`)}`),
      F.secao("resultados", "Os resultados", R`
        <p><b>Modos normais</b> (massas e fios iguais, ângulos pequenos): $\mathbf M\ddot{\boldsymbol\theta} = -\frac g\ell\mathbf K\boldsymbol\theta$ com $\mathbf M = \begin{pmatrix}3&2&1\\2&2&1\\1&1&1\end{pmatrix}$ e $\mathbf K = \text{diag}(3, 2, 1)$. Os autovalores dão $\omega^2/(g/\ell) \approx 0{,}416;\ 2{,}294;\ 6{,}290$. O mais lento tem as três massas para o mesmo lado, $(1 : 1{,}29 : 1{,}63)$; o mais rápido alterna.</p>
        <p><b>Caos:</b> com ângulos grandes, a separação entre os gêmeos cresce ainda mais rápido que no duplo. Três graus de liberdade (seis números de estado) dão mais "espaço" para o movimento se embaralhar.</p>
        ${F.caixa("ponte", R`<p>Com $n \to \infty$ elos curtos, o pêndulo vira uma <b>corrente pendurada</b>, um meio contínuo: as equações viram uma equação de onda com velocidade variável (o problema da corrente vibrando, resolvido por Daniel Bernoulli e Euler com funções de Bessel).</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-p3"); e.outerHTML = F.lab("Pêndulo triplo", "lab-p3"); SIM.penduloTriplo(document.getElementById("lab-p3"), F); },
});
