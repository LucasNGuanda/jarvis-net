#!/usr/bin/env python3
"""Gera SIM.ANA (tabelas do módulo J da Química: analítica e coordenação) em assets/sims/quimica/analitica.js, entre /*ANA-INI*/ e /*ANA-FIM*/,
a partir de tools/quimica/dadosJ.json. Nada de memória: números vêm de dadosJ.json; o que é escrito à mão aqui (traduções de cores, nomes em português)
só entra se a palavra-chave em inglês estiver no trecho da fonte (função exige). Com qualquer erro, não grava. Uso: python3 tools/quimica/gera-analitica.py"""
import json, os, re, sys
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
D = json.load(open(os.path.join(RAIZ, "tools", "quimica", "dadosJ.json"), encoding="utf-8"))
erros = []; ANA = {}
def itens(x): return [e for e in (x or []) if isinstance(e, dict) and e.get("valor") is not None]
def val(x, i=0):
    v = itens(x); return v[i]["valor"] if len(v) > i else None
def texto(x): return " ".join(str(e.get("trecho") or "") + " " + str(e.get("valor") or "") for e in itens(x))
def exige(x, *palavras, onde=""):
    t = texto(x).lower()
    for p in palavras:
        if p.lower() not in t: erros.append(("palavra não está na fonte", onde, p)); return False
    return True
def rx(x, padrao, grupo=1, conv=float, onde=""):
    m = re.search(padrao, texto(x))
    if not m: erros.append(("frase de fonte não achada", onde, padrao)); return None
    return conv(m.group(grupo))

# ---------- J01: chama, solubilidade, precipitados, grupos ----------
CH = D["testes_de_chama"]["cores"]
# elemento: [chave em dadosJ, cor em português, palavra que tem de estar na fonte]
CHAMA_L = [["Li", "Li", "vermelho-carmim", "carmine red"], ["Na", "Na", "amarelo intenso", "yellow"], ["K", "K", "lilás", "lilac"], ["Rb", "Rb", "vermelho-violeta", "violet red"], ["Cs", "Cs", "azul-violeta", "blue-violet"],
           ["Ca", "Ca", "vermelho-tijolo (alaranjado)", "brick"], ["Sr", "Sr", "vermelho-carmesim", "crimson"], ["Ba", "Ba", "verde-maçã claro", "apple green"], ["Cu", "Cu_II_sem_haleto", "verde", "green"], ["B", "B", "verde vivo", "bright green"], ["Pb", "Pb", "branco-azulado", "blue-white"]]
chama = []
for el, ch, cor, pal in CHAMA_L:
    if exige(CH[ch], pal, onde="chama " + el): chama.append({"el": el, "cor": cor})
exige(D["testes_de_chama"]["vidro_de_cobalto"], "cobalt blue glass", onde="vidro de cobalto")
ANA["CHAMA"] = chama

PC = D["solubilidade"]["pares_cation_anion"]
CAT = ["Na+", "K+", "NH4+", "Mg2+", "Ca2+", "Ba2+", "Al3+", "Fe2+", "Fe3+", "Cu2+", "Zn2+", "Ag+", "Pb2+"]
AN = ["Cl-", "Br-", "I-", "SO4 2-", "CO3 2-", "OH-", "S2-", "NO3-", "PO4 3-"]
sol = {}
for c in CAT:
    sol[c] = {}
    for a in AN:
        v = val(PC[c][a]); v = str(v) if v is not None else None
        if v is None or not re.fullmatch(r"S|sS|I|R|\?", v.strip()): erros.append(("solubilidade: código inesperado", c, a, v)); continue
        sol[c][a] = v.strip()
ANA["SOL"] = sol
if not exige(D["solubilidade"]["tabela_wikipedia_legenda"], "0.1", "20 g/L", onde="legenda da tabela de solubilidade"): pass

