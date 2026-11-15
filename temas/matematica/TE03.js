/* TE03 · Teoremas de Pappus–Guldin. Conferido em Python:
   toro R = 3, r = 1: V = 2π²Rr² = 59,22, A = 4π²Rr = 118,4; centroide do meio disco 4r/(3π) = 0,4244r; do arco de semicírculo 2r/π = 0,6366r;
   retângulo 1 × 3 a 2 do eixo: V = 2π·2,5·3 = 47,12 (= π(3² − 2²)·3); triângulo equilátero de lado 2 com centroide a 5 do eixo: V = 54,41, A = 188,5. */
F.registrar("matematica/TE03", {
  retoma: ["CI09", "CII07"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Volumes e centroides por Pappus",
      casos: [
        { nome: "Toro (rosquinha)", gerar: (p) => {
          const Rr = p ? 3 : F.escolha([2, 3, 4, 5, 10]), r = p ? 1 : F.escolha([0.5, 1, 1.5]);
          return { enun: R`<p>Um círculo de raio $r = ${F.n(r)}$ cm gira em volta de um eixo no seu plano, a $R = ${Rr}$ cm do centro. Qual o volume e a área da superfície do toro gerado?</p>`, fig: "",
            passos: [
              R`<p>Volume (2º teorema): área $\pi r^2 = ${F.n(r * r)}\pi$ e o centroide percorre $2\pi R = ${2 * Rr}\pi$. $V = ${F.n(r * r)}\pi\cdot${2 * Rr}\pi = ${F.n(2 * Rr * r * r)}\pi^2 \approx ${F.n(2 * Math.PI ** 2 * Rr * r * r, 2)}$ cm³.</p>`,
              R`<p>Área (1º teorema): a curva (circunferência) tem comprimento $2\pi r = ${F.n(2 * r)}\pi$ e o centroide dela também está a $R$: $A = ${F.n(2 * r)}\pi\cdot${2 * Rr}\pi = ${F.n(4 * Rr * r)}\pi^2 \approx ${F.n(4 * Math.PI ** 2 * Rr * r, 2)}$ cm².</p>`,
              R`<p>Sem integral nenhuma. Repare que $V = \pi r^2\cdot2\pi R$ é como "desenrolar" o toro num cilindro de comprimento $2\pi R$: o lado de dentro encolhe e o de fora estica, e as duas coisas se compensam exatamente no centroide.</p>`,
            ] };
        } },
        { nome: "Achar um centroide ao contrário", gerar: (p) => {
          const forma = p ? "meio disco" : F.escolha(["meio disco", "quarto de disco", "triângulo retângulo"]), r = p ? 3 : F.escolha([1, 2, 3, 6]);
          const dados = {
            "meio disco": [R`um meio disco de raio ${r}, girando em volta do diâmetro, gera uma esfera`, R`$V = \frac43\pi\cdot${r}^3 = ${F.n((4 * r ** 3) / 3)}\pi$ e $A = \frac{\pi\cdot${r}^2}{2}$`, (4 * r) / (3 * Math.PI), R`\frac{4r}{3\pi}`],
            "quarto de disco": [R`um quarto de disco de raio ${r}, girando em volta de um dos raios retos, gera meia esfera`, R`$V = \frac23\pi\cdot${r}^3$ e $A = \frac{\pi\cdot${r}^2}{4}$`, (4 * r) / (3 * Math.PI), R`\frac{4r}{3\pi}`],
            "triângulo retângulo": [R`um triângulo retângulo de catetos ${r} (horizontal) e ${2 * r} (no eixo), girando em volta do cateto vertical, gera um cone`, R`$V = \frac13\pi\cdot${r}^2\cdot${2 * r}$ e $A = \frac{${r}\cdot${2 * r}}{2}$`, r / 3, R`\frac{a}{3}`],
          }[forma];
          return { enun: R`<p>Use Pappus ao contrário para achar a distância do centroide ao eixo: ${dados[0]}.</p>`, fig: "",
            passos: [R`<p>Conhecemos o volume e a área: ${dados[1]}.</p>`, R`<p>Pappus: $V = 2\pi\bar xA \Rightarrow \bar x = \frac{V}{2\pi A}$.</p>`, R`<p>$\bar x = ${dados[3]} \approx ${F.n(dados[2], 4)}$. Sem integral dupla ${F.ret("CII07")}.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O anel de seção triangular",
      enun: R`<p>Um triângulo equilátero de lado $a = 2$ cm gira em volta de um eixo no seu plano, paralelo a um dos lados, de modo que o centroide do triângulo fica a $d = 5$ cm do eixo (e o triângulo não cruza o eixo). (a) Qual o volume do anel gerado? (b) Qual a área da superfície? (c) Confira o volume pelo método das arruelas ${F.ret("CI09")}, supondo o lado paralelo ao eixo do lado de dentro. (d) Por que o teorema exigiria uma correção se o triângulo cruzasse o eixo?</p>`,
      fig: "",
      dicas: [R`<p>(b) O 1º teorema usa o centroide da <b>curva</b> (o perímetro). No triângulo equilátero, por simetria, ele coincide com o centroide da área.</p>`, R`<p>(c) Altura do triângulo: $h = \sqrt3$. O lado de dentro fica a $x_1 = d - h/3$; a uma "altura" $u$ medida desse lado (na direção perpendicular ao eixo), a largura da fatia é $a(1 - u/h)$.</p>`],
      sol: R`<p><b>(a)</b> Área: $\frac{\sqrt3}{4}a^2 = \sqrt3$ cm². $V = 2\pi\cdot5\cdot\sqrt3 = 10\sqrt3\,\pi \approx 54{,}4$ cm³.</p>
        <p><b>(b)</b> Perímetro $3a = 6$ cm, centroide do perímetro a 5 cm: $A = 2\pi\cdot5\cdot6 = 60\pi \approx 188{,}5$ cm².</p>
        <p><b>(c)</b> Agora o eixo é vertical, e o triângulo tem um lado vertical a $x_1 = 5 - \frac{\sqrt3}{3}$ e o vértice oposto em $x_1 + \sqrt3$. Use cascas cilíndricas: $V = \int 2\pi x\cdot(\text{altura da fatia em } x)\,dx = \int_{x_1}^{x_1 + h}2\pi x\cdot a\left(1 - \frac{x - x_1}{h}\right)dx$. Com $u = x - x_1$: $2\pi a\int_0^h(x_1 + u)(1 - u/h)\,du = 2\pi a\left(x_1\frac h2 + \frac{h^2}{6}\right) = 2\pi\cdot\frac{ah}{2}\left(x_1 + \frac h3\right) = 2\pi A\cdot5$. ✓ (A conta mostra por que o teorema funciona: a integral das cascas é $2\pi\int x\,dA = 2\pi\bar xA$.)</p>
        <p><b>(d)</b> Se a figura cruzasse o eixo, as duas partes varreriam o mesmo espaço (o sólido "se sobrepõe"), e a fórmula $2\pi\int x\,dA$ contaria a parte do lado negativo com sinal trocado. O teorema vale para figuras inteiramente de um lado do eixo.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo · teoremas</div>
        <div class="q">Dá para achar o volume de uma rosquinha sem integral?</div>
        <p>Dá, em uma linha. Por volta do ano 320, Pappus de Alexandria observou que o volume de um sólido de revolução é a área da figura vezes a distância que o centro dela percorre. Paul Guldin redescobriu a regra em 1640. Com o cálculo, a demonstração cabe numa linha, e o teorema vira uma máquina de dois sentidos: dá volumes a partir de centroides, e centroides a partir de volumes.</p></div>`),

      F.secao("teoremas", "Os dois teoremas", R`
        ${F.formula(R`\text{(1º) } A_\text{sup} = 2\pi\,\bar x_c\,L\qquad\qquad \text{(2º) } V = 2\pi\,\bar x\,A`, "Teoremas de Pappus–Guldin")}
        <ul><li><b>1º (superfícies)</b>: uma curva de comprimento $L$ gira em volta de um eixo do seu plano, sem cruzá-lo. A área da superfície gerada é $L$ vezes a distância percorrida pelo centroide da curva, $2\pi\bar x_c$.</li>
          <li><b>2º (volumes)</b>: uma figura plana de área $A$ gira em volta de um eixo do seu plano, sem cruzá-lo. O volume é $A$ vezes a distância percorrida pelo centroide da figura, $2\pi\bar x$.</li></ul>
        ${F.demo("2º teorema", R`<p>Cada pedacinho $dA$ da figura, a uma distância $x$ do eixo, varre um anel de volume $2\pi x\,dA$ (é o método das cascas ${F.ret("CI09")}). Somando: $V = \iint 2\pi x\,dA = 2\pi\iint x\,dA$. Pela definição de centroide ${F.ret("CII07")}, $\iint x\,dA = \bar xA$. Logo $V = 2\pi\bar xA$.</p>`)}
        ${F.demo("1º teorema", R`<p>Cada pedacinho $ds$ da curva, a uma distância $x$ do eixo, varre uma "fita" de área $2\pi x\,ds$. Somando: $A = \int 2\pi x\,ds = 2\pi\bar x_cL$, com $\bar x_c = \frac1L\int x\,ds$ (centroide da curva).</p>`)}
        <div id="lab-pp"></div>
        ${F.caixa("pegadinha", R`<p><b>Centroide da curva ≠ centroide da área.</b> No semicírculo de raio $r$, o centroide da área (meio disco) está a $\frac{4r}{3\pi} \approx 0{,}42r$ do diâmetro, mas o do arco está a $\frac{2r}{\pi} \approx 0{,}64r$: o arco tem toda a "massa" longe do centro. Use o certo para cada teorema.</p>`)}`),

      F.secao("aplicacoes", "Usos", R`
        <table class="tb"><tr><th>figura que gira</th><th>sólido</th><th>Pappus dá</th></tr>
          <tr><td>círculo de raio $r$, centro a $R$ do eixo</td><td>toro</td><td>$V = 2\pi^2Rr^2$, $A = 4\pi^2Rr$</td></tr>
          <tr><td>triângulo retângulo (catetos $a$ e $h$, gira no $h$)</td><td>cone</td><td>$V = 2\pi\frac a3\cdot\frac{ah}{2} = \frac{\pi a^2h}{3}$</td></tr>
          <tr><td>retângulo $a \times b$ a $d$ do eixo</td><td>tubo</td><td>$V = 2\pi\left(d + \frac a2\right)ab$</td></tr>
          <tr><td>segmento de comprimento $s$ do eixo até $a$</td><td>superfície lateral do cone</td><td>$A = 2\pi\frac a2s = \pi as$</td></tr></table>
        <p><b>Ao contrário</b>: sabendo o volume da esfera, o meio disco que a gera tem o centroide em $\bar x = \frac{4\pi r^3/3}{2\pi\cdot\pi r^2/2} = \frac{4r}{3\pi}$. Sabendo a área da esfera, o arco de semicírculo tem o centroide em $\frac{4\pi r^2}{2\pi\cdot\pi r} = \frac{2r}{\pi}$.</p>
        ${F.caixa("olimpiada", R`<p><b>Na física</b>, o centroide é o centro de massa de uma placa uniforme. Pappus ao contrário é um jeito rápido de achar centros de massa em problemas de olimpíada (meio disco, arco, setor). E, ao contrário, quando a questão dá o centro de massa, o volume sai de graça.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule o volume e a área da superfície de um toro com $R = 3$ cm e $r = 1$ cm.</p>`, fig: "", dicas: [R`<p>$V = \pi r^2\cdot2\pi R$.</p>`, R`<p>$A = 2\pi r\cdot2\pi R$.</p>`], resp: R`$V = 6\pi^2 \approx 59{,}2$ cm³; $A = 12\pi^2 \approx 118{,}4$ cm².`, sol: R`<p>Repare que $dV/dr = A$: engordar o toro um pouquinho acrescenta uma casca de área $A$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Use Pappus e o volume da esfera para achar o centroide de um meio disco de raio $r$.</p>`, fig: "", dicas: [R`<p>O meio disco girando no diâmetro gera a esfera.</p>`, R`<p>$\bar x = V/(2\pi A)$.</p>`], resp: R`$\bar x = \frac{4r}{3\pi} \approx 0{,}424r$.`, sol: R`<p>Pela integral dupla, daria $\frac{1}{A}\iint y\,dA$ em polares: mais trabalho, mesmo resultado.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Use Pappus e a área da esfera para achar o centroide de um arco de semicírculo de raio $r$.</p>`, fig: "", dicas: [R`<p>O arco girando no diâmetro gera a superfície esférica.</p>`, R`<p>$\bar x_c = \frac{A}{2\pi L}$, com $L = \pi r$.</p>`], resp: R`$\bar x_c = \frac{2r}{\pi} \approx 0{,}637r$.`, sol: R`<p>Mais longe que o do meio disco, como esperado.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Deduza o volume do cone de raio $a$ e altura $h$ com Pappus (o centroide de um triângulo fica a 1/3 da distância de cada lado até o vértice oposto).</p>`, fig: "", dicas: [R`<p>Gire o triângulo retângulo de catetos $a$ e $h$ em volta do cateto $h$.</p>`, R`<p>O centroide fica a $a/3$ do eixo.</p>`], resp: R`$V = 2\pi\cdot\frac a3\cdot\frac{ah}{2} = \frac{\pi a^2h}{3}$.`, sol: R`<p>O "1/3" do cone vem do "1/3" do centroide do triângulo.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Um retângulo de 1 cm × 3 cm, com o lado de 3 cm paralelo ao eixo e a 2 cm dele, gira em volta do eixo. Qual o volume do tubo? Confira pela diferença de cilindros.</p>`, fig: "", dicas: [R`<p>Centroide a $2 + 0{,}5 = 2{,}5$ cm.</p>`, R`<p>Tubo: raio externo 3, interno 2, altura 3.</p>`], resp: R`$V = 2\pi\cdot2{,}5\cdot3 = 15\pi \approx 47{,}1$ cm³.`, sol: R`<p>$\pi(3^2 - 2^2)\cdot3 = 15\pi$. ✓</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Deduza a área lateral de um cone de raio $a$ e geratriz $s$ pelo 1º teorema.</p>`, fig: "", dicas: [R`<p>A geratriz é um segmento que vai do eixo (vértice) até a distância $a$.</p>`, R`<p>O centroide de um segmento é o ponto médio.</p>`], resp: R`$A = 2\pi\cdot\frac a2\cdot s = \pi as$.`, sol: R`<p>Abrindo o cone, ele vira um setor de círculo de raio $s$ e arco $2\pi a$: área $\frac12\cdot s\cdot2\pi a = \pi as$. ✓</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Use Pappus duas vezes para mostrar que o centroide de um quarto de disco de raio $r$ fica no ponto $\left(\frac{4r}{3\pi}, \frac{4r}{3\pi}\right)$.</p>`, fig: "", dicas: [R`<p>Girando em volta de um dos raios retos, gera meia esfera.</p>`, R`<p>Pela simetria, as duas coordenadas são iguais.</p>`], resp: R`$\bar x = \frac{\frac23\pi r^3}{2\pi\cdot\frac{\pi r^2}{4}} = \frac{4r}{3\pi}$, e o mesmo para $\bar y$.`, sol: R`<p>É o mesmo $\frac{4r}{3\pi}$ do meio disco: faz sentido, porque o meio disco é a união de dois quartos simétricos.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-pp"); e.outerHTML = F.lab("Volume de revolução por dois caminhos", "lab-pp"); SIM.pappus(document.getElementById("lab-pp"), F); },
});
