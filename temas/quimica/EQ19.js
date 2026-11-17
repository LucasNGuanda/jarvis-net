/* Química EQ19 · Experimento: tabela periódica que acende. Simulação SIM.eqTabela (assets/sims/quimica/exp-atomos.js): mapa de calor de uma propriedade nos 118 elementos.
   DADOS: window.TABELA_DADOS (assets/tabela-dados.js; fontes e brancos em docs/TABELA_PERIODICA_DADOS.md). Valor ausente fica "sem dado" (célula tracejada), nunca preenchido.
   O raio da tabela é o de van der Waals (dito na tela). Posição de cada elemento: SIM.eqPosTabela(Z).
   No teste (tests/texpq.js): 118 células; H em (1,1), He em (18,1), B em (13,2), Fe em (8,4), La em (3,8), Hf em (4,6), Og em (18,7); maior eletronegatividade: F; maior energia de ionização: He. */
F.registrar("quimica/EQ19", {
  retoma: ["B06", "B07"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 19 · átomos e ligações</div><div class="q">Mendeleiev organizou os elementos sem saber o que era um elétron e, mesmo assim, previu elementos que ninguém tinha visto. O que ele enxergou na tabela que permitia adivinhar?</div><p>Um desenho que se repete. Pinte a tabela com uma propriedade qualquer e o padrão aparece sozinho.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Escolha uma propriedade e veja a tabela acender. Procure o que se repete de um período para o outro e leia os valores passando o mouse.</p><div id="exp-tab"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Periodicidade</h3>
        <p>Colocados em ordem de número atômico, os elementos repetem propriedades a intervalos regulares. A tabela foi desenhada para pôr os parecidos na mesma coluna ${F.ret("B06")}. A razão é a configuração eletrônica: a cada período começa uma camada nova, e os elementos de um mesmo grupo têm o mesmo número de elétrons de valência.</p>
        <h3>2. Duas forças em disputa</h3>
        <p>Ao longo de um período, o núcleo ganha prótons e os elétrons entram na mesma camada: a atração aumenta, o átomo encolhe, fica mais difícil arrancar um elétron (energia de ionização maior) e o átomo puxa mais os elétrons de uma ligação (eletronegatividade maior). Descendo num grupo, entra uma camada a mais: o elétron de fora fica mais longe e mais blindado, e tudo se inverte ${F.ret("B07")}.</p>
        <h3>3. O dente de serra</h3>
        <p>No gráfico de baixo, a energia de ionização sobe ao longo de cada período e despenca no início do seguinte: é mais fácil tirar o elétron que inaugura uma camada nova. Os picos são os gases nobres; os vales, os metais alcalinos.</p>
        ${F.caixa("fisico", R`<p><b>Procure as exceções.</b> As tendências são gerais, não leis. Olhe a energia de ionização do berílio para o boro, ou do nitrogênio para o oxigênio: ela cai um pouco em vez de subir. Essas quebras têm explicação (um subnível novo, um elétron que precisa emparelhar) e são as preferidas de prova.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Qual raio?</b> Há vários (covalente, metálico, iônico, de van der Waals), medidos de jeitos diferentes. O desta tabela é o de van der Waals, e a tendência dele é menos regular que a do raio covalente dos livros.</p><p><b>Célula tracejada não é zero.</b> É valor que a fonte não traz.</p><p><b>Gases nobres e eletronegatividade.</b> A escala de Pauling não dá valor para vários deles.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-tab"); e.outerHTML = F.lab("Tabela periódica que acende: as tendências aparecem sozinhas", "exp-tab"); SIM.eqTabela(document.getElementById("exp-tab"), F); },
});
