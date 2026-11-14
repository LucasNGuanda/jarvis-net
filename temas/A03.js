/* A03 · Movimento Retilíneo Uniformemente Variado. Conferido em Python (g = 10 m/s²):
   v₀ = 10, a = 2, t = 5: v = 20 m/s, Δs = 75 m; freada de 20 m/s a 5 m/s²: 40 m; queda de 45 m: 3 s e 30 m/s;
   72 km/h parando em 50 m: 4 m/s²; v₀ = 4 → v = 16 em 6 s: 60 m; reação 0,8 s a 72 km/h + freada a 5 m/s²: 56 m;
   dobrar a velocidade: freada ×4; Galileu: 5 m no 1º segundo → 35 m no 4º; trechos de 100 m em 10 s e 5 s: a = 4/3 m/s²;
   lançada a 20 m/s: sobe 20 m; A (repouso, 2 m/s²) × B (20 m/s): alcança em 20 s, em 400 m; distância máxima 100 m (t = 10 s);
   chefão (v = 20 m/s, reação 1 s, freada 5 m/s², aceleração 2 m/s², amarelo 3 s, cruzamento 12 m): parar exige D ≥ 60 m,
   passar exige D ≤ 52 m → zona de dilema 52 < D < 60 m; some com amarelo ≥ 3,33 s. Com 15 m/s: 37 < D < 37,5 m. */
