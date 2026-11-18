/* A14 · Equilíbrio de Corpo Extenso. Conferido em Python (g = 10 m/s²):
   gangorra 30 kg a 2 m × 40 kg a 1,5 m (60 = 60); barra 4 m, 10 kg, apoiada nas pontas, pessoa de 60 kg a 1 m da esquerda: 500 N e 200 N;
   carrinho de mão: 600 N a 0,4 m da roda, mãos a 1,2 m: 200 N; bíceps a 4 cm, 5 kg na mão a 35 cm: 437,5 N;
   placa de 20 kg na ponta de viga leve com cabo a 30°: T = 400 N (viga de 10 kg: 500 N); escada, parede lisa, μ = 0,5: θ mín = 45°;
   caixa 0,6 × 1,2 m empurrada no topo com μ = 0,4: tomba com F = 0,25 mg (b/2h = 0,25 < μ); móbile 20 g e 10 g em haste de 30 cm: fio a 10 cm do de 20 g;
   ponte de 20 m, caminhão de 10 t a 5 m da esquerda: 75 kN na esquerda;
   chefão: escada 5 m, 20 kg, a 60°, parede lisa, μ = 0,4, pessoa de 80 kg: sobe até 3,705 m; para chegar ao topo, μ ≥ 0,520, ou θ ≥ 66,0° com μ = 0,4. */
