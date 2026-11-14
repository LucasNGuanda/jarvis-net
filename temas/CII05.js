/* CII05 · Funções de várias variáveis e derivadas parciais. Conferido com sympy (scratchpad cii2.py):
   ∂/∂x(x²y³ + sen xy) = 2xy³ + y cos xy; Schwarz em e^(xy); regra cíclica do gás ideal = −1; cilindro r = 10 ± 0,1, h = 20 ± 0,2: dV = 60π ≈ 188 cm³ (3%);
   sen(x − ct) resolve a equação de onda; formiga em T = 100 − x² − 2y²: dT/dt = −8; ∇²(1/r) = 0 e ∇²ln(x² + y²) = 0. */
F.registrar("CII05", {
  retoma: ["CI03", "CI04"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Derivadas parciais na prática",
      casos: [
        { nome: "Parciais de um polinômio", gerar: (p) => {
          const a = p ? 3 : F.escolha([1, 2, 3, 5]), b = p ? 2 : F.escolha([1, 2, 4]), x0 = p ? 1 : F.escolha([1, 2, -1]), y0 = p ? 2 : F.escolha([1, 2, 3]);
          const fx = 2 * a * x0 * y0 + b * y0 ** 3, fy = a * x0 * x0 + 3 * b * x0 * y0 * y0;
          return { enun: R`<p>Para $f(x, y) = ${F.c(a)}x^2y + ${F.c(b)}xy^3$, calcule $\frac{\partial f}{\partial x}$ e $\frac{\partial f}{\partial y}$ no ponto $(${x0}, ${y0})$.</p>`, fig: "",
            passos: [
              R`<p><b>Em $x$:</b> trate $y$ como constante (um número qualquer) e derive normalmente: $\frac{\partial f}{\partial x} = ${2 * a}xy + ${F.c(b)}y^3$.</p>`,
              R`<p><b>Em $y$:</b> agora $x$ é a constante: $\frac{\partial f}{\partial y} = ${F.c(a)}x^2 + ${3 * b}xy^2$.</p>`,
              R`<p>No ponto: $\frac{\partial f}{\partial x} = ${2 * a}\cdot${x0 < 0 ? `(${x0})` : x0}\cdot${y0} + ${b}\cdot${y0}^3 = ${fx}$ e $\frac{\partial f}{\partial y} = ${a}\cdot${x0 < 0 ? `(${x0})` : x0}^2 + ${3 * b}\cdot${x0 < 0 ? `(${x0})` : x0}\cdot${y0}^2 = ${fy}$.</p>`,
              R`<p>Leitura: andando um pouquinho para o leste ($x$), $f$ muda ${fx} vezes esse pouquinho; para o norte ($y$), ${fy} vezes.</p>`,
            ] };
        } },
        { nome: "Erro propagado (diferencial total)", gerar: (p) => {
          const r = p ? 10 : F.escolha([5, 10, 20]), h = p ? 20 : F.escolha([10, 20, 30]), dr = p ? 0.1 : F.escolha([0.05, 0.1, 0.2]), dh = p ? 0.2 : F.escolha([0.1, 0.2, 0.5]);
          const V = Math.PI * r * r * h, dV = 2 * Math.PI * r * h * dr + Math.PI * r * r * dh;
          return { enun: R`<p>Um cilindro tem raio $r = ${r} \pm ${F.n(dr)}$ cm e altura $h = ${h} \pm ${F.n(dh)}$ cm. Qual o volume e a sua incerteza (pior caso)?</p>`, fig: "",
            passos: [
              R`<p>$V = \pi r^2h = ${F.n(V, 1)}$ cm³. Diferencial total: $dV = \frac{\partial V}{\partial r}dr + \frac{\partial V}{\partial h}dh = 2\pi rh\,dr + \pi r^2\,dh$.</p>`,
              R`<p>Pior caso, com os módulos: $\Delta V = 2\pi\cdot${r}\cdot${h}\cdot${F.n(dr)} + \pi\cdot${r * r}\cdot${F.n(dh)} = ${F.n(dV, 1)}$ cm³.</p>`,
              R`<p>Relativo: $\frac{\Delta V}{V} = 2\frac{\Delta r}{r} + \frac{\Delta h}{h} = ${F.n((100 * dV) / V, 2)}\%$. Mesmo resultado da derivação logarítmica ${F.ret("CI04")}: o expoente 2 do raio vira peso 2.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O potencial de uma carga obedece a Laplace",
      enun: R`<p>Seja $V(x, y, z) = \frac{1}{r}$, com $r = \sqrt{x^2 + y^2 + z^2}$ (o potencial de uma carga pontual, a menos de constantes). Mostre que, para $r \neq 0$,</p>$$\nabla^2V = \frac{\partial^2V}{\partial x^2} + \frac{\partial^2V}{\partial y^2} + \frac{\partial^2V}{\partial z^2} = 0.$$<p>Bônus: no plano, mostre que $\ln(x^2 + y^2)$ satisfaz a versão 2D. Que objeto físico tem esse potencial?</p>`,
      fig: "",
      dicas: [R`<p>Primeiro $\frac{\partial r}{\partial x} = \frac xr$ (cadeia). Então $\frac{\partial V}{\partial x} = -\frac{1}{r^2}\cdot\frac xr = -\frac{x}{r^3}$.</p>`, R`<p>Derive de novo em $x$ (quociente ou produto): $\frac{\partial^2V}{\partial x^2} = -\frac{1}{r^3} + \frac{3x^2}{r^5}$. Some com as análogas em $y$ e $z$.</p>`],
      sol: R`<p>(i) $\frac{\partial V}{\partial x} = -\frac{x}{r^3}$.</p>
        <p>(ii) $\frac{\partial^2V}{\partial x^2} = -\frac{1}{r^3} + x\cdot\frac{3}{r^4}\cdot\frac{x}{r} = -\frac{1}{r^3} + \frac{3x^2}{r^5}$.</p>
        <p>(iii) Somando as três: $-\frac{3}{r^3} + \frac{3(x^2 + y^2 + z^2)}{r^5} = -\frac3{r^3} + \frac{3r^2}{r^5} = 0$ ∎ (conferi com álgebra simbólica).</p>
        <p><b>Bônus:</b> $\partial_x\ln(x^2 + y^2) = \frac{2x}{x^2 + y^2}$, $\partial_x^2 = \frac{2(y^2 - x^2)}{(x^2 + y^2)^2}$; somando com a de $y$, dá 0. É o potencial de um <b>fio infinito carregado</b> (em 2D, a "carga pontual" é um fio) ${F.ret("C04")}.</p>
        <p class="det" style="color:var(--ink2)">A equação de Laplace $\nabla^2V = 0$ vale em toda região sem carga. Com carga, vira a de Poisson, $\nabla^2V = -\rho/\varepsilon_0$, a lei de Gauss na forma diferencial ${F.ret("U05")}.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 2 · 5</div>
        <div class="q">A temperatura numa sala depende de onde você está. Se você der um passo para o leste, quanto ela muda?</div>
        <p>Na física, quase nada depende de uma variável só: o potencial elétrico depende de $(x, y, z)$, a pressão de um gás depende de $V$ e $T$, uma onda depende de $x$ e $t$. Para medir taxas de variação nesse mundo, derivamos <b>numa direção de cada vez</b>: são as derivadas parciais.</p></div>`),

      F.secao("funcoes", "Funções de várias variáveis", R`
        <p>$f(x, y)$ associa um número a cada ponto do plano. O gráfico $z = f(x, y)$ é uma <b>superfície</b>; mais prático que desenhar a superfície é desenhar as <b>curvas de nível</b> $f(x, y) = c$, como num mapa topográfico.</p>
        <table class="tb"><tr><th>curvas de nível de…</th><th>chamam-se</th></tr><tr><td>altitude</td><td>curvas de nível (mapa topográfico)</td></tr><tr><td>potencial elétrico</td><td>equipotenciais ${F.ret("C04")}</td></tr><tr><td>pressão atmosférica</td><td>isóbaras</td></tr><tr><td>temperatura</td><td>isotermas</td></tr></table>
        <div id="lab-sup"></div>
        <p><b>Limites em 2D</b> são mais exigentes: dá para chegar a um ponto por infinitos caminhos, e o limite tem de ser o mesmo em todos. $f = \frac{xy}{x^2 + y^2}$ em $(0, 0)$: pela reta $y = mx$, $f = \frac{m}{1 + m^2}$, que depende da reta. Pelo eixo $x$ dá 0; pela diagonal, $\frac12$. O limite não existe.</p>`),

      F.secao("parciais", "Derivadas parciais", R`
        ${F.formula(R`\frac{\partial f}{\partial x}(a, b) = \lim_{h\to0}\frac{f(a + h, b) - f(a, b)}{h},\qquad \frac{\partial f}{\partial y}(a, b) = \lim_{h\to0}\frac{f(a, b + h) - f(a, b)}{h}`, "Derivadas parciais")}
        <p>Na prática: para $\frac{\partial f}{\partial x}$, finja que $y$ é uma constante e derive como em Cálculo 1. Geometricamente, é a inclinação da fatia $y = b$ da superfície (as curvas da direita no laboratório). O símbolo $\partial$ ("d redondo") avisa que há outras variáveis paradas.</p>
        <p>Exemplo: $f = x^2y^3 + \operatorname{sen}(xy)$ tem $f_x = 2xy^3 + y\cos(xy)$ e $f_y = 3x^2y^2 + x\cos(xy)$.</p>
        <h3>Derivadas de 2ª ordem e o teorema de Schwarz</h3>
        <p>$f_{xx}$, $f_{yy}$ e as mistas $f_{xy}$, $f_{yx}$. <b>Schwarz</b>: se as mistas são contínuas, $f_{xy} = f_{yx}$ (a ordem não importa). Teste com $e^{xy}$: as duas dão $(1 + xy)e^{xy}$. Na termodinâmica, Schwarz gera as relações de Maxwell (como $\left(\frac{\partial S}{\partial V}\right)_T = \left(\frac{\partial P}{\partial T}\right)_V$), que ligam grandezas que parecem não ter nada a ver.</p>
        ${F.caixa("fisico", R`<p><b>Os físicos escrevem o que fica parado.</b> No gás ideal $PV = nRT$: $\left(\frac{\partial P}{\partial T}\right)_V = \frac{nR}{V}$ ("aquecendo num recipiente fechado") é diferente de $\left(\frac{\partial P}{\partial T}\right)_{\!S}$ (aquecendo sem trocar calor). E vale a curiosa <b>regra cíclica</b> $\left(\frac{\partial P}{\partial V}\right)_T\left(\frac{\partial V}{\partial T}\right)_P\left(\frac{\partial T}{\partial P}\right)_V = -1$, e não $+1$ como "cancelar os ∂" sugeriria.</p>`)}`),

      F.secao("diferencial", "Diferencial total e regra da cadeia", R`
        ${F.formula(R`df = \frac{\partial f}{\partial x}dx + \frac{\partial f}{\partial y}dy\qquad\qquad\frac{d}{dt}f\bigl(x(t), y(t)\bigr) = \frac{\partial f}{\partial x}\dot x + \frac{\partial f}{\partial y}\dot y`, "Diferencial total / regra da cadeia")}
        <p>Mexendo um pouquinho em cada variável, as variações se somam, cada uma com o seu "peso". É a forma geral da <b>propagação de incertezas</b>. Com erros independentes (aleatórios), os físicos somam em quadratura: $\Delta f = \sqrt{(f_x\Delta x)^2 + (f_y\Delta y)^2}$. No pior caso, somam os módulos.</p>
        ${F.demo("a formiga na chapa quente", R`<p>(i) Uma chapa tem temperatura $T(x, y) = 100 - x^2 - 2y^2$ (°C). Uma formiga passa por $(1, 1)$ com velocidade $(\dot x, \dot y) = (2, 1)$ cm/s.</p>
          <p>(ii) $T_x = -2x = -2$ e $T_y = -4y = -4$ no ponto.</p>
          <p>(iii) $\frac{dT}{dt} = T_x\dot x + T_y\dot y = -2\cdot2 + (-4)\cdot1 = -8$ °C/s: ela sente a temperatura caindo 8 graus por segundo.</p>`)}
        <h3>Equações a derivadas parciais</h3>
        <p>As leis da física em campos são equações com derivadas parciais:</p>
        <ul><li><b>Onda</b>: $\frac{\partial^2u}{\partial t^2} = c^2\frac{\partial^2u}{\partial x^2}$. Qualquer $u = f(x - ct)$ é solução: um pulso que anda com velocidade $c$ sem mudar de forma.</li>
          <li><b>Calor</b>: $\frac{\partial T}{\partial t} = \alpha\frac{\partial^2T}{\partial x^2}$.</li>
          <li><b>Laplace</b>: $\nabla^2V = 0$ (potencial onde não há carga; é o chefão).</li>
          <li><b>Schrödinger</b> e <b>Navier–Stokes</b>, o ponto final do site ${F.ret("N01")}.</li></ul>
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $f_x$, $f_y$ e $f_{xy}$ para $f(x, y) = x^3y^2 - 4xy + \ln y$.</p>`, fig: "", dicas: [R`<p>$\ln y$ não depende de $x$.</p>`, R`<p>$f_{xy}$: derive $f_x$ em $y$.</p>`], resp: R`$f_x = 3x^2y^2 - 4y$; $f_y = 2x^3y - 4x + \frac1y$; $f_{xy} = 6x^2y - 4$.`, sol: R`<p>Confira derivando $f_y$ em $x$: $6x^2y - 4$ ✓ (Schwarz).</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Mostre que $\lim_{(x,y)\to(0,0)}\frac{xy}{x^2 + y^2}$ não existe.</p>`, fig: "", dicas: [R`<p>Chegue por retas $y = mx$.</p>`, R`<p>Resultado: $\frac{m}{1 + m^2}$.</p>`], resp: R`Depende do caminho: 0 pelo eixo $x$, $\frac12$ pela diagonal.`, sol: R`<p>Caminhos diferentes, valores diferentes $\Rightarrow$ não existe. Cuidado com a volta: mesmo que todas as retas dessem o mesmo valor, ainda poderia falhar por uma parábola.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Um cilindro tem $r = 10 \pm 0{,}1$ cm e $h = 20 \pm 0{,}2$ cm. Calcule $V$ e $\Delta V$ (pior caso).</p>`, fig: "", dicas: [R`<p>$dV = 2\pi rh\,dr + \pi r^2dh$.</p>`, R`<p>$40\pi + 20\pi$.</p>`], resp: R`$V = 2000\pi \approx 6283$ cm³; $\Delta V = 60\pi \approx 188$ cm³ (3%).`, sol: R`<p>Relativo: $2\cdot1\% + 1\% = 3\%$. O raio pesa o dobro, como no pêndulo ${F.ret("CI04")}.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Mostre que $u(x, t) = \operatorname{sen}(x - ct)$ satisfaz a equação de onda $u_{tt} = c^2u_{xx}$. Faça o mesmo para $e^{-(x - ct)^2}$.</p>`, fig: "", dicas: [R`<p>$u_t = -c\cos(x - ct)$, $u_{tt} = -c^2\operatorname{sen}(\ldots)$.</p>`, R`<p>Em geral, para $u = f(x - ct)$: $u_{tt} = c^2f''$ e $u_{xx} = f''$ (cadeia).</p>`], resp: R`As duas satisfazem; qualquer $f(x - ct)$ satisfaz.`, sol: R`<p>Com $s = x - ct$: $\partial_x = \frac{d}{ds}$ e $\partial_t = -c\frac{d}{ds}$. Então $u_{tt} = c^2f''(s) = c^2u_{xx}$. É um pulso andando para a direita; $f(x + ct)$ anda para a esquerda.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>No gás ideal $PV = nRT$, calcule $\left(\frac{\partial P}{\partial V}\right)_T$, $\left(\frac{\partial V}{\partial T}\right)_P$ e $\left(\frac{\partial T}{\partial P}\right)_V$ e mostre que o produto é $-1$.</p>`, fig: "", dicas: [R`<p>$P = \frac{nRT}{V}$, $V = \frac{nRT}{P}$, $T = \frac{PV}{nR}$.</p>`, R`<p>Produto: $-\frac{nRT}{V^2}\cdot\frac{nR}{P}\cdot\frac{V}{nR}$; use $PV = nRT$.</p>`], resp: R`$-\frac{nRT}{V^2}$, $\frac{nR}{P}$, $\frac{V}{nR}$; produto $-\frac{nRT}{PV} = -1$.`, sol: R`<p>O sinal negativo vem de que, numa curva de nível de $F(P, V, T) = 0$, as três variáveis não podem crescer juntas.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Uma formiga anda numa chapa com $T(x, y) = 100 - x^2 - 2y^2$. Passando por $(1, 1)$ com velocidade $(2, 1)$, que taxa de variação de temperatura ela sente? Em que direção ela deveria andar para a temperatura <i>não</i> mudar?</p>`, fig: "", dicas: [R`<p>$\dot T = T_x\dot x + T_y\dot y$.</p>`, R`<p>Não mudar: $T_x\dot x + T_y\dot y = 0$, ou seja, $-2\dot x - 4\dot y = 0$.</p>`], resp: R`$-8$ °C/s; para não mudar, andar na direção $(2, -1)$ (ou $(-2, 1)$), tangente à isoterma.`, sol: R`<p>Ao longo de uma curva de nível, $T$ é constante por definição. Próximo tema: essa direção é perpendicular ao gradiente ${F.ret("CII06")}.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>A energia de um pêndulo é $E(\theta, \omega) = \frac12m\ell^2\omega^2 - mg\ell\cos\theta$. Mostre que, se $\dot\theta = \omega$ e $\dot\omega = -\frac g\ell\operatorname{sen}\theta$, então $\frac{dE}{dt} = 0$.</p>`, fig: "", dicas: [R`<p>$\frac{dE}{dt} = E_\theta\dot\theta + E_\omega\dot\omega$.</p>`, R`<p>$E_\theta = mg\ell\operatorname{sen}\theta$, $E_\omega = m\ell^2\omega$.</p>`], resp: R`$mg\ell\operatorname{sen}\theta\,\omega + m\ell^2\omega\left(-\frac g\ell\operatorname{sen}\theta\right) = 0$.`, sol: R`<p>É a conservação de energia do pêndulo ${F.ret("EP01")}, provada pela regra da cadeia. Na mecânica de Hamilton, isso vira uma regra geral: a energia se conserva quando ela não depende explicitamente do tempo ${F.ret("U04")}.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-sup"); e.outerHTML = F.lab("Mapa topográfico e as fatias de f", "lab-sup"); SIM.superficie(document.getElementById("lab-sup"), F); },
});
