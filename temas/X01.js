/* X01 · A função gam fresco do Lucas (bônus). O símbolo é o "gam fresco" (macro \gf no KaTeX, F.gf no HTML, F.gfSvg no SVG).
   Regra: xγ = x elevado a (1 + 2 + … + x) = x^{x(x+1)/2}. Contagem de operações comutativas conferida por força bruta (n = 1, 2, 3).
   Números conferidos em Python: mínimo em x ≈ 0,4685, valor ≈ 0,7704; 0,5γ = 0,5^0,375 ≈ 0,7711. */
F.registrar("X01", {
  html(F) {
    const R = String.raw;
    const G = R`x\gf`;
    const lab = (id, titulo) => `<div class="lab" id="${id}"><div class="lab-cab"><span class="tag">Laboratório</span><b>${titulo}</b></div></div>`;
    return [
      F.secao("abertura", "A regra", R`<div class="abertura"><div class="det">Caderno do Lucas · função inventada</div>
        <div class="q">Dá para calcular $0{,}5\gf$?</div>
        <p>A regra: $${G}$ = $x$ elevado a $(1 + 2 + \dots + x)$. Exemplo: $3\gf = 3^{3+2+1} = 3^6 = 729$. Com 3 dá para somar $3 + 2 + 1$. Mas como somar "1 + 2 + … até 0,5"? Não dá. A saída é trocar a soma por uma fórmula.</p></div>`),

      F.secao("simbolo", "O símbolo e o resumo", R`
        <div class="grade2" style="align-items:center"><div style="text-align:center;font:italic 76px/1.3 var(--f-det, Lora, serif)">x${F.gf("grande")}</div>
        <div><p>O símbolo é o <b>gam fresco</b>: um gama com o braço direito reto, um tracinho pequeno inclinado (como uma barra invertida) atravessando a ponta dele e o pé dobrado em gancho, escrito <b>depois</b> do número, como o ! do fatorial. Lê-se "x gam fresco".</p>
        ${F.formula(R`x\gf = x^{\,1 + 2 + \dots + x}`, "A definição")}</div></div>
        <h3>Resumo (do caderno do Lucas)</h3>
        <p><b>O que é:</b> um número elevado à soma de 1 até ele mesmo. <b>Fórmula curta:</b> pelo truque do Gauss, $1 + 2 + \dots + n = Я(n) = \frac{n(n+1)}{2}$, então</p>
        ${F.formula(R`x\gf = x^{\,x(x+1)/2}`)}
        <table class="tb"><tr style="text-transform:none"><th style="text-transform:none">$n$</th><th style="text-transform:none">expoente $Я(n)$</th><th style="text-transform:none">$n\gf$</th></tr>
          <tr><td>1</td><td>1</td><td>$1$</td></tr>
          <tr><td>2</td><td>3</td><td>$2^3 = 8$</td></tr>
          <tr><td>3</td><td>6</td><td>$3^6 = 729$</td></tr>
          <tr><td>4</td><td>10</td><td>$4^{10} = 2^{20} = 1\,048\,576 \approx 1{,}05\times10^6$</td></tr>
          <tr><td>5</td><td>15</td><td>$5^{15} = 30\,517\,578\,125 \approx 3{,}05\times10^{10}$</td></tr>
          <tr><td>7</td><td>28</td><td>$7^{28} \approx 4{,}60\times10^{23}$ (perto do Avogadro, $6{,}02\times10^{23}$, mas é só coincidência)</td></tr></table>
        <ul>
          <li><b>Cresce absurdamente rápido:</b> mais rápido que qualquer potência fixa $x^k$, mais rápido que o fatorial e, a partir de $x \approx 5{,}41$, até mais rápido que $e^{x^2}$. Por isso nem o papel log-log endireita a curva: lá, potência vira reta, e ela continua entortando para cima.</li>
          <li><b>Aceita números quebrados:</b> como a soma tem fórmula, $0{,}5\gf = 0{,}5^{0{,}375} \approx 0{,}771$. É a mesma ideia do Euler com a gama, só que para ele foi bem mais difícil (o produto $1\cdot2\cdots n$ não tem fórmula curta).</li>
          <li><b>Tem um fundo escondido entre 0 e 1:</b> ela sai de 1 (perto do zero), desce até $\approx 0{,}770$ em $x \approx 0{,}47$ e volta para 1 em $x = 1$.</li>
          <li><b>Versão com integral</b> ("roupa de gala"; para fazer contas, use a fórmula curta):</li></ul>
        ${F.formula(R`x\gf = \exp\!\left(\int_0^x\!\left(t+\tfrac12\right)dt\;\cdot\;\int_1^x\frac{dt}{t}\right)`)}
        <p>A primeira área é o expoente $Я(x)$ (um trapézio); a segunda é o $\ln x$. As seções abaixo explicam cada pedaço com laboratório.</p>`),

      F.secao("gauss", "A escada do Gauss", R`<p>Chame a soma de $Я$. Cada coluna é um número da soma: a 1ª tem 1 quadradinho, a 2ª tem 2, e assim por diante. Ligue a 2ª escada: é uma cópia igual, de cabeça para baixo. As duas juntas formam um retângulo $n \times (n+1)$.</p>
        ${lab("lab-gauss", "Escada do Gauss")}
        ${F.formula(R`Я(n) = 1 + 2 + \dots + n = \frac{n(n+1)}{2}`)}`, 1),

      F.secao("aceita", "A fórmula aceita 0,5", R`<p>A fórmula $n(n+1)/2$ só usa vezes, mais e dividir. Essas contas funcionam com qualquer número, inclusive quebrado. No gráfico, os pontos são as somas de verdade (1, 3, 6, 10) e a curva é a fórmula: ela passa por todos os pontos e preenche os buracos entre eles.</p>
        ${lab("lab-ya", "Я(x) para x quebrado")}
        ${F.caixa("ideia", R`<p><b>Por que o Euler precisou de integral e você não?</b> No fatorial, $1 \times 2 \times \dots \times n$ não tem uma fórmula curta desse tipo. Sem fórmula, não tem onde colocar o 0,5, e ele teve de inventar a integral da gama, $\Gamma(x) = \int_0^\infty t^{x-1}e^{-t}\,dt$. Na sua função, a parte difícil é uma <i>soma</i>, e essa soma tem fórmula.</p>`)}`, 2),

      F.secao("curto", "Modo curto", R`<p>Com o $Я$ pronto, a função inteira vira uma linha só:</p>
        ${F.formula(R`${G} = x^{\,x(x+1)/2}`, "Modo curto")}
        <p>Para $x = 0{,}5$, o expoente é $0{,}5 \times 1{,}5 \div 2 = 0{,}375$. Então $0{,}5\gf = 0{,}5^{0{,}375}$.</p>
        ${F.caixa("ideia", R`<p><b>Expoente quebrado é raiz.</b> $4^{1/2} = \sqrt4 = 2$. Como $0{,}375 = 3/8$, elevar a $3/8$ é elevar ao cubo e tirar a raiz 8ª: $0{,}5^3 = 0{,}125$ e $\sqrt[8]{0{,}125} \approx 0{,}771$. Na calculadora: <b>0,5 ^ 0,375 =</b>.</p>`)}`, 3),

      F.secao("integral", "Modo integral (estilo Euler)", R`<p>O símbolo $\int$ quer dizer "área embaixo da curva". A ideia é escrever a função usando duas áreas.</p>
        ${lab("lab-areas", "Área A e área B")}
        <p><b>Área A</b>, embaixo de $y = t + \tfrac12$, de 0 a $x$: é um trapézio de bases $\tfrac12$ e $x + \tfrac12$ e altura $x$, e dá exatamente $x(x+1)/2 = Я(x)$. <b>Área B</b>, embaixo de $y = 1/t$, de 1 a $x$: é o $\ln x$ (negativa se $x < 1$, porque você anda para trás).</p>
        <p>O $e^{(\ )}$ desfaz o $\ln$: $a^b = e^{b\ln a}$. Então $x^{Я(x)} = e^{Я(x)\ln x} = e^{A\cdot B}$:</p>
        ${F.formula(R`${G} = \exp\!\left(\int_0^x\!\left(t+\tfrac12\right)dt\;\cdot\;\int_1^x\frac{dt}{t}\right)`, "À moda Euler")}
        ${F.caixa("fisico", R`<p><b>Honestidade matemática:</b> isso é um <i>produto de duas integrais</i>, não uma integral só como a do Euler. É uma forma válida de escrever, mas o "modo curto" já resolve tudo; as integrais aqui servem para mostrar de onde sai cada pedaço.</p>`)}`, 4),

      F.secao("grafico", "O gráfico inteiro", R`<p>As duas formas lado a lado, para qualquer $x$: elas sempre dão o mesmo número.</p>${lab("lab-todo", "$x\\gf$ de perto e de longe")}`, 5),

      F.secao("analise", "Análise (do Claude)", R`
        <h3>Onde fica o fundo</h3>
        <p>Seja $f(x) = \ln ${G} = Я(x)\ln x = \frac{x(x+1)}{2}\ln x$. O mínimo de ${"$"}${G}${"$"} é o mínimo de $f$:</p>
        ${F.demo("condição do mínimo", R`<p>(i) $f'(x) = \left(x + \tfrac12\right)\ln x + \frac{x(x+1)}{2}\cdot\frac1x = \left(x+\tfrac12\right)\ln x + \frac{x+1}{2}$.</p>
          <p>(ii) $f'(x) = 0 \iff (2x+1)\ln x + x + 1 = 0$. Não tem solução "bonita"; numericamente $x_\text{min} \approx 0{,}4685$ e o valor mínimo é $\approx 0{,}7704$.</p>`)}
        <h3>Perto do zero ela volta para 1</h3>
        <p>$f(x) = \frac{x+1}{2}\cdot x\ln x$ e $x\ln x \to 0$ quando $x \to 0^+$ (L'Hôpital em $\ln x/(1/x)$). Logo $${G} \to e^0 = 1$.</p>
        <h3>$\ln(x\gf)$ é convexa</h3>
        <p>$f''(x) = \ln x + \frac32 + \frac{1}{2x}$. O mínimo de $f''$ é em $x = \tfrac12$, onde vale $\tfrac52 - \ln 2 \approx 1{,}81 > 0$. Então $f$ é convexa em todo $(0,\infty)$.</p>
        ${F.caixa("ponte", R`<p><b>Pergunta para você pensar:</b> existem infinitas curvas que passam por $1, 8, 729, 1\,048\,576, \dots$ Por que $x^{x(x+1)/2}$ seria "a" extensão certa? Para o fatorial, quem responde é o <b>teorema de Bohr–Mollerup</b>: $\Gamma$ é a única função com $\Gamma(1) = 1$, $\Gamma(x+1) = x\,\Gamma(x)$ e $\ln\Gamma$ convexa. A sua função não satisfaz uma recorrência tão simples ($(n+1)\gf$ não é uma conta simples de $n\gf$). Que condições tornariam a sua extensão única? Fica em aberto.</p>`)}`),
      F.secao("mundo", "Para que serve no mundo real", R`
        <p>Os valores inteiros <b>contam quantas operações comutativas existem num conjunto de $n$ elementos</b>. Uma "operação" é uma regra $a \ast b$ que pega dois elementos do conjunto e devolve um elemento do conjunto (como $+$ ou $\times$, mas inventada). Comutativa quer dizer $a \ast b = b \ast a$.</p>
        ${F.demo("por que dá exatamente n gam fresco", R`
          <p>(i) Uma operação num conjunto de $n$ elementos é uma <b>tabela</b> $n \times n$: na linha $a$, coluna $b$, você escreve quanto vale $a \ast b$.</p>
          <p>(ii) Comutativa $\Rightarrow$ a tabela é <b>simétrica</b>: a casa $(b, a)$ é cópia da casa $(a, b)$. Você só escolhe livremente a diagonal e o que fica acima dela.</p>
          <p>(iii) Casas livres: $n$ na diagonal $+\;(n-1) + (n-2) + \dots + 1$ acima dela $= 1 + 2 + \dots + n = Я(n)$. É a escada do Gauss de novo!</p>
          <p>(iv) Cada casa livre tem $n$ opções, e as escolhas são independentes. Pelo princípio multiplicativo:</p>
          ${F.formula(R`\#\{\text{operações comutativas}\} = \underbrace{n\cdot n\cdots n}_{Я(n)\ \text{vezes}} = n^{Я(n)} = n\gf`)}`)}
        <p>Conferi por força bruta (testando todas as tabelas): $n = 2$ dá 8 e $n = 3$ dá 729. A sequência $1, 8, 729, 1\,048\,576, \dots$ está no OEIS (a enciclopédia de sequências de inteiros); segundo o seu resumo, como A023813.</p>
        ${F.caixa("ideia", R`<p>Se tirar a exigência de ser comutativa, a tabela inteira é livre: $n^2$ casas e $n^{n^2}$ operações. A sua função conta o pedaço "simétrico" desse universo.</p>`)}`),

      F.secao("parentes", "Parentes famosos", R`
        <ul>
          <li><b>Hiperfatorial:</b> $H(n) = 1^1\cdot2^2\cdot3^3\cdots n^n$. Em vez de repetir a mesma base, cada número vem elevado a ele mesmo. Foi estendido para números quebrados por <b>Kinkelin</b>, em 1860 (a função $K$), e daí sai a constante de Glaisher–Kinkelin $A \approx 1{,}2824$.</li>
          <li><b>A gama do Euler:</b> $\Gamma(n+1) = n!$ ${F.ret("CE02")}. O mesmo problema que você resolveu ("como colocar 0,5 numa coisa definida só para inteiros"), só que com produto em vez de soma no expoente.</li>
          <li><b>Superfatorial</b> (Sloane): $1!\cdot2!\cdots n!$. Estendido pela função $G$ de Barnes.</li></ul>
        <table class="tb"><tr><th style="text-transform:none">$n$</th><th style="text-transform:none">$n!$</th><th style="text-transform:none">$H(n)$</th><th style="text-transform:none">$n\gf$</th></tr>
          <tr><td>2</td><td>2</td><td>4</td><td>8</td></tr><tr><td>3</td><td>6</td><td>108</td><td>729</td></tr><tr><td>4</td><td>24</td><td>27 648</td><td>1 048 576</td></tr><tr><td>5</td><td>120</td><td>86 400 000</td><td>30 517 578 125</td></tr></table>
        <p>Repare: $n\gf \geq H(n)$ sempre, porque em $H(n)$ cada base $k$ é no máximo $n$.</p>`),

      F.secao("desafios", "Desafios", [
        F.exercicio({ n: 1, enun: R`<p>Quanto vale $1{,}5\gf$? (Use a fórmula curta.)</p>`, fig: "", dicas: [R`<p>Expoente: $Я(1{,}5) = 1{,}5 \times 2{,}5 \div 2$.</p>`, R`<p>$1{,}5^{1{,}875}$: use $a^b = e^{b\ln a}$, com $\ln 1{,}5 \approx 0{,}405$.</p>`], resp: R`$1{,}5\gf = 1{,}5^{1{,}875} \approx 2{,}14$.`, sol: R`<p>$Я(1{,}5) = 1{,}875$; $1{,}875\times0{,}4055 = 0{,}760$; $e^{0{,}760} \approx 2{,}14$. Fica entre $1\gf = 1$ e $2\gf = 8$, como deveria.</p>` }),
        F.exercicio({ n: 2, marcas: ["!"], enun: R`<p>Liste as operações comutativas no conjunto $\{0, 1\}$. São quantas? Quais delas você já conhece com outro nome?</p>`, fig: "", dicas: [R`<p>Casas livres: $0\ast0$, $0\ast1$ e $1\ast1$. Cada uma vale 0 ou 1.</p>`, R`<p>$2^3 = 8$ tabelas. Procure o "e" e o "ou" da lógica.</p>`], resp: R`8 operações ($= 2\gf$). Entre elas: E (AND), OU (OR), XOR, XNOR, NAND, NOR e as duas constantes.`, sol: R`<p>Escrevendo $(0\ast0,\ 0\ast1,\ 1\ast1)$: $(0,0,0)$ constante 0; $(0,0,1)$ AND; $(0,1,1)$ OR; $(0,1,0)$ XOR (soma mod 2); $(1,0,1)$ XNOR; $(1,1,0)$ NAND; $(1,0,0)$ NOR; $(1,1,1)$ constante 1. As 8 portas lógicas simétricas de 2 entradas são exatamente o seu $2\gf$.</p>` }),
        F.exercicio({ n: 3, marcas: ["!!"], enun: R`<p>Ache uma recorrência: escreva $(n+1)\gf$ usando $n\gf$.</p>`, fig: "", dicas: [R`<p>$Я(n+1) = Я(n) + n + 1$.</p>`, R`<p>$(n+1)^{Я(n)} = \left(n^{Я(n)}\right)^{\ln(n+1)/\ln n}$.</p>`], resp: R`$(n+1)\gf = (n+1)^{n+1}\cdot\left(n\gf\right)^{\ln(n+1)/\ln n}$ para $n \geq 2$.`, sol: R`<p>$(n+1)\gf = (n+1)^{Я(n)}\,(n+1)^{n+1}$ e $(n+1)^{Я(n)} = e^{Я(n)\ln(n+1)} = \left(e^{Я(n)\ln n}\right)^{\ln(n+1)/\ln n}$. Confira com $n = 2$: $3^3\cdot8^{\ln3/\ln2} = 27\cdot27 = 729$ ✓. O expoente $\ln(n+1)/\ln n$ é o que torna a recorrência "feia" (comparar com $\Gamma(x+1) = x\,\Gamma(x)$ na análise acima).</p>` }),
      ].join("")),
    ].join("");
  },

  montar(F) {
    const $ = (id) => document.getElementById(id);
    const J = (x) => (x * (x + 1)) / 2, Gt = (x) => (x <= 0 ? 1 : Math.pow(x, J(x)));
    const fx = (v) => String(+(+v).toFixed(2)).replace(".", ",");
    const frame = (o) => ({ sx: (x) => o.l + ((x - o.xmin) / (o.xmax - o.xmin)) * (o.W - o.l - o.r), sy: (y) => o.H - o.b - ((y - o.ymin) / (o.ymax - o.ymin)) * (o.H - o.t - o.b) });
    function eixos(o, P, xt, yt, xl, yl) {
      let s = "";
      xt.forEach((v) => (s += `<line class="grade" x1="${P.sx(v)}" x2="${P.sx(v)}" y1="${o.t}" y2="${o.H - o.b}"/><text class="tx2" x="${P.sx(v)}" y="${o.H - o.b + 17}" text-anchor="middle">${fx(v)}</text>`));
      yt.forEach((v) => (s += `<line class="grade" x1="${o.l}" x2="${o.W - o.r}" y1="${P.sy(v)}" y2="${P.sy(v)}"/><text class="tx2" x="${o.l - 7}" y="${P.sy(v) + 4}" text-anchor="end">${fx(v)}</text>`));
      s += `<line class="ln2" x1="${o.l}" x2="${o.W - o.r}" y1="${o.H - o.b}" y2="${o.H - o.b}"/><line class="ln2" x1="${o.l}" x2="${o.l}" y1="${o.t}" y2="${o.H - o.b}"/>`;
      if (xl) s += `<text class="txm" x="${o.W - o.r}" y="${o.H - o.b - 8}" text-anchor="end">${xl}</text>`;
      if (yl) s += `<text class="txm" x="${o.l + 8}" y="${o.t + 14}">${yl}</text>`;
      return s;
    }
    const path = (f, a, b, P, n = 200) => { let d = ""; for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; d += (i ? "L" : "M") + P.sx(x).toFixed(2) + " " + P.sy(f(x)).toFixed(2); } return d; };
    const corpo = (id, html) => { $(id).insertAdjacentHTML("beforeend", html); return $(id); };
    /* rótulo com o gam fresco no SVG: reserva o espaço com dx e depois desenha o glifo medindo o texto */
    const gtx = (x, y, cls, ancora, pre, suf) => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${ancora}" data-gf="1"><tspan>${pre}</tspan><tspan dx=".74em">${suf}</tspan></text>`;
    const poeGf = (sv) => sv.querySelectorAll("text[data-gf]").forEach((t) => {
      const cs = getComputedStyle(t), fs = parseFloat(cs.fontSize), h = 1.2 * fs, bb = t.getBBox(), w = t.firstChild.getComputedTextLength();
      sv.insertAdjacentHTML("beforeend", F.gfSvg(bb.x + w + 0.06 * fs - 0.12 * h, +t.getAttribute("y") - 0.64 * h, h, cs.fill)); });
    const pt = (x, y, cor = "var(--mod)", r = 6.5) => `<circle cx="${x}" cy="${y}" r="${r}" style="fill:${cor};stroke:var(--card);stroke-width:2.5"/>`;

    /* 1 · escada */
    const e1 = corpo("lab-gauss", `<div class="palco"><svg id="sv1"></svg></div><div class="leitor" id="o1"></div>
      <div class="ctrls"><div class="ctrl"><label>n</label><input type="range" min="1" max="10" step="1" value="4" id="n1"><output id="n1o"></output></div>
      <div class="bts"><button class="bt peq" id="mir" aria-pressed="true">2ª escada</button></div></div>`);
    let mir = true;
    function d1() {
      const n = +$("n1").value; $("n1o").textContent = n;
      const s = 26, ox = 30, oy = 10, by = oy + (n + 1) * s; let g = "";
      for (let k = 1; k <= n; k++) { const x = ox + (k - 1) * s;
        for (let j = 0; j < k; j++) g += `<rect x="${x + 1.5}" y="${by - (j + 1) * s + 1.5}" width="${s - 3}" height="${s - 3}" rx="3" class="preen"/>`;
        if (mir) for (let j = k; j <= n; j++) g += `<rect x="${x + 1.5}" y="${by - (j + 1) * s + 1.5}" width="${s - 3}" height="${s - 3}" rx="3" style="fill:color-mix(in srgb,var(--warn) 22%,transparent);stroke:var(--warn);stroke-dasharray:3 2"/>`;
        g += `<text class="tx2" x="${x + s / 2}" y="${by + 17}" text-anchor="middle">${k}</text>`; }
      const xr = ox + n * s;
      g += `<path class="ln2" d="M${ox} ${by + 26} v6 H${xr} v-6"/><text class="tx" x="${(ox + xr) / 2}" y="${by + 50}" text-anchor="middle">n = ${n}</text>`;
      if (mir) { const yt = by - (n + 1) * s; g += `<path class="ln2" d="M${xr + 8} ${by} h6 V${yt} h-6"/><text class="tx" x="${xr + 20}" y="${(by + yt) / 2 + 4}">n + 1 = ${n + 1}</text>`; }
      const W = Math.max(xr + 110, 200), H = by + 60, sv = $("sv1"); sv.setAttribute("viewBox", `0 0 ${W} ${H}`); sv.setAttribute("width", W * 1.15); sv.innerHTML = g;
      const S = J(n);
      $("o1").innerHTML = mir ? `<div class="vis"><small>retângulo</small><b>${n} × ${n + 1} = ${n * (n + 1)}</b></div><div class="vis"><small>uma escada</small><b>Я(${n}) = ${S}</b></div>`
        : `<div class="vis"><small>${Array.from({ length: n }, (_, i) => i + 1).join(" + ")}</small><b>Я(${n}) = ${S}</b></div>`;
    }
    $("n1").addEventListener("input", d1);
    $("mir").addEventListener("click", (ev) => { mir = !mir; ev.target.setAttribute("aria-pressed", mir); d1(); });
    d1();

    /* 2 · Я(x) */
    corpo("lab-ya", `<div class="palco"><svg id="sv2" viewBox="0 0 560 320" width="560"></svg></div><div class="leitor"><div class="vis"><small>Я(x) = x(x+1)/2</small><b id="o2"></b></div></div>
      <div class="ctrls"><div class="ctrl"><label>x</label><input type="range" min="0" max="4" step="0.05" value="0.5" id="x2"><output id="x2o"></output></div></div>`);
    const o2 = { W: 560, H: 320, l: 44, r: 18, t: 16, b: 34, xmin: 0, xmax: 4, ymin: 0, ymax: 10.5 }, P2 = frame(o2);
    function d2() {
      const x = +$("x2").value; $("x2o").textContent = fx(x);
      let g = eixos(o2, P2, [0, 1, 2, 3, 4], [0, 2, 4, 6, 8, 10], "x", "Я(x)") + `<path class="mod" d="${path(J, 0, 4, P2)}"/>`;
      [[1, 1], [2, 3], [3, 6], [4, 10]].forEach(([a, v]) => (g += pt(P2.sx(a), P2.sy(v), "var(--ink)", 5) + `<text class="tx2" x="${P2.sx(a) - 10}" y="${P2.sy(v) - 9}" text-anchor="end">${v}</text>`));
      const y = J(x), X = P2.sx(x), Y = P2.sy(y);
      g += `<line class="ln2" style="stroke-dasharray:4 4" x1="${X}" x2="${X}" y1="${o2.H - o2.b}" y2="${Y}"/><line class="ln2" style="stroke-dasharray:4 4" x1="${o2.l}" x2="${X}" y1="${Y}" y2="${Y}"/>` + pt(X, Y);
      $("sv2").innerHTML = g;
      $("o2").textContent = `Я(${fx(x)}) = ${fx(x)} × ${fx(x + 1)} ÷ 2 = ${F.t(y, 3)}`;
    }
    $("x2").addEventListener("input", d2); d2();

    /* 4 · duas áreas */
    corpo("lab-areas", `<div class="palco grade2" style="text-align:center"><div><b style="color:var(--mod)">Área A: y = t + ½</b><svg id="sv4a" viewBox="0 0 300 250" width="300"></svg></div><div><b style="color:var(--bad)">Área B: y = 1/t</b><svg id="sv4b" viewBox="0 0 300 250" width="300"></svg></div></div>
      <div class="leitor"><div class="vis"><small>A = Я(x)</small><b id="vA"></b></div><div class="vis"><small>B = ln x</small><b id="vB"></b></div><div class="vis"><small>e^(A·B)</small><b id="vE"></b></div></div>
      <div class="ctrls"><div class="ctrl"><label>x</label><input type="range" min="0.25" max="2" step="0.05" value="0.5" id="x4"><output id="x4o"></output></div></div>`);
    const oA = { W: 300, H: 250, l: 36, r: 12, t: 14, b: 30, xmin: 0, xmax: 2.2, ymin: 0, ymax: 2.8 }, oB = { ...oA, ymax: 4.4 }, PA = frame(oA), PB = frame(oB);
    function d4() {
      const x = +$("x4").value; $("x4o").textContent = fx(x);
      let a = eixos(oA, PA, [0, 0.5, 1, 1.5, 2], [0, 1, 2], "t", "");
      a += `<polygon class="preen" points="${PA.sx(0)},${PA.sy(0)} ${PA.sx(0)},${PA.sy(0.5)} ${PA.sx(x)},${PA.sy(x + 0.5)} ${PA.sx(x)},${PA.sy(0)}"/><path class="ln" d="M${PA.sx(0)} ${PA.sy(0.5)} L${PA.sx(2.2)} ${PA.sy(2.7)}"/>`;
      $("sv4a").innerHTML = a;
      let b = eixos(oB, PB, [0, 0.5, 1, 1.5, 2], [0, 1, 2, 3, 4], "t", "");
      const lo = Math.min(1, x), hi = Math.max(1, x);
      if (Math.abs(x - 1) > 1e-9) { let p = `${PB.sx(lo)},${PB.sy(0)} `; for (let i = 0; i <= 60; i++) { const t = lo + ((hi - lo) * i) / 60; p += `${PB.sx(t).toFixed(1)},${PB.sy(1 / t).toFixed(1)} `; } p += `${PB.sx(hi)},${PB.sy(0)}`;
        b += `<polygon points="${p}" style="fill:color-mix(in srgb,${x < 1 ? "var(--bad)" : "var(--mod)"} 20%,transparent);stroke:${x < 1 ? "var(--bad)" : "var(--mod)"};stroke-width:1.5"/>`; }
      b += `<path class="ln" d="${path((t) => 1 / t, 0.227, 2.2, PB)}"/><line class="ln2" style="stroke-dasharray:4 4" x1="${PB.sx(1)}" x2="${PB.sx(1)}" y1="${oB.t}" y2="${oB.H - oB.b}"/>`;
      if (x < 1) b += `<text class="tx2" x="${PB.sx(1) + 6}" y="${PB.sy(3.9)}" style="fill:var(--bad)">← para trás</text>`;
      $("sv4b").innerHTML = b;
      const A = J(x), B = Math.log(x);
      $("vA").textContent = F.t(A, 3); $("vB").textContent = F.t(B, 3); $("vE").textContent = `e^(${F.t(A * B, 3)}) = ${F.t(Math.exp(A * B), 3)}`;
    }
    $("x4").addEventListener("input", d4); d4();

    /* 5 · gráfico inteiro */
    let lo = 0.05, hi = 0.95; for (let i = 0; i < 200; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (Gt(m1) < Gt(m2)) hi = m2; else lo = m1; }
    const xm = (lo + hi) / 2, ym = Gt(xm);
    corpo("lab-todo", `<div class="palco"><svg id="sv5" viewBox="0 0 560 320" width="560"></svg></div>
      <div class="leitor"><div class="vis"><small>modo curto</small><b id="t3"></b></div><div class="vis"><small>modo integral</small><b id="t4"></b></div><div class="vis"><small>fundo</small><b>x ≈ ${F.t(xm, 4)} → ${F.t(ym, 4)}</b></div></div>
      <div class="ctrls"><div class="ctrl"><label>x</label><input type="range" min="0.02" max="2" step="0.01" value="0.5" id="x5"><output id="x5o"></output></div>
      <div class="bts"><button class="bt peq" id="vPerto" aria-pressed="true">Ver de perto</button><button class="bt peq" id="vLonge" aria-pressed="false">Ver de longe</button>
      <button class="bt peq" data-x="${xm.toFixed(2)}">fundo</button><button class="bt peq" data-x="0.5">0,5</button><button class="bt peq" data-x="1">1</button><button class="bt peq" data-x="2">2</button></div></div>`);
    const views = { perto: { W: 560, H: 320, l: 44, r: 18, t: 16, b: 34, xmin: 0, xmax: 1.15, ymin: 0.7, ymax: 1.2, xt: [0, 0.25, 0.5, 0.75, 1], yt: [0.7, 0.8, 0.9, 1, 1.1, 1.2] },
      longe: { W: 560, H: 320, l: 44, r: 18, t: 16, b: 34, xmin: 0, xmax: 2, ymin: 0, ymax: 8.4, xt: [0, 0.5, 1, 1.5, 2], yt: [0, 2, 4, 6, 8] } };
    let vista = "perto";
    function d5() {
      const x = +$("x5").value; $("x5o").textContent = fx(x);
      const o = views[vista], P = frame(o);
      let g = `<defs><clipPath id="c5"><rect x="${o.l}" y="${o.t - 2}" width="${o.W - o.l - o.r}" height="${o.H - o.t - o.b + 2}"/></clipPath></defs>` + eixos(o, P, o.xt, o.yt, "x", "") + gtx(o.l + 8, o.t + 14, "txm", "start", "x", "");
      g += `<path class="mod" clip-path="url(#c5)" d="${path(Gt, 0.0005, o.xmax, P, 300)}"/>`;
      g += `<circle cx="${P.sx(0)}" cy="${P.sy(1)}" r="5" style="fill:var(--card);stroke:var(--ink);stroke-width:2"/>` + pt(P.sx(xm), P.sy(ym), "var(--warn)", 6);
      [[1, 1], [2, 8]].forEach(([a, v]) => { if (a <= o.xmax && v <= o.ymax) g += pt(P.sx(a), P.sy(v), "var(--ink)", 5) + gtx(P.sx(a) - 10, P.sy(v) - 8, "tx2", "end", a, " = " + v); });
      const y = Gt(x);
      if (x <= o.xmax && y <= o.ymax && y >= o.ymin) g += `<line class="ln2" style="stroke-dasharray:4 4" x1="${P.sx(x)}" x2="${P.sx(x)}" y1="${o.H - o.b}" y2="${P.sy(y)}"/>` + pt(P.sx(x), P.sy(y)) + gtx(o.l + 70, o.t + 22, "tx", "start", fx(x), " = " + F.t(y, 4));
      else g += `<text class="tx2" x="${o.l + 70}" y="${o.t + 20}">ponto fora da tela: use "Ver de longe"</text>`;
      $("sv5").innerHTML = g; poeGf($("sv5"));
      const A = J(x), B = Math.log(x);
      $("t3").textContent = F.t(Math.pow(x, A), 4); $("t4").textContent = F.t(Math.exp(A * B), 4);
    }
    const setV = (v) => { vista = v; $("vPerto").setAttribute("aria-pressed", v === "perto"); $("vLonge").setAttribute("aria-pressed", v === "longe"); d5(); };
    $("x5").addEventListener("input", d5);
    $("vPerto").addEventListener("click", () => setV("perto"));
    $("vLonge").addEventListener("click", () => setV("longe"));
    document.querySelectorAll("#lab-todo [data-x]").forEach((b) => b.addEventListener("click", () => { $("x5").value = b.dataset.x; if (+b.dataset.x > 1.15) setV("longe"); else d5(); }));
    d5();
  },
});
