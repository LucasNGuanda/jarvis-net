# PROGRESSO — Jarvis (sistema de estudo do Lucas)

## Estado final (15/11/2026, β 4.7, fim do chat; tudo no `main`, aprovado pelo Lucas)
As regras, o perfil do Lucas e as decisões fixas estão no `CLAUDE.md`. Aqui fica o estado do trabalho. Números contados automaticamente
abrindo o conteúdo de cada tema (script de contagem com Playwright), não de memória.

### Física — 3 abas: Física, Experimentos, Experimental
**Aba Física: 96 de 96 temas escritos, 913 exercícios** (todos os temas com chefão, menos o X01 e os simulados).
**Tabela completa (todas as abas com conteúdo escrito):**

| Aba | Módulo | Temas | Exercícios (mín–máx) | Total | Sem figura | Com `F.chute` | Com chefão | Laboratórios |
|---|---|---|---|---|---|---|---|---|
| Física | F Fundamentos e a matemática do físico | 6/6 | 7–7 | 42 | 42 | 0 | 6 | 6 |
| Física | A Mecânica | 21/21 | 12–14 | 264 | 178 | 0 | 21 | 21 |
| Física | T Termodinâmica | 11/11 | 16–16 | 176 | 0 | 11 | 11 | 11 |
| Física | O Ondas e Óptica | 11/11 | 7–7 | 77 | 77 | 0 | 11 | 12 |
| Física | C Eletricidade e Magnetismo | 20/20 | 7–16 | 189 | 49 | 20 | 20 | 24 |
| Física | M Física Moderna | 8/8 | 7–7 | 56 | 56 | 0 | 8 | 9 |
| Física | U Universitária | 6/6 | 7–7 | 42 | 42 | 0 | 6 | 6 |
| Física | N Fluidos até Navier–Stokes | 7/7 | 7–7 | 49 | 49 | 0 | 7 | 7 |
| Física | X Bônus | 1/1 | 3–3 | 3 | 3 | 0 | 0 | 5 |
| Física | S Simulados | 5/5 | 0–15 | 15 | 2 | 0 | 0 | 0 |
| Experimental | FEm Medidas e incertezas | 5/5 | 16–16 | 80 | 0 | 5 | 5 | 5 |
| Experimental | FEg Gráficos e ajustes | 4/4 | 16–16 | 64 | 0 | 4 | 4 | 4 |
| Experimental | FEr Relatório e erros | 2/2 | 16–16 | 32 | 0 | 2 | 2 | 2 |
| Experimentos | EPd Pêndulos | 3/3 | 0–2 | 4 | 4 | 0 | 0 | 3 |
| Experimentos | EEm Eletromagnetismo | 3/3 | 0–0 | 0 | 0 | 0 | 0 | 3 |
| Experimentos | EAt Força de atração | 1/1 | 0–0 | 0 | 0 | 0 | 0 | 1 |
| Experimentos | EMo Mola | 2/2 | 1–1 | 2 | 1 | 0 | 0 | 2 |
| Experimentos | EMi Mistos | 1/1 | 0–0 | 0 | 0 | 0 | 0 | 1 |
| Experimentos | ETe Termodinâmica | 3/3 | 0–0 | 0 | 0 | 0 | 0 | 3 |
| Experimentos | EQu Ondas e quântica | 3/3 | 0–0 | 0 | 0 | 0 | 0 | 3 |
| Experimentos | ENu Nuclear | 1/1 | 0–0 | 0 | 0 | 0 | 0 | 1 |
| Experimentos | EFl Fluidos | 1/1 | 0–0 | 0 | 0 | 0 | 0 | 1 |
| Cálculo (Matemática) | K1 Cálculo 1 | 9/9 | 7–7 | 63 | 63 | 0 | 9 | 10 |
| Cálculo (Matemática) | K2 Cálculo 2 | 8/8 | 7–7 | 56 | 56 | 0 | 8 | 9 |
| Cálculo (Matemática) | K3 Funções especiais e integrais | 3/3 | 7–7 | 21 | 21 | 0 | 3 | 3 |
| Cálculo (Matemática) | K4 Teoremas | 5/5 | 7–7 | 35 | 35 | 0 | 5 | 5 |
| Cálculo (Matemática) | K5 Simulados de Cálculo | 2/2 | 20–20 | 40 | 40 | 0 | 0 | 0 |

- S Simulados: S02 tem 15 questões do IME; S00, S01, S03 e S04 só a página de entrada. X01: 5 laboratórios, sem chefão. Experimentos: cada um é uma simulação (laboratório), sem exercícios por decisão (EP01, EP02 e EP08/EP10 guardam 1 ou 2 perguntas antigas).
- Mecânica, tema a tema: A01 12, A02 13, A03 14, A04 12, A05 12, A06 13, A07 13, A08 14, A09 12, A10 12, A11 12, A12 13, A12b 12, A13 13, A14a 13, A14 12, A15 12, A16 13, A17 13, A18 12, A20 12 (todos com correção automática e nível).
- Eletricidade, tema a tema: C01 10, C02 10, C03 10, C03b 10, C04 11, C05 9, C06 9, C07 16, C08 9, C09 7, C10 8, C10b 9, C11 10, C12 8, C13 9, C14 10, C15 9, C15b 9, C15c 8, C15d 8.

**Aba Experimentos: 18 experimentos** (simulação que se mexe, com controles e explicação curta; sem exercícios, por decisão):
EP01 Pêndulo simples pela lagrangiana, EP02 Pêndulo duplo e caos, EP03 Pêndulo triplo, EP04 O jogo da força de Lorentz, EP05 Radiação de uma carga acelerada, EP06 Ímã caindo num tubo condutor, EP07 A bolinha elétrica no fio, EP08 Duas massas e três molas, EP09 Pêndulo pendurado num bloco com mola, EP10 Dois discos rolando ligados por molas, EP11 Máquina de Carnot, EP12 O demônio de Maxwell, EP13 Gás de van der Waals, EP14 Fenda dupla, EP15 Radiação de corpo negro, EP16 Fissão e fusão, EP17 O gato de Schrödinger, EP18 Escoamento ao redor de um cilindro. Próximo código livre: EP19 (códigos nunca são reaproveitados).

**Aba Experimental: 11 de 11 temas no padrão completo, 176 exercícios** (16 por tema, todos com figura, correção automática, nível e `F.chute`): FE01 O que é medir, FE02 Incerteza tipo A e B, FE03 Média, desvio padrão e incerteza da média, FE04 Propagação de incertezas, FE05 Discrepância e compatibilidade, FE06 Gráficos com barras de erro, FE07 Linearização, FE08 Log-log e mono-log, FE09 Mínimos quadrados, FE10 Erros sistemáticos, FE11 Como escrever um relatório.

### Matemática — 3 abas
- **Cálculo** (veio da física na β 4.0): 27 de 27 escritos (Cálculo 1 CI01–CI09, Cálculo 2 CII01–CII08, Funções especiais CE01–CE03, Teoremas TE01–TE05: 7 exercícios cada, todos com chefão; Simulados SC01 e SC02 com 20 questões cada). Cálculo 3 e 4 "em breve".
- **Matemática** (MB, AR, GE, AL) e **Olimpíada e demonstrações** (DM, TNO, DES, CBO, GEO, FUN, PRI): 114 temas cadastrados, todos "em breve".
- Rota `#/matematica/<COD>`; progresso em `mat:`.

### Química — 2 abas, 104 temas cadastrados, 1 escrito (β 4.8, NA BRANCH `quimica-a01`, aguardando o "aprovado" do Lucas)
Química (módulos QA–QJ: introdução, atomística, ligações, reações e estequiometria, físico-química I e II, eletroquímica, orgânica, bioquímica e ambiental, analítica; 79 temas) e Experimentos (EQ01–EQ25, todos "em breve"; módulo novo EQs "Soluções e indicadores"). mhchem carregado e testado. Progresso em `qui:`.

| Aba | Módulo | Temas | Exercícios (mín–máx) | Total | Sem figura | Com `F.chute` | Com chefão | Laboratórios |
|---|---|---|---|---|---|---|---|---|
| Química | QA Introdução à química | 1/9 | 18–18 | 18 | 0 | 1 | 1 | 1 |

