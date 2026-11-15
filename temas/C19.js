/* C19 · Física nuclear (base: Halliday vol. 4, cap. 42, com as minhas palavras). Conferido em Python (scratchpad nuc.py), u = 931,494 MeV:
   B(⁴He) = 28,3 MeV (7,07 MeV/núcleon); B/A(⁵⁶Fe) = 8,79; B/A(²³⁸U) = 7,57; R = 1,2 A^(1/3) fm: Fe 4,6 fm, U 7,4 fm; densidade nuclear ≈ 2,3 × 10¹⁷ kg/m³;
   ¹⁴C (5730 anos): 25% → 11 460 anos, 10% → 19 000 anos; ¹³¹I (8,04 d) de 600 Bq: 82,6 Bq após 23 dias; Q do alfa do ²³⁸U = 4,27 MeV; exemplo 42-4 do Halliday: T½ ≈ 25 min. */
F.registrar("C19", {
  retoma: ["C18", "C17"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Decaimento e energia de ligação",
      casos: [
        { nome: "Meia-vida", gerar: (p) => {
          const casos = [["iodo-131", 8.04, "dias"], ["cobalto-60", 5.27, "anos"], ["carbono-14", 5730, "anos"], ["radônio-222", 3.82, "dias"]];
          const [n, T, u] = p ? casos[0] : F.escolha(casos), k = p ? 3 : F.escolha([2, 3, 4, 5]), t = k * T + (p ? 0 : F.escolha([0, T / 2]));
          const frac = Math.pow(0.5, t / T);
          return { enun: R`<p>Uma amostra de ${n} (meia-vida de ${F.nt(T)} ${u}) tem atividade de 800 Bq. Qual a atividade depois de ${F.nt(t, 2)} ${u}?</p>`, fig: "",
            passos: [
              R`<p>A atividade cai à metade a cada meia-vida: $R = R_0\left(\frac12\right)^{t/T_{1/2}}$.</p>`,
              R`<p>$\frac{t}{T_{1/2}} = \frac{${F.n(t, 2)}}{${F.n(T)}} = ${F.n(t / T, 2)}$ meias-vidas.</p>`,
              R`<p>$R = 800\times2^{-${F.n(t / T, 2)}} \approx ${F.n(800 * frac, 1)}$ Bq. Equivalente: $R = R_0e^{-\lambda t}$ com $\lambda = \frac{\ln2}{T_{1/2}}$.</p>`,
            ] };
        } },
        { nome: "Energia de ligação", gerar: (p) => {
          const casos = [["⁴He", 2, 2, 4.002603], ["¹²C", 6, 6, 12.0], ["⁵⁶Fe", 26, 30, 55.934936], ["²³⁸U", 92, 146, 238.050788]];
          const [n, Z, N, M] = p ? casos[0] : F.escolha(casos), dm = Z * 1.007825 + N * 1.008665 - M, B = dm * 931.494;
          return { enun: R`<p>Calcule a energia de ligação total e por núcleon do ${n} (massa atômica ${F.nt(M, 6)} u).</p>`, fig: "",
            passos: [
              R`<p>Massa das peças separadas: ${Z} átomos de hidrogênio ($1{,}007825$ u cada, que já incluem os elétrons) + ${N} nêutrons ($1{,}008665$ u): $${F.n(Z * 1.007825 + N * 1.008665, 6)}$ u.</p>`,
              R`<p>Defeito de massa: $\Delta m = ${F.n(dm, 6)}$ u. O núcleo pesa <b>menos</b> que as peças: essa massa "sumiu" como energia de ligação.</p>`,
              R`<p>$B = \Delta m\cdot931{,}5\ \text{MeV/u} = ${F.n(B, 1)}$ MeV; por núcleon, $${F.n(B / (Z + N), 3)}$ MeV.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Datação: quantos anos tem o osso?",
      enun: R`<p>Seres vivos mantêm a mesma razão ¹⁴C/¹²C da atmosfera (cerca de $1{,}2\times10^{-12}$). Ao morrer, o ¹⁴C decai (meia-vida 5730 anos) e não é reposto. (a) Um osso tem 25% da atividade de ¹⁴C de um osso atual. Qual a idade? (b) E com 10%? (c) A medida tem incerteza de 2% na atividade relativa (por exemplo, $10\% \pm 0{,}2\%$). Qual a incerteza na idade? Use a derivada ${F.ret("matematica/CI04")}. (d) Por que o carbono-14 não serve para datar dinossauros?</p>`,
      fig: "",
      dicas: [R`<p>$t = \frac{T_{1/2}}{\ln2}\ln\frac{R_0}{R}$.</p>`, R`<p>(c) $\frac{dt}{d(R/R_0)} = -\frac{T_{1/2}}{\ln2}\cdot\frac{1}{R/R_0}$.</p>`],
      sol: R`<p><b>(a)</b> 25% = duas meias-vidas: 11 460 anos.</p>
        <p><b>(b)</b> $t = \frac{5730}{0{,}693}\ln10 \approx 19\,000$ anos.</p>
        <p><b>(c)</b> $\Delta t = \frac{T_{1/2}}{\ln2}\cdot\frac{\Delta(R/R_0)}{R/R_0} = 8267\times\frac{0{,}2}{10} \approx 165$ anos. A incerteza relativa da atividade (2%) vira uma incerteza absoluta fixa na idade (~165 anos), que fica proporcionalmente pequena para amostras velhas, até a atividade ficar fraca demais para medir.</p>
        <p><b>(d)</b> Dinossauros têm mais de 66 milhões de anos: mais de 11 000 meias-vidas. Sobraria $2^{-11\,000}$ do ¹⁴C, nada. Para rochas antigas usam-se núcleos de meia-vida longa (urânio-238 → chumbo, 4,5 bilhões de anos; potássio-40 → argônio, 1,25 bilhão).</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Moderna · núcleo</div>
        <div class="q">O núcleo tem prótons, que se repelem com força enorme a $10^{-15}$ m de distância. Por que ele não explode?</div>
        <p>Porque existe uma força ainda mais forte, a <b>força nuclear forte</b>, que age entre prótons e nêutrons, mas só a distâncias de núcleo. O equilíbrio entre ela e a repulsão elétrica decide quais núcleos existem, quais decaem e quanta energia guardam. É a física das estrelas, das usinas, da medicina nuclear e da datação.</p></div>`),

      F.secao("nucleo", "O núcleo", R`
        <p>Notação: $^A_Z\text{X}$, com $Z$ prótons (número atômico, define o elemento) e $A = Z + N$ núcleons (número de massa). Isótopos têm o mesmo $Z$ e $N$ diferente (¹²C e ¹⁴C).</p>
        ${F.formula(R`R \approx R_0A^{1/3},\qquad R_0 \approx 1{,}2\text{ fm}\ (1\text{ fm} = 10^{-15}\text{ m})`, "Raio nuclear")}
        <p>$R \propto A^{1/3}$ quer dizer volume $\propto A$: os núcleons ficam encostados como bolinhas num saco, com densidade quase igual em todos os núcleos, $\approx 2\times10^{17}$ kg/m³. Uma colher de chá de matéria nuclear pesaria um bilhão de toneladas (é do que são feitas as estrelas de nêutrons). Rutherford descobriu o núcleo em 1911, espalhando partículas alfa numa folha de ouro.</p>
        <p><b>Força forte</b>: atrativa, de curto alcance (~2 fm), quase a mesma entre p–p, p–n e n–n. Por isso núcleos grandes precisam de mais nêutrons que prótons (eles "colam" sem repelir): o vale de estabilidade se curva para $N > Z$.</p>`),

      F.secao("ligacao", "Energia de ligação", R`
        ${F.formula(R`B = \left(Zm_\text{H} + Nm_n - M_\text{átomo}\right)c^2,\qquad 1\text{ u}\cdot c^2 = 931{,}5\text{ MeV}`, "Energia de ligação (pelo defeito de massa)")}
        <p>O núcleo pesa menos que a soma das suas peças, e a diferença é a energia que seria preciso fornecer para desmontá-lo ($E = mc^2$, ${F.ret("C18")}). Para o ⁴He: 28,3 MeV, uns 7 MeV por núcleon, milhões de vezes as energias químicas (eV).</p>
        <div id="lab-lig"></div>
        <p>A curva explica as duas fontes de energia nuclear ${F.ret("C19b")}: núcleos leves ganham energia se fundindo (subindo pela esquerda); pesados, se partindo (subindo pela direita). O ferro-56 está perto do topo: dali não se tira mais nada, e é onde as estrelas grandes param de produzir energia antes de explodir.</p>`),

      F.secao("decaimento", "Decaimento radioativo", R`
        ${F.formula(R`N(t) = N_0e^{-\lambda t},\qquad R = \lambda N,\qquad T_{1/2} = \frac{\ln2}{\lambda}`, "Lei do decaimento")}
        <p>Cada núcleo instável tem uma probabilidade fixa por segundo, $\lambda$, de decair, sem "envelhecer". Daí a EDO $\dot N = -\lambda N$ ${F.ret("matematica/CII08")} e a exponencial. A atividade $R$ se mede em becquerel (1 Bq = 1 decaimento/s). Num gráfico de $\ln R$ contra $t$, os pontos caem numa reta de inclinação $-\lambda$: é assim que o Halliday tira a meia-vida do iodo-128 no exemplo 42-4 (≈ 25 min).</p>
        <div id="lab-dec"></div>
        <table class="tb"><tr><th>tipo</th><th>o que sai</th><th>o que muda</th><th>exemplo</th></tr>
          <tr><td>α</td><td>núcleo de ⁴He</td><td>$Z - 2$, $A - 4$</td><td>$^{238}\text{U} \to {^{234}\text{Th}} + \alpha$ (Q = 4,27 MeV)</td></tr>
          <tr><td>β⁻</td><td>elétron + antineutrino</td><td>um nêutron vira próton: $Z + 1$</td><td>$^{14}\text{C} \to {^{14}\text{N}} + e^- + \bar\nu$</td></tr>
          <tr><td>β⁺</td><td>pósitron + neutrino</td><td>um próton vira nêutron: $Z - 1$</td><td>usado no exame PET</td></tr>
          <tr><td>γ</td><td>fóton de alta energia</td><td>só desexcita o núcleo</td><td>cobalto-60 (radioterapia)</td></tr></table>
        <p>O decaimento α é um efeito túnel ${F.ret("C17")}: a partícula alfa atravessa a barreira de Coulomb. Pequenas diferenças de energia mudam a meia-vida em dezenas de ordens de grandeza (de microssegundos a bilhões de anos). No β, a energia sai dividida com um neutrino invisível; foi assim que Pauli previu o neutrino (1930), detectado só em 1956.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Qual o raio do núcleo de ferro-56 e o de urânio-238? Compare com o raio do átomo (~0,1 nm).</p>`, fig: "", dicas: [R`<p>$R = 1{,}2A^{1/3}$ fm.</p>`, R`<p>$56^{1/3} \approx 3{,}83$.</p>`], resp: R`Fe $\approx 4{,}6$ fm; U $\approx 7{,}4$ fm. O átomo é ~20 000 vezes maior.`, sol: R`<p>Se o núcleo fosse uma bola de gude, o átomo seria um estádio de futebol. Quase toda a massa está no núcleo, e quase todo o volume é vazio.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule a energia de ligação por núcleon do ⁴He (massa 4,002603 u).</p>`, fig: "", dicas: [R`<p>$2m_\text{H} + 2m_n = 4{,}032980$ u.</p>`, R`<p>$\Delta m\times931{,}5$.</p>`], resp: R`$\approx 7{,}07$ MeV/núcleon (28,3 MeV no total).`, sol: R`<p>$\Delta m = 0{,}030377$ u, $B = 28{,}3$ MeV. O ⁴He é extraordinariamente estável (ponto fora da curva no laboratório): por isso a radiação α é um "pacote" de ⁴He já pronto.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Uma amostra de iodo-131 ($T_{1/2} = 8{,}04$ dias) tem 600 Bq no dia 1º de janeiro. Quanto terá no dia 24? (Teste 2 do Halliday: decida primeiro, sem conta, se é "um pouco mais" ou "um pouco menos" que 75 Bq.)</p>`, fig: "", dicas: [R`<p>23 dias são um pouco menos que 3 meias-vidas (24,1 dias).</p>`, R`<p>$600\times2^{-23/8{,}04}$.</p>`], resp: R`$\approx 83$ Bq, um pouco mais que 75.`, sol: R`<p>Três meias-vidas dariam exatamente 75 Bq; como passou um pouco menos de tempo, sobra um pouco mais.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Complete os decaimentos: (a) $^{226}_{88}\text{Ra} \to\ ? + \alpha$; (b) $^{60}_{27}\text{Co} \to\ ? + e^- + \bar\nu$; (c) $^{18}_{9}\text{F} \to\ ? + e^+ + \nu$.</p>`, fig: "", dicas: [R`<p>Conserve $A$ e a carga.</p>`, R`<p>α leva 2 de carga e 4 de massa; β⁻ aumenta $Z$; β⁺ diminui.</p>`], resp: R`(a) $^{222}_{86}\text{Rn}$; (b) $^{60}_{28}\text{Ni}$; (c) $^{18}_{8}\text{O}$.`, sol: R`<p>(a) é a origem do radônio dentro de casas em regiões de granito. (c) é o flúor-18 do exame PET: o pósitron se aniquila com um elétron e solta dois fótons opostos, que a máquina detecta.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Um osso tem 25% da atividade de ¹⁴C de um osso atual. Qual a idade dele?</p>`, fig: "", dicas: [R`<p>25% = $\frac14 = \left(\frac12\right)^2$.</p>`, R`<p>Duas meias-vidas de 5730 anos.</p>`], resp: R`$\approx 11\,460$ anos.`, sol: R`<p>Datação por carbono funciona até uns 50 000 anos (umas 9 meias-vidas).</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Mostre que a atividade de 1 g de rádio-226 ($T_{1/2} = 1600$ anos) é de cerca de $3{,}7\times10^{10}$ Bq (foi assim que se definiu a unidade antiga, o curie).</p>`, fig: "", dicas: [R`<p>$N = \frac{1}{226}\times6{,}02\times10^{23}$.</p>`, R`<p>$\lambda = \frac{\ln2}{1600\times3{,}156\times10^7\text{ s}}$.</p>`], resp: R`$R = \lambda N \approx 3{,}7\times10^{10}$ Bq.`, sol: R`<p>$N = 2{,}66\times10^{21}$; $\lambda = 1{,}37\times10^{-11}$ s⁻¹; $R \approx 3{,}66\times10^{10}$ Bq ✓.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Calcule a energia liberada no decaimento alfa do ²³⁸U, sabendo as massas atômicas: ²³⁸U = 238,050788 u, ²³⁴Th = 234,043601 u, ⁴He = 4,002603 u.</p>`, fig: "", dicas: [R`<p>$Q = (M_\text{pai} - M_\text{filho} - M_\alpha)c^2$.</p>`, R`<p>$\Delta m \approx 0{,}004584$ u.</p>`], resp: R`$Q \approx 4{,}27$ MeV.`, sol: R`<p>$0{,}004584\times931{,}5 \approx 4{,}27$ MeV. Quase tudo vai para a alfa (o tório, 58 vezes mais pesado, recua pouco, pela conservação de momento).</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) {
    let e = document.getElementById("lab-lig"); e.outerHTML = F.lab("Curva da energia de ligação", "lab-lig"); SIM.ligacao(document.getElementById("lab-lig"), F);
    e = document.getElementById("lab-dec"); e.outerHTML = F.lab("Decaimento radioativo: acaso individual, lei coletiva", "lab-dec"); SIM.decaimento(document.getElementById("lab-dec"), F);
  },
});
