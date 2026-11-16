#!/usr/bin/env python3
"""Gera SIM.org.RX (tabela de reações orgânicas dos temas H09 a H13) e SIM.org.NOMES em assets/sims/quimica/organica.js, entre /*RX-INI*/ e /*RX-FIM*/.
Cada reação é declarada à mão (reagente orgânico, tipo, reagente inorgânico, produto principal, produto secundário) e CONFERIDA pelo RDKit:
  1. a transformação do tipo (padrão de reação) aplicada ao reagente tem de produzir o produto principal e o secundário declarados;
  2. a regra do tipo tem de escolher o principal: Markovnikov (H no carbono com mais H), anti-Markovnikov (o contrário), Zaitsev (alceno mais substituído);
  3. o balanço de átomos reagentes = produtos tem de fechar;
  4. o nome em inglês de cada composto é conferido no PubChem (estrutura sem estereoquímica); respostas em tools/quimica/pubchem-reacoes.json (--offline usa só o arquivo).
Na halogenação radicalar, os produtos monossubstituídos são TODOS gerados pelo RDKit, com o número de hidrogênios equivalentes que leva a cada um.
Também calcula o número de oxidação de cada carbono (soma, por ligação: −1 para H, +1 por ordem de ligação com O, N ou halogênio, 0 para C; mais a carga).
Precisa do RDKit. Uso: python3 tools/quimica/gera-reacoes.py"""
import json, os, re, subprocess, sys, urllib.parse
from collections import Counter
from rdkit import Chem, RDLogger
from rdkit.Chem import AllChem
from rdkit.Chem.rdMolDescriptors import CalcMolFormula
RDLogger.DisableLog('rdApp.*')
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# nome em português: [nome em inglês, SMILES]
C = {
 "metano": ["methane", "C"], "etano": ["ethane", "CC"], "propano": ["propane", "CCC"], "butano": ["butane", "CCCC"], "metilpropano": ["2-methylpropane", "CC(C)C"],
 "pentano": ["pentane", "CCCCC"], "2-metilbutano": ["2-methylbutane", "CCC(C)C"], "dimetilpropano": ["2,2-dimethylpropane", "CC(C)(C)C"], "cicloexano": ["cyclohexane", "C1CCCCC1"],
 "clorometano": ["chloromethane", "CCl"], "cloroetano": ["chloroethane", "CCCl"], "1-cloropropano": ["1-chloropropane", "CCCCl"], "2-cloropropano": ["2-chloropropane", "CC(C)Cl"],
 "1-clorobutano": ["1-chlorobutane", "CCCCCl"], "2-clorobutano": ["2-chlorobutane", "CCC(C)Cl"], "1-cloro-2-metilpropano": ["1-chloro-2-methylpropane", "CC(C)CCl"],
 "2-cloro-2-metilpropano": ["2-chloro-2-methylpropane", "CC(C)(C)Cl"], "1-cloropentano": ["1-chloropentane", "CCCCCCl"], "2-cloropentano": ["2-chloropentane", "CCCC(C)Cl"],
 "3-cloropentano": ["3-chloropentane", "CCC(Cl)CC"], "1-cloro-2-metilbutano": ["1-chloro-2-methylbutane", "CCC(C)CCl"], "2-cloro-2-metilbutano": ["2-chloro-2-methylbutane", "CCC(C)(C)Cl"],
 "2-cloro-3-metilbutano": ["2-chloro-3-methylbutane", "CC(Cl)C(C)C"], "1-cloro-3-metilbutano": ["1-chloro-3-methylbutane", "ClCCC(C)C"],
 "1-cloro-2,2-dimetilpropano": ["1-chloro-2,2-dimethylpropane", "CC(C)(C)CCl"], "clorocicloexano": ["chlorocyclohexane", "ClC1CCCCC1"],
 "bromometano": ["bromomethane", "CBr"], "bromoetano": ["bromoethane", "CCBr"], "1-bromopropano": ["1-bromopropane", "CCCBr"], "2-bromopropano": ["2-bromopropane", "CC(C)Br"],
 "1-bromobutano": ["1-bromobutane", "CCCCBr"], "2-bromobutano": ["2-bromobutane", "CCC(C)Br"], "2-bromo-2-metilpropano": ["2-bromo-2-methylpropane", "CC(C)(C)Br"],
 "1-bromo-2-metilpropano": ["1-bromo-2-methylpropane", "CC(C)CBr"], "2-bromo-2-metilbutano": ["2-bromo-2-methylbutane", "CCC(C)(C)Br"], "2-bromo-3-metilbutano": ["2-bromo-3-methylbutane", "CC(Br)C(C)C"],
 "metanol": ["methanol", "CO"], "etanol": ["ethanol", "CCO"], "propan-1-ol": ["propan-1-ol", "CCCO"], "propan-2-ol": ["propan-2-ol", "CC(C)O"], "butan-1-ol": ["butan-1-ol", "CCCCO"],
 "butan-2-ol": ["butan-2-ol", "CCC(C)O"], "2-metilpropan-2-ol": ["2-methylpropan-2-ol", "CC(C)(C)O"], "2-metilbutan-2-ol": ["2-methylbutan-2-ol", "CCC(C)(C)O"], "2-metilpropan-1-ol": ["2-methylpropan-1-ol", "CC(C)CO"],
 "3-metilbutan-2-ol": ["3-methylbutan-2-ol", "CC(O)C(C)C"], "cicloexanol": ["cyclohexanol", "OC1CCCCC1"],
 "propanonitrila": ["propanenitrile", "CCC#N"], "etanamina": ["ethanamine", "CCN"], "metoxietano": ["methoxyethane", "CCOC"], "etoxietano": ["ethoxyethane", "CCOCC"],
 "benzeno": ["benzene", "c1ccccc1"], "clorobenzeno": ["chlorobenzene", "Clc1ccccc1"], "bromobenzeno": ["bromobenzene", "Brc1ccccc1"], "nitrobenzeno": ["nitrobenzene", "[O-][N+](=O)c1ccccc1"],
 "metilbenzeno": ["toluene", "Cc1ccccc1"], "etilbenzeno": ["ethylbenzene", "CCc1ccccc1"],
 "1-metil-2-nitrobenzeno": ["2-nitrotoluene", "Cc1ccccc1[N+](=O)[O-]"], "1-metil-4-nitrobenzeno": ["4-nitrotoluene", "Cc1ccc(cc1)[N+](=O)[O-]"], "1-metil-3-nitrobenzeno": ["3-nitrotoluene", "Cc1cccc(c1)[N+](=O)[O-]"],
 "1,3-dinitrobenzeno": ["1,3-dinitrobenzene", "[O-][N+](=O)c1cccc(c1)[N+](=O)[O-]"], "1,2-dinitrobenzeno": ["1,2-dinitrobenzene", "[O-][N+](=O)c1ccccc1[N+](=O)[O-]"], "1,4-dinitrobenzeno": ["1,4-dinitrobenzene", "[O-][N+](=O)c1ccc(cc1)[N+](=O)[O-]"],
 "1-bromo-2-metilbenzeno": ["2-bromotoluene", "Cc1ccccc1Br"], "1-bromo-4-metilbenzeno": ["4-bromotoluene", "Cc1ccc(Br)cc1"], "1-bromo-3-metilbenzeno": ["3-bromotoluene", "Cc1cccc(Br)c1"],
 "eteno": ["ethene", "C=C"], "propeno": ["propene", "C=CC"], "but-1-eno": ["but-1-ene", "C=CCC"], "but-2-eno": ["but-2-ene", "CC=CC"], "2-metilpropeno": ["2-methylpropene", "C=C(C)C"],
 "2-metilbut-2-eno": ["2-methylbut-2-ene", "CC=C(C)C"], "2-metilbut-1-eno": ["2-methylbut-1-ene", "C=C(C)CC"], "3-metilbut-1-eno": ["3-methylbut-1-ene", "C=CC(C)C"], "pent-1-eno": ["pent-1-ene", "C=CCCC"], "pent-2-eno": ["pent-2-ene", "CC=CCC"],
 "2,3-dimetilbut-2-eno": ["2,3-dimethylbut-2-ene", "CC(C)=C(C)C"], "cicloexeno": ["cyclohexene", "C1=CCCCC1"], "etino": ["ethyne", "C#C"], "propino": ["propyne", "C#CC"],
 "1,2-dibromoetano": ["1,2-dibromoethane", "BrCCBr"], "1,2-dicloroetano": ["1,2-dichloroethane", "ClCCCl"], "1,2-dibromopropano": ["1,2-dibromopropane", "CC(Br)CBr"], "2,3-dibromobutano": ["2,3-dibromobutane", "CC(Br)C(C)Br"],
 "1,2-dibromobutano": ["1,2-dibromobutane", "CCC(Br)CBr"], "1,2-dibromocicloexano": ["1,2-dibromocyclohexane", "BrC1CCCCC1Br"],
 "metanal": ["formaldehyde", "C=O"], "etanal": ["acetaldehyde", "CC=O"], "propanal": ["propanal", "CCC=O"], "butanal": ["butanal", "CCCC=O"], "2-metilpropanal": ["2-methylpropanal", "CC(C)C=O"],
 "propanona": ["acetone", "CC(C)=O"], "butanona": ["butan-2-one", "CCC(C)=O"], "3-metilbutan-2-ona": ["3-methylbutan-2-one", "CC(=O)C(C)C"], "cicloexanona": ["cyclohexanone", "O=C1CCCCC1"],
 "ácido metanoico": ["formic acid", "OC=O"], "ácido etanoico": ["acetic acid", "CC(=O)O"], "ácido propanoico": ["propanoic acid", "CCC(=O)O"], "ácido butanoico": ["butanoic acid", "CCCC(=O)O"], "ácido 2-metilpropanoico": ["2-methylpropanoic acid", "CC(C)C(=O)O"],
 "etanoato de etila": ["ethyl acetate", "CCOC(C)=O"], "etanoato de metila": ["methyl acetate", "COC(C)=O"], "metanoato de etila": ["ethyl formate", "CCOC=O"], "propanoato de metila": ["methyl propanoate", "CCC(=O)OC"],
 "etanoato de propila": ["propyl acetate", "CCCOC(C)=O"], "metanoato de metila": ["methyl formate", "COC=O"], "butanoato de etila": ["ethyl butanoate", "CCCC(=O)OCC"],
 "etanoato de sódio": ["sodium acetate", "CC(=O)[O-]"], "metanoato de sódio": ["sodium formate", "[O-]C=O"], "propanoato de sódio": ["sodium propanoate", "CCC(=O)[O-]"], "butanoato de sódio": ["sodium butanoate", "CCCC(=O)[O-]"],
}
INORG = {"Cl2": "ClCl", "Br2": "BrBr", "HCl": "Cl", "HBr": "Br", "H2O": "O", "H2": "[H][H]", "HNO3": "O[N+](=O)[O-]", "NaOH": "[OH-].[Na+]", "NaBr": "[Br-].[Na+]", "NaCl": "[Cl-].[Na+]", "NaCN": "[C-]#N.[Na+]", "NH3": "N", "CH3Cl": "CCl", "O3": None, "[O]": "[O]", "CH3ONa": "C[O-].[Na+]"}
# [tipo, reagente(s) orgânico(s), reagente inorgânico, condição, principal, secundário, coproduto, coef. do reagente inorgânico]
RX = [
 # substituição nucleofílica em haleto (SN2 em metila e primário; SN1 em terciário com água)
 ["sn", ["bromoetano"], "NaOH", "em água", "etanol", None, "NaBr"], ["sn", ["clorometano"], "NaOH", "em água", "metanol", None, "NaCl"], ["sn", ["1-bromopropano"], "NaOH", "em água", "propan-1-ol", None, "NaBr"],
 ["sn", ["1-clorobutano"], "NaOH", "em água", "butan-1-ol", None, "NaCl"], ["sn", ["1-bromobutano"], "NaOH", "em água", "butan-1-ol", None, "NaBr"], ["sn", ["bromometano"], "NaOH", "em água", "metanol", None, "NaBr"],
 ["sn-agua", ["2-bromo-2-metilpropano"], "H2O", "só água (meio neutro)", "2-metilpropan-2-ol", None, "HBr"], ["sn-agua", ["2-cloro-2-metilpropano"], "H2O", "só água (meio neutro)", "2-metilpropan-2-ol", None, "HCl"], ["sn-agua", ["2-bromo-2-metilbutano"], "H2O", "só água (meio neutro)", "2-metilbutan-2-ol", None, "HBr"],
 ["sn-cn", ["bromoetano"], "NaCN", "", "propanonitrila", None, "NaBr"], ["sn-nh3", ["bromoetano"], "NH3", "", "etanamina", None, "HBr"], ["sn-eter", ["bromoetano"], "CH3ONa", "", "metoxietano", None, "NaBr"],
 # substituição eletrofílica aromática
 ["sear-cl", ["benzeno"], "Cl2", "FeCl₃", "clorobenzeno", None, "HCl"], ["sear-br", ["benzeno"], "Br2", "FeBr₃", "bromobenzeno", None, "HBr"], ["sear-no2", ["benzeno"], "HNO3", "H₂SO₄ concentrado", "nitrobenzeno", None, "H2O"],
 ["sear-me", ["benzeno"], "CH3Cl", "AlCl₃", "metilbenzeno", None, "HCl"],
 ["sear-no2", ["metilbenzeno"], "HNO3", "H₂SO₄ concentrado", "1-metil-2-nitrobenzeno", "1-metil-4-nitrobenzeno", "H2O"], ["sear-br", ["metilbenzeno"], "Br2", "FeBr₃", "1-bromo-2-metilbenzeno", "1-bromo-4-metilbenzeno", "HBr"],
 ["sear-no2", ["nitrobenzeno"], "HNO3", "H₂SO₄ concentrado", "1,3-dinitrobenzeno", None, "H2O"],
 # esterificação e hidrólise de éster
 ["ester", ["ácido etanoico", "etanol"], None, "H⁺ (catalisador ácido), aquecimento", "etanoato de etila", None, "H2O"], ["ester", ["ácido etanoico", "metanol"], None, "H⁺ (catalisador ácido), aquecimento", "etanoato de metila", None, "H2O"],
 ["ester", ["ácido metanoico", "etanol"], None, "H⁺ (catalisador ácido), aquecimento", "metanoato de etila", None, "H2O"], ["ester", ["ácido propanoico", "metanol"], None, "H⁺ (catalisador ácido), aquecimento", "propanoato de metila", None, "H2O"],
 ["ester", ["ácido etanoico", "propan-1-ol"], None, "H⁺ (catalisador ácido), aquecimento", "etanoato de propila", None, "H2O"], ["ester", ["ácido metanoico", "metanol"], None, "H⁺ (catalisador ácido), aquecimento", "metanoato de metila", None, "H2O"],
 ["ester", ["ácido butanoico", "etanol"], None, "H⁺ (catalisador ácido), aquecimento", "butanoato de etila", None, "H2O"],
 ["sapon", ["etanoato de etila"], "NaOH", "em água", "etanoato de sódio", "etanol", None], ["sapon", ["etanoato de metila"], "NaOH", "em água", "etanoato de sódio", "metanol", None], ["sapon", ["metanoato de etila"], "NaOH", "em água", "metanoato de sódio", "etanol", None],
 ["sapon", ["propanoato de metila"], "NaOH", "em água", "propanoato de sódio", "metanol", None], ["sapon", ["butanoato de etila"], "NaOH", "em água", "butanoato de sódio", "etanol", None],
 # adição
 ["ad-h2", ["eteno"], "H2", "catalisador metálico (Pt, Pd ou Ni)", "etano", None, None], ["ad-h2", ["propeno"], "H2", "catalisador metálico (Pt, Pd ou Ni)", "propano", None, None], ["ad-h2", ["but-1-eno"], "H2", "catalisador metálico (Pt, Pd ou Ni)", "butano", None, None],
 ["ad-h2", ["but-2-eno"], "H2", "catalisador metálico (Pt, Pd ou Ni)", "butano", None, None], ["ad-h2", ["2-metilpropeno"], "H2", "catalisador metálico (Pt, Pd ou Ni)", "metilpropano", None, None], ["ad-h2", ["cicloexeno"], "H2", "catalisador metálico (Pt, Pd ou Ni)", "cicloexano", None, None],
 ["ad-h2", ["2-metilbut-2-eno"], "H2", "catalisador metálico (Pt, Pd ou Ni)", "2-metilbutano", None, None],
 ["ad-2h2", ["etino"], "H2", "catalisador metálico (Pt, Pd ou Ni), H₂ em excesso", "etano", None, None, 2], ["ad-2h2", ["propino"], "H2", "catalisador metálico (Pt, Pd ou Ni), H₂ em excesso", "propano", None, None, 2],
 ["ad-x2", ["eteno"], "Br2", "", "1,2-dibromoetano", None, None], ["ad-x2", ["eteno"], "Cl2", "", "1,2-dicloroetano", None, None], ["ad-x2", ["propeno"], "Br2", "", "1,2-dibromopropano", None, None],
 ["ad-x2", ["but-2-eno"], "Br2", "", "2,3-dibromobutano", None, None], ["ad-x2", ["but-1-eno"], "Br2", "", "1,2-dibromobutano", None, None], ["ad-x2", ["cicloexeno"], "Br2", "", "1,2-dibromocicloexano", None, None],
 ["ad-hx", ["propeno"], "HBr", "", "2-bromopropano", "1-bromopropano", None], ["ad-hx", ["propeno"], "HCl", "", "2-cloropropano", "1-cloropropano", None], ["ad-hx", ["but-1-eno"], "HBr", "", "2-bromobutano", "1-bromobutano", None],
 ["ad-hx", ["2-metilpropeno"], "HBr", "", "2-bromo-2-metilpropano", "1-bromo-2-metilpropano", None], ["ad-hx", ["2-metilpropeno"], "HCl", "", "2-cloro-2-metilpropano", "1-cloro-2-metilpropano", None],
 ["ad-hx", ["2-metilbut-2-eno"], "HCl", "", "2-cloro-2-metilbutano", "2-cloro-3-metilbutano", None], ["ad-hx", ["2-metilbut-2-eno"], "HBr", "", "2-bromo-2-metilbutano", "2-bromo-3-metilbutano", None],
 ["ad-hx", ["eteno"], "HCl", "", "cloroetano", None, None], ["ad-hx", ["eteno"], "HBr", "", "bromoetano", None, None], ["ad-hx", ["but-2-eno"], "HBr", "", "2-bromobutano", None, None], ["ad-hx", ["but-1-eno"], "HCl", "", "2-clorobutano", "1-clorobutano", None],
 ["ad-hx-anti", ["propeno"], "HBr", "com peróxido", "1-bromopropano", "2-bromopropano", None], ["ad-hx-anti", ["but-1-eno"], "HBr", "com peróxido", "1-bromobutano", "2-bromobutano", None], ["ad-hx-anti", ["2-metilpropeno"], "HBr", "com peróxido", "1-bromo-2-metilpropano", "2-bromo-2-metilpropano", None],
 ["ad-h2o", ["eteno"], "H2O", "H⁺ (catalisador ácido)", "etanol", None, None], ["ad-h2o", ["propeno"], "H2O", "H⁺ (catalisador ácido)", "propan-2-ol", "propan-1-ol", None], ["ad-h2o", ["but-1-eno"], "H2O", "H⁺ (catalisador ácido)", "butan-2-ol", "butan-1-ol", None],
 ["ad-h2o", ["2-metilpropeno"], "H2O", "H⁺ (catalisador ácido)", "2-metilpropan-2-ol", "2-metilpropan-1-ol", None], ["ad-h2o", ["but-2-eno"], "H2O", "H⁺ (catalisador ácido)", "butan-2-ol", None, None],
 ["ad-h2o", ["2-metilbut-2-eno"], "H2O", "H⁺ (catalisador ácido)", "2-metilbutan-2-ol", "3-metilbutan-2-ol", None], ["ad-h2o", ["cicloexeno"], "H2O", "H⁺ (catalisador ácido)", "cicloexanol", None, None],
 # eliminação
 ["el-h2o", ["etanol"], None, "H₂SO₄ concentrado, aquecimento forte", "eteno", None, "H2O"], ["el-h2o", ["propan-2-ol"], None, "H₂SO₄ concentrado, aquecimento forte", "propeno", None, "H2O"], ["el-h2o", ["propan-1-ol"], None, "H₂SO₄ concentrado, aquecimento forte", "propeno", None, "H2O"],
 ["el-h2o", ["butan-2-ol"], None, "H₂SO₄ concentrado, aquecimento forte", "but-2-eno", "but-1-eno", "H2O"], ["el-h2o", ["2-metilbutan-2-ol"], None, "H₂SO₄ concentrado, aquecimento forte", "2-metilbut-2-eno", "2-metilbut-1-eno", "H2O"],
 ["el-h2o", ["2-metilpropan-2-ol"], None, "H₂SO₄ concentrado, aquecimento forte", "2-metilpropeno", None, "H2O"], ["el-h2o", ["3-metilbutan-2-ol"], None, "H₂SO₄ concentrado, aquecimento forte", "2-metilbut-2-eno", "3-metilbut-1-eno", "H2O"],
 ["el-h2o", ["cicloexanol"], None, "H₂SO₄ concentrado, aquecimento forte", "cicloexeno", None, "H2O"],
 ["el-hx", ["bromoetano"], "NaOH", "base forte, aquecimento", "eteno", None, "NaBr+H2O"], ["el-hx", ["2-bromopropano"], "NaOH", "base forte, aquecimento", "propeno", None, "NaBr+H2O"],
 ["el-hx", ["2-bromobutano"], "NaOH", "base forte, aquecimento", "but-2-eno", "but-1-eno", "NaBr+H2O"], ["el-hx", ["2-clorobutano"], "NaOH", "base forte, aquecimento", "but-2-eno", "but-1-eno", "NaCl+H2O"],
 ["el-hx", ["2-bromo-2-metilbutano"], "NaOH", "base forte, aquecimento", "2-metilbut-2-eno", "2-metilbut-1-eno", "NaBr+H2O"], ["el-hx", ["2-bromo-2-metilpropano"], "NaOH", "base forte, aquecimento", "2-metilpropeno", None, "NaBr+H2O"],
 ["el-hx", ["2-cloro-2-metilbutano"], "NaOH", "base forte, aquecimento", "2-metilbut-2-eno", "2-metilbut-1-eno", "NaCl+H2O"], ["el-hx", ["2-bromo-3-metilbutano"], "NaOH", "base forte, aquecimento", "2-metilbut-2-eno", "3-metilbut-1-eno", "NaBr+H2O"],
 ["el-eter", ["etanol", "etanol"], None, "H₂SO₄, 140 °C", "etoxietano", None, "H2O"],
 # oxidação e redução
 ["ox-parcial", ["etanol"], "[O]", "oxidante seletivo, que para no aldeído", "etanal", None, "H2O"], ["ox-parcial", ["propan-1-ol"], "[O]", "oxidante seletivo, que para no aldeído", "propanal", None, "H2O"], ["ox-parcial", ["metanol"], "[O]", "oxidante seletivo, que para no aldeído", "metanal", None, "H2O"],
 ["ox-parcial", ["butan-1-ol"], "[O]", "oxidante seletivo, que para no aldeído", "butanal", None, "H2O"], ["ox-parcial", ["2-metilpropan-1-ol"], "[O]", "oxidante seletivo, que para no aldeído", "2-metilpropanal", None, "H2O"],
 ["ox-total", ["etanol"], "[O]", "KMnO₄ ou reagente de Cr(VI), em excesso", "ácido etanoico", None, "H2O", 2], ["ox-total", ["propan-1-ol"], "[O]", "KMnO₄ ou reagente de Cr(VI), em excesso", "ácido propanoico", None, "H2O", 2], ["ox-total", ["butan-1-ol"], "[O]", "KMnO₄ ou reagente de Cr(VI), em excesso", "ácido butanoico", None, "H2O", 2],
 ["ox-total", ["metanol"], "[O]", "KMnO₄ ou reagente de Cr(VI), em excesso", "ácido metanoico", None, "H2O", 2], ["ox-total", ["2-metilpropan-1-ol"], "[O]", "KMnO₄ ou reagente de Cr(VI), em excesso", "ácido 2-metilpropanoico", None, "H2O", 2],
 ["ox-sec", ["propan-2-ol"], "[O]", "KMnO₄ ou reagente de Cr(VI)", "propanona", None, "H2O"], ["ox-sec", ["butan-2-ol"], "[O]", "KMnO₄ ou reagente de Cr(VI)", "butanona", None, "H2O"], ["ox-sec", ["3-metilbutan-2-ol"], "[O]", "KMnO₄ ou reagente de Cr(VI)", "3-metilbutan-2-ona", None, "H2O"], ["ox-sec", ["cicloexanol"], "[O]", "KMnO₄ ou reagente de Cr(VI)", "cicloexanona", None, "H2O"],
 ["ox-nao", ["2-metilpropan-2-ol"], "[O]", "KMnO₄ ou reagente de Cr(VI)", None, None, None], ["ox-nao", ["2-metilbutan-2-ol"], "[O]", "KMnO₄ ou reagente de Cr(VI)", None, None, None],
 ["ox-ald", ["etanal"], "[O]", "oxidante (até os fracos, como o reagente de Tollens)", "ácido etanoico", None, None], ["ox-ald", ["propanal"], "[O]", "oxidante (até os fracos, como o reagente de Tollens)", "ácido propanoico", None, None],
 ["ox-ald", ["metanal"], "[O]", "oxidante (até os fracos, como o reagente de Tollens)", "ácido metanoico", None, None], ["ox-ald", ["butanal"], "[O]", "oxidante (até os fracos, como o reagente de Tollens)", "ácido butanoico", None, None],
 ["ozon", ["but-2-eno"], "O3", "O₃, depois Zn", "etanal", "etanal", None], ["ozon", ["2-metilbut-2-eno"], "O3", "O₃, depois Zn", "propanona", "etanal", None], ["ozon", ["propeno"], "O3", "O₃, depois Zn", "etanal", "metanal", None],
 ["ozon", ["2,3-dimetilbut-2-eno"], "O3", "O₃, depois Zn", "propanona", "propanona", None], ["ozon", ["but-1-eno"], "O3", "O₃, depois Zn", "propanal", "metanal", None], ["ozon", ["2-metilpropeno"], "O3", "O₃, depois Zn", "propanona", "metanal", None],
 ["ozon", ["pent-2-eno"], "O3", "O₃, depois Zn", "propanal", "etanal", None], ["ozon", ["eteno"], "O3", "O₃, depois Zn", "metanal", "metanal", None],
 ["red", ["etanal"], "H2", "catalisador metálico ou hidreto", "etanol", None, None], ["red", ["propanal"], "H2", "catalisador metálico ou hidreto", "propan-1-ol", None, None], ["red", ["propanona"], "H2", "catalisador metálico ou hidreto", "propan-2-ol", None, None],
 ["red", ["butanona"], "H2", "catalisador metálico ou hidreto", "butan-2-ol", None, None], ["red", ["metanal"], "H2", "catalisador metálico ou hidreto", "metanol", None, None], ["red", ["cicloexanona"], "H2", "catalisador metálico ou hidreto", "cicloexanol", None, None],
]
RAD = ["metano", "etano", "propano", "butano", "metilpropano", "pentano", "2-metilbutano", "dimetilpropano", "cicloexano"]
NOX = ["metano", "clorometano", "metanol", "metanal", "ácido metanoico", "etano", "eteno", "etino", "etanol", "etanal", "ácido etanoico", "propan-2-ol", "propanona", "propan-1-ol", "propanal", "ácido propanoico", "cloroetano", "etanoato de etila", "butan-2-ol", "butanona", "2-metilpropan-2-ol", "benzeno", "propeno", "1,2-dibromoetano", "etanamina"]
ARQ = os.path.join(RAIZ, "tools", "quimica", "pubchem-reacoes.json")
cache = json.load(open(ARQ)) if os.path.exists(ARQ) else {}
def can(s, tira_na=True):
    m = Chem.MolFromSmiles(s); Chem.RemoveStereochemistry(m); return Chem.MolToSmiles(m)
