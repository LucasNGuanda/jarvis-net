/* C20 · Sólidos e semicondutores (base: Halliday vol. 4, cap. 41, com as minhas palavras). Conferido em Python (scratchpad nuc.py):
   gap Si 1,12 eV → 1107 nm; Ge 0,67 eV → 1851 nm; diamante 5,5 eV → 225 nm; kT a 300 K = 25,9 meV; e^(−Eg/2kT) do Si cresce ~22× de 300 para 350 K;
   LED de gap 1,9 eV → 653 nm (vermelho), 2,7 eV → 459 nm (azul); cobre, E_F = 7,0 eV → v_F = 1,57 × 10⁶ m/s. */
F.registrar("C20", {
  retoma: ["C17b", "C07"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Semicondutores nos números",
      casos: [
        { nome: "Cor de um LED", gerar: (p) => {
          const casos = [["vermelho (AlGaAs)", 1.9], ["amarelo (GaAsP)", 2.1], ["verde (InGaN)", 2.3], ["azul (InGaN)", 2.7]];
          const [n, Eg] = p ? casos[0] : F.escolha(casos);
          return { enun: R`<p>Um LED ${n} tem um gap de energia de ${F.nt(Eg)} eV. Qual o comprimento de onda da luz? Qual a tensão mínima para ele acender?</p>`, fig: "",
            passos: [
              R`<p>Num LED, um elétron da banda de condução cai numa lacuna da de valência e emite um fóton com energia ≈ gap: $E = E_g = ${F.n(Eg)}$ eV.</p>`,
              R`<p>$\lambda = \frac{1240}{${F.n(Eg)}} \approx ${F.n(1240 / Eg, 0)}$ nm.</p>`,
              R`<p>Para empurrar elétrons por cima do gap, a tensão precisa ser de pelo menos uns ${F.nt(Eg)} V: é a "tensão do LED" que aparece nos circuitos ${F.ret("C07")} (o vermelho ~2 V, o azul ~3 V). O LED azul eficiente só saiu nos anos 1990 (Nobel de 2014), e com ele vieram o LED branco e as telas modernas.</p>`,
            ] };
        } },
        { nome: "Gap e fotodetector", gerar: (p) => {
          const casos = [["silício", 1.12], ["germânio", 0.67], ["arseneto de gálio", 1.42]];
          const [n, Eg] = p ? casos[0] : F.escolha(casos), lc = 1240 / Eg;
          return { enun: R`<p>Uma célula solar de ${n} ($E_g = ${F.n(Eg)}$ eV). Que luz ela consegue converter em eletricidade?</p>`, fig: "",
            passos: [
              R`<p>Um fóton só cria um par elétron–lacuna se $hf \geq E_g$ (é um "fotoelétrico interno" ${F.ret("C17")}).</p>`,
              R`<p>Comprimento de onda máximo: $\lambda = \frac{1240}{${F.n(Eg)}} \approx ${F.n(lc, 0)}$ nm. Toda a luz visível (400–700 nm) ${lc > 700 ? "serve, e ainda parte do infravermelho" : "não serve"}.</p>`,
              R`<p>A energia acima do gap vira calor: um fóton azul (2,8 eV) num silício aproveita só 1,12 eV. Esse e outros efeitos limitam uma célula de junção simples a ~33% de eficiência (limite de Shockley–Queisser).</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Por que um metal conduz pior quando esquenta e um semicondutor conduz melhor",
      enun: R`<p>(a) No modelo de Drude ${F.ret("C06")}, a resistividade de um metal é $\rho = \frac{m}{ne^2\tau}$, onde $\tau$ é o tempo médio entre colisões. Explique por que $\rho$ do cobre aumenta com a temperatura. (b) Num semicondutor puro, o número de portadores é $n \propto T^{3/2}e^{-E_g/2kT}$. Para o silício ($E_g = 1{,}12$ eV), por que fator $n$ aumenta de 300 K para 350 K? (c) Use isso para explicar como funciona um termistor NTC (o sensor de temperatura de um termômetro digital).</p>`,
      fig: "",
      dicas: [R`<p>(a) No metal, $n$ quase não muda. O que acontece com as vibrações da rede (fônons) quando esquenta?</p>`, R`<p>(b) $\frac{n(350)}{n(300)} = \left(\frac{350}{300}\right)^{3/2}\exp\left[\frac{E_g}{2k}\left(\frac1{300} - \frac1{350}\right)\right]$.</p>`],
      sol: R`<p><b>(a)</b> No metal, o número de elétrons livres é fixo (um ou mais por átomo). Esquentar aumenta a vibração dos íons, os elétrons colidem mais, $\tau$ diminui e $\rho$ aumenta (no cobre, uns 0,4% por grau).</p>
        <p><b>(b)</b> O fator exponencial: $\frac{1{,}12}{2\times8{,}617\times10^{-5}}\left(\frac{1}{300} - \frac{1}{350}\right) \approx 3{,}09$, então $e^{3{,}09} \approx 22$. O fator $T^{3/2}$ dá mais $1{,}26$. Total: ~28 vezes mais portadores com só 50 graus a mais.</p>
        <p><b>(c)</b> O aumento brutal de portadores vence com folga o aumento de colisões: a resistência de um semicondutor <b>cai</b> com a temperatura (NTC, "coeficiente de temperatura negativo"). Medindo a resistência, o circuito lê a temperatura com ótima sensibilidade.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Moderna · sólidos</div>
        <div class="q">O cobre conduz eletricidade $10^{20}$ vezes melhor que o vidro. Os dois são feitos de átomos com elétrons. De onde vem essa diferença gigantesca?</div>
        <p>Da física quântica dos sólidos. Quando muitos átomos se juntam, seus níveis de energia ${F.ret("C17b")} se juntam em <b>bandas</b>, e o que importa é se há lugar vazio logo acima dos elétrons. Essa ideia explica metais, isolantes e o semicondutor: o material do transistor, do LED, do painel solar e de todo chip que existe.</p></div>`),

      F.secao("bandas", "Bandas de energia", R`
        <p>Dois átomos iguais próximos: cada nível se divide em dois. $N$ átomos: em $N$ níveis tão próximos que formam uma faixa contínua, a <b>banda</b>. Entre as bandas, ficam faixas de energia proibidas, os <b>gaps</b>. Pelo princípio de Pauli, os elétrons enchem os níveis de baixo para cima.</p>
        <div id="lab-ban"></div>
        <ul><li><b>Metal</b>: a última banda ocupada está pela metade. Qualquer campo elétrico, por menor que seja, empurra elétrons para níveis vazios logo acima: conduz sempre.</li>
          <li><b>Isolante</b>: a banda de valência está cheia e o gap até a de condução é grande (diamante: 5,5 eV). A energia térmica ($kT \approx 0{,}026$ eV a 300 K) não chega nem perto.</li>
          <li><b>Semicondutor</b>: o mesmo, mas com gap pequeno (silício: 1,12 eV). Alguns elétrons pulam o gap por agitação térmica e deixam <b>lacunas</b> na valência, que se comportam como cargas positivas móveis.</li></ul>
        <p>Nos metais, os elétrons de condução ocupam níveis até a <b>energia de Fermi</b> (no cobre, 7 eV), e os do topo se movem a ~1600 km/s, mesmo no zero absoluto. Mas a velocidade média de <i>arrasto</i> numa corrente é de milímetros por segundo ${F.ret("C06")}.</p>`),

      F.secao("dopagem", "Dopagem e junção p–n", R`
        <p>Um silício puro conduz pouco. Trocando um átomo em cada milhão por outro:</p>
        <ul><li><b>Tipo n</b>: fósforo (5 elétrons de valência, um a mais que o Si). O elétron extra fica fracamente preso e vai para a condução: portadores negativos.</li>
          <li><b>Tipo p</b>: boro (3 elétrons). Fica faltando um, uma lacuna: portadores positivos.</li></ul>
        <p>A mágica está em juntar os dois. Na <b>junção p–n</b>, elétrons do lado n preenchem lacunas do lado p perto da fronteira, deixando uma camada sem portadores com um campo elétrico interno. Resultado: a corrente passa fácil num sentido e quase nada no outro. É o <b>diodo</b>, com a curva exponencial de Shockley $i = I_s(e^{V/V_T} - 1)$ que resolvemos com a W de Lambert ${F.ret("matematica/CE01")}.</p>
        <table class="tb"><tr><th>dispositivo</th><th>como usa a junção</th></tr>
          <tr><td>LED</td><td>elétrons e lacunas se recombinam na junção e emitem fótons com energia ≈ gap</td></tr>
          <tr><td>célula solar / fotodiodo</td><td>o contrário: fótons criam pares, e o campo da junção os separa (corrente)</td></tr>
          <tr><td>transistor</td><td>duas junções (ou um "portão" de campo elétrico, no MOSFET): uma corrente ou tensão pequena controla uma grande. Um chip moderno tem dezenas de bilhões</td></tr></table>
        ${F.caixa("fisico", R`<p><b>Supercondutores</b>: alguns materiais, abaixo de uma temperatura crítica, têm resistência <i>exatamente</i> zero e expulsam o campo magnético (efeito Meissner, que faz um ímã levitar). É um efeito quântico coletivo: elétrons formam pares (pares de Cooper) que se movem sem colidir. Usados nos ímãs da ressonância magnética e do LHC.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $kT$ (em eV) a 300 K. Compare com o gap do silício (1,12 eV) e do diamante (5,5 eV).</p>`, fig: "", dicas: [R`<p>$k = 8{,}617\times10^{-5}$ eV/K.</p>`, R`<p>Calcule $E_g/kT$ nos dois casos.</p>`], resp: R`$kT \approx 0{,}026$ eV; Si: $E_g \approx 43kT$; diamante: $\approx 213kT$.`, sol: R`<p>O fator de Boltzmann $e^{-E_g/2kT}$ é $\sim10^{-10}$ no silício (alguns portadores, entre $10^{22}$ átomos por cm³) e $\sim10^{-46}$ no diamante (nenhum).</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Qual a cor da luz de um LED com gap de 2,7 eV? E com 1,9 eV?</p>`, fig: "", dicas: [R`<p>$\lambda = 1240/E_g$.</p>`, R`<p>Compare com o espectro visível.</p>`], resp: R`$\approx 459$ nm (azul) e $\approx 653$ nm (vermelho).`, sol: R`<p>Um LED branco é, na verdade, um LED azul coberto por um material fosforescente que converte parte do azul em amarelo; azul + amarelo parece branco.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Até que comprimento de onda uma célula solar de silício funciona? A luz do controle remoto da TV (940 nm) é detectada por um fotodiodo de silício?</p>`, fig: "", dicas: [R`<p>$\lambda_\text{máx} = 1240/1{,}12$.</p>`, R`<p>Compare com 940 nm.</p>`], resp: R`Até $\approx 1107$ nm; sim, 940 nm é detectado.`, sol: R`<p>Por isso a câmera do celular "vê" o LED do controle remoto piscar (aponte e teste!), embora o olho não veja.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Por que o diamante é transparente e o silício é opaco (cinza metálico) para a luz visível?</p>`, fig: "", dicas: [R`<p>Um fóton é absorvido se tiver energia para levar um elétron por cima do gap.</p>`, R`<p>Luz visível: 1,8 a 3,1 eV.</p>`], resp: R`O gap do diamante (5,5 eV) é maior que a energia de qualquer fóton visível; o do silício (1,12 eV) é menor.`, sol: R`<p>No diamante, nenhum fóton visível é absorvido: transparente. No silício, todos são: opaco. Mas o silício é transparente no infravermelho além de 1,1 μm: é usado em lentes de câmeras térmicas.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>O silício tem $5\times10^{22}$ átomos/cm³ e, puro, ~$10^{10}$ elétrons livres/cm³ a 300 K. Se você dopar com 1 átomo de fósforo por milhão de átomos de silício, quantos elétrons livres por cm³ passa a ter? Por quanto multiplica a condutividade?</p>`, fig: "", dicas: [R`<p>Cada fósforo doa um elétron.</p>`, R`<p>$5\times10^{22}\times10^{-6}$.</p>`], resp: R`$\sim5\times10^{16}$ /cm³: uns 5 milhões de vezes mais portadores.`, sol: R`<p>Uma "sujeira" de uma parte por milhão muda a condutividade por milhões de vezes. Por isso a fabricação de chips exige salas ultralimpas e silício 99,9999999% puro antes de dopar.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Os elétrons de condução do cobre têm energia de Fermi de 7,0 eV. Qual a velocidade de um elétron com essa energia? Compare com a velocidade de arrasto numa corrente típica (~0,1 mm/s).</p>`, fig: "", dicas: [R`<p>$v = \sqrt{2E/m}$.</p>`, R`<p>$E = 7{,}0\times1{,}6\times10^{-19}$ J.</p>`], resp: R`$v_F \approx 1{,}6\times10^6$ m/s, ~10¹⁰ vezes a velocidade de arrasto.`, sol: R`<p>Os elétrons se movem rapidíssimo em todas as direções; a corrente é só um pequeno "vento" sobre esse movimento. Pelo princípio de Pauli, eles não podem ficar todos parados: ocupam níveis até $E_F$ mesmo no zero absoluto.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Por que o LED vermelho "acende" com uns 1,8 V e o azul só com uns 3 V? Relacione com o exemplário do LED da CE01/C07.</p>`, fig: "", dicas: [R`<p>Cada elétron que atravessa a junção ganha $eV$ de energia e emite um fóton de energia $\approx E_g$.</p>`, R`<p>Conservação de energia: $eV \gtrsim E_g$.</p>`], resp: R`A tensão precisa ser pelo menos $E_g/e$: ~1,9 V para o vermelho, ~2,7 V para o azul (na prática um pouco mais).`, sol: R`<p>É o efeito fotoelétrico "ao contrário": em vez de luz virar elétrons, elétrons viram luz, e a tensão mede a energia de cada fóton. Medindo a tensão de acendimento e o $\lambda$ de vários LEDs, dá para medir a constante de Planck numa aula de laboratório.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-ban"); e.outerHTML = F.lab("Bandas: metal, semicondutor, isolante e dopagem", "lab-ban"); SIM.bandas(document.getElementById("lab-ban"), F); },
});
