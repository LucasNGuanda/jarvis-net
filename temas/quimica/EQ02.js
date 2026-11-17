/* Química EQ02 · Experimento: pistão vivo. Simulação SIM.eqPistao (assets/sims/quimica/exp-gases.js): gás ideal 2D (moléculas sem interação entre si),
   base com termostato, pistão com massa e peso, colisões elásticas com o pistão em movimento. Em 2D: P·(L·h) = N·kT, logo a altura de equilíbrio é h = N·kT/peso.
   No teste (tests/texpq.js, semente fixa): pistão travado, PV/NkT a menos de 5% de 1; pistão livre, altura média a menos de 6% de N·kT/peso; dobrar T dobra a altura. */
F.registrar("quimica/EQ02", {
  retoma: ["E01", "E02"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 2 · gases</div><div class="q">O ar de um pneu segura o peso de um carro. Mas o ar é feito de moléculas soltas, com espaço vazio entre elas. O que, exatamente, está empurrando?</div><p>Batidas. Bilhões delas por segundo. A pressão de um gás é o resultado médio das moléculas se chocando contra a parede, e neste experimento a parede é um pistão que sente cada uma.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Com o pistão livre, mude a temperatura, o peso ou o número de moléculas e veja onde ele vai parar. Depois trave o pistão e olhe a pressão medida.</p><div id="exp-pis"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Pressão é taxa de batidas</h3>
        ${F.formula(R`P = \frac{\text{força}}{\text{área}} = \frac{\text{momento entregue à parede por segundo}}{\text{área}}`)}
        <p>Cada molécula que bate no pistão e volta entrega a ele um empurrãozinho (a variação do seu momento). Somando todos os empurrões de um segundo e dividindo pela área, sai a pressão ${F.ret("E02")}. É assim que o experimento mede $P$: ele não usa a fórmula dos gases, só conta batidas.</p>
        <h3>2. As leis dos gases, sem decorar</h3>
        ${F.formula(R`PV = NkT \qquad (\text{ou } PV = nRT)`)}
        <p><b>Aquecer</b> (pistão livre): as moléculas batem mais forte e mais vezes; o pistão sobe até a pressão voltar a equilibrar o peso. Volume proporcional à temperatura: Charles. <b>Mais peso</b>: o pistão desce, o gás fica mais denso, as batidas ficam mais frequentes até segurar o peso novo. Pressão vezes volume constante: Boyle. <b>Mais moléculas</b>: mais batidas, o pistão sobe. Volume proporcional a $N$: Avogadro. <b>Pistão travado e base mais quente</b>: a pressão sobe com a temperatura: Gay-Lussac ${F.ret("E01")}.</p>
        <h3>3. Por que o pistão treme</h3>
        <p>Com poucas dezenas de moléculas, as batidas não chegam de modo uniforme, e o pistão oscila em volta da altura prevista. Num cilindro de verdade há algo como $10^{22}$ moléculas: as flutuações existem, mas são pequenas demais para ver. A linha tracejada do gráfico é a previsão de $PV = NkT$; a curva azul é o que o pistão faz.</p>
        ${F.caixa("fisico", R`<p><b>Um teste que vale ouro.</b> Antes de mexer num controle, diga para onde o pistão vai e por quanto. Dobrar a temperatura em kelvin dobra a altura; dobrar o peso corta a altura pela metade. Se a sua previsão errar por um fator, quase sempre foi a temperatura em graus Celsius no lugar de kelvin.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>O gás não "empurra para cima".</b> Ele bate em todas as paredes igualmente; o pistão só é a única que pode se mexer.</p><p><b>Modelo ideal.</b> Aqui as moléculas não se enxergam: não se atraem nem ocupam espaço. O que muda quando isso deixa de valer está no experimento do gás real.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-pis"); e.outerHTML = F.lab("Pistão vivo: pressão são batidas", "exp-pis"); SIM.eqPistao(document.getElementById("exp-pis"), F); },
});
