/* FE01 · O que é medir: unidades e algarismos significativos. Conferido em Python:
   2,5 × 3,42 = 8,55 → 8,6; 12,1 + 0,035 = 12,135 → 12,1; 3,2 × 5,15 = 16,48 → 16 cm²; 72 km/h = 20 m/s; 1 ano = 3,16e7 s (ordem 10⁷);
   batimentos em 80 anos (70/min): 2,9e9 (ordem 10⁹); 500 folhas em 5,0 cm: 0,100 mm cada, ± 0,001 mm (régua de 1 mm, ± 0,5 mm);
   20 oscilações em 36,4 s (± 0,2 s): T = 1,82 s ± 0,01 s; 25,0 g ÷ 3,2 cm³ = 7,8125 → 7,8 g/cm³;
   chefão: 200 grãos de arroz = 5 g numa balança de 1 g (± 0,5 g): 0,025 g ± 0,0025 g (10%); para 1%: 50 g ≈ 2000 grãos. */
F.registrar("FE01", {
  retoma: ["F01", "A19"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const visor = (txt, rot) => fig(`<rect x="170" y="40" width="220" height="80" rx="10" style="fill:var(--bg);stroke:var(--ink3);stroke-width:2"/><text x="370" y="96" text-anchor="end" style="font:700 40px ui-monospace,monospace;fill:var(--ok)">${txt}</text>` + D.txt(280, 145, rot, "tx2"), 160);
    const regua = (fimCm, div = 0.1, rot = "") => fig(`<rect x="40" y="40" width="${fimCm * 48}" height="30" rx="3" style="fill:color-mix(in srgb,var(--mA) 40%,transparent);stroke:var(--mA);stroke-width:2"/>` + D.regua(40, 92, 10, 48, div) + D.lupaRegua(280, 170, 360, fimCm, div) + (rot ? D.txt(500, 30, rot, "tx2", "end") : ""), 215);
    const pilha = (rot) => fig(Array.from({ length: 14 }, (_, i) => `<rect x="220" y="${30 + i * 8}" width="120" height="7" style="fill:color-mix(in srgb,var(--ink) ${i % 2 ? 22 : 30}%,transparent);stroke:var(--ink3);stroke-width:.5"/>`).join("") + `<line x1="360" x2="360" y1="30" y2="142" style="stroke:var(--warn);stroke-width:2"/>` + D.txt(368, 90, rot, "tx2", "start"), 165);
    const exemplos = F.exemplo({
      titulo: "Significativos",
      casos: [
        { nome: "Fácil: quantos algarismos significativos", gerar: (p) => {
          const n = p ? "0,004050" : F.escolha(["0,004050", "3,00", "1,20 × 10³", "0,0102"]), info = { "0,004050": [4, "zeros à esquerda não contam (só posicionam a vírgula); o zero do meio e o zero final contam"], "3,00": [3, "os zeros depois da vírgula contam: dizem que a medida foi precisa até o centésimo"], "1,20 × 10³": [3, "na notação científica, só a mantissa conta; o zero final de 1,20 foi medido"], "0,0102": [3, "os zeros da frente não contam; o zero entre o 1 e o 2 conta"] }[n];
          return { enun: R`<p>Quantos algarismos significativos tem a medida ${n} (em alguma unidade)?</p>`, fig: visor(n.replace(" × 10³", "e3"), "a medida"),
            passos: [R`<p>(i) Significativos são os algarismos que a medida <b>garante</b>, mais o último, duvidoso.</p>`, R`<p>(ii) Regras: ${info[1]}.</p>`, R`<p>(iii) Resposta: <b>${info[0]}</b> algarismos significativos.</p>`] };
        } },
        { nome: "Médio: a conta e a precisão do resultado", gerar: (p) => {
          const m = p ? 25 : F.escolha([18.4, 25, 31.7]), V = p ? 3.2 : F.escolha([2.7, 3.2, 4.1]), r = m / V;
          return { enun: R`<p>Uma pedra tem massa ${F.nt(m, 1)} g (balança de décimo de grama) e volume ${F.nt(V, 1)} cm³ (proveta de 0,1 cm³). Qual a densidade, com o número certo de algarismos?</p>`, fig: visor(F.nt(m, 1) + " g", "balança"),
            passos: [R`<p>(i) Conta: $\rho = \frac{${F.n(m, 1)}}{${F.n(V, 1)}} = ${F.n(r, 6)}$ g/cm³ (a calculadora mostra tudo isso, mas a maioria é lixo).</p>`, R`<p>(ii) Numa divisão, o resultado tem tantos significativos quanto o dado <b>menos preciso</b>: a massa tem 3 e o volume, 2. Fica com 2.</p>`, R`<p>(iii) $\rho \approx ${F.n(+r.toPrecision(2), 1)}$ g/cm³. O motivo é o Teorema 1: a incerteza relativa do volume (~3%) domina.</p>`] };
        } },
        { nome: "Olimpíada: medir o que é pequeno demais", gerar: (p) => {
          const n = p ? 500 : F.escolha([200, 500, 1000]), h = p ? 5 : F.escolha([2.1, 5, 9.6]), esp = (h * 10) / n, d = 0.5 / n;
          return { enun: R`<p>Uma resma de ${n} folhas tem ${F.nt(h, 1)} cm de espessura, medida com uma régua de milímetros (± 0,5 mm). Qual a espessura de uma folha, e com que incerteza?</p>`, fig: pilha(`${n} folhas: ${F.nt(h, 1)} cm`),
            passos: [R`<p>(i) Medir uma folha direto com a régua é inútil: ela é muito mais fina que 1 mm. Mede-se a pilha.</p>`, R`<p>(ii) $e = \frac{${F.n(h * 10, 1)}\ \text{mm}}{${n}} = ${F.n(esp, 4)}$ mm.</p>`, R`<p>(iii) A incerteza também é dividida por ${n} (Teorema 3): $\pm\frac{0{,}5}{${n}} = ${F.n(d, 4)}$ mm. Resultado: $(${F.n(esp, 4)} \pm ${F.n(d, 4)})$ mm. É a mesma ideia de cronometrar várias oscilações de um pêndulo.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Quanto pesa um grão de arroz",
      enun: R`<p>Você quer a massa de um grão de arroz, mas só tem uma balança de cozinha digital que mostra de grama em grama (o erro de leitura é de até meio grama). (a) Por que pesar um grão só não adianta? (b) 200 grãos marcam 5 g. Qual a massa de um grão, com a incerteza absoluta e relativa? (c) Quantos grãos, no mínimo, para a incerteza relativa cair a 1%? (d) Os grãos não são todos iguais. Essa técnica dá a massa de "um grão" ou de "um grão médio"? (e) Que outras medidas do laboratório usam a mesma ideia?</p>`,
      fig: fig(`<rect x="190" y="110" width="180" height="20" rx="6" style="fill:var(--ink3)"/><rect x="230" y="130" width="100" height="30" rx="4" style="fill:var(--bg);stroke:var(--ink3)"/><text x="320" y="152" text-anchor="end" style="font:700 18px ui-monospace,monospace;fill:var(--ok)">5 g</text>` + Array.from({ length: 30 }, (_, i) => `<ellipse cx="${215 + (i % 10) * 13}" cy="${100 - Math.floor(i / 10) * 7}" rx="5" ry="2.6" style="fill:#f3ead2;stroke:var(--ink3);stroke-width:.5"/>`).join("") + D.txt(400, 90, "200 grãos", "tx2", "start"), 170),
      dicas: [R`<p>(a) Compare a massa de um grão (centésimos de grama) com o erro da balança.</p>`, R`<p>(b) Divida tanto o valor quanto a incerteza pelo número de grãos.</p>`, R`<p>(c) A incerteza absoluta da pesagem é fixa (0,5 g); a relativa cai com a massa total.</p>`],
      sol: R`<p><b>(a)</b> Um grão tem uns 0,02 g: a balança marcaria 0 g, com erro de 0,5 g, 20 vezes maior que o que se quer medir.</p>
        <p><b>(b)</b> $m = \frac{5}{200} = 0{,}025$ g, com incerteza $\frac{0{,}5}{200} = 0{,}0025$ g: $(0{,}025 \pm 0{,}003)$ g, ou 10%.</p>
        <p><b>(c)</b> Incerteza relativa $= \frac{0{,}5\ \text{g}}{M_\text{total}}$; para 1%, $M_\text{total} = 50$ g, isto é, $\frac{50}{0{,}025} = 2000$ grãos. (Conferi em Python.)</p>
        <p><b>(d)</b> De um grão <b>médio</b>: a balança soma as massas, e dividir pelo número dá a média. A variação entre grãos não aparece nessa medida; para ela, seria preciso pesar grãos um a um numa balança mais fina ${F.ret("FE03")}.</p>
        <p><b>(e)</b> A espessura de uma folha (medindo a resma), o período de um pêndulo (cronometrando 10 ou 20 oscilações) ${F.ret("A20")}, o diâmetro de um fio (enrolando várias voltas num lápis) e o tempo de reação (somando muitas medidas). Sempre: divide-se a incerteza pelo número de repetições contadas.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Quantos algarismos significativos tem 0,00450 m?</p>`, fig: visor("0,00450", "medida em metros"), num: { v: 3 }, dicas: [R`<p>Zeros à esquerda só posicionam a vírgula.</p>`], resp: "3", sol: R`<p>4, 5 e o zero final: 3 significativos. Em notação científica: $4{,}50\times10^{-3}$ m.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Quantos algarismos significativos tem $1{,}20\times10^3$ g?</p>`, fig: visor("1,20e3", "massa em gramas"), num: { v: 3 }, dicas: [R`<p>Na notação científica, só a mantissa conta.</p>`], resp: "3", sol: R`<p>1, 2 e 0: o zero foi medido. Escrever "1200 g" deixaria a dúvida: 2, 3 ou 4 significativos?</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Na régua de milímetros da figura, onde está a ponta da barra (em cm, com o algarismo duvidoso)?</p>`, fig: regua(7.35, 0.1, "régua de 1 mm"), num: { v: 7.35, tol: 0.003, un: "cm" }, dicas: [R`<p>Os milímetros a régua garante; a fração do milímetro, você estima.</p>`], resp: "7,35 cm", sol: R`<p>A ponta está entre 7,3 e 7,4 cm, mais ou menos no meio: 7,35 cm (o 5 é o duvidoso). Leituras de 7,34 ou 7,36 também seriam aceitáveis.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Calcule $2{,}5 \times 3{,}42$ com o número correto de algarismos significativos.</p>`, fig: visor("8,55", "a calculadora mostra"), num: { v: 8.6, tol: 0.001 }, dicas: [R`<p>Multiplicação: fica com os significativos do dado menos preciso.</p>`], resp: "8,6", sol: R`<p>$2{,}5$ tem 2 significativos: $8{,}55 \to 8{,}6$.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Calcule $12{,}1 + 0{,}035$ com o número correto de algarismos.</p>`, fig: visor("12,135", "a calculadora mostra"), num: { v: 12.1, tol: 0.0005 }, dicas: [R`<p>Soma: fica com as casas decimais do menos preciso.</p>`], resp: "12,1", sol: R`<p>12,1 só garante o décimo: $12{,}135 \to 12{,}1$. Somar 0,035 a algo incerto no décimo não muda nada que se possa afirmar (Teorema 2).</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Um retângulo mede 3,2 cm por 5,15 cm. Qual a área, com o número certo de significativos (em cm²)?</p>`, fig: fig(`<rect x="180" y="40" width="${5.15 * 40}" height="${3.2 * 25}" style="fill:color-mix(in srgb,var(--mA) 30%,transparent);stroke:var(--mA);stroke-width:2"/>` + D.txt(280, 34, "5,15 cm", "tx2") + D.txt(170, 84, "3,2 cm", "tx2", "end"), 150), num: { v: 16, tol: 0.001, un: "cm²" }, dicas: [R`<p>3,2 tem 2 significativos.</p>`], resp: "16 cm²", sol: R`<p>$3{,}2\cdot5{,}15 = 16{,}48 \to 16$ cm².</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Converta 72 km/h para m/s.</p>`, fig: visor("72 km/h", "velocímetro"), num: { v: 20, un: "m/s" }, dicas: [R`<p>1 km = 1000 m e 1 h = 3600 s.</p>`], resp: "20 m/s", sol: R`<p>$\frac{72\,000}{3600} = 20$ m/s (dividir por 3,6).</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Uma pedra tem 25,0 g e 3,2 cm³. Qual a densidade, com os significativos certos (g/cm³)?</p>`, fig: visor("25,0 g", "balança"), num: { v: 7.8, tol: 0.001, un: "g/cm³" }, dicas: [R`<p>Divisão: o menos preciso tem 2 significativos.</p>`], resp: "7,8 g/cm³", sol: R`<p>$\frac{25{,}0}{3{,}2} = 7{,}8125 \to 7{,}8$ g/cm³.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Qual a ordem de grandeza (a potência de 10) do número de segundos de um ano? Responda o expoente.</p>`, fig: visor("365 d", "um ano"), num: { v: 7, tol: 0.001 }, dicas: [R`<p>$365\cdot24\cdot3600$ e veja se a mantissa passa de $\sqrt{10} \approx 3{,}16$.</p>`], resp: "7", sol: R`<p>$3{,}16\times10^7$ s. A mantissa é quase exatamente $\sqrt{10}$ (coincidência famosa: "um ano ≈ π × 10⁷ s"), e a ordem de grandeza é $10^7$ ${F.ret("F05")}.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Estime a ordem de grandeza do número de batidas de um coração em 80 anos (70 por minuto). Responda o expoente.</p>`, fig: fig(`<path d="M280 140 C200 90 200 40 245 40 C265 40 280 55 280 70 C280 55 295 40 315 40 C360 40 360 90 280 140 Z" style="fill:color-mix(in srgb,var(--bad) 45%,transparent);stroke:var(--bad);stroke-width:2"/>`, 160), num: { v: 9, tol: 0.001 }, dicas: [R`<p>$70\cdot60\cdot24\cdot365\cdot80$.</p>`], resp: "9", sol: R`<p>$\approx 2{,}9\times10^9$: ordem $10^9$ (a mantissa é menor que 3,16).</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Uma resma de 500 folhas tem 5,0 cm, medida com régua de milímetros (± 0,5 mm). Qual a espessura de uma folha, em mm?</p>`, fig: pilha("500 folhas: 5,0 cm"), num: { v: 0.1, tol: 0.005, un: "mm" }, dicas: [R`<p>Divida a pilha (em mm) pelo número de folhas.</p>`], resp: "0,100 mm (± 0,001 mm)", sol: R`<p>$\frac{50}{500} = 0{,}100$ mm, com incerteza $\frac{0{,}5}{500} = 0{,}001$ mm.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>20 oscilações de um pêndulo levam 36,4 s, com incerteza de ± 0,2 s no cronômetro manual. Qual a incerteza do período, em s?</p>`, fig: visor("36,4 s", "20 oscilações"), num: { v: 0.01, tol: 0.01, un: "s" }, dicas: [R`<p>O período e a sua incerteza são divididos por 20.</p>`], resp: "0,01 s (T = 1,82 s)", sol: R`<p>$T = \frac{36{,}4}{20} = 1{,}82$ s e $\Delta T = \frac{0{,}2}{20} = 0{,}01$ s: 20 vezes melhor que cronometrar uma oscilação só.</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>Quanto é 2,5 μm em metros?</p>`, fig: fig(`<circle cx="280" cy="85" r="50" style="fill:color-mix(in srgb,var(--bad) 30%,transparent);stroke:var(--bad);stroke-width:2"/>` + D.txt(280, 90, "2,5 μm", "tx2") + D.txt(280, 160, "glóbulo vermelho: ~7 μm", "tx2"), 170), num: { v: 2.5e-6, tol: 0.001, un: "m" }, dicas: [R`<p>Micro = $10^{-6}$.</p>`], resp: "2,5 × 10⁻⁶ m", sol: R`<p>$2{,}5\times10^{-6}$ m (as partículas "PM2,5" da poluição têm esse tamanho).</p>` }),
      F.exercicio({ n: 14, nivel: "Máximo", enun: R`<p>Converta a densidade da água, 1 g/cm³, para kg/m³.</p>`, fig: fig(`<rect x="230" y="40" width="100" height="100" style="fill:color-mix(in srgb,var(--mA) 30%,transparent);stroke:var(--mA);stroke-width:2"/>` + D.txt(280, 95, "1 cm³ → 1 g", "tx2"), 160), num: { v: 1000, un: "kg/m³" }, dicas: [R`<p>1 g = $10^{-3}$ kg e 1 cm³ = $10^{-6}$ m³.</p>`], resp: "1000 kg/m³", sol: R`<p>$\frac{10^{-3}}{10^{-6}} = 10^3$ kg/m³.</p>` }),
      F.exercicio({ n: 15, nivel: "Máximo", enun: R`<p>Um texto diz que a pista tem "1500 m". Qual a melhor forma de deixar claro que a medida tem 2 algarismos significativos?</p>`, fig: visor("1500 m", "?"), alts: ["1500 m", "1500,0 m", R`$1{,}5\times10^3$ m`, "1,500 km", "15 hm"], certa: "C", dicas: [R`<p>Zeros à direita de um número inteiro são ambíguos.</p>`], resp: "C", sol: R`<p>A notação científica não deixa dúvida: $1{,}5\times10^3$ m tem 2 significativos. "1,500 km" diria 4.</p>` }),
      F.exercicio({ n: 16, nivel: "Máximo", enun: R`<p>Com uma régua de centímetros (sem milímetros), qual destas leituras está escrita corretamente?</p>`, fig: regua(6.4, 1, "régua de 1 cm"), alts: ["6 cm", "6,4 cm", "6,42 cm", "6,423 cm", "6,40 cm"], certa: "B", dicas: [R`<p>Os centímetros são garantidos; um algarismo a mais é estimado.</p>`], resp: "B", sol: R`<p>6 é garantido e o 4 é estimado entre os tracinhos: 6,4 cm. "6,42" já inventa um algarismo que essa régua não pode dar.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Física experimental · medir</div>
        <div class="q">A calculadora diz que a densidade da pedra é 7,8125 g/cm³. Por que um professor de laboratório vai riscar esse resultado?</div>
        <p>Porque a massa e o volume foram medidos com uma precisão limitada, e os últimos algarismos são inventados pela calculadora. Toda medida carrega a informação de quão bem ela foi feita, e a primeira forma de dizer isso é com os algarismos significativos.</p></div>
        ${F.chute({ q: "você mede 3,2 cm × 5,15 cm com uma régua e a calculadora dá 16,48 cm². Como escrever a área?", ops: ["16,48 cm²", "16,5 cm²", "16 cm²", "20 cm²"], certa: 2, exp: "16 cm²: o lado de 3,2 cm só tem 2 algarismos significativos, e numa multiplicação o resultado não pode ser mais preciso que o dado menos preciso (Teorema 1)." })}`),

      F.secao("medir", "O que é uma medida", R`
        <p>Medir é comparar com um padrão (a unidade) e contar quantas vezes ele cabe. Toda medida tem três partes: <b>valor</b>, <b>incerteza</b> e <b>unidade</b>. Unidades do SI: metro, quilograma, segundo, ampère, kelvin, mol e candela; desde 2019, todas definidas por constantes da natureza ${F.ret("F01")}.</p>
        <p><b>Algarismos significativos</b> são os que a medida garante mais o primeiro duvidoso. Numa régua de milímetros, leia os milímetros e estime a fração entre dois tracinhos: 7,35 cm tem 3 significativos, e o 5 é o duvidoso. Zeros à esquerda não contam; zeros no meio e no fim (depois da vírgula) contam.</p>
        <div id="lab-regua"></div>
        ${F.caixa("pegadinha", R`<p><b>"7,3 cm" e "7,30 cm" não são a mesma coisa.</b> O primeiro diz que você não sabe o centésimo; o segundo, que mediu e deu zero. E a calculadora não sabe nada de precisão: ela mostra 10 algarismos para qualquer conta.</p>`)}`),

      F.secao("contas", "Algarismos significativos nas contas", R`
        <h3>Teorema 1: num produto ou divisão, vale o número de significativos do dado menos preciso</h3>
        ${F.demo("demonstração", R`<p>(i) Uma medida com $n$ significativos tem incerteza relativa da ordem de $10^{-(n-1)}$ a $10^{-n}$: 3,2 (2 significativos) é incerto em ~0,1 em 3, uns 3%; 5,15 (3 significativos), ~0,01 em 5, uns 0,2%.</p>
          <p>(ii) Num produto $P = xy$, a incerteza relativa é aproximadamente a soma das relativas: $\frac{\Delta P}P \approx \frac{\Delta x}x + \frac{\Delta y}y$ ${F.ret("FE04")}. A maior domina: ~3%.</p>
          <p>(iii) 3% de 16,48 é ~0,5: o algarismo das unidades já é duvidoso, e os decimais não significam nada. Ficam 2 significativos, os mesmos do dado menos preciso. $\blacksquare$</p>`)}
        <h3>Teorema 2: numa soma ou subtração, vale a casa decimal do dado menos preciso</h3>
        ${F.demo("demonstração", R`<p>(i) Numa soma, as incertezas <b>absolutas</b> se somam: $\Delta(x + y) \approx \Delta x + \Delta y$.</p>
          <p>(ii) Em $12{,}1 + 0{,}035$, o primeiro é incerto no décimo (~0,1); o segundo, no milésimo. A soma fica incerta no décimo: $12{,}135 \to 12{,}1$. $\blacksquare$</p>
          <p>(iii) Cuidado com subtrações de números parecidos: $12{,}1 - 11{,}8 = 0{,}3$ tem só 1 significativo, embora cada dado tivesse 3.</p>`)}
        ${F.formula(R`\times,\ \div:\ \text{significativos do menos preciso};\qquad +,\ -:\ \text{casas decimais do menos preciso}`, "Algarismos significativos nas contas")}`),

      F.secao("multiplos", "Medir muitos para medir um", R`
        <h3>Teorema 3: medindo $N$ repetições juntas, a incerteza de uma cai por $N$</h3>
        ${F.demo("demonstração", R`<p>(i) Mede-se o total $X = Nx$ com incerteza $\Delta X$ (a do instrumento, a mesma de medir uma só).</p>
          <p>(ii) Então $x = \frac XN$ e $\Delta x = \frac{\Delta X}N$: a incerteza relativa $\frac{\Delta x}x = \frac{\Delta X}{X}$ cai porque $X$ é $N$ vezes maior. $\blacksquare$</p>
          <p>(iii) Hipótese: as $N$ coisas são iguais (ou queremos a média). É por isso que se cronometram 10 ou 20 oscilações de um pêndulo ${F.ret("A20")}.</p>`)}
        ${F.formula(R`x = \frac XN,\qquad \Delta x = \frac{\Delta X}{N}`, "Técnica das medidas múltiplas")}
        ${F.caixa("fisico", R`<p><b>O metro já foi uma barra de platina</b> guardada em Paris; hoje é a distância que a luz percorre no vácuo em $\frac1{299\,792\,458}$ de segundo. O quilograma foi o último a deixar de ser um objeto (2019): agora é definido pela constante de Planck.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Ordem de grandeza</b> é a potência de 10 mais próxima: se a mantissa passa de $\sqrt{10} \approx 3{,}16$, arredonda-se para cima ${F.ret("F05")}. Problemas de Fermi ("quantos afinadores de piano há em São Paulo?") se resolvem com estimativas encadeadas e só a ordem de grandeza no fim.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, as regras de significativos são substituídas pela propagação de incertezas propriamente dita ${F.ret("FE04")} e pela norma internacional (o GUM, "Guide to the Expression of Uncertainty in Measurement"), que é o que laboratórios de pesquisa e de calibração seguem.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-regua"); e.outerHTML = F.lab("Lendo uma régua", "lab-regua"); SIM.reguaLeitura(document.getElementById("lab-regua"), F); },
});
