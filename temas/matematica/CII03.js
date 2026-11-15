/* CII03 · Sequências e séries numéricas. Conferido em Python (scratchpad ci2.py):
   H_n > 10 a partir de n = 12367; H₃₀ = 3,995, H₃₁ = 4,027; Σ n/2ⁿ = 2; bola h = 2 m, e = 0,8: 9,111 m e 5,75 s; 1000 termos da alternada = 0,69265. */
F.registrar("matematica/CII03", {
  retoma: ["CI01", "CII02"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Séries no braço",
      casos: [
        { nome: "Série geométrica", gerar: (p) => {
          const a = p ? 6 : F.escolha([1, 2, 3, 6, 10]), r = p ? 0.25 : F.escolha([0.5, -0.5, 0.25, 0.1, 0.75]);
          const fr = { "0.5": "\\frac12", "-0.5": "-\\frac12", "0.25": "\\frac14", "0.1": "\\frac1{10}", "0.75": "\\frac34" }[String(r)];
          const S = a / (1 - r);
          return { enun: R`<p>Calcule $\displaystyle\sum_{n=0}^{\infty}${a}\left(${fr}\right)^n$.</p>`, fig: "",
            passos: [
              R`<p>É geométrica: primeiro termo $a = ${a}$, razão $r = ${fr}$. Como $|r| < 1$, converge.</p>`,
              R`<p>Fórmula: $S = \frac{a}{1 - r} = \frac{${a}}{1 - (${fr})} = ${F.n(S, 4)}$.</p>`,
              R`<p>Conferência rápida com os 4 primeiros termos: $${[0, 1, 2, 3].map((n) => F.n(a * r ** n, 4)).join(" + ").replace(/\+ -/g, "- ")} = ${F.n([0, 1, 2, 3].reduce((s, n) => s + a * r ** n, 0), 4)}$, já perto de ${F.nt(S, 3)}.</p>`,
            ] };
        } },
        { nome: "A bola que quica", gerar: (p) => {
          const h = p ? 2 : F.escolha([1, 2, 5]), e = p ? 0.8 : F.escolha([0.5, 0.7, 0.8, 0.9]), e2 = e * e;
          const D = (h * (1 + e2)) / (1 - e2), t0 = Math.sqrt((2 * h) / 9.8), T = (t0 * (1 + e)) / (1 - e);
          return { enun: R`<p>Uma bola cai de ${h} m. A cada quique, a velocidade de volta é ${F.nt(e, 1)} da de chegada (coeficiente de restituição). Que distância total ela percorre até parar? E quanto tempo leva? ($g = 9{,}8$ m/s²)</p>`, fig: "",
            passos: [
              R`<p>Altura depois de cada quique: $h' = e^2h$ (porque $h \propto v^2$). As alturas formam uma PG de razão $e^2 = ${F.n(e2, 2)}$.</p>`,
              R`<p>Distância: desce $h$, depois sobe e desce cada altura nova: $D = h + 2(e^2h + e^4h + \dots) = h + \frac{2e^2h}{1 - e^2} = h\,\frac{1 + e^2}{1 - e^2} = ${F.n(D, 3)}$ m.</p>`,
              R`<p>Tempo: a 1ª queda leva $t_0 = \sqrt{2h/g} = ${F.n(t0, 3)}$ s. Cada voo seguinte (subida + descida) leva $2t_0e^k$, porque o tempo é proporcional à velocidade. $T = t_0 + 2t_0(e + e^2 + \dots) = t_0\frac{1 + e}{1 - e} = ${F.n(T, 2)}$ s.</p>`,
              R`<p>Infinitos quiques em tempo finito! Na prática, depois de alguns, a bola "vibra" e para: é o Zenão da física.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A torre de livros que se inclina para o infinito",
      enun: R`<p>Você empilha $n$ livros iguais, de comprimento 1, na beira de uma mesa, cada um deslocado em relação ao de baixo, para que o de cima fique o mais para fora possível sem cair.</p><p>(a) Mostre que o melhor deslocamento é o de cima avançar $\frac12$ sobre o 2º, o 2º avançar $\frac14$ sobre o 3º, …, o $k$-ésimo (de cima para baixo) avançar $\frac{1}{2k}$. (b) O balanço total é $\frac12H_n$, com $H_n = 1 + \frac12 + \dots + \frac1n$. Com quantos livros o de cima fica <b>inteiramente</b> para fora da mesa? E com 2 comprimentos inteiros de balanço?</p>`,
      fig: "",
      dicas: [R`<p>Equilíbrio: o centro de massa dos $k$ livros de cima precisa estar exatamente sobre a borda do livro $k + 1$ (ou da mesa).</p>`, R`<p>Os $k$ livros de cima têm massa $k$. Coloque o livro $k + 1$ e ache o novo centro de massa: ele se desloca $\frac{1}{2(k+1)}$.</p>`],
      sol: R`<p><b>(a)</b> Por indução. Suponha que o CM dos $k$ livros de cima está sobre a borda direita do livro $k + 1$. O livro $k + 1$ tem CM no seu meio, $\frac12$ à esquerda dessa borda. O CM dos $k + 1$ livros fica em $\frac{k\cdot0 + 1\cdot(-\frac12)}{k + 1} = -\frac{1}{2(k+1)}$, medido a partir dessa borda. Para o conjunto ficar no limite, esse ponto vai sobre a borda do livro de baixo: o livro $k + 1$ avança $\frac{1}{2(k+1)}$ sobre o $k + 2$.</p>
        <p><b>(b)</b> Somando: $\frac12\left(1 + \frac12 + \dots + \frac1n\right) = \frac12H_n$. Para passar de 1 inteiro: $H_n > 2$, a partir de $n = 4$ ($H_4 = 2{,}083$). Para 2 inteiros: $H_n > 4$, a partir de $n = 31$ ($H_{30} = 3{,}995$, $H_{31} = 4{,}027$).</p>
        <p class="det" style="color:var(--ink2)">Como a harmônica diverge, dá para ir tão longe quanto se queira, mas o custo cresce exponencialmente: 10 comprimentos exigiriam $H_n > 20$, ou seja, uns $2{,}7\times10^8$ livros. Conferi os valores de $H_n$ numericamente.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 2 · 3</div>
        <div class="q">$0{,}999\ldots = 1$? Aquiles alcança a tartaruga?</div>
        <p>Os dois são a mesma pergunta: uma soma de infinitos termos pode dar um número finito? Pode, e o Cálculo diz exatamente quando. É a base das séries de Taylor (próximo tema), das séries de Fourier e de quase toda aproximação em física.</p></div>`),

      F.secao("sequencias", "Sequências", R`
        <p>Uma sequência é uma lista infinita $a_1, a_2, a_3, \dots$ Ela <b>converge</b> para $L$ se $a_n \to L$ quando $n \to \infty$ (mesma ideia do ε-δ de ${F.ret("CI01")}, com "$n$ grande" no lugar de "$x$ perto").</p>
        <ul><li>$\frac1n \to 0$; $\left(1 + \frac1n\right)^n \to e$; $\frac{n}{n + 1} \to 1$; $(-1)^n$ não converge (oscila).</li>
          <li><b>Monótona e limitada converge</b> (a completude dos reais de novo). É assim que se prova que $\left(1 + \frac1n\right)^n$ tem limite sem saber o valor.</li>
          <li>Hierarquia no infinito: $\ln n \ll n^p \ll a^n \ll n! \ll n^n$. Cada uma vence a anterior (L'Hôpital ${F.ret("CI05")} e Stirling ${F.ret("CE02")}).</li></ul>`),

      F.secao("series", "Séries e somas parciais", R`
        ${F.formula(R`\sum_{n=1}^{\infty}a_n = \lim_{N\to\infty}S_N,\qquad S_N = a_1 + a_2 + \dots + a_N`, "Série = limite das somas parciais")}
        <div id="lab-ser"></div>
        ${F.demo("série geométrica", R`<p>(i) $S_N = a + ar + \dots + ar^{N-1}$. Multiplique por $r$: $rS_N = ar + \dots + ar^N$.</p>
          <p>(ii) Subtraia: $S_N - rS_N = a - ar^N$, então $S_N = a\frac{1 - r^N}{1 - r}$.</p>
          <p>(iii) Se $|r| < 1$, $r^N \to 0$:</p>${F.formula(R`\sum_{n=0}^{\infty}ar^n = \frac{a}{1 - r}\qquad(|r| < 1)`)}
          <p>(iv) $0{,}999\ldots = \frac{9}{10} + \frac{9}{100} + \dots = \frac{9/10}{1 - 1/10} = 1$ ∎. Não é "quase 1": é 1.</p>`)}
        ${F.demo("a harmônica diverge (Oresme, por volta de 1350)", R`<p>(i) Agrupe: $1 + \frac12 + \left(\frac13 + \frac14\right) + \left(\frac15 + \dots + \frac18\right) + \left(\frac19 + \dots + \frac1{16}\right) + \dots$</p>
          <p>(ii) Cada grupo é $\geq\frac12$: $\frac13 + \frac14 \geq \frac14 + \frac14$, $\frac15 + \dots + \frac18 \geq 4\cdot\frac18$, e assim por diante.</p>
          <p>(iii) Infinitos grupos de pelo menos $\frac12$: a soma é infinita ∎. Mas devagar: para passar de 10 são precisos 12 367 termos (e $H_n \approx \ln n + 0{,}5772$).</p>`)}
        ${F.caixa("pegadinha", R`<p><b>Termos indo a zero não garante convergência.</b> Os termos da harmônica vão a zero, e ela diverge. O teste do termo geral só funciona num sentido: se $a_n \not\to 0$, a série diverge (como $1 - 1 + 1 - 1 + \dots$, a série de Grandi).</p>`)}`),

      F.secao("testes", "Testes de convergência", R`
        <table class="tb"><tr><th>teste</th><th>diz que</th><th>exemplo</th></tr>
          <tr><td><b>Telescópica</b></td><td>termos que se cancelam em cadeia</td><td>$\sum\frac{1}{n(n+1)} = \sum\left(\frac1n - \frac1{n+1}\right) = 1$</td></tr>
          <tr><td><b>Integral</b></td><td>$\sum f(n)$ e $\int^\infty f$ convergem juntas ($f$ positiva, decrescente)</td><td>$\sum\frac1{n^p}$ converge $\iff p > 1$ ${F.ret("CII02")}</td></tr>
          <tr><td><b>Comparação</b></td><td>menor que convergente converge; maior que divergente diverge</td><td>$\sum\frac{1}{n^2 + 1} \leq \sum\frac1{n^2}$</td></tr>
          <tr><td><b>Razão</b> (d'Alembert)</td><td>$\left|\frac{a_{n+1}}{a_n}\right| \to L$: converge se $L < 1$, diverge se $L > 1$</td><td>$\sum\frac{n}{2^n}$: $L = \frac12$, converge (vale 2)</td></tr>
          <tr><td><b>Alternada</b> (Leibniz)</td><td>sinais alternando, termos decrescendo a 0: converge</td><td>$1 - \frac12 + \frac13 - \dots = \ln2$</td></tr></table>
        <p><b>Basileia</b>: $\sum\frac{1}{n^2} = \frac{\pi^2}{6}$ (Euler, 1734). A convergência sai do teste da integral; o valor exato, só com ideias de Taylor/Fourier. No laboratório, veja como ela converge devagar.</p>
        ${F.caixa("fisico", R`<p><b>Séries na física</b>: o campo de uma carga perto de um plano condutor dobrado (cargas-imagem, infinitas, uma série); a resistência de uma escada infinita de resistores (o "ponto fixo" de uma sequência); a energia de uma rede cristalina iônica (a constante de Madelung, uma série que converge só condicionalmente); o batimento de muitos quiques (exemplário).</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Escreva $0{,}\overline{36} = 0{,}363636\ldots$ como fração usando série geométrica.</p>`, fig: "", dicas: [R`<p>$\frac{36}{100} + \frac{36}{100^2} + \dots$</p>`, R`<p>$a = \frac{36}{100}$, $r = \frac1{100}$.</p>`], resp: R`$\frac{36}{99} = \frac{4}{11}$.`, sol: R`<p>$\frac{36/100}{99/100} = \frac{36}{99} = \frac4{11}$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule $\sum_{n=1}^\infty\frac{1}{n(n+1)}$ e $\sum_{n=2}^\infty\frac{1}{n^2 - 1}$.</p>`, fig: "", dicas: [R`<p>Frações parciais: $\frac{1}{n(n+1)} = \frac1n - \frac1{n+1}$.</p>`, R`<p>$\frac{1}{n^2 - 1} = \frac12\left(\frac1{n-1} - \frac1{n+1}\right)$: sobram dois termos.</p>`], resp: R`$1$ e $\frac34$.`, sol: R`<p>Na segunda, os cancelamentos deixam $\frac12\left(1 + \frac12\right) = \frac34$.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Decida se convergem: (a) $\sum\frac{1}{\sqrt n}$; (b) $\sum\frac{1}{n^2 + 1}$; (c) $\sum\frac{2^n}{n!}$; (d) $\sum\frac{n}{n + 1}$.</p>`, fig: "", dicas: [R`<p>(a) $p = \frac12$; (b) comparação; (c) razão; (d) termo geral.</p>`, R`<p>(c) $\frac{a_{n+1}}{a_n} = \frac{2}{n+1} \to 0$.</p>`], resp: R`(a) diverge; (b) converge; (c) converge; (d) diverge.`, sol: R`<p>(c) começando em $n = 1$, vale $e^2 - 1$ (próximo tema). (d) os termos vão a 1, não a 0.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Use o teste da razão para mostrar que $\sum_{n=1}^\infty\frac{n}{2^n}$ converge. Depois, mostre que a soma é 2.</p>`, fig: "", dicas: [R`<p>$\frac{(n+1)/2^{n+1}}{n/2^n} = \frac{n+1}{2n} \to \frac12$.</p>`, R`<p>Para a soma: $S - \frac S2 = \frac12 + \frac14 + \frac18 + \dots$</p>`], resp: R`$L = \frac12 < 1$; soma $= 2$.`, sol: R`<p>$S - \frac S2 = \sum\frac{1}{2^n} = 1$, então $S = 2$. (Esse valor é o número médio de lançamentos de moeda até sair a primeira cara.)</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma bola cai de 2 m e o coeficiente de restituição é 0,8. Qual a distância total percorrida até parar e o tempo total? ($g = 9{,}8$ m/s²)</p>`, fig: "", dicas: [R`<p>As alturas formam PG de razão $e^2 = 0{,}64$.</p>`, R`<p>Tempo: $t_0\frac{1 + e}{1 - e}$ com $t_0 = \sqrt{2h/g}$.</p>`], resp: R`$\approx 9{,}11$ m e $\approx 5{,}75$ s.`, sol: R`<p>$D = 2\cdot\frac{1{,}64}{0{,}36} = 9{,}11$ m. $t_0 = 0{,}639$ s, $T = 0{,}639\times9 = 5{,}75$ s.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Infinitos capacitores estão ligados <b>em série</b>, com capacitâncias $C_1 = 1$ μF, $C_2 = 2$ μF, $C_3 = 4$ μF, $C_4 = 8$ μF, … Qual a capacitância equivalente?</p>`, fig: "", dicas: [R`<p>Em série: $\frac1{C_\text{eq}} = \sum\frac{1}{C_k}$.</p>`, R`<p>$1 + \frac12 + \frac14 + \dots = 2$.</p>`], resp: R`$C_\text{eq} = 0{,}5$ μF.`, sol: R`<p>$\frac{1}{C_\text{eq}} = 2\ \mu\text{F}^{-1}$. Se fossem iguais (1, 1, 1, …), a série divergiria e $C_\text{eq} \to 0$ ${F.ret("fisica/C11")}.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>A série $1 - \frac12 + \frac13 - \frac14 + \dots$ converge para $\ln2$. Mostre que, <b>reordenando</b> os termos como $1 - \frac12 - \frac14 + \frac13 - \frac16 - \frac18 + \frac15 - \dots$ (um positivo, dois negativos), a soma vira $\frac12\ln2$.</p>`, fig: "", dicas: [R`<p>Agrupe: $\left(1 - \frac12\right) - \frac14 + \left(\frac13 - \frac16\right) - \frac18 + \dots$</p>`, R`<p>Cada parêntese é metade do positivo: $\frac12 - \frac14 + \frac16 - \frac18 + \dots$</p>`], resp: R`Sai $\frac12\left(1 - \frac12 + \frac13 - \dots\right) = \frac12\ln2$.`, sol: R`<p>Os termos são os mesmos, mas a soma mudou! É o <b>teorema de Riemann</b>: uma série que converge só condicionalmente pode ser reordenada para dar qualquer valor. Com séries absolutamente convergentes (como $\sum\frac1{n^2}$) isso não acontece.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-ser"); e.outerHTML = F.lab("Somas parciais: converge ou não?", "lab-ser"); SIM.series(document.getElementById("lab-ser"), F); },
});
