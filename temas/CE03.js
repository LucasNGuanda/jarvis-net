/* CE03 · Integrais fechadas ∮ (curvas e superfícies). Números conferidos em Python (scratchpad ce.py):
   ∮(−y,x)·dr no círculo R=2 → 8π; elipse 3×2 → 6π; fluxo de 2 nC → 225,9 N·m²/C; espira r=10 cm com dB/dt=0,5 T/s → 15,7 mV e E=0,025 V/m;
   ∫dx/(1+x⁴) = π/√2 = 2,2214 (resíduos), ∫dx/(1+x²) = π. */
F.registrar("CE03", {
  retoma: ["U01", "U02"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Exemplos passo a passo",
      casos: [
        { nome: "Circulação de (ay, bx)", gerar: (p) => {
          const a = p ? -1 : F.escolha([-2, -1, 1, 3]), b = p ? 2 : F.escolha([-1, 1, 2, 4]), Rr = p ? 2 : F.escolha([1, 2, 3]), v = (b - a) * Math.PI * Rr * Rr;
          return { enun: R`<p>Calcule $\oint_C \vec F\cdot d\vec r$ para $\vec F = (${a}y,\ ${b}x)$, sendo $C$ o círculo de raio ${Rr} centrado na origem, no sentido anti-horário.</p>`, fig: "",
            passos: [
              R`<p><b>Pelo teorema de Green:</b> $P = ${a}y$ e $Q = ${b}x$, então $\dfrac{\partial Q}{\partial x} - \dfrac{\partial P}{\partial y} = ${b} - (${a}) = ${b - a}$ (constante).</p>`,
              R`<p>Integral dupla de uma constante = constante × área: $\oint = ${b - a}\cdot\pi\cdot${Rr}^2 = ${F.m(v, 4)}$.</p>`,
              R`<p><b>Conferindo direto:</b> $\vec r = (${Rr}\cos t, ${Rr}\sin t)$, $d\vec r = (-${Rr}\sin t, ${Rr}\cos t)\,dt$. Então $\vec F\cdot d\vec r = ${Rr * Rr}\left(${-a}\sin^2t + ${b}\cos^2t\right)dt$.</p>`,
              R`<p>Como $\int_0^{2\pi}\sin^2t\,dt = \int_0^{2\pi}\cos^2t\,dt = \pi$: $\oint = ${Rr * Rr}\,(${-a} + ${b})\,\pi = ${F.m(v, 4)}$ ✓. Green transformou uma conta com seno ao quadrado numa multiplicação.</p>`,
            ] };
        } },
        { nome: "Área de um triângulo por ∮", gerar: (p) => {
          const pts = p ? [[0, 0], [4, 1], [1, 3]] : (() => { let q; do { q = [0, 1, 2].map(() => [F.sorteio(-3, 5), F.sorteio(-3, 5)]); } while (Math.abs((q[1][0] - q[0][0]) * (q[2][1] - q[0][1]) - (q[2][0] - q[0][0]) * (q[1][1] - q[0][1])) < 3); return q; })();
          let s = 0; const termos = [];
          for (let i = 0; i < 3; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % 3]; s += x1 * y2 - x2 * y1; termos.push(`(${x1}\\cdot${y2} - ${x2}\\cdot${y1})`); }
          return { enun: R`<p>Ache a área do triângulo de vértices $A(${pts[0]})$, $B(${pts[1]})$, $C(${pts[2]})$ usando $\text{Área} = \frac12\oint(x\,dy - y\,dx)$.</p>`, fig: "",
            passos: [
              R`<p>Por Green, com $P = -y/2$ e $Q = x/2$: $\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} = \frac12 + \frac12 = 1$. Então $\frac12\oint(x\,dy - y\,dx) = \iint 1\,dA$ = área.</p>`,
              R`<p>Num segmento reto de $(x_1, y_1)$ a $(x_2, y_2)$, a integral $\int(x\,dy - y\,dx)$ vale exatamente $x_1y_2 - x_2y_1$ (parametrize e confira!).</p>`,
              R`<p>Somando os três lados ($A\to B\to C\to A$): $\frac12\left[${termos.join(" + ")}\right] = \frac12\cdot(${s})$.</p>`,
              R`<p>Área $= ${F.m(Math.abs(s) / 2, 1)}$. ${s < 0 ? "O sinal deu negativo porque os vértices estavam no sentido horário: a ∮ “lembra” o sentido. A área é o módulo." : "Sinal positivo: os vértices estavam no sentido anti-horário."} Essa é a famosa <b>fórmula do cadarço</b> (shoelace), que vale para qualquer polígono: é o teorema de Green disfarçado.</p>`,
            ] };
        } },
        { nome: "Fio com corrente (Ampère)", gerar: (p) => {
          const I = p ? 10 : F.escolha([2, 5, 10, 20, 50]), r = p ? 5 : F.escolha([1, 2, 5, 10, 20]), B = (4e-7 * Math.PI * I) / (2 * Math.PI * (r / 100));
          return { enun: R`<p>Um fio reto e longo leva ${I} A. Qual o campo magnético a ${r} cm dele?</p>`, fig: "",
            passos: [
              R`<p>Lei de Ampère: $\oint\vec B\cdot d\vec\ell = \mu_0I_\text{dentro}$. Escolha a curva fechada mais esperta: um círculo de raio $r$ em volta do fio.</p>`,
              R`<p>Por simetria, $\vec B$ é tangente ao círculo e tem o mesmo módulo em todos os pontos. Então $\oint\vec B\cdot d\vec\ell = B\cdot2\pi r$: a integral virou uma multiplicação.</p>`,
              R`$$B = \frac{\mu_0I}{2\pi r} = \frac{4\pi\times10^{-7}\cdot${I}}{2\pi\cdot${F.m(r / 100, 2)}} = ${F.sigM(B, 3)}\ \text{T}$$`,
              R`<p>Para comparar: o campo da Terra é $\sim5\times10^{-5}$ T. É o campo $(-y, x)/r^2$ do laboratório, vezes $\mu_0I/2\pi$.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Uma integral real resolvida por um círculo complexo",
      enun: R`<p>Calcule $\displaystyle\int_{-\infty}^{\infty}\frac{dx}{1 + x^4}$.</p>
        <p>Ferramenta (teorema dos resíduos): se $f$ é "boa" no plano complexo exceto em alguns polos simples $z_k$ dentro de uma curva fechada $C$, então $\oint_Cf(z)\,dz = 2\pi i\sum_k\text{Res}(f, z_k)$, onde $\text{Res}(f, z_k) = \lim_{z\to z_k}(z - z_k)f(z)$. Teste com $\oint dz/z = 2\pi i$ (o "vórtice" do laboratório, versão complexa).</p>`,
      fig: "",
      dicas: [R`<p>Feche o caminho com um semicírculo enorme de raio $R$ no semiplano de cima. Na parte curva, $|f| \lesssim 1/R^4$ e o comprimento é $\pi R$: essa parte some quando $R \to \infty$.</p>`, R`<p>Os polos de cima são $z = e^{i\pi/4}$ e $z = e^{3i\pi/4}$. Com $z_0^4 = -1$, o resíduo de $\frac{1}{1 + z^4}$ é $\frac{1}{4z_0^3} = -\frac{z_0}{4}$ (regra de L'Hôpital).</p>`],
      sol: R`<p>(i) Caminho fechado: o eixo real de $-R$ a $R$ + o semicírculo de cima. Quando $R \to \infty$, o semicírculo contribui com $\leq \pi R/(R^4 - 1) \to 0$. Então a integral pedida é $\oint$.</p>
        <p>(ii) Polos de $1 + z^4 = 0$: $z = e^{i\pi/4}, e^{3i\pi/4}, e^{5i\pi/4}, e^{7i\pi/4}$. Dentro: os dois primeiros.</p>
        <p>(iii) Resíduos: $-\frac{e^{i\pi/4}}{4}$ e $-\frac{e^{3i\pi/4}}{4}$. Soma: $-\frac14\left(\frac{1 + i}{\sqrt2} + \frac{-1 + i}{\sqrt2}\right) = -\frac{i\sqrt2}{4}$.</p>
        <p>(iv) $\oint = 2\pi i\cdot\left(-\frac{i\sqrt2}{4}\right) = \frac{\pi\sqrt2}{2} = \frac{\pi}{\sqrt2} \approx 2{,}2214$. Conferi numericamente: bate em todos os dígitos.</p>
        <p class="det" style="color:var(--ink2)">Do mesmo jeito, $\int_{-\infty}^{\infty}\frac{dx}{1 + x^2} = 2\pi i\cdot\frac{1}{2i} = \pi$ (que você confere com $\arctan$). É o assunto de Variável Complexa, uma disciplina inteira de Cálculo avançado; aqui é só o aperitivo.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Funções especiais · 3</div>
        <div class="q">O que a bolinha no meio do $\oint$ muda?</div>
        <p>Ela diz: "o caminho é <b>fechado</b>; você termina onde começou". Parece detalhe, mas as quatro equações de Maxwell, que resumem todo o eletromagnetismo, são escritas com essas bolinhas. Uma integral fechada mede o que <b>gira</b> (circulação) ou o que <b>sai</b> (fluxo) de uma região.</p></div>`),

      F.secao("linha", "Integral de linha: somar ao longo de um caminho", R`
        <p>Trabalho de uma força constante: $W = \vec F\cdot\vec d$. Se a força muda e o caminho é curvo, quebre o caminho em pedacinhos $d\vec r$ e some:</p>
        ${F.formula(R`\int_C\vec F\cdot d\vec r = \int_a^b\vec F\bigl(\vec r(t)\bigr)\cdot\vec r\,{}'(t)\,dt`, "Integral de linha")}
        <p>A receita: (i) descreva o caminho por um parâmetro, $\vec r(t)$; (ii) derive para ter $d\vec r = \vec r\,{}'(t)\,dt$; (iii) coloque $\vec r(t)$ dentro de $\vec F$; (iv) faça o produto escalar e integre em $t$. Se o caminho é fechado, escreve-se $\oint_C$, e o resultado chama-se <b>circulação</b>.</p>
        ${F.demo("a circulação do redemoinho F = (−y, x)", R`<p>(i) Círculo de raio $R$: $\vec r(t) = (R\cos t, R\sin t)$, $t$ de $0$ a $2\pi$.</p>
          <p>(ii) $\vec r\,{}'(t) = (-R\sin t, R\cos t)$.</p>
          <p>(iii) $\vec F(\vec r(t)) = (-R\sin t, R\cos t)$: o campo é paralelo ao caminho em todo ponto!</p>
          <p>(iv) $\vec F\cdot\vec r\,{}' = R^2\sin^2t + R^2\cos^2t = R^2$, e $\oint = \int_0^{2\pi}R^2\,dt = 2\pi R^2$.</p>
          <p>Repare: $2\pi R^2 = 2\times(\text{área do disco})$. Não é coincidência; é o teorema de Green (próxima seção).</p>`)}
        <h3>Campos conservativos: ∮ = 0</h3>
        <p>Se $\vec F = \nabla\varphi$ (é o gradiente de um potencial ${F.ret("U01")}), então $\int_C\vec F\cdot d\vec r = \varphi(\text{fim}) - \varphi(\text{início})$, e num caminho fechado isso dá <b>zero</b>. Gravidade e campo eletrostático são assim:</p>
        ${F.formula(R`\oint\vec E\cdot d\vec\ell = 0\quad\text{(eletrostática)}`)}
        <p>Isso <b>é</b> a lei das malhas de Kirchhoff ${F.ret("C10b")}: dar a volta num circuito e voltar ao mesmo potencial. Com indução ${F.ret("C15")}, o lado direito deixa de ser zero: $\oint\vec E\cdot d\vec\ell = -\frac{d\Phi_B}{dt}$, e o campo elétrico passa a "girar".</p>`),

      F.secao("green", "O teorema de Green", R`
        ${F.formula(R`\oint_C\left(P\,dx + Q\,dy\right) = \iint_D\left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right)dA`, "Green (C percorrida no sentido anti-horário)")}
        <p>O integrando da direita é a <b>rotação local</b> do campo ($\text{rot}\,\vec F$, a "velocidade de giro" de uma rodinha de pás colocada ali, vezes 2). A ideia: divida a região em quadradinhos. A circulação de cada quadradinho é (rotação local) × (área dele). Somando todos, os lados internos se cancelam (cada lado interno é percorrido duas vezes, em sentidos opostos) e sobra só a borda de fora.</p>
        ${F.demo("Green num retângulo, para a parte com P", R`<p>(i) Retângulo $[a, b]\times[c, d]$, só com $P$ ($Q = 0$). Na borda, só os lados horizontais contam ($dx = 0$ nos verticais).</p>
          <p>(ii) Embaixo ($y = c$, indo para a direita) e em cima ($y = d$, indo para a esquerda): $\oint P\,dx = \int_a^b P(x, c)\,dx - \int_a^b P(x, d)\,dx$.</p>
          <p>(iii) Pelo teorema fundamental do cálculo em $y$: $P(x, d) - P(x, c) = \int_c^d\frac{\partial P}{\partial y}dy$.</p>
          <p>(iv) Então $\oint P\,dx = -\int_a^b\!\int_c^d\frac{\partial P}{\partial y}\,dy\,dx$ ✓. A parte com $Q$ é igual, trocando os papéis de $x$ e $y$.</p>`)}
        <h3>Área com uma integral de linha</h3>
        <p>Escolhendo $P = -y/2$ e $Q = x/2$, o integrando da direita vale 1, e sobra a área:</p>
        ${F.formula(R`\text{Área} = \frac12\oint_C(x\,dy - y\,dx)`)}
        <p>Elipse $x = a\cos t$, $y = b\sin t$: $x\,dy - y\,dx = ab(\cos^2t + \sin^2t)\,dt = ab\,dt$, e a área é $\frac12\cdot2\pi ab = \pi ab$. É assim que funciona o <b>planímetro</b>, um instrumento que mede a área de um mapa só passando uma ponta pela borda.</p>
        <h3>A versão "fluxo"</h3>
        <p>Trocando a tangente pela normal que aponta para fora: $\oint_C\vec F\cdot\hat n\,ds = \iint_D\text{div}\,\vec F\,dA$. O que sai pela borda é a soma das "fontes" de dentro.</p>`),

      F.secao("lab", "Laboratório", R`<p>Mova o círculo e mude o raio. A soma na curva (feita com 2000 pedacinhos) sempre bate com a integral dupla. A exceção é o fio: ele esconde uma circulação $2\pi$ num único ponto.</p><div id="lab-c"></div>`),

      F.secao("tresd", "Em 3D: Stokes e Gauss", R`
        ${F.formula(R`\oint_C\vec F\cdot d\vec r = \iint_S(\nabla\times\vec F)\cdot d\vec A`, "Stokes: curva fechada = borda da superfície")}
        ${F.formula(R`\oiint_S\vec F\cdot d\vec A = \iiint_V\nabla\cdot\vec F\,dV`, "Gauss (divergência): superfície fechada = casca do volume")}
        <p>O símbolo $\oiint$ (duas integrais com uma bolinha) é a integral numa superfície <b>fechada</b>, como uma esfera ou a casca de uma batata. Os dois teoremas dizem a mesma coisa que Green, um grau acima: o total na borda = a soma do que acontece dentro. A dedução está em ${F.ret("U02")}.</p>
        ${F.demo("os dois lados de Gauss, para F = (x, y, z) numa esfera", R`<p>(i) Na superfície da esfera de raio $R$, $\vec F = \vec r$ aponta para fora e tem módulo $R$: $\vec F\cdot\hat n = R$. Fluxo $= R\cdot4\pi R^2 = 4\pi R^3$.</p>
          <p>(ii) Dentro: $\nabla\cdot\vec F = 1 + 1 + 1 = 3$. Volume $\times3 = \frac43\pi R^3\cdot3 = 4\pi R^3$ ✓.</p>`)}
        <h3>As equações de Maxwell, com bolinhas</h3>
        <table class="tb"><tr><th>lei</th><th>forma integral</th><th>o que diz</th></tr>
          <tr><td>Gauss ${F.ret("C03b")}</td><td>$\oiint\vec E\cdot d\vec A = \frac{Q_\text{dentro}}{\varepsilon_0}$</td><td>carga é fonte de campo elétrico</td></tr>
          <tr><td>Gauss magnético</td><td>$\oiint\vec B\cdot d\vec A = 0$</td><td>não existe "carga magnética"</td></tr>
          <tr><td>Faraday ${F.ret("C15")}</td><td>$\oint\vec E\cdot d\vec\ell = -\frac{d}{dt}\iint\vec B\cdot d\vec A$</td><td>fluxo magnético variando faz $\vec E$ girar</td></tr>
          <tr><td>Ampère–Maxwell ${F.ret("C14")}</td><td>$\oint\vec B\cdot d\vec\ell = \mu_0I + \mu_0\varepsilon_0\frac{d}{dt}\iint\vec E\cdot d\vec A$</td><td>corrente (e $\vec E$ variando) faz $\vec B$ girar</td></tr></table>
        <p>Com Stokes e Gauss, cada uma vira a forma diferencial ${F.ret("U05")}, e daí saem as ondas eletromagnéticas ${F.ret("C15d")}.</p>`),

      F.secao("vortice", "O vórtice: quando a bolinha guarda um segredo", R`
        <p>O campo $\vec F = \frac{(-y, x)}{x^2 + y^2}$ (é o $\vec B$ de um fio, a menos de uma constante) tem $\text{rot}\,\vec F = 0$ em todo lugar onde existe. Mesmo assim, $\oint\vec F\cdot d\vec r = 2\pi$ em qualquer curva que dê uma volta no fio.</p>
        <p>Não contradiz Green: Green exige que o campo seja bom <b>em toda</b> a região de dentro, e na origem ele explode. Toda a "rotação" está concentrada num ponto: é a corrente do fio. Por isso a circulação não depende do formato da curva, só de <b>quantas voltas</b> ela dá em torno do fio (o "número de rotação"). Na física, isso é a lei de Ampère; em matemática, é a semente da teoria dos resíduos (o chefão desta página).</p>
        ${F.caixa("fisico", R`<p>A mesma ideia aparece no efeito Aharonov–Bohm (citado no jogo de Lorentz): fora do solenoide $\vec B = 0$, mas $\oint\vec A\cdot d\vec\ell = \Phi_B \neq 0$, e um elétron que dá a volta "sente" isso.</p>`)}`),

      F.secao("exemplos", "Exemplos", exemplario),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $\oint\vec F\cdot d\vec r$ para $\vec F = (-y, x)$ no círculo de raio 2 (anti-horário), de dois jeitos: direto e por Green.</p>`, fig: "", dicas: [R`<p>Direto: a demonstração da seção 1 com $R = 2$.</p>`, R`<p>Green: $\partial_xQ - \partial_yP = 1 - (-1) = 2$.</p>`], resp: R`$8\pi \approx 25{,}13$.`, sol: R`<p>Direto: $2\pi R^2 = 8\pi$. Green: $2\times\pi\cdot2^2 = 8\pi$ ✓.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>O campo $\vec F = (2xy,\ x^2)$ é conservativo? Quanto vale $\oint\vec F\cdot d\vec r$ num triângulo qualquer? E qual é o potencial?</p>`, fig: "", dicas: [R`<p>Calcule $\partial_xQ - \partial_yP$.</p>`, R`<p>Procure $\varphi$ com $\partial_x\varphi = 2xy$ e $\partial_y\varphi = x^2$.</p>`], resp: R`Sim: $\oint = 0$ em qualquer curva fechada; $\varphi = x^2y$.`, sol: R`<p>$\partial_xQ - \partial_yP = 2x - 2x = 0$ em todo o plano (sem buracos), então pelo Green $\oint = 0$. E $\nabla(x^2y) = (2xy, x^2)$ ✓.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Use $\frac12\oint(x\,dy - y\,dx)$ para achar a área da elipse com semieixos 3 e 2.</p>`, fig: "", dicas: [R`<p>$x = 3\cos t$, $y = 2\sin t$.</p>`, R`<p>$x\,dy - y\,dx = 6\,dt$.</p>`], resp: R`$6\pi \approx 18{,}85$.`, sol: R`<p>$\frac12\int_0^{2\pi}6\,dt = 6\pi = \pi ab$ ✓.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Qual o fluxo de $\vec F = (x, y, z)$ pela superfície de um cubo de aresta $L$ (centrado onde você quiser)?</p>`, fig: "", dicas: [R`<p>Gauss: troque a superfície pelo volume.</p>`, R`<p>$\nabla\cdot\vec F = 3$.</p>`], resp: R`$3L^3$.`, sol: R`<p>$\oiint = \iiint3\,dV = 3L^3$, independente da posição. Fazer pelas seis faces dá o mesmo, mas com muito mais trabalho (tente uma face só para conferir: no cubo $[0, L]^3$, a face $x = L$ dá $L\cdot L^2$).</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Uma carga de 2 nC está em algum lugar dentro de uma batata. Qual o fluxo elétrico pela casca da batata?</p>`, fig: "", dicas: [R`<p>Gauss não liga para o formato.</p>`, R`<p>$\varepsilon_0 = 8{,}854\times10^{-12}$ F/m.</p>`], resp: R`$\approx 226$ N·m²/C.`, sol: R`<p>$\Phi = Q/\varepsilon_0 = 2\times10^{-9}/8{,}854\times10^{-12} \approx 225{,}9$ N·m²/C. É o mesmo número do laboratório da lei de Gauss ${F.ret("C03b")}.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Para o vórtice $\vec F = (-y, x)/(x^2 + y^2)$, quanto vale $\oint$ (anti-horário) em: (a) um quadrado de lado 2 centrado na origem; (b) o mesmo quadrado centrado em $(3, 0)$; (c) um círculo de raio 1 em volta da origem, percorrido <b>duas vezes</b>?</p>`, fig: "", dicas: [R`<p>Fora da origem, $\text{rot}\,\vec F = 0$: dá para deformar a curva sem mudar a ∮, desde que não passe pela origem.</p>`, R`<p>Teste no laboratório com o "Fio de corrente".</p>`], resp: R`(a) $2\pi$; (b) $0$; (c) $4\pi$.`, sol: R`<p>(a) Deforme o quadrado num círculo: $2\pi$. (b) A origem fica fora, a região de dentro é toda boa, Green dá 0. (c) Cada volta soma $2\pi$. Em física: $\oint\vec B\cdot d\vec\ell = \mu_0I\times(\text{número de voltas})$.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Uma espira circular de raio 10 cm está num campo $\vec B$ uniforme, perpendicular a ela, que cresce a 0,5 T/s. Quanto vale $\oint\vec E\cdot d\vec\ell$ na espira? E o módulo do campo elétrico induzido nela?</p>`, fig: "", dicas: [R`<p>Faraday: $\oint\vec E\cdot d\vec\ell = -\frac{d}{dt}(BA)$.</p>`, R`<p>Por simetria, $E$ é tangente e constante na espira: $\oint = E\cdot2\pi r$.</p>`], resp: R`$|\oint| \approx 15{,}7$ mV; $E = 0{,}025$ V/m.`, sol: R`<p>$A = \pi(0{,}1)^2 = 0{,}0314$ m²; $|\oint| = 0{,}5\times0{,}0314 = 1{,}57\times10^{-2}$ V. $E = 1{,}57\times10^{-2}/(2\pi\cdot0{,}1) = 0{,}025$ V/m. Note: $\oint\vec E\cdot d\vec\ell \neq 0$, então esse $\vec E$ <b>não</b> é conservativo, e "diferença de potencial" perde o sentido.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-c"); e.outerHTML = F.lab("Circulação e fluxo: a soma na borda × a soma dentro", "lab-c"); SIM.circulacao(document.getElementById("lab-c"), F); },
});
