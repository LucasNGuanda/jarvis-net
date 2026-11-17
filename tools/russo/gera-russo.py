#!/usr/bin/env python3
"""Gera assets/sims/russo/dados.js (SIM.RU) a partir de tools/russo/dadosR.json.

Regra: nada de memória. Letra, nome, som, transliteração, acento, pronúncia, classe e gênero são copiados do JSON
(Wikipedia e Wiktionary em inglês, com trecho). O que é escrito à mão aqui é só:
  (1) a tradução para o português, e cada tradução exige uma palavra em inglês que tem de estar na definição da fonte;
  (2) a escolha de QUAL entrada do verbete usar (classe gramatical + palavra-chave da definição);
  (3) as listas de palavras dos laboratórios (seleção didática);
  (4) a tabela de letras cirílicas com forma igual à de uma letra latina (comparação de forma, apoio de memória).
Com qualquer erro, não grava. Uso: python3 tools/russo/gera-russo.py [--frouxo]  (--frouxo: palavra sem verbete vira aviso)."""
import json, re, sys, os
R = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(R, "dadosR.json"), encoding="utf-8"))
FROUXO = "--frouxo" in sys.argv
erros, avisos = [], []
def v(o):
    return o.get("valor") if isinstance(o, dict) and "valor" in o else o
def limpa(s):
    return re.sub(r"\s+", " ", s).strip() if isinstance(s, str) else s

# ---------- (4) forma igual à de uma letra latina (maiúscula de imprensa) ----------
FORMA = {"А": "A", "В": "B", "Е": "E", "К": "K", "М": "M", "Н": "H", "О": "O", "Р": "P", "С": "C", "Т": "T", "У": "Y", "Х": "X"}

# ---------- (1) tradução dos exemplos da tabela do alfabeto: definição em inglês da fonte -> português ----------
EX_PT = {"two": "dois", "both": "ambos", "water": "água", "year": "ano", "yes": "sim", "not": "não", "hedgehog": "ouriço", "beetle": "besouro",
         "heat": "calor forte", "or": "ou", "my, mine": "meu", "who": "quem", "ray": "raio (de luz)", "sword": "espada", "but": "mas", "he": "ele",
         "under": "debaixo de", "river": "rio", "if": "se", "that": "aquele", "bush": "arbusto", "fairy": "fada", "spirit": "espírito", "end": "fim",
         "hour": "hora", "yours": "de vocês (seu)", "cheek": "bochecha", "object": "objeto", "you": "tu, você", "goose": "ganso", "this": "isto",
         "south": "sul", "row": "fileira"}
TIPO = {"vogal": "vogal", "consoante": "consoante", "semivogal / consoante": "semivogal", "sinal": "sinal"}

ALF = []
for l in D["alfabeto"]["letras"]:
    M, m = v(l["maiuscula"]), v(l["minuscula"])
    trs = limpa(v(l["transliteracao_comum"]))
    vari = [x.strip() for x in trs.split(",")]
    tipo = TIPO.get(v(l["classificacao"]))
    if not tipo: erros.append(f"letra {M}: classificação desconhecida {v(l['classificacao'])!r}")
    lat = FORMA.get(M)
    grupo = "nova" if not lat else ("amiga" if lat.lower() in vari else "falsa")
    ex = limpa(v(l["exemplo"])); e = None
    if ex:
        mm = re.match(r'^([Ѐ-ӿ́ ]+?)\s+([^Ѐ-ӿ"]+?)\s*"\s*(.+?)\s*"$', ex)
        if not mm: erros.append(f"letra {M}: exemplo não entendido {ex!r}")
        else:
            ru, tr, en = mm.group(1).replace(" ", ""), mm.group(2).strip(), mm.group(3).strip()
            if en not in EX_PT: erros.append(f"letra {M}: falta a tradução de {en!r}")
            if m not in ru.lower(): erros.append(f"letra {M}: o exemplo {ru!r} não tem a letra")
            e = {"ru": ru, "tr": tr, "en": en, "pt": EX_PT.get(en)}
    nome = limpa(v(l["nome_russo"])); nomeTr = limpa(v(l.get("nome_transliterado")))
    ALF.append({"n": l["ordem"], "M": M, "m": m, "nome": nome, "nomeTr": nomeTr, "nomeIpa": limpa(v(l.get("nome_ipa"))), "ipa": limpa(v(l["ipa"])), "trs": trs, "tr": vari[0],
                "tipo": tipo, "dm": v(l.get("dura_mole")), "grupo": grupo, "lat": lat, "ex": e})
