/* Russo RL02 · Textos nível A2.
   Nada de memória. Frases: Tatoeba (tatoeba.org), licença CC BY 2.0 FR ou CC0, com autor e número de cada frase (SIM.RU.LEIT) e duas fábulas de Esopo na versão russa de L. N. Tolstói (Wikisource), com a tradução inglesa de Leo Wiener, 1904 (SIM.RU.FABULAS). A tradução para
   o português é minha, a partir da tradução inglesa da fonte, e o gerador confere uma palavra-chave do inglês em cada uma. O NÍVEL (A2) é
   classificação minha, pelo tamanho da frase: nenhuma fonte dá o nível. O leitor (assets/sims/russo/leitor.js) não traduz: procura cada palavra nas
   tabelas do site e mostra as leituras possíveis; a cobertura que a página mostra é calculada na hora. Página montada por SIM.ruPaginaLeitura,
   a mesma dos três temas de textos. Tudo GERADO de tools/russo/dadosRL.json. */
F.registrar("russo/RL02", {
  retoma: ["RL01", "RG12", "RG15"],
  html(F) {
    const R = String.raw, ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`;
    return SIM.ruPaginaLeitura(F, D, { niv: "A2",
      pergunta: R`${ru("Ты ходила в школу?", 22)} Quem pergunta está falando com um homem ou com uma mulher? A frase diz, e nem usa a palavra "mulher".`,
      abertura: R`<p>Diz pelo verbo: no passado, o verbo russo concorda em gênero com o sujeito, e ${ru("ходила")} é feminino. Neste tema as frases têm quatro palavras, com passado, futuro, negação e preposições, e chegam os dois primeiros textos corridos: fábulas de Esopo que Tolstói reescreveu em russo simples. Nas frases o site reconhece quase tudo; nas fábulas, mais ou menos metade, e a tradução entra para completar.</p>`,
      chute: { q: "«Почему ты не вошёл?» (Por que você não entrou?) A pessoa com quem se fala é:", ops: ["um homem", "uma mulher", "não dá para saber"], certa: 0, exp: "Um homem: вошёл é o passado masculino de войти. Para uma mulher seria вошла, e a fonte traz as duas frases." },
      demoTitulo: "Regra de leitura 2: o verbo no passado entrega o sujeito",
      demo: R`<p><b>Afirmação.</b> Numa frase no passado, a terminação do verbo diz o gênero e o número de quem fez.</p><p><b>Passo a passo, com ${ru("Вы уже решили задачу?")}</b> (i) <b>Verbo:</b> ${ru("решили")}, passado plural de "resolver". (ii) <b>Sujeito:</b> ${ru("вы")}, "vocês" (ou "o senhor"): plural, como o verbo. (iii) <b>Objeto:</b> ${ru("задачу")}, acusativo de "problema". (iv) <b>Palavrinha:</b> ${ru("уже")}, "já". Resultado: "Vocês já resolveram o problema?" Com ${ru("Она его ещё любила.")} é igual: ${ru("любила")}, feminino, combina com ${ru("она")}.</p>`,
      pegadinha: R`<p>Duas frases desta lista não se traduzem ao pé da letra. ${ru("У меня масса дел.")}: "junto de mim, uma massa de afazeres"; a posse se diz com «у» + genitivo, e «масса» aqui é "um monte", não a grandeza da física. ${ru("На это ушли годы.")}: "nisso se foram anos", ou seja, "isso levou anos".</p>`,
      olimpiada: R`<p>O vocabulário dos temas de matemática e de física já aparece em frase de gente: ${ru("Вы уже решили задачу?")}, ${ru("Сто — это большое число.")}, ${ru("Этот физик изучает волны.")} Ler essas frases sem esforço é o que deixa a atenção livre, numa prova, para a parte difícil. Aqui não há nenhuma questão real de prova.</p>`,
      ponte: R`<p>As duas fábulas deste tema são o primeiro texto literário do site. Repare na diferença de cobertura entre frases e fábulas: é a medida de quanto vocabulário ainda falta. No próximo tema as frases têm sete palavras e mais de uma oração.</p>`,
      chefao: [] });
  },
  montar(F) {
    const niv = "A2", frases = SIM.RU.LEIT.filter((x) => x.niv === niv), pal = SIM.ruPalavrasMapa(niv);
    let e = document.getElementById("lab-leitor"); e.outerHTML = F.lab("Leitor: clique na palavra e veja de onde ela vem", "lab-leitor"); SIM.ruLeitor(document.getElementById("lab-leitor"), F, { textos: SIM.ruTextosNivel(niv) });
    e = document.getElementById("lab-quiz"); e.outerHTML = F.lab("Qual é a tradução? Leia e escolha", "lab-quiz"); SIM.ruTraduzQuiz(document.getElementById("lab-quiz"), F, { frases });
    e = document.getElementById("lab-lacuna"); e.outerHTML = F.lab("Complete a frase: escreva a palavra que falta", "lab-lacuna"); SIM.ruLacunaLab(document.getElementById("lab-lacuna"), F, { frases });
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa mental: uma palavra em todas as formas", "lab-mapa"); SIM.ruMapa(document.getElementById("lab-mapa"), F, { inicio: pal[0], palavras: pal });
  },
});
