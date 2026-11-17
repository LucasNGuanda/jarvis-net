/* Química EQ23 · Experimento: espectro de emissão e átomo de Bohr. Simulação SIM.eqBohr (assets/sims/quimica/exp-atomos2.js).
   DADOS (tools/quimica/dadosX.json, seção "espectro_hidrogenio"; conferidos por tools/quimica/confere-dadosX.py): constante de Rydberg do hidrogênio 1,09677·10⁷ m⁻¹;
   nível fundamental 13,6 eV (em módulo); níveis 2 e 3: −3,4 e −1,51 eV; linhas de Balmer 656,3; 486,1; 434,0 e 410,2 nm (vermelho, ciano, azul, violeta);
   Lyman-α 121,57 nm (ultravioleta); Paschen-α 1875 nm (infravermelho).
   A fórmula dá 656,5; 486,3; 434,2; 410,3; 121,6 e 1875,6 nm: a diferença de ~0,2 nm nas visíveis é entre vácuo (fórmula) e ar (tabela).
   No teste (tests/texpq.js): os seis comprimentos de onda a menos de 0,7 nm da tabela; energias dos fótons 1,89; 2,55; 2,86 e 3,02 eV; depois de cada queda, a linha fica no espectro. */
F.registrar("quimica/EQ23", {
  retoma: ["B03", "B04", "fisica/C16"],
  html(F) {
    const R = String.raw;
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Experimento 23 · átomos e ligações</div><div class="q">Passe a luz de uma lâmpada comum por um prisma: sai um arco-íris contínuo. Faça o mesmo com a luz de um tubo de hidrogênio: saem só quatro riscos coloridos, sempre nos mesmos lugares. Por que o hidrogênio só emite essas cores?</div><p>Porque o elétron dele só pode ter certas energias. Cada risco é um salto entre duas delas.</p></div>`),
      F.secao("experimento", "Experimento", R`<p>Escolha de onde o elétron cai e para onde, e veja o fóton sair e a linha aparecer no espectro. Depois aqueça o gás e deixe o espectro se montar.</p><div id="exp-bohr"></div>`),
      F.secao("teoria", "A explicação", R`
        <h3>1. Níveis de energia</h3>
        ${F.formula(R`E_n = -\frac{13{,}6\ \text{eV}}{n^2} \qquad n = 1, 2, 3, \dots`)}
        <p>No modelo de Bohr, o elétron do hidrogênio só ocupa níveis com essas energias ${F.ret("B03")}. O sinal negativo indica que ele está preso ao núcleo; em $n = 1$ está no estado fundamental. Os níveis vão se apertando à medida que $n$ cresce.</p>
        <h3>2. Um salto, um fóton</h3>
        ${F.formula(R`E_\text{fóton} = E_{n_2} - E_{n_1} = \frac{hc}{\lambda} \qquad\qquad \frac{1}{\lambda} = R_\text{H}\left(\frac{1}{n_1^2} - \frac{1}{n_2^2}\right)`)}
        <p>Ao cair de um nível $n_2$ para um nível mais baixo $n_1$, o elétron emite um fóton com exatamente a diferença de energia ${F.ret("fisica/C16")}. Como só existem certas diferenças, só existem certas cores. A segunda expressão é a fórmula de Rydberg, com $R_\text{H} = 1{,}097\cdot10^{7}$ m⁻¹.</p>
        <h3>3. As séries</h3>
        <p>Quedas até $n = 2$ formam a <b>série de Balmer</b>, a única no visível: 656 nm (vermelho), 486 nm (ciano), 434 nm (azul) e 410 nm (violeta). Quedas até $n = 1$ liberam muito mais energia e caem no ultravioleta (<b>Lyman</b>); até $n = 3$, no infravermelho (<b>Paschen</b>).</p>
        ${F.caixa("fisico", R`<p><b>Preveja antes de soltar.</b> Quanto maior o salto, maior a energia do fóton e <b>menor</b> o comprimento de onda. De 6 para 2 sai violeta; de 3 para 2, vermelho. E repare: as linhas de Balmer se amontoam do lado do violeta, porque os níveis altos ficam cada vez mais próximos uns dos outros.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p><b>O elétron não emite luz girando.</b> Só emite ao mudar de nível.</p><p><b>Maior energia, menor comprimento de onda.</b> É o inverso.</p><p><b>Bohr só acerta o hidrogênio.</b> O modelo falha para átomos com mais de um elétron; a ideia de níveis discretos ficou, as órbitas não ${F.ret("B04")}.</p>`)}`),
    ].join("");
  },
  montar(F) { const e = document.getElementById("exp-bohr"); e.outerHTML = F.lab("Espectro do hidrogênio: cada linha é um salto", "exp-bohr"); SIM.eqBohr(document.getElementById("exp-bohr"), F); },
});
