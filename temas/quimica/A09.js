/* Química A09 · Algarismos significativos e erros de medida. Conferido em Python:
   12,11 + 18,0 + 1,013 = 31,123 → 31,1; 4,56 × 1,4 = 6,384 → 6,4; 25,31/9,5 = 2,664 → 2,7; (15,2 − 14,9)/3,1 = 0,0968 → 0,1 (a subtração deixa 1 significativo);
   0,0821 × 298/1,00 = 24,47 → 24,5; 6,022e23 × 0,250 = 1,5055e23 → 1,51e23;
   erro percentual: (2,64 − 2,70)/2,70 = −2,2%; média de 2,71; 2,69; 2,72; 2,70 = 2,705 → 2,71 (ou 2,70 pela regra do par; adotado: 2,71, arredondando o 5 para cima);
   chefão: aluno A: 2,52; 2,53; 2,52 → média 2,523; erro −6,5%; amplitude 0,01; aluno B: 2,60; 2,85; 2,66 → média 2,703; erro +0,1%; amplitude 0,25;
   27,0 g em 10,7 mL = 2,523 g/cm³ (leitura 0,7 mL a mais em 10,0 mL). */
F.registrar("quimica/A09", {
  retoma: ["A08", "A02"],
  html(F) {
    const R = String.raw;
    const fig = (conteudo, h = 170) => D.svg(560, h, conteudo, "figura");
    /* régua com um objeto: cm de comprimento, menor divisão div; objeto termina em "fim" */
    const regua = (fim, div, cm = 6) => fig(`<rect x="60" y="40" width="${fim * 70}" height="26" style="fill:color-mix(in srgb,var(--mA) 40%,transparent);stroke:var(--mA)"/>` + D.regua(60, 80, cm, 70, div), 140);
    /* alvo com tiros: exatidão × precisão */
    const alvo = (x, tiros, rot) => D.alvo(x, 70, 46, tiros, "var(--warn)") + D.txt(x, 140, rot, "tx2");
    const quatroAlvos = fig(alvo(75, [[0.05, 0.04], [-0.06, 0.05], [0.03, -0.07], [-0.04, -0.03]], "exato e preciso") + alvo(210, [[0.55, 0.5], [0.62, 0.42], [0.5, 0.58], [0.6, 0.55]], "preciso, não exato") + alvo(345, [[0.5, -0.4], [-0.55, 0.3], [0.1, 0.6], [-0.2, -0.55]], "exato, não preciso") + alvo(480, [[0.7, 0.1], [0.2, 0.75], [0.8, 0.6], [0.35, 0.3]], "nem um nem outro"), 155);
    /* reta numérica com medidas */
    const reta = (a, b, vals, real, rot = "") => { const X = (v) => 60 + ((v - a) / (b - a)) * 440; let s = `<line x1="60" x2="500" y1="90" y2="90" style="stroke:var(--ink2);stroke-width:2"/>`; for (let i = 0; i <= 10; i++) { const v = a + ((b - a) * i) / 10; s += `<line x1="${X(v)}" x2="${X(v)}" y1="84" y2="96" style="stroke:var(--ink3)"/>` + (i % 2 ? "" : D.txt(X(v), 114, v.toFixed(2).replace(".", ","), "tx2")); } return s + `<line x1="${X(real)}" x2="${X(real)}" y1="40" y2="96" style="stroke:var(--ok);stroke-width:2.5"/>` + D.txt(X(real), 32, "valor aceito", "tx2") + vals.map((v, i) => `<circle cx="${X(v)}" cy="${76 - (i % 2) * 13}" r="6" style="fill:var(--warn);stroke:var(--bg)"/>`).join("") + (rot ? D.txt(280, 140, rot, "tx2") : ""); };
    const visor = (txt, rot) => `<rect x="190" y="50" width="180" height="50" rx="8" style="fill:var(--card2);stroke:var(--ink3);stroke-width:1.5"/><rect x="204" y="60" width="152" height="30" rx="4" style="fill:var(--bg);stroke:var(--line)"/>` + D.txt(280, 82, txt, "tx", "middle", 'style="font-weight:700;font-size:18px"') + D.txt(280, 124, rot, "tx2");
    const tab = (x, y, larg, linhas) => linhas.map((l, i) => l.map((c, j) => D.txt(x + larg.slice(0, j).reduce((a, b) => a + b, 0) + larg[j] / 2, y + i * 22, c, "tx2", "middle", i ? "" : 'style="font-weight:700;fill:var(--ink)"')).join("")).join("") + `<line x1="${x}" x2="${x + larg.reduce((a, b) => a + b, 0)}" y1="${y + 7}" y2="${y + 7}" style="stroke:var(--ink3)"/>`;
    const casas = (v) => (String(v).split(".")[1] || "").length;

    const exemplos = F.exemplo({
      titulo: "Contar, operar e julgar",
      casos: [
        { nome: "Fácil: quantos significativos?", gerar: (p) => {
          const L = p ? [["0,00450", 3, "os zeros à esquerda só marcam a posição da vírgula; o zero do fim foi medido e conta"], ["120,0", 4, "zero entre significativos e zero final depois da vírgula contam"], ["6,02 × 10²³", 3, "na notação científica contam os algarismos do número da frente"]] : F.escolha([[["0,0208", 3, "zeros à esquerda não contam; o zero entre o 2 e o 8 conta"], ["3,500", 4, "os zeros finais depois da vírgula foram medidos"], ["1,0 × 10⁻³", 2, "contam os algarismos do número da frente"]], [["100,50", 5, "zeros entre significativos e zero final depois da vírgula contam"], ["0,7", 1, "o zero antes da vírgula só marca posição"], ["9,10 × 10⁴", 3, "contam os algarismos do número da frente, inclusive o zero final"]]]);
          return { enun: R`<p>Quantos algarismos significativos há em cada medida: ${L.map((l) => l[0]).join("; ")}?</p>`, fig: fig(tab(130, 40, [150, 150], [["medida", "significativos"], ...L.map((l) => [l[0], "?"])]), 130),
            passos: [R`<p>(i) Regra: contam todos os algarismos a partir do primeiro que não é zero, da esquerda para a direita, inclusive os zeros que vierem depois dele.</p>`,
              ...L.map((l, i) => R`<p>(${["ii", "iii", "iv"][i]}) <b>${l[0]}</b>: ${l[1]} significativo${l[1] > 1 ? "s" : ""}, porque ${l[2]}.</p>`),
              R`<p>(v) Teste rápido: escreva em notação científica. Os zeros que somem ao trocar a potência de dez não eram significativos; os que ficam, eram.</p>`] };
        } },
        { nome: "Médio: a densidade com o número certo de algarismos", gerar: (p) => {
          const [m, V] = p ? [25.31, 9.5] : F.escolha([[25.31, 9.5], [13.52, 5.0], [48.6, 18.25], [7.895, 2.9]]), d = m / V, sm = String(m).replace(".", "").length, sv = V === 5.0 ? 2 : String(V).replace(".", "").length, s = Math.min(sm, sv), res = +d.toPrecision(s);
          return { enun: R`<p>Uma amostra tem massa ${F.nt(m)} g e volume ${V === 5 ? "5,0" : F.nt(V)} mL. A calculadora dá $d = ${F.n(d, 6)}\ldots$ g/mL. Como o resultado deve ser escrito?</p>`, fig: fig(visor(F.t(d, 7), "o que a calculadora mostra"), 140),
            passos: [R`<p>(i) Conte os significativos de cada dado: ${F.nt(m)} tem ${sm}; ${V === 5 ? "5,0" : F.nt(V)} tem ${sv}.</p>`,
              R`<p>(ii) Regra da multiplicação e da divisão: o resultado fica com o número de significativos do dado que tem <b>menos</b>. Aqui: ${s}.</p>`,
              R`<p>(iii) Arredonde: $${F.n(d, 5)} \to ${res.toPrecision(s).replace(".", "{,}")}$ g/mL.</p>`,
              R`<p>(iv) Os outros algarismos do visor não são mais precisão, são ruído: a medida mais pobre (${sm < sv ? "a massa" : "o volume"}) decide até onde o resultado merece confiança. Para melhorar a densidade, é esse instrumento que tem de melhorar.</p>`] };
        } },
        { nome: "Olimpíada: soma e produto na mesma conta", gerar: (p) => {
          const [a, b, c] = p ? [15.2, 14.9, 3.1] : F.escolha([[15.2, 14.9, 3.1], [25.45, 25.12, 2.00], [102.6, 98.4, 5.25]]), dif = +(a - b).toFixed(Math.min(casas(a), casas(b))), sd = String(Math.abs(dif)).replace(".", "").replace(/^0+/, "").length, sc = c === 2 ? 3 : String(c).replace(".", "").length, s = Math.min(sd, sc), r = dif / c;
          return { enun: R`<p>Calcule, com o número correto de significativos: $\dfrac{${F.n(a)} - ${F.n(b)}}{${c === 2 ? "2{,}00" : F.n(c)}}$.</p>`, fig: fig(visor(F.t(r, 7), "o que a calculadora mostra"), 140),
            passos: [R`<p>(i) Operações diferentes, regras diferentes: resolva em etapas, anotando a precisão de cada resultado parcial.</p>`,
              R`<p>(ii) Subtração: vale a regra das <b>casas decimais</b>. $${F.n(a)} - ${F.n(b)} = ${F.m(dif, Math.min(casas(a), casas(b)))}$, com ${Math.min(casas(a), casas(b))} casa${Math.min(casas(a), casas(b)) > 1 ? "s" : ""} decimal${Math.min(casas(a), casas(b)) > 1 ? "is" : ""}. Repare: esse resultado tem só ${sd} significativo${sd > 1 ? "s" : ""}, embora os dados tivessem ${String(a).replace(".", "").length}.</p>`,
              R`<p>(iii) Divisão: vale a regra dos <b>significativos</b>. O numerador tem ${sd}, o denominador tem ${sc}: o resultado fica com ${s}.</p>`,
              R`<p>(iv) $\frac{${F.m(dif, Math.min(casas(a), casas(b)))}}{${c === 2 ? "2{,}00" : F.n(c)}} = ${F.n(r, 5)} \to ${(+r.toPrecision(s)).toPrecision(s).replace(".", "{,}")}$. Subtrair dois números quase iguais destrói precisão: é o motivo de as titulações ${F.ret("E07")} e as pesagens por diferença ${F.ret("A08")} exigirem instrumentos tão bons.</p>`] };
        } },
      ],
    });

    const chefao = F.chefao({
      titulo: "Dois alunos, um bloco de alumínio",
      enun: R`<p>Dois alunos medem a densidade do alumínio (valor aceito: 2,70 g/cm³), cada um com três blocos, pesando numa balança e medindo o volume pelo deslocamento de água numa proveta. Resultados, em g/cm³: <b>Ana</b>: 2,52; 2,53; 2,52. <b>Beto</b>: 2,60; 2,85; 2,66.</p>
        <p>(a) Calcule a média de cada um, com o número correto de significativos. (b) Calcule o erro percentual de cada média. (c) Quem foi mais preciso? Quem foi mais exato? (d) Que tipo de erro domina em cada caso, e o que você recomendaria a cada um? (e) Descobriu-se que Ana lia a proveta sempre com o olho acima do menisco. Um dos blocos dela tinha 27,0 g e volume real de 10,0 mL. Que volume ela leu? Mostre que isso explica os resultados dela. (f) O professor diz: "prefiro os dados da Ana". Defenda essa frase, que parece absurda, em duas linhas. (g) Beto quer escrever o resultado como 2,7033 g/cm³. Por que não pode, e como deve escrever?</p>`,
      fig: fig(reta(2.4, 2.9, [2.52, 2.53, 2.52], 2.7).replace(/var\(--warn\)/g, "var(--mA)") + [2.6, 2.85, 2.66].map((v, i) => `<circle cx="${60 + ((v - 2.4) / 0.5) * 440}" cy="${76 - (i % 2) * 13}" r="6" style="fill:var(--warn);stroke:var(--bg)"/>`).join("") + D.txt(280, 140, "azul: Ana · amarelo: Beto (g/cm³)", "tx2"), 155),
      dicas: [R`<p>(a) Some e divida por 3; o resultado não pode ter mais casas do que os dados. (b) Erro percentual = (medido − aceito) ÷ aceito.</p>`,
        R`<p>(c) Precisão é o quanto as medidas concordam entre si; exatidão é o quanto a média chega perto do valor aceito.</p>`,
        R`<p>(e) Se a densidade dela saiu 2,52 com 27,0 g, o volume que ela usou foi $\frac{27{,}0}{2{,}52}$.</p>`],
      sol: R`<p><b>(a)</b> Ana: $\frac{2{,}52 + 2{,}53 + 2{,}52}{3} = 2{,}523 \to $ <b>2,52 g/cm³</b>. Beto: $\frac{2{,}60 + 2{,}85 + 2{,}66}{3} = 2{,}703 \to $ <b>2,70 g/cm³</b>.</p>
        <p><b>(b)</b> Ana: $\frac{2{,}52 - 2{,}70}{2{,}70} = -6{,}7\%$ (com a média não arredondada, $-6{,}5\%$). Beto: $\frac{2{,}70 - 2{,}70}{2{,}70} = 0\%$ (com 2,703: $+0{,}1\%$).</p>
        <p><b>(c)</b> Mais <b>precisa</b>: Ana (amplitude de 0,01 g/cm³, contra 0,25 do Beto). Mais <b>exato</b>, na média: Beto.</p>
        <p><b>(d)</b> Ana: erro <b>sistemático</b> (todas as medidas deslocadas para o mesmo lado, quase o mesmo tanto). Repetir não adianta: ela precisa achar a causa. Beto: erro <b>aleatório</b> grande (medidas espalhadas para os dois lados). A média dele acertou em parte por sorte: precisa de mais repetições e de mais cuidado em cada medida.</p>
        <p><b>(e)</b> $V_\text{lido} = \frac{27{,}0}{2{,}52} = 10{,}7$ mL: ela leu 0,7 mL a mais, que é o efeito da paralaxe com o olho alto ${F.ret("A08")}. Corrigindo: $\frac{27{,}0}{10{,}0} = 2{,}70$ g/cm³. O erro inteiro dela sai de uma única causa.</p>
        <p><b>(f)</b> Erro sistemático, uma vez identificado, <b>corrige-se</b>: descontando os 0,7 mL, os três resultados da Ana viram 2,70, com espalhamento mínimo. O espalhamento do Beto não se corrige com conta nenhuma. Precisão é a qualidade difícil de conseguir; exatidão se conserta calibrando.</p>
        <p><b>(g)</b> Porque os dados dele têm três significativos, e o espalhamento (0,25) mostra que nem o segundo algarismo é seguro. Escrever 2,7033 é fingir uma precisão que não existe. O honesto é <b>2,7 g/cm³</b> (ou $2{,}70 \pm 0{,}13$, metade da amplitude). Contas conferidas em Python.</p>`,
    });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", enun: R`<p>Quantos algarismos significativos tem a medida 0,00450 g?</p>`, fig: fig(visor("0,00450 g", "leitura da balança"), 140), num: { v: 3, un: "algarismos" }, dicas: [R`<p>Zeros à esquerda só posicionam a vírgula. E o zero do fim?</p>`], resp: "3", sol: R`<p>Três: 4, 5 e o zero final (que foi medido). Em notação científica: $4{,}50\times10^{-3}$ g.</p>` }),
      F.exercicio({ n: 2, nivel: "Físico", enun: R`<p>O comprimento da barra, lido na régua da figura (menor divisão: 1 mm), deve ser anotado como:</p>`, fig: regua(4.37, 0.1), alts: ["4 cm", "4,4 cm", "4,37 cm", "4,370 cm", "4,3 cm"], certa: "C", dicas: [R`<p>Os algarismos que a escala dá, mais um estimado.</p>`], resp: "C", sol: R`<p>A régua garante 4,3; o último algarismo (7) é estimado entre dois traços. 4,370 fingiria uma precisão de milésimo de centímetro que a régua não tem.</p>` }),
      F.exercicio({ n: 3, nivel: "Físico", enun: R`<p>Some com o número correto de algarismos: 12,11 g + 18,0 g + 1,013 g.</p>`, fig: fig(tab(190, 34, [180], [["parcelas (g)"], ["12,11"], ["18,0"], ["1,013"]]), 130), num: { v: 31.1, tol: 0.001, un: "g" }, dicas: [R`<p>Na soma, manda a parcela com <b>menos casas decimais</b>.</p>`], resp: "31,1 g", sol: R`<p>A calculadora dá 31,123. A parcela 18,0 só é conhecida até o décimo: o resultado é 31,1 g.</p>` }),
      F.exercicio({ n: 4, nivel: "Físico", enun: R`<p>Multiplique com o número correto de algarismos: 4,56 cm × 1,4 cm.</p>`, fig: fig(`<rect x="170" y="40" width="220" height="80" style="fill:color-mix(in srgb,var(--mod) 20%,transparent);stroke:var(--mod);stroke-width:2"/>` + D.txt(280, 34, "4,56 cm", "tx2") + D.txt(400, 84, "1,4 cm", "tx2", "start"), 140), num: { v: 6.4, tol: 0.005, un: "cm²" }, dicas: [R`<p>No produto, manda o fator com <b>menos significativos</b>.</p>`], resp: "6,4 cm²", sol: R`<p>$4{,}56\times1{,}4 = 6{,}384$. O fator 1,4 tem dois significativos: 6,4 cm².</p>` }),
      F.exercicio({ n: 5, nivel: "Físico", enun: R`<p>Os alvos mostram quatro séries de tiros. Qual delas corresponde a medidas <b>precisas, mas não exatas</b>?</p>`, fig: quatroAlvos.replace("exato e preciso", "I").replace("preciso, não exato", "II").replace("exato na média, impreciso", "III").replace("nem um nem outro", "IV"), alts: ["I", "II", "III", "IV", "Nenhuma."], certa: "B", dicas: [R`<p>Precisas: tiros juntos. Não exatas: longe do centro.</p>`], resp: "B", sol: R`<p>II: tiros agrupados (precisão) e longe do centro (sem exatidão). É o retrato de um erro sistemático: mira torta.</p>` }),
      F.exercicio({ n: 6, nivel: "Físico", enun: R`<p>Um aluno mede a densidade do alumínio e encontra 2,64 g/cm³; o valor aceito é 2,70 g/cm³. Qual o erro percentual (com sinal)?</p>`, fig: fig(reta(2.5, 2.8, [2.64], 2.7), 130), num: { v: -2.22, tol: 0.03, un: "%" }, dicas: [R`<p>(medido − aceito) ÷ aceito.</p>`], resp: "≈ −2,2%", sol: R`<p>$\frac{2{,}64 - 2{,}70}{2{,}70} = -0{,}022 = -2{,}2\%$. O sinal diz o lado: ele mediu a menos.</p>` }),
      F.exercicio({ n: 7, nivel: "Máximo", enun: R`<p>Escreva 0,000 030 80 em notação científica, mantendo os significativos. Quantos são?</p>`, fig: fig(visor("0,00003080", ""), 120), alts: ["3,08 × 10⁻⁵, com 3.", "3,080 × 10⁻⁵, com 4.", "30,80 × 10⁻⁶, com 2.", "3,08 × 10⁵, com 3.", "3,0800 × 10⁻⁵, com 5."], certa: "B", dicas: [R`<p>O zero final foi escrito de propósito: ele conta.</p>`], resp: "B", sol: R`<p>Significativos: 3, 0, 8, 0. A vírgula anda 5 casas para a direita: $3{,}080\times10^{-5}$.</p>` }),
      F.exercicio({ n: 8, nivel: "Máximo", enun: R`<p>Calcule com o número correto de significativos: $\dfrac{0{,}0821\times298}{1{,}00}$.</p>`, fig: fig(visor("24,4658", "o que a calculadora mostra"), 140), num: { v: 24.5, tol: 0.001 }, dicas: [R`<p>Todos os fatores têm três significativos.</p>`], resp: "24,5", sol: R`<p>Três significativos em todos: $24{,}4658 \to 24{,}5$.</p>` }),
      F.exercicio({ n: 9, nivel: "Máximo", enun: R`<p>Uma bureta marcava 14,90 mL antes e 15,20 mL depois de escoar. Com quantos significativos fica o volume escoado?</p>`, fig: fig(tab(170, 40, [110, 110], [["leitura", "mL"], ["final", "15,20"], ["inicial", "14,90"]]), 120), alts: ["4, como as leituras.", "3", "2: 0,30 mL.", "1: 0,3 mL.", "Nenhum."], certa: "C", dicas: [R`<p>Subtração: conte casas decimais, não significativos.</p>`], resp: "C", sol: R`<p>$15{,}20 - 14{,}90 = 0{,}30$ mL: duas casas decimais, e só <b>dois</b> significativos. Dois números de quatro significativos deram um de dois: por isso, numa titulação, escoa-se um volume grande (20 mL ou mais).</p>` }),
      F.exercicio({ n: 10, nivel: "Máximo", enun: R`<p>Quatro medidas de uma densidade deram 2,71; 2,69; 2,72 e 2,70 g/cm³. Qual a amplitude (maior menos menor) das medidas?</p>`, fig: fig(reta(2.6, 2.8, [2.71, 2.69, 2.72, 2.7], 2.7), 130), num: { v: 0.03, tol: 0.01, un: "g/cm³" }, dicas: [R`<p>Maior valor menos menor valor.</p>`], resp: "0,03 g/cm³", sol: R`<p>$2{,}72 - 2{,}69 = 0{,}03$ g/cm³. Média 2,705: medidas precisas e exatas.</p>` }),
      F.exercicio({ n: 11, nivel: "Máximo", enun: R`<p>Uma balança marca sempre 0,05 g a mais do que a massa real. Esse erro é:</p>`, fig: fig(visor("0,05 g", "prato vazio"), 140), alts: ["aleatório, e some tirando a média de muitas pesagens.", "sistemático, e some tirando a média de muitas pesagens.", "sistemático: a média não o elimina; corrige-se zerando a balança ou descontando 0,05 g.", "aleatório: não tem correção.", "grosseiro, e a balança deve ser jogada fora."], certa: "C", dicas: [R`<p>O erro vai sempre para o mesmo lado?</p>`], resp: "C", sol: R`<p>Sempre para mais, sempre o mesmo valor: sistemático. A média de mil pesagens continua com 0,05 g a mais. A boa notícia é que ele se corrige (tara) e se cancela numa pesagem por diferença.</p>` }),
      F.exercicio({ n: 12, nivel: "Máximo", enun: R`<p>Calcule $\dfrac{15{,}2 - 14{,}9}{3{,}1}$ com o número correto de significativos.</p>`, fig: fig(visor("0,0967742", "o que a calculadora mostra"), 140), num: { v: 0.1, tol: 0.06 }, dicas: [R`<p>Primeiro a subtração (regra das casas decimais): quantos significativos sobram?</p>`, R`<p>Depois a divisão (regra dos significativos).</p>`], resp: "0,1", sol: R`<p>$15{,}2 - 14{,}9 = 0{,}3$: um significativo. Dividido por 3,1 (dois): o resultado tem um, $0{,}0968 \to 0{,}1$. Os dados tinham três significativos e o resultado ficou com um.</p>` }),
    ];

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Introdução à química · o que um número medido quer dizer</div>
        <div class="q">A calculadora mostra 2,664210526 g/mL para uma densidade medida com uma proveta que só garante o décimo de mililitro. Quantos desses dez algarismos são verdade?</div>
        <p>Dois. O resto é a calculadora fazendo conta com algarismos que ninguém mediu. Escrever só o que se sabe é a forma de honestidade própria das ciências exatas, e tem regras simples.</p></div>
        ${F.chute({ q: "as medidas 2,5 g e 2,50 g, para um químico, são…", ops: ["a mesma coisa: o zero não muda o valor.", "diferentes: a segunda foi medida com uma balança dez vezes mais fina.", "diferentes: a segunda é dez vezes maior.", "iguais, mas a segunda está escrita errado."], certa: 1, exp: "Diferentes na informação. 2,5 g diz que a massa está entre 2,4 e 2,6; 2,50 g diz que está entre 2,49 e 2,51. O zero final é uma afirmação: 'eu medi o centésimo, e deu zero'. Em matemática 2,5 = 2,50; no laboratório, não." })}`),

      F.secao("significativos", "Algarismos significativos", R`
        <p>Numa medida, os <b>algarismos significativos</b> são todos os que o instrumento garante mais <b>um, o último, que é estimado</b> (duvidoso). A régua de milímetros dá 4,3 cm com certeza; o olho estima o 7 de 4,37 cm.</p>
        ${F.fig(regua(4.37, 0.1), "A barra termina entre 4,3 e 4,4 cm. Lê-se 4,37 cm: dois algarismos certos e um estimado.")}
        <table class="tb"><tr><th>Regra para contar</th><th>Exemplo</th><th>Significativos</th></tr>
          <tr><td>todo algarismo diferente de zero conta</td><td>2,54</td><td>3</td></tr>
          <tr><td>zero <b>entre</b> significativos conta</td><td>1,008</td><td>4</td></tr>
          <tr><td>zero <b>à esquerda</b> não conta (só posiciona a vírgula)</td><td>0,0045</td><td>2</td></tr>
          <tr><td>zero <b>à direita, depois da vírgula</b>, conta</td><td>2,50</td><td>3</td></tr>
          <tr><td>zero final de número sem vírgula é ambíguo: use notação científica</td><td>1500 → 1,5 × 10³ ou 1,500 × 10³</td><td>2 ou 4</td></tr>
          <tr><td>números contados ou definidos são exatos</td><td>3 medidas; 1 L = 1000 mL</td><td>infinitos</td></tr></table>
        ${F.formula(R`a\times10^{n},\qquad 1\le a \lt 10\qquad(\text{os significativos são os algarismos de } a)`, "Notação científica")}
        <p><b>Arredondamento.</b> Corta-se no algarismo desejado; se o primeiro algarismo cortado for 5 ou mais, soma-se 1 ao último que ficou; se for menor que 5, não se mexe. 2,664 → 2,7 (dois significativos); 31,123 → 31,1. Arredonde <b>só no fim</b>: nas contas intermediárias, carregue um ou dois algarismos a mais.</p>
        ${F.caixa("pegadinha", R`<p><b>Mudar de unidade não muda os significativos.</b> 2,5 kg são 2,5 × 10³ g, e não "2500 g" (que parece ter quatro). É para isso que serve a notação científica. E cuidado com o contrário: 0,0045 kg não ganha significativos por ter mais algarismos escritos; continua com dois.</p>`)}`),

      F.secao("operacoes", "Contas com medidas", R`
        <p>Uma conta não pode fabricar precisão. Há duas regras, e a pegadinha é que elas são diferentes.</p>
        <table class="tb"><tr><th>Operação</th><th>O resultado fica com…</th><th>Exemplo</th></tr>
          <tr><td><b>soma e subtração</b></td><td>o menor número de <b>casas decimais</b> das parcelas</td><td>12,11 + 18,0 + 1,013 = 31,123 → <b>31,1</b></td></tr>
          <tr><td><b>multiplicação e divisão</b></td><td>o menor número de <b>significativos</b> dos fatores</td><td>4,56 × 1,4 = 6,384 → <b>6,4</b></td></tr></table>
        <h3>Teorema 1: por que a soma olha as casas decimais</h3>
        ${F.demo("o algarismo duvidoso contamina a coluna", R`<p>(i) Em cada medida, o último algarismo é duvidoso. Em 18,0 o duvidoso é o décimo; em 12,11, o centésimo; em 1,013, o milésimo.</p>
          <p>(ii) Arme a soma em colunas. Na coluna dos centésimos, 18,0 não tem algarismo: ali ele é desconhecido (pode ser qualquer coisa de 0 a 9). Somar um algarismo desconhecido dá um resultado desconhecido.</p>
          <p>(iii) Logo, no resultado, tudo o que está à direita da coluna dos décimos não tem significado. O resultado é 31,1: a parcela menos fina manda.</p>
          <p>(iv) Consequência importante: <b>subtrair números próximos destrói significativos</b>. $15{,}20 - 14{,}90 = 0{,}30$: entraram dois números de quatro significativos, saiu um de dois.</p>`)}
        <h3>Teorema 2: por que o produto olha os significativos</h3>
        ${F.demo("o erro relativo é o que se propaga", R`<p>(i) 1,4 cm quer dizer "entre 1,35 e 1,45": uma dúvida de 0,05 em 1,4, ou cerca de 4%. Já 4,56 cm tem dúvida de 0,005 em 4,56, cerca de 0,1%.</p>
          <p>(ii) Num produto, os erros relativos se somam ${F.ret("fisica/FE04")}: o resultado tem dúvida de uns 4%, mandada pelo fator pior.</p>
          <p>(iii) $4{,}56\times1{,}4 = 6{,}384$, e 4% disso é 0,26: a dúvida já aparece no primeiro decimal. O resultado honesto é 6,4, com dois significativos, os mesmos do fator mais pobre.</p>
          <p>(iv) Número de significativos é um jeito rápido de dizer "erro relativo": dois significativos são alguns por cento; três, alguns décimos por cento; quatro, centésimos por cento.</p>`)}
        ${F.formula(R`\text{soma, subtração}: \text{menos casas decimais}\qquad\qquad \text{produto, quociente}: \text{menos significativos}`, "Regras de operação com algarismos significativos")}
        ${F.caixa("fisico", R`<p><b>Antes de calcular, ache o elo fraco.</b> Numa densidade com massa de quatro significativos e volume de dois, o resultado tem dois, e gastar tempo numa balança melhor não ajuda nada: o que tem de melhorar é a medida de volume. Olhar os significativos dos dados antes de fazer a conta diz onde está o gargalo do experimento, e é assim que se decide qual instrumento vale a pena trocar.</p>`, "Pense como químico")}`),

      F.secao("erros", "Erro, exatidão e precisão", R`
        <p>Toda medida tem erro. A pergunta não é "tem erro?", é "de que tipo, e de que tamanho?".</p>
        ${F.formula(R`E = x_\text{medido} - x_\text{aceito}\qquad\qquad E_\% = \frac{x_\text{medido} - x_\text{aceito}}{x_\text{aceito}}\times100\%`, "Erro absoluto e erro percentual")}
        ${F.fig(quatroAlvos, "O centro do alvo é o valor aceito; cada tiro é uma medida.")}
        <table class="tb"><tr><th></th><th>Exatidão</th><th>Precisão</th></tr>
          <tr><td><b>o que é</b></td><td>proximidade entre a média e o valor aceito</td><td>concordância das medidas entre si</td></tr>
          <tr><td><b>quem estraga</b></td><td>erro <b>sistemático</b>: sempre para o mesmo lado</td><td>erro <b>aleatório</b>: ora para um lado, ora para o outro</td></tr>
          <tr><td><b>exemplos</b></td><td>balança sem tara, paralaxe, vidraria descalibrada, reagente impuro</td><td>estimativa do último algarismo, correntes de ar na balança, reflexo no cronômetro</td></tr>
          <tr><td><b>como tratar</b></td><td>achar a causa e corrigir; calibrar; fazer um ensaio em branco</td><td>repetir e tirar a média ${F.ret("fisica/FE03")}</td></tr></table>
        <p>Há ainda o <b>erro grosseiro</b>: engano de quem mede (anotar 25,3 em vez de 23,5, derramar amostra). Não se trata com estatística: refaz-se a medida.</p>
        <div id="lab-exat"></div>
        ${F.caixa("pegadinha", R`<p><b>Precisão não é exatidão.</b> Três resultados idênticos e errados são precisos e inexatos: é o caso mais traiçoeiro, porque a concordância dá confiança. E "balança de precisão" quer dizer balança de leitura fina (muitas casas), o que não garante que ela esteja calibrada. Em prova, as duas palavras nunca são sinônimas.</p>`)}
        ${F.caixa("pegadinha", R`<p>Este tema não tem prática com reagentes. Se você treinar medidas em casa (régua, balança de cozinha, copo medidor, cronômetro), não há risco nem descarte. Vale lembrar o que A08 ensinou: no laboratório, uma medida mal lida não é só nota baixa; uma massa de reagente errada por um fator de dez pode ser um acidente. Conferir a ordem de grandeza antes de pesar é regra de segurança.</p>`, "Segurança e descarte")}
        ${F.caixa("olimpiada", R`<p><b>Como isso é cobrado.</b> Diretamente: contar significativos, operar com eles e classificar um conjunto de medidas em exato/preciso. Indiretamente, e isso pesa mais: em toda questão numérica de olimpíada a resposta deve ter um número de significativos coerente com os dados (três, na maior parte das vezes), e nas provas práticas o resultado é avaliado pela exatidão <b>e</b> pela concordância entre as repetições. Respostas como "2,664210526 g/mL" perdem ponto mesmo com a conta certa.</p>`)}
        ${F.caixa("ponte", R`<p><b>Na universidade</b>, os algarismos significativos são substituídos por algo melhor: a <b>incerteza</b> escrita ao lado do valor, $2{,}70 \pm 0{,}02$ g/cm³, propagada pelas contas com derivadas parciais ${F.ret("fisica/FE04")}, e o espalhamento medido pelo desvio padrão ${F.ret("fisica/FE03")}. As regras deste tema são a versão de bolso: dão a ordem de grandeza da incerteza sem fazer a conta dela.</p>`)}`),

      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join("");
  },
  montar(F) { const e = document.getElementById("lab-exat"); e.outerHTML = F.lab("Exato ou preciso? Cinco medidas de uma densidade", "lab-exat"); SIM.exatidao(document.getElementById("lab-exat"), F); },
});
