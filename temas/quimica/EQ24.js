/* Química EQ24 · Experimento: cristalização. Simulação SIM.eqCristal (assets/sims/quimica/exp-solucoes.js): 100 g de água, m gramas de sal, temperatura de 0 a 100 °C.
   Curvas de solubilidade: SIM.SOLUB / SIM.solub (assets/sims/quimica/solucoes.js; fonte em tools/quimica/dadosE.json): KNO₃ 31,6 g a 20 °C e 110 g a 60 °C;
   NaCl 35,89 g a 20 °C e 38,99 g a 100 °C. Conta: cristais = m − s(T), se positivo. Com 110 g de KNO₃: a 60 °C tudo dissolvido; a 20 °C, 110 − 31,6 = 78,4 g de cristais.
   MODELO: sem supersaturação (o cristal aparece ao cruzar a curva); número de cristais ilustrativo (dito na tela).
   No teste (tests/texpq.js): as contas acima; dissolvido + cristais = m; reaquecer redissolve; NaCl quase não cristaliza ao esfriar. */
F.registrar("quimica/EQ24", {
  retoma: ["E05"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 24 · soluções</div><div class="q">Dissolva bastante sal de nitrato em água quente, deixe o copo quieto e volte no dia seguinte: há agulhas e blocos transparentes no fundo, de faces lisas, que ninguém esculpiu. De onde vieram, se o sal estava todo dissolvido?</div><p>Da diferença entre o que a água quente segura e o que a água fria segura. O que sobra tem de sair, e sai arrumado.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Escolha o sal e a quantidade, aqueça até dissolver tudo e esfrie, devagar ou depressa. Acompanhe o ponto no gráfico e a massa de cristais.</p><div id="exp-cri"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. A curva de solubilidade</h3>
        <p>Para cada temperatura há um máximo de soluto que a água dissolve: a <b>solubilidade</b>. Para a maioria dos sais ela cresce com a temperatura, mas não do mesmo jeito: a do $\ce{KNO3}$ mais que triplica entre 20 °C e 60 °C; a do NaCl quase não muda ${F.ret("E05")}.</p>
        <h3>2. Cruzar a curva</h3>
        ${F.formula(R`m_\text{cristais} = m_\text{colocado} - s(T) \qquad (\text{se der positivo})`)}
        <p>Uma solução com 110 g de $\ce{KNO3}$ em 100 g de água está no limite a 60 °C. Esfriada a 20 °C, a água só segura 31,6 g: os outros 78,4 g cristalizam. É assim que se purifica um sólido por <b>recristalização</b>: dissolve-se a quente, esfria-se, e o sal sai puro, deixando na água as impurezas que estavam em pequena quantidade.</p>
        <h3>3. Por que cristais, e não pó</h3>
        <p>Ao sair da solução, os íons se encaixam um a um no retículo, repetindo o mesmo padrão. Com tempo, poucos cristais crescem bastante e ficam bem formados. Esfriando depressa, muitos cristais começam ao mesmo tempo e disputam o mesmo sal: ficam pequenos.</p>
        ${F.caixa("fisico", R`<p><b>O rendimento está no gráfico.</b> A massa de cristais é a distância vertical entre o ponto e a curva. Um sal de curva íngreme rende muito ao esfriar; um de curva plana, quase nada, e só cristaliza evaporando a água. Antes de esfriar, leia no gráfico quanto vai sair.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>"Corpo de fundo" não é sujeira.</b> É soluto além do limite: a solução está saturada.</p><p><b>Unidade da curva.</b> Gramas de soluto por 100 g de <b>água</b>, não de solução.</p><p><b>Supersaturação.</b> Na prática, uma solução esfriada com cuidado pode passar do limite sem cristalizar, até que um grão ou um abalo dispare tudo de uma vez. O experimento não mostra isso.</p>`)}
        ${F.caixa("pegadinha", R`<p>Em casa, dá para crescer cristais com segurança usando açúcar ou sal de cozinha em água quente (com um adulto por perto, por causa da água quente) e um barbante pendurado no copo. Sulfato de cobre dá cristais azuis muito bonitos, mas é tóxico: luvas, nada de usar copos e colheres da cozinha, e a solução que sobra não vai para o ralo: guarde num frasco rotulado.</p>`, "Segurança e descarte")}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-cri"); e.outerHTML = F.lab("Cristalização: aquecer, dissolver, esfriar e ver crescer", "exp-cri"); SIM.eqCristal(document.getElementById("exp-cri"), F); },
});