- **A01 Objetivos e ramos da química; método científico** (`temas/quimica/A01.js`): 18 exercícios (8 Físico, 10 Máximo), todos com figura e correção automática, 2 `F.chute`, 3 exemplos com figura e variações, 3 demonstrações, caixas Pense como químico (2), Pegadinha (2), Segurança e descarte, Nível olimpíada e Ponte, folha com 6 fórmulas, chefão "O frasco que mede quanto do ar serve para queimar". Laboratório "Experimento controlado: o comprimido efervescente" em `assets/sims/quimica/introducao.js` (`SIM.efervescente`).
- **Ordem combinada:** módulos A → B → C → D → E → F (Modalidade A da OBQ), depois G, H, J e os experimentos. Próximo tema: **A02**, só depois do "aprovado" do A01.
- **Fora do padrão ou a saber no A01:** as caixas "Nível olimpíada" descrevem o estilo de cobrança, sem questão real citada (o Lucas vai mandar provas da OBQ); o laboratório usa um MODELO inventado (dobra a cada 10 °C, tempo ∝ N^(−1/3), volume sem efeito), avisado no próprio laboratório; o `tests/texemp.js` lista os números com zeros finais (254,00 g) como "suspeitos", e eles são de propósito (leitura de balança com centésimo de grama).

### Idiomas — Russo, Alemão e Sânscrito (cartão com a barrinha Я / DE / सं), tudo "em breve"
- Russo: Gramática RG01–RG18, Leitura RL01–RL08; botão "Exportar para o Anki" previsto e desativado. `rus:`.
- Alemão: Gramática DG01–DG18, Leitura DL01–DL08. `ale:`. Sânscrito: Gramática SG01–SG15, Leitura SL01–SL07 (objetivo: ler a Bhagavad Gita). `san:`.
- Fontes no próprio site: Inter (latim, latin-ext, cirílico, grego), Noto Sans Devanagari, UnifrakturMaguntia (OFL).

### Tela inicial (Jarvis, `#/home`)
- Cartões das matérias, figura central (planeta, galáxia e buraco negro, este só do ADM), título com seletor de cor, campo do Jarvis, engrenagem (painel "Personalizar") e cadeado (códigos).
- **Adesivos: 28 em 6 categorias** (Física 6, Química 5, Matemática 6, Russo e Olimpíadas 5, Cientistas 3: Newton, Einstein e Marie Curie, Meus 3). Estáticos, nunca por cima de nada clicável, salvos em `jarvis:adesivos`.
- **Jarvis = busca dentro do site, sem IA** (β 4.2): índice gerado por `tools/gera-indice.js`, sinônimos e navegação em `assets/jarvis-config.js`, 12+1 frases do personagem, Ctrl K em qualquer página, só acha o que o nível de acesso deixa ver.

### Segredinhos (NUNCA mencionar em texto do site)
1. **Experimentos** (β 3.4): na página inicial da aba Experimentos, encostar o cursor na bolinha verde da ponta do pêndulo duplo (tolerância de 8 unidades). Aparece um buraco negro que puxa o pêndulo espiralando; depois sai o gato do EP17, que cai de pé. Clicar no gato leva ao EP17. Descoberta em `fisica:segredo:x`, com uma estrelinha discreta. Detalhes na β 3.4, abaixo.
2. **Matemática** (β 3.8): na página inicial da Matemática, 4 cliques seguidos no poliedro (no máximo 0,7 s entre eles). Vem uma "falha no sistema" de ~2 s (chuva verde de dígitos e símbolos, a página tremendo) e depois um tesserato girando nos planos xw e yz, com a legenda "tesserato, o cubo de 4 dimensões". Volta sozinho em ~10 s ou com um clique fora; fica salvo, com um selinho. Detalhes na β 3.8, abaixo.

### Sistema de acesso (β 4.1 a 4.6)
- Não é segurança de verdade: o site é estático e tudo fica legível no código-fonte (o Lucas sabe).
- Sem código (visitante), só a tela inicial aparece, com cadeados. Passar o mouse num item trancado mostra "sem acesso · ir para códigos? duplo clique"; quem já tem algum código vê "em construção". O duplo clique ou o cadeado levam a `#/codigos`.
- Página de códigos: 3 linhas (ADM, tester, avulsos), a lista do que está destravado e "Voltar a visitante". Código errado: "código não reconhecido". Código repetido: "código já usado". Cada código só vale na linha dele.
- **Códigos:**
  - ADM `55_admfreee_will`: tudo.
  - Tester `beta8976_@freewill_choise`: a Física inteira.
  - Avulsos:
    - Física `frewill_físic98025_p` (vale sem o acento);
    - Matemática `free-willp-mat98017`;
    - Química `free_quimic`;
    - Russo e a barrinha de idiomas `let-me_slavic98716`;
    - Configurações (engrenagem e arco-íris do título) `give-meskinn`;
    - Alemão `ich-will_deutsch4471`;
    - Sânscrito `om_samskrta8840`;
    - Jarvis `talk-to_jarvis_freewill01`.
- Configuração editável: `assets/acesso-config.js`. Cada matéria, aba, parte da engrenagem e adesivo tem um nível: "visitante", "tester", "adm", o nome de um avulso ou uma lista deles.
- **Exclusivos, fixos no motor** (`assets/acesso.js`, fora da configuração):
  - Só do ADM: a figura "buraco negro" e o título dourado.
  - Do tester (e do ADM): o título e a figura esmeralda.
- **Animações:**
  - ADM: buraco negro que suga símbolos de todas as matérias, desce até o meio, vira a figura central e explode; a onda acende o ".ADM" dourado.
  - Tester: livro já aberto, símbolos verdes de todos os lados, voo até a versão e ".tester" verde.
  - Avulsos: animações curtas de 2,65 s, terminando em "acesso liberado · …".
  - Todas puláveis (Esc ou botão); com "reduzir movimento", pulam sozinhas.
- O buraco negro da figura central tem duas formas: o de arame (normal) e o realista (só com o título dourado), com transição animada entre elas.
- Acesso em `jarvis:acesso`; idioma em `jarvis:lingua`; buscas em `jarvis:buscas`. Tudo entra no exportar/importar.

### Testes (`tests/`) e última regressão
tgeral, tfunc, tcalc, tcalc2, tfis, tfisA, tfisF, tfisN2, tfisON, tfisTE, thome, tcor, texp, tsegredo, tsegredo2, tadesivos, tmaterias, tfiguras, tmudacalculo, tacesso, tbusca, mais tmec, tchaves e texemp por código. Todos rodam como ADM via `tests/adm.js` (menos o tacesso). Capturas em `tests/capturas/` (fora do git).
- **Última regressão: a da β 4.7 (sem falhas; ver β 4.7 no histórico). A anterior, sobre a β 4.6: 23 execuções, todas com código 0 e nenhuma linha de FALHA** (21 testes + tchaves A01 T03 C07 FE03 + tmec A01 FE03; 772 conferências "ok"). tgeral: 437 páginas, 152 temas escritos, 1970 links, 1310 exercícios, 157 laboratórios, **0 fórmulas quebradas (katex-error)**, nenhum tema vazio, nenhum link quebrado; **0 erros de JavaScript** (16 testes com "sem erros JS" e o tfunc "sem erros no console"). Calculadora 1: 103 de 103; calculadora 2: 41 de 41; tacesso, tbusca, surpresas (tsegredo e tsegredo2), mudança do Cálculo e todos os da física sem falha. Avisos informativos do tgeral (não são falha): S00, S01, S03 e S04 com conteúdo curto (só a página de entrada).

### Dívida técnica (o que ficou abaixo do padrão do CLAUDE.md)
- [ ] **Exercícios por tema (meta: 15 a 20):**
  - com 7: F (6 temas), O (11), M (8), U (6), N (7) e o Cálculo inteiro (CI, CII, CE, TE: 25 temas);
  - a Mecânica tem 12 a 14 (21 temas);
  - a Eletricidade vai de 7 a 16 (só o C07 está na meta; C09 tem 7; os outros, de 8 a 11);
  - o X01 tem 3.
- [ ] **Exercícios sem figura** (contagem automática: exercício sem desenho próprio):
  - Mecânica: 178 de 264;
  - Eletricidade: 49 de 189 (C06 a C15d);
  - F, O, M, U, N e Cálculo: todos (42 + 77 + 56 + 42 + 49 + 175 = 441);
  - X01: 3.
  - Termodinâmica e Experimental: nenhum sem figura.
- [ ] **Temas sem `F.chute` ("chuta antes de ver"):** F, A, O, M, U, N, X01 e o Cálculo inteiro. Só T, C e FE têm.
- [ ] **Teoria mais curta que o padrão:**
  - O padrão pede ~10 páginas nos temas grandes. O Experimental tem ~3 a 4 páginas por tema; os módulos antigos de 7 exercícios também são mais curtos.
  - Os temas antigos não têm todas as caixas (Pense como físico, Pegadinha, Nível olimpíada, Ponte para a universidade) nem 3 exemplos com figura em todos os casos.
