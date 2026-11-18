/* A11 · Trabalho e Energia. Conferido em Python (g = 10 m/s²):
   W = 20·5·cos 60° = 50 J; Ec (2 kg, 3 m/s) = 9 J; Ep (2 kg, 5 m) = 100 J; cai de 20 m: 20 m/s; mola k = 200, x = 0,1: 1 J;
   1000 kg de 0 a 20 m/s: 200 kJ; 600 kg subindo 10 m em 20 s: 3 kW; rampa de 5 m: 10 m/s; mola k = 400, x = 0,1 m, 0,5 kg: 2,83 m/s;
   2 kg a 10 m/s com μ = 0,25: para em 20 m; looping R = 0,4 m: largar de 1,0 m; carro 80 kW contra 2000 N: 40 m/s;
   motor de 2000 W eleva 100 kg a 3 m em 2 s: 1500 W úteis, 75%; pêndulo L = 1 m solto a 60°: 3,16 m/s embaixo;
   chefão: bloco no topo do hemisfério (R = 1,2 m) descola em cos θ = 2/3 (48,2°, a 0,8 m do chão, v = 2,83 m/s), cai a 1,35 m do centro;
   integração numérica confere cos θ = 0,6667; com empurrão v₀: cos θ = 2/3 + v₀²/(3gR). */
