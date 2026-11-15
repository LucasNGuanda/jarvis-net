/* MV01 · Visualizador de moléculas em 3D (aba Moléculas da Química). Ferramenta: não tem exercícios.
   Catálogo: assets/moleculas-dados.js, GERADO por tools/moleculas/gera-moleculas.py (RDKit, fora do site) a partir de tools/moleculas/lista.json.
   Primeira entrega: 36 moléculas. Conferência do gerador (docs/MOLECULAS_RELATORIO.md): em 36 de 36 a fórmula calculada pelo SMILES bate com a escrita.
   Ângulos calculados nas coordenadas × valor de livro: água 104,0° × 104,5°; amônia 106,0° × 107°; metano 109,5° × 109,5°; ozônio 120,0° × 117°. Nenhum foi ajustado à mão. */
F.registrar("quimica/MV01", {
  retoma: ["C04", "C05"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Moléculas · ferramenta</div><div class="q">Etanol e éter dimetílico têm a mesma fórmula, C₂H₆O. Por que um é líquido e o outro é gás?</div><p>Porque fórmula não é forma. Aqui você procura uma molécula pelo nome, pela fórmula ou pelo SMILES e gira o modelo dela com o mouse.</p></div>`),
      F.secao("visualizador", "Visualizador", R`<div id="lab-moleculas"></div>`),
      F.secao("como", "Como ler o que aparece", R`
        <p><b>É um modelo.</b> As posições dos átomos foram calculadas fora do site por um programa de química (RDKit), com um campo de força: uma conta de molas e ângulos que imita a molécula. Por isso a ficha mostra dois números: o ângulo <b>do modelo</b> e o ângulo <b>de livro</b>, que é o medido. Eles ficam próximos, não iguais.</p>
        <p><b>Octeto expandido.</b> Para PCl₅, SF₄, SF₆, ClF₃, XeF₂ e XeF₄ o campo de força não serve. Nelas o desenho usa as direções ideais do modelo VSEPR, e a ficha avisa. Na molécula real, os pares isolados apertam um pouco os ângulos.</p>
        <p><b>Íons com ressonância.</b> No nitrato e no carbonato o desenho mostra uma das formas de ressonância (uma ligação dupla e duas simples). No íon real, as três ligações são iguais.</p>
        <p><b>Composto iônico não é molécula.</b> O cloreto de sódio aparece como os dois íons separados e, ao lado, um pedaço do retículo cristalino. "NaCl" é só a proporção entre os íons.</p>
        ${F.caixa("pegadinha", R`<p><b>SMILES</b> é um jeito de escrever uma molécula numa linha de texto: <code>CCO</code> é o etanol, <code>COC</code> é o éter dimetílico. A busca daqui <b>só encontra moléculas do catálogo</b>, e só quando o SMILES é escrito como está na ficha. Ela não desenha uma molécula nova a partir de um SMILES qualquer.</p>`, "O que a busca não faz")}
        ${F.caixa("fisico", R`<p>Procure <b>C2H6O</b> ou <b>C4H8</b>: aparecem dois modelos lado a lado. Ligue os pares isolados no etanol e veja o oxigênio com um H preso a ele. É esse O–H que faz ligações de hidrogênio e segura as moléculas juntas. No éter, o oxigênio fica entre dois carbonos, sem H: ele ferve a −24 °C, e o etanol, a 78 °C.</p>`, "Pense como químico")}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-moleculas"); e.outerHTML = F.lab("Visualizador de moléculas em 3D", "lab-moleculas"); SIM.qMoleculas(document.getElementById("lab-moleculas"), F); },
});
