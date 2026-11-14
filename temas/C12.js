/* C12 · Campo Magnético
   Base: Halliday vol. 3, cap. 28 (28-1 a 28-5), reescrito. Contas conferidas em Python (c06.py); chefão simulado com solve_ivp. */
F.registrar("C12", {
  retoma: ["C03"],
  html(F) {
    const R = String.raw;
    const figIma = D.svg(420, 200, `<rect x="150" y="80" width="60" height="40" style="fill:#ef5b5b"/><rect x="210" y="80" width="60" height="40" style="fill:#4f8dff"/>${D.txt(180, 106, "N", "tx", "middle", 'style="fill:#fff;font-weight:700"')}${D.txt(240, 106, "S", "tx", "middle", 'style="fill:#fff;font-weight:700"')}
      ${[30, 55, 80].map((h) => `<path d="M150 100 C 110 ${100 - h * 1.6}, 310 ${100 - h * 1.6}, 270 100" style="fill:none;stroke:var(--ink2);stroke-width:1.4"/><path d="M150 100 C 110 ${100 + h * 1.6}, 310 ${100 + h * 1.6}, 270 100" style="fill:none;stroke:var(--ink2);stroke-width:1.4"/>`).join("")}<line x1="160" y1="100" x2="260" y2="100" style="stroke:var(--ink2);stroke-width:1.4;stroke-dasharray:3 3"/>${D.txt(210, 190, "linhas saem do N, entram no S e continuam por dentro do ímã", "tx2")}`, "ímã");
    const figForca = D.svg(380, 210, `${D.seta(80, 170, 300, 170, "var(--ink)", 2.2)}${D.txt(310, 175, "v", "txm", "start")}${D.seta(80, 170, 200, 70, "var(--ink2)", 2.2)}${D.txt(205, 66, "B", "txm", "start")}${D.seta(80, 170, 80, 30, "var(--warn)", 2.6)}${D.txt(90, 34, "F = qv × B", "tx", "start")}<path d="M120 170 A40 40 0 0 0 112 146" class="ln2"/>${D.txt(130, 158, "θ", "txm", "start")}`, "regra da mão direita");
    const figHall = D.svg(440, 210, `<path d="M80 60 L320 60 L360 30 L120 30 Z" class="preen"/><path d="M80 60 L80 160 L320 160 L320 60" class="preen"/><path d="M320 60 L360 30 L360 130 L320 160" class="preen"/>${D.seta(30, 110, 78, 110, "var(--ink)", 2)}${D.txt(40, 100, "i", "txm")}${[0, 1, 2, 3, 4].map((k) => `<text x="${110 + 45 * k}" y="78" style="font:700 14px Inter;fill:#4f8dff">−</text><text x="${110 + 45 * k}" y="155" style="font:700 14px Inter;fill:#ef5b5b">+</text>`).join("")}${D.seta(400, 160, 400, 60, "var(--ink2)", 2)}${D.txt(410, 110, "B", "txm", "start")}${D.txt(200, 200, "elétrons desviados para cima: aparece a tensão de Hall", "tx2")}`, "efeito Hall");

    const exemplario = F.exemplo({ casos: [
      { nome: "Força numa carga", gerar: (p) => {
        const part = p ? ["próton", 1] : F.escolha([["próton", 1], ["elétron", -1], ["partícula α", 2]]), v = p ? 3 : F.escolha([1, 2, 3, 5]), B = p ? 0.5 : F.escolha([0.1, 0.2, 0.5, 1]), th = p ? 90 : F.escolha([30, 45, 60, 90]);
        const Fm = Math.abs(part[1]) * 1.602e-19 * v * 1e6 * B * Math.sin((th * Math.PI) / 180);
        return { enun: R`<p>Um ${part[0]} se move a $${v}\times10^6$ m/s formando $${th}°$ com um campo de $${B}$ T. Qual a força magnética?</p>`, fig: figForca,
          passos: [R`<p>$F = |q|vB\sin\theta$, com direção dada pelo produto vetorial $q\,\vec v\times\vec B$ (perpendicular a $\vec v$ e a $\vec B$).</p>`, R`$$F = ${Math.abs(part[1])}\times1{,}602\times10^{-19}\times${v}\times10^6\times${B}\times\sin${th}° = ${F.sigM(Fm, 3)}\ \text{N}$$`,
            R`<p>${part[1] < 0 ? "Carga negativa: o sentido é o <b>oposto</b> do que a regra da mão direita dá para $\\vec v\\times\\vec B$." : "Carga positiva: o sentido é o de $\\vec v\\times\\vec B$."} Como $\vec F\perp\vec v$, a força nunca muda o módulo da velocidade.</p>`] }; } },
      { nome: "Seletor de velocidades", gerar: (p) => {
        const E = p ? 1.5 : F.escolha([1, 1.5, 2, 3]), B = p ? 30 : F.escolha([10, 20, 30, 50]), v = (E * 1e4) / (B * 1e-3);
        return { enun: R`<p>Num seletor, $E = ${F.n(E, 1)}\times10^4$ V/m e $B = ${B}$ mT, cruzados. Que velocidade passa sem desviar? Depende da carga ou da massa?</p>`, fig: "",
          passos: [R`<p>Sem desvio: força elétrica e magnética se cancelam, $qE = qvB$.</p>`, R`<p>$v = E/B = ${F.sigM(v, 3)}$ m/s. Não depende de $q$ nem de $m$ (nem do sinal!).</p>`] }; } },
    ] });

    const X = F.exercicio;
    const exsF = [
      X({ n: 1, enun: R`<p>Um próton a $3{,}0\times10^6$ m/s, perpendicular a $B = 0{,}50$ T. Qual a força?</p>`, fig: figForca, dicas: [R`<p>$F = qvB$.</p>`, R`<p>$1{,}6\times10^{-19}\times3\times10^6\times0{,}5$.</p>`], resp: R`$\approx 2{,}4\times10^{-13}$ N.`, sol: R`<p>$F = 2{,}40\times10^{-13}$ N. Comparando com o peso do próton ($1{,}6\times10^{-26}$ N): 13 ordens de grandeza maior.</p>` }),
      X({ n: 2, enun: R`<p>Um elétron a $2{,}0\times10^7$ m/s faz $30°$ com $B = 1{,}0$ mT. Força?</p>`, fig: figForca, dicas: [R`<p>Só conta a componente de $\vec v$ perpendicular a $\vec B$.</p>`, R`<p>$\sin30° = 0{,}5$.</p>`], resp: R`$\approx 1{,}6\times10^{-15}$ N.`, sol: R`<p>$evB\sin\theta = 1{,}602\times10^{-19}\times2\times10^7\times10^{-3}\times0{,}5 \approx 1{,}6\times10^{-15}$ N.</p>` }),
      X({ n: 3, marcas: ["★"], enun: R`<p>Num seletor de velocidades, $E = 1{,}5\times10^4$ V/m e $B = 0{,}030$ T. Qual velocidade passa?</p>`, fig: "", alts: ["$4{,}5\\times10^2$ m/s", "$5{,}0\\times10^5$ m/s", "$2{,}0\\times10^{-6}$ m/s", "depende da carga", "depende da massa"], dicas: [R`<p>$qE = qvB$.</p>`, R`<p>$v = E/B$.</p>`], resp: "B", sol: R`<p>$v = 1{,}5\times10^4/0{,}03 = 5\times10^5$ m/s. <b>A</b> multiplicou; <b>C</b> inverteu.</p>` }),
      X({ n: 4, marcas: ["?"], enun: R`<p>Uma partícula carregada se move num campo magnético (e só nele). É <b>falso</b>:</p>`, fig: "", alts: ["A força é perpendicular à velocidade.", "A energia cinética da partícula é constante.", "A força magnética não realiza trabalho.", "Se a velocidade for paralela a B, a força é zero.", "A força magnética pode aumentar a velocidade da partícula se ela for positiva."], dicas: [R`<p>$\vec F\cdot\vec v = 0$.</p>`, R`<p>Potência $= \vec F\cdot\vec v$.</p>`], resp: "E", sol: R`<p>$P = \vec F\cdot\vec v = q(\vec v\times\vec B)\cdot\vec v = 0$: o campo magnético só muda a direção, nunca o módulo da velocidade, qualquer que seja o sinal.</p>` }),
      X({ n: 5, enun: R`<p>O campo da Terra num lugar vale $50$ µT e faz $60°$ com a horizontal (inclinação). Qual a componente horizontal (a que a bússola sente)?</p>`, fig: "", dicas: [R`<p>Componente horizontal: $B\cos60°$.</p>`, R`<p>$50\times0{,}5$.</p>`], resp: R`$25$ µT.`, sol: R`<p>$B_h = 25$ µT. No Brasil a inclinação é pequena (perto do equador magnético) e $B_h$ fica perto do total; nos polos magnéticos, $B_h \to 0$ e a bússola fica perdida.</p>` }),
    ];
    const exsM = [
      X({ n: 6, marcas: ["★", "RU"], enun: R`<p><b>Thomson (1897).</b> Elétrons acelerados por $2{,}0$ kV atravessam sem desviar uma região com $E = 2{,}0\times10^5$ V/m e $B = 7{,}54$ mT cruzados. Ache a razão $e/m$.</p>`, fig: "", dicas: [R`<p>Do seletor: $v = E/B$. Da aceleração: $\frac12mv^2 = eV$.</p>`, R`<p>$\frac em = \frac{v^2}{2V} = \frac{E^2}{2VB^2}$.</p>`], resp: R`$\approx 1{,}76\times10^{11}$ C/kg.`, sol: R`<p>$v = 2{,}65\times10^7$ m/s; $e/m = (2{,}65\times10^7)^2/4000 \approx 1{,}76\times10^{11}$ C/kg. Foi assim que o elétron foi "descoberto": uma partícula com $e/m$ ~1800 vezes maior que o do íon de hidrogênio.</p>` }),
      X({ n: 7, marcas: ["!"], enun: R`<p><b>Efeito Hall num metal.</b> Uma fita de cobre de $0{,}10$ mm de espessura conduz $10$ A num campo de $1{,}5$ T perpendicular. Com $n = 8{,}5\times10^{28}$ m⁻³, qual a tensão de Hall?</p>`, fig: figHall, dicas: [R`<p>Equilíbrio dos portadores: $eE_H = ev_dB$.</p>`, R`<p>$V_H = E_Hw$ e $i = nev_d\,wt$, então $V_H = \frac{iB}{ne\,t}$ (a largura cancela).</p>`], resp: R`$\approx 11$ µV.`, sol: R`<p>$V_H = \frac{10\times1{,}5}{8{,}5\times10^{28}\times1{,}602\times10^{-19}\times10^{-4}} \approx 1{,}1\times10^{-5}$ V. Pequeno em metais (muitos portadores).</p>` }),
      X({ n: 8, marcas: ["!", "ITA"], enun: R`<p>Num semicondutor, $i = 1{,}0$ mA, $B = 0{,}50$ T, espessura $0{,}50$ mm, e mede-se $V_H = 2{,}0$ mV com o lado de cima <b>positivo</b> (na mesma geometria em que, num metal, ele ficaria negativo). Qual a densidade de portadores, e qual o sinal deles?</p>`, fig: figHall, dicas: [R`<p>$n = \frac{iB}{e\,t\,V_H}$.</p>`, R`<p>Sinal invertido em relação ao metal: os portadores são positivos ("buracos").</p>`], resp: R`$n \approx 3{,}1\times10^{21}$ m⁻³; portadores positivos.`, sol: R`<p>$n = \frac{10^{-3}\times0{,}5}{1{,}6\times10^{-19}\times5\times10^{-4}\times2\times10^{-3}} \approx 3{,}1\times10^{21}$ m⁻³, ~$10^7$ vezes menos que no cobre: por isso $V_H$ é grande. O efeito Hall foi a primeira prova direta de que os portadores podem ser positivos (semicondutor tipo p) ${F.ret("C16")}.</p>` }),
    ];

    const chefao = F.chefao({ titulo: "A cicloide do elétron", fig: D.svg(520, 200, `<rect x="20" y="10" width="480" height="6" style="fill:#ef5b5b;opacity:.6"/><rect x="20" y="180" width="480" height="6" style="fill:#4f8dff;opacity:.6"/><path d="M40 170 ${Array.from({ length: 121 }, (_, k) => { const t = (k / 120) * 4 * Math.PI; return `L${(40 + 34 * (t - Math.sin(t))).toFixed(1)} ${(170 - 60 * (1 - Math.cos(t))).toFixed(1)}`; }).join(" ")}" style="fill:none;stroke:var(--mod);stroke-width:2"/>${D.txt(470, 40, "B ⊗", "tx2")}`, "cicloide"),
      enun: R`<p>Um elétron parte do repouso numa região com campo elétrico uniforme $E = 1{,}0\times10^3$ V/m (apontando para baixo, então a força elétrica nele é para cima) e campo magnético $B = 1{,}0$ mT, perpendicular a $E$ (entrando na tela). Despreze a gravidade.</p>
        <ol type="a"><li>Mostre que, num referencial que se move com velocidade $\vec u = \vec E\times\vec B/B^2$, o elétron vê só um campo magnético. Qual o módulo de $u$?</li><li>Use (a) para descrever o movimento no laboratório: que curva é essa?</li><li>Qual a altura máxima, a velocidade máxima e a distância horizontal de um "arco"?</li><li>A velocidade média (de deriva) depende do sinal da carga? E da massa?</li></ol>`,
      dicas: [R`<p>(a) Escreva $\vec v = \vec u + \vec v{}'$ e substitua na força: $q(\vec E + \vec u\times\vec B + \vec v{}'\times\vec B)$. Escolha $\vec u$ para zerar os dois primeiros termos. (Para velocidades pequenas comparadas com c, pode trocar de referencial assim.)</p>`, R`<p>(b) No referencial móvel, o elétron começa com velocidade $-\vec u$ e faz um círculo de raio $u/\omega$, $\omega = eB/m$. No laboratório: círculo que "rola" com velocidade $u$.</p>`],
      sol: R`<p><b>(a)</b> $\vec E + \vec u\times\vec B = 0$ com $\vec u = \vec E\times\vec B/B^2$ (perpendicular a ambos). $u = E/B = 1{,}0\times10^6$ m/s.</p>
        <p><b>(b)</b> No referencial móvel: círculo de raio $r = u/\omega = mE/(eB^2)$ percorrido com velocidade $u$. No laboratório, o centro anda a $u$: é uma <b>cicloide</b> (como um ponto da borda de uma roda que rola sem deslizar).</p>
        <p><b>(c)</b> Altura máxima $= 2r = \frac{2mE}{eB^2} \approx 11{,}4$ mm; velocidade máxima $= 2u = 2{,}0\times10^6$ m/s (no topo); um arco: $uT = u\frac{2\pi m}{eB} \approx 3{,}6$ cm, com $T \approx 35{,}7$ ns. (Conferido integrando a equação de movimento numericamente.)</p>
        <p><b>(d)</b> $\vec u = \vec E\times\vec B/B^2$ não tem $q$ nem $m$: elétrons e íons derivam juntos, na mesma direção. É a "deriva E × B" dos plasmas (Sol, tokamak ${F.ret("C19")}).</p>` });

    return [
      F.secao("abertura", "Pergunta de abertura", R`<div class="abertura"><div class="det">Antes de tudo</div><div class="q">Por que a aurora boreal aparece perto dos polos, e não no equador?</div></div>`),
      F.secao("laboratorio", "Laboratório: carga num campo magnético", R`<p>Veja o círculo, depois o seletor de velocidades, o cíclotron e a cicloide.</p>
        ${F.chute({ q: "dobrando a velocidade da partícula (só B), o tempo de uma volta:", ops: ["dobra", "cai pela metade", "não muda", "quadruplica"], certa: 2, exp: R`<p><b>Não muda.</b> O raio dobra ($r = mv/qB$), o caminho dobra, a velocidade dobra: o período $T = 2\pi m/(qB)$ não depende de $v$. É o segredo do cíclotron.</p>` })}
        <div id="lab-pb"></div>`),
      F.secao("ideia", "A ideia física", R`<p>Ímãs e correntes criam ao redor um <b>campo magnético</b> $\vec B$. Ele só age em cargas <b>em movimento</b>, e de um jeito estranho: a força é perpendicular à velocidade e ao campo. Por isso ele nunca acelera nem freia, só entorta trajetórias.</p>
        <ul><li>Campo da Terra: ~50 µT. Ímã de geladeira: ~5 mT. Ímã de neodímio: ~1 T. Ressonância magnética: 1,5–3 T. Estrela de nêutron (magnetar): ~$10^{11}$ T.</li><li>Unidade: tesla, $1\ \text{T} = 1\ \text{N}/(\text{A·m})$. Antiga: gauss, $1\ \text{G} = 10^{-4}$ T.</li></ul>
        <p>A aurora: partículas do vento solar chegando em direção perpendicular às linhas do campo terrestre são desviadas; elas espiralam ao longo das linhas, que mergulham na atmosfera perto dos polos magnéticos, e é lá que colidem com o ar e brilham.</p>`),
      F.secao("teoria", "Teoria completa", R`
        <h3>1. Ímãs e linhas de campo</h3>
        ${F.fig(figIma)}
        <p>Todo ímã tem dois polos, N e S; polos iguais se repelem. Quebrando um ímã, cada pedaço vira um ímã completo: <b>não existe polo isolado</b> (monopolo). As linhas de $\vec B$ saem do N, entram no S e continuam por dentro: são sempre <b>fechadas</b>.</p>
        ${F.formula(R`\oint_S\vec B\cdot d\vec A = 0`, "Gauss do magnetismo")}
        <p>A Terra é um ímã com o polo <b>sul</b> magnético perto do norte geográfico (por isso o N da bússola aponta para lá). Ele se move e se inverte a cada ~centenas de milhares de anos.</p>
        <h3>2. Definição de B pela força</h3>
        ${F.fig(figForca)}
        ${F.formula(R`\vec F_B = q\,\vec v\times\vec B,\qquad |\vec F_B| = |q|vB\sin\theta`, "Força magnética")}
        <p>Definição operacional: $B$ é o valor que faz essa fórmula funcionar para qualquer carga e velocidade. Regra da mão direita: dedos em $\vec v$, curvam para $\vec B$, polegar dá $\vec v\times\vec B$; para $q < 0$, inverta.</p>
        ${F.demo("o campo magnético não realiza trabalho", R`<p>$P = \vec F\cdot\vec v = q(\vec v\times\vec B)\cdot\vec v = 0$, porque $\vec v\times\vec B$ é perpendicular a $\vec v$. Então $\frac{d}{dt}\left(\frac12mv^2\right) = 0$: a velocidade escalar não muda.</p>`)}
        <h3>3. Força de Lorentz e campos cruzados</h3>
        ${F.formula(R`\vec F = q\left(\vec E + \vec v\times\vec B\right)`, "Força de Lorentz")}
        <p>Com $\vec E\perp\vec B$ e $\vec v$ perpendicular a ambos, as forças se cancelam se $v = E/B$: <b>seletor de velocidades</b>. Thomson usou isso para medir $e/m$ do elétron.</p>
        <h3>4. Efeito Hall</h3>
        ${F.fig(figHall)}
        ${F.demo("tensão de Hall", R`<p>(i) Portadores de carga $q$ derivam com $v_d$; a força magnética $qv_dB$ os empurra para um lado da fita, que fica carregado.</p><p>(ii) Surge um campo transversal $E_H$ que equilibra: $qE_H = qv_dB$.</p><p>(iii) Com $i = nqv_d\,(wt)$ e $V_H = E_Hw$:</p>${F.formula(R`V_H = \frac{iB}{nq\,t}`)}`)}
        <p>Mede $n$ e o <b>sinal</b> dos portadores. Sensores de Hall medem campos (celulares, freios ABS).</p>
        ${F.caixa("ponte", R`<p>Para velocidades altas, trocar de referencial muda E e B de um jeito que mistura os dois: eles são componentes de um mesmo objeto, o tensor eletromagnético ${F.ret("C18")}. Em baixíssima temperatura, a resistência de Hall fica quantizada em $h/(e^2n)$ (efeito Hall quântico, Nobel 1985).</p>`)}`),
      F.secao("exemplos", "Exemplos passo a passo", exemplario),
      F.secao("resumo", "Resumo", R`<div class="resumo"><div class="r"><b>Força</b>$\vec F = q\vec v\times\vec B$; $F = |q|vB\sin\theta$</div><div class="r"><b>Trabalho</b>zero: só muda a direção</div><div class="r"><b>Lorentz</b>$q(\vec E + \vec v\times\vec B)$</div><div class="r"><b>Seletor</b>$v = E/B$</div><div class="r"><b>Hall</b>$V_H = iB/(nqt)$</div><div class="r"><b>Sem monopolo</b>$\oint\vec B\cdot d\vec A = 0$</div></div>`),
      F.secao("exercicios", "Exercícios", `<div class="exs-nivel"><h3>Nível Físico</h3><span class="selo">fixação</span></div>${exsF.join("")}<div class="exs-nivel"><h3>Nível Máximo</h3><span class="selo">OBF · ITA · RU</span></div>${exsM.join("")}`),
      F.secao("chefao", "Chefão", chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-pb"); e.outerHTML = F.lab("Carga num campo magnético", "lab-pb"); SIM.particulaB(document.getElementById("lab-pb"), F); },
});
