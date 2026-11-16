#!/usr/bin/env python3
"""Gera o catálogo do visualizador de moléculas (assets/moleculas-dados.js). Roda FORA do site, com RDKit (pip install rdkit).
Uso (na raiz do projeto): python3 tools/moleculas/gera-moleculas.py   → escreve assets/moleculas-dados.js e docs/MOLECULAS_RELATORIO.md

Entradas (pasta tools/moleculas/fonte/):
  itens.json    as 230: número, seção, nome em português (com a fórmula ESCRITA à mão nas inorgânicas), nome em inglês.
  pubchem.json  o que o PubChem devolveu para o nome em inglês: CID, fórmula, SMILES, título (baixado por script; nada de memória).
  ajustes.json  correções e escolhas feitas à mão, por número (cada uma com o motivo no campo "porque"; todas entram no relatório).
  usos.json     usos de cada molécula, resumidos de um texto-fonte baixado (Wikipedia em inglês ou PubChem), com a fonte.
  angulos.json  ângulos de ligação experimentais, cada um com a fonte e o trecho copiado da página.

Para cada molécula:
 1. CONFERÊNCIA DA FÓRMULA, em três vias: a escrita à mão (quando há), a que o RDKit calcula a partir do SMILES e a do PubChem. Têm de bater em elementos e carga.
 2. COORDENADAS 3D, por um de três caminhos (campo "origem"):
    - "rdkit": ETKDG + otimização MMFF94 (ou UFF). É campo de força: os ângulos saem PRÓXIMOS dos medidos, não iguais. Nada é ajustado à mão.
    - "vsepr": espécies com um átomo central e 5 ou mais regiões de elétrons (PCl5, SF4, SF6, ClF3, BrF5, IF7, XeF2, XeF4, I3-), que o campo de força não descreve,
      e as espécies de um átomo central em que o campo de força fugiu demais do ângulo ideal (mais de 12 graus sem par isolado; mais de 30 com par isolado,
      porque aí o ângulo real também foge do ideal: PH3 e H2S ficam perto de 93 graus, e o campo de força acerta). Direções IDEAIS do VSEPR;
      comprimento de ligação = soma dos raios covalentes (tabela do RDKit). É geometria de modelo, e a ficha diz isso.
    - "ionico": composto iônico (SMILES com "."). Não é molécula: vão os íons, e o retículo só onde a estrutura foi conferida (hoje, o NaCl).
 3. ÂNGULO de referência: o do modelo (calculado nas coordenadas) e o de livro (angulos.json, ou "por simetria" quando todos os ligantes são iguais e não há par isolado).
 4. PARES ISOLADOS do átomo central nas espécies "vsepr" (direções ideais). Nos outros casos o site calcula a posição pelos vizinhos."""
import json, math, os, re, sys
from rdkit import Chem, RDLogger
from rdkit.Chem import AllChem, rdMolDescriptors
RDLogger.DisableLog('rdApp.*')
AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.dirname(os.path.dirname(AQUI)); F = lambda n: os.path.join(AQUI, 'fonte', n)
PT = Chem.GetPeriodicTable()
s8 = math.sqrt(8) / 3
def c3(k): return (math.cos(k * 2 * math.pi / 3), math.sin(k * 2 * math.pi / 3))
def c5(k): return (math.cos(k * 2 * math.pi / 5), math.sin(k * 2 * math.pi / 5))
GEO = {2: [(1, 0, 0), (-1, 0, 0)], 3: [(0, 1, 0), (-math.sqrt(3) / 2, -0.5, 0), (math.sqrt(3) / 2, -0.5, 0)],
       4: [(0, 1, 0)] + [(s8 * c3(k)[0], -1 / 3, s8 * c3(k)[1]) for k in range(3)],
       5: [(c3(k)[0], 0, c3(k)[1]) for k in range(3)] + [(0, 1, 0), (0, -1, 0)],
       6: [(0, -1, 0), (0, 1, 0), (1, 0, 0), (-1, 0, 0), (0, 0, 1), (0, 0, -1)],
       7: [(c5(k)[0], 0, c5(k)[1]) for k in range(5)] + [(0, 1, 0), (0, -1, 0)]}
