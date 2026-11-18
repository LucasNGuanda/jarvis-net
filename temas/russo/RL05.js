/* Russo RL05 · Vocabulário de física em russo.
   Nada de memória. Os 64 termos, o gênero, o genitivo e o plural vêm dos verbetes do Wiktionary em inglês (SIM.RU.VOCF, GERADO de
   tools/russo/dadosRL.json). A tradução para o português é minha, presa a uma palavra em inglês de uma definição do verbete; só 8 das 64
   definições usadas têm rótulo de física no dicionário (as outras são o sentido geral da palavra), e a página diz isso termo a termo. A divisão em
   grupos é minha. Medida: regra do gênero do RG03 (decide em 47 de 55 e acerta os 47, na geração de 18/11/2026; a página calcula na hora).
   Página montada por SIM.ruPaginaVocab (assets/sims/russo/leitura.js), a mesma do RL04. */
F.registrar("russo/RL05", {
  retoma: ["RG03", "RL04"],
  html(F) {
    const R = String.raw, L = SIM.RU.VOCF, W = (w) => L.find((x) => x.w === w), ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`;
    return SIM.ruPaginaVocab(F, D, { lista: L, area: "física",
      pergunta: R`${ru(W("сила").ac, 22)}, ${ru(W("работа").ac, 22)}, ${ru(W("поле").ac, 22)}, ${ru(W("ток").ac, 22)}: força, trabalho, campo, corrente. Quatro palavras comuns do russo de todo dia, que a física tomou emprestadas, exatamente como fez em português.`,
      abertura: R`<p>O vocabulário de física é mais traiçoeiro que o de matemática por esse motivo: quase todo termo é uma palavra comum com um sentido a mais. Este tema reúne ${L.length} termos, das grandezas da mecânica aos objetos que aparecem em problema (o fio, a mola, o bloco), com sentido, gênero e genitivo. Para cada um, a página diz se o dicionário marca o sentido como de física ou se ele é o sentido geral da palavra.</p>`,
      chute: { q: "O verbete de «импульс» traz dois sentidos com o rótulo de física: \"quantidade de movimento\" e \"impulso (de uma força)\". O que isso exige de quem lê um enunciado?", ops: ["decidir pelo contexto qual das duas grandezas é", "traduzir sempre por \"impulso\"", "nada: são a mesma grandeza"], certa: 0, exp: "Decidir pelo contexto: a mesma palavra russa cobre as duas grandezas, que em português têm nomes diferentes." },
      demoTitulo: "Regra de leitura 5: do sentido comum ao sentido físico",
      demo: R`<p><b>Afirmação.</b> Num texto de física, o sentido técnico de uma palavra comum vence o sentido do dia a dia.</p><p><b>Passo a passo.</b> (i) ${ru(W("сила").ac)}: o verbete começa por "força física, vigor" e segue com "força"; em problema, é a grandeza. (ii) ${ru(W("напряжение").ac)}: "esforço"; com rótulo de física e engenharia, "tensão mecânica"; com rótulo de física, "voltagem". O resto do enunciado (um fio ou um circuito?) decide entre as duas. (iii) ${ru(W("сопротивление").ac)}: "resistência" em geral e, com o rótulo de física, a resistência elétrica. (iv) Depois do sentido, o de sempre: gênero e genitivo, para reconhecer a palavra declinada: ${ru(W("сила").ac)}, feminino, genitivo ${ru(W("сила").gen)}.</p>`,
      pegadinha: R`<p>${ru(W("вес").ac)} (peso) e ${ru(W("масса").ac)} (massa) são palavras diferentes, como em português, e ${ru(W("тяжесть").ac)} é uma terceira: "peso, carga" no sentido comum e, com o rótulo de física, "gravidade". Outra armadilha: ${ru(W("свет").ac)} é "luz", mas o mesmo verbete tem uma segunda entrada, com o sentido de "mundo". E ${ru(W("мощность").ac)} é a potência da mecânica, não a ${ru(SIM.RU.VOCM.find((x) => x.w === "степень").ac)} (potência de um número) do vocabulário de matemática.</p>`,
      olimpiada: R`<p>O grupo "problema" traz os objetos de sempre: ${["нить", "пружина", "шар", "груз", "брусок"].map((w) => ru(W(w).ac) + " (" + W(w).pt.split(",")[0] + ")").join(", ")}; e o grupo dos adjetivos, as condições: ${["наклонный", "горизонтальный", "вертикальный", "постоянный", "равномерный", "начальный"].map((w) => ru(W(w).ac) + " (" + W(w).pt + ")").join(", ")}. Um adjetivo desses na frente de uma grandeza muda o problema inteiro: velocidade inicial, força constante, movimento uniforme. Aqui não há nenhuma questão real de prova.</p>`,
      ponte: R`<p>Algumas palavras desta lista atravessam para a matemática com outro sentido, e o dicionário registra: ${ru(W("мощность").ac)} é também, com o rótulo de teoria dos conjuntos, a cardinalidade de um conjunto; ${ru(W("единица").ac)} é "unidade" de medida e, com o rótulo de matemática, o número um; ${ru(W("величина").ac)} é "tamanho" e, com os rótulos de física e de matemática, "grandeza".</p>`,
      chefao: ["скорость", "ускорение", "сила", "путь", "давление", "цепь", "ядро", "пружина"],
      chefaoF: R`O verbete de ${ru(W("напряжение").ac)} dá três sentidos úteis para a física. Quais são, e o que decide entre os dois últimos?`,
      chefaoFsol: R`"Esforço" (geral), "tensão mecânica" (rótulo de física e engenharia) e "voltagem" (rótulo de física). O contexto decide: se o enunciado fala de fio, mola ou barra, é tensão mecânica; se fala de circuito, corrente ou resistência, é voltagem.` });
  },
  montar(F) {
    const lista = SIM.RU.VOCF;
    let e = document.getElementById("lab-cartoes"); e.outerHTML = F.lab("Cartões: palavra, sentido, gênero", "lab-cartoes"); SIM.ruVocCartoes(document.getElementById("lab-cartoes"), F, { lista });
    e = document.getElementById("lab-pares"); e.outerHTML = F.lab("Jogo de pares: termo e tradução", "lab-pares"); SIM.ruVocPares(document.getElementById("lab-pares"), F, { lista });
    e = document.getElementById("lab-escreve"); e.outerHTML = F.lab("Escreva o termo em russo", "lab-escreve"); SIM.ruVocEscreve(document.getElementById("lab-escreve"), F, { lista });
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa mental do vocabulário, grupo por grupo", "lab-mapa"); SIM.ruVocMapaLab(document.getElementById("lab-mapa"), F, { lista });
  },
});
