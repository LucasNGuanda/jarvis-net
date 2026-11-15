/* Química B08 · Radioatividade e química nuclear. Conferido em Python:
   leis: α: Z − 2, A − 4; β⁻: Z + 1, A igual; γ: nada muda;
   séries: U-238 → Pb-206: α = (238 − 206)/4 = 8; β = 82 − (92 − 16) = 6; Th-232 → Pb-208: 6 α e 4 β; U-235 → Pb-207: 7 α e 4 β; A mod 4 se conserva (2; 0; 3);
   meia-vida: N = N₀·(1/2)^(t/T); I-131 (8 dias): 80 mg em 40 dias → 2,5 mg; 100 mg em 24 dias → 12,5 mg; Cs-137 (30 anos): 90 anos → 1/8; Tc-99m (6 h): 24 h → 1/16;
   C-14 (5730 anos): 25% → 11 460 anos; 12,5% → 17 190 anos; 20% → 5730·log₂5 = 13 305 anos; 10% → 19 035 anos; 30% → 9953 anos;
   atividade 800 → 100 Bq em 30 min: 3 meias-vidas, T = 10 min;
   fissão: ²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n (236 = 141 + 92 + 3; 92 = 56 + 36); fusão: ²H + ³H → ⁴He + n; transmutação: ¹⁴N + ⁴He → ¹⁷O + ¹H;
   defeito de massa do He-4: 2·1,00728 + 2·1,00866 − 4,00151 = 0,03037 u → 28,3 MeV (931,5 MeV por u);
   fissão de 1 g de U-235 (200 MeV por núcleo): 8,2e10 J ≈ 20 toneladas de TNT; 1 kg: 8,2e13 J = 2,7e6 kg de carvão a 3,0e7 J/kg;
   chefão: U-238 com T = 4,47e9 anos: Pb/U = 1 → 4,47e9 anos; Pb/U = 3 → 8,94e9; Pb/U = 0,5 → 4,47e9·log₂1,5 = 2,61e9 anos. */
