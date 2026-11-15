/* Química B06 · Tabela periódica: grupos e períodos. Conferido em Python:
   elementos por período: 2, 8, 8, 18, 18, 32, 32 (acumulado: 2, 10, 18, 36, 54, 86, 118 = números atômicos dos gases nobres);
   localização: Mg (12) 3s²: 3º período, grupo 2; S (16) 3s²3p⁴: 3º, grupo 16; K (19) 4s¹: 4º, grupo 1; Ca (20): 4º, grupo 2; As (33) 4s²3d¹⁰4p³: 4º, grupo 15;
   Br (35): 4º, grupo 17; Fe (26) 4s²3d⁶: 4º, grupo 8; Ti (22) 4s²3d²: grupo 4; Mn (25) 4s²3d⁵: grupo 7; Zn (30) 4s²3d¹⁰: grupo 12; Cu (29) 4s¹3d¹⁰: grupo 11;
   Mendeleiev: média dos quatro vizinhos do germânio (Si 28,09; Sn 118,71; Ga 69,72; As 74,92) = 72,86 (real 72,63; previsto por ele: 72; densidade prevista 5,5, medida 5,35);
   vizinhos do gálio (Al 26,98; In 114,82; Zn 65,38; Ge 72,63) = 69,95 (real 69,72); vizinhos do selênio (S 32,06; Te 127,60; As 74,92; Br 79,90) = 78,62 (real 78,97);
   chefão: Z = 119: 8s¹, 8º período, grupo 1; oitavo período com 8s 5g 6f 7d 8p: 2 + 18 + 14 + 10 + 6 = 50 elementos (Z de 119 a 168). */
