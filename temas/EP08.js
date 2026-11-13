/* EP08 · Pêndulo triplo. Forma matricial geral conferida contra sympy (resíduo ~1e-15, exp2.py); modos normais com numpy. */
F.registrar("EP08", {
  retoma: ["EP02"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 8</div><div class="q">Se o pêndulo duplo já é caótico, o que um terceiro elo acrescenta?</div></div>`),
      F.secao("experimento", "Experimento", R`<p>Arraste as massas. Teste o modo normal mais lento (ângulos pequenos) e depois o caos com o gêmeo ligado.</p><div id="lab-p3"></div>`),
      F.secao("lagrange", "A dedução (para n elos)", R`
        ${F.demo("lagrangiana geral", R`
          <p>(i) Massa $k$ (de 1 a $n$) na posição $\vec r_k = \sum_{i\le k}\ell_i(\sin\theta_i,\ -\cos\theta_i)$.</p>
          <p>(ii) Velocidade $\dot{\vec r}_k = \sum_{i\le k}\ell_i\dot\theta_i(\cos\theta_i,\ \sin\theta_i)$, e $\dot{\vec r}_k^2 = \sum_{i,j\le k}\ell_i\ell_j\dot\theta_i\dot\theta_j\cos(\theta_i - \theta_j)$.</p>
          <p>(iii) Somando as energias e trocando a ordem das somas, cada par $(i, j)$ aparece com a massa de tudo o que está <b>abaixo</b> do mais baixo dos dois:</p>
          ${F.formula(R`T = \frac12\sum_{i,j}M_{ij}\ell_i\ell_j\cos(\theta_i - \theta_j)\,\dot\theta_i\dot\theta_j,\qquad V = -g\sum_iM_{ii}\ell_i\cos\theta_i,\qquad M_{ij} = \sum_{k\ge\max(i,j)}m_k`)}
          <p>(iv) Euler–Lagrange em cada $\theta_i$ (os termos com $\dot\theta_i\dot\theta_j\sin$ se cancelam como no pêndulo duplo ${F.ret("EP02")}):</p>
          ${F.formula(R`\sum_jM_{ij}\ell_i\ell_j\cos(\theta_i - \theta_j)\,\ddot\theta_j = -\sum_jM_{ij}\ell_i\ell_j\sin(\theta_i - \theta_j)\,\dot\theta_j^2 - gM_{ii}\ell_i\sin\theta_i`)}
          <p>(v) Para $n = 3$ são 3 equações lineares em $\ddot\theta_1, \ddot\theta_2, \ddot\theta_3$; o experimento resolve esse sistema 3×3 a cada passo (eliminação de Gauss) e integra com Runge–Kutta. Com $n = 2$, volta exatamente o pêndulo duplo; com $n = 1$, o simples.</p>`)}`),
      F.secao("resultados", "Os resultados", R`
        <p><b>Modos normais</b> (massas e fios iguais, ângulos pequenos): $\mathbf M\ddot{\boldsymbol\theta} = -\frac g\ell\mathbf K\boldsymbol\theta$ com $\mathbf M = \begin{pmatrix}3&2&1\\2&2&1\\1&1&1\end{pmatrix}$ e $\mathbf K = \text{diag}(3, 2, 1)$. Os autovalores dão $\omega^2/(g/\ell) \approx 0{,}416;\ 2{,}294;\ 6{,}290$. O mais lento tem as três massas para o mesmo lado, $(1 : 1{,}29 : 1{,}63)$; o mais rápido alterna.</p>
        <p><b>Caos:</b> com ângulos grandes, a separação entre os gêmeos cresce ainda mais rápido que no duplo. Três graus de liberdade (seis números de estado) dão mais "espaço" para o movimento se embaralhar.</p>
        ${F.caixa("ponte", R`<p>Com $n \to \infty$ elos curtos, o pêndulo vira uma <b>corrente pendurada</b>, um meio contínuo: as equações viram uma equação de onda com velocidade variável (o problema da corrente vibrando, resolvido por Daniel Bernoulli e Euler com funções de Bessel).</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-p3"); e.outerHTML = F.lab("Pêndulo triplo", "lab-p3"); SIM.penduloTriplo(document.getElementById("lab-p3"), F); },
});
