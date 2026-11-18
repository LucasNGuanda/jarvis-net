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
    # o verbete de лицо traz "n anim or n inan": animado no sentido de "pessoa", inanimado no de "rosto", que é o sentido usado no site (definição "(anatomy) face")
    if pal == "лицо" and "anatomy" in gl: an = "inan"
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

# ---------- RG04 em diante: declinação completa, pronomes, verbos e frases (tools/russo/dadosR4.json: tabelas do Wiktionary em inglês) ----------
D4 = json.load(open(os.path.join(R, "dadosR4.json"), encoding="utf-8"))
CASOS = [("nom", "nominative"), ("acc", "accusative"), ("gen", "genitive"), ("dat", "dative"), ("ins", "instrumental"), ("prep", "prepositional")]
RUIM = re.compile(r"archaic|nonstandard|non-standard|colloquial|dated|obsolete|rare|poetic|epic|proscribed|less common", re.I)
def marca_ruim(notas):
    """a legenda do * muda de página para página: só vale como "forma a evitar" se a nota da própria tabela disser (arcaica, coloquial, rara...)"""
    for n in notas or []:
        s = v(n) or ""
        if s.startswith("*") and not s.startswith("**") and RUIM.search(s): return True
    return False
def formas(cel, notas=None):
    """formas de uma célula da tabela; sai a forma marcada com * quando a legenda da tabela diz que ela é arcaica, coloquial, rara ou fora do padrão"""
    if not isinstance(cel, dict) or cel.get("valor") is None: return []
    val = cel["valor"]; lista = val if isinstance(val, list) else [val]; txt = cel.get("valor_texto") or ""
    if not marca_ruim(notas): return lista
    boas = [f for f in lista if not re.search(re.escape(f) + r"\s*(△\s*)?\*(?!\*)", txt)]
    return boas or lista
GEN_PT = {"m": "masculino", "f": "feminino", "n": "neutro"}
DECL = {}
for x in NOM:
    t = D4["declinacoes"].get(x["w"], {}).get("tabela") or {}
    if not t.get("casos"): continue
    cs = {}
    for k, en in CASOS:
        c = t["casos"].get(en) or {}
        esc = lambda cel: cel.get("animate" if x["an"] == "anim" else "inanimate") if isinstance(cel, dict) and "animate" in cel else cel  # tabela que separa animate / inanimate: vale a animacidade do verbete
        sgc = c.get("singular")
        # linha "inanimate" com uma célula só: essa célula é a do plural; o singular é a célula da linha "animate", que vale para as duas (célula mesclada na página)
        if isinstance(sgc, dict) and "animate" in sgc and x["an"] != "anim" and (sgc["inanimate"].get("trecho") or "").count("|") == 1: sgc = sgc["animate"]
        cs[k] = [formas(esc(sgc), t.get("notas")), formas(esc(c.get("plural")), t.get("notas"))]
    if not x["soPl"] and x["w"] not in [f.replace("́", "") for f in cs["nom"][0]]: erros.append(f"RG04 {x['w']}: o nominativo singular da tabela {cs['nom'][0]} não é a palavra")
    for f in x["pl"]:
        if f.replace("\u0301", "") not in [y.replace("\u0301", "") for y in cs["nom"][1]]: erros.append(f"RG04 {x['w']}: plural {f!r} do verbete fora da tabela {cs['nom'][1]}")
    DECL[x["w"]] = {"ac": x["ac"], "pt": x["pt"], "g": x["gs"][0], "an": x["an"], "genPt": GEN_PT[x["gs"][0]] + (", animado" if x["an"] == "anim" else ", inanimado" if x["an"] == "inan" else "") + (", só plural" if x["soPl"] else ""), "soPl": x["soPl"], "casos": cs}
# verbos: [infinitivo, índice da entrada, palavra em inglês que tem de estar na definição, tradução]
V_PT = [["читать", 0, "to read", "ler"], ["писать", 0, "to write", "escrever"], ["знать", 0, "to know", "saber, conhecer"], ["видеть", 0, "to see", "ver"], ["любить", 0, "to love", "amar, gostar de"],
        ["решать", 0, "to solve", "resolver"], ["решить", 0, "to solve", "resolver (até o fim)"], ["понимать", 0, "to understand", "entender"], ["делать", 0, "to do", "fazer"], ["говорить", 0, "to speak", "falar"],
        ["думать", 0, "to think", "pensar"], ["работать", 0, "to work", "trabalhar"], ["жить", 0, "to live", "viver, morar"], ["быть", 0, "to be", "ser, estar"], ["иметь", 0, "to have", "ter"],
        ["хотеть", 0, "to want", "querer"], ["мочь", 0, "can", "poder"], ["слушать", 0, "to listen", "escutar"], ["смотреть", 0, "to look", "olhar"], ["изучать", 0, "to study", "estudar (uma matéria)"],
        ["учить", 0, "to teach", "ensinar"], ["учиться", 0, "to learn", "aprender, estudar"], ["покупать", 0, "to buy", "comprar"], ["давать", 0, "to give", "dar"], ["дать", 0, "to give", "dar (uma vez)"],
        ["помогать", 0, "to help", "ajudar"], ["идти", 0, "to go", "ir (a pé)"], ["ехать", 0, "vehicle", "ir (de veículo)"], ["пить", 0, "to drink", "beber"], ["есть", 0, "to eat", "comer"],
        ["спрашивать", 0, "to ask", "perguntar"], ["отвечать", 0, "to answer", "responder"], ["звонить", 0, "to call", "telefonar"]]
VERB = {}
for inf, i, chave, pt in V_PT:
    es = D4["verbos"].get(inf, {}).get("entradas_verb") or []
    if len(es) <= i: erros.append(f"RG04 verbo {inf}: sem entrada"); continue
    e = es[i]; gl = " | ".join([str(v(e.get("glosa")) or "")] + [str(v(g) or "") for g in (e.get("glosas_seguintes") or [])][:5])
    if chave not in gl: erros.append(f"RG04 verbo {inf}: {chave!r} não está na definição ({gl[:50]!r})"); continue
    c = e.get("conjugacao") or {}; asp = v(e.get("aspecto"))
    if asp not in ("impf", "pf") or not c.get("passado"): erros.append(f"RG04 verbo {inf}: aspecto ou conjugação ausente"); continue
    tab = c["presente"] if asp == "impf" else c["futuro"]
    pres = [formas(tab.get(k), c.get("notas")) for k in ("1sg", "2sg", "3sg", "1pl", "2pl", "3pl")]
    if any(not f for f in pres): erros.append(f"RG04 verbo {inf}: célula vazia em {pres}")
    ac = v(e["forma_acentuada"])
    if ac.replace("́", "") != inf: erros.append(f"RG04 verbo {inf}: forma acentuada {ac!r}")
    tit = v(c.get("titulo")) or ""
    VERB[inf] = {"ac": ac, "pt": pt, "asp": asp, "par": v(e.get("par_aspectual")), "tempo": "presente" if asp == "impf" else "futuro", "pres": pres, "pass": [formas(c["passado"].get(k), c.get("notas")) for k in ("m", "f", "n", "pl")],
                 "imp": [formas(c["imperativo"].get(k), c.get("notas")) for k in ("sg", "pl")], "ipa": v(e.get("ipa")), "trans": "intransitive" not in tit and "transitive" in tit, "tit": tit}
P_PT = [["я", "I (", "eu"], ["ты", "you", "tu, você"], ["он", "he", "ele"], ["она", "she", "ela"], ["оно", "it", "ele, ela (neutro)"], ["мы", "we", "nós"], ["вы", "you", "vocês; o senhor, a senhora"], ["они", "they", "eles, elas"], ["кто", "who", "quem"], ["что", "what", "o quê"]]
PRON = {}
for w, chave, pt in P_PT:
    e = D4["pronomes"].get(w)
    if not e or chave not in " | ".join([str(v(e.get("glosa")) or "")] + [str(v(g) or "") for g in (e.get("glosas_seguintes") or [])]): erros.append(f"RG04 pronome {w}: verbete ou definição"); continue
    cel = lambda c: c.get("singular") if isinstance(c, dict) and "singular" in c else c  # кто e что têm a tabela com coluna "singular"
    cs = {k: formas(cel(e["tabela"]["casos"].get(en))) for k, en in CASOS}
    if w not in [f.replace("́", "") for f in cs["nom"]]: erros.append(f"RG04 pronome {w}: nominativo {cs['nom']}")
    PRON[w] = {"pt": pt, "casos": cs}
# frases de exemplo dos verbetes: [frase literal da fonte, tradução, sujeito (forma no nominativo) ou None, objeto direto (forma no acusativo) ou None, palavra em inglês que tem de estar na tradução da fonte]
FR_PT = [
 ["Я ви́жу её.", "Eu a vejo.", "Я", "её", "see"], ["Я её хорошо́ зна́ю.", "Eu a conheço bem.", "Я", "её", "know"], ["Я хорошо́ зна́ю матема́тику.", "Eu sei bem matemática.", "Я", "матема́тику", "math"],
 ["Она́ их ви́дит.", "Ela os vê.", "Она́", "их", "sees"], ["Он ел мя́со и сала́т.", "Ele comia carne e salada.", "Он", "мя́со", "meat"], ["Он преподнёс ей кни́гу.", "Ele deu um livro de presente a ela.", "Он", "кни́гу", "book"],
 ["Я хочу́ име́ть друзе́й.", "Eu quero ter amigos.", "Я", "друзе́й", "friends"], ["Рабо́та кипи́т.", "O trabalho está a todo vapor.", "Рабо́та", None, "Work"], ["Э́ти часы́ не иду́т.", "Este relógio não funciona.", "часы́", None, "clock"],
 ["Вре́мя идёт бы́стро.", "O tempo passa depressa.", "Вре́мя", None, "Time"], ["Кто э́то?", "Quem é este?", "Кто", None, "Who"], ["Что э́то?", "O que é isto?", "Что", None, "What"],
 ["Я ру́сский.", "Eu sou russo.", "Я", None, "Russian"], ["Что она́ говори́т?", "O que ela está dizendo?", "она́", "Что", "saying"], ["Я говорю́ по-ру́сски.", "Eu falo russo.", "Я", None, "Russian"],
]
todas_fr = {v(f["russo"]): f for f in D4["frases"] + D4.get("frases_alem_do_limite", [])}
def tem_forma(forma, caso):
    f = forma.replace("́", "").lower()
    for d in DECL.values():
        if f in [y.replace("́", "").lower() for lado in d["casos"][caso] for y in lado]: return True
    return any(f in [y.replace("́", "").lower() for y in p["casos"][caso]] for p in PRON.values())
