/* Química EQ03 · Experimento: distribuição de Maxwell-Boltzmann. Simulação SIM.eqMaxwell (assets/sims/quimica/exp-gases.js): 150 discos rígidos em 2D,
   todos com a mesma velocidade no início; só colisões elásticas. A energia total se conserva (conferido no teste: variação relativa menor que 1e-9).
   Distribuição 2D: f(v) = (v/σ²)·exp(−v²/2σ²), com ⟨v⟩/v_rms = √π/2 = 0,8862 (conferido em Python, tools/quimica/confere-exp-gases.py).
   Velocidades reais (3D): v_p = √(2RT/M), v̄ = √(8RT/πM), v_rms = √(3RT/M); N₂ a 300 K: 422, 476 e 517 m/s (conferido em Python). Massas molares: SIM.GASM. */
F.registrar("quimica/EQ03", {
  retoma: ["E02", "F04"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 3 · gases</div><div class="q">Num gás a 300 K, as moléculas não andam todas na mesma velocidade: há lentas, médias e algumas muito rápidas, numa proporção que é sempre a mesma. Quem decide essa proporção? E o que acontece se alguém obrigar todas a começar iguais?</div><p>Ninguém decide. As colisões fazem o serviço sozinhas, e sempre chegam à mesma curva.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>As moléculas começam todas com a mesma velocidade. Observe o histograma nos primeiros segundos. Depois aqueça, esfrie e troque o gás.</p><div id="exp-mb"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. As colisões embaralham a energia</h3>
        <p>Num choque entre duas moléculas, a energia total das duas se conserva, mas é repartida de novo: uma pode sair mais rápida e a outra, mais lenta. Depois de alguns choques por molécula, já não há memória do começo. O estado "todas iguais" é um entre uma quantidade enorme de jeitos de repartir a mesma energia, e quase todos os outros jeitos se parecem com a mesma curva: a distribuição de <b>Maxwell-Boltzmann</b> ${F.ret("E02")}.</p>
        ${F.formula(R`f(v) \propto v^2\,e^{-Mv^2/2RT}\quad\text{(em três dimensões)}`)}
        <h3>2. Três velocidades para um gás só</h3>
        ${F.formula(R`v_\text{mais provável} = \sqrt{\frac{2RT}{M}} \;<\; \bar v = \sqrt{\frac{8RT}{\pi M}} \;<\; v_\text{rms} = \sqrt{\frac{3RT}{M}}`)}
        <p>A curva não é simétrica: tem uma cauda comprida de moléculas rápidas. Por isso a média fica acima do pico, e a quadrática média (a que entra na energia cinética), acima da média. As três crescem com $\sqrt{T}$ e caem com $\sqrt{M}$. Para o $\ce{N2}$ a 300 K: 422, 476 e 517 m/s.</p>
        <h3>3. Por que isso importa para a química</h3>
        <p>Só reagem as colisões com energia acima da energia de ativação ${F.ret("F04")}. Quem tem essa energia são as moléculas da cauda. Aquecer um pouco muda pouco a velocidade média, mas engorda muito a cauda: é por isso que alguns graus a mais aceleram tanto uma reação.</p>
        ${F.caixa("fisico", R`<p><b>O que olhar.</b> O mostrador "v média / v rms" começa em 1,000 (todas iguais) e cai para perto de 0,886, o valor da distribuição de equilíbrio em duas dimensões. Ele mede, num número só, o quanto a caixa já "esqueceu" o começo. Repare também que aquecer não desloca a curva inteira para a direita: ela se alarga e abaixa, porque a área (o número de moléculas) não muda.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Temperatura não é a velocidade de uma molécula.</b> É uma propriedade do conjunto: a largura da distribuição. Uma molécula sozinha não tem temperatura.</p><p><b>Duas dimensões.</b> A caixa é plana, e a curva de equilíbrio em 2D é $f(v) \propto v\,e^{-Mv^2/2RT}$, com $v$ no lugar de $v^2$. O raciocínio é o mesmo; os números em m/s do mostrador são os do gás real, em 3D.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-mb"); e.outerHTML = F.lab("Maxwell-Boltzmann: a curva que nasce das colisões", "exp-mb"); SIM.eqMaxwell(document.getElementById("exp-mb"), F); },
});
