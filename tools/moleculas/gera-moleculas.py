#!/usr/bin/env python3
"""Gera o catálogo do visualizador de moléculas (assets/moleculas-dados.js) a partir de uma lista de SMILES.
Roda FORA do site, com RDKit (pip install rdkit). Uso (na raiz do projeto): python3 tools/moleculas/gera-moleculas.py tools/moleculas/lista.json assets/moleculas-dados.js docs/MOLECULAS_RELATORIO.md

Para cada molécula:
 1. CONFERÊNCIA: o RDKit lê o SMILES e calcula a fórmula molecular; ela tem de bater, elemento por elemento e na carga, com a fórmula escrita na lista.
 2. COORDENADAS 3D, por um de três caminhos, que fica registrado no campo "origem":
    - "rdkit": ETKDG (geometria por distâncias) + otimização MMFF94 (ou UFF quando o MMFF94 não tem parâmetros). É modelo de campo de força: os ângulos
      saem PRÓXIMOS dos medidos, não iguais. Nada é ajustado à mão.
    - "vsepr": moléculas de octeto expandido e afins (PCl5, SF4, SF6, ClF3, XeF2, XeF4…), que o campo de força do RDKit não descreve (ensaio de 15/11/2026:
      SF6 saiu com ângulos de 48° a 69°; XeF2 com 123°; XeF4 e ClF3 não saíram). Aqui as direções são as IDEAIS do modelo VSEPR e o comprimento de ligação
      é a soma dos raios covalentes da tabela do RDKit. É geometria de modelo, e a ficha diz isso.
    - "ionico": composto iônico. Não é molécula: vão os íons e um pedaço do retículo (NaCl: cúbico de face centrada, com a distância Na–Cl dada na lista).
 3. ÂNGULOS: todos os ângulos vizinho–central–vizinho do átomo central indicado, calculados das coordenadas, ao lado do valor de referência da lista (com a fonte).
 4. PARES ISOLADOS do átomo central (para o botão "pares isolados"): quantidade pela valência; posição pelo VSEPR."""
import json, math, re, sys
from rdkit import Chem, RDLogger
from rdkit.Chem import AllChem, rdMolDescriptors
RDLogger.DisableLog('rdApp.*')
PT = Chem.GetPeriodicTable()
s8 = math.sqrt(8) / 3
def c3(k): return (math.cos(k * 2 * math.pi / 3), math.sin(k * 2 * math.pi / 3))
GEO = {2: [(1, 0, 0), (-1, 0, 0)], 3: [(0, 1, 0), (-math.sqrt(3) / 2, -0.5, 0), (math.sqrt(3) / 2, -0.5, 0)],
       4: [(0, 1, 0)] + [(s8 * c3(k)[0], -1 / 3, s8 * c3(k)[1]) for k in range(3)],
       5: [(c3(k)[0], 0, c3(k)[1]) for k in range(3)] + [(0, 1, 0), (0, -1, 0)],
       6: [(0, -1, 0), (0, 1, 0), (1, 0, 0), (-1, 0, 0), (0, 0, 1), (0, 0, -1)]}
NOMEGEO = {(2, 0): "linear", (3, 0): "trigonal plana", (2, 1): "angular", (4, 0): "tetraédrica", (3, 1): "piramidal", (2, 2): "angular", (5, 0): "bipirâmide trigonal",
           (4, 1): "gangorra", (3, 2): "forma de T", (2, 3): "linear", (6, 0): "octaédrica", (5, 1): "pirâmide de base quadrada", (4, 2): "quadrada plana"}
def conta(formula):
    """'C2H6O', 'NO3-', 'CO3^2-', 'NH4+' → ({'C':2,…}, carga)"""
    m = re.match(r'^(.*?)(?:\^(\d+)([+-])|([+-]))?$', formula); corpo = m.group(1)  # "CO3^2-" = carga 2−; "NH4+" = carga 1+ (sem ^, o sinal vale 1)
    carga = (int(m.group(2)) * (1 if m.group(3) == '+' else -1)) if m.group(3) else ((1 if m.group(4) == '+' else -1) if m.group(4) else 0)
    d = {}
    for el, n in re.findall(r'([A-Z][a-z]?)(\d*)', corpo): d[el] = d.get(el, 0) + int(n or 1)
    return d, carga