FRASES = []
for ru_, pt, suj, obj, chave in FR_PT:
    f = todas_fr.get(ru_)
    if not f: erros.append(f"RG04 frase não está na fonte: {ru_!r}"); continue
    en = v(f["traducao"])
    if chave not in en: erros.append(f"RG04 frase {ru_!r}: {chave!r} não está na tradução da fonte ({en!r})")
    if suj and (suj not in ru_ or not tem_forma(suj, "nom")): erros.append(f"RG04 frase {ru_!r}: sujeito {suj!r} não é nominativo de palavra do banco")
    if obj and (obj not in ru_ or not tem_forma(obj, "acc")): erros.append(f"RG04 frase {ru_!r}: objeto {obj!r} não é acusativo de palavra do banco")
    FRASES.append({"ru": ru_, "pt": pt, "en": en, "suj": suj, "obj": obj, "de": f["verbete"]})
if len(DECL) < 90 or len(VERB) < 30 or len(PRON) != 10: erros.append(f"RG04: DECL {len(DECL)}, VERB {len(VERB)}, PRON {len(PRON)}")

# ---------- RG05 a RG08: frases com o caso de cada palavra marcado. [frase literal, tradução, palavra em inglês da tradução da fonte, [[forma, caso], ...], fonte] ----------
FR2_PT = [
 ["У бра́та не́сколько часо́в.", "Meu irmão tem vários relógios.", "watches", [["бра́та", "gen"], ["часо́в", "gen"]], "wt"],
 ["У меня́ вре́мени в обре́з.", "Estou com o tempo contado.", "time", [["меня́", "gen"], ["вре́мени", "gen"]], "wt"],
 ["Э́то сто́ит больши́х де́нег.", "Isso custa muito dinheiro.", "money", [["де́нег", "gen"]], "wt"],
 ["Он у́чится у свои́х друзе́й.", "Ele aprende com os amigos.", "friends", [["Он", "nom"], ["друзе́й", "gen"]], "wt"],
 ["Я дру́гу помога́ю де́ньгами.", "Eu ajudo um amigo com dinheiro.", "friend", [["Я", "nom"], ["дру́гу", "dat"], ["де́ньгами", "ins"]], "wt"],
 ["Я ему́ помога́л.", "Eu o ajudava.", "helping", [["Я", "nom"], ["ему́", "dat"]], "wt"],
 ["Он преподнёс ей кни́гу.", "Ele deu um livro de presente a ela.", "book", [["Он", "nom"], ["ей", "dat"], ["кни́гу", "acc"]], "wt"],
 ["Ему́ два́дцать оди́н год.", "Ele tem 21 anos.", "21", [["Ему́", "dat"], ["год", "nom"]], "wt"],
 ["Ей не спи́тся.", "Ela não consegue dormir.", "sleep", [["Ей", "dat"]], "wt"],
 ["Он живёт этажо́м вы́ше.", "Ele mora um andar acima.", "floor", [["Он", "nom"], ["этажо́м", "ins"]], "wt"],
 ["Свеча́ горе́ла на столе́.", "Uma vela ardia sobre a mesa.", "table", [["столе́", "prep"]], "wt"],
 ["Он э́то при ней сказа́л.", "Ele disse isso na presença dela.", "presence", [["Он", "nom"], ["ней", "prep"]], "wt"],
 ["Я в де́ле!", "Estou dentro!", "in", [["Я", "nom"], ["де́ле", "prep"]], "wt"],
 ["Я ви́жу её.", "Eu a vejo.", "see", [["Я", "nom"], ["её", "acc"]], "wt"],
 ["Я хорошо́ зна́ю матема́тику.", "Eu sei bem matemática.", "math", [["Я", "nom"], ["матема́тику", "acc"]], "wt"],
 ["У моего брата есть обед", "Meu irmão tem um almoço.", "My brother has a lunch", [["брата", "gen"]], "wp"],
 ["Я напился воды", "Eu bebi água.", "I drank water", [["Я", "nom"], ["воды", "gen"]], "wp"],
 ["мне двадцать лет", "Eu tenho 20 anos.", "I am 20", [["мне", "dat"]], "wp"],
 ["мне холодно", "Estou com frio.", "I am cold", [["мне", "dat"]], "wp"],
 ["я работаю утром", "Eu trabalho de manhã.", "I work in the morning", [["я", "nom"], ["утром", "ins"]], "wp"],
 ["я хочу быть врачом", "Eu quero ser médico.", "I want to be a doctor", [["я", "nom"], ["врачом", "ins"]], "wp"],
]
wp_txt = json.dumps(D4["casos_wikipedia"], ensure_ascii=False)
FRASES2 = []
for ru_, pt, chave, marcas, de in FR2_PT:
    if de == "wt":
        f = todas_fr.get(ru_)
        if not f: erros.append(f"frase não está nos exemplos do Wiktionary: {ru_!r}"); continue
        en = v(f["traducao"]); fonte = f'exemplo do verbete "{f["verbete"]}" do Wiktionary em inglês'
        if chave not in en: erros.append(f"frase {ru_!r}: {chave!r} não está na tradução da fonte ({en!r})")
    else:
        if ru_ not in wp_txt or chave not in wp_txt: erros.append(f"frase ou tradução não está nos trechos da Wikipedia: {ru_!r} / {chave!r}"); continue
        en = chave; fonte = "exemplo da Wikipedia em inglês (páginas sobre os casos)"
    for forma, caso in marcas:
        if forma not in ru_.replace(".", "").replace("!", "").split(" "): erros.append(f"frase {ru_!r}: {forma!r} não é palavra da frase")
        if not tem_forma(forma, caso): erros.append(f"frase {ru_!r}: {forma!r} não é {caso} de palavra do banco")
    FRASES2.append({"ru": ru_, "pt": pt, "en": en, "marcas": marcas, "fonte": fonte})
for caso in ("gen", "dat", "ins", "prep"):
    if sum(1 for f in FRASES2 if any(m[1] == caso for m in f["marcas"])) < 3: erros.append(f"menos de 3 frases com {caso}")

# ---------- RG11 e RG12: mais verbos e o futuro composto (tools/russo/dadosR5.json: tabelas de conjugação do Wiktionary em inglês) ----------
D5 = json.load(open(os.path.join(R, "dadosR5.json"), encoding="utf-8"))
V_PT2 = [["прочитать", 0, "to read", "ler (até o fim)"], ["написать", 0, "to write", "escrever (até o fim)"], ["сделать", 0, "to do", "fazer (até o fim)"], ["сказать", 0, "to say", "dizer"],
         ["понять", 0, "to understand", "entender (de uma vez)"], ["увидеть", 0, "to see", "ver (avistar)"], ["купить", 0, "to buy", "comprar (uma vez)"], ["взять", 0, "to take", "pegar (uma vez)"],
         ["брать", 0, "to take", "pegar"], ["спросить", 0, "to ask", "perguntar (uma vez)"], ["ответить", 0, "to answer", "responder (uma vez)"], ["помочь", 0, "to help", "ajudar (uma vez)"],
         ["пойти", 0, "to go", "ir, partir (a pé)"], ["поехать", 0, "to go", "ir, partir (de veículo)"], ["прийти", 0, "to come", "chegar (a pé)"], ["начать", 0, "to begin", "começar (uma vez)"],
         ["начинать", 0, "to begin", "começar"], ["получить", 0, "to receive", "receber (uma vez)"], ["получать", 0, "to receive", "receber"], ["найти", 0, "to find", "encontrar"],
         ["нравиться", 0, "to please", "agradar"], ["называться", 0, "to be called", "chamar-se"], ["значить", 0, "to mean", "significar"],
         ["двигаться", 0, "to move", "mover-se"], ["лежать", 0, "to lie", "estar deitado"], ["стоять", 0, "to stand", "estar de pé"], ["сидеть", 0, "to sit", "estar sentado"]]
