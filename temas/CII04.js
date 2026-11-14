/* CII04 · Séries de potências e de Taylor. Conferido com sympy (scratchpad ci2.py):
   e^(−x²) = 1 − x² + x⁴/2 − x⁶/6 + …; ∫₀¹e^(−x²) com 4 termos = 0,74286 (exato 0,74682); K relativística = ½mv² + (3/8)mv⁴/c² + …;
   a 0,1c a clássica erra 0,75%; e − Σ_{k≤9} 1/k! = 3,0×10⁻⁷; Machin com 5 + 1 termos: erro 6,9×10⁻⁸; √1,1 ≈ 1,04875 (exato 1,048809). */
F.registrar("CII04", {
  retoma: ["CII03", "CI03"],
  html(F) {
    const R = String.raw;
    const fat = (n) => { let p = 1; for (let i = 2; i <= n; i++) p *= i; return p; };
    const exemplario = F.exemplo({
      titulo: "Taylor na prática",
      casos: [
        { nome: "Estimar eˣ", gerar: (p) => {
          const x = p ? 0.5 : F.escolha([0.1, 0.2, 0.5, 1, -0.5]), N = p ? 4 : F.escolha([2, 3, 4, 5]);
          const termos = Array.from({ length: N + 1 }, (_, k) => x ** k / fat(k)), S = termos.reduce((a, b) => a + b, 0);
          return { enun: R`<p>Estime $${x === 1 ? "e" : "e^{" + F.n(x) + "}"}$ com o polinômio de Taylor de grau ${N} em torno de 0. Qual o erro?</p>`, fig: "",
            passos: [
              R`<p>$e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \dots$ (todas as derivadas de $e^x$ valem 1 em $x = 0$).</p>`,
              R`<p>Termos com $x = ${F.n(x)}$: $${termos.map((t) => F.n(t, 6)).join(" + ").replace(/\+ -/g, "- ")}$.</p>`,
              R`<p>Soma: $${F.n(S, 6)}$. Valor real: $${x === 1 ? "e" : "e^{" + F.n(x) + "}"} = ${F.n(Math.exp(x), 6)}$. Erro: $${F.n(Math.abs(Math.exp(x) - S), 6)}$.</p>`,
              R`<p>O erro é mais ou menos o primeiro termo que você jogou fora, $\frac{|x|^{${N + 1}}}{${N + 1}!} \approx ${F.n(Math.abs(x) ** (N + 1) / fat(N + 1), 6)}$. Com $|x|$ pequeno, poucos termos bastam.</p>`,
            ] };
        } },
        { nome: "Binômio: √(1 + x)", gerar: (p) => {
          const x = p ? 0.1 : F.escolha([0.04, 0.1, 0.2, -0.1]);
          const a1 = 1 + x / 2, a2 = a1 - (x * x) / 8;
          return { enun: R`<p>Estime $\sqrt{${F.n(1 + x, 2)}}$ com a série binomial até o termo de 2º grau.</p>`, fig: "",
            passos: [
              R`<p>Binomial: $(1 + x)^\alpha = 1 + \alpha x + \frac{\alpha(\alpha-1)}{2}x^2 + \dots$ Com $\alpha = \frac12$: $\sqrt{1 + x} = 1 + \frac x2 - \frac{x^2}{8} + \dots$</p>`,
              R`<p>Com $x = ${F.n(x, 2)}$: 1º grau dá $${F.n(a1, 5)}$; com o termo de 2º grau, $${F.n(a2, 6)}$.</p>`,
              R`<p>Valor real: $${F.n(Math.sqrt(1 + x), 6)}$. Na física, quase sempre só o 1º grau já basta: "$\sqrt{1 + x} \approx 1 + \frac x2$ para $x$ pequeno".</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Calcular π à mão (Machin, 1706)",
      enun: R`<p>(a) A partir de $\frac{1}{1 + t^2} = 1 - t^2 + t^4 - \dots$, ache a série de $\arctan x$. (b) Por que $\frac\pi4 = \arctan1 = 1 - \frac13 + \frac15 - \dots$ (Leibniz) é péssima para calcular $\pi$? (c) Use a fórmula de Machin, $\frac\pi4 = 4\arctan\frac15 - \arctan\frac1{239}$, e diga quantos termos de cada arco-tangente bastam para $\pi$ com 6 casas decimais certas.</p>`,
      fig: "",
      dicas: [R`<p>(a) Integre termo a termo de 0 a $x$.</p>`, R`<p>(c) Numa série alternada decrescente, o erro é menor que o primeiro termo desprezado. Com $x = \frac15$, os termos caem como $25^{-n}$.</p>`],
      sol: R`<p><b>(a)</b> $\arctan x = \int_0^x\frac{dt}{1 + t^2} = x - \frac{x^3}{3} + \frac{x^5}{5} - \dots$ (para $|x| \leq 1$).</p>
        <p><b>(b)</b> Com $x = 1$, o erro depois de $N$ termos é da ordem de $\frac{1}{2N}$: para 6 casas, seria preciso uns 2 milhões de termos (e 1000 termos dão só 3,140…).</p>
        <p><b>(c)</b> Pelo critério do 1º termo desprezado: com 5 termos de $\arctan\frac15$, o erro em $\pi$ é $< 16\cdot\frac{(1/5)^{11}}{11} \approx 3\times10^{-8}$; com 1 termo de $\arctan\frac{1}{239}$, $< 4\cdot\frac{(1/239)^3}{3} \approx 10^{-7}$. Somando, $< 1{,}3\times10^{-7}$: bastam <b>5 + 1 termos</b>. De fato, $4\left(4S_5 - S_1\right) = 3{,}14159258\ldots$, erro $6{,}9\times10^{-8}$ (conferi). Com 4 + 1 termos, o erro seria $\approx 10^{-6}$, e a 6ª casa já sairia errada.</p>
        <p class="det" style="color:var(--ink2)">John Machin calculou 100 casas de $\pi$ à mão em 1706 com essa fórmula. Variações dela foram usadas em computadores até os anos 1970.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 2 · 4</div>
        <div class="q">Como a calculadora sabe quanto vale $\operatorname{sen}(0{,}3)$?</div>
        <p>Ela não tem tabela: ela soma um polinômio. Toda função "boa" é, perto de um ponto, um polinômio infinito, a <b>série de Taylor</b>. É a ferramenta mais usada da física teórica: todo "para ângulos pequenos", "para $v \ll c$", "longe do dipolo" é Taylor cortado no primeiro termo que interessa.</p></div>`),

      F.secao("potencias", "Séries de potências", R`
        ${F.formula(R`\sum_{n=0}^{\infty}c_n(x - a)^n = c_0 + c_1(x - a) + c_2(x - a)^2 + \dots`)}
        <p>Para cada $x$, é uma série numérica ${F.ret("CII03")}. Ela converge num intervalo em volta de $a$, de <b>raio de convergência</b> $R$ (converge para $|x - a| < R$, diverge para $|x - a| > R$; nas pontas, depende). Pelo teste da razão: $R = \lim\left|\frac{c_n}{c_{n+1}}\right|$.</p>
        <p>A série geométrica é o protótipo: $\frac{1}{1 - x} = 1 + x + x^2 + \dots$, com $R = 1$. Dentro do raio, séries de potências se comportam como polinômios: dá para derivar e integrar termo a termo. Integrando $\frac{1}{1 + t} = 1 - t + t^2 - \dots$ de 0 a $x$: $\ln(1 + x) = x - \frac{x^2}2 + \frac{x^3}3 - \dots$ (e com $x = 1$, a alternada da CII03 dá $\ln2$).</p>`),

      F.secao("taylor", "A fórmula de Taylor", R`
        ${F.formula(R`f(x) = \sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}(x - a)^n = f(a) + f'(a)(x - a) + \frac{f''(a)}{2}(x - a)^2 + \dots`, "Série de Taylor (em a = 0: Maclaurin)")}
        ${F.demo("de onde vêm os coeficientes", R`<p>(i) Suponha $f(x) = c_0 + c_1x + c_2x^2 + c_3x^3 + \dots$ (em torno de 0).</p>
          <p>(ii) Em $x = 0$: $f(0) = c_0$. Derive: $f'(x) = c_1 + 2c_2x + 3c_3x^2 + \dots$, e $f'(0) = c_1$.</p>
          <p>(iii) De novo: $f''(0) = 2c_2$; e $f'''(0) = 3\cdot2\,c_3$. Em geral, $f^{(n)}(0) = n!\,c_n$.</p>
          <p>(iv) Então $c_n = \frac{f^{(n)}(0)}{n!}$ ∎. O polinômio de grau $n$ é o único que tem, em $x = 0$, o mesmo valor e as mesmas $n$ primeiras derivadas que $f$: "a mesma altura, a mesma inclinação, a mesma curvatura…".</p>`)}
        <table class="tb"><tr><th>função</th><th>série de Maclaurin</th><th>raio</th></tr>
          <tr><td>$e^x$</td><td>$1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \dots$</td><td>$\infty$</td></tr>
          <tr><td>$\operatorname{sen}x$</td><td>$x - \frac{x^3}{3!} + \frac{x^5}{5!} - \dots$</td><td>$\infty$</td></tr>
          <tr><td>$\cos x$</td><td>$1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \dots$</td><td>$\infty$</td></tr>
          <tr><td>$\ln(1 + x)$</td><td>$x - \frac{x^2}{2} + \frac{x^3}{3} - \dots$</td><td>$1$</td></tr>
          <tr><td>$(1 + x)^\alpha$</td><td>$1 + \alpha x + \frac{\alpha(\alpha - 1)}{2!}x^2 + \dots$</td><td>$1$ (se $\alpha$ não for natural)</td></tr>
          <tr><td>$\arctan x$</td><td>$x - \frac{x^3}{3} + \frac{x^5}{5} - \dots$</td><td>$1$</td></tr></table>
        <div id="lab-tay"></div>
        ${F.caixa("ideia", R`<p><b>Por que $\frac{1}{1 + x^2}$ tem raio 1</b>, se o gráfico é liso em toda a reta? Porque o raio "enxerga" os números complexos: o denominador zera em $x = \pm i$, que estão a distância 1 da origem. A série não pode passar desse círculo. É a mesma razão de a série da W de Lambert ter raio $\frac1e$ ${F.ret("CE01")}.</p>`)}
        <p><b>Resto de Lagrange:</b> o erro do polinômio de grau $n$ é $\frac{f^{(n+1)}(\xi)}{(n+1)!}(x - a)^{n+1}$ para algum $\xi$ entre $a$ e $x$. Na prática: o erro é do tamanho do primeiro termo desprezado.</p>`),

      F.secao("euler", "A fórmula de Euler", R`
        ${F.demo("e^(iθ) = cos θ + i sen θ", R`<p>(i) Ponha $x = i\theta$ na série de $e^x$, lembrando $i^2 = -1$, $i^3 = -i$, $i^4 = 1$: $e^{i\theta} = 1 + i\theta - \frac{\theta^2}{2!} - i\frac{\theta^3}{3!} + \frac{\theta^4}{4!} + \dots$</p>
          <p>(ii) Separe os termos reais e os com $i$: $\left(1 - \frac{\theta^2}{2!} + \frac{\theta^4}{4!} - \dots\right) + i\left(\theta - \frac{\theta^3}{3!} + \dots\right)$.</p>
          <p>(iii) São as séries do cosseno e do seno:</p>${F.formula(R`e^{i\theta} = \cos\theta + i\operatorname{sen}\theta\qquad\Longrightarrow\qquad e^{i\pi} + 1 = 0`)}`)}
        <p>É essa fórmula que diz quanto vale o seu gam fresco nos negativos quebrados: $(-1)^b = e^{i\pi b}$ ${F.ret("X01")}. Na física, ela transforma oscilações em exponenciais: circuitos de corrente alternada com fasores ${F.ret("C15c")}, ondas, toda a mecânica quântica.</p>`),

      F.secao("fisica", "Taylor na física", R`
        ${F.demo("a energia cinética de Newton vem de Einstein", R`<p>(i) Relatividade: $K = mc^2(\gamma - 1)$, com $\gamma = \left(1 - \frac{v^2}{c^2}\right)^{-1/2}$.</p>
          <p>(ii) Binomial com $\alpha = -\frac12$ e $x = -\frac{v^2}{c^2}$: $\gamma = 1 + \frac12\frac{v^2}{c^2} + \frac38\frac{v^4}{c^4} + \dots$</p>
          <p>(iii) $K = \frac12mv^2 + \frac38m\frac{v^4}{c^2} + \dots$ O primeiro termo é a fórmula da escola; o segundo é a primeira correção relativística. A $0{,}1c$, a fórmula clássica erra só 0,75%.</p>`)}
        <ul><li><b>Pêndulo</b>: $\operatorname{sen}\theta \approx \theta - \frac{\theta^3}{6}$; o termo cúbico dá a correção do período $T \approx T_0\left(1 + \frac{\theta_0^2}{16}\right)$ do seu experimento ${F.ret("EP01")}.</li>
          <li><b>Pequenas oscilações</b>: perto de um mínimo, $U(x) \approx U(x_0) + \frac12U''(x_0)(x - x_0)^2$: toda energia potencial vira uma mola ${F.ret("CI05")}.</li>
          <li><b>Gravidade perto do chão</b>: $\frac{GMm}{(R + h)^2} \approx \frac{GMm}{R^2}\left(1 - \frac{2h}{R}\right)$: o "$g$ constante" é o termo de ordem zero.</li>
          <li><b>Dipolo</b>: o campo de duas cargas opostas, visto de longe, é o 1º termo não nulo de Taylor em $\frac dr$: cai como $\frac1{r^3}$ ${F.ret("C03")}.</li></ul>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Escreva a série de Maclaurin de $e^{-x^2}$ até $x^6$, substituindo na de $e^u$.</p>`, fig: "", dicas: [R`<p>$u = -x^2$.</p>`, R`<p>$\frac{u^2}{2} = \frac{x^4}{2}$, $\frac{u^3}{6} = -\frac{x^6}{6}$.</p>`], resp: R`$1 - x^2 + \frac{x^4}{2} - \frac{x^6}{6} + \dots$`, sol: R`<p>Substituir numa série conhecida é muito mais rápido que derivar seis vezes.</p>` }),
        F.exercicio({ n: 2, marcas: ["!"], enun: R`<p>A integral $\int_0^1e^{-x^2}dx$ não tem primitiva elementar. Calcule-a integrando a série do exercício 1 (4 termos). Compare com o valor real, $0{,}746824$.</p>`, fig: "", dicas: [R`<p>$\int_0^1x^{2k}dx = \frac{1}{2k + 1}$.</p>`, R`<p>$1 - \frac13 + \frac1{10} - \frac1{42}$.</p>`], resp: R`$\approx 0{,}74286$ (erro $\approx 0{,}004$).`, sol: R`<p>O próximo termo seria $+\frac{1}{216} \approx 0{,}0046$, o tamanho do erro. Com mais termos, chega a qualquer precisão: é assim que se tabela a função erro da estatística.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Calcule $\displaystyle\lim_{x\to0}\frac{\operatorname{sen}x - x}{x^3}$ e $\displaystyle\lim_{x\to0}\frac{e^x - 1 - x}{x^2}$ usando séries.</p>`, fig: "", dicas: [R`<p>$\operatorname{sen}x - x = -\frac{x^3}{6} + \dots$</p>`, R`<p>$e^x - 1 - x = \frac{x^2}{2} + \dots$</p>`], resp: R`$-\frac16$ e $\frac12$.`, sol: R`<p>Mais rápido que L'Hôpital ${F.ret("CI05")}: as séries mostram de uma vez qual termo sobrevive.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Ache o raio de convergência de $\sum\frac{x^n}{n}$, $\sum\frac{x^n}{n!}$ e $\sum n!\,x^n$.</p>`, fig: "", dicas: [R`<p>$R = \lim\left|\frac{c_n}{c_{n+1}}\right|$.</p>`, R`<p>No último, $\frac{n!}{(n+1)!} \to 0$.</p>`], resp: R`$1$, $\infty$ e $0$.`, sol: R`<p>O último só converge em $x = 0$: uma série de potências inútil, porque os coeficientes crescem rápido demais.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Quantos termos da série $e = \sum\frac1{k!}$ você precisa para errar menos que $10^{-6}$?</p>`, fig: "", dicas: [R`<p>O erro depois de parar em $k = N$ é pouco mais que $\frac{1}{(N+1)!}$.</p>`, R`<p>$\frac1{10!} \approx 2{,}8\times10^{-7}$.</p>`], resp: R`10 termos ($k = 0$ a $9$): erro $\approx 3\times10^{-7}$.`, sol: R`<p>Com $k$ até 8 o erro é $3{,}1\times10^{-6}$ (não basta); até 9, $3{,}0\times10^{-7}$. Conferi numericamente. Convergência rápida porque $k!$ cresce rápido.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Um elétron tem $v = 0{,}1c$. De quanto (em porcentagem) a energia cinética clássica $\frac12mv^2$ difere da relativística?</p>`, fig: "", dicas: [R`<p>$\frac{K - K_\text{cl}}{K} \approx \frac{\frac38v^4/c^2}{\frac12v^2} = \frac34\frac{v^2}{c^2}$.</p>`, R`<p>$\frac34\times0{,}01$.</p>`], resp: R`$\approx 0{,}75\%$.`, sol: R`<p>Pela fórmula exata: $\gamma - 1 = 0{,}0050378$ contra $\frac12(0{,}1)^2 = 0{,}005$, diferença de 0,75%. A $0{,}5c$ já seriam uns 19%: aí não dá para usar Newton.</p>` }),
        F.exercicio({ n: 7, marcas: ["!!"], enun: R`<p>Usando $e^{i\theta} = \cos\theta + i\operatorname{sen}\theta$, deduza as fórmulas de $\cos(a + b)$ e $\operatorname{sen}(a + b)$ a partir de $e^{i(a+b)} = e^{ia}e^{ib}$.</p>`, fig: "", dicas: [R`<p>Multiplique $(\cos a + i\operatorname{sen}a)(\cos b + i\operatorname{sen}b)$.</p>`, R`<p>Compare a parte real e a parte imaginária com $\cos(a+b) + i\operatorname{sen}(a+b)$.</p>`], resp: R`$\cos(a+b) = \cos a\cos b - \operatorname{sen}a\operatorname{sen}b$; $\operatorname{sen}(a+b) = \operatorname{sen}a\cos b + \cos a\operatorname{sen}b$.`, sol: R`<p>O produto dá $(\cos a\cos b - \operatorname{sen}a\operatorname{sen}b) + i(\operatorname{sen}a\cos b + \cos a\operatorname{sen}b)$. Nunca mais precisa decorar: as fórmulas de adição são só a regra $e^{x+y} = e^xe^y$.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-tay"); e.outerHTML = F.lab("Polinômios de Taylor abraçando a função", "lab-tay"); SIM.taylor(document.getElementById("lab-tay"), F); },
});
