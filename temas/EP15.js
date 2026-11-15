/* EP15 · Radiação de corpo negro. Conferido no próprio laboratório (ver teste): a integral numérica de Planck vezes π dá σT⁴ (razão 1,0000);
   pico de Wien: 5800 K → 500 nm; 3000 K → 966 nm; 300 K → 9,66 μm. */
F.registrar("EP15", {
  retoma: ["C16", "T02"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 15 · ondas e quântica</div><div class="q">Por que um ferro aquecido fica primeiro vermelho, depois laranja, depois branco, e nunca "verde"? E por que a física clássica, tentando explicar isso, previu que qualquer forno emitiria energia infinita?</div><p>Foi para resolver esse problema que Planck, em 1900, inventou o quantum.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Mude a temperatura e acompanhe o pico, a área e a cor. Ligue e desligue a curva clássica.</p><div id="lab-corpo"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. A lei de Planck</h3>
        ${F.formula(R`B_\lambda(T) = \frac{2hc^2}{\lambda^5}\,\frac{1}{e^{hc/\lambda kT} - 1}`)}
        <p>Ela sai de supor que cada modo de vibração da luz na cavidade só pode ter energias $0, hf, 2hf, \dots$ ${F.ret("C16")}. Para comprimentos de onda longos ($hc/\lambda kT \ll 1$), $e^x - 1 \approx x$ ${F.ret("F05")} e a fórmula vira a clássica de Rayleigh–Jeans, $B = \frac{2ckT}{\lambda^4}$, que cresce sem limite quando $\lambda \to 0$.</p>
        <h3>2. Wien e Stefan–Boltzmann saem dela</h3>
        ${F.formula(R`\lambda_\text{máx}T = 2{,}898\times10^{-3}\ \text{m·K},\qquad \pi\int_0^\infty B_\lambda\,d\lambda = \sigma T^4`)}
        <p>O pico vem de derivar e igualar a zero (dá a equação $x = 5(1 - e^{-x})$, com $x \approx 4{,}965$); a área, de uma integral que envolve $\int_0^\infty\frac{x^3}{e^x - 1}dx = \frac{\pi^4}{15}$. O laboratório faz essa integral numericamente a cada temperatura e compara com $\sigma T^4$ ${F.ret("T02")}.</p>
        ${F.caixa("fisico", R`<p><b>Nada fica verde</b> porque a curva é larga: quando o pico está no verde (o Sol, ~500 nm), há quase tanto vermelho e azul, e a mistura parece branca. Estrelas vão de vermelhas (frias) a azuis (quentes), passando pelo branco, nunca pelo verde.</p>`)}
        ${F.caixa("pegadinha", R`<p><b>"Corpo negro" não é preto.</b> É qualquer coisa que absorve toda a luz que recebe; quente, ele brilha. O Sol é um ótimo corpo negro; a radiação cósmica de fundo é o corpo negro mais perfeito já medido, a 2,725 K.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-corpo"); e.outerHTML = F.lab("Radiação de corpo negro", "lab-corpo"); SIM.corpoNegro(document.getElementById("lab-corpo"), F); },
});
