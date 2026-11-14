/* F02 · Vetores. Conferido em Python: |3 + 4| a 60° = √37 ≈ 6,08, a 120° = √13 ≈ 3,61; 10 N a 30°: (8,66; 5);
   hexágono regular de lado 1: AB + AC + AD + AE + AF = 3·AD, módulo 6; barco 5 m/s, rio 3 m/s, 80 m: 16 s e 48 m (direto) ou 20 s (em frente, 36,9° rio acima). */
F.registrar("F02", {
  retoma: ["F01", "F03"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Operações com vetores",
      casos: [
        { nome: "Soma pela lei dos cossenos", gerar: (p) => {
          const a = p ? 3 : F.escolha([2, 3, 5, 6]), b = p ? 4 : F.escolha([3, 4, 8]), th = p ? 60 : F.escolha([30, 60, 90, 120, 150]), c = Math.cos((th * Math.PI) / 180), S = Math.sqrt(a * a + b * b + 2 * a * b * c);
          return { enun: R`<p>Duas forças de ${a} N e ${b} N fazem um ângulo de ${th}° entre si. Qual o módulo da resultante?</p>`, fig: "",
            passos: [R`<p>$|\vec A + \vec B|^2 = (\vec A + \vec B)\cdot(\vec A + \vec B) = A^2 + B^2 + 2AB\cos\theta$.</p>`, R`<p>$= ${a * a} + ${b * b} + 2\cdot${a}\cdot${b}\cdot(${F.n(c, 4)}) = ${F.n(S * S, 3)}$.</p>`, R`<p>$|\vec A + \vec B| \approx ${F.n(S, 3)}$ N. Confira: está entre $|${a} - ${b}| = ${Math.abs(a - b)}$ e $${a} + ${b} = ${a + b}$, como sempre.</p>`] };
        } },
        { nome: "Ângulo pelo produto escalar", gerar: (p) => {
          const L = [[[1, 2, 2], [2, 1, -2]], [[1, 1, 0], [1, 0, 1]], [[3, 4, 0], [4, 3, 0]], [[1, 0, 0], [1, 1, 1]]], [u, v] = p ? L[0] : F.escolha(L);
          const d = u[0] * v[0] + u[1] * v[1] + u[2] * v[2], nu = Math.hypot(...u), nv = Math.hypot(...v), ang = (Math.acos(d / (nu * nv)) * 180) / Math.PI;
          return { enun: R`<p>Qual o ângulo entre $\vec u = (${u.join(", ")})$ e $\vec v = (${v.join(", ")})$?</p>`, fig: "",
            passos: [R`<p>$\vec u\cdot\vec v = ${u.map((x, i) => `(${x})(${v[i]})`).join(" + ")} = ${d}$.</p>`, R`<p>$|\vec u| = ${F.n(nu, 4)}$, $|\vec v| = ${F.n(nv, 4)}$.</p>`, R`<p>$\cos\theta = \frac{${d}}{${F.n(nu * nv, 4)}}$, $\theta \approx ${F.n(ang, 2)}°$.${d === 0 ? " Produto escalar zero: perpendiculares." : ""}</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O hexágono e a soma de cinco vetores",
      enun: R`<p>ABCDEF é um hexágono regular de lado 1. (a) Mostre que $\vec{AB} + \vec{AC} + \vec{AD} + \vec{AE} + \vec{AF} = 3\vec{AD}$ e calcule o módulo. (b) Seja O o centro. Quanto vale $\vec{OA} + \vec{OB} + \cdots + \vec{OF}$? Use isso para refazer (a) em uma linha. (c) Generalize: num polígono regular de $n$ lados, quanto vale a soma dos $n - 1$ vetores que saem de um vértice para os outros?</p>`,
      fig: "",
      dicas: [R`<p>(a) Agrupe em pares simétricos em relação à diagonal AD: $\vec{AB} + \vec{AF}$ e $\vec{AC} + \vec{AE}$.</p>`, R`<p>(b) Escreva $\vec{AX} = \vec{OX} - \vec{OA}$.</p>`],
      sol: R`<p><b>(a)</b> Pela simetria em relação a AD, as componentes perpendiculares a AD se cancelam aos pares. $\vec{AB} + \vec{AF}$ tem componente ao longo de AD igual a $2\cdot\cos60° = 1$ (é $\vec{AO}$, metade de $\vec{AD}$). $\vec{AC} + \vec{AE}$: cada um tem componente $\sqrt3\cos30° = \frac32$, somando 3 $= \frac32|\vec{AD}|$. Total: $\frac12\vec{AD} + \frac32\vec{AD} + \vec{AD} = 3\vec{AD}$, módulo $3\cdot2 = 6$.</p>
        <p><b>(b)</b> A soma dos seis vetores do centro é <b>zero</b> (girar o hexágono de 60° não muda a soma, então ela é um vetor igual ao seu girado: só pode ser zero). Então $\sum_{X \neq A}\vec{AX} = \sum_X(\vec{OX} - \vec{OA}) = 0 - 6\vec{OA} = 6\vec{AO} = 3\vec{AD}$.</p>
        <p><b>(c)</b> Mesmo argumento: $\sum_{X\neq A}\vec{AX} = n\vec{AO}$, um vetor de módulo $nR$ ($R$ = raio do círculo circunscrito) apontando para o centro. Conferido numericamente para o hexágono (módulo 6).</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Fundamentos · vetores</div>
        <div class="q">3 + 4 pode dar 5?</div>
        <p>Pode, se forem 3 passos para o leste e 4 para o norte: você termina a 5 passos de onde saiu. Grandezas com direção (deslocamento, velocidade, força) não se somam como números. Para elas existe o <b>vetor</b>: módulo, direção e sentido, com regras próprias de soma e de produto.</p></div>`),

      F.secao("soma", "Componentes e soma", R`
        ${F.formula(R`\vec A = A_x\hat\imath + A_y\hat\jmath + A_z\hat k,\qquad |\vec A| = \sqrt{A_x^2 + A_y^2 + A_z^2},\qquad A_x = A\cos\theta,\ A_y = A\sin\theta`, "Componentes")}
        <p>Somar vetores é somar componente a componente: $\vec A + \vec B = (A_x + B_x, A_y + B_y, A_z + B_z)$. Geometricamente, é a regra do paralelogramo (ou "ponta com cauda"). Subtrair é somar o oposto: $\vec A - \vec B$ vai da ponta de $\vec B$ à ponta de $\vec A$.</p>
        <p>O módulo da soma sai da <b>lei dos cossenos</b> ${F.ret("F03")}: $|\vec A + \vec B|^2 = A^2 + B^2 + 2AB\cos\theta$, com $\theta$ o ângulo <b>entre</b> os vetores. Casos: $\theta = 0$ dá $A + B$; $\theta = 180°$ dá $|A - B|$; $\theta = 90°$ dá Pitágoras.</p>
        <div id="lab-vet"></div>`),

      F.secao("produtos", "Produto escalar e produto vetorial", R`
        ${F.formula(R`\vec A\cdot\vec B = AB\cos\theta = A_xB_x + A_yB_y + A_zB_z\qquad\qquad |\vec A\times\vec B| = AB\sin\theta`, "Os dois produtos")}
        <p>O <b>produto escalar</b> dá um número: $A$ vezes a projeção de $\vec B$ sobre $\vec A$. Zero quando são perpendiculares. Na física: trabalho $W = \vec F\cdot\vec d$, potência $P = \vec F\cdot\vec v$, fluxo $\vec E\cdot\vec A$.</p>
        <p>O <b>produto vetorial</b> dá um vetor perpendicular aos dois, com sentido pela regra da mão direita e módulo igual à área do paralelogramo. Em componentes:</p>
        ${F.formula(R`\vec A\times\vec B = \begin{vmatrix}\hat\imath & \hat\jmath & \hat k\\ A_x & A_y & A_z\\ B_x & B_y & B_z\end{vmatrix} = (A_yB_z - A_zB_y,\ A_zB_x - A_xB_z,\ A_xB_y - A_yB_x)`)}
        <p>Na física: torque $\vec\tau = \vec r\times\vec F$, momento angular $\vec L = \vec r\times\vec p$, força magnética $q\vec v\times\vec B$ ${F.ret("C13")}. Cuidado: $\vec A\times\vec B = -\vec B\times\vec A$ (a ordem importa).</p>
        ${F.caixa("olimpiada", R`<p><b>Truques de prova:</b> (1) Para decompor uma força num plano inclinado, escolha os eixos ao longo e perpendicular ao plano: a conta fica muito mais curta. (2) O módulo de $\vec A\times\vec B$ dá a área de um triângulo de vértices dados: $\frac12|\vec{AB}\times\vec{AC}|$. (3) $\vec A\cdot(\vec B\times\vec C)$ é o volume do paralelepípedo.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Duas forças de 3 N e 4 N fazem 60° entre si. Qual a resultante? E se o ângulo for 120°?</p>`, fig: "", dicas: [R`<p>Lei dos cossenos com o ângulo entre os vetores.</p>`], resp: R`$\sqrt{37} \approx 6{,}1$ N; $\sqrt{13} \approx 3{,}6$ N.`, sol: R`<p>$|R|^2 = 9 + 16 + 2\cdot3\cdot4\cos60° = 25 + 12 = 37$, então $|R| \approx 6{,}08$ N. Com 120°, o cosseno é $-\frac12$: $25 - 12 = 13$, $|R| \approx 3{,}61$ N. (7 N só se as forças fossem paralelas; 5 N se fossem perpendiculares.)</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Decomponha uma força de 10 N que faz 30° com a horizontal.</p>`, fig: "", dicas: [R`<p>$F_x = F\cos\theta$.</p>`], resp: R`$F_x \approx 8{,}66$ N, $F_y = 5$ N.`, sol: R`<p>$10\cos30° = 5\sqrt3$, $10\sin30° = 5$.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Mostre que $\vec u = (1, 2, 2)$ e $\vec v = (2, 1, -2)$ são perpendiculares e calcule $\vec u\times\vec v$.</p>`, fig: "", dicas: [R`<p>Produto escalar.</p>`, R`<p>Use o determinante.</p>`], resp: R`$\vec u\cdot\vec v = 0$; $\vec u\times\vec v = (-6, 6, -3)$.`, sol: R`<p>$(2\cdot(-2) - 2\cdot1,\ 2\cdot2 - 1\cdot(-2),\ 1\cdot1 - 2\cdot2) = (-6, 6, -3)$, de módulo 9 $= |\vec u||\vec v| = 3\cdot3$ (são perpendiculares, $\sin\theta = 1$).</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Calcule a área do triângulo de vértices $(0, 0)$, $(4, 0)$ e $(1, 3)$ usando produto vetorial.</p>`, fig: "", dicas: [R`<p>Área $= \frac12|\vec{AB}\times\vec{AC}|$.</p>`], resp: R`6.`, sol: R`<p>$(4, 0, 0)\times(1, 3, 0) = (0, 0, 12)$; metade: 6. Confira com base × altura / 2 $= 4\cdot3/2$.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Três forças de mesmo módulo $F$ fazem 120° entre si, duas a duas. Qual a resultante?</p>`, fig: "", dicas: [R`<p>Gire o desenho de 120°: o que acontece com a soma?</p>`], resp: R`Zero.`, sol: R`<p>A soma é igual a ela mesma girada de 120°, então é zero. É o mesmo argumento do chefão.</p>` }),
        F.exercicio({ n: 6, enun: R`<p>Uma força $\vec F = (3, 4)$ N desloca um bloco de $\vec d = (5, 0)$ m. Qual o trabalho? E se $\vec d = (0, 5)$ m?</p>`, fig: "", dicas: [R`<p>$W = \vec F\cdot\vec d$.</p>`], resp: R`15 J; 20 J.`, sol: R`<p>Só a componente da força ao longo do deslocamento trabalha.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Um barco anda a 5 m/s em relação à água, num rio de 80 m com correnteza de 3 m/s. (a) Para chegar no ponto bem em frente, para onde ele aponta, e quanto demora? (b) Para atravessar no menor tempo, para onde aponta, quanto demora e onde chega?</p>`, fig: "", dicas: [R`<p>(a) A componente rio acima da velocidade do barco precisa cancelar a correnteza.</p>`, R`<p>(b) O tempo só depende da componente perpendicular.</p>`], resp: R`(a) $36{,}9°$ rio acima (em relação à perpendicular), 20 s; (b) perpendicular, 16 s, 48 m rio abaixo.`, sol: R`<p>(a) $5\sin\alpha = 3 \Rightarrow \alpha \approx 36{,}9°$; componente de travessia $5\cos\alpha = 4$ m/s; $80/4 = 20$ s. (b) $80/5 = 16$ s; arrasto $3\cdot16 = 48$ m.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-vet"); e.outerHTML = F.lab("Soma, diferença e produtos de dois vetores", "lab-vet"); SIM.vetores(document.getElementById("lab-vet"), F); },
});
