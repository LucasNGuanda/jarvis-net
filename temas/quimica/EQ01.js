/* Química EQ01 · Experimento: difusão e efusão. Simulação SIM.eqDifusao (assets/sims/quimica/exp-gases.js): discos rígidos em 2D, a 300 K, velocidades ∝ 1/√M.
   Massas molares: SIM.GASM (as mesmas do módulo E). Conferido em Python (tools/quimica/confere-exp-gases.py): √(32/2) = 4,00; √(44/28) = 1,25; √(40/4) = 3,16.
   No modo efusão as moléculas não se chocam (gás rarefeito), a não ser com "gás denso" ligado: aí a razão cai abaixo da de Graham (escoamento, não efusão).
   No teste (tests/texpq.js, com semente fixa): H₂ × O₂, 600 s de simulação: razão medida a menos de 12% de 4; com o gás denso, abaixo de 3,4. */
F.registrar("quimica/EQ01", {
  retoma: ["E02", "E03"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 1 · gases</div><div class="q">Alguém abre um frasco de perfume no canto da sala. As moléculas voam a centenas de metros por segundo, mas o cheiro leva um bom tempo para chegar do outro lado. E um balão de hélio murcha de um dia para o outro, enquanto um de ar dura bem mais. Por quê?</div><p>As duas respostas saem da mesma ideia: à mesma temperatura, molécula leve é molécula rápida. Só que andar rápido não é o mesmo que chegar rápido.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Escolha os dois gases. No primeiro modo, tire a parede e acompanhe a mistura. No segundo, deixe os gases escaparem por um furo e compare as contagens com a lei de Graham.</p><div id="exp-dif"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Mesma temperatura, mesma energia cinética média</h3>
        ${F.formula(R`\tfrac12 m\,\overline{v^2} = \tfrac32 kT \quad\Longrightarrow\quad v_\text{rms} = \sqrt{\frac{3RT}{M}}`)}
        <p>A temperatura fixa a energia cinética média das moléculas ${F.ret("E02")}. Se dois gases estão à mesma temperatura, o de menor massa molar $M$ precisa ser mais rápido: a velocidade vai com $1/\sqrt{M}$. O $\ce{H2}$ ($M = 2$) é quatro vezes mais rápido que o $\ce{O2}$ ($M = 32$).</p>
        <h3>2. Efusão: a lei de Graham</h3>
        ${F.formula(R`\frac{\text{taxa de A}}{\text{taxa de B}} = \sqrt{\frac{M_\text{B}}{M_\text{A}}}`)}
        <p><b>Efusão</b> é a passagem do gás por um furo pequeno para o vácuo. O número de moléculas que acertam o furo por segundo é proporcional a quantas há e a quão rápido elas andam. Com quantidades iguais dos dois gases, a razão das taxas é a razão das velocidades. No experimento, a razão medida demora a assentar: são poucas moléculas, e o acaso pesa. É o que acontece em qualquer medida de contagem.</p>
        <h3>3. Difusão: rápido, mas em zigue-zague</h3>
        <p><b>Difusão</b> é a mistura de um gás no outro. Aqui as moléculas não têm caminho livre: batem umas nas outras o tempo todo e mudam de direção a cada choque. Por isso o gás leve ainda chega primeiro (a curva azul sobe antes), mas os dois demoram muito mais que o tempo de atravessar a caixa em linha reta. É por isso que o perfume demora.</p>
        ${F.caixa("fisico", R`<p><b>Como ler o gráfico.</b> No modo de difusão, cada curva mostra que fração de um gás já está na metade que era do outro. As duas tendem a 50%: mistura uniforme. Elas nunca param exatamente em 50%, ficam tremendo em volta: o equilíbrio é dinâmico, as moléculas continuam cruzando nos dois sentidos.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>Graham é raiz quadrada.</b> Um gás 16 vezes mais leve escapa 4 vezes mais rápido, não 16.</p><p><b>A razão é invertida.</b> Taxa de A sobre taxa de B é $\sqrt{M_\text{B}/M_\text{A}}$: a massa do <b>outro</b> gás vai em cima.</p><p><b>Efusão não é difusão.</b> Na efusão não há choques no caminho (furo para o vácuo), e a lei de Graham vale bem. Na difusão os choques dominam, e a lei só dá a tendência.</p><p><b>Graham tem condição.</b> A lei vale para gás rarefeito e furo pequeno, quando cada molécula sai sozinha. Ligue "gás denso" no experimento: as moléculas se chocam perto do furo, saem em conjunto, e a razão medida fica abaixo da prevista.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-dif"); e.outerHTML = F.lab("Difusão e efusão: o gás leve chega primeiro", "exp-dif"); SIM.eqDifusao(document.getElementById("exp-dif"), F); },
});