def busca(nome):
    if nome in cache: return cache[nome]
    if "--offline" in sys.argv: return None
    url = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + urllib.parse.quote(nome) + "/property/SMILES,ConnectivitySMILES/JSON"
    r = subprocess.run(["curl", "-sS", "-m", "40", "-A", "curl", url], capture_output=True, text=True)
    try: p = json.loads(r.stdout)["PropertyTable"]["Properties"][0]
    except Exception: return None
    cache[nome] = {"cid": p.get("CID"), "smiles": p.get("ConnectivitySMILES") or p.get("SMILES")}; return cache[nome]
def maior(s):  # maior componente (tira o Na+ dos sais)
    return max(s.split("."), key=len)
ruins, sem = [], []
for pt, (en, smi) in C.items():
    r = busca(en)
    if r is None: sem.append(en); continue
    a, b = can(maior(r["smiles"])), can(smi)
    if a != b and Chem.MolToSmiles(Chem.MolFromSmiles(a.replace("[O-]", "O").replace("[N+]", "N") if "N" not in b else a)) != Chem.MolToSmiles(Chem.MolFromSmiles(b.replace("[O-]", "O") if "N" not in b else b)): ruins.append((pt, en, r["smiles"]))
json.dump(cache, open(ARQ, "w"), ensure_ascii=False, indent=1)
def atomos(smi):
    m = Chem.AddHs(Chem.MolFromSmiles(smi)); return Counter(a.GetSymbol() for a in m.GetAtoms())
