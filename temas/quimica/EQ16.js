/* Química EQ16 · Experimento: geometria molecular girando. Simulação SIM.eqGeometrias (assets/sims/quimica/exp-atomos.js): as 13 combinações AXₙEₘ do modelo VSEPR.
   Direções, nomes e exemplos: SIM.VSEPR (exportado de assets/sims/quimica/moleculas.js; são os mesmos do tema C04 e do construtor da aba Moléculas).
   Ângulos calculados pelas direções (SIM.qVseprConta): tetraédrico 109,5° (acos(−1/3) = 109,47°, conferido em Python).
   No teste (tests/texpq.js): AX₄ 109,5°; AX₃ 120°; AX₂ 180°; AX₆ 90° e 180°; AX₂E₂ angular; AX₄E₂ quadrada plana; a rotação não muda as distâncias. */
F.registrar("quimica/EQ16", {
  retoma: ["C04", "C05"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 16 · átomos e ligações</div><div class="q">CO₂ é uma linha reta; H₂O é dobrada. As duas têm um átomo no meio e dois nas pontas. E o metano não é uma cruz plana, como no papel. Quem decide a forma de uma molécula?</div><p>Os elétrons em volta do átomo central, inclusive os que não estão em ligação nenhuma. No papel, a terceira dimensão se perde; aqui as formas giram.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Escolha quantos átomos ligados e quantos pares isolados o átomo central tem. Veja o arranjo girar, depois esconda os pares isolados.</p><div id="exp-geo"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. A ideia</h3>
        <p>Em volta do átomo central há regiões de alta densidade de elétrons: cada ligação (simples, dupla ou tripla conta como uma) e cada par isolado. Todas têm carga negativa e se repelem. A molécula adota o arranjo em que elas ficam o mais longe possível umas das outras ${F.ret("C04")}.</p>
        <h3>2. Arranjo e geometria</h3>
        <p>Duas regiões: linha (180°). Três: triângulo plano (120°). Quatro: tetraedro (109,5°). Cinco: bipirâmide trigonal (90° e 120°). Seis: octaedro (90°). Esse é o <b>arranjo dos elétrons</b>. A <b>geometria molecular</b> descreve só os átomos: tire do arranjo as posições ocupadas por pares isolados e dê nome ao que sobra. A água tem quatro regiões (arranjo tetraédrico), mas só dois átomos ligados: geometria angular.</p>
        <h3>3. Onde vão os pares isolados</h3>
        <p>Um par isolado é mais "gordo" que uma ligação e empurra mais. No tetraedro, tanto faz a posição. Na bipirâmide trigonal, os pares vão para o equador, onde têm mais espaço (gangorra, forma de T, linear). No octaedro, dois pares ficam em posições opostas (quadrada plana). E os ângulos entre as ligações encolhem um pouco: 109,5° no metano, cerca de 107° na amônia, 104,5° na água.</p>
        ${F.caixa("fisico", R`<p><b>Da forma à polaridade.</b> Geometria não é enfeite: ela decide se os dipolos das ligações se cancelam ${F.ret("C05")}. CO₂ linear: cancelam, apolar. H₂O angular: não cancelam, polar. Monte a geometria, depois some as setas: é o que o construtor do experimento 20 faz.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Contar ligação dupla como duas regiões.</b> Conta uma.</p><p><b>Dar o nome pelo arranjo.</b> A amônia não é tetraédrica: é piramidal.</p><p><b>Esquecer os pares do átomo central.</b> Sem a estrutura de Lewis antes, a geometria sai errada.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-geo"); e.outerHTML = F.lab("Geometria molecular girando: do arranjo dos elétrons à forma", "exp-geo"); SIM.eqGeometrias(document.getElementById("exp-geo"), F); },
});
