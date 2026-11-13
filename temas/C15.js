/* C15 · Indução Eletromagnética (Faraday, Lenz)
   Base: Halliday vol. 3, cap. 30 (30-1 a 30-6), reescrito. Contas conferidas em Python (c06.py); chefão simulado com solve_ivp. */
F.registrar("C15", {
  retoma: ["C14", "C13"],
  html(F) {
    const R = String.raw;
    const xs = (w, h, x0 = 0) => { let s = ""; for (let x = x0 + 20; x < w; x += 40) for (let y = 20; y < h; y += 40) s += `<circle cx="${x}" cy="${y}" r="5" style="fill:none;stroke:var(--ink3)"/><path d="M${x - 3} ${y - 3} l6 6 M${x + 3} ${y - 3} l-6 6" style="stroke:var(--ink3)"/>`; return s; };
    const figBarra = D.svg(460, 200, xs(460, 200) + `<line x1="40" y1="30" x2="440" y2="30" class="ln"/><line x1="40" y1="170" x2="440" y2="170" class="ln"/>` + D.comp("resistor", 40, 30, 40, 170, { rot: "R", lado: -1 }) + `<rect x="275" y="24" width="10" height="152" style="fill:#c98a4a"/>${D.seta(290, 100, 350, 100, "var(--ink)", 2.2)}${D.txt(354, 96, "v", "txm", "start")}<path class="ln2" d="M300 30 h12 V170 h-12"/>${D.txt(318, 140, "L", "txm", "start")}`, "barra nos trilhos");
    const figGer = D.svg(380, 220, `${[40, 90, 140, 190].map((y) => D.seta(20, y, 360, y, "var(--ink3)", 1.2)).join("")}<ellipse cx="190" cy="115" rx="40" ry="80" style="fill:color-mix(in srgb,var(--mod) 10%,transparent);stroke:#c98a4a;stroke-width:4"/><path d="M190 18 v-10 M190 212 v6" class="ln"/><path d="M150 40 a50 14 0 0 1 80 0" class="ln2"/>${D.seta(226, 36, 232, 44, "var(--ink2)", 1.4)}${D.txt(240, 30, "ω", "txm", "start")}${D.txt(350, 20, "B", "txm", "end")}`, "gerador");

    const exemplario = F.exemplo({ casos: [
      { nome: "Bobina num campo variável", gerar: (p) => {
        const N = p ? 200 : F.escolha([50, 100, 200, 500]), A = p ? 20 : F.escolha([5, 10, 20, 50]), B1 = p ? 0.1 : F.escolha([0, 0.1, 0.2]), B2 = p ? 0.5 : F.escolha([0.4, 0.5, 0.8, 1.0]), dt = p ? 0.2 : F.escolha([0.05, 0.1, 0.2, 0.5]);
        const fem = (N * (B2 - B1) * A * 1e-4) / dt;
        return { enun: R`<p>Uma bobina de $${N}$ espiras e área $${A}$ cm², perpendicular a um campo que sobe de $${B1}$ T para $${B2}$ T em $${dt}$ s. Fem média?</p>`, fig: "",
          passos: [R`<p>Fluxo por espira: $\Phi = BA$ (campo perpendicular). Variação: $\Delta\Phi = (${B2} - ${B1})\times${F.sigM(A * 1e-4, 2)} = ${F.sigM((B2 - B1) * A * 1e-4, 3)}$ Wb.</p>`, R`$$|\varepsilon| = N\frac{\Delta\Phi}{\Delta t} = ${F.m(fem, 3)}\ \text{V}$$`, R`<p>Sentido (Lenz): a corrente induzida cria um campo <b>oposto</b> ao aumento, isto é, contra o campo externo dentro da bobina.</p>`] }; } },
      { nome: "Barra nos trilhos", gerar: (p) => {
        const L = p ? 0.5 : F.escolha([0.2, 0.4, 0.5, 1]), v = p ? 4 : F.escolha([1, 2, 4, 5]), B = p ? 0.3 : F.escolha([0.1, 0.3, 0.5]), Rr = p ? 2 : F.escolha([0.5, 1, 2, 5]);
        const e = B * L * v, i = e / Rr;
        return { enun: R`<p>Uma barra de $${L}$ m desliza a $${v}$ m/s sobre trilhos ligados por $R = ${Rr}\ \Omega$, num campo de $${B}$ T perpendicular. Fem, corrente, força para manter a velocidade e potência.</p>`, fig: figBarra,
          passos: [R`<p>Fem de movimento: $\varepsilon = BLv = ${F.m(e, 3)}$ V (ou: a área do circuito cresce $Lv$ por segundo, $d\Phi/dt = BLv$).</p>`, R`<p>$i = \varepsilon/R = ${F.m(i, 3)}$ A. Força magnética na barra: $iLB = ${F.m(i * L * B, 4)}$ N, <b>contra</b> o movimento (Lenz).</p>`,
            R`<p>Para manter $v$, sua mão faz $F = ${F.m(i * L * B, 4)}$ N; potência $Fv = ${F.m(i * L * B * v, 4)}$ W $= Ri^2 = ${F.m(Rr * i * i, 4)}$ W ✓. Energia mecânica vira elétrica, que vira calor.</p>`] }; } },
    ] });

    const X = F.exercicio;
    const exsF = [
      X({ n: 1, enun: R`<p>Uma espira de $50$ cm² está num campo de $0{,}20$ T que faz $60°$ com a <b>normal</b> à espira. Qual o fluxo?</p>`, fig: "", dicas: [R`<p>$\Phi = BA\cos\theta$, com $\theta$ entre $\vec B$ e a normal.</p>`, R`<p>$\cos60° = 0{,}5$.</p>`], resp: R`$5{,}0\times10^{-4}$ Wb.`, sol: R`<p>$0{,}2\times5\times10^{-3}\times0{,}5$.</p>` }),
      X({ n: 2, marcas: ["★"], enun: R`<p>Bobina de 200 espiras e $20$ cm²; o campo perpendicular vai de $0{,}10$ T a $0{,}50$ T em $0{,}20$ s. Fem média?</p>`, fig: "", dicas: [R`<p>$\varepsilon = N\Delta\Phi/\Delta t$.</p>`, R`<p>$200\times0{,}4\times2\times10^{-3}/0{,}2$.</p>`], resp: R`$0{,}80$ V.`, sol: R`<p>$|\varepsilon| = 0{,}80$ V.</p>` }),
      X({ n: 3, marcas: ["★"], enun: R`<p>Barra de $0{,}50$ m a $4{,}0$ m/s em $0{,}30$ T, com $R = 2{,}0\ \Omega$. Fem, corrente, força necessária e potência.</p>`, fig: figBarra, dicas: [R`<p>$\varepsilon = BLv$.</p>`, R`<p>$F = iLB$; $P = Fv$.</p>`], resp: R`$0{,}60$ V; $0{,}30$ A; $0{,}045$ N; $0{,}18$ W.`, sol: R`<p>$F = 0{,}3\times0{,}5\times0{,}3 = 0{,}045$ N; $P = 0{,}18$ W $= Ri^2$ ✓.</p>` }),
      X({ n: 4, enun: R`<p>Gerador: 100 espiras de $0{,}010$ m² girando a $60$ Hz em $0{,}50$ T. Fem máxima?</p>`, fig: figGer, dicas: [R`<p>$\Phi = NBA\cos\omega t$; $\varepsilon = NBA\omega\sin\omega t$.</p>`, R`<p>$\omega = 2\pi\times60$.</p>`], resp: R`$\approx 1{,}9\times10^2$ V.`, sol: R`<p>$\varepsilon_\text{max} = 100\times0{,}5\times0{,}01\times377 \approx 188$ V.</p>` }),
      X({ n: 5, marcas: ["?"], enun: R`<p>Um ímã forte cai dentro de um tubo vertical de cobre (não magnético) e desce bem devagar. Por quê?</p>`, fig: D.svg(160, 200, `<rect x="55" y="10" width="50" height="180" style="fill:color-mix(in srgb,#c98a4a 25%,transparent);stroke:#c98a4a;stroke-width:3"/><rect x="66" y="70" width="28" height="22" style="fill:#ef5b5b"/><rect x="66" y="92" width="28" height="22" style="fill:#4f8dff"/>`, "ímã no tubo"),
        alts: ["O cobre é atraído pelo ímã.", "O ar dentro do tubo freia o ímã.", "As correntes induzidas no cobre (de Foucault) criam campos que se opõem ao movimento do ímã.", "O cobre fica magnetizado permanentemente.", "A gravidade é menor dentro do tubo."], dicas: [R`<p>O cobre não é atraído por ímãs parados.</p>`, R`<p>Fluxo variando num condutor: correntes. Lenz.</p>`], resp: "C", sol: R`<p>Abaixo do ímã o fluxo aumenta, acima diminui: anéis de corrente induzida repelem por baixo e atraem por cima. O ímã atinge uma velocidade terminal pequena; a energia potencial vira calor no tubo. É o freio magnético de montanhas-russas.</p>` }),
    ];
    const exsM = [
      X({ n: 6, marcas: ["!"], enun: R`<p>Dentro de um solenoide longo, o campo cresce a $0{,}050$ T/s. Qual o campo elétrico induzido a $3{,}0$ cm do eixo? As linhas desse campo começam e terminam em cargas?</p>`, fig: D.svg(220, 200, `<circle cx="110" cy="100" r="80" style="fill:none;stroke:#c98a4a;stroke-width:4"/>${[30, 55].map((r) => `<circle cx="110" cy="100" r="${r}" style="fill:none;stroke:var(--mod);stroke-dasharray:5 4"/>`).join("")}${D.txt(110, 104, "B ↑", "tx2")}`, "campo induzido"), dicas: [R`<p>$\oint\vec E\cdot d\vec\ell = -\frac{d\Phi}{dt}$ num círculo de raio $r$.</p>`, R`<p>$E\cdot2\pi r = \pi r^2\frac{dB}{dt}$.</p>`], resp: R`$E = \frac r2\frac{dB}{dt} = 7{,}5\times10^{-4}$ V/m; linhas fechadas, sem começo nem fim.`, sol: R`<p>$E = 0{,}015\times0{,}05 = 7{,}5\times10^{-4}$ V/m. Esse campo <b>não é conservativo</b>: $\oint\vec E\cdot d\vec\ell \ne 0$, não dá para definir potencial. É ele que acelera elétrons num bétatron.</p>` }),
      X({ n: 7, marcas: ["★", "!"], enun: R`<p>Uma barra de $10$ g e $20$ cm cai sem atrito ao longo de dois trilhos verticais ligados por $0{,}50\ \Omega$, num campo horizontal de $0{,}50$ T perpendicular ao plano. Qual a velocidade terminal? ($g = 9{,}8$)</p>`, fig: "", dicas: [R`<p>Terminal: força magnética $= mg$.</p>`, R`<p>$\frac{B^2L^2v}{R} = mg$.</p>`], resp: R`$v_t = \frac{mgR}{B^2L^2} = 4{,}9$ m/s.`, sol: R`<p>$v_t = \frac{0{,}01\times9{,}8\times0{,}5}{0{,}25\times0{,}04} = 4{,}9$ m/s. A partir daí, toda a energia potencial perdida por segundo ($mgv$) vira calor no resistor.</p>` }),
      X({ n: 8, marcas: ["!"], enun: R`<p>Uma espira quadrada de lado $10$ cm e resistência $0{,}20\ \Omega$ entra inteira numa região de $0{,}50$ T. Quanta carga passa por ela? Depende da velocidade?</p>`, fig: "", dicas: [R`<p>$i = \frac{\varepsilon}{R} = -\frac1R\frac{d\Phi}{dt}$, então $q = \int i\,dt = \frac{\Delta\Phi}{R}$.</p>`, R`<p>$\Delta\Phi = BA$.</p>`], resp: R`$q = BA/R = 25$ mC, qualquer que seja a velocidade.`, sol: R`<p>$q = 0{,}5\times0{,}01/0{,}2 = 0{,}025$ C. Entrar rápido dá corrente grande por pouco tempo; devagar, pequena por muito tempo: a carga é a mesma. (O calor, não: ele cresce com a velocidade.)</p>` }),
      X({ n: 9, marcas: ["RU"], enun: R`<p>Uma barra metálica de $20$ cm gira em torno de uma das pontas a $100$ rad/s, num plano perpendicular a $B = 0{,}50$ T. Qual a fem entre as pontas?</p>`, fig: "", dicas: [R`<p>Cada pedacinho $dr$ tem velocidade $\omega r$: $d\varepsilon = B\omega r\,dr$.</p>`, R`<p>$\varepsilon = \frac12B\omega L^2$.</p>`], resp: R`$1{,}0$ V.`, sol: R`<p>$\frac12\times0{,}5\times100\times0{,}04 = 1{,}0$ V. É o disco de Faraday, o primeiro gerador (1831).</p>` }),
    ];

    const chefao = F.chefao({ titulo: "A barra que carrega um capacitor", fig: D.svg(460, 200, xs(460, 200) + `<line x1="60" y1="30" x2="440" y2="30" class="ln"/><line x1="60" y1="170" x2="440" y2="170" class="ln"/><line x1="60" y1="30" x2="60" y2="85" class="ln"/><line x1="60" y1="115" x2="60" y2="170" class="ln"/><line x1="44" y1="85" x2="76" y2="85" class="ln" style="stroke-width:3"/><line x1="44" y1="115" x2="76" y2="115" class="ln" style="stroke-width:3"/>${D.txt(86, 104, "C", "tx", "start")}<rect x="275" y="24" width="10" height="152" style="fill:#c98a4a"/>${D.seta(290, 100, 350, 100, "var(--ink)", 2.2)}${D.txt(354, 96, "v₀", "txm", "start")}`, "barra e capacitor"),
      enun: R`<p>Uma barra de massa $m = 0{,}10$ kg desliza sem atrito sobre trilhos separados por $L = 0{,}50$ m, num campo $B = 1{,}0$ T perpendicular. Os trilhos estão ligados a um capacitor de $C = 1{,}0$ F, inicialmente descarregado; a resistência total do circuito é $R = 0{,}10\ \Omega$. A barra recebe uma velocidade inicial $v_0 = 5{,}0$ m/s.</p>
        <ol type="a"><li>Escreva as equações para $v(t)$ e $q(t)$.</li><li>Qual a velocidade final? (Dica: há uma grandeza conservada.)</li><li>Quanta energia acabou no capacitor, quanta ficou como cinética e quanta virou calor? O calor depende de $R$?</li><li>Com que constante de tempo o sistema chega ao estado final?</li></ol>`,
      dicas: [R`<p>(a) $i = \frac{BLv - q/C}{R}$, $\dot q = i$, $m\dot v = -iLB$.</p>`, R`<p>(b) $m\dot v = -BL\dot q$ integra direto: $mv + BLq$ é constante. No fim, a corrente para: $BLv_f = q_f/C$.</p>`],
      sol: R`<p><b>(a)</b> $m\frac{dv}{dt} = -BL\,i$, $\frac{dq}{dt} = i = \frac{BLv - q/C}{R}$.</p>
        <p><b>(b)</b> $m v + BLq = mv_0$ (vale para qualquer $R$). No fim, $i = 0$: $q_f = CBLv_f$. Então $v_f = \frac{mv_0}{m + CB^2L^2} = \frac{0{,}5}{0{,}35} \approx 1{,}43$ m/s.</p>
        <p><b>(c)</b> Inicial $1{,}25$ J; cinética final $\approx 0{,}102$ J; capacitor $\frac{q_f^2}{2C} \approx 0{,}255$ J ($q_f \approx 0{,}714$ C); calor $\approx 0{,}893$ J, <b>independente de R</b> (como na carga de um RC ${F.ret("C10b")}).</p>
        <p><b>(d)</b> Combinando as equações, $\dot i = -\frac{i}{R}\left(\frac{B^2L^2}{m} + \frac1C\right)$: $\tau = \frac{RmC}{m + CB^2L^2} \approx 0{,}029$ s. (Conferido integrando numericamente: $v_f = 1{,}4286$ m/s.)</p>` });

    return [
      F.secao("abertura", "Pergunta de abertura", R`<div class="abertura"><div class="det">Antes de tudo</div><div class="q">Uma usina hidrelétrica gira um ímã perto de uma bobina e sai eletricidade. Como movimento vira corrente?</div></div>`),
      F.secao("laboratorio", "Laboratório: indução", R`<p>Mova o ímã (ou deixe no automático) e veja o fluxo e a fem. Depois troque para a barra nos trilhos.</p>
        ${F.chute({ q: "o ímã está parado bem no meio da espira. A fem é:", ops: ["máxima", "zero", "metade da máxima", "negativa"], certa: 1, exp: R`<p><b>Zero.</b> O fluxo é máximo, mas não está <b>variando</b>. A fem é a taxa de variação do fluxo: é máxima quando o ímã está entrando ou saindo, rápido.</p>` })}
        <div id="lab-ind"></div>`),
      F.secao("ideia", "A ideia física", R`<p>Faraday (1831) descobriu o inverso de Ørsted: se correntes criam campos magnéticos, campos magnéticos <b>variando</b> criam correntes. O que importa é o fluxo magnético através de um circuito mudar, seja porque o campo muda, a área muda ou o circuito gira.</p>
        <p>E sempre com uma "teimosia": a corrente induzida tem o sentido que se <b>opõe</b> à mudança (lei de Lenz). Se não fosse assim, um ímã empurrado para dentro de uma bobina seria puxado mais, ganharia velocidade, induziria mais... energia do nada. Lenz é a conservação da energia.</p>`),
      F.secao("teoria", "Teoria completa", R`
        <h3>1. Fluxo magnético</h3>
        ${F.formula(R`\Phi_B = \int\vec B\cdot d\vec A\qquad [\Phi_B] = \text{T·m}^2 = \text{Wb}`, "Fluxo")}
        <h3>2. Lei de Faraday</h3>
        ${F.formula(R`\varepsilon = -N\frac{d\Phi_B}{dt}`, "Faraday")}
        <p>O sinal − é a lei de Lenz. Na prática: calcule o módulo com $|d\Phi/dt|$ e ache o sentido pensando "a corrente induzida cria um campo que tenta manter o fluxo como estava".</p>
        <h3>3. Fem de movimento</h3>
        ${F.fig(figBarra)}
        ${F.demo("ε = BLv pela força de Lorentz", R`<p>(i) Os elétrons da barra andam junto com ela a $\vec v$: sentem $q\vec v\times\vec B$, ao longo da barra.</p><p>(ii) Trabalho por unidade de carga ao longo da barra: $\varepsilon = vBL$.</p><p>(iii) Pela lei de Faraday: a área cresce $Lv$ por segundo, $d\Phi/dt = BLv$. Mesmo resultado.</p>`)}
        <p>Força na barra: $iLB$, sempre <b>contra</b> o movimento. Potência mecânica = potência elétrica = calor.</p>
        <h3>4. Gerador de corrente alternada</h3>
        ${F.fig(figGer)}
        ${F.formula(R`\varepsilon(t) = NBA\omega\sin\omega t`)}
        <p>A espira girando tem $\Phi = BA\cos\omega t$. É assim que 99% da eletricidade do mundo é gerada ${F.ret("C15c")}.</p>
        <h3>5. Campos elétricos induzidos</h3>
        <p>E se o circuito está parado e é o campo que varia? Não há força magnética em cargas paradas... A conclusão de Faraday–Maxwell: um $\vec B$ variando cria um campo <b>elétrico</b> com linhas fechadas:</p>
        ${F.formula(R`\oint\vec E\cdot d\vec\ell = -\frac{d\Phi_B}{dt}`, "Faraday na forma de campo")}
        <p>Esse campo não é conservativo: a "fem" ao redor de uma volta não é zero, e não existe potencial elétrico para ele.</p>
        ${F.caixa("fisico", R`<p><b>Correntes de Foucault:</b> num bloco de metal com fluxo variando, aparecem redemoinhos de corrente que esquentam o metal e freiam movimentos. Úteis: fogão de indução, freio magnético, detector de metais. Indesejadas: perda em transformadores, por isso os núcleos são de chapas finas isoladas.</p>`)}
        ${F.caixa("pegadinha", R`<p>A fem depende da <b>variação</b> do fluxo, não do fluxo. E em "dois observadores" (ímã se move ou espira se move), a física é a mesma: num caso a fem vem da força magnética nos elétrons, no outro do campo elétrico induzido. Einstein começou a relatividade especial exatamente por essa assimetria ${F.ret("C18")}.</p>`)}
        ${F.caixa("olimpiada", R`<p>Truques que caem: (1) carga total que passa $= \Delta\Phi/R$, independente da velocidade; (2) velocidade terminal: $B^2L^2v/R = $ força motriz; (3) com capacitor no lugar do resistor, procure a quantidade conservada $mv + BLq$ (chefão).</p>`)}`),
      F.secao("exemplos", "Exemplos passo a passo", exemplario),
      F.secao("resumo", "Resumo", R`<div class="resumo"><div class="r"><b>Faraday</b>$\varepsilon = -N\,d\Phi/dt$</div><div class="r"><b>Lenz</b>a corrente se opõe à variação</div><div class="r"><b>Movimento</b>$\varepsilon = BLv$; força $B^2L^2v/R$</div><div class="r"><b>Gerador</b>$\varepsilon = NBA\omega\sin\omega t$</div><div class="r"><b>Campo induzido</b>$\oint\vec E\cdot d\vec\ell = -d\Phi/dt$</div><div class="r"><b>Carga</b>$q = \Delta\Phi/R$</div></div>`),
      F.secao("exercicios", "Exercícios", `<div class="exs-nivel"><h3>Nível Físico</h3><span class="selo">fixação</span></div>${exsF.join("")}<div class="exs-nivel"><h3>Nível Máximo</h3><span class="selo">OBF · ITA · RU</span></div>${exsM.join("")}`),
      F.secao("chefao", "Chefão", chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-ind"); e.outerHTML = F.lab("Indução: ímã, espira e barra", "lab-ind"); SIM.inducao(document.getElementById("lab-ind"), F); },
});
