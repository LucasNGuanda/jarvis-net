/* Química EQ22 · Experimento: teste de chama. Simulação SIM.eqChama (assets/sims/quimica/exp-atomos2.js).
   Cores: SIM.ANA.CHAMA (módulo J; Wikipedia "Flame test", com trecho em tools/quimica/dadosJ.json). Linhas de emissão (tools/quimica/dadosX.json, seção "linhas_de_emissao"):
   Li 670,8 nm; Na 589 nm; K 766,5 nm. O amarelo do sódio não passa pelo vidro azul de cobalto (mesma tabela da fonte).
   As cores desenhadas são aproximações (dito na tela); o nome da cor é o da fonte.
   No teste (tests/texpq.js): cada metal mostra a cor da tabela; com sódio junto, tudo fica amarelo; com o vidro, volta a cor do metal; a amostra misteriosa só diz o nome depois de "revelar". */
F.registrar("quimica/EQ22", {
  retoma: ["J01", "B03", "EQ23"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 22 · átomos e ligações</div><div class="q">Fogos de artifício vermelhos, verdes e amarelos queimam a mesma pólvora. O que muda de um para o outro é uma pitada de sal diferente. Como um sal escolhe a cor do fogo?</div><p>Cada metal emite luz de cores próprias quando é aquecido. É uma assinatura tão confiável que serve de teste de laboratório.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Leve cada sal à chama e anote a cor. Depois suje a amostra com sódio, use o vidro de cobalto e tente identificar uma amostra misteriosa.</p><div id="exp-cha"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. De onde vem a cor</h3>
        <p>Na chama, o sal se decompõe e libera átomos do metal. O calor promove um elétron para um nível de energia mais alto; ele volta quase na hora e devolve a diferença como luz ${F.ret("B03")}. Como os níveis de energia são diferentes em cada elemento, a luz emitida também é: o lítio emite principalmente em 670,8 nm (vermelho), o sódio em 589 nm (amarelo). O que o olho vê é a mistura das linhas de cada metal ${F.ret("EQ23")}.</p>
        <h3>2. O teste</h3>
        <p>Um fio limpo é mergulhado na amostra e levado à parte mais quente da chama. A cor identifica o cátion: é um dos testes da análise qualitativa ${F.ret("J01")}. É rápido e precisa de pouquíssima amostra, mas só funciona bem para alguns metais e não separa misturas.</p>
        <h3>3. O problema do sódio</h3>
        <p>Traços de sódio dão um amarelo tão intenso que encobre as outras cores. O <b>vidro azul de cobalto</b> absorve esse amarelo: olhando através dele, o amarelo some e aparece a cor do outro metal. É o truque clássico para ver o lilás do potássio.</p>
        ${F.caixa("fisico", R`<p><b>O olho engana, o espectro não.</b> Lítio e estrôncio são os dois vermelhos; cobre e bário, os dois verdes. A olho, é fácil confundir. Passando a luz por um prisma, cada metal mostra linhas em posições diferentes, e a dúvida acaba. O teste de chama é a versão caseira da espectroscopia.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>A cor é do cátion.</b> Cloreto, nitrato ou sulfato de um mesmo metal dão a mesma cor.</p><p><b>Chama amarela não prova que só há sódio.</b> Pode haver outro metal escondido atrás do amarelo.</p><p><b>Nem todo metal colore a chama.</b> O teste serve para poucos.</p>`)}
        ${F.caixa("pegadinha", R`<p>Em casa, com um adulto, dá para fazer com segurança só o do sal de cozinha: uns grãos num fio de aço limpo, na chama do fogão, dão o amarelo do sódio. Sais de bário, estrôncio, cobre e lítio são tóxicos ou irritantes e pedem laboratório, óculos e professor. Nunca jogue sais diretamente no fogo nem misture produtos para "fazer fogos".</p>`, "Segurança e descarte")}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-cha"); e.outerHTML = F.lab("Teste de chama: a cor que denuncia o metal", "exp-cha"); SIM.eqChama(document.getElementById("exp-cha"), F); },
});