F.registrar("A14", {
  retoma: ["A08", "A14a", "A12b", "A09"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const bloco = (x, y, w, h, cor, rot) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" style="fill:color-mix(in srgb,${cor} 30%,transparent);stroke:${cor};stroke-width:2"/>` + (rot ? D.txt(x + w / 2, y + h / 2 + 5, rot, "tx2") : "");
    const escada = (th, extra = "") => { const t = (th * Math.PI) / 180, L = 150; return fig(`<line x1="420" x2="420" y1="5" y2="160" style="stroke:var(--ink2);stroke-width:3"/><line x1="120" x2="440" y1="160" y2="160" style="stroke:var(--ink2);stroke-width:3"/><line x1="${420 - L * Math.cos(t)}" y1="160" x2="420" y2="${160 - L * Math.sin(t)}" style="stroke:var(--mC);stroke-width:6"/>` + D.txt(420 - L * Math.cos(t) + 40, 152, `${th}°`, "tx2") + extra, 170); };
    const exemplos = F.exemplo({
      titulo: "Equilíbrio",
      casos: [
        { nome: "Fácil: a tábua sobre dois apoios", gerar: (p) => {
          const L = p ? 4 : F.escolha([3, 4, 6]), M = p ? 10 : F.escolha([10, 20]), m = p ? 60 : F.escolha([50, 60, 80]), x = p ? 1 : F.escolha([0.5, 1, 1.5]), Rd = (M * 10 * (L / 2) + m * 10 * x) / L, Re = (M + m) * 10 - Rd;
          return { enun: R`<p>Uma tábua homogênea de ${L} m e ${M} kg está apoiada nas duas pontas. Uma pessoa de ${m} kg fica em pé a ${F.nt(x)} m da ponta esquerda. Quanto cada apoio sustenta?</p>`,
            fig: fig(`<path d="M80 150 L100 120 L120 150 Z" style="fill:var(--line2);stroke:var(--ink3)"/><path d="M440 150 L460 120 L480 150 Z" style="fill:var(--line2);stroke:var(--ink3)"/>` + bloco(100, 110, 360, 10, "var(--mC)") + `<circle cx="${100 + (360 * x) / L}" cy="62" r="8" style="fill:none;stroke:var(--ink);stroke-width:2"/><line x1="${100 + (360 * x) / L}" x2="${100 + (360 * x) / L}" y1="70" y2="110" style="stroke:var(--ink);stroke-width:2"/>`, 160),
            passos: [R`<p>(i) Torques em torno do apoio <b>esquerdo</b> (a força dele some da conta): $R_d\cdot${L} = ${M * 10}\cdot${F.n(L / 2)} + ${m * 10}\cdot${F.n(x)}$.</p>`, R`<p>(ii) $R_d = ${F.n(Rd, 3)}$ N. Forças verticais: $R_e + R_d = ${(M + m) * 10}$, então $R_e = ${F.n(Re, 3)}$ N.</p>`, R`<p>(iii) Confira com torques em torno do apoio direito: $R_e\cdot${L} = ${M * 10}\cdot${F.n(L / 2)} + ${m * 10}\cdot${F.n(L - x)}$ dá o mesmo. O apoio mais perto da pessoa carrega mais.</p>`] };
        } },
        { nome: "Médio: a placa da loja", gerar: (p) => {
          const m = p ? 20 : F.escolha([10, 20, 30]), mv = p ? 10 : F.escolha([0, 10, 20]), th = p ? 30 : F.escolha([30, 37, 45]), t = (th * Math.PI) / 180, T = (m * 10 + mv * 5) / Math.sin(t), Hx = T * Math.cos(t), Hy = (m + mv) * 10 - T * Math.sin(t);
          return { enun: R`<p>Uma placa de ${m} kg está pendurada na ponta de uma viga horizontal${mv ? ` homogênea de ${mv} kg` : " de massa desprezível"}, articulada na parede. Um cabo vai da ponta da viga até a parede, fazendo ${th}° com a viga. Qual a tração no cabo e a força da articulação?</p>`,
            fig: fig(`<rect x="90" y="10" width="14" height="150" style="fill:var(--line2)"/><line x1="104" x2="420" y1="110" y2="110" style="stroke:var(--mC);stroke-width:6"/><line x1="420" y1="110" x2="104" y2="${110 - 316 * Math.tan(t)}" style="stroke:var(--ink2);stroke-width:2"/>` + bloco(395, 122, 50, 34, "var(--mA)", `${m} kg`) + `<line x1="420" x2="420" y1="110" y2="122" style="stroke:var(--ink)"/>` + D.txt(360, 100, `${th}°`, "tx2"), 170),
            passos: [R`<p>(i) Torques em torno da articulação (a força dela, desconhecida, some): $T\sin${th}°\cdot L = ${m * 10}\cdot L${mv ? R` + ${mv * 10}\cdot\frac L2` : ""}$.</p>`, R`<p>(ii) $T = \frac{${m * 10 + mv * 5}}{${F.n(Math.sin(t), 3)}} \approx ${F.n(T, 3)}$ N. O comprimento da viga cancelou!</p>`, R`<p>(iii) Articulação: horizontal $H_x = T\cos${th}° \approx ${F.n(Hx, 3)}$ N (empurra a viga para fora da parede); vertical $H_y = ${(m + mv) * 10} - T\sin${th}° \approx ${F.n(Hy, 3)}$ N. ${mv ? "Com viga pesada, a articulação também segura parte do peso." : "Com viga leve, o cabo segura todo o peso e a articulação só empurra."}</p>`] };
        } },
        { nome: "Olimpíada: tomba ou escorrega?", gerar: (p) => {
          const b = p ? 0.6 : F.escolha([0.4, 0.6, 1]), h = p ? 1.2 : F.escolha([0.8, 1.2, 1.5]), mu = p ? 0.4 : F.escolha([0.2, 0.4, 0.6]), r = b / (2 * h);
          return { enun: R`<p>Uma geladeira (caixa homogênea de base ${F.nt(b)} m e altura ${F.nt(h)} m) é empurrada horizontalmente pela borda de cima, aumentando a força aos poucos. O atrito estático com o piso é $\mu = ${F.n(mu)}$. Ela começa a escorregar ou a tombar?</p>`,
            fig: fig(bloco(220, 20, (120 * b) / h, 120, "var(--mA)") + `<line x1="120" x2="460" y1="140" y2="140" style="stroke:var(--ink2);stroke-width:2"/>` + D.seta(160, 24, 216, 24, "var(--warn)") + D.txt(150, 28, "F", "txm", "end"), 160),
            passos: [R`<p>(i) <b>Escorregar</b>: a força vence o atrito máximo quando $F = \mu mg = ${F.n(mu)}\,mg$.</p>`, R`<p>(ii) <b>Tombar</b>: na iminência, a normal e o atrito se concentram na aresta da frente. Torques em torno dela: $F\cdot h = mg\cdot\frac b2 \Rightarrow F = \frac{b}{2h}mg = ${F.n(r, 3)}\,mg$.</p>`, R`<p>(iii) Acontece o que precisar de menos força: ${r < mu ? R`$${F.n(r, 3)} < ${F.n(mu)}$, ela <b>tomba</b> antes de escorregar. Para arrastar, empurre mais embaixo.` : R`$${F.n(mu)} < ${F.n(r, 3)}$, ela <b>escorrega</b> antes de tombar.`}</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Até onde dá para subir na escada",
      enun: R`<p>Uma escada homogênea de 5 m e 20 kg está apoiada numa parede lisa (sem atrito), fazendo 60° com o chão. O atrito estático com o chão tem $\mu = 0{,}4$. Uma pessoa de 80 kg começa a subir. (a) Desenhe as forças na escada e escreva as três equações de equilíbrio. (b) Até que distância $x$ (medida ao longo da escada, a partir do pé) a pessoa consegue subir antes de a escada escorregar? (c) Por que a escada escorrega mais facilmente quanto mais alto a pessoa está? (d) Que $\mu$ mínimo permitiria chegar ao topo? (e) Mantendo $\mu = 0{,}4$, com que ângulo mínimo a escada deveria ser apoiada para a pessoa chegar ao topo?</p>`,
      fig: escada(60, `<circle cx="378" cy="70" r="7" style="fill:none;stroke:var(--ink);stroke-width:2"/><line x1="378" x2="378" y1="77" y2="100" style="stroke:var(--ink);stroke-width:2"/>`),
      dicas: [R`<p>(a) No pé: normal $N_1$ (para cima) e atrito $f$ (para a parede). No topo: normal da parede $N_2$ (horizontal). Pesos no meio da escada e na pessoa.</p>`, R`<p>(a) Torques em torno do pé da escada: $N_1$ e $f$ somem.</p>`, R`<p>(b) Na iminência de escorregar, $f = \mu N_1$, e $N_1$ é sempre o peso total.</p>`],
      sol: R`<p><b>(a)</b> Vertical: $N_1 = (20 + 80)\cdot10 = 1000$ N. Horizontal: $f = N_2$. Torques em torno do pé: $N_2\cdot L\sin60° = 200\cdot\frac L2\cos60° + 800\cdot x\cos60°$.</p>
        <p><b>(b)</b> Na iminência: $f = \mu N_1 = 400$ N $= N_2$. Então $400\cdot5\cdot0{,}866 = 1732 = 250 + 400x \Rightarrow x \approx 3{,}70$ m, pouco mais de 70% da escada.</p>
        <p><b>(c)</b> O torque do peso da pessoa em torno do pé cresce com $x$; quem equilibra é $N_2$, que cresce junto; e o atrito precisa crescer igual a $N_2$, mas o máximo dele ($\mu N_1$) não muda, porque $N_1$ é sempre o peso total.</p>
        <p><b>(d)</b> Com $x = 5$: $N_2 = \frac{250 + 2000}{4{,}33} \approx 519{,}6$ N; precisa $\mu \ge \frac{519{,}6}{1000} \approx 0{,}52$.</p>
        <p><b>(e)</b> Para um ângulo $\theta$ geral: $N_2\cdot5\sin\theta = (500 + 4000)\cos\theta \Rightarrow N_2 = 900\cot\theta \le 400 \Rightarrow \tan\theta \ge 2{,}25$, $\theta \ge 66{,}0°$. É por isso que os manuais de segurança mandam o pé da escada a 1/4 do comprimento da parede ($\theta \approx 75{,}5°$). Conferi tudo em Python.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Numa gangorra de apoio central, uma criança de 30 kg senta a 2 m do apoio. A que distância do apoio deve sentar uma de 40 kg para equilibrar?</p>`, num: { v: 1.5, un: "m" }, dicas: [R`<p>$m_1d_1 = m_2d_2$.</p>`], resp: "1,5 m", sol: R`<p>$30\cdot2 = 40\,d \Rightarrow d = 1{,}5$ m.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Um carrinho de mão leva 600 N de carga, com o centro de massa a 0,4 m do eixo da roda. As mãos seguram a 1,2 m do eixo. Que força vertical as mãos fazem?</p>`, fig: fig(`<circle cx="120" cy="130" r="22" style="fill:none;stroke:var(--ink2);stroke-width:3"/><line x1="120" x2="460" y1="130" y2="90" style="stroke:var(--mC);stroke-width:5"/>` + bloco(150, 90, 90, 36, "var(--mA)", "600 N") + D.seta(460, 90, 460, 40, "var(--warn)") + D.txt(468, 60, "F?", "tx2", "start"), 165), num: { v: 200, un: "N" }, dicas: [R`<p>Torques em torno do eixo da roda.</p>`], resp: "200 N", sol: R`<p>$F\cdot1{,}2 = 600\cdot0{,}4 \Rightarrow F = 200$ N: alavanca inter-resistente (a carga entre o apoio e a força).</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Uma tábua de 4 m e 10 kg está apoiada nas pontas. Uma pessoa de 60 kg fica a 1 m da ponta esquerda. Quanto o apoio <b>direito</b> sustenta (em N)?</p>`, num: { v: 200, un: "N" }, dicas: [R`<p>Torques em torno do apoio esquerdo.</p>`], resp: "200 N", sol: R`<p>$R_d\cdot4 = 100\cdot2 + 600\cdot1 = 800 \Rightarrow R_d = 200$ N; $R_e = 500$ N.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>O bíceps se prende ao antebraço a 4 cm do cotovelo. A mão segura um peso de 5 kg a 35 cm do cotovelo, com o antebraço na horizontal (despreze o peso do antebraço). Que força o bíceps faz?</p>`, num: { v: 437.5, un: "N" }, dicas: [R`<p>Torques em torno do cotovelo.</p>`], resp: "437,5 N", sol: R`<p>$F\cdot4 = 50\cdot35 \Rightarrow F = 437{,}5$ N, quase 9 vezes o peso. O corpo troca força por alcance e velocidade (a mão anda 9 vezes mais rápido que o tendão).</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Um móbile tem uma haste leve de 30 cm com 20 g numa ponta e 10 g na outra. A que distância da ponta de 20 g deve ficar o fio para a haste ficar horizontal?</p>`, num: { v: 10, un: "cm" }, dicas: [R`<p>O fio fica no centro de massa ${F.ret("A12b")}.</p>`], resp: "10 cm", sol: R`<p>$20x = 10(30 - x) \Rightarrow x = 10$ cm.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Um corpo rígido está em equilíbrio estático. Isso exige:</p>`, alts: ["só que a resultante das forças seja nula.", "só que o torque resultante em torno do centro de massa seja nulo.", "resultante nula e torque resultante nulo em torno de qualquer ponto.", "que todas as forças passem pelo centro de massa.", "que o corpo esteja apoiado no centro de massa."], certa: "C", dicas: [R`<p>Um volante girado por duas forças opostas (um binário) tem resultante nula. Ele fica parado?</p>`], resp: "C", sol: R`<p>Precisa das duas condições. E, com a resultante nula, se o torque é zero em torno de um ponto, é zero em torno de todos (Teorema 1): escolha o ponto que mais simplifica.</p>` }),
      F.exercicio({ n: 7, nivel: "Máximo", enun: R`<p>Uma placa de 20 kg pende da ponta de uma viga horizontal leve, articulada na parede; um cabo liga a ponta da viga à parede, a 30° da viga. Qual a tração no cabo?</p>`, num: { v: 400, un: "N" }, dicas: [R`<p>Torques em torno da articulação: $T\sin30°\cdot L = mgL$.</p>`], resp: "400 N", sol: R`<p>$T = \frac{200}{0{,}5} = 400$ N, o dobro do peso. Cabos quase horizontais exigem trações enormes.</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>No exercício anterior, a viga passa a ter 10 kg (homogênea). Qual a nova tração?</p>`, num: { v: 500, un: "N" }, dicas: [R`<p>O peso da viga age no meio dela.</p>`], resp: "500 N", sol: R`<p>$0{,}5\,T\,L = 200L + 100\frac L2 \Rightarrow T = 500$ N.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Uma escada homogênea está apoiada numa parede lisa; o atrito com o chão tem $\mu = 0{,}5$. Qual o menor ângulo com o chão em que ela fica parada sozinha (em graus)?</p>`, fig: escada(45), num: { v: 45, un: "°" }, dicas: [R`<p>$N_1 = mg$, $f = N_2$, e torques em torno do pé: $N_2L\sin\theta = mg\frac L2\cos\theta$.</p>`], resp: "45°", sol: R`<p>$f = \frac{mg}{2\tan\theta} \le \mu mg \Rightarrow \tan\theta \ge \frac1{2\mu} = 1$, $\theta \ge 45°$. Não depende do comprimento nem da massa.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Uma ponte de 20 m, apoiada nas pontas, tem um caminhão de 10 toneladas a 5 m da ponta esquerda. Despreze o peso da ponte. Quanto o apoio esquerdo sustenta (em kN)?</p>`, num: { v: 75, un: "kN" }, dicas: [R`<p>Torques em torno do apoio <b>direito</b>.</p>`], resp: "75 kN", sol: R`<p>$R_e\cdot20 = 10^5\cdot15 \Rightarrow R_e = 75$ kN; o direito, 25 kN. Quem pensa "o caminhão está a 5 m da esquerda, então a esquerda carrega 5/20" inverteu: é o apoio <b>mais perto</b> que carrega mais.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Uma caixa homogênea de base 0,6 m e altura 1,2 m é empurrada horizontalmente pela borda de cima. O atrito estático com o chão é 0,4. O que acontece primeiro?</p>`, alts: ["Escorrega, com F = 0,4 mg.", "Tomba, com F = 0,25 mg.", "Tomba, com F = 0,5 mg.", "Escorrega e tomba ao mesmo tempo.", "Não se move, qualquer que seja F."], certa: "B", dicas: [R`<p>Compare $\mu mg$ com a força que tomba, tirada dos torques em torno da aresta da frente.</p>`], resp: "B", sol: R`<p>Tombar: $Fh = mg\frac b2 \Rightarrow F = \frac{0{,}6}{2{,}4}mg = 0{,}25\,mg < 0{,}4\,mg$. Tomba primeiro.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Uma barra leve está em equilíbrio sob a ação de apenas três forças, não paralelas. O que se pode afirmar sobre as linhas de ação dessas forças?</p>`, alts: ["São perpendiculares duas a duas.", "Passam todas pelo centro da barra.", "Passam por um mesmo ponto.", "Duas delas são iguais.", "Nada se pode afirmar."], certa: "C", dicas: [R`<p>Tome torques em torno do ponto onde duas das linhas se cruzam.</p>`], resp: "C", sol: R`<p>Em torno do cruzamento de duas linhas, essas duas dão torque zero; a terceira também tem que dar, então passa por ali (Teorema 2). É um atalho geométrico ótimo para escadas e vigas.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · estática</div>
        <div class="q">Por que é tão mais fácil abrir uma porta empurrando perto da maçaneta do que perto da dobradiça, com a mesma força?</div>
        <p>Porque o que gira a porta não é a força sozinha: é a força vezes a distância ao eixo, o torque. Para um corpo grande ficar parado, não basta as forças se cancelarem; os torques também precisam.</p></div>`),

      F.secao("condicoes", "As duas condições de equilíbrio", R`
        ${F.formula(R`\sum\vec F = 0\qquad\text{e}\qquad \sum\tau = 0\ \ (\text{em torno de qualquer ponto})`, "Equilíbrio estático de um corpo rígido")}
        <p>A primeira impede o CM de acelerar ${F.ret("A12b")}; a segunda impede o corpo de começar a girar ($\tau = I\alpha$ ${F.ret("A14a")}). Duas forças iguais e opostas fora da mesma linha (um <b>binário</b>) têm resultante zero e mesmo assim giram o corpo.</p>
        <h3>Teorema 1: com resultante nula, o torque é o mesmo em torno de qualquer ponto</h3>
        ${F.demo("demonstração", R`<p>(i) Torque em torno do ponto $O$: $\tau_O = \sum\vec r_i\times\vec F_i$. Em torno de $O'$, com $\vec r_i = \vec r_i' + \vec a$ ($\vec a$ vai de $O$ a $O'$): $\tau_O = \sum\vec r_i'\times\vec F_i + \vec a\times\sum\vec F_i$.</p>
          <p>(ii) Se $\sum\vec F_i = 0$, o último termo some: $\tau_O = \tau_{O'}$. $\blacksquare$</p>
          <p>(iii) Consequência prática: escolha o ponto onde estão as forças <b>desconhecidas</b> (apoio, articulação); elas somem da equação dos torques.</p>`)}
        <div id="lab-gangorra"></div>
        ${F.caixa("pegadinha", R`<p><b>O braço é a distância do eixo à linha da força</b>, não ao ponto onde a força é aplicada. Força inclinada: use $rF\sin\theta$. E o peso de uma barra homogênea age no meio dela, não na ponta.</p>`)}`),

      F.secao("tres", "Três forças e alavancas", R`
        <h3>Teorema 2: três forças não paralelas em equilíbrio são concorrentes</h3>
        ${F.demo("demonstração", R`<p>(i) Sejam $\vec F_1$, $\vec F_2$, $\vec F_3$ em equilíbrio; como não são paralelas, as linhas de $\vec F_1$ e $\vec F_2$ se cruzam num ponto $P$.</p>
          <p>(ii) Torques em torno de $P$: os de $\vec F_1$ e $\vec F_2$ são zero (passam por $P$). Como o total é zero, o de $\vec F_3$ também: a linha de $\vec F_3$ passa por $P$. $\blacksquare$</p>
          <p>(iii) E as três, ligadas ponta a ponta, formam um triângulo fechado (resultante nula) ${F.ret("F02")}.</p>`)}
        ${F.formula(R`F_\text{potente}\cdot b_\text{potente} = F_\text{resistente}\cdot b_\text{resistente}`, "Alavanca em equilíbrio")}
        <p>Interfixa (apoio no meio: gangorra, tesoura), inter-resistente (carga no meio: carrinho de mão, quebra-nozes), interpotente (força no meio: pinça, antebraço). Alavanca não dá energia de graça: a força menor anda uma distância maior, na mesma proporção (o trabalho é o mesmo ${F.ret("A11")}).</p>
        ${F.caixa("fisico", R`<p><b>Seu corpo é uma alavanca desvantajosa.</b> O bíceps se prende a uns 4 cm do cotovelo; segurar 5 kg na mão exige mais de 400 N no músculo. Em troca, um encurtamento pequeno do músculo move a mão muito e depressa. Evolução escolheu velocidade, não força.</p>`)}`),

      F.secao("tombamento", "Escorregar ou tombar", R`
        <h3>Teorema 3: escada na parede lisa: $\tan\theta_\text{mín} = \frac1{2\mu}$</h3>
        ${F.demo("demonstração", R`<p>(i) Forças: peso $mg$ no meio; no chão, normal $N_1$ e atrito $f$; na parede (lisa), só a normal $N_2$, horizontal.</p>
          <p>(ii) Vertical: $N_1 = mg$. Horizontal: $f = N_2$. Torques em torno do pé: $N_2L\sin\theta = mg\frac L2\cos\theta \Rightarrow N_2 = \frac{mg}{2\tan\theta}$.</p>
          <p>(iii) Não escorrega se $f \le \mu N_1$: $\frac{mg}{2\tan\theta} \le \mu mg$.</p>
          ${F.formula(R`\tan\theta \ge \frac{1}{2\mu}\qquad(\text{escada homogênea, parede lisa})`, "Ângulo mínimo da escada")}
          <p>(iv) Não depende de $L$ nem de $m$. Com uma pessoa subindo, o torque cresce e o limite piora (chefão). $\blacksquare$</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Iminência de tombar = normal na aresta.</b> Quando um corpo está prestes a girar em torno de uma aresta, toda a força de contato se concentra nela. Compare a força para tombar ($F = \frac{b}{2h}mg$, empurrando no topo) com a de escorregar ($\mu mg$): acontece o que precisar de menos.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, estática vira engenharia: tensões e deformações em vigas (resistência dos materiais), treliças resolvidas nó a nó, e o princípio dos trabalhos virtuais, que reaparece na mecânica de Lagrange ${F.ret("U03")}. Em fluidos, o tensor de tensões generaliza a ideia de "força por área em cada direção" ${F.ret("N04")}.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-gangorra"); e.outerHTML = F.lab("Gangorra: torques", "lab-gangorra"); SIM.gangorra(document.getElementById("lab-gangorra"), F); },
});
