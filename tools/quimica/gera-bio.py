#!/usr/bin/env python3
"""Gera SIM.BIO (tabelas do módulo I da Química) em assets/sims/quimica/bio.js, entre /*BIO-INI*/ e /*BIO-FIM*/, a partir de tools/quimica/dadosI.json.
Nada de memória: todo número vem de dadosI.json (valor com fonte e trecho). O que é escrito à mão aqui (nomes em português, SMILES dos monômeros,
unidade repetitiva em fórmula condensada) é CONFERIDO:
  - SMILES de cada monômero: fórmula molecular igual à do PubChem que está em dadosI.json, ou (quando não está lá) nome em inglês conferido no PubChem
    (respostas em tools/quimica/pubchem-bio.json; --offline usa só o arquivo);
  - unidade repetitiva: nos polímeros de adição, mesma fórmula do monômero; nos de condensação, soma dos monômeros menos as águas; e igual à fórmula
    "(...)n" da caixa de dados da fonte, quando a fonte dá.
Com qualquer erro, não grava. Precisa do RDKit. Uso: python3 tools/quimica/gera-bio.py"""
import json, os, re, subprocess, sys, urllib.parse
from collections import Counter
from rdkit import Chem, RDLogger
from rdkit.Chem.rdMolDescriptors import CalcMolFormula
RDLogger.DisableLog('rdApp.*')
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
D = json.load(open(os.path.join(RAIZ, "tools", "quimica", "dadosI.json"), encoding="utf-8"))
ARQ = os.path.join(RAIZ, "tools", "quimica", "pubchem-bio.json")
cache = json.load(open(ARQ)) if os.path.exists(ARQ) else {}
erros = []
def val(lista, i=0):
    """i-ésimo valor não nulo de um item de dadosI.json"""
    v = [e["valor"] for e in (lista or []) if isinstance(e, dict) and e.get("valor") is not None]
    return v[i] if len(v) > i else None
def num(lista, un=None):
    """primeiro valor numérico (ou faixa) do item; converte kg/m3 em g/cm3"""
    for e in (lista or []):
        if not isinstance(e, dict) or e.get("valor") is None: continue
        v, u = e["valor"], e.get("unidade") or ""
        if isinstance(v, (int, float)) or (isinstance(v, list) and all(isinstance(x, (int, float)) for x in v)):
            if u == "kg/m3": v = [x / 1000 for x in v] if isinstance(v, list) else v / 1000
            return v
    return None
def hill(c):
    c = {k: v for k, v in c.items() if v}
    ord_ = (["C", "H"] if "C" in c else []) + sorted(k for k in c if not ("C" in c and k in ("C", "H")))
    return "".join(k + (str(c[k]) if c[k] > 1 else "") for k in ord_ if k in c)
def conta_f(f):
    """fórmula condensada com parênteses e índices (aceita ₀-₉ e os traços das unidades) → contagem de átomos"""
    f = f.translate(str.maketrans("₀₁₂₃₄₅₆₇₈₉", "0123456789")); f = re.sub(r"[–\-=\[\]·]", "", f).replace("n", "")
    def bloco(s):
        c = Counter(); i = 0
        while i < len(s):
            if s[i] == "(":
                p, j = 1, i + 1
                while p: p += {"(": 1, ")": -1}.get(s[j], 0); j += 1
                m = re.match(r"\d+", s[j:]); k = int(m.group()) if m else 1
                for a, b in bloco(s[i + 1:j - 1]).items(): c[a] += b * k
                i = j + (len(m.group()) if m else 0)
            else:
                m = re.match(r"([A-Z][a-z]?)(\d*)", s[i:]); assert m, (f, s[i:])
                c[m.group(1)] += int(m.group(2) or 1); i += len(m.group())
        return c
    return bloco(f)
def conta_smi(s):
    m = Chem.AddHs(Chem.MolFromSmiles(s)); return Counter(a.GetSymbol() for a in m.GetAtoms())
def pubchem(nome):
    if nome in cache: return cache[nome]
    if "--offline" in sys.argv: return None
    url = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + urllib.parse.quote(nome) + "/property/SMILES,ConnectivitySMILES,MolecularFormula/JSON"
    r = subprocess.run(["curl", "-sS", "-m", "40", "-A", "curl", url], capture_output=True, text=True)
    try: p = json.loads(r.stdout)["PropertyTable"]["Properties"][0]
    except Exception: return None
    cache[nome] = {"cid": p.get("CID"), "smiles": p.get("ConnectivitySMILES") or p.get("SMILES"), "formula": p.get("MolecularFormula")}; return cache[nome]
def plano(s):
    m = Chem.MolFromSmiles(s); Chem.RemoveStereochemistry(m); return Chem.MolToSmiles(m)
