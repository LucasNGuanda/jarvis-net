/* A18 · Hidrodinâmica. Conferido em Python (g = 10 m/s², água 1000 kg/m³, ar 1,2 kg/m³):
   mangueira de 2 cm a 1 m/s com bico de 0,5 cm: 16 m/s; balde de 10 L em 50 s: 0,2 L/s; furo 5 m abaixo da superfície: 10 m/s;
   tanque com água a 2 m, furo a 0,5 m do chão: v = 5,48 m/s, queda 0,316 s, alcance 1,73 m = 2√(y(H − y)); máximo H com furo em H/2;
   Venturi 4 cm² → 1 cm² com 1 m/s: 4 m/s e Δp = 7500 Pa; Pitot no ar com Δp = 600 Pa: 31,6 m/s;
   asa de 20 m² com 70 m/s em cima e 60 m/s embaixo: 15 600 N; aorta (r = 1 cm, 0,3 m/s): 9,42e-5 m³/s = 5,65 L/min;
   vento de 30 m/s sobre telhado de 100 m²: 54 000 N; bomba erguendo 2 L/s a 10 m: 200 W;
   chefão: tanque de 1 m² com furo de 1 cm² e 1,8 m de água: esvazia em (A/a)√(2H/g) = 6000 s = 100 min (integração numérica: 5999,9 s);
   metade da altura em 29,3% do tempo; clepsidra com nível descendo uniforme: r ∝ H^(1/4). */
