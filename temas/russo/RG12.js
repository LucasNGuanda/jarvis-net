/* Russo RG12 · Verbos no passado e no futuro.
   Nada de memória: todas as formas (passado, futuro composto dos imperfectivos, futuro simples dos perfectivos, pares de aspecto) vêm das tabelas
   e das linhas dos verbetes do Wiktionary em inglês (SIM.RU.VERB e SIM.RU.PARES_ASP, GERADOS a partir de tools/russo/dadosR5.json); as frases são
   exemplos dos verbetes, com a forma conferida pelo gerador (SIM.RU.FRV); a formação do passado, a concordância de gênero, os dois futuros e o
   aspecto vêm de "Russian grammar" (Wikipedia em inglês). A regra do passado (SIM.ruPassadoRegra) é MEDIDA contra o dicionário e o placar do texto
   é calculado na hora (SIM.ruPlacarVerbo). */
F.registrar("russo/RG12", {
  retoma: ["RG11"],
  html(F) {
    const R = String.raw, RU = SIM.RU, V = RU.VERB, T = SIM.ruTemaVerbo(F, D, "pass"), ru = T.ru, P = T.placar, PE = SIM.ruPess, PA = SIM.ruPassP;
    const ps = (w) => V[w].pass.map((g) => g[0]), ft = (w) => (V[w].fut || V[w].pres).map((g) => g[0]);
    const tabP = D.svg(560, 150, SIM.dq.tab(40, 22, [100, 190, 190], [["sujeito", V["читать"].ac, V["идти"].ac], ...PA.map((p, i) => [p, ps("читать")[i], ps("идти")[i]])]), "figura");
    const tabF = D.svg(560, 190, SIM.dq.tab(20, 22, [80, 230, 210], [["pessoa", V["читать"].ac + " (imperfectivo)", V["прочитать"].ac + " (perfectivo)"], ...PE.map((p, i) => [p, ft("читать")[i], ft("прочитать")[i]])]), "figura");
    const mapaTema = SIM.ruMapaSvg({ centro: "tempos", sub: "passado e futuro", ramos: [
      { nome: "passado", sub: "-л, -ла, -ло, -ли", folhas: [{ rot: "", forma: ps("читать").slice(0, 2).join(", ") }, { rot: "", forma: ps("читать").slice(2).join(", ") }] },
      { nome: "futuro composto", sub: "imperfectivos", folhas: [{ rot: "", forma: ft("читать")[0] }, { rot: "", forma: ft("читать")[2] }] },
      { nome: "futuro simples", sub: "perfectivos", folhas: [{ rot: "", forma: ft("прочитать")[0] }, { rot: "", forma: ft("прочитать")[2] }] },
      { nome: "passado irregular", sub: "vale a tabela", folhas: [{ rot: "", forma: V["идти"].ac + " → " + ps("идти")[0] }, { rot: "", forma: V["мочь"].ac + " → " + ps("мочь")[0] }] },
      { nome: "reflexivos", sub: "-ся / -сь", folhas: [{ rot: "", forma: ps("учиться")[0] }, { rot: "", forma: ps("учиться")[1] }] },
      { nome: "pares de aspecto", sub: "imperf. / perf.", folhas: RU.PARES_ASP.slice(0, 2).map((p) => ({ rot: "", forma: V[p[0]].ac + " / " + V[p[1]].ac })) }] }, Array(20).fill(true)).svg;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Gramática russa</div>
        <div class="q">Para dizer "eu dormia", um homem diz ${ru("я спал", 22)} e uma mulher diz ${ru("я спала́", 22)}. O pronome é o mesmo, a pessoa é a mesma, o tempo é o mesmo, e o verbo sai diferente. O que está mudando o verbo?</div>
        <p>O <b>gênero de quem fala</b>. No passado, o verbo russo não muda com a pessoa: muda com o gênero e o número do sujeito, como um adjetivo. São só quatro formas, e isso faz do passado o tempo mais fácil do russo. O futuro tem outra surpresa: há dois jeitos de formá-lo, e quem escolhe é o <b>aspecto</b> do verbo.</p></div>
        ${F.chute({ q: "читать é \"ler\". Uma mulher diz \"eu li\". Qual é a forma do verbo?", ops: ps("читать").map((s) => s.split("́").join("")), certa: 1, exp: "читала: o -ла marca sujeito feminino, seja qual for a pessoa (eu, tu, ela). Um homem diria читал." })}`),

      F.secao("laboratorio", "Laboratório: quem fez?", R`<p>Aparece uma forma do passado; clique no sujeito com que ela concorda.</p><div id="lab-quem"></div>`),

      F.secao("passado", "O passado", R`
        <p>Tire ${ru("-ть")} do infinitivo e ponha a marca do sujeito:</p>
        ${F.fig(tabP, "O passado de um verbo regular e de um irregular. Formas do Wiktionary em inglês.")}
        ${F.formula(R`\text{passado} = \text{infinitivo sem -ть} + \text{-л (ele)},\ \text{-ла (ela)},\ \text{-ло (neutro)},\ \text{-ли (plural)}`, "Formação do passado")}
        <p>A marca vale para todas as pessoas: ${ru("я")}, ${ru("ты")} e ${ru("он")} usam a mesma forma, se o sujeito for um homem. Nos reflexivos, ${ru("-ся")} vai depois de consoante e ${ru("-сь")} depois de vogal: ${ps("учиться").join(", ")}.</p>
        ${F.demo("Regra 10: por que o passado concorda em gênero", R`<p><b>Afirmação.</b> O passado russo se comporta como um adjetivo porque já foi um.</p>
          <p><b>Passo a passo.</b> (i) A fonte conta que a forma em ${ru("-л")} era um particípio, usado junto com o presente do verbo ${ru("быть")} ("ser") para formar um tempo composto. (ii) Particípio concorda com o sujeito em gênero e número, como qualquer adjetivo. (iii) O verbo "ser" desapareceu do presente; o particípio ficou sozinho e virou o passado. (iv) Resultado: quatro formas, sem distinção de pessoa. Em ${ru("Я ему́ помога́л.")} (Eu o ajudava.), sabe-se que quem fala é um homem.</p>`)}
        ${F.caixa("fisico", R`<p>A regra "tire -ть, ponha -л" medida agora contra o dicionário: aplica-se a ${P.n} verbos e acerta as quatro formas de <b>${P.ok}</b> (${P.formas.ok} de ${P.formas.n} formas). Erra em ${P.erradas.join(", ") || "nenhum"} e não se aplica a ${P.semRegra.join(", ")}, cujos infinitivos não terminam em -ть. Compare com o presente ${F.ret("russo/RG11")}, em que a regra simples acertava ${SIM.ruPlacarVerbo("pres").ok} de ${SIM.ruPlacarVerbo("pres").n} verbos: o passado quase não tem armadilha.</p>`, "Pense como quem mede")}
        ${F.caixa("pegadinha", R`<p>Os poucos passados irregulares são de verbos muito usados. ${ru(V["идти"].ac)} (${V["идти"].pt}): ${ps("идти").join(", ")}, de outro radical. ${ru(V["мочь"].ac)} (${V["мочь"].pt}): ${ps("мочь").join(", ")}, sem o ${ru("-л")} no masculino. ${ru(V["есть"].ac)} (${V["есть"].pt}): ${ps("есть").join(", ")}. Estes se aprendem pelo mapa mental de cada um.</p>`)}`),

      F.secao("laboratorio2", "Laboratório: o passado contra o dicionário", R`<p>Diga as quatro formas e compare.</p><div id="lab-conjuga"></div>`),

      F.secao("futuro", "Dois futuros e o aspecto", R`
        <p>Quase todo verbo russo existe em dupla: um <b>imperfectivo</b> (a ação em andamento, repetida, sem olhar para o fim) e um <b>perfectivo</b> (a ação vista como um todo, concluída). O dicionário diz o aspecto de cada verbo e dá o par: ${RU.PARES_ASP.slice(0, 6).map((p) => `${ru(V[p[0]].ac)} / ${ru(V[p[1]].ac)}`).join(", ")}.</p>
        ${F.fig(tabF, "Os dois futuros: composto (imperfectivo) e simples (perfectivo). Formas do Wiktionary em inglês.")}
        ${F.formula(R`\text{imperfectivo:}\ \ \text{буду, будешь, будет...} + \text{infinitivo}\qquad\qquad \text{perfectivo:}\ \ \text{terminações de pessoa no próprio verbo}`, "Como se faz o futuro")}
        <ul><li><b>Imperfectivo → futuro composto</b>: o futuro de ${ru("быть")} mais o infinitivo. A fonte dá ${ru("Она́ бу́дет чита́ть")}, "ela estará lendo": a ação em andamento num momento do futuro, sem garantia de que termine.</li>
        <li><b>Perfectivo → futuro simples</b>: as mesmas terminações do presente, mas o sentido é de futuro, porque um perfectivo não tem presente. A fonte dá ${ru("Она́ прочита́ет")}, "ela vai ler (até o fim)".</li></ul>
        ${F.fig(mapaTema, "Mapa mental do passado e do futuro. Todas as formas vêm das tabelas do Wiktionary em inglês.")}
        ${F.caixa("ponte", R`<p>O aspecto é assunto para um tema inteiro, o próximo da lista. Por enquanto, guarde a consequência prática: uma forma como ${ru(ft("прочитать")[2])} tem cara de presente e é futuro; uma como ${ru(V["читать"].pres[2][0])} é presente mesmo. Quem diz qual é qual não é a terminação: é o aspecto do verbo, que vem escrito no dicionário (e no centro do mapa mental).</p>`)}`),

      F.secao("mapa", "Mapa mental: o verbo inteiro", R`<p>Abra um par de aspecto, um verbo de cada vez, e compare os ramos: no perfectivo, o ramo das pessoas se chama "futuro".</p><div id="lab-mapa"></div>`),

      F.secao("treino", "Treino: escreva o passado", R`<p>Aparecem o sujeito e o infinitivo; escreva o verbo no passado.</p><div id="lab-escreve"></div>
        ${F.caixa("olimpiada", R`<p>Enunciado de problema conta uma situação, e por isso está cheio de passado: procure as palavras terminadas em ${ru("-л")}, ${ru("-ла")}, ${ru("-ло")}, ${ru("-ли")}, ponha ${ru("-ть")} no lugar e você tem o infinitivo para o dicionário. O gênero da terminação ainda ajuda a achar o sujeito: uma forma em ${ru("-ло")} pede sujeito neutro, uma em ${ru("-ла")}, feminino. Os exercícios 9 e 13 treinam esse caminho.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", T.exemplos),
      F.secao("desafios", "Exercícios", T.exs.join("") + T.chefao),
    ].join("");
  },
  montar(F) {
    let e = document.getElementById("lab-quem"); e.outerHTML = F.lab("Quem fala? Ligue a forma à pessoa", "lab-quem"); SIM.ruQuemFala(document.getElementById("lab-quem"), F, { tempo: "pass" });
    e = document.getElementById("lab-conjuga"); e.outerHTML = F.lab("Conjugue: a regra contra o dicionário", "lab-conjuga"); SIM.ruConjugaLab(document.getElementById("lab-conjuga"), F, { tempo: "pass", inicio: "читать" });
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa mental: uma palavra em todas as formas", "lab-mapa"); SIM.ruMapa(document.getElementById("lab-mapa"), F, { inicio: "читать", tipo: "verbo", palavras: SIM.ruVerbos().filter((w) => w !== "ехать") });
    e = document.getElementById("lab-escreve"); e.outerHTML = F.lab("Escreva a forma do verbo", "lab-escreve"); SIM.ruEscreveVerbo(document.getElementById("lab-escreve"), F, { tempo: "pass" });
  },
});
