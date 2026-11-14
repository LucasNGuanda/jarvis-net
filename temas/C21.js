/* C21 · Partículas elementares e cosmologia (base: Halliday vol. 4, cap. 44, com as minhas palavras). Conferido em Python (scratchpad nuc.py):
   cargas: uud = +1, udd = 0, ud̄ = +1; H₀ = 70 km/s/Mpc → 1/H₀ ≈ 14,0 bilhões de anos; galáxia a 100 Mpc: 7000 km/s; pico da radiação de fundo (2,725 K) ≈ 1,06 mm; próton: 938 MeV. */
F.registrar("C21", {
  retoma: ["C19", "C18"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Partículas e universo nos números",
      casos: [
        { nome: "Lei de Hubble", gerar: (p) => {
          const d = p ? 100 : F.escolha([10, 50, 100, 500, 1000]), H = 70, v = H * d;
          return { enun: R`<p>Uma galáxia está a ${d} Mpc (1 Mpc ≈ 3,26 milhões de anos-luz). Com que velocidade ela se afasta de nós? ($H_0 \approx 70$ km/s/Mpc)</p>`, fig: "",
            passos: [
              R`<p>Lei de Hubble: $v = H_0d = 70\times${d} = ${v}$ km/s.</p>`,
              R`<p>Isso é ${F.n(v / 3e5, 4)}c. ${v / 3e5 > 0.1 ? "Nessa distância, a lei simples já começa a precisar de correções relativísticas e cosmológicas." : "Pequeno comparado a c: o Doppler simples serve."}</p>`,
              R`<p>A luz chega com $\lambda$ esticado por $1 + z \approx 1 + \frac vc = ${F.n(1 + v / 3e5, 4)}$ (desvio para o vermelho). Não é que as galáxias "voem" pelo espaço: o próprio espaço se expande, levando as galáxias junto, como pontos num balão sendo inflado.</p>`,
            ] };
        } },
        { nome: "Conservação em reações", gerar: (p) => {
          const casos = [
            ["n → p + e⁻ + ν̄ₑ", true, "pode: carga 0 → +1 −1 + 0; número bariônico 1 → 1; número leptônico 0 → 0 + 1 − 1. É o decaimento β."],
            ["p → n + e⁺ + νₑ (próton livre)", false, "a contagem fecha (carga +1 = 0 + 1 + 0; bariônico 1 = 1; leptônico 0 = −1 + 1), mas a <b>energia</b> não: o nêutron é mais pesado que o próton. Livre, o próton não decai; dentro de certos núcleos, sim (β⁺)."],
            ["p → π⁰ + e⁺", false, "proibido: número bariônico 1 → 0. Experimentos procuram isso há décadas: a vida média do próton é maior que 10³⁴ anos."],
            ["π⁻ + p → n + π⁰", true, "pode: carga −1 + 1 = 0 + 0; bariônico 0 + 1 = 1 + 0. Ocorre por interação forte."],
          ];
          const [r, ok, exp] = p ? casos[0] : F.escolha(casos);
          return { enun: R`<p>A reação ${r} pode acontecer?</p>`, fig: "",
            passos: [
              R`<p>Confira as leis de conservação que nunca falham: <b>energia</b>, <b>momento</b>, <b>carga</b>, <b>número bariônico</b> (bárions +1, antibárions −1) e <b>número leptônico</b> (de cada família).</p>`,
              R`<p>${ok ? "✓" : "✗"} ${exp}</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A idade do universo a partir de um gráfico",
      enun: R`<p>(a) Se todas as galáxias se afastam com $v = H_0d$ e, no passado, estavam todas juntas, estime há quanto tempo foi isso, supondo velocidade constante. Calcule com $H_0 = 70$ km/s/Mpc (1 Mpc $= 3{,}086\times10^{22}$ m). (b) A radiação cósmica de fundo é a luz do momento em que o universo, a ~3000 K, ficou transparente. Hoje ela está a 2,725 K. Por que fator o universo se expandiu desde então? (c) A estimativa de (a) dá ~14 bilhões de anos e as medidas modernas dão 13,8. Por que a conta simples acerta tão bem, se a expansão não teve velocidade constante?</p>`,
      fig: "",
      dicas: [R`<p>(a) $t = \frac dv = \frac{1}{H_0}$. Converta $H_0$ para s⁻¹.</p>`, R`<p>(b) Com a expansão, $\lambda$ estica junto com o universo, e a temperatura do corpo negro cai na mesma proporção (Wien ${F.ret("C16")}).</p>`],
      sol: R`<p><b>(a)</b> $H_0 = \frac{70\times10^3}{3{,}086\times10^{22}} = 2{,}27\times10^{-18}$ s⁻¹; $\frac{1}{H_0} = 4{,}41\times10^{17}$ s $\approx 14{,}0$ bilhões de anos.</p>
        <p><b>(b)</b> $\frac{3000}{2{,}725} \approx 1100$: os comprimentos de onda (e as distâncias) cresceram ~1100 vezes. A luz, emitida no visível/infravermelho próximo, chega hoje como micro-ondas (pico em ~1 mm).</p>
        <p><b>(c)</b> No começo, a gravidade da matéria freou a expansão (ela era mais rápida); nos últimos ~5 bilhões de anos, a <b>energia escura</b> passou a acelerá-la. Os dois efeitos quase se compensam por coincidência, e $1/H_0$ fica perto da idade verdadeira. Explicar essa energia escura (~68% de tudo) é um dos maiores problemas abertos da física.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Moderna · partículas e cosmologia</div>
        <div class="q">Do que tudo é feito, no fundo? E de onde veio?</div>
        <p>A resposta atual cabe numa tabela: 6 quarks, 6 léptons e as partículas que transmitem as forças, mais o bóson de Higgs. Esse "Modelo Padrão" explica todo experimento de laboratório já feito. As mesmas leis, aplicadas ao universo inteiro, contam a história do Big Bang. É o ponto onde o muito pequeno e o muito grande se encontram.</p></div>`),

      F.secao("modelo", "O Modelo Padrão", R`
        <table class="tb"><tr><th>família</th><th>quarks (carga)</th><th>léptons (carga)</th></tr>
          <tr><td>1ª (matéria comum)</td><td>up u (+2/3), down d (−1/3)</td><td>elétron e (−1), neutrino do elétron νₑ (0)</td></tr>
          <tr><td>2ª</td><td>charm c (+2/3), strange s (−1/3)</td><td>múon μ (−1), νμ (0)</td></tr>
          <tr><td>3ª</td><td>top t (+2/3), bottom b (−1/3)</td><td>tau τ (−1), ντ (0)</td></tr></table>
        <p>Cada partícula tem uma <b>antipartícula</b> com carga oposta (o pósitron, previsto por Dirac em 1928 ao juntar quântica e relatividade, achado em 1932). Tudo à sua volta é feito só da 1ª família: prótons (uud), nêutrons (udd) e elétrons. As outras aparecem em raios cósmicos e aceleradores e decaem rápido.</p>
        <table class="tb"><tr><th>força</th><th>mediador</th><th>alcance</th><th>age em</th></tr>
          <tr><td>forte</td><td>glúons</td><td>~10⁻¹⁵ m</td><td>quarks (prende-os em prótons e nêutrons, e estes no núcleo ${F.ret("C19")})</td></tr>
          <tr><td>eletromagnética</td><td>fóton</td><td>infinito</td><td>tudo que tem carga</td></tr>
          <tr><td>fraca</td><td>bósons W e Z</td><td>~10⁻¹⁸ m</td><td>todas (decaimento β, fusão no Sol)</td></tr>
          <tr><td>gravidade</td><td>(gráviton, não observado)</td><td>infinito</td><td>tudo; fora do Modelo Padrão</td></tr></table>
        <p>O <b>bóson de Higgs</b> (previsto em 1964, achado no LHC em 2012) está ligado à origem da massa das partículas elementares. Curiosidade: a massa do próton (938 MeV) vem quase toda da energia de ligação dos glúons, não da massa dos quarks (uns 9 MeV no total). Mais um $E = mc^2$ ${F.ret("C18")}.</p>`),

      F.secao("hadrons", "Quarks e hádrons", R`
        <p>Quarks nunca aparecem sozinhos (<b>confinamento</b>): tentar separar dois quarks cria energia suficiente para fazer um novo par quark–antiquark. Eles só existem em grupos sem "carga de cor" líquida: <b>bárions</b> (3 quarks) e <b>mésons</b> (quark + antiquark).</p>
        <div id="lab-qk"></div>
        <p>Antes de os quarks serem aceitos, Gell-Mann organizou as partículas conhecidas em padrões geométricos (o "caminho óctuplo") e viu um buraco: previu o Ω⁻ (sss), com massa e propriedades, que foi encontrado em 1964. É o mesmo tipo de previsão que Mendeleev fez com a tabela periódica.</p>
        ${F.caixa("fisico", R`<p><b>O decaimento β, de novo</b> ${F.ret("C19")}: no nível dos quarks, é um d virando u (udd → uud), emitindo um bóson W⁻ que vira elétron + antineutrino. A força fraca é a única que muda o "sabor" dos quarks.</p>`)}`),

      F.secao("cosmo", "Cosmologia: a história do universo", R`
        ${F.formula(R`v = H_0\,d,\qquad H_0 \approx 70\ \tfrac{\text{km/s}}{\text{Mpc}}`, "Lei de Hubble–Lemaître")}
        <p>Galáxias distantes se afastam com velocidade proporcional à distância (Hubble, 1929, pelo desvio para o vermelho ${F.ret("C18")}). Voltando o filme, tudo esteve junto há ~13,8 bilhões de anos, num estado quentíssimo e denso: o <b>Big Bang</b>. As três grandes evidências:</p>
        <ol><li><b>Expansão</b> (lei de Hubble).</li>
          <li><b>Radiação cósmica de fundo</b>: um corpo negro perfeito a 2,725 K, vindo de todas as direções (Penzias e Wilson, 1965, por acaso, tentando eliminar um "ruído" na antena) ${F.ret("C16")}.</li>
          <li><b>Abundância de elementos leves</b>: nos primeiros minutos, a fusão produziu ~75% de hidrogênio e ~25% de hélio (em massa), exatamente o que se observa nas estrelas mais antigas ${F.ret("C19b")}.</li></ol>
        <table class="tb"><tr><th>tempo após o Big Bang</th><th>o que acontece</th></tr>
          <tr><td>~10⁻⁶ s</td><td>quarks e glúons se juntam em prótons e nêutrons</td></tr>
          <tr><td>~3 minutos</td><td>fusão forma os núcleos de hélio</td></tr>
          <tr><td>~380 mil anos</td><td>núcleos capturam elétrons (átomos neutros); a luz fica livre: é a radiação de fundo</td></tr>
          <tr><td>~200 milhões de anos</td><td>primeiras estrelas</td></tr>
          <tr><td>9,2 bilhões de anos</td><td>nasce o Sol</td></tr>
          <tr><td>13,8 bilhões de anos</td><td>hoje</td></tr></table>
        <p><b>O que não sabemos</b>: a matéria comum é só ~5% do conteúdo do universo. ~27% é <b>matéria escura</b> (sentida pela gravidade nas galáxias, mas invisível) e ~68% é <b>energia escura</b> (que acelera a expansão). Também não se sabe por que sobrou matéria e quase nenhuma antimatéria. Ainda há muita física para descobrir.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule a carga do próton (uud), do nêutron (udd) e do píon π⁺ (u d̄) pelos quarks.</p>`, fig: "", dicas: [R`<p>u = +2/3, d = −1/3; o antiquark d̄ tem +1/3.</p>`, R`<p>Some.</p>`], resp: R`$+1$, $0$ e $+1$.`, sol: R`<p>uud: $\frac23 + \frac23 - \frac13 = 1$. udd: $\frac23 - \frac13 - \frac13 = 0$. ud̄: $\frac23 + \frac13 = 1$. Confira no laboratório.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Que partícula é feita de três quarks s? Qual a sua carga e estranheza?</p>`, fig: "", dicas: [R`<p>s tem carga −1/3 e estranheza −1.</p>`, R`<p>Some três.</p>`], resp: R`O Ω⁻: carga −1, estranheza −3.`, sol: R`<p>A previsão e descoberta do Ω⁻ (1964) foi o grande triunfo do modelo de quarks.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>O decaimento $\mu^- \to e^- + \bar\nu_e + \nu_\mu$ conserva carga e números leptônicos (de cada família)? Atribua: $\mu^-$, $\nu_\mu$: $L_\mu = +1$; $e^-$, $\nu_e$: $L_e = +1$; antipartículas, −1.</p>`, fig: "", dicas: [R`<p>Antes: $L_\mu = 1$, $L_e = 0$.</p>`, R`<p>Depois: $L_\mu = 1$ (do $\nu_\mu$); $L_e = 1 - 1 = 0$.</p>`], resp: R`Sim: carga −1 → −1; $L_\mu$ 1 → 1; $L_e$ 0 → 0.`, sol: R`<p>É o decaimento do múon que, com a dilatação do tempo, explica por que eles chegam ao chão ${F.ret("C18")}.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Uma galáxia tem linhas espectrais desviadas de 1% para o vermelho. A que distância ela está?</p>`, fig: "", dicas: [R`<p>$z \approx v/c = 0{,}01$, então $v = 3000$ km/s.</p>`, R`<p>$d = v/H_0$.</p>`], resp: R`$\approx 43$ Mpc ($\approx 140$ milhões de anos-luz).`, sol: R`<p>$\frac{3000}{70} \approx 43$ Mpc. A luz que você vê saiu de lá quando os dinossauros ainda não existiam na forma que conhecemos.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Estime a idade do universo como $1/H_0$, com $H_0 = 70$ km/s/Mpc.</p>`, fig: "", dicas: [R`<p>1 Mpc $= 3{,}086\times10^{19}$ km.</p>`, R`<p>1 ano $= 3{,}156\times10^7$ s.</p>`], resp: R`$\approx 14$ bilhões de anos.`, sol: R`<p>$\frac{3{,}086\times10^{19}}{70}$ s $= 4{,}4\times10^{17}$ s. É o chefão, parte (a).</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Um elétron e um pósitron em repouso se aniquilam em dois fótons. Qual a energia e o comprimento de onda de cada fóton? Por que precisam ser dois?</p>`, fig: "", dicas: [R`<p>Energia total: $2\times0{,}511$ MeV.</p>`, R`<p>Momento inicial é zero.</p>`], resp: R`Cada fóton: 0,511 MeV, $\lambda \approx 2{,}43$ pm. Dois para conservar o momento (saem em sentidos opostos).`, sol: R`<p>$\lambda = \frac{1240\text{ eV·nm}}{511\,000\text{ eV}} = 2{,}43\times10^{-3}$ nm, igual ao comprimento de onda Compton ${F.ret("C17")} (não é coincidência: $\lambda = h/(mc)$). É o sinal que o exame PET detecta.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>O LHC acelera prótons até 6,8 TeV. Qual o $\gamma$ deles? Quão perto da luz eles andam?</p>`, fig: "", dicas: [R`<p>$\gamma = E/(mc^2)$, com $mc^2 = 938$ MeV.</p>`, R`<p>$1 - \beta \approx \frac{1}{2\gamma^2}$.</p>`], resp: R`$\gamma \approx 7250$; $1 - \beta \approx 10^{-8}$ (99,999999% de c).`, sol: R`<p>$\frac{6{,}8\times10^6}{938} \approx 7250$; $1 - \beta \approx \frac{1}{2\times7250^2} \approx 9{,}5\times10^{-9}$. Um próton desses dá ~11 000 voltas por segundo nos 27 km do anel.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-qk"); e.outerHTML = F.lab("Monte hádrons com quarks", "lab-qk"); SIM.quarks(document.getElementById("lab-qk"), F); },
});
