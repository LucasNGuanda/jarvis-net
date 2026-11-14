/* EP10 · Dois discos rolando ligados por molas (o vídeo do TikTok @_ctnbeh_ que o Lucas mandou).
   Conferido com sympy (scratchpad discos.py): a Hessiana da energia exata das molas em φ = ψ = 0 é exatamente a matriz K do vídeo,
   com as molas horizontais nas alturas r₁ + a e r₂ − b. Números do exercício: m₁ = 2 kg, r₁ = 0,30 m, a = 0,10 m, m₂ = 1 kg, r₂ = 0,25 m,
   b = 0,08 m, k₁ = 40 N/m, k₂ = 30 N/m → κ = 7,267 N·m, A = 0,27, B = 0,09375 kg·m², ω = 10,22 rad/s, T = 0,615 s, φ/ψ = −25/72. */
F.registrar("EP10", {
  retoma: ["EP08", "A20", "U03"],
  html(F) {
    const R = String.raw;
    const ex = F.exercicio({ n: 1, enun: R`<p><b>Exercício.</b> Use os valores do laboratório: $m_1 = 2$ kg, $r_1 = 0{,}30$ m, $a = 0{,}10$ m; $m_2 = 1$ kg, $r_2 = 0{,}25$ m, $b = 0{,}08$ m; $k_1 = 40$ N/m e $k_2 = 30$ N/m. (a) Calcule $\kappa = k_1(r_1 + a)^2 + k_2(r_2 - b)^2$. (b) Ache a frequência angular e o período do modo que oscila. (c) Nesse modo, qual a razão entre as amplitudes $\varphi_0/\psi_0$? Qual disco gira mais? (d) Por que, partindo do repouso com $\varphi_0 = 5°$ e $\psi_0 = 0$, o modo linear nunca leva a colisões, mas com um empurrão $\dot\psi_0 \ne 0$ os discos sempre acabam batendo?</p>`,
      dicas: [R`<p>(b) $\det(K - \omega^2M) = 0$ dá $\omega^2 = \kappa\left(\frac1A + \frac1B\right)$, com $A = \frac32m_1r_1^2$ e $B = \frac32m_2r_2^2$.</p>`, R`<p>(d) Some as duas equações: $A\ddot\varphi + B\ddot\psi = 0$. O que isso conserva?</p>`],
      resp: R`(a) $\kappa \approx 7{,}27$ N·m; (b) $\omega \approx 10{,}2$ rad/s, $T \approx 0{,}61$ s; (c) $\varphi_0/\psi_0 = -B/A = -25/72$: o disco 2 gira quase 3 vezes mais, no sentido oposto; (d) veja a resolução.`,
      sol: R`<p>(a) $40(0{,}40)^2 + 30(0{,}17)^2 = 6{,}40 + 0{,}867 = 7{,}267$ N·m.</p>
        <p>(b) $A = \frac32\cdot2\cdot0{,}09 = 0{,}27$ kg·m², $B = \frac32\cdot1\cdot0{,}0625 = 0{,}09375$ kg·m². $\omega^2 = 7{,}267(3{,}704 + 10{,}667) \approx 104{,}4$, $\omega \approx 10{,}22$ rad/s, $T = 2\pi/\omega \approx 0{,}615$ s. Compare com o laboratório (leitor "ω do modo que oscila").</p>
        <p>(c) Da 1ª linha de $(K - \omega^2M)\vec v = 0$: $\kappa(v_1 - v_2) = \omega^2Av_1 \Rightarrow \frac{v_1}{v_2} = -\frac BA = -\frac{25}{72} \approx -0{,}35$.</p>
        <p>(d) $A\ddot\varphi + B\ddot\psi = 0$ conserva $p = A\dot\varphi + B\dot\psi$ (o "momento" do modo de frequência zero). Do repouso, $p = 0$: só o modo que oscila é excitado, e com 5° os discos só balançam. Com $\dot\psi_0 \neq 0$, $p \neq 0$ e o conjunto "anda" sem parar até bater numa parede: aí $p$ muda de sinal e ele volta. É por isso que o vídeo conta colisões sem fim.</p>` });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mola · discos rolando</div><div class="q">Dois discos rolam no chão, ligados por duas molas, entre duas paredes. De onde sai aquela matriz $M\ddot q + Kq = 0$ do vídeo, e por que eles não param de bater?</div>
        <p>O vídeo (TikTok @_ctnbeh_) mostra a equação e a animação, mas não a dedução. Aqui ela está passo a passo, com a física de cada termo, e com o que a equação deixa de fora.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Comece com o modo "molas de verdade", $\varphi_0 = 40°$ e um empurrão no disco 2. Depois ponha $\dot\psi_0 = 0$ e um ângulo pequeno: os discos só oscilam, sem bater. Compare os dois modos com ângulos grandes.</p><div id="lab-dis"></div>`),
      F.secao("lagrange", "A dedução pela lagrangiana", R`
        ${F.demo("energia cinética de um disco que rola", R`
          <p>(i) <b>Coordenadas:</b> os ângulos $\varphi$ e $\psi$ (horário positivo). Rolar sem deslizar ($\mu \neq 0$, o ponto de contato P fica parado) amarra o centro ao ângulo: $x_1 = r_1\varphi$, $x_2 = r_2\psi$. São só 2 graus de liberdade.</p>
          <p>(ii) $T = \frac12mv^2 + \frac12I\omega^2$ com $v = r\dot\varphi$ e $I = \frac12mr^2$ (disco):</p>
          ${F.formula(R`T = \tfrac12m_1r_1^2\dot\varphi^2 + \tfrac14m_1r_1^2\dot\varphi^2 + (\text{igual para o 2}) = \tfrac34m_1r_1^2\dot\varphi^2 + \tfrac34m_2r_2^2\dot\psi^2`)}
          <p>Derivando, $\frac{d}{dt}\frac{\partial T}{\partial\dot\varphi} = \frac32m_1r_1^2\ddot\varphi$: é daí que vem o $\frac32$ da matriz de massa. (É o momento de inércia em relação ao ponto de contato, $I_P = \frac12mr^2 + mr^2$, por Steiner.)</p>`)}
        ${F.demo("energia das molas e a matriz K", R`
          <p>(iii) Rolando, o disco gira em torno do ponto de contato. Um ponto a uma altura $h$ do chão anda, na horizontal, $h\varphi$ (para ângulo pequeno). Com a mola 1 horizontal na altura $r_1 + a$ e a mola 2 na altura $r_2 - b$, as pontas de cada mola andam $h\varphi$ e $h\psi$, e cada mola estica $h(\psi - \varphi)$:</p>
          ${F.formula(R`V = \tfrac12k_1(r_1 + a)^2(\psi - \varphi)^2 + \tfrac12k_2(r_2 - b)^2(\psi - \varphi)^2 = \tfrac12\kappa(\psi - \varphi)^2`)}
          <p>(iv) Euler–Lagrange para $\varphi$ e $\psi$ ${F.ret("U03")}:</p>
          ${F.formula(R`\begin{bmatrix}\frac32m_1r_1^2 & 0\\ 0 & \frac32m_2r_2^2\end{bmatrix}\begin{bmatrix}\ddot\varphi\\ \ddot\psi\end{bmatrix} + \begin{bmatrix}\kappa & -\kappa\\ -\kappa & \kappa\end{bmatrix}\begin{bmatrix}\varphi\\ \psi\end{bmatrix} = \begin{bmatrix}0\\ 0\end{bmatrix},\qquad \kappa = k_1(r_1 + a)^2 + k_2(r_2 - b)^2`, "É a equação do vídeo")}
          <p>Conferi com sympy: escrevendo a energia exata das molas (com as pontas girando junto com os discos) e calculando a matriz das derivadas segundas em $\varphi = \psi = 0$, sai exatamente essa $K$.</p>`)}
        ${F.demo("modos normais", R`
          <p>(v) $\det(K - \omega^2M) = 0$ com $M = \text{diag}(A, B)$: $(\kappa - \omega^2A)(\kappa - \omega^2B) = \kappa^2$, ou seja, $\omega^2\left[AB\omega^2 - \kappa(A + B)\right] = 0$.</p>
          ${F.formula(R`\omega_1 = 0\ \ (\varphi = \psi:\ \text{as molas nem esticam}),\qquad \omega_2 = \sqrt{\kappa\left(\frac1A + \frac1B\right)}\ \ \left(\frac\varphi\psi = -\frac BA\right)`)}
          <p>(vi) O modo de frequência zero não volta: os dois discos giram do mesmo ângulo e o conjunto "anda". Somando as equações, $A\ddot\varphi + B\ddot\psi = 0$, então $A\dot\varphi + B\dot\psi$ é constante entre as colisões. Se não for zero, o conjunto sempre chega numa parede: daí as colisões sem fim do vídeo. Compare com as duas massas e três molas ${F.ret("EP08")}: lá as molas das pontas "seguram" o modo lento; aqui não há nada segurando.</p>`)}
        <h3>Colisões</h3>
        <p>As colisões não estão na equação: são eventos instantâneos. No laboratório, cada batida (disco–parede ou disco–disco) é elástica ($e = 1$) e mantém o rolamento (o atrito do chão dá o impulso necessário para o disco não escorregar; isso é uma hipótese do modelo). Com a restrição, a colisão é como uma batida em 1D entre "massas efetivas" $\frac32m_1$ e $\frac32m_2$: a força entre os discos passa pelos dois centros e não dá torque neles.</p>
        ${F.caixa("pegadinha", R`<p><b>O que a equação do vídeo deixa de fora:</b></p>
          <ul><li><b>A massa variando</b>, $m(t)$: com $M(t)$, Lagrange dá $\frac{d}{dt}(M\dot q) = M\ddot q + \dot M\dot q$; a equação do vídeo não tem o termo $\dot M\dot q$. E, se a massa sai ou entra com alguma velocidade, é preciso dizer como (é o problema do foguete). No laboratório as massas são constantes.</li>
            <li><b>Ângulos grandes</b>: a matriz $K$ é só a linearização. No vídeo os discos giram mais de 90°, e aí as molas mudam de direção e de comprimento de um jeito não linear. Compare os dois modos do laboratório.</li>
            <li><b>Onde ficam as molas</b>: no desenho do vídeo, as pontas das molas aparecem em diagonal. A matriz mostrada é a certa para molas horizontais no equilíbrio, nas alturas $r_1 + a$ e $r_2 - b$; foi essa a montagem do laboratório.</li></ul>`)}`),
      F.secao("exercicio", "Exercício", ex),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-dis"); e.outerHTML = F.lab("Dois discos, duas molas e duas paredes", "lab-dis"); SIM.discos(document.getElementById("lab-dis"), F); },
});
