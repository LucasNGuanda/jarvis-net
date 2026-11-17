/* Russo RG04 · Nominativo e acusativo.
   Nada de memória: todas as formas (seis casos, singular e plural) vêm das tabelas de declinação do Wiktionary em inglês; a conjugação dos verbos
   do mapa mental, das tabelas de conjugação do mesmo dicionário; as frases são exemplos de uso dos verbetes, com a tradução em inglês da fonte
   (a versão em português foi feita a partir dela); o papel de cada caso, a regra do animado e do inanimado e as preposições vêm da Wikipedia em
   inglês (Russian grammar, Russian declension, Accusative case, Nominative case, Animacy). Tudo em tools/russo/dadosR4.json → SIM.RU.DECL, VERB,
   PRON, FRASES (GERADO por tools/russo/gera-russo.py, que confere, em cada frase, se o sujeito marcado é mesmo um nominativo e o objeto um acusativo
   de palavra do banco). A regra do acusativo (SIM.ruAcusativoRegra) é MEDIDA contra as tabelas: o placar do texto é calculado na hora. */
F.registrar("russo/RG04", {
  retoma: ["RG03"],
  html(F) {
    const R = String.raw, RU = SIM.RU, DE = RU.DECL, PR = RU.PRON, FR = RU.FRASES, AC = "́", sem = (s) => String(s).split(AC).join("");
    const ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`, cap = (s) => s[0].toUpperCase() + s.slice(1);
    const cart = (w, sub = "", cor = "var(--ink)") => { const n = [...sem(w)].length, t = Math.min(50, Math.floor(820 / Math.max(n, 6))); return D.svg(560, 116, `<rect x="40" y="8" width="480" height="78" rx="12" style="fill:var(--card2);stroke:var(--line)"/><text x="280" y="${50 + t * 0.34}" text-anchor="middle" style="font:700 ${t}px Inter,system-ui,sans-serif;fill:${cor};letter-spacing:1px">${w}</text>` + (sub ? D.txt(280, 106, sub, "tx2", "middle") : ""), "figura"); };
    const NOME = SIM.ruNomeCaso, f1 = (w, c, n = 0) => DE[w].casos[c][n][0], reg = (w, n = 0) => SIM.ruAcusativoRegra(w, n), placar = SIM.ruPlacarCaso();
    const W = Object.keys(DE), sg = W.filter((w) => !DE[w].soPl && DE[w].casos.acc[0].length), pl = W.filter((w) => DE[w].casos.acc[1].length);
    const bate = (w, n) => SIM.ruBate(reg(w, n).formas, DE[w].casos.acc[n]);
    const femA = sg.filter((w) => /[ая]$/.test(w) && !w.endsWith("мя") && bate(w, 0)), mAn = sg.filter((w) => DE[w].g === "m" && DE[w].an === "anim" && !/[ая]$/.test(w) && bate(w, 0)), mIn = sg.filter((w) => DE[w].g === "m" && DE[w].an === "inan" && bate(w, 0)), neu = sg.filter((w) => DE[w].g === "n" && bate(w, 0)), femS = sg.filter((w) => DE[w].g === "f" && w.endsWith("ь"));
    const plAn = pl.filter((w) => DE[w].an === "anim" && bate(w, 1)), plIn = pl.filter((w) => DE[w].an === "inan" && bate(w, 1));
    const igualA = (w, n) => { const c = DE[w].casos, a = c.acc[n].map(sem), nn = c.nom[n].map(sem), g = c.gen[n].map(sem); return a.some((x) => nn.includes(x)) ? 0 : a.some((x) => g.includes(x)) ? 1 : 2; };
    const ALT_IG = ["Igual ao nominativo.", "Igual ao genitivo.", "Tem forma própria, diferente dos dois."];
    const outras = (w, n, certo) => { const c = DE[w].casos, o = []; ["nom", "gen", "dat", "ins", "prep"].forEach((k) => c[k][n].forEach((x) => o.push(sem(x)))); return [...new Set(o)].filter((x) => !certo.map(sem).includes(x)); };
    const tabela = (w) => D.svg(560, 190, SIM.dq.tab(60, 22, [150, 150, 150], [["caso", "singular", "plural"], ...SIM.ruCasos.map(([k, nome]) => [nome, DE[w].casos[k][0].join(" / ") || "—", DE[w].casos[k][1].join(" / ") || "—"])]), "figura");
    const frS = FR.filter((f) => f.suj), frO = FR.filter((f) => f.obj), pal = (f) => f.ru.split(" ").map((t) => t.replace(/[.,!?]/g, ""));
    /* mapa mental do tema: as formas dos exemplos saem da tabela do dicionário */
    const ex = (w, n = 0) => `${f1(w, "nom", n)} → ${f1(w, "acc", n)}`;
    const mapaTema = { centro: "acusativo", sub: "objeto direto", ramos: [
      { nome: "fem. em -а, -я", sub: "troca por -у, -ю", folhas: [{ rot: "", forma: ex("книга") }, { rot: "", forma: ex("неделя") }] },
      { nome: "masc. inanimado", sub: "igual ao nominativo", folhas: [{ rot: "", forma: ex("стол") }, { rot: "", forma: ex("музей") }] },
      { nome: "masc. animado", sub: "igual ao genitivo", folhas: [{ rot: "", forma: ex("брат") }, { rot: "", forma: ex("студент") }] },
      { nome: "neutro", sub: "igual ao nominativo", folhas: [{ rot: "", forma: ex("окно") }, { rot: "", forma: ex("море") }] },
      { nome: "fem. em -ь", sub: "igual ao nominativo", folhas: [{ rot: "", forma: ex("ночь") }, { rot: "", forma: ex("дверь") }] },
      { nome: "plural", sub: "copia nom. ou gen.", folhas: [{ rot: "", forma: ex("книга", 1) }, { rot: "", forma: ex("друг", 1) }] }] };
    const figMapa = SIM.ruMapaSvg(mapaTema, Array(12).fill(true)).svg;

    const exemplos = F.exemplo({
      titulo: "Do dicionário à frase",
      casos: [
        { nome: "Fácil: feminino em -а ou -я", gerar: (p) => { const w = p ? "книга" : F.escolha(femA), d = DE[w];
          return { enun: R`<p>Ponha ${ru(d.ac)} (${d.pt}) no acusativo singular, como objeto direto de uma frase.</p>`, fig: cart(d.ac + " → ?", "nominativo → acusativo"),
            passos: [R`<p>(i) Gênero e terminação: ${d.genPt}; termina em ${ru(w.slice(-1))}.</p>`, R`<p>(ii) Regra: ${reg(w).motivo}.</p>`, R`<p>(iii) Resultado: <b>${f1(w, "acc")}</b>. É a única família de substantivos com forma própria de acusativo no singular.</p>`], resp: f1(w, "acc") }; } },
        { nome: "Médio: masculino, animado ou não?", gerar: (p) => { const w = p ? "брат" : F.escolha(mAn.concat(mIn)), d = DE[w], an = d.an === "anim";
          return { enun: R`<p>Qual é o acusativo singular de ${ru(d.ac)} (${d.pt})?</p>`, fig: cart(d.ac + " → ?", "masculino: depende de ser animado"),
            passos: [R`<p>(i) É masculino terminado em consoante, -й ou -ь. Pergunta decisiva: nomeia pessoa ou animal? ${an ? "Sim: é <b>animado</b>." : "Não: é <b>inanimado</b>."}</p>`, R`<p>(ii) Regra: ${reg(w).motivo}.</p>`, R`<p>(iii) ${an ? `Genitivo singular na tabela: ${f1(w, "gen")}. Logo, acusativo: <b>${f1(w, "acc")}</b>.` : `O acusativo repete o nominativo: <b>${f1(w, "acc")}</b>.`}</p>`], resp: f1(w, "acc") }; } },
        { nome: "Difícil: quem faz o quê na frase", gerar: (p) => { const f = p ? frO.find((x) => x.obj === "матема́тику") : F.escolha(frO.filter((x) => x.suj));
          return { enun: R`<p>Na frase abaixo, ache o sujeito e o objeto direto, e traduza.</p>`, fig: cart(f.ru, "frase de exemplo do dicionário"),
            passos: [R`<p>(i) Procure uma forma de nominativo: <b>${f.suj}</b>. É o sujeito, quem faz a ação.</p>`, R`<p>(ii) Procure uma forma de acusativo: <b>${f.obj}</b>. É o objeto direto, quem recebe a ação.</p>`, R`<p>(iii) A ordem das palavras não foi usada em nenhum dos dois passos: só a forma.</p>`, R`<p>(iv) Tradução: <b>${f.pt}</b></p>`], resp: f.pt }; } },
      ],
    });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", gerar: (p) => { const f = SIM.pega(frS.filter((x) => pal(x).length >= 2), p, 2), ps = [...new Set(pal(f))], alts = ps.map((t) => t + ".");
        return { enun: R`<p>Qual palavra é o <b>sujeito</b> da frase abaixo?</p>`, fig: cart(f.ru, "quem faz a ação?"), alts, certa: "ABCDEFG"[ps.indexOf(f.suj)], resp: f.suj, dicas: [R`<p>O sujeito está no nominativo, a forma do dicionário.</p>`], sol: R`<p>Sujeito: <b>${f.suj}</b>. A frase quer dizer: ${f.pt}</p>` }; } }),
      F.exercicio({ n: 2, nivel: "Físico", gerar: (p) => { const f = SIM.pega(frO, p, 2), ps = [...new Set(pal(f))], alts = ps.map((t) => t + ".");
        return { enun: R`<p>Qual palavra está no <b>acusativo</b> (objeto direto) na frase abaixo?</p>`, fig: cart(f.ru, "quem recebe a ação?"), alts, certa: "ABCDEFG"[ps.indexOf(f.obj)], resp: f.obj, dicas: [R`<p>Elimine o sujeito e o verbo; veja o que sobra e em que forma está.</p>`], sol: R`<p>Objeto direto: <b>${f.obj}</b>. A frase quer dizer: ${f.pt}</p>` }; } }),
      F.exercicio({ n: 3, nivel: "Físico", gerar: (p) => { const w = SIM.pega(femA, p, 4), d = DE[w], certo = d.casos.acc[0], a5 = SIM.alt5(sem(certo[0]) + ".", outras(w, 0, certo).map((x) => x + "."), p);
        return { enun: R`<p>Qual é o acusativo singular de ${ru(d.ac)} (${d.pt})? As alternativas são formas de verdade dessa palavra, sem acento.</p>`, fig: cart(d.ac + " → ?", "feminino em -" + w.slice(-1)), ...a5, resp: certo[0], dicas: [R`<p>-а vira -у; -я vira -ю.</p>`], sol: R`<p>${ru(d.ac)} → <b>${certo.join(" ou ")}</b>.</p>` }; } }),
      F.exercicio({ n: 4, nivel: "Físico", gerar: (p) => { const w = SIM.pega(mAn.concat(mIn, neu), p, 0), d = DE[w], k = igualA(w, 0);
        return { enun: R`<p>O acusativo singular de ${ru(d.ac)} (${d.pt}, ${d.genPt}) é igual a que outro caso?</p>`, fig: cart(d.ac, "acusativo singular = ?"), alts: ALT_IG, certa: "ABC"[k], resp: ALT_IG[k], dicas: [R`<p>Masculino animado copia o genitivo; masculino inanimado e neutro copiam o nominativo.</p>`], sol: R`<p>${cap(reg(w).motivo)}. Na tabela: nominativo ${f1(w, "nom")}, genitivo ${f1(w, "gen")}, acusativo <b>${f1(w, "acc")}</b>.</p>` }; } }),
      F.exercicio({ n: 5, nivel: "Físico", gerar: (p) => { const w = SIM.pega(plAn.concat(plIn), p, 1), d = DE[w], k = igualA(w, 1);
        return { enun: R`<p>O acusativo <b>plural</b> de ${ru(d.ac)} (${d.pt}, ${d.genPt}) é igual a que outro caso do plural?</p>`, fig: cart(f1(w, "nom", 1), "nominativo plural"), alts: ALT_IG, certa: "ABC"[k], resp: ALT_IG[k], dicas: [R`<p>No plural, o gênero não importa: só se a palavra é animada ou inanimada.</p>`], sol: R`<p>${cap(reg(w, 1).motivo)}. Na tabela: nominativo plural ${f1(w, "nom", 1)}, genitivo plural ${f1(w, "gen", 1)}, acusativo plural <b>${f1(w, "acc", 1)}</b>.</p>` }; } }),
      F.exercicio({ n: 6, nivel: "Físico", gerar: (p) => { const k = SIM.pega(["я", "ты", "он", "она", "мы", "вы", "они"], p, 3), certo = PR[k].casos.acc[0], a5 = SIM.alt5(certo + ".", ["я", "ты", "он", "она", "мы", "вы", "они"].filter((x) => x !== k).map((x) => PR[x].casos.acc[0] + "."), p);
        return { enun: R`<p>Qual é o acusativo do pronome ${ru(k)} (${PR[k].pt})?</p>`, fig: cart(k + " → ?", "pronome pessoal"), ...a5, resp: certo, dicas: [R`<p>Lembre das frases: "eu a vejo" é ${ru("Я ви́жу её.")}</p>`], sol: R`<p>${ru(k)} → <b>${PR[k].casos.acc.join(" ou ")}</b>${PR[k].casos.acc.length > 1 ? " (a forma com н- é a usada depois de preposição)" : ""}.</p>` }; } }),
      F.exercicio({ n: 7, nivel: "Físico", gerar: (p) => { const k = p ? 0 : F.escolha([0, 1]);
        return { enun: R`<p>Qual é a função principal do <b>${k ? "acusativo" : "nominativo"}</b>?</p>`, fig: cart(k ? "вини́тельный" : "имени́тельный", "nome do caso em russo"), alts: ["Marcar o sujeito da frase; é também a forma do dicionário.", "Marcar o objeto direto.", "Indicar posse.", "Marcar o objeto indireto.", "Indicar o instrumento da ação."], certa: k ? "B" : "A", resp: k ? "objeto direto" : "sujeito", dicas: [R`<p>Um é o caso de quem faz; o outro, de quem recebe a ação.</p>`], sol: k ? R`<p>O acusativo marca o <b>objeto direto</b>; aparece também com algumas preposições e em expressões de tempo.</p>` : R`<p>O nominativo marca o <b>sujeito</b> e é a forma que aparece em dicionários e placas.</p>` }; } }),
      F.exercicio({ n: 8, nivel: "Máximo", gerar: (p) => { const base = sg.filter((w) => igualA(w, 0) === 2), w = SIM.pega(base, p, 9), d = DE[w];
        return { enun: R`<p>A forma abaixo é de ${ru(d.ac)} (${d.pt}). Em que caso ela está?</p>`, fig: cart(f1(w, "acc"), "forma tirada de uma frase"), alts: SIM.ruCasos.map(([k, nome]) => cap(nome) + "."), certa: "ABCDEF"[SIM.ruCasos.findIndex(([k]) => k === "acc")], resp: "acusativo", dicas: [R`<p>A terminação -у ou -ю num feminino em -а ou -я é marca de um caso só.</p>`], sol: R`<p>${f1(w, "acc")} é o <b>acusativo</b> singular de ${ru(d.ac)}.</p>` }; } }),
      F.exercicio({ n: 9, nivel: "Máximo", gerar: (p) => { const k = p ? 0 : F.escolha([0, 1]);
        return { enun: k ? R`<p>Além do objeto direto, em que outra situação as preposições ${ru("в")} e ${ru("на")} pedem o acusativo?</p>` : R`<p>Em russo, o que decide quem é o sujeito e quem é o objeto direto de uma frase?</p>`, fig: cart(k ? "в · на" : "?", k ? "duas preposições" : "sujeito e objeto"), alts: ["A forma (o caso) de cada palavra.", "Quando indicam o destino de um movimento.", "A ordem das palavras, sempre sujeito, verbo, objeto.", "Quando indicam posse.", "A entonação, só."], certa: k ? "B" : "A", resp: k ? "destino de movimento" : "a forma das palavras", dicas: [R`<p>${k ? "Pense em \"para dentro de\" e \"para cima de\"." : "Compare duas frases dos laboratórios em que o objeto vem antes do verbo."}</p>`], sol: k ? R`<p>Com ${ru("в")} e ${ru("на")}, o acusativo indica <b>para onde</b> se vai (destino do movimento).</p>` : R`<p>A <b>forma</b>: nominativo para o sujeito, acusativo para o objeto. Em ${ru("Я её хорошо́ зна́ю.")} o objeto vem antes do verbo e a frase continua clara.</p>` }; } }),
      F.exercicio({ n: 10, nivel: "Máximo", gerar: (p) => { let q = p ? ["стол", "брат", "книга", "окно", "ночь"] : []; while (q.length < 5) { const w = F.escolha(sg); if (!q.includes(w)) q.push(w); } const v = q.filter((w) => igualA(w, 0) === 0).length;
        return { enun: R`<p>Em quantas das cinco palavras abaixo o acusativo singular é <b>igual ao nominativo</b>?</p>`, fig: cart(q.join("  ·  "), "cinco substantivos"), num: { v, tol: 0.001, un: "", abs: 0.001 }, py: `${v}`, resp: String(v), dicas: [R`<p>Mudam: femininos em -а e -я (e masculinos de mesma terminação) e masculinos animados.</p>`], sol: R`<p>${q.map((w) => `${w} → ${f1(w, "acc")}`).join("; ")}. Iguais ao nominativo: <b>${v}</b>.</p>` }; } }),
      F.exercicio({ n: 11, nivel: "Físico", gerar: (p) => { const f = SIM.pega(FR, p, 5), a5 = SIM.alt5(f.pt, FR.filter((x) => x !== f).map((x) => x.pt), p);
        return { enun: R`<p>O que quer dizer a frase abaixo?</p>`, fig: cart(f.ru, "frase de exemplo do dicionário"), ...a5, resp: f.pt, dicas: [R`<p>Ache primeiro o sujeito (nominativo); depois o verbo; depois o resto.</p>`], sol: R`<p>${ru(f.ru)} = <b>${f.pt}</b></p>` }; } }),
      F.exercicio({ n: 12, nivel: "Físico", gerar: (p) => { const k = p ? "кто" : F.escolha(["кто", "что"]), certo = sem(PR[k].casos.acc[0]), a5 = SIM.alt5(certo + ".", [...new Set(["кто", "что"].flatMap((x) => ["nom", "gen", "dat", "ins", "prep"].map((c) => sem(PR[x].casos[c][0]))))].filter((x) => x !== certo).map((x) => x + "."), p);
        return { enun: R`<p>Qual é o acusativo do pronome interrogativo ${ru(k)} (${PR[k].pt})?</p>`, fig: cart(k + " → ?", "pergunta pelo objeto direto"), ...a5, resp: certo, dicas: [R`<p>${ru("кто")} pergunta por pessoa (animado); ${ru("что")}, por coisa (inanimado). Vale a mesma lógica dos substantivos.</p>`], sol: R`<p>${ru(k)} → <b>${PR[k].casos.acc[0]}</b> (${k === "кто" ? "igual ao genitivo, como os animados" : "igual ao nominativo, como os inanimados"}).</p>` }; } }),
      F.exercicio({ n: 13, nivel: "Físico", gerar: (p) => { const w = SIM.pega(femA, p, 10), d = DE[w];
        return { enun: R`<p>Escreva, em cirílico, o acusativo singular de ${ru(d.ac)} (${d.pt}).</p>`, fig: cart(d.ac + " → ?", "nominativo → acusativo"), txt: { v: d.casos.acc[0], teclado: "ru", rot: "acusativo" }, resp: f1(w, "acc"), dicas: [R`<p>-а vira -у; -я vira -ю.</p>`], sol: R`<p>${ru(d.ac)} → <b>${d.casos.acc[0].join(" ou ")}</b>.</p>` }; } }),
      F.exercicio({ n: 14, nivel: "Máximo", gerar: (p) => { const w = SIM.pega(mAn, p, 2), d = DE[w];
        return { enun: R`<p>Escreva, em cirílico, o acusativo singular de ${ru(d.ac)} (${d.pt}, masculino animado). O genitivo singular dessa palavra é ${ru(f1(w, "gen"))}.</p>`, fig: cart(d.ac + " → ?", "masculino animado"), txt: { v: d.casos.acc[0], teclado: "ru", rot: "acusativo" }, resp: f1(w, "acc"), dicas: [R`<p>Masculino animado: o acusativo copia o genitivo.</p>`], sol: R`<p>${ru(d.ac)} → <b>${d.casos.acc[0].join(" ou ")}</b>.</p>` }; } }),
      F.exercicio({ n: 15, nivel: "Máximo", gerar: (p) => { const w = SIM.pega(plIn, p, 6), d = DE[w];
        return { enun: R`<p>Escreva, em cirílico, o acusativo <b>plural</b> de ${ru(d.ac)} (${d.pt}, ${d.genPt}). O nominativo plural é ${ru(f1(w, "nom", 1))}.</p>`, fig: cart(f1(w, "nom", 1) + " → ?", "plural: animado ou inanimado?"), txt: { v: d.casos.acc[1], teclado: "ru", rot: "acusativo plural" }, resp: f1(w, "acc", 1), dicas: [R`<p>Inanimado no plural: o acusativo é igual ao nominativo.</p>`], sol: R`<p>Acusativo plural: <b>${d.casos.acc[1].join(" ou ")}</b>.</p>` }; } }),
      F.exercicio({ n: 16, nivel: "Máximo", gerar: (p) => { const w = SIM.pega(femA, p, 16), d = DE[w];
        return { enun: R`<p>Num texto aparece a forma abaixo, no acusativo. Escreva a forma do dicionário (nominativo singular) para poder procurar a palavra.</p>`, fig: cart(f1(w, "acc"), "acusativo → nominativo"), txt: { v: w, teclado: "ru", rot: "nominativo" }, resp: w, dicas: [R`<p>Desfaça a troca: -у volta para -а; -ю volta para -я.</p>`], sol: R`<p>${f1(w, "acc")} é o acusativo de <b>${ru(d.ac)}</b> (${d.pt}).</p>` }; } }),
    ];

    const fa = frO.find((x) => x.obj === "кни́гу"), fb = frO.find((x) => x.obj === "друзе́й"), fc = frO.find((x) => x.obj === "мя́со");
    const chefao = F.chefao({
      titulo: "Três frases e uma tabela",
      enun: R`<p>Frases de exemplo do dicionário: (1) ${ru(fa.ru)} (2) ${ru(fb.ru)} (3) ${ru(fc.ru)} (a) Em cada uma, ache o sujeito e o objeto direto. (b) Dê o nominativo singular de cada objeto direto. (c) Explique, para cada objeto, por que o acusativo tem a forma que tem (terminação própria, igual ao nominativo ou igual ao genitivo). (d) Traduza as três frases. (e) Reescreva a ideia da frase (3) trocando "carne" por "livro" e depois por "irmão": que forma teria cada objeto? (Só a forma do substantivo; não precisa escrever a frase.) (f) O laboratório mede a regra do acusativo contra as tabelas. Explique por que essa regra acerta quase tudo, enquanto a do plural do tema anterior errava em uma a cada quatro palavras. (g) Monte de cabeça o mapa mental de ${ru("кни́га")}: os seis casos no singular. Depois confira no laboratório do mapa.</p>`,
      fig: cart("N → A", "nominativo e acusativo"),
      dicas: [R`<p>(a) O sujeito das três é um pronome no nominativo.</p>`, R`<p>(c) Pergunte, na ordem: é plural? É animado? É feminino em -а ou -я?</p>`, R`<p>(f) Veja de onde a regra tira as formas difíceis.</p>`],
      sol: R`<p><b>(a)</b> ${[fa, fb, fc].map((f, i) => `(${i + 1}) sujeito ${f.suj}, objeto ${f.obj}`).join("; ")}.</p>
        <p><b>(b)</b> ${ru("кни́га")}, ${ru("друг")} (no plural, ${f1("друг", "nom", 1)}), ${ru("мя́со")}.</p>
        <p><b>(c)</b> ${f1("книга", "acc")}: ${reg("книга").motivo}. ${f1("друг", "acc", 1)}: ${reg("друг", 1).motivo}. ${f1("мясо", "acc")}: ${reg("мясо").motivo}.</p>
        <p><b>(d)</b> (1) ${fa.pt} (2) ${fb.pt} (3) ${fc.pt}</p>
        <p><b>(e)</b> Livro: ${f1("книга", "acc")}. Irmão: ${f1("брат", "acc")} (masculino animado, igual ao genitivo).</p>
        <p><b>(f)</b> Porque ela quase não inventa forma nenhuma: fora os femininos em -а e -я, manda copiar o nominativo ou o genitivo, que vêm da própria tabela da palavra, com as irregularidades já dentro. Medido agora: ${placar.ok} de ${placar.n}.</p>
        <p><b>(g)</b> ${SIM.ruCasos.map(([k, nome]) => `${nome}: ${DE["книга"].casos[k][0].join(" ou ")}`).join("; ")}.</p>`,
    });

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Gramática russa</div>
        <div class="q">${ru("Я её хорошо́ зна́ю.", 22)} Palavra por palavra: "eu ela bem conheço". Em português essa ordem seria um tropeço; em russo a frase é comum e não tem ambiguidade nenhuma. O que avisa ao leitor que "ela" é quem é conhecida, e não quem conhece?</div>
        <p>A <b>forma</b> da palavra. ${ru("она́")} é "ela" como sujeito; ${ru("её")} é "ela" como objeto. Essas formas se chamam <b>casos</b>, e o russo tem seis. Este tema trata dos dois primeiros: o <b>nominativo</b> (o sujeito, e a forma do dicionário) e o <b>acusativo</b> (o objeto direto). A frase acima quer dizer: ${FR.find((f) => f.ru === "Я её хорошо́ зна́ю.").pt}</p></div>
        ${F.chute({ q: "книга (livro) é a forma do dicionário. Na frase \"ele deu um livro a ela\", o livro é objeto direto. Que forma você espera?", ops: ["книга, sem mudar", "книгу", "книги", "книге"], certa: 1, exp: "книгу: feminino em -а troca o -а por -у no acusativo. A frase do dicionário é " + fa.ru })}`),

      F.secao("laboratorio", "Laboratório: quem faz e quem recebe?", R`<p>Frases de verdade, tiradas dos exemplos do dicionário. Clique no sujeito ou no objeto direto, conforme o laboratório pedir.</p><div id="lab-quem"></div>`),

      F.secao("casos", "Seis casos; hoje, dois", R`
        <p>Um substantivo russo muda de terminação conforme o papel que faz na frase. São seis casos, cada um no singular e no plural. A tabela inteira de ${ru("кни́га")}, como está no dicionário:</p>
        ${F.fig(tabela("книга"), "Declinação de кни́га (livro). Tabela do Wiktionary em inglês.")}
        ${F.formula(R`\text{nominativo} = \text{sujeito (e forma do dicionário)}\qquad\qquad \text{acusativo} = \text{objeto direto}`, "Os dois casos deste tema")}
        <p><b>Nominativo.</b> É o caso do sujeito, e também o caso "padrão" fora de frases: verbetes de dicionário, placas. Em frases do tipo "X é Y", sujeito e predicado ficam os dois no nominativo: ${ru("Я ру́сский.")} (${FR.find((f) => f.ru === "Я ру́сский.").pt}); ${ru("Кто э́то?")} (${FR.find((f) => f.ru === "Кто э́то?").pt})</p>
        <p><b>Acusativo.</b> É o caso do objeto direto. Aparece também em algumas expressões de tempo e com preposições: ${ru("в")} e ${ru("на")} pedem o acusativo quando indicam o <b>destino</b> de um movimento.</p>
        ${F.caixa("pegadinha", R`<p>Não leia frase russa pela ordem das palavras. ${ru("Она́ их ви́дит.")} (${FR.find((f) => f.ru === "Она́ их ви́дит.").pt}) tem o objeto no meio; ${ru("Что она́ говори́т?")} (${FR.find((f) => f.ru === "Что она́ говори́т?").pt}) começa pelo objeto. Ache o nominativo e o acusativo, e a frase se monta sozinha.</p>`)}`),

      F.secao("acusativo", "Como se forma o acusativo", R`
        <p>A boa notícia: o acusativo quase não tem terminações próprias. Na maior parte das palavras ele <b>copia</b> outro caso.</p>
        ${F.fig(figMapa, "Mapa mental do acusativo. Todas as formas dos exemplos vêm das tabelas do Wiktionary em inglês.")}
        ${F.formula(R`\text{fem. em -а, -я:}\ \ \text{-у, -ю}\qquad \text{inanimado:}\ \ = \text{nominativo}\qquad \text{animado (masc. no singular; todos no plural):}\ \ = \text{genitivo}`, "Acusativo dos substantivos")}
        ${F.demo("Regra 4: quatro perguntas, na ordem", R`<p><b>Afirmação.</b> Para pôr um substantivo no acusativo, bastam quatro perguntas.</p>
          <p><b>Passo a passo.</b> (i) Está no <b>plural</b>? Então só importa se é animado (copia o genitivo plural: ${ex("друг", 1)}) ou inanimado (copia o nominativo plural: ${ex("книга", 1)}). (ii) No singular: termina em <b>-а ou -я</b>? Troque por -у ou -ю: ${ex("книга")}, ${ex("неделя")}; vale também para masculinos como ${ex("папа")}. (iii) É <b>masculino animado</b>? Copie o genitivo: ${ex("брат")}, ${ex("студент")}. (iv) Em todos os outros casos (masculino inanimado, neutro, feminino em -ь), copie o nominativo: ${ex("стол")}, ${ex("окно")}, ${ex("ночь")}.</p>`)}
        <p><b>Pronomes.</b> Também mudam: ${["я", "ты", "он", "она", "мы", "вы", "они"].map((k) => `${ru(k)} → ${ru(PR[k].casos.acc[0])}`).join(", ")}. Nos de terceira pessoa existe uma segunda forma com ${ru("н")}- na frente (${PR["он"].casos.acc[1]}, ${PR["она"].casos.acc[1]}, ${PR["они"].casos.acc[1]}), usada depois de preposição. Os interrogativos seguem a lógica do animado e do inanimado: ${ru("кто")} → ${ru(PR["кто"].casos.acc[0])} (como o genitivo), ${ru("что")} → ${ru(PR["что"].casos.acc[0])} (como o nominativo).</p>
        ${F.caixa("fisico", R`<p>A regra das quatro perguntas, medida agora contra as tabelas do dicionário: acerta <b>${placar.ok} de ${placar.n}</b> acusativos, somando singular e plural${placar.erradas.length ? " (fora da regra: " + placar.erradas.join(", ") + ")" : ""}. Repare por que ela é tão boa: ela não fabrica quase nada. Manda copiar o nominativo ou o genitivo da própria palavra, e as irregularidades (${ex("друг", 1)}) já vêm prontas de lá. O preço é que você precisa do genitivo, que é o assunto do próximo tema.</p>`, "Pense como quem mede")}`),

      F.secao("laboratorio2", "Laboratório: a regra do acusativo contra o dicionário", R`<p>Singular e plural, animados e inanimados, misturados. Responda de cabeça e compare.</p><div id="lab-acusativo"></div>`),

      F.secao("mapa", "Mapa mental: uma palavra em todas as formas", R`
        <p>Escolha uma palavra e veja tudo o que ela vira. Para um <b>substantivo</b>, os seis casos no singular e no plural. Para um <b>verbo</b>, o infinitivo, as seis pessoas, o passado e o imperativo. Os casos e tempos que ainda não foram estudados já aparecem no mapa: é a visão do terreno inteiro. Use "esconder e lembrar" para treinar os ramos que você já conhece.</p><div id="lab-mapa"></div>
        ${F.caixa("ponte", R`<p>A tabela de seis casos por dois números é o que a gramática chama de <b>paradigma</b> da palavra. A fonte registra que as descrições do russo contam seis casos principais e que alguns manuais identificam até mais dez, de uso restrito; duas dessas formas extras aparecem em algumas tabelas do dicionário (locativo, partitivo). O verbo tem o seu próprio paradigma, e é por isso que o mapa de um verbo tem outros ramos.</p>`)}`),

      F.secao("treino", "Treino: escreva no acusativo", R`<p>A palavra aparece no nominativo, singular ou plural; escreva o acusativo. Vale o que está na tabela do dicionário.</p><div id="lab-escreve"></div>
        ${F.caixa("olimpiada", R`<p>Quando a grandeza de um enunciado é o objeto direto do verbo, ela vem no acusativo. Se for um feminino em -а ou -я, aparece com -у ou -ю, e o dicionário só tem a forma em -а ou -я: ${ex("масса")}, ${ex("сила")}, ${ex("энергия")}. O exercício 16 treina esse caminho de volta.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) {
    let e = document.getElementById("lab-quem"); e.outerHTML = F.lab("Quem faz e quem recebe? Clique na palavra", "lab-quem"); SIM.ruQuemFaz(document.getElementById("lab-quem"), F);
    e = document.getElementById("lab-acusativo"); e.outerHTML = F.lab("A regra do acusativo contra o dicionário", "lab-acusativo"); SIM.ruAcusativoLab(document.getElementById("lab-acusativo"), F);
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa mental: uma palavra em todas as formas", "lab-mapa"); SIM.ruMapa(document.getElementById("lab-mapa"), F, { inicio: "работать", palavras: ["работать", "читать", "знать", "видеть", "любить", "решать", "решить", "говорить", "делать", "понимать", "писать", "думать", "жить", "хотеть", "идти", "дать", "книга", "стол", "брат", "окно", "ночь", "друг", "город", "задача", "неделя", "студент", "мать", "время", "человек", "ребёнок"] });
    e = document.getElementById("lab-escreve"); e.outerHTML = F.lab("Escreva a palavra no caso pedido", "lab-escreve"); SIM.ruEscreveCaso(document.getElementById("lab-escreve"), F, { casos: ["acc"] });
  },
});
