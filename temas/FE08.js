/* FE08 · Gráficos log-log e mono-log. Conferido em Python:
   lab: Kepler (dados reais) log-log n = 1,4997, C = 1,000; fonte (T½ = 5 min, ±1,5%) mono-log T½ = 4,98 min; café τ = 11,9 min; lâmpada n = −2,005;
   curvaturas: retas < 0,9%, curvas > 7,9% (critério 2%);
   ex: log(1000)/log(100) = 1,5; 4^1,5 = 8; 800 → 100 em 15 min = 3 meias-vidas → 5 min; ln2/0,231 = 3,0 min; 0,1·ln10 = 0,2303/s → τ = 4,34 s;
   Δ(ln y) = 2/50 = 0,04; 16^0,75 = 8; log2/20 = 0,01505/min; ln(45/5)/ln 3 = 2; C-14 com 25%: 2·5730 = 11 460 anos;
   chefão: N = 800·2^(−t/6) + 20: brutos 820 586 420 303 220 161 120 91 70 55 45 (t = 0, 3, …, 30 min);
   meia-vida aparente 24–30 min: 6 ln2/ln(70/45) = 9,41 min; 0–30: 7,16 min; descontando o fundo: 50 → 25 em 6 min → 6,0 min; λ = 0,1155/min; fonte = fundo em t = 6·log₂40 = 31,9 min. */
