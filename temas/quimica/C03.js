/* Química C03 · Ligação metálica e ligas. Conferido em Python (N_A = 6,022·10²³):
   densidade pela célula unitária, ρ = Z·M/(N_A·a³): Cu (CFC, a = 361,5 pm, M = 63,55): 8,94 g/cm³; Al (CFC, 405,0 pm, 26,98): 2,70; Fe (CCC, 286,7 pm, 55,85): 7,88;
     Na (CCC, 429,1 pm, 22,99): 0,967; Au (CFC, 407,8 pm, 196,97): 19,29; Ag (CFC, 408,6 pm, 107,87): 10,50;
   raio pela célula: CFC 4r = a√2: Cu 127,8 pm; Au 144,2 pm; CCC 4r = a√3: Fe 124,1 pm;
   fator de empacotamento: CFC π/(3√2) = 0,7405; CCC π√3/8 = 0,6802;
   elétrons livres, n = ρ·N_A·z/M: Cu (8,96 g/cm³, z = 1) 8,49·10²⁸ m⁻³; Ag (10,49; z = 1) 5,86·10²⁸; Al (2,70; z = 3) 1,81·10²⁹;
   velocidade de deriva com 1 A em 1 mm², v = I/(n·A·e): Cu 0,074 mm/s; Ag 0,107 mm/s; Al 0,035 mm/s;
   quilates: 18/24 = 75%; latão 70% Cu e 30% Zn em massa: fração em átomos de Cu = (70/63,55)/(70/63,55 + 30/65,38) = 0,706;
   chefão (coroa de 1000 g e 62,7 cm³; ouro 19,3 e prata 10,5 g/cm³, volumes aditivos): densidade 15,95 g/cm³; ouro = (62,7 − 1000/10,5)/(1/19,3 − 1/10,5) = 749 g (18 quilates);
     átomos: 749/196,97 = 3,80 mol de Au e 251/107,87 = 2,32 mol de Ag: 62% dos átomos são de ouro. */
