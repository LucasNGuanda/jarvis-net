/* N04 · Tensor de tensões e viscosidade. Conferido em Python:
   Couette (óleo μ = 0,1 Pa·s, placas a 1 mm, U = 1 m/s, área 0,01 m²): τ = 100 Pa, F = 1 N, potência 100 W/m²;
   σ = [[−100, 30], [30, −100]] Pa: vetor tensão em n = (1,0): (−100, 30); em n = (1,1)/√2: (−49,5; −49,5), componente normal −70 Pa;
   gotinha de névoa (r = 10 μm) no ar: velocidade terminal de Stokes 1,21 cm/s. */
F.registrar("N04", {
  retoma: ["N03", "U01", "CII06"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Tensões num fluido",
      casos: [
        { nome: "Escoamento de Couette", gerar: (p) => {
          const L = [["água", 1e-3], ["óleo de motor", 0.1], ["mel", 10]], [nome, mu] = p ? L[1] : F.escolha(L);
          const h = p ? 1 : F.escolha([0.5, 1, 2]), U = p ? 1 : F.escolha([0.5, 1, 2]), A = 0.01, tau = (mu * U) / (h / 1000);
          return { enun: R`<p>Uma placa de 100 cm² desliza a ${F.n(U)} m/s sobre uma camada de ${nome} ($\mu = ${F.n(mu, 4)}$ Pa·s) de ${F.n(h)} mm, apoiada sobre uma placa parada. Qual a força para manter a placa andando?</p>`, fig: "",
            passos: [R`<p>O fluido gruda nas duas placas (condição de não deslizamento) e o perfil de velocidade é linear: $u(y) = U\frac yh$, com $\frac{du}{dy} = \frac Uh$.</p>`, R`<p>Lei de Newton da viscosidade: $\tau = \mu\frac{du}{dy} = ${F.n(mu, 4)}\cdot\frac{${F.n(U)}}{${F.n(h / 1000)}} \approx ${F.n(tau, 3)}$ Pa.</p>`, R`<p>$F = \tau A \approx ${F.n(tau * A, 4)}$ N. A potência dissipada (vira calor) é $FU \approx ${F.n(tau * A * U, 4)}$ W.</p>`] };
        } },
        { nome: "Vetor tensão num plano", gerar: (p) => {
          const P = p ? 100 : F.escolha([50, 100, 200]), t = p ? 30 : F.escolha([10, 30, 60]);
          return { enun: R`<p>Num ponto de um fluido, o tensor de tensões (no plano $xy$) é $\sigma = \begin{pmatrix}-${P} & ${t}\\ ${t} & -${P}\end{pmatrix}$ Pa. Qual a força por área num plano com normal $\hat n = (1, 1)/\sqrt2$? Qual a componente normal?</p>`, fig: "",
            passos: [R`<p>Vetor tensão (Cauchy): $\vec t = \sigma\hat n = \frac{1}{\sqrt2}(-${P} + ${t},\ ${t} - ${P})$.</p>`, R`<p>$\vec t \approx (${F.n((t - P) / Math.SQRT2, 2)};\ ${F.n((t - P) / Math.SQRT2, 2)})$ Pa.</p>`, R`<p>Normal: $\vec t\cdot\hat n = -${P} + ${t} = ${t - P}$ Pa. Nesse plano a tensão é só normal (sem cisalhamento): $(1,1)$ é uma <b>direção principal</b> de $\sigma$, com autovalor $-p + \tau$ ${F.ret("CII06")}.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Por que o tensor de tensões é simétrico",
      enun: R`<p>Considere um quadradinho de fluido de lado $\ell$ (espessura 1 na direção $z$), com massa $\rho\ell^2$. As tensões de cisalhamento nas faces são $\sigma_{xy}$ (força na direção $y$ nas faces de normal $x$) e $\sigma_{yx}$ (força na direção $x$ nas faces de normal $y$). (a) Calcule o torque dessas forças em torno do centro. (b) O momento de inércia do quadradinho é $\frac16\rho\ell^4$. Escreva a aceleração angular. (c) O que acontece quando $\ell \to 0$ se $\sigma_{xy} \neq \sigma_{yx}$? Conclua. (d) Quantos números independentes o tensor de tensões tem em 3D?</p>`,
      fig: "",
      dicas: [R`<p>(a) Cada par de faces dá um binário: força $\sigma\ell$ (por unidade de espessura) com braço $\ell$.</p>`, R`<p>(c) A aceleração angular fica $\propto 1/\ell^2$.</p>`],
      sol: R`<p><b>(a)</b> As duas faces de normal $\pm x$ têm forças $\pm\sigma_{xy}\ell$ na direção $y$, separadas por $\ell$: torque $\sigma_{xy}\ell^2$ (anti-horário). As de normal $\pm y$ dão $-\sigma_{yx}\ell^2$. Total: $(\sigma_{xy} - \sigma_{yx})\ell^2$.</p>
        <p><b>(b)</b> $\alpha = \frac{(\sigma_{xy} - \sigma_{yx})\ell^2}{\frac16\rho\ell^4} = \frac{6(\sigma_{xy} - \sigma_{yx})}{\rho\ell^2}$.</p>
        <p><b>(c)</b> Com $\ell \to 0$, $\alpha \to \infty$: pedacinhos cada vez menores girariam cada vez mais rápido, sem limite. Isso não acontece; então $\sigma_{xy} = \sigma_{yx}$: o tensor é <b>simétrico</b>. (As forças de volume, como o peso, dão torque $\propto\ell^3$ e não atrapalham.)</p>
        <p><b>(d)</b> Uma matriz simétrica $3\times3$ tem 6 números independentes: 3 normais ($\sigma_{xx}, \sigma_{yy}, \sigma_{zz}$) e 3 de cisalhamento. Por ser simétrica, sempre tem 3 direções principais perpendiculares (teorema espectral), em que só há tensão normal. É assim que engenheiros acham onde uma peça vai quebrar.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Fluidos · tensões e viscosidade</div>
        <div class="q">O que faz o mel ser "grosso"?</div>
        <p>Camadas de fluido andando com velocidades diferentes se arrastam umas às outras: é o atrito interno, a <b>viscosidade</b>. Para descrever isso, não basta a pressão (que empurra igual para todos os lados): é preciso dizer, em cada ponto, a força por área em cada plano e em cada direção. Esse objeto é o <b>tensor de tensões</b>, e escrever a viscosidade nele é o último passo antes de Navier–Stokes (N05).</p></div>`),

      F.secao("tensor", "O tensor de tensões", R`
        ${F.formula(R`\vec t(\hat n) = \sigma\,\hat n\qquad\qquad \sigma = \begin{pmatrix}\sigma_{xx} & \sigma_{xy} & \sigma_{xz}\\ \sigma_{yx} & \sigma_{yy} & \sigma_{yz}\\ \sigma_{zx} & \sigma_{zy} & \sigma_{zz}\end{pmatrix},\quad \sigma_{ij} = \sigma_{ji}`, "Tensor de tensões de Cauchy")}
        <p>Corte o fluido por um plano imaginário com normal $\hat n$. O lado de fora faz no de dentro uma força por área $\vec t$, que em geral <b>não</b> é paralela a $\hat n$: tem uma parte normal (compressão ou tração) e uma tangencial (cisalhamento). Cauchy (1822) mostrou que $\vec t$ depende de $\hat n$ de forma linear, por uma matriz: o tensor $\sigma$. Ele é simétrico (chefão).</p>
        <p><b>Fluido parado</b>: não aguenta cisalhamento (por isso ele escoa). Só sobra a pressão, igual em todas as direções (Pascal): $\sigma = -p\,I$, e $\vec t = -p\hat n$ (empurra para dentro).</p>
        ${F.formula(R`\sigma = -p\,I + 2\mu D,\qquad D = \frac12\left(\nabla\vec v + (\nabla\vec v)^T\right)\qquad\text{(fluido newtoniano incompressível)}`, "Relação constitutiva")}
        <p>$D$ é a <b>taxa de deformação</b>: a parte simétrica do gradiente de velocidade. A parte antissimétrica, $W$, é a rotação rígida (metade da vorticidade ${F.ret("U01")}) e <b>não</b> gera tensão: um fluido girando como um bloco não sente atrito interno.</p>
        <div id="lab-ele"></div>`),

      F.secao("viscosidade", "Viscosidade na prática", R`
        <p>No caso mais simples, camadas paralelas com $u(y)$: $\tau = \sigma_{xy} = \mu\frac{du}{dy}$ (lei de Newton da viscosidade). A unidade de $\mu$ é Pa·s. A <b>viscosidade cinemática</b> $\nu = \mu/\rho$ (m²/s) diz quão rápido o "arrasto" se espalha.</p>
        <table class="tb"><tr><th>fluido (20 °C)</th><th>$\mu$ (Pa·s)</th></tr><tr><td>ar</td><td>$1{,}8\times10^{-5}$</td></tr><tr><td>água</td><td>$1{,}0\times10^{-3}$</td></tr><tr><td>óleo de motor</td><td>~0,1</td></tr><tr><td>mel</td><td>~10</td></tr><tr><td>piche</td><td>~$10^8$</td></tr></table>
        ${F.caixa("fisico", R`<p><b>Lei de Stokes</b>: uma esfera pequena de raio $R$ andando devagar num fluido sente arrasto $F = 6\pi\mu Rv$. Uma gotinha de névoa ($R = 10$ μm) cai no ar com velocidade terminal $v = \frac{2R^2\rho_\text{água}g}{9\mu} \approx 1{,}2$ cm/s: por isso as nuvens "flutuam". Millikan usou isso para medir a carga do elétron ${F.ret("C01")}.</p>`)}
        ${F.caixa("ideia", R`<p><b>Não newtonianos</b>: em muitos fluidos, $\mu$ depende de quão rápido você deforma. Amido de milho com água (oobleck) endurece quando você bate (dá para andar em cima); ketchup e tinta ficam mais finos quando sacudidos; sangue também. A relação $\sigma = -pI + 2\mu D$ vale só para os newtonianos (água, ar, óleo).</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Uma placa de 100 cm² desliza a 1 m/s sobre 1 mm de óleo ($\mu = 0{,}1$ Pa·s). Qual a força? E a potência dissipada por m²?</p>`, fig: "", dicas: [R`<p>$\tau = \mu U/h$.</p>`, R`<p>Potência por área: $\tau U$.</p>`], resp: R`$\tau = 100$ Pa, $F = 1$ N; 100 W/m².`, sol: R`<p>É assim que se mede viscosidade (viscosímetro de cilindros): mede-se o torque para girar um cilindro dentro de outro.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Separe o gradiente de velocidade do cisalhamento $\vec v = (\dot\gamma y, 0)$ em parte simétrica $D$ e antissimétrica $W$.</p>`, fig: "", dicas: [R`<p>$\nabla\vec v = \begin{pmatrix}0 & \dot\gamma\\ 0 & 0\end{pmatrix}$.</p>`, R`<p>$D = \frac12(G + G^T)$, $W = \frac12(G - G^T)$.</p>`], resp: R`$D = \begin{pmatrix}0 & \dot\gamma/2\\ \dot\gamma/2 & 0\end{pmatrix}$, $W = \begin{pmatrix}0 & \dot\gamma/2\\ -\dot\gamma/2 & 0\end{pmatrix}$.`, sol: R`<p>Cisalhamento = deformação + rotação, meio a meio. No laboratório, compare "cisalhamento" com "deformação pura" e "rotação".</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Mostre que a unidade de viscosidade dinâmica é Pa·s e a da cinemática é m²/s.</p>`, fig: "", dicas: [R`<p>$\tau = \mu\,du/dy$: Pa = $\mu$ × (1/s).</p>`, R`<p>$\nu = \mu/\rho$.</p>`], resp: R`$[\mu] = $ Pa·s $=$ kg/(m·s); $[\nu] = $ m²/s.`, sol: R`<p>m²/s é a unidade de uma difusividade, como a de calor: a viscosidade "difunde" momento.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Com $\sigma = \begin{pmatrix}-100 & 30\\ 30 & -100\end{pmatrix}$ Pa, ache o vetor tensão nos planos de normal $(1, 0)$ e $(1, 1)/\sqrt2$.</p>`, fig: "", dicas: [R`<p>$\vec t = \sigma\hat n$.</p>`, R`<p>Componente normal: $\vec t\cdot\hat n$.</p>`], resp: R`$(-100, 30)$ Pa; $\approx(-49{,}5;\ -49{,}5)$ Pa, com componente normal $-70$ Pa e cisalhamento zero.`, sol: R`<p>No plano de 45°, a tensão é puramente normal: é uma direção principal.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Qual a velocidade terminal de uma gotinha de névoa de raio 10 μm no ar ($\mu = 1{,}8\times10^{-5}$ Pa·s)?</p>`, fig: "", dicas: [R`<p>Peso = arrasto de Stokes: $\frac43\pi R^3\rho g = 6\pi\mu Rv$.</p>`, R`<p>$v = \frac{2R^2\rho g}{9\mu}$.</p>`], resp: R`$\approx 1{,}2$ cm/s.`, sol: R`<p>Uma corrente de ar subindo a poucos cm/s já segura a nuvem.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Ache as tensões principais (autovalores) e as direções principais de $\sigma = \begin{pmatrix}-p & \tau\\ \tau & -p\end{pmatrix}$.</p>`, fig: "", dicas: [R`<p>$\det(\sigma - \lambda I) = 0$.</p>`, R`<p>$(-p - \lambda)^2 = \tau^2$.</p>`], resp: R`$\lambda = -p \pm \tau$, nas direções $(1, 1)$ e $(1, -1)$ (a 45°).`, sol: R`<p>O cisalhamento puro equivale a uma tração numa diagonal e uma compressão na outra. Por isso um giz torcido quebra numa espiral a 45°.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Mostre que, numa rotação rígida $\vec v = (-\Omega y, \Omega x)$, a tensão viscosa é zero, e que numa deformação pura $\vec v = (\varepsilon x, -\varepsilon y)$ ela é $2\mu\varepsilon$ (normal, com sinais opostos em $x$ e $y$).</p>`, fig: "", dicas: [R`<p>Rotação: $\nabla\vec v$ é antissimétrico, $D = 0$.</p>`, R`<p>Deformação: $D = \text{diag}(\varepsilon, -\varepsilon)$.</p>`], resp: R`Rotação: $\tau = 2\mu D = 0$. Deformação: $\sigma_{xx} = -p + 2\mu\varepsilon$, $\sigma_{yy} = -p - 2\mu\varepsilon$.`, sol: R`<p>Por isso o café numa xícara que você gira junto com ele não sente atrito interno (gira como um bloco), e só a camada perto da parede é cisalhada quando você para de girar.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-ele"); e.outerHTML = F.lab("Um pedacinho de fluido sendo deformado", "lab-ele"); SIM.elemento(document.getElementById("lab-ele"), F); },
});
