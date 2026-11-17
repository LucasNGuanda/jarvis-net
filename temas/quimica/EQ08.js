/* Química EQ08 · Experimento: titulação na bureta, com gotas caindo no tempo. Simulação SIM.eqBureta (assets/sims/quimica/exp-reacoes.js).
   A química é a do módulo J (SIM.titula, em analitica.js): pH pelo balanço de carga a 25 °C; Ka do ácido acético e faixas dos indicadores com fonte em tools/quimica/dadosJ.json.
   Cada gota: 0,05 mL; a gota só conta quando chega ao erlenmeyer. Amostras A, B e C hipotéticas: equivalência em 12,50, 20,00 e 31,25 mL; 0,05, 0,08 e 0,125 mol/L.
   No teste (tests/texpq.js): 250 gotas = 12,50 mL; HCl amostra A: incolor até a equivalência e rosa uma gota depois; passar do ponto leva o pH acima de 11. */
F.registrar("quimica/EQ08", {
  retoma: ["J03", "E07", "F08"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 8 · reações</div><div class="q">Na bancada, a titulação parece fácil: abrir a torneira e parar quando mudar de cor. Na prática, quase todo mundo passa do ponto na primeira vez. Por que é tão fácil errar, se a cor avisa?</div><p>Porque perto do fim o pH salta várias unidades com uma única gota. Aqui você controla a torneira e vê, ao mesmo tempo, a cor no erlenmeyer e a curva de pH se desenhando.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Escolha o ácido, a amostra e o indicador. Abra a torneira, feche quando a cor começar a aparecer e termine gota a gota. Calcule a concentração e só então peça para ver.</p><div id="exp-bur"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. A conta</h3>
        ${F.formula(R`C_\text{ácido}\,V_\text{ácido} = C_\text{base}\,V_\text{base} \qquad (\text{proporção } 1 : 1)`)}
        <p>No ponto de equivalência, os mols de base adicionados igualam os mols de ácido que havia no erlenmeyer ${F.ret("J03")}. Como a base é 0,1 mol/L e a amostra tem 25,00 mL, basta ler o volume gasto.</p>
        <h3>2. Por que o fim é tão brusco</h3>
        <p>O pH é uma escala logarítmica ${F.ret("F08")}. Enquanto sobra bastante ácido, cada gota de base neutraliza uma fração pequena dele, e o pH quase não se mexe. Quando resta um milésimo do ácido, a mesma gota neutraliza tudo o que sobrou e ainda deixa base em excesso: o pH pula de 4 para 10. Na curva, é o trecho quase vertical.</p>
        <h3>3. Técnica</h3>
        <p>Longe do ponto, pode-se deixar escoar. Quando a cor aparece onde a gota cai e demora a sumir ao agitar, está perto: fecha-se a torneira e segue-se <b>gota a gota</b>, agitando. O ponto final é a primeira cor que <b>permanece</b>. Uma gota tem cerca de 0,05 mL; passar duas gotas num volume de 20 mL já é meio por cento de erro.</p>
        <h3>4. O indicador certo</h3>
        <p>Com o ácido acético (fraco), a equivalência fica em pH básico, perto de 8,7. A fenolftaleína vira ali. Troque para alaranjado de metila e repita: a cor muda aos poucos, muito antes da equivalência, e a "leitura" sai errada mesmo com a técnica perfeita ${F.ret("E07")}.</p>
        ${F.caixa("fisico", R`<p><b>Faça uma titulação de reconhecimento.</b> Na bancada, a primeira corrida é rápida e serve só para saber mais ou menos onde está o ponto. Na segunda, escoa-se direto até 1 mL antes e termina-se gota a gota. Faça o mesmo aqui: uma vez com a torneira aberta, outra com cuidado.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Ler a bureta ao contrário.</b> A escala cresce para baixo: lê-se o volume que <b>saiu</b>.</p><p><b>Parar na primeira cor.</b> A cor que some ao agitar ainda não é o ponto final.</p><p><b>Equivalência em pH 7.</b> Só para ácido forte com base forte.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-bur"); e.outerHTML = F.lab("Bureta: abra a torneira e pare na viragem", "exp-bur"); SIM.eqBureta(document.getElementById("exp-bur"), F); },
});
