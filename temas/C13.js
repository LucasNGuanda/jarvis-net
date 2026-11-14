/* C13 · Força Magnética (cargas em movimento circular, fios, espiras)
   Base: Halliday vol. 3, cap. 28 (28-6 a 28-10), reescrito. Contas conferidas em Python (c06.py). */
F.registrar("C13", {
  retoma: ["C12", "A10"],
  html(F) {
    const R = String.raw;
    const xs = (w, h) => { let s = ""; for (let x = 20; x < w; x += 40) for (let y = 20; y < h; y += 40) s += `<circle cx="${x}" cy="${y}" r="5" style="fill:none;stroke:var(--ink3)"/><path d="M${x - 3} ${y - 3} l6 6 M${x + 3} ${y - 3} l-6 6" style="stroke:var(--ink3)"/>`; return s; };
    const figCirc = D.svg(320, 240, xs(320, 240) + `<circle cx="160" cy="120" r="80" style="fill:none;stroke:var(--mod);stroke-width:2.4"/><circle cx="240" cy="120" r="7" fill="#ef5b5b"/>${D.seta(240, 120, 240, 60, "var(--ink)", 2)}${D.seta(240, 120, 190, 120, "var(--warn)", 2.4)}${D.txt(248, 66, "v", "txm", "start")}${D.txt(200, 112, "F", "txm")}${D.seta(160, 120, 226, 74, "var(--ink2)", 1.2)}${D.txt(186, 92, "r", "txm")}`, "círculo");
    const figEspec = D.svg(460, 230, xs(460, 160).replace(/cy="(\d+)"/g, (m, y) => `cy="${+y + 60}"`) + `<rect x="20" y="40" width="420" height="4" style="fill:var(--ink)"/><rect x="40" y="10" width="40" height="30" class="ln" style="fill:var(--card2)"/>${D.txt(60, 30, "fonte", "tx2")}<path d="M220 44 A 90 90 0 0 0 400 44" style="fill:none;stroke:var(--mod);stroke-width:2"/><path d="M220 44 A 100 100 0 0 0 420 44" style="fill:none;stroke:var(--warn);stroke-width:2"/>${D.txt(310, 214, "B ⊗ (só embaixo)", "tx2")}<line x1="220" y1="20" x2="220" y2="44" class="ln"/>`, "espectrômetro");
    const figFio = D.svg(380, 180, xs(380, 180) + `<line x1="40" y1="90" x2="340" y2="90" style="stroke:#c98a4a;stroke-width:5"/>${D.seta(60, 80, 140, 80, "var(--ink)", 2)}${D.txt(100, 72, "i", "txm")}${D.seta(190, 90, 190, 30, "var(--warn)", 2.6)}${D.txt(200, 36, "F = iL × B", "tx", "start")}`, "força no fio");
    const figEspira = D.svg(420, 220, `<path d="M120 60 L300 40 L300 160 L120 180 Z" style="fill:color-mix(in srgb,var(--mod) 12%,transparent);stroke:#c98a4a;stroke-width:4"/>${[40, 100, 160].map((y) => D.seta(20, y + 10, 400, y + 10, "var(--ink3)", 1.2)).join("")}${D.seta(210, 110, 260, 80, "var(--mod)", 2.4)}${D.txt(266, 76, "μ = NiA", "tx", "start")}${D.txt(390, 20, "B", "txm", "end")}`, "espira");

    const exemplario = F.exemplo({ casos: [
      { nome: "Raio e período", gerar: (p) => {
        const pt = p ? ["elétron", 9.109e-31, 1] : F.escolha([["elétron", 9.109e-31, 1], ["próton", 1.673e-27, 1], ["íon O⁺", 16 * 1.6605e-27, 1]]), v = p ? 1e7 : F.escolha([1e5, 1e6, 1e7]), B = p ? 1e-3 : F.escolha([1e-3, 1e-2, 0.1, 0.5]);
        const r = (pt[1] * v) / (1.602e-19 * B), T = (2 * Math.PI * pt[1]) / (1.602e-19 * B);
        return { enun: R`<p>Um ${pt[0]} entra perpendicularmente a $B = ${F.sigM(B, 2)}$ T com $v = ${F.sigM(v, 1)}$ m/s. Raio e período?</p>`, fig: figCirc,
          passos: [R`<p>A força magnética faz o papel de força centrípeta ${F.ret("A10")}: $|q|vB = \frac{mv^2}{r}$.</p>`, R`$$r = \frac{mv}{|q|B} = ${F.sigM(r, 3)}\ \text{m},\qquad T = \frac{2\pi r}{v} = \frac{2\pi m}{|q|B} = ${F.sigM(T, 3)}\ \text{s}$$`, R`<p>Frequência de cíclotron: $f = 1/T = ${F.sigM(1 / T, 3)}$ Hz. Só depende de $q/m$ e de $B$.</p>`] }; } },
      { nome: "Espectrômetro de massa", gerar: (p) => {
        const U = p ? 1000 : F.escolha([500, 1000, 2000]), B = p ? 0.2 : F.escolha([0.1, 0.2, 0.3]), m1 = p ? 35 : F.escolha([35, 12, 39, 63]), m2 = m1 + 2, u = 1.6605e-27;
        const r = (m) => Math.sqrt((2 * m * u * U) / 1.602e-19) / B;
        return { enun: R`<p>Íons de carga $+e$ e massas $${m1}$ u e $${m2}$ u são acelerados por $${U}$ V e entram num campo de $${B}$ T. A que distância um do outro eles batem no detector (depois de meia volta)?</p>`, fig: figEspec,
          passos: [R`<p>Aceleração: $\frac12mv^2 = eU$. Círculo: $r = \frac{mv}{eB}$. Juntando: $r = \frac1B\sqrt{\frac{2mU}{e}}$.</p>`, R`<p>$r_1 = ${F.n(r(m1) * 100, 2)}$ cm e $r_2 = ${F.n(r(m2) * 100, 2)}$ cm.</p>`, R`<p>Eles batem a $2r$ da entrada: separação $2(r_2 - r_1) = ${F.n(2 * (r(m2) - r(m1)) * 1000, 2)}$ mm. Como $r \propto \sqrt m$, isótopos pesados ficam mais difíceis de separar.</p>`] }; } },
    ] });

    const X = F.exercicio;
    const exsF = [
      X({ n: 1, enun: R`<p>Um elétron a $1{,}0\times10^7$ m/s entra perpendicular a $B = 1{,}0$ mT. Qual o raio da órbita?</p>`, fig: figCirc, dicas: [R`<p>$r = mv/(eB)$.</p>`, R`<p>$9{,}1\times10^{-31}\times10^7/(1{,}6\times10^{-19}\times10^{-3})$.</p>`], resp: R`$\approx 5{,}7$ cm.`, sol: R`<p>$r \approx 5{,}69\times10^{-2}$ m.</p>` }),
      X({ n: 2, marcas: ["★"], enun: R`<p>Qual a frequência de cíclotron de um próton num campo de $1{,}5$ T?</p>`, fig: "", dicas: [R`<p>$f = qB/(2\pi m)$.</p>`, R`<p>Não depende de $v$.</p>`], resp: R`$\approx 23$ MHz.`, sol: R`<p>$f = 1{,}602\times10^{-19}\times1{,}5/(2\pi\times1{,}673\times10^{-27}) \approx 2{,}29\times10^7$ Hz: ondas de rádio.</p>` }),
      X({ n: 3, enun: R`<p>Um fio de $2{,}0$ m com $5{,}0$ A num campo de $0{,}40$ T. Força, se o fio for (a) perpendicular ao campo; (b) a $30°$?</p>`, fig: figFio, dicas: [R`<p>$F = iLB\sin\theta$.</p>`, R`<p>(a) $\sin90° = 1$.</p>`], resp: R`(a) $4{,}0$ N; (b) $2{,}0$ N.`, sol: R`<p>$F = 5\times2\times0{,}4\times\sin\theta$.</p>` }),
      X({ n: 4, enun: R`<p>Bobina de 100 espiras, área $10$ cm², corrente $0{,}50$ A, num campo de $0{,}20$ T. Torque máximo?</p>`, fig: figEspira, dicas: [R`<p>$\tau = NiAB\sin\theta$.</p>`, R`<p>Máximo com $\theta = 90°$.</p>`], resp: R`$1{,}0\times10^{-2}$ N·m.`, sol: R`<p>$100\times0{,}5\times10^{-3}\times0{,}2 = 0{,}01$ N·m.</p>` }),
      X({ n: 5, marcas: ["★"], enun: R`<p>Íons $^{35}$Cl⁺ e $^{37}$Cl⁺, acelerados por $1000$ V, entram num campo de $0{,}20$ T. Separação entre os pontos de impacto após meia volta?</p>`, fig: figEspec, dicas: [R`<p>$r = \frac1B\sqrt{2mU/e}$.</p>`, R`<p>Separação $= 2(r_{37} - r_{35})$.</p>`], resp: R`$\approx 7{,}6$ mm.`, sol: R`<p>$r_{35} \approx 13{,}47$ cm, $r_{37} \approx 13{,}85$ cm; $2\Delta r \approx 7{,}6$ mm.</p>` }),
    ];
    const exsM = [
      X({ n: 6, marcas: ["★"], enun: R`<p>Um cíclotron tem dês de raio $0{,}50$ m e campo de $1{,}5$ T. Qual a energia máxima dos prótons?</p>`, fig: "", dicas: [R`<p>Na borda, $r = R$: $v = eBR/m$.</p>`, R`<p>$K = \frac{(eBR)^2}{2m}$.</p>`], resp: R`$\approx 27$ MeV.`, sol: R`<p>$K = \frac{(1{,}602\times10^{-19}\times0{,}75)^2}{2\times1{,}673\times10^{-27}} \approx 4{,}3\times10^{-12}$ J $\approx 27$ MeV. Repare que não depende da tensão entre os dês (ela só muda o número de voltas). Acima de ~20 MeV a massa relativística começa a dessincronizar o próton: daí os síncrotrons.</p>` }),
      X({ n: 7, marcas: ["!"], enun: R`<p>Um elétron a $1{,}0\times10^6$ m/s faz $60°$ com $B = 1{,}0$ mT. Descreva o movimento e ache o raio e o passo da hélice.</p>`, fig: "", dicas: [R`<p>Decomponha: $v_\parallel = v\cos60°$ (não sente força) e $v_\perp = v\sin60°$ (gira).</p>`, R`<p>Passo $= v_\parallel T$, $T = 2\pi m/(eB)$.</p>`], resp: R`Raio $\approx 4{,}9$ mm; passo $\approx 1{,}8$ cm.`, sol: R`<p>$r = mv_\perp/(eB) \approx 4{,}92$ mm; $T = 35{,}7$ ns; passo $= 5\times10^5\times3{,}57\times10^{-8} \approx 1{,}79$ cm.</p>` }),
      X({ n: 8, marcas: ["∫", "!"], enun: R`<p>Um fio em forma de semicírculo de raio $10$ cm, com $3{,}0$ A, está num campo uniforme de $0{,}50$ T perpendicular ao seu plano. Qual a força total? E num fio de forma <b>qualquer</b> ligando os mesmos dois pontos?</p>`, fig: D.svg(300, 160, xs(300, 160) + `<path d="M50 120 A100 100 0 0 1 250 120" style="fill:none;stroke:#c98a4a;stroke-width:4"/>`, "semicírculo"), dicas: [R`<p>$\vec F = i\int d\vec\ell\times\vec B = i\left(\int d\vec\ell\right)\times\vec B$, com $\vec B$ constante.</p>`, R`<p>$\int d\vec\ell$ é o vetor que liga o começo ao fim.</p>`], resp: R`$F = 2iRB = 0{,}30$ N; a mesma para qualquer forma.`, sol: R`<p>$\int d\vec\ell = 2R\,\hat x$: $F = i\cdot2R\cdot B = 0{,}30$ N. Corolário: uma espira <b>fechada</b> num campo uniforme tem força total zero (mas pode ter torque).</p>` }),
      X({ n: 9, marcas: ["RU"], enun: R`<p>No modelo de Bohr, o elétron do hidrogênio ($v = 2{,}19\times10^6$ m/s, $r = 5{,}29\times10^{-11}$ m) é uma espira de corrente. Qual seu momento magnético?</p>`, fig: "", dicas: [R`<p>$i = ev/(2\pi r)$ ${F.ret("C06")}, $\mu = i\pi r^2$.</p>`, R`<p>$\mu = evr/2$.</p>`], resp: R`$\approx 9{,}3\times10^{-24}$ A·m².`, sol: R`<p>$\mu = \frac{evr}{2} \approx 9{,}28\times10^{-24}$ A·m², o <b>magneton de Bohr</b> $e\hbar/(2m_e)$: a unidade natural de magnetismo atômico ${F.ret("C17b")}.</p>` }),
    ];

    const chefao = F.chefao({ titulo: "O espectrômetro com filtro", fig: D.svg(520, 230, `<rect x="30" y="80" width="40" height="40" class="ln" style="fill:var(--card2)"/>${D.txt(50, 104, "fonte", "tx2")}<rect x="90" y="70" width="140" height="6" style="fill:#ef5b5b;opacity:.7"/><rect x="90" y="124" width="140" height="6" style="fill:#4f8dff;opacity:.7"/>${D.txt(160, 104, "E, B₁", "tx")}<line x1="70" y1="100" x2="300" y2="100" style="stroke:var(--mod);stroke-dasharray:5 4"/><rect x="236" y="70" width="6" height="25" style="fill:var(--ink)"/><rect x="236" y="105" width="6" height="25" style="fill:var(--ink)"/><path d="M300 100 A 70 70 0 0 1 300 240" style="fill:none;stroke:var(--mod);stroke-width:2" transform="translate(0 -40) scale(1 1)"/>${D.txt(420, 120, "B₂ ⊗", "tx")}<line x1="300" y1="30" x2="300" y2="200" class="ln"/>${D.txt(310, 26, "detector", "tx2", "start")}`, "filtro + espectrômetro"),
      enun: R`<p>Íons de carbono com carga $+e$ e velocidades variadas saem de uma fonte. Primeiro passam por um seletor de Wien ($E = 2{,}0\times10^4$ V/m, $B_1 = 0{,}20$ T) com uma fenda na saída; depois entram numa região com $B_2 = 0{,}50$ T e fazem meia volta até um detector plano.</p>
        <ol type="a"><li>Que velocidade sai do seletor?</li><li>Mostre que o raio no espectrômetro é $r = \dfrac{mE}{eB_1B_2}$.</li><li>A que distância um do outro batem $^{12}$C⁺ e $^{13}$C⁺?</li><li>A fenda não é perfeita: passam velocidades com dispersão relativa de $\pm1\%$. Qual a menor diferença de massa (em u) que o aparelho ainda separa, perto de 12 u? Ele separa $^{12}$C de $^{13}$C? E $^{12}$C⁺ de uma molécula de massa $12{,}05$ u?</li></ol>`,
      dicas: [R`<p>(b) $v = E/B_1$ em $r = mv/(eB_2)$.</p>`, R`<p>(d) $r \propto mv$: $\frac{\Delta r}{r} = \frac{\Delta m}{m} + \frac{\Delta v}{v}$. Para dois picos não se sobreporem, a diferença de massa tem que vencer o "borrão" causado pela dispersão de velocidade.</p>`],
      sol: R`<p><b>(a)</b> $v = E/B_1 = 1{,}0\times10^5$ m/s.</p>
        <p><b>(b)</b> $r = \frac{mv}{eB_2} = \frac{mE}{eB_1B_2}$: proporcional à massa (melhor que o espectrômetro sem filtro, em que $r \propto\sqrt m$).</p>
        <p><b>(c)</b> $r_{12} \approx 2{,}488$ cm, $r_{13} \approx 2{,}695$ cm; separação $2\Delta r \approx 4{,}1$ mm.</p>
        <p><b>(d)</b> Cada pico tem largura relativa ~$\pm1\%$ em $r$ (de $\Delta v/v$). Para separar, $\Delta m/m \gtrsim 2\%$ (as duas meias-larguras somadas): perto de 12 u, $\Delta m \gtrsim 0{,}24$ u. $^{12}$C e $^{13}$C (8%) separam bem; $12$ e $12{,}05$ u (0,4%) <b>não</b>. Espectrômetros de alta resolução focam melhor as velocidades ou usam tempo de voo.</p>` });

    return [
      F.secao("abertura", "Pergunta de abertura", R`<div class="abertura"><div class="det">Antes de tudo</div><div class="q">Como um motor elétrico transforma corrente em rotação? E como se mede a massa de um átomo?</div></div>`),
      F.secao("laboratorio", "Laboratório: espira, torque e motor", R`<p>A espira com corrente sente torque e tende a alinhar seu momento magnético com o campo. Ligue o comutador para virar um motor.</p>
        ${F.chute({ q: "sem comutador e sem atrito, a espira solta perto de θ = 90°:", ops: ["gira para sempre no mesmo sentido", "oscila em torno de θ = 0", "fica parada", "para em θ = 180°"], certa: 1, exp: R`<p><b>Oscila em torno de θ = 0</b> (μ alinhado com B), como um pêndulo ou uma bússola. Para girar sempre no mesmo sentido, é preciso inverter a corrente a cada meia volta: o comutador.</p>` })}
        <div id="lab-esp"></div>
        <h3>Partícula num campo magnético</h3><div id="lab-pb2"></div>`),
      F.secao("ideia", "A ideia física", R`<p>Uma carga atravessando um campo magnético perpendicular faz um <b>círculo</b>: a força é centrípeta. Num fio, cada carga que anda sente essa força, e a soma empurra o fio inteiro: é a força dos alto-falantes, motores e trilhos eletromagnéticos. Numa espira, as forças nos lados opostos formam um <b>binário</b>: torque, que gira motores e ponteiros de galvanômetro ${F.ret("C09")}.</p>
        <ul><li>Elétron a $10^7$ m/s em 1 mT: círculo de 6 cm.</li><li>Próton no LHC (7 TeV, 8,3 T): círculo de 2,8 km de raio.</li><li>Fio de 1 m com 10 A em 0,5 T: 5 N, o peso de meio quilo.</li></ul>`),
      F.secao("teoria", "Teoria completa", R`
        <h3>1. Movimento circular</h3>
        ${F.fig(figCirc)}
        ${F.demo("raio e período", R`<p>(i) $\vec F\perp\vec v$ e $|\vec F| = |q|vB$ constante: movimento circular uniforme.</p><p>(ii) $|q|vB = mv^2/r$:</p>${F.formula(R`r = \frac{mv}{|q|B},\qquad T = \frac{2\pi m}{|q|B},\qquad \omega = \frac{|q|B}{m}`)}`)}
        <p>Com $\vec v$ oblíqua: a componente paralela a $\vec B$ não muda: <b>hélice</b>, de passo $v_\parallel T$. Campos não uniformes podem refletir partículas ("garrafa magnética"; cinturões de Van Allen).</p>
        <h3>2. Aplicações</h3>
        <p><b>Espectrômetro de massa:</b> acelera íons por $U$ e mede o raio: $r = \frac1B\sqrt{2mU/q}$. <b>Cíclotron:</b> dois "dês" ocos num campo B, com tensão alternada na fresta de frequência $qB/(2\pi m)$; o raio cresce, o período não. Energia máxima $K = \frac{(qBR)^2}{2m}$. <b>Síncrotron:</b> raio fixo, B aumenta com a energia (LHC).</p>
        <h3>3. Força num fio</h3>
        ${F.fig(figFio)}
        ${F.demo("F = iL × B", R`<p>(i) Num trecho $d\vec\ell$ há carga $dq$ andando a $\vec v_d$. A soma das forças: $d\vec F = dq\,\vec v_d\times\vec B$.</p><p>(ii) $dq\,\vec v_d = (nqA\,d\ell)\vec v_d = i\,d\vec\ell$ ${F.ret("C06")}:</p>${F.formula(R`d\vec F = i\,d\vec\ell\times\vec B,\qquad \vec F = i\vec L\times\vec B\ \text{(fio reto, B uniforme)}`)}`)}
        <h3>4. Torque numa espira</h3>
        ${F.fig(figEspira)}
        ${F.formula(R`\vec\mu = NiA\,\hat n,\qquad \vec\tau = \vec\mu\times\vec B,\qquad U = -\vec\mu\cdot\vec B`, "Dipolo magnético")}
        <p>Mesma matemática do dipolo elétrico ${F.ret("C03")}. O sentido de $\hat n$ vem da mão direita (dedos no sentido da corrente). Em campo uniforme, a força total numa espira fechada é zero; o torque não.</p>
        ${F.caixa("pegadinha", R`<p>No motor de corrente contínua o comutador inverte a corrente a cada meia volta. Sem ele, o torque troca de sinal e a espira só oscila.</p>`)}
        ${F.caixa("olimpiada", R`<p>Em problemas com fios curvos em campo uniforme, use $\vec F = i\vec L_\text{corda}\times\vec B$: só importa o vetor que liga as pontas. E, para órbitas, combine conservação de energia (o campo B não muda $|v|$) com $r = mv/qB$.</p>`)}
        ${F.caixa("ponte", R`<p>Elétrons têm um momento magnético intrínseco (spin) igual a ~1 magneton de Bohr. No experimento de Stern–Gerlach, um campo não uniforme separa átomos em só dois feixes: o spin é quantizado ${F.ret("C16")}.</p>`)}`),
      F.secao("exemplos", "Exemplos passo a passo", exemplario),
      F.secao("resumo", "Resumo", R`<div class="resumo"><div class="r"><b>Órbita</b>$r = mv/|q|B$; $T = 2\pi m/|q|B$</div><div class="r"><b>Cíclotron</b>$K_\text{max} = (qBR)^2/2m$</div><div class="r"><b>Fio</b>$\vec F = i\vec L\times\vec B$</div><div class="r"><b>Espira</b>$\vec\tau = \vec\mu\times\vec B$, $\mu = NiA$</div><div class="r"><b>Energia</b>$U = -\vec\mu\cdot\vec B$</div><div class="r"><b>Espectrômetro</b>$r = \frac1B\sqrt{2mU/q}$</div></div>`),
      F.secao("exercicios", "Exercícios", `<div class="exs-nivel"><h3>Nível Físico</h3><span class="selo">fixação</span></div>${exsF.join("")}<div class="exs-nivel"><h3>Nível Máximo</h3><span class="selo">OBF · ITA · RU</span></div>${exsM.join("")}`),
      F.secao("chefao", "Chefão", chefao),
    ].join("");
  },
  montar(F) {
    const e = document.getElementById("lab-esp"); e.outerHTML = F.lab("Espira num campo: torque e motor", "lab-esp"); SIM.espira(document.getElementById("lab-esp"), F);
    const p = document.getElementById("lab-pb2"); p.outerHTML = F.lab("Círculo, seletor, cíclotron", "lab-pb2"); SIM.particulaB(document.getElementById("lab-pb2"), F);
  },
});
