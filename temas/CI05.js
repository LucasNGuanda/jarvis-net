/* CI05 · Aplicações da derivada: máximos, mínimos, L'Hôpital. Conferido em Python (scratchpad ci.py):
   caixa 30×30 → x = 5 cm, V = 2000 cm³; 20×30 → x ≈ 3,924, V ≈ 1056,3; escada no corredor (1, 8) → 11,18 m;
   salva-vidas p ≈ 35,30 m, T ≈ 22,96 s (reta 24,76 s); projétil de 2 m com 10 m/s → 40,28°, alcance 12,04 m; Pmáx = E²/4r = 18 W. */
F.registrar("CI05", {
  retoma: ["CI03", "CI04"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Otimização e L'Hôpital",
      casos: [
        { nome: "Caixa de papelão", gerar: (p) => {
          const a = p ? 30 : F.escolha([20, 24, 30, 40]), b = p ? 30 : F.escolha([20, 30, 36, 50].filter((v) => v >= a));
          const s = a + b, d = Math.sqrt(s * s - 3 * a * b), x = (s - d) / 6, V = x * (a - 2 * x) * (b - 2 * x);
          return { enun: R`<p>De uma folha de ${a} cm × ${b} cm, corte quadrados de lado $x$ nos cantos e dobre as abas para formar uma caixa sem tampa. Qual $x$ dá o maior volume?</p>`, fig: "",
            passos: [
              R`<p>A caixa tem base $(${a} - 2x)\times(${b} - 2x)$ e altura $x$:</p>$$V(x) = x(${a} - 2x)(${b} - 2x),\qquad 0 < x < ${a / 2}$$`,
              R`<p>Expandindo: $V = 4x^3 - ${2 * s}x^2 + ${a * b}x$. Derivando: $V'(x) = 12x^2 - ${4 * s}x + ${a * b}$.</p>`,
              R`<p>$V' = 0$ (Bhaskara): $x = \frac{${4 * s} \pm \sqrt{${16 * s * s} - ${48 * a * b}}}{24}$. A raiz maior dá $x \geq ${a / 2}$ (não sobra base para a caixa); fica $x \approx ${F.m(x, 3)}$ cm.</p>`,
              R`<p>Conferindo que é máximo: $V(0) = V(${a / 2}) = 0$ e $V > 0$ no meio, então o único ponto crítico do intervalo é o máximo (Weierstrass). $V_\text{máx} \approx ${F.m(V, 1)}$ cm³.</p>`,
            ] };
        } },
        { nome: "Potência máxima numa bateria", gerar: (p) => {
          const E = p ? 12 : F.escolha([6, 9, 12, 24]), r = p ? 2 : F.escolha([0.5, 1, 2, 4]);
          return { enun: R`<p>Uma bateria de fem $E = ${E}$ V e resistência interna $r = ${F.m(r, 1)}$ Ω alimenta um resistor $R$. Que $R$ recebe a maior potência? Quanto é essa potência?</p>`, fig: "",
            passos: [
              R`<p>Corrente: $i = \frac{E}{R + r}$. Potência no resistor: $P(R) = Ri^2 = \frac{${E * E}R}{(R + ${F.m(r, 1)})^2}$.</p>`,
              R`<p>Quociente: $P'(R) = ${E * E}\cdot\frac{(R + r)^2 - R\cdot2(R + r)}{(R + r)^4} = ${E * E}\cdot\frac{r - R}{(R + r)^3}$.</p>`,
              R`<p>$P' = 0 \iff R = r = ${F.m(r, 1)}$ Ω. Para $R < r$, $P' > 0$; para $R > r$, $P' < 0$: é máximo.</p>`,
              R`<p>$P_\text{máx} = \frac{E^2}{4r} = \frac{${E * E}}{${F.m(4 * r, 0)}} = ${F.m((E * E) / (4 * r), 2)}$ W. É o "casamento de impedâncias" ${F.ret("C10")}: nesse ponto, metade da energia esquenta a própria bateria (rendimento de 50%).</p>`,
            ] };
        } },
        { nome: "L'Hôpital", gerar: (p) => {
          const a = p ? 2 : F.escolha([1, 2, 3, 5]), b = p ? 3 : F.escolha([1, 2, 3, 4]);
          return { enun: R`<p>Calcule $\displaystyle\lim_{x\to0}\frac{e^{${a === 1 ? "" : a}x} - 1 - ${a === 1 ? "" : a}x}{${b === 1 ? "" : b}x^2}$.</p>`, fig: "",
            passos: [
              R`<p>Substituindo: $\frac{1 - 1 - 0}{0} = \frac00$. L'Hôpital: derive em cima e embaixo <b>separadamente</b> (não é a regra do quociente!):</p>$$\lim_{x\to0}\frac{${a}e^{${a}x} - ${a}}{${2 * b}x}$$`,
              R`<p>De novo $\frac00$. Aplique mais uma vez:</p>$$\lim_{x\to0}\frac{${a * a}e^{${a}x}}{${2 * b}} = \frac{${a * a}}{${2 * b}}${(a * a) % (2 * b) === 0 ? " = " + (a * a) / (2 * b) : " \\approx " + F.m((a * a) / (2 * b), 4)}$$`,
              R`<p>Leitura: $e^{${a}x} \approx 1 + ${a}x + \frac{${a * a}x^2}{2}$ para $x$ pequeno. O L'Hôpital está "descobrindo" o termo de 2ª ordem da série de Taylor.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A escada que vira a esquina",
      enun: R`<p>Dois corredores perpendiculares, de larguras $a = 1$ m e $b = 8$ m, se encontram em L. Qual é a escada <b>mais comprida</b> que dá para carregar na horizontal de um corredor para o outro, virando a esquina? Ache a fórmula geral e o valor.</p>`,
      fig: "",
      dicas: [R`<p>Inverta a pergunta: para cada ângulo $\theta$ da escada com a parede, qual o comprimento do maior segmento que encosta no canto interno e nas duas paredes de fora? A escada passa se for menor que o <b>mínimo</b> disso.</p>`, R`<p>$L(\theta) = \frac{a}{\operatorname{sen}\theta} + \frac{b}{\cos\theta}$. Derive e iguale a zero: aparece $\operatorname{tg}^3\theta = a/b$.</p>`],
      sol: R`<p>(i) Encostando no canto interno, o segmento tem $L(\theta) = \frac{a}{\operatorname{sen}\theta} + \frac{b}{\cos\theta}$, $0 < \theta < \frac\pi2$. Ele vai a infinito nas duas pontas; a escada cabe se for $\leq \min L$.</p>
        <p>(ii) $L'(\theta) = -\frac{a\cos\theta}{\operatorname{sen}^2\theta} + \frac{b\operatorname{sen}\theta}{\cos^2\theta} = 0 \iff \operatorname{tg}^3\theta = \frac ab$.</p>
        <p>(iii) Com $\operatorname{tg}\theta = (a/b)^{1/3}$, depois de simplificar: $L_\text{mín} = \left(a^{2/3} + b^{2/3}\right)^{3/2}$.</p>
        <p>(iv) $a = 1$, $b = 8$: $(1 + 4)^{3/2} = 5\sqrt5 \approx 11{,}18$ m. Conferi minimizando numericamente.</p>
        <p class="det" style="color:var(--ink2)">Repare na lógica de "máximo de um mínimo": o problema pede a maior escada, e a conta é um mínimo. A curva $x^{2/3} + y^{2/3} = L^{2/3}$ que aparece aqui é a astroide, o envelope de todas as posições da escada.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 1 · 5</div>
        <div class="q">Por que a luz entorta quando entra na água?</div>
        <p>Porque ela "escolhe" o caminho mais rápido (princípio de Fermat), e na água ela é mais lenta. Achar o caminho mais rápido é achar o mínimo de uma função: derivada igual a zero. Com isso sai a lei de Snell, sem nenhuma óptica.</p></div>`),

      F.secao("extremos", "Máximos e mínimos", R`
        <p><b>Teorema de Fermat:</b> se $f$ tem um máximo ou mínimo local num ponto $c$ do interior e é derivável ali, então $f'(c) = 0$. (No topo de uma colina suave, a tangente é horizontal.)</p>
        ${F.demo("por quê", R`<p>(i) Se $c$ é máximo local, para $h$ pequeno $f(c + h) - f(c) \leq 0$.</p>
          <p>(ii) Com $h > 0$: $\frac{f(c+h) - f(c)}{h} \leq 0$, então o limite $f'(c) \leq 0$. Com $h < 0$: a fração é $\geq 0$, então $f'(c) \geq 0$.</p>
          <p>(iii) As duas juntas: $f'(c) = 0$ ∎.</p>`)}
        <p><b>Cuidado:</b> a volta é falsa. $f(x) = x^3$ tem $f'(0) = 0$ e não tem máximo nem mínimo em 0 (é uma inflexão). Os pontos com $f' = 0$ (ou sem derivada) se chamam <b>pontos críticos</b>: são <i>candidatos</i>.</p>
        <h3>Como decidir</h3>
        <ul><li><b>Teste da 1ª derivada:</b> $f'$ muda de $+$ para $-$: máximo; de $-$ para $+$: mínimo; não muda: nenhum dos dois.</li>
          <li><b>Teste da 2ª derivada:</b> $f'(c) = 0$ e $f''(c) < 0$: máximo (concavidade para baixo, ∩); $f''(c) > 0$: mínimo (∪); $f''(c) = 0$: o teste não decide.</li>
          <li><b>Num intervalo fechado</b> $[a, b]$: o máximo e o mínimo globais estão entre os pontos críticos <b>e as pontas</b> $a$ e $b$. Compare os valores.</li></ul>
        ${F.caixa("fisico", R`<p><b>Equilíbrio é derivada zero.</b> Com $F = -U'(x)$, os equilíbrios são os pontos críticos de $U$. Mínimo de $U$ ($U'' > 0$): estável, e a partícula oscila com $\omega = \sqrt{U''(x_0)/m}$ (é a "mola equivalente" $k = U''$). Máximo: instável. Isso é a base de todo problema de pequenas oscilações dos experimentos.</p>`)}`),

      F.secao("fermat", "O salva-vidas e a lei de Snell", R`
        <div id="lab-sv"></div>
        ${F.demo("a lei de Snell pela derivada", R`<p>(i) O salva-vidas está a uma distância $h_1$ da linha d'água; a pessoa, a $h_2$ dentro da água; a distância horizontal entre eles é $d$. Ele entra na água no ponto $p$.</p>
          <p>(ii) Tempo total: $T(p) = \frac{\sqrt{p^2 + h_1^2}}{v_1} + \frac{\sqrt{(d - p)^2 + h_2^2}}{v_2}$.</p>
          <p>(iii) $T'(p) = \frac{p}{v_1\sqrt{p^2 + h_1^2}} - \frac{d - p}{v_2\sqrt{(d-p)^2 + h_2^2}}$.</p>
          <p>(iv) As frações são senos dos ângulos com a normal: $\frac{p}{\sqrt{p^2 + h_1^2}} = \operatorname{sen}\theta_1$ e a outra é $\operatorname{sen}\theta_2$. Então $T' = 0$ dá:</p>
          ${F.formula(R`\frac{\operatorname{sen}\theta_1}{v_1} = \frac{\operatorname{sen}\theta_2}{v_2}\quad\Longleftrightarrow\quad n_1\operatorname{sen}\theta_1 = n_2\operatorname{sen}\theta_2`, "Lei de Snell (com n = c/v)")}
          <p>(v) É mínimo porque $T$ é convexa (soma de duas funções convexas), então só tem um ponto crítico e ele é o fundo.</p>`)}
        <p>Com os números do laboratório ($v_1 = 5$, $v_2 = 1{,}5$ m/s), o melhor é entrar em $p \approx 35{,}3$ m: $T \approx 22{,}96$ s, contra $24{,}76$ s em linha reta. O mesmo princípio dá a reflexão (ângulo de incidência = de reflexão) e, generalizado, vira o princípio da mínima ação da mecânica de Lagrange ${F.ret("U04")}.</p>`),

      F.secao("tvm", "Teorema do valor médio", R`
        ${F.formula(R`f \text{ contínua em } [a, b] \text{ e derivável em } (a, b)\ \Longrightarrow\ \exists\,c:\ f'(c) = \frac{f(b) - f(a)}{b - a}`, "TVM (Lagrange)")}
        <p>Em algum instante, a velocidade instantânea é igual à velocidade média. Aplicação real: radar de velocidade média em rodovias. Se você fez 30 km em 15 minutos (média de 120 km/h), em algum momento o velocímetro marcou exatamente 120 km/h, mesmo que nenhuma câmera tenha visto. Caso particular ($f(a) = f(b)$): <b>Rolle</b>, existe um ponto com tangente horizontal.</p>
        <p>Consequência importante: se $f' = 0$ num intervalo, $f$ é constante ali. Daí, duas primitivas da mesma função diferem por uma constante, que é o "$+ C$" das integrais ${F.ret("CI08")}.</p>`),

      F.secao("lhopital", "L'Hôpital", R`
        ${F.formula(R`\lim_{x\to a}\frac{f(x)}{g(x)} = \lim_{x\to a}\frac{f'(x)}{g'(x)}\qquad\text{se der } \tfrac00 \text{ ou } \tfrac\infty\infty \text{ (e o 2º limite existir)}`, "Regra de L'Hôpital")}
        ${F.demo("o caso simples", R`<p>(i) Suponha $f(a) = g(a) = 0$, com $f'$ e $g'$ contínuas e $g'(a) \neq 0$.</p>
          <p>(ii) $\frac{f(x)}{g(x)} = \frac{f(x) - f(a)}{g(x) - g(a)} = \frac{\frac{f(x) - f(a)}{x - a}}{\frac{g(x) - g(a)}{x - a}}$.</p>
          <p>(iii) Quando $x \to a$, em cima vai a $f'(a)$ e embaixo a $g'(a)$ ∎. Perto de $a$, as duas funções são quase as retas tangentes, e a razão das retas é a razão das inclinações.</p>`)}
        <p><b>As outras indeterminações</b> viram $\frac00$ ou $\frac\infty\infty$ com um truque:</p>
        <ul><li>$0\cdot\infty$: escreva como fração. $\lim_{x\to0^+}x\ln x = \lim\frac{\ln x}{1/x} \overset{L'H}{=} \lim\frac{1/x}{-1/x^2} = \lim(-x) = 0$. (É o limite que mostra que o gam fresco vai a 1 perto do zero ${F.ret("X01")}.)</li>
          <li>$1^\infty$, $0^0$, $\infty^0$: tire o $\ln$. $\lim_{x\to0^+}x^x$: $\ln(x^x) = x\ln x \to 0$, então $x^x \to e^0 = 1$. Por isso se convenciona $0^0 = 1$.</li></ul>
        ${F.caixa("pegadinha", R`<p>(1) L'Hôpital <b>não</b> é a regra do quociente: derive em cima e embaixo separadamente. (2) Só vale com $\frac00$ ou $\frac\infty\infty$: $\lim_{x\to0}\frac{x + 1}{x + 2} = \frac12$, mas "derivando" daria 1. (3) Às vezes ele anda em círculos ($\frac{e^x + e^{-x}}{e^x - e^{-x}}$ no infinito): divida pela maior exponencial em vez disso.</p>`)}`),

      F.secao("exemplos", "Exemplos", exemplario),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Ache os máximos e mínimos locais de $f(x) = x^3 - 3x$ e diga se são máximo ou mínimo pelo teste da 2ª derivada. (É o $x^3 - 3x$ do laboratório da CI03.)</p>`, fig: "", dicas: [R`<p>$f'(x) = 3x^2 - 3 = 0$.</p>`, R`<p>$f''(x) = 6x$.</p>`], resp: R`Máximo local em $(-1, 2)$; mínimo local em $(1, -2)$.`, sol: R`<p>$f''(-1) = -6 < 0$ (máximo), $f''(1) = 6 > 0$ (mínimo). Não são globais: a função vai a $\pm\infty$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule por L'Hôpital: (a) $\displaystyle\lim_{x\to0}\frac{\operatorname{sen}x - x}{x^3}$; (b) $\displaystyle\lim_{x\to\infty}\left(1 + \frac1x\right)^x$.</p>`, fig: "", dicas: [R`<p>(a) Três vezes seguidas.</p>`, R`<p>(b) Tire o $\ln$: $x\ln(1 + 1/x) = \frac{\ln(1 + 1/x)}{1/x}$.</p>`], resp: R`(a) $-\frac16$; (b) $e$.`, sol: R`<p>(a) $\frac{\cos x - 1}{3x^2} \to \frac{-\operatorname{sen}x}{6x} \to \frac{-\cos x}{6} \to -\frac16$. Ou seja, $\operatorname{sen}x \approx x - \frac{x^3}{6}$ (Taylor). (b) O $\ln$ vai a 1, logo o limite é $e^1$: você acabou de provar o limite fundamental de CI02 de outro jeito.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Um projétil é lançado do chão com velocidade $v$. Mostre, por derivada, que o alcance $A(\theta) = \frac{v^2\operatorname{sen}2\theta}{g}$ é máximo em $45°$.</p>`, fig: "", dicas: [R`<p>$A'(\theta) = \frac{2v^2\cos2\theta}{g}$.</p>`, R`<p>$\cos2\theta = 0$ com $0 < \theta < 90°$.</p>`], resp: R`$2\theta = 90° \Rightarrow \theta = 45°$, com $A_\text{máx} = v^2/g$.`, sol: R`<p>$A'' = -\frac{4v^2}{g}\operatorname{sen}2\theta < 0$ em $45°$: máximo.</p>` }),
        F.exercicio({ n: 4, marcas: ["!"], enun: R`<p>Agora o projétil sai de uma altura de 2 m, com 10 m/s ($g = 9{,}8$ m/s²). O ângulo ótimo continua 45°? Use a fórmula conhecida (para quem quiser deduzir): $\operatorname{tg}\theta^* = \frac{v}{\sqrt{v^2 + 2gh}}$.</p>`, fig: "", dicas: [R`<p>Substitua: $\sqrt{100 + 39{,}2}$.</p>`, R`<p>Alcance com altura: $A = \frac{v\cos\theta}{g}\left(v\operatorname{sen}\theta + \sqrt{v^2\operatorname{sen}^2\theta + 2gh}\right)$.</p>`], resp: R`Não: $\theta^* \approx 40{,}3°$, alcance $\approx 12{,}04$ m.`, sol: R`<p>$\operatorname{tg}\theta^* = 10/11{,}80 \Rightarrow \theta^* \approx 40{,}28°$. É por isso que arremessadores de peso lançam abaixo de 45°: eles soltam o peso a uns 2 m do chão. Conferi maximizando numericamente.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma lata cilíndrica de 1 litro (1000 cm³) deve usar o mínimo de material (área total). Qual a relação entre a altura e o raio?</p>`, fig: "", dicas: [R`<p>$V = \pi r^2h = 1000$, área $= 2\pi r^2 + 2\pi rh$. Elimine $h$.</p>`, R`<p>$A(r) = 2\pi r^2 + \frac{2000}{r}$.</p>`], resp: R`$h = 2r$ (altura = diâmetro); $r \approx 5{,}42$ cm.`, sol: R`<p>$A'(r) = 4\pi r - \frac{2000}{r^2} = 0 \Rightarrow r^3 = \frac{500}{\pi}$, $r \approx 5{,}42$ cm, e $h = \frac{1000}{\pi r^2} = 2r$. Latas reais são mais altas por causa das emendas e do formato de empilhar.</p>` }),
        F.exercicio({ n: 6, enun: R`<p>Uma partícula tem energia potencial $U(x) = x^4 - 2x^2$ (unidades SI) e massa 0,5 kg. Ache os equilíbrios, diga quais são estáveis e calcule o período das pequenas oscilações em torno dos estáveis.</p>`, fig: "", dicas: [R`<p>$U' = 4x^3 - 4x$; $U'' = 12x^2 - 4$.</p>`, R`<p>Mola equivalente: $k = U''(x_0)$; $T = 2\pi\sqrt{m/k}$.</p>`], resp: R`$x = 0$ instável; $x = \pm1$ estáveis, com $k = 8$ N/m e $T = \frac{\pi}{2} \approx 1{,}57$ s.`, sol: R`<p>$U''(0) = -4 < 0$ (pico), $U''(\pm1) = 8 > 0$ (vales). $T = 2\pi\sqrt{0{,}5/8} = 2\pi\times0{,}25 = \frac\pi2$ s. É o "poço duplo", modelo da molécula de amônia e de qualquer sistema com dois estados.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Calcule $\displaystyle\lim_{x\to0^+}x^{\operatorname{sen}x}$ e $\displaystyle\lim_{x\to\infty}\frac{x^{100}}{e^x}$.</p>`, fig: "", dicas: [R`<p>No primeiro, tire o $\ln$: $\operatorname{sen}x\ln x \approx x\ln x$.</p>`, R`<p>No segundo, L'Hôpital 100 vezes: o expoente de cima cai, o $e^x$ fica.</p>`], resp: R`$1$ e $0$.`, sol: R`<p>(1) $\operatorname{sen}x\ln x = \frac{\operatorname{sen}x}{x}\cdot x\ln x \to 1\cdot0 = 0$, então o limite é $e^0 = 1$. (2) Depois de 100 derivadas, $\frac{100!}{e^x} \to 0$: <b>qualquer</b> exponencial vence <b>qualquer</b> potência, por isso o $e^{-t}$ da integral da gama sempre ganha ${F.ret("CE02")}.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-sv"); e.outerHTML = F.lab("O salva-vidas: caminho mais rápido = lei de Snell", "lab-sv"); SIM.salvavidas(document.getElementById("lab-sv"), F); },
});
