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
| id de uma matéria nova | a matéria | `#/quimica/inicio`, `#/quimica/QG01` | quando a química existir |

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
- Matérias novas: **códigos únicos no projeto inteiro**, com uma letra ou sigla que a física não usa. Sugestão: química `Q` (QG01 geral, QO01 orgânica…), matemática `MA`, russo `R`. O "C" de química **não** pode ser usado (bate com C01 de Eletricidade).
- Links entre matérias usam o código com a rota da matéria: `#/quimica/QG01`. Dentro da física continuam `#/C01`.

## 5. Armazenamento (`localStorage`)

Toda chave é `prefixo:nome`, sempre lida e gravada com try/catch (o `F.store` já faz isso).

| prefixo | dono | chaves |
|---|---|---|
| `fisica:` | site de física (hoje) | `feitos`, `marca:COD-n`, `chefao:COD`, `menuAbertos`, `mostrarBreve`, `ultimo:<área>`, `codigos` (versão dos códigos) |
| `fisica:` (configurações globais, por herança) | site inteiro | `tema`, `idioma`, `calculadora`, `calculadora2` |
| `jarvis:` | tela inicial e, no futuro, o portal | nenhuma ainda (reservado: perguntas, progresso geral) |
| `quimica:`, `matematica:`, `russo:` | matérias novas | mesmas chaves da física, com os códigos delas |

- As configurações globais ficam em `fisica:` por enquanto, para não perder o que já está salvo. Quando o portal precisar, elas migram para `jarvis:cfg:...` com uma função de migração única (como `F.migraDados` da β 2.0).
- Exportar/importar progresso hoje cobre só `fisica:`. Quando houver outra matéria, o backup passa a incluir todos os prefixos da seção 5.

## 6. Mapa de erros (futuro, ainda não implementado)

- Hoje cada exercício guarda só a **marcação de certeza** (`marca:COD-n` = `●`, `X` ou `/`). Isso não diz se a resposta estava certa.
- Para o mapa de erros: acrescentar `resultado:COD-n` = `certo` ou `errado` (o aluno marca depois de abrir a resposta). Erro com ● é o mais grave; acerto com X ou / é ponto frágil.
- O portal junta `marca:` e `resultado:` de todos os prefixos.
