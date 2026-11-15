/* A14a · Rotação e Corpo Rígido. Conferido em Python (g = 10 m/s²):
   torque 20 N a 0,3 m: 6 N·m (a 30°: 3 N·m); duas massas de 1 kg a 1 m do eixo: I = 2 kg·m²;
   disco 2 kg, R = 0,5 m: I = 0,25; com 1 N·m: α = 4 rad/s²; barra 3 kg, 2 m, pela ponta: ML²/3 = 4 kg·m²;
   volante I = 0,25 a 40 rad/s: 200 J; patinadora I 4 → 1,6 com ω = 2: ω = 5 rad/s (Ec 8 → 20 J);
   rolando de h = 1,5 m: esfera 4,63; disco 4,47; esfera oca 4,24; anel 3,87 m/s; a (30°): 3,57; 3,33; 3,00; 2,50 m/s²;
   Atwood 3 kg e 1 kg com polia-disco de 2 kg: a = 4 m/s²; ioiô: 2g/3 = 6,67 m/s²; bloco 1 kg pendurado em disco de 4 kg: 3,33 m/s²;
   barra que cai pela ponta (L = 1 m): ponta com 3g/2 = 15 m/s² no início; ω embaixo √(3g/L) = 5,48 rad/s;
   chefão: bola de boliche lançada a 7 m/s sem girar, μ = 0,2: rola em t = 2v0/(7μg) = 1 s, v = 5v0/7 = 5 m/s, d = 12v0²/(49μg) = 6 m,
   perde 2/7 da energia (simulação numérica confere); tacada na altura 2R/5 acima do centro: rola desde o início. */