if len(ALF) != 33: erros.append(f"alfabeto com {len(ALF)} letras")
cont = {t: sum(1 for x in ALF if x["tipo"] == t) for t in ("vogal", "consoante", "semivogal", "sinal")}
if cont != {"vogal": 10, "consoante": 20, "semivogal": 1, "sinal": 2}: erros.append(f"contagem por tipo {cont} diferente da frase de abertura (10 vogais, 20 consoantes, 1 semivogal, 2 sinais)")

# ---------- (2) palavras: [palavra, classe da fonte, palavra-chave em inglês que tem de estar na definição, tradução] ----------
ESC = [
 ["мама", "Noun", "mom", "mamãe"], ["папа", "Noun", "dad", "papai"], ["да", "Adverb", "yes", "sim"], ["нет", "Interjection", "no", "não"],
 ["дом", "Noun", "house", "casa"], ["кот", "Noun", "tomcat", "gato"], ["окно", "Noun", "window", "janela"], ["молоко", "Noun", "milk", "leite"],
 ["вода", "Noun", "water", "água"], ["хлеб", "Noun", "bread", "pão"], ["чай", "Noun", "tea", "chá"], ["книга", "Noun", "book", "livro"],
 ["стол", "Noun", "table", "mesa"], ["стул", "Noun", "chair", "cadeira"], ["город", "Noun", "city", "cidade"], ["улица", "Noun", "street", "rua"],
 ["школа", "Noun", "school", "escola"], ["друг", "Noun", "friend", "amigo"], ["брат", "Noun", "brother", "irmão"], ["сестра", "Noun", "sister", "irmã"],
 ["сын", "Noun", "son", "filho"], ["дочь", "Noun", "daughter", "filha"], ["мать", "Noun", "mother", "mãe"], ["отец", "Noun", "father", "pai"],
 ["день", "Noun", "day", "dia"], ["ночь", "Noun", "night", "noite"], ["утро", "Noun", "morning", "manhã"], ["вечер", "Noun", "evening", "noite (o começo dela)"],
 ["год", "Noun", "year", "ano"], ["время", "Noun", "time", "tempo"], ["человек", "Noun", "person", "pessoa"], ["жизнь", "Noun", "life", "vida"],
 ["рука", "Noun", "hand", "mão"], ["слово", "Noun", "word", "palavra"], ["место", "Noun", "place", "lugar"], ["лицо", "Noun", "face", "rosto"],
 ["работа", "Noun", "work", "trabalho"], ["язык", "Noun", "tongue", "língua"], ["Россия", "Proper noun", "Russia", "Rússia"],
 ["Москва", "Proper noun", "Moscow", "Moscou"], ["Бразилия", "Proper noun", "Brazil", "Brasil"], ["спасибо", "Interjection", "thank you", "obrigado"],
 ["пожалуйста", "Interjection", "please", "por favor"], ["привет", "Interjection", "hello", "oi"], ["здравствуйте", "Interjection", "hello", "olá (formal)"],
 ["хорошо", "Adverb", "well", "bem"], ["плохо", "Adverb", "badly", "mal"], ["большой", "Adjective", "big", "grande"], ["маленький", "Adjective", "small", "pequeno"],
 ["новый", "Adjective", "new", "novo"], ["старый", "Adjective", "old", "velho"], ["один", "Numeral", "one", "um"], ["два", "Numeral", "two", "dois"],
 ["три", "Numeral", "three", "três"], ["четыре", "Numeral", "four", "quatro"], ["пять", "Numeral", "five", "cinco"], ["ты", "Pronoun", "you", "tu, você"],
 ["он", "Pronoun", "he", "ele"], ["она", "Pronoun", "she", "ela"], ["мы", "Pronoun", "we", "nós"], ["вы", "Pronoun", "you (plural", "vocês; o senhor, a senhora"],
 ["они", "Pronoun", "they", "eles, elas"], ["что", "Pronoun", "what", "o quê"], ["кто", "Pronoun", "who", "quem"], ["где", "Adverb", "where", "onde"],
 ["когда", "Adverb", "when", "quando"], ["почему", "Adverb", "why", "por quê"], ["или", "Conjunction", "or", "ou"], ["но", "Conjunction", "but", "mas"],
 ["физика", "Noun", "physics", "física"], ["математика", "Noun", "mathematics", "matemática"], ["химия", "Noun", "chemistry", "química"],
 ["задача", "Noun", "problem", "problema (de prova)"], ["решение", "Noun", "solution", "solução"], ["ответ", "Noun", "answer", "resposta"], ["вопрос", "Noun", "question", "pergunta"],
 ["число", "Noun", "number", "número"], ["сила", "Noun", "force", "força"], ["масса", "Noun", "mass", "massa"], ["скорость", "Noun", "speed", "velocidade"],
 ["энергия", "Noun", "energy", "energia"], ["урок", "Noun", "lesson", "aula"], ["учитель", "Noun", "teacher", "professor"], ["студент", "Noun", "student", "estudante (universitário)"],
 ["ёж", "Noun", "hedgehog", "ouriço"], ["ещё", "Adverb", "still", "ainda"], ["жить", "Verb", "to live", "viver"], ["шить", "Verb", "to sew", "costurar"],
 ["цирк", "Noun", "circus", "circo"], ["подъезд", "Noun", "entrance", "entrada (de prédio)"], ["семья", "Noun", "family", "família"], ["пить", "Verb", "to drink", "beber"],
 ["мышь", "Noun", "mouse", "camundongo"], ["мяч", "Noun", "ball", "bola"], ["мясо", "Noun", "meat", "carne"], ["яблоко", "Noun", "apple", "maçã"],
 ["юг", "Noun", "south", "sul"], ["эхо", "Noun", "echo", "eco"], ["этаж", "Noun", "floor", "andar (de prédio)"],
]
# (2b) palavras em que só o acento muda o sentido: duas entradas do mesmo verbete
PARES = [
 ["замок", ("Noun", "castle", "castelo"), ("Noun", "lock", "fechadura")],
 ["мука", ("Noun", "flour", "farinha"), ("Noun", "torment", "tormento")],
 ["писать", ("Verb", "to write", "escrever"), ("Verb", "to urinate", "urinar")],
]
CL = {"Noun": "substantivo", "Proper noun": "nome próprio", "Adverb": "advérbio", "Interjection": "interjeição", "Adjective": "adjetivo", "Numeral": "numeral",
      "Pronoun": "pronome", "Conjunction": "conjunção", "Verb": "verbo", "Preposition": "preposição"}
