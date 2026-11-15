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
- **Física**: 3 abas, Física, Experimentos e Experimental (o Cálculo foi para a matemática na β 4.0). Módulos F, A, T, O, C, M, U, N.
- **Matemática**: abas Matemática (MB, AR, GE, AL), Cálculo (Cálculo 1 e 2, Cálculo 3 e 4 "em breve", Funções especiais e integrais, Teoremas, Simulados de Cálculo: os 27 temas escritos vieram da física na β 4.0, com os mesmos módulos K1–K5, ordem e códigos) e Olimpíada e demonstrações (DM, TNO, DES, CBO, GEO, FUN, PRI). 141 temas (27 escritos; os outros 114 "em breve").
- **Química**: abas Química (módulos A–J: introdução, atomística, ligações, reações e estequiometria, físico-química I e II, eletroquímica, orgânica, bioquímica e ambiental, analítica; 79 temas) e Experimentos (módulos QG, QR, QE, QN, QT; EQ01–EQ18, simulações no padrão dos de física). Todos "em breve" (β 3.8).
- **Idiomas** (β 4.1, completados na β 4.2): Russo, Alemão e Sânscrito dividem um cartão na tela inicial, com a barrinha Я / DE / सं à direita (troca nome, cor e desenho; salvo em `jarvis:lingua`; idioma trancado aparece com borda tracejada e o cartão com cadeado). Cada idioma tem as abas Gramática e Leitura e tradução. Cadastro: `idioma: true` em `assets/materias.js`; abas e módulos do alemão (DG01–DG18, DL01–DL08) e do sânscrito (SG01–SG15, SL01–SL07; objetivo: ler a Bhagavad Gita) em `assets/catalogo-idiomas.js`, todos "em breve". Cores `--mDE` (dourado) e `--mSA` (açafrão), escolhidas em Python longe da paleta e do russo; prefixos `rus:`, `ale:`, `san:`.
- **Alemão e sânscrito são só do Lucas**: abrem só com o código próprio de cada um ou com o ADM. O código do russo libera o russo e a barrinha, não os outros dois; o tester também não vê.
- Fontes no próprio site (nada depende do computador): Inter (latim, latin-ext para ā ī ṛ ṣ ṇ ś, cirílico, grego), Noto Sans Devanagari e UnifrakturMaguntia (letras góticas da animação do alemão), todas OFL, licenças em `assets/fonts/`.
- **Russo**: abas Gramática (RG01–RG18) e Leitura e tradução (RL01–RL08), todos "em breve" (β 3.8). Vocabulário solto fica no Anki, não no site; o botão "Exportar para o Anki" está previsto e desativado na aba Leitura (implementar depois). Cor: `--mR` (azul-céu, escolhida em Python como a mais distante da paleta).
- Depois de tudo: portal com progresso geral e mapa de erros (a busca única já existe: o Jarvis, β 4.2). Bem mais tarde: um programa à parte usando a API (ver "Projeto futuro" abaixo).

## Padrão de cada tema
- Pergunta de abertura; laboratório interativo; "chuta antes de ver" (`F.chute`); teoria com os teoremas essenciais demonstrados passo a passo (~10 páginas nos temas grandes, 6 a 8 nos pequenos); pelo menos 3 exemplos passo a passo com figura; caixas Pense como físico, Pegadinha, Nível olimpíada e Ponte para a universidade; resumo (folha de fórmulas); 15 a 20 exercícios nos níveis Físico e Máximo; 1 chefão Impossível 99 original, nível máximo, que destrava depois dos exercícios.
- Dicas em degraus: dica 1 aponta o caminho, dica 2 ajuda mais, resolução só se eu clicar.
- Figuras próprias em tudo (SVG ou canvas, kit `D` em `assets/desenho.js`). Nada copiado de livro.
- Marcações: [n]← (link), ★ cai muito em OBF/ITA, ! difícil, !! muito difícil, ? confuso, ∫ exige cálculo, ITA, RU.

