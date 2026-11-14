/* O01 · Introdução à Ondulatória (escrito do zero, com as minhas palavras; o Halliday vol. 2 ainda não chegou). Conferido em Python:
   corda com T = 100 N, μ = 10 g/m: v = 100 m/s, λ = 2 m a 50 Hz; potência com A = 5 mm: 1,23 W; y = 0,03 sen(2πx − 10πt): λ = 1 m, f = 5 Hz, v = 5 m/s, v_máx = 0,942 m/s;
   som 343 m/s: λ(20 Hz) = 17,15 m, λ(20 kHz) = 1,715 cm; pulso numa corda pendurada de 4,9 m: t = 2√(L/g) = 1,41 s. */
F.registrar("O01", {
  retoma: ["A20", "CII08"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Lendo a equação de uma onda",
      casos: [
        { nome: "y = A sen(kx − ωt)", gerar: (p) => {
          const A = p ? 0.02 : F.escolha([0.01, 0.02, 0.05]), k = p ? 4 : F.escolha([2, 4, 5, 10]), w = p ? 20 : F.escolha([10, 20, 30, 50]);
          const lam = (2 * Math.PI) / k, f = w / (2 * Math.PI), v = w / k;
          return { enun: R`<p>Uma onda numa corda é $y(x, t) = ${F.n(A)}\sin(${k}x - ${w}t)$, em unidades do SI. Ache a amplitude, o comprimento de onda, a frequência, a velocidade e o sentido.</p>`, fig: "",
            passos: [
              R`<p>Compare com $y = A\sin(kx - \omega t)$: $A = ${F.n(A)}$ m, $k = ${k}$ rad/m, $\omega = ${w}$ rad/s.</p>`,
              R`<p>$\lambda = \frac{2\pi}{k} \approx ${F.n(lam, 3)}$ m e $f = \frac{\omega}{2\pi} \approx ${F.n(f, 3)}$ Hz.</p>`,
              R`<p>$v = \frac{\omega}{k} = ${F.n(v, 3)}$ m/s, no sentido de $+x$ (o sinal de menos entre $kx$ e $\omega t$ diz isso: a forma $f(x - vt)$ anda para a direita). Cada ponto da corda oscila com velocidade máxima $A\omega = ${F.n(A * w, 3)}$ m/s.</p>`,
            ] };
        } },
        { nome: "Velocidade numa corda", gerar: (p) => {
          const T = p ? 100 : F.escolha([50, 80, 100, 200]), mu = p ? 10 : F.escolha([5, 8, 10, 20]), f = p ? 50 : F.escolha([25, 50, 100]);
          const v = Math.sqrt(T / (mu / 1000));
          return { enun: R`<p>Uma corda com densidade linear de ${mu} g/m está esticada com ${T} N. Qual a velocidade das ondas nela? Qual o comprimento de onda para ${f} Hz?</p>`, fig: "",
            passos: [R`<p>$v = \sqrt{\frac{T}{\mu}} = \sqrt{\frac{${T}}{${F.n(mu / 1000)}}} \approx ${F.n(v, 1)}$ m/s.</p>`, R`<p>$\lambda = \frac{v}{f} \approx ${F.n(v / f, 3)}$ m.</p>`, R`<p>A velocidade depende <b>só da corda</b> (tração e densidade), não da frequência nem da amplitude. Quem escolhe a frequência é a fonte; $\lambda$ se ajusta.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "De onde vem v = √(T/μ)",
      enun: R`<p>Uma corda de densidade $\mu$ está esticada com tração $T$ e tem um deslocamento pequeno $y(x, t)$. (a) Aplique a 2ª lei de Newton num pedacinho de comprimento $dx$ e mostre que $\frac{\partial^2 y}{\partial t^2} = \frac{T}{\mu}\frac{\partial^2 y}{\partial x^2}$. (b) Mostre que qualquer $y = f(x - vt)$ é solução se $v = \sqrt{T/\mu}$. (c) Num referencial que anda junto com um pulso, a corda parece deslizar para trás com velocidade $v$ por uma "lombada" fixa. Use a força centrípeta no topo da lombada (raio de curvatura $R$) para achar $v$ de outro jeito, sem equação diferencial.</p>`,
      fig: "",
      dicas: [R`<p>(a) As trações nas duas pontas do pedacinho têm a mesma intensidade $T$, mas inclinações diferentes; a força vertical é $T\left[\frac{\partial y}{\partial x}\right]_{x+dx} - T\left[\frac{\partial y}{\partial x}\right]_x$.</p>`, R`<p>(c) No topo, um pedacinho de comprimento $\Delta l$ sente uma força para baixo $\approx T\Delta l/R$ (a tração "puxa para dentro" da curva).</p>`],
      sol: R`<p><b>(a)</b> Força vertical: $T\left(\frac{\partial y}{\partial x}\Big|_{x+dx} - \frac{\partial y}{\partial x}\Big|_x\right) = T\frac{\partial^2 y}{\partial x^2}dx$. Massa: $\mu\,dx$. Newton: $\mu\,dx\,\frac{\partial^2y}{\partial t^2} = T\frac{\partial^2y}{\partial x^2}dx$. Dividindo: a equação de onda, com $v^2 = T/\mu$ ${F.ret("U05")}.</p>
        <p><b>(b)</b> Com $u = x - vt$: $\partial_t^2 f = v^2f''$ e $\partial_x^2 f = f''$. A equação vira $v^2f'' = \frac T\mu f''$: vale para qualquer forma $f$ se $v^2 = T/\mu$. O pulso viaja <b>sem mudar de forma</b>.</p>
        <p><b>(c)</b> No topo da lombada, o pedacinho $\Delta l$ de massa $\mu\Delta l$ faz uma curva de raio $R$ com velocidade $v$: precisa de força centrípeta $\frac{\mu\Delta l\,v^2}{R}$. Quem fornece é a tração: $\frac{T\Delta l}{R}$ (dois puxões de intensidade $T$ fazendo um pequeno ângulo $\Delta l/R$). Igualando: $\mu v^2 = T$, $v = \sqrt{T/\mu}$, e o raio $R$ sumiu: qualquer forma de pulso anda com a mesma velocidade. Essa é a dedução preferida das olimpíadas russas.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Ondas · introdução</div>
        <div class="q">O que viaja numa onda, se a água não vai a lugar nenhum?</div>
        <p>Uma rolha boiando sobe e desce quando passa uma onda, mas não é levada para a praia. O que viaja é uma <b>perturbação</b>: um formato, carregando energia e momento, sem transportar matéria. Som, luz, terremotos, a "ola" no estádio e o elétron da mecânica quântica ${F.ret("C17")} são todos ondas. A boa notícia: a matemática é a mesma para todos.</p></div>`),

      F.secao("tipos", "Tipos de onda e as grandezas", R`
        <ul><li><b>Mecânicas</b> precisam de um meio (corda, ar, água, rocha). <b>Eletromagnéticas</b> não: viajam no vácuo ${F.ret("C15d")}.</li>
          <li><b>Transversais</b>: o meio vibra perpendicular à propagação (corda, luz). <b>Longitudinais</b>: vibra na mesma direção (som no ar, uma mola sendo comprimida). Ondas na água são uma mistura: as partículas andam em círculos.</li></ul>
        ${F.formula(R`y(x, t) = A\sin(kx - \omega t)\qquad k = \frac{2\pi}{\lambda}\qquad \omega = 2\pi f = \frac{2\pi}{T}\qquad v = \lambda f = \frac{\omega}{k}`, "Onda harmônica viajando para +x")}
        <p>$A$ é a amplitude; $\lambda$, o comprimento de onda (distância entre duas cristas); $T$, o período; $f$, a frequência; $k$, o número de onda. A relação $v = \lambda f$ é só "anda um $\lambda$ a cada período". Cada ponto do meio faz um MHS ${F.ret("A20")} com a mesma frequência da fonte.</p>
        <div id="lab-oc"></div>
        ${F.caixa("pegadinha", R`<p><b>Velocidade da onda ≠ velocidade do meio.</b> A onda anda com $v = \lambda f$ (constante); cada pedacinho da corda oscila com velocidade $\partial y/\partial t$, que varia de 0 a $A\omega$. E a velocidade da onda depende <b>do meio</b>, não da fonte: tocar uma nota mais aguda no violão não faz a onda correr mais, só encurta $\lambda$.</p>`)}`),

      F.secao("corda", "Velocidade, reflexão e energia", R`
        ${F.formula(R`v = \sqrt{\frac{T}{\mu}}\ \text{(corda)}\qquad v = \sqrt{\frac{B}{\rho}}\ \text{(som num fluido)}\qquad P = \tfrac12\mu v\,\omega^2A^2`, "Velocidade e potência")}
        <p>Padrão geral: $v = \sqrt{\text{"rigidez"}/\text{"inércia"}}$. Corda mais esticada (mais $T$) ou mais leve (menos $\mu$): onda mais rápida. No ar, a "rigidez" é o módulo de compressibilidade $B$ e a inércia é a densidade.</p>
        <p><b>Reflexão</b>: numa ponta presa, a corda não pode se mexer; o pulso volta <b>invertido</b> (a parede puxa para o lado contrário). Numa ponta solta (anel num poste liso), volta <b>sem inverter</b>. Na emenda de duas cordas, parte reflete e parte passa: da leve para a pesada, o refletido inverte (como a luz refletindo no vidro, com $r = \frac{n_1 - n_2}{n_1 + n_2} < 0$ ${F.ret("U05")}).</p>
        <p><b>Energia</b>: a potência transportada cresce com $A^2$ e $\omega^2$. Dobrar a amplitude quadruplica a potência. Exemplo: $\mu = 10$ g/m, $v = 100$ m/s, $f = 50$ Hz, $A = 5$ mm: $P \approx 1{,}23$ W.</p>
        ${F.caixa("fisico", R`<p><b>Equação de onda</b>: $\frac{\partial^2y}{\partial t^2} = v^2\frac{\partial^2y}{\partial x^2}$. Ela é <b>linear</b>: a soma de duas soluções é solução. Esse é o princípio da superposição, a base de toda a interferência (O02) e das ondas estacionárias (O03).</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Uma corda de 10 g/m está esticada com 100 N. Qual a velocidade das ondas e o comprimento de onda para 50 Hz?</p>`, fig: "", dicas: [R`<p>$v = \sqrt{T/\mu}$, com $\mu$ em kg/m.</p>`, R`<p>$\lambda = v/f$.</p>`], resp: R`100 m/s; 2 m.`, sol: R`<p>$\sqrt{100/0{,}01} = 100$ m/s.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Uma onda é $y = 0{,}03\sin(2\pi x - 10\pi t)$ (SI). Ache $\lambda$, $f$, $v$ e a velocidade máxima de um ponto da corda.</p>`, fig: "", dicas: [R`<p>$k = 2\pi$ e $\omega = 10\pi$.</p>`, R`<p>Velocidade máxima de um ponto: $A\omega$.</p>`], resp: R`$\lambda = 1$ m, $f = 5$ Hz, $v = 5$ m/s, $v_\text{máx} \approx 0{,}94$ m/s.`, sol: R`<p>$0{,}03\times10\pi \approx 0{,}942$ m/s, bem menor que a velocidade da onda (5 m/s).</p>` }),
        F.exercicio({ n: 3, enun: R`<p>O ouvido humano escuta de 20 Hz a 20 kHz. Quais os comprimentos de onda correspondentes no ar (343 m/s)?</p>`, fig: "", dicas: [R`<p>$\lambda = v/f$.</p>`, R`<p>Cuidado com o k de kHz.</p>`], resp: R`17,15 m e 1,715 cm.`, sol: R`<p>Por isso o grave contorna paredes e prédios (λ do tamanho deles) e o agudo não: o som do vizinho chega abafado, só com os graves.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Um pulso "para cima" chega à ponta de uma corda. Desenhe o pulso refletido se a ponta estiver (a) presa num prego; (b) num anel que desliza sem atrito num poste.</p>`, fig: "", dicas: [R`<p>Na ponta presa, o deslocamento é sempre zero: some o pulso com uma "imagem" invertida.</p>`, R`<p>Na ponta solta, a inclinação é zero: a imagem não é invertida.</p>`], resp: R`(a) volta para baixo (invertido); (b) volta para cima.`, sol: R`<p>No laboratório, modo "pulso", veja os dois casos. Na ponta solta, o anel sobe até o <b>dobro</b> da altura do pulso no instante da reflexão.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma corda transmite 1,23 W com uma onda de 5 mm de amplitude. Que potência ela transmite com 10 mm, mesma frequência? E com 5 mm e o dobro da frequência?</p>`, fig: "", dicas: [R`<p>$P \propto A^2\omega^2$.</p>`, R`<p>Dobrar qualquer um dos dois multiplica por 4.</p>`], resp: R`$\approx 4{,}9$ W nos dois casos.`, sol: R`<p>Por isso ondas de alta frequência (como o ultrassom) carregam muita energia com amplitudes minúsculas.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Mostre que $y = f(x + vt)$ também satisfaz a equação de onda. Para que lado ela anda? E $y = A\sin(kx)\cos(\omega t)$, com $\omega = vk$, é solução? Ela anda?</p>`, fig: "", dicas: [R`<p>Regra da cadeia com $u = x + vt$.</p>`, R`<p>Derive $\sin(kx)\cos(\omega t)$ duas vezes em cada variável.</p>`], resp: R`$f(x + vt)$ anda para $-x$. $\sin kx\cos\omega t$ é solução e <b>não anda</b>: é uma onda estacionária.`, sol: R`<p>$\partial_t^2 = -\omega^2(\cdot)$ e $v^2\partial_x^2 = -v^2k^2(\cdot)$: iguais se $\omega = vk$. Ela é a soma de duas viajantes em sentidos opostos (O03).</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Uma corda uniforme de 4,9 m está pendurada pelo topo, solta embaixo. Mostre que a velocidade de um pulso a uma altura $y$ acima da ponta de baixo é $\sqrt{gy}$ e calcule o tempo para um pulso subir da ponta de baixo até o topo.</p>`, fig: "", dicas: [R`<p>A tração a uma altura $y$ sustenta o pedaço de baixo: $T = \mu gy$.</p>`, R`<p>$dt = dy/\sqrt{gy}$; integre de 0 a $L$.</p>`], resp: R`$t = 2\sqrt{L/g} \approx 1{,}41$ s.`, sol: R`<p>$\int_0^L\frac{dy}{\sqrt{gy}} = \frac{2\sqrt L}{\sqrt g}$. Curiosidade: não depende de $\mu$ (a massa cancela), e é o mesmo tempo de queda livre de uma altura $2L$.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-oc"); e.outerHTML = F.lab("A onda numa corda", "lab-oc"); SIM.ondaCorda(document.getElementById("lab-oc"), F); },
});
