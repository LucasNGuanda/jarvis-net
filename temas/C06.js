/* C06 · Corrente Elétrica
   Base: Halliday vol. 3, cap. 26 (26-2 e 26-3), reescrito. Contas conferidas em Python (c05b.py). */
F.registrar("C06", {
  retoma: ["C01", "C05"],
  html(F) {
    const R = String.raw;
    const figSecao = D.svg(460, 170, `${D.cilindro(60, 85, 320, 45)}<ellipse cx="220" cy="85" rx="16" ry="45" style="fill:color-mix(in srgb,var(--warn) 35%,transparent);stroke:var(--warn);stroke-width:2"/>${D.seta(100, 85, 180, 85, "var(--ink)", 2)}${D.txt(140, 76, "i", "txm")}${D.txt(220, 150, "seção A", "tx2")}${D.seta(330, 60, 270, 60, "#4f8dff", 1.6)}${D.txt(300, 52, "elétrons", "tx2")}`, "corrente num fio");
    const figCone = D.svg(460, 170, `<path class="preen" d="M60 65 L400 35 L400 135 L60 105 Z"/><ellipse class="preen" cx="60" cy="85" rx="7" ry="20"/><ellipse class="preen" cx="400" cy="85" rx="15" ry="50"/>${D.seta(90, 85, 170, 85, "var(--ink)", 2)}${D.txt(130, 76, "i", "txm")}${D.txt(48, 90, "a", "txm", "end")}${D.txt(424, 90, "b", "txm", "start")}<path class="ln2" d="M60 150 v8 H400 v-8"/>${D.txt(230, 168, "L", "txm")}`, "fio cônico");

    const exemplario = F.exemplo({ casos: [
      { nome: "Velocidade de deriva", gerar: (p) => {
        const i = p ? 5 : F.escolha([1, 2, 5, 10, 20]), A = p ? 2 : F.escolha([0.5, 1, 1.5, 2.5, 4]), n = 8.5e28, vd = i / (n * 1.602e-19 * A * 1e-6);
        return { enun: R`<p>Um fio de cobre de $${F.m(A, 1)}$ mm² conduz $${i}$ A. Com $n = 8{,}5\times10^{28}$ elétrons livres/m³, qual a velocidade de deriva? Quanto tempo um elétron leva para andar 1 m?</p>`, fig: figSecao,
          passos: [R`<p>Em $dt$, passam pela seção os elétrons de um cilindro de comprimento $v_d\,dt$: carga $neAv_d\,dt$. Logo $i = neAv_d$.</p>`, R`$$v_d = \frac{i}{neA} = \frac{${i}}{8{,}5\times10^{28}\times1{,}602\times10^{-19}\times${F.sigM(A * 1e-6, 2)}} = ${F.sigM(vd, 3)}\ \text{m/s}$$`,
            R`<p><b>Resposta:</b> $v_d \approx ${F.m(vd * 1000, 3)}$ mm/s; 1 m leva $${F.m(1 / vd / 60, 0)}$ min. A lâmpada acende na hora porque o <b>sinal</b> (o campo) se propaga perto da velocidade da luz, empurrando os elétrons que já estão no fio inteiro.</p>`] }; } },
      { nome: "Carga com i(t)", gerar: (p) => {
        const a = p ? 4 : F.escolha([1, 2, 3, 4]), b = p ? 2 : F.escolha([1, 2, 3]), T = p ? 3 : F.escolha([2, 3, 4, 5]), q = a * T + (b * T * T) / 2;
        return { enun: R`<p>A corrente num fio varia como $i(t) = ${a} + ${b}t$ (A, com t em s). Quanta carga passa entre $t = 0$ e $t = ${T}$ s?</p>`, fig: D.svg(300, 170, `${D.eixos({ x0: 40, y0: 150, w: 240, h: 130, xlab: "t", ylab: "i" })}<polygon points="40,150 40,${150 - 12 * a} ${40 + 45 * T},${150 - 12 * (a + b * T)} ${40 + 45 * T},150" class="preen"/>`, "área sob i(t)"),
          passos: [R`<p>$i = dq/dt \Rightarrow q = \int i\,dt$: a carga é a <b>área</b> sob o gráfico de $i(t)$.</p>`, R`$$q = \int_0^{${T}}(${a} + ${b}t)\,dt = ${a}\cdot${T} + \frac{${b}\cdot${T}^2}{2} = ${F.m(q, 1)}\ \text{C}$$`, R`<p>Aqui o gráfico é um trapézio: dá para conferir sem integral, $\frac{(${a} + ${a + b * T})}{2}\times${T} = ${F.m(q, 1)}$ ✓.</p>`] }; } },
    ] });

    const X = F.exercicio;
    const exsF = [
      X({ n: 1, enun: R`<p>Num fio, $i(t) = 4 + 2t$ (SI). Quanta carga passa de $t = 0$ a $t = 3$ s?</p>`, fig: "", dicas: [R`<p>Área sob $i(t)$.</p>`, R`<p>$\int_0^3(4 + 2t)dt$.</p>`], resp: R`$21$ C.`, sol: R`<p>$12 + 9 = 21$ C.</p>` }),
      X({ n: 2, enun: R`<p>Quantos elétrons por segundo passam por um LED com $2{,}0$ mA?</p>`, fig: "", dicas: [R`<p>$n = i/e$.</p>`, R`<p>$2\times10^{-3}/1{,}602\times10^{-19}$.</p>`], resp: R`$\approx 1{,}2\times10^{16}$ por segundo.`, sol: R`<p>$1{,}25\times10^{16}$ elétrons/s.</p>` }),
      X({ n: 3, marcas: ["★"], enun: R`<p>Fio de cobre de $2{,}0$ mm² com $5{,}0$ A ($n = 8{,}5\times10^{28}$ m⁻³). Velocidade de deriva?</p>`, fig: figSecao, dicas: [R`<p>$i = neAv_d$.</p>`, R`<p>Cuidado: mm² $= 10^{-6}$ m².</p>`], resp: R`$\approx 0{,}18$ mm/s.`, sol: R`<p>$v_d = 5/(8{,}5\times10^{28}\times1{,}602\times10^{-19}\times2\times10^{-6}) \approx 1{,}8\times10^{-4}$ m/s.</p>` }),
      X({ n: 4, enun: R`<p>Um fio afina de $2{,}0$ mm para $1{,}0$ mm de diâmetro, conduzindo $3{,}0$ A. Ache a densidade de corrente nos dois trechos.</p>`, fig: figCone, dicas: [R`<p>A corrente é a mesma (conservação da carga).</p>`, R`<p>$J = i/A$.</p>`], resp: R`$\approx 9{,}5\times10^5$ e $3{,}8\times10^6$ A/m².`, sol: R`<p>$J_1 = 3/(\pi\times10^{-6}) \approx 9{,}55\times10^5$ A/m²; $J_2 = 4J_1$. No trecho fino, os elétrons andam 4 vezes mais rápido.</p>` }),
      X({ n: 5, enun: R`<p>Uma pilha AA tem "2500 mAh". Quanta carga ela entrega ao longo da vida?</p>`, fig: D.svg(200, 80, `<rect x="40" y="25" width="110" height="34" rx="6" class="ln" style="fill:var(--card2)"/><rect x="150" y="34" width="8" height="16" style="fill:var(--ink)"/>${D.txt(95, 47, "AA", "tx")}`, "pilha"), dicas: [R`<p>mAh é corrente × tempo.</p>`, R`<p>$2{,}5\ \text{A}\times3600$ s.</p>`], resp: R`$9{,}0\times10^3$ C.`, sol: R`<p>$2{,}5\times3600 = 9000$ C. "mAh" é unidade de <b>carga</b>, não de energia (para energia, multiplique por 1,5 V: ~13,5 kJ).</p>` }),
    ];
    const exsM = [
      X({ n: 6, marcas: ["∫", "!"], enun: R`<p>Num fio de raio $R = 2{,}0$ mm, a densidade de corrente cresce do centro para a borda: $J(r) = J_0\,r/R$, com $J_0 = 3{,}0\times10^5$ A/m². Qual a corrente total?</p>`, fig: D.svg(200, 180, `<circle cx="100" cy="90" r="70" style="fill:color-mix(in srgb,var(--warn) 15%,transparent);stroke:var(--ink)"/><circle cx="100" cy="90" r="40" style="fill:none;stroke:var(--mod);stroke-width:6;opacity:.5"/>${D.txt(146, 84, "dr", "txm", "start")}`, "anel de corrente"),
        dicas: [R`<p>Anel de raio $r$ e largura $dr$: área $2\pi r\,dr$.</p>`, R`<p>$i = \int_0^R J_0\frac rR\,2\pi r\,dr$.</p>`], resp: R`$i = \frac{2\pi J_0R^2}{3} \approx 2{,}5$ A.`, sol: R`<p>$i = \frac{2\pi J_0}{R}\cdot\frac{R^3}{3} = \frac{2\pi\times3\times10^5\times4\times10^{-6}}{3} \approx 2{,}51$ A. (Em corrente alternada de alta frequência a corrente se concentra mesmo na borda: efeito pelicular.)</p>` }),
      X({ n: 7, marcas: ["RU"], enun: R`<p>Um feixe de elétrons de $10$ mA, acelerado por $5{,}0$ kV, tem quantos elétrons por metro de comprimento?</p>`, fig: D.svg(380, 80, `<rect x="20" y="25" width="40" height="30" class="ln" style="fill:var(--card2)"/>${[...Array(14)].map((_, k) => `<circle cx="${80 + 20 * k}" cy="40" r="3" fill="#5aa0ff"/>`).join("")}${D.seta(80, 64, 160, 64, "var(--ink2)", 1.4)}${D.txt(120, 78, "v", "txm")}`, "feixe"),
        dicas: [R`<p>$i = \lambda v$, com $\lambda$ a carga por comprimento.</p>`, R`<p>$v = \sqrt{2eU/m}$.</p>`], resp: R`$\approx 1{,}5\times10^9$ elétrons/m.`, sol: R`<p>$v \approx 4{,}19\times10^7$ m/s; $\lambda = i/v \approx 2{,}38\times10^{-10}$ C/m; $\lambda/e \approx 1{,}49\times10^9$ por metro.</p>` }),
      X({ n: 8, marcas: ["∫"], enun: R`<p>Na descarga de um capacitor, $i(t) = i_0e^{-t/\tau}$, com $i_0 = 2{,}0$ mA e $\tau = 3{,}0$ s. Quanta carga ele tinha?</p>`, fig: "", dicas: [R`<p>Toda a carga passa pelo fio até $t \to \infty$.</p>`, R`<p>$\int_0^\infty e^{-t/\tau}dt = \tau$.</p>`], resp: R`$6{,}0$ mC.`, sol: R`<p>$Q = i_0\tau = 6{,}0\times10^{-3}$ C ${F.ret("C10b")}.</p>` }),
      X({ n: 9, marcas: ["!"], enun: R`<p>(a) Um anel com carga $5{,}0$ µC gira a $50$ voltas/s. Qual a corrente equivalente? (b) No modelo de Bohr, o elétron do hidrogênio tem $v = 2{,}19\times10^6$ m/s numa órbita de raio $5{,}29\times10^{-11}$ m. Qual a corrente?</p>`, fig: D.svg(220, 160, `<ellipse cx="110" cy="80" rx="80" ry="40" style="fill:none;stroke:#ef5b5b;stroke-width:3"/><path d="M180 60 q14 12 4 30" class="ln2"/>${D.seta(186, 86, 182, 96, "var(--ink2)", 1.4)}`, "anel girando"),
        dicas: [R`<p>Por um ponto fixo, passa a carga inteira a cada volta.</p>`, R`<p>$i = Qf$; no átomo, $f = v/(2\pi r)$.</p>`], resp: R`(a) $0{,}25$ mA; (b) $\approx 1{,}1$ mA.`, sol: R`<p>(a) $i = 5\times10^{-6}\times50 = 2{,}5\times10^{-4}$ A. (b) $f = 6{,}6\times10^{15}$ Hz; $i = ef \approx 1{,}06$ mA. Uma corrente "macroscópica" num átomo: é ela que dá o momento magnético orbital ${F.ret("C13")}.</p>` }),
    ];

    const chefao = F.chefao({ titulo: "A viagem pelo fio cônico", fig: figCone,
      enun: R`<p>Um fio de cobre ($n = 8{,}5\times10^{28}$ m⁻³) tem forma de tronco de cone: raio $a = 0{,}50$ mm numa ponta, $b = 1{,}0$ mm na outra, comprimento $L = 1{,}0$ m. Ele conduz $i = 2{,}0$ A em regime estacionário.</p>
        <ol type="a"><li>Escreva $v_d(x)$ ao longo do fio.</li><li>Mostre que o tempo que um elétron leva para atravessar o fio inteiro é $t = \dfrac{ne\,V_\text{fio}}{i}$, onde $V_\text{fio}$ é o volume do fio. Interprete.</li><li>Calcule esse tempo.</li><li>Um elétron entra pela ponta fina ($x = 0$). Em que posição $x$ ele está na metade desse tempo?</li></ol>`,
      dicas: [R`<p>(a) $v_d = \frac{i}{ne\,\pi r(x)^2}$, com $r$ linear em $x$. (b) $t = \int\frac{dx}{v_d}$.</p>`, R`<p>(b) $\int\pi r^2dx$ é o volume. Interpretação: todos os elétrons livres do fio têm que "passar pela porta" com a vazão $i/e$. (d) Ache $x$ tal que o volume de 0 a $x$ seja metade do total.</p>`],
      sol: R`<p><b>(a)</b> $v_d(x) = \frac{i}{ne\pi r(x)^2}$, $r(x) = a + (b-a)x/L$: mais rápido na ponta fina.</p>
        <p><b>(b)</b> $t = \int_0^L\frac{ne\pi r^2}{i}dx = \frac{ne}{i}\int_0^L\pi r^2dx = \frac{neV}{i}$. É a carga livre total do fio dividida pela vazão de carga: o tempo para "trocar" todos os elétrons.</p>
        <p><b>(c)</b> $V = \frac{\pi L}{3}(a^2 + ab + b^2) = 1{,}83\times10^{-6}$ m³; $t = \frac{8{,}5\times10^{28}\times1{,}602\times10^{-19}\times1{,}83\times10^{-6}}{2} \approx 1{,}25\times10^4$ s $\approx 3{,}5$ h.</p>
        <p><b>(d)</b> $\int_0^x\pi r^2dx' = \frac{\pi L}{3(b-a)}(r^3 - a^3)$; igualando a $V/2$: $r^3 = \frac{a^3 + b^3}{2} \Rightarrow r \approx 0{,}826$ mm, ou seja, $x \approx 0{,}65$ m. Passado o meio tempo, ele ainda não chegou no meio? Pelo contrário: já passou do meio, porque o começo (fino) ele atravessa rápido.</p>` });

    return [
      F.secao("abertura", "Pergunta de abertura", R`<div class="abertura"><div class="det">Antes de tudo</div><div class="q">Os elétrons num fio andam mais devagar que uma lesma. Então por que a luz acende no instante em que você aperta o interruptor?</div></div>`),
      F.secao("laboratorio", "Laboratório: a deriva dos elétrons", R`<p>Zere o campo: os elétrons continuam se mexendo, mas a contagem líquida fica perto de zero. Aumente o campo e veja a deriva aparecer.</p>
        ${F.chute({ q: "você desliga a agitação térmica (os elétrons param depois de cada colisão). A velocidade de deriva média:", ops: ["fica igual", "aumenta muito", "vai a zero", "fica negativa"], certa: 0, exp: R`<p><b>Fica igual</b> (em média, $v_d = a\tau$). A agitação térmica é aleatória e some na média; quem define a deriva é a aceleração pelo campo e o tempo entre colisões. É o modelo de Drude ${F.ret("C07")}.</p>` })}
        <div id="lab-dr"></div>`),
      F.secao("ideia", "A ideia física", R`<p>Corrente é <b>carga atravessando uma seção por unidade de tempo</b>. Num metal, são elétrons; numa solução salina, íons + e − andando em sentidos opostos; num tubo de TV, um feixe de elétrons no vácuo; num neurônio, íons de sódio e potássio.</p>
        <ul><li>LED: 20 mA. Celular carregando: ~2 A. Chuveiro: ~25 A. Raio: ~30 000 A (por uns microssegundos).</li><li>1 A ≈ $6\times10^{18}$ elétrons por segundo.</li><li>Velocidade de deriva no cobre: décimos de mm/s. Velocidade térmica dos elétrons: ~$10^6$ m/s.</li></ul>
        <p>A luz acende na hora porque o fio já está cheio de elétrons: ao ligar, o campo elétrico se estabelece no fio inteiro quase na velocidade da luz, e todos começam a derivar juntos, como água num cano já cheio.</p>`),
      F.secao("teoria", "Teoria completa", R`
        <h3>1. Definição</h3>
        ${F.formula(R`i = \frac{dq}{dt},\qquad q = \int i\,dt,\qquad 1\ \text{A} = 1\ \text{C/s}`, "Corrente elétrica")}
        <p>O ampère é unidade de base do SI; desde 2019, é definido fixando $e$ exatamente, então 1 A é $1/(1{,}602176634\times10^{-19})$ cargas elementares por segundo.</p>
        <p><b>Sentido convencional:</b> o do movimento de cargas positivas. Elétrons andam ao contrário. Corrente é um <b>escalar</b> com sinal (indica o sentido ao longo do fio), não um vetor.</p>
        ${F.fig(figSecao)}
        <h3>2. Densidade de corrente</h3>
        <p>Para descrever a corrente ponto a ponto, usamos o vetor $\vec J$ (A/m²), na direção do movimento das cargas positivas:</p>
        ${F.formula(R`i = \int_S\vec J\cdot d\vec A,\qquad \vec J = nq\,\vec v_d`)}
        ${F.demo("i = neAv_d", R`<p>(i) Num intervalo $dt$, cada portador anda $v_d\,dt$. Os que atravessam a seção $A$ estão num cilindro de volume $Av_d\,dt$.</p><p>(ii) Eles são $nAv_d\,dt$, com carga $dq = neAv_d\,dt$.</p><p>(iii) $i = dq/dt = neAv_d$, isto é, $J = nev_d$.</p>`)}
        <h3>3. Conservação da carga: lei dos nós</h3>
        <p>Em regime estacionário, carga não se acumula em lugar nenhum. Num nó, o que entra sai: $\sum i_\text{entrando} = \sum i_\text{saindo}$ ${F.ret("C10b")}. Num fio de seção variável, a corrente é a mesma em todas as seções e $J$ muda.</p>
        ${F.caixa("ponte", R`<p>Versão local: $\nabla\cdot\vec J + \frac{\partial\rho}{\partial t} = 0$, a equação da continuidade. É exatamente a mesma equação da conservação da massa em fluidos ${F.ret("N02")}, com $\vec J \leftrightarrow \rho\vec v$.</p>`)}
        <h3>4. Velocidade de deriva × velocidade térmica × velocidade do sinal</h3>
        <ul><li><b>Térmica</b> (dos elétrons de condução): ~$1{,}6\times10^6$ m/s (velocidade de Fermi, quântica) em todas as direções.</li><li><b>Deriva</b>: ~$10^{-4}$ m/s, na mesma direção para todos.</li><li><b>Sinal</b>: ~$2\times10^8$ m/s, é o campo se propagando pelo fio.</li></ul>
        ${F.caixa("fisico", R`<p>Num fio de cobre de 1 mm² com 1 A há ~$10^{23}$ elétrons livres por metro. Mesmo com cada um quase parado, a quantidade gigantesca faz a corrente. O "rio" de elétrons é larguíssimo e lentíssimo.</p>`)}
        <h3>5. Corrente em outros meios</h3>
        <p><b>Eletrólitos:</b> íons positivos e negativos andam em sentidos opostos e os dois contribuem para a corrente no mesmo sentido (eletrólise do sulfato de cobre: o cobre se deposita no cátodo). <b>Gases:</b> só conduzem ionizados (faísca, lâmpada fluorescente). <b>Semicondutores:</b> elétrons e "buracos" ${F.ret("C16")}.</p>
        ${F.caixa("pegadinha", R`<p>"A corrente se gasta na lâmpada." <b>Não:</b> a corrente que entra é a que sai. O que a lâmpada "gasta" é energia (o potencial cai) ${F.ret("C07")}.</p>`)}`),
      F.secao("exemplos", "Exemplos passo a passo", exemplario),
      F.secao("resumo", "Resumo", R`<div class="resumo"><div class="r"><b>Corrente</b>$i = dq/dt$; $q = \int i\,dt$ (área)</div><div class="r"><b>Densidade</b>$\vec J = ne\vec v_d$; $i = \int\vec J\cdot d\vec A$</div><div class="r"><b>Deriva</b>$v_d = i/(neA)$ ~ 0,1 mm/s</div><div class="r"><b>Nós</b>o que entra sai</div></div>`),
      F.secao("exercicios", "Exercícios", `<div class="exs-nivel"><h3>Nível Físico</h3><span class="selo">fixação</span></div>${exsF.join("")}<div class="exs-nivel"><h3>Nível Máximo</h3><span class="selo">OBF · ITA · RU</span></div>${exsM.join("")}`),
      F.secao("chefao", "Chefão", chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-dr"); e.outerHTML = F.lab("Deriva dos elétrons (modelo de Drude)", "lab-dr"); SIM.deriva(document.getElementById("lab-dr"), F); },
});
