/* C09 · Instrumentos de Medida Elétrica
   Base: Halliday vol. 3, seção 27-8, ampliado (galvanômetro, shunt, ohmímetro, potenciômetro). Contas conferidas em Python (c05b.py). */
F.registrar("C09", {
  retoma: ["C08"],
  html(F) {
    const R = String.raw;
    const med = (x, y, l) => `<circle cx="${x}" cy="${y}" r="13" style="fill:var(--card);stroke:var(--ink);stroke-width:2"/>${D.txt(x, y + 5, l, "tx", "middle", 'style="font-weight:700"')}`;
    const figShunt = D.svg(420, 150, D.fio([[30, 75], [120, 75]]) + D.fio([[300, 75], [390, 75]]) + D.fio([[120, 35], [120, 115]]) + D.fio([[300, 35], [300, 115]]) + D.fio([[120, 35], [196, 35]]) + D.fio([[224, 35], [300, 35]]) + med(210, 35, "G") + D.comp("resistor", 120, 115, 300, 115, { rot: "shunt R_s", lado: -1 }) + D.txt(210, 64, "R_g, i_g", "tx2") + D.borne(30, 75) + D.borne(390, 75), "amperímetro com shunt");
    const figVolt = D.svg(420, 90, D.fio([[30, 45], [130, 45]]) + D.comp("resistor", 130, 45, 250, 45, { rot: "R_série" }) + D.fio([[250, 45], [276, 45]]) + med(290, 45, "G") + D.fio([[304, 45], [390, 45]]) + D.borne(30, 45) + D.borne(390, 45), "voltímetro");
    const figMontagens = D.svg(520, 170, (() => { const c = (ox, nome, curta) => D.fio([[ox, 30], [ox + 200, 30], [ox + 200, 140], [ox, 140], [ox, 30]]) + `<rect x="${ox - 14}" y="60" width="28" height="50" style="fill:var(--card)"/>` + D.comp("bateria", ox, 110, ox, 60, { mais: 1, sinais: false }) + `<rect x="${ox + 60}" y="18" width="28" height="24" style="fill:var(--card)"/>` + med(ox + 74, 30, "A") + `<rect x="${ox + 186}" y="60" width="28" height="50" style="fill:var(--card)"/>` + D.comp("resistor", ox + 200, 60, ox + 200, 110, { rot: "R", lado: -1 }) + (curta ? D.fio([[ox + 200, 50], [ox + 160, 50], [ox + 160, 120], [ox + 200, 120]]) + med(ox + 160, 85, "V") : D.fio([[ox + 40, 30], [ox + 40, 10], [ox + 230, 10], [ox + 230, 140], [ox + 200, 140]]) + med(ox + 230, 75, "V")) + D.txt(ox + 100, 164, nome, "tx2"); return c(30, "montagem curta (V só no R)", true) + c(290, "montagem longa (V no A + R)", false); })(), "montagens");
    const figPot = D.svg(460, 160, `<line x1="40" y1="60" x2="420" y2="60" style="stroke:var(--ink);stroke-width:4"/>${D.txt(230, 50, "fio uniforme de 1 m", "tx2")}` + D.fio([[40, 60], [40, 20], [180, 20]]) + D.comp("bateria", 180, 20, 260, 20, { mais: -1, rot: "fonte auxiliar" }) + D.fio([[260, 20], [420, 20], [420, 60]]) + D.fio([[40, 60], [40, 130], [120, 130]]) + D.comp("bateria", 120, 130, 180, 130, { mais: -1, rot: "E_x", lado: -1 }) + D.fio([[180, 130], [250, 130]]) + med(264, 130, "G") + D.fio([[278, 130], [300, 130], [300, 66]]) + `<polygon points="300,62 294,74 306,74" style="fill:var(--warn)"/>` + D.txt(312, 96, "cursor", "tx2", "start"), "potenciômetro");

    const exemplario = F.exemplo({ casos: [
      { nome: "Galvanômetro → amperímetro", gerar: (p) => {
        const ig = p ? 1 : F.escolha([0.1, 0.5, 1, 2]), Rg = p ? 50 : F.escolha([20, 50, 100, 200]), I = p ? 1 : F.escolha([0.1, 1, 5, 10]), Rs = (Rg * ig * 1e-3) / (I - ig * 1e-3);
        return { enun: R`<p>Um galvanômetro tem fundo de escala $i_g = ${ig}$ mA e $R_g = ${Rg}\ \Omega$. Que shunt transforma ele num amperímetro de fundo de escala $${I}$ A?</p>`, fig: figShunt,
          passos: [R`<p>No fundo de escala, passam $i_g$ pelo galvanômetro e $I - i_g$ pelo shunt. Eles estão em paralelo: mesma tensão.</p>`, R`$$R_gi_g = R_s(I - i_g)\;\Rightarrow\;R_s = \frac{R_gi_g}{I - i_g} = ${F.sigM(Rs, 3)}\ \Omega$$`,
            R`<p>Resistência total do amperímetro: $R_g\parallel R_s \approx ${F.sigM((Rg * Rs) / (Rg + Rs), 3)}\ \Omega$. Bem pequena, como deve ser.</p>`] }; } },
      { nome: "Galvanômetro → voltímetro", gerar: (p) => {
        const ig = p ? 1 : F.escolha([0.05, 0.1, 1]), Rg = p ? 50 : F.escolha([50, 100]), V = p ? 10 : F.escolha([1, 10, 100, 300]), Rs = V / (ig * 1e-3) - Rg;
        return { enun: R`<p>Galvanômetro de $${ig}$ mA e $${Rg}\ \Omega$. Que resistor em série faz dele um voltímetro de $${V}$ V?</p>`, fig: figVolt,
          passos: [R`<p>No fundo de escala, $i_g$ passa pelo conjunto série: $V = i_g(R_g + R_s)$.</p>`, R`$$R_s = \frac{V}{i_g} - R_g = ${F.sigM(Rs, 4)}\ \Omega$$`, R`<p>Resistência total $V/i_g = ${F.sigM(V / (ig * 1e-3), 3)}\ \Omega$. A "sensibilidade" é $1/i_g = ${F.sigM(1 / (ig * 1e-3), 3)}\ \Omega$/V: quanto maior, menos o voltímetro perturba o circuito.</p>`] }; } },
    ] });

    const X = F.exercicio;
    const exsF = [
      X({ n: 1, enun: R`<p>Galvanômetro de $1{,}0$ mA e $50\ \Omega$. Que shunt para virar amperímetro de $1{,}0$ A?</p>`, fig: figShunt, dicas: [R`<p>Mesma tensão no G e no shunt.</p>`, R`<p>$R_s = R_gi_g/(I - i_g)$.</p>`], resp: R`$\approx 0{,}050\ \Omega$.`, sol: R`<p>$50\times0{,}001/0{,}999 \approx 0{,}0500\ \Omega$.</p>` }),
      X({ n: 2, enun: R`<p>Mesmo galvanômetro: que resistor em série para virar voltímetro de $10$ V?</p>`, fig: figVolt, dicas: [R`<p>$10 = 0{,}001(50 + R_s)$.</p>`, R`<p>$R_s = 10\,000 - 50$.</p>`], resp: R`$9950\ \Omega$.`, sol: R`<p>$R_s = 9950\ \Omega$; total $10$ kΩ.</p>` }),
      X({ n: 3, marcas: ["★"], enun: R`<p>Um amperímetro de $1{,}0\ \Omega$ é colocado num circuito de $9{,}0$ V com um resistor de $10\ \Omega$ (fonte ideal). Quanto ele marca, e qual o erro relativo?</p>`, fig: "", dicas: [R`<p>O amperímetro entra em série.</p>`, R`<p>$9/11$ contra $9/10$.</p>`], resp: R`$\approx 0{,}82$ A contra $0{,}90$ A: erro de ~9%.`, sol: R`<p>Medido $0{,}818$ A; verdadeiro $0{,}900$ A; erro $\frac{0{,}082}{0{,}9} \approx 9{,}1\%$. Amperímetro só é "ideal" se $R_A \ll$ resistência do circuito.</p>` }),
      X({ n: 4, marcas: ["?"], enun: R`<p>Ligar um amperímetro em paralelo com uma bateria é perigoso porque:</p>`, fig: "", alts: ["ele mede tensão em vez de corrente", "sua resistência é muito alta e a bateria descarrega", "sua resistência é muito baixa: é quase um curto-circuito", "a corrente inverte o ponteiro", "não é perigoso"], dicas: [R`<p>Qual a resistência de um bom amperímetro?</p>`, R`<p>$i = E/(r + R_A)$.</p>`], resp: "C", sol: R`<p>Com $R_A \sim 0{,}1\ \Omega$, a corrente fica limitada só pela resistência interna da bateria: amperes. O fusível do multímetro queima (ou pior). Teste no laboratório.</p>` }),
    ];
    const exsM = [
      X({ n: 5, marcas: ["!", "ITA"], enun: R`<p>Para medir um resistor com voltímetro e amperímetro há duas montagens (figura). Com $R_A = 1{,}0\ \Omega$ e $R_V = 10$ kΩ, qual dá o valor medido mais próximo do verdadeiro para (a) $R = 10\ \Omega$; (b) $R = 10$ kΩ?</p>`, fig: figMontagens,
        dicas: [R`<p>Curta: o amperímetro mede a corrente de $R$ <b>e</b> do voltímetro: mede $R\parallel R_V$. Longa: o voltímetro mede a queda em $R$ <b>e</b> no amperímetro: mede $R + R_A$.</p>`, R`<p>A curta erra pouco se $R \ll R_V$; a longa, se $R \gg R_A$. O ponto de virada é $R \approx \sqrt{R_AR_V}$.</p>`], resp: R`(a) curta (mede $9{,}99\ \Omega$; a longa mede $11\ \Omega$); (b) longa.`, sol: R`<p>(a) Curta: $10\parallel10^4 = 9{,}990\ \Omega$ (0,1%); longa: $11\ \Omega$ (10%). (b) Curta: $10\text{k}\parallel10\text{k} = 5$ kΩ (50%!); longa: $10\,001\ \Omega$ (0,01%). Regra: resistor pequeno, montagem curta; grande, longa. Divisa: $\sqrt{1\times10^4} = 100\ \Omega$.</p>` }),
      X({ n: 6, marcas: ["RU"], enun: R`<p>Num potenciômetro de fio, uma pilha padrão de $1{,}018$ V equilibra o galvanômetro com o cursor a $50{,}9$ cm. Uma pilha desconhecida equilibra a $74{,}6$ cm. Qual a fem dela? Por que essa medida não sofre o erro da resistência interna?</p>`, fig: figPot,
        dicas: [R`<p>No equilíbrio, a corrente no galvanômetro é zero: a fem é igual à queda no trecho do fio.</p>`, R`<p>A queda é proporcional ao comprimento.</p>`], resp: R`$\approx 1{,}492$ V.`, sol: R`<p>$E_x = 1{,}018\times\frac{74{,}6}{50{,}9} \approx 1{,}492$ V. Como no equilíbrio a pilha não fornece corrente, não há queda $ri$ dentro dela: mede-se a fem verdadeira. É o método do "zero", mais preciso que qualquer voltímetro de ponteiro.</p>` }),
      X({ n: 7, marcas: ["!"], enun: R`<p>Um ohmímetro simples: pilha de $1{,}5$ V em série com um galvanômetro de $1{,}0$ mA e um resistor, ajustado para dar fundo de escala com as pontas encostadas. Que resistência externa faz o ponteiro parar na metade da escala? E em 1/4?</p>`, fig: "", dicas: [R`<p>Resistência interna total: $1{,}5/0{,}001$.</p>`, R`<p>$i = 1{,}5/(R_\text{int} + R_x)$.</p>`], resp: R`Metade: $1{,}5$ kΩ; um quarto: $4{,}5$ kΩ.`, sol: R`<p>$R_\text{int} = 1500\ \Omega$. Metade: $R_x = R_\text{int} = 1500\ \Omega$. 1/4: $R_\text{int} + R_x = 4R_\text{int}$, $R_x = 4500\ \Omega$. A escala é não linear, com o zero à direita e o infinito à esquerda.</p>` }),
    ];

    const chefao = F.chefao({ titulo: "Os voltímetros mentirosos", fig: D.svg(440, 190, D.fio([[40, 40], [400, 40], [400, 160], [40, 160], [40, 40]]) + `<rect x="24" y="70" width="32" height="60" style="fill:var(--card)"/>` + D.comp("bateria", 40, 130, 40, 70, { mais: 1, rot: "12 V", lado: -1, sinais: false }) + `<rect x="120" y="28" width="70" height="24" style="fill:var(--card)"/>` + D.comp("resistor", 120, 40, 190, 40, { rot: "R₁" }) + `<rect x="250" y="28" width="70" height="24" style="fill:var(--card)"/>` + D.comp("resistor", 250, 40, 320, 40, { rot: "R₂" }) + D.fio([[110, 40], [110, 90], [200, 90], [200, 40]]) + med(155, 90, "V"), "voltímetro real"),
      enun: R`<p>Uma bateria ideal de $12$ V alimenta dois resistores desconhecidos $R_1$ e $R_2$ em série. Um voltímetro <b>não ideal</b> (resistência $R_V$ desconhecida) ligado em $R_1$ marca $6{,}0$ V; o mesmo voltímetro, ligado em $R_2$, marca $4{,}0$ V.</p>
        <ol type="a"><li>As leituras somam 10 V, não 12. Explique.</li><li>Ache $R_1/R_V$ e $R_2/R_V$.</li><li>Quais seriam as tensões verdadeiras em $R_1$ e $R_2$, sem voltímetro?</li><li>Se dois voltímetros iguais a esse fossem ligados ao mesmo tempo (um em cada resistor), o que marcariam?</li></ol>`,
      dicas: [R`<p>(b) Use $x = R_1/R_V$ e $y = R_2/R_V$. Em paralelo com o voltímetro, $R_1$ vira $\frac{x}{1+x}R_V$. Escreva o divisor de tensão para cada leitura.</p>`, R`<p>(b) Da 1ª leitura: $\frac{x}{1+x} = y$. Da 2ª: $\frac{y}{1+y} = \frac x2$.</p>`],
      sol: R`<p><b>(a)</b> O voltímetro em paralelo diminui a resistência daquele trecho e "rouba" tensão dele: cada leitura é menor que a verdadeira.</p>
        <p><b>(b)</b> 1ª: $12\frac{x/(1+x)}{x/(1+x) + y} = 6 \Rightarrow \frac{x}{1+x} = y$. 2ª: $12\frac{y/(1+y)}{y/(1+y) + x} = 4 \Rightarrow \frac{2y}{1+y} = x$. Juntando: $\frac{y}{1-y} = \frac{2y}{1+y} \Rightarrow y = \frac13$, $x = \frac12$. Então $R_1 = R_V/2$ e $R_2 = R_V/3$.</p>
        <p><b>(c)</b> $U_1 = 12\cdot\frac{1/2}{5/6} = 7{,}2$ V e $U_2 = 4{,}8$ V.</p>
        <p><b>(d)</b> $R_1\parallel R_V = R_V/3$ e $R_2\parallel R_V = R_V/4$: $U_1 = 12\cdot\frac{1/3}{7/12} \approx 6{,}86$ V, $U_2 \approx 5{,}14$ V, somando 12 ✓ (agora não sobra nada fora dos voltímetros).</p>` });

    return [
      F.secao("abertura", "Pergunta de abertura", R`<div class="abertura"><div class="det">Antes de tudo</div><div class="q">Um instrumento de medida sempre muda aquilo que mede. Quanto?</div></div>`),
      F.secao("laboratorio", "Laboratório: multímetro certo e errado", R`<p>Teste as cinco ligações. Mexa nas resistências internas dos medidores e veja o erro de inserção.</p>
        ${F.chute({ q: "trocando o voltímetro de 10 MΩ por um de 10 kΩ (ligado certo, em paralelo com R₂ = 680 Ω), a leitura:", ops: ["não muda", "cai um pouco", "cai muito", "sobe"], certa: 1, exp: R`<p><b>Cai um pouco</b>: 680 Ω em paralelo com 10 kΩ dá 637 Ω, e a leitura cai de 6,79 V para 6,68 V. Com um voltímetro de 1 kΩ cairia muito mais. Confira no laboratório.</p>` })}
        <div id="lab-md"></div>`),
      F.secao("ideia", "A ideia física", R`<p><b>Amperímetro</b> vai em <b>série</b> (a corrente tem que passar por ele) e deve ter resistência quase <b>zero</b>. <b>Voltímetro</b> vai em <b>paralelo</b> (mede a diferença entre dois pontos) e deve ter resistência quase <b>infinita</b>. Os dois são, por dentro, o mesmo bicho: um galvanômetro (bobina num ímã, ponteiro) com um resistor esperto.</p>
        <ul><li>Multímetro digital comum: voltímetro ~10 MΩ; amperímetro ~0,1–1 Ω na escala de mA.</li><li>Galvanômetro de ponteiro: fundo de escala ~50 µA a 1 mA.</li></ul>`),
      F.secao("teoria", "Teoria completa", R`
        <h3>1. Galvanômetro</h3>
        <p>Uma bobina presa a uma mola espiral, dentro de um ímã: a corrente gera um torque magnético proporcional a $i$ ${F.ret("C13")}, que é equilibrado pela mola. Ângulo $\propto i$. Caracterizado por $i_g$ (fundo de escala) e $R_g$.</p>
        <h3>2. Amperímetro: shunt em paralelo</h3>
        ${F.fig(figShunt)}
        ${F.formula(R`R_s = \frac{R_g\,i_g}{I - i_g}\approx\frac{R_gi_g}{I}`, "Shunt")}
        <h3>3. Voltímetro: resistor em série</h3>
        ${F.fig(figVolt)}
        ${F.formula(R`R_\text{série} = \frac{V}{i_g} - R_g`)}
        <h3>4. Erro de inserção</h3>
        <p>O voltímetro em paralelo com $R$ forma $R\parallel R_V < R$: a tensão medida é menor que a real. O amperímetro em série soma $R_A$: a corrente medida é menor. Erro relativo aproximado: $R/R_V$ e $R_A/R_\text{circuito}$.</p>
        ${F.fig(figMontagens)}
        ${F.caixa("olimpiada", R`<p>Montagem curta (V só no resistor) mede $R\parallel R_V$; longa (V no A + R) mede $R + R_A$. Para $R < \sqrt{R_AR_V}$, use a curta; para $R > \sqrt{R_AR_V}$, a longa.</p>`)}
        <h3>5. Ohmímetro</h3>
        <p>Pilha + galvanômetro + resistor de ajuste: $i = E/(R_\text{int} + R_x)$. Escala invertida e não linear; o meio da escala marca $R_x = R_\text{int}$. Sempre com o circuito <b>desligado</b> (a pilha interna é a fonte).</p>
        <h3>6. Métodos de zero: ponte e potenciômetro</h3>
        <p>Em vez de medir uma corrente, ajusta-se o circuito até um galvanômetro marcar <b>zero</b>. No zero, o medidor não perturba nada e a precisão só depende dos resistores de referência. Ponte de Wheatstone ${F.ret("C08")} para resistências; potenciômetro para fems:</p>
        ${F.fig(figPot)}
        ${F.caixa("pegadinha", R`<p>No multímetro, para medir corrente a ponta vermelha muda de borne (mA ou 10A). Esquecer ela lá e depois tentar medir tensão é ligar um amperímetro em paralelo: fusível queimado.</p>`)}`),
      F.secao("exemplos", "Exemplos passo a passo", exemplario),
      F.secao("resumo", "Resumo", R`<div class="resumo"><div class="r"><b>Amperímetro</b>série; $R_A \to 0$; shunt $R_gi_g/(I - i_g)$</div><div class="r"><b>Voltímetro</b>paralelo; $R_V \to \infty$; série $V/i_g - R_g$</div><div class="r"><b>Inserção</b>curta mede $R\parallel R_V$; longa mede $R + R_A$</div><div class="r"><b>Zero</b>ponte e potenciômetro: sem corrente no medidor</div></div>`),
      F.secao("exercicios", "Exercícios", `<div class="exs-nivel"><h3>Nível Físico</h3><span class="selo">fixação</span></div>${exsF.join("")}<div class="exs-nivel"><h3>Nível Máximo</h3><span class="selo">OBF · ITA · RU</span></div>${exsM.join("")}`),
      F.secao("chefao", "Chefão", chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-md"); e.outerHTML = F.lab("Multímetro: ligações certas e erradas", "lab-md"); SIM.medidores(document.getElementById("lab-md"), F); },
});
