/* N05 · Dedução de Navier–Stokes. Conferido em Python:
   1º problema de Stokes, u = U·erfc(y/2√(νt)): u = 1% de U em y = 3,64√(νt) (erfcinv(0,01) = 1,821);
   água (ν = 1,0e-6 m²/s): √(νt) = 1 mm em 1 s, 7,7 mm em 1 min (camada de 1%: 3,6 mm e 28 mm); mel (ν ≈ 7e-3): 30 cm em 1 s;
   meia velocidade a 1 cm da placa na água: erfc(η) = 0,5 em η = 0,4769 → t = (0,01/(2·0,4769))²/1e-6 ≈ 110 s. */
F.registrar("N05", {
  retoma: ["N02", "N03", "N04", "U01"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Quem manda: inércia ou viscosidade?",
      casos: [
        { nome: "Comparar os termos", gerar: (p) => {
          const L = [["uma bactéria nadando na água", 3e-5, 2e-6, 1.0e-6], ["mel escorrendo da colher", 0.01, 0.01, 7e-3], ["água saindo da torneira", 1, 0.01, 1.0e-6], ["um carro na estrada (ar)", 30, 4, 1.5e-5]];
          const [nome, U, Lc, nu] = p ? L[2] : F.escolha(L), Re = (U * Lc) / nu;
          return { enun: R`<p>Para ${nome} (velocidade típica $U \approx ${F.sigL(U, 2)}$ m/s, tamanho $L \approx ${F.sigL(Lc, 2)}$ m, $\nu \approx ${F.sigL(nu, 2)}$ m²/s): qual termo de Navier–Stokes domina, o inercial $\rho(\vec v\cdot\nabla)\vec v$ ou o viscoso $\mu\nabla^2\vec v$?</p>`, fig: "",
            passos: [R`<p>Ordem de grandeza: $(\vec v\cdot\nabla)\vec v \sim \frac{U^2}{L}$ e $\nu\nabla^2\vec v \sim \frac{\nu U}{L^2}$.</p>`, R`<p>A razão é $\frac{U^2/L}{\nu U/L^2} = \frac{UL}{\nu} = \text{Re}$, o número de Reynolds (N07): aqui $\text{Re} \approx ${Re >= 1e4 || Re < 0.01 ? F.sigL(Re, 2) : F.n(Re, 3)}$.</p>`, Re < 1 ? R`<p>Re ≪ 1: a <b>viscosidade</b> domina. A inércia não importa: se a força parar, o movimento para na hora.</p>` : R`<p>Re ≫ 1: a <b>inércia</b> domina longe das paredes; a viscosidade só importa numa camada fina perto delas (camada-limite).</p>`] };
        } },
        { nome: "Até onde o arrasto chegou", gerar: (p) => {
          const L = [["água", 1.0e-6], ["óleo de motor", 1.1e-4], ["mel", 7e-3]], [nome, nu] = p ? L[0] : F.escolha(L), t = p ? 60 : F.escolha([1, 10, 60]);
          return { enun: R`<p>Uma placa no fundo de um tanque de ${nome} ($\nu \approx ${F.sigL(nu, 2)}$ m²/s) começa a andar de repente. Depois de ${t} s, até que altura o fluido já foi arrastado (velocidade acima de 1% da placa)?</p>`, fig: "",
            passos: [R`<p>O termo viscoso difunde momento: a espessura cresce como $\sqrt{\nu t}$. A solução exata (chefão) dá 1% em $y \approx 3{,}64\sqrt{\nu t}$.</p>`, R`<p>$\sqrt{\nu t} = \sqrt{${F.sigL(nu, 2)}\cdot${t}} \approx ${F.sigL(Math.sqrt(nu * t), 3)}$ m.</p>`, R`<p>Altura arrastada: $\approx ${F.sigL(3.64 * Math.sqrt(nu * t), 3)}$ m. Para dobrar a altura, é preciso esperar 4 vezes mais.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A placa que começa a andar (1º problema de Stokes)",
      enun: R`<p>Um fluido ocupa $y > 0$, parado. Em $t = 0$ a placa em $y = 0$ passa a andar com velocidade $U$ na direção $x$. (a) Mostre que Navier–Stokes, com $\vec v = (u(y, t), 0, 0)$ e sem gradiente de pressão, se reduz a $\frac{\partial u}{\partial t} = \nu\frac{\partial^2u}{\partial y^2}$. (b) Procure soluções da forma $u = U f(\eta)$, $\eta = \frac{y}{2\sqrt{\nu t}}$, e mostre que $f'' + 2\eta f' = 0$. (c) Resolva com $f(0) = 1$ e $f(\infty) = 0$. (d) Na água ($\nu = 10^{-6}$ m²/s), quanto tempo até o fluido a 1 cm da placa chegar a metade de $U$? (Use $\text{erfc}(0{,}477) \approx 0{,}5$.)</p>`,
      fig: "",
      dicas: [R`<p>(a) Veja quais termos sobram: $(\vec v\cdot\nabla)\vec v = u\,\partial_x\vec v = 0$.</p>`, R`<p>(b) $\partial_t\eta = -\frac{\eta}{2t}$ e $\partial_y\eta = \frac1{2\sqrt{\nu t}}$. (c) Com $g = f'$: $g' = -2\eta g$.</p>`],
      sol: R`<p><b>(a)</b> $u$ não depende de $x$, então $(\vec v\cdot\nabla)\vec v = u\frac{\partial\vec v}{\partial x} = 0$ e a continuidade vale sozinha. Sem $\nabla p$, a componente $x$ fica $\rho\partial_tu = \mu\partial_y^2u$.</p>
        <p><b>(b)</b> $\partial_tu = Uf'\cdot\left(-\frac\eta{2t}\right)$ e $\partial_y^2u = Uf''\cdot\frac1{4\nu t}$. Igualando e multiplicando por $4t/U$: $-2\eta f' = f''$.</p>
        <p><b>(c)</b> $g = f'$: $g = Ce^{-\eta^2}$, então $f = 1 - C\int_0^\eta e^{-s^2}ds$. Com $f(\infty) = 0$: $C\frac{\sqrt\pi}2 = 1$. Logo $f = 1 - \text{erf}(\eta) = \text{erfc}(\eta)$, e $u = U\,\text{erfc}\left(\frac{y}{2\sqrt{\nu t}}\right)$ (a curva laranja do laboratório).</p>
        <p><b>(d)</b> $\frac{0{,}01}{2\sqrt{10^{-6}t}} = 0{,}477 \Rightarrow t = \left(\frac{0{,}01}{0{,}954}\right)^2\cdot10^6 \approx 110$ s. Quase dois minutos para 1 cm: a viscosidade da água é lenta. É a mesma conta do calor se espalhando numa barra ${F.ret("T02")}: a equação é a mesma.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Fluidos · a equação</div>
        <div class="q">Dá para escrever F = ma para um fluido?</div>
        <p>Dá, e é isso que Navier–Stokes é. Já temos todas as peças: a <b>derivada material</b> (a aceleração de um pedacinho de fluido, ${F.ret("N01")}), a <b>continuidade</b> (massa conservada, ${F.ret("N02")}), a <b>pressão</b> (Euler, ${F.ret("N03")}) e a <b>viscosidade</b> no tensor de tensões (${F.ret("N04")}). Agora é só montar.</p></div>`),

      F.secao("cauchy", "Passo 1: F = ma num pedacinho de fluido", R`
        <p>Pegue um volume pequeno $dV$ que anda com o fluido. Massa: $\rho\,dV$. Aceleração: a derivada material $\frac{D\vec v}{Dt} = \frac{\partial\vec v}{\partial t} + (\vec v\cdot\nabla)\vec v$. Forças: o peso $\rho\vec g\,dV$ e as forças de contato nas faces, que vêm do tensor $\sigma$.</p>
        <p>A força de contato total numa região é $\oint\sigma\hat n\,dA$, e pelo teorema da divergência ${F.ret("matematica/TE02")} isso é $\int\nabla\cdot\sigma\,dV$. Então, por unidade de volume:</p>
        ${F.formula(R`\rho\frac{D\vec v}{Dt} = \nabla\cdot\sigma + \rho\vec g,\qquad (\nabla\cdot\sigma)_i = \sum_j\frac{\partial\sigma_{ij}}{\partial x_j}`, "Equação de Cauchy (vale para qualquer meio contínuo)")}
        <p>Até aqui não falamos nada sobre o material: isso vale para água, mel, aço ou geleia. O que diferencia um do outro é <b>como</b> $\sigma$ depende do movimento.</p>`),

      F.secao("ns", "Passo 2: pôr a viscosidade e chegar em Navier–Stokes", R`
        <p>Para um fluido newtoniano incompressível, ${F.ret("N04")} deu $\sigma = -pI + \mu\left(\nabla\vec v + (\nabla\vec v)^T\right)$. Calculando a divergência, componente $i$:</p>
        ${F.formula(R`(\nabla\cdot\sigma)_i = -\frac{\partial p}{\partial x_i} + \mu\sum_j\left(\frac{\partial^2v_i}{\partial x_j^2} + \frac{\partial}{\partial x_i}\frac{\partial v_j}{\partial x_j}\right) = -\frac{\partial p}{\partial x_i} + \mu\nabla^2v_i`, "o segundo termo some porque ∇·v = 0")}
        ${F.formula(R`\rho\left(\frac{\partial\vec v}{\partial t} + (\vec v\cdot\nabla)\vec v\right) = -\nabla p + \mu\nabla^2\vec v + \rho\vec g,\qquad \nabla\cdot\vec v = 0`, "Equações de Navier–Stokes (incompressível)")}
        <p>Leia termo a termo, em newtons por metro cúbico:</p>
        <table class="tb"><tr><th>termo</th><th>o que é</th></tr>
          <tr><td>$\rho\,\partial_t\vec v$</td><td>a velocidade num ponto fixo mudando com o tempo</td></tr>
          <tr><td>$\rho(\vec v\cdot\nabla)\vec v$</td><td>aceleração por ir para um lugar onde a velocidade é outra (é <b>não linear</b>: $\vec v$ vezes derivada de $\vec v$; é daí que vem a turbulência)</td></tr>
          <tr><td>$-\nabla p$</td><td>a pressão empurra do alto para o baixo</td></tr>
          <tr><td>$\mu\nabla^2\vec v$</td><td>viscosidade: puxa a velocidade de cada ponto para a média dos vizinhos (difusão de momento)</td></tr>
          <tr><td>$\rho\vec g$</td><td>peso</td></tr></table>
        <p>São 4 equações (3 componentes + continuidade) para 4 incógnitas ($u, v, w, p$). A pressão não tem equação "própria": ela é o que precisa ser, em cada instante, para manter $\nabla\cdot\vec v = 0$.</p>
        ${F.caixa("ponte", R`<p><b>Casos que você já conhece:</b> com $\vec v = 0$, sobra $\nabla p = \rho\vec g$: a hidrostática, $p = p_0 + \rho gh$. Com $\mu = 0$, sobra a equação de Euler ${F.ret("N03")}, e dela sai Bernoulli. Navier–Stokes contém as duas.</p>`)}
        ${F.caixa("fisico", R`<p><b>Por que "difusão"?</b> $\nabla^2v$ num ponto é proporcional a (média dos vizinhos − valor no ponto). Se uma camada anda mais rápido que as vizinhas, a viscosidade a freia e acelera as outras: o momento se espalha. Com $\nu = \mu/\rho$, a parte viscosa fica $\partial_t\vec v = \nu\nabla^2\vec v$: a equação do calor, com $\nu$ no papel da difusividade. No laboratório, veja o movimento "se espalhar" a partir de uma placa.</p>`)}
        <div id="lab-sto"></div>`),

      F.secao("contorno", "Condições de contorno", R`
        <p>Uma EDP precisa de condições nas bordas. A de Navier–Stokes é a <b>condição de não deslizamento</b>: na parede, o fluido tem a velocidade da parede (parada, ele para). Parece estranho, mas é o que se observa: o pó fica grudado na pá do ventilador mesmo com ela girando rápido.</p>
        <p>Com $\mu = 0$ (Euler) não dá para impor isso: a equação perde as derivadas segundas e só aceita "não atravessar a parede". É por isso que o limite $\mu \to 0$ é traiçoeiro: perto da parede sempre sobra uma camada fina (a <b>camada-limite</b>, Prandtl, 1904), onde a viscosidade importa, por menor que seja.</p>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Mostre que todos os termos de Navier–Stokes têm unidade de N/m³.</p>`, fig: "", dicas: [R`<p>$\rho\,\partial_t v$: (kg/m³)(m/s²).</p>`, R`<p>$\mu\nabla^2v$: (Pa·s)(m/s)/m².</p>`], resp: R`Todos dão kg/(m²·s²) $=$ N/m³.`, sol: R`<p>$\nabla p$: Pa/m $=$ N/m³. $\mu\nabla^2v$: Pa·s·(1/(m·s)) $=$ Pa/m. Força por volume, como deve ser numa "$F = ma$ por metro cúbico".</p>` }),
        F.exercicio({ n: 2, marcas: ["∫"], enun: R`<p>Mostre que $\nabla\cdot\left[\mu(\nabla\vec v + (\nabla\vec v)^T)\right] = \mu\nabla^2\vec v + \mu\nabla(\nabla\cdot\vec v)$ (com $\mu$ constante). O que acontece no caso incompressível?</p>`, fig: "", dicas: [R`<p>Componente $i$: $\sum_j\partial_j(\partial_jv_i + \partial_iv_j)$.</p>`, R`<p>As derivadas comutam: $\partial_j\partial_iv_j = \partial_i(\partial_jv_j)$.</p>`], resp: R`O segundo termo é $\mu\partial_i(\nabla\cdot\vec v)$, que é zero se $\nabla\cdot\vec v = 0$.`, sol: R`<p>Num fluido compressível (som, ondas de choque) esse termo fica, e aparece também uma "viscosidade volumétrica".</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Num tanque de água parado, use Navier–Stokes para achar a pressão a 3 m de profundidade (com $p_0 = 10^5$ Pa e $g = 10$ m/s²).</p>`, fig: "", dicas: [R`<p>$\vec v = 0$: o lado esquerdo e o termo viscoso somem.</p>`, R`<p>$\nabla p = \rho\vec g$, com $\vec g$ para baixo.</p>`], resp: R`$p = p_0 + \rho gh = 1{,}3\times10^5$ Pa.`, sol: R`<p>A hidrostática é o caso mais simples de Navier–Stokes.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Um escoamento estacionário entre placas tem $\vec v = (u(y), 0, 0)$, com $u = ay^2 + by + c$. Que gradiente de pressão $\partial p/\partial x$ é preciso para mantê-lo?</p>`, fig: "", dicas: [R`<p>$(\vec v\cdot\nabla)\vec v = u\,\partial_x\vec v = 0$ e $\partial_t = 0$.</p>`, R`<p>Sobra $0 = -\partial_xp + \mu u''$.</p>`], resp: R`$\frac{\partial p}{\partial x} = 2\mu a$.`, sol: R`<p>Perfil parabólico ↔ gradiente de pressão constante. Isso é o escoamento de Poiseuille ${F.ret("N06")}; com $a < 0$ (a parábola que "aponta para frente"), a pressão cai no sentido do escoamento.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Na água ($\nu = 10^{-6}$ m²/s), até onde o movimento de uma placa que partiu de repente chegou (1% da velocidade) depois de 1 s? E de 1 min?</p>`, fig: "", dicas: [R`<p>Altura $\approx 3{,}64\sqrt{\nu t}$.</p>`, R`<p>$\sqrt{60} \approx 7{,}7$.</p>`], resp: R`$\approx 3{,}6$ mm em 1 s; $\approx 2{,}8$ cm em 1 min.`, sol: R`<p>60 vezes mais tempo, só $\sqrt{60} \approx 7{,}7$ vezes mais longe: assinatura da difusão. Confira no laboratório.</p>` }),
        F.exercicio({ n: 6, enun: R`<p>Por que a equação de Euler ($\mu = 0$) não consegue impor que o fluido tenha velocidade zero numa parede parada? Que fenômeno resolve isso para fluidos de viscosidade muito pequena?</p>`, fig: "", dicas: [R`<p>Conte as derivadas: com $\mu = 0$, a maior derivada espacial é de 1ª ordem.</p>`, R`<p>Uma equação de ordem menor aceita menos condições de contorno.</p>`], resp: R`Sem o termo $\nabla^2\vec v$, só cabe a condição "não atravessar a parede". A camada-limite de Prandtl resolve.`, sol: R`<p>Na camada-limite a velocidade sobe de 0 até o valor de "Euler" numa espessura que diminui com $\text{Re}$ (como $L/\sqrt{\text{Re}}$). É lá que nasce o arrasto e, às vezes, a separação do escoamento (o vácuo atrás de um carro).</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Tome o rotacional de Navier–Stokes (com $\vec g$ constante) e mostre que a vorticidade $\vec\omega = \nabla\times\vec v$ obedece a $\frac{D\vec\omega}{Dt} = (\vec\omega\cdot\nabla)\vec v + \nu\nabla^2\vec\omega$. Use a identidade $(\vec v\cdot\nabla)\vec v = \nabla\frac{v^2}2 - \vec v\times\vec\omega$.</p>`, fig: "", dicas: [R`<p>O rotacional de um gradiente é zero ${F.ret("U01")}: $p$ e $v^2/2$ somem.</p>`, R`<p>$\nabla\times(\vec v\times\vec\omega) = (\vec\omega\cdot\nabla)\vec v - (\vec v\cdot\nabla)\vec\omega$ quando $\nabla\cdot\vec v = 0$ e $\nabla\cdot\vec\omega = 0$.</p>`], resp: R`$\partial_t\vec\omega + (\vec v\cdot\nabla)\vec\omega = (\vec\omega\cdot\nabla)\vec v + \nu\nabla^2\vec\omega$.`, sol: R`<p>O termo $(\vec\omega\cdot\nabla)\vec v$ é o <b>esticamento de vórtices</b>: um tubo de vórtice esticado gira mais rápido (como a patinadora fechando os braços). Em 2D ele é zero ($\vec\omega$ é perpendicular ao plano e $\vec v$ não varia nessa direção). Essa diferença é o coração do Problema do Milênio ${F.ret("N07")}.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-sto"); e.outerHTML = F.lab("O movimento se espalhando a partir de uma placa", "lab-sto"); SIM.stokes1(document.getElementById("lab-sto"), F); },
});