def taut(s):
    from rdkit.Chem.MolStandardize import rdMolStandardize
    m = Chem.MolFromSmiles(s); Chem.RemoveStereochemistry(m); return Chem.MolToSmiles(rdMolStandardize.TautomerEnumerator().Canonicalize(m))
def confere_nome(pt, en, smi):
    r = pubchem(en)
    if r is None: erros.append(("PubChem sem resposta", pt, en)); return
    if plano(r["smiles"]) != plano(smi) and taut(r["smiles"]) != taut(smi): erros.append(("PubChem difere", pt, en, r["smiles"], smi))

# ---------- I01: polímeros ----------
# chave em dadosI, nome, sigla, tipo, [monômeros: nome pt, nome en, SMILES], unidade repetitiva, águas por unidade, funções da cadeia
POL = [
 ["polietileno", "polietileno", "PE", "adição", [["eteno (etileno)", "ethylene", "C=C"]], "–CH₂–CH₂–", 0, "só C e H"],
 ["polipropileno", "polipropileno", "PP", "adição", [["propeno (propileno)", "propene", "C=CC"]], "–CH₂–CH(CH₃)–", 0, "só C e H"],
 ["PVC", "poli(cloreto de vinila)", "PVC", "adição", [["cloroeteno (cloreto de vinila)", "vinyl chloride", "C=CCl"]], "–CH₂–CHCl–", 0, "haleto"],
 ["poliestireno", "poliestireno", "PS", "adição", [["vinilbenzeno (estireno)", "styrene", "C=Cc1ccccc1"]], "–CH₂–CH(C₆H₅)–", 0, "anel aromático"],
 ["PTFE", "politetrafluoroetileno (teflon)", "PTFE", "adição", [["tetrafluoroeteno", "tetrafluoroethylene", "FC(F)=C(F)F"]], "–CF₂–CF₂–", 0, "haleto"],
 ["poliacrilonitrila", "poliacrilonitrila", "PAN", "adição", [["propenonitrila (acrilonitrila)", "acrylonitrile", "C=CC#N"]], "–CH₂–CH(CN)–", 0, "nitrila"],
 ["PMMA", "poli(metacrilato de metila) (acrílico)", "PMMA", "adição", [["2-metilpropenoato de metila", "methyl methacrylate", "C=C(C)C(=O)OC"]], "–CH₂–C(CH₃)(COOCH₃)–", 0, "éster (no ramo)"],
 ["borracha_natural", "borracha natural (poli-isopreno)", "NR", "adição", [["2-metilbuta-1,3-dieno (isopreno)", "isoprene", "C=CC(C)=C"]], "–CH₂–C(CH₃)=CH–CH₂–", 0, "dupla C=C"],
 ["neopreno", "neopreno (policloropreno)", "CR", "adição", [["2-clorobuta-1,3-dieno (cloropreno)", "chloroprene", "C=CC(Cl)=C"]], "–CH₂–CCl=CH–CH₂–", 0, "dupla C=C e haleto"],
 ["PET", "poli(tereftalato de etileno)", "PET", "condensação", [["ácido benzeno-1,4-dicarboxílico (tereftálico)", "terephthalic acid", "OC(=O)c1ccc(cc1)C(=O)O"], ["etano-1,2-diol (etilenoglicol)", "ethylene glycol", "OCCO"]], "–O–CH₂–CH₂–O–CO–C₆H₄–CO–", 2, "éster"],
 ["nylon_66", "náilon 6,6", "PA 66", "condensação", [["ácido hexanodioico (adípico)", "adipic acid", "OC(=O)CCCCC(=O)O"], ["hexano-1,6-diamina", "hexamethylenediamine", "NCCCCCCN"]], "–NH–(CH₂)₆–NH–CO–(CH₂)₄–CO–", 2, "amida"],
 ["kevlar", "kevlar", "aramida", "condensação", [["ácido benzeno-1,4-dicarboxílico (tereftálico)", "terephthalic acid", "OC(=O)c1ccc(cc1)C(=O)O"], ["benzeno-1,4-diamina", "p-phenylenediamine", "Nc1ccc(N)cc1"]], "–CO–C₆H₄–CO–NH–C₆H₄–NH–", 2, "amida"],
 ["PLA", "poli(ácido láctico)", "PLA", "condensação", [["ácido 2-hidroxipropanoico (láctico)", "lactic acid", "CC(O)C(=O)O"]], "–O–CH(CH₃)–CO–", 1, "éster"],
]
MA = {"H": 1, "C": 12, "N": 14, "O": 16, "F": 19, "Cl": 35.5}
P = D["polimeros"]; COD = {}
for k in "1234567": COD[k] = val(P["codigos_de_resina"][k])
cod_de = {"PET": 1, "polietileno": None, "PVC": 3, "polipropileno": 5, "poliestireno": 6}
nomes_cod = {1: "Polyethylene terephthalate", 2: "High-density polyethylene", 3: "Polyvinyl chloride", 4: "Low-density polyethylene", 5: "Polypropylene", 6: "Polystyrene"}
for n, t in nomes_cod.items():
    if COD[str(n)] != t: erros.append(("código de resina", n, COD[str(n)]))
