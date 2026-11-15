/* O10b · Óptica ondulatória: interferência e difração (base: Halliday vol. 4, caps. 35 e 36, com as minhas palavras).
   Conferido em Python (scratchpad opt.py): Young 600 nm, d = 0,25 mm, D = 2 m → 4,8 mm; fenda de 0,1 mm → 1º mínimo 0,344°, máximo central 24 mm a 2 m;
   rede 600 linhas/mm com 500 nm → 17,5°, 3 ordens; antirreflexo n = 1,38 para 550 nm → 99,6 nm; Rayleigh olho (4 mm) → 0,58′; Hubble (2,4 m) → 2,8 × 10⁻⁷ rad;
   sabão n = 1,33 com 624 nm: espessuras construtivas 117 e 352 nm; CD (1,6 μm) com 780 nm → 29,2°. */
F.registrar("O10b", {
  retoma: ["O08", "C15d"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Interferência e difração nos números",
      casos: [
        { nome: "Young: espaço entre franjas", gerar: (p) => {
          const lam = p ? 600 : F.escolha([450, 500, 550, 600, 650]), d = p ? 0.25 : F.escolha([0.1, 0.2, 0.25, 0.5]), D = p ? 2 : F.escolha([1, 1.5, 2, 3]);
          const dy = (lam * 1e-9 * D) / (d * 1e-3);
          return { enun: R`<p>Luz de ${lam} nm passa por duas fendas separadas por $d = ${F.n(d)}$ mm. Qual o espaço entre franjas claras numa tela a ${F.n(D)} m?</p>`, fig: "",
            passos: [
              R`<p>Franja clara de ordem $m$: diferença de caminho $d\operatorname{sen}\theta = m\lambda$. Para ângulos pequenos, $\operatorname{sen}\theta \approx \operatorname{tg}\theta = \frac yD$, então $y_m = \frac{m\lambda D}{d}$.</p>`,
              R`<p>Entre duas vizinhas: $\Delta y = \frac{\lambda D}{d} = \frac{${lam}\times10^{-9}\cdot${F.n(D)}}{${F.n(d)}\times10^{-3}} = ${F.n(dy * 1000, 2)}$ mm.</p>`,
              R`<p>Leitura: $\lambda$ é minúsculo, mas $\frac Dd$ é enorme (${F.n(D / (d * 1e-3), 0)} vezes): a montagem "amplifica" o comprimento de onda até milímetros. Foi assim que Young mediu $\lambda$ da luz em 1801.</p>`,
            ] };
        } },
        { nome: "Filme fino (antirreflexo)", gerar: (p) => {
          const lam = p ? 550 : F.escolha([500, 550, 600]), n = p ? 1.38 : F.escolha([1.25, 1.38, 1.45]);
          return { enun: R`<p>Uma lente de vidro ($n = 1{,}5$) recebe uma película de $n = ${F.n(n)}$ para não refletir luz de ${lam} nm (incidência normal). Qual a menor espessura?</p>`, fig: "",
            passos: [
              R`<p>Há reflexão nas duas faces da película. As duas vão de um meio menos refringente para um mais ($1 \to ${F.n(n)}$ e $${F.n(n)} \to 1{,}5$): as duas ganham meia onda de atraso, e esses atrasos se cancelam.</p>`,
              R`<p>Sobra só o caminho extra, $2t$ dentro da película, onde o comprimento de onda é $\lambda/n$. Para cancelar: $2t = \frac12\cdot\frac{\lambda}{n}$.</p>`,
              R`<p>$t = \frac{\lambda}{4n} = \frac{${lam}}{4\cdot${F.n(n)}} \approx ${F.n(lam / (4 * n), 1)}$ nm (a "camada de um quarto de onda"). Lentes de óculos e de câmera têm isso; o reflexo arroxeado que sobra vem das cores das pontas do espectro, que não cancelam bem.</p>`,
            ] };
        } },
        { nome: "Rede de difração", gerar: (p) => {
          const N = p ? 600 : F.escolha([300, 500, 600, 1000]), lam = p ? 500 : F.escolha([450, 500, 589, 650]);
          const d = 1e-3 / N, s = (lam * 1e-9) / d, mmax = Math.floor(1 / s);
          return { enun: R`<p>Uma rede tem ${N} linhas por milímetro. Em que ângulo aparece a 1ª ordem para luz de ${lam} nm? Quantas ordens existem?</p>`, fig: "",
            passos: [
              R`<p>Espaçamento: $d = \frac{1\text{ mm}}{${N}} = ${F.n(d * 1e6, 3)}$ μm. Máximos: $d\operatorname{sen}\theta = m\lambda$.</p>`,
              R`<p>1ª ordem: $\operatorname{sen}\theta_1 = \frac{\lambda}{d} = ${F.n(s, 4)} \Rightarrow \theta_1 \approx ${F.n((Math.asin(s) * 180) / Math.PI, 1)}°$.</p>`,
              R`<p>Como $\operatorname{sen}\theta \leq 1$, $m \leq \frac d\lambda = ${F.n(1 / s, 2)}$: ordens $m = 0, \pm1, \dots, \pm${mmax}$. Cada cor sai num ângulo diferente: é um espectrômetro.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "N fendas: somando fasores com a fórmula de Euler",
      enun: R`<p>Luz monocromática atravessa $N$ fendas estreitas igualmente espaçadas (distância $d$). Na direção $\theta$, a onda de cada fenda chega atrasada de uma fase $\varphi = \frac{2\pi d\operatorname{sen}\theta}{\lambda}$ em relação à anterior.</p><p>(a) Usando $E_k \propto e^{ik\varphi}$ e a soma de uma PG ${F.ret("matematica/CII03")}, mostre que a intensidade é $I = I_1\left(\frac{\operatorname{sen}(N\varphi/2)}{\operatorname{sen}(\varphi/2)}\right)^2$. (b) Mostre que os máximos principais têm intensidade $N^2I_1$ e que, entre dois deles, há $N - 1$ zeros. (c) Por que mais fendas dão linhas mais finas, e o que isso tem a ver com o poder de resolução de uma rede?</p>`,
      fig: "",
      dicas: [R`<p>(a) $\sum_{k=0}^{N-1}e^{ik\varphi} = \frac{1 - e^{iN\varphi}}{1 - e^{i\varphi}}$. Coloque $e^{iN\varphi/2}$ em evidência em cima e $e^{i\varphi/2}$ embaixo: $1 - e^{ix} = -2i\,e^{ix/2}\operatorname{sen}\frac x2$.</p>`, R`<p>(b) Quando $\varphi \to 2\pi m$, use L'Hôpital (ou $\operatorname{sen}u \approx u$). Zeros: $N\varphi/2 = j\pi$ com $\varphi/2$ não múltiplo de $\pi$.</p>`],
      sol: R`<p><b>(a)</b> $S = \frac{1 - e^{iN\varphi}}{1 - e^{i\varphi}} = \frac{e^{iN\varphi/2}}{e^{i\varphi/2}}\cdot\frac{\operatorname{sen}(N\varphi/2)}{\operatorname{sen}(\varphi/2)}$. O primeiro fator tem módulo 1. A intensidade é $|S|^2$ vezes a de uma fenda ∎.</p>
        <p><b>(b)</b> Em $\varphi = 2\pi m$ todas as ondas chegam em fase: $|S| = N$, intensidade $N^2I_1$ (a energia não some: ela se concentra). Zeros quando $\frac{N\varphi}{2} = j\pi$, $j = 1, \dots, N - 1$ entre dois máximos principais.</p>
        <p><b>(c)</b> O primeiro zero ao lado de um máximo está a $\Delta\varphi = \frac{2\pi}{N}$: a largura das linhas cai como $\frac1N$. Duas cores $\lambda$ e $\lambda + \Delta\lambda$ se separam na ordem $m$ se $\frac{\lambda}{\Delta\lambda} \leq mN$ (poder de resolução). Uma rede de 10 000 fendas na 1ª ordem separa as duas linhas amarelas do sódio (589,0 e 589,6 nm), que precisam de $\frac{589}{0{,}6} \approx 1000$. No laboratório de fendas, compare N = 2 e N = 10.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Óptica · ondulatória</div>
        <div class="q">Luz + luz pode dar escuridão?</div>
        <p>Pode, se as duas ondas chegarem com crista encontrando vale. Essa é a prova de que a luz é onda (Young, 1801), e é o que pinta a bolha de sabão, o CD e as asas de algumas borboletas. A óptica geométrica (raios) é o limite em que os obstáculos são muito maiores que $\lambda$; aqui, olhamos o que acontece quando não são.</p></div>`),

      F.secao("young", "Interferência: o experimento de Young", R`
        <p>Duas fendas estreitas, iluminadas pela mesma fonte, viram duas fontes <b>coerentes</b> (mesma frequência, fase fixa entre elas). Num ponto da tela, a diferença de caminho decide tudo:</p>
        ${F.formula(R`d\operatorname{sen}\theta = m\lambda\ \ \text{(clara)}\qquad d\operatorname{sen}\theta = \left(m + \tfrac12\right)\lambda\ \ \text{(escura)}\qquad I = 4I_0\cos^2\!\left(\frac{\pi d\operatorname{sen}\theta}{\lambda}\right)`, "Duas fendas")}
        ${F.demo("a intensidade cos²", R`<p>(i) As duas ondas chegam com amplitudes iguais $E_0$ e diferença de fase $\varphi = \frac{2\pi}{\lambda}d\operatorname{sen}\theta$.</p>
          <p>(ii) Somando: $E_0\operatorname{sen}\omega t + E_0\operatorname{sen}(\omega t + \varphi) = 2E_0\cos\frac\varphi2\operatorname{sen}\left(\omega t + \frac\varphi2\right)$ (soma de senos).</p>
          <p>(iii) A amplitude resultante é $2E_0\cos\frac\varphi2$, e a intensidade (proporcional ao quadrado) é $4I_0\cos^2\frac\varphi2$ ∎. Nas franjas claras, 4 vezes a de uma fenda; nas escuras, zero. A média é $2I_0$: a energia só foi redistribuída.</p>`)}
        ${F.caixa("fisico", R`<p><b>Por que duas lanternas não fazem franjas?</b> Porque a luz comum é emitida em "trens" de onda curtos (de nanossegundos), com fases aleatórias. As franjas mudariam de lugar bilhões de vezes por segundo e se borrariam. A fenda dupla funciona porque as duas metades vêm do <b>mesmo</b> trem de onda; o laser funciona melhor porque os trens são enormes (alta coerência).</p>`)}
        <div id="lab-fen"></div>`),

      F.secao("filmes", "Filmes finos", R`
        <p>Numa película fina, a luz reflete na face de cima e na de baixo, e as duas reflexões interferem. Duas regras:</p>
        <ol><li>Dentro do filme, o comprimento de onda é $\lambda/n$, e a onda de baixo anda $2t$ a mais (incidência normal).</li>
          <li>Refletir num meio <b>mais</b> refringente inverte a onda (atraso de meia onda); num menos refringente, não.</li></ol>
        <p>Bolha de sabão no ar: só a reflexão de cima inverte. Então o filme reflete forte quando $2nt = \left(m + \frac12\right)\lambda$, e cancela quando $2nt = m\lambda$. Cada espessura reforça cores diferentes: daí os anéis coloridos, que vão mudando conforme o sabão escorre e o filme afina. Quando ele fica muito mais fino que $\lambda$, todas as cores cancelam (a "mancha preta" logo antes de a bolha estourar).</p>
        <div id="lab-fil"></div>
        <p>O <b>interferômetro de Michelson</b> divide um feixe em dois braços e os junta de volta: um deslocamento de espelho de $\frac\lambda2$ desloca uma franja inteira. O LIGO, com braços de 4 km, mede variações de comprimento de $10^{-18}$ m e detectou ondas gravitacionais em 2015.</p>`),

      F.secao("difracao", "Difração", R`
        <p>Uma onda que passa por uma abertura se espalha. Numa fenda de largura $a$, cada ponto da fenda é uma fonte (Huygens), e elas interferem entre si:</p>
        ${F.formula(R`a\operatorname{sen}\theta = m\lambda\ \ (m = \pm1, \pm2, \dots)\ \text{(mínimos)}\qquad I = I_\text{máx}\left(\frac{\operatorname{sen}\beta}{\beta}\right)^2,\ \ \beta = \frac{\pi a\operatorname{sen}\theta}{\lambda}`, "Fenda simples")}
        ${F.demo("o primeiro mínimo, por pares", R`<p>(i) Divida a fenda em duas metades. Pegue um ponto da metade de cima e o ponto correspondente da metade de baixo, a uma distância $\frac a2$.</p>
          <p>(ii) Se $\frac a2\operatorname{sen}\theta = \frac\lambda2$, esses dois raios chegam em oposição de fase e se cancelam. O mesmo vale para <b>todos</b> os pares.</p>
          <p>(iii) Logo, em $a\operatorname{sen}\theta = \lambda$ a tela fica escura ∎. Repare no paradoxo: quanto <b>mais estreita</b> a fenda, <b>mais larga</b> a mancha central ($\theta \approx \lambda/a$). É o mesmo espírito do princípio da incerteza: confinar a onda numa direção a espalha nessa direção.</p>`)}
        <p><b>Abertura circular</b> (lentes, pupila, telescópios): o primeiro mínimo fica em $\operatorname{sen}\theta = 1{,}22\frac\lambda D$. Duas estrelas só são distinguíveis se estiverem separadas pelo menos por esse ângulo (<b>critério de Rayleigh</b>). Por isso telescópios são grandes: o Hubble (2,4 m) separa $2{,}8\times10^{-7}$ rad; o olho (pupila de 4 mm), uns $0{,}6$ minuto de arco.</p>
        <p><b>Rede de difração</b> (milhares de fendas): máximos finíssimos em $d\operatorname{sen}\theta = m\lambda$. É o coração do espectroscópio, que lê a composição das estrelas pelas linhas espectrais. As trilhas de um CD (1,6 μm) formam uma rede: daí o arco-íris quando ele reflete a luz. Com raios X e átomos de um cristal como "fendas", vira a <b>lei de Bragg</b>, $2d\operatorname{sen}\theta = m\lambda$, que revelou a estrutura do DNA.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Num experimento de Young com $d = 0{,}25$ mm e tela a 2 m, as franjas claras estão separadas por 4,8 mm. Qual o comprimento de onda?</p>`, fig: "", dicas: [R`<p>$\Delta y = \frac{\lambda D}d$.</p>`, R`<p>$\lambda = \frac{\Delta y\,d}{D}$.</p>`], resp: R`$\lambda = 600$ nm (laranja).`, sol: R`<p>$\frac{4{,}8\times10^{-3}\cdot0{,}25\times10^{-3}}{2} = 6{,}0\times10^{-7}$ m.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>O experimento de Young é feito dentro da água ($n = 1{,}33$). O que acontece com o espaço entre as franjas?</p>`, fig: "", dicas: [R`<p>Que $\lambda$ entra na fórmula?</p>`, R`<p>Na água, $\lambda' = \lambda/n$.</p>`], resp: R`Diminui pelo fator 1,33.`, sol: R`<p>As franjas ficam mais juntas porque o comprimento de onda no meio é menor. A frequência (e a cor que um olho dentro d'água veria) não muda.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Luz de 600 nm passa por uma fenda de 0,1 mm. Qual o ângulo do primeiro mínimo? Qual a largura da mancha central numa tela a 2 m?</p>`, fig: "", dicas: [R`<p>$\operatorname{sen}\theta = \lambda/a$.</p>`, R`<p>Largura $\approx 2D\theta$.</p>`], resp: R`$\theta \approx 0{,}34°$; largura $\approx 24$ mm.`, sol: R`<p>$\theta = 6\times10^{-3}$ rad; $2\times2\times0{,}006 = 0{,}024$ m. Abra a fenda para 1 mm e a mancha encolhe para 2,4 mm.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Uma película de sabão ($n = 1{,}33$), no ar, é iluminada com luz de 624 nm. Quais as duas menores espessuras que dão reflexão máxima?</p>`, fig: "", dicas: [R`<p>Só uma reflexão inverte: máximo em $2nt = \left(m + \frac12\right)\lambda$.</p>`, R`<p>$t = \frac{(m + 1/2)\lambda}{2n}$.</p>`], resp: R`$\approx 117$ nm e $\approx 352$ nm.`, sol: R`<p>$m = 0$: $\frac{312}{2{,}66} \approx 117$ nm; $m = 1$: $\frac{936}{2{,}66} \approx 352$ nm. (Problema do mesmo tipo do 35-37 do Halliday.)</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma rede de 600 linhas/mm com luz de 500 nm. Em que ângulos aparecem as ordens 1 e 2? Existe a 4ª ordem?</p>`, fig: "", dicas: [R`<p>$d = 1{,}667$ μm.</p>`, R`<p>$\operatorname{sen}\theta_m = m\lambda/d$.</p>`], resp: R`$17{,}5°$ e $36{,}9°$; a 4ª não existe ($\operatorname{sen}\theta$ daria 1,2).`, sol: R`<p>$\operatorname{sen}\theta_1 = 0{,}30$, $\operatorname{sen}\theta_2 = 0{,}60$, $\operatorname{sen}\theta_3 = 0{,}90$ ($64{,}2°$), $\operatorname{sen}\theta_4 = 1{,}2$: impossível.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Qual a menor separação angular que o olho humano (pupila de 4 mm, $\lambda = 550$ nm) consegue resolver? A que distância máxima você distingue os dois faróis de um carro (1,5 m entre eles)?</p>`, fig: "", dicas: [R`<p>Rayleigh: $\theta = 1{,}22\lambda/D$.</p>`, R`<p>$L = \frac{1{,}5}{\theta}$.</p>`], resp: R`$\theta \approx 1{,}7\times10^{-4}$ rad ($\approx 0{,}6'$); $L \approx 9$ km.`, sol: R`<p>$\frac{1{,}5}{1{,}68\times10^{-4}} \approx 8{,}9$ km. Na prática é menos (a retina e a atmosfera também limitam), mas a ordem de grandeza é essa.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Numa fenda dupla, $d = 5a$ (a distância entre as fendas é 5 vezes a largura de cada uma). Quantas franjas claras cabem dentro do máximo central de difração? Confira no laboratório (a = 20 μm, d = 100 μm).</p>`, fig: "", dicas: [R`<p>O máximo central de difração vai até $a\operatorname{sen}\theta = \lambda$.</p>`, R`<p>As franjas claras estão em $d\operatorname{sen}\theta = m\lambda$; a de ordem 5 cai exatamente no mínimo de difração e some ("ordem ausente").</p>`], resp: R`9 franjas ($m = 0, \pm1, \dots, \pm4$).`, sol: R`<p>Dentro do central, $|d\operatorname{sen}\theta| < 5\lambda$, ou seja, $|m| < 5$. A $m = \pm5$ coincide com o zero da difração e desaparece. Em geral, com $d/a$ inteiro, são $2\frac da - 1$ franjas.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) {
    let e = document.getElementById("lab-fen"); e.outerHTML = F.lab("Fendas: Young, fenda simples e rede", "lab-fen"); SIM.fendas(document.getElementById("lab-fen"), F);
    e = document.getElementById("lab-fil"); e.outerHTML = F.lab("As cores de um filme de sabão", "lab-fil"); SIM.filme(document.getElementById("lab-fil"), F);
  },
});
