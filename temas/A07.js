/* A07 · Movimento Circular. Conferido em Python:
   120 rpm = 2 Hz, T = 0,5 s; 2 Hz: ω = 4π ≈ 12,57 rad/s; R = 0,3 m e ω = 10 rad/s: v = 3 m/s, a_c = 30 m/s²;
   ponteiro dos minutos: ω = 2π/3600 ≈ 1,75e-3 rad/s; engrenagens 10 cm (60 rpm) e 30 cm: 20 rpm;
   bicicleta (coroa 20 cm, catraca 5 cm, roda 35 cm, pedal 1 volta/s): 8,80 m/s; Terra no equador: 463 m/s e 0,0337 m/s²;
   ponteiros se encontram 65,45 min depois do meio-dia; MCUV do repouso com 2 rad/s² por 5 s: 3,98 voltas;
   corredores a 5 e 4 m/s na pista de 400 m: 400 s; correia 5 cm a 1200 rpm → 15 cm: 400 rpm;
   ponteiros a partir de h horas: encontro 60h/11 min depois (3 h → 16,36 min);
   chefão: período sinódico 1/(1/T₁ − 1/T₂): Lua 29,53 dias, Marte 780 dias; ponteiros: 22 encontros e 44 ângulos retos por dia. */
F.registrar("A07", {
  retoma: ["A05", "F03", "A02"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 160) => D.svg(560, h, conteudo, "figura");
    const disco = (cx, cy, r, cor = "var(--mA)") => `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:color-mix(in srgb,${cor} 16%,transparent);stroke:${cor};stroke-width:2"/><circle cx="${cx}" cy="${cy}" r="3" style="fill:var(--ink)"/>`;
    const relogio = (h, m) => { const am = (m / 60) * 2 * Math.PI, ah = ((h % 12) / 12 + m / 720) * 2 * Math.PI; return fig(`<circle cx="280" cy="80" r="66" style="fill:var(--card);stroke:var(--ink2);stroke-width:2"/>` + Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * 2 * Math.PI; return `<line x1="${280 + 58 * Math.sin(a)}" y1="${80 - 58 * Math.cos(a)}" x2="${280 + 64 * Math.sin(a)}" y2="${80 - 64 * Math.cos(a)}" style="stroke:var(--ink2);stroke-width:2"/>`; }).join("") + `<line x1="280" y1="80" x2="${280 + 34 * Math.sin(ah)}" y2="${80 - 34 * Math.cos(ah)}" style="stroke:var(--ink);stroke-width:4;stroke-linecap:round"/><line x1="280" y1="80" x2="${280 + 54 * Math.sin(am)}" y2="${80 - 54 * Math.cos(am)}" style="stroke:var(--mA);stroke-width:2.5;stroke-linecap:round"/>`, 160); };
    const exemplos = F.exemplo({
      titulo: "Movimento circular",
      casos: [
        { nome: "Fácil: das rpm para a velocidade", gerar: (p) => {
          const rpm = p ? 600 : F.escolha([300, 600, 900, 1200]), r = p ? 0.2 : F.escolha([0.1, 0.2, 0.25]), f = rpm / 60, w = 2 * Math.PI * f, v = w * r;
          return { enun: R`<p>O prato de um esmeril gira a ${rpm} rpm e tem raio de ${F.nt(r)} m. Ache a frequência em Hz, o período, a velocidade angular, a rapidez de um ponto da borda e a aceleração centrípeta dele.</p>`,
            fig: fig(disco(280, 80, 62) + D.seta(342, 80, 342, 30, "var(--mA)") + D.txt(352, 40, "v", "txm", "start") + D.txt(280, 158, `R = ${F.t(r, 2)} m`, "tx2")),
            passos: [R`<p>(i) $f = \frac{${rpm}}{60} = ${F.n(f)}$ Hz (voltas por segundo); $T = \frac1f = ${F.n(1 / f, 4)}$ s.</p>`, R`<p>(ii) $\omega = 2\pi f \approx ${F.n(w, 3)}$ rad/s; $v = \omega R \approx ${F.n(v, 3)}$ m/s.</p>`, R`<p>(iii) $a_c = \omega^2R = \frac{v^2}{R} \approx ${F.n(w * w * r, 4)}$ m/s², umas ${F.nt((w * w * r) / 9.8, 0)} vezes $g$: por isso a pedra de um esmeril precisa ser muito resistente.</p>`] };
        } },
        { nome: "Médio: a bicicleta", gerar: (p) => {
          const coroa = p ? 20 : F.escolha([18, 20, 24]), catraca = p ? 5 : F.escolha([4, 5, 6]), roda = p ? 35 : F.escolha([30, 35]), fp = p ? 1 : F.escolha([0.8, 1, 1.5]);
          const fc = fp * (coroa / catraca), v = 2 * Math.PI * fc * (roda / 100);
          return { enun: R`<p>Numa bicicleta, a coroa (presa ao pedal) tem raio ${coroa} cm, a catraca (presa à roda de trás) tem raio ${catraca} cm e a roda tem raio ${roda} cm. O ciclista dá ${F.nt(fp)} pedalada(s) por segundo. Qual a velocidade da bicicleta?</p>`,
            fig: fig(disco(150, 90, coroa * 2.2, "var(--mA)") + disco(380, 90, catraca * 2.2, "var(--mT)") + `<circle cx="380" cy="90" r="${roda * 2}" style="fill:none;stroke:var(--ink3);stroke-width:2"/><line x1="150" y1="${90 - coroa * 2.2}" x2="380" y2="${90 - catraca * 2.2}" style="stroke:var(--ink2);stroke-width:2"/><line x1="150" y1="${90 + coroa * 2.2}" x2="380" y2="${90 + catraca * 2.2}" style="stroke:var(--ink2);stroke-width:2"/>` + D.txt(150, 158, "coroa (pedal)", "tx2") + D.txt(470, 40, "roda", "tx2"), 165),
            passos: [R`<p>(i) A corrente tem a mesma velocidade em toda parte (Teorema 3): $\omega_\text{coroa}R_\text{coroa} = \omega_\text{catraca}R_\text{catraca}$. Então a catraca dá $${F.n(fp)}\cdot\frac{${coroa}}{${catraca}} = ${F.n(fc)}$ voltas por segundo.</p>`, R`<p>(ii) A catraca e a roda estão no mesmo eixo: mesma velocidade angular, $\omega = 2\pi\cdot${F.n(fc)} \approx ${F.n(2 * Math.PI * fc, 3)}$ rad/s.</p>`, R`<p>(iii) Sem escorregar, a bicicleta anda com a rapidez da borda da roda: $v = \omega R_\text{roda} \approx ${F.n(v, 3)}$ m/s $\approx ${F.n(v * 3.6, 1)}$ km/h.</p>`] };
        } },
        { nome: "Olimpíada: quando os ponteiros se encontram?", gerar: (p) => {
          const h = p ? 3 : F.escolha([1, 2, 3, 4, 7, 9]), t = (60 * h) / 11, mm = Math.floor(t), ss = Math.round((t - mm) * 60);
          return { enun: R`<p>São exatamente ${h}h00. Em que horário, pela primeira vez depois disso, o ponteiro dos minutos alcança o das horas?</p>`,
            fig: relogio(h, 0),
            passos: [R`<p>(i) Velocidades angulares: minutos, $\frac{360°}{60\text{ min}} = 6°$/min; horas, $\frac{360°}{12\cdot60\text{ min}} = 0{,}5°$/min.</p>`, R`<p>(ii) Às ${h}h00 o das horas está $${30 * h}°$ à frente. A velocidade angular relativa é $6 - 0{,}5 = 5{,}5°$/min (como a velocidade relativa ${F.ret("A02")}).</p>`, R`<p>(iii) $t = \frac{${30 * h}}{5{,}5} = \frac{60\cdot${h}}{11} \approx ${F.n(t, 2)}$ min: às ${h}h${String(mm).padStart(2, "0")}min${String(ss).padStart(2, "0")}s, aproximadamente.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Relógios, luas e planetas",
      enun: R`<p>Dois corpos giram no mesmo sentido em torno do mesmo centro, com períodos $T_1 < T_2$. O <b>período sinódico</b> $S$ é o tempo entre dois alinhamentos seguidos (o mais rápido "dando uma volta a mais" que o outro). (a) Mostre que $\frac1S = \frac1{T_1} - \frac1{T_2}$. (b) <b>Relógio</b>: quantas vezes por dia os ponteiros das horas e dos minutos ficam sobrepostos? E quantas vezes formam um ângulo reto? (c) <b>Lua</b>: ela dá uma volta na Terra em 27,32 dias (em relação às estrelas), e a Terra dá uma volta no Sol em 365,25 dias, no mesmo sentido. Mostre que de uma lua cheia à outra passam uns 29,5 dias. (d) <b>Marte</b>: período de 687 dias. De quanto em quanto tempo Marte fica mais perto da Terra (oposição)? (e) Por que, na parte (c), o período sinódico é <b>maior</b> que 27,32 dias?</p>`,
      fig: fig(`<circle cx="280" cy="80" r="70" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/><circle cx="280" cy="80" r="40" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/><circle cx="280" cy="80" r="9" style="fill:var(--warn)"/><circle cx="320" cy="80" r="6" style="fill:var(--mA)"/><circle cx="350" cy="80" r="6" style="fill:var(--mT)"/>` + D.txt(320, 100, "1", "tx2") + D.txt(350, 100, "2", "tx2"), 160),
      dicas: [R`<p>(a) Use a velocidade angular relativa: $\omega_1 - \omega_2$. Um alinhamento novo acontece quando o ângulo relativo aumenta de $2\pi$.</p>`, R`<p>(b) Sobreposição: ângulo relativo múltiplo de 360°. Ângulo reto: 90° ou 270° (a cada 180° de ângulo relativo).</p>`],
      sol: R`<p><b>(a)</b> $\omega_1 = \frac{2\pi}{T_1}$, $\omega_2 = \frac{2\pi}{T_2}$. O ângulo entre eles cresce com $\omega_1 - \omega_2$ e precisa crescer $2\pi$: $(\omega_1 - \omega_2)S = 2\pi \Rightarrow \frac1S = \frac1{T_1} - \frac1{T_2}$.</p>
        <p><b>(b)</b> $T_1 = 1$ h, $T_2 = 12$ h: $\frac1S = 1 - \frac1{12} = \frac{11}{12}$, $S = \frac{12}{11}$ h $\approx 65{,}45$ min. Em 24 h: $\frac{24}{12/11} = 22$ sobreposições. Ângulo reto acontece a cada meia "volta relativa": 44 vezes por dia. (Não são 24 nem 48: os ponteiros "perdem" uma sobreposição a cada 12 h, entre as 11h e as 13h.)</p>
        <p><b>(c)</b> $\frac1S = \frac1{27{,}32} - \frac1{365{,}25}$, $S \approx 29{,}53$ dias: o mês lunar.</p>
        <p><b>(d)</b> Agora a Terra é a mais rápida: $\frac1S = \frac1{365{,}25} - \frac1{687}$, $S \approx 780$ dias (2 anos e 50 dias). É por isso que as missões para Marte saem mais ou menos a cada 26 meses.</p>
        <p><b>(e)</b> Enquanto a Lua dá sua volta, a Terra andou ~27° na órbita em torno do Sol, e a direção do Sol mudou junto. Para voltar a ficar do lado oposto ao Sol (lua cheia), a Lua precisa andar esses graus a mais: uns 2,2 dias. Conferido em Python.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Um ventilador gira a 120 rpm. Qual o período, em segundos?</p>`, fig: fig(disco(280, 80, 60) + `<path d="M280 80 L280 25 M280 80 L328 108 M280 80 L232 108" style="stroke:var(--mA);stroke-width:6;stroke-linecap:round"/>`), num: { v: 0.5, un: "s" }, dicas: [R`<p>120 rpm = quantas voltas por segundo?</p>`], resp: "0,5 s", sol: R`<p>$f = 2$ Hz, $T = 0{,}5$ s.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Qual a velocidade angular de algo que gira a 2 Hz?</p>`, num: { v: 4 * Math.PI, tol: 0.005, un: "rad/s" }, dicas: [R`<p>$\omega = 2\pi f$.</p>`], resp: "4π ≈ 12,57 rad/s", sol: R`<p>$2\pi\cdot2 = 4\pi$ rad/s.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Uma roda de raio 0,3 m gira a 10 rad/s. Qual a rapidez de um ponto da borda?</p>`, num: { v: 3, un: "m/s" }, dicas: [R`<p>$v = \omega R$.</p>`], resp: "3 m/s", sol: R`<p>$10\cdot0{,}3 = 3$ m/s.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>No exercício anterior, qual a aceleração centrípeta desse ponto?</p>`, num: { v: 30, un: "m/s²" }, dicas: [R`<p>$a_c = \omega^2R = \frac{v^2}R$.</p>`], resp: "30 m/s²", sol: R`<p>$100\cdot0{,}3 = 30$ m/s².</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Qual a velocidade angular do ponteiro dos minutos de um relógio, em rad/s?</p>`, fig: relogio(10, 10), num: { v: (2 * Math.PI) / 3600, tol: 0.01, un: "rad/s" }, dicas: [R`<p>Uma volta (2π rad) em 1 hora.</p>`], resp: "2π/3600 ≈ 1,75 × 10⁻³ rad/s", sol: R`<p>$\frac{2\pi}{3600} \approx 1{,}75\times10^{-3}$ rad/s.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Duas engrenagens estão em contato: a de raio 10 cm gira a 60 rpm. A quantas rpm gira a de raio 30 cm?</p>`, fig: fig(disco(210, 80, 40, "var(--mA)") + disco(330, 80, 80, "var(--mT)") + D.txt(210, 150, "10 cm", "tx2") + D.txt(330, 150, "30 cm", "tx2")), num: { v: 20, un: "rpm" }, dicas: [R`<p>Mesma rapidez no contato: $f_1R_1 = f_2R_2$.</p>`], resp: "20 rpm", sol: R`<p>$60\cdot\frac{10}{30} = 20$ rpm, no sentido contrário.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Dois pontos estão no mesmo disco que gira: A a 10 cm do centro e B a 20 cm. Qual afirmação é verdadeira?</p>`, alts: ["A e B têm a mesma rapidez.", "A e B têm a mesma velocidade angular; B tem o dobro da rapidez de A.", "A tem o dobro da velocidade angular de B.", "B tem o dobro do período de A.", "A tem maior aceleração centrípeta."], certa: "B", dicas: [R`<p>Num corpo rígido, todos os pontos giram o mesmo ângulo no mesmo tempo.</p>`], resp: "B", sol: R`<p>Mesmo $\omega$ e mesmo período; $v = \omega R$ dobra; $a_c = \omega^2R$ também dobra (B tem a maior aceleração).</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Numa bicicleta, a coroa tem 20 cm de raio, a catraca 5 cm e a roda 35 cm. Pedalando 1 volta por segundo, qual a velocidade da bicicleta?</p>`, num: { v: 2 * Math.PI * 4 * 0.35, tol: 0.01, un: "m/s" }, dicas: [R`<p>A corrente iguala as rapidezes da coroa e da catraca; catraca e roda têm o mesmo $\omega$.</p>`], resp: "≈ 8,8 m/s", sol: R`<p>Catraca: 4 voltas/s; $v = 2\pi\cdot4\cdot0{,}35 \approx 8{,}8$ m/s $\approx 32$ km/h.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Qual a rapidez de um ponto do equador por causa da rotação da Terra (raio 6371 km, uma volta em 24 h)?</p>`, num: { v: 463.3, tol: 0.01, un: "m/s" }, dicas: [R`<p>$v = \frac{2\pi R}T$, com tudo no SI.</p>`], resp: "≈ 463 m/s", sol: R`<p>$\frac{2\pi\cdot6{,}371\times10^6}{86\,400} \approx 463$ m/s (≈ 1670 km/h). A aceleração centrípeta correspondente é só 0,034 m/s², 0,3% de $g$.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Ao meio-dia os ponteiros estão juntos. Depois de quantos minutos eles se encontram de novo?</p>`, fig: relogio(12, 0), num: { v: 720 / 11, tol: 0.005, un: "min" }, dicas: [R`<p>Velocidade angular relativa: $6 - 0{,}5 = 5{,}5$ graus por minuto.</p>`], resp: "720/11 ≈ 65,45 min", sol: R`<p>$\frac{360}{5{,}5} = \frac{720}{11} \approx 65{,}45$ min: às 13h05min27s.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Um disco parte do repouso com aceleração angular constante de 2 rad/s². Quantas voltas ele dá nos primeiros 5 s?</p>`, num: { v: 25 / (2 * Math.PI), tol: 0.01, un: "voltas" }, dicas: [R`<p>MCUV: $\Delta\theta = \omega_0t + \frac12\alpha t^2$, igual ao MUV ${F.ret("A03")}.</p>`], resp: "≈ 3,98 voltas", sol: R`<p>$\Delta\theta = \frac12\cdot2\cdot25 = 25$ rad $= \frac{25}{2\pi} \approx 3{,}98$ voltas.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Dois corredores largam juntos numa pista circular de 400 m, no mesmo sentido, a 5 m/s e 4 m/s. Depois de quanto tempo o mais rápido "dá uma volta" no outro?</p>`, fig: fig(`<ellipse cx="280" cy="80" rx="150" ry="60" style="fill:none;stroke:var(--ink2);stroke-width:8;opacity:.4"/><circle cx="430" cy="80" r="7" style="fill:var(--mA)"/><circle cx="420" cy="105" r="7" style="fill:var(--mT)"/>`), num: { v: 400, un: "s" }, dicas: [R`<p>Precisa abrir 400 m de vantagem, com velocidade relativa de 1 m/s.</p>`], resp: "400 s", sol: R`<p>$\frac{400}{5 - 4} = 400$ s (6 min 40 s). Em sentidos opostos, se cruzariam a cada $\frac{400}{9} \approx 44$ s.</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>Uma polia de 5 cm de raio, num motor a 1200 rpm, move por correia outra polia de 15 cm. A quantas rpm gira a segunda?</p>`, fig: fig(disco(170, 80, 22, "var(--mA)") + disco(390, 80, 66, "var(--mT)") + `<line x1="170" y1="58" x2="390" y2="14" style="stroke:var(--ink2);stroke-width:2"/><line x1="170" y1="102" x2="390" y2="146" style="stroke:var(--ink2);stroke-width:2"/>`), num: { v: 400, un: "rpm" }, dicas: [R`<p>A correia tem a mesma rapidez em todos os pontos.</p>`], resp: "400 rpm", sol: R`<p>$1200\cdot\frac{5}{15} = 400$ rpm, no mesmo sentido (correia aberta).</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · movimento circular</div>
        <div class="q">Numa roda-gigante, quem anda mais rápido: quem está na cabine ou quem está perto do eixo?</div>
        <p>Os dois dão uma volta no mesmo tempo, mas quem está longe do eixo percorre um círculo maior: anda mais rápido. Para descrever bem o que gira, separamos duas ideias: o quanto <b>gira</b> (o ângulo, igual para todos os pontos de um corpo rígido) e o quanto <b>anda</b> (o arco, que depende do raio).</p></div>`),

      F.secao("grandezas", "Grandezas angulares", R`
        ${F.formula(R`s = R\theta,\qquad T = \frac1f,\qquad \omega = \frac{\Delta\theta}{\Delta t} = \frac{2\pi}{T} = 2\pi f`, "Ângulo, período, frequência e velocidade angular")}
        <p>O ângulo em radianos ${F.ret("F03")} é o arco dividido pelo raio. O <b>período</b> $T$ é o tempo de uma volta; a <b>frequência</b> $f$ é o número de voltas por segundo (Hz) ou por minuto (rpm); a <b>velocidade angular</b> $\omega$ é o ângulo varrido por segundo (rad/s).</p>
        <h3>Teorema 1: $v = \omega R$</h3>
        ${F.demo("demonstração", R`<p>(i) Num intervalo $\Delta t$, o raio varre $\Delta\theta$ e o ponto anda o arco $\Delta s = R\Delta\theta$.</p>
          <p>(ii) Dividindo por $\Delta t$: $\frac{\Delta s}{\Delta t} = R\frac{\Delta\theta}{\Delta t}$, ou seja, $v = \omega R$. $\blacksquare$</p>`)}
        ${F.formula(R`v = \omega R = \frac{2\pi R}{T},\qquad a_c = \frac{v^2}{R} = \omega^2R`, "Rapidez e aceleração centrípeta no MCU")}
        <p>A aceleração centrípeta foi demonstrada em ${F.ret("A05")}: no <b>MCU</b> (movimento circular uniforme), a rapidez é constante, mas a velocidade muda de direção, e a aceleração aponta sempre para o centro.</p>
        <div id="lab-circ"></div>`),

      F.secao("funcoes", "MCU e MCUV", R`
        <h3>Teorema 2: as funções horárias angulares</h3>
        ${F.demo("demonstração", R`<p>(i) Com $\omega$ constante, o mesmo raciocínio do MRU ${F.ret("A02")} com $\theta$ no lugar de $s$ dá $\theta = \theta_0 + \omega t$.</p>
          <p>(ii) Com aceleração angular $\alpha = \frac{\Delta\omega}{\Delta t}$ constante (MCUV), a analogia com o MUV ${F.ret("A03")} dá $\omega = \omega_0 + \alpha t$, $\theta = \theta_0 + \omega_0t + \frac12\alpha t^2$ e $\omega^2 = \omega_0^2 + 2\alpha\Delta\theta$.</p>
          <p>(iii) Multiplicando por $R$: $a_t = \alpha R$ é a aceleração tangencial (muda a rapidez). $\blacksquare$</p>`)}
        <table class="tb"><tr><th>linear</th><th>angular</th><th>relação</th></tr><tr><td>$s$</td><td>$\theta$</td><td>$s = R\theta$</td></tr><tr><td>$v$</td><td>$\omega$</td><td>$v = \omega R$</td></tr><tr><td>$a_t$</td><td>$\alpha$</td><td>$a_t = \alpha R$</td></tr></table>
        ${F.caixa("pegadinha", R`<p><b>Graus × radianos</b>: $v = \omega R$ só vale com $\omega$ em rad/s. E rpm não é unidade de velocidade angular do SI: converta primeiro ($\omega = 2\pi f$, com $f$ em voltas por segundo).</p>`)}`),

      F.secao("transmissao", "Transmissão de movimento", R`
        <h3>Teorema 3: correia e engrenagens igualam a rapidez; eixo comum iguala $\omega$</h3>
        ${F.demo("demonstração", R`<p>(i) <b>Correia ou corrente</b> (sem escorregar): todos os pontos dela andam com a mesma rapidez, e ela anda junto com a borda das duas polias. Então $v_1 = v_2$, ou seja, $\omega_1R_1 = \omega_2R_2$ (e $f_1R_1 = f_2R_2$).</p>
          <p>(ii) <b>Engrenagens em contato</b>: os dentes não escorregam, então as bordas têm a mesma rapidez no ponto de contato: $\omega_1R_1 = \omega_2R_2$, mas giram em sentidos opostos.</p>
          <p>(iii) <b>Mesmo eixo</b> (catraca e roda da bicicleta): giram juntas, mesmo $\omega$, e a rapidez é proporcional ao raio. $\blacksquare$</p>`)}
        ${F.caixa("fisico", R`<p><b>Marchas</b>: na bicicleta, a relação coroa/catraca multiplica as voltas da roda. Marcha "pesada" (coroa grande, catraca pequena): cada pedalada leva longe, mas exige mais força. É a mesma troca de um câmbio de carro: velocidade por força.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Velocidade angular relativa</b>: dois corpos girando em torno do mesmo centro se "encontram" de novo quando o ângulo entre eles aumenta $2\pi$: $\frac1S = \frac1{T_1} - \frac1{T_2}$ (mesmo sentido). Resolve ponteiros de relógio, corredores na pista, fases da Lua e janelas de lançamento para Marte (chefão).</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, a velocidade angular é um vetor $\vec\omega$, ao longo do eixo (regra da mão direita), e $\vec v = \vec\omega\times\vec r$ ${F.ret("F02")}. É a base da dinâmica do corpo rígido ${F.ret("A14a")}.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-circ"); e.outerHTML = F.lab("MCU e engrenagens", "lab-circ"); SIM.circular(document.getElementById("lab-circ"), F); },
});
