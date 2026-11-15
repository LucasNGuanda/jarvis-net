# PROGRESSO — Jarvis (sistema de estudo do Lucas)

## Estado atual (15/11/2026, depois da β 3.4)
As regras, o perfil do Lucas e as decisões fixas estão no `CLAUDE.md` (criado hoje). Aqui fica só o estado do trabalho.

### Física — 96 de 96 temas escritos
Contagem real, feita abrindo cada tema no navegador (exercícios por tema; "auto" = com correção automática; todos têm chefão, salvo indicação):
- **F Fundamentos** (6/6): F01–F05 e A19, 7 exercícios cada, sem correção automática.
- **A Mecânica** (21/21): A01 12, A02 13, A03 14, A04 12, A05 12, A06 13, A07 13, A08 14, A09 12, A10 12, A11 12, A12 13, A12b 12, A13 13, A14a 13, A14 12, A15 12, A16 13, A17 13, A18 12, A20 12 (todos com correção automática e nível Físico/Máximo).
- **T Termodinâmica** (11/11): T01, T02, T03, T04, T04b, T05, T05b, T06, T07, T08, T08b com 16 exercícios cada, todos com figura, correção automática e nível; todos com `F.chute`, laboratório e chefão. Primeiro módulo inteiro no padrão completo do CLAUDE.md.
- **O Ondas e Óptica** (11/11): 7 exercícios cada.
- **C Eletricidade e Magnetismo** (20/20): de 7 a 16 por tema (C07 16; C04 11; C01, C02, C03, C03b, C11, C14 10; os outros 7 a 9).
- **M Física Moderna** (8/8), **U Universitária** (6/6), **N Navier–Stokes** (7/7): 7 exercícios cada.
- **X Bônus**: X01 (3 exercícios, sem chefão). **S Simulados**: S02 com 15 questões do IME; S00, S01, S03 e S04 só com a página de entrada.

### Outras abas
- **Cálculo** (vai para Matemática): 27/27 temas, 7 exercícios cada; Simulados de Cálculo SC01 e SC02 com 20 questões cada.
- **Experimentos**: 18 experimentos (EP01–EP18) em 9 módulos (novos na β 3.4: Termodinâmica, Ondas e quântica, Nuclear, Fluidos).
- **Experimental**: 0 de 11 (módulos FE criados, sem conteúdo).
- Tela inicial (Jarvis) em `#/home`: Física pronta; Química, Matemática e Russo "em breve".
- Calculadoras 1 (estilo fx-991ES PLUS) e 2 (estilo fx-82LA CW), uma de cada vez.
- Testes automáticos agora no repositório, em `tests/` (antes ficavam só na pasta temporária da sessão); capturas em `tests/capturas/` (fora do git).

### Diferenças em relação ao padrão do CLAUDE.md (honesto)
- Exercícios: o padrão pede 15 a 20. A Mecânica tem 12 a 14; os módulos antigos, 7 (o C, de 7 a 16).
- "Chuta antes de ver" (`F.chute`): os módulos C e T usam. A Mecânica e os outros ainda não têm.
- Figuras: nem todo exercício da Mecânica tem figura (todos os exemplos têm).

### Dívida técnica (pedido do Lucas em 14/11/2026: resolver depois da Termodinâmica)
- [ ] **Mecânica** (A01–A20): subir de 12–14 para 15–20 exercícios por tema; pôr figura nos exercícios que não têm; acrescentar o `F.chute` ("chuta antes de ver") em todos os temas.
- [ ] **Demais módulos** (F, O, C, M, U, N e Cálculo): subir de 7 para 15–20 exercícios por tema (o C já tem de 7 a 16).
- Regra a partir de agora: tema novo já nasce no padrão completo (15–20 exercícios, figura em todo exercício, `F.chute`).

### O que ainda falta na Física (ordem de prioridade do Lucas)
1. [x] **Mecânica**: temas escritos (A01–A20). Falta completar até o padrão (ver dívida técnica).
2. [x] **Termodinâmica**: T01–T08b escritos no padrão completo (β 3.3).
3. **Aba Experimental**: o capítulo de teoria da física experimental inteiro: medida e erro, algarismos significativos, precisão × acurácia, erro estatístico × sistemático, desvio padrão e desvio da média, propagação de incerteza pela derivada logarítmica (o método do professor do Lucas), ajuste de reta e mínimos quadrados, linearização de gráficos, como escrever um relatório e como comparar um resultado com o valor de referência.
4. [x] **Experimentos físicos**: os 8 que faltavam foram feitos na β 3.4 (EP11–EP18), mais a surpresa escondida.

### Pendências combinadas (fora da Física)
- Documento do modelo de dados de várias matérias (prefixos `fis:`, `mat:`, `qui:`; migração; registro de acerto e erro além de ● X /): mostrar ao Lucas para aprovar antes de implementar. Rascunho em `docs/MODELO_DE_DADOS.md`.
- Mover o Cálculo da Física para a Matemática numa branch de teste, com o progresso exportado antes.
- Ativar o GitHub Pages (bloqueado nesta sessão; o Lucas liga à mão em Settings → Pages).
- Versão de celular: só no fim.

