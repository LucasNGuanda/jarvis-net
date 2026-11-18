#!/usr/bin/env python3
"""Confere que nenhuma palavra russa dos temas e dos laboratórios foi escrita de memória.

Para cada arquivo de temas/russo/ e assets/sims/russo/ (menos o dados.js, que é gerado):
  toda sequência de 2 ou mais letras cirílicas escrita no arquivo tem de aparecer, como palavra inteira, no texto de
  tools/russo/dadosR.json (valores e trechos baixados da Wikipedia e do Wiktionary em inglês). Se a palavra estiver escrita com acento
  (U+0301), é a forma acentuada que tem de estar na fonte. Transcrições entre colchetes ([brat], [ʐɨtʲ]) também têm de estar na fonte.
Uso: python3 tools/russo/confere-russo.py"""
import json, re, os, sys, glob
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
fonte = open(os.path.join(R, "tools", "russo", "dadosR.json"), encoding="utf-8").read()
fonte = json.dumps(json.loads(fonte), ensure_ascii=False)  # desfaz \uXXXX, se houver
fonte += json.dumps(json.load(open(os.path.join(R, "tools", "russo", "dadosR3.json"), encoding="utf-8")), ensure_ascii=False)  # RG03 em diante
fonte += json.dumps(json.load(open(os.path.join(R, "tools", "russo", "dadosR4.json"), encoding="utf-8")), ensure_ascii=False)  # RG04 em diante
CIR = r"Ѐ-ӿ́"
palavras_fonte = set(re.findall(f"[{CIR}]+", fonte))
sem_acento = {w.replace("́", "") for w in palavras_fonte}
minus = {w.lower() for w in sem_acento}
arqs = sorted(glob.glob(os.path.join(R, "temas", "russo", "*.js")) + [a for a in glob.glob(os.path.join(R, "assets", "sims", "russo", "*.js")) if not a.endswith("dados.js")])
erros = 0; total = 0; isentas = 0
for a in arqs:
    t = open(a, encoding="utf-8").read()
    vistos = set()
    for w in re.findall(f"[{CIR}]{{2,}}", t):
        if w in vistos: continue
        vistos.add(w); total += 1
        V = set("аеёиоуыэюяьъй"); S = set(w.lower())
        if len(S) == len(w) and (S <= V or not (S & (V - {"й"}))): isentas += 1; continue  # conjunto de letras (só vogais e sinais, ou só consoantes, sem repetição): não é palavra
        if len(w) == 2 and w[0].lower() in "гкхжчшщц" and w[1] in "ыиуюая": isentas += 1; continue  # combinação consoante + vogal das regras de ortografia
        if "́" in w: ok = w in palavras_fonte
        else: ok = w in sem_acento or w.lower() in minus
        if not ok: erros += 1; print(f"ERRO {os.path.basename(a)}: {w!r} não está na fonte")
    for tr in set(re.findall(r"\[[^\]\[\s\"'`$,;(){}<>=]*[ʲɨʐʂɕɫəɐɛɵæʊɪˈ͡][^\]\[\s\"'`$,;(){}<>=]*\]", t)):
        total += 1
        if tr not in fonte: erros += 1; print(f"ERRO {os.path.basename(a)}: transcrição {tr} não está na fonte")
    print(f"{os.path.basename(a)}: {len(vistos)} palavras em cirílico conferidas")
print(f"{total} itens conferidos, {erros} erro(s); {isentas} conjuntos de letras ou combinações de duas letras não são palavras e ficaram de fora")
sys.exit(1 if erros else 0)