def aplica(sma, *reag):
    rx = AllChem.ReactionFromSmarts(sma); out = set()
    for ps in rx.RunReactants(tuple(Chem.MolFromSmiles(x) for x in reag)):
        try:
            for p in ps: Chem.SanitizeMol(p)
            out.add(tuple(sorted(Chem.MolToSmiles(p) for p in ps)))
        except Exception: pass
    return out
X = {"HBr": "Br", "HCl": "Cl", "Br2": "Br", "Cl2": "Cl", "NaBr": "Br", "NaCl": "Cl"}
def nH(smi, patt):  # nº de H do carbono marcado no padrão
    m = Chem.MolFromSmiles(smi); return [m.GetAtomWithIdx(t[0]).GetTotalNumHs() for t in m.GetSubstructMatches(Chem.MolFromSmarts(patt))]
def subst(smi):  # nº de carbonos ligados aos carbonos da dupla (grau de substituição do alceno)
    m = Chem.MolFromSmiles(smi); b = [x for x in m.GetBonds() if x.GetBondType() == Chem.BondType.DOUBLE and x.GetBeginAtom().GetSymbol() == "C" and x.GetEndAtom().GetSymbol() == "C"][0]
    return sum(1 for a in (b.GetBeginAtom(), b.GetEndAtom()) for v in a.GetNeighbors() if v.GetSymbol() == "C") - 2