### Decisões de hoje (14/11/2026), todas registradas no CLAUDE.md
- Criado o `CLAUDE.md` com perfil, jeito de falar, projeto, padrão de tema, estilo, qualidade, o que não fazer, pendências e a regra de manter CLAUDE.md e PROGRESSO.md sempre atualizados.
- Estrutura das matérias: Física (Física, Cálculo → sai, Experimentos, Experimental); Matemática (Matemática, Cálculo, Olimpíada e demonstrações); Química (Química, Experimentos); Russo (Gramática, Leitura e tradução; vocabulário no Anki, o site exporta baralho).
- Depois de tudo: portal com progresso geral, mapa de erros e busca única; mais tarde, programa à parte com a API.
- No mapa de erros, separar erro de conteúdo, conta na pressa e interpretação/pegadinha.
- Não implementar: XP/grau de feiticeiro, repetição espaçada de russo no site. Celular só no fim.
- Faltam 8 experimentos (não 5).

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

- **β 2.3** — Aba **Experimental** e módulo **Teoremas** (Cálculo).
  - Nova aba "± Experimental" no topo, à direita de Experimentos. Página inicial com uma calculadorazinha animada: as teclas acendem uma a uma e o resultado aparece no visor (g = 4π²ℓ/T² com o pêndulo do Lucas: 9,387178522; e √(0,02² + 0,03²) = 0,036055512).
  - Módulos criados, ainda **sem conteúdo** (temas a decidir com o Lucas): Medidas e incertezas (FE01–FE05), Gráficos e ajustes (FE06–FE09, com log-log), Relatório e erros (FE10–FE11).
  - **Teoremas** (Cálculo, letra ∴), completos, cada um com laboratório novo (`assets/sims/teoremas.js`), exemplário, 7 exercícios e chefão:
    - **TE01 Hamilton e Euler–Lagrange**: cálculo das variações com a dedução, lema fundamental, Beltrami, Fermat → Snell, catenária. Laboratório: corrida de 4 curvas (reta, parábola, arco, cicloide). Chefão: a braquistócrona de Bernoulli.
    - **TE02 Divergência**: enunciado, Gauss, continuidade, empuxo de Arquimedes, volume pela casca. Laboratório: as caixinhas cujos fluxos internos se cancelam. Chefão: a demonstração para uma região simples.
    - **TE03 Pappus–Guldin**: os dois teoremas demonstrados, toro, cone, centroides ao contrário. Laboratório: volume por Pappus × somando fatias. Chefão: anel de seção triangular.
    - **TE04 Stokes**: enunciado, ideia da prova, Faraday, Ampère, campos conservativos, o campo com furo. Laboratório: o mesmo fluxo do rotacional por qualquer "chapéu". Chefão: por que a superfície não importa.
    - **TE05 Noether**: enunciado e demonstração, tabela simetria → conservada, momento canônico com campo magnético, hélice. Laboratório: E, L e pₓ em 4 potenciais. Chefão: a prova e a energia de um oscilador com k(t).
  - Conferências: números em Python; laboratórios contra fórmulas independentes (cicloide 1,0030 s × reta 1,1890 s; arco de circunferência conferido com scipy; Pappus = fatias; circulação = fluxo para qualquer h; Noether: o que se conserva em cada potencial). Corrigido durante o teste: o arco de circunferência ia pela metade de cima do círculo (tempo absurdo) e a integral de superfície da TE04 tinha erro na 4ª casa.
  - Regressão: 141 páginas, 0 katex-error, 0 erro de JS, 981 links; 47 testes de funcionamento; calculadora 88 de 88.

- **β 2.4** — Calculadora "de livro", Ondas completas e o começo de Navier–Stokes.
  - **Calculadora corrigida** (bugs relatados pelo Lucas):
    - A entrada agora é "de livro" (MathIO), com **casinhas**: a fração tem numerador e denominador, a ∫ tem os limites de baixo e de cima, e Σ, d/dx, logₐb, ˣ√, 10ˣ, eˣ, |x| e a fração mista também têm casinhas.
    - ◀ ▶ andam pelas casinhas na ordem de digitação; **▲ ▼ sobem e descem** (numerador ↔ denominador, limites da ∫ e da Σ). Antes, as setas ▲▼ puxavam o histórico e apagavam a conta. Agora o histórico só vem depois de um resultado (ou com o visor vazio), e ▲▼ seguidos andam por ele.
    - Fração pela tecla primeiro (▭/▭ 1 ▼ 3) ou com o número antes (1 ▭/▭ 3); fração ÷ fração; fração dentro de fração; DEL apaga molde vazio.
    - 103 testes tecla por tecla (14 novos só para esses casos), todos ok.
  - **Ondas (O01–O04)**, escritas do zero com as minhas palavras (o Halliday vol. 2 ainda não chegou), cada uma com laboratório (`assets/sims/ondas.js`), exemplário, 7 exercícios e chefão:
    - O01 Introdução (corda: transversal, longitudinal, pulso com reflexão; chefão: v = √(T/μ) por Newton e pela "lombada");
    - O02 Fenômenos (cuba de ondas com duas fontes e linhas nodais; chefão: antena direcional);
    - O03 Estacionárias (corda e tubos aberto/fechado com nós e ventres; chefão: onde pinçar a corda e o timbre);
    - O04 Acústica e Doppler (frentes de onda e cone de Mach; chefão: radar da polícia).
  - **Navier–Stokes (N01–N04)**, com laboratórios (`assets/sims/fluidos.js`):
    - N01 Euler × Lagrange e derivada material (partícula × sensor parado);
    - N02 Continuidade (bocal com contagem de partículas);
    - N03 Euler e Bernoulli (tanque de Torricelli esvaziando e tubo de Venturi; chefão: tempo de esvaziar);
    - N04 Tensor de tensões e viscosidade (elemento de fluido: deformação × rotação; chefão: por que σ é simétrico).
  - Corrigido também: a busca do menu abria módulos que ficavam gravados como abertos; agora, ao limpar a busca, o menu volta como estava.
  - Conferências: números em Python; 19 conferências novas de física nos laboratórios de Ondas e Fluidos; regressão: 141 páginas, 0 katex-error, 0 erro de JS, 1068 links, estresse limpo em 89 páginas, 47 testes de funcionamento.

