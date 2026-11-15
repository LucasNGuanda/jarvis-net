/* A09 · Atrito e Resistência do Ar. Conferido em Python (g = 10 m/s²):
   10 kg, μc = 0,3: 30 N; μe = 0,5: 50 N para tirar do lugar; com 50 N e μc 0,3: a = 2 m/s²; ângulo crítico com μe 0,75: 36,9°;
   descendo 37° com μc 0,5: 2 m/s²; freada a 20 m/s com μc 0,8: 25 m; paraquedista 80 kg, k = 0,32 kg/m: 50 m/s;
   puxado a 37° com 50 N, 10 kg, μc 0,5: N = 70 N, a = 0,5 m/s²; bloco 2 kg sobre 3 kg com μe 0,4: F máx = 20 N;
   subindo 30° com 10 m/s e μc 0,25: a = 7,17 m/s², sobe 6,98 m;
   força ótima para arrastar (μ = 0,5, 20 kg): F mín = μmg/√(1 + μ²) = 89,4 N a 26,6° (= arctg μ), busca numérica confere;
   chefão: caixa na caçamba (μe 0,5, μc 0,4), caminhão a 20 m/s freia a 6 m/s², caixa a 3 m da cabine: a_rel = 2 m/s², bate em 1,73 s a 3,46 m/s. */
