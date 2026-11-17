/* Russo RG03 · Substantivos: gênero e número.
   Nada de memória: gênero, animado ou inanimado, plural, acento e pronúncia de cada palavra vêm dos verbetes do Wiktionary em inglês; as regras
   (terminação e gênero, nominativo plural, regra de ortografia, plurais irregulares, palavras só no plural, indeclináveis) vêm da Wikipedia em inglês
   (Russian declension, Russian grammar, Russian orthography, Russian spelling rules, Plurale tantum, Animacy). Tudo em tools/russo/dadosR3.json
   e, daqui, em SIM.RU.NOM (GERADO por tools/russo/gera-russo.py, que confere os plurais irregulares da Wikipedia contra o Wiktionary).
   As duas regras programadas (SIM.ruGeneroRegra e SIM.ruPluralRegra, em assets/sims/russo/nomes.js) são MEDIDAS contra o dicionário: os placares
   do texto e dos laboratórios são calculados na hora por SIM.ruPlacarNomes(); nenhum número de acerto está escrito à mão. */
F.registrar("russo/RG03", {
  retoma: ["RG01", "RG02"],
  html(F) {
    const R = String.raw, RU = SIM.RU, N = RU.NOM, AC = "́", sem = (s) => String(s).split(AC).join("");
    const ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`, cap = (s) => s[0].toUpperCase() + s.slice(1);
    const G = { m: "masculino", f: "feminino", n: "neutro" }, ALT_G = ["Masculino.", "Feminino.", "Neutro."], iG = { m: 0, f: 1, n: 2 };
    const cart = (w, sub = "", cor = "var(--ink)") => { const n = [...sem(w)].length, t = Math.min(54, Math.floor(820 / Math.max(n, 6))); return D.svg(560, 116, `<rect x="60" y="8" width="440" height="78" rx="12" style="fill:var(--card2);stroke:var(--line)"/><text x="280" y="${50 + t * 0.34}" text-anchor="middle" style="font:700 ${t}px Inter,system-ui,sans-serif;fill:${cor};letter-spacing:1px">${w}</text>` + (sub ? D.txt(280, 106, sub, "tx2", "middle") : ""), "figura"); };
    const X = (w) => N.find((x) => x.w === w), regra = (x) => SIM.ruGeneroRegra(x.w), plR = (x) => SIM.ruPluralRegra(x.w, x.gs[0]);
    const us = N.filter((x) => !x.indecl && !x.soPl), um = us.filter((x) => x.gs.length === 1);
    const gOk = um.filter((x) => regra(x).g === x.gs[0]), gExc = us.filter((x) => regra(x).g && !x.gs.includes(regra(x).g)), gSem = us.filter((x) => regra(x).g === null);
    const comPl = us.filter((x) => x.pl.length), plOk = comPl.filter((x) => x.pl.map(sem).includes(plR(x))), plIrr = comPl.filter((x) => !x.pl.map(sem).includes(plR(x)));
    const placar = SIM.ruPlacarNomes();
    const CHIA = "жчшщ", fimChia = us.filter((x) => CHIA.includes(sem(x.w).slice(-1)) || (sem(x.w).endsWith("ь") && CHIA.includes(sem(x.w).slice(-2, -1))));
    const SETE = "гкхжчшщ", comSete = plOk.filter((x) => { const p = sem(x.w), b = "ая".includes(p.slice(-1)) ? p.slice(-2, -1) : p.slice(-1); return SETE.includes(b); });
    const emA = plIrr.filter((x) => x.gs[0] === "m" && /[ая]$/.test(sem(x.pl[0])) && !/ья$/.test(sem(x.pl[0]))), emYa = plIrr.filter((x) => /ья$/.test(sem(x.pl[0])));
    const ton = (ac) => SIM.ruVogais(ac).findIndex((v) => v.ton), mudaAc = comPl.filter((x) => SIM.ruVogais(x.ac).length === SIM.ruVogais(x.pl[0]).length && ton(x.ac) !== ton(x.pl[0]));
    const soPl = N.filter((x) => x.soPl && x.w !== "люди" && x.w !== "дети"), indecl = N.filter((x) => x.indecl);
    const lista = (xs, f) => xs.map(f).join(", ");
    const erradas = (x) => { const p = sem(x.w), c = [plR(x), p + "ы", p + "и", p + "а", p.slice(0, -1) + "ы", p.slice(0, -1) + "и", p.slice(0, -1) + "а", p.slice(0, -1) + "я", p + "ья"].filter((s) => s && !x.pl.map(sem).includes(s) && s !== p); return [...new Set(c)]; };
    const TAB = [["termina em", "gênero", "exemplo"], ["consoante", "masculino", "стол"], ["-й", "masculino", "музей"], ["-а, -я", "feminino", "книга, неделя"], ["-о, -е", "neutro", "окно, море"], ["-мя", "neutro", "имя"], ["-ь", "masc. ou fem.", "день, ночь"]];
    const figGen = D.svg(560, 176, SIM.dq.tab(60, 22, [150, 150, 150], TAB), "figura");
    const TABP = [["singular", "plural", "exemplo"], ["masc. em consoante", "+ ы", "стол → столы"], ["masc. em -й ou -ь", "→ и", "музей → музеи"], ["fem. em -а", "→ ы", "школа → школы"], ["fem. em -я ou -ь", "→ и", "неделя → недели"], ["neutro em -о", "→ а", "слово → слова"], ["neutro em -е", "→ я", "море → моря"]];
    const figPl = D.svg(560, 176, SIM.dq.tab(40, 22, [180, 90, 210], TABP), "figura");

    const exemplos = F.exemplo({
      titulo: "Do singular ao plural",
      casos: [
        { nome: "Fácil: gênero pela última letra", gerar: (p) => { const x = p ? X("окно") : F.escolha(gOk), rg = regra(x);
          return { enun: R`<p>De que gênero é a palavra abaixo (${x.pt})?</p>`, fig: cart(x.ac, "olhe a terminação"),
            passos: [R`<p>(i) Última letra: ${ru(sem(x.w).slice(-1))}.</p>`, R`<p>(ii) Regra: ${rg.motivo}.</p>`, R`<p>(iii) Conferindo no dicionário: <b>${G[x.gs[0]]}</b> (o verbete traz "${x.gen}").</p>`], resp: G[x.gs[0]] }; } },
        { nome: "Médio: plural regular", gerar: (p) => { const x = p ? X("книга") : F.escolha(plOk), b = sem(x.w), sete = comSete.includes(x);
          return { enun: R`<p>Forme o nominativo plural de ${ru(x.ac)} (${x.pt}, ${G[x.gs[0]]}).</p>`, fig: cart(x.ac + " → ?", "singular → plural"),
            passos: [R`<p>(i) Gênero e terminação: ${G[x.gs[0]]}, termina em ${ru(b.slice(-1))}.</p>`, R`<p>(ii) Pela tabela, o plural sai em ${ru(plR(x).slice(-1))}${sete ? R`. Atenção: a regra pediria ${ru("ы")}, mas depois de ${ru(SETE.split("").join(", "))} escreve-se ${ru("и")}` : ""}.</p>`, R`<p>(iii) Resultado: <b>${plR(x)}</b>. No dicionário, com o acento: ${x.pl.join(" ou ")}.</p>`], resp: x.pl[0] }; } },
        { nome: "Difícil: plural que foge da regra", gerar: (p) => { const x = p ? X("друг") : F.escolha(plIrr.filter((y) => y.w !== "пальто"));
          return { enun: R`<p>Qual é o plural de ${ru(x.ac)} (${x.pt})? A regra geral funciona aqui?</p>`, fig: cart(x.ac + " → ?", "cuidado: é das irregulares"),
            passos: [R`<p>(i) Pela regra geral sairia "${plR(x)}".</p>`, R`<p>(ii) O dicionário dá outra coisa: <b>${x.pl.join(" ou ")}</b>${x.plRaro.length ? R` (e registra ${x.plRaro.join(", ")} só como forma arcaica ou fora do padrão)` : ""}.</p>`, R`<p>(iii) Tipo de irregularidade: ${emYa.includes(x) ? "plural em -ья" : emA.includes(x) ? "masculino com plural em -а ou -я tônico" : ["человек", "ребёнок"].includes(x.w) ? "o plural vem de outra raiz" : "radical que muda no plural"}. Esse plural se aprende junto com a palavra.</p>`], resp: x.pl[0] }; } },
      ],
    });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", gerar: (p) => { const x = SIM.pega(gOk, p, 3);
        return { enun: R`<p>De que gênero é a palavra abaixo (${x.pt})?</p>`, fig: cart(x.ac, "olhe a última letra"), alts: ALT_G, certa: "ABC"[iG[x.gs[0]]], resp: G[x.gs[0]], dicas: [R`<p>Consoante ou -й: masculino. -а ou -я: feminino. -о ou -е: neutro.</p>`], sol: R`<p>${ru(x.ac)}: ${regra(x).motivo}. <b>${cap(G[x.gs[0]])}</b>.</p>` }; } }),
      F.exercicio({ n: 2, nivel: "Físico", gerar: (p) => { const g = p ? "f" : F.escolha(["m", "f", "n"]), x = SIM.pega(gOk.filter((y) => y.gs[0] === g), p, 5), a5 = SIM.alt5(x.w + ".", gOk.filter((y) => y.gs[0] !== g).map((y) => y.w + "."), p);
        return { enun: R`<p>Qual destas palavras é do gênero <b>${G[g]}</b>?</p>`, fig: cart("?", "uma só é do gênero " + G[g]), ...a5, resp: x.w, dicas: [R`<p>Olhe só a última letra de cada alternativa.</p>`], sol: R`<p><b>${ru(x.ac)}</b> (${x.pt}): ${regra(x).motivo}.</p>` }; } }),
      F.exercicio({ n: 3, nivel: "Físico", gerar: (p) => { const x = SIM.pega(gExc, p, 0), a5 = SIM.alt5(x.w + ".", gOk.filter((y) => y.gs[0] === "f" && /[ая]$/.test(y.w)).map((y) => y.w + "."), p);
        return { enun: R`<p>Todas as palavras abaixo terminam em -а ou -я, mas uma delas é <b>masculina</b>. Qual?</p>`, fig: cart("-а / -я", "terminação de feminino"), ...a5, resp: x.w, dicas: [R`<p>O gênero gramatical acompanha o sexo quando a palavra nomeia um homem.</p>`], sol: R`<p><b>${ru(x.ac)}</b> (${x.pt}) é masculino, apesar da terminação: o verbete traz "${x.gen}".</p>` }; } }),
      F.exercicio({ n: 4, nivel: "Físico", gerar: (p) => { const x = SIM.pega(fimChia, p, 1), comSinal = sem(x.w).endsWith("ь");
        return { enun: R`<p>A palavra abaixo (${x.pt}) termina em chiante${comSinal ? " seguida de ь" : ", sem ь"}. De que gênero ela é?</p>`, fig: cart(x.ac, comSinal ? "chiante + ь" : "chiante, sem ь"), alts: ALT_G, certa: "ABC"[iG[x.gs[0]]], resp: G[x.gs[0]], dicas: [R`<p>Depois de ж, ч, ш, щ, o ь final não muda o som: ele marca o gênero.</p>`], sol: R`<p>Depois de chiante, o nominativo singular leva ${ru("ь")} se a palavra é feminina e não leva se é masculina. ${ru(x.ac)}: <b>${G[x.gs[0]]}</b>.</p>` }; } }),
      F.exercicio({ n: 5, nivel: "Físico", gerar: (p) => { const x = SIM.pega(plOk, p, 7), a5 = SIM.alt5(plR(x) + ".", erradas(x).map((s) => s + "."), p);
        return { enun: R`<p>Qual é o nominativo plural de ${ru(x.ac)} (${x.pt}, ${G[x.gs[0]]})? As alternativas estão sem acento.</p>`, fig: cart(x.ac + " → ?", "singular → plural"), ...a5, resp: x.pl[0], dicas: [R`<p>Primeiro o gênero e a terminação; depois a linha certa da tabela do plural.</p>`, R`<p>Depois de г, к, х, ж, ч, ш, щ escreve-se и, nunca ы.</p>`], sol: R`<p>${ru(x.ac)} → <b>${x.pl.join(" ou ")}</b>.</p>` }; } }),
      F.exercicio({ n: 6, nivel: "Físico", gerar: (p) => { const x = SIM.pega(comSete, p, 2);
        return { enun: R`<p>Com que letra termina o plural de ${ru(x.ac)} (${x.pt})?</p>`, fig: cart(x.ac + " → ?", "olhe a consoante do fim do radical"), alts: ["ы.", "и.", "а.", "я."], certa: "B", resp: "и", dicas: [R`<p>A tabela pede ${ru("ы")} para essa terminação. Mas qual é a consoante que vem antes?</p>`], sol: R`<p>Depois de ${ru(SETE.split("").join(", "))} não se escreve ${ru("ы")}: escreve-se <b>и</b>. ${ru(x.ac)} → ${x.pl[0]}.</p>` }; } }),
      F.exercicio({ n: 7, nivel: "Físico", gerar: (p) => { const x = SIM.pega(soPl, p, 0), a5 = SIM.alt5(x.w + ".", gOk.filter((y) => y.gs[0] !== "n").map((y) => y.w + "."), p);
        return { enun: R`<p>Qual destas palavras só existe no plural?</p>`, fig: cart("?", "palavra sem singular"), ...a5, resp: x.w, dicas: [R`<p>Procure a alternativa que já tem cara de plural: termina em ы ou и.</p>`], sol: R`<p><b>${ru(x.ac)}</b> (${x.pt}): o verbete marca "plural only".</p>` }; } }),
      F.exercicio({ n: 8, nivel: "Máximo", gerar: (p) => { const x = SIM.pega(plIrr.filter((y) => y.w !== "пальто"), p, 3), certo = sem(x.pl[0]), a5 = SIM.alt5(certo + ".", erradas(x).map((s) => s + "."), p);
        return { enun: R`<p>Qual é o plural de ${ru(x.ac)} (${x.pt})? Atenção: é um plural irregular. As alternativas estão sem acento.</p>`, fig: cart(x.ac + " → ?", "plural irregular"), ...a5, resp: x.pl[0], dicas: [R`<p>A forma que a regra geral daria, "${plR(x)}", não é a usada.</p>`], sol: R`<p>${ru(x.ac)} → <b>${x.pl.join(" ou ")}</b>.</p>` }; } }),
      F.exercicio({ n: 9, nivel: "Máximo", gerar: (p) => { const base = comPl.filter((y) => SIM.ruVogais(y.ac).length === SIM.ruVogais(y.pl[0]).length && SIM.ruVogais(y.ac).length >= 2), x = p ? X("окно") : F.escolha(base), a = ton(x.ac), b = ton(x.pl[0]), k = b > a ? 0 : b < a ? 1 : 2;
        return { enun: R`<p>Compare o singular e o plural abaixo (${x.pt}), com o acento marcado. O que acontece com o acento?</p>`, fig: cart(x.ac + " → " + x.pl[0], "singular → plural"), alts: ["Vai para uma sílaba mais perto do fim.", "Vai para uma sílaba mais perto do começo.", "Fica na mesma sílaba."], certa: "ABC"[k], resp: ["avança", "recua", "não muda"][k], dicas: [R`<p>Conte as vogais até a tônica em cada forma (o ё é sempre tônico).</p>`], sol: R`<p>Singular: tônica na ${a + 1}ª sílaba. Plural: na ${b + 1}ª. ${k === 2 ? "O acento não muda." : "O acento muda de lugar, e a regra do plural não avisa: vem do dicionário."}</p>` }; } }),
      F.exercicio({ n: 10, nivel: "Máximo", gerar: (p) => { const x = SIM.pega(indecl, p, 1), a5 = SIM.alt5(x.w + ".", gOk.filter((y) => y.gs[0] === "n").map((y) => y.w + "."), p);
        return { enun: R`<p>Qual destas palavras é <b>indeclinável</b>, isto é, não muda nem no plural nem nos casos?</p>`, fig: cart("?", "palavra que nunca muda"), ...a5, resp: x.w, dicas: [R`<p>São empréstimos de outras línguas, com terminação que não se encaixa nos modelos russos.</p>`], sol: R`<p><b>${ru(x.ac)}</b> (${x.pt}): o verbete marca "indeclinable". Gênero: ${x.gs.map((g) => G[g]).join(" ou ")}.</p>` }; } }),
      F.exercicio({ n: 11, nivel: "Máximo", gerar: (p) => { const x = SIM.pega(gSem.filter((y) => y.gs.length === 1), p, 2);
        return { enun: R`<p>A palavra abaixo (${x.pt}) termina em -ь depois de consoante que não é chiante. A terminação não decide: de memória, de que gênero ela é?</p>`, fig: cart(x.ac, "termina em -ь"), alts: ["Masculino.", "Feminino."], certa: "AB"[iG[x.gs[0]]], resp: G[x.gs[0]], dicas: [R`<p>Não há regra aqui. Se ainda não sabe, abra a resolução e guarde a palavra com o gênero.</p>`], sol: R`<p>${ru(x.ac)}: <b>${G[x.gs[0]]}</b> (o verbete traz "${x.gen}").</p>` }; } }),
      F.exercicio({ n: 12, nivel: "Físico", gerar: (p) => { const base = N.filter((y) => y.an && !/ or /.test(y.gen)), x = SIM.pega(base, p, 4);
        return { enun: R`<p>Para a gramática russa, a palavra abaixo (${x.pt}) é animada ou inanimada?</p>`, fig: cart(x.ac, "animado ou inanimado?"), alts: ["Animada.", "Inanimada."], certa: x.an === "anim" ? "A" : "B", resp: x.an === "anim" ? "animada" : "inanimada", dicas: [R`<p>Animados: pessoas e animais. Inanimados: objetos, plantas, estados, ideias.</p>`], sol: R`<p>${ru(x.ac)}: <b>${x.an === "anim" ? "animada" : "inanimada"}</b> (o verbete traz "${x.gen}"). Essa distinção vai decidir a forma do acusativo.</p>` }; } }),
      F.exercicio({ n: 13, nivel: "Máximo", gerar: (p) => { const g = p ? "f" : F.escolha(["m", "f", "n"]); let q = p ? ["книга", "стол", "окно", "ночь", "папа"].map(X) : []; while (q.length < 5) { const y = F.escolha(um); if (!q.includes(y)) q.push(y); } const v = q.filter((y) => y.gs[0] === g).length;
        return { enun: R`<p>Quantas das cinco palavras abaixo são do gênero <b>${G[g]}</b>?</p>`, fig: cart(q.map((y) => y.w).join("  ·  "), "cinco substantivos"), num: { v, tol: 0.001, un: "", abs: 0.001 }, py: `${v}`, resp: String(v), dicas: [R`<p>Use a terminação, mas desconfie das palavras em -ь e das que nomeiam homens.</p>`], sol: R`<p>${q.map((y) => `${y.w}: ${G[y.gs[0]]}`).join("; ")}. Total de ${G[g]}s: <b>${v}</b>.</p>` }; } }),
      F.exercicio({ n: 14, nivel: "Físico", gerar: (p) => { const x = SIM.pega(plOk, p, 12);
        return { enun: R`<p>Escreva, em cirílico, o nominativo plural de ${ru(x.ac)} (${x.pt}, ${G[x.gs[0]]}). O acento não precisa ser digitado.</p>`, fig: cart(x.ac + " → ?", "escreva o plural"), txt: { v: x.pl, teclado: "ru", rot: "plural" }, resp: x.pl[0], dicas: [R`<p>É um plural regular: basta a tabela (e a regra do и depois de г, к, х, ж, ч, ш, щ).</p>`], sol: R`<p>${ru(x.ac)} → <b>${x.pl.join(" ou ")}</b>.</p>` }; } }),
      F.exercicio({ n: 15, nivel: "Máximo", gerar: (p) => { const x = SIM.pega(plIrr.filter((y) => y.w !== "пальто"), p, 0);
        return { enun: R`<p>Escreva, em cirílico, o plural de ${ru(x.ac)} (${x.pt}). É um plural irregular; o acento não precisa ser digitado, mas o ё precisa.</p>`, fig: cart(x.ac + " → ?", "plural irregular"), txt: { v: x.pl, teclado: "ru", rot: "plural" }, resp: x.pl[0], dicas: [R`<p>A forma regular seria "${plR(x)}", e não é ela.</p>`, R`<p>O plural tem ${[...sem(x.pl[0])].length} letras e termina em ${ru(sem(x.pl[0]).slice(-1))}.</p>`], sol: R`<p>${ru(x.ac)} → <b>${x.pl.join(" ou ")}</b>.</p>` }; } }),
      F.exercicio({ n: 16, nivel: "Máximo", gerar: (p) => { const x = SIM.pega(plOk.filter((y) => y.pl.length === 1), p, 20);
        return { enun: R`<p>A palavra abaixo está no plural (${x.pt}, ${G[x.gs[0]]}). Escreva o singular dela, em cirílico.</p>`, fig: cart(x.pl[0], "plural → singular"), txt: { v: x.w, teclado: "ru", rot: "singular" }, resp: x.w, dicas: [R`<p>Desfaça a tabela: veja com que letra o plural termina e qual é o gênero.</p>`], sol: R`<p>${x.pl[0]} é o plural de <b>${ru(x.ac)}</b>.</p>` }; } }),
    ];

    const CH_G = ["стол", "неделя", "море", "папа", "ночь", "врач", "имя", "кофе"].map(X), CH_P = ["школа", "задача", "музей", "друг", "город", "ребёнок"].map(X);
    const chefao = F.chefao({
      titulo: "A lista de chamada",
      enun: R`<p>(a) Dê o gênero de cada palavra e diga se a terminação decide, engana ou não ajuda: ${lista(CH_G, (x) => ru(x.w))}. (b) Forme o nominativo plural de ${lista(CH_P, (x) => ru(x.w))} e separe os regulares dos irregulares. (c) ${ru("врач")} e ${ru("ночь")} terminam no mesmo som. Por que uma leva ${ru("ь")} e a outra não? (d) Por que o plural de ${ru("книга")} é ${ru("книги")} e não termina em ${ru("ы")}, como o de ${ru("школа")}? (e) ${ru("часы")} (relógio) tem singular? Como você diria que isso aparece no dicionário? (f) O laboratório mede a regra do plural contra o dicionário. Olhando as palavras em que ela erra, proponha <b>duas</b> famílias de exceções que valeria a pena decorar em bloco. (g) A regra do plural acerta as letras de muitas palavras em que o acento muda de lugar. Dê dois exemplos e explique por que isso é um problema para quem fala, mas não para quem lê.</p>`,
      fig: cart("стол · книга · окно", "um masculino, um feminino, um neutro"),
      dicas: [R`<p>(a) Quatro dessas oito palavras são casos especiais: um masculino com cara de feminino, duas em chiante, um empréstimo.</p>`, R`<p>(f) Procure, entre os erros da regra, masculinos cujo plural termina em -а tônico e palavras cujo plural termina em -ья.</p>`],
      sol: R`<p><b>(a)</b> ${CH_G.map((x) => { const r = regra(x); return `${ru(x.w)}: ${x.gs.map((g) => G[g]).join(" ou ")} (${x.indecl ? "empréstimo indeclinável: a terminação não ajuda" : r.g === null ? "a terminação não ajuda" : x.gs.includes(r.g) ? "a terminação decide" : "a terminação engana"})`; }).join("; ")}.</p>
        <p><b>(b)</b> ${CH_P.map((x) => `${ru(x.w)} → ${x.pl.join(" ou ")} (${plOk.includes(x) ? "regular" : "irregular"})`).join("; ")}.</p>
        <p><b>(c)</b> Depois de chiante, o ${ru("ь")} final não muda o som: ele marca o gênero. Feminino leva (${ru("ночь")}), masculino não (${ru("врач")}).</p>
        <p><b>(d)</b> Regra de ortografia: depois de ${ru(SETE.split("").join(", "))} não se escreve ${ru("ы")}; escreve-se ${ru("и")}. O radical de ${ru("книга")} termina em ${ru("г")}.</p>
        <p><b>(e)</b> Não: é palavra só de plural. No verbete aparece a marca "plural only" e o gênero vem com "pl" (${X("часы").gen}).</p>
        <p><b>(f)</b> Masculinos com plural em -а ou -я tônico: ${lista(emA, (x) => `${x.w} → ${x.pl[0]}`)}. Plural em -ья: ${lista(emYa, (x) => `${x.w} → ${x.pl[0]}`)}.</p>
        <p><b>(g)</b> Por exemplo: ${mudaAc.filter((x) => plOk.includes(x)).slice(0, 2).map((x) => `${x.ac} → ${x.pl[0]}`).join("; ")}. Quem lê um texto sem acento vê as letras certas e reconhece a palavra; quem fala precisa pôr a tônica no lugar certo, e com ela muda o som das vogais átonas ${F.ret("russo/RG02")}.</p>`,
    });

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Gramática russa</div>
        <div class="q">${ru("стол", 22)} é masculino, ${ru("книга", 22)} é feminino e ${ru("окно", 22)} é neutro. Um russo não precisou decorar isso palavra por palavra: a informação está escrita na própria palavra. Onde?</div>
        <p>Na <b>última letra</b>. Mesa termina em consoante, livro em ${ru("а")}, janela em ${ru("о")}. O gênero importa porque outras palavras da frase vão ter de concordar com ele. Mas a regra tem furos: ${ru("па́па")} termina em ${ru("а")} e é masculino. Este tema ensina a regra, mede quanto ela acerta e mostra o que sobra para a memória. Depois faz o mesmo com o plural.</p></div>
        ${F.chute({ q: "sem consultar nada: de que gênero é окно́ (janela)?", ops: ["masculino", "feminino", "neutro"], certa: 2, exp: "Neutro: termina em -о. Em russo, palavras em -о e -е são neutras; em -а e -я, quase sempre femininas; em consoante, masculinas." })}`),

      F.secao("laboratorio", "Laboratório: de que gênero é?", R`<p>Decida pela terminação e clique. O laboratório diz o que o dicionário traz e o que a regra da terminação previa.</p><div id="lab-genero"></div>`),

      F.secao("genero", "Três gêneros, lidos na última letra", R`
        <p>Os substantivos russos têm três gêneros: masculino, feminino e neutro. Na maior parte das vezes, a terminação do nominativo singular (a forma do dicionário) entrega qual é:</p>
        ${F.fig(figGen, "Terminação e gênero. Resumo das páginas \"Russian declension\" e \"Russian grammar\" (Wikipedia em inglês); exemplos com gênero conferido no Wiktionary.")}
        ${F.formula(R`\text{consoante, -й} \Rightarrow \text{masculino}\qquad \text{-а, -я} \Rightarrow \text{feminino}\qquad \text{-о, -е} \Rightarrow \text{neutro}`, "Gênero pela terminação")}
        <p><b>Masculinos em -а e -я.</b> Algumas palavras que nomeiam homens têm terminação de feminino e continuam masculinas: ${lista(gExc, (x) => `${ru(x.ac)} (${x.pt})`)}.</p>
        <p><b>Palavras em -ь.</b> Podem ser masculinas ou femininas, e a terminação sozinha não decide: ${lista(gSem, (x) => `${ru(x.ac)} (${x.pt}, ${x.gs.map((g) => G[g]).join(" ou ")})`)}. Há um caso em que o ${ru("ь")} ajuda: depois de chiante (${ru("ж, ч, ш, щ")}), o nominativo singular leva ${ru("ь")} se a palavra é feminina e não leva se é masculina. Compare ${lista(fimChia.filter((x) => sem(x.w).endsWith("ь")), (x) => ru(x.ac))} (femininas) com ${lista(fimChia.filter((x) => !sem(x.w).endsWith("ь")), (x) => ru(x.ac))} (masculinas).</p>
        <p><b>Neutros em -мя.</b> Um grupo pequeno e irregular: ${ru("и́мя")} (${X("имя").pt}), ${ru("вре́мя")} (${X("время").pt}).</p>
        <p><b>Empréstimos indeclináveis.</b> Palavras estrangeiras que não se encaixam em nenhum modelo não mudam nunca: ${lista(indecl, (x) => `${ru(x.ac)} (${x.pt}, ${x.gs.map((g) => G[g]).join(" ou ")})`)}. O ${ru("ко́фе")} é o caso famoso: a fonte o dá como masculino na língua literária e neutro na fala coloquial.</p>
        ${F.caixa("fisico", R`<p>Quanto vale a regra da terminação? Medido agora, nas palavras deste tema: ela dá palpite em ${placar.genero.n} e acerta <b>${placar.genero.ok}</b>; erra em ${placar.genero.erradas.length} (${placar.genero.erradas.join(", ")}) e fica sem palpite em ${placar.genero.semRegra.length}, todas em -ь. Conclusão prática: decore o gênero só das palavras em -ь e dos masculinos em -а e -я; o resto, leia na última letra.</p>`, "Pense como quem mede")}
        ${F.caixa("pegadinha", R`<p><b>Animado e inanimado.</b> Além do gênero, a gramática russa separa os substantivos em animados (pessoas e animais) e inanimados (objetos, plantas, estados, ideias). Hoje isso parece detalhe; no tema do acusativo, é o que decide a terminação. O dicionário já traz a informação: ${ru("брат")} é "${X("брат").gen}", ${ru("стол")} é "${X("стол").gen}".</p>`)}`),

      F.secao("plural", "O nominativo plural", R`
        <p>O plural se forma trocando (ou acrescentando) a terminação:</p>
        ${F.fig(figPl, "Nominativo plural regular. Resumo das tabelas de \"Russian declension\" (Wikipedia em inglês); exemplos conferidos no Wiktionary.")}
        ${F.formula(R`\text{masc. e fem.:}\ \ \text{ы ou и}\qquad\qquad \text{neutro:}\ \ \text{а ou я}\qquad\qquad \text{depois de г, к, х, ж, ч, ш, щ:}\ \ \text{sempre и, nunca ы}`, "Terminações do nominativo plural")}
        ${F.demo("Regra 3: por que книги, e não com ы", R`<p><b>Afirmação.</b> O feminino em ${ru("а")} faz o plural em ${ru("ы")}, mas ${ru("кни́га")} faz ${ru("кни́ги")}.</p>
          <p><b>Passo a passo.</b> (i) Tire a terminação: sobra o radical, que acaba em ${ru("г")}. (ii) A tabela manda pôr ${ru("ы")}. (iii) A regra de ortografia ${F.ret("russo/RG02")} proíbe ${ru("ы")} depois de ${ru(SETE.split("").join(", "))}: escreve-se ${ru("и")}. (iv) Resultado: ${X("книга").pl[0]}. O mesmo acontece em ${comSete.filter((x) => x.w !== "книга").slice(0, 5).map((x) => `${ru(x.ac)} → ${x.pl[0]}`).join(", ")}.</p>`)}
        <p><b>O acento pode mudar.</b> A regra dá as letras do plural, não a sílaba tônica: ${mudaAc.filter((x) => plOk.includes(x)).slice(0, 6).map((x) => `${ru(x.ac)} → ${ru(x.pl[0])}`).join(", ")}. Aprenda o plural já com o acento.</p>`),

      F.secao("laboratorio2", "Laboratório: a regra do plural contra o dicionário", R`<p>Forme o plural de cabeça e compare. O placar mostra, sem enfeite, em quantas palavras a regra acerta.</p><div id="lab-plural"></div>`),

      F.secao("irregulares", "Plurais que fogem da regra", R`
        <p>Nas palavras deste tema, a regra acerta as letras de <b>${placar.plural.ok} de ${placar.plural.n}</b> plurais (medido agora). As que escapam não são um amontoado: formam famílias.</p>
        <ul><li><b>Masculinos com plural em -а ou -я tônico:</b> ${lista(emA, (x) => `${ru(x.ac)} → ${ru(x.pl[0])}`)}.</li>
        <li><b>Plural em -ья:</b> ${lista(emYa, (x) => `${ru(x.ac)} → ${ru(x.pl[0])}`)}.</li>
        <li><b>Plural de outra raiz:</b> ${["человек", "ребёнок"].map(X).map((x) => `${ru(x.ac)} (${x.pt}) → ${ru(x.pl[0])}`).join(", ")}.</li>
        <li><b>Radical que cresce ou muda:</b> ${["мать", "дочь", "имя", "время", "сестра", "жена", "отец", "день"].map(X).filter((x) => x && x.pl.length).map((x) => `${ru(x.ac)} → ${ru(x.pl[0])}`).join(", ")}.</li></ul>
        <p><b>Só no plural.</b> Algumas palavras não têm singular: ${lista(soPl, (x) => `${ru(x.ac)} (${x.pt})`)}. A fonte fala em cerca de 600 palavras assim em russo. No sentido contrário, há palavras que quase não se usam no plural: para ${ru("молоко́")} o dicionário avisa que as formas de plural são conjecturais ou não usadas.</p>
        ${F.caixa("pegadinha", R`<p>${ru("дома́")} (casas) e ${ru("до́ма")} (em casa; ou "da casa") têm as mesmas letras: só o acento separa o plural das outras formas. É mais um motivo para aprender cada plural irregular em voz alta, com a tônica.</p>`)}
        ${F.caixa("olimpiada", R`<p>Num texto em russo, o substantivo quase nunca aparece na forma do dicionário. Para procurar uma palavra, você precisa voltar do plural ao singular: tirar ${ru("ы")} ou ${ru("и")} e testar consoante, ${ru("а")}, ${ru("я")} ou ${ru("ь")}; tirar ${ru("а")} ou ${ru("я")} e testar ${ru("о")}, ${ru("е")} ou um masculino irregular. O exercício 16 treina exatamente esse caminho de volta.</p>`)}
        ${F.caixa("ponte", R`<p>A gramática organiza tudo isso em três <b>declinações</b>: a primeira reúne os femininos em -а e -я (e os masculinos de mesma forma, como ${ru("па́па")}); a segunda, a maioria dos masculinos e neutros; a terceira, os femininos em -ь. Cada declinação tem as suas terminações para os seis casos, e o nominativo plural que você viu aqui é só a primeira linha dessa tabela. Os casos começam no próximo tema.</p>`)}`),

      F.secao("treino", "Treino: escreva o plural", R`<p>Agora sem alternativas: a palavra aparece no singular e você escreve o plural, regular ou não. Use o teclado russo ou o da tela.</p><div id="lab-escreve"></div>`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) {
    let e = document.getElementById("lab-genero"); e.outerHTML = F.lab("De que gênero é? Decida pela terminação", "lab-genero"); SIM.ruGeneroQuiz(document.getElementById("lab-genero"), F);
    e = document.getElementById("lab-plural"); e.outerHTML = F.lab("A regra do plural contra o dicionário", "lab-plural"); SIM.ruPluralLab(document.getElementById("lab-plural"), F);
    e = document.getElementById("lab-escreve"); e.outerHTML = F.lab("Escreva o plural", "lab-escreve"); SIM.ruEscrevePlural(document.getElementById("lab-escreve"), F);
  },
});