F.registrar("A14a", {
  retoma: ["A07", "A08", "A11", "F04"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const bloco = (x, y, w, h, cor, rot) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" style="fill:color-mix(in srgb,${cor} 30%,transparent);stroke:${cor};stroke-width:2"/>` + (rot ? D.txt(x + w / 2, y + h / 2 + 5, rot, "tx2") : "");
    const discoBloco = (rot1, rot2) => fig(`<line x1="200" x2="360" y1="10" y2="10" style="stroke:var(--ink2);stroke-width:3"/><line x1="280" x2="280" y1="10" y2="50" style="stroke:var(--ink3)"/><circle cx="280" cy="70" r="40" style="fill:color-mix(in srgb,var(--mC) 25%,transparent);stroke:var(--mC);stroke-width:2"/><circle cx="280" cy="70" r="3" style="fill:var(--ink)"/><line x1="320" x2="320" y1="70" y2="120" style="stroke:var(--ink)"/>` + bloco(300, 120, 40, 34, "var(--mA)", rot2) + D.txt(220, 74, rot1, "tx2", "end"), 165);
    const exemplos = F.exemplo({
      titulo: "Rotação",
      casos: [
        { nome: "Fácil: o balde no poço", gerar: (p) => {
          const M = p ? 4 : F.escolha([2, 4, 6]), m = p ? 1 : F.escolha([1, 2]), a = (m * 10) / (m + M / 2), T = m * (10 - a);
          return { enun: R`<p>Um balde de ${m} kg está pendurado numa corda enrolada num cilindro maciço de ${M} kg (eixo fixo, sem atrito), como num poço. Soltando o balde, qual a aceleração dele e a tração na corda?</p>`, fig: discoBloco(`${M} kg`, `${m} kg`),
            passos: [R`<p>(i) Balde (translação): $mg - T = ma$. Cilindro (rotação): $TR = I\alpha = \frac12MR^2\alpha$, e a corda não escorrega: $a = \alpha R$. Então $T = \frac12Ma$.</p>`, R`<p>(ii) Somando: $mg = \left(m + \frac M2\right)a \Rightarrow a = \frac{${m}\cdot10}{${m} + ${M / 2}} = ${F.n(a, 3)}$ m/s².</p>`, R`<p>(iii) $T = \frac12Ma = ${F.n(T, 3)}$ N, menor que o peso (${m * 10} N). O cilindro "pesa" como uma massa extra de $M/2$ na inércia, mas não no peso.</p>`] };
        } },
        { nome: "Médio: quem desce mais rápido", gerar: (p) => {
          const ks = [["uma esfera maciça", 2 / 5, "2/5"], ["um disco", 1 / 2, "1/2"], ["uma esfera oca", 2 / 3, "2/3"], ["um anel", 1, "1"]], [nome, k, kt] = p ? ks[1] : F.escolha(ks), h = p ? 1.5 : F.escolha([0.8, 1.5, 2]), v = Math.sqrt((20 * h) / (1 + k));
          return { enun: R`<p>${nome[0].toUpperCase() + nome.slice(1)} rola sem deslizar, a partir do repouso, por uma rampa de ${F.nt(h)} m de altura. Com que velocidade chega embaixo? Compare com um bloco que escorregasse sem atrito.</p>`,
            fig: fig(`<path d="M60 30 L500 150 L60 150 Z" style="fill:var(--line2);stroke:var(--ink3)"/><circle cx="92" cy="22" r="16" style="fill:color-mix(in srgb,var(--mA) 35%,transparent);stroke:var(--mA);stroke-width:2"/>` + D.txt(48, 95, `${F.nt(h)} m`, "tx2", "end"), 165),
            passos: [R`<p>(i) Rolando sem deslizar, o ponto de contato está parado: o atrito estático não trabalha e a energia mecânica se conserva ${F.ret("A11")}.</p>`, R`<p>(ii) $Mgh = \frac12Mv^2 + \frac12I\omega^2$ com $I = ${kt}\,MR^2$ e $\omega = v/R$: $Mgh = \frac12Mv^2\left(1 + ${kt}\right)$.</p>`, R`<p>(iii) $v = \sqrt{\frac{2gh}{1 + ${kt}}} = ${F.n(v, 3)}$ m/s, contra $\sqrt{2gh} = ${F.n(Math.sqrt(20 * h), 3)}$ m/s do bloco. Parte da energia ficou "guardada" no giro. Massa e raio sumiram da conta!</p>`] };
        } },
        { nome: "Olimpíada: a régua que cai mais rápido que g", gerar: (p) => {
          const L = p ? 1 : F.escolha([0.5, 1, 1.5]), w = Math.sqrt(30 / L);
          return { enun: R`<p>Uma régua de ${F.nt(L)} m, com uma ponta articulada no chão, é solta da posição horizontal. (a) Qual a aceleração da outra ponta no instante em que é solta? (b) Uma moedinha apoiada sobre a ponta acompanha a régua? (c) Qual a velocidade angular quando a régua chega à vertical?</p>`,
            fig: fig(`<line x1="100" x2="520" y1="150" y2="150" style="stroke:var(--ink2)"/><circle cx="140" cy="140" r="5" style="fill:var(--ink)"/><rect x="140" y="132" width="320" height="8" style="fill:color-mix(in srgb,var(--mA) 40%,transparent);stroke:var(--mA)"/><ellipse cx="448" cy="127" rx="9" ry="3" style="fill:var(--warn)"/><path d="M460 140 A320 320 0 0 1 400 300" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/>`, 165),
            passos: [R`<p>(i) Torque do peso (no CM, a $L/2$) em torno da articulação: $Mg\frac L2 = I\alpha$, com $I = \frac{ML^2}3$ (eixos paralelos). Então $\alpha = \frac{3g}{2L} = ${F.n(15 / L, 3)}$ rad/s².</p>`, R`<p>(ii) A ponta: $a = \alpha L = \frac32g = 15$ m/s², maior que $g$! A moeda cai em queda livre com $g$ e fica para trás: ela descola da régua. (Os pontos a mais de $\frac23L$ da articulação aceleram mais que $g$.)</p>`, R`<p>(iii) Energia: o CM desce $L/2$: $Mg\frac L2 = \frac12\cdot\frac{ML^2}3\omega^2 \Rightarrow \omega = \sqrt{\frac{3g}L} = ${F.n(w, 3)}$ rad/s.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A bola de boliche que aprende a rolar",
      enun: R`<p>Uma bola de boliche (esfera maciça, raio $R$, massa $M$) é lançada deslizando, sem girar, com velocidade $v_0 = 7$ m/s numa pista com atrito cinético $\mu = 0{,}2$. O atrito freia a translação e, ao mesmo tempo, faz a bola girar, até que ela passa a rolar sem deslizar. (a) Escreva $v(t)$ e $\omega(t)$ enquanto ela desliza. (b) Em que instante ela passa a rolar, e com que velocidade? (c) Que distância percorreu deslizando? (d) Que fração da energia cinética foi perdida? (e) Em vez de lançar, você dá uma tacada horizontal curta na bola parada (sem atrito importante durante a tacada). A que altura acima do centro deve bater para ela já sair rolando sem deslizar?</p>`,
      fig: fig(`<line x1="40" x2="520" y1="150" y2="150" style="stroke:var(--ink2);stroke-width:2"/><circle cx="160" cy="110" r="40" style="fill:color-mix(in srgb,var(--mA) 30%,transparent);stroke:var(--mA);stroke-width:2"/>` + D.seta(160, 110, 240, 110, "var(--ink2)") + D.txt(200, 100, "v₀", "tx2") + D.seta(160, 152, 110, 152, "var(--warn)") + D.txt(105, 168, "atrito", "tx2", "end") + `<path d="M190 80 A42 42 0 0 1 200 110" style="fill:none;stroke:var(--ink3)"/>`, 175),
      dicas: [R`<p>(a) O atrito $\mu Mg$ age no ponto de contato, para trás. Translação: $Ma = -\mu Mg$. Rotação em torno do centro: $\mu MgR = \frac25MR^2\alpha$.</p>`, R`<p>(b) Rolar sem deslizar: $v = \omega R$.</p>`, R`<p>(e) A tacada dá impulso $J$ na altura $h$ acima do centro: $Mv = J$ e $I\omega = Jh$. Imponha $v = \omega R$.</p>`],
      sol: R`<p><b>(a)</b> $v(t) = v_0 - \mu gt$ e $\omega(t) = \frac{5\mu g}{2R}t$ (então $\omega R = \frac52\mu gt$).</p>
        <p><b>(b)</b> $v_0 - \mu gt = \frac52\mu gt \Rightarrow t = \frac{2v_0}{7\mu g} = \frac{14}{14} = 1$ s, e $v = v_0 - \frac27v_0 = \frac57v_0 = 5$ m/s. Elegante: a velocidade final não depende de $\mu$! (Também sai de conservação do momento angular em torno do ponto de contato no chão: o atrito passa por ele e não dá torque. $Mv_0R = MvR + \frac25MR^2\frac vR \Rightarrow v = \frac57v_0$.)</p>
        <p><b>(c)</b> $d = v_0t - \frac12\mu gt^2 = 7 - 1 = 6$ m $= \frac{12v_0^2}{49\mu g}$. Conferi integrando numericamente.</p>
        <p><b>(d)</b> Antes: $\frac12Mv_0^2 = 24{,}5M$. Depois: $\frac12Mv^2 + \frac12\cdot\frac25MR^2\omega^2 = \frac7{10}Mv^2 = 17{,}5M$. Perdeu $\frac{7}{24{,}5} = \frac27 \approx 28{,}6\%$, sempre, para qualquer $v_0$ e $\mu$.</p>
        <p><b>(e)</b> $\omega = \frac{Jh}{I} = \frac{Jh}{\frac25MR^2}$ e $v = \frac JM$. Rolar: $\frac JM = \frac{5Jh}{2MR} \Rightarrow h = \frac25R$ (a $\frac75R$ do chão). É o "centro de percussão": batendo ali, o ponto de contato não escorrega. Jogadores de sinuca usam isso (tacada "alta" ou "baixa" para dar efeito); no taco de beisebol, o mesmo ponto é o que não dói na mão.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Uma força de 20 N é aplicada perpendicularmente na ponta de uma chave de roda de 30 cm. Qual o torque (em N·m)?</p>`, num: { v: 6, un: "N·m" }, dicas: [R`<p>$\tau = rF\sin\theta$.</p>`], resp: "6 N·m", sol: R`<p>$0{,}3\cdot20 = 6$ N·m.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Na mesma chave, a força de 20 N passa a fazer 30° com a haste. Qual o torque agora?</p>`, fig: fig(`<circle cx="140" cy="100" r="10" style="fill:none;stroke:var(--ink);stroke-width:3"/><line x1="140" x2="420" y1="100" y2="100" style="stroke:var(--ink2);stroke-width:8"/>` + D.seta(420, 100, 420 + 100 * Math.cos(Math.PI / 6), 100 - 100 * Math.sin(Math.PI / 6), "var(--warn)") + D.txt(460, 92, "30°", "tx2"), 165), num: { v: 3, un: "N·m" }, dicas: [R`<p>Só a componente perpendicular à haste gira.</p>`], resp: "3 N·m", sol: R`<p>$0{,}3\cdot20\cdot\sin30° = 3$ N·m. Puxar ao longo da haste não gira nada.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Duas bolinhas de 1 kg estão nas pontas de uma haste leve de 2 m que gira em torno do meio. Qual o momento de inércia (em kg·m²)?</p>`, num: { v: 2, un: "kg·m²" }, dicas: [R`<p>$I = \sum m_ir_i^2$, com $r$ a distância ao eixo.</p>`], resp: "2 kg·m²", sol: R`<p>$1\cdot1^2 + 1\cdot1^2 = 2$ kg·m². Girando em torno de uma das bolinhas: $1\cdot2^2 = 4$, o dobro.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Um disco maciço de 2 kg e raio 0,5 m, livre para girar em torno do eixo, recebe um torque de 1 N·m. Qual a aceleração angular?</p>`, num: { v: 4, un: "rad/s²" }, dicas: [R`<p>$I = \frac12MR^2$ e $\tau = I\alpha$.</p>`], resp: "4 rad/s²", sol: R`<p>$I = 0{,}25$ kg·m²; $\alpha = \frac1{0{,}25} = 4$ rad/s².</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Uma barra homogênea de 3 kg e 2 m gira em torno de uma das pontas. Qual o momento de inércia?</p>`, num: { v: 4, un: "kg·m²" }, dicas: [R`<p>Em torno do centro, $\frac{ML^2}{12}$. Use o teorema dos eixos paralelos.</p>`], resp: "4 kg·m²", sol: R`<p>$\frac{3\cdot4}{12} + 3\cdot1^2 = 1 + 3 = 4$ kg·m² $= \frac{ML^2}3$.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Um volante com $I = 0{,}25$ kg·m² gira a 40 rad/s. Quanta energia cinética ele guarda?</p>`, num: { v: 200, un: "J" }, dicas: [R`<p>$E = \frac12I\omega^2$.</p>`], resp: "200 J", sol: R`<p>$\frac12\cdot0{,}25\cdot1600 = 200$ J. Ônibus e carros de Fórmula 1 já usaram volantes assim para guardar a energia da frenagem.</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Uma patinadora gira a 2 rad/s com os braços abertos ($I = 4$ kg·m²). Ela fecha os braços e $I$ cai para 1,6 kg·m². Com que velocidade angular passa a girar?</p>`, num: { v: 5, un: "rad/s" }, dicas: [R`<p>Sem torque externo (o gelo quase não tem atrito): $L = I\omega$ se conserva.</p>`], resp: "5 rad/s", sol: R`<p>$4\cdot2 = 1{,}6\,\omega \Rightarrow \omega = 5$ rad/s.</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Uma esfera maciça, um disco, uma esfera oca e um anel são soltos juntos no topo de uma rampa e rolam sem deslizar. Quem chega primeiro?</p>`, alts: ["O mais pesado.", "O de maior raio.", "A esfera maciça.", "O anel.", "Chegam todos juntos."], certa: "C", dicas: [R`<p>$a = \frac{g\sin\theta}{1 + k}$ com $I = kMR^2$. Mexa no laboratório.</p>`], resp: "C", sol: R`<p>A esfera maciça tem o menor $k$ (2/5): menos energia vai para o giro, mais para a translação. Ordem: esfera maciça, disco (1/2), esfera oca (2/3), anel (1). Massa e raio não importam.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Um disco maciço rola sem deslizar, a partir do repouso, por uma rampa de 1,5 m de altura. Com que velocidade chega embaixo?</p>`, num: { v: Math.sqrt(20), tol: 0.01, un: "m/s" }, dicas: [R`<p>$Mgh = \frac12Mv^2 + \frac12\cdot\frac12MR^2\left(\frac vR\right)^2$.</p>`], resp: "√20 ≈ 4,47 m/s", sol: R`<p>$gh = \frac34v^2 \Rightarrow v = \sqrt{\frac{4gh}3} = \sqrt{20} \approx 4{,}47$ m/s (um bloco sem atrito chegaria a 5,48 m/s).</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Uma máquina de Atwood tem blocos de 3 kg e 1 kg, e a polia é um disco maciço de 2 kg (a corda não escorrega). Qual a aceleração dos blocos?</p>`, fig: fig(`<line x1="200" x2="360" y1="10" y2="10" style="stroke:var(--ink2);stroke-width:3"/><line x1="280" x2="280" y1="10" y2="40" style="stroke:var(--ink3)"/><circle cx="280" cy="60" r="30" style="fill:color-mix(in srgb,var(--mC) 25%,transparent);stroke:var(--mC);stroke-width:2"/><line x1="250" x2="250" y1="60" y2="120" style="stroke:var(--ink)"/><line x1="310" x2="310" y1="60" y2="90" style="stroke:var(--ink)"/>` + bloco(232, 120, 36, 40, "var(--mA)", "3 kg") + bloco(295, 90, 30, 28, "var(--mA)", "1 kg") + D.txt(330, 64, "2 kg", "tx2", "start"), 170), num: { v: 4, un: "m/s²" }, dicas: [R`<p>Agora as trações dos dois lados são diferentes: $(T_1 - T_2)R = I\alpha$.</p>`], resp: "4 m/s²", sol: R`<p>$a = \frac{(m_1 - m_2)g}{m_1 + m_2 + M/2} = \frac{20}{5} = 4$ m/s² (sem a massa da polia seria 5 m/s² ${F.ret("A08")}).</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Um ioiô (disco maciço) cai desenrolando o fio, que está preso no teto. Qual a aceleração do centro do ioiô?</p>`, num: { v: 20 / 3, tol: 0.01, un: "m/s²" }, dicas: [R`<p>$Mg - T = Ma$; $TR = \frac12MR^2\alpha$; $a = \alpha R$.</p>`], resp: "2g/3 ≈ 6,67 m/s²", sol: R`<p>$T = \frac12Ma$; $Mg = \frac32Ma \Rightarrow a = \frac23g \approx 6{,}67$ m/s², e a tração é $\frac{Mg}3$.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Uma régua de 1 m com uma ponta articulada no chão é solta da horizontal. Qual a aceleração da outra ponta no instante inicial?</p>`, num: { v: 15, un: "m/s²" }, dicas: [R`<p>$\tau = Mg\frac L2$; $I = \frac{ML^2}3$.</p>`], resp: "15 m/s²", sol: R`<p>$\alpha = \frac{3g}{2L}$; $a_\text{ponta} = \alpha L = \frac32g = 15$ m/s², mais que a queda livre.</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>No exercício da patinadora, a energia cinética passou de 8 J para 20 J. De onde vieram os 12 J?</p>`, alts: ["Do atrito com o gelo.", "Da conservação do momento angular, que cria energia.", "Do trabalho dos músculos para puxar os braços para dentro.", "Da energia potencial gravitacional.", "Não vieram de lugar nenhum: a conta está errada."], certa: "C", dicas: [R`<p>Fechar os braços girando é fácil ou exige força? (Pense na "força centrífuga" que você sente no próprio referencial.)</p>`], resp: "C", sol: R`<p>$L$ se conserva, energia cinética não: $E = \frac{L^2}{2I}$ cresce quando $I$ diminui. Os braços precisam ser puxados para dentro contra a tendência de sair pela tangente: esse trabalho muscular vira os 12 J.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · corpo rígido</div>
        <div class="q">Uma lata cheia de refrigerante e uma lata vazia descem a mesma rampa rolando. Qual chega primeiro? E uma lata de sopa cremosa?</div>
        <p>Não é a mais pesada que ganha: é a que gasta menos energia girando. Para responder, precisamos da "massa" da rotação, o momento de inércia, e da versão rotacional da 2ª lei de Newton.</p></div>`),

      F.secao("torque", "Torque e momento de inércia", R`
        <p>Cinemática angular ${F.ret("A07")}: $\omega = \frac{d\theta}{dt}$, $\alpha = \frac{d\omega}{dt}$; num corpo rígido, um ponto a distância $r$ do eixo tem $v = \omega r$ e $a_t = \alpha r$.</p>
        ${F.formula(R`\tau = rF\sin\theta = F\,b\qquad\qquad I = \sum m_ir_i^2 = \int r^2\,dm`, "Torque (b = braço de alavanca) e momento de inércia")}
        <h3>Teorema 1: $\tau = I\alpha$</h3>
        ${F.demo("demonstração", R`<p>(i) Divida o corpo em partículas $m_i$ a distância $r_i$ do eixo. A componente tangencial da 2ª lei: $F_{t,i} = m_ia_{t,i} = m_ir_i\alpha$ (todas têm o mesmo $\alpha$, o corpo é rígido).</p>
          <p>(ii) Multiplique por $r_i$ (vira torque) e some: $\sum r_iF_{t,i} = \left(\sum m_ir_i^2\right)\alpha$.</p>
          <p>(iii) Os torques das forças internas se cancelam aos pares (ação e reação na mesma linha). Sobra:</p>
          ${F.formula(R`\tau_\text{ext} = I\alpha`, "2ª lei de Newton para rotação (eixo fixo)")}
          <p>(iv) Dicionário: $F \leftrightarrow \tau$, $m \leftrightarrow I$, $a \leftrightarrow \alpha$. $\blacksquare$</p>`)}
        <h3>Teorema 2: momentos de inércia e eixos paralelos</h3>
        ${F.demo("demonstração", R`<p>(i) <b>Barra pelo centro</b>: $dm = \frac ML\,dx$, $I = \int_{-L/2}^{L/2}x^2\frac ML\,dx = \frac ML\cdot\frac{2}{3}\left(\frac L2\right)^3 = \frac{ML^2}{12}$ ${F.ret("F04")}.</p>
          <p>(ii) <b>Disco</b>: anéis de raio $r$ e largura $dr$, $dm = \frac{M}{\pi R^2}2\pi r\,dr$; $I = \int_0^R r^2\frac{2M}{R^2}r\,dr = \frac{MR^2}2$. Anel fino: todo a $R$, $I = MR^2$.</p>
          <p>(iii) <b>Eixos paralelos (Steiner)</b>: com $\vec r_i = \vec d + \vec r_i'$ ($\vec r_i'$ medido do CM), $\sum m_i|\vec d + \vec r_i'|^2 = Md^2 + 2\vec d\cdot\sum m_i\vec r_i' + \sum m_ir_i'^2$. O termo do meio é zero (definição de CM ${F.ret("A12b")}):</p>
          ${F.formula(R`I = I_\text{cm} + Md^2;\quad \text{barra}: \tfrac{ML^2}{12}\ (\text{centro}),\ \tfrac{ML^2}3\ (\text{ponta});\quad \text{disco}: \tfrac{MR^2}2;\quad \text{anel}: MR^2;\quad \text{esfera}: \tfrac25MR^2`, "Momentos de inércia")}
          <p>(iv) Esfera maciça: some discos finos (conta parecida). Esfera oca: $\frac23MR^2$. $\blacksquare$</p>`)}
        ${F.caixa("pegadinha", R`<p><b>O momento de inércia depende do eixo.</b> A mesma barra tem $I$ quatro vezes maior girando pela ponta do que pelo centro. E não basta "massa vezes raio ao quadrado" de um ponto qualquer: o $r$ de cada pedaço é a distância <b>ao eixo</b>.</p>`)}`),

      F.secao("rolamento", "Energia de rotação e rolamento", R`
        ${F.formula(R`E_c = \tfrac12Mv_\text{cm}^2 + \tfrac12I_\text{cm}\omega^2,\qquad \text{rolar sem deslizar}: v_\text{cm} = \omega R`, "Energia cinética de um corpo que rola")}
        <h3>Teorema 3: aceleração de um corpo rolando num plano inclinado</h3>
        ${F.demo("demonstração", R`<p>(i) Com $I = kMR^2$: translação $Mg\sin\theta - f = Ma$; rotação em torno do CM $fR = kMR^2\alpha$, e $a = \alpha R$. Logo $f = kMa$.</p>
          <p>(ii) $Mg\sin\theta = (1 + k)Ma$:</p>
          ${F.formula(R`a = \frac{g\sin\theta}{1 + k},\qquad v_\text{embaixo} = \sqrt{\frac{2gh}{1 + k}}`, "Rolamento no plano inclinado")}
          <p>(iii) O atrito estático é necessário (sem ele a bola escorrega sem girar), mas <b>não trabalha</b>: o ponto de contato está parado. Por isso a energia se conserva e (ii) também sai de $Mgh = \frac12Mv^2(1 + k)$. Rola sem deslizar enquanto $kMa \le \mu_eMg\cos\theta$, isto é, $\tan\theta \le \mu_e\frac{1 + k}{k}$. $\blacksquare$</p>`)}
        <div id="lab-rolamento"></div>
        <p>Resposta da abertura: a lata cheia de refrigerante se comporta quase como um cilindro de líquido que <b>não gira junto</b> (o líquido desliza dentro), então quase não gasta energia girando e ganha. A vazia é um anel ($k \approx 1$) e perde. A sopa cremosa gira junto como um sólido ($k \approx \frac12$).</p>`),

      F.secao("momento", "Momento angular", R`
        ${F.formula(R`L = I\omega,\qquad \vec L = \vec r\times\vec p,\qquad \tau_\text{ext} = \frac{dL}{dt}`, "Momento angular")}
        <p>Sem torque externo, $L$ se conserva: a patinadora que fecha os braços gira mais rápido, o gato que cai sempre de pé, a estrela que colapsa em pulsar girando centenas de vezes por segundo. Para um planeta, é a 2ª lei de Kepler ${F.ret("A15")}.</p>
        ${F.caixa("fisico", R`<p><b>Por que a bicicleta em movimento não cai?</b> Em boa parte, pela geometria da direção (a roda da frente vira para o lado da queda e corrige). O giroscópio das rodas ajuda pouco: bicicletas experimentais com rodas que giram ao contrário (cancelando $L$) ainda se equilibram sozinhas.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Escolha bem o ponto para o momento angular.</b> Em torno de um ponto por onde passa uma força desconhecida (atrito no contato, impulso numa articulação), essa força não dá torque e some da equação. É o atalho do chefão: $L$ em torno do ponto de contato se conserva enquanto a bola desliza.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, $I$ vira o <b>tensor de inércia</b> (uma matriz 3×3), $\vec L = \mathbf I\vec\omega$ nem sempre é paralelo a $\vec\omega$, e surgem a precessão do pião e as equações de Euler. A conservação de $\vec L$ vem da simetria de rotação (Noether ${F.ret("matematica/TE05")}); na mecânica quântica, o momento angular é quantizado.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-rolamento"); e.outerHTML = F.lab("Corrida de rolamento", "lab-rolamento"); SIM.rolamento(document.getElementById("lab-rolamento"), F); },
});
