/* A17 · Hidrostática. Conferido em Python (g = 10 m/s², p_atm = 1e5 Pa):
   10 m de água: +1e5 Pa (total 2e5 Pa); 76 cm de mercúrio (13 600 kg/m³): 1,034e5 Pa; coluna de água de 1 atm: 10 m;
   prensa 100 N em 10 cm² → 1000 cm²: 10 000 N; bloco de 2 L submerso em água: E = 20 N; madeira 600 kg/m³: 60% submersa;
   pedra de 3 kg e 1 L: peso aparente 20 N; iceberg (917 em 1025): 89,5% submerso; coroa 10 N no ar e 9,4 N na água: 16 667 kg/m³ (ouro: 19 300);
   tubo em U: 10 cm de óleo (800) equilibram 8 cm de água; fundo do mar a 1000 m: 102,5 atm de pressão hidrostática;
   balão de hélio de 1 m³ (ar 1,2; hélio 0,18): 10,2 N de força líquida (sem a casca); comporta 4 m × 3 m de água: 1,8e5 N, aplicada a 1 m do fundo;
   chefão: pedra de 50 kg (2500 kg/m³) no barco desloca 0,05 m³; no fundo, 0,02 m³: o nível da piscina de 100 m² desce 0,3 mm;
   gelo derretendo em água doce: nível igual; em água salgada: sobe (volume derretido = m/ρ_doce > m/ρ_sal). */
