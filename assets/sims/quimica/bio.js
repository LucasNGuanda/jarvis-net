/* Química · módulo I (bioquímica e ambiental): tabelas geradas a partir de dados com fonte e laboratórios dos temas I01 a I09.
   As tabelas (SIM.BIO) são GERADAS por tools/quimica/gera-bio.py a partir de tools/quimica/dadosI.json (valor, fonte e trecho de cada dado).
   Os desenhos de estruturas usam o núcleo de orgânica (SIM.org, assets/sims/quimica/organica.js), que tem de ser carregado antes. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const seletor = (rot, itens) => `<label style="font-size:13.5px;color:var(--ink2)">${rot} <select data-v="sel" style="font:inherit;padding:5px 8px;border-radius:8px;background:var(--card,#161b24);color:inherit;border:1px solid var(--line,#2a3140);max-width:440px">${itens.map((n, k) => `<option value="${k}">${n}</option>`).join("")}</select></label>`;
  const nt = (v, d = 1) => (SIM.vg ? SIM.vg(v, d) : String(v).replace(".", ","));
  const faixa = (v, un, d = 2) => (v === null || v === undefined ? "sem dado" : Array.isArray(v) ? `${nt(v[0], d)} a ${nt(v[1], d)} ${un}` : `${nt(v, d)} ${un}`);

  /*BIO-INI*/ /* GERADO por tools/quimica/gera-bio.py a partir de tools/quimica/dadosI.json: não editar à mão */
  SIM.BIO = {
    POL: [
      {"k": "polietileno", "nome": "polietileno", "sig": "PE", "tipo": "adição", "mon": [["eteno (etileno)", "C=C"]], "un": "–CH₂–CH₂–", "fu": "C2H4", "mu": 28, "aguas": 0, "fun": "só C e H", "d": [0.88, 0.96], "pf": [115, 135], "cod": null},
      {"k": "polipropileno", "nome": "polipropileno", "sig": "PP", "tipo": "adição", "mon": [["propeno (propileno)", "C=CC"]], "un": "–CH₂–CH(CH₃)–", "fu": "C3H6", "mu": 42, "aguas": 0, "fun": "só C e H", "d": 0.855, "pf": [130, 171], "cod": 5},
      {"k": "PVC", "nome": "poli(cloreto de vinila)", "sig": "PVC", "tipo": "adição", "mon": [["cloroeteno (cloreto de vinila)", "C=CCl"]], "un": "–CH₂–CHCl–", "fu": "C2H3Cl", "mu": 62.5, "aguas": 0, "fun": "haleto", "d": 1.4, "pf": 100, "cod": 3},
      {"k": "poliestireno", "nome": "poliestireno", "sig": "PS", "tipo": "adição", "mon": [["vinilbenzeno (estireno)", "C=Cc1ccccc1"]], "un": "–CH₂–CH(C₆H₅)–", "fu": "C8H8", "mu": 104, "aguas": 0, "fun": "anel aromático", "d": [0.96, 1.05], "pf": 240, "cod": 6},
      {"k": "PTFE", "nome": "politetrafluoroetileno (teflon)", "sig": "PTFE", "tipo": "adição", "mon": [["tetrafluoroeteno", "FC(F)=C(F)F"]], "un": "–CF₂–CF₂–", "fu": "C2F4", "mu": 100, "aguas": 0, "fun": "haleto", "d": 2.2, "pf": 327, "cod": null},
      {"k": "poliacrilonitrila", "nome": "poliacrilonitrila", "sig": "PAN", "tipo": "adição", "mon": [["propenonitrila (acrilonitrila)", "C=CC#N"]], "un": "–CH₂–CH(CN)–", "fu": "C3H3N", "mu": 53, "aguas": 0, "fun": "nitrila", "d": 1.184, "pf": 300, "cod": null},
      {"k": "PMMA", "nome": "poli(metacrilato de metila) (acrílico)", "sig": "PMMA", "tipo": "adição", "mon": [["2-metilpropenoato de metila", "C=C(C)C(=O)OC"]], "un": "–CH₂–C(CH₃)(COOCH₃)–", "fu": "C5H8O2", "mu": 100, "aguas": 0, "fun": "éster (no ramo)", "d": 1.18, "pf": null, "cod": null},
      {"k": "borracha_natural", "nome": "borracha natural (poli-isopreno)", "sig": "NR", "tipo": "adição", "mon": [["2-metilbuta-1,3-dieno (isopreno)", "C=CC(C)=C"]], "un": "–CH₂–C(CH₃)=CH–CH₂–", "fu": "C5H8", "mu": 68, "aguas": 0, "fun": "dupla C=C", "d": null, "pf": null, "cod": null},
      {"k": "neopreno", "nome": "neopreno (policloropreno)", "sig": "CR", "tipo": "adição", "mon": [["2-clorobuta-1,3-dieno (cloropreno)", "C=CC(Cl)=C"]], "un": "–CH₂–CCl=CH–CH₂–", "fu": "C4H5Cl", "mu": 88.5, "aguas": 0, "fun": "dupla C=C e haleto", "d": 1.23, "pf": null, "cod": null},
      {"k": "PET", "nome": "poli(tereftalato de etileno)", "sig": "PET", "tipo": "condensação", "mon": [["ácido benzeno-1,4-dicarboxílico (tereftálico)", "OC(=O)c1ccc(cc1)C(=O)O"], ["etano-1,2-diol (etilenoglicol)", "OCCO"]], "un": "–O–CH₂–CH₂–O–CO–C₆H₄–CO–", "fu": "C10H8O4", "mu": 192, "aguas": 2, "fun": "éster", "d": 1.38, "pf": 250, "cod": 1},
      {"k": "nylon_66", "nome": "náilon 6,6", "sig": "PA 66", "tipo": "condensação", "mon": [["ácido hexanodioico (adípico)", "OC(=O)CCCCC(=O)O"], ["hexano-1,6-diamina", "NCCCCCCN"]], "un": "–NH–(CH₂)₆–NH–CO–(CH₂)₄–CO–", "fu": "C12H22N2O2", "mu": 226, "aguas": 2, "fun": "amida", "d": 1.14, "pf": 264, "cod": null},
      {"k": "kevlar", "nome": "kevlar", "sig": "aramida", "tipo": "condensação", "mon": [["ácido benzeno-1,4-dicarboxílico (tereftálico)", "OC(=O)c1ccc(cc1)C(=O)O"], ["benzeno-1,4-diamina", "Nc1ccc(N)cc1"]], "un": "–CO–C₆H₄–CO–NH–C₆H₄–NH–", "fu": "C14H10N2O2", "mu": 238, "aguas": 2, "fun": "amida", "d": null, "pf": null, "cod": null},
      {"k": "PLA", "nome": "poli(ácido láctico)", "sig": "PLA", "tipo": "condensação", "mon": [["ácido 2-hidroxipropanoico (láctico)", "CC(O)C(=O)O"]], "un": "–O–CH(CH₃)–CO–", "fu": "C3H4O2", "mu": 72, "aguas": 1, "fun": "éster", "d": [1.21, 1.43], "pf": [150, 160], "cod": null},
    ],
    COD: {"1": "PET", "2": "PEAD (polietileno de alta densidade)", "3": "PVC", "4": "PEBD (polietileno de baixa densidade)", "5": "PP", "6": "PS", "7": "outros"},
    CARB: [
      {"k": "glicose", "nome": "glicose", "cls": "monossacarídeo", "ac": "aldose", "smi": "OCC(O)C(O)C(O)C(O)C=O", "f": "C6H12O6", "comp": null, "lig": null, "red": true},
      {"k": "frutose", "nome": "frutose", "cls": "monossacarídeo", "ac": "cetose", "smi": "OCC(O)C(O)C(O)C(=O)CO", "f": "C6H12O6", "comp": null, "lig": null, "red": true},
      {"k": "galactose", "nome": "galactose", "cls": "monossacarídeo", "ac": "aldose", "smi": "OCC(O)C(O)C(O)C(O)C=O", "f": "C6H12O6", "comp": null, "lig": null, "red": null},
      {"k": "ribose", "nome": "ribose", "cls": "monossacarídeo", "ac": "aldose", "smi": "OCC(O)C(O)C(O)C=O", "f": "C5H10O5", "comp": null, "lig": null, "red": null},
      {"k": "desoxirribose", "nome": "desoxirribose", "cls": "monossacarídeo", "ac": "aldose", "smi": "OCC(O)C(O)CC=O", "f": "C5H10O4", "comp": null, "lig": null, "red": null},
      {"k": "sacarose", "nome": "sacarose", "cls": "dissacarídeo", "ac": null, "smi": null, "f": "C12H22O11", "comp": "glicose + frutose", "lig": "α-1,β-2", "red": false},
      {"k": "lactose", "nome": "lactose", "cls": "dissacarídeo", "ac": null, "smi": null, "f": "C12H22O11", "comp": "galactose + glicose", "lig": "β-1,4", "red": true},
      {"k": "maltose", "nome": "maltose", "cls": "dissacarídeo", "ac": null, "smi": null, "f": "C12H22O11", "comp": "glicose + glicose", "lig": "α-1,4", "red": true},
      {"k": "celulose", "nome": "celulose", "cls": "polissacarídeo", "ac": null, "smi": null, "f": "(C6H10O5)n", "comp": "glicose", "lig": "β-1,4", "red": null},
      {"k": "amilose", "nome": "amilose (amido)", "cls": "polissacarídeo", "ac": null, "smi": null, "f": "(C6H10O5)n", "comp": "glicose", "lig": "α-1,4", "red": null},
      {"k": "amilopectina", "nome": "amilopectina (amido)", "cls": "polissacarídeo", "ac": null, "smi": null, "f": "(C6H10O5)n", "comp": "glicose", "lig": "α-1,4 com ramos α-1,6", "red": null},
      {"k": "glicogenio", "nome": "glicogênio", "cls": "polissacarídeo", "ac": null, "smi": null, "f": "(C6H10O5)n", "comp": "glicose", "lig": "α-1,4 com ramos α-1,6", "red": null},
    ],
    ENERGIA: {"carboidrato": [17, 4], "proteina": [17, 4], "gordura": [37, 9], "etanol": [29, 7]},
    AG: [
      {"k": "laurico", "nome": "ácido láurico", "cd": "12:0", "c": 12, "d": 0, "f": "C12H24O2", "m": 200, "mfonte": 200.322, "pf": 43.8, "est": "CH3(CH2)10COOH", "smi": "CCCCCCCCCCCC(=O)O"},
      {"k": "miristico", "nome": "ácido mirístico", "cd": "14:0", "c": 14, "d": 0, "f": "C14H28O2", "m": 228, "mfonte": 228.376, "pf": 54.4, "est": "CH3(CH2)12COOH", "smi": "CCCCCCCCCCCCCC(=O)O"},
      {"k": "palmitico", "nome": "ácido palmítico", "cd": "16:0", "c": 16, "d": 0, "f": "C16H32O2", "m": 256, "mfonte": 256.43, "pf": 62.9, "est": "CH3(CH2)14COOH", "smi": "CCCCCCCCCCCCCCCC(=O)O"},
      {"k": "estearico", "nome": "ácido esteárico", "cd": "18:0", "c": 18, "d": 0, "f": "C18H36O2", "m": 284, "mfonte": 284.484, "pf": 69.3, "est": "CH3(CH2)16COOH", "smi": "CCCCCCCCCCCCCCCCCC(=O)O"},
      {"k": "oleico", "nome": "ácido oleico", "cd": "18:1", "c": 18, "d": 1, "f": "C18H34O2", "m": 282, "mfonte": 282.468, "pf": [13, 14], "est": "CH3(CH2)7CH=CH(CH2)7COOH", "smi": "CCCCCCCCC=CCCCCCCCC(=O)O"},
      {"k": "linoleico", "nome": "ácido linoleico", "cd": "18:2", "c": 18, "d": 2, "f": "C18H32O2", "m": 280, "mfonte": 280.452, "pf": -12, "est": "CH3(CH2)4CH=CHCH2CH=CH(CH2)7COOH", "smi": "CCCCCC=CCC=CCCCCCCCC(=O)O"},
      {"k": "alfa_linolenico", "nome": "ácido α-linolênico", "cd": "18:3", "c": 18, "d": 3, "f": "C18H30O2", "m": 278, "mfonte": 278.436, "pf": -11, "est": "CH3CH2CH=CHCH2CH=CHCH2CH=CH(CH2)7COOH", "smi": "CCC=CCC=CCC=CCCCCCCCC(=O)O"},
      {"k": "araquidonico", "nome": "ácido araquidônico", "cd": "20:4", "c": 20, "d": 4, "f": "C20H32O2", "m": 304, "mfonte": 304.474, "pf": -49, "est": "CH3(CH2)4CH=CHCH2CH=CHCH2CH=CHCH2CH=CH(CH2)3COOH", "smi": "CCCCCC=CCC=CCC=CCC=CCCCC(=O)O"},
    ],
    AA: [
      {"k": "glicina", "nome": "glicina", "a3": "Gly", "a1": "G", "f": "C2H5NO2", "m": 75, "mfonte": 75.067, "pk1": 2.34, "pk2": 9.6, "pkr": null, "tr": null, "pi": 5.97, "pic": 5.97, "div": false, "piw": 6.06, "cls": "neutro", "ess": "condicional", "smi": "NCC(=O)O"},
      {"k": "alanina", "nome": "alanina", "a3": "Ala", "a1": "A", "f": "C3H7NO2", "m": 89, "mfonte": 89.094, "pk1": 2.34, "pk2": 9.69, "pkr": null, "tr": null, "pi": 6.01, "pic": 6.01, "div": false, "piw": 6.01, "cls": "neutro", "ess": "não", "smi": "CC(N)C(=O)O"},
      {"k": "valina", "nome": "valina", "a3": "Val", "a1": "V", "f": "C5H11NO2", "m": 117, "mfonte": 117.148, "pk1": 2.32, "pk2": 9.62, "pkr": null, "tr": null, "pi": 5.96, "pic": 5.97, "div": false, "piw": 6.0, "cls": "neutro", "ess": "sim", "smi": "CC(C)C(N)C(=O)O"},
      {"k": "leucina", "nome": "leucina", "a3": "Leu", "a1": "L", "f": "C6H13NO2", "m": 131, "mfonte": 131.175, "pk1": 2.36, "pk2": 9.6, "pkr": null, "tr": null, "pi": 5.98, "pic": 5.98, "div": false, "piw": 6.01, "cls": "neutro", "ess": "sim", "smi": "CC(C)CC(N)C(=O)O"},
      {"k": "isoleucina", "nome": "isoleucina", "a3": "Ile", "a1": "I", "f": "C6H13NO2", "m": 131, "mfonte": 131.175, "pk1": 2.36, "pk2": 9.6, "pkr": null, "tr": null, "pi": 6.02, "pic": 5.98, "div": true, "piw": 6.05, "cls": "neutro", "ess": "sim", "smi": "CCC(C)C(N)C(=O)O"},
      {"k": "prolina", "nome": "prolina", "a3": "Pro", "a1": "P", "f": "C5H9NO2", "m": 115, "mfonte": 115.132, "pk1": 1.99, "pk2": 10.6, "pkr": null, "tr": null, "pi": 6.3, "pic": 6.29, "div": false, "piw": 6.3, "cls": "neutro", "ess": "não", "smi": "OC(=O)C1CCCN1"},
      {"k": "fenilalanina", "nome": "fenilalanina", "a3": "Phe", "a1": "F", "f": "C9H11NO2", "m": 165, "mfonte": 165.192, "pk1": 1.83, "pk2": 9.13, "pkr": null, "tr": null, "pi": 5.48, "pic": 5.48, "div": false, "piw": 5.49, "cls": "neutro", "ess": "sim", "smi": "NC(Cc1ccccc1)C(=O)O"},
      {"k": "triptofano", "nome": "triptofano", "a3": "Trp", "a1": "W", "f": "C11H12N2O2", "m": 204, "mfonte": 204.229, "pk1": 2.83, "pk2": 9.39, "pkr": null, "tr": null, "pi": 5.89, "pic": 6.11, "div": true, "piw": 5.89, "cls": "neutro", "ess": "sim", "smi": "NC(Cc1c[nH]c2ccccc12)C(=O)O"},
      {"k": "metionina", "nome": "metionina", "a3": "Met", "a1": "M", "f": "C5H11NO2S", "m": 149, "mfonte": 149.21, "pk1": 2.28, "pk2": 9.21, "pkr": null, "tr": null, "pi": 5.74, "pic": 5.74, "div": false, "piw": 5.74, "cls": "neutro", "ess": "sim", "smi": "CSCCC(N)C(=O)O"},
      {"k": "serina", "nome": "serina", "a3": "Ser", "a1": "S", "f": "C3H7NO3", "m": 105, "mfonte": 105.093, "pk1": 2.21, "pk2": 9.15, "pkr": null, "tr": null, "pi": 5.68, "pic": 5.68, "div": false, "piw": 5.68, "cls": "neutro", "ess": "não", "smi": "NC(CO)C(=O)O"},
      {"k": "treonina", "nome": "treonina", "a3": "Thr", "a1": "T", "f": "C4H9NO3", "m": 119, "mfonte": 119.12, "pk1": 2.09, "pk2": 9.1, "pkr": null, "tr": null, "pi": 5.6, "pic": 5.59, "div": false, "piw": 5.6, "cls": "neutro", "ess": "sim", "smi": "CC(O)C(N)C(=O)O"},
      {"k": "cisteina", "nome": "cisteína", "a3": "Cys", "a1": "C", "f": "C3H7NO2S", "m": 121, "mfonte": 121.15, "pk1": 1.96, "pk2": 10.28, "pkr": 8.18, "tr": "acida", "pi": 5.07, "pic": 5.07, "div": false, "piw": 5.05, "cls": "neutro", "ess": "condicional", "smi": "NC(CS)C(=O)O"},
      {"k": "tirosina", "nome": "tirosina", "a3": "Tyr", "a1": "Y", "f": "C9H11NO3", "m": 181, "mfonte": 181.191, "pk1": 2.2, "pk2": 9.11, "pkr": 10.07, "tr": "acida", "pi": 5.66, "pic": 5.63, "div": false, "piw": 5.64, "cls": "neutro", "ess": "condicional", "smi": "NC(Cc1ccc(O)cc1)C(=O)O"},
      {"k": "asparagina", "nome": "asparagina", "a3": "Asn", "a1": "N", "f": "C4H8N2O3", "m": 132, "mfonte": 132.119, "pk1": 2.02, "pk2": 8.8, "pkr": null, "tr": null, "pi": 5.41, "pic": 5.41, "div": false, "piw": 5.41, "cls": "neutro", "ess": "não", "smi": "NC(CC(N)=O)C(=O)O"},
      {"k": "glutamina", "nome": "glutamina", "a3": "Gln", "a1": "Q", "f": "C5H10N2O3", "m": 146, "mfonte": 146.146, "pk1": 2.17, "pk2": 9.13, "pkr": null, "tr": null, "pi": 5.65, "pic": 5.65, "div": false, "piw": 5.65, "cls": "neutro", "ess": "não", "smi": "NC(CCC(N)=O)C(=O)O"},
      {"k": "acido_aspartico", "nome": "ácido aspártico", "a3": "Asp", "a1": "D", "f": "C4H7NO4", "m": 133, "mfonte": 133.103, "pk1": 1.88, "pk2": 9.6, "pkr": 3.65, "tr": "acida", "pi": 2.77, "pic": 2.76, "div": false, "piw": 2.85, "cls": "ácido", "ess": "não", "smi": "NC(CC(=O)O)C(=O)O"},
      {"k": "acido_glutamico", "nome": "ácido glutâmico", "a3": "Glu", "a1": "E", "f": "C5H9NO4", "m": 147, "mfonte": 147.13, "pk1": 2.19, "pk2": 9.67, "pkr": 4.25, "tr": "acida", "pi": 3.22, "pic": 3.22, "div": false, "piw": 3.15, "cls": "ácido", "ess": "condicional", "smi": "NC(CCC(=O)O)C(=O)O"},
      {"k": "lisina", "nome": "lisina", "a3": "Lys", "a1": "K", "f": "C6H14N2O2", "m": 146, "mfonte": 146.19, "pk1": 2.18, "pk2": 8.95, "pkr": 10.53, "tr": "basica", "pi": 9.74, "pic": 9.74, "div": false, "piw": 9.6, "cls": "básico", "ess": "sim", "smi": "NCCCCC(N)C(=O)O"},
      {"k": "arginina", "nome": "arginina", "a3": "Arg", "a1": "R", "f": "C6H14N4O2", "m": 174, "mfonte": 174.204, "pk1": 2.17, "pk2": 9.04, "pkr": 12.48, "tr": "basica", "pi": 10.76, "pic": 10.76, "div": false, "piw": 10.76, "cls": "básico", "ess": "condicional", "smi": "NC(CCCNC(N)=N)C(=O)O"},
      {"k": "histidina", "nome": "histidina", "a3": "His", "a1": "H", "f": "C6H9N3O2", "m": 155, "mfonte": 155.157, "pk1": 1.82, "pk2": 9.17, "pkr": 6.0, "tr": "basica", "pi": 7.59, "pic": 7.59, "div": false, "piw": 7.6, "cls": "básico", "ess": "sim", "smi": "NC(Cc1c[nH]cn1)C(=O)O"},
    ],
    DNA: {"hAT": 2, "hGC": 3, "largura": 20, "paresVolta": 10, "passo": 34, "codons": 64, "sentido": 61, "parada": 3, "atpDG": 30.5, "atpF": "C10H16N5O13P3", "atpM": 507.18},
    BASES: [
      {"nome": "adenina", "l": "A", "f": "C5H5N5", "m": 135, "mfonte": 135.13, "tipo": "purina", "onde": "DNA e RNA", "smi": "Nc1ncnc2[nH]cnc12"},
      {"nome": "guanina", "l": "G", "f": "C5H5N5O", "m": 151, "mfonte": 151.13, "tipo": "purina", "onde": "DNA e RNA", "smi": "Nc1nc2[nH]cnc2c(=O)[nH]1"},
      {"nome": "citosina", "l": "C", "f": "C4H5N3O", "m": 111, "mfonte": 111.1, "tipo": "pirimidina", "onde": "DNA e RNA", "smi": "Nc1cc[nH]c(=O)n1"},
      {"nome": "timina", "l": "T", "f": "C5H6N2O2", "m": 126, "mfonte": 126.115, "tipo": "pirimidina", "onde": "só DNA", "smi": "Cc1c[nH]c(=O)[nH]c1=O"},
      {"nome": "uracila", "l": "U", "f": "C4H4N2O2", "m": 112, "mfonte": 112.08676, "tipo": "pirimidina", "onde": "só RNA", "smi": "O=c1cc[nH]c(=O)[nH]1"},
    ],
    COMB: [
      {"k": "etanol", "nome": "etanol", "f": "C2H6O", "m": 46, "mfonte": 46.069, "dh": 1366.8, "c": 2, "h": 6, "o": 1, "d": 0.78945, "ron": 108.6, "bio": true},
      {"k": "metanol", "nome": "metanol", "f": "CH4O", "m": 32, "mfonte": 32.042, "dh": 726.1, "c": 1, "h": 4, "o": 1, "d": 0.792, "ron": 108.7, "bio": false},
      {"k": "metano", "nome": "metano", "f": "CH4", "m": 16, "mfonte": 16.043, "dh": 890.8, "c": 1, "h": 4, "o": 0, "d": null, "ron": 120, "bio": true},
      {"k": "hidrogenio", "nome": "hidrogênio", "f": "H2", "m": 2, "mfonte": 2.016, "dh": 285.8, "c": 0, "h": 2, "o": 0, "d": null, "ron": null, "bio": false},
      {"k": "isooctano", "nome": "isooctano (2,2,4-trimetilpentano)", "f": "C8H18", "m": 114, "mfonte": 114.232, "dh": 5465.5, "c": 8, "h": 18, "o": 0, "d": 0.692, "ron": 100, "bio": false},
    ],
    BIOGAS: {"ch4": [50, 80], "co2": [15, 50]},
    AMB: {"ar": {"N2": 78.084, "O2": 20.946, "Ar": 0.934}, "co2": 432.0, "co2ano": 2026, "co2pre": 280.0, "co2aumento": 54.0, "haberDH": 92.2, "haberMPa": 20.0, "haberT": 500.0, "chuva": 5.6, "chuvaAcida": 5.0, "gwp": {"CO2": 1, "CH4": [27, 30], "N2O": 273, "CFC-12": 10200, "SF6": 23500}, "coAfin": 200.0, "o2sol20": 7.6, "o2sol0": 14.6, "montreal": 1987, "ozonioKm": [15.0, 35.0], "dboRio": 1.0},
  };
  /*BIO-FIM*/

  /* ---------- I01: polímeros ---------- */
  /* nome: "Polímeros: do monômero à cadeia" · matéria: Química · tema: I01 */
  SIM.qPolimero = (el, F) => { const P = SIM.BIO.POL, O = SIM.org; let i = 0, n = 1000, ver = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px;min-height:230px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${seletor("monômero(s) de", P.map((p) => p.sig + " · " + p.mon.map((m) => m[0]).join(" + ")))}</div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">unidades na cadeia (n)</p><div class="bts">${botoes([[10, "10"], [100, "100"], [1000, "1 000"], [10000, "10 000"]], "n", n)}</div></div>
      <div><div class="bts"><button class="bt peq" data-v="ver" aria-pressed="false">mostrar o polímero</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const p = P[i]; return { k: p.k, tipo: p.tipo, mu: p.mu, n, massa: n * p.mu, aguas: p.aguas * n, fu: p.fu, d: p.d, cod: p.cod, ver }; };
    const desenha = () => { const p = P[i], e = est(), boia = p.d === null ? null : (Array.isArray(p.d) ? p.d[1] : p.d) < 1 ? "boia" : (Array.isArray(p.d) ? p.d[0] : p.d) > 1 ? "afunda" : "depende do tipo";
      q("[data-v=sv]").innerHTML = O.fig(p.mon.map((m) => ({ smi: m[1], leg: m[0] })), { L: 38, W: 720 }) + (ver ? `<div style="font:700 22px Inter,system-ui,sans-serif;letter-spacing:.5px;margin-top:4px"><span style="color:var(--ink2)">[</span> ${p.un} <span style="color:var(--ink2)">]</span><sub style="font-size:14px">n</sub></div><div style="font-size:12.5px;color:var(--ink2)">${p.nome} · unidade repetitiva ${p.fu.replace(/(\d+)/g, "<sub>$1</sub>")}</div>` : `<div style="font:700 26px Inter,system-ui,sans-serif;color:var(--warn)">?</div>`);
      q("[data-v=lt]").innerHTML = vis("polimerização por", ver ? p.tipo : "?") + vis("massa da unidade", ver ? nt(p.mu, 1) + " g/mol" : "?") + vis("massa molar da cadeia", ver ? nt(e.massa, 0) + " g/mol" : "?") + vis("água liberada", ver ? (p.aguas ? nt(e.aguas, 0) + " moléculas" : "nenhuma") : "?") + vis("densidade (fonte)", faixa(p.d, "g/cm³")) + vis("código de reciclagem", p.cod ? String(p.cod) : p.k === "polietileno" ? "2 (alta) ou 4 (baixa)" : "7 ou sem código");
      q("[data-v=st]").innerHTML = !ver ? "Antes de clicar em <b>mostrar</b>: o monômero tem dupla C=C (adição) ou dois grupos funcionais que reagem entre si (condensação)? Como fica a unidade que se repete?" :
        (p.tipo === "adição" ? `<b>Adição</b>: a ligação π de cada monômero se abre e os monômeros se ligam em fila. Nada sobra: a unidade repetitiva tem a mesma fórmula do monômero (${p.fu.replace(/(\d+)/g, "<sub>$1</sub>")}).` : `<b>Condensação</b>: os grupos funcionais reagem dois a dois e cada ligação nova libera uma molécula de água (${p.aguas} por unidade repetitiva). A cadeia fica com a função <b>${p.fun}</b>.`) + ` Com n = ${nt(n, 0)}, a cadeia pesa cerca de ${nt(e.massa, 0)} g/mol.` + (boia ? ` Na água (1,00 g/cm³), ${boia}.` : "") + " Densidade: dado de tabela (varia com o tipo do material)."; };
    q("[data-v=sel]").addEventListener("change", (ev) => { i = +ev.target.value; ver = false; q("[data-v=ver]").setAttribute("aria-pressed", "false"); desenha(); });
    q("[data-v=ver]").addEventListener("click", () => { ver = !ver; q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); });
    liga(el, "n", (v) => { n = +v; desenha(); });
    SIM.qPolimero._ult = { poe: (k, nn = 1000, v = true) => { i = P.findIndex((p) => p.k === k); n = nn; ver = v; q("[data-v=sel]").value = String(i); q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); el.querySelectorAll("[data-n]").forEach((x) => x.setAttribute("aria-pressed", String(+x.dataset.n === n))); desenha(); }, est }; desenha(); };

  /* ---------- I02: carboidratos e lipídeos ---------- */
  /* contas de um triglicerídeo feito de três ácidos graxos (índices na tabela AG): glicerol (92) + 3 ácidos − 3 águas */
  SIM.triglicerideo = (ks) => { const A = ks.map((k) => SIM.BIO.AG.find((a) => a.k === k)), c = 3 + A.reduce((t, a) => t + a.c, 0), d = A.reduce((t, a) => t + a.d, 0), h = 8 + A.reduce((t, a) => t + 2 * a.c - 2 * a.d, 0) - 6, m = 92 + A.reduce((t, a) => t + a.m, 0) - 54;
    return { A, c, h, o: 6, d, m, f: `C${c}H${h}O6`, iodo: (100 * d * 254) / m, naoh: (100 / m) * 3 * 40, h2: d }; };
  /* cadeia de n unidades de glicose: n C6H12O6 − (n − 1) H2O */
  SIM.poliglicose = (n) => ({ n, c: 6 * n, h: 12 * n - 2 * (n - 1), o: 6 * n - (n - 1), m: 180 * n - 18 * (n - 1), aguas: n - 1 });
  /* nome: "Açúcares e gorduras: montar e fazer a conta" · matéria: Química · tema: I02 */
  SIM.qBiomol = (el, F) => { const AG = SIM.BIO.AG, O = SIM.org; let modo = "gordura", ks = ["estearico", "estearico", "estearico"], n = 2;
    const sel = (j) => `<select data-s="${j}" style="font:inherit;padding:4px 6px;border-radius:8px;background:var(--card,#161b24);color:inherit;border:1px solid var(--line,#2a3140)">${AG.map((a) => `<option value="${a.k}">${a.nome.replace("ácido ", "")} (${a.cd})</option>`).join("")}</select>`;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px;min-height:200px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes([["gordura", "triglicerídeo"], ["acucar", "cadeia de glicose"]], "modo", modo)}</div></div>
      <div data-v="cg"><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">os três ácidos graxos</p>${sel(0)} ${sel(1)} ${sel(2)}</div>
      <div data-v="ca" hidden><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">unidades de glicose</p><div class="bts">${botoes([[1, "1"], [2, "2"], [3, "3"], [10, "10"], [100, "100"], [1000, "1 000"]], "n", n)}</div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), sb = (f) => f.replace(/(\d+)/g, "<sub>$1</sub>");
    const est = () => (modo === "gordura" ? { modo, ...SIM.triglicerideo(ks), A: undefined, ks: [...ks] } : { modo, ...SIM.poliglicose(n) });
    const desenha = () => { q("[data-v=cg]").hidden = modo !== "gordura"; q("[data-v=ca]").hidden = modo === "gordura";
      if (modo === "gordura") { const t = SIM.triglicerideo(ks), pf = t.A.map((a) => (Array.isArray(a.pf) ? a.pf[0] : a.pf));
        q("[data-v=sv]").innerHTML = `<div style="display:grid;grid-template-columns:auto auto;gap:4px 14px;align-items:center;font:600 14px Inter,system-ui,sans-serif">${t.A.map((a, j) => `<div style="text-align:right">${a.est.replace("COOH", "").replace(/(\d+)/g, "<sub>$1</sub>")}</div><div style="color:var(--ink2)">${["–CO–O–CH₂", "–CO–O–CH", "–CO–O–CH₂"][j]} <span style="font-weight:400">&nbsp; ${a.nome.replace("ácido ", "")}, ${a.cd}</span></div>`).join("")}</div><div style="font-size:12.5px;color:var(--ink2);margin-top:6px">três cadeias de ácido graxo (à esquerda) presas por ligações éster aos três carbonos do glicerol (à direita, na vertical)</div>`;
        q("[data-v=lt]").innerHTML = vis("fórmula", sb(t.f)) + vis("massa molar", nt(t.m, 0) + " g/mol") + vis("duplas C=C", String(t.d)) + vis("H₂ para saturar 1 mol", t.d + " mol") + vis("índice de iodo", nt(t.iodo, 1)) + vis("NaOH para 100 g", nt(t.naoh, 1) + " g");
        q("[data-v=st]").innerHTML = `Glicerol (92) + três ácidos − três águas (54): <b>${nt(t.m, 0)} g/mol</b>. ${t.d ? `As ${t.d} duplas consomem ${t.d} mol de H₂ (ou de I₂) por mol: daí o índice de iodo, gramas de I₂ por 100 g.` : "Sem duplas: gordura saturada, índice de iodo zero."} Pontos de fusão dos ácidos (fonte): ${t.A.map((a, j) => nt(pf[j], 1) + " °C").join("; ")}. Quanto mais duplas, mais baixo. Massas com H = 1, C = 12, O = 16, I = 127, Na = 23.`; }
      else { const g = SIM.poliglicose(n), f = `C${g.c}H${g.h}O${g.o}`;
        q("[data-v=sv]").innerHTML = O.fig([{ smi: "OCC(O)C(O)C(O)C(O)C=O", leg: "glicose (cadeia aberta), C₆H₁₂O₆" }], { L: 36, W: 700 }) + `<div style="font:700 20px Inter,system-ui,sans-serif">${n === 1 ? "1 glicose" : n + " glicoses − " + (n - 1) + " H₂O"}</div>`;
        q("[data-v=lt]").innerHTML = vis("unidades", String(n)) + vis("fórmula", sb(f)) + vis("massa molar", nt(g.m, 0) + " g/mol") + vis("ligações glicosídicas", String(g.aguas)) + vis("água liberada", g.aguas + " moléculas") + vis("classe", n === 1 ? "monossacarídeo" : n === 2 ? "dissacarídeo" : n < 10 ? "oligossacarídeo" : "polissacarídeo");
        q("[data-v=st]").innerHTML = `Cada ligação glicosídica une duas unidades e libera uma água: n glicoses dão <b>n − 1</b> águas. ${n === 2 ? "Com duas, a fórmula é C₁₂H₂₂O₁₁: a da maltose, da sacarose e da lactose." : n >= 100 ? "Para n grande, a fórmula tende a (C₆H₁₀O₅)ₙ, a do amido e da celulose (162 g/mol por unidade)." : ""} A hidrólise faz o caminho de volta: consome uma água por ligação. Massas com H = 1, C = 12, O = 16.`; } };
    liga(el, "modo", (v) => { modo = v; desenha(); }); liga(el, "n", (v) => { n = +v; desenha(); });
    el.querySelectorAll("[data-s]").forEach((s) => s.addEventListener("change", () => { ks[+s.dataset.s] = s.value; desenha(); }));
    SIM.qBiomol._ult = { poe: (m, x) => { modo = m; if (m === "gordura") { ks = x; el.querySelectorAll("[data-s]").forEach((s, j) => (s.value = ks[j])); } else n = x; el.querySelectorAll("[data-modo]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.modo === modo))); el.querySelectorAll("[data-n]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.n === n))); desenha(); }, est }; desenha(); };

  /* ---------- I03: aminoácidos e proteínas ---------- */
  /* estado de ionização de um aminoácido num pH (Henderson-Hasselbalch em cada grupo, tratados como independentes) */
  SIM.aaCarga = (a, ph) => { const fc = 1 / (1 + Math.pow(10, a.pk1 - ph)), fn = 1 / (1 + Math.pow(10, ph - a.pk2)), fr = a.tr === "acida" ? 1 / (1 + Math.pow(10, a.pkr - ph)) : a.tr === "basica" ? 1 / (1 + Math.pow(10, ph - a.pkr)) : null;
    return { fc, fn, fr, q: -fc + fn + (a.tr === "acida" ? -fr : a.tr === "basica" ? fr : 0) }; };
  /* pI pela regra: média dos dois pKa que cercam a forma de carga zero */
  SIM.aaPI = (a) => (a.tr === "basica" ? (a.pk2 + a.pkr) / 2 : a.tr === "acida" ? (a.pk1 + Math.min(a.pkr, a.pk2)) / 2 : (a.pk1 + a.pk2) / 2);
  /* nome: "Aminoácido e pH: cargas e ponto isoelétrico" · matéria: Química · tema: I03 */
  SIM.qAminoacido = (el, F) => { /* decisão do Lucas (16/11/2026): o que o desenhista não mostra direito não entra no seletor (triptofano: dois anéis fundidos) */
    const AA = SIM.BIO.AA.filter((a) => !/2/.test(a.smi.replace(/\[[^\]]*\]/g, ""))), O = SIM.org; let i = 1, ph = 7;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px;min-height:250px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${seletor("aminoácido", AA.map((a) => `${a.nome} (${a.a3})`))}</div>
      <div style="min-width:300px"><label style="font-size:13.5px;color:var(--ink2)">pH da solução: <b data-v="ph"></b><br><input type="range" data-v="rg" min="0" max="14" step="0.1" value="7" style="width:100%"></label></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), pc = (x) => nt(100 * x, 1) + "%";
    const est = () => { const a = AA[i], c = SIM.aaCarga(a, ph); return { k: a.k, ph, ...c, pi: SIM.aaPI(a), pitab: a.pi, div: a.div }; };
    const barra = (rot, fr, sinal, pk) => { const cor = sinal > 0 ? "#5b8dee" : "#e5604d"; return `<div style="display:grid;grid-template-columns:230px 260px 150px;gap:10px;align-items:center;font-size:13.5px"><div style="text-align:right">${rot} <span style="color:var(--ink2)">(pKa ${nt(pk, 2)})</span></div><div style="height:14px;border-radius:7px;background:var(--line,#2a3140);overflow:hidden"><div style="width:${(100 * fr).toFixed(1)}%;height:100%;background:${cor}"></div></div><div style="color:var(--ink2)">${pc(fr)} com carga ${sinal > 0 ? "+" : "−"}</div></div>`; };
    const desenha = () => { const a = AA[i], e = est(); let d = ""; const doisAneis = /2/.test(a.smi.replace(/\[[^\]]*\]/g, "")); if (doisAneis) d = `<div style="font-size:13px;color:var(--ink2);padding:18px 0">estrutura com dois anéis fundidos: o desenhista do site não a representa corretamente, por isso não é mostrada (fórmula ${a.f.replace(/(\d+)/g, "<sub>$1</sub>")})</div>`; else try { const s = O.svg(a.smi, { L: 36 }); d = `<svg viewBox="0 0 ${s.w.toFixed(0)} ${s.h.toFixed(0)}" height="${Math.min(150, s.h).toFixed(0)}" role="img" aria-label="estrutura do aminoácido">${s.svg}</svg>`; } catch (x) { d = ""; }
      q("[data-v=ph]").textContent = nt(ph, 1);
      q("[data-v=sv]").innerHTML = d + `<div style="font-size:12.5px;color:var(--ink2)">${a.nome} (${a.a3}, ${a.a1}) · forma neutra, como se escreve no papel</div><div style="display:flex;flex-direction:column;gap:6px;margin-top:8px">${barra("–COOH → –COO⁻", e.fc, -1, a.pk1)}${barra("–NH₂ → –NH₃⁺", e.fn, 1, a.pk2)}${a.tr ? barra(a.tr === "acida" ? "cadeia lateral → ânion" : "cadeia lateral → cátion", e.fr, a.tr === "acida" ? -1 : 1, a.pkr) : ""}</div>`;
      q("[data-v=lt]").innerHTML = vis("carga líquida média", (e.q > 0 ? "+" : e.q < -0.005 ? "−" : "") + nt(Math.abs(e.q), 2)) + vis("pI pelos pKa", nt(Math.round((e.pi + 1e-9) * 100) / 100, 2)) + vis("pI da tabela", nt(a.pi, 2)) + vis("na eletroforese", Math.abs(ph - e.pi) < 0.15 ? "não migra" : ph < e.pi ? "vai para o polo negativo" : "vai para o polo positivo") + vis("cadeia lateral", a.cls === "neutro" ? "neutra" : a.cls === "ácido" ? "ácida" : "básica") + vis("essencial", a.ess);
      q("[data-v=st]").innerHTML = (ph < e.pi - 0.15 ? `pH <b>abaixo</b> do pI: sobram prótons, o aminoácido fica com carga líquida <b>positiva</b> (cátion).` : ph > e.pi + 0.15 ? `pH <b>acima</b> do pI: faltam prótons, carga líquida <b>negativa</b> (ânion).` : `pH praticamente igual ao pI: as cargas + e − se cancelam (íon dipolar, ou zwitterion) e a molécula não migra no campo elétrico.`) + ` Em cada grupo vale Henderson-Hasselbalch: com pH = pKa, metade está em cada forma. pKa e pI: Tabela 26.1 do OpenStax Organic Chemistry.` + (a.div ? ` <b>Nesta linha a tabela é inconsistente</b>: o pI impresso (${nt(a.pi, 2)}) não é a média dos pKa impressos (${nt(e.pi, 2)}).` : "") + ` A Wikipedia dá pI ${nt(a.piw, 2)}.`; };
    q("[data-v=sel]").value = String(i); q("[data-v=sel]").addEventListener("change", (ev) => { i = +ev.target.value; desenha(); });
    q("[data-v=rg]").addEventListener("input", (ev) => { ph = +ev.target.value; desenha(); });
    SIM.qAminoacido._ult = { poe: (k, p) => { i = AA.findIndex((a) => a.k === k); ph = p; q("[data-v=sel]").value = String(i); q("[data-v=rg]").value = String(p); desenha(); }, est }; desenha(); };

  /* ---------- I04: ácidos nucleicos ---------- */
  /* contas com uma fita de DNA escrita de 5' para 3' */
  SIM.dna = { par: { A: "T", T: "A", G: "C", C: "G" },
    comp: (s) => s.split("").map((b) => SIM.dna.par[b]).join(""),                       /* fita complementar, alinhada base a base (lida de 3' para 5') */
    compInv: (s) => SIM.dna.comp(s).split("").reverse().join(""),                        /* a mesma fita, escrita de 5' para 3' */
    rna: (molde) => SIM.dna.comp(molde).replace(/T/g, "U"),                              /* RNA transcrito a partir da fita molde (alinhado base a base) */
    hb: (s) => s.split("").reduce((t, b) => t + (b === "A" || b === "T" ? SIM.BIO.DNA.hAT : SIM.BIO.DNA.hGC), 0),
    gc: (s) => (100 * s.split("").filter((b) => b === "G" || b === "C").length) / s.length,
    compr: (n) => (n * SIM.BIO.DNA.passo) / SIM.BIO.DNA.paresVolta,                      /* comprimento em Å */
    voltas: (n) => n / SIM.BIO.DNA.paresVolta,
    escada: (s, o = {}) => { const n = s.length, dx = o.dx || 34, x0 = 54, W = x0 * 2 + dx * (n - 1), c = SIM.dna.comp(s), COR = { A: "#e0a13a", T: "#4a9fe8", G: "#3fae7a", C: "#d94f9b", "?": "var(--warn)" }; let h = "";
      const L = (x, y, t, cor) => `<text x="${x}" y="${y}" text-anchor="middle" style="font:700 17px Inter,system-ui,sans-serif;fill:${cor}">${t}</text>`, r = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" class="tx2" style="font-size:11px">${t}</text>`;
      h += `<line x1="${x0 - 14}" y1="26" x2="${x0 + dx * (n - 1) + 14}" y2="26" style="stroke:var(--ink2);stroke-width:2"/><line x1="${x0 - 14}" y1="104" x2="${x0 + dx * (n - 1) + 14}" y2="104" style="stroke:var(--ink2);stroke-width:2"/>` + r(18, 46, "5′") + r(W - 18, 46, "3′") + r(18, 96, "3′") + r(W - 18, 96, "5′");
      s.split("").forEach((b, k) => { const x = x0 + dx * k, m = b === "A" || b === "T" ? 2 : 3, bx = o.oculta ? "?" : c[k]; h += L(x, 46, b, COR[b]) + L(x, 96, bx, COR[bx]); if (!o.oculta) for (let j = 0; j < m; j++) { const xx = x + (j - (m - 1) / 2) * 6; h += `<line x1="${xx}" y1="54" x2="${xx}" y2="76" style="stroke:var(--ink2);stroke-width:1.6;stroke-dasharray:3 3"/>`; } });
      return { svg: h, w: W, h: 124 }; } };
  /* nome: "DNA: pareamento, pontes de hidrogênio e transcrição" · matéria: Química · tema: I04 */
  SIM.qDNA = (el, F) => { let s = "ATGCGTA", ver = false; const MAX = 16;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px;min-height:170px;overflow-x:auto"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">acrescentar base à fita de cima</p><div class="bts">${["A", "T", "G", "C"].map((b) => `<button class="bt peq" data-b="${b}">${b}</button>`).join("")}<button class="bt peq" data-b="x">apagar</button><button class="bt peq" data-b="r">sortear</button></div></div>
      <div><div class="bts"><button class="bt peq" data-v="ver" aria-pressed="false">mostrar a fita complementar</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (x) => el.querySelector(x), DN = SIM.BIO.DNA;
    const est = () => ({ s, n: s.length, comp: SIM.dna.comp(s), compInv: SIM.dna.compInv(s), hb: SIM.dna.hb(s), gc: SIM.dna.gc(s), compr: SIM.dna.compr(s.length), voltas: SIM.dna.voltas(s.length), rna: SIM.dna.rna(SIM.dna.comp(s)), ver });
    const desenha = () => { const e = est(), d = SIM.dna.escada(s, { oculta: !ver });
      q("[data-v=sv]").innerHTML = `<svg viewBox="0 0 ${d.w} ${d.h}" width="${d.w}" role="img" aria-label="trecho de dupla fita">${d.svg}</svg>`;
      q("[data-v=lt]").innerHTML = vis("pares de bases", String(e.n)) + vis("ligações de hidrogênio", ver ? String(e.hb) : "?") + vis("G + C", nt(e.gc, 1) + "%") + vis("comprimento", nt(e.compr, 1) + " Å") + vis("voltas da hélice", nt(e.voltas, 2)) + vis("RNA transcrito (da fita de baixo)", ver ? e.rna : "?");
      q("[data-v=st]").innerHTML = !ver ? "Antes de clicar em <b>mostrar</b>: escreva a fita de baixo (A com T, G com C) e conte as ligações de hidrogênio (2 em cada par A·T, 3 em cada par G·C)." : `Fita complementar, lida de 5′ para 3′: <b>${e.compInv}</b> (as fitas são antiparalelas). ${e.n - Math.round(e.gc * e.n / 100)} pares A·T × 2 + ${Math.round(e.gc * e.n / 100)} pares G·C × 3 = <b>${e.hb}</b> ligações de hidrogênio. Na hélice, ${DN.paresVolta} pares por volta e ${DN.passo} Å por volta: ${nt(DN.passo / DN.paresVolta, 1)} Å por par. O RNA copiado da fita de baixo tem a sequência da de cima, com U no lugar de T.`; };
    el.querySelectorAll("[data-b]").forEach((b) => b.addEventListener("click", () => { const k = b.dataset.b; if (k === "x") s = s.length > 1 ? s.slice(0, -1) : s; else if (k === "r") { const n = 6 + Math.floor(Math.random() * 7); s = Array.from({ length: n }, () => "ATGC"[Math.floor(Math.random() * 4)]).join(""); ver = false; } else if (s.length < MAX) s += k; q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); }));
    q("[data-v=ver]").addEventListener("click", () => { ver = !ver; q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); });
    SIM.qDNA._ult = { poe: (x, v = true) => { s = x; ver = v; q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); }, est }; desenha(); };

  /* ---------- I05: combustíveis ---------- */
  /* números de um combustível CxHyOz com entalpia de combustão dh (kJ/mol, positiva = liberada), massa m e densidade d (g/cm³, só líquidos) */
  SIM.combustivel = (c) => ({ kJg: c.dh / c.m, MJL: c.d ? (c.dh / c.m) * c.d : null, o2: c.c + c.h / 4 - c.o / 2, co2: c.c, h2o: c.h / 2, gCO2MJ: (c.c * 44) / (c.dh / 1000) });
  /* nome: "Combustíveis: energia, oxigênio e CO₂" · matéria: Química · tema: I05 */
  SIM.qCombustivel = (el, F) => { const C = SIM.BIO.COMB; let i = 0, q = "g", modo = "kJg";
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:flex;justify-content:center;padding:12px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">combustível</p><div class="bts">${botoes(C.map((c, k) => [k, c.nome.replace(/ \(.+\)/, "")]), "c", i)}</div></div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">queimar</p><div class="bts">${botoes([["g", "1 g"], ["mol", "1 mol"], ["L", "1 L (líquido)"]], "q", q)}</div></div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">comparar por</p><div class="bts">${botoes([["kJg", "energia por grama"], ["MJL", "energia por litro"], ["gCO2MJ", "CO₂ por energia"]], "modo", modo)}</div></div></div>
      <div class="status" data-v="st"></div>`);
    const qs = (s) => el.querySelector(s), sb = (f) => f.replace(/(\d+)/g, "<sub>$1</sub>");
    const est = () => { const c = C[i], x = SIM.combustivel(c), n = q === "g" ? 1 / c.m : q === "mol" ? 1 : c.d ? (1000 * c.d) / c.m : null; return { k: c.k, q, modo, ...x, n, energia: n === null ? null : n * c.dh, mCO2: n === null ? null : n * c.c * 44, mO2: n === null ? null : n * x.o2 * 32 }; };
    const desenha = () => { const c = C[i], e = est(), W = 620, H = 30 * C.length + 34, vals = C.map((y) => SIM.combustivel(y)[modo]), mx = Math.max(...vals.filter((v) => v !== null)), UN = { kJg: "kJ/g", MJL: "MJ/L", gCO2MJ: "g de CO₂ por MJ" }[modo];
      let s = ""; C.forEach((y, k) => { const v = vals[k], yy = 12 + 30 * k, w = v === null ? 0 : (350 * v) / mx; s += `<text x="150" y="${yy + 14}" text-anchor="end" class="tx2" style="font-size:12.5px;${k === i ? "fill:var(--ink);font-weight:700" : ""}">${y.nome.replace(/ \(.+\)/, "")}</text><rect x="160" y="${yy}" width="${w.toFixed(1)}" height="20" rx="4" style="fill:${k === i ? "var(--mod)" : "var(--line,#2a3140)"}"/><text x="${(166 + w).toFixed(1)}" y="${yy + 14}" class="tx2" style="font-size:12.5px">${v === null ? "é gás: sem densidade de líquido" : nt(v, 1) + " " + UN}</text>`; });
      qs("[data-v=sv]").innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="comparação entre combustíveis">${s}</svg>`;
      qs("[data-v=lt]").innerHTML = vis("fórmula", sb(c.f)) + vis("ΔH de combustão", "−" + nt(c.dh, 1) + " kJ/mol") + vis("energia liberada", e.energia === null ? "—" : nt(e.energia, 1) + " kJ") + vis("O₂ consumido", e.mO2 === null ? "—" : nt(e.mO2, 2) + " g") + vis("CO₂ formado", e.mCO2 === null ? "—" : nt(e.mCO2, 2) + " g") + vis("octanagem (RON)", c.ron === null ? "sem dado" : nt(c.ron, 1));
      qs("[data-v=st]").innerHTML = `Combustão completa de 1 mol: <b>${nt(e.o2, 2)} O₂ → ${e.co2} CO₂ + ${nt(e.h2o, 1)} H₂O</b>, liberando ${nt(c.dh, 1)} kJ. ` + (e.n === null ? "Este combustível é gás nas condições ambientes: a opção de 1 L de líquido não se aplica." : `Na quantidade escolhida há ${nt(e.n, 3)} mol.`) + ` ${c.bio ? "Pode ser obtido de biomassa (fermentação ou biodigestão)." : ""} ΔH: Tabela 5.2 do OpenStax Chemistry; densidade e octanagem: Wikipedia. Massas com H = 1, C = 12, O = 16.`; };
    liga(el, "c", (v) => { i = +v; desenha(); }); liga(el, "q", (v) => { q = v; desenha(); }); liga(el, "modo", (v) => { modo = v; desenha(); });
    SIM.qCombustivel._ult = { poe: (k, qq = "g", m = "kJg") => { i = C.findIndex((c) => c.k === k); q = qq; modo = m; [["c", i], ["q", q], ["modo", modo]].forEach(([a, v]) => el.querySelectorAll(`[data-${a}]`).forEach((x) => x.setAttribute("aria-pressed", String(x.dataset[a]) === String(v)))); desenha(); }, est }; desenha(); };

  /* ---------- I06: ciclos biogeoquímicos ---------- */
  /* espécies de nitrogênio: [fórmula para mostrar, nº de N, nº de H, nº de O, carga]; o nox sai da regra: (carga − H + 2·O) / N */
  SIM.NESP = { N2: ["N₂", 2, 0, 0, 0], NH3: ["NH₃", 1, 3, 0, 0], NH4: ["NH₄⁺", 1, 4, 0, 1], NO2m: ["NO₂⁻", 1, 0, 2, -1], NO3m: ["NO₃⁻", 1, 0, 3, -1], NO: ["NO", 1, 0, 1, 0], N2O: ["N₂O", 2, 0, 1, 0], NO2: ["NO₂", 1, 0, 2, 0], org: ["N orgânico (R–NH₂)", 1, 3, 0, 0] };
  SIM.noxN = (k) => { const e = SIM.NESP[k]; return (e[4] - e[2] + 2 * e[3]) / e[1]; };
  /* etapas do ciclo do nitrogênio: [nome, de, para, quem faz] */
  SIM.NCICLO = [["fixação", "N2", "NH3", "bactérias fixadoras (no solo e nas raízes de leguminosas); na indústria, o processo Haber-Bosch"], ["amonificação", "org", "NH4", "bactérias e fungos decompositores"], ["nitrificação, 1ª etapa", "NH4", "NO2m", "bactérias nitrificantes do solo"], ["nitrificação, 2ª etapa", "NO2m", "NO3m", "bactérias nitrificantes do solo"], ["desnitrificação", "NO3m", "N2", "bactérias desnitrificantes, em ambiente sem oxigênio"], ["assimilação", "NO3m", "org", "plantas, que usam o nitrato para fazer aminoácidos"]];
  SIM.netapa = (j) => { const e = SIM.NCICLO[j], a = SIM.noxN(e[1]), b = SIM.noxN(e[2]); return { nome: e[0], de: e[1], para: e[2], a, b, eletrons: Math.abs(b - a), tipo: b > a ? "oxidação" : b < a ? "redução" : "sem mudança de nox", quem: e[3] }; };
  /* nome: "Ciclo do nitrogênio: os degraus do nox" · matéria: Química · tema: I06 */
  SIM.qNitrogenio = (el, F) => { let j = 0, ver = false; const ORD = ["NH3", "N2", "N2O", "NO", "NO2m", "NO2", "NO3m"];
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:flex;justify-content:center;padding:12px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">etapa do ciclo</p><div class="bts">${botoes(SIM.NCICLO.map((e, k) => [k, e[0]]), "j", j)}</div></div>
      <div><div class="bts"><button class="bt peq" data-v="ver" aria-pressed="false">mostrar o nox e os elétrons</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), sg = (v) => (v > 0 ? "+" + v : String(v).replace("-", "−")), est = () => ({ ...SIM.netapa(j), ver });
    const desenha = () => { const e = est(), W = 640, H = 230, X = (v) => 60 + (v + 3) * 65, y0 = 150; let s = `<line x1="${X(-3) - 20}" y1="${y0}" x2="${X(5) + 20}" y2="${y0}" style="stroke:var(--ink2);stroke-width:1.5"/>`;
      for (let v = -3; v <= 5; v++) s += `<line x1="${X(v)}" y1="${y0 - 5}" x2="${X(v)}" y2="${y0 + 5}" style="stroke:var(--ink2);stroke-width:1.5"/><text x="${X(v)}" y="${y0 + 22}" text-anchor="middle" class="tx2" style="font-size:12px">${sg(v)}</text>`;
      s += `<text x="${W / 2}" y="${y0 + 46}" text-anchor="middle" class="tx2" style="font-size:12px">número de oxidação do nitrogênio</text>`;
      ORD.forEach((k, i) => { const v = SIM.noxN(k), on = ver && (k === e.de || k === e.para || (e.de === "org" && k === "NH3") || (e.para === "org" && k === "NH3")); if (!ver) return; s += `<circle cx="${X(v)}" cy="${y0}" r="5" style="fill:${on ? "var(--mod)" : "var(--ink2)"}"/><text x="${X(v)}" y="${y0 - 14 - (k === "NO2" || k === "N2O" ? 0 : 0)}" text-anchor="middle" style="font:600 13px Inter,system-ui,sans-serif;fill:${on ? "var(--ink)" : "var(--ink2)"}">${ver ? SIM.NESP[k][0] : ""}</text>`; });
      if (ver && e.a !== e.b) { const x1 = X(e.a), x2 = X(e.b), my = y0 - 62; s += `<path d="M${x1},${y0 - 34} Q${(x1 + x2) / 2},${my - 40} ${x2},${y0 - 34}" style="fill:none;stroke:var(--mod);stroke-width:2.4"/><polygon points="${x2},${y0 - 30} ${x2 - (x2 > x1 ? 9 : -9)},${y0 - 40} ${x2 - (x2 > x1 ? 1 : -1)},${y0 - 44}" style="fill:var(--mod)"/><text x="${(x1 + x2) / 2}" y="${my - 14}" text-anchor="middle" style="font:700 13px Inter,system-ui,sans-serif;fill:var(--mod)">${e.eletrons} e⁻ por N</text>`; }
      s += `<text x="${W / 2}" y="22" text-anchor="middle" style="font:700 16px Inter,system-ui,sans-serif;fill:var(--ink)">${SIM.NESP[e.de][0]}  →  ${SIM.NESP[e.para][0]}</text>`;
      q("[data-v=sv]").innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="escada do nox do nitrogênio">${s}</svg>`;
      q("[data-v=lt]").innerHTML = vis("etapa", e.nome) + vis("nox do N antes", ver ? sg(e.a) : "?") + vis("nox do N depois", ver ? sg(e.b) : "?") + vis("o nitrogênio sofre", ver ? e.tipo : "?") + vis("elétrons por átomo de N", ver ? String(e.eletrons) : "?");
      q("[data-v=st]").innerHTML = !ver ? "Antes de clicar em <b>mostrar</b>: calcule o nox do nitrogênio nas duas espécies. Ele sobe ou desce?" : `<b>${e.nome[0].toUpperCase() + e.nome.slice(1)}</b>: ${e.tipo}${e.eletrons ? `, com ${e.eletrons} elétrons ${e.b > e.a ? "perdidos" : "ganhos"} por átomo de N` : " (o nitrogênio continua em −3: muda a molécula, não o estado de oxidação)"}. Quem faz: ${e.quem}. Regra do nox: H vale +1, O vale −2, e a soma dá a carga da espécie.`; };
    liga(el, "j", (v) => { j = +v; ver = false; q("[data-v=ver]").setAttribute("aria-pressed", "false"); desenha(); });
    q("[data-v=ver]").addEventListener("click", () => { ver = !ver; q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); });
    SIM.qNitrogenio._ult = { poe: (jj, v = true) => { j = jj; ver = v; el.querySelectorAll("[data-j]").forEach((x) => x.setAttribute("aria-pressed", String(+x.dataset.j === j))); q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); }, est }; desenha(); };

  /* ---------- I07: poluição ---------- */
  /* GWP em 100 anos usado nas contas: o da tabela mais recente da fonte; para o metano, 27 (origem não fóssil; a fonte dá 30 para o fóssil) */
  SIM.gwp = (g) => { const v = SIM.BIO.AMB.gwp[g]; return Array.isArray(v) ? v[0] : v; };
  SIM.co2e = (g, m) => m * SIM.gwp(g);
  /* chuva: parte do pH natural (5,6, do CO₂ do ar) e soma o H⁺ de c µmol/L de H₂SO₄ (2 H⁺ por molécula, ionização total) */
  SIM.phChuva = (cMicro) => { const h0 = Math.pow(10, -SIM.BIO.AMB.chuva), h = h0 + 2 * cMicro * 1e-6; return { h0, h, ph: -Math.log10(h), vezes: h / h0, acida: -Math.log10(h) < SIM.BIO.AMB.chuvaAcida }; };
  /* nome: "Poluição do ar: CO₂ equivalente e chuva ácida" · matéria: Química · tema: I07 */
  SIM.qPoluicao = (el, F) => { const G = [["CO2", "CO₂"], ["CH4", "CH₄"], ["N2O", "N₂O"], ["CFC-12", "CFC-12"], ["SF6", "SF₆"]]; let modo = "estufa", g = "CH4", m = 1, c = 5;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:flex;justify-content:center;padding:12px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes([["estufa", "efeito estufa"], ["chuva", "chuva ácida"]], "modo", modo)}</div></div>
      <div data-v="ce"><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">gás emitido e massa</p><div class="bts">${botoes(G, "g", g)}</div><div class="bts" style="margin-top:6px">${botoes([[1, "1 kg"], [10, "10 kg"], [1000, "1 t"]], "m", m)}</div></div>
      <div data-v="cc" hidden><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">H₂SO₄ dissolvido na gota (µmol/L)</p><div class="bts">${botoes([[0, "0"], [1, "1"], [5, "5"], [50, "50"], [500, "500"]], "c", c)}</div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => (modo === "estufa" ? { modo, g, m, gwp: SIM.gwp(g), co2e: SIM.co2e(g, m) } : { modo, c, ...SIM.phChuva(c) });
    const desenha = () => { q("[data-v=ce]").hidden = modo !== "estufa"; q("[data-v=cc]").hidden = modo === "estufa"; const e = est(), W = 620;
      if (modo === "estufa") { const mx = Math.log10(23500); let s = ""; G.forEach(([k, r], i) => { const v = SIM.gwp(k), w = 30 + (300 * Math.log10(v)) / mx, y = 10 + 30 * i; s += `<text x="110" y="${y + 14}" text-anchor="end" class="tx2" style="font-size:13px;${k === g ? "fill:var(--ink);font-weight:700" : ""}">${r}</text><rect x="120" y="${y}" width="${w.toFixed(1)}" height="20" rx="4" style="fill:${k === g ? "var(--mod)" : "var(--line,#2a3140)"}"/><text x="${(126 + w).toFixed(1)}" y="${y + 14}" class="tx2" style="font-size:12.5px">${nt(v, 0)} vez${v === 1 ? "" : "es"} o CO₂</text>`; });
        q("[data-v=sv]").innerHTML = `<svg viewBox="0 0 ${W} 170" width="${W}" role="img" aria-label="potencial de aquecimento global">${s}<text x="${W / 2}" y="166" text-anchor="middle" class="tx2" style="font-size:11px">barras em escala logarítmica</text></svg>`;
        q("[data-v=lt]").innerHTML = vis("gás", G.find((x) => x[0] === g)[1]) + vis("massa emitida", nt(m, 0) + " kg") + vis("GWP (100 anos)", nt(e.gwp, 0)) + vis("CO₂ equivalente", nt(e.co2e, 0) + " kg");
        q("[data-v=st]").innerHTML = `Emitir ${nt(m, 0)} kg de ${G.find((x) => x[0] === g)[1]} aquece, em 100 anos, tanto quanto emitir <b>${nt(e.co2e, 0)} kg de CO₂</b>. O GWP compara, massa por massa, o calor retido por um gás com o retido pelo CO₂. Valores da tabela mais recente da fonte (Wikipedia, "Global warming potential"); para o metano a fonte dá 27 (origem não fóssil) e 30 (fóssil): aqui, 27.`; }
      else { const X = (ph) => 60 + ((ph - 2) * 500) / 6, y = 70; let s = `<line x1="60" y1="${y}" x2="560" y2="${y}" style="stroke:var(--ink2);stroke-width:1.5"/>`; for (let p2 = 2; p2 <= 8; p2++) s += `<line x1="${X(p2)}" y1="${y - 5}" x2="${X(p2)}" y2="${y + 5}" style="stroke:var(--ink2);stroke-width:1.5"/><text x="${X(p2)}" y="${y + 22}" text-anchor="middle" class="tx2" style="font-size:12px">${p2}</text>`;
        s += `<rect x="60" y="${y - 3}" width="${X(SIM.BIO.AMB.chuvaAcida) - 60}" height="6" style="fill:#e5604d;opacity:.55"/><text x="${(60 + X(5)) / 2}" y="${y + 42}" text-anchor="middle" class="tx2" style="font-size:11.5px">chuva ácida: pH abaixo de 5</text><line x1="${X(5.6)}" y1="${y - 26}" x2="${X(5.6)}" y2="${y}" style="stroke:var(--ink2);stroke-width:1.5;stroke-dasharray:4 3"/><text x="${X(5.6)}" y="${y - 32}" text-anchor="middle" class="tx2" style="font-size:11.5px">chuva limpa: 5,6</text><circle cx="${X(Math.max(2, e.ph)).toFixed(1)}" cy="${y}" r="8" style="fill:var(--mod)"/><text x="${W / 2}" y="${y + 62}" text-anchor="middle" class="tx2" style="font-size:12px">pH da água da chuva</text>`;
        q("[data-v=sv]").innerHTML = `<svg viewBox="0 0 ${W} 150" width="${W}" role="img" aria-label="escala de pH da chuva">${s}</svg>`;
        q("[data-v=lt]").innerHTML = vis("H₂SO₄ na gota", nt(c, 0) + " µmol/L") + vis("[H⁺]", (e.h * 1e6).toFixed(e.h * 1e6 < 10 ? 2 : 0).replace(".", ",") + " µmol/L") + vis("pH", nt(e.ph, 2)) + vis("acidez (× a da chuva limpa)", nt(e.vezes, 1)) + vis("classificação", e.acida ? "chuva ácida" : "dentro do natural");
        q("[data-v=st]").innerHTML = `A chuva limpa já é levemente ácida (pH 5,6), por causa do CO₂ do ar, que forma ácido carbônico: [H⁺] = 10⁻⁵·⁶ = ${(e.h0 * 1e6).toFixed(2).replace(".", ",")} µmol/L. Cada molécula de H₂SO₄ (vinda do SO₂) soma 2 H⁺. Com ${nt(c, 0)} µmol/L: pH <b>${nt(e.ph, 2)}</b>, ${nt(e.vezes, 1)} vezes mais H⁺ que a chuva limpa. A escala é logarítmica: uma unidade de pH = dez vezes. Modelo simples: ácido forte totalmente ionizado, sem contar outras substâncias dissolvidas.`; } };
    liga(el, "modo", (v) => { modo = v; desenha(); }); liga(el, "g", (v) => { g = v; desenha(); }); liga(el, "m", (v) => { m = +v; desenha(); }); liga(el, "c", (v) => { c = +v; desenha(); });
    SIM.qPoluicao._ult = { poe: (mo, a, b) => { modo = mo; if (mo === "estufa") { g = a; m = b; } else c = a; [["modo", modo], ["g", g], ["m", m], ["c", c]].forEach(([k, v]) => el.querySelectorAll(`[data-${k}]`).forEach((x) => x.setAttribute("aria-pressed", String(x.dataset[k]) === String(v)))); desenha(); }, est }; desenha(); };

  //MAIS-LABS
})();
