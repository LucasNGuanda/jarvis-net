/* S01 · Exercícios da SOIF — as questões entram quando o Lucas escolher. */
F.registrar("S01", {
  html(F) {
    return [
      F.secao("sobre", "Sobre", `<p>Exercícios selecionados da SOIF, com o número e a fonte de cada um. Exemplo de menção: <span class="fonte">SOIF</span>.</p><p>Formato: questões com figura, marcação <b>●</b> · <b>X</b> · <b>/</b>, dicas e resolução escondidas, e o seu mapa de erros no fim.</p>`),
      F.secao("questoes", "Questões", `<div class="vazio"><b>Ainda sem questões.</b>Me mande os exercícios e eu coloco aqui, cada um com a fonte e o ano.</div>`),
    ].join("");
  },
});