## Estilo e técnica
- Tema escuro, uma cor por módulo, faixa do topo que some ao descer, menu lateral, `index.html` único com rotas por hash.
- Conteúdo separado do código: temas da física em `temas/<COD>.js` e das outras matérias em `temas/<matéria>/<COD>.js` (`F.registrar`), simulações em `assets/sims/*.js` (`window.SIM`), motor em `assets/app.js`, catálogos por matéria (`assets/catalogo.js` Física, `assets/catalogo-matematica.js`, `assets/catalogo-quimica.js`), matérias da tela inicial em `assets/materias.js`.
- Base comum (β 3.7): as três matérias usam o mesmo motor, CSS e componentes. Cada aba é uma área em `AREAS` (campos `materia`, `inicio`, `titulo`, `anim`, `icone`); o topo mostra só as abas da matéria atual; a única diferença visual entre matérias é a cor (`--materia`). Ids de módulo nunca se repetem no projeto (Química usa QA–QJ para os módulos A–J e EQg, EQr, EQe, EQn, EQt para os de Experimentos). Códigos de tema são únicos dentro de cada matéria: a física fica nas rotas antigas (`#/A01`), as outras levam a matéria na frente (`#/quimica/A01`); arquivos em `temas/<matéria>/<COD>.js` com `F.registrar("<matéria>/<COD>", …)`. Links sempre com `F.href(cod, módulo ou matéria, âncora)`.
- Componentes reutilizáveis: `F.secao`, `F.formula`, `F.caixa`, `F.demo`, `F.exemplo`, `F.exercicio`, `F.chefao`, `F.lab`, `F.revela`, `F.chute`, `F.ret`. **Nunca criar componente novo sem necessidade**: estender o que existe com campos opcionais (ex.: `F.exercicio` aceita `certa`, `num: {v, tol, un}`, `nivel`).
- KaTeX só dentro de `$…$`; número em texto comum com `F.nt`, dentro de fórmula com `F.n`. Química com `\ce{}` (mhchem carregado).
- Progresso no `localStorage` com prefixo por matéria (β 3.8): física `fisica:` (mantido, para não mexer no que já está salvo), matemática `mat:`, química `qui:`, russo `rus:`; tela inicial `jarvis:`. Configurações do site inteiro (tema, idioma, menu, filtro "em breve", calculadoras) ficam em `fisica:`. O exportar/importar leva todos os prefixos. O progresso do Cálculo foi copiado de `fisica:` para `mat:` na β 4.0 (migração única e não destrutiva; cópia de segurança em `jarvis:backup:antes-calculo`); links antigos `#/CI07` e `#/calculo` redirecionam para a matemática.
- Cada matéria se registra num arquivo de configuração: acrescentar matéria, aba, módulo ou tema é só editar esse arquivo.
- Cada matéria e cada aba tem o seu desenho animado na página inicial, leve, em SVG ou CSS.
- **Acesso por código** (β 4.1): o site começa trancado (visitante vê só a tela inicial). Página `#/codigos` com 3 linhas: ADM (tudo), tester (só a Física; o resto "em construção"; engrenagem trancada) e avulsos (física, matemática, química, idiomas = russo e a barrinha, configurações, alemão, sânscrito e Jarvis). Cada código vale uma vez: repetir mostra "código já usado", sem animação (até "voltar a visitante"). Os códigos e o nível de cada matéria, aba, parte da engrenagem e adesivo ficam em `assets/acesso-config.js` (o Lucas edita esse arquivo conforme cada parte fica pronta); motor em `assets/acesso.js`; página e animações em `assets/codigos.js`. Salvo em `jarvis:acesso` (entra no exportar/importar). Sufixo na versão: ".ADM" ou ".tester". Código errado: aviso discreto, sem animação e sem pista. Toda animação pode ser pulada. Não é segurança de verdade (site estático) e nunca deve ser apresentado como tal. Surpresa → código: campo `easterEggs` previsto, não implementado.
- **Exclusivos do ADM** (β 4.3), fixos no motor (`assets/acesso.js`, `SO_ADM`), de propósito FORA do `acesso-config.js`: nenhum outro código libera, nem agora nem depois (nem `give-meskinn`, nem avulso, nem tester). São: a figura central "buraco negro" (quem não é ADM não vê nem a opção) e o título "Jarvis" dourado (degradê dourado andando pelas letras e símbolos pequenininhos subindo de dentro delas; opção "dourado ✦" na lista de cores, salva em `jarvis:cor = "dourado"`). O adesivo "Buraco negro" da Física é outra coisa e continua com o código de configurações.
- Animações de liberação: ADM = buraco negro que suga símbolos de todas as matérias, desce até o meio da tela do Jarvis, vira a figura central e explode; a onda acende o ".ADM" dourado (β 4.4). Tester = livro com feixe verde (diferença proposital).
- A figura central "buraco negro" é o mesmo desenho da animação (`window.BURACO` em `assets/figuras.js`); mudar um muda o outro.
- **Jarvis = busca, SEM IA** (β 4.2): o campo "Perguntar algo ao Jarvis" só procura dentro do site (nomes de temas, seções, fórmulas, termos, cientistas, módulos, matérias), sugere enquanto digita, tolera erro de digitação, usa sinônimos, vai direto com um código de tema, guarda as últimas buscas (`jarvis:buscas`) e abre com Ctrl K em qualquer página. Não existe painel de chat, nem chamada de API, nem lugar esperando chave. Código próprio (`jarvis`); sem ele (e fora do ADM) o campo fica "em breve". Só acha o que o nível de quem busca pode abrir; se só houver coisa trancada, responde "existe, mas você ainda não tem acesso · ir para códigos?", sem nome, trecho ou código. Dúvida de matéria → não responde: sorteia uma das 12+1 frases do personagem com o link do tema e mostra os 3 temas mais próximos. Pergunta de navegação → responde e leva ao lugar. Nunca inventa tema: se não achar, diz e sugere o mais próximo.
- Arquivos do Jarvis: `assets/jarvis-config.js` (sinônimos, perguntas de navegação, frases, palavras vazias; o Lucas edita), `assets/jarvis-busca.js` (motor e tela), `assets/indice-busca.js` (GERADO: não editar à mão). **Depois de escrever ou mudar um tema, rodar `node tools/gera-indice.js`**; o `tests/tbusca.js` acusa índice desatualizado. Dicas, resoluções e a explicação do "chuta antes de ver" ficam fora do índice, para o trechinho não entregar resposta.
- **Projeto futuro (NÃO implementar até o Lucas pedir):** um modo de conversa de verdade, em que o Jarvis responde dúvidas de matéria. Exigiria API paga e um programa à parte, com servidor, porque chave de API nunca pode ficar dentro de um site estático. Por enquanto o Jarvis é só busca com personagem.
- Testes: o site começa trancado, então todo teste novo que não seja de acesso chama `require('./adm')(p)` logo depois de abrir a página. Busca: `tests/tbusca.js`; acesso: `tests/tacesso.js`.

