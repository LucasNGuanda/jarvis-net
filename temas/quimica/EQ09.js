/* Química EQ09 · Experimento: pilha de Daniell com o tempo correndo. Simulação SIM.eqDaniell (assets/sims/quimica/exp-eletro.js).
   Potenciais: SIM.ELETRO (Zn²⁺/Zn −0,76 V; Cu²⁺/Cu +0,34 V; apêndice L do OpenStax, em tools/quimica/dadosG.json). E° = 1,10 V. Nernst a 25 °C, n = 2.
   Conta: I = E/R; dn = I·dt/(2F); béqueres de 100 mL a 1 mol/L; eletrodos de 10 g. Resistência interna desprezada (dito na tela).
   No teste (tests/texpq.js): E inicial 1,100 V; mol de Zn gasto = mol de Cu depositado = Q/(2F); a tensão cai com o uso; sem ponte ou com a chave aberta, nada muda; no fim, E = 0 com [Cu²⁺] = 0. */
F.registrar("quimica/EQ09", {
  retoma: ["G01", "G02"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 9 · eletroquímica</div><div class="q">Mergulhe zinco numa solução de sulfato de cobre: o zinco se cobre de cobre e a solução esquenta. É uma reação com troca de elétrons, e a energia se perde como calor. Como obrigar esses elétrons a passar por um fio, para fazer alguma coisa útil no caminho?</div><p>Separando os dois lados da reação. Se o zinco e o Cu²⁺ não se tocam, os elétrons só têm um caminho: o fio. Isso é uma pilha.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Deixe a pilha trabalhar e acompanhe os eletrodos, a cor da solução e a tensão. Depois abra a chave e tire a ponte salina.</p><div id="exp-dan"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Duas meias reações, em dois lugares</h3>
        ${F.formula(R`\text{ânodo: } \ce{Zn(s) -> Zn^{2+}(aq) + 2 e-} \qquad \text{cátodo: } \ce{Cu^{2+}(aq) + 2 e- -> Cu(s)}`)}
        <p>O zinco tem potencial de redução menor que o do cobre: é ele quem cede elétrons ${F.ret("G01")}. No <b>ânodo</b> (zinco) há oxidação, e o eletrodo se desgasta; no <b>cátodo</b> (cobre) há redução, e o eletrodo engrossa. Os elétrons vão do zinco para o cobre pelo fio.</p>
        ${F.formula(R`E^\circ = E^\circ_\text{cátodo} - E^\circ_\text{ânodo} = 0{,}34 - (-0{,}76) = 1{,}10\ \text{V}`)}
        <h3>2. Para que serve a ponte salina</h3>
        <p>Quando o zinco solta $\ce{Zn^{2+}}$, o béquer da esquerda ganha carga positiva; quando o $\ce{Cu^{2+}}$ se deposita, o da direita fica com ânions sobrando. Sem compensar isso, a reação pararia quase na hora. A ponte salina deixa íons passarem: ânions para o lado do zinco, cátions para o lado do cobre. O circuito se fecha: elétrons por fora, íons por dentro.</p>
        <h3>3. Por que a pilha acaba</h3>
        ${F.formula(R`E = E^\circ - \frac{0{,}0592}{2}\,\log\frac{[\ce{Zn^{2+}}]}{[\ce{Cu^{2+}}]}`)}
        <p>Com o uso, $[\ce{Zn^{2+}}]$ sobe e $[\ce{Cu^{2+}}]$ cai. Pela equação de Nernst ${F.ret("G02")}, a tensão diminui: devagar durante quase toda a vida da pilha (o logaritmo muda pouco) e depressa no fim, quando o $\ce{Cu^{2+}}$ está acabando. É a curva do gráfico, e é por isso que uma pilha "morre de repente".</p>
        ${F.caixa("fisico", R`<p><b>Confira a contabilidade.</b> Cada 2 mol de elétrons que passam pelo fio consomem 1 mol de zinco (65 g) e depositam 1 mol de cobre (63,5 g). Pare o experimento a qualquer momento e veja: a massa que o zinco perdeu, dividida por 65, é igual à que o cobre ganhou, dividida por 63,5.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Sinal dos polos.</b> Na pilha, o ânodo é o polo <b>negativo</b> (é de lá que saem os elétrons). Na eletrólise é o contrário.</p><p><b>Os elétrons não atravessam a solução.</b> Dentro da pilha, quem carrega a carga são os íons.</p><p><b>Tensão não é corrente.</b> Com a chave aberta, o voltímetro marca 1,10 V e nada se gasta.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-dan"); e.outerHTML = F.lab("Pilha de Daniell: os elétrons pelo fio, os íons pela ponte", "exp-dan"); SIM.eqDaniell(document.getElementById("exp-dan"), F); },
});
