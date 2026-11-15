/* =====================================================================================================
   JARVIS — configuração da busca (β 4.2). SEM inteligência artificial e sem API: é só uma busca dentro do site, com personagem.
   O índice dos temas é GERADO (tools/gera-indice.js → assets/indice-busca.js); aqui fica só o que não sai dos temas:
     • sinonimos:  "o que eu digito" → ["o que a busca procura também"]. Sem acento e em minúsculas não importa (a busca normaliza).
     • navegacao:  perguntas sobre o próprio site ("onde fica a legenda?"): resposta direta e o lugar para onde leva.
                   ir: rota ("#/codigos") ou "materia" (página inicial da primeira aba que a pessoa pode abrir; com rota: "sumario"
                   ou "legenda", abre o sumário ou a legenda dessa aba).
                   destaque: elemento que pisca ao chegar. nivel: (opcional) parte da engrenagem exigida (ver acesso-config.js).
     • frases:     12+1 respostas do personagem para dúvida de matéria. {lugar} vira o link do tema achado pela busca.
     • palavrasVazias: palavras que não contam na busca ("onde", "fica", "de"…).
   ===================================================================================================== */
window.JARVIS_CFG = {
  sinonimos: {
    "mol": ["estequiometria", "quantidade de materia"],
    "queda livre": ["lancamento vertical"],
    "meia vida": ["radioatividade", "decaimento"],
    "pendulo": ["mhs", "oscilacoes"],
    "mhs": ["movimento harmonico simples"],
    "derivada": ["derivadas", "regra da cadeia"],
    "integral": ["integrais", "integracao"],
    "atrito": ["forca de atrito"],
    "empuxo": ["arquimedes", "hidrostatica"],
    "bernoulli": ["fluidos", "hidrodinamica"],
    "luz": ["optica"],
    "eletricidade": ["eletrostatica", "circuitos"],
    "calor": ["termodinamica", "calorimetria"],
    "gas": ["gases", "termodinamica"],
    "relatividade": ["einstein"],
    "quantica": ["fisica moderna", "efeito fotoeletrico"],
    "newton": ["leis de newton", "dinamica"],
    "tabela periodica": ["periodicidade"],
    "ph": ["acidos e bases"],
    "pa": ["progressao aritmetica"],
    "pg": ["progressao geometrica"],
    "log": ["logaritmo"],
    "trigonometria": ["seno", "cosseno"],
  },

  navegacao: [
    { id: "legenda", chaves: ["legenda", "simbolos", "marcacoes", "estrelinha", "o que significa a estrela"], ir: "materia", rota: "legenda",
      resposta: "A legenda dos símbolos (★, !, !!, ?, ∫, ITA, RU…) fica em “Legenda e símbolos”, no topo de cada matéria. Te levo lá." },
    { id: "exportar", chaves: ["exportar", "exporto", "exporta", "backup", "salvar progresso", "salvo meu progresso", "guardar progresso"], ir: "materia", destaque: "#bt-exp",
      resposta: "O “Exportar progresso (.json)” fica no menu lateral de qualquer matéria, embaixo dos módulos. Leva tudo: temas feitos, marcações, acesso e a tela inicial." },
    { id: "importar", chaves: ["importar", "importo", "importa", "restaurar", "carregar progresso"], ir: "materia", destaque: "#bt-imp",
      resposta: "O “Importar progresso” fica no menu lateral, logo abaixo do exportar. Ele soma ao que já está salvo, não apaga." },
    { id: "sumario", chaves: ["sumario", "lista de temas", "todos os temas", "indice"], ir: "materia", rota: "sumario",
      resposta: "O sumário fica no topo de cada matéria (“Sumário”): todos os temas da aba, com o progresso." },
    { id: "codigos", chaves: ["codigo", "codigos", "acesso", "destravar", "liberar", "senha", "cadeado"], ir: "#/codigos",
      resposta: "Os códigos ficam na página do cadeado, ao lado da engrenagem da tela inicial." },
    { id: "inicio", chaves: ["tela inicial", "home", "pagina inicial", "voltar ao inicio"], ir: "#/home",
      resposta: "Tela inicial: o botão “Home” no topo de qualquer página." },
    { id: "calculadora", chaves: ["calculadora", "casio", "fx 991", "fx 82"], ir: "materia", destaque: "#bt-config",
      resposta: "As calculadoras ligam na engrenagem do topo de qualquer matéria (⚙ → Calculadora). Uma de cada vez." },
    { id: "tema", chaves: ["tema claro", "tema escuro", "modo escuro", "modo claro", "cores do site"], ir: "materia", destaque: "#bt-config",
      resposta: "Tema claro ou escuro: engrenagem do topo de qualquer matéria (⚙)." },
    { id: "personalizar", chaves: ["adesivo", "adesivos", "figura central", "personalizar", "engrenagem", "planeta", "galaxia", "buraco negro"], ir: "#/home", destaque: ".jv-engrenagem", nivel: "painel",
      resposta: "Adesivos e figura central: engrenagem ao lado do campo do Jarvis, na tela inicial." },
    { id: "continuar", chaves: ["continuar de onde parei", "onde parei", "ultimo tema", "continuar"], ir: "materia", destaque: ".continuar",
      resposta: "O “Continuar de onde parei” aparece no alto da página inicial de cada aba, depois que você abre algum tema." },
    { id: "atalho", chaves: ["atalho", "busca", "buscar", "pesquisar", "ctrl k"], ir: null,
      resposta: "Ctrl K (ou ⌘ K no Mac) abre esta busca em qualquer página. Esc fecha." },
  ],

  /* {lugar} = "Matéria, aba X, CÓDIGO · nome do tema" (a aba só aparece quando o nome dela é diferente do da matéria) */
  frases: [
    "Eu até poderia te responder, mas você aprende melhor em {lugar}.",
    "Sei a resposta. Guardo para mim. Está em {lugar}.",
    "Resposta pronta não fixa. Vai em {lugar}.",
    "Poderia, mas seria roubo. Caminho: {lugar}.",
    "Spoiler eu não dou. Mapa eu dou: {lugar}.",
    "Se eu contar, amanhã você esquece. Se você fizer, fica. {lugar}.",
    "Minha função é apontar, não resolver. Aponto: {lugar}.",
    "Hoje não. Mas {lugar} responde, e com figura.",
    "Pergunta boa. A resposta melhor ainda mora em {lugar}.",
    "Tenho a resposta e um princípio: você chega lá sozinho. Começa por {lugar}.",
    "Na prova eu não vou estar lá. {lugar} vai estar na sua cabeça.",
    "Negativo. Mas te deixo na porta: {lugar}.",
    "Isso se descobre, não se recebe. {lugar}.",
  ],

  palavrasVazias: ["o", "a", "os", "as", "um", "uma", "de", "do", "da", "dos", "das", "e", "em", "no", "na", "nos", "nas", "que", "onde", "fica", "ficam", "esta", "estao", "cade",
    "qual", "quais", "como", "sobre", "pra", "para", "por", "com", "me", "eu", "meu", "minha", "isso", "essa", "esse", "este", "esta", "tem", "ver", "mostra", "mostrar", "achar", "acho",
    "explica", "explicam", "explicar", "fala", "falar", "tema", "temas", "assunto", "parte", "lugar", "jarvis", "ai", "aqui", "la", "se", "ao", "aos", "the", "of", "formula", "formulas",
    "resolve", "resolver", "resolvo", "calcula", "calcular", "faz", "faco", "fazer", "vale", "quanto", "quanta", "porque", "pq", "significa", "sao", "ensina", "responde", "ajuda", "conta",
    "essa", "dessa", "desse", "deste", "desta"],
};
