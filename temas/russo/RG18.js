/* Russo RG18 · Orações subordinadas e conjunções.
   Nada de memória. Conjunções: verbetes do Wiktionary em inglês (SIM.RU.CONJ); os três grupos de coordenação (soma, oposição, alternativa), a
   diferença entre и, а e но, a lista de subordinativas e a ordem das palavras: seção "Syntax" de "Russian grammar" (Wikipedia em inglês); frases:
   SIM.RU.FRC; который: tabela do Wiktionary (SIM.RU.KOT). Tudo GERADO de tools/russo/dadosR6.json; o gerador só aceita uma coordenativa num grupo
   se a Wikipedia a listar nele. Medida: a declinação de который contra a regra dos adjetivos do RG09 (28 de 28 na geração de 18/11/2026; o número
   da página é calculado na hora). A classificação das subordinativas por função (causa, condição, tempo...) é minha, a partir da definição de
   cada verbete. */
F.registrar("russo/RG18", {
  retoma: ["RG09", "RG17"],
  html(F) {
    const R = String.raw, RU = SIM.RU, CJ = RU.CONJ, FRC = RU.FRC, DE = RU.DECL, AC = "́", sem = (s) => String(s).split(AC).join(""), GR = SIM.ruGruposConj, NC = SIM.ruNomeCaso, PK = SIM.ruPlacarKot(), PAP = SIM.ruPapeisKot, kot = SIM.ruKotDe;
    const ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`, cap = (s) => s[0].toUpperCase() + s.slice(1), cj = (w) => CJ.find((x) => x.w === w), fr = (w, i = 0) => FRC.filter((x) => x.w === w)[i];
    const cart = (w, sub = "", cor = "var(--ink)") => { const n = [...sem(w)].length, t = Math.min(48, Math.floor(820 / Math.max(n, 6))); return D.svg(560, 116, `<rect x="30" y="8" width="500" height="78" rx="12" style="fill:var(--card2);stroke:var(--line)"/><text x="280" y="${50 + t * 0.34}" text-anchor="middle" style="font:700 ${t}px Inter,system-ui,sans-serif;fill:${cor};letter-spacing:.5px">${w}</text>` + (sub ? D.txt(280, 106, sub, "tx2", "middle") : ""), "figura"); };
    const coord = CJ.filter((x) => x.grupo !== "sub"), subs = CJ.filter((x) => x.grupo === "sub"), ALT_G = Object.values(GR).map((g) => cap(g) + "."), iG = Object.keys(GR), curtas = FRC.filter((x) => [...x.ru].length <= 38);
    const tabCoord = D.svg(560, 40 + 22 * 4, SIM.dq.tab(10, 22, [140, 400], [["grupo", "conjunções"], ...["soma", "opos", "alt"].map((g) => [GR[g].replace("coordenação: ", ""), coord.filter((x) => x.grupo === g).map((x) => x.ac + " (" + x.pt.split(",")[0] + ")").join(", ")])]), "figura");
    const tabSub = D.svg(560, 40 + 22 * (subs.length + 1), SIM.dq.tab(40, 22, [150, 170, 160], [["conjunção", "em português", "função"], ...subs.map((x) => [x.ac, x.pt, x.fun])]), "figura");
    const tabKot = D.svg(560, 40 + 22 * 7, SIM.dq.tab(10, 22, [120, 105, 105, 105, 105], [["caso", "masculino", "neutro", "feminino", "plural"], ...["nom", "acc", "gen", "dat", "ins", "prep"].map((c) => [NC[c] + (c === "acc" ? " (inan.)" : ""), ...[0, 1, 2, 3].map((k) => SIM.ruAdjDic("который", c, k, false)[0])])]), "figura");
    const tres = FRC.filter((x) => x.ru.startsWith("они")), xK = fr("который"), xChto = fr("что");
    const mapaTema = SIM.ruMapaSvg({ centro: "ligar orações", sub: "coordenar ou subordinar", ramos: [
      { nome: "soma", sub: "coordenação", folhas: [{ rot: "", forma: coord.filter((x) => x.grupo === "soma").map((x) => x.w).join(", ") }] },
      { nome: "oposição", sub: "coordenação", folhas: [{ rot: "", forma: "а, но" }, { rot: "", forma: "однако, зато" }] },
      { nome: "alternativa", sub: "coordenação", folhas: [{ rot: "", forma: coord.filter((x) => x.grupo === "alt").map((x) => x.w).join(", ") }] },
      { nome: "que, para que", sub: "conteúdo, finalidade", folhas: [{ rot: "", forma: "что, чтобы" }] },
      { nome: "porque, se, embora", sub: "causa, condição, concessão", folhas: [{ rot: "", forma: "потому что, так как" }, { rot: "", forma: "если, хотя" }] },
      { nome: "quando, onde, como", sub: "tempo, lugar, comparação", folhas: [{ rot: "", forma: "когда, пока, где" }, { rot: "", forma: "как, чем" }] },
      { nome: "o qual", sub: "oração relativa", folhas: [{ rot: "", forma: "который, -ая, -ое" }] }] }, Array(20).fill(true)).svg;
    const SUBST = ["стол", "книга", "окно", "друг", "сестра", "письмо", "город", "задача"].filter((w) => DE[w]);

    const exemplos = F.exemplo({ titulo: "Da conjunção ao sentido", casos: [
      { nome: "Fácil: que relação a conjunção marca", gerar: (p) => { const x = p ? fr("а") : F.escolha(FRC), c = cj(x.w);
        return { enun: R`<p>Na frase ${ru(x.ru)}, que relação a palavra ${ru(x.forma)} estabelece?</p>`, fig: cart(SIM.ruComLacuna(x), "frase da fonte"), passos: [R`<p>(i) Ache as duas partes: o que vem antes e o que vem depois de ${ru(x.forma)}.</p>`, R`<p>(ii) ${ru(c.ac)} quer dizer "${c.pt}": ${GR[c.grupo]} (${c.fun}).</p>`, R`<p>(iii) Tradução: "${x.pt}"</p>`], resp: c.fun }; } },
      { nome: "Médio: и, а ou но?", gerar: (p) => { const x = p ? tres[1] : F.escolha(tres), c = cj(x.w);
        return { enun: R`<p>A fonte dá três frases quase iguais. Qual conjunção completa esta: ${ru(SIM.ruComLacuna(x))} ("${x.pt}")?</p>`, fig: cart(SIM.ruComLacuna(x), "и, а ou но?"), passos: [R`<p>(i) ${ru("и")}: o que vem depois completa, sem se opor ao que veio antes.</p>`, R`<p>(ii) ${ru("а")}: o que vem depois contrasta com o anterior, mais fraco que um "mas".</p>`, R`<p>(iii) ${ru("но")}: oposição de verdade.</p>`, R`<p>(iv) Aqui: <b>${c.ac}</b> (${c.fun}). Frase inteira: ${ru(x.ru)}.</p>`], resp: c.ac }; } },
      { nome: "Difícil: a forma de который", gerar: (p) => { const n = p ? "книга" : F.escolha(SUBST), k = p ? 0 : Math.floor(Math.random() * PAP.length), c = PAP[k][0], d = DE[n];
        return { enun: R`<p>Complete com a forma certa de ${ru("кото́рый")}: "${ru(d.ac)} (${d.pt}), ___ ..." com o sentido de "${PAP[k][2]}".</p>`, fig: cart(d.ac + ", ?", PAP[k][2]), passos: [R`<p>(i) Gênero e número vêm do antecedente: ${d.ac} é ${d.genPt.split(",")[0]}, singular.</p>`, R`<p>(ii) O caso vem do papel de "que" dentro da oração dele: ${PAP[k][1]} → ${NC[c]}.</p>`, R`<p>(iii) Na tabela: ${NC[c]}, ${d.genPt.split(",")[0]}${c === "acc" && d.g === "m" ? " (" + (d.an === "anim" ? "animado: igual ao genitivo" : "inanimado: igual ao nominativo") + ")" : ""}: <b>${kot(n, c)}</b>.</p>`], resp: kot(n, c) }; } }] });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", gerar: (p) => { const c = SIM.pega(CJ, p, 3), a5 = SIM.alt5(cap(c.pt) + ".", [...new Set(CJ.filter((y) => y.pt.split(",")[0] !== c.pt.split(",")[0]).map((y) => cap(y.pt) + "."))], p);
        return { enun: R`<p>O que quer dizer a palavra abaixo?</p>`, fig: cart(c.ac, "conjunção"), ...a5, resp: c.pt, dicas: [R`<p>${cap(GR[c.grupo])}.</p>`], sol: R`<p>${ru(c.ac)} = <b>${c.pt}</b>.</p>` }; } }),
      F.exercicio({ n: 2, nivel: "Físico", gerar: (p) => { const c = SIM.pega(CJ, p, 9);
        return { enun: R`<p>A conjunção abaixo (${c.pt}) é de que tipo?</p>`, fig: cart(c.ac, c.pt), alts: ALT_G, certa: "ABCD"[iG.indexOf(c.grupo)], resp: GR[c.grupo], dicas: [R`<p>Coordenar: partes do mesmo nível. Subordinar: uma oração pendurada na outra.</p>`], sol: R`<p><b>${cap(GR[c.grupo])}</b> (${c.fun}).</p>` }; } }),
      F.exercicio({ n: 3, nivel: "Físico", gerar: (p) => { const x = p ? fr("что") : F.escolha(curtas.filter((y) => y.w !== "который")), a5 = SIM.alt5(x.w + ".", [...new Set(CJ.map((y) => y.w))].filter((y) => y !== x.w && y !== "который" && !(x.w === "или" && y === "либо") && !(x.w === "либо" && y === "или") && !(["тоже", "также"].includes(x.w) && ["тоже", "также"].includes(y)) && !(["потому что", "так как"].includes(x.w) && ["потому что", "так как"].includes(y))).map((y) => y + "."), p);
        return { enun: R`<p>Qual palavra completa a frase? Tradução: "${x.pt}"</p>`, fig: cart(SIM.ruComLacuna(x), "frase da fonte"), ...a5, resp: x.forma, dicas: [R`<p>Procura-se: ${cj(x.w).pt}.</p>`], sol: R`<p>${ru(x.ru)}</p>` }; } }),
      F.exercicio({ n: 4, nivel: "Físico", gerar: (p) => { const x = p ? tres[0] : F.escolha(tres);
        return { enun: R`<p>Segundo a fonte, qual conjunção completa a frase: ${ru(SIM.ruComLacuna(x))} ("${x.pt}")?</p>`, fig: cart(SIM.ruComLacuna(x), "и, а ou но?"), alts: ["и.", "а.", "но."], certa: "ABC"[["и", "а", "но"].indexOf(x.w)], resp: x.w, dicas: [R`<p>${ru("и")} completa; ${ru("а")} contrasta de leve; ${ru("но")} opõe.</p>`], sol: R`<p>${ru(x.ru)}: <b>${x.w}</b> (${cj(x.w).fun}).</p>` }; } }),
      F.exercicio({ n: 5, nivel: "Físico", gerar: (p) => { const x = p ? fr("когда") : F.escolha(curtas), a5 = SIM.alt5(x.pt, FRC.filter((y) => y.pt !== x.pt).map((y) => y.pt), p);
        return { enun: R`<p>Qual é a tradução da frase abaixo?</p>`, fig: cart(x.ru, "frase da fonte"), ...a5, resp: x.pt, dicas: [R`<p>${ru(x.forma)} = ${cj(x.w).pt}.</p>`], sol: R`<p><b>${x.pt}</b></p>` }; } }),
      F.exercicio({ n: 6, nivel: "Máximo", gerar: (p) => { let q = p ? ["и", "но", "если", "или", "хотя"].map(cj) : []; while (q.length < 5) { const y = F.escolha(CJ); if (!q.includes(y)) q.push(y); } const v = q.filter((y) => y.grupo === "sub").length;
        return { enun: R`<p>Na tabela, cinco conjunções com a tradução. Quantas delas são de <b>subordinação</b>?</p>`, fig: D.svg(560, 150, SIM.dq.tab(90, 22, [150, 240], [["conjunção", "em português"], ...q.map((y) => [y.ac, y.pt])]), "figura"), num: { v, tol: 0.001, un: "", abs: 0.001 }, py: `${v}`, resp: String(v), dicas: [R`<p>Coordenativas do tema: ${coord.map((y) => y.w).join(", ")}.</p>`], sol: R`<p>Tipo de cada uma: ${q.map((y) => `${y.w}, ${GR[y.grupo]}`).join("; ")}. Subordinativas: <b>${v}</b>.</p>` }; } }),
      F.exercicio({ n: 7, nivel: "Físico", gerar: (p) => { const n = SIM.pega(SUBST, p, 1), k = p ? 0 : Math.floor(Math.random() * PAP.length), c = PAP[k][0], certo = sem(kot(n, c)), a5 = SIM.alt5(certo + ".", [...new Set(["nom", "acc", "gen", "dat", "ins", "prep"].flatMap((cc) => [0, 1, 2, 3].map((col) => sem(SIM.ruAdjDic("который", cc, col, false)[0]))))].filter((y) => y !== certo).map((y) => y + "."), p);
        return { enun: R`<p>Qual forma de ${ru("кото́рый")} completa: "${ru(DE[n].ac)} (${DE[n].pt}), ___ ..." no sentido de "${PAP[k][2]}"? Alternativas sem acento.</p>`, fig: cart(DE[n].ac + ", ?", PAP[k][2]), ...a5, resp: kot(n, c), dicas: [R`<p>Gênero: ${DE[n].genPt.split(",")[0]}. Caso: ${NC[c]}.</p>`], sol: R`<p><b>${kot(n, c)}</b> (${DE[n].genPt.split(",")[0]}, ${NC[c]}).</p>` }; } }),
      F.exercicio({ n: 8, nivel: "Máximo", gerar: (p) => { const k = p ? 0 : F.escolha([0, 1, 2]);
        return { enun: [R`<p>Em ${ru(xK.ru)}, por que ${ru("кни́гу")} está no acusativo e ${ru(xK.forma)} no nominativo?</p>`, R`<p>Segundo o verbete de ${ru("е́сли")}, que "se" ela <b>não</b> traduz?</p>`, R`<p>Segundo a fonte, qual é a ordem básica das palavras em russo, e quanta liberdade há?</p>`][k], fig: cart(["кни́гу, кото́рая", "если × ли", "ordem das palavras"][k], "sintaxe"), alts: ["Porque cada palavra tem o caso do seu papel na sua própria oração: objeto numa, sujeito na outra.", "O \"se\" de pergunta indireta (\"não sei se...\"), que é ли.", "Sujeito, verbo, objeto; mas, como os casos marcam as funções, todas as permutações são possíveis.", "Porque который nunca se declina.", "Verbo sempre no fim, como em alemão."], certa: "ABC"[k], resp: ["caso pelo papel em cada oração", "o de pergunta indireta", "SVO, com liberdade"][k], dicas: [R`<p>${["O livro é o que eu quero (objeto) e é o que está na mesa (sujeito).", "A nota do verbete compara com o \"if\" do inglês.", "A fonte lista seis ordens da mesma frase."][k]}</p>`], sol: [R`<p>O gênero e o número de кото́рая vêm de кни́га; o caso, do papel dentro da oração relativa (sujeito de лежи́т): nominativo.</p>`, R`<p>е́сли só exprime condição; o "se" de "se... ou não" é <b>ли</b>.</p>`, R`<p>Sujeito, verbo, objeto, com todas as permutações possíveis; a ordem serve para dar ênfase.</p>`][k] }; } }),
      F.exercicio({ n: 9, nivel: "Físico", gerar: (p) => { const f = p ? "causa" : F.escolha([...new Set(subs.map((y) => y.fun))]), boas = subs.filter((y) => y.fun === f), w = p ? boas[0] : F.escolha(boas), a5 = SIM.alt5(w.w + ".", CJ.filter((y) => y.fun !== f).map((y) => y.w + "."), p);
        return { enun: R`<p>Qual destas palavras introduz uma oração de <b>${f}</b>?</p>`, fig: cart("? → " + f, "conjunção subordinativa"), ...a5, resp: w.ac, dicas: [R`<p>Em português: "${w.pt}".</p>`], sol: R`<p><b>${w.ac}</b> (${w.pt}).</p>` }; } }),
      F.exercicio({ n: 10, nivel: "Máximo", gerar: (p) => { const k = p ? 0 : F.escolha([0, 1]);
        return { enun: k ? R`<p>Em ${ru("Он не зна́ет, что э́то зна́чит.")} ("Ele não sabe o que isto significa"), ${ru("что")} é a conjunção "que"?</p>` : R`<p>Em ${ru(xChto.ru)} ("${xChto.pt}"), que palavra é ${ru("что")}?</p>`, fig: cart(k ? "..., что э́то зна́чит" : xChto.ru, "что: conjunção ou pronome?"), alts: ["A conjunção \"que\": liga as duas orações e não tem função dentro da segunda.", "O pronome \"o que\": dentro da oração dele, é o objeto de зна́чит.", "Uma preposição.", "O imperativo de um verbo."], certa: k ? "B" : "A", resp: k ? "pronome" : "conjunção", dicas: [R`<p>Tente tirar что: a segunda oração continua completa?</p>`], sol: k ? R`<p>É o <b>pronome</b> (o exemplo está na entrada de pronome do verbete): sem ele, "isto significa" fica sem objeto.</p>` : R`<p>É a <b>conjunção</b>: "ele está em casa" é uma oração completa sem ela.</p>` }; } }),
      F.exercicio({ n: 11, nivel: "Físico", gerar: (p) => { const c = SIM.pega(CJ.filter((y) => y.w !== "который" && !["тоже", "также", "потому что", "так как", "или", "либо", "но", "однако"].includes(y.w)), p, 4);
        return { enun: R`<p>Escreva, em cirílico, a conjunção que quer dizer <b>${c.pt}</b>.</p>`, fig: cart("?", c.pt), txt: { v: c.w, teclado: "ru", rot: "conjunção" }, resp: c.ac, dicas: [R`<p>${cap(GR[c.grupo])}; ${[...c.w].length} letras.</p>`, R`<p>Começa por ${ru(c.w[0])}.</p>`], sol: R`<p>${ru(c.ac)}.</p>` }; } }),
      F.exercicio({ n: 12, nivel: "Máximo", gerar: (p) => { const x = p ? fr("где") : F.escolha(curtas.filter((y) => !["который", "или", "либо", "тоже"].includes(y.w)));
        return { enun: R`<p>Escreva, em cirílico, a palavra que falta. Tradução: "${x.pt}"</p>`, fig: cart(SIM.ruComLacuna(x), "frase da fonte"), txt: { v: sem(x.forma).toLowerCase(), teclado: "ru", rot: "conjunção" }, resp: x.forma, dicas: [R`<p>Procura-se: ${cj(x.w).pt}.</p>`], sol: R`<p>${ru(x.ru)}</p>` }; } }),
      ...[[13, 2, ["nom", "acc"]], [14, 5, ["gen", "dat", "ins", "prep"]]].map(([n, off, cs]) => F.exercicio({ n, nivel: "Máximo", gerar: (p) => { const s = SIM.pega(SUBST, p, off), ks = PAP.map((x, i) => i).filter((i) => cs.includes(PAP[i][0])), k = p ? ks[0] : F.escolha(ks), c = PAP[k][0];
        return { enun: R`<p>Escreva, em cirílico, a forma de ${ru("кото́рый")}: "${ru(DE[s].ac)} (${DE[s].pt}), ___ ..." no sentido de "${PAP[k][2]}".</p>`, fig: cart(DE[s].ac + ", ?", PAP[k][2]), txt: { v: SIM.ruAdjDic("который", c, { m: 0, n: 1, f: 2 }[DE[s].g], DE[s].an === "anim"), teclado: "ru", rot: "который" }, resp: kot(s, c), dicas: [R`<p>Gênero: ${DE[s].genPt.split(",")[0]}. Caso: ${NC[c]}.</p>`, R`<p>As terminações são as de um adjetivo como но́вый.</p>`], sol: R`<p><b>${kot(s, c)}</b>.</p>` }; } })),
    ];
    const chefao = F.chefao({ titulo: "Uma frase, seis ordens",
      enun: R`<p>A fonte mostra que ${ru("Я пошёл в магазин.")} ("Eu fui à loja") pode ser dita em seis ordens, todas corretas, entre elas ${ru("В магазин пошёл я.")} (a) O que permite essa liberdade, se em português "à loja foi eu" não funciona? (b) Qual pedaço da frase não se separa em nenhuma das seis ordens? (c) A fonte traduz ${ru("В магазин пошёл я.")} como "fui eu quem foi à loja": onde costuma ficar a ênfase principal, segundo ela? (d) Junte duas orações: "Sei que ele foi à loja" (use ${ru(RU.VERB["знать"].pres[0][0])} e ${ru("что")}; "ele foi": ${ru(RU.VERB["пойти"].pass[0][0])}). (e) Agora com causa: "Ele foi à loja porque..." Qual conjunção, e de que tipo ela é? (f) "A loja à qual ele foi": por que não basta saber ${ru("кото́рый")} no nominativo? Que forma seria com "na qual ele trabalha" (в + preposicional; "loja", ${ru("магазин")}, é masculino)?</p>`,
      fig: cart("Я пошёл в магазин.", "seis ordens possíveis"),
      dicas: [R`<p>(a) Pense no que marca sujeito e destino em russo: a posição, ou a forma das palavras?</p>`, R`<p>(f) Na tabela de который: masculino, preposicional.</p>`],
      sol: R`<p><b>(a)</b> As funções são marcadas pela flexão (casos e concordância do verbo), não pela posição; por isso, diz a fonte, todas as permutações são possíveis.</p>
        <p><b>(b)</b> ${ru("в магазин")}: a preposição e o substantivo ficam juntos em todas.</p>
        <p><b>(c)</b> No começo, com uma ênfase mais fraca no fim; a ordem serve para o destaque e para o grau de definição, não para a função.</p>
        <p><b>(d)</b> ${RU.VERB["знать"].pres[0][0]}, что он ${RU.VERB["пойти"].pass[0][0]} в магазин.</p>
        <p><b>(e)</b> ${cj("потому что").ac} (ou ${cj("так как").ac}): subordinação, causa.</p>
        <p><b>(f)</b> Porque o caso de который vem do papel dele na oração relativa. "Na qual ele trabalha": в <b>${SIM.ruAdjDic("который", "prep", 0, false)[0]}</b> (masculino, preposicional).</p>` });

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Gramática russa</div>
        <div class="q">${ru("они́ уе́хали, и мы уезжа́ем", 21)} · ${ru("они́ уже́ уе́хали, а мы ещё нет", 21)} · ${ru("они уе́хали, но ненадо́лго", 21)}. Três frases sobre as mesmas pessoas indo embora. O português usaria "e" na primeira e "mas" na terceira. E na segunda?</div>
        <p>O russo tem uma conjunção a mais do que o português para esse meio-termo: ${ru("а")}. Este tema fecha a gramática: as palavras que <b>ligam</b> orações. Primeiro as que coordenam (soma, oposição, alternativa), depois as que subordinam (que, porque, se, quando, embora), e por fim o pronome relativo ${ru("кото́рый")}, que junta tudo o que você aprendeu de gênero, número e caso.</p></div>
        ${F.chute({ q: "\"Э́то не я́блоко, ___ гру́ша.\" (Isto não é uma maçã, e sim uma pera.) Qual conjunção a fonte usa?", ops: ["и", "а", "или"], certa: 1, exp: "а: marca o contraste (\"não isto, e sim aquilo\"). и só somaria, e или daria alternativa." })}`),

      F.secao("laboratorio", "Laboratório: qual conjunção falta?", R`<p>Frases da fonte com a conjunção apagada e a tradução à vista.</p><div id="lab-falta"></div>`),

      F.secao("coordenacao", "Coordenar: и, а, но", R`
        <p>A fonte reconhece três tipos principais de coordenação:</p>
        ${F.fig(tabCoord, "Conjunções coordenativas deste tema, nos grupos de Russian grammar (Wikipedia). Sentidos: Wiktionary em inglês.")}
        <p>A distinção entre ${ru("и")} e ${ru("а")} é a que mais importa, diz a fonte: ${ru("и")} introduz algo que <b>completa</b> o que veio antes, sem se opor; ${ru("а")} introduz algo que <b>contrasta</b> com o que veio antes, mas com menos força do que ${ru("но")}. Os três exemplos dela:</p>
        <ul>${tres.map((x) => `<li>${ru(x.ru)} (${x.pt})</li>`).join("")}</ul>
        ${F.formula(R`\text{и: soma}\qquad\quad \text{а: contraste}\qquad\quad \text{но: oposição}`, "As três conjunções mais comuns")}
        ${F.caixa("pegadinha", R`<p>Traduzir ${ru("а")} sempre por "mas" ou sempre por "e" dá errado nos dois casos. Em ${ru(fr("а").ru)} ela vira "e" ("${fr("а").pt}"); em ${ru(fr("а", 1).ru)}, vira "e sim". O verbete resume: ela indica que a segunda parte se desvia, de algum modo, da primeira.</p>`)}
        <div id="lab-grupo"></div>`),

      F.secao("subordinacao", "Subordinar: que, porque, se, quando", R`
        ${F.fig(tabSub, "Palavras que introduzem orações subordinadas. Sentidos: Wiktionary em inglês; a coluna \"função\" é classificação do site.")}
        <p>Exemplos dos verbetes: ${ru(xChto.ru)} (${xChto.pt}) · ${ru(fr("когда").ru)} (${fr("когда").pt}) · ${ru(fr("где").ru)} (${fr("где").pt}) · ${ru(fr("хотя").ru)} (${fr("хотя").pt})</p>
        ${F.formula(R`\text{oração principal},\ \ \text{conjunção} + \text{oração subordinada}`, "Estrutura da subordinação")}
        ${F.demo("Regra 18: como ler um período com subordinada", R`<p><b>Afirmação.</b> Quatro passos desmontam qualquer período composto.</p>
          <p><b>Passo a passo.</b> (i) Ache a conjunção: em ${ru(fr("когда").ru)}, é ${ru("когда́")}. (ii) Corte ali: de um lado, ${ru("Я не зна́ю")} (não sei); do outro, ${ru("э́то бы́ло")} (isso foi). (iii) Cada lado tem o seu verbo e o seu sujeito, e cada palavra está no caso que o seu papel pede <b>dentro do seu lado</b>. (iv) A conjunção diz como os lados se ligam: tempo. "Não sei quando isso foi."</p>`)}
        ${F.caixa("olimpiada", R`<p>Num enunciado longo, as palavras deste tema são as placas do caminho: ${ru("е́сли")} abre a condição, ${ru("что́бы")} a finalidade, ${ru("кото́рый")} acrescenta um dado sobre o substantivo que acabou de aparecer, ${ru("так как")} e ${ru("потому́ что")} dão a causa. A técnica da Regra 18 (cortar na conjunção e ler cada lado sozinho) é o que permite ler uma frase de três linhas sem se perder. Aqui não há nenhuma questão real de prova.</p>`)}`),

      F.secao("kotoryj", "O relativo кото́рый", R`
        <p>${ru("кото́рый")} é o "que, o qual" das orações relativas, e funciona em dois passos: o <b>gênero e o número</b> ele copia do substantivo a que se refere; o <b>caso</b> vem do papel que ele tem dentro da sua própria oração. No exemplo do verbete, ${ru(xK.ru)} (${xK.pt}): ${ru("кни́гу")} está no acusativo (é o que eu quero), e ${ru(xK.forma)} é feminino singular como ela, mas no nominativo, porque é o sujeito de ${ru("лежи́т")}.</p>
        ${F.fig(tabKot, "Declinação de кото́рый. Tabela do Wiktionary em inglês; no acusativo masculino e plural, com antecedente animado, a forma é a do genitivo.")}
        ${F.caixa("fisico", R`<p>A tabela parece a de um adjetivo. Parece, ou é? O site aplicou a ${ru("кото́рый")} a regra dos adjetivos medida no tema dos adjetivos e comparou com a tabela do dicionário, forma por forma: bate em <b>${PK.ok} de ${PK.n}</b>. Não há nada novo a decorar: é um adjetivo de radical duro, como ${ru("но́вый")}.</p>`, "Pense como quem mede")}
        <div id="lab-kot"></div>
        ${F.caixa("ponte", R`<p>A fonte faz duas observações de sintaxe que valem para tudo o que vem depois. Primeira: a ordem básica é sujeito, verbo, objeto, mas, como a flexão marca as funções, todas as permutações são possíveis, e a ordem passa a servir para a ênfase (ela lista seis ordens de "eu fui à loja"). Segunda: o russo usa menos orações subordinadas do que o inglês, porque particípios e gerúndios fazem muitas vezes o papel de "que + verbo"; o exemplo dela é ${ru("Вот человек, потерявший надежду.")}, "Eis um homem que perdeu a esperança", sem nenhum "que". Os particípios ficaram fora deste curso de gramática.</p>`)}`),

      F.secao("escrever", "Escreva a conjunção", R`<p>Aparecem o sentido e o tipo; escreva a palavra russa.</p><div id="lab-escreve"></div>
        ${F.fig(mapaTema, "Mapa mental do tema.")}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) {
    let e = document.getElementById("lab-falta"); e.outerHTML = F.lab("Qual conjunção falta na frase?", "lab-falta"); SIM.ruQueConj(document.getElementById("lab-falta"), F);
    e = document.getElementById("lab-grupo"); e.outerHTML = F.lab("Coordena ou subordina? Classifique a conjunção", "lab-grupo"); SIM.ruGrupoConj(document.getElementById("lab-grupo"), F);
    e = document.getElementById("lab-kot"); e.outerHTML = F.lab("который: concorde com o antecedente, decline pelo papel", "lab-kot"); SIM.ruKotLab(document.getElementById("lab-kot"), F);
    e = document.getElementById("lab-escreve"); e.outerHTML = F.lab("Escreva a conjunção", "lab-escreve"); SIM.ruEscreveConj(document.getElementById("lab-escreve"), F);
  },
});