- **β 2.5** — Navier–Stokes completo, Simulados de Cálculo e o IME de física.
  - **Navier–Stokes (N05–N07)**, cada um com laboratório (`assets/sims/fluidos.js`), exemplário, 7 exercícios e chefão:
    - N05 Dedução de Navier–Stokes (Cauchy + tensor viscoso; laboratório: placa que parte de repente, u = U·erfc(y/2√(νt)); chefão: o 1º problema de Stokes);
    - N06 Couette, Poiseuille, Hagen–Poiseuille (laboratório: perfis entre placas e num cano, com vazão, tensões e "fluido voltando"; chefão: Hagen–Poiseuille a partir de Navier–Stokes);
    - N07 Reynolds, turbulência e o Problema do Milênio (laboratório: o experimento de Reynolds com Re, regime e fator de atrito; chefão: a cascata de Kolmogorov).
  - **Simulados de Cálculo** (módulo novo K5, cor rosa, na aba Cálculo):
    - SC01 MIT Integration Bee 2026, classificatória: as 20 integrais com dicas e resolução;
    - SC02 USP MAT 111 (Cálculo I), Prova 1 tipo C de 2015 (prof. Piccione): as 20 questões a–e com resolução e "por que a errada é tentadora".
    - Gabaritos: os arquivos não traziam gabarito, então as respostas são minhas, conferidas em Python (integrais numéricas, derivada da primitiva, limites, desigualdades numa grade).
  - **IME 2026/27, questões 16–30 (física)** em S02 Vestibulares militares: enunciados transcritos, figuras recortadas da prova (`assets/img/ime2027/`), alternativas, dicas e resolução. Respostas minhas, conferidas em Python, **não comparadas com o gabarito oficial** (está avisado na página). Q25 resolvida pela simetria (R₁ = 11R/20, R₂ = 3R/4) e conferida pela matriz de Kirchhoff.
  - Selos novos: IME, MIT, USP. Formatador novo `F.sigL` (sem zeros à direita: 3 × 10⁻⁵ em vez de 3,0 × 10⁻⁵).
  - Corrigido no teste: a vazão do canal (N06) aparecia em "cm²/s" com o número em mm²/s.
  - Site da SBF (repositório de aulas de ensino superior): o acesso foi liberado no ambiente "site-fisica", mas a leitura foi bloqueada pela checagem automática de permissões da sessão. Nada dele entrou no site.
  - Conferências: 15 novas (laboratórios N05–N07, figuras e numeração do IME, contagem dos simulados); regressão: 143 páginas, 0 katex-error, 0 erro de JS, 1135 links; testes de funcionamento sem falhas; calculadora 103/103; física 118 + 32 + 19.

- **β 2.6** — Módulo F inteiro e o experimento dos dois discos.
  - **Fundamentos e a matemática do físico (F01–F05 e A19)**, cada um com laboratório (`assets/sims/fundamentos.js`), exemplário, 7 exercícios e chefão:
    - F01 Fundamentos de Mecânica (laboratório: bola jogada num trem, vista de dentro e da plataforma; chefão: a mosca entre os trens);
    - F02 Vetores (laboratório: soma, diferença, produto escalar e vetorial; chefão: o hexágono e a soma de cinco vetores);
    - F03 Trigonometria para física (laboratório: círculo trigonométrico e senoides; chefão: alcance máximo num plano inclinado);
    - F04 Derivada e integral para física (laboratório: tangente = velocidade, área = deslocamento; chefão: as equações do movimento por integração);
    - F05 Séries, aproximações e ordens de grandeza (laboratório: polinômios de Taylor e raio de convergência; chefão: o campo do dipolo de longe);
    - A19 Análise dimensional (laboratório: descobridor de fórmulas por sistema linear e a bola de fogo de Taylor; chefão: o que a análise dimensional não diz, teorema Π).
  - **EP10 Dois discos rolando ligados por molas** (o vídeo do TikTok @_ctnbeh_ que o Lucas mandou), classificado no módulo **Mola** dos Experimentos (é um oscilador de 2 graus de liberdade com modos normais, como o EP08):
    - dedução passo a passo da equação do vídeo pela lagrangiana (o 3/2 vem do momento de inércia em relação ao ponto de contato; K vem das molas horizontais nas alturas r₁ + a e r₂ − b);
    - conferido com sympy: a matriz das derivadas segundas da energia exata das molas é exatamente a K do vídeo;
    - modos normais: ω = 0 (o conjunto "anda", daí as colisões sem fim) e ω = √(κ(1/A + 1/B));
    - laboratório com o modelo exato (não linear) e o linearizado, colisões elásticas com rolamento mantido, contador de colisões e energia conservada;
    - avisado o que a equação do vídeo deixa de fora: o termo Ṁq̇ da massa variando, ângulos grandes, e que as molas do desenho estão em outra posição.
  - Corrigido antes de entregar: um erro meu no exercício 1 do F02 (3 N e 4 N a 60° dão √37 ≈ 6,1 N, não 7).
  - Conferências: 19 novas (6 laboratórios do F e 6 do EP10, incluindo energia conservada com 32 colisões e período medido = 2π/ω); regressão: 144 páginas, 0 katex-error, 0 erro de JS, 1211 links; testes de funcionamento sem falhas; calculadora 103/103; física 118 + 32 + 19 + 15.

