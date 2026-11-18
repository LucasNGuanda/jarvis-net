/* Russo RL04 · Vocabulário de matemática em russo.
   Nada de memória. Os 74 termos, o gênero, o genitivo e o plural vêm dos verbetes do Wiktionary em inglês (SIM.RU.VOCM, GERADO de
   tools/russo/dadosRL.json). A tradução para o português é minha, e o gerador só a aceita se a palavra em inglês correspondente estiver numa
   definição do verbete; o campo "rot" diz se essa definição tem rótulo de domínio no dicionário (28 das 74 têm). A divisão em grupos é minha.
   Medida: regra do gênero do RG03 nos substantivos da lista (decide em 50 de 62 e acerta os 50, na geração de 18/11/2026; a página calcula na hora).
   Página montada por SIM.ruPaginaVocab (assets/sims/russo/leitura.js), a mesma do RL05. Vocabulário solto continua sendo assunto do Anki: aqui
   é treino na hora, sem repetição espaçada. */
F.registrar("russo/RL04", {
  retoma: ["RG03", "RG16"],
  html(F) {
    const R = String.raw, L = SIM.RU.VOCM, W = (w) => L.find((x) => x.w === w), ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`;
    return SIM.ruPaginaVocab(F, D, { lista: L, area: "matemática",
      pergunta: R`${ru(W("функция").ac, 22)}, ${ru(W("вектор").ac, 22)}, ${ru(W("интеграл").ac, 22)}: três palavras que você lê quase sem saber russo. E ${ru(W("уравнение").ac, 22)}, ${ru(W("дробь").ac, 22)}, ${ru(W("площадь").ac, 22)}? Essas não se parecem com nada, e estão em toda lista de exercícios.`,
      abertura: R`<p>Ler um enunciado de matemática em russo pede duas coisas: a gramática, que a outra aba cobriu, e um vocabulário pequeno e muito específico. Este tema reúne ${L.length} termos, do "número" à "derivada", com o que você precisa para usar cada um numa frase: o sentido, o gênero e o genitivo. Parte deles é internacional; a outra parte é russa de raiz e tem de ser aprendida.</p>`,
      chute: { q: "No dia a dia, «произведение» quer dizer \"obra\" (de arte, de literatura). O dicionário dá também um sentido com o rótulo de matemática. Qual?", ops: ["produto (resultado da multiplicação)", "soma", "raiz"], certa: 0, exp: "Produto. O verbete lista: criação; obra de arte; e, com o rótulo de matemática, produto." },
      demoTitulo: "Regra de leitura 4: três passos para um termo novo",
      demo: R`<p><b>Afirmação.</b> Todo termo técnico se resolve com três perguntas.</p><p><b>Passo a passo.</b> (i) <b>Qual é a forma do dicionário?</b> No texto a palavra vem declinada; volte ao nominativo singular. (ii) <b>Sentido geral ou sentido técnico?</b> ${ru(W("корень").ac)} é "raiz" de planta e, com rótulo de matemática, a raiz de um número; ${ru(W("степень").ac)} é "grau" e, com rótulo de matemática, "potência"; ${ru(W("разность").ac)} é "diferença" e, com o rótulo, o resultado da subtração. Num enunciado, o sentido técnico ganha. (iii) <b>Gênero e genitivo.</b> São eles que deixam você reconhecer a palavra depois de um número ou de uma preposição: ${ru(W("корень").ac)}, masculino, genitivo ${ru(W("корень").gen)}.</p>`,
      pegadinha: R`<p>Quatro termos têm cara de adjetivo feminino e são substantivos: ${ru(W("прямая").ac)} (reta), ${ru(W("переменная").ac)} (variável), ${ru(W("постоянная").ac)} (constante) e ${ru(W("производная").ac)} (derivada). O dicionário registra as duas coisas no mesmo verbete: a forma feminina do adjetivo e o substantivo, que em "variável" ele chama de adjetivo substantivado. Ao ler, se depois de uma dessas palavras não vier substantivo nenhum, ela é o substantivo.</p>`,
      olimpiada: R`<p>As operações vêm com a sua regência, e o verbete de ${ru(W("умножить").ac)} (multiplicar) a escreve: o que se multiplica vai no acusativo, e aquilo por que se multiplica vem com ${ru("на")} + acusativo. É a mesma ${ru("на")} da divisão que você viu nas preposições. Reconhecer ${ru(W("сумма").ac)}, ${ru(W("разность").ac)}, ${ru(W("произведение").ac)} e ${ru(W("частное").ac)} (os quatro resultados) resolve boa parte de um enunciado de aritmética. Aqui não há nenhuma questão real de prova.</p>`,
      ponte: R`<p>O grupo "análise" já fala a língua do cálculo que você conhece: ${ru(W("производная").ac)}, ${ru(W("интеграл").ac)}, ${ru(W("предел").ac)}, ${ru(W("ряд").ac)}. E dois adjetivos têm um sentido técnico escondido atrás do comum: ${ru(W("простой").ac)} é "simples", mas o dicionário dá também, com o rótulo de teoria dos números, "primo"; ${ru(W("целый").ac)} é "inteiro, todo" e também o número inteiro.</p>`,
      chefao: ["разность", "корень", "прямая", "площадь", "уравнение", "ось", "дробь", "треугольник"],
      chefaoF: R`O adjetivo ${ru(W("простой").ac)} tem dois sentidos que interessam à matemática. Quais, e qual deles vem com rótulo de domínio no dicionário?`,
      chefaoFsol: R`"Simples" (sentido geral) e "primo" (com o rótulo de teoria dos números): um "número simples" de um enunciado é um número primo.` });
  },
  montar(F) {
    const lista = SIM.RU.VOCM;
    let e = document.getElementById("lab-cartoes"); e.outerHTML = F.lab("Cartões: palavra, sentido, gênero", "lab-cartoes"); SIM.ruVocCartoes(document.getElementById("lab-cartoes"), F, { lista });
    e = document.getElementById("lab-pares"); e.outerHTML = F.lab("Jogo de pares: termo e tradução", "lab-pares"); SIM.ruVocPares(document.getElementById("lab-pares"), F, { lista });
    e = document.getElementById("lab-escreve"); e.outerHTML = F.lab("Escreva o termo em russo", "lab-escreve"); SIM.ruVocEscreve(document.getElementById("lab-escreve"), F, { lista });
    e = document.getElementById("lab-mapa"); e.outerHTML = F.lab("Mapa mental do vocabulário, grupo por grupo", "lab-mapa"); SIM.ruVocMapaLab(document.getElementById("lab-mapa"), F, { lista });
  },
});
