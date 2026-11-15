/* N03 · Equação de Euler e Bernoulli. Conferido em Python:
   Torricelli a 0,8 m: 3,96 m/s; tanque de 1 m: alcance máximo 1 m com o furo no meio; Venturi A₁/A₂ = 2, v₁ = 1 m/s: Δp = 1500 Pa, Δh = 15,3 cm;
   Pitot com Δp = 500 Pa no ar (1,2 kg/m³): 28,9 m/s; tanque de 1 m com A/a = 100: esvazia em 45,2 s; metade da altura em 29,3% desse tempo. */
F.registrar("N03", {
  retoma: ["N01", "N02", "A18"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Bernoulli nos números",
      casos: [
        { nome: "Torricelli", gerar: (p) => {
          const H = p ? 1 : F.escolha([1, 1.5, 2]), y = p ? 0.2 : F.escolha([0.2, 0.3, 0.5]), g = 9.81, v = Math.sqrt(2 * g * (H - y)), x = 2 * Math.sqrt((H - y) * y);
          return { enun: R`<p>Um tanque aberto está cheio até ${F.n(H)} m de altura. Um furo pequeno na parede, a ${F.n(y)} m do chão, solta um jato horizontal. Com que velocidade sai e onde cai?</p>`, fig: "",
            passos: [R`<p>Bernoulli da superfície (parada, $p_\text{atm}$) até o jato ($p_\text{atm}$): $\rho g H = \frac12\rho v^2 + \rho gy \Rightarrow v = \sqrt{2g(H - y)} \approx ${F.n(v, 3)}$ m/s.</p>`, R`<p>Queda de ${F.n(y)} m: $t = \sqrt{2y/g}$; alcance $x = vt = 2\sqrt{(H - y)y} \approx ${F.n(x, 3)}$ m.</p>`, R`<p>O alcance é máximo com o furo no meio ($y = H/2$): $x = H$. Furos a $y$ e a $H - y$ dão o <b>mesmo</b> alcance.</p>`] };
        } },
        { nome: "Tubo de Pitot", gerar: (p) => {
          const dp = p ? 500 : F.escolha([200, 500, 1000, 5000]), rho = 1.2, v = Math.sqrt((2 * dp) / rho);
          return { enun: R`<p>Um tubo de Pitot num avião mede uma diferença entre a pressão no bico (ar parado ali) e a pressão estática de ${dp} Pa. Qual a velocidade do avião em relação ao ar (ρ = 1,2 kg/m³)?</p>`, fig: "",
            passos: [R`<p>No bico, o ar para (ponto de estagnação ${F.ret("N01")}): $p_0 = p + \frac12\rho v^2$.</p>`, R`<p>$v = \sqrt{\frac{2\Delta p}{\rho}} = \sqrt{\frac{2\cdot${dp}}{1{,}2}}$.</p>`, R`<p>$v \approx ${F.n(v, 1)}$ m/s $\approx ${F.n(v * 3.6, 0)}$ km/h. Se o tubo entupir de gelo, o piloto perde a velocidade: foi a causa do acidente do voo AF447 (2009).</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Quanto tempo o tanque leva para esvaziar",
      enun: R`<p>Um tanque cilíndrico de seção $A$, com água até a altura $H$, tem um furo de área $a \ll A$ no fundo. (a) Use Torricelli e a continuidade para escrever $\frac{dh}{dt}$. (b) Resolva a EDO e ache o tempo para esvaziar. (c) Que fração desse tempo leva para a altura cair até a metade? (d) Números: $H = 1$ m e $A/a = 100$. (e) Por que uma clepsidra (relógio de água) precisa de um formato especial do recipiente para o nível descer com velocidade constante?</p>`,
      fig: "",
      dicas: [R`<p>(a) $A\,\frac{dh}{dt} = -a\sqrt{2gh}$.</p>`, R`<p>(b) Separe: $\frac{dh}{\sqrt h} = -\frac aA\sqrt{2g}\,dt$ ${F.ret("matematica/CII08")}.</p>`],
      sol: R`<p><b>(a)</b> A água que sai pelo furo ($a\cdot\sqrt{2gh}$ por segundo) é a que some do tanque: $\frac{dh}{dt} = -\frac aA\sqrt{2gh}$.</p>
        <p><b>(b)</b> $2(\sqrt H - \sqrt h) = \frac aA\sqrt{2g}\,t$. Vazio ($h = 0$): $t_\text{total} = \frac Aa\sqrt{\frac{2H}{g}}$.</p>
        <p><b>(c)</b> $h = H/2$: $t = \frac Aa\sqrt{\frac 2g}\left(\sqrt H - \sqrt{H/2}\right) = t_\text{total}\left(1 - \frac{1}{\sqrt2}\right) \approx 0{,}29\,t_\text{total}$. A primeira metade da altura sai em 29% do tempo; a segunda leva 71%, porque o jato vai ficando fraco.</p>
        <p><b>(d)</b> $t_\text{total} = 100\sqrt{2/9{,}81} \approx 45{,}2$ s. Confira no laboratório (furo no fundo, razão 100).</p>
        <p><b>(e)</b> Para $dh/dt$ constante com $a\sqrt{2gh}$ saindo, a área tem de crescer como $\sqrt h$: $A(h) \propto \sqrt h$, ou seja, raio $\propto h^{1/4}$. As clepsidras egípcias tinham as paredes curvas por isso.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Fluidos · Euler e Bernoulli</div>
        <div class="q">Onde o fluido corre mais rápido, a pressão é maior ou menor?</div>
        <p>Menor. Parece contraintuitivo, mas pense na partícula de fluido: para ela <b>acelerar</b> entrando num estreitamento, alguém tem de empurrá-la por trás mais forte do que pela frente. Então a pressão atrás (onde é lento) é maior que na frente (onde é rápido). Isso é a equação de Euler, que é a 2ª lei de Newton para fluidos; integrada ao longo de uma linha de corrente, dá Bernoulli.</p></div>`),

      F.secao("euler", "A equação de Euler", R`
        ${F.formula(R`\rho\frac{D\vec v}{Dt} = \rho\left(\frac{\partial\vec v}{\partial t} + (\vec v\cdot\nabla)\vec v\right) = -\nabla p + \rho\vec g`, "Equação de Euler (fluido sem viscosidade)")}
        <p>Massa × aceleração de um pedacinho (com a derivada material ${F.ret("N01")}) = forças. Num fluido ideal, as forças de contato são só de pressão, e a força líquida da pressão num pedacinho é $-\nabla p$ por volume (a pressão empurra de onde é alta para onde é baixa). Com a continuidade ${F.ret("N02")}, são as equações de um fluido ideal. Navier–Stokes acrescenta a viscosidade (N04, N05).</p>
        ${F.formula(R`p + \tfrac12\rho v^2 + \rho gz = \text{constante ao longo de uma linha de corrente}`, "Equação de Bernoulli")}
        ${F.demo("Bernoulli a partir de Euler", R`<p>Hipóteses: estacionário, incompressível, sem viscosidade. Multiplique Euler escalarmente por $\vec v$: $\rho\,\vec v\cdot(\vec v\cdot\nabla)\vec v = -\vec v\cdot\nabla p - \rho g\,\vec v\cdot\nabla z$. Pela identidade do exercício 7 da N01, $\vec v\cdot(\vec v\cdot\nabla)\vec v = \vec v\cdot\nabla\frac{v^2}{2}$ (o termo $\vec v\times\vec\omega$ é perpendicular a $\vec v$). Então $\vec v\cdot\nabla\left(p + \frac12\rho v^2 + \rho gz\right) = 0$: a quantidade não muda andando ao longo de $\vec v$. Se o escoamento também não tem rotação, ela é constante em todo lugar.</p>`)}
        <p>Em palavras: é a conservação de energia por volume. $\frac12\rho v^2$ é a energia cinética, $\rho gz$ a potencial, e $p$ é o "trabalho da pressão".</p>`),

      F.secao("aplicacoes", "Torricelli, Venturi, Pitot", R`
        <div id="lab-ber"></div>
        <ul><li><b>Torricelli</b>: o jato sai de um furo a $h$ abaixo da superfície com $v = \sqrt{2gh}$, como se tivesse caído em queda livre.</li>
          <li><b>Venturi</b>: no estreitamento, $v$ cresce e $p$ cai: $p_1 - p_2 = \frac12\rho(v_2^2 - v_1^2)$. Medindo $\Delta p$ (com dois tubinhos), mede-se a vazão.</li>
          <li><b>Pitot</b>: um tubo virado para o vento fica com o ar parado na boca (estagnação): $p_0 - p = \frac12\rho v^2$. É o velocímetro dos aviões.</li></ul>
        ${F.caixa("pegadinha", R`<p><b>"A asa sustenta porque o ar de cima precisa chegar junto com o de baixo"</b>: falso. Não existe nenhuma regra de "tempo igual"; na verdade, o ar de cima chega <b>antes</b>. A explicação certa: a asa (inclinada e curvada) desvia o ar para baixo (3ª lei de Newton), e a diferença de pressão entre cima e baixo, ligada às diferenças de velocidade por Bernoulli, é o mesmo fenômeno visto de outro jeito. E Bernoulli não vale entre linhas de corrente diferentes se o escoamento tem rotação.</p>`)}
        ${F.caixa("pegadinha", R`<p><b>Bernoulli tem hipóteses</b>: estacionário, incompressível (no ar, só até ~100 m/s), sem viscosidade, ao longo de uma linha de corrente. Num cano longo e fino, a viscosidade come pressão mesmo com velocidade constante (Poiseuille, N06): aí Bernoulli sozinho erra.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Com que velocidade a água sai de um furo 0,8 m abaixo da superfície de um tanque aberto?</p>`, fig: "", dicas: [R`<p>$v = \sqrt{2gh}$.</p>`, R`<p>$h = 0{,}8$ m.</p>`], resp: R`$\approx 3{,}96$ m/s.`, sol: R`<p>A mesma velocidade de uma pedra que cai 80 cm.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Num tanque de 1 m de altura cheio, a que altura deve ficar o furo para o jato ir mais longe? Qual o alcance?</p>`, fig: "", dicas: [R`<p>$x = 2\sqrt{(H - y)y}$.</p>`, R`<p>Máximo de $(H - y)y$: $y = H/2$.</p>`], resp: R`No meio (0,5 m); alcance de 1 m.`, sol: R`<p>No laboratório, mexa na altura do furo e veja o alcance subir e descer.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Num tubo de Venturi com área larga 2 vezes a estreita, a água entra a 1 m/s. Qual a diferença de pressão e a diferença de altura nos tubinhos?</p>`, fig: "", dicas: [R`<p>$v_2 = 2$ m/s; $\Delta p = \frac12\rho(v_2^2 - v_1^2)$.</p>`, R`<p>$\Delta h = \Delta p/(\rho g)$.</p>`], resp: R`$\Delta p = 1500$ Pa; $\Delta h \approx 15{,}3$ cm.`, sol: R`<p>Confira no laboratório, modo Venturi.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Um tubo de Pitot mede 500 Pa de diferença no ar ($\rho = 1{,}2$ kg/m³). Qual a velocidade?</p>`, fig: "", dicas: [R`<p>$\Delta p = \frac12\rho v^2$.</p>`, R`<p>$v = \sqrt{2\Delta p/\rho}$.</p>`], resp: R`$\approx 28{,}9$ m/s (104 km/h).`, sol: R`<p>Um avião de linha em cruzeiro tem $\Delta p$ de ~20 kPa (no ar rarefeito da altitude, a conta precisa da densidade de lá).</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Por que, quando um caminhão passa rápido perto de uma bicicleta na estrada, a bicicleta é "puxada" para o caminhão?</p>`, fig: "", dicas: [R`<p>Entre os dois, o ar é arrastado e acelera.</p>`, R`<p>Onde o ar é mais rápido, a pressão é…</p>`], resp: R`O ar entre os dois corre mais rápido, a pressão cai, e a pressão maior do outro lado empurra a bicicleta para o caminhão.`, sol: R`<p>O mesmo vale para dois navios lado a lado, que tendem a se aproximar. Há regras de navegação por causa disso.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Use a equação de Euler para um fluido parado ($\vec v = 0$) e mostre a lei de Stevin. E num balde girando com velocidade angular $\omega$ (rotação rígida), mostre que a superfície é um paraboloide.</p>`, fig: "", dicas: [R`<p>Parado: $0 = -\nabla p + \rho\vec g$.</p>`, R`<p>Girando: a aceleração é $-\omega^2\vec r$ (N01, ex. 6). Então $\partial_rp = \rho\omega^2r$ e $\partial_zp = -\rho g$.</p>`], resp: R`Parado: $p = p_0 + \rho g\,\text{profundidade}$. Girando: $p = p_0 + \frac12\rho\omega^2r^2 - \rho gz$, e a superfície ($p = p_0$) é $z = \frac{\omega^2r^2}{2g}$.`, sol: R`<p>Telescópios de "espelho líquido" usam isso: mercúrio girando forma um paraboloide perfeito, que foca a luz.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Um tanque de 1 m de altura com seção 100 vezes maior que o furo do fundo: quanto tempo para esvaziar? E para a altura cair à metade?</p>`, fig: "", dicas: [R`<p>$t = \frac Aa\sqrt{2H/g}$ (chefão).</p>`, R`<p>Metade da altura: $(1 - 1/\sqrt2)$ desse tempo.</p>`], resp: R`$\approx 45{,}2$ s; $\approx 13{,}2$ s.`, sol: R`<p>No laboratório (furo baixo, razão 100), cronometre: a altura cai rápido no começo e devagar no fim.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-ber"); e.outerHTML = F.lab("Torricelli e Venturi", "lab-ber"); SIM.bernoulli(document.getElementById("lab-ber"), F); },
});
