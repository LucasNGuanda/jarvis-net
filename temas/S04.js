/* S04 · Olimpíadas de Física — as questões entram quando o Lucas escolher. */
F.registrar("S04", {
  html(F) {
    return [
      F.secao("sobre", "Sobre", `<p>Olimpíadas brasileiras (OBF) e russas (Всеросс, Физтех…), com a menção certa de cada uma. Exemplo de menção: <span class="fonte">OBF 2023</span>.</p><p>Formato: questões com figura, marcação <b>●</b> · <b>X</b> · <b>/</b>, dicas e resolução escondidas, e o seu mapa de erros no fim.</p>`),
      F.secao("questoes", "Questões", `<div class="vazio"><b>Ainda sem questões.</b>Me mande os exercícios e eu coloco aqui, cada um com a fonte e o ano.</div>`),
    ].join("");
  },
});
