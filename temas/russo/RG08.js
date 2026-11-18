/* Russo RG08 · Preposicional.
   Nada de memória: formas das tabelas de declinação do Wiktionary em inglês (SIM.RU.DECL, PRON); frases de exemplo do Wiktionary e da Wikipedia
   em inglês, com o caso de cada palavra conferido pelo gerador contra o banco (SIM.RU.FRASES2); usos, preposições e exemplos de "Russian grammar",
   "Russian declension" e "Prepositional case" (Wikipedia em inglês), em tools/russo/dadosR4.json. As regras de terminação (SIM.ruCasoRegra) são MEDIDAS
   contra o dicionário e o placar do texto é calculado na hora (SIM.ruPlacarDe).
   A montagem da página é comum aos temas de caso (SIM.ruPaginaCaso, em assets/sims/russo/casos2.js); este arquivo traz o conteúdo. */
F.registrar("russo/RG08", {
  retoma: ["RG07"],
  html(F) {
    const R = String.raw, DE = SIM.RU.DECL, PR = SIM.RU.PRON, sem = (s) => String(s).split("\u0301").join(""), ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`, f = (w, c, n = 0) => DE[w].casos[c][n][0];
    return SIM.ruPaginaCaso(F, D, { caso: "prep", nomeRu: "предло́жный", destaque: "стол", chefao: ["книга", "брат", "окно", "ночь"], subMapa: "onde? sobre o quê?",
      abertura: R`<div class="q">${ru("Свеча́ горе́ла на столе́.", 22)} "Uma vela ardia sobre a mesa." A palavra para mesa é ${ru("стол")}; aqui ela aparece como ${ru("столе́")}, depois de ${ru("на")}. Existe um caso russo que <b>nunca</b> aparece sem preposição na frente. Qual é, e para que serve?</div>
        <p>É o <b>preposicional</b>: o nome já diz que ele só existe com preposição. Com ${ru("в")} e ${ru("на")} ele diz <b>onde</b> algo está; com ${ru("о")}, <b>sobre o quê</b> se fala. É o último dos seis casos, e o de terminação mais simples.</p>`,
      chute: { q: "\"na escola\" é в + школа no preposicional. Que forma você espera?", ops: ["в школу", "в школы", "в школе", "в школой"], certa: 2, exp: "в школе: no preposicional singular quase tudo termina em -е. (в школу, com acusativo, seria \"para a escola\": destino.)" },
      usos: R`<ul><li><b>Lugar onde algo está</b>, com ${ru("в")} (dentro de) e ${ru("на")} (em cima de, em): ${ru("Свеча́ горе́ла на столе́.")} (Uma vela ardia sobre a mesa.)</li>
        <li><b>Assunto</b>, com ${ru("о")} (sobre, a respeito de).</li>
        <li><b>Presença ou proximidade</b>, com ${ru("при")}: ${ru("Он э́то при ней сказа́л.")} (Ele disse isso na presença dela.)</li></ul>
        <p>Nada mais: fora dessas preposições, o preposicional não aparece.</p>`,
      formula1: [R`\text{в, на} + \text{preposicional} = \text{onde está}\qquad\qquad \text{в, на} + \text{acusativo} = \text{para onde vai}`, "Lugar e destino"],
      prepos: [["в", "em, dentro de"], ["на", "em, sobre"], ["о", "sobre, a respeito de"], ["при", "junto de, na presença de"]],
      outras: ["без", "для", "из", "от", "у", "к", "по", "над", "перед", "между"],
      pegadinha: R`<p>${ru("в")} e ${ru("на")} trabalham com <b>dois</b> casos, e o caso muda o sentido. Com o preposicional, dizem onde algo <b>está</b>; com o acusativo ${F.ret("russo/RG04")}, dizem para onde algo <b>vai</b>. A preposição é a mesma; quem distingue "na escola" de "para a escola" é a terminação do substantivo.</p>`,
      tabela: [["consoante (masc.)", "+ е", "стол"], ["-й, -ь (masc.)", "→ е", "музей"], ["-а, -я", "→ е", "школа"], ["-о", "→ е", "окно"], ["-е", "não muda", "море"], ["-ь (fem.)", "→ и", "ночь"], ["-ий, -ия, -ие", "→ ии", "станция"], ["-мя", "→ -мени", "имя"]],
      formula2: [R`\text{quase tudo:}\ \ \text{-е}\qquad\qquad \text{feminino em -ь:}\ \ \text{-и}\qquad\qquad \text{-ий, -ия, -ие:}\ \ \text{-ии}`, "Preposicional singular"],
      plural: R`<p><b>Preposicional plural.</b> Tire a última letra do nominativo plural e ponha ${ru("-ах")} ou ${ru("-ях")}: ${ru(f("книга", "nom", 1))} → ${ru(f("книга", "prep", 1))}; ${ru(f("неделя", "nom", 1))} → ${ru(f("неделя", "prep", 1))}; ${ru(f("друг", "nom", 1))} → ${ru(f("друг", "prep", 1))}.</p>
        <p><b>Palavras em -ий, -ия, -ие.</b> Escrevem-se com ${ru("-ии")} no preposicional, e não com ${ru("-ие")}: ${ru("ста́нция")} → ${ru(f("станция", "prep"))}; ${ru("зда́ние")} → ${ru(f("здание", "prep"))}. A fonte lembra que essa terminação nunca é tônica, de modo que a diferença está só na escrita.</p>`,
      demo: ["Regra 8: onde está × para onde vai", R`<p><b>Afirmação.</b> Depois de ${ru("в")} ou ${ru("на")}, a terminação do substantivo diz se há movimento.</p><p><b>Passo a passo, com</b> ${ru("шко́ла")}. (i) Preposicional: ${ru(f("школа", "prep"))}. Com ${ru("в")}, quer dizer "na escola": lugar onde se está. (ii) Acusativo: ${ru(f("школа", "acc"))}. Com ${ru("в")}, quer dizer "para a escola": destino. (iii) Com ${ru("стол")}: preposicional ${ru(f("стол", "prep"))} (sobre a mesa, parado); acusativo ${ru(f("стол", "acc"))} (para cima da mesa, em movimento). (iv) Nos masculinos inanimados o acusativo é igual ao nominativo; nos femininos em -а, ele tem forma própria. Em todos, o preposicional termina em -е.</p>`],
      ramos: [["masc. em consoante", "+ е", ["стол", "город"]], ["fem. em -а, -я", "→ е", ["школа", "неделя"]], ["fem. em -ь", "→ и", ["ночь", "дверь"]], ["neutro", "→ е", ["окно", "море"]], ["em -ий, -ия, -ие", "→ ии", ["станция", "здание"]], ["plural", "-ах / -ях", [["книга", 1], ["друг", 1]]]],
      leituraPlacar: "As que fogem no singular são as palavras de radical que muda; o resto do caso é de uma regularidade rara em russo.",
      ponte: R`<p>Algumas palavras masculinas têm, depois de ${ru("в")} e ${ru("на")}, uma forma própria em -у no lugar da de -е; as gramáticas a chamam de <b>locativo</b>, e o dicionário a registra como forma extra, já com a preposição, por exemplo ${ru("в году́")} ("no ano"). Este tema não treina o locativo: basta reconhecê-lo quando aparecer.</p>`,
      olimpiada: R`<p>É o caso das condições de um enunciado: "num recipiente", "sobre a mesa", "no instante". Depois de ${ru("в")} e ${ru("на")}, espere uma palavra em -е, -и ou -ах e volte ao nominativo: ${ru(f("задача", "prep"))} é ${ru("зада́ча")}; ${ru(f("поле", "prep"))} é ${ru("по́ле")} (em que nada muda); ${ru(f("энергия", "prep"))} é ${ru("эне́ргия")}.</p>`,
      usoCerto: "Indicar, depois de preposição, o lugar onde algo está ou o assunto de que se fala.", usosErrados: ["Marcar o sujeito da frase.", "Marcar o objeto direto.", "Indicar o instrumento com que se faz a ação.", "Marcar o objeto indireto (a quem se dá algo)."], dicaUso: "É o único caso que nunca aparece sem preposição.",
      perguntaChefao: R`Qual é a diferença de sentido entre ${ru("в")} + ${ru(f("школа", "prep"))} e ${ru("в")} + ${ru(f("школа", "acc"))}?`, respostaChefao: R`Com o preposicional (${ru(f("школа", "prep"))}): na escola, lugar onde se está. Com o acusativo (${ru(f("школа", "acc"))}): para a escola, destino do movimento.` });
  },
  montar(F) {
    let e = document.getElementById("lab-ache"); e.outerHTML = F.lab("Ache o caso na frase: clique na palavra", "lab-ache"); SIM.ruAcheCaso(document.getElementById("lab-ache"), F, { caso: "prep" });
    e = document.getElementById("lab-regra"); e.outerHTML = F.lab("A regra do caso contra o dicionário", "lab-regra"); SIM.ruCasoLab(document.getElementById("lab-regra"), F, { caso: "prep", inicio: "стол" });
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa mental: uma palavra em todas as formas", "lab-mapa"); SIM.ruMapa(document.getElementById("lab-mapa"), F, { inicio: "стол", palavras: SIM.ruListaMapa });
    e = document.getElementById("lab-escreve"); e.outerHTML = F.lab("Escreva a palavra no caso pedido", "lab-escreve"); SIM.ruEscreveCaso(document.getElementById("lab-escreve"), F, { casos: ["prep"] });
  },
});
