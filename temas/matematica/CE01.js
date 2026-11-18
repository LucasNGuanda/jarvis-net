/* CE01 · Função W de Lambert. Números conferidos com scipy.special.lambertw (scratchpad ce.py):
   W(e)=1, W(2e²)=2, W₀(−ln2/2)=−ln2, W₋₁(−ln2/2)=−2ln2, xˣ=100 → 3,5973, e^x=3x → 0,6191 e 1,5121, Wien 2,8214 e 4,9651 (b = 2,898e−3 m·K),
   2^x=x² → −0,7667, diodo (E=5 V, R=1 kΩ, Is=1e−12 A, n=1): i = 4,426 mA, V_D = 0,574 V. */
F.registrar("matematica/CE01", {
  html(F) {
    const R = String.raw;
    const W = (x, r = 0) => MAT.W(x, r);
    const exemplario = F.exemplo({
      titulo: "Resolvendo equações com W",
      casos: [
        { nome: "a·x·e^(bx) = c", gerar: (p) => {
          const a = p ? 2 : F.escolha([1, 2, 3]), b = p ? 1 : F.escolha([0.5, 1, 2]), c = p ? 6 : F.escolha([1, 3, 5, 6, 10]);
          const z = (b * c) / a, w = W(z), x = w / b;
          return { enun: R`<p>Resolva $${a === 1 ? "" : a}\,x\,e^{${F.c(b)}x} = ${c}$.</p>`, fig: "",
            passos: [
              R`<p>A meta é deixar a equação na forma $(\text{coisa})\,e^{\text{coisa}} = \text{número}$. O expoente é $${F.c(b)}x$, então a "coisa" precisa ser $${F.c(b)}x$ também.</p>`,
              R`<p>Multiplique os dois lados por $\frac{${F.n(b)}}{${a}}$:</p>$$(${F.c(b)}x)\,e^{${F.c(b)}x} = \frac{${F.n(b)}\cdot${c}}{${a}} = ${F.n(z, 4)}$$`,
              R`<p>Agora é a definição de $W$: se $u\,e^u = z$, então $u = W(z)$. Como $z > 0$, só existe o ramo $W_0$:</p>$$${F.c(b)}x = W(${F.n(z, 4)}) = ${F.n(w, 6)}$$`,
              R`<p>$x = ${F.n(w, 6)}/${F.n(b)} = ${F.n(x, 6)}$. Conferindo: $${a}\cdot${F.n(x, 4)}\cdot e^{${F.n(b * x, 4)}} = ${F.n(a * x * Math.exp(b * x), 4)}$ ✓</p>`,
            ] };
        } },
        { nome: "eˣ = k·x (dois ramos)", gerar: (p) => {
          const k = p ? 3 : F.escolha([3, 4, 5, 8]), x1 = -W(-1 / k, 0), x2 = -W(-1 / k, -1);
          return { enun: R`<p>Resolva $e^x = ${k}x$.</p>`, fig: "",
            passos: [
              R`<p>Passe tudo para um lado com o $x$ junto do exponencial: divida por $${k}e^x$:</p>$$x\,e^{-x} = \frac1{${k}}$$`,
              R`<p>A "coisa" do expoente é $-x$. Multiplique por $-1$:</p>$$(-x)\,e^{-x} = -\frac1{${k}} = ${F.n(-1 / k, 4)}$$`,
              R`<p>O número é negativo e maior que $-1/e \approx -0{,}3679$: <b>dois</b> ramos, duas respostas:</p>$$-x = W_0(${F.n(-1 / k, 4)}) = ${F.n(-x1, 6)}\quad\text{ou}\quad -x = W_{-1}(${F.n(-1 / k, 4)}) = ${F.n(-x2, 6)}$$`,
              R`<p>$x_1 = ${F.n(x1, 4)}$ e $x_2 = ${F.n(x2, 4)}$. Conferindo: $e^{${F.n(x1, 4)}} = ${F.n(Math.exp(x1), 4)}$ e $${k}\cdot${F.n(x1, 4)} = ${F.n(k * x1, 4)}$ ✓. (A reta $y = ${k}x$ corta a exponencial em dois pontos.)</p>`,
            ] };
        } },
        { nome: "xˣ = N", gerar: (p) => {
          const N = p ? 100 : F.escolha([5, 10, 50, 100, 1000]), L = Math.log(N), w = W(L), x = Math.exp(w);
          return { enun: R`<p>Resolva $x^x = ${N}$.</p>`, fig: "",
            passos: [
              R`<p>Tire o $\ln$: $x\ln x = \ln ${N} = ${F.n(L, 5)}$.</p>`,
              R`<p>Truque: $x = e^{\ln x}$. Então $x\ln x = (\ln x)\,e^{\ln x}$, e a "coisa" é $\ln x$:</p>$$(\ln x)\,e^{\ln x} = ${F.n(L, 5)}$$`,
              R`<p>Definição de $W$: $\ln x = W(${F.n(L, 5)}) = ${F.n(w, 6)}$.</p>`,
              R`<p>$x = e^{${F.n(w, 6)}} = ${F.n(x, 6)}$. Conferindo: $${F.n(x, 4)}^{${F.n(x, 4)}} = ${F.n(Math.pow(x, x), 4)}$ ✓. Atalho: como $W e^W = L$, também vale $x = \dfrac{\ln N}{W(\ln N)}$.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O diodo que não deixa resolver",
      enun: R`<p>Um diodo está em série com um resistor $R = 1$ kΩ e uma bateria $E = 5$ V. O diodo segue a equação de Shockley $i = I_s\left(e^{V_D/V_T} - 1\right)$, com $I_s = 10^{-12}$ A e $V_T = 25{,}852$ mV (temperatura ambiente). (a) Mostre que a corrente é</p>
        $$i = \frac{V_T}{R}\,W\!\left(\frac{I_sR}{V_T}\,e^{(E + I_sR)/V_T}\right) - I_s.$$
        <p>(b) Calcule $i$ e $V_D$. O argumento do $W$ é gigante ($\sim e^{176}$): a calculadora estoura. Como sair dessa?</p>`,
      fig: "",
      dicas: [R`<p>Malha: $E = Ri + V_D$, e da Shockley $V_D = V_T\ln(1 + i/I_s)$. Chame $u = (i + I_s)/I_s$ e isole a exponencial.</p>`, R`<p>Para $z$ enorme, resolva $w + \ln w = \ln z$ (que é o $\ln$ de $w\,e^w = z$) por Newton, começando em $w \approx \ln z - \ln\ln z$.</p>`],
      sol: R`<p><b>(a)</b> (i) Malha: $E = Ri + V_T\ln\frac{i + I_s}{I_s}$. (ii) Seja $y = \frac{R(i + I_s)}{V_T}$. Então $i = \frac{V_T}{R}y - I_s$ e a malha vira $E = V_Ty - RI_s + V_T\ln\frac{V_Ty}{RI_s}$.<br>(iii) Divida por $V_T$ e exponencie: $e^{(E + RI_s)/V_T} = e^y\cdot\frac{V_T\,y}{RI_s}$, ou seja, $y\,e^y = \frac{RI_s}{V_T}e^{(E + RI_s)/V_T}$.<br>(iv) Logo $y = W(\ldots)$ e $i = \frac{V_T}{R}W(\ldots) - I_s$ ∎.</p>
        <p><b>(b)</b> $\ln z = \ln\frac{RI_s}{V_T} + \frac{E + RI_s}{V_T} = -17{,}07 + 193{,}41 = 176{,}34$. Newton em $w + \ln w = 176{,}34$ a partir de $w_0 = 176{,}34 - \ln 176{,}34 = 171{,}17$: converge para $w = 171{,}198$.</p>
        <p>$i = \frac{0{,}025852}{1000}\times171{,}198 \approx 4{,}43$ mA e $V_D = E - Ri \approx 0{,}574$ V. Conferi com um resolvedor numérico direto (brentq) na equação original: dá o mesmo até o 9º dígito.</p>
        <p class="det" style="color:var(--ink2)">É assim que simuladores de circuito tratam diodos: a W de Lambert dá a resposta "fechada" que a álgebra comum não dá.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Funções especiais · 1</div>
        <div class="q">Resolva $x\,e^x = 5$.</div>
        <p>Tente. Log não resolve (o $x$ está dentro e fora do expoente). Raiz não resolve. Nenhuma combinação de funções da escola resolve. Quando isso aconteceu com $x^2 = 5$, a humanidade inventou o $\sqrt{\ }$. Com $e^x = 5$, inventou o $\ln$. Aqui, a gente inventa o $W$.</p></div>`),

      F.secao("definicao", "A definição", R`
        ${F.formula(R`W(x)\,e^{W(x)} = x`, "W de Lambert: a inversa de f(w) = w·eʷ")}
        <p>Ou seja: $W(x)$ é o número $w$ tal que $w\,e^w = x$. Então $x\,e^x = 5$ tem resposta $x = W(5) \approx 1{,}3267$. "Isso é roubar?" Não mais que escrever $\sqrt5$: é um número bem definido, que a calculadora (ou o laboratório abaixo) acha com quantas casas você quiser.</p>
        <h3>Domínio e os dois ramos</h3>
        <p>A função $f(w) = w\,e^w$ tem um mínimo: $f'(w) = e^w(1 + w) = 0$ em $w = -1$, com $f(-1) = -1/e \approx -0{,}3679$. Consequências:</p>
        <ul><li>Para $x < -1/e$: <b>não existe</b> $W(x)$ real (a curva nunca desce tanto).</li>
          <li>Para $-1/e < x < 0$: a reta horizontal corta $w\,e^w$ <b>duas vezes</b>. Por isso há dois ramos: $W_0(x) \geq -1$ (o principal) e $W_{-1}(x) \leq -1$.</li>
          <li>Para $x \geq 0$: só um, o $W_0$.</li></ul>
        <table class="tb"><tr><th>x</th><th>W₀(x)</th><th>W₋₁(x)</th><th>por quê</th></tr>
          <tr><td>$0$</td><td>$0$</td><td>—</td><td>$0\cdot e^0 = 0$</td></tr>
          <tr><td>$e$</td><td>$1$</td><td>—</td><td>$1\cdot e^1 = e$</td></tr>
          <tr><td>$2e^2$</td><td>$2$</td><td>—</td><td>$2\cdot e^2$</td></tr>
          <tr><td>$-1/e$</td><td>$-1$</td><td>$-1$</td><td>o mínimo: os dois ramos se encontram</td></tr>
          <tr><td>$-\frac{\ln2}{2}$</td><td>$-\ln2$</td><td>$-2\ln2$</td><td>$-\ln2\cdot\frac12 = -2\ln2\cdot\frac14$</td></tr></table>`),

      F.secao("lab", "Laboratório", R`<p>Arraste o $a$. Ligue e desligue o espelho para ver que a $W$ é só a curva $x\,e^x$ refletida na diagonal. À direita, o método de Newton achando o $W_0(a)$ do zero.</p><div id="lab-w"></div>`),

      F.secao("propriedades", "Derivada, integral e série", R`
        ${F.demo("derivada (derivação implícita)", R`<p>(i) Derive $W\,e^W = x$ dos dois lados em $x$ (regra do produto e da cadeia): $W'e^W + W\,e^W\,W' = 1$.</p>
          <p>(ii) $W'\,e^W(1 + W) = 1 \Rightarrow W' = \dfrac{1}{e^W(1 + W)}$.</p>
          <p>(iii) Para $x \neq 0$, use $e^W = x/W$:</p>${F.formula(R`W'(x) = \frac{W(x)}{x\,\bigl(1 + W(x)\bigr)}`)}
          <p>Em $x = -1/e$ ($W = -1$) o denominador zera: a tangente é vertical, exatamente onde os dois ramos se juntam.</p>`)}
        ${F.demo("integral (troca de variável)", R`<p>(i) Faça $x = w\,e^w$, então $dx = (1 + w)e^w\,dw$ e $W(x) = w$.</p>
          <p>(ii) $\int W\,dx = \int w(1 + w)e^w\,dw = \int (w^2 + w)e^w\,dw$.</p>
          <p>(iii) Por partes (ou chutando $(aw^2 + bw + c)e^w$ e derivando): $\int(w^2 + w)e^w\,dw = (w^2 - w + 1)e^w$.</p>
          <p>(iv) Volte para $x$ com $e^w = x/w$:</p>${F.formula(R`\int W(x)\,dx = x\left(W - 1 + \frac1W\right) + C`)}
          <p>Teste: $\int_0^e W\,dx = e(1 - 1 + 1) - \lim_{x\to0}\frac{x}{W} = e - 1 \approx 1{,}718$ (perto de 0, $W \approx x$). Conferi numericamente: bate.</p>`)}
        <h3>Série e comportamento</h3>
        ${F.formula(R`W_0(x) = \sum_{n=1}^{\infty}\frac{(-n)^{n-1}}{n!}x^n = x - x^2 + \frac32x^3 - \frac83x^4 + \dots\qquad(|x| < 1/e)`)}
        <p>Ela sai do <b>teorema de inversão de Lagrange</b> (Cálculo 2). O raio de convergência é $1/e$: a série "enxerga" a ponta em $-1/e$, mesmo você usando $x$ positivo. Para $x$ grande: $W(x) \approx \ln x - \ln\ln x$, ou seja, cresce mais devagar que o $\ln$.</p>
        ${F.caixa("ideia", R`<p><b>Você disse que tem facilidade com a W.</b> Um teste de fogo: por que a série tem $(-n)^{n-1}$? É a mesma contagem das <b>árvores rotuladas</b> de Cayley ($n^{n-2}$ árvores com $n$ vértices). A W de Lambert é a "função geradora das árvores": combinatória escondida dentro do cálculo.</p>`)}`),

      F.secao("receita", "A receita para resolver equações", R`
        <p>Toda equação em que o $x$ aparece "dentro e fora" de uma exponencial (ou de um log) tem a mesma estratégia:</p>
        <p>(i) Isole a exponencial de um lado. (ii) Ajuste para a forma $(\text{coisa})\,e^{\text{coisa}} = \text{número}$, com a <b>mesma</b> coisa nos dois lugares. (iii) $\text{coisa} = W(\text{número})$. (iv) Se o número estiver entre $-1/e$ e $0$, use os <b>dois</b> ramos: são duas respostas.</p>
        ${exemplario}`),

      F.secao("fisica", "Onde a física usa", R`
        <h3>1. A lei de Wien</h3>
        <p>A radiação de um corpo negro tem um pico. Pela lei de Planck, a energia por frequência é proporcional a $\frac{\nu^3}{e^{h\nu/kT} - 1}$. Onde fica o máximo?</p>
        ${F.demo("o pico pela W", R`<p>(i) Com $x = h\nu/kT$, maximize $g(x) = \frac{x^3}{e^x - 1}$: $g' = 0 \iff 3x^2(e^x - 1) = x^3e^x \iff 3(e^x - 1) = xe^x$.</p>
          <p>(ii) Arrume: $(x - 3)e^x = -3$. Multiplique por $e^{-3}$: $(x - 3)\,e^{x - 3} = -3e^{-3}$.</p>
          <p>(iii) A coisa é $x - 3$: $x - 3 = W(-3e^{-3})$. O ramo $W_{-1}$ dá $x - 3 = -3$, ou seja, $x = 0$ (solução falsa, o mínimo). O ramo $W_0$ dá a resposta:</p>
          ${F.formula(R`x = 3 + W_0\!\left(-3e^{-3}\right) \approx 2{,}8214\quad\Longrightarrow\quad h\nu_\text{máx} \approx 2{,}82\,kT`)}
          <p>(iv) No comprimento de onda, a potência é $x^5$ e sai $x = 5 + W_0(-5e^{-5}) \approx 4{,}9651$, ou seja, $\lambda_\text{máx}T = \frac{hc}{4{,}9651\,k} \approx 2{,}898\times10^{-3}$ m·K (a constante de Wien).</p>`)}
        <h3>2. Circuitos com diodo</h3>
        <p>Diodo em série com resistor: a equação mistura $i$ com $e^{V/V_T}$, e a resposta exata é uma W (é o chefão desta página).</p>
        <h3>3. Torre de potências</h3>
        <p>$x^{x^{x^{\cdots}}} = h$ significa $x^h = h$, e daí $h = -\frac{W(-\ln x)}{\ln x}$. Ela só converge até $x = e^{1/e} \approx 1{,}4447$, que é exatamente quando $-\ln x$ chega em $-1/e$, a ponta da W.</p>
        ${F.caixa("ponte", R`<p>Outros lugares onde ela aparece: projétil com arrasto linear (tempo de voo), crescimento de populações, a "equação de Lambert" da relatividade (distância própria no espaço de Rindler) e o problema clássico de achar o $x$ em $2^x = x^2$ (exercício 4).</p>`)}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Sem calculadora: $W(e)$, $W(2e^2)$, $W(-1/e)$, $W(0)$ e $W(-2e^{-2})$ (os dois ramos).</p>`, fig: "", dicas: [R`<p>Procure o $w$ que, colocado em $w\,e^w$, dá o número.</p>`, R`<p>$-2e^{-2} = (-2)e^{-2}$. E ele é maior que $-1/e$?</p>`], resp: R`$1$; $2$; $-1$; $0$; $W_{-1}(-2e^{-2}) = -2$ e $W_0(-2e^{-2}) \approx -0{,}406$.`, sol: R`<p>Os quatro primeiros saem direto da definição. O último: $-2e^{-2} \approx -0{,}271 > -1/e$, então tem dois ramos. Um é óbvio: $w = -2 \leq -1$ é o $W_{-1}$. O outro, $W_0$, não é "bonito": $\approx -0{,}4064$ (laboratório).</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Resolva $x\,e^{2x} = 3$.</p>`, fig: "", dicas: [R`<p>A coisa do expoente é $2x$. Falta um 2 na frente.</p>`, R`<p>Multiplique por 2: $(2x)e^{2x} = 6$.</p>`], resp: R`$x = W(6)/2 \approx 0{,}7162$.`, sol: R`<p>$2x = W(6) \approx 1{,}4324$, então $x \approx 0{,}7162$. Conferindo: $0{,}7162\cdot e^{1{,}4324} \approx 0{,}7162\times4{,}189 \approx 3{,}00$ ✓.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Ache o $x$ com $x^x = 100$.</p>`, fig: "", dicas: [R`<p>$\ln$ dos dois lados, depois $x = e^{\ln x}$.</p>`, R`<p>$(\ln x)e^{\ln x} = \ln100$.</p>`], resp: R`$x = e^{W(\ln100)} \approx 3{,}5973$.`, sol: R`<p>$\ln x = W(4{,}6052) \approx 1{,}2802$, $x = e^{1{,}2802} \approx 3{,}5973$. Teste rápido: $3{,}6^{3,6} \approx 100{,}6$.</p>` }),
        F.exercicio({ n: 4, marcas: ["!"], enun: R`<p>Ache <b>todas</b> as soluções reais de $2^x = x^2$. (Duas você acha de cabeça. E a terceira?)</p>`, fig: "", dicas: [R`<p>Tire a raiz: $x = \pm2^{x/2} = \pm e^{(\ln2/2)x}$. Trate os dois sinais separado.</p>`, R`<p>$x\,e^{-(\ln2/2)x} = \pm1$; multiplique por $-\frac{\ln2}{2}$ para a coisa aparecer na frente.</p>`], resp: R`$x = 2$, $x = 4$ e $x \approx -0{,}7667$.`, sol: R`<p>(i) $\left(-\tfrac{\ln2}{2}x\right)e^{-\frac{\ln2}{2}x} = \mp\tfrac{\ln2}{2}$, então $x = -\frac{2}{\ln2}W\!\left(\mp\frac{\ln2}{2}\right)$.</p>
          <p>(ii) Sinal de cima, número $-\frac{\ln2}{2} \approx -0{,}347$ (entre $-1/e$ e 0, dois ramos): $W_0 = -\ln2 \Rightarrow x = 2$; $W_{-1} = -2\ln2 \Rightarrow x = 4$. A tabela da definição!</p>
          <p>(iii) Sinal de baixo, número $+\frac{\ln2}{2}$: só $W_0 \approx 0{,}2657 \Rightarrow x \approx -0{,}7667$.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Calcule $W'(e)$ e a reta tangente à $W$ em $x = e$.</p>`, fig: "", dicas: [R`<p>$W'(x) = \frac{W}{x(1 + W)}$ e $W(e) = 1$.</p>`, R`<p>Reta: $y = W(e) + W'(e)(x - e)$.</p>`], resp: R`$W'(e) = \frac{1}{2e} \approx 0{,}1839$; $y = 1 + \frac{x - e}{2e} = \frac{x}{2e} + \frac12$.`, sol: R`<p>$W'(e) = \frac{1}{e\cdot2}$. A reta passa por $(e, 1)$ com essa inclinação. Bônus: estime $W(3) \approx \frac{3}{2e} + \frac12 \approx 1{,}052$; o valor certo é $1{,}0499$.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>O Sol tem temperatura de superfície $T \approx 5772$ K. Em que comprimento de onda está o pico da luz dele? Que cor é essa?</p>`, fig: "", dicas: [R`<p>Lei de Wien: $\lambda_\text{máx}T = b$, com $b$ vindo de $5 + W_0(-5e^{-5})$.</p>`, R`<p>$b \approx 2{,}898\times10^{-3}$ m·K.</p>`], resp: R`$\lambda_\text{máx} \approx 502$ nm (verde-azulado).`, sol: R`<p>$2{,}898\times10^{-3}/5772 \approx 5{,}02\times10^{-7}$ m. O pico é verde-azulado, mas o Sol emite em todas as cores visíveis e o total parece branco. (Atenção: o pico <i>por frequência</i> fica em outra cor, porque $d\nu$ e $d\lambda$ não são proporcionais.)</p>` }),
        F.exercicio({ n: 7, marcas: ["!!"], enun: R`<p>Para que valor de $x$ a torre $x^{x^{x^{\cdots}}}$ vale 2? E para que valor ela vale 3?</p>`, fig: "", dicas: [R`<p>Se a torre vale $h$, então $x^h = h$, ou $x = h^{1/h}$.</p>`, R`<p>Uma torre convergente nunca passa de $e$ (veja a seção de física).</p>`], resp: R`Vale 2 com $x = \sqrt2$. Não existe $x$ com torre igual a 3.`, sol: R`<p>$x = 2^{1/2} = \sqrt2$. Para $h = 3$, a conta daria $x = 3^{1/3} \approx 1{,}442 < e^{1/e}$, só que, para esse $x$, a torre converge para o <i>outro</i> ponto fixo de $x^h = h$, o menor. Pela W: $h = -W_0(-\ln x)/\ln x$, que é $\approx 2{,}478$ para $x = 3^{1/3}$. O 3 viria do ramo $W_{-1}$, que é um ponto fixo instável: a torre nunca chega nele.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-w"); e.outerHTML = F.lab("W como espelho de x·eˣ, e Newton calculando", "lab-w"); SIM.lambert(document.getElementById("lab-w"), F); },
});
