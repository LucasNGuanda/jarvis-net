/* O09 · Lentes (base: Halliday vol. 4, cap. 34, com as minhas palavras; convenção de sinais da escola: real positivo).
   Conferido em Python (scratchpad opt.py): f = 10 cm, p = 30 → p′ = 15, A = −0,5; p = 15 → 30, A = −2; p = 5 → −10, A = +2; divergente f = −10, p = 20 → −6,67, A = +1/3;
   biconvexa R = 20 cm, n = 1,5 → f = 20 cm; lentes 10 + 20 cm juntas → 6,67 cm; hipermetrope (ponto próximo 50 cm) → +2 di; míope (ponto remoto 2 m) → −0,5 di; distância mínima objeto–imagem = 4f. */
F.registrar("O09", {
  retoma: ["O08"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Onde e como fica a imagem",
      casos: [
        { nome: "Equação de Gauss", gerar: (p) => {
          const f = p ? 10 : F.escolha([-15, -10, 8, 10, 12, 20]), pp0 = p ? 30 : F.escolha([5, 6, 15, 24, 30, 40, 60].filter((v) => v !== f));
          const pl = 1 / (1 / f - 1 / pp0), A = -pl / pp0;
          return { enun: R`<p>Um objeto de 2 cm está a ${pp0} cm de uma lente ${f > 0 ? "convergente" : "divergente"} de distância focal $f = ${f}$ cm. Onde se forma a imagem, de que tamanho, e como ela é?</p>`, fig: "",
            passos: [
              R`<p>Gauss: $\frac1f = \frac1p + \frac1{p'}$. Então $\frac1{p'} = \frac1{${f}} - \frac1{${pp0}}$.</p>`,
              R`<p>$p' = ${F.n(pl, 2)}$ cm. ${pl > 0 ? "Positivo: imagem <b>real</b>, do outro lado da lente (dá para projetar numa tela)." : "Negativo: imagem <b>virtual</b>, do mesmo lado do objeto (só se vê olhando através da lente)."}</p>`,
              R`<p>Aumento: $A = -\frac{p'}{p} = ${F.n(A, 3)}$. Tamanho: $${F.n(2 * Math.abs(A), 2)}$ cm, ${A < 0 ? "invertida" : "direita"} e ${Math.abs(A) > 1 ? "maior" : "menor"} que o objeto.</p>`,
              R`<p>Confira no laboratório com $f = ${f}$ e $p = ${pp0}$.</p>`,
            ] };
        } },
        { nome: "Fabricante de lentes", gerar: (p) => {
          const n = p ? 1.5 : F.escolha([1.5, 1.6]), R1 = p ? 20 : F.escolha([10, 20, 30]), tipo = p ? "bi" : F.escolha(["bi", "plano"]);
          const inv = (n - 1) * (tipo === "bi" ? 2 / R1 : 1 / R1), f = 1 / inv;
          return { enun: R`<p>Uma lente ${tipo === "bi" ? "biconvexa simétrica" : "plano-convexa"} de vidro ($n = ${F.n(n)}$) tem ${tipo === "bi" ? "as duas faces" : "a face curva"} com raio de ${R1} cm. Qual a distância focal no ar? E dentro da água ($n = 1{,}33$)?</p>`, fig: "",
            passos: [
              R`<p>Equação dos fabricantes: $\frac1f = \left(\frac{n_\text{lente}}{n_\text{meio}} - 1\right)\left(\frac1{R_1} + \frac1{R_2}\right)$ (raios das faces convexas positivos; face plana tem $R = \infty$).</p>`,
              R`<p>No ar: $\frac1f = ${F.n(n - 1, 2)}\cdot${tipo === "bi" ? R`\frac{2}{${R1}}` : R`\frac{1}{${R1}}`} \Rightarrow f = ${F.n(f, 1)}$ cm.</p>`,
              R`<p>Na água: $\frac{${F.n(n)}}{1{,}33} - 1 = ${F.n(n / 1.33 - 1, 3)}$, então $f = ${F.n(1 / ((n / 1.33 - 1) * (tipo === "bi" ? 2 / R1 : 1 / R1)), 1)}$ cm: bem mais fraca. Por isso, embaixo d'água, tudo fica borrado (a córnea perde quase toda a sua força), e a máscara de mergulho resolve devolvendo uma camada de ar na frente do olho.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A tela, a lente e o 4f",
      enun: R`<p>(a) Uma lente convergente de distância focal $f$ forma uma imagem real de um objeto numa tela. Mostre que a distância objeto–tela $L = p + p'$ é no mínimo $4f$. (b) Com $L > 4f$ fixo, existem <b>duas</b> posições da lente que dão imagem nítida na tela, separadas por $d$. Mostre que $f = \frac{L^2 - d^2}{4L}$ (método de Bessel, usado para medir $f$ sem saber onde fica o "centro" da lente). (c) Com $L = 100$ cm e $d = 60$ cm, quanto vale $f$?</p>`,
      fig: "",
      dicas: [R`<p>(a) $L(p) = p + \frac{pf}{p - f}$, para $p > f$. Derive e iguale a zero ${F.ret("matematica/CI05")}.</p>`, R`<p>(b) $p + p' = L$ e $\frac1p + \frac1{p'} = \frac1f$ viram $p^2 - Lp + Lf = 0$. As duas raízes são as duas posições; a diferença entre elas é $d$.</p>`],
      sol: R`<p><b>(a)</b> $L'(p) = 1 - \frac{f^2}{(p - f)^2} = 0 \Rightarrow p = 2f$, e então $p' = 2f$ e $L_\text{mín} = 4f$ (é mínimo porque $L \to \infty$ nas duas pontas). Com a tela mais perto que $4f$, não há imagem real.</p>
        <p><b>(b)</b> $p^2 - Lp + Lf = 0$ tem raízes $p = \frac{L \pm\sqrt{L^2 - 4Lf}}{2}$. A diferença é $d = \sqrt{L^2 - 4Lf}$, e isolando: $f = \frac{L^2 - d^2}{4L}$ ∎. Repare na simetria: as duas posições são $p$ e $p'$ trocados.</p>
        <p><b>(c)</b> $f = \frac{10\,000 - 3600}{400} = 16$ cm. Confira: as posições são $p = 20$ cm ($p' = 80$) e $p = 80$ cm ($p' = 20$), e $\frac1{20} + \frac1{80} = \frac1{16}$ ✓.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Óptica · lentes</div>
        <div class="q">Como uma lente "sabe" juntar todos os raios num ponto só?</div>
        <p>Cada pedacinho dela é um pequeno prisma, mais inclinado perto da borda. Os raios da borda desviam mais, os do meio quase nada, e todos chegam juntos ao foco. Daqui saem os óculos, a câmera, o projetor, o microscópio e o seu próprio olho, que é uma lente que muda de foco.</p></div>`),

      F.secao("tipos", "Tipos de lente e raios principais", R`
        <p>No ar, lentes de bordas finas (biconvexa, plano-convexa) são <b>convergentes</b> ($f > 0$); de bordas grossas (bicôncava, plano-côncava), <b>divergentes</b> ($f < 0$). Se a lente estiver num meio mais refringente que ela (uma bolha de ar dentro da água), os papéis se invertem.</p>
        <p>Cada lente tem dois focos, um de cada lado, à distância $|f|$. Três raios fáceis de traçar:</p>
        <ol><li>Paralelo ao eixo → sai passando pelo foco $F'$ (ou, na divergente, parecendo vir do foco do lado de entrada).</li>
          <li>Pelo centro óptico → passa reto.</li>
          <li>Rumo ao foco $F$ → sai paralelo ao eixo.</li></ol>
        <div id="lab-len"></div>`),

      F.secao("gauss", "Equação de Gauss e aumento", R`
        ${F.formula(R`\frac1f = \frac1p + \frac1{p'}\qquad\qquad A = \frac{y'}{y} = -\frac{p'}{p}`, "Equação de Gauss e aumento linear")}
        <p>Convenção: $p$ é a distância do objeto (positiva para objeto real); $p' > 0$, imagem real (do outro lado); $p' < 0$, virtual; $A < 0$, invertida. O Halliday chama $p'$ de $i$. Os espelhos esféricos usam exatamente a mesma equação, com $f = R/2$ ${F.ret("O07")}.</p>
        ${F.demo("Gauss por semelhança de triângulos", R`<p>(i) O raio 2 (pelo centro) forma triângulos semelhantes com o objeto e a imagem: $\frac{y'}{y} = -\frac{p'}{p}$ (o sinal marca a inversão).</p>
          <p>(ii) O raio 1 (paralelo, depois pelo foco) forma, do lado da imagem, dois triângulos semelhantes com vértice em $F'$: um com catetos $f$ e $y$ (dentro da lente), outro com catetos $p' - f$ e $|y'|$. Então $\frac{|y'|}{y} = \frac{p' - f}{f}$.</p>
          <p>(iii) Igualando: $\frac{p'}{p} = \frac{p' - f}{f} = \frac{p'}{f} - 1$. Divida tudo por $p'$: $\frac1p = \frac1f - \frac1{p'}$ ∎.</p>`)}
        <table class="tb"><tr><th>objeto (lente convergente)</th><th>imagem</th><th>uso</th></tr>
          <tr><td>muito longe</td><td>real, invertida, no foco, minúscula</td><td>câmera, olho</td></tr>
          <tr><td>além de $2f$</td><td>real, invertida, menor</td><td>câmera</td></tr>
          <tr><td>em $2f$</td><td>real, invertida, mesmo tamanho (em $2f$)</td><td>fotocopiadora</td></tr>
          <tr><td>entre $f$ e $2f$</td><td>real, invertida, maior</td><td>projetor</td></tr>
          <tr><td>no foco</td><td>no infinito (raios paralelos)</td><td>farol, colimador</td></tr>
          <tr><td>antes do foco</td><td>virtual, direita, maior</td><td>lupa</td></tr></table>
        <p>A divergente sempre dá imagem virtual, direita e menor (o olho mágico da porta).</p>`),

      F.secao("fabricantes", "De onde vem o f: a equação dos fabricantes", R`
        ${F.formula(R`\frac1f = \left(\frac{n_\text{lente}}{n_\text{meio}} - 1\right)\left(\frac{1}{R_1} + \frac{1}{R_2}\right)`, "Equação dos fabricantes (faces convexas com R > 0)")}
        <p>Ela sai aplicando Snell em cada face (dioptro esférico) e somando os efeitos, para lentes finas. <b>Vergência</b>: $V = \frac1f$ (com $f$ em metros), em dioptrias ("graus" do óculos). Lentes finas encostadas somam vergências: $V = V_1 + V_2$.</p>
        <h3>O olho e os óculos</h3>
        <ul><li><b>Miopia</b>: o olho converge demais; a imagem de longe cai antes da retina. Enxerga nítido só até o ponto remoto $D_R$. Correção: divergente com $f = -D_R$.</li>
          <li><b>Hipermetropia</b>: converge de menos; o ponto próximo fica longe. Correção: convergente que, de um objeto a 25 cm, faça imagem virtual no ponto próximo da pessoa.</li>
          <li><b>Lupa</b>: objeto um pouco dentro do foco; aumento angular $\approx \frac{25\text{ cm}}{f}$ (com a imagem no infinito, olho relaxado).</li></ul>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Uma lente convergente de $f = 10$ cm. Ache $p'$ e $A$ para objetos a 30 cm, 15 cm e 5 cm. Descreva cada imagem.</p>`, fig: "", dicas: [R`<p>$\frac1{p'} = \frac1{10} - \frac1p$.</p>`, R`<p>Com $p < f$, $p'$ sai negativo.</p>`], resp: R`30 cm: $p' = 15$, $A = -0{,}5$ (real, invertida, menor). 15 cm: $p' = 30$, $A = -2$ (real, invertida, maior). 5 cm: $p' = -10$, $A = +2$ (virtual, direita, maior).`, sol: R`<p>Três casos da tabela: câmera, projetor e lupa, com a mesma lente.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Uma lente divergente de $f = -10$ cm, objeto a 20 cm. Onde fica a imagem e qual o aumento?</p>`, fig: "", dicas: [R`<p>$\frac1{p'} = -\frac1{10} - \frac1{20}$.</p>`, R`<p>$p' = -\frac{20}{3}$.</p>`], resp: R`$p' \approx -6{,}67$ cm; $A = +\frac13$ (virtual, direita, menor).`, sol: R`<p>Toda imagem de objeto real numa divergente fica entre a lente e o foco, virtual e menor.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Uma lente biconvexa simétrica de vidro ($n = 1{,}5$) tem raios de 20 cm. Qual o $f$? Quantas dioptrias?</p>`, fig: "", dicas: [R`<p>$\frac1f = 0{,}5\cdot\left(\frac1{20} + \frac1{20}\right)$.</p>`, R`<p>Dioptria: $1/f$ em metros.</p>`], resp: R`$f = 20$ cm; $+5$ di.`, sol: R`<p>Para biconvexa simétrica com $n = 1{,}5$, $f = R$: um atalho útil.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Duas lentes finas encostadas: $f_1 = 10$ cm e $f_2 = 20$ cm. Qual a distância focal do conjunto? E se a segunda fosse divergente, $f_2 = -20$ cm?</p>`, fig: "", dicas: [R`<p>Vergências somam.</p>`, R`<p>$\frac1f = \frac1{10} \pm \frac1{20}$.</p>`], resp: R`$6{,}67$ cm; com a divergente, $20$ cm.`, sol: R`<p>$10 + 5 = 15$ di e $10 - 5 = 5$ di. É assim que se combate a aberração cromática (dupla acromática: uma convergente e uma divergente de vidros diferentes).</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma pessoa míope não enxerga nítido além de 2 m. Que lente ela precisa (em dioptrias)?</p>`, fig: "", dicas: [R`<p>A lente deve pegar um objeto no infinito e fazer imagem virtual a 2 m.</p>`, R`<p>$\frac1f = \frac1\infty + \frac{1}{-2}$.</p>`], resp: R`Divergente, $f = -2$ m: $-0{,}5$ di.`, sol: R`<p>"Meio grau de miopia". Quanto mais perto o ponto remoto, mais forte a lente.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Um hipermetrope tem ponto próximo a 50 cm. Que lente faz ele ler um livro a 25 cm?</p>`, fig: "", dicas: [R`<p>O livro ($p = 25$ cm) precisa ter imagem virtual no ponto próximo: $p' = -50$ cm.</p>`, R`<p>$\frac1f = \frac1{25} - \frac1{50}$.</p>`], resp: R`Convergente de $f = 50$ cm: $+2$ di.`, sol: R`<p>$\frac1f = \frac{2 - 1}{50}$. Com a idade, o cristalino endurece e o ponto próximo se afasta (presbiopia): os óculos de leitura fazem exatamente essa conta.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Mostre que, para uma lente convergente, a distância entre um objeto real e sua imagem real é no mínimo $4f$. (Use o laboratório para chutar onde fica o mínimo antes de fazer a conta.)</p>`, fig: "", dicas: [R`<p>$L = p + p' = p + \frac{pf}{p - f}$.</p>`, R`<p>Derive em $p$.</p>`], resp: R`Mínimo em $p = p' = 2f$, com $L = 4f$.`, sol: R`<p>É a parte (a) do chefão. Fisicamente: se você tentar projetar numa parede a menos de $4f$ do slide, não há posição de lente que funcione.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-len"); e.outerHTML = F.lab("Lente delgada: raios principais e imagem", "lab-len"); SIM.lente(document.getElementById("lab-len"), F); },
});
