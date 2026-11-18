/* Russo RL01 · Textos nível A1.
   Nada de memória. Frases: Tatoeba (tatoeba.org), licença CC BY 2.0 FR ou CC0, com autor e número de cada frase (SIM.RU.LEIT). A tradução para
   o português é minha, a partir da tradução inglesa da fonte, e o gerador confere uma palavra-chave do inglês em cada uma. O NÍVEL (A1) é
   classificação minha, pelo tamanho da frase: nenhuma fonte dá o nível. O leitor (assets/sims/russo/leitor.js) não traduz: procura cada palavra nas
   tabelas do site e mostra as leituras possíveis; a cobertura que a página mostra é calculada na hora. Página montada por SIM.ruPaginaLeitura,
   a mesma dos três temas de textos. Tudo GERADO de tools/russo/dadosRL.json. */
F.registrar("russo/RL01", {
  retoma: ["RG04", "RG11"],
  html(F) {
    const R = String.raw, ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`;
    return SIM.ruPaginaLeitura(F, D, { niv: "A1",
      pergunta: R`${ru("Он математик.", 22)} Duas palavras, nenhuma delas é verbo, e a frase está completa: "Ele é matemático." Onde foi parar o "é"?`,
      abertura: R`<p>Não foi a lugar nenhum: no presente, o russo não escreve o verbo "ser", como você viu na gramática. Este primeiro tema de leitura usa frases de duas e três palavras, todas de falantes reais (do Tatoeba), e todas feitas de palavras que o site já tem nas tabelas. O objetivo é um só: ler sem traduzir palavra por palavra no dicionário, usando o que as terminações dizem.</p>`,
      chute: { q: "«Школа в городе.» A frase não tem verbo. Como se traduz?", ops: ["A escola fica na cidade.", "A escola da cidade.", "Escola e cidade."], certa: 0, exp: "\"A escola fica na cidade\": o \"é/está\" do presente não se escreve, e «в городе» (в + preposicional) diz onde." },
      demoTitulo: "Regra de leitura 1: frase curta, três perguntas",
      demo: R`<p><b>Afirmação.</b> Uma frase curta se lê com três perguntas, nesta ordem.</p><p><b>Passo a passo, com ${ru("Я люблю числа.")}</b> (i) <b>Há verbo?</b> ${ru("люблю")}: presente, "eu". (ii) <b>Quem?</b> ${ru("я")}, que confirma o que a terminação do verbo já dizia. (iii) <b>O quê?</b> ${ru("числа")}: plural de "número"; depois de "gostar", é o objeto. Resultado: "Eu gosto de números." Se a resposta à primeira pergunta for "não há verbo", como em ${ru("Город большой.")}, ponha você o "é": "A cidade é grande."</p>`,
      pegadinha: R`<p>${ru("Это книга?")} e uma afirmação teriam exatamente as mesmas palavras: nas frases da fonte, o que mostra que é pergunta, na escrita, é só o ponto de interrogação. E cuidado com ${ru("Мне семнадцать.")}: ao pé da letra, "a mim, dezessete". A idade se diz com o dativo, sem verbo "ter".</p>`,
      olimpiada: R`<p>A frase mais curta de enunciado está nesta lista: ${ru("Решите уравнение.")} Um imperativo na forma de «вы» e um substantivo no acusativo: "Resolvam a equação." Quase toda instrução de prova tem essa mesma armação, com mais palavras em volta. Aqui não há nenhuma questão real de prova.</p>`,
      ponte: R`<p>No próximo tema as frases têm quatro palavras e aparecem os primeiros textos corridos (duas fábulas curtas). A técnica é a mesma; o que muda é que nem toda palavra estará no banco do site, e você vai precisar da tradução para completar.</p>`,
      chefao: ["Решите уравнение.", "Часы на столе.", "Он вчера пил."] });
  },
  montar(F) {
    const niv = "A1", frases = SIM.RU.LEIT.filter((x) => x.niv === niv), pal = SIM.ruPalavrasMapa(niv);
    let e = document.getElementById("lab-leitor"); e.outerHTML = F.lab("Leitor: clique na palavra e veja de onde ela vem", "lab-leitor"); SIM.ruLeitor(document.getElementById("lab-leitor"), F, { textos: SIM.ruTextosNivel(niv) });
    e = document.getElementById("lab-quiz"); e.outerHTML = F.lab("Qual é a tradução? Leia e escolha", "lab-quiz"); SIM.ruTraduzQuiz(document.getElementById("lab-quiz"), F, { frases });
    e = document.getElementById("lab-lacuna"); e.outerHTML = F.lab("Complete a frase: escreva a palavra que falta", "lab-lacuna"); SIM.ruLacunaLab(document.getElementById("lab-lacuna"), F, { frases });
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa mental: uma palavra em todas as formas", "lab-mapa"); SIM.ruMapa(document.getElementById("lab-mapa"), F, { inicio: pal[0], palavras: pal });
  },
});
