/* S02 · Vestibulares militares — as questões entram quando o Lucas escolher. */
F.registrar("S02", {
  html(F) {
    return [
      F.secao("sobre", "Sobre", `<p>ITA, IME, AFA, EFOMM, EsPCEx, Escola Naval… cada questão com a prova e o ano. Exemplo de menção: <span class="fonte">ITA 2010</span>.</p><p>Formato: questões com figura, marcação <b>●</b> · <b>X</b> · <b>/</b>, dicas e resolução escondidas, e o seu mapa de erros no fim.</p>`),
      F.secao("questoes", "Questões", `<div class="vazio"><b>Ainda sem questões.</b>Me mande os exercícios e eu coloco aqui, cada um com a fonte e o ano.</div>`),
    ].join("");
  },
});