pol = []
for ch, nome, sig, tipo, mons, un, aguas, fun in POL:
    src = P[ch]; cu = conta_f(un); soma = Counter()
    for pt, en, smi in mons:
        confere_nome(pt, en, smi); soma += conta_smi(smi)
    fp = val(src.get("monomero_formula_pubchem"))
    if fp and len(mons) == 1 and hill(conta_smi(mons[0][2])) != fp: erros.append(("fórmula do monômero ≠ PubChem de dadosI", ch, fp))
    esperado = soma - Counter({"H": 2 * aguas, "O": aguas})
    if cu != esperado: erros.append(("unidade ≠ monômeros − águas", ch, hill(cu), hill(esperado)))
    fu = val(src["unidade_repetitiva"])
    if fu and re.fullmatch(r"\([A-Za-z0-9]+\)n", str(fu)) and conta_f(str(fu)[1:-2]) != cu: erros.append(("unidade ≠ fonte", ch, fu, hill(cu)))
    mu = sum(MA[a] * q for a, q in cu.items())
    pol.append({"k": ch, "nome": nome, "sig": sig, "tipo": tipo, "mon": [[pt, smi] for pt, en, smi in mons], "un": un, "fu": hill(cu), "mu": mu, "aguas": aguas, "fun": fun,
                "d": num(src["densidade"]), "pf": num(src["fusao"]), "cod": cod_de.get(ch)})
json.dump(cache, open(ARQ, "w"), ensure_ascii=False, indent=1)
BIO = {"POL": pol, "COD": {"1": "PET", "2": "PEAD (polietileno de alta densidade)", "3": "PVC", "4": "PEBD (polietileno de baixa densidade)", "5": "PP", "6": "PS", "7": "outros"}}

# ---------- I02: carboidratos e lipídeos ----------
CB = D["carboidratos"]
def tem(lista, *palavras):
    """True se algum trecho de fonte do item contém todas as palavras (conferência do que é escrito à mão)"""
    return any(all(w.lower() in str(e.get("trecho") or "").lower() for w in palavras) for e in (lista or []) if isinstance(e, dict))
# chave, nome, classe, aldose/cetose, SMILES de cadeia aberta (monossacarídeos), composição, ligação, redutor (só o que a fonte diz em frase)
CARB_L = [
 ["glicose", "glicose", "monossacarídeo", "aldose", "OCC(O)C(O)C(O)C(O)C=O", None, None, True, ["aldehyde"], ["reducing sugar"]],
 ["frutose", "frutose", "monossacarídeo", "cetose", "OCC(O)C(O)C(O)C(=O)CO", None, None, True, ["keton"], ["reducing sugar"]],
 ["galactose", "galactose", "monossacarídeo", "aldose", "OCC(O)C(O)C(O)C(O)C=O", None, None, None, [], []],
 ["ribose", "ribose", "monossacarídeo", "aldose", "OCC(O)C(O)C(O)C=O", None, None, None, [], []],
 ["desoxirribose", "desoxirribose", "monossacarídeo", "aldose", "OCC(O)C(O)CC=O", None, None, None, [], []],
 ["sacarose", "sacarose", "dissacarídeo", None, None, "glicose + frutose", "α-1,β-2", False, ["glucose", "fructose"], ["reducing e"]],
 ["lactose", "lactose", "dissacarídeo", None, None, "galactose + glicose", "β-1,4", True, ["galactose", "glucose", "β-1→4"], ["reducing sugar"]],
 ["maltose", "maltose", "dissacarídeo", None, None, "glicose + glicose", "α-1,4", True, ["glucose"], ["reducing sugar"]],
 ["celulose", "celulose", "polissacarídeo", None, None, "glicose", "β-1,4", None, ["glucose", "1→4-β"], []],
 ["amilose", "amilose (amido)", "polissacarídeo", None, None, "glicose", "α-1,4", None, ["glucose", "α(1→4)"], []],
 ["amilopectina", "amilopectina (amido)", "polissacarídeo", None, None, "glicose", "α-1,4 com ramos α-1,6", None, ["α(1→6)"], []],
 ["glicogenio", "glicogênio", "polissacarídeo", None, None, "glicose", "α-1,4 com ramos α-1,6", None, ["glucose", "α(1→4)"], []],
]
carb = []
for ch, nome, cls, ac, smi, comp, lig, red, pal_c, pal_r in CARB_L:
    s = CB[ch]; f = val(s["formula"])
    if smi and hill(conta_smi(smi)) != f: erros.append(("carboidrato: SMILES ≠ fórmula da fonte", ch, f))
    if cls != "polissacarídeo" and not smi and f != "C12H22O11": erros.append(("dissacarídeo", ch, f))
    alvo = (s.get("composicao") or []) + (s.get("ligacao_glicosidica") or []) + (s.get("classificacao") or [])
    if pal_c and not all(tem(alvo, w) for w in pal_c): erros.append(("carboidrato: composição/ligação sem apoio na fonte", ch, pal_c))
    if red is not None and not tem(s["acucar_redutor"], *pal_r): erros.append(("açúcar redutor sem frase na fonte", ch))
    carb.append({"k": ch, "nome": nome, "cls": cls, "ac": ac, "smi": smi, "f": f if cls != "polissacarídeo" else "(C6H10O5)n", "comp": comp, "lig": lig, "red": red})