F.registrar("A09", {
  retoma: ["A08", "A03", "F03"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 160) => D.svg(560, h, conteudo, "figura");
    const bloco = (x, y, w, h, cor, rot) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" style="fill:color-mix(in srgb,${cor} 30%,transparent);stroke:${cor};stroke-width:2"/>` + (rot ? D.txt(x + w / 2, y + h / 2 + 5, rot, "tx2") : "");
    const chao = (y = 130) => `<line x1="40" x2="520" y1="${y}" y2="${y}" style="stroke:var(--ink2);stroke-width:2"/>` + Array.from({ length: 24 }, (_, i) => `<line x1="${40 + i * 20}" y1="${y}" x2="${32 + i * 20}" y2="${y + 8}" style="stroke:var(--ink3)"/>`).join("");
    const plano = (ang, extra = "") => { const L = 260, x0 = 120, y0 = 150, x1 = x0 + L * Math.cos((ang * Math.PI) / 180), y1 = y0 - L * Math.sin((ang * Math.PI) / 180); return fig(`<polygon points="${x0},${y0} ${x1},${y0} ${x1},${y1}" style="fill:var(--line2);stroke:var(--ink2)"/>` + D.txt(x0 + 46, y0 - 8, `${ang}°`, "tx2") + extra); };
    const exemplos = F.exemplo({
      titulo: "Atrito",
      casos: [
        { nome: "Fácil: estático ou cinético?", gerar: (p) => {
          const m = p ? 10 : F.escolha([5, 10, 20]), me = p ? 0.5 : F.escolha([0.4, 0.5, 0.6]), mc = p ? 0.3 : F.escolha([0.2, 0.3]), Fo = p ? 40 : F.escolha([20, 40, 60, 80]), N = m * 10, fmax = me * N, desliza = Fo > fmax;
          return { enun: R`<p>Um caixote de ${m} kg está parado no chão ($\mu_e = ${F.n(me)}$, $\mu_c = ${F.n(mc)}$). Alguém o empurra horizontalmente com ${Fo} N. Qual o atrito e qual a aceleração?</p>`,
            fig: fig(chao() + bloco(240, 70, 70, 60, "var(--mA)", `${m} kg`) + D.seta(160, 100, 238, 100, "var(--warn)") + D.txt(190, 90, `${Fo} N`, "tx2"), 150),
            passos: [R`<p>(i) Normal: $N = mg = ${N}$ N. Atrito estático máximo: $\mu_eN = ${F.n(fmax)}$ N.</p>`, desliza ? R`<p>(ii) $${Fo} > ${F.n(fmax)}$: o estático não aguenta, o caixote desliza e o atrito passa a ser o cinético, $\mu_cN = ${F.n(mc * N)}$ N.</p>` : R`<p>(ii) $${Fo} \le ${F.n(fmax)}$: o estático aguenta. Ele vale <b>exatamente</b> ${Fo} N (o que for preciso para equilibrar), não ${F.nt(fmax)} N.</p>`, desliza ? R`<p>(iii) $a = \frac{${Fo} - ${F.n(mc * N)}}{${m}} = ${F.n((Fo - mc * N) / m, 3)}$ m/s².</p>` : R`<p>(iii) $a = 0$. O caixote fica parado.</p>`] };
        } },
        { nome: "Médio: plano inclinado com atrito", gerar: (p) => {
          const th = p ? 37 : F.escolha([30, 37, 45]), mc = p ? 0.5 : F.escolha([0.2, 0.3, 0.5]), s = Math.sin((th * Math.PI) / 180), c = Math.cos((th * Math.PI) / 180), a = 10 * (s - mc * c);
          return { enun: R`<p>Um bloco é solto num plano inclinado de ${th}° ($\mu_c = ${F.n(mc)}$; o estático não segura). Qual a aceleração? ($g = 10$ m/s²)</p>`,
            fig: plano(th, bloco(232, 70, 34, 24, "var(--mA)")),
            passos: [R`<p>(i) Eixos ao longo e perpendicular ao plano. Perpendicular: $N = mg\cos\theta$.</p>`, R`<p>(ii) Ao longo (para baixo): $mg\sin\theta - \mu_cmg\cos\theta = ma$, então $a = g(\sin\theta - \mu_c\cos\theta)$.</p>`, R`<p>(iii) $a = 10(${F.n(s, 4)} - ${F.n(mc)}\cdot${F.n(c, 4)}) \approx ${F.n(a, 3)}$ m/s². A massa some: blocos de qualquer massa (mesmo material) descem juntos.</p>`] };
        } },
        { nome: "Olimpíada: o melhor ângulo para puxar", gerar: (p) => {
          const m = p ? 20 : F.escolha([10, 20, 40]), mu = p ? 0.5 : F.escolha([0.3, 0.5, 0.75]), Fm = (mu * m * 10) / Math.sqrt(1 + mu * mu), al = (Math.atan(mu) * 180) / Math.PI;
          return { enun: R`<p>Você puxa um caixote de ${m} kg por uma corda que faz um ângulo $\alpha$ com o chão ($\mu = ${F.n(mu)}$). Para que ângulo a força necessária para arrastá-lo (com velocidade constante) é mínima? Quanto ela vale?</p>`,
            fig: fig(chao() + bloco(220, 70, 70, 60, "var(--mA)", `${m} kg`) + `<line x1="290" y1="90" x2="400" y2="40" style="stroke:var(--ink)"/>` + D.seta(290, 90, 380, 49, "var(--warn)") + D.txt(330, 96, "α", "txm"), 150),
            passos: [R`<p>(i) A componente vertical de $F$ alivia o chão: $N = mg - F\sin\alpha$. Horizontal (velocidade constante): $F\cos\alpha = \mu N = \mu(mg - F\sin\alpha)$.</p>`, R`<p>(ii) $F = \frac{\mu mg}{\cos\alpha + \mu\sin\alpha}$. O denominador $\cos\alpha + \mu\sin\alpha$ tem máximo $\sqrt{1 + \mu^2}$ quando $\tan\alpha = \mu$ ${F.ret("F03")} (é o $a\cos\theta + b\sin\theta \le \sqrt{a^2 + b^2}$).</p>`, R`<p>(iii) $\alpha = \arctan${F.n(mu)} \approx ${F.n(al, 1)}°$ e $F_\text{mín} = \frac{\mu mg}{\sqrt{1 + \mu^2}} \approx ${F.n(Fm, 3)}$ N, contra ${F.nt(mu * m * 10)} N puxando na horizontal.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A caixa solta na caçamba",
      enun: R`<p>Uma caixa está solta na caçamba de um caminhão, a 3 m da cabine. Entre a caixa e a caçamba, $\mu_e = 0{,}5$ e $\mu_c = 0{,}4$. (a) Qual a maior aceleração (ou freada) do caminhão sem a caixa escorregar? (b) O caminhão, a 20 m/s, freia com 6 m/s². Mostre que a caixa escorrega e ache a aceleração dela em relação ao chão e em relação ao caminhão. (c) A caixa bate na cabine antes de o caminhão parar? Com que velocidade relativa? (d) Qual a menor distância de frenagem do caminhão (a partir de 20 m/s) sem a caixa escorregar? ($g = 10$ m/s²)</p>`,
      fig: fig(chao(140) + `<rect x="120" y="80" width="300" height="12" style="fill:var(--line2);stroke:var(--ink2)"/><rect x="420" y="40" width="70" height="52" rx="6" style="fill:color-mix(in srgb,var(--mT) 25%,transparent);stroke:var(--mT);stroke-width:2"/><circle cx="170" cy="112" r="16" style="fill:var(--ink)"/><circle cx="450" cy="112" r="16" style="fill:var(--ink)"/>` + bloco(260, 52, 40, 28, "var(--mA)", "caixa") + D.seta(300, 40, 418, 40, "var(--ink3)", 1.2) + D.txt(360, 34, "3 m", "tx2") + D.seta(250, 20, 330, 20, "var(--warn)") + D.txt(240, 24, "20 m/s", "tx2", "end"), 165),
      dicas: [R`<p>(a) Quem acelera a caixa é só o atrito: o máximo é $\mu_emg$.</p>`, R`<p>(b, c) Escorregando, a caixa freia com $\mu_cg$, menos que o caminhão: no referencial do caminhão, ela anda para a frente com $6 - \mu_cg$.</p>`],
      sol: R`<p><b>(a)</b> A única força horizontal na caixa é o atrito, no máximo $\mu_emg$: $a_\text{máx} = \mu_eg = 5$ m/s².</p>
        <p><b>(b)</b> $6 > 5$: a caixa escorrega. O atrito vira cinético e a freia com $\mu_cg = 4$ m/s² (em relação ao chão). Em relação ao caminhão, que freia com 6, ela acelera para a frente com $6 - 4 = 2$ m/s².</p>
        <p><b>(c)</b> No referencial do caminhão, a caixa parte do repouso com 2 m/s²: $3 = \frac12\cdot2t^2 \Rightarrow t = \sqrt3 \approx 1{,}73$ s. O caminhão só para em $\frac{20}6 \approx 3{,}33$ s, então ainda está freando: a caixa bate na cabine com $2\cdot1{,}73 \approx 3{,}46$ m/s (12,5 km/h) de velocidade relativa. Nesse instante, ela ainda anda a $20 - 4\cdot1{,}73 \approx 13$ m/s em relação ao chão.</p>
        <p><b>(d)</b> Freando a no máximo 5 m/s²: $d = \frac{20^2}{2\cdot5} = 40$ m. Moral: carga solta exige freadas suaves (e amarração). Conferido em Python.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Um bloco de 10 kg desliza numa mesa com $\mu_c = 0{,}3$. Qual o atrito cinético?</p>`, fig: fig(chao() + bloco(240, 80, 60, 50, "var(--mA)", "10 kg") + D.seta(310, 70, 380, 70, "var(--ink3)", 1.4) + D.txt(345, 62, "v", "txm"), 150), num: { v: 30, un: "N" }, dicas: [R`<p>$f_c = \mu_cN$, com $N = mg$.</p>`], resp: "30 N", sol: R`<p>$0{,}3\cdot100 = 30$ N.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Com $\mu_e = 0{,}5$, qual a menor força horizontal para tirar do lugar esse bloco de 10 kg?</p>`, num: { v: 50, un: "N" }, dicas: [R`<p>Atrito estático máximo.</p>`], resp: "50 N (um pouco mais que isso)", sol: R`<p>$\mu_eN = 50$ N: qualquer força maior que 50 N tira o bloco do lugar.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Um bloco de 10 kg ($\mu_e = 0{,}5$) está parado e é empurrado com 20 N. Quanto vale o atrito?</p>`, alts: ["0", "20 N", "30 N", "50 N", "70 N"], certa: "B", dicas: [R`<p>O bloco continua parado. O que a 1ª lei exige?</p>`], resp: "B", sol: R`<p>Parado: resultante zero, então o atrito estático vale exatamente 20 N. O valor $\mu_eN = 50$ N é só o <b>máximo</b>. <b>D</b> é o erro clássico.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>O bloco de 10 kg ($\mu_c = 0{,}3$) é puxado horizontalmente com 50 N e desliza. Qual a aceleração?</p>`, num: { v: 2, un: "m/s²" }, dicas: [R`<p>Resultante = força − atrito cinético.</p>`], resp: "2 m/s²", sol: R`<p>$\frac{50 - 30}{10} = 2$ m/s².</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Uma moeda sobre um livro começa a escorregar quando o livro é inclinado. Se $\mu_e = 0{,}75$, a partir de que ângulo?</p>`, num: { v: 36.87, tol: 0.005, un: "graus" }, dicas: [R`<p>No limite: $mg\sin\theta = \mu_emg\cos\theta$.</p>`], resp: "≈ 36,9°", sol: R`<p>$\tan\theta = 0{,}75$, $\theta \approx 36{,}9°$. É um jeito simples de medir $\mu_e$ (Teorema 2).</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Um bloco desce um plano de 37° ($\sin37° = 0{,}6$, $\cos37° = 0{,}8$) com $\mu_c = 0{,}5$. Qual a aceleração?</p>`, fig: plano(37, bloco(232, 70, 34, 24, "var(--mA)")), num: { v: 2, un: "m/s²" }, dicas: [R`<p>$a = g(\sin\theta - \mu_c\cos\theta)$.</p>`], resp: "2 m/s²", sol: R`<p>$10(0{,}6 - 0{,}4) = 2$ m/s².</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Um carro a 20 m/s freia com as rodas travadas ($\mu_c = 0{,}8$ entre pneu e asfalto). Que distância percorre até parar?</p>`, num: { v: 25, un: "m" }, dicas: [R`<p>Desaceleração $\mu_cg$; depois Torricelli ${F.ret("A03")}.</p>`], resp: "25 m", sol: R`<p>$a = 8$ m/s²; $d = \frac{400}{16} = 25$ m. Com chão molhado ($\mu \approx 0{,}4$), o dobro.</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Um paraquedista de 80 kg (com equipamento) cai com o paraquedas fechado. A resistência do ar é $F = kv^2$, com $k = 0{,}32$ kg/m. Qual a velocidade terminal?</p>`, num: { v: 50, un: "m/s" }, dicas: [R`<p>Na velocidade terminal, $kv^2 = mg$.</p>`], resp: "50 m/s", sol: R`<p>$v = \sqrt{\frac{800}{0{,}32}} = 50$ m/s (180 km/h). Abrindo o paraquedas, $k$ aumenta muito e $v_t$ cai para uns 5 m/s.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Um caixote de 10 kg ($\mu_c = 0{,}5$) é puxado por uma corda a 37° com o chão, com 50 N. Qual a aceleração?</p>`, fig: fig(chao() + bloco(220, 70, 70, 60, "var(--mA)", "10 kg") + D.seta(290, 90, 370, 30, "var(--warn)") + D.txt(380, 30, "50 N a 37°", "tx2", "start"), 150), num: { v: 0.5, un: "m/s²" }, dicas: [R`<p>A corda inclinada diminui a normal: $N = mg - F\sin37°$.</p>`], resp: "0,5 m/s²", sol: R`<p>$N = 100 - 30 = 70$ N; atrito 35 N; horizontal $50\cdot0{,}8 = 40$ N; $a = \frac{40 - 35}{10} = 0{,}5$ m/s².</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Um bloco de 2 kg está sobre outro de 3 kg, que está num chão sem atrito. Entre os blocos, $\mu_e = 0{,}4$. Qual a maior força horizontal que se pode aplicar no bloco de <b>baixo</b> sem que o de cima escorregue?</p>`, fig: fig(chao() + bloco(200, 80, 140, 50, "var(--mT)", "3 kg") + bloco(240, 46, 60, 34, "var(--mA)", "2 kg") + D.seta(340, 105, 420, 105, "var(--warn)") + D.txt(380, 96, "F", "txm"), 150), num: { v: 20, un: "N" }, dicas: [R`<p>Quem acelera o bloco de cima é só o atrito: $a_\text{máx} = \mu_eg$.</p>`], resp: "20 N", sol: R`<p>$a_\text{máx} = 4$ m/s²; o conjunto todo com essa aceleração: $F = 5\cdot4 = 20$ N.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Um bloco é lançado para cima num plano de 30° com 10 m/s ($\mu_c = 0{,}25$). Que distância ele sobe ao longo do plano?</p>`, num: { v: 6.978, tol: 0.01, un: "m" }, dicas: [R`<p>Subindo, peso (componente) e atrito apontam os dois para baixo do plano.</p>`, R`<p>$a = g(\sin30° + \mu_c\cos30°)$.</p>`], resp: "≈ 6,98 m", sol: R`<p>$a = 10(0{,}5 + 0{,}2165) \approx 7{,}17$ m/s²; $d = \frac{100}{2\cdot7{,}17} \approx 6{,}98$ m. Ele volta? Só se $\tan30° > \mu_e$.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Duas bolas de mesmo tamanho e formato, uma de isopor e outra de chumbo, são soltas de um prédio alto. Considerando o ar ($F = kv^2$, mesmo $k$ para as duas):</p>`, alts: ["chegam juntas, porque a queda não depende da massa", "a de chumbo chega antes, porque tem velocidade terminal maior", "a de isopor chega antes, porque é mais leve", "as duas atingem a mesma velocidade terminal", "a de chumbo tem aceleração maior que g"], certa: "B", dicas: [R`<p>$v_t = \sqrt{mg/k}$.</p>`], resp: "B", sol: R`<p>Com o ar, a aceleração é $g - \frac{kv^2}{m}$: o mesmo arrasto freia muito mais a bola leve. A de chumbo tem $v_t$ bem maior e chega antes. "A queda não depende da massa" só vale no vácuo ${F.ret("A03")}.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · atrito</div>
        <div class="q">Por que é mais difícil tirar um armário do lugar do que mantê-lo deslizando?</div>
        <p>Porque o atrito <b>estático</b> (com as superfícies paradas uma em relação à outra) pode ser maior que o <b>cinético</b> (deslizando). O atrito parece um vilão, mas é ele que deixa você andar, o carro frear e a corda segurar o nó.</p></div>`),

      F.secao("atrito", "Atrito estático e cinético", R`
        ${F.formula(R`f_e \le \mu_eN\qquad\qquad f_c = \mu_cN\qquad (\mu_c \le \mu_e)`, "Leis do atrito seco (Amontons–Coulomb)")}
        <p>O <b>atrito estático</b> é uma força de vínculo, como a normal: vale o que for preciso para impedir o escorregamento, até o máximo $\mu_eN$. O <b>cinético</b> age quando há deslizamento, contra o movimento relativo, e vale $\mu_cN$, quase independente da velocidade e da área de contato. Os coeficientes dependem do par de materiais (borracha em asfalto seco: ~0,8; gelo em gelo: ~0,03).</p>
        ${F.caixa("pegadinha", R`<p><b>"$f = \mu N$" não vale sempre.</b> Com o corpo parado, o atrito é o que equilibra as outras forças, menor ou igual a $\mu_eN$ (exercício 3). E a normal nem sempre é $mg$: num plano inclinado é $mg\cos\theta$; com uma corda puxando para cima, é menor (exercício 9).</p>`)}
        ${F.caixa("fisico", R`<p><b>Andar é atrito estático</b>: o pé empurra o chão para trás, e o chão (pelo atrito) empurra você para a frente. O pé não escorrega, então é estático. Num carro com freio ABS, as rodas são impedidas de travar justamente para continuar no atrito estático, que é maior: o carro para em menos espaço e continua manobrável.</p>`)}
        <div id="lab-pat"></div>`),

      F.secao("plano", "Plano inclinado com atrito", R`
        <h3>Teorema 1: quando o bloco começa a escorregar</h3>
        ${F.demo("demonstração", R`<p>(i) Parado no plano de ângulo $\theta$: perpendicular, $N = mg\cos\theta$; ao longo, o atrito estático equilibra a componente do peso, $f_e = mg\sin\theta$.</p>
          <p>(ii) Isso só é possível se $f_e \le \mu_eN$: $mg\sin\theta \le \mu_emg\cos\theta$, ou seja, $\tan\theta \le \mu_e$.</p>
          <p>(iii) O ângulo crítico é $\theta_c = \arctan\mu_e$, independente da massa. $\blacksquare$</p>`)}
        <h3>Teorema 2: aceleração descendo e subindo</h3>
        ${F.demo("demonstração", R`<p>(i) Descendo (atrito para cima do plano): $mg\sin\theta - \mu_cmg\cos\theta = ma \Rightarrow a = g(\sin\theta - \mu_c\cos\theta)$.</p>
          <p>(ii) Subindo (atrito também para baixo do plano): a desaceleração é $g(\sin\theta + \mu_c\cos\theta)$, maior. Por isso a subida é mais curta que a descida, e o bloco volta mais devagar do que foi. $\blacksquare$</p>`)}
        ${F.formula(R`\theta_c = \arctan\mu_e,\qquad a_\text{descendo} = g(\sin\theta - \mu_c\cos\theta),\qquad a_\text{subindo} = -g(\sin\theta + \mu_c\cos\theta)`, "Plano inclinado com atrito")}`),

      F.secao("ar", "Resistência do ar e velocidade terminal", R`
        <p>Um corpo andando no ar sente uma força contra a velocidade. Em baixa velocidade (gotinhas, poeira), ela é proporcional a $v$ (lei de Stokes, ${F.ret("N04")}); em velocidades do dia a dia, a $v^2$: $F = kv^2$, com $k = \frac12C\rho A$ ($C$: coeficiente de forma; $\rho$: densidade do ar; $A$: área frontal) ${F.ret("N07")}.</p>
        <h3>Teorema 3: velocidade terminal</h3>
        ${F.demo("demonstração", R`<p>(i) Caindo: $mg - kv^2 = ma$. No começo $v = 0$ e $a = g$; conforme $v$ cresce, a resistência cresce e $a$ diminui.</p>
          <p>(ii) A velocidade para de crescer quando $a = 0$: $kv_t^2 = mg$, então $v_t = \sqrt{\frac{mg}{k}}$.</p>
          <p>(iii) Corpos mais pesados (mesmo formato) têm $v_t$ maior. $\blacksquare$</p>`)}
        ${F.formula(R`F_\text{ar} = kv^2,\qquad v_t = \sqrt{\frac{mg}{k}}`, "Arrasto quadrático e velocidade terminal")}
        ${F.caixa("olimpiada", R`<p><b>Máximo de $a\cos\theta + b\sin\theta$</b>: aparece sempre que uma força inclinada mexe ao mesmo tempo no atrito e na componente útil. O máximo é $\sqrt{a^2 + b^2}$, em $\tan\theta = b/a$. No exemplo de olimpíada, puxar a $\arctan\mu$ é o melhor ângulo.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>: com $F = bv$, a equação $m\frac{dv}{dt} = mg - bv$ dá $v(t) = v_t\left(1 - e^{-bt/m}\right)$ ${F.ret("matematica/CII08")}: a velocidade se aproxima de $v_t$ exponencialmente. E o atrito seco tem origem microscópica: só uma fração minúscula da área "aparente" está realmente em contato, nos picos das rugosidades.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-pat"); e.outerHTML = F.lab("Plano inclinado com atrito", "lab-pat"); SIM.planoAtrito(document.getElementById("lab-pat"), F); },
});