NOMEGEO = {(1, 0): "linear (2 átomos)", (1, 1): "linear (2 átomos)", (1, 2): "linear (2 átomos)", (1, 3): "linear (2 átomos)", (2, 0): "linear", (3, 0): "trigonal plana", (2, 1): "angular", (4, 0): "tetraédrica", (3, 1): "piramidal", (2, 2): "angular",
           (5, 0): "bipirâmide trigonal", (4, 1): "gangorra", (3, 2): "forma de T", (2, 3): "linear", (6, 0): "octaédrica", (5, 1): "pirâmide de base quadrada", (4, 2): "quadrada plana", (7, 0): "bipirâmide pentagonal"}
IDEAL = {(2, 0): 180, (3, 0): 120, (2, 1): 120, (4, 0): 109.5, (3, 1): 109.5, (2, 2): 109.5}
VAL = {"H": 1, "Be": 2, "B": 3, "C": 4, "Si": 4, "N": 5, "P": 5, "O": 6, "S": 6, "F": 7, "Cl": 7, "Br": 7, "I": 7, "Xe": 8}
SUBS = str.maketrans("₀₁₂₃₄₅₆₇₈₉", "0123456789")
def ascii_formula(f):
    """'SO₄²⁻' → 'SO4^2-' ; 'NH₄⁺' → 'NH4+' ; 'Ca(OH)₂' → 'Ca(OH)2'"""
    f = f.translate(SUBS); m = re.match(r'^(.*?)([²³⁴]?)([⁺⁻]?)$', f)
    return m.group(1) + (("^" + {"²": "2", "³": "3", "⁴": "4"}[m.group(2)]) if m.group(2) else "") + {"⁺": "+", "⁻": "-", "": ""}[m.group(3)]
def conta(formula):
    """'C2H6O', 'NO3-', 'CO3^2-', 'Ca(OH)2', 'O4S-2' (jeito do PubChem) → ({'C':2,…}, carga)"""
    m = re.match(r'^(.*?)(?:\^(\d+)([+-])|([+-])(\d*))?$', formula); corpo = m.group(1)
    carga = (int(m.group(2)) * (1 if m.group(3) == '+' else -1)) if m.group(3) else ((int(m.group(5) or 1) * (1 if m.group(4) == '+' else -1)) if m.group(4) else 0)
    while '(' in corpo: corpo = re.sub(r'\(([^()]*)\)(\d*)', lambda g: g.group(1) * int(g.group(2) or 1), corpo, count=1)
    d = {}
    for el, n in re.findall(r'([A-Z][a-z]?)(\d*)', corpo): d[el] = d.get(el, 0) + int(n or 1)
    return d, carga
def le_smiles(smi):
    mol = Chem.MolFromSmiles(smi)
    if mol is None:  # valência fora da tabela do RDKit (ex.: Cl com 3 ligações no ClF3): lê sem a checagem, só para contar átomos e ligações
        mol = Chem.MolFromSmiles(smi, sanitize=False)
        if mol is not None: mol.UpdatePropertyCache(strict=False)
    return mol
def ang(a, b, c):
    u = [a[i] - b[i] for i in range(3)]; v = [c[i] - b[i] for i in range(3)]
    return math.degrees(math.acos(max(-1, min(1, sum(x * y for x, y in zip(u, v)) / (math.hypot(*u) * math.hypot(*v))))))
def r3(x): return round(x, 3)
def central_unico(mh):
    """índice do átomo ligado a todos os outros (todos terminais), ou None"""
    n = mh.GetNumAtoms()
    if n < 3: return None
    for a in mh.GetAtoms():
        if a.GetDegree() == n - 1 and all(b.GetDegree() == 1 for b in a.GetNeighbors()): return a.GetIdx()
    return None
