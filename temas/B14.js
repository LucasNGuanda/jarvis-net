/* B14 · Instrumentos ópticos e olho humano (base: Halliday vol. 4, cap. 34, com as minhas palavras). Conferido em Python:
   lupa f = 5 cm: 5× (imagem no infinito) ou 6× (imagem a 25 cm); microscópio L = 16 cm, f_ob = 0,4 cm, f_oc = 2,5 cm: −400×; luneta 1000 mm / 25 mm: 40×, tubo de 1025 mm;
   olho (1,7 cm até a retina): ~59 di relaxado, ~63 di acomodado a 25 cm; câmera 50 mm com objeto a 2 m: sensor a 51,3 mm; telescópio de 20 cm: 3,4 × 10⁻⁶ rad = 0,69″. */
F.registrar("B14", {
  retoma: ["B13", "B14b"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Instrumentos nos números",
      casos: [
        { nome: "Microscópio", gerar: (p) => {
          const fob = p ? 0.4 : F.escolha([0.4, 0.8, 1.6]), foc = p ? 2.5 : F.escolha([2.5, 5]), L = 16, A = -(L / fob) * (25 / foc);
          return { enun: R`<p>Um microscópio tem objetiva de $f = ${F.n(fob)}$ cm e ocular de $f = ${F.n(foc)}$ cm, com comprimento de tubo (entre os focos internos) de 16 cm. Qual o aumento?</p>`, fig: "",
            passos: [
              R`<p>Objetiva: o objeto fica logo além do foco, e a imagem real se forma a ~16 cm além do foco dela. Aumento linear: $A_\text{ob} \approx -\frac{L}{f_\text{ob}} = -\frac{16}{${F.n(fob)}} = ${F.n(-L / fob, 1)}$.</p>`,
              R`<p>Ocular (lupa sobre a imagem da objetiva, com o olho relaxado): $A_\text{oc} = \frac{25\text{ cm}}{f_\text{oc}} = ${F.n(25 / foc, 1)}$.</p>`,
              R`<p>Total: $A = A_\text{ob}\,A_\text{oc} \approx ${F.n(A, 0)}\times$ (negativo: imagem invertida). Com luz visível, a difração limita a resolução a ~0,2 μm ${F.ret("B14b")}: aumentar mais que ~1000× não mostra detalhe novo ("aumento vazio").</p>`,
            ] };
        } },
        { nome: "Luneta", gerar: (p) => {
          const fob = p ? 1000 : F.escolha([500, 900, 1000, 1200]), foc = p ? 25 : F.escolha([10, 20, 25]), G = fob / foc;
          return { enun: R`<p>Um telescópio refrator tem objetiva de ${fob} mm e ocular de ${foc} mm de distância focal. Qual o aumento angular e o comprimento do tubo? A Lua (0,52°) cabe no campo de uma ocular de 50° de campo aparente?</p>`, fig: "",
            passos: [
              R`<p>Os focos coincidem: tubo $= f_\text{ob} + f_\text{oc} = ${fob + foc}$ mm.</p>`,
              R`<p>Aumento angular: $G = \frac{f_\text{ob}}{f_\text{oc}} = ${F.n(G, 1)}\times$.</p>`,
              R`<p>A Lua aparece com $0{,}52°\times${F.n(G, 1)} \approx ${F.n(0.52 * G, 1)}°$. ${0.52 * G <= 50 ? "Cabe nos 50°." : "Não cabe nos 50°: você vê só parte dela."} Para ver mais detalhe, mais aumento; para ver o céu mais fraco e mais fino, objetiva maior (coleta mais luz e difrata menos).</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Os limites do olho",
      enun: R`<p>(a) A pupila tem ~3 mm de diâmetro à luz do dia. Qual o limite de difração do olho para $\lambda = 550$ nm? (b) Na retina, a ~17 mm do cristalino, a que distância ficam as imagens de dois pontos no limite de resolução? Compare com o espaçamento dos cones na fóvea (~2,5 μm). (c) A natureza "acertou" o tamanho dos cones? (d) Até que distância você distingue as duas linhas de uma letra "=" impressa com 1 mm entre os traços?</p>`,
      fig: "",
      dicas: [R`<p>(a) Rayleigh: $\theta = 1{,}22\lambda/D$.</p>`, R`<p>(b) Na retina: $s = \theta\times17$ mm.</p>`],
      sol: R`<p><b>(a)</b> $\theta = \frac{1{,}22\times550\times10^{-9}}{3\times10^{-3}} \approx 2{,}2\times10^{-4}$ rad $\approx 0{,}77'$.</p>
        <p><b>(b)</b> $s = 2{,}2\times10^{-4}\times17$ mm $\approx 3{,}8$ μm.</p>
        <p><b>(c)</b> Os cones estão a ~2,5 μm: um pouco mais finos que a mancha de difração. Cones bem mais finos não ajudariam (a óptica já borra), e bem mais grossos desperdiçariam a resolução da pupila. A evolução chegou perto do ótimo: a acuidade "20/20" corresponde a ~1′.</p>
        <p><b>(d)</b> Com 1′ $\approx 2{,}9\times10^{-4}$ rad: $d \approx \frac{1\text{ mm}}{2{,}9\times10^{-4}} \approx 3{,}4$ m. Mais longe que isso, o "=" vira um traço só. É assim que funciona a tabela de oftalmologista.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Óptica · instrumentos</div>
        <div class="q">Um telescópio "aumenta" a estrela?</div>
        <p>Não: estrelas são pontos, e continuam pontos. O telescópio aumenta <b>ângulos</b> (dois pontos próximos no céu ficam mais separados) e, principalmente, <b>coleta luz</b>. Todo instrumento óptico é uma combinação de lentes ou espelhos ${F.ret("B13")} ${F.ret("B11")} para enganar o olho. Começamos pelo próprio olho.</p></div>`),

      F.secao("olho", "O olho humano", R`
        <p>A córnea e o cristalino formam uma lente convergente que projeta na retina uma imagem real e invertida (o cérebro desinverte). A distância lente–retina é fixa (~1,7 cm); para focar a várias distâncias, os músculos ciliares mudam a curvatura do cristalino: é a <b>acomodação</b>.</p>
        <ul><li><b>Ponto remoto</b>: o mais longe que se vê nítido (no olho normal, o infinito, com o cristalino relaxado: ~59 di no total).</li>
          <li><b>Ponto próximo</b>: o mais perto (~25 cm no adulto jovem, com o cristalino no esforço máximo: ~63 di).</li></ul>
        <table class="tb"><tr><th>defeito</th><th>o que acontece</th><th>correção</th></tr>
          <tr><td>miopia</td><td>olho "comprido" ou convergente demais: foca antes da retina; não vê longe</td><td>lente divergente, $f = -D_R$</td></tr>
          <tr><td>hipermetropia</td><td>olho "curto": foca depois da retina; ponto próximo longe</td><td>lente convergente</td></tr>
          <tr><td>presbiopia</td><td>cristalino endurece com a idade; perde acomodação</td><td>óculos de leitura (convergente)</td></tr>
          <tr><td>astigmatismo</td><td>córnea com curvaturas diferentes em direções diferentes</td><td>lente cilíndrica</td></tr></table>
        <p>As contas de óculos estão na B13 ${F.ret("B13")}.</p>`),

      F.secao("lupa", "Lupa, câmera, microscópio e luneta", R`
        <p><b>Lupa</b>: lente convergente com o objeto um pouco dentro do foco. O que importa é o <b>aumento angular</b>, comparado com o objeto visto a olho nu no ponto próximo (25 cm): $G = \frac{25\text{ cm}}{f}$ (imagem no infinito, olho relaxado) ou $\frac{25}{f} + 1$ (imagem a 25 cm). Uma lupa de $f = 5$ cm aumenta 5 ou 6 vezes.</p>
        <p><b>Câmera</b>: uma lente forma imagem real no sensor. Para focar, a lente se afasta do sensor (objeto a 2 m com $f = 50$ mm: sensor a 51,3 mm). O <b>número f</b> ($f/D$, como "f/2") controla quanta luz entra: a área da abertura vai com $D^2$.</p>
        <div id="lab-ins"></div>
        ${F.formula(R`A_\text{microscópio} \approx -\frac{L}{f_\text{ob}}\cdot\frac{25\text{ cm}}{f_\text{oc}}\qquad\qquad G_\text{luneta} = \frac{f_\text{ob}}{f_\text{oc}}`, "Aumentos")}
        <p><b>Microscópio</b>: duas lentes convergentes de focos curtos. A objetiva forma uma imagem real ampliada; a ocular é uma lupa sobre ela. Com $L = 16$ cm, $f_\text{ob} = 0{,}4$ cm e $f_\text{oc} = 2{,}5$ cm: $400\times$.</p>
        <p><b>Luneta</b> (telescópio refrator): objetiva de foco longo, ocular de foco curto, com focos coincidentes. A imagem final é invertida (para astronomia, tanto faz). <b>Telescópio refletor</b> (Newton, 1668): troca a objetiva por um espelho côncavo (sem aberração cromática e muito mais fácil de fazer grande). O James Webb tem um espelho de 6,5 m.</p>
        ${F.caixa("fisico", R`<p><b>O que limita um telescópio</b>: (1) a luz coletada, $\propto D^2$ (vê objetos mais fracos); (2) a difração, $\theta \approx 1{,}22\lambda/D$ ${F.ret("B14b")} (um de 20 cm separa ~0,7″); (3) a turbulência do ar, que borra tudo a ~1″. Por isso os grandes observatórios ficam em montanhas secas (Chile) ou no espaço, e usam óptica adaptativa (espelhos que se deformam mil vezes por segundo).</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Qual o aumento angular de uma lupa de $f = 5$ cm, com a imagem no infinito e com a imagem a 25 cm?</p>`, fig: "", dicas: [R`<p>$G = 25/f$ e $25/f + 1$.</p>`, R`<p>$f$ em cm.</p>`], resp: R`$5\times$ e $6\times$.`, sol: R`<p>Com a imagem a 25 cm, a lupa trabalha um pouco mais (e cansa mais o olho).</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Um microscópio: $f_\text{ob} = 0{,}4$ cm, $f_\text{oc} = 2{,}5$ cm, $L = 16$ cm. Qual o aumento? Que tamanho aparente tem uma bactéria de 2 μm?</p>`, fig: "", dicas: [R`<p>$A = -\frac{16}{0{,}4}\cdot\frac{25}{2{,}5}$.</p>`, R`<p>Tamanho aparente: equivalente a um objeto de $400\times2$ μm visto a 25 cm.</p>`], resp: R`$-400\times$; parece um objeto de 0,8 mm a 25 cm.`, sol: R`<p>0,8 mm a 25 cm é bem visível (ângulo de ~11′). Para ver vírus (~0,1 μm), a luz visível não serve: é preciso microscópio eletrônico, com $\lambda$ de de Broglie muito menor ${F.ret("C17")}.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Uma luneta tem objetiva de 1000 mm e ocular de 25 mm. Qual o aumento e o comprimento do tubo? Que ocular daria 100×?</p>`, fig: "", dicas: [R`<p>$G = f_\text{ob}/f_\text{oc}$.</p>`, R`<p>Tubo $= f_\text{ob} + f_\text{oc}$.</p>`], resp: R`$40\times$, 1025 mm; ocular de 10 mm.`, sol: R`<p>Trocar de ocular muda o aumento sem mexer na objetiva. Mas aumento demais só amplia o borrão da atmosfera.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Uma câmera tem lente de 50 mm. A que distância do sensor a lente fica para focar algo a 2 m? E no infinito?</p>`, fig: "", dicas: [R`<p>$\frac1{p'} = \frac1{50} - \frac1{2000}$ (mm).</p>`, R`<p>No infinito, $p' = f$.</p>`], resp: R`$\approx 51{,}3$ mm; 50 mm.`, sol: R`<p>O ajuste de foco é só ~1,3 mm de movimento da lente para ir do infinito até 2 m.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma lente f/2 e uma f/4, com o mesmo $f$. Quantas vezes mais luz a primeira deixa passar?</p>`, fig: "", dicas: [R`<p>$D = f/N$.</p>`, R`<p>Luz $\propto D^2$.</p>`], resp: R`4 vezes.`, sol: R`<p>Por isso a escala de números f é 1,4; 2; 2,8; 4; 5,6…: cada passo multiplica $N$ por $\sqrt2$ e corta a luz pela metade.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>O olho relaxado tem a retina a 1,7 cm do sistema córnea–cristalino. Qual a vergência total para focar no infinito? E para focar a 25 cm? Quanto o cristalino precisa mudar?</p>`, fig: "", dicas: [R`<p>No infinito: $V = \frac{1}{0{,}017}$.</p>`, R`<p>A 25 cm: $V = \frac{1}{0{,}25} + \frac{1}{0{,}017}$.</p>`], resp: R`$\approx 59$ di e $\approx 63$ di: uma variação de 4 di.`, sol: R`<p>A amplitude de acomodação de um jovem é de ~10 di (lê a 10 cm); aos 50 anos, cai para ~2 di (ponto próximo a 50 cm): é a presbiopia.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Qual a menor separação angular que um telescópio de 20 cm resolve em luz de 550 nm? Duas estrelas separadas por 1″ podem ser vistas separadas com ele, se a atmosfera estiver estável?</p>`, fig: "", dicas: [R`<p>Rayleigh: $1{,}22\lambda/D$.</p>`, R`<p>1″ $= 4{,}85\times10^{-6}$ rad.</p>`], resp: R`$\approx 3{,}4\times10^{-6}$ rad $\approx 0{,}69″$: sim.`, sol: R`<p>$0{,}69″ < 1″$. Mas, numa noite comum, a turbulência borra a ~1–2″, e o limite real fica sendo a atmosfera.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-ins"); e.outerHTML = F.lab("Microscópio e luneta", "lab-ins"); SIM.instrumento(document.getElementById("lab-ins"), F); },
});
