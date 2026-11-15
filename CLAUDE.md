# CLAUDE.md — Jarvis (sistema de estudo do Lucas)

Leia este arquivo e o `PROGRESSO.md` antes de qualquer coisa. Não pergunte de novo o que já está decidido aqui.

## Quem sou eu
- Lucas Nigro, 1ª série do Ensino Médio, Colégio Poliedro, itinerário de física, turma ITA.
- Finalista da OBF 2026; meta: ouro e seletivas internacionais. Olimpíadas russas (Fiztech/MIPT) e final de olimpíada russa de matemática em fevereiro de 2027.
- Já sei derivada e integral. Inglês C1, russo iniciante.
- Aprendo melhor com números concretos antes da teoria abstrata, e com figura em todo exemplo e exercício.
- Método dos Simulados e Estudo Direcionado: simulado diagnóstico (1 questão por tópico) → mapa de erros → estudo direcionado → novo simulado com peso nos erros.
- Marcação de certeza: ● certeza, X dúvida, / chutei. No mapa de erros, separar: erro de conteúdo, conta na pressa, interpretação/pegadinha.

## Como falar comigo
- Toda resposta começa com uma palavra do português culto (significado + exemplo curto) e uma frase de filósofo com o autor (só citações autênticas).
- Português casual com gramática impecável. Conversa curta, texto simples.
- Dica antes de resposta; resolução completa só se eu pedir.
- Honestidade: dizer exatamente o que não ficou pronto. Nunca inventar dado nem dizer que testou o que não testou.
- Não escrevo o número que vem depois do 12: escrevo "12+1".

## O projeto (Jarvis)
- Este repositório é o meu sistema de estudo pessoal. Tela inicial (`#/home`) com um botão por matéria; cada matéria tem suas abas.
- **Física**: abas Física, Cálculo (vai sair daqui), Experimentos e Experimental. Módulos F, A, T, O, C, M, U, N.
- **Matemática**: abas Matemática (MB, AR, GE, AL), Cálculo (Cálculo 3 e 4 "em breve"; o 1 e o 2 vêm da física depois) e Olimpíada e demonstrações (DM, TNO, DES, CBO, GEO, FUN, PRI). 114 temas cadastrados "em breve" (β 3.8).
- **Química**: abas Química (módulos A–J: introdução, atomística, ligações, reações e estequiometria, físico-química I e II, eletroquímica, orgânica, bioquímica e ambiental, analítica; 79 temas) e Experimentos (módulos QG, QR, QE, QN, QT; EQ01–EQ18, simulações no padrão dos de física). Todos "em breve" (β 3.8).
- **Russo**: abas Gramática (RG01–RG18) e Leitura e tradução (RL01–RL08), todos "em breve" (β 3.8). Vocabulário solto fica no Anki, não no site; o botão "Exportar para o Anki" está previsto e desativado na aba Leitura (implementar depois). Cor: `--mR` (azul-céu, escolhida em Python como a mais distante da paleta).
- Depois de tudo: portal com progresso geral, mapa de erros e busca única. Bem mais tarde: um programa à parte usando a API.

## Padrão de cada tema
- Pergunta de abertura; laboratório interativo; "chuta antes de ver" (`F.chute`); teoria com os teoremas essenciais demonstrados passo a passo (~10 páginas nos temas grandes, 6 a 8 nos pequenos); pelo menos 3 exemplos passo a passo com figura; caixas Pense como físico, Pegadinha, Nível olimpíada e Ponte para a universidade; resumo (folha de fórmulas); 15 a 20 exercícios nos níveis Físico e Máximo; 1 chefão Impossível 99 original, nível máximo, que destrava depois dos exercícios.
- Dicas em degraus: dica 1 aponta o caminho, dica 2 ajuda mais, resolução só se eu clicar.
- Figuras próprias em tudo (SVG ou canvas, kit `D` em `assets/desenho.js`). Nada copiado de livro.
- Marcações: [n]← (link), ★ cai muito em OBF/ITA, ! difícil, !! muito difícil, ? confuso, ∫ exige cálculo, ITA, RU.

## Estilo e técnica
- Tema escuro, uma cor por módulo, faixa do topo que some ao descer, menu lateral, `index.html` único com rotas por hash.
- Conteúdo separado do código: temas em `temas/<COD>.js` (`F.registrar`), simulações em `assets/sims/*.js` (`window.SIM`), motor em `assets/app.js`, catálogos por matéria (`assets/catalogo.js` Física, `assets/catalogo-matematica.js`, `assets/catalogo-quimica.js`), matérias da tela inicial em `assets/materias.js`.
- Base comum (β 3.7): as três matérias usam o mesmo motor, CSS e componentes. Cada aba é uma área em `AREAS` (campos `materia`, `inicio`, `titulo`, `anim`, `icone`); o topo mostra só as abas da matéria atual; a única diferença visual entre matérias é a cor (`--materia`). Ids de módulo nunca se repetem no projeto (Química usa QA–QJ para os módulos A–J e EQg, EQr, EQe, EQn, EQt para os de Experimentos). Códigos de tema são únicos dentro de cada matéria: a física fica nas rotas antigas (`#/A01`), as outras levam a matéria na frente (`#/quimica/A01`); arquivos em `temas/<matéria>/<COD>.js` com `F.registrar("<matéria>/<COD>", …)`. Links sempre com `F.href(cod, módulo ou matéria, âncora)`.
- Componentes reutilizáveis: `F.secao`, `F.formula`, `F.caixa`, `F.demo`, `F.exemplo`, `F.exercicio`, `F.chefao`, `F.lab`, `F.revela`, `F.chute`, `F.ret`. **Nunca criar componente novo sem necessidade**: estender o que existe com campos opcionais (ex.: `F.exercicio` aceita `certa`, `num: {v, tol, un}`, `nivel`).
- KaTeX só dentro de `$…$`; número em texto comum com `F.nt`, dentro de fórmula com `F.n`. Química com `\ce{}` (mhchem carregado).
- Progresso no `localStorage` com prefixo por matéria (β 3.8): física `fisica:` (mantido, para não mexer no que já está salvo), matemática `mat:`, química `qui:`, russo `rus:`; tela inicial `jarvis:`. Configurações do site inteiro (tema, idioma, menu, filtro "em breve", calculadoras) ficam em `fisica:`. O exportar/importar leva todos os prefixos.
- Cada matéria se registra num arquivo de configuração: acrescentar matéria, aba, módulo ou tema é só editar esse arquivo.
- Cada matéria e cada aba tem o seu desenho animado na página inicial, leve, em SVG ou CSS.

