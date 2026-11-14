# PROGRESSO — Site de Física do Lucas

## Estado atual (14/11/2026, depois da β 1.9)
- **Física**: 47 de 96 temas escritos (códigos novos desde a β 2.0: Termodinâmica T, Ondas e Óptica O).
  - Prontos: Eletricidade e Magnetismo inteiro (20); Moderna inteira (8); Universitária inteira (6); Ondas e Óptica (7 de 11: O05–O10b; faltam O01–O04, as ondas); Bônus (X01); Simulados (S00–S04, só as páginas de entrada).
  - Vazios: Fundamentos (6), Mecânica (21), Termodinâmica (11), Navier–Stokes (7), Ondas (4).
- **Cálculo**: 20 de 20 (Cálculo 1, Cálculo 2, Funções especiais).
- **Experimentos**: 9 de 9.
- Exercícios: 7 por tema (a meta do briefing era 15–20).
- Versão em inglês: só pelo tradutor do navegador.

## Revisão geral (pedido de 14/11/2026) → β 2.0
1. [x] Módulos com letras novas: Termodinâmica = **T**, Ondas e Óptica = **O**, com cores bem diferentes. Códigos trocados (B01 → T01…, B16 → O01…) em links, [n]←, busca, sumário e simulados; progresso salvo migrado.
2. [x] Conferir a soma de Riemann da animação do Cálculo (n = 4, 16, 100).
3. [x] Temas não escritos aparecem apagados com "em breve".
4. [x] Numeração dos Experimentos (pula de EP02 para EP08).
5. [x] "Legenda" num lugar só (junto com símbolos e alfabeto grego).
6. [ ] GitHub Pages ligado. **Bloqueado aqui**: o proxy desta sessão não deixa mexer nas configurações do repositório, e o repositório é privado (Pages em repositório privado exige GitHub Pro). O Lucas liga à mão: Settings → Pages → Deploy from a branch → main / (root). O arquivo `.nojekyll` já está no repositório.
7. [x] Teste geral com Playwright **só em PC (1280 px)**: três abas, todos os links, botões, controles, console, KaTeX, exercícios, progresso salvo, exportar/importar, física das simulações nos casos limite.
- **Versão de celular: pendente, fazer no fim** (pedido do Lucas em 14/11). Já existe um rascunho não testado: menu em gaveta com botão ☰ e CSS para telas ≤ 860 px (bloco "β 2.0" no fim do `estilo.css`). Não aparece no PC.
- **Sem sistema de XP** (confirmado de novo em 14/11). Não há nenhuma menção a XP ou a "grau de feiticeiro" no site.
8. [x] Relatório honesto do que estava quebrado, do que foi corrigido e do que falta.
9. [x] Relatório de estética (na conversa de 14/11).

