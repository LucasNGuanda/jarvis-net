/* C15d · Equações de Maxwell e Ondas Eletromagnéticas
   Escrito do zero, com o material "Equações Fundamentais da Física" (parte 3) como referência. Contas conferidas em Python (c06.py). */
F.registrar("C15d", {
  retoma: ["C03b", "C14", "C15", "B16"],
  html(F) {
    const R = String.raw;
    const figDesl = D.svg(460, 220, `<line x1="20" y1="110" x2="170" y2="110" style="stroke:#c98a4a;stroke-width:4"/><line x1="290" y1="110" x2="440" y2="110" style="stroke:#c98a4a;stroke-width:4"/><rect x="170" y="40" width="10" height="140" style="fill:#ef5b5b"/><rect x="280" y="40" width="10" height="140" style="fill:#4f8dff"/>${[60, 90, 130, 160].map((y) => D.seta(184, y, 276, y, "var(--ink2)", 1.3)).join("")}${D.seta(60, 100, 120, 100, "var(--ink)", 2)}${D.txt(90, 92, "i", "txm")}<ellipse cx="90" cy="110" rx="12" ry="40" style="fill:none;stroke:var(--mod);stroke-width:2;stroke-dasharray:5 4"/><ellipse cx="230" cy="110" rx="12" ry="40" style="fill:none;stroke:var(--warn);stroke-width:2;stroke-dasharray:5 4"/>${D.txt(230, 204, "aqui não passa carga, mas E varia", "tx2")}${D.txt(90, 168, "B em volta do fio", "tx2")}`, "corrente de deslocamento");
    const figEspectro = D.svg(560, 110, (() => { const f = [["rádio", 0], ["micro-ondas", 1], ["infravermelho", 2], ["visível", 3], ["UV", 4], ["raios X", 5], ["gama", 6]]; let s = `<defs><linearGradient id="vis" x1="0" x2="1"><stop offset="0" stop-color="#ff3b30"/><stop offset=".25" stop-color="#ffcc00"/><stop offset=".5" stop-color="#34c759"/><stop offset=".75" stop-color="#007aff"/><stop offset="1" stop-color="#af52de"/></linearGradient></defs>`; f.forEach(([n, k]) => { s += `<rect x="${20 + 74 * k}" y="30" width="72" height="30" rx="4" style="fill:${k === 3 ? "url(#vis)" : "color-mix(in srgb,var(--mod) " + (15 + 8 * k) + "%,transparent)"}"/>${D.txt(56 + 74 * k, 82, n, "tx2")}`; }); return s + D.txt(20, 20, "λ grande, f pequena", "tx2", "start") + D.txt(540, 20, "λ pequena, f grande", "tx2", "end") + D.txt(280, 102, "visível: 400–700 nm", "tx2"); })(), "espectro");

    const exemplario = F.exemplo({ casos: [
      { nome: "Intensidade e campos", gerar: (p) => {
        const I = p ? 1361 : F.escolha([100, 500, 1361, 5000]), E0 = Math.sqrt(2 * 4e-7 * Math.PI * 2.998e8 * I);
        return { enun: R`<p>Uma onda plana tem intensidade $${I}$ W/m². Quanto valem as amplitudes dos campos e a pressão de radiação (absorvida)?</p>`, fig: "",
          passos: [R`<p>$I = \bar S = \frac{E_0B_0}{2\mu_0} = \frac{E_0^2}{2\mu_0c}$.</p>`, R`$$E_0 = \sqrt{2\mu_0cI} = ${F.m(E0, 1)}\ \text{V/m},\qquad B_0 = \frac{E_0}{c} = ${F.sigM(E0 / 2.998e8, 3)}\ \text{T}$$`, R`<p>Pressão: $p = I/c = ${F.sigM(I / 2.998e8, 3)}$ Pa (o dobro, se refletir).</p>`] }; } },
      { nome: "Corrente de deslocamento", gerar: (p) => {
        const Rr = p ? 5 : F.escolha([2, 5, 10]), dE = p ? 1 : F.escolha([0.5, 1, 2, 5]), id = 8.854e-12 * Math.PI * (Rr / 100) ** 2 * dE * 1e13, B = (4e-7 * Math.PI * id) / (2 * Math.PI * (Rr / 100));
        return { enun: R`<p>Entre placas circulares de raio $${Rr}$ cm, o campo cresce a $${F.m(dE, 1)}\times10^{13}$ V/(m·s). Corrente de deslocamento e campo magnético na borda?</p>`, fig: figDesl,
          passos: [R`<p>$i_d = \varepsilon_0\frac{d\Phi_E}{dt} = \varepsilon_0A\frac{dE}{dt} = ${F.m(id, 3)}$ A.</p>`, R`<p>Ampère–Maxwell num círculo na borda: $B\cdot2\pi R = \mu_0i_d$, $B = ${F.sigM(B, 3)}$ T.</p>`, R`<p>Pequeno: por isso Maxwell "adivinhou" esse termo (1865) antes de alguém medi-lo. A prova veio com as ondas de Hertz (1887).</p>`] }; } },
    ] });

    const X = F.exercicio;
    const exsF = [
      X({ n: 1, enun: R`<p>Calcule $1/\sqrt{\mu_0\varepsilon_0}$ com $\mu_0 = 4\pi\times10^{-7}$ e $\varepsilon_0 = 8{,}854\times10^{-12}$ (SI).</p>`, fig: "", dicas: [R`<p>$\mu_0\varepsilon_0 \approx 1{,}11\times10^{-17}$.</p>`, R`<p>Raiz e inverso.</p>`], resp: R`$\approx 3{,}00\times10^8$ m/s.`, sol: R`<p>$2{,}998\times10^8$ m/s: a velocidade da luz, saída de uma medida com capacitores e outra com ímãs. Foi o "momento eureca" de Maxwell.</p>` }),
      X({ n: 2, enun: R`<p>Uma onda tem $E_0 = 300$ V/m. Quanto vale $B_0$ e a intensidade?</p>`, fig: "", dicas: [R`<p>$B_0 = E_0/c$.</p>`, R`<p>$I = E_0^2/(2\mu_0c)$.</p>`], resp: R`$1{,}0$ µT; $\approx 1{,}2\times10^2$ W/m².`, sol: R`<p>$B_0 = 10^{-6}$ T; $I \approx 119$ W/m².</p>` }),
      X({ n: 3, marcas: ["★"], enun: R`<p>A luz do Sol chega à Terra com $1361$ W/m². Amplitude do campo elétrico?</p>`, fig: "", dicas: [R`<p>$E_0 = \sqrt{2\mu_0cI}$.</p>`, R`<p>$\sqrt{2\times4\pi\times10^{-7}\times3\times10^8\times1361}$.</p>`], resp: R`$\approx 1{,}0\times10^3$ V/m.`, sol: R`<p>$E_0 \approx 1013$ V/m: da ordem do campo perto de um balão atritado.</p>` }),
      X({ n: 4, enun: R`<p>Pressão da luz do Sol numa superfície (a) que absorve tudo; (b) que reflete tudo?</p>`, fig: "", dicas: [R`<p>$p = I/c$ absorvendo.</p>`, R`<p>Refletindo, o momento inverte: o dobro.</p>`], resp: R`(a) $\approx 4{,}5$ µPa; (b) $\approx 9{,}1$ µPa.`, sol: R`<p>Minúscula: 1361 W/m² empurram com ~$5\times10^{-6}$ N por m².</p>` }),
      X({ n: 5, enun: R`<p>Um laser de $1{,}0$ mW tem feixe de $1{,}0$ mm de diâmetro. Intensidade? Compare com o Sol.</p>`, fig: "", dicas: [R`<p>$I = P/A$.</p>`, R`<p>$A = \pi(0{,}5\times10^{-3})^2$.</p>`], resp: R`$\approx 1{,}3\times10^3$ W/m², igual ao Sol.`, sol: R`<p>$I \approx 1273$ W/m². Por isso olhar um laser "fraquinho" é como olhar o Sol de frente (pior: o olho foca ele num ponto).</p>` }),
    ];
    const exsM = [
      X({ n: 6, marcas: ["★", "!"], enun: R`<p>Entre placas circulares de raio $5{,}0$ cm, o campo elétrico cresce a $1{,}0\times10^{13}$ V/(m·s). Ache a corrente de deslocamento e o campo magnético na borda.</p>`, fig: figDesl, dicas: [R`<p>$i_d = \varepsilon_0A\,dE/dt$.</p>`, R`<p>$B = \mu_0i_d/(2\pi R)$.</p>`], resp: R`$i_d \approx 0{,}70$ A; $B \approx 2{,}8$ µT.`, sol: R`<p>$i_d = 8{,}854\times10^{-12}\times7{,}85\times10^{-3}\times10^{13} \approx 0{,}695$ A; $B = 2\times10^{-7}\times0{,}695/0{,}05 \approx 2{,}8\times10^{-6}$ T.</p>` }),
      X({ n: 7, marcas: ["!", "RU"], enun: R`<p><b>Vela solar.</b> Que área de vela perfeitamente refletora dá aceleração de $1{,}0$ mm/s² a uma nave de $100$ kg, perto da Terra?</p>`, fig: "", dicas: [R`<p>$F = 2IA/c = ma$.</p>`, R`<p>$A = mac/(2I)$.</p>`], resp: R`$\approx 1{,}1\times10^4$ m², um quadrado de ~105 m.`, sol: R`<p>$A = \frac{100\times10^{-3}\times3\times10^8}{2\times1361} \approx 1{,}1\times10^4$ m². Pouca aceleração, mas de graça e para sempre: em um ano, 30 km/s a mais. (IKAROS, 2010.)</p>` }),
      X({ n: 8, marcas: ["!!"], enun: R`<p>Um fio de raio $a = 1{,}0$ mm e comprimento $1{,}0$ m tem $12$ V entre as pontas e conduz $2{,}0$ A. Calcule o vetor de Poynting na superfície e mostre que o fluxo dele pela superfície lateral é exatamente $Ri^2$. Para onde ele aponta?</p>`, fig: "", dicas: [R`<p>$E = V/L$ ao longo do fio; $B = \mu_0i/(2\pi a)$ tangente.</p>`, R`<p>$S = EB/\mu_0$, radial. Fluxo $= S\cdot2\pi aL$.</p>`], resp: R`$S \approx 3{,}8\times10^3$ W/m², para <b>dentro</b> do fio; fluxo $= Vi = 24$ W.`, sol: R`<p>$S = \frac{V}{L}\cdot\frac{i}{2\pi a} = \frac{12\times2}{2\pi\times10^{-3}} \approx 3820$ W/m²; $\times2\pi aL = Vi = 24$ W $= Ri^2$ ✓. Surpresa: a energia que esquenta o fio <b>não</b> vem "por dentro" com os elétrons; ela entra pelo lado, pelo campo em volta.</p>` }),
    ];

    const chefao = F.chefao({ titulo: "Por onde entra a energia do capacitor", fig: figDesl,
      enun: R`<p>Um capacitor de placas circulares de raio $R = 10$ cm, separadas por $d = 1{,}0$ mm, é carregado com corrente constante $i = 1{,}0$ A. Considere o instante em que $V = 100$ V. Despreze efeitos de borda.</p>
        <ol type="a"><li>Calcule $E$ entre as placas e $dE/dt$.</li><li>Usando Ampère–Maxwell, ache $B$ na borda do capacitor (a $R$ do eixo).</li><li>Calcule o vetor de Poynting na superfície cilíndrica que fecha o espaço entre as placas. Para onde ele aponta?</li><li>Mostre que o fluxo de $\vec S$ por essa superfície é exatamente $dU/dt$, a taxa com que a energia do capacitor aumenta.</li></ol>`,
      dicas: [R`<p>(a) $E = V/d$; $\frac{dE}{dt} = \frac{i}{\varepsilon_0\pi R^2}$. (b) A corrente de deslocamento total entre as placas é $i$.</p>`, R`<p>(d) $U = \frac12\varepsilon_0E^2\cdot\pi R^2d$; derive. Compare com $S\cdot2\pi Rd$.</p>`],
      sol: R`<p><b>(a)</b> $E = 10^5$ V/m; $\frac{dE}{dt} = \frac{1}{8{,}854\times10^{-12}\times0{,}0314} \approx 3{,}6\times10^{12}$ V/(m·s).</p>
        <p><b>(b)</b> $B\cdot2\pi R = \mu_0i_d = \mu_0i$: $B = \frac{\mu_0i}{2\pi R} = 2{,}0$ µT, tangente.</p>
        <p><b>(c)</b> $S = \frac{EB}{\mu_0} = \frac{10^5\times2\times10^{-6}}{4\pi\times10^{-7}} \approx 1{,}6\times10^5$ W/m², apontando radialmente para <b>dentro</b>.</p>
        <p><b>(d)</b> Fluxo $= S\cdot2\pi Rd = \frac{Ei}{2\pi R}\cdot2\pi Rd = Eid = Vi = 100$ W. E $\frac{dU}{dt} = \varepsilon_0E\frac{dE}{dt}\pi R^2d = Ei\,d = Vi$ ✓. A energia não "desce pelos fios para dentro das placas": ela entra pela lateral, carregada pelo campo. É o teorema de Poynting: conservação local da energia eletromagnética.</p>` });

    return [
      F.secao("abertura", "Pergunta de abertura", R`<div class="abertura"><div class="det">Antes de tudo</div><div class="q">O que é a luz? E como uma antena "joga" energia no espaço vazio?</div></div>`),
      F.secao("laboratorio", "Laboratório: a onda eletromagnética", R`<p>Campos E e B oscilando juntos, cada um "gerando" o outro. Troque para polarização circular.</p>
        ${F.chute({ q: "se a amplitude de E dobra, a intensidade da onda:", ops: ["dobra", "quadruplica", "não muda", "cai pela metade"], certa: 1, exp: R`<p>$I \propto E_0^2$: <b>quadruplica</b>. Energia de onda sempre vai com o quadrado da amplitude ${F.ret("B16")}.</p>` })}
        <div id="lab-onda"></div>`),
      F.secao("ideia", "A ideia física", R`<p>Juntando tudo: cargas criam $\vec E$ (Gauss); não há cargas magnéticas; $\vec B$ variando cria $\vec E$ circulando (Faraday); correntes criam $\vec B$ circulando (Ampère). Maxwell percebeu que faltava uma simetria: $\vec E$ <b>variando</b> também cria $\vec B$. Com essa peça, as equações têm soluções que se sustentam sozinhas no vácuo: $\vec E$ variando gera $\vec B$, que variando gera $\vec E$... uma <b>onda</b>, com velocidade $1/\sqrt{\mu_0\varepsilon_0}$. Era a velocidade da luz medida por Fizeau. A luz é uma onda eletromagnética.</p>
        ${F.fig(figEspectro)}`),
      F.secao("teoria", "Teoria completa", R`
        <h3>1. A peça que faltava: corrente de deslocamento</h3>
        ${F.fig(figDesl)}
        <p>Aplique Ampère a um capacitor carregando: um círculo em volta do fio engloba corrente $i$; mas escolha uma superfície com a mesma borda que passa <b>entre as placas</b>: lá não passa carga nenhuma. Ampère dá dois valores diferentes para a mesma integral: contradição. Maxwell: entre as placas, $\Phi_E$ varia, e
        $\varepsilon_0\frac{d\Phi_E}{dt} = \varepsilon_0A\frac{d}{dt}\frac{q}{\varepsilon_0A} = \frac{dq}{dt} = i$. Exatamente a corrente que faltava.</p>
        ${F.formula(R`\oint\vec B\cdot d\vec\ell = \mu_0\left(i + \varepsilon_0\frac{d\Phi_E}{dt}\right)`, "Ampère–Maxwell")}
        <h3>2. As quatro equações de Maxwell</h3>
        <table class="tb"><tr><th>Nome</th><th>Integral</th><th>Diferencial</th><th>Diz que</th></tr>
          <tr><td>Gauss</td><td>$\oint\vec E\cdot d\vec A = q/\varepsilon_0$</td><td>$\nabla\cdot\vec E = \rho/\varepsilon_0$</td><td>cargas criam E ${F.ret("C03b")}</td></tr>
          <tr><td>Gauss magnético</td><td>$\oint\vec B\cdot d\vec A = 0$</td><td>$\nabla\cdot\vec B = 0$</td><td>não há monopolo ${F.ret("C12")}</td></tr>
          <tr><td>Faraday</td><td>$\oint\vec E\cdot d\vec\ell = -\frac{d\Phi_B}{dt}$</td><td>$\nabla\times\vec E = -\frac{\partial\vec B}{\partial t}$</td><td>B variando cria E ${F.ret("C15")}</td></tr>
          <tr><td>Ampère–Maxwell</td><td>$\oint\vec B\cdot d\vec\ell = \mu_0i + \mu_0\varepsilon_0\frac{d\Phi_E}{dt}$</td><td>$\nabla\times\vec B = \mu_0\vec J + \mu_0\varepsilon_0\frac{\partial\vec E}{\partial t}$</td><td>correntes e E variando criam B ${F.ret("C14")}</td></tr></table>
        <p>Com a força de Lorentz $\vec F = q(\vec E + \vec v\times\vec B)$, isso é <b>todo</b> o eletromagnetismo clássico: de motores a arco-íris.</p>
        <h3>3. A equação de onda ∫</h3>
        ${F.demo("ondas no vácuo", R`<p>(i) No vácuo ($\rho = 0$, $\vec J = 0$), tome o rotacional de Faraday: $\nabla\times(\nabla\times\vec E) = -\frac{\partial}{\partial t}(\nabla\times\vec B) = -\mu_0\varepsilon_0\frac{\partial^2\vec E}{\partial t^2}$.</p>
          <p>(ii) Identidade vetorial: $\nabla\times(\nabla\times\vec E) = \nabla(\nabla\cdot\vec E) - \nabla^2\vec E = -\nabla^2\vec E$ (Gauss no vácuo) ${F.ret("U01")}.</p>
          ${F.formula(R`\nabla^2\vec E = \mu_0\varepsilon_0\frac{\partial^2\vec E}{\partial t^2}\qquad\Rightarrow\qquad c = \frac{1}{\sqrt{\mu_0\varepsilon_0}} = 2{,}998\times10^8\ \text{m/s}`)}
          <p>(iii) É a equação de onda ${F.ret("B16")}, com velocidade $c$. O mesmo vale para $\vec B$.</p>`)}
        <h3>4. A onda plana</h3>
        ${F.formula(R`\vec E = E_0\sin(kx - \omega t)\,\hat y,\qquad \vec B = B_0\sin(kx - \omega t)\,\hat z,\qquad E_0 = cB_0,\qquad \omega = ck`)}
        <p>Transversal: $\vec E\perp\vec B\perp$ direção de propagação. Em fase. A direção do campo elétrico define a <b>polarização</b>.</p>
        <h3>5. Energia e momento: o vetor de Poynting</h3>
        ${F.formula(R`\vec S = \frac{1}{\mu_0}\vec E\times\vec B,\qquad I = \bar S = \frac{E_0^2}{2\mu_0c},\qquad p_\text{rad} = \frac Ic\ (\text{absorvida}),\ \frac{2I}{c}\ (\text{refletida})`, "Poynting")}
        <p>Densidades: $u_E = \frac{\varepsilon_0E^2}{2}$ e $u_B = \frac{B^2}{2\mu_0}$ são <b>iguais</b> numa onda (use $B = E/c$). $\vec S$ dá a energia que atravessa cada m² por segundo, na direção de propagação.</p>
        ${F.caixa("fisico", R`<p>O vetor de Poynting também mostra por onde a energia viaja em circuitos: num fio com corrente, ela entra pela superfície lateral (exercício 8); num capacitor carregando, pela borda (chefão).</p>`)}
        ${F.caixa("ponte", R`<p>As equações de Maxwell não mudam de forma numa transformação de Lorentz, mas mudam numa de Galileu. Foi resolvendo esse conflito que Einstein criou a relatividade especial ${F.ret("C18")}. E, quantizando o campo, aparecem os fótons ${F.ret("C17")}: o topo dessa história é a eletrodinâmica quântica (QED).</p>`)}
        ${F.caixa("olimpiada", R`<p>Ordens de grandeza para ter na cabeça: Sol na Terra, 1361 W/m², $E_0 \approx 1$ kV/m, pressão ~5 µPa; laser pointer de 1 mW, ~kW/m². E: $E/B = c$ sempre, numa onda no vácuo.</p>`)}`),
      F.secao("exemplos", "Exemplos passo a passo", exemplario),
      F.secao("resumo", "Resumo", R`<div class="resumo"><div class="r"><b>Deslocamento</b>$i_d = \varepsilon_0\,d\Phi_E/dt$</div><div class="r"><b>Maxwell</b>4 equações + Lorentz = todo o EM clássico</div><div class="r"><b>Velocidade</b>$c = 1/\sqrt{\mu_0\varepsilon_0}$</div><div class="r"><b>Onda</b>$E_0 = cB_0$, transversal</div><div class="r"><b>Poynting</b>$\vec S = \vec E\times\vec B/\mu_0$; $I = E_0^2/2\mu_0c$</div><div class="r"><b>Pressão</b>$I/c$ (absorve), $2I/c$ (reflete)</div></div>`),
      F.secao("exercicios", "Exercícios", `<div class="exs-nivel"><h3>Nível Físico</h3><span class="selo">fixação</span></div>${exsF.join("")}<div class="exs-nivel"><h3>Nível Máximo</h3><span class="selo">OBF · ITA · RU</span></div>${exsM.join("")}`),
      F.secao("chefao", "Chefão", chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-onda"); e.outerHTML = F.lab("Onda eletromagnética", "lab-onda"); SIM.ondaEM(document.getElementById("lab-onda"), F); },
});