def pares_do(a):
    ve = VAL.get(a.GetSymbol())
    if ve is None: return 0
    return max(0, int((ve - a.GetFormalCharge() - sum(b.GetBondTypeAsDouble() for b in a.GetBonds()) - a.GetNumRadicalElectrons() + 1e-9) // 2))
def fulereno():
    """C60: vértices do icosaedro truncado (60 posições equivalentes), ligações duplas nas 30 arestas entre dois hexágonos; depois o MMFF94 ajusta os comprimentos."""
    from itertools import product
    from rdkit.Geometry import Point3D
    f = (1 + 5 ** 0.5) / 2; base = [(0, 1, 3 * f), (1, 2 + f, 2 * f), (f, 2, 2 * f + 1)]; V = set()
    for b in base:
        for sg in product((1, -1), repeat=3):
            v = tuple(b[i] * sg[i] for i in range(3))
            for k in range(3): V.add((round(v[k % 3], 6), round(v[(k + 1) % 3], 6), round(v[(k + 2) % 3], 6)))
    V = sorted(V); assert len(V) == 60, len(V)
    d = lambda a, b: math.dist(a, b); E = [(i, j) for i in range(60) for j in range(i + 1, 60) if abs(d(V[i], V[j]) - 2) < 1e-3]; assert len(E) == 90, len(E)
    viz = {i: [] for i in range(60)}
    for i, j in E: viz[i].append(j); viz[j].append(i)
    def no_pentagono(i, j):  # existe outro caminho de 4 arestas entre i e j?
        fr = {i}; vis = {i}
        for _ in range(4): fr = {y for x in fr for y in viz[x] if not ({x, y} == {i, j})} - vis if _ < 3 else {y for x in fr for y in viz[x] if not ({x, y} == {i, j})}; vis |= fr
        return j in fr
    rw = Chem.RWMol()
    for _ in V: rw.AddAtom(Chem.Atom(6))
    nd = 0
    for i, j in E:
        dupla = not no_pentagono(i, j); nd += dupla; rw.AddBond(i, j, Chem.BondType.DOUBLE if dupla else Chem.BondType.SINGLE)
    assert nd == 30, nd
    m = rw.GetMol(); Chem.SanitizeMol(m); cf = Chem.Conformer(60)
    for i, v in enumerate(V): cf.SetAtomPosition(i, Point3D(v[0] * 0.71, v[1] * 0.71, v[2] * 0.71))
    m.AddConformer(cf); return m
def geometria_auto(mol, mh):
    c = central_unico(mh)
    if mh.GetNumAtoms() == 2: return "linear (2 átomos)"
    if c is not None: a = mh.GetAtomWithIdx(c); return NOMEGEO.get((a.GetDegree(), pares_do(a)), "")
    p = []; ri = mol.GetRingInfo()
    if any(a.GetIsAromatic() for a in mol.GetAtoms()): p.append("anel aromático plano")
    nao = sorted(set(len(r) for r in ri.AtomRings() if not all(mol.GetAtomWithIdx(i).GetIsAromatic() for i in r)))
    if nao: p.append("anel de " + " e de ".join(str(x) for x in nao) + " átomos")
    pat = lambda s: mol.HasSubstructMatch(Chem.MolFromSmarts(s))
    if pat("[CX3]=[OX1]"): p.append("trigonal plana no carbono da carbonila")
    if pat("[CX3]=[CX3]"): p.append("trigonal plana nos carbonos da ligação dupla")
    if pat("[CX2]#*"): p.append("linear nos átomos da ligação tripla")
    if pat("[CX4]"): p.append("tetraédrica nos carbonos saturados")
    if not p and pat("[OX2]"): p.append("angular em cada oxigênio")
    return "; ".join(p[:3])
def main():
    itens = json.load(open(F('itens.json'), encoding='utf8')); pub = json.load(open(F('pubchem.json'), encoding='utf8')); aj = json.load(open(F('ajustes.json'), encoding='utf8'))
    usos = json.load(open(F('usos.json'), encoding='utf8')) if os.path.exists(F('usos.json')) else {}
    angs = json.load(open(F('angulos.json'), encoding='utf8')) if os.path.exists(F('angulos.json')) else []
    refang = {(a["especie"], a["angulo"]): a for a in angs if a.get("valor") is not None}
    saida = []; falhas = []; corr = []; trocas = []; linhas = []; semref = []; porcan = {}; difs = []; cargas = []; semuso = []
    for e in itens:
        n = str(e["n"]); a = aj.get(n, {}); p = pub[n]
        nome = a.get("nome") or e["nome"]; escrita = a.get("formula")
        if not escrita and "," in e["nome"] and e["n"] <= 100:
            nome, f = e["nome"].rsplit(", ", 1); escrita = ascii_formula(re.sub(r'\s+\(.*$', '', f).strip())
        nome = re.sub(r'\s*\*\*.*$', '', nome).strip()
        smiles = a.get("smiles") or p["smiles"]
        if a.get("smiles") or a.get("formula"): corr.append("%s: %s" % (nome, a.get("porque", "(sem motivo anotado)")))
        mol = le_smiles(smiles)
        if mol is None: falhas.append(nome + ": SMILES ilegível (" + smiles + ")"); continue
        frd = rdMolDescriptors.CalcMolFormula(mol); d_rd = conta(frd); d_pc = conta(p["formula"]); d_es = conta(escrita) if escrita else None
        bate_pc = d_rd == d_pc or bool(a.get("smiles")); bate_es = d_es is None or d_es == d_rd
        if not (d_rd == d_pc) and not a.get("smiles"): falhas.append("%s: pelo SMILES %s, no PubChem %s" % (nome, frd, p["formula"]))
        if not bate_es: falhas.append("%s: escrita %s, pelo SMILES %s" % (nome, escrita, frd))
        formula = escrita or p["formula"]
        ident = a.get("id") or ("m%03d" % e["n"]); grupo = a.get("grupo") or e["secao"]
        reg = {"id": ident, "nome": nome, "en": e["en"], "formula": formula, "smiles": smiles, "can": Chem.MolToSmiles(mol) if mol else "", "grupo": grupo}
        atomos = []; ligs = []; pares = []; origem = ""; tipo = "rdkit"; calc = None; an = a.get("angulo"); geom = a.get("geometria")
        if "." in smiles:
            tipo = "ionico"; origem = "composto iônico: os íons (não é molécula)"; ions = {}
            for fr in smiles.split("."): ions[fr] = ions.get(fr, 0) + 1
            reg["_ions"] = ions
            if a.get("reticulo"): reg["reticulo"] = a["reticulo"]
            reg["nota"] = "Composto iônico: no sólido é uma rede de íons, não uma molécula. A fórmula é só a proporção entre os íons."
        else:
            mh = Chem.AddHs(mol) if Chem.MolFromSmiles(smiles) is not None else mol
            c = central_unico(mh); X = E = None
            if c is not None: ac = mh.GetAtomWithIdx(c); X = ac.GetDegree(); E = pares_do(ac)
            def por_vsepr(motivo):
                nonlocal atomos, ligs, pares, origem, tipo
                atomos = []; ligs = []; dirs = GEO[X + E]; cs = ac.GetSymbol(); atomos.append([cs, 0, 0, 0, ac.GetFormalCharge()]); dmed = []
                for k, b in enumerate(ac.GetBonds()):
                    o = b.GetOtherAtom(ac); dist = PT.GetRcovalent(cs) + PT.GetRcovalent(o.GetSymbol()); dmed.append(dist); d = dirs[E + k]
                    atomos.append([o.GetSymbol(), r3(d[0] * dist), r3(d[1] * dist), r3(d[2] * dist), o.GetFormalCharge()]); ligs.append([0, k + 1, b.GetBondTypeAsDouble()])
                pares = [[0, r3(dirs[k][0]), r3(dirs[k][1]), r3(dirs[k][2])] for k in range(E)]; tipo = "vsepr"
                origem = "modelo VSEPR ideal (%s); ligação = soma dos raios covalentes" % motivo
            if c is not None and X + E >= 5 and (X + E) in GEO: por_vsepr("5 ou mais regiões de elétrons: o campo de força não descreve")
            else:
                if a.get("construtor") == "c60": mh = fulereno(); ok = 0; assert conta(rdMolDescriptors.CalcMolFormula(mh)) == d_rd
                else: ok = AllChem.EmbedMolecule(mh, randomSeed=7)
                if ok != 0: ok = AllChem.EmbedMolecule(mh, randomSeed=7, useRandomCoords=True, maxAttempts=200)
                if ok != 0:
                    if c is not None and (X + E) in GEO: por_vsepr("o RDKit não gerou coordenadas")
                    else: falhas.append(nome + ": o RDKit não gerou 3D"); continue
                else:
                    try:
                        if AllChem.MMFFHasAllMoleculeParams(mh): AllChem.MMFFOptimizeMolecule(mh, maxIters=8000); origem = "RDKit: ETKDG + MMFF94"
                        elif AllChem.UFFHasAllMoleculeParams(mh): AllChem.UFFOptimizeMolecule(mh, maxIters=8000); origem = "RDKit: ETKDG + UFF"
                        else: origem = "RDKit: ETKDG (sem otimização)"
                        if a.get("construtor") == "c60": origem = "vértices do icosaedro truncado + " + origem.split("+ ")[-1]
                    except Exception: origem = "RDKit: ETKDG (a otimização falhou)"
                    cf = mh.GetConformer(); N = mh.GetNumAtoms(); cen = [sum(cf.GetAtomPosition(i)[k] for i in range(N)) / N for k in range(3)]
                    for at in mh.GetAtoms():
                        q = cf.GetAtomPosition(at.GetIdx()); atomos.append([at.GetSymbol(), r3(q.x - cen[0]), r3(q.y - cen[1]), r3(q.z - cen[2]), at.GetFormalCharge()])
                    for b in mh.GetBonds(): ligs.append([b.GetBeginAtomIdx(), b.GetEndAtomIdx(), 1.5 if b.GetIsAromatic() else b.GetBondTypeAsDouble()])
                    # o campo de força acertou o desenho? (só dá para checar quando há um átomo central e o modelo VSEPR dá um ângulo ideal)
                    if c is not None and (X, E) in IDEAL and X >= 2:
                        viz = [b.GetOtherAtomIdx(c) for b in ac.GetBonds()]; vals = [ang(atomos[i][1:4], atomos[c][1:4], atomos[j][1:4]) for x, i in enumerate(viz) for j in viz[x + 1:]]
                        pior = max(abs(v - IDEAL[(X, E)]) for v in vals)
                        plana = X == 3 and E == 1 and sum(vals) > 352  # AX3E tem de ser pirâmide; se saiu plana, a forma está errada
                        if pior > (12 if E == 0 else 30) or plana: trocas.append("%s: o campo de força deu %s (ideal %s°)" % (nome, ", ".join("%.0f°" % v for v in sorted(vals)), IDEAL[(X, E)])); por_vsepr("o campo de força do RDKit errou os ângulos desta espécie")
            if not geom: geom = geometria_auto(mol, mh)
            if c is not None and not an:
                els = sorted(set(o.GetSymbol() for o in ac.GetNeighbors()))
                if len(els) == 1 and X >= 2: an = {"vizinhos": [els[0], els[0]], "central": ac.GetSymbol(), "rot": "%s–%s–%s" % (els[0], ac.GetSymbol(), els[0])}
                if len(els) == 1 and X >= 2 and E == 0 and (X, 0) in IDEAL and len(set(b.GetBondTypeAsDouble() for b in ac.GetBonds())) >= 1 and not an.get("ref"):
                    an["simetria"] = IDEAL[(X, 0)]
            if any(at.GetSymbol() in ("N", "C", "S", "P", "Cl", "Mn", "Cr") and any(b.GetBondTypeAsDouble() == 2 and b.GetOtherAtom(at).GetSymbol() == "O" for b in at.GetBonds()) and any(o.GetSymbol() == "O" and o.GetFormalCharge() == -1 and o.GetDegree() == 1 for o in at.GetNeighbors()) for at in mol.GetAtoms()):
                reg["nota"] = "O desenho mostra uma das formas de ressonância. Na espécie real, as ligações com os oxigênios que aqui aparecem diferentes (dupla e simples com carga) são iguais."
        if "." not in smiles:
            cru = Chem.MolFromSmiles(smiles, sanitize=False)
            if cru is not None and cru.GetNumAtoms() == mol.GetNumAtoms() and [x.GetFormalCharge() for x in cru.GetAtoms()] != [x.GetFormalCharge() for x in mol.GetAtoms()]:
                reg["nota"] = "O desenho usa a estrutura de Lewis com cargas formais separadas (octeto no átomo central), que é como o RDKit normaliza esta espécie. O SMILES da ficha, do PubChem, escreve a mesma espécie com ligações duplas. São duas formas de desenhar a mesma coisa; na espécie real, as ligações com os oxigênios equivalentes são iguais."; cargas.append(nome)
        if a.get("nota"): reg["nota"] = a["nota"]
        if an and atomos:
            cs = an["central"]; v1, v2 = an.get("vizinhos") or [an["vizinho"], an["vizinho"]]; vals = []
            for i, at in enumerate(atomos):
                if at[0] != cs: continue
                viz = [(l[1] if l[0] == i else l[0]) for l in ligs if i in (l[0], l[1])]
                for x in range(len(viz)):
                    for y in range(x + 1, len(viz)):
                        if sorted([atomos[viz[x]][0], atomos[viz[y]][0]]) == sorted([v1, v2]): vals.append(round(ang(atomos[viz[x]][1:4], at[1:4], atomos[viz[y]][1:4]), 1))
            calc = sorted(set(vals))
            if len(calc) > 4: calc = [calc[0], calc[-1]]
            esp = a.get("especie") or (escrita or p["formula"]); r = refang.get((esp, an["rot"])); ref = fonte = None
            if an.get("ref") is not None: ref = an["ref"]; fonte = an.get("fonte")
            elif r: ref = r["valor"]; fonte = r["fonte"].split(" (Release")[0].split(" (CCCBDB")[0]
            elif an.get("simetria") is not None: ref = an["simetria"]; fonte = "por simetria (ligantes iguais, sem par isolado)"
            elif an.get("fonte"): fonte = an["fonte"]
            if ref is None and not fonte: fonte = a.get("angulo_fonte") or "sem valor de livro conferido"
            if calc:
                reg["angulo"] = {"rot": an["rot"], "calc": calc, "ref": ref, "fonte": fonte}
                if ref is None: semref.append(nome)
                else:
                    dmin = min(abs(x - ref) for x in calc)
                    if dmin >= 5: difs.append((dmin, "%s (%s): modelo %s, livro %s° (%s)" % (nome, an["rot"], ", ".join(str(x).replace(".", ",") + "°" for x in calc), str(ref).replace(".", ","), fonte)))
        reg.update({"tipo": tipo, "origem": origem, "atomos": atomos, "ligs": ligs})
        if pares: reg["pares"] = pares
        if geom: reg["geometria"] = geom
        u = usos.get(n)
        if u is not None:  # sem uso citado na fonte: fica vazio e a ficha diz "sem dado" (nunca preencher de memória)
            reg["usos"] = u.get("usos") or []; reg["usosFonte"] = (u.get("fonte") or "") if reg["usos"] else "as fontes consultadas (Wikipedia em inglês e PubChem) não citam uso"
            if not reg["usos"]: semuso.append(nome)
        saida.append(reg); porcan[reg["can"]] = ident
        linhas.append("| %d | %s | %s | %s | %s | %s | %s | %d | %s | %s |" % (e["n"], nome, escrita or "—", frd, p["formula"], "sim" if (bate_es and (d_rd == d_pc)) else ("corrigida" if a.get("smiles") and bate_es else "**NÃO**"), tipo, len(atomos),
                      ", ".join(str(x).replace(".", ",") + "°" for x in (calc or [])) or "—", (str(reg["angulo"]["ref"]).replace(".", ",") + "° (" + (reg["angulo"]["fonte"] or "") + ")") if reg.get("angulo") and reg["angulo"]["ref"] is not None else "—"))
    # íons dos compostos iônicos: monoatômicos (com o raio iônico, quando conferido) ou referência a um íon poliatômico do próprio catálogo
    raios_ion = json.load(open(F('raios-ionicos.json'), encoding='utf8'))
    for reg in saida:
        ions = reg.pop("_ions", None)
        if ions is None: continue
        lista = []
        for fr, k in ions.items():
            m = le_smiles(fr)
            if Chem.AddHs(m).GetNumAtoms() == 1: at = m.GetAtomWithIdx(0); el = at.GetSymbol(); q = at.GetFormalCharge(); chave = el + ("%d" % abs(q) if abs(q) > 1 else "") + ("+" if q > 0 else "-"); lista.append({"n": k, "el": el, "q": q, "r": raios_ion.get(chave, {}).get("r")})
            else:
                ref = porcan.get(Chem.MolToSmiles(m))
                if ref is None: falhas.append("%s: o íon %s não está no catálogo" % (reg["nome"], fr))
                lista.append({"n": k, "ref": ref})
        carga = lambda io: io["q"] if "el" in io else next(sum(x[4] for x in r2["atomos"]) for r2 in saida if r2["id"] == io["ref"])
        reg["ions"] = sorted(lista, key=lambda io: -carga(io))  # cátion primeiro
    rel = ["# Visualizador de moléculas: relatório da geração\n", "Gerado por `tools/moleculas/gera-moleculas.py`. Não editar à mão.\n",
           "**Moléculas pedidas:** %d · **geradas:** %d · **falhas em aberto:** %d · **corrigidas à mão (ajustes.json):** %d · **trocadas para o modelo VSEPR porque o campo de força errou:** %d\n" % (len(itens), len(saida), len(falhas), len(corr), len(trocas))]
    rel.append("## Falhas em aberto\n" + ("\n".join("- " + f for f in falhas) if falhas else "Nenhuma.") + "\n")
    rel.append("## Correções feitas à mão\n" + ("\n".join("- " + f for f in corr) if corr else "Nenhuma.") + "\n")
    rel.append("## Campo de força reprovado (desenho trocado pelo VSEPR ideal)\n" + ("\n".join("- " + f for f in trocas) if trocas else "Nenhum.") + "\n")
    rel.append("## Ângulo calculado sem valor de livro conferido\n" + (", ".join(semref) if semref else "Nenhum.") + "\n")
    rel.append("## Desenhadas com cargas formais separadas (o RDKit normaliza; a ficha avisa)\n" + (", ".join(cargas) if cargas else "Nenhuma.") + "\n")
    rel.append("## Usos\nResumidos (por IA) de textos baixados por script: primeiro parágrafo do artigo da Wikipedia em inglês e descrições do PubChem. Cada uso tem um trecho literal de apoio em fonte/usos.json.\n\n**Com uso:** %d · **sem dado (a fonte não cita uso):** %d%s\n" % (sum(1 for r in saida if r.get("usos")), len(semuso), (" → " + ", ".join(semuso)) if semuso else ""))
    rel.append("## Maiores diferenças entre o modelo e o valor de livro (5 graus ou mais)\nNão foram ajustadas: a ficha mostra os dois números.\n\n" + ("\n".join("- " + t for _, t in sorted(difs, reverse=True)) if difs else "Nenhuma.") + "\n")
    rel.append("## Tabela\n\n| nº | molécula | fórmula escrita | pelo SMILES (RDKit) | no PubChem | confere | desenho | átomos | ângulo no modelo | ângulo de livro |\n|---|---|---|---|---|---|---|---|---|---|")
    rel += linhas
    raios = {el: round(PT.GetRcovalent(el), 2) for el in ["H", "Be", "B", "C", "N", "O", "F", "Si", "P", "S", "Cl", "Br", "I", "Xe", "Na"]}
    js = ("// moleculas-dados.js: catálogo do visualizador de moléculas. GERADO por tools/moleculas/gera-moleculas.py (RDKit). NÃO editar à mão: corrija em tools/moleculas/fonte/ e gere de novo.\n"
          "// raios: raios covalentes (Å) da tabela do RDKit, usados pelo construtor VSEPR. Coordenadas em ångström. origem diz de onde veio o desenho.\n"
          "window.MOLECULAS = {\n  raios: " + json.dumps(raios, separators=(",", ":")) + ",\n  lista: [\n" + ",\n".join("    " + json.dumps(r, ensure_ascii=False, separators=(",", ":")) for r in saida) + "\n  ]\n};\n")
    open(os.path.join(RAIZ, "assets", "moleculas-dados.js"), "w", encoding="utf8").write(js); open(os.path.join(RAIZ, "docs", "MOLECULAS_RELATORIO.md"), "w", encoding="utf8").write("\n".join(rel) + "\n")
    print("pedidas: %d · geradas: %d · falhas: %d · corrigidas à mão: %d · trocadas para VSEPR: %d · sem ângulo de livro: %d · diferença ≥ 5°: %d · %d KB" % (len(itens), len(saida), len(falhas), len(corr), len(trocas), len(semref), len(difs), len(js) // 1024))
    for f in falhas: print("  FALHA:", f)
    for f in trocas: print("  TROCA:", f)
main()
