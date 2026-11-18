/* Russo RG11 · Verbos no presente.
   Nada de memória: todas as formas vêm das tabelas de conjugação do Wiktionary em inglês (SIM.RU.VERB, GERADO por tools/russo/gera-russo.py a partir
   de tools/russo/dadosR5.json); as frases são exemplos de uso dos verbetes, com a forma do verbo conferida pelo gerador contra a tabela (SIM.RU.FRV);
   as duas conjugações, o infinitivo, o reflexivo, o imperativo e o verbo "ser" vêm de "Russian grammar" e "Zero copula" (Wikipedia em inglês).
   A regra simples do presente (SIM.ruPresenteRegra, em assets/sims/russo/verbos.js) parte só do infinitivo e é MEDIDA contra o dicionário:
   o placar do texto é calculado na hora (SIM.ruPlacarVerbo). */
F.registrar("russo/RG11", {
  retoma: ["RG04"],
  html(F) {
    const R = String.raw, RU = SIM.RU, V = RU.VERB, T = SIM.ruTemaVerbo(F, D, "pres"), ru = T.ru, P = T.placar, PE = SIM.ruPess;
    const linha = (w) => V[w].pres.map((g) => g[0]), tab2 = D.svg(560, 190, SIM.dq.tab(40, 22, [90, 195, 195], [["pessoa", V["читать"].ac + " (1ª)", V["говорить"].ac + " (2ª)"], ...PE.map((p, i) => [p, linha("читать")[i], linha("говорить")[i]])]), "figura");
    const mapa = SIM.ruMapaSvg(SIM.ruMapaDe("читать"), Array(20).fill(true)).svg;
    const mapaTema = SIM.ruMapaSvg({ centro: "presente", sub: "muda com a pessoa", ramos: [
      { nome: "1ª conjugação", sub: "-ю, -ешь, -ет...", folhas: [{ rot: "", forma: V["читать"].ac + " → " + linha("читать")[2] }, { rot: "", forma: V["работать"].ac + " → " + linha("работать")[2] }] },
      { nome: "2ª conjugação", sub: "-ю, -ишь, -ит...", folhas: [{ rot: "", forma: V["говорить"].ac + " → " + linha("говорить")[2] }, { rot: "", forma: V["звонить"].ac + " → " + linha("звонить")[2] }] },
      { nome: "reflexivos", sub: "-ся / -сь", folhas: [{ rot: "", forma: linha("учиться")[0] }, { rot: "", forma: linha("учиться")[2] }] },
      { nome: "radical que muda", sub: "aprender junto", folhas: [{ rot: "", forma: V["писать"].ac + " → " + linha("писать")[0] }, { rot: "", forma: V["видеть"].ac + " → " + linha("видеть")[0] }] },
      { nome: "irregulares", sub: "vale a tabela", folhas: [{ rot: "", forma: V["хотеть"].ac + " → " + linha("хотеть")[0] }, { rot: "", forma: V["идти"].ac + " → " + linha("идти")[0] }] },
      { nome: "imperativo", sub: "-й, -и, -ь (+ -те)", folhas: [{ rot: "", forma: V["читать"].imp[0][0] }, { rot: "", forma: V["говорить"].imp[1][0] }] }] }, Array(20).fill(true)).svg;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Gramática russa</div>
        <div class="q">${ru("Я говорю́ по-ру́сски.", 22)} "Eu falo russo." E ${ru("Что она́ говори́т?", 22)} "O que ela está dizendo?" O verbo é o mesmo, ${ru(V["говорить"].ac)}, mas termina diferente em cada frase. O que a terminação está contando ao leitor?</div>
        <p><b>Quem fala.</b> No presente, o verbo russo muda com a pessoa, como em português: seis terminações, uma para cada pessoa. Um exemplo: ${ru("рабо́тает")} é a forma de "ele, ela" de ${ru(V["работать"].ac)} (${V["работать"].pt}), e o mapa mental deste tema mostra as outras cinco, mais o passado e o imperativo.</p></div>
        ${F.chute({ q: "работать é \"trabalhar\". Qual destas formas quer dizer \"ele trabalha\"?", ops: [linha("работать")[0], linha("работать")[1], linha("работать")[2], linha("работать")[5]].map((s) => s.split("́").join("")), certa: 2, exp: "работает: a terminação -ет é a de \"ele, ela\" na primeira conjugação. As outras são de я, de ты e de они." })}`),

      F.secao("laboratorio", "Laboratório: quem fala?", R`<p>Aparece uma forma de verbo; clique na pessoa a que ela pertence. Depois o laboratório mostra o infinitivo e o sentido.</p><div id="lab-quem"></div>`),

      F.secao("conjugacoes", "Duas conjugações", R`
        <p>O <b>infinitivo</b>, a forma do dicionário, termina quase sempre em ${ru("-ть")} (às vezes em ${ru("-ти")} ou ${ru("-чь")}). Para o presente, o russo tem dois jogos de terminações, e a gramática os chama de primeira e segunda conjugação:</p>
        ${F.fig(tab2, "As duas conjugações no presente, com um verbo de cada. Formas do Wiktionary em inglês.")}
        ${F.formula(R`\text{1ª:}\ \ \text{-ю (-у), -ешь, -ет, -ем, -ете, -ют (-ут)}\qquad\qquad \text{2ª:}\ \ \text{-ю (-у), -ишь, -ит, -им, -ите, -ят (-ат)}`, "Terminações do presente")}
        <p>A diferença está na vogal: ${ru("е")} na primeira, ${ru("и")} na segunda. Depois de consoante dura e de ${ru("ж, ш, щ, ч")} escreve-se ${ru("-у")} e ${ru("-ут")} ou ${ru("-ат")} no lugar de ${ru("-ю")}, ${ru("-ют")}, ${ru("-ят")}; e o ${ru("е")} da terminação vira ${ru("ё")} quando é tônico (${linha("идти")[2]}, ${linha("жить")[2]}).</p>
        ${F.formula(R`\text{reflexivo:}\ \ \text{forma do verbo} + \text{-ся (depois de consoante)}\ \ \text{ou}\ \ \text{-сь (depois de vogal)}`, "Verbos em -ся")}
        <p><b>Verbos reflexivos.</b> Levam ${ru("-ся")} ou ${ru("-сь")} colado no fim, depois da terminação de pessoa: ${ru(V["учиться"].ac)} (${V["учиться"].pt}) → ${linha("учиться").join(", ")}.</p>
        ${F.demo("Regra 9: do infinitivo às seis pessoas", R`<p><b>Afirmação.</b> Para um verbo regular, o presente sai do infinitivo em dois passos.</p>
          <p><b>Passo a passo.</b> (i) Infinitivo em ${ru("-ать")}, como ${ru(V["читать"].ac)}: tire ${ru("-ть")} e ponha as terminações da primeira conjugação: ${linha("читать").join(", ")}. (ii) Infinitivo em ${ru("-ить")}, como ${ru(V["говорить"].ac)}: tire ${ru("-ить")} e ponha as da segunda: ${linha("говорить").join(", ")}. (iii) Agora o aviso: isso só vale para os verbos em que o radical do presente é o mesmo do infinitivo. Em ${ru(V["писать"].ac)} não é: ${linha("писать").join(", ")}. O passo (iii) é a razão de os dicionários darem, ao lado do infinitivo, as formas de я e de ты.</p>`)}
        ${F.caixa("fisico", R`<p>Quanto vale a regra do passo a passo? Medido agora, nos ${SIM.ruVerbos().length} verbos do banco: ela se aplica a ${P.n} e acerta <b>todas</b> as seis formas de <b>${P.ok}</b> deles (${P.formas.ok} de ${P.formas.n} formas); nos outros ${P.semRegra.length} (${P.semRegra.join(", ")}) nem se aplica. Onde erra: ${P.erradas.join(", ")}. É um placar bem mais baixo que o das regras dos casos, e isso é informação: no verbo russo, o infinitivo não basta. Aprenda cada verbo com três formas (infinitivo, я, ты) e o resto sai sozinho.</p>`, "Pense como quem mede")}
        ${F.caixa("pegadinha", R`<p>O verbo "ser" some no presente. A fonte diz que a cópula ${ru("быть")} é normalmente omitida no presente, mas não no passado nem no futuro. Por isso ${ru("Я ру́сский.")} é uma frase completa, sem verbo nenhum à vista, e quer dizer "Eu sou russo". A forma ${ru("есть")} existe, mas hoje aparece sobretudo no sentido de "há", como em ${ru("У меня есть яблоко.")} (Eu tenho uma maçã.)</p>`)}`),

      F.secao("laboratorio2", "Laboratório: conjugue e compare com o dicionário", R`<p>Conjugue em voz alta as seis pessoas e só então compare. As formas em que a regra simples falha aparecem em amarelo.</p><div id="lab-conjuga"></div>`),

      F.secao("mapa", "Mapa mental: o verbo inteiro", R`
        ${F.fig(mapaTema, "Mapa mental do presente. Todas as formas vêm das tabelas do Wiktionary em inglês.")}
        <p>E este é o mapa de um verbo só, com tudo o que ele vira. Escolha outros no laboratório e use "esconder e lembrar" no ramo do presente.</p><div id="lab-mapa"></div>
        ${F.caixa("ponte", R`<p>O <b>imperativo</b> sai da base do presente: a fonte dá a regra geral de acrescentar ${ru("-и")}, ${ru("-ь")} ou ${ru("-й")} conforme o acento e o fim da base, e ${ru("-те")} para o plural e para o tratamento de respeito: ${ru(V["читать"].imp[0][0])}, ${ru(V["читать"].imp[1][0])}; ${ru(V["говорить"].imp[0][0])}, ${ru(V["говорить"].imp[1][0])}. O tema do imperativo volta a isso com calma. E repare no ramo "aspecto" do mapa: cada verbo russo tem um par, e é esse par que decide como se faz o futuro ${F.ret("russo/RG12")}.</p>`)}`),

      F.secao("treino", "Treino: escreva a forma", R`<p>Aparecem a pessoa e o infinitivo; escreva o verbo conjugado. Entram regulares e irregulares.</p><div id="lab-escreve"></div>
        ${F.caixa("olimpiada", R`<p>Para ler um enunciado, o caminho é o inverso do deste tema: você vê a forma conjugada e precisa do infinitivo para achar o verbo no dicionário. As terminações de pessoa são poucas e fixas; tire a terminação, ponha ${ru("-ть")} e teste. Quando não funcionar, o verbo é dos que mudam o radical, e aí vale conhecer os mais comuns: ${T.irr.slice(0, 6).map((w) => `${linha(w)[2]} → ${ru(V[w].ac)}`).join(", ")}. Os exercícios 9 e 13 treinam esse caminho de volta.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", T.exemplos),
      F.secao("desafios", "Exercícios", T.exs.join("") + T.chefao),
    ].join("");
  },
  montar(F) {
    let e = document.getElementById("lab-quem"); e.outerHTML = F.lab("Quem fala? Ligue a forma à pessoa", "lab-quem"); SIM.ruQuemFala(document.getElementById("lab-quem"), F, { tempo: "pres" });
    e = document.getElementById("lab-conjuga"); e.outerHTML = F.lab("Conjugue: a regra contra o dicionário", "lab-conjuga"); SIM.ruConjugaLab(document.getElementById("lab-conjuga"), F, { tempo: "pres", inicio: "читать" });
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa mental: uma palavra em todas as formas", "lab-mapa"); SIM.ruMapa(document.getElementById("lab-mapa"), F, { inicio: "работать", tipo: "verbo", palavras: SIM.ruVerbos().filter((w) => w !== "ехать") });
    e = document.getElementById("lab-escreve"); e.outerHTML = F.lab("Escreva a forma do verbo", "lab-escreve"); SIM.ruEscreveVerbo(document.getElementById("lab-escreve"), F, { tempo: "pres" });
  },
});
