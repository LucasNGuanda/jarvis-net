/* O04 · Acústica e efeito Doppler. Conferido em Python:
   som no ar √(γRT/M): 331,3 m/s (0 °C), 343,2 (20 °C), 349,0 (30 °C); 10⁻⁵ W/m² = 70 dB; dobrar a intensidade: +3,01 dB;
   ambulância 700 Hz a 30 m/s: 767,1 Hz chegando, 643,7 Hz indo; ouvinte a 20 m/s indo para a fonte: 740,8 Hz;
   Mach 2: meio ângulo do cone 30°, a 5 km de altura o estrondo chega 12,6 s depois de passar por cima; radar 24,15 GHz e 30 m/s: Δf = 4830 Hz. */
F.registrar("O04", {
  retoma: ["O01", "O02", "C18"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Decibéis e Doppler",
      casos: [
        { nome: "Doppler", gerar: (p) => {
          const f = p ? 700 : F.escolha([500, 700, 1000]), vs = p ? 30 : F.escolha([10, 20, 30, 40]), v = 343;
          return { enun: R`<p>Uma ambulância com sirene de ${f} Hz passa por você a ${vs} m/s. Que frequências você ouve quando ela chega e quando ela vai embora? (som a 343 m/s)</p>`, fig: "",
            passos: [R`<p>Fonte chegando: as frentes ficam amontoadas na frente, $\lambda' = (v - v_s)/f$, e $f' = f\frac{v}{v - v_s} = ${f}\cdot\frac{343}{${343 - vs}} \approx ${F.n((f * v) / (v - vs), 1)}$ Hz.</p>`,
              R`<p>Indo embora: $f' = f\frac{v}{v + v_s} \approx ${F.n((f * v) / (v + vs), 1)}$ Hz.</p>`,
              R`<p>O "salto" na passagem é de ${F.n((f * v) / (v - vs) - (f * v) / (v + vs), 0)} Hz, cerca de ${F.n(12 * Math.log2((v + vs) / (v - vs)), 1)} semitons: dá para ouvir a nota cair.</p>`] };
        } },
        { nome: "Nível sonoro", gerar: (p) => {
          const b = p ? 80 : F.escolha([60, 70, 80, 90, 100]), r1 = p ? 10 : F.escolha([2, 5, 10]), r2 = p ? 100 : F.escolha([20, 50, 100]);
          return { enun: R`<p>A ${r1} m de uma caixa de som o nível é ${b} dB. Qual a intensidade? E o nível a ${r2} m (som espalhando igualmente, sem eco)?</p>`, fig: "",
            passos: [R`<p>$\beta = 10\log\frac{I}{I_0}$, com $I_0 = 10^{-12}$ W/m²: $I = 10^{${b / 10} - 12} = 10^{${b / 10 - 12}}$ W/m².</p>`, R`<p>Esfera: $I \propto 1/r^2$. Indo de ${r1} para ${r2} m, a intensidade cai $(${r2}/${r1})^2 = ${F.n((r2 / r1) ** 2)}$ vezes.</p>`, R`<p>Cada fator 10 de intensidade são 10 dB: $\beta = ${b} - 20\log\frac{${r2}}{${r1}} \approx ${F.n(b - 20 * Math.log10(r2 / r1), 1)}$ dB.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O radar da polícia",
      enun: R`<p>Um radar de trânsito emite micro-ondas de $f = 24{,}15$ GHz, que refletem num carro se aproximando a $u$ e voltam ao radar. (a) Que frequência o carro "recebe" (ele é um observador se movendo)? (b) Que frequência volta ao radar (o carro agora é uma fonte se movendo)? (c) Mostre que, para $u \ll c$, a diferença é $\Delta f \approx \frac{2u}{c}f$. (d) Calcule $\Delta f$ para 30 m/s (108 km/h). (e) Por que se pode usar a fórmula do Doppler do som para a luz nesse caso?</p>`,
      fig: "",
      dicas: [R`<p>(a) Observador indo para a fonte: $f_1 = f\frac{c + u}{c}$.</p>`, R`<p>(b) Fonte indo para o observador: $f_2 = f_1\frac{c}{c - u}$. Para (c), use $\frac{1}{1 - x} \approx 1 + x$.</p>`],
      sol: R`<p><b>(a)</b> $f_1 = f\left(1 + \frac uc\right)$.</p>
        <p><b>(b)</b> $f_2 = f_1\frac{c}{c - u} = f\frac{c + u}{c - u}$.</p>
        <p><b>(c)</b> $\frac{1 + u/c}{1 - u/c} \approx (1 + u/c)(1 + u/c) \approx 1 + \frac{2u}{c}$. Então $\Delta f = f_2 - f \approx \frac{2u}{c}f$.</p>
        <p><b>(d)</b> $\Delta f = \frac{2\cdot30}{3\times10^8}\cdot24{,}15\times10^9 = 4830$ Hz. O radar mede essa diferença (o "batimento" entre o sinal enviado e o recebido) e converte em velocidade.</p>
        <p><b>(e)</b> Para a luz, a fórmula certa é a relativística ${F.ret("C18")}: $f_2 = f\frac{c + u}{c - u}$ para a reflexão num espelho em movimento, que por coincidência é exatamente (b). Para um único trajeto, a fórmula relativística $\sqrt{\frac{c + u}{c - u}}$ e a "clássica" diferem só em ordem $(u/c)^2 \sim 10^{-14}$, desprezível. O mesmo princípio mede o fluxo de sangue com ultrassom e a velocidade de galáxias pelo desvio para o vermelho ${F.ret("C21")}.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Ondas · acústica</div>
        <div class="q">Por que a sirene da ambulância "desafina" quando ela passa?</div>
        <p>Ela não desafina: quem muda é a distância entre as frentes de onda que chegam até você. Chegando, a fonte corre atrás das próprias ondas e as amontoa; indo embora, espalha. Esse é o efeito Doppler (1842), que serve para radar de trânsito, ultrassom do coração, previsão do tempo e medir a expansão do universo. Antes, o básico do som: velocidade, intensidade, decibéis e batimentos.</p></div>`),

      F.secao("som", "O som", R`
        ${F.formula(R`v = \sqrt{\frac{\gamma RT}{M}} \approx 331\sqrt{\frac{T}{273\text{ K}}}\ \text{m/s}\qquad\qquad \beta = 10\log_{10}\frac{I}{I_0},\ I_0 = 10^{-12}\ \text{W/m}^2`, "Velocidade do som num gás e nível sonoro")}
        <p>O som é uma onda longitudinal de pressão. No ar a 20 °C, $v \approx 343$ m/s; ela cresce com a raiz da temperatura absoluta e não depende da pressão (para um gás ideal). Na água, ~1480 m/s; no aço, ~5900 m/s.</p>
        <p><b>Decibéis</b>: o ouvido é logarítmico (sente "dobrar" quando a intensidade cresce ~10 vezes). Por isso se usa $\beta$ em dB: cada fator 10 na intensidade soma 10 dB; dobrar a intensidade soma só 3 dB. Conversa: 60 dB; show: 110 dB; limiar da dor: 120 dB ($I = 1$ W/m²).</p>
        <table class="tb"><tr><th>situação</th><th>$I$ (W/m²)</th><th>$\beta$</th></tr><tr><td>limiar da audição</td><td>$10^{-12}$</td><td>0 dB</td></tr><tr><td>conversa</td><td>$10^{-6}$</td><td>60 dB</td></tr><tr><td>rua movimentada</td><td>$10^{-5}$</td><td>70 dB</td></tr><tr><td>show de rock</td><td>$10^{-1}$</td><td>110 dB</td></tr></table>
        ${F.caixa("fisico", R`<p><b>Batimentos</b>: duas notas de 440 e 444 Hz juntas soam como uma de 442 Hz cujo volume pulsa 4 vezes por segundo: $\sin\omega_1t + \sin\omega_2t = 2\cos\frac{(\omega_1 - \omega_2)t}{2}\sin\frac{(\omega_1 + \omega_2)t}{2}$. O envelope tem frequência $\frac{f_1 - f_2}{2}$, mas o volume pulsa com $|f_1 - f_2|$ (o envelope passa por zero duas vezes por ciclo). Afinadores de violão e piano usam isso: afinou quando o batimento some.</p>`)}`),

      F.secao("doppler", "Efeito Doppler e cone de Mach", R`
        ${F.formula(R`f' = f\,\frac{v \pm v_o}{v \mp v_s}\qquad\qquad \sin\theta = \frac{v}{v_s}\ \ (v_s > v)`, "Doppler (sinal de cima: aproximando) e cone de Mach")}
        <p>Regra do sinal: tudo o que aproxima fonte e ouvinte <b>aumenta</b> a frequência. O ouvinte se movendo muda quantas frentes ele cruza por segundo ($v \pm v_o$); a fonte se movendo muda o espaçamento entre as frentes ($v \mp v_s$). Os dois efeitos <b>não são simétricos</b>: o som tem um meio (o ar) e importa quem se move em relação a ele.</p>
        <div id="lab-dop"></div>
        <p>Quando $v_s > v$, a fonte passa à frente das próprias ondas: as frentes se acumulam num cone (o "estrondo sônico"), de meio ângulo $\sin\theta = v/v_s = 1/\text{Mach}$. O mesmo acontece com a luz num meio onde a partícula é mais rápida que $c/n$: é a <b>radiação Cherenkov</b>, o brilho azul dos reatores nucleares submersos.</p>
        ${F.caixa("pegadinha", R`<p><b>A frequência ouvida não muda gradualmente enquanto a ambulância se aproxima em linha reta</b>: ela é constante (mais aguda), cai de repente quando a ambulância passa e fica constante de novo (mais grave). O que muda aos poucos é o volume. (Se ela passa a uma certa distância lateral, a queda é suave, porque só conta a componente da velocidade na sua direção.)</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Qual o nível sonoro de um som de $10^{-5}$ W/m²? Quanto aumenta se a intensidade dobrar? E com 10 fontes iguais?</p>`, fig: "", dicas: [R`<p>$\beta = 10\log(I/10^{-12})$.</p>`, R`<p>$10\log2 \approx 3$ e $10\log10 = 10$.</p>`], resp: R`70 dB; +3 dB; +10 dB.`, sol: R`<p>Dez violinos não soam "dez vezes mais alto": soam só 10 dB a mais (o ouvido percebe ~2 vezes).</p>` }),
        F.exercicio({ n: 2, enun: R`<p>A 10 m de uma caixa de som o nível é 80 dB. Qual o nível a 100 m (sem reflexões)?</p>`, fig: "", dicas: [R`<p>$I \propto 1/r^2$: 10 vezes mais longe, 100 vezes menos intensidade.</p>`, R`<p>Fator 100 = 20 dB.</p>`], resp: R`60 dB.`, sol: R`<p>Regra prática: dobrar a distância tira 6 dB.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Dois diapasões, de 440 Hz e 444 Hz, tocam juntos. O que se ouve?</p>`, fig: "", dicas: [R`<p>Frequência ouvida: a média.</p>`, R`<p>Batimento: a diferença.</p>`], resp: R`Um som de 442 Hz cujo volume pulsa 4 vezes por segundo.`, sol: R`<p>Para afinar o segundo, gira-se a tarraxa até o batimento ficar cada vez mais lento e sumir.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Uma ambulância com sirene de 700 Hz passa a 30 m/s. Que frequências você ouve chegando e indo? E se ela estiver parada e você for até ela a 20 m/s?</p>`, fig: "", dicas: [R`<p>Fonte móvel: $f\frac{v}{v \mp v_s}$.</p>`, R`<p>Observador móvel: $f\frac{v + v_o}{v}$.</p>`], resp: R`$\approx 767$ Hz e $\approx 644$ Hz; $\approx 741$ Hz.`, sol: R`<p>Repare que 20 m/s do ouvinte dão menos efeito que 20 m/s da fonte daria ($700\cdot\frac{343}{323} \approx 743$ Hz): a assimetria vem do ar.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Um avião a Mach 2 passa a 5 km de altura exatamente sobre você. Qual o meio ângulo do cone de Mach e quanto tempo depois você ouve o estrondo?</p>`, fig: "", dicas: [R`<p>$\sin\theta = 1/2$.</p>`, R`<p>O cone chega a você quando o avião já está à frente uma distância $h/\tan\theta$.</p>`], resp: R`$\theta = 30°$; $\approx 12{,}6$ s depois.`, sol: R`<p>$d = 5000/\tan30° \approx 8660$ m, e o avião anda 686 m/s: $8660/686 \approx 12{,}6$ s. Você vê o avião passar em silêncio e só depois ouve o estrondo (e o ronco dos motores).</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>A velocidade do som é $\sqrt{\gamma RT/M}$. Calcule-a a 0 °C, 20 °C e 30 °C (ar: $\gamma = 1{,}4$, $M = 28{,}97$ g/mol). Por que um órgão de igreja desafina com a temperatura?</p>`, fig: "", dicas: [R`<p>$T$ em kelvin.</p>`, R`<p>Num tubo, $f = nv/2L$: o comprimento não muda, $v$ muda.</p>`], resp: R`$\approx 331{,}3$; $343{,}2$; $349{,}0$ m/s. Os tubos sobem de frequência quando esquenta.`, sol: R`<p>De 20 °C para 30 °C, $v$ sobe 1,7%: quase um terço de semitom. Os instrumentos de corda descem (as cordas dilatam e afrouxam). Por isso a orquestra afina depois de aquecer.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Um morcego voa a 10 m/s em direção a uma parede e emite 40 kHz. Que frequência ele ouve no eco?</p>`, fig: "", dicas: [R`<p>A parede "ouve" como observador parado uma fonte se aproximando; depois reemite como fonte parada para um observador se aproximando.</p>`, R`<p>$f'' = f\frac{v + u}{v - u}$.</p>`], resp: R`$40\cdot\frac{353}{333} \approx 42{,}4$ kHz.`, sol: R`<p>O morcego usa essa diferença para saber a que velocidade se aproxima do obstáculo (ou do inseto). Mesmo princípio do radar do chefão.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-dop"); e.outerHTML = F.lab("Frentes de onda de uma fonte em movimento", "lab-dop"); SIM.doppler(document.getElementById("lab-dop"), F); },
});
