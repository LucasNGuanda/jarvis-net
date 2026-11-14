/* A08 · Leis de Newton. Conferido em Python (g = 10 m/s²):
   10 N em 2 kg: 5 m/s²; 70 kg: 700 N; 6 N ⊥ 8 N em 2 kg: 5 m/s²; plano de 30° sem atrito: 5 m/s²;
   blocos 3 + 2 kg empurrados com 20 N: a = 4, força entre eles 8 N; Atwood 3 e 2 kg: a = 2 m/s², T = 24 N;
   elevador ±2 m/s² com 60 kg: 720 N e 480 N; mesa 4 kg + pendurado 1 kg: a = 2 m/s², T = 8 N;
   trem 1 + 2 + 3 kg puxado com 12 N: a = 2, tração entre 2 e 3: 6 N; plano de 37° (5 kg) com 5 kg pendurado: 2 m/s²;
   polia móvel (m₁ = 4 kg na polia móvel, m₂ = 3 kg): a₂ = 2,5 m/s², a₁ = 1,25 m/s², T = 22,5 N;
   chefão: cunha com aceleração A = g·tg θ segura o bloco; θ = 30°: A = 5,77 m/s², N = mg/cos θ = 1,155 mg, g_ef = 11,5 m/s². */
F.registrar("A08", {
  retoma: ["A03", "A05", "F02"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const bloco = (x, y, w, h, cor, rot) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" style="fill:color-mix(in srgb,${cor} 30%,transparent);stroke:${cor};stroke-width:2"/>` + (rot ? D.txt(x + w / 2, y + h / 2 + 5, rot, "tx2") : "");
    const plano = (ang, extra = "") => { const L = 260, x0 = 120, y0 = 150, x1 = x0 + L * Math.cos((ang * Math.PI) / 180), y1 = y0 - L * Math.sin((ang * Math.PI) / 180); return fig(`<polygon points="${x0},${y0} ${x1},${y0} ${x1},${y1}" style="fill:var(--line2);stroke:var(--ink2)"/>` + D.txt(x0 + 46, y0 - 8, `${ang}°`, "tx2") + extra); };
    const polia = (cx, cy, r = 16) => `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:color-mix(in srgb,var(--ink3) 25%,transparent);stroke:var(--ink2);stroke-width:2"/><circle cx="${cx}" cy="${cy}" r="2.5" style="fill:var(--ink)"/>`;
    const exemplos = F.exemplo({
      titulo: "Segunda lei na prática",
      casos: [
        { nome: "Fácil: blocos encostados", gerar: (p) => {
          const m1 = p ? 3 : F.escolha([2, 3, 4]), m2 = p ? 2 : F.escolha([1, 2, 6]), Fo = p ? 20 : F.escolha([10, 20, 30]), a = Fo / (m1 + m2);
          return { enun: R`<p>Dois blocos, de ${m1} kg e ${m2} kg, estão encostados sobre uma mesa sem atrito. Uma força horizontal de ${Fo} N empurra o bloco de ${m1} kg. Qual a aceleração do conjunto e a força que um bloco faz no outro?</p>`,
            fig: fig(`<line x1="60" x2="500" y1="130" y2="130" style="stroke:var(--ink2);stroke-width:2"/>` + bloco(200, 70, 80, 60, "var(--mA)", `${m1} kg`) + bloco(280, 90, 60, 40, "var(--mT)", `${m2} kg`) + D.seta(120, 100, 198, 100, "var(--warn)") + D.txt(150, 90, `${Fo} N`, "tx2"), 150),
            passos: [R`<p>(i) Conjunto (as forças entre os blocos são internas e se cancelam pela 3ª lei): $${Fo} = (${m1} + ${m2})a \Rightarrow a = ${F.n(a, 3)}$ m/s².</p>`, R`<p>(ii) Isole o bloco de ${m2} kg: a única força horizontal nele é a força $f$ do outro bloco. $f = ${m2}\cdot${F.n(a, 3)} = ${F.n(m2 * a, 3)}$ N.</p>`, R`<p>(iii) Pela 3ª lei, o de ${m2} kg empurra o de ${m1} kg com ${F.nt(m2 * a, 3)} N para trás. Confira no de ${m1} kg: $${Fo} - ${F.n(m2 * a, 3)} = ${m1}\cdot${F.n(a, 3)}$. ✓</p>`] };
        } },
        { nome: "Médio: máquina de Atwood", gerar: (p) => {
          const m1 = p ? 3 : F.escolha([3, 5, 6]), m2 = p ? 2 : F.escolha([1, 2, 4]), a = ((m1 - m2) * 10) / (m1 + m2), T = (2 * m1 * m2 * 10) / (m1 + m2);
          return { enun: R`<p>Uma máquina de Atwood tem blocos de ${m1} kg e ${m2} kg ligados por um fio ideal numa polia ideal. Ache a aceleração e a tração no fio. ($g = 10$ m/s²)</p>`,
            fig: fig(polia(280, 30, 24) + `<line x1="256" y1="30" x2="256" y2="100" style="stroke:var(--ink)"/><line x1="304" y1="30" x2="304" y2="80" style="stroke:var(--ink)"/>` + bloco(236, 100, 40, 40, "var(--mA)", `${m1}`) + bloco(289, 80, 30, 30, "var(--mT)", `${m2}`), 160),
            passos: [R`<p>(i) Bloco de ${m1} kg (desce): $${m1 * 10} - T = ${m1}a$. Bloco de ${m2} kg (sobe): $T - ${m2 * 10} = ${m2}a$.</p>`, R`<p>(ii) Somando, $T$ some: $${(m1 - m2) * 10} = ${m1 + m2}a \Rightarrow a = ${F.n(a, 3)}$ m/s².</p>`, R`<p>(iii) $T = ${m2 * 10} + ${m2}\cdot${F.n(a, 3)} = ${F.n(T, 3)}$ N, entre os dois pesos (${m2 * 10} N e ${m1 * 10} N), como deve ser.</p>`] };
        } },
        { nome: "Olimpíada: polia móvel", gerar: (p) => {
          const m1 = p ? 4 : F.escolha([4, 6]), m2 = p ? 3 : F.escolha([3, 4, 5]), a2 = (2 * (2 * m2 - m1) * 10) / (4 * m2 + m1), a1 = a2 / 2, T = m2 * (10 - a2);
          return { enun: R`<p>Um fio tem uma ponta presa no teto, passa por baixo de uma polia móvel (que segura um bloco de ${m1} kg), sobe, passa por uma polia fixa no teto e segura na outra ponta um bloco de ${m2} kg. Polias e fio ideais. Ache as acelerações dos dois blocos e a tração.</p>`,
            fig: fig(`<line x1="160" y1="12" x2="420" y2="12" style="stroke:var(--ink2);stroke-width:4"/>` + polia(330, 32) + polia(230, 100) + `<line x1="214" y1="12" x2="214" y2="100" style="stroke:var(--ink)"/><line x1="246" y1="100" x2="314" y2="32" style="stroke:var(--ink)"/><line x1="346" y1="32" x2="346" y2="110" style="stroke:var(--ink)"/><line x1="230" y1="116" x2="230" y2="128" style="stroke:var(--ink)"/>` + bloco(208, 128, 44, 32, "var(--mA)", `${m1}`) + bloco(331, 110, 30, 30, "var(--mT)", `${m2}`), 170),
            passos: [R`<p>(i) <b>Vínculo</b>: se o bloco ${m2} desce $x$, o fio dos dois lados da polia móvel encurta $x/2$ cada: a polia móvel sobe $x/2$. Então $a_1 = \frac{a_2}2$.</p>`, R`<p>(ii) Segunda lei: bloco ${m2} (desce): $${m2 * 10} - T = ${m2}a_2$. Polia móvel + bloco ${m1} (sobem, puxados por dois trechos de fio): $2T - ${m1 * 10} = ${m1}\cdot\frac{a_2}{2}$.</p>`, R`<p>(iii) Da primeira, $T = ${m2}(10 - a_2)$; substituindo: $a_2 = \frac{2(2m_2 - m_1)g}{4m_2 + m_1} = ${F.n(a2, 4)}$ m/s², $a_1 = ${F.n(a1, 4)}$ m/s², $T = ${F.n(T, 4)}$ N. ${a2 < 0 ? "O sinal negativo indica que o bloco " + m2 + " sobe." : ""}</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A cunha que segura o bloco",
      enun: R`<p>Um bloco de massa $m$ está sobre a face sem atrito de uma cunha de ângulo $\theta$. A cunha é empurrada horizontalmente (para o lado da face inclinada) com aceleração $A$. (a) Desenhe as forças no bloco (no referencial do chão). (b) Para que valor de $A$ o bloco fica parado em relação à cunha? (c) Quanto vale a normal nesse caso? Compare com $mg$. (d) Se $A$ for maior que esse valor, o bloco sobe a rampa: qual a aceleração dele em relação à cunha? (e) Calcule (b) e (c) para $\theta = 30°$ e $g = 10$ m/s². (f) Para quem está na cunha, tudo se passa como se a gravidade fosse $\vec g_\text{ef} = \vec g - \vec A$. Mostre que $\vec g_\text{ef}$ fica perpendicular à rampa no caso (b) e ache seu módulo.</p>`,
      fig: fig(`<polygon points="160,150 380,150 380,40" style="fill:var(--line2);stroke:var(--ink2)"/><line x1="40" x2="520" y1="150" y2="150" style="stroke:var(--ink2);stroke-width:2"/>` + `<rect x="250" y="68" width="34" height="24" transform="rotate(-26.6 267 80)" style="fill:color-mix(in srgb,var(--mA) 30%,transparent);stroke:var(--mA);stroke-width:2"/>` + D.seta(420, 100, 480, 100, "var(--warn)") + D.txt(450, 90, "A", "txm") + D.txt(200, 144, "θ", "txm"), 165),
      dicas: [R`<p>(a) Só duas forças: peso e normal (perpendicular à rampa). Parado na cunha = mesma aceleração $A$ horizontal.</p>`, R`<p>(b) Vertical: $N\cos\theta = mg$. Horizontal: $N\sin\theta = mA$.</p>`],
      sol: R`<p><b>(a)</b> Peso $m\vec g$ (para baixo) e normal $\vec N$, perpendicular à face, inclinada de $\theta$ em relação à vertical, com componente horizontal no sentido de $\vec A$.</p>
        <p><b>(b)</b> Parado na cunha, o bloco tem a aceleração $A$ (horizontal) e nenhuma vertical: $N\cos\theta = mg$ e $N\sin\theta = mA$. Dividindo: $A = g\tan\theta$.</p>
        <p><b>(c)</b> $N = \frac{mg}{\cos\theta} > mg$: a cunha "aperta" mais o bloco do que se estivesse parada (aí seria $mg\cos\theta$, ainda menor).</p>
        <p><b>(d)</b> Com $A > g\tan\theta$, use o referencial da cunha com $\vec g_\text{ef} = \vec g - \vec A$ ${F.ret("A05")}: ao longo da rampa (para cima), a componente de $-\vec A$ é $A\cos\theta$ e a de $\vec g$ é $-g\sin\theta$. Aceleração relativa: $a_\text{rel} = A\cos\theta - g\sin\theta$ (para cima da rampa).</p>
        <p><b>(e)</b> $A = 10\tan30° \approx 5{,}77$ m/s²; $N = \frac{mg}{\cos30°} \approx 1{,}155\,mg$.</p>
        <p><b>(f)</b> $\vec g_\text{ef}$ tem componentes $(-A, -g)$, e $\frac{A}{g} = \tan\theta$: aponta exatamente perpendicular à rampa (para dentro dela). Por isso o bloco não tem "por que" escorregar. Módulo: $\sqrt{g^2 + A^2} = \frac{g}{\cos\theta} \approx 11{,}5$ m/s². Um pêndulo pendurado dentro dessa cunha ficaria perpendicular à rampa. Conferido em Python.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Uma força resultante de 10 N age num corpo de 2 kg. Qual a aceleração?</p>`, num: { v: 5, un: "m/s²" }, dicas: [R`<p>$a = F/m$.</p>`], resp: "5 m/s²", sol: R`<p>$\frac{10}{2} = 5$ m/s².</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Qual o peso de uma pessoa de 70 kg, na Terra ($g = 10$ m/s²)?</p>`, num: { v: 700, un: "N" }, dicas: [R`<p>$P = mg$.</p>`], resp: "700 N", sol: R`<p>Na Lua ($g \approx 1{,}6$ m/s²), o peso seria uns 112 N, mas a massa continua 70 kg.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Duas forças perpendiculares, de 6 N e 8 N, agem num corpo de 2 kg. Qual o módulo da aceleração?</p>`, fig: fig(bloco(250, 70, 50, 50, "var(--mA)", "2 kg") + D.seta(300, 95, 380, 95, "var(--warn)") + D.seta(275, 70, 275, 10, "var(--mT)") + D.txt(345, 88, "8 N", "tx2") + D.txt(296, 34, "6 N", "tx2"), 140), num: { v: 5, un: "m/s²" }, dicas: [R`<p>Resultante: soma vetorial ${F.ret("F02")}.</p>`], resp: "5 m/s²", sol: R`<p>$F_R = \sqrt{36 + 64} = 10$ N; $a = 5$ m/s², na direção da resultante.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Um livro está parado sobre uma mesa. Pela 3ª lei, qual é a reação ao peso do livro?</p>`, alts: ["a normal que a mesa faz no livro", "a força que o livro faz na mesa", "a força gravitacional que o livro faz na Terra", "o atrito", "não há reação, porque o livro está parado"], certa: "C", dicas: [R`<p>Ação e reação agem em corpos <b>diferentes</b> e são do mesmo tipo de interação.</p>`], resp: "C", sol: R`<p>O peso é a Terra puxando o livro (gravitação); a reação é o livro puxando a Terra. A normal e o peso agem no <b>mesmo</b> corpo: se equilibram (1ª lei), mas não são par de ação e reação. <b>A</b> é o erro mais comum.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Um bloco desliza num plano inclinado de 30° sem atrito. Qual a aceleração? ($g = 10$ m/s²)</p>`, fig: plano(30, bloco(232, 70, 34, 24, "var(--mA)")), num: { v: 5, un: "m/s²" }, dicas: [R`<p>Só a componente do peso ao longo do plano acelera: $mg\sin\theta$ ${F.ret("F03")}.</p>`], resp: "5 m/s²", sol: R`<p>$a = g\sin30° = 5$ m/s², qualquer que seja a massa.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Dois blocos, de 3 kg e 2 kg, encostados numa mesa sem atrito, são empurrados por 20 N aplicados no de 3 kg. Qual a força que o de 3 kg faz no de 2 kg?</p>`, fig: fig(`<line x1="60" x2="500" y1="130" y2="130" style="stroke:var(--ink2);stroke-width:2"/>` + bloco(200, 70, 80, 60, "var(--mA)", "3 kg") + bloco(280, 90, 60, 40, "var(--mT)", "2 kg") + D.seta(120, 100, 198, 100, "var(--warn)") + D.txt(150, 90, "20 N", "tx2"), 150), num: { v: 8, un: "N" }, dicas: [R`<p>Aceleração do conjunto primeiro.</p>`], resp: "8 N", sol: R`<p>$a = 4$ m/s²; no de 2 kg: $f = 2\cdot4 = 8$ N.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Numa máquina de Atwood com blocos de 3 kg e 2 kg, qual a aceleração?</p>`, num: { v: 2, un: "m/s²" }, dicas: [R`<p>$a = \frac{(m_1 - m_2)g}{m_1 + m_2}$.</p>`], resp: "2 m/s²", sol: R`<p>$\frac{10}{5} = 2$ m/s².</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>No exercício anterior, qual a tração no fio?</p>`, num: { v: 24, un: "N" }, dicas: [R`<p>Use a 2ª lei num dos blocos.</p>`], resp: "24 N", sol: R`<p>$T = 20 + 2\cdot2 = 24$ N.</p>` }),
      F.exercicio({ n: 9, nivel: "Físico", enun: R`<p>Uma pessoa de 60 kg está numa balança dentro de um elevador que sobe acelerando a 2 m/s². Quanto a balança marca, em newtons?</p>`, num: { v: 720, un: "N" }, dicas: [R`<p>A balança mede a normal. $N - mg = ma$.</p>`], resp: "720 N", sol: R`<p>$N = 60(10 + 2) = 720$ N: "parece" 72 kg.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>E se o elevador estiver <b>descendo</b> e <b>acelerando</b> a 2 m/s²?</p>`, num: { v: 480, un: "N" }, dicas: [R`<p>Agora a aceleração aponta para baixo.</p>`], resp: "480 N", sol: R`<p>$N = 60(10 - 2) = 480$ N. Descendo e freando, a aceleração aponta para cima e a balança marcaria 720 N de novo: o que importa é o sentido da aceleração, não o do movimento.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Um bloco de 4 kg sobre uma mesa sem atrito está ligado, por um fio que passa por uma polia na borda, a um bloco de 1 kg pendurado. Qual a aceleração do sistema?</p>`, fig: fig(`<rect x="100" y="80" width="300" height="12" style="fill:var(--line2)"/>` + bloco(180, 48, 60, 32, "var(--mA)", "4 kg") + polia(412, 72, 12) + `<line x1="240" y1="64" x2="412" y2="60" style="stroke:var(--ink)"/><line x1="424" y1="72" x2="424" y2="120" style="stroke:var(--ink)"/>` + bloco(410, 120, 28, 28, "var(--mT)", "1"), 160), num: { v: 2, un: "m/s²" }, dicas: [R`<p>A única força que move o conjunto é o peso do bloco pendurado.</p>`], resp: "2 m/s²", sol: R`<p>$a = \frac{1\cdot10}{4 + 1} = 2$ m/s²; tração $T = 4\cdot2 = 8$ N (menor que o peso do bloco pendurado, 10 N: senão ele não desceria acelerando).</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Três blocos, de 1 kg, 2 kg e 3 kg, estão ligados em fila por fios numa mesa sem atrito. Uma força de 12 N puxa o de 3 kg (na frente). Qual a tração no fio entre o de 2 kg e o de 3 kg?</p>`, fig: fig(`<line x1="40" x2="520" y1="120" y2="120" style="stroke:var(--ink2);stroke-width:2"/>` + bloco(80, 90, 40, 30, "var(--mA)", "1") + bloco(170, 84, 50, 36, "var(--mA)", "2") + bloco(270, 78, 60, 42, "var(--mA)", "3") + `<line x1="120" y1="105" x2="170" y2="105" style="stroke:var(--ink)"/><line x1="220" y1="102" x2="270" y2="102" style="stroke:var(--ink)"/>` + D.seta(330, 99, 420, 99, "var(--warn)") + D.txt(380, 90, "12 N", "tx2"), 140), num: { v: 6, un: "N" }, dicas: [R`<p>$a = \frac{12}{6}$. Esse fio puxa os blocos de 1 e 2 kg juntos.</p>`], resp: "6 N", sol: R`<p>$a = 2$ m/s²; $T = (1 + 2)\cdot2 = 6$ N. Entre o de 1 e o de 2: 2 N.</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>Um bloco de 5 kg num plano inclinado de 37° sem atrito ($\sin37° = 0{,}6$) está ligado, por um fio que passa por uma polia no alto do plano, a um bloco de 5 kg pendurado. Qual a aceleração?</p>`, fig: plano(37, polia(388, 50, 10) + bloco(250, 92, 34, 24, "var(--mA)", "5") + `<line x1="398" y1="50" x2="398" y2="96" style="stroke:var(--ink)"/>` + bloco(386, 96, 24, 24, "var(--mT)", "5")), num: { v: 2, un: "m/s²" }, dicas: [R`<p>O bloco pendurado puxa com 50 N; a componente do peso do outro ao longo do plano segura com $50\cdot0{,}6$.</p>`], resp: "2 m/s²", sol: R`<p>$a = \frac{50 - 30}{10} = 2$ m/s²; o pendurado desce.</p>` }),
      F.exercicio({ n: 14, nivel: "Máximo", enun: R`<p>Num ônibus que freia de repente, os passageiros "são jogados" para a frente. A melhor explicação é:</p>`, alts: ["Uma força para a frente age nos passageiros durante a freada.", "Os passageiros tendem a continuar com a velocidade que tinham (inércia); é o ônibus que desacelera embaixo deles.", "A freada cria uma força de reação nos passageiros.", "O peso dos passageiros fica inclinado.", "O ar dentro do ônibus empurra os passageiros."], certa: "B", dicas: [R`<p>Olhe do referencial da rua (inercial).</p>`], resp: "B", sol: R`<p>Da rua, ninguém empurra os passageiros para a frente: eles continuam andando (1ª lei) até o banco, o cinto ou o atrito nos pés freá-los. A "força para a frente" só aparece no referencial do ônibus, que não é inercial (é uma força fictícia).</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · dinâmica</div>
        <div class="q">Se um cavalo puxa uma carroça e a carroça puxa o cavalo com a mesma força (3ª lei), como eles conseguem andar?</div>
        <p>Porque as duas forças agem em corpos <b>diferentes</b>: para saber se a carroça acelera, só contam as forças <b>nela</b> (o puxão do cavalo e o atrito do chão). As três leis de Newton dizem o que faz um corpo mudar de velocidade, e são o coração de toda a mecânica.</p></div>`),

      F.secao("leis", "As três leis", R`
        <p><b>1ª lei (inércia)</b>: um corpo com força resultante nula continua parado ou em MRU. Isso não vale em qualquer referencial: os referenciais em que vale são os <b>inerciais</b> (a rua, com boa aproximação; o ônibus freando, não).</p>
        ${F.formula(R`\vec F_R = \sum\vec F = m\vec a`, "2ª lei de Newton (princípio fundamental da dinâmica)")}
        <p><b>2ª lei</b>: a aceleração tem a direção e o sentido da força <b>resultante</b> e é inversamente proporcional à massa. Unidade: 1 N $=$ 1 kg·m/s². É uma equação vetorial: vale em cada direção separadamente, $F_x = ma_x$ e $F_y = ma_y$ ${F.ret("F02")}.</p>
        <p><b>3ª lei (ação e reação)</b>: se A faz uma força em B, B faz em A uma força de mesmo módulo, mesma direção e sentido oposto, do mesmo tipo de interação, ao mesmo tempo. Ação e reação nunca se cancelam, porque agem em corpos diferentes.</p>
        ${F.caixa("pegadinha", R`<p><b>Normal não é reação do peso.</b> No livro parado sobre a mesa, peso e normal se cancelam por causa da 1ª lei (livro em equilíbrio), não da 3ª. A reação do peso é a força do livro na Terra; a reação da normal é a força do livro na mesa. Se a mesa subir acelerando, a normal fica maior que o peso, e a 3ª lei continua valendo.</p>`)}
        <h3>Forças que aparecem sempre</h3>
        <ul><li><b>Peso</b> $\vec P = m\vec g$: a atração da Terra, para baixo.</li>
          <li><b>Normal</b> $\vec N$: a força de contato perpendicular à superfície. Ela vale o que precisar para o corpo não atravessar a superfície (não é sempre $mg$!).</li>
          <li><b>Tração</b> $\vec T$: a força de um fio, sempre puxando, ao longo dele. Num fio ideal (sem massa) e com polias ideais, a tração é a mesma ao longo do fio todo.</li>
          <li><b>Atrito</b>: o próximo tema ${F.ret("A09")}.</li></ul>
        <div id="lab-atw"></div>`),

      F.secao("aplicacoes", "Método e aplicações clássicas", R`
        <p><b>Método</b>: (1) separe cada corpo; (2) desenhe só as forças <b>nele</b> (diagrama de corpo livre); (3) escolha eixos (de preferência um deles na direção da aceleração); (4) escreva $F_R = ma$ em cada eixo; (5) use os vínculos (fio inextensível: mesmas acelerações) e resolva.</p>
        <h3>Teorema 1: plano inclinado sem atrito</h3>
        ${F.demo("demonstração", R`<p>(i) Forças no bloco: peso e normal. Eixos: $x$ ao longo do plano (para baixo), $y$ perpendicular.</p>
          <p>(ii) O peso tem componentes $mg\sin\theta$ (em $x$) e $mg\cos\theta$ (em $y$, contra o plano) ${F.ret("F03")}.</p>
          <p>(iii) Em $y$ não há aceleração: $N = mg\cos\theta$. Em $x$: $mg\sin\theta = ma \Rightarrow a = g\sin\theta$. $\blacksquare$</p>`)}
        <h3>Teorema 2: máquina de Atwood</h3>
        ${F.demo("demonstração", R`<p>(i) Com $m_1 > m_2$: o bloco 1 desce e o 2 sobe, com a mesma aceleração $a$ (fio inextensível) e a mesma tração $T$ (fio e polia ideais).</p>
          <p>(ii) Bloco 1: $m_1g - T = m_1a$. Bloco 2: $T - m_2g = m_2a$.</p>
          <p>(iii) Somando: $(m_1 - m_2)g = (m_1 + m_2)a$. Substituindo de volta, $T = m_2(g + a) = \frac{2m_1m_2g}{m_1 + m_2}$.</p>
          ${F.formula(R`a = \frac{(m_1 - m_2)\,g}{m_1 + m_2},\qquad T = \frac{2m_1m_2\,g}{m_1 + m_2}`, "Máquina de Atwood")}
          <p>(iv) Atwood (1784) usou isso para "diluir" a gravidade: com massas quase iguais, a aceleração fica pequena e fácil de medir. $\blacksquare$</p>`)}
        <h3>Teorema 3: peso aparente no elevador</h3>
        ${F.demo("demonstração", R`<p>(i) Pessoa sobre a balança, elevador com aceleração $a$ (positiva para cima). Forças na pessoa: peso $mg$ (para baixo) e normal $N$ (para cima).</p>
          <p>(ii) $N - mg = ma \Rightarrow N = m(g + a)$. A balança marca $N$ (pela 3ª lei, a pessoa aperta a balança com $N$).</p>
          <p>(iii) Em queda livre, $a = -g$ e $N = 0$: a "imponderabilidade" dos astronautas na estação espacial, que está o tempo todo caindo em volta da Terra. $\blacksquare$</p>`)}
        ${F.caixa("fisico", R`<p><b>Massa × peso</b>: a massa (kg) mede a inércia, a "resistência" a mudar de velocidade, e é a mesma em qualquer lugar. O peso (N) é uma força e depende de $g$. Uma balança de banheiro mede uma força e divide por 10 para mostrar "kg": no elevador acelerando, ela "erra".</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Vínculos geométricos</b>: em sistemas com polias móveis, escreva primeiro a relação entre os deslocamentos (comprimento do fio constante) e derive duas vezes para ter a relação entre as acelerações. Na polia móvel simples, $a_\text{polia} = \frac{a_\text{ponta}}2$. Esquecer o vínculo é o erro número 1 em olimpíada.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, a 2ª lei é escrita como $\vec F = \frac{d\vec p}{dt}$ (vale até para massa variável, como o foguete ${F.ret("A12")}), e a mecânica de Newton é reescrita com energia: Lagrange e Hamilton ${F.ret("U03")}. Em referenciais acelerados, aparecem forças fictícias $-m\vec A$ (veja o chefão).</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-atw"); e.outerHTML = F.lab("Máquina de Atwood e elevador", "lab-atw"); SIM.atwood(document.getElementById("lab-atw"), F); },
});