## Versões
Cada versão soma 0,1 (`VERSAO` em `assets/catalogo.js`; tag git `beta-0.X`).
- **β 0.1** — esqueleto + C07 Lei de Ohm e Resistores.
- **β 0.2** — área **Cálculo** (aba ∫•∫ no topo; Cálculo 1 e Cálculo 2, temas listados, ainda sem conteúdo); início sem o texto, com átomo animado (Física) e somas de Riemann + reta tangente animadas (Cálculo); módulo **Bônus** com X01 A função γ̃ (5 laboratórios + análise: mínimo, limite em 0, convexidade de ln γ̃); módulo **Simulados** (S00, página de entrada; questões virão com a fonte, ex. [ITA 2010]); selo da versão no topo.
- **β 0.3** — início da Física só com o título "Física"; Simulados dividido em S01 SOIF, S02 Vestibulares militares, S03 Vestibulares ao redor do mundo, S04 Olimpíadas de Física (BR e RU).
- **β 0.4** — lote 1 do Halliday vol. 3 (cap. 21–24): **C01, C02, C03, C03b, C04, C05** completos. 5 laboratórios novos: cargas arrastáveis (forças, linhas de campo por RK4, vetores, equipotenciais, carga de prova com K+U), eletroscópio (qualitativo), dipolo girando em campo uniforme, Gauss com fluxo numérico em 4000 pontos, placa condutora com cargas relaxando.
- **β 0.5** — lote 2 do Halliday (cap. 25–27): **C06, C08, C09, C10, C10b, C11** completos. 6 laboratórios novos (`assets/sims/circuitos2.js`): capacitor com dielétrico (bateria ligada/isolado), deriva dos elétrons (Drude), série/paralelo/misto com corrente animada por trecho, multímetro com 5 ligações (certas e erradas, fusível), gerador real (P×R e U×i), RC com gráfico ao vivo.
- **β 0.6** — **módulo C completo** (C12, C13, C14, C15, C15b a partir do Halliday cap. 28–31; C15c e C15d escritos do zero, com o material "Equações Fundamentais" como referência). 7 laboratórios novos (`assets/sims/magnetismo.js`): partícula em B (círculo, seletor de Wien, cíclotron, cicloide), espira/motor com comutador, campo de correntes (linhas = curvas de nível de A_z, forças entre fios), indução (ímã e bobina com Φ e fem; barra nos trilhos com velocidade terminal), RLC/RL com barras de energia, fasores e ressonância, onda EM.
- **β 0.7** — painel **Detalhes** no canto superior direito (abre ao passar o mouse): legendas, símbolos matemáticos com o que cada um faz, alfabeto grego com os usos em física. Novo módulo no Cálculo: **Funções especiais e integrais** (CE01 W de Lambert, CE02 Gama de Euler, CE03 Integrais fechadas ∮), só listado, sem conteúdo ainda.
- **β 0.8** — nova área **Experimentos** (aba no topo, depois de Cálculo), cada módulo um experimento: **EP01 Pêndulo simples** (dedução pela lagrangiana; exato × pequenos ângulos; período com integral elíptica; espaço de fase), **EP02 Pêndulo duplo** (lagrangiana completa passo a passo, equações explícitas, modos normais, caos com gêmeo e energia conservada), **EP03 Jogo da força de Lorentz** (5 níveis; lagrangiana de carga com potencial vetor).
- **β 0.9** — mais 5 experimentos: **EP04** bloco na mola com pêndulo (do TikTok, canal VIBRATIONS; ressonância paramétrica 2:1), **EP05** radiação de carga acelerada (dobra nas linhas de campo, Larmor), **EP06** ímã caindo em tubo de cobre/alumínio/latão × PVC, **EP07** exercício do professor (conta no fio atraída por carga: MHS para x ≪ d, correção anarmônica), **EP08** pêndulo triplo (lagrangiana de n elos, modos normais). Corrigido: README estava vazio desde a β 0.4 (bug do meu script de troca de versão).
- **β 1.0** — Experimentos reorganizados em 5 módulos: **Pêndulos** (EP01, EP02, EP08), **Eletromagnetismo** (EP03, EP05, EP06), **Força de atração** (EP07, renomeado "A bolinha elétrica no fio"), **Mola** (novo **EP09** duas massas e três molas: lagrangiana, modos normais, equações de posição, batimento, exercício), **Mistos** (EP04). Pêndulo triplo com tela maior e centralizada; animação do início dos experimentos sem cortar. Dedução do pêndulo triplo reescrita por extenso (posições, velocidades, T, V, Euler–Lagrange de θ₁ com todas as contas, equações de θ₂ e θ₃; conferido com sympy).
- **β 1.1** — Cálculo:
  - **CE01 W de Lambert**: definição, dois ramos, derivada e integral demonstradas, série, receita para resolver equações, Wien, diodo e torre de potências. Laboratório do espelho de x·eˣ, com o método de Newton.
  - **CE02 Gama de Euler**: Γ(x+1) = xΓ(x), Γ(½) = √π pela integral de Gauss, polos e reflexão, Stirling pelo método de Laplace, função Beta, Maxwell–Boltzmann e Stefan–Boltzmann. Laboratório da curva com a área numérica.
  - **CE03 Integrais fechadas ∮**: integral de linha, campos conservativos, Green com demonstração, área por ∮, Stokes e Gauss, Maxwell na forma integral, vórtice e resíduos (no chefão). Laboratório de circulação e fluxo.
  - Novo `assets/sims/calculo.js`: W e Γ numéricas, conferidas contra o scipy (erro ~1e-15).
  - **X01**: símbolo trocado pelo **gam fresco** do Lucas.
    - Glifo desenhado a partir das fotos: braço esquerdo curto, braço direito reto com tracinho \ na ponta, pé com gancho.
    - Disponível como macro `\gf` no KaTeX, `F.gf` no HTML e `F.gfSvg` no SVG.
    - Novas seções: o resumo do caderno, "para que serve" (operações comutativas, demonstrado e conferido por força bruta), parentes (hiperfatorial, Kinkelin 1860) e 3 exercícios.
