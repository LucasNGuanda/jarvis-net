/* Química EQ21 · Experimento: balanceador visual. Simulação SIM.eqBalanca (assets/sims/quimica/exp-reacoes.js): as 19 equações de SIM.EQS (reacoes2.js),
   átomos contados com SIM.atomos e conferidos com SIM.confere; a solução de menores inteiros vem de SIM.balanceia (eliminação com frações exatas).
   A balança compara as massas dos dois lados (SIM.mm, massas atômicas arredondadas do site): só fica na horizontal quando a equação está balanceada.
   No teste (tests/texpq.js): todas as 19 equações, com os coeficientes de SIM.balanceia, dão átomos e massas iguais; com tudo em 1, as não balanceadas acusam; o dobro dos coeficientes é reconhecido como "dá para simplificar". */
F.registrar("quimica/EQ21", {
  retoma: ["D03", "D02"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 21 · reações</div><div class="q">Queima-se um pedaço de palha de aço numa balança e ele fica <b>mais pesado</b>. Queima-se uma vela e ela some. A massa aumenta, diminui ou se conserva numa reação?</div><p>Conserva-se, sempre, desde que se conte tudo o que entrou e tudo o que saiu, inclusive os gases. Balancear uma equação é fazer essa contabilidade, átomo por átomo.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Mude os coeficientes com os botões até cada elemento ter o mesmo número de átomos dos dois lados. A balança mostra a massa de cada lado.</p><div id="exp-bal"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Átomos mudam de companhia</h3>
        <p>Numa reação química, os átomos não são criados nem destruídos: as ligações se desfazem e se refazem de outro jeito. Por isso o número de átomos de cada elemento é o mesmo antes e depois, e a massa total também (lei de Lavoisier ${F.ret("D03")}).</p>
        <h3>2. Coeficiente não é índice</h3>
        ${F.formula(R`\ce{2 H2 + O2 -> 2 H2O}`)}
        <p>O <b>índice</b> (o 2 de $\ce{H2O}$) faz parte da fórmula: diz o que a substância é. O <b>coeficiente</b> (o 2 na frente) diz quantas moléculas participam. Para balancear, só se mexe nos coeficientes. Trocar $\ce{H2O}$ por $\ce{H2O2}$ "para fechar a conta" seria trocar água por água oxigenada: outra substância, outra reação.</p>
        <h3>3. Um caminho que funciona</h3>
        <p>Comece pelo elemento que aparece em <b>uma só</b> substância de cada lado. Deixe para o fim o que aparece em várias (quase sempre o oxigênio) e as substâncias simples, como $\ce{O2}$, que se ajustam sem estragar o resto. Se sobrar uma fração, multiplique tudo pelo denominador. No fim, confira elemento por elemento e veja se os coeficientes são os <b>menores inteiros</b> possíveis ${F.ret("D02")}.</p>
        ${F.caixa("fisico", R`<p><b>A balança e os átomos dizem a mesma coisa.</b> Se cada elemento confere, a massa confere, porque a massa é a soma das massas dos átomos. O contrário não vale sempre: dá para acertar a massa total por coincidência com os átomos errados. Por isso se conferem os átomos, e a massa vem de brinde.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Mexer no índice.</b> Nunca. Só coeficientes.</p><p><b>Parar em coeficientes divisíveis.</b> $\ce{4 H2 + 2 O2 -> 4 H2O}$ tem os átomos certos, mas não é a forma balanceada: divida por 2.</p><p><b>Esquecer os parênteses.</b> Em $\ce{Ca3(PO4)2}$ há 2 fósforos e 8 oxigênios.</p><p><b>A palha de aço.</b> Ela ganha massa porque o oxigênio do ar entra na conta; a vela "some" porque os produtos são gases.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-bal"); e.outerHTML = F.lab("Balanceador visual: átomos dos dois lados", "exp-bal"); SIM.eqBalanca(document.getElementById("exp-bal"), F); },
});
