/* EP11 · Máquina de Carnot. Conferido em Python: Carnot 600/300 K: 50%; motor real (Curzon–Ahlborn + 10% de atrito):
   T_q' = T_q(1 + √(T_f/T_q))/2 = 512 K, T_f' = 362 K, η_CA = 1 − √(T_f/T_q) = 29,3%, real 26,4%, entropia gerada 3,07 J/K por ciclo (V_B/V_A = 2,5);
   900/300 K: 66,7% × 38,0%; 400/350 K: 12,5% × 5,8%. O real nunca passa de Carnot. */
F.registrar("EP11", {
  retoma: ["T08", "T07"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 11 · termodinâmica</div><div class="q">Por que nenhum motor do mundo, nem o mais perfeito que a engenharia conseguir fazer, transforma todo o calor do combustível em trabalho?</div><p>Veja um motor ideal funcionando, ciclo a ciclo, e compare com um motor de verdade.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>O gás (1 mol, monoatômico) passa pelas quatro etapas do ciclo de Carnot. Mude as temperaturas das fontes e ligue o motor real.</p><div id="lab-carnotm"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. O que está acontecendo</h3>
        <p>Nas duas isotérmicas o gás troca calor com uma fonte, sem mudar de temperatura; nas duas adiabáticas ele está isolado e só troca trabalho, esfriando (na expansão) ou esquentando (na compressão) ${F.ret("T07")}. O trabalho por ciclo é a área dentro da curva, e o calor que sai na fonte fria nunca é zero.</p>
        ${F.formula(R`\frac{Q_f}{Q_q} = \frac{T_f}{T_q}\quad\Rightarrow\quad \eta_\text{Carnot} = 1 - \frac{T_f}{T_q}`)}
        <p>A demonstração está em ${F.ret("T08")}: os volumes das adiabáticas fazem os logaritmos das duas isotérmicas serem iguais.</p>
        <h3>2. O motor real</h3>
        <p>Um ciclo de Carnot de verdade teria de ser infinitamente lento (calor só passa sem perdas se a diferença de temperatura for zero). Um motor real precisa de potência: o calor entra por uma diferença de temperatura finita, e o gás trabalha entre $T_q' < T_q$ e $T_f' > T_f$. Otimizando a potência (Curzon e Ahlborn, 1975), o rendimento fica:</p>
        ${F.formula(R`\eta_\text{CA} = 1 - \sqrt{\frac{T_f}{T_q}}`)}
        <p>No laboratório ainda se descontam 10% do trabalho por atrito. Resultado: sempre abaixo de Carnot, e com entropia gerada a cada ciclo ${F.ret("T08b")}.</p>
        ${F.caixa("fisico", R`<p><b>A fórmula de Curzon–Ahlborn acerta usinas reais.</b> Uma termelétrica com vapor a 838 K e rio a 298 K tem Carnot de 64%, Curzon–Ahlborn de 40% e rendimento medido de ~36%. O limite de Carnot é verdadeiro, mas otimista demais para quem precisa de potência.</p>`)}
        ${F.caixa("pegadinha", R`<p><b>Rendimento de 100% exigiria fonte fria a 0 K</b>, que a 3ª lei proíbe. E não adianta trocar o gás: todo motor reversível entre as mesmas fontes tem o mesmo rendimento (teorema de Carnot).</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-carnotm"); e.outerHTML = F.lab("Máquina de Carnot", "lab-carnotm"); SIM.carnotMaquina(document.getElementById("lab-carnotm"), F); },
});
