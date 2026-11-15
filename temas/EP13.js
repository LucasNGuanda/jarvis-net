/* EP13 · Gás de van der Waals. Conferido em Python (R = 0,08314 L·bar/mol·K; CO₂: a = 3,64, b = 0,04267):
   T_c = 8a/(27Rb) = 304,0 K, p_c = a/(27b²) = 74,0 bar, v_c = 3b = 0,128 L/mol, Z_c = 3/8;
   construção de Maxwell: 250 K → 32,2 bar; 280 K → 52,8 bar; 300 K → 70,2 bar; em T = 0,9 T_c, p = 0,647 p_c (valor de livro). */
F.registrar("EP13", {
  retoma: ["T05", "T07", "T04"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 13 · termodinâmica</div><div class="q">Se o gás ideal fosse a verdade, dava para comprimir um gás para sempre que ele nunca viraria líquido. Mas o gás do isqueiro está líquido lá dentro. O que a equação $pV = nRT$ esquece?</div><p>Duas coisas: as moléculas têm tamanho e se atraem. Corrigindo isso, aparecem a condensação e um ponto crítico.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>O pistão comprime e expande o gás lentamente, sempre na mesma temperatura. Abaixe a temperatura até menos que $T_c$ e veja o líquido aparecer; troque o gás; sobreponha o gás ideal.</p><div id="lab-vdw"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. A equação</h3>
        ${F.formula(R`\left(p + \frac{a}{v^2}\right)(v - b) = RT\qquad(v = V/n,\ \text{volume molar})`)}
        <p>$b$ é o volume "proibido" por mol (as moléculas não se sobrepõem); $\frac a{v^2}$ é a pressão que falta porque as moléculas da borda são puxadas para dentro pelas outras. Para $v$ grande, os dois somem e volta o gás ideal ${F.ret("T05")}.</p>
        <h3>2. O ponto crítico</h3>
        <p>Acima de uma temperatura, a isoterma só desce; abaixo, ela tem um máximo e um mínimo. O ponto crítico é onde os dois se fundem: $\frac{\partial p}{\partial v} = 0$ e $\frac{\partial^2p}{\partial v^2} = 0$. Resolvendo:</p>
        ${F.formula(R`T_c = \frac{8a}{27Rb},\qquad p_c = \frac{a}{27b^2},\qquad v_c = 3b,\qquad \frac{p_cv_c}{RT_c} = \frac38`)}
        <h3>3. A construção de Maxwell</h3>
        <p>No trecho em que a isoterma sobe ao comprimir ($\partial p/\partial v > 0$), o fluido seria instável. Na realidade ele se separa em líquido (volume $v_\ell$) e vapor ($v_g$), na mesma pressão $p_\text{sat}$. Qual pressão? A que deixa áreas iguais acima e abaixo da reta: é a condição de que líquido e vapor tenham a mesma energia livre (o mesmo potencial químico).</p>
        ${F.formula(R`\int_{v_\ell}^{v_g}p_\text{vdW}\,dv = p_\text{sat}(v_g - v_\ell)`)}
        <p>Entre $v_\ell$ e $v_g$, a fração de líquido sai da "regra da alavanca": $x_\ell = \frac{v_g - v}{v_g - v_\ell}$.</p>
        ${F.caixa("fisico", R`<p><b>Fluido supercrítico.</b> Acima de $T_c$ (31 °C e 74 bar para o CO₂) não existe mais diferença entre líquido e gás. O CO₂ supercrítico dissolve cafeína e é usado para descafeinar café sem solventes tóxicos.</p>`)}
        ${F.caixa("pegadinha", R`<p><b>Van der Waals é qualitativo.</b> Ele acerta a existência do ponto crítico e da condensação, mas erra os números: prevê $\frac{p_cv_c}{RT_c} = 0{,}375$, e os gases reais dão ~0,27 a 0,29. E a parte em "onda" da isoterma, entre os pontos da reta, não se observa (só pedaços dela, em líquidos superaquecidos e vapores super-resfriados).</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-vdw"); e.outerHTML = F.lab("Gás de van der Waals", "lab-vdw"); SIM.vanDerWaals(document.getElementById("lab-vdw"), F); },
});
