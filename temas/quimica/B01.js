/* Química B01 · Partículas fundamentais e íons. Conferido em Python:
   massas: próton 1,6726e−27 kg; nêutron 1,6749e−27 kg; elétron 9,109e−31 kg; m_p/m_e = 1836; carga elementar 1,602e−19 C;
   fração da massa do carbono-12 que está nos elétrons: 6·9,109e−31/(12·1,6605e−27) = 0,027%;
   escala: átomo ~1e−10 m, núcleo ~1e−15 m (razão 1e5): átomo de 200 m → núcleo de 2 mm;
   raio nuclear r = 1,2 fm·A^(1/3): Fe-56 4,6 fm; Au-197 7,0 fm; densidade nuclear 1,66e−27/(4/3·π·(1,2e−15)³) = 2,3e17 kg/m³ (1 cm³ ≈ 2,3e8 t);
   chefão: X³⁺ com 23 elétrons e 30 nêutrons → Z = 26 (Fe), A = 56; Y²⁻ com 18 elétrons e 16 nêutrons → Z = 16 (S), A = 32;
   pessoa de 70 kg só com matéria nuclear: 70/2,3e17 = 3,0e−16 m³ → cubo de 6,7e−6 m (6,7 µm). */
F.registrar("quimica/B01", {
  retoma: ["A04", "A06"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const SIMB = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn".split(" ");
    /* átomo esquemático: núcleo com rótulo e camadas com e elétrons distribuídos em 2, 8, 8, 2 */
    const atomo = (x, y, rotNucleo, e, rot = "") => { let s = `<circle cx="${x}" cy="${y}" r="15" style="fill:color-mix(in srgb,var(--bad) 45%,transparent);stroke:var(--bad);stroke-width:2"/>` + D.txt(x, y + 4, rotNucleo, "tx2", "middle", 'style="fill:var(--ink);font-size:11px"'); let r = e; [2, 8, 8, 2].forEach((c, i) => { const k = Math.min(c, r); r -= k; if (!k) return; const R0 = 28 + i * 14; s += `<circle cx="${x}" cy="${y}" r="${R0}" style="fill:none;stroke:var(--line2)"/>`; for (let j = 0; j < k; j++) { const a = (j / k) * 6.283 + i * 0.6; s += `<circle cx="${(x + R0 * Math.cos(a)).toFixed(1)}" cy="${(y + R0 * Math.sin(a)).toFixed(1)}" r="3.6" style="fill:var(--mA)"/>`; } }); return s + (rot ? D.txt(x, y + 92, rot, "tx2") : ""); };
    /* notação: A em cima, Z embaixo, símbolo, carga */
    const nota = (x, y, A, Z, s, carga = "", t = 44) => D.txt(x, y, s, "tx", "middle", `style="font-size:${t}px;font-weight:700"`) + D.txt(x - t * 0.36 * s.length - 4, y - t * 0.55, String(A), "tx", "end", `style="font-size:${t * 0.4}px"`) + D.txt(x - t * 0.36 * s.length - 4, y + 2, String(Z), "tx", "end", `style="font-size:${t * 0.4}px"`) + (carga ? D.txt(x + t * 0.36 * s.length + 4, y - t * 0.55, carga, "tx", "start", `style="font-size:${t * 0.4}px"`) : "");
    const tab = (x, y, larg, linhas) => linhas.map((l, i) => l.map((c, j) => D.txt(x + larg.slice(0, j).reduce((a, b) => a + b, 0) + larg[j] / 2, y + i * 22, c, "tx2", "middle", i ? "" : 'style="font-weight:700;fill:var(--ink)"')).join("")).join("") + `<line x1="${x}" x2="${x + larg.reduce((a, b) => a + b, 0)}" y1="${y + 7}" y2="${y + 7}" style="stroke:var(--ink3)"/>`;
    const cg = (c) => (c === 0 ? "" : (Math.abs(c) === 1 ? "" : Math.abs(c)) + (c > 0 ? "+" : "−"));
    const estadio = fig(`<ellipse cx="280" cy="85" rx="230" ry="68" style="fill:color-mix(in srgb,var(--ok) 12%,transparent);stroke:var(--ink3);stroke-width:2"/><ellipse cx="280" cy="85" rx="150" ry="40" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/><circle cx="280" cy="85" r="2.5" style="fill:var(--bad)"/>` + D.seta(330, 40, 286, 80, "var(--bad)", 1.4) + D.txt(336, 36, "núcleo: uma bolinha de 2 mm", "tx2", "start") + D.txt(280, 166, "átomo ampliado até o tamanho de um estádio de 200 m", "tx2"), 175);

    const ESP = [["Na", 11, 23, 0], ["Al", 13, 27, 3], ["O", 8, 16, -2], ["Cl", 17, 35, -1], ["Ca", 20, 40, 2], ["Fe", 26, 56, 3], ["S", 16, 32, -2], ["K", 19, 39, 1], ["F", 9, 19, -1], ["Mg", 12, 24, 2]];
    const exemplos = F.exemplo({
      titulo: "Contando partículas",
      casos: [
        { nome: "Fácil: prótons, nêutrons e elétrons", gerar: (p) => {
          const [s, Z, A, c] = p ? ESP[1] : F.escolha(ESP);
          return { enun: R`<p>Quantos prótons, nêutrons e elétrons tem a espécie representada na figura?</p>`, fig: fig(nota(280, 100, A, Z, s, cg(c), 64), 140),
            passos: [R`<p>(i) O número de baixo é o <b>número atômico</b>: $Z = ${Z}$, o número de <b>prótons</b>. É ele que diz que o elemento é ${s}.</p>`,
              R`<p>(ii) O número de cima é o <b>número de massa</b>: $A = ${A}$, prótons mais nêutrons. Então os <b>nêutrons</b> são $N = A - Z = ${A} - ${Z} = ${A - Z}$.</p>`,
              R`<p>(iii) Elétrons: ${c === 0 ? R`não há carga indicada, o átomo é neutro: elétrons $=$ prótons $= ${Z}$.` : c > 0 ? R`a carga $${cg(c).replace("−", "-")}$ diz que faltam ${c} elétron${c > 1 ? "s" : ""}: $${Z} - ${c} = ${Z - c}$.` : R`a carga $${cg(c).replace("−", "-")}$ diz que há ${-c} elétron${c < -1 ? "s" : ""} a mais: $${Z} + ${-c} = ${Z - c}$.`}</p>`,
              R`<p>(iv) Resposta: ${Z} prótons, ${A - Z} nêutrons e ${Z - c} elétrons. Repare que a carga só mexe nos elétrons: o núcleo de um íon é igual ao do átomo neutro.</p>`] };
        } },
        { nome: "Médio: quem tem os mesmos elétrons?", gerar: (p) => {
          const alvo = p ? 10 : F.escolha([10, 18]), L = alvo === 10 ? [["N", 7, -3], ["O", 8, -2], ["F", 9, -1], ["Ne", 10, 0], ["Na", 11, 1], ["Mg", 12, 2], ["Al", 13, 3]] : [["P", 15, -3], ["S", 16, -2], ["Cl", 17, -1], ["Ar", 18, 0], ["K", 19, 1], ["Ca", 20, 2], ["Sc", 21, 3]], esc = p ? [1, 3, 4, 6] : F.escolha([[0, 2, 4, 5], [1, 3, 5, 6], [0, 1, 4, 6]]), intruso = alvo === 10 ? ["Cl", 17, -1] : ["Na", 11, 1];
          const lista = [...esc.map((i) => L[i]), intruso];
          return { enun: R`<p>Entre as espécies ${lista.map((e) => `$\\ce{${e[0]}${e[2] === 0 ? "" : "^{" + cg(e[2]).replace("−", "-") + "}"}}$`).join(", ")}, quais são <b>isoeletrônicas</b> (têm o mesmo número de elétrons)? Qual não pertence ao grupo?</p>`, fig: fig(tab(110, 30, [110, 110, 110], [["espécie", "Z", "elétrons"], ...lista.map((e) => [e[0] + cg(e[2]), String(e[1]), "?"])]), 160),
            passos: [R`<p>(i) Elétrons de cada espécie $= Z - \text{carga}$ (carga negativa soma elétrons).</p>`,
              R`<p>(ii) ${lista.map((e) => `${e[0]}${cg(e[2])}: $${e[1]} ${e[2] > 0 ? "- " + e[2] : e[2] < 0 ? "+ " + -e[2] : ""} = ${e[1] - e[2]}$`).join("; ")}.</p>`,
              R`<p>(iii) Têm ${alvo} elétrons: ${esc.map((i) => L[i][0] + cg(L[i][2])).join(", ")}. São isoeletrônicas entre si (e com o gás nobre ${alvo === 10 ? "neônio" : "argônio"}). O intruso é ${intruso[0]}${cg(intruso[2])}, com ${intruso[1] - intruso[2]} elétrons.</p>`,
              R`<p>(iv) Mesmos elétrons não quer dizer mesma espécie: os núcleos são diferentes. Entre isoeletrônicos, quem tem mais prótons puxa a mesma nuvem com mais força e fica <b>menor</b> ${F.ret("B07")}.</p>`] };
        } },
        { nome: "Olimpíada: o tamanho do vazio", gerar: (p) => {
          const L = p ? 200 : F.escolha([200, 100, 400]), n = (L / 1e5) * 1000;
          return { enun: R`<p>Um átomo tem cerca de $10^{-10}$ m de diâmetro e o seu núcleo, cerca de $10^{-15}$ m. (a) Se o átomo fosse ampliado até ter o diâmetro de um estádio de ${L} m, que diâmetro teria o núcleo? (b) Que fração do <b>volume</b> do átomo o núcleo ocupa? (c) Onde está a massa?</p>`, fig: estadio,
            passos: [R`<p>(i) Razão entre os diâmetros: $\frac{10^{-10}}{10^{-15}} = 10^{5}$. O átomo é cem mil vezes maior que o núcleo.</p>`,
              R`<p>(ii) Mesma razão na ampliação: $\frac{${L}\text{ m}}{10^{5}} = ${F.n(L / 1e5, 4)}$ m $= ${F.n(n)}$ mm. Um grão de areia no meio do campo.</p>`,
              R`<p>(iii) Volume vai com o cubo do diâmetro: $\left(10^{-5}\right)^3 = 10^{-15}$. O núcleo ocupa um milionésimo de bilionésimo do átomo. O resto é a região dos elétrons, quase vazia.</p>`,
              R`<p>(iv) E mesmo assim o núcleo tem mais de 99,9% da massa, porque cada próton ou nêutron pesa cerca de 1836 vezes um elétron. A matéria é quase toda espaço vazio, com a massa concentrada em pontinhos: foi essa a surpresa da experiência de Rutherford ${F.ret("B03")}.</p>`] };
        } },
      ],
    });

    const chefao = F.chefao({
      titulo: "Dois íons sem nome e um cubo impossível",
      enun: R`<p>Use só o que este tema ensinou (e a lista dos 30 primeiros elementos, na figura).</p>
        <p>(a) O íon $\ce{X^{3+}}$ tem 23 elétrons e 30 nêutrons. Ache $Z$, $A$ e o elemento. (b) O íon $\ce{Y^{2-}}$ é isoeletrônico do argônio ($Z = 18$) e tem número de nêutrons igual ao de prótons. Ache $Z$, $A$ e o elemento. (c) Quantos elétrons, no total, existem numa unidade formada por dois íons $\ce{X^{3+}}$ e três íons $\ce{Y^{2-}}$? Qual a carga total dessa unidade? (d) O raio de um núcleo é bem descrito por $r = 1{,}2\cdot A^{1/3}$ fm (1 fm $= 10^{-15}$ m). Calcule o raio do núcleo de X. (e) Tomando a massa de cada próton ou nêutron como $1{,}66\times10^{-27}$ kg, mostre que a densidade de <b>qualquer</b> núcleo é a mesma, e calcule-a. (f) Se toda a matéria de uma pessoa de 70 kg fosse comprimida até a densidade nuclear, que aresta teria o cubo resultante? Compare com a espessura de um fio de cabelo (uns 70 µm).</p>`,
      fig: fig(tab(20, 26, Array(10).fill(52), [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String), SIMB.slice(0, 10), [11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(String), SIMB.slice(10, 20), [21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(String), SIMB.slice(20, 30)]).replace(/font-weight:700;fill:var\(--ink\)/, "fill:var(--ink2)"), 150),
      dicas: [R`<p>(a) e (b): elétrons $= Z - \text{carga}$. Isole $Z$ com cuidado no sinal.</p>`,
        R`<p>(e) Volume da esfera: $\frac43\pi r^3$. Substitua $r = 1{,}2\,A^{1/3}$ fm: o que acontece com o $A$ quando você eleva ao cubo e divide a massa pelo volume?</p>`,
        R`<p>(f) Volume = massa ÷ densidade; aresta = raiz cúbica do volume.</p>`],
      sol: R`<p><b>(a)</b> $Z - 3 = 23 \Rightarrow Z = 26$: ferro. $A = Z + N = 26 + 30 = 56$. É o $\ce{^{56}_{26}Fe^{3+}}$.</p>
        <p><b>(b)</b> 18 elétrons com carga $2-$: $Z + 2 = 18 \Rightarrow Z = 16$: enxofre. $N = 16$, $A = 32$. É o $\ce{^{32}_{16}S^{2-}}$.</p>
        <p><b>(c)</b> Elétrons: $2\cdot23 + 3\cdot18 = 46 + 54 = 100$. Carga: $2\cdot(+3) + 3\cdot(-2) = 0$. A unidade é neutra: é a proporção em que esses íons se juntam, $\ce{Fe2S3}$ ${F.ret("C01")}.</p>
        <p><b>(d)</b> $r = 1{,}2\cdot56^{1/3} = 1{,}2\cdot3{,}83 = 4{,}6$ fm.</p>
        <p><b>(e)</b> Massa do núcleo: $m = A\cdot1{,}66\times10^{-27}$ kg. Volume: $V = \frac43\pi r^3 = \frac43\pi(1{,}2\times10^{-15})^3 A$, porque $(A^{1/3})^3 = A$. Na divisão, o $A$ cancela: $\rho = \frac{1{,}66\times10^{-27}}{\frac43\pi(1{,}2\times10^{-15})^3} = \frac{1{,}66\times10^{-27}}{7{,}24\times10^{-45}} \approx 2{,}3\times10^{17}$ kg/m³, para qualquer núcleo. (É o mesmo raciocínio de "razão de duas extensivas é intensiva" ${F.ret("A02")}: massa e volume crescem os dois com $A$.) Um centímetro cúbico disso pesaria 230 milhões de toneladas.</p>
        <p><b>(f)</b> $V = \frac{70}{2{,}3\times10^{17}} = 3{,}0\times10^{-16}$ m³. Aresta: $\sqrt[3]{3{,}0\times10^{-16}} = 6{,}7\times10^{-6}$ m $= 6{,}7$ µm, dez vezes mais fina que um fio de cabelo. Você é, em volume, quase todo vazio. Matéria assim existe: é a das estrelas de nêutrons ${F.ret("fisica/C21")}. Contas conferidas em Python.</p>`,
    });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Quantos <b>nêutrons</b> tem o átomo da figura?</p>`, fig: fig(nota(280, 100, 23, 11, "Na", "", 64), 140), num: { v: 12, un: "nêutrons" }, dicas: [R`<p>$N = A - Z$.</p>`], resp: "12 nêutrons", sol: R`<p>$23 - 11 = 12$ nêutrons (e 11 prótons e 11 elétrons, porque é neutro).</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>O que define a qual elemento químico um átomo pertence?</p>`, fig: fig(atomo(170, 80, "6 p, 6 n", 6) + atomo(390, 80, "6 p, 8 n", 6) + D.txt(280, 166, "os dois são carbono", "tx2"), 175), alts: ["O número de nêutrons.", "O número de massa.", "O número de elétrons.", "O número de prótons.", "A massa do átomo."], certa: "D", dicas: [R`<p>Na figura, o que os dois átomos têm de igual e continua igual mesmo se viram íons?</p>`], resp: "D", sol: R`<p>O número de prótons, $Z$. Nêutrons variam (isótopos ${F.ret("B02")}) e elétrons variam (íons) sem mudar o elemento.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Quantos <b>elétrons</b> tem o íon da figura?</p>`, fig: fig(nota(280, 100, 27, 13, "Al", "3+", 64), 140), num: { v: 10, un: "elétrons" }, dicas: [R`<p>Carga positiva: faltam elétrons.</p>`], resp: "10", sol: R`<p>$13 - 3 = 10$ elétrons. Os 13 prótons e os 14 nêutrons não mudaram.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Um átomo neutro que <b>ganha</b> dois elétrons torna-se:</p>`, fig: fig(atomo(170, 80, "8 p", 8) + D.seta(240, 80, 310, 80, "var(--mA)") + D.txt(275, 68, "+ 2 e⁻", "tx2") + atomo(390, 80, "8 p", 10), 170), alts: ["um cátion de carga 2+.", "um ânion de carga 2−.", "outro elemento.", "um isótopo mais pesado.", "um átomo com mais prótons."], certa: "B", dicas: [R`<p>O elétron tem carga negativa.</p>`], resp: "B", sol: R`<p>Dois elétrons a mais que prótons: carga $2-$, um ânion ($\ce{O^{2-}}$). O elemento é o mesmo, porque o núcleo não mudou.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Sobre as três partículas do átomo, é correto afirmar:</p>`, fig: fig(tab(100, 34, [120, 120, 120], [["partícula", "carga", "massa relativa"], ["próton", "+1", "1"], ["nêutron", "0", "1"], ["elétron", "−1", "1/1836"]]), 130), alts: ["prótons e elétrons têm a mesma massa.", "o nêutron tem carga negativa.", "quase toda a massa do átomo está nos elétrons.", "prótons e nêutrons têm massas quase iguais, e o elétron é quase 2000 vezes mais leve.", "o núcleo contém prótons e elétrons."], certa: "D", dicas: [R`<p>Leia a tabela da figura.</p>`], resp: "D", sol: R`<p>Próton e nêutron: massa relativa 1 cada (o nêutron é um pouquinho mais pesado). Elétron: $\frac{1}{1836}$. No núcleo ficam só prótons e nêutrons.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Um átomo neutro tem 17 prótons e 18 nêutrons. Qual o seu número de massa?</p>`, fig: fig(atomo(280, 80, "17 p, 18 n", 17), 170), num: { v: 35, un: "" }, dicas: [R`<p>$A = Z + N$.</p>`], resp: "35", sol: R`<p>$A = 17 + 18 = 35$. É o cloro-35.</p>` }),
      F.exercicio({ n: 7, nivel: "Máximo", enun: R`<p>O íon $\ce{X^{2+}}$ tem 18 elétrons e 20 nêutrons. Qual o número de massa de X?</p>`, fig: fig(nota(280, 100, "?", "?", "X", "2+", 64), 140), num: { v: 40, un: "" }, dicas: [R`<p>Primeiro ache $Z$: o cátion 2+ perdeu dois elétrons.</p>`, R`<p>$Z = 18 + 2$; depois $A = Z + N$.</p>`], resp: "40", sol: R`<p>$Z = 18 + 2 = 20$ (cálcio). $A = 20 + 20 = 40$.</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>Qual das espécies <b>não</b> é isoeletrônica das outras?</p>`, fig: fig(tab(130, 30, [100, 100, 100], [["espécie", "Z", "carga"], ["O²⁻", "8", "2−"], ["F⁻", "9", "1−"], ["Na⁺", "11", "1+"], ["Mg²⁺", "12", "2+"], ["Cl⁻", "17", "1−"]]), 160), alts: ["O²⁻", "F⁻", "Na⁺", "Mg²⁺", "Cl⁻"], certa: "E", dicas: [R`<p>Elétrons $= Z - \text{carga}$, com o sinal da carga.</p>`], resp: "E", sol: R`<p>$8 + 2 = 9 + 1 = 11 - 1 = 12 - 2 = 10$ elétrons. O $\ce{Cl-}$ tem $17 + 1 = 18$.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Se um átomo fosse ampliado até ter 200 m de diâmetro, o núcleo teria, aproximadamente, quantos milímetros? (átomo: $10^{-10}$ m; núcleo: $10^{-15}$ m)</p>`, fig: estadio, num: { v: 2, tol: 0.05, un: "mm" }, dicas: [R`<p>A razão entre os tamanhos é $10^5$.</p>`], resp: "2 mm", sol: R`<p>$\frac{200\text{ m}}{10^5} = 2\times10^{-3}$ m $= 2$ mm.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>No carbono-12 (6 prótons, 6 nêutrons, 6 elétrons), que porcentagem da massa do átomo está nos elétrons? Use massa do elétron $= \frac{1}{1836}$ da massa de um próton ou nêutron.</p>`, fig: fig(atomo(280, 80, "6 p, 6 n", 6), 170), num: { v: 0.0272, tol: 0.03, un: "%" }, dicas: [R`<p>Em unidades da massa do próton: núcleo 12; elétrons $\frac{6}{1836}$.</p>`], resp: "≈ 0,027%", sol: R`<p>$\frac{6/1836}{12 + 6/1836} = \frac{0{,}00327}{12{,}003} = 0{,}00027 = 0{,}027\%$. Mais de 99,97% da massa está no núcleo.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Um íon tem 26 prótons, 30 nêutrons e 24 elétrons. A representação correta é:</p>`, fig: fig(atomo(280, 80, "26 p, 30 n", 20) + D.txt(280, 166, "24 elétrons no total (a figura mostra só os 20 primeiros)", "tx2"), 175), alts: [R`$\ce{^{56}_{26}Fe^{2+}}$`, R`$\ce{^{30}_{26}Fe^{2+}}$`, R`$\ce{^{56}_{26}Fe^{2-}}$`, R`$\ce{^{56}_{24}Cr}$`, R`$\ce{^{50}_{26}Fe^{2+}}$`], certa: "A", dicas: [R`<p>Em cima vai $A = Z + N$; embaixo, $Z$; a carga é $Z$ menos elétrons.</p>`], resp: "A", sol: R`<p>$A = 26 + 30 = 56$; $Z = 26$ (ferro); carga $26 - 24 = +2$. <b>D</b> erra ao usar os elétrons para escolher o elemento: quem escolhe é o número de prótons.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Pela fórmula $r = 1{,}2\cdot A^{1/3}$ fm, o núcleo de um átomo com $A = 64$ tem raio de quantos femtômetros?</p>`, fig: fig(`<circle cx="280" cy="80" r="46" style="fill:color-mix(in srgb,var(--bad) 35%,transparent);stroke:var(--bad);stroke-width:2"/>` + D.seta(280, 80, 326, 80, "var(--ink)", 1.6) + D.txt(300, 72, "r", "txm") + D.txt(280, 150, "A = 64", "tx2"), 165), num: { v: 4.8, tol: 0.02, un: "fm" }, dicas: [R`<p>$64^{1/3} = 4$, porque $4^3 = 64$.</p>`], resp: "4,8 fm", sol: R`<p>$r = 1{,}2\cdot4 = 4{,}8$ fm. Um núcleo com 8 vezes mais partículas ($A = 64$ contra $A = 8$) tem só o dobro do raio: o volume é que cresce com $A$.</p>` }),
    ];

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Atomística · do que os átomos são feitos</div>
        <div class="q">Amplie um átomo até ele ficar do tamanho de um estádio de futebol. De que tamanho fica o núcleo, e onde está a massa?</div>
        <p>O núcleo vira um grão de areia no centro do gramado, e quase toda a massa do estádio está nesse grão. O resto, das arquibancadas até a bola, é a região onde os elétrons se movem. A química inteira acontece nessa região; a identidade do átomo está no grão.</p></div>
        ${F.chute({ q: "um átomo de sódio perde um elétron e vira o íon Na⁺. O que mudou no núcleo dele?", ops: ["Perdeu um próton.", "Ganhou um próton.", "Nada: o núcleo é o mesmo.", "Perdeu um nêutron."], certa: 2, exp: "Nada. Ficar com carga positiva não é ganhar próton, é perder elétron. Em toda reação química, os núcleos ficam intactos: só os elétrons mudam de dono. É por isso que o sódio continua sendo sódio, com os mesmos 11 prótons." })}`),

      F.secao("particulas", "As três partículas", R`
        <p>Para a química, o átomo é feito de três tipos de partícula:</p>
        <table class="tb"><tr><th>Partícula</th><th>Onde fica</th><th>Carga relativa</th><th>Massa relativa</th><th>Massa (kg)</th></tr>
          <tr><td><b>próton</b> (p)</td><td>núcleo</td><td>+1</td><td>1</td><td>$1{,}673\times10^{-27}$</td></tr>
          <tr><td><b>nêutron</b> (n)</td><td>núcleo</td><td>0</td><td>1</td><td>$1{,}675\times10^{-27}$</td></tr>
          <tr><td><b>elétron</b> (e⁻)</td><td>eletrosfera</td><td>−1</td><td>$\frac{1}{1836}$</td><td>$9{,}109\times10^{-31}$</td></tr></table>
        <p>A carga do próton e a do elétron têm exatamente o mesmo valor, com sinais opostos: a <b>carga elementar</b>, $e = 1{,}602\times10^{-19}$ C ${F.ret("fisica/C01")}. Por isso um átomo com o mesmo número de prótons e de elétrons é neutro. A massa de um próton ou de um nêutron é perto de 1 <b>u</b>, a unidade de massa atômica ($1{,}66\times10^{-27}$ kg), que será definida com cuidado no próximo tema ${F.ret("B02")}.</p>
        ${F.fig(estadio, "A escala do átomo: o núcleo é cerca de cem mil vezes menor que o átomo.")}
        ${F.caixa("pegadinha", R`<p><b>O desenho do átomo mente em duas coisas.</b> Nenhuma figura de livro (nem as deste site) está em escala: se o núcleo tivesse 1 cm no papel, os elétrons estariam a 1 km. E os elétrons não giram em órbitas como planetas; as "camadas" desenhadas como círculos são um jeito de organizar a contagem, que o modelo atual substitui por orbitais ${F.ret("B04")}.</p>`)}`),

      F.secao("numeros", "Número atômico, número de massa e a notação", R`
        <table class="tb"><tr><th>Símbolo</th><th>Nome</th><th>O que conta</th><th>O que decide</th></tr>
          <tr><td>$Z$</td><td>número atômico</td><td>prótons</td><td>o <b>elemento</b></td></tr>
          <tr><td>$N$</td><td>número de nêutrons</td><td>nêutrons</td><td>qual isótopo do elemento</td></tr>
          <tr><td>$A$</td><td>número de massa</td><td>prótons + nêutrons</td><td>a massa aproximada, em u</td></tr></table>
        ${F.formula(R`A = Z + N\qquad\qquad {}^{A}_{Z}\mathrm{X}^{\text{carga}}`, "Número de massa e notação de uma espécie")}
        ${F.fig(fig(nota(150, 100, 23, 11, "Na", "", 56) + D.txt(60, 76, "A = 23 →", "tx2", "end") + D.txt(60, 112, "Z = 11 →", "tx2", "end") + nota(400, 100, 27, 13, "Al", "3+", 56) + D.txt(470, 70, "← carga", "tx2", "start"), 140), "Em cima e à esquerda, o número de massa; embaixo, o número atômico; em cima e à direita, a carga (quando houver).")}
        <p>Como $Z$ e o símbolo dizem a mesma coisa (todo sódio tem $Z = 11$), é comum escrever só $\ce{^{23}Na}$, ou "sódio-23". O número de massa é sempre <b>inteiro</b>: é uma contagem de partículas, não uma massa medida.</p>
        <h3>Teorema 1: três contas resolvem qualquer espécie</h3>
        ${F.demo("prótons, nêutrons e elétrons a partir da notação", R`<p>(i) <b>Prótons</b> $= Z$ (o número de baixo, ou o que a tabela periódica dá para aquele símbolo).</p>
          <p>(ii) <b>Nêutrons</b> $= A - Z$. O número de massa conta as partículas do núcleo; tirando os prótons, sobram os nêutrons.</p>
          <p>(iii) <b>Elétrons</b> $= Z - \text{carga}$, com o sinal da carga. Neutro: $Z$. Cátion $3+$: $Z - 3$. Ânion $2-$: $Z - (-2) = Z + 2$.</p>
          <p>(iv) Exemplo: $\ce{^{27}_{13}Al^{3+}}$ tem 13 prótons, $27 - 13 = 14$ nêutrons e $13 - 3 = 10$ elétrons. $\ce{^{16}_{8}O^{2-}}$ tem 8 prótons, 8 nêutrons e $8 + 2 = 10$ elétrons.</p>`)}
        ${F.formula(R`\text{prótons} = Z\qquad \text{nêutrons} = A - Z\qquad \text{elétrons} = Z - \text{carga}`, "Contagem das partículas")}
        <div id="lab-atomo"></div>`),

      F.secao("ions", "Íons e espécies isoeletrônicas", R`
        <p>Um <b>íon</b> é um átomo (ou grupo de átomos) com carga, por ter perdido ou ganhado <b>elétrons</b>. Nunca prótons: mexer no núcleo é assunto de reação nuclear ${F.ret("B08")}, não de química.</p>
        <table class="tb"><tr><th></th><th>Cátion</th><th>Ânion</th></tr>
          <tr><td><b>carga</b></td><td>positiva</td><td>negativa</td></tr>
          <tr><td><b>como se forma</b></td><td>o átomo <b>perde</b> elétrons</td><td>o átomo <b>ganha</b> elétrons</td></tr>
          <tr><td><b>elétrons × prótons</b></td><td>menos elétrons que prótons</td><td>mais elétrons que prótons</td></tr>
          <tr><td><b>quem costuma formar</b></td><td>metais: $\ce{Na+}$, $\ce{Ca^{2+}}$, $\ce{Al^{3+}}$</td><td>ametais: $\ce{Cl-}$, $\ce{O^{2-}}$, $\ce{N^{3-}}$</td></tr>
          <tr><td><b>tamanho</b></td><td>menor que o átomo neutro</td><td>maior que o átomo neutro</td></tr></table>
        ${F.fig(fig(atomo(110, 76, "11 p", 11, "Na: 11 e⁻") + D.seta(176, 76, 216, 76, "var(--bad)", 1.6) + atomo(280, 76, "11 p", 10, "Na⁺: 10 e⁻") + atomo(450, 76, "10 p", 10, "Ne: 10 e⁻"), 180), "O sódio perde um elétron e fica com 10, como o neônio. Mas continua sódio: o núcleo tem 11 prótons.")}
        <p>Espécies com o mesmo número de elétrons são <b>isoeletrônicas</b>: $\ce{N^{3-}}$, $\ce{O^{2-}}$, $\ce{F-}$, $\ce{Ne}$, $\ce{Na+}$, $\ce{Mg^{2+}}$ e $\ce{Al^{3+}}$ têm todas 10 elétrons. Elas têm a mesma arrumação de elétrons e núcleos diferentes.</p>
        ${F.caixa("fisico", R`<p><b>Núcleo é identidade, elétron é comportamento.</b> Diante de qualquer espécie, faça duas perguntas separadas. "Quem é?": conte os prótons. "Como vai se comportar?": olhe os elétrons, principalmente os de fora. O $\ce{Na+}$ e o $\ce{Ne}$ têm os mesmos 10 elétrons e por isso são ambos pouco reativos, mas um é um íon que se dissolve na água do mar e o outro é um gás nobre. Misturar as duas perguntas é a origem de quase todo erro em atomística.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Carga positiva não é "ganhou próton".</b> $\ce{Ca^{2+}}$ tem os mesmos 20 prótons do cálcio e <b>dois elétrons a menos</b> (18). O erro clássico é somar a carga em vez de subtrair: elétrons $= Z - \text{carga}$, então $20 - 2 = 18$, e para o $\ce{S^{2-}}$, $16 - (-2) = 18$. Se estiver em dúvida, pense na carga total: prótons positivos menos elétrons negativos tem de dar a carga do íon.</p>`)}`),

      F.secao("escala", "Massa e tamanho: os números do átomo", R`
        <h3>Teorema 2: a massa está no núcleo</h3>
        ${F.demo("carbono-12", R`<p>(i) Em unidades da massa do próton: 6 prótons e 6 nêutrons somam 12. Os 6 elétrons somam $\frac{6}{1836} = 0{,}0033$.</p>
          <p>(ii) Fração da massa nos elétrons: $\frac{0{,}0033}{12 + 0{,}0033} = 0{,}00027 = 0{,}027\%$.</p>
          <p>(iii) Logo, 99,97% da massa do átomo está no núcleo. É por isso que o número de massa $A$, que só conta prótons e nêutrons, já dá a massa do átomo em u com boa aproximação.</p>
          <p>(iv) E é por isso que um íon tem praticamente a mesma massa do átomo neutro: ganhar ou perder elétrons muda a carga, e quase nada da massa.</p>`)}
        <h3>Teorema 3: todo núcleo tem a mesma densidade</h3>
        ${F.demo("o raio cresce com a raiz cúbica de A", R`<p>(i) Medidas de espalhamento mostram que o raio dos núcleos segue $r = 1{,}2\cdot A^{1/3}$ fm (1 fm $= 10^{-15}$ m).</p>
          <p>(ii) Volume: $V = \frac43\pi r^3 = \frac43\pi(1{,}2\text{ fm})^3\cdot A$. O volume é proporcional a $A$: cada próton ou nêutron ocupa o mesmo espaço, como bolinhas num saco.</p>
          <p>(iii) Massa: $m \approx A\cdot1{,}66\times10^{-27}$ kg. Também proporcional a $A$.</p>
          <p>(iv) Densidade: $\rho = \frac mV = \frac{1{,}66\times10^{-27}}{\frac43\pi(1{,}2\times10^{-15})^3} \approx 2{,}3\times10^{17}$ kg/m³. O $A$ cancelou: vale para o hidrogênio e para o urânio.</p>
          <p>(v) Compare com a água, $10^{3}$ kg/m³: a matéria nuclear é $10^{14}$ vezes mais densa. A matéria comum é leve porque é quase toda vazio.</p>`)}
        ${F.formula(R`r_\text{núcleo} = 1{,}2\cdot A^{1/3}\ \text{fm}\qquad\qquad \rho_\text{nuclear} \approx 2{,}3\times10^{17}\ \text{kg/m}^3`, "Tamanho e densidade do núcleo")}
        ${F.caixa("pegadinha", R`<p>Este tema não tem prática de laboratório: prótons, nêutrons e elétrons não se manipulam em bancada escolar. O que você pode fazer em casa sem risco é a experiência de eletrização (pente no cabelo seco atraindo papel picado), que mostra elétrons mudando de dono. Fontes radioativas e tubos de alta tensão, que aparecem na história destas descobertas, são material de laboratório de pesquisa.</p>`, "Segurança e descarte")}
        ${F.caixa("olimpiada", R`<p><b>Como isso é cobrado.</b> A questão típica dá duas ou três espécies em notação $\ce{^{A}_{Z}X^{q}}$ e pede prótons, nêutrons e elétrons, ou faz o caminho inverso: "o íon $\ce{X^{2+}}$ tem 18 elétrons e 20 nêutrons; qual é o número de massa?". A variação mais difícil junta relações com incógnitas ($A = 2Z + 1$, "isoeletrônico de", "mesmo número de nêutrons que") num sistema de equações, que reaparece com isótopos, isóbaros e isótonos ${F.ret("B02")}. O erro que mais custa ponto é o sinal na conta dos elétrons de um íon.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, as três partículas deixam de ser o fim da história: prótons e nêutrons são feitos de <b>quarks</b> (dois "up" e um "down" no próton; um "up" e dois "down" no nêutron), presos pela força forte ${F.ret("fisica/C21")}. O elétron, até onde se sabe, não tem partes. E a massa do núcleo é um pouco <b>menor</b> que a soma das massas dos seus prótons e nêutrons: a diferença é a energia de ligação nuclear, via $E = mc^2$ ${F.ret("fisica/C19")}.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-atomo"); e.outerHTML = F.lab("Monte o átomo: prótons, nêutrons e elétrons", "lab-atomo"); SIM.atomo(document.getElementById("lab-atomo"), F); },
});