EN = CB["energia_por_grama"]
def par(lista):  # [kJ/g, kcal/g]
    for e in lista:
        if isinstance(e.get("valor"), list): return e["valor"]
    return None
energia = {"carboidrato": [17, 4] if tem(EN["carboidrato"], "17 kJ/g (4 kcal/g)") else None, "proteina": par(EN["proteina"]), "gordura": par(EN["gordura"]), "etanol": par(EN["etanol"])}
if None in energia.values(): erros.append(("energia por grama", energia))
# ácidos graxos: a estrutura condensada da fonte é convertida em SMILES e a fórmula é conferida com a da fonte
AGS = D["lipideos"]["acidos_graxos"]
NOME_AG = {"laurico": "láurico", "miristico": "mirístico", "palmitico": "palmítico", "estearico": "esteárico", "oleico": "oleico", "linoleico": "linoleico", "alfa_linolenico": "α-linolênico", "araquidonico": "araquidônico"}
def cond_smiles(e):
    e = re.sub(r"\(CH2\)(\d+)", lambda m: "C" * int(m.group(1)), e)
    return e.replace("COOH", "C(=O)O").replace("CH3", "C").replace("CH2", "C").replace("CH=CH", "C=C")
ag = []
for ch, a in AGS.items():
    est = val(a["estrutura"]); smi = cond_smiles(est); f = val(a["formula"]); cd = str(val(a["carbonos_e_duplas_CD"]))
    c = conta_smi(smi)
    if hill(c) != f: erros.append(("ácido graxo: estrutura ≠ fórmula", ch, est, hill(c), f))
    C_, D_ = [int(x) for x in cd.split(":")]
    if c["C"] != C_ or smi.count("=") - 1 != D_ or c["H"] != 2 * C_ - 2 * D_: erros.append(("ácido graxo: C:D", ch, cd))
    ag.append({"k": ch, "nome": "ácido " + NOME_AG[ch], "cd": cd, "c": C_, "d": D_, "f": f, "m": c["C"] * 12 + c["H"] + 32, "mfonte": val(a["massa_molar"]), "pf": num(a["fusao"]), "est": est, "smi": smi})
BIO["CARB"] = carb; BIO["ENERGIA"] = energia; BIO["AG"] = ag

# ---------- I03: aminoácidos ----------
# pKa e pI: Tabela 26.1 do OpenStax Organic Chemistry (primeira fonte de cada item em dadosI.json); o pI da Wikipedia vai junto, para mostrar a divergência.
# O gerador RECALCULA o pI a partir dos pKa (pH em que a carga líquida média é zero) e confere com o pI da mesma tabela.
AAS = D["aminoacidos"]["aminoacidos"]
AA_L = {"glicina": ["glicina", "NCC(=O)O", None], "alanina": ["alanina", "CC(N)C(=O)O", None], "valina": ["valina", "CC(C)C(N)C(=O)O", None], "leucina": ["leucina", "CC(C)CC(N)C(=O)O", None],
 "isoleucina": ["isoleucina", "CCC(C)C(N)C(=O)O", None], "prolina": ["prolina", "OC(=O)C1CCCN1", None], "fenilalanina": ["fenilalanina", "NC(Cc1ccccc1)C(=O)O", None],
 "triptofano": ["triptofano", "NC(Cc1c[nH]c2ccccc12)C(=O)O", None], "metionina": ["metionina", "CSCCC(N)C(=O)O", None], "serina": ["serina", "NC(CO)C(=O)O", None],
 "treonina": ["treonina", "CC(O)C(N)C(=O)O", None], "cisteina": ["cisteína", "NC(CS)C(=O)O", "acida"], "tirosina": ["tirosina", "NC(Cc1ccc(O)cc1)C(=O)O", "acida"],
 "asparagina": ["asparagina", "NC(CC(N)=O)C(=O)O", None], "glutamina": ["glutamina", "NC(CCC(N)=O)C(=O)O", None], "acido_aspartico": ["ácido aspártico", "NC(CC(=O)O)C(=O)O", "acida"],
 "acido_glutamico": ["ácido glutâmico", "NC(CCC(=O)O)C(=O)O", "acida"], "lisina": ["lisina", "NCCCCC(N)C(=O)O", "basica"], "arginina": ["arginina", "NC(CCCNC(N)=N)C(=O)O", "basica"],
 "histidina": ["histidina", "NC(Cc1c[nH]cn1)C(=O)O", "basica"]}
