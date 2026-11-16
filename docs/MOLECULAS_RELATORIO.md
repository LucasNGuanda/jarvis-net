# Visualizador de moléculas: relatório da geração

Gerado por `tools/moleculas/gera-moleculas.py`. Não editar à mão.

**Moléculas pedidas:** 230 · **geradas:** 230 · **falhas em aberto:** 0 · **corrigidas à mão (ajustes.json):** 3 · **trocadas para o modelo VSEPR porque o campo de força errou:** 5

## Falhas em aberto
Nenhuma.

## Correções feitas à mão
- decóxido de tetrafósforo: o PubChem devolve P2O5 (fórmula mínima) para "phosphorus pentoxide"; a molécula é P4O10. SMILES do registro "tetraphosphorus decaoxide" do PubChem (CID 14812)
- cloreto de berílio: o PubChem escreve o BeCl2 como íons soltos; aqui é a molécula gasosa (linear), exemplo clássico de geometria. Ligações escritas à mão (Cl-Be-Cl)
- tiossulfato: o PubChem devolve o hidrogenotiossulfato (HS2O3-) para "thiosulfate"; o íon pedido é S2O3^2-. SMILES do registro "thiosulfate(2-)" do PubChem (CID 1084)

## Campo de força reprovado (desenho trocado pelo VSEPR ideal)
- trióxido de enxofre: o campo de força deu 98°, 98°, 98° (ideal 120°)
- dióxido de cloro: o campo de força deu 180° (ideal 109.5°)
- cloreto de berílio: o campo de força deu 130° (ideal 180°)
- clorato: o campo de força deu 120°, 120°, 120° (ideal 109.5°)
- permanganato: o campo de força deu 92°, 101°, 106°, 106°, 112°, 134° (ideal 109.5°)

## Ângulo calculado sem valor de livro conferido
pentacloreto de fósforo, tetrafluoreto de enxofre, hexafluoreto de enxofre, heptafluoreto de iodo, difluoreto de xenônio, tetrafluoreto de xenônio, clorato, tri-iodeto

## Desenhadas com cargas formais separadas (o RDKit normaliza; a ficha avisa)
ácido cloroso, ácido clórico, ácido perclórico, dióxido de cloro, clorato, perclorato

## Usos
Resumidos (por IA) de textos baixados por script: primeiro parágrafo do artigo da Wikipedia em inglês, descrições e seção Uses do PubChem. Cada uso tem um trecho literal de apoio em fonte/usos.json.

**Com uso:** 222 · **sem dado (a fonte não cita uso):** 8 → ácido carbônico, ácido cloroso, tetrafluoreto de xenônio, carbonato, hipoclorito, permanganato, dicromato, tri-iodeto

## Maiores diferenças entre o modelo e o valor de livro (5 graus ou mais)
Não foram ajustadas: a ficha mostra os dois números.

- dióxido de nitrogênio (O–N–O): modelo 108,3°, livro 134,1° (NIST CCCBDB)
- sulfito (O–S–O): modelo 97,7°, 97,8°, livro 106° (Wikipedia (en), artigo "Sodium sulfite"; medido num cristal de sulfito de sódio, valor aproximado)
- trifluoreto de nitrogênio (F–N–F): modelo 110,4°, livro 102,37° (NIST CCCBDB)
- ácido hipocloroso (H–O–Cl): modelo 110,4°, livro 102,45° (NIST CCCBDB)
- dióxido de cloro (O–Cl–O): modelo 109,5°, livro 117,4033° (NIST CCCBDB)
- difluoreto de oxigênio (F–O–F): modelo 110,4°, livro 103,1° (NIST CCCBDB)
- nitrito (O–N–O): modelo 108,3°, livro 115° (Wikipedia (en), artigo "Nitrite"; valor aproximado)
- dióxido de enxofre (O–S–O): modelo 112,9°, livro 119,5° (NIST CCCBDB)
- pentafluoreto de bromo (F–Br–F): modelo 90,0°, 180,0°, livro 84,8° (NIST CCCBDB; entre o flúor axial e um equatorial)

## Tabela

