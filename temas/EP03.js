/* EP03 · O jogo da força de Lorentz. Níveis conferidos por busca numérica (scratchpad niveis.py): todos têm solução. */
F.registrar("EP03", {
  retoma: ["C12", "C13"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 3 · jogo</div><div class="q">Uma força que nunca acelera nem freia, só entorta. Dá para mirar com ela?</div></div>`),
      F.secao("experimento", "O jogo", R`<p>Ajuste B (e, no nível 3, E), a velocidade e o sinal da carga, e dispare. São 5 níveis. Tente <b>sem a cola</b>: calcule o raio antes de atirar.</p><div id="lab-jogo"></div>`),
      F.secao("teoria", "A física por trás", R`
        <h3>1. A força de Lorentz</h3>
        ${F.formula(R`\vec F = q\left(\vec E + \vec v\times\vec B\right)`, "Força de Lorentz")}
        <p>Com só $\vec B$ uniforme e $\vec v\perp\vec B$: círculo de raio $r = \frac{mv}{|q|B}$ ${F.ret("C13")}. Inverter o sinal da carga <b>ou</b> do campo inverte o sentido da curva. Com $\vec E\perp\vec B$, a partícula segue reto se $v = E/B$ ${F.ret("C12")}.</p>
        <h3>2. A mesma física pela lagrangiana</h3>
        <p>Dá para tratar carga em campo com Lagrange também, usando os potenciais: $\phi$ (escalar) e $\vec A$ (vetor), com $\vec E = -\nabla\phi - \partial_t\vec A$ e $\vec B = \nabla\times\vec A$ ${F.ret("U05")}.</p>
        ${F.formula(R`\mathcal L = \frac12mv^2 - q\phi + q\,\vec v\cdot\vec A`, "Lagrangiana de uma carga")}
        ${F.demo("B uniforme saindo da tela", R`
          <p>(i) Um potencial vetor que dá $\vec B = B\hat z$: $\vec A = \frac B2(-y,\ x,\ 0)$ (confira: $\nabla\times\vec A = B\hat z$).</p>
          <p>(ii) No plano: $\mathcal L = \frac12m(\dot x^2 + \dot y^2) + \frac{qB}{2}(x\dot y - y\dot x) - q\phi$.</p>
          <p>(iii) Para $x$: $\frac{\partial\mathcal L}{\partial\dot x} = m\dot x - \frac{qB}{2}y$, cuja derivada é $m\ddot x - \frac{qB}{2}\dot y$; e $\frac{\partial\mathcal L}{\partial x} = \frac{qB}{2}\dot y + qE_x$. Então $m\ddot x = qB\dot y + qE_x$.</p>
          <p>(iv) Para $y$, do mesmo jeito: $m\ddot y = -qB\dot x + qE_y$.</p>
          <p>(v) É exatamente $m\vec a = q(\vec E + \vec v\times\vec B)$, com $\vec v\times B\hat z = (B\dot y,\ -B\dot x)$ ✓.</p>`)}
        ${F.caixa("fisico", R`<p>Repare no momento canônico $p_x = m\dot x - \frac{qB}{2}y$: ele não é o "$mv$" de sempre. Na mecânica quântica, é $\vec p - q\vec A$ que aparece na equação de Schrödinger, e é por isso que o potencial vetor pode ter efeito mesmo onde $\vec B = 0$ (efeito Aharonov–Bohm, SOIF 2019 problema 20).</p>`)}
        <h3>3. Como resolver cada nível</h3>
        <p>Desenhe o círculo que passa pela saída do canhão (tangente horizontal ali) e pelo alvo; ache o raio; escolha $B$ e $v$ com $r = v/(0{,}72B)$ (unidades da tela, mostradas no visor). Quando o campo só cobre uma faixa, a partícula sai pela tangente e segue reta.</p>`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-jogo"); e.outerHTML = F.lab("Acerte o alvo com a força de Lorentz", "lab-jogo"); SIM.jogoLorentz(document.getElementById("lab-jogo"), F); },
});