F.registrar("quimica/B06", {
  retoma: ["B04", "B01"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const SIMB = SIM.ELEM.simb, NOME = SIM.ELEM.nome, pos = SIM.posTabela, info = SIM.infoElemento;
    /* tabela pequena (células de 26 × 20): cor(Z) → cor ou null (cinza); marca = lista de Z com rótulo */
    const mini = (cor, o = {}) => { const x0 = 46, y0 = 16, cw = 27, ch = 19; let s = ""; for (let Z = 1; Z <= 118; Z++) { const [l, c] = pos(Z), x = x0 + (c - 1) * cw, y = y0 + (l - 1) * ch + (l > 7 ? 6 : 0), k = cor(Z); s += `<rect x="${x}" y="${y}" width="${cw - 2}" height="${ch - 2}" rx="2" style="fill:${k || "color-mix(in srgb,var(--ink) 10%,transparent)"};stroke:var(--bg)"/>` + ((o.rot || []).includes(Z) ? `<text x="${x + (cw - 2) / 2}" y="${y + 13}" text-anchor="middle" style="font:600 10px var(--f-text);fill:#10131a">${o.txt ? o.txt[o.rot.indexOf(Z)] : SIMB[Z - 1]}</text>` : ""); } if (o.eixos !== false) { for (let g = 1; g <= 18; g++) s += D.txt(x0 + (g - 1) * cw + (cw - 2) / 2, y0 - 4, String(g), "tx2", "middle", 'style="font-size:10px"'); for (let p = 1; p <= 7; p++) s += D.txt(x0 - 6, y0 + (p - 1) * ch + 13, String(p), "tx2", "end", 'style="font-size:10px"'); } return fig(s + (o.extra || ""), 200); };
    const CB = { s: "#ef8a80", p: "#f1d36b", d: "#7fb0f5", f: "#8fd6a8" }, CT = { metal: "#7fb0f5", semimetal: "#8fd6a8", ametal: "#f1d36b" };
    const legenda = (pares, x = 130, y = 62, dx = 78) => pares.map(([c, r], j) => `<rect x="${x + j * dx}" y="${y}" width="12" height="12" rx="2" style="fill:${c}"/>` + D.txt(x + 16 + j * dx, y + 10, r, "tx2", "start", 'style="font-size:11px"')).join("");
    const blocos = mini((Z) => CB[info(Z).bloco], { extra: legenda([[CB.s, "bloco s"], [CB.p, "bloco p"], [CB.d, "bloco d"], [CB.f, "bloco f"]], 104, 34, 64) });
    const tipos = mini((Z) => CT[info(Z).tipo], { extra: legenda([[CT.metal, "metais"], [CT.semimetal, "semimetais"], [CT.ametal, "ametais"]], 112, 34, 96) });
    const FAM = { 1: "#ef8a80", 2: "#f5b97a", 16: "#8fd6a8", 17: "#f1d36b", 18: "#c9a6f5" };
    const familias = mini((Z) => (Z === 1 ? null : FAM[info(Z).grupo] || null), { extra: ["1 alcalinos · 2 alcalinoterrosos", "16 calcogênios · 17 halogênios", "18 gases nobres"].map((t, i) => D.txt(235, 30 + i * 14, t, "tx2", "middle", 'style="font-size:10.5px"')).join("") });
    const destaque = (zs, txt) => mini((Z) => (zs.includes(Z) ? "var(--warn)" : null), { rot: zs, txt });
    const sob = (n) => String(n).split("").map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]).join("");
    const ORD = [["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6], ["4s", 2], ["3d", 10], ["4p", 6]];
    const cfg = (Z) => { const oc = {}; let r = Z; ORD.forEach(([s, c]) => { const k = Math.min(c, r); oc[s] = k; r -= k; }); if (Z === 24) { oc["4s"] = 1; oc["3d"] = 5; } if (Z === 29) { oc["4s"] = 1; oc["3d"] = 10; } return oc; };
    const tex = (oc) => ORD.filter(([s]) => oc[s]).map(([s]) => s + "^{" + oc[s] + "}").join("\\,");
    const tab = (x, y, larg, linhas) => linhas.map((l, i) => l.map((c, j) => D.txt(x + larg.slice(0, j).reduce((a, b) => a + b, 0) + larg[j] / 2, y + i * 22, c, "tx2", "middle", i ? "" : 'style="font-weight:700;fill:var(--ink)"')).join("")).join("") + `<line x1="${x}" x2="${x + larg.reduce((a, b) => a + b, 0)}" y1="${y + 7}" y2="${y + 7}" style="stroke:var(--ink3)"/>`;
    const cruz = (c, cima, baixo, esq, dir) => fig(D.bloco(230, 60, 100, 44, "var(--warn)", c) + D.bloco(230, 8, 100, 44, "var(--ink3)", cima) + D.bloco(230, 112, 100, 44, "var(--ink3)", baixo) + D.bloco(122, 60, 100, 44, "var(--ink3)", esq) + D.bloco(338, 60, 100, 44, "var(--ink3)", dir), 165);

    const exemplos = F.exemplo({
      titulo: "Da distribuição à posição",
      casos: [
        { nome: "Fácil: onde mora este elemento?", gerar: (p) => {
          const Z = p ? 16 : F.escolha([12, 16, 19, 35, 20, 33, 13, 17]), oc = cfg(Z), i = info(Z), val = (oc[i.periodo + "s"] || 0) + (oc[i.periodo + "p"] || 0);
          return { enun: R`<p>Um elemento tem número atômico ${Z}. Sem consultar a tabela, diga o período, o grupo e a família dele.</p>`, fig: destaque([Z], ["?"]),
            passos: [R`<p>(i) Distribuição: $${tex(oc)}$.</p>`,
              R`<p>(ii) <b>Período</b> = número da camada mais externa (o maior $n$): ${i.periodo}º período.</p>`,
              R`<p>(iii) A distribuição termina em subnível ${i.bloco}: elemento <b>representativo</b>. Elétrons na camada de valência: ${val}. ${i.bloco === "s" ? `Bloco s: o grupo é esse número, <b>grupo ${i.grupo}</b>.` : `Bloco p: o grupo é $10 + ${val} = ${i.grupo}$, <b>grupo ${i.grupo}</b>.`}</p>`,
              R`<p>(iv) É o ${NOME[Z - 1]} (${SIMB[Z - 1]}): ${i.fam.startsWith("grupo") ? "família do grupo " + i.grupo : i.fam}, ${i.tipo}. O grupo saiu dos elétrons de valência, e é por isso que elementos do mesmo grupo se parecem.</p>`] };
        } },
        { nome: "Médio: um metal de transição", gerar: (p) => {
          const Z = p ? 26 : F.escolha([26, 22, 25, 30, 28, 23]), oc = cfg(Z), g = oc["4s"] + oc["3d"];
          return { enun: R`<p>Localize na tabela o elemento de $Z = ${Z}$ (período e grupo) e diga a que bloco pertence.</p>`, fig: destaque([Z], ["?"]),
            passos: [R`<p>(i) Distribuição: $${tex(oc)}$, ou [Ar] $4s^{${oc["4s"]}}\,3d^{${oc["3d"]}}$.</p>`,
              R`<p>(ii) Período: o maior $n$ é 4 (o do $4s$). 4º período. Cuidado: o subnível mais energético é o $3d$, mas quem dá o período é a camada mais externa.</p>`,
              R`<p>(iii) O subnível mais energético é $d$: <b>bloco d</b>, metal de transição. Para o bloco d, grupo = elétrons do $ns$ + elétrons do $(n - 1)d$: $${oc["4s"]} + ${oc["3d"]} = ${g}$.</p>`,
              R`<p>(iv) 4º período, grupo ${g}: é o ${NOME[Z - 1]} (${SIMB[Z - 1]}). Os dez grupos do bloco d (3 a 12) correspondem aos dez elétrons que cabem no subnível d.</p>`] };
        } },
        { nome: "Olimpíada: prever um elemento, como Mendeleiev", gerar: (p) => {
          const k = p ? 0 : F.escolha([0, 1, 2]), C = [["germânio", "Ge", [["Si", 28.09], ["Sn", 118.71], ["Ga", 69.72], ["As", 74.92]], 72.63, "Em 1871 Mendeleiev previu 72 para o \"eka-silício\"; o germânio foi descoberto em 1886."], ["gálio", "Ga", [["Al", 26.98], ["In", 114.82], ["Zn", 65.38], ["Ge", 72.63]], 69.72, "Era o \"eka-alumínio\" de Mendeleiev, descoberto em 1875, o primeiro acerto da tabela."], ["selênio", "Se", [["S", 32.06], ["Te", 127.6], ["As", 74.92], ["Br", 79.9]], 78.97, "O selênio já era conhecido; o método serve também para conferir massas duvidosas."]][k], m = C[2].reduce((a, v) => a + v[1], 0) / 4;
          return { enun: R`<p>Suponha que o ${C[0]} ainda não tivesse sido descoberto e que só se conhecessem as massas atômicas dos quatro vizinhos da casa vazia: ${C[2].map((v) => v[0] + " " + F.nt(v[1])).join("; ")}. Estime a massa atômica do elemento que falta.</p>`, fig: cruz("?", C[2][0][0] + " " + F.nt(C[2][0][1]), C[2][1][0] + " " + F.nt(C[2][1][1]), C[2][2][0] + " " + F.nt(C[2][2][1]), C[2][3][0] + " " + F.nt(C[2][3][1])),
            passos: [R`<p>(i) A ideia de Mendeleiev: as propriedades variam de modo regular ao longo de um grupo e ao longo de um período. Uma casa vazia deve ter valores intermediários entre os dos vizinhos.</p>`,
              R`<p>(ii) Média dos quatro vizinhos (acima, abaixo, esquerda, direita): $\frac{${C[2].map((v) => F.n(v[1])).join(" + ")}}{4}$.</p>`,
              R`<p>(iii) $= \frac{${F.n(C[2].reduce((a, v) => a + v[1], 0), 2)}}{4} = ${F.n(m, 2)}$ u.</p>`,
              R`<p>(iv) Valor medido: ${F.nt(C[3])} u. O erro da estimativa é de ${F.nt(Math.abs((m - C[3]) / C[3]) * 100, 1)}%. ${C[4]} Uma classificação que acerta previsões não é só uma lista arrumada: é uma lei da natureza.</p>`] };
        } },
      ],
    });

    const chefao = F.chefao({
      titulo: "O elemento 119 e as trocas de Mendeleiev",
      enun: R`<p>(a) Ainda não se fabricou o elemento de número atômico 119. Usando a ordem de preenchimento ($\dots 7s\ 5f\ 6d\ 7p\ 8s \dots$), escreva o final da sua distribuição e diga em que período e grupo ele ficaria, e com que elementos conhecidos deve se parecer. (b) O oganessônio ($Z = 118$) fecha o 7º período. Mostre, somando as capacidades dos subníveis preenchidos em cada período, que os gases nobres têm $Z = 2, 10, 18, 36, 54, 86, 118$. (c) Depois do $8s$, a ordem de Madelung ($n + \ell$) prevê o preenchimento de $5g$, $6f$, $7d$ e $8p$. Um subnível $g$ tem $\ell = 4$. Quantos elementos teria o 8º período? Qual seria o número atômico do gás nobre seguinte? (d) Mendeleiev ordenou os elementos pela massa atômica, mas em três casos pôs o mais pesado <b>antes</b>: argônio (39,95) antes de potássio (39,10), cobalto (58,93) antes de níquel (58,69), telúrio (127,6) antes de iodo (126,9). Que critério ele usou para decidir, e que descoberta posterior mostrou que ele tinha razão? (e) Explique por que o argônio é mais pesado que o potássio, embora tenha um próton a menos.</p>`,
      fig: destaque([18, 19, 27, 28, 52, 53, 118], ["Ar", "K", "Co", "Ni", "Te", "I", "Og"]),
      dicas: [R`<p>(a) Depois do $7p^6$ (que termina no 118), o próximo elétron entra no $8s$.</p>`,
        R`<p>(b) 1º período: só $1s$. 2º: $2s\,2p$. 3º: $3s\,3p$. 4º: $4s\,3d\,4p$. 6º: $6s\,4f\,5d\,6p$. (c) Capacidade de um subnível: $2(2\ell + 1)$.</p>`,
        R`<p>(d) Em que coluna cada elemento "se sente em casa"? (e) Massa atômica é média de isótopos ${F.ret("B02")}.</p>`],
      sol: R`<p><b>(a)</b> $\dots 7p^6\,8s^1$. Camada mais externa: 8, logo <b>8º período</b>. Um elétron s na valência: <b>grupo 1</b>. Ficaria embaixo do frâncio, e deve se parecer com os metais alcalinos (sódio, potássio, césio): metal mole, muito reativo, que forma íon $1+$.</p>
        <p><b>(b)</b> 1º: $1s$ → 2. 2º: $2s\,2p$ → $2 + 6 = 8$. 3º: 8. 4º: $4s\,3d\,4p$ → $2 + 10 + 6 = 18$. 5º: 18. 6º: $6s\,4f\,5d\,6p$ → $2 + 14 + 10 + 6 = 32$. 7º: 32. Acumulando: 2, 10, 18, 36, 54, 86, 118. Cada gás nobre é o último elemento de um período.</p>
        <p><b>(c)</b> Subnível $g$: $2(2\cdot4 + 1) = 18$ elétrons. 8º período: $8s\,5g\,6f\,7d\,8p$ → $2 + 18 + 14 + 10 + 6 = $ <b>50 elementos</b>, de $Z = 119$ a 168. O gás nobre seguinte seria o <b>168</b>. (Para núcleos tão pesados os efeitos relativísticos são grandes, e ninguém garante que a ordem simples continue valendo.)</p>
        <p><b>(d)</b> As <b>propriedades químicas</b>: o argônio é um gás inerte, como os gases nobres; o potássio é um metal que reage com água, como o sódio. O iodo forma os mesmos tipos de composto que o cloro e o bromo; o telúrio, os mesmos que o enxofre. Mendeleiev confiou na periodicidade contra a massa. Em 1913, Moseley mediu os raios X emitidos pelos elementos e mostrou que a ordem correta é a do <b>número atômico</b>: Ar 18, K 19; Co 27, Ni 28; Te 52, I 53. Não havia inversão nenhuma.</p>
        <p><b>(e)</b> A massa atômica é a média ponderada dos isótopos. O argônio da natureza é quase todo $\ce{^{40}Ar}$ (22 nêutrons); o potássio é quase todo $\ce{^{39}K}$ (20 nêutrons). O argônio tem um próton a menos e, na média, dois nêutrons a mais. A massa conta prótons e nêutrons; a química só olha os prótons.</p>`,
    });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Na tabela periódica atual, os elementos estão em ordem crescente de:</p>`, fig: blocos, alts: ["massa atômica.", "número de nêutrons.", "número atômico.", "densidade.", "data de descoberta."], certa: "C", dicas: [R`<p>O que define o elemento?</p>`], resp: "C", sol: R`<p>Número atômico (prótons), desde Moseley (1913). Mendeleiev usava a massa atômica, que quase sempre dá a mesma ordem, mas não sempre.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Elementos de um mesmo <b>grupo</b> (coluna) têm em comum:</p>`, fig: familias, alts: ["o número de camadas.", "a massa atômica.", "o número de elétrons na camada de valência (nos representativos) e, por isso, propriedades químicas parecidas.", "o estado físico.", "o número de nêutrons."], certa: "C", dicas: [R`<p>A química é feita pelos elétrons de fora.</p>`], resp: "C", sol: R`<p>Mesma configuração de valência: Li, Na e K terminam em $ns^1$. O número de camadas é o que os elementos de um mesmo <b>período</b> têm em comum.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>A distribuição de um átomo é $1s^2\,2s^2\,2p^6\,3s^2$. Em que período ele está?</p>`, fig: destaque([12], ["?"]), num: { v: 3, un: "º período" }, dicas: [R`<p>O período é o maior $n$.</p>`], resp: "3º", sol: R`<p>Maior $n = 3$: 3º período. Dois elétrons de valência: grupo 2. É o magnésio.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>O elemento destacado na figura pertence à família dos:</p>`, fig: destaque([17], ["Cl"]), alts: ["metais alcalinos.", "metais alcalinoterrosos.", "calcogênios.", "halogênios.", "gases nobres."], certa: "D", dicas: [R`<p>É a penúltima coluna, o grupo 17.</p>`], resp: "D", sol: R`<p>Grupo 17: halogênios (F, Cl, Br, I, At). Sete elétrons na valência; ganham um com facilidade e formam ânions $1-$.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>A maior parte dos elementos da tabela é formada por:</p>`, fig: tipos, alts: ["ametais.", "gases nobres.", "semimetais.", "metais.", "elementos artificiais."], certa: "D", dicas: [R`<p>Olhe as áreas coloridas.</p>`], resp: "D", sol: R`<p>Metais: tudo à esquerda e no centro, mais o bloco f. Os ametais se concentram no canto superior direito, e os semimetais na fronteira em escada entre os dois.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>A 25 °C e 1 atm, quais são os dois únicos elementos <b>líquidos</b>?</p>`, fig: destaque([35, 80], ["?", "?"]), alts: ["Mercúrio e gálio.", "Bromo e mercúrio.", "Bromo e iodo.", "Césio e mercúrio.", "Água e mercúrio."], certa: "B", dicas: [R`<p>Um é metal (grupo 12), o outro é halogênio.</p>`], resp: "B", sol: R`<p>Bromo (ametal, líquido vermelho que solta vapores) e mercúrio (metal). Gálio e césio fundem logo acima da temperatura ambiente (30 °C e 28 °C), mas a 25 °C são sólidos. Água não é elemento.</p>` }),
      F.exercicio({ n: 7, nivel: "Máximo", enun: R`<p>Um elemento tem $Z = 33$. Qual o seu grupo?</p>`, fig: destaque([33], ["?"]), num: { v: 15, un: "" }, dicas: [R`<p>Distribua: $\dots 4s^2\,3d^{10}\,4p^3$.</p>`, R`<p>Bloco p: grupo = 10 + elétrons de valência.</p>`], resp: "15", sol: R`<p>Valência: $4s^2\,4p^3$, cinco elétrons. Grupo $10 + 5 = 15$ (4º período): arsênio, da família do nitrogênio.</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>O ferro ($Z = 26$) tem distribuição [Ar] $4s^2\,3d^6$. Em que grupo ele está?</p>`, fig: destaque([26], ["?"]), num: { v: 8, un: "" }, dicas: [R`<p>Bloco d: some os elétrons do $4s$ e do $3d$.</p>`], resp: "8", sol: R`<p>$2 + 6 = 8$: grupo 8, 4º período, bloco d.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Quantos elementos tem o 4º período, e por quê?</p>`, fig: blocos, alts: ["8, porque a camada 4 tem 8 elétrons.", "18, porque são preenchidos os subníveis 4s, 3d e 4p.", "32, porque a camada 4 aguenta 32 elétrons.", "18, porque são preenchidos 4s, 4p e 4d.", "10, por causa do subnível d."], certa: "B", dicas: [R`<p>Entre o 3p e o 5s, o diagrama de Pauling tem três subníveis.</p>`], resp: "B", sol: R`<p>$4s$ (2) + $3d$ (10) + $4p$ (6) = 18. A camada 4 aguenta 32, mas o $4d$ e o $4f$ só são preenchidos nos períodos 5 e 6: período não é o mesmo que camada completa.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Estime a massa atômica do germânio pela média das massas dos quatro vizinhos da figura.</p>`, fig: cruz("?", "Si 28,09", "Sn 118,71", "Ga 69,72", "As 74,92"), num: { v: 72.86, tol: 0.005, un: "u" }, dicas: [R`<p>Some os quatro e divida por 4.</p>`], resp: "≈ 72,9 u", sol: R`<p>$\frac{28{,}09 + 118{,}71 + 69{,}72 + 74{,}92}{4} = \frac{291{,}44}{4} = 72{,}86$ u. O valor medido é 72,63.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Um elemento do 3º período forma um íon $2-$ estável. Ele é o:</p>`, fig: destaque([16], ["?"]), alts: ["magnésio.", "alumínio.", "enxofre.", "cloro.", "argônio."], certa: "C", dicas: [R`<p>Ganhar dois elétrons para completar oito: quantos ele tem na valência?</p>`], resp: "C", sol: R`<p>Seis na valência, grupo 16: enxofre, $\ce{S^{2-}}$. O cloro (grupo 17) forma $1-$; o magnésio (grupo 2) <b>perde</b> dois e forma $2+$.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Qual o número atômico do elemento do 5º período que fica logo abaixo do bromo ($Z = 35$)?</p>`, fig: destaque([35, 53], ["Br", "?"]), num: { v: 53, un: "" }, dicas: [R`<p>Quantos elementos tem o 5º período?</p>`], resp: "53", sol: R`<p>Do bromo ao elemento logo abaixo percorre-se um período inteiro, de 18 elementos: $35 + 18 = 53$, o iodo.</p>` }),
    ];

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Atomística · o mapa dos elementos</div>
        <div class="q">Em 1869, Mendeleiev deixou buracos na sua tabela e descreveu elementos que ninguém tinha visto: a massa, a densidade, até a fórmula dos óxidos. Anos depois, eles foram achados, com os valores previstos. Como uma tabela consegue prever?</div>
        <p>Porque ela não é uma lista: é o desenho de uma lei. As propriedades dos elementos se repetem em intervalos regulares, e hoje se sabe por quê: a repetição é a das configurações eletrônicas que você aprendeu a escrever.</p></div>
        ${F.chute({ q: "sódio (Z = 11) e potássio (Z = 19) reagem de modo muito parecido. O que eles têm em comum?", ops: ["A mesma massa.", "O mesmo número de camadas.", "Um elétron na camada de valência.", "O mesmo número de nêutrons."], certa: 2, exp: "Um elétron na valência: 3s¹ e 4s¹. Os dois perdem esse elétron com facilidade e viram íons 1+. É a configuração de fora que manda no comportamento químico, e a tabela foi montada para pôr na mesma coluna quem tem a mesma configuração de fora." })}`),

      F.secao("historia", "De Mendeleiev a Moseley", R`
        <p>No século XIX já se conheciam uns 60 elementos e várias tentativas de arrumá-los: as <b>tríades</b> de Döbereiner (trios de elementos parecidos, com a massa do meio perto da média dos extremos) e a <b>lei das oitavas</b> de Newlands (propriedades que se repetem de oito em oito, como notas musicais). Em 1869, o russo Dmitri Mendeleiev (e, de forma independente, o alemão Lothar Meyer) pôs os elementos em ordem crescente de massa atômica e os alinhou pelas propriedades. Três decisões fizeram a diferença:</p>
        <ul><li>quando a ordem das massas contrariava as propriedades, ele <b>seguiu as propriedades</b> (telúrio antes de iodo);</li>
          <li>quando nenhum elemento conhecido servia numa casa, ele a <b>deixou vazia</b>;</li>
          <li>para as casas vazias, ele <b>previu</b> as propriedades do elemento que faltava.</li></ul>
        <table class="tb"><tr><th>"Eka-silício" (previsão de 1871)</th><th>Germânio (descoberto em 1886)</th></tr>
          <tr><td>massa atômica 72</td><td>72,6</td></tr><tr><td>densidade 5,5 g/cm³</td><td>5,35 g/cm³</td></tr>
          <tr><td>metal cinza</td><td>semimetal cinza-claro</td></tr><tr><td>óxido de fórmula $\ce{XO2}$</td><td>$\ce{GeO2}$</td></tr></table>
        <p>Em 1913, Henry Moseley mostrou, pelos raios X emitidos por cada elemento, que a grandeza que cresce de um em um ao longo da tabela é a carga do núcleo: o <b>número atômico</b>. As "inversões" de Mendeleiev deixaram de ser exceções.</p>
        ${F.formula(R`\text{As propriedades dos elementos são funções periódicas do número atômico } Z`, "Lei periódica (forma atual)")}`),

      F.secao("estrutura", "Como a tabela é organizada", R`
        ${F.fig(blocos, "Os quatro blocos: cada um corresponde ao tipo de subnível que está sendo preenchido.")}
        <table class="tb"><tr><th></th><th>O que é</th><th>O que os elementos têm em comum</th></tr>
          <tr><td><b>período</b> (7 linhas)</td><td>linha horizontal</td><td>o número de camadas com elétrons</td></tr>
          <tr><td><b>grupo</b> ou família (18 colunas)</td><td>coluna vertical</td><td>a configuração da camada de valência; propriedades químicas</td></tr>
          <tr><td><b>bloco</b> (s, p, d, f)</td><td>região</td><td>o tipo do subnível mais energético</td></tr></table>
        <ul><li><b>Elementos representativos</b>: blocos s e p (grupos 1, 2 e 13 a 18). O último elétron entra na camada de valência.</li>
          <li><b>Metais de transição</b>: bloco d (grupos 3 a 12). O último elétron entra no subnível d da <b>penúltima</b> camada.</li>
          <li><b>Transição interna</b>: bloco f (lantanídeos e actinídeos). O último elétron entra no subnível f da <b>antepenúltima</b> camada. Ficam em duas linhas separadas só para a tabela caber no papel: pertencem aos períodos 6 e 7.</li></ul>
        ${F.fig(familias, "As famílias com nome próprio. Os outros grupos representativos levam o nome do primeiro elemento: família do boro (13), do carbono (14), do nitrogênio (15).")}
        <div id="lab-tab"></div>
        <h3>Teorema 1: a distribuição eletrônica dá o endereço</h3>
        ${F.demo("período, bloco e grupo", R`<p>(i) <b>Período</b> = maior valor de $n$ na distribuição (número de camadas ocupadas).</p>
          <p>(ii) <b>Bloco</b> = letra do subnível mais energético (o último da ordem de Pauling).</p>
          <p>(iii) <b>Grupo</b>, bloco s: número de elétrons de valência (1 ou 2). Bloco p: $10 +$ elétrons de valência (os 10 são as colunas do bloco d, puladas). Bloco d: elétrons do $ns$ + elétrons do $(n - 1)d$.</p>
          <p>(iv) Enxofre, $Z = 16$: $1s^2\,2s^2\,2p^6\,3s^2\,3p^4$. Maior $n$: 3. Termina em p. Valência: $2 + 4 = 6$. → 3º período, grupo 16.</p>
          <p>(v) Ferro, $Z = 26$: [Ar] $4s^2\,3d^6$. Maior $n$: 4. Termina em d. $2 + 6 = 8$. → 4º período, grupo 8. O caminho inverso também vale: 3º período e grupo 2 quer dizer $\dots 3s^2$, magnésio.</p>`)}
        ${F.formula(R`\text{período} = n_\text{máx}\qquad \text{grupo} = \begin{cases} e_\text{val} & \text{bloco } s\\ 10 + e_\text{val} & \text{bloco } p\\ e_{ns} + e_{(n-1)d} & \text{bloco } d\end{cases}`, "Localização a partir da distribuição")}
        <h3>Teorema 2: por que os períodos têm 2, 8, 8, 18, 18, 32 e 32 elementos</h3>
        ${F.demo("um período é o que se preenche entre dois subníveis s", R`<p>(i) Cada período começa quando um elétron entra num subnível $ns$ novo (camada nova) e termina quando o $np$ se completa (gás nobre).</p>
          <p>(ii) Pela ordem de Pauling ${F.ret("B04")}, entre um $ns$ e o seguinte são preenchidos: 1º período, só $1s$; 2º, $2s\,2p$; 3º, $3s\,3p$; 4º, $4s\,3d\,4p$; 5º, $5s\,4d\,5p$; 6º, $6s\,4f\,5d\,6p$; 7º, $7s\,5f\,6d\,7p$.</p>
          <p>(iii) Somando as capacidades (s 2, p 6, d 10, f 14): 2; 8; 8; 18; 18; 32; 32.</p>
          <p>(iv) Números atômicos dos gases nobres, somando: 2, 10, 18, 36, 54, 86, 118. O total, 118, é o número de elementos conhecidos: o 7º período está completo.</p>`)}
        ${F.caixa("pegadinha", R`<p><b>Hélio e hidrogênio moram em casas emprestadas.</b> O hélio é $1s^2$ (bloco s) e fica no grupo 18, com os gases nobres, porque se comporta como eles: tem a camada completa. O hidrogênio é $1s^1$ e fica no grupo 1, mas <b>não é metal alcalino</b>: é um ametal gasoso, com química própria. A posição segue a configuração; a família segue o comportamento. E os gases nobres têm 8 elétrons na valência, menos o hélio, que tem 2.</p>`)}`),

      F.secao("classes", "Metais, ametais e estados físicos", R`
        ${F.fig(tipos, "Metais à esquerda e no centro, ametais no alto à direita, semimetais na fronteira.")}
        <table class="tb"><tr><th></th><th>Metais</th><th>Ametais</th></tr>
          <tr><td><b>aparência</b></td><td>brilho metálico</td><td>sem brilho (em geral)</td></tr>
          <tr><td><b>condução de calor e eletricidade</b></td><td>boa</td><td>ruim (exceção: grafite)</td></tr>
          <tr><td><b>mecânica</b></td><td>maleáveis e dúcteis</td><td>quebradiços, quando sólidos</td></tr>
          <tr><td><b>elétrons de valência</b></td><td>poucos (1 a 3): tendem a <b>perder</b></td><td>muitos (4 a 7): tendem a <b>ganhar</b> ou compartilhar</td></tr>
          <tr><td><b>íons</b></td><td>cátions</td><td>ânions</td></tr></table>
        <p>Os <b>semimetais</b> (B, Si, Ge, As, Sb, Te) têm propriedades intermediárias; o silício e o germânio são os semicondutores da eletrônica. Os <b>gases nobres</b> são ametais com a valência completa e quase não reagem. A 25 °C e 1 atm, são <b>gases</b>: H, N, O, F, Cl e os gases nobres; são <b>líquidos</b>: Br e Hg; todos os outros são sólidos.</p>
        ${F.caixa("fisico", R`<p><b>Leia a tabela como um mapa, não como uma lista.</b> Sabendo onde um elemento está, você sabe com quem ele se parece (os de cima e os de baixo), quantos elétrons tem na valência (pelo grupo), quantas camadas (pelo período), se é metal (lado esquerdo) e que íon forma. Um químico diante de um elemento que nunca estudou olha os vizinhos, exatamente como Mendeleiev fez com as casas vazias. Decorar a tabela não é necessário; saber lê-la é.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Só no laboratório da escola, e só o professor:</b> a demonstração clássica de periodicidade, um pedacinho de sódio ou de potássio na água. O metal reage com violência, solta hidrogênio (que pode pegar fogo) e forma uma solução cáustica; o potássio é mais violento que o sódio, e essa é a lição. É feita atrás de um anteparo, com pedaços do tamanho de um grão de arroz, e os metais são guardados em óleo. <b>Nunca em casa</b>, e nunca com "sódio comprado na internet". Mercúrio de termômetro quebrado não se toca nem se aspira: recolhe-se com papel, em pote fechado, e leva-se a um ponto de coleta.</p>`, "Segurança e descarte")}
        ${F.caixa("olimpiada", R`<p><b>Como isso é cobrado.</b> O que mais cai: dar o número atômico e pedir período, grupo e família (ou o inverso: "elemento do 4º período, grupo 15"); reconhecer famílias pelo final da distribuição ($ns^2\,np^5$ é halogênio); classificar em representativo, transição ou transição interna; e as perguntas de história, com Mendeleiev (massa atômica, lacunas e previsões) contra Moseley (número atômico). Em provas russas, a contribuição de Mendeleiev e o caso do eka-silício são cobrados em detalhe. As armadilhas: período de metal de transição (é o do $ns$, não o do $d$) e o grupo no bloco p (somar 10).</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, a tabela deixa de ser um dado e passa a ser um resultado: a periodicidade sai da equação de Schrödinger e do princípio de Pauli ${F.ret("fisica/U06")}. Nos elementos pesados, os elétrons internos andam a uma fração considerável da velocidade da luz, e os <b>efeitos relativísticos</b> ${F.ret("fisica/C18")} mudam as energias dos orbitais: é por isso que o ouro é amarelo e o mercúrio é líquido. Para os superpesados, não se sabe se a química ainda segue a coluna em que a tabela os coloca.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-tab"); e.outerHTML = F.lab("Tabela periódica: clique e leia o endereço", "lab-tab"); SIM.tabela(document.getElementById("lab-tab"), F); },
});