erros, saida = [], []
for r in RX:
    tipo, org, ino, cond, pri, sec, co = r[:7]; coef = r[7] if len(r) > 7 else 1
    s = [C[n][1] for n in org]; P = can(C[pri][1]) if pri else None; S = can(C[sec][1]) if sec else None; x = X.get(ino) or X.get((co or "").split("+")[0])
    prods = set()
    if tipo in ("sn", "sn-agua"): prods = {p[0] for p in aplica(f"[C:1][{x}]>>[C:1]O", s[0])}
    elif tipo == "sn-cn": prods = {p[0] for p in aplica("[C:1]Br>>[C:1]C#N", s[0])}
    elif tipo == "sn-nh3": prods = {p[0] for p in aplica("[C:1]Br>>[C:1]N", s[0])}
    elif tipo == "sn-eter": prods = {p[0] for p in aplica("[C:1]Br>>[C:1]OC", s[0])}
    elif tipo.startswith("sear"):
        g = {"sear-cl": "Cl", "sear-br": "Br", "sear-no2": "[N+](=O)[O-]", "sear-me": "C"}[tipo]; prods = {p[0] for p in aplica(f"[cH:1]>>[c:1]{g}", s[0])}
        if s[0] == "Cc1ccccc1": assert P in prods and S in prods and len(prods) == 3, r   # orto, meta, para: o metil dirige orto e para
        if "N+" in s[0]: assert len(prods) == 3 and P == can(C["1,3-dinitrobenzeno"][1]), r    # o nitro dirige meta
    elif tipo == "ester": prods = {p[0] for p in aplica("[C:1](=[O:2])[OH].[OH][C:3]>>[C:1](=[O:2])O[C:3]", s[0], s[1])}
    elif tipo == "sapon":
        pp = aplica("[C:1](=[O:2])O[C:3]>>[C:1](=[O:2])[O-].[C:3]O", s[0]); prods = {x2 for p in pp for x2 in p}
    elif tipo == "ad-h2": prods = {p[0] for p in aplica("[C:1]=[C:2]>>[C:1][C:2]", s[0])}
    elif tipo == "ad-2h2": prods = {p[0] for p in aplica("[C:1]#[C:2]>>[C:1][C:2]", s[0])}
    elif tipo == "ad-x2": prods = {p[0] for p in aplica(f"[C:1]=[C:2]>>[C:1]({x})[C:2]{x}", s[0])}
    elif tipo in ("ad-hx", "ad-hx-anti", "ad-h2o"):
        g = "O" if tipo == "ad-h2o" else x; prods = {p[0] for p in aplica(f"[C:1]=[C:2]>>[C:1][C:2]{g}", s[0])}
        if len(prods) == 2:  # regra: no produto de Markovnikov, o carbono que recebeu X é o que tinha MENOS hidrogênios
            hP, hS = nH(P, f"[C][{g}]")[0], nH(S, f"[C][{g}]")[0]
            assert (hP < hS) if tipo != "ad-hx-anti" else (hP > hS), ("regra", r)
        else: assert sec is None, r
    elif tipo in ("el-h2o", "el-hx"):
        g = "O" if tipo == "el-h2o" else x; prods = {p[0] for p in aplica(f"[C;!H0:1][C:2][{g}]>>[C:1]=[C:2]", s[0])}
        if len(prods) == 2: assert subst(P) > subst(S), ("Zaitsev", r)
        else: assert sec is None, r
    elif tipo == "el-eter": prods = {p[0] for p in aplica("[C:1][OH].[OH][C:2]>>[C:1]O[C:2]", s[0], s[1])}
    elif tipo == "ox-parcial": prods = {p[0] for p in aplica("[CH2,CH3:1][OH:2]>>[C:1]=[O:2]", s[0])}
    elif tipo == "ox-total": prods = {p[0] for p in aplica("[CH2,CH3:1][OH:2]>>[C:1](=O)[O:2]", s[0])}
    elif tipo == "ox-sec": prods = {p[0] for p in aplica("[CH1;$(C([#6])[#6]):1][OH:2]>>[C:1]=[O:2]", s[0])}
    elif tipo == "ox-nao": assert not aplica("[C;!H0:1][OH:2]>>[C:1]=[O:2]", s[0]), r; prods = {None}
    elif tipo == "ox-ald": prods = {p[0] for p in aplica("[CH1,CH2:1]=[O:2]>>[C:1](=[O:2])O", s[0])}
    elif tipo == "red": prods = {p[0] for p in aplica("[C:1]=[O:2]>>[C:1][O:2]", s[0])}
    elif tipo == "ozon":
        pp = aplica("[C:1]=[C:2]>>[C:1]=O.[C:2]=O", s[0]); assert tuple(sorted([P, S])) in pp, ("ozon", r); prods = {P, S}
    if P not in prods or (S and S not in prods and tipo != "ozon"): erros.append(("produto", r, sorted(map(str, prods))))
    # balanço de átomos
    if pri:
        esq = sum((atomos(x2) for x2 in s), Counter())
        if ino and INORG.get(ino): 
            for _ in range(coef): esq += atomos(INORG[ino])
        if tipo == "ozon": esq += Counter({"O": 2})
        dire = atomos(C[pri][1]) + (atomos(C[sec][1]) if sec and tipo in ("sapon", "ozon") else Counter())
        if tipo == "sapon": dire += Counter({"Na": 1})
        for c in (co or "").split("+"):
            if c: dire += atomos(INORG[c])
        if esq != dire: erros.append(("balanço", r, dict(esq), dict(dire)))
    saida.append({"t": tipo, "r": org, "i": ino, "cond": cond, "p": pri, "s": sec, "co": co, "k": coef})
