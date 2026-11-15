/* TE04 · Teorema de Stokes. Conferido em Python:
   (−y, x, 0) no círculo de raio R: 2πR²; (z, x, y): rot = (1, 1, 1), circulação no triângulo (1,0,0)→(0,1,0)→(0,0,1) = 3/2;
   (yz, xz, xy): rot = 0, potencial xyz, trabalho até (1,2,3) = 6; Faraday (R = 0,1 m, dB/dt = 0,5 T/s): E = 0,025 V/m;
   (z − y, xz, y): rot = (1 − x, 1, z + 1), circulação no círculo unitário = π = fluxo do rotacional por z = h(1 − x² − y²) para h = 0; 0,7; −1,2. */
F.registrar("matematica/TE04", {
  retoma: ["fisica/U01", "fisica/U02", "CE03", "TE02"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Circulação pelo atalho",
      casos: [
        { nome: "Rotação rígida", gerar: (p) => {
          const w = p ? 3 : F.escolha([1, 2, 3, 5]), r = p ? 0.2 : F.escolha([0.1, 0.2, 0.5, 1]);
          return { enun: R`<p>Um fluido gira como um corpo rígido com $\omega = ${w}$ rad/s: $\vec v = (-${F.c(w)}y,\ ${F.c(w)}x,\ 0)$. Qual a circulação num círculo horizontal de raio ${F.nt(r)} m em volta do eixo, e qual a vorticidade?</p>`, fig: "",
            passos: [
              R`<p>Rotacional ${F.ret("fisica/U01")}: $\nabla\times\vec v = (0, 0, ${2 * w})$, a <b>vorticidade</b>, que é o dobro de $\omega$.</p>`,
              R`<p>Stokes, com o disco como superfície: $\oint\vec v\cdot d\vec l = ${2 * w}\cdot\pi(${F.n(r)})^2 = ${F.n(2 * w * r * r)}\pi$.</p>`,
              R`<p>$\approx ${F.n(2 * Math.PI * w * r * r, 3)}$ m²/s. Direto: velocidade $\omega r$ vezes o perímetro $2\pi r$ dá o mesmo. ✓</p>`,
            ] };
        } },
        { nome: "Faraday na forma de Stokes", gerar: (p) => {
          const Rr = p ? 0.1 : F.escolha([0.05, 0.1, 0.2]), dB = p ? 0.5 : F.escolha([0.2, 0.5, 2]), r = p ? 0.1 : F.escolha([0.04, 0.1, 0.3]);
          const dentro = r <= Rr, E = dentro ? (r / 2) * dB : ((Rr * Rr) / (2 * r)) * dB;
          return { enun: R`<p>Um campo magnético uniforme ocupa um cilindro de raio ${F.nt(Rr)} m e cresce a ${F.nt(dB)} T/s. Qual o campo elétrico induzido a ${F.nt(r)} m do eixo?</p>`, fig: "",
            passos: [
              R`<p>Faraday diferencial: $\nabla\times\vec E = -\partial_t\vec B$ ${F.ret("fisica/U05")}. Stokes num círculo de raio $r$: $\oint\vec E\cdot d\vec l = -\frac{d}{dt}\iint\vec B\cdot d\vec A$.</p>`,
              R`<p>Por simetria, $E$ é tangente e de módulo constante no círculo: $E\cdot2\pi r = ${dentro ? R`\pi r^2\frac{dB}{dt}` : R`\pi R^2\frac{dB}{dt}`}$ (em módulo).</p>`,
              R`<p>$E = ${dentro ? R`\frac r2\frac{dB}{dt}` : R`\frac{R^2}{2r}\frac{dB}{dt}`} \approx ${F.n(E, 4)}$ V/m. ${dentro ? "Dentro do cilindro, cresce com r." : "Fora, há campo elétrico mesmo onde B = 0!"}</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Por que o chapéu não importa",
      enun: R`<p>(a) Sejam $S_1$ e $S_2$ duas superfícies com a mesma borda $C$, orientadas de forma compatível com o sentido de $C$. Use o teorema da divergência ${F.ret("TE02")} e a identidade $\nabla\cdot(\nabla\times\vec F) = 0$ para mostrar que $\iint_{S_1}(\nabla\times\vec F)\cdot d\vec A = \iint_{S_2}(\nabla\times\vec F)\cdot d\vec A$. (b) Para $\vec F = (z - y,\ xz,\ y)$, calcule a circulação no círculo unitário $x^2 + y^2 = 1$, $z = 0$ (sentido anti-horário visto de cima). (c) Calcule o fluxo de $\nabla\times\vec F$ pelo disco unitário e pelo hemisfério de cima. (d) No laboratório, a área do chapéu muda com $h$, mas o fluxo não. Explique por que, mesmo assim, o rotacional que atravessa cada pedacinho muda.</p>`,
      fig: "",
      dicas: [R`<p>(a) $S_1$ e $S_2$ juntas formam uma superfície fechada, com a normal de uma delas apontando para dentro.</p>`, R`<p>(b) Com $x = \cos t$, $y = \sin t$, $z = 0$: $\vec F = (-\sin t, 0, \sin t)$ e $d\vec l = (-\sin t, \cos t, 0)\,dt$.</p>`],
      sol: R`<p><b>(a)</b> Junte $S_1$ (normal para fora) e $S_2$ com a normal invertida: dá uma superfície fechada $\Sigma$ que envolve um volume $V$. Pelo teorema da divergência, $\oint_\Sigma(\nabla\times\vec F)\cdot d\vec A = \int_V\nabla\cdot(\nabla\times\vec F)\,dV = 0$. Logo $\iint_{S_1} - \iint_{S_2} = 0$. O fluxo do rotacional só depende da borda, por isso o teorema de Stokes pode trocar a superfície por qualquer outra.</p>
        <p><b>(b)</b> $\vec F\cdot d\vec l = \sin^2t\,dt$, e $\int_0^{2\pi}\sin^2t\,dt = \pi$.</p>
        <p><b>(c)</b> $\nabla\times\vec F = (1 - x,\ 1,\ z + 1)$. No disco ($z = 0$, normal $\hat z$): o integrando é $z + 1 = 1$, então o fluxo é a área, $\pi$. ✓ No hemisfério, a parte do $z$ dá $\iint(z + 1)n_z\,dA$, e as outras não se anulam sozinhas, mas o total tem de dar $\pi$ pelo item (a) (o laboratório confere numericamente com os chapéus $z = h(1 - x^2 - y^2)$).</p>
        <p><b>(d)</b> Um chapéu mais alto tem mais área e uma normal mais inclinada; o campo $\nabla\times\vec F$ também muda com $z$. O que se mantém é o total, porque $\nabla\times\vec F$ não tem "fontes": as linhas do rotacional que entram por um chapéu saem pelo outro, como água num cano sem vazamento.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo · teoremas</div>
        <div class="q">Quanto um campo "gira" dentro de um laço?</div>
        <p>Ponha uma rodinha de pás em cada pedacinho de uma superfície ${F.ret("fisica/U01")}. O giro total de todas elas é igual a quanto o campo empurra ao longo da borda: os empurrões internos de rodinhas vizinhas se cancelam, e só sobra a borda. Isso é o Teorema de Stokes, e com ele as leis de Faraday e de Ampère passam da forma integral (laços) para a diferencial (pontos).</p></div>`),

      F.secao("enunciado", "O teorema", R`
        ${F.formula(R`\oint_{\partial S}\vec F\cdot d\vec l = \iint_S(\nabla\times\vec F)\cdot\hat n\,dA`, "Teorema de Stokes")}
        <p>Ingredientes: $S$ é uma superfície orientável (tem dois lados: nada de faixa de Möbius) com borda $\partial S$, uma curva fechada; $\vec F$ tem derivadas contínuas sobre $S$. A <b>orientação</b> casa pela regra da mão direita: dedos no sentido da borda, polegar no lado da normal.</p>
        <p>Casos particulares: com $S$ no plano $xy$, só sobra a componente $z$ do rotacional, e o teorema vira o de Green ${F.ret("CE03")}. Em 1D, "a integral da derivada é a diferença nas pontas" (Teorema Fundamental do Cálculo). Gauss, Stokes, Green e o TFC são casos do mesmo teorema (o "Stokes generalizado", $\int_\Omega d\omega = \oint_{\partial\Omega}\omega$, da geometria diferencial).</p>
        ${F.demo("ideia da prova", R`<p>Divida $S$ em quadradinhos minúsculos. Em cada um, que é quase plano, vale Green: a circulação na borda do quadradinho é $(\nabla\times\vec F)\cdot\hat n\,dA$ (é a própria definição do rotacional como "circulação por área"). Some todos: cada lado interno é percorrido duas vezes, em sentidos opostos, e se cancela. Sobra só a borda externa. À esquerda, a soma dos $(\nabla\times\vec F)\cdot\hat n\,dA$; à direita, $\oint_{\partial S}\vec F\cdot d\vec l$.</p>`)}
        <div id="lab-sk"></div>`),

      F.secao("aplicacoes", "O que a física tira dele", R`
        <ul><li><b>Faraday</b> ${F.ret("fisica/C15")}: $\oint\vec E\cdot d\vec l = -\frac{d\Phi_B}{dt}$ $\Longleftrightarrow$ $\nabla\times\vec E = -\partial_t\vec B$.</li>
          <li><b>Ampère–Maxwell</b> ${F.ret("fisica/C14")}: $\oint\vec B\cdot d\vec l = \mu_0I + \dots$ $\Longleftrightarrow$ $\nabla\times\vec B = \mu_0\vec J + \mu_0\varepsilon_0\partial_t\vec E$ ${F.ret("fisica/U05")}.</li>
          <li><b>Campo conservativo</b>: se $\nabla\times\vec F = 0$ numa região sem buracos, a circulação em qualquer laço é zero, o trabalho não depende do caminho e existe potencial: $\vec F = -\nabla U$.</li>
          <li><b>Fluidos</b>: a vorticidade $\nabla\times\vec v$ é o dobro da velocidade angular local; a circulação em volta de uma asa é o que gera sustentação (teorema de Kutta–Joukowski).</li></ul>
        ${F.caixa("pegadinha", R`<p><b>Rotacional zero com circulação diferente de zero.</b> O campo $\vec F = \frac{(-y, x, 0)}{x^2 + y^2}$ tem rotacional zero em todo lugar fora do eixo $z$, mas circulação $2\pi$ em qualquer laço em volta do eixo. Stokes não falha: qualquer superfície com essa borda é furada pelo eixo, onde o campo não está definido. É o campo $\vec B$ de um fio, e o potencial vetor fora de um solenoide (efeito Aharonov–Bohm, que é observado).</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule a circulação de $\vec F = (-y, x, 0)$ no círculo $x^2 + y^2 = R^2$, $z = 0$ (anti-horário), direto e por Stokes.</p>`, fig: "", dicas: [R`<p>Direto: $|\vec F| = R$, tangente.</p>`, R`<p>$\nabla\times\vec F = (0, 0, 2)$.</p>`], resp: R`$2\pi R^2$.`, sol: R`<p>$R\cdot2\pi R = 2\cdot\pi R^2$. ✓</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Para o mesmo campo, calcule o fluxo de $\nabla\times\vec F$ pelo hemisfério $x^2 + y^2 + z^2 = R^2$, $z \ge 0$ (normal para fora). Compare com o exercício 1.</p>`, fig: "", dicas: [R`<p>$(0, 0, 2)\cdot\hat n = 2\cos\theta$ (ângulo polar).</p>`, R`<p>$dA = R^2\sin\theta\,d\theta\,d\phi$.</p>`], resp: R`$2\pi R^2$: o mesmo.`, sol: R`<p>$\int_0^{2\pi}\!\int_0^{\pi/2}2\cos\theta\,R^2\sin\theta\,d\theta\,d\phi = 2\pi R^2$. A borda é a mesma, então o fluxo é o mesmo (chefão).</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Calcule a circulação de $\vec F = (z, x, y)$ no triângulo $(1,0,0) \to (0,1,0) \to (0,0,1) \to (1,0,0)$, direto e por Stokes.</p>`, fig: "", dicas: [R`<p>$\nabla\times\vec F = (1, 1, 1)$.</p>`, R`<p>O triângulo está no plano $x + y + z = 1$: normal $(1,1,1)/\sqrt3$ e área $\frac{\sqrt3}{2}$.</p>`], resp: R`$\frac32$.`, sol: R`<p>Stokes: $(1,1,1)\cdot\frac{(1,1,1)}{\sqrt3}\cdot\frac{\sqrt3}{2} = \frac32$. Direto: cada um dos três lados contribui $\frac12$ (por exemplo, no primeiro, $\vec r = (1 - t, t, 0)$ e $\vec F\cdot d\vec r = (1 - t)\,dt$). ✓</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Mostre que $\vec F = (yz, xz, xy)$ é conservativo e calcule o trabalho de $(0, 0, 0)$ até $(1, 2, 3)$.</p>`, fig: "", dicas: [R`<p>Calcule o rotacional.</p>`, R`<p>Potencial: $\phi = xyz$.</p>`], resp: R`$\nabla\times\vec F = 0$; trabalho = 6.`, sol: R`<p>No laboratório, escolha esse campo: circulação e fluxo dão zero, com qualquer chapéu.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Um campo magnético uniforme num cilindro de raio 10 cm cresce a 0,5 T/s. Qual o campo elétrico induzido na borda do cilindro?</p>`, fig: "", dicas: [R`<p>$E\cdot2\pi R = \pi R^2\frac{dB}{dt}$.</p>`, R`<p>$E = \frac R2\frac{dB}{dt}$.</p>`], resp: R`$E = 0{,}025$ V/m.`, sol: R`<p>É esse campo que acelera os elétrons no bétatron (um acelerador de partículas antigo, sem fios ligados aos elétrons).</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>O campo $\vec F = \frac{(-y, x, 0)}{x^2 + y^2}$ tem rotacional zero fora do eixo $z$. Calcule a circulação num círculo de raio $R$ em volta do eixo. Isso contradiz Stokes?</p>`, fig: "", dicas: [R`<p>No círculo, $|\vec F| = 1/R$ e é tangente.</p>`, R`<p>Qual superfície você usaria? Ela passa pelo eixo?</p>`], resp: R`$2\pi$, para qualquer $R$. Não contradiz: toda superfície com essa borda é furada pelo eixo, onde o campo não existe.`, sol: R`<p>Num domínio com buraco, "rotacional zero" não garante "conservativo". A circulação $2\pi$ é uma propriedade topológica: conta quantas voltas o laço dá em torno do furo.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Um fluido gira rigidamente com $\omega = 3$ rad/s. Qual a circulação num círculo de raio 0,2 m em volta do eixo? E num círculo de mesmo raio que <b>não</b> envolve o eixo?</p>`, fig: "", dicas: [R`<p>Vorticidade constante $2\omega$ em todo lugar.</p>`, R`<p>Stokes: circulação = vorticidade × área, em qualquer lugar.</p>`], resp: R`$2\omega\cdot\pi r^2 \approx 0{,}754$ m²/s nos dois casos.`, sol: R`<p>Surpresa para muita gente: um laço que não envolve o eixo também tem circulação, porque a rotação rígida gira cada pedacinho do fluido (vorticidade uniforme). Já no redemoinho do exercício 6, só os laços em volta do eixo têm circulação.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-sk"); e.outerHTML = F.lab("Um chapéu qualquer com a mesma borda", "lab-sk"); SIM.stokesChapeu(document.getElementById("lab-sk"), F); },
});
