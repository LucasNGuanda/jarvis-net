/* S02 · Vestibulares militares.
   IME 2026/2027 (prova objetiva, questões 16 a 30 = física). As respostas são resoluções minhas, conferidas em Python
   (scratchpad: vmit.py e conferências do IME); NÃO foram comparadas com o gabarito oficial.
   Q16 E 12π · Q17 C 13/18 · Q18 B 4EQ/(3m) · Q19 E 0,39c · Q20 E +Q−q · Q21 B 10/3 · Q22 A 3,50 · Q23 C 38/45 · Q24 C 295 cm
   Q25 C (I₁/I₂ = 15/11: R₁ = 11R/20, R₂ = 3R/4, por matriz laplaciana) · Q26 D · Q27 A 4,5 m/s · Q28 B 2,0 °C · Q29 D πRn/(3c) · Q30 D */
F.registrar("S02", {
  html(F) {
    const R = String.raw;
    const fig = (q, alt, w = 520) => `<img class="scan" src="assets/img/ime2027/q${q}.png" alt="${alt}" style="width:min(100%,${w}px)">`;
    const ime = `<span class="fonte">IME 2026/27</span> `;
    const ex = (o) => F.exercicio({ marcas: ["IME"], ...o, enun: ime + o.enun });
    const qs = [
      ex({ n: 16, enun: R`<p>A posição $(x, y)$ e a velocidade $(v_x, v_y)$ de uma partícula no plano obedecem a $x(t) = 9\,v_y(t)$ e $y(t) = -4\,v_x(t)$ (SI). A trajetória é uma curva fechada, e o tempo para percorrê-la uma vez é:</p>`,
        alts: [R`$\dfrac16\pi$`, R`$\dfrac13\pi$`, R`$3\pi$`, R`$6\pi$`, R`$12\pi$`],
        dicas: [R`<p>Escreva $\dot x$ em função de $y$ e $\dot y$ em função de $x$.</p>`, R`<p>Derive de novo: aparece $\ddot x = -\omega^2 x$ ${F.ret("A20")}.</p>`],
        resp: "E", sol: R`<p>$\dot x = v_x = -\frac y4$ e $\dot y = v_y = \frac x9$. Derivando: $\ddot x = -\frac{\dot y}4 = -\frac{x}{36}$, um MHS com $\omega = \frac16$ rad/s. Período: $T = \frac{2\pi}\omega = 12\pi$ s.</p>
          <p>É fechada mesmo: $\frac{d}{dt}(4x^2 + 9y^2) = 8x\dot x + 18y\dot y = -2xy + 2xy = 0$, então $4x^2 + 9y^2$ é constante (uma elipse).</p>
          <p><b>Tentadoras:</b> D ($6\pi$) é quem usa $T = \pi/\omega$; A ($\pi/6$) é quem multiplica por $\omega$ em vez de dividir.</p>` }),

      ex({ n: 17, enun: R`<p>Cientistas estudaram a órbita de um planeta P em torno de uma estrela S e concluíram que a razão entre as distâncias de S ao apoastro e de S ao periastro é $9/4$. O valor que mais se aproxima da razão entre as energias potenciais gravitacionais de P no apoastro e no ponto B (figura) é:</p>`,
        fig: fig(17, "Órbita elíptica com a estrela S num foco, o centro O e o ponto B no topo do eixo menor", 420),
        alts: [R`$\dfrac57$`, R`$\dfrac5{18}$`, R`$\dfrac{13}{18}$`, R`$\dfrac23$`, R`$\dfrac47$`],
        dicas: [R`<p>$r_\text{apo} = a(1 + e)$ e $r_\text{peri} = a(1 - e)$. Ache $e$.</p>`, R`<p>B está na ponta do eixo menor: qual a distância de B ao foco? (Pense na definição de elipse: soma das distâncias aos focos $= 2a$.)</p>`],
        resp: "C", sol: R`<p>$\frac{1 + e}{1 - e} = \frac94 \Rightarrow e = \frac5{13}$, e $r_\text{apo} = a\left(1 + \frac5{13}\right) = \frac{18a}{13}$.</p>
          <p>B está na ponta do eixo menor, à mesma distância dos dois focos; como a soma é $2a$, $r_B = a$.</p>
          <p>$U = -\frac{GMm}r$, então $\frac{U_\text{apo}}{U_B} = \frac{r_B}{r_\text{apo}} = \frac{13}{18}$.</p>
          <p><b>Tentadoras:</b> D ($2/3$) é quem usa o semieixo menor $b = \frac{12a}{13}$ como $r_B$ (essa é a distância de B ao centro O, não à estrela); B ($5/18$) é quem usa a distância $OS = ae$.</p>` }),

      ex({ n: 18, marcas: ["IME", "!"], enun: R`<p>Duas roldanas em forma de anel, inicialmente em repouso, estão engrenadas. Cada fio é enrolado ou desenrolado à mesma velocidade escalar dos pontos do perímetro da sua roldana. Nas pontas dos fios há partículas carregadas, sujeitas ao campo de um plano horizontal infinito uniformemente carregado, com um furo para um dos fios passar.</p>
          <p>Dados: massas das roldanas $m$ e $2m$; o raio de uma é o dobro do da outra; campo vertical de módulo $E$; cargas $-Q$ e $+3Q$. Massas das partículas desprezíveis; massas das roldanas uniformemente distribuídas (no aro); as roldanas giram sem atrito em torno dos centros; a linha dos centros é paralela ao plano.</p>
          <p>Pela conservação da energia, a aceleração do fio que sustenta a carga positiva é:</p>`,
        fig: fig(18, "Duas roldanas engrenadas, de raios r e 2r e massas m e 2m; a carga −Q fica acima do plano carregado e a +3Q abaixo, com o fio passando por um furo", 440),
        alts: [R`$\dfrac{2EQ}{7m}$`, R`$\dfrac{4EQ}{3m}$`, R`$\dfrac{8EQ}{7m}$`, R`$\dfrac{8EQ}{3m}$`, R`$\dfrac{2EQ}{3m}$`],
        dicas: [R`<p>Engrenadas: os pontos dos perímetros têm a mesma velocidade $v$. Anel: $I = MR^2$, então $K = \frac12 Mv^2$ (o raio some!).</p>`, R`<p>O plano tem cargas $+$: acima dele $\vec E$ aponta para cima, abaixo para baixo. Para onde vai a força em cada carga? E as engrenagens giram em sentidos opostos: os dois fios descem juntos ou um sobe?</p>`],
        resp: "B", sol: R`<p><b>Forças.</b> A carga $-Q$ está acima do plano ($\vec E$ para cima): força $QE$ para baixo. A $+3Q$ está abaixo ($\vec E$ para baixo): força $3QE$ para baixo.</p>
          <p><b>Sentidos.</b> Engrenagens giram em sentidos opostos; como o fio da pequena sai pela esquerda e o da grande pela direita, quando um lado desce o outro também desce. As duas forças fazem trabalho positivo.</p>
          <p><b>Energia.</b> Com o mesmo $v$ no perímetro das duas: $K = \frac12 mv^2 + \frac12(2m)v^2 = \frac32 mv^2$. Potência das forças: $(QE + 3QE)v$. Então $\frac{d}{dt}\left(\frac32mv^2\right) = 3mva = 4QEv$, e $a = \frac{4EQ}{3m}$.</p>
          <p><b>Tentadoras:</b> D ($\frac{8EQ}{3m}$) é quem usa $I = \frac12MR^2$ (disco, não anel); E ($\frac{2EQ}{3m}$) é quem acha que as forças se opõem ($3QE - QE$).</p>` }),

      ex({ n: 19, enun: R`<p>A figura mostra a transformação de Lorentz para velocidades de $0{,}3c$ a $0{,}9c$ de um referencial em movimento: no eixo horizontal, a velocidade de um objeto em relação ao referencial inercial; no vertical, a velocidade relativa entre o objeto e o referencial em movimento.</p>
          <p>Uma nave X e uma nave Y viajam na mesma direção e sentido. X se aproxima de uma fonte de luz parada (no referencial inercial) e Y se afasta dela; fonte e naves estão sempre alinhadas. A fonte emite comprimento de onda $\lambda$; X percebe $\lambda/2$ e Y percebe $3\lambda$. O módulo da velocidade relativa entre as naves é aproximadamente:</p>`,
        fig: fig(19, "Gráfico: velocidade relativa ao referencial em movimento contra a velocidade no referencial inercial, curvas para 0,3c a 0,9c", 560),
        alts: [R`$0{,}20c$`, R`$0{,}15c$`, R`$0{,}75c$`, R`$0{,}92c$`, R`$0{,}39c$`],
        dicas: [R`<p>Doppler relativístico: $\frac{\lambda'}{\lambda} = \sqrt{\frac{1 + \beta}{1 - \beta}}$ afastando (e o inverso aproximando) ${F.ret("C18")}.</p>`, R`<p>Ache $\beta_X$ e $\beta_Y$ e some as velocidades do jeito relativístico (ou leia no gráfico).</p>`],
        resp: "E", sol: R`<p><b>X</b> (aproximando): $\sqrt{\frac{1 - \beta}{1 + \beta}} = \frac12 \Rightarrow \frac{1 - \beta}{1 + \beta} = \frac14 \Rightarrow \beta_X = 0{,}6$.</p>
          <p><b>Y</b> (afastando): $\sqrt{\frac{1 + \beta}{1 - \beta}} = 3 \Rightarrow \beta_Y = 0{,}8$.</p>
          <p>As duas andam no mesmo sentido (X está do lado de lá da fonte, indo na direção dela; Y já passou e vai embora). Velocidade de Y vista por X: $u' = \frac{u - v}{1 - uv/c^2} = \frac{0{,}8 - 0{,}6}{1 - 0{,}48}c = \frac{0{,}2}{0{,}52}c \approx 0{,}385c$. No gráfico: curva de $0{,}6c$, abscissa $0{,}8c$, ordenada $\approx 0{,}38c$.</p>
          <p><b>Tentadora:</b> A ($0{,}20c$) é a subtração de Galileu. Quem usa o Doppler não relativístico acha outras velocidades.</p>` }),

      ex({ n: 20, enun: R`<p>Arranjo de cascas esféricas em repouso: na origem, numa cavidade de vácuo, uma carga $-Q$; em $a \le r < 2a$, camada metálica condutora inicialmente descarregada; em $r = 2a$, casca fina isolante com carga $+q$ uniforme; em $2a < r < 3a$, vácuo; em $3a \le r < 4a$, outra camada condutora inicialmente descarregada; em $r = 4a$, outra casca isolante com $+q$. No equilíbrio eletrostático, a carga superficial total induzida em $r = 3a$ é:</p>`,
        fig: fig(20, "Cortes das cascas esféricas: carga −Q no centro, condutores entre a e 2a e entre 3a e 4a, cascas com +q em 2a e 4a", 420),
        alts: [R`$-Q + 2q$`, R`$-q$`, R`$+Q - 2q$`, R`$+Q$`, R`$+Q - q$`],
        dicas: [R`<p>Dentro de um condutor em equilíbrio, $\vec E = 0$. Use uma gaussiana dentro do metal ${F.ret("C03b")}.</p>`, R`<p>A gaussiana com raio entre $3a$ e $4a$ (dentro do metal) envolve: a carga do centro, o primeiro condutor (neutro), a casca de $2a$ e a superfície de $3a$.</p>`],
        resp: "E", sol: R`<p>Gaussiana dentro do segundo condutor ($3a < r < 4a$): $\vec E = 0$, então a carga total dentro é zero:</p>
          <p>$-Q + \underbrace{0}_{\text{1º condutor}} + q + q_{3a} = 0 \Rightarrow q_{3a} = Q - q$.</p>
          <p>(O primeiro condutor fica com $+Q$ em $r = a$ e $-Q$ na face de fora, mas no total é neutro.) A casca de $4a$ está fora da gaussiana e não importa.</p>
          <p><b>Tentadoras:</b> C ($Q - 2q$) é quem conta também a casca de $4a$; A é o sinal trocado.</p>` }),

      ex({ n: 21, enun: R`<p>Duas polias estão acopladas por uma plataforma, presa em pontos equivalentes, de modo que ela fica sempre horizontal. Um bloco de massa $m$ está sobre a plataforma. Dados: distância do centro da polia à junta $R = \frac34\sqrt{0{,}44}$ m; $g = 10$ m/s²; atrito estático $\mu = \sqrt{0{,}44}$; o máximo de $a\cos\theta + b\sin\theta$ é $\sqrt{a^2 + b^2}$. A rotação máxima $\omega$ das polias para o bloco não deslizar na horizontal, em rad/s, é:</p>`,
        fig: fig(21, "Duas polias girando com velocidade angular ω, ligadas por uma plataforma horizontal com um bloco de massa m em cima", 520),
        alts: [R`$\dfrac{15}4$`, R`$\dfrac{10}3$`, R`$2\sqrt3$`, R`$3\sqrt5$`, R`$2\sqrt5$`],
        dicas: [R`<p>A plataforma <b>translada</b> em círculo: todo ponto dela tem aceleração $\omega^2R$ apontando para o centro do seu círculo, numa direção que gira.</p>`, R`<p>A normal muda: quando a aceleração aponta para baixo, o bloco "fica mais leve" e o atrito máximo cai. Escreva as duas equações com o ângulo $\theta$ e procure o pior caso.</p>`],
        resp: "B", sol: R`<p>Com a junta no ângulo $\theta$, a aceleração é $\vec a = -\omega^2R(\cos\theta, \sin\theta)$. No bloco:</p>
          <p>horizontal: $f = m\omega^2R|\cos\theta|$; vertical: $N = m(g - \omega^2R\sin\theta)$.</p>
          <p>Não desliza se $f \le \mu N$: $\omega^2R(|\cos\theta| + \mu\sin\theta) \le \mu g$ para todo $\theta$. O máximo do parêntese é $\sqrt{1 + \mu^2} = \sqrt{1{,}44} = 1{,}2$.</p>
          <p>$\omega^2 = \frac{\mu g}{1{,}2R} = \frac{\sqrt{0{,}44}\cdot10}{1{,}2\cdot\frac34\sqrt{0{,}44}} = \frac{10}{0{,}9}$, então $\omega = \frac{10}3$ rad/s. Os números foram escolhidos para $\sqrt{0{,}44}$ sumir.</p>
          <p><b>Tentadora:</b> quem esquece que $N$ varia usa $\omega^2R \le \mu g$ e acha $\omega \approx 3{,}65$, perto de A ($3{,}75$).</p>` }),

      ex({ n: 22, enun: R`<p>Três forças são aplicadas a uma viga horizontal de peso desprezível, apoiada em A e B (figura). Sendo $F_B$ e $F_A$ as reações nos apoios, a razão $F_B/F_A$ é aproximadamente:</p>`,
        fig: fig(22, "Viga com apoio A na ponta esquerda e B a 2,7 m; forças de 75 kN a 0,9 m de A e de 30 kN a 3,3 m e 3,9 m de A", 520),
        alts: ["3,50", "0,29", "2,10", "1,83", "2,50"],
        dicas: [R`<p>Torques em relação a A: assim $F_A$ some da equação.</p>`, R`<p>Distâncias a A: 0,9 m; 2,7 m (apoio B); 3,3 m; 3,9 m.</p>`],
        resp: "A", sol: R`<p>Torques em A: $F_B\cdot2{,}7 = 75\cdot0{,}9 + 30\cdot3{,}3 + 30\cdot3{,}9 = 283{,}5 \Rightarrow F_B = 105$ kN.</p>
          <p>Forças: $F_A = 135 - 105 = 30$ kN. Razão: $105/30 = 3{,}5$.</p>
          <p><b>Tentadora:</b> B ($0{,}29 \approx 30/105$) é a razão invertida.</p>` }),

      ex({ n: 23, enun: R`<p>Duas máquinas de Carnot estão em série. A primeira recebe calor de um reservatório a $T_1 = 900$ K, produz trabalho e rejeita calor para um reservatório intermediário a $T_2$ desconhecida. Esse reservatório cede calor para a segunda máquina, que produz trabalho e rejeita para $T_3 = 300$ K. O trabalho da segunda é 40% do da primeira, e o calor que alimenta a segunda é 80% do que a primeira rejeitou. A soma dos rendimentos das duas máquinas é:</p>`,
        alts: [R`$\dfrac{12}{45}$`, R`$\dfrac{15}{45}$`, R`$\dfrac{38}{45}$`, R`$\dfrac{40}{45}$`, R`$\dfrac{43}{45}$`],
        dicas: [R`<p>$\eta_1 = 1 - \frac{T_2}{900}$, $\eta_2 = 1 - \frac{300}{T_2}$ ${F.ret("T08")}.</p>`, R`<p>Com $Q_1$ entrando na primeira: $W_1 = \eta_1Q_1$, a segunda recebe $0{,}8(1 - \eta_1)Q_1$ e $W_2 = 0{,}4W_1$.</p>`],
        resp: "C", sol: R`<p>$W_2 = \eta_2\cdot0{,}8(1 - \eta_1)Q_1 = 0{,}4\,\eta_1Q_1 \Rightarrow 2\eta_2(1 - \eta_1) = \eta_1$.</p>
          <p>Com $x = T_2$: $2\left(1 - \frac{300}x\right)\frac{x}{900} = 1 - \frac{x}{900} \Rightarrow 2(x - 300) = 900 - x \Rightarrow x = 500$ K.</p>
          <p>$\eta_1 = \frac49 = \frac{20}{45}$, $\eta_2 = \frac25 = \frac{18}{45}$; soma $\frac{38}{45}$.</p>
          <p>Note que o reservatório intermediário "vaza" 20% do calor: por isso o conjunto rende menos que um Carnot direto entre 900 K e 300 K ($\frac23$).</p>` }),

      ex({ n: 24, enun: R`<p>Um soldado lança uma granada a $10\sqrt2$ m/s, a 45° com o solo. Antes de atingir o solo ela explode em dois fragmentos, de $2/3$ e $1/3$ da massa; o mais leve vai para a direita e o mais pesado para a esquerda. Exatamente 1,9 s após o lançamento, o fragmento mais pesado atinge um pequeno buraco de 5 cm de profundidade no solo. Com $g = 10$ m/s², a distância vertical, em cm, do fragmento mais leve até o solo nesse instante é:</p>`,
        fig: fig(24, "Trajetória da granada, ponto de explosão, fragmento leve à direita e fragmento pesado caindo num buraco à esquerda", 560),
        alts: ["5", "95", "295", "145", "195"],
        dicas: [R`<p>A explosão é interna: o centro de massa continua na parábola original.</p>`, R`<p>Ache a altura do CM em $t = 1{,}9$ s. O pesado está em $y = -0{,}05$ m.</p>`],
        resp: "C", sol: R`<p>$v_{0y} = 10$ m/s. Centro de massa em $t = 1{,}9$ s: $y_\text{CM} = 10\cdot1{,}9 - 5\cdot1{,}9^2 = 19 - 18{,}05 = 0{,}95$ m.</p>
          <p>$\frac23(-0{,}05) + \frac13y_L = 0{,}95 \Rightarrow y_L = 3(0{,}95) + 0{,}10 = 2{,}95$ m $= 295$ cm.</p>
          <p><b>Tentadoras:</b> B (95) é a altura do CM; D (145) é quem troca as massas ($\frac13$ para o pesado); E (195) é quem trata os fragmentos como iguais. Quem esquece o buraco (põe o pesado em $y = 0$) acha 285, que não está nas opções.</p>` }),

      ex({ n: 25, marcas: ["IME", "!"], enun: R`<p>Duas malhas resistivas, com todos os resistores iguais a R, são ligadas à mesma fonte V (figura). Dica da prova: $R = R/2 + R/2$. A razão entre as correntes $I_1$ e $I_2$ pertence ao intervalo:</p>`,
        fig: fig(25, "Duas rodas hexagonais de resistores R (seis no contorno e seis raios até o centro); na primeira a fonte liga dois vértices vizinhos, na segunda dois vértices separados por um", 520),
        alts: [R`$(0,\ 1/2)$`, R`$(1/2,\ 1)$`, R`$(1,\ 3/2)$`, R`$(3/2,\ 2)$`, R`$(2,\ 5/2)$`],
        dicas: [R`<p>As duas malhas são a mesma "roda" (hexágono + 6 raios). Na 1ª, os terminais são vértices <b>vizinhos</b>; na 2ª, há um vértice entre eles.</p>`, R`<p>Ponha $+V/2$ e $-V/2$ nos terminais: tudo no eixo de simetria entre eles fica em potencial 0. Na 1ª malha esse eixo corta dois resistores ao meio: é aí que entra $R = R/2 + R/2$ ${F.ret("C10b")}.</p>`],
        resp: "C", sol: R`<p><b>Malha 2</b> (terminais separados por um vértice). O eixo passa pelo vértice do meio, pelo centro e pelo vértice oposto: os três em 0. Sobra, de cada lado, um vértice livre $P$, ligado ao terminal, ao centro e ao topo (estes dois em 0): $V_P = \frac{V/2}{3} = \frac V6$. Corrente que sai do terminal: $2\cdot\frac{V/2}R + \frac{V/2 - V/6}R = \frac{4V}{3R}$, então $R_2 = \frac34R$.</p>
          <p><b>Malha 1</b> (terminais vizinhos). O eixo corta ao meio o resistor entre os terminais e o resistor de cima: os pontos médios ficam em 0, cada um a $R/2$ dos vértices. No lado esquerdo: o vértice do meio $L$ (ligado ao terminal, ao de cima $T$ e ao centro) e $T$ (ligado a $L$, ao centro e ao ponto médio, a $R/2$):</p>
          <p>$T$: $\frac{V_L - V_T}R = \frac{V_T}R + \frac{V_T}{R/2} \Rightarrow V_T = \frac{V_L}4$; $L$: $3V_L = \frac V2 + V_T \Rightarrow V_L = \frac{2V}{11}$.</p>
          <p>Corrente do terminal: $\frac{V/2}{R/2} + \frac{V/2}R + \frac{V/2 - 2V/11}R = \frac VR\left(1 + \frac12 + \frac7{22}\right) = \frac{20V}{11R}$, então $R_1 = \frac{11}{20}R$.</p>
          <p>$\frac{I_1}{I_2} = \frac{R_2}{R_1} = \frac{3/4}{11/20} = \frac{15}{11} \approx 1{,}36$. Conferi resolvendo as duas malhas com a matriz de Kirchhoff em Python.</p>
          <p><b>Tentadora:</b> B é quem inverte ($11/15 \approx 0{,}73$).</p>` }),

      ex({ n: 26, marcas: ["IME", "!"], enun: R`<p>Uma corda flexível e inextensível tem as pontas presas ao teto em dois pontos separados por $2L$ e forma a catenária $y(x) = \frac b2\left(e^{x/b} + e^{-x/b}\right)$, $-L \le x \le L$, com $\tan\theta(x) = \frac12\left(e^{x/b} - e^{-x/b}\right)$. Densidade linear constante, comprimento total $S$, gravidade $g$. Dica da prova: equilíbrio da corda inteira e depois de metade dela. O valor mínimo local da velocidade de um pulso transversal é:</p>`,
        fig: fig(26, "Catenária presa em dois pontos separados por 2L, com o ângulo θ da tangente na ponta e a altura mínima b", 440),
        alts: [R`$\sqrt{\tfrac12Sg\left(e^{L/b} - e^{-L/b}\right)}$`, R`$\sqrt{Sg\left(e^{L/b} - e^{-L/b}\right)}$`, R`$\tfrac12\sqrt{Sg\left(e^{L/b} - e^{-L/b}\right)^{-1}}$`, R`$\sqrt{Sg\left(e^{L/b} - e^{-L/b}\right)^{-1}}$`, R`$\tfrac12\sqrt{Sg\left(e^{L/b} - e^{-L/b}\right)}$`],
        dicas: [R`<p>$v = \sqrt{T/\lambda}$ ${F.ret("O01")}: o mínimo de $v$ é onde a tração é mínima, no ponto mais baixo (lá a tração é só horizontal, $T_0$).</p>`, R`<p>Corda inteira: $2T_\text{ponta}\sin\theta_L = \lambda Sg$. Metade: $T_0 = T_\text{ponta}\cos\theta_L$.</p>`],
        resp: "D", sol: R`<p>Corda inteira (vertical): $2T_\text{p}\sin\theta_L = \lambda Sg$. Metade da corda (horizontal): no ponto mais baixo a tração é $T_0$, horizontal, e $T_0 = T_\text{p}\cos\theta_L$. Dividindo: $T_0 = \frac{\lambda Sg}{2\tan\theta_L}$.</p>
          <p>$\tan\theta_L = \frac12\left(e^{L/b} - e^{-L/b}\right)$, então $T_0 = \frac{\lambda Sg}{e^{L/b} - e^{-L/b}}$.</p>
          <p>A componente horizontal da tração é a mesma em toda a corda, então $T = T_0/\cos\theta \ge T_0$: o mínimo é no fundo. $v_\text{mín} = \sqrt{\frac{T_0}\lambda} = \sqrt{Sg\left(e^{L/b} - e^{-L/b}\right)^{-1}}$.</p>
          <p>Conferência: o comprimento da catenária é $S = b\left(e^{L/b} - e^{-L/b}\right)$, então $v_\text{mín} = \sqrt{gb}$, que é o resultado conhecido.</p>
          <p><b>Tentadora:</b> B é a fração de cabeça para baixo. Teste de sanidade: com a corda mais esticada ($b$ grande), $\frac{e^{L/b} - e^{-L/b}}{S}$ fica pequeno e $v$ cresce, como deve ser (corda esticada = tração grande); B faria o contrário.</p>` }),

      ex({ n: 27, enun: R`<p>Um projétil é uma pilha com um ímã em cada ponta, ambos encostando num solenoide (de fio sem isolamento). O projétil é posto dentro do solenoide pela ponta direita e acelera, a partir do repouso, até a outra ponta. Dados: resistência por espira 0,04 Ω; os contatos dos ímãs sempre distam 10 espiras; campo dos ímãs 1,5 T; pilha de 6 V; massa 10 g; comprimento do projétil 50 mm; comprimento do solenoide 300 mm; permeabilidade $2\times10^{-6}$ T·m/A. Experimentalmente, a força em newtons é numericamente 45 vezes o produto do campo do solenoide pelo campo do ímã (em tesla). A velocidade com que o projétil começa a deixar o solenoide, em m/s, é:</p>`,
        fig: fig(27, "Pilha com ímãs nas pontas e o projétil andando para a esquerda dentro do solenoide", 560),
        alts: ["4,5", "5,0", "3,0", "3,5", "4,0"],
        dicas: [R`<p>Só as 10 espiras entre os ímãs conduzem: $R = 10\cdot0{,}04$ Ω. O campo dentro do solenoide é $B = \mu nI$, com $n$ = espiras por metro nesse trecho.</p>`, R`<p>"Começa a deixar": a frente do projétil chega à ponta, então ele andou $300 - 50$ mm.</p>`],
        resp: "A", sol: R`<p>$R = 0{,}4$ Ω, $I = 6/0{,}4 = 15$ A. As 10 espiras ocupam os 50 mm do projétil: $n = 200$ espiras/m. $B = \mu nI = 2\times10^{-6}\cdot200\cdot15 = 6\times10^{-3}$ T.</p>
          <p>$F = 45\cdot6\times10^{-3}\cdot1{,}5 = 0{,}405$ N, constante; $a = 0{,}405/0{,}010 = 40{,}5$ m/s².</p>
          <p>Distância: $0{,}30 - 0{,}05 = 0{,}25$ m. $v = \sqrt{2ad} = \sqrt{2\cdot40{,}5\cdot0{,}25} = \sqrt{20{,}25} = 4{,}5$ m/s.</p>
          <p><b>Tentadora:</b> B ($5{,}0$): quem usa os 300 mm inteiros acha $\sqrt{24{,}3} \approx 4{,}9$.</p>` }),

      ex({ n: 28, enun: R`<p>Pequenas esferas de uma liga metálica estão dentro de três tubos verticais de PVC em série (A embaixo, 0,50 m; B, 0,30 m; C em cima, 0,70 m), separados por membranas. O conjunto sofre inversões (giros de 180°). Nas 8 primeiras, as esferas percorrem só o tubo A; depois tira-se a membrana AB e elas percorrem A + B por mais 10 inversões; por fim tira-se a membrana BC e elas percorrem A + B + C por mais 12 inversões. Calor específico $c = 150$ J/(kg·°C), $g = 10$ m/s². Durante a inversão as bolinhas ficam paradas em relação ao tubo e só caem depois; considere só a energia das quedas. O aumento de temperatura após as 30 inversões, em °C, é:</p>`,
        fig: fig(28, "Três tubos empilhados: A (0,50 m) embaixo com as esferas, B (0,30 m) e C (0,70 m) em cima, separados por membranas", 260),
        alts: ["2,5", "2,0", "1,5", "1,0", "0,5"],
        dicas: [R`<p>Em cada inversão, as esferas caem a altura do trecho aberto. A massa some: $mgH = mc\Delta T$.</p>`, R`<p>Some as quedas: 8 de 0,5 m, 10 de 0,8 m e 12 de 1,5 m.</p>`],
        resp: "B", sol: R`<p>Queda total: $H = 8(0{,}5) + 10(0{,}8) + 12(1{,}5) = 4 + 8 + 18 = 30$ m.</p>
          <p>$mgH = mc\Delta T \Rightarrow \Delta T = \frac{gH}c = \frac{10\cdot30}{150} = 2{,}0$ °C.</p>
          <p>É o experimento de Joule ao contrário (energia mecânica virando calor), com a massa sumindo da conta ${F.ret("T04")}.</p>` }),

      ex({ n: 29, enun: R`<p>Uma fibra ótica, posta sobre a superfície da Terra (raio $R$), deve ligar A (latitude 45° N, longitude 0°) a B (latitude 45° N, longitude 90° L). O índice de refração da fibra é $n$ e a velocidade da luz no vácuo é $c$. O menor tempo possível de viagem de um sinal pela fibra é:</p>`,
        fig: fig(29, "Esfera com o centro C, a latitude φ e a longitude λ de um ponto P", 300),
        alts: [R`$\dfrac{\pi Rn}{6c}$`, R`$\dfrac{\sqrt3\pi Rn}{4c}$`, R`$\dfrac{\sqrt2\pi Rn}{4c}$`, R`$\dfrac{\pi Rn}{3c}$`, R`$\dfrac{\sqrt3\pi Rn}{2c}$`],
        dicas: [R`<p>O caminho mais curto na esfera é o arco de <b>círculo máximo</b>, não o paralelo de 45°.</p>`, R`<p>Ângulo central: $\cos\alpha = \hat A\cdot\hat B$, com $\hat A = (\cos45°, 0, \sin45°)$ e $\hat B = (0, \cos45°, \sin45°)$.</p>`],
        resp: "D", sol: R`<p>$\cos\alpha = 0 + 0 + \sin^2 45° = \frac12 \Rightarrow \alpha = 60° = \frac\pi3$. Arco: $\frac{\pi R}3$.</p>
          <p>Na fibra a luz anda a $c/n$: $t = \frac{\pi R/3}{c/n} = \frac{\pi Rn}{3c}$.</p>
          <p><b>Tentadora:</b> C é o caminho pelo paralelo de 45° (raio $R\cos45°$, um quarto de volta): $\frac\pi2\cdot\frac{R}{\sqrt2} = \frac{\sqrt2\pi R}4$, mais longo que o círculo máximo ($\approx1{,}11R$ contra $\approx1{,}05R$).</p>` }),

      ex({ n: 30, enun: R`<p>Um balde com líquido de densidade $\rho$ está numa balança de braços. Na Situação 1, o equilíbrio ocorre com uma massa $M_1$ do outro lado, igual à massa do líquido. Na Situação 2, o equilíbrio ocorre com $M_2$: uma esfera de raio $R$ e massa $m_e$ é mantida totalmente imersa por um pesquisador, tangenciando a superfície; a mão fica imóvel, em contato com a esfera, sem nenhuma parte submersa. Desprezando as massas do balde e da balança, $M_2$ é:</p>`,
        fig: fig(30, "Balança de braços com o balde de um lado; na situação 2 uma esfera é segurada dentro do líquido", 560),
        alts: [R`$M_1 + \dfrac43\rho\pi R^3 + m_e$`, R`$M_1 + m_e$`, R`$M_1 - \dfrac43\rho\pi R^3 + m_e$`, R`$M_1 + \dfrac43\rho\pi R^3$`, R`$M_1 + \dfrac43\rho\pi R^3 - m_e$`],
        dicas: [R`<p>Quem segura o peso da esfera? A balança só sente o que o líquido faz no balde.</p>`, R`<p>Ação e reação: se o líquido empurra a esfera para cima com o empuxo, a esfera empurra o líquido para baixo com a mesma força.</p>`],
        resp: "D", sol: R`<p>Na esfera: peso, empuxo $E = \rho\frac43\pi R^3g$ e a força da mão. A mão dá o que faltar para ela ficar parada; o peso dela vai para a mão, não para a balança.</p>
          <p>No líquido: além do peso dele, a reação do empuxo, $E$ para baixo. Então a balança sente $M_1g + E$: $M_2 = M_1 + \frac43\rho\pi R^3$.</p>
          <p><b>Tentadoras:</b> A soma também $m_e$ (como se a esfera estivesse solta, apoiada no fundo); B é como se a esfera estivesse boiando com tudo dentro do balde.</p>` }),
    ];
    return [
      F.secao("sobre", "Sobre", R`<p>ITA, IME, AFA, EFOMM, EsPCEx, Escola Naval… cada questão com a prova e o ano. Formato: figura, alternativas, marcação <b>●</b> · <b>X</b> · <b>/</b>, dicas e resolução escondidas.</p>`),
      F.secao("ime27", "IME 2026/27: prova objetiva de física", R`
        <p>As questões 16 a 30 da prova objetiva do IME (concurso 2026/2027). Os enunciados estão transcritos e as figuras foram recortadas da prova. A numeração é a da prova.</p>
        ${F.caixa("pegadinha", R`<p><b>Atenção:</b> as respostas e resoluções são <b>minhas</b>, conferidas com contas em Python, mas <b>não</b> foram comparadas com o gabarito oficial do IME. Se o gabarito oficial discordar em alguma, me avise que eu reviso.</p>`)}
        <p><b>Tempo sugerido:</b> 1h30 para as 15 (6 min cada). Anote a letra e a marcação ● X / de cada uma antes de abrir as resoluções.</p>`),
      F.secao("questoes", "Questões", qs.join("")),
    ].join("");
  },
});