# halogenação radicalar: todos os produtos monoclorados, com o nº de H equivalentes
rad = []
for n in RAD:
    m = Chem.MolFromSmiles(C[n][1]); cont = Counter(); cls = {}
    for a in m.GetAtoms():
        if a.GetTotalNumHs() == 0: continue
        e = Chem.RWMol(m); k = e.AddAtom(Chem.Atom(17)); e.AddBond(a.GetIdx(), k, Chem.BondType.SINGLE); p = e.GetMol(); Chem.SanitizeMol(p); sp = Chem.MolToSmiles(p)
        cont[sp] += a.GetTotalNumHs(); cls[sp] = sum(1 for v in a.GetNeighbors() if v.GetSymbol() == "C")
    inv = {can(v[1]): k for k, v in C.items()}
    lista = []
    for sp, h in cont.items():
        if sp not in inv: erros.append(("radicalar sem nome", n, sp)); continue
        lista.append([inv[sp], h, cls[sp]])
    assert sum(x[1] for x in lista) == atomos(C[n][1])["H"], n
    rad.append({"r": n, "p": sorted(lista, key=lambda x: (x[2], x[0]))})
# número de oxidação de cada carbono
def nox(smi):
    m = Chem.MolFromSmiles(smi); out = []
    for a in m.GetAtoms():
        if a.GetSymbol() != "C": continue
        v = -a.GetTotalNumHs() + a.GetFormalCharge()
        for b in a.GetBonds():
            o = b.GetOtherAtom(a)
            if o.GetSymbol() != "C": v += int(round(b.GetBondTypeAsDouble()))
        out.append(v)
    return out