- **β 1.2**:
  - **X01, os negativos do gam fresco**:
    - Tabela de −1 a −6, com a observação Я(−n) = Я(n−1).
    - Explicação de por que, entre os inteiros negativos, o valor é complexo: |x|^Я · e^{iπЯ}.
    - Novo laboratório com parte real, parte imaginária e módulo.
    - Pegadinha da raiz cúbica real em Я = 1/3.
  - **Cálculo 1, temas CI01–CI05 completos**:
    - **CI01** limites: definição ε-δ. Laboratório do jogo do ε e δ.
    - **CI02** continuidade e limites fundamentais: TVI, sen x/x pelas áreas e o número e. Laboratórios de bissecção e das três áreas.
    - **CI03** derivada: definição e significado físico. Laboratório da secante à tangente, com o gráfico de f′.
    - **CI04** regras de derivação: produto, quociente, cadeia, inversa, implícita e logarítmica, com a propagação de erro do pêndulo do Lucas. Laboratório da regra da cadeia.
    - **CI05** aplicações da derivada: máximos e mínimos, Snell por Fermat, TVM e L'Hôpital. Laboratório do salva-vidas.
    - Cada tema tem exemplário, 7 exercícios e chefão. Números conferidos com sympy e scipy (scratchpad ci.py).
- **β 1.3**:
  - **Cálculo 1 completo**:
    - **CI06** integral definida e somas de Riemann. Laboratório com 5 regras e a ordem do erro.
    - **CI07** Teorema Fundamental, com a demonstração das duas partes e o teorema trabalho–energia. Laboratório da área acumulada A(x).
    - **CI08** integral indefinida e substituição; o MUV deduzido integrando. Laboratório da família F + C com campo de direções.
    - **CI09** áreas, volumes (discos, cascas), trabalho, centro de massa, represa e velocidade de escape. Laboratório de sólidos de revolução.
  - **Cálculo 2 até a série de Taylor**:
    - **CII01** técnicas de integração: partes, frações parciais, trigonométricas. Laboratório "por partes como figura".
    - **CII02** integrais impróprias. Laboratório da fronteira p = 1.
    - **CII03** sequências e séries. Laboratório de somas parciais.
    - **CII04** séries de potências e Taylor, com a fórmula de Euler e a relatividade. Laboratório dos polinômios de Taylor.
  - Cada tema tem exemplário, 7 exercícios e chefão. Números conferidos com sympy e scipy (scratchpad ci2.py).
  - **Revisão**:
    - Teste de estresse em todos os laboratórios de Cálculo e na X01: todos os botões e controles nos extremos, sem NaN e sem erro de JS.
    - Exemplos sorteados sem "1x", "e^{1}", "2,0" ou "x − −1". Novos formatadores `F.n` (número limpo) e `F.c` (coeficiente), corrigidos também em CE01–CE03.
    - Cabeçalho das tabelas deixou de ser forçado para maiúsculas, porque "f(x)" virava "F(X)".
- **β 1.4**:
  - Botão do sol trocado por uma **engrenagem de configurações**.
  - Aparência: escuro, claro ou do sistema (segue o Windows e muda junto).
  - Idioma: português, ou English com a orientação de usar o tradutor do navegador por enquanto.
  - As fórmulas ficam marcadas com `translate="no"`, para o tradutor não estragá-las.
  - Tradução feita à mão: fica para o final.
- **β 1.5**:
  - **Cálculo inteiro concluído**.
    - **CII05** várias variáveis e derivadas parciais. Laboratório do mapa topográfico com as fatias.
    - **CII06** gradiente, máximos e mínimos, Lagrange e mínimos quadrados. Laboratório dos gradientes paralelos no círculo. Chefão: Boltzmann por Lagrange.
    - **CII07** integrais duplas e triplas, polares e esféricas. Laboratório dos prismas. Chefão: esfera × cilindro × anel na rampa.
    - **CII08** EDOs. Laboratórios do campo de direções com Euler e do oscilador amortecido. Chefão: paraquedista com arrasto quadrático.
  - Testes: KaTeX, exemplos sorteados, estresse de todos os laboratórios e scan de formatação, sem problemas.
