/* Química EQ20 · Experimento: construtor de moléculas (VSEPR, 3D e momento dipolar). REAPROVEITA o construtor da aba Moléculas: SIM.qVsepr3d
   (assets/sims/quimica/moleculas.js, tema MV02), para não haver dois construtores diferentes no site. A conta (SIM.qVseprConta) é a do MV02,
   conferida em Python (tools/moleculas/confere.py): soma dos dipolos de ligação em unidades de Δχ de Pauling: CO₂ 0; BF₃ 0; CH₄ 0; CCl₄ 0; XeF₄ 0; SF₆ 0;
   H₂O 1,43; NH₃ 0,84; CH₃Cl 0,96; CH₂Cl₂ 1,11; CHCl₃ 0,96. Eletronegatividades: as da tabela periódica do site.
   Diferença em relação ao pedido original (arrastar átomos): escolhem-se o átomo central, os átomos ligados e os pares isolados por botões. */
F.registrar("quimica/EQ20", {
  retoma: ["C04", "C05", "EQ16"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 20 · átomos e ligações</div><div class="q">O tetracloreto de carbono tem quatro ligações bem polares e é apolar: não se mistura com água. O clorofórmio, que só troca um cloro por hidrogênio, é polar. Como uma molécula cheia de ligações polares pode não ter polo nenhum?</div><p>Porque os dipolos são setas, e setas podem se cancelar. Tudo depende da geometria. Monte as duas e veja.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Escolha o átomo central, os átomos ligados e os pares isolados. O construtor aplica o modelo VSEPR, mostra a molécula girando e desenha a seta do dipolo resultante.</p><div id="exp-vsepr"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Cada ligação é uma seta</h3>
        <p>Numa ligação entre átomos de eletronegatividades diferentes, os elétrons ficam mais perto do mais eletronegativo. A ligação ganha um polo negativo e um positivo: um <b>dipolo</b>, representado por uma seta que aponta para o átomo mais eletronegativo ${F.ret("C05")}. O tamanho da seta cresce com a diferença de eletronegatividade.</p>
        <h3>2. A molécula é a soma das setas</h3>
        ${F.formula(R`\vec\mu_\text{molécula} = \sum \vec\mu_\text{ligações}`)}
        <p>Somam-se as setas como vetores, no espaço, com a geometria certa ${F.ret("C04")}. Se a soma dá zero, a molécula é <b>apolar</b>, por mais polares que sejam as ligações. Isso acontece quando ligações iguais estão distribuídas com simetria: linear ($\ce{CO2}$), trigonal plana ($\ce{BF3}$), tetraédrica ($\ce{CCl4}$), octaédrica ($\ce{SF6}$), quadrada plana ($\ce{XeF4}$).</p>
        <h3>3. O que quebra a simetria</h3>
        <p>Um átomo ligado diferente dos outros ($\ce{CHCl3}$) ou um par isolado no átomo central ($\ce{NH3}$, $\ce{H2O}$). Nos dois casos as setas deixam de se cancelar.</p>
        ${F.caixa("fisico", R`<p><b>Uma sequência para montar.</b> $\ce{CH4}$, depois troque um H por Cl, depois dois, três, quatro. A seta aparece, cresce, muda e some de novo em $\ce{CCl4}$. Antes de cada troca, diga para onde a seta vai apontar.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>O construtor monta o que você pedir</b>, mesmo moléculas que não existem. E a seta é <b>qualitativa</b>: soma só os dipolos das ligações, com tamanho igual à diferença de eletronegatividade. No dipolo real entram também o comprimento das ligações e os pares isolados.</p><p><b>Mesma ferramenta.</b> Este é o construtor da aba Moléculas, aqui com a explicação ao lado.</p>`, "Limites do modelo")}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-vsepr"); e.outerHTML = F.lab("Construtor VSEPR: geometria e dipolo", "exp-vsepr"); SIM.qVsepr3d(document.getElementById("exp-vsepr"), F); },
});
