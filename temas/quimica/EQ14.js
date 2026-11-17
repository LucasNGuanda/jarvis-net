/* Química EQ14 · Experimento: fusão nuclear. Simulação SIM.eqFusao (assets/sims/quimica/exp-nuclear.js): 40 núcleos de deutério e 40 de trítio, discos rígidos;
   um choque ²H–³H funde quando a energia ao longo da linha dos centros passa de EB = 6 kT (kT a 40 milhões de K): fração prevista e^(−6·40/T).
   MODELO: essa barreira é um número da simulação. Dados reais (tools/quimica/dadosX.json, seção "fusao"; conferidos por tools/quimica/confere-dadosX.py):
   ²H + ³H → ⁴He (3,5 MeV) + n (14,1 MeV), total 17,6 MeV; barreira de Coulomb D–T da ordem de 0,1 MeV, com tunelamento; núcleo do Sol a 15,7 milhões de K;
   cadeia próton-próton: 26,73 MeV por ⁴He formado; ⁵⁶Fe é o núcleo mais fortemente ligado.
   No teste (tests/texpq.js, semente fixa): fração que funde próxima de e^(−6·40/T) a 60 e a 120 milhões de K; cada fusão consome um ²H e um ³H e dá um ⁴He e um nêutron. */
F.registrar("quimica/EQ14", {
  retoma: ["B08", "EQ05"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 14 · nuclear</div><div class="q">O Sol funde hidrogênio sem parar, a 15,7 milhões de kelvin no núcleo. Se a reação libera tanta energia, por que é tão difícil fazê-la começar?</div><p>Porque núcleos são positivos, e positivo repele positivo. Antes de liberar energia, é preciso pagar um pedágio enorme para aproximá-los.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Comece com o plasma "frio" e vá aquecendo. Acompanhe a fração dos choques que termina em fusão e a energia liberada.</p><div id="exp-fus"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. A reação</h3>
        ${F.formula(R`\ce{^2_1H + ^3_1H -> ^4_2He + ^1_0n} \qquad 17{,}6\ \text{MeV}`)}
        <p>Deutério e trítio, dois isótopos do hidrogênio, juntam-se num núcleo de hélio-4 e sobra um nêutron. A energia vem da diferença de massa: os produtos são mais leves que os reagentes ${F.ret("B08")}. O hélio-4 fica com 3,5 MeV e o nêutron, com 14,1 MeV: os dois saem com o mesmo momento, em sentidos opostos, e o mais leve leva mais energia.</p>
        <h3>2. A barreira de Coulomb</h3>
        <p>A força nuclear, que une prótons e nêutrons, só age a distâncias minúsculas. Até chegar lá, os núcleos sentem só a repulsão elétrica. A energia necessária para vencê-la é a <b>barreira de Coulomb</b>. É a mesma lógica da energia de ativação ${F.ret("EQ05")}, numa escala muito maior: são precisas temperaturas de milhões de kelvin. No mundo real há uma ajuda: pelo tunelamento quântico, os núcleos não precisam ter a energia inteira da barreira.</p>
        <h3>3. Fusão e fissão</h3>
        <p>O núcleo mais fortemente ligado é o do ferro-56. Núcleos bem mais leves que ele liberam energia ao se <b>juntar</b> (fusão); núcleos muito mais pesados, ao se <b>partir</b> (fissão). No Sol, a cadeia próton-próton transforma quatro prótons num hélio-4 e libera 26,73 MeV, num núcleo a 15,7 milhões de kelvin.</p>
        ${F.caixa("fisico", R`<p><b>Compare por massa, não por evento.</b> Uma fissão de urânio libera uns 200 MeV; uma fusão D–T, 17,6 MeV. Parece pouco, mas a fusão envolve 5 unidades de massa e a fissão, 236. Por unidade de massa, são 3,5 MeV contra 0,85 MeV: a fusão libera cerca de quatro vezes mais.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>"Fusão precisa de calor porque é endotérmica."</b> Não: ela libera energia. O calor é para vencer a barreira, como numa combustão que precisa de faísca.</p><p><b>Fusão nuclear não é fusão de sólido.</b> Nada derrete: núcleos se juntam.</p><p><b>Modelo.</b> A barreira do experimento foi encolhida para a reação caber na tela; as energias liberadas são as reais.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-fus"); e.outerHTML = F.lab("Fusão nuclear: vencer a repulsão", "exp-fus"); SIM.eqFusao(document.getElementById("exp-fus"), F); },
});
