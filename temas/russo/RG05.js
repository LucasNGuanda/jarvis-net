/* Russo RG05 · Genitivo.
   Nada de memória: formas das tabelas de declinação do Wiktionary em inglês (SIM.RU.DECL, PRON); frases de exemplo do Wiktionary e da Wikipedia
   em inglês, com o caso de cada palavra conferido pelo gerador contra o banco (SIM.RU.FRASES2); usos, preposições e exemplos de "Russian grammar",
   "Russian declension" e "Genitive case" (Wikipedia em inglês), em tools/russo/dadosR4.json. As regras de terminação (SIM.ruCasoRegra) são MEDIDAS
   contra o dicionário e o placar do texto é calculado na hora (SIM.ruPlacarDe). O genitivo plural não tem regra aqui: vem da tabela.
   A montagem da página é comum aos temas de caso (SIM.ruPaginaCaso, em assets/sims/russo/casos2.js); este arquivo traz o conteúdo. */
F.registrar("russo/RG05", {
  retoma: ["RG04"],
  html(F) {
    const R = String.raw, DE = SIM.RU.DECL, sem = (s) => String(s).split("́").join(""), ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`;
    const gp = Object.keys(DE).filter((w) => DE[w].casos.gen[1].length && DE[w].casos.nom[1].length), fim = (w) => { const g = sem(DE[w].casos.gen[1][0]).replace("ё", "е"); return /(ов|ев)$/.test(g) ? "ov" : /ей$/.test(g) ? "ei" : "zero"; };
    const fam = (k, n = 5) => gp.filter((w) => fim(w) === k).slice(0, n).map((w) => `${ru(DE[w].casos.nom[1][0])} → ${ru(DE[w].casos.gen[1][0])}`).join(", "), conta = (k) => gp.filter((w) => fim(w) === k).length;
    return SIM.ruPaginaCaso(F, D, { caso: "gen", nomeRu: "роди́тельный", destaque: "стол", chefao: ["книга", "брат", "окно", "ночь"], subMapa: "posse, quantidade, ausência",
      abertura: R`<div class="q">${ru("У моего брата есть обед", 22)}: "meu irmão tem um almoço". Ao pé da letra: "junto de meu irmão há almoço". Não há verbo "ter" na frase, e "irmão" não está na forma do dicionário (${ru("брат")}): está como ${ru("брата")}. Que forma é essa, e por que ela aparece aí?</div>
        <p>É o <b>genitivo</b>, o caso do "de": posse, quantidade e ausência. É também o caso com mais preposições; ${ru("у")} ("junto de") é uma delas, e com ela o russo diz quem tem alguma coisa.</p>`,
      chute: { q: "se o genitivo é o caso do \"de\", qual destas formas de книга quer dizer \"do livro\"?", ops: ["книгу", "книги", "книге", "книгой"], certa: 1, exp: "книги: feminino em -а faz o genitivo em -ы, mas depois de г escreve-se и. (книгу é o acusativo, que você já conhece.)" },
      usos: R`<ul><li><b>Posse</b>, o "de" do português: o possuidor vai para o genitivo.</li>
        <li><b>Quantidade</b>: depois de numerais e de palavras como "vários": ${ru("У бра́та не́сколько часо́в.")} (Meu irmão tem vários relógios.)</li>
        <li><b>Ausência</b>: com ${ru("нет")} ("não há"), o que falta vai para o genitivo. A fonte lembra que ${ru("нет")} é a contração de ${ru("не")} + ${ru("есть")}.</li>
        <li><b>"Ter"</b>: ${ru("у")} + possuidor no genitivo + ${ru("есть")} + a coisa possuída no nominativo.</li>
        <li><b>Um pouco de</b>: ${ru("Я напился воды")} (Eu bebi água.)</li></ul>`,
      formula1: [R`\text{у} + \text{possuidor (genitivo)} + \text{есть} + \text{coisa (nominativo)} \quad = \quad \text{"fulano tem a coisa"}`, "\"Ter\" em russo"],
      prepos: [["без", "sem"], ["для", "para"], ["до", "antes de, até"], ["из", "de dentro de"], ["от", "de, a partir de"], ["у", "junto de"], ["после", "depois de"], ["около", "perto de"], ["кроме", "exceto"]],
      outras: ["к", "по", "над", "перед", "между", "о", "при", "про", "через"],
      pegadinha: R`<p>Em ${ru("У моего брата есть обед")}, o sujeito gramatical <b>não</b> é o irmão: é o almoço (${ru("обед")}, no nominativo). O dono vem no genitivo, depois de ${ru("у")}. Traduzir palavra por palavra do português ("meu irmão" no nominativo) é o erro clássico.</p>`,
      tabela: [["consoante (masc.)", "+ а", "стол"], ["-й, -ь (masc.)", "→ я", "музей"], ["-а", "→ ы / и", "школа"], ["-я", "→ и", "неделя"], ["-ь (fem.)", "→ и", "ночь"], ["-о", "→ а", "окно"], ["-е", "→ я", "море"], ["-мя", "→ -мени", "имя"]],
      formula2: [R`\text{masculino e neutro:}\ \ \text{-а, -я}\qquad\qquad \text{feminino:}\ \ \text{-ы, -и}\ \ (\text{и depois de г, к, х, ж, ч, ш, щ})`, "Genitivo singular"],
      plural: R`<p><b>Genitivo plural.</b> É o caso mais irregular da declinação, e este tema não dá regra para ele: vale a tabela de cada palavra. O que dá para ver nas ${gp.length} palavras do banco são três famílias: sem terminação nenhuma (${conta("zero")} palavras: ${fam("zero")}); em -ов ou -ев (${conta("ov")}: ${fam("ov")}); em -ей (${conta("ei")}: ${fam("ei")}).</p>`,
      demo: ["Regra 5: dizer \"ter\" e \"não ter\"", R`<p><b>Afirmação.</b> "X tem Y" se monta sem verbo "ter".</p><p><b>Passo a passo.</b> (i) Comece por ${ru("у")}. (ii) Ponha o dono no genitivo: ${ru("брат")} → ${ru("брата")}. (iii) Acrescente ${ru("есть")} ("há"). (iv) Ponha a coisa no nominativo: ${ru("обед")}. Resultado: ${ru("У моего брата есть обед")}. (v) Para negar, troque ${ru("есть")} por ${ru("нет")} e passe a coisa para o genitivo, porque agora ela é o que falta: a fonte dá ${ru("нет обеда")}.</p>`],
      ramos: [["masc. em consoante", "+ а", ["стол", "брат"]], ["fem. em -а", "→ ы / и", ["школа", "книга"]], ["fem. em -я, -ь", "→ и", ["неделя", "ночь"]], ["neutro", "→ а / я", ["окно", "море"]], ["plural", "vem da tabela", [["книга", 1], ["стол", 1]]], ["radical que muda", "aprender junto", ["отец", "мать"]]],
      leituraPlacar: "As que fogem são palavras em que o radical muda (uma vogal cai, ou o radical cresce); elas vão reaparecer, as mesmas, nos próximos casos.",
      ponte: R`<p>A fonte registra um resto de outro caso dentro do genitivo: alguns substantivos de coisas que não se contam têm, em certos contextos, uma forma em -у ou -ю no lugar da de -а ou -я. O exemplo dela: ${ru("выпил чаю")} ("bebeu um pouco de chá"), mas ${ru("сорта чая")} ("tipos de chá"). As gramáticas chamam essa forma de partitivo, e ela aparece como forma extra em algumas tabelas do dicionário.</p>`,
      olimpiada: R`<p>Em enunciado de exatas, o "de" encadeia grandezas ("a massa de…", "a velocidade de…"), e cada elo dessa corrente vem no genitivo. Para procurar no dicionário, volte ao nominativo: ${ru(DE["масса"].casos.gen[0][0])} é ${ru("ма́сса")}; ${ru(DE["скорость"].casos.gen[0][0])} é ${ru("ско́рость")}; ${ru(DE["сила"].casos.gen[0][0])} é ${ru("си́ла")}. O exercício 14 treina essa volta.</p>`,
      usoCerto: "Indicar posse (o \"de\" do português), quantidade e ausência.", usosErrados: ["Marcar o sujeito da frase.", "Marcar o objeto direto.", "Indicar o instrumento com que se faz a ação.", "Marcar o objeto indireto (a quem se dá algo)."], dicaUso: "É o caso do \"de\".",
      perguntaChefao: R`Monte, em russo, "meu irmão tem um almoço" e explique o caso de cada substantivo.`, respostaChefao: R`${ru("У моего брата есть обед")}: ${ru("брата")} é genitivo (o dono, depois de ${ru("у")}); ${ru("обед")} é nominativo (a coisa que existe).` });
  },
  montar(F) {
    let e = document.getElementById("lab-ache"); e.outerHTML = F.lab("Ache o caso na frase: clique na palavra", "lab-ache"); SIM.ruAcheCaso(document.getElementById("lab-ache"), F, { caso: "gen" });
    e = document.getElementById("lab-regra"); e.outerHTML = F.lab("A regra do caso contra o dicionário", "lab-regra"); SIM.ruCasoLab(document.getElementById("lab-regra"), F, { caso: "gen", inicio: "стол" });
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa mental: uma palavra em todas as formas", "lab-mapa"); SIM.ruMapa(document.getElementById("lab-mapa"), F, { inicio: "стол", palavras: SIM.ruListaMapa });
    e = document.getElementById("lab-escreve"); e.outerHTML = F.lab("Escreva a palavra no caso pedido", "lab-escreve"); SIM.ruEscreveCaso(document.getElementById("lab-escreve"), F, { casos: ["gen"] });
  },
});