- [ ] **Simulados:** S00, S01, S03 e S04 só têm a página de entrada; X01 e os simulados não têm chefão.
- [x] Defeitos conhecidos: os dois foram corrigidos na β 4.7 (simulação do N02 e os `{,}` vazando), com autorização do Lucas. Ver β 4.7 no histórico.

**Tabela tema por tema** (só os temas com alguma dívida; meta de 15 exercícios; Experimentos e Simulados ficam fora porque têm formato próprio):

| Tema | Exercícios | Faltam para 15 | Sem figura | `F.chute` |
|---|---|---|---|---|
| F01 | 7 | 8 | 7 | falta |
| F02 | 7 | 8 | 7 | falta |
| F03 | 7 | 8 | 7 | falta |
| F04 | 7 | 8 | 7 | falta |
| F05 | 7 | 8 | 7 | falta |
| A19 | 7 | 8 | 7 | falta |
| A01 | 12 | 3 | 10 | falta |
| A02 | 13 | 2 | 2 | falta |
| A03 | 14 | 1 | 8 | falta |
| A04 | 12 | 3 | 3 | falta |
| A05 | 12 | 3 | 7 | falta |
| A06 | 13 | 2 | 6 | falta |
| A07 | 13 | 2 | 7 | falta |
| A08 | 14 | 1 | 8 | falta |
| A09 | 12 | 3 | 8 | falta |
| A10 | 12 | 3 | 9 | falta |
| A11 | 12 | 3 | 10 | falta |
| A12 | 13 | 2 | 9 | falta |
| A12b | 12 | 3 | 7 | falta |
| A13 | 13 | 2 | 10 | falta |
| A14a | 13 | 2 | 11 | falta |
| A14 | 12 | 3 | 10 | falta |
| A15 | 12 | 3 | 11 | falta |
| A16 | 13 | 2 | 13 | falta |
| A17 | 13 | 2 | 9 | falta |
| A18 | 12 | 3 | 10 | falta |
| A20 | 12 | 3 | 10 | falta |
| O01 | 7 | 8 | 7 | falta |
| O02 | 7 | 8 | 7 | falta |
| O03 | 7 | 8 | 7 | falta |
| O04 | 7 | 8 | 7 | falta |
| O05 | 7 | 8 | 7 | falta |
| O06 | 7 | 8 | 7 | falta |
| O07 | 7 | 8 | 7 | falta |
| O08 | 7 | 8 | 7 | falta |
| O09 | 7 | 8 | 7 | falta |
| O10 | 7 | 8 | 7 | falta |
| O10b | 7 | 8 | 7 | falta |
| C01 | 10 | 5 | — | tem |
| C02 | 10 | 5 | — | tem |
| C03 | 10 | 5 | — | tem |
| C03b | 10 | 5 | — | tem |
| C04 | 11 | 4 | — | tem |
| C05 | 9 | 6 | — | tem |
| C11 | 10 | 5 | — | tem |
| C06 | 9 | 6 | 3 | tem |
| C08 | 9 | 6 | 4 | tem |
| C09 | 7 | 8 | 3 | tem |
| C10 | 8 | 7 | 4 | tem |
| C10b | 9 | 6 | 3 | tem |
| C12 | 8 | 7 | 4 | tem |
| C13 | 9 | 6 | 4 | tem |
| C14 | 10 | 5 | 5 | tem |
| C15 | 9 | 6 | 5 | tem |
| C15b | 9 | 6 | 4 | tem |
| C15c | 8 | 7 | 3 | tem |
| C15d | 8 | 7 | 7 | tem |
| C16 | 7 | 8 | 7 | falta |
| C17 | 7 | 8 | 7 | falta |
| C17b | 7 | 8 | 7 | falta |
| C18 | 7 | 8 | 7 | falta |
| C19 | 7 | 8 | 7 | falta |
| C19b | 7 | 8 | 7 | falta |
| C20 | 7 | 8 | 7 | falta |
| C21 | 7 | 8 | 7 | falta |
| U01 | 7 | 8 | 7 | falta |
| U02 | 7 | 8 | 7 | falta |
| U03 | 7 | 8 | 7 | falta |
| U04 | 7 | 8 | 7 | falta |
| U05 | 7 | 8 | 7 | falta |
| U06 | 7 | 8 | 7 | falta |
| N01 | 7 | 8 | 7 | falta |
| N02 | 7 | 8 | 7 | falta |
| N03 | 7 | 8 | 7 | falta |
| N04 | 7 | 8 | 7 | falta |
| N05 | 7 | 8 | 7 | falta |
| N06 | 7 | 8 | 7 | falta |
| N07 | 7 | 8 | 7 | falta |
| X01 | 3 | 12 | 3 | falta |
| matematica/CI01 | 7 | 8 | 7 | falta |
| matematica/CI02 | 7 | 8 | 7 | falta |
| matematica/CI03 | 7 | 8 | 7 | falta |
| matematica/CI04 | 7 | 8 | 7 | falta |
| matematica/CI05 | 7 | 8 | 7 | falta |
| matematica/CI06 | 7 | 8 | 7 | falta |
| matematica/CI07 | 7 | 8 | 7 | falta |
| matematica/CI08 | 7 | 8 | 7 | falta |
| matematica/CI09 | 7 | 8 | 7 | falta |
| matematica/CII01 | 7 | 8 | 7 | falta |
| matematica/CII02 | 7 | 8 | 7 | falta |
| matematica/CII03 | 7 | 8 | 7 | falta |
| matematica/CII04 | 7 | 8 | 7 | falta |
| matematica/CII05 | 7 | 8 | 7 | falta |
| matematica/CII06 | 7 | 8 | 7 | falta |
| matematica/CII07 | 7 | 8 | 7 | falta |
| matematica/CII08 | 7 | 8 | 7 | falta |
| matematica/CE01 | 7 | 8 | 7 | falta |
| matematica/CE02 | 7 | 8 | 7 | falta |
| matematica/CE03 | 7 | 8 | 7 | falta |
| matematica/TE01 | 7 | 8 | 7 | falta |
| matematica/TE02 | 7 | 8 | 7 | falta |
| matematica/TE03 | 7 | 8 | 7 | falta |
| matematica/TE04 | 7 | 8 | 7 | falta |
| matematica/TE05 | 7 | 8 | 7 | falta |
| **Total (104 temas com alguma dívida)** | **881** | **679** (em 104 temas) | **671** | **85 sem** |

Totais: 104 temas abaixo do padrão; faltam 679 exercícios para todos chegarem a 15; 671 exercícios sem figura; 85 temas sem `F.chute`.

- Regra: tema novo já nasce no padrão completo (15–20 exercícios, figura em todo exercício, `F.chute`, chefão, as 4 caixas).

