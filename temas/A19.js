/* A19 · Análise Dimensional (módulo F). Conferido em Python:
   ondas em água funda, λ = 10 m: √(gλ) = 9,9 m/s pela análise dimensional, o valor exato √(gλ/2π) = 3,95 m/s;
   comprimento de Planck √(ħG/c³) = 1,616e-35 m; bola de fogo: R = 140 m em t = 25 ms → E ≈ ρR⁵/t² ≈ 1,0e14 J ≈ 25 kt (constante 1);
   20 kt em 25 ms → R ≈ 134 m; Kepler para a Terra: 2π√(a³/GM) = 365,2 dias. */
F.registrar("A19", {
  retoma: ["F05", "FE01"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Descobrir a fórmula pelas dimensões",
      casos: [
        { nome: "Período de um sistema", gerar: (p) => {
          const L = [["um pêndulo", "comprimento $L$, gravidade $g$ e massa $m$", R`[L] = \text{L},\ [g] = \text{L T}^{-2},\ [m] = \text{M}`, R`\text{M: } c = 0;\quad \text{L: } a + b = 0;\quad \text{T: } -2b = 1`, R`T = C\sqrt{L/g}`, "A massa não entra. O valor certo de C é 2π (sai da equação de movimento)."], ["um sistema massa–mola", "massa $m$ e constante $k$", R`[m] = \text{M},\ [k] = \text{M T}^{-2}`, R`\text{M: } a + b = 0;\quad \text{T: } -2b = 1`, R`T = C\sqrt{m/k}`, "C = 2π de novo. Note que g não entra: a mola na vertical tem o mesmo período."], ["uma estrela pulsando", "densidade $\\rho$ e a constante $G$", R`[\rho] = \text{M L}^{-3},\ [G] = \text{M}^{-1}\text{L}^3\text{T}^{-2}`, R`\text{M: } a - b = 0;\quad \text{L: } -3a + 3b = 0;\quad \text{T: } -2b = 1`, R`T = \frac{C}{\sqrt{G\rho}}`, "Estrelas mais densas pulsam mais rápido. O mesmo $1/\\sqrt{G\\rho}$ dá o tempo de queda livre de uma nuvem de gás."]];
          const [sis, vars, dims, eqs, res, obs] = p ? L[0] : F.escolha(L);
          return { enun: R`<p>De que pode depender o período de ${sis}? Suponha que dependa de ${vars}, e ache a fórmula.</p>`, fig: "",
            passos: [R`<p>Dimensões: $${dims}$. Procure $T \propto$ produto de potências, com expoentes $a, b, c$.</p>`, R`<p>Iguale os expoentes de M, L e T dos dois lados ($T$ tem dimensão $\text{T}$): $${eqs}$.</p>`, R`<p>$${res}$. ${obs}</p>`] };
        } },
        { nome: "Conferir se a equação está certa", gerar: (p) => {
          const L = [[R`x = v_0t + \tfrac12at^2`, "certa", "os três termos têm dimensão L"], [R`v = at^2`, "errada", "$at^2$ tem dimensão L, não L/T"], [R`E = \tfrac12mv^2 + mgh`, "certa", "os dois termos têm dimensão M L² T⁻²"], [R`T = 2\pi\sqrt{g/L}`, "errada", "$\\sqrt{g/L}$ tem dimensão T⁻¹: é uma frequência, não um período"], [R`v = \sqrt{T/\mu}`, "certa", "tração/densidade linear = (M L T⁻²)/(M L⁻¹) = L² T⁻²"]];
          const [eq, ok, pq] = p ? L[1] : F.escolha(L);
          return { enun: R`<p>A equação $${eq}$ pode estar certa?</p>`, fig: "",
            passos: [R`<p>Toda equação física precisa ser <b>homogênea</b>: os dois lados e todos os termos somados com a mesma dimensão.</p>`, R`<p>Aqui: ${pq}.</p>`, R`<p>Ela é dimensionalmente <b>${ok}</b>.${ok === "certa" ? " (Isso não prova que está certa: constantes sem dimensão, como o ½, escapam do teste.)" : ""}</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O que a análise dimensional não consegue dizer",
      enun: R`<p>(a) O período de um pêndulo pode depender de $L$, $g$, $m$ e também da amplitude $\theta_0$ (que não tem dimensão). Mostre que a forma mais geral é $T = \sqrt{L/g}\,f(\theta_0)$, com $f$ uma função desconhecida. Quanto vale $f(0)$? E qual é o começo da série de $f$ (use ${F.ret("F05")})? (b) A força de arrasto numa esfera depende de $\rho$, $v$, do diâmetro $D$ e da viscosidade $\mu$. Mostre que só sobram dois grupos sem dimensão e que $F = \rho v^2D^2\,g(\text{Re})$, com $\text{Re} = \rho vD/\mu$. (c) Para Re muito pequeno, o arrasto não pode depender de $\rho$. Que forma $g$ tem que ter, e que lei sai? (d) Teorema Π de Buckingham: com $n$ grandezas e $k$ dimensões independentes, quantos grupos adimensionais sobram?</p>`,
      fig: "",
      dicas: [R`<p>(a) Qualquer grupo adimensional pode entrar numa função arbitrária. (b) Faça $F/(\rho v^2D^2)$ e $\rho vD/\mu$ e confira que não têm dimensão.</p>`, R`<p>(c) $\rho$ some de $F = \rho v^2D^2g(\rho vD/\mu)$ só se $g(\text{Re}) = C/\text{Re}$.</p>`],
      sol: R`<p><b>(a)</b> Com $\theta_0$ adimensional, a análise dimensional não proíbe nenhuma função dele: $T = \sqrt{L/g}\,f(\theta_0)$. A equação de movimento dá $f(0) = 2\pi$ e $f(\theta_0) \approx 2\pi\left(1 + \frac{\theta_0^2}{16}\right)$. A análise dimensional dá a "forma"; a física completa dá a função.</p>
        <p><b>(b)</b> 5 grandezas ($F, \rho, v, D, \mu$) e 3 dimensões (M, L, T): sobram $5 - 3 = 2$ grupos, $\frac{F}{\rho v^2D^2}$ e $\text{Re}$. Então um é função do outro.</p>
        <p><b>(c)</b> $F = \rho v^2D^2\cdot\frac{C\mu}{\rho vD} = C\mu vD$: a lei de Stokes ($C = 3\pi$ com o diâmetro, ou $6\pi\mu Rv$ com o raio) ${F.ret("N04")}. Para Re grande, $g$ fica quase constante e $F \propto \rho v^2D^2$ ${F.ret("N07")}.</p>
        <p><b>(d)</b> $n - k$ grupos. No pêndulo: $T, L, g, m, \theta_0$ são 5 grandezas, 3 dimensões, 2 grupos ($T\sqrt{g/L}$ e $\theta_0$). A massa não consegue formar grupo nenhum com as outras (é a única com M), então não entra.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Fundamentos · análise dimensional</div>
        <div class="q">Como estimar a energia de uma bomba atômica com uma foto e uma régua?</div>
        <p>Em 1950, G. I. Taylor fez isso com fotos públicas do teste Trinity: o raio da bola de fogo só pode depender da energia, da densidade do ar e do tempo, e só existe <b>um</b> jeito de combinar essas três grandezas para dar um comprimento. Ele chegou a cerca de 17 quilotons; o valor oficial, que era segredo, ficou em torno de 20. Isso é análise dimensional.</p></div>`),

      F.secao("dimensoes", "Dimensões e homogeneidade", R`
        <p>Toda grandeza da mecânica tem dimensão $\text{M}^a\text{L}^b\text{T}^c$ (massa, comprimento, tempo; na eletricidade entra a corrente, I). Exemplos: $[v] = \text{L T}^{-1}$, $[F] = \text{M L T}^{-2}$, $[E] = \text{M L}^2\text{T}^{-2}$, $[G] = \text{M}^{-1}\text{L}^3\text{T}^{-2}$.</p>
        ${F.formula(R`[\text{lado esquerdo}] = [\text{lado direito}] = [\text{cada termo somado}],\qquad \text{argumentos de } \sin,\ e^x,\ \ln \text{ sem dimensão}`, "Princípio da homogeneidade")}
        <p>É o teste mais rápido de uma conta: se no fim as dimensões não batem, tem erro. Ele não pega constantes sem dimensão (um $\frac12$ ou um $2\pi$ esquecido), mas pega o resto.</p>`),

      F.secao("metodo", "Descobrindo fórmulas", R`
        <p>Se uma grandeza depende de outras, escreva o produto de potências e iguale os expoentes de M, L e T: sai um sistema linear. Com 3 incógnitas e 3 equações, a resposta (a menos de uma constante) é única. Teste no laboratório.</p>
        <div id="lab-dim"></div>
        ${F.formula(R`R = C\left(\frac{Et^2}{\rho}\right)^{1/5}\quad\Longrightarrow\quad E \approx \frac{\rho R^5}{t^2}`, "A bola de fogo de Taylor (C ≈ 1)")}
        <p>Com $R \approx 140$ m em $t = 25$ ms e $\rho = 1{,}2$ kg/m³: $E \approx \frac{1{,}2\cdot140^5}{0{,}025^2} \approx 10^{14}$ J, uns 25 quilotons com $C = 1$. A potência 5 do raio faz um erro pequeno na foto virar um erro grande na energia, e mesmo assim a ordem de grandeza sai certa.</p>
        ${F.caixa("olimpiada", R`<p><b>Olimpíadas russas adoram isso</b>: "estime a velocidade das ondas no mar", "de que depende a frequência de uma gota vibrando" (tensão superficial $\sigma$, densidade, raio: $f \sim \sqrt{\sigma/(\rho r^3)}$). Liste de que a resposta pode depender, monte o sistema, e confira o resultado com o bom senso (aumentar $\sigma$ deveria aumentar a frequência? sim).</p>`)}
        ${F.caixa("ideia", R`<p><b>Unidades de Planck</b>: combinando $\hbar$, $G$ e $c$ sai um comprimento, $\ell_P = \sqrt{\hbar G/c^3} \approx 1{,}6\times10^{-35}$ m. É a escala em que se espera que a gravidade quântica importe. Ninguém sabe a física de lá, mas a análise dimensional diz onde procurar.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Ache a dimensão da constante da gravitação $G$ a partir de $F = \frac{Gm_1m_2}{r^2}$.</p>`, fig: "", dicas: [R`<p>$[G] = \frac{[F][r]^2}{[m]^2}$.</p>`], resp: R`$\text{M}^{-1}\text{L}^3\text{T}^{-2}$ (m³/(kg·s²)).`, sol: R`<p>$\frac{\text{M L T}^{-2}\cdot\text{L}^2}{\text{M}^2}$.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Qual destas pode estar certa: $v = at^2$, $v^2 = v_0^2 + 2ax$, $x = \frac{v^2}{a^2}$?</p>`, fig: "", dicas: [R`<p>Confira as dimensões de cada termo.</p>`], resp: R`Só $v^2 = v_0^2 + 2ax$.`, sol: R`<p>$at^2$ é L (não L/T); $v^2/a^2$ é T² (não L).</p>` }),
        F.exercicio({ n: 3, enun: R`<p>A velocidade de ondas em água funda só depende de $g$ e do comprimento de onda $\lambda$. Ache a fórmula e estime para $\lambda = 10$ m.</p>`, fig: "", dicas: [R`<p>$v \propto g^a\lambda^b$: L: $a + b = 1$; T: $-2a = -1$.</p>`], resp: R`$v \sim \sqrt{g\lambda} \approx 10$ m/s.`, sol: R`<p>A fórmula exata é $v = \sqrt{\frac{g\lambda}{2\pi}} \approx 3{,}9$ m/s: a constante $\frac1{\sqrt{2\pi}} \approx 0{,}4$ não sai da análise dimensional. Ondas mais longas são mais rápidas: é por isso que as ondas grandes de uma tempestade chegam à praia antes das pequenas.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Combine $\hbar$ ($\text{M L}^2\text{T}^{-1}$), $G$ e $c$ para formar um comprimento.</p>`, fig: "", dicas: [R`<p>$\hbar^aG^bc^d$: M: $a - b = 0$; L: $2a + 3b + d = 1$; T: $-a - 2b - d = 0$.</p>`], resp: R`$\ell_P = \sqrt{\hbar G/c^3} \approx 1{,}6\times10^{-35}$ m.`, sol: R`<p>$a = b = \frac12$, $d = -\frac32$. Confira no laboratório ("comprimento de Planck").</p>` }),
        F.exercicio({ n: 5, enun: R`<p>O período de um planeta só pode depender do raio da órbita $a$, de $G$ e da massa do Sol $M$. Ache a dependência e confira com a Terra ($a = 1{,}5\times10^{11}$ m, $M = 2\times10^{30}$ kg), sabendo que a constante é $2\pi$.</p>`, fig: "", dicas: [R`<p>$G$ e $M$ só aparecem juntos (como $GM$, de dimensão L³T⁻²).</p>`], resp: R`$T = 2\pi\sqrt{\frac{a^3}{GM}} \approx 365$ dias.`, sol: R`<p>É a 3ª lei de Kepler, $T^2 \propto a^3$, saindo só das dimensões ${F.ret("A16")}.</p>` }),
        F.exercicio({ n: 6, enun: R`<p>Em velocidade alta, o arrasto do ar num carro é $F \propto \rho^av^bA^c$ ($A$ = área frontal). Ache os expoentes. Dobrando a velocidade, o que acontece com a força e com a potência gasta contra o ar?</p>`, fig: "", dicas: [R`<p>M: $a = 1$; L: $-3a + b + 2c = 1$; T: $-b = -2$.</p>`], resp: R`$F \propto \rho v^2A$; a força ×4, a potência ($Fv$) ×8.`, sol: R`<p>Por isso andar a 120 km/h gasta bem mais combustível que a 80 km/h.</p>` }),
        F.exercicio({ n: 7, marcas: ["!", "RU"], enun: R`<p>A bola de fogo do teste Trinity tinha raio de cerca de 140 m em $t = 25$ ms. Estime a energia (ar: $\rho = 1{,}2$ kg/m³; 1 quiloton $= 4{,}2\times10^{12}$ J). Se o raio medido estivesse 10% errado, quanto erraria a energia?</p>`, fig: "", dicas: [R`<p>$E \approx \rho R^5/t^2$.</p>`, R`<p>$E \propto R^5$: $1{,}1^5$.</p>`], resp: R`$E \approx 1\times10^{14}$ J $\approx 25$ kt; erro de cerca de 60%.`, sol: R`<p>$\frac{1{,}2\cdot5{,}4\times10^{10}}{6{,}25\times10^{-4}} \approx 1{,}0\times10^{14}$ J. Com $R$ 10% maior, $1{,}1^5 \approx 1{,}61$: 61% a mais. Mesmo assim, a ordem de grandeza (dezenas de quilotons) está certa.</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-dim"); e.outerHTML = F.lab("Descobridor de fórmulas", "lab-dim"); SIM.dimensional(document.getElementById("lab-dim"), F); },
});
