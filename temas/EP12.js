/* EP12 · O demônio de Maxwell. Conferido em código (simulação sem tela do demônio automático, 60 partículas, 120 s):
   a entropia do gás cai alguns k (−3 a −7 k), enquanto o custo de informação (passagens × ln 2) sobe muito mais (56 passagens → 38,8 k): o total fica ≥ 0. */
F.registrar("EP12", {
  retoma: ["T08b", "T05b", "T08"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 12 · termodinâmica</div><div class="q">Um ser minúsculo controla uma portinha entre duas caixas de gás e só deixa passar as moléculas rápidas para um lado e as lentas para o outro. Sem gastar energia, ele cria uma diferença de temperatura. A 2ª lei morreu?</div><p>Essa provocação de Maxwell (1867) levou mais de um século para ser respondida direito. Seja você o demônio.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Segure o botão para abrir a portinha. Tente separar vermelhas à direita e azuis à esquerda. Depois ligue o demônio automático e acompanhe as barras de entropia.</p><div id="lab-demonio"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. O que o demônio consegue</h3>
        <p>Abrindo a porta na hora certa, o lado direito fica com as moléculas rápidas (mais quente) e o esquerdo com as lentas (mais frio). A entropia do gás diminui ${F.ret("T08b")}: para um gás ideal em 2D, $S = Nk\left[\ln\frac AN + \ln T\right] + \text{cte}$ em cada lado, e separar quente de frio diminui a soma. Com essa diferença de temperatura, daria para rodar um motor ${F.ret("T08")}: um moto-perpétuo de segunda espécie.</p>
        <h3>2. Onde está a pegadinha: a informação</h3>
        <p>Para decidir, o demônio precisa <b>medir</b> cada molécula e guardar o resultado (pelo menos 1 bit: "rápida" ou "lenta"). A memória dele é finita: em algum momento ele tem de apagá-la para continuar. E apagar informação custa entropia:</p>
        ${F.formula(R`\Delta S_\text{apagar 1 bit} \ge k\ln2,\qquad Q_\text{mín} = kT\ln2\quad(\text{princípio de Landauer, 1961})`)}
        <p>No laboratório, cada partícula que passa conta 1 bit (e cada abertura inútil também). A barra amarela mostra $k\ln2$ por bit: ela cresce mais do que o gás perde, e o total fica positivo. Bennett (1982) fechou o argumento: medir pode ser feito sem custo; o custo inevitável é <b>apagar</b>.</p>
        ${F.caixa("fisico", R`<p><b>Já foi medido.</b> Em 2012, um grupo na França mediu o calor liberado ao apagar 1 bit guardado numa bolinha de vidro presa por laser: chegou ao limite de Landauer, $kT\ln2 \approx 3\times10^{-21}$ J a temperatura ambiente. Computadores atuais gastam milhões de vezes mais que isso por bit.</p>`)}
        ${F.caixa("pegadinha", R`<p><b>A porta não é o problema.</b> Ela pode ser leve e sem atrito, e não empurra as moléculas; o demônio quase não gasta energia mecânica. A 2ª lei é salva pela informação, não pela energia. Por isso "informação é física".</p>`)}
        ${F.caixa("olimpiada", R`<p><b>A máquina de Szilard (1929)</b>: uma única molécula numa caixa; o demônio descobre de que lado ela está (1 bit), põe um pistão e deixa a molécula empurrá-lo numa expansão isotérmica até o volume dobrar: trabalho $kT\ln2$ ${F.ret("T07")}. Exatamente o que o apagamento do bit custa depois. Informação e energia se convertem uma na outra com a "taxa de câmbio" $kT\ln2$.</p>`)}
        <p class="nota">Simplificação do laboratório: as partículas não colidem entre si (para a página ficar leve), então as velocidades de cada lado só mudam quando o demônio deixa alguém passar.</p>`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-demonio"); e.outerHTML = F.lab("O demônio de Maxwell", "lab-demonio"); SIM.demonio(document.getElementById("lab-demonio"), F); },
});