P = D["precipitados"]
# fórmula: [cátion, ânion (para ligar com a tabela SOL; None se não é par simples), cor em português, palavra da fonte]
PREC_L = [["AgCl", "Ag+", "Cl-", "branco", "white"], ["AgBr", "Ag+", "Br-", "amarelo-claro", "pale yellow"], ["AgI", "Ag+", "I-", "amarelo", "yellow"], ["PbCl2", "Pb2+", "Cl-", "branco", "white"], ["PbI2", "Pb2+", "I-", "amarelo vivo", "bright yellow"],
          ["PbSO4", "Pb2+", "SO4 2-", "branco", "white"], ["BaSO4", "Ba2+", "SO4 2-", "branco", "white"], ["CaCO3", "Ca2+", "CO3 2-", "branco", "white"], ["Fe(OH)3", "Fe3+", "OH-", "castanho-avermelhado", "reddish-brown"],
          ["Fe(OH)2", "Fe2+", "OH-", "esverdeado", "green"], ["Cu(OH)2", "Cu2+", "OH-", "azul", "blue"], ["Al(OH)3", "Al3+", "OH-", "branco", "white"], ["Zn(OH)2", "Zn2+", "OH-", "branco", "white"], ["Mg(OH)2", "Mg2+", "OH-", "branco", "white"],
          ["CuS", "Cu2+", "S2-", "preto", "black"], ["PbS", "Pb2+", "S2-", "preto", "black"], ["Ag2S", "Ag+", "S2-", "preto-acinzentado", "blackish"], ["PbCrO4", "Pb2+", None, "amarelo vivo", "bright yellow"], ["BaCrO4", "Ba2+", None, "amarelo", "yellow"],
          ["Ag2CrO4", "Ag+", None, "vermelho-tijolo", "brick-red"], ["CdS", None, None, "amarelo-alaranjado", "yellow-orange"]]
G3 = D["marcha_de_cations"]["grupo_3"]["como_distinguir"]
prec = []
for f, c, a, cor, pal in PREC_L:
    fonte_cor = list(P[f].get("cor") or []) + (G3 if f == "Fe(OH)3" else [])
    if not exige(fonte_cor, pal, onde="cor de " + f): continue
    k = val(P[f].get("kps"))
    prec.append({"f": f, "c": c, "a": a, "cor": cor, "kps": k if isinstance(k, (int, float)) else None})
ANA["PREC"] = prec

M = D["marcha_de_cations"]
GR = [["grupo_1", 1, "cloretos insolúveis", "HCl diluído", ["Ag+", "Hg2 2+", "Pb2+"], ["insoluble chlorides", "Ag+", "Pb2+"]],
      ["grupo_2", 2, "sulfetos insolúveis em meio ácido", "H₂S em meio ácido", ["Cu2+", "Cd2+", "Bi3+", "Hg2+", "Sn2+", "As3+", "Sb3+"], ["acid-insoluble sulfides", "Cu2+", "Cd2+"]],
      ["grupo_3", 3, "hidróxidos insolúveis", "NH₃ com NH₄Cl", ["Fe2+", "Fe3+", "Al3+", "Cr3+"], ["hydroxides", "Fe3+", "Al3+", "Cr3+"]],
      ["grupo_4", 4, "sulfetos que precipitam em pH 9", "H₂S em meio amoniacal (pH 9)", ["Zn2+", "Ni2+", "Co2+", "Mn2+"], ["sulfides at pH 9", "Zn2+", "Mn2+"]],
      ["grupo_5", 5, "carbonatos insolúveis", "(NH₄)₂CO₃", ["Ba2+", "Ca2+", "Sr2+"], ["carbonates", "Ba2+", "Sr2+"]],
      ["grupo_6_soluveis", 6, "ficam em solução", "nenhum (teste de chama)", ["Mg2+", "Li+", "Na+", "K+"], ["sixth", "Mg2+", "K+"]]]
grupos = []
for ch, n, oq, reag, cats, pal in GR:
    g = M[ch]; fonte = list(g["reagente_e_o_que_precipita"]) + list(g["cations"])
    if exige(fonte, *pal, onde="grupo %d" % n): grupos.append({"n": n, "oq": oq, "reag": reag, "cats": cats})
ANA["GRUPOS"] = grupos
exige(M["visao_geral_dos_grupos"], "six groups", onde="número de grupos")
TA = M["testes_de_anions"]
for ch, pal in [("cloreto_brometo_iodeto_com_AgNO3", ["silver nitrate"]), ("sulfato_com_BaCl2", ["white precipitate of BaSO4"]), ("carbonato_com_acido", ["effervescence", "limewater milky"]), ("sulfeto", ["rotten egg"]), ("nitrato_anel_marrom", ["FeSO4"])]:
    exige(TA[ch], *pal, onde="teste de ânion " + ch)
TG = M["testes_de_gases"]
for ch, pal in [("hidrogenio", ["pop"]), ("oxigenio", ["glowing splint"]), ("gas_carbonico", ["limewater", "milky"]), ("amonia", ["red litmus paper blue"])]:
    exige(TG[ch], *pal, onde="teste de gás " + ch)
