# Tabela periódica: de onde vêm os dados e o que ficou em branco

*(β 5.3, 15/11/2026. Os dados estão em `assets/tabela-dados.js`: é lá que se corrige um valor. Este arquivo explica as fontes e lista os brancos.)*

## Revisão final (script `tools/tabela/junta.py`), feita depois da coleta
- **Ano e autor da descoberta.** Onde o PubChem e a linha do tempo da Wikipedia discordam do ano, ficou o **ano do PubChem** e o **autor em branco** (32 elementos sem autor): H, B, O, F, Si, Zn, Br, Ru, Rh, Pd, La, Nd, Eu, Lu, Hf, Re, Pt, Bi, Rn, Ac, Th, Pu, Fm, No, Rf, Db, Bh, Fl, Ts, Og, mais Al e Ca.
  - **Al e Ca ficaram sem ano e sem autor**: o PubChem diz "Ancient" e a Wikipedia traz datas modernas (1746/1825 e 1739/1808).
  - Motivo de não escolher um lado: a Wikipedia separa "observado" de "isolado", e o primeiro relato dá resultados que brigam com os livros (hidrogênio em 1671, com Boyle, em vez de 1766, com Cavendish). A tabela completa com as duas colunas está no fim deste arquivo, para preencher à mão.
- **Massa atômica** de Ar, Zn, Ru, Sm, Os e Pb: valor do NIST (o PubChem abrevia para uma casa: Pb 207,0 em vez de 207,2).
- **Meia-vida do U-238**: 4,468 × 10⁹ anos (duas páginas baixadas discordam: 4,463 e 4,468).
- **tipo** (metal, ametal, semimetal): da coluna GroupBlock do PubChem. Semimetais, por ela: B, Si, Ge, As, Sb, Te e Po (a classificação varia de livro para livro; muitos não incluem o polônio).
- **★ (estrelas)**: lista de 27 elementos escolhida pelo Jarvis (os que mais aparecem em química geral de OBQ e ITA). **Não é estatística de provas**: é critério meu, editável em `estrelas`, no fim do arquivo de dados.
- **Lacunas de Mendeleiev**: eka-boro (Sc, 1879), eka-alumínio (Ga, 1875), eka-silício (Ge, 1886) e eka-manganês (Tc, 1937); previsões do artigo de 1871. Fonte: https://en.wikipedia.org/wiki/Mendeleev%27s_predicted_elements
- **Raio atômico** é o de van der Waals (PubChem): não é comparável ao raio do tema B07.
- **Usos**: resumo e tradução, feitos por IA, da seção "Uses" da tabela periódica da Royal Society of Chemistry (fonte única). Vale uma leitura.
- **Não conferidos em segunda fonte**: eletronegatividade, raio, energia de ionização, afinidade eletrônica, pontos de fusão e ebulição e densidade (só PubChem).

---

# Brancos, divergências e decisões do tabela-dados.js

Gerado em 15/11/2026 por `gera.py` (esta primeira parte é escrita à mão, em `brancos_manual.md`; do título "Brancos (null) por campo" em diante é automático). Nenhum valor foi escrito de memória: cada um sai de um arquivo de `bruto/`.

## Por que cada campo tem null

- **en** (23): sem valor no PubChem. São os gases nobres He, Ne, Ar e Rn (não formam ligações comuns, a escala de Pauling não se aplica), quatro lantanídeos que o PubChem deixa em branco (Pm, Eu, Tb, Yb) e os transactinídeos de Rf a Og (nunca medidos).
- **raio** (19): Fm a Og, sem raio de van der Waals no PubChem. Atenção: o raio do arquivo é o de **van der Waals** (o do PubChem), maior que o raio covalente ou atômico dos livros (H = 120 pm aqui; o covalente é bem menor). Não serve para comparar com o gráfico de raio do tema B07.
- **ei** (16): Lr a Og, sem valor no PubChem.
- **ae** (61): sem valor no PubChem. Entram os gases nobres, os grupos 2 e 12 (Be, Mg, Ca, Sr, Ba, Ra, Zn, Cd, Hg), N, Mn, Hf, quase todos os lantanídeos e actinídeos e os transactinídeos. O PubChem não diz o motivo de cada branco, então o arquivo não afirma nada (nem "zero", nem "negativa").
- **ox** (1): Nh, em branco no PubChem. Nos elementos em que o PubChem escreve sem sinal ("7, 5, 3, 1, -1" no At e nos superpesados), o `gera.py` só acrescentou o "+" nos positivos.
- **estado** (9): Ds a Og; o PubChem diz "Expected to be a Solid" (ou "a Gas", no Og), então ficou null, como combinado. De Rf a Mt o PubChem diz "Solid" sem ressalva e ficou "sólido", embora ninguém tenha visto uma amostra desses elementos: se quiser, troque à mão por null.
- **pf** (15): Rf a Og. **pe** (25): At, Fr, Pa, Bk a Og. **dens** (22): Fr, Cf a Og. Tudo sem valor no PubChem.
- **ano** (14): os que a linha do tempo da Wikipedia põe na tabela "Pre-modern and early modern discoveries": C, S, Fe, Cu, Zn, As, Ag, Sn, Sb, Pt, Au, Hg, Pb, Bi. Autor "conhecido desde a Antiguidade". Atenção a três deles, em que o PubChem dá ano: **Zn (1746), Pt (1735), Bi (1753)**. A nota da própria Wikipedia cita esses anos (Marggraf documenta o isolamento do zinco em 1746; Antonio de Ulloa observa a platina em 1735; Geoffroy mostra em 1753 que o bismuto é distinto do chumbo), e diz que a platina era usada por pré-colombianos e o bismuto conhecido "desde tempos antigos". Ficou null; se preferir o ano, edite à mão.
- **meia** (80): null de propósito nos 80 elementos com isótopo estável. Os outros 38 (Tc, Pm, Bi e Z ≥ 84) estão todos preenchidos.
- **usos**: nenhum null. As 118 frases foram escritas à mão em português resumindo a seção "Uses" da página de cada elemento na Royal Society of Chemistry (texto original em `usos_rsc_en.txt`). "só pesquisa científica" só aparece onde a RSC diz isso (At, Es a Og). Fr: a RSC diz "no uses"; Bk: "no commercial or technological use".

## pf e pe: exceções e avisos

