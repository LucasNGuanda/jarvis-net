/* A06 · Lançamentos. Conferido em Python (g = 10 m/s²):
   horizontal de 20 m a 15 m/s: 2 s e 30 m; 20 m/s a 30°: H = 5 m, R = 34,64 m, T = 2 s; a 60°: 10 m/s no topo; a 45°: R = 40 m;
   R = 40 m exige v₀ ≥ 20 m/s; horizontal de 45 m a 10 m/s: chega a 31,6 m/s; 25 m/s a 53° (0,8/0,6): 20 m de altura em x = 30 m;
   20 m/s a 30° do alto de 25 m: 3,449 s e 59,75 m; avião a 100 m/s e 500 m: solta 1000 m antes;
   alvo (30 m; 10 m) com 25 m/s: 34,5° ou 74,0°;
   chefão: velocidade mínima para passar por cima de um muro de altura h a distância d: v² = g(h + √(h² + d²)), tg θ = (h + √(h² + d²))/d;
   h = 5 m, d = 12 m: 13,42 m/s a 56,3° (busca numérica confere). */
F.registrar("A06", {
  retoma: ["A03", "A05", "F03"],
  html(F) {
    const R = String.raw;
    const g = 10;
    const traj = (v0, th, h = 0, xmax = 60, ymax = 25, extra = "", alt = 200) => {
      const r = (th * Math.PI) / 180, T = (v0 * Math.sin(r) + Math.sqrt((v0 * Math.sin(r)) ** 2 + 2 * g * h)) / g;
      const pts = D.amostra((t) => t, 0, T, 60).map(([t]) => [v0 * Math.cos(r) * t, h + v0 * Math.sin(r) * t - 5 * t * t]);
      return D.svg(560, alt, D.graf({ x0: 60, y0: alt - 30, w: 440, h: alt - 60, xmax, ymax, xlab: "x (m)", ylab: "y (m)", xt: [0, Math.round(xmax / 2), Math.round(xmax)].slice(0, 2), yt: [], curvas: [{ pts, cor: "var(--mA)" }] }) + extra, "trajetória");
    };
    const exemplos = F.exemplo({
      titulo: "Lançamentos",
      casos: [
        { nome: "Fácil: lançamento horizontal", gerar: (p) => {
          const h = p ? 1.25 : F.escolha([0.8, 1.25, 1.8, 5]), v0 = p ? 2 : F.escolha([1, 2, 3, 4]), t = Math.sqrt((2 * h) / g), x = v0 * t, vc = Math.hypot(v0, g * t);
          return { enun: R`<p>Uma bolinha rola para fora de uma mesa de ${F.n(h)} m de altura com ${v0} m/s. A que distância do pé da mesa ela cai, e com que velocidade chega ao chão?</p>`,
            fig: traj(v0, 0, h, Math.max(1.5, x * 1.4), h * 1.3, "", 180),
            passos: [R`<p>(i) Vertical: queda livre a partir do repouso ${F.ret("A03")}: $${F.n(h)} = 5t^2 \Rightarrow t = ${F.n(t, 4)}$ s. A velocidade horizontal não interfere.</p>`, R`<p>(ii) Horizontal: MRU, $x = ${v0}\cdot${F.n(t, 4)} = ${F.n(x, 3)}$ m.</p>`, R`<p>(iii) No chão: $v_x = ${v0}$, $v_y = gt = ${F.n(g * t, 3)}$ m/s, $|\vec v| = \sqrt{${v0}^2 + ${F.n(g * t, 3)}^2} \approx ${F.n(vc, 3)}$ m/s ${F.ret("F02")}.</p>`] };
        } },
        { nome: "Médio: lançamento oblíquo completo", gerar: (p) => {
          const v0 = p ? 20 : F.escolha([10, 20, 30]), th = p ? 30 : F.escolha([30, 45, 60, 37]), r = (th * Math.PI) / 180, vx = v0 * Math.cos(r), vy = v0 * Math.sin(r);
          return { enun: R`<p>Uma bola é chutada do chão a ${v0} m/s, fazendo ${th}° com a horizontal. Ache o tempo de subida, a altura máxima, o tempo de voo e o alcance.</p>`,
            fig: traj(v0, th, 0, Math.max(10, ((v0 * v0) / g) * 1.05), Math.max(5, ((v0 * v0) / (2 * g)) * 1.05)),
            passos: [R`<p>(i) Componentes: $v_x = ${v0}\cos${th}° \approx ${F.n(vx, 3)}$ m/s (constante) e $v_{0y} = ${v0}\sin${th}° \approx ${F.n(vy, 3)}$ m/s.</p>`, R`<p>(ii) Subida até $v_y = 0$: $t_s = \frac{v_{0y}}g = ${F.n(vy / g, 3)}$ s; $H = \frac{v_{0y}^2}{2g} = ${F.n((vy * vy) / (2 * g), 3)}$ m.</p>`, R`<p>(iii) Voo: $T = 2t_s = ${F.n((2 * vy) / g, 3)}$ s (simetria); alcance $R = v_xT = ${F.n((vx * 2 * vy) / g, 3)}$ m $= \frac{v_0^2\sin2\theta}g$.</p>`] };
        } },
        { nome: "Olimpíada: acertar um alvo", gerar: (p) => {
          const x = p ? 30 : F.escolha([20, 30, 40]), y = p ? 10 : F.escolha([5, 10, 15]), v0 = p ? 25 : F.escolha([22, 25, 30]), A = (g * x * x) / (2 * v0 * v0), d = x * x - 4 * A * (y + A);
          const T1 = d >= 0 ? (x + Math.sqrt(d)) / (2 * A) : NaN, T2 = d >= 0 ? (x - Math.sqrt(d)) / (2 * A) : NaN;
          return { enun: R`<p>Um alvo está a ${x} m na horizontal e ${y} m acima do ponto de lançamento. Com que ângulo devemos lançar uma pedra a ${v0} m/s para acertá-lo?</p>`,
            fig: D.svg(560, 180, D.graf({ x0: 60, y0: 150, w: 440, h: 120, xmax: x * 1.4, ymax: y * 2.2 + 5, xlab: "x (m)", ylab: "y (m)", xt: [0, x], yt: [y], pontos: [[x, y, "alvo"]] }), "alvo"),
            passos: [R`<p>(i) Equação da trajetória (Teorema 3): $y = x\tan\theta - \frac{gx^2}{2v_0^2}(1 + \tan^2\theta)$, usando $\frac1{\cos^2\theta} = 1 + \tan^2\theta$ ${F.ret("F03")}.</p>`, R`<p>(ii) Com $u = \tan\theta$: $${F.n(A, 4)}u^2 - ${x}u + (${y} + ${F.n(A, 4)}) = 0$, uma equação do 2º grau em $u$. Discriminante: $${F.n(d, 4)}$.</p>`, d >= 0 ? R`<p>(iii) Duas soluções: $\theta \approx ${F.n((Math.atan(T1) * 180) / Math.PI, 1)}°$ (tiro alto, "por cima") e $\theta \approx ${F.n((Math.atan(T2) * 180) / Math.PI, 1)}°$ (tiro baixo, mais rápido). Se o discriminante fosse negativo, o alvo estaria fora da parábola de segurança: inalcançável com essa velocidade.</p>` : R`<p>(iii) Discriminante negativo: nenhum ângulo serve. O alvo está fora da parábola de segurança para ${v0} m/s; é preciso lançar mais rápido.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Por cima do muro, com o mínimo de esforço",
      enun: R`<p>Você quer jogar uma bola, do chão, por cima de um muro de altura $h$ que está a uma distância horizontal $d$, gastando a <b>menor velocidade possível</b>. (a) Mostre que, com velocidade $v_0$, existe algum ângulo que faz a bola passar pelo ponto $(x, y)$ se, e só se, $y \le \frac{v_0^2}{2g} - \frac{gx^2}{2v_0^2}$ (a <b>parábola de segurança</b>). (b) Use isso para mostrar que a velocidade mínima para passar pelo topo do muro é $v_\text{mín}^2 = g\left(h + \sqrt{h^2 + d^2}\right)$. (c) Ache o ângulo de lançamento correspondente. (d) Calcule para $h = 5$ m, $d = 12$ m e $g = 10$ m/s². (e) Confira o caso $h = 0$.</p>`,
      fig: D.svg(560, 190, D.graf({ x0: 60, y0: 160, w: 440, h: 130, xmax: 20, ymax: 10, xlab: "x (m)", ylab: "y (m)", xt: [0, 12], yt: [5] }) + `<rect x="${60 + (12 / 20) * 440 - 4}" y="${160 - (5 / 10) * 130}" width="8" height="${(5 / 10) * 130}" style="fill:var(--line2);stroke:var(--ink2)"/>`, "muro"),
      dicas: [R`<p>(a) Equação da trajetória como equação do 2º grau em $\tan\theta$ (exemplo de olimpíada): existe solução se o discriminante for $\ge 0$.</p>`, R`<p>(b) Escreva a condição de (a) no ponto $(d, h)$ como desigualdade para $V = v_0^2$: dá $V^2 - 2ghV - g^2d^2 \ge 0$.</p>`],
      sol: R`<p><b>(a)</b> Com $u = \tan\theta$, a trajetória passa por $(x, y)$ se $\frac{gx^2}{2v_0^2}u^2 - xu + \left(y + \frac{gx^2}{2v_0^2}\right) = 0$. Há solução real se $x^2 - 4\frac{gx^2}{2v_0^2}\left(y + \frac{gx^2}{2v_0^2}\right) \ge 0$. Dividindo por $x^2$ e isolando $y$: $y \le \frac{v_0^2}{2g} - \frac{gx^2}{2v_0^2}$. É uma parábola de cabeça para baixo, com topo na altura máxima do tiro vertical, $\frac{v_0^2}{2g}$, e que corta o chão no alcance máximo $\frac{v_0^2}{g}$. Nenhum lançamento com $v_0$ sai dela (no laboratório, botão "parábola de segurança").</p>
        <p><b>(b)</b> No topo do muro, com $V = v_0^2$: $h \le \frac{V}{2g} - \frac{gd^2}{2V} \Rightarrow V^2 - 2ghV - g^2d^2 \ge 0$. As raízes são $V = g\left(h \pm \sqrt{h^2 + d^2}\right)$; só a positiva serve: $v_\text{mín}^2 = g\left(h + \sqrt{h^2 + d^2}\right)$.</p>
        <p><b>(c)</b> No mínimo, o discriminante é zero e a raiz é dupla: $\tan\theta = \frac{x}{2A}$ com $A = \frac{gd^2}{2V}$, ou seja, $\tan\theta = \frac{V}{gd} = \frac{h + \sqrt{h^2 + d^2}}{d}$. Geometricamente, a direção de lançamento é a bissetriz entre a vertical e a reta que vai até o topo do muro.</p>
        <p><b>(d)</b> $\sqrt{h^2 + d^2} = 13$ m, $v_\text{mín} = \sqrt{10\cdot18} \approx 13{,}4$ m/s, com $\tan\theta = \frac{18}{12} = 1{,}5$, $\theta \approx 56{,}3°$. Conferido com uma busca numérica em todos os ângulos.</p>
        <p><b>(e)</b> $h = 0$: $v_\text{mín}^2 = gd$ e $\tan\theta = 1$: o lançamento de 45° com alcance $\frac{v_0^2}g = d$. Confere com o alcance máximo.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Uma pedra é lançada horizontalmente do alto de um prédio de 20 m, a 15 m/s. Quanto tempo leva para chegar ao chão?</p>`, fig: traj(15, 0, 20, 40, 25), num: { v: 2, un: "s" }, dicas: [R`<p>O tempo de queda só depende da altura.</p>`], resp: "2 s", sol: R`<p>$20 = 5t^2 \Rightarrow t = 2$ s, igual ao de uma pedra simplesmente solta.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>No exercício anterior, a que distância do prédio a pedra cai?</p>`, num: { v: 30, un: "m" }, dicas: [R`<p>Horizontal: MRU.</p>`], resp: "30 m", sol: R`<p>$15\cdot2 = 30$ m.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Uma bola é chutada a 20 m/s, a 30° com a horizontal. Qual a altura máxima?</p>`, fig: traj(20, 30, 0, 40, 10), num: { v: 5, un: "m" }, dicas: [R`<p>$v_{0y} = 20\sin30° = 10$ m/s.</p>`, R`<p>$H = \frac{v_{0y}^2}{2g}$.</p>`], resp: "5 m", sol: R`<p>$\frac{100}{20} = 5$ m.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>No exercício anterior, qual o alcance?</p>`, num: { v: 20 * Math.sqrt(3), tol: 0.01, un: "m" }, dicas: [R`<p>$R = \frac{v_0^2\sin2\theta}{g}$.</p>`], resp: "20√3 ≈ 34,6 m", sol: R`<p>$\frac{400\sin60°}{10} = 20\sqrt3 \approx 34{,}6$ m.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Ainda no exercício 3, quanto tempo a bola fica no ar?</p>`, num: { v: 2, un: "s" }, dicas: [R`<p>$T = \frac{2v_{0y}}g$.</p>`], resp: "2 s", sol: R`<p>$\frac{2\cdot10}{10} = 2$ s.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Uma bola é lançada a 20 m/s, a 60° com a horizontal. Qual é a velocidade dela no ponto mais alto da trajetória?</p>`, alts: ["zero", "10 m/s", "17,3 m/s", "20 m/s", "depende da massa"], certa: "B", dicas: [R`<p>No topo, a componente vertical é zero. E a horizontal?</p>`], resp: "B", sol: R`<p>No topo sobra só $v_x = 20\cos60° = 10$ m/s. <b>A</b> é a pegadinha clássica; <b>C</b> é $v_0\sin60°$, a componente que zera.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Qual o alcance de um lançamento a 45° com 20 m/s, do chão?</p>`, num: { v: 40, un: "m" }, dicas: [R`<p>$\sin90° = 1$.</p>`], resp: "40 m", sol: R`<p>$\frac{400}{10} = 40$ m, o maior alcance possível com essa velocidade.</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Qual a menor velocidade para lançar uma bola, do chão, a 40 m de distância (no chão)?</p>`, num: { v: 20, un: "m/s" }, dicas: [R`<p>O alcance máximo, $\frac{v_0^2}g$, acontece a 45°.</p>`], resp: "20 m/s", sol: R`<p>$\frac{v_0^2}{10} = 40 \Rightarrow v_0 = 20$ m/s, a 45°.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Do alto de um penhasco de 45 m, uma pedra é lançada horizontalmente a 10 m/s. Com que velocidade (módulo) ela chega ao chão?</p>`, fig: traj(10, 0, 45, 40, 50), num: { v: Math.sqrt(1000), tol: 0.005, un: "m/s" }, dicas: [R`<p>Tempo de queda: 3 s. $v_y = gt$.</p>`], resp: "√1000 ≈ 31,6 m/s", sol: R`<p>$v_x = 10$, $v_y = 30$; $|\vec v| = \sqrt{100 + 900} \approx 31{,}6$ m/s.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Dois projéteis são lançados do chão com a mesma velocidade, um a 30° e outro a 60°. Qual afirmação é verdadeira?</p>`, fig: D.svg(560, 200, D.graf({ x0: 60, y0: 170, w: 440, h: 140, xmax: 40, ymax: 16, xlab: "x (m)", ylab: "y (m)", xt: [0, 20], yt: [5, 15], curvas: [{ pts: D.amostra((t) => t, 0, 2, 40).map(([t]) => [17.32 * t, 10 * t - 5 * t * t]), cor: "var(--mA)" }, { pts: D.amostra((t) => t, 0, 3.464, 40).map(([t]) => [10 * t, 17.32 * t - 5 * t * t]), cor: "var(--mT)" }] }), "trajetórias"),
        alts: ["O de 60° vai mais longe.", "Os dois têm o mesmo alcance; o de 60° sobe mais e fica mais tempo no ar.", "Os dois têm o mesmo alcance e o mesmo tempo de voo.", "O de 30° sobe mais.", "O de 30° fica mais tempo no ar."], certa: "B",
        dicas: [R`<p>$\sin(2\cdot30°) = \sin(2\cdot60°)$.</p>`], resp: "B", sol: R`<p>Ângulos complementares dão o mesmo alcance; o maior ângulo tem maior $v_{0y}$: sobe mais ($H \propto \sin^2\theta$) e demora mais ($T \propto \sin\theta$). No gráfico, as duas trajetórias para 20 m/s.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Uma bola é chutada do chão a 25 m/s, a um ângulo com $\sin\theta = 0{,}8$ e $\cos\theta = 0{,}6$. Em que altura ela está quando passa a 30 m (na horizontal) do ponto de chute?</p>`, fig: traj(25, 53.13, 0, 70, 35), num: { v: 20, un: "m" }, dicas: [R`<p>Ache o instante pela horizontal: $x = v_xt$.</p>`], resp: "20 m", sol: R`<p>$v_x = 15$ m/s: $t = 2$ s. $y = 20\cdot2 - 5\cdot4 = 20$ m (a bola ainda está subindo: o topo é em $t = 2$ s, $H = 20$ m; ela está exatamente no topo).</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Do alto de um penhasco de 25 m, uma pedra é lançada a 20 m/s, 30° acima da horizontal. A que distância horizontal ela cai?</p>`, fig: traj(20, 30, 25, 70, 35), num: { v: 59.75, tol: 0.01, un: "m" }, dicas: [R`<p>Vertical: $0 = 25 + 10t - 5t^2$. Pegue a raiz positiva.</p>`, R`<p>$t = 1 + \sqrt6 \approx 3{,}45$ s.</p>`], resp: "≈ 59,7 m", sol: R`<p>$t^2 - 2t - 5 = 0 \Rightarrow t = 1 + \sqrt6 \approx 3{,}449$ s; $x = 10\sqrt3\cdot3{,}449 \approx 59{,}7$ m.</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>Um avião voa na horizontal a 100 m/s, a 500 m de altura, e deve soltar um pacote sobre um alvo no chão. Quantos metros antes do alvo (na horizontal) ele deve soltar?</p>`, fig: traj(100, 0, 500, 1200, 550), num: { v: 1000, un: "m" }, dicas: [R`<p>O pacote sai com a velocidade do avião.</p>`], resp: "1000 m", sol: R`<p>Queda: $500 = 5t^2 \Rightarrow t = 10$ s; $100\cdot10 = 1000$ m. Sem ar, o pacote fica o tempo todo exatamente embaixo do avião.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · lançamentos</div>
        <div class="q">Uma bala disparada na horizontal e outra solta da mesma altura, no mesmo instante: qual chega primeiro ao chão?</div>
        <p>Chegam juntas (sem ar). O movimento horizontal não atrapalha a queda: são dois movimentos independentes acontecendo ao mesmo tempo, um MRU na horizontal e um MUV na vertical ${F.ret("A05")}. Com essa ideia de Galileu, todo lançamento vira duas contas simples.</p></div>`),

      F.secao("independencia", "Princípio da independência e lançamento horizontal", R`
        <p><b>Princípio da independência (Galileu)</b>: sem resistência do ar, a única aceleração é $\vec g$, vertical. Então a componente horizontal da velocidade nunca muda (MRU) e a vertical muda como numa queda livre (MUV com $a = -g$).</p>
        ${F.formula(R`x = v_xt,\qquad y = y_0 + v_{0y}t - \tfrac12gt^2,\qquad v_y = v_{0y} - gt`, "Lançamento: as duas direções")}
        <h3>Teorema 1: lançamento horizontal</h3>
        ${F.demo("demonstração", R`<p>(i) Lançado da altura $h$ com velocidade horizontal $v_0$: $v_{0y} = 0$.</p>
          <p>(ii) Chega ao chão quando $0 = h - \frac12gt^2$: $t_q = \sqrt{\frac{2h}g}$, o mesmo tempo de uma queda livre, qualquer que seja $v_0$.</p>
          <p>(iii) Alcance: $A = v_0t_q = v_0\sqrt{\frac{2h}g}$. $\blacksquare$</p>`)}
        ${F.caixa("fisico", R`<p><b>O caçador e o macaco</b>: um caçador mira direto num macaco pendurado num galho; no instante do disparo, o macaco se solta. Sem ar, a bala acerta sempre, qualquer que seja a velocidade da bala: os dois caem a mesma altura $\frac12gt^2$ no mesmo tempo, então a bala continua "mirando" no macaco durante a queda.</p>`)}
        <div id="lab-lanc"></div>`),

      F.secao("obliquo", "Lançamento oblíquo", R`
        <p>Com velocidade $v_0$ e ângulo $\theta$: $v_x = v_0\cos\theta$ e $v_{0y} = v_0\sin\theta$ ${F.ret("F03")}.</p>
        <h3>Teorema 2: altura máxima, tempo de voo e alcance (do chão ao chão)</h3>
        ${F.demo("demonstração", R`<p>(i) No topo $v_y = 0$: $t_s = \frac{v_0\sin\theta}g$. Torricelli na vertical: $H = \frac{v_0^2\sin^2\theta}{2g}$.</p>
          <p>(ii) Volta ao chão quando $y = 0$: $t\left(v_0\sin\theta - \frac g2t\right) = 0$, então $T = \frac{2v_0\sin\theta}g = 2t_s$ (subida e descida levam o mesmo tempo).</p>
          <p>(iii) Alcance: $R = v_xT = \frac{2v_0^2\sin\theta\cos\theta}g = \frac{v_0^2\sin2\theta}g$, usando $\sin2\theta = 2\sin\theta\cos\theta$. $\blacksquare$</p>`)}
        ${F.formula(R`H = \frac{v_0^2\sin^2\theta}{2g},\qquad T = \frac{2v_0\sin\theta}{g},\qquad R = \frac{v_0^2\sin2\theta}{g}`, "Lançamento oblíquo (do chão)")}
        <p><b>Consequências</b>: o alcance é máximo para $\sin2\theta = 1$, isto é, $\theta = 45°$, e vale $\frac{v_0^2}g$. Ângulos complementares ($\theta$ e $90° - \theta$) dão o mesmo alcance, porque $\sin(180° - 2\theta) = \sin2\theta$.</p>
        <h3>Teorema 3: a trajetória é uma parábola</h3>
        ${F.demo("demonstração", R`<p>(i) Da horizontal: $t = \frac{x}{v_0\cos\theta}$.</p>
          <p>(ii) Na vertical: $y = v_0\sin\theta\cdot\frac{x}{v_0\cos\theta} - \frac g2\cdot\frac{x^2}{v_0^2\cos^2\theta}$.</p>
          ${F.formula(R`y = x\tan\theta - \frac{g\,x^2}{2v_0^2\cos^2\theta}`, "Equação da trajetória")}
          <p>(iii) É um polinômio do 2º grau em $x$ com coeficiente de $x^2$ negativo: parábola com a concavidade para baixo. $\blacksquare$</p>`)}
        ${F.caixa("pegadinha", R`<p><b>No topo a velocidade não é zero</b>: só a componente vertical zera; a horizontal continua lá, $v_0\cos\theta$. E a aceleração no topo continua $g$, para baixo. Outro erro comum: usar $R = \frac{v_0^2\sin2\theta}g$ quando o lançamento sai de uma altura (aí os tempos de subida e descida são diferentes e a fórmula não vale).</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Equação em $\tan\theta$</b>: trocando $\frac1{\cos^2\theta}$ por $1 + \tan^2\theta$, a equação da trajetória vira uma equação do 2º grau em $\tan\theta$. Dá para achar os dois ângulos que acertam um alvo e, pelo discriminante, a <b>parábola de segurança</b>: a região que dá para atingir com uma velocidade fixa (exemplo de olimpíada e chefão).</p>`)}
        ${F.caixa("ponte", R`<p><b>Com resistência do ar</b>, a trajetória deixa de ser parábola: a descida fica mais íngreme que a subida e o ângulo de alcance máximo cai para menos de 45° (no futebol e no golfe, uns 30–40°). A conta exige resolver equações diferenciais ${F.ret("CII08")}; o tema ${F.ret("A09")} trata do arrasto.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-lanc"); e.outerHTML = F.lab("Lançamento oblíquo", "lab-lanc"); SIM.lancamento(document.getElementById("lab-lanc"), F); },
});