CLS = {"Neutral Amino Acids": "neutro", "Acidic Amino Acids": "ácido", "Basic Amino Acids": "básico"}
ESS = {"Yes": "sim", "No": "não"}
def carga(ph, pk1, pk2, pkr, tr):
    q = -1 / (1 + 10 ** (pk1 - ph)) + 1 / (1 + 10 ** (ph - pk2))
    if tr == "acida": q += -1 / (1 + 10 ** (pkr - ph))
    if tr == "basica": q += 1 / (1 + 10 ** (ph - pkr))
    return q
def pI_calc(pk1, pk2, pkr, tr):
    a, b = 0.0, 14.0
    for _ in range(60):
        m = (a + b) / 2
        if carga(m, pk1, pk2, pkr, tr) > 0: a = m
        else: b = m
    return (a + b) / 2
aa = []; pi_div = []; frase_ess = str(val(D["aminoacidos"]["essenciais"]["lista"])).lower()
for ch, (nome, smi, tr) in AA_L.items():
    a = AAS[ch]; f = val(a["formula"]); en = val(a["nome_ingles"])
    if hill(conta_smi(smi)) != f: erros.append(("aminoácido: SMILES ≠ fórmula da fonte", ch, hill(conta_smi(smi)), f))
    confere_nome(nome, en if isinstance(en, str) else ch, smi)
    pk1, pk2, pi = val(a["pKa_carboxila"]), val(a["pKa_amonio"]), val(a["pI"]); pkr = val(a["pKa_cadeia_lateral"]); pkr = pkr if isinstance(pkr, (int, float)) else None
    if (pkr is None) != (tr is None): erros.append(("aminoácido: cadeia lateral ionizável", ch, pkr, tr))
    pc = pI_calc(pk1, pk2, pkr, tr)
    div = abs(pc - pi) > 0.03
    if div: pi_div.append(ch)
    cls = CLS.get(val(a["classe_cadeia_lateral"])); e = val(a["essencial_humanos"]); ess = ESS.get(e, "condicional")
    if cls is None: erros.append(("aminoácido: classe", ch))
    if (ess == "sim") != bool(re.search(r"\b" + re.escape(str(en).lower()) + r"\b", frase_ess)): erros.append(("aminoácido: essencial ≠ frase da fonte", ch, e))
    c = conta_smi(smi)
    aa.append({"k": ch, "nome": nome, "a3": val(a["abreviacao_3_letras"]), "a1": val(a["abreviacao_1_letra"]), "f": f, "m": c["C"] * 12 + c["H"] + c["N"] * 14 + c["O"] * 16 + c.get("S", 0) * 32,
               "mfonte": val(a["massa_molar"]), "pk1": pk1, "pk2": pk2, "pkr": pkr, "tr": tr, "pi": pi, "pic": round(pc, 2), "div": div, "piw": val(a["pI"], 1), "cls": cls, "ess": ess, "smi": smi})
# A própria Tabela 26.1 é inconsistente em duas linhas (o pI impresso não é a média dos pKa impressos): ficam marcadas com div e fora dos exercícios de cálculo de pI.
if sorted(pi_div) != ["isoleucina", "triptofano"]: erros.append(("pI calculado ≠ pI da tabela em linhas inesperadas", pi_div))
if sum(1 for x in aa if x["ess"] == "sim") != 9: erros.append(("aminoácidos essenciais ≠ 9",))
BIO["AA"] = aa

# ---------- I04: ácidos nucleicos ----------
AN = D["acidos_nucleicos"]
def trecho_com(lista, padrao):
    """primeiro trecho de fonte do item que casa com o padrão (regex); devolve o match"""
    for e in (lista or []):
        if isinstance(e, dict):
            m = re.search(padrao, str(e.get("trecho") or ""))
            if m: return m
    return None
# base: nome, letra, SMILES (conferido com a fórmula da fonte e com o PubChem), purina/pirimidina (conferido com a frase da fonte), onde aparece
BASES_L = [["adenina", "A", "Nc1ncnc2[nH]cnc12", "purina", "purine", "DNA e RNA"], ["guanina", "G", "Nc1nc2[nH]cnc2c(=O)[nH]1", "purina", "purine", "DNA e RNA"],
           ["citosina", "C", "Nc1cc[nH]c(=O)n1", "pirimidina", "pyrimidine", "DNA e RNA"], ["timina", "T", "Cc1c[nH]c(=O)[nH]c1=O", "pirimidina", "pyrimidine", "só DNA"],
           ["uracila", "U", "O=c1cc[nH]c(=O)[nH]1", "pirimidina", "pyrimidine", "só RNA"]]
