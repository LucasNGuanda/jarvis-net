/* EP05 · Como uma carga irradia. Visualização de J. J. Thomson/Purcell (dobra nas linhas de campo). */
F.registrar("EP05", {
  retoma: ["C03", "C15d"],
  html(F) {
    const R = String.raw;
    const fig = D.svg(420, 240, `<circle cx="140" cy="120" r="5" fill="#ef5b5b"/><circle cx="140" cy="120" r="70" style="fill:none;stroke:var(--warn);stroke-dasharray:4 5"/><circle cx="140" cy="120" r="95" style="fill:none;stroke:var(--warn);stroke-dasharray:4 5"/><line x1="140" y1="120" x2="${140 + 70 * Math.cos(-0.7)}" y2="${120 + 70 * Math.sin(-0.7)}" class="ln"/><line x1="${140 + 70 * Math.cos(-0.7)}" y1="${120 + 70 * Math.sin(-0.7)}" x2="${200 + 95 * Math.cos(-0.7)}" y2="${120 + 95 * Math.sin(-0.7)}" style="stroke:var(--warn);stroke-width:2.4"/><line x1="${200 + 95 * Math.cos(-0.7)}" y1="${120 + 95 * Math.sin(-0.7)}" x2="${200 + 190 * Math.cos(-0.7)}" y2="${120 + 190 * Math.sin(-0.7)}" class="ln"/>${D.txt(300, 40, "dobra (radiação)", "tx2", "start")}${D.txt(90, 210, "dentro: carga já parada", "tx2")}${D.txt(330, 220, "fora: ainda \"não sabe\"", "tx2")}`, "dobra");
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 5 · eletromagnetismo</div><div class="q">Uma carga parada tem campo. Uma carga com velocidade constante também. Por que só uma carga <b>acelerada</b> emite luz?</div></div>`),
      F.secao("experimento", "Experimento", R`<p>Veja primeiro a carga parada e a com velocidade constante. Depois a <b>freada</b>: repare na dobra que sai voando. Por fim, a carga oscilando (uma antena).</p><div id="lab-rad"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. A notícia não viaja mais rápido que a luz</h3>
        <p>Quando a carga freia no instante $t_0$, um ponto a uma distância $r > c(t - t_0)$ ainda não pode "saber" disso: lá, o campo continua apontando para onde a carga <b>estaria</b> se não tivesse freado. Dentro da esfera de raio $c(t - t_0)$, o campo já é o da carga parada. As duas regiões são ligadas por uma casca fina onde as linhas de campo dão uma <b>dobra</b> transversal. Essa casca se expande à velocidade $c$: é o pulso de radiação.</p>
        ${F.fig(fig)}
        ${F.demo("o campo transversal da dobra (estimativa geométrica de Purcell)", R`
          <p>(i) A freada dura $\tau$ e muda a velocidade em $\Delta v = a\tau$. Depois de um tempo $t$, a posição "fantasma" e a real estão separadas de $\Delta v\,t$.</p>
          <p>(ii) A dobra tem espessura radial $c\tau$ e está a $r = ct$. Na direção $\theta$ (medida a partir da velocidade), o deslocamento transversal das linhas é $\Delta v\,t\sin\theta$.</p>
          <p>(iii) Razão entre as componentes transversal e radial do campo na dobra: $\frac{E_\perp}{E_r} = \frac{\Delta v\,t\sin\theta}{c\tau} = \frac{a\,r\sin\theta}{c^2}$, com $E_r = \frac{q}{4\pi\varepsilon_0r^2}$ (Gauss: o fluxo radial não muda).</p>
          ${F.formula(R`E_\text{rad} = \frac{q\,a\sin\theta}{4\pi\varepsilon_0c^2\,r}`, "Campo de radiação")}
          <p>(iv) Cai com $1/r$ (não $1/r^2$!): por isso a radiação chega longe. Máxima perpendicular à aceleração, zero ao longo dela.</p>`)}
        ${F.demo("potência irradiada (fórmula de Larmor)", R`
          <p>(v) Intensidade: $S = \frac{E_\text{rad}^2}{\mu_0c}$ ${F.ret("C15d")}. Integrando numa esfera, com $\int\sin^2\theta\,d\Omega = \frac{8\pi}{3}$:</p>
          ${F.formula(R`P = \frac{q^2a^2}{6\pi\varepsilon_0c^3}`, "Larmor")}`)}
        ${F.caixa("fisico", R`<p><b>O átomo clássico não para de pé:</b> um elétron girando no átomo de hidrogênio tem aceleração centrípeta enorme e irradiaria toda a sua energia, espiralando até o núcleo, em uns $10^{-11}$ s. Os átomos existem: foi uma das pistas de que era preciso a mecânica quântica ${F.ret("C17b")}.</p>`)}
        ${F.caixa("ponte", R`<p>Antenas (elétrons oscilando num fio), raios X de freamento num tubo de raios X, luz de síncrotron (elétrons em curva), o azul do céu (elétrons das moléculas de ar oscilando com a luz do Sol, potência $\propto\omega^4$): tudo é Larmor.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-rad"); e.outerHTML = F.lab("Linhas de campo de uma carga acelerada", "lab-rad"); SIM.radiacao(document.getElementById("lab-rad"), F); },
});
