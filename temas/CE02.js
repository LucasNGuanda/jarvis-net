/* CE02 · Função Gama de Euler. Números conferidos com scipy (scratchpad ce.py):
   Γ(7/2)=15√π/8=3,3234; Γ(−3/2)=4√π/3=2,3633; Γ(−1/2)=−2√π; ∫x⁴e^(−2x)=0,75; ∫e^(−x³)=Γ(4/3)=0,8930; ∫sen⁶ (0..π/2)=5π/32;
   mínimo de Γ em x=1,4616 (Γ=0,8856); Stirling 10! = 3 598 696 (−0,83%); V₅ = 8π²/15 = 5,2638 é o maior volume de bola unitária; ∫x³/(eˣ−1) = π⁴/15. */
F.registrar("CE02", {
  retoma: ["CE01"],
  html(F) {
    const R = String.raw;
    const fat = (n) => { let p = 1; for (let k = 2; k <= n; k++) p *= k; return p; };
    const exemplario = F.exemplo({
      titulo: "Integrais que viram fatorial",
      casos: [
        { nome: "∫ tⁿ e^(−at) dt", gerar: (p) => {
          const n = p ? 3 : F.escolha([2, 3, 4, 5, 6]), a = p ? 2 : F.escolha([0.5, 2, 3]), v = fat(n) / Math.pow(a, n + 1);
          return { enun: R`<p>Calcule $\displaystyle\int_0^\infty t^{${n}}e^{-${F.n(a)}t}\,dt$.</p>`, fig: "",
            passos: [
              R`<p>Para virar a gama, o expoente da exponencial precisa ser só "$-u$". Troque $u = ${F.n(a)}t$: $t = u/${F.n(a)}$ e $dt = du/${F.n(a)}$. Os limites continuam 0 e ∞.</p>`,
              R`$$\int_0^\infty \left(\frac{u}{${F.n(a)}}\right)^{${n}}e^{-u}\,\frac{du}{${F.n(a)}} = \frac{1}{${F.n(a)}^{${n + 1}}}\int_0^\infty u^{${n}}e^{-u}\,du$$`,
              R`<p>A integral que sobrou é a definição de $\Gamma(${n + 1}) = ${n}! = ${fat(n)}$.</p>`,
              R`$$\frac{${fat(n)}}{${F.n(a)}^{${n + 1}}} = ${F.n(v, 5)}$$<p>Regra geral para guardar: $\int_0^\infty t^ne^{-at}\,dt = \dfrac{n!}{a^{n+1}}$.</p>`,
            ] };
        } },
        { nome: "Γ(k + ½)", gerar: (p) => {
          const k = p ? 3 : F.escolha([1, 2, 3, 4, 5]);
          const fs = []; for (let j = k - 1; j >= 0; j--) fs.push(`\\frac{${2 * j + 1}}{2}`);
          let num = 1; for (let j = 0; j < k; j++) num *= 2 * j + 1;
          const v = (num / Math.pow(2, k)) * Math.sqrt(Math.PI);
          return { enun: R`<p>Calcule $\Gamma\!\left(${2 * k + 1}/2\right)$ exatamente.</p>`, fig: "",
            passos: [
              R`<p>Use $\Gamma(x + 1) = x\,\Gamma(x)$ descendo de meio em meio: $\Gamma\left(\frac{${2 * k + 1}}{2}\right) = \frac{${2 * k - 1}}{2}\,\Gamma\left(\frac{${2 * k - 1}}{2}\right) = \dots$</p>`,
              R`$$\Gamma\!\left(\tfrac{${2 * k + 1}}{2}\right) = ${fs.join("\\cdot")}\cdot\Gamma\!\left(\tfrac12\right)$$`,
              R`<p>Com $\Gamma(\frac12) = \sqrt\pi$:</p>$$\Gamma\!\left(\tfrac{${2 * k + 1}}{2}\right) = \frac{${num}}{${Math.pow(2, k)}}\sqrt\pi \approx ${F.n(v, 5)}$$<p>Faz sentido: fica entre $${k - 1}! = ${fat(k - 1)}$ e $${k}! = ${fat(k)}$ (são $\Gamma(${k})$ e $\Gamma(${k + 1})$).</p>`,
            ] };
        } },
        { nome: "∫ xᵐ e^(−x²) dx", gerar: (p) => {
          const m = p ? 2 : F.escolha([0, 1, 2, 3, 4, 5]), s = (m + 1) / 2, G = MAT.gama(s), v = G / 2;
          return { enun: R`<p>Calcule $\displaystyle\int_0^\infty ${m === 0 ? "" : m === 1 ? "x\\," : "x^{" + m + "}"}e^{-x^2}\,dx$.</p>`, fig: "",
            passos: [
              R`<p>Troque $t = x^2$: $x = t^{1/2}$ e $dx = \tfrac12t^{-1/2}\,dt$.</p>`,
              R`$$\int_0^\infty t^{${m}/2}e^{-t}\,\tfrac12t^{-1/2}\,dt = \frac12\int_0^\infty ${s - 1 === 0 ? "" : s - 1 === 1 ? "t\\," : "t^{" + F.n(s - 1, 1) + "}"}e^{-t}\,dt = \frac12\,\Gamma\!\left(${F.n(s, 1)}\right)$$`,
              R`<p>$\Gamma(${F.n(s, 1)}) ${Number.isInteger(s) ? `= ${s - 1}! = ${fat(s - 1)}` : `\\approx ${F.n(G, 5)}\\ \\text{(meio-inteiro: múltiplo de } \\sqrt\\pi)`}$, então a integral vale $\approx ${F.n(v, 5)}$.</p>
                <p>Este tipo aparece em toda a teoria cinética dos gases (distribuição de Maxwell–Boltzmann).</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A esfera de 5 dimensões",
      enun: R`<p>O volume de uma bola de raio $R$ em $n$ dimensões é $V_n = C_nR^n$ ($C_2 = \pi$, $C_3 = \frac43\pi$). (a) Usando $\left(\int_{-\infty}^{\infty}e^{-x^2}dx\right)^n = \pi^{n/2}$ calculado de outro jeito, prove que $C_n = \dfrac{\pi^{n/2}}{\Gamma\left(\frac n2 + 1\right)}$. (b) Em que dimensão a bola de raio 1 tem o <b>maior</b> volume? (c) O que acontece com $C_n$ quando $n \to \infty$?</p>`,
      fig: "",
      dicas: [R`<p>(a) O integrando $e^{-(x_1^2 + \dots + x_n^2)} = e^{-r^2}$ só depende do raio. Fatie o espaço em cascas de raio $r$ e espessura $dr$: o volume da casca é $\frac{dV}{dr}dr = nC_nr^{n-1}dr$.</p>`, R`<p>(b) Compare $C_{n+2}/C_n$. Ou calcule a tabela.</p>`],
      sol: R`<p><b>(a)</b> (i) Em cascas: $\pi^{n/2} = \int_0^\infty e^{-r^2}\,nC_nr^{n-1}\,dr$. (ii) Com $t = r^2$: $\int_0^\infty e^{-r^2}r^{n-1}dr = \frac12\Gamma\left(\frac n2\right)$. (iii) Então $\pi^{n/2} = \frac n2C_n\Gamma\left(\frac n2\right) = C_n\Gamma\left(\frac n2 + 1\right)$ ∎. Teste: $n = 3$: $\pi^{3/2}/\Gamma(5/2) = \pi^{3/2}/(\frac34\sqrt\pi) = \frac43\pi$ ✓.</p>
        <p><b>(b)</b> $C_{n+2}/C_n = \frac{\pi}{n/2 + 1} = \frac{2\pi}{n + 2}$, que é $> 1$ enquanto $n + 2 < 2\pi \approx 6{,}28$. Tabela: $C_1 = 2$, $C_2 = 3{,}142$, $C_3 = 4{,}189$, $C_4 = 4{,}935$, $C_5 = 5{,}264$, $C_6 = 5{,}168$, $C_7 = 4{,}725$. O máximo é em <b>$n = 5$</b>, $C_5 = \frac{8\pi^2}{15} \approx 5{,}264$. (Tratando $n$ como real, o máximo exato fica em $n \approx 5{,}257$.)</p>
        <p><b>(c)</b> $\Gamma$ cresce mais rápido que qualquer exponencial, então $C_n \to 0$ ($C_{20} \approx 0{,}026$). Em dimensão alta, quase todo o volume do cubo $[-1, 1]^n$ fica nos "cantos", fora da bola. Isso é a "maldição da dimensionalidade", e na física estatística é por isso que quase todas as moléculas de um gás têm energia perto da média.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Funções especiais · 2</div>
        <div class="q">Quanto vale $\left(\tfrac12\right)!$?</div>
        <p>Fatorial é "$1\times2\times\dots\times n$": só faz sentido para inteiros. Mesmo assim, a resposta tem um valor exato e famoso: $\frac{\sqrt\pi}{2}$. O $\pi$ aparece do nada num problema que não tem círculo nenhum. Euler descobriu como em 1729.</p></div>`),

      F.secao("definicao", "A definição", R`
        ${F.formula(R`\Gamma(x) = \int_0^\infty t^{x-1}e^{-t}\,dt\qquad(x > 0)`, "Gama de Euler")}
        <p>Para cada $x$, a integral é a área embaixo de $t^{x-1}e^{-t}$. A potência $t^{x-1}$ cresce, a exponencial $e^{-t}$ mata; a área é finita para qualquer $x > 0$.</p>
        ${F.demo("Γ(1) = 1 e Γ(x+1) = x Γ(x)", R`<p>(i) $\Gamma(1) = \int_0^\infty e^{-t}\,dt = \left[-e^{-t}\right]_0^\infty = 0 - (-1) = 1$.</p>
          <p>(ii) Por partes, com $u = t^x$ e $dv = e^{-t}dt$: $\Gamma(x+1) = \int_0^\infty t^xe^{-t}\,dt = \left[-t^xe^{-t}\right]_0^\infty + x\int_0^\infty t^{x-1}e^{-t}\,dt$.</p>
          <p>(iii) O colchete é zero nas duas pontas (em 0 por causa do $t^x$; no infinito a exponencial vence a potência). Sobra:</p>
          ${F.formula(R`\Gamma(x+1) = x\,\Gamma(x)`)}
          <p>(iv) Daí $\Gamma(2) = 1$, $\Gamma(3) = 2\cdot1$, $\Gamma(4) = 3\cdot2\cdot1$, ou seja, $\Gamma(n+1) = n!$. A gama é o fatorial "deslocado de 1" (a convenção é chata, mas é histórica).</p>`)}
        ${F.caixa("ponte", R`<p><b>A sua função gam fresco ${F.ret("X01")} fez o mesmo movimento:</b> pegar algo definido só para inteiros e achar uma fórmula que aceita quebrados. Lá a soma $1 + \dots + n$ tinha fórmula curta. Aqui o produto não tem, e por isso o Euler precisou de uma integral.</p>`)}`),

      F.secao("lab", "Laboratório", R`<p>Arraste o $x$. Compare o valor da curva com a área pintada (calculada na hora, por soma numérica). Leve o $x$ para valores negativos e veja os polos.</p><div id="lab-g"></div>`),

      F.secao("meio", "O meio fatorial: Γ(½) = √π", R`
        ${F.demo("a integral de Gauss pelo truque das coordenadas polares", R`<p>(i) Troque $t = u^2$ em $\Gamma(\frac12) = \int_0^\infty t^{-1/2}e^{-t}\,dt$: $dt = 2u\,du$ e $t^{-1/2} = 1/u$, então $\Gamma(\frac12) = 2\int_0^\infty e^{-u^2}du = \int_{-\infty}^{\infty}e^{-u^2}du = I$.</p>
          <p>(ii) Ninguém sabe a primitiva de $e^{-u^2}$. O truque: calcular $I^2$ como integral dupla no plano:</p>
          $$I^2 = \int_{-\infty}^{\infty}e^{-x^2}dx\int_{-\infty}^{\infty}e^{-y^2}dy = \iint_{\mathbb R^2}e^{-(x^2+y^2)}\,dx\,dy$$
          <p>(iii) Em polares, $x^2 + y^2 = r^2$ e $dx\,dy = r\,dr\,d\theta$. Apareceu um $r$ que salva tudo, porque $r\,e^{-r^2}$ <i>tem</i> primitiva:</p>
          $$I^2 = \int_0^{2\pi}\!\!\int_0^\infty e^{-r^2}r\,dr\,d\theta = 2\pi\cdot\left[-\tfrac12e^{-r^2}\right]_0^\infty = 2\pi\cdot\tfrac12 = \pi$$
          <p>(iv) Logo $I = \sqrt\pi$ e $\Gamma(\frac12) = \sqrt\pi$. Pela recorrência, $\left(\frac12\right)! = \Gamma(\frac32) = \frac12\sqrt\pi \approx 0{,}8862$. É daí que vem o $\pi$: da simetria circular de $e^{-(x^2+y^2)}$.</p>`)}
        <table class="tb"><tr><th>x</th><th>Γ(x)</th><th>valor</th></tr><tr><td>½</td><td>$\sqrt\pi$</td><td>1,7725</td></tr><tr><td>3/2</td><td>$\frac12\sqrt\pi$</td><td>0,8862</td></tr><tr><td>5/2</td><td>$\frac34\sqrt\pi$</td><td>1,3293</td></tr><tr><td>7/2</td><td>$\frac{15}{8}\sqrt\pi$</td><td>3,3234</td></tr><tr><td>1,4616…</td><td>mínimo para $x > 0$</td><td>0,8856</td></tr></table>`),

      F.secao("negativos", "Números negativos e os polos", R`
        <p>A integral só converge para $x > 0$. Mas a recorrência ao contrário, $\Gamma(x) = \frac{\Gamma(x + 1)}{x}$, define a gama para negativos: $\Gamma(-\frac12) = \frac{\Gamma(\frac12)}{-1/2} = -2\sqrt\pi$.</p>
        <p>Em $x = 0$: $\Gamma(0) = \Gamma(1)/0$, divisão por zero. O mesmo em $-1, -2, -3, \dots$: são os <b>polos</b>, onde a função vai a $\pm\infty$ (as linhas vermelhas do laboratório). Entre dois polos, o sinal alterna.</p>
        ${F.formula(R`\Gamma(x)\,\Gamma(1 - x) = \frac{\pi}{\operatorname{sen}(\pi x)}`, "Fórmula de reflexão (Euler)")}
        <p>Teste com $x = \frac12$: $\Gamma(\frac12)^2 = \pi/\operatorname{sen}(\pi/2) = \pi$ ✓, outra prova de $\Gamma(\frac12) = \sqrt\pi$. Os zeros do seno são exatamente os polos.</p>
        ${F.caixa("fisico", R`<p><b>Por que essa extensão e não outra?</b> Infinitas curvas passam pelos fatoriais. O <b>teorema de Bohr–Mollerup</b> (1922) diz que a gama é a <i>única</i> com $\Gamma(1) = 1$, $\Gamma(x+1) = x\Gamma(x)$ e $\ln\Gamma$ convexa. Na página do gam fresco tem a mesma pergunta para a sua função.</p>`)}`),

      F.secao("stirling", "Stirling: o fatorial de números enormes", R`
        ${F.formula(R`n! \approx \sqrt{2\pi n}\left(\frac ne\right)^n`, "Fórmula de Stirling")}
        ${F.demo("de onde sai (método de Laplace)", R`<p>(i) $n! = \int_0^\infty t^ne^{-t}\,dt = \int_0^\infty e^{f(t)}dt$, com $f(t) = n\ln t - t$.</p>
          <p>(ii) $f'(t) = n/t - 1 = 0$ em $t = n$: o integrando tem um pico enorme e estreito ali. Perto do pico, Taylor até 2ª ordem: $f(t) \approx n\ln n - n - \frac{(t - n)^2}{2n}$ (porque $f''(n) = -1/n$).</p>
          <p>(iii) $n! \approx n^ne^{-n}\int_{-\infty}^{\infty}e^{-(t-n)^2/2n}\,dt = n^ne^{-n}\sqrt{2\pi n}$, usando a integral de Gauss com largura $\sqrt{2n}$ ∎.</p>`)}
        <table class="tb"><tr><th>n</th><th>n!</th><th>Stirling</th><th>erro</th></tr><tr><td>1</td><td>1</td><td>0,922</td><td>−7,8%</td></tr><tr><td>5</td><td>120</td><td>118,0</td><td>−1,7%</td></tr><tr><td>10</td><td>3 628 800</td><td>3 598 696</td><td>−0,83%</td></tr><tr><td>100</td><td>$9{,}33\times10^{157}$</td><td>$9{,}32\times10^{157}$</td><td>−0,08%</td></tr></table>
        <p>O erro relativo cai como $\frac{1}{12n}$. Na termodinâmica estatística, $n \sim 10^{23}$: aí Stirling é exata para todos os efeitos, e é ela que transforma contagem de estados em entropia ($\ln n! \approx n\ln n - n$).</p>`),

      F.secao("fisica", "Onde a física usa", R`
        <h3>1. Gases: velocidade média das moléculas</h3>
        <p>Na distribuição de Maxwell–Boltzmann, a chance de uma molécula ter velocidade $v$ é proporcional a $v^2e^{-av^2}$, com $a = \frac{m}{2kT}$. Médias viram razões de integrais do tipo do exemplário:</p>
        $$\langle v\rangle = \frac{\int_0^\infty v^3e^{-av^2}dv}{\int_0^\infty v^2e^{-av^2}dv} = \frac{\frac12\Gamma(2)\,a^{-2}}{\frac12\Gamma(\frac32)\,a^{-3/2}} = \frac{2}{\sqrt{\pi a}} = \sqrt{\frac{8kT}{\pi m}}$$
        <h3>2. Radiação de corpo negro: Stefan–Boltzmann</h3>
        <p>A energia total irradiada leva a $\int_0^\infty\frac{x^3}{e^x - 1}dx = \Gamma(4)\,\zeta(4) = 6\cdot\frac{\pi^4}{90} = \frac{\pi^4}{15} \approx 6{,}494$ (conferi numericamente). É desse $\pi^4/15$ que vem a constante $\sigma$ de $P = \sigma AT^4$. A lei de Wien, o pico do mesmo espectro, sai da W ${F.ret("CE01")}.</p>
        <h3>3. Integrais trigonométricas: a função Beta</h3>
        ${F.formula(R`B(a, b) = \frac{\Gamma(a)\Gamma(b)}{\Gamma(a + b)} = 2\int_0^{\pi/2}\operatorname{sen}^{2a-1}\theta\,\cos^{2b-1}\theta\,d\theta`)}
        <p>Com ela, $\int_0^{\pi/2}\operatorname{sen}^m\theta\cos^n\theta\,d\theta$ vira conta de gamas, sem nenhuma integração por partes.</p>`),

      F.secao("exemplos", "Exemplos", exemplario),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $\Gamma(5)$, $\Gamma(1)$ e $\dfrac{\Gamma(6)}{\Gamma(4)}$.</p>`, fig: "", dicas: [R`<p>$\Gamma(n) = (n-1)!$.</p>`, R`<p>Na razão, use a recorrência duas vezes.</p>`], resp: R`$24$; $1$; $20$.`, sol: R`<p>$\Gamma(5) = 4! = 24$. $\Gamma(6)/\Gamma(4) = 5\cdot4 = 20$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule $\Gamma\left(\frac72\right)$ exatamente.</p>`, fig: "", dicas: [R`<p>Desça: $\frac72 \to \frac52 \to \frac32 \to \frac12$.</p>`, R`<p>$\Gamma(\frac12) = \sqrt\pi$.</p>`], resp: R`$\frac{15}{8}\sqrt\pi \approx 3{,}3234$.`, sol: R`<p>$\frac52\cdot\frac32\cdot\frac12\cdot\sqrt\pi = \frac{15}{8}\sqrt\pi$.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Calcule $\displaystyle\int_0^\infty x^4e^{-2x}\,dx$ sem integrar por partes.</p>`, fig: "", dicas: [R`<p>Troque $u = 2x$.</p>`, R`<p>$\int_0^\infty t^ne^{-at}dt = n!/a^{n+1}$.</p>`], resp: R`$\frac{24}{32} = 0{,}75$.`, sol: R`<p>$4!/2^5 = 24/32 = 3/4$. Por partes, seriam quatro rodadas.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Calcule $\Gamma\left(-\frac12\right)$ e $\Gamma\left(-\frac32\right)$. Qual dos dois é positivo? Confira no laboratório.</p>`, fig: "", dicas: [R`<p>$\Gamma(x) = \Gamma(x+1)/x$.</p>`, R`<p>$\Gamma(-\frac32) = \Gamma(-\frac12)/(-\frac32)$.</p>`], resp: R`$\Gamma(-\frac12) = -2\sqrt\pi \approx -3{,}545$; $\Gamma(-\frac32) = \frac43\sqrt\pi \approx 2{,}363$ (positivo).`, sol: R`<p>$\sqrt\pi/(-\frac12) = -2\sqrt\pi$; depois $(-2\sqrt\pi)/(-\frac32) = \frac43\sqrt\pi$. Entre $-1$ e $0$ a gama é negativa; entre $-2$ e $-1$, positiva: o sinal alterna a cada polo.</p>` }),
        F.exercicio({ n: 5, marcas: ["!"], enun: R`<p>Calcule $\displaystyle\int_0^\infty e^{-x^3}\,dx$.</p>`, fig: "", dicas: [R`<p>Troque $t = x^3$.</p>`, R`<p>Vai sobrar $\frac13\Gamma(\frac13)$. Use a recorrência para escrever como $\Gamma(\frac43)$.</p>`], resp: R`$\Gamma\left(\frac43\right) \approx 0{,}8930$.`, sol: R`<p>$x = t^{1/3}$, $dx = \frac13t^{-2/3}dt$: $\frac13\int_0^\infty t^{-2/3}e^{-t}dt = \frac13\Gamma(\frac13) = \Gamma(\frac43)$. Generalizando: $\int_0^\infty e^{-x^p}dx = \Gamma(1 + \frac1p)$. Com $p = 2$, dá $\frac{\sqrt\pi}{2}$ (Gauss); com $p \to \infty$, dá 1 (a área de um quadrado de lado 1).</p>` }),
        F.exercicio({ n: 6, enun: R`<p>Use Stirling para estimar $10!$ e diga o erro. Depois estime quantos dígitos tem $100!$.</p>`, fig: "", dicas: [R`<p>$\sqrt{20\pi}\,(10/e)^{10}$.</p>`, R`<p>Dígitos de $N$: $\lfloor\log_{10}N\rfloor + 1$. Use $\ln n! \approx n\ln n - n + \frac12\ln(2\pi n)$ e divida por $\ln10$.</p>`], resp: R`$10! \approx 3\,598\,696$ (erro $-0{,}83\%$); $100!$ tem 158 dígitos.`, sol: R`<p>$\ln100! \approx 460{,}52 - 100 + 3{,}22 = 363{,}74$; $\div\ln10 = 157{,}97$, então $100! \approx 9{,}3\times10^{157}$: 158 dígitos.</p>` }),
        F.exercicio({ n: 7, marcas: ["!!"], enun: R`<p>Calcule $\displaystyle\int_0^{\pi/2}\operatorname{sen}^6\theta\,d\theta$ com a função Beta.</p>`, fig: "", dicas: [R`<p>$2a - 1 = 6$ e $2b - 1 = 0$.</p>`, R`<p>$a = \frac72$, $b = \frac12$; a integral vale $\frac12B(a, b)$.</p>`], resp: R`$\frac{5\pi}{32} \approx 0{,}4909$.`, sol: R`<p>$\frac12\cdot\frac{\Gamma(\frac72)\Gamma(\frac12)}{\Gamma(4)} = \frac12\cdot\frac{\frac{15}{8}\sqrt\pi\cdot\sqrt\pi}{6} = \frac{15\pi}{96} = \frac{5\pi}{32}$. Conferi numericamente.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-g"); e.outerHTML = F.lab("Γ(x): a curva e a área", "lab-g"); SIM.gama(document.getElementById("lab-g"), F); },
});
