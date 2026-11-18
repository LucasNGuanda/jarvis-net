/* A10 · Dinâmica do Movimento Circular. Conferido em Python (g = 10 m/s²):
   2 kg a 4 m/s em R = 0,5 m: 64 N; curva plana R = 80 m, μ = 0,5: 20 m/s; looping R = 0,4 m: v mín no topo 2 m/s;
   balde 2 kg, R = 1 m, 5 m/s: T = 30 N no topo e 70 N embaixo; curva sem atrito R = 100 m a 20 m/s: θ = 21,8°;
   lombada R = 40 m a 10 m/s, 1000 kg: N = 7500 N; decola a 20 m/s; pêndulo cônico L = 1 m a 37°: ω = 3,54 rad/s, T = 1,78 s;
   rotor R = 2 m, μ = 0,5: ω mín = 3,16 rad/s; pêndulo 1 kg, L = 1 m, 3 m/s embaixo: T = 19 N; roda-gigante R = 10 m, 5 m/s, 60 kg: 450 N e 750 N;
   moeda no disco a 0,2 m, μ = 0,4: ω máx = 4,47 rad/s ≈ 42,7 rpm; curva inclinada 30°, R = 50 m, μ = 0,4: v entre 8,49 e 25,2 m/s;
   chefão: conta no aro girando (R = 0,5 m, ω = 6 rad/s): cos θ = g/(ω²R) = 0,556, θ = 56,3°; acima de ω = √(g/R) = 4,47 rad/s; N = mω²R. */