def le_verbo(fonte, inf, i, chave, pt):
    es = fonte["verbos"].get(inf, {}).get("entradas_verb") or []
    if len(es) <= i: erros.append(f"verbo {inf}: sem entrada"); return None
    e = es[i]; gl = " | ".join([str(v(e.get("glosa")) or "")] + [str(v(g) or "") for g in (e.get("glosas_seguintes") or [])][:6])
    if chave not in gl: erros.append(f"verbo {inf}: {chave!r} não está na definição ({gl[:70]!r})"); return None
    c = e.get("conjugacao") or {}; asp = v(e.get("aspecto"))
    if asp not in ("impf", "pf") or not c.get("passado"): erros.append(f"verbo {inf}: aspecto ou conjugação ausente"); return None
    seis = ("1sg", "2sg", "3sg", "1pl", "2pl", "3pl"); tab = c["presente"] if asp == "impf" else c["futuro"]
    pres = [formas(tab.get(k), c.get("notas")) for k in seis]
    if any(not f for f in pres): erros.append(f"verbo {inf}: célula vazia em {pres}"); return None
    ac = v(e["forma_acentuada"])
    if ac.replace("́", "") != inf: erros.append(f"verbo {inf}: forma acentuada {ac!r}")
    tit = v(c.get("titulo")) or ""
    fut = [formas(c["futuro"].get(k), c.get("notas")) for k in seis] if asp == "impf" and c.get("futuro") else None
    return {"ac": ac, "pt": pt, "asp": asp, "par": v(e.get("par_aspectual")), "tempo": "presente" if asp == "impf" else "futuro", "pres": pres, "fut": fut,
            "pass": [formas(c["passado"].get(k), c.get("notas")) for k in ("m", "f", "n", "pl")], "imp": [formas(c["imperativo"].get(k), c.get("notas")) for k in ("sg", "pl")],
            "ipa": v(e.get("ipa")), "trans": "intransitive" not in tit and "transitive" in tit, "tit": tit}
VERB = {}
for inf, i, chave, pt in V_PT:
    x = le_verbo(D5, inf, i, chave, pt)
    if x: VERB[inf] = x
for inf, i, chave, pt in V_PT2:
    x = le_verbo(D5, inf, i, chave, pt)
    if x: VERB[inf] = x
# ---------- RG14: verbos de movimento (tools/russo/dadosR6.json: verbetes do Wiktionary e seção "Verbs of motion" de Russian grammar, Wikipedia) ----------
D6 = json.load(open(os.path.join(R, "dadosR6.json"), encoding="utf-8"))
VM6 = D6["verbos_de_movimento"]; F6 = {"verbos": VM6["verbetes"]}
V_PT3 = [["ходить", 0, "to go", "ir, andar (a pé)"], ["ездить", 0, "to go", "ir (de veículo)"], ["бежать", 0, "to run", "correr"], ["бегать", 0, "to run", "correr"],
         ["лететь", 0, "to fly", "voar"], ["летать", 0, "to fly", "voar"], ["плыть", 0, "to swim", "nadar, navegar"], ["плавать", 0, "to swim", "nadar, navegar"],
         ["нести", 0, "to carry", "levar (a pé), carregar"], ["носить", 0, "to carry", "levar (a pé), carregar"], ["вести", 0, "to lead", "levar, conduzir"], ["водить", 0, "to lead", "levar, conduzir"],
         ["везти", 0, "to convey", "levar (de veículo)"], ["возить", 0, "to convey", "levar (de veículo)"],
         ["приходить", 0, "to come", "chegar (a pé)"], ["уйти", 0, "to leave", "ir embora (a pé)"], ["уходить", 0, "to leave", "ir embora (a pé)"],
         ["войти", 0, "to enter", "entrar (a pé)"], ["входить", 0, "to enter", "entrar (a pé)"], ["выйти", 0, "to exit", "sair (a pé)"], ["выходить", 0, "to go out", "sair (a pé)"],
         ["приехать", 0, "to arrive", "chegar (de veículo)"], ["приезжать", 0, "to arrive", "chegar (de veículo)"], ["уехать", 0, "to go away", "ir embora (de veículo)"], ["уезжать", 0, "to go away", "ir embora (de veículo)"]]
for inf, i, chave, pt in V_PT3:
    x = le_verbo(F6, inf, i, chave, pt)
    if x: VERB[inf] = x
sem_ac = lambda s: "".join(ch for ch in str(s) if ord(ch) != 0x301)
# pares uma direção / várias direções: a nota de uso do Wiktionary de cada verbo tem de dizer a direção e apontar para o outro, e a tabela da Wikipedia tem de trazer o par
tab_pares = [x for x in VM6["wikipedia"]["secoes"]["russian_grammar_verbs_of_motion"]["conteudo"] if x["tipo"] == "tabela"][0]["grade_expandida"]["linhas"]
wp_pares = {(sem_ac(v(l[1])), sem_ac(v(l[2])).split(" ")[0]) for l in tab_pares[1:]}
MOV = []
for uni, multi in [["идти", "ходить"], ["ехать", "ездить"], ["бежать", "бегать"], ["лететь", "летать"], ["плыть", "плавать"], ["нести", "носить"], ["вести", "водить"], ["везти", "возить"]]:
    for w, d, o in ((uni, "unidirectional", multi), (multi, "multidirectional", uni)):
        e = VM6["verbetes"][w]["entradas_verb"][0]; fd = e.get("frase_de_direcao") or {}
        if v(fd.get("direcao")) != d: erros.append(f"RG14 {w}: a nota do verbete não diz {d} ({v(fd.get('direcao'))!r})")
        if o not in [sem_ac(v(c)) for c in (e.get("counterpart") or []) if c]: erros.append(f"RG14 {w}: a nota do verbete não aponta para {o}")
    if (uni, multi) not in wp_pares: erros.append(f"RG14 par {uni}/{multi} fora da tabela da Wikipedia")
    if uni not in VERB or multi not in VERB: erros.append(f"RG14 par {uni}/{multi}: verbo fora do banco"); continue
    pf = next((sem_ac(c) for c in (VERB[uni]["par"] or "").split(" or ") if sem_ac(c) in VERB), None)
    MOV.append({"uni": uni, "multi": multi, "pf": pf})
# verbos com prefixo: [prefixo, palavra em inglês que tem de estar na linha do prefixo na tabela da Wikipedia, sentido, [perfectivo, imperfectivo] ..., frase da tabela (escrita junto), palavra em inglês da tradução, tradução]
tab_pref = [x for x in VM6["wikipedia"]["secoes"]["russian_grammar_verbs_of_motion"]["conteudo"] if x["tipo"] == "tabela"][1]["grade_expandida"]["linhas"]
PREF_PT = [["в-", "entering", "movimento para dentro, entrar", [["войти", "входить"]], "Трамвай остановился, и девушка вошла.", "the girl entered", "O bonde parou e a moça entrou."],
           ["вы-", "exiting", "movimento para fora, sair", [["выйти", "выходить"]], "Она вышла из кабинета.", "exited the office", "Ela saiu do escritório."],
           ["при-", "arrival", "chegada: a pessoa passa a estar no lugar", [["прийти", "приходить"], ["приехать", "приезжать"]], "Он приехал в Москву неделю назад.", "arrived in Moscow", "Ele chegou a Moscou há uma semana."],
           ["у-", "departure", "partida: a pessoa deixa de estar no lugar", [["уйти", "уходить"], ["уехать", "уезжать"]], "Где Игорь? Он уже ушёл.", "already left", "Onde está o Igor? Ele já foi embora."],
           ["по-", "Beginning of unidirectional", "começo do movimento numa direção", [["пойти", None], ["поехать", None]], "Я пошла в университет.", "went to the university", "Eu fui para a universidade."]]
PREF = []
for pre, chave, pt, pares_, fr, chave_fr, fr_pt in PREF_PT:
    lin = next((l for l in tab_pref if v(l[0]).startswith(pre) and chave in v(l[0])), None)
    if not lin: erros.append(f"RG14 prefixo {pre}: linha com {chave!r} não achada"); continue
    ex = v(lin[1])
    if fr.replace(" ", "") not in ex.replace(" ", "") or chave_fr not in ex: erros.append(f"RG14 prefixo {pre}: frase ou tradução fora da linha da tabela")
    for pf_, impf_ in pares_:
        if pf_ not in VERB or VERB[pf_]["asp"] != "pf" or not pf_.startswith(pre[:-1]): erros.append(f"RG14 prefixo {pre}: {pf_} não serve")
        if impf_ and (impf_ not in VERB or VERB[impf_]["asp"] != "impf" or sem_ac(VERB[impf_]["par"] or "") != pf_ or sem_ac(VERB[pf_]["par"] or "") != impf_): erros.append(f"RG14 prefixo {pre}: {impf_}/{pf_} não é par nos verbetes")
    PREF.append({"pre": pre, "pt": pt, "en": v(lin[0]), "pares": pares_, "ru": fr, "frPt": fr_pt, "prep": v(lin[2])})
