/* EP18 · Escoamento ao redor de um cilindro (lattice Boltzmann D2Q9). Conferido fora do navegador (grade 200 × 80, D = 16, U = 0,1):
   Re = 40: sem desprendimento; Re = 60: esteira oscila (St 0,17); Re = 100: St 0,200; Re = 200: St 0,220 (≈ 1,3 ms por passo).
   Valores de laboratório (Williamson): 0,136 (Re 60), 0,164 (Re 100); a simulação dá ~20% a mais por causa do confinamento (o cilindro ocupa 20% do canal)
   e da grade grossa. Com grade 260 × 100 e D = 20 a diferença cai para ~11% (St 0,183 em Re 100), mas fica 70% mais lento. O início do desprendimento (entre 40 e 60) confere com o valor clássico ≈ 47. */
F.registrar("EP18", {
  retoma: ["N07", "N05", "A18"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 18 · fluidos</div><div class="q">Por que os fios de um poste "cantam" com o vento, e por que uma bandeira tremula mesmo com o vento constante?</div><p>Atrás de um obstáculo, o escoamento fica instável e passa a soltar redemoinhos alternados, num ritmo bem definido. Aqui as equações de Navier–Stokes são resolvidas de verdade, no seu navegador.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Comece em Re = 20 (dois vórtices presos), depois 60, 120 e 250. Espere alguns segundos a cada mudança: a esteira precisa de tempo para se formar.</p><div id="lab-cilindro"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. O número de Reynolds</h3>
        ${F.formula(R`Re = \frac{\rho UD}{\mu} = \frac{UD}{\nu}`)}
        <p>Ele compara a inércia do fluido com a viscosidade ${F.ret("N07")}. O mesmo $Re$ dá o mesmo desenho do escoamento, seja um fio de 1 mm no vento ou um pilar de ponte num rio. Com $Re$ baixo, a viscosidade domina e o fluido contorna o cilindro "colado"; acima de ~5, formam-se dois vórtices presos atrás; acima de ~47, eles começam a se soltar alternadamente: a <b>rua de vórtices de von Kármán</b>. Acima de ~190, no mundo real, a esteira vira tridimensional e, bem depois, turbulenta.</p>
        <h3>2. O ritmo dos vórtices</h3>
        <p>A frequência $f$ com que os vórtices se soltam é medida pelo número de Strouhal, que vale ~0,2 numa faixa enorme de $Re$:</p>
        ${F.formula(R`St = \frac{fD}{U} \approx 0{,}2`)}
        <p>Um fio de 2 mm num vento de 10 m/s solta vórtices a $f \approx 0{,}2\cdot10/0{,}002 = 1000$ Hz: é o assobio do fio (o som "eólico"). Se essa frequência bater com uma frequência natural da estrutura, aparece a ressonância ${F.ret("A20")}.</p>
        <h3>3. Como o computador resolve</h3>
        <p>Resolver Navier–Stokes ${F.ret("N05")} diretamente travaria a página. O laboratório usa o método de <b>lattice Boltzmann</b>: em vez de pressão e velocidade, cada ponto de uma grade guarda 9 "populações" de partículas que andam em 9 direções e colidem relaxando para o equilíbrio (teoria cinética ${F.ret("T05b")}). Na média, isso reproduz as equações de Navier–Stokes com viscosidade $\nu = \frac13(\tau - \frac12)$. A grade tem 200 × 80 pontos, e o programa mede quantos passos cabem em cada quadro para não travar.</p>
        ${F.caixa("pegadinha", R`<p><b>Limites honestos deste laboratório.</b> É uma simulação 2D: acima de Re ≈ 190 ela continua mostrando vórtices alternados, só mais irregulares, enquanto a esteira real vira 3D e turbulenta (turbulência de verdade precisa de três dimensões). E o canal é estreito (o cilindro ocupa 20% da altura) e a grade é grossa: o Strouhal medido sai uns 20% acima do valor de laboratório. O início do desprendimento, entre Re 40 e 60, bate com o valor clássico (~47).</p>`)}
        ${F.caixa("fisico", R`<p><b>A ponte de Tacoma Narrows (1940)</b> é frequentemente citada como ressonância com vórtices de von Kármán, mas a causa principal foi outra instabilidade aerodinâmica (o "flutter" torcional). Os vórtices de von Kármán aparecem até em nuvens atrás de ilhas, em fotos de satélite.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-cilindro"); e.outerHTML = F.lab("Escoamento ao redor de um cilindro", "lab-cilindro"); SIM.cilindroLBM(document.getElementById("lab-cilindro"), F); },
});
