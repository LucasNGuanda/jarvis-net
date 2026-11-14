/* N06 · Couette, Poiseuille, Hagen–Poiseuille. Conferido em Python (água, μ = 1,0e-3 Pa·s):
   canal h = 2 mm, G = 10 Pa/m: u_máx = Gh²/8μ = 5 mm/s, média 3,33 mm/s, Q/b = Gh³/12μ = 6,67e-6 m²/s;
   cano R = 1 mm, G = 20 Pa/m: u_máx = GR²/4μ = 5 mm/s, Q = πGR⁴/8μ = 7,85e-9 m³/s, média 2,5 mm/s, τ_parede = GR/2 = 0,01 Pa;
   agulha (R = 0,15 mm, L = 2 cm, Q = 0,1 mL/s): Δp = 8μLQ/πR⁴ ≈ 1,0e4 Pa, v̄ = 1,41 m/s, Re ≈ 424 (laminar);
   artéria com raio 20% menor: Δp × 1/0,8⁴ = 2,44; Couette–Poiseuille com vazão zero: G = −6μU/h², u = 0 em y = 2h/3. */
F.registrar("N06", {
  retoma: ["N04", "N05", "CII08"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Escoamento num cano fino",
      casos: [
        { nome: "Vazão de Hagen–Poiseuille", gerar: (p) => {
          const L = [["água", 1.0e-3], ["óleo de motor", 0.1], ["glicerina", 1.4]], [nome, mu] = p ? L[0] : F.escolha(L);
          const Rmm = p ? 1 : F.escolha([0.5, 1, 2]), dp = p ? 200 : F.escolha([100, 200, 500]), Lc = p ? 1 : F.escolha([0.5, 1, 2]), Rm = Rmm / 1000, G = dp / Lc, Q = (Math.PI * G * Rm ** 4) / (8 * mu), vm = Q / (Math.PI * Rm * Rm);
          return { enun: R`<p>Um cano de raio ${F.n(Rmm)} mm e ${F.n(Lc)} m de comprimento leva ${nome} ($\mu = ${F.sigL(mu, 2)}$ Pa·s), com uma diferença de pressão de ${dp} Pa entre as pontas. Qual a vazão? Qual a velocidade no centro?</p>`, fig: "",
            passos: [R`<p>Gradiente: $G = \frac{\Delta p}{L} = ${F.n(G)}$ Pa/m.</p>`, R`<p>$Q = \frac{\pi GR^4}{8\mu} = \frac{\pi\cdot${F.n(G)}\cdot(${F.sigL(Rm, 2)})^4}{8\cdot${F.sigL(mu, 2)}} \approx ${F.sigL(Q, 3)}$ m³/s $= ${F.sigL(Q * 1e6, 3)}$ mL/s.</p>`, R`<p>Velocidade média $\bar v = Q/\pi R^2 \approx ${F.sigL(vm, 3)}$ m/s; no centro, o dobro: $${F.sigL(2 * vm, 3)}$ m/s.</p>`] };
        } },
        { nome: "Resistência hidráulica (Ohm dos canos)", gerar: (p) => {
          const r1 = p ? 1 : F.escolha([1, 2]), r2 = p ? 2 : F.escolha([1, 2, 3]), L1 = p ? 1 : F.escolha([1, 2]), L2 = p ? 1 : F.escolha([1, 2]);
          const R1 = L1 / r1 ** 4, R2 = L2 / r2 ** 4, ser = R1 + R2, par = (R1 * R2) / (R1 + R2);
          return { enun: R`<p>Dois canos, um de raio ${r1} mm e comprimento ${L1} m e outro de raio ${r2} mm e comprimento ${L2} m, levam o mesmo fluido. Com a mesma diferença de pressão total, quanto a vazão muda ao ligá-los em paralelo em vez de em série?</p>`, fig: "",
            passos: [R`<p>$\Delta p = R_hQ$, com $R_h = \frac{8\mu L}{\pi R^4}$: é a lei de Ohm (Δp ↔ tensão, Q ↔ corrente) ${F.ret("C08")}. Em unidades de $\frac{8\mu}{\pi}$ (mm⁻⁴·m): $R_1 = ${F.n(R1, 4)}$, $R_2 = ${F.n(R2, 4)}$.</p>`, R`<p>Série: $R_1 + R_2 = ${F.n(ser, 4)}$. Paralelo: $\frac{R_1R_2}{R_1 + R_2} = ${F.n(par, 4)}$.</p>`, R`<p>A vazão em paralelo é $\frac{${F.n(ser, 4)}}{${F.n(par, 4)}} \approx ${F.n(ser / par, 3)}$ vezes a vazão em série.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Hagen–Poiseuille a partir de Navier–Stokes",
      enun: R`<p>Água escoa num cano de raio $R$, estacionária, com $\vec v = u(r)\,\hat x$ e $-\frac{dp}{dx} = G$ constante. (a) Em coordenadas cilíndricas, $\nabla^2u = \frac1r\frac{d}{dr}\left(r\frac{du}{dr}\right)$. Escreva Navier–Stokes e resolva, usando não deslizamento na parede e $u$ finito no centro. (b) Calcule a vazão $Q$. (c) Faça a conta de outro jeito, sem a equação diferencial: equilíbrio de forças num cilindro de raio $r$ e comprimento $L$ (pressão nas tampas × atrito na lateral). (d) Uma artéria entope e o raio cai 20%. Por quanto o coração precisa multiplicar a diferença de pressão para manter a vazão?</p>`,
      fig: "",
      dicas: [R`<p>(a) $\frac1r(ru')' = -\frac G\mu$. Integre uma vez: $ru' = -\frac{G r^2}{2\mu} + C_1$; o centro exige $C_1 = 0$.</p>`, R`<p>(c) $G L\cdot\pi r^2 = \tau\cdot2\pi rL$, com $\tau = -\mu u'$.</p>`],
      sol: R`<p><b>(a)</b> Os termos de inércia somem ($u$ só depende de $r$ e aponta em $x$), então $0 = G + \mu\frac1r(ru')'$. Integrando: $u' = -\frac{Gr}{2\mu}$ (o $C_1/r$ explodiria no centro), e $u = \frac G{4\mu}(R^2 - r^2)$.</p>
        <p><b>(b)</b> $Q = \int_0^R u\,2\pi r\,dr = \frac{\pi G}{2\mu}\left(\frac{R^4}2 - \frac{R^4}4\right) = \frac{\pi GR^4}{8\mu}$. A velocidade média é $\frac{Q}{\pi R^2} = \frac{GR^2}{8\mu}$, metade da do centro.</p>
        <p><b>(c)</b> No cilindro de raio $r$: a diferença de pressão nas tampas empurra com $GL\pi r^2$ e a parede de fluido em volta segura com $\tau\cdot2\pi rL$. Então $\tau = \frac{Gr}2$; com $\tau = -\mu u'$, sai a mesma $u'$. Na parede: $\tau_p = \frac{GR}2$, que é o "atrito" que o fluido faz no cano.</p>
        <p><b>(d)</b> $Q$ fixo, $\Delta p \propto R^{-4}$: $\frac1{0{,}8^4} \approx 2{,}44$. Um entupimento de 20% no raio exige quase 2,5 vezes mais pressão. (O sangue não é exatamente newtoniano e a artéria é elástica, mas a lei de $R^4$ explica bem o perigo.)</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Fluidos · soluções exatas</div>
        <div class="q">Navier–Stokes é impossível de resolver?</div>
        <p>Em geral, sim: ninguém sabe a solução geral, e nem se ela sempre existe (${F.ret("N07")}). Mas em geometrias simples o termo não linear $(\vec v\cdot\nabla)\vec v$ some sozinho, a equação vira uma EDO e a solução sai em duas linhas. Essas soluções exatas são as mais usadas da engenharia: lubrificação, canos, seringas, vasos sanguíneos.</p></div>`),

      F.secao("ideia", "O truque: escoamento paralelo", R`
        <p>Se o fluido anda só na direção $x$ e a velocidade só depende de $y$ (ou de $r$), então $\vec v = (u(y), 0, 0)$ e:</p>
        <ul><li>a continuidade vale sozinha: $\partial_xu = 0$;</li>
          <li>o termo não linear some: $(\vec v\cdot\nabla)\vec v = u\,\partial_x\vec v = 0$;</li>
          <li>sobra uma EDO linear: $\mu\frac{d^2u}{dy^2} = \frac{dp}{dx} = -G$ (constante).</li></ul>
        ${F.formula(R`u(y) = \underbrace{U\frac yh}_{\text{Couette}} + \underbrace{\frac{G}{2\mu}\,y(h - y)}_{\text{Poiseuille}}`, "Entre placas: a de baixo parada, a de cima com velocidade U, separação h")}
        <p>Como a equação é linear, as soluções se <b>somam</b>: a placa arrastando (reta) e a pressão empurrando (parábola). No laboratório, brinque com $U$ e $G$, inclusive com sinais opostos.</p>
        <div id="lab-can"></div>`),

      F.secao("couette", "Couette: a placa que arrasta", R`
        <p>Sem gradiente de pressão ($G = 0$): $u = U\frac yh$, perfil reto, e a tensão é a mesma em todo lugar, $\tau = \mu\frac Uh$. É o viscosímetro e é a lubrificação: um mancal com óleo é, de perto, um Couette (o eixo arrasta o óleo contra a parede parada). Foi o caso usado para definir a viscosidade em ${F.ret("N04")}.</p>`),

      F.secao("poiseuille", "Poiseuille: a pressão que empurra", R`
        ${F.formula(R`\text{placas: } u_\text{máx} = \frac{Gh^2}{8\mu},\quad \bar u = \frac23u_\text{máx},\quad \frac Qb = \frac{Gh^3}{12\mu}\qquad\qquad \text{cano: } u = \frac{G}{4\mu}(R^2 - r^2),\quad \bar u = \frac12u_\text{máx},\quad Q = \frac{\pi GR^4}{8\mu}`, "Poiseuille plano e Hagen–Poiseuille")}
        <p>A vazão num cano vai com a <b>quarta potência</b> do raio (Hagen, 1839; Poiseuille, 1840, que era médico e estudava o sangue). Metade do raio: 16 vezes menos vazão. Escrevendo $\Delta p = R_hQ$, com $R_h = \frac{8\mu L}{\pi R^4}$, fica igual à lei de Ohm: canos em série e em paralelo se combinam como resistores.</p>
        ${F.caixa("pegadinha", R`<p><b>Cuidado:</b> tudo isso só vale para escoamento <b>laminar</b> (Re abaixo de uns 2000 no cano, ${F.ret("N07")}). Uma mangueira de jardim aberta já é turbulenta, e lá a queda de pressão cresce quase com $v^2$, não com $v$.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Truque de prova:</b> a tensão na parede do cano sai de um equilíbrio de forças, sem resolver nada: $\Delta p\,\pi R^2 = \tau_p\,2\pi RL \Rightarrow \tau_p = \frac{GR}{2}$. Isso vale até para escoamento turbulento (médio).</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>A partir de $\mu u'' = -G$ com $u(0) = 0$ e $u(h) = U$, deduza o perfil de Couette–Poiseuille.</p>`, fig: "", dicas: [R`<p>Integre duas vezes: $u = -\frac{G}{2\mu}y^2 + C_1y + C_2$.</p>`, R`<p>$u(0) = 0$ dá $C_2 = 0$.</p>`], resp: R`$u = U\frac yh + \frac G{2\mu}y(h - y)$.`, sol: R`<p>$u(h) = U$: $-\frac{G}{2\mu}h^2 + C_1h = U \Rightarrow C_1 = \frac Uh + \frac{Gh}{2\mu}$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Água ($\mu = 10^{-3}$ Pa·s) entre placas paradas separadas por 2 mm, com $G = 10$ Pa/m. Ache a velocidade máxima, a média e a vazão por metro de largura.</p>`, fig: "", dicas: [R`<p>$u_\text{máx} = \frac{Gh^2}{8\mu}$, no meio.</p>`, R`<p>Média: $\frac23$ da máxima. $Q/b = \bar u\,h$.</p>`], resp: R`5 mm/s; 3,33 mm/s; $6{,}7\times10^{-6}$ m²/s.`, sol: R`<p>$\frac{10\cdot(0{,}002)^2}{8\cdot10^{-3}} = 0{,}005$ m/s. Confira no laboratório com $U = 0$.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Mostre que, no cano, a velocidade média é metade da máxima, e no canal plano é $\frac23$.</p>`, fig: "", dicas: [R`<p>Cano: média ponderada pela área, $\frac1{\pi R^2}\int_0^R u\,2\pi r\,dr$.</p>`, R`<p>Canal: média simples em $y$ de uma parábola.</p>`], resp: R`Cano: $\frac{GR^2/8\mu}{GR^2/4\mu} = \frac12$. Canal: $\frac1h\int_0^h y(h - y)dy = \frac{h^2}6$ contra o máximo $\frac{h^2}4$: $\frac23$.`, sol: R`<p>No cano, os anéis de fora (lentos) têm mais área, por isso a média é menor.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Uma seringa empurra água ($\mu = 10^{-3}$ Pa·s) a 0,1 mL/s por uma agulha de raio interno 0,15 mm e 2 cm de comprimento. Qual a diferença de pressão necessária? O escoamento é laminar?</p>`, fig: "", dicas: [R`<p>$\Delta p = \frac{8\mu LQ}{\pi R^4}$.</p>`, R`<p>$\text{Re} = \frac{\rho\bar vD}\mu$, com $\bar v = Q/\pi R^2$.</p>`], resp: R`$\Delta p \approx 1{,}0\times10^4$ Pa (0,1 atm); $\bar v \approx 1{,}4$ m/s, Re $\approx 420$: laminar.`, sol: R`<p>Com uma agulha de metade do raio, seriam 16 vezes mais pressão (1,6 atm): por isso injeção com agulha fina dói e demora.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Mostre, só com equilíbrio de forças, que a tensão na parede de um cano é $\tau_p = \frac{R}{2}\frac{\Delta p}{L}$. Calcule para $R = 1$ mm e $G = 20$ Pa/m.</p>`, fig: "", dicas: [R`<p>Cilindro de fluido inteiro: força das tampas $\Delta p\,\pi R^2$.</p>`, R`<p>Força da parede: $\tau_p\cdot2\pi RL$.</p>`], resp: R`$\tau_p = \frac{GR}2 = 0{,}01$ Pa.`, sol: R`<p>Não precisou do perfil de velocidade. Confira no laboratório (modo cano).</p>` }),
        F.exercicio({ n: 6, enun: R`<p>Um cano de raio $R$ se divide em dois canos iguais, de mesmo comprimento. Que raio eles devem ter para que a resistência hidráulica total não mude?</p>`, fig: "", dicas: [R`<p>$R_h \propto R^{-4}$; dois iguais em paralelo: metade da resistência de um.</p>`, R`<p>$\frac12r^{-4} = R^{-4}$.</p>`], resp: R`$r = 2^{-1/4}R \approx 0{,}84R$.`, sol: R`<p>As ramificações de vasos sanguíneos seguem uma regra parecida (lei de Murray, com expoente 3 em vez de 4, porque minimiza outra coisa: o custo de bombear mais o de manter o sangue).</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>No Couette–Poiseuille, que gradiente de pressão $G$ faz a vazão total ser zero, com a placa de cima andando a $U$? Nesse caso, em que altura o fluido está parado?</p>`, fig: "", dicas: [R`<p>$\frac Qb = \frac{Uh}2 + \frac{Gh^3}{12\mu} = 0$.</p>`, R`<p>Substitua $G$ no perfil e fatore $y$.</p>`], resp: R`$G = -\frac{6\mu U}{h^2}$; $u = \frac{Uy}{h^2}(3y - 2h)$, parado em $y = \frac{2h}{3}$ (e na placa de baixo).`, sol: R`<p>Abaixo de $2h/3$ o fluido volta. É o que acontece num mancal fechado: o eixo arrasta o óleo, a pressão sobe na frente e empurra o óleo de volta por baixo. No laboratório: $U = 10$ mm/s, $h = 2$ mm dá $G = -15$ Pa/m.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-can"); e.outerHTML = F.lab("Perfis de velocidade entre placas e num cano", "lab-can"); SIM.canal(document.getElementById("lab-can"), F); },
});