def formula_rdkit(mol):
    f = rdMolDescriptors.CalcMolFormula(mol); m = re.match(r'^(.*?)(?:([+-])(\d*))?$', f); d = {}
    for el, n in re.findall(r'([A-Z][a-z]?)(\d*)', m.group(1)): d[el] = d.get(el, 0) + int(n or 1)
    return d, ((int(m.group(3) or 1) * (1 if m.group(2) == '+' else -1)) if m.group(2) else 0), f
def ang(a, b, c):
    u = [a[i] - b[i] for i in range(3)]; v = [c[i] - b[i] for i in range(3)]
    return math.degrees(math.acos(max(-1, min(1, sum(x * y for x, y in zip(u, v)) / (math.hypot(*u) * math.hypot(*v))))))
def r3(x): return round(x, 3)
def main():
    lista = json.load(open(sys.argv[1], encoding='utf8')); saida = []; rel = ["# Visualizador de moléculas: relatório da geração\n"]; falhas = []; corr = []
    rel.append("| molécula | fórmula escrita | fórmula pelo SMILES | confere | origem das coordenadas | átomos | ângulo calculado | ângulo de livro |\n|---|---|---|---|---|---|---|---|")
    for e in lista:
        mol = Chem.MolFromSmiles(e["smiles"])
        if mol is None:  # valência fora da tabela do RDKit (ex.: Cl com 3 ligações no ClF3): lê sem a checagem de valência, só para contar os átomos
            mol = Chem.MolFromSmiles(e["smiles"], sanitize=False)
            if mol is not None: mol.UpdatePropertyCache(strict=False)
        if mol is None: falhas.append(e["nome"] + ": SMILES ilegível (" + e["smiles"] + ")"); continue
        d1, q1 = conta(e["formula"]); d2, q2, ftxt = formula_rdkit(mol); bate = d1 == d2 and q1 == q2
        if not bate: falhas.append("%s: escrita %s, pelo SMILES %s" % (e["nome"], e["formula"], ftxt))
        tipo = e.get("tipo", "rdkit"); atomos = []; ligs = []; origem = ""; pares = []
        if tipo == "rdkit":
            mh = Chem.AddHs(mol); ok = AllChem.EmbedMolecule(mh, randomSeed=7)
            if ok != 0: falhas.append(e["nome"] + ": o RDKit não gerou 3D"); continue
            if AllChem.MMFFHasAllMoleculeParams(mh): AllChem.MMFFOptimizeMolecule(mh, maxIters=5000); origem = "RDKit: ETKDG + MMFF94"
            elif AllChem.UFFHasAllMoleculeParams(mh): AllChem.UFFOptimizeMolecule(mh, maxIters=5000); origem = "RDKit: ETKDG + UFF"
            else: origem = "RDKit: ETKDG (sem otimização)"
            cf = mh.GetConformer(); n = mh.GetNumAtoms(); cen = [sum(cf.GetAtomPosition(i)[k] for i in range(n)) / n for k in range(3)]
            for a in mh.GetAtoms():
                p = cf.GetAtomPosition(a.GetIdx()); atomos.append([a.GetSymbol(), r3(p.x - cen[0]), r3(p.y - cen[1]), r3(p.z - cen[2]), a.GetFormalCharge()])
            for b in mh.GetBonds(): ligs.append([b.GetBeginAtomIdx(), b.GetEndAtomIdx(), 1.5 if b.GetIsAromatic() else b.GetBondTypeAsDouble()])
        elif tipo == "vsepr":
            X, E = e["X"], e["E"]; dirs = GEO[X + E]; c, l = e["central"], e["ligante"]; dist = PT.GetRcovalent(c) + PT.GetRcovalent(l)
            atomos.append([c, 0, 0, 0, e.get("cargaCentral", 0)])
            for k in range(E, X + E): atomos.append([l, r3(dirs[k][0] * dist), r3(dirs[k][1] * dist), r3(dirs[k][2] * dist), 0]); ligs.append([0, len(atomos) - 1, 1])
            pares = [[0, r3(dirs[k][0]), r3(dirs[k][1]), r3(dirs[k][2])] for k in range(E)]
            origem = "modelo VSEPR ideal; ligação = soma dos raios covalentes (%.2f Å)" % dist
        elif tipo == "ionico":
            origem = "composto iônico: íons e pedaço do retículo (não é molécula)"
        # ângulos em torno do átomo central pedido
        calc = None
        if e.get("angulo") and atomos:
            cs, vs = e["angulo"]["central"], e["angulo"]["vizinho"]; vals = []
            for i, a in enumerate(atomos):
                if a[0] != cs: continue
                viz = [j if b[0] == i else b[0] for b in ligs for j in [b[1]] if i in (b[0], b[1])]; viz = [j for j in viz if atomos[j][0] == vs]
                for x in range(len(viz)):
                    for y in range(x + 1, len(viz)): vals.append(round(ang(atomos[viz[x]][1:4], a[1:4], atomos[viz[y]][1:4]), 1))
            calc = sorted(set(vals))
        reg = {"id": e["id"], "nome": e["nome"], "en": e["en"], "formula": e["formula"], "smiles": e["smiles"], "tipo": tipo, "origem": origem, "atomos": atomos, "ligs": ligs}
        for k in ("geometria", "usos", "isomeros", "nota", "reticulo", "ions", "grupo"):
            if e.get(k) is not None: reg[k] = e[k]
        if pares: reg["pares"] = pares
        if tipo == "vsepr": reg["geometria"] = NOMEGEO[(e["X"], e["E"])]
        if e.get("angulo"): reg["angulo"] = {"rot": e["angulo"]["rot"], "calc": calc, "ref": e["angulo"].get("ref"), "fonte": e["angulo"].get("fonte")}
        saida.append(reg)
        rel.append("| %s | %s | %s | %s | %s | %d | %s | %s |" % (e["nome"], e["formula"], ftxt, "sim" if bate else "**NÃO**", origem, len(atomos), ", ".join(str(x).replace(".", ",") + "°" for x in (calc or [])) or "—", (str(e["angulo"].get("ref")).replace(".", ",") + "°") if e.get("angulo") and e["angulo"].get("ref") is not None else "—"))
    rel.append("\n**Moléculas:** %d · **fórmula não bateu ou falhou:** %d\n" % (len(lista), len(falhas)))
    for f in falhas: rel.append("- FALHA: " + f)
    js = "// moleculas-dados.js: catálogo do visualizador de moléculas. GERADO por tools/moleculas/gera-moleculas.py (RDKit), a partir de tools/moleculas/lista.json.\n// raios: raios covalentes (Å) da tabela do RDKit, usados pelo construtor VSEPR. Coordenadas em ångström. origem diz de onde vieram: campo de força do RDKit (aproximação), modelo VSEPR ideal, ou composto iônico. Para corrigir: edite lista.json e gere de novo.\nwindow.MOLECULAS = {\n  raios: " + json.dumps({el: round(PT.GetRcovalent(el), 2) for el in ["H","Be","B","C","N","O","F","Si","P","S","Cl","Br","I","Xe","Na"]}, separators=(",", ":")) + ",\n  lista: [\n" + ",\n".join("    " + json.dumps(r, ensure_ascii=False, separators=(",", ":")) for r in saida) + "\n  ]\n};\n"
    open(sys.argv[2], "w", encoding="utf8").write(js); open(sys.argv[3], "w", encoding="utf8").write("\n".join(rel) + "\n")
    print("moléculas: %d · geradas: %d · falhas: %d · %d KB" % (len(lista), len(saida), len(falhas), len(js) // 1024))
    for f in falhas: print("  FALHA:", f)
main()
