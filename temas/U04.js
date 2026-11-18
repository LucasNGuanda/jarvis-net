/* U04 · Hamilton, espaço de fase e princípio da mínima ação (com as minhas palavras). Conferido em Python:
   queda com T = 2 s (m = 1 kg): S = −g²/3 ≈ −32,08 J·s; movimento uniforme 10 m em 2 s: S = 25 J·s, parado metade + dobro da velocidade: 50 J·s;
   oscilador m = 1, k = 4, E = 2 J: x_máx = 1 m, p_máx = 2 kg·m/s, área = 2π = 2πE/ω; ação num período do oscilador: 0. */
F.registrar("U04", {
  retoma: ["U03", "O08", "C17b"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Espaço de fase e ação",
      casos: [
        { nome: "Elipse do oscilador", gerar: (p) => {
          const m = p ? 1 : F.escolha([0.5, 1, 2]), k = p ? 4 : F.escolha([2, 4, 8, 18]), E = p ? 2 : F.escolha([0.5, 1, 2, 4]), w = Math.sqrt(k / m), xm = Math.sqrt((2 * E) / k), pm = Math.sqrt(2 * m * E);
          return { enun: R`<p>Um oscilador tem $m = ${F.n(m)}$ kg, $k = ${k}$ N/m e energia $E = ${F.n(E)}$ J. Desenhe a trajetória no espaço de fase $(x, p)$ e calcule a área que ela envolve.</p>`, fig: "",
            passos: [
              R`<p>$H = \frac{p^2}{2m} + \frac12kx^2 = E$ é uma elipse. Semieixos: $x_\text{máx} = \sqrt{2E/k} \approx ${F.n(xm, 3)}$ m e $p_\text{máx} = \sqrt{2mE} \approx ${F.n(pm, 3)}$ kg·m/s.</p>`,
              R`<p>Área $= \pi x_\text{máx}p_\text{máx} \approx ${F.n(Math.PI * xm * pm, 3)}$ J·s.</p>`,
              R`<p>Confira com a fórmula geral: $\frac{2\pi E}{\omega} = \frac{2\pi\cdot${F.n(E)}}{${F.n(w, 3)}} \approx ${F.n((2 * Math.PI * E) / w, 3)}$ J·s. ✓ A área é energia × período: a dimensão de <b>ação</b>, a mesma de $h$.</p>`,
            ] };
        } },
        { nome: "Ação de dois caminhos", gerar: (p) => {
          const m = p ? 1 : F.escolha([1, 2]), L = p ? 10 : F.escolha([4, 6, 10]), T = p ? 2 : F.escolha([1, 2, 4]), S1 = (m * L * L) / (2 * T), S2 = (m * L * L) / T;
          return { enun: R`<p>Uma partícula livre de ${m} kg vai de $x = 0$ a $x = ${L}$ m em ${T} s. Compare a ação do movimento uniforme com a de um caminho "inventado": parada na metade do tempo e depois o dobro da velocidade.</p>`, fig: "",
            passos: [
              R`<p>Sem potencial, $L = T$ (cinética). Uniforme: $v = ${F.n(L / T)}$ m/s, $S = \frac12m v^2\cdot T = ${F.n(S1)}$ J·s.</p>`,
              R`<p>Inventado: parada ($S = 0$) por ${F.nt(T / 2)} s e depois $v = ${F.n((2 * L) / T)}$ m/s por ${F.nt(T / 2)} s: $S = \frac12\cdot${m}\cdot${F.n((2 * L) / T)}^2\cdot${F.n(T / 2)} = ${F.n(S2)}$ J·s.</p>`,
              R`<p>O dobro. Em geral, $\int v^2\,dt$ com $\int v\,dt$ fixo é mínimo com $v$ constante (desigualdade de Cauchy–Schwarz): a natureza escolheu o movimento uniforme, que é a 1ª lei de Newton.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Do espaço de fase ao quantum",
      enun: R`<p>(a) Mostre que a trajetória de um oscilador harmônico ($m$, $\omega$, energia $E$) no espaço de fase envolve área $\oint p\,dx = \frac{2\pi E}{\omega}$. (b) Em 1915, Sommerfeld propôs a regra de quantização $\oint p\,dx = nh$. Que energias ela dá ao oscilador? (c) Aplique a mesma regra a uma órbita circular, usando o ângulo $\varphi$ e o momento angular $L$ como par $(q, p)$: o que sai? (d) A equação de Schrödinger (U06) dá $E_n = \left(n + \frac12\right)\hbar\omega$ para o oscilador. O que a regra antiga erra?</p>`,
      fig: "",
      dicas: [R`<p>(a) A elipse tem semieixos $\sqrt{2E/(m\omega^2)}$ e $\sqrt{2mE}$; área $= \pi ab$.</p>`, R`<p>(c) Na órbita circular, $L$ é constante: $\oint L\,d\varphi = 2\pi L$.</p>`],
      sol: R`<p><b>(a)</b> $\pi\sqrt{\frac{2E}{m\omega^2}}\sqrt{2mE} = \frac{2\pi E}{\omega}$.</p>
        <p><b>(b)</b> $\frac{2\pi E}{\omega} = nh \Rightarrow E_n = n\frac{h\omega}{2\pi} = n\hbar\omega$: níveis igualmente espaçados por $\hbar\omega$, exatamente os "pacotes" de Planck ${F.ret("C16")}.</p>
        <p><b>(c)</b> $2\pi L = nh \Rightarrow L = n\hbar$: a regra de Bohr para o átomo de hidrogênio ${F.ret("C17b")}, agora como caso de uma regra geral.</p>
        <p><b>(d)</b> Falta o $\frac12\hbar\omega$, a <b>energia de ponto zero</b>: mesmo no estado fundamental o oscilador não para (o princípio da incerteza proíbe $x = 0$ e $p = 0$ ao mesmo tempo). A regra correta, para órbitas grandes, é $\oint p\,dx = \left(n + \frac12\right)h$ (quantização WKB). A lição: cada estado quântico ocupa uma área $h$ no espaço de fase. É daí que vem a contagem de estados da física estatística.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Universitária · Hamilton e ação</div>
        <div class="q">Como a bola "sabe" que caminho fazer?</div>
        <p>Newton diz: a cada instante, a força muda a velocidade, e o caminho vai se construindo passo a passo. Mas existe outro jeito, que parece mágico: entre todos os caminhos possíveis com o mesmo começo e o mesmo fim, a natureza escolhe aquele que torna uma certa quantidade, a <b>ação</b>, estacionária. É o mesmo espírito do princípio de Fermat para a luz ${F.ret("O08")}, e é a forma como toda a física fundamental é escrita hoje.</p></div>`),

      F.secao("acao", "Princípio da mínima ação", R`
        ${F.formula(R`S[x(t)] = \int_{t_1}^{t_2}L(x, \dot x, t)\,dt\qquad\qquad \delta S = 0\ \Longleftrightarrow\ \frac{d}{dt}\frac{\partial L}{\partial\dot x} = \frac{\partial L}{\partial x}`, "Princípio de Hamilton")}
        <p>A ação $S$ é um número que se calcula para um caminho inteiro (um "funcional"). O princípio diz: deformando o caminho real um pouquinho (mantendo as pontas), $S$ não muda em primeira ordem. Fazendo a conta (cálculo das variações), essa condição é exatamente a equação de Euler–Lagrange ${F.ret("U03")}. Por isso a lagrangiana é $T - V$: é o que dá Newton.</p>
        <div id="lab-acao"></div>
        <p>Na simulação, a bola sobe e desce em 2 s. O caminho real tem $S = -\frac{mg^2T^3}{24} \approx -32{,}08$ J·s ($m = 1$ kg, $T = 2$ s). Qualquer deformação $\varepsilon\,\eta(t)$ aumenta a ação em exatamente $\frac{m\varepsilon^2}{2}\int\dot\eta^2\,dt$: uma parábola em $\varepsilon$ com mínimo em zero. Para a queda livre, "mínima" é literal.</p>
        ${F.caixa("pegadinha", R`<p><b>"Mínima" às vezes é mentira</b>. A condição é $\delta S = 0$: estacionária. Para intervalos de tempo curtos, é um mínimo; para longos, pode ser um ponto de sela (num oscilador, depois de meio período, o caminho real deixa de ser mínimo). O nome "mínima ação" ficou por razões históricas (Maupertuis, 1744).</p>`)}
        ${F.caixa("ideia", R`<p><b>Por que a natureza faria isso?</b> A resposta veio com Feynman (1948): na mecânica quântica, a partícula "tenta" todos os caminhos, cada um contribuindo com uma fase $e^{iS/\hbar}$. Longe do caminho de ação estacionária, as fases variam rápido e se cancelam; perto dele, se somam. No limite clássico ($S \gg \hbar$), só sobra o caminho de $\delta S = 0$. Exatamente como a luz e Fermat, onde as ondas se cancelam fora do caminho de tempo mínimo.</p>`)}`),

      F.secao("hamilton", "Hamiltoniana e espaço de fase", R`
        ${F.formula(R`H(q, p) = p\dot q - L\qquad\qquad \dot q = \frac{\partial H}{\partial p}\qquad \dot p = -\frac{\partial H}{\partial q}`, "Equações de Hamilton")}
        <p>Hamilton (1833) trocou $\dot q$ pelo momento $p = \partial L/\partial\dot q$ como variável. Para $L = \frac12m\dot x^2 - V$: $p = m\dot x$ e $H = \frac{p^2}{2m} + V$, a <b>energia total</b>. Em vez de uma equação de 2ª ordem, ficam duas de 1ª ordem, simétricas.</p>
        <p>Oscilador: $H = \frac{p^2}{2m} + \frac12kx^2$. Hamilton: $\dot x = p/m$ e $\dot p = -kx$. Juntando, $m\ddot x = -kx$. ✓</p>
        <p>O par $(q, p)$ define um ponto no <b>espaço de fase</b>, e o estado inteiro do sistema é esse ponto: sabendo $(q, p)$ agora, Hamilton diz o futuro. Como $H$ se conserva, cada trajetória fica numa curva $H = E$. Para o oscilador, uma elipse de área $\frac{2\pi E}{\omega}$.</p>
        ${F.caixa("fisico", R`<p><b>Teorema de Liouville</b>: uma "nuvem" de condições iniciais se move no espaço de fase como um fluido incompressível. Ela pode se esticar, torcer, virar um filamento, mas a <b>área</b> (volume, em mais dimensões) não muda. Consequência: não existe atrator em sistema hamiltoniano (sem atrito). E é a base da física estatística: estados igualmente prováveis ocupam volumes iguais no espaço de fase.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Invariante adiabático</b>: se um parâmetro muda devagar (o comprimento de um pêndulo sendo encurtado lentamente), a área no espaço de fase $\oint p\,dq$ se conserva, mesmo que a energia não. Para o oscilador: $E/\omega$ é constante. Encurtando o fio, $\omega$ sobe e a energia sobe na mesma proporção. Essa ideia aparece em olimpíadas como "pêndulo com fio puxado devagar".</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Escreva a hamiltoniana do oscilador harmônico e as equações de Hamilton. Mostre que elas dão $m\ddot x = -kx$.</p>`, fig: "", dicas: [R`<p>$H = \frac{p^2}{2m} + \frac12kx^2$.</p>`, R`<p>Derive a 1ª equação no tempo e use a 2ª.</p>`], resp: R`$\dot x = p/m$, $\dot p = -kx$, então $m\ddot x = \dot p = -kx$.`, sol: R`<p>Duas equações de 1ª ordem no lugar de uma de 2ª: é o que métodos numéricos (Runge–Kutta) gostam.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Uma partícula de massa $m$ em queda livre (altura $z$). Escreva $L$, o momento $p$ e $H$. $H$ é a energia?</p>`, fig: "", dicas: [R`<p>$L = \frac12m\dot z^2 - mgz$.</p>`, R`<p>$H = p\dot z - L$.</p>`], resp: R`$p = m\dot z$; $H = \frac{p^2}{2m} + mgz$: sim, é a energia.`, sol: R`<p>$H = T + V$ sempre que $T$ é quadrática nas velocidades e $V$ não depende delas.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Oscilador com $m = 1$ kg, $k = 4$ N/m e $E = 2$ J. Ache os semieixos da elipse no espaço de fase e a área. Confira com $2\pi E/\omega$.</p>`, fig: "", dicas: [R`<p>$x_\text{máx} = \sqrt{2E/k}$, $p_\text{máx} = \sqrt{2mE}$.</p>`, R`<p>$\omega = \sqrt{k/m}$.</p>`], resp: R`1 m e 2 kg·m/s; área $2\pi$ J·s.`, sol: R`<p>$\omega = 2$ rad/s: $2\pi\cdot2/2 = 2\pi$. ✓</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Uma partícula livre de 1 kg vai de 0 a 10 m em 2 s. Calcule a ação do movimento uniforme e de um caminho em que ela fica parada 1 s e depois anda a 10 m/s.</p>`, fig: "", dicas: [R`<p>Sem $V$: $S = \int\frac12mv^2\,dt$.</p>`, R`<p>Uniforme: $v = 5$ m/s por 2 s.</p>`], resp: R`25 J·s e 50 J·s.`, sol: R`<p>O caminho real tem a menor ação. Com velocidade constante $v = L/T$: $S = \frac{mL^2}{2T}$.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>A partir de $L = \frac12m\dot x^2 - V(x)$, faça a transformação de Legendre e mostre que $H = T + V$.</p>`, fig: "", dicas: [R`<p>$p = m\dot x$, então $\dot x = p/m$.</p>`, R`<p>$H = p\cdot\frac{p}{m} - \frac{p^2}{2m} + V$.</p>`], resp: R`$H = \frac{p^2}{2m} + V$.`, sol: R`<p>A transformação de Legendre troca uma variável pela derivada da função em relação a ela. A mesma ideia aparece na termodinâmica (energia interna → entalpia → energia livre).</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Partículas livres de massa 1 kg começam espalhadas no quadrado $0 \le x \le 1$, $0 \le p \le 1$ do espaço de fase. Que forma a nuvem tem em $t = 2$ s? A área mudou?</p>`, fig: "", dicas: [R`<p>Cada ponto vai para $(x + pt,\ p)$.</p>`, R`<p>Os vértices viram $(0,0)$, $(1,0)$, $(3,1)$, $(2,1)$.</p>`], resp: R`Um paralelogramo inclinado; área continua 1.`, sol: R`<p>Base 1, altura 1: área 1. A nuvem fica cada vez mais "deitada" (as partículas rápidas se adiantam), mas a área não muda: Liouville.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Calcule a ação $\int(T - V)\,dt$ de um oscilador harmônico ao longo de um período completo. Que relação entre a média de $T$ e a de $V$ isso mostra?</p>`, fig: "", dicas: [R`<p>$x = A\sin\omega t$: $T = \frac12mA^2\omega^2\cos^2\omega t$, $V = \frac12kA^2\sin^2\omega t$.</p>`, R`<p>Médias de $\cos^2$ e $\sin^2$ num período: $\frac12$ cada.</p>`], resp: R`Zero: $\langle T\rangle = \langle V\rangle$.`, sol: R`<p>Com $k = m\omega^2$, os dois termos têm a mesma amplitude, e as médias são iguais a $E/2$. É o <b>teorema do virial</b> para o potencial quadrático. Para a gravidade ($V \propto 1/r$), o virial dá $2\langle T\rangle = -\langle V\rangle$.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-acao"); e.outerHTML = F.lab("Caminhos e ação", "lab-acao"); SIM.acao(document.getElementById("lab-acao"), F); },
});
