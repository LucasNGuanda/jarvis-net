/* EP07 · Exercício do professor (aula no ITA): conta num fio horizontal atraída por uma carga abaixo. MHS para x ≪ d.
   Números e correção anarmônica conferidos numericamente (solve_ivp). */
F.registrar("EP07", {
  retoma: ["C02", "B15"],
  html(F) {
    const R = String.raw;
    const fig = D.svg(420, 240, `<line x1="30" y1="50" x2="390" y2="50" style="stroke:var(--ink3);stroke-width:3"/><line x1="200" y1="50" x2="200" y2="200" class="ln2" style="stroke-dasharray:4 4"/>${D.txt(210, 130, "d", "txm", "start")}<circle cx="200" cy="200" r="10" fill="#4f8dff"/>${D.txt(200, 230, "q₂ (fixa)", "tx2")}<circle cx="290" cy="50" r="10" fill="#ef5b5b"/>${D.txt(290, 30, "m, q₁", "tx2")}<line x1="290" y1="50" x2="200" y2="200" style="stroke:var(--warn);stroke-width:1.6"/>${D.txt(258, 140, "r = √(d² + x²)", "tx2", "start")}<path class="ln2" d="M200 70 v6 H290 v-6"/>${D.txt(245, 92, "x", "txm")}${D.seta(290, 50, 240, 50, "var(--warn)", 2.4)}${D.txt(236, 44, "F_rest", "tx2", "end")}`, "conta no fio");
    return [
      F.secao("abertura", "O exercício", R`<div class="abertura"><div class="det">A bolinha elétrica no fio · exercício do professor (aula no ITA)</div><div class="q">Uma conta de massa $m$ e carga $q_1$ só pode andar na horizontal, num fio. Abaixo do fio, a uma distância $d$, uma carga fixa $q_2$ a atrai. Mostre que, para $x \ll d$, o movimento é um MHS e escreva a equação da posição.</div></div>`),
      F.secao("experimento", "Experimento", R`<p>Compare o movimento exato com o MHS (fantasma). Aumente a amplitude até $x_0$ não ser mais pequeno perto de $d$.</p><div id="lab-prof"></div>`),
      F.secao("teoria", "A resolução", R`${F.fig(fig, "Interpretei x como o deslocamento horizontal da conta a partir do ponto bem acima de q₂; a distância até q₂ é r = √(d² + x²), que fica ≈ d quando x ≪ d.")}
        ${F.demo("passo a passo", R`
          <p>(i) Força elétrica (atrativa), ao longo da reta que liga as cargas: $F_\text{el} = \frac{kq_1q_2}{r^2}$, $r = \sqrt{d^2 + x^2}$.</p>
          <p>(ii) Só a componente horizontal move a conta (o fio segura a vertical): $F_x = -F_\text{el}\,\frac{x}{r} = -\frac{kq_1q_2\,x}{(d^2 + x^2)^{3/2}}$. É a força restauradora: aponta sempre para o centro.</p>
          <p>(iii) <b>Aproximação</b> $x \ll d$: $r \approx d$, então $F_x \approx -\frac{kq_1q_2}{d^3}\,x$: força proporcional ao deslocamento, como uma mola de constante $K = \frac{kq_1q_2}{d^3}$.</p>
          <p>(iv) Newton: $m\ddot x = -Kx$, isto é, MHS ${F.ret("B15")}:</p>
          ${F.formula(R`x(t) = x_0\cos(\omega t + \varphi_0),\qquad \omega = \sqrt{\frac{kq_1q_2}{m\,d^3}},\qquad T = 2\pi\sqrt{\frac{m\,d^3}{kq_1q_2}}`, "Equação da posição")}
          <p>(v) Soltando do repouso em $x_0$: $\varphi_0 = 0$.</p>`)}
        <p><b>Com números</b> (os do experimento): $q_1 = q_2 = 1$ µC, $m = 1$ g, $d = 10$ cm: $\omega \approx 94{,}8$ rad/s, $T \approx 66$ ms.</p>
        ${F.caixa("olimpiada", R`<p><b>Próxima ordem:</b> expandindo, $F_x \approx -\frac{kq_1q_2}{d^3}\left(x - \frac{3x^3}{2d^2}\right)$. A força cresce menos que linearmente e o período aumenta com a amplitude: $T \approx T_0\left(1 + \frac{9}{16}\frac{x_0^2}{d^2}\right)$. Conferi integrando a equação exata: para $x_0/d = 0{,}2$, exato 1,0224 e fórmula 1,0225. E se as cargas se <b>repelissem</b>? O sinal de $K$ troca: o equilíbrio fica instável.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-prof"); e.outerHTML = F.lab("Conta no fio: exato × MHS", "lab-prof"); SIM.profMHS(document.getElementById("lab-prof"), F); },
});
