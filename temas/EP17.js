/* EP17 · O gato de Schrödinger (de brincadeira). Probabilidade de "acordado" = 2^(−t/T½) = e^(−λt), λ = ln 2 / T½;
   conferido no teste: abrindo muitas vezes, a fração de "acordado" segue a probabilidade média esperada. */
F.registrar("EP17", {
  retoma: ["C19", "C17"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 17 · ondas e quântica</div><div class="q">Se um átomo pode estar "decaído e não decaído ao mesmo tempo" enquanto ninguém olha, e um gato depende desse átomo, o gato também fica em dois estados ao mesmo tempo?</div><p>Foi essa pergunta, propositalmente absurda, que Schrödinger fez em 1935. Aqui, numa versão sem crueldade: o átomo decide se o gato está acordado ou dormindo.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>A caixa começa fechada. Espere e abra; feche e abra de novo. Compare quantas vezes deu "acordado" com o que a probabilidade previa.</p><div id="lab-gato"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. O átomo</h3>
        <p>Um núcleo radioativo não tem "hora marcada" para decair: em cada instante, há uma chance fixa por segundo. Por isso a probabilidade de ainda não ter decaído cai exponencialmente ${F.ret("C19")}:</p>
        ${F.formula(R`P_\text{não decaiu}(t) = 2^{-t/T_{1/2}} = e^{-\lambda t},\qquad \lambda = \frac{\ln2}{T_{1/2}}`)}
        <h3>2. O gato</h3>
        <p>Na formulação usual da mecânica quântica, antes da medida o átomo está numa <b>superposição</b> dos dois estados, com pesos cujos quadrados são essas probabilidades. Se o gato depende do átomo, a superposição "passa" para ele: $|\text{gato}\rangle = \sqrt{P}\,|\text{acordado}\rangle + \sqrt{1 - P}\,|\text{dormindo}\rangle$. Abrir a caixa é medir: o estado "colapsa" num dos dois, com essas probabilidades. O laboratório mostra isso com as duas imagens sobrepostas, cada uma com transparência igual à sua probabilidade.</p>
        ${F.caixa("pegadinha", R`<p><b>Schrödinger propôs o gato como crítica, não como defesa.</b> Em 1935, no artigo "A situação atual da mecânica quântica" (escrito depois do artigo de Einstein, Podolsky e Rosen), ele queria mostrar que levar a interpretação de Copenhague ao pé da letra para objetos grandes dava um absurdo: um gato ao mesmo tempo vivo e morto. Para ele, isso indicava que a teoria estava incompleta. A ironia é que o exemplo virou o símbolo mais famoso da própria mecânica quântica.</p>`)}
        ${F.caixa("fisico", R`<p><b>Por que não vemos gatos em superposição?</b> Um objeto grande interage o tempo todo com o ambiente (ar, luz, calor), e essas interações "medem" o sistema continuamente: a superposição se desfaz em frações de segundo (decoerência). Superposições já foram observadas em coisas cada vez maiores: fótons, átomos, moléculas, circuitos supercondutores e até pequenos cristais vibrando.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Abrir a caixa muitas vezes</b> é repetir um experimento aleatório: a fração de "acordado" tende à média das probabilidades no momento de cada abertura. Com poucas aberturas, a diferença pode ser grande (flutuação estatística); com muitas, ela cai como $1/\sqrt n$.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-gato"); e.outerHTML = F.lab("O gato de Schrödinger", "lab-gato"); SIM.gatoSchrodinger(document.getElementById("lab-gato"), F); },
});
