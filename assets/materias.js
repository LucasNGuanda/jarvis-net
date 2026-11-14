/* Matérias do projeto (tela inicial #/home). Formato em docs/MODELO_DE_DADOS.md, seção 3.
   Para acrescentar uma matéria: acrescente um objeto aqui. Com pronta: false, o botão aparece desativado com "em breve". */
window.MATERIAS = [
  { id: "fisica", nome: "Física", desc: "Teoria, laboratórios, exercícios e chefões.", rota: "#/inicio", cor: "--mA", icone: "atomo", pronta: true, prefixo: "fisica" },
  { id: "quimica", nome: "Química", desc: "Em construção.", rota: "#/quimica/inicio", cor: "--mN", icone: "frasco", pronta: false, prefixo: "quimica" },
  { id: "matematica", nome: "Matemática", desc: "Em construção.", rota: "#/matematica/inicio", cor: "--mK2", icone: "integral", pronta: false, prefixo: "matematica" },
  { id: "russo", nome: "Russo", desc: "Em construção.", rota: "#/russo/inicio", cor: "--mT", icone: "cirilico", pronta: false, prefixo: "russo" },
];
window.PROJETO = { nome: "Jarvis", subtitulo: "meu sistema de estudo" };
