/* N07 · Reynolds, turbulência e o Problema do Milênio. Conferido em Python:
   cano de 2 cm com água: v = 5 cm/s → Re = 1000 (laminar); v = 20 cm/s → Re = 4000;
   bactéria (R = 1 μm, ρ = 1100, v = 30 μm/s): Re ≈ 3e-5, tempo de frenagem m/(6πμR) ≈ 2,4e-7 s, desliza ≈ 7e-12 m;
   nadador (1 m/s, 2 m): Re = 2e6; carro (30 m/s, 4 m, ar): Re = 8e6;
   fator de atrito: 64/Re em Re = 2000 → 0,032; Blasius 0,316·Re^(−1/4) em Re = 1e5 → 0,0178;
   escala de Kolmogorov na água com ε = 1 W/kg: (ν³/ε)^(1/4) ≈ 32 μm; DNS com Re = 1e6: Re^(9/4) ≈ 3e13 pontos. */
F.registrar("N07", {
  retoma: ["N05", "N06"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Calcule o Reynolds",
      casos: [
        { nome: "Laminar ou turbulento?", gerar: (p) => {
          const L = [["água num cano de 2 cm a 5 cm/s", 1000, 0.05, 0.02, 1.0e-3], ["água numa mangueira de 2 cm a 2 m/s", 1000, 2, 0.02, 1.0e-3], ["mel (μ ≈ 10 Pa·s) num canudo de 5 mm a 1 cm/s", 1400, 0.01, 0.005, 10], ["ar num duto de 20 cm a 3 m/s", 1.2, 3, 0.2, 1.8e-5], ["óleo de motor num cano de 1 cm a 1 m/s", 900, 1, 0.01, 0.1]];
          const [nome, rho, v, D, mu] = p ? L[0] : F.escolha(L), Re = (rho * v * D) / mu, reg = Re < 2300 ? "laminar" : Re < 4000 ? "de transição" : "turbulento";
          return { enun: R`<p>Qual o regime de ${nome}?</p>`, fig: "",
            passos: [R`<p>$\text{Re} = \frac{\rho vD}{\mu} = \frac{${F.sigL(rho, 3)}\cdot${F.sigL(v, 2)}\cdot${F.sigL(D, 2)}}{${F.sigL(mu, 2)}} \approx ${F.sigL(Re, 2)}$.</p>`, R`<p>No cano: abaixo de ~2300, laminar; acima de ~4000, turbulento. Aqui: <b>${reg}</b>.</p>`, Re < 2300 ? R`<p>Vale Hagen–Poiseuille ${F.ret("N06")}: $\Delta p \propto v$, fator de atrito $f = 64/\text{Re} \approx ${F.n(64 / Re, 4)}$.</p>` : R`<p>Hagen–Poiseuille não vale. Uma fórmula empírica (Blasius, até Re ~ $10^5$): $f \approx 0{,}316\,\text{Re}^{-1/4} \approx ${F.n(0.316 * Math.pow(Re, -0.25), 4)}$, e $\Delta p \propto v^{1{,}75}$.</p>`] };
        } },
        { nome: "Túnel de vento (semelhança)", gerar: (p) => {
          const k = p ? 4 : F.escolha([2, 4, 10]), V = p ? 30 : F.escolha([20, 30]);
          return { enun: R`<p>Uma maquete na escala 1:${k} de um carro que anda a ${V} m/s vai para um túnel de vento. A que velocidade o ar deve passar para o escoamento ser semelhante ao real? E se o teste for num tanque de água ($\nu_\text{água} \approx \nu_\text{ar}/15$)?</p>`, fig: "",
            passos: [R`<p>Semelhança: mesmo $\text{Re} = \frac{vL}\nu$. Com $L$ dividido por ${k}, $v$ precisa ser multiplicada por ${k}: ${k * V} m/s no ar.</p>`, R`<p>Na água, $\nu$ é 15 vezes menor: $v = \frac{${k * V}}{15} \approx ${F.n((k * V) / 15, 3)}$ m/s.</p>`, k * V > 100 ? R`<p>${k * V} m/s no ar já passa de um terço da velocidade do som: aí a compressibilidade muda a física (outro número, o de Mach, também precisa bater). Por isso testes de modelos pequenos usam água ou ar pressurizado.</p>` : R`<p>Mesma geometria + mesmo Reynolds = mesmo escoamento, em escala. É por isso que um número sem dimensão resume tanta coisa.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A cascata de Kolmogorov",
      enun: R`<p>Na turbulência, a energia entra em redemoinhos grandes e passa para redemoinhos cada vez menores, até ser dissipada pela viscosidade nos menores. Kolmogorov (1941) supôs que, nas escalas intermediárias, a única coisa que importa é a taxa $\varepsilon$ (W/kg = m²/s³) com que a energia desce a cascata. (a) Por análise dimensional, ache a velocidade típica $v_\ell$ de um redemoinho de tamanho $\ell$. (b) O espectro de energia $E(k)$, com $k$ o número de onda (1/m), tem unidade m³/s². Mostre que $E(k) = C\varepsilon^{2/3}k^{-5/3}$. (c) Os menores redemoinhos são aqueles em que a viscosidade passa a importar: só $\varepsilon$ e $\nu$. Ache a escala de Kolmogorov $\eta$ e calcule para a água ($\nu = 10^{-6}$ m²/s) com $\varepsilon = 1$ W/kg. (d) Com $\varepsilon \sim v^3/L$ para os redemoinhos grandes, mostre que $L/\eta \sim \text{Re}^{3/4}$ e estime quantos pontos uma simulação 3D direta precisa para $\text{Re} = 10^6$.</p>`,
      fig: "",
      dicas: [R`<p>(a) $v_\ell = \varepsilon^a\ell^b$: m/s = (m²/s³)$^a$ m$^b$. (c) $\eta = \nu^a\varepsilon^b$.</p>`, R`<p>(d) Pontos de grade: $(L/\eta)^3$.</p>`],
      sol: R`<p><b>(a)</b> Segundos: $-1 = -3a \Rightarrow a = \frac13$; metros: $1 = 2a + b \Rightarrow b = \frac13$. $v_\ell \sim (\varepsilon\ell)^{1/3}$: redemoinhos menores giram mais devagar, mas por menos tempo.</p>
        <p><b>(b)</b> $E = \varepsilon^ak^b$: s: $-2 = -3a \Rightarrow a = \frac23$; m: $3 = 2a - b \Rightarrow b = -\frac53$. É a famosa lei dos $-5/3$, confirmada em medidas de marés, de vento e de túneis de vento.</p>
        <p><b>(c)</b> $\eta = \nu^a\varepsilon^b$: s: $0 = -a - 3b$; m: $1 = 2a + 2b$. Então $a = \frac34$, $b = -\frac14$: $\eta = \left(\frac{\nu^3}\varepsilon\right)^{1/4} = (10^{-18})^{1/4} \approx 3\times10^{-5}$ m $= 32$ μm.</p>
        <p><b>(d)</b> $\frac L\eta = \frac{L\varepsilon^{1/4}}{\nu^{3/4}} = \frac{L(v^3/L)^{1/4}}{\nu^{3/4}} = \left(\frac{vL}\nu\right)^{3/4} = \text{Re}^{3/4}$. Pontos: $(L/\eta)^3 = \text{Re}^{9/4} = (10^6)^{9/4} \approx 3\times10^{13}$, e ainda é preciso multiplicar pelo número de passos de tempo. Por isso não dá para simular um avião "na força bruta": usam-se modelos de turbulência, que são aproximações.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Fluidos · turbulência</div>
        <div class="q">Por que a fumaça de um incenso sobe reta e depois vira bagunça?</div>
        <p>Perto da ponta, a fumaça é lenta e o escoamento é <b>laminar</b>: camadas organizadas. Ela acelera subindo (é mais quente), e a partir de certa altura pequenas perturbações deixam de ser amortecidas e crescem: o escoamento vira <b>turbulento</b>. Quem decide é um único número.</p></div>`),

      F.secao("reynolds", "O número de Reynolds", R`
        ${F.formula(R`\text{Re} = \frac{\rho vL}{\mu} = \frac{vL}{\nu} \sim \frac{\text{inércia } \rho(\vec v\cdot\nabla)\vec v}{\text{viscosidade } \mu\nabla^2\vec v}`, "Número de Reynolds (L = tamanho típico; no cano, o diâmetro)")}
        <p>Em 1883, Osborne Reynolds injetou um filete de corante no meio de um cano de vidro com água. Em velocidade baixa, o filete seguia reto; acima de certo valor de $\rho vD/\mu$, ele tremia, se rasgava e coloria o cano inteiro. O número crítico num cano comum é por volta de <b>2300</b> (com muito cuidado, sem vibração nenhuma, dá para manter laminar até bem mais).</p>
        <div id="lab-rey"></div>
        <table class="tb"><tr><th>situação</th><th>Re (ordem de grandeza)</th></tr>
          <tr><td>bactéria nadando</td><td>$10^{-5}$</td></tr><tr><td>mel escorrendo</td><td>$10^{-2}$</td></tr><tr><td>água num cano de 2 cm a 5 cm/s</td><td>$10^3$</td></tr><tr><td>pessoa nadando</td><td>$10^6$</td></tr><tr><td>carro na estrada</td><td>$10^7$</td></tr><tr><td>avião</td><td>$10^8$</td></tr></table>
        ${F.caixa("fisico", R`<p><b>A vida em Re baixo</b> (Purcell, 1977): para uma bactéria, a água é mais "grossa" que mel para nós. Se ela parar de nadar, ela para em menos de um milionésimo de segundo, depois de deslizar menos que o tamanho de um átomo. Não existe "embalo": ela não consegue nadar com um movimento que vai e volta igual (como uma vieira abrindo e fechando), porque em Re ≈ 0 o filme de trás para frente é igualmente possível. Por isso bactérias usam flagelos que giram como saca-rolhas.</p>`)}
        ${exemplario}`),

      F.secao("turbulencia", "Turbulência", R`
        <p>Turbulência é o escoamento caótico, com redemoinhos de todos os tamanhos. É o que acontece com quase todo escoamento do dia a dia: rios, vento, a fumaça de uma chaminé, a água da torneira bem aberta. Características:</p>
        <ul><li><b>caótica</b>: duas condições iniciais quase iguais se separam rápido (como no pêndulo duplo);</li>
          <li><b>mistura muito</b>: o leite no café se espalha em segundos mexendo, e levaria horas por difusão;</li>
          <li><b>dissipa muito</b>: a queda de pressão num cano turbulento cresce quase com $v^2$, não com $v$;</li>
          <li><b>cascata de energia</b>: a energia entra nos redemoinhos grandes e desce para os pequenos até a viscosidade transformar em calor.</li></ul>
        ${F.caixa("ideia", R`<p>Lewis Fry Richardson resumiu a cascata num verso (1922): <i>"Big whirls have little whirls that feed on their velocity, and little whirls have lesser whirls and so on to viscosity."</i> ("Redemoinhos grandes têm redemoinhos menores, que se alimentam da sua velocidade, e os menores têm outros ainda menores, e assim até a viscosidade.") O chefão faz a conta de Kolmogorov.</p>`)}`),

      F.secao("milenio", "O Problema do Milênio", R`
        <p>Em 2000, o Clay Mathematics Institute listou sete problemas da matemática, com prêmio de 1 milhão de dólares para cada. Um deles é sobre Navier–Stokes, na forma enunciada por Charles Fefferman:</p>
        ${F.caixa("olimpiada", R`<p><b>Existência e suavidade.</b> Em 3D, para um fluido incompressível, partindo de qualquer velocidade inicial suave (e que decai rápido no infinito, ou periódica), prove que existe uma solução de Navier–Stokes suave para <b>todo</b> tempo, ou mostre um contraexemplo: uma condição inicial suave cuja solução "explode" (a velocidade ou suas derivadas vão a infinito) num tempo finito.</p>`)}
        <p><b>O que já se sabe:</b></p>
        <ul><li>Para tempos curtos, a solução suave existe (e é única).</li>
          <li>Em <b>2D</b>, a solução suave existe para sempre: o problema está resolvido há décadas.</li>
          <li>Em 3D, Jean Leray (1934) provou que existem soluções "fracas" para sempre, mas não se sabe se elas são suaves nem se são únicas.</li></ul>
        <p><b>Por que 3D é diferente?</b> Pelo esticamento de vórtices, o termo $(\vec\omega\cdot\nabla)\vec v$ da equação da vorticidade (${F.ret("N05")}, desafio 7). Em 2D ele é zero e a vorticidade só é carregada e espalhada. Em 3D, esticar um tubo de vórtice o faz girar mais rápido, o que estica mais… Ninguém sabe se a viscosidade sempre ganha essa corrida.</p>
        ${F.caixa("pegadinha", R`<p>Note o que o problema <b>não</b> é: não é "resolver Navier–Stokes" (achar uma fórmula), nem "entender a turbulência". É uma pergunta sobre a própria equação: ela sempre tem resposta bem comportada? Engenheiros usam Navier–Stokes no computador todo dia; a dúvida é matemática.</p>`)}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Água ($\mu = 10^{-3}$ Pa·s) num cano de 2 cm de diâmetro. Até que velocidade média o escoamento é laminar (Re < 2300)?</p>`, fig: "", dicas: [R`<p>$v = \frac{\text{Re}\,\mu}{\rho D}$.</p>`], resp: R`$v \approx 11{,}5$ cm/s.`, sol: R`<p>$\frac{2300\cdot10^{-3}}{1000\cdot0{,}02} = 0{,}115$ m/s. Uma torneira aberta passa disso fácil: o jato da torneira é laminar só quando ela está quase fechada (o jato fica "liso" e transparente).</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Uma bactéria (esfera de raio 1 μm, densidade 1100 kg/m³) nada a 30 μm/s na água. Calcule o Re dela e quanto ela desliza se parar de nadar (use o arrasto de Stokes $6\pi\mu Rv$ ${F.ret("N04")}).</p>`, fig: "", dicas: [R`<p>Com arrasto linear, $v$ cai exponencialmente com tempo característico $\tau = \frac{m}{6\pi\mu R}$.</p>`, R`<p>Distância total: $v_0\tau$.</p>`], resp: R`Re $\approx 3\times10^{-5}$; $\tau \approx 2{,}4\times10^{-7}$ s; desliza $\approx 7\times10^{-12}$ m.`, sol: R`<p>$m = \frac43\pi R^3\rho \approx 4{,}6\times10^{-15}$ kg; $6\pi\mu R \approx 1{,}9\times10^{-8}$ kg/s. Sete picômetros: menos que o raio de um átomo de hidrogênio (~50 pm).</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Compare o fator de atrito laminar em Re = 2000 com o turbulento (Blasius) em Re = $10^5$. Se a velocidade num cano dobra, por quanto a queda de pressão se multiplica em cada regime?</p>`, fig: "", dicas: [R`<p>$\Delta p = f\frac{L}{D}\frac{\rho v^2}2$; laminar $f = 64/\text{Re}$, Blasius $f = 0{,}316\,\text{Re}^{-1/4}$.</p>`, R`<p>Laminar: $f \propto v^{-1}$, então $\Delta p \propto v$. Turbulento: $\Delta p \propto v^{2 - 1/4}$.</p>`], resp: R`$f = 0{,}032$ e $f \approx 0{,}018$. Dobrando $v$: laminar ×2; turbulento ×$2^{1{,}75} \approx 3{,}4$.`, sol: R`<p>No laminar, a fórmula com $f = 64/\text{Re}$ é exatamente Hagen–Poiseuille ${F.ret("N06")} escrita de outro jeito.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Mostre que $\text{Re} = \frac{\rho vL}{\mu}$ não tem unidade.</p>`, fig: "", dicas: [R`<p>$[\mu] = $ Pa·s $=$ kg/(m·s).</p>`], resp: R`(kg/m³)(m/s)(m) / (kg/(m·s)) = 1.`, sol: R`<p>Por não ter unidade, Re é o mesmo em qualquer sistema de unidades: por isso ele "significa" algo físico (a razão entre dois efeitos).</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma maquete 1:10 de um submarino que anda a 5 m/s é testada num tanque de água. A que velocidade? Isso é viável?</p>`, fig: "", dicas: [R`<p>Mesmo Re com o mesmo fluido: $vL$ igual.</p>`], resp: R`50 m/s.`, sol: R`<p>50 m/s na água é muito difícil (e cavitaria). Na prática, testa-se em Re menor e extrapola-se, ou usa-se outro fluido. Semelhança perfeita é rara.</p>` }),
        F.exercicio({ n: 6, enun: R`<p>Por análise dimensional, ache a escala de Kolmogorov $\eta(\nu, \varepsilon)$, com $\varepsilon$ em W/kg. Quanto vale numa xícara de café mexida com $\varepsilon \approx 0{,}01$ W/kg ($\nu \approx 10^{-6}$ m²/s)?</p>`, fig: "", dicas: [R`<p>$[\nu] = $ m²/s, $[\varepsilon] = $ m²/s³.</p>`, R`<p>$\eta = (\nu^3/\varepsilon)^{1/4}$.</p>`], resp: R`$\eta = (\nu^3/\varepsilon)^{1/4} \approx (10^{-16})^{1/4} = 10^{-4}$ m $= 0{,}1$ mm.`, sol: R`<p>Abaixo de ~0,1 mm a viscosidade apaga os redemoinhos e o leite termina de se misturar por difusão. Chefão: a conta completa.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Por que o termo de esticamento de vórtices $(\vec\omega\cdot\nabla)\vec v$ é zero em escoamentos 2D? E por que isso importa para o Problema do Milênio?</p>`, fig: "", dicas: [R`<p>Em 2D, $\vec v = (u(x, y), v(x, y), 0)$. Para onde aponta $\vec\omega$?</p>`, R`<p>$\vec\omega = \omega\hat z$, então $\vec\omega\cdot\nabla = \omega\partial_z$, e nada depende de $z$.</p>`], resp: R`$\vec\omega$ aponta em $z$ e $\partial_z\vec v = 0$: o termo some. A vorticidade em 2D só é transportada e difundida, nunca amplificada.`, sol: R`<p>Sem amplificação, dá para provar que nada explode: o caso 2D está resolvido. Em 3D, o esticamento pode amplificar a vorticidade, e a pergunta é se a viscosidade sempre segura. É uma corrida entre um termo não linear (que concentra) e um linear (que espalha).</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-rey"); e.outerHTML = F.lab("O experimento de Reynolds", "lab-rey"); SIM.reynolds(document.getElementById("lab-rey"), F); },
});
