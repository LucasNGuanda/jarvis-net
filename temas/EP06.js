/* EP06 · Ímã caindo num tubo condutor. Modelo: dipolo pontual, parede fina (números conferidos em exp2.py). */
F.registrar("EP06", {
  retoma: ["C15"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 6 · eletromagnetismo</div><div class="q">Um ímã forte cai num cano de cobre e leva 15 segundos para atravessar 1 metro. O cobre nem é atraído por ímãs. O que está segurando?</div></div>`),
      F.secao("experimento", "Experimento", R`<p>Os dois ímãs são soltos juntos. Troque o metal e a espessura da parede.</p><div id="lab-tubo"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Lenz, de novo</h3>
        <p>Imagine o tubo como uma pilha de anéis. Abaixo do ímã, o fluxo magnético nos anéis está <b>aumentando</b>; acima, <b>diminuindo</b>. Pela lei de Faraday–Lenz ${F.ret("C15")}, aparecem correntes que se opõem a isso: o anel de baixo vira um ímã que <b>repele</b> o que chega, e o de cima vira um ímã que <b>atrai</b> o que vai embora. As duas forças freiam o ímã.</p>
        <h3>2. Força proporcional à velocidade</h3>
        <p>A fem induzida é proporcional à rapidez da variação do fluxo, isto é, à velocidade $v$; a corrente também; a força (corrente × campo) também. Então $F = -bv$ e:</p>
        ${F.formula(R`m\frac{dv}{dt} = mg - bv\quad\Rightarrow\quad v(t) = v_t\left(1 - e^{-t/\tau}\right),\qquad v_t = \frac{mg}{b},\qquad \tau = \frac mb`)}
        <p>É a mesma equação do paraquedista com arrasto linear ${F.ret("A09")} e da carga de um RC ${F.ret("C10b")}.</p>
        <h3>3. Quanto vale b</h3>
        <p>Para um ímã de momento magnético $\mu$ (tratado como dipolo pontual) num tubo de raio $a$, parede fina de espessura $w$ e condutividade $\sigma$, um cálculo com Biot–Savart e Faraday dá:</p>
        ${F.formula(R`b = \frac{45}{1024}\,\frac{\mu_0^2\mu^2\sigma w}{a^4}`)}
        ${F.caixa("fisico", R`<p><b>Confira as dimensões</b> ${F.ret("A19")}: dá N·s/m. E o sentido de cada fator: mais condutividade e parede mais grossa = mais corrente = mais freio; ímã mais forte conta em dobro (induz mais e sente mais); tubo largo freia muito menos ($1/a^4$). Ímã de neodímio de 1 cm ($\mu \approx 1$ A·m²) em cobre de 1 mm, raio 8 mm: $v_t \approx 7$ cm/s.</p>`)}
        <h3>4. Para onde vai a energia</h3>
        <p>Na velocidade terminal, a gravidade fornece $mgv_t$ por segundo, e tudo vira calor no tubo: $bv_t^2 = mgv_t$. É o princípio do freio magnético de montanhas-russas e trens (sem contato, sem desgaste) e dos fogões de indução.</p>
        ${F.caixa("pegadinha", R`<p>O modelo é aproximado: o ímã real não é um ponto e paredes grossas não são "finas". Em experimentos de verdade, a ordem de grandeza bate (cm/s), mas o número exato pode variar uns 20–30%.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-tubo"); e.outerHTML = F.lab("Ímã caindo: PVC × metal", "lab-tubo"); SIM.imaTubo(document.getElementById("lab-tubo"), F); },
});
