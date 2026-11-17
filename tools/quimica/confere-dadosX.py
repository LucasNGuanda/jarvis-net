#!/usr/bin/env python3
"""Confere que cada constante escrita à mão nos experimentos de química (assets/sims/quimica/exp-*.js e temas EQ) está em tools/quimica/dadosX.json,
no trecho de fonte guardado. Uso: python3 tools/quimica/confere-dadosX.py   (sai com código 1 se algo não bater)
Cada linha de PEDIDOS: [seção, chave, texto que tem de aparecer no valor ou no trecho de algum item dessa chave, para que serve]."""
import json, os, sys
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
D = json.load(open(os.path.join(RAIZ, "tools", "quimica", "dadosX.json"), encoding="utf-8"))
def texto(sec, chave):
    v = D[sec][chave]
    its = v if isinstance(v, list) else [x for vv in v.values() for x in (vv if isinstance(vv, list) else [vv])]
    return " ".join(str(i.get("valor")) + " " + str(i.get("valor_texto")) + " " + str(i.get("trecho")) for i in its if isinstance(i, dict))
PEDIDOS = [
    # EQ13 decaimento
    ["decaimento", "carbono_14_meia_vida", "5700", "C-14: 5700 anos"], ["decaimento", "carbono_14_produto", "nitrogen-14", "C-14 → N-14"],
    ["decaimento", "iodo_131_meia_vida", "8.0249", "I-131: 8,0249 dias"], ["decaimento", "iodo_131_produto", "131Xe", "I-131 → Xe-131"],
    ["decaimento", "tritio_meia_vida", "12.32", "H-3: 12,32 anos"], ["decaimento", "tritio_produto", "3He", "H-3 → He-3"],
    ["decaimento", "cesio_137_meia_vida", "30.04", "Cs-137: 30,04 anos"], ["decaimento", "cesio_137_produto", "137Ba", "Cs-137 → Ba-137"],
    ["decaimento", "radio_226_meia_vida", "1600", "Ra-226: 1600 anos"], ["decaimento", "radio_226_produto", "222Rn", "Ra-226 → Rn-222"],
    ["decaimento", "radonio_222_meia_vida", "3.8215", "Rn-222: 3,8215 dias"], ["decaimento", "radonio_222_produto", "218Po", "Rn-222 → Po-218"],
    ["decaimento", "polonio_210_meia_vida", "138.376", "Po-210: 138,376 dias"], ["decaimento", "polonio_210_produto", "206Pb", "Po-210 → Pb-206"],
    ["decaimento", "uranio_238_meia_vida", "4.463", "U-238: 4,463 bilhões de anos"], ["decaimento", "uranio_238_produto", "234Th", "U-238 → Th-234"],
    ["decaimento", "definicao_meia_vida", "reduce to half", "definição de meia-vida"],
    # EQ12 fissão
    ["fissao", "energia_por_fissao", "200", "200 MeV por fissão"], ["fissao", "neutrons_por_fissao", "2.5", "2,5 nêutrons por fissão"],
    ["fissao", "k_critico", "criticality", "k = 1"], ["fissao", "k_supercritico", "increasing", "k > 1"], ["fissao", "k_subcritico", "decreasing", "k < 1"],
    ["fissao", "barras_de_controle", "control the rate of fission", "barras de controle"], ["fissao", "barras_de_controle_materiais", "absorbing", "barras absorvem nêutrons"],
    ["fissao", "moderador", "reduces the speed of fast neutrons", "moderador"], ["fissao", "equacao_exemplo", "144_56Ba", "exemplo de fissão: Ba-144 + Kr-89 + 3 n"],
    # EQ14 fusão
    ["fusao", "DT_energias", "17.6", "D + T: 17,6 MeV"], ["fusao", "DT_energias", "14.1", "nêutron: 14,1 MeV"], ["fusao", "DT_energias", "3.5", "He-4: 3,5 MeV"],
    ["fusao", "sol_temperatura_do_nucleo", "15.7", "núcleo do Sol: 15,7 milhões de K"], ["fusao", "barreira_de_coulomb_DT", "0.1", "barreira D-T ~0,1 MeV"],
    ["fusao", "barreira_de_coulomb_tunelamento", "do not actually have to have enough energy", "tunelamento"], ["fusao", "pp_energia_total", "26.73", "cadeia pp: 26,73 MeV"],
    ["fusao", "Fe56_mais_ligado", "most efficiently bound", "Fe-56"],
    #MAIS
]
falhas = 0
for sec, chave, pal, para in PEDIDOS:
    try: ok = pal in texto(sec, chave)
    except KeyError: ok = False
    if not ok: falhas += 1
    print(("ok    " if ok else "FALHA ") + f"{sec}/{chave}: \"{pal}\"  ({para})")
print(f"{len(PEDIDOS)} constantes conferidas; FALHAS ({falhas})")
sys.exit(1 if falhas else 0)
