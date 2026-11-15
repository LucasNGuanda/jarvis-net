/* TE02 · Teorema da Divergência (Gauss–Ostrogradsky). Conferido em Python:
   (x, y, z) na esfera: 4πR³; (x², y², z²) no cubo unitário: 3; volume do cone pela fórmula (1/3)∮ r·n dA: πa²h/3;
   (x, 0) no triângulo (0,0), (1,0), (0,1): 1/2. */
F.registrar("matematica/TE02", {
  retoma: ["fisica/U01", "fisica/U02", "CE03", "CII07"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Fluxo pelo atalho",
      casos: [
        { nome: "Fluxo por um cubo", gerar: (p) => {
          const a = p ? 1 : F.escolha([1, 2, 3]), b = p ? 1 : F.escolha([0, 1, 2]), c = p ? 1 : F.escolha([1, 2]), L = p ? 1 : F.escolha([1, 2]);
          const fl = (a + b + c) * L ** 4; /* div = 2(ax + by + cz) integrado em [0,L]³ */
          return { enun: R`<p>Calcule o fluxo de $\vec F = (${F.c(a)}x^2,\ ${b === 0 ? "0" : F.c(b) + "y^2"},\ ${F.c(c)}z^2)$ para fora do cubo $0 \le x, y, z \le ${L}$.</p>`, fig: "",
            passos: [
              R`<p>Pelas 6 faces daria trabalho. Pelo teorema: $\nabla\cdot\vec F = ${2 * a}x ${b ? "+ " + 2 * b + "y" : ""} + ${2 * c}z$.</p>`,
              R`<p>$\int_0^{${L}}\!\int_0^{${L}}\!\int_0^{${L}} ${2 * a}x\,dV = ${2 * a}\cdot\frac{${L}^2}{2}\cdot${L}^2 = ${a * L ** 4}$, e o mesmo para os outros termos.</p>`,
              R`<p>Fluxo $= ${fl}$. Conferindo pela face $x = ${L}$, onde $F_x = ${a * L * L}$ e a área é ${L * L}: dá ${a * L ** 4}, igual à parte do $x$. (Na face $x = 0$, $F_x = 0$.)</p>`,
            ] };
        } },
        { nome: "Volume por uma integral de superfície", gerar: (p) => {
          const forma = p ? "cone" : F.escolha(["cone", "esfera", "cilindro"]), a = p ? 2 : F.escolha([1, 2, 3]), h = p ? 3 : F.escolha([2, 3, 6]);
          const V = { cone: (Math.PI * a * a * h) / 3, esfera: (4 / 3) * Math.PI * a ** 3, cilindro: Math.PI * a * a * h }[forma];
          const txt = { cone: R`um cone de raio $${a}$ e altura $${h}$, com o vértice na origem e o eixo em $z$`, esfera: R`uma esfera de raio $${a}$ centrada na origem`, cilindro: R`um cilindro de raio $${a}$ e altura $${h}$, com a base no plano $z = 0$ e o eixo em $z$` }[forma];
          const p2 = { cone: R`Na lateral do cone, $\vec r$ é tangente à superfície (ela é feita de retas que saem da origem): $\vec r\cdot\hat n = 0$. Na base ($z = ${h}$), $\vec r\cdot\hat n = ${h}$.`, esfera: R`Na esfera, $\vec r\cdot\hat n = ${a}$ em todo ponto.`, cilindro: R`Na lateral, $\vec r\cdot\hat n = ${a}$ (só a parte radial conta); na tampa, $\vec r\cdot\hat n = ${h}$; no fundo, $0$.` }[forma];
          const p3 = { cone: R`$V = \frac13\cdot${h}\cdot\pi\cdot${a}^2 = ${F.n((a * a * h) / 3, 3)}\pi$`, esfera: R`$V = \frac13\cdot${a}\cdot4\pi\cdot${a}^2 = ${F.n((4 * a ** 3) / 3, 3)}\pi$`, cilindro: R`$V = \frac13\left(${a}\cdot2\pi\cdot${a}\cdot${h} + ${h}\cdot\pi\cdot${a}^2\right) = ${a * a * h}\pi$` }[forma];
          return { enun: R`<p>Use $V = \frac13\oint\vec r\cdot d\vec A$ para achar o volume de ${txt}.</p>`, fig: "",
            passos: [R`<p>De onde vem a fórmula: $\nabla\cdot\vec r = 3$, então $\oint\vec r\cdot d\vec A = \int3\,dV = 3V$.</p>`, R`<p>${p2}</p>`, R`<p>${p3} $\approx ${F.n(V, 3)}$. ✓</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A demonstração (para uma região \"simples\")",
      enun: R`<p>Seja $V$ uma região que, olhando de cima, ocupa uma área $D$ do plano $xy$ e fica entre duas superfícies: $z = g_1(x, y)$ embaixo e $z = g_2(x, y)$ em cima. Seja $\vec F = (0, 0, R(x, y, z))$. (a) Use o Teorema Fundamental do Cálculo para calcular $\iiint_V\frac{\partial R}{\partial z}dV$. (b) Calcule o fluxo de $\vec F$ pela superfície de $V$ (tampa, fundo e lateral). (c) Conclua o teorema para esse campo. (d) Como se chega ao teorema geral?</p>`,
      fig: "",
      dicas: [R`<p>(a) Integre primeiro em $z$, de $g_1$ a $g_2$.</p>`, R`<p>(b) Na tampa, $R\,n_z\,dA = R(x, y, g_2)\,dx\,dy$ (a projeção do elemento de área no plano $xy$). Na lateral, a normal é horizontal: $n_z = 0$.</p>`],
      sol: R`<p><b>(a)</b> $\iiint\frac{\partial R}{\partial z}dV = \iint_D\left[\int_{g_1}^{g_2}\frac{\partial R}{\partial z}dz\right]dx\,dy = \iint_D\left[R(x, y, g_2) - R(x, y, g_1)\right]dx\,dy$ ${F.ret("CI07")}.</p>
        <p><b>(b)</b> Tampa: a normal aponta para cima, e $n_z\,dA = dx\,dy$: contribui $\iint_D R(x, y, g_2)\,dx\,dy$. Fundo: a normal aponta para baixo, $n_z\,dA = -dx\,dy$: contribui $-\iint_D R(x, y, g_1)\,dx\,dy$. Lateral: $n_z = 0$, contribui zero.</p>
        <p><b>(c)</b> As duas contas dão o mesmo: $\oint(0, 0, R)\cdot d\vec A = \iiint\frac{\partial R}{\partial z}dV$.</p>
        <p><b>(d)</b> Repita para $(P, 0, 0)$ e $(0, Q, 0)$, com regiões simples nas direções $x$ e $y$, e some: $\oint\vec F\cdot d\vec A = \iiint(P_x + Q_y + R_z)\,dV$. Uma região qualquer se corta em pedaços simples; nas faces de corte, os fluxos dos dois lados se cancelam (normais opostas), e sobra só a superfície de fora. É exatamente o que o laboratório mostra com as caixinhas. (O teorema foi publicado por Ostrogradsky em 1831; Gauss já usava casos particulares desde 1813.)</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo · teoremas</div>
        <div class="q">Contar o que sai pela casca ou o que nasce dentro?</div>
        <p>Imagine uma sala cheia de gente. Para saber quantas pessoas entraram em uma hora, você pode ficar na porta contando (fluxo pela borda) ou contar quantas pessoas "surgiram" em cada canto da sala (fonte por volume). Se ninguém se teletransporta, as duas contas dão o mesmo. O teorema da divergência é essa ideia, com campos: o fluxo para fora de uma superfície fechada é a soma do divergente lá dentro.</p></div>`),

      F.secao("enunciado", "O teorema", R`
        ${F.formula(R`\oint_{\partial V}\vec F\cdot\hat n\,dA = \iiint_V\nabla\cdot\vec F\,dV\qquad\qquad \text{(2D: }\oint_{\partial D}\vec F\cdot\hat n\,ds = \iint_D\nabla\cdot\vec F\,dA\text{)}`, "Teorema da Divergência")}
        <p>Ingredientes: $V$ é uma região limitada do espaço; $\partial V$ é a superfície que a envolve (fechada, sem furos); $\hat n$ é a normal que aponta <b>para fora</b>; $\vec F$ tem derivadas contínuas em $V$. O divergente $\nabla\cdot\vec F = \partial_xF_x + \partial_yF_y + \partial_zF_z$ é a "densidade de fonte" ${F.ret("fisica/U01")}.</p>
        <p>É o Teorema Fundamental do Cálculo ${F.ret("CI07")} em 3D: lá, "a integral da derivada no intervalo = valor nas pontas" (as pontas são a borda do intervalo). Aqui, "a integral da derivada (divergente) no volume = o fluxo pela borda".</p>
        <div id="lab-dv"></div>
        ${F.caixa("pegadinha", R`<p><b>O campo precisa ser bom dentro de toda a região.</b> Para $\vec E = \hat r/r^2$, o divergente é zero fora da origem, mas o fluxo por uma esfera em volta da origem é $4\pi$. Não há contradição: o campo explode na origem, e o teorema não vale com a singularidade dentro (ela é uma delta de Dirac ${F.ret("fisica/U01")}). E a superfície tem de ser fechada: por uma superfície aberta, o teorema não diz nada.</p>`)}`),

      F.secao("aplicacoes", "O que a física tira dele", R`
        <ul><li><b>Lei de Gauss</b> ${F.ret("fisica/C03b")}: $\oint\vec E\cdot d\vec A = Q/\varepsilon_0$ (integral) $\Longleftrightarrow$ $\nabla\cdot\vec E = \rho/\varepsilon_0$ (diferencial). O teorema faz a ponte, porque vale para qualquer volume ${F.ret("fisica/U02")}.</li>
          <li><b>Equação da continuidade</b>: a massa que sai por uma superfície é a que some de dentro: $\oint\rho\vec v\cdot d\vec A = -\frac{d}{dt}\int\rho\,dV$. Com o teorema: $\frac{\partial\rho}{\partial t} + \nabla\cdot(\rho\vec v) = 0$. Vale para carga, probabilidade e calor.</li>
          <li><b>Empuxo de Arquimedes</b>: a força da pressão num corpo submerso é $-\oint p\,\hat n\,dA = -\int\nabla p\,dV$ (versão do teorema para escalares). Com $p = p_0 + \rho g(-z)$: $\nabla p = -\rho g\hat z$, e a força é $\rho gV\,\hat z$, para cima. Arquimedes, demonstrado.</li>
          <li><b>Volume pela casca</b>: como $\nabla\cdot\vec r = 3$, vale $V = \frac13\oint\vec r\cdot d\vec A$. Calcula volumes só olhando a superfície (e é assim que programas de CAD fazem).</li></ul>
        ${F.caixa("olimpiada", R`<p><b>Truque de olimpíada</b>: para achar o fluxo por uma superfície <b>aberta</b> chata (um hemisfério, um cone), feche-a com uma tampa simples (um disco) e use o teorema: fluxo pelo hemisfério = $\int\nabla\cdot\vec F\,dV$ − fluxo pela tampa. O fluxo pela tampa plana costuma ser fácil.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule o fluxo de $\vec F = (x, y, z)$ para fora de uma esfera de raio $R$, direto e pelo teorema.</p>`, fig: "", dicas: [R`<p>Na esfera, $\vec F\cdot\hat n = R$.</p>`, R`<p>$\nabla\cdot\vec F = 3$.</p>`], resp: R`$4\pi R^3$.`, sol: R`<p>$R\cdot4\pi R^2 = 3\cdot\frac43\pi R^3$. ✓</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule o fluxo de $\vec F = (x^2, y^2, z^2)$ para fora do cubo $0 \le x, y, z \le 1$.</p>`, fig: "", dicas: [R`<p>$\nabla\cdot\vec F = 2(x + y + z)$.</p>`, R`<p>$\int_0^1 2x\,dx = 1$ (com as outras duas integrais valendo 1).</p>`], resp: R`3.`, sol: R`<p>Direto: só as faces $x = 1$, $y = 1$, $z = 1$ têm fluxo (nas outras, a componente normal é zero), cada uma com fluxo 1. ✓</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Qual o fluxo de $\vec F = (y - z,\ z - x,\ x - y)$ por uma superfície fechada qualquer?</p>`, fig: "", dicas: [R`<p>Calcule o divergente.</p>`, R`<p>Cada componente não depende da própria variável.</p>`], resp: R`Zero, para qualquer superfície fechada.`, sol: R`<p>$\nabla\cdot\vec F = 0$: o campo não tem fontes. Na verdade, ele é $\vec\omega\times\vec r$ com $\vec\omega = (-1, -1, -1)$: uma rotação rígida, que não comprime nada.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Use $V = \frac13\oint\vec r\cdot d\vec A$ para achar o volume de um cone de raio $a$ e altura $h$ com o vértice na origem.</p>`, fig: "", dicas: [R`<p>Na lateral, $\vec r$ está contido na superfície.</p>`, R`<p>Na base, $\vec r\cdot\hat n = h$ em todo ponto.</p>`], resp: R`$V = \frac13\cdot h\cdot\pi a^2 = \frac{\pi a^2h}{3}$.`, sol: R`<p>Sem fatiar nada: a fórmula do volume do cone (e de qualquer pirâmide) sai porque a lateral não contribui.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Mostre, com o teorema, que o empuxo num corpo totalmente submerso num fluido de densidade $\rho$ é $\rho gV$, para cima, qualquer que seja a forma do corpo.</p>`, fig: "", dicas: [R`<p>Força da pressão: $-\oint p\,\hat n\,dA$. Versão escalar do teorema: $\oint p\,\hat n\,dA = \int\nabla p\,dV$.</p>`, R`<p>No fluido parado: $\nabla p = \rho\vec g = -\rho g\,\hat z$.</p>`], resp: R`$-\int\nabla p\,dV = \rho gV\,\hat z$.`, sol: R`<p>A versão escalar sai aplicando o teorema ao campo $p\,\vec c$, com $\vec c$ um vetor constante qualquer.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Calcule o fluxo de $\vec F = (x, 0)$ para fora do triângulo de vértices $(0, 0)$, $(1, 0)$ e $(0, 1)$, direto e pela versão 2D do teorema.</p>`, fig: "", dicas: [R`<p>$\nabla\cdot\vec F = 1$: o fluxo é a área.</p>`, R`<p>Direto: só a hipotenusa contribui; nela, $\hat n = (1, 1)/\sqrt2$ e $ds = \sqrt2\,dx$.</p>`], resp: R`$\frac12$.`, sol: R`<p>Direto: $\int_0^1 x\cdot\frac{1}{\sqrt2}\cdot\sqrt2\,dx = \frac12$ (nos catetos, $\vec F\cdot\hat n = 0$: no vertical, $x = 0$; no horizontal, $\hat n = -\hat y$). ✓</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Deduza a equação da continuidade $\frac{\partial\rho}{\partial t} + \nabla\cdot(\rho\vec v) = 0$ a partir da conservação da massa num volume fixo qualquer.</p>`, fig: "", dicas: [R`<p>Taxa de massa saindo pela superfície: $\oint\rho\vec v\cdot d\vec A$.</p>`, R`<p>Ela é igual a $-\frac{d}{dt}\int\rho\,dV$. Use o teorema e o fato de valer para <b>todo</b> volume.</p>`], resp: R`$\int\left(\frac{\partial\rho}{\partial t} + \nabla\cdot(\rho\vec v)\right)dV = 0$ para todo $V$ ⟹ o integrando é zero.`, sol: R`<p>Para fluido incompressível ($\rho$ constante): $\nabla\cdot\vec v = 0$. É o ponto de partida de Navier–Stokes (módulo N, em breve).</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-dv"); e.outerHTML = F.lab("Caixinhas: os fluxos internos se cancelam", "lab-dv"); SIM.divCaixas(document.getElementById("lab-dv"), F); },
});