### Pendências combinadas
- Modelo de dados (`docs/MODELO_DE_DADOS.md`): decidir se a física passa de `fisica:` para `fis:` (exige migrar o progresso salvo) e o registro de acerto e erro para o mapa de erros.
- Ativar o GitHub Pages (o Lucas liga à mão em Settings → Pages).
- Previstos e não implementados: botão "Exportar para o Anki" (russo); campo `easterEggs` (surpresa → código); Cálculo 3 e 4.
- Versão de celular: só no fim. Depois de tudo: portal com progresso geral e mapa de erros. Bem mais tarde: programa à parte com API (conversa de verdade do Jarvis; nunca chave de API dentro do site).

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
    - FE05 Comparando resultados: desvio percentual × discrepância em unidades de Δ, critério 2Δ/3Δ, diferença de duas medidas (Δa + Δb), média ponderada 1/u² (3 teoremas); lab "Compatível ou não?" (faixas 1Δ/2Δ/3Δ, g padrão × g de SP, segunda medida e média ponderada); 16 exercícios; chefão "O g de São Paulo".
    - FE06 Gráficos com barras de erro: o que a barra significa, ~2/3 das barras cruzadas, retas extremas e Δa = (Δy₁ + Δyₙ)/(xₙ − x₁), barra horizontal convertida (3 teoremas); lab "Ajuste a reta" (mola, reta à mão, retas extremas exatas por programação linear, painel de resíduos ampliado, caso sem reta possível); 16 exercícios; chefão "O carrinho na rampa".
    - FE07 Linearização: lei de potência vira reta (y^p × x^q reta ⇔ q = pn), Δ(xⁿ) = |n|xⁿ⁻¹Δx, erro constante só mexe no coeficiente linear (3 teoremas); lab "Endireite a curva" (queda, pêndulo, Boyle, lâmpada; 5 × 2 transformações; curvatura < 1,5% = reta; parâmetro físico sai da inclinação); 16 exercícios; chefão "O atraso escondido" (t × √h com atraso do eletroímã).
    - FE08 Gráficos log-log e mono-log: inclinação no log-log = expoente, mono-log dá k, meia-vida e τ, no log a incerteza relativa vira absoluta (3 teoremas); lab "Qual escala endireita?" (planetas com dados reais, fonte radioativa, café esfriando, lâmpada; 3 escalas; n = 1,4997 para Kepler); 16 exercícios; chefão "A fonte e o fundo" (radiação de fundo entortando o mono-log).
    - FE09 Mínimos quadrados: dedução por derivadas parciais (a = Sxy/Sxx, reta passa por (x̄, ȳ)), reta pela origem, σa = s/√Sxx com s = √(S/(N − 2)) (3 teoremas); lab "Quadrados de verdade" (resíduos desenhados como quadrados, S da sua reta × S mínimo, ponto estragado); 16 exercícios; chefão "A mola pelos mínimos quadrados" (σa = metade das retas extremas).
    - FE10 Erros sistemáticos: média elimina o aleatório e não o sistemático, aditivo muda o coeficiente linear e escala muda a inclinação (calibração em dois pontos), paralaxe d·tg α (3 teoremas); lab "Mais medidas não salvam" (alvo + histograma, 1/10/100 medidas, calibração com padrão); 16 exercícios; chefão "O tubo que vaza" (correção de extremidade e método das diferenças).
    - FE11 Como escrever um relatório: incerteza com 1 algarismo (2 se começar com 1) porque Δσ/σ ≈ 1/√(2(N − 1)) (conferido por simulação: 23,9% com N = 10), algarismos de um cálculo vêm da propagação, mudar de unidade não muda algarismos (3 teoremas); as 7 partes do relatório; lab "Corretor de resultados" (6 casos da calculadora, lê vírgula/ponto, +-, potência de 10, aponta cada erro); 16 exercícios; chefão "O mini-relatório" (massa-mola sintético: k = 19,6 ± 0,3 N/m, m_ef = 9 ± 3 g).
  - Todas as contas conferidas em Python (anotadas no comentário do topo de cada tema); os laboratórios conferidos contra o Python (mesmos números nas capturas), inclusive casos limite (barras pequenas demais sem reta possível, viés zero compatível, transformações erradas com curvatura alta).
  - Dados: os do Lucas (pêndulo do itinerário) não foram usados nem alterados; os dados dos exemplos e chefões são sintéticos, exceto os planetas do FE08 (valores reais do Sistema Solar).
  - Simplificações honestas: as retas extremas dos exercícios usam o atalho das diagonais do primeiro e do último ponto (conferi, em cada caso, que elas coincidem com as extremas exatas que cruzam todas as barras); o critério de "reta" dos labs do FE07 e FE08 é a curvatura (maior resíduo/altura) abaixo de 1,5% e 2%, escolhido porque separa bem os casos com ~0,3% e ~1,5% de ruído; o corretor do FE11 aceita a incerteza arredondada para cima (convenção conservadora) e, com incerteza começando em 1, aceita 1 ou 2 algarismos.
  - Testes antes de cada commit: `tmec` e `tchaves` em cada FE e `tgeral` completo (152 páginas, 152 escritas, 0 erro de KaTeX).
- **β 3.6** — **Adesivos da tela inicial** (pedido de 15/11/2026).
  - Engrenagem ao lado do campo "Perguntar algo ao Jarvis" (o campo continua "em breve") abre o painel de adesivos, que é o modo de edição. Esc ou "Concluir" fecha.
  - 25 adesivos, todos disponíveis e estáticos (nenhuma animação, conferido no teste), desenhados do zero em SVG, na cor da categoria: Física 6 (maçã, pêndulo, foguete, ímã, buraco negro, átomo), Química 5 (béquer, benzeno, bico de Bunsen, cristal, tabela periódica), Matemática 6 (π, integral, espiral áurea, floco de Koch, icosaedro, W de Lambert), Russo e Olimpíadas 5 (matrioska, Я, medalha, Soyuz, urso de cachecol), Meus 3 (o gato do EP17, vórtices de von Kármán, primo 7 com coroa).
  - Conferido em Python: espiral áurea com quadrados de Fibonacci 55, 34, 21, … (razão 89/55 = 1,618); W de Lambert desenhada pela inversa x = w·eʷ, igual ao scipy (erro ~10⁻¹³ nos dois ramos, ponto de ramificação em −1/e); icosaedro com 12 vértices e 30 arestas; Koch de nível 3 (192 vértices).
  - No modo de edição: arrastar do painel (ou clicar/Enter, que põe no lugar livre mais próximo), mover, girar (Shift: de 15° em 15°), redimensionar (36 a 280 px), remover (× ou Delete) e "Limpar tudo" (pede confirmação). O painel pode trocar de lado (⇄).
  - Áreas proibidas: título (cor), seletor de cor, botões das matérias, campo do Jarvis, engrenagem, painel e qualquer outro elemento clicável visível. Aparecem em vermelho claro durante o arraste; o adesivo fica apagado com contorno vermelho em cima delas; soltando ali, volta para a última posição válida (um adesivo novo que nunca passou por área válida não é criado).
  - Camada atrás da interface (z-index 0) com pointer-events: none; só no modo de edição ela sobe e só os adesivos recebem o mouse.
  - Mudou o tamanho da janela: quem ficar em cima de algo clicável é mostrado na área válida mais próxima (busca em círculos de 6 px), sem alterar a posição salva; com a janela grande de novo, volta ao lugar escolhido.
  - Cadastro em `assets/adesivos.js` (acrescentar adesivo = acrescentar um objeto; campo `trava` preparado para destravar no futuro, hoje sempre null e ignorado); código em `assets/home-adesivos.js`. Salvo em `jarvis:adesivos`; o exportar progresso agora leva também as chaves `jarvis:` (cor e adesivos), e o importar as aceita sem passar pela migração de códigos.
  - Teste novo `tests/tadesivos.js` (29 conferências: catálogo, painel, arrastar válido e proibido, girar, redimensionar, remover, limpar, pointer-events, botão Física clicável, janela de 900 px, persistência, exportação).
  - Limitações honestas: a colisão usa a caixa do adesivo girado (90% do lado, porque os desenhos têm margem), não o contorno exato do desenho; o painel cobre parte da tela enquanto está aberto (por isso o botão de trocar de lado); dois adesivos empurrados pela janela menor podem ficar um sobre o outro (nunca sobre um botão); adesivos entre si podem se sobrepor se você quiser.
  - Limpeza: as capturas que os testes antigos gravam na raiz (`home-*.png`, `fisica-com-home.png`, `calc-*.png`, `cor-*.png`) saíram do git e foram para o `.gitignore`.
- **β 3.7** — **Base comum e cascas da Matemática e da Química** (pedido de 15/11/2026, sessão da BASE).
  - A base já era quase toda comum (componentes `F.*`, CSS, menu, legenda, configurações, calculadoras). O que estava preso à física e foi separado: as abas do topo (escritas à mão no `index.html`; agora saem de `AREAS`, que ganhou os campos `materia`, `anim` e `icone`, e o topo mostra só as abas da matéria atual), a lista fixa de rotas de início (agora qualquer área de `AREAS` tem a sua página inicial), a escolha do desenho de cada início (`F.ANIM`) e as matérias "em breve" da tela inicial.
  - Cada matéria se registra no seu arquivo: `assets/catalogo.js` (Física), `assets/catalogo-matematica.js`, `assets/catalogo-quimica.js`. Acrescentar aba, módulo ou tema = editar o arquivo da matéria.
  - Igual à Física em tudo o que não é conteúdo: topo, botão Home, menu com códigos e bolinhas, cartões de módulo, contador de progresso, "Continuar de onde parei", componentes, tema, fontes, espaçamento, caixas, marcações, Legenda e símbolos. A cor da matéria (Física --mA, Matemática --mK2, Química --mN) aparece como um fio embaixo da aba atual (`--materia`), nas três matérias.
  - Módulos sem temas: o cartão fica "em breve" com a barra vazia (antes a conta 0/0 enchia a barra); se a área não tem nada escrito, o menu mostra os módulos mesmo assim; aba sem módulos mostra a caixa "Em breve". Corrigido também um defeito antigo: o módulo vazio do menu pegava o estilo da caixa genérica `.vazio` (borda tracejada e recuo enorme) quando se clicava em "Mostrar temas em breve" na Física. Códigos de 2 ou 3 letras (MB, TNO…) ganharam fonte menor na bolinha.
  - Desenhos das páginas iniciais (SVG redesenhado a cada quadro, como o átomo): Matemática, icosaedro em arame girando; Cálculo da Matemática, o mesmo das somas de Riemann do Cálculo da Física; Olimpíada, a demonstração sem palavras 1 + 3 + 5 + … + (2n − 1) = n² com as camadas em L aparecendo; Química, benzeno girando com as duas estruturas de Kekulé se alternando (ressonância); Experimentos de química, béquer com bolhas subindo.
  - mhchem: `assets/katex/contrib/mhchem.min.js`, da mesma versão do KaTeX (0.16.11), tirado do pacote oficial do npm (o CDN estava bloqueado nesta sessão).
  - Progresso: nenhuma chave do localStorage mudou (tudo continua com o prefixo `fisica:`, porque o documento do modelo de dados com prefixos por matéria ainda espera a aprovação do Lucas), então o progresso salvo não é tocado. Não consegui exportar o .json de verdade: ele fica no navegador do Lucas, fora do alcance desta sessão.
  - Trabalho feito na branch `base-materias`, testado e depois juntado ao `main`.
  - Teste novo `tests/tmaterias.js`: as 9 páginas iniciais, abas por matéria, estilos calculados iguais aos da Física (fora a cor), animações, links da tela inicial, link antigo `#/quimica/inicio`, mhchem, e um tema de teste em memória dentro da Química com chute, exercício com correção, chefão, lab, caixa, folha de fórmulas e "Continuar de onde parei". `thome` atualizado (Química e Matemática abertas; Russo é a matéria "em breve" do teste).
  - Capturas lado a lado: `tests/capturas/comparacao-materias.png` e `tests/capturas/comparacao-abas.png`.
