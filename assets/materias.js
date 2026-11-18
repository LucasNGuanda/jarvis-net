/* Matérias do projeto (tela inicial #/home). Formato em docs/MODELO_DE_DADOS.md, seção 3.
   Para acrescentar uma matéria: acrescente um objeto aqui. Com pronta: false, o botão aparece desativado com "em breve". */
window.MATERIAS = [
  { id: "fisica", nome: "Física", desc: "Teoria, laboratórios, exercícios e chefões.", rota: "#/inicio", cor: "--mA", icone: "atomo", pronta: true, prefixo: "fisica" },
  { id: "quimica", nome: "Química", desc: "Módulos criados; os temas vêm depois.", rota: "#/quimica", cor: "--mN", icone: "frasco", pronta: true, prefixo: "qui" },
  { id: "matematica", nome: "Matemática", desc: "Módulos criados; os temas vêm depois.", rota: "#/matematica", cor: "--mK2", icone: "integral", pronta: true, prefixo: "mat" },
  /* idiomas (β 4.1): idioma: true = dividem o cartão de línguas da tela inicial, com a barrinha de troca (letra = rótulo na barrinha).
     Para acrescentar um idioma: um objeto aqui + as abas e módulos dele num catálogo (ex.: assets/catalogo-idiomas.js) + o nível em assets/acesso-config.js. */
  { id: "russo", nome: "Russo", desc: "Módulos criados; os temas vêm depois.", rota: "#/russo", cor: "--mR", icone: "cirilico", pronta: true, prefixo: "rus", idioma: true, letra: "Я" },
  { id: "alemao", nome: "Alemão", desc: "Módulos criados; os temas vêm depois.", rota: "#/alemao", cor: "--mDE", icone: "portao", pronta: true, prefixo: "ale", idioma: true, letra: "DE" },
  { id: "sanscrito", nome: "Sânscrito", desc: "Módulos criados; os temas vêm depois.", rota: "#/sanscrito", cor: "--mSA", icone: "om", pronta: true, prefixo: "san", idioma: true, letra: "सं" },
];
window.PROJETO = { nome: "Jarvis" };
