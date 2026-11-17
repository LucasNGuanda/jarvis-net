/* Química EQ13 · Experimento: decaimento e meia-vida. Simulação SIM.eqDecaimento (assets/sims/quimica/exp-nuclear.js): 400 núcleos, cada um com probabilidade
   1 − 2^(−dt/T½) de decair a cada passo. Meias-vidas, modos e produtos: SIM.NUCL.MEIA, de tools/quimica/dadosX.json (seção "decaimento"; Wikipedia, página de cada isótopo),
   conferidos por tools/quimica/confere-dadosX.py: ¹⁴C 5700 anos; ¹³¹I 8,0249 dias; ³H 12,32 anos; ¹³⁷Cs 30,04 anos; ²²⁶Ra 1600 anos; ²²²Rn 3,8215 dias; ²¹⁰Po 138,376 dias; ²³⁸U 4,463·10⁹ anos.
   No teste (tests/texpq.js, semente fixa): depois de 1, 2 e 3 meias-vidas restam 200, 100 e 50 núcleos, dentro de 3 desvios padrão; a idade calculada bate com o tempo decorrido. */
F.registrar("quimica/EQ13", {
  retoma: ["B08", "F05"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 13 · nuclear</div><div class="q">Um núcleo de carbono-14 pode decair daqui a um segundo ou daqui a dez mil anos, e não existe jeito de saber qual. Mesmo assim, um laboratório consegue medir a idade de um osso de milhares de anos. Como o imprevisível vira relógio?</div><p>Porque ninguém mede um núcleo: mede-se uma multidão. E o acaso, em multidão, obedece a uma lei exata.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Acompanhe os núcleos decaindo e compare a contagem com a curva. Troque o isótopo, comece de novo várias vezes e veja o que muda e o que não muda.</p><div id="exp-dec"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. A regra do jogo</h3>
        <p>Cada núcleo radioativo tem, a cada instante, a mesma probabilidade de decair, não importa há quanto tempo exista. Ele não envelhece. Com essa única regra, o número de decaimentos por segundo fica proporcional ao número de núcleos que ainda restam ${F.ret("F05")}.</p>
        ${F.formula(R`N(t) = N_0\left(\tfrac12\right)^{t/T_{1/2}} = N_0\,e^{-\lambda t} \qquad T_{1/2} = \frac{\ln 2}{\lambda}`)}
        <h3>2. Meia-vida</h3>
        <p>A <b>meia-vida</b> é o tempo para a quantidade cair à metade. Depois de uma meia-vida resta 1/2; de duas, 1/4; de três, 1/8. Ela é característica de cada isótopo ${F.ret("B08")} e varia enormemente: 8 dias para o iodo-131, 5700 anos para o carbono-14, 4,46 bilhões de anos para o urânio-238.</p>
        <h3>3. Do que resta ao tempo que passou</h3>
        ${F.formula(R`t = T_{1/2}\cdot\log_2\frac{N_0}{N}`)}
        <p>Medindo que fração do isótopo ainda existe, calcula-se o tempo decorrido. É a datação: carbono-14 para restos de seres vivos, urânio para rochas. No experimento, a "idade calculada" usa a contagem do momento e, por isso, erra um pouco: é o mesmo erro estatístico de uma datação real, que diminui quando há mais núcleos.</p>
        ${F.caixa("fisico", R`<p><b>Recomece várias vezes.</b> A curva laranja nunca é igual, e sempre acompanha a tracejada. O desvio típico numa contagem de $N$ núcleos é da ordem de $\sqrt{N}$: com 400, uns 5%; com $10^{20}$, uma parte em dez bilhões. A lei do decaimento é exata no limite de muitos núcleos, e só nele.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>"Depois de duas meias-vidas, acabou."</b> Resta um quarto.</p><p><b>Meia-vida não é metade da vida.</b> Um núcleo não tem prazo de validade; a meia-vida é do conjunto.</p><p><b>A massa não some.</b> O núcleo vira outro elemento (o produto); a amostra continua lá, com outra composição.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-dec"); e.outerHTML = F.lab("Decaimento: o acaso que obedece a uma curva", "exp-dec"); SIM.eqDecaimento(document.getElementById("exp-dec"), F); },
});