GEN = {"m": "masculino", "f": "feminino", "n": "neutro"}
def curta(s):
    """definição da fonte sem o parêntese explicativo do fim (só encurta; não muda palavra)"""
    a = re.sub(r"\s*[\[(][^\[(]*$", "", s) if len(s) > 60 else s
    return (a or s)[:80]
def acha(pal, classe, chave, pt):
    p = D["palavras"].get(pal)
    if not p or not p.get("entradas"):
        (avisos if FROUXO else erros).append(f"{pal}: sem verbete baixado"); return None
    for e in p["entradas"]:
        gl = " | ".join([str(v(e.get("glosa")) or "")] + [str(v(g) or "") for g in (e.get("glosas_seguintes") or [])][:6])
        if v(e["classe"]) == classe and re.search(r"(?<![a-z])" + re.escape(chave.lower()), gl.lower()):
            ipa = v(e.get("ipa")); ipa = ipa[0] if isinstance(ipa, list) and ipa else ipa
            ac = v(e["forma_acentuada"])
            if ac.replace("́", "") != pal: erros.append(f"{pal}: forma acentuada {ac!r} não é a mesma palavra")
            g = v(e.get("genero")); g = GEN.get(g.split()[0]) if isinstance(g, str) and g.split() and g.split()[0] in GEN else None
            return {"ac": ac, "tr": v(e["transliteracao"]), "ipa": ipa, "cl": CL[classe], "g": g, "en": curta(limpa(str(v(e.get("glosa"))))), "pt": pt}
    erros.append(f"{pal}: nenhuma entrada {classe} com {chave!r} na definição"); return None