# ---------- J02: gravimetria ----------
GV = D["gravimetria"]; MMJ = GV["massas_molares"]; EXG = GV["exemplos"]
_r = open(os.path.join(RAIZ, "assets", "sims", "quimica", "reacoes.js"), encoding="utf-8").read()
MA = {k: float(v) for k, v in re.findall(r"([A-Z][a-z]?): ([\d.]+)", re.search(r"SIM\.MA = \{(.*?)\}", _r).group(1))}
def mm(f):
    """massa molar com as massas arredondadas do site (SIM.MA); aceita parênteses"""
    def conta(s):
        tot = {}; i = 0
        while i < len(s):
            if s[i] == "(":
                j = i; n = 0
                while True:
                    n += s[j] == "("; n -= s[j] == ")"
                    if n == 0: break
                    j += 1
                m = re.match(r"\d*", s[j + 1:]); k = int(m.group() or 1)
                for e, q in conta(s[i + 1:j]).items(): tot[e] = tot.get(e, 0) + q * k
                i = j + 1 + len(m.group())
            else:
                m = re.match(r"([A-Z][a-z]?)(\d*)", s[i:]); tot[m.group(1)] = tot.get(m.group(1), 0) + int(m.group(2) or 1); i += len(m.group())
        return tot
    return round(sum(MA[e] * q for e, q in conta(f).items()), 4)
def mpub(ch, onde):
    """massa molar da fonte (PubChem ou caixa de dados); confere a arredondada do site contra ela (0,3%)"""
    v = [e["valor"] for e in itens(MMJ[ch]["massa_molar"]) if isinstance(e["valor"], (int, float))]
    if not v: erros.append(("sem massa molar na fonte", onde)); return None
    return v[0]
# id, analito (nome), fórmula do analito, sólido pesado, chave da massa molar, mol de analito por mol de sólido, reagente, cor do sólido (ou None), [fonte, palavras]
GRAV_L = [["cl", "cloreto", "Cl", "AgCl", "AgCl", 1, "AgNO₃ em excesso", "branco", [EXG["cloreto_ou_prata_como_AgCl"], ["weighing the precipitated AgCl"]]],
          ["ag", "prata", "Ag", "AgCl", "AgCl", 1, "cloreto em excesso", "branco", [EXG["cloreto_ou_prata_como_AgCl"], ["silver ions can be quantified"]]],
          ["so4", "sulfato", "SO4", "BaSO4", "BaSO4", 1, "BaCl₂ em excesso", "branco", [EXG["sulfato_como_BaSO4"], ["gravimetric analysis of sulfate", "whitish"]]],
          ["ni", "níquel", "Ni", "Ni(C4H7N2O2)2", "Ni(C4H7N2O2)2_dimetilglioximato_de_niquel", 1, "dimetilglioxima", "vermelho vivo", [EXG["niquel_com_dimetilglioxima"], ["bright red precipitate", "gravimetric analysis of nickel"]]],
          ["ca", "cálcio", "Ca", "CaO", "CaO", 1, "ácido oxálico; depois, calcinação", None, [list(EXG["calcio_como_oxalato"]) + list(GV["etapas"]["calcinacao"]), ["calcium oxalate", "converts to calcium oxide"]]]]
grav = []
for i, nome, fa, fp, ch, n, reag, cor, (fonte, pal) in GRAV_L:
    if not exige(fonte, *pal, onde="gravimetria " + i): continue
    M = mpub(ch, "M de " + fp); m = mm(fp)
    if M is None: continue
    if abs(m - M) / M > 0.003: erros.append(("massa arredondada longe da fonte", fp, m, M)); continue
    grav.append({"id": i, "nome": nome, "fa": fa, "fp": fp, "n": n, "reag": reag, "cor": cor, "M": M})
ANA["GRAV"] = grav
# massas molares da fonte para os outros compostos usados no tema (cada uma conferida contra a arredondada do site)
for f, ch in [("CaC2O4", "CaC2O4"), ("CaCO3", "CaCO3"), ("PbCrO4", "PbCrO4"), ("NaCl", "NaCl"), ("KCl", "KCl"), ("BaCl2", "BaCl2"), ("Na2SO4", "Na2SO4"), ("AgNO3", "AgNO3"), ("CO2", "CO2"), ("H2O", "H2O"), ("Fe2O3", "Fe2O3"), ("Al2O3", "Al2O3"), ("Mg2P2O7", "Mg2P2O7")]:
    M = mpub(ch, "M de " + f)
    if M is not None and abs(mm(f) - M) / M > 0.004: erros.append(("massa arredondada longe da fonte", f, mm(f), M))
