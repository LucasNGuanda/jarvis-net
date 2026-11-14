/* A01 · Introdução à Cinemática. Conferido em Python:
   72 km/h = 20 m/s; ida 90 / volta 60 km/h (mesma distância): 72 km/h; metade do tempo a 80 e 40: 60 km/h;
   0 a 108 km/h em 10 s: 3 m/s²; meia volta (R = 50 m) em 20 s: |v⃗m| = 5 m/s, rapidez 7,85 m/s;
   1/3 a 30 e 2/3 a 60: 45 km/h; média 60 com a 1ª metade a 40 → 2ª metade a 120 km/h;
   metade da distância a 60, depois metade do tempo a 40 e metade a 20: 40 km/h; s = 2t² + 3 → v(3) = 12 m/s;
   chefão: metades sucessivas com velocidade multiplicada por r → v̄ = v(2r − 1)/r (r = 2: 1,5v). */
F.registrar("A01", {
  retoma: ["F01", "F02", "F04"],
  html(F) {
    const R = String.raw;
    const est = (conteudo, h = 110) => D.svg(560, h, conteudo, "estrada");
    const exemplos = F.exemplo({
      titulo: "Velocidade média",
      casos: [
        { nome: "Fácil: viagem com parada", gerar: (p) => {
          const d = p ? 150 : F.escolha([120, 150, 180, 240]), h = p ? 2 : F.escolha([1.5, 2, 2.5]), par = p ? 0.5 : F.escolha([0.25, 0.5]), vm = d / (h + par);
          return { enun: R`<p>Um carro faz uma viagem de ${d} km. Ele roda ${F.n(h)} h e para ${F.n(par * 60)} min num posto no meio do caminho. Qual a velocidade escalar média da viagem, em km/h e em m/s?</p>`,
            fig: est(D.estrada(40, 520, 80, 480 / d, d / 4, "km") + D.carro(60, 74, "var(--mA)") + D.txt(280, 40, `parada de ${F.t(par * 60, 0)} min`, "tx2") + `<circle cx="280" cy="80" r="5" style="fill:var(--warn)"/>`),
            passos: [R`<p>(i) Velocidade média usa o <b>tempo total</b>, com a parada: $\Delta t = ${F.n(h)} + ${F.n(par)} = ${F.n(h + par)}$ h.</p>`, R`<p>(ii) $v_m = \frac{\Delta s}{\Delta t} = \frac{${d}}{${F.n(h + par)}} \approx ${F.n(vm, 2)}$ km/h.</p>`, R`<p>(iii) Em m/s, divide por 3,6: $\approx ${F.n(vm / 3.6, 2)}$ m/s. Se você esquecesse a parada, acharia $${F.n(d / h, 2)}$ km/h: a velocidade média do <i>movimento</i>, não da viagem.</p>`] };
        } },
        { nome: "Médio: ida e volta", gerar: (p) => {
          const v1 = p ? 90 : F.escolha([40, 60, 90, 100]), v2 = p ? 60 : F.escolha([30, 60, 80, 120]), d = p ? 180 : F.escolha([60, 120, 180]), vm = (2 * v1 * v2) / (v1 + v2);
          return { enun: R`<p>Um ônibus vai de uma cidade a outra, a ${d} km, com velocidade média de ${v1} km/h, e volta pela mesma estrada a ${v2} km/h. Qual a velocidade escalar média na viagem toda? E qual a velocidade vetorial média?</p>`,
            fig: est(D.estrada(40, 520, 80, 480 / d, d / 3, "km") + D.seta(60, 40, 500, 40, "var(--mA)") + D.txt(280, 32, `ida a ${v1} km/h`, "tx2") + D.seta(500, 58, 60, 58, "var(--mT)") + D.txt(280, 74, `volta a ${v2} km/h`, "tx2")),
            passos: [R`<p>(i) Tempos: ida $\frac{${d}}{${v1}} = ${F.n(d / v1, 3)}$ h; volta $\frac{${d}}{${v2}} = ${F.n(d / v2, 3)}$ h.</p>`, R`<p>(ii) A distância total é $${2 * d}$ km, mas o deslocamento é zero (voltou ao ponto de partida).</p>`, R`<p>(iii) Rapidez média (distância/tempo) $= \frac{${2 * d}}{${F.n(d / v1 + d / v2, 3)}} \approx ${F.n(vm, 2)}$ km/h $= \frac{2v_1v_2}{v_1 + v_2}$, a <b>média harmônica</b>. A velocidade vetorial média é zero.</p>`] };
        } },
        { nome: "Olimpíada: metade do caminho, metade do tempo", gerar: (p) => {
          const v1 = p ? 80 : F.escolha([60, 80, 90]), v2 = p ? 60 : F.escolha([40, 60, 50]), v3 = p ? 30 : F.escolha([20, 30, 10]), vm = (2 * v1 * (v2 + v3)) / (2 * v1 + v2 + v3);
          return { enun: R`<p>Um ciclista faz a primeira metade do <b>caminho</b> a ${v1} km/h. Na segunda metade, ele anda metade do <b>tempo</b> a ${v2} km/h e a outra metade do tempo a ${v3} km/h. Qual a velocidade média na prova toda?</p>`,
            fig: est(D.estrada(40, 520, 80, 4.8, 25, "% do caminho") + D.txt(160, 50, `${v1} km/h`, "tx2") + D.txt(400, 50, `${v2} e ${v3} km/h (metade do tempo cada)`, "tx2") + `<line x1="280" y1="60" x2="280" y2="96" style="stroke:var(--ink3);stroke-dasharray:3 3"/>`),
            passos: [R`<p>(i) Chame o caminho de $2L$. Primeira metade: $t_1 = \frac{L}{v_1}$.</p>`, R`<p>(ii) Segunda metade, com dois intervalos iguais de duração $\tau$: $v_2\tau + v_3\tau = L \Rightarrow 2\tau = \frac{2L}{v_2 + v_3}$. Ou seja, nesse trecho a velocidade média é $\frac{v_2 + v_3}{2}$ (tempos iguais → média aritmética).</p>`, R`<p>(iii) Agora dois trechos de mesmo caminho, com $${v1}$ e $\frac{${v2} + ${v3}}{2} = ${F.n((v2 + v3) / 2)}$: média harmônica. $v_m = \frac{2\cdot${v1}\cdot${F.n((v2 + v3) / 2)}}{${v1} + ${F.n((v2 + v3) / 2)}} \approx ${F.n(vm, 2)}$ km/h.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Metades sem fim",
      enun: R`<p>Um carro percorre uma estrada de comprimento $D$ assim: a primeira metade da estrada com velocidade $v$; a metade do que sobrou com velocidade $rv$; a metade do que sobrou depois disso com $r^2v$; e assim por diante, sempre metade do que falta, com a velocidade multiplicada por $r > \frac12$.</p>
        <p>(a) Mostre que o carro chega ao fim em tempo finito e ache a velocidade média $\bar v$ em função de $v$ e $r$. (b) Calcule para $r = 2$. (c) Para que valor tende $\bar v$ quando $r \to \infty$? Explique fisicamente o resultado. (d) E se $r = 1$? Confira que a fórmula dá o esperado. (e) Por que $r \le \frac12$ não serve?</p>`,
      fig: "",
      dicas: [R`<p>O $k$-ésimo trecho tem comprimento $\frac{D}{2^k}$ e velocidade $r^{k-1}v$. Escreva o tempo do trecho.</p>`, R`<p>A soma dos tempos é uma PG de razão $\frac1{2r}$ ${F.ret("F05")}.</p>`],
      sol: R`<p><b>(a)</b> Tempo do $k$-ésimo trecho: $t_k = \frac{D/2^k}{r^{k-1}v} = \frac{D}{2v}\left(\frac1{2r}\right)^{k-1}$. A soma é uma PG de razão $q = \frac1{2r}$, que converge se $q < 1$, isto é, $r > \frac12$:</p>
        <p>$$T = \frac{D}{2v}\cdot\frac{1}{1 - \frac1{2r}} = \frac{D}{2v}\cdot\frac{2r}{2r - 1} = \frac{Dr}{v(2r - 1)},\qquad \bar v = \frac DT = v\,\frac{2r - 1}{r}.$$</p>
        <p><b>(b)</b> $r = 2$: $\bar v = \frac32v$.</p>
        <p><b>(c)</b> $\bar v \to 2v$. Com $r$ enorme, todo o resto da estrada é feito num instante; o tempo é praticamente só o da primeira metade, $\frac{D}{2v}$. Então $\bar v \approx \frac{D}{D/(2v)} = 2v$: a velocidade média nunca passa do dobro da velocidade da primeira metade, por mais rápido que seja o resto. É o mesmo efeito do exercício 10.</p>
        <p><b>(d)</b> $r = 1$: $\bar v = v$, como deve ser (velocidade constante).</p>
        <p><b>(e)</b> Com $r \le \frac12$, cada trecho demora pelo menos tanto quanto o anterior: a soma dos tempos é infinita e o carro nunca chega (a "velocidade média" seria zero). Conferido numericamente para $r = 1{,}5$, $2$ e $3$.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Um carro anda a 72 km/h. Quanto é isso em m/s?</p>`, num: { v: 20, un: "m/s" }, dicas: [R`<p>1 km/h $= \frac{1000}{3600}$ m/s.</p>`, R`<p>Divida por 3,6.</p>`], resp: "20 m/s", sol: R`<p>$72\div3{,}6 = 20$. Para o caminho de volta, multiplique por 3,6.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Um entregador anda 30 km para o leste e depois 10 km para o oeste, pela mesma estrada reta. Quais são o deslocamento e a distância percorrida?</p>`,
        fig: est(D.estrada(40, 520, 80, 16, 5, "km") + D.seta(40, 30, 520, 30, "var(--mA)") + D.txt(280, 22, "30 km para o leste", "tx2") + D.seta(520, 58, 360, 58, "var(--mT)") + D.txt(440, 50, "10 km para o oeste", "tx2")),
        alts: ["deslocamento 40 km; distância 20 km", "deslocamento 20 km para o leste; distância 40 km", "deslocamento 20 km para o oeste; distância 40 km", "deslocamento e distância iguais a 20 km", "deslocamento 40 km para o leste; distância 40 km"], certa: "B",
        dicas: [R`<p>Deslocamento: posição final − posição inicial (com sinal). Distância: soma dos caminhos.</p>`], resp: "B", sol: R`<p>Final em $+30 - 10 = +20$ km (leste); distância $30 + 10 = 40$ km. <b>E</b> confunde as duas coisas.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Um carro vai de A até B a 90 km/h e volta de B até A a 60 km/h, pela mesma estrada. Qual a rapidez média (distância total sobre tempo total) na viagem toda, em km/h?</p>`, num: { v: 72, un: "km/h" }, dicas: [R`<p>Não é a média aritmética! Chame a distância de $d$ e some os tempos.</p>`, R`<p>$v_m = \frac{2v_1v_2}{v_1 + v_2}$.</p>`], resp: "72 km/h", sol: R`<p>$\frac{2\cdot90\cdot60}{150} = 72$ km/h, menos que 75: o carro passa mais tempo no trecho lento.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Um trem anda metade do <b>tempo</b> de uma viagem a 80 km/h e a outra metade do tempo a 40 km/h. Qual a velocidade média?</p>`, num: { v: 60, un: "km/h" }, dicas: [R`<p>Chame o tempo total de $2\tau$ e calcule a distância.</p>`], resp: "60 km/h", sol: R`<p>$\frac{80\tau + 40\tau}{2\tau} = 60$. Com tempos iguais, a média é a aritmética; com distâncias iguais, a harmônica.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Num certo instante, um corpo tem velocidade escalar $v = -5$ m/s e aceleração escalar $a = +2$ m/s². O movimento nesse instante é:</p>`,
        alts: ["progressivo e acelerado", "progressivo e retardado", "retrógrado e acelerado", "retrógrado e retardado", "uniforme"], certa: "D", dicas: [R`<p>O sinal de $v$ diz o sentido; comparar os sinais de $v$ e $a$ diz se a rapidez aumenta ou diminui.</p>`], resp: "D", sol: R`<p>$v < 0$: retrógrado (contra a orientação da trajetória). $v$ e $a$ com sinais opostos: $|v|$ diminui, retardado. A pegadinha é achar que "aceleração positiva = acelerado".</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Um carro vai de 0 a 108 km/h em 10 s. Qual a aceleração escalar média, em m/s²?</p>`, num: { v: 3, un: "m/s²" }, dicas: [R`<p>Converta 108 km/h para m/s antes.</p>`], resp: "3 m/s²", sol: R`<p>$\frac{30 - 0}{10} = 3$ m/s². Quem esquece de converter acha 10,8 (em km/h por segundo, uma unidade estranha).</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Um corredor dá meia volta numa pista circular de raio 50 m em 20 s. Qual o módulo da velocidade vetorial média, em m/s?</p>`,
        fig: D.svg(560, 150, `<circle cx="280" cy="75" r="60" class="ln" style="stroke:var(--ink3)"/>` + D.seta(220, 75, 340, 75, "var(--warn)") + D.txt(280, 66, "Δr⃗", "txm") + `<path d="M340 75 A60 60 0 0 0 220 75" style="fill:none;stroke:var(--mA);stroke-width:3"/>` + D.txt(220, 100, "saída", "tx2") + D.txt(340, 100, "chegada", "tx2"), "pista"),
        num: { v: 5, un: "m/s" }, dicas: [R`<p>Deslocamento vetorial: da saída à chegada, em linha reta (o diâmetro) ${F.ret("F02")}.</p>`], resp: "5 m/s", sol: R`<p>$|\Delta\vec r| = 2R = 100$ m; $\frac{100}{20} = 5$ m/s. A rapidez média seria $\frac{\pi R}{20} \approx 7{,}85$ m/s: maior, porque o caminho é maior que o deslocamento.</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>Um carro faz o primeiro terço de uma estrada a 30 km/h e os dois terços restantes a 60 km/h. Qual a velocidade média?</p>`, num: { v: 45, un: "km/h" }, dicas: [R`<p>Estrada de comprimento $3L$; some os tempos.</p>`, R`<p>$T = \frac{L}{30} + \frac{2L}{60}$.</p>`], resp: "45 km/h", sol: R`<p>$T = \frac L{30} + \frac L{30} = \frac{L}{15}$, $v_m = \frac{3L}{L/15} = 45$ km/h. Note que os dois trechos levaram o mesmo tempo: por isso deu a média aritmética.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Um motorista quer fazer uma ida e volta com velocidade média de 60 km/h. Na ida, ele só conseguiu 40 km/h. Que velocidade ele precisa na volta?</p>`, num: { v: 120, un: "km/h" }, dicas: [R`<p>$\frac{2}{60} = \frac{1}{40} + \frac1v$.</p>`], resp: "120 km/h", sol: R`<p>$\frac1v = \frac1{30} - \frac1{40} = \frac1{120}$. Não é 80! O tempo perdido na ida custa caro.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>E se, no exercício anterior, a ida tivesse sido a 30 km/h? Que velocidade a volta precisaria ter para a média dar 60 km/h?</p>`,
        alts: ["90 km/h", "120 km/h", "180 km/h", "240 km/h", "nenhuma: é impossível"], certa: "E", dicas: [R`<p>Quanto tempo a ida (distância $d$ a 30 km/h) já gastou? E quanto tempo a viagem toda pode durar para a média ser 60?</p>`], resp: "E", sol: R`<p>A ida gastou $\frac{d}{30}$; a viagem toda, a 60 km/h de média, pode durar $\frac{2d}{60} = \frac d{30}$. O tempo já acabou: a volta teria que ser instantânea. Média harmônica nunca passa do dobro da menor velocidade (veja o chefão).</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Um ônibus faz a primeira metade do caminho a 60 km/h. Na segunda metade, anda metade do tempo a 40 km/h e metade a 20 km/h. Qual a velocidade média?</p>`, num: { v: 40, un: "km/h" }, dicas: [R`<p>Segunda metade: tempos iguais, média $\frac{40 + 20}2$.</p>`, R`<p>Depois, duas metades de caminho: média harmônica.</p>`], resp: "40 km/h", sol: R`<p>$\frac{2\cdot60\cdot30}{60 + 30} = 40$ km/h. É o exemplo de olimpíada com outros números.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>A posição de uma partícula é $s(t) = 2t^2 + 3$ (SI). Qual a velocidade instantânea em $t = 3$ s? (Use a definição de derivada ${F.ret("F04")}.)</p>`, num: { v: 12, un: "m/s" }, dicas: [R`<p>$v = \lim_{\Delta t\to0}\frac{s(3 + \Delta t) - s(3)}{\Delta t}$.</p>`, R`<p>$s(3 + \Delta t) - s(3) = 12\Delta t + 2\Delta t^2$.</p>`], resp: "12 m/s", sol: R`<p>$\frac{12\Delta t + 2\Delta t^2}{\Delta t} = 12 + 2\Delta t \to 12$ m/s. Com a regra da potência: $v = 4t = 12$.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Mecânica · cinemática</div>
        <div class="q">Você vai de casa até a escola a 40 km/h e volta a 60 km/h. Sua velocidade média foi 50 km/h?</div>
        <p>Não: foi 48 km/h. E a velocidade vetorial média foi zero, porque você voltou para casa. A cinemática começa separando com cuidado as grandezas que no dia a dia a gente mistura: posição, deslocamento, distância, velocidade média, velocidade instantânea e aceleração.</p></div>`),

      F.secao("grandezas", "Posição, trajetória e deslocamento", R`
        <p>Para descrever um movimento num caminho conhecido (uma estrada, um trilho), escolhemos uma <b>origem</b> e um <b>sentido positivo</b> sobre a trajetória. A <b>posição</b> (ou espaço) $s$ é a medida, com sinal, da origem até o corpo, ao longo da trajetória. Os marcos de quilômetro de uma rodovia são exatamente isso.</p>
        ${F.formula(R`\Delta s = s_\text{final} - s_\text{inicial},\qquad d = \text{comprimento do caminho percorrido} \ge |\Delta s|`, "Deslocamento escalar e distância percorrida")}
        <p>O <b>deslocamento</b> $\Delta s$ só olha para o começo e o fim; pode ser negativo (andou contra o sentido positivo) ou zero (voltou ao início). A <b>distância percorrida</b> $d$ soma tudo o que foi andado, sempre positiva. Elas são iguais só quando o corpo não muda de sentido.</p>
        ${F.caixa("fisico", R`<p><b>O referencial importa</b> ${F.ret("F01")}: posição, deslocamento e velocidade dependem de quem mede. O passageiro sentado no ônibus tem velocidade zero em relação ao ônibus e 80 km/h em relação à estrada. Sempre que fizer uma conta de cinemática, saiba em relação a quê.</p>`)}
        <div id="lab-vv"></div>`),

      F.secao("velocidade", "Velocidade média e velocidade instantânea", R`
        ${F.formula(R`v_m = \frac{\Delta s}{\Delta t}\qquad\qquad v = \lim_{\Delta t\to0}\frac{\Delta s}{\Delta t} = \frac{ds}{dt}`, "Velocidade escalar média e instantânea")}
        <p>A <b>velocidade média</b> é o quanto a posição mudou por unidade de tempo, no intervalo todo. A <b>instantânea</b> é a média num intervalo cada vez menor: a derivada da posição ${F.ret("F04")}. É ela que o velocímetro mostra.</p>
        <p>Em física, cuidado com as palavras: a <b>velocidade escalar média</b> $\Delta s/\Delta t$ usa o deslocamento (pode ser zero numa ida e volta); a <b>rapidez média</b> $d/\Delta t$ usa a distância. Muitos livros de ensino médio chamam as duas de "velocidade média"; o enunciado sempre deixa claro qual ele quer pelo contexto.</p>
        ${F.formula(R`1\ \tfrac{\text{m}}{\text{s}} = 3{,}6\ \tfrac{\text{km}}{\text{h}}`, "Conversão de unidades")}
        <h3>Teorema 1: tempos iguais → média aritmética</h3>
        ${F.demo("demonstração", R`<p>(i) Dois trechos com a mesma duração $\tau$ e velocidades $v_1$ e $v_2$. Distâncias: $v_1\tau$ e $v_2\tau$.</p>
          <p>(ii) $v_m = \frac{v_1\tau + v_2\tau}{2\tau} = \frac{v_1 + v_2}{2}$. $\blacksquare$</p>`)}
        <h3>Teorema 2: distâncias iguais → média harmônica</h3>
        ${F.demo("demonstração", R`<p>(i) Dois trechos de mesmo comprimento $L$. Tempos: $\frac{L}{v_1}$ e $\frac{L}{v_2}$.</p>
          <p>(ii) $v_m = \frac{2L}{\frac L{v_1} + \frac L{v_2}} = \frac{2}{\frac1{v_1} + \frac1{v_2}} = \frac{2v_1v_2}{v_1 + v_2}$. $\blacksquare$</p>`)}
        <h3>Teorema 3: a média harmônica nunca passa da aritmética</h3>
        ${F.demo("demonstração", R`<p>(i) Queremos $\frac{2v_1v_2}{v_1 + v_2} \le \frac{v_1 + v_2}2$, com $v_1, v_2 > 0$.</p>
          <p>(ii) Multiplicando por $2(v_1 + v_2) > 0$: $4v_1v_2 \le (v_1 + v_2)^2 = v_1^2 + 2v_1v_2 + v_2^2$.</p>
          <p>(iii) Isso é o mesmo que $0 \le v_1^2 - 2v_1v_2 + v_2^2 = (v_1 - v_2)^2$, verdade sempre. A igualdade só vale com $v_1 = v_2$. $\blacksquare$</p>
          <p>Interpretação: com distâncias iguais, você passa <b>mais tempo</b> no trecho lento, e ele pesa mais na média.</p>`)}
        ${F.caixa("pegadinha", R`<p><b>Média de velocidades não é velocidade média.</b> Só some e divida por 2 quando os <b>tempos</b> forem iguais. Quando os <b>caminhos</b> forem iguais, use a harmônica. Na dúvida, sempre volte para a definição: distância total sobre tempo total.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>A média nunca passa do dobro da menor velocidade</b> (com dois trechos de mesmo caminho): $\frac{2v_1v_2}{v_1 + v_2} < \frac{2v_1v_2}{v_2} = 2v_1$. Por isso, se a ida foi a 30 km/h, nenhuma volta deixa a média em 60 (exercício 10).</p>`)}`),

      F.secao("aceleracao", "Aceleração e classificação dos movimentos", R`
        ${F.formula(R`a_m = \frac{\Delta v}{\Delta t}\qquad\qquad a = \frac{dv}{dt} = \frac{d^2s}{dt^2}`, "Aceleração escalar média e instantânea")}
        <p>A aceleração mede o quanto a velocidade muda por segundo; a unidade é (m/s)/s $=$ m/s². Com os sinais de $v$ e $a$, o movimento é classificado assim:</p>
        <table class="tb"><tr><th></th><th>$v > 0$</th><th>$v < 0$</th></tr>
          <tr><td>$a > 0$</td><td>progressivo e acelerado</td><td>retrógrado e <b>retardado</b></td></tr>
          <tr><td>$a < 0$</td><td>progressivo e <b>retardado</b></td><td>retrógrado e acelerado</td></tr></table>
        <h3>Teorema 4: acelerado ⇔ $v$ e $a$ com o mesmo sinal</h3>
        ${F.demo("demonstração", R`<p>(i) Acelerado significa que a rapidez $|v|$ aumenta, isto é, que $v^2$ aumenta.</p>
          <p>(ii) Pela regra da cadeia ${F.ret("F04")}: $\frac{d}{dt}(v^2) = 2v\frac{dv}{dt} = 2va$.</p>
          <p>(iii) Então $v^2$ cresce se $va > 0$ (mesmo sinal) e diminui se $va < 0$. $\blacksquare$</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, posição, velocidade e aceleração são vetores ${F.ret("F02")}: $\vec v = \frac{d\vec r}{dt}$, $\vec a = \frac{d\vec v}{dt}$. A aceleração pode ser perpendicular à velocidade (curva com rapidez constante, ${F.ret("A07")}). A classificação acima é o caso de uma trajetória dada, em que só importa a componente da aceleração ao longo do caminho (a aceleração tangencial).</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-vv"); e.outerHTML = F.lab("Vai e volta: deslocamento × distância", "lab-vv"); SIM.vaiVolta(document.getElementById("lab-vv"), F); },
});
