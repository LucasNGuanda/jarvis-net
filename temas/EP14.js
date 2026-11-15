/* EP14 · Fenda dupla. Conferido em código (no próprio laboratório, ver o teste): os máximos de I(y) = cos²(πdy/λL)·sinc²(πay/λL)
   caem em y = mλL/d (λ = 550 nm, d = 0,25 mm, L = 1 m: 2,20 mm); os fótons sorteados reproduzem a curva (histograma). */
F.registrar("EP14", {
  retoma: ["O10b", "C17"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 14 · ondas e quântica</div><div class="q">Se a luz é feita de fótons, partículas, e você manda um fóton de cada vez pela fenda dupla, ele passa por uma fenda ou pela outra. De onde vem, então, a figura de interferência?</div><p>"O único mistério" da mecânica quântica, segundo Feynman. Veja as franjas nascerem ponto a ponto.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Mude a cor da luz, a separação das fendas e a distância da tela, e compare as franjas com as marcas da fórmula. Depois troque para "um fóton por vez".</p><div id="lab-fenda"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Onda: diferença de caminho</h3>
        <p>As duas fendas funcionam como duas fontes em fase. Num ponto da tela, a onda de uma fenda percorre $d\sin\theta$ a mais que a da outra. Franja clara quando isso é um número inteiro de comprimentos de onda ${F.ret("O10b")}:</p>
        ${F.formula(R`d\sin\theta = m\lambda\quad\Rightarrow\quad y_m \approx \frac{m\lambda L}{d},\qquad \Delta y = \frac{\lambda L}{d}`)}
        <p>A intensidade é $I \propto \cos^2\!\left(\frac{\pi dy}{\lambda L}\right)$, modulada pela difração de cada fenda (largura $a$), que faz as franjas mais afastadas ficarem fracas e até "pularem" ordens quando um mínimo de difração cai em cima de um máximo de interferência. (Por causa dessa modulação, os máximos reais ficam um pouquinho para dentro das marcas da fórmula: com os valores iniciais, 2,18 mm em vez de 2,20 mm. Conferi no código.)</p>
        <h3>2. Partícula: um fóton por vez</h3>
        <p>Com luz muito fraca, a tela registra pontos isolados: a energia chega em pacotes, $E = hf$ ${F.ret("C17")}. Cada ponto cai num lugar imprevisível, mas a <b>probabilidade</b> de cair em cada lugar é proporcional a $I(y)$, calculada como se o fóton passasse pelas duas fendas e interferisse consigo mesmo. Depois de milhares de pontos, as franjas aparecem.</p>
        ${F.caixa("fisico", R`<p><b>Funciona com elétrons, átomos e até moléculas grandes.</b> Em 1999, moléculas de C₆₀ (o "futebol" de 60 carbonos) fizeram franjas de interferência. E se você colocar um detector para saber por qual fenda cada partícula passou, as franjas somem: medir destrói a interferência.</p>`)}
        ${F.caixa("pegadinha", R`<p><b>As franjas não são "fótons batendo uns nos outros".</b> Mandando um de cada vez, com minutos de intervalo, a figura aparece igual. A interferência é de cada fóton com ele mesmo. E na conta $y = m\lambda L/d$ usamos ângulos pequenos ($\sin\theta \approx \tan\theta$), que valem quando $y \ll L$.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-fenda"); e.outerHTML = F.lab("Fenda dupla", "lab-fenda"); SIM.fendaDupla(document.getElementById("lab-fenda"), F); },
});
