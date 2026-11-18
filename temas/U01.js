/* U01 · Cálculo vetorial: gradiente, divergente e rotacional (com as minhas palavras; base: Halliday + notas de cálculo vetorial). Conferido em Python:
   f = x²y + yz em (1,2,3): ∇f = (4, 4, 2), |∇f| = 6, derivada na direção (2,1,2)/3 = 16/3; G = (xy, yz, zx): div = x + y + z, rot = (−y, −z, −x);
   (2xy + z, x², x) tem rot = 0 e potencial x²y + xz (trabalho de 0 a (1,2,3) = 5); div(rⁿ r̂) = (n + 2)rⁿ⁻¹. */
F.registrar("U01", {
  retoma: ["matematica/CII05", "matematica/CII06", "C03b"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Derivando campos",
      casos: [
        { nome: "Gradiente num ponto", gerar: (p) => {
          const A = p ? 1 : F.escolha([1, 2, 3, -1]), B = p ? 3 : F.escolha([-2, 1, 2, 4]), C = p ? -1 : F.escolha([-2, -1, 1, 2]), x0 = p ? 2 : F.escolha([-1, 1, 2]), y0 = p ? 1 : F.escolha([-2, 1, 3]);
          const gx = 2 * A * x0 + B * y0, gy = B * x0 + 2 * C * y0, mod = Math.hypot(gx, gy);
          return { enun: R`<p>Uma "montanha" tem altura $h(x, y) = ${F.c(A)}x^2 ${B < 0 ? "-" : "+"} ${F.c(Math.abs(B))}xy ${C < 0 ? "-" : "+"} ${F.c(Math.abs(C))}y^2$. No ponto $(${x0}, ${y0})$: para onde a subida é mais íngreme, e qual a inclinação?</p>`, fig: "",
            passos: [
              R`<p>Derivadas parciais ${F.ret("matematica/CII05")}: $\frac{\partial h}{\partial x} = ${F.c(2 * A)}x ${B < 0 ? "-" : "+"} ${F.c(Math.abs(B))}y$ e $\frac{\partial h}{\partial y} = ${F.c(B)}x ${C < 0 ? "-" : "+"} ${F.c(Math.abs(2 * C))}y$.</p>`,
              R`<p>No ponto: $\nabla h = (${gx}, ${gy})$.</p>`,
              R`<p>A subida mais íngreme é na direção de $\nabla h$, com inclinação $|\nabla h| = \sqrt{${gx * gx} + ${gy * gy}} \approx ${F.n(mod, 2)}$. Andando perpendicular a $\nabla h$, a altura não muda: é a curva de nível.</p>`,
            ] };
        } },
        { nome: "div e rot de um campo linear", gerar: (p) => {
          const a = p ? 2 : F.escolha([-2, -1, 0, 1, 2, 3]), b = p ? -3 : F.escolha([-3, -1, 0, 1, 2]), c = p ? 1 : F.escolha([-2, 0, 1, 3]), d = p ? -2 : F.escolha([-2, -1, 0, 1]);
          const div = a + d, rot = c - b;
          const termo = (k, v, primeiro) => (k === 0 ? "" : (k < 0 ? "-" : primeiro ? "" : "+") + F.c(Math.abs(k)) + v);
          const comp = (k1, k2) => { const s = termo(k1, "x", true) + termo(k2, "y", k1 === 0); return s || "0"; };
          return { enun: R`<p>Calcule o divergente e o rotacional de $\vec F = \big(${comp(a, b)},\ ${comp(c, d)}\big)$. O campo tem fontes? Faz uma rodinha de pás girar?</p>`, fig: "",
            passos: [
              R`<p>$\nabla\cdot\vec F = \frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} = ${a} + (${d}) = ${div}$.</p>`,
              R`<p>$(\nabla\times\vec F)_z = \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} = ${c} - (${b}) = ${rot}$.</p>`,
              R`<p>${div > 0 ? "div &gt; 0: o campo \"brota\" de todo lugar (fonte espalhada)." : div < 0 ? "div &lt; 0: o campo \"some\" em todo lugar (sumidouro espalhado)." : "div = 0: o que entra numa caixinha sai (sem fontes)."} ${rot !== 0 ? `rot = ${rot}: a rodinha gira com velocidade angular ${F.nt(rot / 2)} rad/s, ${rot > 0 ? "anti-horária" : "horária"}.` : "rot = 0: a rodinha não gira, e o campo é conservativo (é gradiente de alguém)."}</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O campo que tem divergente zero e fluxo 4π",
      enun: R`<p>Seja $\vec E = \frac{\hat r}{r^2} = \frac{\vec r}{r^3}$ (o campo de uma carga pontual, sem as constantes). (a) Calcule $\nabla\cdot\vec E$ para $r \neq 0$. (b) Calcule o fluxo de $\vec E$ por uma esfera de raio $R$ centrada na origem. (c) O teorema da divergência diz que fluxo $= \int\nabla\cdot\vec E\,dV$. Como os dois resultados podem estar certos ao mesmo tempo? (d) O que isso diz sobre $\nabla\cdot\vec E$ na origem?</p>`,
      fig: "",
      dicas: [R`<p>(a) Use $\nabla\cdot(r^n\hat r) = \frac1{r^2}\frac{d}{dr}(r^2 r^n)$ com $n = -2$.</p>`, R`<p>(b) Na esfera, $\vec E\cdot\hat n = 1/R^2$ em todo ponto, e a área é $4\pi R^2$.</p>`],
      sol: R`<p><b>(a)</b> $\nabla\cdot(r^{-2}\hat r) = \frac1{r^2}\frac{d}{dr}(r^2\cdot r^{-2}) = \frac1{r^2}\frac{d}{dr}(1) = 0$. Fora da origem, o campo não tem fonte nenhuma.</p>
        <p><b>(b)</b> $\Phi = \frac{1}{R^2}\cdot4\pi R^2 = 4\pi$, <b>qualquer</b> que seja $R$.</p>
        <p><b>(c)</b> O divergente é zero em todo lugar <b>menos na origem</b>, onde $\vec E$ nem está definido. Toda a "fonte" está concentrada num ponto: o integrando é zero em quase todo o volume, mas a integral vale $4\pi$.</p>
        <p><b>(d)</b> O divergente na origem é um "pico infinitamente fino de área $4\pi$": $\nabla\cdot\frac{\hat r}{r^2} = 4\pi\,\delta^3(\vec r)$, onde $\delta^3$ é a <b>delta de Dirac</b> (zero fora da origem, integral 1). Multiplicando pelas constantes: $\nabla\cdot\vec E = \rho/\varepsilon_0$ para uma carga pontual, com $\rho = q\,\delta^3(\vec r)$. É a lei de Gauss na forma diferencial ${F.ret("C03b")}. Dirac inventou essa "função" (que não é bem uma função) para a mecânica quântica, e os matemáticos só a formalizaram depois (Schwartz, anos 1940).</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Universitária · cálculo vetorial</div>
        <div class="q">Como derivar uma seta?</div>
        <p>Um campo vetorial põe uma seta em cada ponto do espaço: a velocidade da água num rio, o campo elétrico, o vento. Na física de faculdade, as leis viram afirmações sobre as <b>derivadas</b> desses campos. São só três "derivadas" importantes, e cada uma mede uma coisa que dá para enxergar: para onde sobe (gradiente), quanto brota (divergente) e quanto gira (rotacional).</p></div>`),

      F.secao("nabla", "O operador nabla", R`
        <p>Tudo sai de um único símbolo, o <b>nabla</b>, um "vetor de derivadas parciais" ${F.ret("matematica/CII05")}:</p>
        ${F.formula(R`\nabla = \left(\frac{\partial}{\partial x},\ \frac{\partial}{\partial y},\ \frac{\partial}{\partial z}\right)`, "Nabla")}
        <p>Ele não é um vetor de verdade (sozinho não vale nada), mas funciona como um nas três "multiplicações" de vetores:</p>
        <table class="tb"><tr><th>nome</th><th>conta</th><th>age em</th><th>dá</th><th>significado</th></tr>
          <tr><td>gradiente</td><td>$\nabla f$</td><td>escalar</td><td>vetor</td><td>direção e taxa de maior subida</td></tr>
          <tr><td>divergente</td><td>$\nabla\cdot\vec F$</td><td>vetor</td><td>escalar</td><td>quanto campo "brota" por unidade de volume</td></tr>
          <tr><td>rotacional</td><td>$\nabla\times\vec F$</td><td>vetor</td><td>vetor</td><td>quanto (e em torno de que eixo) o campo "gira"</td></tr></table>`),

      F.secao("grad", "Gradiente", R`
        ${F.formula(R`\nabla f = \left(\frac{\partial f}{\partial x},\ \frac{\partial f}{\partial y},\ \frac{\partial f}{\partial z}\right)\qquad\qquad df = \nabla f\cdot d\vec r`, "Gradiente")}
        <p>A segunda fórmula é a chave: andando $d\vec r$, a função muda $\nabla f\cdot d\vec r$. Como o produto escalar é máximo quando os vetores são paralelos, $\nabla f$ <b>aponta para onde $f$ sobe mais rápido</b>, e $|\nabla f|$ é essa taxa. Andando perpendicular, $f$ não muda: o gradiente é perpendicular às curvas (superfícies) de nível ${F.ret("matematica/CII06")}.</p>
        <p><b>Derivada direcional</b>: a taxa de variação na direção de um vetor unitário $\hat u$ é $\nabla f\cdot\hat u$. Exemplo: $f = x^2y + yz$ em $(1, 2, 3)$ tem $\nabla f = (2xy,\ x^2 + z,\ y) = (4, 4, 2)$, de módulo 6. Na direção $\hat u = (2, 1, 2)/3$: $\frac{8 + 4 + 4}{3} = \frac{16}{3}$.</p>
        ${F.caixa("fisico", R`<p><b>Força é menos gradiente da energia potencial</b>: $\vec F = -\nabla U$. A bola rola "morro abaixo" na paisagem de $U$. Da mesma forma, $\vec E = -\nabla V$: o campo elétrico aponta para onde o potencial cai mais rápido, perpendicular às equipotenciais ${F.ret("C04")}.</p>`)}`),

      F.secao("div", "Divergente e rotacional", R`
        ${F.formula(R`\nabla\cdot\vec F = \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y} + \frac{\partial F_z}{\partial z}\qquad\qquad \nabla\times\vec F = \begin{vmatrix}\hat x & \hat y & \hat z\\ \partial_x & \partial_y & \partial_z\\ F_x & F_y & F_z\end{vmatrix}`, "Divergente e rotacional")}
        <p><b>Divergente</b>: pense numa caixinha minúscula. Se $F_x$ aumenta com $x$, sai mais pela face da direita do que entra pela da esquerda. Somando as três direções, $\nabla\cdot\vec F$ é o <b>fluxo líquido que sai por unidade de volume</b>. Positivo: fonte. Negativo: sumidouro. Zero: o que entra sai.</p>
        <p><b>Rotacional</b>: ponha uma rodinha de pás minúscula no campo. Ela gira com velocidade angular igual a <b>metade</b> do rotacional (o eixo da rodinha aponta na direção de $\nabla\times\vec F$, pela regra da mão direita). Em 2D, só sobra a componente $z$: $\frac{\partial F_y}{\partial x} - \frac{\partial F_x}{\partial y}$.</p>
        <div id="lab-cv"></div>
        ${F.caixa("pegadinha", R`<p><b>Rotacional não é "o campo faz curva"</b>. O campo $(y, 0)$ (correnteza mais rápida em cima) tem linhas retas, mas rotacional $-1$: a rodinha gira porque a água de cima empurra mais que a de baixo. E o campo de um redemoinho ideal, $\frac{(-y, x)}{x^2 + y^2}$, tem linhas circulares e rotacional <b>zero</b> fora do centro. Teste a "correnteza" na simulação.</p>`)}
        <p>Exemplo: $\vec G = (xy,\ yz,\ zx)$. Divergente: $y + z + x$. Rotacional: $\big(\partial_y(zx) - \partial_z(yz),\ \partial_z(xy) - \partial_x(zx),\ \partial_x(yz) - \partial_y(xy)\big) = (-y,\ -z,\ -x)$.</p>`),

      F.secao("identidades", "Duas identidades que valem ouro", R`
        ${F.formula(R`\nabla\times(\nabla f) = \vec 0\qquad\qquad \nabla\cdot(\nabla\times\vec F) = 0\qquad\qquad \nabla\cdot\nabla f = \nabla^2 f`, "Identidades e laplaciano")}
        <p>As duas primeiras vêm de que as derivadas parciais mistas são iguais ($\partial_x\partial_y = \partial_y\partial_x$). O significado físico:</p>
        <ul><li><b>Gradiente não gira</b>. E vale a volta (num domínio sem buracos): se $\nabla\times\vec F = 0$, então $\vec F = \nabla\phi$ para algum $\phi$, e o campo é <b>conservativo</b>: o trabalho só depende das pontas.</li>
          <li><b>Rotacional não tem fonte</b>. Por isso $\nabla\cdot\vec B = 0$ e $\vec B = \nabla\times\vec A$ (potencial vetor).</li>
          <li>O <b>laplaciano</b> $\nabla^2 f = f_{xx} + f_{yy} + f_{zz}$ mede quanto $f$ num ponto difere da média em volta. $\nabla^2 f = 0$ (equação de Laplace): $f$ é sempre a média dos vizinhos, sem máximos nem mínimos internos. É a equação do potencial elétrico no vácuo e da temperatura em equilíbrio.</li></ul>
        ${F.caixa("olimpiada", R`<p><b>Achar o potencial</b>: $\vec F = (2xy + z,\ x^2,\ x)$ tem rotacional zero (confira). Integre a 1ª componente em $x$: $\phi = x^2y + xz + g(y, z)$. Derivando em $y$: $x^2 + g_y = x^2$, então $g$ não depende de $y$; em $z$: $x + g_z = x$. Logo $\phi = x^2y + xz$, e o trabalho de $(0,0,0)$ até $(1,2,3)$ é $\phi(1,2,3) - \phi(0,0,0) = 5$, por qualquer caminho.</p>`)}
        <p>Em coordenadas esféricas, para um campo radial $\vec F = F(r)\hat r$: $\nabla\cdot\vec F = \frac1{r^2}\frac{d}{dr}\big(r^2F\big)$. Com $F = r^n$: $(n + 2)r^{n-1}$. O caso $n = -2$ (lei do inverso do quadrado) é o único com divergente zero: veja o chefão.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $\nabla(x^2 + y^2 + z^2)$ e $\nabla\frac1r$, com $r = \sqrt{x^2 + y^2 + z^2}$.</p>`, fig: "", dicas: [R`<p>A primeira é $\nabla(r^2)$; derive componente a componente.</p>`, R`<p>$\frac{\partial r}{\partial x} = \frac{x}{r}$, então $\nabla r = \hat r$ e $\nabla g(r) = g'(r)\hat r$.</p>`], resp: R`$2\vec r$ e $-\frac{\hat r}{r^2}$.`, sol: R`<p>Daí sai $\vec E = -\nabla\frac{kq}{r} = \frac{kq}{r^2}\hat r$: o campo de Coulomb é menos o gradiente do potencial $kq/r$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Para $f = x^2y + yz$, ache $\nabla f$ em $(1, 2, 3)$, a maior taxa de variação ali e a derivada na direção de $(2, 1, 2)$.</p>`, fig: "", dicas: [R`<p>$\nabla f = (2xy,\ x^2 + z,\ y)$.</p>`, R`<p>Normalize $(2,1,2)$ antes do produto escalar.</p>`], resp: R`$(4, 4, 2)$; 6; $16/3$.`, sol: R`<p>$16/3 \approx 5{,}3 < 6$: qualquer direção que não seja a do gradiente sobe menos.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Calcule o divergente e o rotacional de $\vec G = (xy,\ yz,\ zx)$.</p>`, fig: "", dicas: [R`<p>Divergente: $\partial_x(xy) + \partial_y(yz) + \partial_z(zx)$.</p>`, R`<p>Rotacional, 1ª componente: $\partial_y G_z - \partial_z G_y$.</p>`], resp: R`div $= x + y + z$; rot $= (-y, -z, -x)$.`, sol: R`<p>Confira a identidade: $\nabla\cdot(-y, -z, -x) = 0$. Sempre.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Mostre que $\vec F = (2xy + z,\ x^2,\ x)$ é conservativo, ache o potencial e o trabalho de $(0,0,0)$ até $(1,2,3)$.</p>`, fig: "", dicas: [R`<p>Calcule o rotacional: deve dar zero.</p>`, R`<p>Integre $F_x$ em $x$ e acerte a "constante" com as outras componentes.</p>`], resp: R`$\phi = x^2y + xz$; trabalho = 5.`, sol: R`<p>Com o potencial, a integral de linha vira uma subtração. É o mesmo truque de energia potencial da mecânica.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Um disco gira rígido com velocidade angular $\omega$ em torno do eixo $z$: a velocidade de cada ponto é $\vec v = (-\omega y,\ \omega x,\ 0)$. Calcule $\nabla\cdot\vec v$ e $\nabla\times\vec v$.</p>`, fig: "", dicas: [R`<p>Derivadas de componentes lineares: fácil.</p>`, R`<p>Só a componente $z$ do rotacional sobrevive.</p>`], resp: R`div $= 0$; rot $= 2\omega\,\hat z$.`, sol: R`<p>O rotacional é o <b>dobro</b> da velocidade angular: por isso a rodinha de pás gira com rot/2. Na mecânica dos fluidos, $\nabla\times\vec v$ se chama <b>vorticidade</b>.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Mostre que $\nabla\times(\nabla f) = \vec 0$ para qualquer $f$ (com derivadas segundas contínuas). Que lei da eletrostática isso explica?</p>`, fig: "", dicas: [R`<p>Escreva a componente $x$: $\partial_y(\partial_z f) - \partial_z(\partial_y f)$.</p>`, R`<p>Teorema de Schwarz: derivadas mistas comutam.</p>`], resp: R`Cada componente é uma diferença de derivadas mistas iguais: zero. Explica $\nabla\times\vec E = 0$ (eletrostática).`, sol: R`<p>Como $\vec E = -\nabla V$, o campo eletrostático não tem rotacional: a circulação em qualquer laço fechado é zero, e o potencial existe. Quando há $\vec B$ variando, isso muda (Faraday, U05).</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Para o campo radial $\vec F = r^n\hat r$, mostre que $\nabla\cdot\vec F = (n + 2)r^{n-1}$. Para que $n$ o divergente é zero? E dentro de uma esfera uniformemente carregada ($\vec E \propto r\,\hat r$), quanto vale $\nabla\cdot\vec E$?</p>`, fig: "", dicas: [R`<p>Use $\nabla\cdot(F\hat r) = \frac1{r^2}\frac{d}{dr}(r^2F)$.</p>`, R`<p>Dentro da esfera, $n = 1$.</p>`], resp: R`$n = -2$; dentro da esfera, div $= 3k$ (constante) se $\vec E = k\vec r$.`, sol: R`<p>Div constante = densidade de carga constante: $\nabla\cdot\vec E = \rho/\varepsilon_0$ com $k = \rho/(3\varepsilon_0)$, batendo com a lei de Gauss ${F.ret("C03b")}. Só a lei $1/r^2$ tem div zero fora das cargas: em 3D, isso é o "espalhamento" do fluxo por uma área $4\pi r^2$.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-cv"); e.outerHTML = F.lab("Rodinha de pás num campo", "lab-cv"); SIM.campoVetorial(document.getElementById("lab-cv"), F); },
});