# frases da seção da Wikipedia (vêm sem acento): [frase, tradução, palavra em inglês da linha anterior da fonte, forma, infinitivo, tempo, índice, tipo, uso]
lin_mov = [v(x["linha"]) for x in VM6["wikipedia"]["secoes"]["russian_grammar_verbs_of_motion"]["conteudo"] if "linha" in x]
U = {"curso": "movimento em curso, numa direção", "hab": "capacidade ou hábito, sem direção", "var": "movimento em várias direções", "rep": "viagens repetidas (ida e volta)", "volta": "no passado: uma ida e volta", "ini": "perfectivo com по-: partiu (e não voltou ainda)"}
FRM_PT = [["Мы идём в библиотеку.", "Estamos indo para a biblioteca.", "library", "идём", "идти", "pres", 3, "uni", "curso"], ["Я шла на работу.", "Eu estava a caminho do trabalho.", "on my way", "шла", "идти", "pass", 1, "uni", "curso"],
          ["Птицы летят на юг.", "Os pássaros estão voando para o sul.", "south", "летят", "лететь", "pres", 5, "uni", "curso"], ["Ребёнок ходит шесть месяцев.", "A criança anda há seis meses.", "six months", "ходит", "ходить", "pres", 2, "multi", "hab"],
          ["Мы ходили по городу весь день.", "Andamos pela cidade o dia todo.", "all day", "ходили", "ходить", "pass", 3, "multi", "var"], ["Она ходит в супермаркет каждую неделю.", "Ela vai ao supermercado toda semana.", "every week", "ходит", "ходить", "pres", 2, "multi", "rep"],
          ["В прошлом году я ездил в Россию.", "No ano passado fui à Rússia (e voltei).", "returned", "ездил", "ездить", "pass", 0, "multi", "volta"], ["Он пошёл к другу.", "Ele foi à casa de um amigo (e ainda não voltou).", "not returned", "пошёл", "пойти", "pass", 0, "pf", "ini"],
          ["Он шёл к другу.", "Ele estava indo à casa de um amigo.", "on his way", "шёл", "идти", "pass", 0, "uni", "curso"], ["Он ходил к другу.", "Ele costumava ir à casa de um amigo.", "used to", "ходил", "ходить", "pass", 0, "multi", "rep"],
          ["Он носит портфель.", "Ele carrega uma pasta.", "briefcase", "носит", "носить", "pres", 2, "multi", "hab"], ["Она несёт домашнее задание на занятия.", "Ela está levando a tarefa para a aula.", "assignment", "несёт", "нести", "pres", 2, "uni", "curso"],
          ["Учитель вёл школьников на экскурсию", "O professor estava levando os alunos a uma excursão.", "field trip", "вёл", "вести", "pass", 0, "uni", "curso"], ["Она водила свою подругу в театр.", "Ela levou a amiga ao teatro (e voltou).", "theatre", "водила", "водить", "pass", 1, "multi", "volta"],
          ["Она везёт бабушку в инвалидном кресле.", "Ela está levando a avó na cadeira de rodas.", "wheelchair", "везёт", "везти", "pres", 2, "uni", "curso"], ["Поезд возил пассажиров в Англию.", "O trem levou os passageiros à Inglaterra (e voltou).", "and back", "возил", "возить", "pass", 0, "multi", "volta"]]
FRM = []
for ru_, pt, chave, forma, inf, tempo, i, tipo, uso in FRM_PT:
    if ru_ not in lin_mov: erros.append(f"RG14 frase fora da fonte: {ru_!r}"); continue
    en = lin_mov[lin_mov.index(ru_) - 1]
    if chave not in en: erros.append(f"RG14 frase {ru_!r}: {chave!r} não está na linha anterior ({en!r})")
    vb = VERB.get(inf); tab = (vb["pres"] if tempo == "pres" else vb["pass"]) if vb else None
    if not vb or forma not in [sem_ac(y) for y in tab[i]] or forma not in ru_.replace(".", "").split(" "): erros.append(f"RG14 frase {ru_!r}: {forma!r} não é {tempo} {i} de {inf}")
    d_ok = (tipo == "pf" and vb and vb["asp"] == "pf") or any(m[tipo] == inf for m in MOV if tipo in ("uni", "multi"))
    if not d_ok: erros.append(f"RG14 frase {ru_!r}: {inf} não é {tipo}")
    FRM.append({"ru": ru_, "pt": pt, "en": en, "forma": forma, "inf": inf, "tempo": tempo, "i": i, "tipo": tipo, "uso": U[uso]})

# pares de aspecto em que os dois verbos estão no banco
PARES_ASP = []
for inf, x in VERB.items():
    # a linha do verbete pode dar mais de um perfectivo ("X or Y"): entra o primeiro que está no banco e é perfectivo
    cands = ["".join(ch for ch in c.strip() if ord(ch) != 0x301) for c in (x["par"] or "").split(" or ")]
    par = next((c for c in cands if c in VERB and VERB[c]["asp"] == "pf"), None)
    if x["asp"] == "impf" and par: PARES_ASP.append([inf, par])
if len(VERB) < 55: erros.append(f"RG11: só {len(VERB)} verbos")

# frases com a forma do verbo marcada: [frase literal, tradução, palavra em inglês da tradução da fonte, forma, infinitivo, tempo ("pres", "pass" ou "fut"), índice da pessoa (ou do gênero, no passado), fonte]
FRV_PT = [
 ["Я говорю́ по-ру́сски.", "Eu falo russo.", "Russian", "говорю́", "говорить", "pres", 0, "wt"], ["Что она́ говори́т?", "O que ela está dizendo?", "saying", "говори́т", "говорить", "pres", 2, "wt"],
 ["Она́ их ви́дит.", "Ela os vê.", "sees", "ви́дит", "видеть", "pres", 2, "wt"], ["Мы плохо ви́дим в темноте́.", "Nós enxergamos mal no escuro.", "poorly", "ви́дим", "видеть", "pres", 3, "wt"],
 ["Я её хорошо́ зна́ю.", "Eu a conheço bem.", "know", "зна́ю", "знать", "pres", 0, "wt"], ["Я зна́ю, где он живёт.", "Eu sei onde ele mora.", "where he lives", "живёт", "жить", "pres", 2, "wt"],
 ["Я не понима́ю, что вы говори́те.", "Eu não entendo o que vocês estão dizendo.", "understand", "понима́ю", "понимать", "pres", 0, "wt"],
 ["Лека́рство помога́ет.", "O remédio está ajudando.", "medicine", "помога́ет", "помогать", "pres", 2, "wt"], ["Я дру́гу помога́ю де́ньгами.", "Eu ajudo um amigo com dinheiro.", "friend", "помога́ю", "помогать", "pres", 0, "wt"],
 ["Вре́мя идёт бы́стро.", "O tempo passa depressa.", "Time", "идёт", "идти", "pres", 2, "wt"], ["Э́ти часы́ не иду́т.", "Este relógio não funciona.", "clock", "иду́т", "идти", "pres", 5, "wt"],
 ["Я мно́гому учу́сь.", "Estou aprendendo muito.", "learning", "учу́сь", "учиться", "pres", 0, "wt"], ["Он у́чится в университе́те.", "Ele estuda na universidade.", "university", "у́чится", "учиться", "pres", 2, "wt"],
 ["Я ему́ помога́л.", "Eu o ajudava.", "helping", "помога́л", "помогать", "pass", 0, "wt"], ["Он ел мя́со и сала́т.", "Ele comia carne e salada.", "meat", "ел", "есть", "pass", 0, "wt"],
 ["Я не зна́ю, когда́ э́то бы́ло.", "Eu não sei quando isso foi.", "when it was", "бы́ло", "быть", "pass", 2, "wt"],
]
todas5 = {v(f["russo"]): f for f in D5["frases"] if isinstance(f, dict) and "russo" in f}
FRV = []
for ru_, pt, chave, forma, inf, tempo, i, de in FRV_PT:
    f = todas5.get(ru_) or todas_fr.get(ru_)
    if not f: erros.append(f"frase de verbo não está na fonte: {ru_!r}"); continue
    en = v(f["traducao"])
    if chave not in en: erros.append(f"frase {ru_!r}: {chave!r} não está na tradução da fonte ({en!r})")
    vb = VERB.get(inf); tab = (vb["pres"] if tempo == "pres" else vb["pass"]) if vb else None
    if not vb or forma.replace("\u0301", "") not in [y.replace("\u0301", "") for y in tab[i]]: erros.append(f"frase {ru_!r}: {forma!r} não é a forma {tempo} {i} de {inf} ({tab[i] if tab else None})")
    if forma not in ru_.replace(",", "").replace(".", "").replace("?", "").split(" "): erros.append(f"frase {ru_!r}: {forma!r} não é palavra da frase")
    FRV.append({"ru": ru_, "pt": pt, "en": en, "forma": forma, "inf": inf, "tempo": tempo, "i": i, "de": f["verbete"]})

# ---------- RG09: adjetivos (tools/russo/dadosR5.json: tabelas de declinação do Wiktionary em inglês) ----------
A_PT = [["новый", "new", "novo"], ["старый", "old", "velho"], ["большой", "big", "grande"], ["маленький", "small", "pequeno"], ["хороший", "good", "bom"], ["плохой", "bad", "ruim"],
        ["красивый", "beautiful", "bonito"], ["русский", "Russian", "russo"], ["синий", "blue", "azul"], ["красный", "red", "vermelho"], ["белый", "white", "branco"], ["чёрный", "black", "preto"],
        ["зелёный", "green", "verde"], ["молодой", "young", "jovem"], ["первый", "first", "primeiro"], ["последний", "last", "último"], ["длинный", "long", "comprido"], ["короткий", "short", "curto"],
        ["быстрый", "fast", "rápido"], ["медленный", "slow", "lento"], ["лёгкий", "light", "leve, fácil"], ["трудный", "difficult", "difícil"], ["тяжёлый", "heavy", "pesado"], ["простой", "simple", "simples"],
        ["сложный", "compl", "complexo"], ["важный", "important", "importante"], ["интересный", "interesting", "interessante"], ["правильный", "correct", "correto"], ["главный", "main", "principal"],
        ["другой", "other", "outro"], ["каждый", "every", "cada"], ["целый", "whole", "inteiro"], ["равный", "equal", "igual"], ["постоянный", "constant", "constante"], ["средний", "middle", "médio"],
        ["полный", "full", "cheio"], ["нужный", "necessary", "necessário"], ["высокий", "high", "alto"], ["низкий", "low", "baixo"], ["горячий", "hot", "quente"], ["холодный", "cold", "frio"],
        ["тёплый", "warm", "morno"], ["дорогой", "expensive", "caro"], ["свободный", "free", "livre"]]
