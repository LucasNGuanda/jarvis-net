/* MV02 · Construtor VSEPR: geometria e dipolo (aba Moléculas da Química). Ferramenta: não tem exercícios.
   Conta em SIM.qVseprConta (assets/sims/quimica/moleculas.js), conferida em Python (tools/moleculas/confere.py):
   soma dos dipolos de ligação, em unidades de Δχ de Pauling: CO₂ 0; BF₃ 0; CH₄ 0; CCl₄ 0; XeF₂ 0; XeF₄ 0; SF₆ 0; PCl₅ 0;
   H₂O 1,43; NH₃ 0,84; CH₃Cl 0,96; CH₂Cl₂ 1,11; CHCl₃ 0,96; SF₄ 1,40; ClF₃ 0,82.
   Eletronegatividades: as da tabela periódica do site (assets/tabela-dados.js). Raios covalentes: os do RDKit (campo "raios" do catálogo). */
F.registrar("quimica/MV02", {
  retoma: ["C04", "C05"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Moléculas · ferramenta</div><div class="q">CCl₄ tem quatro ligações polares e é apolar. CHCl₃ tem três e é polar. Como?</div><p>Monte as duas aqui: escolha o átomo central, os átomos ligados e os pares isolados, e veja a geometria girando e a seta do dipolo.</p></div>`),
      F.secao("construtor", "Construtor", R`<div id="lab-vsepr3d"></div>`),
      F.secao("como", "Como usar", R`
        <p><b>1.</b> Conte as regiões de elétrons em volta do átomo central: átomos ligados (X) mais pares isolados (E). <b>2.</b> As regiões se afastam ao máximo: isso dá o arranjo. <b>3.</b> A geometria é o desenho formado só pelos átomos. Tudo isso está demonstrado no tema ${F.ret("quimica/C04")}; a soma dos dipolos, no ${F.ret("quimica/C05")}.</p>
        ${F.caixa("fisico", R`<p>Monte CH₄ e troque um H por Cl, depois dois, três e quatro. A seta aparece, muda de tamanho e some de novo em CCl₄. Depois monte AX₄E₂ com flúor (XeF₄): seis regiões, dois pares em posições opostas, e os quatro dipolos se cancelam.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p>O construtor não sabe se a molécula existe: ele monta "BeF₆" se você pedir. E a seta é <b>qualitativa</b>: ela soma só os dipolos das ligações, com o tamanho da diferença de eletronegatividade. No dipolo real entram também o comprimento das ligações e os pares isolados.</p>`, "Limites do modelo")}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-vsepr3d"); e.outerHTML = F.lab("Construtor VSEPR: geometria e dipolo", "lab-vsepr3d"); SIM.qVsepr3d(document.getElementById("lab-vsepr3d"), F); },
});
