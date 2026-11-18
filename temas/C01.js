/* C01 · Carga Elétrica e Processos de Eletrização
   Base: Halliday vol. 3, cap. 21 (seções 21-1 a 21-6), reescrito. Contas conferidas em Python (scratchpad c0x.py). */
F.registrar("C01", {
  html(F) {
    const R = String.raw;
    const esf = (x, y, r, txt, cor = "var(--mod)") => `<circle cx="${x}" cy="${y}" r="${r}" style="fill:color-mix(in srgb,${cor} 20%,var(--card));stroke:${cor};stroke-width:2"/>${D.txt(x, y + 5, txt, "tx")}`;
    const figContato = D.svg(520, 120, esf(80, 60, 34, "+8q") + esf(200, 60, 34, "−2q") + esf(320, 60, 34, "0") + D.txt(80, 112, "A", "tx2") + D.txt(200, 112, "B", "tx2") + D.txt(320, 112, "C", "tx2") + `<path d="M400 60 h60" class="ln2"/>` + D.txt(440, 50, "toques", "tx2"), "três esferas");
    const figInducao = D.svg(560, 150, `<rect x="30" y="62" width="150" height="26" rx="10" style="fill:#c9a86a;stroke:var(--ink)"/>${[0, 1, 2, 3, 4].map((i) => `<text x="${45 + 26 * i}" y="81" style="font:700 15px Inter;fill:#1a3a8a">−</text>`).join("")}
      <circle cx="330" cy="75" r="55" style="fill:var(--card2);stroke:var(--ink);stroke-width:2"/>${[0, 1, 2, 3].map((i) => `<text x="${287}" y="${48 + 18 * i}" style="font:700 15px Inter;fill:#ef5b5b">+</text><text x="${366}" y="${48 + 18 * i}" style="font:700 15px Inter;fill:#4f8dff">−</text>`).join("")}
      <path d="M385 75 h60 v40 M429 115 h32 M434 121 h22 M439 127 h12" class="ln"/><circle cx="415" cy="75" r="4" style="fill:var(--card);stroke:var(--ink);stroke-width:2"/>${D.txt(470, 80, "chave para a terra", "tx2", "start")}`, "indução");
    const figSerie = D.svg(560, 110, (() => { const it = ["pele humana", "vidro", "cabelo", "lã", "papel", "algodão", "borracha", "PVC", "teflon"]; let s = D.seta(30, 40, 530, 40, "var(--ink2)", 1.6) + D.txt(30, 26, "fica + (perde elétrons)", "tx2", "start") + D.txt(530, 26, "fica − (ganha elétrons)", "tx2", "end"); it.forEach((t, i) => (s += `<circle cx="${50 + i * 58}" cy="40" r="4" style="fill:var(--mod)"/>` + D.txt(50 + i * 58, 70 + (i % 2) * 18, t, "tx2"))); return s; })(), "série triboelétrica");

    const exemplario = F.exemplo({ casos: [
      { nome: "Contatos sucessivos", gerar: (p) => {
        const a = p ? 8 : F.escolha([6, 8, 10, 12, -6]), b = p ? -2 : F.escolha([-4, -2, 0, 2]), c = p ? 0 : F.escolha([0, 2, -2]);
        const ab = (a + b) / 2, ac = (ab + c) / 2;
        return { enun: R`<p>Três esferas condutoras <b>idênticas</b>: A com $${a}q$, B com $${b}q$, C com $${c}q$. Toca-se A em B e separa; depois A em C e separa. Qual a carga final de cada uma?</p>`, fig: figContato,
          passos: [R`<p>Esferas idênticas em contato viram um condutor só e, por simetria, dividem a carga total <b>igualmente</b>. A carga total se conserva.</p>`,
            R`<p>A + B: total $${a}q + (${b}q) = ${a + b}q$, cada uma fica com $${F.n(ab, 1)}q$.</p>`,
            R`<p>A + C: total $${F.n(ab, 1)}q + (${c}q) = ${F.n(ab + c, 1)}q$, cada uma fica com $${F.n(ac, 2)}q$.</p>`,
            R`<p><b>Resposta:</b> $q_A = ${F.n(ac, 2)}q$, $q_B = ${F.n(ab, 1)}q$, $q_C = ${F.n(ac, 2)}q$. Confere: soma $= ${F.n(ac + ab + ac, 1)}q = ${a + b + c}q$ ✓.</p>`] }; } },
      { nome: "Contar elétrons", gerar: (p) => {
        const Q = p ? -3.2 : F.escolha([-1.6, -3.2, -4.8, 8.0, -12.8]), un = p ? "nC" : F.escolha(["nC", "µC", "pC"]), f = { nC: 1e-9, "µC": 1e-6, pC: 1e-12 }[un], n = Math.abs(Q * f) / 1.602e-19;
        return { enun: R`<p>Um corpo tem carga $Q = ${F.n(Q, 1)}$ ${un}. Quantos elétrons ele ${Q < 0 ? "ganhou" : "perdeu"}?</p>`, fig: "",
          passos: [R`<p>Quantização: $Q = \pm n e$, com $e = 1{,}602\times10^{-19}$ C. ${Q < 0 ? "Negativo: sobram elétrons." : "Positivo: faltam elétrons (prótons não saem do núcleo)."}</p>`,
            R`$$n = \frac{|Q|}{e} = \frac{${F.sigM(Math.abs(Q * f), 2)}}{1{,}602\times10^{-19}} \approx ${F.sigM(n, 3)}$$`,
            R`<p><b>Resposta:</b> uns $${F.sigM(n, 2)}$ elétrons. Muito, mas perto dos ~$10^{23}$ elétrons de um grama de matéria, é uma fração ridícula.</p>`] }; } },
      { nome: "Esferas de tamanhos diferentes", gerar: (p) => {
        const r1 = p ? 1 : F.escolha([1, 2, 3]), r2 = p ? 3 : F.escolha([2, 4, 5, 6]), Q = p ? 8 : F.escolha([6, 8, 12, 15]);
        return { enun: R`<p>Duas esferas condutoras <b>distantes</b> uma da outra, de raios $${r1}$ cm e $${r2}$ cm, são ligadas por um fio fino. A carga total é $${Q}$ µC. Como ela se divide?</p>`, fig: D.svg(420, 110, esf(80, 55, 12 * r1, "R₁") + `<line x1="${80 + 12 * r1}" y1="55" x2="${330 - 12 * r2}" y2="55" class="ln2"/>` + esf(330, 55, Math.min(50, 10 * r2), "R₂"), "duas esferas ligadas"),
          passos: [R`<p>Ligadas, viram um condutor só: ficam no <b>mesmo potencial</b> ${F.ret("C05")}. Para uma esfera isolada, $V = kq/R$.</p>`,
            R`$$\frac{kq_1}{R_1} = \frac{kq_2}{R_2}\;\Rightarrow\;\frac{q_1}{q_2} = \frac{R_1}{R_2}$$<p>A carga se divide na proporção dos <b>raios</b> (não das áreas!).</p>`,
            R`$$q_1 = Q\frac{R_1}{R_1+R_2} = ${F.n((Q * r1) / (r1 + r2), 2)}\ \mu\text{C},\qquad q_2 = ${F.n((Q * r2) / (r1 + r2), 2)}\ \mu\text{C}$$`,
            R`<p><b>Resposta:</b> $q_1 = ${F.n((Q * r1) / (r1 + r2), 2)}$ µC e $q_2 = ${F.n((Q * r2) / (r1 + r2), 2)}$ µC. A esfera pequena tem menos carga, mas <b>densidade</b> maior: $\sigma \propto q/R^2 \propto 1/R$.</p>`] }; } },
    ] });

    const X = F.exercicio;
    const exsF = [
      X({ n: 1, enun: R`<p>Um pente atritado no cabelo fica com $-3{,}2$ nC. Quantos elétrons ele ganhou?</p>`, fig: D.svg(300, 70, `<rect x="40" y="20" width="220" height="16" rx="3" class="ln" style="fill:var(--card2)"/>${[...Array(18)].map((_, i) => `<line x1="${48 + 12 * i}" y1="36" x2="${48 + 12 * i}" y2="58" class="ln2"/>`).join("")}`, "pente"),
        dicas: [R`<p>$Q = ne$.</p>`, R`<p>$n = 3{,}2\times10^{-9}/1{,}602\times10^{-19}$.</p>`], resp: R`$n \approx 2{,}0\times10^{10}$ elétrons.`, sol: R`<p>$n = |Q|/e \approx 2{,}0\times10^{10}$.</p>` }),
      X({ n: 2, marcas: ["★"], enun: R`<p>Esferas condutoras idênticas: A com $+8q$, B com $-2q$, C neutra. Toca-se A em B e separa; depois A em C e separa. As cargas finais de A, B e C são:</p>`, fig: figContato,
        alts: ["$2q,\\ 2q,\\ 2q$", "$3q,\\ 3q,\\ 0$", "$1{,}5q,\\ 3q,\\ 1{,}5q$", "$3q,\\ 1{,}5q,\\ 1{,}5q$", "$4q,\\ 3q,\\ 4q$"],
        dicas: [R`<p>Idênticas dividem a soma igualmente.</p>`, R`<p>Depois do 1º toque, A e B ficam com $3q$.</p>`], resp: "C", sol: R`<p>A+B: $6q/2 = 3q$ cada. A+C: $3q/2 = 1{,}5q$ cada. B continua com $3q$. <b>A</b> é de quem dividiu as três de uma vez; <b>D</b> trocou B com A.</p>` }),
      X({ n: 3, marcas: ["★"], enun: R`<p>Para eletrizar <b>positivamente</b> uma esfera metálica neutra, isolada, usando só um bastão <b>negativo</b>, a sequência certa é:</p>`, fig: figInducao,
        alts: ["encostar o bastão, afastar o bastão", "aproximar o bastão, ligar a terra, afastar o bastão, desligar a terra", "aproximar o bastão, ligar a terra, desligar a terra, afastar o bastão", "ligar a terra, aproximar o bastão, afastar o bastão, desligar a terra", "aproximar o bastão e afastar, sem tocar"],
        dicas: [R`<p>Na indução, a esfera fica com carga de sinal <b>oposto</b> ao do indutor.</p>`, R`<p>A ordem de "desligar a terra" e "afastar o bastão" é tudo.</p>`], resp: "C", sol: R`<p>Com o bastão perto, a terra leva os elétrons repelidos. Desligando a terra <b>antes</b> de afastar, eles não podem voltar: a esfera fica positiva. Em <b>B</b>, ao afastar com a terra ligada, os elétrons voltam e a esfera fica neutra. <b>A</b> dá carga negativa (contato).</p>` }),
      X({ n: 4, enun: R`<p>Uma moeda de cobre neutra tem $3{,}11$ g. Quanto vale a carga <b>positiva</b> total (de todos os prótons) dentro dela? ($M_\text{Cu} = 63{,}5$ g/mol, $Z = 29$, $N_A = 6{,}022\times10^{23}$)</p>`, fig: D.svg(160, 110, `<circle cx="80" cy="55" r="42" style="fill:#c98a4a;stroke:var(--ink)"/>${D.txt(80, 61, "Cu", "tx")}`, "moeda"),
        dicas: [R`<p>Número de átomos: $n = (m/M)N_A$.</p>`, R`<p>Carga positiva: $29\,n\,e$.</p>`], resp: R`$\approx 1{,}4\times10^{5}$ C.`, sol: R`<p>$n = (3{,}11/63{,}5)\times6{,}022\times10^{23} \approx 2{,}95\times10^{22}$ átomos; $Q_+ = 29\times2{,}95\times10^{22}\times1{,}602\times10^{-19} \approx 1{,}37\times10^5$ C. Uma carga gigantesca, cancelada quase perfeitamente pelos elétrons: a matéria é neutra com precisão absurda.</p>` }),
      X({ n: 5, enun: R`<p>Um balão atritado no cabelo recebe $5{,}0\times10^{11}$ elétrons. Qual a carga dele?</p>`, fig: D.svg(150, 130, `<ellipse cx="75" cy="55" rx="38" ry="46" style="fill:color-mix(in srgb,#ef5b5b 35%,var(--card));stroke:var(--ink)"/><path d="M75 101 q-6 12 4 24" class="ln2"/>`, "balão"),
        dicas: [R`<p>Elétron tem carga $-e$.</p>`, R`<p>$Q = -5\times10^{11}\times1{,}602\times10^{-19}$.</p>`], resp: R`$Q \approx -8{,}0\times10^{-8}$ C $= -80$ nC.`, sol: R`<p>$Q = -ne \approx -8{,}0\times10^{-8}$ C.</p>` }),
      X({ n: 6, enun: R`<p>Duas esferas condutoras distantes, de raios $1$ cm e $3$ cm, são ligadas por um fio fino. A carga total é $8$ µC. Quanto fica em cada? E qual tem maior densidade superficial de carga?</p>`, fig: D.svg(380, 100, esf(70, 50, 14, "1") + `<line x1="84" y1="50" x2="268" y2="50" class="ln2"/>` + esf(300, 50, 36, "3"), "esferas ligadas"),
        dicas: [R`<p>Mesmo potencial: $q_1/R_1 = q_2/R_2$.</p>`, R`<p>$\sigma = q/(4\pi R^2)$.</p>`], resp: R`$2$ µC e $6$ µC; a pequena tem $\sigma$ 3 vezes maior.`, sol: R`<p>$q \propto R$: $q_1 = 8\cdot\frac14 = 2$ µC, $q_2 = 6$ µC. $\sigma_1/\sigma_2 = (q_1/q_2)(R_2/R_1)^2 = \frac13\cdot9 = 3$. É o <b>poder das pontas</b> ${F.ret("C05")}.</p>` }),
      X({ n: 7, marcas: ["?"], enun: R`<p>Um pente eletrizado atrai pedacinhos de papel <b>neutros</b>. Por quê?</p>`, fig: D.svg(300, 110, `<rect x="40" y="16" width="220" height="14" rx="3" class="ln" style="fill:var(--card2)"/>${[0, 1, 2, 3, 4, 5].map((i) => `<text x="${60 + 36 * i}" y="27" style="font:700 12px Inter;fill:#4f8dff">−</text>`).join("")}<rect x="120" y="70" width="60" height="22" class="ln2" style="fill:var(--card)"/><text x="130" y="77" style="font:700 12px Inter;fill:#ef5b5b">+ + +</text><text x="130" y="90" style="font:700 12px Inter;fill:#4f8dff">− − −</text>`, "papel polarizado"),
        alts: ["O pente transfere carga ao papel antes de tocá-lo.", "O papel é condutor e fica carregado por indução com carga total positiva.", "As moléculas do papel se polarizam; o lado de carga oposta fica mais perto e é atraído com mais força do que o outro lado é repelido.", "A gravidade do pente atrai o papel.", "Corpos neutros sempre são atraídos por qualquer corpo."],
        dicas: [R`<p>O papel continua neutro. Pense em <b>distâncias</b>.</p>`, R`<p>A força elétrica cai com a distância.</p>`], resp: "C", sol: R`<p>Polarização: as cargas não saem do papel, só se deslocam um tiquinho dentro das moléculas. A carga oposta fica mais perto e a força cai com a distância, então a atração vence a repulsão. Força resultante não nula com carga total zero: só porque o campo do pente <b>não é uniforme</b>.</p>` }),
    ];
    const exsM = [
      X({ n: 8, enun: R`<p>Uma esfera com carga $Q$ toca, uma de cada vez, várias esferas idênticas a ela e neutras. Quantos toques são necessários para que sua carga fique menor que $1\%$ de $Q$?</p>`, fig: D.svg(420, 90, esf(50, 45, 26, "Q") + [1, 2, 3, 4].map((i) => esf(50 + 85 * i, 45, 26, "0", "var(--ink3)")).join(""), "esferas"),
        dicas: [R`<p>Cada toque divide a carga por 2.</p>`, R`<p>$Q/2^n < Q/100$.</p>`], resp: "7 toques.", sol: R`<p>$2^n > 100 \Rightarrow n > \log_2 100 \approx 6{,}64$, então $n = 7$ ($Q/128 \approx 0{,}78\%$).</p>` }),
      X({ n: 9, marcas: ["RU"], enun: R`<p><b>Estilo Millikan.</b> As cargas medidas em cinco gotas de óleo foram (em $10^{-19}$ C): $4{,}81;\ 8{,}02;\ 11{,}22;\ 14{,}43;\ 19{,}25$. Estime a carga elementar.</p>`, fig: D.svg(380, 120, `<rect x="40" y="16" width="300" height="10" style="fill:var(--ink3)"/><rect x="40" y="96" width="300" height="10" style="fill:var(--ink3)"/>${[90, 170, 250].map((x, i) => `<circle cx="${x}" cy="${50 + 12 * i}" r="5" style="fill:#c9a86a"/>`).join("")}${D.txt(350, 25, "+", "tx", "start")}${D.txt(350, 105, "−", "tx", "start")}`, "gotas entre placas"),
        dicas: [R`<p>Procure o "máximo divisor comum" aproximado: divida pela menor diferença entre valores.</p>`, R`<p>As diferenças ficam perto de $3{,}2\times10^{-19}$, que deve ser $2e$. Teste os múltiplos $3, 5, 7, 9, 12$.</p>`], resp: R`$e \approx 1{,}60\times10^{-19}$ C.`, sol: R`<p>Dividindo por $1{,}60$: $3{,}0;\ 5{,}0;\ 7{,}0;\ 9{,}0;\ 12{,}0$, todos inteiros. Melhor estimativa: $\sum q / \sum n = 57{,}73/36 \approx 1{,}604\times10^{-19}$ C.</p>` }),
      X({ n: 10, marcas: ["!"], enun: R`<p>Duas esferas idênticas: A com $Q_0$, B neutra. Repete-se o ciclo: (1) encosta A em B, (2) separa, (3) aterra B e desliga. Depois de quantos ciclos a energia eletrostática de A cai abaixo de $1\%$ da inicial? (Para uma esfera isolada, energia $\propto q^2$.)</p>`, fig: figContato,
        dicas: [R`<p>A carga de A cai à metade por ciclo.</p>`, R`<p>Energia cai por 4 a cada ciclo.</p>`], resp: "4 ciclos.", sol: R`<p>$U_n/U_0 = (1/2^n)^2 = 4^{-n} < 0{,}01 \Rightarrow n > \log_4 100 \approx 3{,}32$, então $n = 4$.</p>` }),
    ];

    const chefao = F.chefao({ titulo: "O eletróforo infinito", fig: D.svg(520, 170, `<rect x="40" y="110" width="160" height="22" rx="4" style="fill:#5a5f6a;stroke:var(--ink)"/>${D.txt(120, 150, "disco isolante (−)", "tx2")}<rect x="50" y="88" width="140" height="10" rx="3" style="fill:#b9c2cc;stroke:var(--ink)"/><line x1="120" y1="88" x2="120" y2="40" class="ln"/>${D.txt(120, 32, "placa com cabo", "tx2")}${esf(400, 80, 60, "coletor R")}`, "eletróforo"),
      enun: R`<p>Um eletróforo é um disco isolante carregado e uma placa metálica com cabo isolante. A cada ciclo: (1) coloca-se a placa sobre o disco; (2) aterra-se a placa por um instante; (3) levanta-se a placa, que sai com carga $+q$, <b>sempre igual</b>; (4) encosta-se a placa num grande coletor esférico, e a carga se divide como entre duas esferas ligadas: o coletor (raio $R = 10$ cm) fica com a fração $\dfrac{R}{R + r}$ do total, onde $r = 2{,}0$ cm é o "raio efetivo" da placa; (5) recomeça. Cada ciclo dá $q = 50$ nC.</p>
        <ol type="a"><li>Seja $Q_n$ a carga do coletor depois de $n$ ciclos. Escreva a recorrência e resolva.</li><li>Qual a carga máxima que o coletor pode atingir?</li><li>Quantos ciclos para chegar a 90% dela?</li><li>O disco nunca perde carga. De onde vem a energia que vai se acumulando no coletor?</li></ol>`,
      dicas: [R`<p>(a) Antes de encostar: coletor $Q_n$, placa $q$. Depois: coletor fica com $\frac{R}{R+r}(Q_n + q)$.</p>`, R`<p>(a) Recorrência linear: procure o ponto fixo $Q_\infty$ e escreva $Q_n - Q_\infty$. (c) $(R/(R+r))^n = 0{,}1$.</p>`],
      sol: R`<p><b>(a)</b> $Q_{n+1} = \lambda(Q_n + q)$, $\lambda = \frac{R}{R+r} = \frac56$. Ponto fixo: $Q_\infty = \lambda(Q_\infty + q) \Rightarrow Q_\infty = \frac{\lambda q}{1-\lambda} = \frac{qR}{r}$. Então $Q_n - Q_\infty = \lambda^n(Q_0 - Q_\infty)$ e, com $Q_0 = 0$: $Q_n = \frac{qR}{r}\left(1 - \lambda^n\right)$.</p>
        <p><b>(b)</b> $Q_\infty = 50\times10/2 = 250$ nC. Faz sentido: o processo para quando a placa, encostando, não consegue mais dar carga ao coletor, isto é, quando ambos têm o mesmo "$q/\text{raio}$" (mesmo potencial ${F.ret("C05")}): $Q/R = q/r$.</p>
        <p><b>(c)</b> $(5/6)^n = 0{,}1 \Rightarrow n = \ln 0{,}1/\ln(5/6) \approx 12{,}6$: <b>13 ciclos</b>.</p>
        <p><b>(d)</b> Do <b>seu braço</b>. Ao levantar a placa positiva de cima do disco negativo, você puxa contra a atração elétrica: esse trabalho vira energia elétrica. O disco só "induz", nunca entrega carga.</p>` });

    return [
      F.secao("abertura", "Pergunta de abertura", R`<div class="abertura"><div class="det">Antes de tudo</div><div class="q">Você esfrega um balão no cabelo e ele gruda na parede. A parede não está carregada. Por que ele gruda?</div><p class="det">E por que um choque no trinco da porta acontece mais no inverno seco?</p></div>`),
      F.secao("laboratorio", "Laboratório: eletroscópio", R`<p>Aproxime o bastão negativo, ligue e desligue a terra, encoste. Repare que a <b>ordem</b> dos passos muda tudo.</p>
        ${F.chute({ q: "o bastão negativo está perto e a terra está ligada. Você desliga a terra e só depois afasta o bastão. As folhas ficam:", ops: ["fechadas, eletroscópio neutro", "abertas, eletroscópio negativo", "abertas, eletroscópio positivo", "fechadas, eletroscópio positivo"], certa: 2,
          exp: R`<p><b>Abertas, com carga positiva.</b> A terra levou os elétrons repelidos; sem ela, eles não voltam. Quando o bastão vai embora, o excesso positivo se espalha pela esfera e pelas folhas, que se repelem. Teste no laboratório.</p>` })}
        <div id="lab-el"></div>`),
      F.secao("ideia", "A ideia física", R`<p>Toda matéria é feita de prótons (+), nêutrons (0) e elétrons (−). Num corpo neutro, os dois tipos de carga se cancelam com uma precisão absurda: uma moeda tem $\sim10^5$ C de prótons, mas se sobrar <b>um bilionésimo de bilionésimo</b> disso você já sente o choque.</p>
        <ul><li>Carga de um balão atritado: dezenas de nC, uns $10^{11}$ elétrons a mais.</li><li>Um raio transporta ~10 C.</li><li>Pilha AA descarregando: ~10⁴ C passam por ela ao longo da vida inteira.</li></ul>
        <p>"Eletrizar" é quase sempre <b>mover elétrons</b>: os prótons estão presos no núcleo. Corpo positivo é corpo que <i>perdeu</i> elétrons.</p>
        <p>Respondendo à abertura: o balão negativo <b>polariza</b> a parede (isolante): as moléculas se deslocam um pouco, o lado positivo fica mais perto. A atração vence a repulsão porque a força cai com a distância. No inverno seco não há a película de água que descarrega tudo devagar, então a carga acumula e escapa de uma vez: o choque.</p>`),
      F.secao("teoria", "Teoria completa", R`
        <h3>1. Carga elétrica: o que se sabe</h3>
        <p>Carga é uma propriedade das partículas, como a massa. Há dois tipos, chamados (por convenção de Benjamin Franklin) de positivo e negativo. Cargas de mesmo sinal se repelem; de sinais opostos se atraem. Unidade SI: <b>coulomb</b> (C), definido a partir do ampère: $1\ \text{C} = 1\ \text{A}\cdot\text{s}$ ${F.ret("C06")}.</p>
        <h3>2. Quantização</h3>
        ${F.formula(R`q = n\,e,\qquad n \in \mathbb{Z},\qquad e = 1{,}602\,176\,634\times10^{-19}\ \text{C (exato, SI 2019)}`, "Carga elementar")}
        <p>Elétron: $-e$; próton: $+e$ (iguais até onde se mediu, ~1 parte em $10^{21}$). Quarks têm $\pm e/3$ e $\pm 2e/3$, mas nunca aparecem sozinhos. Como $e$ é minúsculo, no mundo macroscópico a carga parece contínua; por isso falamos em densidades $\lambda$, $\sigma$, $\rho$ ${F.ret("C03")}.</p>
        ${F.caixa("fisico", R`<p>Millikan (1909) mediu $e$ equilibrando gotinhas de óleo carregadas entre placas: peso para baixo, força elétrica para cima. As cargas medidas sempre eram múltiplos inteiros de um mesmo valor. É o exercício 9.</p>`)}
        <h3>3. Conservação</h3>
        <p>A carga total de um sistema isolado nunca muda. Em todo processo conhecido, inclusive nos de altíssima energia, ela se conserva: no decaimento β, $n \to p + e^- + \bar\nu_e$ (0 = +1 − 1 + 0); na criação de pares, $\gamma \to e^- + e^+$. Carga pode ser <i>transferida</i>, nunca criada sozinha.</p>
        ${F.caixa("ponte", R`<p>Na teoria de Maxwell, a conservação aparece como a <b>equação da continuidade</b> $\partial\rho/\partial t + \nabla\cdot\vec J = 0$ ${F.ret("C15d")}. Por trás dela há uma simetria (a invariância de calibre), e o teorema de Noether liga cada simetria a uma lei de conservação ${F.ret("U04")}.</p>`)}
        <h3>4. Condutores e isolantes</h3>
        <p>Nos <b>metais</b>, os elétrons de valência ficam soltos pelo cristal (~1 por átomo, $n \sim 10^{29}$ m⁻³) ${F.ret("C07")}: carga colocada num ponto se espalha. Nos <b>isolantes</b> (vidro, plástico, borracha), cada elétron fica preso ao seu átomo: a carga fica onde foi posta. <b>Semicondutores</b> ficam no meio e o número de portadores depende muito da temperatura. O corpo humano e a Terra são condutores razoáveis (por causa da água com sais).</p>
        <h3>5. Eletrização por atrito</h3>
        <p>Ao esfregar dois materiais diferentes, elétrons passam de um para o outro: quem "segura" melhor os elétrons fica negativo. A <b>série triboelétrica</b> ordena os materiais (ela é empírica e muda com umidade e limpeza):</p>
        ${F.fig(figSerie)}
        <p>Os dois corpos ficam com cargas <b>iguais e opostas</b> (conservação). Atrito só funciona bem com isolantes: num metal segurado com a mão, a carga escoa pelo seu corpo.</p>
        <h3>6. Eletrização por contato</h3>
        <p>Dois condutores encostados viram um condutor só, e a carga total se redistribui até o equilíbrio. Para <b>esferas idênticas</b>, por simetria, cada uma fica com metade da soma. Para esferas diferentes e afastadas (ligadas por fio), elas ficam no mesmo potencial ${F.ret("C05")}:</p>
        ${F.formula(R`\frac{q_1}{R_1} = \frac{q_2}{R_2}\quad\Rightarrow\quad q_1 = Q\,\frac{R_1}{R_1+R_2}`, "Esferas distantes ligadas")}
        <p>No contato, o corpo fica com carga de <b>mesmo sinal</b> do que o eletrizou.</p>
        <h3>7. Eletrização por indução</h3>
        ${F.fig(figInducao, "Bastão negativo perto de uma esfera: os elétrons livres fogem para longe.")}
        <p>Um corpo carregado (indutor) aproximado de um condutor neutro empurra/puxa os elétrons livres: o condutor fica <b>polarizado</b>, mas continua neutro. Para ele ficar carregado:</p>
        <ol><li>aproxime o indutor;</li><li>ligue o condutor à terra (os elétrons repelidos escoam, ou chegam elétrons da terra, se o indutor for positivo);</li><li><b>desligue a terra</b>;</li><li>só então afaste o indutor.</li></ol>
        <p>Resultado: carga de sinal <b>oposto</b> ao do indutor, e o indutor não perde nada.</p>
        ${F.caixa("pegadinha", R`<p>Afastar o indutor <b>antes</b> de desligar a terra desfaz tudo: as cargas voltam e o corpo fica neutro. A ordem dos passos 3 e 4 é a pegadinha clássica.</p>`)}
        <h3>8. Polarização de isolantes</h3>
        <p>Num isolante as cargas não andam pelo corpo, mas cada molécula se deforma (ou gira, se já for polar como a água): surge um pequeno dipolo ${F.ret("C03")}. Num campo <b>não uniforme</b>, o lado mais perto do indutor sente força maior, e o corpo neutro é <b>atraído</b> (seja o indutor + ou −). Por isso a atração não serve para saber o sinal de um corpo; a <b>repulsão</b> sim.</p>
        ${F.caixa("olimpiada", R`<p>"Um corpo A atrai B. Então B está carregado com sinal oposto." <b>Falso</b>: B pode estar neutro. "A repele B" garante que os dois estão carregados com o mesmo sinal.</p>`)}
        <h3>9. Eletroscópio</h3>
        <p>Duas folhas leves de metal presas a uma haste com uma esfera em cima. Carga nas folhas: elas se repelem e abrem. Serve para detectar carga e, com um indutor de sinal conhecido, descobrir o sinal: se aproximar um corpo negativo de um eletroscópio negativo, as folhas abrem <i>mais</i>.</p>`),
      F.secao("exemplos", "Exemplos passo a passo", exemplario),
      F.secao("resumo", "Resumo", R`<div class="resumo">
        <div class="r"><b>Quantização</b>$q = ne$, $e = 1{,}602\times10^{-19}$ C</div><div class="r"><b>Conservação</b>carga total de sistema isolado é constante</div>
        <div class="r"><b>Atrito</b>cargas iguais e opostas; série triboelétrica</div><div class="r"><b>Contato</b>mesmo sinal; idênticas dividem igual; distantes: $q \propto R$</div>
        <div class="r"><b>Indução</b>sinal oposto; desligar a terra antes de afastar</div><div class="r"><b>Polarização</b>neutro é atraído por campo não uniforme</div></div>`),
      F.secao("exercicios", "Exercícios", `<div class="exs-nivel"><h3>Nível Físico</h3><span class="selo">fixação</span></div>${exsF.join("")}<div class="exs-nivel"><h3>Nível Máximo</h3><span class="selo">OBF · ITA · RU</span></div>${exsM.join("")}`),
      F.secao("chefao", "Chefão", chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-el"); e.outerHTML = F.lab("Eletroscópio e indução", "lab-el"); SIM.eletroscopio(document.getElementById("lab-el"), F); },
});
