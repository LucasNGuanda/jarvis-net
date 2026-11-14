/* A20 · Movimento Harmônico Simples e oscilações. Conferido em Python (g = 10 m/s² salvo indicação):
   mola k = 200, m = 0,5: ω = 20 rad/s, T = 0,314 s; com A = 0,1 m: v_máx = 2 m/s, a_máx = 40 m/s², E = 1 J; em x = 0,06 m: v = 1,6 m/s;
   pêndulo L = 1 m: 1,987 s (g = 10) e 2,007 s (g = 9,8); para T = 2 s com g = 9,8: L = 0,993 m;
   duas molas de 100 N/m e 1 kg: paralelo 0,444 s, série 0,889 s (razão 2); mola que estica 5 cm com o peso: T = 2π√(0,05/10) = 0,444 s;
   barra de 1 m pendurada pela ponta: 2π√(2L/3g) = 1,622 s; relógio de pêndulo num lugar com g 0,1% menor: atrasa 43,2 s/dia;
   anel de raio R num prego: 2π√(2R/g) (R = 0,2 m: 1,257 s); pêndulo de 1 m num elevador com a = 2 m/s² para cima: 1,814 s;
   chefão (g = 9,81, L = 1 m, θ0 = 30°): T exato (integral elíptica) = 2,0410 s = 1,01741·T0; g ingênuo = 9,477 (−3,39%);
   com T ≈ T0(1 + θ0²/16): 9,805 (−0,05%); razão exata/T0: 10° 1,0019; 30° 1,0174; 60° 1,0732; 90° 1,1803 (θ²/16 dá 1,1542; com 11θ⁴/3072: 1,1760). */