PAL = {}
for pal, classe, chave, pt in ESC:
    x = acha(pal, classe, chave, pt)
    if x: PAL[pal] = x
PAR = []
for pal, a, b in PARES:
    xa, xb = acha(pal, *a), acha(pal, *b)
    if xa and xb:
        if xa["ac"] == xb["ac"]: erros.append(f"{pal}: as duas entradas têm o mesmo acento")
        PAR.append({"ru": pal, "a": xa, "b": xb})

# ---------- (3) listas dos laboratórios ----------
COGN = ["мама", "папа", "физика", "математика", "химия", "Россия", "Москва", "Бразилия", "школа", "студент", "цирк", "масса", "энергия", "эхо", "этаж"]
CURT = ["да", "нет", "дом", "кот", "окно", "вода", "хлеб", "чай", "стол", "стул", "друг", "брат", "сын", "день", "год", "рука", "один", "два", "три", "пять",
        "ты", "он", "она", "мы", "вы", "они", "что", "кто", "где", "или", "но", "юг", "мяч", "ёж"]
LISTA = {"cognatas": [w for w in COGN if w in PAL], "curtas": [w for w in CURT if w in PAL], "todas": list(PAL)}
for nome, orig in (("cognatas", COGN), ("curtas", CURT)):
    for w in orig:
        if w not in PAL and not FROUXO: erros.append(f"lista {nome}: {w} sem dado")

# ---------- tabelas da teoria ----------
VOG = [[v(p)[0], v(p)[1]] for p in D["vogais_pares"]["pares"]]
if "".join(a for a, b in VOG) != "АЭЫОУ" or "".join(b for a, b in VOG) != "ЯЕИЁЮ": erros.append("pares de vogais inesperados")
SONS = [[v(p)[0], v(p)[1]] for p in D["consoantes"]["pares_sonora_surda"]]
def lista_de(chave):
    s = v(D["consoantes"][chave]); return [x.strip() for x in s.split("|")[1].split(",")]
DUR = {"ambas": lista_de("alfabeto_duras_ou_moles"), "sempreDura": lista_de("alfabeto_sempre_duras"), "sempreMole": lista_de("alfabeto_sempre_moles")}
for l in ALF:
    if l["tipo"] in ("consoante", "semivogal"):
        esperado = "Always hard" if l["M"] in DUR["sempreDura"] else "Always soft" if l["M"] in DUR["sempreMole"] else "Either hard (default) or soft"
        if l["dm"] != esperado: erros.append(f"letra {l['M']}: dura/mole {l['dm']!r} não bate com a tabela de consoantes")
ITAL = [v(x) if not isinstance(x, str) else x for x in v(D["cursiva_italico"]["letras_destacadas_na_tabela"])] if isinstance(v(D["cursiva_italico"]["letras_destacadas_na_tabela"]), list) else []

# ---------- transliteração do Wiktionary, tirada da linha de nomes das letras do próprio Wiktionary ----------
linha = v(D["alfabeto"]["nomes_no_wiktionary"]["linha"]).replace("́", "")
nomesWT = dict(re.findall(r"([Ѐ-ӿ]+) \(([^)]+)\)", linha))
def wt(letra, nome, corta):
    t = nomesWT.get(nome)
    if not t: erros.append(f"Wiktionary: nome {nome!r} não achado na linha de nomes"); return [letra, None]
    return [letra, corta(t)]
