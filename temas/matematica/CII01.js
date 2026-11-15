/* CII01 · Técnicas de integração. Conferido com sympy (scratchpad ci2.py):
   ∫x cos x = x sen x + cos x; ∫ln x = x ln x − x; ∫₀^π x sen x = π; ∫eˣcos x = eˣ(sen x + cos x)/2; ∫dx/(x² − 5x + 6) = ln|(x − 3)/(x − 2)|;
   ∫₀¹√(1 − x²) = π/4; ∫₀^π sen² = π/2; ∫₀^∞ x²e^(−x) = 2; ∫₀¹ ln(1 + x)/(1 + x²) = (π/8) ln 2 ≈ 0,27220. */
F.registrar("matematica/CII01", {
  retoma: ["CI08", "CI04"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Escolhendo a técnica",
      casos: [
        { nome: "Partes: ∫ x·e^(ax) dx", gerar: (p) => {
          const a = p ? 2 : F.escolha([-1, 2, 3, -2]);
          return { enun: R`<p>Calcule $\displaystyle\int x\,e^{${F.c(a)}x}\,dx$.</p>`, fig: "",
            passos: [
              R`<p>Produto de polinômio com exponencial: por partes. Escolha $u = x$ (fica mais simples ao derivar) e $dv = e^{${F.c(a)}x}dx$.</p>`,
              R`<p>$du = dx$ e $v = \frac{e^{${F.c(a)}x}}{${a}}$.</p>`,
              R`$$\int u\,dv = uv - \int v\,du = \frac{x\,e^{${F.c(a)}x}}{${a}} - \int\frac{e^{${F.c(a)}x}}{${a}}dx = \frac{x\,e^{${F.c(a)}x}}{${a}} - \frac{e^{${F.c(a)}x}}{${a * a}} + C$$`,
              R`<p>Organizando: $\dfrac{e^{${F.c(a)}x}}{${a * a}}\left(${F.c(a)}x - 1\right) + C$. Confira derivando (regra do produto).</p>`,
            ] };
        } },
        { nome: "Partes: ∫ xⁿ ln x dx", gerar: (p) => {
          const n = p ? 3 : F.escolha([1, 2, 3, 4]);
          return { enun: R`<p>Calcule $\displaystyle\int ${n === 1 ? "x" : `x^{${n}}`}\ln x\,dx$.</p>`, fig: "",
            passos: [
              R`<p>Agora o $\ln$ é que deve ser derivado (vira $\frac1x$, que é mais simples). $u = \ln x$, $dv = ${n === 1 ? "x" : `x^{${n}}`}\,dx$.</p>`,
              R`<p>$du = \frac{dx}{x}$ e $v = \frac{x^{${n + 1}}}{${n + 1}}$.</p>`,
              R`$$\frac{x^{${n + 1}}\ln x}{${n + 1}} - \int\frac{x^{${n + 1}}}{${n + 1}}\cdot\frac{dx}{x} = \frac{x^{${n + 1}}\ln x}{${n + 1}} - \frac{x^{${n + 1}}}{${(n + 1) ** 2}} + C$$`,
              R`<p>Regra prática (LIATE): escolha como $u$ quem vem primeiro em <b>L</b>ogaritmo, <b>I</b>nversa trigonométrica, <b>A</b>lgébrica, <b>T</b>rigonométrica, <b>E</b>xponencial.</p>`,
            ] };
        } },
        { nome: "Frações parciais", gerar: (p) => {
          const a = p ? 1 : F.escolha([1, 2, -1]), b = p ? 3 : F.escolha([3, 4, 5].filter((v) => v !== a));
          const s = a + b, pr = a * b, A = 1 / (a - b);
          const xa = a < 0 ? `x + ${-a}` : `x - ${a}`;
          const den = `x^2 ${s < 0 ? "+" : "-"} ${F.c(Math.abs(s))}x ${pr < 0 ? "-" : "+"} ${Math.abs(pr)}`;
          return { enun: R`<p>Calcule $\displaystyle\int\frac{dx}{${den}}$.</p>`, fig: "",
            passos: [
              R`<p>Fatore o denominador (raízes ${a} e ${b}): $${den} = (x ${a < 0 ? "+" : "-"} ${Math.abs(a)})(x - ${b})$.</p>`,
              R`<p>Procure $\frac{1}{(${xa})(x - ${b})} = \frac{A}{${xa}} + \frac{B}{x - ${b}}$. Multiplicando: $1 = A(x - ${b}) + B(${xa})$. Com $x = ${a}$: $A = \frac{1}{${a - b}}$. Com $x = ${b}$: $B = \frac{1}{${b - a}}$.</p>`,
              R`$$\int = \frac{1}{${b - a}}\left(\ln|x - ${b}| - \ln|x ${a < 0 ? "+" : "-"} ${Math.abs(a)}|\right) + C = \frac{1}{${b - a}}\ln\left|\frac{x - ${b}}{x ${a < 0 ? "+" : "-"} ${Math.abs(a)}}\right| + C$$`,
              R`<p>A ideia: uma fração "complicada" vira soma de frações simples, cada uma com primitiva $\ln$. ($A = ${F.n(A, 3)}$, $B = ${F.n(-A, 3)}$.)</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "Uma integral de olimpíada",
      enun: R`<p>Calcule $\displaystyle I = \int_0^1\frac{\ln(1 + x)}{1 + x^2}\,dx$.</p>`,
      fig: "",
      dicas: [R`<p>O $1 + x^2$ pede $x = \operatorname{tg}\theta$. Com isso, $\frac{dx}{1 + x^2} = d\theta$ e os limites viram $0$ e $\frac\pi4$.</p>`, R`<p>Depois, a mesma simetria do chefão de CI08: troque $\theta \to \frac\pi4 - \theta$ e use $\operatorname{tg}\left(\frac\pi4 - \theta\right) = \frac{1 - \operatorname{tg}\theta}{1 + \operatorname{tg}\theta}$.</p>`],
      sol: R`<p>(i) $x = \operatorname{tg}\theta$: $I = \int_0^{\pi/4}\ln(1 + \operatorname{tg}\theta)\,d\theta$.</p>
        <p>(ii) Troque $\theta = \frac\pi4 - \varphi$: $1 + \operatorname{tg}\left(\frac\pi4 - \varphi\right) = 1 + \frac{1 - \operatorname{tg}\varphi}{1 + \operatorname{tg}\varphi} = \frac{2}{1 + \operatorname{tg}\varphi}$.</p>
        <p>(iii) Então $I = \int_0^{\pi/4}\left[\ln2 - \ln(1 + \operatorname{tg}\varphi)\right]d\varphi = \frac\pi4\ln2 - I$.</p>
        <p>(iv) $2I = \frac\pi4\ln2 \Rightarrow I = \frac{\pi}{8}\ln2 \approx 0{,}27220$ ∎. Conferi numericamente: bate em todos os dígitos.</p>
        <p class="det" style="color:var(--ink2)">Essa integral caiu na prova Putnam de 2005 (problema A5). A técnica é a mesma de CI08: quando não dá para achar a primitiva, procure uma simetria que faça a integral aparecer dos dois lados.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Cálculo 2 · 1</div>
        <div class="q">Derivar é mecânico. Por que integrar é uma arte?</div>
        <p>Toda função escrita com fórmulas tem derivada com fórmula, por regras fixas. Já a primitiva de $e^{-x^2}$ ou de $\frac{\operatorname{sen}x}{x}$ não pode ser escrita com funções elementares (Liouville provou isso no século XIX). Por isso integrar é reconhecer padrões. Este tema dá as quatro técnicas que resolvem quase tudo que aparece em física.</p></div>`),

      F.secao("partes", "Integração por partes", R`
        ${F.formula(R`\int u\,dv = uv - \int v\,du\qquad\qquad\int_a^bu\,v'\,dx = \Bigl[uv\Bigr]_a^b - \int_a^bv\,u'\,dx`, "Por partes")}
        <p>Ela é a regra do produto integrada: $(uv)' = u'v + uv'$, então $uv = \int u'v + \int uv'$. Serve para trocar uma integral difícil por outra mais fácil. O desenho do laboratório mostra por que funciona: as duas integrais são duas partes de um retângulo.</p>
        <div id="lab-par"></div>
        <p>Exemplos: $\int x\cos x\,dx = x\operatorname{sen}x + \cos x + C$ ($u = x$); $\int\ln x\,dx = x\ln x - x + C$ ($u = \ln x$, $dv = dx$: o "truque do 1").</p>
        ${F.demo("o truque do círculo: ∫ eˣ cos x dx", R`<p>(i) Partes com $u = \cos x$, $dv = e^xdx$: $I = e^x\cos x + \int e^x\operatorname{sen}x\,dx$.</p>
          <p>(ii) De novo, com $u = \operatorname{sen}x$: $\int e^x\operatorname{sen}x\,dx = e^x\operatorname{sen}x - \int e^x\cos x\,dx = e^x\operatorname{sen}x - I$.</p>
          <p>(iii) Então $I = e^x\cos x + e^x\operatorname{sen}x - I$, e a integral original voltou! Isole: $I = \frac{e^x(\operatorname{sen}x + \cos x)}{2} + C$ ∎.</p>
          <p>Esse tipo de integral aparece em oscilações amortecidas (energia dissipada por atrito num MHS amortecido).</p>`)}
        ${F.caixa("ponte", R`<p><b>A recorrência da gama é integração por partes</b>: $\Gamma(x+1) = \int t^xe^{-t}dt = [-t^xe^{-t}] + x\int t^{x-1}e^{-t}dt = x\,\Gamma(x)$ ${F.ret("CE02")}. E, na mecânica quântica, a "integração por partes com borda zero" é o que faz o operador momento ser hermitiano.</p>`)}`),

      F.secao("parciais", "Frações parciais", R`
        <p>Para integrar $\frac{P(x)}{Q(x)}$ (polinômio sobre polinômio): (i) se o grau de cima for $\geq$ o de baixo, divida primeiro; (ii) fatore $Q$; (iii) escreva como soma de frações simples; (iv) integre cada uma.</p>
        <table class="tb"><tr><th>fator em Q</th><th>termos na decomposição</th><th>primitiva</th></tr>
          <tr><td>$(x - a)$</td><td>$\frac{A}{x - a}$</td><td>$A\ln|x - a|$</td></tr>
          <tr><td>$(x - a)^2$</td><td>$\frac{A}{x - a} + \frac{B}{(x - a)^2}$</td><td>$\ldots - \frac{B}{x - a}$</td></tr>
          <tr><td>$x^2 + 1$ (sem raiz real)</td><td>$\frac{Ax + B}{x^2 + 1}$</td><td>$\frac A2\ln(x^2 + 1) + B\arctan x$</td></tr></table>
        ${F.caixa("fisico", R`<p><b>Crescimento logístico</b> (população com limite $K$, ou uma reação autocatalítica): $\frac{dN}{dt} = rN\left(1 - \frac NK\right)$. Separando, $\int\frac{dN}{N(1 - N/K)} = \int r\,dt$, e o lado esquerdo sai por frações parciais: $\frac{1}{N} + \frac{1/K}{1 - N/K}$. O resultado é a curva em "S" $N(t) = \frac{K}{1 + Ce^{-rt}}$.</p>`)}`),

      F.secao("trig", "Integrais trigonométricas e substituição trigonométrica", R`
        <p><b>Potências pares</b>: use o arco metade, $\operatorname{sen}^2x = \frac{1 - \cos2x}{2}$ e $\cos^2x = \frac{1 + \cos2x}{2}$. Exemplo: $\int_0^\pi\operatorname{sen}^2x\,dx = \frac\pi2$ (a média de $\operatorname{sen}^2$ é $\frac12$: é daí que sai o valor eficaz $V_\text{pico}/\sqrt2$).</p>
        <p><b>Potência ímpar</b>: separe um fator e use $\operatorname{sen}^2 + \cos^2 = 1$. Exemplo: $\int\operatorname{sen}^3x\,dx = \int(1 - \cos^2x)\operatorname{sen}x\,dx$, com $u = \cos x$.</p>
        <p><b>Raízes</b> de $a^2 - x^2$, $a^2 + x^2$, $x^2 - a^2$: troque $x = a\operatorname{sen}\theta$, $a\operatorname{tg}\theta$, $a\sec\theta$, e a raiz some (é Pitágoras).</p>
        ${F.demo("a área do círculo", R`<p>(i) Um quarto de círculo de raio 1: $\int_0^1\sqrt{1 - x^2}\,dx$.</p>
          <p>(ii) $x = \operatorname{sen}\theta$, $dx = \cos\theta\,d\theta$, e $\sqrt{1 - \operatorname{sen}^2\theta} = \cos\theta$. Limites: $0 \to \frac\pi2$.</p>
          <p>(iii) $\int_0^{\pi/2}\cos^2\theta\,d\theta = \int_0^{\pi/2}\frac{1 + \cos2\theta}{2}d\theta = \frac\pi4$.</p>
          <p>(iv) Círculo inteiro: $4\cdot\frac\pi4 = \pi$ (raio 1), e com raio $r$, $\pi r^2$ ✓.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $\int x\cos x\,dx$ e $\int_0^\pi x\operatorname{sen}x\,dx$.</p>`, fig: "", dicas: [R`<p>$u = x$.</p>`, R`<p>$\int x\operatorname{sen}x = -x\cos x + \operatorname{sen}x$.</p>`], resp: R`$x\operatorname{sen}x + \cos x + C$; $\ \pi$.`, sol: R`<p>$[-x\cos x + \operatorname{sen}x]_0^\pi = -\pi\cdot(-1) + 0 - 0 = \pi$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Calcule $\int\ln x\,dx$ e $\int\arctan x\,dx$.</p>`, fig: "", dicas: [R`<p>Truque do 1: $u = $ a função, $dv = dx$.</p>`, R`<p>No segundo, sobra $\int\frac{x}{1 + x^2}dx$: substituição.</p>`], resp: R`$x\ln x - x + C$; $\ x\arctan x - \frac12\ln(1 + x^2) + C$.`, sol: R`<p>Mesma técnica nos dois: derivar a função "difícil" a transforma numa racional.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Calcule $\int\frac{dx}{x^2 - 5x + 6}$.</p>`, fig: "", dicas: [R`<p>$x^2 - 5x + 6 = (x - 2)(x - 3)$.</p>`, R`<p>$A = -1$, $B = 1$.</p>`], resp: R`$\ln\left|\frac{x - 3}{x - 2}\right| + C$.`, sol: R`<p>$\frac{1}{(x-2)(x-3)} = \frac{-1}{x - 2} + \frac{1}{x - 3}$.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Calcule $\int_0^\pi\operatorname{sen}^2x\,dx$ e $\int_0^{2\pi}\operatorname{sen}^2(3x)\,dx$.</p>`, fig: "", dicas: [R`<p>$\operatorname{sen}^2u = \frac{1 - \cos2u}{2}$.</p>`, R`<p>Num número inteiro de períodos, a parte com cosseno integra para 0.</p>`], resp: R`$\frac\pi2$ e $\pi$.`, sol: R`<p>Nos dois, a média de $\operatorname{sen}^2$ é $\frac12$; vezes o comprimento do intervalo ($\pi$ e $2\pi$).</p>` }),
        F.exercicio({ n: 5, marcas: ["!"], enun: R`<p>Calcule $\int_0^\infty x^2e^{-x}\,dx$ por partes (duas vezes). Que número da CE02 é esse?</p>`, fig: "", dicas: [R`<p>$u = x^2$; os termos de borda $x^ne^{-x}$ valem 0 em 0 e no infinito.</p>`, R`<p>Sobra $2\int_0^\infty xe^{-x}dx = 2\int_0^\infty e^{-x}dx$.</p>`], resp: R`$2 = 2! = \Gamma(3)$.`, sol: R`<p>Cada partes "abaixa" a potência e solta um fator: $2\cdot1\cdot1$. Em geral, $\int_0^\infty x^ne^{-x}dx = n!$.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>Calcule $\int\frac{dx}{\sqrt{4 - x^2}}$ e $\int\frac{dx}{x^2 + 9}$.</p>`, fig: "", dicas: [R`<p>$x = 2\operatorname{sen}\theta$ no primeiro.</p>`, R`<p>$x = 3\operatorname{tg}\theta$ no segundo.</p>`], resp: R`$\arcsin\frac x2 + C$; $\ \frac13\arctan\frac x3 + C$.`, sol: R`<p>Primeiro: $\frac{2\cos\theta\,d\theta}{2\cos\theta} = d\theta$. Segundo: $\frac{3\sec^2\theta\,d\theta}{9\sec^2\theta} = \frac{d\theta}{3}$.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Calcule $\int e^x\operatorname{sen}x\,dx$ pelo "truque do círculo".</p>`, fig: "", dicas: [R`<p>Duas vezes por partes, sempre com $dv = e^xdx$.</p>`, R`<p>Isole a integral que reaparece.</p>`], resp: R`$\frac{e^x(\operatorname{sen}x - \cos x)}{2} + C$.`, sol: R`<p>$I = e^x\operatorname{sen}x - \int e^x\cos x = e^x\operatorname{sen}x - e^x\cos x - I$. Isola: $2I = e^x(\operatorname{sen}x - \cos x)$. Confira derivando.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-par"); e.outerHTML = F.lab("Por partes, como figura: ∫v du + ∫u dv = retângulo", "lab-par"); SIM.partes(document.getElementById("lab-par"), F); },
});
