/* N01 · Euler × Lagrange e derivada material. Conferido em Python:
   escoamento de estagnação v = (kx, −ky), k = 2: aceleração em (1, 1) = (4, 4); bocal u = u₀(1 + x/L), u₀ = 1 m/s, L = 0,5 m: a(0) = 2 m/s²;
   advecção de temperatura (vento de 10 m/s, gradiente de 1 K por 100 km): ∂T/∂t = −0,36 K/h. */
F.registrar("N01", {
  retoma: ["U01", "matematica/CII05", "A05"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "A aceleração de quem é levado",
      casos: [
        { nome: "Ponto de estagnação", gerar: (p) => {
          const k = p ? 2 : F.escolha([1, 2, 3]), x = p ? 1 : F.escolha([1, 2, -1]), y = p ? 1 : F.escolha([1, 0.5, -2]);
          return { enun: R`<p>O escoamento $\vec v = (${F.c(k)}x,\ -${F.c(k)}y)$ (m/s, com $x, y$ em m) é estacionário. Qual a aceleração de uma partícula de fluido que está em $(${x}, ${y})$?</p>`, fig: "",
            passos: [R`<p>$\frac{\partial\vec v}{\partial t} = 0$ (estacionário). Sobra a parte convectiva: $(\vec v\cdot\nabla)\vec v = u\frac{\partial\vec v}{\partial x} + v\frac{\partial\vec v}{\partial y}$.</p>`,
              R`<p>$u = ${k * x}$, $v = ${-k * y}$; $\frac{\partial\vec v}{\partial x} = (${k}, 0)$ e $\frac{\partial\vec v}{\partial y} = (0, -${k})$.</p>`,
              R`<p>$\vec a = ${k * x}\cdot(${k}, 0) + (${-k * y})\cdot(0, -${k}) = (${k * k * x},\ ${k * k * y})$ m/s². Num escoamento que "não muda", a partícula acelera, porque se muda de lugar.</p>`] };
        } },
        { nome: "Bocal", gerar: (p) => {
          const u0 = p ? 1 : F.escolha([0.5, 1, 2]), L = p ? 0.5 : F.escolha([0.2, 0.5, 1]), x = p ? 0 : F.escolha([0, 0.1, 0.2]);
          const u = u0 * (1 + x / L), a = (u * u0) / L;
          return { enun: R`<p>Num bocal, a velocidade ao longo do eixo é $u(x) = ${F.n(u0)}\left(1 + ${L === 1 ? "x" : `\\frac{x}{${F.n(L)}}`}\right)$ m/s, sem variar com o tempo. Qual a aceleração de uma partícula em $x = ${F.n(x)}$ m?</p>`, fig: "",
            passos: [R`<p>Em 1D: $a = \frac{\partial u}{\partial t} + u\frac{\partial u}{\partial x} = 0 + u\frac{${F.n(u0)}}{${F.n(L)}}$.</p>`, R`<p>Em $x = ${F.n(x)}$: $u = ${F.n(u, 3)}$ m/s.</p>`, R`<p>$a = ${F.n(u, 3)}\cdot${F.n(u0 / L, 3)} = ${F.n(a, 3)}$ m/s². Um sensor parado em $x$ lê sempre o mesmo $u$; a gota que passa por ele está acelerando.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Euler e Lagrange dão a mesma aceleração",
      enun: R`<p>Escoamento $\vec v = (kx, -ky)$. (a) Descrição de Lagrange: resolva $\dot x = kx$, $\dot y = -ky$ para uma partícula que começa em $(x_0, y_0)$. Que curvas as partículas seguem? (b) Derive $x(t)$ e $y(t)$ duas vezes para achar a aceleração da partícula. (c) Agora pela descrição de Euler: calcule $\frac{D\vec v}{Dt} = \frac{\partial\vec v}{\partial t} + (\vec v\cdot\nabla)\vec v$ no ponto onde a partícula está. Os dois resultados batem? (d) A partícula chega ao ponto de estagnação $(0, 0)$?</p>`,
      fig: "",
      dicas: [R`<p>(a) EDOs separadas ${F.ret("matematica/CII08")}: exponenciais.</p>`, R`<p>(a) $xy = x_0y_0e^{kt}e^{-kt}$.</p>`],
      sol: R`<p><b>(a)</b> $x = x_0e^{kt}$, $y = y_0e^{-kt}$. Como $xy = x_0y_0$ é constante, as partículas andam sobre <b>hipérboles</b> (é o escoamento de um jato batendo numa parede, perto do ponto onde ele bate).</p>
        <p><b>(b)</b> $\ddot x = k^2x_0e^{kt} = k^2x$, $\ddot y = k^2y_0e^{-kt} = k^2y$. Aceleração: $(k^2x, k^2y)$.</p>
        <p><b>(c)</b> $\partial_t\vec v = 0$; $(\vec v\cdot\nabla)\vec v = kx\,(k, 0) + (-ky)(0, -k) = (k^2x, k^2y)$. ✓ A derivada material é exatamente a aceleração da partícula: é a "ponte" entre as duas descrições.</p>
        <p><b>(d)</b> Não: $y \to 0$ só quando $t \to \infty$. A partícula se aproxima do ponto de estagnação cada vez mais devagar (lá $\vec v = 0$) e é desviada pela direção $x$. O ponto de estagnação é onde a pressão é máxima: é onde fica o tubo de Pitot dos aviões (N03).</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Fluidos · descrição do movimento</div>
        <div class="q">Como descrever o movimento de trilhões de gotinhas?</div>
        <p>Na mecânica de uma bola, você segue a bola: $\vec r(t)$. Num rio, dá para fazer o mesmo (seguir cada gota, como uma rolha boiando: descrição de <b>Lagrange</b>) ou dá para ficar parado na ponte e anotar a velocidade da água que passa embaixo, em cada ponto e instante (descrição de <b>Euler</b>: um campo $\vec v(x, y, z, t)$). A segunda é a que quase sempre se usa, mas a física (Newton) vale para as partículas. A ponte entre as duas é a <b>derivada material</b>, o primeiro tijolo das equações de Navier–Stokes.</p></div>`),

      F.secao("descricoes", "As duas descrições", R`
        <table class="tb"><tr><th></th><th>Lagrange</th><th>Euler</th></tr>
          <tr><td>o que se segue</td><td>cada partícula, rotulada pela posição inicial $\vec r_0$</td><td>cada ponto fixo do espaço</td></tr>
          <tr><td>incógnita</td><td>$\vec r(\vec r_0, t)$</td><td>$\vec v(\vec r, t)$, $p(\vec r, t)$, $\rho(\vec r, t)$</td></tr>
          <tr><td>instrumento</td><td>boia com GPS, balão meteorológico</td><td>anemômetro fixo, estação do tempo</td></tr></table>
        <p>Três tipos de curva: <b>linhas de corrente</b> (tangentes a $\vec v$ num instante), <b>trajetórias</b> (o caminho de uma partícula) e <b>linhas de emissão</b> (a fumaça que sai de um ponto fixo). Num escoamento <b>estacionário</b> ($\partial\vec v/\partial t = 0$), as três coincidem; num não estacionário (uma bandeira tremulando), não.</p>
        <div id="lab-eul"></div>`),

      F.secao("material", "A derivada material", R`
        ${F.formula(R`\frac{D}{Dt} = \frac{\partial}{\partial t} + \vec v\cdot\nabla\qquad\qquad \vec a = \frac{D\vec v}{Dt} = \underbrace{\frac{\partial\vec v}{\partial t}}_{\text{local}} + \underbrace{(\vec v\cdot\nabla)\vec v}_{\text{convectiva}}`, "Derivada material (ou total, ou substancial)")}
        <p>De onde vem: uma grandeza $q(\vec r, t)$ vista por uma partícula que está em $\vec r(t)$ muda, pela regra da cadeia ${F.ret("matematica/CII05")}, com $\frac{dq}{dt} = \frac{\partial q}{\partial t} + \frac{\partial q}{\partial x}\dot x + \frac{\partial q}{\partial y}\dot y + \frac{\partial q}{\partial z}\dot z = \frac{\partial q}{\partial t} + \vec v\cdot\nabla q$. A parte <b>local</b> é quanto $q$ muda num ponto fixo; a <b>convectiva</b>, quanto muda porque a partícula foi para um lugar onde $q$ é diferente.</p>
        ${F.caixa("fisico", R`<p><b>Meteorologia</b>: se o ar não troca calor (cada pacote de ar mantém a temperatura, $DT/Dt = 0$), então num ponto fixo $\frac{\partial T}{\partial t} = -\vec v\cdot\nabla T$. Vento de 10 m/s vindo de uma região 1 K mais fria a cada 100 km: $\frac{\partial T}{\partial t} = -10\cdot10^{-5} = -10^{-4}$ K/s $\approx -0{,}36$ K/h. É a "advecção de ar frio" do jornal.</p>`)}
        ${F.caixa("pegadinha", R`<p><b>"Estacionário" não quer dizer "sem aceleração"</b>. Num bocal, o campo de velocidade não muda com o tempo, mas cada gota acelera ao entrar na parte estreita. E num escoamento uniforme que oscila no tempo, a aceleração é toda local. O termo $(\vec v\cdot\nabla)\vec v$ é <b>não linear</b> (velocidade vezes derivada da velocidade): é dele que vêm a turbulência e a dificuldade do Problema do Milênio (N07).</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Para $\vec v = (2x, -2y)$, qual a aceleração de uma partícula em $(1, 1)$? E num ponto fixo, $\partial\vec v/\partial t$?</p>`, fig: "", dicas: [R`<p>$\partial_t\vec v = 0$.</p>`, R`<p>$(\vec v\cdot\nabla)\vec v = (k^2x, k^2y)$.</p>`], resp: R`$\vec a = (4, 4)$ m/s²; $\partial\vec v/\partial t = 0$.`, sol: R`<p>No laboratório, escolha "ponto de estagnação": o sensor verde lê sempre o mesmo valor, enquanto a partícula acelera.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Num bocal, $u = u_0(1 + x/L)$ com $u_0 = 1$ m/s e $L = 0{,}5$ m. Qual a aceleração de uma gota em $x = 0$?</p>`, fig: "", dicas: [R`<p>$a = u\,\partial u/\partial x$.</p>`, R`<p>$\partial u/\partial x = u_0/L$.</p>`], resp: R`$2$ m/s².`, sol: R`<p>Repare que a aceleração cresce ao longo do bocal (cresce com $u$).</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Um rio tem velocidade uniforme que aumenta com o tempo: $u = 0{,}2t$ (m/s). Qual a aceleração de uma gota? Qual parte da derivada material é responsável?</p>`, fig: "", dicas: [R`<p>$u$ não depende de $x$: a parte convectiva some.</p>`, R`<p>$\partial u/\partial t = 0{,}2$.</p>`], resp: R`$0{,}2$ m/s², toda local.`, sol: R`<p>O caso oposto ao bocal: aqui tudo é "no tempo", nada "no espaço".</p>` }),
        F.exercicio({ n: 4, enun: R`<p>O ar está a 10 m/s soprando para o norte. A temperatura cai 1 K a cada 100 km para o sul (o ar do sul é mais frio). Se cada pacote de ar mantém a sua temperatura, como varia a temperatura num termômetro fixo?</p>`, fig: "", dicas: [R`<p>$DT/Dt = 0 \Rightarrow \partial_tT = -\vec v\cdot\nabla T$.</p>`, R`<p>$\partial T/\partial y = +10^{-5}$ K/m (esquenta para o norte).</p>`], resp: R`Cai $\approx 0{,}36$ K por hora.`, sol: R`<p>$-10\cdot10^{-5} = -10^{-4}$ K/s. O termômetro esfria sem nenhuma partícula de ar esfriar: o ar frio "chega".</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma bandeira tremula num vento oscilante. A fumaça de um cigarro, as trajetórias das partículas e as linhas de corrente coincidem?</p>`, fig: "", dicas: [R`<p>Elas coincidem quando o escoamento é estacionário.</p>`, R`<p>Aqui não é.</p>`], resp: R`Não: num escoamento não estacionário, as três curvas são diferentes.`, sol: R`<p>No laboratório, com "uniforme oscilando", as setas (linhas de corrente) mudam de direção, mas a trajetória da partícula faz zigue-zague.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Mostre que, numa rotação rígida $\vec v = (-\omega y, \omega x)$, a derivada material dá a aceleração centrípeta $-\omega^2\vec r$.</p>`, fig: "", dicas: [R`<p>$u\,\partial_x\vec v + v\,\partial_y\vec v$, com $\partial_x\vec v = (0, \omega)$ e $\partial_y\vec v = (-\omega, 0)$.</p>`, R`<p>$u = -\omega y$, $v = \omega x$.</p>`], resp: R`$\vec a = (-\omega^2x, -\omega^2y) = -\omega^2\vec r$.`, sol: R`<p>$-\omega y\cdot(0, \omega) + \omega x\cdot(-\omega, 0) = (-\omega^2x, -\omega^2y)$. O termo convectivo "sabe" fazer a força centrípeta, mesmo com o campo parado no tempo.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Mostre a identidade $(\vec v\cdot\nabla)\vec v = \nabla\left(\frac{v^2}{2}\right) - \vec v\times(\nabla\times\vec v)$ (verifique a componente $x$). Por que ela é útil?</p>`, fig: "", dicas: [R`<p>Componente $x$ de $\nabla(v^2/2)$: $u u_x + v v_x + w w_x$.</p>`, R`<p>Componente $x$ de $\vec v\times\vec\omega$: $v\omega_z - w\omega_y$, com $\omega_z = v_x - u_y$, $\omega_y = u_z - w_x$.</p>`], resp: R`$uu_x + vv_x + ww_x - v(v_x - u_y) + w(u_z - w_x) = uu_x + vu_y + wu_z$. ✓`, sol: R`<p>Com ela, num escoamento sem rotação ($\nabla\times\vec v = 0$), a aceleração convectiva vira um gradiente, e a equação de Euler se integra direto: sai a equação de Bernoulli (N03) ${F.ret("U01")}.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-eul"); e.outerHTML = F.lab("Seguir a partícula ou ficar parado?", "lab-eul"); SIM.euleriano(document.getElementById("lab-eul"), F); },
});
