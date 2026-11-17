/* Química EQ12 · Experimento: fissão em cadeia. Simulação SIM.eqFissao (assets/sims/quimica/exp-nuclear.js).
   DADOS do ²³⁵U (tools/quimica/dadosX.json, seção "fissao"; conferidos por tools/quimica/confere-dadosX.py): cerca de 200 MeV por fissão e 2,5 nêutrons em média
   (Wikipedia "Nuclear fission"; a página "Uranium-235" dá 202,5 MeV e 2,43); exemplo de equação como a fonte escreve: n + ²³⁵U → ²³⁶U → ¹⁴⁴Ba + ⁸⁹Kr + 3 n.
   MODELO em 2D: cada fissão solta 2 ou 3 nêutrons (meio a meio); o tamanho que dá k = 1 na tela não é a massa crítica real (dito na tela).
   No teste (tests/texpq.js, semente fixa, 30 disparos por caso): amostra pequena morre; amostra grande e pura consome quase tudo; barras e núcleos não físseis reduzem as fissões. */
F.registrar("quimica/EQ12", {
  retoma: ["B08"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 12 · nuclear</div><div class="q">Um pedaço pequeno de urânio enriquecido pode ficar numa prateleira para sempre sem que nada aconteça. Junte pedaços suficientes e a mesma substância libera, em um instante, uma quantidade enorme de energia. O que muda com o tamanho?</div><p>Muda quantos nêutrons escapam antes de achar outro núcleo. Uma reação em cadeia é uma conta de natalidade e mortalidade de nêutrons.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Dispare um nêutron e veja o que acontece. Mude o tamanho da amostra, a fração de núcleos físseis e o número de barras de controle.</p><div id="exp-fis"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Uma fissão</h3>
        ${F.formula(R`\ce{^1_0n + ^{235}_{92}U -> ^{236}_{92}U -> ^{144}_{56}Ba + ^{89}_{36}Kr + 3 ^1_0n}`)}
        <p>Um núcleo de urânio-235 que captura um nêutron fica instável e se parte em dois núcleos médios, soltando nêutrons e cerca de 200 MeV de energia ${F.ret("B08")}. O par de fragmentos varia de uma fissão para outra; o número de nêutrons também: 2,5 em média. Confira a equação: os números de massa somam 236 dos dois lados, e os atômicos, 92.</p>
        <h3>2. O fator de multiplicação</h3>
        ${F.formula(R`k = \frac{\text{nêutrons que provocam fissão numa geração}}{\text{nêutrons que provocaram fissão na geração anterior}}`)}
        <p>Cada fissão solta nêutrons, mas nem todos causam outra: uns <b>escapam</b> pela superfície, outros são <b>absorvidos</b> por núcleos que não fissionam. Se $k \lt 1$ (subcrítico), cada geração é menor e a reação morre. Se $k = 1$ (crítico), ela se mantém constante: é o regime de um reator. Se $k \gt 1$ (supercrítico), cresce exponencialmente.</p>
        <h3>3. Tamanho, pureza e controle</h3>
        <p>Numa amostra pequena, a superfície é grande em relação ao volume e os nêutrons fogem: existe um tamanho mínimo para a reação se sustentar, a <b>massa crítica</b>. Diluir os núcleos físseis entre outros que só absorvem também baixa $k$. As <b>barras de controle</b> são feitas de elementos que absorvem nêutrons (boro, cádmio, entre outros): descendo ou subindo as barras, o operador ajusta $k$. Em muitos reatores há ainda um <b>moderador</b>, um material que freia os nêutrons rápidos sem capturá-los.</p>
        ${F.caixa("fisico", R`<p><b>Olhe o gráfico de gerações.</b> Barras crescendo: supercrítico. Barras iguais: crítico. Barras encolhendo: subcrítico. Dispare vários nêutrons na mesma configuração: perto de $k = 1$, um disparo morre na segunda geração e outro incendeia a amostra toda. É o acaso das primeiras gerações, quando há poucos nêutrons.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Fissão não é decaimento.</b> O decaimento é espontâneo; a fissão em cadeia é provocada por nêutrons.</p><p><b>De onde vem a energia.</b> Da diferença de massa: os produtos pesam um pouco menos que o núcleo original mais o nêutron, cerca de 0,1% da massa.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-fis"); e.outerHTML = F.lab("Fissão em cadeia: um nêutron, dois ou três de volta", "exp-fis"); SIM.eqFissao(document.getElementById("exp-fis"), F); },
});
