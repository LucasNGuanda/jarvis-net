/* FE05 · Comparando resultados: discrepância e compatibilidade. Conferido em Python:
   9,68 × 9,81: 1,33%, discrepância 0,13 (1,3Δ com Δ = 0,10: compatível); 9,50 ± 0,05: 6,2Δ (incompatível); (9,71 − 9,81)/0,14 = 0,71Δ;
   9,75 ± 0,04 × 9,86 ± 0,05: 0,11/0,09 = 1,22; média ponderada 9,793 ± 0,031; som 335 ± 5 × 343: 1,6Δ; P(|z| > 2) = 4,55%;
   7,6 ± 0,3 × 7,87: 0,9Δ; distinguir 9,78 de 9,81 a 2Δ: Δ < 0,015; 9,79 ± 0,001: 0,2% mas 20Δ; 9,3 ± 0,6: 5,2% mas 0,85Δ;
   chefão: 9,74 ± 0,05 × 9,81: 1,4Δ; × 9,786: 0,92Δ; com 9,80 ± 0,03: média ponderada 9,784 ± 0,026; entre si 0,06/0,08 = 0,75; padrão − SP = 0,0207 → Δ < 0,010. */
F.registrar("FE05", {
  retoma: ["FE03", "FE04"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    /* reta numérica com x ± Δx e a referência */
    const reta = (x, dx, ref, a, b, extra = "") => { const X = (v) => 60 + ((v - a) / (b - a)) * 440; let s = `<line x1="50" x2="510" y1="120" y2="120" style="stroke:var(--ink2)"/>`; [[2, "var(--warn)"], [1, "var(--ok)"]].forEach(([k, c]) => (s += `<rect x="${X(x - k * dx)}" y="55" width="${X(x + k * dx) - X(x - k * dx)}" height="36" style="fill:color-mix(in srgb,${c} 15%,transparent)"/>`)); s += `<line x1="${X(x - dx)}" x2="${X(x + dx)}" y1="73" y2="73" style="stroke:var(--mN);stroke-width:3"/><circle cx="${X(x)}" cy="73" r="5" style="fill:var(--mN)"/><line x1="${X(ref)}" x2="${X(ref)}" y1="35" y2="120" style="stroke:var(--ok);stroke-width:2;stroke-dasharray:5 4"/>` + D.txt(X(ref), 28, "ref " + F.nt(ref, 3), "tx2") + D.txt(X(x), 145, F.nt(x, 3) + " ± " + F.nt(dx, 3), "tx2"); return fig(s + extra, 160); };
    const duas = (a, da, b, db, lo, hi) => { const X = (v) => 60 + ((v - lo) / (hi - lo)) * 440; return fig(`<line x1="50" x2="510" y1="130" y2="130" style="stroke:var(--ink2)"/><line x1="${X(a - da)}" x2="${X(a + da)}" y1="60" y2="60" style="stroke:var(--mN);stroke-width:3"/><circle cx="${X(a)}" cy="60" r="5" style="fill:var(--mN)"/><line x1="${X(b - db)}" x2="${X(b + db)}" y1="100" y2="100" style="stroke:var(--warn);stroke-width:3"/><circle cx="${X(b)}" cy="100" r="5" style="fill:var(--warn)"/>` + D.txt(X(a), 48, `A: ${F.nt(a, 2)} ± ${F.nt(da, 2)}`, "tx2") + D.txt(X(b), 88, `B: ${F.nt(b, 2)} ± ${F.nt(db, 2)}`, "tx2"), 150); };
    const exemplos = F.exemplo({
      titulo: "Comparar",
      casos: [
        { nome: "Fácil: o resultado bate com o livro?", gerar: (p) => {
          const x = p ? 9.68 : F.escolha([9.68, 9.74, 9.9, 9.55]), dx = p ? 0.1 : F.escolha([0.05, 0.1, 0.15]), ref = 9.81, n = Math.abs(x - ref) / dx;
          return { enun: R`<p>Um grupo mediu $g = (${F.n(x)} \pm ${F.n(dx)})$ m/s². O resultado é compatível com 9,81 m/s²?</p>`, fig: reta(x, dx, ref, 9.4, 10.1),
            passos: [R`<p>(i) Desvio percentual: $\frac{|${F.n(x)} - 9{,}81|}{9{,}81} = ${F.n((100 * Math.abs(x - ref)) / ref, 3)}\%$. Isso sozinho <b>não</b> decide nada.</p>`, R`<p>(ii) Discrepância em unidades da incerteza: $\frac{|${F.n(x)} - 9{,}81|}{${F.n(dx)}} = ${F.n(n, 3)}$.</p>`, R`<p>(iii) ${n <= 2 ? "Até 2Δ: <b>compatível</b>. A diferença pode ser só flutuação." : n <= 3 ? "Entre 2Δ e 3Δ: <b>inconclusivo</b>. Vale repetir ou rever as incertezas." : "Acima de 3Δ: <b>incompatível</b>. Há algum erro sistemático (ou a incerteza foi subestimada)."}</p>`] };
        } },
        { nome: "Médio: dois grupos concordam?", gerar: (p) => {
          const a = p ? 9.75 : F.escolha([9.75, 9.7, 9.82]), da = p ? 0.04 : F.escolha([0.03, 0.04]), b = p ? 9.86 : F.escolha([9.86, 9.9, 9.78]), db = p ? 0.05 : F.escolha([0.05, 0.06]), n = Math.abs(a - b) / (da + db);
          return { enun: R`<p>O grupo A mediu $(${F.n(a)} \pm ${F.n(da)})$ m/s² e o grupo B, $(${F.n(b)} \pm ${F.n(db)})$ m/s². Os resultados são compatíveis entre si?</p>`, fig: duas(a, da, b, db, 9.55, 10.05),
            passos: [R`<p>(i) A diferença $A - B$ tem incerteza $\Delta A + \Delta B = ${F.n(da + db)}$ (Teorema 2; em quadratura seria $${F.n(Math.hypot(da, db), 3)}$).</p>`, R`<p>(ii) $\frac{|${F.n(a)} - ${F.n(b)}|}{${F.n(da + db)}} = ${F.n(n, 3)}$.</p>`, R`<p>(iii) ${n <= 2 ? "Compatíveis" : n <= 3 ? "Inconclusivo" : "Incompatíveis"}. ${n <= 2 ? "Então faz sentido juntar os dois numa média ponderada (Teorema 3)." : "Antes de juntar, é preciso descobrir o que está errado."}</p>`] };
        } },
        { nome: "Olimpíada: a média ponderada", gerar: (p) => {
          const a = p ? 9.75 : F.escolha([9.75, 9.78]), da = p ? 0.04 : F.escolha([0.02, 0.04]), b = p ? 9.86 : F.escolha([9.83, 9.86]), db = p ? 0.05 : F.escolha([0.05, 0.08]), w1 = 1 / da ** 2, w2 = 1 / db ** 2, m = (w1 * a + w2 * b) / (w1 + w2), u = 1 / Math.sqrt(w1 + w2);
          return { enun: R`<p>Duas medidas compatíveis: $(${F.n(a)} \pm ${F.n(da)})$ e $(${F.n(b)} \pm ${F.n(db)})$ m/s². Qual a melhor estimativa combinando as duas, e com que incerteza?</p>`, fig: duas(a, da, b, db, 9.55, 10.05),
            passos: [R`<p>(i) Pesos: $w = \frac1{u^2}$: $w_A = ${F.n(w1, 4)}$ e $w_B = ${F.n(w2, 4)}$. A mais precisa pesa mais.</p>`, R`<p>(ii) $\bar x = \frac{w_AA + w_BB}{w_A + w_B} = ${F.n(m, 4)}$ m/s².</p>`, R`<p>(iii) $u = \frac1{\sqrt{w_A + w_B}} = ${F.n(u, 3)}$ m/s², menor que as duas incertezas originais. Resultado: $(${F.n(m, 3)} \pm ${F.n(u, 3)})$ m/s².</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "O g de São Paulo",
      enun: R`<p>Uma aluna mede $g = (9{,}74 \pm 0{,}05)$ m/s² com um pêndulo, em São Paulo. O valor padrão é 9,80665 m/s² e o local, em São Paulo (latitude 23,5° e uns 760 m de altitude), é cerca de 9,786 m/s². (a) Em unidades da incerteza, quão longe ela está de 9,81? É compatível? (b) E do valor local? (c) Um colega mede $(9{,}80 \pm 0{,}03)$ m/s². As duas medidas são compatíveis entre si? (d) Combine-as numa média ponderada. (e) Com que incerteza seria preciso medir para distinguir, pelo critério dos 2Δ, o $g$ de São Paulo do valor padrão?</p>`,
      fig: duas(9.74, 0.05, 9.8, 0.03, 9.6, 9.95),
      dicas: [R`<p>(a) e (b): $\frac{|x - \text{ref}|}{\Delta x}$.</p>`, R`<p>(c) A incerteza da diferença é $0{,}05 + 0{,}03$.</p>`, R`<p>(d) Pesos $\frac1{u^2}$.</p>`, R`<p>(e) A diferença entre os dois valores tem de ser maior que $2\Delta$.</p>`],
      sol: R`<p><b>(a)</b> $\frac{0{,}07}{0{,}05} = 1{,}4\Delta$: compatível.</p>
        <p><b>(b)</b> $\frac{0{,}046}{0{,}05} \approx 0{,}92\Delta$: compatível, e mais perto.</p>
        <p><b>(c)</b> $\frac{0{,}06}{0{,}08} = 0{,}75$: compatíveis.</p>
        <p><b>(d)</b> $w_1 = 400$, $w_2 \approx 1111$: $\bar g = \frac{400\cdot9{,}74 + 1111\cdot9{,}80}{1511} \approx 9{,}784$ m/s², $u = \frac1{\sqrt{1511}} \approx 0{,}026$ m/s². Bem perto do valor local!</p>
        <p><b>(e)</b> A diferença é $9{,}80665 - 9{,}786 \approx 0{,}021$ m/s²: seria preciso $2\Delta < 0{,}021$, isto é, $\Delta \lesssim 0{,}010$ m/s² (0,1%). Um pêndulo bem feito, com muitas oscilações e correção de amplitude, chega lá. Conferi em Python.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Um grupo mediu $g = 9{,}68$ m/s². Qual o desvio percentual em relação a 9,81 m/s², em %?</p>`, fig: reta(9.68, 0.1, 9.81, 9.4, 10.1), num: { v: 1.325, tol: 0.01, un: "%" }, dicas: [R`<p>$\frac{|x - \text{ref}|}{\text{ref}}$.</p>`], resp: "≈ 1,3%", sol: R`<p>$\frac{0{,}13}{9{,}81} \approx 1{,}3\%$.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Com $g = (9{,}68 \pm 0{,}10)$ m/s², a quantas incertezas o resultado está de 9,81?</p>`, fig: reta(9.68, 0.1, 9.81, 9.4, 10.1), num: { v: 1.3, tol: 0.01, un: "Δ" }, dicas: [R`<p>$\frac{0{,}13}{0{,}10}$.</p>`], resp: "1,3 Δ", sol: R`<p>1,3Δ: compatível (até 2Δ).</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>$g = (9{,}50 \pm 0{,}05)$ m/s², comparado com 9,81 m/s², é:</p>`, fig: reta(9.5, 0.05, 9.81, 9.3, 10), alts: ["compatível, porque o erro é de só 3%.", "incompatível: está a 6,2Δ do valor de referência.", "inconclusivo.", "compatível, porque a incerteza é pequena.", "impossível de julgar."], certa: "B", dicas: [R`<p>$\frac{0{,}31}{0{,}05}$.</p>`], resp: "B", sol: R`<p>6,2Δ: incompatível. Há um erro sistemático a procurar ${F.ret("FE10")}.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>$g = (9{,}71 \pm 0{,}14)$ m/s². A quantas incertezas está de 9,81?</p>`, fig: reta(9.71, 0.14, 9.81, 9.3, 10.2), num: { v: 0.714, tol: 0.01, un: "Δ" }, dicas: [R`<p>$\frac{0{,}10}{0{,}14}$.</p>`], resp: "≈ 0,71 Δ", sol: R`<p>0,71Δ: compatível.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>A velocidade do som foi medida como $(335 \pm 5)$ m/s. A quantas incertezas está de 343 m/s?</p>`, fig: reta(335, 5, 343, 320, 355), num: { v: 1.6, tol: 0.01, un: "Δ" }, dicas: [R`<p>$\frac{8}{5}$.</p>`], resp: "1,6 Δ", sol: R`<p>1,6Δ: compatível (e o som a 20 °C é 343 m/s; a 15 °C, 340).</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>A densidade de um bloco deu $(7{,}6 \pm 0{,}3)$ g/cm³. A quantas incertezas está do ferro (7,87 g/cm³)?</p>`, fig: reta(7.6, 0.3, 7.87, 6.8, 8.6), num: { v: 0.9, tol: 0.01, un: "Δ" }, dicas: [R`<p>$\frac{0{,}27}{0{,}3}$.</p>`], resp: "0,9 Δ", sol: R`<p>0,9Δ: compatível com ferro (mas também seria com outros metais parecidos).</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Numa distribuição normal, qual a chance de uma medida cair a mais de 2σ do valor verdadeiro (em %)?</p>`, fig: fig(D.graf({ x0: 110, y0: 140, w: 340, h: 110, xmax: 8, ymin: 0, ymax: 1.1, xlab: "", ylab: "", xt: [], yt: [], curvas: [{ pts: D.amostra((x) => Math.exp(-((x - 4) ** 2) / 2), 0, 8), cor: "var(--mN)" }, { pts: D.amostra((x) => Math.exp(-((x - 4) ** 2) / 2), 6, 8), cor: "var(--bad)", area: true }, { pts: D.amostra((x) => Math.exp(-((x - 4) ** 2) / 2), 0, 2), cor: "var(--bad)", area: true }] }), 160), num: { v: 4.55, tol: 0.03, un: "%" }, dicas: [R`<p>Dentro de ±2σ ficam ~95,4%.</p>`], resp: "≈ 4,6%", sol: R`<p>≈ 4,6%: por isso 2Δ é um critério razoável para "compatível": passar disso por puro azar acontece 1 vez em ~22.</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Um resultado muito preciso (incerteza pequena) mas incompatível com o valor de referência indica, mais provavelmente:</p>`, fig: fig(D.alvo(280, 85, 70, [[0.55, -0.4], [0.6, -0.35], [0.52, -0.45], [0.58, -0.42]]), 170), alts: ["um erro aleatório grande.", "um erro sistemático (algo desloca todas as medidas para o mesmo lado).", "que o valor de referência está errado, sempre.", "que faltaram medidas.", "nada: está tudo certo."], certa: "B", dicas: [R`<p>Todos os tiros juntos, mas longe do centro.</p>`], resp: "B", sol: R`<p>Preciso mas inexato: erro sistemático (calibração, comprimento medido errado, ângulo grande...) ${F.ret("FE10")}.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Os grupos A, $(9{,}75 \pm 0{,}04)$, e B, $(9{,}86 \pm 0{,}05)$ m/s², concordam? Calcule $\frac{|A - B|}{\Delta A + \Delta B}$.</p>`, fig: duas(9.75, 0.04, 9.86, 0.05, 9.55, 10.05), num: { v: 1.222, tol: 0.01 }, dicas: [R`<p>$\frac{0{,}11}{0{,}09}$.</p>`], resp: "≈ 1,22 (compatíveis)", sol: R`<p>1,22: compatíveis.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Qual a média ponderada desses dois resultados, $(9{,}75 \pm 0{,}04)$ e $(9{,}86 \pm 0{,}05)$ m/s²?</p>`, fig: duas(9.75, 0.04, 9.86, 0.05, 9.55, 10.05), num: { v: 9.7929, tol: 0.0005, un: "m/s²" }, dicas: [R`<p>Pesos 625 e 400.</p>`], resp: "≈ 9,793 m/s²", sol: R`<p>$\frac{625\cdot9{,}75 + 400\cdot9{,}86}{1025} \approx 9{,}793$ m/s².</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>E a incerteza dessa média ponderada?</p>`, fig: duas(9.75, 0.04, 9.86, 0.05, 9.55, 10.05), num: { v: 0.03123, tol: 0.02, un: "m/s²" }, dicas: [R`<p>$\frac1{\sqrt{625 + 400}}$.</p>`], resp: "≈ 0,031 m/s²", sol: R`<p>$\approx 0{,}031$ m/s²: melhor que as duas.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>$g = (9{,}79 \pm 0{,}001)$ m/s² contra 9,81: o desvio é de só 0,2%. O resultado é:</p>`, fig: reta(9.79, 0.004, 9.81, 9.75, 9.85), alts: ["ótimo e compatível.", "incompatível: está a 20Δ; o desvio percentual pequeno engana.", "inconclusivo.", "compatível, porque 0,2% é pouco.", "impossível."], certa: "B", dicas: [R`<p>Calcule a discrepância em unidades de Δ.</p>`], resp: "B", sol: R`<p>$\frac{0{,}02}{0{,}001} = 20\Delta$. Com essa precisão, até a diferença entre o $g$ local e 9,81 aparece. Desvio percentual pequeno não garante compatibilidade.</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>$g = (9{,}3 \pm 0{,}6)$ m/s²: desvio de 5,2%. O resultado é:</p>`, fig: reta(9.3, 0.6, 9.81, 8.2, 10.8), alts: ["incompatível, porque 5% é muito.", "compatível (0,85Δ), mas pouco útil: a incerteza é enorme.", "inconclusivo.", "exato.", "errado."], certa: "B", dicas: [R`<p>$\frac{0{,}51}{0{,}6}$.</p>`], resp: "B", sol: R`<p>0,85Δ: compatível. Mas uma medida com 6% de incerteza "concorda" com quase tudo; o objetivo é ser compatível <b>e</b> preciso.</p>` }),
      F.exercicio({ n: 14, nivel: "Máximo", enun: R`<p>Que incerteza máxima permitiria distinguir, pelo critério dos 2Δ, um $g$ de 9,78 de outro de 9,81 m/s²?</p>`, fig: duas(9.78, 0.015, 9.81, 0.0001, 9.7, 9.9), num: { v: 0.015, tol: 0.02, un: "m/s²" }, dicas: [R`<p>$2\Delta < 0{,}03$.</p>`], resp: "0,015 m/s²", sol: R`<p>$\Delta < 0{,}015$ m/s² (0,15%).</p>` }),
      F.exercicio({ n: 15, nivel: "Máximo", enun: R`<p>Quando se compara com um valor de tabela (como $g = 9{,}81$ ou $c$), por que se usa só a incerteza da sua medida?</p>`, fig: reta(9.72, 0.06, 9.81, 9.4, 10.1), alts: ["Porque a tabela está sempre certa por definição.", "Porque a incerteza do valor de tabela costuma ser desprezível perto da sua.", "Porque não se pode combinar incertezas.", "Porque a referência não tem unidade.", "Por preguiça."], certa: "B", dicas: [R`<p>Compare a precisão de um valor de tabela com a de um experimento escolar.</p>`], resp: "B", sol: R`<p>Valores de referência são conhecidos com precisão muito maior (ou são exatos por definição, como $c$). Se não forem, inclua a incerteza deles (Teorema 2).</p>` }),
      F.exercicio({ n: 16, nivel: "Máximo", enun: R`<p>Duas medidas incompatíveis entre si, $(9{,}60 \pm 0{,}02)$ e $(9{,}85 \pm 0{,}03)$. Faz sentido calcular a média ponderada delas?</p>`, fig: duas(9.6, 0.02, 9.85, 0.03, 9.5, 9.95), alts: ["Sim, é sempre o melhor.", "Não: com 5Δ de diferença, pelo menos uma tem erro sistemático; primeiro é preciso descobrir qual.", "Sim, e a incerteza da média resolve o problema.", "Só a média simples.", "Sim, desde que se somem as incertezas."], certa: "B", dicas: [R`<p>$\frac{0{,}25}{0{,}05}$.</p>`], resp: "B", sol: R`<p>5Δ: incompatíveis. Fazer a média esconderia o problema com uma incerteza pequena e enganosa.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Física experimental · comparar</div>
        <div class="q">Seu grupo achou $g = 9{,}72$ m/s² e o livro diz 9,81. Vocês erraram?</div>
        <p>Depende da incerteza. Se ela for 0,06, a diferença está dentro do esperado; se for 0,005, alguma coisa deu errado. "Bater" ou "não bater" só faz sentido em unidades da incerteza.</p></div>
        ${F.chute({ q: "qual resultado é mais confiável para quem quer confirmar g = 9,81 m/s²?", ops: ["(9,79 ± 0,001) m/s², desvio de 0,2%", "(9,74 ± 0,05) m/s², desvio de 0,7%", "(9,3 ± 0,6) m/s², desvio de 5%", "Os três dizem a mesma coisa."], certa: 1, exp: "O do meio: está a 1,4Δ de 9,81 (compatível) e é razoavelmente preciso. O primeiro está a 20Δ (incompatível, apesar do desvio minúsculo) e o terceiro é tão impreciso que concorda com quase tudo." })}`),

      F.secao("criterio", "Discrepância e compatibilidade", R`
        ${F.formula(R`E_\% = \frac{|x - x_\text{ref}|}{x_\text{ref}}\cdot100\%,\qquad n = \frac{|x - x_\text{ref}|}{\Delta x}`, "Desvio percentual e discrepância em unidades de Δ")}
        <h3>Teorema 1: o critério dos 2Δ</h3>
        ${F.demo("demonstração", R`<p>(i) Se não houver erro sistemático, o resultado fica espalhado em torno do valor verdadeiro com desvio padrão $\Delta x$ (distribuição normal ${F.ret("FE03")}).</p>
          <p>(ii) A chance de cair a mais de $2\Delta x$ só por azar é ~4,6% (e a mais de $3\Delta x$, ~0,3%).</p>
          <p>(iii) Regra prática: $n \le 2$, compatível; $2 < n \le 3$, inconclusivo; $n > 3$, incompatível (alguma hipótese falhou: erro sistemático ou incerteza subestimada). Com a incerteza pessimista (soma), o critério fica um pouco mais folgado. $\blacksquare$</p>`)}
        <div id="lab-compara"></div>
        ${F.caixa("pegadinha", R`<p><b>Desvio percentual não decide compatibilidade.</b> 0,2% pode ser incompatível (se a incerteza for 0,01%) e 5% pode ser compatível (se a incerteza for 6%). Relatório que diz "o erro foi pequeno, então deu certo" sem comparar com a incerteza perde ponto.</p>`)}`),

      F.secao("duas", "Comparando duas medidas", R`
        <h3>Teorema 2: a diferença de duas medidas tem incerteza $\Delta a + \Delta b$</h3>
        ${F.demo("demonstração", R`<p>(i) A diferença $d = a - b$ é uma subtração: as incertezas absolutas se somam ${F.ret("FE04")}: $\Delta d = \Delta a + \Delta b$ (em quadratura, $\sqrt{\Delta a^2 + \Delta b^2}$).</p>
          <p>(ii) Se as duas medem a mesma coisa, o valor esperado de $d$ é zero. Aplique o Teorema 1 a $d$: compatíveis se $|a - b| \le 2\Delta d$ (ou, mais exigente, $\le \Delta d$ com a soma pessimista). $\blacksquare$</p>`)}
        ${F.formula(R`\text{compatíveis se } |a - b| \lesssim 2\,(\Delta a + \Delta b)\quad\text{(ou com }\sqrt{\Delta a^2 + \Delta b^2})`, "Duas medidas da mesma grandeza")}`),

      F.secao("media", "Juntando medidas: a média ponderada", R`
        <h3>Teorema 3: a melhor combinação pesa cada medida por $1/u^2$</h3>
        ${F.demo("demonstração", R`<p>(i) Combine $\bar x = wa + (1 - w)b$. Com medidas independentes, a variância é $w^2u_a^2 + (1 - w)^2u_b^2$ ${F.ret("FE03")}.</p>
          <p>(ii) Minimizando em $w$ (derivada igual a zero ${F.ret("F04")}): $2wu_a^2 - 2(1 - w)u_b^2 = 0 \Rightarrow w = \frac{u_b^2}{u_a^2 + u_b^2} = \frac{1/u_a^2}{1/u_a^2 + 1/u_b^2}$.</p>
          <p>(iii) A variância mínima dá $\frac1{u^2} = \frac1{u_a^2} + \frac1{u_b^2}$: os "pesos" $\frac1{u^2}$ se somam. $\blacksquare$</p>`)}
        ${F.formula(R`\bar x = \frac{\sum x_i/u_i^2}{\sum 1/u_i^2},\qquad u_{\bar x} = \frac{1}{\sqrt{\sum 1/u_i^2}}`, "Média ponderada")}
        ${F.caixa("fisico", R`<p><b>As constantes da natureza são médias ponderadas</b> de experimentos do mundo inteiro (o CODATA faz isso a cada 4 anos). Quando dois experimentos discordam (como nas medidas do raio do próton, em 2010), não se faz a média: investiga-se, e às vezes surge física nova.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Sempre dê o número $n$</b>: "o resultado está a 1,4 incerteza do valor de referência, portanto compatível". E se der incompatível, proponha a causa mais provável e uma forma de testá-la. É assim que se escreve uma boa conclusão ${F.ret("FE11")}.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, compara-se com o teste do $\chi^2$ e com intervalos de confiança; para muitas medidas, o $\chi^2$ reduzido diz se as incertezas declaradas são realistas ($\approx 1$) ou se há espalhamento a mais (incertezas subestimadas ou sistemáticos).</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-compara"); e.outerHTML = F.lab("Compatível ou não?", "lab-compara"); SIM.compara(document.getElementById("lab-compara"), F); },
});
