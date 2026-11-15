/* Química B04 · Modelo quântico e distribuição eletrônica. Conferido em Python e contra SIM.orbitais._config:
   capacidade: orbitais por subnível 2l + 1 (s 1, p 3, d 5, f 7); elétrons 2(2l + 1) (2, 6, 10, 14); por camada 2n² (2, 8, 18, 32);
   ordem de energia (Pauling): 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s 5f 6d 7p (n + l crescente; no empate, menor n primeiro);
   Na (11): 1s² 2s² 2p⁶ 3s¹; P (15): …3s² 3p³ (3 desemparelhados); Cl (17): …3s² 3p⁵; Ca (20): …4s²; Fe (26): [Ar] 4s² 3d⁶ (4 desemparelhados);
   Cr (24): [Ar] 4s¹ 3d⁵ (6 desemparelhados); Cu (29): [Ar] 4s¹ 3d¹⁰ (1); Zn (30): [Ar] 4s² 3d¹⁰ (0); Br (35): [Ar] 4s² 3d¹⁰ 4p⁵;
   íons: Fe²⁺ [Ar] 3d⁶ (4); Fe³⁺ [Ar] 3d⁵ (5); Cu²⁺ [Ar] 3d⁹ (1); Mn²⁺ [Ar] 3d⁵ (5); Zn²⁺ [Ar] 3d¹⁰ (0); Ti²⁺ [Ar] 3d² (2);
   chefão (Fe): elétrons com l = 1: 2p⁶ + 3p⁶ = 12; com m_l = 0: 1s² 2s² 2p(2) 3s² 3p(2) 4s² 3d(1) = 13; Fe²⁺ e Cr têm 24 elétrons e configurações diferentes. */