F.registrar("quimica/B08", {
  retoma: ["B01", "B02"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const SIMB = SIM.ELEM.simb, NOME = SIM.ELEM.nome;
    const nota = (x, y, A, Z, s, t = 30) => D.txt(x, y, s, "tx", "middle", `style="font-size:${t}px;font-weight:700"`) + D.txt(x - t * 0.36 * s.length - 3, y - t * 0.55, String(A), "tx", "end", `style="font-size:${t * 0.45}px"`) + D.txt(x - t * 0.36 * s.length - 3, y + 2, String(Z), "tx", "end", `style="font-size:${t * 0.45}px"`);
    /* equação nuclear desenhada: pai → filho + partícula; "?" esconde */
    const equacao = (pai, filho, part, o = {}) => fig(nota(130, 90, pai[1], pai[0], SIMB[pai[0] - 1]) + D.seta(190, 80, 260, 80, "var(--ink2)") + (o.semFilho ? nota(330, 90, "?", "?", "X") : nota(330, 90, filho[1], filho[0], SIMB[filho[0] - 1])) + D.txt(390, 88, "+", "tx") + (o.semPart ? D.txt(450, 90, "?", "tx", "middle", 'style="font-size:30px;font-weight:700"') : part === "a" ? nota(450, 90, 4, 2, "α") : nota(450, 90, 0, "−1", "β")), 140);
    /* poder de penetração */
    const penetra = fig(`<rect x="200" y="20" width="6" height="120" style="fill:var(--ink)"/><rect x="320" y="20" width="14" height="120" style="fill:var(--ink3)"/><rect x="440" y="20" width="40" height="120" style="fill:var(--ink2)"/>` + D.txt(203, 156, "papel", "tx2") + D.txt(327, 156, "alumínio", "tx2") + D.txt(460, 156, "chumbo", "tx2") + D.seta(60, 45, 196, 45, "var(--bad)", 2.2) + D.txt(50, 49, "α", "tx", "end") + D.seta(60, 80, 316, 80, "var(--mA)", 2.2) + D.txt(50, 84, "β", "tx", "end") + `<path d="M60 115 q8 -10 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" style="fill:none;stroke:var(--warn);stroke-width:2"/>` + D.txt(50, 119, "γ", "tx", "end") + D.txt(520, 119, "enfraquece", "tx2", "middle", 'style="font-size:11px"'), 170);
    /* curva de decaimento: T em unidades do eixo; marca pontos nas meias-vidas */
    const curva = (T, un, n = 4, extra = "", ymax = 100, rotY = "% restante", mudo = false) => D.svg(560, 210, D.graf({ x0: 70, y0: 180, w: 420, h: 140, xmax: T * (n + 0.4), ymin: 0, ymax: ymax * 1.1, xlab: "t (" + un + ")", ylab: rotY, xt: mudo ? [] : Array.from({ length: n + 1 }, (_, i) => +(i * T).toFixed(2)), yt: mudo ? [ymax] : [ymax / 8, ymax / 4, ymax / 2, ymax], curvas: [{ pts: D.amostra((t) => ymax * Math.pow(0.5, t / T), 0, T * (n + 0.3)), cor: "var(--mod)" }], pontos: mudo ? [[0, ymax]] : Array.from({ length: n + 1 }, (_, i) => [i * T, ymax * Math.pow(0.5, i)]) }) + extra, "gráfico"); /* mudo: sem as marcas que entregariam a resposta */
    const tab = (x, y, larg, linhas) => linhas.map((l, i) => l.map((c, j) => D.txt(x + larg.slice(0, j).reduce((a, b) => a + b, 0) + larg[j] / 2, y + i * 22, c, "tx2", "middle", i ? "" : 'style="font-weight:700;fill:var(--ink)"')).join("")).join("") + `<line x1="${x}" x2="${x + larg.reduce((a, b) => a + b, 0)}" y1="${y + 7}" y2="${y + 7}" style="stroke:var(--ink3)"/>`;
    const bolas = (n, vivos, x0 = 70, y0 = 30, o = {}) => Array.from({ length: n }, (_, i) => `<circle cx="${x0 + (i % (o.cols || 16)) * (o.p || 27)}" cy="${y0 + Math.floor(i / (o.cols || 16)) * (o.p || 27)}" r="${o.r || 10}" style="fill:${i < vivos ? "var(--bad)" : "color-mix(in srgb,var(--ink) 18%,transparent)"};stroke:var(--bg)"/>`).join("");
    const fissao = fig(`<circle cx="60" cy="80" r="5" style="fill:var(--ink3)"/>` + D.seta(70, 80, 130, 80, "var(--ink2)", 1.6) + `<circle cx="170" cy="80" r="30" style="fill:color-mix(in srgb,var(--bad) 40%,transparent);stroke:var(--bad);stroke-width:2"/>` + D.txt(170, 85, "²³⁵U", "tx2", "middle", 'style="fill:var(--ink);font-weight:700"') + D.seta(210, 80, 270, 80, "var(--ink2)", 1.6) + `<circle cx="330" cy="50" r="22" style="fill:color-mix(in srgb,var(--mA) 40%,transparent);stroke:var(--mA);stroke-width:2"/><circle cx="330" cy="116" r="18" style="fill:color-mix(in srgb,var(--ok) 40%,transparent);stroke:var(--ok);stroke-width:2"/>` + D.txt(330, 55, "¹⁴¹Ba", "tx2", "middle", 'style="fill:var(--ink);font-size:11px"') + D.txt(330, 120, "⁹²Kr", "tx2", "middle", 'style="fill:var(--ink);font-size:11px"') + [[420, 40], [440, 84], [420, 130]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" style="fill:var(--ink3)"/>` + D.seta(x + 8, y, x + 50, y + (y - 84) * 0.4, "var(--ink2)", 1.3)).join("") + D.txt(60, 104, "nêutron", "tx2") + D.txt(490, 156, "3 nêutrons + energia", "tx2"), 170);

    const EQ = [[[92, 238], "a"], [[90, 234], "b"], [[6, 14], "b"], [[88, 226], "a"], [[53, 131], "b"], [[84, 210], "a"]];
    const filho = ([Z, A], t) => (t === "a" ? [Z - 2, A - 4] : [Z + 1, A]);
    const MV = [["iodo-131", 8, "dias", 80, "mg", 40], ["césio-137", 30, "anos", 16, "g", 90], ["tecnécio-99m", 6, "horas", 40, "mg", 24], ["iodo-131", 8, "dias", 100, "mg", 24]];
    const exemplos = F.exemplo({
      titulo: "Equações nucleares e meia-vida",
      casos: [
        { nome: "Fácil: completar a equação", gerar: (p) => {
          const [pai, t] = p ? EQ[0] : F.escolha(EQ), f = filho(pai, t);
          return { enun: R`<p>O ${NOME[pai[0] - 1]}-${pai[1]} emite uma partícula ${t === "a" ? "alfa" : "beta"}. Qual é o núcleo formado?</p>`, fig: equacao(pai, f, t, { semFilho: true }),
            passos: [R`<p>(i) Numa equação nuclear, conservam-se a <b>soma dos números de massa</b> (em cima) e a <b>soma das cargas</b> (embaixo).</p>`,
              R`<p>(ii) A partícula ${t === "a" ? R`alfa é um núcleo de hélio, $\ce{^{4}_{2}\alpha}$` : R`beta é um elétron que sai do núcleo, $\ce{^{0}_{-1}\beta}$`}.</p>`,
              R`<p>(iii) Em cima: $${pai[1]} = A + ${t === "a" ? 4 : 0} \Rightarrow A = ${f[1]}$. Embaixo: $${pai[0]} = Z ${t === "a" ? "+ 2" : "- 1"} \Rightarrow Z = ${f[0]}$.</p>`,
              R`<p>(iv) $Z = ${f[0]}$ é o ${NOME[f[0] - 1]}: forma-se $\ce{^{${f[1]}}_{${f[0]}}${SIMB[f[0] - 1]}}$. ${t === "a" ? "A emissão alfa recua duas casas na tabela periódica." : "Na emissão beta um nêutron vira próton: o elemento avança uma casa, e a massa não muda (os dois núcleos são isóbaros)."}</p>`] };
        } },
        { nome: "Médio: quanto sobra depois de algumas meias-vidas", gerar: (p) => {
          const [nome, T, un, m0, um, t] = p ? MV[0] : F.escolha(MV), n = t / T, m = m0 * Math.pow(0.5, n);
          return { enun: R`<p>O ${nome} tem meia-vida de ${T} ${un}. De uma amostra com ${m0} ${um}, quanto resta depois de ${t} ${un}?</p>`, fig: curva(T, un, n, "", m0, um, true),
            passos: [R`<p>(i) Meia-vida é o tempo para a quantidade cair à <b>metade</b>, seja qual for a quantidade inicial.</p>`,
              R`<p>(ii) Número de meias-vidas decorridas: $n = \frac{t}{T} = \frac{${t}}{${T}} = ${n}$.</p>`,
              R`<p>(iii) Divida por 2 a cada meia-vida: ${Array.from({ length: n + 1 }, (_, i) => F.nt(m0 * Math.pow(0.5, i))).join(" → ")} ${um}.</p>`,
              R`<p>(iv) Pela fórmula: $m = m_0\left(\frac12\right)^n = ${m0}\cdot\frac{1}{${Math.pow(2, n)}} = ${F.n(m)}$ ${um}. O resto não desapareceu: virou outro elemento. A massa total da amostra quase não muda.</p>`] };
        } },
        { nome: "Olimpíada: a idade de um osso", gerar: (p) => {
          const f = p ? 20 : F.escolha([20, 10, 30, 25]), t = 5730 * Math.log2(100 / f);
          return { enun: R`<p>Um osso encontrado numa escavação tem ${f}% do carbono-14 que tem um ser vivo. A meia-vida do carbono-14 é 5730 anos. Qual a idade do osso?</p>`, fig: curva(5730, "anos", 4, ""),
            passos: [R`<p>(i) Lei do decaimento: $\frac{N}{N_0} = \left(\frac12\right)^{t/T}$, com $\frac{N}{N_0} = ${F.n(f / 100)}$.</p>`,
              R`<p>(ii) Estimativa sem conta: 25% seriam 2 meias-vidas e 12,5% seriam 3. ${f > 25 ? "Com " + f + "% passou um pouco menos de 2: menos de 11 460 anos." : f === 25 ? "São exatamente 2." : "Com " + f + "% passou entre 2 e 3" + (f < 12.5 ? " (um pouco mais de 3)" : "") + "."}</p>`,
              R`<p>(iii) Invertendo: $2^{t/T} = \frac{1}{${F.n(f / 100)}} = ${F.n(100 / f, 3)}$, logo $\frac tT = \log_2 ${F.n(100 / f, 3)} = \frac{\log ${F.n(100 / f, 3)}}{\log 2} = ${F.n(Math.log2(100 / f), 3)}$.</p>`,
              R`<p>(iv) $t = ${F.n(Math.log2(100 / f), 3)}\cdot5730 \approx ${F.n(Math.round(t / 10) * 10)}$ anos. O método vale até uns 50 mil anos (umas nove meias-vidas); depois, sobra carbono-14 de menos para medir.</p>`] };
        } },
      ],
    });

    const chefao = F.chefao({
      titulo: "O relógio de urânio",
      enun: R`<p>O urânio-238 ($Z = 92$) decai, por uma longa série de emissões alfa e beta, até um isótopo estável do chumbo ($Z = 82$). A meia-vida do urânio-238 é $4{,}47\times10^9$ anos, muito maior que a de todos os intermediários, de modo que, na prática, cada átomo de urânio que decai vira um átomo de chumbo.</p>
        <p>(a) Mostre que, em qualquer série de emissões alfa e beta, o resto da divisão do número de massa por 4 não muda. Use isso para decidir qual dos isótopos estáveis, $\ce{^{206}Pb}$, $\ce{^{207}Pb}$ ou $\ce{^{208}Pb}$, é o fim da série do urânio-238. (b) Quantas emissões alfa e quantas beta há na série? (c) Faça o mesmo para o tório-232 ($Z = 90$) e para o urânio-235. (d) Um cristal de zircão, ao se formar, aprisiona urânio e nenhum chumbo. Hoje ele tem um átomo de $\ce{^{206}Pb}$ para cada átomo de $\ce{^{238}U}$. Qual a idade do cristal? (e) Outro cristal tem um átomo de chumbo para cada dois de urânio. Qual a idade dele? (f) A fissão completa de 1,0 kg de urânio-235 libera $8{,}2\times10^{13}$ J. Quantos quilos de carvão (que libera $3{,}0\times10^7$ J por quilo) dão a mesma energia? De onde vem essa energia?</p>`,
      fig: curva(4.47, "bilhões de anos", 3, "", 100, "% de ²³⁸U"),
      dicas: [R`<p>(a) A alfa tira 4 do número de massa; a beta não tira nada. O que acontece com o resto da divisão por 4?</p>`,
        R`<p>(b) Primeiro as alfas, pelo número de massa. Depois veja quanto Z teria caído só com elas e corrija com as betas.</p>`,
        R`<p>(d) e (e): se há $x$ átomos de chumbo para cada átomo de urânio, o urânio que resta é a fração $\frac{1}{1 + x}$ do inicial.</p>`],
      sol: R`<p><b>(a)</b> Alfa: $A \to A - 4$, o resto da divisão por 4 fica igual. Beta: $A$ não muda. Logo o resto é o mesmo do começo ao fim. $238 = 4\cdot59 + 2$: resto 2. Dos três isótopos, só $206 = 4\cdot51 + 2$ tem resto 2. A série termina no <b>chumbo-206</b>.</p>
        <p><b>(b)</b> Alfas: $\frac{238 - 206}{4} = $ <b>8</b>. Só com elas, $Z$ cairia para $92 - 16 = 76$. O chumbo tem $Z = 82$: faltam 6, e cada beta sobe 1. <b>6 betas</b>.</p>
        <p><b>(c)</b> Tório-232: resto 0, termina em $\ce{^{208}Pb}$; alfas $\frac{232 - 208}{4} = 6$; $Z$ cairia a $90 - 12 = 78$; betas: $82 - 78 = 4$. Urânio-235: resto 3, termina em $\ce{^{207}Pb}$; alfas $\frac{235 - 207}{4} = 7$; $Z$ cairia a 78; betas: 4. São as três séries radioativas naturais, cada uma com o seu chumbo.</p>
        <p><b>(d)</b> Um chumbo para cada urânio: metade do urânio original decaiu. Passou exatamente uma meia-vida: <b>4,47 bilhões de anos</b>, perto da idade da Terra. Foi assim que ela foi medida.</p>
        <p><b>(e)</b> Para cada 2 átomos de urânio há 1 de chumbo: havia 3, restam 2. $\frac{N}{N_0} = \frac23 = \left(\frac12\right)^{t/T} \Rightarrow \frac tT = \log_2\frac32 = 0{,}585$. $t = 0{,}585\cdot4{,}47\times10^9 = $ <b>2,6 bilhões de anos</b>.</p>
        <p><b>(f)</b> $\frac{8{,}2\times10^{13}}{3{,}0\times10^7} = 2{,}7\times10^6$ kg: <b>2700 toneladas de carvão</b> para cada quilo de urânio-235. A energia vem da massa: os produtos da fissão pesam um pouco menos que o urânio e o nêutron que entraram, e a diferença (cerca de um milésimo da massa) aparece como energia, $E = mc^2$. Numa reação química, mexe-se só nos elétrons de fora, e a variação de massa é um bilhão de vezes menor ${F.ret("A01")}. Contas conferidas em Python.</p>`,
    });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>A partícula alfa é:</p>`, fig: fig(nota(280, 96, 4, 2, "α", 56), 130), alts: ["um elétron.", "um núcleo de hélio: 2 prótons e 2 nêutrons.", "um nêutron.", "uma onda eletromagnética.", "um próton."], certa: "B", dicas: [R`<p>Leia os números da notação: massa 4, carga 2.</p>`], resp: "B", sol: R`<p>$\ce{^{4}_{2}\alpha}$: dois prótons e dois nêutrons, carga $+2$. A beta é um elétron; a gama, uma onda eletromagnética.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Das três radiações, a de <b>maior</b> poder de penetração é a:</p>`, fig: penetra, alts: ["alfa.", "beta.", "gama.", "as três penetram igual.", "nenhuma atravessa o papel."], certa: "C", dicas: [R`<p>Qual delas passa pelo papel e pelo alumínio?</p>`], resp: "C", sol: R`<p>Gama: sem carga e sem massa, interage pouco com a matéria e só é atenuada por chumbo ou concreto espessos. A alfa, pesada e com carga $+2$, é parada por uma folha de papel ou pela pele.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Qual o número de massa do núcleo formado quando o rádio-226 emite uma partícula alfa?</p>`, fig: equacao([88, 226], [86, 222], "a", { semFilho: true }), num: { v: 222, un: "" }, dicas: [R`<p>A alfa leva 4 unidades de massa.</p>`], resp: "222 (radônio-222)", sol: R`<p>$226 - 4 = 222$, com $Z = 88 - 2 = 86$: radônio-222, um gás radioativo.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Quando um núcleo emite uma partícula <b>beta</b>, o seu número atômico:</p>`, fig: equacao([6, 14], [7, 14], "b"), alts: ["diminui 2.", "diminui 1.", "não muda.", "aumenta 1.", "aumenta 2."], certa: "D", dicas: [R`<p>No núcleo, um nêutron vira um próton e sai um elétron.</p>`], resp: "D", sol: R`<p>$Z$ aumenta 1 e $A$ fica igual: $\ce{^{14}_{6}C -> ^{14}_{7}N + ^{0}_{-1}\beta}$. O carbono vira nitrogênio.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Uma amostra tem 64 núcleos radioativos (bolinhas vermelhas). Quantos restam depois de <b>duas</b> meias-vidas?</p>`, fig: fig(bolas(64, 64), 135), num: { v: 16, un: "núcleos" }, dicas: [R`<p>Metade, e depois metade do que sobrou.</p>`], resp: "16", sol: R`<p>$64 \to 32 \to 16$. Um quarto do inicial. (Com poucos núcleos o número flutua em torno disso: o decaimento é um processo ao acaso.)</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>O iodo-131 tem meia-vida de 8 dias. De 100 mg, quanto resta depois de 24 dias?</p>`, fig: curva(8, "dias", 3, "", 100, "mg", true), num: { v: 12.5, un: "mg" }, dicas: [R`<p>24 dias são quantas meias-vidas?</p>`], resp: "12,5 mg", sol: R`<p>3 meias-vidas: $100 \to 50 \to 25 \to 12{,}5$ mg.</p>` }),
      F.exercicio({ n: 7, nivel: "Máximo", enun: R`<p>Na série do tório-232 ($Z = 90$) até o chumbo-208 ($Z = 82$), quantas partículas <b>alfa</b> são emitidas?</p>`, fig: fig(nota(160, 90, 232, 90, "Th") + D.seta(220, 80, 320, 80, "var(--ink2)") + D.txt(270, 68, "? α e ? β", "tx2") + nota(400, 90, 208, 82, "Pb"), 140), num: { v: 6, un: "α" }, dicas: [R`<p>Só a alfa muda o número de massa.</p>`], resp: "6", sol: R`<p>$\frac{232 - 208}{4} = 6$ alfas.</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>Na mesma série (tório-232 a chumbo-208, com 6 alfas), quantas partículas <b>beta</b> são emitidas?</p>`, fig: fig(nota(160, 90, 232, 90, "Th") + D.seta(220, 80, 320, 80, "var(--ink2)") + D.txt(270, 68, "6 α e ? β", "tx2") + nota(400, 90, 208, 82, "Pb"), 140), num: { v: 4, un: "β" }, dicas: [R`<p>Com 6 alfas, $Z$ cairia para $90 - 12 = 78$.</p>`], resp: "4", sol: R`<p>De 78 para 82 faltam 4: quatro betas, cada uma subindo $Z$ em 1.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Uma madeira antiga tem 12,5% do carbono-14 de uma árvore viva. Com meia-vida de 5730 anos, qual a idade da madeira?</p>`, fig: curva(5730, "anos", 4, "", 100, "% restante", true), num: { v: 17190, tol: 0.005, un: "anos" }, dicas: [R`<p>$12{,}5\% = \frac18 = \left(\frac12\right)^3$.</p>`], resp: "17 190 anos", sol: R`<p>Três meias-vidas: $3\cdot5730 = 17\,190$ anos.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>A atividade de uma amostra cai de 800 para 100 desintegrações por segundo em 30 minutos. Qual a meia-vida, em minutos?</p>`, fig: curva(10, "min", 3, "", 800, "Bq", true), num: { v: 10, un: "min" }, dicas: [R`<p>$\frac{100}{800} = \frac18$: quantas meias-vidas?</p>`], resp: "10 min", sol: R`<p>$800 \to 400 \to 200 \to 100$: três meias-vidas em 30 min. $T = 10$ min.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Na fissão $\ce{^{235}_{92}U + ^{1}_{0}n -> ^{141}_{56}Ba + ^{A}_{36}Kr + 3 ^{1}_{0}n}$, qual o valor de $A$?</p>`, fig: fissao.replace("⁹²Kr", "?Kr"), num: { v: 92, un: "" }, dicas: [R`<p>A soma dos números de massa é a mesma dos dois lados.</p>`], resp: "92", sol: R`<p>$235 + 1 = 141 + A + 3 \Rightarrow A = 92$. Conferência das cargas: $92 = 56 + 36$.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Em 1919, Rutherford fez a primeira transmutação artificial: $\ce{^{14}_{7}N + ^{4}_{2}\alpha -> X + ^{1}_{1}p}$. O núcleo X é:</p>`, fig: fig(nota(120, 90, 14, 7, "N") + D.txt(180, 88, "+", "tx") + nota(240, 90, 4, 2, "α") + D.seta(290, 80, 350, 80, "var(--ink2)") + nota(410, 90, "?", "?", "X") + D.txt(460, 88, "+", "tx") + nota(510, 90, 1, 1, "p"), 140), alts: [R`$\ce{^{18}_{9}F}$`, R`$\ce{^{17}_{8}O}$`, R`$\ce{^{17}_{9}F}$`, R`$\ce{^{18}_{8}O}$`, R`$\ce{^{16}_{8}O}$`], certa: "B", dicas: [R`<p>Em cima: $14 + 4 = A + 1$. Embaixo: $7 + 2 = Z + 1$.</p>`], resp: "B", sol: R`<p>$A = 17$ e $Z = 8$: oxigênio-17. Nitrogênio virou oxigênio: o sonho dos alquimistas, com a ferramenta errada (eles só tinham química).</p>` }),
    ];

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Atomística · quando o núcleo muda</div>
        <div class="q">Em todas as reações químicas, os átomos saem iguais aos que entraram: o carbono continua carbono. Existe algum processo em que um elemento vira outro?</div>
        <p>Existe, e acontece sozinho dentro de certos núcleos, sem pedir licença à temperatura nem à pressão. É a radioatividade. Ela não é química (os elétrons não mandam aqui), mas foi descoberta por químicos, mudou a tabela periódica e tem uma matemática simples: a de dividir por dois.</p></div>
        ${F.chute({ q: "uma amostra radioativa tem meia-vida de 10 anos. Depois de 20 anos, quanto dela ainda não decaiu?", ops: ["Nada: acabou toda.", "Metade.", "Um quarto.", "Depende da temperatura."], certa: 2, exp: "Um quarto. Em 10 anos cai à metade; nos 10 anos seguintes, cai à metade do que restava. Meia-vida não é 'metade do tempo de vida': a amostra nunca acaba de uma vez, ela vai caindo pela metade a cada período. E nem a temperatura, nem a pressão, nem o composto em que o átomo está mudam esse ritmo." })}`),

      F.secao("emissoes", "As três radiações", R`
        <p>Em 1896, Henri Becquerel percebeu que sais de urânio escureciam chapas fotográficas embrulhadas, sem luz. Marie e Pierre Curie mostraram que a propriedade era do <b>átomo</b> de urânio (não dependia do composto), deram-lhe o nome de <b>radioatividade</b> e descobriram dois elementos novos seguindo a pista: o polônio e o rádio. Núcleos instáveis emitem radiação espontaneamente e se transformam em outros.</p>
        <table class="tb"><tr><th>Radiação</th><th>O que é</th><th>Símbolo</th><th>Carga</th><th>Massa (u)</th><th>É detida por</th></tr>
          <tr><td><b>alfa</b></td><td>núcleo de hélio (2 p + 2 n)</td><td>$\ce{^{4}_{2}\alpha}$</td><td>$+2$</td><td>4</td><td>folha de papel; a pele</td></tr>
          <tr><td><b>beta</b></td><td>elétron emitido pelo núcleo</td><td>$\ce{^{0}_{-1}\beta}$</td><td>$-1$</td><td>≈ 0</td><td>lâmina de alumínio</td></tr>
          <tr><td><b>gama</b></td><td>onda eletromagnética de alta energia</td><td>$\ce{^{0}_{0}\gamma}$</td><td>0</td><td>0</td><td>chumbo ou concreto espessos (atenuam)</td></tr></table>
        ${F.fig(penetra, "Poder de penetração: alfa menor que beta, beta menor que gama. O poder de ionizar a matéria vai ao contrário: a alfa é a que mais ioniza.")}
        <p>A partícula beta não estava no núcleo: ela nasce quando um <b>nêutron se transforma em próton</b>, e o elétron criado é expulso (junto com uma partícula quase sem massa, o antineutrino). A radiação gama costuma acompanhar as outras duas: é o núcleo recém-formado livrando-se do excesso de energia, sem mudar de identidade.</p>
        ${F.caixa("pegadinha", R`<p><b>A beta é um elétron, mas não vem da eletrosfera.</b> O átomo não fica com um elétron a menos em volta: o núcleo é que ganha um próton. E "radiação" não é sinônimo de "contaminação": um objeto <b>irradiado</b> (que recebeu radiação gama, como alimentos e material cirúrgico esterilizados) não se torna radioativo; <b>contaminado</b> é o que carrega em si átomos radioativos.</p>`)}`),

      F.secao("leis", "Equações nucleares", R`
        <p>Numa transformação nuclear não se conserva o elemento, mas conservam-se duas somas: a dos números de <b>massa</b> e a das <b>cargas</b>. Daí saem as duas leis do decaimento (Soddy, Fajans e Russell):</p>
        ${F.formula(R`\ce{^{A}_{Z}X -> ^{A-4}_{Z-2}Y + ^{4}_{2}\alpha}\qquad\qquad \ce{^{A}_{Z}X -> ^{A}_{Z+1}Y + ^{0}_{-1}\beta}`, "Emissão alfa e emissão beta")}
        ${F.fig(equacao([92, 238], [90, 234], "a"), "Emissão alfa: o urânio-238 vira tório-234. Em cima: 238 = 234 + 4. Embaixo: 92 = 90 + 2.")}
        ${F.fig(equacao([6, 14], [7, 14], "b"), "Emissão beta: o carbono-14 vira nitrogênio-14. Em cima: 14 = 14 + 0. Embaixo: 6 = 7 − 1.")}
        <p>Na tabela periódica, a alfa <b>recua duas casas</b> e a beta <b>avança uma</b>. Pai e filho de uma emissão beta têm o mesmo número de massa: são <b>isóbaros</b> ${F.ret("B02")}.</p>
        <h3>Teorema 1: quantas alfas e quantas betas numa série</h3>
        ${F.demo("urânio-238 até chumbo-206", R`<p>(i) Só a alfa muda o número de massa, e muda de 4 em 4. Então o número de alfas sai direto: $n_\alpha = \frac{A_\text{inicial} - A_\text{final}}{4} = \frac{238 - 206}{4} = 8$.</p>
          <p>(ii) Oito alfas derrubam $Z$ em 16: de 92 para 76.</p>
          <p>(iii) O chumbo tem $Z = 82$. A diferença, $82 - 76 = 6$, tem de ser coberta pelas betas, que sobem $Z$ de um em um: $n_\beta = 6$.</p>
          <p>(iv) Em geral: $n_\alpha = \frac{A_i - A_f}{4}$ e $n_\beta = Z_f - (Z_i - 2n_\alpha)$. A ordem das emissões não importa para a contagem.</p>
          <p>(v) Como a alfa tira exatamente 4 e a beta não tira nada, o resto da divisão de $A$ por 4 é o mesmo em todos os núcleos de uma série. Por isso existem só quatro famílias possíveis, e três delas na natureza: a do tório-232 (resto 0, termina no chumbo-208), a do urânio-238 (resto 2, chumbo-206) e a do urânio-235 (resto 3, chumbo-207).</p>`)}
        ${F.formula(R`n_\alpha = \frac{A_i - A_f}{4}\qquad\qquad n_\beta = Z_f - (Z_i - 2\,n_\alpha)`, "Contagem de emissões numa série radioativa")}
        <div id="lab-dec"></div>`),

      F.secao("meiavida", "Meia-vida", R`
        <p>Ninguém sabe quando um núcleo específico vai decair, mas numa multidão de núcleos a estatística é exata: em intervalos de tempo iguais, decai sempre a <b>mesma fração</b>. O intervalo em que decai a metade é a <b>meia-vida</b> ($T$, ou $t_{1/2}$), uma constante de cada isótopo.</p>
        ${F.fig(fig([64, 32, 16, 8].map((v, i) => bolas(64, v, 44 + i * 140, 22, { r: 4.4, p: 12, cols: 8 }) + D.txt(86 + i * 140, 140, ["início: 64", "1 meia-vida: 32", "2 meias-vidas: 16", "3 meias-vidas: 8"][i], "tx2")).join(""), 155), "A cada meia-vida, metade dos núcleos que restavam (vermelhos) se transforma.")}
        <h3>Teorema 2: a lei do decaimento</h3>
        ${F.demo("de dividir por dois à fórmula", R`<p>(i) Comece com $N_0$ núcleos. Depois de uma meia-vida restam $\frac{N_0}{2}$; depois de duas, $\frac{N_0}{4}$; depois de três, $\frac{N_0}{8}$.</p>
          <p>(ii) Depois de $n$ meias-vidas: $N = N_0\left(\frac12\right)^n = \frac{N_0}{2^n}$.</p>
          <p>(iii) O número de meias-vidas decorridas num tempo $t$ é $n = \frac tT$, e não precisa ser inteiro: $N = N_0\left(\frac12\right)^{t/T}$.</p>
          <p>(iv) A mesma lei vale para a massa do isótopo e para a <b>atividade</b> da amostra (desintegrações por segundo, medidas em becquerel, Bq), porque as duas são proporcionais a $N$.</p>
          <p>(v) Invertendo, para achar o tempo: $2^{t/T} = \frac{N_0}{N}$, isto é, $t = T\cdot\log_2\frac{N_0}{N}$. Se a fração restante é $\frac18$, $t = 3T$; se é 20%, $t = T\log_2 5 = 2{,}32\,T$.</p>`)}
        ${F.formula(R`N = N_0\left(\frac12\right)^{t/T}\qquad\qquad t = T\cdot\log_2\frac{N_0}{N}`, "Lei do decaimento radioativo")}
        ${F.fig(curva(1, "meias-vidas", 4, ""), "A curva nunca toca o zero: 100, 50, 25, 12,5, 6,25…")}
        <table class="tb"><tr><th>Isótopo</th><th>Meia-vida</th><th>Uso</th></tr>
          <tr><td>tecnécio-99m</td><td>6 horas</td><td>imagens em medicina nuclear</td></tr>
          <tr><td>iodo-131</td><td>8 dias</td><td>diagnóstico e tratamento da tireoide</td></tr>
          <tr><td>cobalto-60</td><td>5,3 anos</td><td>radioterapia; esterilização</td></tr>
          <tr><td>césio-137</td><td>30 anos</td><td>radioterapia; foi o do acidente de Goiânia (1987)</td></tr>
          <tr><td>carbono-14</td><td>5730 anos</td><td>datação de material orgânico</td></tr>
          <tr><td>urânio-238</td><td>4,47 bilhões de anos</td><td>datação de rochas</td></tr></table>
        <p><b>Datação por carbono-14.</b> Raios cósmicos produzem carbono-14 na atmosfera o tempo todo; os seres vivos o absorvem e mantêm uma proporção fixa enquanto vivem. Quando morrem, a reposição para e o carbono-14 decai. Medindo quanto resta, calcula-se há quanto tempo o organismo morreu.</p>
        ${F.caixa("fisico", R`<p><b>O núcleo não liga para a química.</b> A meia-vida do carbono-14 é a mesma no diamante, no gás carbônico e na madeira; a 20 °C e a 2000 °C; sob 1 atm ou sob mil. Reações químicas mexem em elétrons, com energias de alguns elétron-volts; o núcleo vive em outra escala, de milhões de elétron-volts, e não percebe o que os elétrons fazem. É por isso que não se "neutraliza" lixo radioativo com reagente nenhum: só o tempo resolve.</p>`, "Pense como químico")}`),

      F.secao("energia", "Fissão, fusão e transmutação", R`
        <p>Além do decaimento espontâneo, núcleos podem ser transformados à força. Em 1919, Rutherford bombardeou nitrogênio com partículas alfa e obteve oxigênio: $\ce{^{14}_{7}N + ^{4}_{2}\alpha -> ^{17}_{8}O + ^{1}_{1}p}$, a primeira <b>transmutação artificial</b>. Hoje, todos os elementos depois do urânio são fabricados assim.</p>
        ${F.fig(fissao, "Fissão: um nêutron parte um núcleo de urânio-235 em dois núcleos médios e libera mais nêutrons, que podem partir outros núcleos (reação em cadeia).")}
        <table class="tb"><tr><th></th><th>Fissão</th><th>Fusão</th></tr>
          <tr><td><b>o que é</b></td><td>um núcleo pesado se parte em dois médios</td><td>dois núcleos leves se juntam num maior</td></tr>
          <tr><td><b>exemplo</b></td><td>$\ce{^{235}_{92}U + ^{1}_{0}n -> ^{141}_{56}Ba + ^{92}_{36}Kr + 3 ^{1}_{0}n}$</td><td>$\ce{^{2}_{1}H + ^{3}_{1}H -> ^{4}_{2}He + ^{1}_{0}n}$</td></tr>
          <tr><td><b>onde ocorre</b></td><td>usinas nucleares; bomba atômica</td><td>Sol e estrelas; bomba de hidrogênio; reatores experimentais</td></tr>
          <tr><td><b>condição</b></td><td>nêutrons e massa crítica</td><td>temperaturas de milhões de graus</td></tr></table>
        <p>Nos dois casos, a massa dos produtos é um pouco <b>menor</b> que a dos reagentes, e a diferença aparece como energia: $E = mc^2$ ${F.ret("fisica/C19b")}. É por isso que as energias nucleares são milhões de vezes maiores que as químicas: um grama de urânio-235 fissionado libera $8{,}2\times10^{10}$ J, o mesmo que queimar quase três toneladas de carvão.</p>
        ${F.formula(R`E = \Delta m\,c^2\qquad\qquad 1\ \text{u} \leftrightarrow 931{,}5\ \text{MeV}`, "Defeito de massa e energia")}
        ${F.caixa("pegadinha", R`<p><b>Nenhuma prática com material radioativo, em casa ou na escola.</b> Fontes radioativas só são manipuladas por profissionais treinados, com blindagem, distância, tempo de exposição controlado e dosímetro. Regras para a vida: o símbolo do trifólio (três pás em torno de um círculo) quer dizer "não toque e avise"; objeto metálico desconhecido que brilha no escuro ou vem de aparelho hospitalar <b>nunca</b> é aberto (foi assim o acidente de Goiânia, com uma cápsula de césio-137 tirada de um aparelho abandonado); rejeitos radioativos não vão para lixo nem para ralo, têm destino controlado por órgão federal. A proteção contra radiação tem três palavras: <b>tempo</b> (o mínimo), <b>distância</b> (a máxima) e <b>blindagem</b>.</p>`, "Segurança e descarte")}
        ${F.caixa("olimpiada", R`<p><b>Como isso é cobrado.</b> Três tipos de conta, sempre os mesmos. (1) Completar uma equação nuclear conservando as duas somas (massa em cima, carga embaixo), inclusive com nêutrons e prótons. (2) Contar alfas e betas entre dois núcleos de uma série. (3) Meia-vida: fração restante depois de um número inteiro de meias-vidas, o tempo para chegar a uma fração dada e, em nível de olimpíada, com logaritmo para frações que não são potências de 2. As perguntas conceituais giram em torno do poder de penetração, da diferença entre fissão e fusão, e de aplicações (datação, medicina, energia).</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, a lei do decaimento é escrita com a exponencial natural: de $\frac{dN}{dt} = -\lambda N$ (a taxa de decaimento é proporcional ao número de núcleos) sai $N = N_0e^{-\lambda t}$, com $\lambda = \frac{\ln 2}{T}$ ${F.ret("fisica/C19")}. É a mesma equação diferencial da descarga de um capacitor e de uma reação química de primeira ordem ${F.ret("F05")}. A estabilidade dos núcleos é explicada pela <b>energia de ligação por núcleon</b>, que é máxima perto do ferro-56: núcleos mais leves ganham energia fundindo, e os mais pesados, fissionando.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-dec"); e.outerHTML = F.lab("Caminhe pela série radioativa: α e β até o chumbo", "lab-dec"); SIM.decaimento(document.getElementById("lab-dec"), F); },
});
