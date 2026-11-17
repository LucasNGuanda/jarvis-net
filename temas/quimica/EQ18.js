/* Química EQ18 · Experimento: monte o retículo. Simulação SIM.eqReticulo (assets/sims/quimica/exp-atomos2.js): NaCl, CsCl e ZnS (blenda) montados íon por íon, em 3D.
   O número de coordenação é CONTADO na rede (SIM.reticCN: vizinhos mais próximos de carga oposta) e comparado com o da fonte.
   DADOS (tools/quimica/dadosX.json, seção "cristais"; conferidos por tools/quimica/confere-dadosX.py): NaCl: coordenação 6 (octaédrica) nos dois íons;
   CsCl: 8 (cúbica); ZnS: 4 (tetraédrica). Raios iônicos efetivos de Shannon (Wikipedia "Ionic radius"): Na⁺ 102, Cs⁺ 167, Zn²⁺ 74, Cl⁻ 181, S²⁻ 184 pm.
   Razões críticas (Wikipedia "Cation-anion radius ratio"): 0,2247 (CN 4), 0,4142 (CN 6), 0,732 (CN 8). Contas: 102/181 = 0,564; 167/181 = 0,923; 74/184 = 0,402.
   A fonte avisa que a regra não vale para todos os compostos (dito na tela).
   No teste (tests/texpq.js): CN contado 6, 8 e 4, igual ao da fonte e ao previsto pela razão de raios; no desenho, o íon destacado tem esse mesmo número de vizinhos. */
F.registrar("quimica/EQ18", {
  retoma: ["C01", "J04"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 18 · átomos e ligações</div><div class="q">A fórmula NaCl sugere um sódio preso a um cloro. Mas num grão de sal não existe esse par: não há "molécula de NaCl". Então, a quem cada íon está ligado?</div><p>A todos os vizinhos de carga oposta ao mesmo tempo. A fórmula diz só a proporção; o cristal é uma rede. Aqui você a vê ser empilhada.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Veja a rede se formar, gire-a e conte quantos vizinhos de carga oposta cercam o íon destacado. Compare as três estruturas.</p><div id="exp-ret"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Atrair o máximo, repelir o mínimo</h3>
        <p>Cargas opostas se atraem em todas as direções, sem preferência. A energia fica mais baixa quando cada íon tem muitos vizinhos de carga oposta e mantém os de mesma carga o mais longe possível ${F.ret("C01")}. O resultado é um arranjo que se repete: o <b>retículo cristalino</b>.</p>
        <h3>2. Número de coordenação</h3>
        <p>É o número de vizinhos mais próximos de carga oposta ${F.ret("J04")}. No NaCl, cada $\ce{Na+}$ tem 6 $\ce{Cl-}$ em volta, nos vértices de um octaedro, e cada $\ce{Cl-}$ tem 6 $\ce{Na+}$. No CsCl são 8, nos vértices de um cubo. No ZnS (blenda), 4, em tetraedro.</p>
        <h3>3. Por que cada sal escolhe uma rede</h3>
        ${F.formula(R`\text{razão de raios} = \frac{r_\text{cátion}}{r_\text{ânion}}`)}
        <p>Em volta de um cátion pequeno cabem poucos ânions grandes antes de eles se tocarem entre si. Quanto maior o cátion em relação ao ânion, mais vizinhos cabem. As razões críticas são 0,225 (para 4 vizinhos), 0,414 (para 6) e 0,732 (para 8). Com os raios da tabela: ZnS, 0,40 (4); NaCl, 0,56 (6); CsCl, 0,92 (8). A regra acerta estes três, mas falha em vários compostos: é um guia.</p>
        ${F.caixa("fisico", R`<p><b>Da rede às propriedades.</b> Para fundir um sal é preciso soltar cada íon de todos os seus vizinhos: por isso sólidos iônicos têm ponto de fusão alto. E são quebradiços: um golpe desloca uma camada, íons de mesma carga ficam frente a frente, repelem-se, e o cristal racha num plano liso.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>"Molécula de NaCl".</b> Não existe no sólido. A fórmula é a proporção 1 : 1.</p><p><b>Número de coordenação não é a carga.</b> O sódio é 1+ e tem 6 vizinhos.</p><p><b>As linhas do desenho não são ligações covalentes.</b> Só mostram quem é vizinho de quem.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-ret"); e.outerHTML = F.lab("Monte o retículo: cada íon cercado pelo oposto", "exp-ret"); SIM.eqReticulo(document.getElementById("exp-ret"), F); },
});