WT = [wt("ж", "же", lambda t: t[:-1]), wt("х", "ха", lambda t: t[:-1]), wt("ц", "цэ", lambda t: t[:-1]), wt("ч", "че", lambda t: t[:-1]), wt("ш", "ша", lambda t: t[:-1]),
      wt("щ", "ща", lambda t: t[:-1]), wt("й", "ий", lambda t: t[1:]), wt("е", "е", lambda t: t), wt("ё", "ё", lambda t: t), wt("ю", "ю", lambda t: t), wt("я", "я", lambda t: t)]
if [t for c, t in WT] != ["ž", "x", "c", "č", "š", "šč", "j", "je", "jo", "ju", "ja"]: erros.append(f"transliteração do Wiktionary inesperada: {WT}")
EXC = []
# toda palavra usada tem de obedecer a essa convenção (confere a leitura de cada verbete com a tabela)
for pal, x in PAL.items():
    for c, t in WT[:7]:
        if c in pal.lower() and t not in x["tr"].lower(): EXC.append([pal, c, t, x["tr"]]); avisos.append(f"{pal}: a leitura {x['tr']!r} não tem {t!r} para a letra {c} (o verbete translitera pela pronúncia)")

# ---------- RG02: redução das vogais, ensurdecimento, dezenas e regras de ortografia (Wikipedia em inglês) ----------
GL_PT = {"ceiling": "teto", "ferry": "balsa", "cloud": "nuvem", "grass": "grama", "hedgehog": "ouriço", "hedgehogs": "ouriços", "sturgeon": "esturjão", "sturgeons": "esturjões",
         "kernel, core, nucleus, etc.": "núcleo", "kernels, cores, nuclei, etc.": "núcleos", "row": "fileira", "rows": "fileiras", "wife": "esposa", "wives": "esposas",
         "dugout boat": "canoa de tronco", "dugout boats": "canoas de tronco", "silk": "seda", "silks": "sedas", "seed": "semente", "seeds": "sementes", "skull": "crânio",
         "skulls": "crânios", "price": "preço", "prices": "preços", "story, tale": "história, conto", "knife": "faca", "Ivanov": "Ivanov (sobrenome)", "spoon": "colher",
         "to do": "fazer", "god": "deus", "request": "pedido", "vodka": "vodca", "tomcat": "gato", "tomcats": "gatos", "village": "aldeia", "villages": "aldeias", "cheek, jowl, jaw": "bochecha", "cheeks, jowls, jaws": "bochechas"}
def gl(en, onde):
    if en not in GL_PT: erros.append(f"{onde}: falta a tradução de {en!r}")
    return GL_PT.get(en)
def exemplos(lista, onde):
    o = []
    for x in lista:
        x = v(x)
        o.append({"ac": x["palavra"], "ipa": x["ipa"], "en": x["glosa"], "pt": gl(x["glosa"], onde)})
    return o
RV = D["reducao_vocalica"]["artigo_reducao"]
def pares(lista, onde, ordem_tonica_primeiro=None):
    e = exemplos(lista, onde)
    if len(e) % 2: erros.append(f"{onde}: número ímpar de exemplos")
    return [[e[i], e[i + 1]] for i in range(0, len(e) - 1, 2)]
RED = {"akanye": exemplos(RV["akanye_exemplos"], "akanye"), "mole": pares(RV["depois_de_mole_exemplos"], "depois de mole"), "ikanye": pares(RV["ikanye_exemplos"], "ikanye")}
# ensurdecimento e assimilação: frases "X (glosa) sounds like Y [ipa]"
ENS = []
C = D["consoantes"]
frases = [(s, "final") for s in v(C["ensurdecimento_final_exemplos"])] if isinstance(v(C["ensurdecimento_final_exemplos"]), list) else []
frases = [(v(s) if not isinstance(s, str) else s, t) for s, t in frases] + [(v(C["assimilacao_exemplo_1"]), "assimilação"), (v(C["assimilacao_exemplo_2"]), "assimilação")]
for s, tipo in frases:
    mm = re.search(r"([Ѐ-ӿ]+) \(([^)]+)\) sounds like ([Ѐ-ӿ]+) (\[[^\]]+\])", s)
    if not mm: erros.append(f"ensurdecimento: frase não entendida {s!r}"); continue
    ENS.append({"ru": mm.group(1), "como": mm.group(3), "ipa": mm.group(4), "en": mm.group(2), "pt": gl(mm.group(2), "ensurdecimento"), "tipo": tipo})
