/* N02 · Equação da continuidade. Conferido em Python:
   mangueira de 2 cm a 1 m/s com bico de 0,5 cm: 16 m/s; vazão 0,314 L/s, balde de 10 L em 31,8 s;
   aorta (r = 1 cm, 0,3 m/s): 5,65 L/min, nos capilares (área total 0,3 m²): 0,31 mm/s; rio 20 m × 2 m a 1 m/s → 10 m × 1,5 m: 2,67 m/s;
   filete da torneira (r₀ = 0,5 cm, 0,5 m/s) 10 cm abaixo: v = 1,49 m/s, r = 0,29 cm. */
F.registrar("N02", {
  retoma: ["N01", "matematica/TE02", "U01"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "O que entra sai",
      casos: [
        { nome: "Mangueira com bico", gerar: (p) => {
          const D = p ? 2 : F.escolha([1.5, 2, 2.5]), d = p ? 0.5 : F.escolha([0.4, 0.5, 0.8]), v = p ? 1 : F.escolha([0.5, 1, 1.5]);
          const v2 = v * (D / d) ** 2, Q = (Math.PI * (D / 100) ** 2 * v) / 4;
          return { enun: R`<p>Uma mangueira de ${F.n(D)} cm de diâmetro leva água a ${F.n(v)} m/s até um bico de ${F.n(d)} cm. Com que velocidade a água sai? Quanto tempo leva para encher um balde de 10 L?</p>`, fig: "",
            passos: [R`<p>Continuidade: $A_1v_1 = A_2v_2$, e $A \propto D^2$: $v_2 = v_1\left(\frac{D}{d}\right)^2 = ${F.n(v)}\cdot${F.n((D / d) ** 2, 3)} \approx ${F.n(v2, 2)}$ m/s.</p>`, R`<p>Vazão: $Q = A_1v_1 = \frac{\pi(${F.n(D / 100)})^2}{4}\cdot${F.n(v)} \approx ${F.n(Q * 1000, 3)}$ L/s.</p>`, R`<p>Balde: $t = \frac{10\text{ L}}{Q} \approx ${F.n(0.01 / Q, 1)}$ s. O bico deixa a água mais rápida, mas <b>não</b> enche o balde mais depressa (a vazão é a mesma).</p>`] };
        } },
        { nome: "Divergente zero?", gerar: (p) => {
          const L = [[R`(x^2 - y^2,\ -2xy)`, R`2x - 2x = 0`, true], [R`(x, y)`, R`1 + 1 = 2`, false], [R`(y^2, x^2)`, R`0 + 0 = 0`, true], [R`(xy, -y^2/2)`, R`y - y = 0`, true], [R`(e^x, y)`, R`e^x + 1`, false]];
          const [c, d, ok] = p ? L[0] : F.escolha(L);
          return { enun: R`<p>O campo $\vec v = ${c}$ pode ser o escoamento de um fluido incompressível (como a água)?</p>`, fig: "",
            passos: [R`<p>Incompressível: $\nabla\cdot\vec v = 0$ em todo ponto ${F.ret("U01")}.</p>`, R`<p>$\nabla\cdot\vec v = ${d}$.</p>`, R`<p>${ok ? "Sim: o divergente é zero em todo lugar." : "Não: o divergente não é zero, então a densidade teria de mudar ($D\\rho/Dt = -\\rho\\nabla\\cdot\\vec v$). Só um gás (que se comprime e expande) poderia ter esse escoamento."}</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O filete da torneira",
      enun: R`<p>Uma torneira solta um filete de água com raio $r_0 = 0{,}5$ cm e velocidade $v_0 = 0{,}5$ m/s. Despreze a tensão superficial e a resistência do ar. (a) Use a conservação de energia de uma gota em queda livre para achar $v(h)$ a uma distância $h$ abaixo da boca. (b) Use a continuidade para achar o raio $r(h)$. (c) Calcule $v$ e $r$ a 10 cm. (d) Por que o filete, depois de afinar muito, se quebra em gotas?</p>`,
      fig: "",
      dicas: [R`<p>(a) $v^2 = v_0^2 + 2gh$.</p>`, R`<p>(b) $\pi r^2v = \pi r_0^2v_0$.</p>`],
      sol: R`<p><b>(a)</b> $v(h) = \sqrt{v_0^2 + 2gh}$.</p>
        <p><b>(b)</b> $r(h) = r_0\sqrt{\frac{v_0}{v(h)}} = r_0\left(1 + \frac{2gh}{v_0^2}\right)^{-1/4}$.</p>
        <p><b>(c)</b> $v = \sqrt{0{,}25 + 1{,}962} \approx 1{,}49$ m/s; $r = 0{,}5\sqrt{0{,}5/1{,}49} \approx 0{,}29$ cm. O filete afinou quase pela metade em 10 cm: dá para ver na pia.</p>
        <p><b>(d)</b> A tensão superficial (que desprezamos) tenta diminuir a área da superfície; um cilindro longo e fino tem mais área que uma fileira de gotas com o mesmo volume. Qualquer ondulação com comprimento de onda maior que o perímetro ($2\pi r$) cresce e corta o filete: é a <b>instabilidade de Plateau–Rayleigh</b>. Quanto mais fino, mais rápido quebra.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Fluidos · conservação da massa</div>
        <div class="q">Por que tampar a ponta da mangueira faz a água ir mais longe?</div>
        <p>Porque a água que entra por segundo na mangueira tem de sair por segundo pelo bico: se a saída é menor, a água tem de andar mais rápido. Essa é a equação da continuidade: <b>massa não se cria nem se destrói</b>. É a mais simples das equações dos fluidos e vale para tudo, de veias a galáxias.</p></div>`),

      F.secao("integral", "Forma integral e forma diferencial", R`
        ${F.formula(R`\frac{d}{dt}\int_V\rho\,dV = -\oint_{\partial V}\rho\,\vec v\cdot d\vec A\qquad\Longleftrightarrow\qquad \frac{\partial\rho}{\partial t} + \nabla\cdot(\rho\vec v) = 0`, "Equação da continuidade")}
        <p>Esquerda: a massa dentro de um volume fixo só muda pelo que entra ou sai pela borda. Direita: com o teorema da divergência ${F.ret("matematica/TE02")} e "vale para qualquer volume", vira uma equação em cada ponto. A mesma equação vale para carga elétrica ${F.ret("U05")} e para probabilidade na quântica ${F.ret("U06")}.</p>
        <p>Com a derivada material ${F.ret("N01")}, $\nabla\cdot(\rho\vec v) = \vec v\cdot\nabla\rho + \rho\nabla\cdot\vec v$, e a equação vira $\frac{D\rho}{Dt} = -\rho\,\nabla\cdot\vec v$: o divergente da velocidade é a <b>taxa de expansão</b> de um pedacinho de fluido.</p>
        ${F.formula(R`\rho = \text{constante}\ \Longrightarrow\ \nabla\cdot\vec v = 0\qquad\qquad \text{num tubo: } A_1v_1 = A_2v_2 = Q`, "Fluido incompressível")}
        <div id="lab-boc"></div>`),

      F.secao("aplicacoes", "Na prática", R`
        <ul><li><b>Corpo humano</b>: a aorta (raio de ~1 cm) leva sangue a ~0,3 m/s, ~5,6 L/min. Ela se divide em bilhões de capilares, com área total de ~0,3 m²: lá o sangue anda a ~0,3 mm/s, devagar o bastante para trocar oxigênio.</li>
          <li><b>Rios</b>: num estreito, a água corre mais rápido (corredeiras); num trecho largo e fundo, fica "parada".</li>
          <li><b>Gases</b>: $\rho$ muda, e a regra é $\rho Av = $ constante. Acima da velocidade do som, um bocal precisa <b>alargar</b> para acelerar o gás (bocal de foguete, de Laval): o gás expande mais rápido do que a área cresce.</li></ul>
        ${F.caixa("pegadinha", R`<p><b>Mais rápido não quer dizer mais vazão.</b> O bico acelera a água, mas a vazão é a mesma (é fixada pela torneira e pela pressão da rua). Encher um balde leva o mesmo tempo com e sem o dedo na ponta (desprezando o atrito na mangueira).</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Uma mangueira de 2 cm de diâmetro leva água a 1 m/s. Com que velocidade ela sai de um bico de 0,5 cm?</p>`, fig: "", dicas: [R`<p>$v_2 = v_1(D/d)^2$.</p>`, R`<p>$(2/0{,}5)^2 = 16$.</p>`], resp: R`16 m/s.`, sol: R`<p>Na prática, o bico também aumenta a perda de pressão, e a vazão cai um pouco.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Com a mangueira do exercício 1, quanto tempo leva para encher um balde de 10 L?</p>`, fig: "", dicas: [R`<p>$Q = \pi r^2v$ com $r = 1$ cm.</p>`, R`<p>$Q \approx 3{,}14\times10^{-4}$ m³/s.</p>`], resp: R`$\approx 31{,}8$ s.`, sol: R`<p>Igual com ou sem o bico.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>A aorta tem raio de 1 cm e o sangue anda nela a 0,3 m/s. Qual o débito cardíaco em L/min? Se a área total dos capilares é 0,3 m², qual a velocidade lá?</p>`, fig: "", dicas: [R`<p>$Q = \pi r^2v$; 1 m³/s = 60 000 L/min.</p>`, R`<p>$v = Q/A$.</p>`], resp: R`$\approx 5{,}65$ L/min; $\approx 0{,}31$ mm/s.`, sol: R`<p>A velocidade cai mil vezes, mas a vazão total é a mesma: o que entra na aorta passa por todos os capilares juntos.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Um rio de 20 m de largura e 2 m de profundidade corre a 1 m/s. Num trecho, ele estreita para 10 m de largura e 1,5 m de profundidade. Qual a velocidade lá?</p>`, fig: "", dicas: [R`<p>Área da seção: largura × profundidade.</p>`, R`<p>$40\cdot1 = 15\cdot v$.</p>`], resp: R`$\approx 2{,}67$ m/s.`, sol: R`<p>As corredeiras ficam onde o rio é estreito e raso.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>O campo $\vec v = (x^2 - y^2, -2xy)$ pode descrever água?</p>`, fig: "", dicas: [R`<p>Calcule $\nabla\cdot\vec v$.</p>`, R`<p>$2x - 2x$.</p>`], resp: R`Sim: $\nabla\cdot\vec v = 0$.`, sol: R`<p>Ele também tem rotacional zero: é um escoamento potencial (o escoamento perto de um canto, que aparece na simulação da U01 como "harmônico").</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Um gás tem velocidade $\vec v = (x, y)$ (em todo o plano, por um instante e depois sempre). Como varia a densidade de uma partícula de gás, se começa em $\rho_0$?</p>`, fig: "", dicas: [R`<p>$D\rho/Dt = -\rho\nabla\cdot\vec v$.</p>`, R`<p>$\nabla\cdot\vec v = 2$: EDO $\dot\rho = -2\rho$.</p>`], resp: R`$\rho = \rho_0e^{-2t}$.`, sol: R`<p>O gás se expande para todos os lados (como uma explosão): a área de um pedacinho cresce como $e^{2t}$ e a densidade cai na mesma proporção.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Um bocal de foguete leva gás que, depois da garganta, acelera de 1000 para 2000 m/s enquanto a densidade cai de 1,0 para 0,25 kg/m³. A área da seção aumenta ou diminui? Quanto?</p>`, fig: "", dicas: [R`<p>$\rho Av = $ constante.</p>`, R`<p>$\frac{A_2}{A_1} = \frac{\rho_1v_1}{\rho_2v_2}$.</p>`], resp: R`Aumenta: $A_2/A_1 = \frac{1\cdot1000}{0{,}25\cdot2000} = 2$.`, sol: R`<p>Acima da velocidade do som, o gás se expande tanto que, para acelerar, o bocal tem de <b>alargar</b>: é o formato de sino dos motores de foguete (bocal de Laval). Para a água (incompressível), isso nunca acontece.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-boc"); e.outerHTML = F.lab("Água num estreitamento", "lab-boc"); SIM.bocal(document.getElementById("lab-boc"), F); },
});
