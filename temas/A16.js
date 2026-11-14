/* A16 · Gravitação. Conferido em Python (G = 6,674e-11, M_T = 5,97e24 kg, R_T = 6,371e6 m):
   g na superfície = 9,82 m/s²; a uma altura R: g/4 = 2,45 m/s² (com g = 9,8); duas pessoas de 70 kg a 1 m: 3,27e-7 N;
   g na Lua (7,35e22 kg, 1,737e6 m) = 1,63 m/s²; ISS a 400 km: g = 8,69 m/s², v = 7,67 km/s, T = 92,4 min;
   escape da superfície: 11,18 km/s; orbital rasante: 7,91 km/s; levar 1000 kg ao infinito: 6,25e10 J;
   ponto de gravidade nula Terra–Lua: 0,900 d = 3,46e8 m do centro da Terra; Hohmann Terra → Marte: Δv = 2,95 km/s (de 29,78 a 32,73 km/s);
   raio de Schwarzschild da Terra: 8,85 mm; lançar na vertical até altura R: v = √(gR) = 7,9 km/s (e não √(2gR));
   chefão: túnel pelo centro da Terra (densidade uniforme, g = 9,8): g(r) = g·r/R, MHS com ω = √(g/R), meia volta = 42,2 min, v no centro = 7,90 km/s; corda qualquer: mesmo tempo. */
