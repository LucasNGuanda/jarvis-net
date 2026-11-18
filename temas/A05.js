/* A05 · Cinemática Vetorial. Conferido em Python:
   3 km N + 4 km L: 5 km; chuva 10 m/s vertical vista de carro a 10 m/s: 45°; barco u = 4, w = 3, rio de 100 m:
   proa reta → 25 s e 75 m rio abaixo; para chegar em frente, sen θ = 3/4 (48,6°) e 37,8 s; avião 200 km/h com vento lateral de 50:
   206 km/h e correção de 14,5°; 20 m/s em curva de R = 50 m: a_c = 8 m/s²; virar 90° a 10 m/s: |Δv⃗| = 14,1 m/s;
   quarto de volta (R = 20 m, 10 m/s, 3,14 s): |a⃗_m| = 4,50 m/s²; navios 30 N e 40 L: 50 km/h relativos;
   chefão: barco mais lento que a correnteza (u = 3, w = 5, L = 100 m): deriva mínima L√(w² − u²)/u = 133,3 m com proa a 36,9° rio acima (busca numérica confere). */
F.registrar("A05", {
  retoma: ["F02", "A01", "A02"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 150) => D.svg(560, h, conteudo, "figura");
    const rio = (extra, h = 150) => fig(`<rect x="20" y="25" width="520" height="${h - 50}" style="fill:color-mix(in srgb,var(--mC) 14%,transparent)"/><line x1="20" x2="540" y1="25" y2="25" style="stroke:var(--ink2);stroke-width:2"/><line x1="20" x2="540" y1="${h - 25}" y2="${h - 25}" style="stroke:var(--ink2);stroke-width:2"/>` + D.seta(440, 45, 520, 45, "var(--mC)", 1.6) + extra, h);
    const exemplos = F.exemplo({
      titulo: "Vetores no movimento",
      casos: [
        { nome: "Fácil: deslocamento vetorial", gerar: (p) => {
          const a = p ? 3 : F.escolha([3, 6, 5, 8]), b = p ? 4 : F.escolha([4, 8, 12, 6]), t = p ? 0.5 : F.escolha([0.5, 1, 2]), m = Math.hypot(a, b), ang = (Math.atan2(a, b) * 180) / Math.PI;
          return { enun: R`<p>Um ciclista anda ${a} km para o norte e depois ${b} km para o leste, em ${F.nt(t)} h no total. Ache o deslocamento vetorial (módulo e direção), a velocidade vetorial média e a rapidez média.</p>`,
            fig: fig(D.seta(200, 130, 200, 130 - a * 10, "var(--mA)") + D.seta(200, 130 - a * 10, 200 + b * 10, 130 - a * 10, "var(--mT)") + D.seta(200, 130, 200 + b * 10, 130 - a * 10, "var(--warn)") + D.txt(186, 125 - a * 5, `${a}`, "tx2", "end") + D.txt(200 + b * 5, 120 - a * 10, `${b}`, "tx2") + D.txt(470, 30, "N ↑   L →", "tx2")),
            passos: [R`<p>(i) Os dois trechos são perpendiculares: $|\Delta\vec r| = \sqrt{${a}^2 + ${b}^2} = ${F.n(m, 3)}$ km ${F.ret("F02")}, fazendo um ângulo de $\arctan\frac{${a}}{${b}} \approx ${F.n(ang, 1)}°$ com o leste (para o norte).</p>`, R`<p>(ii) Velocidade vetorial média: $\frac{|\Delta\vec r|}{\Delta t} = \frac{${F.n(m, 3)}}{${F.n(t)}} = ${F.n(m / t, 3)}$ km/h, na direção do deslocamento.</p>`, R`<p>(iii) Rapidez média: $\frac{${a} + ${b}}{${F.n(t)}} = ${F.n((a + b) / t, 3)}$ km/h, maior, porque o caminho foi maior que o deslocamento.</p>`] };
        } },
        { nome: "Médio: travessia do rio", gerar: (p) => {
          const u = p ? 4 : F.escolha([4, 5, 2.5]), w = p ? 3 : F.escolha([3, 4, 1.5]), L = p ? 100 : F.escolha([60, 100, 120]), th = Math.asin(w / u);
          return { enun: R`<p>Um barco anda a ${F.nt(u)} m/s em relação à água, num rio de ${L} m de largura e correnteza de ${F.nt(w)} m/s. (a) Com a proa perpendicular à margem, quanto tempo leva e onde chega? (b) Para onde apontar a proa para chegar exatamente em frente, e quanto tempo leva?</p>`,
            fig: rio(`<circle cx="160" cy="125" r="4" style="fill:var(--ink)"/>` + D.seta(160, 125, 160, 70, "var(--mA)") + D.seta(160, 125, 210, 125, "var(--mC)") + D.seta(160, 125, 210, 70, "var(--warn)") + D.txt(150, 66, "u", "txm", "end") + D.txt(222, 66, "v", "txm", "start")),
            passos: [R`<p>(i) <b>Proa reta</b>: a correnteza não ajuda nem atrapalha a travessia. $t = \frac{${L}}{${F.n(u)}} = ${F.n(L / u, 3)}$ s; nesse tempo, a correnteza leva o barco $${F.n(w)}\cdot${F.n(L / u, 3)} = ${F.n((w * L) / u, 3)}$ m rio abaixo.</p>`, R`<p>(ii) <b>Chegar em frente</b>: a componente da velocidade do barco rio acima precisa cancelar a correnteza, $u\sin\theta = w$, então $\sin\theta = \frac{${F.n(w)}}{${F.n(u)}}$, $\theta \approx ${F.n((th * 180) / Math.PI, 1)}°$ rio acima (medido da perpendicular).</p>`, R`<p>(iii) Velocidade de travessia: $u\cos\theta = \sqrt{u^2 - w^2} = ${F.n(Math.sqrt(u * u - w * w), 3)}$ m/s, e $t = ${F.n(L / Math.sqrt(u * u - w * w), 3)}$ s: chegar em frente demora mais.</p>`] };
        } },
        { nome: "Olimpíada: a menor distância entre dois navios", gerar: (p) => {
          const vA = p ? 30 : F.escolha([30, 20]), vB = p ? 40 : F.escolha([40, 15]), d = p ? 50 : F.escolha([50, 100]);
          const vr = Math.hypot(vA, vB), dmin = (d * vA) / vr, tmin = (d * vB) / (vr * vr);
          return { enun: R`<p>O navio A está ${d} km a leste do navio B. A navega para o norte a ${vA} km/h e B navega para o leste a ${vB} km/h. Qual a menor distância entre eles e quando ela acontece?</p>`,
            fig: fig(`<circle cx="160" cy="110" r="6" style="fill:var(--mT)"/><circle cx="400" cy="110" r="6" style="fill:var(--mA)"/>` + D.seta(160, 110, 230, 110, "var(--mT)") + D.seta(400, 110, 400, 55, "var(--mA)") + D.txt(150, 132, "B", "tx2") + D.txt(410, 132, "A", "tx2") + D.txt(280, 102, `${d} km`, "tx2")),
            passos: [R`<p>(i) Vá para o referencial de B ${F.ret("A02")}: nele, B está parado e A tem velocidade $\vec v_A - \vec v_B = (-${vB},\ ${vA})$ km/h, de módulo $${F.n(vr, 3)}$ km/h, numa reta fixa.</p>`, R`<p>(ii) A menor distância é a distância de B a essa reta. A reta passa por A (a ${d} km de B) e faz com a linha BA um ângulo cujo seno é $\frac{${vA}}{${F.n(vr, 3)}}$: $d_\text{mín} = ${d}\cdot\frac{${vA}}{${F.n(vr, 3)}} = ${F.n(dmin, 3)}$ km.</p>`, R`<p>(iii) O tempo: A anda, no referencial de B, até o pé da perpendicular, $${d}\cdot\frac{${vB}}{${F.n(vr, 3)}}$ km, a $${F.n(vr, 3)}$ km/h: $t = ${F.n(tmin, 3)}$ h $\approx ${F.n(tmin * 60, 1)}$ min.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O barco mais lento que a correnteza",
      enun: R`<p>Um barco anda com velocidade $u$ em relação à água, num rio de largura $L$ com correnteza $w > u$. Ele quer atravessar sendo arrastado <b>o mínimo possível</b> rio abaixo. (a) Mostre que, para a proa a um ângulo $\theta$ rio acima (medido da perpendicular à margem), o arrasto na chegada é $x(\theta) = L\,\frac{w - u\sin\theta}{u\cos\theta}$. (b) Ache o $\theta$ que minimiza $x$ e mostre que $x_\text{mín} = \frac{L\sqrt{w^2 - u^2}}{u}$. (c) Interprete geometricamente: desenhe $\vec w$ e, na ponta dele, um círculo de raio $u$ (todas as possíveis $\vec u$). Que $\vec v = \vec u + \vec w$ faz o menor ângulo com a perpendicular? (d) Calcule para $u = 3$ m/s, $w = 5$ m/s, $L = 100$ m. (e) Compare com a proa reta.</p>`,
      fig: rio(D.seta(180, 120, 300, 120, "var(--mC)") + `<circle cx="300" cy="120" r="72" style="fill:none;stroke:var(--mA);stroke-dasharray:5 4"/>` + D.seta(180, 120, 258, 62, "var(--warn)") + D.txt(240, 136, "w", "txm") + D.txt(370, 70, "possíveis u", "tx2"), 160),
      dicas: [R`<p>(a) Componentes: travessia $u\cos\theta$, rio abaixo $w - u\sin\theta$. O tempo é $L/(u\cos\theta)$.</p>`, R`<p>(b) Derive $x(\theta)$ e iguale a zero ${F.ret("F04")}: aparece $\sin\theta = \frac uw$.</p>`],
      sol: R`<p><b>(a)</b> Em relação à margem: componente de travessia $u\cos\theta$, rio abaixo $w - u\sin\theta$. Tempo $t = \frac{L}{u\cos\theta}$; arrasto $x = (w - u\sin\theta)t = L\frac{w - u\sin\theta}{u\cos\theta}$.</p>
        <p><b>(b)</b> $\frac{dx}{d\theta} = \frac Lu\cdot\frac{-u\cos^2\theta + (w - u\sin\theta)\sin\theta}{\cos^2\theta} = \frac Lu\cdot\frac{w\sin\theta - u}{\cos^2\theta}$ (usando $\cos^2\theta + \sin^2\theta = 1$). Zera em $\sin\theta = \frac uw$. Então $\cos\theta = \frac{\sqrt{w^2 - u^2}}{w}$ e</p>
        <p>$$x_\text{mín} = L\,\frac{w - u^2/w}{u\sqrt{w^2 - u^2}/w} = L\,\frac{w^2 - u^2}{u\sqrt{w^2 - u^2}} = \frac{L\sqrt{w^2 - u^2}}{u}.$$</p>
        <p><b>(c)</b> As pontas de $\vec v$ estão no círculo de raio $u$ centrado na ponta de $\vec w$. A direção de $\vec v$ mais "inclinada para a outra margem" é a da reta tangente ao círculo saindo da origem. Na tangente, $\vec u \perp \vec v$: o triângulo retângulo de hipotenusa $w$ e cateto $u$ dá $\sin\theta = \frac uw$, igual ao cálculo. Nesse caso, o barco não aponta para frente nem para cima: aponta de modo que sua velocidade em relação à água seja perpendicular à velocidade real.</p>
        <p><b>(d)</b> $\sin\theta = 0{,}6$, $\theta \approx 36{,}9°$ rio acima; $x_\text{mín} = \frac{100\cdot4}{3} \approx 133$ m. (Conferido com uma busca numérica em $\theta$.)</p>
        <p><b>(e)</b> Proa reta: $x = \frac{wL}{u} \approx 167$ m. Apontar um pouco rio acima economiza 33 m, mesmo com a correnteza mais forte que o barco.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Uma pessoa anda 3 km para o norte e 4 km para o leste. Qual o módulo do deslocamento?</p>`, fig: fig(D.seta(200, 130, 200, 70, "var(--mA)") + D.seta(200, 70, 280, 70, "var(--mT)") + D.seta(200, 130, 280, 70, "var(--warn)") + D.txt(190, 104, "3 km", "tx2", "end") + D.txt(240, 62, "4 km", "tx2")), num: { v: 5, un: "km" }, dicas: [R`<p>Pitágoras.</p>`], resp: "5 km", sol: R`<p>$\sqrt{9 + 16} = 5$ km. A distância percorrida foi 7 km.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>A chuva cai verticalmente a 10 m/s. Um carro anda a 10 m/s. Que ângulo com a vertical o motorista vê a chuva fazer?</p>`, num: { v: 45, un: "graus" }, dicas: [R`<p>$\vec v_\text{chuva, carro} = \vec v_\text{chuva} - \vec v_\text{carro}$.</p>`], resp: "45°", sol: R`<p>Componentes iguais (10 e 10): $\tan\alpha = 1$, $\alpha = 45°$.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Um barco anda a 4 m/s em relação à água num rio de 100 m com correnteza de 3 m/s, com a proa sempre perpendicular à margem. Quanto tempo leva para atravessar?</p>`, fig: rio(`<circle cx="160" cy="125" r="4" style="fill:var(--ink)"/>` + D.seta(160, 125, 160, 70, "var(--mA)") + D.txt(150, 80, "4 m/s", "tx2", "end") + D.txt(470, 62, "3 m/s", "tx2")), num: { v: 25, un: "s" }, dicas: [R`<p>Só a componente perpendicular à margem importa para o tempo.</p>`], resp: "25 s", sol: R`<p>$\frac{100}{4} = 25$ s, independente da correnteza.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>No exercício anterior, quantos metros rio abaixo o barco chega?</p>`, num: { v: 75, un: "m" }, dicas: [R`<p>Correnteza × tempo.</p>`], resp: "75 m", sol: R`<p>$3\cdot25 = 75$ m.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Ainda no mesmo rio, com que ângulo (a partir da perpendicular, rio acima) o barco deve apontar a proa para chegar exatamente em frente?</p>`, alts: ["36,9°", "41,4°", "48,6°", "53,1°", "não dá"], certa: "C", dicas: [R`<p>$u\sin\theta = w$.</p>`], resp: "C", sol: R`<p>$\sin\theta = \frac34$, $\theta \approx 48{,}6°$. <b>A</b> e <b>D</b> são os ângulos do triângulo 3-4-5, que aparecem quando se usa tangente em vez de seno.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Um avião voa a 200 km/h em relação ao ar, apontado para o norte, com vento de 50 km/h para o leste. Qual a velocidade dele em relação ao chão?</p>`, fig: fig(D.seta(280, 130, 280, 40, "var(--mA)") + D.seta(280, 130, 330, 130, "var(--mC)") + D.seta(280, 130, 330, 40, "var(--warn)") + D.txt(270, 80, "200 km/h", "tx2", "end") + D.txt(305, 145, "vento 50", "tx2")), num: { v: Math.hypot(200, 50), tol: 0.005, un: "km/h" }, dicas: [R`<p>Soma vetorial de vetores perpendiculares.</p>`], resp: "≈ 206 km/h", sol: R`<p>$\sqrt{200^2 + 50^2} \approx 206$ km/h, desviado $\arctan\frac{50}{200} \approx 14°$ para o leste.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Um carro faz uma curva de raio 50 m a 20 m/s constantes. Qual a aceleração centrípeta?</p>`, num: { v: 8, un: "m/s²" }, dicas: [R`<p>$a_c = \frac{v^2}R$ (Teorema 3).</p>`], resp: "8 m/s²", sol: R`<p>$\frac{400}{50} = 8$ m/s², quase $g$: por isso dá para sentir o corpo "ser jogado" para fora na curva.</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Um carro a 10 m/s faz uma curva de 90° e sai com os mesmos 10 m/s. Qual o módulo da variação do vetor velocidade?</p>`, fig: fig(D.seta(200, 120, 280, 120, "var(--mA)") + D.seta(280, 120, 280, 40, "var(--mT)") + D.seta(200, 120, 200, 40, "var(--warn)") + D.txt(240, 140, "v antes", "tx2") + D.txt(320, 80, "v depois", "tx2") + D.txt(150, 80, "Δv = depois − antes", "tx2", "end"), 155), num: { v: 10 * Math.SQRT2, tol: 0.005, un: "m/s" }, dicas: [R`<p>$\Delta\vec v = \vec v_\text{depois} - \vec v_\text{antes}$: dois vetores perpendiculares de módulo 10.</p>`], resp: "10√2 ≈ 14,1 m/s", sol: R`<p>$|\Delta\vec v| = \sqrt{10^2 + 10^2} \approx 14{,}1$ m/s. A rapidez não mudou, mas a velocidade (vetor) mudou bastante: houve aceleração.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>No exercício anterior, a curva é um quarto de circunferência de raio 20 m. Qual o módulo da aceleração vetorial média na curva?</p>`, num: { v: 10 * Math.SQRT2 / Math.PI, tol: 0.01, un: "m/s²" }, dicas: [R`<p>Tempo da curva: $\frac{\pi R/2}{v}$.</p>`], resp: "≈ 4,50 m/s²", sol: R`<p>$t = \frac{10\pi}{10} = \pi$ s; $|\vec a_m| = \frac{14{,}1}{\pi} \approx 4{,}50$ m/s². Menor que a centrípeta instantânea $\frac{v^2}R = 5$ m/s², porque a média soma vetores que apontam para direções diferentes.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>O navio A vai para o norte a 30 km/h e o navio B vai para o leste a 40 km/h. Qual o módulo da velocidade de A em relação a B?</p>`, num: { v: 50, un: "km/h" }, dicas: [R`<p>$\vec v_{A,B} = \vec v_A - \vec v_B$.</p>`], resp: "50 km/h", sol: R`<p>$(-40,\ 30)$ km/h, módulo 50 km/h, apontando para noroeste.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Numa curva feita com rapidez <b>aumentando</b>, para onde aponta a aceleração?</p>`, alts: ["para o centro da curva", "para fora da curva", "na direção da velocidade", "entre a direção da velocidade e o centro da curva", "é zero"], certa: "D", dicas: [R`<p>Há duas partes: a tangencial (muda a rapidez) e a centrípeta (muda a direção).</p>`], resp: "D", sol: R`<p>$\vec a = \vec a_t + \vec a_c$: a tangencial aponta para frente (rapidez aumentando) e a centrípeta para o centro; a soma aponta entre as duas.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Um nadador atravessa um rio de 60 m nadando a 1,5 m/s em relação à água, com a cabeça apontada perpendicularmente à margem. Ele chega 80 m rio abaixo. Qual a velocidade da correnteza?</p>`, fig: rio(`<circle cx="160" cy="125" r="4" style="fill:var(--ink)"/><line x1="160" y1="125" x2="373" y2="25" style="stroke:var(--warn);stroke-dasharray:5 4"/>` + D.txt(270, 140, "80 m rio abaixo", "tx2") + D.txt(110, 80, "60 m", "tx2")), num: { v: 2, un: "m/s" }, dicas: [R`<p>Tempo: $\frac{60}{1{,}5}$.</p>`], resp: "2 m/s", sol: R`<p>$t = 40$ s; $w = \frac{80}{40} = 2$ m/s.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · vetores</div>
        <div class="q">Um carro faz uma curva com o velocímetro parado em 60 km/h. Ele está acelerando?</div>
        <p>Está: a <b>direção</b> da velocidade muda, e mudar a velocidade (vetor) é acelerar. Quando o movimento sai da linha reta, posição, velocidade e aceleração precisam ser tratadas como vetores ${F.ret("F02")}, e aparecem duas acelerações diferentes: uma que muda a rapidez e outra que muda a direção.</p></div>`),

      F.secao("vetores", "Posição, deslocamento e velocidade vetoriais", R`
        ${F.formula(R`\Delta\vec r = \vec r_2 - \vec r_1,\qquad \vec v_m = \frac{\Delta\vec r}{\Delta t},\qquad \vec v = \lim_{\Delta t\to0}\frac{\Delta\vec r}{\Delta t} = \frac{d\vec r}{dt}`, "Vetores da cinemática")}
        <h3>Teorema 1: a velocidade é tangente à trajetória</h3>
        ${F.demo("demonstração", R`<p>(i) $\Delta\vec r$ liga dois pontos da trajetória: é uma corda da curva.</p>
          <p>(ii) Com $\Delta t \to 0$, os dois pontos se aproximam e a corda vira a reta tangente à curva no ponto. $\vec v$ é o limite de $\frac{\Delta\vec r}{\Delta t}$, então aponta na direção da tangente, no sentido do movimento.</p>
          <p>(iii) O módulo: quando os pontos se aproximam, a corda e o arco ficam iguais, então $|\vec v| = \lim\frac{|\Delta\vec r|}{\Delta t} = \lim\frac{\Delta s}{\Delta t}$, a velocidade escalar ${F.ret("A01")}. $\blacksquare$</p>`)}
        <p>Em componentes: $\vec v = (v_x, v_y)$, com $v_x = \frac{dx}{dt}$ e $v_y = \frac{dy}{dt}$. Cada direção pode ser tratada separadamente: é isso que vai tornar os lançamentos ${F.ret("A06")} fáceis.</p>`),

      F.secao("composicao", "Composição de movimentos", R`
        <h3>Teorema 2: as velocidades se somam como vetores</h3>
        ${F.demo("demonstração", R`<p>(i) Seja $\vec r_{P,T}$ a posição de um barco P em relação à Terra T, $\vec r_{P,A}$ em relação à água A, e $\vec r_{A,T}$ a posição de um ponto fixo da água em relação à Terra. Somando os vetores: $\vec r_{P,T} = \vec r_{P,A} + \vec r_{A,T}$.</p>
          <p>(ii) Derivando no tempo:</p>
          ${F.formula(R`\vec v_{P,T} = \vec v_{P,A} + \vec v_{A,T}`, "Composição de velocidades (Galileu)")}
          <p>(iii) O mesmo vale para chuva e carro, avião e vento, pessoa e esteira. $\blacksquare$</p>`)}
        ${F.caixa("fisico", R`<p><b>Independência das direções</b>: no rio, a correnteza é paralela à margem. Ela não muda a componente da velocidade do barco perpendicular à margem, e então não muda o tempo de travessia. A correnteza só decide <b>onde</b> o barco chega.</p>`)}
        <div id="lab-rio"></div>
        ${F.caixa("pegadinha", R`<p><b>"Apontar" não é "ir"</b>: a proa aponta na direção de $\vec u$ (velocidade em relação à água), mas o barco anda na direção de $\vec v = \vec u + \vec w$. Para chegar em frente, a proa precisa apontar rio acima. E se $w > u$, chegar em frente é impossível (veja o chefão).</p>`)}`),

      F.secao("aceleracao", "Aceleração tangencial e centrípeta", R`
        <p>A aceleração vetorial $\vec a = \frac{d\vec v}{dt}$ pode ser separada em duas partes, uma ao longo da velocidade e outra perpendicular a ela:</p>
        ${F.formula(R`\vec a = \vec a_t + \vec a_c,\qquad |\vec a_t| = \left|\frac{dv}{dt}\right|,\qquad |\vec a_c| = \frac{v^2}{R}`, "Componentes da aceleração (R = raio da curva)")}
        <h3>Teorema 3: a aceleração centrípeta vale $v^2/R$</h3>
        ${F.demo("demonstração geométrica", R`<p>(i) Movimento circular de raio $R$ com rapidez constante $v$. Num intervalo pequeno $\Delta t$, o raio gira de um ângulo $\Delta\theta$ e o corpo anda o arco $v\Delta t = R\Delta\theta$.</p>
          <p>(ii) A velocidade (perpendicular ao raio) também gira de $\Delta\theta$. Os vetores $\vec v_1$ e $\vec v_2$, de mesmo módulo $v$, formam com $\Delta\vec v$ um triângulo isósceles de ângulo $\Delta\theta$ no vértice: $|\Delta\vec v| \approx v\,\Delta\theta$ (ângulo pequeno ${F.ret("F05")}).</p>
          <p>(iii) $|\vec a| = \frac{|\Delta\vec v|}{\Delta t} \approx \frac{v\Delta\theta}{\Delta t} = v\cdot\frac{v}{R} = \frac{v^2}R$.</p>
          <p>(iv) Direção: $\Delta\vec v$ fica perpendicular a $\vec v$ quando $\Delta\theta \to 0$, apontando para o centro. Por isso "centrípeta" (que procura o centro). $\blacksquare$</p>`)}
        <p>Resumo: a <b>tangencial</b> muda a rapidez (é a aceleração escalar de ${F.ret("A01")}); a <b>centrípeta</b> muda a direção. No MRU as duas são zero; no MUV só há tangencial; no movimento circular uniforme ${F.ret("A07")}, só centrípeta.</p>
        ${F.caixa("olimpiada", R`<p><b>Mudar de referencial</b> transforma problemas de dois corpos em problemas de um corpo só: no referencial de um navio, o outro anda em linha reta com a velocidade relativa, e "menor distância" vira "distância de um ponto a uma reta" (exemplo de olimpíada).</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>: em coordenadas polares, $\vec a = (\ddot r - r\dot\theta^2)\hat r + (r\ddot\theta + 2\dot r\dot\theta)\hat\theta$. O termo $-r\dot\theta^2 = -\frac{v^2}r$ é a centrípeta; o $2\dot r\dot\theta$ é a aceleração de Coriolis, que desvia furacões e projéteis de longo alcance.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-rio"); e.outerHTML = F.lab("Barco atravessando o rio", "lab-rio"); SIM.barcoRio(document.getElementById("lab-rio"), F); },
});
