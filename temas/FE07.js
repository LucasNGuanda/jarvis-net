/* FE07 · Linearização: transformando curvas em retas. Conferido em Python:
   lab: com 0,3% de ruído, a transformação certa dá curvatura < 0,4% e as erradas > 6% (critério do lab: 1,5%);
   T² × L com inclinação 4,0 s²/m: g = 4π²/4 = 9,87; Δ(t²) = 2·0,45·0,01 = 0,009 s²; Δ√h = 0,01/(2·0,9) = 0,0056; I = 0,32/0,4² = 2,0;
   t × √h com inclinação 0,4515: g = 2/0,4515² = 9,81; massa-mola T² × m inclinação 0,16 s²/kg: k = 4π²/0,16 = 246,7 N/m; coef. linear 0,008 s²: m_ef = 0,05 kg;
   alcance R × sen 2θ inclinação 2,5 m: v = √(2,5·9,8) = 4,95 m/s; descarga ln V × t, inclinação −0,5/s: τ = 2 s;
   chefão: h = 0,20 0,45 0,80 1,25 1,80 m, t = 0,262 0,364 0,463 0,566 0,666 s (±0,01): √h = 0,447 … 1,342; retas extremas 0,4740 e 0,4293 →
   a = 0,452 ± 0,022 s/√m, b = 0,04 e 0,08 → t₀ = 0,06 ± 0,02 s; g = 2/a² = 9,80 ± 0,97 m/s² (9,9%); só o último ponto, sem atraso: 2·1,80/0,666² = 8,12 m/s². */