EN_B = {"adenina": "adenine", "guanina": "guanine", "citosina": "cytosine", "timina": "thymine", "uracila": "uracil"}
bases = []
for nome, letra, smi, tipo, pal, onde in BASES_L:
    b = AN["bases"][nome]; f = val(b["formula"])
    if hill(conta_smi(smi)) != f: erros.append(("base: SMILES ≠ fórmula da fonte", nome, hill(conta_smi(smi)), f))
    confere_nome(nome, EN_B[nome], smi)
    if not tem(b["purina_ou_pirimidina"], pal): erros.append(("base: purina/pirimidina sem apoio", nome))
    c = conta_smi(smi)
    bases.append({"nome": nome, "l": letra, "f": f, "m": c["C"] * 12 + c["H"] + c["N"] * 14 + c.get("O", 0) * 16, "mfonte": val(b["massa_molar"]), "tipo": tipo, "onde": onde, "smi": smi})
PB = AN["pares_de_bases"]; DF = AN["definicoes"]
at = trecho_com(PB["ligacoes_de_hidrogenio"], r"A•T base pair with (two) hydrogen bonds"); gc = trecho_com(PB["ligacoes_de_hidrogenio"], r"G•C base pair with (three) hydrogen bonds")
hel = trecho_com(DF["pares_por_volta"], r"helix is (\d+) Å wide, there are (\d+) base pairs per turn, and each turn is (\d+) Å in length")
cod = trecho_com(DF["numero_de_codons"], r"(\d+) possible triplets of the four bases in RNA, (\d+) code for specific amino acids and (\d+) code for chain termination")
atp = trecho_com(AN["ATP"]["energia_livre_de_hidrolise"], r"ΔG°' = −([\d.]+) kJ/mol")
if not (at and gc and hel and cod and atp): erros.append(("ácidos nucleicos: frase de fonte não achada", bool(at), bool(gc), bool(hel), bool(cod), bool(atp)))
else:
    BIO["DNA"] = {"hAT": 2, "hGC": 3, "largura": int(hel.group(1)), "paresVolta": int(hel.group(2)), "passo": int(hel.group(3)), "codons": int(cod.group(1)), "sentido": int(cod.group(2)), "parada": int(cod.group(3)),
                  "atpDG": float(atp.group(1)), "atpF": val(AN["ATP"]["formula"]), "atpM": val(AN["ATP"]["massa_molar"])}
    if BIO["DNA"]["codons"] != 64: erros.append(("códons", BIO["DNA"]))
BIO["BASES"] = bases

# ---------- I05: combustíveis ----------
# Entalpia padrão de combustão: só a Tabela 5.2 do OpenStax Chemistry 2e (kJ/mol), para as contas serem coerentes entre si. Densidade e octanagem (RON): caixa de dados e tabela da Wikipedia.
CBS = D["biocombustiveis"]["combustiveis"]
def com_obs(lista, palavra, un=None):
    for e in (lista or []):
        if isinstance(e, dict) and e.get("valor") is not None and palavra in str(e.get("obs") or "") and (un is None or e.get("unidade") == un): return e["valor"]
    return None
COMB_L = [["etanol", "etanol", "CCO", True, True], ["metanol", "metanol", "CO", True, False], ["metano", "metano", "C", False, True], ["hidrogenio", "hidrogênio", "[H][H]", False, False], ["isooctano", "isooctano (2,2,4-trimetilpentano)", "CC(C)CC(C)(C)C", True, False]]
comb = []
for ch, nome, smi, liquido, bio in COMB_L:
    c = CBS[ch]; dh = com_obs(c["calor_de_combustao"], "Tabela 5.2", "kJ/mol"); f = val(c["formula"]); at = conta_smi(smi)
    if dh is None or dh >= 0: erros.append(("combustível: ΔH de combustão do OpenStax não achado", ch, dh)); continue
    if hill(at) != hill(conta_f(str(f))): erros.append(("combustível: fórmula", ch, f, hill(at)))
    dens = num(c["densidade"]) if liquido else None
    if liquido and not (0.6 < dens < 0.9): erros.append(("combustível: densidade", ch, dens))
    ron = val(c.get("octanagem")); m = at.get("C", 0) * 12 + at.get("H", 0) + at.get("O", 0) * 16
    comb.append({"k": ch, "nome": nome, "f": hill(at), "m": m, "mfonte": val(c["massa_molar"]), "dh": -dh, "c": at.get("C", 0), "h": at.get("H", 0), "o": at.get("O", 0), "d": dens, "ron": ron if isinstance(ron, (int, float)) else None, "bio": bio})
