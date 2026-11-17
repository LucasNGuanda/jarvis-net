/* Química EQ06 · Experimento: catalisador. Simulação SIM.eqCatalisador (assets/sims/quimica/exp-reacoes.js): a mesma reação A + B → 2 C em duas caixas,
   Ea = 4 (sem) e Ea ajustável (com), em unidades de kT a 300 K. Razão prevista das frações eficazes: e^((Ea − Ec)/kT); com Ec = 2 a 300 K: e² = 7,4.
   O catalisador entra como barreira menor (não aparece como partícula): MODELO, dito na tela.
   Definição de catalisador (não é consumido, baixa a energia de ativação, não muda o equilíbrio): tools/quimica/dadosX.json, seção "catalise". */
F.registrar("quimica/EQ06", {
  retoma: ["F04", "F06"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 6 · reações</div><div class="q">Para acelerar uma reação, dá para aquecer. Mas o seu corpo faz milhares de reações a 37 °C, depressa, sem ferver nada. Como se acelera uma reação sem dar mais energia às moléculas?</div><p>Baixando a barreira em vez de aumentar o salto. É o que faz um catalisador: oferece um caminho diferente, mais fácil, entre os mesmos reagentes e os mesmos produtos.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>As duas caixas começam iguais. Compare o ritmo e veja onde cada uma termina. Depois mude a barreira do caminho catalisado e a temperatura.</p><div id="exp-cat"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Outro caminho</h3>
        <p>O catalisador participa da reação: liga-se aos reagentes, forma intermediários e é devolvido no fim. O caminho que ele abre tem etapas com energia de ativação menor ${F.ret("F04")}. Com a barreira mais baixa, uma fração muito maior dos choques passa a ser eficaz, na mesma temperatura.</p>
        ${F.formula(R`\frac{k_\text{com}}{k_\text{sem}} = e^{(E_a - E_a')/RT}`)}
        <p>Com as frequências de choque iguais, a razão das velocidades é a razão dos fatores de Arrhenius. Baixar a barreira de 4 para 2 unidades, a 300 K, multiplica a velocidade por $e^2 \approx 7{,}4$.</p>
        <h3>2. O que o catalisador não faz</h3>
        <p>No perfil de energia, o ponto de partida e o de chegada são os mesmos nos dois caminhos. Por isso o catalisador <b>não muda o $\Delta H$</b>, <b>não muda a constante de equilíbrio</b> ${F.ret("F06")} e não faz acontecer uma reação que não aconteceria sozinha. Ele só faz o sistema chegar antes aonde chegaria de qualquer jeito, e acelera igualmente a ida e a volta. E <b>não é consumido</b>: uma pequena quantidade serve para muito reagente.</p>
        <h3>3. Temperatura e catalisador</h3>
        <p>Aqueça as duas caixas: a diferença entre elas diminui. Quanto mais quente, menos a barreira importa, e menos o catalisador ajuda. Catalisador faz mais diferença justamente a frio, que é onde a vida trabalha.</p>
        ${F.caixa("fisico", R`<p><b>Leia a barra verde.</b> As duas caixas acabam com tudo reagido, mas em tempos bem diferentes. Em laboratório, é assim que se reconhece um catalisador: mesma quantidade final de produto, tempo menor, e a substância recuperada intacta no fim.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>"Catalisador fornece energia."</b> Não fornece nada: muda o caminho.</p><p><b>"Catalisador aumenta o rendimento."</b> No equilíbrio, não. Ele só faz chegar mais rápido.</p><p><b>"Não participa da reação."</b> Participa, e muito; só não é gasto no balanço final.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-cat"); e.outerHTML = F.lab("Catalisador: outro caminho, mesma chegada", "exp-cat"); SIM.eqCatalisador(document.getElementById("exp-cat"), F); },
});
