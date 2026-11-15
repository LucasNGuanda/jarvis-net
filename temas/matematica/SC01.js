/* SC01 · MIT Integration Bee 2026, fase classificatória (qualifying round): 20 integrais.
   Respostas minhas (não há gabarito no arquivo), todas conferidas em Python (mpmath): definidas por quadratura numérica,
   indefinidas derivando a primitiva em vários pontos. Ver scratchpad/vmit.py. "log" = logaritmo natural (convenção do MIT). */
F.registrar("matematica/SC01", {
  retoma: ["CI08", "CII01", "CII02"],
  html(F) {
    const R = String.raw;
    const mit = `<span class="fonte">MIT Integration Bee 2026</span> `;
    const q = (n, integral, o) => F.exercicio({ n, marcas: ["MIT", ...(o.marcas || [])], enun: mit + R`<p>$$${integral}$$</p>`, dicas: o.dicas, resp: o.resp, sol: o.sol });
    const lista = [
      q(1, R`\int_{-\pi}^{\pi}\sin^{2025}x\,\cos^{2026}x\,dx`, {
        dicas: [R`<p>Olhe a paridade antes de fazer qualquer conta.</p>`, R`<p>$\sin^{\text{ímpar}}$ é ímpar, $\cos^{\text{par}}$ é par.</p>`],
        resp: R`$0$`, sol: R`<p>O integrando é ímpar (ímpar × par) e o intervalo é simétrico: a integral é 0. Os expoentes enormes estão ali só para assustar.</p>` }),
      q(2, R`\int e^{2026e^x + x}\,dx`, {
        dicas: [R`<p>$e^{2026e^x + x} = e^{2026e^x}\cdot e^x$.</p>`, R`<p>$u = e^x$.</p>`],
        resp: R`$\dfrac{e^{2026e^x}}{2026} + C$`, sol: R`<p>Com $u = e^x$, $du = e^x\,dx$: $\int e^{2026u}\,du = \frac{e^{2026u}}{2026}$.</p>` }),
      q(3, R`\int_0^{2026}\left\{\frac{\lfloor x\rfloor}{3}\right\}dx`, {
        dicas: [R`<p>$\{\,\}$ é a parte fracionária. Em $[k, k+1)$ o integrando é constante: $\{k/3\}$.</p>`, R`<p>$\{k/3\}$ só vale $0$, $\frac13$, $\frac23$, nessa ordem, repetindo. São 2026 intervalos.</p>`],
        resp: R`$675$`, sol: R`<p>A integral vira $\sum_{k=0}^{2025}\{k/3\}$. Cada bloco de 3 valores soma $0 + \frac13 + \frac23 = 1$. $2026 = 3\cdot675 + 1$: são 675 blocos completos ($k = 0$ a $2024$) e sobra $k = 2025$, com $\{2025/3\} = 0$. Total: $675$.</p>` }),
      q(4, R`\int_{-1}^{1}\left|x + \left|x + \left|x + \cdots\left|x + |x|\right|\cdots\right|\right|\right|dx\quad(\text{2026 }x\text{'s})`, {
        dicas: [R`<p>Separe $x \ge 0$ e $x < 0$.</p>`, R`<p>Para $x < 0$: $|x| = -x$, depois $|x + (-x)| = 0$, depois $|x + 0| = -x$… alterna.</p>`],
        resp: R`$1013$`, sol: R`<p>Para $x \ge 0$, tudo é positivo e o integrando é $2026x$: $\int_0^1 2026x\,dx = 1013$.</p>
          <p>Para $x < 0$, chamando $f_1 = |x| = -x$ e $f_{k+1} = |x + f_k|$: $f_2 = 0$, $f_3 = -x$, $f_4 = 0$… Com 2026 (par), $f_{2026} = 0$. Total: $1013$.</p>` }),
      q(5, R`\int\frac{dx}{\sqrt{x+1} - \sqrt{x-1}}`, {
        dicas: [R`<p>Racionalize: multiplique em cima e embaixo pelo conjugado.</p>`, R`<p>$(x + 1) - (x - 1) = 2$.</p>`],
        resp: R`$\dfrac13\left[(x+1)^{3/2} + (x-1)^{3/2}\right] + C$`, sol: R`<p>$\frac1{\sqrt{x+1} - \sqrt{x-1}} = \frac{\sqrt{x+1} + \sqrt{x-1}}{2}$. Integrando cada raiz: $\frac12\cdot\frac23\left[(x+1)^{3/2} + (x-1)^{3/2}\right]$.</p>` }),
      q(6, R`\int\sqrt{1 + \cosh x}\,dx`, {
        dicas: [R`<p>Arco metade, versão hiperbólica: $\cosh x = 2\cosh^2\frac x2 - 1$.</p>`, R`<p>$\cosh$ é sempre positivo, então a raiz sai sem módulo.</p>`],
        resp: R`$2\sqrt2\sinh\dfrac x2 + C$`, sol: R`<p>$1 + \cosh x = 2\cosh^2\frac x2$, então $\sqrt{1 + \cosh x} = \sqrt2\cosh\frac x2$, e a primitiva é $2\sqrt2\sinh\frac x2$.</p>` }),
      q(7, R`\int\frac{2^{\log x}}{x^2}\,dx`, {
        dicas: [R`<p>$2^{\ln x} = e^{\ln 2\cdot\ln x} = x^{\ln 2}$.</p>`, R`<p>Vira uma potência de $x$.</p>`],
        resp: R`$\dfrac{x^{\ln 2 - 1}}{\ln 2 - 1} + C$`, sol: R`<p>$\frac{x^{\ln 2}}{x^2} = x^{\ln 2 - 2}$, e $\int x^{\ln2 - 2}dx = \frac{x^{\ln 2 - 1}}{\ln 2 - 1}$ (o expoente não é $-1$, então a regra da potência vale).</p>` }),
      q(8, R`\int_0^{1/2}\sum_{n=2}^{\infty}x^n\,dx`, {
        dicas: [R`<p>Some a PG primeiro ${F.ret("CII03")}.</p>`, R`<p>$\sum_{n\ge2}x^n = \frac{x^2}{1 - x}$; divida o polinômio.</p>`],
        resp: R`$\ln 2 - \dfrac58$`, sol: R`<p>$\frac{x^2}{1-x} = -x - 1 + \frac1{1-x}$. Primitiva: $-\frac{x^2}2 - x - \ln(1 - x)$. De 0 a $\frac12$: $-\frac18 - \frac12 + \ln 2 = \ln 2 - \frac58 \approx 0{,}0681$.</p>` }),
      q(9, R`\int x^2\sin x\,dx`, {
        dicas: [R`<p>Por partes duas vezes ${F.ret("CII01")}, derivando o polinômio.</p>`, R`<p>Método da tabela: $x^2, 2x, 2, 0$ contra $\sin, -\cos, -\sin, \cos$, com sinais $+, -, +$.</p>`],
        resp: R`$-x^2\cos x + 2x\sin x + 2\cos x + C$`, sol: R`<p>Tabela: $x^2\cdot(-\cos x) - 2x\cdot(-\sin x) + 2\cdot\cos x$.</p>` }),
      q(10, R`\int\frac{(x-1)^2}{2e^x + x^2 + 1}\,dx`, { marcas: ["!"],
        dicas: [R`<p>Derive o denominador: $2e^x + 2x$.</p>`, R`<p>Escreva o numerador como (denominador) − (derivada do denominador).</p>`],
        resp: R`$x - \ln\left(2e^x + x^2 + 1\right) + C$`, sol: R`<p>$(x - 1)^2 = x^2 - 2x + 1 = (2e^x + x^2 + 1) - (2e^x + 2x)$. Então o integrando é $1 - \frac{(2e^x + x^2 + 1)'}{2e^x + x^2 + 1}$.</p>` }),
      q(11, R`\int_{-1}^{1}\max\left(0,\ \sqrt{1 - x^2} - \tfrac12\right)dx`, {
        dicas: [R`<p>Desenhe: é a parte do semicírculo unitário acima da reta $y = \frac12$.</p>`, R`<p>Segmento circular: setor menos triângulo. O corte é em $x = \pm\frac{\sqrt3}2$ (ângulo central de 120°).</p>`],
        resp: R`$\dfrac\pi3 - \dfrac{\sqrt3}4$`, sol: R`<p>Setor de 120° do círculo unitário: $\frac\pi3$. Triângulo com vértice na origem e base na corda: $\frac12\cdot\sqrt3\cdot\frac12 = \frac{\sqrt3}4$. Segmento: $\frac\pi3 - \frac{\sqrt3}4 \approx 0{,}614$.</p>` }),
      q(12, R`\int_0^1\sqrt{x^2 + x + \sqrt{x^2 + x + \sqrt{x^2 + x + \cdots}}}\,dx`, {
        dicas: [R`<p>Chame a raiz infinita de $y$: $y = \sqrt{x^2 + x + y}$.</p>`, R`<p>$y^2 - y = x^2 + x$: fatore.</p>`],
        resp: R`$\dfrac32$`, sol: R`<p>$y^2 - y - x^2 - x = (y - x - 1)(y + x) = 0$. Como $y > 0$: $y = x + 1$. $\int_0^1(x + 1)dx = \frac32$.</p>` }),
      q(13, R`\int\left(\cos^5x - 10\cos^3x\sin^2x + 5\cos x\sin^4x\right)dx`, {
        dicas: [R`<p>Os coeficientes 1, 10, 5 são binomiais de $(a + b)^5$, pulando de dois em dois.</p>`, R`<p>De Moivre: parte real de $(\cos x + i\sin x)^5$.</p>`],
        resp: R`$\dfrac{\sin 5x}5 + C$`, sol: R`<p>$\text{Re}(\cos x + i\sin x)^5 = \cos^5x - \binom52\cos^3x\sin^2x + \binom54\cos x\sin^4x = \cos 5x$. Então a integral é $\frac{\sin 5x}5$.</p>` }),
      q(14, R`\int\arctan\sqrt x\,dx`, {
        dicas: [R`<p>Por partes com $u = \arctan\sqrt x$, $dv = dx$.</p>`, R`<p>$du = \frac{1}{1 + x}\cdot\frac{1}{2\sqrt x}dx$; depois $t = \sqrt x$.</p>`],
        resp: R`$(x + 1)\arctan\sqrt x - \sqrt x + C$`, sol: R`<p>$x\arctan\sqrt x - \int\frac{\sqrt x}{2(1 + x)}dx$. Com $t = \sqrt x$: $\int\frac{t^2}{1 + t^2}dt = t - \arctan t$. Juntando: $x\arctan\sqrt x - \sqrt x + \arctan\sqrt x$.</p>` }),
      q(15, R`\int_0^{1000}\Big(\lfloor\lceil x\rceil\rfloor + \lceil\lfloor x\rfloor\rceil + \lfloor\{x\}\rfloor + \{\lfloor x\rfloor\} + \lceil\{x\}\rceil + \{\lceil x\rceil\}\Big)dx`, {
        dicas: [R`<p>Os pontos inteiros não mudam a integral: olhe só $x$ não inteiro.</p>`, R`<p>Para $x$ não inteiro: $\lceil x\rceil = \lfloor x\rfloor + 1$, $0 < \{x\} < 1$.</p>`],
        resp: R`$1\,001\,000$`, sol: R`<p>Termo a termo (com $x$ não inteiro): $\lceil x\rceil$, $\lfloor x\rfloor$, $0$, $0$, $1$, $0$. Soma: $2\lfloor x\rfloor + 2$.</p>
          <p>$\int_0^{1000}(2\lfloor x\rfloor + 2)dx = 2\sum_{k=0}^{999}k + 2000 = 999\,000 + 2000 = 1\,001\,000$.</p>` }),
      q(16, R`\int\sqrt{\frac{\cos x\,\cot x\,\csc x}{\sin x\,\tan x\,\sec x}}\,dx`, {
        dicas: [R`<p>Escreva tudo em seno e cosseno.</p>`, R`<p>Sobra $\cot^4 x$. E $\cot^2 x = \csc^2x - 1$.</p>`],
        resp: R`$-\cot x - x + C$`, sol: R`<p>Em cima: $\cos x\cdot\frac{\cos x}{\sin x}\cdot\frac1{\sin x} = \frac{\cos^2x}{\sin^2x}$. Embaixo: $\sin x\cdot\frac{\sin x}{\cos x}\cdot\frac1{\cos x} = \frac{\sin^2x}{\cos^2x}$. A razão é $\cot^4x$, a raiz é $\cot^2 x = \csc^2 x - 1$, e a primitiva é $-\cot x - x$.</p>` }),
      q(17, R`\int_{-\infty}^{\infty}\frac{e^{-x^2}}{1 + e^{2x}}\,dx`, { marcas: ["!"],
        dicas: [R`<p>Troque $x \to -x$ e some com a original.</p>`, R`<p>$\frac1{1 + e^{2x}} + \frac1{1 + e^{-2x}} = 1$.</p>`],
        resp: R`$\dfrac{\sqrt\pi}2$`, sol: R`<p>Chamando a integral de $I$: com $x \to -x$, $I = \int\frac{e^{-x^2}}{1 + e^{-2x}}dx$. Somando: $2I = \int_{-\infty}^\infty e^{-x^2}dx = \sqrt\pi$ (gaussiana ${F.ret("CE02")}). Então $I = \frac{\sqrt\pi}2$.</p>
          <p>É o truque "$f(x) + f(-x)$": o fator $\frac1{1 + e^{2x}}$ pode ser trocado por qualquer $g$ com $g(x) + g(-x) = 1$.</p>` }),
      q(18, R`\int\left(\frac{\sin^2 x}{x^2} - \frac{\sin 2x}{x}\right)dx`, { marcas: ["!"],
        dicas: [R`<p>Nenhuma das duas tem primitiva elementar sozinha. Juntas, parecem uma regra do quociente.</p>`, R`<p>Derive $\frac{\sin^2x}{x}$.</p>`],
        resp: R`$-\dfrac{\sin^2 x}{x} + C$`, sol: R`<p>$\left(\frac{\sin^2x}x\right)' = \frac{2\sin x\cos x}{x} - \frac{\sin^2x}{x^2} = \frac{\sin 2x}x - \frac{\sin^2x}{x^2}$, que é exatamente o integrando com o sinal trocado.</p>` }),
      q(19, R`\int\frac{\log(\log x)\,\log(\log(\log x))}{x\log x}\,dx`, {
        dicas: [R`<p>$u = \ln(\ln x)$: quanto vale $du$?</p>`, R`<p>Sobra $\int u\ln u\,du$, por partes.</p>`],
        resp: R`$\dfrac{(\ln\ln x)^2}{2}\ln\ln\ln x - \dfrac{(\ln\ln x)^2}{4} + C$`, sol: R`<p>$u = \ln\ln x$, $du = \frac{dx}{x\ln x}$. $\int u\ln u\,du = \frac{u^2}2\ln u - \frac{u^2}4$ (partes com $dv = u\,du$).</p>` }),
      q(20, R`\int_0^{\pi/2}\cos^2\!\left(\frac\pi2\cos^2\!\left(\frac\pi2\cos^2x\right)\right)dx`, { marcas: ["!"],
        dicas: [R`<p>Troque $x \to \frac\pi2 - x$: $\cos^2x$ vira $\sin^2x = 1 - \cos^2x$.</p>`, R`<p>Chame $A = \cos^2\left(\frac\pi2\cos^2x\right)$. Depois da troca, essa camada vira $1 - A$. E a de fora?</p>`],
        resp: R`$\dfrac\pi4$`, sol: R`<p>Seja $I(x)$ o integrando. Com $x \to \frac\pi2 - x$: $\cos^2\left(\frac\pi2\sin^2x\right) = \cos^2\left(\frac\pi2 - \frac\pi2\cos^2x\right) = \sin^2\left(\frac\pi2\cos^2x\right) = 1 - A$.</p>
          <p>A camada de fora vira $\cos^2\left(\frac\pi2(1 - A)\right) = \sin^2\left(\frac\pi2A\right)$. Então $I(x) + I\left(\frac\pi2 - x\right) = \cos^2\left(\frac\pi2A\right) + \sin^2\left(\frac\pi2A\right) = 1$, e a integral é metade do intervalo: $\frac\pi4$.</p>` }),
    ];
    return [
      F.secao("sobre", "A prova", R`
        <p>A <b>MIT Integration Bee</b> é a competição de integrais do MIT. A fase classificatória (qualifying round) tem <b>20 integrais em 20 minutos</b>, só a resposta; os melhores vão para as rodadas ao vivo.</p>
        <p>Aqui estão as 20 de 2026. Convenção da prova: $\log$ é o logaritmo natural, e nas indefinidas vale qualquer constante $+C$.</p>
        ${F.caixa("pegadinha", R`<p>As respostas e resoluções são <b>minhas</b> (o arquivo da prova não trazia gabarito). Conferi todas em Python: as definidas por integração numérica e as indefinidas derivando a primitiva em vários pontos.</p>`)}
        <p><b>Como usar:</b> cronômetro de 20 min, escreva só a resposta de cada uma no caderno com ● X /, e só depois abra as resoluções. Muitas saem em 30 segundos com o truque certo: o desafio é <b>enxergar</b> o truque.</p>`),
      F.secao("questoes", "As 20 integrais", lista.join("")),
      F.secao("truques", "Os truques que apareceram", R`
        <ul><li><b>Simetria</b> (1, 17, 20): paridade, e o truque $f(x) + f(a - x)$.</li>
          <li><b>"Numerador = denominador − derivada"</b> (10) e <b>regra do quociente ao contrário</b> (18).</li>
          <li><b>Substituição que salta aos olhos</b> (2, 19), <b>racionalizar</b> (5), <b>arco metade</b> (6).</li>
          <li><b>Reescrever antes de integrar</b>: $2^{\ln x} = x^{\ln 2}$ (7), PG (8), De Moivre (13), trigonometria (16).</li>
          <li><b>Funções "quebradas"</b> (3, 4, 15): piso, teto e parte fracionária viram somas.</li>
          <li><b>Raiz infinita</b> (12): chame de $y$ e resolva a equação.</li></ul>`),
    ].join("");
  },
});