F.registrar("A10", {
  retoma: ["A07", "A08", "A09"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const circ = (cx, cy, r, extra = "") => `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:none;stroke:var(--ink3);stroke-dasharray:5 4"/><circle cx="${cx}" cy="${cy}" r="3" style="fill:var(--ink)"/>` + extra;
    const exemplos = F.exemplo({
      titulo: "Força centrípeta",
      casos: [
        { nome: "Fácil: velocidade máxima na curva plana", gerar: (p) => {
          const Rr = p ? 80 : F.escolha([50, 80, 120]), mu = p ? 0.5 : F.escolha([0.4, 0.5, 0.8]), v = Math.sqrt(mu * 10 * Rr);
          return { enun: R`<p>Qual a maior velocidade com que um carro faz uma curva plana de raio ${Rr} m, se o atrito estático entre pneus e asfalto é $\mu_e = ${F.n(mu)}$?</p>`,
            fig: fig(circ(280, 90, 70) + `<circle cx="350" cy="90" r="8" style="fill:var(--mA)"/>` + D.seta(350, 90, 300, 90, "var(--warn)") + D.txt(325, 80, "f", "txm") + D.seta(350, 90, 350, 40, "var(--ink2)", 1.4) + D.txt(358, 48, "v", "txm", "start")),
            passos: [R`<p>(i) Quem aponta para o centro é o atrito estático (o pneu não derrapa de lado): $f = \frac{mv^2}{R}$.</p>`, R`<p>(ii) O atrito tem um máximo: $\frac{mv^2}R \le \mu_emg$, então $v \le \sqrt{\mu_egR}$. A massa some.</p>`, R`<p>(iii) $v_\text{máx} = \sqrt{${F.n(mu)}\cdot10\cdot${Rr}} = ${F.n(v, 3)}$ m/s $\approx ${F.n(v * 3.6, 0)}$ km/h.</p>`] };
        } },
        { nome: "Médio: o balde girando", gerar: (p) => {
          const m = p ? 2 : F.escolha([1, 2, 3]), Rr = p ? 1 : F.escolha([0.8, 1, 1.2]), v = p ? 5 : F.escolha([4, 5, 6]), Tt = (m * v * v) / Rr - m * 10, Tb = (m * v * v) / Rr + m * 10, vmin = Math.sqrt(10 * Rr);
          return { enun: R`<p>Um balde de ${m} kg (com água) gira num círculo vertical de raio ${F.nt(Rr)} m, preso a uma corda, passando pelo topo e pelo ponto mais baixo a ${v} m/s. Quais as trações nesses pontos? Qual a menor velocidade no topo para a água não cair?</p>`,
            fig: fig(circ(280, 85, 70, `<circle cx="280" cy="15" r="8" style="fill:var(--mA)"/><circle cx="280" cy="155" r="8" style="fill:var(--mA)"/><line x1="280" y1="85" x2="280" y2="23" style="stroke:var(--ink)"/>`)),
            passos: [R`<p>(i) <b>Topo</b>: peso e tração apontam para baixo, para o centro: $T + mg = \frac{mv^2}R \Rightarrow T = ${F.n(Tt, 3)}$ N.</p>`, R`<p>(ii) <b>Embaixo</b>: tração para cima (centro), peso para baixo: $T - mg = \frac{mv^2}R \Rightarrow T = ${F.n(Tb, 3)}$ N. A corda arrebenta, se for o caso, embaixo.</p>`, R`<p>(iii) <b>Mínimo no topo</b>: com $T = 0$, só o peso faz a centrípeta: $mg = \frac{mv^2}R \Rightarrow v_\text{mín} = \sqrt{gR} = ${F.n(vmin, 3)}$ m/s. Mais devagar que isso, a água cai.</p>`] };
        } },
        { nome: "Olimpíada: curva inclinada com atrito", gerar: (p) => {
          const Rr = p ? 50 : F.escolha([50, 100]), th = p ? 30 : F.escolha([15, 20, 30]), mu = p ? 0.4 : F.escolha([0.2, 0.3, 0.4]), t = (th * Math.PI) / 180, s = Math.sin(t), c = Math.cos(t);
          const vmax = Math.sqrt((Rr * 10 * (s + mu * c)) / (c - mu * s)), vmin = s > mu * c ? Math.sqrt((Rr * 10 * (s - mu * c)) / (c + mu * s)) : 0;
          return { enun: R`<p>Uma curva de raio ${Rr} m tem a pista inclinada de ${th}°, com $\mu_e = ${F.n(mu)}$. Entre que velocidades um carro faz a curva sem derrapar?</p>`,
            fig: fig(`<g transform="translate(280 120) rotate(${-th})"><line x1="-140" y1="0" x2="140" y2="0" style="stroke:var(--ink2);stroke-width:4"/><rect x="-25" y="-22" width="50" height="22" style="fill:color-mix(in srgb,var(--mA) 30%,transparent);stroke:var(--mA);stroke-width:2"/></g>` + D.seta(280, 100, 180, 100, "var(--warn)") + D.txt(230, 92, "centro →", "tx2") + D.txt(160, 140, `${th}°`, "tx2")),
            passos: [R`<p>(i) <b>Velocidade máxima</b>: o carro tende a subir a pista, o atrito aponta para baixo dela. Vertical: $N\cos\theta - f\sin\theta = mg$. Horizontal (centro): $N\sin\theta + f\cos\theta = \frac{mv^2}R$. Com $f = \mu N$ e dividindo uma pela outra:</p><p>$$v_\text{máx}^2 = gR\,\frac{\sin\theta + \mu\cos\theta}{\cos\theta - \mu\sin\theta} \Rightarrow v_\text{máx} \approx ${F.n(vmax, 3)}\ \text{m/s}.$$</p>`, R`<p>(ii) <b>Velocidade mínima</b>: o carro tende a escorregar para dentro, o atrito aponta para cima da pista (troque $\mu$ por $-\mu$): $v_\text{mín}^2 = gR\,\frac{\sin\theta - \mu\cos\theta}{\cos\theta + \mu\sin\theta}$${vmin > 0 ? R`$\Rightarrow v_\text{mín} \approx ${F.n(vmin, 3)}$ m/s` : ": negativo, ou seja, o carro pode até ficar parado na pista sem escorregar"}.</p>`, R`<p>(iii) Sem atrito sobraria uma velocidade só, $\sqrt{gR\tan\theta} \approx ${F.n(Math.sqrt(Rr * 10 * Math.tan(t)), 3)}$ m/s: é a velocidade de projeto da curva.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A conta no aro que gira",
      enun: R`<p>Um aro circular de raio $R$, num plano vertical, gira em torno do seu diâmetro vertical com velocidade angular $\omega$ constante. Uma conta (bolinha furada) pode deslizar sem atrito pelo aro. Seja $\theta$ o ângulo da conta medido a partir do ponto mais baixo (pelo centro do aro). (a) Desenhe as forças e mostre que, numa posição de equilíbrio com $0 < \theta < 90°$, $\cos\theta = \frac{g}{\omega^2R}$. (b) Para que valores de $\omega$ essa posição existe? (c) Abaixo desse $\omega$, onde a conta fica? Acima dele, por que ela não fica no fundo? (d) Calcule $\theta$ e a normal para $R = 0{,}5$ m, $\omega = 6$ rad/s, $m = 1$ kg. (e) O que acontece com $\theta$ quando $\omega \to \infty$?</p>`,
      fig: fig(`<line x1="280" y1="0" x2="280" y2="170" style="stroke:var(--ink3);stroke-dasharray:4 4"/><ellipse cx="280" cy="85" rx="75" ry="75" style="fill:none;stroke:var(--ink2);stroke-width:2.5"/><circle cx="342" cy="127" r="7" style="fill:var(--mA)"/><line x1="280" y1="85" x2="342" y2="127" style="stroke:var(--ink3)"/>` + D.txt(296, 124, "θ", "txm") + `<path d="M250 12 A30 8 0 1 0 310 12" style="fill:none;stroke:var(--warn);stroke-width:1.6"/>` + D.txt(320, 14, "ω", "txm", "start"), 175),
      dicas: [R`<p>Forças: peso e normal (que aponta para o centro do aro, porque não há atrito). A conta faz um círculo horizontal de raio $r = R\sin\theta$.</p>`, R`<p>Vertical: $N\cos\theta = mg$. Horizontal: $N\sin\theta = m\omega^2R\sin\theta$.</p>`],
      sol: R`<p><b>(a)</b> A normal aponta da conta para o centro do aro. A conta gira num círculo horizontal de raio $R\sin\theta$, então precisa de resultante horizontal $m\omega^2R\sin\theta$ para o eixo. Vertical: $N\cos\theta = mg$. Horizontal: $N\sin\theta = m\omega^2R\sin\theta$, e com $\sin\theta \ne 0$, $N = m\omega^2R$. Substituindo: $\cos\theta = \frac{g}{\omega^2R}$.</p>
        <p><b>(b)</b> Precisa $\cos\theta < 1$: $\omega > \sqrt{\frac gR}$.</p>
        <p><b>(c)</b> Abaixo, a única posição de equilíbrio é o fundo ($\theta = 0$, onde $\sin\theta = 0$ e a equação horizontal vale sozinha). Acima, o fundo continua sendo equilíbrio, mas instável: afastada um pouco, a conta precisaria de $m\omega^2R\sin\theta$ para o eixo, e a componente horizontal da normal só fornece $mg\tan\theta \approx mg\theta$, menor que $m\omega^2R\theta$ quando $\omega^2 > \frac gR$; a falta "empurra" a conta para fora até o novo equilíbrio. É uma <b>bifurcação</b>: o mesmo sistema troca de comportamento num valor crítico.</p>
        <p><b>(d)</b> $\cos\theta = \frac{10}{36\cdot0{,}5} \approx 0{,}556$, $\theta \approx 56{,}3°$; $N = m\omega^2R = 18$ N. Velocidade crítica: $\sqrt{20} \approx 4{,}47$ rad/s. (Conferido em Python.)</p>
        <p><b>(e)</b> $\cos\theta \to 0$: $\theta \to 90°$, a conta sobe até a altura do centro, mas nunca passa dela (acima do centro a normal teria componente vertical para baixo).</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Qual a força resultante sobre um corpo de 2 kg em MCU de raio 0,5 m a 4 m/s?</p>`, num: { v: 64, un: "N" }, dicas: [R`<p>$F_c = \frac{mv^2}R$.</p>`], resp: "64 N, para o centro", sol: R`<p>$\frac{2\cdot16}{0{,}5} = 64$ N.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Qual a velocidade máxima numa curva plana de raio 80 m com $\mu_e = 0{,}5$?</p>`, num: { v: 20, un: "m/s" }, dicas: [R`<p>$v = \sqrt{\mu gR}$.</p>`], resp: "20 m/s", sol: R`<p>$\sqrt{400} = 20$ m/s (72 km/h).</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Num looping de raio 0,4 m, qual a menor velocidade no topo para o carrinho não descolar do trilho?</p>`, fig: fig(`<circle cx="280" cy="90" r="60" style="fill:none;stroke:var(--ink2);stroke-width:3"/><circle cx="280" cy="30" r="8" style="fill:var(--mA)"/>`), num: { v: 2, un: "m/s" }, dicas: [R`<p>No limite, a normal no topo é zero.</p>`], resp: "2 m/s", sol: R`<p>$mg = \frac{mv^2}R \Rightarrow v = \sqrt{gR} = 2$ m/s.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Um balde de 2 kg gira num círculo vertical de raio 1 m e passa pelo topo a 5 m/s. Qual a tração na corda no topo?</p>`, num: { v: 30, un: "N" }, dicas: [R`<p>No topo, peso e tração apontam para o centro.</p>`], resp: "30 N", sol: R`<p>$T = \frac{mv^2}R - mg = 50 - 20 = 30$ N.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Que inclinação deve ter uma curva de raio 100 m para um carro a 20 m/s fazê-la sem precisar de atrito?</p>`, num: { v: 21.8, tol: 0.01, un: "graus" }, dicas: [R`<p>$\tan\theta = \frac{v^2}{gR}$.</p>`], resp: "≈ 21,8°", sol: R`<p>$\tan\theta = 0{,}4$, $\theta \approx 21{,}8°$.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Um carro de 1000 kg passa a 10 m/s pelo topo de uma lombada de raio 40 m. Quanto vale a normal?</p>`, fig: fig(`<path d="M80 140 Q280 40 480 140" style="fill:none;stroke:var(--ink2);stroke-width:3"/>` + D.carro(280, 92, "var(--mA)")), num: { v: 7500, un: "N" }, dicas: [R`<p>No topo: $mg - N = \frac{mv^2}R$.</p>`], resp: "7500 N", sol: R`<p>$N = 1000(10 - 2{,}5) = 7500$ N: o carro fica "mais leve". A 20 m/s, $N = 0$ e ele perde contato.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Na roda-gigante (raio 10 m, 5 m/s), quanto uma balança marcaria para uma pessoa de 60 kg no ponto mais <b>baixo</b>?</p>`, num: { v: 750, un: "N" }, dicas: [R`<p>Embaixo, a normal aponta para o centro (para cima).</p>`], resp: "750 N", sol: R`<p>$N = m\left(g + \frac{v^2}R\right) = 60\cdot12{,}5 = 750$ N. No topo, $60\cdot7{,}5 = 450$ N.</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Uma moeda está a 20 cm do centro de um disco que gira, com $\mu_e = 0{,}4$. Qual a maior velocidade angular sem a moeda escorregar?</p>`, num: { v: Math.sqrt(20), tol: 0.01, un: "rad/s" }, dicas: [R`<p>$\mu_emg = m\omega^2r$.</p>`], resp: "√20 ≈ 4,47 rad/s", sol: R`<p>$\omega = \sqrt{\frac{0{,}4\cdot10}{0{,}2}} \approx 4{,}47$ rad/s ($\approx 43$ rpm).</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Num pêndulo cônico, uma bolinha presa a um fio de 1 m gira num círculo horizontal com o fio fazendo 37° com a vertical ($\cos37° = 0{,}8$). Qual a velocidade angular?</p>`, fig: fig(`<line x1="280" y1="10" x2="340" y2="90" style="stroke:var(--ink)"/><line x1="280" y1="10" x2="280" y2="100" style="stroke:var(--ink3);stroke-dasharray:4 4"/><ellipse cx="280" cy="90" rx="60" ry="14" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/><circle cx="340" cy="90" r="8" style="fill:var(--mA)"/>` + D.txt(292, 44, "37°", "tx2", "start")), num: { v: Math.sqrt(12.5), tol: 0.01, un: "rad/s" }, dicas: [R`<p>$T\cos\theta = mg$ e $T\sin\theta = m\omega^2L\sin\theta$.</p>`, R`<p>$\omega^2 = \frac{g}{L\cos\theta}$.</p>`], resp: "√12,5 ≈ 3,54 rad/s", sol: R`<p>$\omega = \sqrt{\frac{10}{0{,}8}} \approx 3{,}54$ rad/s; período $\approx 1{,}78$ s. Note que só depende da altura $L\cos\theta$ do cone.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>No "rotor" de um parque, as pessoas ficam grudadas na parede de um cilindro de raio 2 m que gira, e o chão é retirado. Com $\mu_e = 0{,}5$ entre roupa e parede, qual a menor velocidade angular?</p>`, num: { v: Math.sqrt(10), tol: 0.01, un: "rad/s" }, dicas: [R`<p>A normal (da parede) faz a centrípeta; o atrito segura o peso: $mg \le \mu_eN$.</p>`], resp: "√10 ≈ 3,16 rad/s", sol: R`<p>$N = m\omega^2R$ e $mg \le \mu_em\omega^2R \Rightarrow \omega \ge \sqrt{\frac{g}{\mu_eR}} \approx 3{,}16$ rad/s.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Um pêndulo de 1 kg e fio de 1 m passa pelo ponto mais baixo a 3 m/s. Qual a tração no fio nesse ponto?</p>`, num: { v: 19, un: "N" }, dicas: [R`<p>Embaixo: $T - mg = \frac{mv^2}L$.</p>`], resp: "19 N", sol: R`<p>$T = 10 + 9 = 19$ N, quase o dobro do peso.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Por que um passageiro "é jogado" para fora numa curva?</p>`, alts: ["Existe uma força centrífuga real empurrando-o para fora.", "Ele tende a seguir em linha reta (inércia); o carro faz a curva e o banco/porta precisa empurrá-lo para dentro.", "A força centrípeta empurra para fora.", "O peso dele aumenta na curva.", "O atrito do pneu age nele."], certa: "B", dicas: [R`<p>Pense no referencial da rua (inercial) ${F.ret("A08")}.</p>`], resp: "B", sol: R`<p>Da rua, nenhuma força empurra o passageiro para fora: ele continua em linha reta até a porta empurrá-lo para dentro (é essa a força centrípeta nele). A "centrífuga" só existe no referencial do carro, que não é inercial.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · dinâmica circular</div>
        <div class="q">Por que as curvas das estradas e dos velódromos são inclinadas?</div>
        <p>Para fazer uma curva, alguma força precisa puxar o corpo para o centro: a <b>força centrípeta</b> não é uma força nova, é o nome do papel que alguma força (atrito, normal, tração, gravidade) faz. Inclinar a pista faz a normal ajudar o atrito nesse papel.</p></div>`),

      F.secao("centripeta", "A 2ª lei no movimento circular", R`
        ${F.formula(R`F_\text{centrípeta} = \sum F_\text{para o centro} = \frac{mv^2}{R} = m\omega^2R`, "Resultante centrípeta")}
        <h3>Teorema 1: a resultante na direção radial</h3>
        ${F.demo("demonstração", R`<p>(i) No movimento circular, a aceleração tem uma parte centrípeta $\frac{v^2}R$, para o centro ${F.ret("A05")}, e uma tangencial $\frac{dv}{dt}$.</p>
          <p>(ii) Pela 2ª lei em cada direção ${F.ret("A08")}: a soma das componentes das forças para o centro é $m\frac{v^2}R$, e a soma das tangenciais é $m\frac{dv}{dt}$. $\blacksquare$</p>`)}
        ${F.caixa("pegadinha", R`<p><b>Não desenhe "força centrípeta" no diagrama</b> como se fosse mais uma força: desenhe só as forças reais (peso, normal, tração, atrito) e exija que a soma delas para o centro dê $\frac{mv^2}R$. E a "força centrífuga" não existe no referencial inercial.</p>`)}
        <div id="lab-curva"></div>`),

      F.secao("casos", "Casos clássicos", R`
        <h3>Teorema 2: velocidade mínima no topo de um círculo vertical</h3>
        ${F.demo("demonstração", R`<p>(i) No topo, o peso e a força de contato (normal do trilho ou tração da corda) apontam para baixo, para o centro: $N + mg = \frac{mv^2}R$.</p>
          <p>(ii) $N \ge 0$ (o trilho só empurra; a corda só puxa), então $\frac{mv^2}R \ge mg$, ou seja, $v \ge \sqrt{gR}$. $\blacksquare$</p>`)}
        <h3>Teorema 3: curva inclinada sem atrito</h3>
        ${F.demo("demonstração", R`<p>(i) Forças: peso e normal, perpendicular à pista inclinada de $\theta$.</p>
          <p>(ii) Vertical: $N\cos\theta = mg$. Horizontal (para o centro): $N\sin\theta = \frac{mv^2}R$.</p>
          <p>(iii) Dividindo: $\tan\theta = \frac{v^2}{gR}$. Para cada velocidade há uma inclinação ideal. $\blacksquare$</p>`)}
        ${F.formula(R`v_\text{mín, topo} = \sqrt{gR},\qquad v_\text{curva plana, máx} = \sqrt{\mu_egR},\qquad \tan\theta_\text{ideal} = \frac{v^2}{gR}`, "Resultados úteis")}
        ${F.caixa("fisico", R`<p><b>Gravidade artificial</b>: numa estação espacial em forma de anel girando, o piso (a parede de fora) empurra os astronautas para o centro com $m\omega^2R$, e eles sentem isso como peso. Para "1 g" com raio de 100 m, basta $\omega = \sqrt{g/R} \approx 0{,}32$ rad/s, uma volta a cada 20 s.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Troque $\mu$ por $-\mu$</b>: nos problemas de curva inclinada com atrito, a velocidade máxima e a mínima saem da mesma conta, trocando o sinal do atrito (ele aponta para baixo da pista no caso máximo e para cima no mínimo). Faça uma vez com cuidado e use a simetria.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, no referencial que gira aparecem duas forças fictícias: a centrífuga $m\omega^2r$ e a de Coriolis $-2m\vec\omega\times\vec v$ ${F.ret("A05")}. A de Coriolis explica o sentido de rotação dos furacões e o desvio do pêndulo de Foucault.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-curva"); e.outerHTML = F.lab("Carro na curva", "lab-curva"); SIM.curva(document.getElementById("lab-curva"), F); },
});