s = v(C["assimilacao_ultimo_obstruinte"])
for mm in re.finditer(r"([Ѐ-ӿ]+) (\[[^\]]+\])ⓘ? \('([^']+)'\)", s):
    ENS.append({"ru": mm.group(1), "como": None, "ipa": mm.group(2), "en": mm.group(3), "pt": gl(mm.group(3), "assimilação"), "tipo": "assimilação"})
if len(ENS) < 6: erros.append(f"ensurdecimento: só {len(ENS)} exemplos")
# dezenas: o acento muda de lugar em 50 e 60
DEZ = []
for s in v(D["acento"]["exemplo_dezenas"]):
    s = v(s) if not isinstance(s, str) else s
    a, n = s.split("|"); DEZ.append({"ac": a.replace(" ", ""), "n": int(n)})
if [x["n"] for x in DEZ] != [10, 20, 30, 40, 50, 60, 70, 80, 90]: erros.append("dezenas inesperadas")
# regras de ortografia: tabela-resumo da página "Russian spelling rules"
REG = []
RO = D["regras_de_ortografia"]
cab = [x.strip() for x in v(RO["resumo_cabecalho"]).split("|")][1:]
if cab != ["ы↔и", "у↔ю", "а↔я", "о↔ё/е"]: erros.append(f"cabeçalho da tabela de ortografia inesperado: {cab}")
for s in v(RO["resumo_tabela"]):
    s = v(s) if not isinstance(s, str) else s
    cel = [x.strip() for x in s.split("|")]
    REG.append({"en": cel[0].split()[0], "letras": re.findall(r"[Ѐ-ӿ]", cel[0]), "cols": [c.split("/") for c in cel[1:]]})
if [r["letras"] for r in REG] != [["г", "к", "х"], ["ж", "ч", "ш", "щ"], ["ц"]]: erros.append(f"tabela de ortografia inesperada: {REG}")
ESTR = re.findall(r"[Ѐ-ӿ]+", v(RO["excecoes_estrangeirismos"]).split("For example,")[1])

