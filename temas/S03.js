/* S03 · Vestibulares ao redor do mundo — as questões entram quando o Lucas escolher. */
F.registrar("S03", {
  html(F) {
    return [
      F.secao("sobre", "Sobre", `<p>Provas de admissão de outros países (Rússia, China, Índia, Japão…), com o país, a prova e o ano. Exemplo de menção: <span class="fonte">MIPT 2019</span>.</p><p>Formato: questões com figura, marcação <b>●</b> · <b>X</b> · <b>/</b>, dicas e resolução escondidas, e o seu mapa de erros no fim.</p>`),
      F.secao("questoes", "Questões", `<div class="vazio"><b>Ainda sem questões.</b>Me mande os exercícios e eu coloco aqui, cada um com a fonte e o ano.</div>`),
    ].join("");
  },
});