- **β 3.8** — **Temas cadastrados nas três matérias novas, matéria Russo e segunda surpresa** (pedido de 15/11/2026).
  - Tarefa 1: os temas da lista do Lucas, todos "em breve", com os códigos dele. Como a química repete códigos da física (A01, C01, F01…), as matérias novas ganharam rotas com a matéria na frente (`#/quimica/A01`), arquivos em `temas/<matéria>/` e `F.achar`/`F.href` por matéria. A física continua nas rotas antigas, sem mudança (o tgeral dá os mesmos números de antes: 152 escritas, 1970 links, 1310 exercícios, 157 labs, 0 KaTeX). Os módulos da aba Experimentos de química têm ids internos EQg, EQr, EQe, EQn, EQt (mostram QG, QR, QE, QN, QT), porque QE e QG já eram ids da aba Química.
  - Tarefa 2: matéria Russo com 2 abas (Gramática, Leitura e tradução), cor nova `--mR` (#39a6ef no escuro, #1080cb no claro; matiz 204°, a mais distante da paleta em Lab com a mesma saturação, 32 unidades da mais próxima; conta feita em Python), desenhos: três matrioskas balançando (Gramática) e a letra Я girando em torno do eixo vertical, que de costas vira um R, com letras cirílicas subindo (Leitura). Botão "Exportar para o Anki" previsto e desativado.
  - Prefixos por matéria: `mat:`, `qui:`, `rus:` (em `MATERIAS[].prefixo`). A física ficou em `fisica:` e não em `fis:`: trocar exigiria migrar o progresso salvo, e o pedido também dizia "nada de alterar a física". Configurações do site inteiro continuam em `fisica:`. O `rota()` agora define a área ANTES de desenhar o tema, para as marcações serem lidas com o prefixo certo.
  - Tarefa 3 (segunda surpresa, NUNCA mencionar em texto do site): na página inicial da Matemática, 4 cliques seguidos no poliedro (no máximo 0,7 s entre um e outro) disparam uma "falha no sistema" de ~2 s: uma tela por cima de tudo (`.falha-tela`, sem receber clique) com chuva de dígitos, letras gregas e símbolos matemáticos verdes, ruído, faixas deslocadas e a página tremendo. Depois aparece um tesserato no lugar do poliedro: 16 vértices (±1,±1,±1,±1), 32 arestas, girando nos planos xw e yz, projetado 4D → 3D (perspectiva, d = 3) → tela, com traço fino luminoso nas cores da matemática; o cubo de dentro cresce e vira o de fora (conferido em Python: raio médio de 1,30 → 2,60 numa meia-volta em xw). Legenda "tesserato, o cubo de 4 dimensões" por ~6 s. Volta ao poliedro depois de ~10 s de tesserato ou com um clique fora. A descoberta fica em `mat:segredo:t` e aparece um selinho discreto (a mesma estrelinha do buraco negro). Desligado com movimento reduzido.
  - Testes: `tests/tmaterias.js` ampliado (4 matérias, rotas por matéria, prefixos, botão do Anki, contagem de temas); `tests/tgeral.js` agora percorre as 389 páginas de tema com a rota de cada matéria; teste novo `tests/tsegredo2.js` (17 conferências).
  - Capturas: `tests/capturas/comparacao-4-materias.png`.
  - **Falha conhecida, não corrigida (física):** o tfisON falha em cerca de metade das vezes no N02 ("bolinhas por segundo iguais nas duas janelas"; em 6 rodadas sozinho, 3 falharam: 10,5 × 19,5; 16 × 9,5; 18,5 × 13). Na β 3.7 eu tinha atribuído isso à máquina sobrecarregada; estava errado. A causa é a simulação: as bolinhas começam uniformes em x, mas no regime permanente a densidade tem que ser ∝ 1/v (fluxo n·v constante), então as janelas só concordam na média de um ciclo inteiro (~10 s), não em 2 s como o texto do lab diz. Correção proposta (não aplicada, porque o pedido dizia "nada de alterar a física"): espaçar as bolinhas igualmente no tempo de percurso τ(x) = ∫dx/v e refazer isso quando um controle muda; aí cada janela vê uma bolinha a cada T/N. Esperando o Lucas autorizar.
- **β 3.9** — **Painel da engrenagem: cientistas e figura central** (pedido de 15/11/2026).
  - Adesivos: categoria nova Cientistas (cor `--mO`, a única da paleta que nenhuma categoria de adesivo usava), com Newton (peruca de cachos, maçã caindo, gravata de renda), Einstein (cabelo arrepiado, bigode farto, E=mc²) e Marie Curie (coque, gola alta, frasco brilhando e "Ra"). Bustos com o mesmo traço e a mesma proporção dos outros (viewBox 100, traço 3), rosto com 2 ou 3 traços; conferidos em 180 px e em 60 px. Desenhos originais a partir da descrição. Total: 28 adesivos em 6 categorias.
  - Figura central: o painel virou "Personalizar", com a seção "Figura central" (3 miniaturas, "acompanhar a cor do tema" ou cor própria no mesmo arco-íris do título, velocidade de 0 = parado a 2×) e a seção Adesivos (o "Limpar tudo" foi para junto dela, para não parecer que apaga a figura). Cadastro em `assets/figuras.js`: planeta com anel (o desenho de antes, ainda a padrão), galáxia espiral (dois braços em espiral logarítmica r = a·e^(bφ) girando como corpo rígido, estrelas fixas por sorteio com semente, núcleo brilhante; disco inclinado) e buraco negro (anéis do disco tracejados girando com Ω ∝ r^(-3/2), os de dentro mais rápidos, como Kepler; centro escuro, anel de luz fino, arco de luz curvado por cima e outro por baixo; a parte do disco atrás do centro fica escondida por uma máscara). Tudo em arame luminoso e leve: a galáxia muda um único atributo por quadro, o buraco negro 5. Com velocidade 0 o laço de animação desliga de verdade.
  - Cor: as figuras usam `--fg1..3`, que por padrão são as cores do título (`--jv1..3`); a cor própria muda só a figura. Salvo em `jarvis:figura` = { id, hue, vel }; entra no exportar/importar (prefixo `jarvis:`).
  - Testes: `tests/tfiguras.js` novo (15 conferências); `tests/tadesivos.js` atualizado (28 adesivos, 6 categorias). Capturas: `tests/capturas/figuras-e-cientistas.png`, `fig-painel.png`.
- **β 4.0** — **O Cálculo saiu da física e foi para a matemática** (pedido de 15/11/2026; feito na branch `muda-calculo`, testado pelo Lucas e aprovado antes de ir para o `main`).
  - Os 27 temas (Cálculo 1 CI01–CI09, Cálculo 2 CII01–CII08, Funções especiais CE01–CE03, Teoremas TE01–TE05, Simulados SC01–SC02) foram para a aba Cálculo da matemática, com os mesmos módulos (K1–K5), ordem e códigos; arquivos em `temas/matematica/` e simulações em `assets/sims/matematica/`. A aba Cálculo da matemática ficou: Cálculo 1, Cálculo 2, Cálculo 3 ("em breve"), Cálculo 4 ("em breve"), Funções especiais e integrais, Teoremas, Simulados de Cálculo. A física ficou com 3 abas.
  - Progresso: migração única e não destrutiva (`F.migraCalculo`) que copia de `fisica:` para `mat:` os temas feitos, as marcações ● X /, os acertos e erros, os chefões destravados e o "continuar de onde parei" do Cálculo. Nada foi apagado de `fisica:`. Antes de copiar, guarda uma cópia de tudo em `jarvis:backup:antes-calculo` (entra no "Exportar progresso"). Importar um backup antigo também copia o progresso do Cálculo. Eu não consegui exportar o .json do Lucas (fica no navegador dele); pedi para ele exportar antes de testar.
  - Links: os 106 links cruzados foram acertados (48 da física para o Cálculo, como [CI07]← no A04, e 58 do Cálculo para a física); `F.ret` mostra só o código mesmo com a matéria na frente. Links e favoritos antigos `#/CI07…` e `#/calculo` redirecionam para a matemática.
  - Defeito antigo corrigido: o laboratório de Taylor do CII04 tinha o mesmo nome (`SIM.taylor`) do laboratório do F05, e o da física sobrescrevia o do Cálculo; agora o do Cálculo é `SIM.taylorK`. O F05 não mudou.
  - Testes: `tests/tmudacalculo.js` novo (30 conferências: migração, links antigos e cruzados, abas, contadores, sumário, busca, legenda, "continuar", laboratórios); `tfunc` agora devolve erro quando falha e entende as rotas com a matéria na frente; `tfis`, `tfisTE`, `tfisN2`, `thome`, `tmaterias` ajustados às rotas novas. Regressão completa ok; tgeral: 389 páginas, 152 escritas, 1970 links, 0 KaTeX, nenhum tema vazio, nenhum link quebrado, nenhum erro no console.
  - Defeitos antigos encontrados e não corrigidos (já existiam antes da mudança): números com `{,}` vazando no texto comum em CI02, CII03, TE01 e TE04 (aparecem no `tchaves`).
- **β 4.1** — **Acesso por código e idiomas** (pedido de 15/11/2026). Aviso do próprio Lucas: o site é estático, então os códigos e o conteúdo ficam legíveis no código-fonte; é uma trava de conveniência, não segurança.
  - Sem código (visitante): só a tela inicial, com os cartões de Física, Química, Matemática e Russo com cadeado, a figura central girando e o campo do Jarvis. Matérias, abas e engrenagem trancadas: passar o mouse mostra "sem acesso · ir para códigos? duplo clique" e o duplo clique leva aos códigos. Página ou tema aberto por link direto mostra "sem acesso" (ou "em construção", para quem já tem algum código) com o botão "ir para códigos".
  - Página de códigos `#/codigos` (botão de cadeado ao lado da engrenagem): 3 linhas (ADM, tester, avulsos), o que está destravado agora e "Voltar a visitante". Código errado: só "código não reconhecido", sem animação e sem pista. Cada código só vale na linha dele. O de física vale com ou sem acento.
  - Animações (todas com "pular ⏭" ou Esc; com movimento reduzido, pulam sozinhas): ADM = livro que abre, feixe dourado com partículas, clarão, tela inicial, o livro voa do buraco negro, passa entre Química e Matemática e bate na versão, que ganha ".ADM"; tester = o mesmo com feixe verde e chuva de dígitos, letras gregas e símbolos, sufixo ".tester". Avulsos (2,65 s, sem tela cheia): maçã que vira átomo, espiral dourada com números, titulação com bolhas, neve de letras cirílicas formando Я, folha de adesivos; depois o aviso "acesso liberado · <o que foi>".
  - Arquivos: `assets/acesso-config.js` (configuração, editada pelo Lucas), `assets/acesso.js` (motor), `assets/codigos.js` (página, trava e animações), `assets/catalogo-idiomas.js` (alemão e sânscrito). Acesso salvo em `jarvis:acesso` = { chaves: [...] }; idioma em `jarvis:lingua`; os dois entram no exportar/importar.
  - Formato da configuração: cada matéria (`materias`), aba (`abas`, pelo id da área), parte da engrenagem (`engrenagem`: painel, figura, adesivos, corTitulo) e adesivo (`adesivos`, pelo id) recebe um nível: "visitante", "tester", "adm", o nome de um código avulso ("fisica", "matematica", "quimica", "idiomas", "config") ou uma lista deles. O ADM vê tudo sempre. O que não está na lista fica só para o ADM (abas e adesivos herdam da matéria ou da engrenagem). Campo `easterEggs` (surpresa → código) só previsto, sem funcionar.
  - A cor do título (seletor da tela inicial) também ficou atrás do código de configurações (`engrenagem.corTitulo`), porque é personalização; sem acesso, o título usa a cor original. Dá para liberar trocando para "visitante".
  - Idiomas: barrinha vertical à direita do cartão (Я / DE / सं), liberada pelo código do russo; troca nome, cor e desenho do cartão. Alemão: cor `--mDE`, ß girando (Gramática) e portão de Brandemburgo em traço (Leitura). Sânscrito: cor `--mSA`, सं girando e ॐ pulsando. Cores escolhidas em Python como as mais distantes da paleta (distância mínima em Lab 26,1 e 24,1). Prefixos `ale:` e `san:`.
  - Testes: `tests/tacesso.js` novo (visitante, códigos errados, os 5 avulsos e o de física sem acento, tester, ADM sem pular e sem congelar a página, troca de idioma, recarregar, exportar, voltar a visitante, movimento reduzido); `tests/adm.js` injeta ADM nos testes antigos. Capturas: `tests/capturas/anim-adm-quadros.png`, `anim-avulsos-quadros.png`, `anim-tester-*.png`, `lingua-*.png`.
  - Regressão (feita sobre a β 4.1 + 4.2 juntas): todos os testes sem nenhuma FALHA (tgeral: 437 páginas, 152 escritas, 1970 links, 0 KaTeX; tfunc, calculadoras, física, thome, tcor, texp, surpresas, adesivos, matérias, figuras, mudança do Cálculo, tchaves e tmec por código). Achado no caminho: gravar no localStorage no instante em que o documento nasce (no addInitScript do teste) fazia o Chromium perder às vezes o que o teste tinha gravado antes de recarregar; era do teste, não do site, e o `tests/adm.js` agora espera o documento ficar "interactive".
- **β 4.2** — **Alemão e sânscrito completos, e o Jarvis como busca** (pedido de 15/11/2026; feita na branch `acesso-codigos` junto com a β 4.1; o Lucas testou o ZIP e aprovou).
  - Regra nova dos códigos: cada código vale uma vez; repetir mostra "código já usado", sem animação e sem mudar nada (até "voltar a visitante").
  - Alemão (`ich-will_deutsch4471`) e sânscrito (`om_samskrta8840`): só com o código próprio ou o ADM; o código do russo agora libera só o russo e a barrinha (que mostra alemão e sânscrito com borda tracejada e, ao escolher, o cartão com cadeado). Temas cadastrados: DG01–DG18, DL01–DL08, SG01–SG15, SL01–SL07 (módulos renomeados de DEG/DEL/SAG/SAL para DG/DL/SG/SL, como no pedido; nenhum progresso usava os nomes antigos).
  - Cores trocadas: na β 4.1 alemão e sânscrito ficaram rosados e parecidos. Agora alemão `#ddd188` (dourado) e sânscrito `#e4a281` (açafrão), escolhidas em Python na faixa de claridade e saturação da paleta (distância mínima 27,3 em Lab; 77 e 85 do russo); tema claro `#6f721d` e `#e04b00`.
  - Desenhos: ícone do alemão = portão de Brandemburgo com a quadriga de frente (quatro cavalos e a Vitória com o estandarte); do sânscrito = ॐ dentro de um lótus aberto; os dois em traço luminoso. As páginas de Leitura ganharam a quadriga e o lótus nos desenhos animados.
  - Animações curtas: alemão = três engrenagens engrenando (R₁ω₁ = R₂ω₂; folga de 0,2 módulo conferida em Python: nenhuma ponta de dente invade a outra em 300 instantes; sem a folga, os dentes retos raspavam) com letras góticas aparecendo e sumindo; sânscrito = 16 pétalas de lótus abrindo uma a uma e o ॐ acendendo no centro; Jarvis = o símbolo (anel em 6 arcos + olho) falhando e acendendo como uma luz que acorda. Todas terminam em "acesso liberado · …".
  - Fontes: devanágari e transliteração não tinham fonte no site (dependiam do computador). Agora vêm junto: Noto Sans Devanagari, Inter latin-ext (ā ī ṛ ṣ ṇ ś ẞ) e UnifrakturMaguntia (góticas), todas OFL, de pacotes npm do Fontsource; licenças em `assets/fonts/LICENSE-*.txt`. Conferido com captura (`tests/capturas/fontes42.png`).
  - **Jarvis (busca, sem IA)**, código `talk-to_jarvis_freewill01`: procura em matérias, abas, módulos e temas (dos catálogos, inclusive "em breve") e no conteúdo dos 152 temas escritos (768 seções, fórmulas e termos em negrito, do índice gerado). Sugere enquanto digita; tolera erro (distância de edição até 1 ou 2 letras); sinônimos em `assets/jarvis-config.js`; código de tema vai direto (A08 existe na Física e na Química: vai para o da matéria atual e, na tela inicial, para a Física); fórmula digitada (ex.: "pV = nRT") acha o tema e aparece desenhada com KaTeX; trechinho com a palavra marcada e link direto para a seção; histórico das últimas 8 buscas (`jarvis:buscas`, entra no exportar); Ctrl K / ⌘ K em qualquer página, setas, Enter e Esc.
  - Personagem: dúvida de matéria ("qual a fórmula de…", "como resolve…", "o que é…") → uma das 12+1 frases, sorteada, com o link "Matéria, aba, código · nome" do melhor tema e os 3 temas mais próximos embaixo. Navegação ("onde fica a legenda?", "onde exporto meu progresso?", sumário, códigos, calculadora, tema claro, adesivos, continuar, atalho) → responde e leva ao lugar, com o botão piscando. Não achou → diz e sugere o mais próximo; nunca inventa.
  - Acesso na busca: só aparece o que o nível abre (ADM tudo; tester só Física; visitante com o código do Jarvis só recebe "existe, mas você ainda não tem acesso · ir para códigos?"). Conferido no `tests/tbusca.js` com várias buscas em cada nível, olhando o texto do painel.
  - Índice: `tools/gera-indice.js` abre o site no Chromium, chama o `html(F)` de cada tema sem desenhar e grava `assets/indice-busca.js` (805 KB, carregado só quando a busca é usada; gera em ~2 s). Dicas, resoluções e a explicação do "chuta antes de ver" ficam fora, para o trechinho não entregar resposta. Cada tema guarda a impressão digital do arquivo; o tbusca acusa índice velho.
  - Projeto futuro registrado no CLAUDE.md (não implementado): conversa de verdade exigiria API paga e um programa à parte com servidor.
  - Testes: `tests/tbusca.js` novo (60 conferências); `tests/tacesso.js` ampliado (alemão, sânscrito, Jarvis, "código já usado", barrinha com idiomas trancados); `thome` e `tadesivos`: o campo do Jarvis agora é ativo para o ADM. Capturas: `tests/capturas/anim-42-quadros.png`, `busca-*.png`, `pag42-*.png`, `fontes42.png`.
  - Regressão: a mesma de cima, sem FALHA; tbusca 60 conferências, tacesso 130. O Lucas testou o ZIP e aprovou; juntado ao `main`.
- **β 4.3** — **ADM mais forte: buraco negro, figura e título dourado exclusivos** (pedido de 15/11/2026, depois de o Lucas aprovar a β 4.1 + 4.2, que foram para o `main`). O voo até a versão descrito abaixo foi trocado na β 4.4.
  - Animação nova do ADM (9,1 s, pulável com Esc ou "pular"; com movimento reduzido, pula sozinha): a tela escurece e aparece um buraco negro com disco de acreção girando (anéis na velocidade de Kepler, ∝ r^-1,5), anel de fótons, o arco do disco de trás curvado por cima da sombra e as estrelas em volta desviadas pela lente gravitacional (imagem principal empurrada para fora, a secundária do outro lado: d = (d₀ ± √(d₀² + 4θ_E²))/2). 220 símbolos (cirílico, ∫ ∑ ∮, fórmulas de física e de química, devanágari, números e grego) chegam de todos os lados, espiralando (θ = θ₀ + 2,6·ln(R₀/r)) e esticando na direção do movimento quanto mais perto; cada um engolido deixa o buraco maior e mais brilhante. No auge, clarão e tela do Jarvis; o buraco negro voa pelo caminho de antes (embaixo à esquerda → entre Química e Matemática → versão), com rastro de poeira dourada, e colide: clarão de impacto, raios e ".ADM". O livro ficou só para o tester.
  - Desempenho conferido: 122 quadros em 2 s no começo e 115 no auge (Playwright, Chromium headless).
  - Nome do X01 (bônus da Física) trocado de "A função gam fresco do Lucas" para "Função gama fresco" (pedido do Lucas). Dentro do tema, o símbolo continua se chamando "gam fresco".
  - Figura central "buraco negro" e título dourado: só ADM, travados no motor (`SO_ADM` em `assets/acesso.js`), fora do arquivo de configuração. Para quem não é ADM, a opção nem aparece; se um ADM tinha escolhido e depois voltou a visitante, vale o planeta e a cor original.
  - Título dourado: degradê dourado que anda devagar pelas letras (CSS, 10 s por volta) e, de dentro de "Jarvis", símbolos de 9 a 12 px que sobem ~40 px e somem (um a cada 0,45 s, no máximo 7 de cada vez, param quando a tela inicial sai ou a aba fica escondida; com movimento reduzido, sem símbolos e sem movimento).
  - Testes: `tests/tacesso.js` ganhou 9 conferências (buraco negro no lugar do livro, quadros no começo e no auge, Esc, as 3 figuras do ADM, dourado salvo e discreto, e tester, config, todos os avulsos e todos os avulsos + tester sem buraco negro e sem dourado). Capturas: `tests/capturas/anim-adm-buraco-quadros.png`, `ouro-quadros.png`.
  - Regressão da β 4.3: interrompida no meio (tacesso, tbusca e tgeral sem falha) porque o Lucas pediu mudanças; refeita na β 4.4.
- **β 4.4** — **O buraco negro do ADM vai para o meio e explode** (pedido de 15/11/2026, depois de testar o ZIP da β 4.3).
  - Depois do clarão, o buraco negro não voa mais até a versão: desce até o meio da tela do Jarvis e toma o lugar da figura central (a figura passa a ser o buraco negro e fica salva em `jarvis:figura`; dá para trocar na engrenagem). Lá ele EXPLODE: clarão, três ondas de choque, 40 faíscas, 46 cacos de símbolos voando para fora e a tela tremendo meio segundo. Quando a onda passa pela versão, o ".ADM" acende, dourado (degradê dourado andando, como o título), com um brilho de impacto. Pular (Esc ou botão) aplica tudo de uma vez.
  - ".ADM" dourado sempre que o acesso é de ADM (classe `adm` no sufixo).
  - A figura central "buraco negro" agora é o MESMO desenho da animação: `window.BURACO` em `assets/figuras.js`, usado pelas duas (disco de acreção com faixa de gás e riscos na velocidade de Kepler, anel de fótons, arco da lente por cima). Cores quentes fixas; a "cor própria" do painel gira o matiz inteiro (hue-rotate). Na figura, só os riscos se mexem a cada quadro (barato).
  - Testes: `tests/tacesso.js` confere que, depois da animação (inteira ou pulada), a figura é o buraco negro, o ".ADM" é dourado e nada fica escondido ou tremendo. Capturas: `tests/capturas/anim-adm-buraco-quadros.png` (refeita), `ouro-quadros.png`.
  - Regressão da β 4.4: interrompida (tacesso acusou só o nome antigo de um elemento no próprio teste, já corrigido) porque o Lucas pediu a β 4.5; refeita na β 4.5.
- **β 4.5** — **Beta tester mais forte** (pedido de 15/11/2026).
  - Animação nova do tester (9,1 s, pulável): o livro já aparece ABERTO, sobre um círculo de energia (dois anéis tracejados girando em sentidos opostos, com símbolos em volta); 260 símbolos verdes (números, grego, símbolos de matemática), cada um com o seu ritmo de troca e o seu tom, chegam de TODOS os lados da tela com uma curva leve e um rastro curto, encolhendo até entrar nas páginas; as páginas viram sozinhas (uma a cada 0,55 s) e o livro brilha mais a cada símbolo absorvido; no auge sobe uma coluna de luz verde; clarão, tela do Jarvis e o livro voa até a versão pelo mesmo caminho de antes, com um rastro de símbolos. ".tester" aparece verde (degradê andando), como o ".ADM" é dourado.
  - Cor exclusiva do tester: "esmeralda ✦" na lista de cores do título. Muda o título (degradê verde andando e símbolos verdes pequenininhos subindo de dentro das letras) e a figura central (planeta e galáxia seguem as cores do título; o buraco negro gira o matiz para verde). O ADM também tem. Travada no motor (`A.tituloEsmeralda`), fora do arquivo de configuração: nenhum código avulso libera. O tester não tinha seletor de cor (o arco-íris é do código de configurações); agora ele vê o seletor só com "voltar à cor original" e "esmeralda ✦".
  - Testes: `tests/tacesso.js` confere o livro aberto desde o começo, o círculo de energia e símbolos verdes nos 4 quadrantes da tela, o ".tester" verde, o esmeralda do tester (só ele no seletor, aplicado no título e nas cores da figura, salvo, recarregando e desligando), o ADM com dourado e esmeralda, e configurações e todos os avulsos sem o esmeralda. Capturas: `tests/capturas/anim-tester-quadros.png`, `esmeralda-quadros.png`.
  - Regressão da β 4.5: interrompida no tfis (os 10 testes anteriores, de tacesso a tcalc2, sem nenhuma falha) porque o Lucas pediu a β 4.6; refeita na β 4.6.
- **β 4.6** — **O buraco negro realista é só do título dourado** (pedido de 15/11/2026, depois de testar o ZIP da β 4.5).
  - A figura central "buraco negro" (só do ADM) tem duas formas: a normal é o de arame da β 3.9 (nas cores do tema, como as outras figuras; com o esmeralda, verde); com o título dourado, o realista da animação. Ligar ou tirar o dourado faz uma transição (1,25 s): o de agora gira e encolhe até sumir, um clarão macio com anel se abre e o outro nasce do centro girando, passa um pouco do tamanho e assenta. Vale também para a miniatura do painel. Com movimento reduzido, troca sem animação.
  - Animação do ADM: o realista desce, toma o lugar da figura e explode; se o título não está dourado, logo depois da explosão ele faz a transição e fica o de arame.
  - Testes: `tests/tacesso.js` confere o realista com o dourado, a troca animada ao tirar, o de arame sem o dourado, a volta ao pôr de novo e o de arame no fim da animação do ADM. Captura: `tests/capturas/buraco-troca-quadros.png`.
  - Regressão da β 4.6: 23 execuções, todas com código 0 e nenhuma FALHA (ver "Última regressão" no Estado final). O Lucas testou o ZIP e aprovou; juntada ao `main` com a β 4.3 a 4.5.
- **β 4.7** — **As duas pendências antigas, autorizadas pelo Lucas** (15/11/2026, fim do chat).
  - **N02 (bocal):** o erro era que as bolinhas começavam espalhadas por igual no espaço; no regime permanente a densidade tem que ser ∝ 1/v (fluxo n·v igual em toda seção), e como todas levam o mesmo tempo T para dar a volta, o erro nunca se desfazia: as duas janelas só concordavam na média de um ciclo inteiro. Correção: as bolinhas ficam igualmente espaçadas no tempo de percurso τ(x) = ∫dx/v (tabela com a regra do trapézio e busca binária) e, quando D₁ ou D₂ mudam, cada uma vai para a mesma fração de τ no perfil novo. Conferido em Python (mesmo modelo do JS): antes, janelas de 2 s discordavam até 69% (ex.: 38,5 × 12 bolinhas/s); depois, no máximo 2% (20 × 20,5), com média 20,13 para o fluxo teórico N/T = 20,15; remapeando depois de mudar D₁ = 3 e D₂ = 0,8, continua em 2%. Continuidade intacta: v₂ = 15,98 m/s na janela para 16 esperado (D₁ = 2, D₂ = 0,5, v₁ = 1). No navegador: 12 leituras seguidas, pior diferença 2%; com v₁ = 1,6 o fluxo sobe para 32 bolinhas/s (1,6 × 20). O tfisON agora exige diferença ≤ 10% (antes 25%).
  - **`{,}` vazando:** a causa era `F.n()` (formato de dentro das fórmulas) usado em texto comum, quase sempre nas variações sorteadas dos exercícios. Varri o projeto inteiro de dois jeitos: o tchaves em todos os 152 temas (todas as variações) e uma varredura de todas as páginas montadas (com laboratórios) procurando `{,}`, `$` ou comando do TeX soltos. Eram 32 temas com `{,}`, não 4: A04, A07, A09, A12, A16, C16, C17b, C18, C19, C19b, C20, C21, N02, N03, N04, N06, O02, O03, O04, O05, O07, O08, O10b, T01, U01, U02, U03, U04, U06 e, na matemática, CII03, TE01 e TE04. Corrigidos com um corretor que lê cada modelo de texto e sabe se está dentro ou fora de `$…$` (modelos aninhados herdam o estado; quando a própria expressão põe o `$` em volta, não mexe): 65 trocas `F.n` → `F.nt`, todas revisadas uma a uma. Mais dois casos de fórmula quebrada do mesmo tipo: CI02 (o "R$ 1" do dinheiro abria uma fórmula; virou "1 real") e C04 (`\sum_{i<j}`, em que o navegador lia `<j` como tag; virou `i \lt j`). Depois: tchaves 152 de 152 ok e a varredura sem nenhum caso.
  - Índice da busca regenerado (34 temas mudaram).
  - Fim do chat (sem mudar o site, por isso sem versão nova): os scripts que só existiam na pasta temporária da sessão foram para `tools/` (`conta-temas.js`, `procura-virgula.js`, `corrige-virgula.py`, `captura-anim.js`, `escolhe-cor.py`, ao lado do `gera-indice.js`), todos testados; e o CLAUDE.md ganhou a seção "Para quem continuar daqui", com a passagem de bastão completa.
  - Regressão (sobre a β 4.7): 22 execuções com código 0 e nenhuma FALHA (772 conferências "ok"); tgeral com 437 páginas, 152 escritas, 1970 links, 1310 exercícios, 0 fórmulas quebradas e 0 erros de JavaScript; tchaves nos 152 temas, 152 de 152 ok. O tfisON, que falhava metade das vezes por causa do N02, passou 5 de 5 com a tolerância apertada para 10% (diferenças reais de até 2,5%: 19,8 × 19,8; 19,9 × 19,9; 20,3 × 19,8; 19,8 × 20,3). O Lucas testou o ZIP e aprovou; juntada ao `main`.- **β 4.8** — **Primeiro tema de Química: A01** (sessão de química, 15/11/2026; **na branch `quimica-a01`, ainda não juntada ao `main`**).
  - `temas/quimica/A01.js` no padrão completo (modelo: T02) e laboratório novo `assets/sims/quimica/introducao.js` (uma linha de `<script>` no `index.html`, autorizada pelo Lucas: uma por arquivo de laboratório).
  - Catálogo da química: A01 marcado como escrito; EQ08 e EQ18 com nome e especificação novos (bureta gota a gota; monte o retículo); **7 experimentos novos "em breve", EQ19–EQ25** (tabela periódica que acende, construtor de moléculas, balanceador visual, teste de chama, espectro de emissão, cristalização, repolho roxo), com a especificação de cada um em comentário no catálogo; módulo novo EQs. Próximo código livre: **EQ26**. Os três prioritários: EQ19, EQ20 e EQ21.
  - Fora da pasta da química, com o porquê: `tests/tmaterias.js` (a contagem fixa de temas da química passou de 97 para 104; autorizado, em commit separado), `assets/indice-busca.js` (gerado), versão nos três lugares, `index.html` (a linha do laboratório), `CLAUDE.md` (seção "Sessão de química", autorizada).
  - Contas conferidas em Python (comentário no topo do tema e do laboratório). Testes do tema em 1280 × 900: tmec (0 katex-error, 18 exercícios, 0 sem figura, laboratório, chefão, folha), tchaves ok, texemp (só os zeros finais de propósito), tmaterias tudo ok.

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
1. [x] Módulo de funções especiais (CE01 W de Lambert, CE02 Gama, CE03 integrais ∮; β 1.1) e Cálculo 1 e 2 (27/27 temas, 7 exercícios cada; falta subir para o padrão, ver dívida técnica).
2. Criar uma aba de **jogos interativos** para eletromagnetismo, moderna e elétrica (as partes mais abstratas).
3. O Lucas vai mandar fotos do "pdfzinho de moderna do Claude".
4. O Lucas vai mandar o Halliday 2 (recortado de novo).
5. O Lucas vai mandar provas do ITA e do vestibular coreano (para Simulados S02/S03).

## Falta
- Ver "Dívida técnica" e "Pendências combinadas" no Estado final, no topo.

## Problemas conhecidos
- Depois que o LED queima, é preciso baixar a tensão/subir R antes de "Trocar o LED"; senão ele queima de novo na hora (é física, mas pode confundir).