COLS = ("masculine", "neuter", "feminine", "plural")
ADJ = {}
for w, chave, pt in A_PT:
    e = D5["adjetivos"].get(w)
    if not e or not (e.get("tabela") or {}).get("casos"): erros.append(f"RG09 {w}: sem tabela"); continue
    gl = " | ".join([str(v(e.get("glosa")) or "")] + [str(v(g) or "") for g in (e.get("glosas_seguintes") or [])][:8])
    if chave not in gl: erros.append(f"RG09 {w}: {chave!r} não está na definição ({gl[:70]!r})"); continue
    t_ = e["tabela"]; notas = t_.get("notas"); cs = {}
    for k, en in CASOS:
        linha = t_["casos"][en]
        if k == "acc":
            cs["accA"] = [formas(linha[c].get("animate") if "animate" in linha[c] else linha[c], notas) for c in COLS]
            cs["acc"] = [formas(linha[c].get("inanimate") if "inanimate" in linha[c] else linha[c], notas) for c in COLS]
        else: cs[k] = [formas(linha[c], notas) for c in COLS]
    ac = v(e["forma_acentuada"])
    if ac.replace("́", "") != w or w not in [f.replace("́", "") for f in cs["nom"][0]]: erros.append(f"RG09 {w}: forma acentuada {ac!r} ou nominativo masculino {cs['nom'][0]}")
    if any(not f for k in cs for f in cs[k]): erros.append(f"RG09 {w}: célula vazia")
    fc = t_.get("forma_curta") or {}
    ADJ[w] = {"ac": ac, "pt": pt, "casos": cs, "curta": [formas(fc.get(c), notas) for c in COLS] if fc and all(v(fc.get(c)) for c in COLS) else None, "ipa": v(e.get("ipa"))}
# pares adjetivo + substantivo dos laboratórios: combinação montada por mim (não é citação de fonte); todas as formas saem das duas tabelas
PARES_AS = [["новый", "дом"], ["старый", "город"], ["большой", "стол"], ["маленький", "окно"], ["хороший", "друг"], ["плохой", "день"], ["красивый", "улица"], ["русский", "язык"],
            ["синий", "море"], ["красный", "яблоко"], ["белый", "дверь"], ["чёрный", "кот"], ["зелёный", "лес"], ["молодой", "врач"], ["первый", "урок"], ["последний", "неделя"],
            ["длинный", "письмо"], ["короткий", "ответ"], ["быстрый", "поезд"], ["лёгкий", "задача"], ["трудный", "вопрос"], ["тяжёлый", "книга"], ["простой", "решение"], ["сложный", "задача"],
            ["важный", "дело"], ["интересный", "книга"], ["правильный", "ответ"], ["главный", "улица"], ["другой", "человек"], ["высокий", "здание"], ["горячий", "чай"], ["холодный", "вода"],
            ["тёплый", "вечер"], ["дорогой", "словарь"], ["свободный", "место"], ["новый", "школа"], ["старый", "мать"], ["большой", "семья"], ["маленький", "девочка"], ["хороший", "учитель"]]
for a_, n_ in PARES_AS:
    if a_ not in ADJ or n_ not in DECL: erros.append(f"RG09 par {a_} + {n_}: palavra fora do banco")
if len(ADJ) < 40: erros.append(f"RG09: só {len(ADJ)} adjetivos")

# ---------- RG10: possessivos e demonstrativos (dadosR5.json: tabelas do Wiktionary em inglês), no mesmo formato dos adjetivos ----------
PS_PT = [["мой", "my", "meu"], ["твой", "your", "teu, seu (de você)"], ["наш", "our", "nosso"], ["ваш", "your", "de vocês; do senhor"], ["свой", "one's own", "o seu próprio"],
         ["этот", "this", "este"], ["тот", "that", "aquele"], ["сам", "self", "mesmo, em pessoa"], ["чей", "whose", "de quem"]]
POSS = {}
for w, chave, pt in PS_PT:
    es = (D5["possessivos_e_demonstrativos"].get(w) or {}).get("entradas") or []
    e = next((x for x in es if ((x.get("tabela") or {}).get("casos") or {}).get("nominative", {}).get("masculine")), None)
    if not e: erros.append(f"RG10 {w}: sem tabela"); continue
    gl = " | ".join(str(v(x.get("glosa")) or "") for x in es)
    if chave not in gl: erros.append(f"RG10 {w}: {chave!r} não está na definição ({gl[:70]!r})"); continue
    t_ = e["tabela"]; notas = t_.get("notas"); cs = {}
    for k, en in CASOS:
        linha = t_["casos"][en]
        if k == "acc":
            cs["accA"] = [formas(linha[c].get("animate") if "animate" in linha[c] else linha[c], notas) for c in COLS]
            cs["acc"] = [formas(linha[c].get("inanimate") if "inanimate" in linha[c] else linha[c], notas) for c in COLS]
        else: cs[k] = [formas(linha[c], notas) for c in COLS]
    if w not in [f.replace("́", "") for f in cs["nom"][0]] or any(not f for k in cs for f in cs[k]): erros.append(f"RG10 {w}: nominativo {cs['nom'][0]} ou célula vazia")
    POSS[w] = {"ac": v(e["forma_acentuada"]), "pt": pt, "casos": cs, "curta": None, "ipa": v(e.get("ipa"))}
# os de terceira pessoa: a fonte diz que se usa o genitivo do pronome pessoal (его, её, их); o gerador confere que são mesmo esse genitivo
DONO = [["я", "мой"], ["ты", "твой"], ["мы", "наш"], ["вы", "ваш"]]
DONO3 = []
for pron, forma in [["он", "его"], ["она", "её"], ["они", "их"]]:
    if forma not in [f.replace("́", "") for f in PRON[pron]["casos"]["gen"]]: erros.append(f"RG10: {forma} não é o genitivo de {pron}")
    es = (D5["possessivos_e_demonstrativos"].get(forma) or {}).get("entradas") or []
    if not any("possessive" in str(v(x.get("glosa"))) for x in es): erros.append(f"RG10: verbete {forma} sem a definição possessiva")
    DONO3.append([pron, next(f for f in PRON[pron]["casos"]["gen"] if f.replace("́", "") == forma)])
PARES_PS = [["мой", "брат"], ["мой", "сестра"], ["мой", "письмо"], ["твой", "книга"], ["твой", "друг"], ["твой", "окно"], ["наш", "школа"], ["наш", "город"], ["наш", "дело"],
            ["ваш", "учитель"], ["ваш", "семья"], ["ваш", "письмо"], ["этот", "дом"], ["этот", "книга"], ["этот", "слово"], ["тот", "человек"], ["тот", "улица"], ["тот", "здание"],
            ["мой", "мать"], ["наш", "врач"], ["этот", "задача"], ["тот", "день"], ["твой", "отец"], ["ваш", "дочь"]]
for a_, n_ in PARES_PS:
    if a_ not in POSS or n_ not in DECL: erros.append(f"RG10 par {a_} + {n_}: palavra fora do banco")
# frases da fonte com um possessivo ou demonstrativo: [frase, tradução, palavra em inglês da tradução, forma, palavra, caso, coluna (0 m, 1 n, 2 f, 3 pl), fonte]
FRP_PT = [["Я Том, а э́то моя́ ма́ма.", "Eu sou o Tom, e esta é a minha mãe.", "my mom", "моя́", "мой", "nom", 2, "wt"], ["У моего брата есть обед", "Meu irmão tem um almoço.", "My brother has a lunch", "моего", "мой", "gen", 0, "wp"],
          ["Он у́чится у свои́х друзе́й.", "Ele aprende com os próprios amigos.", "his friends", "свои́х", "свой", "gen", 3, "wt"], ["Э́ти часы́ не иду́т.", "Este relógio não funciona.", "This clock", "Э́ти", "этот", "nom", 3, "wt"],
          ["Э́тот костю́м ему́ идёт.", "Este terno fica bem nele.", "This suit", "Э́тот", "этот", "nom", 0, "wt"]]
FRP = []
for ru_, pt, chave, forma, w, caso, col, de in FRP_PT:
    if de == "wt":
        f = todas5.get(ru_) or todas_fr.get(ru_)
        if not f: erros.append(f"RG10 frase não está na fonte: {ru_!r}"); continue
        en = v(f["traducao"])
        if chave not in en: erros.append(f"RG10 frase {ru_!r}: {chave!r} não está na tradução da fonte ({en!r})")
    else:
        if ru_ not in wp_txt or chave not in wp_txt: erros.append(f"RG10 frase fora da Wikipedia: {ru_!r}"); continue
        en = chave
    if forma.replace("́", "").lower() not in [y.replace("́", "").lower() for y in POSS[w]["casos"][caso][col]] or forma not in ru_: erros.append(f"RG10 frase {ru_!r}: {forma!r} não é {caso} coluna {col} de {w} ({POSS[w]['casos'][caso][col]})")
    FRP.append({"ru": ru_, "pt": pt, "en": en, "forma": forma, "w": w, "caso": caso, "col": col})

# ---------- RG15: preposições e o caso que cada uma pede (dadosR6.json: verbetes do Wiktionary; listas por caso da Wikipedia) ----------
P6 = D6["preposicoes"]["verbetes"]
CASO_EN = {"accusative": "acc", "genitive": "gen", "dative": "dat", "instrumental": "ins", "prepositional": "prep", "nominative": "nom"}
def casos_da_marca(m):
    # "[with instrumental or (rarely) genitive]" -> só o primeiro caso (o resto vem marcado como raro, literário ou alternativo)
    achados = sorted((m.find(k), c) for k, c in CASO_EN.items() if k in m)
    return [achados[0][1]] if achados else []