F.registrar("A11", {
  retoma: ["A08", "A03", "F04"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const bloco = (x, y, w, h, cor, rot) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" style="fill:color-mix(in srgb,${cor} 30%,transparent);stroke:${cor};stroke-width:2"/>` + (rot ? D.txt(x + w / 2, y + h / 2 + 5, rot, "tx2") : "");
    const rampa = (h, extra = "") => fig(`<path d="M60 ${150 - h * 20} Q120 150 220 150 L500 150" style="fill:none;stroke:var(--ink2);stroke-width:3"/>` + `<circle cx="66" cy="${140 - h * 20}" r="8" style="fill:var(--mA)"/>` + D.seta(40, 150, 40, 150 - h * 20, "var(--ink3)", 1.2) + D.txt(34, 150 - h * 10, `${F.nt(h)} m`, "tx2", "end") + extra);
    const exemplos = F.exemplo({
      titulo: "Energia",
      casos: [
        { nome: "Fácil: teorema da energia cinética", gerar: (p) => {
          const m = p ? 1000 : F.escolha([800, 1000, 1500]), v = p ? 20 : F.escolha([10, 20, 30]), d = p ? 50 : F.escolha([40, 50, 100]), W = 0.5 * m * v * v;
          return { enun: R`<p>Um carro de ${m} kg parte do repouso e chega a ${v} m/s em ${d} m. Qual o trabalho da força resultante? Qual o valor médio dessa força?</p>`,
            fig: fig(D.estrada(40, 520, 120, 480 / d, d / 5, "m") + D.carro(60, 114, "var(--mA)") + D.carro(500, 114, "var(--mA)") + D.txt(500, 76, `${v} m/s`, "tx2"), 150),
            passos: [R`<p>(i) Teorema da energia cinética: $W_\text{res} = \Delta E_c = \frac12\cdot${m}\cdot${v}^2 - 0 = ${F.n(W)}$ J.</p>`, R`<p>(ii) $W = F_\text{média}\cdot d \Rightarrow F = \frac{${F.n(W)}}{${d}} = ${F.n(W / d)}$ N.</p>`, R`<p>(iii) Não precisamos saber se a força foi constante, nem o tempo: o trabalho só depende das velocidades inicial e final. Confira com o MUV ${F.ret("A03")}: $a = \frac{v^2}{2d} = ${F.n((v * v) / (2 * d), 3)}$ m/s², $F = ma$, o mesmo.</p>`] };
        } },
        { nome: "Médio: o pêndulo", gerar: (p) => {
          const L = p ? 1 : F.escolha([0.5, 1, 2]), th = p ? 60 : F.escolha([30, 60, 90]), hh = L * (1 - Math.cos((th * Math.PI) / 180)), v = Math.sqrt(20 * hh), T = 1 * 10 + (1 * v * v) / L;
          return { enun: R`<p>Um pêndulo de 1 kg e fio de ${F.nt(L)} m é solto do repouso com o fio a ${th}° da vertical. Qual a velocidade no ponto mais baixo e a tração no fio nesse ponto?</p>`,
            fig: fig(`<line x1="280" y1="10" x2="280" y2="${10 + 130}" style="stroke:var(--ink3);stroke-dasharray:4 4"/><line x1="280" y1="10" x2="${280 + 130 * Math.sin((th * Math.PI) / 180)}" y2="${10 + 130 * Math.cos((th * Math.PI) / 180)}" style="stroke:var(--ink)"/><circle cx="${280 + 130 * Math.sin((th * Math.PI) / 180)}" cy="${10 + 130 * Math.cos((th * Math.PI) / 180)}" r="8" style="fill:var(--mA)"/>` + D.txt(292, 50, `${th}°`, "tx2", "start"), 160),
            passos: [R`<p>(i) A tração é sempre perpendicular ao movimento: não trabalha. Só o peso trabalha, então a energia mecânica se conserva.</p>`, R`<p>(ii) Altura que desce: $h = L(1 - \cos${th}°) = ${F.n(hh, 4)}$ m. $mgh = \frac12mv^2 \Rightarrow v = \sqrt{2gh} = ${F.n(v, 4)}$ m/s.</p>`, R`<p>(iii) Embaixo, dinâmica circular ${F.ret("A10")}: $T - mg = \frac{mv^2}L \Rightarrow T = ${F.n(T, 4)}$ N. ${th === 90 ? "Solto da horizontal, a tração embaixo é sempre 3mg." : ""}</p>`] };
        } },
        { nome: "Olimpíada: altura mínima para o looping", gerar: (p) => {
          const Rr = p ? 0.4 : F.escolha([0.3, 0.4, 0.5, 1]), h = 2.5 * Rr;
          return { enun: R`<p>Um carrinho desce uma rampa sem atrito e entra num looping de raio ${F.nt(Rr)} m. De que altura mínima (em relação ao ponto mais baixo do looping) ele precisa sair do repouso para completar a volta?</p>`,
            fig: fig(`<path d="M60 20 Q120 150 280 150" style="fill:none;stroke:var(--ink2);stroke-width:3"/><circle cx="330" cy="100" r="50" style="fill:none;stroke:var(--ink2);stroke-width:3"/><circle cx="66" cy="22" r="7" style="fill:var(--mA)"/>` + D.txt(30, 90, "h", "txm"), 165),
            passos: [R`<p>(i) No topo do looping, a velocidade mínima é $\sqrt{gR}$ ${F.ret("A10")}.</p>`, R`<p>(ii) Conservação da energia entre a largada (altura $h$, repouso) e o topo (altura $2R$): $mgh = mg\cdot2R + \frac12m\cdot gR$.</p>`, R`<p>(iii) $h = 2R + \frac R2 = \frac52R = ${F.n(h, 3)}$ m. Não basta largar da altura do topo (2R): ele precisa chegar lá ainda com velocidade.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O bloco que escorrega do iglu",
      enun: R`<p>Um bloquinho está no topo de um hemisfério liso (sem atrito) de raio $R$, apoiado no chão. Ele recebe um toque mínimo e começa a escorregar. (a) Usando energia, escreva $v^2$ quando o raio até o bloco faz um ângulo $\theta$ com a vertical. (b) Usando dinâmica circular, escreva a normal $N(\theta)$. (c) Mostre que o bloco descola do hemisfério quando $\cos\theta = \frac23$, a uma altura $\frac{2R}3$ do chão. (d) Para $R = 1{,}2$ m, com que velocidade ele descola, e a que distância do centro do hemisfério cai no chão? (e) Se ele partir do topo com velocidade $v_0$, mostre que descola em $\cos\theta = \frac23 + \frac{v_0^2}{3gR}$. A partir de que $v_0$ ele nem toca a superfície?</p>`,
      fig: fig(`<line x1="100" x2="460" y1="150" y2="150" style="stroke:var(--ink2);stroke-width:2"/><path d="M180 150 A100 100 0 0 1 380 150" style="fill:color-mix(in srgb,var(--mC) 12%,transparent);stroke:var(--ink2);stroke-width:2.5"/><line x1="280" y1="150" x2="355" y2="84" style="stroke:var(--ink3);stroke-dasharray:4 4"/><line x1="280" y1="150" x2="280" y2="50" style="stroke:var(--ink3);stroke-dasharray:4 4"/>` + `<rect x="350" y="70" width="16" height="12" transform="rotate(41 358 76)" style="fill:var(--mA)"/>` + D.txt(292, 118, "θ", "txm"), 165),
      dicas: [R`<p>(a) Altura do bloco: $R\cos\theta$; desceu $R(1 - \cos\theta)$.</p>`, R`<p>(b) Na direção radial (para o centro): $mg\cos\theta - N = \frac{mv^2}R$. Descola quando $N = 0$.</p>`],
      sol: R`<p><b>(a)</b> Energia (só o peso trabalha): $\frac12mv^2 = mgR(1 - \cos\theta) \Rightarrow v^2 = 2gR(1 - \cos\theta)$.</p>
        <p><b>(b)</b> Radial: $mg\cos\theta - N = \frac{mv^2}R = 2mg(1 - \cos\theta) \Rightarrow N = mg(3\cos\theta - 2)$.</p>
        <p><b>(c)</b> $N = 0$ quando $\cos\theta = \frac23$ ($\theta \approx 48{,}2°$), à altura $R\cos\theta = \frac{2R}3$. Depois disso, $N$ teria que ser negativa (o hemisfério "puxar"), o que é impossível: o bloco vira um projétil. (Conferi integrando a equação do movimento numericamente.)</p>
        <p><b>(d)</b> $v^2 = gR\cos\theta = \frac{2gR}3 = 8$, $v \approx 2{,}83$ m/s, inclinada $48{,}2°$ abaixo da horizontal, a $(R\sin\theta,\ R\cos\theta) = (0{,}894;\ 0{,}8)$ m. Como projétil ${F.ret("A06")}: $v_x \approx 1{,}886$ m/s, $v_y \approx -2{,}108$ m/s; chega ao chão em $t \approx 0{,}241$ s, a $0{,}894 + 1{,}886\cdot0{,}241 \approx 1{,}35$ m do centro (só 15 cm além da borda).</p>
        <p><b>(e)</b> Com $v_0$: $v^2 = v_0^2 + 2gR(1 - \cos\theta)$ e $N = 0$ dá $gR\cos\theta = v_0^2 + 2gR - 2gR\cos\theta$, ou $\cos\theta = \frac23 + \frac{v_0^2}{3gR}$. Se $v_0^2 \ge gR$, já no topo $\cos\theta = 1$: o bloco sai voando direto, sem encostar (é o $\sqrt{gR}$ do topo do looping, de cabeça para baixo).</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Uma força de 20 N, fazendo 60° com o deslocamento, empurra um carrinho por 5 m. Qual o trabalho dela?</p>`, fig: fig(`<line x1="60" x2="500" y1="130" y2="130" style="stroke:var(--ink2);stroke-width:2"/>` + bloco(220, 90, 60, 40, "var(--mA)") + D.seta(150, 40, 220, 100, "var(--warn)") + D.txt(150, 34, "20 N", "tx2") + D.seta(300, 145, 420, 145, "var(--ink3)", 1.4) + D.txt(360, 160, "5 m", "tx2"), 170), num: { v: 50, un: "J" }, dicas: [R`<p>$W = Fd\cos\theta$: só a componente ao longo do deslocamento trabalha ${F.ret("F02")}.</p>`], resp: "50 J", sol: R`<p>$20\cdot5\cdot\frac12 = 50$ J.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Qual a energia cinética de uma bola de 2 kg a 3 m/s?</p>`, num: { v: 9, un: "J" }, dicas: [R`<p>$E_c = \frac12mv^2$.</p>`], resp: "9 J", sol: R`<p>$\frac12\cdot2\cdot9 = 9$ J.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Uma pedra de 2 kg cai de 20 m de altura (sem ar). Com que velocidade chega ao chão?</p>`, num: { v: 20, un: "m/s" }, dicas: [R`<p>$mgh = \frac12mv^2$.</p>`], resp: "20 m/s", sol: R`<p>$v = \sqrt{2gh} = 20$ m/s, igual ao resultado de Torricelli ${F.ret("A03")}, sem precisar do tempo.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Uma mola de constante 200 N/m é comprimida 10 cm. Quanta energia ela armazena?</p>`, num: { v: 1, un: "J" }, dicas: [R`<p>$E = \frac12kx^2$ (x em metros).</p>`], resp: "1 J", sol: R`<p>$\frac12\cdot200\cdot0{,}01 = 1$ J.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Um elevador de 600 kg sobe 10 m em 20 s, com velocidade constante. Qual a potência do motor?</p>`, num: { v: 3000, un: "W" }, dicas: [R`<p>Velocidade constante: o motor faz força igual ao peso. $P = \frac Wt$.</p>`], resp: "3000 W", sol: R`<p>$\frac{6000\cdot10}{20} = 3000$ W (3 kW). Ou $P = Fv = 6000\cdot0{,}5$.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Um bloco desce, do repouso, uma rampa sem atrito de 5 m de altura. Qual a velocidade embaixo?</p>`, fig: rampa(5), num: { v: 10, un: "m/s" }, dicas: [R`<p>O formato da rampa não importa.</p>`], resp: "10 m/s", sol: R`<p>$\sqrt{2\cdot10\cdot5} = 10$ m/s, por qualquer caminho sem atrito.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Uma mola ($k = 400$ N/m), comprimida 10 cm, lança um bloco de 0,5 kg numa mesa sem atrito. Com que velocidade o bloco sai?</p>`, num: { v: Math.sqrt(8), tol: 0.01, un: "m/s" }, dicas: [R`<p>$\frac12kx^2 = \frac12mv^2$.</p>`], resp: "√8 ≈ 2,83 m/s", sol: R`<p>$v = x\sqrt{k/m} = 0{,}1\sqrt{800} \approx 2{,}83$ m/s.</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>Um bloco de 2 kg desliza a 10 m/s numa mesa com $\mu_c = 0{,}25$. Que distância percorre até parar? Use energia.</p>`, num: { v: 20, un: "m" }, dicas: [R`<p>O trabalho do atrito tira toda a energia cinética: $\mu mgd = \frac12mv^2$.</p>`], resp: "20 m", sol: R`<p>$d = \frac{v^2}{2\mu g} = \frac{100}{5} = 20$ m. A energia virou calor (100 J).</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>De que altura mínima um carrinho deve partir (sem atrito) para completar um looping de raio 0,4 m?</p>`, num: { v: 1, un: "m" }, dicas: [R`<p>No topo do looping, $v^2 \ge gR$.</p>`], resp: "1,0 m", sol: R`<p>$h = \frac52R = 1{,}0$ m.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Um carro com motor de 80 kW de potência máxima enfrenta uma resistência total (ar + rolamento) de 2000 N na velocidade máxima. Qual é essa velocidade?</p>`, num: { v: 40, un: "m/s" }, dicas: [R`<p>Na velocidade máxima, a força do motor iguala a resistência e $P = Fv$.</p>`], resp: "40 m/s", sol: R`<p>$v = \frac{80\,000}{2000} = 40$ m/s (144 km/h). (Na prática a resistência do ar cresce com $v^2$ ${F.ret("A09")}, e a conta vira $P = kv^3$.)</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Um motor consome 2000 W e ergue 100 kg a 3 m de altura em 2 s, com velocidade constante. Qual o rendimento?</p>`, alts: ["50%", "60%", "75%", "80%", "100%"], certa: "C", dicas: [R`<p>Potência útil: $\frac{mgh}{t}$.</p>`], resp: "C", sol: R`<p>$P_\text{útil} = \frac{3000}{2} = 1500$ W; $\eta = \frac{1500}{2000} = 75\%$. O resto vira calor no motor e nos atritos.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Uma bola é lançada de uma janela a 10 m de altura, com 10 m/s, em direções diferentes (para cima, na horizontal, para baixo). Sem ar, o que se pode dizer das velocidades ao chegar ao chão?</p>`, alts: ["A lançada para baixo chega mais rápido.", "A lançada para cima chega mais rápido.", "A horizontal chega mais rápido.", "Chegam todas com o mesmo módulo de velocidade.", "Depende da massa."], certa: "D", dicas: [R`<p>Energia mecânica: a direção da velocidade inicial não entra em $\frac12mv^2$.</p>`], resp: "D", sol: R`<p>$\frac12mv^2 = \frac12m\cdot10^2 + mg\cdot10 \Rightarrow v = \sqrt{300} \approx 17{,}3$ m/s para todas. Os tempos e as direções são diferentes, o módulo não.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · energia</div>
        <div class="q">Um skatista desce uma rampa curva cheia de ondulações. Dá para saber a velocidade dele lá embaixo sem resolver as forças em cada ponto?</div>
        <p>Dá, se não houver atrito: só importa a altura que ele desceu. A energia é a grandeza que transforma problemas difíceis de forças em contas de "antes e depois", porque ela se conserva.</p></div>`),

      F.secao("trabalho", "Trabalho e energia cinética", R`
        ${F.formula(R`W = \vec F\cdot\vec d = Fd\cos\theta\qquad\qquad W = \int\vec F\cdot d\vec r`, "Trabalho de uma força")}
        <p>Só a componente da força ao longo do deslocamento trabalha. Força perpendicular (normal num piso, tração no pêndulo, centrípeta no MCU) não trabalha. Com força variável, o trabalho é a área sob o gráfico $F\times x$ ${F.ret("F04")}.</p>
        <h3>Teorema 1: teorema da energia cinética (trabalho–energia)</h3>
        ${F.demo("demonstração", R`<p>(i) Ao longo do movimento (1D, para simplificar), a 2ª lei dá $F_R = ma = m\frac{dv}{dt} = m\frac{dv}{dx}\frac{dx}{dt} = mv\frac{dv}{dx}$ (regra da cadeia).</p>
          <p>(ii) Integrando em $x$: $W_R = \int F_R\,dx = \int mv\,dv = \frac12mv_2^2 - \frac12mv_1^2$.</p>
          ${F.formula(R`W_\text{resultante} = \Delta E_c,\qquad E_c = \tfrac12mv^2`, "Teorema da energia cinética")}
          <p>(iii) Com $F_R$ constante, é exatamente Torricelli multiplicado por $\frac m2$ ${F.ret("A03")}. $\blacksquare$</p>`)}
        <div id="lab-pista"></div>`),

      F.secao("conservacao", "Energia potencial e conservação", R`
        <h3>Teorema 2: o trabalho do peso só depende da altura</h3>
        ${F.demo("demonstração", R`<p>(i) Por um caminho qualquer, divida em pedacinhos $d\vec r = (dx, dy)$. O peso é $(0, -mg)$: $dW = -mg\,dy$.</p>
          <p>(ii) Somando, $W_P = -mg(y_2 - y_1)$: só depende das alturas inicial e final, não do caminho. Forças assim se chamam <b>conservativas</b>, e para elas definimos uma energia potencial com $W = -\Delta E_p$. $\blacksquare$</p>`)}
        ${F.formula(R`E_p^\text{grav} = mgh,\qquad E_p^\text{elást} = \tfrac12kx^2`, "Energias potenciais")}
        <p>A elástica sai da área do triângulo sob $F = kx$ ${F.ret("F04")}.</p>
        <h3>Teorema 3: conservação da energia mecânica</h3>
        ${F.demo("demonstração", R`<p>(i) Separe o trabalho total em forças conservativas (peso, mola) e não conservativas (atrito, motor): $\Delta E_c = W_\text{cons} + W_\text{nc} = -\Delta E_p + W_\text{nc}$.</p>
          <p>(ii) Então $\Delta(E_c + E_p) = W_\text{nc}$. Se só forças conservativas trabalham (ou as outras não trabalham), $E_c + E_p$ é constante.</p>
          ${F.formula(R`E_\text{mec} = E_c + E_p = \text{constante}\quad(\text{sem atrito});\qquad \Delta E_\text{mec} = W_\text{atrito} < 0`, "Conservação da energia mecânica")}
          <p>(iii) Com atrito, a energia mecânica diminui; a "perdida" vira calor (energia interna), e a energia total continua conservada. $\blacksquare$</p>`)}
        ${F.caixa("pegadinha", R`<p><b>A normal não trabalha, mas a direção importa nas forças.</b> Energia dá a <b>velocidade</b> (o módulo) num ponto; para a força nesse ponto (normal, tração), ainda é preciso a dinâmica circular ${F.ret("A10")}. Os problemas de looping e pêndulo usam as duas coisas juntas.</p>`)}`),

      F.secao("potencia", "Potência e rendimento", R`
        ${F.formula(R`P = \frac{W}{\Delta t} = \vec F\cdot\vec v,\qquad \eta = \frac{P_\text{útil}}{P_\text{total}}`, "Potência (W = J/s) e rendimento")}
        ${F.caixa("fisico", R`<p><b>Quilowatt-hora</b>: a conta de luz cobra energia, não potência. 1 kWh $= 1000$ W durante 3600 s $= 3{,}6\times10^6$ J. Um chuveiro de 5,5 kW ligado 10 minutos gasta $\approx 0{,}92$ kWh; subir uma escada de 3 m (70 kg) gasta só 2100 J $\approx 0{,}0006$ kWh.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Energia + dinâmica circular</b> é o par mais cobrado: a energia dá $v^2$ em função da posição; a 2ª lei na direção radial dá a força de contato; "descolar" ou "fio frouxo" é força de contato = 0. É o roteiro do looping, do pêndulo e do chefão.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, força conservativa é a que tem rotacional nulo, $\vec F = -\nabla E_p$ ${F.ret("U01")}; e a conservação da energia vem de uma simetria (as leis não mudam com o tempo), pelo teorema de Noether ${F.ret("matematica/TE05")}.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-pista"); e.outerHTML = F.lab("Pista de skate: energia", "lab-pista"); SIM.pista(document.getElementById("lab-pista"), F); },
});