# ---------- RG03: substantivos, gênero e nominativo plural (tools/russo/dadosR3.json: Wiktionary para as palavras, Wikipedia para as regras) ----------
D3 = json.load(open(os.path.join(R, "dadosR3.json"), encoding="utf-8"))
# [palavra, palavra em inglês que tem de estar na definição do verbete, tradução]
N_PT = [
 ["стол", "table", "mesa"], ["стул", "chair", "cadeira"], ["дом", "house", "casa"], ["город", "city", "cidade"], ["друг", "friend", "amigo"], ["брат", "brother", "irmão"],
 ["сын", "son", "filho"], ["отец", "father", "pai"], ["день", "day", "dia"], ["год", "year", "ano"], ["человек", "person", "pessoa"], ["язык", "tongue", "língua"],
 ["хлеб", "bread", "pão"], ["чай", "tea", "chá"], ["кот", "tomcat", "gato"], ["урок", "lesson", "aula"], ["учитель", "teacher", "professor"], ["студент", "student", "estudante"],
 ["вопрос", "question", "pergunta"], ["ответ", "answer", "resposta"], ["этаж", "floor", "andar (de prédio)"], ["юг", "south", "sul"], ["мяч", "ball", "bola"], ["ёж", "hedgehog", "ouriço"],
 ["цирк", "circus", "circo"], ["вечер", "evening", "noite (o começo dela)"], ["музей", "museum", "museu"], ["герой", "hero", "herói"], ["словарь", "dictionary", "dicionário"],
 ["врач", "medicine", "médico"], ["мальчик", "boy", "menino"], ["ребёнок", "child", "criança"], ["муж", "husband", "marido"], ["глаз", "eye", "olho"], ["месяц", "month", "mês"],
 ["поезд", "train", "trem"], ["лес", "forest", "floresta"], ["мама", "mom", "mamãe"], ["папа", "dad", "papai"], ["вода", "water", "água"], ["книга", "book", "livro"],
 ["улица", "street", "rua"], ["школа", "school", "escola"], ["сестра", "sister", "irmã"], ["дочь", "daughter", "filha"], ["мать", "mother", "mãe"], ["ночь", "night", "noite"],
 ["жизнь", "life", "vida"], ["рука", "hand", "mão"], ["работа", "work", "trabalho"], ["задача", "problem", "problema (de prova)"], ["семья", "family", "família"], ["мышь", "mouse", "camundongo"],
 ["сила", "strength", "força"], ["масса", "mass", "massa"], ["скорость", "speed", "velocidade"], ["энергия", "energy", "energia"], ["физика", "physics", "física"],
 ["математика", "mathematics", "matemática"], ["химия", "chemistry", "química"], ["девочка", "girl", "menina"], ["девушка", "girl", "moça"], ["жена", "wife", "esposa"],
 ["неделя", "week", "semana"], ["станция", "station", "estação"], ["лекция", "lecture", "aula expositiva"], ["фамилия", "surname", "sobrenome"], ["тетрадь", "notebook", "caderno"],
 ["дверь", "door", "porta"], ["дядя", "uncle", "tio"], ["мужчина", "man", "homem"], ["женщина", "woman", "mulher"], ["окно", "window", "janela"], ["молоко", "milk", "leite"],
 ["утро", "morning", "manhã"], ["время", "time", "tempo"], ["дело", "affair", "assunto"], ["слово", "word", "palavra"], ["место", "place", "lugar"], ["лицо", "face", "rosto"],
 ["решение", "solution", "solução"], ["число", "number", "número"], ["мясо", "meat", "carne"], ["яблоко", "apple", "maçã"], ["эхо", "echo", "eco"], ["море", "sea", "mar"],
 ["поле", "field", "campo"], ["имя", "name", "nome"], ["здание", "building", "prédio"], ["письмо", "letter", "carta"], ["кофе", "coffee", "café"], ["такси", "taxi", "táxi"],
 ["метро", "subway", "metrô"], ["пальто", "overcoat", "sobretudo"], ["деньги", "money", "dinheiro"], ["часы", "clock", "relógio"], ["люди", "people", "pessoas"],
 ["дети", "ребёнок", "crianças"], ["ножницы", "scissors", "tesoura"], ["брюки", "trousers", "calças"],
]
NOM = []
for pal, chave, pt in N_PT:
    p = D3["palavras"].get(pal)
    if not p or not p.get("entradas"): erros.append(f"RG03 {pal}: sem verbete"); continue
    e = p["entradas"][0]
    if v(e["classe"]) != "Noun": erros.append(f"RG03 {pal}: a primeira entrada não é substantivo"); continue
    gl = " | ".join([str(v(e.get("glosa")) or "")] + [str(v(g) or "") for g in (e.get("glosas_seguintes") or [])][:6])
    if chave.lower() not in gl.lower(): erros.append(f"RG03 {pal}: {chave!r} não está na definição ({gl[:60]!r})"); continue
    ac = v(e["forma_acentuada"])
    if ac.replace("́", "") != pal: erros.append(f"RG03 {pal}: forma acentuada {ac!r} é outra palavra")
    gen = v(e["genero"]); gs = []; an = None
    for parte in gen.split(" or "):
        tk = parte.split()
        if tk and tk[0] in ("m", "f", "n") and tk[0] not in gs: gs.append(tk[0])
        if len(tk) > 1 and tk[1] in ("anim", "inan") and an is None: an = tk[1]
    if not gs: erros.append(f"RG03 {pal}: gênero não entendido {gen!r}")
    marcas = [v(m) for m in (e.get("marcas") or [])]
    linha = v(e.get("linha_do_verbete")) or ""
    conject = "conjectural or unused" in linha
    npl = v(e.get("nominativo_plural")); pl, raro = [], []
    if npl and not conject:
        for f in npl.split(" or "):
            (raro if "*" in f else pl).append(f.replace("*", "").strip())
    ipa = v(e.get("ipa")); ipa = ipa[0] if isinstance(ipa, list) and ipa else ipa
    so_pl = "plural only" in marcas or " pl" in (" " + gen)
    NOM.append({"w": pal, "ac": ac, "tr": v(e["transliteracao"]), "ipa": ipa, "gs": gs, "an": an, "gen": gen, "pl": pl, "plRaro": raro, "indecl": "indeclinable" in marcas, "soPl": so_pl, "semPl": conject, "pt": pt})