def defs_prep(w):
    ep = P6[w]["entradas"][0]; out = []
    linha = [c for x in (ep.get("regencia_na_linha_do_verbete") or []) if x and v(x) for c in casos_da_marca(v(x))][:1]
    def anda(defs, mae):
        for df in defs or []:
            mc = [c for m in (df.get("marcas_de_caso") or []) for c in casos_da_marca(v(m))] or mae
            exs = [(v(e["russo"]), v(e["traducao"])) for e in (df.get("exemplos") or []) if e.get("traducao") and v(e.get("traducao")) and v(e.get("russo"))]
            out.append((mc, str(v(df["definicao"])), exs)); anda(df.get("subdefinicoes"), mc)
    anda(ep["definicoes"], linha); return ep, out
# [preposição, caso, palavra em inglês que tem de estar na definição marcada com esse caso, sentido em português]
PREP_PT = [["в", "prep", "(location) in", "em, dentro de (onde?)"], ["в", "acc", "(direction) to", "para, para dentro de (para onde?)"], ["в", "acc", "(time) at", "em, a (hora, dia)"],
           ["на", "prep", "on, upon", "em, em cima de (onde?)"], ["на", "acc", "onto, on", "para, para cima de (para onde?)"], ["на", "acc", "divided by", "por (na divisão)"],
           ["с", "ins", "with", "com"], ["с", "gen", "from, off", "de, de cima de (de onde?)"], ["к", "dat", "to, toward", "até, em direção a"],
           ["у", "gen", "at, by, near", "junto de, perto de"], ["у", "gen", "in the possession of", "na posse de (construção de \"ter\")"], ["о", "prep", "about, of, on", "sobre, a respeito de"],
           ["из", "gen", "from", "de, de dentro de (de onde?)"], ["от", "gen", "starting point", "de, a partir de (afastamento)"], ["до", "gen", "up to, till", "até"],
           ["для", "gen", "for", "para (em benefício de)"], ["без", "gen", "without", "sem"], ["по", "dat", "across", "por, ao longo de"],
           ["за", "ins", "behind", "atrás de, além de (onde?)"], ["за", "acc", "for; to; by", "por, a favor de"], ["над", "ins", "above, over", "acima de, sobre"],
           ["под", "ins", "being beneath", "embaixo de (onde?)"], ["под", "acc", "movement to beneath", "para baixo de (para onde?)"], ["перед", "ins", "in front of", "diante de, antes de"],
           ["между", "ins", "between", "entre"], ["при", "prep", "during", "em, durante, na presença de"], ["про", "acc", "about, concerning", "sobre, a respeito de"],
           ["через", "acc", "through", "através de"], ["через", "acc", "(time) in, after", "daqui a, depois de (tempo)"], ["после", "gen", "after", "depois de"],
           ["около", "gen", "near", "perto de, cerca de"], ["кроме", "gen", "except", "exceto, além de"], ["вокруг", "gen", "round", "em volta de"], ["против", "gen", "against", "contra"],
           ["среди", "gen", "among", "entre, no meio de"], ["вместо", "gen", "instead of", "em vez de"], ["из-за", "gen", "because of", "por causa de"],
           ["благодаря", "dat", "thanks to", "graças a"], ["сквозь", "acc", "through", "através de (atravessando)"]]
PREP = []
for w, caso, chave, pt in PREP_PT:
    if w not in P6: erros.append(f"RG15 {w}: sem verbete"); continue
    ep, ds = defs_prep(w)
    d = next((x for x in ds if caso in x[0] and chave in x[1]), None)
    if not d: erros.append(f"RG15 {w} + {caso}: definição com {chave!r} não achada"); continue
    ex = next(([r_, e_] for r_, e_ in d[2] if len(r_) <= 34), None)
    PREP.append({"p": w, "ac": v(ep["forma_acentuada"]), "caso": caso, "pt": pt, "en": d[1][:90], "ex": ex})
# conferência cruzada com as listas por caso da Wikipedia: o que as duas fontes dão para a mesma preposição tem de ter um caso em comum
WPC = D6["preposicoes"]["wikipedia_listas_por_caso_copiadas_de_dadosR4"]["casos"]
wp_casos = {}
for nome, bloco in WPC.items():
    for x in bloco.get("preposicoes") or []: wp_casos.setdefault(v(x["preposicao"]) if isinstance(x["preposicao"], dict) else x["preposicao"], set()).add(CASO_EN.get(nome, nome))
PREP_WP = 0
for w in sorted({x["p"] for x in PREP}):
    meus = {x["caso"] for x in PREP if x["p"] == w}
    if w in wp_casos:
        PREP_WP += 1
        if not (meus & wp_casos[w]): erros.append(f"RG15 {w}: Wiktionary {sorted(meus)} e Wikipedia {sorted(wp_casos[w])} sem caso em comum")
# formas alternativas (во, со, ко...): linha "X — used before ..." do verbete
ALT_PREP = []
for w in ("в", "с", "к", "о"):
    for fa in P6[w].get("formas_alternativas") or []:
        s = str(v(fa))
        if "pre-1918" in s or "—" not in s: continue
        ALT_PREP.append({"p": w, "alt": s.split(" ")[0], "en": s})
# onde? para onde? de onde?: exemplos dos verbetes. [preposição, exemplo literal, palavra em inglês da tradução da fonte, tradução, pergunta]
ONDE_PT = [["в", "Он в теа́тре", "at (in) the theater", "Ele está no teatro.", "onde"], ["в", "Он идёт в теа́тр", "going to", "Ele está indo ao teatro.", "para"],
           ["на", "на столе́", "on the table", "em cima da mesa", "onde"], ["на", "на стол", "onto the table", "para cima da mesa", "para"],
           ["на", "на по́чте", "at the post office", "no correio", "onde"], ["на", "на по́чту", "to the post office", "para o correio", "para"], ["с", "с по́чты", "from the post office", "do correio", "de"],
           ["под", "пла́вать под водо́й", "swim underwater", "nadar embaixo d'água", "onde"], ["под", "нырну́ть под во́ду", "dive underwater", "mergulhar para debaixo d'água", "para"],
           ["к", "к до́му", "to the house", "até a casa", "para"], ["из", "Он приезжа́ет из Москвы́", "from Moscow", "Ele vem de Moscou.", "de"], ["у", "сиде́ть у окна́", "by the window", "estar sentado junto à janela", "onde"],
           ["за", "за столо́м", "at the table", "à mesa", "onde"], ["с", "с по́ля", "from the field", "do campo", "de"]]
ONDE = []
for w, ru_, chave, pt, perg in ONDE_PT:
    ep, ds = defs_prep(w)
    d = next((x for x in ds if any(r_ == ru_ and chave in e_ for r_, e_ in x[2])), None)
    if not d or not d[0]: erros.append(f"RG15 exemplo {ru_!r}: não achado com {chave!r}"); continue
    ONDE.append({"p": w, "ru": ru_, "pt": pt, "perg": perg, "caso": d[0][0]})
# preposição + substantivo dos laboratórios: combinação montada por mim (não é citação); a forma sai da tabela do substantivo
PARES_PREP = [["в", "prep", "школа"], ["в", "acc", "школа"], ["в", "prep", "город"], ["в", "acc", "город"], ["на", "prep", "стол"], ["на", "acc", "стол"], ["на", "prep", "работа"], ["на", "acc", "работа"],
              ["из", "gen", "город"], ["из", "gen", "школа"], ["к", "dat", "брат"], ["к", "dat", "сестра"], ["с", "ins", "друг"], ["с", "ins", "сестра"], ["у", "gen", "окно"], ["у", "gen", "брат"],
              ["о", "prep", "книга"], ["о", "prep", "работа"], ["без", "gen", "вода"], ["без", "gen", "друг"], ["для", "gen", "сестра"], ["для", "gen", "мама"], ["под", "ins", "стол"], ["над", "ins", "город"],
              ["перед", "ins", "дом"], ["после", "gen", "урок"], ["около", "gen", "дом"], ["от", "gen", "дом"], ["до", "gen", "город"], ["по", "dat", "улица"], ["за", "ins", "дом"], ["про", "acc", "книга"],
              ["вокруг", "gen", "стол"], ["через", "acc", "улица"], ["против", "gen", "сила"], ["вместо", "gen", "брат"]]
for w, caso, n in PARES_PREP:
    if not any(x["p"] == w and x["caso"] == caso for x in PREP): erros.append(f"RG15 par {w} + {caso}: uso fora da tabela")
    if n not in DECL or not DECL[n]["casos"][caso][0]: erros.append(f"RG15 par {w} + {n}: sem forma")

# ---------- RG16: numerais e tempo (dadosR6.json: verbetes do Wiktionary; seção "Numerals" de Russian declension, Wikipedia) ----------
N6 = D6["numerais"]["verbetes"]; T6 = D6["tempo"]["verbetes"]
txt_num = json.dumps(D6["numerais"], ensure_ascii=False) + json.dumps(D6["tempo"], ensure_ascii=False)
# cardinais: [palavra, valor, palavra em inglês que tem de estar na definição]
N_NUM = [["ноль", 0, "zero"], ["один", 1, "one (1)"], ["два", 2, "two (2)"], ["три", 3, "three (3)"], ["четыре", 4, "four (4)"], ["пять", 5, "five (5)"], ["шесть", 6, "six (6)"], ["семь", 7, "seven (7)"],
         ["восемь", 8, "eight (8)"], ["девять", 9, "nine (9)"], ["десять", 10, "ten (10)"], ["одиннадцать", 11, "eleven"], ["двенадцать", 12, "twelve"], ["тринадцать", 13, "thirteen"],
         ["четырнадцать", 14, "fourteen"], ["пятнадцать", 15, "fifteen"], ["шестнадцать", 16, "sixteen"], ["семнадцать", 17, "seventeen"], ["восемнадцать", 18, "eighteen"], ["девятнадцать", 19, "nineteen"],
         ["двадцать", 20, "twenty"], ["тридцать", 30, "thirty"], ["сорок", 40, "forty"], ["пятьдесят", 50, "fifty"], ["шестьдесят", 60, "sixty"], ["семьдесят", 70, "seventy"], ["восемьдесят", 80, "eighty"],
         ["девяносто", 90, "ninety"], ["сто", 100, "hundred"], ["двести", 200, "two hundred"], ["триста", 300, "three hundred"], ["четыреста", 400, "four hundred"], ["пятьсот", 500, "five hundred"],
         ["тысяча", 1000, "thousand"], ["миллион", 1000000, "million"]]
