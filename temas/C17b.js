/* C17b · Átomo de Bohr e o átomo quântico (base: Halliday vol. 4, caps. 39 e 40, com as minhas palavras). Conferido em Python (scratchpad mod.py), hc = 1240 eV·nm:
   Eₙ = −13,6/n² eV; rₙ = 0,0529 n² nm; Balmer: 656, 486, 434, 410 nm; Lyman α = 122 nm, limite 91,2 nm; Paschen α = 1875 nm; v₁ ≈ c/137 = 2,19 × 10⁶ m/s;
   He⁺ (Z = 2): E₁ = −54,4 eV; Stern–Gerlach (exemplo 40-1 do Halliday): 0,079 mm; poço infinito de 0,1 nm: E₁ = 37,6 eV. */
F.registrar("C17b", {
  retoma: ["C17", "C02"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Contas com o átomo de Bohr",
      casos: [
        { nome: "Transição e cor da linha", gerar: (p) => {
          const ni = p ? 3 : F.escolha([2, 3, 4, 5, 6]), nf = p ? 2 : F.escolha([1, 2, 3].filter((v) => v < ni));
          const dE = 13.6 * (1 / (nf * nf) - 1 / (ni * ni)), lam = 1240 / dE;
          const faixa = lam < 380 ? "ultravioleta" : lam > 750 ? "infravermelho" : "visível";
          return { enun: R`<p>Um elétron do hidrogênio cai do nível $n = ${ni}$ para $n = ${nf}$. Qual a energia e o comprimento de onda do fóton emitido? Que tipo de luz é?</p>`, fig: "",
            passos: [
              R`<p>$E_n = -\frac{13{,}6\text{ eV}}{n^2}$: $E_{${ni}} = ${F.n(-13.6 / (ni * ni), 3)}$ eV e $E_{${nf}} = ${F.n(-13.6 / (nf * nf), 3)}$ eV.</p>`,
              R`<p>O fóton leva a diferença: $E_\gamma = E_{${ni}} - E_{${nf}} = ${F.n(dE, 3)}$ eV.</p>`,
              R`<p>$\lambda = \frac{1240}{${F.n(dE, 3)}} \approx ${F.n(lam, 0)}$ nm: <b>${faixa}</b>. Série de ${{ 1: "Lyman", 2: "Balmer", 3: "Paschen" }[nf]} (todas as quedas para $n = ${nf}$).${ni === 3 && nf === 2 ? " É a linha vermelha Hα, que dá a cor das nebulosas de hidrogênio." : ""}</p>`,
            ] };
        } },
        { nome: "Íon hidrogenoide", gerar: (p) => {
          const Z = p ? 2 : F.escolha([2, 3]), nome = Z === 2 ? "He⁺" : "Li²⁺";
          return { enun: R`<p>Qual a energia de ionização (a partir do estado fundamental) e o raio da 1ª órbita do íon ${nome} (núcleo com $Z = ${Z}$ e um elétron só)?</p>`, fig: "",
            passos: [
              R`<p>Com carga nuclear $Ze$, a força fica $Z$ vezes maior. Refazendo a dedução de Bohr: $E_n = -\frac{13{,}6\,Z^2}{n^2}$ eV e $r_n = \frac{0{,}0529\,n^2}{Z}$ nm.</p>`,
              R`<p>$E_1 = -13{,}6\times${Z * Z} = ${F.n(-13.6 * Z * Z, 1)}$ eV: são precisos ${F.n(13.6 * Z * Z, 1)} eV para arrancar o elétron.</p>`,
              R`<p>$r_1 = \frac{0{,}0529}{${Z}} \approx ${F.n(0.0529 / Z, 4)}$ nm: o elétron fica ${Z} vezes mais perto, mais preso. O modelo de Bohr funciona bem para qualquer átomo com <b>um</b> elétron.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Deduzir o átomo de Bohr e achar o 1/137",
      enun: R`<p>Suponha um elétron em órbita circular em torno de um próton, com momento angular quantizado: $L = mvr = n\hbar$ (equivalente a dizer que cabe um número inteiro de comprimentos de onda de de Broglie na órbita, $2\pi r = n\lambda$).</p><p>(a) Combine com a força de Coulomb fazendo o papel de centrípeta e ache $r_n$ e $v_n$. (b) Mostre que $E_n = -\frac{me^4}{8\varepsilon_0^2h^2}\frac{1}{n^2}$ e confira o 13,6 eV. (c) Mostre que $\frac{v_1}{c} = \frac{e^2}{4\pi\varepsilon_0\hbar c} \approx \frac{1}{137}$. Por que isso justifica não usar relatividade no hidrogênio?</p>`,
      fig: "",
      dicas: [R`<p>(a) $\frac{mv^2}{r} = \frac{ke^2}{r^2}$, com $k = \frac{1}{4\pi\varepsilon_0}$, e $mvr = n\hbar$. Duas equações, duas incógnitas.</p>`, R`<p>(b) $E = K + U = \frac12mv^2 - \frac{ke^2}{r}$. Pela centrípeta, $\frac12mv^2 = \frac{ke^2}{2r}$, então $E = -\frac{ke^2}{2r}$.</p>`],
      sol: R`<p><b>(a)</b> Da quantização, $v = \frac{n\hbar}{mr}$. Na centrípeta: $m\frac{n^2\hbar^2}{m^2r^3} = \frac{ke^2}{r^2} \Rightarrow r_n = \frac{n^2\hbar^2}{mke^2} = n^2a_0$, com $a_0 = 0{,}0529$ nm (raio de Bohr). E $v_n = \frac{ke^2}{n\hbar}$.</p>
        <p><b>(b)</b> $E_n = -\frac{ke^2}{2r_n} = -\frac{mk^2e^4}{2\hbar^2n^2} = -\frac{me^4}{8\varepsilon_0^2h^2n^2}$. Com os valores: $\frac{9{,}11\times10^{-31}\,(1{,}602\times10^{-19})^4}{8\,(8{,}854\times10^{-12})^2(6{,}626\times10^{-34})^2} = 2{,}18\times10^{-18}$ J $= 13{,}6$ eV ✓.</p>
        <p><b>(c)</b> $\frac{v_1}{c} = \frac{ke^2}{\hbar c} = \alpha \approx \frac{1}{137{,}036}$, a <b>constante de estrutura fina</b>, um número puro que mede a força do eletromagnetismo. Como $\frac vc \approx 0{,}7\%$, $\gamma - 1 \approx 3\times10^{-5}$: as correções relativísticas existem (elas separam as linhas espectrais em pares muito próximos, a "estrutura fina"), mas são pequenas.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Moderna · átomo</div>
        <div class="q">Por que o hidrogênio aquecido emite só algumas cores bem definidas, e não um arco-íris contínuo?</div>
        <p>Pela física clássica, um elétron girando em volta do núcleo irradiaria sem parar ${F.ret("EP05")}, perderia energia e cairia no núcleo em ~10⁻¹¹ s. Átomos não deveriam existir. Bohr (1913) propôs regras "proibidas" que funcionavam: o elétron só pode ter certas energias. As linhas do espectro são os saltos entre elas.</p></div>`),

      F.secao("bohr", "O modelo de Bohr", R`
        <ol><li>O elétron gira em órbitas circulares em que <b>não irradia</b> (estados estacionários).</li>
          <li>Só são permitidas órbitas com momento angular $L = n\hbar$, $n = 1, 2, 3, \dots$</li>
          <li>Ao saltar de um nível para outro, emite ou absorve um fóton com $hf = E_i - E_f$.</li></ol>
        ${F.formula(R`E_n = -\frac{13{,}6\text{ eV}}{n^2},\qquad r_n = n^2a_0,\ \ a_0 = 0{,}0529\text{ nm}`, "Níveis e raios do hidrogênio")}
        <p>Energia negativa quer dizer "preso": são precisos 13,6 eV para arrancar o elétron do estado fundamental (energia de ionização). A regra 2 parece arbitrária, mas ganha sentido com de Broglie ${F.ret("C17")}: a órbita precisa conter um número inteiro de comprimentos de onda do elétron, como uma corda vibrando com nós ${F.ret("O03")}.</p>
        <div id="lab-bohr"></div>`),

      F.secao("espectro", "O espectro do hidrogênio", R`
        ${F.formula(R`\frac{1}{\lambda} = R_H\left(\frac{1}{n_f^2} - \frac{1}{n_i^2}\right),\qquad R_H \approx 1{,}097\times10^7\text{ m}^{-1}`, "Fórmula de Rydberg")}
        <table class="tb"><tr><th>série</th><th>cai para</th><th>região</th><th>linhas</th></tr>
          <tr><td>Lyman</td><td>$n = 1$</td><td>ultravioleta</td><td>122 nm, 103 nm, …, limite 91,2 nm</td></tr>
          <tr><td>Balmer</td><td>$n = 2$</td><td>visível</td><td>656 (vermelho), 486 (azul-esverdeado), 434 e 410 nm (violeta)</td></tr>
          <tr><td>Paschen</td><td>$n = 3$</td><td>infravermelho</td><td>1875 nm, …</td></tr></table>
        <p>Balmer achou a fórmula das linhas visíveis em 1885, só por tentativa, 28 anos antes de Bohr explicar de onde ela vinha. Os espectros são a impressão digital dos elementos: é assim que se sabe do que as estrelas são feitas, e o hélio foi descoberto no Sol (1868) antes de ser achado na Terra.</p>`),

      F.secao("quantico", "Além de Bohr: o átomo quântico", R`
        <p>Bohr acerta as energias do hidrogênio, mas falha para átomos com mais elétrons e não explica a intensidade das linhas. A teoria certa é a de Schrödinger ${F.ret("U06")}: o elétron não tem órbita, tem uma <b>nuvem de probabilidade</b> $|\psi|^2$. A energia do hidrogênio sai a mesma de Bohr, mas cada estado ganha quatro números quânticos:</p>
        <table class="tb"><tr><th>número</th><th>valores</th><th>o que fixa</th></tr>
          <tr><td>$n$ (principal)</td><td>1, 2, 3, …</td><td>a energia (no hidrogênio) e o tamanho</td></tr>
          <tr><td>$\ell$ (orbital)</td><td>0, 1, …, n − 1 (s, p, d, f)</td><td>o módulo do momento angular, $\sqrt{\ell(\ell+1)}\hbar$</td></tr>
          <tr><td>$m_\ell$ (magnético)</td><td>−ℓ, …, +ℓ</td><td>a componente $L_z = m_\ell\hbar$</td></tr>
          <tr><td>$m_s$ (spin)</td><td>±½</td><td>o momento angular intrínseco do elétron</td></tr></table>
        <p>No estado fundamental, $\ell = 0$: o momento angular orbital é <b>zero</b> (Bohr dizia $\hbar$). O <b>princípio de exclusão de Pauli</b> (dois elétrons não podem ter os quatro números iguais) monta a tabela periódica camada por camada: é por isso que a química existe.</p>
        <p><b>Stern–Gerlach</b> (1922): átomos de prata atravessando um campo magnético não uniforme se separam em exatamente <b>dois</b> feixes, não num borrão contínuo. O momento magnético de spin só pode apontar "para cima" ou "para baixo": a quantização é real e mensurável (no exemplo do Halliday, cada feixe desvia 0,08 mm).</p>
        <p><b>Laser</b>: um fóton que passa por um átomo excitado pode estimular a emissão de um fóton gêmeo (mesma frequência, fase e direção). Com mais átomos excitados que no estado de baixo (inversão de população) e dois espelhos, a luz se amplifica em cascata: luz coerente e monocromática ${F.ret("O10b")}.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule o comprimento de onda da linha Hα ($3 \to 2$) e da Hβ ($4 \to 2$) do hidrogênio.</p>`, fig: "", dicas: [R`<p>$\Delta E = 13{,}6\left(\frac14 - \frac19\right)$ eV.</p>`, R`<p>$\lambda = 1240/\Delta E$ nm.</p>`], resp: R`Hα $\approx 656$ nm (vermelho); Hβ $\approx 486$ nm (azul-esverdeado).`, sol: R`<p>$\Delta E_{3\to2} = 1{,}889$ eV; $\Delta E_{4\to2} = 2{,}55$ eV. Confira no laboratório.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Qual o menor comprimento de onda que o hidrogênio emite? E quanta energia é preciso para ionizar um átomo que está em $n = 2$?</p>`, fig: "", dicas: [R`<p>O menor $\lambda$ é a maior energia: do "infinito" até $n = 1$.</p>`, R`<p>Ionizar de $n = 2$: levar de $-3{,}4$ eV a 0.</p>`], resp: R`$\approx 91{,}2$ nm (limite de Lyman); $3{,}4$ eV.`, sol: R`<p>$\frac{1240}{13{,}6} = 91{,}2$ nm. Fótons com $\lambda < 91{,}2$ nm ionizam o hidrogênio no estado fundamental: é por isso que o espaço entre as galáxias é opaco a essa luz.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Um gás de hidrogênio tem átomos excitados até $n = 4$. Quantas linhas diferentes ele pode emitir ao voltar ao fundamental? Quantas são visíveis?</p>`, fig: "", dicas: [R`<p>Conte os pares $(n_i, n_f)$ com $4 \geq n_i > n_f \geq 1$.</p>`, R`<p>Visíveis: as que terminam em $n = 2$.</p>`], resp: R`6 linhas; 2 visíveis (Hα e Hβ).`, sol: R`<p>$\binom42 = 6$: 4→3, 4→2, 4→1, 3→2, 3→1, 2→1. Visíveis: 3→2 (656 nm) e 4→2 (486 nm). A 4→3 é infravermelha; as que caem para 1, ultravioleta.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Qual o raio da órbita $n = 3$ do hidrogênio? E a velocidade do elétron em $n = 1$?</p>`, fig: "", dicas: [R`<p>$r_n = n^2a_0$.</p>`, R`<p>$v_1 = \frac{ke^2}{\hbar} \approx \frac{c}{137}$.</p>`], resp: R`$r_3 \approx 0{,}476$ nm; $v_1 \approx 2{,}19\times10^6$ m/s.`, sol: R`<p>$v_n = v_1/n$: quanto mais longe, mais devagar, como os planetas.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Qual a energia do estado fundamental do He⁺? Que comprimento de onda tem a transição $2 \to 1$ dele?</p>`, fig: "", dicas: [R`<p>$E_n = -13{,}6\,Z^2/n^2$ com $Z = 2$.</p>`, R`<p>$\Delta E = 54{,}4\times\frac34$.</p>`], resp: R`$-54{,}4$ eV; $\lambda \approx 30{,}4$ nm (ultravioleta extremo).`, sol: R`<p>$\Delta E = 40{,}8$ eV, $\lambda = 1240/40{,}8 \approx 30{,}4$ nm, exatamente $\frac14$ do Lyman α do hidrogênio.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Um elétron está preso numa "caixa" (poço infinito) de largura 0,1 nm. Usando que cabe um número inteiro de meias ondas, $L = n\frac\lambda2$, e $\lambda = h/p$, ache as energias permitidas e calcule $E_1$.</p>`, fig: "", dicas: [R`<p>$p = \frac{nh}{2L}$ e $E = \frac{p^2}{2m}$.</p>`, R`<p>$E_n = \frac{n^2h^2}{8mL^2}$.</p>`], resp: R`$E_n = \frac{n^2h^2}{8mL^2}$; $E_1 \approx 37{,}6$ eV.`, sol: R`<p>$\frac{(6{,}626\times10^{-34})^2}{8\cdot9{,}11\times10^{-31}\cdot10^{-20}} = 6{,}0\times10^{-18}$ J $\approx 37{,}6$ eV. Quanto menor a caixa, maior a energia mínima: é a incerteza de novo. Esse modelo explica as cores dos pontos quânticos (as telas "QLED"): partículas menores, luz mais azul.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Quantos elétrons cabem na camada $n = 2$? E na camada $n$ qualquer? Use os números quânticos e o princípio de Pauli.</p>`, fig: "", dicas: [R`<p>Para $n = 2$: $\ell = 0$ (1 valor de $m_\ell$) e $\ell = 1$ (3 valores), cada um com 2 spins.</p>`, R`<p>Em geral, some $2(2\ell + 1)$ de $\ell = 0$ a $n - 1$.</p>`], resp: R`8 na camada 2; $2n^2$ na camada $n$.`, sol: R`<p>$\sum_{\ell=0}^{n-1}2(2\ell + 1) = 2n^2$: 2, 8, 18, 32. São os tamanhos das linhas da tabela periódica (2, 8, 8, 18, 18, 32…; as repetições vêm da ordem em que as subcamadas enchem).</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-bohr"); e.outerHTML = F.lab("Níveis de energia e espectro do hidrogênio", "lab-bohr"); SIM.bohr(document.getElementById("lab-bohr"), F); },
});
