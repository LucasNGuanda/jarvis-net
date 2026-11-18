/* FE03 · Média, desvio padrão e incerteza da média. Conferido em Python:
   2,31; 2,35; 2,33; 2,29; 2,32: média 2,32, σ = 0,0224, σ/√5 = 0,0100; σ = 0,05 e N = 25: 0,01; √(0,004² + 0,01²) = 0,0108; σ = 0,08 para 0,01: N = 64;
   10 oscilações: 18,12; 18,20; 18,16; 18,14; 18,18 s: média 18,16 s, σ = 0,0316, σ_m = 0,0141, T = 1,816 s ± 0,0014 s; grupos 10 × 2,30 e 30 × 2,34: 2,33;
   cobertura de média ± σ/√N (simulação): N = 2: 50%; 5: 62%; 10: 66%; 100: 68%;
   chefão: σ = 0,10 s, u_B = 0,02 s: u(1) = 0,102; u(4) = 0,054; u(25) = 0,028; u(100) = 0,022; iguais em N = 25; u ≤ 0,025 s exige N ≥ 45. */
F.registrar("FE03", {
  retoma: ["FE02", "F04"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const pontos = (vals, rot, casas = 2) => { const mn = Math.min(...vals), mx = Math.max(...vals), X = (v) => 130 + ((v - mn) / (mx - mn || 1)) * 300, m = vals.reduce((s, x) => s + x, 0) / vals.length; return fig(`<line x1="110" x2="450" y1="90" y2="90" style="stroke:var(--ink3)"/><line x1="${X(m)}" x2="${X(m)}" y1="55" y2="100" style="stroke:var(--ok);stroke-dasharray:3 3"/>` + vals.map((v, i) => `<circle cx="${X(v)}" cy="${90 - (i % 3) * 9}" r="5" style="fill:var(--warn)"/>` + D.txt(X(v), 118 + (i % 2) * 14, F.nt(v, casas), "tx2")).join("") + D.txt(280, 40, rot, "tx2"), 160); };
    const sino = (rot, faixa = 1) => fig(D.graf({ x0: 110, y0: 140, w: 340, h: 110, xmax: 8, ymin: 0, ymax: 1.1, xlab: "", ylab: "", xt: [], yt: [], curvas: [{ pts: D.amostra((x) => Math.exp(-((x - 4) ** 2) / 2), 0, 8), cor: "var(--mN)" }, { pts: D.amostra((x) => Math.exp(-((x - 4) ** 2) / 2), 4 - faixa, 4 + faixa), cor: "var(--mN)", area: true }] }) + D.txt(280, 30, rot, "tx2") + D.txt(280 - (faixa * 340) / 8, 158, "−" + faixa + "σ", "tx2") + D.txt(280 + (faixa * 340) / 8, 158, "+" + faixa + "σ", "tx2"), 170);
    const exemplos = F.exemplo({
      titulo: "Estatística das medidas",
      casos: [
        { nome: "Fácil: média e desvio padrão", gerar: (p) => {
          const v = p ? [2.31, 2.35, 2.33, 2.29, 2.32] : F.escolha([[2.31, 2.35, 2.33, 2.29, 2.32], [4.8, 5.1, 4.9, 5.2, 5.0], [1.12, 1.18, 1.15, 1.11, 1.14]]), n = v.length, m = v.reduce((s, x) => s + x, 0) / n, desv = v.map((x) => x - m), s = Math.sqrt(desv.reduce((t, d) => t + d * d, 0) / (n - 1));
          return { enun: R`<p>Cinco medidas de um tempo deram ${v.map((x) => F.nt(x, 2)).join("; ")} s. Calcule a média, o desvio padrão e a incerteza da média.</p>`, fig: pontos(v, "cinco medidas (s)"),
            passos: [R`<p>(i) Média: $\bar x = \frac{${v.map((x) => F.n(x, 2)).join(" + ")}}{${n}} = ${F.n(m, 4)}$ s.</p>`, R`<p>(ii) Desvios: ${desv.map((d) => "$" + F.n(d, 3) + "$").join(", ")}. Desvio padrão: $\sigma = \sqrt{\frac{\sum(x_i - \bar x)^2}{N - 1}} = ${F.n(s, 4)}$ s.</p>`, R`<p>(iii) Incerteza da média: $\sigma_{\bar x} = \frac{\sigma}{\sqrt N} = \frac{${F.n(s, 4)}}{\sqrt{${n}}} = ${F.n(s / Math.sqrt(n), 3)}$ s. Resultado: $(${F.n(m, 3)} \pm ${F.n(s / Math.sqrt(n), 3)})$ s. O $\sigma$ diz quanto <b>uma</b> medida varia; o $\sigma/\sqrt N$, quão bem conhecemos a <b>média</b>.</p>`] };
        } },
        { nome: "Médio: o período a partir de 10 oscilações", gerar: (p) => {
          const v = p ? [18.12, 18.2, 18.16, 18.14, 18.18] : F.escolha([[18.12, 18.2, 18.16, 18.14, 18.18], [21.4, 21.6, 21.5, 21.3, 21.7], [12.05, 12.11, 12.08, 12.02, 12.09]]), n = v.length, m = v.reduce((s, x) => s + x, 0) / n, s = Math.sqrt(v.reduce((t, x) => t + (x - m) ** 2, 0) / (n - 1)), sm = s / Math.sqrt(n);
          return { enun: R`<p>O tempo de 10 oscilações de um pêndulo foi medido 5 vezes: ${v.map((x) => F.nt(x, 2)).join("; ")} s. Qual o período, com incerteza?</p>`, fig: pontos(v, "tempo de 10 oscilações (s)"),
            passos: [R`<p>(i) Média dos tempos: $${F.n(m, 4)}$ s; desvio padrão $${F.n(s, 4)}$ s; incerteza da média $\frac{${F.n(s, 4)}}{\sqrt5} = ${F.n(sm, 4)}$ s.</p>`, R`<p>(ii) Período: divida tudo por 10 (técnica das medidas múltiplas ${F.ret("FE01")}): $T = ${F.n(m / 10, 4)}$ s, $\Delta T = ${F.n(sm / 10, 4)}$ s.</p>`, R`<p>(iii) $T = (${F.n(m / 10, 4)} \pm ${F.n(sm / 10, 4)})$ s. Duas melhorias juntas: repetir (divide por $\sqrt5$) e contar 10 oscilações (divide por 10).</p>`] };
        } },
        { nome: "Olimpíada: quantas medidas fazer", gerar: (p) => {
          const s = p ? 0.08 : F.escolha([0.05, 0.08, 0.2]), alvo = p ? 0.01 : F.escolha([0.01, 0.02]), N = Math.ceil((s / alvo) ** 2 - 1e-9);
          return { enun: R`<p>Cada medida de um tempo varia com $\sigma = ${F.n(s)}$ s. Quantas medidas são necessárias para a incerteza da média chegar a ${F.nt(alvo)} s?</p>`, fig: fig(D.graf({ x0: 110, y0: 140, w: 360, h: 110, xmax: 100, ymin: 0, ymax: s * 1.05, xlab: "N", ylab: "σ/√N", xt: [25, 50, 75, 100], yt: [], curvas: [{ pts: D.amostra((n) => s / Math.sqrt(Math.max(n, 1)), 1, 100), cor: "var(--mN)" }, { pts: [[0, alvo], [100, alvo]], cor: "var(--warn)", trac: true }] }), 165),
            passos: [R`<p>(i) Queremos $\frac{\sigma}{\sqrt N} \le ${F.n(alvo)} \Rightarrow \sqrt N \ge \frac{${F.n(s)}}{${F.n(alvo)}} = ${F.n(s / alvo, 3)}$.</p>`, R`<p>(ii) $N \ge ${F.n((s / alvo) ** 2, 3)}$: <b>${N} medidas</b>.</p>`, R`<p>(iii) Lei da raiz: para dividir a incerteza por 2, é preciso o <b>quádruplo</b> de medidas; por 10, cem vezes mais. Rapidamente deixa de compensar (chefão).</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Até quando vale a pena repetir",
      enun: R`<p>Você mede um tempo com cronômetro manual: cada medida varia com $\sigma = 0{,}10$ s (reflexo), e a calibração do cronômetro tem uma incerteza tipo B de $u_B = 0{,}02$ s, que não diminui repetindo. A incerteza total da média de $N$ medidas é $u(N) = \sqrt{\frac{\sigma^2}N + u_B^2}$. (a) Calcule $u$ para $N = 1, 4, 25, 100$. (b) Para que valor $u$ tende quando $N \to \infty$? (c) Para que $N$ as duas partes ficam iguais? (d) Para chegar a $u \le 0{,}025$ s, quantas medidas são precisas? Se cada uma leva 30 s, quanto tempo? (e) O que fazer se você precisasse de $u = 0{,}01$ s?</p>`,
      fig: fig(D.graf({ x0: 110, y0: 140, w: 360, h: 110, xmax: 100, ymin: 0, ymax: 0.11, xlab: "N", ylab: "u(N)", xt: [25, 50, 75, 100], yt: [0.02], curvas: [{ pts: D.amostra((n) => Math.sqrt(0.01 / Math.max(n, 1) + 0.0004), 1, 100), cor: "var(--mN)" }, { pts: [[0, 0.02], [100, 0.02]], cor: "var(--warn)", trac: true }] }) + D.txt(440, 116, "piso: u_B", "tx2"), 170),
      dicas: [R`<p>(a) Conta direta.</p>`, R`<p>(c) $\frac{\sigma^2}{N} = u_B^2$.</p>`, R`<p>(d) $\frac{\sigma^2}{N} \le 0{,}025^2 - 0{,}02^2$.</p>`],
      sol: R`<p><b>(a)</b> $u(1) \approx 0{,}102$; $u(4) \approx 0{,}054$; $u(25) \approx 0{,}028$; $u(100) \approx 0{,}022$ s.</p>
        <p><b>(b)</b> $u \to u_B = 0{,}02$ s: repetir só ataca a parte aleatória.</p>
        <p><b>(c)</b> $N = \left(\frac{\sigma}{u_B}\right)^2 = 25$. A partir daí, a parte estatística já é menor que a do instrumento.</p>
        <p><b>(d)</b> $\frac{0{,}01}{N} \le 0{,}000225 \Rightarrow N \ge 44{,}4$: <b>45 medidas</b>, uns 22 minutos. (Conferi em Python.)</p>
        <p><b>(e)</b> Impossível com esse cronômetro: $u$ nunca fica abaixo de 0,02 s. É preciso reduzir $u_B$ (calibrar contra um relógio melhor) e trocar o método (fotoporta). Moral: estatística não conserta instrumento ruim ${F.ret("FE10")}.</p>`,
    });
    const v5 = [2.31, 2.35, 2.33, 2.29, 2.32];
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Calcule a média de 2,31; 2,35; 2,33; 2,29; 2,32 (em s).</p>`, fig: pontos(v5, "cinco medidas (s)"), num: { v: 2.32, tol: 0.001, un: "s" }, dicas: [R`<p>Some e divida por 5.</p>`], resp: "2,32 s", sol: R`<p>$\frac{11{,}60}{5} = 2{,}32$ s.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Qual o desvio padrão dessas cinco medidas (com $N - 1$), em s?</p>`, fig: pontos(v5, "desvios em torno de 2,32"), num: { v: 0.02236, tol: 0.02, un: "s" }, dicas: [R`<p>Desvios: −0,01; 0,03; 0,01; −0,03; 0. Soma dos quadrados: 0,0020.</p>`], resp: "≈ 0,022 s", sol: R`<p>$\sqrt{\frac{0{,}0020}{4}} = \sqrt{0{,}0005} \approx 0{,}022$ s.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Qual a incerteza da média dessas medidas, em s?</p>`, fig: pontos(v5, "média: 2,32 s"), num: { v: 0.01, tol: 0.02, un: "s" }, dicas: [R`<p>$\frac{\sigma}{\sqrt N}$.</p>`], resp: "0,010 s", sol: R`<p>$\frac{0{,}0224}{\sqrt5} = 0{,}010$ s: $(2{,}32 \pm 0{,}01)$ s.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Por quantas vezes é preciso multiplicar o número de medidas para a incerteza da média cair pela metade?</p>`, fig: fig(D.graf({ x0: 110, y0: 140, w: 360, h: 110, xmax: 40, ymin: 0, ymax: 1.05, xlab: "N", ylab: "1/√N", xt: [4, 16, 36], yt: [0.5], curvas: [{ pts: D.amostra((n) => 1 / Math.sqrt(Math.max(n, 1)), 1, 40), cor: "var(--mN)" }] }), 165), num: { v: 4 }, dicas: [R`<p>$\frac{1}{\sqrt{kN}} = \frac12\cdot\frac1{\sqrt N}$.</p>`], resp: "4", sol: R`<p>$\sqrt k = 2 \Rightarrow k = 4$.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Com $\sigma = 0{,}05$ s e 25 medidas, qual a incerteza da média, em s?</p>`, fig: sino("25 medidas, σ = 0,05 s"), num: { v: 0.01, un: "s" }, dicas: [R`<p>$\frac{0{,}05}{5}$.</p>`], resp: "0,01 s", sol: R`<p>$0{,}01$ s.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Numa distribuição normal, que porcentagem das medidas cai a menos de 1σ da média?</p>`, fig: sino("±1σ", 1), num: { v: 68, tol: 0.02, un: "%" }, dicas: [R`<p>Número clássico.</p>`], resp: "≈ 68%", sol: R`<p>≈ 68,3%. Uma em cada três medidas cai fora de ±1σ: normal.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>E a menos de 2σ?</p>`, fig: sino("±2σ", 2), num: { v: 95, tol: 0.01, un: "%" }, dicas: [R`<p>Outro número clássico.</p>`], resp: "≈ 95%", sol: R`<p>≈ 95,4% (e ±3σ: 99,7%).</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Com mais medidas, o que acontece com o desvio padrão $\sigma$ e com a incerteza da média $\sigma/\sqrt N$?</p>`, fig: sino("mais medidas"), alts: ["Os dois diminuem.", "σ fica parecido (é uma propriedade do processo de medir); σ/√N diminui.", "σ diminui e σ/√N fica igual.", "Os dois aumentam.", "Nada muda."], certa: "B", dicas: [R`<p>σ estima o espalhamento de cada medida.</p>`], resp: "B", sol: R`<p>O espalhamento de cada medida não melhora repetindo; o que melhora é o conhecimento da média.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Por que o desvio padrão amostral divide por $N - 1$ e não por $N$?</p>`, fig: pontos([4.8, 5.1, 4.9, 5.2, 5.0], "desvios medidos em torno da média calculada", 1), alts: ["Por convenção, sem motivo.", "Porque os desvios em torno da média calculada são, em média, menores que em torno do valor verdadeiro; N − 1 corrige isso.", "Porque a primeira medida não vale.", "Para o resultado ficar menor.", "Porque é mais fácil de calcular."], certa: "B", dicas: [R`<p>A média calculada é o ponto que minimiza a soma dos quadrados (Teorema 1).</p>`], resp: "B", sol: R`<p>Usando $\bar x$ (que "gruda" nos dados), a soma dos quadrados fica menor; em média, vale $(N - 1)\sigma^2$, e dividir por $N - 1$ dá a estimativa sem viés (Teorema 2).</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Uma média tem $\sigma_{\bar x} = 0{,}004$ s, e o cronômetro tem $u_B = 0{,}01$ s. Qual a incerteza total em quadratura, em s?</p>`, fig: fig(`<path d="M200 140 L360 140 L360 70 Z" style="fill:color-mix(in srgb,var(--mN) 12%,transparent);stroke:var(--ink2)"/>` + D.txt(280, 158, "0,01", "tx2") + D.txt(368, 110, "0,004", "tx2", "start"), 170), num: { v: 0.01077, tol: 0.02, un: "s" }, dicas: [R`<p>$\sqrt{0{,}004^2 + 0{,}01^2}$.</p>`], resp: "≈ 0,011 s", sol: R`<p>$\approx 0{,}0108$ s: aqui quem domina é o instrumento.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Com $\sigma = 0{,}08$ s, quantas medidas para a incerteza da média chegar a 0,01 s?</p>`, fig: sino("σ = 0,08 s"), num: { v: 64 }, dicas: [R`<p>$N = (\sigma/u)^2$.</p>`], resp: "64", sol: R`<p>$(8)^2 = 64$.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Cinco medidas do tempo de 10 oscilações: 18,12; 18,20; 18,16; 18,14; 18,18 s. Qual o período, em s?</p>`, fig: pontos([18.12, 18.2, 18.16, 18.14, 18.18], "10 oscilações (s)"), num: { v: 1.816, tol: 0.001, un: "s" }, dicas: [R`<p>Média e depois divida por 10.</p>`], resp: "1,816 s (± 0,0014 s)", sol: R`<p>Média 18,16 s; $T = 1{,}816$ s; $\sigma = 0{,}0316$, $\sigma_m = 0{,}0141$ s, $\Delta T = 0{,}0014$ s.</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>Um grupo fez 10 medidas com média 2,30 s e outro, 30 medidas com média 2,34 s (mesmo método). Qual a média de todas as 40?</p>`, fig: fig(D.bloco(150, 50, 100, 60, "var(--mA)", "10: 2,30") + D.bloco(310, 50, 150, 60, "var(--warn)", "30: 2,34"), 150), num: { v: 2.33, tol: 0.001, un: "s" }, dicas: [R`<p>Média ponderada pelo número de medidas.</p>`], resp: "2,33 s", sol: R`<p>$\frac{10\cdot2{,}30 + 30\cdot2{,}34}{40} = 2{,}33$ s. Não é 2,32 (a média das médias): o grupo maior pesa mais.</p>` }),
      F.exercicio({ n: 14, nivel: "Máximo", enun: R`<p>Numa série de medidas com média 5,00 e $\sigma = 0{,}10$, aparece um 5,45. O que fazer?</p>`, fig: pontos([4.9, 5.05, 5.0, 4.95, 5.1, 5.45], "uma medida estranha", 2), alts: ["Apagar sem dizer nada.", "Verificar se houve um erro grosseiro (anotação, leitura); se houve, descartar e registrar; se não, mantê-la.", "Repetir a média sem mudar nada.", "Trocar por 5,00.", "Descartar todas as medidas."], certa: "B", dicas: [R`<p>5,45 está a 4,5σ da média. Isso é raríssimo por acaso (~1 em 100 000).</p>`], resp: "B", sol: R`<p>A 4,5σ, é quase certamente um erro grosseiro; mas descartar dados sem motivo é desonesto. Procure a causa e registre a decisão no relatório.</p>` }),
      F.exercicio({ n: 15, nivel: "Máximo", enun: R`<p>O histograma de muitas medidas repetidas, com erros aleatórios, tem a forma de:</p>`, fig: sino("muitas medidas"), alts: ["uma reta.", "um sino (distribuição normal).", "uma parábola para cima.", "um degrau.", "uma exponencial."], certa: "B", dicas: [R`<p>Veja o laboratório com N grande.</p>`], resp: "B", sol: R`<p>Um sino (gaussiana): muitas pequenas causas aleatórias somadas dão uma distribuição normal (teorema central do limite).</p>` }),
      F.exercicio({ n: 16, nivel: "Máximo", enun: R`<p>A média deu 2,3220 e a incerteza da média 0,0089. Como escrever?</p>`, fig: pontos(v5, "resultado"), alts: [R`$(2{,}3220 \pm 0{,}0089)$`, R`$(2{,}322 \pm 0{,}009)$`, R`$(2{,}32 \pm 0{,}0089)$`, R`$(2{,}3 \pm 0{,}009)$`, R`$2{,}3220$`], certa: "B", dicas: [R`<p>Incerteza com 1 significativo; valor na mesma casa.</p>`], resp: "B", sol: R`<p>$(2{,}322 \pm 0{,}009)$ ${F.ret("FE11")}.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Física experimental · estatística</div>
        <div class="q">Você mediu o mesmo tempo cinco vezes e deu cinco números diferentes. Qual é o "certo"? E quão perto ele está da verdade?</div>
        <p>Nenhum é "o certo": o melhor palpite é a média, e a estatística diz quão confiável ela é. Com mais medidas, a média melhora, mas devagar: a incerteza cai com a raiz do número de medidas.</p></div>
        ${F.chute({ q: "a incerteza da média de 10 medidas é 0,04 s. Com 40 medidas (mesmo método), ela fica:", ops: ["0,01 s", "0,02 s", "0,04 s", "0,16 s"], certa: 1, exp: "0,02 s: a incerteza da média é σ/√N, e quadruplicar N divide por √4 = 2 (Teorema 3). Para chegar a 0,01 s, seriam 160 medidas." })}`),

      F.secao("media", "A média", R`
        <h3>Teorema 1: a média é o valor que minimiza a soma dos quadrados dos desvios</h3>
        ${F.demo("demonstração", R`<p>(i) Procure o número $a$ que fica "mais perto" de todas as medidas no sentido de $S(a) = \sum(x_i - a)^2$ mínimo.</p>
          <p>(ii) Derivando ${F.ret("F04")}: $S'(a) = -2\sum(x_i - a) = 0 \Rightarrow \sum x_i = Na \Rightarrow a = \frac{\sum x_i}N = \bar x$. E $S'' = 2N > 0$: é mínimo.</p>
          <p>(iii) Consequência útil: $\sum(x_i - \bar x) = 0$, os desvios em torno da média somam zero. $\blacksquare$</p>`)}
        ${F.formula(R`\bar x = \frac1N\sum x_i,\qquad \sigma = \sqrt{\frac{\sum(x_i - \bar x)^2}{N - 1}},\qquad \sigma_{\bar x} = \frac{\sigma}{\sqrt N}`, "Média, desvio padrão e incerteza da média")}
        <div id="lab-repetidas"></div>`),

      F.secao("desvio", "Desvio padrão: o espalhamento", R`
        <h3>Teorema 2: por que $N - 1$</h3>
        ${F.demo("demonstração", R`<p>(i) Seja $\mu$ o valor verdadeiro e $\sigma^2$ a variância de cada medida. Escreva $x_i - \mu = (x_i - \bar x) + (\bar x - \mu)$ e some os quadrados: $\sum(x_i - \mu)^2 = \sum(x_i - \bar x)^2 + N(\bar x - \mu)^2$ (o termo cruzado some, pelo Teorema 1).</p>
          <p>(ii) Em média: o lado esquerdo vale $N\sigma^2$ e $(\bar x - \mu)^2$ vale $\frac{\sigma^2}N$ (Teorema 3). Então $\sum(x_i - \bar x)^2$ vale, em média, $N\sigma^2 - \sigma^2 = (N - 1)\sigma^2$.</p>
          <p>(iii) Dividindo por $N - 1$, a estimativa de $\sigma^2$ fica certa em média. Com $N$, ela subestimaria. $\blacksquare$</p>`)}
        ${F.caixa("pegadinha", R`<p><b>σ não é a incerteza do resultado.</b> σ diz quanto uma medida isolada varia; a incerteza da média é $\sigma/\sqrt N$. Confundir os dois deixa o resultado com uma incerteza $\sqrt N$ vezes maior do que devia. E calculadoras têm duas teclas, $\sigma_n$ e $\sigma_{n-1}$: use a de $N - 1$.</p>`)}`),

      F.secao("damedia", "A incerteza da média", R`
        <h3>Teorema 3: a incerteza da média é $\sigma/\sqrt N$</h3>
        ${F.demo("demonstração", R`<p>(i) Para grandezas independentes, a variância da soma é a soma das variâncias: os desvios aleatórios se cancelam em parte. Então $\text{Var}\left(\sum x_i\right) = N\sigma^2$.</p>
          <p>(ii) A média é a soma dividida por $N$, e a variância escala com o quadrado: $\text{Var}(\bar x) = \frac{N\sigma^2}{N^2} = \frac{\sigma^2}N$.</p>
          <p>(iii) Tirando a raiz: $\sigma_{\bar x} = \frac{\sigma}{\sqrt N}$. $\blacksquare$</p>`)}
        ${F.formula(R`u_\text{total} = \sqrt{\frac{\sigma^2}{N} + u_B^2}`, "Incerteza total da média (parte estatística + instrumento)")}
        ${F.caixa("fisico", R`<p><b>A raiz de N é implacável.</b> Para melhorar 10 vezes uma medida só repetindo, é preciso repeti-la 100 vezes. Por isso experimentos de precisão preferem trocar o método a repetir sem fim, e por isso detectores de partículas acumulam bilhões de eventos.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Combine sempre as duas partes</b>: a estatística ($\sigma/\sqrt N$, que diminui repetindo) e a do instrumento (tipo B, que não diminui). A total, $\sqrt{\sigma^2/N + u_B^2}$, tem um piso: depois de um certo $N$, repetir não compensa (chefão).</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, com poucas medidas usa-se a distribuição $t$ de Student (o intervalo $\bar x \pm \sigma/\sqrt N$ cobre menos que 68% quando $N$ é pequeno; veja o contador do laboratório com N = 2), e médias de medidas com incertezas diferentes se combinam com a média ponderada por $1/u^2$ ${F.ret("FE05")}.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-repetidas"); e.outerHTML = F.lab("Medidas repetidas", "lab-repetidas"); SIM.repetidas(document.getElementById("lab-repetidas"), F); },
});
