/* A15 · Leis de Kepler. Conferido em Python:
   Marte a = 1,52 UA: T = 1,874 ano; T = 8 anos: a = 4 UA; Halley T = 76 anos: a = 17,94 UA, periélio 0,59 → afélio 35,3 UA, e = 0,967;
   Terra: afélio/periélio = 1,017/0,983 = 1,035; geoestacionário (GM = 3,986e14, T = 86 164 s): r = 42 164 km (com 24 h: 42 241 km);
   massa da Terra pela Lua (r = 3,84e8 m, T = 27,3 dias): 6,0e24 kg; satélite a 4 R_T × Lua a 60 R_T: 27,3·(1/15)^1,5 = 0,470 dia = 11,3 h;
   cometa com periélio 1 UA e afélio 9 UA: vp/va = 9, a = 5 UA, T = 11,18 anos;
   chefão: transferência de Hohmann Terra (1 UA) → Marte (1,524 UA): a = 1,262 UA, T = 1,418 ano, meia volta = 0,709 ano = 259 dias;
   Marte anda 135,6° nesse tempo → deve estar 44,4° à frente; janela a cada 2,135 anos (780 dias); vp/va da transferência = 1,524. */
F.registrar("A15", {
  retoma: ["A07", "A10", "A14a"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const elipse = (e, extra = "") => { const A = 180, B = A * Math.sqrt(1 - e * e), fx = 280 + A * e; return fig(`<ellipse cx="280" cy="85" rx="${A}" ry="${B * 0.42}" style="fill:none;stroke:var(--ink3);stroke-width:1.5"/><circle cx="${fx}" cy="85" r="8" style="fill:var(--warn)"/>` + extra, 170); };
    const exemplos = F.exemplo({
      titulo: "Kepler",
      casos: [
        { nome: "Fácil: o ano de outro planeta", gerar: (p) => {
          const pl = p ? ["Marte", 1.52] : F.escolha([["Marte", 1.52], ["Júpiter", 5.2], ["Vênus", 0.72], ["Saturno", 9.54]]), T = Math.pow(pl[1], 1.5);
          return { enun: R`<p>${pl[0]} está, em média, a ${F.nt(pl[1])} UA do Sol (1 UA = distância média Terra–Sol). Quanto dura o ano de ${pl[0]}?</p>`,
            fig: fig(`<circle cx="120" cy="85" r="12" style="fill:var(--warn)"/><circle cx="120" cy="85" r="60" style="fill:none;stroke:var(--ink3)"/><circle cx="120" cy="85" r="${Math.min(60 * pl[1], 400)}" style="fill:none;stroke:var(--mA);stroke-dasharray:5 4"/><circle cx="180" cy="85" r="5" style="fill:var(--mA)"/>` + D.txt(180, 75, "Terra", "tx2"), 170),
            passos: [R`<p>(i) 3ª lei de Kepler, comparando com a Terra (mesmo Sol): $\frac{T^2}{a^3} = \frac{(1\text{ ano})^2}{(1\text{ UA})^3}$.</p>`, R`<p>(ii) Com $T$ em anos e $a$ em UA: $T^2 = a^3 \Rightarrow T = ${F.n(pl[1])}^{3/2}$.</p>`, R`<p>(iii) $T \approx ${F.n(T, 3)}$ anos ($\approx ${F.n(T * 365.25, 3)}$ dias). Escolher bem as unidades evita usar $G$ e a massa do Sol.</p>`] };
        } },
        { nome: "Médio: o cometa", gerar: (p) => {
          const rp = p ? 1 : F.escolha([0.5, 1, 2]), ra = p ? 9 : F.escolha([9, 15, 31]), a = (rp + ra) / 2, T = Math.pow(a, 1.5);
          return { enun: R`<p>Um cometa passa a ${F.nt(rp)} UA do Sol no periélio e se afasta até ${ra} UA no afélio. Qual o período? Quantas vezes mais rápido ele anda no periélio do que no afélio?</p>`, fig: elipse(0.8, D.txt(470, 80, "periélio", "tx2", "start") + D.txt(90, 80, "afélio", "tx2", "end")),
            passos: [R`<p>(i) O eixo maior é a soma das distâncias mínima e máxima: $2a = ${F.n(rp)} + ${ra} \Rightarrow a = ${F.n(a)}$ UA.</p>`, R`<p>(ii) $T = a^{3/2} = ${F.n(a)}^{3/2} \approx ${F.n(T, 3)}$ anos.</p>`, R`<p>(iii) Nos extremos, a velocidade é perpendicular ao raio; pela 2ª lei (momento angular), $v_pr_p = v_ar_a \Rightarrow \frac{v_p}{v_a} = \frac{${ra}}{${F.n(rp)}} = ${F.n(ra / rp, 3)}$.</p>`] };
        } },
        { nome: "Olimpíada: pesando a Terra com a Lua", gerar: (p) => {
          const r = p ? 3.84e8 : F.escolha([3.84e8, 3.85e8]), T = p ? 27.3 : F.escolha([27.3, 27.32]), M = (4 * Math.PI * Math.PI * r ** 3) / (6.674e-11 * (T * 86400) ** 2);
          return { enun: R`<p>A Lua orbita a Terra a ${F.cient(r)} m, com período de ${F.nt(T)} dias. Sabendo $G = 6{,}674\times10^{-11}$ N·m²/kg², qual a massa da Terra?</p>`,
            fig: fig(`<circle cx="200" cy="85" r="26" style="fill:color-mix(in srgb,var(--mA) 60%,transparent)"/><circle cx="200" cy="85" r="140" style="fill:none;stroke:var(--ink3);stroke-dasharray:5 4"/><circle cx="340" cy="85" r="8" style="fill:var(--ink2)"/>`, 170),
            passos: [R`<p>(i) Órbita quase circular: a gravidade é a resultante centrípeta ${F.ret("A10")}: $\frac{GMm}{r^2} = m\omega^2r = m\frac{4\pi^2}{T^2}r$.</p>`, R`<p>(ii) $M = \frac{4\pi^2r^3}{GT^2}$, com $T = ${F.nt(T)}\cdot86\,400$ s.</p>`, R`<p>(iii) $M \approx ${F.sigL(M, 3)}$ kg (o valor aceito é $5{,}97\times10^{24}$; a diferença vem de a Lua não girar em torno do centro da Terra, mas do CM do par ${F.ret("A12b")}). A massa da Lua sumiu: é assim que se "pesam" planetas que têm satélites.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Viagem a Marte pelo caminho mais barato",
      enun: R`<p>Uma sonda sai da órbita da Terra (circular, 1 UA) e vai até a de Marte (circular, 1,524 UA) pela <b>órbita de transferência de Hohmann</b>: meia elipse com periélio na Terra e afélio em Marte, tangente às duas órbitas. (a) Qual o semieixo maior da elipse de transferência? (b) Quanto tempo dura a viagem? (c) Que ângulo Marte deve estar à frente da Terra (visto do Sol) no lançamento, para chegar lá junto com a sonda? (d) De quanto em quanto tempo essa configuração se repete (a "janela de lançamento")? (e) Quantas vezes mais rápido a sonda anda na partida do que na chegada?</p>`,
      fig: fig(`<circle cx="280" cy="85" r="10" style="fill:var(--warn)"/><circle cx="280" cy="85" r="50" style="fill:none;stroke:var(--mA);stroke-dasharray:4 4"/><circle cx="280" cy="85" r="76" style="fill:none;stroke:var(--bad);stroke-dasharray:4 4"/><path d="M330 85 A63 63 0 0 0 204 85" style="fill:none;stroke:var(--ink2);stroke-width:2"/><circle cx="330" cy="85" r="5" style="fill:var(--mA)"/><circle cx="${280 + 76 * Math.cos(0.774)}" cy="${85 - 76 * Math.sin(0.774)}" r="5" style="fill:var(--bad)"/>` + D.txt(345, 90, "Terra", "tx2", "start") + D.txt(350, 20, "Marte", "tx2", "start"), 175),
      dicas: [R`<p>(a) Periélio + afélio = eixo maior.</p>`, R`<p>(b) A viagem é <b>meia</b> volta da elipse; use $T^2 = a^3$.</p>`, R`<p>(c) Marte precisa estar, no fim, do lado oposto ao ponto de partida (180° depois). Quanto Marte anda durante a viagem?</p>`, R`<p>(d) É o período sinódico ${F.ret("A07")}: $\frac1{T_\text{sin}} = \frac1{T_\text{Terra}} - \frac1{T_\text{Marte}}$.</p>`],
      sol: R`<p><b>(a)</b> $2a = 1 + 1{,}524 \Rightarrow a = 1{,}262$ UA.</p>
        <p><b>(b)</b> $T = 1{,}262^{3/2} \approx 1{,}418$ ano; a viagem é metade: $\approx 0{,}709$ ano $\approx 259$ dias (uns 8 meses e meio, como as missões reais).</p>
        <p><b>(c)</b> Período de Marte: $1{,}524^{3/2} \approx 1{,}881$ ano. Em 0,709 ano, Marte anda $360°\cdot\frac{0{,}709}{1{,}881} \approx 135{,}6°$. Como a sonda anda 180°, Marte deve sair $180° - 135{,}6° \approx 44{,}4°$ à frente.</p>
        <p><b>(d)</b> $\frac{1}{T_\text{sin}} = 1 - \frac1{1{,}881} \Rightarrow T_\text{sin} \approx 2{,}135$ anos $\approx 780$ dias. Por isso as missões a Marte saem em "ondas" a cada uns 26 meses (2020: Perseverance, Tianwen-1 e Hope, todas juntas).</p>
        <p><b>(e)</b> 2ª lei nos extremos: $\frac{v_p}{v_a} = \frac{r_a}{r_p} = 1{,}524$. (Para calcular os valores em km/s e quanto o foguete precisa acelerar, falta a energia gravitacional ${F.ret("A16")}.)</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Segundo a 1ª lei de Kepler, a órbita de um planeta é:</p>`, alts: ["um círculo com o Sol no centro.", "uma elipse com o Sol no centro.", "uma elipse com o Sol num dos focos.", "uma parábola com o Sol no foco.", "um círculo com o Sol fora do centro."], certa: "C", dicas: [R`<p>A elipse tem dois focos e um centro. Onde fica o Sol?</p>`], resp: "C", sol: R`<p>Elipse, Sol num foco; o outro foco é um ponto vazio. As órbitas dos planetas são quase circulares (a da Terra tem $e \approx 0{,}017$).</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Marte está, em média, a 1,52 UA do Sol. Quanto dura o ano marciano, em anos terrestres?</p>`, num: { v: Math.pow(1.52, 1.5), tol: 0.01, un: "anos" }, dicas: [R`<p>$T^2 = a^3$ (anos, UA).</p>`], resp: "≈ 1,87 ano", sol: R`<p>$1{,}52^{1{,}5} \approx 1{,}87$ ano.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Um asteroide tem período de 8 anos. Qual o semieixo maior da órbita (em UA)?</p>`, num: { v: 4, un: "UA" }, dicas: [R`<p>$a = T^{2/3}$.</p>`], resp: "4 UA", sol: R`<p>$a^3 = 64 \Rightarrow a = 4$ UA.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Um planeta leva 30 dias para varrer uma área $A$ perto do periélio. Quanto tempo leva para varrer a mesma área perto do afélio?</p>`, fig: elipse(0.6, `<path d="M${280 + 108} 85 L470 85 L455 60 Z" style="fill:color-mix(in srgb,var(--mA) 30%,transparent)"/><path d="M${280 + 108} 85 L100 85 L104 70 Z" style="fill:color-mix(in srgb,var(--mC) 30%,transparent)"/>`), alts: ["Menos de 30 dias.", "30 dias.", "Mais de 30 dias.", "Depende da massa do planeta.", "Depende da excentricidade."], certa: "B", dicas: [R`<p>Leia a 2ª lei com cuidado: o que é igual em tempos iguais?</p>`], resp: "B", sol: R`<p>Áreas iguais em tempos iguais: 30 dias. O que muda é o <b>comprimento</b> do arco (longo perto do Sol, curto longe), não a área.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Um cometa tem periélio a 1 UA e afélio a 9 UA. Quantas vezes mais rápido ele anda no periélio?</p>`, num: { v: 9 }, dicas: [R`<p>Nos extremos, $v_pr_p = v_ar_a$.</p>`], resp: "9 vezes", sol: R`<p>$\frac{v_p}{v_a} = \frac91 = 9$.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Qual o período desse mesmo cometa (periélio 1 UA, afélio 9 UA), em anos?</p>`, num: { v: Math.pow(5, 1.5), tol: 0.01, un: "anos" }, dicas: [R`<p>Ache primeiro o semieixo maior.</p>`], resp: "≈ 11,2 anos", sol: R`<p>$a = \frac{1 + 9}{2} = 5$ UA; $T = 5^{1{,}5} \approx 11{,}2$ anos. Quem usa $a = 9$ (só o afélio) acha 27 anos.</p>` }),
      F.exercicio({ n: 7, nivel: "Máximo", enun: R`<p>O cometa Halley tem período de 76 anos e passa a 0,59 UA do Sol no periélio. A que distância do Sol fica o afélio (em UA)?</p>`, num: { v: 2 * Math.pow(76, 2 / 3) - 0.59, tol: 0.01, un: "UA" }, dicas: [R`<p>$a = T^{2/3}$; afélio $= 2a -$ periélio.</p>`], resp: "≈ 35,3 UA", sol: R`<p>$a = 76^{2/3} \approx 17{,}9$ UA; afélio $\approx 35{,}9 - 0{,}59 \approx 35{,}3$ UA, além de Netuno. Excentricidade $\approx 0{,}967$.</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>A que distância do centro da Terra fica um satélite geoestacionário (período de 1 dia, ≈ 86 164 s)? Use $GM_\text{Terra} = 3{,}986\times10^{14}$ m³/s². Responda em km.</p>`, num: { v: 42164, tol: 0.02, un: "km" }, dicas: [R`<p>Gravidade = centrípeta: $r^3 = \frac{GMT^2}{4\pi^2}$.</p>`], resp: "≈ 42 200 km", sol: R`<p>$r = \left(\frac{3{,}986\times10^{14}\cdot86\,164^2}{4\pi^2}\right)^{1/3} \approx 4{,}22\times10^7$ m $\approx 42\,200$ km, uns 35 800 km de altitude. (O dia "sideral", 23 h 56 min, é o período de rotação em relação às estrelas.)</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>A Lua está a 60 raios terrestres do centro da Terra e tem período de 27,3 dias. Qual o período de um satélite a 4 raios terrestres, em horas?</p>`, num: { v: 27.3 * 24 * Math.pow(4 / 60, 1.5), tol: 0.02, un: "h" }, dicas: [R`<p>3ª lei para o mesmo corpo central: $\frac{T_1}{T_2} = \left(\frac{r_1}{r_2}\right)^{3/2}$.</p>`], resp: "≈ 11,3 h", sol: R`<p>$T = 27{,}3\cdot\left(\frac{4}{60}\right)^{1{,}5} \approx 0{,}470$ dia $\approx 11{,}3$ h.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>A Terra está a 0,983 UA do Sol no periélio (janeiro) e a 1,017 UA no afélio (julho). Quantos por cento mais rápido ela anda em janeiro do que em julho?</p>`, num: { v: 100 * (1.017 / 0.983 - 1), tol: 0.05, un: "%" }, dicas: [R`<p>$v_pr_p = v_ar_a$.</p>`], resp: "≈ 3,5%", sol: R`<p>$\frac{1{,}017}{0{,}983} \approx 1{,}035$: 3,5% mais rápido. Por isso o verão do hemisfério norte (julho, Terra mais lenta) dura uns 4 a 5 dias a mais que o inverno de lá.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>A 3ª lei de Kepler, $T^2 = a^3$ (anos, UA), vale para:</p>`, alts: ["qualquer corpo orbitando qualquer astro.", "os corpos que orbitam o Sol (com massa desprezível perto dele).", "só os planetas com órbitas circulares.", "só a Terra.", "satélites da Terra, com as mesmas unidades."], certa: "B", dicas: [R`<p>De onde vem a constante? (Veja a demonstração.)</p>`], resp: "B", sol: R`<p>A constante é $\frac{4\pi^2}{GM}$ e depende do corpo central. Em anos e UA ela vale 1 só para o Sol. Para luas de Júpiter vale outra constante.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Usando a Lua ($r = 3{,}84\times10^8$ m, $T = 27{,}3$ dias) e $G = 6{,}674\times10^{-11}$, estime a massa da Terra (em kg).</p>`, num: { v: 6.02e24, tol: 0.03, un: "kg" }, dicas: [R`<p>$M = \frac{4\pi^2r^3}{GT^2}$, com $T$ em segundos.</p>`], resp: "≈ 6,0 × 10²⁴ kg", sol: R`<p>$M \approx \frac{39{,}5\cdot5{,}66\times10^{25}}{6{,}674\times10^{-11}\cdot5{,}56\times10^{12}} \approx 6{,}0\times10^{24}$ kg.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · órbitas</div>
        <div class="q">Sem telescópio, sem cálculo e sem Newton, Kepler descobriu as leis do movimento dos planetas só com as medidas de Tycho Brahe. Como uma tabela de ângulos virou três leis tão simples?</div>
        <p>Foram anos testando hipóteses: círculos não serviam (Marte errava por 8 minutos de arco). A elipse serviu. Décadas depois, Newton mostrou que as três leis saem de uma só: a gravitação universal.</p></div>`),

      F.secao("leis", "As três leis", R`
        ${F.formula(R`r_\text{periélio} = a(1 - e),\qquad r_\text{afélio} = a(1 + e),\qquad 2a = r_p + r_a`, "1ª lei: elipse com o Sol num foco")}
        <p>$a$ é o semieixo maior (a "distância média" das tabelas), $e$ a excentricidade (0 = círculo). Soma das distâncias aos dois focos $= 2a$ em qualquer ponto.</p>
        ${F.formula(R`\frac{dA}{dt} = \text{constante}\qquad\qquad \frac{T^2}{a^3} = \frac{4\pi^2}{GM}`, "2ª lei (áreas) e 3ª lei (períodos)")}
        <div id="lab-orbita"></div>
        ${F.caixa("pegadinha", R`<p><b>As estações não vêm da distância ao Sol.</b> A Terra está mais perto do Sol em janeiro, no verão do hemisfério sul e no inverno do norte. Quem faz as estações é a inclinação do eixo (23,4°). A órbita da Terra é quase um círculo: a distância varia só 3,4%.</p>`)}`),

      F.secao("areas", "A lei das áreas é conservação do momento angular", R`
        <h3>Teorema 1: força central ⟹ áreas iguais em tempos iguais</h3>
        ${F.demo("demonstração", R`<p>(i) Em $dt$, o raio vetor varre um triângulo fininho de lados $\vec r$ e $\vec v\,dt$: $dA = \frac12|\vec r\times\vec v\,dt|$ (metade do paralelogramo ${F.ret("F02")}).</p>
          <p>(ii) Então $\frac{dA}{dt} = \frac{|\vec r\times\vec v|}{2} = \frac{L}{2m}$, com $\vec L = \vec r\times m\vec v$ o momento angular ${F.ret("A14a")}.</p>
          <p>(iii) A gravidade aponta para o Sol, paralela a $\vec r$: torque $\vec r\times\vec F = 0$, então $\vec L$ é constante (e a órbita fica num plano). Logo $\frac{dA}{dt}$ é constante. $\blacksquare$</p>`)}
        ${F.formula(R`v_p\,r_p = v_a\,r_a`, "Velocidades nos extremos (velocidade perpendicular ao raio)")}
        <p>Isso vale para qualquer força central, não só a gravidade: Kepler 2 é muito mais geral que Kepler 1 e 3.</p>`),

      F.secao("periodos", "A 3ª lei e a gravitação", R`
        <h3>Teorema 2: $T^2 = \frac{4\pi^2}{GM}r^3$ para órbitas circulares</h3>
        ${F.demo("demonstração", R`<p>(i) Na órbita circular, a gravidade de Newton é a resultante centrípeta ${F.ret("A10")}: $\frac{GMm}{r^2} = m\omega^2r$.</p>
          <p>(ii) Com $\omega = \frac{2\pi}T$: $\frac{GM}{r^2} = \frac{4\pi^2r}{T^2} \Rightarrow T^2 = \frac{4\pi^2}{GM}r^3$. A massa do planeta cancela. $\blacksquare$</p>
          <p>(iii) Para elipses vale o mesmo com $r \to a$ (sai da solução completa do problema de Kepler, na universidade). Ao contrário: se $T^2 \propto r^3$ para órbitas circulares, a força tem que cair com $1/r^2$; foi assim que Newton chegou à lei da gravitação ${F.ret("A16")}.</p>`)}
        <h3>Teorema 3: unidades astronômicas tiram $G$ e $M$ da conta</h3>
        ${F.demo("demonstração", R`<p>(i) Para dois corpos orbitando o mesmo Sol, $\frac{T_1^2}{a_1^3} = \frac{T_2^2}{a_2^3}$ (a constante é a mesma).</p>
          <p>(ii) Com o corpo 2 = Terra ($T_2 = 1$ ano, $a_2 = 1$ UA): $T^2 = a^3$ com $T$ em anos e $a$ em UA. $\blacksquare$</p>`)}
        ${F.caixa("fisico", R`<p><b>Como "pesar" uma galáxia.</b> Medindo a velocidade de estrelas longe do centro, a 3ª lei dá a massa dentro da órbita. As estrelas da borda giram rápido demais para a massa visível: é a principal evidência da matéria escura.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Período sinódico + Kepler 3</b> resolvem janelas de lançamento, oposições e trânsitos: $\frac1{T_\text{sin}} = \left|\frac1{T_1} - \frac1{T_2}\right|$ ${F.ret("A07")}. E nas elipses: nos extremos use $v_pr_p = v_ar_a$, e $a = \frac{r_p + r_a}2$.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, o problema de Kepler é resolvido inteiro: com $L$ e energia conservados, a equação da órbita dá cônicas (elipse, parábola, hipérbole) em uma linha, usando $u = 1/r$. Existe ainda uma conservação "escondida", o vetor de Laplace–Runge–Lenz, que explica por que a elipse não gira. Na relatividade geral, ela gira um pouquinho: a precessão de Mercúrio ${F.ret("U03")}.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-orbita"); e.outerHTML = F.lab("Órbita de Kepler", "lab-orbita"); SIM.orbita(document.getElementById("lab-orbita"), F); },
});