- **β 1.6**: Óptica (base: Halliday vol. 4, caps. 33–36, lote 1 de 3).
  - **B12 Refração**: Snell por Huygens, reflexão total, fibra, prisma, polarização, Malus e Brewster. Laboratório com as fórmulas de Fresnel. Chefão: os 42° do arco-íris.
  - **B13 Lentes**: Gauss por semelhança, equação dos fabricantes, olho e óculos. Laboratório de traçado dos 3 raios principais. Chefão: 4f e método de Bessel.
  - **B14b Óptica ondulatória**: Young e a intensidade cos², filmes finos, difração, Rayleigh e rede. Laboratórios das fendas (N = 1 a 10) e das cores do filme de sabão. Chefão: N fendas por fasores e fórmula de Euler.
  - Novo arquivo `assets/sims/optica.js`.
- **β 1.7**: Moderna (base: Halliday vol. 4, caps. 37–40).
  - **C18 Relatividade**: postulados, relógio de luz, dilatação e contração (múons, GPS), Lorentz, simultaneidade, soma de velocidades, Doppler e E = mc². Laboratório do relógio de luz animado. Chefão: paradoxo dos gêmeos com contagem de sinais.
  - **C17 Fotoelétrico e dualidade**: fóton, Einstein, Millikan, de Broglie, fenda dupla com elétrons, incerteza e túnel. Laboratório animado do fotoelétrico com o gráfico K × f. Chefão: efeito Compton.
  - **C17b Átomo de Bohr**: modelo, Rydberg, séries, números quânticos, Pauli, Stern–Gerlach e laser. Laboratório de níveis e espectro. Chefão: dedução de Bohr e a constante 1/137.
  - Novo arquivo `assets/sims/moderna.js`.
  - Revisão de Óptica e Moderna: corrigidos o artigo no exemplo da B12 ("da água"), o erro de KaTeX na C17, os níveis de Bohr invertidos no laboratório e o gráfico do fotoelétrico sem recorte.
- **β 1.8**: Moderna completa (base: Halliday vol. 4, caps. 38 e 41–44).
  - **C16 Física Quântica**: corpo negro, Planck, Wien e Stefan. Chefão: dedução da energia média de Planck.
  - **C19 Física Nuclear**: núcleo, energia de ligação, decaimentos e meia-vida. Laboratórios da curva B/A e do decaimento aleatório. Chefão: datação por carbono-14.
  - Temas **novos**:
    - **C19b Energia Nuclear**: fissão, reação em cadeia, fusão, ITER e NIF.
    - **C20 Sólidos e Semicondutores**: bandas, dopagem, junção p–n, LED, célula solar, supercondutores.
    - **C21 Partículas e Cosmologia**: Modelo Padrão, quarks (laboratório para montar hádrons), Hubble, Big Bang, matéria e energia escuras.
  - **Revisão geral**: as 66 páginas publicadas passaram no teste de KaTeX, nos exemplos sorteados e no estresse de todos os laboratórios.
    - Corrigidos: "1x" na C04; ponto decimal na C15; zeros inúteis (tipo "12,000 Ω") nos exemplos de C01–C15d; rótulos sobrepostos na curva de energia de ligação.
- **β 1.9** — Óptica geométrica completa e módulo Universitária aberto.
  - Óptica: B09 Fundamentos, B10 Espelhos planos (caleidoscópio), B11 Espelhos esféricos, B14 Instrumentos ópticos e olho (microscópio e luneta).
  - Universitária (novo `assets/sims/univ.js`): U01 grad/div/rot (rodinha de pás), U02 Gauss e Stokes (fluxo de cargas em 2D; chefão: túnel pela Terra, 84,4 min),
    U03 Lagrange (conta no aro girando, bifurcação), U04 Hamilton e mínima ação (S(ε) mínima no caminho real; Bohr–Sommerfeld),
    U05 Maxwell diferencial (FDTD de Yee, r = −0,200 conferido), U06 Schrödinger (poço infinito e superposição; oscilador gaussiano).
  - Todos os números conferidos em Python; t6, tstress e texemp limpos em todas as páginas novas.