BG = D["biocombustiveis"]["biogas"]; frm = str(val(D["biocombustiveis"]["fermentacao_alcoolica"]))
if not re.search(r"C6H12O6 .*→ 2 C2H5OH \+ 2 CO2", frm): erros.append(("fermentação: equação da fonte", frm))
BIO["COMB"] = comb
BIO["BIOGAS"] = {"ch4": val(BG["CH4_percentual"]), "co2": val(BG["CO2_percentual"])}
if not (isinstance(BIO["BIOGAS"]["ch4"], list) and len(comb) == 5): erros.append(("biogás/combustíveis", BIO["BIOGAS"], len(comb)))

# ---------- I06 e I07: atmosfera, ciclos e poluição ----------
# Todo número sai, por expressão regular, da frase literal guardada em dadosI.json (o padrão falha se a frase mudar).
CA = D["ciclos_e_atmosfera"]; PO = D["poluicao"]
def rx(lista, padrao, grupo=1, conv=float):
    m = trecho_com(lista, padrao)
    if not m: erros.append(("frase de fonte não achada", padrao)); return None
    return conv(m.group(grupo).replace(",", ""))
def pct(lista):
    return next((e["valor"] for e in lista if isinstance(e, dict) and e.get("unidade") == "% em volume"), None)
HB = CA["nitrogenio"]["haber_bosch"]
def gwp(g, i=0):
    v = [e["valor"] for e in PO["efeito_estufa"]["GWP100"][g] if isinstance(e, dict) and isinstance(e.get("valor"), (int, float))]
    return v[i] if len(v) > i else None
AMB = {
 "ar": {"N2": pct(CA["ar_seco"]["N2"]), "O2": pct(CA["ar_seco"]["O2"]), "Ar": pct(CA["ar_seco"]["Ar"])},
 "co2": rx(CA["carbono"]["CO2_atmosferico"], r"In (\d{4}), the concentration of carbon dioxide in the atmosphere reached (\d+) ppm", 2), "co2ano": rx(CA["carbono"]["CO2_atmosferico"], r"In (\d{4}), the concentration of carbon dioxide", 1, int),
 "co2pre": rx(CA["carbono"]["CO2_atmosferico"], r"up from (\d+) ppm"), "co2aumento": rx(CA["carbono"]["CO2_atmosferico"], r"increase of (\d+)%"),
 "haberDH": rx(HB["entalpia"], r"ΔH=−([\d.]+)kJ"), "haberMPa": rx(HB["temperatura_e_pressao"], r"\((\d+) MPa"), "haberT": rx(HB["temperatura_e_pressao"], r"and (\d+) °C"),
 "chuva": rx(PO["chuva_acida"]["pH_da_chuva_limpa"], r"slightly acidic pH of ([\d.]+)"), "chuvaAcida": rx(PO["chuva_acida"]["pH_da_chuva_limpa"], r"pH less than (\d+)"),
 "gwp": {"CO2": gwp("CO2"), "CH4": [gwp("CH4", 1), gwp("CH4", 0)], "N2O": gwp("N2O"), "CFC-12": gwp("CFC-12"), "SF6": gwp("SF6")},
 "coAfin": rx(PO["monoxido_de_carbono"]["afinidade_hemoglobina"], r"some (\d+) times greater than oxygen"),
 "o2sol20": next(e["valor"] for e in PO["oxigenio_dissolvido"]["solubilidade_O2"] if "20 °C" in str(e.get("obs"))), "o2sol0": rx(PO["oxigenio_dissolvido"]["solubilidade_O2"], r"\(([\d.]+) mg/L\) dissolves at 0 °C"),
 "montreal": rx(PO["camada_de_ozonio"]["protocolo_de_montreal"], r"agreed on 16 September (\d{4})", 1, int),
 "ozonioKm": [rx(PO["camada_de_ozonio"]["onde"], r"approximately (\d+) to (\d+) kilometers", 1), rx(PO["camada_de_ozonio"]["onde"], r"approximately (\d+) to (\d+) kilometers", 2)],
 "dboRio": rx(PO["DBO"]["valores_tipicos"], r"BOD below (\d+) mg/L"),
}
if abs(sum(AMB["ar"].values()) - 99.964) > 0.01: erros.append(("composição do ar", AMB["ar"]))
if AMB["gwp"]["CO2"] != 1 or sorted(AMB["gwp"]["CH4"]) != [27, 30] or AMB["gwp"]["N2O"] != 273: erros.append(("GWP", AMB["gwp"]))
if AMB["co2"] and abs((AMB["co2"] / AMB["co2pre"] - 1) * 100 - AMB["co2aumento"]) > 1: erros.append(("CO2: aumento não confere com a própria fonte", AMB["co2"], AMB["co2pre"], AMB["co2aumento"]))
BIO["AMB"] = AMB

