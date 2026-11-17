/* Química EQ15 · Experimento: orbitais atômicos em 3D. Simulação SIM.eqOrbitais (assets/sims/quimica/exp-atomos.js): 2600 pontos sorteados com densidade |ψ|²,
   funções de onda exatas do hidrogênio (1s, 2s, 2p, 3s, 3p, 3d), em unidades atômicas. Conferência em Python: tools/quimica/confere-exp-atomos.py
   (normalização 1,000000; ⟨r⟩ = 1,5; 6; 5; 13,5; 12,5; 10,5 a₀; nós radiais do 2s em 2 a₀, do 3s em 1,90 e 7,10 a₀, do 3p em 6 a₀).
   No teste (tests/texpq.js, semente fixa): distância média dos pontos a menos de 4% da teoria em todos os orbitais; metade dos pontos de cada sinal nos orbitais p e d;
   nenhum ponto perto do nó radial do 2s. */
F.registrar("quimica/EQ15", {
  retoma: ["B04", "B05"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 15 · átomos e ligações</div><div class="q">Os livros desenham o orbital 1s como uma bola e o 2p como um haltere. Mas o elétron não é uma bola nem está dentro de um haltere. O que, exatamente, esses desenhos mostram?</div><p>Mostram onde o elétron tem mais chance de ser encontrado. Aqui, em vez da casca do desenho, você vê a nuvem inteira: milhares de posições possíveis, sorteadas com a probabilidade que a mecânica quântica dá.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Troque de orbital, gire a nuvem e corte-a ao meio. Compare o que vê em 3D com o gráfico da distância ao núcleo.</p><div id="exp-orb"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Função de onda e probabilidade</h3>
        ${F.formula(R`\text{probabilidade de achar o elétron num ponto} \propto |\psi|^2`)}
        <p>Para cada estado do elétron no átomo, a equação de Schrödinger dá uma função de onda $\psi$. Ela não diz onde o elétron está: diz, pelo seu quadrado, a probabilidade de encontrá-lo em cada lugar ${F.ret("B04")}. Um <b>orbital</b> é essa função; o desenho de livro é só a superfície que engloba a maior parte da nuvem.</p>
        <h3>2. Os números quânticos fazem a forma</h3>
        ${F.formula(R`\text{nós radiais} = n - l - 1 \qquad\qquad \text{nós angulares} = l`)}
        <p>O número $n$ controla o tamanho; $l$, a forma: $l = 0$ (s) é esférico, $l = 1$ (p) tem dois lóbulos, $l = 2$ (d) tem quatro (ou dois e um anel). Um <b>nó</b> é uma superfície em que $\psi = 0$, e a probabilidade ali é nula. O 2s tem um nó esférico: há uma casca vazia entre a região de dentro e a de fora, que só aparece cortando a nuvem. O 2p tem um plano nodal passando pelo núcleo.</p>
        <h3>3. As cores</h3>
        <p>Dos dois lados de um nó, $\psi$ tem sinais opostos (laranja e azul). O sinal não muda a probabilidade, que depende de $\psi^2$, mas é ele que decide como dois orbitais se somam quando átomos se ligam: mesma cor, reforço (ligante); cores opostas, cancelamento (antiligante) ${F.ret("B05")}.</p>
        ${F.caixa("fisico", R`<p><b>O gráfico da direita responde a outra pergunta.</b> A nuvem mostra onde a densidade é maior: no 1s, é no núcleo. O gráfico mostra a que <b>distância</b> o elétron é mais encontrado, somando tudo o que há em cada casca esférica: no 1s, o máximo fica em 1 raio de Bohr, porque cascas maiores têm mais volume. As duas coisas são verdade ao mesmo tempo.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Orbital não é órbita.</b> O elétron não percorre o haltere.</p><p><b>"O elétron não pode estar no nó, então como passa de um lóbulo ao outro?"</b> A pergunta supõe uma trajetória, e não há trajetória: há só a probabilidade de cada lugar.</p><p><b>Só o hidrogênio.</b> Estas são as funções exatas do átomo de um elétron. Nos outros átomos as formas são parecidas, mas os tamanhos e as energias mudam.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-orb"); e.outerHTML = F.lab("Orbitais atômicos em 3D: a nuvem de probabilidade", "exp-orb"); SIM.eqOrbitais(document.getElementById("exp-orb"), F); },
});
