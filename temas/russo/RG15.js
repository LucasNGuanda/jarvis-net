/* Russo RG15 · Preposições e regência.
   Nada de memória. O caso de cada preposição, sentido a sentido, e os exemplos vêm das definições do Wiktionary em inglês, que marcam "[with
   genitive]", "[with accusative]" etc. (SIM.RU.PREP, SIM.RU.ONDE, GERADOS de tools/russo/dadosR6.json); o gerador cruza cada preposição com as listas
   por caso de "Russian grammar" (Wikipedia) e não grava se as duas fontes não tiverem um caso em comum. As traduções dos sentidos são minhas, presas
   a uma palavra em inglês da definição. Os pares preposição + substantivo dos laboratórios e dos exercícios (SIM.RU.PARES_PREP) são combinações
   montadas pelo site; a forma do substantivo sai da tabela dele. Sem regra medida: o caso de cada preposição é dado de dicionário.
   Fora do tema por falta de fonte: a regência dos verbos (a coleta só trouxe regência escrita para dois verbos). */
F.registrar("russo/RG15", {
  retoma: ["RG08", "RG14"],
  html(F) {
    const R = String.raw, RU = SIM.RU, PR = RU.PREP, ON = RU.ONDE, PP = RU.PARES_PREP, DE = RU.DECL, AC = "́", sem = (s) => String(s).split(AC).join(""), NC = SIM.ruNomeCaso, CS = ["acc", "gen", "dat", "ins", "prep"];
    const ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`, cap = (s) => s[0].toUpperCase() + s.slice(1);
    const cart = (w, sub = "", cor = "var(--ink)") => { const n = [...sem(w)].length, t = Math.min(48, Math.floor(820 / Math.max(n, 6))); return D.svg(560, 116, `<rect x="30" y="8" width="500" height="78" rx="12" style="fill:var(--card2);stroke:var(--line)"/><text x="280" y="${50 + t * 0.34}" text-anchor="middle" style="font:700 ${t}px Inter,system-ui,sans-serif;fill:${cor};letter-spacing:.5px">${w}</text>` + (sub ? D.txt(280, 106, sub, "tx2", "middle") : ""), "figura"); };
    const preps = [...new Set(PR.map((x) => x.p))], casosDe = SIM.ruCasosDe, unicas = preps.filter((p) => casosDe(p).length === 1), varias = PR.filter((x) => casosDe(x.p).length > 1), usoDe = (p, c) => PR.find((x) => x.p === p && x.caso === c);
    const umSentido = PR.filter((x) => PR.filter((y) => y.p === x.p).length === 1 && PR.filter((y) => y.pt === x.pt).length === 1);
    const fn = (w, c) => DE[w].casos[c][0][0], ALT_C = CS.map((c) => cap(NC[c]) + "."), PERG = { onde: "Onde? (lugar)", para: "Para onde? (destino)", de: "De onde? (origem)" }, iP = { onde: 0, para: 1, de: 2 };
    const linhasCaso = CS.flatMap((c) => { const L = SIM.ruPrepsDe(c), o = []; for (let i = 0; i < L.length; i += 8) o.push([i ? "" : NC[c], L.slice(i, i + 8).join(", ")]); return o; });
    const tabCasos = D.svg(560, 40 + 22 * (linhasCaso.length + 1), SIM.dq.tab(20, 22, [130, 390], [["caso", "preposições (neste tema)"], ...linhasCaso]), "figura");
    const duplas = [[0, 1], [2, 3], [4, 5], [7, 8]].map(([a, b]) => [ON[a], ON[b]]).filter(([a, b]) => a && b && a.p === b.p && a.perg === "onde" && b.perg === "para");
    const tabOnde = D.svg(560, 40 + 22 * (duplas.length + 1), SIM.dq.tab(20, 22, [70, 225, 225], [["", "onde? (lugar)", "para onde? (destino)"], ...duplas.map(([a, b]) => [a.p, a.ru + " · " + NC[a.caso], b.ru + " · " + NC[b.caso]])]), "figura");
    const exDe = (p, c) => { const u = PR.filter((x) => x.p === p && x.caso === c && x.ex)[0]; return u ? `${ru(u.ex[0])}` : ""; };
    const ter = PR.find((x) => x.p === "у" && /posse/.test(x.pt)), div = PR.find((x) => x.p === "на" && /divis/.test(x.pt));

    const exemplos = F.exemplo({ titulo: "Da preposição ao caso", casos: [
      { nome: "Fácil: preposição de um caso só", gerar: (p) => { const q = p ? PP.find((y) => y[0] === "без") : F.escolha(PP.filter((y) => unicas.includes(y[0]))), [pr, c, w] = q, u = usoDe(pr, c);
        return { enun: R`<p>Como se diz "${u.pt.split(",")[0]} + ${DE[w].pt}" com a preposição ${ru(u.ac)} e o substantivo ${ru(DE[w].ac)}?</p>`, fig: cart(u.ac + " + " + DE[w].ac, "que caso?"), passos: [R`<p>(i) ${ru(u.ac)} pede sempre o mesmo caso: o <b>${NC[c]}</b>.</p>`, R`<p>(ii) ${NC[c]} singular de ${DE[w].ac} (tabela do dicionário): <b>${fn(w, c)}</b>.</p>`, R`<p>(iii) Resposta: ${ru(u.ac + " " + fn(w, c))}.</p>`], resp: u.ac + " " + fn(w, c) }; } },
      { nome: "Médio: lugar ou destino", gerar: (p) => { const base = PP.filter((y) => ["в", "на"].includes(y[0])), w = p ? "школа" : F.escolha([...new Set(base.map((y) => y[2]))]), pr = base.find((y) => y[2] === w)[0];
        return { enun: R`<p>Com ${ru(pr)} e ${ru(DE[w].ac)} (${DE[w].pt}), diga "estou n${DE[w].g === "f" ? "a" : "o"} ${DE[w].pt}" e "vou para ${DE[w].g === "f" ? "a" : "o"} ${DE[w].pt}". Só a preposição e o substantivo.</p>`, fig: cart(pr + " + " + DE[w].ac, "onde? × para onde?"), passos: [R`<p>(i) A preposição é a mesma nas duas frases; o que muda é o caso.</p>`, R`<p>(ii) Onde? (lugar): ${pr} + preposicional: <b>${pr} ${fn(w, "prep")}</b>.</p>`, R`<p>(iii) Para onde? (destino): ${pr} + acusativo: <b>${pr} ${fn(w, "acc")}</b>.</p>`], resp: pr + " " + fn(w, "prep") + "; " + pr + " " + fn(w, "acc") }; } },
      { nome: "Difícil: ir, estar, voltar", gerar: (p) => { const w = p ? "город" : F.escolha(["город", "школа"]);
        return { enun: R`<p>Três momentos de uma viagem, com ${ru(DE[w].ac)} (${DE[w].pt}): ir <b>para</b> lá (в), estar <b>lá</b> (в), voltar <b>de</b> lá (из). Escreva as três expressões.</p>`, fig: cart("в ? · в ? · из ?", DE[w].ac), passos: [R`<p>(i) Destino: в + acusativo: <b>в ${fn(w, "acc")}</b>.</p>`, R`<p>(ii) Lugar: в + preposicional: <b>в ${fn(w, "prep")}</b>.</p>`, R`<p>(iii) Origem: из pede sempre o genitivo: <b>из ${fn(w, "gen")}</b>.</p>`, R`<p>(iv) Três casos diferentes para a mesma palavra, e a preposição mais a terminação dizem qual dos três momentos é.</p>`], resp: `в ${fn(w, "acc")}, в ${fn(w, "prep")}, из ${fn(w, "gen")}` }; } }] });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", gerar: (p) => { const w = SIM.pega(unicas, p, 5), u = PR.find((x) => x.p === w);
        return { enun: R`<p>A preposição abaixo (${u.pt}) pede sempre o mesmo caso. Qual?</p>`, fig: cart(u.ac, "que caso?"), alts: ALT_C, certa: "ABCDE"[CS.indexOf(u.caso)], resp: NC[u.caso], dicas: [R`<p>O genitivo é o caso com mais preposições; o dativo tem poucas (${SIM.ruPrepsDe("dat").join(", ")}).</p>`], sol: R`<p>${ru(u.ac)} + <b>${NC[u.caso]}</b>.${u.ex ? ` Exemplo do verbete: ${u.ex[0]}.` : ""}</p>` }; } }),
      F.exercicio({ n: 2, nivel: "Físico", gerar: (p) => { const u = SIM.pega(umSentido, p, 3), a5 = SIM.alt5(u.p + ".", preps.filter((y) => y !== u.p).map((y) => y + "."), p);
        return { enun: R`<p>Qual preposição quer dizer <b>${u.pt}</b>?</p>`, fig: cart("?", u.pt), ...a5, resp: u.ac, dicas: [R`<p>Ela pede o ${NC[u.caso]}.</p>`], sol: R`<p>${ru(u.ac)} (+ ${NC[u.caso]}).</p>` }; } }),
      F.exercicio({ n: 3, nivel: "Físico", gerar: (p) => { const x = p ? ON[3] : F.escolha(ON);
        return { enun: R`<p>O exemplo abaixo (do verbete de ${ru(x.p)}) responde a que pergunta?</p>`, fig: cart(x.ru, "exemplo do dicionário"), alts: Object.values(PERG), certa: "ABC"[iP[x.perg]], resp: PERG[x.perg], dicas: [R`<p>O substantivo está no ${NC[x.caso]}.</p>`], sol: R`<p><b>${PERG[x.perg]}</b> ${x.p} + ${NC[x.caso]}: ${x.pt}.</p>` }; } }),
      F.exercicio({ n: 4, nivel: "Máximo", gerar: (p) => { const u = SIM.pega(varias, p, 1);
        return { enun: R`<p>${ru(u.ac)} pede mais de um caso, conforme o sentido. No sentido de <b>${u.pt}</b>, qual caso ela pede?</p>`, fig: cart(u.ac, u.pt), alts: ALT_C, certa: "ABCDE"[CS.indexOf(u.caso)], resp: NC[u.caso], dicas: [R`<p>Os casos dessa preposição: ${casosDe(u.p).map((c) => NC[c]).join(", ")}.</p>`], sol: R`<p>${ru(u.ac)} (${u.pt}) + <b>${NC[u.caso]}</b>.${u.ex ? ` Exemplo do verbete: ${u.ex[0]}.` : ""}</p>` }; } }),
      F.exercicio({ n: 5, nivel: "Físico", gerar: (p) => { const u = SIM.pega(umSentido, p, 8), a5 = SIM.alt5(cap(u.pt) + ".", [...new Set(PR.filter((y) => y.pt !== u.pt && y.p !== u.p).map((y) => cap(y.pt) + "."))], p);
        return { enun: R`<p>O que quer dizer a preposição abaixo?</p>`, fig: cart(u.ac, "preposição"), ...a5, resp: u.pt, dicas: [R`<p>Ela pede o ${NC[u.caso]}.</p>`], sol: R`<p>${ru(u.ac)} = <b>${u.pt}</b>.</p>` }; } }),
      F.exercicio({ n: 6, nivel: "Máximo", gerar: (p) => { let q = p ? ["для", "к", "без", "над", "после"] : []; while (q.length < 5) { const y = F.escolha(unicas); if (!q.includes(y)) q.push(y); } const v = q.filter((y) => casosDe(y)[0] === "gen").length;
        return { enun: R`<p>Na tabela, cinco preposições de um caso só, com o sentido. Quantas delas pedem o <b>genitivo</b>?</p>`, fig: D.svg(560, 150, SIM.dq.tab(60, 22, [140, 300], [["preposição", "sentido"], ...q.map((y) => [PR.find((x) => x.p === y).ac, PR.find((x) => x.p === y).pt])]), "figura"), num: { v, tol: 0.001, un: "", abs: 0.001 }, py: `${v}`, resp: String(v), dicas: [R`<p>Do genitivo: ${SIM.ruPrepsDe("gen").join(", ")}.</p>`], sol: R`<p>${q.map((y) => `${y}: ${NC[casosDe(y)[0]]}`).join("; ")}. Com genitivo: <b>${v}</b>.</p>` }; } }),
      F.exercicio({ n: 7, nivel: "Físico", gerar: (p) => { const [pr, c, w] = SIM.pega(PP, p, 2), u = usoDe(pr, c), certo = sem(fn(w, c)), a5 = SIM.alt5(certo + ".", [...new Set(["nom", "acc", "gen", "dat", "ins", "prep"].flatMap((k) => [0, 1].map((n) => (DE[w].casos[k][n][0] ? sem(DE[w].casos[k][n][0]) : null))))].filter((y) => y && y !== certo).map((y) => y + "."), p);
        return { enun: R`<p>Qual forma de ${ru(DE[w].ac)} (${DE[w].pt}) vem depois de ${ru(u.ac)}, no sentido de <b>${u.pt}</b>? Alternativas sem acento.</p>`, fig: cart(u.ac + " + " + DE[w].ac, u.pt), ...a5, resp: fn(w, c), dicas: [R`<p>Com esse sentido, ${u.ac} pede o ${NC[c]}.</p>`], sol: R`<p>${u.ac} + ${NC[c]}: <b>${u.ac} ${fn(w, c)}</b>.</p>` }; } }),
      F.exercicio({ n: 8, nivel: "Físico", gerar: (p) => { const d = SIM.pega(duplas, p, 0), inv = p ? false : Math.random() < 0.5, k = p ? 1 : F.escolha([0, 1]), ops = inv ? [d[1], d[0]] : d, alvo = d[k];
        return { enun: R`<p>Dois exemplos do verbete de ${ru(d[0].p)}. Qual deles responde a <b>${k ? "para onde?" : "onde?"}</b></p>`, fig: cart(ops[0].ru + "  ·  " + ops[1].ru, "mesma preposição, dois casos"), alts: ops.map((o) => o.ru + "."), certa: "AB"[ops.indexOf(alvo)], resp: alvo.ru, dicas: [R`<p>Destino pede o acusativo; lugar pede ${NC[d[0].caso]}.</p>`], sol: R`<p><b>${alvo.ru}</b> (${NC[alvo.caso]}): ${alvo.pt}. O outro: ${d[1 - k].ru} (${NC[d[1 - k].caso]}), ${d[1 - k].pt}.</p>` }; } }),
      F.exercicio({ n: 9, nivel: "Máximo", gerar: (p) => { const c = p ? "dat" : F.escolha(["dat", "ins", "prep", "acc"]), boas = unicas.filter((y) => casosDe(y)[0] === c), w = p ? boas[0] : F.escolha(boas), a5 = SIM.alt5(w + ".", unicas.filter((y) => casosDe(y)[0] !== c).map((y) => y + "."), p);
        return { enun: R`<p>Qual destas preposições pede o <b>${NC[c]}</b>?</p>`, fig: cart("? + " + NC[c], "preposição"), ...a5, resp: w, dicas: [R`<p>As outras quatro pedem outros casos; a maioria, o genitivo.</p>`], sol: R`<p><b>${PR.find((x) => x.p === w).ac}</b> (${PR.find((x) => x.p === w).pt}) + ${NC[c]}.</p>` }; } }),
      F.exercicio({ n: 10, nivel: "Físico", gerar: (p) => { const k = p ? 1 : F.escolha([0, 1, 2]), A = RU.ALT_PREP[k], q = [R`Antes de certos encontros de consoantes, como em "во вторник", a preposição ${ru("в")} muda de forma. Para qual?`, R`Antes de vogal, a preposição ${ru("о")} (sobre) muda de forma. Para qual?`, R`Antes de algumas palavras, como ${ru("мне")} e ${ru("все")}, a preposição ${ru("о")} tem uma terceira forma. Qual?`][k];
        return { enun: R`<p>${q}</p>`, fig: cart(A.p + " → ?", "forma alternativa"), alts: ["во.", "об.", "обо.", "из.", "от."], certa: "ABC"[k], resp: A.alt, dicas: [R`<p>Duas das alternativas são outras preposições, não variantes.</p>`], sol: R`<p><b>${A.alt}</b>. O verbete diz: "${A.en}".</p>` }; } }),
      F.exercicio({ n: 11, nivel: "Físico", gerar: (p) => { const u = SIM.pega(umSentido.filter((x) => !x.p.includes("-")), p, 6);
        return { enun: R`<p>Escreva, em cirílico, a preposição que quer dizer <b>${u.pt}</b> (ela pede o ${NC[u.caso]}).</p>`, fig: cart("? + " + NC[u.caso], u.pt), txt: { v: u.p, teclado: "ru", rot: "preposição" }, resp: u.ac, dicas: [R`<p>Tem ${[...u.p].length} letras e começa por ${ru(u.p[0])}.</p>`], sol: R`<p>${ru(u.ac)}.</p>` }; } }),
      ...[["gen", 0, 12], ["ins", 1, 13], ["prep", 3, 14]].map(([c, k, n]) => F.exercicio({ n, nivel: n === 12 ? "Físico" : "Máximo", gerar: (p) => { const [pr, , w] = SIM.pega(PP.filter((y) => (c === "ins" ? ["ins", "dat"] : c === "prep" ? ["prep", "acc"] : ["gen"]).includes(y[1])), p, k), cc = PP.find((y) => y[0] === pr && y[2] === w && (c === "prep" && p ? y[1] === "prep" : true))[1], u = usoDe(pr, cc);
        return { enun: R`<p>Escreva, em cirílico, a forma de ${ru(DE[w].ac)} (${DE[w].pt}) que vem depois de ${ru(u.ac)}, no sentido de <b>${u.pt}</b>. Só o substantivo.</p>`, fig: cart(u.ac + " + " + DE[w].ac, u.pt), txt: { v: DE[w].casos[cc][0], teclado: "ru", rot: "substantivo" }, resp: fn(w, cc), dicas: [R`<p>Com esse sentido, ${u.ac} pede o ${NC[cc]}.</p>`, R`<p>É o ${NC[cc]} singular de ${DE[w].ac}.</p>`], sol: R`<p>${u.ac} + ${NC[cc]}: <b>${u.ac} ${DE[w].casos[cc][0].join(" ou ")}</b>.</p>` }; } })),
    ];
    const chefao = F.chefao({ titulo: "A mesma mesa, cinco casos",
      enun: R`<p>Com o substantivo ${ru(DE["стол"].ac)} (mesa) e as preposições ${ru("на")}, ${ru("под")}, ${ru("из-за")}, ${ru("вокруг")} e ${ru("по")}: (a) o verbete de на dá ${ru("на стол")} e ${ru("на столе́")}: diga o caso e a pergunta de cada um; (b) faça o mesmo par com под, lembrando que o lugar, com под, não vai no preposicional; (c) o verbete de из-за dá ${ru("встать и́з-за стола́")} ("levantar-se da mesa"): que caso é, e o que isso tem a ver com o par за + instrumental (${ru("за столо́м")}, "à mesa")? (d) escreva "em volta da mesa" e "pela mesa" (по, movimento sobre a superfície); (e) quantos casos diferentes de стол apareceram, e qual ficou de fora? (f) A fonte dá ${ru("Шесть де́лится на три — это два.")} O que quer dizer, e que caso vem depois de на aí?</p>`,
      fig: cart("на · под · из-за · вокруг · по", "+ " + DE["стол"].ac),
      dicas: [R`<p>(b) Lugar com под: instrumental. Destino: acusativo, como sempre.</p>`, R`<p>(c) Estar "atrás de" algo é за + instrumental; sair "de trás de" algo é из-за + genitivo.</p>`],
      sol: R`<p><b>(a)</b> на стол: acusativo, para onde? (para cima da mesa); на столе́: preposicional, onde? (em cima da mesa).</p>
        <p><b>(b)</b> под ${fn("стол", "acc")}: acusativo, para onde?; под ${fn("стол", "ins")}: instrumental, onde?</p>
        <p><b>(c)</b> Genitivo (${fn("стол", "gen")}). Quem está за столо́м (instrumental, lugar) e se levanta sai и́з-за стола́: a preposição de origem é formada com из, que pede genitivo.</p>
        <p><b>(d)</b> вокру́г ${fn("стол", "gen")} (genitivo); по ${fn("стол", "dat")} (dativo; o verbete de по dá "Тарака́н бе́гал по столу́").</p>
        <p><b>(e)</b> Cinco: acusativo, preposicional, instrumental, genitivo e dativo. Só o nominativo ficou de fora (e é o caso que quase nunca vem depois de preposição).</p>
        <p><b>(f)</b> "Seis dividido por três é dois." Depois de на, o acusativo: é o sentido matemático que o verbete marca com "[with accusative]".</p>` });

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Gramática russa</div>
        <div class="q">${ru("в шко́ле", 22)} e ${ru("в шко́лу", 22)}: a mesma preposição, a mesma palavra, uma letra de diferença. Uma quer dizer "na escola"; a outra, "para a escola". Em português quem muda é a preposição. Em russo, o que muda?</div>
        <p>O <b>caso</b>. Toda preposição russa manda no caso do substantivo que vem depois dela; isso se chama regência. A maioria pede um caso só, e basta saber qual. Algumas pedem dois, e aí o caso carrega o sentido: lugar ou destino. Este tema junta as preposições com os seis casos que você já sabe formar.</p></div>
        ${F.chute({ q: "\"на столе́\" é \"em cima da mesa\" (lugar, preposicional). O verbete dá também \"на стол\", no acusativo. O que deve significar?", ops: ["de cima da mesa (origem)", "para cima da mesa (destino)", "embaixo da mesa"], certa: 1, exp: "Destino: com в e на, o acusativo responde a \"para onde?\" e o preposicional, a \"onde?\"." })}`),

      F.secao("laboratorio", "Laboratório: que caso a preposição pede?", R`<p>Aparece a preposição com um sentido. Escolha o caso.</p><div id="lab-caso"></div>`),

      F.secao("casos", "Cada preposição, um caso", R`
        ${F.fig(tabCasos, "As " + preps.length + " preposições deste tema, pelo caso que pedem. Casos: definições do Wiktionary em inglês, cruzadas com as listas de Russian grammar (Wikipedia).")}
        <p>Sentidos das de um caso só:</p>
        <ul>${CS.map((c) => `<li><b>${cap(NC[c])}</b>: ${PR.filter((x) => x.caso === c && unicas.includes(x.p)).map((x) => `${x.ac} (${x.pt})`).join("; ")}.</li>`).join("")}</ul>
        ${F.formula(R`\text{preposição} + \text{substantivo no caso que ela pede}`, "Regência da preposição")}
        ${F.demo("Regra 15: como montar preposição + substantivo", R`<p><b>Afirmação.</b> Dois passos resolvem qualquer expressão com preposição.</p>
          <p><b>Passo a passo.</b> (i) Ache o caso: na tabela, ${ru("без")} está na linha do genitivo. (ii) Ponha o substantivo nesse caso: genitivo de ${ru(DE["вода"].ac)} é ${ru(fn("вода", "gen"))}. (iii) Junte: ${ru("без " + fn("вода", "gen"))}, "sem água" (é o exemplo do próprio verbete: ${exDe("без", "gen")}). (iv) Se a preposição estiver em duas linhas da tabela, o sentido decide, como na próxima seção.</p>`)}
        ${F.caixa("pegadinha", R`<p>A preposição de uma letra se pronuncia grudada na palavra seguinte, e o verbete avisa que ${ru("в")} soa [v] antes de vogal e de consoante sonora, mas [f] antes de consoante surda. A escrita não muda. O que muda na escrita é outra coisa: antes de certos encontros de consoantes aparece ${ru("во")} (o verbete dá ${ru("во вто́рник")}), e ${ru("о")} vira ${ru("об")} antes de vogal.</p>`)}`),

      F.secao("onde", "Onde? Para onde? De onde?", R`
        <p>Segundo a fonte, o acusativo não marca só o objeto direto: marca também o <b>destino</b> de um movimento. Por isso quatro preposições de lugar mudam de caso: ${ru("в")}, ${ru("на")}, ${ru("за")} e ${ru("под")} pedem o acusativo quando indicam movimento para um lugar.</p>
        ${F.fig(tabOnde, "A mesma preposição com dois casos. Exemplos dos verbetes do Wiktionary em inglês.")}
        <p>O lugar vai no preposicional com ${ru("в")} e ${ru("на")}, e no instrumental com ${ru("за")} e ${ru("под")}. A <b>origem</b> tem preposições próprias, todas com genitivo: ${ru("из")} (de dentro de), ${ru("с")} (de cima de) e ${ru("от")} (a partir de, afastando-se). Os exemplos dos verbetes fazem trios: ${ru("на по́чте")}, ${ru("на по́чту")}, ${ru("с по́чты")}: no correio, para o correio, do correio.</p>
        ${F.formula(R`\text{destino: в, на, за, под} + \text{acusativo}\qquad \text{lugar: в, на} + \text{preposicional};\ \ \text{за, под} + \text{instrumental}\qquad \text{origem: из, с, от} + \text{genitivo}`, "Para onde, onde, de onde")}
        <div id="lab-onde"></div>
        ${F.caixa("fisico", R`<p>Aqui não há regra a medir, e sim um dado de dicionário por preposição. O que o site pôde fazer foi cruzar duas fontes: das ${preps.length} preposições do tema, ${RU.PREP_WP} aparecem também nas listas por caso da Wikipedia, e em todas elas as duas fontes têm pelo menos um caso em comum (se não tivessem, o gerador não gravaria). As fontes não são idênticas: o Wiktionary marca casos que as listas da Wikipedia não trazem, e a Wikipedia lista ${ru("за")} também com nominativo, numa expressão fixa.</p>`, "Pense como quem mede")}`),

      F.secao("especiais", "Dois usos que não parecem preposição", R`
        <p><b>"Ter" se diz com у.</b> O russo quase não usa um verbo "ter": diz "junto de mim há". O verbete de ${ru("у")} dá o sentido "na posse de" com o genitivo: ${ter && ter.ex ? ru(ter.ex[0]) : ""} ("Você tem um lápis?") e ${ru("У меня́ нет карандаша́.")} ("Eu não tenho lápis.").</p>
        <p><b>"Dividido por" se diz com на.</b> O verbete de ${ru("на")} marca um sentido matemático, com acusativo: ${div && div.ex ? ru(div.ex[0]) : ""} ("Seis dividido por três é dois.") e ${ru("Пять на два не де́лится")} ("Cinco não é divisível por dois.").</p>
        ${F.caixa("olimpiada", R`<p>Enunciado de matemática e de física é feito de preposições: a mesma ${ru("на")} que põe um corpo "sobre a mesa" faz a divisão, e o verbete de ${ru("под")} traz ${ru("под о́стрым угло́м")}, "sob um ângulo agudo", com instrumental. Ao ler, ache primeiro a preposição e o caso da palavra seguinte: o par diz se aquilo é lugar, destino, origem, meio ou tempo, mesmo antes de você saber o substantivo. Aqui não há nenhuma questão real de prova.</p>`)}
        ${F.caixa("ponte", R`<p>Regência não é só de preposição: verbos também pedem casos. Um quadro completo da regência dos verbos ficou fora deste tema porque a coleta só trouxe a regência escrita para dois verbos; o site não completa de memória. E uma curiosidade do verbete de ${ru("в")}: num sentido raro ("entrar para o grupo dos...", ${ru("идти́ в го́сти")}, "ir de visita"), ela vem com nominativo, um dos dois únicos ambientes em que uma preposição russa faz isso.</p>`)}`),

      F.secao("escrever", "Escreva depois da preposição", R`<p>Aparecem a preposição, com o sentido, e o substantivo no nominativo. Escreva o substantivo no caso certo. (Os pares são combinações montadas pelo site; as formas vêm da tabela de cada substantivo.)</p><div id="lab-escreve"></div>`),

      F.secao("mapa", "Mapa mental das preposições", R`<p>As preposições por caso. Use "esconder e lembrar" até conseguir dizer as cinco listas.</p><div id="lab-mapa"></div>`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) {
    let e = document.getElementById("lab-caso"); e.outerHTML = F.lab("Que caso esta preposição pede?", "lab-caso"); SIM.ruPrepCaso(document.getElementById("lab-caso"), F);
    e = document.getElementById("lab-onde"); e.outerHTML = F.lab("Onde? Para onde? De onde?", "lab-onde"); SIM.ruOnde(document.getElementById("lab-onde"), F);
    e = document.getElementById("lab-escreve"); e.outerHTML = F.lab("Escreva a palavra no caso pedido", "lab-escreve"); SIM.ruEscreveCaso(document.getElementById("lab-escreve"), F, { itens: SIM.RU.PARES_PREP });
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa mental: as preposições por caso", "lab-mapa"); SIM.ruMapaPrepLab(document.getElementById("lab-mapa"), F);
  },
});
