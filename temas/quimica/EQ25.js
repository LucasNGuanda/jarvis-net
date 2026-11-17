/* Química EQ25 · Experimento: indicador de repolho roxo. Simulação SIM.eqRepolho (assets/sims/quimica/exp-solucoes.js).
   DADOS (tools/quimica/dadosX.json, seção "repolho_roxo"; conferidos por tools/quimica/confere-dadosX.py):
   cores do extrato (Wikipedia "Anthocyanin" e "Red cabbage"): ácido, vermelho, rosa ou magenta; neutro, roxo; básico, de azul a verde a amarelo.
   pH de soluções comuns (Wikipedia "PH", tabela "Average pH of common solutions"): suco de limão 2,2; vinagre 2 a 3; suco de laranja 3,3 a 4,2; café preto 5 a 5,03;
   leite 6,5 a 6,8; água pura 7; água do mar 7,5 a 8,4; amônia 11,0 a 11,5; água sanitária 12,5; soda cáustica 14.
   A fonte só dá as três faixas de cor: a posição das viragens dentro da faixa básica é ilustrativa (dito na tela). Bicarbonato e sabão ficaram de fora: a fonte não traz o pH deles.
   No teste (tests/texpq.js): limão e vinagre vermelhos; água roxa; amoníaco e água sanitária na faixa básica; antes de pingar, nenhuma cor é mostrada. */
F.registrar("quimica/EQ25", {
  retoma: ["F08", "J03"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 25 · soluções</div><div class="q">Quem cozinha repolho roxo sabe: na panela ele fica azulado, e um fio de vinagre devolve o vermelho. O repolho está reagindo a quê?</div><p>Ao pH. O pigmento do repolho muda de cor conforme o meio é ácido ou básico. Sem saber, a cozinha inteira já usou um indicador.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Escolha até seis substâncias de casa, preveja a cor de cada uma e pingue o extrato. Depois confira com o pH.</p><div id="exp-rep"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. O que é um indicador</h3>
        <p>Um indicador ácido-base é uma substância que tem duas (ou mais) formas de cores diferentes, uma com um $\ce{H+}$ a mais que a outra. Em meio ácido predomina a forma com o próton; em meio básico, a forma sem ele ${F.ret("J03")}. A cor denuncia de que lado o equilíbrio está.</p>
        <h3>2. As antocianinas</h3>
        <p>A cor do repolho roxo vem das <b>antocianinas</b>, pigmentos cuja estrutura muda com o pH. Elas têm mais de duas formas, e por isso o extrato não vira só uma vez: passa por várias cores ao longo da escala. Em meio ácido, vermelho ou rosa; perto do neutro, roxo; em meio básico, azul, depois verde e amarelo.</p>
        <h3>3. A escala de pH na cozinha</h3>
        ${F.formula(R`\mathrm{pH} = -\log[\ce{H+}]`)}
        <p>Cada unidade de pH é um fator 10 na concentração de $\ce{H+}$ ${F.ret("F08")}. O suco de limão (pH 2,2) é mais de dez mil vezes mais ácido que o leite (pH 6,5 a 6,8). Do lado básico estão os produtos de limpeza: amoníaco, água sanitária, soda cáustica.</p>
        ${F.caixa("fisico", R`<p><b>Um indicador não é um medidor.</b> O extrato separa bem ácido, neutro e básico, mas não distingue pH 2 de pH 3. Para um número, usa-se uma escala de cores calibrada (papel indicador universal) ou um pHmetro. Saber o que cada ferramenta consegue responder faz parte de medir.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>"Ácido é o que corrói."</b> Bases fortes, como a soda cáustica, são tão perigosas quanto.</p><p><b>pH 7 não é "sem nada".</b> É o ponto em que $[\ce{H+}] = [\ce{OH-}]$.</p><p><b>A cor depende do indicador.</b> Vermelho quer dizer ácido para o repolho; para a fenolftaleína, o rosa quer dizer básico.</p>`)}
        ${F.caixa("pegadinha", R`<p>Este é um bom experimento para fazer em casa, com um adulto: ferva folhas de repolho roxo picadas, coe e use o líquido. Teste vinagre, suco de limão, leite e água. Com produtos de limpeza, só com um adulto e em pouquíssima quantidade: água sanitária e soda cáustica queimam a pele e os olhos, e <b>nunca</b> se mistura água sanitária com amoníaco nem com ácidos (formam gases tóxicos). Tudo o que foi testado em pequena quantidade pode ir para o ralo com bastante água.</p>`, "Segurança e descarte")}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-rep"); e.outerHTML = F.lab("Indicador de repolho roxo: a cor que mede o pH", "exp-rep"); SIM.eqRepolho(document.getElementById("exp-rep"), F); },
});
