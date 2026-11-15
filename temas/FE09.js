/* FE09 · Mínimos quadrados (regressão linear). Conferido em Python:
   dados A: x = 1…5, y = 2,1 3,9 6,2 7,8 10,0: x̄ = 3, ȳ = 6,0, Sxx = 10, Sxy = 19,7, a = 1,97, b = 0,09; resíduos 0,04 −0,13 0,20 −0,17 0,06 (soma 0);
   S = 0,091, s = √(0,091/3) = 0,174, σa = 0,0551, σb = 0,183; pela origem (1;2) (2;4,1) (3;5,9): a = 27,9/14 = 1,993;
   lab: v = 0,30 + 0,85t + ruído: a = 0,843 ± 0,014 m/s², b = 0,315 ± 0,036 m/s, S = 0,0131; com o ponto estragado: a = 0,872 ± 0,040, S = 0,101;
   chefão: F = 0,49 … 2,45 N, x = 1,9 4,1 5,8 8,1 9,9 cm: a = 4,082 ± 0,100 cm/N, b = −0,04 ± 0,16 cm (0,25σ de zero), k = 24,5 ± 0,6 N/m;
   retas extremas (Δx = 0,2): 4,082 ± 0,204; pela origem a = 4,059 cm/N → k = 24,6 N/m. */