- **β 2.0** — Revisão geral.
  - **Códigos novos**: Termodinâmica virou **T** (vermelho-alaranjado) e Ondas e Óptica virou **O** (amarelo). MHS (B15, que já ficava na Mecânica) virou **A20**. Experimentos renumerados na ordem do menu. Tabela completa em "Códigos antigos → novos", abaixo.
    - O progresso salvo no navegador é convertido sozinho, uma única vez (chave `fisica:codigos` = 2). Um backup .json antigo também é convertido ao importar. Links antigos (ex.: `#/B12`) redirecionam.
  - Menu: temas não escritos apagados com a etiqueta "em breve"; cada módulo mostra "escritos/total"; [n]← para tema não escrito fica tracejado. "em breve" também no sumário e nos cartões do início.
  - Legenda num lugar só: o painel "Legenda e símbolos" do topo (legenda, caixas, símbolos matemáticos, alfabeto grego). O link "Legenda" saiu; `#/legenda` abre o painel.
  - Animação do início do Cálculo: troquei a soma pelo ponto médio (que converge rápido e parecia "bater" com a integral já com n = 16) pela soma pela esquerda, e agora mostra o erro. n = 4: 7,0210; n = 16: 7,1815; n = 100: 7,2241 (o site anima 2 a 128); integral 7,2321.
  - **Bugs corrigidos**:
    - CI04 mostrava o laboratório do reator nuclear: `SIM.cadeia` existia em calculo.js e em moderna.js (renomeado para `SIM.reacaoCadeia`).
    - Sumário: os links "teoria" e "[exercícios]" não rolavam até a seção em ~50 temas, cujas seções tinham outro nome. Agora sempre acham a seção.
    - Notação científica: "10,0 × 10⁶" em vez de "1,00 × 10⁷" (F.sigM); "6,42e+7" na C16 e em mais 4 lugares (novo F.cient, que dá "6,42 × 10⁷").
    - CE01: o controle começava abaixo de −1/e e mostrava "—".
    - Importar progresso apagava os temas feitos que não estavam no arquivo; agora soma.
    - Rótulo "3000" cortado na C16; "1 escritos"; legenda da animação do Cálculo encostando no cartão.
  - **Testes** (Playwright, 1280 px): 125 páginas (0 katex-error, 0 erro de JS, 870 links sem nenhum quebrado); estresse dos 83 laboratórios (0 problemas); 36 testes de funcionamento (dicas, respostas, marcações, chefão, feito, recarregar, exportar/importar, topo, busca, menu, sumário, abas, tema claro); 118 conferências de física em casos limite contra fórmulas independentes.
  - Celular: só um rascunho (gaveta + CSS ≤ 860 px), não testado. Fica para o fim.

- **β 2.1** — Estética (os 8 pontos do relatório da β 2.0, aprovados pelo Lucas).
  1. Menu: os temas "em breve" e os módulos vazios ficam escondidos; botão "Mostrar temas em breve" no topo do menu (a escolha fica salva). A busca sempre acha tudo.
  2. Laboratórios: mostradores num padrão só (rótulos sem maiúsculas forçadas, mesmo tamanho); 3 algarismos significativos na bancada do fio (C07) e na associação (C08); unidades nos controles da O05, C06 e EP04. Os números longos do Cálculo ficaram de propósito (mostram o erro caindo).
  3. Exercícios e chefão: Dica 1, Dica 2 e Resposta viraram botões lado a lado; cada um abre o seu painel embaixo (clicar de novo fecha). Metade da altura de antes.
  4. Teoria: seções numeradas e separadas por uma linha; **Folha de fórmulas** automática no fim de cada tema (junta as fórmulas em destaque; não aparece nos temas que já têm "Resumo" escrito).
  5. Cores novas, com ~35° de matiz entre vizinhos dentro de cada área: Mecânica azul-anil, Termodinâmica vermelha, Óptica amarela, Simulados laranja, Navier–Stokes ciano, Universitária verde; Cálculo 1 âmbar, Funções especiais ciano-esverdeado.
  6. Emojis trocados por ícones desenhados (caixas, chefão, cadeado, chute, dado, exportar/importar, legenda) e tirados dos botões dos laboratórios.
  7. Início: cartão "Continuar de onde parei", com o último tema aberto em cada aba e a seção em que você estava.
  8. "em breve" com mais contraste.
  - Também: "(" solto no exercício C02.02.
  - Testes: 125 páginas (0 katex-error, 0 erro de JS, 912 links), estresse dos 83 laboratórios, 118 conferências de física, 44 testes de funcionamento: tudo ok.
  - **Não feito ainda** (precisa de trabalho tema a tema): figuras novas e resumos curtos escritos no fim de cada seção da teoria; refazer os desenhos dos laboratórios numa escala só (hoje a letra parece maior ou menor conforme o tamanho de cada desenho).

