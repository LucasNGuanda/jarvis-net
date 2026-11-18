/* S00 · Simulados — página de entrada. As questões chegam quando o Lucas escolher. */
F.registrar("S00", {
  html(F) {
    const R = String.raw;
    return [
      F.secao("como", "Como vão funcionar", R`
        <p>Aqui entram <b>só questões que você escolher</b> (ITA, IME, OBF, olimpíadas russas…), cada uma com a fonte do lado, assim: <span class="fonte">ITA 2010</span> <span class="fonte">IME 2018</span> <span class="fonte">Всеросс 2015</span>.</p>
        <ol><li>Capa com o tempo sugerido.</li>
          <li>Questões A–E (ou numéricas), com figura e a marcação <b>●</b> certeza · <b>X</b> dúvida · <b>/</b> chutei.</li>
          <li>Cartão-resposta e campo de horário de início e fim.</li>
          <li>Gabarito escondido, com a resolução e "por que cada alternativa errada é tentadora".</li></ol>
        <p>No fim, o seu mapa de erros: erro com ● (o mais grave) e acerto com X ou / (ponto frágil).</p>`),
      F.secao("lista", "Simulados", `<div class="vazio"><b>Nenhum simulado ainda.</b>Me mande as provas e diga quais questões entram. Eu monto o simulado com a fonte de cada questão.</div>`),
    ].join("");
  },
});