- **As (pf 1090 K > pe 887 K)**: é a única linha com pf ≥ pe. Não é erro: o arsênio sublima a 1 atm (a RSC escreve "Sublimes at 616 °C, 889 K", https://periodic-table.rsc.org/element/33); o "pf" do PubChem só existe sob pressão. Sugestão para a tela: mostrar "sublima" no lugar de fusão/ebulição.
- **C (pf 3823 K, pe 4098 K)**: passa no teste pf < pe, mas também sublima (RSC: "Sublimes at 3825 °C, 4098 K", https://periodic-table.rsc.org/element/6). O pf do PubChem não é uma fusão a 1 atm.
- **He (pf 0,95 K)**: a RSC dá o ponto de fusão como "Unknown" (https://periodic-table.rsc.org/element/2); o valor do PubChem só vale sob pressão.

## Ano e autor: a regra usada

A linha do tempo da Wikipedia tem duas colunas, "observado" (primeiro relato) e "isolado". Regra do `gera.py`:
1. se o ano do PubChem aparece na coluna "observado", ficam esse ano e o autor da observação (69 elementos);
2. senão, se o ano do PubChem é o da coluna "isolado", ficam o ano e o autor do isolamento (Na, Mg, K, Mn, Ba, W: Davy 1807/1808, Gahn 1774, irmãos Elhuyar 1783);
3. senão, ficam o ano e o autor da coluna "observado" e o caso entra em "Divergências de ano" (29 elementos).

Consequência a decidir à mão: em alguns elementos o "observado" da Wikipedia é bem mais antigo que a data dos livros. Os mais visíveis: **H = 1671, Robert Boyle** (PubChem e os livros: 1766, que é o ano de Cavendish; o nome de Cavendish não está nas colunas da tabela da Wikipedia), **O = 1771, Scheele** (PubChem 1774), **Al = 1746, Pott** (isolado: Ørsted, 1825), **Si = 1739, Pott** (isolado: Berzelius, 1823), **Ca = 1739, Pott** (isolado: Davy, 1808), **B = 1787** (isolado: Davy, 1809), **F = 1771, Scheele** (isolado: Moissan, 1886; o PubChem dá 1670). A "Tabela completa de ano e autor", no fim, traz as duas colunas para trocar o que quiser.

Nomes: a Wikipedia abrevia ("H. Davy"); o `gera.py` expande pelo link da própria tabela ("Humphry Davy"). Onde a tabela não tem link, o nome ficou abreviado (lista mais abaixo). Equipes: "et al." seguido do instituto entre parênteses, como na fonte.

## Massa

Ficou sempre o PubChem (fonte principal). Dois avisos:
- o PubChem dá alguns elementos com no máximo uma casa decimal (lista mais abaixo: Li 7,0; Ar 39,9; Zn 65,4; Pb 207 …), por seguir os valores abreviados da IUPAC; o NIST baixado traz 39,948, 65,38 e 207,2. A maior diferença é o **chumbo: 207,0 (PubChem) × 207,2 (NIST)**. Se a tabela for usada em conta de estequiometria, vale trocar esses à mão pelos do NIST;
- nos elementos sem isótopo estável a "massa" do PubChem é a massa de um isótopo (o mais estável ou o mais conhecido), não uma média. Em Tc o PubChem usa o ⁹⁷Tc (96,906) e o NIST lista [98].

## Meia-vida

- Fonte: tabela "No primordial isotopes" da lista da Wikipedia (35 elementos) e as páginas "Isotopes of bismuth / thorium / uranium" para Bi, Th e U.
- **U-238**: ficou 4,463 × 10⁹ anos (página Isotopes of uranium); a outra lista baixada dá 4,468 × 10⁹ anos (o valor mais comum nos livros). Diferença de 0,1%.
- Og: a fonte dá 690 μs; ficou "690 microssegundos" (não converti para milissegundos para não mexer no número).
- Para Z > 98 a própria Wikipedia avisa que podem existir isótopos mais estáveis ainda não descobertos; os valores dos superpesados mudam a cada revisão.

## Mendeleiev (item 4)

Confirmado em https://en.wikipedia.org/wiki/Mendeleev%27s_predicted_elements (baixada em 15/11/2026, `bruto/wiki_Mendeleev_predicted_elements.wikitext`): os quatro elementos previstos mais leves que as terras-raras, eka-boro, eka-alumínio, eka-manganês e eka-silício, correspondem a **escândio (Sc, 21), gálio (Ga, 31), tecnécio (Tc, 43) e germânio (Ge, 32)**, "cada um preenchendo o lugar na tabela periódica reservado por Mendeleiev". Anos, pela mesma página: gálio descoberto em **1875** (Lecoq de Boisbaudran), óxido de escândio isolado em **1879** (Nilson), germânio isolado em **1886**, tecnécio isolado em **1937** (Perrier e Segrè). Batem com o campo `ano` do arquivo (Ga 1875, Sc 1879, Ge 1886, Tc 1937) e com a linha do tempo. A página diz que as previsões são do artigo de 1871 (a tabela é de 1869).

## O que não foi feito ou merece conferência

- Não baixei a página de cada elemento na Wikipedia (a API limitou as requisições do agente anterior); os usos vêm só da RSC.
- Os valores do PubChem não foram conferidos um a um contra uma segunda fonte, fora a massa (NIST), o ano (Wikipedia) e o estado físico (comparado com a lista do próprio site, ver validação).
- As frases de `usos` são resumo e tradução minha do texto da RSC: vale uma leitura do Lucas.
- Nomes de institutos ficaram em inglês, como na fonte (ex.: "Joint Institute for Nuclear Research, Dubna").

<!-- GERADO por gera.py -->

## Brancos (null) por campo

- **z**: 0
- **s**: 0
- **massa**: 0
- **conf**: 0
- **en**: 23 — He, Ne, Ar, Pm, Eu, Tb, Yb, Rn, Rf, Db, Sg, Bh, Hs, Mt, Ds, Rg, Cn, Nh, Fl, Mc, Lv, Ts, Og
- **raio**: 19 — Fm, Md, No, Lr, Rf, Db, Sg, Bh, Hs, Mt, Ds, Rg, Cn, Nh, Fl, Mc, Lv, Ts, Og
- **ei**: 16 — Lr, Rf, Db, Sg, Bh, Hs, Mt, Ds, Rg, Cn, Nh, Fl, Mc, Lv, Ts, Og
- **ae**: 61 — He, Be, N, Ne, Mg, Ar, Ca, Mn, Zn, Kr, Sr, Cd, Xe, Ba, Pr, Nd, Pm, Sm, Eu, Gd, Tb, Dy, Ho, Er, Tm, Yb, Lu, Hf, Hg, Rn, Ra, Ac, Th, Pa, U, Np, Pu, Am, Cm, Bk, Cf, Es, Fm, Md, No, Lr, Rf, Db, Sg, Bh, Hs, Mt, Ds, Rg, Cn, Nh, Fl, Mc, Lv, Ts, Og
- **ox**: 1 — Nh
- **estado**: 9 — Ds, Rg, Cn, Nh, Fl, Mc, Lv, Ts, Og
- **pf**: 15 — Rf, Db, Sg, Bh, Hs, Mt, Ds, Rg, Cn, Nh, Fl, Mc, Lv, Ts, Og
- **pe**: 25 — At, Fr, Pa, Bk, Cf, Es, Fm, Md, No, Lr, Rf, Db, Sg, Bh, Hs, Mt, Ds, Rg, Cn, Nh, Fl, Mc, Lv, Ts, Og
- **dens**: 22 — Fr, Cf, Es, Fm, Md, No, Lr, Rf, Db, Sg, Bh, Hs, Mt, Ds, Rg, Cn, Nh, Fl, Mc, Lv, Ts, Og
- **ano**: 14 — C, S, Fe, Cu, Zn, As, Ag, Sn, Sb, Pt, Au, Hg, Pb, Bi
- **autor**: 0
- **meia**: 80 — H, He, Li, Be, B, C, N, O, F, Ne, Na, Mg, Al, Si, P, S, Cl, Ar, K, Ca, Sc, Ti, V, Cr, Mn, Fe, Co, Ni, Cu, Zn, Ga, Ge, As, Se, Br, Kr, Rb, Sr, Y, Zr, Nb, Mo, Ru, Rh, Pd, Ag, Cd, In, Sn, Sb, Te, I, Xe, Cs, Ba, La, Ce, Pr, Nd, Sm, Eu, Gd, Tb, Dy, Ho, Er, Tm, Yb, Lu, Hf, Ta, W, Re, Os, Ir, Pt, Au, Hg, Tl, Pb
- **usos**: 0

## Configurações previstas (PubChem marca "(predicted)"; o valor foi mantido, sem a marca)

Ds, Rg, Cn, Nh, Fl, Mc, Lv, Ts, Og

## Estado "esperado" no PubChem (ficou null)

Ds ("Expected to be a Solid"), Rg ("Expected to be a Solid"), Cn ("Expected to be a Solid"), Nh ("Expected to be a Solid"), Fl ("Expected to be a Solid"), Mc ("Expected to be a Solid"), Lv ("Expected to be a Solid"), Ts ("Expected to be a Solid"), Og ("Expected to be a Gas")

## pf ≥ pe (exceções reais na fonte)

- As: pf 1090 K ≥ pe 887 K

## Divergências de massa PubChem × NIST (> 0,01 u). Ficou sempre o PubChem.

- Ar (Z=18): PubChem 39.9 × NIST 39.948(1)
- Zn (Z=30): PubChem 65.4 × NIST 65.38(2)
- Tc (Z=43): PubChem 96.90636 (massa de um isótopo) × NIST [98] (número de massa do isótopo mais estável na lista do NIST): isótopos diferentes
- Ru (Z=44): PubChem 101.1 × NIST 101.07(2)
- Sm (Z=62): PubChem 150.4 × NIST 150.36(2)
- Os (Z=76): PubChem 190.2 × NIST 190.23(3)
- Pb (Z=82): PubChem 207.0 × NIST 207.2(1)
- Am (Z=95): o NIST não dá peso atômico padrão; PubChem 243.06138 (massa de um isótopo)
- Cm (Z=96): o NIST não dá peso atômico padrão; PubChem 247.07035 (massa de um isótopo)
- Bk (Z=97): o NIST não dá peso atômico padrão; PubChem 247.07031 (massa de um isótopo)
- Cf (Z=98): o NIST não dá peso atômico padrão; PubChem 251.07959 (massa de um isótopo)
- Es (Z=99): o NIST não dá peso atômico padrão; PubChem 252.083 (massa de um isótopo)
- Fm (Z=100): o NIST não dá peso atômico padrão; PubChem 257.09511 (massa de um isótopo)
- Md (Z=101): o NIST não dá peso atômico padrão; PubChem 258.09843 (massa de um isótopo)
- No (Z=102): o NIST não dá peso atômico padrão; PubChem 259.101 (massa de um isótopo)
- Lr (Z=103): o NIST não dá peso atômico padrão; PubChem 266.12 (massa de um isótopo)
- Rf (Z=104): o NIST não dá peso atômico padrão; PubChem 267.122 (massa de um isótopo)
- Db (Z=105): o NIST não dá peso atômico padrão; PubChem 268.126 (massa de um isótopo)
- Sg (Z=106): o NIST não dá peso atômico padrão; PubChem 269.128 (massa de um isótopo)
- Bh (Z=107): o NIST não dá peso atômico padrão; PubChem 270.133 (massa de um isótopo)
- Hs (Z=108): o NIST não dá peso atômico padrão; PubChem 269.1336 (massa de um isótopo)
- Mt (Z=109): o NIST não dá peso atômico padrão; PubChem 277.154 (massa de um isótopo)
- Ds (Z=110): o NIST não dá peso atômico padrão; PubChem 282.166 (massa de um isótopo)
- Rg (Z=111): o NIST não dá peso atômico padrão; PubChem 282.169 (massa de um isótopo)
- Cn (Z=112): o NIST não dá peso atômico padrão; PubChem 286.179 (massa de um isótopo)
- Nh (Z=113): o NIST não dá peso atômico padrão; PubChem 286.182 (massa de um isótopo)
- Fl (Z=114): o NIST não dá peso atômico padrão; PubChem 290.192 (massa de um isótopo)
- Mc (Z=115): o NIST não dá peso atômico padrão; PubChem 290.196 (massa de um isótopo)
- Lv (Z=116): o NIST não dá peso atômico padrão; PubChem 293.205 (massa de um isótopo)
- Ts (Z=117): o NIST não dá peso atômico padrão; PubChem 294.211 (massa de um isótopo)
- Og (Z=118): o NIST não dá peso atômico padrão; PubChem 295.216 (massa de um isótopo)

## Massas que o PubChem dá com no máximo uma casa decimal (valor abreviado da IUPAC; mantido como está)

Li 7.0, Ar 39.9, Zn 65.4, Ru 101.1, Te 127.6, Sm 150.4, Os 190.2, Pb 207

## Divergências de ano PubChem × Wikipedia

- H (Z=1): PubChem 1766 × Wikipedia observado 1671 (Robert Boyle), isolado 1671 (Robert Boyle). Ficou 1671, Robert Boyle.
- B (Z=5): PubChem 1808 × Wikipedia observado 1787 (Louis-Bernard Guyton de Morveau, Antoine Lavoisier, Claude Louis Berthollet e Antoine François, comte de Fourcroy), isolado 1809 (Humphry Davy). Ficou 1787, Louis-Bernard Guyton de Morveau, Antoine Lavoisier, Claude Louis Berthollet e Antoine François, comte de Fourcroy.
- O (Z=8): PubChem 1774 × Wikipedia observado 1771 (Carl Wilhelm Scheele), isolado 1771 (Carl Wilhelm Scheele). Ficou 1771, Carl Wilhelm Scheele.
- F (Z=9): PubChem 1670 × Wikipedia observado 1771 (Carl Wilhelm Scheele), isolado 1886 (Henri Moissan). Ficou 1771, Carl Wilhelm Scheele.
- Al (Z=13): PubChem Ancient × Wikipedia observado 1746 (Johann Heinrich Pott), isolado 1825 (Hans Christian Ørsted). Ficou 1746, Johann Heinrich Pott.
- Si (Z=14): PubChem 1854 × Wikipedia observado 1739 (Johann Heinrich Pott), isolado 1823 (Jöns Jakob Berzelius). Ficou 1739, Johann Heinrich Pott.
- Ca (Z=20): PubChem Ancient × Wikipedia observado 1739 (Johann Heinrich Pott), isolado 1808 (Humphry Davy). Ficou 1739, Johann Heinrich Pott.
- Zn (Z=30): PubChem dá 1746; a Wikipedia põe na tabela dos pré-modernos (uso mais antigo: Before 1000 BC). Ficou null / "conhecido desde a Antiguidade".
- Br (Z=35): PubChem 1826 × Wikipedia observado 1825 (Antoine Jérôme Balard e Carl Jacob Löwig), isolado 1825 (Antoine Jérôme Balard e Carl Jacob Löwig). Ficou 1825, Antoine Jérôme Balard e Carl Jacob Löwig.
- Ru (Z=44): PubChem 1827 × Wikipedia observado 1844 (Karl Ernst Claus), isolado 1844 (Karl Ernst Claus). Ficou 1844, Karl Ernst Claus.
- Rh (Z=45): PubChem 1803 × Wikipedia observado 1804 (William Hyde Wollaston), isolado 1804 (William Hyde Wollaston). Ficou 1804, William Hyde Wollaston.
- Pd (Z=46): PubChem 1803 × Wikipedia observado 1802 (William Hyde Wollaston), isolado 1802 (William Hyde Wollaston). Ficou 1802, William Hyde Wollaston.
- La (Z=57): PubChem 1839 × Wikipedia observado 1838 (Carl Gustaf Mosander), isolado 1904 (W. Muthmann e L. Weiss). Ficou 1838, Carl Gustaf Mosander.
- Nd (Z=60): PubChem 1885 × Wikipedia observado 1841 (Carl Gustaf Mosander), isolado 1901 (W. Muthmann, H. Hofer e L. Weiss). Ficou 1841, Carl Gustaf Mosander.
- Eu (Z=63): PubChem 1901 × Wikipedia observado 1896 (Eugène-Anatole Demarçay), isolado 1937 (Wilhelm Klemm e H. Bommer). Ficou 1896, Eugène-Anatole Demarçay.
- Lu (Z=71): PubChem 1907 × Wikipedia observado 1906 (Carl Auer von Welsbach e Georges Urbain), isolado 1937 (Wilhelm Klemm e H. Bommer). Ficou 1906, Carl Auer von Welsbach e Georges Urbain.
- Hf (Z=72): PubChem 1923 × Wikipedia observado 1922 (Dirk Coster e Georg von Hevesy), isolado 1924 (Anton Eduard van Arkel e Jan Hendrik de Boer). Ficou 1922, Dirk Coster e Georg von Hevesy.
- Re (Z=75): PubChem 1925 × Wikipedia observado 1908 (Masataka Ogawa), isolado 1908 (Masataka Ogawa). Ficou 1908, Masataka Ogawa.
- Pt (Z=78): PubChem dá 1735; a Wikipedia põe na tabela dos pré-modernos (uso mais antigo: c. 600 BC – AD 200). Ficou null / "conhecido desde a Antiguidade".
- Bi (Z=83): PubChem dá 1753; a Wikipedia põe na tabela dos pré-modernos (uso mais antigo: c. 1500). Ficou null / "conhecido desde a Antiguidade".
- Rn (Z=86): PubChem 1900 × Wikipedia observado 1899 (Ernest Rutherford e Robert B. Owens), isolado 1910 (William Ramsay e Robert Whytlaw-Gray). Ficou 1899, Ernest Rutherford e Robert B. Owens.
- Ac (Z=89): PubChem 1899 × Wikipedia observado 1902 (Friedrich Oskar Giesel), isolado 1955 (Joseph G. Stites, Murrell L. Salutsky e Bob D. Stone). Ficou 1902, Friedrich Oskar Giesel.
- Th (Z=90): PubChem 1828 × Wikipedia observado 1829 (Jöns Jakob Berzelius), isolado 1914 (D. Lely, Jr. e L. Hamburger). Ficou 1829, Jöns Jakob Berzelius.
- Pu (Z=94): PubChem 1940 × Wikipedia observado 1941 (Glenn T. Seaborg, Arthur C. Wahl, Joseph W. Kennedy e Edwin McMillan), isolado 1943 (H. L. Baumbach, S. Fried, P. L. Kirk e R. S. Rosenfels). Ficou 1941, Glenn T. Seaborg, Arthur C. Wahl, Joseph W. Kennedy e Edwin McMillan.
- Fm (Z=100): PubChem 1952 × Wikipedia observado 1953 (Albert Ghiorso et al. (Argonne Laboratory, Los Alamos Laboratory e University of California, Berkeley)). Ficou 1953, Albert Ghiorso et al. (Argonne Laboratory, Los Alamos Laboratory e University of California, Berkeley).
- No (Z=102): PubChem 1957 × Wikipedia observado 1965 (E. D. Donets, V. A. Shchegolev e V. A. Ermakov (Joint Institute for Nuclear Research, Dubna)). Ficou 1965, E. D. Donets, V. A. Shchegolev e V. A. Ermakov (Joint Institute for Nuclear Research, Dubna).
- Rf (Z=104): PubChem 1964 × Wikipedia observado 1969 (Albert Ghiorso et al. (Berkeley Radiation Laboratory) e I. Zvara et al. (Joint Institute for Nuclear Research, Dubna)). Ficou 1969, Albert Ghiorso et al. (Berkeley Radiation Laboratory) e I. Zvara et al. (Joint Institute for Nuclear Research, Dubna).
- Db (Z=105): PubChem 1967 × Wikipedia observado 1970 (Albert Ghiorso et al. (Berkeley Radiation Laboratory) e V. A. Druin et al. (Joint Institute for Nuclear Research, Dubna)). Ficou 1970, Albert Ghiorso et al. (Berkeley Radiation Laboratory) e V. A. Druin et al. (Joint Institute for Nuclear Research, Dubna).
- Bh (Z=107): PubChem 1976 × Wikipedia observado 1981 (Gottfried Münzenberg et al. (GSI Helmholtz Centre for Heavy Ion Research)). Ficou 1981, Gottfried Münzenberg et al. (GSI Helmholtz Centre for Heavy Ion Research).
- Fl (Z=114): PubChem 1998 × Wikipedia observado 1999 (Yuri Oganessian et al. (Joint Institute for Nuclear Research, Dubna)). Ficou 1999, Yuri Oganessian et al. (Joint Institute for Nuclear Research, Dubna).
- Ts (Z=117): PubChem 2010 × Wikipedia observado 2009 (Yuri Oganessian et al. (Joint Institute for Nuclear Research, Dubna)). Ficou 2009, Yuri Oganessian et al. (Joint Institute for Nuclear Research, Dubna).
- Og (Z=118): PubChem 2006 × Wikipedia observado 2002 (Yuri Oganessian et al. (Joint Institute for Nuclear Research, Dubna)). Ficou 2002, Yuri Oganessian et al. (Joint Institute for Nuclear Research, Dubna).

## Meia-vida de Bi, Th e U: duas páginas baixadas

- Bi: ficou "²⁰⁹Bi: 2,01 × 10¹⁹ anos" (página Isotopes of …); a lista "radioactive nuclides by half-life" dá 20,1 × 10¹⁸ anos.
- Th: ficou "²³²Th: 1,40 × 10¹⁰ anos" (página Isotopes of …); a lista "radioactive nuclides by half-life" dá 14,05 × 10⁹ anos.
- U: ficou "²³⁸U: 4,463 × 10⁹ anos" (página Isotopes of …); a lista "radioactive nuclides by half-life" dá 4,468 × 10⁹ anos.

## Autores que ficaram com o nome abreviado (a tabela da Wikipedia não traz o nome completo)

E. D. Donets, I. Zvara, J.C.H. Roloff, K. Morita, V. A. Druin, V. A. Ermakov, V. A. Shchegolev

## Tabela completa de ano e autor (para decidir à mão)

| Z | s | PubChem | Wikipedia observado | por | Wikipedia isolado | por | ficou | regra |
|---|---|---|---|---|---|---|---|---|
| 1 | H | 1766 | 1671 | Robert Boyle | 1671 | Robert Boyle | 1671 | observado (PubChem diverge) |
| 2 | He | 1868 | 1868 | Joseph Norman Lockyer | 1895 | William Ramsay, Per Theodor Cleve e Nils Langlet | 1868 | observado = PubChem |
| 3 | Li | 1817 | 1817 | Johan August Arfwedson | 1821 | William Thomas Brande | 1817 | observado = PubChem |
| 4 | Be | 1798 | 1798 | Louis Nicolas Vauquelin | 1828 | Friedrich Wöhler e Antoine Bussy | 1798 | observado = PubChem |
| 5 | B | 1808 | 1787 | Louis-Bernard Guyton de Morveau, Antoine Lavoisier, Claude Louis Berthollet e Antoine François, comte de Fourcroy | 1809 | Humphry Davy | 1787 | observado (PubChem diverge) |
| 7 | N | 1772 | 1772 | Daniel Rutherford | 1772 | Daniel Rutherford | 1772 | observado = PubChem |
| 8 | O | 1774 | 1771 | Carl Wilhelm Scheele | 1771 | Carl Wilhelm Scheele | 1771 | observado (PubChem diverge) |
| 9 | F | 1670 | 1771 | Carl Wilhelm Scheele | 1886 | Henri Moissan | 1771 | observado (PubChem diverge) |
| 10 | Ne | 1898 | 1898 | William Ramsay e Morris W. Travers | 1898 | William Ramsay e Morris W. Travers | 1898 | observado = PubChem |
| 11 | Na | 1807 | 1702 | Georg Ernst Stahl | 1807 | Humphry Davy | 1807 | isolado = PubChem |
| 12 | Mg | 1808 | 1755 | Joseph Black | 1808 | Humphry Davy | 1808 | isolado = PubChem |
| 13 | Al | Ancient | 1746 | Johann Heinrich Pott | 1825 | Hans Christian Ørsted | 1746 | observado (PubChem diverge) |
| 14 | Si | 1854 | 1739 | Johann Heinrich Pott | 1823 | Jöns Jakob Berzelius | 1739 | observado (PubChem diverge) |
| 15 | P | 1669 | 1669 | Hennig Brand | 1669 | Hennig Brand | 1669 | observado = PubChem |
| 17 | Cl | 1774 | 1774 | Carl Wilhelm Scheele | 1774 | Carl Wilhelm Scheele | 1774 | observado = PubChem |
| 18 | Ar | 1894 | 1894 | Lord Rayleigh e William Ramsay | 1894 | Lord Rayleigh e William Ramsay | 1894 | observado = PubChem |
| 19 | K | 1807 | 1702 | Georg Ernst Stahl | 1807 | Humphry Davy | 1807 | isolado = PubChem |
| 20 | Ca | Ancient | 1739 | Johann Heinrich Pott | 1808 | Humphry Davy | 1739 | observado (PubChem diverge) |
| 21 | Sc | 1879 | 1879 | Lars Fredrik Nilson | 1937 | W. Fischer, K. Brünger e H. Grieneisen | 1879 | observado = PubChem |
| 22 | Ti | 1791 | 1791 | William Gregor | 1875 | D. K. Kirillov | 1791 | observado = PubChem |
| 23 | V | 1801 | 1801 | Andrés Manuel del Río | 1867 | Henry Enfield Roscoe | 1801 | observado = PubChem |
| 24 | Cr | 1797 | 1797 | Louis Nicolas Vauquelin | 1798 | Louis Nicolas Vauquelin | 1797 | observado = PubChem |
| 25 | Mn | 1774 | 1770 | Torbern Olof Bergman | 1774 | Johan Gottlieb Gahn | 1774 | isolado = PubChem |
| 27 | Co | 1735 | 1735 | Georg Brandt | 1735 | Georg Brandt | 1735 | observado = PubChem |
| 28 | Ni | 1751 | 1751 | Axel Fredrik Cronstedt | 1751 | Axel Fredrik Cronstedt | 1751 | observado = PubChem |
| 31 | Ga | 1875 | 1875 | Paul Emile Lecoq de Boisbaudran | 1878 | Paul Emile Lecoq de Boisbaudran e Emil Jungfleisch | 1875 | observado = PubChem |
| 32 | Ge | 1886 | 1886 | Clemens Winkler | 1886 | Clemens Winkler | 1886 | observado = PubChem |
| 34 | Se | 1817 | 1817 | Jöns Jakob Berzelius e Johann Gottlieb Gahn | 1817 | Jöns Jakob Berzelius e Johann Gottlieb Gahn | 1817 | observado = PubChem |
| 35 | Br | 1826 | 1825 | Antoine Jérôme Balard e Carl Jacob Löwig | 1825 | Antoine Jérôme Balard e Carl Jacob Löwig | 1825 | observado (PubChem diverge) |
| 36 | Kr | 1898 | 1898 | William Ramsay e Morris W. Travers | 1898 | William Ramsay e Morris W. Travers | 1898 | observado = PubChem |
| 37 | Rb | 1861 | 1861 | Gustav Kirchhoff e Robert Bunsen | 1863 | Robert Bunsen | 1861 | observado = PubChem |
| 38 | Sr | 1790 | 1790 | Adair Crawford | 1808 | Humphry Davy | 1790 | observado = PubChem |
| 39 | Y | 1794 | 1794 | Johan Gadolin | 1843 | Heinrich Rose | 1794 | observado = PubChem |
| 40 | Zr | 1789 | 1789 | Martin Heinrich Klaproth | 1824 | Jöns Jakob Berzelius | 1789 | observado = PubChem |
| 41 | Nb | 1801 | 1801 | Charles Hatchett | 1864 | Christian Wilhelm Blomstrand | 1801 | observado = PubChem |
| 42 | Mo | 1778 | 1778 | Carl Wilhelm Scheele | 1788 | Peter Jacob Hjelm | 1778 | observado = PubChem |
| 43 | Tc | 1937 | 1937 | Carlo Perrier e Emilio Segrè | 1947 | S. Fried | 1937 | observado = PubChem |
| 44 | Ru | 1827 | 1844 | Karl Ernst Claus | 1844 | Karl Ernst Claus | 1844 | observado (PubChem diverge) |
| 45 | Rh | 1803 | 1804 | William Hyde Wollaston | 1804 | William Hyde Wollaston | 1804 | observado (PubChem diverge) |
| 46 | Pd | 1803 | 1802 | William Hyde Wollaston | 1802 | William Hyde Wollaston | 1802 | observado (PubChem diverge) |
| 48 | Cd | 1817 | 1817 | Karl Samuel Leberecht Hermann, Friedrich Stromeyer e J.C.H. Roloff | 1817 | Karl Samuel Leberecht Hermann, Friedrich Stromeyer e J.C.H. Roloff | 1817 | observado = PubChem |
| 49 | In | 1863 | 1863 | Ferdinand Reich e Hieronymous Theodor Richter | 1864 | Hieronymous Theodor Richter | 1863 | observado = PubChem |
| 52 | Te | 1782 | 1782 | Franz-Joseph Müller von Reichenstein | 1798 | Martin Heinrich Klaproth | 1782 | observado = PubChem |
| 53 | I | 1811 | 1811 | Bernard Courtois | 1811 | Bernard Courtois | 1811 | observado = PubChem |
| 54 | Xe | 1898 | 1898 | William Ramsay e Morris W. Travers | 1898 | William Ramsay e Morris W. Travers | 1898 | observado = PubChem |
| 55 | Cs | 1860 | 1860 | Gustav Kirchhoff e Robert Bunsen | 1882 | Carl Setterberg | 1860 | observado = PubChem |
| 56 | Ba | 1808 | 1772 | Carl Wilhelm Scheele | 1808 | Humphry Davy | 1808 | isolado = PubChem |
| 57 | La | 1839 | 1838 | Carl Gustaf Mosander | 1904 | W. Muthmann e L. Weiss | 1838 | observado (PubChem diverge) |
| 58 | Ce | 1803 | 1803 | Martin Heinrich Klaproth, Wilhelm Hisinger e Jöns Jakob Berzelius | 1875 | William Francis Hillebrand e T. H. Norton | 1803 | observado = PubChem |
| 59 | Pr | 1885 | 1885 | Carl Auer von Welsbach | 1904 | W. Muthmann e L. Weiss | 1885 | observado = PubChem |
| 60 | Nd | 1885 | 1841 | Carl Gustaf Mosander | 1901 | W. Muthmann, H. Hofer e L. Weiss | 1841 | observado (PubChem diverge) |
| 61 | Pm | 1945 | 1945 | Jacob A. Marinsky, Lawrence E. Glendenin e Charles D. Coryell | 1963 | F. Weigel | 1945 | observado = PubChem |
| 62 | Sm | 1879 | 1879 | Paul Emile Lecoq de Boisbaudran | 1903 | W. Muthmann | 1879 | observado = PubChem |
| 63 | Eu | 1901 | 1896 | Eugène-Anatole Demarçay | 1937 | Wilhelm Klemm e H. Bommer | 1896 | observado (PubChem diverge) |
| 64 | Gd | 1880 | 1880 | Jean Charles Galissard de Marignac | 1935 | Félix Trombe | 1880 | observado = PubChem |
| 65 | Tb | 1843 | 1843 | Carl Gustaf Mosander | 1937 | Wilhelm Klemm e H. Bommer | 1843 | observado = PubChem |
| 66 | Dy | 1886 | 1886 | Paul Emile Lecoq de Boisbaudran | 1937 | Wilhelm Klemm e H. Bommer | 1886 | observado = PubChem |
| 67 | Ho | 1878 | 1878 | Jacques-Louis Soret e Marc Delafontaine | 1939 | H. Bommer | 1878 | observado = PubChem |
| 68 | Er | 1843 | 1843 | Carl Gustaf Mosander | 1934 | Wilhelm Klemm e H. Bommer | 1843 | observado = PubChem |
| 69 | Tm | 1879 | 1879 | Per Theodor Cleve | 1936 | Wilhelm Klemm e H. Bommer | 1879 | observado = PubChem |
| 70 | Yb | 1878 | 1878 | Jean Charles Galissard de Marignac | 1936 | Wilhelm Klemm e H. Bommer | 1878 | observado = PubChem |
| 71 | Lu | 1907 | 1906 | Carl Auer von Welsbach e Georges Urbain | 1937 | Wilhelm Klemm e H. Bommer | 1906 | observado (PubChem diverge) |
| 72 | Hf | 1923 | 1922 | Dirk Coster e Georg von Hevesy | 1924 | Anton Eduard van Arkel e Jan Hendrik de Boer | 1922 | observado (PubChem diverge) |
| 73 | Ta | 1802 | 1802 | Anders Gustaf Ekeberg | 1864 | Jean Charles Galissard de Marignac | 1802 | observado = PubChem |
| 74 | W | 1783 | 1781 | Carl Wilhelm Scheele | 1783 | Juan José Elhuyar e Fausto Elhuyar | 1783 | isolado = PubChem |
| 75 | Re | 1925 | 1908 | Masataka Ogawa | 1908 | Masataka Ogawa | 1908 | observado (PubChem diverge) |
| 76 | Os | 1803 | 1803 | Smithson Tennant | 1803 | Smithson Tennant | 1803 | observado = PubChem |
| 77 | Ir | 1803 | 1803 | Smithson Tennant e Hippolyte-Victor Collet-Descotils | 1803 | Smithson Tennant | 1803 | observado = PubChem |
| 81 | Tl | 1861 | 1861 | William Crookes | 1862 | Claude-Auguste Lamy | 1861 | observado = PubChem |
| 84 | Po | 1898 | 1898 | Pierre Curie e Marie Curie | 1946 | W. H. Beamer e C. R. Maxwell | 1898 | observado = PubChem |
| 85 | At | 1940 | 1940 | Dale R. Corson, Kenneth Ross MacKenzie e Emilio Segrè | — | — | 1940 | observado = PubChem |
| 86 | Rn | 1900 | 1899 | Ernest Rutherford e Robert B. Owens | 1910 | William Ramsay e Robert Whytlaw-Gray | 1899 | observado (PubChem diverge) |
| 87 | Fr | 1939 | 1939 | Marguerite Perey | — | — | 1939 | observado = PubChem |
| 88 | Ra | 1898 | 1898 | Pierre Curie e Marie Curie | 1910 | Marie Curie e André-Louis Debierne | 1898 | observado = PubChem |
| 89 | Ac | 1899 | 1902 | Friedrich Oskar Giesel | 1955 | Joseph G. Stites, Murrell L. Salutsky e Bob D. Stone | 1902 | observado (PubChem diverge) |
| 90 | Th | 1828 | 1829 | Jöns Jakob Berzelius | 1914 | D. Lely, Jr. e L. Hamburger | 1829 | observado (PubChem diverge) |
| 91 | Pa | 1913 | 1913 | Kasimir Fajans e Oswald Helmuth Göhring | 1934 | Aristid von Grosse | 1913 | observado = PubChem |
| 92 | U | 1789 | 1789 | Martin Heinrich Klaproth | 1841 | Eugène-Melchior Péligot | 1789 | observado = PubChem |
| 93 | Np | 1940 | 1940 | Edwin McMillan e Philip H. Abelson | 1945 | S. Fried | 1940 | observado = PubChem |
| 94 | Pu | 1940 | 1941 | Glenn T. Seaborg, Arthur C. Wahl, Joseph W. Kennedy e Edwin McMillan | 1943 | H. L. Baumbach, S. Fried, P. L. Kirk e R. S. Rosenfels | 1941 | observado (PubChem diverge) |
| 95 | Am | 1944 | 1944 | Glenn T. Seaborg, Ralph A. James, Leon O. Morgan e Albert Ghiorso | 1951 | Edgar F. Westrum Jr. e LeRoy Eyring | 1944 | observado = PubChem |
| 96 | Cm | 1944 | 1944 | Glenn T. Seaborg, Ralph A. James e Albert Ghiorso | 1950 | J. C. Wallmann, W. W. T. Crane e B. B. Cunningham | 1944 | observado = PubChem |
| 97 | Bk | 1949 | 1949 | Stanley G. Thompson, Albert Ghiorso e Glenn T. Seaborg (University of California, Berkeley) | 1969 | J. R. Peterson, J. A. Fahey e R. D. Baybarz | 1949 | observado = PubChem |
| 98 | Cf | 1950 | 1950 | Stanley G. Thompson, Kenneth Street, Jr., Albert Ghiorso e Glenn T. Seaborg (University of California, Berkeley) | 1974 | R. G. Haire e R. D. Baybarz | 1950 | observado = PubChem |
| 99 | Es | 1952 | 1952 | Albert Ghiorso et al. (Argonne Laboratory, Los Alamos Laboratory e University of California, Berkeley) | 1979 | R. G. Haire e R. D. Baybarz | 1952 | observado = PubChem |
| 100 | Fm | 1952 | 1953 | Albert Ghiorso et al. (Argonne Laboratory, Los Alamos Laboratory e University of California, Berkeley) | — | — | 1953 | observado (PubChem diverge) |
| 101 | Md | 1955 | 1955 | Albert Ghiorso, Bernard G. Harvey, Gregory R. Choppin, Stanley G. Thompson e Glenn T. Seaborg (Berkeley Radiation Laboratory) | — | — | 1955 | observado = PubChem |
| 102 | No | 1957 | 1965 | E. D. Donets, V. A. Shchegolev e V. A. Ermakov (Joint Institute for Nuclear Research, Dubna) | — | — | 1965 | observado (PubChem diverge) |
| 103 | Lr | 1961 | 1961 | Albert Ghiorso, Torbjørn Sikkeland, Almon E. Larsh e Robert M. Latimer (Berkeley Radiation Laboratory) | — | — | 1961 | observado = PubChem |
| 104 | Rf | 1964 | 1969 | Albert Ghiorso et al. (Berkeley Radiation Laboratory) e I. Zvara et al. (Joint Institute for Nuclear Research, Dubna) | — | — | 1969 | observado (PubChem diverge) |
| 105 | Db | 1967 | 1970 | Albert Ghiorso et al. (Berkeley Radiation Laboratory) e V. A. Druin et al. (Joint Institute for Nuclear Research, Dubna) | — | — | 1970 | observado (PubChem diverge) |
| 106 | Sg | 1974 | 1974 | Albert Ghiorso et al. (Berkeley Radiation Laboratory) | — | — | 1974 | observado = PubChem |
| 107 | Bh | 1976 | 1981 | Gottfried Münzenberg et al. (GSI Helmholtz Centre for Heavy Ion Research) | — | — | 1981 | observado (PubChem diverge) |
| 108 | Hs | 1984 | 1984 | Gottfried Münzenberg, Peter Armbruster et al. (GSI Helmholtz Centre for Heavy Ion Research) | — | — | 1984 | observado = PubChem |
| 109 | Mt | 1982 | 1982 | Gottfried Münzenberg, Peter Armbruster et al. (GSI Helmholtz Centre for Heavy Ion Research) | — | — | 1982 | observado = PubChem |
| 110 | Ds | 1994 | 1994 | Sigurd Hofmann et al. (GSI Helmholtz Centre for Heavy Ion Research) | — | — | 1994 | observado = PubChem |
| 111 | Rg | 1994 | 1994 | Sigurd Hofmann et al. (GSI Helmholtz Centre for Heavy Ion Research) | — | — | 1994 | observado = PubChem |
| 112 | Cn | 1996 | 1996 | Sigurd Hofmann et al. (GSI Helmholtz Centre for Heavy Ion Research) | — | — | 1996 | observado = PubChem |
| 113 | Nh | 2004 | 2003–2004 | Yuri Oganessian et al. (Joint Institute for Nuclear Research, Dubna) e K. Morita et al. (RIKEN, Wako, Japão) | — | — | 2004 | observado = PubChem |
| 114 | Fl | 1998 | 1999 | Yuri Oganessian et al. (Joint Institute for Nuclear Research, Dubna) | — | — | 1999 | observado (PubChem diverge) |
| 115 | Mc | 2003 | 2003 | Yuri Oganessian et al. (Joint Institute for Nuclear Research, Dubna) | — | — | 2003 | observado = PubChem |
| 116 | Lv | 2000 | 2000 | Yuri Oganessian et al. (Joint Institute for Nuclear Research, Dubna) | — | — | 2000 | observado = PubChem |
| 117 | Ts | 2010 | 2009 | Yuri Oganessian et al. (Joint Institute for Nuclear Research, Dubna) | — | — | 2009 | observado (PubChem diverge) |
| 118 | Og | 2006 | 2002 | Yuri Oganessian et al. (Joint Institute for Nuclear Research, Dubna) | — | — | 2002 | observado (PubChem diverge) |

| Z | s | PubChem | Wikipedia: uso mais antigo | nota da Wikipedia (início) |
|---|---|---|---|---|
| 6 | C | Ancient | 26000 BC | Charcoal and soot were known to the earliest humans, with the oldest known [[charcoal (art)|charcoal paintings]] dating to about 28000 years ago, e.g. [[Gabarnm… |
| 16 | S | Ancient | Before 2000 BC | First used at least 4,000 years ago. According to the [[Ebers Papyrus]], a sulfur ointment was used in ancient [[Egypt]] to treat granular eyelids. (The Ebers p… |
| 26 | Fe | Ancient | Before 5000 BC | There is evidence that iron was known from before 5000 BC. The oldest known iron objects used by humans are some beads of [[meteoric iron]], made in Egypt in ab… |
| 29 | Cu | Ancient | 9000 BC | It was originally obtained as a native metal and later from the smelting of ores. Earliest estimates of the discovery of copper suggest around 9000 BC in the Mi… |
| 30 | Zn | 1746 | Before 1000 BC | Used as a component of [[brass]] since antiquity (before 1000&nbsp;BC) by Indian metallurgists, but its true nature was not generally understood in ancient time… |
| 33 | As | Ancient | c. AD 300 | The use of metallic arsenic was described by the Egyptian alchemist [[Zosimos of Panopolis|Zosimos]]. The purification of arsenic was later described in the wor… |
| 47 | Ag | Ancient | Before 5000 BC | Estimated to have been discovered in [[Asia Minor]] shortly after copper and gold. Recognised as an element by Guyton de Morveau, Lavoisier, Berthollet, and Fou… |
| 50 | Sn | Ancient | 3500 BC | First smelted in combination with copper around 3500&nbsp;BC to produce [[bronze]] (and thus giving place to the [[Bronze Age]] in those places where [[Iron Age… |
| 51 | Sb | Ancient | 3000 BC | An artifact, said to be part of a vase, made of very pure antimony dating to about 3000&nbsp;BC was found at [[Girsu|Telloh]], [[Chaldea]] (part of present-day … |
| 78 | Pt | 1735 | c. 600 BC – AD 200 | Used by [[pre-Columbian]] Americans near modern-day [[Esmeraldas, Ecuador]] to produce artifacts of a white gold-platinum alloy, although precise dating is diff… |
| 79 | Au | Ancient | 40000 BC | Small amounts of natural gold have been found in Spanish caves used during the late [[Paleolithic]] period, {{Circa|40000 BC}}. The earliest gold artifacts dati… |
| 80 | Hg | Ancient | 1500 BC | [[Cinnabar]] (the most common mineral form of [[mercury(II) sulfide]], HgS) was used as a pigment from prehistory, dating as far back as the 9th millennium BC i… |
| 82 | Pb | Ancient | 7000 BC | It is believed that lead smelting began at least 9,000 years ago, and the oldest known artifact of lead is a statuette found at the temple of [[Osiris]] on the … |
| 83 | Bi | 1753 | c. 1500 | Bismuth was known since ancient times, but often confused with tin and lead, which are chemically similar. The [[Incas]] used bismuth (along with the usual copp… |
