/* Russo RG14 · Verbos de movimento.
   Nada de memória. Pares "uma direção / várias direções": SIM.RU.MOV (GERADO: a nota de uso do Wiktionary de cada verbo tem de dizer a direção e
   apontar para o outro, e o par tem de estar na tabela da Wikipedia). Usos de cada tipo, o perfectivo com по-, "ir × levar", a formação dos verbos
   com prefixo e a tabela de prefixos: seção "Verbs of motion" de "Russian grammar" (Wikipedia em inglês), de onde vêm também as frases (SIM.RU.FRM,
   SIM.RU.PREF), que a fonte escreve SEM acento. Formas: tabelas do Wiktionary (SIM.RU.VERB). Os nomes "uma direção" e "várias direções" traduzem
   unidirectional e multidirectional. Este tema não tem regra medida: qual verbo usar depende do sentido da frase, não de terminação. */
F.registrar("russo/RG14", {
  retoma: ["RG13"],
  html(F) {
    const R = String.raw, RU = SIM.RU, V = RU.VERB, MOV = RU.MOV, PREF = RU.PREF, FRM = RU.FRM, AC = "́", sem = (s) => String(s).split(AC).join(""), PE = SIM.ruPess, ND = SIM.ruNomeDir;
    const ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`, cap = (s) => s[0].toUpperCase() + s.slice(1);
    const cart = (w, sub = "", cor = "var(--ink)") => { const n = [...sem(w)].length, t = Math.min(48, Math.floor(820 / Math.max(n, 6))); return D.svg(560, 116, `<rect x="30" y="8" width="500" height="78" rx="12" style="fill:var(--card2);stroke:var(--line)"/><text x="280" y="${50 + t * 0.34}" text-anchor="middle" style="font:700 ${t}px Inter,system-ui,sans-serif;fill:${cor};letter-spacing:.5px">${w}</text>` + (sub ? D.txt(280, 106, sub, "tx2", "middle") : ""), "figura"); };
    const f = (w, k, i) => V[w][k][i][0], unis = MOV.map((m) => m.uni), multis = MOV.map((m) => m.multi), base = unis.concat(multis), dir = (w) => SIM.ruDirDe(w), parDe = (w) => { const m = MOV.find((x) => x.uni === w || x.multi === w); return m.uni === w ? m.multi : m.uni; };
    const parP = PREF.flatMap((p) => p.pares.filter((q) => q[1])), comPref = [...new Set(PREF.flatMap((p) => p.pares.flat().filter(Boolean)))];
    const tabPares = D.svg(560, 40 + 22 * (MOV.length + 1), SIM.dq.tab(20, 22, [170, 175, 175], [["sentido", "uma direção", "várias direções"], ...MOV.map((m) => [V[m.uni].pt, V[m.uni].ac, V[m.multi].ac])]), "figura");
    const tabPref = D.svg(560, 40 + 22 * (PREF.length + 1), SIM.dq.tab(10, 22, [60, 270, 210], [["prefixo", "o que acrescenta", "exemplo"], ...PREF.map((p) => [p.pre, p.pt, p.pares[0].filter(Boolean).join(" / ")])]), "figura");
    const M0 = MOV[0], mapaPar = SIM.ruMapaSvg(SIM.ruMapaMov(M0), Array(20).fill(true)).svg;
    const mapaTema = SIM.ruMapaSvg({ centro: "movimento", sub: "o sentido escolhe o verbo", ramos: [
      { nome: "uma direção", sub: "em curso, para lá", folhas: [{ rot: "", forma: unis.slice(0, 2).join(", ") }, { rot: "", forma: unis.slice(2, 4).join(", ") }] },
      { nome: "várias direções", sub: "hábito, ida e volta", folhas: [{ rot: "", forma: multis.slice(0, 2).join(", ") }, { rot: "", forma: multis.slice(2, 4).join(", ") }] },
      { nome: "perfectivo по-", sub: "partiu, pôs-se a caminho", folhas: [{ rot: "", forma: MOV.filter((m) => m.pf).map((m) => m.pf).join(", ") }] },
      { nome: "levar", sub: "a pé, conduzindo, de veículo", folhas: [{ rot: "", forma: "нести / носить" }, { rot: "", forma: "вести / водить" }, { rot: "", forma: "везти / возить" }] },
      { nome: "при- e у-", sub: "chegar e ir embora", folhas: [{ rot: "", forma: "прийти / приходить" }, { rot: "", forma: "уйти / уходить" }] },
      { nome: "в- e вы-", sub: "entrar e sair", folhas: [{ rot: "", forma: "войти / входить" }, { rot: "", forma: "выйти / выходить" }] }] }, Array(20).fill(true)).svg;
    const ALT_D = ["De uma direção.", "De várias direções."], ALT_3 = ["Verbo de uma direção.", "Verbo de várias direções.", "Perfectivo com по-."], i3 = { uni: 0, multi: 1, pf: 2 }, USOS = [...new Set(FRM.map((x) => x.uso))];
    const LEVAR = [["нести", "levar algo a pé, carregando"], ["вести", "levar pessoas ou animais, conduzindo; dirigir um veículo"], ["везти", "levar alguém ou algo de veículo"]];
    const frDe = (tipo) => FRM.filter((x) => x.tipo === tipo), marca = (x) => x.ru.split(" ").map((w) => (w.replace(/[.,?]/g, "") === x.forma ? `<b>${w}</b>` : w)).join(" ");

    const exemplos = F.exemplo({ titulo: "Do sentido ao verbo", casos: [
      { nome: "Fácil: que tipo de verbo está na frase", gerar: (p) => { const x = p ? FRM[0] : F.escolha(FRM), v = V[x.inf];
        return { enun: R`<p>Na frase ${ru(x.ru)} (${x.pt}), que tipo de verbo de movimento é ${ru(x.forma)}?</p>`, fig: cart(x.ru, "frase da fonte, sem acento"), passos: [R`<p>(i) Ache o infinitivo: ${x.forma} é forma de ${ru(v.ac)} (${v.pt}).</p>`, R`<p>(ii) ${x.tipo === "pf" ? `${v.ac} é perfectivo, formado com по- a partir de ${V[v.par ? sem(v.par) : x.inf].ac}.` : `Na tabela de pares, ${v.ac} está na coluna "${ND[x.tipo]}"; o par dele é ${V[parDe(x.inf)].ac}.`}</p>`, R`<p>(iii) O sentido confirma: ${x.uso}.</p>`], resp: ND[x.tipo] }; } },
      { nome: "Médio: escolher entre os dois verbos", gerar: (p) => { const x = p ? FRM.find((y) => y.inf === "ходить" && y.tempo === "pres" && y.uso.includes("repetidas")) : F.escolha(FRM.filter((y) => y.tipo !== "pf")), o = parDe(x.inf), fo = V[o][x.tempo === "pres" ? "pres" : "pass"][x.i][0];
        return { enun: R`<p>Para dizer "${x.pt}", a frase russa usa ${ru(sem(fo))} ou ${ru(x.forma)}?</p>`, fig: cart(sem(fo) + " / " + x.forma, V[o].ac + " ou " + V[x.inf].ac + "?"), passos: [R`<p>(i) Os dois verbos querem dizer "${V[x.inf].pt}": ${V[x.inf].ac} é de ${ND[x.tipo]}, e ${V[o].ac}, de ${ND[dir(o)]}.</p>`, R`<p>(ii) O que a frase descreve: ${x.uso}.</p>`, R`<p>(iii) Isso pede o verbo de <b>${ND[x.tipo]}</b>: ${ru(x.ru)}</p>`], resp: x.forma }; } },
      { nome: "Difícil: prefixo e par de aspecto", gerar: (p) => { const P = p ? PREF.find((y) => y.pre === "при-") : F.escolha(PREF.filter((y) => y.pares[0][1])), q = p ? P.pares[0] : F.escolha(P.pares);
        return { enun: R`<p>Com o prefixo ${ru(P.pre)}, o par ${ru(V["идти"].ac)} / ${ru(V["ходить"].ac)} ou ${ru(V["ехать"].ac)} / ${ru(V["ездить"].ac)} vira um par de aspecto. Qual é o par que contém ${ru(V[q[0]].ac)}, o que ele quer dizer, e como fica "ele ${V[q[0]].pt.split(" (")[0]}" no passado e no futuro?</p>`, fig: cart(P.pre + " + ?", "verbo de movimento com prefixo"), passos: [R`<p>(i) Segundo a fonte, o verbo de uma direção é a base do perfectivo, e o de várias direções, a do imperfectivo. O par é ${ru(V[q[0]].ac)} (perfectivo) / ${ru(V[q[1]].ac)} (imperfectivo).</p>`, R`<p>(ii) Sentido do prefixo: ${P.pt}. Então: ${V[q[0]].pt}.</p>`, R`<p>(iii) Passado do perfectivo, para он: <b>${f(q[0], "pass", 0)}</b>; futuro: <b>${f(q[0], "pres", 2)}</b> (perfectivo não tem presente).</p>`, R`<p>(iv) "Ele costuma ${V[q[1]].pt.split(" (")[0]}", no presente, só com o imperfectivo: ${f(q[1], "pres", 2)}.</p>`], resp: V[q[0]].ac + " / " + V[q[1]].ac }; } }] });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", gerar: (p) => { const w = SIM.pega(base, p, 9);
        return { enun: R`<p>O verbo abaixo (${V[w].pt}) é de uma direção ou de várias direções?</p>`, fig: cart(V[w].ac, "que tipo?"), alts: ALT_D, certa: dir(w) === "uni" ? "A" : "B", resp: ND[dir(w)], dicas: [R`<p>O par dele é ${ru(V[parDe(w)].ac)}. Qual dos dois você usaria para "estou indo agora"?</p>`], sol: R`<p>${ru(V[w].ac)}: <b>${ND[dir(w)]}</b>. Par: ${V[parDe(w)].ac}.</p>` }; } }),
      F.exercicio({ n: 2, nivel: "Físico", gerar: (p) => { const w = SIM.pega(base, p, 2), o = parDe(w), a5 = SIM.alt5(o + ".", base.filter((y) => y !== o && y !== w && dir(y) === dir(o)).map((y) => y + "."), p);
        return { enun: R`<p>${ru(V[w].ac)} (${V[w].pt}) é de ${ND[dir(w)]}. Qual é o verbo de <b>${ND[dir(o)]}</b> que faz par com ele?</p>`, fig: cart(V[w].ac + " / ?", "par de movimento"), ...a5, resp: V[o].ac, dicas: [R`<p>O par tem o mesmo sentido e, quase sempre, a mesma raiz.</p>`], sol: R`<p>${ru(V[w].ac)} / ${ru(V[o].ac)}.</p>` }; } }),
      F.exercicio({ n: 3, nivel: "Físico", gerar: (p) => { const x = p ? FRM[3] : F.escolha(FRM);
        return { enun: R`<p>Na frase abaixo (${x.pt}), o verbo ${ru(x.forma)} é de que tipo?</p>`, fig: cart(x.ru, "frase da fonte"), alts: ALT_3, certa: "ABC"[i3[x.tipo]], resp: ND[x.tipo], dicas: [R`<p>O infinitivo é ${ru(V[x.inf].ac)}.</p>`], sol: R`<p>${ru(V[x.inf].ac)}: <b>${ND[x.tipo]}</b> (${x.uso}).</p>` }; } }),
      F.exercicio({ n: 4, nivel: "Máximo", gerar: (p) => { const x = p ? FRM.find((y) => /прошлом/.test(y.ru)) : F.escolha(FRM), a5 = SIM.alt5(cap(x.uso) + ".", USOS.filter((u) => u !== x.uso).map((u) => cap(u) + "."), p);
        return { enun: R`<p>A fonte dá a frase abaixo (${x.pt}) como exemplo de qual uso?</p>`, fig: cart(x.ru, V[x.inf].ac), ...a5, resp: x.uso, dicas: [R`<p>${ru(V[x.inf].ac)} é ${x.tipo === "pf" ? "perfectivo" : "de " + ND[x.tipo]}; veja também o tempo do verbo.</p>`], sol: R`<p><b>${cap(x.uso)}</b>.</p>` }; } }),
      F.exercicio({ n: 5, nivel: "Físico", gerar: (p) => { const k = p ? 2 : Math.floor(Math.random() * PREF.length), P = PREF[k];
        return { enun: R`<p>O que o prefixo ${ru(P.pre)} acrescenta a um verbo de movimento, como em ${ru(V[P.pares[0][0]].ac)}?</p>`, fig: cart(P.pre, "prefixo"), alts: PREF.map((y) => cap(y.pt) + "."), certa: "ABCDE"[k], resp: P.pt, dicas: [R`<p>Frase da fonte: ${P.ru} (${P.frPt})</p>`], sol: R`<p>${ru(P.pre)}: <b>${P.pt}</b>.</p>` }; } }),
      F.exercicio({ n: 6, nivel: "Físico", gerar: (p) => { const k = p ? 1 : F.escolha([0, 1, 2]), L = LEVAR[k];
        return { enun: R`<p>Qual par de verbos se usa para <b>${L[1]}</b>?</p>`, fig: cart("levar: como?", "três pares para \"levar\""), alts: ["нести / носить.", "вести / водить.", "везти / возить.", "идти / ходить.", "ехать / ездить."], certa: "ABC"[k], resp: L[0] + " / " + parDe(L[0]), dicas: [R`<p>Dois dos pares das alternativas são de "ir", não de "levar".</p>`], sol: R`<p><b>${V[L[0]].ac} / ${V[parDe(L[0])].ac}</b>: ${V[L[0]].pt}.</p>` }; } }),
      F.exercicio({ n: 7, nivel: "Máximo", gerar: (p) => { let q = p ? [FRM[0], FRM[3], FRM[4], FRM[8], FRM[10]] : []; while (q.length < 5) { const y = F.escolha(FRM); if (!q.includes(y)) q.push(y); } const v = q.filter((y) => y.tipo === "multi").length;
        return { enun: R`<p>Na tabela, cinco frases da fonte e o infinitivo do verbo de cada uma. Em quantas o verbo é de <b>várias direções</b>?</p>`, fig: D.svg(560, 150, SIM.dq.tab(15, 22, [390, 140], [["frase", "verbo"], ...q.map((y) => [y.ru, V[y.inf].ac])]), "figura"), num: { v, tol: 0.001, un: "", abs: 0.001 }, py: `${v}`, resp: String(v), dicas: [R`<p>Várias direções: ${multis.join(", ")}.</p>`], sol: R`<p>${q.map((y) => `${V[y.inf].ac}: ${ND[y.tipo]}`).join("; ")}. Total: <b>${v}</b>.</p>` }; } }),
      F.exercicio({ n: 8, nivel: "Físico", gerar: (p) => { const w = SIM.pega(base, p, 1), i = p ? 0 : Math.floor(Math.random() * 6), certo = sem(f(w, "pres", i)), o = parDe(w), a5 = SIM.alt5(certo + ".", [...new Set([sem(f(o, "pres", i)), sem(f(w, "pres", (i + 1) % 6)), sem(f(w, "pres", (i + 3) % 6)), sem(f(o, "pres", (i + 2) % 6)), sem(f(w, "pass", 0)), sem(f(o, "pass", 0))])].filter((y) => y !== certo).map((y) => y + "."), p);
        return { enun: R`<p>Qual é o presente de ${ru(V[w].ac)} (${V[w].pt}, ${ND[dir(w)]}) para <b>${PE[i]}</b>? Alternativas sem acento.</p>`, fig: cart(PE[i].split(",")[0] + " + " + V[w].ac, "presente"), ...a5, resp: f(w, "pres", i), dicas: [R`<p>Cuidado para não pegar a forma do par, ${V[o].ac}.</p>`], sol: R`<p><b>${f(w, "pres", i)}</b>. (Do par ${V[o].ac}: ${f(o, "pres", i)}.)</p>` }; } }),
      F.exercicio({ n: 9, nivel: "Físico", gerar: (p) => { const w = SIM.pega(base.concat(comPref), p, 4), a5 = SIM.alt5(cap(V[w].pt) + ".", [...new Set(base.concat(comPref).filter((y) => V[y].pt !== V[w].pt).map((y) => cap(V[y].pt) + "."))], p);
        return { enun: R`<p>O que quer dizer o verbo abaixo?</p>`, fig: cart(V[w].ac, "verbo de movimento"), ...a5, resp: V[w].pt, dicas: [R`<p>${comPref.includes(w) ? "Separe o prefixo e veja se o resto lembra идти/ходить (a pé) ou ехать/ездить (de veículo)." : "É um dos oito pares sem prefixo."}</p>`], sol: R`<p>${ru(V[w].ac)} = <b>${V[w].pt}</b>.</p>` }; } }),
      F.exercicio({ n: 10, nivel: "Máximo", gerar: (p) => { const q = SIM.pega(parP, p, 0), a5 = SIM.alt5(q[0] + ".", [...new Set(parP.map((y) => y[0]).concat(MOV.filter((m) => m.pf).map((m) => m.pf)))].filter((y) => y !== q[0]).map((y) => y + "."), p);
        return { enun: R`<p>${ru(V[q[1]].ac)} (${V[q[1]].pt}) é imperfectivo. Qual é o perfectivo que faz par com ele?</p>`, fig: cart(V[q[1]].ac + " / ?", "par de aspecto com prefixo"), ...a5, resp: V[q[0]].ac, dicas: [R`<p>Mesmo prefixo; a base do perfectivo é o verbo de uma direção (идти vira -йти).</p>`], sol: R`<p>${ru(V[q[1]].ac)} / ${ru(V[q[0]].ac)}.</p>` }; } }),
      F.exercicio({ n: 11, nivel: "Físico", gerar: (p) => { const w = SIM.pega(unis, p, 3), o = parDe(w);
        return { enun: R`<p>Escreva, em cirílico, o verbo de <b>várias direções</b> que faz par com ${ru(V[w].ac)} (${V[w].pt}).</p>`, fig: cart(V[w].ac + " / ?", "par de movimento"), txt: { v: o, teclado: "ru", rot: "infinitivo" }, resp: V[o].ac, dicas: [R`<p>Tem ${[...o].length} letras e começa por ${ru(o[0])}.</p>`], sol: R`<p>${ru(V[w].ac)} / ${ru(V[o].ac)}.</p>` }; } }),
      F.exercicio({ n: 12, nivel: "Máximo", gerar: (p) => { const w = SIM.pega(base, p, 5), i = p ? 0 : Math.floor(Math.random() * 6);
        return { enun: R`<p>Escreva, em cirílico, o presente de ${ru(V[w].ac)} (${V[w].pt}) para <b>${PE[i]}</b>.</p>`, fig: cart(PE[i].split(",")[0] + " + " + V[w].ac, "presente"), txt: { v: V[w].pres[i], teclado: "ru", rot: "presente" }, resp: f(w, "pres", i), dicas: [R`<p>Vários desses verbos mudam a consoante do radical na forma de я.</p>`, R`<p>Para он, она: ${f(w, "pres", 2)}.</p>`], sol: R`<p><b>${V[w].pres[i].join(" ou ")}</b>.</p>` }; } }),
      F.exercicio({ n: 13, nivel: "Máximo", gerar: (p) => { const w = SIM.pega(unis, p, 0), i = p ? 0 : Math.floor(Math.random() * 4);
        return { enun: R`<p>Escreva, em cirílico, o passado de ${ru(V[w].ac)} (${V[w].pt}) para <b>${SIM.ruPassP[i]}</b>.</p>`, fig: cart(SIM.ruPassP[i] + " + " + V[w].ac, "passado"), txt: { v: V[w].pass[i], teclado: "ru", rot: "passado" }, resp: f(w, "pass", i), dicas: [R`<p>Os verbos de uma direção em -ти têm passado irregular; идти troca o radical inteiro.</p>`], sol: R`<p><b>${V[w].pass[i].join(" ou ")}</b>.</p>` }; } }),
      F.exercicio({ n: 14, nivel: "Máximo", gerar: (p) => { const q = SIM.pega(parP, p, 2), i = p ? 2 : Math.floor(Math.random() * 6);
        return { enun: R`<p>Escreva, em cirílico, o <b>futuro</b> de ${ru(V[q[0]].ac)} (${V[q[0]].pt}, perfectivo) para <b>${PE[i]}</b>.</p>`, fig: cart(PE[i].split(",")[0] + " + " + V[q[0]].ac, "futuro do perfectivo"), txt: { v: V[q[0]].pres[i], teclado: "ru", rot: "futuro" }, resp: f(q[0], "pres", i), dicas: [R`<p>Uma palavra só: as terminações de pessoa de идти ou ехать, depois do prefixo.</p>`], sol: R`<p><b>${V[q[0]].pres[i].join(" ou ")}</b>.</p>` }; } }),
    ];
    const pf0 = frDe("pf")[0], uni0 = FRM.find((x) => x.ru === "Он шёл к другу."), mul0 = FRM.find((x) => x.ru === "Он ходил к другу.");
    const chefao = F.chefao({ titulo: "Quatro jeitos de ir à casa do amigo",
      enun: R`<p>A fonte compara: ${ru(uni0.ru)} ${ru(mul0.ru)} ${ru(pf0.ru)} e ainda ${ru("Он сходил к другу.")} (a) Diga o infinitivo e o tipo do verbo das três primeiras. (b) Traduza as três, mostrando a diferença. (c) A quarta usa um perfectivo com с- formado do verbo de várias direções; pelo que a tabela de prefixos da fonte diz, o que ela afirma que a terceira não afirma? (d) Reescreva as três primeiras com "ela" no lugar de "ele". (e) Passe a primeira para o presente e a terceira para o futuro, com "ele". (f) Troque "a pé" por "de veículo" nas três primeiras (com "ele").</p>`,
      fig: cart("шёл · ходил · пошёл", "três passados de \"ir\""),
      dicas: [R`<p>(c) Releia, na tabela de prefixos, o que a fonte diz do с- "resultativo": ida e volta completa.</p>`, R`<p>(f) Os verbos são ехать, ездить e поехать; o passado de cada um está no mapa do par.</p>`],
      sol: R`<p><b>(a)</b> ${uni0.forma}: ${V["идти"].ac}, uma direção; ${mul0.forma}: ${V["ходить"].ac}, várias direções; ${pf0.forma}: ${V["пойти"].ac}, perfectivo com по-.</p>
        <p><b>(b)</b> ${uni0.pt} ${mul0.pt} ${pf0.pt}</p>
        <p><b>(c)</b> Que ele foi <b>e voltou</b>: a fonte traduz a quarta por "foi à casa de um amigo (e voltou)", e descreve esse с- como movimento completo de ida e volta. A terceira, com по-, diz só que ele partiu, e a fonte acrescenta que ele ainda não voltou.</p>
        <p><b>(d)</b> Она ${sem(f("идти", "pass", 1))} к другу. Она ${sem(f("ходить", "pass", 1))} к другу. Она ${sem(f("пойти", "pass", 1))} к другу.</p>
        <p><b>(e)</b> Он ${sem(f("идти", "pres", 2))} к другу. Он ${sem(f("пойти", "pres", 2))} к другу.</p>
        <p><b>(f)</b> Он ${sem(f("ехать", "pass", 0))} к другу. Он ${sem(f("ездить", "pass", 0))} к другу. Он ${sem(f("поехать", "pass", 0))} к другу.</p>` });

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Gramática russa</div>
        <div class="q">"Eu vou à escola." Em russo, antes de traduzir é preciso responder a três perguntas que o português nem faz: a pé ou de veículo? Estou indo agora, ou vou todo dia? E vou e volto, ou só fui? Cada resposta troca o verbo.</div>
        <p>Os <b>verbos de movimento</b> são uma classe à parte. Os que não têm prefixo são todos imperfectivos e vêm em pares pelo jeito de ver o movimento: um verbo para o movimento <b>numa direção</b>, em curso, e outro para o movimento <b>em várias direções</b>, o hábito, a ida e volta. A fonte avisa que eles dão trabalho a estudantes de todos os níveis; vale ir devagar.</p></div>
        ${F.chute({ q: "\"Она ходит в супермаркет каждую неделю\" (ela vai ao supermercado toda semana). O verbo ходит é do par идти / ходить. Por que a frase usa ходить?", ops: ["porque o supermercado é longe", "porque é uma viagem que se repete: ida e volta, toda semana", "porque o sujeito é feminino"], certa: 1, exp: "Viagens repetidas pedem o verbo de várias direções. Para \"ela está indo agora\", seria идёт, de идти." })}`),

      F.secao("laboratorio", "Laboratório: uma direção ou várias?", R`<p>Frases da fonte, com a tradução. Diga de que tipo é o verbo em destaque.</p><div id="lab-dir"></div>`),

      F.secao("pares", "Dois verbos para cada movimento", R`
        ${F.fig(tabPares, "Oito pares de verbos de movimento sem prefixo. Pares: notas de uso do Wiktionary, conferidas com a tabela da Wikipedia.")}
        <p>Os verbos de <b>uma direção</b> descrevem o movimento em curso, num sentido só:</p>
        <ul><li>${marca(FRM[0])} (${FRM[0].pt})</li><li>${marca(FRM[2])} (${FRM[2].pt})</li></ul>
        <p>Os de <b>várias direções</b> servem, segundo a fonte, para quatro coisas:</p>
        <ol><li>capacidade ou hábito, sem direção nem destino: ${marca(FRM[3])} (${FRM[3].pt})</li>
        <li>movimento em várias direções: ${marca(FRM[4])} (${FRM[4].pt})</li>
        <li>viagens repetidas: ${marca(FRM[5])} (${FRM[5].pt})</li>
        <li>no passado, uma única ida e volta: ${marca(FRM[6])} (${FRM[6].pt})</li></ol>
        ${F.formula(R`\text{uma direção: em curso, para lá}\qquad\qquad\text{várias direções: capacidade, hábito, vaivém, ida e volta}`, "Os dois tipos")}
        ${F.demo("Regra 14: como escolher o verbo", R`<p><b>Afirmação.</b> Três perguntas, nesta ordem, escolhem o verbo.</p>
          <p><b>Passo a passo.</b> (i) <b>Como</b> se vai? A pé: ${ru(V["идти"].ac)} / ${ru(V["ходить"].ac)}. De veículo: ${ru(V["ехать"].ac)} / ${ru(V["ездить"].ac)}. Correndo, voando, nadando: os outros pares da tabela. (ii) O movimento está <b>em curso, numa direção</b>? Verbo da coluna do meio: ${ru(sem(f("идти", "pres", 0)))}, "estou indo". (iii) É <b>hábito, vaivém ou ida e volta</b>? Verbo da coluna da direita: ${ru(sem(f("ходить", "pres", 0)))}, "vou (sempre)". (iv) Quer dizer que alguém <b>partiu</b>? Perfectivo com по-, assunto da seção 4.</p>`)}
        ${F.caixa("pegadinha", R`<p>No passado, o verbo de várias direções conta uma viagem <b>inteira</b>: ${ru(FRM[6].ru)} quer dizer que fui <b>e voltei</b>. Já o verbo de uma direção, no passado, mostra a pessoa a caminho: ${ru(FRM[1].ru)} (${FRM[1].pt}). Trocar um pelo outro muda a história.</p>`)}`),

      F.secao("levar", "Ir e levar", R`
        <p>Três dos pares da tabela não são de "ir", e sim de <b>levar</b>. O verbo já diz como se leva:</p>
        <ul><li>${ru(V["нести"].ac)} / ${ru(V["носить"].ac)}: levar a pé, carregar. ${marca(FRM.find((x) => x.inf === "нести"))} (${FRM.find((x) => x.inf === "нести").pt})</li>
        <li>${ru(V["вести"].ac)} / ${ru(V["водить"].ac)}: levar pessoas ou animais, conduzindo; também dirigir um veículo. ${marca(FRM.find((x) => x.inf === "водить"))} (${FRM.find((x) => x.inf === "водить").pt})</li>
        <li>${ru(V["везти"].ac)} / ${ru(V["возить"].ac)}: levar de veículo. ${marca(FRM.find((x) => x.inf === "везти"))} (${FRM.find((x) => x.inf === "везти").pt})</li></ul>
        <p>A divisão uma direção / várias direções vale do mesmo jeito: ${ru(FRM.find((x) => x.inf === "носить").ru)} (${FRM.find((x) => x.inf === "носить").pt}) é hábito; ${ru(FRM.find((x) => x.inf === "возить").ru)} é uma viagem de ida e volta.</p>
        ${F.caixa("fisico", R`<p>Não há regra de terminação a medir neste tema: qual verbo usar depende do sentido. O que o site pôde conferir é a lista de pares, em duas fontes independentes: para cada um dos ${MOV.length} pares, a nota de uso do Wiktionary de cada verbo diz o tipo e aponta para o outro, e o mesmo par está na tabela da Wikipedia. Se uma das duas discordasse, o gerador não gravaria.</p>`, "Pense como quem mede")}`),

      F.secao("laboratorio2", "Laboratório: jogo de pares de movimento", R`<p>Ligue cada verbo de uma direção ao seu par de várias direções.</p><div id="lab-pares"></div>`),

      F.secao("mapa", "Mapa do par", R`<p>Um par inteiro num mapa: presente e passado dos dois verbos e o perfectivo com по-, quando o banco tem. Use "esconder e lembrar".</p><div id="lab-mapa"></div>
        ${F.fig(mapaPar, "Mapa mental do par de \"ir a pé\". Formas do Wiktionary em inglês.")}`),

      F.secao("prefixos", "Partir, chegar, entrar, sair: os prefixos", R`
        <p><b>по-</b>: posto num verbo de uma direção, forma o perfectivo e marca o <b>começo</b> do movimento, o "pôr-se a caminho". A fonte acrescenta que esses perfectivos dão a entender que a pessoa ainda não voltou: ${ru(pf0.ru)} (${pf0.pt})</p>
        <p><b>Outros prefixos</b> formam novos pares de aspecto, que perdem a distinção de direção e ganham um sentido de lugar ou de tempo. A fonte dá a receita: o verbo de <b>uma direção</b> é a base do <b>perfectivo</b>, e o de <b>várias direções</b>, a do <b>imperfectivo</b>. Alguns radicais mudam de forma: ${ru("идти")} vira ${ru("-йти")} (e, depois de prefixo terminado em consoante, entra um -о-: ${ru(V["войти"].ac)}); ${ru("ездить")} vira ${ru("-езжать")}. Em ${ru(V["прийти"].ac)} o й some na conjugação: ${ru(f("прийти", "pres", 0))}. E, nos perfectivos com вы-, o acento fica no prefixo em todas as formas: ${ru(f("выйти", "pres", 1))}.</p>
        ${F.fig(tabPref, "Cinco prefixos. Sentidos: tabela \"Prefixed verbs of motion\" da Wikipedia em inglês; pares: verbetes do Wiktionary.")}
        ${F.formula(R`\text{prefixo} + \text{verbo de uma direção} = \text{perfectivo}\qquad\qquad \text{prefixo} + \text{verbo de várias direções} = \text{imperfectivo}`, "Pares de aspecto com prefixo")}
        <div id="lab-pref"></div>
        ${F.caixa("ponte", R`<p>A fonte usa um termo da linguística para explicar por que isso parece tão estranho: o russo é uma língua "de satélite". O <b>modo</b> de se mover fica na raiz do verbo (a pé, de veículo, voando), e o <b>caminho</b> fica em volta dela, no prefixo e na preposição (para dentro, para fora, até). Por isso a fonte recomenda olhar o sintagma verbal inteiro, e não só o verbo. A tabela completa da fonte tem mais de vinte prefixos; aqui ficaram cinco.</p>`)}`),

      F.secao("escrever", "Escreva a forma", R`<p>Presente dos dezesseis verbos sem prefixo. Vários mudam a consoante na forma de я.</p><div id="lab-escreve"></div>
        ${F.fig(mapaTema, "Mapa mental do tema.")}
        ${F.caixa("olimpiada", R`<p>Os verbos de movimento também aparecem fora do sentido literal, e a fonte avisa que nesses usos a distinção de direção quase não conta, porque cada expressão pede um verbo fixo. Exemplos da tabela da fonte: ${ru("Время летит.")} (o tempo voa), ${ru("Часы идут.")} (o relógio anda), ${ru("Дорога ведёт в город.")} (a estrada leva à cidade). Reconhecer o infinitivo por trás de uma forma irregular, como ${ru(sem(f("идти", "pass", 0)))} ou ${ru(sem(f("вести", "pres", 2)))}, é metade do trabalho de leitura. Aqui não há nenhuma questão real de prova.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) {
    const RU = SIM.RU;
    let e = document.getElementById("lab-dir"); e.outerHTML = F.lab("Uma direção ou várias? Leia a frase", "lab-dir"); SIM.ruUmaOuVarias(document.getElementById("lab-dir"), F);
    e = document.getElementById("lab-pares"); e.outerHTML = F.lab("Jogo de pares: uma direção e várias direções", "lab-pares"); SIM.ruParesAsp(document.getElementById("lab-pares"), F, { pares: RU.MOV.map((m) => [m.uni, m.multi]), rot: ["uma direção", "várias direções"], ajuda: "Clique num verbo de uma direção e depois no seu par de várias direções. Pares: notas de uso do Wiktionary, conferidas com a tabela da Wikipedia." });
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa do par de movimento: uma direção, várias e o perfectivo", "lab-mapa"); SIM.ruMapaMovLab(document.getElementById("lab-mapa"), F);
    e = document.getElementById("lab-pref"); e.outerHTML = F.lab("Prefixo e direção: o que cada prefixo faz", "lab-pref"); SIM.ruPrefixos(document.getElementById("lab-pref"), F);
    e = document.getElementById("lab-escreve"); e.outerHTML = F.lab("Escreva a forma do verbo", "lab-escreve"); SIM.ruEscreveVerbo(document.getElementById("lab-escreve"), F, { tempo: "pres", verbos: RU.MOV.flatMap((m) => [m.uni, m.multi]) });
  },
});