def ent_num(w, classes):
    return next((e for e in N6.get(w, {}).get("entradas", []) if v(e.get("classe")) in classes), None)
NUM = []
for w, n, chave in N_NUM:
    e = ent_num(w, ("Numeral", "Noun"))
    if not e: erros.append(f"RG16 {w}: sem entrada"); continue
    gl = " | ".join([str(v(e.get("glosa")) or "")] + [str(v(g) or "") for g in (e.get("glosas_seguintes") or [])])
    if chave not in gl: erros.append(f"RG16 {w}: {chave!r} não está na definição ({gl[:60]!r})")
    ac = v(e["forma_acentuada"])
    if sem_ac(ac) != w: erros.append(f"RG16 {w}: forma acentuada {ac!r}")
    x = {"w": w, "ac": ac, "n": n}
    if n in (1, 2):
        lin = str(v(e.get("linha_do_verbete")))
        mf = re.search(r"feminine ([^\s,)]+)", lin); mn = re.search(r"neuter ([^\s,)]+)", lin)
        if not mf: erros.append(f"RG16 {w}: feminino não achado na linha do verbete")
        else: x["f"] = mf.group(1)
        if mn: x["nt"] = mn.group(1)
    NUM.append(x)
# centenas de 600 a 900: só existem na tabela da Wikipedia ("200, 300, ... 900", linha Nominative)
for c in D6["numerais"]["wikipedia"]["secoes"]["russian_declension_numerals"]["conteudo"]:
    if c.get("tipo") == "tabela" and str(v(c.get("legenda_ou_linha_anterior"))).startswith("200, 300"):
        g = c["grade_expandida"]["linhas"]; cab = [str(v(y)).strip() for y in g[0]]; nomi = next(l for l in g if str(v(l[0])).startswith("Nominative"))
        for k, y in zip(cab, nomi):
            if k.isdigit() and int(k) >= 600: NUM.append({"w": sem_ac(v(y)), "ac": v(y), "n": int(k), "wp": True})
        # as que o Wiktionary também dá têm de bater com a tabela
        for k, y in zip(cab, nomi):
            if k.isdigit() and int(k) < 600 and sem_ac(v(y)) != next(x["w"] for x in NUM if x["n"] == int(k)): erros.append(f"RG16 centena {k}: Wikipedia {v(y)!r} diferente do Wiktionary")
if len([x for x in NUM if 600 <= x["n"] <= 900]) != 4: erros.append("RG16: centenas de 600 a 900 não achadas na tabela da Wikipedia")
NUM.sort(key=lambda x: x["n"])
ORD = []
for w, n, chave in [["первый", 1, "first"], ["второй", 2, "second"], ["третий", 3, "third"], ["четвёртый", 4, "fourth"], ["пятый", 5, "fifth"], ["шестой", 6, "sixth"], ["седьмой", 7, "seventh"], ["восьмой", 8, "eighth"], ["девятый", 9, "ninth"], ["десятый", 10, "tenth"]]:
    e = next((e for e in N6.get(w, {}).get("entradas", []) if chave in str(v(e.get("glosa")))), None)
    if not e: erros.append(f"RG16 ordinal {w}: {chave!r} não achado"); continue
    ORD.append({"w": w, "ac": v(e["forma_acentuada"]), "n": n})
# palavras de tempo: [palavra, palavra em inglês da definição, tradução, tipo]
T_PT = [["секунда", "second", "segundo", "unid"], ["минута", "minute", "minuto", "unid"], ["час", "hour", "hora", "unid"], ["день", "day", "dia", "unid"], ["неделя", "week", "semana", "unid"],
        ["месяц", "month", "mês", "unid"], ["год", "year", "ano", "unid"], ["век", "century", "século", "unid"],
        ["понедельник", "Monday", "segunda-feira", "dia"], ["вторник", "Tuesday", "terça-feira", "dia"], ["среда", "Wednesday", "quarta-feira", "dia"], ["четверг", "Thursday", "quinta-feira", "dia"],
        ["пятница", "Friday", "sexta-feira", "dia"], ["суббота", "Saturday", "sábado", "dia"], ["воскресенье", "Sunday", "domingo", "dia"],
        ["январь", "January", "janeiro", "mes"], ["февраль", "February", "fevereiro", "mes"], ["март", "March", "março", "mes"], ["апрель", "April", "abril", "mes"], ["май", "May", "maio", "mes"],
        ["июнь", "June", "junho", "mes"], ["июль", "July", "julho", "mes"], ["август", "August", "agosto", "mes"], ["сентябрь", "September", "setembro", "mes"], ["октябрь", "October", "outubro", "mes"],
        ["ноябрь", "November", "novembro", "mes"], ["декабрь", "December", "dezembro", "mes"],
        ["утро", "morning", "manhã", "parte"], ["вечер", "evening", "noite (até a hora de dormir), tarde", "parte"], ["ночь", "night", "noite (madrugada)", "parte"],
        ["весна", "spring", "primavera", "est"], ["лето", "summer", "verão", "est"], ["осень", "autumn", "outono", "est"], ["зима", "winter", "inverno", "est"]]
def um(x):
    x = v(x)
    if isinstance(x, list): x = x[0] if x else None
    if isinstance(x, dict): x = v(next(iter(x.values()), None))
    return x
TEMPO = {}
for w, chave, pt, tipo in T_PT:
    e = T6.get(w)
    if not e or not e.get("tabela"): erros.append(f"RG16 tempo {w}: sem verbete ou sem tabela"); continue
    gl = " | ".join([str(v(e.get("glosa")) or "")] + [str(v(g) or "") for g in (e.get("glosas_seguintes") or [])])
    if chave not in gl: erros.append(f"RG16 tempo {w}: {chave!r} não está na definição ({gl[:60]!r})")
    cs = e["tabela"]["casos"]; casos = {}
    for k, en in CASOS:
        c = cs.get(en) or {}
        casos[k] = [um(c.get("singular")), um(c.get("plural"))]
    if not casos["nom"][0] or not casos["gen"][0]: erros.append(f"RG16 tempo {w}: tabela incompleta {casos}")
    TEMPO[w] = {"ac": v(e["forma_acentuada"]), "pt": pt, "tipo": tipo, "g": str(v(e.get("genero")) or "").split(" ")[0], "casos": casos}
# formas especiais depois de número, ditas nas notas de uso
nota_chas = " ".join(str(v(x)) for x in (T6["час"]["entradas"][0].get("notas_de_uso") or []))
if "два часа́" not in nota_chas or "stress of the genitive singular moves" not in nota_chas: erros.append("RG16: nota de час (два часа́) não achada")
else: TEMPO["час"]["cont"] = {"sg": "часа́"}
nota_god = " ".join(str(v(x)) for x in (T6["год"]["entradas"][0].get("notas_de_uso") or []))
if "пять лет" not in nota_god or "instead of годо́в" not in nota_god: erros.append("RG16: nota de год (пять лет) não achada")
else: TEMPO["год"]["cont"] = {"pl": "лет"}
# expressões "em tal dia" / "em tal mês" / "todo tal dia": linhas "X ― transliteração ― tradução" dos verbetes
QUANDO = []
for w, x in TEMPO.items():
    if x["tipo"] not in ("dia", "mes"): continue
    en_nome = next(c for ww, c, _, _ in T_PT if ww == w)
    for l in (T6[w].get("linhas_com_expressao_de_tempo") or {}).get("linhas") or []:
        ps = str(v(l)).split(" ― ")
        if len(ps) != 3 or len(ps[0].split(" ")) != 2: continue
        if ps[2] == ("on " if x["tipo"] == "dia" else "in ") + en_nome: QUANDO.append({"w": w, "ru": ps[0], "en": ps[2], "tipo": "em"})
        elif x["tipo"] == "dia" and ps[2] == "on " + en_nome + "s": QUANDO.append({"w": w, "ru": ps[0], "en": ps[2], "tipo": "todo"})
QUANDO = [q for i, q in enumerate(QUANDO) if not any(z["w"] == q["w"] and z["ru"] == q["ru"] for z in QUANDO[:i])]
if sum(1 for q in QUANDO if q["tipo"] == "em") != 19 or sum(1 for q in QUANDO if q["tipo"] == "todo") != 7: erros.append(f"RG16: expressões de dia e mês incompletas ({len(QUANDO)}): " + "; ".join(q["tipo"] + " " + q["ru"] for q in QUANDO))
# exemplos da fonte de numeral + substantivo: [número, frase literal, substantivo no nominativo se estiver no banco (senão None)]
EX_NUM_PT = [[151, "сто пятьдеся́т оди́н челове́к", "человек"], [3, "три соба́ки", None], [42, "со́рок два окна́", "окно"], [5, "пять я́блок", "яблоко"], [10, "де́сять рубле́й", None],
             [111, "сто оди́ннадцать ме́тров", None], [3, "три до́ма", "дом"], [2, "два ма́льчика", "мальчик"], [2, "две кни́ги", "книга"], [52, "пятьдеся́т два ма́льчика", "мальчик"],
             [5, "пять ма́льчиков", "мальчик"], [55, "пятьдеся́т пять книг", "книга"], [40, "со́рок ма́льчиков", "мальчик"], [2, "два часа́", "час"], [23, "два́дцать три часа́", "час"],
             [44, "со́рок четы́ре часа́", "час"], [1, "оди́н год", "год"], [2, "два го́да", "год"], [5, "пять лет", "год"], [153, "сто пятьдеся́т три ры́бы", None], [21, "два́дцать оди́н год", "год"], [25, "два́дцать пять лет", "год"]]