F.registrar("A16", {
  retoma: ["A15", "A11", "A10", "F04"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const terra = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" style="fill:color-mix(in srgb,var(--mA) 30%,transparent);stroke:var(--mA)"/>`;
    const exemplos = F.exemplo({
      titulo: "Gravitação",
      casos: [
        { nome: "Fácil: seu peso em outro planeta", gerar: (p) => {
          const mM = p ? 2 : F.escolha([2, 4, 0.5]), mR = p ? 2 : F.escolha([2, 0.5, 3]), gp = (9.8 * mM) / (mR * mR), m = p ? 60 : F.escolha([50, 60, 70]);
          return { enun: R`<p>Um planeta tem ${F.nt(mM)} vezes a massa da Terra e ${F.nt(mR)} vezes o raio. Quanto vale a gravidade na superfície dele? Quanto "pesaria" lá uma pessoa de ${m} kg ($g_\text{Terra} = 9{,}8$ m/s²)?</p>`,
            fig: fig(terra(160, 85, 40) + terra(380, 85, Math.min(40 * mR, 80)) + D.txt(160, 150, "Terra", "tx2") + D.txt(380, 168, "planeta", "tx2"), 175),
            passos: [R`<p>(i) Na superfície, $mg = \frac{GMm}{R^2} \Rightarrow g = \frac{GM}{R^2}$.</p>`, R`<p>(ii) Razão com a Terra: $\frac{g'}{g} = \frac{M'/M}{(R'/R)^2} = \frac{${F.n(mM)}}{${F.n(mR)}^2} = ${F.n(mM / (mR * mR), 3)}$, então $g' \approx ${F.n(gp, 3)}$ m/s².</p>`, R`<p>(iii) A massa continua ${m} kg (é a quantidade de matéria); o peso vira $${m}\cdot${F.n(gp, 3)} \approx ${F.n(m * gp, 3)}$ N, contra ${F.n(m * 9.8)} N aqui.</p>`] };
        } },
        { nome: "Médio: o satélite", gerar: (p) => {
          const h = p ? 400 : F.escolha([300, 400, 800, 2000]), r = 6371e3 + h * 1e3, v = Math.sqrt(3.986e14 / r), T = (2 * Math.PI * r) / v;
          return { enun: R`<p>Um satélite está numa órbita circular a ${h} km de altitude. Qual a velocidade e o período? ($GM_\text{Terra} = 3{,}986\times10^{14}$ m³/s², $R_T = 6371$ km.)</p>`,
            fig: fig(terra(280, 85, 60) + `<circle cx="280" cy="85" r="${60 + h / 60}" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/><circle cx="${280 + 60 + h / 60}" cy="85" r="5" style="fill:var(--warn)"/>`, 175),
            passos: [R`<p>(i) Gravidade = centrípeta ${F.ret("A10")}: $\frac{GMm}{r^2} = \frac{mv^2}r \Rightarrow v = \sqrt{\frac{GM}r}$, com $r = R_T + h = ${F.n(r / 1e3)}$ km (do <b>centro</b> da Terra).</p>`, R`<p>(ii) $v = \sqrt{\frac{3{,}986\times10^{14}}{${F.sigL(r, 4)}}} \approx ${F.n(v / 1000, 3)}$ km/s.</p>`, R`<p>(iii) $T = \frac{2\pi r}v \approx ${F.n(T / 60, 3)}$ min. Quanto mais alto, mais <b>devagar</b> e maior o período (3ª lei de Kepler ${F.ret("A15")}).</p>`] };
        } },
        { nome: "Olimpíada: lançar até uma altura grande", gerar: (p) => {
          const k = p ? 1 : F.escolha([0.5, 1, 3]), v = Math.sqrt((2 * 9.8 * 6371e3 * k) / (1 + k)), vErr = Math.sqrt(2 * 9.8 * 6371e3 * k);
          return { enun: R`<p>Com que velocidade é preciso lançar um objeto verticalmente, da superfície da Terra (sem ar), para que ele chegue a uma altura igual a ${F.nt(k)} ${k === 1 ? "raio" : "raios"} terrestre${k === 1 ? "" : "s"}? ($g = 9{,}8$ m/s², $R = 6371$ km)</p>`,
            fig: fig(terra(160, 130, 100) + D.seta(160, 30, 160, -40, "var(--warn)") + `<line x1="160" y1="30" x2="160" y2="0" style="stroke:var(--warn);stroke-dasharray:4 3"/>`, 165),
            passos: [R`<p>(i) Tão alto, $g$ não é constante: $mgh$ não vale. Use $E_p = -\frac{GMm}r$ e $GM = gR^2$.</p>`, R`<p>(ii) $\frac12v^2 - \frac{gR^2}{R} = 0 - \frac{gR^2}{R + h}$ com $h = ${F.n(k)}R$: $v^2 = 2gR\left(1 - \frac1{${F.n(1 + k)}}\right) = 2gR\cdot\frac{${F.n(k)}}{${F.n(1 + k)}}$.</p>`, R`<p>(iii) $v \approx ${F.n(v / 1000, 3)}$ km/s. Com $v = \sqrt{2gh}$ daria $${F.n(vErr / 1000, 3)}$ km/s, errado: a gravidade enfraquece com a altura, então custa menos subir.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O túnel que atravessa a Terra",
      enun: R`<p>Imagine um túnel reto, sem ar e sem atrito, atravessando a Terra pelo centro (suponha densidade uniforme, $R = 6371$ km, $g = 9{,}8$ m/s² na superfície). Você pula nele. (a) Mostre que, a uma distância $r$ do centro, a gravidade vale $g\frac rR$. (b) Mostre que o movimento é harmônico simples e ache $\omega$. (c) Quanto tempo leva para chegar ao outro lado? (d) Com que velocidade você passa pelo centro? Compare com a velocidade de um satélite rasante. (e) E se o túnel for uma corda reta entre São Paulo e Tóquio, sem passar pelo centro?</p>`,
      fig: fig(terra(280, 85, 80) + `<line x1="280" x2="280" y1="5" y2="165" style="stroke:var(--ink2);stroke-width:5"/><circle cx="280" cy="45" r="5" style="fill:var(--warn)"/>` + `<line x1="215" y1="38" x2="350" y2="125" style="stroke:var(--ink3);stroke-width:3;stroke-dasharray:5 4"/>` + D.txt(372, 30, "corda (item e)", "tx2", "start"), 175),
      dicas: [R`<p>(a) Teorema da casca ${F.ret("TE02")}: a parte de fora (casca) não puxa; só conta a massa dentro do raio $r$, que é $M\frac{r^3}{R^3}$.</p>`, R`<p>(b) Força proporcional ao deslocamento e contrária a ele é uma mola ${F.ret("A20")}: $a = -\omega^2r$.</p>`, R`<p>(e) No túnel-corda, só a componente da gravidade <b>ao longo</b> do túnel acelera. Chame de $x$ a distância ao meio do túnel.</p>`],
      sol: R`<p><b>(a)</b> Massa dentro do raio $r$: $M(r) = M\frac{r^3}{R^3}$. Então $g(r) = \frac{GM(r)}{r^2} = \frac{GM}{R^3}r = g\frac rR$ (usando $GM = gR^2$).</p>
        <p><b>(b)</b> $\ddot r = -\frac gRr$: MHS com $\omega = \sqrt{\frac gR} \approx 1{,}24\times10^{-3}$ rad/s, período $2\pi\sqrt{R/g} \approx 84{,}4$ min.</p>
        <p><b>(c)</b> Meia oscilação: $\approx 42{,}2$ min, e você chega ao outro lado com velocidade zero (se não pegar a borda, volta, para sempre).</p>
        <p><b>(d)</b> $v_\text{máx} = \omega R = \sqrt{gR} \approx 7{,}90$ km/s, exatamente a velocidade orbital rasante! E o período de 84 min é o de um satélite rasante: o movimento no túnel é a "sombra" (projeção) do movimento circular do satélite ${F.ret("A07")}.</p>
        <p><b>(e)</b> A componente ao longo do túnel: $g\frac rR\cdot\frac xr = g\frac xR$, a mesma equação com $x$ no lugar de $r$. Leva os mesmos <b>42 minutos</b> para qualquer corda, curta ou longa! (A Terra real não é uniforme, com núcleo denso; as contas sérias dão uns 38 min pelo centro.)</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Com $G = 6{,}674\times10^{-11}$ N·m²/kg², $M_T = 5{,}97\times10^{24}$ kg e $R_T = 6{,}371\times10^6$ m, calcule $g$ na superfície da Terra.</p>`, num: { v: 9.82, tol: 0.01, un: "m/s²" }, dicas: [R`<p>$g = \frac{GM}{R^2}$.</p>`], resp: "≈ 9,82 m/s²", sol: R`<p>$\frac{6{,}674\times10^{-11}\cdot5{,}97\times10^{24}}{(6{,}371\times10^6)^2} \approx 9{,}82$ m/s². (O valor medido, ~9,78 no equador e 9,83 nos polos, inclui a rotação e o achatamento.)</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>A que vale $g$ a uma altura igual ao raio da Terra ($g_0 = 9{,}8$ m/s²)?</p>`, num: { v: 2.45, un: "m/s²" }, dicas: [R`<p>A distância ao <b>centro</b> dobra.</p>`], resp: "2,45 m/s²", sol: R`<p>$g = \frac{g_0}{2^2} = 2{,}45$ m/s². Quem acha $g_0/2$ esqueceu o quadrado.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Qual a força gravitacional entre duas pessoas de 70 kg a 1 m de distância (em N)?</p>`, num: { v: 3.27e-7, tol: 0.02, un: "N" }, dicas: [R`<p>$F = \frac{Gm_1m_2}{d^2}$.</p>`], resp: "≈ 3,3 × 10⁻⁷ N", sol: R`<p>$6{,}674\times10^{-11}\cdot4900 \approx 3{,}3\times10^{-7}$ N, o peso de uns 0,03 mg. A gravidade é fraquíssima; só aparece com massas astronômicas.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>A Lua tem massa $7{,}35\times10^{22}$ kg e raio $1{,}737\times10^6$ m. Qual o $g$ lunar?</p>`, num: { v: 1.63, tol: 0.01, un: "m/s²" }, dicas: [R`<p>Mesma fórmula da Terra.</p>`], resp: "≈ 1,63 m/s²", sol: R`<p>$\approx 1{,}63$ m/s², uns 1/6 do da Terra.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Um planeta tem a mesma densidade da Terra e o dobro do raio. A gravidade na superfície dele é:</p>`, alts: ["a metade.", "a mesma.", "o dobro.", "o quádruplo.", "8 vezes maior."], certa: "C", dicas: [R`<p>$M = \rho\cdot\frac43\pi R^3$, então $g = \frac{GM}{R^2} \propto \rho R$.</p>`], resp: "C", sol: R`<p>Massa 8 vezes maior, raio ao quadrado 4 vezes maior: $g$ dobra. Quem marca "8 vezes" esqueceu o $R^2$ do denominador.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Por que os astronautas flutuam dentro da Estação Espacial, a 400 km de altura?</p>`, alts: ["Porque lá não há gravidade.", "Porque estão fora da atmosfera.", "Porque eles e a estação estão em queda livre juntos, em órbita.", "Porque a gravidade da Lua cancela a da Terra.", "Porque a força centrífuga é maior que a gravidade."], certa: "C", dicas: [R`<p>Calcule $g$ a 400 km.</p>`], resp: "C", sol: R`<p>Lá $g \approx 8{,}7$ m/s², quase 90% do daqui. Eles "caem" o tempo todo, junto com a estação (é a órbita): nada empurra um contra o outro, como no elevador em queda livre ${F.ret("A08")}.</p>` }),
      F.exercicio({ n: 7, nivel: "Máximo", enun: R`<p>Qual a velocidade de escape da superfície da Terra, em km/s? ($GM = 3{,}986\times10^{14}$ m³/s², $R = 6371$ km)</p>`, num: { v: 11.18, tol: 0.01, un: "km/s" }, dicas: [R`<p>Energia total zero: $\frac12v^2 = \frac{GM}R$.</p>`], resp: "≈ 11,2 km/s", sol: R`<p>$v = \sqrt{\frac{2GM}R} \approx 11{,}2$ km/s, $\sqrt2$ vezes a orbital rasante (7,9 km/s). Não depende da massa do objeto nem da direção do lançamento.</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>A Estação Espacial está a 400 km de altitude. Qual a velocidade dela, em km/s?</p>`, num: { v: 7.67, tol: 0.01, un: "km/s" }, dicas: [R`<p>$v = \sqrt{GM/r}$, com $r$ medido do centro.</p>`], resp: "≈ 7,67 km/s", sol: R`<p>$r = 6771$ km; $v \approx 7{,}67$ km/s (27 600 km/h); uma volta a cada 92 min.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Entre a Terra e a Lua (massa 81 vezes menor, distância $3{,}84\times10^8$ m entre os centros), a que distância do centro da Terra as duas atrações se cancelam (em m)?</p>`, num: { v: 3.456e8, tol: 0.01, un: "m" }, dicas: [R`<p>$\frac{M}{x^2} = \frac{m}{(d - x)^2} \Rightarrow \frac x{d - x} = \sqrt{M/m}$.</p>`], resp: "≈ 3,46 × 10⁸ m", sol: R`<p>$\sqrt{81} = 9$: $x = \frac{9}{10}d \approx 3{,}46\times10^8$ m, a 90% do caminho.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Que energia é preciso dar a um objeto de 1000 kg, parado na superfície, para levá-lo "ao infinito" (em J)? ($GM = 3{,}986\times10^{14}$, $R = 6{,}371\times10^6$ m)</p>`, num: { v: 6.257e10, tol: 0.01, un: "J" }, dicas: [R`<p>$\Delta E_p = 0 - \left(-\frac{GMm}R\right)$.</p>`], resp: "≈ 6,3 × 10¹⁰ J", sol: R`<p>$\frac{GMm}R \approx 6{,}26\times10^{10}$ J, a energia de uns 1800 litros de gasolina.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Na transferência de Hohmann da Terra para Marte ${F.ret("A15")}, quanto a sonda precisa acelerar na partida, em relação à velocidade orbital da Terra (km/s)? Use $GM_\text{Sol} = 1{,}327\times10^{20}$ m³/s², 1 UA $= 1{,}496\times10^{11}$ m, Marte a 1,524 UA.</p>`, num: { v: 2.946, tol: 0.02, un: "km/s" }, dicas: [R`<p>Vis-viva: $v^2 = GM\left(\frac2r - \frac1a\right)$, com $a = 1{,}262$ UA para a elipse.</p>`], resp: "≈ 2,95 km/s", sol: R`<p>Terra: $\sqrt{GM/r} \approx 29{,}78$ km/s. No periélio da transferência: $\sqrt{GM(2/r - 1/a)} \approx 32{,}73$ km/s. $\Delta v \approx 2{,}95$ km/s (fora o que é preciso para escapar da própria Terra).</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Até que raio a Terra teria de ser comprimida para virar um buraco negro (velocidade de escape = velocidade da luz, $c = 3\times10^8$ m/s)? Responda em milímetros.</p>`, num: { v: 8.85, tol: 0.02, un: "mm" }, dicas: [R`<p>$\sqrt{2GM/R} = c$.</p>`], resp: "≈ 8,9 mm", sol: R`<p>$R = \frac{2GM}{c^2} \approx 8{,}9$ mm, uma bolinha de gude. (O cálculo newtoniano dá, por coincidência, o mesmo raio de Schwarzschild da relatividade geral.)</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>Um satélite passa de uma órbita circular baixa para outra mais alta. Na órbita nova:</p>`, alts: ["a velocidade é maior e a energia total menor.", "a velocidade é menor e a energia total maior.", "a velocidade e a energia total são maiores.", "a velocidade e a energia total são menores.", "nada muda, só o raio."], certa: "B", dicas: [R`<p>Em órbita circular, $v = \sqrt{GM/r}$ e $E = -\frac{GMm}{2r}$.</p>`], resp: "B", sol: R`<p>$v$ cai com $\sqrt r$; $E = -\frac{GMm}{2r}$ fica menos negativa (aumenta): o motor deu energia, mas ela virou potencial, e a cinética até diminuiu. Paradoxo do satélite: o atrito com o ar faz um satélite <b>acelerar</b> (cai para órbitas mais baixas e rápidas).</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · gravitação</div>
        <div class="q">A Lua está caindo na Terra o tempo todo. Por que ela nunca chega?</div>
        <p>Porque ela também anda de lado, rápido o bastante para que, enquanto cai, a Terra se curve embaixo dela. A mesma força que derruba a maçã segura a Lua. Foi essa unificação, do céu e da Terra, que Newton fez.</p></div>`),

      F.secao("lei", "A lei da gravitação universal", R`
        ${F.formula(R`F = \frac{GMm}{r^2},\qquad G = 6{,}674\times10^{-11}\ \text{N·m}^2/\text{kg}^2,\qquad g = \frac{GM}{R^2}`, "Gravitação universal e gravidade na superfície")}
        <p>Atrativa, ao longo da linha que une os centros, ação e reação ${F.ret("A08")}: a Terra puxa você com a mesma força com que você puxa a Terra. Para esferas, $r$ é a distância entre os <b>centros</b>.</p>
        <h3>Teorema 1: a "maçã e a Lua" de Newton</h3>
        ${F.demo("demonstração", R`<p>(i) Se a gravidade cai com $1/r^2$, na distância da Lua (60 raios terrestres) ela vale $\frac{g}{60^2} = \frac{9{,}8}{3600} \approx 2{,}72\times10^{-3}$ m/s².</p>
          <p>(ii) A aceleração centrípeta da Lua, medida pela órbita: $\frac{4\pi^2r}{T^2}$ com $r = 3{,}84\times10^8$ m e $T = 27{,}3$ dias $= 2{,}36\times10^6$ s: $\approx 2{,}72\times10^{-3}$ m/s².</p>
          <p>(iii) Iguais: a força que segura a Lua é a mesma que derruba a maçã, enfraquecida com $1/r^2$. $\blacksquare$</p>`)}
        <div id="lab-canhao"></div>
        ${F.caixa("pegadinha", R`<p><b>"No espaço não há gravidade" é falso.</b> A 400 km, $g$ ainda é 89% do daqui. Astronautas flutuam porque estão em queda livre (em órbita). E $g$ cai com a distância ao centro, não à superfície: subir 10 km quase não muda nada.</p>`)}`),

      F.secao("energia", "Energia potencial gravitacional", R`
        <h3>Teorema 2: $E_p = -\frac{GMm}{r}$</h3>
        ${F.demo("demonstração", R`<p>(i) Escolhemos $E_p(\infty) = 0$. O trabalho da gravidade para levar $m$ de $r$ até o infinito é $W = \int_r^\infty -\frac{GMm}{s^2}\,ds = -\frac{GMm}{r}$ ${F.ret("F04")}.</p>
          <p>(ii) Como $W = -\Delta E_p = -(0 - E_p(r))$, vem $E_p(r) = -\frac{GMm}r$. Negativa: o corpo está "preso num poço". $\blacksquare$</p>
          <p>(iii) Perto da superfície, $E_p(R + h) - E_p(R) \approx \frac{GMm}{R^2}h = mgh$ (aproximação de primeira ordem ${F.ret("F05")}): o $mgh$ ${F.ret("A11")} é um caso particular.</p>`)}
        ${F.formula(R`E_p = -\frac{GMm}r,\qquad E = \tfrac12mv^2 - \frac{GMm}r = \text{constante}`, "Energia gravitacional e conservação")}`),

      F.secao("orbitas", "Órbitas e escape", R`
        <h3>Teorema 3: velocidade orbital, energia da órbita e escape</h3>
        ${F.demo("demonstração", R`<p>(i) Órbita circular: $\frac{GMm}{r^2} = \frac{mv^2}r \Rightarrow v_\text{orb} = \sqrt{\frac{GM}r}$, e então $E_c = \frac{GMm}{2r} = -\frac12E_p$.</p>
          <p>(ii) Energia total: $E = \frac{GMm}{2r} - \frac{GMm}r = -\frac{GMm}{2r} < 0$ (órbita presa). Para elipses vale o mesmo com $r \to a$, e daí sai a equação "vis-viva" $v^2 = GM\left(\frac2r - \frac1a\right)$.</p>
          <p>(iii) Escape: chegar ao infinito com $v \ge 0$ exige $E \ge 0$: $\frac12v^2 \ge \frac{GM}r$.</p>
          ${F.formula(R`v_\text{orb} = \sqrt{\frac{GM}r},\qquad E_\text{órbita} = -\frac{GMm}{2r},\qquad v_\text{esc} = \sqrt{\frac{2GM}r} = \sqrt2\,v_\text{orb}`, "Órbitas circulares e escape")}
          <p>(iv) Na superfície da Terra: $v_\text{orb} \approx 7{,}9$ km/s, $v_\text{esc} \approx 11{,}2$ km/s. Entre as duas, elipses (como no laboratório). $\blacksquare$</p>`)}
        ${F.caixa("fisico", R`<p><b>Por que os foguetes saem para o leste e perto do equador?</b> A rotação da Terra já dá ~0,46 km/s de graça no equador. Alcântara (MA), a 2° do equador, é uma das bases mais bem localizadas do mundo.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Teorema da casca</b> (Newton): uma casca esférica uniforme atrai um corpo de fora como se toda a massa estivesse no centro, e não atrai nada dentro dela. Dentro de uma esfera uniforme, $g = g_0\frac rR$ (cresce linearmente até a superfície). Sai fácil pela lei de Gauss da gravitação ${F.ret("TE02")}, igualzinha à da eletricidade ${F.ret("C03b")}.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, o campo gravitacional vira o potencial $\phi$ com $\nabla^2\phi = 4\pi G\rho$ (equação de Poisson ${F.ret("U01")}); o problema de dois corpos se reduz a um com a massa reduzida ${F.ret("A13")}; e Einstein reinterpreta a gravidade como curvatura do espaço-tempo, que prevê a precessão de Mercúrio, ondas gravitacionais e a correção que o GPS precisa aplicar (~38 μs por dia) ${F.ret("C18")}.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-canhao"); e.outerHTML = F.lab("O canhão de Newton", "lab-canhao"); SIM.canhao(document.getElementById("lab-canhao"), F); },
});