- **β 2.7** — Calculadora 2, no estilo da Casio fx-82LA CW (ClassWiz).
  - Nas configurações agora há duas calculadoras, com interruptores separados, e **só uma fica ligada por vez** (ligar uma desliga a outra; vale também ao recarregar a página). As duas aparecem no canto inferior esquerdo com a mesma animação.
  - **Calculadora 2** (`assets/calc2.js`): corpo preto, teclas redondas na ordem da fx-82LA CW, SHIFT azul com as funções escritas em cima, vírgula decimal.
    - Teclas de sistema: ON, HOME, CONFIG, ↶ (voltar), setas com OK, rolar página (⇑⇓), VARIABLE, FUNCTION, CATALOG, TOOLS, FORMAT.
    - HOME com os 4 apps: **Calcular**, **Estatística** (1-Variável e y=a+bx, com x̄, σx, sx, quartis, a, b, r), **Tabela** (f(x) e g(x), início/fim/passo) e **Caixa Matemática** (lançar 1–3 dados ou moedas, até 250 vezes, com frequência relativa).
    - Entrada "de livro" (fração, fração mista, √, ⁿ√, potência, log de base, ×10^▭); Entrada/Saída Matem./Matem., Matem./Decimal, Linear/Linear e Linear/Decimal.
    - FORMAT: padrão, decimal, fração imprópria, fração mista, engenharia, sexagesimal e fatoração em primos. SHIFT EXE (≈) dá o decimal; SHIFT Ans (Simp) simplifica uma fração um fator por vez.
    - VARIABLE (A–F, x, y, z: recuperar e armazenar Ans), FUNCTION (definir e usar f(x) e g(x), as mesmas da Tabela), CATALOG (funções, probabilidade, MDC, MMC, Int, Intg, Rnd, %, ÷R, ângulos, Pol, Rec, hiperbólicas), ÷R (quociente e resto), "=" para conferir igualdades (Verdadeiro/Falso).
    - O que não tem no site: QR Code (a tecla avisa).
  - As contas usam o mesmo motor da calculadora 1 (o `calc.js` agora expõe o motor e aceita outro estado), com funções novas: MDC, MMC, Int, Intg, ÷R, f( e g(.
  - Conferências: 41 testes tecla por tecla na calculadora 2 (contas exatas, FORMAT, Simp, variáveis, funções, Estatística, Tabela, Caixa, OFF/ON, uma calculadora por vez), calculadora 1 103/103, regressão do site: 144 páginas, 0 katex-error, 0 erro de JS.

- **β 2.8** — Calculadoras cabendo na tela.
  - Problema relatado pelo Lucas: a calculadora 2 ficou grande demais e não dava para fechar. Ela tinha 751 px de altura; em tela de notebook (720 px ou menos de área útil), a aba de fechar ficava acima do topo da tela.
  - Calculadora 2 mais compacta (751 → 663 px): visor, teclas e espaçamentos menores.
  - As duas calculadoras agora encolhem sozinhas para caber na altura da janela (e reajustam quando a janela muda de tamanho), então a aba fica sempre visível.
  - Botão ✕ de fechar dentro das duas calculadoras, além da aba.
  - Testado em 1280×950, 1366×768, 1366×657, 1280×600 e 1280×520: aba visível, ✕ fecha, aba abre e fecha. Calculadora 2: 41/41; calculadora 1: 103/103.

- **β 2.9** — Tela inicial do projeto (Jarvis).
  - Antes de tudo, o documento `docs/MODELO_DE_DADOS.md`: uma página só com rotas no hash, palavras reservadas, registro das matérias, códigos únicos no projeto (a química não pode usar "C"), prefixos do `localStorage` (`fisica:` continua; `jarvis:` reservado; um prefixo por matéria nova) e o plano do mapa de erros (`resultado:COD-n`, ainda não feito). Não havia conflito com a tela inicial, mas a decisão de como registrar e rotear as matérias é a mesma, então o documento veio primeiro.
  - **Tela inicial** (`#/home`, e também quando abre sem hash), desenhada a partir do esboço do Lucas:
    - título "Jarvis" e um globo de arame girando com um anel em órbita;
    - um botão grande por matéria, lidos de `assets/materias.js`: Física leva para o site de física (`#/inicio`) sem mudar nada dentro dele; Química, Matemática e Russo aparecem desativados, com "em breve";
    - campo "Perguntar algo ao Jarvis…" só com o visual, desativado, com "em breve".
  - Acrescentar uma matéria = acrescentar um objeto em `assets/materias.js`. Uma matéria registrada que ainda não existe abre uma página "em breve" (por exemplo `#/quimica/inicio`), nunca uma tela em branco; `#/fisica` leva para `#/inicio`.
  - Faixa do topo do site de física: botão **Home** (casinha) antes do átomo da Física, que volta para a tela inicial. O resto da faixa ficou igual.
  - Tudo continua num `index.html` só, então o progresso fica no mesmo `localStorage` (testado: a marcação de um exercício sobrevive à ida e volta pela tela inicial).
  - Nome do projeto: o site passou a se chamar **Jarvis** (título da aba do navegador, selo de versão na faixa do topo e README). O site de física continua o mesmo por dentro.
  - Conferências: 13 testes novos da tela inicial; regressão completa sem falhas (144 páginas, funcionamento, calculadoras 103/103 e 41/41, física).

- **β 3.0** — Ajustes na tela inicial (pedidos do Lucas).
  - Tirado o texto "meu sistema de estudo" embaixo de Jarvis.
  - **Planeta parava de girar** ao voltar para a tela inicial (da Física, de um tema ou de outra aba do navegador). Causa: a animação era SMIL (animação dentro do SVG), que no Chrome não recomeça quando o desenho é recolocado na página. Agora é animação quadro a quadro em JavaScript (requestAnimationFrame), que para sozinha quando a tela inicial sai e recomeça quando volta.
  - **Cor do Jarvis**: passando o mouse no título (ou tocando, no celular) aparece um controle de cor do vermelho ao lilás. O planeta e o degradê do título mudam juntos, com três tons vizinhos da cor escolhida. Botão "voltar à cor original" volta ao degradê de antes. A cor fica salva em `jarvis:cor` (o prefixo reservado para a tela inicial no modelo de dados).
  - Conferências: 13 testes novos (giro depois de voltar de cada jeito, seletor aparece e some, cores mudam juntas, cor salva, voltar à original, celular) e os 13 da tela inicial.

- **β 3.1** — Mecânica: os 7 primeiros temas (A01–A07), feitos sozinho enquanto o Lucas estava fora.
  - Não existe CLAUDE.md ainda e nenhum tema da Mecânica estava escrito; o padrão seguido foi o dos temas prontos do mesmo nível (F01–F05, N03): abertura, teoria com teoremas demonstrados passo a passo, laboratório, exemplário com 3 casos (fácil, médio, olimpíada) com figura, as 4 caixas (Pense como físico, Pegadinha, Nível olimpíada, Ponte para a universidade), folha de fórmulas, 12 a 14 exercícios e chefão Impossível 99 com dicas em degraus.
  - **Temas**:
    - A01 Introdução à Cinemática (deslocamento × distância, média aritmética × harmônica com demonstração, classificação dos movimentos; chefão: metades sem fim, v̄ = v(2r − 1)/r);
    - A02 MRU (função horária, gráficos, encontro e velocidade relativa, corpos extensos; olimpíada: os ônibus e o pedestre; chefão: as formigas do triângulo, conferido por simulação);
    - A03 MUV (funções horárias pela área, Torricelli, velocidade média no MUV, regra de Galileu 1:3:5, queda livre, freada; chefão: zona de dilema do sinal amarelo);
    - A04 Análise Gráfica (secante, tangente, concavidade, as três áreas; olimpíada: a "elipse" disfarçada de semicírculo; chefão: perseguição só pelo gráfico);
    - A05 Cinemática Vetorial (velocidade tangente, composição de velocidades, aceleração tangencial e centrípeta com a demonstração de v²/R; chefão: barco mais lento que a correnteza, deriva mínima L√(w² − u²)/u);
    - A06 Lançamentos (independência, horizontal, oblíquo, trajetória parabólica, equação em tg θ; chefão: velocidade mínima para passar por cima de um muro e parábola de segurança);
    - A07 Movimento Circular (grandezas angulares, v = ωR, MCU e MCUV, transmissão por correia/engrenagem/eixo; olimpíada: ponteiros do relógio; chefão: período sinódico, Lua e Marte).
  - **Laboratórios** (`assets/sims/mecanica.js`): vai e volta, encontro de dois carros com gráfico, MUV com gráficos e freada, do gráfico v × t para s × t e a × t, barco no rio, lançamento oblíquo com parábola de segurança, MCU e engrenagens.
  - **Correção automática nos exercícios**: o `F.exercicio` ganhou campos opcionais (não é componente novo; os exercícios antigos não mudam): `certa` (alternativas clicáveis), `num: {v, tol, un}` (campo numérico com tolerância, aceita vírgula ou ponto e 3,2e5) e `nivel` ("Físico" ou "Máximo"). A primeira tentativa fica em `resultado:COD-n`, o começo do mapa de erros previsto no modelo de dados (seção 6).
  - Kit de desenho: `D.carro`, `D.estrada`, `D.graf` e `D.amostra` (figuras dos exemplos e exercícios). Formatador `F.nt` (número limpo em texto comum).
  - Todos os números conferidos em Python (os chefões das formigas, do barco e do muro também por simulação ou busca numérica).
  - Corrigido antes de entregar: números sorteados aparecendo como "2{,}5" em texto comum (5 temas) e a correção lendo "1.333" como 1333 (agora um ponto sozinho é decimal; "1.000.000" e "1.234,5" são milhar).
  - Faltam na Mecânica: A08–A18 e A20 (14 temas).
- **β 3.2** — **Mecânica completa** (A08–A20, os 14 temas que faltavam), feita sozinho enquanto o Lucas estava fora, no mesmo padrão da β 3.1: abertura, teoria com 3 teoremas demonstrados passo a passo, laboratório, exemplário com 3 casos sorteáveis (fácil, médio, olimpíada) com figura, as 4 caixas, folha de fórmulas, 12 ou 13 exercícios com correção automática e nível (Físico/Máximo) e chefão Impossível 99 com dicas em degraus e solução escondida.
  - **Temas** (laboratório; chefão):
    - A08 Leis de Newton (Atwood e elevador; cunha acelerada, A = g tg θ);
    - A09 Atrito e Resistência do Ar (plano inclinado com atrito; caixa solta na carroceria do caminhão);
    - A10 Dinâmica do Movimento Circular (carro na curva plana ou inclinada; conta no aro girando, cos θ = g/(ω²R));
    - A11 Trabalho e Energia (pista de skate com as três barras de energia; bloco que escorrega do hemisfério, cos θ = 2/3);
    - A12 Impulso e Quantidade de Movimento (gráfico F × t com tempo de contato; corrente caindo na balança marca 3λgx);
    - A12b Centro de Massa (pessoa andando no barco; pilha de blocos com balanço harmônico, 31 blocos para 2L);
    - A13 Colisões (colisão 1D com coeficiente de restituição; torre de bolas, 9h e 49h);
    - A14a Rotação e Corpo Rígido (corrida de rolamento de esfera, disco, esfera oca e anel; bola de boliche que passa a rolar, 5v₀/7 e centro de percussão 2R/5);
    - A14 Equilíbrio de Corpo Extenso (gangorra; até onde subir na escada, 3,70 m);
    - A15 Leis de Kepler (órbita com setores de áreas iguais pela equação de Kepler; transferência de Hohmann para Marte, 259 dias e janela de 780 dias);
    - A16 Gravitação (canhão de Newton: queda, órbita, escape; túnel pela Terra, 42 min);
    - A17 Hidrostática (bloco num dinamômetro mergulhando; pedra jogada do barco e gelo derretendo);
    - A18 Hidrodinâmica (jato de Torricelli com alcance máximo em H/2; tempo para esvaziar a caixa d'água e clepsidra, r ∝ H^(1/4));
    - A20 MHS e oscilações (massa–mola com amortecimento e gráfico x × t; pêndulo de amplitude grande, período exato pela integral elíptica e correção θ₀²/16).
  - **Laboratórios novos** em `assets/sims/mecanica.js`: Atwood e elevador, plano com atrito, curva, pista de skate, impulso, barco e CM, colisão 1D, rolamento, gangorra, órbita, canhão, empuxo, Torricelli e massa–mola (14).
  - Todos os números conferidos em Python antes de escrever; os chefões também por simulação ou integração numérica (corrente na balança com 200 000 elos, bola de boliche, esvaziamento do tanque, período exato do pêndulo).
  - Corrigido antes de entregar: resposta errada no ex. 10 do A12b (semidisco: estava 9,5 cm, o certo é 4R/(3π) ≈ 12,7 cm); a pista de skate do A11 travava no ponto de retorno e a energia sem atrito não fechava (agora 2789 J constantes); elipse do laboratório de Kepler estourava a altura; a energia do massa–mola variava 0,5% (troquei o integrador por Verlet); o tubo em U do A17 estava desenhado com a água abaixo da superfície de separação; rótulos sobrepostos (gangorra, rolamento, impulso); link para um tema que não existe (R01 → C18).
  - Honesto: nos temas novos, nem todo exercício tem figura (2 a 7 figuras por tema, contando os exemplos); as contas estão todas conferidas, mas é bom o Lucas dar uma olhada no estilo dos chefões.

- **β 3.3** — **Termodinâmica completa** (T01–T08b, os 11 temas), já no padrão completo do CLAUDE.md: abertura com "chuta antes de ver" (`F.chute`), laboratório, 3 teoremas demonstrados, 3 exemplos sorteáveis com figura, as 4 caixas, folha de fórmulas, **16 exercícios por tema, todos com figura**, correção automática e nível, chefão com dicas em degraus.
  - **Temas** (laboratório; chefão): T01 Temperatura (quatro termômetros com escala inventada; termômetro de platina não linear); T02 Propagação do Calor (parede de duas camadas com perfil de temperatura; gelo crescendo no lago, x ∝ √t); T03 Dilatometria (chapa com furo e lâmina bimetálica; curvatura da lâmina, com a comparação honesta com a teoria de Timoshenko); T04 Calorimetria (calorímetro água + gelo com o teste "derrete tudo?"; cubos de gelo na limonada); T04b Calorimetria aprofundamento (curva de aquecimento com perdas de Newton; leite antes ou depois no café); T05 Gases (gás ideal com diagrama p × V e modos isotérmico/isobárico/isocórico; balão de ar quente); T05b Teoria Cinética (gás de discos 2D com colisões, histograma de Maxwell e pressão medida nas paredes; atmosfera isotérmica); T06 Lei Zero (dois corpos em contato com τ; termômetro atrasado num forno que esquenta); T07 1ª Lei (os quatro processos com W, Q e ΔU; gradiente adiabático da atmosfera); T08 2ª Lei (ciclo de Carnot com fluxo de energia; motor entre dois corpos finitos, √(T₁T₂)); T08b Entropia (microestados de Boltzmann; mistura de água quente e fria).
  - Arquivos novos: `assets/sims/termo.js` (11 laboratórios); peças de desenho `D.bloco`, `D.termo`, `D.chama`, `D.pistao`, `D.copo` em `assets/desenho.js`. `tests/tmec.js` agora também conta `F.chute` e exercícios sem figura.
  - Todas as contas conferidas em Python antes de escrever; chefões também por simulação ou integração numérica (gelo no lago, termômetro atrasado, motor entre corpos finitos com milhares de ciclos de Carnot pequenos, raiz numérica no termômetro de platina do T01).
  - Corrigido antes de entregar: fórmulas quebradas em alternativas do T05b (faltava `String.raw`); escala errada do gráfico de radiação linearizada (T02) e da curva do aquecedor (T04b); ciclo de Carnot desenhado com volumes errados (T08); a pressão medida no laboratório do T05b dava ~10% acima da teoria ideal, o que é física de verdade (as moléculas têm tamanho): o laboratório agora mostra também a previsão descontando a área ocupada, e as duas batem.
  - Física: 96 de 96 temas escritos.
- **β 3.4** — Experimentos novos (EP11–EP18) e versão ao lado do nome na tela inicial.
  - Tela inicial: a versão aparece ao lado de "Jarvis", dentro do título, com o mesmo degradê (muda de cor junto) e o conjunto centralizado.
  - Os códigos EP07–EP10 já existiam (bolinha no fio, duas massas, bloco com pêndulo, discos); os 8 novos são EP11–EP18, em módulos novos: Termodinâmica (EP11–EP13), Ondas e quântica (EP14, EP15, EP17), Nuclear (EP16) e Fluidos (EP18).
  - `tests/texp.js`: teste rápido das páginas de experimento (fórmulas, erros de JS, laboratório montado e animando).
  - Experimentos prontos:
    - EP11 Máquina de Carnot: ciclo se desenhando no diagrama p × V (eixos em escala log, cada etapa de uma cor), pistão com a cor da temperatura do gás, fonte quente/fria/isolante embaixo, setas de calor, barras de rendimento. O "motor real" é o modelo endorreversível de Curzon–Ahlborn (troca de calor com condutância finita, na potência máxima) com 10% de atrito: rende sempre menos que 1 − T_f/T_q e mostra a entropia gerada por ciclo.
    - EP12 Demônio de Maxwell: duas caixas com partículas rápidas (vermelhas) e lentas (azuis), portinha que se abre segurando um botão (ou espaço) e modo demônio automático; temperatura de cada lado, ΔS do gás (gás ideal 2D), custo de informação k·ln 2 por bit (1 por partícula deixada passar + 1 por abertura inútil) e barra do total, que fica ≥ 0. Conferido numa simulação sem tela. Simplificação: as partículas não colidem entre si.
    - EP13 Gás de van der Waals: isotermas com controles de a, b e T/T_c, quatro gases prontos (CO₂, água, N₂, hélio), construção de Maxwell com as duas áreas iguais sombreadas, domo de coexistência, ponto crítico, pistão comprimindo e expandindo com o líquido aparecendo (regra da alavanca) e botão para sobrepor a isoterma do gás ideal. A pressão de vapor do laboratório confere com o Python (CO₂: 32,2 / 52,8 / 70,2 bar a 250 / 280 / 300 K; 0,647 p_c a 0,9 T_c). As contas pesadas só são refeitas quando um controle muda (60 quadros por segundo).
    - EP14 Fenda dupla: ondas saindo das fendas, tela com franjas na cor do comprimento de onda, curva de intensidade (interferência × difração de cada fenda), marcas de y = mλL/d ao lado da tela; modo "um fóton por vez" com pontos sorteados pela probabilidade I(y), começando devagar e acelerando, e histograma por cima da curva. Conferido no código: os máximos caem em mλL/d (2,18 mm contra 2,20 mm da fórmula, por causa do envelope de difração; dito na explicação).
    - EP15 Radiação de corpo negro: curva de Planck com controle de temperatura (e atalhos brasa, lâmpada, Sol, estrela azul), pico marcado pela lei de Wien, área sombreada comparada com σT⁴ por integral numérica feita ao vivo (razão 1,00000 de 300 a 12 000 K), curva de Rayleigh–Jeans explodindo nos comprimentos curtos, faixa do visível, cor aparente do corpo e fótons saindo com a cor sorteada pelo espectro.
    - EP16 Fissão e fusão: reação em cadeia por gerações (cada nêutron causa fissão com chance k/2,5; cada fissão solta 2 ou 3), com flashes das fissões, nêutrons voando, atalhos subcrítico/crítico/supercrítico e gráfico do número de nêutrons em escala log; ao lado, a curva da energia de ligação por núcleon (fórmula semiempírica) com pontos medidos e as setas de fissão e fusão. Conferido em Python: 173 MeV na fissão do U-235 e 17,6 MeV na fusão D-T.
    - EP17 O gato de Schrödinger (de brincadeira): gato original desenhado em SVG (peça reaproveitável `window.GATO`), caixa fechada com o gato acordado e o dormindo sobrepostos, cada um com transparência igual à probabilidade real (2^(−t/T½), oscilando de leve), átomo e barra da chance de decaimento, gráfico da probabilidade; "abrir a caixa" sorteia e colapsa com um flash: acordado (rabo balançando, espreguiçando) ou dormindo (zzz e estrelinhas). Contador de aberturas, obtido × esperado e histórico. Caixa explicando que Schrödinger propôs o gato em 1935 como crítica à interpretação de Copenhague. Conferido: em 20 000 aberturas simuladas, 9443 "acordado" contra 9459 esperados.
    - EP18 Escoamento ao redor de um cilindro: lattice Boltzmann D2Q9 (BGK) numa grade de 200 × 80, rodando no navegador a 60 quadros por segundo (o programa mede quantos passos cabem em ~11 ms por quadro). Mostra vorticidade ou velocidade, filetes de tinta, regime esperado para cada Re, Strouhal medido e o de laboratório. Conferido fora do navegador: Re 40 sem desprendimento, Re 60 com desprendimento (o início clássico é ≈ 47); Strouhal ~20% acima do de laboratório, por causa do canal estreito e da grade grossa (dito na página). Mais simples do que o pedido: é 2D, então acima de Re ≈ 190 não vira turbulência de verdade (só fica mais irregular), e isso está explicado na página.
  - **Surpresa escondida** (pedido do Lucas; NUNCA revelar em texto do site): na página inicial dos Experimentos, encostar o cursor na bolinha verde (a ponta) do pêndulo duplo, com tolerância pequena (8 unidades do desenho, a bolinha tem raio 10). Aparece um buraco negro com disco de acreção girando e raios de luz se curvando (desvio ∝ 1/b, com leve distorção por filtro SVG); o pêndulo é puxado espiralando e esticado na direção radial; depois sai o gato do EP17, que cai de pé e se espreguiça. Clicar no gato leva ao EP17; depois de ~11 s, ou clicando fora (depois que o gato saiu), tudo volta ao normal. A descoberta fica em `fisica:segredo:x` e aparece uma estrelinha discreta no canto da animação, sem texto. Desligada para quem pede "movimento reduzido". Teste: `tests/tsegredo.js`.
  - Relatório honesto do que ficou mais simples do que o pedido:
    - EP12: as partículas não colidem entre si (para ficar leve); o custo de informação conta 1 bit por partícula que passa e 1 por abertura inútil.
    - EP14: as ondas desenhadas saindo das fendas são ilustrativas (comprimento de onda e separação fora de escala); a figura na tela e as marcas da fórmula são as contas reais.
    - EP16: a reação em cadeia é por gerações (não simula a geometria nem a velocidade dos nêutrons); a curva de energia de ligação é a fórmula semiempírica, que erra os núcleos leves (os pontos medidos estão no gráfico para comparar).
    - EP18: é 2D, então acima de Re ≈ 190 não vira turbulência de verdade (só uma esteira mais irregular); o Strouhal medido sai ~20% acima do de laboratório (canal estreito e grade grossa). Tudo isso está escrito na página do experimento.
    - Os códigos pedidos como EP07–EP14 viraram EP11–EP18, porque EP07–EP10 já existiam.
- **β 3.5** — **Aba Experimental completa** (FE01–FE11), no padrão completo do CLAUDE.md.
  - Kit de desenho: `D.graf` aceita barras de erro (`erros`, opcional); peças novas `D.regua`, `D.lupaRegua` e `D.alvo`. Simulações em `assets/sims/experimental.js`.
  - Temas prontos:
    - FE01 O que é medir: unidades e algarismos significativos (16 exercícios com figura, chute; lab: ler uma barra com réguas de 1 cm, 0,5 cm e 1 mm, com lupa e correção da leitura; chefão: massa de um grão de arroz pela técnica das medidas múltiplas).
    - FE02 O que é incerteza, tipo A e tipo B (16 exercícios com figura, chute; lab: jogo do cronômetro na mão, que separa o atraso médio, o espalhamento (tipo A) e a resolução (tipo B); chefão: medir g com cronômetro manual, quanto cada melhoria ajuda).
    - FE03 Média, desvio padrão e incerteza da média (16 exercícios com figura, chute; lab: experimentos com N medidas sorteadas, histograma, média, σ e σ/√N, e contador de quantos intervalos contêm o valor verdadeiro, conferido por simulação: 50% com N = 2, 66% com N = 10, 68% com N grande; chefão: até quando vale a pena repetir, com o piso da incerteza tipo B).
    - FE04 Propagação de incertezas (16 exercícios com figura, chute; método principal: derivada logarítmica somando as relativas com o módulo dos expoentes, como o professor do Lucas; quadratura como alternativa; lab: barras de contribuição de cada medida para g = 4π²L/T², densidade de esfera e velocidade média; chefão: orçamento de incerteza do pêndulo e o erro sistemático de medir L até o gancho).
    - - FE05 Comparando resultados: desvio percentual × discrepância em unidades de Δ, critério 2Δ/3Δ, diferença de duas medidas (Δa + Δb), média ponderada 1/u² (3 teoremas); lab "Compatível ou não?" (faixas 1Δ/2Δ/3Δ, g padrão × g de SP, segunda medida e média ponderada); 16 exercícios; chefão "O g de São Paulo".
    - - FE06 Gráficos com barras de erro: o que a barra significa, ~2/3 das barras cruzadas, retas extremas e Δa = (Δy₁ + Δyₙ)/(xₙ − x₁), barra horizontal convertida (3 teoremas); lab "Ajuste a reta" (mola, reta à mão, retas extremas exatas por programação linear, painel de resíduos ampliado, caso sem reta possível); 16 exercícios; chefão "O carrinho na rampa".
    - - FE07 Linearização: lei de potência vira reta (y^p × x^q reta ⇔ q = pn), Δ(xⁿ) = |n|xⁿ⁻¹Δx, erro constante só mexe no coeficiente linear (3 teoremas); lab "Endireite a curva" (queda, pêndulo, Boyle, lâmpada; 5 × 2 transformações; curvatura < 1,5% = reta; parâmetro físico sai da inclinação); 16 exercícios; chefão "O atraso escondido" (t × √h com atraso do eletroímã).
    - - FE08 Gráficos log-log e mono-log: inclinação no log-log = expoente, mono-log dá k, meia-vida e τ, no log a incerteza relativa vira absoluta (3 teoremas); lab "Qual escala endireita?" (planetas com dados reais, fonte radioativa, café esfriando, lâmpada; 3 escalas; n = 1,4997 para Kepler); 16 exercícios; chefão "A fonte e o fundo" (radiação de fundo entortando o mono-log).
    - - FE09 Mínimos quadrados: dedução por derivadas parciais (a = Sxy/Sxx, reta passa por (x̄, ȳ)), reta pela origem, σa = s/√Sxx com s = √(S/(N − 2)) (3 teoremas); lab "Quadrados de verdade" (resíduos desenhados como quadrados, S da sua reta × S mínimo, ponto estragado); 16 exercícios; chefão "A mola pelos mínimos quadrados" (σa = metade das retas extremas).
    - - FE10 Erros sistemáticos: média elimina o aleatório e não o sistemático, aditivo muda o coeficiente linear e escala muda a inclinação (calibração em dois pontos), paralaxe d·tg α (3 teoremas); lab "Mais medidas não salvam" (alvo + histograma, 1/10/100 medidas, calibração com padrão); 16 exercícios; chefão "O tubo que vaza" (correção de extremidade e método das diferenças).
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
