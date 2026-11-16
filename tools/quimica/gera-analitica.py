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