- **β 2.2** — **Calculadora científica** (`assets/calc.js`), pedida pelo Lucas para a parte de física experimental.
  - Liga e desliga na engrenagem (Configurações → Calculadora científica, interruptor). Ligada, o topo dela aparece no canto inferior esquerdo subindo; clicar no topo sobe a calculadora inteira (e clicar de novo, ou SHIFT AC = OFF, abaixa). Fica salva ligada/desligada.
  - Teclas na mesma ordem da calculadora do Lucas (fx-991ES PLUS), com as funções de SHIFT (dourado) e ALPHA (rosa) nos mesmos lugares; visual próprio do site. Também aceita o teclado do computador (números, + − * / ^ ( ), Enter, Backspace, Esc, setas).
  - Modos (MODE): COMP, CMPLX, STAT (1-VAR, A+BX, _+CX², ln X, e^X, A·B^X, A·X^B, 1/X), BASE-N (32 bits), EQN (sistemas 2×2 e 3×3, 2º e 3º grau, com raízes complexas e o vértice da parábola), MATRIX (até 3×3: det, Trn, inversa, potências), TABLE e VECTOR (Dot, produto vetorial, módulo).
  - SETUP: MthIO/LineIO, Deg/Rad/Gra, Fix/Sci/Norm, ab/c ou d/c, complexo a+bi ou r∠θ. CLR (Setup, Memory, All).
  - CONST (40 constantes, valores CODATA 2018), CONV (40 conversões), CALC, SOLVE (Newton + bissecção), ∫ (Gauss–Kronrod adaptativo), d/dx (Richardson), Σ, Pol, Rec, nPr, nCr, x!, %, °′″, DRG▸, ENG, Rnd, Ran#, RanInt#, STO/RCL, variáveis A–F, X, Y, M, M+/M−, Ans, histórico (▲▼), INS.
  - Resultado em forma exata quando dá (fração, a√b/c, (a + b√c)/d, kπ/n), como na MthIO; S⇔D troca para decimal.
  - Testes: 88 contas digitadas tecla por tecla e conferidas com o valor certo (todos os modos), mais a regressão do site inteiro.
  - **Diferenças da calculadora real** (honestas): a entrada é linear (com cursor, como a LineIO), só o resultado é "de livro"; sem gráfico (não precisava); STAT sem a coluna de frequência; TABLE só com f(X); sem ":" (várias contas numa linha). A ordem da lista CONST segue o manual de memória, e os valores são os do CODATA 2018 (calculadoras antigas usam valores um pouco diferentes na 5ª casa em diante).

## Como abrir
Dar dois cliques em `index.html` (Chrome/Edge/Firefox). Funciona offline: KaTeX e fontes estão em `assets/`.
O progresso (temas feitos, marcações ● X /, chefões destravados) fica no navegador; use "Exportar progresso" no menu para guardar um .json.

## Códigos antigos → novos (β 2.0)
O histórico acima usa os códigos antigos.
- Termodinâmica: B01–B08b → T01–T08b (mesmo número: B04b → T04b, B05b → T05b, B08b → T08b).
- Ondas e Óptica, na ordem do menu: B16 → O01, B17 → O02, B18 → O03, B19 → O04, B09 → O05, B10 → O06, B11 → O07, B12 → O08, B13 → O09, B14 → O10, B14b → O10b.
- MHS: B15 → A20 (já ficava no módulo Mecânica).
- Experimentos: EP08 (pêndulo triplo) → EP03, EP03 (Lorentz) → EP04, EP09 (duas massas) → EP08, EP04 (bloco com pêndulo) → EP09. EP01, EP02, EP05, EP06 e EP07 não mudaram.
  - Por que pulava: os números foram dados na ordem em que os experimentos foram escritos (β 0.8–1.0), e depois eles foram agrupados por assunto no menu.

