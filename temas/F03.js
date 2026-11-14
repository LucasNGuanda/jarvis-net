/* F03 · Trigonometria para física. Conferido em Python: sen 15° = (√6 − √2)/4 ≈ 0,2588; erro de sen θ ≈ θ: 0,51% a 10°, 4,7% a 30°;
   3 sen + 4 cos = 5 sen(ωt + 53,13°); lei dos senos (30°, 45°, a = 10): b ≈ 14,14; alcance a 30° ou 60° com 20 m/s: 34,6 m;
   plano inclinado de 30°, v = 10, g = 10: alcance máximo ao longo do plano 6,67 m em θ = 60° = 45° + α/2. */
F.registrar("F03", {
  retoma: ["F02", "A20"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Trigonometria no dia a dia da física",
      casos: [
        { nome: "Plano inclinado", gerar: (p) => {
          const m = p ? 10 : F.escolha([2, 5, 10, 20]), th = p ? 30 : F.escolha([20, 30, 37, 45, 53]), g = 10, c = Math.cos((th * Math.PI) / 180), s = Math.sin((th * Math.PI) / 180);
          return { enun: R`<p>Um bloco de ${m} kg está num plano inclinado de ${th}°. Quanto vale a componente do peso ao longo do plano e perpendicular a ele? ($g = 10$ m/s²)</p>`, fig: "",
            passos: [R`<p>O ângulo entre o peso (vertical) e a perpendicular ao plano é o próprio ângulo do plano (lados perpendiculares, ângulos iguais).</p>`, R`<p>Ao longo do plano: $P\sin\theta = ${m * g}\cdot${F.n(s, 4)} \approx ${F.n(m * g * s, 2)}$ N.</p>`, R`<p>Perpendicular: $P\cos\theta = ${m * g}\cdot${F.n(c, 4)} \approx ${F.n(m * g * c, 2)}$ N. Confira: $\sqrt{${F.n(m * g * s, 2)}^2 + ${F.n(m * g * c, 2)}^2} \approx ${m * g}$.</p>`] };
        } },
        { nome: "Somar seno com cosseno", gerar: (p) => {
          const a = p ? 3 : F.escolha([1, 3, 5, 8]), b = p ? 4 : F.escolha([1, 4, 12, 6]), Rr = Math.hypot(a, b), d = (Math.atan2(b, a) * 180) / Math.PI;
          return { enun: R`<p>Escreva $${a}\sin\omega t + ${b}\cos\omega t$ como uma única senoide $R\sin(\omega t + \delta)$.</p>`, fig: "",
            passos: [R`<p>$R\sin(\omega t + \delta) = R\cos\delta\sin\omega t + R\sin\delta\cos\omega t$. Compare: $R\cos\delta = ${a}$ e $R\sin\delta = ${b}$.</p>`, R`<p>$R = \sqrt{${a}^2 + ${b}^2} = ${F.n(Rr, 4)}$.</p>`, R`<p>$\tan\delta = \frac{${b}}{${a}}$, $\delta \approx ${F.n(d, 2)}°$. Dois MHS de mesma frequência somam num MHS só ${F.ret("A20")}.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Alcance máximo num plano inclinado",
      enun: R`<p>Um projétil é lançado com velocidade $v$, fazendo um ângulo $\theta$ com a horizontal, do pé de uma rampa de inclinação $\alpha$ ($\theta > \alpha$). (a) Mostre que o alcance medido ao longo da rampa é $R = \frac{2v^2\cos\theta\sin(\theta - \alpha)}{g\cos^2\alpha}$. (b) Use $2\cos\theta\sin(\theta - \alpha) = \sin(2\theta - \alpha) - \sin\alpha$ para achar o ângulo de alcance máximo. (c) Mostre que $R_\text{máx} = \frac{v^2}{g(1 + \sin\alpha)}$ e calcule para $v = 10$ m/s, $\alpha = 30°$, $g = 10$ m/s². (d) O que acontece com $\alpha = 0$?</p>`,
      fig: "",
      dicas: [R`<p>(a) $x = v\cos\theta\,t$, $y = v\sin\theta\,t - \frac12gt^2$; na rampa, $y = x\tan\alpha$. Ache $t$ e depois $R = x/\cos\alpha$.</p>`, R`<p>(b) Só $\sin(2\theta - \alpha)$ depende de $\theta$: é máximo quando vale 1.</p>`],
      sol: R`<p><b>(a)</b> $v\sin\theta\,t - \frac12gt^2 = v\cos\theta\,t\tan\alpha \Rightarrow t = \frac{2v(\sin\theta - \cos\theta\tan\alpha)}{g} = \frac{2v\sin(\theta - \alpha)}{g\cos\alpha}$. Então $x = \frac{2v^2\cos\theta\sin(\theta - \alpha)}{g\cos\alpha}$ e $R = \frac{x}{\cos\alpha}$.</p>
        <p><b>(b)</b> $R = \frac{v^2[\sin(2\theta - \alpha) - \sin\alpha]}{g\cos^2\alpha}$, máximo com $2\theta - \alpha = 90°$: $\theta = 45° + \frac\alpha2$ (a bissetriz entre a rampa e a vertical).</p>
        <p><b>(c)</b> $R_\text{máx} = \frac{v^2(1 - \sin\alpha)}{g\cos^2\alpha} = \frac{v^2(1 - \sin\alpha)}{g(1 - \sin\alpha)(1 + \sin\alpha)} = \frac{v^2}{g(1 + \sin\alpha)}$. Com os números: $\frac{100}{10\cdot1{,}5} \approx 6{,}67$ m, em $\theta = 60°$ (conferido numericamente).</p>
        <p><b>(d)</b> $\theta = 45°$ e $R = v^2/g$: o resultado de sempre. Morro abaixo ($\alpha < 0$), o alcance máximo aumenta e o ângulo ótimo fica abaixo de 45°.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Fundamentos · trigonometria</div>
        <div class="q">Por que seno e cosseno aparecem em tudo que oscila?</div>
        <p>Porque um ponto girando num círculo com velocidade constante tem uma "sombra" que vai e vem: a sombra horizontal é o cosseno, a vertical é o seno. Molas, pêndulos, ondas, corrente alternada: toda oscilação simples é a sombra de um movimento circular.</p></div>`),

      F.secao("circulo", "Radianos e o círculo trigonométrico", R`
        ${F.formula(R`\theta\ (\text{rad}) = \frac{\text{arco}}{\text{raio}} = \frac sR,\qquad 180° = \pi\text{ rad},\qquad 1\text{ rad} \approx 57{,}3°`, "Radiano")}
        <p>Em física, ângulo é quase sempre em <b>radianos</b>: é o que faz $s = R\theta$, $v = \omega R$ e $\sin\theta \approx \theta$ darem certo sem fatores estranhos. No círculo de raio 1, o ponto no ângulo $\theta$ tem coordenadas $(\cos\theta, \sin\theta)$, e daí sai a relação fundamental $\sin^2\theta + \cos^2\theta = 1$ (Pitágoras).</p>
        <div id="lab-cir"></div>
        <table class="tb"><tr><th>θ</th><th>0</th><th>30°</th><th>45°</th><th>60°</th><th>90°</th></tr>
          <tr><td>sen</td><td>0</td><td>$\frac12$</td><td>$\frac{\sqrt2}2$</td><td>$\frac{\sqrt3}2$</td><td>1</td></tr>
          <tr><td>cos</td><td>1</td><td>$\frac{\sqrt3}2$</td><td>$\frac{\sqrt2}2$</td><td>$\frac12$</td><td>0</td></tr></table>
        ${F.caixa("ideia", R`<p>O "triângulo 3-4-5" dá ângulos de cerca de 37° e 53° ($\sin37° \approx 0{,}6$, $\cos37° \approx 0{,}8$). Muitas provas usam esses valores aproximados para a conta sair redonda.</p>`)}`),

      F.secao("identidades", "Identidades que a física usa", R`
        ${F.formula(R`\sin(a \pm b) = \sin a\cos b \pm \cos a\sin b,\qquad \cos(a \pm b) = \cos a\cos b \mp \sin a\sin b`, "Soma de arcos")}
        <p>Delas saem: $\sin2a = 2\sin a\cos a$ (o alcance $R = \frac{v^2\sin2\theta}g$ do lançamento oblíquo), $\cos2a = 1 - 2\sin^2a$ (o $\frac12$ da potência média em corrente alternada) e a soma de senoides em produto (o batimento ${F.ret("EP08")}).</p>
        ${F.formula(R`\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C},\qquad c^2 = a^2 + b^2 - 2ab\cos C`, "Lei dos senos e lei dos cossenos")}
        <p>A lei dos cossenos é a que dá o módulo da soma de dois vetores ${F.ret("F02")} (com o sinal trocado, porque o ângulo do triângulo é o suplemento do ângulo entre os vetores).</p>
        ${F.caixa("fisico", R`<p><b>Ângulos pequenos</b>: $\sin\theta \approx \theta$, $\tan\theta \approx \theta$, $\cos\theta \approx 1 - \frac{\theta^2}2$ (com $\theta$ em radianos). O erro de $\sin\theta \approx \theta$ é de 0,5% a 10° e de 4,7% a 30° (no laboratório, confira). É a aproximação que transforma o pêndulo num MHS, e o motivo de o seu experimento do pêndulo ter dado $g$ baixo com ângulo grande ${F.ret("F05")}.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Converta 30° e 135° para radianos, e 2 rad para graus.</p>`, fig: "", dicas: [R`<p>Multiplique por $\pi/180$.</p>`], resp: R`$\pi/6 \approx 0{,}524$; $3\pi/4 \approx 2{,}36$; $\approx 114{,}6°$.`, sol: R`<p>$2\cdot\frac{180}\pi \approx 114{,}6°$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule $\sin15°$ sem calculadora.</p>`, fig: "", dicas: [R`<p>$15° = 45° - 30°$.</p>`], resp: R`$\frac{\sqrt6 - \sqrt2}4 \approx 0{,}259$.`, sol: R`<p>$\sin45°\cos30° - \cos45°\sin30° = \frac{\sqrt2}2\cdot\frac{\sqrt3}2 - \frac{\sqrt2}2\cdot\frac12$.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Um bloco de 10 kg está num plano inclinado de 37° (use $\sin37° = 0{,}6$, $\cos37° = 0{,}8$, $g = 10$ m/s²). Ache as componentes do peso.</p>`, fig: "", dicas: [R`<p>Ao longo: $P\sin\theta$.</p>`], resp: R`60 N ao longo do plano; 80 N perpendicular.`, sol: R`<p>Sem atrito, a aceleração seria $g\sin\theta = 6$ m/s².</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Escreva $3\sin\omega t + 4\cos\omega t$ na forma $R\sin(\omega t + \delta)$.</p>`, fig: "", dicas: [R`<p>$R = \sqrt{3^2 + 4^2}$.</p>`], resp: R`$5\sin(\omega t + 53{,}1°)$.`, sol: R`<p>$\tan\delta = 4/3$.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Qual o erro relativo de usar $\sin\theta \approx \theta$ para $\theta = 10°$? E para $30°$?</p>`, fig: "", dicas: [R`<p>$10° \approx 0{,}17453$ rad e $\sin10° \approx 0{,}17365$.</p>`], resp: R`$\approx 0{,}51\%$; $\approx 4{,}7\%$.`, sol: R`<p>O erro cresce como $\theta^2/6$: triplicar o ângulo multiplica o erro por 9.</p>` }),
        F.exercicio({ n: 6, enun: R`<p>Num triângulo, $A = 30°$, $B = 45°$ e o lado oposto a A mede 10. Quanto mede o lado oposto a B?</p>`, fig: "", dicas: [R`<p>Lei dos senos.</p>`], resp: R`$10\sqrt2 \approx 14{,}1$.`, sol: R`<p>$b = \frac{10\sin45°}{\sin30°} = \frac{10\cdot\sqrt2/2}{1/2}$.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Mostre que lançamentos a $\theta$ e a $90° - \theta$ com a mesma velocidade têm o mesmo alcance (no plano horizontal). Calcule para 30° e 60° com $v = 20$ m/s ($g = 10$).</p>`, fig: "", dicas: [R`<p>$R = \frac{v^2\sin2\theta}g$.</p>`, R`<p>$\sin(180° - x) = \sin x$.</p>`], resp: R`$\sin2\theta = \sin(180° - 2\theta)$; $R \approx 34{,}6$ m nos dois.`, sol: R`<p>$\frac{400\cdot\sin60°}{10} = 20\sqrt3$. O de 60° sobe mais e demora mais; o de 30° chega antes.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-cir"); e.outerHTML = F.lab("O círculo trigonométrico e as senoides", "lab-cir"); SIM.circulo(document.getElementById("lab-cir"), F); },
});
