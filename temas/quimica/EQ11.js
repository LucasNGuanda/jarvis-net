/* Química EQ11 · Experimento: corrosão e proteção catódica. Simulação SIM.eqCorrosao (assets/sims/quimica/exp-eletro.js).
   QUEM corrói: decidido pelos potenciais padrão de SIM.ELETRO (Mg −2,37; Zn −0,76; Fe −0,44; Sn −0,14; Cu +0,34 V; OpenStax, em tools/quimica/dadosG.json):
   no par, oxida-se o metal de menor E° de redução. Precisa de água e de oxigênio. A VELOCIDADE do desenho é ilustrativa (dito na tela).
   Frases sobre ferrugem, ânodo de sacrifício, galvanização e corrosão galvânica: tools/quimica/dadosX.json, seção "corrosao".
   No teste (tests/texpq.js): sozinho, o ferro corrói; com Zn ou Mg, corrói o outro e o ferro fica intacto; com Sn ou Cu, o ferro corrói mais depressa que sozinho; sem água ou sem O₂, nada. */
F.registrar("quimica/EQ11", {
  retoma: ["G04", "G01"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 11 · eletroquímica</div><div class="q">Cascos de navio levam blocos de zinco parafusados que precisam ser trocados de tempos em tempos, porque somem. Ninguém conserta o defeito: os blocos estão lá justamente para sumir. Por que deixar um metal ser comido de propósito?</div><p>Porque, enquanto o zinco é comido, o aço do casco não é. A ferrugem é uma pilha indesejada, e dá para escolher quem faz o papel do ânodo.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Deixe o ferro sozinho na água e veja a ferrugem crescer. Depois encoste outro metal nele, um de cada vez, e tire a água ou o oxigênio.</p><div id="exp-cor"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. A ferrugem é uma pilha</h3>
        ${F.formula(R`\ce{Fe -> Fe^{2+} + 2 e-} \qquad\qquad \ce{O2 + 2 H2O + 4 e- -> 4 OH-}`)}
        <p>Numa região da superfície o ferro se oxida; os elétrons andam pelo próprio metal até outra região, onde o oxigênio dissolvido na água os recebe ${F.ret("G04")}. Os íons se encontram na água e acabam virando óxido de ferro hidratado: a ferrugem. Faltando água ou oxigênio, uma das meias reações não acontece e a corrosão para.</p>
        <h3>2. Dois metais encostados</h3>
        <p>Quando dois metais diferentes se tocam dentro da água, formam uma pilha em curto-circuito. O de <b>menor potencial de redução</b> vira o ânodo e se oxida; o outro vira o cátodo e fica protegido ${F.ret("G01")}.</p>
        <p><b>Zinco ou magnésio com ferro:</b> potenciais menores que o do ferro. Eles se oxidam, e o ferro só recebe elétrons. É a <b>proteção catódica</b> com <b>ânodo de sacrifício</b>. A galvanização (ferro revestido de zinco) funciona assim mesmo quando o revestimento é riscado.</p>
        <p><b>Estanho ou cobre com ferro:</b> potenciais maiores. Agora o ânodo é o ferro, e ele corrói <b>mais depressa</b> do que sozinho. Uma camada de estanho protege enquanto está inteira, só por isolar; riscada, piora.</p>
        ${F.caixa("fisico", R`<p><b>Uma tabela decide tudo.</b> Para saber quem se estraga num par de metais, não é preciso decorar casos: compare os potenciais de redução. O menor corrói. A mesma tabela que dá a tensão de uma pilha diz qual parafuso usar num barco.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>"Metal nobre protege."</b> Só enquanto cobre tudo. Em contato elétrico e com uma falha, o metal mais nobre acelera a corrosão do outro.</p><p><b>"Ferrugem é o ferro reagindo com a água."</b> Precisa do oxigênio também.</p><p><b>Velocidade.</b> A tabela de potenciais diz quem corrói, não quão depressa; no experimento a velocidade é só ilustrativa.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-cor"); e.outerHTML = F.lab("Corrosão: quem se sacrifica pelo ferro", "exp-cor"); SIM.eqCorrosao(document.getElementById("exp-cor"), F); },
});