EX_NUM = []
for n, fr, w in EX_NUM_PT:
    if fr not in txt_num: erros.append(f"RG16 exemplo fora da fonte: {fr!r}"); continue
    if w and w not in DECL and w not in TEMPO: erros.append(f"RG16 exemplo {fr!r}: {w} fora do banco"); continue
    ps = fr.split(" "); EX_NUM.append({"n": n, "ru": fr, "nome": " ".join(ps[:-1]), "subst": ps[-1], "w": w, "g": (DECL[w]["g"] if w in DECL else TEMPO[w]["g"]) if w else None})

# ---------- RG17: imperativo e condicional (dadosR6.json: "Moods" de Russian grammar, "Imperative mood" e "Conditional mood" da Wikipedia; verbetes бы, пусть, давай, давайте, чтобы, если) ----------
I6 = D6["imperativo_e_condicional"]
trad6 = {}
for f in D6["frases"]:
    if isinstance(f, dict) and v(f.get("russo")) and v(f.get("traducao")): trad6[v(f["russo"])] = (v(f["traducao"]), f.get("verbete"))
txt_modos = json.dumps(I6["wikipedia"]["secoes"], ensure_ascii=False)
# [frase literal, palavra em inglês da tradução da fonte, tradução, tipo, fonte]
FRI_PT = [["Пойди́те со мной.", "Come with me", "Venham comigo. / Venha comigo. (formal)", "imp", "wt"], ["Иди́ сюда́, и́ли тебя́ пойма́ю!", "Come here", "Vem cá, senão eu te pego!", "imp", "wt"],
          ["Бу́дьте как до́ма.", "at home", "Fique à vontade. (Esteja como em casa.)", "imp", "wt"],
          ["Дава́й чита́ть", "Let’s read", "Vamos ler.", "davai", "wt"], ["Дава́йте начина́ть", "get started", "Vamos começar.", "davai", "wt"], ["Дава́й встре́тимся до рабо́ты.", "meet before work", "Vamos nos encontrar antes do trabalho.", "davai", "wt"],
          ["Дава́й я тебе́ помогу́", "Let me help", "Deixa eu te ajudar.", "davai", "wt"],
          ["Пусть он пи́шет", "Let him write", "Que ele escreva. / Deixe que ele escreva.", "pust", "wt"], ["Пусть X (икс) равно́ двум.", "Let X be 2", "Seja X igual a 2.", "pust", "wt"],
          ["Пусть она́ не ду́мает, что мы о ней забы́ли.", "Let her not think", "Que ela não pense que nos esquecemos dela.", "pust", "wt"],
          ["Я бы пошёл в кино́, е́сли бы у меня́ бы́ло вре́мя.", "if I had had time", "Eu teria ido ao cinema, se tivesse tido tempo.", "cond", "wt"], ["Я бы сказа́л — э́то большо́е «да».", "I'd say", "Eu diria que é um grande \"sim\".", "cond", "wt"],
          ["Я хотел бы петь", "I would like", "Eu gostaria de cantar.", "cond", "wp"], ["что́бы я не забы́л", "so that I won’t forget", "para que eu não esqueça", "cond", "wt"]]
FRI = []
for ru_, chave, pt, tipo, de in FRI_PT:
    if de == "wt":
        if ru_ not in trad6: erros.append(f"RG17 frase fora da fonte: {ru_!r}"); continue
        en = trad6[ru_][0]
        if chave not in en: erros.append(f"RG17 frase {ru_!r}: {chave!r} não está na tradução ({en!r})")
    else:
        if ru_ not in txt_modos or chave not in txt_modos: erros.append(f"RG17 frase fora da Wikipedia: {ru_!r}"); continue
        en = chave
    FRI.append({"ru": ru_, "pt": pt, "en": en, "tipo": tipo})
# tabela do condicional de сказать (Wikipedia): células "я бы сказа́ л" (a página separa a terminação com espaço)
COND_WP = []
for c in I6["wikipedia"]["secoes"]["russian_grammar_moods"]["conteudo"]:
    if c.get("tipo") == "tabela" and str(v(c.get("legenda_ou_linha_anterior"))).startswith("Conditional of the verb"):
        for lin in c["grade_expandida"]["linhas"]:
            for cel in lin:
                s = str(v(cel)); m = re.match(r"^(я|ты|он|она́|оно́|мы|вы|они́) бы (сказа́) (л[аои]?)$", s)
                if m: COND_WP.append([sem_ac(m.group(1)), m.group(1) + " бы " + m.group(2) + m.group(3)])
COND_WP = [x for i, x in enumerate(COND_WP) if x not in COND_WP[:i]]
if len(COND_WP) < 8: erros.append(f"RG17: tabela do condicional lida pela metade ({COND_WP})")

for a in avisos: print("aviso:", a)
if erros:
    for e in erros: print("ERRO:", e)
    print(f"{len(erros)} erro(s): nada gravado."); sys.exit(1)
RU = {"ALF": ALF, "PAL": PAL, "PAR": PAR, "LISTA": LISTA, "VOG": VOG, "SONS": SONS, "DUR": DUR, "ITAL": ITAL, "WT": WT, "EXC": EXC, "RED": RED, "ENS": ENS, "DEZ": DEZ, "REG": REG, "ESTR": ESTR, "NOM": NOM, "IRR": IRR, "DECL": DECL, "VERB": VERB, "PRON": PRON, "FRASES": FRASES, "FRASES2": FRASES2, "PARES_ASP": PARES_ASP, "FRV": FRV, "ADJ": ADJ, "PARES_AS": PARES_AS, "POSS": POSS, "DONO": DONO, "DONO3": DONO3, "PARES_PS": PARES_PS, "FRP": FRP, "MOV": MOV, "PREF": PREF, "FRM": FRM, "PREP": PREP, "ALT_PREP": ALT_PREP, "ONDE": ONDE, "PARES_PREP": PARES_PREP, "PREP_WP": PREP_WP, "NUM": NUM, "ORD": ORD, "TEMPO": TEMPO, "QUANDO": QUANDO, "EX_NUM": EX_NUM, "FRI": FRI, "COND_WP": COND_WP}
saida = os.path.join(R, "..", "..", "assets", "sims", "russo", "dados.js")
txt = ("/* GERADO por tools/russo/gera-russo.py a partir de tools/russo/dadosR.json. NÃO editar à mão: corrigir no gerador e rodar de novo.\n"
       "   Letras: tabela \"Letters\" da Wikipedia em inglês (Russian alphabet). Palavras: verbetes do Wiktionary em inglês. */\n"
       "(function () { const SIM = (window.SIM = window.SIM || {});\nSIM.RU = " + json.dumps(RU, ensure_ascii=False, separators=(",", ":")) + ";\n})();\n")
open(saida, "w", encoding="utf-8").write(txt)
print(f"gravado: {len(ALF)} letras, {len(PAL)} palavras, {len(PAR)} pares de acento; listas: " + ", ".join(f"{k} {len(x)}" for k, x in LISTA.items()))
print("RG02:", len(RED["akanye"]), "akanye,", len(RED["mole"]), "pares depois de mole,", len(RED["ikanye"]), "pares ikanye,", len(ENS), "ensurdecimento,", len(DEZ), "dezenas,", ESTR)
print("RG03:", len(NOM), "substantivos;", sum(1 for x in NOM if x["pl"]), "com plural;", len(IRR), "irregulares conferidos com a Wikipedia")
print("RG04:", len(DECL), "declinações;", len(VERB), "verbos;", len(PRON), "pronomes;", len(FRASES), "frases")
print("RG11:", len(VERB), "verbos;", len(PARES_ASP), "pares de aspecto;", len(FRV), "frases de verbo")
print("RG14:", len(MOV), "pares de movimento;", len(PREF), "prefixos;", len(FRM), "frases")
print("RG15:", len(PREP), "usos de", len({x["p"] for x in PREP}), "preposições;", PREP_WP, "também nas listas da Wikipedia;", len(ONDE), "exemplos onde/para onde;", len(PARES_PREP), "pares;", sum(1 for x in PREP if x["ex"]), "com exemplo;", [x["alt"] for x in ALT_PREP])
print("RG16:", len(NUM), "cardinais;", len(ORD), "ordinais;", len(TEMPO), "palavras de tempo;", len(QUANDO), "expressões de dia e mês;", len(EX_NUM), "exemplos de numeral + substantivo")
print("RG17:", len(FRI), "frases de modo;", len(COND_WP), "formas do condicional na tabela da Wikipedia:", COND_WP)
print("RG09:", len(ADJ), "adjetivos;", len(PARES_AS), "pares adjetivo + substantivo")
print("RG10:", len(POSS), "possessivos e demonstrativos;", len(PARES_PS), "pares;", len(FRP), "frases")
print("grupos:", {g: "".join(x["M"] for x in ALF if x["grupo"] == g) for g in ("amiga", "falsa", "nova")})
