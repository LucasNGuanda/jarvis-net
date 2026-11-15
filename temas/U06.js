/* U06 · Equação de Schrödinger (com as minhas palavras). Conferido em Python:
   elétron em poço infinito de 1 nm: E₁ = 0,376 eV, E₂ = 1,504 eV, fóton 2→1: 1099 nm; poço de 0,1 nm: 37,6 eV; próton em 10 fm: 2,05 MeV;
   P(0 < x < L/4) no fundamental = 1/4 − 1/(2π) = 9,1%; superposição 1+2 (1 nm): oscila a 2,73 × 10¹⁴ Hz (período 3,67 fs);
   oscilador: ψ₀ = e^(−mωx²/2ħ) dá Hψ₀ = (ħω/2)ψ₀, ∫ψ₀² dx = √(πħ/(mω)). */
F.registrar("U06", {
  retoma: ["C17", "C17b", "U04", "matematica/CII02"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Partícula na caixa",
      casos: [
        { nome: "Níveis e cor da luz", gerar: (p) => {
          const L = p ? 1 : F.escolha([0.5, 0.8, 1, 1.5, 2]), E1 = 0.376 / (L * L), n = p ? 2 : F.escolha([2, 3, 4]), dE = (n * n - 1) * E1;
          return { enun: R`<p>Um elétron está preso num poço infinito de largura ${F.nt(L)} nm (um modelo grosseiro de uma molécula ou de um "ponto quântico"). Ache $E_1$, $E_${n}$ e o comprimento de onda do fóton emitido na transição $${n}\to1$.</p>`, fig: "",
            passos: [
              R`<p>$E_n = \frac{n^2h^2}{8mL^2}$. Para o elétron, $\frac{h^2}{8m} = 0{,}376$ eV·nm². Então $E_1 = \frac{0{,}376}{${F.n(L * L, 2)}} \approx ${F.n(E1, 3)}$ eV.</p>`,
              R`<p>$E_${n} = ${n * n}E_1 \approx ${F.n(n * n * E1, 3)}$ eV; $\Delta E \approx ${F.n(dE, 3)}$ eV.</p>`,
              R`<p>$\lambda = \frac{hc}{\Delta E} = \frac{1240\text{ eV·nm}}{${F.n(dE, 3)}\text{ eV}} \approx ${F.n(1240 / dE, 0)}$ nm ${1240 / dE > 700 ? "(infravermelho)" : 1240 / dE < 400 ? "(ultravioleta)" : "(visível!)"}. Caixa menor, níveis mais separados, luz mais azul: é assim que pontos quânticos de tamanhos diferentes brilham em cores diferentes (as TVs "QLED").</p>`,
            ] };
        } },
        { nome: "Superposição que balança", gerar: (p) => {
          const a = p ? 1 : F.escolha([1, 2]), b = p ? 2 : F.escolha([3, 4]), L = 1, dE = (b * b - a * a) * 0.376, f = dE / 4.1357e-15;
          return { enun: R`<p>Num poço de 1 nm, o elétron está na superposição $\psi = \frac{1}{\sqrt2}(\psi_${a} + \psi_${b})$. Com que frequência a densidade de probabilidade $|\psi|^2$ oscila? Qual o período?</p>`, fig: "",
            passos: [
              R`<p>Cada estado gira com fase $e^{-iE_nt/\hbar}$. Em $|\psi|^2$ aparece o termo cruzado $\psi_${a}\psi_${b}\cos\left(\frac{(E_${b} - E_${a})t}{\hbar}\right)$.</p>`,
              R`<p>$E_${b} - E_${a} = (${b * b} - ${a * a})\times0{,}376 \approx ${F.n(dE, 3)}$ eV; $f = \frac{\Delta E}{h} \approx ${F.n(f / 1e14, 2)}\times10^{14}$ Hz.</p>`,
              R`<p>Período $\approx ${F.n(1e15 / f, 2)}$ fs. A carga oscilando a essa frequência emite luz com essa mesma frequência: é a imagem quântica de um átomo emitindo.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O estado fundamental do oscilador",
      enun: R`<p>Para o oscilador harmônico quântico, $V = \frac12m\omega^2x^2$. (a) Teste a função $\psi_0(x) = A\,e^{-\alpha x^2}$ na equação de Schrödinger independente do tempo e ache o $\alpha$ que funciona. (b) Qual a energia? (c) Normalize (ache $A$). (d) Compare com a regra de Bohr–Sommerfeld da U04. Por que a energia mínima não é zero?</p>`,
      fig: "",
      dicas: [R`<p>(a) $\psi_0'' = (4\alpha^2x^2 - 2\alpha)\psi_0$. Os termos com $x^2$ têm de se cancelar sozinhos.</p>`, R`<p>(c) Integral gaussiana ${F.ret("matematica/CII02")}: $\int_{-\infty}^{\infty}e^{-ax^2}dx = \sqrt{\pi/a}$.</p>`],
      sol: R`<p><b>(a)</b> $-\frac{\hbar^2}{2m}(4\alpha^2x^2 - 2\alpha)\psi_0 + \frac12m\omega^2x^2\psi_0 = E\psi_0$. Termos em $x^2$: $-\frac{2\hbar^2\alpha^2}{m} + \frac12m\omega^2 = 0 \Rightarrow \alpha = \frac{m\omega}{2\hbar}$.</p>
        <p><b>(b)</b> Sobra $E = \frac{\hbar^2\alpha}{m} = \frac{\hbar\omega}{2}$.</p>
        <p><b>(c)</b> $\int A^2e^{-m\omega x^2/\hbar}dx = A^2\sqrt{\frac{\pi\hbar}{m\omega}} = 1 \Rightarrow A = \left(\frac{m\omega}{\pi\hbar}\right)^{1/4}$.</p>
        <p><b>(d)</b> A regra antiga dava $E_0 = 0$ (U04); a correta dá $\frac12\hbar\omega$. Com $E = 0$, a partícula estaria parada ($p = 0$) no fundo ($x = 0$): posição e momento perfeitamente definidos, o que a incerteza $\Delta x\,\Delta p \geq \hbar/2$ proíbe. A gaussiana é o meio-termo ótimo: para ela, $\Delta x\,\Delta p = \hbar/2$ exatamente. Essa energia de ponto zero é real: é por causa dela que o hélio não congela à pressão ambiente, nem perto do zero absoluto.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Universitária · mecânica quântica</div>
        <div class="q">Se o elétron é uma onda, qual é a equação dessa onda?</div>
        <p>De Broglie disse em 1924 que partículas têm comprimento de onda $\lambda = h/p$ ${F.ret("C17")}. Faltava a equação que diz como essa onda evolui. Schrödinger a encontrou no fim de 1925, nas férias, numa casa nos Alpes. Com ela, os níveis de Bohr ${F.ret("C17b")} deixaram de ser um postulado esquisito e viraram consequência: ondas presas só cabem em certos tamanhos, como as notas de uma corda de violão.</p></div>`),

      F.secao("equacao", "A equação", R`
        ${F.formula(R`i\hbar\frac{\partial\psi}{\partial t} = -\frac{\hbar^2}{2m}\frac{\partial^2\psi}{\partial x^2} + V(x)\,\psi\qquad\qquad |\psi(x, t)|^2\,dx = \text{probabilidade de achar a partícula em } dx`, "Equação de Schrödinger e regra de Born")}
        <p>De onde ela vem (não é uma dedução, é uma "adivinhação educada"): para uma onda livre $\psi = e^{i(kx - \omega t)}$, a física pede $E = \hbar\omega$ (Planck) e $p = \hbar k$ (de Broglie). Derivar no tempo puxa um $-i\omega$; derivar duas vezes em $x$, um $-k^2$. A equação acima é exatamente "$E = \frac{p^2}{2m} + V$" com $E \to i\hbar\,\partial_t$ e $p \to -i\hbar\,\partial_x$.</p>
        <p><b>O que é $\psi$?</b> Born (1926): $|\psi|^2$ é uma densidade de probabilidade. Por isso $\psi$ precisa ser <b>normalizada</b>: $\int|\psi|^2dx = 1$. E $\psi$ é complexa de verdade: o $i$ na equação não é enfeite.</p>
        ${F.caixa("pegadinha", R`<p><b>$\psi$ não é "o elétron espalhado"</b>. Quando você mede, acha o elétron inteiro num lugar só; $|\psi|^2$ diz a probabilidade de cada lugar. Repetindo a experiência muitas vezes, a distribuição dos resultados reproduz $|\psi|^2$ (o padrão de interferência na fenda dupla com elétrons, um de cada vez, é a prova mais bonita disso).</p>`)}`),

      F.secao("estacionarios", "Estados estacionários", R`
        ${F.formula(R`\psi(x, t) = \phi(x)\,e^{-iEt/\hbar}\qquad\qquad -\frac{\hbar^2}{2m}\phi'' + V\phi = E\phi`, "Equação independente do tempo")}
        <p>Separando variáveis ${F.ret("matematica/CII08")}, a parte espacial obedece à equação independente do tempo (um problema de autovalor: só certos $E$ dão soluções aceitáveis). Nesses estados, $|\psi|^2 = |\phi|^2$ não muda com o tempo: por isso se chamam <b>estacionários</b>, e por isso um elétron num nível de Bohr não irradia.</p>
        <p><b>Poço infinito</b> de largura $L$ ($V = 0$ dentro, $\infty$ fora): dentro, $\phi'' = -k^2\phi$, então $\phi = A\sin(kx)$; e $\phi$ tem de zerar nas paredes, então $kL = n\pi$. Daí:</p>
        ${F.formula(R`\phi_n(x) = \sqrt{\frac2L}\sin\frac{n\pi x}{L}\qquad\qquad E_n = \frac{n^2h^2}{8mL^2}\quad(n = 1, 2, 3, \dots)`, "Poço infinito")}
        <p>Para um elétron num poço de 1 nm: $E_1 = 0{,}376$ eV, $E_2 = 1{,}50$ eV. A transição $2\to1$ emite um fóton de 1099 nm (infravermelho próximo). Note que $E_1 \neq 0$: uma partícula presa nunca fica parada.</p>
        <div id="lab-poco"></div>
        ${F.caixa("fisico", R`<p><b>Superposição</b>: a equação é linear, então $\psi = c_1\psi_1 + c_2\psi_2$ também é solução. Mas agora as duas partes giram em ritmos diferentes, e $|\psi|^2$ ganha um termo que oscila com frequência $(E_2 - E_1)/h$: a nuvem balança de um lado para o outro. Na simulação, compare "um estado" (parado) com "superposição" (balançando). Medir a energia dá $E_1$ com probabilidade $|c_1|^2$ ou $E_2$ com $|c_2|^2$, nunca um valor intermediário.</p>`)}`),

      F.secao("alem", "Além da caixa", R`
        <ul><li><b>Oscilador harmônico</b>: $E_n = \left(n + \frac12\right)\hbar\omega$. Níveis igualmente espaçados (como Planck propôs), mais a energia de ponto zero. O estado fundamental é uma gaussiana (chefão). Modela vibrações de moléculas e, de forma surpreendente, cada modo do campo eletromagnético: os fótons são os "degraus" desse oscilador.</li>
          <li><b>Efeito túnel</b>: num degrau de potencial mais alto que $E$, a solução não zera, decai como $e^{-\kappa x}$ com $\kappa = \sqrt{2m(V - E)}/\hbar$. Se a barreira for fina, sobra um pouco do outro lado: a partícula atravessa uma parede que, classicamente, não conseguiria. Explica o decaimento alfa ${F.ret("C19")}, a fusão no Sol e o microscópio de tunelamento (que "vê" átomos).</li>
          <li><b>Átomo de hidrogênio</b>: em 3D, com $V = -\frac{ke^2}{r}$, a equação dá $E_n = -\frac{13{,}6\text{ eV}}{n^2}$, igual a Bohr, mas com as órbitas trocadas por orbitais ($s$, $p$, $d$…). É a base de toda a química.</li></ul>
        ${F.caixa("olimpiada", R`<p><b>Estimativa por incerteza</b>: para achar a ordem de grandeza da energia de uma partícula presa numa região $L$, use $p \sim \hbar/L$ e $E \sim \frac{p^2}{2m}$. Elétron num átomo ($L \sim 0{,}1$ nm): dezenas de eV. Próton num núcleo ($L \sim 10$ fm): alguns MeV. A razão de um milhão entre energias químicas e nucleares sai daí.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $E_1$ e $E_2$ para um elétron num poço infinito de 1 nm.</p>`, fig: "", dicas: [R`<p>$E_n = \frac{n^2h^2}{8mL^2}$, com $m = 9{,}11\times10^{-31}$ kg.</p>`, R`<p>Divida por $1{,}602\times10^{-19}$ para ter em eV.</p>`], resp: R`$E_1 \approx 0{,}376$ eV, $E_2 \approx 1{,}50$ eV.`, sol: R`<p>$\frac{(6{,}626\times10^{-34})^2}{8\cdot9{,}11\times10^{-31}\cdot10^{-18}} \approx 6{,}02\times10^{-20}$ J $= 0{,}376$ eV.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Qual o comprimento de onda do fóton emitido na transição $2\to1$ do poço de 1 nm? Que tipo de luz é?</p>`, fig: "", dicas: [R`<p>$\Delta E = 3E_1$.</p>`, R`<p>$\lambda = \frac{1240\text{ eV·nm}}{\Delta E}$.</p>`], resp: R`$\approx 1099$ nm: infravermelho próximo.`, sol: R`<p>$\Delta E = 1{,}128$ eV. É a faixa usada em fibra óptica e controles remotos.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Se o poço tiver 0,1 nm (o tamanho de um átomo), quanto vale $E_1$? Compare com a energia de ionização do hidrogênio.</p>`, fig: "", dicas: [R`<p>$E \propto 1/L^2$.</p>`, R`<p>10 vezes menor → 100 vezes mais energia.</p>`], resp: R`$\approx 37{,}6$ eV: mesma ordem de grandeza dos 13,6 eV.`, sol: R`<p>Um modelo tosco (caixa quadrada no lugar do potencial de Coulomb) já acerta a escala da energia atômica.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Normalize $\phi(x) = A\sin(\pi x/L)$ no intervalo $[0, L]$.</p>`, fig: "", dicas: [R`<p>$\int_0^L\sin^2\frac{\pi x}{L}dx$.</p>`, R`<p>A média de $\sin^2$ num número inteiro de meias ondas é $\frac12$.</p>`], resp: R`$A = \sqrt{2/L}$.`, sol: R`<p>$A^2\cdot\frac{L}{2} = 1$. O mesmo vale para todo $n$.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>No estado fundamental do poço, qual a probabilidade de achar a partícula no primeiro quarto, $0 < x < L/4$? Classicamente (velocidade constante), quanto seria?</p>`, fig: "", dicas: [R`<p>$\int_0^{L/4}\frac2L\sin^2\frac{\pi x}{L}dx$, use $\sin^2 u = \frac{1 - \cos2u}{2}$.</p>`, R`<p>Classicamente, cada trecho tem probabilidade proporcional ao comprimento.</p>`], resp: R`$\frac14 - \frac{1}{2\pi} \approx 9{,}1\%$; classicamente, 25%.`, sol: R`<p>No estado fundamental, a partícula prefere o meio. Para $n$ grande, $|\phi_n|^2$ oscila tão rápido que a média volta a ser uniforme: o <b>princípio da correspondência</b>.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>No poço de 1 nm, o elétron está em $\frac{1}{\sqrt2}(\psi_1 + \psi_2)$. Com que frequência $|\psi|^2$ oscila? Qual o período? Se você medir a energia, o que pode dar?</p>`, fig: "", dicas: [R`<p>$f = (E_2 - E_1)/h$.</p>`, R`<p>$h = 4{,}136\times10^{-15}$ eV·s.</p>`], resp: R`$f \approx 2{,}73\times10^{14}$ Hz, período $\approx 3{,}67$ fs; a medida dá $E_1$ ou $E_2$, com 50% cada.`, sol: R`<p>A frequência de oscilação é a mesma do fóton da transição (1099 nm). A energia média é $\frac{E_1 + E_2}{2} = 0{,}94$ eV, mas nenhuma medida dá esse valor.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Modele um próton num núcleo como uma partícula num poço infinito de 10 fm. Qual a ordem de grandeza de $E_1$? Compare com o elétron no átomo.</p>`, fig: "", dicas: [R`<p>Mesma fórmula, com $m_p = 1{,}67\times10^{-27}$ kg e $L = 10^{-14}$ m.</p>`, R`<p>Massa ~1836 vezes maior, caixa 10⁴ vezes menor.</p>`], resp: R`$\approx 2$ MeV: um milhão de vezes as energias atômicas.`, sol: R`<p>$E \propto \frac{1}{mL^2}$: $\frac{10^8}{1836} \approx 5\times10^4$ vezes os 37,6 eV de um elétron em 0,1 nm $\approx 2$ MeV. É a escala das energias nucleares ${F.ret("C19")}, e explica por que uma reação nuclear libera milhões de vezes mais energia que uma química.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-poco"); e.outerHTML = F.lab("Poço infinito e superposição", "lab-poco"); SIM.poco(document.getElementById("lab-poco"), F); },
});
