# PROGRESSO — Site de Física do Lucas

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

## Como abrir
Dar dois cliques em `index.html` (Chrome/Edge/Firefox). Funciona offline: KaTeX e fontes estão em `assets/`.
O progresso (temas feitos, marcações ● X /, chefões destravados) fica no navegador; use "Exportar progresso" no menu para guardar um .json.

## Decisões (com o Lucas)
- Só PC. Tema escuro padrão, botão para clarear.
- Interativo = simulações. Sem XP, sem revisão espaçada, sem mapa de erros automático.
- Exercícios estáticos: dica 1, dica 2, resposta escondidas (abrem com clique) + marcação ● X / salva.
- Chefão destrava quando todos os exercícios do tema têm marcação (ou botão "já fiz no caderno").
- Códigos com 13 normal (A13, B13, C13). A17 = Hidrostática (assumido).
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
