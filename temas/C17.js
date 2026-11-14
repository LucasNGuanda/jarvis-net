/* C17 · Efeito fotoelétrico e comportamento dual (base: Halliday vol. 4, cap. 38, com as minhas palavras). Conferido em Python (scratchpad mod.py), hc = 1240 eV·nm:
   corte césio 590 nm, sódio 539 nm, zinco 288 nm (funções trabalho aproximadas); sódio com 400 nm: K = 0,80 eV, v = 5,3 × 10⁵ m/s; fóton de 550 nm = 2,25 eV; laser de 1 mW: 2,8 × 10¹⁵ fótons/s;
   λ Compton = 2,43 pm; elétron de 100 V: λ = 0,123 nm; bola de 0,15 kg a 40 m/s: 1,1 × 10⁻³⁴ m; elétron confinado em 0,1 nm: Δv ≳ 5,8 × 10⁵ m/s; túnel (U − E = 1,7 eV, L = 750 pm): T ≈ 4,5 × 10⁻⁵. */
F.registrar("C17", {
  retoma: ["B14b", "C18"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Fótons e ondas de matéria",
      casos: [
        { nome: "Equação de Einstein", gerar: (p) => {
          const Ms = [["césio", 2.1], ["sódio", 2.3], ["zinco", 4.3]];
          const m = p ? Ms[1] : F.escolha(Ms), lam = p ? 400 : F.escolha([200, 250, 300, 400, 450, 500]), E = 1240 / lam, K = E - m[1];
          return { enun: R`<p>Luz de ${lam} nm ilumina ${m[0] === "zinco" ? "uma placa de zinco" : "uma placa de " + m[0]} (função trabalho $\varphi \approx ${F.n(m[1])}$ eV). Saem elétrons? Com que energia cinética máxima e qual o potencial de corte?</p>`, fig: "",
            passos: [
              R`<p>Energia de cada fóton: $E = hf = \frac{hc}{\lambda} = \frac{1240\text{ eV·nm}}{${lam}\text{ nm}} = ${F.n(E, 2)}$ eV.</p>`,
              K > 0 ? R`<p>Como $E > \varphi$, saem elétrons. Einstein: $K_\text{máx} = hf - \varphi = ${F.n(E, 2)} - ${F.n(m[1])} = ${F.n(K, 2)}$ eV.</p>` : R`<p>$E < \varphi$: <b>nenhum</b> elétron sai, por mais intensa que seja a luz. Cada fóton sozinho não tem energia para arrancar um elétron.</p>`,
              K > 0 ? R`<p>Potencial de corte: $eV_0 = K_\text{máx}$, então $V_0 = ${F.n(K, 2)}$ V (uma tensão contrária desse tamanho para todos os elétrons).</p>` : R`<p>O comprimento de onda de corte é $\frac{1240}{${F.n(m[1])}} \approx ${F.n(1240 / m[1], 0)}$ nm: só luz com $\lambda$ menor que isso arranca elétrons.</p>`,
            ] };
        } },
        { nome: "Comprimento de onda de de Broglie", gerar: (p) => {
          const V = p ? 100 : F.escolha([10, 50, 100, 1000, 10000]), lam = 6.626e-34 / Math.sqrt(2 * 9.109e-31 * V * 1.602e-19);
          return { enun: R`<p>Um elétron é acelerado do repouso por uma diferença de potencial de ${V} V. Qual o seu comprimento de onda de de Broglie?</p>`, fig: "",
            passos: [
              R`<p>Energia cinética: $K = eV = ${V}$ eV. Momento (não relativístico): $p = \sqrt{2mK}$.</p>`,
              R`<p>de Broglie: $\lambda = \frac hp = \frac{h}{\sqrt{2meV}}$ ${V >= 10000 ? "(a 10 kV o elétron já está a ~20% de c; a correção relativística ainda é de uns poucos %)" : ""}.</p>`,
              R`<p>$\lambda \approx ${F.n(lam * 1e9, 4)}$ nm. É do tamanho das distâncias entre átomos num cristal (~0,1 a 0,3 nm): por isso um feixe de elétrons sofre difração num cristal, como os raios X (Davisson e Germer, 1927), e por isso o microscópio eletrônico enxerga muito mais detalhe que o óptico.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O efeito Compton: o fóton como bola de bilhar",
      enun: R`<p>Um fóton de comprimento de onda $\lambda$ colide com um elétron em repouso e sai desviado de um ângulo $\phi$, com $\lambda'$. Usando conservação de energia e de momento <b>relativísticos</b> ${F.ret("C18")} (fóton: $E = pc = \frac{hc}{\lambda}$; elétron: $E^2 = (pc)^2 + (mc^2)^2$), mostre que</p>$$\lambda' - \lambda = \frac{h}{mc}(1 - \cos\phi).$$<p>Calcule $\frac{h}{mc}$ para o elétron e diga por que o efeito é fácil de ver com raios X e impossível de ver com luz visível.</p>`,
      fig: "",
      dicas: [R`<p>Momento: $\vec p_e = \vec p - \vec p\,{}'$, então $p_e^2 = p^2 + p'^2 - 2pp'\cos\phi$ (lei dos cossenos).</p>`, R`<p>Energia: $pc + mc^2 = p'c + E_e$, então $E_e^2 = (pc - p'c + mc^2)^2$. Iguale com $(p_ec)^2 + (mc^2)^2$ e simplifique.</p>`],
      sol: R`<p>(i) $(p - p' + mc)^2 = p_e^2 + m^2c^2$ (dividindo a energia por $c$).</p>
        <p>(ii) Expandindo a esquerda: $p^2 + p'^2 - 2pp' + 2mc(p - p') + m^2c^2$. Com $p_e^2 = p^2 + p'^2 - 2pp'\cos\phi$, sobra $-2pp' + 2mc(p - p') = -2pp'\cos\phi$.</p>
        <p>(iii) $mc(p - p') = pp'(1 - \cos\phi)$. Divida por $mc\,pp'$: $\frac1{p'} - \frac1p = \frac{1 - \cos\phi}{mc}$. Com $\frac1p = \frac\lambda h$: $\lambda' - \lambda = \frac{h}{mc}(1 - \cos\phi)$ ∎.</p>
        <p>(iv) $\frac{h}{mc} = 2{,}43$ pm. O desvio é no máximo $2\times2{,}43 = 4{,}9$ pm. Para raios X ($\lambda \sim 70$ pm), isso é uns 7%: mensurável (Compton, 1923, Nobel de 1927). Para luz visível (500 000 pm), é uma parte em cem mil: invisível. O efeito provou que o fóton carrega <b>momento</b>, não só energia.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Moderna · dualidade</div>
        <div class="q">Luz vermelha fortíssima não arranca nenhum elétron de uma placa de zinco. Luz ultravioleta fraquinha arranca na hora. Por quê?</div>
        <p>Se a luz fosse só uma onda, a intensidade (energia por segundo) é que importaria. Mas ela chega em pacotes, os <b>fótons</b>, e cada elétron absorve um pacote inteiro ou nada. Einstein explicou isso em 1905 (foi por isso que ganhou o Nobel, não pela relatividade). E em 1924 de Broglie virou a pergunta do avesso: se ondas podem ser partículas, partículas podem ser ondas?</p></div>`),

      F.secao("foton", "O fóton", R`
        ${F.formula(R`E = hf = \frac{hc}{\lambda},\qquad p = \frac{h}{\lambda},\qquad h = 6{,}626\times10^{-34}\text{ J·s},\qquad hc \approx 1240\text{ eV·nm}`, "Energia e momento do fóton")}
        <p>Um fóton de luz verde (550 nm) tem 2,25 eV: pouquíssimo. Um laser de 1 mW solta uns $3\times10^{15}$ fótons por segundo, tantos que a luz parece contínua. A energia vem em quantidades discretas ("quanta"), uma ideia que Planck introduziu em 1900 para explicar a radiação de corpo negro ${F.ret("C16")}.</p>`),

      F.secao("fotoeletrico", "O efeito fotoelétrico", R`
        ${F.formula(R`K_\text{máx} = hf - \varphi,\qquad eV_0 = K_\text{máx}`, "Equação de Einstein do fotoelétrico")}
        <p>$\varphi$ (função trabalho) é a energia mínima para arrancar um elétron do metal. $V_0$ é o potencial de corte: a tensão contrária que freia até os elétrons mais rápidos.</p>
        <div id="lab-foto"></div>
        <table class="tb"><tr><th>observação</th><th>onda clássica previa</th><th>fótons explicam</th></tr>
          <tr><td>existe uma frequência de corte $f_0 = \varphi/h$</td><td>qualquer cor, com intensidade suficiente</td><td>um fóton com $hf < \varphi$ não arranca ninguém</td></tr>
          <tr><td>$K_\text{máx}$ depende só de $f$</td><td>luz mais forte, elétrons mais rápidos</td><td>cada elétron recebe um fóton só, de energia $hf$</td></tr>
          <tr><td>intensidade muda o número de elétrons</td><td>—</td><td>mais fótons, mais elétrons</td></tr>
          <tr><td>emissão instantânea, mesmo com luz fraca</td><td>demoraria para "juntar" energia</td><td>o primeiro fóton já basta</td></tr></table>
        <p>O gráfico $K_\text{máx} \times f$ é uma reta de inclinação $h$ para <b>qualquer</b> metal (só muda o ponto de corte). Millikan, que não acreditava em fótons, mediu essa inclinação em 1916 tentando refutar Einstein e confirmou o valor de $h$. Aplicações: fotocélulas, sensores de câmera, painel solar (o primo do fotoelétrico dentro de um semicondutor).</p>`),

      F.secao("dual", "Ondas de matéria", R`
        ${F.formula(R`\lambda = \frac{h}{p}`, "Comprimento de onda de de Broglie")}
        <p>Elétrons, nêutrons, átomos e até moléculas grandes (fulerenos de 60 átomos) mostram interferência e difração. Um elétron de 100 eV tem $\lambda \approx 0{,}12$ nm, do tamanho de um átomo. Uma bola de beisebol tem $\lambda \sim 10^{-34}$ m: pequena demais para qualquer efeito. Na experiência de fenda dupla ${F.ret("B14b")} com elétrons um de cada vez, cada um chega à tela como um ponto (partícula), mas, depois de milhares, os pontos desenham franjas (onda). Tentar ver por qual fenda cada um passou destrói as franjas.</p>
        <h3>A interpretação</h3>
        <p>A onda associada à partícula ($\psi$, a "função de onda") não é feita de nada material: $|\psi|^2$ dá a <b>probabilidade</b> de achar a partícula em cada lugar (Born, 1926). A equação que a governa é a de Schrödinger ${F.ret("U06")}.</p>
        ${F.formula(R`\Delta x\,\Delta p \geq \frac{\hbar}{2},\qquad \hbar = \frac{h}{2\pi}`, "Princípio da incerteza (Heisenberg)")}
        <p>Não é falta de instrumento: uma onda bem localizada (pacote estreito) precisa de muitos comprimentos de onda misturados, ou seja, de muitos momentos. É o mesmo motivo de a fenda estreita espalhar mais a luz. Um elétron confinado num átomo ($\Delta x \sim 0{,}1$ nm) tem incerteza de velocidade de centenas de km/s: por isso ele não pode "cair" no núcleo.</p>
        <p><b>Efeito túnel</b>: uma partícula pode atravessar uma barreira de energia maior que a sua, com probabilidade $T \approx e^{-2bL}$, $b = \sqrt{\frac{8\pi^2m(U - E)}{h^2}}$. Muito sensível à largura $L$: é o princípio do microscópio de tunelamento (que "vê" átomos) e do decaimento alfa dos núcleos ${F.ret("C19")}.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Qual a energia (em eV e em J) de um fóton de 550 nm? Quantos fótons por segundo emite um laser verde de 1 mW?</p>`, fig: "", dicas: [R`<p>$E = 1240/550$ eV.</p>`, R`<p>Número $= P/E$ (com $E$ em joules).</p>`], resp: R`$2{,}25$ eV $= 3{,}6\times10^{-19}$ J; $\approx 2{,}8\times10^{15}$ fótons/s.`, sol: R`<p>$\frac{10^{-3}}{3{,}61\times10^{-19}} = 2{,}77\times10^{15}$. É por isso que, no dia a dia, a luz parece contínua.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Luz de 400 nm incide em sódio ($\varphi \approx 2{,}3$ eV). Calcule $K_\text{máx}$, o potencial de corte e a velocidade máxima dos elétrons.</p>`, fig: "", dicas: [R`<p>$hf = 3{,}10$ eV.</p>`, R`<p>$v = \sqrt{2K/m}$ com $K$ em joules.</p>`], resp: R`$K \approx 0{,}80$ eV; $V_0 \approx 0{,}80$ V; $v \approx 5{,}3\times10^5$ m/s.`, sol: R`<p>$0{,}80\times1{,}6\times10^{-19} = 1{,}28\times10^{-19}$ J; $v = \sqrt{2\cdot1{,}28\times10^{-19}/9{,}11\times10^{-31}} \approx 5{,}3\times10^5$ m/s.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Qual o comprimento de onda de corte do zinco ($\varphi \approx 4{,}3$ eV)? Luz visível arranca elétrons do zinco?</p>`, fig: "", dicas: [R`<p>$\lambda_0 = hc/\varphi$.</p>`, R`<p>O visível vai de 400 a 700 nm.</p>`], resp: R`$\lambda_0 \approx 288$ nm: não, só ultravioleta.`, sol: R`<p>É o experimento da abertura: luz vermelha fortíssima não faz nada; UV fraco descarrega um eletroscópio de zinco (Hertz e Hallwachs, 1887).</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Num experimento, $V_0 = 1{,}0$ V com luz de 400 nm e $V_0 = 0{,}38$ V com luz de 500 nm. Calcule $h$ (em eV·s) e a função trabalho.</p>`, fig: "", dicas: [R`<p>$eV_0 = hf - \varphi$: duas equações, duas incógnitas.</p>`, R`<p>$f_1 = 7{,}5\times10^{14}$ Hz, $f_2 = 6{,}0\times10^{14}$ Hz.</p>`], resp: R`$h \approx 4{,}1\times10^{-15}$ eV·s; $\varphi \approx 2{,}1$ eV.`, sol: R`<p>$h = \frac{1{,}0 - 0{,}38}{(7{,}5 - 6{,}0)\times10^{14}} = 4{,}13\times10^{-15}$ eV·s (o valor real é $4{,}14\times10^{-15}$). $\varphi = 4{,}13\times10^{-15}\cdot7{,}5\times10^{14} - 1{,}0 \approx 2{,}1$ eV (dados <b>ilustrativos</b>, do tipo de um césio).</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Qual o comprimento de onda de de Broglie de um elétron acelerado por 100 V? E de uma bola de 0,15 kg a 40 m/s?</p>`, fig: "", dicas: [R`<p>$\lambda = h/\sqrt{2meV}$.</p>`, R`<p>Para a bola, $\lambda = h/(mv)$.</p>`], resp: R`$\approx 0{,}123$ nm e $\approx 1{,}1\times10^{-34}$ m.`, sol: R`<p>A bola teria de passar por uma fenda $10^{19}$ vezes menor que um próton para mostrar difração.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Um elétron está confinado numa região de 0,1 nm (o tamanho de um átomo). Estime a menor incerteza na sua velocidade.</p>`, fig: "", dicas: [R`<p>$\Delta p \geq \frac{\hbar}{2\Delta x}$.</p>`, R`<p>$\Delta v = \Delta p/m$.</p>`], resp: R`$\Delta v \gtrsim 5{,}8\times10^5$ m/s.`, sol: R`<p>$\frac{1{,}055\times10^{-34}}{2\times10^{-10}\times9{,}11\times10^{-31}} \approx 5{,}8\times10^5$ m/s. Comparável à velocidade do elétron no modelo de Bohr (2,2 × 10⁶ m/s) ${F.ret("C17b")}: o confinamento <b>força</b> o elétron a se mexer.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Um elétron com $E = 5{,}1$ eV encontra uma barreira de $U = 6{,}8$ eV e largura 750 pm. Estime a probabilidade de tunelamento. E se a largura fosse metade?</p>`, fig: "", dicas: [R`<p>$b = \sqrt{8\pi^2m(U - E)}/h$; com $U - E = 1{,}7$ eV, $b \approx 6{,}7\times10^9$ m⁻¹.</p>`, R`<p>$T \approx e^{-2bL}$.</p>`], resp: R`$T \approx 4{,}5\times10^{-5}$; com metade da largura, $\approx 6{,}7\times10^{-3}$.`, sol: R`<p>$2bL \approx 10{,}0$, $T = e^{-10{,}0} \approx 4{,}5\times10^{-5}$. Com $L/2$, $T = \sqrt{4{,}5\times10^{-5}} \approx 6{,}7\times10^{-3}$: 150 vezes mais. Essa sensibilidade exponencial é o que permite ao microscópio de tunelamento medir alturas menores que um átomo.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-foto"); e.outerHTML = F.lab("Efeito fotoelétrico", "lab-foto"); SIM.fotoeletrico(document.getElementById("lab-foto"), F); },
});
