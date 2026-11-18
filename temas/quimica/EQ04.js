/* Química EQ04 · Experimento: gás real × gás ideal. Simulação SIM.eqReal (assets/sims/quimica/exp-gases.js): dinâmica molecular de 64 partículas de Lennard-Jones em 2D,
   condições periódicas, corte em 2,5σ, Verlet com velocidades (passo 0,004), termostato por reescala suave. Z = 1 + (Σ r·F)/(2NkT), média no tempo.
   B₂(T) = −π∫(e^(−u/T) − 1) r dr (até o corte), integrado no site e conferido em Python (tools/quimica/confere-exp-gases.py): B₂(0,8) = −1,895; B₂(1) = −0,993; B₂(1,5) = −0,014; B₂(4) = +0,891 (em σ²); temperatura de Boyle: T* = 1,51.
   Constantes de van der Waals da tabela: SIM.VDW (Wikipedia, "Van der Waals constants (data page)", em tools/quimica/dadosE.json).
   MODELO: unidades reduzidas, duas dimensões; não representa um gás específico (dito na tela). */
F.registrar("quimica/EQ04", {
  retoma: ["E02", "C06"],
  html(F) {
    const R = String.raw, V = SIM.VDW, vg = SIM.vg;
    const tab = D.svg(560, 26 + 20 * 7, SIM.dq.tab(90, 8, [120, 130, 130], [["gás", "a (L²·bar/mol²)", "b (L/mol)"], ...Object.keys(V).map((k) => [V[k][0], vg(V[k][1], 4), vg(V[k][2], 5)])]), "figura");
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 4 · gases</div><div class="q">A equação PV = nRT trata as moléculas como pontos que não se enxergam. Mas moléculas de verdade têm tamanho e se atraem; se não se atraíssem, nenhum gás viraria líquido. Quando é que essa diferença aparece na pressão, e para que lado?</div><p>Para os dois lados, dependendo da situação. Este experimento deixa as moléculas se atraírem e se empurrarem de verdade e mede o resultado.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Comece frio e pouco denso e vá apertando o gás (aumentando a densidade). Depois repita com o gás quente. Cada medida fica marcada no gráfico.</p><div id="exp-real"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. O fator de compressibilidade</h3>
        ${F.formula(R`Z = \frac{PV}{nRT} \qquad (\text{gás ideal: } Z = 1)`)}
        <p>$Z$ compara a pressão do gás real com a que um gás ideal teria na mesma densidade e temperatura ${F.ret("E02")}. $Z \lt 1$: o gás empurra <b>menos</b> que o ideal. $Z \gt 1$: empurra <b>mais</b>.</p>
        <h3>2. Dois efeitos brigando</h3>
        <p><b>Atração.</b> A distâncias de alguns diâmetros, as moléculas se atraem ${F.ret("C06")}. Uma molécula que vai bater na parede é puxada para trás pelas vizinhas e bate mais fraco: a pressão cai. Esse efeito manda quando o gás está frio (as moléculas passam devagar umas pelas outras e "sentem" a atração) e não muito denso.</p>
        <p><b>Volume próprio.</b> Moléculas não se atravessam. Quando o gás é muito apertado, o espaço livre para cada uma é bem menor que o volume do recipiente, as batidas ficam mais frequentes e a pressão sobe acima da ideal.</p>
        ${F.formula(R`\left(P + \frac{a\,n^2}{V^2}\right)(V - nb) = nRT`)}
        <p>Na equação de van der Waals, $a$ mede a atração e $b$, o volume das moléculas:</p>
        ${F.fig(tab, "Constantes de van der Waals (Wikipedia, \"Van der Waals constants (data page)\"). O hélio quase não se atrai (a pequeno); a amônia e o CO₂, muito.")}
        <h3>3. O que o gráfico mostra</h3>
        <p>A baixa densidade, $Z \approx 1 + B_2(T)\,\rho$: uma reta. O coeficiente $B_2$ é negativo quando a atração vence (frio) e positivo quando a repulsão vence (quente); a temperatura em que ele se anula é a <b>temperatura de Boyle</b>, na qual o gás real se comporta como ideal numa boa faixa de pressões. A alta densidade, a curva sempre sobe: no fim, o tamanho das moléculas ganha.</p>
        ${F.caixa("fisico", R`<p><b>Quando posso confiar em PV = nRT?</b> Quando as moléculas passam a maior parte do tempo longe umas das outras e rápidas demais para a atração importar: pressão baixa e temperatura alta. Perto da condensação (frio e apertado), a conta ideal erra feio. No experimento, as moléculas ficam laranja quando andam coladas: muito laranja é sinal de que o gás está a caminho de virar líquido.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>"Gás real tem pressão menor."</b> Só quando a atração domina. Muito comprimido, tem pressão <b>maior</b> que o ideal.</p><p><b>Z não é constante do gás.</b> Depende da temperatura e da pressão.</p><p><b>Modelo.</b> A simulação usa um potencial genérico (Lennard-Jones), em duas dimensões e em unidades próprias. Ela mostra o comportamento, não os números de um gás específico.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-real"); e.outerHTML = F.lab("Gás real × gás ideal: moléculas que se atraem e ocupam espaço", "exp-real"); SIM.eqReal(document.getElementById("exp-real"), F); },
});