## Decisões (com o Lucas)
- Foco no PC (1280 px); versão de celular só no fim do projeto. Tema escuro padrão, engrenagem com escuro/claro/sistema.
- Interativo = simulações. Sem XP, sem revisão espaçada, sem mapa de erros automático.
- Exercícios estáticos: dica 1, dica 2, resposta escondidas (abrem com clique) + marcação ● X / salva.
- Chefão destrava quando todos os exercícios do tema têm marcação (ou botão "já fiz no caderno").
- Códigos com 13 normal (A13, T13, C13). A17 = Hidrostática (assumido). Letras: F, A, T, O, C, M, U, N, X, S (desde a β 2.0).
- Exercícios de provas reais (ITA, IME, olimpíadas russas…) sempre com a fonte e o ano, ex. [ITA 2010].
- Cálculo 2: lista provisória (técnicas de integração, impróprias, séries, Taylor, várias variáveis, gradiente/Lagrange, integrais múltiplas, EDOs) até chegarem os materiais.
- Parte universitária: U01–U06 do briefing, até o Lucas mandar os livros (4 PDFs, depois).

## Estrutura
- `index.html` — casca (topo que some, menu, área principal)
- `assets/estilo.css` — arquivo de estilo único (cores por módulo). Não mudar sem o Lucas pedir.
- `assets/app.js` — rotas (#/C07, #/C07/teoria), menu, progresso, componentes: F.secao, F.formula, F.caixa, F.demo, F.chute, F.exemplo, F.exercicio, F.chefao, F.lab
- `assets/desenho.js` — kit SVG (resistor, bateria, LED, medidor, setas, cilindro, eixos)
- `assets/catalogo.js` — todos os módulos/temas; o 4º campo `true` = tema pronto
- `assets/sims/` — simulações reutilizáveis (circuito, curvas, fio)
- `temas/<COD>.js` — conteúdo de cada tema (`F.registrar`)

## Pronto
- [x] Esqueleto, menu com busca e bolinhas, início, legenda, sumário em árvore, exportar/importar
- [x] C01, C02, C03, C03b, C04, C05 (β 0.4)
- [x] C06, C08, C09, C10, C10b, C11 (β 0.5)
- [x] C12, C13, C14, C15, C15b, C15c, C15d (β 0.6) — módulo C fechado
- [x] C07 Lei de Ohm e Resistores: abertura, 3 laboratórios (circuito vivo com LED que queima + fumaça e modelo exponencial via W de Lambert; curva U×i com R estática/dinâmica; bancada do fio com temperatura e "esticar"), chute, ideia física, teoria em 9 partes com 5 demonstrações, exemplário com 5 casos sorteados, resumo, 16 exercícios (9 Físico + 7 Máximo), chefão "O LED teimoso"

## Conferências do C07
- Contas de todos os exercícios e do chefão conferidas em Python (scipy.lambertw / brentq).
- 0 katex-error (com todas as dicas e resoluções abertas); 75 exemplos sorteados sem NaN.
- Testado: progresso salva e volta após recarregar; chefão destrava; tema claro; sem erros de JS.

## Conferências da β 0.2
- X01: 0 katex-error; modo curto e modo integral dão o mesmo valor (0,7711 em x = 0,5); mínimo conferido em Python (x ≈ 0,4685, valor ≈ 0,7704).
- Menu troca de área conforme a aba; sem erros de JS.

## Conferências da β 0.4
- Todas as contas dos exercícios e chefões de C01–C05 conferidas em Python (scratchpad `c0x.py`); chefão do C03b integrado com `solve_ivp`; chefão do C03 conferido simulando a trajetória.
- 0 katex-error em C01–C05 com todas as dicas/resoluções abertas; 8 exemplos sorteados por caso sem NaN; sem erros de JS.
- Gauss numérico bate com q/ε0 (226 = 226 N·m²/C).
- Tamanho: 6 a 11 exercícios por tema (menos que os 15–20 do briefing). Dá para completar depois.

## Conferências da β 0.5
- Contas de C06, C08–C11 conferidas em Python (scratchpad `c05b.py`): grade infinita resolvida numa grade 161×161 (0,50002 R), cubo (5R/6 e 7R/12), ponte desequilibrada (20,95 Ω), escada RC com solve_ivp (t½ = 2,22 RC), voltímetros não ideais, 24 pilhas.
- 0 katex-error; exemplos sorteados sem NaN; sem erros de JS.
- C07: o cap. 26 do Halliday (resistividade, Ohm, visão microscópica, potência, semicondutores, supercondutores) já estava coberto no C07; não mudou.

## Conferências da β 0.6
- Contas de C12–C15d conferidas em Python (scratchpad `c06.py`). Chefão do C12 (cicloide) e do C15 (barra + capacitor) simulados com solve_ivp; chefão do C14 conferido por superposição numérica. A conferência pegou 2 erros meus de rascunho antes de entrarem no site (τ do chefão do C15; ordem de grandeza da corrente de deslocamento).
- 0 katex-error; exemplos sorteados sem NaN; sem erros de JS.

## Fontes recebidas
- Halliday, Fundamentos de Física vol. 3, 9ª ed., cap. 21–30 + início do 31 (3 PDFs). Usado como base (reescrito).
- Halliday vol. 4 (8ª ed.), fim do cap. 43 (energia nuclear), cap. 44 (partículas, Big Bang) e apêndices: guardar para o módulo M (C19). O Lucas disse que vai recortar de novo.
- "Equações Fundamentais da Física" (15 p.): panorama de mecânica, gravitação, EM, relatividade, termo, ondas/fluidos, quântica. Usado no C15d; servirá para U, N e M.
- SOIF Problemas Resolvidos vol. IV (Thiago Felício): enunciados SOIF 2019 (P1–23) e SOIF 2020 (P1–13). A fazer depois do Halliday.

## Conferências da β 0.8
- Equações do pêndulo duplo deduzidas com sympy e comparadas com as do site (diferença 0); fórmula explícita do simulador com resíduo ~1e-15; energia conservada (erro relativo ~1e-10 em 20 s no Python; 0,00000% no site).
- Período do pêndulo simples: simulação 1,768 s = integral elíptica 1,768 s (θ₀ ≈ 30°, L = 0,75 m).
- Jogo: os 2 níveis desenhados primeiro eram impossíveis (num campo uniforme a trajetória é um círculo); redesenhados e conferidos por busca numérica: os 5 níveis têm solução.

## Conferências da β 0.9
- Equações do TikTok deduzidas com sympy: iguais às da imagem. Forma matricial do pêndulo de n elos conferida contra sympy (resíduo ~1e-15). Modos normais do triplo com numpy (ω²ℓ/g = 0,416; 2,294; 6,290); o vetor que eu tinha posto à mão estava errado e foi corrigido.
- EP07: correção T ≈ T₀(1 + 9x₀²/16d²) conferida com solve_ivp; o site mede 67,7 ms para x₀/d = 0,2 (previsto 67,8).
- EP06: b e v_terminal calculados em Python (6,8 cm/s no cobre de 1 mm).
- 0 katex-error; sem erros de JS; energia conservada nos pêndulos.

## Lembretes do Lucas (para as próximas sessões)
1. Escrever o módulo de funções especiais (W de Lambert, Gama de Euler, integrais "bolinha" ∮) e o Cálculo 1 e 2 (do zero).
2. Criar uma aba de **jogos interativos** para eletromagnetismo, moderna e elétrica (as partes mais abstratas).
3. O Lucas vai mandar fotos do "pdfzinho de moderna do Claude".
4. O Lucas vai mandar o Halliday 2 (recortado de novo).
5. O Lucas vai mandar provas do ITA e do vestibular coreano (para Simulados S02/S03).

## Falta
- Cálculo 1 e 2: do zero, depois (pedido do Lucas).
- Esperando o Lucas dizer o próximo passo (SOIF, outros módulos ou Cálculo).
- Noites 1–11 do briefing (todos os outros temas), unidades e constantes (CODATA), simulados por módulo, formulário com busca, mapa de pré-requisitos.

## Problemas conhecidos
- Depois que o LED queima, é preciso baixar a tensão/subir R antes de "Trocar o LED"; senão ele queima de novo na hora (é física, mas pode confundir).
