/* CI09 · Aplicações da integral: áreas, volumes, trabalho. Conferido em Python (scratchpad ci2.py):
   área entre x² e 2x = 4/3; mola k = 200: 1 J e 3 J; v_esc Terra = 11,19 km/s; represa 10 m × 20 m: 9,8 MN;
   hemisfério R = 1 m: W = ρgπR⁴/4 = 7697 J; paraboloide = 8π; CM da barra λ ∝ x: 2L/3; arco de x^(3/2) de 0 a 4: 9,0734. */
F.registrar("matematica/CI09", {
  retoma: ["CI07", "CI08"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Aplicações passo a passo",
      casos: [
        { nome: "Área entre curvas", gerar: (p) => {
          const c = p ? 2 : F.escolha([1, 2, 3, 4]), A = c ** 3 / 6;
          return { enun: R`<p>Ache a área entre $y = x^2$ e $y = ${c === 1 ? "" : c}x$.</p>`, fig: "",
            passos: [
              R`<p>Onde se cruzam: $x^2 = ${F.c(c)}x \Rightarrow x = 0$ ou $x = ${c}$. Entre elas, quem está em cima? Teste $x = ${c / 2}$: reta $= ${c * c / 2}$, parábola $= ${c * c / 4}$. A reta.</p>`,
              R`$$A = \int_0^{${c}}\left(${F.c(c)}x - x^2\right)dx = \left[\frac{${F.c(c)}x^2}{2} - \frac{x^3}{3}\right]_0^{${c}} = \frac{${c ** 3}}{2} - \frac{${c ** 3}}{3} = \frac{${c ** 3}}{6}${c ** 3 % 6 === 0 ? " = " + c ** 3 / 6 : " \\approx " + F.n(A, 4)}$$`,
              R`<p>Receita: $\int(\text{de cima} - \text{de baixo})\,dx$, entre os pontos de cruzamento. Se as curvas trocam de posição no meio, quebre a integral.</p>`,
            ] };
        } },
        { nome: "Trabalho na mola", gerar: (p) => {
          const k = p ? 200 : F.escolha([50, 100, 200, 400]), x1 = p ? 0.1 : F.escolha([0, 0.05, 0.1]), x2 = x1 + (p ? 0.1 : F.escolha([0.05, 0.1, 0.2]));
          const W = (k * (x2 * x2 - x1 * x1)) / 2;
          return { enun: R`<p>Uma mola de $k = ${k}$ N/m está esticada ${F.t(x1 * 100, 0)} cm. Que trabalho é preciso para esticá-la até ${F.t(x2 * 100, 0)} cm?</p>`, fig: "",
            passos: [
              R`<p>A força para segurar a mola esticada de $x$ é $F = kx$ (Hooke): cresce com $x$, então $W = F\cdot d$ não serve. Fatie: $dW = kx\,dx$.</p>`,
              R`$$W = \int_{${F.n(x1, 2)}}^{${F.n(x2, 2)}}${F.c(k)}x\,dx = ${k / 2}\left(${F.n(x2, 2)}^2 - ${F.n(x1, 2)}^2\right) = ${F.n(W, 3)}\ \text{J}$$`,
              R`<p>A primitiva $\frac12kx^2$ é a energia potencial elástica. Esticar os mesmos ${F.t((x2 - x1) * 100, 0)} cm custa mais quando a mola já está esticada, porque a força já é maior.</p>`,
            ] };
        } },
        { nome: "Volume por discos", gerar: (p) => {
          const b = p ? 4 : F.escolha([1, 2, 3, 4]), V = (Math.PI * b * b) / 2;
          return { enun: R`<p>Gire $y = \sqrt x$, de $x = 0$ a $x = ${b}$, em torno do eixo $x$. Qual o volume (um paraboloide, como uma antena)?</p>`, fig: "",
            passos: [
              R`<p>Cada fatia em $x$ é um disco de raio $\sqrt x$ e espessura $dx$: $dV = \pi(\sqrt x)^2dx = \pi x\,dx$.</p>`,
              R`$$V = \pi\int_0^{${b}}x\,dx = \pi\frac{${b * b}}{2} \approx ${F.n(V, 4)}$$`,
              R`<p>Comparação: o cilindro de mesmo raio ($\sqrt{${b}}$) e comprimento tem volume $\pi\cdot${b}\cdot${b} = ${b * b}\pi$. O paraboloide tem exatamente <b>metade</b> (Arquimedes também sabia disso).</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Esvaziar a tigela",
      enun: R`<p>Uma tigela em forma de hemisfério de raio $R = 1$ m está cheia de água ($\rho = 1000$ kg/m³, $g = 9{,}8$ m/s²). Que trabalho mínimo é necessário para bombear toda a água até a borda? E se a tigela estivesse só pela metade (água até a profundidade $R/2$)?</p>`,
      fig: "",
      dicas: [R`<p>Fatie em discos horizontais a uma profundidade $y$ abaixo da borda. Raio do disco: $\sqrt{R^2 - y^2}$. Cada disco sobe $y$.</p>`, R`<p>$W = \rho g\pi\int y(R^2 - y^2)\,dy$, com os limites certos. Pela metade: a água ocupa $y$ de $R/2$ a $R$.</p>`],
      sol: R`<p>(i) Disco na profundidade $y$: volume $\pi(R^2 - y^2)dy$, peso $\rho g\pi(R^2 - y^2)dy$, sobe $y$.</p>
        <p>(ii) Cheia: $W = \rho g\pi\int_0^R(R^2y - y^3)dy = \rho g\pi\left(\frac{R^4}{2} - \frac{R^4}{4}\right) = \frac{\rho g\pi R^4}{4} \approx 7697$ J.</p>
        <p>(iii) Pela metade (água entre $y = R/2$ e $y = R$, o fundo): $W = \rho g\pi\left[\frac{R^2y^2}{2} - \frac{y^4}{4}\right]_{1/2}^{1} = \rho g\pi\left(\frac14 - \frac18 + \frac1{64}\right) = \rho g\pi\cdot\frac{9}{64} \approx 4330$ J.</p>
        <p class="det" style="color:var(--ink2)">Pela metade, a tigela tem só $\frac{5}{16}$ da água (a parte de baixo é estreita), mas o trabalho é 56% do total, porque essa água precisa subir mais. Conferi as duas integrais numericamente.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 1 · 9</div>
        <div class="q">Por que o volume do cone tem aquele $\frac13$?</div>
        <p>Na escola, $V = \frac13\pi r^2h$ é decorado. Com integral, ele sai em duas linhas: fatie o cone em moedas e some. A mesma ideia ("fatiar, aproximar cada fatia por algo simples, somar") calcula áreas, volumes, trabalho, centro de massa, força numa represa…</p></div>`),

      F.secao("areas", "Área entre curvas", R`
        ${F.formula(R`A = \int_a^b\bigl[f(x) - g(x)\bigr]\,dx\qquad(f \geq g \text{ em } [a, b])`)}
        <p>Cada fatia vertical é um retângulo de altura "de cima menos de baixo". Às vezes é mais fácil fatiar na horizontal e integrar em $y$ (quando as curvas são mais simples como $x = h(y)$).</p>`),

      F.secao("volumes", "Volumes: fatiar em discos", R`
        ${F.formula(R`V = \int_a^bA(x)\,dx\qquad\text{revolução em torno de } x:\ V = \pi\int_a^bf(x)^2\,dx`, "Volume por fatias / por discos")}
        <div id="lab-rev"></div>
        ${F.demo("o cone e a esfera", R`<p>(i) <b>Cone</b> de raio $r$ e altura $h$: gire a reta $y = \frac rhx$, de 0 a $h$. $V = \pi\int_0^h\frac{r^2}{h^2}x^2dx = \pi\frac{r^2}{h^2}\cdot\frac{h^3}{3} = \frac13\pi r^2h$ ✓. O $\frac13$ é o $\frac13$ de $\int x^2$.</p>
          <p>(ii) <b>Esfera</b> de raio $R$: gire $y = \sqrt{R^2 - x^2}$, de $-R$ a $R$. $V = \pi\int_{-R}^R(R^2 - x^2)dx = \pi\left(2R^3 - \frac{2R^3}{3}\right) = \frac43\pi R^3$ ✓.</p>
          <p>(iii) <b>Cavalieri</b> sai de graça: se dois sólidos têm fatias de mesma área em cada altura, $\int A(x)\,dx$ é igual, e os volumes também.</p>`)}
        <p><b>Cascas cilíndricas</b> (girando em torno do eixo $y$): $V = 2\pi\int_a^bx\,f(x)\,dx$, somando cilindros finos de raio $x$, altura $f(x)$ e espessura $dx$.</p>
        <p><b>Comprimento de curva</b> (bônus): um pedacinho tem $ds = \sqrt{dx^2 + dy^2} = \sqrt{1 + f'(x)^2}\,dx$, então $L = \int_a^b\sqrt{1 + f'(x)^2}\,dx$. Para $y = x^{3/2}$ de 0 a 4: $L = \frac{8}{27}\left(10^{3/2} - 1\right) \approx 9{,}07$.</p>`),

      F.secao("trabalho", "Trabalho, centro de massa, pressão", R`
        <h3>Trabalho de força variável</h3>
        <p>$W = \int F\,dx$. Mola: $W = \frac12kx^2$. Gravidade longe da Terra: $F = \frac{GMm}{r^2}$.</p>
        ${F.demo("velocidade de escape", R`<p>(i) Trabalho para levar $m$ da superfície ($r = R$) até muito longe ($r \to \infty$): $W = \int_R^\infty\frac{GMm}{r^2}dr = \left[-\frac{GMm}{r}\right]_R^\infty = \frac{GMm}{R}$ (uma integral imprópria que converge, ${F.ret("CII02")}).</p>
          <p>(ii) Essa energia tem de vir da cinética: $\frac12mv^2 = \frac{GMm}{R} \Rightarrow v_\text{esc} = \sqrt{\frac{2GM}{R}}$.</p>
          <p>(iii) Terra ($M = 5{,}97\times10^{24}$ kg, $R = 6{,}37\times10^6$ m): $v_\text{esc} \approx 11{,}2$ km/s. A massa do foguete não aparece.</p>`)}
        <h3>Centro de massa</h3>
        <p>$x_\text{cm} = \frac{\int x\,dm}{\int dm}$, com $dm = \lambda(x)\,dx$. Barra de comprimento $L$ com densidade crescente $\lambda = \lambda_0\frac xL$: $x_\text{cm} = \frac{\int_0^Lx^2dx}{\int_0^Lx\,dx} = \frac{L^3/3}{L^2/2} = \frac{2L}{3}$ (mais perto da ponta pesada, como esperado).</p>
        <h3>Força numa represa</h3>
        <p>A pressão cresce com a profundidade, $p = \rho gy$. Numa faixa horizontal de largura $w$ e altura $dy$: $dF = \rho gy\,w\,dy$. Para água até $H$: $F = \rho gw\frac{H^2}{2}$. Por isso represas são mais grossas embaixo.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Ache a área entre $y = x^2$ e $y = 2x$.</p>`, fig: "", dicas: [R`<p>Cruzam em $x = 0$ e $x = 2$.</p>`, R`<p>$\int_0^2(2x - x^2)dx$.</p>`], resp: R`$\frac43$.`, sol: R`<p>$\left[x^2 - \frac{x^3}{3}\right]_0^2 = 4 - \frac83 = \frac43$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Uma mola com $k = 200$ N/m. Quanto trabalho para esticá-la de 0 a 10 cm? E de 10 a 20 cm?</p>`, fig: "", dicas: [R`<p>$W = \frac12k(x_2^2 - x_1^2)$.</p>`, R`<p>Use metros.</p>`], resp: R`$1$ J e $3$ J.`, sol: R`<p>$100\cdot0{,}01 = 1$ J; $100\cdot(0{,}04 - 0{,}01) = 3$ J.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Calcule a velocidade de escape da Terra ($G = 6{,}674\times10^{-11}$, $M = 5{,}972\times10^{24}$ kg, $R = 6{,}371\times10^6$ m) e da Lua ($M = 7{,}35\times10^{22}$ kg, $R = 1{,}737\times10^6$ m).</p>`, fig: "", dicas: [R`<p>$v = \sqrt{2GM/R}$.</p>`, R`<p>A da Lua dá uns 2,4 km/s.</p>`], resp: R`Terra $\approx 11{,}19$ km/s; Lua $\approx 2{,}38$ km/s.`, sol: R`<p>Por isso a Lua não segura atmosfera: moléculas rápidas de gás chegam perto de 2,4 km/s.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>A represa de uma barragem tem 20 m de largura e a água chega a 10 m de altura. Qual a força total da água na parede?</p>`, fig: "", dicas: [R`<p>$dF = \rho g y\,w\,dy$.</p>`, R`<p>$F = \rho gw\frac{H^2}{2}$.</p>`], resp: R`$9{,}8\times10^6$ N.`, sol: R`<p>$1000\cdot9{,}8\cdot20\cdot\frac{100}{2} = 9{,}8\times10^6$ N (o peso de uns 1000 carros). Se a água subisse para 20 m, a força quadruplicaria.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Prove a fórmula do volume do cone girando uma reta, e a da esfera girando uma semicircunferência.</p>`, fig: "", dicas: [R`<p>Cone: $y = \frac rhx$.</p>`, R`<p>Esfera: $y^2 = R^2 - x^2$.</p>`], resp: R`$\frac13\pi r^2h$ e $\frac43\pi R^3$.`, sol: R`<p>Está na demonstração da seção 2; refaça sem olhar. Confira os dois no laboratório.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Uma barra de 2 m tem densidade $\lambda(x) = 3 + x$ kg/m ($x$ a partir de uma ponta). Qual a massa e onde fica o centro de massa?</p>`, fig: "", dicas: [R`<p>$M = \int_0^2(3 + x)dx$.</p>`, R`<p>$x_\text{cm} = \frac1M\int_0^2x(3 + x)dx$.</p>`], resp: R`$M = 8$ kg; $x_\text{cm} = \frac{13}{12} \approx 1{,}083$ m.`, sol: R`<p>$M = 6 + 2 = 8$ kg. $\int x\,dm = \frac{26}{3}$, e $x_\text{cm} = \frac{26/3}{8} = \frac{13}{12} \approx 1{,}083$ m, um pouco além do meio, do lado mais denso.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Gire a região sob $y = e^{-x}$, de $x = 0$ a $x = 1$, em torno do eixo $x$. Qual o volume?</p>`, fig: "", dicas: [R`<p>$V = \pi\int_0^1e^{-2x}dx$.</p>`, R`<p>Primitiva: $-\frac12e^{-2x}$.</p>`], resp: R`$\frac\pi2(1 - e^{-2}) \approx 1{,}358$.`, sol: R`<p>$\pi\cdot\frac{1 - e^{-2}}{2} = \pi\times0{,}4323 \approx 1{,}358$. Com o limite superior indo a infinito, daria $\frac\pi2$: volume finito para uma "trombeta" infinita ${F.ret("CII02")}.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-rev"); e.outerHTML = F.lab("Sólidos de revolução: somando moedas", "lab-rev"); SIM.revolucao(document.getElementById("lab-rev"), F); },
});
