/* Russo RG06 · Dativo.
   Nada de memória: formas das tabelas de declinação do Wiktionary em inglês (SIM.RU.DECL, PRON); frases de exemplo do Wiktionary e da Wikipedia
   em inglês, com o caso de cada palavra conferido pelo gerador contra o banco (SIM.RU.FRASES2); usos, preposições e exemplos de "Russian grammar",
   "Russian declension" e "Dative case" (Wikipedia em inglês), em tools/russo/dadosR4.json. As regras de terminação (SIM.ruCasoRegra) são MEDIDAS
   contra o dicionário e o placar do texto é calculado na hora (SIM.ruPlacarDe).
   A montagem da página é comum aos temas de caso (SIM.ruPaginaCaso, em assets/sims/russo/casos2.js); este arquivo traz o conteúdo. */
F.registrar("russo/RG06", {
  retoma: ["RG05"],
  html(F) {
    const R = String.raw, DE = SIM.RU.DECL, PR = SIM.RU.PRON, sem = (s) => String(s).split("\u0301").join(""), ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`, f = (w, c, n = 0) => DE[w].casos[c][n][0];
    return SIM.ruPaginaCaso(F, D, { caso: "dat", nomeRu: "да́тельный", destaque: "друг", chefao: ["книга", "брат", "окно", "ночь"], subMapa: "a quem? para quem?",
      abertura: R`<div class="q">${ru("мне двадцать лет", 22)}: "eu tenho 20 anos". Ao pé da letra: "a mim, vinte anos". E ${ru("мне холодно", 22)}, "estou com frio", é "a mim, frio". Em nenhuma das duas frases aparece ${ru("я")}, a palavra para "eu". Que forma é ${ru("мне")}?</div>
        <p>É o <b>dativo</b> de ${ru("я")}. O dativo é o caso de <b>quem recebe</b>: o objeto indireto ("dar algo <i>a alguém</i>"). O russo usa esse mesmo caso para a idade e para sensações, como se elas acontecessem <i>a</i> você.</p>`,
      chute: { q: "na frase \"eu ajudo um amigo\", o russo põe \"amigo\" (друг) no dativo. Que forma você espera?", ops: ["друг", "друга", "другу", "другом"], certa: 2, exp: "другу: masculino em consoante faz o dativo em -у. A frase do dicionário é Я дру́гу помога́ю де́ньгами." },
      usos: R`<ul><li><b>Objeto indireto</b>: a quem se dá, se diz, se mostra alguma coisa: ${ru("Он преподнёс ей кни́гу.")} (Ele deu um livro de presente a ela.)</li>
        <li><b>Idade</b>: ${ru("Ему́ два́дцать оди́н год.")} (Ele tem 21 anos.)</li>
        <li><b>Frases impessoais</b>, de sensação ou estado: ${ru("мне холодно")} (Estou com frio.); ${ru("Ей не спи́тся.")} (Ela não consegue dormir.)</li>
        <li><b>Com certos verbos</b>: a fonte lista, entre outros, os verbos de "acreditar", "ajudar", "aconselhar" e "telefonar": ${ru("Я ему́ помога́л.")} (Eu o ajudava.)</li>
        <li><b>Com as palavras de necessidade e permissão</b> ${ru("нужно")} ou ${ru("надо")} (é preciso), ${ru("можно")} (pode-se) e ${ru("нельзя")} (não se pode): quem precisa ou pode vai para o dativo.</li></ul>`,
      formula1: [R`\text{dativo} = \text{a quem (objeto indireto)};\qquad \text{idade e sensação:}\ \ \text{pessoa no dativo}`, "O dativo"],
      prepos: [["к", "para, em direção a"], ["по", "por, ao longo de"], ["благодаря", "graças a"]],
      outras: ["без", "для", "из", "от", "у", "над", "перед", "между", "о", "при"],
      pegadinha: R`<p>"Ajudar" em português pede objeto direto ("eu <i>o</i> ajudo"); em russo, o verbo de ajudar pede o <b>dativo</b>: ${ru("Я ему́ помога́л.")}, com ${ru("ему́")}, e não com o acusativo ${ru(PR["он"].casos.acc[0])}. O caso que um verbo pede vem com o verbo, e nem sempre é o que o português faria esperar.</p>`,
      tabela: [["consoante (masc.)", "+ у", "стол"], ["-й, -ь (masc.)", "→ ю", "музей"], ["-а, -я", "→ е", "школа"], ["-ия", "→ ии", "станция"], ["-ь (fem.)", "→ и", "ночь"], ["-о", "→ у", "окно"], ["-е", "→ ю", "море"], ["-мя", "→ -мени", "имя"]],
      formula2: [R`\text{masculino e neutro:}\ \ \text{-у, -ю}\qquad\qquad \text{feminino em -а, -я:}\ \ \text{-е}\qquad\qquad \text{feminino em -ь:}\ \ \text{-и}`, "Dativo singular"],
      plural: R`<p><b>Dativo plural.</b> Aqui há regra, e ela é a mesma para os três gêneros: tire a última letra do nominativo plural e ponha ${ru("-ам")} (depois de consoante dura e de ${ru("г, к, х, ж, ч, ш, щ")}) ou ${ru("-ям")}: ${ru(f("книга", "nom", 1))} → ${ru(f("книга", "dat", 1))}; ${ru(f("неделя", "nom", 1))} → ${ru(f("неделя", "dat", 1))}; ${ru(f("друг", "nom", 1))} → ${ru(f("друг", "dat", 1))}. Como a regra parte do nominativo plural, os plurais irregulares já vêm embutidos.</p>`,
      demo: ["Regra 6: quem dá, o quê, a quem", R`<p><b>Afirmação.</b> Uma frase com três participantes usa três casos, e a ordem das palavras fica livre.</p><p><b>Passo a passo, em</b> ${ru("Он преподнёс ей кни́гу.")} (i) Quem dá: ${ru("Он")}, nominativo. (ii) O que é dado: ${ru("кни́гу")}, acusativo de ${ru("кни́га")}. (iii) A quem: ${ru("ей")}, dativo de ${ru("она́")}. (iv) Em ${ru("Я дру́гу помога́ю де́ньгами.")} o dativo ${ru("дру́гу")} vem antes do verbo e a frase não muda de sentido: Eu ajudo um amigo com dinheiro.</p>`],
      ramos: [["masc. em consoante", "+ у", ["стол", "брат"]], ["fem. em -а, -я", "→ е", ["школа", "неделя"]], ["fem. em -ь, -ия", "→ и", ["ночь", "станция"]], ["neutro", "→ у / ю", ["окно", "море"]], ["plural", "-ам / -ям", [["книга", 1], ["друг", 1]]], ["radical que muda", "aprender junto", ["отец", "мать"]]],
      leituraPlacar: "No plural a regra quase não erra, porque parte do nominativo plural da própria palavra; no singular, as que fogem são as mesmas do genitivo.",
      ponte: R`<p>A fonte observa que, quando o destino de um movimento é uma <b>pessoa</b>, o russo usa o dativo (em geral com a preposição ${ru("к")}) no lugar do acusativo, que serve para lugares. É um exemplo de como o caso carrega sentido: a mesma ideia de "ir até" pede formas diferentes conforme o que está no fim do caminho.</p>`,
      olimpiada: R`<p>Em texto de exatas, o dativo aparece depois de ${ru("по")} e de ${ru("к")}. Reconhecer a terminação evita procurar no dicionário uma palavra que não existe: ${ru(f("задача", "dat"))} é ${ru("зада́ча")}; ${ru(f("скорость", "dat"))} é ${ru("ско́рость")}; ${ru(f("время", "dat"))} é ${ru("вре́мя")}. Note que, nos femininos em -ь e nos neutros em -мя, o dativo tem a mesma forma do genitivo: só o contexto (a preposição, o verbo) decide.</p>`,
      usoCerto: "Marcar o objeto indireto: a quem se dá ou se diz algo.", usosErrados: ["Marcar o sujeito da frase.", "Marcar o objeto direto.", "Indicar posse (o \"de\" do português).", "Indicar o instrumento com que se faz a ação."], dicaUso: "É o caso de quem recebe.",
      perguntaChefao: R`Explique, palavra por palavra, por que "ele tem 21 anos" é ${ru("Ему́ два́дцать оди́н год.")} e não começa por ${ru("Он")}.`, respostaChefao: R`A idade é dita como algo que pertence "a ele": a pessoa vai para o dativo (${ru("ему́")}, de ${ru("он")}) e ${ru("год")} fica no nominativo.` });
  },
  montar(F) {
    let e = document.getElementById("lab-ache"); e.outerHTML = F.lab("Ache o caso na frase: clique na palavra", "lab-ache"); SIM.ruAcheCaso(document.getElementById("lab-ache"), F, { caso: "dat" });
    e = document.getElementById("lab-regra"); e.outerHTML = F.lab("A regra do caso contra o dicionário", "lab-regra"); SIM.ruCasoLab(document.getElementById("lab-regra"), F, { caso: "dat", inicio: "друг" });
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa mental: uma palavra em todas as formas", "lab-mapa"); SIM.ruMapa(document.getElementById("lab-mapa"), F, { inicio: "друг", palavras: SIM.ruListaMapa });
    e = document.getElementById("lab-escreve"); e.outerHTML = F.lab("Escreva a palavra no caso pedido", "lab-escreve"); SIM.ruEscreveCaso(document.getElementById("lab-escreve"), F, { casos: ["dat"] });
  },
});
