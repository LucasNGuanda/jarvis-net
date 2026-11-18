/* Russo RG07 · Instrumental.
   Nada de memória: formas das tabelas de declinação do Wiktionary em inglês (SIM.RU.DECL, PRON); frases de exemplo do Wiktionary e da Wikipedia
   em inglês, com o caso de cada palavra conferido pelo gerador contra o banco (SIM.RU.FRASES2); usos, preposições e exemplos de "Russian grammar",
   "Russian declension" e "Instrumental case" (Wikipedia em inglês), em tools/russo/dadosR4.json. As regras de terminação (SIM.ruCasoRegra) são MEDIDAS
   contra o dicionário e o placar do texto é calculado na hora (SIM.ruPlacarDe).
   A montagem da página é comum aos temas de caso (SIM.ruPaginaCaso, em assets/sims/russo/casos2.js); este arquivo traz o conteúdo. */
F.registrar("russo/RG07", {
  retoma: ["RG06"],
  html(F) {
    const R = String.raw, DE = SIM.RU.DECL, PR = SIM.RU.PRON, sem = (s) => String(s).split("\u0301").join(""), ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`, f = (w, c, n = 0) => DE[w].casos[c][n][0];
    return SIM.ruPaginaCaso(F, D, { caso: "ins", nomeRu: "твори́тельный", destaque: "стол", chefao: ["книга", "брат", "окно", "ночь"], subMapa: "com quê? com quem?",
      abertura: R`<div class="q">${ru("Я написал письмо пером.", 22)} "Eu escrevi a carta com uma pena." Na frase russa não existe nenhuma palavra para "com". Onde foi parar a ideia de "com"?</div>
        <p>Está dentro da terminação: ${ru("пером")} é o <b>instrumental</b> de ${ru("перо")} (pena). O instrumental é o caso do <b>meio</b> e do <b>instrumento</b>: aquilo com que se faz a ação. Com a preposição ${ru("с")}, é também o caso da companhia ("junto com").</p>`,
      chute: { q: "\"eu quero ser médico\" é я хочу быть врачом. A forma do dicionário é врач. Em que caso está врачом?", ops: ["nominativo", "acusativo", "dativo", "instrumental"], certa: 3, exp: "Instrumental: depois do verbo \"ser\" no infinitivo (e em outras formas que a fonte lista), o que a pessoa é ou vai ser vai para o instrumental." },
      usos: R`<ul><li><b>Instrumento ou meio</b> da ação: ${ru("Я дру́гу помога́ю де́ньгами.")} (Eu ajudo um amigo com dinheiro.)</li>
        <li><b>O que alguém é, vai ser ou se torna</b>, com o verbo "ser" no infinitivo, no futuro e em outras formas, e com verbos como "tornar-se" e "parecer": ${ru("я хочу быть врачом")} (Eu quero ser médico.)</li>
        <li><b>Parte do dia e estação do ano</b>: ${ru("я работаю утром")} (Eu trabalho de manhã.)</li>
        <li><b>Quem faz a ação</b> numa frase passiva: o "por" do português.</li>
        <li><b>Outras expressões</b>, como ${ru("Он живёт этажо́м вы́ше.")} (Ele mora um andar acima.)</li></ul>`,
      formula1: [R`\text{instrumental} = \text{com quê (meio, instrumento)};\qquad \text{с} + \text{instrumental} = \text{junto com}`, "O instrumental"],
      prepos: [["с", "com, junto com"], ["за", "atrás de"], ["перед", "diante de"], ["над", "acima de"], ["под", "debaixo de"], ["между", "entre"]],
      outras: ["без", "для", "из", "от", "у", "к", "по", "о", "при"],
      pegadinha: R`<p>"Com" em português cobre duas ideias que o russo separa. <b>Instrumento</b>: instrumental sozinho, sem preposição (${ru("пером")}, ${ru("де́ньгами")}). <b>Companhia</b>: ${ru("с")} + instrumental. Pôr ${ru("с")} antes de um instrumento é o erro típico de quem pensa em português.</p>`,
      tabela: [["consoante (masc.)", "+ ом", "стол"], ["-й, -ь (masc.)", "→ ем", "музей"], ["-а", "→ ой", "школа"], ["-я", "→ ей", "неделя"], ["-ь (fem.)", "+ ю", "ночь"], ["-о, -е", "+ м", "окно"], ["-мя", "→ -менем", "имя"]],
      formula2: [R`\text{masculino e neutro:}\ \ \text{-ом, -ем}\qquad\qquad \text{feminino:}\ \ \text{-ой, -ей}\qquad\qquad \text{feminino em -ь:}\ \ \text{-ью}`, "Instrumental singular"],
      plural: R`<p><b>Instrumental plural.</b> Tire a última letra do nominativo plural e ponha ${ru("-ами")} ou ${ru("-ями")}: ${ru(f("книга", "nom", 1))} → ${ru(f("книга", "ins", 1))}; ${ru(f("неделя", "nom", 1))} → ${ru(f("неделя", "ins", 1))}. Duas palavras muito comuns fogem: ${ru(f("человек", "nom", 1))} → ${ru(f("человек", "ins", 1))} e ${ru(f("ребёнок", "nom", 1))} → ${ru(f("ребёнок", "ins", 1))}.</p>
        <p><b>Depois de chiante e de ${ru("ц")}.</b> A regra de ortografia ${F.ret("russo/RG02")} só deixa escrever ${ru("о")} nessas posições se a sílaba for tônica; se for átona, escreve-se ${ru("е")}. Por isso ${ru(f("врач", "ins"))} e ${ru(f("отец", "ins"))} (terminação tônica), mas ${ru(f("муж", "ins"))}, ${ru(f("месяц", "ins"))}, ${ru(f("улица", "ins"))} e ${ru(f("задача", "ins"))} (terminação átona). E quando a terminação mole é tônica, o ${ru("е")} vira ${ru("ё")}: ${ru(f("словарь", "ins"))}, ${ru(f("семья", "ins"))}.</p>`,
      demo: ["Regra 7: -ом ou -ем depois de chiante", R`<p><b>Afirmação.</b> Para um masculino terminado em ${ru("ж, ч, ш, щ, ц")}, a terminação do instrumental depende de onde está o acento.</p><p><b>Passo a passo.</b> (i) A regra geral pede ${ru("-ом")}. (ii) Depois dessas consoantes, ${ru("о")} só se escreve em sílaba tônica. (iii) ${ru("врач")}: no instrumental o acento vai para a terminação, logo ${ru(f("врач", "ins"))}. (iv) ${ru("муж")}: o acento fica no radical, a terminação é átona, logo ${ru(f("муж", "ins"))}. (v) Conclusão honesta: sem saber o acento, a regra não decide. É uma das razões de o placar do instrumental ser o mais baixo dos casos.</p>`],
      ramos: [["masc. em consoante", "+ ом", ["стол", "брат"]], ["fem. em -а", "→ ой", ["школа", "книга"]], ["fem. em -я, -ь", "→ ей / + ю", ["неделя", "ночь"]], ["neutro", "+ м", ["окно", "море"]], ["plural", "-ами / -ями", [["книга", 1], ["друг", 1]]], ["depois de chiante", "depende do acento", ["врач", "муж"]]],
      leituraPlacar: "É o caso em que a regra mais erra no singular: além das palavras de radical que muda, entram as terminadas em chiante ou ц (onde a letra depende do acento) e as de terminação tônica com ё.",
      ponte: R`<p>A fonte lista ainda usos menos óbvios do instrumental: a comparação (os exemplos dela são ${ru("выть волком")}, "uivar como um lobo", e ${ru("лететь стрелой")}, "voar como uma flecha") e o agente da passiva, como em ${ru("письмо написано Иваном")}, "a carta foi escrita por Ivan". Em todos, a ideia de fundo é a mesma: o modo ou o meio pelo qual a ação acontece.</p>`,
      olimpiada: R`<p>Em texto de exatas, o instrumental aparece sem preposição (o meio) e depois de ${ru("с")}, ${ru("над")}, ${ru("под")}, ${ru("между")}, ${ru("перед")}. As terminações ${ru("-ом")}, ${ru("-ой")}, ${ru("-ами")} são fáceis de reconhecer: ${ru(f("сила", "ins"))} é ${ru("си́ла")}; ${ru(f("скорость", "ins"))} é ${ru("ско́рость")}; ${ru(f("масса", "ins"))} é ${ru("ма́сса")}.</p>`,
      usoCerto: "Indicar o meio ou o instrumento com que se faz a ação.", usosErrados: ["Marcar o sujeito da frase.", "Marcar o objeto direto.", "Indicar posse (o \"de\" do português).", "Marcar o objeto indireto (a quem se dá algo)."], dicaUso: "É o caso do \"com quê?\".",
      perguntaChefao: R`Por que ${ru("врач")} faz ${ru(f("врач", "ins"))} e ${ru("муж")} faz ${ru(f("муж", "ins"))}, se as duas terminam em chiante?`, respostaChefao: R`Depois de chiante, ${ru("о")} só se escreve em sílaba tônica. Em ${ru(f("врач", "ins"))} a terminação é tônica; em ${ru(f("муж", "ins"))} é átona, e escreve-se ${ru("е")}.` });
  },
  montar(F) {
    let e = document.getElementById("lab-ache"); e.outerHTML = F.lab("Ache o caso na frase: clique na palavra", "lab-ache"); SIM.ruAcheCaso(document.getElementById("lab-ache"), F, { caso: "ins" });
    e = document.getElementById("lab-regra"); e.outerHTML = F.lab("A regra do caso contra o dicionário", "lab-regra"); SIM.ruCasoLab(document.getElementById("lab-regra"), F, { caso: "ins", inicio: "стол" });
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa mental: uma palavra em todas as formas", "lab-mapa"); SIM.ruMapa(document.getElementById("lab-mapa"), F, { inicio: "стол", palavras: SIM.ruListaMapa });
    e = document.getElementById("lab-escreve"); e.outerHTML = F.lab("Escreva a palavra no caso pedido", "lab-escreve"); SIM.ruEscreveCaso(document.getElementById("lab-escreve"), F, { casos: ["ins"] });
  },
});