F.registrar("A20", {
  retoma: ["A07", "A11", "A14a", "F04", "F05"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const molaBloco = (rot) => { let d = "M70 95"; for (let i = 1; i <= 12; i++) d += `L${70 + i * 15} ${95 + (i % 2 ? -10 : 10)}`; d += "L260 95"; return fig(`<rect x="60" y="60" width="10" height="60" style="fill:var(--ink3)"/><line x1="60" x2="460" y1="120" y2="120" style="stroke:var(--ink2);stroke-width:2"/><path d="${d}" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="260" y="74" width="44" height="44" style="fill:color-mix(in srgb,var(--mA) 35%,transparent);stroke:var(--mA);stroke-width:2"/>` + D.txt(282, 100, rot, "tx2"), 150); };
    const pendulo = (th, rot = "") => { const t = (th * Math.PI) / 180; return fig(`<line x1="200" x2="360" y1="10" y2="10" style="stroke:var(--ink2);stroke-width:3"/><line x1="280" y1="10" x2="280" y2="150" style="stroke:var(--ink3);stroke-dasharray:4 4"/><line x1="280" y1="10" x2="${280 + 140 * Math.sin(t)}" y2="${10 + 140 * Math.cos(t)}" style="stroke:var(--ink)"/><circle cx="${280 + 140 * Math.sin(t)}" cy="${10 + 140 * Math.cos(t)}" r="10" style="fill:var(--mA)"/>` + D.txt(290, 60, `${th}°`, "tx2", "start") + (rot ? D.txt(380, 90, rot, "tx2", "start") : ""), 170); };
    const exemplos = F.exemplo({
      titulo: "Oscilações",
      casos: [
        { nome: "Fácil: o bloco na mola", gerar: (p) => {
          const k = p ? 200 : F.escolha([50, 100, 200, 400]), m = p ? 0.5 : F.escolha([0.5, 1, 2]), A = p ? 0.1 : F.escolha([0.05, 0.1, 0.2]), w = Math.sqrt(k / m);
          return { enun: R`<p>Um bloco de ${F.nt(m)} kg preso a uma mola de ${k} N/m, numa mesa sem atrito, é puxado ${F.nt(A * 100)} cm e solto. Ache o período, a velocidade máxima e a aceleração máxima.</p>`, fig: molaBloco(`${F.nt(m)} kg`),
            passos: [R`<p>(i) $\omega = \sqrt{k/m} = \sqrt{${F.n(k / m)}} \approx ${F.n(w, 3)}$ rad/s; $T = \frac{2\pi}\omega \approx ${F.n((2 * Math.PI) / w, 3)}$ s.</p>`, R`<p>(ii) $x = A\cos\omega t \Rightarrow v = -A\omega\sin\omega t$: $v_\text{máx} = A\omega \approx ${F.n(A * w, 3)}$ m/s, no centro ($x = 0$).</p>`, R`<p>(iii) $a = -\omega^2x$: $a_\text{máx} = A\omega^2 = ${F.n(A * w * w, 3)}$ m/s², nos extremos, onde a velocidade é zero. A amplitude não muda o período.</p>`] };
        } },
        { nome: "Médio: o pêndulo no elevador", gerar: (p) => {
          const L = p ? 1 : F.escolha([0.5, 1, 2]), a = p ? 2 : F.escolha([2, -2, 5, -5]), T0 = 2 * Math.PI * Math.sqrt(L / 10), T = 2 * Math.PI * Math.sqrt(L / (10 + a));
          return { enun: R`<p>Um pêndulo de ${F.nt(L)} m está dentro de um elevador que acelera ${F.nt(Math.abs(a))} m/s² para ${a > 0 ? "cima" : "baixo"}. Qual o período? Compare com o elevador parado.</p>`, fig: pendulo(15),
            passos: [R`<p>(i) No referencial do elevador há uma "gravidade efetiva" ${F.ret("A08")}: $g_\text{ef} = g + a$ (com $a$ positivo para cima) $= ${F.n(10 + a)}$ m/s².</p>`, R`<p>(ii) $T = 2\pi\sqrt{\frac L{g_\text{ef}}} = 2\pi\sqrt{\frac{${F.n(L)}}{${F.n(10 + a)}}} \approx ${F.n(T, 3)}$ s.</p>`, R`<p>(iii) Parado: $T_0 \approx ${F.n(T0, 3)}$ s. ${a > 0 ? "Subindo acelerado, o pêndulo fica mais rápido." : "Acelerando para baixo, fica mais lento; em queda livre ($g_\\text{ef} = 0$) nem oscila."} Uma mola, ao contrário, teria o mesmo período em qualquer elevador ($\sqrt{m/k}$ não tem $g$).</p>`] };
        } },
        { nome: "Olimpíada: o anel pendurado num prego", gerar: (p) => {
          const Rr = p ? 0.2 : F.escolha([0.1, 0.2, 0.5]), T = 2 * Math.PI * Math.sqrt((2 * Rr) / 10);
          return { enun: R`<p>Um anel fino de raio ${F.nt(Rr * 100)} cm está pendurado num prego, que passa por dentro dele, e oscila no próprio plano com amplitude pequena. Qual o período? Que comprimento teria um pêndulo simples com o mesmo período?</p>`,
            fig: fig(`<circle cx="280" cy="22" r="4" style="fill:var(--ink)"/><circle cx="280" cy="${22 + 60}" r="60" style="fill:none;stroke:var(--mC);stroke-width:4"/><circle cx="280" cy="82" r="2.5" style="fill:var(--warn)"/>` + D.txt(292, 86, "CM", "tx2", "start"), 160),
            passos: [R`<p>(i) Pêndulo físico: torque do peso em torno do prego, $-Mgd\sin\theta \approx -Mgd\,\theta$, com $d = R$ (o CM é o centro do anel). $\tau = I\alpha$ ${F.ret("A14a")} dá $\ddot\theta = -\frac{MgR}{I}\theta$.</p>`, R`<p>(ii) Eixos paralelos: $I = MR^2 + MR^2 = 2MR^2$. Então $\omega^2 = \frac{g}{2R}$ e $T = 2\pi\sqrt{\frac{2R}g} \approx ${F.n(T, 3)}$ s.</p>`, R`<p>(iii) Mesmo período de um pêndulo simples de comprimento $2R = ${F.n(2 * Rr * 100)}$ cm, o diâmetro do anel. A massa sumiu de novo: só a geometria importa.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O pêndulo que não é tão simples",
      enun: R`<p>Uma estudante mede $g$ com um pêndulo de $L = 1$ m solto a $\theta_0 = 30°$, usando $T = 2\pi\sqrt{L/g}$. O período verdadeiro (em $g = 9{,}81$ m/s²) é 2,0410 s. (a) Por que, para ângulos grandes, o período fica <b>maior</b> que $2\pi\sqrt{L/g}$? (b) Usando conservação da energia, mostre que o período exato é $T = 4\sqrt{\frac{L}{2g}}\int_0^{\theta_0}\frac{d\theta}{\sqrt{\cos\theta - \cos\theta_0}}$. (c) Que valor de $g$ ela encontra se usar a fórmula do pêndulo simples? Qual o erro percentual? (d) Usando a correção $T \approx T_0\left(1 + \frac{\theta_0^2}{16}\right)$ (com $\theta_0$ em radianos), que $g$ ela encontra? (e) A correção funciona a 90°?</p>`,
      fig: pendulo(30, "θ₀ = 30°"),
      dicas: [R`<p>(a) Compare a força restauradora verdadeira, $mg\sin\theta$, com a usada no MHS, $mg\theta$.</p>`, R`<p>(b) Energia: $\frac12mL^2\dot\theta^2 = mgL(\cos\theta - \cos\theta_0)$. Isole $dt$ e integre um quarto de volta.</p>`, R`<p>(c) $g = \frac{4\pi^2L}{T^2}$ com o $T$ verdadeiro.</p>`],
      sol: R`<p><b>(a)</b> Para $\theta > 0$, $\sin\theta < \theta$: a força que puxa de volta é <b>menor</b> que a de uma "mola perfeita". Com menos força, o pêndulo demora mais: o período cresce com a amplitude (o MHS exato é só a aproximação $\sin\theta \approx \theta$ ${F.ret("F05")}).</p>
        <p><b>(b)</b> $\dot\theta = \sqrt{\frac{2g}{L}}\sqrt{\cos\theta - \cos\theta_0} \Rightarrow dt = \sqrt{\frac L{2g}}\frac{d\theta}{\sqrt{\cos\theta - \cos\theta_0}}$. De $0$ a $\theta_0$ é um quarto do período (por simetria). Multiplique por 4. $\blacksquare$ (A integral é "elíptica": não tem fórmula com funções elementares; conferi numericamente que dá 2,0410 s.)</p>
        <p><b>(c)</b> $g = \frac{4\pi^2\cdot1}{2{,}0410^2} \approx 9{,}477$ m/s², erro de $-3{,}4\%$: um erro <b>sistemático</b> (sempre para baixo), que medir mais vezes não corrige.</p>
        <p><b>(d)</b> $T_0 = \frac{2{,}0410}{1 + (\pi/6)^2/16} = \frac{2{,}0410}{1{,}01713} \approx 2{,}0066$ s; $g \approx 9{,}805$ m/s², erro de só $-0{,}05\%$. É a correção que se usa em relatório de laboratório, declarando o ângulo como hipótese.</p>
        <p><b>(e)</b> Razão exata a 90°: 1,1803; com $\frac{\theta_0^2}{16}$: 1,1542 (erro de 2,2%); somando o próximo termo da série, $\frac{11\theta_0^4}{3072}$: 1,1760. Para ângulos grandes, a série precisa de mais termos. Até uns 15°, a correção é menor que 0,5%: por isso a regra "use ângulo pequeno".</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Um bloco de 0,5 kg oscila preso a uma mola de 200 N/m. Qual o período (em s)?</p>`, fig: molaBloco("0,5 kg"), num: { v: Math.PI / 10, tol: 0.01, un: "s" }, dicas: [R`<p>$T = 2\pi\sqrt{m/k}$.</p>`], resp: "π/10 ≈ 0,314 s", sol: R`<p>$2\pi\sqrt{0{,}0025} = 2\pi\cdot0{,}05 \approx 0{,}314$ s.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Qual o período de um pêndulo simples de 1 m ($g = 10$ m/s²), com amplitude pequena?</p>`, num: { v: 2 * Math.PI * Math.sqrt(0.1), tol: 0.01, un: "s" }, dicas: [R`<p>$T = 2\pi\sqrt{L/g}$.</p>`], resp: "≈ 1,99 s", sol: R`<p>$2\pi\sqrt{0{,}1} \approx 1{,}99$ s: cada ida (ou volta) leva ~1 s. Foi assim que se pensou em definir o metro.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>O bloco do exercício 1 é solto a 10 cm do equilíbrio. Qual a velocidade máxima?</p>`, num: { v: 2, un: "m/s" }, dicas: [R`<p>$v_\text{máx} = A\omega$.</p>`], resp: "2 m/s", sol: R`<p>$\omega = 20$ rad/s; $0{,}1\cdot20 = 2$ m/s.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Qual a energia total desse oscilador (k = 200 N/m, A = 10 cm)?</p>`, num: { v: 1, un: "J" }, dicas: [R`<p>No extremo, toda a energia é da mola.</p>`], resp: "1 J", sol: R`<p>$\frac12\cdot200\cdot0{,}01 = 1$ J $= \frac12\cdot0{,}5\cdot2^2$ ✓.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>No mesmo oscilador, qual a velocidade quando o bloco passa por $x = 6$ cm?</p>`, num: { v: 1.6, un: "m/s" }, dicas: [R`<p>$v = \omega\sqrt{A^2 - x^2}$ (sai da energia).</p>`], resp: "1,6 m/s", sol: R`<p>$20\sqrt{0{,}01 - 0{,}0036} = 20\cdot0{,}08 = 1{,}6$ m/s.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>O período de um pêndulo simples (amplitude pequena):</p>`, alts: ["dobra se a massa dobrar.", "dobra se o comprimento dobrar.", "não depende da massa.", "não depende do comprimento.", "é maior na Lua só porque a massa lá é menor."], certa: "C", dicas: [R`<p>Olhe a fórmula: o que aparece nela?</p>`], resp: "C", sol: R`<p>$T = 2\pi\sqrt{L/g}$: sem massa (o peso e a inércia crescem juntos). Dobrar $L$ multiplica $T$ por $\sqrt2$. Na Lua, $T$ é maior porque $g$ é menor; a massa é a mesma.</p>` }),
      F.exercicio({ n: 7, nivel: "Máximo", enun: R`<p>Que comprimento deve ter um pêndulo para ter período de 2 s ($g = 9{,}8$ m/s²)?</p>`, num: { v: 9.8 / (Math.PI * Math.PI), tol: 0.01, un: "m" }, dicas: [R`<p>$L = \frac{gT^2}{4\pi^2}$.</p>`], resp: "≈ 0,993 m", sol: R`<p>$\frac{9{,}8\cdot4}{4\pi^2} = \frac{9{,}8}{\pi^2} \approx 0{,}993$ m. A coincidência $g \approx \pi^2$ vem da proposta antiga de definir o metro pelo "pêndulo que bate o segundo".</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>Duas molas iguais de 100 N/m seguram um bloco de 1 kg. Quantas vezes o período com as molas em série é maior que com as molas em paralelo?</p>`, num: { v: 2 }, dicas: [R`<p>Paralelo: $k = k_1 + k_2$. Série: $\frac1k = \frac1{k_1} + \frac1{k_2}$.</p>`], resp: "2 vezes", sol: R`<p>Paralelo: 200 N/m; série: 50 N/m. Razão das constantes: 4; dos períodos: $\sqrt4 = 2$ (0,889 s contra 0,444 s).</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Pendurando um bloco numa mola vertical, ela estica 5 cm até o equilíbrio. Qual o período das oscilações verticais?</p>`, num: { v: 2 * Math.PI * Math.sqrt(0.005), tol: 0.01, un: "s" }, dicas: [R`<p>No equilíbrio, $kx_0 = mg$, então $\frac mk = \frac{x_0}g$. O peso só muda o ponto de equilíbrio.</p>`], resp: "≈ 0,444 s", sol: R`<p>$T = 2\pi\sqrt{\frac{x_0}g} = 2\pi\sqrt{0{,}005} \approx 0{,}444$ s, sem precisar saber $m$ nem $k$.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Uma barra homogênea de 1 m, pendurada por uma ponta, oscila com amplitude pequena. Qual o período?</p>`, fig: fig(`<circle cx="280" cy="15" r="4" style="fill:var(--ink)"/><rect x="${280 - 4}" y="15" width="8" height="140" transform="rotate(-12 280 15)" style="fill:color-mix(in srgb,var(--mC) 40%,transparent);stroke:var(--mC)"/>`, 165), num: { v: 2 * Math.PI * Math.sqrt(2 / 30), tol: 0.01, un: "s" }, dicas: [R`<p>Pêndulo físico: $T = 2\pi\sqrt{\frac{I}{mgd}}$, com $I = \frac{mL^2}3$ e $d = \frac L2$.</p>`], resp: "≈ 1,62 s", sol: R`<p>$T = 2\pi\sqrt{\frac{2L}{3g}} \approx 1{,}62$ s, igual a um pêndulo simples de $\frac23$ m (e não de 0,5 m: a massa não está toda no CM).</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Um relógio de pêndulo, certo no lugar onde foi regulado, é levado para um lugar com $g$ 0,1% menor. Quantos segundos ele atrasa por dia?</p>`, num: { v: 43.2, tol: 0.02, un: "s" }, dicas: [R`<p>$T \propto g^{-1/2}$: uma variação relativa pequena de $g$ muda $T$ pela metade dela, com sinal trocado ${F.ret("F05")}.</p>`], resp: "≈ 43 s", sol: R`<p>$T$ aumenta $\approx 0{,}05\%$; o relógio conta menos "tiques" por dia: atrasa $86\,400\cdot0{,}0005 \approx 43$ s. Foi assim que se descobriu (Richer, 1672) que $g$ varia com a latitude.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Por que tropas costumam "quebrar o passo" ao atravessar pontes?</p>`, alts: ["Para não cansar os soldados.", "Para a força total ser menor.", "Para não excitar a ponte na frequência natural dela (ressonância).", "Porque o peso total diminui.", "Para a ponte não esquentar."], certa: "C", dicas: [R`<p>O que acontece com um balanço empurrado sempre no mesmo ritmo dele?</p>`], resp: "C", sol: R`<p>Passos sincronizados são uma força periódica; se a frequência coincidir com a da ponte, a amplitude cresce muito (ressonância). Houve acidentes reais (ponte de Broughton, 1831). A ponte do Milênio, em Londres, balançou em 2000 com pedestres se sincronizando sem querer.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · oscilações</div>
        <div class="q">Um relógio de pêndulo, um quartzo de relógio de pulso, uma corda de violão e um átomo num cristal oscilam de jeitos muito diferentes. Por que a mesma equação descreve todos eles?</div>
        <p>Porque perto de qualquer posição de equilíbrio estável a força restauradora é, em primeira aproximação, proporcional ao deslocamento. E força proporcional ao deslocamento sempre dá a mesma coisa: o movimento harmônico simples.</p></div>`),

      F.secao("mhs", "O movimento harmônico simples", R`
        ${F.formula(R`x(t) = A\cos(\omega t + \varphi),\qquad T = \frac{2\pi}{\omega},\qquad f = \frac1T`, "MHS: amplitude A, frequência angular ω, fase φ")}
        <h3>Teorema 1: força $-kx$ produz MHS com $\omega = \sqrt{k/m}$</h3>
        ${F.demo("demonstração", R`<p>(i) 2ª lei com a força da mola (Hooke): $m\ddot x = -kx \Rightarrow \ddot x = -\frac kmx$.</p>
          <p>(ii) Teste $x = A\cos(\omega t + \varphi)$: $\dot x = -A\omega\sin(\omega t + \varphi)$ e $\ddot x = -\omega^2x$ ${F.ret("F04")}. Serve se $\omega^2 = \frac km$, para quaisquer $A$ e $\varphi$ (fixados pela posição e velocidade iniciais).</p>
          <p>(iii) Interpretação: é a <b>sombra</b> (projeção) de um movimento circular uniforme de raio $A$ e velocidade angular $\omega$ ${F.ret("A07")}: a aceleração centrípeta $\omega^2A$ projetada dá $-\omega^2x$. $\blacksquare$</p>`)}
        ${F.formula(R`\omega = \sqrt{\frac km},\quad T = 2\pi\sqrt{\frac mk};\qquad v_\text{máx} = A\omega,\quad a_\text{máx} = A\omega^2`, "Massa–mola")}
        <div id="lab-mhs"></div>
        ${F.caixa("pegadinha", R`<p><b>O período não depende da amplitude</b> (isócrono), desde que a força seja exatamente $-kx$. E $\omega$ (rad/s) não é a frequência $f$ (Hz): $\omega = 2\pi f$. Na mola vertical, o peso só desloca o equilíbrio; o período é o mesmo da horizontal.</p>`)}`),

      F.secao("energia", "Energia no MHS", R`
        <h3>Teorema 2: $E = \frac12kA^2$ e $v = \omega\sqrt{A^2 - x^2}$</h3>
        ${F.demo("demonstração", R`<p>(i) $E = \frac12m\dot x^2 + \frac12kx^2 = \frac12mA^2\omega^2\sin^2(\cdot) + \frac12kA^2\cos^2(\cdot)$.</p>
          <p>(ii) Com $m\omega^2 = k$: $E = \frac12kA^2(\sin^2 + \cos^2) = \frac12kA^2$, constante ${F.ret("A11")}.</p>
          <p>(iii) Isolando a velocidade: $\frac12mv^2 = \frac12k(A^2 - x^2) \Rightarrow v = \omega\sqrt{A^2 - x^2}$. $\blacksquare$</p>`)}
        ${F.formula(R`E = \tfrac12kA^2 = \tfrac12mv_\text{máx}^2,\qquad v = \omega\sqrt{A^2 - x^2}`, "Energia do oscilador")}
        <p>Truque geral: se a energia de um sistema puder ser escrita como $\frac12M\dot q^2 + \frac12Kq^2$ (para qualquer coordenada $q$), ele faz MHS com $\omega = \sqrt{K/M}$.</p>`),

      F.secao("pendulos", "Pêndulos", R`
        <h3>Teorema 3: pêndulo simples e pêndulo físico</h3>
        ${F.demo("demonstração", R`<p>(i) <b>Simples</b>: na direção tangente, $mL\ddot\theta = -mg\sin\theta$. Para ângulos pequenos, $\sin\theta \approx \theta$ ${F.ret("F05")}: $\ddot\theta = -\frac gL\theta$, MHS com $\omega = \sqrt{g/L}$.</p>
          <p>(ii) <b>Físico</b> (corpo rígido girando em torno de um eixo a distância $d$ do CM): $I\ddot\theta = -mgd\sin\theta \approx -mgd\,\theta$ ${F.ret("A14a")}: $\omega = \sqrt{\frac{mgd}I}$.</p>
          ${F.formula(R`T = 2\pi\sqrt{\frac Lg}\quad(\text{simples}),\qquad T = 2\pi\sqrt{\frac I{mgd}}\quad(\text{físico})`, "Pêndulos (amplitude pequena)")}
          <p>(iii) Para amplitudes maiores, $\sin\theta < \theta$ e o período cresce: $T \approx T_0\left(1 + \frac{\theta_0^2}{16}\right)$ (chefão). $\blacksquare$</p>`)}
        ${F.caixa("fisico", R`<p><b>Medir $g$ com um pêndulo</b> é o experimento clássico de laboratório: com $T$ de muitas oscilações e $L$ até o centro de massa, $g = \frac{4\pi^2L}{T^2}$, e a incerteza sai da derivada logarítmica: $\frac{\Delta g}g = \frac{\Delta L}L + 2\frac{\Delta T}T$. Ângulo grande gera erro sistemático para baixo.</p>`)}`),

      F.secao("amortecido", "Amortecimento e ressonância", R`
        <p>Com uma força de atrito viscoso $-bv$: $m\ddot x + b\dot x + kx = 0$. Para $b$ pequeno, $x = A_0e^{-bt/2m}\cos(\omega't)$: a amplitude cai exponencialmente (mexa no $b$ do laboratório). Com uma força externa periódica $F_0\cos(\Omega t)$, depois de um tempo o sistema oscila na frequência $\Omega$ da força, com amplitude máxima quando $\Omega \approx \omega_0$: <b>ressonância</b>.</p>
        ${F.caixa("olimpiada", R`<p><b>Ache o $\omega$ sem resolver nada</b>: escreva a força (ou o torque) para um deslocamento pequeno, linearize (sen θ ≈ θ, $(1 + x)^n \approx 1 + nx$) e leia $\omega^2$ como o coeficiente em $\ddot q = -\omega^2q$. Ou escreva a energia como $\frac12M\dot q^2 + \frac12Kq^2$. Funciona para tubo em U, boia, túnel pela Terra ${F.ret("A16")} e moléculas.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, o oscilador harmônico é o modelo mais importante da física: equações diferenciais lineares e números complexos ($x = \text{Re}(Ae^{i\omega t})$), modos normais de sistemas acoplados, ondas como infinitos osciladores ${F.ret("O01")}, a mecânica de Lagrange e Hamilton ${F.ret("U03")} e o oscilador quântico, com energia em degraus $\hbar\omega\left(n + \frac12\right)$ ${F.ret("U06")}.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-mhs"); e.outerHTML = F.lab("Massa–mola: MHS e amortecimento", "lab-mhs"); SIM.mhs(document.getElementById("lab-mhs"), F); },
});
