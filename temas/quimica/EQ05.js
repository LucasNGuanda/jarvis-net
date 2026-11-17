/* Química EQ05 · Experimento: colisões e energia de ativação. Simulação SIM.eqColisoes (assets/sims/quimica/exp-reacoes.js): 60 A + 60 B, discos rígidos em 2D,
   paredes térmicas. Um choque A–B é eficaz quando a energia ao longo da linha dos centros, ½·μ·v_n² (μ = m/2), passa de Ea.
   Para discos rígidos, a fração de choques com essa energia acima de Ea é e^(−Ea/kT) (a velocidade normal relativa dos pares que se chocam tem densidade ∝ v·e^(−μv²/2kT)).
   No teste (tests/texpq.js, semente fixa, só contando): Ea = 2 a 300 K → e^(−2) = 13,5%; a 600 K → e^(−1) = 36,8%; Ea = 4 a 300 K → 1,8%.
   MODELO: Ea é um número da simulação (em unidades de kT a 300 K), não de uma reação real. */
F.registrar("quimica/EQ05", {
  retoma: ["F04", "E02"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 5 · reações</div><div class="q">Num gás, cada molécula sofre bilhões de choques por segundo. Se todo choque entre reagentes virasse produto, toda reação entre gases terminaria num piscar de olhos. Por que a maioria não termina?</div><p>Porque quase todos os choques são fracos demais. Só reage quem bate com energia suficiente para atravessar uma barreira: a energia de ativação.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Deixe a reação correr e compare a fração de choques eficazes com o fator de Arrhenius. Depois mude a temperatura e a energia de ativação.</p><div id="exp-col"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. A barreira</h3>
        <p>Para A e B virarem produto, ligações precisam se esticar e se quebrar antes de as novas se formarem. Isso custa energia, e o custo mínimo é a <b>energia de ativação</b> $E_a$ ${F.ret("F04")}. Quem paga é a energia cinética do próprio choque. E não vale qualquer choque forte: conta a parte da velocidade ao longo da linha que une os centros. Uma batida de raspão, por mais rápida que seja, não espreme as moléculas uma contra a outra.</p>
        <h3>2. O fator de Arrhenius</h3>
        ${F.formula(R`\text{fração de choques eficazes} = e^{-E_a/RT} \qquad\Longrightarrow\qquad k = A\,e^{-E_a/RT}`)}
        <p>A distribuição de velocidades ${F.ret("E02")} garante que sempre há algumas moléculas rápidas. A fração de choques com energia acima de $E_a$ é $e^{-E_a/RT}$. No experimento, ela é <b>medida</b>: o site conta os choques entre A e B e, entre eles, os que passaram da barreira. A constante de velocidade $k$ é essa fração vezes a frequência de choques (o fator $A$).</p>
        <h3>3. Por que a temperatura manda tanto</h3>
        <p>Dobrar a temperatura (em kelvin) aumenta a frequência de choques em uns 40% (ela vai com $\sqrt{T}$). Mas a fração eficaz pode ser multiplicada por dezenas: com $E_a = 4$ unidades, ela vai de $e^{-4} = 1{,}8\%$ para $e^{-2} = 13{,}5\%$. É a exponencial que faz a comida estragar muito mais devagar na geladeira.</p>
        ${F.caixa("fisico", R`<p><b>A curva conta a história.</b> O reagente some depressa no começo e cada vez mais devagar: quanto menos A e B sobram, mais raros os encontros entre eles. A velocidade depende da concentração, e a concentração cai porque a reação anda. É daí que saem as leis de velocidade.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>"Aquecer aumenta os choques, por isso acelera."</b> É a menor parte do efeito. O que muda de verdade é a <b>fração</b> de choques eficazes.</p><p><b>$E_a$ não é a energia liberada.</b> A barreira é o que precisa ser pago para começar; o saldo da reação ($\Delta H$) é outra coisa.</p><p><b>Flutuação.</b> Com poucos choques contados, a fração medida oscila em torno da prevista. Deixe acumular.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-col"); e.outerHTML = F.lab("Colisões e energia de ativação: quem bate forte reage", "exp-col"); SIM.eqColisoes(document.getElementById("exp-col"), F); },
});
