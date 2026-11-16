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
def confere_nome(pt, en, smi):
    r = pubchem(en)
    if r is None: erros.append(("PubChem sem resposta", pt, en)); return
    if plano(r["smiles"]) != plano(smi): erros.append(("PubChem difere", pt, en, r["smiles"], smi))

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
#MAIS-SECOES

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