# ---------- I08: química verde ----------
# Reações para a economia atômica: [nome, tipo, reagentes [(coef, fórmula)], produtos [(coef, fórmula)], índice do produto desejado]. O gerador confere o balanço de átomos
# e calcula a economia atômica (massa do produto desejado / massa de todos os reagentes), com H 1, C 12, N 14, O 16, Na 23, Cl 35,5, Ca 40, Br 80.
MA2 = {"H": 1, "C": 12, "N": 14, "O": 16, "Na": 23, "Cl": 35.5, "Ca": 40, "Br": 80, "S": 32}
def massa_f(f): return sum(MA2[a] * q for a, q in conta_f(f).items())
VERDE_L = [
 ["bromação do eteno", "adição", [(1, "C2H4"), (1, "Br2")], [(1, "C2H4Br2")], 0],
 ["hidrogenação do eteno", "adição", [(1, "C2H4"), (1, "H2")], [(1, "C2H6")], 0],
 ["síntese da amônia", "síntese", [(1, "N2"), (3, "H2")], [(2, "NH3")], 0],
 ["cloração do metano", "substituição", [(1, "CH4"), (1, "Cl2")], [(1, "CH3Cl"), (1, "HCl")], 0],
 ["desidratação do etanol", "eliminação", [(1, "C2H6O")], [(1, "C2H4"), (1, "H2O")], 0],
 ["esterificação", "substituição", [(1, "C2H4O2"), (1, "C2H6O")], [(1, "C4H8O2"), (1, "H2O")], 0],
 ["fermentação da glicose", "decomposição", [(1, "C6H12O6")], [(2, "C2H6O"), (2, "CO2")], 0],
 ["calcinação do calcário", "decomposição", [(1, "CaCO3")], [(1, "CaO"), (1, "CO2")], 0],
 ["saponificação do etanoato de etila", "substituição", [(1, "C4H8O2"), (1, "NaOH")], [(1, "C2H3O2Na"), (1, "C2H6O")], 0],
]
verde = []
for nome, tipo, reag, prod, k in VERDE_L:
    e, d = Counter(), Counter()
    for c, f in reag:
        for a, q in conta_f(f).items(): e[a] += c * q
    for c, f in prod:
        for a, q in conta_f(f).items(): d[a] += c * q
    if e != d: erros.append(("química verde: equação não balanceada", nome, dict(e), dict(d)))
    mr = sum(c * massa_f(f) for c, f in reag); mp = prod[k][0] * massa_f(prod[k][1])
    verde.append({"nome": nome, "tipo": tipo, "r": [[c, f] for c, f in reag], "p": [[c, f] for c, f in prod], "k": k, "mr": mr, "mp": mp, "ea": round(100 * mp / mr, 4)})
QV = D["quimica_verde"]
if not tem(QV["economia_atomica"]["formula"], "molecular weight of desired product", "all reactants"): erros.append(("economia atômica: fórmula da fonte",))
if not tem(QV["fator_E"]["definicao"], "mass of waste per mass of product"): erros.append(("fator E: definição da fonte",))
cmc = trecho_com(QV["concentracao_micelar_critica"], r"sodium dodecyl sulfate in water .* is 8×10−3 mol/L")
sds = pubchem("sodium dodecyl sulfate")
if not cmc or not sds or hill(conta_f(sds["formula"])) != hill(conta_f("C12H25NaO4S")): erros.append(("SDS: CMC ou fórmula", bool(cmc), sds))
BIO["VERDE"] = verde
BIO["QV"] = {"ano": 1998, "cmcSDS": 8e-3, "mSDS": 12 * 12 + 25 + 23 + 64 + 32, "principios": len(QV["doze_principios"])}
if not tem(QV["autores_e_ano"], "1998", "Anastas") or BIO["QV"]["principios"] != 12: erros.append(("química verde: autores, ano ou nº de princípios",))
#MAIS-SECOES

json.dump(cache, open(ARQ, "w"), ensure_ascii=False, indent=1)   # todas as consultas ao PubChem, de todas as seções
J = lambda o: json.dumps(o, ensure_ascii=False)
linhas = []
for k, v in BIO.items():
    if isinstance(v, list): linhas.append(f"    {k}: [\n" + "\n".join("      " + J(x) + "," for x in v) + "\n    ],")
    else: linhas.append(f"    {k}: {J(v)},")
bloco = "/*BIO-INI*/ /* GERADO por tools/quimica/gera-bio.py a partir de tools/quimica/dadosI.json: não editar à mão */\n  SIM.BIO = {\n" + "\n".join(linhas) + "\n  };\n  /*BIO-FIM*/"
arq = os.path.join(RAIZ, "assets", "sims", "quimica", "bio.js")
t = open(arq, encoding="utf-8").read()
assert "/*BIO-INI*/" in t
t = re.sub(r"/\*BIO-INI\*/.*?/\*BIO-FIM\*/", lambda _: bloco, t, flags=re.S)
print({k: (len(v) if hasattr(v, "__len__") else v) for k, v in BIO.items()})
print("ERROS", len(erros)); [print("  ", e) for e in erros]
if not erros: open(arq, "w", encoding="utf-8").write(t)
sys.exit(1 if erros else 0)
