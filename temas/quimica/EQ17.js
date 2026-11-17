/* Química EQ17 · Experimento: forças intermoleculares pelos pontos de ebulição. Simulação SIM.eqEbulicao (assets/sims/quimica/exp-atomos2.js).
   DADOS: pontos de ebulição da caixa de dados da Wikipedia de cada substância (tools/quimica/dadosX.json, seção "forcas_intermoleculares"; conferidos por tools/quimica/confere-dadosX.py):
   CH₄ −161,49; C₂H₆ −88,5; C₃H₈ −42,25 a −42,04 (usa −42,145); C₄H₁₀ −1 a 1 (0); C₅H₁₂ 35,9 a 36,3 (36,1); C₆H₁₄ 68,5 a 69,1 (68,8);
   He −268,928; Ne −246,046; Ar −185,848; Kr −153,415; Xe −108,099; HF 19,5; HCl −85,05; HBr −66,8; HI −35,36;
   H₂O 99,98; H₂S −59,55; H₂Se −41,25; H₂Te −2,2; etanol 78,23; éter dimetílico −24 (°C).
   As bolinhas mostram o estado físico (líquido ou gás) na temperatura escolhida; não são uma dinâmica molecular (dito na tela).
   No teste (tests/texpq.js): ordem de ebulição de cada família; HF e H₂O fora da ordem das massas; a 25 °C só a água e o etanol continuam líquidos nas suas famílias. */
F.registrar("quimica/EQ17", {
  retoma: ["C06", "C05"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 17 · átomos e ligações</div><div class="q">H₂S, H₂Se e H₂Te fervem todos abaixo de zero. Pela tendência da família, a água, a mais leve, deveria ferver abaixo de todos eles. Ferve a 100 graus positivos. O que a água tem que os outros não têm?</div><p>Uma atração entre moléculas muito mais forte que a dos primos. Ferver é vencer essa atração, e o ponto de ebulição é o termômetro dela.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Escolha uma família, comece no frio e aqueça devagar. Anote a ordem em que as substâncias fervem e procure quem fura a fila.</p><div id="exp-ebu"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Três tipos de atração</h3>
        <p><b>Dispersão (London).</b> Existe entre quaisquer moléculas: a nuvem de elétrons oscila e cria dipolos instantâneos. Cresce com o número de elétrons e com a área de contato. É a única força nos alcanos e nos gases nobres ${F.ret("C06")}.</p>
        <p><b>Dipolo-dipolo.</b> Entre moléculas polares, que têm um lado positivo e um negativo permanentes ${F.ret("C05")}.</p>
        <p><b>Ligação de hidrogênio.</b> Um caso especialmente forte: hidrogênio ligado a F, O ou N, atraído pelo par isolado de outro F, O ou N.</p>
        <h3>2. O que as famílias mostram</h3>
        <p>Nos alcanos e nos gases nobres, o ponto de ebulição sobe a cada passo: mais elétrons, mais dispersão. Do HCl ao HI e do H₂S ao H₂Te, sobe também, pela mesma razão, embora a polaridade diminua: a dispersão pesa mais que o dipolo. Mas HF e H₂O, que deveriam ser os de menor ponto de ebulição, são os de maior. A diferença entre o esperado e o medido é a ligação de hidrogênio.</p>
        <h3>3. Mesma fórmula, outra história</h3>
        <p>Etanol e éter dimetílico são isômeros: $\ce{C2H6O}$, mesma massa. O etanol tem um grupo O–H e faz ligação de hidrogênio; o éter não tem H ligado a oxigênio. Resultado: 78 °C contra −24 °C.</p>
        ${F.caixa("fisico", R`<p><b>Compare só o que é comparável.</b> Para isolar o efeito de uma força, mantenha o resto parecido: mesma família, ou mesma massa. É por isso que os isômeros são a prova mais limpa: tudo igual, menos a ligação de hidrogênio.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Ferver não quebra a molécula.</b> Vapor de água ainda é H₂O: quebram-se as atrações <b>entre</b> moléculas, não as ligações covalentes.</p><p><b>"Polar ferve sempre mais alto."</b> Não: o HI, menos polar, ferve acima do HCl.</p><p><b>Ligação de hidrogênio não é a ligação H–O da molécula.</b> É a atração entre uma molécula e a vizinha.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-ebu"); e.outerHTML = F.lab("Forças intermoleculares: quem ferve primeiro", "exp-ebu"); SIM.eqEbulicao(document.getElementById("exp-ebu"), F); },
});