## Qualidade
- Toda conta de exemplo, exercício e solução conferida rodando em Python (anotar os números no comentário do topo do tema).
- A física de cada simulação conferida, inclusive casos limite.
- Nenhuma fórmula quebrada (procurar `katex-error`). Nenhum tema escrito pode abrir vazio.
- Rodar os testes de `tests/` antes de cada commit (`node tests/tgeral.js`, `tests/tmec.js <códigos>`, `tests/tchaves.js <códigos>`, `tests/tadesivos.js` para a tela inicial, `tests/tmaterias.js` para a base das matérias, `tests/tsegredo.js` e `tests/tsegredo2.js` para as surpresas, `tests/tfiguras.js` para a figura central etc.); não commitar com teste quebrado. Conferir também as linhas FALHA, não só o código de saída. Capturas de teste ficam fora do git.
- Testar o site de verdade com Playwright e olhar as capturas (`node tests/shotmec.js <COD> "<seletor>@0"` → `tests/capturas/`).

## Decisões de projeto já tomadas
- A versão (β x.y) aparece ao lado de "Jarvis" na tela inicial, no mesmo degradê do título e mudando de cor junto.
- Experimentos novos ganham o próximo código livre (EP11, EP12, ...): códigos antigos nunca são reaproveitados, para não quebrar o progresso salvo. Cada experimento fica no módulo do assunto; se não houver módulo, cria-se um.
- Experimento = simulação interativa que se mexe, com controles, uma explicação curta e sem exercícios.
- Existe uma surpresa escondida na página inicial dos Experimentos e outra na página inicial da Matemática. Elas NUNCA podem ser mencionadas em nenhum texto do site (detalhes só no PROGRESSO.md, β 3.4 e β 3.8).
- Adesivos da tela inicial (pedido de 15/11/2026): engrenagem ao lado do campo "Perguntar algo ao Jarvis" abre o painel (modo de edição). Todos os adesivos já vêm disponíveis (nada destravável, nada bloqueado) e são estáticos, sem animação. Desenhos originais em SVG, na cor da categoria (Física, Química, Matemática, Russo e Olimpíadas, Meus). Nunca ficam por cima de nada clicável; a camada fica atrás da interface com pointer-events: none. Cadastro em `assets/adesivos.js` (campo `trava` preparado para o futuro, hoje sempre null); salvos em `jarvis:adesivos`, que entra no exportar/importar.
- Painel da engrenagem (β 3.9) = "Personalizar": seção "Figura central" (miniaturas para escolher a figura do meio da tela inicial; cor própria ou "acompanhar a cor do tema"; velocidade com posição "parado"), cadastro em `assets/figuras.js` (acrescentar figura = acrescentar um objeto; cores sempre com `--fg1..3`), salva em `jarvis:figura`; e a seção Adesivos, que ganhou a categoria Cientistas (Newton, Einstein, Marie Curie). Figuras em arame luminoso, leves; o planeta com anel continua sendo a padrão.
- Tema novo já nasce no padrão completo; os temas antigos que não estão no padrão estão listados como dívida técnica no PROGRESSO.md.

## O que eu já decidi que não quero
- Sistema de XP ou grau de feiticeiro: não implementar.
- Versão de celular: só no fim do projeto.
- Repetição espaçada de vocabulário de russo dentro do site.

## Pendências combinadas
- Modelo de dados (`docs/MODELO_DE_DADOS.md`): prefixos por matéria e rotas por matéria implementados na β 3.8. Falta decidir: renomear a física de `fisica:` para `fis:` (exige migrar o progresso salvo; hoje não foi feito) e o mapa de erros (registro de acerto e erro).
- Mover o Cálculo da física para matemática, numa branch de teste, com o meu progresso exportado antes.
- Ativar o GitHub Pages.

## Regra fixa
- Sempre que eu decidir algo novo, atualize o CLAUDE.md na mesma hora. Sempre que terminar um tema ou tarefa, atualize o PROGRESSO.md. Nunca termine uma sessão sem os dois atualizados.
- Versão: cada entrega soma 0,1 (`VERSAO` em `assets/catalogo.js`, título do `index.html`, `README.md`). Commit e push no `main` de LucasNGuanda/site-fisica.
