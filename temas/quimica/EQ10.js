/* Química EQ10 · Experimento: eletrólise com o tempo correndo. Simulação SIM.eqEletrolise (assets/sims/quimica/exp-eletro.js).
   Lei de Faraday: n(e⁻) = i·t/F, F = 96485 C/mol; produto = n(e⁻)/z. Água: H₂ (z = 2) no cátodo e O₂ (z = 4) no ânodo. Cobre com eletrodos de cobre: z = 2 nos dois.
   NaCl fundido: Na (z = 1) no cátodo e Cl₂ (z = 2) no ânodo. Gases a 25 °C e 1 atm: 24,47 L/mol (R·T/P).
   Produtos de cada eletrólise e leis de Faraday: tools/quimica/dadosX.json, seção "eletrolise". Massas molares arredondadas do site (Cu 63,5; Na 23).
   No teste (tests/texpq.js): 965 C → 0,0100 mol de e⁻ → 0,3175 g de Cu; 122 mL de H₂ e 61 mL de O₂ (razão 2); o ânodo de cobre perde o que o cátodo ganha. */
F.registrar("quimica/EQ10", {
  retoma: ["G03", "G01"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 10 · eletroquímica</div><div class="q">A água não se desfaz sozinha em hidrogênio e oxigênio, e um prego não se cobre de cobre por vontade própria. Mas ligue uma fonte, e as duas coisas acontecem. Quanto produto sai, e de que isso depende?</div><p>Depende só de quantos elétrons a fonte empurrou. A eletrólise é uma reação comandada pela corrente, e a conta é uma das mais limpas da química.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Escolha o sistema, ajuste a corrente e acompanhe os produtos crescendo. Compare o volume dos dois gases da água e a massa dos dois eletrodos de cobre.</p><div id="exp-ele"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. A pilha ao contrário</h3>
        <p>Numa pilha, uma reação espontânea produz corrente. Na eletrólise, a corrente de uma fonte <b>força</b> uma reação que não aconteceria sozinha ${F.ret("G01")}. A fonte puxa elétrons de um eletrodo (o <b>ânodo</b>, positivo, onde há oxidação) e os empurra para o outro (o <b>cátodo</b>, negativo, onde há redução).</p>
        <h3>2. A lei de Faraday</h3>
        ${F.formula(R`Q = i\,t \qquad n(\ce{e-}) = \frac{Q}{F} \qquad m = \frac{Q}{F}\cdot\frac{M}{z}`)}
        <p>A carga que passou é corrente vezes tempo. Dividida pela constante de Faraday (96 485 C por mol de elétrons), dá os mols de elétrons. Cada produto precisa de um número certo $z$ de elétrons por unidade: 2 para um átomo de cobre, 2 para uma molécula de $\ce{H2}$, 4 para uma de $\ce{O2}$ ${F.ret("G03")}.</p>
        <h3>3. Três casos</h3>
        <p><b>Água.</b> $\ce{2 H2O -> 2 H2 + O2}$. Sai o dobro de hidrogênio em volume: a mesma carga faz duas vezes mais moléculas de $\ce{H2}$ que de $\ce{O2}$.</p>
        <p><b>Cobre com eletrodos de cobre.</b> No ânodo, o cobre do eletrodo se oxida e vai para a solução; no cátodo, $\ce{Cu^{2+}}$ da solução se deposita. Um perde exatamente o que o outro ganha, e a solução não muda. É o princípio da cobreação (eletrodeposição de cobre): o ânodo de cobre repõe na solução os íons que o cátodo retira.</p>
        <p><b>Cloreto de sódio fundido.</b> Sem água, os únicos íons são $\ce{Na+}$ e $\ce{Cl-}$: sai sódio metálico no cátodo e cloro no ânodo.</p>
        ${F.caixa("fisico", R`<p><b>Dobre uma coisa de cada vez.</b> Dobrar a corrente, ou dobrar o tempo, dobra o produto: o que conta é o produto $i\cdot t$. Trocar o metal muda a massa, mas não os mols de elétrons. Em qualquer problema de eletrólise, passe primeiro por mols de elétrons; o resto é estequiometria.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Sinais trocados.</b> Na eletrólise, o cátodo é o polo negativo e o ânodo, o positivo. O que não muda nunca: oxidação no ânodo, redução no cátodo.</p><p><b>Esquecer o $z$.</b> A mesma carga deposita menos mols de um metal de carga 3+ do que de um de carga 1+.</p><p><b>Tempo em minutos.</b> Na fórmula, segundos.</p>`)}
        ${F.caixa("pegadinha", R`<p>Eletrólise de água com pilhas comuns e eletrodos de grafite (mina de lapiseira) é segura em pequena escala, com um adulto: os gases saem em quantidade mínima. Nunca use a tomada, e nunca faça eletrólise de salmoura em lugar fechado: forma-se cloro, que é tóxico. Sal fundido é coisa de indústria. A solução de sulfato de cobre da cobreação não vai para o ralo: guarde para reutilizar ou descartar como resíduo com metal.</p>`, "Segurança e descarte")}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-ele"); e.outerHTML = F.lab("Eletrólise: a corrente obriga a reação", "exp-ele"); SIM.eqEletrolise(document.getElementById("exp-ele"), F); },
});
