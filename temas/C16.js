/* C16 · Física quântica: corpo negro, Planck e a quantização (base: Halliday vol. 4, cap. 38, e conhecimento geral, com as minhas palavras).
   Conferido em Python (scratchpad nuc.py): Wien b = 2,898 × 10⁻³ m·K: 3000 K → 966 nm, 5772 K → 502 nm, 310 K → 9,3 μm, 2,725 K → 1,06 mm;
   Sol: σT⁴ = 6,3 × 10⁷ W/m², total 3,83 × 10²⁶ W; corpo humano (1,8 m², 310 K em ambiente de 293 K): perda líquida ≈ 190 W; ∫x³/(eˣ − 1) = π⁴/15 = 6,494. */
F.registrar("C16", {
  retoma: ["matematica/CE01", "matematica/CE02"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Corpo negro nos números",
      casos: [
        { nome: "Lei de Wien", gerar: (p) => {
          const casos = [["o filamento de uma lâmpada", 3000], ["a superfície do Sol", 5772], ["a estrela Sirius", 9940], ["o corpo humano", 310], ["a radiação cósmica de fundo", 2.725]];
          const [nome, T] = p ? casos[1] : F.escolha(casos), lam = 2.898e-3 / T;
          const txt = lam < 380e-9 ? "ultravioleta" : lam < 750e-9 ? "visível" : lam < 1e-3 ? "infravermelho" : "micro-ondas";
          return { enun: R`<p>Em que comprimento de onda fica o pico da radiação de ${nome} ($T \approx ${F.n(T, 3)}$ K)?</p>`, fig: "",
            passos: [
              R`<p>Lei de Wien: $\lambda_\text{máx}T = b = 2{,}898\times10^{-3}$ m·K (ela sai da W de Lambert ${F.ret("matematica/CE01")}).</p>`,
              R`<p>$\lambda_\text{máx} = \frac{2{,}898\times10^{-3}}{${F.n(T, 3)}} \approx ${lam > 1e-4 ? F.n(lam * 1000, 2) + "\\ \\text{mm}" : lam > 1e-6 ? F.n(lam * 1e6, 2) + "\\ \\mu\\text{m}" : F.n(lam * 1e9, 0) + "\\ \\text{nm}"}$: <b>${txt}</b>.</p>`,
              R`<p>${T < 1000 ? "Por isso câmeras térmicas enxergam pessoas no escuro: nós brilhamos, mas no infravermelho." : T < 4000 ? "A maior parte da energia de uma lâmpada incandescente vai para o infravermelho: ela é mais aquecedor que lâmpada." : "Quanto mais quente, mais azul: estrelas avermelhadas são frias, azuladas são quentes."}</p>`,
            ] };
        } },
        { nome: "Stefan–Boltzmann", gerar: (p) => {
          const T1 = p ? 5772 : F.escolha([3000, 5772, 10000]), f = p ? 2 : F.escolha([2, 3, 0.5]);
          return { enun: R`<p>Uma estrela tem superfície a ${T1} K. Se a temperatura fosse multiplicada por ${F.n(f)} (com o mesmo raio), por quanto se multiplicaria a potência irradiada?</p>`, fig: "",
            passos: [
              R`<p>Stefan–Boltzmann: $P = \sigma AT^4$, com $\sigma = 5{,}67\times10^{-8}$ W/(m²·K⁴).</p>`,
              R`<p>Com a mesma área: $\frac{P'}{P} = \left(\frac{T'}{T}\right)^4 = ${F.n(f)}^4 = ${F.n(f ** 4, 4)}$.</p>`,
              R`<p>O $T^4$ é brutal: um pouco mais quente já brilha muito mais. A constante vem da integral $\int_0^\infty\frac{x^3}{e^x - 1}dx = \frac{\pi^4}{15}$ ${F.ret("matematica/CE02")}.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "De onde vem a fórmula de Planck",
      enun: R`<p>Numa cavidade, cada "modo" de vibração da onda eletromagnética funciona como um oscilador de frequência $f$. (a) Pela física clássica (equipartição), cada oscilador tem energia média $kT$, qualquer que seja $f$. Mostre que isso dá energia infinita, já que o número de modos cresce sem limite com $f$. (b) Planck supôs que a energia de cada oscilador só pode ser $0, hf, 2hf, 3hf, \dots$, com probabilidade proporcional a $e^{-E/kT}$ (Boltzmann ${F.ret("matematica/CII06")}). Mostre que a energia média vira $\bar E = \frac{hf}{e^{hf/kT} - 1}$. (c) Mostre que, para $hf \ll kT$, ela volta a ser $kT$, e que, para $hf \gg kT$, cai exponencialmente. Por que isso "cura" a catástrofe?</p>`,
      fig: "",
      dicas: [R`<p>(b) $\bar E = \frac{\sum_n nhf\,x^n}{\sum_nx^n}$ com $x = e^{-hf/kT}$. As duas somas saem da série geométrica ${F.ret("matematica/CII03")}: $\sum x^n = \frac1{1 - x}$ e $\sum nx^n = \frac{x}{(1 - x)^2}$ (derive a primeira).</p>`, R`<p>(c) Para $u = hf/kT$ pequeno, $e^u - 1 \approx u$ (Taylor ${F.ret("matematica/CII04")}).</p>`],
      sol: R`<p><b>(a)</b> O número de modos por intervalo de frequência cresce como $f^2$. Com $kT$ cada, a energia por frequência cresce como $f^2$ e a integral até o infinito diverge: a "catástrofe do ultravioleta" (Rayleigh–Jeans, a curva tracejada do laboratório).</p>
        <p><b>(b)</b> $\bar E = hf\frac{x/(1 - x)^2}{1/(1 - x)} = \frac{hf\,x}{1 - x} = \frac{hf}{1/x - 1} = \frac{hf}{e^{hf/kT} - 1}$ ∎.</p>
        <p><b>(c)</b> $hf \ll kT$: $e^u - 1 \approx u$ e $\bar E \approx kT$ (clássico). $hf \gg kT$: $\bar E \approx hf\,e^{-hf/kT}$, que vai a zero. Os modos de alta frequência ficam "congelados": a energia térmica $kT$ não é suficiente para pagar nem um pacote $hf$. Somando com o número de modos, sai a lei de Planck, e a energia total fica finita, proporcional a $T^4$.</p>
        <p class="det" style="color:var(--ink2)">Planck chamou isso de "ato de desespero" (1900). Ele não acreditava que a energia fosse realmente em pacotes; quem levou a ideia a sério foi Einstein, em 1905, com o fóton ${F.ret("C17")}.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Moderna · física quântica</div>
        <div class="q">Por que um ferro aquecido fica primeiro vermelho, depois laranja, depois branco, e nunca verde?</div>
        <p>Todo corpo quente emite luz de todas as cores, mas com um pico que depende da temperatura. Explicar a forma dessa curva foi o problema que quebrou a física clássica: a teoria previa energia infinita. Planck consertou com uma hipótese radical, a de que a energia vem em pacotes. Assim nasceu a física quântica, em 14 de dezembro de 1900.</p></div>`),

      F.secao("corpo", "Radiação de corpo negro", R`
        <p>Um <b>corpo negro</b> absorve toda a luz que chega nele e emite um espectro que só depende da temperatura (não do material). Bons exemplos: um pequeno furo numa cavidade quente, o Sol, a radiação cósmica de fundo.</p>
        <div id="lab-cn"></div>
        ${F.formula(R`I(\lambda, T) = \frac{2hc^2}{\lambda^5}\cdot\frac{1}{e^{hc/\lambda kT} - 1}`, "Lei de Planck")}
        ${F.formula(R`\lambda_\text{máx}T = 2{,}898\times10^{-3}\text{ m·K}\qquad\qquad P = \sigma AT^4,\ \ \sigma = 5{,}67\times10^{-8}\ \tfrac{\text{W}}{\text{m}^2\text{K}^4}`, "Leis de Wien e de Stefan–Boltzmann")}
        <p>As duas saem da fórmula de Planck: Wien, achando o máximo (a equação dá $x = 5 + W(-5e^{-5})$, ${F.ret("matematica/CE01")}); Stefan, integrando em todos os $\lambda$ (aparece $\Gamma(4)\zeta(4) = \frac{\pi^4}{15}$, ${F.ret("matematica/CE02")}).</p>
        <table class="tb"><tr><th>objeto</th><th>T</th><th>pico</th></tr><tr><td>radiação cósmica de fundo</td><td>2,725 K</td><td>1,06 mm (micro-ondas)</td></tr><tr><td>corpo humano</td><td>310 K</td><td>9,3 μm (infravermelho)</td></tr><tr><td>lâmpada incandescente</td><td>3000 K</td><td>966 nm (infravermelho próximo)</td></tr><tr><td>Sol</td><td>5772 K</td><td>502 nm (visível)</td></tr></table>
        ${F.caixa("fisico", R`<p><b>Você irradia uns 940 W</b> (1,8 m² de pele a 310 K), mas também absorve das paredes a 20 °C: a perda líquida fica perto de 190 W. É por isso que uma sala com paredes frias dá sensação de frio mesmo com o ar quente.</p>`)}`),

      F.secao("quanta", "A hipótese de Planck e o que ela mudou", R`
        ${F.formula(R`E = nhf,\quad n = 0, 1, 2, \dots\qquad\qquad h = 6{,}626\times10^{-34}\text{ J·s}`, "Quantização da energia (Planck, 1900)")}
        <p>Para uma frequência $f$, a energia não varia continuamente: ela sobe em degraus de $hf$. Em escala humana, $h$ é tão pequeno que os degraus são invisíveis (uma mola de 1 Hz tem degraus de $6\times10^{-34}$ J). Em escala atômica, são decisivos.</p>
        <p>Os grandes passos que vieram depois:</p>
        <ul><li><b>1905</b>: Einstein, o fóton e o efeito fotoelétrico ${F.ret("C17")}.</li>
          <li><b>1907</b>: Einstein explica por que o calor específico dos sólidos cai a baixas temperaturas (vibrações quantizadas).</li>
          <li><b>1913</b>: Bohr e os níveis do átomo ${F.ret("C17b")}.</li>
          <li><b>1924</b>: de Broglie, ondas de matéria.</li>
          <li><b>1925–1926</b>: Heisenberg e Schrödinger, a mecânica quântica completa ${F.ret("U06")}.</li></ul>
        <h3>Ideias que valem para todo o resto</h3>
        <ul><li><b>Estados e probabilidades</b>: a teoria dá probabilidades de cada resultado, não o resultado.</li>
          <li><b>Quantização</b>: sistemas presos (elétron num átomo, partícula numa caixa) só têm certas energias. Sistemas livres podem ter qualquer energia.</li>
          <li><b>Superposição</b>: um sistema pode estar numa combinação de estados até ser medido (gato de Schrödinger, qubits).</li>
          <li><b>Princípio da correspondência</b>: para números quânticos grandes, tudo volta a ser clássico.</li></ul>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Qual o comprimento de onda do pico de emissão do Sol ($T = 5772$ K) e do corpo humano ($T = 310$ K)?</p>`, fig: "", dicas: [R`<p>$\lambda = b/T$.</p>`, R`<p>$b = 2{,}898\times10^{-3}$ m·K.</p>`], resp: R`Sol $\approx 502$ nm; corpo $\approx 9{,}3$ μm.`, sol: R`<p>Repare que o pico do Sol cai bem no meio do visível: nossos olhos evoluíram para a luz que existe.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule a potência total do Sol (raio $6{,}96\times10^8$ m, $T = 5772$ K) supondo corpo negro.</p>`, fig: "", dicas: [R`<p>$P = \sigma\cdot4\pi R^2\cdot T^4$.</p>`, R`<p>$\sigma T^4 \approx 6{,}3\times10^7$ W/m².</p>`], resp: R`$\approx 3{,}8\times10^{26}$ W.`, sol: R`<p>$6{,}3\times10^7\times4\pi(6{,}96\times10^8)^2 \approx 3{,}83\times10^{26}$ W, o valor medido. A hipótese de corpo negro funciona muito bem para estrelas.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Uma estrela vermelha tem $T = 3000$ K e o mesmo tamanho do Sol. Quantas vezes menos ela brilha?</p>`, fig: "", dicas: [R`<p>$P \propto T^4$.</p>`, R`<p>$(5772/3000)^4$.</p>`], resp: R`$\approx 13{,}7$ vezes menos.`, sol: R`<p>$1{,}924^4 \approx 13{,}7$. Por isso as estrelas mais comuns da galáxia (anãs vermelhas) não são visíveis a olho nu.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Calcule a razão $\frac{hf}{kT}$ para luz de 500 nm à temperatura ambiente (300 K). O que isso diz sobre a chance de uma parede emitir luz visível?</p>`, fig: "", dicas: [R`<p>$hf = hc/\lambda$.</p>`, R`<p>Fator de Boltzmann $e^{-hf/kT}$.</p>`], resp: R`$\frac{hf}{kT} \approx 96$; fator $e^{-96} \approx 10^{-42}$.`, sol: R`<p>Praticamente nenhum fóton visível: é por isso que objetos à temperatura ambiente não brilham no escuro. É o "congelamento" dos modos de alta frequência do chefão.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma mola de 1 Hz e um átomo emitindo luz de 500 nm. Compare o tamanho do "degrau" de energia $hf$ nos dois casos.</p>`, fig: "", dicas: [R`<p>$hf$ com $f = 1$ Hz e com $f = c/\lambda$.</p>`, R`<p>Converta para eV.</p>`], resp: R`Mola: $6{,}6\times10^{-34}$ J ($4\times10^{-15}$ eV); luz: $4\times10^{-19}$ J (2,5 eV).`, sol: R`<p>Um bilhão de bilhões de vezes de diferença. A energia de uma mola de verdade (~1 J) corresponde a $n \sim 10^{33}$ degraus: impossível notar a quantização. Princípio da correspondência em ação.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>A radiação cósmica de fundo está a 2,725 K. Qual o pico dela? Qual a energia típica dos fótons (em eV, use $\sim2{,}7kT$)?</p>`, fig: "", dicas: [R`<p>Wien.</p>`, R`<p>$k = 8{,}62\times10^{-5}$ eV/K.</p>`], resp: R`Pico $\approx 1{,}06$ mm (micro-ondas); $\sim6\times10^{-4}$ eV.`, sol: R`<p>É a "luz" do universo de 380 mil anos de idade, esticada pela expansão por um fator ~1100 ${F.ret("C21")}. Parte do chiado de uma TV analógica fora do ar vinha dela.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Mostre que a lei de Planck, para $\lambda$ grande ($hc/\lambda \ll kT$), vira a de Rayleigh–Jeans, $I \approx \frac{2ckT}{\lambda^4}$.</p>`, fig: "", dicas: [R`<p>Com $u = \frac{hc}{\lambda kT}$ pequeno, $e^u - 1 \approx u$.</p>`, R`<p>Substitua e simplifique.</p>`], resp: R`$I \approx \frac{2hc^2}{\lambda^5}\cdot\frac{\lambda kT}{hc} = \frac{2ckT}{\lambda^4}$.`, sol: R`<p>O $h$ cancela: no limite clássico, a constante de Planck desaparece da fórmula. É um teste que toda teoria nova precisa passar.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-cn"); e.outerHTML = F.lab("Corpo negro: Planck × catástrofe do ultravioleta", "lab-cn"); SIM.corponegro(document.getElementById("lab-cn"), F); },
});
