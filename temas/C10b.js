/* C10b · Leis de Kirchhoff e circuitos RC
   Base: Halliday vol. 3, cap. 27 (27-5 a 27-9), reescrito. Contas conferidas em Python (c05b.py); chefão com solve_ivp. */
F.registrar("C10b", {
  retoma: ["C08", "C10", "C11"],
  html(F) {
    const R = String.raw;
    const res = (x1, y1, x2, y2, rot, lado = 1) => { const v = x1 === x2; return `<rect x="${v ? x1 - 13 : (x1 + x2) / 2 - 28}" y="${v ? (y1 + y2) / 2 - 28 : y1 - 13}" width="${v ? 26 : 56}" height="${v ? 56 : 26}" style="fill:var(--card)"/>` + D.comp("resistor", x1, y1, x2, y2, { rot, lado }); };
    const bat = (x, y1, y2, rot, lado = -1) => `<rect x="${x - 16}" y="${Math.min(y1, y2)}" width="32" height="${Math.abs(y2 - y1)}" style="fill:var(--card)"/>` + D.comp("bateria", x, y1, x, y2, { mais: 1, rot, lado, sinais: false });
    const f2m = (E1, E2, R1, R2, R3) => D.svg(460, 200, D.fio([[50, 40], [410, 40], [410, 170], [50, 170], [50, 40]]) + D.fio([[230, 40], [230, 170]]) + D.no(230, 40) + D.no(230, 170) + bat(50, 135, 75, E1 + " V") + res(110, 40, 170, 40, R1 + " Ω") + res(230, 75, 230, 135, R3 + " Ω", -1) + res(290, 40, 350, 40, R2 + " Ω") + bat(410, 135, 75, E2 + " V", 1) + D.txt(240, 30, "V", "txm", "start"), "duas malhas");
    const fig2m = f2m(12, 6, 2, 4, 6);
    const figRC = D.svg(380, 170, D.fio([[50, 40], [320, 40], [320, 140], [50, 140], [50, 40]]) + bat(50, 120, 60, "E") + res(150, 40, 230, 40, "R") + `<rect x="304" y="74" width="32" height="32" style="fill:var(--card)"/><line x1="306" y1="85" x2="334" y2="85" class="ln" style="stroke-width:3"/><line x1="306" y1="95" x2="334" y2="95" class="ln" style="stroke-width:3"/>${D.txt(344, 95, "C", "tx", "start")}<line x1="100" y1="40" x2="124" y2="28" class="ln" style="stroke-width:2.5"/>${D.txt(110, 22, "S", "tx2")}`, "circuito RC");
    const figEscRC = D.svg(460, 170, D.fio([[50, 40], [400, 40]]) + D.fio([[50, 140], [400, 140]]) + D.fio([[50, 40], [50, 140]]) + bat(50, 120, 60, "E") + res(110, 40, 180, 40, "R") + res(280, 40, 350, 40, "R") + [[230, "C₁"], [400, "C₂"]].map(([x, l]) => `<rect x="${x - 16}" y="74" width="32" height="32" style="fill:var(--card)"/><line x1="${x - 14}" y1="85" x2="${x + 14}" y2="85" class="ln" style="stroke-width:3"/><line x1="${x - 14}" y1="95" x2="${x + 14}" y2="95" class="ln" style="stroke-width:3"/><line x1="${x}" y1="40" x2="${x}" y2="85" class="ln"/><line x1="${x}" y1="95" x2="${x}" y2="140" class="ln"/>${D.txt(x + 20, 95, l, "tx", "start")}`).join("") + D.no(230, 40) + D.no(230, 140), "escada RC");

    const exemplario = F.exemplo({ casos: [
      { nome: "Duas malhas", gerar: (p) => {
        const E1 = p ? 12 : F.escolha([6, 9, 12, 15]), E2 = p ? 6 : F.escolha([3, 6, 9]), R1 = p ? 2 : F.escolha([1, 2, 3]), R2 = p ? 4 : F.escolha([2, 4, 6]), R3 = p ? 6 : F.escolha([3, 6, 12]);
        const V = (E1 / R1 + E2 / R2) / (1 / R1 + 1 / R2 + 1 / R3), i1 = (E1 - V) / R1, i2 = (E2 - V) / R2, i3 = V / R3;
        return { enun: R`<p>Duas baterias ($E_1 = ${E1}$ V com $R_1 = ${R1}\ \Omega$; $E_2 = ${E2}$ V com $R_2 = ${R2}\ \Omega$) ligadas em paralelo a $R_3 = ${R3}\ \Omega$ (figura). Ache as três correntes.</p>`, fig: f2m(E1, E2, R1, R2, R3),
          passos: [R`<p><b>Método dos potenciais de nó:</b> aterre o nó de baixo ($V = 0$) e chame o de cima de $V$. Cada corrente "chegando" ao nó de cima: $i_1 = \frac{E_1 - V}{R_1}$, $i_2 = \frac{E_2 - V}{R_2}$; saindo por $R_3$: $i_3 = V/R_3$.</p>`,
            R`<p>Lei dos nós: $\frac{${E1} - V}{${R1}} + \frac{${E2} - V}{${R2}} = \frac{V}{${R3}}$ $\Rightarrow V = ${F.n(V, 3)}$ V.</p>`,
            R`<p>$i_1 = ${F.n(i1, 3)}$ A, $i_2 = ${F.n(i2, 3)}$ A, $i_3 = ${F.n(i3, 3)}$ A. ${i2 < 0 ? "O sinal negativo de $i_2$ diz que a bateria 2 está sendo <b>carregada</b> (corrente entrando pelo +)." : "As duas baterias fornecem corrente."} Confere: $i_1 + i_2 = i_3$ ✓.</p>`] }; } },
      { nome: "Carga do capacitor", gerar: (p) => {
        const Rr = p ? 10 : F.escolha([1, 4.7, 10, 47]), C = p ? 100 : F.escolha([10, 47, 100, 470]), f = p ? 90 : F.escolha([50, 63, 90, 99]), tau = (Rr * 1e3 * C * 1e-6), t = -tau * Math.log(1 - f / 100);
        return { enun: R`<p>$R = ${F.n(Rr, 1)}$ kΩ, $C = ${C}$ µF, capacitor descarregado. Fecha-se a chave. Quanto tempo até ele chegar a $${f}\%$ da tensão final?</p>`, fig: figRC,
          passos: [R`<p>$V_C(t) = E\left(1 - e^{-t/\tau}\right)$, com $\tau = RC = ${F.n(tau, 3)}$ s.</p>`, R`$$1 - e^{-t/\tau} = ${F.n(f / 100, 2)}\;\Rightarrow\;t = -\tau\ln(1 - ${F.n(f / 100, 2)}) = ${F.n(t, 3)}\ \text{s}$$`, R`<p>Ou $${F.n(t / tau, 2)}\tau$. Regras para lembrar: 63% em $\tau$, 90% em $2{,}3\tau$, 99% em $4{,}6\tau$.</p>`] }; } },
    ] });

    const X = F.exercicio;
    const exsF = [
      X({ n: 1, marcas: ["★"], enun: R`<p>No circuito, ache as correntes nos três resistores e diga se alguma bateria está sendo carregada.</p>`, fig: fig2m, dicas: [R`<p>Potencial do nó de cima: $V$.</p>`, R`<p>$\frac{12 - V}{2} + \frac{6 - V}{4} = \frac V6$.</p>`], resp: R`$V \approx 8{,}18$ V; $1{,}91$ A no de 2 Ω, $1{,}36$ A no de 6 Ω e $0{,}55$ A no de 4 Ω, <b>carregando</b> a bateria de 6 V.`, sol: R`<p>$7{,}5 = V(\frac12 + \frac14 + \frac16) \Rightarrow V = 8{,}18$ V. $i_2 = (6 - 8{,}18)/4 = -0{,}55$ A: a corrente entra no + da bateria de 6 V.</p>` }),
      X({ n: 2, enun: R`<p>$R = 10$ kΩ, $C = 100$ µF. Quanto tempo para carregar 90%?</p>`, fig: figRC, dicas: [R`<p>$\tau = RC = 1$ s.</p>`, R`<p>$e^{-t/\tau} = 0{,}1$.</p>`], resp: R`$\approx 2{,}3$ s.`, sol: R`<p>$t = \tau\ln10 \approx 2{,}30$ s.</p>` }),
      X({ n: 3, enun: R`<p>Na descarga de um RC, em quanto tempo a tensão cai à metade? E a energia?</p>`, fig: figRC, dicas: [R`<p>$V = V_0e^{-t/\tau}$.</p>`, R`<p>Energia $\propto V^2$: cai com $e^{-2t/\tau}$.</p>`], resp: R`Tensão: $\tau\ln2 \approx 0{,}69\tau$; energia: $\frac{\tau\ln2}{2} \approx 0{,}35\tau$.`, sol: R`<p>"Meia-vida" do RC, como no decaimento radioativo ${F.ret("C19")}.</p>` }),
      X({ n: 4, marcas: ["★", "?"], enun: R`<p>Uma bateria de $12$ V carrega um capacitor de $100$ µF através de um resistor. Quanta energia fica no capacitor, quanta a bateria forneceu e quanta virou calor? Depende de R?</p>`, fig: figRC, dicas: [R`<p>Bateria: $W = QE = CE^2$.</p>`, R`<p>Capacitor: $\frac12CE^2$.</p>`], resp: R`$7{,}2$ mJ guardados, $14{,}4$ mJ fornecidos, $7{,}2$ mJ de calor. Não depende de R.`, sol: R`<p>Metade sempre vira calor, qualquer que seja R (com R pequeno, a corrente é grande e curta; com R grande, pequena e longa; a integral $\int Ri^2dt = \frac12CE^2$ dá o mesmo). Para guardar com menos perda é preciso carregar devagar com uma fonte que sobe aos poucos.</p>` }),
      X({ n: 5, enun: R`<p>Ache o equivalente de Thévenin de uma fonte de $12$ V com um divisor de $4\ \Omega$ (em cima) e $12\ \Omega$ (embaixo), visto da saída. Qual a corrente numa carga de $6\ \Omega$?</p>`, fig: "", dicas: [R`<p>$E_{th}$ = tensão em aberto; $R_{th}$ = resistência vista com a fonte em curto.</p>`, R`<p>$E_{th} = 9$ V; $R_{th} = 4\parallel12$.</p>`], resp: R`$E_{th} = 9$ V, $R_{th} = 3\ \Omega$; $1{,}0$ A.`, sol: R`<p>$i = 9/(3 + 6) = 1{,}0$ A. Conferindo direto: $12\parallel6 = 4$, $i_\text{total} = 12/8 = 1{,}5$ A, $V = 6$ V, $i_\text{carga} = 1{,}0$ A ✓.</p>` }),
      X({ n: 6, enun: R`<p>Fonte de $10$ V; $R_1 = 2\ \Omega$ em série com o paralelo de $R_2 = 3\ \Omega$ e um ramo com $C = 10$ µF em série com $R_3 = 5\ \Omega$. Depois de muito tempo, qual a carga no capacitor?</p>`, fig: "", dicas: [R`<p>Em regime, capacitor = circuito aberto: sem corrente em $R_3$.</p>`, R`<p>$i = 10/5$; $V_C = V_{R_2}$.</p>`], resp: R`$Q = 60$ µC.`, sol: R`<p>$i = 2$ A pela malha $R_1$–$R_2$; $V_C = 3\times2 = 6$ V (sem queda em $R_3$); $Q = 60$ µC.</p>` }),
    ];
    const exsM = [
      X({ n: 7, marcas: ["!", "★"], enun: R`<p>Um capacitor de $10$ µF carregado a $100$ V é ligado, por um resistor, a outro capacitor igual, descarregado. Qual a energia final? Quanto virou calor?</p>`, fig: "", dicas: [R`<p>Carga se conserva; no fim, mesma tensão.</p>`, R`<p>$V_f = 50$ V.</p>`], resp: R`$25$ mJ finais de $50$ mJ: $25$ mJ de calor, qualquer que seja o resistor.`, sol: R`<p>$U_0 = \frac12CV^2 = 50$ mJ; $U_f = 2\cdot\frac12C(50)^2 = 25$ mJ. Mesmo com resistência tendendo a zero, metade se perde (em radiação, nesse limite).</p>` }),
      X({ n: 8, marcas: ["RU"], enun: R`<p>Oscilador de lâmpada neon: $E = 100$ V, $R = 1{,}0$ MΩ, $C = 1{,}0$ µF. A lâmpada (em paralelo com C) acende a $80$ V, descarrega C instantaneamente até $60$ V, e apaga. Qual o período?</p>`, fig: figRC, dicas: [R`<p>Entre 60 e 80 V, o capacitor carrega pela exponencial em direção a 100 V.</p>`, R`<p>$t = RC\ln\frac{E - 60}{E - 80}$.</p>`], resp: R`$T = \ln2 \approx 0{,}69$ s.`, sol: R`<p>$100 - V = 40e^{-t/\tau}$; chega a 80 V quando $e^{-t/\tau} = 1/2$: $t = \tau\ln2 \approx 0{,}69$ s. Pisca ~1,4 vez por segundo.</p>` }),
      X({ n: 9, marcas: ["∫", "!"], enun: R`<p>Mostre, integrando, que na carga de um RC o calor dissipado no resistor é $\frac12CE^2$.</p>`, fig: figRC, dicas: [R`<p>$i = \frac ERe^{-t/\tau}$.</p>`, R`<p>$\int_0^\infty Ri^2dt = \frac{E^2}{R}\int_0^\infty e^{-2t/RC}dt$.</p>`], resp: R`$\frac{E^2}{R}\cdot\frac{RC}{2} = \frac12CE^2$.`, sol: R`<p>Resultado do exercício 4, agora demonstrado.</p>` }),
    ];

    const chefao = F.chefao({ titulo: "A escada RC áurea", fig: figEscRC,
      enun: R`<p>Dois estágios RC em cascata (figura): $E \to R \to$ nó 1 (com $C_1 = C$ para a terra) $\to R \to$ nó 2 (com $C_2 = C$ para a terra). Tudo descarregado; em $t = 0$ liga-se a fonte $E$. Use $RC = 1$ s.</p>
        <ol type="a"><li>Escreva as equações diferenciais para $V_1(t)$ e $V_2(t)$.</li><li>Ache as duas constantes de tempo do sistema. (Elas têm a ver com a razão áurea.)</li><li>Escreva $V_2(t)$.</li><li>Em quanto tempo $V_2$ chega a $E/2$? Compare com um RC simples.</li></ol>`,
      dicas: [R`<p>(a) Lei dos nós em cada nó: corrente que chega pelo resistor da esquerda = corrente no capacitor + corrente que sai pelo da direita.</p>`, R`<p>(b) Procure soluções $e^{\lambda t}$ do sistema homogêneo: $\lambda$ são autovalores de $\frac{1}{RC}\begin{pmatrix}-2 & 1\\ 1 & -1\end{pmatrix}$. (d) Resolva numericamente.</p>`],
      sol: R`<p><b>(a)</b> $C\dot V_1 = \frac{E - V_1}{R} - \frac{V_1 - V_2}{R}$ e $C\dot V_2 = \frac{V_1 - V_2}{R}$.</p>
        <p><b>(b)</b> $\det\begin{pmatrix}-2-\lambda & 1\\ 1 & -1-\lambda\end{pmatrix} = \lambda^2 + 3\lambda + 1 = 0 \Rightarrow \lambda = \frac{-3 \pm\sqrt5}{2}$. Constantes de tempo $-1/\lambda$: $\frac{2}{3 - \sqrt5} = \varphi^2 \approx 2{,}618$ s e $\frac{2}{3+\sqrt5} = \varphi^{-2} \approx 0{,}382$ s, com $\varphi = \frac{1+\sqrt5}{2}$.</p>
        <p><b>(c)</b> $V_2 = E\left[1 - Ae^{-t/2{,}618} + Be^{-t/0{,}382}\right]$ com $V_2(0) = 0$ e $\dot V_2(0) = 0$ (o capacitor 2 só começa a receber corrente depois que $V_1$ sobe): $A \approx 1{,}171$, $B \approx 0{,}171$ (exatamente $A = \frac{\varphi^2}{\sqrt5}$, $B = \frac{\varphi^{-2}}{\sqrt5}$).</p>
        <p><b>(d)</b> Numericamente, $t_{1/2} \approx 2{,}22$ s. Um RC simples chegaria a 50% em $\ln 2 \approx 0{,}69$ s. Cada estágio "atrasa" e "arredonda" o sinal: é um filtro passa-baixa de 2ª ordem, e a curva de $V_2$ começa com tangente horizontal.</p>` });

    return [
      F.secao("abertura", "Pergunta de abertura", R`<div class="abertura"><div class="det">Antes de tudo</div><div class="q">Por que a luz de cortesia do carro apaga devagar, em vez de apagar de uma vez?</div></div>`),
      F.secao("laboratorio", "Laboratório: carga e descarga de um RC", R`<p>Carregue, descarregue, troque R e C. As bolinhas andam mais devagar à medida que o capacitor enche.</p>
        ${F.chute({ q: "dobrando R e dobrando C, o tempo para carregar 63%:", ops: ["fica igual", "dobra", "quadruplica", "cai pela metade"], certa: 2, exp: R`<p>$\tau = RC$: <b>quadruplica</b>. A tensão final continua a mesma (a da fonte).</p>` })}
        <div id="lab-rc"></div>`),
      F.secao("ideia", "A ideia física", R`<p>Quando um circuito não se reduz a série e paralelo (duas baterias em lugares diferentes, pontes), voltamos aos dois princípios de base: <b>conservação da carga</b> (nós) e <b>conservação da energia</b> (malhas). Eles sempre funcionam.</p>
        <p>Com capacitores, aparece o <b>tempo</b>: carregar um capacitor através de um resistor não é instantâneo. Quanto mais carga ele tem, maior a tensão que "empurra de volta", e menor a corrente. Resultado: uma exponencial, com escala de tempo $\tau = RC$. A luz de cortesia usa exatamente isso.</p>`),
      F.secao("teoria", "Teoria completa", R`
        <h3>1. Leis de Kirchhoff</h3>
        ${F.formula(R`\text{Nós: }\sum i_\text{entram} = \sum i_\text{saem}\qquad\text{Malhas: }\sum\Delta V = 0`, "Kirchhoff")}
        <p>Nós: conservação da carga ${F.ret("C06")}. Malhas: o potencial é uma função do ponto, então dar uma volta e voltar ao mesmo ponto tem $\Delta V$ total zero ${F.ret("C04")}.</p>
        <p><b>Convenção de sinais na malha</b> (andando num sentido escolhido): resistor no sentido da corrente: $-Ri$; bateria do − para o +: $+E$.</p>
        ${F.fig(fig2m)}
        <h3>2. Métodos sistemáticos</h3>
        <p><b>Potenciais de nó</b> (o melhor na maioria dos casos): escolha um nó como terra, chame os outros de $V_1, V_2, \dots$, escreva a lei dos nós em cada um com $i = \Delta V/R$. Dá um sistema linear com (nós − 1) incógnitas. <b>Correntes de malha:</b> uma corrente fictícia por "janela" do circuito, lei das malhas em cada uma.</p>
        ${F.caixa("fisico", R`<p>Se uma corrente der negativa, não errou: o sentido real é o contrário do que você chutou. Não precisa acertar os sentidos antes.</p>`)}
        <h3>3. Superposição e Thévenin</h3>
        <p>Circuitos com resistores e fontes são <b>lineares</b>: a resposta a várias fontes é a soma das respostas a cada uma sozinha (as outras zeradas: fonte de tensão vira curto). Daí sai o teorema de Thévenin ${F.ret("C10")}.</p>
        <h3>4. Circuito RC: carga</h3>
        ${F.fig(figRC)}
        ${F.demo("carga do capacitor", R`<p>(i) Malha: $E - Ri - \frac qC = 0$, com $i = \frac{dq}{dt}$.</p><p>(ii) $\frac{dq}{dt} = \frac{CE - q}{RC}$. Separando: $\int_0^q\frac{dq'}{CE - q'} = \int_0^t\frac{dt'}{RC} \Rightarrow -\ln\frac{CE - q}{CE} = \frac{t}{RC}$.</p>${F.formula(R`q(t) = CE\left(1 - e^{-t/RC}\right),\qquad i(t) = \frac ERe^{-t/RC},\qquad \tau = RC`)}`)}
        <p>Em $t = 0$, o capacitor vazio se comporta como um <b>fio</b> ($i = E/R$). Em $t \to \infty$, como um <b>circuito aberto</b> ($i = 0$). Use isso para analisar circuitos maiores nos dois extremos sem resolver nada.</p>
        <h3>5. Descarga</h3>
        ${F.formula(R`q(t) = q_0e^{-t/RC},\qquad i(t) = -\frac{q_0}{RC}e^{-t/RC}`)}
        <h3>6. Energia no RC</h3>
        <p>Na carga, a bateria fornece $QE = CE^2$; o capacitor guarda $\frac12CE^2$; o resistor dissipa a outra metade, <b>independentemente de R</b> (exercícios 4 e 9).</p>
        ${F.caixa("ponte", R`<p>A equação $\dot q = -q/\tau$ é a mesma do decaimento radioativo ${F.ret("C19")}, do resfriamento de Newton ${F.ret("T02")} e da velocidade com arrasto linear ${F.ret("A09")}. Com indutores entra a 2ª derivada e aparecem oscilações (RLC) ${F.ret("C15b")}.</p>`)}
        ${F.caixa("olimpiada", R`<p>Circuitos com vários capacitores dão sistemas de EDOs lineares: as constantes de tempo são os autovalores de uma matriz (chefão). Truque prático: os valores <b>inicial</b> (capacitores como fios, se descarregados) e <b>final</b> (capacitores como abertos) se acham sem resolver nada.</p>`)}`),
      F.secao("exemplos", "Exemplos passo a passo", exemplario),
      F.secao("resumo", "Resumo", R`<div class="resumo"><div class="r"><b>Nós</b>$\sum i_\text{entram} = \sum i_\text{saem}$</div><div class="r"><b>Malhas</b>$\sum\Delta V = 0$</div><div class="r"><b>RC carga</b>$q = CE(1 - e^{-t/\tau})$, $\tau = RC$</div><div class="r"><b>RC descarga</b>$q = q_0e^{-t/\tau}$</div><div class="r"><b>Extremos</b>C vazio = fio; C cheio = aberto</div><div class="r"><b>Energia</b>metade vira calor</div></div>`),
      F.secao("exercicios", "Exercícios", `<div class="exs-nivel"><h3>Nível Físico</h3><span class="selo">fixação</span></div>${exsF.join("")}<div class="exs-nivel"><h3>Nível Máximo</h3><span class="selo">OBF · ITA · RU</span></div>${exsM.join("")}`),
      F.secao("chefao", "Chefão", chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-rc"); e.outerHTML = F.lab("Circuito RC: carga e descarga", "lab-rc"); SIM.rc(document.getElementById("lab-rc"), F); },
});
