/* CII02 · Integrais impróprias. Conferido com sympy/scipy (scratchpad ci2.py):
   ∫₁^∞ dx/x² = 1; ∫₀^∞ xe^(−x) = 1; ∫₀¹ dx/√x = 2; ∫_(−∞)^∞ dx/(1 + x²) = π; ∫₀^∞ sen x/x = π/2; ∫₁^∞ e^(−x²) ≈ 0,1394 ≤ e^(−1). */
F.registrar("matematica/CII02", {
  retoma: ["CI07", "CII01"],
  html(F) {
    const R = String.raw;
    const fm1 = (v) => (Number.isInteger(+v.toFixed(6)) ? String(Math.round(v)) : F.m(v, 1));
    const exemplario = F.exemplo({
      titulo: "Converge ou diverge?",
      casos: [
        { nome: "∫₁^∞ dx/xᵖ", gerar: (p) => {
          const pp = p ? 3 : F.escolha([0.5, 1, 1.5, 2, 3]);
          const conv = pp > 1;
          return { enun: R`<p>Decida se $\displaystyle\int_1^\infty\frac{dx}{${pp === 1 ? "x" : "x^{" + fm1(pp) + "}"}}$ converge e, se convergir, calcule.</p>`, fig: "",
            passos: [
              R`<p>Definição: troque o $\infty$ por $b$, calcule, e faça $b \to \infty$: $\displaystyle\lim_{b\to\infty}\int_1^b x^{-${fm1(pp)}}dx$.</p>`,
              pp === 1 ? R`<p>Com $p = 1$, a primitiva é $\ln x$: $\int_1^b\frac{dx}{x} = \ln b$.</p>` : R`<p>Primitiva: $\frac{x^{1 - ${fm1(pp)}}}{1 - ${fm1(pp)}}$. Então $\int_1^b = \frac{b^{${fm1(1 - pp)}} - 1}{${fm1(1 - pp)}}$.</p>`,
              conv ? R`<p>Como o expoente $${fm1(1 - pp)}$ é negativo, $b^{${fm1(1 - pp)}} \to 0$. A integral converge para $\frac{1}{${fm1(pp - 1)}}${pp === 2 ? " = 1" : pp === 3 ? " = 0{,}5" : ""}$.</p>` : R`<p>${pp === 1 ? "$\\ln b \\to \\infty$" : `O expoente $${fm1(1 - pp)}$ é positivo, então $b^{${fm1(1 - pp)}} \\to \\infty$`}. A integral <b>diverge</b>: a área sob a curva é infinita, mesmo com a curva indo a zero.</p>`,
              R`<p>Regra: $\int_1^\infty\frac{dx}{x^p}$ converge $\iff p > 1$. O $\frac1x$ é a fronteira exata.</p>`,
            ] };
        } },
        { nome: "∫₀^∞ e^(−ax) e o RC", gerar: (p) => {
          const tau = p ? 2 : F.escolha([0.5, 1, 2, 5]), I0 = p ? 3 : F.escolha([1, 2, 3, 10]);
          return { enun: R`<p>Um capacitor descarrega com $i(t) = ${I0}e^{-t/${fm1(tau)}}$ mA ($t$ em ms). Quanta carga sai no total?</p>`, fig: "",
            passos: [
              R`<p>$Q = \int_0^\infty i\,dt = \lim_{T\to\infty}\int_0^T${I0}e^{-t/${fm1(tau)}}dt$.</p>`,
              R`<p>Primitiva: $-${fm1(I0 * tau)}e^{-t/${fm1(tau)}}$. De 0 a $T$: $${fm1(I0 * tau)}\left(1 - e^{-T/${fm1(tau)}}\right)$.</p>`,
              R`<p>$T \to \infty$: $Q = ${fm1(I0 * tau)}$ mA·ms $= ${fm1(I0 * tau)}\ \mu$C. A corrente nunca zera, mas a carga total é finita: $Q = I_0\tau$.</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A trombeta de Torricelli",
      enun: R`<p>Gire $y = \frac1x$, para $x \geq 1$, em torno do eixo $x$. (a) Mostre que o volume da "trombeta" é <b>finito</b> e calcule. (b) Mostre que a área da superfície é <b>infinita</b>. (c) O paradoxo: dá para encher a trombeta de tinta, mas não dá para pintar a parte de dentro. Resolva o paradoxo.</p>`,
      fig: "",
      dicas: [R`<p>(a) Discos: $V = \pi\int_1^\infty\frac{dx}{x^2}$.</p>`, R`<p>(b) Área de superfície de revolução: $S = 2\pi\int y\sqrt{1 + y'^2}\,dx \geq 2\pi\int y\,dx$. Compare com $\int\frac{dx}{x}$.</p>`],
      sol: R`<p><b>(a)</b> $V = \pi\left[-\frac1x\right]_1^\infty = \pi$.</p>
        <p><b>(b)</b> $S = 2\pi\int_1^\infty\frac1x\sqrt{1 + \frac1{x^4}}\,dx \geq 2\pi\int_1^\infty\frac{dx}{x} = \infty$ (comparação com a harmônica contínua).</p>
        <p><b>(c)</b> "Pintar" com tinta de espessura fixa $\varepsilon$ exige volume $\approx S\cdot\varepsilon = \infty$. Mas, lá no fundo, o tubo fica mais fino que $\varepsilon$: a tinta não cabe ali com essa espessura. A tinta que enche o tubo forma, na parede, uma camada cada vez mais fina, de volume total finito. Matematicamente, uma superfície infinita pode ser "coberta" por um volume finito porque a espessura vai a zero.</p>
        <p class="det" style="color:var(--ink2)">Torricelli (o do barômetro e da equação $v^2 = v_0^2 + 2a\Delta s$) descobriu isso por volta de 1641, e o resultado assustou os matemáticos da época: um objeto infinito com volume finito.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 2 · 2</div>
        <div class="q">Quanto trabalho é preciso para mandar um foguete "para o infinito"?</div>
        <p>A força da gravidade nunca zera, e o caminho é infinito. Mesmo assim, o trabalho é finito: $\frac{GMm}{R}$. É uma <b>integral imprópria</b>, com um limite de integração infinito. Este tema ensina a decidir quando "área de uma região infinita" dá um número.</p></div>`),

      F.secao("tipos", "Os dois tipos", R`
        ${F.formula(R`\int_a^\infty f(x)\,dx = \lim_{b\to\infty}\int_a^bf(x)\,dx\qquad\qquad\int_0^1f(x)\,dx = \lim_{\varepsilon\to0^+}\int_\varepsilon^1f(x)\,dx\ \ (f \text{ explode em } 0)`, "Cauda infinita / bico infinito")}
        <p>Se o limite existe (é um número), a integral <b>converge</b>; senão, <b>diverge</b>. Nos dois casos, a ideia é a mesma: calcule numa região finita e veja o que acontece quando você se aproxima do problema.</p>
        <div id="lab-imp"></div>
        ${F.formula(R`\int_1^\infty\frac{dx}{x^p}\ \text{converge} \iff p > 1\qquad\qquad\int_0^1\frac{dx}{x^p}\ \text{converge} \iff p < 1`, "Os testes-padrão")}
        <p>O $\frac1x$ diverge nos dois lados, por um triz: a área cresce como $\ln b$, devagar mas sem parar. Já $\frac1{\sqrt x}$ explode em 0 e mesmo assim tem área finita ($\int_0^1x^{-1/2}dx = 2$).</p>`),

      F.secao("comparacao", "Comparação: decidir sem calcular", R`
        <p>Se $0 \leq f \leq g$: $\int g$ converge $\Rightarrow$ $\int f$ converge; $\int f$ diverge $\Rightarrow$ $\int g$ diverge. Na cauda, só importa como a função se comporta <b>lá longe</b>.</p>
        <ul><li>$\int_1^\infty e^{-x^2}dx$: para $x \geq 1$, $e^{-x^2} \leq e^{-x}$, cuja integral converge. Logo converge (vale $\approx 0{,}139$), mesmo sem primitiva elementar.</li>
          <li>$\int_1^\infty\frac{dx}{\sqrt{x^2 + 1}}$: para $x$ grande, $\approx\frac1x$, então diverge.</li>
          <li>$\int_0^\infty\frac{\operatorname{sen}x}{x}dx$: não é absolutamente convergente, mas converge (para $\frac\pi2$) por cancelamento entre partes positivas e negativas, como uma série alternada ${F.ret("CII03")}.</li></ul>
        ${F.caixa("ponte", R`<p>A gama ${F.ret("CE02")} é uma imprópria dos dois tipos ao mesmo tempo: cauda (o $e^{-t}$ salva) e, para $x < 1$, bico em $t = 0$ ($t^{x-1}$ com expoente $> -1$ salva). É por isso que a definição só vale para $x > 0$.</p>`)}`),

      F.secao("fisica", "Impróprias na física", R`
        <table class="tb"><tr><th>integral</th><th>significado</th></tr>
          <tr><td>$\int_R^\infty\frac{GMm}{r^2}dr = \frac{GMm}{R}$</td><td>energia de escape ${F.ret("CI09")}</td></tr>
          <tr><td>$V(r) = \int_r^\infty\frac{kq}{s^2}ds = \frac{kq}{r}$</td><td>potencial elétrico com referência no infinito ${F.ret("fisica/C04")}</td></tr>
          <tr><td>$\int_0^\infty I_0e^{-t/\tau}dt = I_0\tau$</td><td>carga total de uma descarga RC</td></tr>
          <tr><td>$\int_{-\infty}^\infty e^{-x^2}dx = \sqrt\pi$</td><td>normalização da gaussiana (estatística, mecânica quântica)</td></tr>
          <tr><td>$\int_{-\infty}^\infty\frac{dx}{1 + x^2} = \pi$</td><td>a curva de Lorentz (ressonância, linhas espectrais)</td></tr>
          <tr><td>$\int_0^\infty|\psi|^2dx = 1$</td><td>função de onda normalizável: só existe se a integral converge</td></tr></table>
        ${F.caixa("fisico", R`<p><b>Quando a física diverge</b>, é um aviso. A energia do campo elétrico de uma carga pontual, $\int_0^\infty\frac{\varepsilon_0E^2}{2}4\pi r^2dr$, diverge no bico $r \to 0$ (vai como $\int\frac{dr}{r^2}$). Ou o elétron não é um ponto, ou a teoria clássica falha em escalas pequenas. A eletrodinâmica quântica lida com divergências assim (renormalização).</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $\int_1^\infty\frac{dx}{x^2}$ e $\int_0^1\frac{dx}{\sqrt x}$.</p>`, fig: "", dicas: [R`<p>Primitivas $-\frac1x$ e $2\sqrt x$.</p>`, R`<p>Faça o limite em cada uma.</p>`], resp: R`$1$ e $2$.`, sol: R`<p>$\lim_{b\to\infty}\left(1 - \frac1b\right) = 1$; $\lim_{\varepsilon\to0}(2 - 2\sqrt\varepsilon) = 2$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule $\int_0^\infty x\,e^{-x}dx$.</p>`, fig: "", dicas: [R`<p>Por partes.</p>`, R`<p>$\lim_{b\to\infty}be^{-b} = 0$.</p>`], resp: R`$1$.`, sol: R`<p>$[-xe^{-x} - e^{-x}]_0^\infty = 0 - (-1) = 1 = \Gamma(2) = 1!$.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Calcule $\int_{-\infty}^\infty\frac{dx}{1 + x^2}$.</p>`, fig: "", dicas: [R`<p>Quebre em $\int_{-\infty}^0 + \int_0^\infty$.</p>`, R`<p>$\arctan x \to \pm\frac\pi2$.</p>`], resp: R`$\pi$.`, sol: R`<p>$\frac\pi2 - \left(-\frac\pi2\right)$. No chefão de CE03, a mesma integral sai por resíduos.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Decida, sem calcular, se convergem: (a) $\int_1^\infty\frac{dx}{x^3 + 1}$; (b) $\int_1^\infty\frac{x}{x^2 + 1}dx$; (c) $\int_0^1\frac{dx}{x^2}$.</p>`, fig: "", dicas: [R`<p>Compare cada uma com $\frac1{x^p}$.</p>`, R`<p>(b) $\approx\frac1x$ para $x$ grande.</p>`], resp: R`(a) converge; (b) diverge; (c) diverge.`, sol: R`<p>(a) $\leq\frac1{x^3}$, $p = 3 > 1$. (b) $\geq\frac{1}{2x}$ para $x \geq 1$. (c) bico com $p = 2 \geq 1$.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Mostre que o potencial de uma carga pontual é $V(r) = \frac{kq}{r}$, tomando $V(\infty) = 0$ e $V(r) = \int_r^\infty E\,ds$.</p>`, fig: "", dicas: [R`<p>$E = \frac{kq}{s^2}$.</p>`, R`<p>$\int_r^\infty\frac{ds}{s^2} = \frac1r$.</p>`], resp: R`$V = kq\cdot\frac1r$.`, sol: R`<p>$kq\left[-\frac1s\right]_r^\infty = \frac{kq}{r}$. Num fio infinito, $E \propto \frac1s$ e a mesma integral diverge: não dá para pôr $V(\infty) = 0$, e o potencial do fio usa $\ln$ com outra referência.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Para que valores de $p$ a integral $\int_0^\infty\frac{dx}{x^p}$ converge?</p>`, fig: "", dicas: [R`<p>Quebre em $\int_0^1 + \int_1^\infty$.</p>`, R`<p>Um pedaço exige $p < 1$ e o outro, $p > 1$.</p>`], resp: R`Nenhum.`, sol: R`<p>As duas condições são incompatíveis: sempre um dos lados diverge. Por isso a gama precisa do $e^{-t}$ para salvar a cauda.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>A distribuição de Maxwell–Boltzmann tem forma $f(v) = Cv^2e^{-av^2}$ (para $v \geq 0$). Ache $C$ para que $\int_0^\infty f\,dv = 1$. (Use $\int_0^\infty v^2e^{-av^2}dv = \frac{\sqrt\pi}{4a^{3/2}}$.)</p>`, fig: "", dicas: [R`<p>$C\cdot\frac{\sqrt\pi}{4a^{3/2}} = 1$.</p>`, R`<p>A fórmula dada sai da gama: $\frac12\Gamma\left(\frac32\right)a^{-3/2}$.</p>`], resp: R`$C = \frac{4a^{3/2}}{\sqrt\pi}$.`, sol: R`<p>Normalizar é exigir que a imprópria valha 1. Com $a = \frac{m}{2kT}$, sai a distribuição dos gases ${F.ret("CE02")}.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-imp"); e.outerHTML = F.lab("Área infinita ou finita? A fronteira p = 1", "lab-imp"); SIM.impropria(document.getElementById("lab-imp"), F); },
});