# hidrato do cloreto de bário: a caixa de dados traz as duas massas (anidro e di-hidratado)
bh = [e["valor"] for e in itens(MMJ["BaCl2"]["massa_molar"])]
if not (208.23 in bh and 244.26 in bh): erros.append(("BaCl2: massas do anidro e do hidrato não achadas", bh))
if abs((244.26 - 208.23) / 18.015 - 2) > 0.01: erros.append(("BaCl2: o hidrato da fonte não é di-hidratado",))
ANA["HIDRATO"] = {"f": "BaCl2", "x": 2, "Manidro": 208.23, "Mhidrato": 244.26}
# exemplo 4.15 do OpenStax (MgSO4 como BaSO4) e 4.16 (polietileno): refaz as contas e compara com a resposta do livro
e15 = texto(EXG["sulfato_como_BaSO4"]); r15 = 0.6168 / 233.43 * 120.37
if not ("0.4550-g" in e15 and "0.6168 g of BaSO4" in e15 and "0.3181g MgSO4" in e15 and abs(r15 - 0.3181) < 2e-4 and abs(100 * r15 / 0.4550 - 69.91) < 0.03): erros.append(("exemplo 4.15 não confere", r15))
e16 = texto(GV["analise_por_combustao"]["exemplo_openstax"]); nC = 0.00394 / 44.01; nH = 2 * 0.00161 / 18.02
if not ("0.00126-g" in e16 and "0.00394 g of CO2" in e16 and "0.00161 g of H2O" in e16 and "CH2" in e16 and abs(nH / nC - 2) < 0.01): erros.append(("exemplo 4.16 não confere", nC, nH))
ANA["OPENSTAX"] = {"e415": {"amostra": 0.4550, "BaSO4": 0.6168, "MgSO4": 0.3181, "pct": 69.91, "M_BaSO4": 233.43, "M_MgSO4": 120.37}, "e416": {"amostra": 0.00126, "CO2": 0.00394, "H2O": 0.00161, "formula": "CH2"}}
for ch, pal in [("requisitos_do_precipitado", ["nonhygroscopic", "high molecular weight", "selective"]), ("digestao", ["purer and larger"]), ("filtracao_secagem_pesagem", ["filtration, carefully dried, and then weighed"]), ("precipitacao", ["homogeneous precipitation"])]:
    exige(GV["etapas"][ch], *pal, onde="etapas " + ch)
exige(GV["vantagens_e_limites"], "six figure accuracy", "occlusions", "spectroscopic methods", onde="vantagens e limites")
AC = GV["analise_por_combustao"]
exige(AC["trem_de_combustao"], "Copper(II) oxide", "magnesium perchlorate or calcium chloride", "potassium hydroxide", onde="trem de combustão")
exige(AC["historia"], "Gay-Lussac", "Liebig", "1822", onde="história da combustão")
exige(AC["o_que_se_pesa"], "mass increase of each device", "1/2 equivalent of water", onde="o que se pesa")
exige(GV["exemplos"]["volatilizacao_agua_e_CO2"], "water and carbon dioxide", onde="volatilização")
exige(GV["tipos"], "precipitation, volatilization", onde="tipos")
# ---------- J03: volumetria ----------
VO = D["volumetria"]; INDS = VO["indicadores"]
CORPT = {"red": "vermelho", "yellow": "amarelo", "blue": "azul", "colorless": "incolor", "purple-pink": "rosa"}
IND_L = [["alaranjado_de_metila", "alaranjado de metila"], ["verde_de_bromocresol", "verde de bromocresol"], ["vermelho_de_metila", "vermelho de metila"], ["azul_de_bromotimol", "azul de bromotimol"], ["vermelho_de_fenol", "vermelho de fenol"], ["fenolftaleina", "fenolftaleína"], ["timolftaleina", "timolftaleína"]]
ind = []
for ch, nome in IND_L:
    e = INDS[ch]; fx = val(e["faixa_de_pH"]); c1 = val(e["cor_em_pH_baixo"]); c2 = val(e["cor_em_pH_alto"])
    if isinstance(fx, str): fx = json.loads(fx)
    if not (isinstance(fx, list) and len(fx) == 2 and fx[0] < fx[1] and c1 in CORPT and c2 in CORPT): erros.append(("indicador com dado inesperado", ch, fx, c1, c2)); continue
    ind.append({"id": ch, "nome": nome, "lo": fx[0], "hi": fx[1], "c1": CORPT[c1], "c2": CORPT[c2]})
