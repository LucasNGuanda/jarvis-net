/* =====================================================================================================
   ACESSO — quem vê o quê (β 4.1). ESTE É O ARQUIVO PARA EDITAR quando uma parte ficar pronta.
   Aviso honesto: o site é estático. Os códigos e todo o conteúdo ficam legíveis no código-fonte para quem abrir
   as ferramentas do navegador. Isto é uma porta com trinco, não um cofre.

   NÍVEIS (o que vai em cada campo):
     "visitante"              → todo mundo vê, sem código
     "tester"                 → quem usou o código de beta tester
     "adm"                    → só o ADM (o ADM vê TUDO sempre, mesmo o que não estiver listado aqui)
     "fisica", "matematica", "quimica", "idiomas", "config"  → quem usou aquele código avulso (lista em codigos.avulsos)
     uma lista, ex.: ["tester", "fisica"]  → quem tiver QUALQUER um deles

   EXEMPLOS DE MUDANÇA:
     • liberar a Química para os testers:         materias: { quimica: ["quimica", "tester"], ... }
     • abrir a Física para qualquer visitante:     materias: { fisica: "visitante", ... }
     • trancar só a aba Experimental (física) e deixá-la só para o ADM:   abas: { lab: "adm" }
       (ids das abas, em assets/catalogo*.js: fisica, exp, lab, mat, matcalc, olim, qui, quiexp, rus, rusleit, deu, deuleit, san, sanleit)
     • deixar o adesivo do gato só para o ADM (adesivo "secreto"):  adesivos: { gato: "adm" }
       (os ids dos adesivos estão em assets/adesivos.js)
     • dar a engrenagem (adesivos e figura) aos testers:  engrenagem: { painel: ["config", "tester"], ... }
   ===================================================================================================== */
window.ACESSO_CFG = {
  /* códigos de cada linha da página de códigos (#/codigos). Maiúsculas e minúsculas contam; acentos não (física = fisica). */
  codigos: {
    adm: ["55_admfreee_will"],
    tester: ["beta8976_@freewill_choise"],
    avulsos: {
      fisica: ["frewill_físic98025_p"],
      matematica: ["free-willp-mat98017"],
      quimica: ["free_quimic"],
      idiomas: ["let-me_slavic98716"],
      config: ["give-meskinn"],
    },
  },
  /* nome mostrado em "acesso liberado" e na lista do que já está destravado */
  nomes: { adm: "tudo (ADM)", tester: "Física inteira (beta tester)", fisica: "Física", matematica: "Matemática", quimica: "Química", idiomas: "Idiomas (russo, alemão, sânscrito) e o seletor de idioma", config: "Configurações (adesivos e figura central)" },

  /* matérias (ids de assets/materias.js) */
  materias: {
    fisica: ["tester", "fisica"],
    matematica: "matematica",
    quimica: "quimica",
    russo: "idiomas",
    alemao: "idiomas",
    sanscrito: "idiomas",
  },
  /* abas (ids de AREAS). Sem entrada aqui = a aba segue a matéria dela. */
  abas: {},
  /* painel da engrenagem na tela inicial */
  engrenagem: { painel: "config", figura: "config", adesivos: "config", corTitulo: "config" }, /* corTitulo = o seletor de cor do título "Jarvis" */
  /* adesivos (ids de assets/adesivos.js). Sem entrada = segue engrenagem.adesivos. */
  adesivos: {},
  /* barrinha de idiomas ao lado do cartão do Russo */
  seletorIdioma: "idiomas",

  /* texto ao passar o mouse em algo trancado: "visitante" = sem nenhum código; "comAcesso" = já tem algum código */
  avisos: { visitante: "sem acesso · ir para códigos? duplo clique", comAcesso: "em construção · ir para códigos? duplo clique" },

  /* PREVISTO, AINDA NÃO FUNCIONA: descobrir uma surpresa libera um código.
     Formato: "chave do localStorage que marca a descoberta": "código liberado" (um dos níveis acima). Ex.: { "fisica:exemplo-de-descoberta": "fisica" } */
  easterEggs: {},
};