F.registrar("A18", {
  retoma: ["A17", "A11", "A06"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const tubo = (a1, a2, extra = "") => fig(`<path d="M40 ${85 - a1} L220 ${85 - a1} L300 ${85 - a2} L520 ${85 - a2} M40 ${85 + a1} L220 ${85 + a1} L300 ${85 + a2} L520 ${85 + a2}" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="M40 ${85 - a1} L220 ${85 - a1} L300 ${85 - a2} L520 ${85 - a2} L520 ${85 + a2} L300 ${85 + a2} L220 ${85 + a1} L40 ${85 + a1} Z" style="fill:color-mix(in srgb,var(--mA) 22%,transparent)"/>` + D.seta(80, 85, 140, 85, "var(--ink2)") + D.seta(380, 85, 480, 85, "var(--ink2)") + extra, 170);
    const exemplos = F.exemplo({
      titulo: "Escoamento",
      casos: [
        { nome: "Fácil: o dedo na mangueira", gerar: (p) => {
          const d1 = p ? 2 : F.escolha([2, 2.5, 3]), d2 = p ? 0.5 : F.escolha([0.5, 1]), v1 = p ? 1 : F.escolha([0.5, 1, 2]), v2 = v1 * (d1 / d2) ** 2;
          return { enun: R`<p>Água corre a ${F.nt(v1)} m/s numa mangueira de ${F.nt(d1)} cm de diâmetro, que termina num bico de ${F.nt(d2)} cm. Com que velocidade a água sai? Qual a vazão?</p>`, fig: tubo(30, 30 * (d2 / d1)),
            passos: [R`<p>(i) Continuidade (a água não some nem se comprime): $A_1v_1 = A_2v_2$.</p>`, R`<p>(ii) Área vai com o quadrado do diâmetro: $v_2 = v_1\left(\frac{d_1}{d_2}\right)^2 = ${F.n(v1)}\cdot${F.n((d1 / d2) ** 2)} = ${F.n(v2)}$ m/s.</p>`, R`<p>(iii) Vazão: $Q = A_1v_1 = \pi\left(${F.n(d1 / 200, 4)}\right)^2\cdot${F.n(v1)} \approx ${F.n(Math.PI * (d1 / 200) ** 2 * v1 * 1000, 3)}$ L/s, a mesma no bico. Apertar a ponta não aumenta a vazão: só a velocidade.</p>`] };
        } },
        { nome: "Médio: o tubo de Venturi", gerar: (p) => {
          const A1 = p ? 4 : F.escolha([4, 6, 9]), A2 = p ? 1 : F.escolha([1, 2, 3]), v1 = p ? 1 : F.escolha([0.5, 1, 2]), v2 = (v1 * A1) / A2, dp = 500 * (v2 * v2 - v1 * v1);
          return { enun: R`<p>Água passa a ${F.nt(v1)} m/s por um cano de ${A1} cm² que se estreita para ${A2} cm² (horizontal). Qual a diferença de pressão entre a parte larga e o estreitamento? Que desnível isso dá em tubinhos verticais colocados ali?</p>`, fig: tubo(34, 34 * Math.sqrt(A2 / A1), `<line x1="130" x2="130" y1="${85 - 34}" y2="5" style="stroke:var(--ink3)"/><line x1="410" x2="410" y1="${85 - 34 * Math.sqrt(A2 / A1)}" y2="5" style="stroke:var(--ink3)"/>`),
            passos: [R`<p>(i) Continuidade: $v_2 = v_1\frac{A_1}{A_2} = ${F.n(v2)}$ m/s.</p>`, R`<p>(ii) Bernoulli, mesma altura: $p_1 - p_2 = \frac12\rho(v_2^2 - v_1^2) = \frac12\cdot1000\cdot(${F.n(v2 * v2)} - ${F.n(v1 * v1)}) = ${F.n(dp)}$ Pa.</p>`, R`<p>(iii) Desnível nos tubinhos: $\Delta h = \frac{\Delta p}{\rho g} = ${F.n(dp / 1e4, 3)}$ m, menor no estreitamento. <b>Onde a velocidade é maior, a pressão é menor.</b> Medindo $\Delta h$, o Venturi mede a vazão.</p>`] };
        } },
        { nome: "Olimpíada: o furo que joga mais longe", gerar: (p) => {
          const H = p ? 2 : F.escolha([1, 2, 3]), y = p ? 0.5 : F.escolha([0.25, 0.5, 0.75]) * H, x = 2 * Math.sqrt(y * (H - y));
          return { enun: R`<p>Uma caixa d'água aberta, apoiada no chão, tem água até ${H} m de altura. Faz-se um furo pequeno na parede a ${F.nt(y)} m do chão. A que distância da caixa o jato atinge o chão? Em que altura o furo deveria ficar para o jato ir o mais longe possível?</p>`,
            fig: fig(`<line x1="40" x2="520" y1="160" y2="160" style="stroke:var(--ink2);stroke-width:2"/><rect x="80" y="${160 - H * 45}" width="70" height="${H * 45}" style="fill:color-mix(in srgb,var(--mA) 28%,transparent)"/><path d="M80 20 L80 160 L150 160 L150 20" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="M150 ${160 - y * 45} Q${150 + x * 30} ${160 - y * 45} ${150 + x * 45} 160" style="fill:none;stroke:var(--mA);stroke-width:2.5"/>`, 170),
            passos: [R`<p>(i) Torricelli (Bernoulli entre a superfície, parada e à pressão atmosférica, e o furo, também à pressão atmosférica): $v = \sqrt{2g(H - y)} = ${F.n(Math.sqrt(20 * (H - y)), 3)}$ m/s.</p>`, R`<p>(ii) Lançamento horizontal de altura $y$ ${F.ret("A06")}: $t = \sqrt{2y/g}$; alcance $x = vt = 2\sqrt{y(H - y)} = ${F.n(x, 3)}$ m.</p>`, R`<p>(iii) $y(H - y)$ é máximo em $y = H/2$ (vértice da parábola): alcance máximo $= H = ${H}$ m. E $y$ e $H - y$ dão o mesmo alcance: furos simétricos em relação ao meio jogam igual. Teste no laboratório.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Quanto tempo a caixa d'água leva para esvaziar",
      enun: R`<p>Uma caixa d'água cilíndrica de seção $A = 1$ m², aberta em cima, tem água até $H_0 = 1{,}8$ m. No fundo há um furo de área $a = 1$ cm². (a) Com que velocidade a água sai quando o nível está em $H$? (b) Escreva $\frac{dH}{dt}$. (c) Resolva e ache o tempo para esvaziar. (d) Quanto tempo leva só a primeira metade da altura? (e) Os egípcios usavam relógios de água (clepsidras). Que formato o recipiente deveria ter (raio $r$ em função da altura $H$) para o nível descer com velocidade <b>constante</b>?</p>`,
      fig: fig(`<rect x="200" y="40" width="160" height="110" style="fill:color-mix(in srgb,var(--mA) 28%,transparent)"/><path d="M200 10 L200 150 L360 150 L360 10" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="M280 150 Q284 162 288 172" style="fill:none;stroke:var(--mA);stroke-width:2"/>` + D.seta(380, 150, 380, 40, "var(--ink3)", 1.2) + D.txt(388, 98, "H", "txm", "start") + D.txt(296, 166, "furo a", "tx2", "start"), 175),
      dicas: [R`<p>(a) Torricelli. Como $a \ll A$, a velocidade da superfície é desprezível perto da do jato.</p>`, R`<p>(b) Continuidade: o volume que sai pelo furo ($av\,dt$) é o que some da caixa ($-A\,dH$).</p>`, R`<p>(c) Separe as variáveis: $\frac{dH}{\sqrt H} = -\frac aA\sqrt{2g}\,dt$ ${F.ret("F04")}.</p>`, R`<p>(e) Com $\frac{dH}{dt}$ constante, a continuidade dá a área da superfície em função de $H$.</p>`],
      sol: R`<p><b>(a)</b> $v = \sqrt{2gH}$.</p>
        <p><b>(b)</b> $A\frac{dH}{dt} = -av \Rightarrow \frac{dH}{dt} = -\frac aA\sqrt{2gH}$.</p>
        <p><b>(c)</b> Integrando: $2\left(\sqrt{H_0} - \sqrt H\right) = \frac aA\sqrt{2g}\,t$. Repare: $\sqrt H$ desce linearmente no tempo. Esvazia ($H = 0$) em $T = \frac Aa\sqrt{\frac{2H_0}g} = 10^4\cdot\sqrt{0{,}36} = 6000$ s $= 100$ min. Conferi integrando numericamente (5999,9 s).</p>
        <p><b>(d)</b> Até $H_0/2$: $t = T\left(1 - \frac1{\sqrt2}\right) \approx 0{,}293\,T \approx 29$ min. A segunda metade leva os outros 71 min: com pouca água, a pressão cai e o jato fica lento.</p>
        <p><b>(e)</b> Com o recipiente de raio $r(H)$: $\pi r^2\frac{dH}{dt} = -a\sqrt{2gH}$. Para $\frac{dH}{dt}$ constante, $r^2 \propto \sqrt H$, isto é, $r \propto H^{1/4}$: um vaso que se alarga para cima, bem devagar. Uma clepsidra egípcia de Karnak (c. 1400 a.C.) tem paredes inclinadas justamente para compensar, em parte, esse efeito.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Uma torneira enche um balde de 10 L em 50 s. Qual a vazão, em L/s?</p>`, num: { v: 0.2, un: "L/s" }, dicas: [R`<p>$Q = \frac{V}{\Delta t}$.</p>`], resp: "0,2 L/s", sol: R`<p>$\frac{10}{50} = 0{,}2$ L/s $= 2\times10^{-4}$ m³/s.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Água a 1 m/s numa mangueira de 2 cm de diâmetro sai por um bico de 0,5 cm. Com que velocidade sai?</p>`, fig: tubo(30, 7.5), num: { v: 16, un: "m/s" }, dicas: [R`<p>$A_1v_1 = A_2v_2$; a área vai com o quadrado do diâmetro.</p>`], resp: "16 m/s", sol: R`<p>$v_2 = 1\cdot4^2 = 16$ m/s. Quem usa a razão dos diâmetros (4) esqueceu o quadrado.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Com que velocidade a água sai de um furo pequeno 5 m abaixo da superfície de uma caixa d'água aberta?</p>`, num: { v: 10, un: "m/s" }, dicas: [R`<p>Torricelli: $v = \sqrt{2gh}$.</p>`], resp: "10 m/s", sol: R`<p>$\sqrt{100} = 10$ m/s, como uma pedra caindo de 5 m ${F.ret("A03")}.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Num cano horizontal, a água passa de uma parte larga para uma estreita. Na parte estreita:</p>`, alts: ["a velocidade e a pressão aumentam.", "a velocidade aumenta e a pressão diminui.", "a velocidade diminui e a pressão aumenta.", "as duas diminuem.", "nada muda."], certa: "B", dicas: [R`<p>Continuidade para a velocidade; Bernoulli para a pressão.</p>`], resp: "B", sol: R`<p>Mais rápida e com pressão <b>menor</b>: a água acelera porque a pressão atrás dela é maior que a da frente ${F.ret("A08")}. O contrário do que a intuição ("apertou, aumentou a pressão") diz.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>A aorta tem raio de 1 cm e o sangue passa nela a 0,3 m/s, em média. Qual a vazão, em L/min?</p>`, num: { v: 5.655, tol: 0.02, un: "L/min" }, dicas: [R`<p>$Q = \pi r^2v$; 1 m³ = 1000 L.</p>`], resp: "≈ 5,7 L/min", sol: R`<p>$\pi\cdot10^{-4}\cdot0{,}3 \approx 9{,}4\times10^{-5}$ m³/s $\approx 5{,}7$ L/min: todo o sangue do corpo passa pelo coração a cada minuto.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Uma bomba ergue 2 L de água por segundo a 10 m de altura (velocidade desprezível). Qual a potência mínima?</p>`, num: { v: 200, un: "W" }, dicas: [R`<p>Cada segundo, 2 kg sobem 10 m: $P = \frac{mgh}t$.</p>`], resp: "200 W", sol: R`<p>$2\cdot10\cdot10 = 200$ W $= \rho gQh$ ${F.ret("A11")}.</p>` }),
      F.exercicio({ n: 7, nivel: "Máximo", enun: R`<p>Num tubo de Venturi horizontal, a água passa de 4 cm² (a 1 m/s) para 1 cm². Qual a diferença de pressão, em Pa?</p>`, fig: tubo(34, 17), num: { v: 7500, un: "Pa" }, dicas: [R`<p>Continuidade dá $v_2$; Bernoulli dá $\Delta p = \frac12\rho(v_2^2 - v_1^2)$.</p>`], resp: "7500 Pa", sol: R`<p>$v_2 = 4$ m/s; $\Delta p = 500\cdot15 = 7500$ Pa (75 cm de coluna d'água).</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>Um tubo de Pitot num avião mede uma diferença entre a pressão de estagnação e a estática de 600 Pa. Com o ar a 1,2 kg/m³, qual a velocidade do avião em relação ao ar?</p>`, num: { v: Math.sqrt(1000), tol: 0.01, un: "m/s" }, dicas: [R`<p>Na boca do tubo o ar para: $\Delta p = \frac12\rho v^2$.</p>`], resp: "≈ 31,6 m/s", sol: R`<p>$v = \sqrt{\frac{2\cdot600}{1{,}2}} = \sqrt{1000} \approx 31{,}6$ m/s (114 km/h). Pitot entupido por gelo já derrubou avião: o piloto perde a leitura de velocidade.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>O ar passa a 70 m/s em cima e a 60 m/s embaixo de uma asa de 20 m² (ar 1,2 kg/m³). Pela diferença de pressão (Bernoulli), qual a sustentação, em N?</p>`, num: { v: 15600, un: "N" }, dicas: [R`<p>$\Delta p = \frac12\rho(v_\text{cima}^2 - v_\text{baixo}^2)$ e $F = \Delta p\cdot A$.</p>`], resp: "15 600 N", sol: R`<p>$\Delta p = 0{,}6\cdot1300 = 780$ Pa; $F = 15\,600$ N, segura uns 1,5 t. (A explicação completa da sustentação também usa a 3ª lei: a asa desvia ar para baixo.)</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Uma caixa d'água tem água até 2 m de altura; um furo a 0,5 m do chão solta um jato horizontal. A que distância da caixa o jato toca o chão?</p>`, num: { v: Math.sqrt(3), tol: 0.01, un: "m" }, dicas: [R`<p>Torricelli com a profundidade do furo (1,5 m), depois lançamento horizontal de 0,5 m de altura.</p>`], resp: "√3 ≈ 1,73 m", sol: R`<p>$v = \sqrt{30}$; $t = \sqrt{0{,}1}$; $x = \sqrt3 \approx 1{,}73$ m $= 2\sqrt{0{,}5\cdot1{,}5}$.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Num vendaval, o vento passa a 30 m/s sobre um telhado de 100 m², enquanto o ar dentro da casa está parado. Que força tende a arrancar o telhado, em N? (ar 1,2 kg/m³)</p>`, num: { v: 54000, un: "N" }, dicas: [R`<p>A pressão em cima cai de $\frac12\rho v^2$.</p>`], resp: "54 000 N", sol: R`<p>$\frac12\cdot1{,}2\cdot900\cdot100 = 54\,000$ N, o peso de 5 toneladas. Por isso se recomenda não fechar a casa toda num furacão (a pressão de dentro também ajuda a empurrar o telhado para fora).</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>A equação de Bernoulli, $p + \frac12\rho v^2 + \rho gh = $ constante, vale ao longo de uma linha de corrente se o fluido for:</p>`, alts: ["qualquer fluido, em qualquer escoamento.", "incompressível, sem viscosidade, em escoamento estacionário.", "só gases.", "viscoso e turbulento.", "compressível e acelerando."], certa: "B", dicas: [R`<p>Na demonstração, de onde sumiram o trabalho do atrito interno e a variação de densidade?</p>`], resp: "B", sol: R`<p>A demonstração supõe densidade constante, nenhuma energia perdida em atrito interno (viscosidade) e escoamento que não muda no tempo. Com viscosidade, surge uma perda de carga; é o mundo de Navier–Stokes ${F.ret("N05")}.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · fluidos em movimento</div>
        <div class="q">Por que, quando um caminhão passa rápido do seu lado na estrada, o carro parece ser puxado na direção dele?</div>
        <p>Porque, onde o ar corre mais rápido, a pressão é menor. É a equação de Bernoulli, a conservação da energia escrita para fluidos, que também explica o Venturi, o Pitot dos aviões e o jato que sai de uma caixa d'água furada.</p></div>`),

      F.secao("continuidade", "Vazão e continuidade", R`
        ${F.formula(R`Q = \frac{\Delta V}{\Delta t} = Av\qquad(\text{m}^3/\text{s})`, "Vazão")}
        <h3>Teorema 1: equação da continuidade</h3>
        ${F.demo("demonstração", R`<p>(i) Num tubo sem furos, com escoamento estacionário, a massa que entra numa seção num intervalo $\Delta t$ tem que sair pela outra: $\rho_1A_1v_1\Delta t = \rho_2A_2v_2\Delta t$.</p>
          <p>(ii) Para líquidos, $\rho$ é praticamente constante. $\blacksquare$</p>`)}
        ${F.formula(R`A_1v_1 = A_2v_2`, "Continuidade (fluido incompressível)")}
        <p>Rio que se estreita corre mais rápido; o sangue fica lento nos capilares porque a área total deles é enorme. Na universidade, é a equação $\frac{\partial\rho}{\partial t} + \nabla\cdot(\rho\vec v) = 0$ ${F.ret("N02")}.</p>`),

      F.secao("bernoulli", "A equação de Bernoulli", R`
        <h3>Teorema 2: Bernoulli é o teorema da energia para um fluido</h3>
        ${F.demo("demonstração", R`<p>(i) Acompanhe a porção de fluido entre as seções 1 e 2 de um tubo durante $\Delta t$. Ela "anda": um pedaço de volume $\Delta V = A_1v_1\Delta t = A_2v_2\Delta t$ sai da região 1 e um igual entra na região 2 (o meio não muda, escoamento estacionário).</p>
          <p>(ii) Trabalho das pressões: atrás, o fluido empurra com $p_1A_1$ por $v_1\Delta t$: $+p_1\Delta V$; na frente, empurra de volta: $-p_2\Delta V$.</p>
          <p>(iii) Variação de energia: é como se a massa $\Delta m = \rho\Delta V$ fosse levada de 1 para 2: $\Delta E_c = \frac12\Delta m(v_2^2 - v_1^2)$ e $\Delta E_p = \Delta m\,g(h_2 - h_1)$.</p>
          <p>(iv) Sem viscosidade, $W = \Delta E_c + \Delta E_p$ ${F.ret("A11")}: $(p_1 - p_2)\Delta V = \frac12\rho\Delta V(v_2^2 - v_1^2) + \rho\Delta V g(h_2 - h_1)$. Divida por $\Delta V$ e arrume. $\blacksquare$</p>`)}
        ${F.formula(R`p + \tfrac12\rho v^2 + \rho gh = \text{constante (ao longo de uma linha de corrente)}`, "Equação de Bernoulli")}
        <p>Com $v = 0$ ela vira a lei de Stevin ${F.ret("A17")}. Cada termo é uma energia por volume (J/m³ = Pa).</p>
        ${F.caixa("pegadinha", R`<p><b>"Apertou a mangueira, aumentou a pressão" é falso</b> na parte estreita: lá a velocidade sobe e a pressão <b>cai</b>. O que aumenta é a pressão antes do aperto (e a velocidade de saída). E Bernoulli não vale com muita viscosidade (mel) nem em turbulência forte.</p>`)}`),

      F.secao("aplicacoes", "Torricelli, Venturi e Pitot", R`
        <h3>Teorema 3: lei de Torricelli</h3>
        ${F.demo("demonstração", R`<p>(i) Bernoulli entre a superfície (pressão atmosférica, velocidade ≈ 0 se o tanque for largo) e o furo (pressão atmosférica, porque o jato está no ar livre), a uma profundidade $h$ abaixo da superfície.</p>
          <p>(ii) $p_\text{atm} + 0 + \rho gh = p_\text{atm} + \frac12\rho v^2 + 0 \Rightarrow v = \sqrt{2gh}$. $\blacksquare$</p>`)}
        ${F.formula(R`v = \sqrt{2gh};\qquad \text{alcance do jato}: x = 2\sqrt{y\,(H - y)}`, "Torricelli e o jato (furo a altura y, água até H)")}
        <div id="lab-torricelli"></div>
        <p><b>Venturi</b>: um estreitamento num cano horizontal; a queda de pressão $\frac12\rho(v_2^2 - v_1^2)$ mede a vazão (e é o princípio do carburador e do borrifador). <b>Pitot</b>: um tubo virado contra o escoamento, onde o fluido para; a diferença entre essa pressão e a estática é $\frac12\rho v^2$, e dá a velocidade do avião.</p>
        ${F.caixa("fisico", R`<p><b>A cortina do chuveiro que gruda na sua perna.</b> O jato de água arrasta ar e cria uma corrente de ar mais rápida dentro do box, com pressão menor que a de fora; a cortina é empurrada para dentro. (Parte do efeito também vem do ar quente subindo.)</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Esvaziamento de tanques</b> é Torricelli + continuidade + uma equação diferencial separável: $A\,dH = -a\sqrt{2gH}\,dt$ dá $\sqrt H$ caindo linearmente (chefão). Verifique sempre se $a \ll A$; se não, inclua a velocidade da superfície em Bernoulli.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, Bernoulli sai da equação de Euler ${F.ret("N03")}; com viscosidade, chega-se a Navier–Stokes ${F.ret("N05")}, cujo escoamento num cano (Poiseuille, vazão $\propto r^4$) ${F.ret("N06")} explica por que entupir um pouquinho uma artéria reduz muito o fluxo. Se as soluções de Navier–Stokes em 3D são sempre suaves é um Problema do Milênio, valendo 1 milhão de dólares ${F.ret("N07")}.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-torricelli"); e.outerHTML = F.lab("O jato da caixa d'água", "lab-torricelli"); SIM.torricelli(document.getElementById("lab-torricelli"), F); },
});