ANA["IND"] = ind
exige(INDS["escolha_do_indicador"], "Phenolphthalein", "brackets the abrupt change", "methyl orange", "well before the equivalence point", onde="escolha do indicador")
KAJ = VO["constantes_de_acidez"]
ANA["KA"] = {"acetico": val(KAJ["acido_acetico_Ka"]), "formico": val(KAJ["acido_formico_Ka"]), "HF": val(KAJ["HF_Ka"]), "amonia_Kb": val(KAJ["amonia_Kb"])}
if any(not isinstance(v, float) or not (1e-6 < v < 1e-2) for v in ANA["KA"].values()): erros.append(("Ka fora do esperado", ANA["KA"]))
RDX = VO["redox"]; PT = RDX["potenciais_padrao"]
ANA["EPOT"] = {"MnO4": val(PT["MnO4-/Mn2+"]), "Fe": val(PT["Fe3+/Fe2+"]), "I2": val(PT["I2/I-"]), "S4O6": val(PT["S4O6 2-/S2O3 2-"])}
if not (ANA["EPOT"]["MnO4"] == 1.507 and ANA["EPOT"]["Fe"] == 0.771 and ANA["EPOT"]["I2"] == 0.5355 and ANA["EPOT"]["S4O6"] == 0.08): erros.append(("potenciais inesperados", ANA["EPOT"]))
PRC = VO["precipitacao"]; CPX = VO["complexometria"]; PM = RDX["permanganometria"]; IO = RDX["iodometria"]
# id, analito, titulante, concentração do titulante (mol/L, escolha do laboratório), mol de analito : mol de titulante, tipo, Ka, indicador fixo, cor antes, cor depois, equação, [fonte, palavras]
TIT_L = [["hcl", "HCl", "NaOH", 0.1, 1, 1, "ab", None, None, None, None, "HCl + NaOH → NaCl + H₂O", [VO["definicoes"]["titulacao_acido_base"], ["neutralizing"]]],
         ["hac", "ácido acético", "NaOH", 0.1, 1, 1, "ab", "acetico", None, None, None, "CH₃COOH + NaOH → CH₃COONa + H₂O", [VO["definicoes"]["titulacao_acido_base"], ["neutralizing"]]],
         ["fe", "Fe²⁺ (em meio ácido)", "KMnO₄", 0.02, 5, 1, "redox", None, "o próprio permanganato", "sem cor de permanganato", "lilás claro", "MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O", [list(PM["definicao"]) + list(PM["semirreacao_meio_acido"]) + list(PM["cores"]), ["iron(II)", "8 H+ + 5 e−", "light shade of purple", "purple in colour"]]],
         ["cl", "Cl⁻ (meio quase neutro)", "AgNO₃", 0.1, 1, 1, "prec", None, "cromato de potássio (método de Mohr)", "branco", "vermelho", "Ag⁺ + Cl⁻ → AgCl(s)", [list(PRC["argentometria"]) + list(PRC["mohr"]), ["Ag+(aq) + Cl−(aq) → AgCl(s)", "red silver chromate", "near neutral"]]],
         ["ca", "Ca²⁺ (tampão de pH 10)", "EDTA", 0.01, 1, 1, "comp", None, "negro de eriocromo T", "vermelho", "azul", "Ca²⁺ + EDTA → complexo 1 : 1", [list(CPX["EDTA_razao_1_para_1"]) + list(CPX["negro_de_eriocromo_T"]["cores"]) + list(CPX["EDTA_dissodico_e_pH"]), ["M2+ + H4Y", "turns red when it forms a complex with calcium", "blue end-point", "basic buffer", "pH 10"]]],
         ["i2", "I₂", "Na₂S₂O₃", 0.1, 1, 2, "redox", None, "amido", "azul-escuro", "incolor", "I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻", [list(IO["reacao"]) + list(IO["amido_e_cor"]), ["2 S2O32− + I2 → S4O62− + 2 I−", "dark blue to colorless"]]]]
tit = []
for i, an, ti, ct, a, t_, tipo, ka, indf, c1, c2, eq, (fonte, pal) in TIT_L:
    if exige(fonte, *pal, onde="titulação " + i): tit.append({"id": i, "an": an, "tit": ti, "ct": ct, "a": a, "t": t_, "tipo": tipo, "Ka": ANA["KA"][ka] if ka else None, "ind": indf, "c1": c1, "c2": c2, "eq": eq})