F.registrar("FE07", {
  retoma: ["FE06", "FE04"],
  html(F) {
    const R = String.raw;
    const fig = (c, h = 215) => D.svg(560, h, c, "figura");
    const g2 = (pts, o = {}) => { const xmax = o.xmax || Math.max(...pts.map((p) => p[0])) * 1.15, ymax = o.ymax || Math.max(...pts.map((p) => p[1])) * 1.2; return D.graf({ x0: 80, y0: 185, w: 380, h: 150, xmax, ymin: 0, ymax, xlab: o.xlab || "x", ylab: o.ylab || "y", xt: o.xt || [], yt: o.yt || [], curvas: o.curvas || [], pontos: o.pts === false ? [] : pts, erros: o.erros || [] }); };
    /* dupla: curva original à esquerda (pequena), reta à direita */
    const dupla = (f, xa, xb, tx, rx, ry, lx, ly, ty = (y) => y) => { const pts = Array.from({ length: 6 }, (_, i) => xa + ((xb - xa) * i) / 5).map((x) => [x, f(x)]), ymax = Math.max(...pts.map((p) => p[1])) * 1.2, xm = xb * 1.15, tp = pts.map(([x, y]) => [tx(x), ty(y)]), xm2 = Math.max(...tp.map((p) => p[0])) * 1.15, ymax2 = Math.max(...tp.map((p) => p[1])) * 1.2;
      return fig(D.graf({ x0: 40, y0: 180, w: 200, h: 140, xmax: xm, ymin: 0, ymax, xlab: lx, ylab: ly, curvas: [{ pts: D.amostra(f, xa * 0.5, xb), cor: "var(--ink3)" }], pontos: pts }) + D.txt(150, 205, "curva", "tx2") + D.seta(262, 110, 298, 110, "var(--mN)", 2) + D.graf({ x0: 320, y0: 180, w: 200, h: 140, xmax: xm2, ymin: 0, ymax: ymax2, xlab: rx, ylab: ry, curvas: [{ pts: [[0, 0], [xm2, (tp[5][1] / tp[5][0]) * xm2]].map(([x, y]) => [x, Math.min(ymax2, y)]), cor: "var(--ok)", trac: true }], pontos: tp }) + D.txt(430, 205, "reta", "tx2"), 215); };
    const quedaF = dupla((t) => 4.9 * t * t, 0.15, 0.6, (t) => t * t, "t²", "h", "t", "h");
    const pendF = dupla((L) => 2 * Math.PI * Math.sqrt(L / 9.8), 0.2, 1.2, (L) => Math.sqrt(L), "√L", "T", "L", "T");
    const hs = [0.2, 0.45, 0.8, 1.25, 1.8], ts = [0.262, 0.364, 0.463, 0.566, 0.666];
    const chefFig = fig(g2(hs.map((h, i) => [Math.sqrt(h), ts[i]]), { xmax: 1.55, ymax: 0.8, xlab: "√h (√m)", ylab: "t (s)", xt: [0.5, 1, 1.5], yt: [0.2, 0.4, 0.6], erros: hs.map((h, i) => [Math.sqrt(h), ts[i], 0.01]), curvas: [{ pts: [[0, 0.06], [1.5, 0.06 + 0.4517 * 1.5]], cor: "var(--ok)", trac: true }], pts: false }) + D.txt(84, 172, "t₀?", "tx2", "start"));
    const exemplos = F.exemplo({
      titulo: "Linearizar",
      casos: [
        { nome: "Fácil: g pela queda livre", gerar: (p) => {
          const k = p ? 4.9 : F.escolha([4.85, 4.9, 4.95, 4.8]);
          return { enun: R`<p>Soltando uma bolinha de várias alturas $h$ e medindo o tempo de queda $t$, o gráfico $h \times t$ é uma parábola. O que pôr nos eixos para obter uma reta? Se a inclinação der $${F.n(k)}$ m/s², quanto vale $g$?</p>`, fig: quedaF,
            passos: [R`<p>(i) $h = \tfrac12 g\,t^2$. Chamando $X = t^2$: $h = \left(\tfrac g2\right)X$, uma reta pela origem.</p>`, R`<p>(ii) No gráfico $h \times t^2$, a inclinação é $\tfrac g2 = ${F.n(k)}$ m/s².</p>`, R`<p>(iii) $g = 2\cdot${F.n(k)} = ${F.n(2 * k, 3)}$ m/s².</p>`] };
        } },
        { nome: "Médio: g pelo pêndulo, com incerteza", gerar: (p) => {
          const a = p ? 4.0 : F.escolha([3.98, 4.02, 4.05]), da = p ? 0.08 : F.escolha([0.05, 0.08, 0.1]), g = (4 * Math.PI ** 2) / a;
          return { enun: R`<p>Medindo o período $T$ para vários comprimentos $L$, o gráfico $T^2 \times L$ deu inclinação $(${F.n(a)} \pm ${F.n(da)})$ s²/m. Ache $g$ com incerteza.</p>`, fig: dupla((L) => 2 * Math.PI * Math.sqrt(L / 9.8), 0.2, 1.2, (L) => L, "L", "T²", "L", "T", (T) => T * T),
            passos: [R`<p>(i) $T = 2\pi\sqrt{L/g} \Rightarrow T^2 = \frac{4\pi^2}{g}L$: inclinação $a = \frac{4\pi^2}{g}$.</p>`, R`<p>(ii) $g = \frac{4\pi^2}{a} = \frac{39{,}48}{${F.n(a)}} = ${F.n(g, 4)}$ m/s².</p>`, R`<p>(iii) $g \propto a^{-1}$: $\frac{\Delta g}g = \frac{\Delta a}a = ${F.n((100 * da) / a, 3)}\%$, então $\Delta g = ${F.n((g * da) / a, 2)}$ m/s².</p>`] };
        } },
        { nome: "Olimpíada: o coeficiente linear conta uma história", gerar: (p) => {
          const r = p ? 0.02 : F.escolha([0.015, 0.02, 0.025]), a = (4 * Math.PI ** 2) / 9.79, b = a * r;
          return { enun: R`<p>Um aluno mediu $L$ do ponto de suspensão até o <b>topo</b> da esfera (esqueceu o raio $r$). O gráfico $T^2 \times L$ deu inclinação $${F.n(a, 3)}$ s²/m e coeficiente linear $${F.n(b, 3)}$ s². O $g$ fica errado? Quanto vale $r$?</p>`, fig: fig(g2([0.3, 0.5, 0.7, 0.9, 1.1].map((L) => [L, a * (L + r)]), { xmax: 1.3, ymax: 5.2, xlab: "L (m)", ylab: "T² (s²)", xt: [0.5, 1], yt: [2, 4], curvas: [{ pts: [[0, b], [1.3, a * (1.3 + r)]], cor: "var(--ok)", trac: true }] })),
            passos: [R`<p>(i) O comprimento certo é $L + r$: $T^2 = \frac{4\pi^2}g(L + r) = \frac{4\pi^2}gL + \frac{4\pi^2}g r$.</p>`, R`<p>(ii) A inclinação continua $\frac{4\pi^2}g$: $g = \frac{4\pi^2}{${F.n(a, 3)}} \approx ${F.n((4 * Math.PI ** 2) / a, 3)}$ m/s². O erro foi parar só no coeficiente linear (Teorema 3).</p>`, R`<p>(iii) $r = \frac{b}{a} = \frac{${F.n(b, 3)}}{${F.n(a, 3)}} = ${F.n(r, 3)}$ m. O gráfico mediu até o raio esquecido!</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O atraso escondido",
      enun: R`<p>Uma bolinha é solta de um eletroímã e o cronômetro dispara junto com o desligamento da corrente, mas o eletroímã demora um tempo fixo $t_0$ para soltar a bolinha. Medidas ($\Delta t = 0{,}01$ s): $h = 0{,}20;\ 0{,}45;\ 0{,}80;\ 1{,}25;\ 1{,}80$ m e $t = 0{,}262;\ 0{,}364;\ 0{,}463;\ 0{,}566;\ 0{,}666$ s. (a) Usando só o último ponto e $g = 2h/t^2$, quanto daria $g$? (b) Mostre que $t \times \sqrt h$ é uma reta e diga o significado da inclinação e do coeficiente linear. (c) Ache a inclinação e o coeficiente linear pelas retas extremas (primeiro e último ponto). (d) Ache $g$ com incerteza e o atraso $t_0$. (e) Por que esse gráfico é melhor que $h \times t^2$?</p>`,
      fig: chefFig,
      dicas: [R`<p>(b) O tempo medido é $t = t_0 + \sqrt{2h/g}$.</p>`, R`<p>(c) $a_\text{máx} = \frac{(0{,}666 + 0{,}01) - (0{,}262 - 0{,}01)}{\sqrt{1{,}80} - \sqrt{0{,}20}}$.</p>`, R`<p>(d) $g = \frac{2}{a^2}$, e o expoente $-2$ dobra a incerteza relativa.</p>`],
      sol: R`<p><b>(a)</b> $g = \frac{2\cdot1{,}80}{0{,}666^2} \approx 8{,}1$ m/s²: o atraso estraga tudo.</p>
        <p><b>(b)</b> $t = \sqrt{\tfrac2g}\,\sqrt h + t_0$: inclinação $\sqrt{2/g}$ e coeficiente linear $t_0$.</p>
        <p><b>(c)</b> $\sqrt h$ vai de 0,447 a 1,342. $a_\text{máx} = \frac{0{,}676 - 0{,}252}{0{,}894} \approx 0{,}474$ e $a_\text{mín} = \frac{0{,}656 - 0{,}272}{0{,}894} \approx 0{,}429$: $a = (0{,}452 \pm 0{,}022)$ s/√m. Os coeficientes lineares das retas são 0,04 e 0,08 s (e elas cruzam as barras do meio).</p>
        <p><b>(d)</b> $g = \frac{2}{0{,}452^2} \approx 9{,}80$ m/s², com $\frac{\Delta g}g = 2\cdot\frac{0{,}022}{0{,}452} \approx 9{,}9\%$: $g = (9{,}8 \pm 1{,}0)$ m/s². Atraso: $t_0 = (0{,}06 \pm 0{,}02)$ s.</p>
        <p><b>(e)</b> Um atraso constante desloca todos os tempos igualmente: no gráfico $t \times \sqrt h$, isso só muda o coeficiente linear e a inclinação continua certa. Em $h \times t^2$, o atraso entra ao quadrado ($(t_\text{real} + t_0)^2$) e entorta a reta, puxando $g$ para baixo. Linearize de forma que os erros constantes caiam no coeficiente linear. Conferi tudo em Python.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Na queda livre a partir do repouso, que gráfico dá uma reta pela origem?</p>`, fig: quedaF, alts: ["$h \\times t$", R`$h \times t^2$`, R`$h \times \sqrt t$`, R`$h \times 1/t$`, R`$t \times h$`], certa: "B", dicas: [R`<p>$h = \tfrac12 g t^2$.</p>`], resp: "B", sol: R`<p>$h = \left(\tfrac g2\right)t^2$: reta em $t^2$.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>No gráfico $h \times t^2$, a inclinação foi 4,9 m/s². Quanto vale $g$?</p>`, fig: quedaF, num: { v: 9.8, tol: 0.01, un: "m/s²" }, dicas: [R`<p>A inclinação é $g/2$.</p>`], resp: "9,8 m/s²", sol: R`<p>$2\cdot4{,}9 = 9{,}8$ m/s².</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Num pêndulo, o gráfico $T^2 \times L$ deu inclinação 4,0 s²/m. Quanto vale $g$?</p>`, fig: dupla((L) => 2 * Math.PI * Math.sqrt(L / 9.87), 0.2, 1.2, (L) => L, "L", "T²", "L", "T", (T) => T * T), num: { v: 9.8696, tol: 0.005, un: "m/s²" }, dicas: [R`<p>Inclinação $= 4\pi^2/g$.</p>`], resp: "≈ 9,87 m/s²", sol: R`<p>$\frac{4\pi^2}{4{,}0} \approx 9{,}87$ m/s².</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Para um gás a temperatura constante ($PV = $ constante), que gráfico dá uma reta?</p>`, fig: dupla((V) => 4 / V, 1, 4, (V) => 1 / V, "1/V", "P", "V", "P"), alts: [R`$P \times V$`, R`$P \times 1/V$`, R`$P \times V^2$`, R`$P^2 \times V$`, R`$\sqrt P \times V$`], certa: "B", dicas: [R`<p>$P = \frac{\text{const}}{V}$.</p>`], resp: "B", sol: R`<p>$P = c\cdot\frac1V$: reta no gráfico $P \times \frac1V$.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Se $t = (0{,}45 \pm 0{,}01)$ s, qual a incerteza de $t^2$, em s²?</p>`, fig: fig(g2([[0.45, 0.2025]], { xmax: 0.7, ymax: 0.4, xlab: "t (s)", ylab: "t² (s²)", xt: [0.45], curvas: [{ pts: D.amostra((t) => t * t, 0, 0.62), cor: "var(--ink3)" }] }) + D.txt(300, 60, "Δ(t²) = 2t·Δt", "tx2")), num: { v: 0.009, tol: 0.02, un: "s²" }, dicas: [R`<p>$\Delta(t^2) = 2t\,\Delta t$ (derivada).</p>`], resp: "0,009 s²", sol: R`<p>$2\cdot0{,}45\cdot0{,}01 = 0{,}009$ s².</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Se $h = (0{,}81 \pm 0{,}01)$ m, qual a incerteza de $\sqrt h$, em √m?</p>`, fig: fig(g2([[0.81, 0.9]], { xmax: 1.3, ymax: 1.3, xlab: "h (m)", ylab: "√h", xt: [0.81], curvas: [{ pts: D.amostra((h) => Math.sqrt(h), 0, 1.2), cor: "var(--ink3)" }] })), num: { v: 0.005556, tol: 0.02 }, dicas: [R`<p>$\Delta\sqrt h = \frac{\Delta h}{2\sqrt h}$.</p>`], resp: "≈ 0,0056", sol: R`<p>$\frac{0{,}01}{2\cdot0{,}9} \approx 0{,}0056$ √m.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>A intensidade de uma lâmpada foi linearizada no gráfico $I \times 1/d^2$, com inclinação 0,32 W. Qual a intensidade a 0,40 m, em W/m²?</p>`, fig: dupla((d) => 0.32 / (d * d), 0.2, 0.8, (d) => 1 / (d * d), "1/d²", "I", "d", "I"), num: { v: 2.0, tol: 0.01, un: "W/m²" }, dicas: [R`<p>$I = \frac{0{,}32}{d^2}$.</p>`], resp: "2,0 W/m²", sol: R`<p>$\frac{0{,}32}{0{,}16} = 2{,}0$ W/m².</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>No gráfico $t \times \sqrt h$ de uma queda, o coeficiente linear foi 0,05 s. De quanto é o atraso constante na medida do tempo, em ms?</p>`, fig: chefFig, num: { v: 50, tol: 0.01, un: "ms" }, dicas: [R`<p>$t = t_0 + \sqrt{2/g}\,\sqrt h$.</p>`], resp: "50 ms", sol: R`<p>$t_0 = 0{,}05$ s $= 50$ ms.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Nesse gráfico $t \times \sqrt h$, a inclinação foi 0,4515 s/√m. Quanto vale $g$?</p>`, fig: chefFig, num: { v: 9.811, tol: 0.003, un: "m/s²" }, dicas: [R`<p>Inclinação $= \sqrt{2/g}$.</p>`], resp: "≈ 9,81 m/s²", sol: R`<p>$g = \frac{2}{0{,}4515^2} \approx 9{,}81$ m/s².</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Num sistema massa-mola, $T = 2\pi\sqrt{m/k}$. O gráfico $T^2 \times m$ deu inclinação 0,16 s²/kg. Quanto vale $k$, em N/m?</p>`, fig: dupla((m) => 2 * Math.PI * Math.sqrt(m / 246.7), 0.1, 0.6, (m) => m, "m", "T²", "m", "T", (T) => T * T), num: { v: 246.74, tol: 0.005, un: "N/m" }, dicas: [R`<p>$T^2 = \frac{4\pi^2}{k}m$.</p>`], resp: "≈ 247 N/m", sol: R`<p>$k = \frac{4\pi^2}{0{,}16} \approx 247$ N/m.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>No mesmo gráfico, o coeficiente linear foi 0,008 s². Levando em conta a massa da própria mola, $T^2 = \frac{4\pi^2}{k}(m + m_\text{ef})$. Quanto vale $m_\text{ef}$, em g?</p>`, fig: fig(g2([0.1, 0.2, 0.3, 0.4, 0.5].map((m) => [m, 0.16 * m + 0.008]), { xmax: 0.6, ymax: 0.1, xlab: "m (kg)", ylab: "T² (s²)", xt: [0.2, 0.4], curvas: [{ pts: [[0, 0.008], [0.6, 0.104]], cor: "var(--ok)", trac: true }] })), num: { v: 50, tol: 0.01, un: "g" }, dicas: [R`<p>$m_\text{ef} = \frac{b}{a}$.</p>`], resp: "50 g", sol: R`<p>$\frac{0{,}008}{0{,}16} = 0{,}05$ kg $= 50$ g (cerca de 1/3 da massa da mola, como a teoria prevê).</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>O alcance de um lançamento é $R = \frac{v^2}{g}\operatorname{sen}2\theta$. O gráfico $R \times \operatorname{sen}2\theta$ deu inclinação 2,5 m. Qual a velocidade de lançamento, em m/s ($g = 9{,}8$)?</p>`, fig: fig(g2([0.34, 0.5, 0.64, 0.87, 1].map((s) => [s, 2.5 * s]), { xmax: 1.15, ymax: 3, xlab: "sen 2θ", ylab: "R (m)", xt: [0.5, 1], yt: [1, 2], curvas: [{ pts: [[0, 0], [1.15, 2.875]], cor: "var(--ok)", trac: true }] })), num: { v: 4.9497, tol: 0.005, un: "m/s" }, dicas: [R`<p>$\frac{v^2}{g} = 2{,}5$.</p>`], resp: "≈ 4,95 m/s", sol: R`<p>$v = \sqrt{2{,}5\cdot9{,}8} \approx 4{,}95$ m/s.</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>A tensão num capacitor descarregando é $V = V_0e^{-t/\tau}$. No gráfico $\ln V \times t$, a inclinação foi $-0{,}5$ s⁻¹. Quanto vale $\tau$, em s?</p>`, fig: fig(g2([0, 1, 2, 3, 4].map((t) => [t, 2.3 - 0.5 * t]), { xmax: 5, ymax: 2.8, xlab: "t (s)", ylab: "ln V", xt: [1, 2, 3, 4], curvas: [{ pts: [[0, 2.3], [4.6, 0]], cor: "var(--ok)", trac: true }] })), num: { v: 2, tol: 0.01, un: "s" }, dicas: [R`<p>$\ln V = \ln V_0 - \frac{t}{\tau}$ ${F.ret("FE08")}.</p>`], resp: "2 s", sol: R`<p>$-\frac1\tau = -0{,}5 \Rightarrow \tau = 2$ s.</p>` }),
      F.exercicio({ n: 14, nivel: "Máximo", enun: R`<p>A velocidade terminal de esferinhas num óleo segue $v = kr^2$ (lei de Stokes). Que gráfico confirma a lei com uma reta pela origem?</p>`, fig: dupla((r) => 0.5 * r * r, 1, 4, (r) => r * r, "r²", "v", "r", "v"), alts: [R`$v \times r$`, R`$v \times r^2$`, R`$v \times \sqrt r$`, R`$v^2 \times r$`, R`$v \times 1/r$`], certa: "B", dicas: [R`<p>Chame $X = r^2$.</p>`], resp: "B", sol: R`<p>$v = kX$ com $X = r^2$. ($v^2 \times r^4$ também daria reta, mas complica à toa.)</p>` }),
      F.exercicio({ n: 15, nivel: "Máximo", enun: R`<p>Você suspeita que $y = Cx^n$, mas <b>não conhece</b> $n$. A melhor estratégia é:</p>`, fig: fig(g2([1, 2, 3, 4, 5].map((x) => [x, 0.4 * x ** 1.5]), { xmax: 6, ymax: 6, xt: [1, 2, 3, 4, 5], curvas: [{ pts: D.amostra((x) => 0.4 * x ** 1.5, 0, 5.5), cor: "var(--ink3)" }] }) + D.txt(420, 60, "n = ?", "txm")), alts: ["testar $x^2$, $x^3$, ... até acertar.", R`fazer o gráfico $\log y \times \log x$: a inclinação é $n$.`, R`fazer $y \times 1/x$.`, "desistir da reta.", R`fazer $y^2 \times x^2$.`], certa: "B", dicas: [R`<p>$\log y = \log C + n\log x$.</p>`], resp: "B", sol: R`<p>No gráfico log-log, a lei de potência vira reta de inclinação $n$ ${F.ret("FE08")}.</p>` }),
      F.exercicio({ n: 16, nivel: "Máximo", enun: R`<p>Na queda com atraso constante $t_0$ no cronômetro, o gráfico $h \times t^2$:</p>`, fig: chefFig, alts: ["continua uma reta perfeita, com a inclinação certa.", R`fica levemente curvo e dá $g$ errado; $t \times \sqrt h$ separa o atraso no coeficiente linear.`, "vira uma reta horizontal.", "dá o atraso na inclinação.", "não muda nada."], certa: "B", dicas: [R`<p>$h = \tfrac g2(t - t_0)^2$ não é proporcional a $t^2$.</p>`], resp: "B", sol: R`<p>$h = \tfrac g2(t - t_0)^2$ tem termos em $t$ e constante: deixa de ser proporcional a $t^2$. Em $t \times \sqrt h$, o atraso vira só o coeficiente linear.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Física experimental · linearização</div>
        <div class="q">Você soltou uma bolinha de cinco alturas e cronometrou. Como tirar $g$ com régua e papel?</div>
        <p>O gráfico $h \times t$ é uma parábola, e de uma curva é difícil tirar um número com incerteza. Mas $h \times t^2$ é uma reta, e de uma reta você sabe tirar inclinação, coeficiente linear e as incertezas dos dois ${F.ret("FE06")}.</p></div>
        ${F.chute({ q: "o período de um pêndulo é T = 2π√(L/g). Qual destes gráficos é uma reta?", ops: ["T × L", "T² × L", "T × L²", "T × 1/L"], certa: 1, exp: "T² = (4π²/g)·L: o gráfico T² × L é uma reta pela origem, com inclinação 4π²/g. (T × √L também seria.)" })}`),

      F.secao("ideia", "A ideia: trocar a variável", R`
        <h3>Teorema 1: toda lei de potência conhecida vira reta</h3>
        ${F.demo("demonstração", R`<p>(i) Se $y = Cx^n$ com $n$ conhecido, defina $X = x^n$. Então $y = CX$: reta pela origem com inclinação $C$.</p>
          <p>(ii) Também vale elevar os dois lados: $y^p = C^px^{np}$; o gráfico $y^p \times x^q$ é reta exatamente quando $q = pn$, com inclinação $C^p$ (é assim que $T^2 \times L$ e $T \times \sqrt L$ funcionam para o pêndulo).</p>
          <p>(iii) Outras leis também linearizam: $y = a + bx^2$ (reta em $x^2$ com coeficiente linear $a$), $y = Ae^{kx}$ ($\ln y = \ln A + kx$) ${F.ret("FE08")}. $\blacksquare$</p>`)}
        ${F.formula(R`y = Cx^n \;\Rightarrow\; y \times x^n \text{ é reta de inclinação } C;\qquad y^p \times x^{q}\ \text{é reta} \iff q = pn`, "Linearização de leis de potência")}
        <div id="lab-lineariza"></div>
        ${F.caixa("pegadinha", R`<p><b>"Parece reta" não basta.</b> Num intervalo curto, quase toda curva suave parece reta (no lab, $T \times L$ do pêndulo tem $R^2 = 0{,}986$!). O teste certo é olhar os resíduos: com a transformação errada, eles fazem um "U" ou um "∩" sistemático ${F.ret("FE06")}.</p>`)}`),

      F.secao("incerteza", "Incerteza da variável transformada", R`
        <h3>Teorema 2: $\Delta(x^n) = |n|\,x^{n-1}\,\Delta x$</h3>
        ${F.demo("demonstração", R`<p>(i) Para um $\Delta x$ pequeno, $f(x + \Delta x) \approx f(x) + f'(x)\,\Delta x$ ${F.ret("F04")}.</p>
          <p>(ii) Com $f = x^n$: $\Delta(x^n) = |n|x^{n-1}\Delta x$. Em forma relativa, $\frac{\Delta(x^n)}{x^n} = |n|\frac{\Delta x}{x}$: é a derivada logarítmica ${F.ret("FE04")}.</p>
          <p>(iii) Exemplos: $\Delta(t^2) = 2t\,\Delta t$; $\Delta\sqrt h = \frac{\Delta h}{2\sqrt h}$; $\Delta\!\left(\frac1d\right) = \frac{\Delta d}{d^2}$. Repare que as barras mudam de tamanho de ponto para ponto. $\blacksquare$</p>`)}
        ${F.formula(R`\Delta(x^n) = |n|\,x^{n-1}\,\Delta x,\qquad \frac{\Delta(x^n)}{x^n} = |n|\,\frac{\Delta x}{x}`, "Barras de erro depois da transformação")}`),

      F.secao("coef", "O coeficiente linear conta uma história", R`
        <h3>Teorema 3: um erro constante só mexe no coeficiente linear</h3>
        ${F.demo("demonstração", R`<p>(i) Suponha que a lei verdadeira seja $Y = aX$, mas toda medida de $Y$ venha deslocada por uma constante $c$ (atraso do cronômetro, zero da régua): $Y_\text{med} = aX + c$.</p>
          <p>(ii) Isso continua sendo uma reta com a <b>mesma inclinação</b> $a$; só o coeficiente linear vira $c$.</p>
          <p>(iii) Por isso se escolhe a linearização em que o erro constante aparece somado (como $t = t_0 + \sqrt{2/g}\sqrt h$): a inclinação dá a física e o coeficiente linear mede o erro. Se o erro constante ficar dentro de um quadrado ou de uma raiz, ele entorta o gráfico. $\blacksquare$</p>`)}
        ${F.caixa("fisico", R`<p><b>Coeficiente linear diferente de zero é informação, não defeito.</b> Ele mediu o raio esquecido do pêndulo, a massa efetiva da mola, o atraso do eletroímã. Antes de "forçar pela origem", pergunte o que ele significa.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Nas provas experimentais,</b> metade do trabalho é escolher o que pôr em cada eixo. Escreva a lei, isole algo da forma $Y = aX + b$ com $Y$ e $X$ calculáveis das medidas, e diga o que $a$ e $b$ significam <b>antes</b> de medir.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade,</b> faz-se ajuste não linear direto (mínimos quadrados na curva) com o computador. Mas linearizar continua sendo a melhor forma de <b>ver</b> se o modelo está certo, e a transformação muda o peso de cada ponto, o que precisa ser levado em conta no ajuste ${F.ret("FE09")}.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-lineariza"); e.outerHTML = F.lab("Endireite a curva", "lab-lineariza"); SIM.lineariza(document.getElementById("lab-lineariza"), F); },
});
