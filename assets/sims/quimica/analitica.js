/* Química · módulo J (química analítica e de coordenação): tabelas geradas a partir de dados com fonte e laboratórios dos temas J01 a J04.
   As tabelas (SIM.ANA) são GERADAS por tools/quimica/gera-analitica.py a partir de tools/quimica/dadosJ.json (valor, fonte e trecho de cada dado). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const nt = (v, d = 1) => (SIM.vg ? SIM.vg(v, d) : String(v).replace(".", ","));
  /* íon escrito com índices e carga em sobrescrito: "SO4 2-" → SO₄²⁻ */
  const ion = (s) => { if (s === "NH4+") return "NH₄⁺"; if (s === "NO3-") return "NO₃⁻"; const [f, q] = s.includes(" ") ? s.split(" ") : [s.replace(/(\d*[+-])$/, ""), (s.match(/(\d*[+-])$/) || [""])[0]]; return f.replace(/(\d)/g, (c) => "₀₁₂₃₄₅₆₇₈₉"[+c]) + q.replace(/[0-9+-]/g, (c) => ({ "+": "⁺", "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴" }[c])); };
  const sci = (v) => { if (v === null || v === undefined) return "sem dado"; const e = Math.floor(Math.log10(v)), m = +(v / Math.pow(10, e)).toPrecision(3); return nt(m, 1) + "·10" + String(e).replace("-", "⁻").replace(/\d/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]); };
  SIM.ion = ion; SIM.sciU = sci;

  /*ANA-INI*/ /* GERADO por tools/quimica/gera-analitica.py a partir de tools/quimica/dadosJ.json: não editar à mão */
  SIM.ANA = {
    CHAMA: [
      {"el": "Li", "cor": "vermelho-carmim"},
      {"el": "Na", "cor": "amarelo intenso"},
      {"el": "K", "cor": "lilás"},
      {"el": "Rb", "cor": "vermelho-violeta"},
      {"el": "Cs", "cor": "azul-violeta"},
      {"el": "Ca", "cor": "vermelho-tijolo (alaranjado)"},
      {"el": "Sr", "cor": "vermelho-carmesim"},
      {"el": "Ba", "cor": "verde-maçã claro"},
      {"el": "Cu", "cor": "verde"},
      {"el": "B", "cor": "verde vivo"},
      {"el": "Pb", "cor": "branco-azulado"},
    ],
    SOL: {"Na+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "S", "OH-": "S", "S2-": "R", "NO3-": "S", "PO4 3-": "S"}, "K+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "S", "OH-": "S", "S2-": "R", "NO3-": "S", "PO4 3-": "S"}, "NH4+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "S", "OH-": "S", "S2-": "R", "NO3-": "S", "PO4 3-": "S"}, "Mg2+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "sS", "OH-": "I", "S2-": "R", "NO3-": "S", "PO4 3-": "I"}, "Ca2+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "sS", "CO3 2-": "I", "OH-": "sS", "S2-": "R", "NO3-": "S", "PO4 3-": "I"}, "Ba2+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "I", "CO3 2-": "I", "OH-": "S", "S2-": "R", "NO3-": "S", "PO4 3-": "I"}, "Al3+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "R", "OH-": "I", "S2-": "R", "NO3-": "S", "PO4 3-": "I"}, "Fe2+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "I", "OH-": "I", "S2-": "I", "NO3-": "S", "PO4 3-": "I"}, "Fe3+": {"Cl-": "S", "Br-": "S", "I-": "R", "SO4 2-": "S", "CO3 2-": "R", "OH-": "I", "S2-": "I", "NO3-": "S", "PO4 3-": "sS"}, "Cu2+": {"Cl-": "S", "Br-": "S", "I-": "?", "SO4 2-": "S", "CO3 2-": "I", "OH-": "I", "S2-": "I", "NO3-": "S", "PO4 3-": "I"}, "Zn2+": {"Cl-": "S", "Br-": "S", "I-": "S", "SO4 2-": "S", "CO3 2-": "I", "OH-": "I", "S2-": "I", "NO3-": "S", "PO4 3-": "I"}, "Ag+": {"Cl-": "I", "Br-": "I", "I-": "I", "SO4 2-": "sS", "CO3 2-": "I", "OH-": "I", "S2-": "I", "NO3-": "S", "PO4 3-": "I"}, "Pb2+": {"Cl-": "sS", "Br-": "sS", "I-": "sS", "SO4 2-": "I", "CO3 2-": "I", "OH-": "sS", "S2-": "I", "NO3-": "S", "PO4 3-": "I"}},
    PREC: [
      {"f": "AgCl", "c": "Ag+", "a": "Cl-", "cor": "branco", "kps": 1.6e-10},
      {"f": "AgBr", "c": "Ag+", "a": "Br-", "cor": "amarelo-claro", "kps": 5e-13},
      {"f": "AgI", "c": "Ag+", "a": "I-", "cor": "amarelo", "kps": 1.5e-16},
      {"f": "PbCl2", "c": "Pb2+", "a": "Cl-", "cor": "branco", "kps": 1.6e-05},
      {"f": "PbI2", "c": "Pb2+", "a": "I-", "cor": "amarelo vivo", "kps": 1.4e-08},
      {"f": "PbSO4", "c": "Pb2+", "a": "SO4 2-", "cor": "branco", "kps": 1.3e-08},
      {"f": "BaSO4", "c": "Ba2+", "a": "SO4 2-", "cor": "branco", "kps": 2.3e-08},
      {"f": "CaCO3", "c": "Ca2+", "a": "CO3 2-", "cor": "branco", "kps": 8.7e-09},
      {"f": "Fe(OH)3", "c": "Fe3+", "a": "OH-", "cor": "castanho-avermelhado", "kps": 4e-38},
      {"f": "Fe(OH)2", "c": "Fe2+", "a": "OH-", "cor": "esverdeado", "kps": 1.8e-15},
      {"f": "Cu(OH)2", "c": "Cu2+", "a": "OH-", "cor": "azul", "kps": 2.2e-20},
      {"f": "Al(OH)3", "c": "Al3+", "a": "OH-", "cor": "branco", "kps": 2e-32},
      {"f": "Zn(OH)2", "c": "Zn2+", "a": "OH-", "cor": "branco", "kps": 1.8e-14},
      {"f": "Mg(OH)2", "c": "Mg2+", "a": "OH-", "cor": "branco", "kps": 8.9e-12},
      {"f": "CuS", "c": "Cu2+", "a": "S2-", "cor": "preto", "kps": 8.5e-45},
      {"f": "PbS", "c": "Pb2+", "a": "S2-", "cor": "preto", "kps": 7e-29},
      {"f": "Ag2S", "c": "Ag+", "a": "S2-", "cor": "preto-acinzentado", "kps": 1.6e-49},
      {"f": "PbCrO4", "c": "Pb2+", "a": null, "cor": "amarelo vivo", "kps": 2e-16},
      {"f": "BaCrO4", "c": "Ba2+", "a": null, "cor": "amarelo", "kps": 8.5e-11},
      {"f": "Ag2CrO4", "c": "Ag+", "a": null, "cor": "vermelho-tijolo", "kps": 9e-12},
      {"f": "CdS", "c": null, "a": null, "cor": "amarelo-alaranjado", "kps": 1e-28},
    ],
    GRUPOS: [
      {"n": 1, "oq": "cloretos insolúveis", "reag": "HCl diluído", "cats": ["Ag+", "Hg2 2+", "Pb2+"]},
      {"n": 2, "oq": "sulfetos insolúveis em meio ácido", "reag": "H₂S em meio ácido", "cats": ["Cu2+", "Cd2+", "Bi3+", "Hg2+", "Sn2+", "As3+", "Sb3+"]},
      {"n": 3, "oq": "hidróxidos insolúveis", "reag": "NH₃ com NH₄Cl", "cats": ["Fe2+", "Fe3+", "Al3+", "Cr3+"]},
      {"n": 4, "oq": "sulfetos que precipitam em pH 9", "reag": "H₂S em meio amoniacal (pH 9)", "cats": ["Zn2+", "Ni2+", "Co2+", "Mn2+"]},
      {"n": 5, "oq": "carbonatos insolúveis", "reag": "(NH₄)₂CO₃", "cats": ["Ba2+", "Ca2+", "Sr2+"]},
      {"n": 6, "oq": "ficam em solução", "reag": "nenhum (teste de chama)", "cats": ["Mg2+", "Li+", "Na+", "K+"]},
    ],
  };
  /*ANA-FIM*/

  /* ---------- J01: análise qualitativa ---------- */
  /* carga e fórmula-base de um íon escrito como "Fe3+", "SO4 2-", "NH4+", "Cl-" */
  const partes = (s) => { if (s === "NH4+") return { f: "NH4", q: 1, poli: true }; if (s === "NO3-") return { f: "NO3", q: -1, poli: true }; const sp = s.includes(" "), f = sp ? s.split(" ")[0] : s.replace(/(\d?[+-])$/, ""), c = sp ? s.split(" ")[1] : (s.match(/(\d?[+-])$/) || [""])[0], n = parseInt(c, 10) || 1; return { f, q: c.endsWith("-") ? -n : n, poli: /[A-Z].*[A-Z]|\d/.test(f) && f !== "OH" ? true : f === "OH" }; };
  /* fórmula do sal neutro formado por um cátion e um ânion (cargas cruzadas e simplificadas) */
  SIM.salF = (c, a) => { const C = partes(c), A = partes(a), mdc = (x, y) => (y ? mdc(y, x % y) : x), g = mdc(C.q, -A.q), nc = -A.q / g, na = C.q / g, sb = (f) => f.replace(/(\d)/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[+d]), un = (p, n) => (n === 1 ? sb(p.f) : p.poli ? "(" + sb(p.f) + ")" + "₀₁₂₃₄₅₆₇₈₉"[n] : sb(p.f) + "₀₁₂₃₄₅₆₇₈₉"[n]); return { f: un(C, nc) + un(A, na), nc, na }; };
  /* o que a tabela de solubilidade diz do par, e o precipitado (cor e Kps) quando ele está na tabela PREC */
  SIM.precip = (c, a) => { const cod = SIM.ANA.SOL[c][a], P = SIM.ANA.PREC.find((x) => x.c === c && x.a === a) || null, s = SIM.salF(c, a); return { c, a, cod, f: s.f, nc: s.nc, na: s.na, forma: cod === "I", pouco: cod === "sS", reage: cod === "R", semdado: cod === "?", cor: P ? P.cor : null, kps: P ? P.kps : null }; };
  const CODT = { S: "solúvel (20 g/L ou mais)", sS: "pouco solúvel (0,1 a 20 g/L)", I: "insolúvel (menos de 0,1 g/L)", R: "reage com a água", "?": "sem dado na tabela" };
  /* nome: "Precipita ou não? Misturando duas soluções" · matéria: Química · tema: J01 */
  SIM.qPrecipita = (el, F) => { const CAT = Object.keys(SIM.ANA.SOL), AN = Object.keys(SIM.ANA.SOL[CAT[0]]); let c = "Ag+", a = "Cl-", ver = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:flex;justify-content:center;padding:12px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">cátion (na forma de nitrato, solúvel)</p><div class="bts">${botoes(CAT.map((k) => [k, ion(k)]), "c", c)}</div></div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">ânion (na forma de sal de sódio, solúvel)</p><div class="bts">${botoes(AN.map((k) => [k, ion(k)]), "a", a)}</div></div>
      <div><div class="bts"><button class="bt peq" data-v="ver" aria-pressed="false">misturar e ver</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => ({ ...SIM.precip(c, a), ver });
    const COR = { branco: "#e8e8e8", "amarelo-claro": "#efe7a8", amarelo: "#e8d44a", "amarelo vivo": "#f2d21f", "castanho-avermelhado": "#9a4a2a", esverdeado: "#7fae8a", azul: "#3f8fd6", preto: "#22262e", "preto-acinzentado": "#3a3f48" };
    const desenha = () => { const e = est(), W = 520, tubo = (x, liq, pp, rot) => `<path d="M${x},20 v96 a26,26 0 0 0 52,0 v-96" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="M${x + 2},46 v70 a24,24 0 0 0 48,0 v-70 z" style="fill:${liq};opacity:.35"/>${pp ? `<path d="M${x + 2},112 v4 a24,24 0 0 0 48,0 v-4 z" style="fill:${pp};stroke:var(--ink2);stroke-width:.6"/>` : ""}<text x="${x + 26}" y="164" text-anchor="middle" class="tx2" style="font-size:12px">${rot}</text>`;
      const pp = ver && (e.forma || (e.pouco && e.cor)) ? COR[e.cor] || "#9aa3ad" : null;
      q("[data-v=sv]").innerHTML = `<svg viewBox="0 0 ${W} 174" width="${W}" role="img" aria-label="mistura de duas soluções">${tubo(60, "#6fa8dc", null, ion(c) + " (aq)")}<text x="150" y="86" text-anchor="middle" style="font:700 20px Inter,system-ui,sans-serif;fill:var(--ink)">+</text>${tubo(190, "#6fa8dc", null, ion(a) + " (aq)")}<line x1="270" y1="80" x2="330" y2="80" style="stroke:var(--ink);stroke-width:2"/><polygon points="338,80 328,75 328,85" style="fill:var(--ink)"/>${ver ? tubo(380, "#6fa8dc", pp, pp ? "precipitado" : "sem precipitado") : `<text x="406" y="92" text-anchor="middle" style="font:700 30px Inter,system-ui,sans-serif;fill:var(--warn)">?</text>`}</svg>`;
      q("[data-v=lt]").innerHTML = vis("composto possível", e.f) + vis("na tabela de solubilidade", ver ? CODT[e.cod] : "?") + vis("forma precipitado?", ver ? (e.forma ? "sim" : e.pouco ? "se não estiver muito diluído" : e.reage || e.semdado ? "caso especial" : "não") : "?") + vis("cor do precipitado", ver ? (e.forma || e.pouco ? e.cor || "sem dado" : "—") : "?") + vis("Kps (25 °C)", ver ? (e.kps ? sci(e.kps) : e.forma ? "sem dado" : "—") : "?");
      q("[data-v=st]").innerHTML = !ver ? "Antes de clicar: pelas regras de solubilidade, o composto formado pelo cátion e pelo ânion escolhidos é solúvel?" :
        (e.forma ? `Forma-se <b>${e.f}</b>, insolúvel${e.cor ? ", " + e.cor : ""}. Equação iônica: ${e.nc > 1 ? e.nc + " " : ""}${ion(c)}(aq) + ${e.na > 1 ? e.na + " " : ""}${ion(a)}(aq) → ${e.f}(s). Os outros íons (Na⁺ e NO₃⁻) só assistem.` : e.pouco ? `<b>${e.f}</b> é pouco solúvel (entre 0,1 e 20 g/L): precipita se as soluções não forem muito diluídas${e.cor ? "; o sólido é " + e.cor + ", um precipitado clássico" : ""}.` : e.reage ? `<b>${e.f}</b> não se obtém em água: o composto reage com ela (hidrólise).` : e.semdado ? `A tabela da fonte não traz dado para <b>${e.f}</b>.` : `<b>${e.f}</b> é solúvel: os íons continuam livres e nada precipita.`) + ` Solubilidade: tabela da Wikipedia ("Solubility chart"). Cor e Kps: dados de fonte (Kps do OpenStax; outras tabelas dão valores diferentes).`; };
    liga(el, "c", (v) => { c = v; ver = false; q("[data-v=ver]").setAttribute("aria-pressed", "false"); desenha(); }); liga(el, "a", (v) => { a = v; ver = false; q("[data-v=ver]").setAttribute("aria-pressed", "false"); desenha(); });
    q("[data-v=ver]").addEventListener("click", () => { ver = !ver; q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); });
    SIM.qPrecipita._ult = { poe: (cc, aa, v = true) => { c = cc; a = aa; ver = v; [["c", c], ["a", a]].forEach(([k, x]) => el.querySelectorAll(`[data-${k}]`).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset[k] === x)))); q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); }, est }; desenha(); };

  //MAIS-LABS
})();