F.registrar("A03", {
  retoma: ["A01", "A02", "F04"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 120) => D.svg(560, h, conteudo, "figura");
    const graf = (o, h = 210) => D.svg(560, h, D.graf(o), "gráfico");
    const exemplos = F.exemplo({
      titulo: "MUV",
      casos: [
        { nome: "Fácil: a freada", gerar: (p) => {
          const vk = p ? 72 : F.escolha([54, 72, 90, 108]), b = p ? 5 : F.escolha([4, 5, 8]), v0 = vk / 3.6, tp = v0 / b, d = (v0 * v0) / (2 * b);
          return { enun: R`<p>Um carro a ${vk} km/h freia com desaceleração constante de ${b} m/s² até parar. Quanto tempo leva e quantos metros anda freando?</p>`,
            fig: fig(D.estrada(40, 520, 90, 480 / Math.max(80, d * 1.2), Math.max(80, d * 1.2) > 100 ? 20 : 10, "m") + D.carro(60, 84, "var(--mA)") + D.seta(90, 48, 170, 48, "var(--warn)") + D.txt(130, 40, `${vk} km/h`, "tx2") + D.seta(320, 48, 260, 48, "var(--mT)") + D.txt(290, 40, `a = −${b} m/s²`, "tx2")),
            passos: [R`<p>(i) Converta: $v_0 = ${vk}\div3{,}6 = ${F.n(v0, 3)}$ m/s. Sentido positivo = sentido do movimento, então $a = -${b}$ m/s².</p>`, R`<p>(ii) Tempo: $0 = v_0 + at \Rightarrow t = \frac{v_0}{${b}} = ${F.n(tp, 3)}$ s.</p>`, R`<p>(iii) Distância (Torricelli): $0 = v_0^2 + 2a\Delta s \Rightarrow \Delta s = \frac{v_0^2}{2\cdot${b}} = ${F.n(d, 3)}$ m. Confira pela velocidade média: $\frac{v_0 + 0}{2}\,t = ${F.n((v0 / 2) * tp, 3)}$ m.</p>`] };
        } },
        { nome: "Médio: lançamento vertical", gerar: (p) => {
          const v0 = p ? 15 : F.escolha([10, 15, 20, 25]), h0 = p ? 20 : F.escolha([0, 20, 40]), g = 10, H = h0 + (v0 * v0) / (2 * g), tc = (v0 + Math.sqrt(v0 * v0 + 2 * g * h0)) / g, vc = Math.sqrt(v0 * v0 + 2 * g * h0);
          return { enun: R`<p>Do alto de um prédio de ${h0} m, uma pedra é lançada verticalmente para cima a ${v0} m/s. Qual a altura máxima em relação ao chão? Quanto tempo ela leva para chegar ao chão, e com que velocidade? ($g = 10$ m/s², sem resistência do ar.)</p>`,
            fig: fig(`<rect x="200" y="${118 - Math.min(80, h0 * 1.6)}" width="70" height="${Math.min(80, h0 * 1.6)}" style="fill:var(--line2)"/><line x1="100" y1="118" x2="460" y2="118" style="stroke:var(--ink2);stroke-width:2"/><circle cx="290" cy="${110 - Math.min(80, h0 * 1.6)}" r="5" style="fill:var(--warn)"/>` + D.seta(300, 108 - Math.min(80, h0 * 1.6), 300, 70 - Math.min(80, h0 * 1.6) * 0.6, "var(--warn)") + D.txt(340, 60, `${v0} m/s para cima`, "tx2"), 125),
            passos: [R`<p>(i) Eixo para cima, origem no chão: $y = ${h0} + ${v0}t - 5t^2$ e $v = ${v0} - 10t$.</p>`, R`<p>(ii) Altura máxima ($v = 0$): Torricelli $0 = ${v0}^2 - 2\cdot10\cdot(H - ${h0}) \Rightarrow H = ${h0} + \frac{${v0 * v0}}{20} = ${F.n(H, 3)}$ m.</p>`, R`<p>(iii) Chão: $0 = ${h0} + ${v0}t - 5t^2$, a raiz positiva é $t = \frac{${v0} + \sqrt{${v0 * v0} + ${20 * h0}}}{10} \approx ${F.n(tc, 3)}$ s. Velocidade: $|v| = \sqrt{${v0}^2 + 2\cdot10\cdot${h0}} \approx ${F.n(vc, 3)}$ m/s, para baixo.</p>`] };
        } },
        { nome: "Olimpíada: dois trechos iguais", gerar: (p) => {
          const d = p ? 60 : F.escolha([60, 100, 120]), t1 = p ? 6 : F.escolha([6, 10, 8]), t2 = p ? 4 : F.escolha([4, 5, 2]), a = (2 * d * (t1 - t2)) / (t1 * t2 * (t1 + t2)), vA = d / t1 - (a * t1) / 2;
          return { enun: R`<p>Um carro em MUV passa por três postes A, B e C, com $AB = BC = ${d}$ m. Ele leva ${t1} s de A até B e ${t2} s de B até C. Ache a aceleração e a velocidade em A.</p>`,
            fig: fig(D.estrada(40, 520, 90, 240 / d, d / 2, "m") + [0, 1, 2].map((k) => `<line x1="${40 + 240 * k}" y1="40" x2="${40 + 240 * k}" y2="90" style="stroke:var(--ink2);stroke-width:3"/>` + D.txt(40 + 240 * k, 32, "ABC"[k], "tx2")).join("") + D.txt(160, 62, `${t1} s`, "tx2") + D.txt(400, 62, `${t2} s`, "tx2")),
            passos: [R`<p>(i) Velocidade média de cada trecho $=$ velocidade no instante do meio do trecho (Teorema 4): $\frac{${d}}{${t1}} = ${F.n(d / t1, 3)}$ m/s em $t = ${F.n(t1 / 2)}$ s e $\frac{${d}}{${t2}} = ${F.n(d / t2, 3)}$ m/s em $t = ${t1} + ${F.n(t2 / 2)} = ${F.n(t1 + t2 / 2)}$ s.</p>`, R`<p>(ii) Aceleração: $a = \frac{${F.n(d / t2, 3)} - ${F.n(d / t1, 3)}}{${F.n(t1 + t2 / 2)} - ${F.n(t1 / 2)}} = ${F.n(a, 4)}$ m/s². Em geral, $a = \frac{2d(t_1 - t_2)}{t_1t_2(t_1 + t_2)}$.</p>`, R`<p>(iii) Velocidade em A: volte meio trecho no tempo, $v_A = ${F.n(d / t1, 3)} - a\cdot${F.n(t1 / 2)} = ${F.n(vA, 4)}$ m/s.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A zona de dilema do sinal amarelo",
      enun: R`<p>Um carro anda a $v = 20$ m/s quando o semáforo à frente fica amarelo; ele está a uma distância $D$ da faixa de parada. O motorista tem tempo de reação $t_r = 1$ s (anda em MRU durante ele). Depois, ou freia com no máximo $b = 5$ m/s², ou acelera com no máximo $a = 2$ m/s². O amarelo dura $T = 3$ s, e para passar sem infração o carro precisa atravessar o cruzamento inteiro, de largura $w = 12$ m depois da faixa, antes do vermelho.</p>
        <p>(a) Para que valores de $D$ ele consegue parar antes da faixa? (b) Para que valores de $D$ ele consegue atravessar tudo antes do vermelho? (c) Mostre que existe uma faixa de distâncias em que ele não consegue nem uma coisa nem outra (a "zona de dilema") e ache seus limites. (d) Repita para $v = 15$ m/s. (e) Qual a duração mínima do amarelo para a zona de dilema sumir a 20 m/s? (f) Por que a zona aumenta com a velocidade?</p>`,
      fig: fig(D.estrada(40, 520, 90, 5, 10, "m", false) + `<rect x="380" y="70" width="60" height="40" style="fill:color-mix(in srgb,var(--warn) 18%,transparent)"/><line x1="380" y1="62" x2="380" y2="110" style="stroke:var(--ink);stroke-width:3"/>` + D.txt(410, 125, "w = 12 m", "tx2") + D.carro(80, 84, "var(--mA)") + D.seta(80, 50, 378, 50, "var(--ink3)", 1.2) + D.txt(230, 44, "D", "txm") + `<circle cx="470" cy="34" r="9" style="fill:var(--warn)"/>`, 130),
      dicas: [R`<p>(a) Distância de parada: reação + freada, $vt_r + \frac{v^2}{2b}$.</p>`, R`<p>(b) Em $T$ segundos, o carro anda $vt_r$ e depois acelera por $T - t_r$: $vt_r + v(T - t_r) + \frac12a(T - t_r)^2$. Isso precisa ser pelo menos $D + w$.</p>`],
      sol: R`<p><b>(a)</b> Parar: $D \ge vt_r + \frac{v^2}{2b} = 20 + \frac{400}{10} = 60$ m.</p>
        <p><b>(b)</b> Passar: $D + w \le vT + \frac12a(T - t_r)^2 = 60 + 4 = 64$ m, então $D \le 52$ m.</p>
        <p><b>(c)</b> Para $52 < D < 60$ m, ele está perto demais para parar e longe demais para passar: uma zona de dilema de 8 m. Ali, qualquer decisão dá infração (ou pior, uma freada brusca que pode causar batida traseira).</p>
        <p><b>(d)</b> A 15 m/s: parar exige $D \ge 15 + 22{,}5 = 37{,}5$ m; passar exige $D \le 15\cdot3 + 4 - 12 = 37$ m. A zona encolhe para meio metro, praticamente some.</p>
        <p><b>(e)</b> Precisamos de $vT + \frac12a(T - 1)^2 - w \ge 60$: $20T + (T - 1)^2 - 12 \ge 60 \Rightarrow T^2 + 18T - 71 \ge 0 \Rightarrow T \ge \frac{-18 + \sqrt{608}}2 \approx 3{,}33$ s.</p>
        <p><b>(f)</b> A distância de parada cresce com $v^2$ (o termo $\frac{v^2}{2b}$), enquanto a distância que dá para atravessar no amarelo cresce só com $v$ (o termo $vT$). Para $v$ grande, o quadrado ganha: por isso os engenheiros de trânsito aumentam o amarelo em avenidas mais rápidas. Conferido em Python.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Um móvel tem $v_0 = 10$ m/s e aceleração constante de 2 m/s². Qual a velocidade em $t = 5$ s?</p>`, fig: graf({ x0: 60, y0: 180, w: 420, h: 140, xmax: 6, ymin: 0, ymax: 25, xlab: "t (s)", ylab: "v (m/s)", xt: [0, 1, 2, 3, 4, 5, 6], yt: [10, 20], curvas: [{ pts: [[0, 10], [6, 22]], cor: "var(--mA)" }] }), num: { v: 20, un: "m/s" }, dicas: [R`<p>$v = v_0 + at$.</p>`], resp: "20 m/s", sol: R`<p>$10 + 2\cdot5 = 20$ m/s.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>No exercício anterior, quanto o móvel andou nesses 5 s?</p>`, num: { v: 75, un: "m" }, dicas: [R`<p>$\Delta s = v_0t + \frac12at^2$, ou a área do trapézio no gráfico.</p>`], resp: "75 m", sol: R`<p>$50 + 25 = 75$ m. Trapézio: $\frac{(10 + 20)}2\cdot5 = 75$ m.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Um carro a 20 m/s freia com desaceleração constante de 5 m/s². Quantos metros anda até parar?</p>`, fig: fig(D.estrada(40, 520, 90, 9, 5, "m") + D.carro(60, 84, "var(--mA)") + D.seta(90, 50, 160, 50, "var(--warn)") + D.txt(125, 40, "20 m/s", "tx2")), num: { v: 40, un: "m" }, dicas: [R`<p>Torricelli com $v = 0$.</p>`], resp: "40 m", sol: R`<p>$\Delta s = \frac{v_0^2}{2b} = \frac{400}{10} = 40$ m.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Uma pedra é solta do alto de um prédio de 45 m. Quanto tempo leva para chegar ao chão? ($g = 10$ m/s²)</p>`, fig: fig(`<rect x="230" y="20" width="60" height="98" style="fill:var(--line2)"/><line x1="120" y1="118" x2="440" y2="118" style="stroke:var(--ink2);stroke-width:2"/><circle cx="305" cy="24" r="5" style="fill:var(--warn)"/>` + D.seta(305, 32, 305, 100, "var(--warn)", 1.4) + D.txt(345, 70, "45 m", "tx2"), 125), num: { v: 3, un: "s" }, dicas: [R`<p>Do repouso: $h = \frac12gt^2$.</p>`], resp: "3 s", sol: R`<p>$45 = 5t^2 \Rightarrow t = 3$ s.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Com que velocidade a pedra do exercício anterior chega ao chão?</p>`, num: { v: 30, un: "m/s" }, dicas: [R`<p>$v = gt$, ou Torricelli: $v^2 = 2gh$.</p>`], resp: "30 m/s", sol: R`<p>$10\cdot3 = 30$ m/s $= 108$ km/h.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Um carro a 72 km/h para em 50 m, freando com desaceleração constante. Qual o módulo da desaceleração?</p>`, alts: ["1,44 m/s²", "2 m/s²", "4 m/s²", "7,2 m/s²", "51,8 m/s²"], certa: "C", dicas: [R`<p>Converta para m/s e use Torricelli.</p>`], resp: "C", sol: R`<p>$0 = 20^2 - 2b\cdot50 \Rightarrow b = 4$ m/s². <b>E</b> usa 72 em vez de 20 ($72^2/100$).</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Num MUV, a velocidade passa de 4 m/s para 16 m/s em 6 s. Quanto o corpo andou?</p>`, fig: graf({ x0: 60, y0: 180, w: 420, h: 140, xmax: 6, ymin: 0, ymax: 18, xlab: "t (s)", ylab: "v (m/s)", xt: [0, 6], yt: [4, 16], curvas: [{ pts: [[0, 4], [6, 16]], cor: "var(--mA)", area: true }] }), num: { v: 60, un: "m" }, dicas: [R`<p>No MUV, $v_m = \frac{v_0 + v}2$.</p>`], resp: "60 m", sol: R`<p>$\frac{4 + 16}2\cdot6 = 60$ m.</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Um motorista a 72 km/h vê um obstáculo. Seu tempo de reação é 0,8 s e depois ele freia a 5 m/s². Qual a distância total até parar?</p>`, fig: fig(D.estrada(40, 520, 90, 7, 10, "m") + D.carro(60, 84, "var(--mA)") + `<rect x="190" y="70" width="8" height="20" style="fill:var(--mT)"/>` + D.txt(130, 46, "reação (MRU)", "tx2") + D.txt(330, 46, "freada (MUV)", "tx2")), num: { v: 56, un: "m" }, dicas: [R`<p>Durante a reação, ele continua a 20 m/s.</p>`, R`<p>Some $20\cdot0{,}8$ com $\frac{20^2}{2\cdot5}$.</p>`], resp: "56 m", sol: R`<p>$16 + 40 = 56$ m.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Por quanto se multiplica a distância de freada (sem contar a reação) quando a velocidade dobra, mantendo a mesma desaceleração?</p>`, num: { v: 4, un: "vezes" }, dicas: [R`<p>$d = \frac{v^2}{2b}$.</p>`], resp: "4 vezes", sol: R`<p>$d \propto v^2$: dobrar $v$ quadruplica $d$. Por isso os limites de velocidade importam tanto.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Um corpo parte do repouso em MUV e anda 5 m no primeiro segundo. Quantos metros anda durante o quarto segundo (de $t = 3$ s a $t = 4$ s)?</p>`, num: { v: 35, un: "m" }, dicas: [R`<p>Regra de Galileu: em segundos sucessivos, as distâncias seguem $1 : 3 : 5 : 7 : \ldots$</p>`], resp: "35 m", sol: R`<p>$7\cdot5 = 35$ m. Conferindo: $s(4) - s(3) = 5\cdot16 - 5\cdot9 = 35$ m (com $\frac a2 = 5$).</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Um carro em MUV percorre dois trechos consecutivos de 100 m: o primeiro em 10 s e o segundo em 5 s. Qual a aceleração?</p>`, num: { v: 4 / 3, un: "m/s²" }, dicas: [R`<p>A velocidade média de um trecho é a velocidade no instante do meio dele.</p>`, R`<p>10 m/s em $t = 5$ s e 20 m/s em $t = 12{,}5$ s.</p>`], resp: "4/3 ≈ 1,33 m/s²", sol: R`<p>$a = \frac{20 - 10}{7{,}5} = \frac43$ m/s². É o exemplo de olimpíada.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Uma bola é lançada verticalmente para cima a 20 m/s. Qual a altura máxima? ($g = 10$ m/s²)</p>`, num: { v: 20, un: "m" }, dicas: [R`<p>No topo, $v = 0$.</p>`], resp: "20 m", sol: R`<p>$H = \frac{v_0^2}{2g} = 20$ m, alcançada em 2 s. Ela volta à mão em 4 s, com 20 m/s para baixo (simetria).</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>Um carro A parte do repouso com aceleração de 2 m/s² no exato instante em que um carro B passa por ele a 20 m/s constantes. Em quanto tempo A alcança B?</p>`, fig: graf({ x0: 60, y0: 180, w: 420, h: 140, xmax: 25, ymin: 0, ymax: 50, xlab: "t (s)", ylab: "v (m/s)", xt: [0, 10, 20], yt: [20, 40], curvas: [{ pts: [[0, 20], [25, 20]], cor: "var(--mT)" }, { pts: [[0, 0], [25, 50]], cor: "var(--mA)" }] }), num: { v: 20, un: "s" }, dicas: [R`<p>$s_A = t^2$ e $s_B = 20t$.</p>`, R`<p>No gráfico $v \times t$: as áreas sob as duas retas ficam iguais.</p>`], resp: "20 s", sol: R`<p>$t^2 = 20t \Rightarrow t = 20$ s, em 400 m. Nesse instante, A está a 40 m/s: o dobro da velocidade de B (sempre acontece quando um parte do repouso em MUV e o outro está em MRU).</p>` }),
      F.exercicio({ n: 14, nivel: "Máximo", enun: R`<p>No exercício anterior, qual a maior distância entre os dois antes de A alcançar B?</p>`, num: { v: 100, un: "m" }, dicas: [R`<p>A distância para de crescer quando as velocidades ficam iguais.</p>`], resp: "100 m", sol: R`<p>Velocidades iguais em $t = 10$ s; $d = 20\cdot10 - 10^2 = 100$ m. No gráfico: a área do triângulo entre as retas até $t = 10$ s, $\frac12\cdot10\cdot20$.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · MUV</div>
        <div class="q">Se você dobrar a velocidade do carro, a distância para parar dobra?</div>
        <p>Não: quadruplica. Quando a velocidade muda sempre do mesmo tanto a cada segundo (aceleração constante), a posição deixa de ser uma reta no tempo e vira uma parábola. Freadas, quedas livres e arrancadas são todos esse mesmo movimento.</p></div>`),

      F.secao("equacoes", "As equações do MUV", R`
        <p>No <b>movimento uniformemente variado</b>, a aceleração escalar é constante e não nula.</p>
        <h3>Teorema 1: velocidade em função do tempo</h3>
        ${F.demo("demonstração", R`<p>(i) Com $a$ constante, a aceleração média em qualquer intervalo é $a$: $\frac{v - v_0}{t - 0} = a$.</p>
          ${F.formula(R`v = v_0 + at`, "Função horária da velocidade")}
          <p>(ii) Com cálculo: $\frac{dv}{dt} = a \Rightarrow v - v_0 = \int_0^ta\,dt' = at$ ${F.ret("F04")}. $\blacksquare$</p>`)}
        <h3>Teorema 2: posição em função do tempo</h3>
        ${F.demo("demonstração pela área", R`<p>(i) O gráfico $v \times t$ é uma reta de $v_0$ (em $t = 0$) até $v_0 + at$ (no instante $t$).</p>
          <p>(ii) O deslocamento é a área sob ela ${F.ret("A02")}: um trapézio de bases $v_0$ e $v_0 + at$ e altura $t$:</p>
          <p>$$\Delta s = \frac{v_0 + (v_0 + at)}{2}\cdot t = v_0t + \frac12at^2.$$</p>
          ${F.formula(R`s = s_0 + v_0t + \tfrac12at^2`, "Função horária da posição")}
          <p>(iii) Com cálculo: $s - s_0 = \int_0^t(v_0 + at')\,dt' = v_0t + \frac12at^2$. $\blacksquare$</p>`)}
        <h3>Teorema 3: equação de Torricelli</h3>
        ${F.demo("demonstração", R`<p>(i) Do Teorema 1: $t = \frac{v - v_0}a$.</p>
          <p>(ii) Substitua no Teorema 2: $\Delta s = v_0\frac{v - v_0}a + \frac a2\frac{(v - v_0)^2}{a^2} = \frac{2v_0(v - v_0) + (v - v_0)^2}{2a} = \frac{(v - v_0)(v + v_0)}{2a} = \frac{v^2 - v_0^2}{2a}$.</p>
          ${F.formula(R`v^2 = v_0^2 + 2a\,\Delta s`, "Torricelli (sem o tempo)")}
          <p>(iii) Com cálculo: $a = \frac{dv}{dt} = \frac{dv}{ds}\frac{ds}{dt} = v\frac{dv}{ds}$, então $a\,ds = v\,dv$ e, integrando, $a\Delta s = \frac{v^2 - v_0^2}2$. $\blacksquare$</p>`)}
        <h3>Teorema 4: velocidade média no MUV</h3>
        ${F.demo("demonstração", R`<p>(i) $v_m = \frac{\Delta s}{t} = v_0 + \frac12at = \frac{v_0 + (v_0 + at)}{2} = \frac{v_0 + v}{2}$.</p>
          ${F.formula(R`v_m = \frac{v_0 + v}{2} = v\!\left(\tfrac t2\right)`, "Velocidade média no MUV")}
          <p>(ii) Como $v$ é linear em $t$, a média aritmética das velocidades extremas é a velocidade no instante do meio do intervalo. Isso só vale no MUV! $\blacksquare$</p>`)}
        <div id="lab-muv"></div>`),

      F.secao("galileu", "Queda livre e a regra de Galileu", R`
        <p>Perto da superfície da Terra e desprezando o ar, todo corpo cai com a mesma aceleração $g \approx 9{,}8$ m/s² (usaremos 10), não importa a massa. É um MUV: com o eixo para cima, $a = -g$.</p>
        ${F.caixa("fisico", R`<p><b>O martelo e a pena</b>: em 1971, na Lua (sem ar), o astronauta David Scott, da Apollo 15, soltou um martelo e uma pena juntos. Chegaram ao chão ao mesmo tempo, como Galileu tinha previsto. Na Terra a pena demora porque o ar a freia ${F.ret("A09")}, não porque é leve.</p>`)}
        <h3>Teorema 5: distâncias em segundos sucessivos (Galileu)</h3>
        ${F.demo("demonstração", R`<p>(i) Do repouso, $s(t) = \frac a2t^2$. Em intervalos iguais $\tau$, as posições são $\frac a2\tau^2\cdot(1, 4, 9, 16, \ldots)$.</p>
          <p>(ii) As distâncias em cada intervalo são as diferenças: $n^2 - (n - 1)^2 = 2n - 1$, ou seja, proporcionais a $1, 3, 5, 7, \ldots$ $\blacksquare$</p>
          <p>Foi assim que Galileu, com planos inclinados e o próprio pulso como relógio, descobriu que a queda é um movimento de aceleração constante.</p>`)}
        <p><b>Lançamento vertical</b>: o tempo de subida é igual ao de descida até o mesmo nível, e a velocidade volta com o mesmo módulo (é a mesma parábola percorrida de trás para frente). Altura máxima: $H = \frac{v_0^2}{2g}$.</p>
        ${F.caixa("pegadinha", R`<p><b>Sinais!</b> Escolha um sentido positivo e mantenha. "Desaceleração de 5 m/s²" com o movimento no sentido positivo significa $a = -5$. No lançamento para cima com eixo para cima, $a = -g$ <b>o tempo todo</b>, inclusive no ponto mais alto (lá $v = 0$, mas $a \ne 0$: se fosse zero, a pedra ficaria parada no ar).</p>`)}`),

      F.secao("freada", "Freada e tempo de reação", R`
        ${F.formula(R`d_\text{total} = \underbrace{v_0\,t_r}_{\text{reação (MRU)}} + \underbrace{\frac{v_0^2}{2b}}_{\text{freada (MUV)}}`, "Distância de parada")}
        <p>O primeiro termo cresce com $v_0$; o segundo, com $v_0^2$. Em velocidade alta, a freada domina: a 108 km/h e 5 m/s², são 90 m só freando.</p>
        ${F.caixa("olimpiada", R`<p><b>Truque do instante do meio</b> (Teorema 4): a velocidade média de cada trecho dá a velocidade instantânea no meio do trecho. Com dois trechos, você tem duas velocidades em dois instantes conhecidos, e a aceleração sai direto, sem montar sistema. Veja o exemplo de olimpíada.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, a aceleração quase nunca é constante: com $a(t)$ qualquer, $v = v_0 + \int a\,dt$ e $s = s_0 + \int v\,dt$ ${F.ret("F04")}. As fórmulas do MUV são o caso particular $a$ = constante. Quando a força depende da velocidade (resistência do ar), aparece uma equação diferencial ${F.ret("CII08")}.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-muv"); e.outerHTML = F.lab("MUV: gráficos e freada", "lab-muv"); SIM.muv(document.getElementById("lab-muv"), F); },
});
