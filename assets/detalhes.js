/* Painel "Legenda e símbolos" (canto superior direito): o ÚNICO lugar da legenda, junto com os símbolos matemáticos e o alfabeto grego.
   Abre ao passar o mouse (ou ao clicar/tocar). */
(function () {
  const SIMB = [
    ["\\sum_{k=1}^{n} a_k", "Somatório", "soma todos os termos $a_k$, com $k$ indo de 1 até $n$"],
    ["\\prod_{k=1}^{n} a_k", "Produtório", "multiplica todos os termos, de $k = 1$ até $n$ (ex.: $n! = \\prod k$)"],
    ["\\int_a^b f\\,dx", "Integral definida", "área (com sinal) sob $f$ entre $a$ e $b$; soma de infinitos pedacinhos $f\\,dx$"],
    ["\\oint", "Integral fechada (\"bolinha\")", "integral numa curva ou superfície <b>fechada</b>: circulação (Ampère, Faraday) ou fluxo total (Gauss)"],
    ["\\iint,\\ \\iiint", "Integral dupla, tripla", "soma sobre uma área ou um volume"],
    ["\\frac{df}{dx},\\ f'", "Derivada", "taxa de variação de $f$ quando $x$ muda; inclinação da tangente"],
    ["\\dot x,\\ \\ddot x", "Ponto em cima", "derivada em relação ao <b>tempo</b> (velocidade, aceleração)"],
    ["\\frac{\\partial f}{\\partial x}", "Derivada parcial", "deriva em $x$ mantendo as outras variáveis fixas"],
    ["\\nabla f", "Gradiente", "vetor que aponta para onde $f$ cresce mais rápido ($\\vec E = -\\nabla V$)"],
    ["\\nabla\\cdot\\vec A", "Divergente", "o quanto o campo \"sai\" de um ponto (fonte/sumidouro)"],
    ["\\nabla\\times\\vec A", "Rotacional", "o quanto o campo \"gira\" em volta de um ponto"],
    ["\\nabla^2", "Laplaciano", "divergente do gradiente; aparece em ondas, calor, Schrödinger"],
    ["\\lim_{x\\to a}", "Limite", "valor de que a expressão se aproxima quando $x$ chega perto de $a$"],
    ["\\infty", "Infinito", "maior que qualquer número (não é um número)"],
    ["\\approx,\\ \\sim", "Aproximadamente", "$\\approx$: quase igual; $\\sim$: mesma ordem de grandeza"],
    ["\\propto", "Proporcional", "$y \\propto x$: dobrar $x$ dobra $y$"],
    ["\\equiv,\\ :=", "Definição / identidade", "igual por definição, ou igual para todos os valores"],
    ["\\ll,\\ \\gg", "Muito menor / muito maior", "permite desprezar um termo frente ao outro"],
    ["\\pm,\\ \\mp", "Mais ou menos", "as duas possibilidades (ou incerteza de medida)"],
    ["\\Delta x", "Delta maiúsculo", "variação finita: $x_\\text{final} - x_\\text{inicial}$"],
    ["\\delta x,\\ dx", "Variação pequena", "$dx$: infinitesimal; $\\delta$: pequena variação ou incerteza"],
    ["\\vec v,\\ \\mathbf v", "Vetor", "grandeza com módulo, direção e sentido"],
    ["\\hat n", "Versor (chapéu)", "vetor de módulo 1 que só indica direção"],
    ["|x|,\\ \\|\\vec v\\|", "Módulo, norma", "valor sem sinal; tamanho do vetor"],
    ["\\vec a\\cdot\\vec b", "Produto escalar", "$ab\\cos\\theta$: dá um número (trabalho, fluxo)"],
    ["\\vec a\\times\\vec b", "Produto vetorial", "vetor perpendicular aos dois, módulo $ab\\sin\\theta$ (torque, força magnética)"],
    ["\\perp,\\ \\parallel", "Perpendicular, paralelo", "formam 90°; têm a mesma direção"],
    ["\\langle x\\rangle,\\ \\bar x", "Média", "valor médio (no tempo ou num conjunto)"],
    ["n!", "Fatorial", "$1\\cdot2\\cdot\\ldots\\cdot n$; $0! = 1$"],
    ["\\ln x,\\ \\log x", "Logaritmo", "$\\ln$: base $e$; $\\log$: base 10 (em física)"],
    ["e", "Número de Euler", "$e \\approx 2{,}718$; $\\frac{d}{dx}e^x = e^x$"],
    ["i", "Unidade imaginária", "$i^2 = -1$ (em circuitos às vezes se usa $j$)"],
    ["\\hbar", "h cortado", "$h/2\\pi \\approx 1{,}05\\times10^{-34}$ J·s"],
    ["\\in,\\ \\forall,\\ \\exists", "Pertence, para todo, existe", "$x\\in\\mathbb R$: $x$ é real"],
    ["\\Rightarrow,\\ \\Leftrightarrow", "Implica, equivale", "se...então; se e somente se"],
    ["\\therefore", "Portanto", "conclusão"],
    ["\\odot,\\ \\otimes", "Saindo, entrando", "vetor saindo da tela (ponta da flecha) / entrando (rabo da flecha)"],
  ];
  const GREGO = [
    ["Α α", "alfa", "aceleração angular, partícula α, coef. de dilatação"], ["Β β", "beta", "v/c na relatividade, decaimento β"], ["Γ γ", "gama", "fator de Lorentz, raio γ, função Gama"],
    ["Δ δ", "delta", "variação; variação pequena"], ["Ε ε", "épsilon", "permissividade ε₀, fem, deformação"], ["Ζ ζ", "zeta", "fator de amortecimento, função zeta"],
    ["Η η", "eta", "rendimento, viscosidade"], ["Θ θ", "teta", "ângulo, temperatura"], ["Ι ι", "iota", "(raro)"],
    ["Κ κ", "capa", "constante dielétrica, condutividade térmica"], ["Λ λ", "lambda", "comprimento de onda, densidade linear, constante de decaimento"], ["Μ μ", "mi", "coef. de atrito, μ₀, momento magnético, micro"],
    ["Ν ν", "ni", "frequência (em óptica/quântica)"], ["Ξ ξ", "csi", "deslocamento, variável auxiliar"], ["Ο ο", "ômicron", "(raro)"],
    ["Π π", "pi", "3,14159…; produtório"], ["Ρ ρ", "rô", "densidade, resistividade, densidade de carga"], ["Σ σ", "sigma", "somatório; densidade superficial, desvio padrão, condutividade"],
    ["Τ τ", "tau", "torque, constante de tempo, tempo próprio"], ["Υ υ", "ípsilon", "(raro)"], ["Φ φ", "fi", "fluxo, ângulo de fase, potencial"],
    ["Χ χ", "qui", "susceptibilidade, χ² estatístico"], ["Ψ ψ", "psi", "função de onda"], ["Ω ω", "ômega", "ohm; velocidade angular, frequência angular"],
  ];
  window.montaDetalhes = (F) => {
    const host = document.getElementById("detalhes-painel"); if (!host) return;
    const leg = Object.entries(F.LEG).map(([k, v]) => `<tr><td><span class="selo">${k}</span></td><td>${v}</td></tr>`).join("");
    host.innerHTML = `
      <details open><summary>Legenda das marcações</summary><table class="tb"><tr><td><span class="selo ret">[n]←</span></td><td>retoma o tema n</td></tr>${leg}<tr><td><b>● X /</b></td><td>certeza · dúvida · chutei</td></tr><tr><td style="color:var(--bad)">${F.ic("caveira")}</td><td>chefão Impossível 99 (destrava depois dos exercícios)</td></tr><tr><td><span class="breve-tag">em breve</span></td><td>tema ainda não escrito</td></tr></table>
        <div class="leg-caixas">${[["fisico", "aproximações, análise dimensional, casos limite."], ["pegadinha", "erros clássicos de prova."], ["olimpiada", "truques de OBF, ITA e olimpíadas russas."], ["ponte", "onde aquilo reaparece na faculdade."], ["ideia", "a intuição por trás da conta."]].map(([k, d]) => `<div class="caixa-mini ${k}">${F.ic(k)}<span><b>${F.CX[k]}</b>: ${d}</span></div>`).join("")}</div></details>
      <details><summary>Símbolos matemáticos</summary><table class="tb">${SIMB.map(([s, n, d]) => `<tr><td style="white-space:nowrap">$${s}$</td><td><b>${n}</b><br><span style="color:var(--ink2)">${d}</span></td></tr>`).join("")}</table></details>
      <details><summary>Alfabeto grego</summary><table class="tb">${GREGO.map(([l, n, u]) => `<tr><td style="font-size:18px;white-space:nowrap">${l}</td><td><b>${n}</b><br><span style="color:var(--ink2)">${u}</span></td></tr>`).join("")}</table></details>`;
    F.math(host);
    const raiz = document.getElementById("detalhes");
    raiz.querySelector("button").addEventListener("click", () => raiz.classList.toggle("aberto"));
    document.addEventListener("click", (ev) => { if (!raiz.contains(ev.target)) raiz.classList.remove("aberto"); });
  };
})();
