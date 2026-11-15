/* O05 · Fundamentos da óptica geométrica (base: Halliday vol. 4, cap. 33, e conteúdo de ensino médio, com as minhas palavras). Conferido em Python:
   câmara escura (árvore de 10 m a 20 m, caixa de 30 cm) → 15 cm; prédio pela sombra (15 m; haste 1 m faz 0,8 m) → 18,75 m; Sol 0,53° e Lua 0,52°;
   luz do Sol leva 8,3 min; ano-luz 9,46 × 10¹⁵ m; Eratóstenes: 7,2° e 800 km → 40 000 km. */
F.registrar("O05", {
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Raios de luz e semelhança de triângulos",
      casos: [
        { nome: "Câmara escura", gerar: (p) => {
          const H = p ? 10 : F.escolha([3, 5, 10, 20]), d = p ? 20 : F.escolha([10, 20, 40, 50]), L = p ? 30 : F.escolha([20, 30, 50]), h = (H * L) / d;
          return { enun: R`<p>Uma câmara escura (caixa com um furinho) tem ${L} cm de profundidade. Ela é apontada para uma árvore de ${H} m a ${d} m de distância. Qual o tamanho da imagem no fundo da caixa? Como ela é?</p>`, fig: "",
            passos: [
              R`<p>Os raios passam pelo furo em linha reta e se cruzam: o topo da árvore vai para baixo, e a base para cima. Imagem <b>invertida</b>.</p>`,
              R`<p>Triângulos semelhantes com vértice no furo: $\frac{h}{H} = \frac{L}{d}$.</p>`,
              R`<p>$h = ${H}\text{ m}\cdot\frac{${L}\text{ cm}}{${d}\text{ m}} = ${F.n(h, 2)}$ cm. Um furo menor deixa a imagem mais nítida (e mais escura); um furo grande demais borra tudo. Furinhos entre as folhas de uma árvore projetam no chão dezenas de imagens redondas do Sol.</p>`,
            ] };
        } },
        { nome: "Altura pela sombra", gerar: (p) => {
          const S = p ? 15 : F.escolha([6, 12, 15, 24]), h = p ? 1 : F.escolha([1, 1.5, 2]), s = p ? 0.8 : F.escolha([0.6, 0.8, 1.2, 1.5]), H = (S * h) / s;
          return { enun: R`<p>Num dia de sol, um prédio faz uma sombra de ${S} m, enquanto uma haste vertical de ${F.nt(h)} m faz uma sombra de ${F.nt(s)} m. Qual a altura do prédio?</p>`, fig: "",
            passos: [
              R`<p>O Sol está tão longe que seus raios chegam praticamente <b>paralelos</b>: o ângulo deles com o chão é o mesmo para o prédio e para a haste.</p>`,
              R`<p>Triângulos semelhantes: $\frac{H}{${S}} = \frac{${F.n(h)}}{${F.n(s)}}$.</p>`,
              R`<p>$H = ${F.n(H, 2)}$ m. Tales teria medido a altura de uma pirâmide do Egito assim, segundo a tradição.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Eratóstenes mede a Terra com uma vareta",
      enun: R`<p>Por volta de 240 a.C., Eratóstenes soube que, ao meio-dia do solstício, o Sol iluminava o fundo de um poço em Siena (o Sol estava a pino). No mesmo dia e hora, em Alexandria, ao norte, uma vareta vertical fazia sombra: o Sol estava a 7,2° da vertical. A distância entre as cidades era de uns 800 km.</p><p>(a) Supondo os raios do Sol paralelos, calcule a circunferência da Terra. (b) Que hipóteses físicas ele usou? (c) Por que a hipótese dos raios paralelos é boa? Use o tamanho angular do Sol (0,53°) e o raio da Terra que você achou.</p>`,
      fig: "",
      dicas: [R`<p>(a) Raios paralelos e Terra redonda: o ângulo da sombra em Alexandria é o ângulo entre as duas cidades, medido do centro da Terra.</p>`, R`<p>(a) 7,2° é que fração de 360°?</p>`],
      sol: R`<p><b>(a)</b> $\frac{7{,}2°}{360°} = \frac{1}{50}$: os 800 km são $\frac1{50}$ da volta. Circunferência: $50\times800 = 40\,000$ km (o valor moderno é 40 075 km).</p>
        <p><b>(b)</b> Luz anda em linha reta; os raios do Sol chegam paralelos (Sol muito longe); a Terra é esférica; as duas cidades estão no mesmo meridiano.</p>
        <p><b>(c)</b> Pelo diâmetro angular de 0,53°, raios de pontos opostos do disco solar diferem em no máximo ~0,5°. Já a diferença de direção do centro do Sol entre as duas cidades é ~$\frac{800\text{ km}}{1{,}5\times10^8\text{ km}}$ rad, uns 0,0003°: desprezível. O "borrão" de 0,5° deixa a ponta da sombra um pouco difusa (penumbra), mas não muda o ângulo médio.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Óptica · fundamentos</div>
        <div class="q">Como alguém mediu o tamanho da Terra 2200 anos atrás, sem sair do Egito?</div>
        <p>Com uma vareta, uma sombra e uma ideia: a luz anda em linha reta. Essa ideia, mais duas outras, é a base de toda a óptica geométrica (espelhos, lentes, instrumentos). Ela vale sempre que os objetos são muito maiores que o comprimento de onda da luz; quando não são, entra a óptica ondulatória ${F.ret("O10b")}.</p></div>`),

      F.secao("principios", "Os três princípios", R`
        <ol><li><b>Propagação retilínea</b>: num meio homogêneo, a luz anda em linha reta (por isso sombras têm o formato do objeto).</li>
          <li><b>Independência dos raios</b>: feixes que se cruzam não se perturbam (dois holofotes cruzando no palco).</li>
          <li><b>Reversibilidade</b>: o caminho da luz é o mesmo nos dois sentidos. Se você vê o olho de alguém num espelho, essa pessoa vê o seu.</li></ol>
        <p><b>Fontes</b>: primárias (emitem luz própria: Sol, lâmpada) e secundárias (só refletem: Lua, este texto). <b>Meios</b>: transparentes (vidro), translúcidos (vidro fosco: a luz passa, mas espalhada) e opacos.</p>
        <p><b>Cor dos objetos</b>: um objeto iluminado com luz branca reflete (espalha) as cores que não absorve. Uma folha é verde porque absorve vermelho e azul (que a fotossíntese usa). Sob luz só vermelha, a mesma folha parece quase preta.</p>
        <p><b>Velocidade da luz</b>: $c \approx 3\times10^8$ m/s. A luz do Sol leva 8,3 min para chegar; a da estrela mais próxima depois do Sol, 4,2 anos. 1 ano-luz $\approx 9{,}5\times10^{15}$ m. Olhar longe é olhar para o passado.</p>`),

      F.secao("sombra", "Sombra, penumbra e eclipses", R`
        <div id="lab-som"></div>
        <p>Com uma fonte <b>extensa</b>, atrás do obstáculo há a <b>umbra</b> (nenhum ponto da fonte é visível) e a <b>penumbra</b> (parte da fonte é visível). Eclipses são isso em escala astronômica:</p>
        <ul><li><b>Eclipse solar</b>: a Lua passa entre o Sol e a Terra. Na umbra da Lua, eclipse total; na penumbra, parcial. Quando a Lua está mais longe, a umbra não chega à Terra, e o eclipse é <b>anular</b> (um anel de Sol em volta da Lua).</li>
          <li><b>Eclipse lunar</b>: a Terra passa entre o Sol e a Lua. A Lua fica avermelhada porque a atmosfera da Terra desvia para dentro da sombra a luz vermelha dos pores do sol do planeta inteiro (o azul é espalhado antes).</li></ul>
        ${F.caixa("fisico", R`<p><b>Coincidência cósmica</b>: o Sol é ~400 vezes maior que a Lua e está ~400 vezes mais longe. Por isso os dois têm quase o mesmo tamanho angular no céu (~0,5°), e eclipses totais são possíveis e curtos. A Lua se afasta ~3,8 cm por ano: daqui a centenas de milhões de anos, só haverá eclipses anulares.</p>`)}
        <h3>Câmara escura</h3>
        <p>Uma caixa com um furinho forma, na parede oposta, uma imagem <b>invertida</b> do que está fora: $\frac{h_\text{imagem}}{H_\text{objeto}} = \frac{L_\text{caixa}}{d_\text{objeto}}$. É o princípio de toda câmera (a lente só permite usar um "furo" grande sem borrar ${F.ret("O09")}) e do olho ${F.ret("O10")}.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Uma câmara escura de 30 cm de profundidade, apontada para uma árvore de 10 m a 20 m de distância. Qual o tamanho da imagem?</p>`, fig: "", dicas: [R`<p>$\frac hH = \frac Ld$.</p>`, R`<p>Cuidado com as unidades.</p>`], resp: R`$15$ cm, invertida.`, sol: R`<p>$10\cdot\frac{0{,}30}{20} = 0{,}15$ m.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Um prédio faz uma sombra de 15 m, e uma haste de 1 m faz uma sombra de 0,8 m no mesmo instante. Qual a altura do prédio?</p>`, fig: "", dicas: [R`<p>Raios do Sol paralelos.</p>`, R`<p>$\frac{H}{15} = \frac{1}{0{,}8}$.</p>`], resp: R`$18{,}75$ m.`, sol: R`<p>Semelhança de triângulos, a ferramenta número 1 da óptica geométrica.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>O Sol tem diâmetro de $1{,}39\times10^9$ m e está a $1{,}50\times10^{11}$ m. A Lua tem diâmetro de $3{,}47\times10^6$ m e está a $3{,}84\times10^8$ m. Calcule os diâmetros angulares dos dois.</p>`, fig: "", dicas: [R`<p>Ângulo pequeno: $\theta \approx \frac{D}{d}$ (em radianos).</p>`, R`<p>Converta para graus.</p>`], resp: R`Sol $\approx 0{,}53°$; Lua $\approx 0{,}52°$.`, sol: R`<p>Quase iguais: é a "coincidência cósmica" que permite eclipses totais. Como a órbita da Lua é elíptica, às vezes ela é um pouco menor que o Sol no céu (eclipse anular).</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Uma lâmpada pequena está a 1 m de uma bola de 10 cm de diâmetro, e a parede está a 3 m da lâmpada. Qual o diâmetro da sombra na parede?</p>`, fig: "", dicas: [R`<p>Fonte pontual: semelhança de triângulos a partir da lâmpada.</p>`, R`<p>$\frac{D}{3} = \frac{0{,}1}{1}$.</p>`], resp: R`$30$ cm.`, sol: R`<p>A sombra cresce proporcionalmente à distância da fonte. Com fonte extensa, apareceria uma penumbra em volta (teste no laboratório).</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Quanto tempo a luz leva da Lua até a Terra? E quanto tempo um sinal de rádio leva até Marte, quando ele está a $2{,}25\times10^{11}$ m?</p>`, fig: "", dicas: [R`<p>$t = d/c$.</p>`, R`<p>Lua: $3{,}84\times10^8$ m.</p>`], resp: R`Lua $\approx 1{,}3$ s; Marte $\approx 12{,}5$ min.`, sol: R`<p>Por isso não dá para pilotar um robô em Marte "ao vivo": cada comando leva minutos para chegar, e a resposta leva outros tantos.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Por que durante um eclipse lunar total a Lua fica vermelha, e não preta?</p>`, fig: "", dicas: [R`<p>A Terra tem atmosfera.</p>`, R`<p>Pense no pôr do sol: a luz que atravessa muito ar fica vermelha. E a atmosfera refrata (entorta) a luz ${F.ret("O08")}.</p>`], resp: R`A atmosfera da Terra desvia luz para dentro da sombra; o azul é espalhado no caminho e sobra o vermelho.`, sol: R`<p>Da Lua, você veria a Terra escura com um anel vermelho em volta: todos os nasceres e pores do sol do planeta ao mesmo tempo.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Uma placa opaca com um furo triangular é posta ao sol, a 2 m do chão. A mancha de luz no chão é triangular ou redonda? E se o furo for de 1 mm? E de 30 cm?</p>`, fig: "", dicas: [R`<p>Um furo pequeno é uma câmara escura: forma a imagem da fonte.</p>`, R`<p>A imagem do Sol a 2 m tem diâmetro $\approx 2\text{ m}\times0{,}0093$ rad.</p>`], resp: R`Furo de 1 mm: redonda (imagem do Sol, ~1,9 cm). Furo de 30 cm: triangular (a sombra do furo, com bordas de penumbra de ~1,9 cm).`, sol: R`<p>Cada ponto do furo projeta uma imagem do Sol de ~1,9 cm. Furo muito menor que isso: o que se vê é o Sol (redondo). Furo muito maior: a soma das imagens tem o formato do furo, com a borda borrada.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-som"); e.outerHTML = F.lab("Sombra, penumbra e fonte extensa", "lab-som"); SIM.sombra(document.getElementById("lab-som"), F); },
});
