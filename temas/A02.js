/* A02 · Movimento Retilíneo Uniforme. Conferido em Python:
   20 m/s por 15 s: 300 m; s = 50 − 10t passa pela origem em 5 s; trem 200 m a 72 km/h na ponte de 400 m: 30 s;
   encontro (0; 15 m/s) e (150 m; −10 m/s): 6 s em 90 m; perseguição 25 × 15 m/s com 100 m: 10 s;
   s = 10 + 2t e s = 30 − 3t: 4 s; área 12 m/s × 5 s: 60 m; eco 1,2 s (som 340 m/s): 204 m; escada 60 s e 40 s: 24 s;
   barco 5 m/s, rio 3 m/s, 1,2 km e volta: 750 s; trens 150 + 250 m a 20 e 30 m/s: 8 s; trem 10 s na pessoa e 25 s na ponte de 300 m: 200 m;
   ônibus a cada 12 min (de trás) e 4 min (de frente): saem a cada 6 min, V/u = 2;
   chefão: formigas no triângulo, t = 2L/(3v) (simulado: 66,68 s para L = 1 m, v = 1 cm/s); n-ágono: L/(v(1 − cos 2π/n)). */
F.registrar("A02", {
  retoma: ["A01", "F01", "F02"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 120) => D.svg(560, h, conteudo, "figura");
    const graf = (o, h = 210) => D.svg(560, h, D.graf(o), "gráfico");
    const exemplos = F.exemplo({
      titulo: "MRU",
      casos: [
        { nome: "Fácil: função horária", gerar: (p) => {
          const s0 = p ? 40 : F.escolha([20, 40, 60, 100]), v = p ? -8 : F.escolha([-8, -5, 4, 10]), alvo = p ? 0 : F.escolha([0, 120, 10]);
          const t = (alvo - s0) / v;
          return { enun: R`<p>Um carrinho está na posição $s_0 = ${s0}$ m e anda em MRU com velocidade $v = ${v}$ m/s. Escreva a função horária e diga em que instante ele passa pela posição $${alvo}$ m.</p>`,
            fig: fig(D.estrada(40, 520, 90, 3.2, 25, "m") + D.carro(40 + s0 * 3.2, 84, "var(--mA)", v > 0 ? 1 : -1) + D.seta(40 + s0 * 3.2, 46, 40 + s0 * 3.2 + (v > 0 ? 60 : -60), 46, "var(--warn)") + D.txt(40 + s0 * 3.2, 36, `${v} m/s`, "tx2")),
            passos: [R`<p>(i) MRU: $s = s_0 + vt = ${s0} ${v < 0 ? "-" : "+"} ${Math.abs(v)}t$ (SI).</p>`, R`<p>(ii) $${alvo} = ${s0} ${v < 0 ? "-" : "+"} ${Math.abs(v)}t \Rightarrow t = \frac{${alvo} - ${s0}}{${v}} = ${F.n(t, 3)}$ s.</p>`, t < 0 ? R`<p>(iii) O tempo deu negativo: ele passou por lá <b>antes</b> de $t = 0$ (está se afastando dessa posição). Fisicamente, depois de $t = 0$ ele não passa mais por ali.</p>` : R`<p>(iii) Tempo positivo: ele chega lá ${F.n(t, 3)} s depois de começarmos a contar.</p>`] };
        } },
        { nome: "Médio: encontro", gerar: (p) => {
          const sb = p ? 150 : F.escolha([120, 150, 200]), va = p ? 15 : F.escolha([10, 15, 20]), vb = p ? -10 : F.escolha([-10, -5, 5]);
          const te = sb / (va - vb), se = va * te;
          return { enun: R`<p>O carro A sai da posição 0 a ${va} m/s. No mesmo instante, o carro B está em ${sb} m com velocidade ${vb} m/s (negativa = indo para a esquerda). Quando e onde eles se encontram?</p>`,
            fig: fig(D.estrada(40, 520, 90, 480 / 220, 20, "m") + D.carro(40, 84, "var(--mA)", 1) + D.carro(40 + sb * 480 / 220, 84, "var(--mT)", vb > 0 ? 1 : -1) + D.txt(40, 46, "A", "tx2") + D.txt(40 + sb * 480 / 220, 46, "B", "tx2")),
            passos: [R`<p>(i) Funções horárias: $s_A = ${va}t$ e $s_B = ${sb} ${vb < 0 ? "-" : "+"} ${Math.abs(vb)}t$.</p>`, R`<p>(ii) Encontro: $s_A = s_B \Rightarrow (${va} ${vb < 0 ? "+" : "-"} ${Math.abs(vb)})t = ${sb} \Rightarrow t = ${F.n(te, 3)}$ s.</p>`, R`<p>(iii) Posição: $s = ${va}\cdot${F.n(te, 3)} = ${F.n(se, 3)}$ m. Pela velocidade relativa: a distância de ${sb} m diminui a $|v_A - v_B| = ${Math.abs(va - vb)}$ m/s, então $t = ${sb}/${Math.abs(va - vb)}$, o mesmo.</p>`] };
        } },
        { nome: "Olimpíada: os ônibus e o pedestre", gerar: (p) => {
          const t1 = p ? 12 : F.escolha([12, 15, 10]), t2 = p ? 4 : F.escolha([4, 5, 6]), T = (2 * t1 * t2) / (t1 + t2), raz = (t1 + t2) / (t1 - t2);
          return { enun: R`<p>Uma pessoa caminha com velocidade constante ao lado de uma avenida. Os ônibus de uma linha andam todos com a mesma velocidade, igualmente espaçados, nos dois sentidos. A pessoa nota que é ultrapassada por um ônibus (que vem de trás) a cada ${t1} min e que cruza com um ônibus vindo de frente a cada ${t2} min. De quanto em quanto tempo os ônibus saem do terminal? Quantas vezes o ônibus é mais rápido que a pessoa?</p>`,
            fig: fig(`<line x1="20" y1="50" x2="540" y2="50" style="stroke:var(--ink3);stroke-dasharray:6 6"/><line x1="20" y1="100" x2="540" y2="100" style="stroke:var(--ink3);stroke-dasharray:6 6"/>` + D.carro(80, 46, "var(--mA)", 1) + D.carro(300, 46, "var(--mA)", 1) + D.carro(180, 96, "var(--mT)", -1) + D.carro(420, 96, "var(--mT)", -1) + `<circle cx="250" cy="75" r="7" style="fill:var(--warn)"/>` + D.seta(258, 75, 290, 75, "var(--warn)", 1.6) + D.txt(250, 66, "pessoa", "tx2") + D.txt(190, 26, "espaçamento d", "tx2"), 115),
            passos: [R`<p>(i) Seja $V$ a velocidade dos ônibus, $u$ a da pessoa e $d$ a distância entre ônibus seguidos. Os ônibus saem a cada $T = d/V$.</p>`, R`<p>(ii) No referencial da pessoa ${F.ret("F01")}: os de trás se aproximam a $V - u$ e os de frente a $V + u$. Então $t_1 = \frac{d}{V - u}$ e $t_2 = \frac{d}{V + u}$.</p>`, R`<p>(iii) Somando os inversos: $\frac1{t_1} + \frac1{t_2} = \frac{2V}{d} = \frac2T \Rightarrow T = \frac{2t_1t_2}{t_1 + t_2} = ${F.n(T, 3)}$ min. Subtraindo: $\frac1{t_2} - \frac1{t_1} = \frac{2u}{d}$, então $\frac Vu = \frac{t_1 + t_2}{t_1 - t_2} = ${F.n(raz, 3)}$.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "As formigas do triângulo",
      enun: R`<p>Três formigas estão nos vértices de um triângulo equilátero de lado $L$. Ao mesmo tempo, cada uma começa a andar com velocidade de módulo constante $v$, <b>sempre apontada para a formiga seguinte</b> (A persegue B, B persegue C, C persegue A). (a) Por simetria, que forma tem a figura das três formigas a cada instante? (b) Com que rapidez a distância entre A e B diminui? (c) Em quanto tempo elas se encontram, e quanto cada uma andou? Calcule para $L = 1$ m e $v = 1$ cm/s. (d) Generalize para $n$ formigas nos vértices de um polígono regular de lado $L$. Quanto vale para o quadrado? (e) O que acontece com o tempo quando $n \to \infty$? Interprete.</p>`,
      fig: fig(`<polygon points="220,112 340,112 280,8" style="fill:none;stroke:var(--ink3);stroke-dasharray:5 5"/><circle cx="220" cy="112" r="6" style="fill:var(--mA)"/><circle cx="340" cy="112" r="6" style="fill:var(--mT)"/><circle cx="280" cy="8" r="6" style="fill:var(--mO)"/>` + D.seta(220, 112, 270, 112, "var(--mA)") + D.seta(340, 112, 315, 69, "var(--mT)") + D.seta(280, 8, 255, 51, "var(--mO)") + D.txt(206, 122, "A", "tx2") + D.txt(356, 122, "B", "tx2") + D.txt(296, 14, "C", "tx2"), 128),
      dicas: [R`<p>(b) Olhe a velocidade de A e a de B projetadas na reta AB. A anda direto para B; B anda para C, fazendo 120° com o sentido de A para B.</p>`, R`<p>(c) A rapidez de aproximação não muda com o tempo (a figura continua equilátera), então é um "MRU" da distância AB.</p>`],
      sol: R`<p><b>(a)</b> O problema não muda se girarmos tudo de 120°: a cada instante as formigas formam um <b>triângulo equilátero</b>, que encolhe e gira.</p>
        <p><b>(b)</b> Projeção na reta AB (sentido de A para B): a velocidade de A contribui com $v$ (vai direto para B). A velocidade de B aponta para C, fazendo 120° com o sentido de A para B ${F.ret("F03")}: componente $v\cos120° = -\frac v2$, isto é, B se aproxima de A com $\frac v2$. A distância diminui a $v + \frac v2 = \frac{3v}2$ ${F.ret("F02")}.</p>
        <p><b>(c)</b> Como a figura continua equilátera, esse ângulo continua 120° e a rapidez de aproximação é constante: $t = \frac{L}{3v/2} = \frac{2L}{3v} \approx 66{,}7$ s. Cada formiga anda $vt = \frac{2L}3 \approx 67$ cm, embora a trajetória seja uma espiral. Conferi com uma simulação numérica (66,68 s).</p>
        <p><b>(d)</b> No polígono regular, a velocidade da perseguida aponta ao longo do lado seguinte, que faz o ângulo externo $\frac{2\pi}n$ com o prolongamento do lado entre as duas. Projetada na reta que liga as duas, ela foge com $v\cos\frac{2\pi}n$. Aproximação: $v - v\cos\frac{2\pi}n$, e o tempo é $t = \frac{L}{v\left(1 - \cos\frac{2\pi}n\right)}$. Triângulo ($\cos120° = -\frac12$): $\frac{2L}{3v}$, confere com (c). Quadrado ($\cos90° = 0$): $\frac Lv$.</p>
        <p><b>(e)</b> $1 - \cos\frac{2\pi}n \to 0$, então o tempo vai a infinito: com muitos lados, a perseguida anda quase na mesma direção da perseguidora e a distância entre elas quase não diminui. No limite, é um carrossel: cada uma corre atrás da outra em círculo, para sempre.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Um carro em MRU anda a 20 m/s. Quantos metros ele percorre em 15 s?</p>`, fig: fig(D.estrada(40, 520, 90, 1.5, 50, "m") + D.carro(60, 84, "var(--mA)") + D.seta(90, 50, 200, 50, "var(--warn)") + D.txt(145, 40, "20 m/s", "tx2")), num: { v: 300, un: "m" }, dicas: [R`<p>$\Delta s = v\,\Delta t$.</p>`], resp: "300 m", sol: R`<p>$20\cdot15 = 300$ m.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>A função horária de um móvel é $s = 50 - 10t$ (SI). Em que instante ele passa pela origem?</p>`, fig: graf({ x0: 60, y0: 180, w: 420, h: 150, xmax: 7, ymin: -20, ymax: 50, xlab: "t (s)", ylab: "s (m)", xt: [0, 1, 2, 3, 4, 5, 6, 7], yt: [-20, 0, 50], curvas: [{ pts: [[0, 50], [7, -20]], cor: "var(--mA)" }] }),
        alts: ["0,2 s", "2 s", "5 s", "10 s", "nunca passa"], certa: "C", dicas: [R`<p>Origem: $s = 0$.</p>`], resp: "C", sol: R`<p>$0 = 50 - 10t \Rightarrow t = 5$ s. No gráfico, é onde a reta corta o eixo do tempo. <b>A</b> é quem divide ao contrário.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Um trem de 200 m, a 72 km/h, atravessa uma ponte de 400 m. Quanto tempo, do momento em que a frente entra na ponte até a traseira sair?</p>`, fig: fig(`<rect x="200" y="78" width="260" height="12" style="fill:var(--line2)"/>` + D.txt(330, 108, "ponte: 400 m", "tx2") + `<rect x="70" y="56" width="130" height="22" rx="4" style="fill:color-mix(in srgb,var(--mA) 30%,transparent);stroke:var(--mA);stroke-width:2"/>` + D.txt(135, 48, "trem: 200 m", "tx2") + D.seta(205, 67, 250, 67, "var(--warn)")), num: { v: 30, un: "s" }, dicas: [R`<p>Acompanhe a traseira do trem: quanto ela anda até sair da ponte?</p>`, R`<p>$\Delta s = L_\text{trem} + L_\text{ponte}$ e 72 km/h $= 20$ m/s.</p>`], resp: "30 s", sol: R`<p>$\frac{200 + 400}{20} = 30$ s. Quem esquece o tamanho do trem acha 20 s.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>O carro A sai de $s = 0$ a 15 m/s e o carro B, no mesmo instante, está em $s = 150$ m vindo a 10 m/s em sentido contrário. Em quanto tempo eles se encontram?</p>`, fig: fig(D.estrada(40, 520, 90, 3, 25, "m") + D.carro(40, 84, "var(--mA)", 1) + D.carro(490, 84, "var(--mT)", -1) + D.txt(40, 46, "A · 15 m/s", "tx2") + D.txt(490, 46, "B · 10 m/s", "tx2")), num: { v: 6, un: "s" }, dicas: [R`<p>Eles se aproximam a $15 + 10$ m/s.</p>`], resp: "6 s", sol: R`<p>$\frac{150}{25} = 6$ s.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>No exercício anterior, em que posição eles se encontram?</p>`, num: { v: 90, un: "m" }, dicas: [R`<p>Use a função horária de A no instante do encontro.</p>`], resp: "90 m", sol: R`<p>$s_A = 15\cdot6 = 90$ m. Confira com B: $150 - 10\cdot6 = 90$ m.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Uma moto a 25 m/s persegue um carro a 15 m/s, na mesma direção e sentido. No instante inicial, o carro está 100 m à frente. Em quanto tempo a moto o alcança?</p>`, fig: fig(D.estrada(40, 520, 90, 3, 25, "m") + D.carro(60, 84, "var(--mT)", 1) + D.carro(360, 84, "var(--mA)", 1) + D.txt(60, 46, "moto · 25 m/s", "tx2") + D.txt(360, 46, "carro · 15 m/s", "tx2") + D.seta(60, 108, 360, 108, "var(--ink3)", 1.2) + D.txt(210, 104, "100 m", "tx2")), num: { v: 10, un: "s" }, dicas: [R`<p>Velocidade relativa: $25 - 15$.</p>`], resp: "10 s", sol: R`<p>$\frac{100}{10} = 10$ s.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>O gráfico mostra as posições de dois móveis: $s_A = 10 + 2t$ e $s_B = 30 - 3t$ (SI). Em que instante eles se encontram?</p>`, fig: graf({ x0: 60, y0: 180, w: 420, h: 150, xmax: 8, ymin: 0, ymax: 30, xlab: "t (s)", ylab: "s (m)", xt: [0, 2, 4, 6, 8], yt: [10, 20, 30], curvas: [{ pts: [[0, 10], [8, 26]], cor: "var(--mA)" }, { pts: [[0, 30], [8, 6]], cor: "var(--mT)" }] }), num: { v: 4, un: "s" }, dicas: [R`<p>Encontro: as duas retas se cruzam.</p>`], resp: "4 s", sol: R`<p>$10 + 2t = 30 - 3t \Rightarrow t = 4$ s, em $s = 18$ m.</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Pelo gráfico $v \times t$, quanto o corpo andou entre 2 s e 7 s?</p>`, fig: graf({ x0: 60, y0: 180, w: 420, h: 140, xmax: 8, ymin: 0, ymax: 15, xlab: "t (s)", ylab: "v (m/s)", xt: [0, 2, 4, 7, 8], yt: [12], curvas: [{ pts: [[2, 12], [7, 12]], cor: "var(--mA)", area: true }, { pts: [[0, 12], [8, 12]], cor: "var(--mA)" }] }), num: { v: 60, un: "m" }, dicas: [R`<p>Área do retângulo sob o gráfico.</p>`], resp: "60 m", sol: R`<p>$12\cdot(7 - 2) = 60$ m.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Uma pessoa grita de frente para um paredão e ouve o eco 1,2 s depois. O som anda a 340 m/s. A que distância está o paredão?</p>`, fig: fig(`<rect x="470" y="20" width="20" height="90" style="fill:var(--line2)"/><circle cx="90" cy="70" r="9" style="fill:var(--warn)"/>` + D.seta(105, 55, 460, 55, "var(--mA)", 1.6) + D.seta(460, 85, 105, 85, "var(--mT)", 1.6) + D.txt(280, 46, "ida", "tx2") + D.txt(280, 104, "volta (eco)", "tx2")), num: { v: 204, un: "m" }, dicas: [R`<p>Em 1,2 s, o som vai <b>e volta</b>.</p>`], resp: "204 m", sol: R`<p>$2d = 340\cdot1{,}2 \Rightarrow d = 204$ m. É como o morcego e o sonar medem distâncias.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Andando, você sobe uma escada rolante <b>desligada</b> em 60 s. Parado sobre ela <b>ligada</b>, você sobe em 40 s. Andando do mesmo jeito sobre ela ligada, quanto tempo leva?</p>`, fig: fig(`<line x1="120" y1="105" x2="440" y2="25" style="stroke:var(--ink2);stroke-width:4"/>` + D.seta(200, 70, 300, 45, "var(--mA)") + D.txt(240, 40, "você", "tx2") + D.seta(300, 85, 400, 60, "var(--mT)") + D.txt(380, 90, "escada", "tx2")), num: { v: 24, un: "s" }, dicas: [R`<p>Comprimento $L$: sua velocidade é $L/60$, a da escada $L/40$. As velocidades se somam ${F.ret("F01")}.</p>`], resp: "24 s", sol: R`<p>$t = \frac{L}{L/60 + L/40} = \frac{60\cdot40}{100} = 24$ s. Mesma estrutura dos "resistores em paralelo".</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Um barco anda a 5 m/s em relação à água num rio com correnteza de 3 m/s. Ele desce 1,2 km rio abaixo e volta ao ponto de partida. Quanto tempo leva a viagem toda?</p>`, fig: fig(`<rect x="20" y="40" width="520" height="50" style="fill:color-mix(in srgb,var(--mC) 15%,transparent)"/>` + D.seta(60, 30, 160, 30, "var(--mC)", 1.6) + D.txt(110, 22, "correnteza 3 m/s", "tx2") + D.carro(260, 72, "var(--mA)", 1) + D.txt(380, 110, "1,2 km rio abaixo e volta", "tx2")), num: { v: 750, un: "s" }, dicas: [R`<p>Descendo: $5 + 3$; subindo: $5 - 3$.</p>`], resp: "750 s", sol: R`<p>$\frac{1200}{8} + \frac{1200}{2} = 150 + 600 = 750$ s (12,5 min). Sem correnteza seriam 480 s: a correnteza ajuda menos na descida do que atrapalha na subida.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Dois trens, de 150 m e 250 m, andam em trilhos paralelos e sentidos opostos, a 20 m/s e 30 m/s. Quanto tempo dura o cruzamento (da frente com frente até traseira com traseira)?</p>`, fig: fig(`<rect x="60" y="40" width="120" height="20" rx="4" style="fill:color-mix(in srgb,var(--mA) 30%,transparent);stroke:var(--mA);stroke-width:2"/><rect x="200" y="74" width="200" height="20" rx="4" style="fill:color-mix(in srgb,var(--mT) 30%,transparent);stroke:var(--mT);stroke-width:2"/>` + D.seta(185, 50, 230, 50, "var(--mA)") + D.seta(195, 84, 150, 84, "var(--mT)") + D.txt(120, 32, "150 m · 20 m/s", "tx2") + D.txt(300, 112, "250 m · 30 m/s", "tx2")), num: { v: 8, un: "s" }, dicas: [R`<p>No referencial de um dos trens, o outro anda a $20 + 30$ m/s e precisa "passar" $150 + 250$ m.</p>`], resp: "8 s", sol: R`<p>$\frac{400}{50} = 8$ s.</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>Um trem em MRU leva 10 s para passar inteiro por uma pessoa parada na plataforma e 25 s para atravessar inteiro uma ponte de 300 m. Qual o comprimento do trem?</p>`, alts: ["120 m", "150 m", "200 m", "250 m", "300 m"], certa: "C", dicas: [R`<p>Pela pessoa: $vt_1 = L$. Pela ponte: $vt_2 = L + 300$.</p>`], resp: "C", sol: R`<p>Subtraindo: $v(25 - 10) = 300 \Rightarrow v = 20$ m/s; $L = 20\cdot10 = 200$ m.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · MRU</div>
        <div class="q">Dois trens saem ao mesmo tempo de cidades a 300 km uma da outra, um a 100 km/h e o outro a 50 km/h. Onde eles se cruzam?</div>
        <p>A 200 km da cidade do trem rápido, depois de 2 h. O movimento com velocidade constante é o mais simples que existe, mas já dá para resolver encontros, ultrapassagens, ecos e travessias de rio, e é a base para tudo o que vem depois.</p></div>`),

      F.secao("funcao", "Função horária", R`
        <p>No <b>movimento retilíneo uniforme</b>, a velocidade é constante (e não nula): o corpo anda distâncias iguais em intervalos de tempo iguais, sempre no mesmo sentido.</p>
        <h3>Teorema 1: a função horária do MRU</h3>
        ${F.demo("demonstração", R`<p>(i) Com $v$ constante, a velocidade média em qualquer intervalo é igual a $v$ (a média de uma constante é ela mesma): $\frac{s - s_0}{t - 0} = v$.</p>
          <p>(ii) Isolando $s$:</p>
          ${F.formula(R`s(t) = s_0 + vt`, "Função horária do MRU")}
          <p>(iii) Com cálculo: $\frac{ds}{dt} = v$ constante; integrando de 0 a $t$, $s - s_0 = \int_0^tv\,dt' = vt$ ${F.ret("F04")}. $\blacksquare$</p>`)}
        <p>$s_0$ é a posição em $t = 0$ (a "posição inicial"); o sinal de $v$ diz o sentido: $v > 0$ progressivo, $v < 0$ retrógrado.</p>
        ${F.caixa("pegadinha", R`<p><b>"Instante" × "intervalo"</b>: na função horária, $t$ é o instante (a leitura do cronômetro, que começou em zero), e $s_0$ é a posição nesse zero. Se um móvel sai 5 s depois do outro, a função dele é $s = s_0 + v(t - 5)$, válida para $t \ge 5$ s.</p>`)}
        <div id="lab-enc"></div>`),

      F.secao("graficos", "Gráficos do MRU", R`
        <h3>Teorema 2: no gráfico $s \times t$, a inclinação é a velocidade</h3>
        ${F.demo("demonstração", R`<p>(i) $s = s_0 + vt$ é uma função do 1º grau: o gráfico é uma reta que corta o eixo $s$ em $s_0$.</p>
          <p>(ii) Entre dois instantes, $\frac{\Delta s}{\Delta t} = \frac{(s_0 + vt_2) - (s_0 + vt_1)}{t_2 - t_1} = v$: o coeficiente angular da reta é a velocidade. $\blacksquare$</p>`)}
        <h3>Teorema 3: no gráfico $v \times t$, a área é o deslocamento</h3>
        ${F.demo("demonstração", R`<p>(i) O gráfico $v \times t$ do MRU é uma reta horizontal na altura $v$.</p>
          <p>(ii) Entre $t_1$ e $t_2$, a região sob ela é um retângulo de base $\Delta t$ e altura $v$: área $= v\,\Delta t = \Delta s$. Se $v < 0$, a área fica abaixo do eixo e conta negativa. $\blacksquare$</p>`)}
        <p>O Teorema 3 vale para qualquer movimento (não só o MRU): é a integral $\Delta s = \int v\,dt$ ${F.ret("F04")}, e vai ser a principal ferramenta da Análise Gráfica ${F.ret("A04")}.</p>`),

      F.secao("encontros", "Encontros e velocidade relativa", R`
        <h3>Teorema 4: instante do encontro</h3>
        ${F.demo("demonstração", R`<p>(i) Dois móveis em MRU na mesma trajetória: $s_A = s_{0A} + v_At$ e $s_B = s_{0B} + v_Bt$.</p>
          <p>(ii) Eles se encontram quando estão na mesma posição: $s_{0A} + v_At = s_{0B} + v_Bt$.</p>
          ${F.formula(R`t_e = \frac{s_{0B} - s_{0A}}{v_A - v_B}`, "Instante do encontro")}
          <p>(iii) Se $v_A = v_B$, não há encontro (retas paralelas), a não ser que já comecem juntos. Se $t_e < 0$, o "encontro" foi no passado. $\blacksquare$</p>`)}
        <h3>Teorema 5: velocidade relativa</h3>
        ${F.demo("demonstração", R`<p>(i) A distância (com sinal) de A até B é $d(t) = s_B - s_A = (s_{0B} - s_{0A}) + (v_B - v_A)t$.</p>
          <p>(ii) Ela muda com velocidade constante $v_B - v_A$: é como se A estivesse parado e B andasse com a <b>velocidade relativa</b> $v_{B,A} = v_B - v_A$. $\blacksquare$</p>`)}
        <p>Na prática: sentidos opostos, as rapidezes <b>somam</b>; mesmo sentido, <b>subtraem</b>. Escolher o referencial de um dos móveis ${F.ret("F01")} costuma encurtar a conta.</p>
        ${F.caixa("fisico", R`<p><b>Corpos extensos</b>: num trem que atravessa uma ponte, acompanhe sempre o mesmo ponto do trem (a traseira, por exemplo). Ela precisa andar o comprimento da ponte <b>mais</b> o do próprio trem: $\Delta s = L_\text{trem} + L_\text{ponte}$. O mesmo vale para ultrapassagens e cruzamentos de trens.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Truque da soma dos inversos</b>: quando duas "velocidades" se somam ao longo da mesma distância (você andando na escada rolante, dois pintores pintando a mesma parede), os tempos se combinam como $\frac1t = \frac1{t_1} + \frac1{t_2}$. Aparece no exemplo dos ônibus e no exercício 10.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, a velocidade relativa vira a transformação de Galileu, $\vec v_A = \vec v_B + \vec V$, e é justamente ela que a relatividade de Einstein corrige para velocidades próximas da luz ${F.ret("C18")}: ali, as velocidades não se somam mais assim.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-enc"); e.outerHTML = F.lab("Encontro de dois carros", "lab-enc"); SIM.encontro(document.getElementById("lab-enc"), F); },
});
