/* CI01 · Funções e limites. Limites conferidos com sympy (scratchpad ci.py). */
F.registrar("CI01", {
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Limites 0/0 e ∞/∞",
      casos: [
        { nome: "Fatorar e cancelar", gerar: (p) => {
          const a = p ? 3 : F.escolha([1, 2, 3, 4, -2]), b = p ? 2 : F.escolha([1, 2, 5, -1, -3]);
          const B = b - a, C = -a * b, sB = B === 0 ? "" : B > 0 ? ` + ${B === 1 ? "" : B}x` : ` - ${B === -1 ? "" : -B}x`, sC = C === 0 ? "" : C > 0 ? ` + ${C}` : ` - ${-C}`;
          const den = a > 0 ? `x - ${a}` : `x + ${-a}`, fat = b > 0 ? `x + ${b}` : `x - ${-b}`;
          return { enun: R`<p>Calcule $\displaystyle\lim_{x\to${a}}\frac{x^2${sB}${sC}}{${den}}$.</p>`, fig: "",
            passos: [
              R`<p>Tente substituir: em cima, $${a < 0 ? `(${a})` : a}^2 ${B >= 0 ? "+" : "-"} ${Math.abs(B)}\cdot${a < 0 ? `(${a})` : a} ${C >= 0 ? "+" : "-"} ${Math.abs(C)} = 0$; embaixo, $0$. Deu $\frac00$: <b>não</b> é a resposta, é um aviso de que tem um fator escondido.</p>`,
              R`<p>Se o polinômio de cima zera em $x = ${a}$, ele tem o fator $(${den})$. Fatorando (soma e produto das raízes):</p>$$x^2${sB}${sC} = (${den})(${fat})$$`,
              R`<p>Para $x \neq ${a}$ (e o limite nunca olha para $x = ${a}$), dá para cancelar:</p>$$\lim_{x\to${a}}(${fat}) = ${a} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${a + b}$$`,
              R`<p>O gráfico é a reta $y = ${fat}$ com um <b>buraco</b> em $x = ${a}$. O limite é a altura do buraco: $${a + b}$.</p>`,
            ] };
        } },
        { nome: "Racionalizar (conjugado)", gerar: (p) => {
          const c = p ? 3 : F.escolha([1, 2, 3, 4, 5]);
          return { enun: R`<p>Calcule $\displaystyle\lim_{x\to0}\frac{\sqrt{x + ${c * c}} - ${c}}{x}$.</p>`, fig: "",
            passos: [
              R`<p>Substituindo: $\frac{\sqrt{${c * c}} - ${c}}{0} = \frac00$. Com raiz, o truque é multiplicar em cima e embaixo pelo <b>conjugado</b> $\sqrt{x + ${c * c}} + ${c}$.</p>`,
              R`<p>Em cima aparece $(a - b)(a + b) = a^2 - b^2$:</p>$$\frac{(x + ${c * c}) - ${c * c}}{x\left(\sqrt{x + ${c * c}} + ${c}\right)} = \frac{x}{x\left(\sqrt{x + ${c * c}} + ${c}\right)} = \frac{1}{\sqrt{x + ${c * c}} + ${c}}$$`,
              R`<p>Agora substitui sem problema: $\frac{1}{${c} + ${c}} = \frac{1}{${2 * c}} \approx ${F.m(1 / (2 * c), 4)}$.</p><p>Spoiler de CI03: isso é a derivada de $\sqrt x$ em $x = ${c * c}$.</p>`,
            ] };
        } },
        { nome: "No infinito", gerar: (p) => {
          const a = p ? 3 : F.escolha([1, 2, 3, 5]), b = p ? 7 : F.escolha([1, 4, 7, 9]), c = p ? 2 : F.escolha([2, 4, 5]), d = p ? 1 : F.escolha([1, 3, 6]);
          return { enun: R`<p>Calcule $\displaystyle\lim_{x\to\infty}\frac{${a}x^2 + ${b}}{${c}x^2 + ${d}x}$.</p>`, fig: "",
            passos: [
              R`<p>Substituir dá $\frac\infty\infty$. Divida tudo pela maior potência que aparece embaixo, $x^2$:</p>$$\frac{${a} + \frac{${b}}{x^2}}{${c} + \frac{${d}}{x}}$$`,
              R`<p>Quando $x \to \infty$, $\frac{${b}}{x^2} \to 0$ e $\frac{${d}}{x} \to 0$. Sobra $\frac{${a}}{${c}} \approx ${F.m(a / c, 4)}$.</p><p>Regra de bolso: com o mesmo grau em cima e embaixo, o limite é a razão dos coeficientes do termo dominante. É a reta horizontal $y = ${F.m(a / c, 3)}$ (assíntota).</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Provar com ε e δ que 1/x é contínua",
      enun: R`<p>Seja $a > 0$. Prove, pela definição com ε e δ, que $\displaystyle\lim_{x\to a}\frac1x = \frac1a$. Ou seja: dado <b>qualquer</b> $\varepsilon > 0$, ache um $\delta > 0$ (que pode depender de $\varepsilon$ e de $a$) tal que $0 < |x - a| < \delta \Rightarrow \left|\frac1x - \frac1a\right| < \varepsilon$.</p>`,
      fig: "",
      dicas: [R`<p>$\left|\frac1x - \frac1a\right| = \frac{|x - a|}{|x|\,a}$. O problema é o $|x|$ embaixo: se $x$ chegar perto de 0, isso explode. Proíba isso primeiro.</p>`, R`<p>Exija $\delta \leq a/2$. Então $|x - a| < a/2 \Rightarrow x > a/2$, e $\frac{1}{|x|} < \frac2a$.</p>`],
      sol: R`<p>(i) Conta: $\left|\frac1x - \frac1a\right| = \frac{|a - x|}{|x|\,a}$.</p>
        <p>(ii) Controle do denominador: se $|x - a| < \frac a2$, então $x > \frac a2 > 0$ e $\frac1{|x|} < \frac2a$.</p>
        <p>(iii) Com isso, $\left|\frac1x - \frac1a\right| < \frac{2}{a^2}|x - a|$.</p>
        <p>(iv) Para isso ficar $< \varepsilon$, basta $|x - a| < \frac{a^2\varepsilon}{2}$.</p>
        <p>(v) Escolha $\delta = \min\left(\frac a2,\ \frac{a^2\varepsilon}{2}\right)$. Se $0 < |x - a| < \delta$, valem (ii) e (iv) ao mesmo tempo, e $\left|\frac1x - \frac1a\right| < \frac2{a^2}\cdot\frac{a^2\varepsilon}2 = \varepsilon$ ∎.</p>
        <p class="det" style="color:var(--ink2)">Repare que o δ depende de $a$: quanto mais perto de 0, menor ele precisa ser (a função fica cada vez mais íngreme). É a diferença entre continuidade e continuidade <i>uniforme</i>, assunto de Análise.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 1 · 1</div>
        <div class="q">Qual é a velocidade de um carro <i>neste instante</i>?</div>
        <p>Velocidade média é $\frac{\Delta x}{\Delta t}$. Num instante, $\Delta t = 0$ e $\Delta x = 0$: a conta vira $\frac00$, que não quer dizer nada. Mesmo assim o velocímetro mostra um número. O <b>limite</b> é a ferramenta que dá sentido a esse número, e é a base de todo o Cálculo: derivada e integral são limites.</p></div>`),

      F.secao("funcoes", "Funções: a máquina", R`
        <p>Uma <b>função</b> $f$ é uma regra que pega cada número $x$ do <b>domínio</b> e devolve <b>um único</b> número $f(x)$. Na física, quase tudo é função de alguma coisa: posição em função do tempo $x(t)$, força em função da distância $F(r) = kq_1q_2/r^2$, corrente em função da tensão.</p>
        <table class="tb"><tr><th>família</th><th>exemplo</th><th>onde aparece</th></tr>
          <tr><td>polinômio</td><td>$x(t) = x_0 + v_0t + \frac12at^2$</td><td>MUV</td></tr>
          <tr><td>racional</td><td>$F(r) = \frac{k}{r^2}$</td><td>Coulomb, gravitação</td></tr>
          <tr><td>exponencial</td><td>$N(t) = N_0e^{-\lambda t}$</td><td>decaimento radioativo, carga do capacitor</td></tr>
          <tr><td>logaritmo</td><td>$\beta = 10\log\frac{I}{I_0}$</td><td>decibéis, pH</td></tr>
          <tr><td>trigonométrica</td><td>$x(t) = A\cos(\omega t + \varphi)$</td><td>MHS, ondas, corrente alternada</td></tr></table>
        <p>O <b>domínio</b> é onde a regra faz sentido: $\frac1x$ não aceita $0$; $\sqrt x$ não aceita negativos (nos reais); $\ln x$ só aceita positivos. Uma pergunta que sempre vale a pena: "o que acontece perto de onde a função não está definida?". É aí que entram os limites.</p>`),

      F.secao("limite", "O limite, sem fórmula", R`
        <p>$f(x) = \frac{x^2 - 4}{x - 2}$ não está definida em $x = 2$ (dá $\frac00$). Mas olhe os valores perto:</p>
        <table class="tb"><tr><th>x</th><td>1,9</td><td>1,99</td><td>1,999</td><td>2</td><td>2,001</td><td>2,01</td><td>2,1</td></tr><tr><th>f(x)</th><td>3,9</td><td>3,99</td><td>3,999</td><td>?</td><td>4,001</td><td>4,01</td><td>4,1</td></tr></table>
        <p>Quanto mais $x$ chega perto de 2, mais $f(x)$ chega perto de 4. Escreve-se</p>
        ${F.formula(R`\lim_{x\to2}\frac{x^2 - 4}{x - 2} = 4`)}
        <p>O ponto mais importante: <b>o limite não liga para o que acontece exatamente em $x = 2$</b>, só perto. A função pode nem existir lá (é o caso), ou existir e valer outra coisa. O gráfico é a reta $y = x + 2$ com um furo em $(2, 4)$.</p>
        <h3>Limites laterais</h3>
        <p>$\lim_{x\to a^+}$ é chegando pela direita ($x > a$); $\lim_{x\to a^-}$, pela esquerda. O limite existe <b>se e só se</b> os dois laterais existem e são iguais. Exemplo: $\frac{x}{|x|}$ vale $+1$ para $x > 0$ e $-1$ para $x < 0$: os laterais são $+1$ e $-1$, e $\lim_{x\to0}\frac{x}{|x|}$ não existe. Na física: a força de atrito cinético "pula" de sinal quando a velocidade passa por zero.</p>
        <h3>Limites infinitos e no infinito</h3>
        <p>$\lim_{x\to0}\frac1{x^2} = +\infty$ quer dizer "cresce sem parar" (o limite, a rigor, não existe como número; a reta $x = 0$ é uma <b>assíntota vertical</b>). $\lim_{x\to\infty}\frac{3x^2 + 1}{x^2 + 5} = 3$ quer dizer "para $x$ enorme, a função se aproxima de 3" (assíntota horizontal). Na física: a velocidade terminal de um paraquedista é um limite no infinito, $\lim_{t\to\infty}v(t) = \frac{mg}{b}$.</p>`),

      F.secao("epsilon", "A definição de verdade: ε e δ", R`
        <p>"Chegar perto" é vago. Cauchy e Weierstrass, no século XIX, transformaram isso num desafio de dois jogadores:</p>
        ${F.formula(R`\lim_{x\to a}f(x) = L \iff \forall\,\varepsilon > 0\ \ \exists\,\delta > 0:\ \ 0 < |x - a| < \delta \ \Rightarrow\ |f(x) - L| < \varepsilon`, "Definição de limite (Weierstrass)")}
        <p>Leitura: o adversário escolhe uma tolerância $\varepsilon$ para a resposta, tão pequena quanto quiser. Você tem de responder com uma tolerância $\delta$ para a entrada que garanta que <b>todos</b> os $x$ a menos de $\delta$ de $a$ (sem contar o próprio $a$) caem a menos de $\varepsilon$ de $L$. Se você sempre consegue responder, o limite é $L$.</p>
        ${F.demo("lim (2x + 1) = 3 quando x → 1", R`<p>(i) Queremos $|(2x + 1) - 3| < \varepsilon$, ou seja, $|2x - 2| < \varepsilon$, ou seja, $2|x - 1| < \varepsilon$.</p>
          <p>(ii) Isso vale sempre que $|x - 1| < \frac\varepsilon2$. Então responda $\delta = \frac\varepsilon2$.</p>
          <p>(iii) Conferindo: se $0 < |x - 1| < \frac\varepsilon2$, então $|(2x+1) - 3| = 2|x - 1| < \varepsilon$ ∎. A reta tem inclinação 2, por isso o δ é metade do ε.</p>`)}
        <div id="lab-eps"></div>
        ${F.caixa("fisico", R`<p><b>Isso é teoria de erros!</b> No seu experimento do pêndulo: "quero o $g$ com erro menor que $\varepsilon$; com que precisão $\delta$ preciso medir o período?". A definição de limite é exatamente essa pergunta, feita para tolerâncias arbitrariamente pequenas.</p>`)}`),

      F.secao("tecnicas", "Como calcular na prática", R`
        <p><b>Propriedades</b> (se os limites de $f$ e $g$ existem): o limite da soma é a soma dos limites; o do produto, o produto; o do quociente, o quociente (se o de baixo não for 0). Daí: para polinômios, e para qualquer função "bem-comportada" no ponto, <b>basta substituir</b>.</p>
        <p>Quando substituir dá uma <b>indeterminação</b> ($\frac00$, $\frac\infty\infty$, $\infty - \infty$, $0\cdot\infty$, $1^\infty$…), a conta não acabou. As ferramentas:</p>
        <ul><li><b>Fatorar e cancelar</b> (polinômios que zeram juntos).</li><li><b>Conjugado</b> (diferenças com raiz).</li><li><b>Dividir pela maior potência</b> (limites no infinito).</li><li><b>Limites fundamentais</b> ($\frac{\sin x}{x}$, $(1 + \frac1n)^n$): próximo tema ${F.ret("CI02")}.</li><li><b>L'Hôpital</b> (com derivadas): ${F.ret("CI05")}.</li></ul>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $\displaystyle\lim_{x\to2}\frac{x^3 - 8}{x - 2}$.</p>`, fig: "", dicas: [R`<p>$a^3 - b^3 = (a - b)(a^2 + ab + b^2)$.</p>`, R`<p>Depois de cancelar, substitua $x = 2$ em $x^2 + 2x + 4$.</p>`], resp: R`$12$.`, sol: R`<p>$\frac{(x-2)(x^2+2x+4)}{x-2} = x^2 + 2x + 4 \to 4 + 4 + 4 = 12$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule $\displaystyle\lim_{x\to9}\frac{\sqrt x - 3}{x - 9}$.</p>`, fig: "", dicas: [R`<p>Conjugado, ou veja $x - 9 = (\sqrt x - 3)(\sqrt x + 3)$.</p>`, R`<p>Sobra $\frac{1}{\sqrt x + 3}$.</p>`], resp: R`$\frac16$.`, sol: R`<p>$x - 9$ é diferença de quadrados: $(\sqrt x - 3)(\sqrt x + 3)$. Cancela e dá $\frac1{3 + 3}$.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Calcule $\displaystyle\lim_{x\to\infty}\frac{2x^3 - x}{5x^3 + 7}$ e $\displaystyle\lim_{x\to\infty}\frac{x^2}{x^3 + 1}$.</p>`, fig: "", dicas: [R`<p>Divida por $x^3$.</p>`, R`<p>Grau de baixo maior que o de cima: vai a 0.</p>`], resp: R`$\frac25$ e $0$.`, sol: R`<p>Mesmo grau: razão dos coeficientes, $\frac25$. No segundo, $\frac{1/x}{1 + 1/x^3} \to 0$.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Para $f(x) = \frac{|x - 3|}{x - 3}$: calcule os limites laterais em 3. O limite existe?</p>`, fig: "", dicas: [R`<p>Para $x > 3$, $|x - 3| = x - 3$.</p>`, R`<p>Para $x < 3$, $|x - 3| = -(x - 3)$.</p>`], resp: R`$+1$ pela direita, $-1$ pela esquerda; o limite não existe.`, sol: R`<p>Laterais diferentes $\Rightarrow$ não existe. É o "salto" do laboratório, deslocado para $x = 3$.</p>` }),
        F.exercicio({ n: 5, marcas: ["!"], enun: R`<p>Calcule $\displaystyle\lim_{x\to\infty}\left(\sqrt{x^2 + x} - x\right)$. Cuidado: $\infty - \infty$ não é zero.</p>`, fig: "", dicas: [R`<p>Conjugado: multiplique e divida por $\sqrt{x^2 + x} + x$.</p>`, R`<p>Vai sobrar $\frac{x}{\sqrt{x^2 + x} + x}$; divida por $x$.</p>`], resp: R`$\frac12$.`, sol: R`<p>$\frac{x^2 + x - x^2}{\sqrt{x^2 + x} + x} = \frac{x}{\sqrt{x^2+x} + x} = \frac{1}{\sqrt{1 + 1/x} + 1} \to \frac12$. A diferença entre duas coisas que vão ao infinito pode ser qualquer número.</p>` }),
        F.exercicio({ n: 6, enun: R`<p>A velocidade de um paraquedista é $v(t) = 50\left(1 - e^{-t/5}\right)$ m/s. Qual a velocidade terminal? Em quanto tempo ele chega a 95% dela?</p>`, fig: "", dicas: [R`<p>$e^{-t/5} \to 0$ quando $t \to \infty$.</p>`, R`<p>$1 - e^{-t/5} = 0{,}95 \Rightarrow e^{-t/5} = 0{,}05$.</p>`], resp: R`$50$ m/s; $t = 5\ln20 \approx 15$ s.`, sol: R`<p>$\lim_{t\to\infty}v = 50$ m/s. $t = 5\ln 20 \approx 14{,}98$ s. Ele nunca <i>chega</i> exatamente a 50: o limite descreve para onde ele vai.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Usando ε e δ: prove que $\lim_{x\to3}x^2 = 9$. (Dica de olimpíada: limite o $|x + 3|$ primeiro.)</p>`, fig: "", dicas: [R`<p>$|x^2 - 9| = |x - 3|\,|x + 3|$.</p>`, R`<p>Se $\delta \leq 1$, então $2 < x < 4$ e $|x + 3| < 7$.</p>`], resp: R`$\delta = \min\left(1, \frac\varepsilon7\right)$ funciona.`, sol: R`<p>(i) Com $|x - 3| < 1$: $|x + 3| < 7$. (ii) Então $|x^2 - 9| < 7|x - 3|$. (iii) Se também $|x - 3| < \varepsilon/7$, fica $< \varepsilon$. (iv) $\delta = \min(1, \varepsilon/7)$ ∎. A técnica "limite o pedaço chato primeiro" é a mesma do chefão.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-eps"); e.outerHTML = F.lab("O jogo do ε e δ", "lab-eps"); SIM.limite(document.getElementById("lab-eps"), F); },
});
