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
    # EQ22 chama e EQ23 espectro
    ["linhas_de_emissao", "litio", "670.8", "Li: 670,8 nm"], ["linhas_de_emissao", "sodio_D_pirotecnia", "589", "Na: 589 nm"], ["linhas_de_emissao", "potassio", "766.5", "K: 766,5 nm"],
    ["linhas_de_emissao", "cor_da_chama_sodium", "invisible through cobalt blue glass", "o amarelo do sódio não passa pelo vidro de cobalto"],
    ["espectro_hidrogenio", "constante_de_rydberg", "10967700", "R_H = 1,09677e7 m⁻¹"], ["espectro_hidrogenio", "energia_nivel_fundamental", "13.6", "13,6 eV"],
    ["espectro_hidrogenio", "energia_niveis_2_e_3", "-3.4", "E₂ = −3,4 eV"], ["espectro_hidrogenio", "H_alfa_comprimento_de_onda", "656.3", "H-alfa 656,3 nm"],
    ["espectro_hidrogenio", "H_beta_comprimento_de_onda", "486.1", "H-beta 486,1 nm"], ["espectro_hidrogenio", "H_gama_comprimento_de_onda", "434.0", "H-gama 434,0 nm"],
    ["espectro_hidrogenio", "H_delta_comprimento_de_onda", "410.2", "H-delta 410,2 nm"], ["espectro_hidrogenio", "lyman_alfa_comprimento_de_onda", "121.57", "Lyman-alfa"],
    ["espectro_hidrogenio", "paschen_alfa_comprimento_de_onda", "1875", "Paschen-alfa"], ["espectro_hidrogenio", "H_alfa_cor", "Red", "H-alfa vermelha"], ["espectro_hidrogenio", "H_beta_cor", "Cyan", "H-beta ciano"],
    ["espectro_hidrogenio", "H_delta_cor", "Violet", "H-delta violeta"], ["espectro_hidrogenio", "lyman_faixa", "ultraviolet", "Lyman no UV"], ["espectro_hidrogenio", "paschen_faixa", "infrared", "Paschen no IV"],
    # EQ17 pontos de ebulição
    ["forcas_intermoleculares", "metano_ebulicao", "-161.49", "CH4"], ["forcas_intermoleculares", "etano_ebulicao", "-88.5", "C2H6"], ["forcas_intermoleculares", "propano_ebulicao", "-42.25", "C3H8 (faixa)"],
    ["forcas_intermoleculares", "propano_ebulicao", "-42.04", "C3H8 (faixa)"], ["forcas_intermoleculares", "butano_ebulicao", "-1", "C4H10 (faixa −1 a 1)"], ["forcas_intermoleculares", "pentano_ebulicao", "35.9", "C5H12 (faixa)"],
    ["forcas_intermoleculares", "pentano_ebulicao", "36.3", "C5H12 (faixa)"], ["forcas_intermoleculares", "hexano_ebulicao", "68.5", "C6H14 (faixa)"], ["forcas_intermoleculares", "hexano_ebulicao", "69.1", "C6H14 (faixa)"],
    ["forcas_intermoleculares", "He_ebulicao", "-268.928", "He"], ["forcas_intermoleculares", "Ne_ebulicao", "-246.046", "Ne"], ["forcas_intermoleculares", "Ar_ebulicao", "-185.848", "Ar"],
    ["forcas_intermoleculares", "Kr_ebulicao", "-153.415", "Kr"], ["forcas_intermoleculares", "Xe_ebulicao", "-108.099", "Xe"], ["forcas_intermoleculares", "HF_ebulicao", "19.5", "HF"],
    ["forcas_intermoleculares", "HCl_ebulicao", "-85.05", "HCl"], ["forcas_intermoleculares", "HBr_ebulicao", "-66.8", "HBr"], ["forcas_intermoleculares", "HI_ebulicao", "-35.36", "HI"],
    ["forcas_intermoleculares", "H2O_ebulicao", "99.98", "H2O"], ["forcas_intermoleculares", "H2S_ebulicao", "-59.55", "H2S"], ["forcas_intermoleculares", "H2Se_ebulicao", "-41.25", "H2Se"],
    ["forcas_intermoleculares", "H2Te_ebulicao", "-2.2", "H2Te"], ["forcas_intermoleculares", "etanol_ebulicao", "78.23", "etanol"], ["forcas_intermoleculares", "eter_dimetilico_ebulicao", "-24", "éter dimetílico"],
    # EQ18 cristais
    ["cristais", "NaCl_numero_de_coordenacao", "six", "NaCl: 6"], ["cristais", "CsCl_numero_de_coordenacao", "8", "CsCl: 8"], ["cristais", "ZnS_numero_de_coordenacao", "four", "ZnS: 4"],
    ["cristais", "raio_Na_mais", "102", "Na+ 102 pm"], ["cristais", "raio_Cs_mais", "167", "Cs+ 167 pm"], ["cristais", "raio_Zn2_mais", "74", "Zn2+ 74 pm"], ["cristais", "raio_Cl_menos", "181", "Cl− 181 pm"],
    ["cristais", "raio_S2_menos", "184", "S2− 184 pm"], ["cristais", "razao_de_raios_critica_CN4", "0.2247", "razão crítica CN 4"], ["cristais", "razao_de_raios_critica_CN6", "0.4142", "razão crítica CN 6"],
    ["cristais", "razao_de_raios_critica_CN8", "0.732", "razão crítica CN 8"], ["cristais", "razao_de_raios_limite", "not obeyed for all compounds", "a regra falha em alguns"],
    # EQ25 repolho roxo
    ["repolho_roxo", "cores_por_pH", "red, pink, or magenta", "ácido: vermelho, rosa ou magenta"], ["repolho_roxo", "cores_por_pH", "purple", "neutro: roxo"],
    ["repolho_roxo", "cores_por_pH", "blue to green to yellow", "básico: de azul a verde a amarelo"], ["repolho_roxo", "halocromismo", "changes in pH", "a estrutura muda com o pH"],
    ["repolho_roxo", "cozinhar", "turn blue", "na panela fica azul; vinagre devolve a cor"], ["repolho_roxo", "pH_suco_de_limao", "2.2", "limão 2,2"], ["repolho_roxo", "pH_vinegar", "2–3", "vinagre 2 a 3"],
    ["repolho_roxo", "pH_orange_juice", "3.3–4.2", "laranja"], ["repolho_roxo", "pH_black_coffee", "5–5.03", "café"], ["repolho_roxo", "pH_milk", "6.5–6.8", "leite"],
    ["repolho_roxo", "pH_pure_water_at_25_c", "7", "água pura"], ["repolho_roxo", "pH_sea_water", "7.5–8.4", "água do mar"], ["repolho_roxo", "pH_ammonia", "11.0–11.5", "amônia"],
    ["repolho_roxo", "pH_bleach", "12.5", "água sanitária"], ["repolho_roxo", "pH_lye", "14", "soda cáustica"],
    # textos dos experimentos de reações e de eletroquímica
    ["catalise", None, "activation energy", "catalisador baixa a energia de ativação"], ["catalise", None, "not consumed", "catalisador não é consumido"],
    ["equilibrios_classicos", None, "brown", "NO2 castanho"], ["equilibrios_classicos", None, "colourless", "N2O4 incolor"],
    ["corrosao", None, "sacrificial", "ânodo de sacrifício"], ["corrosao", None, "oxygen", "ferrugem precisa de oxigênio"], ["corrosao", None, "zinc", "zinco protege o ferro"],
    ["eletrolise", None, "96485", "constante de Faraday"], ["eletrolise", None, "chlorine", "cloro no ânodo"], ["pilha_daniell", None, "salt bridge", "ponte salina"],
    #MAIS
]
falhas = 0
for sec, chave, pal, para in PEDIDOS:
    try: ok = (pal in texto(sec, chave)) if chave else any(pal in texto(sec, k) for k in D[sec])
    except KeyError: ok = False
    if not ok: falhas += 1
    print(("ok    " if ok else "FALHA ") + f"{sec}/{chave or '(qualquer chave)'}: \"{pal}\"  ({para})")
print(f"{len(PEDIDOS)} constantes conferidas; FALHAS ({falhas})")
sys.exit(1 if falhas else 0)
