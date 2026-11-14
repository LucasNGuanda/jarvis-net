/* F05 · Séries, aproximações e ordens de grandeza. Conferido em Python:
   √101 ≈ 10,05 (real 10,04988); g a 10 km de altura cai 2h/R ≈ 0,314%; γ − 1 ≈ v²/2c² = 5e-13 para 300 m/s;
   bola que volta à metade da altura (1 m): percorre 3 m; pêndulo a 30°: T/T₀ ≈ 1 + θ²/16 = 1,0171 (exato 1,0174);
   átomos numa pessoa de 70 kg ≈ 7e27; 1,02¹⁰ ≈ 1,2 (real 1,219); cos 0,1 ≈ 0,995;
   dipolo no eixo: 2kqd/x³, erro de 0,5% em x = 10d. */
F.registrar("F05", {
  retoma: ["CII04", "F04", "A19"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Aproximar com a 1ª ordem",
      casos: [
        { nome: "Binômio (1 + x)ⁿ ≈ 1 + nx", gerar: (p) => {
          const L = [[101, 0.5, "\\sqrt{101} = 10\\sqrt{1 + 0{,}01}", 10, 0.01], [1.02 ** 1, 10, "1{,}02^{10} = (1 + 0{,}02)^{10}", 1, 0.02], [0.98, -1, "\\frac1{0{,}98} = (1 - 0{,}02)^{-1}", 1, -0.02], [27.27, 1 / 3, "\\sqrt[3]{27{,}27} = 3\\sqrt[3]{1 + 0{,}01}", 3, 0.01]];
          const [, n, expr, fator, x] = p ? L[0] : F.escolha(L), apr = fator * (1 + n * x), real = fator * Math.pow(1 + x, n);
          return { enun: R`<p>Calcule sem calculadora: $${expr}$.</p>`, fig: "",
            passos: [R`<p>Para $|x| \ll 1$: $(1 + x)^n \approx 1 + nx$ (os próximos termos têm $x^2$).</p>`, R`<p>Aqui $n = ${F.n(n, 4)}$ e $x = ${F.n(x)}$: $\approx ${fator === 1 ? "" : fator + "\\cdot"}(1 + ${F.n(n * x, 4)}) = ${F.n(apr, 5)}$.</p>`, R`<p>O valor real é $${F.n(real, 5)}$: erro de $${F.n((100 * Math.abs(apr - real)) / real, 3)}\%$.</p>`] };
        } },
        { nome: "Estimativa de Fermi", gerar: (p) => {
          const L = [["Quantas vezes o seu coração bate numa vida (80 anos)?", "70 batidas/min", R`70\cdot60\cdot24\cdot365\cdot80`, 70 * 60 * 24 * 365 * 80], ["Quantos átomos há no seu corpo (70 kg, quase tudo água)?", "água: 18 g/mol, 3 átomos por molécula", R`\frac{70\,000}{18}\cdot3\cdot6\times10^{23}`, (70000 / 18) * 3 * 6e23], ["Quantos litros de água uma pessoa bebe na vida?", "2 L por dia, 80 anos", R`2\cdot365\cdot80`, 2 * 365 * 80]];
          const [perg, hip, conta, v] = p ? L[0] : F.escolha(L);
          return { enun: R`<p>${perg}</p>`, fig: "",
            passos: [R`<p>Hipóteses (redondas, de cabeça): ${hip}.</p>`, R`<p>$${conta} \approx ${F.sigL(v, 2)}$.</p>`, R`<p>Ordem de grandeza: $10^{${Math.round(Math.log10(v))}}$. O objetivo não é acertar o número, é acertar a potência de 10, e saber de onde ela vem.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O campo de um dipolo, de longe",
      enun: R`<p>Duas cargas $+q$ e $-q$ estão separadas por $d$, com o centro na origem e o eixo em $x$. (a) Escreva o campo exato num ponto do eixo, a uma distância $x \gg d$ do centro. (b) Use $(1 \pm u)^{-2} \approx 1 \mp 2u$ para mostrar que $E \approx \frac{2kqd}{x^3}$. (c) Num ponto da mediatriz, a uma distância $y \gg d$, mostre que $E \approx \frac{kqd}{y^3}$. (d) Qual o erro da aproximação (b) em $x = 10d$? Por que o campo do dipolo cai mais rápido que o de uma carga só?</p>`,
      fig: "",
      dicas: [R`<p>(a) $E = kq\left[\frac1{(x - d/2)^2} - \frac1{(x + d/2)^2}\right]$. Ponha $x^2$ em evidência.</p>`, R`<p>(c) As componentes ao longo de $y$ se cancelam; sobra a componente paralela ao dipolo, com fator $\frac{d/2}{r}$.</p>`],
      sol: R`<p><b>(a, b)</b> $E = \frac{kq}{x^2}\left[\left(1 - \frac d{2x}\right)^{-2} - \left(1 + \frac d{2x}\right)^{-2}\right] \approx \frac{kq}{x^2}\left[\left(1 + \frac dx\right) - \left(1 - \frac dx\right)\right] = \frac{2kqd}{x^3}$.</p>
        <p><b>(c)</b> Cada carga dá $\frac{kq}{r^2}$ com $r \approx y$, e só a componente paralela ao eixo sobra: $2\cdot\frac{kq}{y^2}\cdot\frac{d/2}{y} = \frac{kqd}{y^3}$ (metade do valor no eixo).</p>
        <p><b>(d)</b> Em $x = 10d$: exato $\propto 0{,}0020100$, aproximado $0{,}0020000$: erro de 0,5% (o próximo termo da série é $\frac{d^2}{2x^2}$ relativo). Cai com $1/x^3$ porque, de longe, as duas cargas quase se cancelam: o que sobra é a <b>diferença</b> entre dois campos $1/x^2$, que é a derivada de $1/x^2$, proporcional a $1/x^3$ ${F.ret("C03")}.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Fundamentos · aproximações</div>
        <div class="q">Por que o físico pode dizer que sen θ = θ, e o matemático não?</div>
        <p>Porque o físico sempre sabe quanto erra. Uma medida tem incerteza; se o erro da aproximação é menor que ela, a aproximação é tão boa quanto a fórmula exata. Saber aproximar (e estimar ordens de grandeza) é metade do trabalho de um físico, e o caminho para isso é a <b>série de Taylor</b>.</p></div>`),

      F.secao("taylor", "Série de Taylor", R`
        ${F.formula(R`f(x) = f(0) + f'(0)\,x + \frac{f''(0)}{2!}x^2 + \frac{f'''(0)}{3!}x^3 + \cdots`, "Série de Taylor em torno de 0")}
        <p>Perto de um ponto, qualquer função "boa" parece uma reta, depois uma parábola, depois uma cúbica… Cada termo corrige o anterior ${F.ret("CII04")}. As que mais aparecem na física:</p>
        ${F.formula(R`\begin{aligned}\sin x &\approx x - \tfrac{x^3}{6}, & \cos x &\approx 1 - \tfrac{x^2}2, & e^x &\approx 1 + x + \tfrac{x^2}2,\\ (1 + x)^n &\approx 1 + nx + \tfrac{n(n-1)}2x^2, & \ln(1 + x) &\approx x - \tfrac{x^2}2, & \tfrac1{1 - x} &= 1 + x + x^2 + \cdots\end{aligned}`, "Aproximações de bolso (|x| ≪ 1)")}
        <div id="lab-tay"></div>
        ${F.caixa("pegadinha", R`<p><b>Raio de convergência:</b> as séries de $\sin$, $\cos$ e $e^x$ valem para qualquer $x$ (com termos suficientes). As de $(1 + x)^n$, $\ln(1 + x)$ e $\frac1{1 - x}$ só convergem para $|x| < 1$: fora disso, somar mais termos <b>piora</b>. No laboratório, ponha $\frac1{1 - x}$ com $x = -1{,}2$ e aumente $N$.</p>`)}`),

      F.secao("fisica", "Onde a física usa", R`
        <ul><li><b>Pêndulo</b>: $\sin\theta \approx \theta$ transforma $\ddot\theta = -\frac gL\sin\theta$ num MHS ${F.ret("A20")}. O próximo termo dá a correção do período: $T \approx T_0\left(1 + \frac{\theta_0^2}{16}\right)$, a mesma que você usou no experimento do pêndulo.</li>
          <li><b>Gravidade com a altura</b>: $g(h) = \frac{GM}{(R + h)^2} = g\left(1 + \frac hR\right)^{-2} \approx g\left(1 - \frac{2h}R\right)$.</li>
          <li><b>Relatividade em baixa velocidade</b>: $\gamma = (1 - v^2/c^2)^{-1/2} \approx 1 + \frac{v^2}{2c^2}$, e a energia $\gamma mc^2 \approx mc^2 + \frac12mv^2$: a energia cinética de Newton aparece como o 2º termo ${F.ret("C18")}.</li>
          <li><b>Qualquer mínimo de energia é uma mola</b>: perto de um mínimo, $U(x) \approx U(x_0) + \frac12U''(x_0)(x - x_0)^2$. Por isso o MHS está em todo lugar.</li></ul>
        ${F.caixa("ideia", R`<p><b>Séries geométricas</b>: $a + ar + ar^2 + \cdots = \frac a{1 - r}$ para $|r| < 1$. Bola que quica, reflexões entre dois espelhos, a mosca entre os trens ${F.ret("F01")}: uma soma infinita com resultado finito.</p>`)}
        ${F.caixa("fisico", R`<p><b>Ordens de grandeza</b> (Fermi): estimar com números redondos, de cabeça, só a potência de 10. Fermi estimou a energia da primeira explosão atômica soltando papeizinhos e vendo quanto o vento da explosão os arrastava. A análise dimensional ${F.ret("A19")} é a outra ferramenta para isso.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $\sqrt{101}$ e $\cos(0{,}1)$ sem calculadora.</p>`, fig: "", dicas: [R`<p>$\sqrt{101} = 10(1 + 0{,}01)^{1/2}$.</p>`, R`<p>$\cos x \approx 1 - x^2/2$.</p>`], resp: R`$\approx 10{,}05$; $\approx 0{,}995$.`, sol: R`<p>Valores reais: 10,04988 e 0,995004. Os dois erros são da ordem do próximo termo.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Em quantos por cento a gravidade diminui num avião a 10 km de altura? (Raio da Terra: 6371 km.)</p>`, fig: "", dicas: [R`<p>$g(h) \approx g(1 - 2h/R)$.</p>`], resp: R`$\approx 0{,}31\%$.`, sol: R`<p>$2\cdot10/6371 \approx 0{,}00314$. Você pesa quase o mesmo no avião; a "falta de peso" dos astronautas não é por estarem longe, é por estarem caindo.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Um avião anda a 300 m/s. Qual o tamanho de $\gamma - 1$?</p>`, fig: "", dicas: [R`<p>$\gamma - 1 \approx \frac{v^2}{2c^2}$.</p>`], resp: R`$\approx 5\times10^{-13}$.`, sol: R`<p>$\frac{9\times10^4}{2\cdot9\times10^{16}}$. Por isso a relatividade não aparece no dia a dia (mas aparece no GPS, que precisa de precisão de nanossegundos).</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Uma bola cai de 1 m e, a cada quique, sobe até a metade da altura anterior. Qual a distância total percorrida até parar?</p>`, fig: "", dicas: [R`<p>Depois da 1ª queda, cada altura é subida e descida.</p>`, R`<p>$1 + 2\left(\frac12 + \frac14 + \cdots\right)$.</p>`], resp: R`3 m.`, sol: R`<p>A PG $\frac12 + \frac14 + \cdots = 1$. Infinitos quiques, distância finita (e tempo também finito: os tempos formam uma PG de razão $1/\sqrt2$).</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Um pêndulo oscila com amplitude de 30°. Em quantos por cento o período é maior que o de pequenas oscilações?</p>`, fig: "", dicas: [R`<p>$T \approx T_0(1 + \theta_0^2/16)$, com $\theta_0$ em radianos.</p>`], resp: R`$\approx 1{,}7\%$.`, sol: R`<p>$\frac{(0{,}5236)^2}{16} \approx 0{,}0171$. O valor exato (integral elíptica) é 1,74%. Num experimento que mede $g = 4\pi^2L/T^2$, isso dá um $g$ cerca de 3,4% baixo, se a correção não for feita.</p>` }),
        F.exercicio({ n: 6, enun: R`<p>Estime a ordem de grandeza do número de átomos no corpo de uma pessoa de 70 kg.</p>`, fig: "", dicas: [R`<p>Trate tudo como água: 18 g/mol, 3 átomos por molécula.</p>`], resp: R`$\sim 7\times10^{27}$: ordem $10^{28}$.`, sol: R`<p>$\frac{70\,000}{18}\cdot3\cdot6\times10^{23} \approx 7\times10^{27}$. Ordem de grandeza: compare com $\sqrt{10} \approx 3{,}16$: 7 está acima, então arredonda para $10^{28}$.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Uma partícula está no potencial $U(x) = U_0\left[\left(\frac ax\right)^{12} - 2\left(\frac ax\right)^6\right]$ (Lennard-Jones, $x > 0$). Ache o mínimo e a frequência de pequenas oscilações de uma massa $m$ em torno dele.</p>`, fig: "", dicas: [R`<p>$U'(x) = 0$ em $x = a$.</p>`, R`<p>$k = U''(a)$ e $\omega = \sqrt{k/m}$.</p>`], resp: R`Mínimo em $x = a$ ($U = -U_0$); $k = \frac{72U_0}{a^2}$, $\omega = \sqrt{\frac{72U_0}{ma^2}}$.`, sol: R`<p>$U'' = U_0\left[\frac{156a^{12}}{x^{14}} - \frac{84a^6}{x^8}\right]$, em $x = a$: $\frac{72U_0}{a^2}$. É o modelo das ligações entre moléculas: cada uma vibra como uma mola em torno do mínimo.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-tay"); e.outerHTML = F.lab("Polinômios de Taylor", "lab-tay"); SIM.taylor(document.getElementById("lab-tay"), F); },
});
