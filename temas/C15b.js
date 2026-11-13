/* C15b · Indutância, circuitos RL, LC e RLC
   Base: Halliday vol. 3, cap. 30 (30-7 a 30-12) e início do 31, reescrito. Contas conferidas em Python (c06.py). */
F.registrar("C15b", {
  retoma: ["C15", "C10b", "B15"],
  html(F) {
    const R = String.raw;
    const ind = (x1, y, x2, rot) => { let d = `M${x1} ${y}`; const n = 5, w = (x2 - x1) / n; for (let k = 0; k < n; k++) d += ` a${w / 2} ${w / 2} 0 0 1 ${w} 0`; return `<rect x="${x1}" y="${y - 18}" width="${x2 - x1}" height="24" style="fill:var(--card)"/><path d="${d}" class="ln"/>${D.txt((x1 + x2) / 2, y - 22, rot, "tx")}`; };
    const figRL = D.svg(400, 170, D.fio([[50, 40], [350, 40], [350, 140], [50, 140], [50, 40]]) + `<rect x="34" y="60" width="32" height="60" style="fill:var(--card)"/>` + D.comp("bateria", 50, 120, 50, 60, { mais: 1, rot: "E", lado: -1, sinais: false }) + `<rect x="120" y="28" width="70" height="24" style="fill:var(--card)"/>` + D.comp("resistor", 120, 40, 190, 40, { rot: "R" }) + ind(230, 40, 310, "L"), "RL");
    const figLC = D.svg(320, 170, D.fio([[60, 40], [260, 40], [260, 140], [60, 140], [60, 40]]) + `<rect x="44" y="74" width="32" height="32" style="fill:var(--card)"/><line x1="46" y1="85" x2="74" y2="85" class="ln" style="stroke-width:3"/><line x1="46" y1="95" x2="74" y2="95" class="ln" style="stroke-width:3"/>${D.txt(34, 95, "C", "tx", "end")}` + ind(120, 40, 200, "L"), "LC");
    const figIgn = D.svg(460, 190, D.fio([[50, 40], [330, 40], [330, 150], [50, 150], [50, 40]]) + `<rect x="34" y="65" width="32" height="60" style="fill:var(--card)"/>` + D.comp("bateria", 50, 125, 50, 65, { mais: 1, rot: "12 V", lado: -1, sinais: false }) + `<rect x="110" y="28" width="60" height="24" style="fill:var(--card)"/>` + D.comp("resistor", 110, 40, 170, 40, { rot: "6 Ω" }) + `<line x1="200" y1="40" x2="224" y2="26" class="ln" style="stroke-width:2.5"/>${D.txt(210, 18, "S", "tx2")}` + `<rect x="316" y="70" width="28" height="50" style="fill:var(--card)"/><path d="M330 70 a8 8 0 0 1 0 16 a8 8 0 0 1 0 16 a8 8 0 0 1 0 16 a8 8 0 0 1 0 2" class="ln"/>${D.txt(350, 100, "L = 1 H", "tx", "start")}` + D.fio([[330, 40], [420, 40], [420, 150], [330, 150]]) + `<rect x="406" y="70" width="28" height="50" style="fill:var(--card)"/>` + D.comp("resistor", 420, 70, 420, 120, { rot: "1 kΩ", lado: 1, dist: 26 }), "circuito de ignição");

    const exemplario = F.exemplo({ casos: [
      { nome: "Indutância de um solenoide", gerar: (p) => {
        const N = p ? 500 : F.escolha([100, 300, 500, 1000]), l = p ? 25 : F.escolha([10, 20, 25, 40]), A = p ? 4 : F.escolha([1, 2, 4, 10]), L = (4e-7 * Math.PI * N * N * A * 1e-4) / (l / 100);
        return { enun: R`<p>Solenoide de $${N}$ espiras, comprimento $${l}$ cm e seção $${A}$ cm² (núcleo de ar). Indutância?</p>`, fig: "",
          passos: [R`<p>$B = \mu_0ni = \mu_0\frac Nl i$; fluxo em cada espira $BA$; fluxo total $N\Phi = \frac{\mu_0N^2A}{l}i$.</p>`, R`$$L = \frac{N\Phi}{i} = \frac{\mu_0N^2A}{l} = ${F.sigM(L, 3)}\ \text{H}$$`, R`<p>Só depende da geometria. $L \propto N^2$: dobrando as espiras (mesmo comprimento), $L$ quadruplica. Com núcleo de ferro, multiplica por ~$10^3$.</p>`] }; } },
      { nome: "Liga o RL", gerar: (p) => {
        const E = p ? 12 : F.escolha([6, 9, 12, 24]), Rr = p ? 10 : F.escolha([5, 10, 20, 50]), L = p ? 0.5 : F.escolha([0.1, 0.2, 0.5, 1]), f = p ? 90 : F.escolha([50, 63, 90, 99]);
        const tau = L / Rr, t = -tau * Math.log(1 - f / 100);
        return { enun: R`<p>Circuito RL: $E = ${E}$ V, $R = ${Rr}\ \Omega$, $L = ${L}$ H. Fecha-se a chave. Corrente final, constante de tempo, e quando a corrente chega a $${f}\%$ do final?</p>`, fig: figRL,
          passos: [R`<p>Malha: $E - Ri - L\frac{di}{dt} = 0$. Solução: $i = \frac ER\left(1 - e^{-t/\tau}\right)$, $\tau = L/R$.</p>`, R`<p>$i_\infty = ${F.m(E / Rr, 3)}$ A; $\tau = ${F.m(tau * 1000, 1)}$ ms.</p>`, R`<p>$t = -\tau\ln(1 - ${F.m(f / 100, 2)}) = ${F.m(t * 1000, 1)}$ ms.</p>`] }; } },
    ] });

    const X = F.exercicio;
    const exsF = [
      X({ n: 1, enun: R`<p>Solenoide de 500 espiras, $25$ cm de comprimento, $4{,}0$ cm² de seção. Indutância?</p>`, fig: "", dicas: [R`<p>$L = \mu_0N^2A/l$.</p>`, R`<p>$4\pi\times10^{-7}\times2{,}5\times10^5\times4\times10^{-4}/0{,}25$.</p>`], resp: R`$\approx 0{,}50$ mH.`, sol: R`<p>$L \approx 5{,}0\times10^{-4}$ H.</p>` }),
      X({ n: 2, enun: R`<p>Num indutor de $0{,}20$ H, a corrente cresce a $50$ A/s. Fem induzida?</p>`, fig: "", dicas: [R`<p>$\varepsilon = -L\,di/dt$.</p>`, R`<p>$0{,}2\times50$.</p>`], resp: R`$10$ V (opondo-se ao aumento).`, sol: R`<p>$|\varepsilon| = 10$ V.</p>` }),
      X({ n: 3, marcas: ["★"], enun: R`<p>RL com $E = 12$ V, $R = 10\ \Omega$, $L = 0{,}50$ H. Constante de tempo, corrente final e tempo até 90%.</p>`, fig: figRL, dicas: [R`<p>$\tau = L/R$.</p>`, R`<p>$t_{90} = \tau\ln10$.</p>`], resp: R`$50$ ms; $1{,}2$ A; $\approx 0{,}12$ s.`, sol: R`<p>$t = 0{,}05\times2{,}303 \approx 0{,}115$ s.</p>` }),
      X({ n: 4, enun: R`<p>Energia guardada nesse indutor com a corrente final?</p>`, fig: figRL, dicas: [R`<p>$U = \frac12Li^2$.</p>`, R`<p>$0{,}5\times0{,}5\times1{,}44$.</p>`], resp: R`$0{,}36$ J.`, sol: R`<p>$U = 0{,}36$ J.</p>` }),
      X({ n: 5, marcas: ["★"], enun: R`<p>Circuito LC com $L = 10$ mH e $C = 1{,}0$ µF. Frequência de oscilação?</p>`, fig: figLC, dicas: [R`<p>$\omega = 1/\sqrt{LC}$.</p>`, R`<p>$\sqrt{10^{-8}} = 10^{-4}$.</p>`], resp: R`$\approx 1{,}6$ kHz.`, sol: R`<p>$\omega = 10^4$ rad/s, $f \approx 1592$ Hz.</p>` }),
      X({ n: 6, enun: R`<p>Qual a densidade de energia de um campo magnético de $1{,}0$ T?</p>`, fig: "", dicas: [R`<p>$u_B = B^2/(2\mu_0)$.</p>`, R`<p>$1/(8\pi\times10^{-7})$.</p>`], resp: R`$\approx 4{,}0\times10^5$ J/m³.`, sol: R`<p>$u_B \approx 3{,}98\times10^5$ J/m³. Compare com um campo elétrico de $3\times10^6$ V/m (o máximo no ar): $u_E = \varepsilon_0E^2/2 \approx 40$ J/m³. Guardar energia em campo magnético é muito mais fácil.</p>` }),
    ];
    const exsM = [
      X({ n: 7, marcas: ["!"], enun: R`<p>Uma bobina de 50 espiras e $2{,}0$ cm² fica dentro de um solenoide longo de $1000$ espiras/m. Indutância mútua?</p>`, fig: "", dicas: [R`<p>Corrente $i_1$ no solenoide: $B = \mu_0n_1i_1$; fluxo total na bobina $N_2BA$.</p>`, R`<p>$M = \mu_0n_1N_2A$.</p>`], resp: R`$\approx 1{,}3\times10^{-5}$ H.`, sol: R`<p>$M = 4\pi\times10^{-7}\times1000\times50\times2\times10^{-4} \approx 1{,}26\times10^{-5}$ H. Pela reciprocidade, $M_{12} = M_{21}$ (bem menos óbvio calculando ao contrário).</p>` }),
      X({ n: 8, marcas: ["★", "ITA"], enun: R`<p>RLC série com $L = 10$ mH e $C = 1{,}0$ µF. Para que $R$ o amortecimento é crítico? E com $R = 20\ \Omega$, quantas oscilações até a amplitude cair para $1/e$?</p>`, fig: figLC, dicas: [R`<p>$L\ddot q + R\dot q + q/C = 0$: crítico quando $\left(\frac{R}{2L}\right)^2 = \frac{1}{LC}$.</p>`, R`<p>Amplitude $\propto e^{-Rt/2L}$; tempo para $1/e$: $2L/R$.</p>`], resp: R`$R_c = 200\ \Omega$; $\approx 1{,}6$ oscilações.`, sol: R`<p>$R_c = 2\sqrt{L/C} = 200\ \Omega$. Com 20 Ω: $2L/R = 1$ ms, período $\approx 0{,}63$ ms: ~1,6 oscilação. É idêntico ao oscilador massa–mola amortecido ${F.ret("B15")}: $L \leftrightarrow m$, $R \leftrightarrow b$, $1/C \leftrightarrow k$.</p>` }),
      X({ n: 9, marcas: ["!"], enun: R`<p>LC com $C = 1{,}0$ µF carregado com $10$ µC e $L = 10$ mH. Corrente máxima? Em que instante a energia está metade no capacitor, metade no indutor?</p>`, fig: figLC, dicas: [R`<p>$q = q_0\cos\omega t$, $i = -q_0\omega\sin\omega t$.</p>`, R`<p>Metade: $\cos^2\omega t = \frac12$.</p>`], resp: R`$i_\text{max} = 0{,}10$ A; $t = T/8$.`, sol: R`<p>$i_\text{max} = q_0\omega = 10^{-5}\times10^4 = 0{,}1$ A. $\omega t = \pi/4$: $t = T/8 \approx 79$ µs.</p>` }),
    ];

    const chefao = F.chefao({ titulo: "A faísca da ignição", fig: figIgn,
      enun: R`<p>No circuito, a chave S está fechada há muito tempo. A bobina tem $L = 1{,}0$ H (resistência desprezível); em paralelo com ela há um resistor de $1{,}0$ kΩ; a bateria é de $12$ V com um resistor de $6{,}0\ \Omega$ em série. Em $t = 0$, abre-se a chave.</p>
        <ol type="a"><li>Qual a corrente no indutor e no resistor de 1 kΩ antes de abrir?</li><li>Logo depois de abrir, qual a tensão nos terminais do indutor?</li><li>Escreva $i(t)$ depois de abrir e calcule a energia dissipada no resistor de 1 kΩ.</li><li>Numa bobina de ignição, uma segunda bobina enrolada sobre a primeira, com 10 vezes mais espiras, sente a mesma variação de fluxo. Que tensão aparece nela no instante da abertura? Por que é isso que faz a vela soltar faísca?</li></ol>`,
      dicas: [R`<p>(a) Em regime, o indutor ideal é um fio: curto-circuita o resistor de 1 kΩ.</p>`, R`<p>(b) A corrente num indutor não pode mudar instantaneamente: os 2 A continuam, agora pelo resistor de 1 kΩ. (d) Fem por espira igual nas duas bobinas: $V_2/V_1 = N_2/N_1$.</p>`],
      sol: R`<p><b>(a)</b> $i_L = 12/6 = 2{,}0$ A; no resistor de 1 kΩ, zero (tensão zero no indutor).</p>
        <p><b>(b)</b> Os 2 A passam a circular pela malha indutor–1 kΩ: $V = 2\times1000 = 2000$ V. Uma bateria de 12 V produziu 2 kV!</p>
        <p><b>(c)</b> $i = 2e^{-t/\tau}$ com $\tau = L/R = 1$ ms. Energia: toda a que estava no indutor, $\frac12Li^2 = 2{,}0$ J.</p>
        <p><b>(d)</b> $10\times2000 = 20$ kV, o suficiente para romper alguns milímetros de ar comprimido na vela. É a ignição clássica dos carros: abrir rápido um circuito indutivo gera picos de tensão enormes. (Por isso também se põe um diodo em paralelo com relés: para não queimar o transistor que os desliga.)</p>` });

    return [
      F.secao("abertura", "Pergunta de abertura", R`<div class="abertura"><div class="det">Antes de tudo</div><div class="q">Por que sai faísca quando você puxa da tomada um aparelho com motor ligado?</div></div>`),
      F.secao("laboratorio", "Laboratório: LC, RLC e RL", R`<p>Solte o capacitor carregado e veja a energia passar de elétrica para magnética e voltar. Aumente R até parar de oscilar.</p>
        ${F.chute({ q: "dobrando L e mantendo C, a frequência de oscilação:", ops: ["dobra", "cai pela metade", "cai por √2", "não muda"], certa: 2, exp: R`<p>$f = \frac{1}{2\pi\sqrt{LC}}$: cai por $\sqrt2$. Como a massa numa mola: $L$ faz o papel da inércia.</p>` })}
        <div id="lab-rlc"></div>`),
      F.secao("ideia", "A ideia física", R`<p>Uma bobina com corrente cria fluxo nela mesma. Se a corrente muda, o fluxo muda, e aparece uma fem que se opõe (Lenz). O indutor é a "inércia" da corrente: não deixa ela mudar de repente. Por isso ao abrir um circuito indutivo a corrente "força" a passagem e salta uma faísca.</p>
        <p>Junte com um capacitor e a energia fica indo e voltando entre o campo elétrico e o magnético: um oscilador, exatamente como massa e mola. É o coração de todo rádio.</p>`),
      F.secao("teoria", "Teoria completa", R`
        <h3>1. Indutância</h3>
        ${F.formula(R`L = \frac{N\Phi_B}{i},\qquad \varepsilon_L = -L\frac{di}{dt},\qquad [L] = \text{Wb/A} = \text{H (henry)}`, "Autoindutância")}
        ${F.formula(R`L_\text{solenoide} = \mu_0n^2A\,l = \frac{\mu_0N^2A}{l}`)}
        <h3>2. Circuito RL</h3>
        ${F.fig(figRL)}
        ${F.demo("RL ligando", R`<p>(i) Malha: $E - Ri - L\frac{di}{dt} = 0$.</p><p>(ii) Mesma equação do RC ${F.ret("C10b")}: $\frac{di}{dt} = \frac{E/R - i}{L/R}$.</p>${F.formula(R`i(t) = \frac ER\left(1 - e^{-t/\tau}\right),\qquad \tau = \frac LR`)}`)}
        <p>Logo após ligar, o indutor é um <b>circuito aberto</b> (a corrente começa em zero); depois de muito tempo, um <b>fio</b>. O contrário do capacitor.</p>
        <h3>3. Energia no campo magnético</h3>
        ${F.demo("energia do indutor", R`<p>A fonte, contra a fem do indutor, entrega $P = Li\frac{di}{dt}$. Integrando de 0 a $i$: $U = \int Li\,di$:</p>${F.formula(R`U_B = \frac12Li^2,\qquad u_B = \frac{B^2}{2\mu_0}`)}<p>(A densidade sai aplicando ao solenoide: $\frac12\mu_0n^2Al\,i^2 = \frac{(\mu_0ni)^2}{2\mu_0}\cdot Al$.)</p>`)}
        <h3>4. Indutância mútua</h3>
        ${F.formula(R`\varepsilon_2 = -M\frac{di_1}{dt},\qquad M_{12} = M_{21}`)}
        <p>Base do transformador ${F.ret("C15c")} e do carregador sem fio do celular.</p>
        <h3>5. Oscilações LC</h3>
        ${F.fig(figLC)}
        ${F.demo("LC", R`<p>(i) $L\frac{di}{dt} + \frac qC = 0$ com $i = \frac{dq}{dt}$: $\ddot q = -\frac{1}{LC}q$.</p><p>(ii) MHS ${F.ret("B15")}:</p>${F.formula(R`q = q_0\cos(\omega t + \phi),\qquad \omega = \frac{1}{\sqrt{LC}}`)}<p>(iii) Energia total $\frac{q^2}{2C} + \frac12Li^2 = \frac{q_0^2}{2C}$ constante.</p>`)}
        <table class="tb"><tr><th>Mola</th><th>Circuito</th></tr><tr><td>$x$</td><td>$q$</td></tr><tr><td>$m$</td><td>$L$</td></tr><tr><td>$k$</td><td>$1/C$</td></tr><tr><td>$b$ (atrito)</td><td>$R$</td></tr><tr><td>$\frac12mv^2$</td><td>$\frac12Li^2$</td></tr><tr><td>$\frac12kx^2$</td><td>$\frac{q^2}{2C}$</td></tr></table>
        <h3>6. RLC amortecido</h3>
        ${F.formula(R`L\ddot q + R\dot q + \frac qC = 0\;\Rightarrow\;q = q_0e^{-Rt/2L}\cos(\omega' t),\qquad \omega' = \sqrt{\frac{1}{LC} - \left(\frac{R}{2L}\right)^2}`)}
        <p>Subamortecido se $R < 2\sqrt{L/C}$, crítico na igualdade, superamortecido acima.</p>
        ${F.caixa("olimpiada", R`<p>Em transientes, use a regra de ouro: <b>a corrente num indutor e a carga num capacitor não podem saltar</b>. O resto do circuito se ajusta instantaneamente a elas (chefão).</p>`)}`),
      F.secao("exemplos", "Exemplos passo a passo", exemplario),
      F.secao("resumo", "Resumo", R`<div class="resumo"><div class="r"><b>Indutância</b>$L = N\Phi/i$; solenoide $\mu_0N^2A/l$</div><div class="r"><b>Fem</b>$-L\,di/dt$</div><div class="r"><b>RL</b>$\tau = L/R$</div><div class="r"><b>Energia</b>$\frac12Li^2$; $u_B = B^2/2\mu_0$</div><div class="r"><b>LC</b>$\omega = 1/\sqrt{LC}$</div><div class="r"><b>Crítico</b>$R = 2\sqrt{L/C}$</div></div>`),
      F.secao("exercicios", "Exercícios", `<div class="exs-nivel"><h3>Nível Físico</h3><span class="selo">fixação</span></div>${exsF.join("")}<div class="exs-nivel"><h3>Nível Máximo</h3><span class="selo">OBF · ITA · RU</span></div>${exsM.join("")}`),
      F.secao("chefao", "Chefão", chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-rlc"); e.outerHTML = F.lab("LC, RLC e RL", "lab-rlc"); SIM.rlc(document.getElementById("lab-rlc"), F); },
});