# conferência cruzada: o plural irregular que a Wikipedia dá tem de estar entre as formas do Wiktionary
IRR = []
for pal, x in D3["numero"]["plurais_irregulares"]["pedidos"].items():
    s = v(x)
    if not s: continue
    mm = re.match(r"^(\S+) \((\w)\) – ([^|]+) \| (\S+)", s)
    if not mm: erros.append(f"RG03 irregular não entendido: {s!r}"); continue
    n = next((y for y in NOM if y["w"] == pal), None)
    if not n: continue
    if mm.group(4) not in n["pl"] + n["plRaro"]: erros.append(f"RG03 {pal}: plural da Wikipedia {mm.group(4)!r} não está no Wiktionary {n['pl']}")
    if mm.group(2) not in n["gs"]: erros.append(f"RG03 {pal}: gênero da Wikipedia {mm.group(2)!r} diferente do Wiktionary {n['gs']}")
    IRR.append(pal)
if len(NOM) < 95: erros.append(f"RG03: só {len(NOM)} substantivos")

for a in avisos: print("aviso:", a)
if erros:
    for e in erros: print("ERRO:", e)
    print(f"{len(erros)} erro(s): nada gravado."); sys.exit(1)
RU = {"ALF": ALF, "PAL": PAL, "PAR": PAR, "LISTA": LISTA, "VOG": VOG, "SONS": SONS, "DUR": DUR, "ITAL": ITAL, "WT": WT, "EXC": EXC, "RED": RED, "ENS": ENS, "DEZ": DEZ, "REG": REG, "ESTR": ESTR, "NOM": NOM, "IRR": IRR}
saida = os.path.join(R, "..", "..", "assets", "sims", "russo", "dados.js")
txt = ("/* GERADO por tools/russo/gera-russo.py a partir de tools/russo/dadosR.json. NÃO editar à mão: corrigir no gerador e rodar de novo.\n"
       "   Letras: tabela \"Letters\" da Wikipedia em inglês (Russian alphabet). Palavras: verbetes do Wiktionary em inglês. */\n"
       "(function () { const SIM = (window.SIM = window.SIM || {});\nSIM.RU = " + json.dumps(RU, ensure_ascii=False, separators=(",", ":")) + ";\n})();\n")
open(saida, "w", encoding="utf-8").write(txt)
print(f"gravado: {len(ALF)} letras, {len(PAL)} palavras, {len(PAR)} pares de acento; listas: " + ", ".join(f"{k} {len(x)}" for k, x in LISTA.items()))
print("RG02:", len(RED["akanye"]), "akanye,", len(RED["mole"]), "pares depois de mole,", len(RED["ikanye"]), "pares ikanye,", len(ENS), "ensurdecimento,", len(DEZ), "dezenas,", ESTR)
print("RG03:", len(NOM), "substantivos;", sum(1 for x in NOM if x["pl"]), "com plural;", len(IRR), "irregulares conferidos com a Wikipedia")
print("grupos:", {g: "".join(x["M"] for x in ALF if x["grupo"] == g) for g in ("amiga", "falsa", "nova")})
