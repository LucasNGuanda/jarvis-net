/* =====================================================================================================
   JARVIS — dicionário de ABREVIAÇÕES e SINÔNIMOS da busca (o autor edita este arquivo à vontade).
   Sem IA e sem API: é só uma tabela "o que eu digito" → "o que a busca procura também".

   Como escrever:
     "o que eu digito": ["o que procurar no lugar", "outra opção"],
   • Pode escrever com ou sem acento, com maiúscula ou minúscula: a busca normaliza tudo.
   • A chave pode ter mais de uma palavra ("regra de tres").
   • O lado direito deve usar palavras que EXISTEM no site (nome de tema, de seção ou termo em negrito).
   • Chave com erro de digitação pequeno também vale ("baskara" acha a entrada "bhaskara"): não precisa cadastrar os erros.
   • abreviacoes: valem como se a pessoa tivesse digitado o nome inteiro (peso cheio).
     sinonimos:   valem um pouco menos que a palavra original (a palavra digitada continua sendo procurada).
   Depois de editar, rode: node tests/tbuscalista.js   (a lista de buscas de teste) e node tests/tbusca.js
   ===================================================================================================== */
window.JARVIS_SIN = {
  abreviacoes: {
    /* física */
    "mru": ["movimento retilineo uniforme"],
    "mruv": ["movimento retilineo uniformemente variado"],
    "muv": ["movimento retilineo uniformemente variado"],
    "mcu": ["movimento circular"],
    "mhs": ["movimento harmonico simples"],
    "ddp": ["potencial eletrico", "diferenca de potencial"],
    "fem": ["geradores e receptores", "forca eletromotriz"],
    "cm": ["centro de massa"],
    "qdm": ["quantidade de movimento"],
    "mcuv": ["movimento circular"],
    "rc": ["circuitos rc"],
    "rl": ["circuitos rl"],
    /* matemática */
    "pa": ["progressao aritmetica"],
    "pg": ["progressao geometrica"],
    "tfc": ["teorema fundamental do calculo"],
    "mmc": ["minimo multiplo comum"],
    "mdc": ["maximo divisor comum"],
    "edo": ["equacoes diferenciais ordinarias"],
    "log": ["logaritmos"],
    "tfa": ["teorema fundamental da algebra", "equacoes algebricas"],
    /* química */
    "cntp": ["volume molar", "gases ideais"],
    "nox": ["oxirreducao"],
    "tom": ["teoria dos orbitais moleculares"],
    "vsepr": ["geometria molecular"],
    "kps": ["produto de solubilidade"],
    "dna": ["acidos nucleicos"],
    "rna": ["acidos nucleicos"],
  },
  sinonimos: {
    /* física */
    "resistencia eletrica": ["resistores", "lei de ohm"],
    "resistencia": ["resistores"],
    "voltagem": ["potencial eletrico"],
    "tensao eletrica": ["potencial eletrico"],
    "queda livre": ["lancamento vertical", "movimento retilineo uniformemente variado"],
    "lancamento obliquo": ["lancamentos"],
    "momento linear": ["quantidade de movimento"],
    "choque": ["colisoes"],
    "torque": ["equilibrio de corpo extenso", "rotacao"],
    "som": ["acustica"],
    "espelho": ["espelhos"],
    "ima": ["campo magnetico"],
    "magnetismo": ["campo magnetico"],
    "eletrostatica": ["carga eletrica", "forca eletrica", "campo eletrico"],
    "eletromagnetismo": ["inducao eletromagnetica", "campo magnetico"],
    "termodinamica": ["lei da termodinamica"],
    "satelite": ["gravitacao"],
    "orbita": ["leis de kepler", "gravitacao"],
    "pressao": ["hidrostatica"],
    "mola": ["movimento harmonico simples"],
    /* matemática */
    "bhaskara": ["funcao quadratica", "equacoes e problemas"],
    "segundo grau": ["funcao quadratica", "equacoes e problemas"],
    "2 grau": ["funcao quadratica", "equacoes e problemas"],
    "primeiro grau": ["funcao afim"],
    "regra de tres": ["razao e proporcao"],
    "porcentagem": ["razao e proporcao"],
    "numeros complexos": ["forma algebrica do numero complexo", "unidade imaginaria"],
    "numero complexo": ["forma algebrica do numero complexo", "unidade imaginaria"],
    "parabola": ["funcao quadratica"],
    "reta": ["funcao afim"],
    "modulo": ["funcao modular"],
    "briot ruffini": ["operacoes com polinomios"],
    "ruffini": ["operacoes com polinomios"],
    "girard": ["equacoes algebricas"],
    "cramer": ["sistemas lineares"],
    "escalonamento": ["sistemas lineares"],
    "pascal": ["binomio de newton"],
    "de moivre": ["forma trigonometrica"],
    "limite": ["funcoes e limites"],
    "fatorar": ["fatoracao"],
    "raiz quadrada": ["potenciacao e radiciacao"],
    /* química */
    "mol": ["massa molar", "estequiometria"],
    "estequiometria": ["calculo estequiometrico"],
    "acido": ["funcoes inorganicas", "ph e poh"],
    "base": ["funcoes inorganicas"],
    "sal": ["funcoes inorganicas"],
    "pilha": ["pilhas e potenciais padrao"],
    "bateria": ["pilhas e potenciais padrao"],
    "ferrugem": ["corrosao"],
    "isomero": ["isomeria"],
    "plastico": ["polimeros"],
    "sabao": ["carboidratos e lipideos"],
    "proteina": ["aminoacidos proteinas e enzimas"],
    "titulacao": ["titulometria"],
    "equilibrio quimico": ["kc kp"],
  },
};
