/* Química EQ07 · Experimento: Le Chatelier ao vivo. Simulação SIM.eqLeChatelier (assets/sims/quimica/exp-reacoes.js): N₂O₄ ⇌ 2 NO₂ com partículas.
   Quebra: cada N₂O₄ se parte com taxa kd = 0,25·e^(6·(1 − 300/T)) por segundo. Junção: dois NO₂ que se chocam se unem com probabilidade 0,5.
   Paredes térmicas. O número de átomos de N se conserva (conferido no teste). MODELO: taxas escolhidas para a simulação.
   Dados da reação real (cores, sinal do ΔH): tools/quimica/dadosX.json, seção "equilibrios_classicos".
   No teste (tests/texpq.js, semente fixa): Q médio igual (a menos de 25%) com volume 1 e volume 0,5 na mesma temperatura; a fração de NO₂ cai ao apertar e sobe ao aquecer. */
F.registrar("quimica/EQ07", {
  retoma: ["F06", "F07"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 7 · reações</div><div class="q">Uma seringa fechada com um gás castanho. Aperta-se o êmbolo: o gás escurece na hora e, em seguida, clareia sozinho. Mergulha-se a seringa em água quente: escurece e fica. O que as moléculas estão fazendo?</div><p>Estão num equilíbrio: uma reação que vai e volta sem parar. Mexer no volume ou na temperatura desfaz o empate, e o sistema responde. Aqui dá para ver cada molécula fazendo isso.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Espere o gráfico assentar. Depois aperte o pistão, aqueça e injete NO₂, uma coisa de cada vez, e acompanhe o valor de Q.</p><div id="exp-lc"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Equilíbrio é empate, não parada</h3>
        ${F.formula(R`\ce{N2O4(g) <=> 2 NO2(g)} \qquad K = \frac{[\ce{NO2}]^2}{[\ce{N2O4}]}`)}
        <p>No equilíbrio, a cada segundo se quebram tantos $\ce{N2O4}$ quantos se formam. As quantidades ficam constantes em média (e tremendo em volta dela), mas nenhuma molécula está parada ${F.ret("F06")}. O quociente $Q$ tem a mesma forma de $K$, com as concentrações do momento; no equilíbrio, $Q = K$.</p>
        <h3>2. Apertar</h3>
        <p>Reduzir o volume aumenta todas as concentrações de uma vez. Como o $\ce{NO2}$ entra ao quadrado, $Q$ fica maior que $K$. Em termos de moléculas: mais apertados, os $\ce{NO2}$ se encontram mais vezes, e a junção passa a ganhar da quebra. O sistema caminha para o lado com <b>menos moléculas</b>, até $Q$ voltar ao valor de $K$. É o que a seringa mostra: escurece (tudo mais concentrado) e depois clareia (parte do $\ce{NO2}$ virou $\ce{N2O4}$).</p>
        <h3>3. Aquecer</h3>
        <p>A quebra do $\ce{N2O4}$ absorve calor. Aquecer favorece o sentido endotérmico: a quebra acelera muito mais que a junção, forma-se mais $\ce{NO2}$, e o gás escurece. Aqui o próprio $K$ muda: a temperatura é a única coisa que altera a constante de equilíbrio ${F.ret("F07")}.</p>
        <h3>4. Injetar</h3>
        <p>Acrescentar $\ce{NO2}$ aumenta $Q$. O sistema consome <b>parte</b> do que foi posto (nunca tudo) até $Q = K$ de novo.</p>
        ${F.caixa("fisico", R`<p><b>Le Chatelier é consequência, não lei.</b> O sistema não "quer" nada nem "se opõe" a ninguém. Cada perturbação muda as velocidades da ida e da volta de modo diferente, e o saldo aparece como deslocamento. Para prever o sentido sem decorar, compare $Q$ com $K$: se $Q \gt K$, há produto demais e a reação anda para trás; se $Q \lt K$, anda para a frente.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>"O equilíbrio anula a perturbação."</b> Só em parte. Depois de apertar, há mais $\ce{NO2}$ por volume do que antes, mesmo com o deslocamento.</p><p><b>Volume não muda K.</b> Muda as concentrações; o sistema se rearranja e $Q$ volta ao mesmo $K$. Só a temperatura muda $K$.</p><p><b>Gás inerte a volume constante</b> não desloca nada: as concentrações dos participantes não mudam.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-lc"); e.outerHTML = F.lab("Le Chatelier ao vivo: aperte, aqueça, injete", "exp-lc"); SIM.eqLeChatelier(document.getElementById("exp-lc"), F); },
});
