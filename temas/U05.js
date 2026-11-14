/* U05 · Equações de Maxwell na forma diferencial (com as minhas palavras). Conferido em Python:
   c = 1/√(μ₀ε₀) = 2,998 × 10⁸ m/s; reflexão normal R = ((n−1)/(n+1))²: água 2,0%, vidro 4,0% (amplitude −0,2), diamante 17%;
   luz do Sol 1361 W/m²: E₀ ≈ 1013 V/m, B₀ ≈ 3,38 μT; capacitor de placas circulares (R = 5 cm, I = 2 A): B na borda = 8 μT. */
F.registrar("U05", {
  retoma: ["U02", "C15d", "B12"],
  html(F) {
    const R = String.raw;
    const exemplario = F.exemplo({
      titulo: "Ondas eletromagnéticas nos números",
      casos: [
        { nome: "Reflexão numa interface", gerar: (p) => {
          const n = p ? 1.5 : F.escolha([1.33, 1.5, 1.77, 2.42, 3.5, 4.0]), r = (n - 1) / (n + 1), nomes = { 1.33: "água", 1.5: "vidro", 1.77: "safira", 2.42: "diamante", 3.5: "silício (infravermelho)", 4.0: "germânio (infravermelho)" };
          return { enun: R`<p>Luz incide perpendicularmente do ar em ${nomes[n]} ($n = ${F.n(n)}$). Que fração da amplitude e da intensidade é refletida? A onda refletida sai invertida?</p>`, fig: "",
            passos: [
              R`<p>Das condições de contorno de Maxwell ($E$ e $B$ tangenciais contínuos na interface): $r = \frac{n_1 - n_2}{n_1 + n_2} = \frac{1 - ${F.n(n)}}{1 + ${F.n(n)}} \approx ${F.n(-r, 3)}$.</p>`,
              R`<p>O sinal negativo: a onda refletida volta <b>invertida</b> (defasagem de meio comprimento de onda), como numa corda presa num ponto mais pesado.</p>`,
              R`<p>Intensidade: $R = r^2 \approx ${F.n(100 * r * r, 1)}\%$. ${n > 3 ? "Muito: por isso lentes de silício e germânio para câmeras térmicas precisam de antirreflexo." : n > 2 ? "O diamante brilha tanto também por isso (e pela reflexão interna total)." : "Por isso você vê seu reflexo fraco numa janela."}</p>`,
            ] };
        } },
        { nome: "Onda plana", gerar: (p) => {
          const E0 = p ? 100 : F.escolha([10, 50, 100, 600]), lam = p ? 500 : F.escolha([400, 500, 633, 700]), c = 2.998e8, e0 = 8.854e-12;
          const B0 = E0 / c, f = c / (lam * 1e-9), I = 0.5 * c * e0 * E0 * E0;
          return { enun: R`<p>Uma onda plana de luz ($\lambda = ${lam}$ nm) tem campo elétrico de amplitude $E_0 = ${E0}$ V/m. Ache $B_0$, a frequência, o número de onda e a intensidade.</p>`, fig: "",
            passos: [
              R`<p>Da lei de Faraday aplicada à onda: $B_0 = E_0/c \approx ${F.n(B0 * 1e9, 1)}$ nT. O campo magnético é minúsculo em teslas, mas carrega a mesma energia que o elétrico.</p>`,
              R`<p>$f = c/\lambda \approx ${F.n(f / 1e14, 2)}\times10^{14}$ Hz; $k = 2\pi/\lambda \approx ${F.n((2 * Math.PI) / (lam * 1e-9) / 1e7, 2)}\times10^{7}$ rad/m.</p>`,
              R`<p>Intensidade (média do vetor de Poynting): $I = \frac12c\varepsilon_0E_0^2 \approx ${F.n(I, 2)}$ W/m².</p>`,
            ] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A peça que faltava (e a luz que ela revelou)",
      enun: R`<p>Antes de Maxwell, a lei de Ampère era $\nabla\times\vec B = \mu_0\vec J$. (a) Tome o divergente dos dois lados e mostre que isso força $\nabla\cdot\vec J = 0$. (b) A conservação da carga diz $\nabla\cdot\vec J = -\partial\rho/\partial t$. Num capacitor carregando, $\rho$ muda. Onde está a contradição? (c) Mostre que somar $\mu_0\varepsilon_0\,\partial\vec E/\partial t$ ao lado direito resolve tudo. (d) No vácuo, com o termo novo, tome o rotacional da lei de Faraday e chegue a uma equação de onda. Qual a velocidade?</p>`,
      fig: "",
      dicas: [R`<p>(a) $\nabla\cdot(\nabla\times\vec B) = 0$ sempre (U01).</p>`, R`<p>(d) Use $\nabla\times(\nabla\times\vec E) = \nabla(\nabla\cdot\vec E) - \nabla^2\vec E$, com $\nabla\cdot\vec E = 0$ no vácuo.</p>`],
      sol: R`<p><b>(a)</b> $0 = \nabla\cdot(\nabla\times\vec B) = \mu_0\nabla\cdot\vec J$.</p>
        <p><b>(b)</b> Carregando o capacitor, carga se acumula nas placas: $\partial\rho/\partial t \neq 0$, então $\nabla\cdot\vec J \neq 0$. A Ampère antiga contradiz a conservação da carga. (Na forma integral: o fluxo de corrente por uma superfície que passa entre as placas é zero, mas por uma que corta o fio é $I$. A circulação de $\vec B$ no mesmo laço não pode ter dois valores.)</p>
        <p><b>(c)</b> Divergente de $\mu_0\vec J + \mu_0\varepsilon_0\partial_t\vec E$: $\mu_0\left(\nabla\cdot\vec J + \partial_t(\varepsilon_0\nabla\cdot\vec E)\right) = \mu_0\left(\nabla\cdot\vec J + \partial_t\rho\right) = 0$. ✓ A "corrente de deslocamento" $\varepsilon_0\partial_t\vec E$ continua a corrente onde não há carga andando.</p>
        <p><b>(d)</b> $\nabla\times(\nabla\times\vec E) = -\partial_t(\nabla\times\vec B) = -\mu_0\varepsilon_0\partial_t^2\vec E$. O lado esquerdo é $-\nabla^2\vec E$. Logo $\nabla^2\vec E = \mu_0\varepsilon_0\frac{\partial^2\vec E}{\partial t^2}$: equação de onda com $v = \frac{1}{\sqrt{\mu_0\varepsilon_0}} = \frac{1}{\sqrt{4\pi\times10^{-7}\cdot8{,}854\times10^{-12}}} \approx 2{,}998\times10^8$ m/s.</p>
        <p>Maxwell (1862) calculou esse número com medidas de laboratório de eletricidade e ímãs, e viu que batia com a velocidade da luz medida por Fizeau. Sua conclusão: "dificilmente podemos evitar a inferência de que a luz consiste em ondulações transversais do mesmo meio que é a causa dos fenômenos elétricos e magnéticos". Um termo pequeno, posto por coerência matemática, unificou eletricidade, magnetismo e óptica.</p>`,
    });
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Universitária · eletromagnetismo</div>
        <div class="q">Quatro linhas que explicam toda luz, todo ímã e todo circuito</div>
        <p>Na C15d você viu as equações de Maxwell na forma integral ${F.ret("C15d")}: fluxos por superfícies, circulações em laços. Com os teoremas de Gauss e de Stokes ${F.ret("U02")}, elas viram afirmações sobre cada ponto do espaço, escritas com divergente e rotacional ${F.ret("U01")}. Nessa forma, a onda eletromagnética cai do céu em três linhas.</p></div>`),

      F.secao("equacoes", "As quatro equações", R`
        ${F.formula(R`\nabla\cdot\vec E = \frac{\rho}{\varepsilon_0}\qquad \nabla\cdot\vec B = 0\qquad \nabla\times\vec E = -\frac{\partial\vec B}{\partial t}\qquad \nabla\times\vec B = \mu_0\vec J + \mu_0\varepsilon_0\frac{\partial\vec E}{\partial t}`, "Equações de Maxwell (vácuo, SI)")}
        <table class="tb"><tr><th>equação</th><th>nome</th><th>em palavras</th></tr>
          <tr><td>$\nabla\cdot\vec E = \rho/\varepsilon_0$</td><td>Gauss</td><td>cargas são fontes (e sumidouros) de $\vec E$</td></tr>
          <tr><td>$\nabla\cdot\vec B = 0$</td><td>Gauss magnética</td><td>não existe monopolo magnético: linhas de $\vec B$ não começam nem terminam</td></tr>
          <tr><td>$\nabla\times\vec E = -\partial_t\vec B$</td><td>Faraday</td><td>$\vec B$ variando cria $\vec E$ que "gira" ${F.ret("C15")}</td></tr>
          <tr><td>$\nabla\times\vec B = \mu_0\vec J + \mu_0\varepsilon_0\partial_t\vec E$</td><td>Ampère–Maxwell</td><td>corrente e $\vec E$ variando criam $\vec B$ que gira</td></tr></table>
        <p>Cada uma vem da forma integral pelo mesmo raciocínio: a integral vale para <b>qualquer</b> volume ou superfície, então os integrandos são iguais ponto a ponto. Por exemplo, $\oint\vec E\cdot d\vec l = -\frac{d}{dt}\int\vec B\cdot d\vec A$ vira, por Stokes, $\int(\nabla\times\vec E)\cdot d\vec A = -\int\partial_t\vec B\cdot d\vec A$.</p>
        ${F.caixa("fisico", R`<p><b>Conservação da carga já vem embutida</b>. Tomando o divergente da Ampère–Maxwell e usando Gauss: $\frac{\partial\rho}{\partial t} + \nabla\cdot\vec J = 0$, a <b>equação da continuidade</b>. Ela diz que carga só some de um lugar se sair por corrente. A mesma forma aparece para massa em fluidos e para probabilidade na quântica (U06).</p>`)}`),

      F.secao("onda", "A onda eletromagnética", R`
        ${F.formula(R`\nabla^2\vec E = \mu_0\varepsilon_0\frac{\partial^2\vec E}{\partial t^2}\qquad\qquad c = \frac{1}{\sqrt{\mu_0\varepsilon_0}} \approx 2{,}998\times10^8\ \text{m/s}`, "Equação de onda")}
        <p>No vácuo ($\rho = 0$, $\vec J = 0$), as duas leis de rotacional se alimentam: $\vec E$ variando cria $\vec B$, que variando cria $\vec E$… A conta está no chefão. Uma solução: $\vec E = E_0\cos(kx - \omega t)\,\hat y$, com $\omega = ck$. Faraday dá o $\vec B$ que acompanha: $\vec B = \frac{E_0}{c}\cos(kx - \omega t)\,\hat z$. Os dois são perpendiculares entre si e à direção de propagação (onda transversal), e estão em fase.</p>
        <p><b>Energia</b>: o vetor de Poynting $\vec S = \frac{1}{\mu_0}\vec E\times\vec B$ dá o fluxo de energia (W/m²), apontando para onde a onda vai. A média é $I = \frac12c\varepsilon_0E_0^2$. A luz do Sol na órbita da Terra (1361 W/m²) tem $E_0 \approx 1013$ V/m e $B_0 \approx 3{,}4$ μT.</p>
        ${F.caixa("pegadinha", R`<p><b>"$B = E/c$ é pequeno, então o magnético não importa"</b>: falso. As densidades de energia são iguais: $\frac12\varepsilon_0E^2 = \frac{B^2}{2\mu_0}$ quando $B = E/c$. O número é pequeno só porque o tesla é uma unidade enorme.</p>`)}`),

      F.secao("meios", "Num meio e na fronteira", R`
        <p>Num dielétrico, $\varepsilon_0 \to \varepsilon = \varepsilon_r\varepsilon_0$, e a velocidade cai para $v = c/n$ com $n = \sqrt{\varepsilon_r}$ (para materiais não magnéticos). As <b>condições de contorno</b> (componentes tangenciais de $\vec E$ e $\vec B$ contínuas) dizem quanto reflete: na incidência normal, a amplitude refletida é $r = \frac{n_1 - n_2}{n_1 + n_2}$ e a transmitida, $t = \frac{2n_1}{n_1 + n_2}$. Do ar para o vidro: $r = -0{,}2$, $R = 4\%$ ${F.ret("B12")}.</p>
        <div id="lab-fdtd"></div>
        <p>A simulação resolve as equações de Maxwell de verdade, passo a passo, numa grade: é o método FDTD (Yee, 1966), usado hoje para projetar antenas, celulares e chips fotônicos. Veja o pulso encolher ao entrar no meio (mesma frequência, velocidade menor, comprimento de onda menor) e a parte refletida voltar invertida. Com a parede de metal ($E = 0$), reflete tudo.</p>
        ${F.caixa("olimpiada", R`<p><b>Antirreflexo</b>: uma camada fina de índice $\sqrt{n_\text{vidro}}$ e espessura $\lambda/(4n)$ faz as duas reflexões (ar–camada e camada–vidro) terem a mesma amplitude e saírem defasadas de meio comprimento de onda: elas se cancelam ${F.ret("B14b")}. É por isso que lentes de óculos têm aquele reflexo esverdeado: o cancelamento é perfeito só no meio do espectro.</p>`)}
        ${exemplario}`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Calcule $c$ a partir de $\mu_0 = 4\pi\times10^{-7}$ T·m/A e $\varepsilon_0 = 8{,}854\times10^{-12}$ F/m.</p>`, fig: "", dicas: [R`<p>$c = 1/\sqrt{\mu_0\varepsilon_0}$.</p>`, R`<p>$\mu_0\varepsilon_0 \approx 1{,}113\times10^{-17}$ s²/m².</p>`], resp: R`$\approx 2{,}998\times10^8$ m/s.`, sol: R`<p>Desde 2019, $\mu_0$ não é mais exatamente $4\pi\times10^{-7}$ (é medido), mas a diferença está na 10ª casa.</p>` }),
        F.exercicio({ n: 2, enun: R`<p>Qual das quatro equações seria diferente se existissem monopolos magnéticos? Como ela ficaria?</p>`, fig: "", dicas: [R`<p>Qual equação diz que linhas de $\vec B$ não têm começo?</p>`, R`<p>Por analogia com a de $\vec E$.</p>`], resp: R`$\nabla\cdot\vec B = 0$ viraria $\nabla\cdot\vec B = \mu_0\rho_m$ (e Faraday ganharia uma "corrente magnética").`, sol: R`<p>As equações ficariam simétricas entre $\vec E$ e $\vec B$. Dirac mostrou (1931) que um único monopolo no universo explicaria por que a carga elétrica é quantizada. Ninguém nunca achou um.</p>` }),
        F.exercicio({ n: 3, enun: R`<p>Dado $\vec E = E_0\sin(kx - \omega t)\,\hat y$, use $\nabla\times\vec E = -\partial_t\vec B$ para achar $\vec B$.</p>`, fig: "", dicas: [R`<p>$(\nabla\times\vec E)_z = \partial_x E_y = kE_0\cos(kx - \omega t)$; as outras componentes são zero.</p>`, R`<p>Integre no tempo; use $\omega/k = c$.</p>`], resp: R`$\vec B = \frac{E_0}{c}\sin(kx - \omega t)\,\hat z$.`, sol: R`<p>$\partial_t B_z = -kE_0\cos(\dots)$, então $B_z = \frac{k}{\omega}E_0\sin(\dots)$. Em fase com $\vec E$, perpendicular a ele e a $\hat x$. $\vec E\times\vec B$ aponta em $+\hat x$: a onda vai para lá.</p>` }),
        F.exercicio({ n: 4, enun: R`<p>Um capacitor de placas circulares de raio 5 cm está sendo carregado por uma corrente de 2 A. Qual o campo magnético entre as placas, na borda ($r = 5$ cm)?</p>`, fig: "", dicas: [R`<p>A corrente de deslocamento total entre as placas é igual à corrente no fio.</p>`, R`<p>Ampère–Maxwell: $B\cdot2\pi r = \mu_0 I_d$.</p>`], resp: R`$B = \frac{\mu_0 I}{2\pi R} = 8$ μT.`, sol: R`<p>Igual ao campo a 5 cm de um fio com 2 A. Dentro, a corrente de deslocamento envolvida cai com $r^2$, e $B$ cresce linearmente com $r$, como dentro de um fio grosso.</p>` }),
        F.exercicio({ n: 5, enun: R`<p>Que fração da luz é refletida na incidência normal do ar para a água ($n = 1{,}33$), o vidro ($1{,}5$) e o diamante ($2{,}42$)?</p>`, fig: "", dicas: [R`<p>$R = \left(\frac{n - 1}{n + 1}\right)^2$.</p>`, R`<p>Água: $\left(\frac{0{,}33}{2{,}33}\right)^2$.</p>`], resp: R`$\approx 2{,}0\%$, $4{,}0\%$ e $17\%$.`, sol: R`<p>Em ângulos rasantes, a reflexão cresce muito (equações de Fresnel): por isso um lago reflete o céu quando visto de longe.</p>` }),
        F.exercicio({ n: 6, marcas: ["!"], enun: R`<p>A intensidade da luz solar acima da atmosfera é 1361 W/m². Ache as amplitudes $E_0$ e $B_0$ e a pressão de radiação numa superfície que absorve tudo.</p>`, fig: "", dicas: [R`<p>$I = \frac12c\varepsilon_0E_0^2$.</p>`, R`<p>Pressão de radiação (absorção total): $I/c$.</p>`], resp: R`$E_0 \approx 1013$ V/m, $B_0 \approx 3{,}38$ μT, pressão $\approx 4{,}5$ μPa.`, sol: R`<p>A pressão é minúscula, mas age para sempre: velas solares (como a IKAROS, 2010) usam isso para se mover no espaço sem combustível.</p>` }),
        F.exercicio({ n: 7, marcas: ["!"], enun: R`<p>Mostre que $E(x, t) = E_0\cos(kx - \omega t)$ satisfaz a equação de onda $\partial_x^2 E = \frac{1}{c^2}\partial_t^2 E$ se e somente se $\omega = ck$. E que $f(x - ct)$, para qualquer função $f$, também satisfaz.</p>`, fig: "", dicas: [R`<p>Derive duas vezes em $x$ e duas em $t$.</p>`, R`<p>Para $f(x - ct)$: regra da cadeia, com $u = x - ct$.</p>`], resp: R`$-k^2E = -\frac{\omega^2}{c^2}E \iff \omega = ck$; e $f'' = \frac{c^2}{c^2}f''$ para qualquer $f$.`, sol: R`<p>Qualquer forma de pulso viaja sem deformar no vácuo: é o que a simulação mostra no lado esquerdo. (Num meio com dispersão, $n$ depende da frequência, e o pulso se espalha.)</p>` }),
      ].join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-fdtd"); e.outerHTML = F.lab("Maxwell numa grade (FDTD)", "lab-fdtd"); SIM.fdtd(document.getElementById("lab-fdtd"), F); },
});
