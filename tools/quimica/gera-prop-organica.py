#!/usr/bin/env python3
"""Gera a tabela SIM.org.PROP (ponto de ebulição, solubilidade em água e pKa) dentro de assets/sims/quimica/organica.js, entre as marcas /*PROP-INI*/ e /*PROP-FIM*/,
a partir de tools/quimica/dadosH.json. Nada é digitado à mão: ebulição = primeiro valor da caixa de dados da Wikipedia (ponto médio, se a fonte dá faixa);
solubilidade = "miscível" ou g/L, convertida da unidade que a linha da fonte traz (g/L, g/100 mL, mg/L); o que não dá para converter com segurança fica null.
Uso: python3 tools/quimica/gera-prop-organica.py"""
import json, os, re
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
d = json.load(open(os.path.join(RAIZ, "tools/quimica/dadosH.json")))["compostos"]
PT = {"methane": "metano", "ethane": "etano", "propane": "propano", "butane": "butano", "isobutane": "metilpropano", "pentane": "pentano", "isopentane": "2-metilbutano", "neopentane": "dimetilpropano", "hexane": "hexano", "heptane": "heptano", "octane": "octano", "decane": "decano", "cyclohexane": "cicloexano", "benzene": "benzeno", "toluene": "metilbenzeno",
      "methanol": "metanol", "ethanol": "etanol", "1-propanol": "propan-1-ol", "2-propanol": "propan-2-ol", "1-butanol": "butan-1-ol", "2-butanol": "butan-2-ol", "tert-butyl alcohol": "2-metilpropan-2-ol", "ethylene glycol": "etano-1,2-diol", "glycerol": "propano-1,2,3-triol", "phenol": "fenol",
      "dimethyl ether": "metoximetano", "diethyl ether": "etoxietano", "formaldehyde": "metanal", "acetaldehyde": "etanal", "propanal": "propanal", "acetone": "propanona", "butanone": "butanona",
      "formic acid": "ácido metanoico", "acetic acid": "ácido etanoico", "propionic acid": "ácido propanoico", "butyric acid": "ácido butanoico", "benzoic acid": "ácido benzoico", "methyl acetate": "etanoato de metila", "ethyl acetate": "etanoato de etila",
      "methylamine": "metanamina", "dimethylamine": "N-metilmetanamina", "trimethylamine": "N,N-dimetilmetanamina", "ethylamine": "etanamina", "aniline": "anilina", "acetamide": "etanamida",
      "chloromethane": "clorometano", "dichloromethane": "diclorometano", "chloroform": "triclorometano", "carbon tetrachloride": "tetraclorometano", "chloroethane": "cloroetano", "bromoethane": "bromoetano"}
def chave(en):
    if en in d: return en
    return next((k for k in d if k.split(" (")[0] == en), None)
def meio(v): return round(sum(v) / 2, 1) if isinstance(v, list) else v
def sol(lista):
    for e in lista or []:
        v, obs = e.get("valor"), (e.get("obs") or "") + " " + (e.get("unidade") or "") + " " + (e.get("valor_texto") or "")
        if isinstance(v, str) and ("immiscib" in v.lower() or "insolub" in v.lower()): return "imiscível", e
        if isinstance(v, str) and "miscib" in v.lower(): return "miscível", e
        if not isinstance(v, (int, float)): continue
        t = obs.replace("⋅", "/").replace("−1", "")
        if re.search(r"kg\s*/?\s*L", t): return round(v * 1000, 1), e
        if re.search(r"mg\s*/\s*L|mg/L|mg L", t): return round(v / 1000, 4), e
        if re.search(r"g\s*/\s*\(?100\s*mL", t): return round(v * 10, 2), e
        if re.search(r"g\s*/\s*L|g L", t): return v, e
    return None, None
linhas = []; rel = []
for en, pt in PT.items():
    k = chave(en)
    if not k: rel.append(f"sem dados: {en}"); continue
    c = d[k]; eb = next((e for e in (c.get("ebulicao") or []) if e.get("valor") is not None and "Wiki" in e["fonte"]), None)
    s, es = sol(c.get("solubilidade_agua"))
    linhas.append(f'    {json.dumps(pt, ensure_ascii=False)}: {{ eb: {json.dumps(meio(eb["valor"]) if eb else None)}, sol: {json.dumps(s, ensure_ascii=False)} }},')
    rel.append(f"{pt}: eb {meio(eb['valor']) if eb else None} | sol {s} | linha: {(es.get('obs') or es.get('valor_texto') or '') if es else '—'}")
bloco = "/*PROP-INI*/ /* GERADO por tools/quimica/gera-prop-organica.py a partir de dadosH.json: não editar à mão. eb em °C (1 atm); sol em g/L de água, ou \"miscível\", ou \"imiscível\" (palavra da fonte), ou null (sem dado conversível) */\n  SIM.org.PROP = {\n" + "\n".join(linhas) + "\n  };\n  /*PROP-FIM*/"
p = os.path.join(RAIZ, "assets/sims/quimica/organica.js"); s = open(p, encoding="utf8").read()
if "/*PROP-INI*/" in s: s = re.sub(r"/\*PROP-INI\*/.*?/\*PROP-FIM\*/", lambda m: bloco, s, flags=re.S)
else: i = s.rindex("})();"); s = s[:i] + "\n  " + bloco + "\n" + s[i:]
open(p, "w", encoding="utf8").write(s)
print("\n".join(rel)); print(len(linhas), "compostos gravados em SIM.org.PROP")
