/* C10 · Geradores e Receptores
   Base: Halliday vol. 3, cap. 27 (27-3 a 27-6), reescrito e ampliado. Contas conferidas em Python (c05b.py). */
F.registrar("C10", {
  retoma: ["C07", "C08"],
  html(F) {
    const R = String.raw;
    const gerador = (x, y, E, r) => `<rect x="${x - 50}" y="${y - 32}" width="100" height="64" rx="8" class="ln2" style="fill:none;stroke-dasharray:5 4"/>` + D.fio([[x - 50, y], [x - 40, y]]) + D.comp("bateria", x - 40, y, x - 4, y, { mais: 1, rot: E, sinais: false }) + D.comp("resistor", x - 4, y, x + 46, y, { rot: r, L: 30 }) + D.fio([[x + 46, y], [x + 50, y]]);
    const figGer = D.svg(420, 170, gerador(150, 60, "E", "r") + D.fio([[100, 60], [60, 60], [60, 140], [360, 140], [360, 60], [200, 60]]) + `<rect x="346" y="72" width="28" height="56" style="fill:var(--card)"/>` + D.comp("resistor", 360, 72, 360, 128, { rot: "R", lado: -1 }) + D.seta(250, 52, 300, 52, "var(--warn)") + D.txt(275, 44, "i", "txm"), "gerador real");
    const figMotor = D.svg(440, 170, gerador(130, 60, "E", "r") + D.fio([[80, 60], [50, 60], [50, 140], [390, 140], [390, 60], [180, 60]]) + `<circle cx="290" cy="60" r="20" style="fill:var(--card);stroke:var(--ink);stroke-width:2"/>${D.txt(290, 66, "M", "tx", "middle", 'style="font-weight:700"')}${D.txt(290, 100, "E′, r′", "tx2")}`, "gerador e motor");

    const exemplario = F.exemplo({ casos: [
      { nome: "Gerador com carga", gerar: (p) => {
        const E = p ? 12 : F.escolha([6, 9, 12, 24]), r = p ? 0.5 : F.escolha([0.2, 0.5, 1, 2]), Rr = p ? 5.5 : F.escolha([2, 3.5, 5.5, 10]), i = E / (Rr + r), U = E - r * i;
        return { enun: R`<p>Gerador de $E = ${E}$ V e $r = ${F.m(r, 1)}\ \Omega$ ligado a $R = ${F.m(Rr, 1)}\ \Omega$. Ache $i$, a tensão nos terminais, as potências e o rendimento.</p>`, fig: figGer,
          passos: [R`<p>Malha: $E = (R + r)i \Rightarrow i = \frac{${E}}{${F.m(Rr + r, 1)}} = ${F.m(i, 3)}$ A.</p>`, R`<p>Tensão nos terminais: $U = E - ri = ${F.m(U, 2)}$ V. A diferença $ri$ "fica" dentro do gerador.</p>`,
            R`<p>$P_\text{total} = Ei = ${F.m(E * i, 2)}$ W; $P_\text{útil} = Ui = ${F.m(U * i, 2)}$ W; dissipada dentro: $ri^2 = ${F.m(r * i * i, 2)}$ W.</p>`, R`<p>Rendimento $\eta = U/E = R/(R + r) = ${F.m((100 * U) / E, 1)}\%$.</p>`] }; } },
      { nome: "Gerador + motor", gerar: (p) => {
        const E = p ? 12 : F.escolha([12, 24, 36]), r = p ? 1 : F.escolha([0.5, 1, 2]), r2 = p ? 1 : F.escolha([0.5, 1, 2]), E2 = p ? 10 : Math.round(E * F.escolha([0.5, 0.6, 0.75, 0.8]));
        const Ev = Math.min(E2, E - 1), i = (E - Ev) / (r + r2);
        return { enun: R`<p>Um gerador ($E = ${E}$ V, $r = ${F.m(r, 1)}\ \Omega$) alimenta um motor de força contraeletromotriz $E' = ${Ev}$ V e resistência interna $r' = ${F.m(r2, 1)}\ \Omega$. Ache a corrente e a potência mecânica do motor.</p>`, fig: figMotor,
          passos: [R`<p>O motor é um <b>receptor</b>: a corrente entra pelo seu polo +, e ele "consome" $E'$ convertendo em trabalho mecânico. Malha: $E - E' = (r + r')i$.</p>`, R`$$i = \frac{${E} - ${Ev}}{${F.m(r + r2, 1)}} = ${F.m(i, 3)}\ \text{A}$$`,
            R`<p>Potência mecânica: $E'i = ${F.m(Ev * i, 2)}$ W; calor no motor: $r'i^2 = ${F.m(r2 * i * i, 2)}$ W. Se o motor travar ($E' = 0$), $i = E/(r + r') = ${F.m(E / (r + r2), 2)}$ A: é por isso que motor travado queima.</p>`] }; } },
    ] });

    const X = F.exercicio;
    const exsF = [
      X({ n: 1, enun: R`<p>Bateria de $12$ V e $0{,}50\ \Omega$ ligada a $5{,}5\ \Omega$. Corrente, tensão nos terminais, potência útil e rendimento.</p>`, fig: figGer, dicas: [R`<p>$i = E/(R+r)$.</p>`, R`<p>$\eta = U/E$.</p>`], resp: R`$2{,}0$ A; $11$ V; $22$ W; $\approx 92\%$.`, sol: R`<p>$i = 12/6 = 2$ A; $U = 12 - 1 = 11$ V; $P = 22$ W; $\eta = 11/12$.</p>` }),
      X({ n: 2, marcas: ["★"], enun: R`<p>A curva característica de um gerador corta o eixo $U$ em $9{,}0$ V e o eixo $i$ em $3{,}0$ A. Ache $E$ e $r$.</p>`, fig: D.svg(260, 180, `${D.eixos({ x0: 40, y0: 150, w: 200, h: 130, xlab: "i", ylab: "U" })}<line x1="40" y1="40" x2="200" y2="150" style="stroke:var(--mod);stroke-width:2.5"/>${D.txt(34, 44, "9 V", "tx2", "end")}${D.txt(200, 168, "3 A", "tx2")}`, "curva característica"), dicas: [R`<p>$U = E - ri$.</p>`, R`<p>Em $i = 0$, $U = E$; em $U = 0$, curto: $i_{cc} = E/r$.</p>`], resp: R`$E = 9$ V; $r = 3\ \Omega$.`, sol: R`<p>$r = E/i_{cc} = 3\ \Omega$, que é o módulo da inclinação.</p>` }),
      X({ n: 3, marcas: ["★"], enun: R`<p>Uma fonte de $12$ V e $2{,}0\ \Omega$. Para que resistência externa a potência entregue é máxima, e quanto vale?</p>`, fig: figGer, dicas: [R`<p>$P(R) = \frac{E^2R}{(R+r)^2}$; derive.</p>`, R`<p>Máximo em $R = r$.</p>`], resp: R`$R = 2\ \Omega$; $P = 18$ W.`, sol: R`<p>$P_\text{max} = E^2/(4r) = 144/8 = 18$ W, com rendimento de só 50%.</p>` }),
      X({ n: 4, enun: R`<p>Fonte de $12$ V e $1{,}0\ \Omega$ alimenta um motor com $E' = 10$ V e $r' = 1{,}0\ \Omega$. Corrente, potência mecânica e calor no motor? E se o motor travar?</p>`, fig: figMotor, dicas: [R`<p>$i = (E - E')/(r + r')$.</p>`, R`<p>Travado: $E' = 0$.</p>`], resp: R`$1{,}0$ A; $10$ W; $1{,}0$ W. Travado: $6{,}0$ A e $36$ W de calor no motor.`, sol: R`<p>$i = 2/2 = 1$ A; mecânica $E'i = 10$ W; calor $r'i^2 = 1$ W. Travado: $i = 12/2 = 6$ A; calor no motor $1\times36 = 36$ W, 36 vezes mais: queima.</p>` }),
      X({ n: 5, enun: R`<p>Três pilhas de $1{,}5$ V e $0{,}20\ \Omega$ em série alimentam $2{,}4\ \Omega$. Qual a corrente?</p>`, fig: "", dicas: [R`<p>Em série, as fems e as resistências internas somam.</p>`, R`<p>$4{,}5/(0{,}6 + 2{,}4)$.</p>`], resp: R`$1{,}5$ A.`, sol: R`<p>$i = 4{,}5/3{,}0 = 1{,}5$ A.</p>` }),
    ];
    const exsM = [
      X({ n: 6, marcas: ["!", "★"], enun: R`<p>Duas baterias em paralelo: $E_1 = 12$ V, $r_1 = 1{,}0\ \Omega$ e $E_2 = 10$ V, $r_2 = 2{,}0\ \Omega$, alimentando $R = 5{,}0\ \Omega$. Ache a corrente em cada uma.</p>`, fig: "", dicas: [R`<p>Chame de $V$ a tensão comum. Lei dos nós: $\frac{E_1 - V}{r_1} + \frac{E_2 - V}{r_2} = \frac VR$.</p>`, R`<p>(Teorema de Millman.) $V = \frac{E_1/r_1 + E_2/r_2}{1/r_1 + 1/r_2 + 1/R}$.</p>`], resp: R`$V = 10$ V; $i_1 = 2{,}0$ A, $i_2 = 0$, $i_R = 2{,}0$ A.`, sol: R`<p>$V = (12 + 5)/(1 + 0{,}5 + 0{,}2) = 10$ V. Coincidência bonita: a bateria 2 fica exatamente sem corrente. Se $R$ fosse maior, a bateria 1 passaria a <b>carregar</b> a 2 (corrente negativa nela).</p>` }),
      X({ n: 7, marcas: ["!"], enun: R`<p>Fonte de fem $E$ e resistência $r$. Para quais $R$ a potência útil é $3/4$ da máxima? Qual o rendimento em cada caso?</p>`, fig: "", dicas: [R`<p>$\frac{E^2R}{(R+r)^2} = \frac34\cdot\frac{E^2}{4r}$.</p>`, R`<p>Dá $3R^2 - 10rR + 3r^2 = 0$.</p>`], resp: R`$R = 3r$ ($\eta = 75\%$) ou $R = r/3$ ($\eta = 25\%$).`, sol: R`<p>Raízes $R = 3r$ e $R = r/3$ (produto $r^2$: simetria $R \leftrightarrow r^2/R$). Para a mesma potência, prefira o $R$ grande: rendimento muito maior. Por isso a rede elétrica <b>não</b> opera no máximo de potência.</p>` }),
      X({ n: 8, marcas: ["RU"], enun: R`<p>Um carregador ($14$ V, $0{,}10\ \Omega$) carrega uma bateria ($12$ V, $0{,}050\ \Omega$). Qual a corrente, a potência que vira energia química e o rendimento da carga?</p>`, fig: "", dicas: [R`<p>A bateria é receptor: $i = (14 - 12)/(0{,}10 + 0{,}05)$.</p>`, R`<p>Química: $E'i$. Total entregue pelo carregador: $Ei$.</p>`], resp: R`$\approx 13$ A; $160$ W; $\approx 86\%$.`, sol: R`<p>$i = 2/0{,}15 = 13{,}3$ A; química $12\times13{,}3 = 160$ W; calor $0{,}15\times13{,}3^2 \approx 26{,}7$ W; $\eta = 12/14 \approx 86\%$.</p>` }),
    ];

    const chefao = F.chefao({ titulo: "Vinte e quatro pilhas", fig: D.svg(420, 150, (() => { let s = ""; for (let rw = 0; rw < 2; rw++) for (let k = 0; k < 6; k++) s += D.comp("bateria", 60 + 50 * k, 40 + 60 * rw, 100 + 50 * k, 40 + 60 * rw, { mais: 1, sinais: false }); return s + D.txt(380, 75, "…", "tx") + D.txt(210, 140, "s em série × m em paralelo", "tx2"); })(), "pilhas"),
      enun: R`<p>Você tem $N = 24$ pilhas iguais ($E = 1{,}5$ V, $r = 0{,}50\ \Omega$) e quer a maior corrente possível num resistor de $R = 3{,}0\ \Omega$. Elas serão arrumadas em $m$ fileiras em paralelo, cada fileira com $s$ pilhas em série ($sm = 24$).</p>
        <ol type="a"><li>Mostre que o conjunto equivale a um gerador de fem $sE$ e resistência $sr/m$.</li><li>Escreva $i(s)$ e ache o ótimo tratando $s$ como contínuo.</li><li>Qual arranjo inteiro é o melhor, e qual a corrente?</li><li>Nessa situação, qual é a potência no resistor e o rendimento? Compare com o caso de todas em série.</li></ol>`,
      dicas: [R`<p>(a) Fileiras iguais em paralelo: a fem é a de uma fileira; as resistências ficam em paralelo.</p>`, R`<p>(b) $i = \frac{sE}{sr/m + R}$ com $m = N/s$: $i = \frac{sE}{s^2r/N + R}$. Derive em $s$. Vai sair a condição "resistência interna = resistência externa".</p>`],
      sol: R`<p><b>(a)</b> Cada fileira: fem $sE$, resistência $sr$. $m$ fileiras iguais em paralelo: fem $sE$, resistência $sr/m$.</p>
        <p><b>(b)</b> $i(s) = \frac{sEN}{s^2r + NR}$; $\frac{di}{ds} = 0 \Rightarrow s^2r = NR \Rightarrow \frac{sr}{m} = R$. Com os números: $s = \sqrt{NR/r} = \sqrt{144} = 12$.</p>
        <p><b>(c)</b> $s = 12$, $m = 2$ (é inteiro!): $i = \frac{18}{3 + 3} = 3{,}0$ A. Conferindo os vizinhos: $s = 8, m = 3$ dá $2{,}77$ A; $s = 24, m = 1$ dá $2{,}4$ A; $s = 6, m = 4$ dá $2{,}4$ A.</p>
        <p><b>(d)</b> $P = Ri^2 = 27$ W, rendimento 50% (casamento de impedâncias). Todas em série: $i = 36/15 = 2{,}4$ A, $P = 17{,}3$ W, rendimento 20%.</p>` });

    return [
      F.secao("abertura", "Pergunta de abertura", R`<div class="abertura"><div class="det">Antes de tudo</div><div class="q">Por que o farol do carro fica mais fraco quando você dá a partida?</div></div>`),
      F.secao("laboratorio", "Laboratório: potência máxima", R`<p>Mexa em R e em r. A bolinha mostra o ponto de operação nos dois gráficos.</p>
        ${F.chute({ q: "com r = 2 Ω, você aumenta R de 2 Ω para 8 Ω. A potência útil:", ops: ["aumenta", "diminui", "fica igual", "zera"], certa: 1, exp: R`<p><b>Diminui</b>: o máximo é em R = r. Mas o <b>rendimento</b> sobe de 50% para 80%. Potência máxima e rendimento máximo não acontecem juntos.</p>` })}
        <div id="lab-ger"></div>`),
      F.secao("ideia", "A ideia física", R`<p>Um <b>gerador</b> é uma "bomba de carga": por um processo não elétrico (químico, mecânico, luminoso) ele leva cargas do polo − ao + por dentro, dando a cada coulomb uma energia $E$, a <b>força eletromotriz</b> (fem). Mas a bomba tem atrito: a resistência interna $r$. Quanto mais corrente, mais tensão se perde lá dentro.</p>
        <ul><li>Pilha AA: 1,5 V, ~0,1–0,3 Ω (e sobe quando ela gasta).</li><li>Bateria de carro: 12 V, ~0,01 Ω: aguenta os ~200 A do motor de partida, mas cai uns 2 V nessa hora: o farol enfraquece.</li></ul>
        <p>Um <b>receptor</b> (motor, bateria carregando) faz o contrário: consome energia elétrica e a transforma em outra forma. Ele "segura" uma tensão $E'$, a força contraeletromotriz.</p>`),
      F.secao("teoria", "Teoria completa", R`
        <h3>1. Força eletromotriz</h3>
        ${F.formula(R`E = \frac{dW_\text{não elétrico}}{dq}\qquad [E] = \text{V}`, "fem")}
        <p>Não é uma força: é trabalho por unidade de carga, feito por uma força <b>não eletrostática</b> (química, magnética). O campo eletrostático sozinho não consegue manter corrente circulando, porque $\oint\vec E\cdot d\vec\ell = 0$ ${F.ret("C04")}.</p>
        <h3>2. Gerador real</h3>
        ${F.fig(figGer)}
        ${F.formula(R`U = E - ri,\qquad i = \frac{E}{R + r},\qquad i_{cc} = \frac{E}{r}`, "Equação do gerador")}
        <p>Curva característica: reta de inclinação $-r$. Em aberto ($i = 0$), $U = E$: é assim que um voltímetro ideal mede a fem. Em curto ($R = 0$), $U = 0$ e $i = E/r$.</p>
        <h3>3. Balanço de potência</h3>
        <p>Multiplicando por $i$: $Ei = Ui + ri^2$. A potência química (total) se divide em útil e dissipada dentro. Rendimento $\eta = U/E = R/(R + r)$.</p>
        ${F.demo("máxima transferência de potência", R`<p>(i) $P(R) = Ri^2 = \frac{E^2R}{(R+r)^2}$.</p><p>(ii) $\frac{dP}{dR} = E^2\frac{(R+r)^2 - 2R(R+r)}{(R+r)^4} = E^2\frac{r - R}{(R+r)^3} = 0 \Rightarrow R = r$.</p>${F.formula(R`P_\text{max} = \frac{E^2}{4r},\qquad \eta = 50\%`)}`)}
        ${F.caixa("pegadinha", R`<p>Potência máxima não é rendimento máximo. A rede elétrica opera com $R \gg r$ (rendimento alto). O "casamento" $R = r$ é usado em antenas e áudio, onde importa extrair o máximo de um sinal fraco.</p>`)}
        <h3>4. Receptores</h3>
        ${F.fig(figMotor)}
        ${F.formula(R`U = E' + r'i,\qquad i = \frac{E - E'}{R + r + r'}`, "Receptor")}
        <p>Num motor, $E'$ cresce com a rotação (indução ${F.ret("C15")}). Parado ou travado, $E' = 0$ e a corrente dispara: por isso motores puxam muita corrente na partida.</p>
        <h3>5. Associação de geradores</h3>
        <p><b>Série</b> (+ com −): fems e resistências somam. <b>Paralelo</b> de geradores <b>iguais</b>: fem igual, $r/n$. Geradores diferentes em paralelo: use a lei dos nós (teorema de Millman, exercício 6), e cuidado: o mais forte pode carregar o mais fraco.</p>
        ${F.caixa("olimpiada", R`<p><b>Teorema de Thévenin:</b> qualquer circuito linear, visto de dois terminais, equivale a um gerador $E_{th}$ com resistência $R_{th}$: $E_{th}$ é a tensão em aberto, $R_{th}$ é a resistência vista com as fontes "zeradas" (fontes de tensão viram curto) ${F.ret("C10b")}.</p>`)}`),
      F.secao("exemplos", "Exemplos passo a passo", exemplario),
      F.secao("resumo", "Resumo", R`<div class="resumo"><div class="r"><b>Gerador</b>$U = E - ri$; $i_{cc} = E/r$</div><div class="r"><b>Potência</b>$Ei = Ui + ri^2$; $\eta = U/E$</div><div class="r"><b>Máximo</b>$R = r$: $E^2/4r$, η = 50%</div><div class="r"><b>Receptor</b>$U = E' + r'i$</div><div class="r"><b>Malha simples</b>$i = (E - E')/\sum R$</div></div>`),
      F.secao("exercicios", "Exercícios", `<div class="exs-nivel"><h3>Nível Físico</h3><span class="selo">fixação</span></div>${exsF.join("")}<div class="exs-nivel"><h3>Nível Máximo</h3><span class="selo">OBF · ITA · RU</span></div>${exsM.join("")}`),
      F.secao("chefao", "Chefão", chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-ger"); e.outerHTML = F.lab("Gerador real: potência útil e rendimento", "lab-ger"); SIM.gerador(document.getElementById("lab-ger"), F); },
});