F.registrar("A17", {
  retoma: ["A08", "A14", "A12b"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const agua = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" style="fill:color-mix(in srgb,var(--mA) 22%,transparent)"/>`;
    const bloco = (x, y, w, h, cor, rot) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" style="fill:color-mix(in srgb,${cor} 30%,transparent);stroke:${cor};stroke-width:2"/>` + (rot ? D.txt(x + w / 2, y + h / 2 + 5, rot, "tx2") : "");
    const tuboU = fig(`<path d="M200 20 L200 150 Q200 160 210 160 L350 160 Q360 160 360 150 L360 20" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="M226 20 L226 134 L334 134 L334 20" style="fill:none;stroke:var(--ink2);stroke-width:2"/>` + `<rect x="201" y="28" width="24" height="131" style="fill:color-mix(in srgb,var(--mA) 30%,transparent)"/><line x1="190" x2="370" y1="60" y2="60" style="stroke:var(--ink3);stroke-dasharray:3 3"/><rect x="226" y="135" width="108" height="24" style="fill:color-mix(in srgb,var(--mA) 30%,transparent)"/><rect x="335" y="60" width="24" height="99" style="fill:color-mix(in srgb,var(--mA) 30%,transparent)"/><rect x="335" y="20" width="24" height="40" style="fill:color-mix(in srgb,var(--warn) 35%,transparent)"/>` + D.txt(372, 44, "óleo, 10 cm", "tx2", "start") + D.txt(188, 32, "água", "tx2", "end"), 170);
    const comporta = (w, h) => fig(agua(80, 40, 260, 120) + `<rect x="340" y="20" width="12" height="140" style="fill:var(--mC)"/><line x1="60" x2="500" y1="160" y2="160" style="stroke:var(--ink2);stroke-width:2"/>` + [60, 90, 120, 150].map((y) => D.seta(300, y, 300 + (y - 40) * 0.3, y, "var(--ink3)", 1.2)).join("") + D.txt(370, 100, `comporta: ${F.nt(w)} m de largura`, "tx2", "start") + D.txt(70, 100, `${F.nt(h)} m`, "tx2", "end"), 170);
    const exemplos = F.exemplo({
      titulo: "Hidrostática",
      casos: [
        { nome: "Fácil: o mergulhador", gerar: (p) => {
          const h = p ? 10 : F.escolha([5, 10, 20, 30]), rho = p ? 1000 : F.escolha([1000, 1030]), ph = rho * 10 * h;
          return { enun: R`<p>Um mergulhador desce a ${h} m de profundidade num lago${rho > 1000 ? " de água salgada" : ""} (densidade ${rho} kg/m³). Qual a pressão total sobre ele? E qual a força extra numa máscara de 100 cm²?</p>`,
            fig: fig(agua(60, 20, 440, 140) + `<circle cx="280" cy="${20 + Math.min(130, h * 4)}" r="8" style="fill:var(--warn)"/>` + D.seta(330, 20, 330, 20 + Math.min(130, h * 4), "var(--ink3)") + D.txt(338, 20 + Math.min(65, h * 2), `${h} m`, "tx2", "start"), 170),
            passos: [R`<p>(i) Lei de Stevin: $p = p_\text{atm} + \rho gh = 10^5 + ${rho}\cdot10\cdot${h}$.</p>`, R`<p>(ii) $p = ${F.n(1e5 + ph)}$ Pa $\approx ${F.n((1e5 + ph) / 1e5, 3)}$ atm. Cada 10 m de água acrescentam cerca de 1 atm.</p>`, R`<p>(iii) Força extra (a de dentro da máscara está à pressão atmosférica): $\rho gh\cdot A = ${F.n(ph)}\cdot0{,}01 = ${F.n(ph * 0.01)}$ N. Por isso o mergulhador precisa equalizar o ar.</p>`] };
        } },
        { nome: "Médio: quanto do iceberg fica escondido", gerar: (p) => {
          const rc = p ? 917 : F.escolha([917, 600, 700]), rl = p ? 1025 : F.escolha([1000, 1025, 1260]), nome = rc === 917 ? "gelo" : "madeira";
          return { enun: R`<p>Um bloco de ${nome} (${rc} kg/m³) flutua num líquido de densidade ${rl} kg/m³. Que fração do volume fica submersa?</p>`,
            fig: fig(agua(60, 80, 440, 80) + `<path d="M230 ${80 - 50 * (1 - rc / rl)} L330 ${80 - 50 * (1 - rc / rl)} L350 ${80 + 70 * (rc / rl)} L210 ${80 + 70 * (rc / rl)} Z" style="fill:color-mix(in srgb,var(--ink) 25%,transparent);stroke:var(--ink2)"/>`, 170),
            passos: [R`<p>(i) Flutuando em equilíbrio, empuxo = peso ${F.ret("A08")}: $\rho_\text{líq}V_\text{sub}g = \rho_\text{corpo}Vg$.</p>`, R`<p>(ii) $\frac{V_\text{sub}}V = \frac{\rho_\text{corpo}}{\rho_\text{líq}} = \frac{${rc}}{${rl}}$.</p>`, R`<p>(iii) $\approx ${F.n((100 * rc) / rl, 3)}\%$ submerso. A gravidade e o tamanho do bloco sumiram: um iceberg flutua igual na Terra e (se houvesse mar) na Lua.</p>`] };
        } },
        { nome: "Olimpíada: segurar a comporta", gerar: (p) => {
          const w = p ? 4 : F.escolha([2, 4, 5]), h = p ? 3 : F.escolha([2, 3, 4]), Ft = (1000 * 10 * h * h * w) / 2;
          return { enun: R`<p>Uma comporta retangular vertical de ${w} m de largura segura água com ${h} m de profundidade, e é articulada no fundo. Qual a força total da água? Que força horizontal no topo da comporta (na altura da superfície) a mantém fechada?</p>`, fig: comporta(w, h),
            passos: [R`<p>(i) A pressão cresce linearmente com a profundidade: $p(y) = \rho gy$ (a atmosférica age dos dois lados e cancela). Força numa faixa de altura $dy$: $dF = \rho gy\,w\,dy$.</p>`, R`<p>(ii) $F = \int_0^h\rho gwy\,dy = \frac{\rho gwh^2}2 = ${F.n(Ft)}$ N ${F.ret("F04")}: é a pressão <b>média</b> ($\rho gh/2$) vezes a área.</p>`, R`<p>(iii) Torque em torno da articulação (fundo): a faixa a profundidade $y$ está a $h - y$ do fundo. $\tau = \int_0^h\rho gwy(h - y)\,dy = \frac{\rho gwh^3}6$, como se $F$ agisse a $h/3$ do fundo (o centro de pressão). Força no topo: $F_\text{topo}\cdot h = \frac{\rho gwh^3}6 \Rightarrow F_\text{topo} = \frac F3 = ${F.n(Ft / 3)}$ N ${F.ret("A14")}.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A pedra, o barco e o gelo",
      enun: R`<p>Um barco flutua numa piscina de 100 m² e leva uma pedra de 50 kg (densidade 2500 kg/m³). (a) Que volume de água o barco desloca por causa da pedra? (b) A pedra é jogada na água e afunda. Que volume ela desloca agora? (c) O nível da piscina sobe, desce ou fica igual? De quanto? (d) Num copo de água doce boia um cubo de gelo. Quando ele derrete, o nível sobe, desce ou fica igual? Prove. (e) E se o gelo estivesse boiando em água salgada (1025 kg/m³)? E se tivesse uma pedrinha presa dentro dele?</p>`,
      fig: fig(agua(60, 90, 440, 70) + `<path d="M200 70 L360 70 L340 104 L220 104 Z" style="fill:color-mix(in srgb,var(--mC) 35%,transparent);stroke:var(--mC);stroke-width:2"/><circle cx="280" cy="60" r="12" style="fill:var(--ink3)"/>` + D.txt(300, 50, "50 kg", "tx2", "start"), 165),
      dicas: [R`<p>(a) Flutuando, o barco desloca água com o mesmo peso da carga que leva (Arquimedes + equilíbrio).</p>`, R`<p>(b) No fundo, a pedra desloca só o próprio volume.</p>`, R`<p>(d) Compare o volume submerso do gelo com o volume da água que ele vira.</p>`],
      sol: R`<p><b>(a)</b> No barco, a pedra é "carga flutuante": o barco afunda até deslocar 50 kg de água a mais, isto é, $\frac{50}{1000} = 0{,}05$ m³ = 50 L.</p>
        <p><b>(b)</b> No fundo, ela desloca só o próprio volume: $\frac{50}{2500} = 0{,}02$ m³ = 20 L.</p>
        <p><b>(c)</b> O deslocamento total caiu de 50 L para 20 L: o nível <b>desce</b> $\frac{0{,}03}{100} = 3\times10^{-4}$ m $= 0{,}3$ mm. Contraintuitivo, e é uma pergunta famosa (dizem que pegou até físicos célebres). Qualquer objeto mais denso que a água desloca mais boiando no barco do que afundado.</p>
        <p><b>(d)</b> Gelo de massa $m$ boiando em água doce desloca $V_\text{sub} = \frac{m}{\rho_\text{água}}$. Derretido, vira água de volume $\frac m{\rho_\text{água}}$: exatamente o volume do "buraco" que ele fazia. Nível igual.</p>
        <p><b>(e)</b> Em água salgada, o gelo desloca $\frac{m}{1025}$, mas vira $\frac m{1000}$ de água doce, 2,5% a mais: o nível <b>sobe</b> um pouquinho. (Por isso o gelo marinho derretendo eleva pouco o mar, e o gelo sobre os continentes, como na Groenlândia, eleva muito: ele não deslocava nada.) Com pedrinha dentro: enquanto boia, a pedra desloca seu peso em água; depois de derreter, só seu volume. O nível <b>desce</b>, como no item (c).</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Qual a pressão total a 10 m de profundidade num lago ($p_\text{atm} = 10^5$ Pa, água 1000 kg/m³)?</p>`, num: { v: 2e5, un: "Pa" }, dicas: [R`<p>$p = p_\text{atm} + \rho gh$.</p>`], resp: "2 × 10⁵ Pa", sol: R`<p>$10^5 + 1000\cdot10\cdot10 = 2\times10^5$ Pa, o dobro da superfície.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>No barômetro de Torricelli, a pressão atmosférica sustenta 76 cm de mercúrio (13 600 kg/m³). Quanto vale essa pressão em Pa?</p>`, num: { v: 103360, tol: 0.01, un: "Pa" }, dicas: [R`<p>$p = \rho gh$, com $h$ em metros.</p>`], resp: "≈ 1,03 × 10⁵ Pa", sol: R`<p>$13\,600\cdot10\cdot0{,}76 \approx 1{,}03\times10^5$ Pa (com $g = 9{,}81$, o valor padrão de 101 325 Pa).</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Que altura de coluna de água a pressão atmosférica ($10^5$ Pa) consegue sustentar? (Por isso nenhuma bomba de sucção tira água de um poço mais fundo que isso.)</p>`, num: { v: 10, un: "m" }, dicas: [R`<p>$\rho gh = p_\text{atm}$.</p>`], resp: "10 m", sol: R`<p>$h = \frac{10^5}{10^4} = 10$ m. A bomba não "puxa" a água: ela tira o ar, e a atmosfera empurra a água para cima, no máximo uns 10 m.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Numa prensa hidráulica, uma força de 100 N age num pistão de 10 cm². Que força aparece no pistão de 1000 cm²?</p>`, fig: fig(agua(120, 90, 330, 60) + `<rect x="120" y="40" width="30" height="110" style="fill:none;stroke:var(--ink2)"/><rect x="330" y="40" width="120" height="110" style="fill:none;stroke:var(--ink2)"/>` + bloco(122, 80, 26, 10, "var(--ink3)") + bloco(332, 80, 116, 10, "var(--ink3)") + D.seta(135, 30, 135, 76, "var(--warn)") + D.txt(135, 24, "100 N", "tx2") + D.seta(390, 76, 390, 30, "var(--warn)") + D.txt(390, 24, "F?", "tx2"), 160), num: { v: 10000, un: "N" }, dicas: [R`<p>Pascal: a pressão é a mesma nos dois pistões.</p>`], resp: "10 000 N", sol: R`<p>$\frac{100}{10} = \frac F{1000} \Rightarrow F = 10\,000$ N. Em troca, o pistão grande sobe 100 vezes menos que o pequeno desce: o trabalho é o mesmo.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Qual o empuxo sobre um objeto de 2 litros totalmente submerso em água?</p>`, num: { v: 20, un: "N" }, dicas: [R`<p>$E = \rho_\text{líq}Vg$, com $V$ em m³.</p>`], resp: "20 N", sol: R`<p>$1000\cdot0{,}002\cdot10 = 20$ N: o peso de 2 L de água, qualquer que seja o material do objeto.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Uma tora de madeira de densidade 600 kg/m³ flutua na água. Que porcentagem do volume fica submersa?</p>`, num: { v: 60, un: "%" }, dicas: [R`<p>$\frac{V_\text{sub}}V = \frac{\rho_\text{corpo}}{\rho_\text{líq}}$.</p>`], resp: "60%", sol: R`<p>$\frac{600}{1000} = 60\%$.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Três recipientes de formatos diferentes (um largo, um estreito, um em funil) estão cheios de água até a mesma altura. A pressão no fundo:</p>`, fig: fig(agua(60, 60, 120, 100) + agua(250, 60, 40, 100) + `<path d="M380 60 L500 60 L460 160 L420 160 Z" style="fill:color-mix(in srgb,var(--mA) 22%,transparent)"/><line x1="40" x2="520" y1="60" y2="60" style="stroke:var(--ink3);stroke-dasharray:4 4"/>`, 170), alts: ["é maior no recipiente largo, que tem mais água.", "é maior no funil.", "é a mesma nos três.", "é maior no estreito.", "depende da área do fundo."], certa: "C", dicas: [R`<p>O que aparece na lei de Stevin?</p>`], resp: "C", sol: R`<p>$p = p_\text{atm} + \rho gh$ só depende da altura (é o "paradoxo hidrostático"). As paredes inclinadas fazem a diferença entre o peso da água e a força no fundo.</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Uma pedra de 3 kg e volume 1 L está totalmente mergulhada em água, pendurada num dinamômetro. Quanto ele marca?</p>`, num: { v: 20, un: "N" }, dicas: [R`<p>Peso aparente = peso − empuxo.</p>`], resp: "20 N", sol: R`<p>$30 - 1000\cdot0{,}001\cdot10 = 20$ N. Por isso é fácil erguer pedras debaixo d'água.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Que porcentagem de um iceberg (gelo, 917 kg/m³) fica submersa na água do mar (1025 kg/m³)?</p>`, num: { v: (100 * 917) / 1025, tol: 0.01, un: "%" }, dicas: [R`<p>Flutuação: razão das densidades.</p>`], resp: "≈ 89,5%", sol: R`<p>$\frac{917}{1025} \approx 89{,}5\%$: só uns 10% ficam de fora ("a ponta do iceberg").</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Uma coroa pesa 10 N no ar e 9,4 N mergulhada em água. Qual a densidade dela (kg/m³)? É de ouro puro (19 300 kg/m³)?</p>`, num: { v: 50000 / 3, tol: 0.01, un: "kg/m³" }, dicas: [R`<p>A perda de peso (0,6 N) é o empuxo, que dá o volume.</p>`], resp: "≈ 16 700 kg/m³: não é ouro puro", sol: R`<p>$E = 0{,}6 = 1000\cdot V\cdot10 \Rightarrow V = 6\times10^{-5}$ m³; massa 1 kg; $\rho = \frac{1}{6\times10^{-5}} \approx 16\,700$ kg/m³, menor que a do ouro: tem prata misturada. É a história (talvez lenda) de Arquimedes e a coroa do rei Hierão.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Num tubo em U com água, despeja-se óleo (800 kg/m³) num dos ramos, formando uma coluna de 10 cm acima da superfície de separação. Que altura de água, no outro ramo, fica acima do nível dessa superfície (em cm)?</p>`, fig: tuboU, num: { v: 8, un: "cm" }, dicas: [R`<p>Pontos no mesmo nível, no mesmo líquido (a água) e ligados por ele, têm a mesma pressão.</p>`], resp: "8 cm", sol: R`<p>$\rho_\text{óleo}\cdot10 = \rho_\text{água}\,h \Rightarrow h = \frac{800\cdot10}{1000} = 8$ cm. O ramo do óleo fica 2 cm mais alto.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Uma comporta vertical de 4 m de largura segura 3 m de água. Qual a força total da água sobre ela (em N)?</p>`, fig: comporta(4, 3), num: { v: 180000, un: "N" }, dicas: [R`<p>A pressão média é a do meio da altura: $\rho g\frac h2$.</p>`], resp: "1,8 × 10⁵ N", sol: R`<p>$F = \frac{\rho gwh^2}2 = \frac{1000\cdot10\cdot4\cdot9}{2} = 1{,}8\times10^5$ N, aplicada a 1 m do fundo. Quem usa a pressão do fundo ($\rho gh$) vezes a área acha o dobro.</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>Um balão de 1 m³ cheio de hélio (0,18 kg/m³) está no ar (1,2 kg/m³). Desprezando a massa da borracha, qual a força resultante para cima (em N)?</p>`, num: { v: 10.2, un: "N" }, dicas: [R`<p>Arquimedes vale para gases: o empuxo é o peso do ar deslocado.</p>`], resp: "10,2 N", sol: R`<p>$E - P = (1{,}2 - 0{,}18)\cdot1\cdot10 = 10{,}2$ N: dá para erguer uns 1 kg.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · fluidos em repouso</div>
        <div class="q">Um navio de aço com dezenas de milhares de toneladas flutua, e uma bolinha de aço de 1 grama afunda. Como?</div>
        <p>A água empurra para cima com o peso da água que o objeto desloca. O casco oco desloca um volume enorme de água; a bolinha maciça, quase nada. Quem decide é a densidade média, não o material.</p></div>`),

      F.secao("pressao", "Pressão e a lei de Stevin", R`
        ${F.formula(R`p = \frac FA\ \ (\text{Pa} = \text{N/m}^2),\qquad \rho = \frac mV,\qquad 1\ \text{atm} \approx 1{,}01\times10^5\ \text{Pa}`, "Pressão e densidade")}
        <h3>Teorema 1: lei de Stevin</h3>
        ${F.demo("demonstração", R`<p>(i) Isole uma coluna vertical de líquido parado, com base de área $A$ e altura $h$, com o topo na superfície.</p>
          <p>(ii) Na vertical, ela está em equilíbrio: a força de baixo para cima ($pA$) equilibra a de cima ($p_0A$) mais o peso ($\rho Ahg$).</p>
          <p>(iii) $pA = p_0A + \rho Ahg \Rightarrow p = p_0 + \rho gh$. Na horizontal, o mesmo argumento mostra que pontos na mesma altura (no mesmo líquido, ligados por ele) têm a mesma pressão. $\blacksquare$</p>`)}
        ${F.formula(R`p = p_0 + \rho gh`, "Lei de Stevin")}
        ${F.caixa("pegadinha", R`<p><b>A pressão no fundo não depende da forma do recipiente nem da quantidade de líquido</b>, só da profundidade. Uma represa fina e uma represa larga com a mesma altura de água sofrem a mesma pressão no pé. E a pressão age em todas as direções, sempre perpendicular à superfície em que encosta.</p>`)}`),

      F.secao("pascal", "Pascal e a prensa hidráulica", R`
        <h3>Teorema 2: princípio de Pascal</h3>
        ${F.demo("demonstração", R`<p>(i) Pela lei de Stevin, a diferença de pressão entre dois pontos do líquido, $\rho g\Delta h$, só depende da diferença de altura.</p>
          <p>(ii) Se a pressão num ponto aumenta de $\Delta p$ (empurrando um pistão), essa diferença não muda, então todos os pontos aumentam do mesmo $\Delta p$. $\blacksquare$</p>`)}
        ${F.formula(R`\frac{F_1}{A_1} = \frac{F_2}{A_2},\qquad F_1d_1 = F_2d_2`, "Prensa hidráulica (pressão igual; trabalho igual)")}
        <p>Freio de carro, macaco hidráulico, cadeira do dentista: multiplicam força. O volume que sai de um pistão entra no outro ($A_1d_1 = A_2d_2$), então a energia se conserva ${F.ret("A11")}.</p>`),

      F.secao("arquimedes", "Empuxo: o princípio de Arquimedes", R`
        <h3>Teorema 3: o empuxo é o peso do líquido deslocado</h3>
        ${F.demo("demonstração", R`<p>(i) <b>Argumento da substituição</b>: troque o corpo por uma porção do próprio líquido, com a mesma forma. Essa porção fica parada; logo, a força que o resto do líquido faz nela equilibra o peso dela: $E = \rho_\text{líq}V_\text{sub}g$.</p>
          <p>(ii) Essa força só depende da pressão na superfície da porção, que é a mesma quando o corpo volta para o lugar. Então o corpo recebe o mesmo empuxo, vertical para cima, aplicado no centro do volume deslocado.</p>
          <p>(iii) Conferência com um cilindro de base $A$ e altura $H$, de pé: em cima, $p_1A$ para baixo; embaixo, $(p_1 + \rho gH)A$ para cima. As laterais se cancelam. Saldo: $\rho gHA = \rho gV$. $\blacksquare$</p>`)}
        ${F.formula(R`E = \rho_\text{líq}\,V_\text{sub}\,g;\qquad \text{flutuando}: \frac{V_\text{sub}}V = \frac{\rho_\text{corpo}}{\rho_\text{líq}}`, "Empuxo e flutuação")}
        <div id="lab-empuxo"></div>
        ${F.caixa("fisico", R`<p><b>Submarinos e peixes</b> controlam a densidade média: o submarino enche ou esvazia tanques de lastro; muitos peixes têm a bexiga natatória, uma bolsa de gás que eles inflam ou esvaziam para ficar parados em qualquer profundidade sem nadar.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Força numa parede = pressão média × área</b> (só para paredes retangulares a partir da superfície), mas o ponto de aplicação fica a $h/3$ do fundo, não no meio. Para torques em comportas e represas, integre ${F.ret("F04")}. E Arquimedes resolve "o nível sobe ou desce?": compare o volume deslocado antes e depois.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, a lei de Stevin vira $\nabla p = \rho\vec g$, o caso parado da equação de Euler ${F.ret("N03")}; o empuxo sai do teorema da divergência aplicado à pressão sobre uma superfície fechada ${F.ret("matematica/TE02")}. Num fluido em rotação ou num foguete acelerando, o "$g$" efetivo muda e a superfície da água se inclina ou vira um paraboloide.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-empuxo"); e.outerHTML = F.lab("Empuxo no dinamômetro", "lab-empuxo"); SIM.empuxo(document.getElementById("lab-empuxo"), F); },
});
