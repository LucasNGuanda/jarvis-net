/* C18 · Relatividade especial (base: Halliday vol. 4, cap. 37, com as minhas palavras). Conferido em Python (scratchpad mod.py):
   γ(0,6) = 1,25; γ(0,8) = 5/3; múon a 0,998c: γ = 15,8, 658 m sem dilatação e 10,4 km com; 0,6c ⊕ 0,6c = 0,882c; GPS: −7,2 μs/dia (velocidade) + 45,7 (gravidade) ≈ +38 μs/dia;
   elétron: 0,511 MeV; a 0,8c: K = 0,341 MeV, p = 0,681 MeV/c; gêmeos a 0,8c até 8 anos-luz: 20 anos na Terra, 12 na nave; Doppler 0,6c: fator 0,5 e 2; o Sol perde 4,3 × 10⁹ kg/s. */
F.registrar("C18", {
  retoma: ["C15d", "matematica/CII04"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Relatividade nos números",
      casos: [
        { nome: "Dilatação do tempo", gerar: (p) => {
          const b = p ? 0.8 : F.escolha([0.6, 0.8, 0.9, 0.99]), t0 = p ? 2.2 : F.escolha([1, 2.2, 10]), g = 1 / Math.sqrt(1 - b * b);
          return { enun: R`<p>Uma partícula vive ${F.n(t0)} μs no seu próprio referencial e viaja a ${F.n(b)}c. Quanto tempo ela vive, medido no laboratório? Que distância percorre?</p>`, fig: "",
            passos: [
              R`<p>$\gamma = \frac{1}{\sqrt{1 - ${F.n(b)}^2}} = ${F.n(g, 3)}$.</p>`,
              R`<p>O tempo próprio (no relógio que viaja junto) é o menor: $\Delta t = \gamma\Delta t_0 = ${F.n(g, 3)}\times${F.n(t0)} = ${F.n(g * t0, 2)}$ μs.</p>`,
              R`<p>Distância: $v\Delta t = ${F.n(b)}\cdot3\times10^8\cdot${F.n(g * t0, 2)}\times10^{-6} \approx ${F.n(b * 3e8 * g * t0 * 1e-6, 0)}$ m. Sem relatividade, você calcularia só ${F.n(b * 3e8 * t0 * 1e-6, 0)} m.</p>`,
            ] };
        } },
        { nome: "Soma de velocidades", gerar: (p) => {
          const u = p ? 0.6 : F.escolha([0.5, 0.6, 0.8, 0.9]), v = p ? 0.6 : F.escolha([0.5, 0.6, 0.7, 0.9]), w = (u + v) / (1 + u * v);
          return { enun: R`<p>Uma nave passa pela Terra a ${F.n(u)}c e dispara para a frente um míssil a ${F.n(v)}c (em relação à nave). Qual a velocidade do míssil medida da Terra?</p>`, fig: "",
            passos: [
              R`<p>Galileu diria $${F.n(u)} + ${F.n(v)} = ${F.n(u + v)}c$${u + v > 1 ? ", mais rápido que a luz: impossível" : ""}.</p>`,
              R`<p>Einstein: $w = \frac{u + v}{1 + uv/c^2} = \frac{${F.n(u + v)}}{1 + ${F.n(u * v, 4)}} = ${F.n(w, 4)}c$.</p>`,
              R`<p>Sempre abaixo de $c$. Teste o caso extremo: com $v = c$ (um pulso de luz), $w = \frac{u + c}{1 + u/c} = c$. A luz tem a mesma velocidade para todos, como manda o 2º postulado.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O paradoxo dos gêmeos",
      enun: R`<p>Ana fica na Terra. Bia viaja a $0{,}8c$ até uma estrela a 8 anos-luz e volta na mesma velocidade.</p><p>(a) Quanto tempo passa para Ana? E para Bia? (b) "Paradoxo": do ponto de vista de Bia, é a Terra que se move, então Ana é quem deveria envelhecer menos. Onde está o erro? (c) Confira com o efeito Doppler: as duas mandam um sinal de luz por ano de aniversário. Quantos sinais cada uma recebe da outra, na ida e na volta?</p>`,
      fig: "",
      dicas: [R`<p>(b) As duas situações não são simétricas: quem muda de referencial inercial na virada?</p>`, R`<p>(c) Fator Doppler a $0{,}8c$: afastando, $\sqrt{\frac{1 - \beta}{1 + \beta}} = \frac13$; aproximando, 3.</p>`],
      sol: R`<p><b>(a)</b> Ana: $\frac{2\times8}{0{,}8} = 20$ anos. Bia: $\gamma = \frac53$, então $\frac{20}{5/3} = 12$ anos (para ela, a distância também encolhe para $8\cdot\frac35 = 4{,}8$ anos-luz, e $\frac{2\times4{,}8}{0{,}8} = 12$ ✓).</p>
        <p><b>(b)</b> Ana fica num único referencial inercial o tempo todo. Bia troca de referencial na estrela (acelera para voltar): o raciocínio "eu estou parada" não vale para ela durante a viagem inteira. A assimetria é real, e Bia volta mais jovem.</p>
        <p><b>(c)</b> Bia, na ida (6 anos dela), recebe os sinais de Ana a $\frac13$ por ano: 2 sinais. Na volta (6 anos), a 3 por ano: 18. Total: 20 = a idade que Ana ganhou ✓. Ana recebe os sinais de Bia a $\frac13$ por ano durante 18 anos (8 da ida mais os 10 até a luz da virada chegar), ou seja, 6; depois a 3 por ano nos 2 anos finais: 6. Total: 12 = a idade que Bia ganhou ✓. Ninguém discorda de nada: as contagens batem.</p>
        <p class="det" style="color:var(--ink2)">Isso já foi testado: relógios atômicos levados em aviões ao redor do mundo (Hafele e Keating, 1971) voltaram atrasados ou adiantados exatamente como a relatividade prevê.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Moderna · relatividade</div>
        <div class="q">Se você correr atrás de um raio de luz a 99% da velocidade dela, a luz se afasta de você a que velocidade?</div>
        <p>A $c$, exatamente como se você estivesse parado. Einstein (1905) levou isso a sério, e o preço foi abrir mão de um tempo e um espaço absolutos. Hoje o GPS do seu celular erraria quilômetros por dia sem essas correções.</p></div>`),

      F.secao("postulados", "Os dois postulados", R`
        <ol><li><b>Relatividade:</b> as leis da física são as mesmas em todos os referenciais inerciais. Não existe "repouso absoluto".</li>
          <li><b>Constância da luz:</b> a luz no vácuo tem a mesma velocidade $c$ em todos os referenciais inerciais, não importa o movimento da fonte.</li></ol>
        <p>O 2º parece absurdo (velocidades não se somam?), mas é uma consequência do 1º aplicado às equações de Maxwell, que preveem ondas com velocidade $c = 1/\sqrt{\mu_0\varepsilon_0}$ sem dizer "em relação a quê" ${F.ret("C15d")}. O experimento de Michelson–Morley (1887) procurou o "vento do éter" e não achou nada.</p>
        <div id="lab-rel"></div>`),

      F.secao("tempo", "Dilatação do tempo e contração do espaço", R`
        ${F.demo("o relógio de luz", R`<p>(i) Na nave, um pulso de luz sobe e desce entre dois espelhos a distância $L$: um tique dura $\Delta t_0 = \frac{2L}{c}$ (tempo <b>próprio</b>, medido por um relógio parado em relação ao evento).</p>
          <p>(ii) Da Terra, a nave anda $v\Delta t$ durante o tique, e a luz percorre a hipotenusa: $\left(\frac{c\Delta t}{2}\right)^2 = L^2 + \left(\frac{v\Delta t}{2}\right)^2$.</p>
          <p>(iii) Isolando: $\Delta t^2(c^2 - v^2) = 4L^2 = c^2\Delta t_0^2$, ou seja:</p>
          ${F.formula(R`\Delta t = \gamma\,\Delta t_0,\qquad \gamma = \frac{1}{\sqrt{1 - v^2/c^2}}`, "Dilatação do tempo")}
          <p>(iv) Como $\gamma \geq 1$, o relógio em movimento anda mais devagar, visto por quem o vê passar ∎.</p>`)}
        <table class="tb"><tr><th>v/c</th><td>0,1</td><td>0,6</td><td>0,8</td><td>0,9</td><td>0,99</td><td>0,998</td></tr><tr><th>γ</th><td>1,005</td><td>1,25</td><td>1,67</td><td>2,29</td><td>7,09</td><td>15,8</td></tr></table>
        ${F.formula(R`L = \frac{L_0}{\gamma}`, "Contração do comprimento (na direção do movimento)")}
        ${F.caixa("fisico", R`<p><b>Os múons provam.</b> Raios cósmicos criam múons a uns 10 km de altura, viajando a $0{,}998c$. Eles vivem 2,2 μs (em média): sem relatividade, andariam só 660 m e quase nenhum chegaria ao chão. Mas chegam muitos. Para nós, o relógio deles anda 15,8 vezes mais devagar (10,4 km de alcance). Para o múon, é a atmosfera que encolhe 15,8 vezes. As duas descrições dão o mesmo resultado.</p>`)}
        <p><b>GPS</b>: os satélites andam a ~3,9 km/s (o relógio atrasa ~7 μs/dia) e estão mais longe da gravidade da Terra (a relatividade geral adianta ~46 μs/dia). Saldo: +38 μs/dia. Sem corrigir, o erro de posição cresceria ~11 km por dia.</p>`),

      F.secao("lorentz", "Transformação de Lorentz e simultaneidade", R`
        ${F.formula(R`x' = \gamma(x - vt),\qquad t' = \gamma\left(t - \frac{vx}{c^2}\right)`, "Transformação de Lorentz")}
        <p>Para $v \ll c$, $\gamma \approx 1$ e o termo $\frac{vx}{c^2}$ some: volta a ser Galileu ($x' = x - vt$, $t' = t$). O termo $\frac{vx}{c^2}$ diz que eventos simultâneos para um observador ($\Delta t = 0$) <b>não são</b> simultâneos para outro, se acontecerem em lugares diferentes: a <b>relatividade da simultaneidade</b>, a raiz de todos os "paradoxos".</p>
        <p>Grandezas que todos concordam (invariantes): a velocidade da luz e o <b>intervalo</b> $c^2\Delta t^2 - \Delta x^2$. Para um relógio que viaja junto com o evento, $\Delta x = 0$, e o intervalo vira $c^2\Delta t_0^2$: o tempo próprio é a "distância" no espaço-tempo.</p>
        <p><b>Soma de velocidades</b>: $w = \frac{u + v}{1 + uv/c^2}$, nunca passa de $c$. <b>Doppler relativístico</b>: afastando-se a $\beta c$, a frequência é multiplicada por $\sqrt{\frac{1 - \beta}{1 + \beta}}$ (o "desvio para o vermelho" das galáxias).</p>`),

      F.secao("energia", "E = mc²", R`
        ${F.formula(R`p = \gamma mv,\qquad E = \gamma mc^2,\qquad K = (\gamma - 1)mc^2,\qquad E^2 = (pc)^2 + (mc^2)^2`, "Momento e energia relativísticos")}
        <p>Parada, uma partícula tem energia $E_0 = mc^2$ (energia de repouso). Para $v \ll c$, Taylor dá $K = (\gamma - 1)mc^2 \approx \frac12mv^2$ ${F.ret("matematica/CII04")}. Quando $v \to c$, $\gamma \to \infty$: acelerar uma massa até $c$ exigiria energia infinita. Partículas sem massa (fótons) têm $E = pc$ e só andam a $c$.</p>
        <p>A massa é uma forma de energia: no Sol, a fusão converte 4,3 milhões de toneladas de massa em energia <b>por segundo</b>. 1 kg de massa equivale a $9\times10^{16}$ J, uns 25 bilhões de kWh. Num reator nuclear ${F.ret("C19")}, uma fração de ~0,1% da massa do urânio vira energia.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $\gamma$ para $v = 0{,}6c$ e $0{,}8c$. Um relógio a $0{,}8c$ marca 1 h. Quanto tempo passou para quem o viu passar?</p>`, fig: "", dicas: [R`<p>$\gamma = 1/\sqrt{1 - \beta^2}$.</p>`, R`<p>$1 - 0{,}64 = 0{,}36$.</p>`], resp: R`$\gamma = 1{,}25$ e $\frac53$; passou 1 h 40 min.`, sol: R`<p>$\sqrt{0{,}36} = 0{,}6$, $\gamma = \frac{1}{0{,}6} = 1{,}667$. Esses dois valores (3-4-5 relativísticos) caem muito em prova.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Um múon vive 2,2 μs em repouso e viaja a $0{,}998c$. Que distância ele percorre, em média, segundo um observador na Terra?</p>`, fig: "", dicas: [R`<p>$\gamma \approx 15{,}8$.</p>`, R`<p>$d = v\gamma\Delta t_0$.</p>`], resp: R`$\approx 10{,}4$ km.`, sol: R`<p>$0{,}998\times3\times10^8\times15{,}8\times2{,}2\times10^{-6} \approx 1{,}04\times10^4$ m.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Uma nave de 100 m (medidos nela) passa pela Terra a $0{,}6c$. Que comprimento a Terra mede?</p>`, fig: "", dicas: [R`<p>$L = L_0/\gamma$.</p>`, R`<p>$\gamma = 1{,}25$.</p>`], resp: R`$80$ m.`, sol: R`<p>Só a dimensão na direção do movimento encolhe; a largura continua igual.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Duas naves se aproximam, cada uma a $0{,}6c$ em relação à Terra. Com que velocidade uma vê a outra chegar?</p>`, fig: "", dicas: [R`<p>Fórmula de soma: $\frac{u + v}{1 + uv/c^2}$.</p>`, R`<p>$\frac{1{,}2}{1{,}36}$.</p>`], resp: R`$\approx 0{,}882c$.`, sol: R`<p>Galileu daria $1{,}2c$. Repare: para quem está na Terra, a distância entre elas diminui a $1{,}2c$ (isso pode, não é velocidade de nenhum objeto).</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Um elétron ($mc^2 = 0{,}511$ MeV) viaja a $0{,}8c$. Calcule $E$, $K$ e $p$.</p>`, fig: "", dicas: [R`<p>$\gamma = \frac53$.</p>`, R`<p>$p = \gamma m v = \gamma\beta\,mc^2/c$.</p>`], resp: R`$E \approx 0{,}852$ MeV; $K \approx 0{,}341$ MeV; $p \approx 0{,}681$ MeV/$c$.`, sol: R`<p>Confira: $E^2 = 0{,}726$ e $(pc)^2 + (mc^2)^2 = 0{,}464 + 0{,}261 = 0{,}725$ ✓. A fórmula clássica daria $K = \frac12mv^2 = 0{,}164$ MeV: metade.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>O Sol emite $3{,}83\times10^{26}$ W. Quanta massa ele perde por segundo? E em 4,6 bilhões de anos (que fração da massa dele, $2\times10^{30}$ kg)?</p>`, fig: "", dicas: [R`<p>$\Delta m = E/c^2$.</p>`, R`<p>4,6 bilhões de anos $\approx 1{,}45\times10^{17}$ s.</p>`], resp: R`$\approx 4{,}3\times10^9$ kg/s; $\approx 6\times10^{26}$ kg no total, 0,03% da massa.`, sol: R`<p>$\frac{3{,}83\times10^{26}}{9\times10^{16}} = 4{,}3\times10^9$ kg/s. Vezes $1{,}45\times10^{17}$ s: $6{,}2\times10^{26}$ kg. Parece muito, mas é uma fração minúscula.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Uma galáxia se afasta a $0{,}6c$ e emite uma linha de 400 nm (violeta). Que comprimento de onda recebemos?</p>`, fig: "", dicas: [R`<p>A frequência cai pelo fator $\sqrt{\frac{1 - \beta}{1 + \beta}}$.</p>`, R`<p>O comprimento de onda cresce pelo fator inverso, 2.</p>`], resp: R`$800$ nm (infravermelho).`, sol: R`<p>$\sqrt{0{,}4/1{,}6} = 0{,}5$: a frequência cai pela metade, $\lambda$ dobra. É o "desvio para o vermelho" com que Hubble descobriu que o universo se expande.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-rel"); e.outerHTML = F.lab("O relógio de luz", "lab-rel"); SIM.relogio(document.getElementById("lab-rel"), F); },
});
