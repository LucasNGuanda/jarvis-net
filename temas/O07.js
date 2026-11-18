/* O07 · Espelhos esféricos (base: Halliday vol. 4, cap. 34, com as minhas palavras; convenção real positivo). Conferido em Python:
   côncavo f = 10 cm: p = 30 → 15 (A = −0,5); 20 → 20 (−1); 15 → 30 (−2); 5 → −10 (+2); convexo f = −10, p = 20 → −6,67 (A = +1/3);
   espelho de maquiagem f = 40 cm, rosto a 20 cm → p′ = −40, A = 2; retrovisor convexo R = 2 m, carro a 10 m → p′ = −0,91 m, A = 0,09. */
F.registrar("O07", {
  retoma: ["O06", "O09"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Espelhos esféricos",
      casos: [
        { nome: "Equação de Gauss", gerar: (p) => {
          const f = p ? 10 : F.escolha([-20, -10, 8, 10, 15, 20]), pp0 = p ? 30 : F.escolha([5, 6, 12, 25, 30, 45, 60].filter((v) => v !== f));
          const pl = 1 / (1 / f - 1 / pp0), A = -pl / pp0;
          return { enun: R`<p>Um objeto está a ${pp0} cm de um espelho ${f > 0 ? "côncavo" : "convexo"} com raio de curvatura ${Math.abs(2 * f)} cm. Onde fica a imagem e como ela é?</p>`, fig: "",
            passos: [
              R`<p>Foco: $f = \frac R2 = ${f}$ cm (${f > 0 ? "positivo: côncavo, foco na frente" : "negativo: convexo, foco atrás"}).</p>`,
              R`<p>Gauss: $\frac1{p'} = \frac1{${f}} - \frac1{${pp0}} \Rightarrow p' = ${F.n(pl, 2)}$ cm.</p>`,
              R`<p>$A = -\frac{p'}{p} = ${F.n(A, 3)}$: imagem ${pl > 0 ? "<b>real</b> (na frente do espelho)" : "<b>virtual</b> (atrás do espelho)"}, ${A < 0 ? "invertida" : "direita"}, ${Math.abs(A) > 1 ? "maior" : "menor"}.</p>`,
            ] };
        } },
        { nome: "Retrovisor convexo", gerar: (p) => {
          const Rr = p ? 2 : F.escolha([1, 2, 4]), d = p ? 10 : F.escolha([5, 10, 20, 50]), f = -Rr / 2, pl = 1 / (1 / f - 1 / d), A = -pl / d;
          return { enun: R`<p>Um retrovisor convexo tem raio de curvatura de ${Rr} m. Um carro está a ${d} m. Onde aparece a imagem e de que tamanho, comparada com um espelho plano?</p>`, fig: "",
            passos: [
              R`<p>$f = -\frac{${Rr}}{2} = ${F.n(f)}$ m. $\frac1{p'} = \frac1{${F.n(f)}} - \frac1{${d}} \Rightarrow p' = ${F.n(pl, 3)}$ m (virtual, atrás do espelho).</p>`,
              R`<p>$A = ${F.n(A, 3)}$: a imagem tem ${F.nt(100 * A, 1)}% do tamanho do carro. Num espelho plano, a imagem teria 100% e estaria a ${d} m atrás dele.</p>`,
              R`<p>A imagem menor faz o carro <b>parecer mais longe</b> do que está, mas o campo de visão é bem maior. Daí o aviso: "os objetos no espelho estão mais perto do que parecem".</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Aberração esférica e o espelho parabólico",
      enun: R`<p>(a) Um raio paralelo ao eixo, a uma altura $h$, reflete num espelho esférico de raio $R$. Mostre que ele cruza o eixo a uma distância do vértice $d(h) = R - \frac{R}{2\cos\theta}$, onde $\operatorname{sen}\theta = \frac hR$. (b) Mostre que, para $h \ll R$, $d \to \frac R2$ (o foco de Gauss), e que raios mais altos cruzam mais perto do espelho. (c) Com $R = 1$ m, de quanto erra o raio com $h = 20$ cm? (d) Qual forma de espelho junta <b>todos</b> os raios paralelos num ponto? Por que telescópios e antenas usam essa forma?</p>`,
      fig: "",
      dicas: [R`<p>(a) A normal no ponto de reflexão passa pelo centro C. O raio incidente faz ângulo $\theta$ com essa normal, e o refletido também. O triângulo C–ponto–cruzamento é isósceles.</p>`, R`<p>(b) $\cos\theta \approx 1 - \frac{\theta^2}2$ (Taylor ${F.ret("matematica/CII04")}).</p>`],
      sol: R`<p><b>(a)</b> No triângulo formado por C, pelo ponto de reflexão e pelo ponto onde o raio cruza o eixo, os dois ângulos junto a C e junto ao espelho valem $\theta$: isósceles. Os lados iguais medem $\frac{R}{2\cos\theta}$ (metade da base $R$ dividida por $\cos\theta$). O cruzamento fica a $\frac{R}{2\cos\theta}$ de C, ou seja, a $d = R - \frac{R}{2\cos\theta}$ do vértice ∎.</p>
        <p><b>(b)</b> $h \to 0$: $\cos\theta \to 1$ e $d \to \frac R2$. Com $h$ maior, $\cos\theta < 1$ e $d$ diminui: os raios da borda focam mais perto. Para pequeno $\theta$: $d \approx \frac R2 - \frac{R\theta^2}{4} \approx \frac R2 - \frac{h^2}{4R}$.</p>
        <p><b>(c)</b> $\operatorname{sen}\theta = 0{,}2$, $\cos\theta = 0{,}9798$; $d = 1 - \frac{1}{1{,}9596} = 0{,}4897$ m, contra 0,5000: erro de ~1 cm (a fórmula aproximada dá exatamente $\frac{0{,}04}{4} = 1$ cm).</p>
        <p><b>(d)</b> O <b>paraboloide</b>: pela propriedade da parábola, todo raio paralelo ao eixo reflete exatamente no foco. Antenas parabólicas, telescópios refletores e faróis de carro (ao contrário: lâmpada no foco, feixe paralelo) usam isso. O espelho do Hubble, polido com erro de forma de 2 μm na borda, teve aberração esférica até ganhar "óculos" corretivos em 1993.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Óptica · espelhos esféricos</div>
        <div class="q">Por que no lado de dentro de uma colher você aparece de cabeça para baixo, e no lado de fora, de pé e pequenininho?</div>
        <p>O lado de dentro é um espelho <b>côncavo</b>; o de fora, <b>convexo</b>. Os dois seguem a mesma equação das lentes ${F.ret("O09")}, com o foco a meio caminho entre o espelho e o centro da curvatura.</p></div>`),

      F.secao("elementos", "Elementos e raios notáveis", R`
        <p>Um espelho esférico é uma calota de uma esfera de raio $R$ (centro de curvatura C). O eixo principal passa por C e pelo vértice V. O <b>foco</b> F fica no meio de C e V:</p>
        ${F.formula(R`f = \frac R2\qquad\qquad\frac1f = \frac1p + \frac1{p'}\qquad\qquad A = -\frac{p'}{p}`, "Foco, equação de Gauss e aumento")}
        <p>Convenção: côncavo $f > 0$ (foco na frente); convexo $f < 0$ (foco atrás). $p' > 0$: imagem real, na frente (dá para projetar); $p' < 0$: virtual, atrás. As equações valem para raios perto do eixo e pouco inclinados (aproximação de Gauss); fora disso, há aberração (chefão).</p>
        <div id="lab-esf"></div>
        ${F.demo("por que f = R/2", R`<p>(i) Um raio paralelo ao eixo, à altura $h$, bate no espelho num ponto P. A normal em P é o raio CP, que faz ângulo $\theta$ com o eixo, com $\operatorname{sen}\theta = h/R$.</p>
          <p>(ii) Pela lei da reflexão, o raio refletido faz ângulo $\theta$ com a normal do outro lado: o triângulo C–P–F é isósceles (dois ângulos $\theta$), com $\overline{CF} = \overline{FP}$.</p>
          <p>(iii) Para $h$ pequeno, P está quase em V, e $\overline{CF} + \overline{FV} \approx R$ com $\overline{CF} = \overline{FP} \approx \overline{FV}$. Logo $\overline{FV} = \frac R2$ ∎.</p>`)}`),

      F.secao("usos", "Imagens e aplicações", R`
        <table class="tb"><tr><th>espelho côncavo, objeto…</th><th>imagem</th><th>uso</th></tr>
          <tr><td>muito longe</td><td>real, no foco, minúscula</td><td>telescópio refletor, forno solar, antena</td></tr>
          <tr><td>além de C</td><td>real, invertida, menor (entre C e F)</td><td></td></tr>
          <tr><td>em C</td><td>real, invertida, mesmo tamanho</td><td></td></tr>
          <tr><td>entre C e F</td><td>real, invertida, maior (além de C)</td><td>projetores antigos</td></tr>
          <tr><td>no foco</td><td>no infinito</td><td>farol, lanterna (ao contrário)</td></tr>
          <tr><td>entre F e V</td><td>virtual, direita, maior</td><td>espelho de maquiagem, de dentista</td></tr></table>
        <p><b>Convexo</b>: sempre virtual, direita e menor, mas com campo de visão grande. Retrovisores de moto, espelhos de garagem e de loja.</p>
        <p>Lentes e espelhos usam a mesma álgebra. Diferenças: o espelho reflete (a imagem real fica do mesmo lado do objeto) e não tem aberração cromática (a reflexão não depende da cor). Por isso os grandes telescópios são todos de espelho.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Um espelho côncavo tem $R = 20$ cm. Ache a imagem de objetos a 30 cm, 15 cm e 5 cm.</p>`, fig: "", dicas: [R`<p>$f = 10$ cm.</p>`, R`<p>Mesma conta da lente convergente de 10 cm ${F.ret("O09")}.</p>`], resp: R`30 cm: $p' = 15$, $A = -0{,}5$. 15 cm: $p' = 30$, $A = -2$. 5 cm: $p' = -10$, $A = +2$ (virtual).`, sol: R`<p>Os mesmos números da lente; a diferença é só o lado onde a imagem real se forma.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Um espelho de maquiagem côncavo tem $f = 40$ cm. Com o rosto a 20 cm, qual o aumento?</p>`, fig: "", dicas: [R`<p>Rosto dentro do foco: imagem virtual.</p>`, R`<p>$\frac1{p'} = \frac1{40} - \frac1{20}$.</p>`], resp: R`$p' = -40$ cm, $A = 2$ (direita, o dobro do tamanho).`, sol: R`<p>Se você se afastar para além de 40 cm, a imagem vira de cabeça para baixo (real). Teste com uma colher.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Um retrovisor convexo tem $R = 2$ m. Um carro está a 10 m. Onde fica a imagem e qual o aumento?</p>`, fig: "", dicas: [R`<p>$f = -1$ m.</p>`, R`<p>$\frac{1}{p'} = -1 - 0{,}1$.</p>`], resp: R`$p' \approx -0{,}91$ m; $A \approx 0{,}091$.`, sol: R`<p>A imagem fica a menos de 1 m atrás do espelho e tem 9% do tamanho: o cérebro interpreta como mais longe.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Um espelho côncavo forma, numa tela a 2 m dele, a imagem de uma vela que está a 50 cm. Qual o raio de curvatura? A imagem é maior ou menor que a vela?</p>`, fig: "", dicas: [R`<p>Imagem na tela: real, $p' = 200$ cm.</p>`, R`<p>$\frac1f = \frac1{50} + \frac1{200}$.</p>`], resp: R`$f = 40$ cm, $R = 80$ cm; imagem 4 vezes maior e invertida.`, sol: R`<p>$A = -\frac{200}{50} = -4$.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Por que a imagem num espelho convexo é sempre virtual, direita e menor? Use a equação de Gauss com $f < 0$ e $p > 0$.</p>`, fig: "", dicas: [R`<p>$\frac{1}{p'} = \frac1f - \frac1p$, com os dois termos negativos.</p>`, R`<p>Compare $|p'|$ com $p$.</p>`], resp: R`$p' < 0$ sempre (virtual), e $|p'| < p$, então $0 < A < 1$ (direita e menor).`, sol: R`<p>$\frac1{p'}$ é a soma de dois negativos: $p' < 0$. E $\left|\frac1{p'}\right| > \frac1p$, então $|p'| < p$ e $A = -\frac{p'}{p} = \frac{|p'|}{p} \in (0, 1)$.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Um forno solar usa um espelho côncavo de 1 m de diâmetro e $f = 50$ cm. O Sol tem diâmetro angular de 0,53°. Qual o diâmetro da imagem do Sol no foco? Por que lá esquenta tanto?</p>`, fig: "", dicas: [R`<p>Objeto no infinito: imagem no foco, com tamanho $f\cdot\theta$.</p>`, R`<p>Compare a área do espelho com a da imagem.</p>`], resp: R`$\approx 4{,}6$ mm; a luz de 1 m² se concentra em ~$1{,}7\times10^{-5}$ m², umas 47 000 vezes.`, sol: R`<p>$0{,}5\times0{,}00925 = 4{,}6\times10^{-3}$ m. Razão de áreas $\left(\frac{1}{0{,}0046}\right)^2 \approx 47\,000$: com ~1000 W/m² de sol, a imagem recebe a luz equivalente a dezenas de sóis. (Na prática, aberrações espalham um pouco.)</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Mostre que, para qualquer espelho esférico, $\left(p - f\right)\left(p' - f\right) = f^2$ (forma de Newton). Use para achar onde está a imagem de um objeto a 2 cm além do foco de um espelho com $f = 10$ cm.</p>`, fig: "", dicas: [R`<p>Parta de $\frac1p + \frac1{p'} = \frac1f$ e multiplique por $pp'f$.</p>`, R`<p>$pp' - fp - fp' = 0$; some $f^2$ dos dois lados.</p>`], resp: R`$(p - f)(p' - f) = f^2$; com $p - f = 2$: $p' - f = 50$, $p' = 60$ cm.`, sol: R`<p>$f p' + f p = pp' \Rightarrow pp' - fp - fp' + f^2 = f^2 \Rightarrow (p - f)(p' - f) = f^2$ ∎. Objeto perto do foco, imagem muito longe: $x\,x' = f^2$ é uma hipérbole.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-esf"); e.outerHTML = F.lab("Espelho esférico: raios e imagem", "lab-esf"); SIM.espelhoEsf(document.getElementById("lab-esf"), F); },
});
