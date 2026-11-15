# Modelo de dados do projeto (rotas, códigos e armazenamento)

Escrito na β 2.9, antes da tela inicial (#/home). Regra geral: **o que já existe na física não muda**; as regras novas valem para as matérias que vierem depois. Quando uma regra daqui for implementada, anote a versão ao lado.

## 1. Uma página só

- Tudo roda no mesmo `index.html`, com rotas no hash (`#/...`). Assim todas as matérias e a tela inicial usam o mesmo `localStorage` (o site é aberto pelo ZIP, em `file://`).
- Não criar outro `.html` por matéria.

## 2. Rotas

O primeiro pedaço do hash decide quem desenha a página:

| primeiro pedaço | quem | exemplo | desde |
|---|---|---|---|
| `home` (ou hash vazio) | tela inicial do projeto (Jarvis) | `#/home` | β 2.9 |
| rotas da física (legadas) | site de física, sem mudança | `#/inicio`, `#/calculo`, `#/experimentos`, `#/experimental`, `#/sumario`, `#/C01`, `#/C01/exercicios` | β 1.x |
| id de uma matéria nova | a matéria | `#/quimica` (início), `#/quimica/A01`, `#/quimica/A01/exercicios` | β 3.8 |
| início de cada aba | a área (`AREAS[].inicio`) | `#/matematica-calculo`, `#/olimpiada`, `#/quimica-experimentos`, `#/russo-leitura` | β 3.7 |

- **Palavras reservadas** (não podem ser id de matéria nem código de tema): `home`, `inicio`, `calculo`, `experimentos`, `experimental`, `sumario`, `legenda`.
- **Ids de matéria** são palavras minúsculas sem acento (`fisica`, `quimica`, `matematica`, `russo`). Códigos de tema começam com letra maiúscula e têm número, então os dois nunca se confundem.
- A física continua nas rotas legadas (sem `#/fisica/...`). Se um dia ela mudar, os links antigos têm que redirecionar (como já se faz com `RENOMEADOS`).

## 3. Registro das matérias

Arquivo `assets/materias.js` (desde a β 2.9). Cada matéria é um objeto em `window.MATERIAS`:

| campo | o que é |
|---|---|
| `id` | id da matéria (seção 2) |
| `nome` | nome no botão |
| `desc` | uma linha embaixo do nome |
| `rota` | para onde o botão leva (`"#/inicio"` na física; `"#/quimica/inicio"` nas novas) |
| `cor` | variável de cor do CSS (ex.: `"--mA"`) |
| `icone` | nome do ícone desenhado na tela inicial (`atomo`, `frasco`, `integral`, `cirilico`) |
| `pronta` | `true` = botão funciona; `false` = botão desativado com "em breve" |
| `prefixo` | prefixo do armazenamento da matéria (seção 5) |

Acrescentar uma matéria = acrescentar um objeto aqui. A tela inicial lê esta lista; o código das rotas não precisa mudar para o botão aparecer.

## 4. Códigos de tema

- Física (já existe): códigos sem prefixo (`F01`, `A20`, `C01`, `C03b`, `N05`, `CI04`, `TE02`, `SC01`, `EP10`, `FE03`…). Letras e combinações já usadas: F, A, T, O, C, M, U, N, X, S, CI, CII, CE, TE, SC, EP, FE.
- Matérias novas (β 3.8, códigos do Lucas): **códigos únicos dentro da matéria**; podem repetir os da física (a química tem A01, C01, F01…), porque a rota leva a matéria na frente (`#/quimica/A01`) e o progresso fica no prefixo da matéria. Ids de **módulo** continuam únicos no projeto inteiro (QA–QJ, EQg…).
- Links: sempre `F.href(cod, módulo ou matéria, âncora)`. Dentro da física continuam `#/C01`; `F.achar("quimica/A01")` acha o tema de outra matéria; `F.ret` procura na matéria atual.
- Arquivos: física em `temas/<COD>.js` com `F.registrar("COD", …)`; outras em `temas/<matéria>/<COD>.js` com `F.registrar("<matéria>/<COD>", …)`.

## 5. Armazenamento (`localStorage`)

Toda chave é `prefixo:nome`, sempre lida e gravada com try/catch (o `F.store` já faz isso).

| prefixo | dono | chaves |
|---|---|---|
| `fisica:` | site de física (hoje) | `feitos`, `marca:COD-n`, `chefao:COD`, `menuAbertos`, `mostrarBreve`, `ultimo:<área>`, `codigos` (versão dos códigos) |
| `fisica:` (configurações globais, por herança) | site inteiro | `tema`, `idioma`, `calculadora`, `calculadora2` |
| `jarvis:` | tela inicial e, no futuro, o portal | `cor` (matiz escolhido para o título e o planeta, desde a β 3.0); reservado: perguntas, progresso geral |
| `mat:`, `qui:`, `rus:` | matérias novas (β 3.8; `MATERIAS[].prefixo`) | mesmas chaves da física (`feitos`, `marca:`, `resultado:`, `chefao:`, `ultimo:`), com os códigos delas |

- As configurações globais ficam em `fisica:` por enquanto, para não perder o que já está salvo. Quando o portal precisar, elas migram para `jarvis:cfg:...` com uma função de migração única (como `F.migraDados` da β 2.0).
- Configurações globais (sempre em `fisica:`, em qualquer matéria): `tema`, `idioma`, `mostrarBreve`, `menuAbertos`, `codigos` e as calculadoras.
- Exportar/importar progresso cobre todos os prefixos (`fisica:`, `jarvis:`, `mat:`, `qui:`, `rus:`) desde a β 3.8; a migração de códigos antigos só mexe em `fisica:`.
- O Lucas pediu `fis:` para a física; ficou `fisica:` para não mexer no progresso salvo ("nada de alterar a física"). Trocar exige uma migração única, a decidir.

## 6. Mapa de erros (futuro, ainda não implementado)

- Hoje cada exercício guarda só a **marcação de certeza** (`marca:COD-n` = `●`, `X` ou `/`). Isso não diz se a resposta estava certa.
- Para o mapa de erros: acrescentar `resultado:COD-n` = `certo` ou `errado` (o aluno marca depois de abrir a resposta). Erro com ● é o mais grave; acerto com X ou / é ponto frágil.
- O portal junta `marca:` e `resultado:` de todos os prefixos.