F.registrar("quimica/B04", {
  retoma: ["B01", "B03"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    const SIMB = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr".split(" ");
    const NOME = "hidrogênio hélio lítio berílio boro carbono nitrogênio oxigênio flúor neônio sódio magnésio alumínio silício fósforo enxofre cloro argônio potássio cálcio escândio titânio vanádio cromo manganês ferro cobalto níquel cobre zinco gálio germânio arsênio selênio bromo criptônio".split(" ");
    const ORD = [["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6], ["4s", 2], ["3d", 10], ["4p", 6]];
    const sob = (n) => String(n).split("").map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]).join("");
    const cfg = (Z) => { const oc = {}; let r = Z; ORD.forEach(([s, c]) => { const k = Math.min(c, r); oc[s] = k; r -= k; }); if (Z === 24) { oc["4s"] = 1; oc["3d"] = 5; } if (Z === 29) { oc["4s"] = 1; oc["3d"] = 10; } return oc; };
    const texto = (oc, tex = false) => ORD.filter(([s]) => oc[s]).map(([s]) => (tex ? s + "^{" + oc[s] + "}" : s + sob(oc[s]))).join(tex ? "\\," : " ");
    const desemp = (oc) => ORD.reduce((t, [s, c]) => { const k = oc[s], n = c / 2; return t + (k <= n ? k : c - k); }, 0);
    const valencia = (oc) => { const n = Math.max(...ORD.filter(([s]) => oc[s]).map(([s]) => +s[0])); return [n, ORD.filter(([s]) => +s[0] === n).reduce((t, [s]) => t + oc[s], 0)]; };
    /* caixinhas de um subnível com k elétrons (Hund): x, y do primeiro orbital */
    const caixas = (x, y, s, k, cap) => { const n = cap / 2; let r = D.txt(x - 8, y + 5, s, "tx2", "end"); for (let i = 0; i < n; i++) { const up = k > i, dn = k > n + i, xx = x + i * 28; r += `<rect x="${xx}" y="${y - 11}" width="24" height="22" rx="3" style="fill:${up ? "color-mix(in srgb,var(--mod) 16%,transparent)" : "none"};stroke:${up ? "var(--mod)" : "var(--ink3)"};stroke-width:1.5"/>` + (up ? D.seta(xx + 8, y + 8, xx + 8, y - 8, "var(--ink)", 1.5) : "") + (dn ? D.seta(xx + 16, y - 8, xx + 16, y + 8, "var(--warn)", 1.5) : ""); } return r; };
    const diagrama = (oc, so = null) => { const P = { "1s": [60, 150], "2s": [60, 118], "2p": [150, 118], "3s": [60, 86], "3p": [150, 86], "4s": [60, 54], "3d": [290, 54], "4p": [150, 22] }; return fig((so || ORD.map((o) => o[0])).map((s) => caixas(P[s][0], P[s][1], s, oc[s] || 0, ORD.find((o) => o[0] === s)[1])).join(""), 175); };
    /* diagrama de Pauling com as setas diagonais */
    const pauling = fig([["1s"], ["2s", "2p"], ["3s", "3p", "3d"], ["4s", "4p", "4d", "4f"], ["5s", "5p", "5d", "5f"], ["6s", "6p", "6d"], ["7s", "7p"]].map((l, i) => l.map((s, j) => D.txt(120 + j * 70, 24 + i * 22, s, "tx", "middle", 'style="font-weight:600"')).join("")).join("") + [[0, 0, 0], [1, 0, 1], [1, 1, 2], [2, 1, 3], [2, 2, 4], [3, 2, 5], [3, 3, 6], [3, 3, 7]].map(([j0, , d], k) => { const pts = []; for (let i = 0; i < 7; i++) { const j = d - i; if (j >= 0 && j < [1, 2, 3, 4, 4, 3, 2][i]) pts.push([120 + j * 70, 24 + i * 22]); } if (pts.length < 2) return ""; const a = pts[0], b = pts[pts.length - 1]; return `<line x1="${a[0] + 14}" y1="${a[1] - 10}" x2="${b[0] - 14}" y2="${b[1] + 4}" style="stroke:var(--mod);stroke-width:1.4;opacity:.7"/>`; }).join("") + D.txt(430, 60, "siga as diagonais,", "tx2") + D.txt(430, 80, "de cima para baixo:", "tx2") + D.txt(430, 106, "1s 2s 2p 3s 3p 4s 3d 4p 5s…", "tx2"), 180);
    /* formas dos orbitais s e p */
    const formas = fig(`<circle cx="90" cy="76" r="34" style="fill:color-mix(in srgb,var(--mod) 35%,transparent);stroke:var(--mod);stroke-width:2"/>` + D.txt(90, 136, "s: esfera (1 orbital)", "tx2") + [[240, 0], [360, 90], [470, 45]].map(([x, a], i) => `<g transform="rotate(${a} ${x} 76)"><ellipse cx="${x - 24}" cy="76" rx="24" ry="14" style="fill:color-mix(in srgb,var(--ok) 35%,transparent);stroke:var(--ok);stroke-width:2"/><ellipse cx="${x + 24}" cy="76" rx="24" ry="14" style="fill:color-mix(in srgb,var(--ok) 35%,transparent);stroke:var(--ok);stroke-width:2"/></g>` + D.txt(x, 136, ["px", "py", "pz"][i], "tx2")).join("") + D.txt(360, 156, "p: halteres em três direções perpendiculares (3 orbitais)", "tx2"), 170);
    const tab = (x, y, larg, linhas) => linhas.map((l, i) => l.map((c, j) => D.txt(x + larg.slice(0, j).reduce((a, b) => a + b, 0) + larg[j] / 2, y + i * 22, c, "tx2", "middle", i ? "" : 'style="font-weight:700;fill:var(--ink)"')).join("")).join("") + `<line x1="${x}" x2="${x + larg.reduce((a, b) => a + b, 0)}" y1="${y + 7}" y2="${y + 7}" style="stroke:var(--ink3)"/>`;

    const IONS = [[26, 2, "Fe"], [26, 3, "Fe"], [29, 2, "Cu"], [25, 2, "Mn"], [30, 2, "Zn"], [22, 2, "Ti"]];
    const ion = (Z, q) => { const oc = cfg(Z); let r = q; ["4p", "4s", "3d"].forEach((s) => { const k = Math.min(oc[s], r); oc[s] -= k; r -= k; }); return oc; };
    const exemplos = F.exemplo({
      titulo: "Distribuir elétrons",
      casos: [
        { nome: "Fácil: a distribuição de um átomo", gerar: (p) => {
          const Z = p ? 15 : F.escolha([11, 15, 17, 20, 13, 16, 19]), oc = cfg(Z), [n, v] = valencia(oc);
          return { enun: R`<p>Faça a distribuição eletrônica do ${NOME[Z - 1]} ($Z = ${Z}$) em subníveis, diga quantos elétrons há na camada de valência e quantos estão desemparelhados.</p>`, fig: diagrama(oc),
            passos: [R`<p>(i) Átomo neutro: ${Z} elétrons. Preencha na ordem do diagrama de Pauling, até a capacidade de cada subnível (s: 2; p: 6; d: 10).</p>`,
              R`<p>(ii) $${texto(oc, true)}$. Conferência: os expoentes somam ${Z}.</p>`,
              R`<p>(iii) Camada de valência = a de maior $n$ com elétrons: $n = ${n}$, com ${v} elétron${v > 1 ? "s" : ""}.</p>`,
              R`<p>(iv) Desemparelhados: olhe só o último subnível, com a regra de Hund (um elétron em cada orbital antes de emparelhar): ${desemp(oc)}. ${desemp(oc) ? "Átomos com elétrons desemparelhados são atraídos por ímãs (paramagnéticos)." : "Todos emparelhados: o átomo é diamagnético."}</p>`] };
        } },
        { nome: "Médio: o íon de um metal de transição", gerar: (p) => {
          const [Z, q, s] = p ? IONS[0] : F.escolha(IONS), n = cfg(Z), i = ion(Z, q);
          return { enun: R`<p>Dê a distribuição eletrônica do íon $\ce{${s}^{${q}+}}$ ($Z = ${Z}$) e o número de elétrons desemparelhados.</p>`, fig: diagrama(i, ["4s", "3d"]),
            passos: [R`<p>(i) Comece pelo átomo <b>neutro</b>: $${texto(n, true)}$, ou [Ar] $4s^{${n["4s"]}}\,3d^{${n["3d"]}}$.</p>`,
              R`<p>(ii) Para formar o cátion, os elétrons saem da <b>camada mais externa</b> (maior $n$), não do último subnível preenchido. Aqui, primeiro os do $4s$, depois os do $3d$.</p>`,
              R`<p>(iii) Tirando ${q}: ${n["4s"]} do $4s$${q > n["4s"] ? " e " + (q - n["4s"]) + " do $3d$" : ""}. Resultado: [Ar] $3d^{${i["3d"]}}$${i["4s"] ? "\\,4s^{" + i["4s"] + "}" : ""}.</p>`,
              R`<p>(iv) Cinco orbitais $d$ com ${i["3d"]} elétron${i["3d"] > 1 ? "s" : ""}, pela regra de Hund: ${desemp(i)} desemparelhado${desemp(i) === 1 ? "" : "s"}. O erro clássico é tirar os elétrons do $3d$ primeiro, só porque ele foi o último a ser preenchido: energia de preenchimento e distância ao núcleo são coisas diferentes.</p>`] };
        } },
        { nome: "Olimpíada: os quatro números do último elétron", gerar: (p) => {
          const Z = p ? 26 : F.escolha([26, 15, 17, 22, 8, 28]), oc = cfg(Z), ult = [...ORD].reverse().find(([s]) => oc[s] && (s !== "4s" || !oc["3d"]))[0], l = "spd".indexOf(ult[1]), k = oc[ult], no = 2 * l + 1, pos = (k - 1) % no, ml = pos - l, ms = k <= no ? "+\\frac12" : "-\\frac12";
          return { enun: R`<p>Dê os quatro números quânticos do elétron mais energético (o último a entrar, pela ordem de Pauling) do ${NOME[Z - 1]} ($Z = ${Z}$). Convenção: os orbitais de um subnível são preenchidos de $m_\ell = -\ell$ até $+\ell$, e o primeiro elétron de cada orbital tem $m_s = +\frac12$.</p>`, fig: diagrama(oc, [ult]),
            passos: [R`<p>(i) Distribuição: $${texto(oc, true)}$. O subnível de maior energia com elétrons é o $${ult}$, com ${k} elétron${k > 1 ? "s" : ""}.</p>`,
              R`<p>(ii) $n = ${ult[0]}$ (o número da frente). $\ell = ${l}$ (a letra: s = 0, p = 1, d = 2).</p>`,
              R`<p>(iii) Os ${no} orbitais têm $m_\ell = ${Array.from({ length: no }, (_, i) => i - l).join(", ")}$. Pela regra de Hund, os ${Math.min(k, no)} primeiros elétrons entram um em cada orbital${k > no ? ", e os " + (k - no) + " seguintes voltam ao começo, emparelhando" : ""}. O ${k}º elétron cai no orbital de $m_\ell = ${ml}$.</p>`,
              R`<p>(iv) Ele é o ${k <= no ? "primeiro" : "segundo"} desse orbital: $m_s = ${ms}$. Resposta: $(n, \ell, m_\ell, m_s) = (${ult[0]}, ${l}, ${ml}, ${ms})$. O sinal de $m_s$ e a ordem dos $m_\ell$ são convenções: em prova, use a que o enunciado der.</p>`] };
        } },
      ],
    });

    const chefao = F.chefao({
      titulo: "O elétron 26",
      enun: R`<p>Convenção deste problema: os orbitais de um subnível são preenchidos de $m_\ell = -\ell$ até $+\ell$, e o primeiro elétron de cada orbital tem $m_s = +\frac12$.</p>
        <p>(a) O último elétron a entrar no átomo neutro X, pela ordem de Pauling, tem $(n, \ell, m_\ell, m_s) = (3, 2, -2, -\frac12)$. Qual é o número atômico de X? Escreva a distribuição completa. (b) Quantos elétrons de X têm $\ell = 1$? (c) Quantos elétrons de X têm $m_\ell = 0$? (d) Escreva as distribuições de $\ce{X^{2+}}$ e $\ce{X^{3+}}$ e diga quantos elétrons desemparelhados cada um tem. Qual dos dois íons deve ser mais atraído por um ímã? (e) O íon $\ce{X^{2+}}$ e o átomo neutro de cromo ($Z = 24$) têm o mesmo número de elétrons. Eles têm a mesma distribuição? (f) Quantos elétrons cabem, no máximo, na camada $n = 4$? Mostre de onde sai o número, contando subníveis e orbitais.</p>`,
      fig: diagrama({ "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6, "4s": 2, "3d": 0, "4p": 0 }),
      dicas: [R`<p>(a) $n = 3$ e $\ell = 2$: subnível $3d$. Com $m_\ell = -2$ e $m_s = -\frac12$, ele é o <b>segundo</b> elétron do primeiro orbital. Quantos elétrons o $3d$ já tinha quando isso aconteceu?</p>`,
        R`<p>(b) $\ell = 1$ são os subníveis $p$. (c) Em cada subnível, o orbital de $m_\ell = 0$ é um só: conte quantos elétrons há nele.</p>`,
        R`<p>(d) Cátion: os elétrons saem do maior $n$. (e) Lembre de uma das duas exceções do quarto período.</p>`],
      sol: R`<p><b>(a)</b> No $3d$, os cinco primeiros elétrons entram um em cada orbital (Hund), com $m_s = +\frac12$. O sexto volta ao orbital de $m_\ell = -2$ com $m_s = -\frac12$: é ele. Então o $3d$ tem 6 elétrons: $1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^6$, que somam <b>26</b>. X é o ferro.</p>
        <p><b>(b)</b> Subníveis $p$: $2p^6$ e $3p^6$. São <b>12</b> elétrons.</p>
        <p><b>(c)</b> Todo orbital $s$ tem $m_\ell = 0$: $1s^2$, $2s^2$, $3s^2$, $4s^2$, 8 elétrons. Em cada subnível $p$ cheio, o orbital de $m_\ell = 0$ tem 2: mais 4. No $3d^6$, o orbital de $m_\ell = 0$ tem 1 (só o de $m_\ell = -2$ está emparelhado). Total: $8 + 4 + 1 = $ <b>13</b>.</p>
        <p><b>(d)</b> $\ce{Fe^{2+}}$: saem os dois do $4s$: [Ar] $3d^6$, com 4 desemparelhados. $\ce{Fe^{3+}}$: sai mais um, do $3d$: [Ar] $3d^5$, com 5 desemparelhados (subnível semipreenchido, especialmente estável). O $\ce{Fe^{3+}}$ tem mais elétrons desemparelhados e é mais fortemente paramagnético.</p>
        <p><b>(e)</b> Não. $\ce{Fe^{2+}}$: [Ar] $3d^6$. Cromo: [Ar] $4s^1\,3d^5$. Os dois têm 24 elétrons, mas núcleos diferentes puxam com forças diferentes: no íon, com 26 prótons, o $3d$ fica bem abaixo do $4s$. "Isoeletrônico" garante o mesmo número de elétrons, não a mesma arrumação, quando há orbitais $d$ em jogo.</p>
        <p><b>(f)</b> Para $n = 4$, $\ell$ vai de 0 a 3: subníveis $4s$, $4p$, $4d$, $4f$, com 1, 3, 5 e 7 orbitais: $1 + 3 + 5 + 7 = 16 = 4^2$ orbitais. Dois elétrons por orbital (Pauli): <b>32</b> $= 2\cdot4^2$. Conferido em Python.</p>`,
    });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Quantos elétrons cabem, no máximo, num subnível $d$?</p>`, fig: fig(caixas(210, 80, "d", 0, 10), 130), num: { v: 10, un: "elétrons" }, dicas: [R`<p>Conte as caixinhas e lembre: dois elétrons por orbital.</p>`], resp: "10", sol: R`<p>Cinco orbitais, dois elétrons em cada: 10. Em geral: s 2, p 6, d 10, f 14.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>A distribuição eletrônica correta do sódio ($Z = 11$) é:</p>`, fig: pauling, alts: [R`$1s^2\,2s^2\,2p^7$`, R`$1s^2\,2s^2\,2p^6\,3s^1$`, R`$1s^2\,2s^2\,2p^5\,3s^2$`, R`$1s^2\,2s^1\,2p^6\,3s^2$`, R`$1s^2\,2s^2\,3s^2\,2p^5$`], certa: "B", dicas: [R`<p>Ordem: 1s, 2s, 2p, 3s. O 2p só aguenta 6.</p>`], resp: "B", sol: R`<p>$2 + 2 + 6 + 1 = 11$. <b>A</b> estoura a capacidade do $2p$; <b>C</b> e <b>D</b> deixam um subnível de baixo incompleto.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Quantos elétrons tem o cloro ($Z = 17$) na camada de valência?</p>`, fig: diagrama(cfg(17)), num: { v: 7, un: "elétrons" }, dicas: [R`<p>Distribua e some os elétrons da camada de maior $n$.</p>`], resp: "7", sol: R`<p>$1s^2\,2s^2\,2p^6\,3s^2\,3p^5$: na camada 3 há $2 + 5 = 7$. Falta um para completar oito: por isso o cloro forma o íon $\ce{Cl-}$ com tanta facilidade.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Qual dos preenchimentos do subnível $2p$ com 3 elétrons obedece à regra de Hund?</p>`, fig: fig(caixas(60, 50, "I", 3, 6) + `<g transform="translate(250 0)">${caixas(60, 50, "II", 0, 6)}${D.seta(68, 58, 68, 42, "var(--ink)", 1.5) + D.seta(76, 42, 76, 58, "var(--warn)", 1.5) + D.seta(96, 58, 96, 42, "var(--ink)", 1.5)}</g>` + `<g transform="translate(0 70)">${caixas(60, 50, "III", 0, 6)}${D.seta(68, 58, 68, 42, "var(--ink)", 1.5) + D.seta(96, 42, 96, 58, "var(--warn)", 1.5) + D.seta(124, 58, 124, 42, "var(--ink)", 1.5)}</g>`, 150), alts: ["I: um elétron em cada orbital, todos com o mesmo spin.", "II: dois emparelhados e um sozinho.", "III: um em cada orbital, com spins misturados.", "I e III.", "Todos."], certa: "A", dicas: [R`<p>Primeiro um em cada orbital, e com spins paralelos.</p>`], resp: "A", sol: R`<p>Hund: máxima multiplicidade. Os três elétrons ocupam orbitais diferentes <b>e</b> com o mesmo spin. II emparelha cedo demais; III inverte um spin.</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Na ordem de preenchimento, qual subnível vem logo depois do $3p$?</p>`, fig: pauling, alts: ["3d", "4s", "4p", "3f", "5s"], certa: "B", dicas: [R`<p>Siga as diagonais do diagrama.</p>`], resp: "B", sol: R`<p>Depois do $3p$ vem o $4s$, e só então o $3d$. Pela regra $n + \ell$: $4s$ tem $4 + 0 = 4$ e $3d$ tem $3 + 2 = 5$; o de menor soma é preenchido antes.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Qual conjunto de números quânticos $(n, \ell, m_\ell, m_s)$ é <b>impossível</b>?</p>`, fig: fig(tab(100, 34, [70, 180, 170], [["número", "valores permitidos", "o que diz"], ["n", "1, 2, 3, …", "camada (tamanho, energia)"], ["ℓ", "0 até n − 1", "subnível (forma)"], ["mℓ", "−ℓ até +ℓ", "orbital (orientação)"], ["mₛ", "+½ ou −½", "spin"]]), 150), alts: [R`$(2, 1, 0, +\frac12)$`, R`$(3, 2, -2, -\frac12)$`, R`$(1, 0, 0, +\frac12)$`, R`$(2, 2, 1, +\frac12)$`, R`$(4, 0, 0, -\frac12)$`], certa: "D", dicas: [R`<p>O maior valor de $\ell$ é $n - 1$.</p>`], resp: "D", sol: R`<p>Com $n = 2$, $\ell$ só pode ser 0 ou 1. $\ell = 2$ seria um subnível "2d", que não existe.</p>` }),
      F.exercicio({ n: 7, nivel: "Máximo", enun: R`<p>Quantos elétrons desemparelhados tem o átomo de ferro ($Z = 26$) no estado fundamental?</p>`, fig: diagrama(cfg(26), ["4s", "3d"]), num: { v: 4, un: "elétrons" }, dicas: [R`<p>[Ar] $4s^2\,3d^6$: distribua 6 elétrons em 5 orbitais com a regra de Hund.</p>`], resp: "4", sol: R`<p>Cinco entram sozinhos, o sexto emparelha com o primeiro: sobram 4 desemparelhados. É a origem do magnetismo do ferro.</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>A distribuição do cromo ($Z = 24$) no estado fundamental é:</p>`, fig: diagrama(cfg(24), ["4s", "3d"]), alts: [R`[Ar] $4s^2\,3d^4$`, R`[Ar] $4s^1\,3d^5$`, R`[Ar] $3d^6$`, R`[Ar] $4s^2\,4p^4$`, R`[Ar] $4s^0\,3d^6$`], certa: "B", dicas: [R`<p>É uma das duas exceções do quarto período.</p>`], resp: "B", sol: R`<p>Um elétron do $4s$ vai para o $3d$, que fica semipreenchido ($d^5$), com seis elétrons desemparelhados. O cobre faz o mesmo para completar o $3d$: [Ar] $4s^1\,3d^{10}$.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Qual a distribuição do íon $\ce{Fe^{3+}}$ ($Z = 26$)?</p>`, fig: diagrama(ion(26, 3), ["4s", "3d"]), alts: [R`[Ar] $4s^2\,3d^3$`, R`[Ar] $4s^1\,3d^4$`, R`[Ar] $3d^5$`, R`[Ar] $4s^2\,3d^6$`, R`[Ar] $3d^3\,4p^2$`], certa: "C", dicas: [R`<p>Os elétrons saem primeiro da camada mais externa: o $4s$.</p>`], resp: "C", sol: R`<p>Fe: [Ar] $4s^2\,3d^6$. Saem os dois do $4s$ e um do $3d$: [Ar] $3d^5$. <b>A</b> tira os três do $3d$, o erro clássico.</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Qual o número máximo de elétrons na camada $n = 3$?</p>`, fig: fig(caixas(40, 40, "3s", 0, 2) + caixas(140, 40, "3p", 0, 6) + caixas(300, 40, "3d", 0, 10) + D.txt(280, 100, "1 + 3 + 5 orbitais", "tx2"), 130), num: { v: 18, un: "elétrons" }, dicas: [R`<p>$2n^2$, ou conte: 9 orbitais, 2 elétrons em cada.</p>`], resp: "18", sol: R`<p>$2\cdot3^2 = 18$ ($2 + 6 + 10$).</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Um átomo neutro tem a distribuição $1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^{10}\,4p^5$. Qual o seu número atômico?</p>`, fig: diagrama(cfg(35)), num: { v: 35, un: "" }, dicas: [R`<p>Some os expoentes.</p>`], resp: "35", sol: R`<p>$2 + 2 + 6 + 2 + 6 + 2 + 10 + 5 = 35$: bromo. Sete elétrons na camada 4 ($4s^2\,4p^5$): é da família do cloro.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Qual das espécies é <b>diamagnética</b> (não tem elétron desemparelhado)?</p>`, fig: fig(tab(130, 30, [100, 200], [["espécie", "final da distribuição"], ["Fe²⁺", "3d⁶"], ["Cu²⁺", "3d⁹"], ["Zn²⁺", "3d¹⁰"], ["Mn²⁺", "3d⁵"], ["Ti²⁺", "3d²"]]), 160), alts: ["Fe²⁺", "Cu²⁺", "Zn²⁺", "Mn²⁺", "Ti²⁺"], certa: "C", dicas: [R`<p>Procure o subnível completo.</p>`], resp: "C", sol: R`<p>$\ce{Zn^{2+}}$: $3d^{10}$, tudo emparelhado. Os outros têm 4, 1, 5 e 2 desemparelhados. É por isso que os sais de zinco são brancos e os de cobre e ferro são coloridos (a cor também vem do $d$ incompleto).</p>` }),
    ];

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Atomística · onde os elétrons moram</div>
        <div class="q">O potássio tem 19 elétrons, e a terceira camada aguenta 18. Por que o décimo nono elétron vai morar na quarta camada, deixando a terceira pela metade?</div>
        <p>Porque as camadas não são prateleiras empilhadas em ordem. Cada camada tem compartimentos de energias diferentes, e o primeiro compartimento da quarta fica mais baixo que o último da terceira. Entender essa ordem é entender a tabela periódica inteira.</p></div>
        ${F.chute({ q: "o ferro (4s² 3d⁶) perde dois elétrons e vira Fe²⁺. De onde eles saem?", ops: ["Do 3d, que foi o último a ser preenchido.", "Um do 4s e um do 3d.", "Do 4s, que é a camada mais externa.", "Do 1s, que é o mais perto do núcleo."], certa: 2, exp: "Do 4s. Na hora de preencher, o 4s vem antes do 3d; na hora de perder, sai primeiro quem está mais longe do núcleo, e o 4s pertence à camada 4. O Fe²⁺ é [Ar] 3d⁶. É a pegadinha mais cobrada deste tema." })}`),

      F.secao("orbitais", "De órbitas a orbitais", R`
        <p>O modelo de Bohr acertou o hidrogênio e falhou no resto ${F.ret("B03")}. O conserto veio de duas ideias da década de 1920. A <b>dualidade</b> (de Broglie): o elétron também se comporta como onda. E o <b>princípio da incerteza</b> (Heisenberg): não dá para conhecer, ao mesmo tempo, a posição e a velocidade do elétron com precisão total. Logo, não existe "órbita": existe a <b>probabilidade</b> de achar o elétron em cada lugar.</p>
        <p><b>Orbital</b> é a região do espaço em torno do núcleo onde é máxima a probabilidade de encontrar o elétron. Cada orbital é descrito por três números, e cada elétron por quatro:</p>
        <table class="tb"><tr><th>Número quântico</th><th>Símbolo</th><th>Valores</th><th>O que determina</th></tr>
          <tr><td><b>principal</b></td><td>$n$</td><td>1, 2, 3, … (camadas K, L, M, N…)</td><td>tamanho e energia do orbital</td></tr>
          <tr><td><b>secundário</b> (azimutal)</td><td>$\ell$</td><td>0 até $n - 1$ (s, p, d, f)</td><td>forma do orbital; o subnível</td></tr>
          <tr><td><b>magnético</b></td><td>$m_\ell$</td><td>$-\ell$ até $+\ell$</td><td>orientação no espaço: qual orbital do subnível</td></tr>
          <tr><td><b>spin</b></td><td>$m_s$</td><td>$+\frac12$ ou $-\frac12$</td><td>o "sentido" do elétron</td></tr></table>
        ${F.fig(formas, "O orbital s é esférico; os três orbitais p têm forma de halteres, um em cada eixo. Os d e os f têm formas mais complicadas.")}
        <h3>Teorema 1: por que cabem 2n² elétrons numa camada</h3>
        ${F.demo("contando orbitais", R`<p>(i) Para um dado $\ell$, $m_\ell$ vai de $-\ell$ a $+\ell$: são $2\ell + 1$ valores, isto é, $2\ell + 1$ orbitais. s ($\ell = 0$): 1. p: 3. d: 5. f: 7.</p>
          <p>(ii) <b>Princípio da exclusão de Pauli</b>: num átomo, dois elétrons não podem ter os quatro números quânticos iguais. Num mesmo orbital ($n$, $\ell$ e $m_\ell$ iguais), só resta o spin para diferenciar: cabem <b>dois</b> elétrons, de spins opostos.</p>
          <p>(iii) Capacidade dos subníveis: $2(2\ell + 1)$: s 2, p 6, d 10, f 14.</p>
          <p>(iv) Na camada $n$, $\ell$ vai de 0 a $n - 1$. Número de orbitais: $1 + 3 + 5 + \dots + (2n - 1)$, a soma dos $n$ primeiros ímpares, que é $n^2$.</p>
          <p>(v) Dois elétrons por orbital: $2n^2$. Camada 1: 2. Camada 2: 8. Camada 3: 18. Camada 4: 32.</p>`)}
        ${F.formula(R`\text{orbitais no subnível} = 2\ell + 1\qquad \text{elétrons no subnível} = 2(2\ell + 1)\qquad \text{elétrons na camada} = 2n^2`, "Capacidades")}`),

      F.secao("ordem", "A ordem de preenchimento", R`
        <p>No estado fundamental, os elétrons ocupam os orbitais de menor energia disponíveis (princípio da construção, ou <i>Aufbau</i>). Em átomos com vários elétrons, a energia depende de $n$ <b>e</b> de $\ell$, e os subníveis de camadas diferentes se entrelaçam. A ordem é dada pelo <b>diagrama de Pauling</b>:</p>
        ${F.fig(pauling, "Diagrama de Pauling: escreva os subníveis em linhas e leia pelas diagonais.")}
        ${F.formula(R`1s\ 2s\ 2p\ 3s\ 3p\ 4s\ 3d\ 4p\ 5s\ 4d\ 5p\ 6s\ 4f\ 5d\ 6p\ 7s\ 5f\ 6d\ 7p`, "Ordem crescente de energia dos subníveis")}
        <h3>Teorema 2: a regra n + ℓ reproduz o diagrama</h3>
        ${F.demo("por que o 4s vem antes do 3d", R`<p>(i) Regra (de Madelung): é preenchido primeiro o subnível de menor soma $n + \ell$; no empate, o de menor $n$.</p>
          <p>(ii) $3p$: $3 + 1 = 4$. $4s$: $4 + 0 = 4$. Empate: ganha o de menor $n$, o $3p$. Depois vem o $4s$.</p>
          <p>(iii) $3d$: $3 + 2 = 5$. $4p$: $4 + 1 = 5$. $5s$: $5 + 0 = 5$. Empate triplo, em ordem de $n$: $3d$, $4p$, $5s$.</p>
          <p>(iv) Juntando: … $3p$ (4), $4s$ (4), $3d$ (5), $4p$ (5), $5s$ (5), $4d$ (6) … exatamente a leitura diagonal do diagrama.</p>
          <p>(v) A razão física: um elétron $s$ passa parte do tempo muito perto do núcleo, por dentro das camadas internas (ele "penetra"), e isso abaixa a sua energia. O $4s$, embora de camada mais alta, penetra mais que o $3d$.</p>`)}
        <p>Dentro de um subnível, vale a <b>regra de Hund</b>: os elétrons ocupam primeiro orbitais vazios, todos com o mesmo spin, e só emparelham quando não há mais orbital vazio. Elétrons se repelem; cada um num orbital, ficam mais longe uns dos outros.</p>
        <div id="lab-orb"></div>
        ${F.caixa("pegadinha", R`<p><b>Duas exceções para decorar: cromo e cobre.</b> Pelo diagrama, o cromo seria $4s^2\,3d^4$ e o cobre, $4s^2\,3d^9$. Na realidade são $4s^1\,3d^5$ e $4s^1\,3d^{10}$: subnível $d$ semipreenchido ou completo é especialmente estável, e compensa tirar um elétron do $4s$. Existem outras exceções mais abaixo na tabela (prata, ouro, molibdênio), pelo mesmo motivo.</p>`)}`),

      F.secao("distribuicao", "Escrevendo e lendo uma distribuição", R`
        <p>Ferro, $Z = 26$: $1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^6$. Três jeitos de olhar para ela:</p>
        <table class="tb"><tr><th>Leitura</th><th>Como</th><th>Ferro</th></tr>
          <tr><td><b>por subníveis</b>, em ordem de energia</td><td>a ordem em que você preencheu</td><td>$1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^6$</td></tr>
          <tr><td><b>por camadas</b></td><td>some os subníveis de mesmo $n$</td><td>K 2, L 8, M 14, N 2</td></tr>
          <tr><td><b>com cerne de gás nobre</b></td><td>troque o começo pelo gás nobre anterior</td><td>[Ar] $4s^2\,3d^6$</td></tr></table>
        ${F.fig(diagrama(cfg(26)), "Ferro: os seis elétrons do 3d ocupam cinco orbitais; quatro ficam desemparelhados.")}
        <p>A <b>camada de valência</b> é a de maior $n$ que tem elétrons (no ferro, a 4, com 2 elétrons). O <b>subnível mais energético</b> é o último preenchido (no ferro, o $3d$). Os dois <b>não coincidem</b> nos metais de transição, e é daí que saem as pegadinhas.</p>
        <h3>Teorema 3: de onde saem os elétrons de um cátion</h3>
        ${F.demo("ferro, Fe²⁺ e Fe³⁺", R`<p>(i) Preencher e arrancar são perguntas diferentes. Preenche-se pela energia do subnível no átomo que está sendo montado. Arranca-se o elétron menos preso do átomo já pronto: o da camada <b>mais externa</b>.</p>
          <p>(ii) Ferro neutro: [Ar] $4s^2\,3d^6$. A camada mais externa é a 4.</p>
          <p>(iii) $\ce{Fe^{2+}}$: saem os dois elétrons do $4s$. Fica [Ar] $3d^6$ (4 desemparelhados).</p>
          <p>(iv) $\ce{Fe^{3+}}$: sai mais um, agora do $3d$. Fica [Ar] $3d^5$ (5 desemparelhados: um em cada orbital).</p>
          <p>(v) Ânions são simples: os elétrons a mais entram na sequência normal. $\ce{Cl-}$: $1s^2\,2s^2\,2p^6\,3s^2\,3p^6$, igual ao argônio.</p>`)}
        ${F.formula(R`\text{cátion: os elétrons saem do subnível de maior } n\ (\text{no empate, do de maior } \ell)`, "Regra de ionização")}
        <p>Átomos e íons com elétrons desemparelhados são atraídos por ímãs: são <b>paramagnéticos</b>, e a atração cresce com o número de elétrons desemparelhados. Com todos emparelhados, são <b>diamagnéticos</b> (levemente repelidos).</p>
        ${F.caixa("fisico", R`<p><b>A última linha da distribuição é o cartão de visitas do elemento.</b> O final $3s^1$ diz: metal que perde um elétron com facilidade. $3s^2\,3p^5$: ametal que quer ganhar um. $3s^2\,3p^6$: gás nobre, satisfeito. Final em $d$ incompleto: metal de transição, com vários íons possíveis, colorido e magnético. Com a distribuição na mão você prevê a carga do íon, a família e o período ${F.ret("B06")}, antes de saber qualquer outra coisa sobre o elemento.</p>`, "Pense como químico")}
        ${F.caixa("pegadinha", R`<p>Este tema não tem prática de bancada. A consequência visível da distribuição eletrônica é o paramagnetismo: no laboratório da escola, com o professor, um ímã forte de neodímio atrai fracamente sais de manganês, ferro ou cobre (pendurados num fio) e não atrai sais de zinco. <b>Ímãs de neodímio</b> beliscam a pele com força e quebram em estilhaços: óculos de segurança, longe de crianças pequenas, de cartões e de marca-passos. Os sais vão para o frasco de resíduos de metais.</p>`, "Segurança e descarte")}
        ${F.caixa("olimpiada", R`<p><b>Como isso é cobrado.</b> Em ordem de dificuldade: (1) fazer a distribuição e contar elétrons de valência ou desemparelhados; (2) distribuição de íons de metais de transição, com a armadilha do $4s$; (3) as exceções do cromo e do cobre; (4) conjuntos de números quânticos possíveis e impossíveis; (5) os quatro números quânticos do elétron diferencial, em que é preciso <b>ler a convenção</b> do enunciado para $m_\ell$ e $m_s$, porque ela muda de prova para prova. O ITA gosta de perguntar quantos elétrons de um átomo têm um certo valor de $\ell$ ou de $m_\ell$, como no chefão.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, os orbitais deixam de ser desenhos e viram funções: as soluções da equação de Schrödinger para o átomo de hidrogênio ${F.ret("fisica/U06")}, em que os três números quânticos $n$, $\ell$ e $m_\ell$ aparecem sozinhos, como condições para a solução existir. O spin sai da equação relativística de Dirac. E a ordem de Pauling é uma regra empírica: para átomos com muitos elétrons, a energia dos orbitais é calculada numericamente, e as "exceções" são o resultado normal da conta.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-orb"); e.outerHTML = F.lab("Preencha os orbitais: Pauling, Pauli e Hund", "lab-orb"); SIM.orbitais(document.getElementById("lab-orb"), F); },
});
