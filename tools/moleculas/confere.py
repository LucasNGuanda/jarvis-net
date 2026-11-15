#!/usr/bin/env python3
"""Confere, fora do navegador, a conta do construtor VSEPR (SIM.qVseprConta): ângulos ideais das 13 geometrias e soma dos dipolos de ligação.
Uso (na raiz do projeto): python3 tools/moleculas/confere.py
As eletronegatividades são lidas de assets/tabela-dados.js (as mesmas que o site usa)."""
import json, math, subprocess, itertools
EN = json.loads(subprocess.check_output(["node", "-e", "global.window={};require('./assets/tabela-dados.js');const o={};window.TABELA_DADOS.elementos.forEach(e=>{if(e)o[e.s]=e.en});console.log(JSON.stringify(o))"]))
s8 = math.sqrt(8) / 3
def c3(k): return (math.cos(k * 2 * math.pi / 3), math.sin(k * 2 * math.pi / 3))
GEO = {2: [(1, 0, 0), (-1, 0, 0)], 3: [(0, 1, 0), (-math.sqrt(3) / 2, -0.5, 0), (math.sqrt(3) / 2, -0.5, 0)],
       4: [(0, 1, 0)] + [(s8 * c3(k)[0], -1 / 3, s8 * c3(k)[1]) for k in range(3)],
       5: [(c3(k)[0], 0, c3(k)[1]) for k in range(3)] + [(0, 1, 0), (0, -1, 0)],
       6: [(0, -1, 0), (0, 1, 0), (1, 0, 0), (-1, 0, 0), (0, 0, 1), (0, 0, -1)]}
def ang(u, v): return math.degrees(math.acos(max(-1, min(1, sum(a * b for a, b in zip(u, v))))))
def conta(central, ligs, E):
    d = GEO[len(ligs) + E][E:]; mu = [0, 0, 0]
    for l, v in zip(ligs, d):
        for i in range(3): mu[i] += (EN[l] - EN[central]) * v[i]
    return math.hypot(*mu), sorted(set(round(ang(a, b), 1) for a, b in itertools.combinations(d, 2)))
print("ângulos ideais entre ligações:")
for X, E in [(2, 0), (3, 0), (2, 1), (4, 0), (3, 1), (2, 2), (5, 0), (4, 1), (3, 2), (2, 3), (6, 0), (5, 1), (4, 2)]:
    print("  AX%dE%d: %s" % (X, E, conta("C", ["H"] * X, E)[1]))
print("soma dos dipolos de ligação (em Δχ de Pauling):")
CASOS = [("CO2", "C", ["O"] * 2, 0), ("BF3", "B", ["F"] * 3, 0), ("CH4", "C", ["H"] * 4, 0), ("CCl4", "C", ["Cl"] * 4, 0), ("XeF2", "Xe", ["F"] * 2, 3), ("XeF4", "Xe", ["F"] * 4, 2), ("SF6", "S", ["F"] * 6, 0), ("PCl5", "P", ["Cl"] * 5, 0),
         ("H2O", "O", ["H"] * 2, 2), ("NH3", "N", ["H"] * 3, 1), ("CH3Cl", "C", ["Cl", "H", "H", "H"], 0), ("CH2Cl2", "C", ["Cl", "Cl", "H", "H"], 0), ("CHCl3", "C", ["H", "Cl", "Cl", "Cl"], 0), ("SF4", "S", ["F"] * 4, 1), ("ClF3", "Cl", ["F"] * 3, 2)]
for nome, c, l, E in CASOS: print("  %-7s %.3f" % (nome, conta(c, l, E)[0]))
