/* Química · módulo J (química analítica e de coordenação): tabelas geradas a partir de dados com fonte e laboratórios dos temas J01 a J04.
   As tabelas (SIM.ANA) são GERADAS por tools/quimica/gera-analitica.py a partir de tools/quimica/dadosJ.json (valor, fonte e trecho de cada dado). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const nt = (v, d = 1) => (SIM.vg ? SIM.vg(v, d) : String(v).replace(".", ","));
  /* íon escrito com índices e carga em sobrescrito: "SO4 2-" → SO₄²⁻ */
  const ion = (s) => { if (s === "NH4+") return "NH₄⁺"; if (s === "NO3-") return "NO₃⁻"; const [f, q] = s.includes(" ") ? s.split(" ") : [s.replace(/(\d*[+-])$/, ""), (s.match(/(\d*[+-])$/) || [""])[0]]; return f.replace(/(\d)/g, (c) => "₀₁₂₃₄₅₆₇₈₉"[+c]) + q.replace(/[0-9+-]/g, (c) => ({ "+": "⁺", "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴" }[c])); };
  const sci = (v) => { if (v === null || v === undefined) return "sem dado"; const e = Math.floor(Math.log10(v)), m = +(v / Math.pow(10, e)).toPrecision(3); return nt(m, 1) + "·10" + String(e).replace("-", "⁻").replace(/\d/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]); };
  SIM.ion = ion; SIM.sciU = sci;

  /*ANA-INI*/ /* GERADO por tools/quimica/gera-analitica.py a partir de tools/quimica/dadosJ.json: não editar à mão */
  SIM.ANA = {
    CHAMA: [
      {"el": "Li", "cor": "vermelho-carmim"},
      {"el": "Na", "cor": "amarelo intenso"},
      {"el": "K", "cor": "lilás"},
      {"el": "Rb", "cor": "vermelho-violeta"},
      {"el": "Cs", "cor": "azul-violeta"},
      {"el": "Ca", "cor": "vermelho-tijolo (alaranjado)"},
      {"el": "Sr", "cor": "vermelho-carmesim"},
      {"el": "Ba", "cor": "verde-maçã claro"},
      {"el": "Cu", "cor": "verde"},
      {"el": "B", "cor": "verde vivo"},
      {"el": "Pb", "cor": "branco-azulado"},
    ],
    SOL: {"Na+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "S", "OH-": "S", "S2-": "R", "NO3-": "S", "PO4 3-": "S"}, "K+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "S", "OH-": "S", "S2-": "R", "NO3-": "S", "PO4 3-": "S"}, "NH4+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "S", "OH-": "S", "S2-": "R", "NO3-": "S", "PO4 3-": "S"}, "Mg2+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "sS", "OH-": "I", "S2-": "R", "NO3-": "S", "PO4 3-": "I"}, "Ca2+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "sS", "CO3 2-": "I", "OH-": "sS", "S2-": "R", "NO3-": "S", "PO4 3-": "I"}, "Ba2+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "I", "CO3 2-": "I", "OH-": "S", "S2-": "R", "NO3-": "S", "PO4 3-": "I"}, "Al3+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "R", "OH-": "I", "S2-": "R", "NO3-": "S", "PO4 3-": "I"}, "Fe2+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "I", "OH-": "I", "S2-": "I", "NO3-": "S", "PO4 3-": "I"}, "Fe3+": {"Cl-": "S", "Br-": "S", "I-": "R", "SO4 2-": "S", "CO3 2-": "R", "OH-": "I", "S2-": "I", "NO3-": "S", "PO4 3-": "sS"}, "Cu2+": {"Cl-": "S", "Br-": "S", "I-": "?", "SO4 2-": "S", "CO3 2-": "I", "OH-": "I", "S2-": "I", "NO3-": "S", "PO4 3-": "I"}, "Zn2+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "I", "OH-": "I", "S2-": "I", "NO3-": "S", "PO4 3-": "I"}, "Ag+": {"Cl-": "I", "Br-": "I", "I-": "I", "SO4 2-": "sS", "CO3 2-": "I", "OH-": "I", "S2-": "I", "NO3-": "S", "PO4 3-": "I"}, "Pb2+": {"Cl-": "sS", "Br-": "sS", "I-": "sS", "SO4 2-": "I", "CO3 2-": "I", "OH-": "sS", "S2-": "I", "NO3-": "S", "PO4 3-": "I"}},
    PREC: [
      {"f": "AgCl", "c": "Ag+", "a": "Cl-", "cor": "branco", "kps": 1.6e-10},
      {"f": "AgBr", "c": "Ag+", "a": "Br-", "cor": "amarelo-claro", "kps": 5e-13},
      {"f": "AgI", "c": "Ag+", "a": "I-", "cor": "amarelo", "kps": 1.5e-16},
      {"f": "PbCl2", "c": "Pb2+", "a": "Cl-", "cor": "branco", "kps": 1.6e-05},
      {"f": "PbI2", "c": "Pb2+", "a": "I-", "cor": "amarelo vivo", "kps": 1.4e-08},
      {"f": "PbSO4", "c": "Pb2+", "a": "SO4 2-", "cor": "branco", "kps": 1.3e-08},
      {"f": "BaSO4", "c": "Ba2+", "a": "SO4 2-", "cor": "branco", "kps": 2.3e-08},
      {"f": "CaCO3", "c": "Ca2+", "a": "CO3 2-", "cor": "branco", "kps": 8.7e-09},
      {"f": "Fe(OH)3", "c": "Fe3+", "a": "OH-", "cor": "castanho-avermelhado", "kps": 4e-38},
      {"f": "Fe(OH)2", "c": "Fe2+", "a": "OH-", "cor": "esverdeado", "kps": 1.8e-15},
      {"f": "Cu(OH)2", "c": "Cu2+", "a": "OH-", "cor": "azul", "kps": 2.2e-20},
      {"f": "Al(OH)3", "c": "Al3+", "a": "OH-", "cor": "branco", "kps": 2e-32},
      {"f": "Zn(OH)2", "c": "Zn2+", "a": "OH-", "cor": "branco", "kps": 1.8e-14},
      {"f": "Mg(OH)2", "c": "Mg2+", "a": "OH-", "cor": "branco", "kps": 8.9e-12},
      {"f": "CuS", "c": "Cu2+", "a": "S2-", "cor": "preto", "kps": 8.5e-45},
      {"f": "PbS", "c": "Pb2+", "a": "S2-", "cor": "preto", "kps": 7e-29},
      {"f": "Ag2S", "c": "Ag+", "a": "S2-", "cor": "preto-acinzentado", "kps": 1.6e-49},
      {"f": "PbCrO4", "c": "Pb2+", "a": null, "cor": "amarelo vivo", "kps": 2e-16},
      {"f": "BaCrO4", "c": "Ba2+", "a": null, "cor": "amarelo", "kps": 8.5e-11},
      {"f": "Ag2CrO4", "c": "Ag+", "a": null, "cor": "vermelho-tijolo", "kps": 9e-12},
      {"f": "CdS", "c": null, "a": null, "cor": "amarelo-alaranjado", "kps": 1e-28},
    ],
    GRUPOS: [
      {"n": 1, "oq": "cloretos insolúveis", "reag": "HCl diluído", "cats": ["Ag+", "Hg2 2+", "Pb2+"]},
      {"n": 2, "oq": "sulfetos insolúveis em meio ácido", "reag": "H₂S em meio ácido", "cats": ["Cu2+", "Cd2+", "Bi3+", "Hg2+", "Sn2+", "As3+", "Sb3+"]},
      {"n": 3, "oq": "hidróxidos insolúveis", "reag": "NH₃ com NH₄Cl", "cats": ["Fe2+", "Fe3+", "Al3+", "Cr3+"]},
      {"n": 4, "oq": "sulfetos que precipitam em pH 9", "reag": "H₂S em meio amoniacal (pH 9)", "cats": ["Zn2+", "Ni2+", "Co2+", "Mn2+"]},
      {"n": 5, "oq": "carbonatos insolúveis", "reag": "(NH₄)₂CO₃", "cats": ["Ba2+", "Ca2+", "Sr2+"]},
      {"n": 6, "oq": "ficam em solução", "reag": "nenhum (teste de chama)", "cats": ["Mg2+", "Li+", "Na+", "K+"]},
    ],
    GRAV: [
      {"id": "cl", "nome": "cloreto", "fa": "Cl", "fp": "AgCl", "n": 1, "reag": "AgNO₃ em excesso", "cor": "branco", "M": 143.32},
      {"id": "ag", "nome": "prata", "fa": "Ag", "fp": "AgCl", "n": 1, "reag": "cloreto em excesso", "cor": "branco", "M": 143.32},
      {"id": "so4", "nome": "sulfato", "fa": "SO4", "fp": "BaSO4", "n": 1, "reag": "BaCl₂ em excesso", "cor": "branco", "M": 233.39},
      {"id": "ni", "nome": "níquel", "fa": "Ni", "fp": "Ni(C4H7N2O2)2", "n": 1, "reag": "dimetilglioxima", "cor": "vermelho vivo", "M": 288.91},
      {"id": "ca", "nome": "cálcio", "fa": "Ca", "fp": "CaO", "n": 1, "reag": "ácido oxálico; depois, calcinação", "cor": null, "M": 56.08},
    ],
    HIDRATO: {"f": "BaCl2", "x": 2, "Manidro": 208.23, "Mhidrato": 244.26},
    OPENSTAX: {"e415": {"amostra": 0.455, "BaSO4": 0.6168, "MgSO4": 0.3181, "pct": 69.91, "M_BaSO4": 233.43, "M_MgSO4": 120.37}, "e416": {"amostra": 0.00126, "CO2": 0.00394, "H2O": 0.00161, "formula": "CH2"}, "e414": {"Va": 50.0, "Vt": 35.23, "Ct": 0.25, "Ca": 0.176}},
    IND: [
      {"id": "alaranjado_de_metila", "nome": "alaranjado de metila", "lo": 3.1, "hi": 4.4, "c1": "vermelho", "c2": "amarelo"},
      {"id": "verde_de_bromocresol", "nome": "verde de bromocresol", "lo": 3.8, "hi": 5.4, "c1": "amarelo", "c2": "azul"},
      {"id": "vermelho_de_metila", "nome": "vermelho de metila", "lo": 4.4, "hi": 6.2, "c1": "vermelho", "c2": "amarelo"},
      {"id": "azul_de_bromotimol", "nome": "azul de bromotimol", "lo": 6.0, "hi": 7.6, "c1": "amarelo", "c2": "azul"},
      {"id": "vermelho_de_fenol", "nome": "vermelho de fenol", "lo": 6.4, "hi": 8.0, "c1": "amarelo", "c2": "vermelho"},
      {"id": "fenolftaleina", "nome": "fenolftaleína", "lo": 8.3, "hi": 10.0, "c1": "incolor", "c2": "rosa"},
      {"id": "timolftaleina", "nome": "timolftaleína", "lo": 9.3, "hi": 10.5, "c1": "incolor", "c2": "azul"},
    ],
    KA: {"acetico": 1.8e-05, "formico": 0.00018, "HF": 0.00064, "amonia_Kb": 1.8e-05},
    EPOT: {"MnO4": 1.507, "Fe": 0.771, "I2": 0.5355, "S4O6": 0.08},
    TIT: [
      {"id": "hcl", "an": "HCl", "tit": "NaOH", "ct": 0.1, "a": 1, "t": 1, "tipo": "ab", "Ka": null, "ind": null, "c1": null, "c2": null, "eq": "HCl + NaOH → NaCl + H₂O"},
      {"id": "hac", "an": "ácido acético", "tit": "NaOH", "ct": 0.1, "a": 1, "t": 1, "tipo": "ab", "Ka": 1.8e-05, "ind": null, "c1": null, "c2": null, "eq": "CH₃COOH + NaOH → CH₃COONa + H₂O"},
      {"id": "fe", "an": "Fe²⁺ (em meio ácido)", "tit": "KMnO₄", "ct": 0.02, "a": 5, "t": 1, "tipo": "redox", "Ka": null, "ind": "o próprio permanganato", "c1": "sem cor de permanganato", "c2": "lilás claro", "eq": "MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O"},
      {"id": "cl", "an": "Cl⁻ (meio quase neutro)", "tit": "AgNO₃", "ct": 0.1, "a": 1, "t": 1, "tipo": "prec", "Ka": null, "ind": "cromato de potássio (método de Mohr)", "c1": "branco", "c2": "vermelho", "eq": "Ag⁺ + Cl⁻ → AgCl(s)"},
      {"id": "ca", "an": "Ca²⁺ (tampão de pH 10)", "tit": "EDTA", "ct": 0.01, "a": 1, "t": 1, "tipo": "comp", "Ka": null, "ind": "negro de eriocromo T", "c1": "vermelho", "c2": "azul", "eq": "Ca²⁺ + EDTA → complexo 1 : 1"},
      {"id": "i2", "an": "I₂", "tit": "Na₂S₂O₃", "ct": 0.1, "a": 1, "t": 2, "tipo": "redox", "Ka": null, "ind": "amido", "c1": "azul-escuro", "c2": "incolor", "eq": "I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻"},
    ],
    KHP: {"f": "C8H5KO4", "M": 204.222},
    LIG: {"H2O": {"f": "H₂O", "nome": "aqua", "q": 0, "dent": 1}, "NH3": {"f": "NH₃", "nome": "amin", "q": 0, "dent": 1}, "CO": {"f": "CO", "nome": "carbonil", "q": 0, "dent": 1}, "F": {"f": "F⁻", "nome": "fluoro", "q": -1, "dent": 1}, "Cl": {"f": "Cl⁻", "nome": "cloro", "q": -1, "dent": 1}, "Br": {"f": "Br⁻", "nome": "bromo", "q": -1, "dent": 1}, "I": {"f": "I⁻", "nome": "iodo", "q": -1, "dent": 1}, "CN": {"f": "CN⁻", "nome": "ciano", "q": -1, "dent": 1}, "OH": {"f": "OH⁻", "nome": "hidroxo", "q": -1, "dent": 1}, "ox": {"f": "C₂O₄²⁻", "nome": "oxalato", "q": -2, "dent": 2}, "en": {"f": "en", "nome": "etilenodiamina", "q": 0, "dent": 2}, "EDTA": {"f": "EDTA⁴⁻", "nome": "EDTA", "q": -4, "dent": 6}},
    CX: [
      {"id": "CoNH3", "f": "[Co(NH₃)₆]Cl₃", "metal": "Co", "ligs": [["NH3", 6]], "carga": 3, "nox": 3, "nc": 6, "nome": "cloreto de hexaamincobalto(III)"},
      {"id": "PtNH3Cl", "f": "[Pt(NH₃)₄Cl₂]²⁺", "metal": "Pt", "ligs": [["NH3", 4], ["Cl", 2]], "carga": 2, "nox": 4, "nc": 6, "nome": "íon tetraamindicloroplatina(IV)"},
      {"id": "AgNH3", "f": "[Ag(NH₃)₂]⁺", "metal": "Ag", "ligs": [["NH3", 2]], "carga": 1, "nox": 1, "nc": 2, "nome": "íon diaminprata(I)"},
      {"id": "CrH2OCl", "f": "[Cr(H₂O)₄Cl₂]Cl", "metal": "Cr", "ligs": [["H2O", 4], ["Cl", 2]], "carga": 1, "nox": 3, "nc": 6, "nome": "cloreto de tetraaquadiclorocromo(III)"},
      {"id": "Coen", "f": "[Co(en)₃]₂(SO₄)₃", "metal": "Co", "ligs": [["en", 3]], "carga": 3, "nox": 3, "nc": 6, "nome": "sulfato de tris(etilenodiamina)cobalto(III)"},
      {"id": "PtNH3Cl4", "f": "[Pt(NH₃)₂Cl₄]", "metal": "Pt", "ligs": [["NH3", 2], ["Cl", 4]], "carga": 0, "nox": 4, "nc": 6, "nome": "diamintetracloroplatina(IV)"},
      {"id": "Nien", "f": "[Ni(en)₂Cl₂]", "metal": "Ni", "ligs": [["en", 2], ["Cl", 2]], "carga": 0, "nox": 2, "nc": 6, "nome": "diclorobis(etilenodiamina)níquel(II)"},
      {"id": "PtCl6", "f": "[PtCl₆]²⁻", "metal": "Pt", "ligs": [["Cl", 6]], "carga": -2, "nox": 4, "nc": 6, "nome": "íon hexacloroplatinato(IV)"},
      {"id": "SnCl6", "f": "Na₂[SnCl₆]", "metal": "Sn", "ligs": [["Cl", 6]], "carga": -2, "nox": 4, "nc": 6, "nome": "hexacloroestanato(IV) de sódio"},
      {"id": "cisPt", "f": "cis-[Pt(NH₃)₂Cl₂]", "metal": "Pt", "ligs": [["NH3", 2], ["Cl", 2]], "carga": 0, "nox": 2, "nc": 4, "nome": "cis-diamindicloroplatina(II)"},
    ],
    GEO: [
      {"nc": 2, "nome": "linear", "ex": "[Ag(NH₃)₂]⁺"},
      {"nc": 4, "nome": "tetraédrica", "ex": "[Zn(CN)₄]²⁻"},
      {"nc": 4, "nome": "quadrada plana", "ex": "[Pt(NH₃)₂Cl₂]"},
      {"nc": 6, "nome": "octaédrica", "ex": "[Co(H₂O)₆]²⁺"},
    ],
    ESPL: [
      {"id": "Ti3+", "f": "[Ti(H₂O)₆]³⁺", "metal": "Ti", "nox": 3, "dn": 1, "forte": false, "cor": "violeta"},
      {"id": "V3+", "f": "[V(H₂O)₆]³⁺", "metal": "V", "nox": 3, "dn": 2, "forte": false, "cor": "roxo"},
      {"id": "Cr3+", "f": "[Cr(H₂O)₆]³⁺", "metal": "Cr", "nox": 3, "dn": 3, "forte": false, "cor": "violeta"},
      {"id": "Cr2+", "f": "[Cr(H₂O)₆]²⁺", "metal": "Cr", "nox": 2, "dn": 4, "forte": false, "cor": "azul"},
      {"id": "Mn2+", "f": "[Mn(H₂O)₆]²⁺", "metal": "Mn", "nox": 2, "dn": 5, "forte": false, "cor": "rosa-claro"},
      {"id": "Fe2+", "f": "[Fe(H₂O)₆]²⁺", "metal": "Fe", "nox": 2, "dn": 6, "forte": false, "cor": "verde-azulado claro"},
      {"id": "Fe3+", "f": "[Fe(H₂O)₆]³⁺", "metal": "Fe", "nox": 3, "dn": 5, "forte": false, "cor": "violeta-claro"},
      {"id": "Co2+", "f": "[Co(H₂O)₆]²⁺", "metal": "Co", "nox": 2, "dn": 7, "forte": false, "cor": "rosa"},
      {"id": "Ni2+", "f": "[Ni(H₂O)₆]²⁺", "metal": "Ni", "nox": 2, "dn": 8, "forte": false, "cor": "verde"},
      {"id": "Cu2+", "f": "[Cu(H₂O)₆]²⁺", "metal": "Cu", "nox": 2, "dn": 9, "forte": false, "cor": "azul"},
      {"id": "Zn2+", "f": "[Zn(H₂O)₆]²⁺", "metal": "Zn", "nox": 2, "dn": 10, "forte": false, "cor": "incolor"},
      {"id": "FeCN6_4", "f": "[Fe(CN)₆]⁴⁻", "metal": "Fe", "nox": 2, "dn": 6, "forte": true, "cor": "amarelo-claro"},
      {"id": "FeCN6_3", "f": "[Fe(CN)₆]³⁻", "metal": "Fe", "nox": 3, "dn": 5, "forte": true, "cor": null},
      {"id": "FeF6_3", "f": "[FeF₆]³⁻", "metal": "Fe", "nox": 3, "dn": 5, "forte": false, "cor": null},
    ],
    SERIE: [
      "I⁻",
      "Br⁻",
      "Cl⁻",
      "F⁻",
      "H₂O",
      "NH₃",
      "en",
      "NO₂⁻",
      "CN⁻",
    ],
    TI: {"lambda": 499, "E": 3.99e-19},
    KF: {"AgNH3": 17000000.0, "CuNH3": 17000000000000.0, "AgCN": 1e+21, "FeCN4": 1.5e+35, "NiNH3": 200000000.0, "ZnOH": 2000000000000000.0, "FeSCN": 890.0, "ZnCN": 2.1e+19},
  };
  /*ANA-FIM*/

  /* ---------- J01: análise qualitativa ---------- */
  /* carga e fórmula-base de um íon escrito como "Fe3+", "SO4 2-", "NH4+", "Cl-" */
  const partes = (s) => { if (s === "NH4+") return { f: "NH4", q: 1, poli: true }; if (s === "NO3-") return { f: "NO3", q: -1, poli: true }; const sp = s.includes(" "), f = sp ? s.split(" ")[0] : s.replace(/(\d?[+-])$/, ""), c = sp ? s.split(" ")[1] : (s.match(/(\d?[+-])$/) || [""])[0], n = parseInt(c, 10) || 1; return { f, q: c.endsWith("-") ? -n : n, poli: /[A-Z].*[A-Z]|\d/.test(f) && f !== "OH" ? true : f === "OH" }; };
  /* fórmula do sal neutro formado por um cátion e um ânion (cargas cruzadas e simplificadas) */
  SIM.salF = (c, a) => { const C = partes(c), A = partes(a), mdc = (x, y) => (y ? mdc(y, x % y) : x), g = mdc(C.q, -A.q), nc = -A.q / g, na = C.q / g, sb = (f) => f.replace(/(\d)/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[+d]), un = (p, n) => (n === 1 ? sb(p.f) : p.poli ? "(" + sb(p.f) + ")" + "₀₁₂₃₄₅₆₇₈₉"[n] : sb(p.f) + "₀₁₂₃₄₅₆₇₈₉"[n]); return { f: un(C, nc) + un(A, na), nc, na }; };
  /* o que a tabela de solubilidade diz do par, e o precipitado (cor e Kps) quando ele está na tabela PREC */
  SIM.precip = (c, a) => { const cod = SIM.ANA.SOL[c][a], P = SIM.ANA.PREC.find((x) => x.c === c && x.a === a) || null, s = SIM.salF(c, a); return { c, a, cod, f: s.f, nc: s.nc, na: s.na, forma: cod === "I", pouco: cod === "sS", reage: cod === "R", semdado: cod === "?", cor: P ? P.cor : null, kps: P ? P.kps : null }; };
  const CODT = { S: "solúvel (20 g/L ou mais)", sS: "pouco solúvel (0,1 a 20 g/L)", I: "insolúvel (menos de 0,1 g/L)", R: "reage com a água", "?": "sem dado na tabela" };
  /* nome: "Precipita ou não? Misturando duas soluções" · matéria: Química · tema: J01 */
  SIM.qPrecipita = (el, F) => { const CAT = Object.keys(SIM.ANA.SOL), AN = Object.keys(SIM.ANA.SOL[CAT[0]]); let c = "Ag+", a = "Cl-", ver = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:flex;justify-content:center;padding:12px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">cátion (na forma de nitrato, solúvel)</p><div class="bts">${botoes(CAT.map((k) => [k, ion(k)]), "c", c)}</div></div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">ânion (na forma de sal de sódio, solúvel)</p><div class="bts">${botoes(AN.map((k) => [k, ion(k)]), "a", a)}</div></div>
      <div><div class="bts"><button class="bt peq" data-v="ver" aria-pressed="false">misturar e ver</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => ({ ...SIM.precip(c, a), ver });
    const COR = { branco: "#e8e8e8", "amarelo-claro": "#efe7a8", amarelo: "#e8d44a", "amarelo vivo": "#f2d21f", "castanho-avermelhado": "#9a4a2a", esverdeado: "#7fae8a", azul: "#3f8fd6", preto: "#22262e", "preto-acinzentado": "#3a3f48" };
    const desenha = () => { const e = est(), W = 520, tubo = (x, liq, pp, rot) => `<path d="M${x},20 v96 a26,26 0 0 0 52,0 v-96" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="M${x + 2},46 v70 a24,24 0 0 0 48,0 v-70 z" style="fill:${liq};opacity:.35"/>${pp ? `<path d="M${x + 2},112 v4 a24,24 0 0 0 48,0 v-4 z" style="fill:${pp};stroke:var(--ink2);stroke-width:.6"/>` : ""}<text x="${x + 26}" y="164" text-anchor="middle" class="tx2" style="font-size:12px">${rot}</text>`;
      const pp = ver && (e.forma || (e.pouco && e.cor)) ? COR[e.cor] || "#9aa3ad" : null;
      q("[data-v=sv]").innerHTML = `<svg viewBox="0 0 ${W} 174" width="${W}" role="img" aria-label="mistura de duas soluções">${tubo(60, "#6fa8dc", null, ion(c) + " (aq)")}<text x="150" y="86" text-anchor="middle" style="font:700 20px Inter,system-ui,sans-serif;fill:var(--ink)">+</text>${tubo(190, "#6fa8dc", null, ion(a) + " (aq)")}<line x1="270" y1="80" x2="330" y2="80" style="stroke:var(--ink);stroke-width:2"/><polygon points="338,80 328,75 328,85" style="fill:var(--ink)"/>${ver ? tubo(380, "#6fa8dc", pp, pp ? "precipitado" : "sem precipitado") : `<text x="406" y="92" text-anchor="middle" style="font:700 30px Inter,system-ui,sans-serif;fill:var(--warn)">?</text>`}</svg>`;
      q("[data-v=lt]").innerHTML = vis("composto possível", e.f) + vis("na tabela de solubilidade", ver ? CODT[e.cod] : "?") + vis("forma precipitado?", ver ? (e.forma ? "sim" : e.pouco ? "se não estiver muito diluído" : e.reage || e.semdado ? "caso especial" : "não") : "?") + vis("cor do precipitado", ver ? (e.forma || e.pouco ? e.cor || "sem dado" : "—") : "?") + vis("Kps (25 °C)", ver ? (e.kps ? sci(e.kps) : e.forma ? "sem dado" : "—") : "?");
      q("[data-v=st]").innerHTML = !ver ? "Antes de clicar: pelas regras de solubilidade, o composto formado pelo cátion e pelo ânion escolhidos é solúvel?" :
        (e.forma ? `Forma-se <b>${e.f}</b>, insolúvel${e.cor ? ", " + e.cor : ""}. Equação iônica: ${e.nc > 1 ? e.nc + " " : ""}${ion(c)}(aq) + ${e.na > 1 ? e.na + " " : ""}${ion(a)}(aq) → ${e.f}(s). Os outros íons (Na⁺ e NO₃⁻) só assistem.` : e.pouco ? `<b>${e.f}</b> é pouco solúvel (entre 0,1 e 20 g/L): precipita se as soluções não forem muito diluídas${e.cor ? "; o sólido é " + e.cor + ", um precipitado clássico" : ""}.` : e.reage ? `<b>${e.f}</b> não se obtém em água: o composto reage com ela (hidrólise).` : e.semdado ? `A tabela da fonte não traz dado para <b>${e.f}</b>.` : `<b>${e.f}</b> é solúvel: os íons continuam livres e nada precipita.`) + ` Solubilidade: tabela da Wikipedia ("Solubility chart"). Cor e Kps: dados de fonte (Kps do OpenStax; outras tabelas dão valores diferentes).`; };
    liga(el, "c", (v) => { c = v; ver = false; q("[data-v=ver]").setAttribute("aria-pressed", "false"); desenha(); }); liga(el, "a", (v) => { a = v; ver = false; q("[data-v=ver]").setAttribute("aria-pressed", "false"); desenha(); });
    q("[data-v=ver]").addEventListener("click", () => { ver = !ver; q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); });
    SIM.qPrecipita._ult = { poe: (cc, aa, v = true) => { c = cc; a = aa; ver = v; [["c", c], ["a", a]].forEach(([k, x]) => el.querySelectorAll(`[data-${k}]`).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset[k] === x)))); q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); }, est }; desenha(); };

  /* ---------- J02: gravimetria ---------- */
  const fsub = (f) => f.replace(/(\d)/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[+d]);
  SIM.fsub = fsub;
  const sci3 = (v) => { const e = Math.floor(Math.log10(v)), m = +(v / Math.pow(10, e)).toFixed(2); return nt(m, 2) + "·10" + String(e).replace("-", "⁻").replace(/\d/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]); };
  /* conta gravimétrica com as massas arredondadas do site: amostra de massa m (g) com fração em massa "teor" do analito → sólido pesado (balança de 0,0001 g) e o caminho de volta */
  SIM.grav = (id, m, teor) => { const g = SIM.ANA.GRAV.find((x) => x.id === id), Mp = SIM.mm(g.fp), Ma = SIM.mm(g.fa), mp = +(m * teor / Ma / g.n * Mp).toFixed(4), ns = mp / Mp, ma = ns * g.n * Ma; return { ...g, Mp, Ma, m, mp, ns, ma, teor: ma / m }; };
  /* nome: "Gravimetria: do sólido na balança ao teor da amostra" · matéria: Química · tema: J02 */
  SIM.qGravimetria = (el, F) => { const G = SIM.ANA.GRAV, TEOR = { A: 0.15, B: 0.24, C: 0.36 }; let id = "cl", m = 0.5, am = "A", ver = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:flex;justify-content:center;padding:12px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">o que se quer medir</p><div class="bts">${botoes(G.map((g) => [g.id, g.nome + " → " + fsub(g.fp)]), "g", id)}</div></div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">amostra desconhecida</p><div class="bts">${botoes([["A", "amostra A"], ["B", "amostra B"], ["C", "amostra C"]], "am", am)}</div></div>
      <div><label style="font-size:13px;color:var(--ink2)">massa de amostra pesada: <b data-v="mm"></b><input type="range" data-v="rg" min="0.2" max="2" step="0.05" value="0.5" style="width:100%"></label></div>
      <div><div class="bts"><button class="bt peq" data-v="ver" aria-pressed="false">mostrar a conta</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => ({ ...SIM.grav(id, m, TEOR[am]), am, ver });
    const COR = { branco: "#e8e8e8", "vermelho vivo": "#d8343a" };
    const desenha = () => { const e = est(), W = 640, cs = COR[e.cor] || "#c9ced6", T = (x, y, s, c = "tx2", t = 12) => `<text x="${x}" y="${y}" text-anchor="middle" class="${c}" style="font-size:${t}px">${s}</text>`;
      const beq = (x, pp) => `<path d="M${x},40 v84 h70 v-84" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="${x + 2}" y="64" width="66" height="58" style="fill:#6fa8dc;opacity:.3"/>${pp ? `<rect x="${x + 2}" y="110" width="66" height="12" style="fill:${cs};stroke:var(--ink2);stroke-width:.6"/>` : ""}`;
      const seta = (x) => `<line x1="${x}" y1="84" x2="${x + 34}" y2="84" style="stroke:var(--ink);stroke-width:2"/><polygon points="${x + 42},84 ${x + 32},79 ${x + 32},89" style="fill:var(--ink)"/>`;
      const funil = (x) => `<path d="M${x},44 l35,50 v30 M${x + 70},44 l-35,50" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="M${x + 14},64 l21,30 l21,-30 z" style="fill:${cs};stroke:var(--ink2);stroke-width:.6"/>`;
      const bal = (x) => `<rect x="${x}" y="100" width="110" height="26" rx="5" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="${x + 16}" y="88" width="78" height="6" rx="2" style="fill:var(--ink2)"/><path d="M${x + 36},88 q19,-22 38,0 z" style="fill:${cs};stroke:var(--ink2);stroke-width:.6"/><text x="${x + 55}" y="118" text-anchor="middle" style="font:700 13px Inter,system-ui,sans-serif;fill:var(--ink)">${nt(e.mp, 4)} g</text>`;
      q("[data-v=sv]").innerHTML = `<svg viewBox="0 0 ${W} 170" width="${W}" role="img" aria-label="etapas da gravimetria">${beq(20, false)}${T(55, 146, "amostra dissolvida")}${T(55, 162, nt(e.m, 2) + " g")}${seta(104)}${beq(160, true)}${T(195, 146, "precipitar")}${T(195, 162, "(" + e.reag.split(";")[0] + ")")}${seta(244)}${funil(300)}${T(335, 146, "filtrar")}${T(335, 162, e.id === "ca" ? "e calcinar" : "e secar")}${seta(384)}${bal(440)}${T(495, 146, "pesar")}${T(495, 162, fsub(e.fp))}</svg>`;
      q("[data-v=mm]").textContent = nt(e.m, 2) + " g";
      q("[data-v=lt]").innerHTML = vis("sólido pesado", fsub(e.fp)) + vis("massa molar do sólido", nt(e.Mp, 1) + " g/mol") + vis("massa do sólido seco", nt(e.mp, 4) + " g") + vis("mol do sólido", ver ? sci3(e.ns) + " mol" : "?") + vis("massa de " + e.nome, ver ? nt(e.ma, 4) + " g" : "?") + vis("teor na amostra", ver ? nt(100 * e.teor, 1) + " %" : "?");
      q("[data-v=st]").innerHTML = (!ver ? `Antes de clicar: quantos mols de ${fsub(e.fp)} estão no prato da balança? Quanto de ${e.nome} esses mols carregam? ` : `${nt(e.mp, 4)} g ÷ ${nt(e.Mp, 1)} g/mol = ${sci3(e.ns)} mol de ${fsub(e.fp)}; cada mol tem ${e.n} mol de ${e.nome} (${nt(e.Ma, 1)} g). Massa de ${e.nome}: ${nt(e.ma, 4)} g em ${nt(e.m, 2)} g de amostra, ou <b>${nt(100 * e.teor, 1)} %</b>. `) + (e.id === "ca" ? "O cálcio precipita como oxalato; aquecido ao rubro, o oxalato vira CaO, que é o que se pesa. " : "") + `Massas atômicas arredondadas (${SIM.dadosMA([e.fp]).replace("Massas atômicas (g/mol): ", "").replace(/\.$/, "")}); a massa molar do sólido no PubChem é ${nt(e.M, 2)} g/mol. As amostras A, B e C são hipotéticas.`; };
    const sinc = () => { el.querySelectorAll("[data-g]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.g === id))); el.querySelectorAll("[data-am]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.am === am))); q("[data-v=rg]").value = m; q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); };
    liga(el, "g", (v) => { id = v; ver = false; sinc(); }); liga(el, "am", (v) => { am = v; ver = false; sinc(); });
    q("[data-v=rg]").addEventListener("input", (ev) => { m = +ev.target.value; desenha(); });
    q("[data-v=ver]").addEventListener("click", () => { ver = !ver; sinc(); });
    SIM.qGravimetria._ult = { poe: (i, mm, a, v = true) => { id = i; m = mm; am = a; ver = v; sinc(); }, est }; sinc(); };

  /* ---------- J03: volumetria ---------- */
  const VA = 25, VEQ = { A: 12.5, B: 20, C: 31.25 };
  const HEX = { incolor: "#dfe7ee", rosa: "#e86aa6", vermelho: "#d8343a", amarelo: "#e8d44a", azul: "#3f8fd6", "lilás claro": "#b98bd9", "azul-escuro": "#27336e", branco: "#e8e8e8", "sem cor de permanganato": "#dfe7ee" };
  const mist = (h1, h2, f) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), a = p(h1), b = p(h2); return "#" + a.map((x, i) => Math.round(x + (b[i] - x) * f).toString(16).padStart(2, "0")).join(""); };
  /* pH durante a titulação de um ácido (forte, ou fraco com Ka) de concentração ca (volume va, mL) com base forte ct (volume v, mL): balanço de carga (SIM.phGeral) */
  SIM.phTitJ = (ca, va, ct, v, Ka) => { const vt = va + v, A = ca * va / vt, B = ct * v / vt; return SIM.phGeral(Ka ? { CT: A, Ka, cb: B } : { ca: A, cb: B }).pH; };
  /* estado de uma titulação do laboratório: tipo, amostra (A, B ou C: concentração escondida), volume gasto v (mL) e indicador (só nas ácido-base) */
  SIM.titula = (id, am, v, indId = "fenolftaleina") => { const T = SIM.ANA.TIT.find((x) => x.id === id), veq = VEQ[am], ca = T.ct * veq * T.a / T.t / VA, ab = T.tipo === "ab", I = ab ? SIM.ANA.IND.find((x) => x.id === indId) : null;
    let pH = null, cor, hex, virou;
    if (ab) { pH = SIM.phTitJ(ca, VA, T.ct, v, T.Ka); const f = Math.max(0, Math.min(1, (pH - I.lo) / (I.hi - I.lo))); cor = f <= 0 ? I.c1 : f >= 1 ? I.c2 : `virando (${I.c1} → ${I.c2})`; hex = mist(HEX[I.c1], HEX[I.c2], f); virou = f >= 1; }
    else { virou = v >= veq - 1e-9; cor = virou ? T.c2 : T.c1; hex = HEX[cor]; }
    return { ...T, am, v, veq, ca, ab, pH, cor, hex, virou, indNome: ab ? I.nome : T.ind, indId: ab ? indId : null }; };
  /* volume em que a cor termina de mudar (ácido-base: pH chega ao fim da faixa do indicador; nos outros tipos, o modelo vira na equivalência) */
  SIM.titViragem = (id, am, indId = "fenolftaleina") => { const e0 = SIM.titula(id, am, 0, indId); if (!e0.ab) return e0.veq; const I = SIM.ANA.IND.find((x) => x.id === indId); let lo = 0, hi = 60; for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; SIM.phTitJ(e0.ca, VA, e0.ct, m, e0.Ka) >= I.hi ? (hi = m) : (lo = m); } return (lo + hi) / 2; };
  /* nome: "Titulação: gota a gota até a viragem" · matéria: Química · tema: J03 */
  SIM.qTitulacao = (el, F) => { const TT = SIM.ANA.TIT, INDS = ["alaranjado_de_metila", "azul_de_bromotimol", "fenolftaleina"].map((k) => SIM.ANA.IND.find((x) => x.id === k)); let id = "hcl", am = "A", ind = "fenolftaleina", v = 0, ver = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:flex;justify-content:center;padding:12px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">o que está no erlenmeyer (25,00 mL) ← o que está na bureta</p><div class="bts">${botoes(TT.map((t) => [t.id, t.an.replace(/ \(.*/, "") + " ← " + t.tit]), "t", id)}</div></div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">amostra desconhecida</p><div class="bts">${botoes([["A", "amostra A"], ["B", "amostra B"], ["C", "amostra C"]], "am", am)}</div></div>
      <div data-v="bi"><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">indicador (titulações ácido-base)</p><div class="bts">${botoes(INDS.map((i) => [i.id, i.nome]), "i", ind)}</div></div>
      <div><label style="font-size:13px;color:var(--ink2)">volume gasto da bureta: <b data-v="vv"></b><input type="range" data-v="rg" min="0" max="40" step="0.05" value="0" style="width:100%"></label><div class="bts" style="margin-top:6px"><button class="bt peq" data-v="menos">− 1 gota</button><button class="bt peq" data-v="mais">+ 1 gota (0,05 mL)</button><button class="bt peq" data-v="ver" aria-pressed="false">mostrar a conta</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => ({ ...SIM.titula(id, am, v, ind), ver });
    const desenha = () => { const e = est(), W = 640, H = 236, T = (x, y, s, a = "start", c = "tx2", t = 12) => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}" style="font-size:${t}px">${s}</text>`;
      const niv = 12 + 120 * (v / 40), bur = `<rect x="62" y="12" width="16" height="130" style="fill:none;stroke:var(--ink2);stroke-width:1.6"/><rect x="63.5" y="${niv}" width="13" height="${141 - niv}" style="fill:${e.tipo === "redox" && e.id === "fe" ? "#8e44ad" : "#6fa8dc"};opacity:.55"/><path d="M70,142 v16" style="stroke:var(--ink2);stroke-width:2"/><rect x="64" y="146" width="12" height="5" style="fill:var(--ink2)"/>${[0, 10, 20, 30, 40].map((m) => `<line x1="78" y1="${12 + 3 * m}" x2="84" y2="${12 + 3 * m}" style="stroke:var(--ink2);stroke-width:1"/><text x="88" y="${16 + 3 * m}" class="tx2" style="font-size:10px">${m}</text>`).join("")}`;
      const erl = `<path d="M62,166 v18 l-32,42 h80 l-32,-42 v-18" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="M52,198 l-20,26 h76 l-20,-26 z" style="fill:${e.hex};opacity:${e.cor === "incolor" || e.cor === "sem cor de permanganato" ? 0.25 : 0.85}"/>`;
      let dir;
      if (e.ab) { const X = (vv) => 330 + 280 * vv / 40, Y = (ph) => 206 - 180 * ph / 14, I = SIM.ANA.IND.find((x) => x.id === ind); let d = ""; for (let k = 0; k <= 160; k++) { const vv = k / 4; d += (k ? "L" : "M") + X(vv).toFixed(1) + "," + Y(SIM.phTitJ(e.ca, VA, e.ct, vv, e.Ka)).toFixed(1); }
        dir = `<rect x="330" y="${Y(I.hi)}" width="280" height="${Y(I.lo) - Y(I.hi)}" style="fill:${mist(HEX[I.c1], HEX[I.c2], 0.5)};opacity:.28"/><line x1="330" y1="26" x2="330" y2="206" style="stroke:var(--ink2)"/><line x1="330" y1="206" x2="610" y2="206" style="stroke:var(--ink2)"/>${[0, 7, 14].map((p) => T(322, Y(p) + 4, p, "end", "tx2", 10)).join("")}${[0, 10, 20, 30, 40].map((m) => T(X(m), 220, m, "middle", "tx2", 10)).join("")}${T(470, 234, "volume gasto (mL)", "middle", "tx2", 11)}${T(336, 20, "pH", "start", "tx2", 11)}<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2"/><circle cx="${X(v)}" cy="${Y(e.pH)}" r="5" style="fill:var(--warn);stroke:var(--bg);stroke-width:1.5"/>${T(606, Y(I.hi) - 4, "faixa do indicador", "end", "tx2", 10)}`; }
      else dir = T(330, 70, "reação da titulação:", "start", "tx2", 12) + T(330, 96, e.eq, "start", "tx", 14) + T(330, 130, "proporção analito : titulante = " + e.a + " : " + e.t, "start", "tx2", 12) + T(330, 154, "indicador: " + e.ind, "start", "tx2", 12);
      q("[data-v=sv]").innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="bureta e erlenmeyer">${bur}${erl}${T(124, 30, "bureta: " + e.tit, "start", "tx2", 12)}${T(124, 46, nt(e.ct, 4) + " mol/L", "start", "tx2", 12)}${T(124, 200, "amostra: " + e.an.replace(/ \(.*/, ""), "start", "tx2", 12)}${T(124, 216, "cor: " + e.cor, "start", "tx", 12)}${dir}</svg>`;
      q("[data-v=vv]").textContent = v.toFixed(2).replace(".", ",") + " mL"; q("[data-v=bi]").style.opacity = e.ab ? 1 : 0.35;
      q("[data-v=lt]").innerHTML = vis("titulante", e.tit + " " + nt(e.ct, 4) + " mol/L") + vis("indicador", e.indNome) + vis("volume gasto", v.toFixed(2).replace(".", ",") + " mL") + vis("cor no erlenmeyer", e.cor) + vis("pH", e.ab ? nt(e.pH, 2) : "—") + vis("volume de equivalência", ver ? nt(e.veq, 2) + " mL" : "?") + vis("concentração da amostra", ver ? nt(e.ca, 4) + " mol/L" : "?");
      const vv = SIM.titViragem(id, am, ind), dif = 100 * (vv - e.veq) / e.veq;
      q("[data-v=st]").innerHTML = (!ver ? `Goteje até a cor mudar e não voltar. Anote o volume gasto e calcule a concentração da amostra (25,00 mL), lembrando a proporção ${e.a} : ${e.t}. ` : `No ponto de equivalência (${nt(e.veq, 2)} mL): ${nt(e.ct, 4)} mol/L × ${nt(e.veq / 1000, 5)} L = ${sci3(e.ct * e.veq / 1000)} mol de titulante, que reagem com ${sci3(e.ct * e.veq / 1000 * e.a / e.t)} mol de analito (${e.a} : ${e.t}). Em 25,00 mL: <b>${nt(e.ca, 4)} mol/L</b>. ` + (e.ab ? `Com ${e.indNome}, a cor termina de mudar em ${nt(vv, 2)} mL: ${Math.abs(dif) < 0.5 ? "praticamente na equivalência" : "erro de " + nt(dif, 1) + " % no volume"}. ` : "")) + (e.ab ? "pH calculado pelo balanço de carga, a 25 °C; faixas dos indicadores: Wikipedia. " : "Modelo: nestes casos a cor vira exatamente na equivalência; na prática há um pequeno excesso de titulante. ") + "As amostras A, B e C são hipotéticas."; };
    const sinc = () => { [["t", id], ["am", am], ["i", ind]].forEach(([k, x]) => el.querySelectorAll(`[data-${k}]`).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset[k] === x)))); q("[data-v=rg]").value = v; q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); };
    liga(el, "t", (x) => { id = x; v = 0; ver = false; sinc(); }); liga(el, "am", (x) => { am = x; v = 0; ver = false; sinc(); }); liga(el, "i", (x) => { ind = x; sinc(); });
    q("[data-v=rg]").addEventListener("input", (ev) => { v = +ev.target.value; desenha(); });
    q("[data-v=mais]").addEventListener("click", () => { v = Math.min(40, +(v + 0.05).toFixed(2)); sinc(); }); q("[data-v=menos]").addEventListener("click", () => { v = Math.max(0, +(v - 0.05).toFixed(2)); sinc(); });
    q("[data-v=ver]").addEventListener("click", () => { ver = !ver; sinc(); });
    SIM.qTitulacao._ult = { poe: (i, a, vol, indic = "fenolftaleina", mostra = true) => { id = i; am = a; v = vol; ind = indic; ver = mostra; sinc(); }, est }; sinc(); };

  /* ---------- J04: química de coordenação ---------- */
  const SUPN = (n) => String(n).replace(/\d/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]);
  /* preenchimento dos orbitais d num campo octaédrico: n elétrons, campo forte (baixo spin) ou fraco (alto spin). occ = ocupação dos 5 orbitais (0 a 2 = t2g; 3 e 4 = eg) */
  SIM.campoD = (n, forte) => { const occ = [0, 0, 0, 0, 0], ordem = forte ? [0, 1, 2, 0, 1, 2, 3, 4, 3, 4] : [0, 1, 2, 3, 4, 0, 1, 2, 3, 4]; for (let k = 0; k < n; k++) occ[ordem[k]]++; const t = occ[0] + occ[1] + occ[2], e = occ[3] + occ[4], des = occ.filter((x) => x === 1).length; return { n, forte, occ, t, e, des, spin: n >= 4 && n <= 7 ? (forte ? "baixo" : "alto") : "único", mag: des ? "paramagnético" : "diamagnético", cfg: "t₂g" + SUPN(t) + (e ? " eg" + SUPN(e) : "") }; };
  /* número de oxidação do metal e número de coordenação a partir dos ligantes e da carga do complexo */
  SIM.complexo = (ligs, carga) => ({ nox: carga - ligs.reduce((s, [l, k]) => s + SIM.ANA.LIG[l].q * k, 0), nc: ligs.reduce((s, [l, k]) => s + SIM.ANA.LIG[l].dent * k, 0) });
  /* nome: "Campo cristalino: onde ficam os elétrons d" · matéria: Química · tema: J04 */
  SIM.qCampo = (el, F) => { const E = SIM.ANA.ESPL; let pre = "Fe2+", dn = 6, forte = false, ver = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:flex;justify-content:center;padding:12px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">complexos octaédricos com dado de fonte</p><div class="bts">${botoes(E.map((x) => [x.id, x.f]), "p", pre)}</div></div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">ou monte o seu (modelo)</p><label style="font-size:13px;color:var(--ink2)">elétrons d: <b data-v="dd"></b><input type="range" data-v="rg" min="1" max="10" step="1" value="6" style="width:100%"></label><div class="bts" style="margin-top:6px">${botoes([["0", "campo fraco (Δ < P)"], ["1", "campo forte (Δ > P)"]], "c", "0")}<button class="bt peq" data-v="ver" aria-pressed="false">distribuir os elétrons</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), atual = () => E.find((x) => x.id === pre) || null, est = () => ({ ...SIM.campoD(dn, forte), pre, cx: atual(), ver });
    const CORH = { violeta: "#8e5bd0", roxo: "#7d3fa8", azul: "#3f8fd6", "rosa-claro": "#f2b8cf", "verde-azulado claro": "#9fd6c8", "violeta-claro": "#c9b3e6", rosa: "#e86aa6", verde: "#3fae6a", incolor: "#dfe7ee", "amarelo-claro": "#efe7a8" };
    const desenha = () => { const e = est(), W = 640, H = 236, G = forte ? 120 : 56, y0 = 122, yt = y0 + 0.4 * G, ye = y0 - 0.6 * G, T = (x, y, s, a = "middle", c = "tx2", t = 12) => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}" style="font-size:${t}px">${s}</text>`;
      const lin = (x, y) => `<line x1="${x}" y1="${y}" x2="${x + 34}" y2="${y}" style="stroke:var(--ink);stroke-width:2.4"/>`, el2 = (x, y, k) => (k >= 1 ? `<text x="${x + 11}" y="${y - 5}" text-anchor="middle" style="font:700 17px Inter,system-ui,sans-serif;fill:var(--mod)">↑</text>` : "") + (k === 2 ? `<text x="${x + 23}" y="${y - 5}" text-anchor="middle" style="font:700 17px Inter,system-ui,sans-serif;fill:var(--mod)">↓</text>` : "");
      let s = T(130, 24, "íon livre: 5 orbitais d iguais") + [0, 1, 2, 3, 4].map((k) => lin(40 + k * 38, y0)).join("") + T(130, y0 + 22, e.n + " elétrons d");
      s += `<line x1="234" y1="${y0}" x2="372" y2="${ye}" style="stroke:var(--ink2);stroke-dasharray:4 4"/><line x1="234" y1="${y0}" x2="352" y2="${yt}" style="stroke:var(--ink2);stroke-dasharray:4 4"/>`;
      s += T(470, 24, "no complexo octaédrico") + [0, 1].map((k) => lin(380 + k * 44, ye) + (ver ? el2(380 + k * 44, ye, e.occ[3 + k]) : "")).join("") + [0, 1, 2].map((k) => lin(360 + k * 44, yt) + (ver ? el2(360 + k * 44, yt, e.occ[k]) : "")).join("") + T(486, ye + 4, "eg", "start", "tx", 13) + T(506, yt + 4, "t₂g", "start", "tx", 13);
      s += `<line x1="560" y1="${ye}" x2="560" y2="${yt}" style="stroke:var(--warn);stroke-width:1.6"/><polygon points="560,${ye} 556,${ye + 8} 564,${ye + 8}" style="fill:var(--warn)"/><polygon points="560,${yt} 556,${yt - 8} 564,${yt - 8}" style="fill:var(--warn)"/>` + T(570, (ye + yt) / 2 + 4, "Δoct", "start", "tx", 13) + T(570, (ye + yt) / 2 + 20, forte ? "grande" : "pequeno", "start", "tx2", 11);
      if (!ver) s += `<text x="426" y="${y0 + 8}" text-anchor="middle" style="font:700 26px Inter,system-ui,sans-serif;fill:var(--warn)">?</text>`;
      if (e.cx && e.cx.cor) s += `<circle cx="80" cy="200" r="13" style="fill:${CORH[e.cx.cor]};stroke:var(--ink2);stroke-width:1.2"/>` + T(100, 204, "cor em solução: " + e.cx.cor, "start");
      q("[data-v=sv]").innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="desdobramento dos orbitais d">${s}</svg>`; q("[data-v=dd]").textContent = "d" + SUPN(dn);
      q("[data-v=lt]").innerHTML = vis("complexo", e.cx ? e.cx.f : "modelo (sem complexo)") + vis("metal e nox", e.cx ? e.cx.metal + ", +" + e.cx.nox : "—") + vis("elétrons d", "d" + SUPN(dn)) + vis("campo", forte ? "forte (Δ > P)" : "fraco (Δ < P)") + vis("configuração", ver ? e.cfg : "?") + vis("desemparelhados", ver ? e.des : "?") + vis("magnetismo", ver ? e.mag : "?") + vis("spin", ver ? (e.spin === "único" ? "só há um jeito" : e.spin + " spin") : "?");
      q("[data-v=st]").innerHTML = (!ver ? `Antes de clicar: distribua os ${dn} elétrons. Os três orbitais t₂g enchem primeiro, um elétron em cada. Do quarto elétron em diante, ${forte ? "com campo forte compensa emparelhar em t₂g (subir custaria Δ, que é maior que P)" : "com campo fraco compensa subir para eg (emparelhar custaria P, que é maior que Δ)"}. Quantos ficam desemparelhados? ` : `Configuração ${e.cfg}: ${e.des} elétron${e.des === 1 ? "" : "s"} desemparelhado${e.des === 1 ? "" : "s"}, ${e.mag}. ${e.spin === "único" ? "Com " + dn + " elétrons d não há diferença entre campo forte e fraco." : "É um complexo de " + e.spin + " spin."} `) + (e.cx ? "Configuração e cor: dados de fonte (aquocomplexos: Wikipedia, \"Metal aquo complex\"; ferro com cianeto e com fluoreto: OpenStax 19.3)." : "Modo livre: o tamanho do campo é escolha sua; é um modelo, não um complexo real."); };
    const sinc = () => { el.querySelectorAll("[data-p]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.p === pre))); el.querySelectorAll("[data-c]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.c === (forte ? "1" : "0")))); q("[data-v=rg]").value = dn; q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); };
    liga(el, "p", (x) => { pre = x; const c = atual(); dn = c.dn; forte = c.forte; ver = false; sinc(); }); liga(el, "c", (x) => { forte = x === "1"; pre = null; ver = false; sinc(); });
    q("[data-v=rg]").addEventListener("input", (ev) => { dn = +ev.target.value; pre = null; ver = false; sinc(); });
    q("[data-v=ver]").addEventListener("click", () => { ver = !ver; sinc(); });
    SIM.qCampo._ult = { poe: (p, n, f, v = true) => { pre = p; if (p) { const c = E.find((x) => x.id === p); dn = c.dn; forte = c.forte; } else { dn = n; forte = !!f; } ver = v; sinc(); }, est }; sinc(); };

  //MAIS-LABS
})();
