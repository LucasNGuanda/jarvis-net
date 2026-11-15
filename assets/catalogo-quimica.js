/* Química (β 3.7): áreas (abas do topo) e módulos. Mesmo formato do assets/catalogo.js: acrescentar módulo ou tema é só editar aqui.
   Os ids dos módulos levam um Q na frente (QA … QJ) para não colidir com os da Física (A, C, F, T…); a letra mostrada é A … J.
   Temas cadastrados na β 3.8, todos "em breve". Os da aba Experimentos usam ids internos EQg, EQr, EQe, EQn, EQt, EQs (a letra mostrada é QG, QR, QE, QN, QT, QS)
   para não colidir com os módulos QE e QG da aba Química. Códigos de tema são únicos dentro da química; a rota é #/quimica/<COD>. Fórmulas químicas com \ce{} (mhchem já carregado). */
window.AREAS.push(
  { id:"qui", materia:"quimica", nome:"Química", inicio:"quimica", titulo:"Química", anim:"benzeno", icone:`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 4h8M13.5 4v8L6 25.5A2 2 0 0 0 7.8 28.5h16.4a2 2 0 0 0 1.8-3L18.5 12V4"/><path d="M9.5 20h13" style="stroke:var(--mN)"/><circle cx="14" cy="23.5" r="1.3" style="fill:var(--mN);stroke:none"/><circle cx="18.5" cy="24.5" r="1" style="fill:var(--mN);stroke:none"/></svg>` },
  { id:"quiexp", materia:"quimica", nome:"Experimentos", inicio:"quimica-experimentos", titulo:"Experimentos de química", anim:"bequer", icone:`<svg viewBox="0 0 32 32" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 6h18M9 6v19a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V6" style="stroke:currentColor" stroke-width="1.8"/><path d="M9.5 16h13v9a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 9.5 25z" style="fill:color-mix(in srgb,var(--mN) 30%,transparent)"/><circle cx="14" cy="21" r="1.6" style="stroke:var(--mN)" stroke-width="1.3"/><circle cx="18.5" cy="18.5" r="1.1" style="stroke:var(--mN)" stroke-width="1.2"/><circle cx="16.5" cy="12" r="1" style="stroke:var(--mN)" stroke-width="1.1"/></svg>` },
);
window.CATALOGO.push(
  { id:"QA", area:"qui", letra:"A", cor:"--mF", nome:"Introdução à química", desc:"Matéria, substâncias, misturas e separação.", temas:[
    ["A01","Objetivos e ramos da química; método científico",[],true],
    ["A02","Matéria, energia e propriedades da matéria",[],true],
    ["A03","Estados físicos e mudanças de estado",[],true],
    ["A04","Substâncias puras e misturas; alotropia",[],true],
    ["A05","Separação de misturas e grau de pureza",[],true],
    ["A06","Fenômenos físicos e químicos",[],true],
    ["A07","Densidade, fusão, ebulição e solubilidade",[]],
    ["A08","Laboratório: segurança, vidrarias e técnicas",[]],
    ["A09","Algarismos significativos e erros de medida",[]],
  ] },
  { id:"QB", area:"qui", letra:"B", cor:"--mA", nome:"Atomística", desc:"Modelos atômicos, distribuição eletrônica e tabela periódica.", temas:[
    ["B01","Partículas fundamentais e íons",[]],
    ["B02","Isótopos, isóbaros e isótonos",[]],
    ["B03","Modelos atômicos clássicos",[]],
    ["B04","Modelo quântico e distribuição eletrônica",[]],
    ["B05","Orbitais híbridos",[]],
    ["B06","Tabela periódica: grupos e períodos",[]],
    ["B07","Propriedades periódicas",[]],
    ["B08","Radioatividade e química nuclear",[]],
  ] },
  { id:"QC", area:"qui", letra:"C", cor:"--mC", nome:"Ligações químicas", desc:"Iônica, covalente, metálica, geometria e forças intermoleculares.", temas:[
    ["C01","Ligação iônica",[]],
    ["C02","Ligação covalente e ressonância",[]],
    ["C03","Ligação metálica e ligas",[]],
    ["C04","Geometria molecular (VSEPR)",[]],
    ["C05","Polaridade",[]],
    ["C06","Forças intermoleculares",[]],
    ["C07","Teoria dos orbitais moleculares",[]],
  ] },
  { id:"QD", area:"qui", letra:"D", cor:"--mO", nome:"Reações e estequiometria", desc:"Balanceamento, mol, rendimento e reagente limitante.", temas:[
    ["D01","Funções inorgânicas e nomenclatura",[]],
    ["D02","Tipos de reação e previsão de produtos",[]],
    ["D03","Leis ponderais",[]],
    ["D04","Mol, massa molar e Avogadro",[]],
    ["D05","Balanceamento de equações",[]],
    ["D06","Cálculo estequiométrico",[]],
    ["D07","Oxirredução e balanceamento redox",[]],
  ] },
  { id:"QE", area:"qui", letra:"E", cor:"--mS", nome:"Físico-química I", desc:"Soluções, propriedades coligativas e termoquímica.", temas:[
    ["E01","Leis dos gases",[]],
    ["E02","Teoria cinética e gases reais",[]],
    ["E03","Misturas gasosas",[]],
    ["E04","Diagramas de fases",[]],
    ["E05","Soluções e solubilidade",[]],
    ["E06","Concentração e diluição",[]],
    ["E07","Titulometria",[]],
    ["E08","Propriedades coligativas",[]],
  ] },
  { id:"QF", area:"qui", letra:"F", cor:"--mT", nome:"Físico-química II", desc:"Cinética, equilíbrio químico e iônico.", temas:[
    ["F01","Termoquímica: entalpia",[]],
    ["F02","Lei de Hess e energia de ligação",[]],
    ["F03","Entropia e energia livre de Gibbs",[]],
    ["F04","Cinética e energia de ativação",[]],
    ["F05","Leis de velocidade",[]],
    ["F06","Equilíbrio químico",[]],
    ["F07","Le Chatelier",[]],
    ["F08","pH e pOH",[]],
    ["F09","Hidrólise e tampão",[]],
    ["F10","Kps",[]],
  ] },
  { id:"QG", area:"qui", letra:"G", cor:"--mK1", nome:"Eletroquímica", desc:"Pilhas, potenciais e eletrólise.", temas:[
    ["G01","Pilhas e potenciais",[]],
    ["G02","Equação de Nernst",[]],
    ["G03","Eletrólise e leis de Faraday",[]],
    ["G04","Corrosão e proteção",[]],
  ] },
  { id:"QH", area:"qui", letra:"H", cor:"--mU", nome:"Química orgânica", desc:"Funções, isomeria e reações orgânicas.", temas:[
    ["H01","Átomo de carbono e cadeias",[]],
    ["H02","Hidrocarbonetos",[]],
    ["H03","Funções oxigenadas",[]],
    ["H04","Funções nitrogenadas",[]],
    ["H05","Propriedades físicas e estrutura",[]],
    ["H06","Acidez e basicidade",[]],
    ["H07","Isomeria constitucional",[]],
    ["H08","Estereoisomeria",[]],
    ["H09","Substituição",[]],
    ["H10","Adição",[]],
    ["H11","Eliminação",[]],
    ["H12","Oxidação e redução",[]],
    ["H13","Mecanismos de reação",[]],
  ] },
  { id:"QI", area:"qui", letra:"I", cor:"--mX", nome:"Bioquímica e ambiental", desc:"Biomoléculas, polímeros e química do ambiente.", temas:[
    ["I01","Polímeros",[]],
    ["I02","Carboidratos e lipídeos",[]],
    ["I03","Aminoácidos, proteínas e enzimas",[]],
    ["I04","Ácidos nucleicos",[]],
    ["I05","Biocombustíveis",[]],
    ["I06","Ciclos biogeoquímicos",[]],
    ["I07","Poluição da água e do ar",[]],
    ["I08","Química verde e cotidiano",[]],
    ["I09","Tratamento de água e resíduos",[]],
  ] },
  { id:"QJ", area:"qui", letra:"J", cor:"--mM", nome:"Química analítica", desc:"Titulação, análise qualitativa e quantitativa.", temas:[
    ["J01","Análise qualitativa e marcha de íons",[]],
    ["J02","Métodos gravimétricos",[]],
    ["J03","Métodos volumétricos",[]],
    ["J04","Química de coordenação",[]],
  ] },
  /* aba Experimentos (simulações, no padrão dos experimentos de física) */
  { id:"EQg", area:"quiexp", letra:"QG", cor:"--mF", nome:"Gases", desc:"Difusão, pistão, Maxwell–Boltzmann e gases reais.", temas:[
    ["EQ01","Gás enchendo o recipiente: difusão e efusão",[]],
    ["EQ02","Pistão: pressão, volume e temperatura",[]],
    ["EQ03","Distribuição de Maxwell-Boltzmann",[]],
    ["EQ04","Gás real × gás ideal",[]],
  ] },
  { id:"EQr", area:"quiexp", letra:"QR", cor:"--mO", nome:"Reações", desc:"Colisões, catalisador, Le Chatelier, titulação na bureta e balanceamento.", temas:[
    ["EQ05","Colisões e energia de ativação",[]],
    ["EQ06","Catalisador mudando o caminho",[]],
    ["EQ07","Le Chatelier ao vivo",[]],
    /* EQ08 (pedido de 15/11/2026): bureta de verdade. Abre-se a torneira, as gotas caem uma a uma, a cor vira no ponto de viragem e a curva de pH se desenha junto; tem de dar para passar do ponto de propósito. */
    ["EQ08","Titulação na bureta: gota a gota, viragem e curva de pH",[]],
    /* EQ21: os dois lados da equação com os átomos contados em bolinhas; mexe-se nos coeficientes até os lados se igualarem. */
    ["EQ21","Balanceador visual de equações",[]],
  ] },
  { id:"EQe", area:"quiexp", letra:"QE", cor:"--mK1", nome:"Eletroquímica", desc:"Pilha de Daniell, eletrólise e corrosão.", temas:[
    ["EQ09","Pilha de Daniell",[]],
    ["EQ10","Eletrólise",[]],
    ["EQ11","Corrosão e proteção catódica",[]],
  ] },
  { id:"EQn", area:"quiexp", letra:"QN", cor:"--mN", nome:"Nuclear", desc:"Fissão, decaimento e fusão.", temas:[
    ["EQ12","Fissão em cadeia",[]],
    ["EQ13","Decaimento e meia-vida",[]],
    ["EQ14","Fusão nuclear",[]],
  ] },
  { id:"EQt", area:"quiexp", letra:"QT", cor:"--mC", nome:"Átomos e ligações", desc:"Orbitais, tabela periódica, moléculas, chama, espectros e cristais.", temas:[
    ["EQ15","Orbitais atômicos em 3D",[]],
    ["EQ16","Geometria molecular girando",[]],
    ["EQ17","Forças intermoleculares",[]],
    /* EQ18 (pedido de 15/11/2026): monte o retículo. Empilham-se os íons e o cristal se forma, mostrando o número de coordenação. */
    ["EQ18","Monte o retículo: cristais iônicos e número de coordenação",[]],
    /* EQ19: escolhe-se uma propriedade (raio, eletronegatividade, energia de ionização) e a tabela vira mapa de calor, com as tendências aparecendo sozinhas. */
    ["EQ19","Tabela periódica que acende",[]],
    /* EQ20: arrastam-se átomos, ligam-se, e o site aplica VSEPR, mostra a geometria girando em 3D, calcula a polaridade e desenha o vetor momento dipolar. */
    ["EQ20","Construtor de moléculas: VSEPR, 3D e momento dipolar",[]],
    /* EQ22: joga-se o sal na chama e vê-se a cor do cátion. */
    ["EQ22","Teste de chama",[]],
    /* EQ23: aquece-se o elemento, aparecem as linhas e, ao lado, os saltos de nível do átomo de Bohr que geraram cada uma. */
    ["EQ23","Espectro de emissão e os saltos do átomo de Bohr",[]],
  ] },
  /* módulo novo (15/11/2026). EQ24: aquece-se a solução, dissolve-se mais, esfria-se devagar e os cristais crescem, com o tempo acelerável.
     EQ25: pinga-se o indicador nas substâncias de casa (vinagre, bicarbonato, sabão) e vê-se a escala de cor. */
  { id:"EQs", area:"quiexp", letra:"QS", cor:"--mS", nome:"Soluções e indicadores", desc:"Cristalização e o indicador de repolho roxo.", temas:[
    ["EQ24","Cristalização: aquecer, dissolver, esfriar e ver crescer",[]],
    ["EQ25","Indicador de repolho roxo",[]],
  ] },
);