noxs = {n: nox(C[n][1]) for n in NOX}
J = lambda o: json.dumps(o, ensure_ascii=False)
bloco = ("/*RX-INI*/ /* GERADO por tools/quimica/gera-reacoes.py (RDKit): não editar à mão. NOMES: nome → SMILES. RX: t tipo, r reagentes orgânicos, i reagente inorgânico, cond, p produto principal, s secundário (ou segundo produto), co coproduto, k coeficiente de i. RAD: produtos monoclorados [nome, nº de H que levam a ele, classe do carbono]. NOX: nº de oxidação de cada carbono, na ordem do SMILES */\n"
  + "  SIM.org.NOMES = {\n" + "\n".join(f"    {J(k)}: {J(v[1])}," for k, v in C.items()) + "\n  };\n"
  + "  SIM.org.RX = [\n" + "\n".join("    " + J(x) + "," for x in saida) + "\n  ];\n"
  + "  SIM.org.RAD = [\n" + "\n".join("    " + J(x) + "," for x in rad) + "\n  ];\n"
  + "  SIM.org.NOX = " + J(noxs) + ";\n  /*RX-FIM*/")
arq = os.path.join(RAIZ, "assets", "sims", "quimica", "organica.js"); t = open(arq, encoding="utf-8").read()
if "/*RX-INI*/" in t: t = re.sub(r"/\*RX-INI\*/.*?/\*RX-FIM\*/", lambda _: bloco, t, flags=re.S)
else: t = t.replace("  /*PROP-INI*/", "  " + bloco + "\n\n  /*PROP-INI*/", 1)
if not erros: open(arq, "w", encoding="utf-8").write(t)
print(len(C), "compostos;", len(saida), "reações;", len(rad), "halogenações radicalares;", len(noxs), "moléculas com nox")
print("PubChem: diferentes", len(ruins), ruins, "; sem resposta", len(sem), sem)
print("ERROS", len(erros)); [print("  ", e) for e in erros]
sys.exit(1 if erros or ruins else 0)
