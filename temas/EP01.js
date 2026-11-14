/* EP01 · Pêndulo simples pela lagrangiana. Equações e números conferidos com sympy/scipy (scratchpad exp.py). */
F.registrar("EP01", {
  html(F) {
    const R = String.raw;
    const fig = D.svg(320, 280, `<line x1="80" y1="30" x2="240" y2="30" style="stroke:var(--ink3);stroke-width:5"/><line x1="160" y1="30" x2="160" y2="250" class="ln2" style="stroke-dasharray:4 4"/><line x1="160" y1="30" x2="250" y2="200" class="ln"/><circle cx="250" cy="200" r="13" style="fill:var(--mod)"/><path d="M160 80 A50 50 0 0 0 184 74" class="ln2"/>${D.txt(178, 100, "θ", "txm")}${D.txt(212, 110, "ℓ", "txm")}${D.seta(250, 200, 250, 250, "var(--ink2)", 1.6)}${D.txt(258, 244, "mg", "txm", "start")}${D.seta(160, 260, 300, 260, "var(--ink3)", 1.2)}${D.txt(300, 276, "x", "txm", "end")}${D.seta(40, 30, 40, 170, "var(--ink3)", 1.2)}${D.txt(30, 170, "y", "txm", "end")}<path class="ln2" d="M160 214 h90" style="stroke-dasharray:3 3"/>${D.txt(205, 230, "x = ℓ sen θ", "tx2")}`, "pêndulo");
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 1</div><div class="q">Galileu disse que o período do pêndulo não depende da amplitude. Ele estava certo?</div><p class="det">Spoiler: só para ângulos pequenos. Aqui você deduz a equação exata e vê a diferença acontecendo.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Arraste o peso, solte e compare com o fantasma (equação linearizada). Leia o período medido na simulação e compare com as três previsões.</p><div id="lab-p1"></div>`),
      F.secao("lagrange", "A dedução pela lagrangiana", R`
        <p>Na mecânica de Lagrange ${F.ret("U03")}, em vez de forças, usamos energias. Receita: (1) escolha uma coordenada generalizada; (2) escreva as posições em função dela; (3) derive para ter as velocidades; (4) monte $T$ e $V$; (5) $\mathcal L = T - V$; (6) aplique a equação de Euler–Lagrange.</p>
        ${F.fig(fig, "Origem no ponto de suspensão. Na dedução, o eixo y aponta para cima, então o peso fica em y negativo.")}
        ${F.demo("passo a passo", R`
          <p>(i) <b>Coordenada:</b> o ângulo $\theta$ (o fio é inextensível, então um número só descreve tudo).</p>
          <p>(ii) <b>Posição</b> (origem no ponto de suspensão, $y$ para cima): $x = \ell\sin\theta$, $\;y = -\ell\cos\theta$.</p>
          <p>(iii) <b>Velocidades</b> (regra da cadeia): $\dot x = \ell\cos\theta\,\dot\theta$, $\;\dot y = \ell\sin\theta\,\dot\theta$.</p>
          <p>(iv) <b>Energia cinética:</b> $T = \frac12m(\dot x^2 + \dot y^2) = \frac12m\ell^2\dot\theta^2(\cos^2\theta + \sin^2\theta) = \frac12m\ell^2\dot\theta^2$.</p>
          <p>(v) <b>Energia potencial</b> (gravidade): $V = mgy = -mg\ell\cos\theta$.</p>
          <p>(vi) <b>Lagrangiana:</b></p>${F.formula(R`\mathcal L = T - V = \frac12m\ell^2\dot\theta^2 + mg\ell\cos\theta`)}
          <p>(vii) <b>Euler–Lagrange:</b></p>${F.formula(R`\frac{d}{dt}\left(\frac{\partial\mathcal L}{\partial\dot\theta}\right) - \frac{\partial\mathcal L}{\partial\theta} = 0`)}
          <p>$\frac{\partial\mathcal L}{\partial\dot\theta} = m\ell^2\dot\theta \Rightarrow \frac{d}{dt}(\ldots) = m\ell^2\ddot\theta$; $\quad\frac{\partial\mathcal L}{\partial\theta} = -mg\ell\sin\theta$.</p>
          <p>(viii) Juntando: $m\ell^2\ddot\theta + mg\ell\sin\theta = 0$:</p>${F.formula(R`\ddot\theta + \frac g\ell\sin\theta = 0`, "Equação do pêndulo (exata)")}`)}
        ${F.caixa("fisico", R`<p>A tração no fio <b>nunca</b> apareceu: ela não faz trabalho (é perpendicular ao movimento), e o método de Lagrange a elimina sozinho ao usar só $\theta$. Pela 2ª lei de Newton você teria de decompor tração e peso; aqui, só energias.</p>`)}`),
      F.secao("resultados", "Os resultados", R`
        <h3>1. Pequenos ângulos</h3>
        <p>Para $\theta \ll 1$ rad, $\sin\theta \approx \theta$ ${F.ret("F05")}: $\ddot\theta = -\frac g\ell\theta$, um MHS ${F.ret("A20")}:</p>
        ${F.formula(R`\theta(t) = \theta_0\cos(\omega_0t),\qquad \omega_0 = \sqrt{\frac g\ell},\qquad T_0 = 2\pi\sqrt{\frac\ell g}`)}
        <h3>2. Período exato</h3>
        ${F.demo("período para qualquer amplitude", R`<p>(i) Conservação da energia: $\frac12m\ell^2\dot\theta^2 - mg\ell\cos\theta = -mg\ell\cos\theta_0 \Rightarrow \dot\theta = \sqrt{\frac{2g}{\ell}(\cos\theta - \cos\theta_0)}$.</p>
          <p>(ii) Um quarto de período: $\frac T4 = \int_0^{\theta_0}\frac{d\theta}{\dot\theta}$.</p>
          <p>(iii) Com $\cos\theta = 1 - 2\sin^2\frac\theta2$, a troca $\sin\frac\theta2 = k\sin\varphi$, $k = \sin\frac{\theta_0}{2}$, leva a</p>${F.formula(R`T = 4\sqrt{\frac\ell g}\int_0^{\pi/2}\frac{d\varphi}{\sqrt{1 - k^2\sin^2\varphi}} = 4\sqrt{\frac\ell g}\,K(k)`)}
          <p>$K$ é a <b>integral elíptica completa de 1ª espécie</b>: não tem fórmula com funções elementares. Expandindo em série:</p>${F.formula(R`T = T_0\left(1 + \frac{\theta_0^2}{16} + \frac{11\,\theta_0^4}{3072} + \dots\right)`)}`)}
        <table class="tb"><tr><th>θ₀</th><th>T/T₀ exato</th><th>1 + θ₀²/16 + 11θ₀⁴/3072</th></tr><tr><td>10°</td><td>1,0019</td><td>1,0019</td></tr><tr><td>30°</td><td>1,0174</td><td>1,0174</td></tr><tr><td>60°</td><td>1,0732</td><td>1,0728</td></tr><tr><td>90°</td><td>1,1803</td><td>1,1760</td></tr><tr><td>150°</td><td>1,762</td><td>1,597 (a série falha)</td></tr></table>
        <p class="det" style="color:var(--ink2)">Valores calculados com a integral elíptica (scipy). Perto de 180°, o período vai a infinito: o pêndulo "equilibra" de cabeça para baixo.</p>
        ${F.caixa("ponte", R`<p><b>No seu experimento do itinerário (E3)</b>, você usou $T = T_0(1 + \theta^2/16)$ com $\theta \approx 30°$. A correção exata é 1,0174 e a sua dá 1,0171: a diferença (0,03%) é bem menor que a incerteza do ângulo. A aproximação estava ótima.</p>`)}
        <h3>3. Espaço de fase</h3>
        <p>O gráfico $(\theta, \omega)$ do experimento mostra o estado completo do sistema. Energia conservada $\Rightarrow$ cada movimento é uma curva fechada (oscilação). Com energia acima de $2mg\ell$, o pêndulo dá voltas completas e a curva não fecha mais em $\theta$. Com atrito, a curva vira uma espiral que cai no ponto (0, 0).</p>`),
      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Com $\ell = 0{,}750$ m e $g = 9{,}79$ m/s², de quanto o período a $30°$ difere do de pequenos ângulos, em milissegundos?</p>`, fig: "", dicas: [R`<p>$T_0 = 2\pi\sqrt{\ell/g}$.</p>`, R`<p>Diferença $\approx T_0\cdot\theta_0^2/16$.</p>`], resp: R`$\approx 30$ ms.`, sol: R`<p>$T_0 = 1{,}739$ s; $\times0{,}0174 \approx 30$ ms. Num cronômetro de mão (~0,1 s de reação), só aparece medindo várias oscilações seguidas.</p>` }),
        F.exercicio({ n: 2, marcas: ["!"], enun: R`<p>Refaça a dedução para um pêndulo cujo ponto de suspensão sobe com aceleração constante $a$. Qual o novo período de pequenas oscilações?</p>`, fig: "", dicas: [R`<p>Posição do ponto: $y_0 = \frac12at^2$. Some a $y$ do peso.</p>`, R`<p>Termos que são derivadas totais em $t$ não mudam as equações. Vai sobrar $g \to g + a$.</p>`], resp: R`$T = 2\pi\sqrt{\ell/(g + a)}$.`, sol: R`<p>No referencial do elevador, a gravidade efetiva é $g + a$. Pela lagrangiana: o termo cruzado $m\,at\,\ell\sin\theta\,\dot\theta$ equivale (a menos de uma derivada total) a $-ma\ell\cos\theta$, que se soma ao potencial.</p>` }),
      ].join("")),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-p1"); e.outerHTML = F.lab("Pêndulo simples: exato × pequenos ângulos", "lab-p1"); SIM.pendulo(document.getElementById("lab-p1"), F); },
});