ANA["TIT"] = tit
# balanço da equação do permanganato com o ferro (átomos e carga) e número de elétrons das duas semirreações
if not (-1 + 5 * 2 + 8 == 2 + 5 * 3 and 4 == 4 and 8 == 2 * 4 and 5 * 1 == 5): erros.append(("permanganato × ferro: balanço",))
exige(PM["exemplo_openstax"], "2MnO4−(aq)+5H2C2O4(aq)+6H+(aq)⟶10CO2(g)+2Mn2+(aq)+8H2O(l)", onde="permanganato × oxálico")
exige(IO["usos"], "2 Cu2+ + 4 I− → 2 CuI + I2", "active chlorine", onde="iodometria: usos")
exige(PRC["volhard"], "back titration", "excess silver nitrate", "thiocyanate", "blood-red", onde="Volhard")
exige(PRC["fajans"], "green suspension turning pink", onde="Fajans")
exige(RDX["dicromatometria"], "yellow-orange for Cr(VI) to green for Cr(III)", onde="dicromato")
exige(CPX["EDTA_hexadentado"], "hexadentate", onde="EDTA hexadentado"); exige(CPX["dureza_da_agua"], "total hardness of water", "calcium and magnesium", onde="dureza")
DF = VO["definicoes"]
exige(DF["ponto_final"], "indicator changes color", "not necessarily be the same", onde="ponto final"); exige(DF["ponto_de_equivalencia"], "chemically equivalent quantities", onde="equivalência")
exige(DF["padrao_primario"], "High purity", "Low hygroscopicity", "High equivalent weight", onde="padrão primário")
exige(DF["padrao_primario_exemplos"], "Potassium hydrogen phthalate", "Sodium carbonate for standardisation of aqueous acids", "Sodium chloride for standardisation of silver nitrate", onde="exemplos de padrão primário")
exige(DF["titulacao_de_retorno"], "known excess of standard reagent", onde="retorno"); exige(DF["bureta"], "graduated glass tube", onde="bureta")
kh = DF["padrao_primario_KHP"]; Mk = val(kh["massa_molar"]); fk = val(kh["formula"])
if not (fk == "C8H5KO4" and Mk == 204.222 and abs(mm(fk) - Mk) / Mk < 0.003): erros.append(("KHP: fórmula ou massa molar", fk, Mk))
ANA["KHP"] = {"f": fk, "M": Mk}
Me = [e["valor"] for e in itens(CPX["EDTA_massa_molar"])][0]
if abs(Me - 292.244) > 0.01: erros.append(("EDTA: massa molar", Me))
e14 = texto(VO["exemplo_openstax_4_14"]); r14 = 35.23 * 0.250 / 50.00
if not ("50.00-mL" in e14 and "35.23 mL of 0.250 M NaOH" in e14 and abs(r14 - val(VO["exemplo_openstax_4_14"], 1)) < 6e-4): erros.append(("exemplo 4.14 não confere", r14))
ANA["OPENSTAX"]["e414"] = {"Va": 50.00, "Vt": 35.23, "Ct": 0.250, "Ca": val(VO["exemplo_openstax_4_14"], 1)}
#MAIS-SECOES

J = lambda o: json.dumps(o, ensure_ascii=False)
linhas = []
for k, v in ANA.items():
    if isinstance(v, list): linhas.append(f"    {k}: [\n" + "\n".join("      " + J(x) + "," for x in v) + "\n    ],")
    else: linhas.append(f"    {k}: {J(v)},")
bloco = "/*ANA-INI*/ /* GERADO por tools/quimica/gera-analitica.py a partir de tools/quimica/dadosJ.json: não editar à mão */\n  SIM.ANA = {\n" + "\n".join(linhas) + "\n  };\n  /*ANA-FIM*/"
arq = os.path.join(RAIZ, "assets", "sims", "quimica", "analitica.js")
t = open(arq, encoding="utf-8").read(); assert "/*ANA-INI*/" in t
t = re.sub(r"/\*ANA-INI\*/.*?/\*ANA-FIM\*/", lambda _: bloco, t, flags=re.S)
print({k: len(v) for k, v in ANA.items()}); print("ERROS", len(erros)); [print("  ", e) for e in erros]
if not erros: open(arq, "w", encoding="utf-8").write(t)
sys.exit(1 if erros else 0)
