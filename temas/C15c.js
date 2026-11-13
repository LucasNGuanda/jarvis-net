/* C15c · Corrente Alternada
   Escrito do zero (o material do Halliday enviado para no início do cap. 31). Contas conferidas em Python (c06.py). */
F.registrar("C15c", {
  retoma: ["C15", "C15b"],
  html(F) {
    const R = String.raw;
    const figSeno = D.svg(440, 170, `${D.eixos({ x0: 30, y0: 85, w: 400, h: 70, xlab: "t", ylab: "" })}<path d="${Array.from({ length: 161 }, (_, k) => (k ? "L" : "M") + (30 + (400 * k) / 160).toFixed(1) + " " + (85 - 60 * Math.sin((4 * Math.PI * k) / 160)).toFixed(1)).join(" ")}" style="fill:none;stroke:var(--mod);stroke-width:2.4"/><line x1="30" y1="${85 - 60 / Math.SQRT2}" x2="430" y2="${85 - 60 / Math.SQRT2}" style="stroke:var(--warn);stroke-dasharray:5 4"/>${D.txt(434, 85 - 60 / Math.SQRT2 + 4, "V_ef", "tx2", "start")}${D.txt(20, 30, "V_m", "tx2", "end")}`, "senoide");
    const figRLC = D.svg(460, 170, D.fio([[50, 40], [420, 40], [420, 140], [50, 140], [50, 40]]) + `<circle cx="50" cy="90" r="18" style="fill:var(--card);stroke:var(--ink);stroke-width:2"/><path d="M40 90 q5 -10 10 0 q5 10 10 0" class="ln"/>` + `<rect x="110" y="28" width="60" height="24" style="fill:var(--card)"/>` + D.comp("resistor", 110, 40, 170, 40, { rot: "R" }) + `<rect x="210" y="22" width="80" height="24" style="fill:var(--card)"/><path d="M210 40 a8 8 0 0 1 16 0 a8 8 0 0 1 16 0 a8 8 0 0 1 16 0 a8 8 0 0 1 16 0 a8 8 0 0 1 16 0" class="ln"/>${D.txt(250, 18, "L", "tx")}<rect x="330" y="24" width="24" height="32" style="fill:var(--card)"/><line x1="337" y1="26" x2="337" y2="54" class="ln" style="stroke-width:3"/><line x1="347" y1="26" x2="347" y2="54" class="ln" style="stroke-width:3"/>${D.txt(342, 18, "C", "tx")}`, "RLC série");
    const figTrafo = D.svg(400, 180, `<rect x="140" y="30" width="120" height="120" rx="6" style="fill:none;stroke:var(--ink3);stroke-width:14"/>${Array.from({ length: 5 }, (_, k) => `<ellipse cx="140" cy="${50 + 20 * k}" rx="16" ry="6" style="fill:none;stroke:#c98a4a;stroke-width:2.5"/>`).join("")}${Array.from({ length: 9 }, (_, k) => `<ellipse cx="260" cy="${42 + 12 * k}" rx="16" ry="5" style="fill:none;stroke:#c98a4a;stroke-width:2"/>`).join("")}${D.txt(80, 95, "N₁", "tx")}${D.txt(320, 95, "N₂", "tx")}`, "transformador");

    const exemplario = F.exemplo({ casos: [
      { nome: "RLC série", gerar: (p) => {
        const Rr = p ? 100 : F.escolha([20, 50, 100, 200]), L = p ? 0.5 : F.escolha([0.1, 0.2, 0.5]), Cc = p ? 20 : F.escolha([10, 20, 50]), V = p ? 220 : F.escolha([127, 220]), f = p ? 60 : F.escolha([50, 60, 100]);
        const w = 2 * Math.PI * f, XL = w * L, XC = 1 / (w * Cc * 1e-6), Z = Math.hypot(Rr, XL - XC), I = V / Z, phi = (Math.atan2(XL - XC, Rr) * 180) / Math.PI;
        return { enun: R`<p>RLC série: $R = ${Rr}\ \Omega$, $L = ${L}$ H, $C = ${Cc}$ µF, ligado a $${V}$ V (eficaz), $${f}$ Hz. Ache a impedância, a corrente, a fase e a potência média.</p>`, fig: figRLC,
          passos: [R`<p>Reatâncias: $X_L = \omega L = ${F.m(XL, 1)}\ \Omega$; $X_C = \frac{1}{\omega C} = ${F.m(XC, 1)}\ \Omega$.</p>`, R`$$Z = \sqrt{R^2 + (X_L - X_C)^2} = ${F.m(Z, 1)}\ \Omega,\qquad I_\text{ef} = \frac{V_\text{ef}}{Z} = ${F.m(I, 3)}\ \text{A}$$`,
            R`<p>Fase: $\tan\varphi = \frac{X_L - X_C}{R}$, $\varphi = ${F.m(phi, 1)}°$ (${phi > 0 ? "indutivo: a corrente atrasa" : "capacitivo: a corrente adianta"}).</p>`, R`<p>Potência média: só o resistor dissipa: $P = I_\text{ef}^2R = ${F.m(I * I * Rr, 1)}$ W; fator de potência $\cos\varphi = ${F.m(Rr / Z, 3)}$.</p>`] }; } },
      { nome: "Transformador", gerar: (p) => {
        const V1 = p ? 220 : F.escolha([127, 220]), V2 = p ? 12 : F.escolha([5, 9, 12, 24]), N1 = p ? 1100 : F.escolha([500, 1000, 1100, 2200]), I2 = p ? 2 : F.escolha([0.5, 1, 2, 5]);
        return { enun: R`<p>Transformador ideal de $${V1}$ V para $${V2}$ V com $${N1}$ espiras no primário, alimentando uma carga que puxa $${I2}$ A. Quantas espiras no secundário e qual a corrente no primário?</p>`, fig: figTrafo,
          passos: [R`<p>Mesmo fluxo por espira nas duas bobinas: $\frac{V_2}{V_1} = \frac{N_2}{N_1}$, então $N_2 = ${F.m((N1 * V2) / V1, 0)}$.</p>`, R`<p>Ideal: potência entra = sai: $V_1I_1 = V_2I_2 \Rightarrow I_1 = ${F.m((V2 * I2) / V1, 4)}$ A.</p>`] }; } },
    ] });

    const X = F.exercicio;
    const exsF = [
      X({ n: 1, enun: R`<p>A tomada é de "$127$ V". Qual a tensão de pico?</p>`, fig: figSeno, dicas: [R`<p>Os 127 V são o valor <b>eficaz</b>.</p>`, R`<p>$V_m = \sqrt2V_\text{ef}$.</p>`], resp: R`$\approx 180$ V.`, sol: R`<p>$127\sqrt2 \approx 179{,}6$ V. A tensão oscila entre −180 V e +180 V, 60 vezes por segundo.</p>` }),
      X({ n: 2, enun: R`<p>Reatância de um indutor de $0{,}10$ H e de um capacitor de $10$ µF a $60$ Hz.</p>`, fig: "", dicas: [R`<p>$X_L = \omega L$; $X_C = 1/(\omega C)$.</p>`, R`<p>$\omega = 377$ rad/s.</p>`], resp: R`$X_L \approx 38\ \Omega$; $X_C \approx 265\ \Omega$.`, sol: R`<p>$X_L = 37{,}7\ \Omega$, $X_C = 265\ \Omega$. Em frequência mais alta, o indutor "segura" mais e o capacitor menos.</p>` }),
      X({ n: 3, marcas: ["★"], enun: R`<p>RLC série com $R = 100\ \Omega$, $L = 0{,}50$ H, $C = 20$ µF em $220$ V, $60$ Hz. Impedância, corrente eficaz e potência média.</p>`, fig: figRLC, dicas: [R`<p>$X_L = 188{,}5$; $X_C = 132{,}6$.</p>`, R`<p>$Z = \sqrt{100^2 + 55{,}9^2}$; $P = I^2R$.</p>`], resp: R`$Z \approx 115\ \Omega$; $I \approx 1{,}9$ A; $P \approx 3{,}7\times10^2$ W.`, sol: R`<p>$Z = 114{,}5\ \Omega$; $I = 1{,}92$ A; $P = 369$ W; $\cos\varphi = 0{,}873$; $\varphi \approx 29°$ (indutivo).</p>` }),
      X({ n: 4, enun: R`<p>Frequência de ressonância desse mesmo circuito?</p>`, fig: figRLC, dicas: [R`<p>$X_L = X_C$.</p>`, R`<p>$f_0 = \frac{1}{2\pi\sqrt{LC}}$.</p>`], resp: R`$\approx 50$ Hz.`, sol: R`<p>$f_0 = 1/(2\pi\sqrt{10^{-5}}) \approx 50{,}3$ Hz. Na ressonância, $Z = R$ e a corrente é máxima: $2{,}2$ A.</p>` }),
      X({ n: 5, enun: R`<p>Um transformador ideal reduz $220$ V para $12$ V e tem 1100 espiras no primário. Espiras no secundário? Se a carga puxa $2{,}0$ A, quanto o primário puxa?</p>`, fig: figTrafo, dicas: [R`<p>$V_2/V_1 = N_2/N_1$.</p>`, R`<p>$V_1I_1 = V_2I_2$.</p>`], resp: R`$60$ espiras; $\approx 0{,}11$ A.`, sol: R`<p>$N_2 = 60$; $I_1 = 24/220 \approx 0{,}109$ A.</p>` }),
    ];
    const exsM = [
      X({ n: 6, marcas: ["★"], enun: R`<p>Uma usina entrega $100$ kW por uma linha de $5{,}0\ \Omega$. Perda na linha se a transmissão for feita a (a) $220$ V; (b) $10$ kV; (c) $200$ kV.</p>`, fig: "", dicas: [R`<p>$I = P/V$; perda $RI^2$.</p>`, R`<p>Perda $\propto 1/V^2$.</p>`], resp: R`(a) impossível (~1 MW > 100 kW!); (b) $500$ W; (c) $1{,}25$ W.`, sol: R`<p>(a) $I = 455$ A, perda $\approx 1{,}03$ MW: mais do que se transmite. (b) $10$ A, $500$ W (0,5%). (c) $0{,}5$ A, $1{,}25$ W. É por isso que se usa corrente alternada: o transformador sobe a tensão para transmitir e baixa para usar. Foi a "guerra das correntes", Tesla × Edison.</p>` }),
      X({ n: 7, marcas: ["!"], enun: R`<p>Filtro RC passa-baixas ($R = 1{,}0$ kΩ, $C = 0{,}10$ µF; saída no capacitor). Qual a frequência de corte, e que fração da amplitude passa a $10$ kHz?</p>`, fig: "", dicas: [R`<p>Divisor de tensão com impedâncias: $\frac{V_s}{V_e} = \frac{X_C}{\sqrt{R^2 + X_C^2}} = \frac{1}{\sqrt{1 + (\omega RC)^2}}$.</p>`, R`<p>Corte: $\omega RC = 1$.</p>`], resp: R`$f_c \approx 1{,}6$ kHz; $\approx 16\%$.`, sol: R`<p>$f_c = 1/(2\pi RC) \approx 1592$ Hz; a 10 kHz: $1/\sqrt{1 + (10/1{,}592)^2} \approx 0{,}157$. Graves passam, agudos são cortados: é o "controle de tom" mais simples.</p>` }),
      X({ n: 8, marcas: ["∫", "!"], enun: R`<p>Mostre que o valor eficaz de uma senoide é $V_m/\sqrt2$ e que a potência média num resistor é $V_\text{ef}^2/R$. Qual o valor eficaz de uma onda quadrada de amplitude $V_m$? E de uma onda triangular?</p>`, fig: figSeno, dicas: [R`<p>$V_\text{ef}^2 = \frac1T\int_0^TV^2dt$.</p>`, R`<p>$\overline{\sin^2} = \frac12$. Triangular: $\frac1T\int_0^T(\ldots)^2 = V_m^2/3$.</p>`], resp: R`Senoide $V_m/\sqrt2$; quadrada $V_m$; triangular $V_m/\sqrt3$.`, sol: R`<p>"Eficaz" é a tensão contínua que daria a mesma potência média. Senoide: $\overline{\sin^2} = \frac12$. Quadrada: $V^2 = V_m^2$ sempre. Triangular: a tensão varre linearmente de $-V_m$ a $V_m$, e a média de $u^2$ com $u$ uniforme em $[-1, 1]$ é $\int_{-1}^1u^2\frac{du}{2} = \frac13$: $V_\text{ef} = V_m/\sqrt3$.</p>` }),
    ];

    const chefao = F.chefao({ titulo: "Sintonizando uma rádio AM", fig: figRLC,
      enun: R`<p>O circuito de sintonia de um rádio é um RLC série com $L = 200$ µH. Você quer sintonizar uma estação de $1{,}000$ MHz e, ao mesmo tempo, reduzir a amplitude da corrente de uma estação vizinha de $1{,}010$ MHz para no máximo $10\%$ da corrente na ressonância (mesma tensão de sinal).</p>
        <ol type="a"><li>Que capacitância sintoniza 1,000 MHz?</li><li>Mostre que $\dfrac{I(\omega)}{I_0} = \dfrac{1}{\sqrt{1 + Q^2\left(\frac{\omega}{\omega_0} - \frac{\omega_0}{\omega}\right)^2}}$, com $Q = \dfrac1R\sqrt{\dfrac LC}$.</li><li>Qual o fator de qualidade $Q$ mínimo, e a resistência máxima permitida?</li><li>Qual a largura de banda (entre os pontos de potência metade) nessa situação? Por que isso cria um problema para a música transmitida?</li></ol>`,
      dicas: [R`<p>(b) $Z = \sqrt{R^2 + (\omega L - \frac{1}{\omega C})^2}$; fatore $R$ e use $\omega_0L = \frac{1}{\omega_0C} = QR$.</p>`, R`<p>(c) $Qx = \sqrt{99}$ com $x = 1{,}01 - 1/1{,}01$. (d) Largura de banda $\Delta f = f_0/Q$.</p>`],
      sol: R`<p><b>(a)</b> $C = \frac{1}{\omega_0^2L} = \frac{1}{(2\pi\times10^6)^2\times2\times10^{-4}} \approx 127$ pF.</p>
        <p><b>(b)</b> $\omega L - \frac{1}{\omega C} = \omega_0L\left(\frac{\omega}{\omega_0} - \frac{\omega_0}{\omega}\right) = QR\left(\frac{\omega}{\omega_0} - \frac{\omega_0}{\omega}\right)$; divida $V/Z$ por $V/R$.</p>
        <p><b>(c)</b> $x = 1{,}01 - 0{,}990099 = 0{,}019901$; $Q \ge \sqrt{99}/x \approx 500$. $R \le \frac1Q\sqrt{L/C} = \frac{1257}{500} \approx 2{,}5\ \Omega$.</p>
        <p><b>(d)</b> $\Delta f = f_0/Q = 2$ kHz. Mas a música precisa de uns 5 kHz de cada lado da portadora: o circuito "come" os agudos. Rádios de verdade usam vários estágios (super-heteródino) para ter seletividade sem estreitar demais a banda.</p>` });

    return [
      F.secao("abertura", "Pergunta de abertura", R`<div class="abertura"><div class="det">Antes de tudo</div><div class="q">Por que a tomada é de corrente alternada, e não contínua como a pilha?</div></div>`),
      F.secao("laboratorio", "Laboratório: fasores e ressonância", R`<p>Varra a frequência e veja os fasores mudarem. Na ressonância, $V_L$ e $V_C$ se cancelam e a corrente fica máxima.</p>
        ${F.chute({ q: "na ressonância, a tensão eficaz no capacitor sozinho pode ser maior que a da fonte?", ops: ["não, nunca", "sim, pode ser bem maior", "só se R = 0", "é sempre igual"], certa: 1, exp: R`<p><b>Sim:</b> $V_C = IX_C = \frac{V}{R}X_C = QV$. Com Q alto, dezenas ou centenas de vezes a tensão da fonte (por isso capacitores de circuitos ressonantes precisam aguentar muito mais tensão).</p>` })}
        <div id="lab-fas"></div>`),
      F.secao("ideia", "A ideia física", R`<p>Um gerador girando produz naturalmente uma fem senoidal ${F.ret("C15")}. Com tensão alternada, um transformador (duas bobinas num núcleo de ferro) sobe ou desce a tensão quase sem perda. Isso permite transmitir energia a centenas de kV, com corrente pequena e quase nenhuma perda nos fios, e baixar para 127/220 V na sua casa.</p>
        <ul><li>Brasil: 60 Hz; 127 ou 220 V eficazes.</li><li>"Eficaz" (RMS): a tensão contínua que daria a mesma potência num resistor. Pico = eficaz × √2.</li></ul>
        <p>Em CA, indutores e capacitores "resistem" à corrente de um jeito que depende da frequência: as <b>reatâncias</b>. E corrente e tensão podem ficar fora de fase.</p>`),
      F.secao("teoria", "Teoria completa", R`
        <h3>1. Valores eficazes</h3>
        ${F.fig(figSeno)}
        ${F.formula(R`V(t) = V_m\sin\omega t,\qquad V_\text{ef} = \sqrt{\overline{V^2}} = \frac{V_m}{\sqrt2},\qquad \bar P = \frac{V_\text{ef}^2}{R}`)}
        <h3>2. Fasores</h3>
        <p>Uma senoide $A\sin(\omega t + \varphi)$ é a projeção vertical de um vetor de comprimento $A$ girando com velocidade angular $\omega$. Somar senoides de mesma frequência é somar vetores: os <b>fasores</b>. (Com números complexos: $V = \text{Im}(V_me^{i\omega t})$.)</p>
        <h3>3. R, L e C sozinhos</h3>
        ${F.demo("reatâncias", R`<p><b>R:</b> $v = Ri$, em fase.</p><p><b>L:</b> $v = L\frac{di}{dt}$; com $i = I\sin\omega t$, $v = \omega LI\cos\omega t$: a tensão <b>adianta</b> 90°. $X_L = \omega L$.</p><p><b>C:</b> $i = C\frac{dv}{dt}$; com $v = V\sin\omega t$, $i = \omega CV\cos\omega t$: a corrente adianta 90° (a tensão <b>atrasa</b>). $X_C = \frac{1}{\omega C}$.</p>`)}
        ${F.caixa("fisico", R`<p>Mnemônico: "ELI the ICE man": em L, E (tensão) vem antes de I; em C, I vem antes de E.</p>`)}
        <h3>4. RLC série</h3>
        ${F.fig(figRLC)}
        ${F.formula(R`Z = \sqrt{R^2 + (X_L - X_C)^2},\qquad I = \frac VZ,\qquad \tan\varphi = \frac{X_L - X_C}{R}`, "Impedância")}
        <h3>5. Ressonância</h3>
        ${F.formula(R`\omega_0 = \frac{1}{\sqrt{LC}},\qquad Q = \frac{\omega_0L}{R} = \frac1R\sqrt{\frac LC},\qquad \Delta\omega = \frac{\omega_0}{Q}`)}
        <p>Em $\omega_0$, $X_L = X_C$, $Z = R$ mínimo, corrente máxima e em fase. $Q$ mede a "agudeza" da ressonância.</p>
        <h3>6. Potência</h3>
        ${F.formula(R`\bar P = V_\text{ef}I_\text{ef}\cos\varphi = I_\text{ef}^2R`, "Potência média")}
        <p>Indutores e capacitores ideais não consomem energia em média: guardam e devolvem a cada ciclo. O fator de potência $\cos\varphi$ é importante para as concessionárias: corrente "a mais" circulando sem entregar energia esquenta os fios à toa.</p>
        <h3>7. Transformador</h3>
        ${F.fig(figTrafo)}
        ${F.formula(R`\frac{V_2}{V_1} = \frac{N_2}{N_1},\qquad V_1I_1 = V_2I_2\ \text{(ideal)}`)}
        ${F.caixa("ponte", R`<p>Com números complexos, $Z_R = R$, $Z_L = i\omega L$, $Z_C = \frac{1}{i\omega C}$, e toda a análise de circuitos CA vira "lei de Ohm complexa" com as regras de série e paralelo de sempre. É a primeira grande aplicação de $e^{i\theta}$ fora da matemática pura.</p>`)}`),
      F.secao("exemplos", "Exemplos passo a passo", exemplario),
      F.secao("resumo", "Resumo", R`<div class="resumo"><div class="r"><b>Eficaz</b>$V_\text{ef} = V_m/\sqrt2$</div><div class="r"><b>Reatâncias</b>$X_L = \omega L$; $X_C = 1/\omega C$</div><div class="r"><b>Impedância</b>$Z = \sqrt{R^2 + (X_L - X_C)^2}$</div><div class="r"><b>Ressonância</b>$\omega_0 = 1/\sqrt{LC}$; $Q = \omega_0L/R$</div><div class="r"><b>Potência</b>$VI\cos\varphi = I^2R$</div><div class="r"><b>Trafo</b>$V_2/V_1 = N_2/N_1$</div></div>`),
      F.secao("exercicios", "Exercícios", `<div class="exs-nivel"><h3>Nível Físico</h3><span class="selo">fixação</span></div>${exsF.join("")}<div class="exs-nivel"><h3>Nível Máximo</h3><span class="selo">OBF · ITA · RU</span></div>${exsM.join("")}`),
      F.secao("chefao", "Chefão", chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-fas"); e.outerHTML = F.lab("RLC série: fasores e ressonância", "lab-fas"); SIM.fasores(document.getElementById("lab-fas"), F); },
});
