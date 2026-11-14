/* C19b · Energia nuclear: fissão e fusão (base: Halliday vol. 4, cap. 43, com as minhas palavras). Conferido em Python (scratchpad nuc.py):
   fissão ≈ 200 MeV por ²³⁵U: 1 kg → 8,2 × 10¹³ J ≈ 2,3 × 10⁷ kWh ≈ 2800 t de carvão; fração de massa convertida ≈ 0,09%; D + T → ⁴He + n: Q = 17,6 MeV;
   4 ¹H → ⁴He: 26,7 MeV; o Sol consome 3,6 × 10³⁸ prótons/s; barreira de Coulomb d–d ~ 0,5 MeV contra kT ≈ 1,3 keV a 15 × 10⁶ K; k = 1,01 em 100 gerações: ×2,7; k = 1,1: ×1,4 × 10⁴. */
F.registrar("C19b", {
  retoma: ["C19", "C18"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Energia nuclear nos números",
      casos: [
        { nome: "Q de uma reação", gerar: (p) => {
          const RE = [
            ["D + T → ⁴He + n", [2.014102, 3.016049], [4.002603, 1.008665], "fusão (o combustível dos reatores de fusão, como o ITER)"],
            ["D + D → ³He + n", [2.014102, 2.014102], [3.016029, 1.008665], "fusão"],
            ["p + ⁷Li → 2 ⁴He", [1.007825, 7.016004], [4.002603, 4.002603], "a primeira reação nuclear feita num acelerador (Cockcroft e Walton, 1932)"],
          ];
          const [txt, a, b, obs] = p ? RE[0] : F.escolha(RE), dm = a[0] + a[1] - b[0] - b[1];
          return { enun: R`<p>Quanta energia libera a reação ${txt}? Use as massas atômicas em u.</p>`, fig: "",
            passos: [
              R`<p>Antes: $${F.n(a[0], 6)} + ${F.n(a[1], 6)} = ${F.n(a[0] + a[1], 6)}$ u. Depois: $${F.n(b[0], 6)} + ${F.n(b[1], 6)} = ${F.n(b[0] + b[1], 6)}$ u.</p>`,
              R`<p>$\Delta m = ${F.n(dm, 6)}$ u; $Q = \Delta m\cdot931{,}5 = ${F.n(dm * 931.494, 2)}$ MeV. Positivo: libera energia (${obs}).</p>`,
              R`<p>Os produtos levam essa energia como cinética. Por massa de combustível, é uns ${F.n((dm * 931.494) / (a[0] + a[1]), 1)} MeV por u, ou seja, milhões de vezes uma reação química.</p>`,
            ] };
        } },
        { nome: "Usina × carvão", gerar: (p) => {
          const P = p ? 1000 : F.escolha([500, 1000, 1500]), ef = 0.33, E = (P * 1e6 * 3.156e7) / ef, mU = E / 8.21e13, mC = E / 29e6 / 1000;
          return { enun: R`<p>Uma usina nuclear produz ${P} MW elétricos com rendimento de 33%. Quanto urânio-235 ela fissiona por ano? E quanto carvão uma usina térmica gastaria?</p>`, fig: "",
            passos: [
              R`<p>Calor necessário por ano: $\frac{${P}\times10^6\cdot3{,}16\times10^7}{0{,}33} \approx ${F.n(E / 1e16, 2)}\times10^{16}$ J.</p>`,
              R`<p>Cada kg de ²³⁵U fissionado dá ~200 MeV por núcleo, $8{,}2\times10^{13}$ J/kg. Massa: $\approx ${F.n(mU, 0)}$ kg por ano, pouco mais de uma tonelada por GW.</p>`,
              R`<p>Carvão (~29 MJ/kg): $\approx ${F.n(mC / 1e6, 2)}$ milhões de toneladas por ano. A diferença de 3 milhões de vezes é a diferença entre energia nuclear (MeV) e química (eV).</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Como o Sol consegue fundir hidrogênio",
      enun: R`<p>Para dois prótons se fundirem, eles precisam chegar a ~$10^{-15}$ m, vencendo a repulsão elétrica. (a) Estime a altura da barreira de Coulomb para dois núcleos de carga $e$ a 3 fm. (b) No centro do Sol, $T \approx 1{,}5\times10^7$ K. Qual a energia térmica típica $kT$? Pela física clássica, a fusão seria possível? (c) O que salva o Sol? Dê duas razões.</p>`,
      fig: "",
      dicas: [R`<p>(a) $U = \frac{ke^2}{r}$; $ke^2 \approx 1{,}44$ MeV·fm.</p>`, R`<p>(c) Pense no efeito túnel ${F.ret("C17")} e na distribuição de Maxwell–Boltzmann ${F.ret("CII06")}.</p>`],
      sol: R`<p><b>(a)</b> $U = \frac{1{,}44\text{ MeV·fm}}{3\text{ fm}} \approx 0{,}48$ MeV.</p>
        <p><b>(b)</b> $kT = 8{,}62\times10^{-5}\times1{,}5\times10^7 \approx 1{,}3$ keV, uns 400 vezes menos que a barreira. Classicamente, praticamente nenhum par de prótons se fundiria.</p>
        <p><b>(c)</b> (1) A <b>cauda</b> da distribuição de Maxwell–Boltzmann: uma fração pequena de prótons tem energia muitas vezes maior que $kT$. (2) O <b>efeito túnel</b>: o próton não precisa passar <i>por cima</i> da barreira; ele atravessa com uma probabilidade pequena, mas não nula. A combinação dá uma taxa minúscula por par, mas o Sol tem $10^{57}$ prótons: basta para 3,8 × 10²⁶ W. É por isso que o Sol queima devagar e dura 10 bilhões de anos. (Isso foi explicado por Gamow, Atkinson e Houtermans e, em detalhe, por Bethe, em 1939.)</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Moderna · energia nuclear</div>
        <div class="q">Por que partir um núcleo grande libera energia, e juntar dois pequenos também?</div>
        <p>Porque os núcleos de tamanho médio (perto do ferro) são os mais firmemente ligados ${F.ret("C19")}. Qualquer reação que leve os núcleos para perto do ferro solta a diferença como energia: dos pesados, por <b>fissão</b>; dos leves, por <b>fusão</b>. Uma alimenta as usinas nucleares; a outra, as estrelas.</p></div>`),

      F.secao("fissao", "Fissão", R`
        <p>Um nêutron lento é absorvido pelo urânio-235, que vira ²³⁶U excitado, oscila como uma gota e se parte em dois fragmentos médios, soltando 2 a 3 nêutrons e ~200 MeV:</p>
        ${F.formula(R`n + {}^{235}\text{U} \to {}^{236}\text{U}^* \to {}^{141}\text{Ba} + {}^{92}\text{Kr} + 3n + \sim200\text{ MeV}`, "Um exemplo de fissão")}
        <p>De onde vêm os 200 MeV: o urânio tem ~7,6 MeV por núcleon e os fragmentos ~8,5. Ganhando ~0,9 MeV em cada um dos 236 núcleons, sai uns 200 MeV, a maior parte como energia cinética dos fragmentos (que vira calor). Só ~0,1% da massa vira energia, e isso já é muito: 1 kg de ²³⁵U fissionado dá $8\times10^{13}$ J, o equivalente a ~2800 toneladas de carvão.</p>
        <h3>Reação em cadeia</h3>
        <div id="lab-cad"></div>
        <p>Num <b>reator</b>, o combustível (urânio enriquecido a ~3–5% de ²³⁵U), o <b>moderador</b> (água ou grafite, que freia os nêutrons para eles serem absorvidos melhor) e as <b>barras de controle</b> (cádmio ou boro, que absorvem nêutrons) mantêm $k = 1$. Um detalhe salva o controle: ~0,7% dos nêutrons saem atrasados, segundos depois da fissão, o que dá tempo para as barras agirem. Numa bomba, a massa supercrítica é montada em microssegundos.</p>`),

      F.secao("fusao", "Fusão", R`
        <p>Juntar núcleos leves sobe a curva da energia de ligação ainda mais rápido. No Sol, a cadeia próton–próton transforma 4 prótons num ⁴He:</p>
        ${F.formula(R`4\,{}^1\text{H} \to {}^4\text{He} + 2e^+ + 2\nu + 26{,}7\text{ MeV}`, "Saldo da cadeia próton–próton")}
        <p>A dificuldade é a repulsão elétrica: os núcleos precisam de temperaturas de milhões de graus para se aproximarem (e do efeito túnel para fechar o resto, ver o chefão). Na Terra, a reação mais fácil é deutério + trítio (17,6 MeV), que precisa de ~100 milhões de K. O plasma não pode encostar em nenhuma parede: ele é preso por campos magnéticos (tokamak, como o ITER) ou comprimido por lasers. Em 2022, o NIF (EUA) conseguiu pela primeira vez tirar da fusão mais energia do que os lasers depositaram no alvo.</p>
        <table class="tb"><tr><th></th><th>fissão</th><th>fusão</th></tr>
          <tr><td>combustível</td><td>urânio, plutônio</td><td>deutério (da água do mar), trítio (feito a partir de lítio)</td></tr>
          <tr><td>energia por reação</td><td>~200 MeV</td><td>17,6 MeV (D–T), mas por massa é ~4× mais</td></tr>
          <tr><td>resíduos</td><td>fragmentos radioativos de vida longa</td><td>bem menos (nêutrons ativam as paredes)</td></tr>
          <tr><td>situação</td><td>em uso desde 1954</td><td>experimental</td></tr></table>
        <p>As estrelas fabricam os elementos: hidrogênio vira hélio; em estrelas grandes, hélio vira carbono e oxigênio, e assim até o ferro. Os mais pesados que o ferro nascem em explosões de supernovas e colisões de estrelas de nêutrons. O ferro do seu sangue e o ouro de uma aliança vieram de estrelas que morreram antes do Sol nascer.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Na fissão $n + {}^{235}\text{U} \to {}^{140}\text{Xe} + {}^{94}\text{Sr} + x\,n$, quanto vale $x$? Confira a conservação da carga (U: 92, Xe: 54, Sr: 38).</p>`, fig: "", dicas: [R`<p>Conserve $A$: $1 + 235 = 140 + 94 + x$.</p>`, R`<p>Carga: $92 = 54 + 38$ ✓.</p>`], resp: R`$x = 2$.`, sol: R`<p>$236 - 234 = 2$ nêutrons. Cada fissão solta 2 ou 3 (média ~2,4).</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Uma fissão libera 200 MeV. Quantas fissões por segundo são necessárias para 1 W? E para uma usina de 3 GW térmicos?</p>`, fig: "", dicas: [R`<p>200 MeV $= 3{,}2\times10^{-11}$ J.</p>`, R`<p>$N = P/E$.</p>`], resp: R`$3{,}1\times10^{10}$ fissões/s por watt; $\approx 9{,}4\times10^{19}$ por segundo na usina.`, sol: R`<p>$\frac{1}{3{,}2\times10^{-11}} = 3{,}1\times10^{10}$. Vezes $3\times10^9$: $9{,}4\times10^{19}$/s, o que dá ~3 kg de ²³⁵U por dia.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Calcule a energia liberada na reação D + T → ⁴He + n (massas: D 2,014102; T 3,016049; ⁴He 4,002603; n 1,008665 u).</p>`, fig: "", dicas: [R`<p>$\Delta m = 5{,}030151 - 5{,}011268$.</p>`, R`<p>$\times931{,}5$ MeV/u.</p>`], resp: R`$Q \approx 17{,}6$ MeV.`, sol: R`<p>$\Delta m = 0{,}018883$ u. O nêutron leva 14,1 MeV (4/5, pela conservação de momento) e o hélio, 3,5 MeV.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>O Sol emite $3{,}83\times10^{26}$ W, e cada ⁴He formado libera 26,7 MeV. Quantos prótons ele consome por segundo?</p>`, fig: "", dicas: [R`<p>Reações por segundo $= P/(26{,}7\text{ MeV})$.</p>`, R`<p>4 prótons por reação.</p>`], resp: R`$\approx 3{,}6\times10^{38}$ prótons/s ($\approx 6\times10^{11}$ kg/s de hidrogênio).`, sol: R`<p>$26{,}7$ MeV $= 4{,}28\times10^{-12}$ J; $\frac{3{,}83\times10^{26}}{4{,}28\times10^{-12}} = 8{,}9\times10^{37}$ reações/s; ×4. Em massa: $3{,}6\times10^{38}\times1{,}67\times10^{-27} \approx 6\times10^{11}$ kg/s.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Com $k = 1{,}01$ (1% acima do crítico), por quanto se multiplica o número de nêutrons em 100 gerações? E com $k = 1{,}1$?</p>`, fig: "", dicas: [R`<p>$N = N_0k^n$.</p>`, R`<p>$1{,}01^{100} \approx e^1$.</p>`], resp: R`$\approx 2{,}7$ e $\approx 1{,}4\times10^4$.`, sol: R`<p>$1{,}01^{100} = 2{,}70$ (quase $e$, o limite fundamental ${F.ret("CI02")}). $1{,}1^{100} = 13\,781$. Por isso o controle precisa ser fino, e os nêutrons atrasados são essenciais.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Por que os reatores precisam de um <b>moderador</b> que freie os nêutrons? Use a ideia de colisão elástica: num choque frontal de um nêutron com um núcleo parado de massa $M$, que fração da energia o nêutron perde? Compare hidrogênio ($M = m$) e chumbo ($M = 207m$).</p>`, fig: "", dicas: [R`<p>Colisão elástica frontal: a energia transferida é $\frac{4mM}{(m + M)^2}$ da inicial.</p>`, R`<p>Calcule para $M = m$ e $M = 207m$.</p>`], resp: R`Com hidrogênio, perde tudo (100%) num choque frontal; com chumbo, só ~1,9%.`, sol: R`<p>$\frac{4\cdot1\cdot1}{4} = 1$; $\frac{4\cdot207}{208^2} = 0{,}019$. Núcleos leves (hidrogênio da água, carbono do grafite) freiam bem. Nêutrons lentos ("térmicos") têm probabilidade muito maior de serem absorvidos pelo ²³⁵U.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Que fração da massa de um átomo de ²³⁵U vira energia numa fissão de 200 MeV?</p>`, fig: "", dicas: [R`<p>Massa do U em MeV: $235\times931{,}5$.</p>`, R`<p>$200/(235\times931{,}5)$.</p>`], resp: R`$\approx 0{,}09\%$.`, sol: R`<p>$\frac{200}{218\,900} \approx 9\times10^{-4}$. Na fusão D–T: $\frac{17{,}6}{5{,}03\times931{,}5} \approx 0{,}38\%$, uns 4 vezes mais por massa. Na aniquilação matéria–antimatéria, 100%.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-cad"); e.outerHTML = F.lab("Reação em cadeia: o fator k", "lab-cad"); SIM.reacaoCadeia(document.getElementById("lab-cad"), F); },
});
