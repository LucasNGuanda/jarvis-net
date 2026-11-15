/* U02 · Teoremas de Gauss (divergência) e de Stokes (com as minhas palavras). Conferido em Python:
   fluxo de (x, y, z) por esfera R: 4πR³; (x², 0, 0) no cubo unitário: 1; circulação de (−y, x) num círculo: 2πR²; área da elipse por Green: πab;
   (y, 0) no quadrado unitário anti-horário: −1; B dentro de fio (10 A, a = 1 mm) a 0,5 mm: 1 mT; túnel pela Terra: 84,4 min, v máx = 7,9 km/s. */
F.registrar("U02", {
  retoma: ["U01", "matematica/CE03", "matematica/CII07", "C03b"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Fluxo e circulação sem sofrimento",
      casos: [
        { nome: "Fluxo por uma esfera", gerar: (p) => {
          const a = p ? 1 : F.escolha([1, 2, 3, -1]), b = p ? 2 : F.escolha([0, 1, 2]), c = p ? 0 : F.escolha([-1, 0, 1, 4]), Rr = p ? 2 : F.escolha([1, 2, 3]), d = a + b + c;
          return { enun: R`<p>Calcule o fluxo de $\vec F = (${F.c(a)}x,\ ${b === 0 ? "0" : F.c(b) + "y"},\ ${c === 0 ? "0" : F.c(c) + "z"})$ para fora de uma esfera de raio ${Rr} centrada na origem.</p>`, fig: "",
            passos: [
              R`<p>Pela superfície, seria uma integral dupla chata. Pelo teorema da divergência, basta $\nabla\cdot\vec F = ${a} + ${b} + (${c}) = ${d}$ (constante).</p>`,
              R`<p>$\oint\vec F\cdot d\vec A = \int ${d}\,dV = ${d}\cdot\frac43\pi(${Rr})^3$.</p>`,
              R`<p>$\Phi = ${F.n((4 / 3) * d * Rr ** 3, 2)}\pi \approx ${F.n((4 / 3) * Math.PI * d * Rr ** 3, 1)}$. ${d === 0 ? "Fluxo zero: entra tanto quanto sai." : d < 0 ? "Negativo: entra mais do que sai." : ""}</p>`,
            ] };
        } },
        { nome: "Circulação num círculo", gerar: (p) => {
          const w = p ? 3 : F.escolha([1, 2, 3, 5]), Rr = p ? 2 : F.escolha([0.5, 1, 2, 4]);
          return { enun: R`<p>A água de um tanque gira como um corpo rígido, com $\vec v = (-${F.c(w)}y,\ ${F.c(w)}x)$ (m/s, em metros). Qual a circulação $\oint\vec v\cdot d\vec l$ num círculo de raio ${F.n(Rr)} m em volta do centro?</p>`, fig: "",
            passos: [
              R`<p>Direto: no círculo, $\vec v$ é tangente, de módulo ${w}·r = ${F.n(w * Rr)} m/s. Circulação = $|\vec v|\times$ perímetro $= ${F.n(w * Rr)}\times2\pi(${F.n(Rr)}) = ${F.n(2 * w * Rr * Rr)}\pi$.</p>`,
              R`<p>Por Stokes: $(\nabla\times\vec v)_z = ${w} - (-${w}) = ${2 * w}$, constante. Circulação $= ${2 * w}\times\pi(${F.n(Rr)})^2 = ${F.n(2 * w * Rr * Rr)}\pi \approx ${F.n(2 * Math.PI * w * Rr * Rr, 1)}$ m²/s.</p>`,
              R`<p>As duas contas batem, como o teorema promete.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O túnel pela Terra",
      enun: R`<p>Imagine a Terra como uma esfera de densidade uniforme, raio $R = 6371$ km e $g = 9{,}81$ m/s² na superfície. Cave um túnel reto passando pelo centro e solte uma pedra (sem atrito nem ar). (a) Use a lei de Gauss da gravitação para achar $g(r)$ dentro da Terra. (b) Mostre que a pedra faz um MHS e calcule quanto tempo ela leva para chegar ao outro lado. (c) Qual a velocidade máxima? (d) E se o túnel for uma corda que não passa pelo centro (São Paulo → Rio, por exemplo)?</p>`,
      fig: "",
      dicas: [R`<p>(a) Gauss: $\oint\vec g\cdot d\vec A = -4\pi G\,M_\text{dentro}$, com $M_\text{dentro} = M\frac{r^3}{R^3}$.</p>`, R`<p>(d) Decomponha $\vec g$ na direção do túnel: a componente ao longo dele é $\frac{g}{R}x$, onde $x$ é a distância ao meio do túnel.</p>`],
      sol: R`<p><b>(a)</b> Esfera gaussiana de raio $r < R$: $g(r)\cdot4\pi r^2 = 4\pi G M\frac{r^3}{R^3}$, então $g(r) = \frac{GM}{R^3}r = g\,\frac{r}{R}$. O campo cresce linearmente do centro (zero) até a superfície.</p>
        <p><b>(b)</b> $\ddot r = -\frac{g}{R}r$: MHS com $\omega = \sqrt{g/R}$. Ida (meio período): $t = \pi\sqrt{\frac{R}{g}} = \pi\sqrt{\frac{6{,}371\times10^6}{9{,}81}} \approx 2532$ s $\approx 42$ min. O período completo é 84,4 min.</p>
        <p><b>(c)</b> No centro: $v = \omega R = \sqrt{gR} \approx 7{,}9$ km/s, a primeira velocidade cósmica (a de um satélite rasante). Não é coincidência: um satélite em órbita rasante tem o mesmo período, 84,4 min, e a sua projeção num diâmetro faz exatamente esse MHS.</p>
        <p><b>(d)</b> A componente da gravidade ao longo da corda é $\frac{g}{R}r\cos\alpha = \frac{g}{R}x$: o mesmo MHS, com o mesmo período! <b>Qualquer</b> túnel reto leva 42 min, seja de SP ao Rio ou de SP a Tóquio. (A Terra real não é uniforme: o núcleo é denso, e o tempo pelo centro cai para ~38 min.)</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Universitária · teoremas integrais</div>
        <div class="q">Dá para saber o que acontece dentro olhando só a borda?</div>
        <p>Sim, e essa é uma das ideias mais lindas da matemática. O Teorema Fundamental do Cálculo diz que $\int_a^b f'\,dx = f(b) - f(a)$: a soma das derivadas no miolo é igual ao valor nas pontas ${F.ret("matematica/CI07")}. Os teoremas de Gauss e de Stokes são o mesmo teorema, um andar acima: somar divergente no volume dá o fluxo pela casca; somar rotacional numa superfície dá a circulação na borda.</p></div>`),

      F.secao("gauss", "Teorema da divergência (Gauss)", R`
        ${F.formula(R`\oint_{\partial V}\vec F\cdot d\vec A = \int_V(\nabla\cdot\vec F)\,dV`, "Teorema da divergência")}
        <p>Ideia: corte o volume em caixinhas. O fluxo que sai de cada uma é $(\nabla\cdot\vec F)\,dV$ ${F.ret("U01")}. Somando todas, o fluxo pelas faces internas se cancela (o que sai de uma caixinha entra na vizinha), e só sobra o fluxo pela casca de fora ${F.ret("matematica/CE03")}.</p>
        <p>Exemplo: $\vec F = (x, y, z)$ por uma esfera de raio $R$. Na superfície, $\vec F\cdot\hat n = R$, então o fluxo é $R\cdot4\pi R^2 = 4\pi R^3$. Pelo teorema: $\nabla\cdot\vec F = 3$, e $3\cdot\frac43\pi R^3 = 4\pi R^3$. ✓</p>
        <div id="lab-fl"></div>
        ${F.caixa("fisico", R`<p><b>Lei de Gauss, das duas formas</b>. Integral: $\oint\vec E\cdot d\vec A = Q_\text{dentro}/\varepsilon_0$ ${F.ret("C03b")}. Escrevendo $Q = \int\rho\,dV$ e usando o teorema: $\int\nabla\cdot\vec E\,dV = \int\frac{\rho}{\varepsilon_0}dV$ para <b>todo</b> volume, então os integrandos são iguais: $\nabla\cdot\vec E = \rho/\varepsilon_0$. A forma integral serve para contas com simetria; a diferencial vale ponto a ponto.</p>`)}`),

      F.secao("stokes", "Teorema de Stokes e Green", R`
        ${F.formula(R`\oint_{\partial S}\vec F\cdot d\vec l = \int_S(\nabla\times\vec F)\cdot d\vec A\qquad\qquad \text{(plano): }\oint(P\,dx + Q\,dy) = \iint\left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right)dx\,dy`, "Stokes e Green")}
        <p>Mesma ideia: corte a superfície em quadradinhos. A circulação em cada um é $(\nabla\times\vec F)\cdot d\vec A$. Somando, os lados internos são percorridos duas vezes, em sentidos opostos, e se cancelam: sobra só a borda. O sentido da borda e o da normal seguem a regra da mão direita (dedos na borda, polegar na normal).</p>
        <p><b>Green</b> é Stokes no plano. Um truque famoso: com $P = -y/2$ e $Q = x/2$, o integrando vale 1, e a <b>área</b> fica $A = \frac12\oint(x\,dy - y\,dx)$. Para a elipse $x = a\cos t$, $y = b\sin t$: $A = \frac12\int_0^{2\pi}ab\,dt = \pi ab$. É assim que funciona o planímetro, um aparelho que mede áreas de mapas só passeando pela borda.</p>
        ${F.caixa("pegadinha", R`<p><b>Superfície com buraco</b>. Stokes e "rot = 0 ⟹ conservativo" só valem se a superfície não tiver furos. O campo $\vec F = \frac{(-y, x)}{x^2 + y^2}$ tem rot = 0 fora da origem, mas circulação $2\pi$ em qualquer volta em torno dela: a "fonte" de rotação está toda concentrada no eixo (é o campo $\vec B$ de um fio, com outras constantes ${F.ret("C14")}).</p>`)}
        ${F.caixa("fisico", R`<p><b>Ampère na forma diferencial</b>: $\oint\vec B\cdot d\vec l = \mu_0 I = \mu_0\int\vec J\cdot d\vec A$. Com Stokes: $\nabla\times\vec B = \mu_0\vec J$. Dentro de um fio com corrente uniforme, $B = \frac{\mu_0 J r}{2}$ cresce linearmente do centro. A U05 completa a história com a corrente de deslocamento.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule o fluxo de $\vec F = (x, y, z)$ por uma esfera de raio $R$ das duas formas (direto e pelo teorema).</p>`, fig: "", dicas: [R`<p>Na esfera, $\vec F = R\hat n$.</p>`, R`<p>$\nabla\cdot\vec F = 3$.</p>`], resp: R`$4\pi R^3$.`, sol: R`<p>As duas contas batem. Note que o fluxo cresce com $R^3$, como o volume: a fonte está espalhada por todo o espaço.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule o fluxo de $\vec F = (x^2, 0, 0)$ para fora do cubo $0 \le x, y, z \le 1$, pelo teorema da divergência e direto.</p>`, fig: "", dicas: [R`<p>$\nabla\cdot\vec F = 2x$; integre no cubo.</p>`, R`<p>Direto: só as faces $x = 0$ e $x = 1$ têm fluxo.</p>`], resp: R`1.`, sol: R`<p>$\int_0^1 2x\,dx = 1$. Direto: na face $x = 1$, $F_x = 1$ e área 1 (fluxo 1); na face $x = 0$, $F_x = 0$. Total 1. ✓</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Calcule a circulação de $\vec v = (-y, x, 0)$ num círculo de raio $R$ (anti-horário), direto e por Stokes.</p>`, fig: "", dicas: [R`<p>Direto: $|\vec v| = R$, tangente.</p>`, R`<p>Stokes: $(\nabla\times\vec v)_z = 2$.</p>`], resp: R`$2\pi R^2$.`, sol: R`<p>$R\cdot2\pi R = 2\cdot\pi R^2$. ✓</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Use a fórmula de Green $A = \frac12\oint(x\,dy - y\,dx)$ para calcular a área da elipse $x = a\cos t$, $y = b\sin t$.</p>`, fig: "", dicas: [R`<p>$dx = -a\sin t\,dt$, $dy = b\cos t\,dt$.</p>`, R`<p>$x\,dy - y\,dx = ab(\cos^2 t + \sin^2 t)\,dt$.</p>`], resp: R`$\pi ab$.`, sol: R`<p>Com $a = b$, volta $\pi R^2$. A 2ª lei de Kepler (áreas iguais em tempos iguais) usa exatamente $\frac12(x\dot y - y\dot x) = \frac{L}{2m}$.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Dentro de uma esfera com densidade de carga uniforme $\rho$, o campo é $\vec E = \frac{\rho}{3\varepsilon_0}\vec r$. Confira que $\nabla\cdot\vec E = \rho/\varepsilon_0$.</p>`, fig: "", dicas: [R`<p>$\nabla\cdot\vec r = 3$.</p>`, R`<p>Constantes saem da derivada.</p>`], resp: R`$\frac{\rho}{3\varepsilon_0}\cdot3 = \frac{\rho}{\varepsilon_0}$. ✓`, sol: R`<p>Fora da esfera, $\vec E \propto \hat r/r^2$ tem div zero (U01): também bate, pois lá $\rho = 0$.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Um fio de raio $a = 1$ mm leva 10 A distribuídos uniformemente. Use $\nabla\times\vec B = \mu_0\vec J$ (ou Ampère integral) para achar $B$ a 0,5 mm do eixo.</p>`, fig: "", dicas: [R`<p>Corrente dentro do raio $r$: $I\frac{r^2}{a^2}$.</p>`, R`<p>$B\cdot2\pi r = \mu_0 I\frac{r^2}{a^2}$.</p>`], resp: R`$B = \frac{\mu_0 I r}{2\pi a^2} = 1$ mT.`, sol: R`<p>$\frac{4\pi\times10^{-7}\cdot10\cdot5\times10^{-4}}{2\pi\cdot10^{-6}} = 10^{-3}$ T. Na superfície, 2 mT; fora, cai como $1/r$.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Calcule a circulação de $\vec F = (y, 0)$ no quadrado de vértices $(0,0)$, $(1,0)$, $(1,1)$, $(0,1)$, percorrido no sentido anti-horário. Confira com Green. (É a "correnteza" da simulação da U01.)</p>`, fig: "", dicas: [R`<p>Só o lado de cima ($y = 1$) contribui; nele você anda de $x = 1$ para $x = 0$.</p>`, R`<p>Green: $\partial_x Q - \partial_y P = 0 - 1$.</p>`], resp: R`$-1$.`, sol: R`<p>Lado de baixo: $y = 0$, $F = 0$. Laterais: $dx = 0$. Lado de cima: $\int_1^0 1\,dx = -1$. Green: $\iint(-1)\,dA = -1$. ✓ Linhas retas, circulação não nula: o rotacional mede cisalhamento, não curvatura.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-fl"); e.outerHTML = F.lab("Fluxo por uma curva fechada", "lab-fl"); SIM.fluxoCargas(document.getElementById("lab-fl"), F); },
});