## Qualidade
- Toda conta de exemplo, exercício e solução conferida rodando em Python (anotar os números no comentário do topo do tema).
- A física de cada simulação conferida, inclusive casos limite.
- Nenhuma fórmula quebrada (procurar `katex-error`). Nenhum tema escrito pode abrir vazio.
- Rodar os testes de `tests/` antes de cada commit (`node tests/tgeral.js`, `tests/tmec.js <códigos>`, `tests/tchaves.js <códigos>`, `tests/tadesivos.js` para a tela inicial, `tests/tmaterias.js` para a base das matérias, `tests/tsegredo.js` e `tests/tsegredo2.js` para as surpresas, `tests/tfiguras.js` para a figura central, `tests/tmudacalculo.js` para a mudança do Cálculo etc.); não commitar com teste quebrado. Conferir também as linhas FALHA, não só o código de saída. Capturas de teste ficam fora do git.
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
- Ativar o GitHub Pages.

## Regra fixa
- Sempre que eu decidir algo novo, atualize o CLAUDE.md na mesma hora. Sempre que terminar um tema ou tarefa, atualize o PROGRESSO.md. Nunca termine uma sessão sem os dois atualizados.
- Entregas grandes (pedido de 15/11/2026, como na mudança do Cálculo e no acesso/Jarvis): trabalhar numa branch, mandar o ZIP com a lista do que testar e só juntar ao `main` depois que o Lucas aprovar.
- Versão: cada entrega soma 0,1 (`VERSAO` em `assets/catalogo.js`, título do `index.html`, `README.md`). Commit e push no `main` de LucasNGuanda/site-fisica.