F.registrar("quimica/C03", {
  retoma: ["B07", "C01", "A04"],
  html(F) {
    const R = String.raw, NA = 6.022e23;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const bola = (x, y, r, cor, t = "") => `<circle cx="${x}" cy="${y}" r="${r}" style="fill:color-mix(in srgb,${cor} 42%,transparent);stroke:${cor};stroke-width:1.5"/>` + (t ? D.txt(x, y + 4, t, "tx2", "middle", 'style="fill:var(--ink);font-weight:700"') : "");
    /* mar de elétrons: rede de cátions e elétrons espalhados (posições fixas, pseudoaleatórias) */
    const mar = (x0, y0, nx = 6, ny = 3, desl = 0, sinal = "+") => { let s = `<rect x="${x0 - 22}" y="${y0 - 22}" width="${nx * 36 + 8 + desl}" height="${ny * 36 + 8}" rx="6" style="fill:color-mix(in srgb,var(--warn) 8%,transparent);stroke:var(--ink3)"/>`; for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) s += bola(x0 + i * 36 + (j === 0 ? desl : 0), y0 + j * 36, 11, "var(--mA)", sinal); for (let k = 0; k < nx * ny * 1.3; k++) s += `<circle cx="${x0 - 14 + ((k * 73) % (nx * 36 - 8 + desl))}" cy="${y0 - 16 + ((k * 41 + 7) % (ny * 36 - 4))}" r="2.4" style="fill:var(--warn)"/>`; return s; };
    const ionico = (x0, y0, desl = 0) => { let s = ""; for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) s += bola(x0 + i * 30 + (j === 0 ? desl : 0), y0 + j * 30, (i + j) % 2 ? 13 : 9, (i + j) % 2 ? "var(--bad)" : "var(--mA)", (i + j) % 2 ? "−" : "+"); return s; };
    /* célula unitária cúbica em perspectiva: "ccc" (corpo centrado) ou "cfc" (face centrada) */
    const cubo = (x, y, a, tipo, rot = "") => { const d = a * 0.42, P = (u, v, w) => [x + u * a + w * d, y + (1 - v) * a - w * d], L = (p, q, tr) => `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" style="stroke:var(--ink3);stroke-width:1.2${tr ? ";stroke-dasharray:3 3" : ""}"/>`; let s = "";
      [[0, 0, 0, 1, 0, 0], [1, 0, 0, 1, 1, 0], [1, 1, 0, 0, 1, 0], [0, 1, 0, 0, 0, 0], [0, 0, 1, 1, 0, 1], [1, 0, 1, 1, 1, 1], [1, 1, 1, 0, 1, 1], [0, 1, 1, 0, 0, 1], [0, 0, 0, 0, 0, 1], [1, 0, 0, 1, 0, 1], [1, 1, 0, 1, 1, 1], [0, 1, 0, 0, 1, 1]].forEach((e) => (s += L(P(e[0], e[1], e[2]), P(e[3], e[4], e[5]), e[2] + e[5] === 2 || (e[0] === 0 && e[1] === 0 && e[3] === 0 && e[4] === 0))));
      const at = []; for (const u of [0, 1]) for (const v of [0, 1]) for (const w of [0, 1]) at.push([u, v, w, "var(--mA)"]);
      if (tipo === "ccc") at.push([0.5, 0.5, 0.5, "var(--warn)"]); if (tipo === "cfc") [[0.5, 0.5, 0], [0.5, 0.5, 1], [0.5, 0, 0.5], [0.5, 1, 0.5], [0, 0.5, 0.5], [1, 0.5, 0.5]].forEach((c) => at.push([...c, "var(--warn)"]));
      at.sort((p, q) => q[2] - p[2]).forEach((c) => { const [px, py] = P(c[0], c[1], c[2]); s += bola(px, py, a * 0.1, c[3]); });
      return s + (rot ? D.txt(x + a / 2 + d / 2, y + a + 22, rot, "tx2") : ""); };
    const liga = (x0, y0, tipo) => { let s = ""; for (let j = 0; j < 4; j++) for (let i = 0; i < 5; i++) { const outro = tipo === "sub" && (i * 3 + j * 5) % 7 === 2; s += bola(x0 + i * 32, y0 + j * 32, outro ? 12 : 14, outro ? "var(--warn)" : "var(--mA)"); } if (tipo === "int") [[0, 0], [2, 1], [3, 2], [1, 2], [3, 0]].forEach(([i, j]) => (s += bola(x0 + 16 + i * 32, y0 + 16 + j * 32, 5, "var(--bad)"))); return s; };
    const barras = (lista, ymax, un = "", y0 = 140) => { const w = 56, x0 = 280 - (lista.length * (w + 14)) / 2; return lista.map(([r, v], i) => { const h = (Math.max(v, 0) / ymax) * 110, x = x0 + i * (w + 14); return `<rect x="${x}" y="${y0 - h}" width="${w}" height="${h}" style="fill:color-mix(in srgb,var(--mod) 45%,transparent);stroke:var(--mod);stroke-width:1.6"/>` + D.txt(x + w / 2, y0 + 18, r, "tx2") + D.txt(x + w / 2, y0 - 6 - h, String(v), "tx2", "middle", 'style="font-size:11px"'); }).join("") + `<line x1="${x0 - 8}" x2="${x0 + lista.length * (w + 14)}" y1="${y0}" y2="${y0}" style="stroke:var(--ink2)"/>` + (un ? D.txt(x0 - 12, 18, un, "tx2", "start") : ""); };
    const tab = (x, y, larg, linhas) => linhas.map((l, i) => l.map((c, j) => D.txt(x + larg.slice(0, j).reduce((a, b) => a + b, 0) + larg[j] / 2, y + i * 22, c, "tx2", "middle", i ? "" : 'style="font-weight:700;fill:var(--ink)"')).join("")).join("") + `<line x1="${x}" x2="${x + larg.reduce((a, b) => a + b, 0)}" y1="${y + 7}" y2="${y + 7}" style="stroke:var(--ink3)"/>`;
    const fio = D.svg(560, 110, `<rect x="60" y="35" width="440" height="40" rx="20" style="fill:color-mix(in srgb,var(--warn) 14%,transparent);stroke:var(--ink2)"/>` + [0, 1, 2, 3, 4, 5, 6].map((k) => `<circle cx="${100 + k * 58}" cy="${48 + (k % 3) * 8}" r="3" style="fill:var(--warn)"/>` + D.seta(106 + k * 58, 48 + (k % 3) * 8, 126 + k * 58, 48 + (k % 3) * 8, "var(--warn)", 1.4)).join("") + D.txt(280, 100, "corrente de 1 A · seção de 1 mm²", "tx2"), "fio");

    const CEL = { Cu: ["cobre", "cfc", 361.5, 63.55, 4], Al: ["alumínio", "cfc", 405.0, 26.98, 4], Fe: ["ferro", "ccc", 286.7, 55.85, 2], Na: ["sódio", "ccc", 429.1, 22.99, 2], Ag: ["prata", "cfc", 408.6, 107.87, 4] };
    const LIV = { Cu: ["cobre", 8.96, 63.55, 1], Ag: ["prata", 10.49, 107.87, 1], Al: ["alumínio", 2.7, 26.98, 3] };
    const exemplos = F.exemplo({
      titulo: "Quilates, células e elétrons",
      casos: [
        { nome: "Fácil: quanto ouro tem na joia?", gerar: (p) => {
          const k = p ? 18 : F.escolha([18, 14, 12, 10]), m = p ? 8 : F.escolha([6, 8, 12, 20]), ou = (m * k) / 24;
          return { enun: R`<p>Uma aliança de ${m} g é de ouro ${k} quilates. Qual a porcentagem em massa de ouro, e quantos gramas de ouro ela tem?</p>`, fig: fig(`<circle cx="280" cy="75" r="42" style="fill:none;stroke:var(--warn);stroke-width:10"/>` + D.txt(280, 80, k + " k", "tx") + D.txt(280, 150, m + " g", "tx2"), 165),
            passos: [R`<p>(i) Quilate é uma fração de 24: ouro puro tem 24 quilates. Ouro ${k} quilates tem ${k} partes de ouro em 24 partes da liga, em massa.</p>`,
              R`<p>(ii) Porcentagem: $\frac{${k}}{24} = ${F.n((k / 24) * 100, 1)}\%$.</p>`,
              R`<p>(iii) Massa de ouro: $${m}\cdot\frac{${k}}{24} = ${F.n(ou, 2)}$ g. O resto, $${F.n(m - ou, 2)}$ g, é cobre e prata.</p>`,
              R`<p>(iv) Por que não usar ouro puro? Porque é mole demais: os outros átomos, de tamanho diferente, travam o deslizamento das camadas e deixam a liga mais dura.</p>`] };
        } },
        { nome: "Médio: a densidade que sai de uma célula", gerar: (p) => {
          const k = p ? "Cu" : F.escolha(Object.keys(CEL)), c = CEL[k], a = c[2] * 1e-10, rho = (c[4] * c[3]) / (NA * a ** 3);
          return { enun: R`<p>O ${c[0]} cristaliza na estrutura cúbica de ${c[1] === "cfc" ? "face centrada" : "corpo centrado"}, com aresta $a = ${F.n(c[2], 1)}$ pm e massa molar ${F.nt(c[3], 2)} g/mol. Calcule a densidade do metal.</p>`, fig: fig(cubo(215, 50, 84, c[1], "a = " + F.nt(c[2], 1) + " pm"), 165),
            passos: [R`<p>(i) Átomos por célula: cada vértice é dividido por 8 cubos ($8\cdot\frac18 = 1$)${c[1] === "cfc" ? R`; cada face, por 2 ($6\cdot\frac12 = 3$). Total: $Z = 4$` : R`; o do centro é inteiro da célula. Total: $Z = 2$`}.</p>`,
              R`<p>(ii) Massa da célula: $\frac{Z\cdot M}{N_A} = \frac{${c[4]}\cdot${F.n(c[3], 2)}}{6{,}022\cdot10^{23}} = ${F.n(((c[4] * c[3]) / NA) * 1e22, 3)}\cdot10^{-22}$ g.</p>`,
              R`<p>(iii) Volume: $a^3 = (${F.n(c[2] / 100, 3)}\cdot10^{-8}\ \text{cm})^3 = ${F.n(a ** 3 * 1e23, 3)}\cdot10^{-23}$ cm³.</p>`,
              R`<p>(iv) $\rho = \frac{${F.n(((c[4] * c[3]) / NA) * 1e22, 3)}\cdot10^{-22}}{${F.n(a ** 3 * 1e23, 3)}\cdot10^{-23}} = ${F.n(rho, 2)}$ g/cm³. Um número medido com raios X (a aresta) entrega a densidade que você mede com balança e proveta.</p>`] };
        } },
        { nome: "Olimpíada: quão devagar anda um elétron?", gerar: (p) => {
          const k = p ? "Cu" : F.escolha(Object.keys(LIV)), c = LIV[k], n = (c[1] * NA * c[3]) / c[2] * 1e6, v = 1 / (n * 1e-6 * 1.602e-19), ex = Math.floor(Math.log10(n));
          return { enun: R`<p>${k === "Ag" ? "Na" : "No"} ${c[0]} (densidade ${F.nt(c[1], 2)} g/cm³, massa molar ${F.nt(c[2], 2)} g/mol), cada átomo cede ${c[3]} elétron${c[3] > 1 ? "s" : ""} ao mar de elétrons. (a) Quantos elétrons livres há por m³? (b) Com que velocidade média eles se deslocam num fio de 1 mm² de seção que conduz 1 A? ($e = 1{,}602\cdot10^{-19}$ C)</p>`, fig: fio,
            passos: [R`<p>(i) Átomos por cm³: $\frac{\rho\,N_A}{M} = \frac{${F.n(c[1], 2)}\cdot6{,}022\cdot10^{23}}{${F.n(c[2], 2)}} = ${F.n((c[1] * NA) / c[2] / 1e22, 2)}\cdot10^{22}$.</p>`,
              R`<p>(ii) Elétrons livres: ${c[3]} por átomo. Em m³ ($10^6$ cm³): $n = ${F.n(n / 10 ** ex, 2)}\cdot10^{${ex}}$ m⁻³.</p>`,
              R`<p>(iii) Corrente é carga por tempo: em 1 s passam pela seção os elétrons de um cilindro de comprimento $v$: $I = n\,A\,v\,e$ ${F.ret("fisica/C06")}.</p>`,
              R`<p>(iv) $v = \frac{I}{nAe} = \frac{1}{${F.n(n / 10 ** ex, 2)}\cdot10^{${ex}}\cdot10^{-6}\cdot1{,}602\cdot10^{-19}} = ${F.n(v * 1e5, 2)}\cdot10^{-5}$ m/s, ou ${F.nt(v * 1000, 3)} mm/s. Menos de um milímetro por segundo! A lâmpada acende na hora porque o campo elétrico se estabelece no fio inteiro quase instantaneamente: todos os elétrons começam a andar juntos.</p>`] };
        } },
      ],
    });

    const chefao = F.chefao({
      titulo: "A coroa de Hierão, versão átomo por átomo",
      enun: R`<p>O ouro cristaliza na estrutura cúbica de face centrada, com aresta de 407,8 pm e massa molar 196,97 g/mol. (a) Calcule a densidade do ouro a partir da célula unitária. (b) Calcule o raio do átomo de ouro no cristal. (c) Uma coroa de 1000 g desloca 62,7 cm³ de água. Supondo que ela seja uma liga só de ouro (19,3 g/cm³) e prata (10,5 g/cm³) e que os volumes se somem, quantos gramas de ouro ela tem? Quantos quilates? (d) Que fração dos <b>átomos</b> da coroa é de ouro (prata: 107,87 g/mol)? Por que essa fração é menor que a fração em massa? (e) O ouro e a prata têm quase a mesma aresta de célula (407,8 e 408,6 pm) e a mesma estrutura. Que tipo de liga eles formam, e por que isso justifica a hipótese dos volumes que se somam? (f) A liga é mais dura que o ouro puro. Explique com o modelo do mar de elétrons.</p>`,
      fig: fig(cubo(120, 50, 84, "cfc", "ouro: a = 407,8 pm") + `<path d="M350 110 l20 -60 l25 35 l25 -45 l25 45 l25 -35 l20 60 z" style="fill:color-mix(in srgb,var(--warn) 30%,transparent);stroke:var(--warn);stroke-width:2"/>` + D.txt(420, 140, "1000 g · 62,7 cm³", "tx2"), 165),
      dicas: [R`<p>(a) $\rho = \frac{Z\,M}{N_A\,a^3}$ com $Z = 4$. (b) Na face, os átomos se tocam na diagonal: $4r = a\sqrt2$.</p>`, R`<p>(c) $\frac{m}{19{,}3} + \frac{1000 - m}{10{,}5} = 62{,}7$.</p>`, R`<p>(d) Converta as duas massas em mols.</p>`],
      sol: R`<p><b>(a)</b> $\rho = \frac{4\cdot196{,}97}{6{,}022\cdot10^{23}\cdot(4{,}078\cdot10^{-8})^3} = 19{,}3$ g/cm³. Bate com o valor medido.</p>
        <p><b>(b)</b> $r = \frac{a\sqrt2}{4} = \frac{407{,}8\cdot1{,}414}{4} = 144$ pm.</p>
        <p><b>(c)</b> $\frac{m}{19{,}3} + \frac{1000 - m}{10{,}5} = 62{,}7 \Rightarrow m\left(\frac{1}{19{,}3} - \frac{1}{10{,}5}\right) = 62{,}7 - 95{,}24 \Rightarrow m = \frac{-32{,}54}{-0{,}04343} = 749$ g. Fração em massa: 74,9%, ou $0{,}749\cdot24 = 18$ quilates. (Se fosse ouro puro, deslocaria só $1000/19{,}3 = 51{,}8$ cm³: foi assim que Arquimedes teria desmascarado o ourives.)</p>
        <p><b>(d)</b> Ouro: $749/196{,}97 = 3{,}80$ mol. Prata: $251/107{,}87 = 2{,}32$ mol. Fração de átomos de ouro: $\frac{3{,}80}{3{,}80 + 2{,}32} = 0{,}62$. São 62% dos átomos e 75% da massa: cada átomo de ouro pesa quase o dobro de um de prata.</p>
        <p><b>(e)</b> Liga <b>substitucional</b>: átomos de mesmo tamanho e mesma estrutura trocam de lugar na rede sem deformá-la. Como cada átomo ocupa praticamente o mesmo volume que ocupava no metal puro, os volumes se somam.</p>
        <p><b>(f)</b> O metal puro é mole porque as camadas de cátions deslizam umas sobre as outras sem romper a ligação. Na liga, átomos de tamanho e de atração pelos elétrons um pouco diferentes criam irregularidades na rede que dificultam o deslizamento: é preciso mais força para deformar. Contas conferidas em Python.</p>`,
    });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>O modelo mais simples da ligação metálica descreve o metal como:</p>`, fig: fig(mar(190, 45), 150), alts: ["moléculas separadas, unidas por forças fracas.", "cátions e ânions alternados numa rede.", "cátions numa rede, mergulhados num mar de elétrons livres.", "átomos unidos por pares de elétrons localizados entre dois vizinhos.", "átomos neutros soltos."], certa: "C", dicas: [R`<p>Metais têm baixa energia de ionização.</p>`], resp: "C", sol: R`<p>Os elétrons de valência se soltam dos átomos e passam a pertencer ao cristal inteiro; os cátions ficam presos pela atração por esse mar. <b>B</b> é o sólido iônico; <b>D</b>, o covalente.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Metais conduzem eletricidade <b>no estado sólido</b> porque:</p>`, fig: fio, alts: ["os cátions se movem pela rede.", "têm elétrons livres para se mover pelo cristal.", "têm íons positivos e negativos.", "derretem com a corrente.", "têm ligações covalentes."], certa: "B", dicas: [R`<p>Compare com o sal sólido, que não conduz.</p>`], resp: "B", sol: R`<p>As cargas móveis são os elétrons deslocalizados. Num sal sólido as cargas (íons) estão presas; no metal, os elétrons não.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Um metal pode ser martelado em lâminas (maleabilidade) sem quebrar porque:</p>`, fig: fig(mar(90, 45, 5, 3) + D.seta(275, 80, 315, 80, "var(--ink2)") + mar(350, 45, 5, 3, 18), 150), alts: ["suas ligações são muito fracas.", "a ligação não é direcional: as camadas deslizam e continuam mergulhadas nos mesmos elétrons.", "os elétrons ficam presos entre pares de átomos.", "os cátions se repelem.", "ele é formado por moléculas."], certa: "B", dicas: [R`<p>Depois do deslizamento, o que mudou para cada cátion?</p>`], resp: "B", sol: R`<p>Nada essencial muda: cada cátion continua cercado pelo mar de elétrons. Num cristal iônico, o mesmo deslizamento põe cargas iguais frente a frente e ele racha ${F.ret("C01")}.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Qual a porcentagem em massa de ouro numa joia de ouro 18 quilates?</p>`, fig: fig(`<circle cx="280" cy="70" r="40" style="fill:none;stroke:var(--warn);stroke-width:10"/>` + D.txt(280, 76, "18 k", "tx") + D.txt(280, 145, "ouro puro: 24 k", "tx2"), 160), num: { v: 75, tol: 0.005, un: "%" }, dicas: [R`<p>Quilates são partes em 24.</p>`], resp: "75 %", sol: R`<p>$18/24 = 0{,}75 = 75\%$.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>O bronze é uma liga formada principalmente por:</p>`, fig: fig(liga(215, 22, "sub") + D.txt(280, 160, "dois metais misturados na mesma rede", "tx2"), 170), alts: ["ferro e carbono.", "cobre e zinco.", "cobre e estanho.", "estanho e chumbo.", "mercúrio e prata."], certa: "C", dicas: [R`<p>O latão também é de cobre: com que outro metal?</p>`], resp: "C", sol: R`<p>Bronze: cobre e estanho. <b>A</b> é o aço; <b>B</b>, o latão; <b>D</b>, a solda tradicional; <b>E</b>, o amálgama.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>No aço, os átomos de carbono, bem menores que os de ferro, ficam nos espaços vazios entre eles. Uma liga assim se chama:</p>`, fig: fig(liga(215, 22, "int"), 160), alts: ["substitucional.", "intersticial.", "iônica.", "molecular.", "amálgama."], certa: "B", dicas: [R`<p>Os espaços entre os átomos da rede chamam-se interstícios.</p>`], resp: "B", sol: R`<p>Liga intersticial: átomos pequenos (C, N, H, B) nos interstícios da rede do metal. Eles travam o deslizamento das camadas: o aço é muito mais duro que o ferro puro.</p>` }),
      F.exercicio({ n: 7, nivel: "Máximo", enun: R`<p>Quantos átomos pertencem, no total, a uma célula unitária cúbica de face centrada?</p>`, fig: fig(cubo(215, 50, 84, "cfc"), 150), num: { v: 4, un: "átomos" }, dicas: [R`<p>Um átomo de vértice é dividido por 8 cubos; um de face, por 2.</p>`], resp: "4 átomos", sol: R`<p>$8\cdot\frac18 + 6\cdot\frac12 = 1 + 3 = 4$.</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>O alumínio é cúbico de face centrada, com aresta de 405,0 pm e massa molar 26,98 g/mol. Calcule a sua densidade. ($N_A = 6{,}022\cdot10^{23}$)</p>`, fig: fig(cubo(215, 50, 84, "cfc", "a = 405,0 pm"), 165), num: { v: 2.697, tol: 0.01, un: "g/cm³" }, dicas: [R`<p>$\rho = \frac{Z\,M}{N_A\,a^3}$, com $Z = 4$ e $a = 4{,}050\cdot10^{-8}$ cm.</p>`], resp: "≈ 2,70 g/cm³", sol: R`<p>$\rho = \frac{4\cdot26{,}98}{6{,}022\cdot10^{23}\cdot(4{,}050\cdot10^{-8})^3} = \frac{1{,}792\cdot10^{-22}}{6{,}643\cdot10^{-23}} = 2{,}70$ g/cm³.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>No cobre (cúbico de face centrada, aresta 361,5 pm), os átomos se tocam ao longo da diagonal da face. Qual o raio do átomo de cobre?</p>`, fig: fig(`<rect x="230" y="45" width="100" height="100" style="fill:none;stroke:var(--ink2)"/>` + bola(230, 45, 35.4, "var(--mA)") + bola(330, 145, 35.4, "var(--mA)") + bola(330, 45, 35.4, "var(--mA)") + bola(230, 145, 35.4, "var(--mA)") + bola(280, 95, 35.4, "var(--warn)") + D.txt(280, 202, "uma face do cubo · aresta a = 361,5 pm", "tx2"), 210), num: { v: 127.8, tol: 0.01, un: "pm" }, dicas: [R`<p>A diagonal da face mede $a\sqrt2$ e contém 4 raios.</p>`], resp: "≈ 128 pm", sol: R`<p>$4r = a\sqrt2 \Rightarrow r = \frac{361{,}5\cdot1{,}414}{4} = 127{,}8$ pm.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Entre os metais alcalinos, qual deve ter o <b>menor</b> ponto de fusão?</p>`, fig: fig([["Li", 9], ["Na", 12], ["K", 15], ["Rb", 17], ["Cs", 19]].map(([s, r], i) => bola(110 + i * 85, 70, r * 1.6, "var(--mA)", s)).join("") + D.txt(280, 135, "um elétron de valência cada; o tamanho cresce para a direita", "tx2"), 150), alts: ["Li", "Na", "K", "Rb", "Cs"], certa: "E", dicas: [R`<p>Todos cedem 1 elétron. O que muda é a distância entre o cátion e o mar de elétrons.</p>`], resp: "E", sol: R`<p>Mesma carga (+1), cátion cada vez maior: a atração pelos elétrons enfraquece. Li 181; Na 98; K 63; Rb 39; Cs 28 °C: o césio derrete na mão.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Na estrutura cúbica de corpo centrado, os átomos se tocam na diagonal do cubo ($4r = a\sqrt3$). Que fração do volume da célula é ocupada pelos átomos (fator de empacotamento)?</p>`, fig: fig(cubo(215, 50, 84, "ccc"), 150), num: { v: 0.68, tol: 0.01, un: "" }, dicas: [R`<p>São 2 átomos por célula, cada um com volume $\frac43\pi r^3$, e $r = \frac{a\sqrt3}{4}$.</p>`, R`<p>Fração $= \frac{2\cdot\frac43\pi r^3}{a^3}$: o $a$ cancela.</p>`], resp: "≈ 0,68 (68 % do volume)", sol: R`<p>$\frac{2\cdot\frac43\pi\left(\frac{a\sqrt3}{4}\right)^3}{a^3} = \frac{\pi\sqrt3}{8} = 0{,}68$. Menos compacta que a de face centrada (0,74).</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>A prata tem densidade 10,49 g/cm³ e massa molar 107,87 g/mol, e cada átomo cede 1 elétron ao mar de elétrons. Quantos elétrons livres há por m³? Responda em unidades de $10^{28}$ elétrons por m³.</p>`, fig: fig(mar(190, 45), 150), num: { v: 5.856, tol: 0.01, un: "× 10²⁸ m⁻³" }, dicas: [R`<p>Átomos por cm³: $\frac{\rho N_A}{M}$. Depois, $1\ \text{m}^3 = 10^6\ \text{cm}^3$.</p>`], resp: "≈ 5,86 × 10²⁸ elétrons por m³", sol: R`<p>$\frac{10{,}49\cdot6{,}022\cdot10^{23}}{107{,}87} = 5{,}86\cdot10^{22}$ por cm³ $= 5{,}86\cdot10^{28}$ por m³.</p>` }),
    ];

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Ligações químicas · elétrons de todos</div>
        <div class="q">Bata com um martelo num cristal de sal e ele vira pó. Bata num pedaço de cobre e ele amassa. Os dois são sólidos cristalinos, com átomos arrumados em rede. Por que um quebra e o outro obedece?</div>
        <p>Porque no metal os elétrons de valência não são de ninguém: pertencem ao cristal inteiro. Essa única ideia explica de uma vez o brilho, a condução de eletricidade e de calor, e o fato de um metal poder virar fio, chapa ou moeda. E explica por que misturar metais (as ligas) muda tanto as propriedades.</p></div>
        ${F.chute({ q: "num fio de cobre conduzindo 1 A, com que velocidade média os elétrons andam ao longo do fio?", ops: ["Perto da velocidade da luz.", "Alguns quilômetros por segundo.", "Alguns metros por segundo.", "Menos de um milímetro por segundo."], certa: 3, exp: "Cerca de 0,07 mm/s num fio de 1 mm²: um elétron leva horas para atravessar um metro de fio. Há tantos elétrons livres (quase 10²⁹ por m³) que um arrasto minúsculo de todos eles já dá uma corrente enorme. A lâmpada acende na hora porque o sinal elétrico, esse sim, viaja quase à velocidade da luz." })}`),

      F.secao("mar", "O mar de elétrons", R`
        <p>Átomos de metais têm poucos elétrons de valência e baixa energia de ionização ${F.ret("B07")}. Quando muitos se juntam, esses elétrons se soltam e passam a circular pelo sólido inteiro. Sobra uma rede de <b>cátions</b>, mantida unida pela atração por esse <b>mar de elétrons</b> deslocalizados. Isso é a <b>ligação metálica</b>.</p>
        ${F.fig(fig(mar(190, 45), 150), "Modelo do mar de elétrons: cátions (azul) em posições fixas e elétrons de valência (amarelo) livres por todo o cristal.")}
        <div id="lab-met"></div>
        <table class="tb"><tr><th>Propriedade dos metais</th><th>Explicação pelo modelo</th></tr>
          <tr><td>conduzem eletricidade no estado sólido</td><td>os elétrons livres se deslocam quando há tensão</td></tr>
          <tr><td>conduzem calor</td><td>os elétrons livres carregam energia de uma ponta à outra</td></tr>
          <tr><td>brilho</td><td>os elétrons livres absorvem e reemitem luz de quase todas as cores</td></tr>
          <tr><td>maleáveis (lâminas) e dúcteis (fios)</td><td>a ligação não tem direção: as camadas deslizam sem rompê-la</td></tr>
          <tr><td>a resistência aumenta com a temperatura</td><td>cátions vibrando mais atrapalham a passagem dos elétrons</td></tr></table>
        ${F.fig(fig(mar(60, 40, 5, 3, 18) + D.txt(140, 150, "metal: desliza e continua ligado", "tx2") + ionico(350, 45, 30) + D.txt(420, 150, "sal: cargas iguais se encostam", "tx2"), 165), "A mesma pancada nos dois sólidos. No metal nada muda para os cátions; no cristal iônico, a repulsão racha o cristal.")}
        <h3>Teorema 1: o que faz uma ligação metálica ser forte</h3>
        ${F.demo("carga do cátion e tamanho", R`<p>(i) A ligação é atração de Coulomb entre os cátions e os elétrons que os cercam ${F.ret("C01")}.</p>
          <p>(ii) Quanto <b>mais elétrons</b> cada átomo cede, maior a carga do cátion e mais elétrons há no mar: atração maior. Na ($1+$), Mg ($2+$), Al ($3+$): pontos de fusão 98, 650 e 660 °C.</p>
          <p>(iii) Quanto <b>menor</b> o cátion, mais perto os elétrons ficam do núcleo: atração maior. Descendo o grupo 1, o raio cresce e o ponto de fusão cai: Li 181, Na 98, K 63, Rb 39, Cs 28 °C.</p>
          <p>(iv) Nos metais de transição, elétrons $d$ também participam da ligação: pontos de fusão muito altos (ferro, 1538 °C; tungstênio, 3422 °C, o recordista). O mercúrio, na outra ponta, é líquido (−39 °C).</p>`)}
        ${F.fig(fig(barras([["Na", 98], ["Mg", 650], ["Al", 660], ["Fe", 1538], ["W", 3422]], 3700, "ponto de fusão (°C)"), 170), "Mais elétrons na ligação: metal mais difícil de fundir.")}
        <h3>Teorema 2: quantos elétrons livres há num metal</h3>
        ${F.demo("contando o mar", R`<p>(i) Em 1 cm³ de metal de densidade $\rho$ há $\rho$ gramas, isto é, $\rho/M$ mols de átomos.</p>
          <p>(ii) Em número: $\frac{\rho\,N_A}{M}$ átomos por cm³.</p>
          <p>(iii) Se cada átomo cede $z$ elétrons: $n = \frac{z\,\rho\,N_A}{M}$ elétrons livres por cm³.</p>
          <p>(iv) Cobre ($\rho = 8{,}96$ g/cm³; $M = 63{,}55$ g/mol; $z = 1$): $n = \frac{8{,}96\cdot6{,}022\cdot10^{23}}{63{,}55} = 8{,}49\cdot10^{22}$ por cm³, ou $8{,}49\cdot10^{28}$ por m³.</p>`)}
        ${F.formula(R`n = \frac{z\,\rho\,N_A}{M}`, "Elétrons livres por volume (z cedidos por átomo)")}`),

      F.secao("celulas", "Como os átomos se empilham", R`
        <p>Nos metais, os átomos se arrumam como esferas empilhadas do jeito mais compacto possível. O menor pedaço que, repetido, monta o cristal inteiro é a <b>célula unitária</b>. As duas cúbicas mais comuns:</p>
        ${F.fig(fig(cubo(90, 50, 84, "ccc", "cúbica de corpo centrado (CCC)") + cubo(340, 50, 84, "cfc", "cúbica de face centrada (CFC)"), 165), "Azul: átomos dos vértices. Amarelo: o do centro do cubo (CCC) ou os dos centros das faces (CFC). São todos átomos do mesmo metal.")}
        <table class="tb"><tr><th></th><th>CCC</th><th>CFC</th></tr>
          <tr><td>átomos por célula ($Z$)</td><td>$8\cdot\frac18 + 1 = 2$</td><td>$8\cdot\frac18 + 6\cdot\frac12 = 4$</td></tr>
          <tr><td>vizinhos de cada átomo</td><td>8</td><td>12</td></tr>
          <tr><td>onde os átomos se tocam</td><td>diagonal do cubo: $4r = a\sqrt3$</td><td>diagonal da face: $4r = a\sqrt2$</td></tr>
          <tr><td>volume ocupado</td><td>68%</td><td>74%</td></tr>
          <tr><td>exemplos</td><td>Fe (ambiente), Na, K, W</td><td>Cu, Al, Ag, Au</td></tr></table>
        <p>(Há também a hexagonal compacta, de Mg e Zn, com os mesmos 12 vizinhos e 74% da CFC.)</p>
        <h3>Teorema 3: a densidade sai da célula unitária</h3>
        ${F.demo("do átomo à balança", R`<p>(i) O cristal é a célula repetida: a densidade do cristal é a densidade de <b>uma</b> célula.</p>
          <p>(ii) Massa de uma célula: $Z$ átomos, cada um com massa $M/N_A$: $m = \frac{Z\,M}{N_A}$.</p>
          <p>(iii) Volume de uma célula cúbica de aresta $a$: $V = a^3$.</p>
          <p>(iv) $\rho = \frac{Z\,M}{N_A\,a^3}$. Cobre (CFC, $a = 361{,}5$ pm $= 3{,}615\cdot10^{-8}$ cm): $\rho = \frac{4\cdot63{,}55}{6{,}022\cdot10^{23}\cdot(3{,}615\cdot10^{-8})^3} = 8{,}94$ g/cm³. Medido: 8,96.</p>
          <p>(v) Lida ao contrário, a mesma fórmula foi um dos jeitos de medir a constante de Avogadro: mede-se $a$ com raios X, $\rho$ com balança, e isola-se $N_A$.</p>`)}
        ${F.formula(R`\rho = \frac{Z\,M}{N_A\,a^3}`, "Densidade pela célula unitária cúbica (Z: átomos por célula; a: aresta)")}
        ${F.demo("por que 74%: o fator de empacotamento da CFC", R`<p>(i) Na face, o átomo do centro toca os quatro dos vértices: a diagonal da face tem $r + 2r + r = 4r$.</p>
          <p>(ii) Diagonal de um quadrado de lado $a$: $a\sqrt2$. Então $a = \frac{4r}{\sqrt2} = 2\sqrt2\,r$.</p>
          <p>(iii) Volume dos 4 átomos: $4\cdot\frac43\pi r^3 = \frac{16}{3}\pi r^3$. Volume da célula: $a^3 = 16\sqrt2\,r^3$.</p>
          <p>(iv) Fração ocupada: $\frac{\frac{16}{3}\pi r^3}{16\sqrt2\,r^3} = \frac{\pi}{3\sqrt2} = 0{,}74$. Nenhum empilhamento de esferas iguais passa disso.</p>`)}`),

      F.secao("ligas", "Ligas metálicas", R`
        <p><b>Liga</b> é uma mistura com propriedades metálicas, de um metal com outros elementos (metais ou não). Quase nenhum metal é usado puro: as ligas são mais duras, mais resistentes ou fundem em outra temperatura. São misturas, em geral homogêneas (soluções sólidas ${F.ret("A04")}): a composição pode variar, e por isso se dá em porcentagem.</p>
        ${F.fig(fig(liga(90, 22, "sub") + D.txt(155, 160, "substitucional (latão, bronze, ouro 18 k)", "tx2") + liga(340, 22, "int") + D.txt(405, 160, "intersticial (aço)", "tx2"), 170), "Dois tipos de liga: átomos de tamanho parecido trocam de lugar na rede; átomos pequenos entram nos espaços vazios.")}
        <table class="tb"><tr><th>Liga</th><th>Composição principal</th><th>Para que serve</th></tr>
          <tr><td>aço</td><td>ferro + carbono (até cerca de 2%)</td><td>estruturas, ferramentas</td></tr>
          <tr><td>aço inoxidável</td><td>ferro + crômio + níquel (+ carbono)</td><td>talheres, pias: não enferruja</td></tr>
          <tr><td>latão</td><td>cobre + zinco</td><td>torneiras, instrumentos de sopro</td></tr>
          <tr><td>bronze</td><td>cobre + estanho</td><td>sinos, estátuas, medalhas</td></tr>
          <tr><td>ouro 18 quilates</td><td>75% de ouro + cobre e prata</td><td>joias</td></tr>
          <tr><td>solda</td><td>estanho + chumbo (hoje, estanho + prata + cobre)</td><td>eletrônica: funde baixo</td></tr>
          <tr><td>amálgama</td><td>mercúrio + outro metal (prata, estanho)</td><td>antigas obturações</td></tr></table>
        <p><b>Quilate</b> mede a fração em massa de ouro, em partes de 24: ouro 24 quilates é puro; 18 quilates tem $18/24 = 75\%$ de ouro.</p>
        ${F.caixa("pegadinha", R`<p><b>Liga não é composto.</b> Não tem fórmula fixa nem proporção definida, e os componentes não estão "reagidos": estão misturados na rede. Aço com 0,2% de carbono e aço com 1% de carbono são os dois aço. Segunda armadilha: nem todo componente de liga é metal (o carbono do aço é ametal). Terceira: porcentagem em massa não é porcentagem em átomos. Num latão com 70% de cobre em massa, 70,6% dos átomos são de cobre (massas molares parecidas); numa liga de ouro e prata a diferença é enorme.</p>`)}
        ${F.caixa("fisico", R`<p><b>Reconheça o tipo de sólido pelo comportamento, não pela aparência.</b> Conduz no estado sólido e amassa: metálico. Só conduz fundido ou dissolvido, e quebra: iônico. Não conduz de jeito nenhum e funde baixo: molecular. Não conduz e é duríssimo, com ponto de fusão altíssimo: covalente em rede. Quatro perguntas (conduz sólido? conduz líquido? é duro? funde alto?) classificam quase qualquer substância que apareça numa prova.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Em casa, pode:</b> testar condução com pilha, fios e LED em objetos de metal; dobrar um clipe várias vezes no mesmo ponto e sentir que ele endurece e esquenta antes de partir; comparar com ímã uma colher de inox e um prego. <b>Nunca em casa:</b> mercúrio (termômetro quebrado não se limpa com aspirador nem com a mão: avise um adulto, ventile, recolha com papel-cartão e fita, guarde em frasco fechado e leve a um ponto de coleta); metais alcalinos (sódio, potássio) reagem violentamente com água e só o professor manuseia; fundir metais ou solda sem equipamento (solda antiga tem chumbo). Limalhas e restos de metais não vão para o ralo: vão para a coleta de resíduos sólidos do laboratório.</p>`, "Segurança e descarte")}
        ${F.caixa("olimpiada", R`<p><b>Como isso é cobrado.</b> (1) Reconhecer o modelo do mar de elétrons e explicar com ele condução, brilho e maleabilidade, comparando com sólidos iônicos, moleculares e covalentes. (2) Composição e uso das ligas mais comuns, quilates e a diferença entre liga e composto. (3) Em olimpíada e no ITA: célula unitária. Contar átomos por célula, relacionar aresta e raio, calcular densidade, fator de empacotamento ou a constante de Avogadro a partir de dados de raios X. (4) Comparar pontos de fusão de metais pelo número de elétrons de valência e pelo raio.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, o mar de elétrons vira a <b>teoria de bandas</b>: os orbitais de $10^{23}$ átomos se combinam em faixas quase contínuas de níveis de energia. Se a banda ocupada está cheia pela metade, ou encostada numa vazia, os elétrons mudam de nível com qualquer empurrãozinho: condutor. Se há um grande intervalo proibido até a banda vazia: isolante. Intervalo pequeno: semicondutor, como o silício. É a mesma ideia dos orbitais moleculares ${F.ret("C07")}, levada a um cristal inteiro.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-met"); e.outerHTML = F.lab("O mar de elétrons: corrente, calor e martelo", "lab-met"); SIM.metal(document.getElementById("lab-met"), F); },
});
