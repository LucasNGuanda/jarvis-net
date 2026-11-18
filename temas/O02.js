/* O02 · Fenômenos ondulatórios: reflexão, refração, difração e interferência. Conferido em Python:
   ondas em água rasa v = √(gh): 6,26 m/s (4 m) e 3,13 m/s (1 m), refração de 30° para 14,5°; tsunami (4000 m): 198 m/s = 713 km/h;
   linhas nodais entre duas fontes: 2⌊d/λ + ½⌋ (4 para d = 2λ e para d = 2,2λ). */
F.registrar("O02", {
  retoma: ["O01", "O08", "O10b"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Interferência de duas caixas de som",
      casos: [
        { nome: "Construtiva ou destrutiva?", gerar: (p) => {
          const f = p ? 343 : F.escolha([171.5, 343, 686, 1029]), r1 = p ? 3 : F.escolha([2, 3, 4]), dr = p ? 0.5 : F.escolha([0.25, 0.5, 1, 1.5]);
          const lam = 343 / f, n = dr / lam, inteiro = Math.abs(n - Math.round(n)) < 1e-9, meio = Math.abs(n - Math.floor(n) - 0.5) < 1e-9;
          return { enun: R`<p>Duas caixas de som em fase tocam ${F.nt(f)} Hz. Você está a ${r1} m de uma e a ${F.nt(r1 + dr)} m da outra. O som é reforçado ou cancelado? (som a 343 m/s)</p>`, fig: "",
            passos: [R`<p>$\lambda = \frac{343}{${F.n(f)}} = ${F.n(lam, 3)}$ m.</p>`, R`<p>Diferença de caminho: $\Delta = ${F.n(dr)}$ m $= ${F.n(n, 3)}\lambda$.</p>`,
              R`<p>${inteiro ? "Número inteiro de λ: as cristas chegam juntas, interferência <b>construtiva</b> (som forte)." : meio ? "Meio λ a mais (número semi-inteiro): crista com vale, interferência <b>destrutiva</b> (silêncio, se as amplitudes forem iguais)." : "Nem inteiro nem semi-inteiro: interferência parcial."}</p>`] };
        } },
        { nome: "Refração na praia", gerar: (p) => {
          const h1 = p ? 4 : F.escolha([4, 9, 16]), h2 = p ? 1 : F.escolha([1, 2]), t1 = p ? 30 : F.escolha([20, 30, 45, 60]), g = 9.81;
          const v1 = Math.sqrt(g * h1), v2 = Math.sqrt(g * h2), t2 = (Math.asin((Math.sin((t1 * Math.PI) / 180) * v2) / v1) * 180) / Math.PI;
          return { enun: R`<p>Ondas longas em água rasa andam com $v = \sqrt{gh}$. Uma onda passa de ${h1} m para ${h2} m de profundidade, chegando com ${t1}° em relação à normal da linha de profundidade. Com que ângulo sai?</p>`, fig: "",
            passos: [R`<p>$v_1 = \sqrt{9{,}81\cdot${h1}} \approx ${F.n(v1, 2)}$ m/s e $v_2 \approx ${F.n(v2, 2)}$ m/s.</p>`, R`<p>Snell para ondas ${F.ret("O08")}: $\frac{\sin\theta_1}{v_1} = \frac{\sin\theta_2}{v_2}$.</p>`, R`<p>$\theta_2 \approx ${F.n(t2, 1)}°$: mais perto da normal. Por isso as ondas sempre chegam quase paralelas à praia, de qualquer direção que venham do mar aberto.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Uma antena que só manda para um lado",
      enun: R`<p>Duas antenas (fontes pontuais iguais) estão a $d = \lambda/4$ uma da outra, sobre o eixo $x$. A antena B (em $x = d$) é alimentada com um atraso de fase de $\pi/2$ em relação à A (em $x = 0$). (a) Para um receptor muito longe, na direção que faz ângulo $\theta$ com o eixo $x$, qual a diferença de fase entre as ondas que chegam de A e de B? (b) Mostre que a intensidade é $I(\theta) = 4I_0\cos^2\left(\frac{\pi}{4}(1 - \cos\theta)\right)$. (c) Quanto vale $I$ para $\theta = 0$ e $\theta = 180°$? (d) Para que isso serve?</p>`,
      fig: "",
      dicas: [R`<p>(a) Longe, a diferença de caminho é $d\cos\theta$ (a onda de B sai mais à frente na direção $\theta = 0$). Some a fase do caminho, $kd\cos\theta$, e o atraso de B, $-\pi/2$.</p>`, R`<p>(b) Duas ondas iguais com diferença de fase $\phi$: $I = 4I_0\cos^2(\phi/2)$.</p>`],
      sol: R`<p><b>(a)</b> Na direção $\theta$, a onda de B percorre $d\cos\theta$ a menos (sai mais perto do receptor), o que adianta a fase em $kd\cos\theta = \frac{2\pi}{\lambda}\cdot\frac\lambda4\cos\theta = \frac\pi2\cos\theta$. O atraso elétrico atrasa $\frac\pi2$. Diferença: $\phi = \frac\pi2\cos\theta - \frac\pi2 = -\frac\pi2(1 - \cos\theta)$.</p>
        <p><b>(b)</b> $I = 4I_0\cos^2\frac\phi2 = 4I_0\cos^2\left(\frac\pi4(1 - \cos\theta)\right)$.</p>
        <p><b>(c)</b> $\theta = 0$: $\cos^2 0 = 1$, $I = 4I_0$ (quatro vezes uma antena só). $\theta = 180°$: $\cos^2\frac\pi2 = 0$, $I = 0$: nada vai para trás.</p>
        <p><b>(d)</b> É uma antena <b>direcional</b> ("end-fire"): manda o sinal para um lado só, sem gastar energia no outro. Com várias antenas e atrasos ajustáveis (arranjo de fase), dá para "apontar" o feixe sem mexer em nada: é como funcionam os radares modernos, o 5G e as antenas de satélite da Starlink. Tudo é interferência de duas (ou muitas) fontes.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Ondas · fenômenos</div>
        <div class="q">Por que você ouve quem está atrás da parede, mas não vê?</div>
        <p>Porque o som tem comprimento de onda de metros, do tamanho da porta, e a luz tem meio micrômetro. Ondas fazem quatro coisas que partículas não fazem do mesmo jeito: <b>refletem</b>, <b>refratam</b> (mudam de direção ao mudar de velocidade), <b>difratam</b> (contornam obstáculos) e <b>interferem</b> (somam e se cancelam). Todas saem de uma ideia só: cada ponto de uma frente de onda é uma fonte de novas ondinhas (Huygens, 1678).</p></div>`),

      F.secao("reflexao", "Reflexão, refração e difração", R`
        <ul><li><b>Reflexão</b>: o ângulo de incidência é igual ao de reflexão ${F.ret("O05")}. Eco, sonar e radar são reflexões.</li>
          <li><b>Refração</b>: ao passar para um meio onde a velocidade é outra, a <b>frequência não muda</b> (quem manda é a fonte) e o comprimento de onda muda: $\lambda = v/f$. A direção obedece à lei de Snell ${F.ret("O08")}: $\frac{\sin\theta_1}{v_1} = \frac{\sin\theta_2}{v_2}$.</li>
          <li><b>Difração</b>: ao passar por uma abertura ou contornar um obstáculo de tamanho $a$, a onda se espalha num ângulo $\sim\lambda/a$. Se $a \gg \lambda$, quase nada; se $a \sim \lambda$, muito ${F.ret("O10b")}.</li></ul>
        ${F.formula(R`\frac{\sin\theta_1}{\sin\theta_2} = \frac{v_1}{v_2} = \frac{\lambda_1}{\lambda_2}\qquad\qquad \theta_\text{difração} \sim \frac{\lambda}{a}`, "Refração e difração")}
        ${F.caixa("fisico", R`<p><b>Ondas no mar</b>: em água rasa (profundidade $h \ll \lambda$), $v = \sqrt{gh}$. Chegando à praia, a profundidade diminui, a onda freia, o $\lambda$ encurta, a altura cresce (a energia se concentra) e ela quebra. Um tsunami no oceano aberto (4 km de profundidade) anda a $\sqrt{9{,}81\cdot4000} \approx 198$ m/s, mais de 700 km/h, com só 1 m de altura; perto da costa, freia e cresce dezenas de metros.</p>`)}`),

      F.secao("interferencia", "Superposição e interferência", R`
        <p>Duas ondas no mesmo lugar simplesmente se <b>somam</b> (a equação de onda é linear). Se duas fontes iguais e em fase estão a distâncias $r_1$ e $r_2$ de um ponto:</p>
        ${F.formula(R`|r_1 - r_2| = m\lambda\ \text{(construtiva)}\qquad\qquad |r_1 - r_2| = \left(m + \tfrac12\right)\lambda\ \text{(destrutiva)}`, "Condições de interferência")}
        <p>Os pontos com a mesma diferença de distância a dois focos formam <b>hipérboles</b>: as linhas nodais são hipérboles com focos nas fontes. Entre as fontes, cabem $2\lfloor d/\lambda + \frac12\rfloor$ linhas nodais.</p>
        <div id="lab-int"></div>
        ${F.caixa("pegadinha", R`<p><b>"Onde foi parar a energia?"</b> Nas linhas nodais a amplitude é zero, mas a energia não some: ela é redistribuída para as linhas de reforço, onde a intensidade é 4 vezes a de uma fonte (amplitude dobra, intensidade $\propto A^2$). A média, no espaço, continua sendo a soma das duas.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Batimento</b> é interferência no <b>tempo</b>: duas frequências próximas, $f_1$ e $f_2$, somam um som que "pulsa" $|f_1 - f_2|$ vezes por segundo. Afinadores de piano usam isso (O04).</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Duas caixas de som em fase tocam 343 Hz. Você está a 3 m de uma e a 3,5 m da outra. O que você ouve? (som a 343 m/s)</p>`, fig: "", dicas: [R`<p>$\lambda = 1$ m.</p>`, R`<p>$\Delta = 0{,}5$ m $= \lambda/2$.</p>`], resp: R`Interferência destrutiva: som fraco.`, sol: R`<p>Na prática não é silêncio total, porque as amplitudes não são iguais (distâncias diferentes) e há reflexões na sala.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>No exercício 1, a frequência muda para 686 Hz. E agora?</p>`, fig: "", dicas: [R`<p>$\lambda = 0{,}5$ m.</p>`, R`<p>$\Delta = \lambda$.</p>`], resp: R`Construtiva: som forte.`, sol: R`<p>No mesmo lugar, uma nota some e a outra (uma oitava acima) fica forte. Por isso o som de uma sala muda de um ponto para outro.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Uma onda passa de água com 4 m de profundidade para 1 m, incidindo a 30° da normal. Qual o novo ângulo e o novo comprimento de onda, se era 20 m?</p>`, fig: "", dicas: [R`<p>$v = \sqrt{gh}$: a velocidade cai pela metade.</p>`, R`<p>$\sin\theta_2 = \sin30°\cdot\frac{v_2}{v_1}$; $\lambda$ cai na mesma proporção que $v$.</p>`], resp: R`$\theta_2 \approx 14{,}5°$; $\lambda_2 = 10$ m.`, sol: R`<p>A frequência não muda; $\lambda = v/f$ cai à metade junto com $v$.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Dois pulsos iguais e opostos (um para cima, outro para baixo) se cruzam numa corda. No instante em que se sobrepõem exatamente, a corda fica reta. Onde está a energia nesse instante?</p>`, fig: "", dicas: [R`<p>Reta não quer dizer parada.</p>`, R`<p>Pense na velocidade de cada pedacinho.</p>`], resp: R`Toda em energia cinética: a corda está reta, mas se mexendo.`, sol: R`<p>No instante seguinte, os pulsos reaparecem e seguem viagem. A energia potencial (da deformação) virou cinética e volta a ser potencial.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Por que você escuta uma pessoa falando do outro lado de uma porta aberta, mas não a vê sem estar alinhado com a porta?</p>`, fig: "", dicas: [R`<p>Compare $\lambda$ do som de voz (~1 m) e da luz (~0,5 μm) com a largura da porta.</p>`, R`<p>Ângulo de difração $\sim\lambda/a$.</p>`], resp: R`O som tem λ do tamanho da porta e difrata muito; a luz tem λ um milhão de vezes menor e quase não difrata.`, sol: R`<p>Para a luz, $\lambda/a \sim 10^{-6}$ rad: segue em linha reta, a ótica geométrica vale ${F.ret("O05")}.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Duas fontes em fase estão a $d = 2{,}2\lambda$. Quantas linhas nodais (hipérboles) há? E quantas linhas de máximo?</p>`, fig: "", dicas: [R`<p>Nodais: $|r_1 - r_2| = (m + \frac12)\lambda$, e a diferença de caminho nunca passa de $d$.</p>`, R`<p>Máximos: $|r_1 - r_2| = m\lambda < d$.</p>`], resp: R`4 linhas nodais ($\pm0{,}5\lambda$ e $\pm1{,}5\lambda$) e 5 de máximo ($0$, $\pm\lambda$, $\pm2\lambda$).`, sol: R`<p>$2{,}5\lambda$ já passaria de $d = 2{,}2\lambda$: impossível (a diferença de distâncias a dois pontos nunca supera a distância entre eles). Fórmula: $2\lfloor d/\lambda + \frac12\rfloor = 2\lfloor 2{,}7\rfloor = 4$. Confira no laboratório com d = 6 cm e λ = 2,7 cm.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Um tsunami anda em mar de 4000 m de profundidade. Qual a velocidade? Quanto tempo ele leva para cruzar 5000 km de oceano?</p>`, fig: "", dicas: [R`<p>$v = \sqrt{gh}$ vale porque o $\lambda$ do tsunami (centenas de km) é muito maior que a profundidade.</p>`, R`<p>$t = d/v$.</p>`], resp: R`$\approx 198$ m/s (713 km/h); $\approx 7$ horas.`, sol: R`<p>$5\times10^6/198 \approx 25\,000$ s $\approx 7$ h. É o tempo que os alertas de tsunami têm para avisar o outro lado do oceano.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-int"); e.outerHTML = F.lab("Duas fontes na cuba de ondas", "lab-int"); SIM.interferencia(document.getElementById("lab-int"), F); },
});
