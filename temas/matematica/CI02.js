/* CI02 · Continuidade e limites fundamentais. Conferido com sympy/scipy (scratchpad ci.py):
   cos x = x → 0,739085; x³ − x − 1 = 0 → 1,324718; W(1) = 0,567143; (1 + 1/n)^n na tabela; lim (1 + 2/x)^(3x) = e⁶. */
F.registrar("matematica/CI02", {
  retoma: ["CI01"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Usando os limites fundamentais",
      casos: [
        { nome: "sen(ax)/(bx)", gerar: (p) => {
          const a = p ? 3 : F.escolha([2, 3, 4, 5, 7]), b = p ? 5 : F.escolha([1, 2, 3, 5]);
          return { enun: R`<p>Calcule $\displaystyle\lim_{x\to0}\frac{\operatorname{sen}(${F.c(a)}x)}{${b === 1 ? "" : b}x}$.</p>`, fig: "",
            passos: [
              R`<p>O limite fundamental pede o <b>mesmo</b> argumento em cima e embaixo: $\frac{\operatorname{sen}u}{u} \to 1$ com $u = ${F.c(a)}x$. Falta um ${a} embaixo.</p>`,
              R`<p>Multiplique e divida por ${a}:</p>$$\frac{\operatorname{sen}(${F.c(a)}x)}{${b === 1 ? "" : b}x} = \frac{${a}}{${b}}\cdot\frac{\operatorname{sen}(${F.c(a)}x)}{${F.c(a)}x}$$`,
              R`<p>Quando $x \to 0$, também $u = ${F.c(a)}x \to 0$, e a fração da direita vai a 1. Resposta: $\frac{${a}}{${b}}${a % b === 0 ? ` = ${a / b}` : ` \\approx ${F.n(a / b, 4)}`}$.</p>`,
            ] };
        } },
        { nome: "(1 + a/x)^(bx)", gerar: (p) => {
          const a = p ? 2 : F.escolha([1, 2, 3, -1, -2]), b = p ? 3 : F.escolha([1, 2, 3]);
          return { enun: R`<p>Calcule $\displaystyle\lim_{x\to\infty}\left(1 ${a > 0 ? "+" : "-"} \frac{${Math.abs(a)}}{x}\right)^{${b === 1 ? "" : b}x}$.</p>`, fig: "",
            passos: [
              R`<p>Forma $1^\infty$: a base vai a 1 e o expoente ao infinito. Isso <b>não</b> é 1 (é a briga entre os dois). Troque $n = \frac{x}{${a}}$, isto é, $x = ${a}n$:</p>`,
              R`$$\left(1 + \frac1n\right)^{${F.c(b * a)}n} = \left[\left(1 + \frac1n\right)^n\right]${b * a === 1 ? "" : "^{" + (b * a) + "}"}$$${a < 0 ? R`<p>(com $a < 0$, $n \to -\infty$; o limite fundamental vale também nesse caso.)</p>` : ""}`,
              R`<p>O colchete vai a $e$. Resposta: $${a * b === 1 ? "e" : `e^{${a * b}}`} \approx ${F.n(Math.exp(a * b), 4)}$. Regra geral: $\left(1 + \frac ax\right)^{bx} \to e^{ab}$.</p>`,
            ] };
        } },
        { nome: "(1 − cos ax)/x²", gerar: (p) => {
          const a = p ? 2 : F.escolha([1, 2, 3, 4]);
          return { enun: R`<p>Calcule $\displaystyle\lim_{x\to0}\frac{1 - \cos(${a === 1 ? "" : a}x)}{x^2}$.</p>`, fig: "",
            passos: [
              R`<p>Multiplique em cima e embaixo por $1 + \cos(${F.c(a)}x)$ (o "conjugado trigonométrico"): em cima aparece $1 - \cos^2 = \operatorname{sen}^2$.</p>$$\frac{\operatorname{sen}^2(${F.c(a)}x)}{x^2\,(1 + \cos ${F.c(a)}x)}$$`,
              R`<p>Separe: $\left(\frac{\operatorname{sen}(${F.c(a)}x)}{x}\right)^2\cdot\frac{1}{1 + \cos(${F.c(a)}x)}$. O primeiro vai a $${a}^2 = ${a * a}$ (exemplo anterior); o segundo, a $\frac12$.</p>`,
              R`<p>Resposta: $\frac{${a * a}}{2}${a * a % 2 === 0 ? ` = ${a * a / 2}` : ` = ${F.n(a * a / 2, 1)}`}$. É daí que sai a aproximação $\cos\theta \approx 1 - \frac{\theta^2}{2}$ (energia potencial do pêndulo perto do fundo).</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O monge e o anel quente",
      enun: R`<p>(a) Um monge sobe uma montanha saindo às 8h e chegando ao topo às 17h. No dia seguinte, desce pelo mesmo caminho, de novo das 8h às 17h, com outras velocidades (pode até parar). Prove que existe um horário em que ele está <b>no mesmo ponto</b> do caminho nos dois dias.</p>
        <p>(b) Prove que, em qualquer instante, existem dois pontos <b>diametralmente opostos</b> no equador com exatamente a mesma temperatura (suponha a temperatura contínua).</p>`,
      fig: "",
      dicas: [R`<p>(a) Imagine dois monges no mesmo dia, um subindo e um descendo. Defina $d(t) = $ posição do que sobe $-$ posição do que desce.</p>`, R`<p>(b) $g(\theta) = T(\theta) - T(\theta + \pi)$. Compare $g(0)$ com $g(\pi)$.</p>`],
      sol: R`<p><b>(a)</b> Seja $s(t)$ a distância percorrida (ao longo do caminho, a partir da base) no dia da subida e $r(t)$ no dia da descida. $s(8) = 0$, $s(17) = L$; $r(8) = L$, $r(17) = 0$. A função $d(t) = s(t) - r(t)$ é contínua (ninguém se teletransporta), com $d(8) = -L < 0$ e $d(17) = L > 0$. Pelo TVI, existe $t^*$ com $d(t^*) = 0$, ou seja, $s(t^*) = r(t^*)$ ∎. Repare que a prova não diz <i>quando</i>, só que existe.</p>
        <p><b>(b)</b> $g(\theta) = T(\theta) - T(\theta + \pi)$ é contínua e $g(\pi) = T(\pi) - T(2\pi) = T(\pi) - T(0) = -g(0)$. Se $g(0) = 0$, acabou. Se não, $g(0)$ e $g(\pi)$ têm sinais opostos, e o TVI dá um $\theta^*$ entre eles com $g(\theta^*) = 0$ ∎.</p>
        <p class="det" style="color:var(--ink2)">A versão 2D disso é o teorema de Borsuk–Ulam: na Terra inteira, existem dois pontos antípodas com a mesma temperatura <i>e</i> a mesma pressão.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 1 · 2</div>
        <div class="q">Você tinha 1,50 m aos 10 anos e 1,75 m aos 15. Teve um dia em que você tinha exatamente 1,62 m?</div>
        <p>Claro que sim: altura não pula. Esse "claro" é um teorema (do valor intermediário) e só vale para funções <b>contínuas</b>. Este tema define continuidade e prova os dois limites que sustentam toda a trigonometria e toda a exponencial do Cálculo.</p></div>`),

      F.secao("continuidade", "Continuidade", R`
        ${F.formula(R`f \text{ é contínua em } a \iff \lim_{x\to a}f(x) = f(a)`, "Definição")}
        <p>Isso esconde três exigências: (i) $f(a)$ existe; (ii) o limite existe; (iii) os dois são iguais. Intuição: dá para desenhar o gráfico perto de $a$ sem tirar o lápis do papel. Polinômios, $\sin$, $\cos$, $e^x$ e $\ln x$ (onde estão definidas) são contínuas; somas, produtos, quocientes (fora dos zeros de baixo) e composições de contínuas também.</p>
        <table class="tb"><tr><th>tipo de descontinuidade</th><th>exemplo</th><th>na física</th></tr>
          <tr><td><b>removível</b> (furo)</td><td>$\frac{x^2-4}{x-2}$ em 2</td><td>defeito de definição, não do fenômeno</td></tr>
          <tr><td><b>salto</b></td><td>$\frac{x}{|x|}$ em 0</td><td>tensão ao fechar uma chave; atrito ao inverter o movimento</td></tr>
          <tr><td><b>infinita</b></td><td>$\frac1x$ em 0</td><td>campo de uma carga pontual em $r = 0$</td></tr>
          <tr><td><b>oscilante</b></td><td>$\operatorname{sen}\frac1x$ em 0</td><td>(raro: quase um monstro matemático)</td></tr></table>
        ${F.caixa("fisico", R`<p>Grandezas que guardam energia são contínuas no tempo: a posição de uma massa, a carga de um capacitor, a corrente num indutor ${F.ret("fisica/C15b")}. Já a força, a corrente num capacitor e a tensão num indutor podem saltar. Em prova de circuitos, "imediatamente após fechar a chave" usa exatamente isso.</p>`)}`),

      F.secao("tvi", "Teorema do valor intermediário", R`
        ${F.formula(R`f \text{ contínua em } [a, b],\ \ f(a) < k < f(b)\ \Longrightarrow\ \exists\,c \in (a, b):\ f(c) = k`, "TVI (Bolzano)")}
        <p>O caso mais usado: se $f(a)$ e $f(b)$ têm <b>sinais opostos</b>, existe uma raiz no meio. Isso vira um algoritmo: corte o intervalo ao meio, veja de que lado o sinal troca, repita. É a <b>bissecção</b>, lenta mas que nunca falha.</p>
        <div id="lab-bis"></div>
        <p>O teorema parece óbvio, mas depende de os números reais não terem "buracos". Nos racionais, $x^2 - 2$ é negativa em 1 e positiva em 2 e nunca zera ($\sqrt2$ não é racional). A prova rigorosa usa a <b>completude</b> dos reais (todo conjunto limitado tem supremo).</p>
        <p><b>Primo dele, Weierstrass:</b> uma função contínua num intervalo fechado $[a, b]$ atinge um valor máximo e um mínimo. É por isso que, em otimização ${F.ret("CI05")}, sempre dá para olhar as pontas do intervalo e os pontos críticos e achar o melhor.</p>`),

      F.secao("senx", "Limite fundamental 1: sen x / x → 1", R`
        ${F.formula(R`\lim_{x\to0}\frac{\operatorname{sen}x}{x} = 1\qquad(x \text{ em radianos})`)}
        <div id="lab-sen"></div>
        ${F.demo("pelas áreas e pelo teorema do confronto", R`<p>(i) No círculo de raio 1, com $0 < x < \frac\pi2$: triângulo pequeno $\subset$ setor $\subset$ triângulo grande (veja o laboratório). As áreas: $\frac{\operatorname{sen}x}{2} \leq \frac x2 \leq \frac{\operatorname{tg}x}{2}$. (A área do setor é $\frac x2$ porque o ângulo está em radianos: é aqui que o radiano é obrigatório.)</p>
          <p>(ii) Divida tudo por $\frac{\operatorname{sen}x}{2} > 0$: $1 \leq \frac{x}{\operatorname{sen}x} \leq \frac{1}{\cos x}$. Invertendo (inverte as desigualdades): $\cos x \leq \frac{\operatorname{sen}x}{x} \leq 1$.</p>
          <p>(iii) <b>Confronto</b> (sanduíche): $\cos x \to 1$ e $1 \to 1$; o que está espremido no meio também vai a 1. Para $x < 0$ é igual, porque $\frac{\operatorname{sen}x}{x}$ é par ∎.</p>`)}
        <p>Consequências: $\frac{\operatorname{tg}x}{x} \to 1$, $\frac{1 - \cos x}{x^2} \to \frac12$, e, mais importante, as aproximações de ângulo pequeno $\operatorname{sen}\theta \approx \theta$ e $\cos\theta \approx 1 - \frac{\theta^2}{2}$, que transformam o pêndulo em MHS ${F.ret("fisica/EP01")} e aparecem em toda a óptica. Este limite também é a derivada do seno em 0 ${F.ret("CI03")}.</p>`),

      F.secao("euler", "Limite fundamental 2: o número e", R`
        ${F.formula(R`\lim_{n\to\infty}\left(1 + \frac1n\right)^n = e \approx 2{,}718281828`)}
        <p>A história dos juros (Jacob Bernoulli, 1683): R$ 1 a 100% ao ano. Pagando uma vez por ano, vira 2. Pagando 50% duas vezes, $1{,}5^2 = 2{,}25$. Dividindo em $n$ vezes, $(1 + \frac1n)^n$:</p>
        <table class="tb"><tr><th>n</th><td>1</td><td>2</td><td>12 (mensal)</td><td>365 (diário)</td><td>8760 (por hora)</td><td>10⁶</td></tr><tr><th>valor</th><td>2</td><td>2,25</td><td>2,6130</td><td>2,7146</td><td>2,71813</td><td>2,718280</td></tr></table>
        <p>Cresce, mas trava: o limite é $e$. Do mesmo jeito, $\left(1 + \frac xn\right)^n \to e^x$, e daí saem mais dois limites que usaremos para derivar $e^x$ e $\ln x$:</p>
        ${F.formula(R`\lim_{h\to0}\frac{e^h - 1}{h} = 1,\qquad \lim_{h\to0}\frac{\ln(1 + h)}{h} = 1`)}
        ${F.caixa("fisico", R`<p><b>Decaimento radioativo como limite.</b> Se, a cada intervalinho $\frac tn$, cada núcleo tem chance $\lambda\frac tn$ de decair, depois de $n$ intervalos sobra $N_0\left(1 - \frac{\lambda t}{n}\right)^n \to N_0e^{-\lambda t}$. A exponencial é o que acontece quando um processo de "porcentagem fixa" fica contínuo: capacitor descarregando, luz atravessando um vidro, temperatura esfriando.</p>`)}`),

      F.secao("exemplos", "Exemplos", exemplario),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Para que valor de $k$ a função $f(x) = \begin{cases}\frac{x^2 - 9}{x - 3}, & x \neq 3\\ k, & x = 3\end{cases}$ é contínua?</p>`, fig: "", dicas: [R`<p>Contínua em 3 $\iff$ $f(3) = \lim_{x\to3}f(x)$.</p>`, R`<p>Fatore $x^2 - 9$.</p>`], resp: R`$k = 6$.`, sol: R`<p>$\lim_{x\to3}(x + 3) = 6$. Escolher $k = 6$ "tapa o furo" (descontinuidade removível).</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Mostre que $x^5 - 3x + 1 = 0$ tem uma raiz entre 0 e 1. Quantos cortes de bissecção são necessários para garantir 6 casas decimais?</p>`, fig: "", dicas: [R`<p>Calcule $f(0)$ e $f(1)$.</p>`, R`<p>Depois de $n$ cortes, a largura é $2^{-n}$. Quer $< 10^{-6}$.</p>`], resp: R`$f(0) = 1 > 0$, $f(1) = -1 < 0$; $n = 20$ cortes.`, sol: R`<p>TVI dá a raiz. $2^{-20} \approx 9{,}5\times10^{-7} < 10^{-6}$ e $2^{-19} \approx 1{,}9\times10^{-6}$ não basta. (A raiz é $\approx 0{,}3347$.)</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Calcule $\displaystyle\lim_{x\to0}\frac{\operatorname{tg}(2x)}{\operatorname{sen}(5x)}$.</p>`, fig: "", dicas: [R`<p>$\operatorname{tg}u = \frac{\operatorname{sen}u}{\cos u}$, e ajuste os argumentos como no exemplário.</p>`, R`<p>$\frac{\operatorname{sen}2x}{2x}\cdot\frac{5x}{\operatorname{sen}5x}\cdot\frac{2x}{5x}\cdot\frac1{\cos2x}$.</p>`], resp: R`$\frac25$.`, sol: R`<p>Cada fração "fundamental" vai a 1 e $\cos2x \to 1$. Sobra $\frac{2}{5}$. Atalho mental: para $x$ pequeno, $\operatorname{tg}2x \approx 2x$ e $\operatorname{sen}5x \approx 5x$.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Calcule $\displaystyle\lim_{x\to\infty}\left(1 + \frac2x\right)^{3x}$ e $\displaystyle\lim_{x\to\infty}\left(\frac{x}{x + 1}\right)^x$.</p>`, fig: "", dicas: [R`<p>O primeiro é o exemplário: $e^{ab}$.</p>`, R`<p>$\frac{x}{x+1} = \frac{1}{1 + 1/x}$.</p>`], resp: R`$e^6 \approx 403{,}4$ e $\frac1e \approx 0{,}368$.`, sol: R`<p>$(1 + \frac2x)^{3x} \to e^{2\cdot3}$. No segundo, $\frac{1}{(1 + 1/x)^x} \to \frac1e$.</p>` }),
        F.exercicio({ n: 5, marcas: ["!"], enun: R`<p>Calcule $\displaystyle\lim_{x\to0}x\,\operatorname{sen}\frac1x$ e $\displaystyle\lim_{x\to\infty}\frac{\operatorname{sen}x}{x}$. Por que o $\operatorname{sen}$ "bagunçado" não atrapalha?</p>`, fig: "", dicas: [R`<p>$-1 \leq \operatorname{sen}(\ldots) \leq 1$, sempre.</p>`, R`<p>Confronto: $-|x| \leq x\operatorname{sen}\frac1x \leq |x|$.</p>`], resp: R`Os dois são 0.`, sol: R`<p>Limitado vezes algo que vai a zero vai a zero (confronto). Em $\frac{\operatorname{sen}x}{x}$ com $x \to \infty$: $|\ldots| \leq \frac1x \to 0$. Cuidado: é o mesmo $\frac{\operatorname{sen}x}{x}$ do limite fundamental, mas com $x \to \infty$ a resposta é 0, não 1.</p>` }),
        F.exercicio({ n: 6, enun: R`<p>Uma amostra radioativa tem meia-vida de 8 dias (iodo-131). Escreva $N(t) = N_0e^{-\lambda t}$ e calcule $\lambda$. Que fração sobra depois de 30 dias?</p>`, fig: "", dicas: [R`<p>$e^{-8\lambda} = \frac12$.</p>`, R`<p>$\lambda = \frac{\ln2}{8}$ por dia.</p>`], resp: R`$\lambda \approx 0{,}0866$/dia; sobra $\approx 7{,}4\%$.`, sol: R`<p>$e^{-30\ln2/8} = 2^{-3{,}75} \approx 0{,}0743$.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Uma função contínua $f: [0, 1] \to [0, 1]$ sempre tem um <b>ponto fixo</b> ($f(c) = c$). Prove.</p>`, fig: "", dicas: [R`<p>Olhe para $g(x) = f(x) - x$.</p>`, R`<p>$g(0) \geq 0$ e $g(1) \leq 0$.</p>`], resp: R`TVI aplicado a $g(x) = f(x) - x$.`, sol: R`<p>$g$ é contínua, $g(0) = f(0) \geq 0$ e $g(1) = f(1) - 1 \leq 0$. Se algum é zero, acabou; senão o TVI dá $c$ com $g(c) = 0$ ∎. É o teorema do ponto fixo de Brouwer em 1D. O $\cos x = x$ do laboratório é um ponto fixo do cosseno.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) {
    let e = document.getElementById("lab-bis"); e.outerHTML = F.lab("Bissecção: o TVI virando algoritmo", "lab-bis"); SIM.bissecao(document.getElementById("lab-bis"), F);
    e = document.getElementById("lab-sen"); e.outerHTML = F.lab("Três áreas espremendo sen x / x", "lab-sen"); SIM.senox(document.getElementById("lab-sen"), F);
  },
});
