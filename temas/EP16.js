/* EP16 · Fissão e fusão. Conferido em Python: fórmula semiempírica (a_V = 15,75; a_S = 17,8; a_C = 0,711; a_A = 23,7 MeV) dá B/A = 8,83 em A = 56 e 7,65 em A = 235;
   fissão ²³⁵U → ¹⁴¹Ba + ⁹²Kr + 3n: 141·8,326 + 92·8,513 − 235·7,591 ≈ 173 MeV; fusão D + T → ⁴He + n: 4·7,074 − (2·1,112 + 3·2,827) = 17,6 MeV;
   cadeia com 1000 nêutrons em 30 gerações: k = 0,9 cai a ~40; k = 1,0 oscila em torno de 800–900; k = 1,1 passa de 17 000. */
F.registrar("EP16", {
  retoma: ["C19", "C19b"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 16 · nuclear</div><div class="q">Uma usina nuclear e uma bomba usam o mesmo urânio e a mesma reação. O que faz uma ficar estável por décadas e a outra explodir em um milionésimo de segundo? E por que o Sol, ao contrário, ganha energia juntando núcleos?</div><p>A resposta para a primeira é um número só, o fator de multiplicação; para a segunda, uma curva.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Comece no crítico e mexa no fator de multiplicação. Repare no gráfico em escala log: crescimento exponencial vira reta.</p><div id="lab-nuclear"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Reação em cadeia</h3>
        <p>Se cada geração de nêutrons gera, em média, $k$ vezes mais nêutrons na seguinte, depois de $g$ gerações $N = N_0k^g$: decai se $k < 1$, cresce exponencialmente se $k > 1$. Num reator, as barras de controle (cádmio, boro) absorvem nêutrons e mantêm $k = 1$; numa bomba, uma massa supercrítica é montada de repente, com $k$ bem maior que 1, e cada geração dura uns 10 nanossegundos.</p>
        ${F.formula(R`N_g = N_0\,k^g`)}
        <h3>2. Por que sai energia</h3>
        <p>A massa de um núcleo é menor que a soma das massas dos prótons e nêutrons separados; a diferença, vezes $c^2$, é a energia de ligação ${F.ret("C19")}. A energia de ligação <b>por núcleon</b> é máxima perto do ferro-56 (~8,8 MeV). Partindo das pontas em direção ao meio, ganha-se energia ${F.ret("C19b")}:</p>
        ${F.formula(R`{}^{235}\text{U} + n \to {}^{141}\text{Ba} + {}^{92}\text{Kr} + 3n\ (\approx 173\ \text{MeV});\qquad {}^2\text{H} + {}^3\text{H} \to {}^4\text{He} + n\ (17{,}6\ \text{MeV})`)}
        <p>Por núcleon, a fusão rende mais (17,6/5 ≈ 3,5 MeV contra 173/236 ≈ 0,7 MeV), mas exige temperaturas de ~100 milhões de kelvin para vencer a repulsão elétrica entre os núcleos.</p>
        ${F.caixa("fisico", R`<p><b>Em Oklo, no Gabão, a natureza fez reatores.</b> Há uns 2 bilhões de anos, quando o urânio natural tinha mais U-235, depósitos com água infiltrada ficaram críticos e funcionaram, ligando e desligando, por centenas de milhares de anos.</p>`)}
        ${F.caixa("pegadinha", R`<p><b>Crítico não é perigoso: é estável.</b> "Reator crítico" é o reator funcionando normalmente ($k = 1$). E a fórmula semiempírica da curva é uma aproximação: ela erra os núcleos leves (o hélio-4, muito estável, fica bem acima dela; compare com os pontos medidos).</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-nuclear"); e.outerHTML = F.lab("Fissão e fusão", "lab-nuclear"); SIM.fissaoFusao(document.getElementById("lab-nuclear"), F); },
});
