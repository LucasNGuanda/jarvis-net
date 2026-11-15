/* O08 · Refração (base: Halliday vol. 4, cap. 33, escrito com as minhas palavras). Conferido em Python (scratchpad opt.py e opt2.py):
   crítico água 48,8°, vidro 41,8°, diamante 24,4°; Brewster vidro 56,3°; 30° ar→vidro dá 19,5°; profundidade aparente de 2 m de água = 1,50 m;
   prisma 60° n = 1,5: desvio mínimo 37,2°; fibra 1,50/1,48: aceitação 14,1°; arco-íris 42,1°; lâmina 5 cm a 45°: deslocamento 1,65 cm; Malus 0°/45°/90° = 1/8. */
F.registrar("O08", {
  retoma: ["C15d", "matematica/CI05"],
  html(F) {
    const R = String.raw;
    const g = (x) => (x * 180) / Math.PI, rd = (x) => (x * Math.PI) / 180;
    const exemplario = F.exemplo({
      titulo: "Refração passo a passo",
      casos: [
        { nome: "Lei de Snell", gerar: (p) => {
          const M = [["ar", 1, "o"], ["água", 1.33, "a"], ["vidro", 1.5, "o"], ["diamante", 2.42, "o"]];
          const [a, b] = p ? [M[0], M[2]] : (() => { let x, y; do { x = F.escolha(M); y = F.escolha(M); } while (x === y); return [x, y]; })();
          const t1 = p ? 30 : F.escolha([20, 30, 40, 50, 60]), s2 = (a[1] / b[1]) * Math.sin(rd(t1));
          return { enun: R`<p>Um raio passa ${a[2] === "a" ? "da" : "do"} ${a[0]} ($n = ${F.n(a[1])}$) para ${b[2]} ${b[0]} ($n = ${F.n(b[1])}$) com incidência de ${t1}°. Qual o ângulo de refração?</p>`, fig: "",
            passos: [
              R`<p>Snell: $n_1\operatorname{sen}\theta_1 = n_2\operatorname{sen}\theta_2$, com os ângulos medidos a partir da <b>normal</b>.</p>`,
              R`<p>$\operatorname{sen}\theta_2 = \frac{${F.n(a[1])}}{${F.n(b[1])}}\operatorname{sen}${t1}° = ${F.n(s2, 4)}$.</p>`,
              s2 >= 1 ? R`<p>Deu mais que 1: não existe $\theta_2$. É <b>reflexão interna total</b>: o ângulo de ${t1}° passa do crítico, $\arcsin\frac{${F.n(b[1])}}{${F.n(a[1])}} = ${F.n(g(Math.asin(b[1] / a[1])), 1)}°$.</p>`
                : R`<p>$\theta_2 = ${F.n(g(Math.asin(s2)), 1)}°$. ${b[1] > a[1] ? "Entrou num meio mais refringente: o raio se aproxima da normal." : "Saiu para um meio menos refringente: o raio se afasta da normal."}</p>`,
            ] };
        } },
        { nome: "Profundidade aparente", gerar: (p) => {
          const h = p ? 2 : F.escolha([1, 1.5, 2, 3]), n = p ? 1.33 : F.escolha([1.33, 1.5]);
          return { enun: R`<p>Uma moeda está no fundo de ${n === 1.33 ? "uma piscina" : "um bloco de vidro"} com ${F.n(h)} m de profundidade. Olhando de cima, quase na vertical, a que profundidade ela parece estar?</p>`, fig: "",
            passos: [
              R`<p>Raios que saem da moeda se afastam da normal ao sair para o ar. O olho prolonga esses raios para trás, e eles se cruzam mais perto da superfície.</p>`,
              R`<p>Para ângulos pequenos, $\operatorname{tg} \approx \operatorname{sen}$, e Snell dá $\frac{h_\text{ap}}{h} = \frac{n_\text{ar}}{n} = \frac{1}{${F.n(n)}}$.</p>`,
              R`<p>$h_\text{ap} = \frac{${F.n(h)}}{${F.n(n)}} \approx ${F.n(h / n, 2)}$ m. Por isso a piscina "parece rasa" e o pescador com arpão tem de mirar abaixo de onde vê o peixe.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Por que o arco-íris tem 42°",
      enun: R`<p>Um raio de sol entra numa gota esférica de água ($n = 1{,}333$), reflete <b>uma vez</b> dentro dela e sai. Se ele entra com ângulo de incidência $i$ e refrata com ângulo $r$, o desvio total é $D(i) = 180° + 2i - 4r$.</p><p>(a) Deduza essa expressão. (b) Mostre que $D$ tem um mínimo quando $\cos^2i = \frac{n^2 - 1}{3}$. (c) Calcule o ângulo do arco-íris, $180° - D_\text{mín}$. (d) Por que o vermelho fica por fora?</p>`,
      fig: "",
      dicas: [R`<p>(a) Cada refração desvia $i - r$; a reflexão interna desvia $180° - 2r$.</p>`, R`<p>(b) $D' = 2 - 4\frac{dr}{di} = 0$, com $\frac{dr}{di} = \frac{\cos i}{n\cos r}$ (derive a lei de Snell). Use $n^2\cos^2r = n^2 - \operatorname{sen}^2i$.</p>`],
      sol: R`<p><b>(a)</b> Entrada: $i - r$. Reflexão: $180° - 2r$. Saída: $i - r$. Soma: $180° + 2i - 4r$.</p>
        <p><b>(b)</b> $\frac{dD}{di} = 2 - 4\frac{\cos i}{n\cos r} = 0 \Rightarrow n\cos r = 2\cos i$. Elevando ao quadrado: $n^2 - \operatorname{sen}^2i = 4\cos^2i \Rightarrow n^2 - 1 = 3\cos^2i$ ∎.</p>
        <p><b>(c)</b> $\cos^2i = \frac{1{,}333^2 - 1}{3} \approx 0{,}259$, $i \approx 59{,}4°$, $r \approx 40{,}2°$, $D_\text{mín} \approx 137{,}9°$. Ângulo do arco: $180° - 137{,}9° \approx 42{,}1°$ (conferi minimizando numericamente).</p>
        <p><b>(d)</b> Perto do mínimo, muitos raios saem quase no mesmo ângulo e se acumulam: é o brilho do arco (uma "cáustica"). Como $n$ é um pouco menor para o vermelho, o ângulo dele é maior (~42,4°) que o do violeta (~40,6°): vermelho por fora. Essa é a otimização de ${F.ret("matematica/CI05")} explicando um fenômeno do céu.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Óptica · refração</div>
        <div class="q">Por que um canudo parece quebrado dentro do copo d'água?</div>
        <p>Porque a luz muda de velocidade ao passar do ar para a água, e por isso muda de direção. Com uma lei só (Snell) dá para explicar o canudo, a piscina que parece rasa, a fibra óptica da internet, o brilho do diamante, a miragem no asfalto e o ângulo exato do arco-íris.</p></div>`),

      F.secao("snell", "Índice de refração e lei de Snell", R`
        ${F.formula(R`n = \frac cv\qquad\qquad n_1\operatorname{sen}\theta_1 = n_2\operatorname{sen}\theta_2`, "Índice de refração e lei de Snell–Descartes")}
        <p>$n$ diz quantas vezes a luz fica mais lenta no meio: no vidro ($n \approx 1{,}5$), $v = 2\times10^8$ m/s. Ângulos medidos a partir da <b>normal</b>. A <b>frequência não muda</b> ao atravessar (quem dita o ritmo é a fonte); muda o comprimento de onda: $\lambda_\text{meio} = \lambda/n$. Luz de 600 nm vira 400 nm dentro do vidro, sem mudar de cor (a cor que o olho vê depende da frequência).</p>
        ${F.demo("Snell pela frente de onda (Huygens)", R`<p>(i) Uma frente de onda plana chega inclinada à superfície. Enquanto uma ponta dela ainda anda no meio 1 por um tempo $\Delta t$, percorrendo $v_1\Delta t$, a outra ponta já está no meio 2 e anda só $v_2\Delta t$.</p>
          <p>(ii) Os dois triângulos retângulos que se formam compartilham a hipotenusa $L$ (o trecho da superfície): $v_1\Delta t = L\operatorname{sen}\theta_1$ e $v_2\Delta t = L\operatorname{sen}\theta_2$.</p>
          <p>(iii) Dividindo: $\frac{\operatorname{sen}\theta_1}{\operatorname{sen}\theta_2} = \frac{v_1}{v_2} = \frac{n_2}{n_1}$ ∎. A frente "freia" de um lado antes do outro e gira, como um carrinho de compras que encosta uma roda na grama.</p>`)}
        ${F.caixa("ponte", R`<p>Outra dedução, pelo caminho de menor tempo (princípio de Fermat), está no laboratório do salva-vidas ${F.ret("matematica/CI05")}. E a dedução "de verdade", pelas condições de contorno dos campos $\vec E$ e $\vec B$ das equações de Maxwell, é a que dá também quanto reflete (Fresnel, no laboratório abaixo) ${F.ret("C15d")}.</p>`)}
        <div id="lab-ref"></div>`),

      F.secao("total", "Reflexão interna total e fibras ópticas", R`
        <p>Saindo de um meio <b>mais</b> refringente para um <b>menos</b> ($n_1 > n_2$), o raio se afasta da normal. A partir de um ângulo, ele não consegue mais sair:</p>
        ${F.formula(R`\operatorname{sen}\theta_c = \frac{n_2}{n_1}`, "Ângulo crítico")}
        <table class="tb"><tr><th>de… para o ar</th><th>θc</th></tr><tr><td>água (1,33)</td><td>48,8°</td></tr><tr><td>vidro (1,50)</td><td>41,8°</td></tr><tr><td>diamante (2,42)</td><td>24,4°</td></tr></table>
        <p>Acima de $\theta_c$, <b>100%</b> da luz reflete, mais que qualquer espelho metálico (~95%). O diamante, com ângulo crítico pequeno, prende a luz em várias reflexões internas antes de deixá-la sair pela face de cima: é o "brilho". A <b>fibra óptica</b> guia a luz por reflexão total entre um núcleo ($n_1$) e uma casca ($n_2$ um pouco menor). Ela só aceita luz que entra num cone de abertura $\operatorname{sen}\theta_\text{máx} = \sqrt{n_1^2 - n_2^2}$ (a "abertura numérica").</p>
        <p><b>Miragem</b>: o ar quente perto do asfalto tem $n$ um pouquinho menor. Um raio do céu que desce rasante vai entrando em camadas cada vez menos refringentes, entorta para cima e faz uma "reflexão total suave": você vê o céu no chão, como se fosse uma poça.</p>`),

      F.secao("outros", "Lâminas, prismas e dispersão", R`
        <p><b>Lâmina de faces paralelas</b> (uma janela): o raio sai paralelo ao de entrada, só deslocado de $d = \frac{t\operatorname{sen}(\theta_1 - \theta_2)}{\cos\theta_2}$, onde $t$ é a espessura.</p>
        <p><b>Prisma</b> de ângulo $A$: o desvio total é mínimo quando o raio atravessa simetricamente. Nesse caso, $n = \frac{\operatorname{sen}\frac{A + D_\text{mín}}{2}}{\operatorname{sen}\frac A2}$, o jeito clássico de medir $n$ no laboratório.</p>
        <p><b>Dispersão</b>: $n$ depende um pouco da cor (no vidro, maior para o violeta). Por isso o prisma separa a luz branca (Newton, 1666) e as lentes simples têm "aberração cromática" (bordas coloridas).</p>
        <h3>Polarização</h3>
        <p>A luz é uma onda transversal: $\vec E$ oscila perpendicular à direção de propagação ${F.ret("C15d")}. Um polarizador só deixa passar a componente de $\vec E$ paralela ao seu eixo. Luz comum (não polarizada) perde metade; luz já polarizada obedece à <b>lei de Malus</b>: $I = I_0\cos^2\theta$. Na reflexão, existe um ângulo, o de <b>Brewster</b>, em que a luz refletida sai totalmente polarizada:</p>
        ${F.formula(R`\operatorname{tg}\theta_B = \frac{n_2}{n_1}`, "Ângulo de Brewster (refletido ⊥ refratado)")}
        <p>É por isso que óculos polarizados cortam o reflexo da água e do asfalto: a luz refletida chega polarizada na horizontal, e a lente só deixa passar a vertical.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>A luz de um laser de 600 nm (no ar) entra num vidro com $n = 1{,}5$. Qual a velocidade, o comprimento de onda e a frequência dentro do vidro?</p>`, fig: "", dicas: [R`<p>$v = c/n$, $\lambda = \lambda_0/n$.</p>`, R`<p>A frequência não muda: $f = c/\lambda_0$.</p>`], resp: R`$v = 2{,}0\times10^8$ m/s; $\lambda = 400$ nm; $f = 5{,}0\times10^{14}$ Hz.`, sol: R`<p>$f = \frac{3\times10^8}{600\times10^{-9}} = 5\times10^{14}$ Hz, igual nos dois meios.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Um raio sai da água ($n = 1{,}33$) para o ar com incidência de 45°. O que acontece? E com 30°?</p>`, fig: "", dicas: [R`<p>Compare com o ângulo crítico, 48,8°.</p>`, R`<p>$\operatorname{sen}\theta_2 = 1{,}33\operatorname{sen}\theta_1$.</p>`], resp: R`45°: refrata a $\approx 70{,}1°$; 30°: refrata a $\approx 41{,}7°$.`, sol: R`<p>$1{,}33\times0{,}7071 = 0{,}9405 \Rightarrow 70{,}1°$ (ainda abaixo do crítico, então sai); $1{,}33\times0{,}5 = 0{,}665 \Rightarrow 41{,}7°$.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Um raio atravessa uma janela de vidro de 5 cm de espessura ($n = 1{,}5$) com incidência de 45°. De quanto ele fica deslocado lateralmente?</p>`, fig: "", dicas: [R`<p>$\theta_2 = \arcsin\frac{\operatorname{sen}45°}{1{,}5} \approx 28{,}1°$.</p>`, R`<p>$d = \frac{t\operatorname{sen}(\theta_1 - \theta_2)}{\cos\theta_2}$.</p>`], resp: R`$d \approx 1{,}65$ cm.`, sol: R`<p>$\frac{5\times\operatorname{sen}16{,}9°}{\cos28{,}1°} = \frac{5\times0{,}290}{0{,}882} \approx 1{,}65$ cm. Saída paralela à entrada.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Um prisma de 60° de vidro ($n = 1{,}5$). Qual o desvio mínimo?</p>`, fig: "", dicas: [R`<p>No desvio mínimo, o raio interno é paralelo à base: $r = A/2 = 30°$.</p>`, R`<p>$\operatorname{sen}i = 1{,}5\operatorname{sen}30°$; $D = 2i - A$.</p>`], resp: R`$D_\text{mín} \approx 37{,}2°$.`, sol: R`<p>$i = \arcsin0{,}75 = 48{,}6°$; $D = 97{,}2° - 60° = 37{,}2°$.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma fibra óptica tem núcleo com $n_1 = 1{,}50$ e casca com $n_2 = 1{,}48$. Qual o maior ângulo (em relação ao eixo da fibra) com que a luz pode entrar, vinda do ar, e ainda ficar presa?</p>`, fig: "", dicas: [R`<p>Dentro, o raio tem de bater na casca acima do crítico: $\operatorname{sen}\theta_c = n_2/n_1$.</p>`, R`<p>Junte com Snell na entrada: $\operatorname{sen}\theta_\text{máx} = \sqrt{n_1^2 - n_2^2}$.</p>`], resp: R`$\theta_\text{máx} \approx 14{,}1°$ (abertura numérica 0,244).`, sol: R`<p>Na entrada, $\operatorname{sen}\theta_\text{máx} = n_1\operatorname{sen}(90° - \theta_c) = n_1\cos\theta_c = \sqrt{n_1^2 - n_2^2} = 0{,}244$.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Qual o ângulo de Brewster para luz refletida na água ($n = 1{,}33$) e no vidro ($n = 1{,}5$)? Mostre que, nele, o raio refletido e o refratado são perpendiculares.</p>`, fig: "", dicas: [R`<p>$\operatorname{tg}\theta_B = n$.</p>`, R`<p>Com $\operatorname{sen}\theta_B = n\operatorname{sen}\theta_2$ e $\operatorname{tg}\theta_B = n$, mostre que $\theta_2 = 90° - \theta_B$.</p>`], resp: R`Água 53,1°; vidro 56,3°.`, sol: R`<p>$\operatorname{sen}\theta_B = n\cos\theta_B$ (de $\operatorname{tg} = n$). Snell: $\operatorname{sen}\theta_B = n\operatorname{sen}\theta_2$. Então $\operatorname{sen}\theta_2 = \cos\theta_B$, ou seja, $\theta_2 = 90° - \theta_B$: refletido e refratado a 90°. Microscopicamente: os elétrons do meio oscilam na direção do $\vec E$ refratado, e um dipolo não irradia na direção em que oscila.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Luz comum de intensidade $I_0$ passa por três polarizadores: o 1º a 0°, o 2º a 45°, o 3º a 90°. Qual a intensidade final? E se tirar o do meio?</p>`, fig: "", dicas: [R`<p>O 1º deixa metade; depois, Malus a cada passo.</p>`, R`<p>$\frac{I_0}2\cos^245°\cos^245°$.</p>`], resp: R`$\frac{I_0}{8}$; sem o do meio, zero.`, sol: R`<p>Colocar um filtro <b>a mais</b> faz passar <b>mais</b> luz! O do meio "gira" a polarização em dois passos de 45°. Esse é um experimento clássico para mostrar que a polarização é um vetor sendo projetado, e na mecânica quântica é o protótipo de medição de um qubit.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-ref"); e.outerHTML = F.lab("Refração, reflexão total e Brewster", "lab-ref"); SIM.refracao(document.getElementById("lab-ref"), F); },
});
