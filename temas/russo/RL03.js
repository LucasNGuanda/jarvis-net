/* Russo RL03 · Textos nível B1.
   Nada de memória. Frases: Tatoeba (tatoeba.org), licença CC BY 2.0 FR ou CC0, com autor e número de cada frase (SIM.RU.LEIT) e duas fábulas de Esopo na versão russa de L. N. Tolstói (Wikisource), com a tradução inglesa de Leo Wiener, 1904 (SIM.RU.FABULAS). A tradução para
   o português é minha, a partir da tradução inglesa da fonte, e o gerador confere uma palavra-chave do inglês em cada uma. O NÍVEL (B1) é
   classificação minha, pelo tamanho da frase: nenhuma fonte dá o nível. O leitor (assets/sims/russo/leitor.js) não traduz: procura cada palavra nas
   tabelas do site e mostra as leituras possíveis; a cobertura que a página mostra é calculada na hora. Página montada por SIM.ruPaginaLeitura,
   a mesma dos três temas de textos. Tudo GERADO de tools/russo/dadosRL.json. */
F.registrar("russo/RL03", {
  retoma: ["RL02", "RG17", "RG18"],
  html(F) {
    const R = String.raw, ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`;
    return SIM.ruPaginaLeitura(F, D, { niv: "B1",
      pergunta: R`${ru("Я сделал то, что вы мне сказали.", 22)} Sete palavras, dois verbos, uma vírgula no meio. Por onde começar?`,
      abertura: R`<p>Pela vírgula. Frase longa em russo é quase sempre duas frases curtas ligadas por uma conjunção, e você já sabe ler frases curtas. Este tema traz frases de sete palavras, com subordinadas, condicional e negação, e duas fábulas mais longas. É o nível em que a gramática inteira trabalha junta.</p>`,
      chute: { q: "«Я люблю его, а он любит другую.» Por que a frase usa «а», e não «и»?", ops: ["porque as duas partes se somam", "porque a segunda parte contrasta com a primeira", "porque a segunda parte é a causa da primeira"], certa: 1, exp: "Contraste: \"eu o amo, mas ele ama outra\". «и» só somaria as duas informações." },
      demoTitulo: "Regra de leitura 3: corte na conjunção",
      demo: R`<p><b>Afirmação.</b> Um período composto se lê como duas frases curtas.</p><p><b>Passo a passo, com ${ru("Я хочу знать, что всё это значит.")}</b> (i) <b>Corte</b> na vírgula e na conjunção ${ru("что")}. (ii) <b>Primeira parte:</b> ${ru("Я хочу знать")}: "eu quero saber" (verbo conjugado e infinitivo). (iii) <b>Segunda parte:</b> ${ru("всё это значит")}: "tudo isso significa". (iv) <b>Costure:</b> "Quero saber o que tudo isso significa." Aqui «что» faz parte da segunda oração (é o que "tudo isso significa"): é o pronome, não a conjunção.</p>`,
      pegadinha: R`<p>${ru("его")} tem três leituras nas tabelas do site: acusativo de «он», genitivo de «он» e o possessivo "dele". Em ${ru("Я люблю его, а он любит другую.")} é o objeto ("eu o amo"); clique na palavra no leitor e veja as três. Outra: ${ru("С чего вы решили, что я против?")} começa com «с чего», ao pé da letra "a partir de quê"; a fonte traduz por "o que faz vocês pensarem".</p>`,
      olimpiada: R`<p>A fábula do leão e do rato tem, numa linha só, a construção do tema do imperativo e do condicional: ${ru("чтобы он пустил её")}, «чтобы» com o verbo no passado ("que ele o soltasse"). E a frase ${ru("Если меня здесь нет, то где я?")} tem a armação de uma hipótese de problema: «если» ..., «то» ... Reconhecer essas armações é o que permite ler um enunciado de três linhas. Aqui não há nenhuma questão real de prova.</p>`,
      ponte: R`<p>Daqui em diante, o que falta é vocabulário e volume de leitura, e isso o site não substitui: ele tem ${SIM.RU.LEIT.length} frases e ${SIM.RU.FABULAS.length} fábulas ao todo. As fábulas completas de Tolstói estão no Wikisource russo, e a tradução inglesa de 1904, no Wikisource inglês; são textos curtos e em domínio público, bons para continuar.</p>`,
      chefao: [] });
  },
  montar(F) {
    const niv = "B1", frases = SIM.RU.LEIT.filter((x) => x.niv === niv), pal = SIM.ruPalavrasMapa(niv);
    let e = document.getElementById("lab-leitor"); e.outerHTML = F.lab("Leitor: clique na palavra e veja de onde ela vem", "lab-leitor"); SIM.ruLeitor(document.getElementById("lab-leitor"), F, { textos: SIM.ruTextosNivel(niv) });
    e = document.getElementById("lab-quiz"); e.outerHTML = F.lab("Qual é a tradução? Leia e escolha", "lab-quiz"); SIM.ruTraduzQuiz(document.getElementById("lab-quiz"), F, { frases });
    e = document.getElementById("lab-lacuna"); e.outerHTML = F.lab("Complete a frase: escreva a palavra que falta", "lab-lacuna"); SIM.ruLacunaLab(document.getElementById("lab-lacuna"), F, { frases });
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa mental: uma palavra em todas as formas", "lab-mapa"); SIM.ruMapa(document.getElementById("lab-mapa"), F, { inicio: pal[0], palavras: pal });
  },
});