F.registrar("FE08", {
  retoma: ["FE07", "FE04"],
  html(F) {
    const R = String.raw;
    const fig = (c, h = 220) => D.svg(560, h, c, "figura");
    const L = Math.log10;
    /* gráfico com eixos log opcionais: o = {lx, ly, x:[lo,hi], y:[lo,hi] (valores reais), pts, linhas:[[x1,y1,x2,y2,cor]], xl, yl} */
    const lg = (o) => { const tx = (v) => (o.lx ? L(v) : v), ty = (v) => (o.ly ? L(v) : v), [a, b] = o.x.map(tx), [c, d] = o.y.map(ty), PX = (v) => 90 + ((tx(v) - a) / (b - a)) * 380, PY = (v) => 180 - ((ty(v) - c) / (d - c)) * 150;
      let s = `<rect x="90" y="30" width="380" height="150" style="fill:none;stroke:var(--line2)"/>`;
      const marcas = (lo, hi, log) => { const t = []; if (log) for (let k = Math.floor(L(lo)); k <= Math.ceil(L(hi)); k++) [1, 2, 5].forEach((m) => { const v = m * 10 ** k; if (v >= lo * 0.999 && v <= hi * 1.001) t.push(v); }); else (o.lin || []).forEach((v) => t.push(v)); return t; };
      const fm = (v) => (v >= 1 ? String(+v.toPrecision(3)).replace(".", ",") : String(+v.toPrecision(2)).replace(".", ","));
      const rot = (v, lo, hi, log) => !log || L(hi / lo) <= 2.2 || Math.abs(L(v) - Math.round(L(v))) < 1e-9;
      marcas(...o.x, o.lx).forEach((v) => (s += `<line x1="${PX(v)}" x2="${PX(v)}" y1="30" y2="180" style="stroke:var(--line2);stroke-dasharray:3 4"/>` + (rot(v, ...o.x, o.lx) ? D.txt(PX(v), 197, fm(v), "tx2") : "")));
      marcas(...o.y, o.ly).forEach((v) => (s += `<line x1="90" x2="470" y1="${PY(v)}" y2="${PY(v)}" style="stroke:var(--line2);stroke-dasharray:3 4"/>` + (rot(v, ...o.y, o.ly) ? D.txt(84, PY(v) + 4, fm(v), "tx2", "end") : "")));
      (o.linhas || []).forEach(([x1, y1, x2, y2, cor]) => (s += `<line x1="${PX(x1)}" y1="${PY(y1)}" x2="${PX(x2)}" y2="${PY(y2)}" style="stroke:${cor || "var(--ok)"};stroke-width:2;stroke-dasharray:6 4"/>`));
      (o.pts || []).forEach(([x, y]) => (s += `<circle cx="${PX(x)}" cy="${PY(y)}" r="4" style="fill:var(--warn)"/>`));
      return fig(s + D.txt(470, 214, (o.xl || "x") + (o.lx ? " (log)" : ""), "tx2", "end") + D.txt(90, 22, (o.yl || "y") + (o.ly ? " (log)" : ""), "tx2", "start") + (o.extra || ""), 222); };
    const kep = [[0.387, 0.241], [0.723, 0.615], [1, 1], [1.524, 1.881], [5.203, 11.86], [9.537, 29.46], [19.19, 84.01], [30.07, 164.8]];
    const kepF = lg({ lx: 1, ly: 1, x: [0.2, 50], y: [0.1, 500], pts: kep, linhas: [[0.2, 0.2 ** 1.5, 50, 50 ** 1.5]], xl: "a (UA)", yl: "T (anos)" });
    const decF = (T12, N0 = 800, fim = 30) => lg({ ly: 1, x: [0, fim], y: [N0 * 2 ** (-fim / T12) * 0.6, N0 * 1.6], lin: [0, 10, 20, 30].filter((v) => v <= fim), pts: Array.from({ length: 7 }, (_, i) => (i * fim) / 6).map((t) => [t, N0 * 2 ** (-t / T12)]), linhas: [[0, N0, fim, N0 * 2 ** (-fim / T12)]], xl: "t (min)", yl: "contagens/min" });
    const tt = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30], bruto = tt.map((t) => 800 * 2 ** (-t / 6) + 20);
    const chefFig = lg({ ly: 1, x: [0, 32], y: [10, 1500], lin: [0, 10, 20, 30], pts: tt.map((t, i) => [t, Math.round(bruto[i])]), linhas: [[0, 20, 32, 20, "var(--ink3)"]], xl: "t (min)", yl: "contagens/min", extra: D.txt(460, 150, "fundo: 20/min", "tx2", "end") });
    const exemplos = F.exemplo({
      titulo: "Escalas logarítmicas",
      casos: [
        { nome: "Fácil: o expoente pelo log-log", gerar: (p) => {
          const n = p ? 1.5 : F.escolha([1.5, 2, 0.5, 3]), C = 2, x1 = 1, x2 = 100, y1 = C, y2 = C * 100 ** n;
          return { enun: R`<p>Num gráfico log-log, a reta passa por $(${F.n(x1)};\ ${F.n(y1)})$ e por $(${F.n(x2)};\ ${F.n(y2, 4)})$. Qual o expoente $n$ da lei $y = Cx^n$?</p>`, fig: lg({ lx: 1, ly: 1, x: [0.5, 200], y: [0.5, y2 * 3], pts: [[x1, y1], [x2, y2]], linhas: [[0.5, C * 0.5 ** n, 200, C * 200 ** n]] }),
            passos: [R`<p>(i) $\log y = \log C + n\log x$: no log-log, a inclinação é $n$.</p>`, R`<p>(ii) $n = \frac{\log y_2 - \log y_1}{\log x_2 - \log x_1} = \frac{\log(${F.n(y2 / y1, 4)})}{\log 100} = \frac{${F.n(L(y2 / y1), 3)}}{2}$.</p>`, R`<p>(iii) $n = ${F.n(n)}$. Repare que não importa a base do log nem as unidades: o expoente é um número puro.</p>`] };
        } },
        { nome: "Médio: meia-vida pelo mono-log", gerar: (p) => {
          const T = p ? 5 : F.escolha([4, 5, 6, 8]), t2 = 3 * T;
          return { enun: R`<p>Uma fonte radioativa dá 800 contagens/min em $t = 0$ e 100 contagens/min em $t = ${F.n(t2)}$ min. No mono-log, os pontos ficam numa reta. Qual a meia-vida?</p>`, fig: decF(T, 800, Math.max(30, t2)),
            passos: [R`<p>(i) $N = N_0\,2^{-t/T_{1/2}}$ é exponencial: reta no mono-log.</p>`, R`<p>(ii) $\frac{800}{100} = 8 = 2^3$: passaram 3 meias-vidas.</p>`, R`<p>(iii) $T_{1/2} = \frac{${F.n(t2)}}{3} = ${F.n(T)}$ min. (Pela inclinação: $k = -\frac{\ln 8}{${F.n(t2)}}$ e $T_{1/2} = \frac{\ln 2}{|k|}$, o mesmo resultado.)</p>`] };
        } },
        { nome: "Olimpíada: Kepler com dados reais", gerar: (p) => {
          const [a1, T1] = p ? [1, 1] : F.escolha([[1, 1], [0.723, 0.615]]), [a2, T2] = p ? [30.07, 164.8] : F.escolha([[30.07, 164.8], [9.537, 29.46], [19.19, 84.01]]), n = L(T2 / T1) / L(a2 / a1);
          return { enun: R`<p>Com os planetas no gráfico log-log de $T$ (anos) contra $a$ (UA), use dois deles, $(${F.n(a1, 4)};\ ${F.n(T1, 4)})$ e $(${F.n(a2, 4)};\ ${F.n(T2, 4)})$, para achar o expoente da terceira lei de Kepler.</p>`, fig: kepF,
            passos: [R`<p>(i) $n = \frac{\log(T_2/T_1)}{\log(a_2/a_1)} = \frac{\log ${F.n(T2 / T1, 4)}}{\log ${F.n(a2 / a1, 4)}}$.</p>`, R`<p>(ii) $n = \frac{${F.n(L(T2 / T1), 4)}}{${F.n(L(a2 / a1), 4)}} = ${F.n(n, 4)}$.</p>`, R`<p>(iii) $n \approx \tfrac32$: $T^2 \propto a^3$. Com todos os 8 planetas (ajuste no lab), $n = 1{,}4997$. Foi assim, olhando números, que Kepler descobriu a lei, 70 anos antes de Newton explicá-la.</p>`] };
        } },
      ],
    });
    const chefao = F.chefao({
      titulo: "A fonte e o fundo",
      enun: R`<p>Um contador mede uma fonte radioativa a cada 3 min: $t = 0, 3, \ldots, 30$ min e $N = 820;\ 586;\ 420;\ 303;\ 220;\ 161;\ 120;\ 91;\ 70;\ 55;\ 45$ contagens/min. Sem a fonte, o contador marca 20 contagens/min (radiação de fundo: raios cósmicos, rochas...). (a) No mono-log, os pontos brutos fazem uma reta? (b) Que meia-vida você acharia usando só os pontos de 24 e 30 min, sem descontar o fundo? (c) Desconte o fundo e ache a meia-vida. (d) Quanto vale a constante de decaimento $\lambda$ (com $N = N_0e^{-\lambda t}$)? (e) Depois de quanto tempo a fonte passa a contar o mesmo que o fundo?</p>`,
      fig: chefFig,
      dicas: [R`<p>(a) Para $t$ grande, $N \to 20$, não para zero.</p>`, R`<p>(b) $T_{1/2} = \frac{\Delta t\,\ln 2}{\ln(N_1/N_2)}$.</p>`, R`<p>(c) Depois de descontar: 800, 566, 400, ... Procure quando cai pela metade.</p>`, R`<p>(e) $800\cdot2^{-t/T_{1/2}} = 20$.</p>`],
      sol: R`<p><b>(a)</b> Não: o fim "achata" e se aproxima de 20 em vez de seguir caindo. Uma exponencial pura cai para zero; aqui é exponencial + constante.</p>
        <p><b>(b)</b> $\frac{6\ln 2}{\ln(70/45)} \approx 9{,}4$ min: muito errado. Usando 0 e 30 min, daria 7,2 min.</p>
        <p><b>(c)</b> Descontando 20: $800, 566, 400, 283, 200, \ldots, 50, 35, 25$. De 800 para 400 em 6 min, de 50 para 25 em 6 min: $T_{1/2} = 6{,}0$ min, agora uma reta perfeita no mono-log.</p>
        <p><b>(d)</b> $\lambda = \frac{\ln 2}{6{,}0} \approx 0{,}116$ min⁻¹.</p>
        <p><b>(e)</b> $2^{-t/6} = \frac{1}{40} \Rightarrow t = 6\log_2 40 \approx 31{,}9$ min. Depois disso, o sinal da fonte se perde no fundo: é por isso que se mede o fundo antes, sempre. Conferi tudo em Python.</p>`,
    });
    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Num log-log, a reta passa por $(1;\ 2)$ e $(100;\ 2000)$. Qual o expoente $n$?</p>`, fig: lg({ lx: 1, ly: 1, x: [0.5, 200], y: [1, 5000], pts: [[1, 2], [100, 2000]], linhas: [[0.5, 2 * 0.5 ** 1.5, 200, 2 * 200 ** 1.5]] }), num: { v: 1.5, tol: 0.01 }, dicas: [R`<p>$n = \frac{\log(2000/2)}{\log(100/1)}$.</p>`], resp: "1,5", sol: R`<p>$\frac{\log 1000}{\log 100} = \frac32$.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>Pela lei de Kepler, $T \propto a^{1{,}5}$ ($T$ em anos e $a$ em UA, com a Terra em (1; 1)). Qual o período, em anos, de um asteroide com $a = 4$ UA?</p>`, fig: kepF, num: { v: 8, tol: 0.01, un: "anos" }, dicas: [R`<p>$T = 4^{1{,}5}$.</p>`], resp: "8 anos", sol: R`<p>$4^{3/2} = 8$ anos.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Que tipo de lei vira reta num gráfico mono-log (só o eixo $y$ em log)?</p>`, fig: decF(5), alts: [R`potência, $y = Cx^n$`, R`exponencial, $y = Ae^{kx}$`, R`linear, $y = ax + b$`, R`inversa, $y = 1/x$`, R`logarítmica, $y = \ln x$`], certa: "B", dicas: [R`<p>$\ln y = \ln A + kx$.</p>`], resp: "B", sol: R`<p>Exponencial: $\ln y$ é linear em $x$.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Uma fonte cai de 800 para 100 contagens/min em 15 min. Qual a meia-vida, em min?</p>`, fig: decF(5, 800, 15), num: { v: 5, tol: 0.01, un: "min" }, dicas: [R`<p>$800/100 = 2^3$.</p>`], resp: "5 min", sol: R`<p>3 meias-vidas em 15 min: 5 min.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>No gráfico $\ln N \times t$, a inclinação é $-0{,}231$ min⁻¹. Qual a meia-vida, em min?</p>`, fig: decF(3, 800, 15), num: { v: 3.0, tol: 0.01, un: "min" }, dicas: [R`<p>$T_{1/2} = \frac{\ln 2}{|k|}$.</p>`], resp: "3,0 min", sol: R`<p>$\frac{0{,}693}{0{,}231} \approx 3{,}0$ min.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Uma descarga $V = V_0e^{-t/\tau}$ foi posta num gráfico de $\log_{10}V \times t$, com inclinação $-0{,}1$ s⁻¹. Quanto vale $\tau$, em s?</p>`, fig: decF(3, 800, 15).replace("contagens/min", "V"), num: { v: 4.343, tol: 0.005, un: "s" }, dicas: [R`<p>$\log_{10}V = \log_{10}V_0 - \frac{t}{\tau}\log_{10}e$; e $\log_{10}e = \frac1{\ln 10}$.</p>`], resp: "≈ 4,34 s", sol: R`<p>$\frac{1}{\tau\ln 10} = 0{,}1 \Rightarrow \tau = \frac{1}{0{,}2303} \approx 4{,}34$ s. Cuidado com a base do log!</p>` }),
      F.exercicio({ n: 7, nivel: "Físico", enun: R`<p>Se $y = 50 \pm 2$, qual a incerteza de $\ln y$?</p>`, fig: lg({ ly: 1, x: [0, 4], y: [10, 200], lin: [1, 2, 3], pts: [[2, 50]], extra: D.txt(296, 104, "y = 50 ± 2", "tx2", "start") + D.txt(296, 124, "ln y = 3,91 ± ?", "tx2", "start") }), num: { v: 0.04, tol: 0.01 }, dicas: [R`<p>$\Delta(\ln y) = \frac{\Delta y}{y}$.</p>`], resp: "0,04", sol: R`<p>$\frac{2}{50} = 0{,}04$: a incerteza relativa vira incerteza absoluta no log.</p>` }),
      F.exercicio({ n: 8, nivel: "Físico", enun: R`<p>Qual a inclinação do gráfico log-log da intensidade de uma lâmpada pontual contra a distância?</p>`, fig: lg({ lx: 1, ly: 1, x: [0.1, 2], y: [0.05, 50], pts: [0.2, 0.4, 0.8, 1.6].map((d) => [d, 0.32 / d / d]), linhas: [[0.1, 32, 2, 0.08]], xl: "d (m)", yl: "I" }), num: { v: -2, tol: 0.01 }, dicas: [R`<p>$I \propto d^{-2}$.</p>`], resp: "−2", sol: R`<p>$I = \frac{P}{4\pi}d^{-2}$: inclinação $-2$.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Num eixo log, a distância entre 1 e 10 é igual à distância entre 10 e:</p>`, fig: fig(`<line x1="60" x2="500" y1="100" y2="100" style="stroke:var(--ink2)"/>` + [1, 10, 100].map((v, i) => `<line x1="${80 + i * 200}" x2="${80 + i * 200}" y1="92" y2="108" style="stroke:var(--ink2)"/>` + D.txt(80 + i * 200, 128, i < 2 ? String(v) : "?", "tx2")).join("") + [2, 3, 4, 5, 6, 7, 8, 9].map((m) => `<line x1="${80 + 200 * L(m)}" x2="${80 + 200 * L(m)}" y1="96" y2="104" style="stroke:var(--ink3)"/>`).join(""), 160), num: { v: 100, tol: 0.001 }, dicas: [R`<p>Distâncias iguais = mesmo fator.</p>`], resp: "100", sol: R`<p>100: cada "década" ocupa o mesmo espaço.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>O metabolismo dos animais segue aproximadamente $P \propto M^{0{,}75}$ (lei de Kleiber). Se a massa fica 16 vezes maior, o metabolismo fica quantas vezes maior?</p>`, fig: lg({ lx: 1, ly: 1, x: [0.01, 10000], y: [0.1, 10000], pts: [[0.02, 0.3], [0.3, 2.8], [3, 15], [70, 90], [600, 520], [4000, 1800]].map(([m, p]) => [m, p]), linhas: [[0.01, 3.4 * 0.01 ** 0.75, 10000, 3.4 * 10000 ** 0.75]], xl: "massa (kg)", yl: "metabolismo (W)" }), num: { v: 8, tol: 0.01 }, dicas: [R`<p>$16^{0{,}75} = (2^4)^{3/4}$.</p>`], resp: "8 vezes", sol: R`<p>$16^{3/4} = 2^3 = 8$.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Bactérias dobram a cada 20 min. Qual a inclinação do gráfico $\log_{10}N \times t$, em min⁻¹?</p>`, fig: lg({ ly: 1, x: [0, 120], y: [500, 100000], lin: [0, 40, 80, 120], pts: [0, 20, 40, 60, 80, 100, 120].map((t) => [t, 1000 * 2 ** (t / 20)]), linhas: [[0, 1000, 120, 64000]], xl: "t (min)", yl: "N" }), num: { v: 0.01505, tol: 0.01, un: "min⁻¹" }, dicas: [R`<p>Em 20 min, $\log N$ sobe $\log 2$.</p>`], resp: "≈ 0,0151 min⁻¹", sol: R`<p>$\frac{\log_{10}2}{20} = \frac{0{,}301}{20} \approx 0{,}0151$ min⁻¹.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>A força de arrasto do ar num carrinho foi 5 N a 10 m/s e 45 N a 30 m/s. Supondo $F = Cv^n$, quanto vale $n$?</p>`, fig: lg({ lx: 1, ly: 1, x: [5, 50], y: [1, 200], pts: [[10, 5], [30, 45]], linhas: [[5, 1.25, 50, 125]], xl: "v (m/s)", yl: "F (N)" }), num: { v: 2, tol: 0.01 }, dicas: [R`<p>$n = \frac{\ln 9}{\ln 3}$.</p>`], resp: "2", sol: R`<p>$\frac{\ln(45/5)}{\ln(30/10)} = \frac{\ln 9}{\ln 3} = 2$: arrasto quadrático.</p>` }),
      F.exercicio({ n: 13, nivel: "Máximo", enun: R`<p>Todas as medidas de $y$ têm incerteza relativa de 5%. No gráfico com $y$ em escala log, as barras de erro:</p>`, fig: lg({ ly: 1, x: [0, 5], y: [1, 1000], lin: [1, 2, 3, 4], pts: [1, 2, 3, 4].map((x) => [x, 10 ** (x * 0.7)]), extra: [1, 2, 3, 4].map((x) => { const P = (v) => 180 - (L(v) / 3) * 150, X = 90 + (x / 5) * 380, y = 10 ** (x * 0.7); return `<line x1="${X}" x2="${X}" y1="${P(y * 1.6)}" y2="${P(y / 1.6)}" style="stroke:var(--ink2);stroke-width:2"/><line x1="${X - 5}" x2="${X + 5}" y1="${P(y * 1.6)}" y2="${P(y * 1.6)}" style="stroke:var(--ink2);stroke-width:2"/><line x1="${X - 5}" x2="${X + 5}" y1="${P(y / 1.6)}" y2="${P(y / 1.6)}" style="stroke:var(--ink2);stroke-width:2"/>`; }).join("") + D.txt(460, 172, "barras exageradas", "tx2", "end") }), alts: ["crescem com y.", "têm todas o mesmo tamanho.", "diminuem com y.", "somem.", "dependem de x."], certa: "B", dicas: [R`<p>$\Delta(\log y) \propto \frac{\Delta y}{y}$.</p>`], resp: "B", sol: R`<p>No log, incerteza relativa constante vira barra de tamanho constante. (A figura exagera as barras para dar para ver.)</p>` }),
      F.exercicio({ n: 14, nivel: "Máximo", enun: R`<p>Os dados ficam retos no mono-log e curvos no log-log. A lei é:</p>`, fig: decF(6), alts: ["de potência.", "exponencial.", "linear.", "não dá para saber.", "logarítmica."], certa: "B", dicas: [R`<p>Reta no mono-log = exponencial.</p>`], resp: "B", sol: R`<p>Exponencial.</p>` }),
      F.exercicio({ n: 15, nivel: "Máximo", enun: R`<p>O carbono-14 tem meia-vida de 5730 anos. Uma amostra tem 25% do C-14 de um ser vivo. Que idade ela tem, em anos?</p>`, fig: lg({ ly: 1, x: [0, 20000], y: [5, 150], lin: [0, 5730, 11460, 17190], pts: [0, 5730, 11460, 17190].map((t) => [t, 100 * 2 ** (-t / 5730)]), linhas: [[0, 100, 20000, 100 * 2 ** (-20000 / 5730)]], xl: "idade (anos)", yl: "C-14 (%)" }), num: { v: 11460, tol: 0.005, un: "anos" }, dicas: [R`<p>25% = duas metades.</p>`], resp: "11 460 anos", sol: R`<p>$2 \times 5730 = 11\,460$ anos.</p>` }),
      F.exercicio({ n: 16, nivel: "Máximo", enun: R`<p>Por que o log-log é a ferramenta certa quando o expoente é desconhecido, e não a linearização com $x^n$?</p>`, fig: kepF, alts: ["Porque fica mais bonito.", "Porque a inclinação dá o próprio n, sem precisar adivinhá-lo antes.", "Porque elimina as incertezas.", "Porque sempre passa pela origem.", "Porque funciona para exponenciais."], certa: "B", dicas: [R`<p>$\log y = \log C + n\log x$.</p>`], resp: "B", sol: R`<p>O expoente sai da inclinação. Depois de descobrir $n$, pode-se linearizar com $x^n$ para achar $C$ com mais cuidado ${F.ret("FE07")}.</p>` }),
    ];
    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Física experimental · escalas log</div>
        <div class="q">Mercúrio leva 0,24 ano para dar uma volta no Sol; Netuno, 165 anos. Que lei liga o período ao tamanho da órbita?</div>
        <p>Num gráfico comum, os planetas de dentro ficam todos espremidos num canto. No gráfico log-log, eles se espalham e caem numa reta perfeita de inclinação 1,5: $T^2 \propto a^3$.</p></div>
        ${F.chute({ q: "uma grandeza cai pela metade a cada 5 minutos. Em que gráfico os pontos ficam numa reta?", ops: ["Linear (y × t)", "Mono-log (log y × t)", "Log-log (log y × log t)", "Em nenhum"], certa: 1, exp: "Cair pela metade em tempos iguais é uma exponencial: log y diminui sempre o mesmo tanto a cada 5 min, então log y × t é uma reta." })}`),

      F.secao("loglog", "Log-log: leis de potência", R`
        <h3>Teorema 1: no log-log, a inclinação é o expoente</h3>
        ${F.demo("demonstração", R`<p>(i) Tome o log dos dois lados de $y = Cx^n$: $\log y = \log C + n\log x$.</p>
          <p>(ii) Com $Y = \log y$ e $X = \log x$: $Y = nX + \log C$, uma reta de inclinação $n$ e coeficiente linear $\log C$.</p>
          <p>(iii) Mudar a base do log multiplica $X$ e $Y$ pelo mesmo fator: $n$ não muda. Mudar a unidade de $x$ desloca $X$ (soma uma constante): $n$ também não muda. Por dois pontos: $n = \frac{\log(y_2/y_1)}{\log(x_2/x_1)}$. $\blacksquare$</p>`)}
        ${F.formula(R`y = Cx^n \iff \log y = \log C + n\log x,\qquad n = \frac{\log(y_2/y_1)}{\log(x_2/x_1)}`, "Log-log")}
        <div id="lab-loglog"></div>
        ${F.caixa("pegadinha", R`<p><b>A inclinação no log-log é medida em décadas, não em centímetros da folha.</b> Se o papel log tem décadas de tamanhos diferentes nos dois eixos, a inclinação "de régua" engana. Calcule sempre com $\frac{\log(y_2/y_1)}{\log(x_2/x_1)}$. E o zero não existe no eixo log: $t = 0$ não aparece no log-log.</p>`)}`),

      F.secao("monolog", "Mono-log: exponenciais", R`
        <h3>Teorema 2: no mono-log, a inclinação dá a constante da exponencial</h3>
        ${F.demo("demonstração", R`<p>(i) Com $y = Ae^{kx}$: $\ln y = \ln A + kx$, reta em $x$ com inclinação $k$.</p>
          <p>(ii) Com $\log_{10}$: $\log_{10}y = \log_{10}A + (k\log_{10}e)\,x$; a inclinação é $\frac{k}{\ln 10}$, logo $k = (\text{inclinação})\cdot\ln 10$.</p>
          <p>(iii) Se $k < 0$, a meia-vida é o tempo para $y$ cair pela metade: $e^{kT_{1/2}} = \tfrac12 \Rightarrow T_{1/2} = \frac{\ln 2}{|k|}$; e a constante de tempo é $\tau = \frac1{|k|}$. $\blacksquare$</p>`)}
        ${F.formula(R`y = Ae^{kx} \iff \ln y = \ln A + kx,\qquad T_{1/2} = \frac{\ln 2}{|k|},\quad \tau = \frac1{|k|}`, "Mono-log")}
        <h3>Teorema 3: no log, a incerteza relativa vira absoluta</h3>
        ${F.demo("demonstração", R`<p>(i) Derivada: $\Delta(\ln y) = \frac{\Delta y}{y}$ ${F.ret("FE07")}; e $\Delta(\log_{10}y) = \frac{1}{\ln 10}\frac{\Delta y}{y} \approx 0{,}434\,\frac{\Delta y}{y}$.</p>
          <p>(ii) Consequência: se todas as medidas têm a mesma incerteza <b>relativa</b> (comum em contagens grandes e instrumentos de escala), as barras ficam do mesmo tamanho no eixo log. Contagens pequenas, ao contrário, têm barras enormes no log. $\blacksquare$</p>`)}
        ${F.caixa("fisico", R`<p><b>A escala log mostra o que importa em fenômenos que variam por fatores:</b> terremotos (escala Richter), som (decibéis), acidez (pH), brilho de estrelas (magnitudes). Todas são logaritmos, porque nossos sentidos e a natureza muitas vezes funcionam por razões, não por diferenças.</p>`)}
        ${F.caixa("olimpiada", R`<p><b>Problema clássico de prova experimental:</b> "determine a dependência de $y$ com $x$". Faça log-log primeiro. Se der reta, é potência, e a inclinação é o expoente (muitas vezes um número simples como $\tfrac12$, $\tfrac32$ ou $-2$). Se curvar, teste o mono-log.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade,</b> leis de potência aparecem nas leis de escala (o "porquê" da lei de Kleiber, a turbulência de Kolmogorov com expoente $-5/3$) e a análise dimensional prevê expoentes antes de medir. O log-log é a forma de testá-las.</p>`)}
        ${exemplos}`),

      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-loglog"); e.outerHTML = F.lab("Qual escala endireita?", "lab-loglog"); SIM.loglog(document.getElementById("lab-loglog"), F); },
});
