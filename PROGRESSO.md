# PROGRESSO — Site de Física do Lucas

## Versões
Cada versão soma 0,1 (`VERSAO` em `assets/catalogo.js`; tag git `beta-0.X`).
- **β 0.1** — esqueleto + C07 Lei de Ohm e Resistores.
- **β 0.2** — área **Cálculo** (aba ∫•∫ no topo; Cálculo 1 e Cálculo 2, temas listados, ainda sem conteúdo); início sem o texto, com átomo animado (Física) e somas de Riemann + reta tangente animadas (Cálculo); módulo **Bônus** com X01 A função γ̃ (5 laboratórios + análise: mínimo, limite em 0, convexidade de ln γ̃); módulo **Simulados** (S00, página de entrada; questões virão com a fonte, ex. [ITA 2010]); selo da versão no topo.

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
- [x] C07 Lei de Ohm e Resistores: abertura, 3 laboratórios (circuito vivo com LED que queima + fumaça e modelo exponencial via W de Lambert; curva U×i com R estática/dinâmica; bancada do fio com temperatura e "esticar"), chute, ideia física, teoria em 9 partes com 5 demonstrações, exemplário com 5 casos sorteados, resumo, 16 exercícios (9 Físico + 7 Máximo), chefão "O LED teimoso"

## Conferências do C07
- Contas de todos os exercícios e do chefão conferidas em Python (scipy.lambertw / brentq).
- 0 katex-error (com todas as dicas e resoluções abertas); 75 exemplos sorteados sem NaN.
- Testado: progresso salva e volta após recarregar; chefão destrava; tema claro; sem erros de JS.

## Conferências da β 0.2
- X01: 0 katex-error; modo curto e modo integral dão o mesmo valor (0,7711 em x = 0,5); mínimo conferido em Python (x ≈ 0,4685, valor ≈ 0,7704).
- Menu troca de área conforme a aba; sem erros de JS.

## Falta
- Noites 1–11 do briefing (todos os outros temas), unidades e constantes (CODATA), simulados por módulo, formulário com busca, mapa de pré-requisitos.

## Problemas conhecidos
- Depois que o LED queima, é preciso baixar a tensão/subir R antes de "Trocar o LED"; senão ele queima de novo na hora (é física, mas pode confundir).