| nº | molécula | fórmula escrita | pelo SMILES (RDKit) | no PubChem | confere | desenho | átomos | ângulo no modelo | ângulo de livro |
|---|---|---|---|---|---|---|---|---|---|
| 1 | hidrogênio | H2 | H2 | H2 | sim | rdkit | 2 | — | — |
| 2 | oxigênio | O2 | O2 | O2 | sim | rdkit | 2 | — | — |
| 3 | ozônio | O3 | O3 | O3 | sim | rdkit | 3 | 120,0° | 116,8° (NIST CCCBDB) |
| 4 | nitrogênio | N2 | N2 | N2 | sim | rdkit | 2 | — | — |
| 5 | flúor | F2 | F2 | F2 | sim | rdkit | 2 | — | — |
| 6 | cloro | Cl2 | Cl2 | Cl2 | sim | rdkit | 2 | — | — |
| 7 | bromo | Br2 | Br2 | Br2 | sim | rdkit | 2 | — | — |
| 8 | iodo | I2 | I2 | I2 | sim | rdkit | 2 | — | — |
| 9 | enxofre | S8 | S8 | S8 | sim | rdkit | 8 | 104,7°, 109,0° | 107,9° (NIST CCCBDB) |
| 10 | fósforo branco | P4 | P4 | P4 | sim | rdkit | 4 | — | — |
| 11 | fulereno | C60 | C60 | C60 | sim | rdkit | 60 | — | — |
| 12 | água | H2O | H2O | H2O | sim | rdkit | 3 | 104,0° | 104,4776° (NIST CCCBDB) |
| 13 | água oxigenada (peróxido de hidrogênio) | H2O2 | H2O2 | H2O2 | sim | rdkit | 4 | 96,7°, 96,8° | 94,8° (NIST CCCBDB) |
| 14 | amônia | NH3 | H3N | H3N | sim | rdkit | 4 | 106,0° | 106,67° (NIST CCCBDB) |
| 15 | hidrazina | N2H4 | H4N2 | H4N2 | sim | rdkit | 6 | 106,3° | 106° (NIST CCCBDB) |
| 16 | fosfina | PH3 | H3P | H3P | sim | rdkit | 4 | 94,5° | 93,3° (NIST CCCBDB) |
| 17 | sulfeto de hidrogênio | H2S | H2S | H2S | sim | rdkit | 3 | 93,4° | 92,11° (NIST CCCBDB) |
| 18 | silano | SiH4 | H4Si | H4Si | sim | rdkit | 5 | 109,4°, 109,5° | 109,5° (por simetria (ligantes iguais, sem par isolado)) |
| 19 | ácido fluorídrico | HF | HF | FH | sim | rdkit | 2 | — | — |
| 20 | ácido clorídrico | HCl | HCl | ClH | sim | rdkit | 2 | — | — |
| 21 | ácido bromídrico | HBr | HBr | BrH | sim | rdkit | 2 | — | — |
| 22 | ácido iodídrico | HI | HI | HI | sim | rdkit | 2 | — | — |
| 23 | ácido cianídrico | HCN | CHN | CHN | sim | rdkit | 3 | — | — |
| 24 | ácido nítrico | HNO3 | HNO3 | HNO3 | sim | rdkit | 5 | — | — |
| 25 | ácido nitroso | HNO2 | HNO2 | HNO2 | sim | rdkit | 4 | 110,8° | 110,6° (NIST CCCBDB; a página não diz se é o isômero cis ou o trans) |
| 26 | ácido sulfúrico | H2SO4 | H2O4S | H2O4S | sim | rdkit | 7 | — | — |
| 27 | ácido sulfuroso | H2SO3 | H2O3S | H2O3S | sim | rdkit | 6 | — | — |
| 28 | ácido carbônico | H2CO3 | CH2O3 | CH2O3 | sim | rdkit | 6 | — | — |
| 29 | ácido fosfórico | H3PO4 | H3O4P | H3O4P | sim | rdkit | 8 | — | — |
| 30 | ácido fosforoso | H3PO3 | H3O3P | H3O3P | sim | rdkit | 7 | — | — |
| 31 | ácido hipocloroso | HClO | HClO | ClHO | sim | rdkit | 3 | 110,4° | 102,45° (NIST CCCBDB) |
| 32 | ácido cloroso | HClO2 | HClO2 | ClHO2 | sim | rdkit | 4 | — | — |
| 33 | ácido clórico | HClO3 | HClO3 | ClHO3 | sim | rdkit | 5 | — | — |
| 34 | ácido perclórico | HClO4 | HClO4 | ClHO4 | sim | rdkit | 6 | — | — |
| 35 | ácido bórico | H3BO3 | H3BO3 | BH3O3 | sim | rdkit | 7 | — | — |
| 36 | monóxido de carbono | CO | CO | CO | sim | rdkit | 2 | — | — |
| 37 | dióxido de carbono | CO2 | CO2 | CO2 | sim | rdkit | 3 | 180,0° | 180° (por simetria (ligantes iguais, sem par isolado)) |
| 38 | dióxido de enxofre | SO2 | O2S | O2S | sim | rdkit | 3 | 112,9° | 119,5° (NIST CCCBDB) |
| 39 | trióxido de enxofre | SO3 | O3S | O3S | sim | vsepr | 4 | 120,0° | 120° (por simetria (ligantes iguais, sem par isolado)) |
| 40 | monóxido de nitrogênio | NO | NO | NO | sim | rdkit | 2 | — | — |
| 41 | dióxido de nitrogênio | NO2 | NO2 | NO2 | sim | rdkit | 3 | 108,3° | 134,1° (NIST CCCBDB) |
| 42 | óxido nitroso | N2O | N2O | N2O | sim | rdkit | 3 | — | — |
| 43 | tetróxido de dinitrogênio | N2O4 | N2O4 | N2O4 | sim | rdkit | 6 | — | — |
| 44 | pentóxido de dinitrogênio | N2O5 | N2O5 | N2O5 | sim | rdkit | 7 | — | — |
| 45 | decóxido de tetrafósforo | P4O10 | O10P4 | O5P2 | corrigida | rdkit | 14 | — | — |
| 46 | dióxido de cloro | ClO2 | ClO2 | ClO2 | sim | vsepr | 3 | 109,5° | 117,4033° (NIST CCCBDB) |
| 47 | monóxido de dicloro | Cl2O | Cl2O | Cl2O | sim | rdkit | 3 | 110,4° | 110,88° (NIST CCCBDB) |
| 48 | difluoreto de oxigênio | OF2 | F2O | F2O | sim | rdkit | 3 | 110,4° | 103,1° (NIST CCCBDB) |
| 49 | cloreto de berílio | BeCl2 | BeCl2 | BeCl2 | sim | vsepr | 3 | 180,0° | 180° (por simetria (ligantes iguais, sem par isolado)) |
| 50 | trifluoreto de boro | BF3 | BF3 | BF3 | sim | rdkit | 4 | 120,0° | 120° (por simetria (ligantes iguais, sem par isolado)) |
| 51 | tricloreto de boro | BCl3 | BCl3 | BCl3 | sim | rdkit | 4 | 120,0° | 120° (por simetria (ligantes iguais, sem par isolado)) |
| 52 | tetracloreto de carbono | CCl4 | CCl4 | CCl4 | sim | rdkit | 5 | 109,5° | 109,5° (por simetria (ligantes iguais, sem par isolado)) |
| 53 | trifluoreto de nitrogênio | NF3 | F3N | F3N | sim | rdkit | 4 | 110,4° | 102,37° (NIST CCCBDB) |
| 54 | tricloreto de fósforo | PCl3 | Cl3P | Cl3P | sim | rdkit | 4 | 98,1° | 100,1° (NIST CCCBDB) |
| 55 | pentacloreto de fósforo | PCl5 | Cl5P | Cl5P | sim | vsepr | 6 | 90,0°, 120,0°, 180,0° | — |
| 56 | tetrafluoreto de enxofre | SF4 | F4S | F4S | sim | vsepr | 5 | 90,0°, 120,0°, 180,0° | — |
| 57 | hexafluoreto de enxofre | SF6 | F6S | F6S | sim | vsepr | 7 | 90,0°, 180,0° | — |
| 58 | trifluoreto de cloro | ClF3 | ClF3 | ClF3 | sim | vsepr | 4 | 90,0°, 180,0° | 87,45° (NIST CCCBDB; o menor dos ângulos) |
| 59 | pentafluoreto de bromo | BrF5 | BrF5 | BrF5 | sim | vsepr | 6 | 90,0°, 180,0° | 84,8° (NIST CCCBDB; entre o flúor axial e um equatorial) |
| 60 | heptafluoreto de iodo | IF7 | F7I | F7I | sim | vsepr | 8 | 72,0°, 90,0°, 144,0°, 180,0° | — |
| 61 | difluoreto de xenônio | XeF2 | F2Xe | F2Xe | sim | vsepr | 3 | 180,0° | — |
| 62 | tetrafluoreto de xenônio | XeF4 | F4Xe | F4Xe | sim | vsepr | 5 | 90,0°, 180,0° | — |
| 63 | dissulfeto de carbono | CS2 | CS2 | CS2 | sim | rdkit | 3 | 180,0° | 180° (por simetria (ligantes iguais, sem par isolado)) |
| 64 | dicloreto de enxofre | SCl2 | Cl2S | Cl2S | sim | rdkit | 3 | 97,9° | 102,71° (NIST CCCBDB) |
| 65 | fosgênio | COCl2 | CCl2O | CCl2O | sim | rdkit | 4 | 111,2° | 111,91° (NIST CCCBDB) |
| 66 | cloreto de tionila | SOCl2 | Cl2OS | Cl2OS | sim | rdkit | 4 | 99,4° | 96,1° (NIST CCCBDB) |
| 67 | amônio | NH4+ | H4N+ | H4N+ | sim | rdkit | 5 | 109,4°, 109,5° | 109,5° (por simetria (ligantes iguais, sem par isolado)) |
| 68 | hidrônio | H3O+ | H3O+ | H3O+ | sim | rdkit | 4 | 111,4°, 111,5° | 113° (Wikipedia (en), artigo "Hydronium"; valor aproximado) |
| 69 | hidróxido | OH- | HO- | HO- | sim | rdkit | 2 | — | — |
| 70 | nitrato | NO3- | NO3- | NO3- | sim | rdkit | 4 | 120,0° | 120° (por simetria (ligantes iguais, sem par isolado)) |
| 71 | nitrito | NO2- | NO2- | NO2- | sim | rdkit | 3 | 108,3° | 115° (Wikipedia (en), artigo "Nitrite"; valor aproximado) |
| 72 | sulfato | SO4^2- | O4S-2 | O4S-2 | sim | rdkit | 5 | 109,4°, 109,5° | 109,5° (por simetria (ligantes iguais, sem par isolado)) |
| 73 | sulfito | SO3^2- | O3S-2 | O3S-2 | sim | rdkit | 4 | 97,7°, 97,8° | 106° (Wikipedia (en), artigo "Sodium sulfite"; medido num cristal de sulfito de sódio, valor aproximado) |
| 74 | tiossulfato | S2O3^2- | O3S2-2 | HO3S2- | corrigida | rdkit | 5 | — | — |
| 75 | carbonato | CO3^2- | CO3-2 | CO3-2 | sim | rdkit | 4 | 120,0°, 120,1° | 120° (por simetria (ligantes iguais, sem par isolado)) |
| 76 | hidrogenocarbonato (bicarbonato) | HCO3- | CHO3- | CHO3- | sim | rdkit | 5 | — | — |
| 77 | fosfato | PO4^3- | O4P-3 | O4P-3 | sim | rdkit | 5 | 109,4°, 109,5° | 109,5° (por simetria (ligantes iguais, sem par isolado)) |
| 78 | hipoclorito | ClO- | ClO- | ClO- | sim | rdkit | 2 | — | — |
| 79 | clorato | ClO3- | ClO3- | ClO3- | sim | vsepr | 4 | 109,5° | — |
| 80 | perclorato | ClO4- | ClO4- | ClO4- | sim | rdkit | 5 | 109,4°, 109,5° | 109,5° (por simetria (ligantes iguais, sem par isolado)) |
| 81 | permanganato | MnO4- | MnO4- | MnO4- | sim | vsepr | 5 | 109,5° | 109,5° (por simetria (ligantes iguais, sem par isolado)) |
| 82 | dicromato | Cr2O7^2- | Cr2O7-2 | Cr2O7-2 | sim | rdkit | 9 | — | — |
| 83 | cianeto | CN- | CN- | CN- | sim | rdkit | 2 | — | — |
| 84 | acetato | CH3COO- | C2H3O2- | C2H3O2- | sim | rdkit | 7 | — | — |
| 85 | oxalato | C2O4^2- | C2O4-2 | C2O4-2 | sim | rdkit | 6 | — | — |
| 86 | tri-iodeto | I3- | I3- | I3- | sim | vsepr | 3 | 180,0° | — |
| 87 | hidróxido de sódio | NaOH | HNaO | HNaO | sim | ionico | 0 | — | — |
| 88 | hidróxido de potássio | KOH | HKO | HKO | sim | ionico | 0 | — | — |
| 89 | hidróxido de cálcio | Ca(OH)2 | H2CaO2 | CaH2O2 | sim | ionico | 0 | — | — |
| 90 | cloreto de sódio | NaCl | ClNa | ClNa | sim | ionico | 0 | — | — |
| 91 | carbonato de cálcio | CaCO3 | CCaO3 | CCaO3 | sim | ionico | 0 | — | — |
| 92 | carbonato de sódio | Na2CO3 | CNa2O3 | CNa2O3 | sim | ionico | 0 | — | — |
| 93 | bicarbonato de sódio | NaHCO3 | CHNaO3 | CHNaO3 | sim | ionico | 0 | — | — |
| 94 | sulfato de cálcio | CaSO4 | CaO4S | CaO4S | sim | ionico | 0 | — | — |
| 95 | sulfato de cobre(II) | CuSO4 | CuO4S | CuO4S | sim | ionico | 0 | — | — |
| 96 | cloreto de amônio | NH4Cl | H4ClN | ClH4N | sim | ionico | 0 | — | — |
| 97 | nitrato de amônio | NH4NO3 | H4N2O3 | H4N2O3 | sim | ionico | 0 | — | — |
| 98 | nitrato de potássio | KNO3 | KNO3 | KNO3 | sim | ionico | 0 | — | — |
| 99 | hipoclorito de sódio | NaClO | ClNaO | ClNaO | sim | ionico | 0 | — | — |
| 100 | permanganato de potássio | KMnO4 | KMnO4 | KMnO4 | sim | ionico | 0 | — | — |
| 101 | metano | — | CH4 | CH4 | sim | rdkit | 5 | 109,4°, 109,5° | 109,5° (por simetria (ligantes iguais, sem par isolado)) |
| 102 | etano | — | C2H6 | C2H6 | sim | rdkit | 8 | — | — |
| 103 | propano | — | C3H8 | C3H8 | sim | rdkit | 11 | — | — |
| 104 | butano | — | C4H10 | C4H10 | sim | rdkit | 14 | — | — |
| 105 | isobutano (metilpropano) | — | C4H10 | C4H10 | sim | rdkit | 14 | — | — |
| 106 | pentano | — | C5H12 | C5H12 | sim | rdkit | 17 | — | — |
| 107 | isopentano (2-metilbutano) | — | C5H12 | C5H12 | sim | rdkit | 17 | — | — |
| 108 | neopentano (2,2-dimetilpropano) | — | C5H12 | C5H12 | sim | rdkit | 17 | — | — |
| 109 | hexano | — | C6H14 | C6H14 | sim | rdkit | 20 | — | — |
| 110 | heptano | — | C7H16 | C7H16 | sim | rdkit | 23 | — | — |
| 111 | octano | — | C8H18 | C8H18 | sim | rdkit | 26 | — | — |
| 112 | isoctano (2,2,4-trimetilpentano) | — | C8H18 | C8H18 | sim | rdkit | 26 | — | — |
| 113 | eteno (etileno) | — | C2H4 | C2H4 | sim | rdkit | 6 | 117,9° | 117,6° (NIST CCCBDB) |
| 114 | propeno | — | C3H6 | C3H6 | sim | rdkit | 9 | — | — |
| 115 | but-1-eno | — | C4H8 | C4H8 | sim | rdkit | 12 | — | — |
| 116 | cis-but-2-eno | — | C4H8 | C4H8 | sim | rdkit | 12 | — | — |
| 117 | trans-but-2-eno | — | C4H8 | C4H8 | sim | rdkit | 12 | — | — |
| 118 | buta-1,3-dieno | — | C4H6 | C4H6 | sim | rdkit | 10 | — | — |
| 119 | isopreno (2-metilbuta-1,3-dieno) | — | C5H8 | C5H8 | sim | rdkit | 13 | — | — |
| 120 | etino (acetileno) | — | C2H2 | C2H2 | sim | rdkit | 4 | — | — |
| 121 | propino | — | C3H4 | C3H4 | sim | rdkit | 7 | — | — |
| 122 | ciclopropano | — | C3H6 | C3H6 | sim | rdkit | 9 | — | — |
| 123 | ciclobutano | — | C4H8 | C4H8 | sim | rdkit | 12 | — | — |
| 124 | ciclopentano | — | C5H10 | C5H10 | sim | rdkit | 15 | — | — |
| 125 | ciclo-hexano | — | C6H12 | C6H12 | sim | rdkit | 18 | — | — |
| 126 | ciclo-hexeno | — | C6H10 | C6H10 | sim | rdkit | 16 | — | — |
| 127 | benzeno | — | C6H6 | C6H6 | sim | rdkit | 12 | — | — |
| 128 | tolueno | — | C7H8 | C7H8 | sim | rdkit | 15 | — | — |
| 129 | orto-xileno | — | C8H10 | C8H10 | sim | rdkit | 18 | — | — |
| 130 | meta-xileno | — | C8H10 | C8H10 | sim | rdkit | 18 | — | — |
| 131 | para-xileno | — | C8H10 | C8H10 | sim | rdkit | 18 | — | — |
| 132 | estireno | — | C8H8 | C8H8 | sim | rdkit | 16 | — | — |
| 133 | naftaleno | — | C10H8 | C10H8 | sim | rdkit | 18 | — | — |
| 134 | antraceno | — | C14H10 | C14H10 | sim | rdkit | 24 | — | — |
| 135 | clorometano | — | CH3Cl | CH3Cl | sim | rdkit | 5 | 109,8°, 109,9° | 110,75° (NIST CCCBDB) |
| 136 | diclorometano | — | CH2Cl2 | CH2Cl2 | sim | rdkit | 5 | 111,1° | 112,2° (NIST CCCBDB) |
| 137 | clorofórmio (triclorometano) | — | CHCl3 | CHCl3 | sim | rdkit | 5 | 110,6° | 110,92° (NIST CCCBDB) |
| 138 | cloroetano | — | C2H5Cl | C2H5Cl | sim | rdkit | 8 | — | — |
| 139 | cloreto de vinila (cloroeteno) | — | C2H3Cl | C2H3Cl | sim | rdkit | 6 | — | — |
| 140 | cis-1,2-dicloroeteno | — | C2H2Cl2 | C2H2Cl2 | sim | rdkit | 6 | — | — |
| 141 | trans-1,2-dicloroeteno | — | C2H2Cl2 | C2H2Cl2 | sim | rdkit | 6 | — | — |
| 142 | clorobenzeno | — | C6H5Cl | C6H5Cl | sim | rdkit | 12 | — | — |
| 143 | diclorodifluorometano (CFC-12) | — | CCl2F2 | CCl2F2 | sim | rdkit | 5 | — | — |
| 144 | tetrafluoroeteno | — | C2F4 | C2F4 | sim | rdkit | 6 | — | — |
| 145 | DDT | — | C14H9Cl5 | C14H9Cl5 | sim | rdkit | 28 | — | — |
| 146 | metanol | — | CH4O | CH4O | sim | rdkit | 6 | 107,1° | 108,87° (NIST CCCBDB) |
| 147 | etanol | — | C2H6O | C2H6O | sim | rdkit | 9 | — | — |
| 148 | propan-1-ol | — | C3H8O | C3H8O | sim | rdkit | 12 | — | — |
| 149 | propan-2-ol (isopropanol) | — | C3H8O | C3H8O | sim | rdkit | 12 | — | — |
| 150 | butan-1-ol | — | C4H10O | C4H10O | sim | rdkit | 15 | — | — |
| 151 | butan-2-ol | — | C4H10O | C4H10O | sim | rdkit | 15 | — | — |
| 152 | 2-metilpropan-2-ol (terc-butanol) | — | C4H10O | C4H10O | sim | rdkit | 15 | — | — |
| 153 | etano-1,2-diol (etilenoglicol) | — | C2H6O2 | C2H6O2 | sim | rdkit | 10 | — | — |
| 154 | propano-1,2,3-triol (glicerol, glicerina) | — | C3H8O3 | C3H8O3 | sim | rdkit | 14 | — | — |
| 155 | ciclo-hexanol | — | C6H12O | C6H12O | sim | rdkit | 19 | — | — |
| 156 | fenol | — | C6H6O | C6H6O | sim | rdkit | 13 | — | — |
| 157 | éter dimetílico (metoximetano) | — | C2H6O | C2H6O | sim | rdkit | 9 | 111,5° | 111,2° (NIST CCCBDB) |
| 158 | éter dietílico (etoxietano) | — | C4H10O | C4H10O | sim | rdkit | 15 | — | — |
| 159 | óxido de etileno (epóxido) | — | C2H4O | C2H4O | sim | rdkit | 7 | — | — |
| 160 | tetra-hidrofurano | — | C4H8O | C4H8O | sim | rdkit | 13 | — | — |
| 161 | metanal (formaldeído) | — | CH2O | CH2O | sim | rdkit | 4 | 115,5° | 116,133° (NIST CCCBDB) |
| 162 | etanal (acetaldeído) | — | C2H4O | C2H4O | sim | rdkit | 7 | — | — |
| 163 | propanal | — | C3H6O | C3H6O | sim | rdkit | 10 | — | — |
| 164 | benzaldeído | — | C7H6O | C7H6O | sim | rdkit | 14 | — | — |
| 165 | propanona (acetona) | — | C3H6O | C3H6O | sim | rdkit | 10 | — | — |
| 166 | butanona | — | C4H8O | C4H8O | sim | rdkit | 13 | — | — |
| 167 | ciclo-hexanona | — | C6H10O | C6H10O | sim | rdkit | 17 | — | — |
| 168 | vanilina | — | C8H8O3 | C8H8O3 | sim | rdkit | 19 | — | — |
| 169 | ácido metanoico (fórmico) | — | CH2O2 | CH2O2 | sim | rdkit | 5 | — | — |
| 170 | ácido etanoico (acético) | — | C2H4O2 | C2H4O2 | sim | rdkit | 8 | — | — |
| 171 | ácido propanoico | — | C3H6O2 | C3H6O2 | sim | rdkit | 11 | — | — |
| 172 | ácido butanoico (butírico) | — | C4H8O2 | C4H8O2 | sim | rdkit | 14 | — | — |
| 173 | ácido benzoico | — | C7H6O2 | C7H6O2 | sim | rdkit | 15 | — | — |
| 174 | ácido oxálico | — | C2H2O4 | C2H2O4 | sim | rdkit | 8 | — | — |
| 175 | ácido lático | — | C3H6O3 | C3H6O3 | sim | rdkit | 12 | — | — |
| 176 | ácido cítrico | — | C6H8O7 | C6H8O7 | sim | rdkit | 21 | — | — |
| 177 | ácido palmítico | — | C16H32O2 | C16H32O2 | sim | rdkit | 50 | — | — |
| 178 | ácido oleico | — | C18H34O2 | C18H34O2 | sim | rdkit | 54 | — | — |
| 179 | etanoato de etila (acetato de etila) | — | C4H8O2 | C4H8O2 | sim | rdkit | 14 | — | — |
| 180 | etanoato de isoamila (essência de banana) | — | C7H14O2 | C7H14O2 | sim | rdkit | 23 | — | — |
| 181 | tributirina (um triglicerídeo pequeno) | — | C15H26O6 | C15H26O6 | sim | rdkit | 47 | — | — |
| 182 | etanamida (acetamida) | — | C2H5NO | C2H5NO | sim | rdkit | 9 | — | — |
| 183 | ureia | — | CH4N2O | CH4N2O | sim | rdkit | 8 | — | — |
| 184 | anidrido acético | — | C4H6O3 | C4H6O3 | sim | rdkit | 13 | — | — |
| 185 | cloreto de etanoíla (cloreto de acetila) | — | C2H3ClO | C2H3ClO | sim | rdkit | 7 | — | — |
| 186 | metilamina | — | CH5N | CH5N | sim | rdkit | 7 | — | — |
| 187 | dimetilamina | — | C2H7N | C2H7N | sim | rdkit | 10 | — | — |
| 188 | trimetilamina | — | C3H9N | C3H9N | sim | rdkit | 13 | — | — |
| 189 | anilina | — | C6H7N | C6H7N | sim | rdkit | 14 | — | — |
| 190 | piridina | — | C5H5N | C5H5N | sim | rdkit | 11 | — | — |
| 191 | nitrobenzeno | — | C6H5NO2 | C6H5NO2 | sim | rdkit | 14 | — | — |
| 192 | TNT (2,4,6-trinitrotolueno) | — | C7H5N3O6 | C7H5N3O6 | sim | rdkit | 21 | — | — |
| 193 | nitroglicerina | — | C3H5N3O9 | C3H5N3O9 | sim | rdkit | 20 | — | — |
| 194 | etanonitrila (acetonitrila) | — | C2H3N | C2H3N | sim | rdkit | 6 | — | — |
| 195 | etanotiol | — | C2H6S | C2H6S | sim | rdkit | 9 | — | — |
| 196 | dimetilsulfóxido (DMSO) | — | C2H6OS | C2H6OS | sim | rdkit | 10 | — | — |
| 197 | ácido tereftálico (monômero do PET) | — | C8H6O4 | C8H6O4 | sim | rdkit | 18 | — | — |
| 198 | glicose (α-D-glicopiranose) | — | C6H12O6 | C6H12O6 | sim | rdkit | 24 | — | — |
| 199 | frutose | — | C6H12O6 | C6H12O6 | sim | rdkit | 24 | — | — |
| 200 | sacarose | — | C12H22O11 | C12H22O11 | sim | rdkit | 45 | — | — |
| 201 | glicina | — | C2H5NO2 | C2H5NO2 | sim | rdkit | 10 | — | — |
| 202 | alanina | — | C3H7NO2 | C3H7NO2 | sim | rdkit | 13 | — | — |
| 203 | cafeína | — | C8H10N4O2 | C8H10N4O2 | sim | rdkit | 24 | — | — |
| 204 | ácido acetilsalicílico (aspirina) | — | C9H8O4 | C9H8O4 | sim | rdkit | 21 | — | — |
| 205 | ribose | — | C5H10O5 | C5H10O5 | sim | rdkit | 20 | — | — |
| 206 | desoxirribose | — | C5H10O4 | C5H10O4 | sim | rdkit | 19 | — | — |
| 207 | glicilglicina | — | C4H8N2O3 | C4H8N2O3 | sim | rdkit | 17 | — | — |
| 208 | cisteína | — | C3H7NO2S | C3H7NO2S | sim | rdkit | 14 | — | — |
| 209 | fenilalanina | — | C9H11NO2 | C9H11NO2 | sim | rdkit | 23 | — | — |
| 210 | adenina | — | C5H5N5 | C5H5N5 | sim | rdkit | 15 | — | — |
| 211 | timina | — | C5H6N2O2 | C5H6N2O2 | sim | rdkit | 15 | — | — |
| 212 | citosina | — | C4H5N3O | C4H5N3O | sim | rdkit | 13 | — | — |
| 213 | guanina | — | C5H5N5O | C5H5N5O | sim | rdkit | 16 | — | — |
| 214 | uracila | — | C4H4N2O2 | C4H4N2O2 | sim | rdkit | 12 | — | — |
| 215 | ATP | — | C10H16N5O13P3 | C10H16N5O13P3 | sim | rdkit | 47 | — | — |
| 216 | colesterol | — | C27H46O | C27H46O | sim | rdkit | 74 | — | — |
| 217 | ácido ascórbico (vitamina C) | — | C6H8O6 | C6H8O6 | sim | rdkit | 20 | — | — |
| 218 | paracetamol | — | C8H9NO2 | C8H9NO2 | sim | rdkit | 20 | — | — |
| 219 | ibuprofeno | — | C13H18O2 | C13H18O2 | sim | rdkit | 33 | — | — |
| 220 | nicotina | — | C10H14N2 | C10H14N2 | sim | rdkit | 26 | — | — |
| 221 | adrenalina | — | C9H13NO3 | C9H13NO3 | sim | rdkit | 26 | — | — |
| 222 | mentol | — | C10H20O | C10H20O | sim | rdkit | 31 | — | — |
| 223 | limoneno | — | C10H16 | C10H16 | sim | rdkit | 26 | — | — |
| 224 | β-caroteno | — | C40H56 | C40H56 | sim | rdkit | 96 | — | — |
| 225 | fenolftaleína | — | C20H14O4 | C20H14O4 | sim | rdkit | 38 | — | — |
| 226 | metacrilato de metila | — | C5H8O2 | C5H8O2 | sim | rdkit | 15 | — | — |
| 227 | ácido adípico | — | C6H10O4 | C6H10O4 | sim | rdkit | 20 | — | — |
| 228 | hexametilenodiamina | — | C6H16N2 | C6H16N2 | sim | rdkit | 24 | — | — |
| 229 | caprolactama | — | C6H11NO | C6H11NO | sim | rdkit | 19 | — | — |
| 230 | EDTA | — | C10H16N2O8 | C10H16N2O8 | sim | rdkit | 36 | — | — |