F.registrar("FE09", {
  retoma: ["FE06", "FE03"],
  html(F) {
    const R = String.raw;
    const fig = (c, h = 215) => D.svg(560, h, c, "figura");
    const gL = (pts, a, b, o = {}) => { const xmax = o.xmax || Math.max(...pts.map((p) => p[0])) * 1.15, ymax = o.ymax || Math.max(...pts.map((p) => p[1])) * 1.2, X = (x) => 80 + (x / xmax) * 380, Y = (y) => 185 - (y / ymax) * 150;
      let quad = ""; if (o.quad) pts.forEach(([x, y]) => { const r = y - (a * x + b), l = Math.abs(r) * (150 / ymax); quad += `<rect x="${X(x)}" y="${Math.min(Y(y), Y(a * x + b))}" width="${l}" height="${l}" style="fill:color-mix(in srgb,var(--bad) 25%,transparent);stroke:var(--bad)"/>`; });
      return fig(D.graf({ x0: 80, y0: 185, w: 380, h: 150, xmax, ymin: 0, ymax, xlab: o.xlab || "x", ylab: o.ylab || "y", xt: o.xt || [], yt: o.yt || [], curvas: a === null ? [] : [{ pts: [[0, b], [xmax, a * xmax + b]].map(([x, y]) => [x, Math.max(0, Math.min(ymax, y))]), cor: "var(--ok)", trac: true }], pontos: pts }) + quad + (o.cruz ? `<path d="M${X(o.cruz[0]) - 7} ${Y(o.cruz[1])}h14M${X(o.cruz[0])} ${Y(o.cruz[1]) - 7}v14" style="stroke:var(--ok);stroke-width:2.5"/>` : "") + (o.extra || "")); };
    const A = [[1, 2.1], [2, 3.9], [3, 6.2], [4, 7.8], [5, 10.0]], figA = gL(A, 1.97, 0.09, { xmax: 6, ymax: 12, xt: [1, 2, 3, 4, 5], yt: [4, 8], cruz: [3, 6] }), figAq = gL(A, 1.97, 0.09, { xmax: 6, ymax: 12, xt: [1, 2, 3, 4, 5], yt: [4, 8], quad: true });
    const Fs = [0.49, 0.98, 1.47, 1.96, 2.45], xs = [1.9, 4.1, 5.8, 8.1, 9.9];
    const mq = (P) => { const N = P.length, xm = P.reduce((s, p) => s + p[0], 0) / N, ym = P.reduce((s, p) => s + p[1], 0) / N; let sxx = 0, sxy = 0; P.forEach(([x, y]) => { sxx += (x - xm) ** 2; sxy += (x - xm) * (y - ym); }); const a = sxy / sxx, b = ym - a * xm, S = P.reduce((s, [x, y]) => s + (y - a * x - b) ** 2, 0); return { xm, ym, sxx, sxy, a, b, S, sa: Math.sqrt(S / (N - 2) / sxx) }; };
    const exemplos = F.exemplo({
      titulo: "Mínimos quadrados",
      casos: [
        { nome: "Fácil: o ponto médio", gerar: (p) => {
          const P = p ? [[1, 3], [2, 5], [3, 4], [4, 8]] : F.escolha([[[1, 3], [2, 5], [3, 4], [4, 8]], [[1, 2], [2, 2.5], [3, 4.5], [4, 5]], [[0, 1], [1, 2.2], [2, 2.8], [3, 4.4]]]), m = mq(P);
          return { enun: R`<p>Pontos: ${P.map(([x, y]) => `$(${F.n(x)};\ ${F.n(y)})$`).join(", ")}. Por qual ponto a reta dos mínimos quadrados certamente passa?</p>`, fig: gL(P, m.a, m.b, { cruz: [m.xm, m.ym], xmax: 5, ymax: 10 }),
            passos: [R`<p>(i) Pelo Teorema 1, $b = \bar y - a\bar x$, ou seja, $\bar y = a\bar x + b$: o ponto $(\bar x, \bar y)$ está na reta.</p>`, R`<p>(ii) $\bar x = ${F.n(m.xm, 3)}$ e $\bar y = ${F.n(m.ym, 3)}$.</p>`, R`<p>(iii) A reta passa por $(${F.n(m.xm, 3)};\ ${F.n(m.ym, 3)})$, a cruz verde. Isso já ajuda a desenhar a reta à mão: gire-a em torno desse ponto.</p>`] };
        } },
        { nome: "Médio: a reta completa", gerar: (p) => {
          const P = p ? A : F.escolha([A, [[1, 1.8], [2, 4.2], [3, 5.9], [4, 8.3], [5, 9.8]], [[1, 3.1], [2, 4.9], [3, 7.2], [4, 8.8], [5, 11.0]]]), m = mq(P);
          return { enun: R`<p>Ache a reta dos mínimos quadrados para $x = 1, 2, 3, 4, 5$ e $y = ${P.map((q) => F.n(q[1])).join(";\\ ")}$.</p>`, fig: gL(P, m.a, m.b, { xmax: 6, ymax: 12.5, xt: [1, 2, 3, 4, 5], cruz: [m.xm, m.ym] }),
            passos: [R`<p>(i) $\bar x = 3$ e $\bar y = ${F.n(m.ym, 4)}$; desvios de $x$: $-2, -1, 0, 1, 2$, então $S_{xx} = 10$.</p>`, R`<p>(ii) $S_{xy} = \sum(x_i - \bar x)(y_i - \bar y) = ${F.n(m.sxy, 4)}$, logo $a = \frac{S_{xy}}{S_{xx}} = ${F.n(m.a, 4)}$.</p>`, R`<p>(iii) $b = \bar y - a\bar x = ${F.n(m.b, 3)}$. Reta: $y = ${F.n(m.a, 4)}\,x ${m.b < 0 ? "-" : "+"} ${F.n(Math.abs(m.b), 3)}$.</p>`] };
        } },
        { nome: "Olimpíada: a incerteza da inclinação", gerar: (p) => {
          const P = p ? A : F.escolha([A, [[1, 1.8], [2, 4.2], [3, 5.9], [4, 8.3], [5, 9.8]]]), m = mq(P), s = Math.sqrt(m.S / 3);
          return { enun: R`<p>Para os mesmos dados (reta $y = ${F.n(m.a, 4)}x ${m.b < 0 ? "-" : "+"} ${F.n(Math.abs(m.b), 3)}$), estime a incerteza da inclinação a partir do espalhamento dos pontos.</p>`, fig: gL(P, m.a, m.b, { xmax: 6, ymax: 12.5, xt: [1, 2, 3, 4, 5], quad: true }),
            passos: [R`<p>(i) Resíduos $r_i = y_i - (ax_i + b)$: ${P.map(([x, y]) => F.nt(y - m.a * x - m.b, 3)).join("; ")}. A soma dos quadrados é $S = ${F.n(m.S, 4)}$ (os quadrados vermelhos).</p>`, R`<p>(ii) Espalhamento: $s = \sqrt{\frac{S}{N - 2}} = \sqrt{\frac{${F.n(m.S, 4)}}{3}} = ${F.n(s, 3)}$.</p>`, R`<p>(iii) $\sigma_a = \frac{s}{\sqrt{S_{xx}}} = \frac{${F.n(s, 3)}}{\sqrt{10}} = ${F.n(m.sa, 3)}$. Resultado: $a = ${F.n(m.a, 3)} \pm ${F.n(m.sa, 2)}$.</p>`] };
        } },
      ],
    });
    const chefFig = gL(Fs.map((f, i) => [f, xs[i]]), 4.0816, -0.04, { xmax: 2.9, ymax: 12, xlab: "F (N)", ylab: "x (cm)", xt: [0.5, 1, 1.5, 2, 2.5], yt: [4, 8], cruz: [1.47, 5.96] });
    const chefao = F.chefao({
      titulo: "A mola pelos mínimos quadrados",
      enun: R`<p>Pendurando massas de 50 g em 50 g numa mola, as forças são $F = 0{,}49;\ 0{,}98;\ 1{,}47;\ 1{,}96;\ 2{,}45$ N e os alongamentos, $x = 1{,}9;\ 4{,}1;\ 5{,}8;\ 8{,}1;\ 9{,}9$ cm. (a) Ache a reta $x = aF + b$ pelos mínimos quadrados. (b) Ache $\sigma_a$ e $\sigma_b$ pelo espalhamento. (c) Ache $k$ com incerteza. (d) O coeficiente linear é compatível com zero? (e) Compare $\sigma_a$ com a incerteza das retas extremas (primeiro e último ponto, barras de 0,2 cm). Por que são diferentes?</p>`,
      fig: chefFig,
      dicas: [R`<p>(a) $\bar F = 1{,}47$ e $\bar x = 5{,}96$. Os desvios de $F$ são múltiplos de 0,49.</p>`, R`<p>(b) $s = \sqrt{S/(N - 2)}$, $\sigma_a = s/\sqrt{S_{xx}}$ e $\sigma_b = \sigma_a\sqrt{\overline{F^2}}$.</p>`, R`<p>(c) $k = 100/a$ (com $a$ em cm/N), e a incerteza relativa se mantém.</p>`],
      sol: R`<p><b>(a)</b> $S_{xx} = 0{,}49^2(4 + 1 + 0 + 1 + 4) = 2{,}401$ N² e $S_{xy} = 9{,}80$ N·cm, então $a = \frac{9{,}80}{2{,}401} \approx 4{,}082$ cm/N e $b = 5{,}96 - 4{,}082\cdot1{,}47 \approx -0{,}04$ cm.</p>
        <p><b>(b)</b> Resíduos: $-0{,}06;\ 0{,}14;\ -0{,}16;\ 0{,}14;\ -0{,}06$; $S = 0{,}072$; $s = \sqrt{0{,}072/3} \approx 0{,}155$ cm. $\sigma_a = \frac{0{,}155}{\sqrt{2{,}401}} \approx 0{,}100$ cm/N e $\sigma_b = 0{,}100\sqrt{\frac{\sum F^2}{5}} \approx 0{,}16$ cm.</p>
        <p><b>(c)</b> $k = \frac{100}{4{,}082} \approx 24{,}5$ N/m com $\frac{0{,}100}{4{,}082} \approx 2{,}4\%$: $k = (24{,}5 \pm 0{,}6)$ N/m.</p>
        <p><b>(d)</b> $\frac{|b|}{\sigma_b} = \frac{0{,}04}{0{,}16} \approx 0{,}25$: compatível com zero, como deve ser (sem força, sem alongamento). Então pode-se refazer o ajuste pela origem: $a = \frac{\sum Fx}{\sum F^2} \approx 4{,}059$ cm/N, $k \approx 24{,}6$ N/m.</p>
        <p><b>(e)</b> Retas extremas: $a = 4{,}08 \pm 0{,}20$, o dobro de $\sigma_a$. As retas extremas são um critério pessimista (quase um "intervalo máximo") e usam só dois pontos; os mínimos quadrados usam todos e dão um desvio padrão. Os dois métodos concordam no valor central. Conferi tudo em Python.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Dados: $x = 1, 2, 3, 4, 5$ e $y = 2{,}1;\ 3{,}9;\ 6{,}2;\ 7{,}8;\ 10{,}0$. Quanto vale $\bar y$?</p>`, fig: figA, num: { v: 6.0, tol: 0.005 }, dicas: [R`<p>Some e divida por 5.</p>`], resp: "6,0", sol: R`<p>$\frac{30{,}0}{5} = 6{,}0$.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Para esses dados, quanto vale $S_{xx} = \sum(x_i - \bar x)^2$?</p>`, fig: figA, num: { v: 10, tol: 0.001 }, dicas: [R`<p>Desvios: $-2, -1, 0, 1, 2$.</p>`], resp: "10", sol: R`<p>$4 + 1 + 0 + 1 + 4 = 10$.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Sabendo que $S_{xy} = 19{,}7$, qual a inclinação $a$?</p>`, fig: figA, num: { v: 1.97, tol: 0.003 }, dicas: [R`<p>$a = S_{xy}/S_{xx}$.</p>`], resp: "1,97", sol: R`<p>$\frac{19{,}7}{10} = 1{,}97$.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>E o coeficiente linear $b$?</p>`, fig: figA, num: { v: 0.09, tol: 0.02 }, dicas: [R`<p>$b = \bar y - a\bar x$.</p>`], resp: "0,09", sol: R`<p>$6{,}0 - 1{,}97\cdot3 = 0{,}09$.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>A reta dos mínimos quadrados (com coeficiente linear livre) sempre passa:</p>`, fig: figA, alts: ["pela origem.", R`pelo ponto médio $(\bar x, \bar y)$.`, "pelo primeiro ponto.", "pelo ponto mais alto.", "por metade dos pontos."], certa: "B", dicas: [R`<p>$b = \bar y - a\bar x$.</p>`], resp: "B", sol: R`<p>$\bar y = a\bar x + b$: passa por $(\bar x, \bar y)$.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Os resíduos dessa reta são $0{,}04;\ -0{,}13;\ 0{,}20;\ -0{,}17;\ 0{,}06$. Qual a soma dos quadrados $S$?</p>`, fig: figAq, num: { v: 0.091, tol: 0.01 }, dicas: [R`<p>$0{,}0016 + 0{,}0169 + \ldots$</p>`], resp: "0,091", sol: R`<p>$0{,}0016 + 0{,}0169 + 0{,}0400 + 0{,}0289 + 0{,}0036 = 0{,}091$.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Quanto vale a soma dos resíduos (sem elevar ao quadrado) de uma reta de mínimos quadrados com coeficiente linear livre?</p>`, fig: figAq, num: { v: 0, tol: 0.001, abs: 0.001 }, dicas: [R`<p>Some os resíduos do exercício anterior.</p>`], resp: "0", sol: R`<p>Zero, sempre: é a equação $\partial S/\partial b = 0$. Os pontos acima e abaixo se equilibram.</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Com $S = 0{,}091$ e $N = 5$ pontos, quanto vale o espalhamento $s = \sqrt{S/(N - 2)}$?</p>`, fig: figAq, num: { v: 0.1742, tol: 0.01 }, dicas: [R`<p>$\sqrt{0{,}091/3}$.</p>`], resp: "≈ 0,174", sol: R`<p>$\sqrt{0{,}0303} \approx 0{,}174$.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>E a incerteza da inclinação, $\sigma_a = s/\sqrt{S_{xx}}$?</p>`, fig: figAq, num: { v: 0.0551, tol: 0.02 }, dicas: [R`<p>$\frac{0{,}174}{\sqrt{10}}$.</p>`], resp: "≈ 0,055", sol: R`<p>$\approx 0{,}055$: $a = 1{,}97 \pm 0{,}06$.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Ajuste pela origem ($y = ax$) os pontos $(1;\ 2)$, $(2;\ 4{,}1)$ e $(3;\ 5{,}9)$. Quanto vale $a$?</p>`, fig: gL([[1, 2], [2, 4.1], [3, 5.9]], 1.9929, 0, { xmax: 3.6, ymax: 7.5, xt: [1, 2, 3] }), num: { v: 1.9929, tol: 0.003 }, dicas: [R`<p>$a = \frac{\sum xy}{\sum x^2}$ (Teorema 2).</p>`], resp: "≈ 1,993", sol: R`<p>$\frac{2 + 8{,}2 + 17{,}7}{1 + 4 + 9} = \frac{27{,}9}{14} \approx 1{,}993$.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Por que se divide por $N - 2$ (e não por $N$) ao estimar o espalhamento?</p>`, fig: figAq, alts: ["Por convenção, sem motivo.", "Porque a reta usou 2 parâmetros ajustados aos próprios dados: com 2 pontos, ela passaria exatamente por eles e S seria zero.", "Porque os dois pontos das pontas não contam.", "Para a incerteza ficar menor.", "Porque é uma reta de 2 dimensões."], certa: "B", dicas: [R`<p>Com $N = 2$, quanto vale $S$?</p>`], resp: "B", sol: R`<p>Dois parâmetros "gastam" dois graus de liberdade. Com $N = 2$, $S = 0$ e não há informação sobre o espalhamento: $\frac{0}{0}$, como deve ser. (Na média de FE03, um parâmetro: $N - 1$.)</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Mantendo $N$ e o ruído, você dobra a faixa de valores de $x$ (pontos duas vezes mais espaçados). $\sigma_a$ fica multiplicado por:</p>`, fig: gL([[1, 2], [2, 4], [3, 6], [4, 8]], 2, 0, { xmax: 9, ymax: 18, xt: [1, 2, 3, 4, 8], extra: D.txt(380, 70, "faixa × 2?", "tx2") }), num: { v: 0.5, tol: 0.01 }, dicas: [R`<p>$S_{xx}$ fica 4 vezes maior.</p>`], resp: "0,5", sol: R`<p>$\sigma_a \propto \frac1{\sqrt{S_{xx}}}$; $S_{xx} \times 4 \Rightarrow \sigma_a \times \tfrac12$. Mesma lição das retas extremas ${F.ret("FE06")}.</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>Mantendo a faixa e o ruído, você mede 4 vezes mais pontos. $\sigma_a$ fica multiplicado por:</p>`, fig: gL([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map((x) => [x, 2 * x]), 2, 0, { xmax: 4.6, ymax: 10, xt: [1, 2, 3, 4] }), num: { v: 0.5, tol: 0.01 }, dicas: [R`<p>$S_{xx}$ cresce proporcionalmente a $N$.</p>`], resp: "0,5", sol: R`<p>$S_{xx} \propto N$: $\sigma_a \propto \frac1{\sqrt N}$, a mesma regra da média ${F.ret("FE03")}.</p>` }),
      F.exercicio({ n: 14, nivel: "Máximo", enun: R`<p>Um único ponto muito fora da reta:</p>`, fig: gL([[1, 2], [2, 4], [3, 6], [4, 10], [5, 10]], 2.2, 0.0, { xmax: 6, ymax: 12, xt: [1, 2, 3, 4, 5], quad: true }), alts: ["quase não muda a reta, porque é só um.", "pode puxar bastante a reta, porque o resíduo entra ao quadrado.", "é ignorado pelo método.", "diminui S.", "só muda b, nunca a."], certa: "B", dicas: [R`<p>Um resíduo 4 vezes maior pesa 16 vezes mais.</p>`], resp: "B", sol: R`<p>Os quadrados dão muito peso aos pontos distantes: investigue pontos fora da curva antes de ajustar (veja o botão "estragar um ponto" no lab).</p>` }),
      F.exercicio({ n: 15, nivel: "Máximo", enun: R`<p>Os pontos têm incertezas diferentes. No ajuste ponderado, cada ponto deve pesar:</p>`, fig: fig(D.graf({ x0: 80, y0: 185, w: 380, h: 150, xmax: 6, ymin: 0, ymax: 12, xlab: "x", ylab: "y", xt: [1, 2, 3, 4, 5], curvas: [{ pts: [[0, 0], [6, 12]], cor: "var(--ok)", trac: true }], erros: [[1, 2.1, 0.3], [2, 3.8, 1.2], [3, 6.1, 0.3], [4, 8.6, 1.5], [5, 9.9, 0.3]] })), alts: ["igual.", R`proporcional a $1/\sigma_i^2$.`, R`proporcional a $\sigma_i$.`, R`proporcional a $\sigma_i^2$.`, "proporcional a x."], certa: "B", dicas: [R`<p>Lembre a média ponderada ${F.ret("FE05")}.</p>`], resp: "B", sol: R`<p>$w_i = 1/\sigma_i^2$, como na média ponderada: minimiza-se $\sum \frac{r_i^2}{\sigma_i^2}$ (o $\chi^2$).</p>` }),
      F.exercicio({ n: 16, nivel: "Máximo", enun: R`<p>A planilha diz $R^2 = 0{,}999$. Isso significa que:</p>`, fig: figA, alts: ["a incerteza da inclinação é 0,1%.", "os pontos estão muito bem alinhados, mas isso não dá a incerteza nem prova que o modelo está certo.", "o modelo linear está provado.", "não há erro sistemático.", "a reta passa pela origem."], certa: "B", dicas: [R`<p>Uma curva suave num intervalo curto também dá $R^2$ alto ${F.ret("FE07")}.</p>`], resp: "B", sol: R`<p>$R^2$ mede alinhamento. A incerteza é $\sigma_a$; o modelo se testa olhando os resíduos; erro sistemático não aparece em nenhum dos dois ${F.ret("FE10")}.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Física experimental · regressão</div>
        <div class="q">Cinco colegas desenham a "melhor reta" pelos mesmos pontos e saem cinco retas diferentes. Existe uma reta objetivamente melhor?</div>
        <p>Existe, se você disser o que é "melhor". O critério de Gauss e Legendre (por volta de 1800): a melhor reta é a que deixa <b>a soma dos quadrados dos resíduos</b> a menor possível. Com cálculo, dá para achá-la exatamente, e de quebra sai a incerteza.</p></div>
        ${F.chute({ q: "a reta dos mínimos quadrados sempre passa por qual ponto?", ops: ["Pela origem", "Pelo ponto médio (x̄, ȳ)", "Pelo primeiro e pelo último ponto", "Por pelo menos metade dos pontos"], certa: 1, exp: "Pelo ponto médio. Isso sai da equação ∂S/∂b = 0, que dá b = ȳ − a·x̄. Pela origem, só se você forçar." })}`),

      F.secao("metodo", "O método", R`
        <p>Para uma reta $y = ax + b$, o resíduo do ponto $i$ é $r_i = y_i - (ax_i + b)$. Definimos $S(a, b) = \sum r_i^2$.</p>
        <h3>Teorema 1: a reta que minimiza $S$ ∫</h3>
        ${F.demo("demonstração", R`<p>(i) No mínimo, as derivadas parciais se anulam ${F.ret("F04")}: $\frac{\partial S}{\partial b} = -2\sum(y_i - ax_i - b) = 0$ e $\frac{\partial S}{\partial a} = -2\sum x_i(y_i - ax_i - b) = 0$.</p>
          <p>(ii) A primeira dá $\sum y_i = a\sum x_i + Nb$, ou seja, $\bar y = a\bar x + b$: <b>a reta passa por $(\bar x, \bar y)$</b> e a soma dos resíduos é zero.</p>
          <p>(iii) Troque $b = \bar y - a\bar x$ na segunda: $\sum x_i\left[(y_i - \bar y) - a(x_i - \bar x)\right] = 0$. Como $\sum \bar x\left[(y_i - \bar y) - a(x_i - \bar x)\right] = 0$, pode-se trocar $x_i$ por $x_i - \bar x$: $\sum (x_i - \bar x)(y_i - \bar y) = a\sum(x_i - \bar x)^2$.</p>
          <p>(iv) Logo $a = \frac{S_{xy}}{S_{xx}}$ e $b = \bar y - a\bar x$. ($S$ é uma parábola com concavidade para cima em $a$ e em $b$, então é mesmo um mínimo.) $\blacksquare$</p>`)}
        ${F.formula(R`a = \frac{\sum(x_i - \bar x)(y_i - \bar y)}{\sum(x_i - \bar x)^2} = \frac{S_{xy}}{S_{xx}},\qquad b = \bar y - a\bar x`, "Mínimos quadrados")}
        <h3>Teorema 2: reta forçada pela origem</h3>
        ${F.demo("demonstração", R`<p>(i) Se a teoria garante $b = 0$ (e os dados confirmam), minimize $S(a) = \sum(y_i - ax_i)^2$.</p>
          <p>(ii) $S'(a) = -2\sum x_i(y_i - ax_i) = 0 \Rightarrow a = \frac{\sum x_iy_i}{\sum x_i^2}$. $\blacksquare$</p>`)}
        <div id="lab-minquad"></div>
        ${F.caixa("pegadinha", R`<p><b>Minimiza-se a distância vertical, não a perpendicular.</b> O método supõe que o erro está em $y$ e que $x$ é bem conhecido. Por isso, ponha no eixo $x$ a grandeza mais precisa; se as duas tiverem erro, converta o erro de $x$ como no FE06 ${F.ret("FE06")}.</p>`)}`),

      F.secao("incerteza", "A incerteza da inclinação", R`
        <h3>Teorema 3: $\sigma_a = \dfrac{\sigma_y}{\sqrt{S_{xx}}}$</h3>
        ${F.demo("demonstração", R`<p>(i) Como $\sum(x_i - \bar x)\,\bar y = 0$, dá para escrever $a = \sum c_iy_i$ com $c_i = \frac{x_i - \bar x}{S_{xx}}$: a inclinação é uma soma ponderada das medidas.</p>
          <p>(ii) Se cada $y_i$ tem desvio padrão $\sigma_y$ e as medidas são independentes, as variâncias se somam com os pesos ao quadrado ${F.ret("FE03")}: $\sigma_a^2 = \sigma_y^2\sum c_i^2 = \sigma_y^2\frac{\sum(x_i - \bar x)^2}{S_{xx}^2} = \frac{\sigma_y^2}{S_{xx}}$.</p>
          <p>(iii) Se $\sigma_y$ não é conhecido, estima-se pelo próprio espalhamento: $s = \sqrt{\frac{S}{N - 2}}$ (dois parâmetros ajustados). E para o coeficiente linear: $\sigma_b = \sigma_a\sqrt{\overline{x^2}}$. $\blacksquare$</p>`)}
        ${F.formula(R`s = \sqrt{\frac{\sum r_i^2}{N - 2}},\qquad \sigma_a = \frac{s}{\sqrt{S_{xx}}},\qquad \sigma_b = \sigma_a\sqrt{\frac{\sum x_i^2}{N}}`, "Incertezas do ajuste")}
        ${F.caixa("fisico", R`<p><b>Gauss usou os mínimos quadrados em 1801</b> para reencontrar o asteroide Ceres, perdido atrás do Sol depois de poucas semanas de observação. Com poucos pontos e muito ruído, o método previu onde ele estaria, e estava.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Na prova experimental, sem calculadora com regressão,</b> monte uma tabela com colunas $x_i - \bar x$, $y_i - \bar y$, os produtos e os quadrados. Escolher $x$ igualmente espaçados deixa os desvios inteiros (−2, −1, 0, 1, 2) e as contas ficam rápidas. Se o tempo apertar, use retas extremas ${F.ret("FE06")}.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade,</b> os mínimos quadrados se generalizam para qualquer modelo (polinômios, curvas não lineares, muitos parâmetros) em forma matricial: $\vec p = (A^\top A)^{-1}A^\top\vec y$. E se justificam pela estatística: com erros normais, eles dão a estimativa de máxima verossimilhança.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-minquad"); e.outerHTML = F.lab("Quadrados de verdade", "lab-minquad"); SIM.minquad(document.getElementById("lab-minquad"), F); },
});
