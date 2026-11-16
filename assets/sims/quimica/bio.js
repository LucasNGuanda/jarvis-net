/* Química · módulo I (bioquímica e ambiental): tabelas geradas a partir de dados com fonte e laboratórios dos temas I01 a I09.
   As tabelas (SIM.BIO) são GERADAS por tools/quimica/gera-bio.py a partir de tools/quimica/dadosI.json (valor, fonte e trecho de cada dado).
   Os desenhos de estruturas usam o núcleo de orgânica (SIM.org, assets/sims/quimica/organica.js), que tem de ser carregado antes. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const seletor = (rot, itens) => `<label style="font-size:13.5px;color:var(--ink2)">${rot} <select data-v="sel" style="font:inherit;padding:5px 8px;border-radius:8px;background:var(--card,#161b24);color:inherit;border:1px solid var(--line,#2a3140);max-width:440px">${itens.map((n, k) => `<option value="${k}">${n}</option>`).join("")}</select></label>`;
  const nt = (v, d = 1) => (SIM.vg ? SIM.vg(v, d) : String(v).replace(".", ","));
  const faixa = (v, un, d = 2) => (v === null || v === undefined ? "sem dado" : Array.isArray(v) ? `${nt(v[0], d)} a ${nt(v[1], d)} ${un}` : `${nt(v, d)} ${un}`);

  /*BIO-INI*/ /* GERADO por tools/quimica/gera-bio.py a partir de tools/quimica/dadosI.json: não editar à mão */
  SIM.BIO = {
    POL: [
      {"k": "polietileno", "nome": "polietileno", "sig": "PE", "tipo": "adição", "mon": [["eteno (etileno)", "C=C"]], "un": "–CH₂–CH₂–", "fu": "C2H4", "mu": 28, "aguas": 0, "fun": "só C e H", "d": [0.88, 0.96], "pf": [115, 135], "cod": null},
      {"k": "polipropileno", "nome": "polipropileno", "sig": "PP", "tipo": "adição", "mon": [["propeno (propileno)", "C=CC"]], "un": "–CH₂–CH(CH₃)–", "fu": "C3H6", "mu": 42, "aguas": 0, "fun": "só C e H", "d": 0.855, "pf": [130, 171], "cod": 5},
      {"k": "PVC", "nome": "poli(cloreto de vinila)", "sig": "PVC", "tipo": "adição", "mon": [["cloroeteno (cloreto de vinila)", "C=CCl"]], "un": "–CH₂–CHCl–", "fu": "C2H3Cl", "mu": 62.5, "aguas": 0, "fun": "haleto", "d": 1.4, "pf": 100, "cod": 3},
      {"k": "poliestireno", "nome": "poliestireno", "sig": "PS", "tipo": "adição", "mon": [["vinilbenzeno (estireno)", "C=Cc1ccccc1"]], "un": "–CH₂–CH(C₆H₅)–", "fu": "C8H8", "mu": 104, "aguas": 0, "fun": "anel aromático", "d": [0.96, 1.05], "pf": 240, "cod": 6},
      {"k": "PTFE", "nome": "politetrafluoroetileno (teflon)", "sig": "PTFE", "tipo": "adição", "mon": [["tetrafluoroeteno", "FC(F)=C(F)F"]], "un": "–CF₂–CF₂–", "fu": "C2F4", "mu": 100, "aguas": 0, "fun": "haleto", "d": 2.2, "pf": 327, "cod": null},
      {"k": "poliacrilonitrila", "nome": "poliacrilonitrila", "sig": "PAN", "tipo": "adição", "mon": [["propenonitrila (acrilonitrila)", "C=CC#N"]], "un": "–CH₂–CH(CN)–", "fu": "C3H3N", "mu": 53, "aguas": 0, "fun": "nitrila", "d": 1.184, "pf": 300, "cod": null},
      {"k": "PMMA", "nome": "poli(metacrilato de metila) (acrílico)", "sig": "PMMA", "tipo": "adição", "mon": [["2-metilpropenoato de metila", "C=C(C)C(=O)OC"]], "un": "–CH₂–C(CH₃)(COOCH₃)–", "fu": "C5H8O2", "mu": 100, "aguas": 0, "fun": "éster (no ramo)", "d": 1.18, "pf": null, "cod": null},
      {"k": "borracha_natural", "nome": "borracha natural (poli-isopreno)", "sig": "NR", "tipo": "adição", "mon": [["2-metilbuta-1,3-dieno (isopreno)", "C=CC(C)=C"]], "un": "–CH₂–C(CH₃)=CH–CH₂–", "fu": "C5H8", "mu": 68, "aguas": 0, "fun": "dupla C=C", "d": null, "pf": null, "cod": null},
      {"k": "neopreno", "nome": "neopreno (policloropreno)", "sig": "CR", "tipo": "adição", "mon": [["2-clorobuta-1,3-dieno (cloropreno)", "C=CC(Cl)=C"]], "un": "–CH₂–CCl=CH–CH₂–", "fu": "C4H5Cl", "mu": 88.5, "aguas": 0, "fun": "dupla C=C e haleto", "d": 1.23, "pf": null, "cod": null},
      {"k": "PET", "nome": "poli(tereftalato de etileno)", "sig": "PET", "tipo": "condensação", "mon": [["ácido benzeno-1,4-dicarboxílico (tereftálico)", "OC(=O)c1ccc(cc1)C(=O)O"], ["etano-1,2-diol (etilenoglicol)", "OCCO"]], "un": "–O–CH₂–CH₂–O–CO–C₆H₄–CO–", "fu": "C10H8O4", "mu": 192, "aguas": 2, "fun": "éster", "d": 1.38, "pf": 250, "cod": 1},
      {"k": "nylon_66", "nome": "náilon 6,6", "sig": "PA 66", "tipo": "condensação", "mon": [["ácido hexanodioico (adípico)", "OC(=O)CCCCC(=O)O"], ["hexano-1,6-diamina", "NCCCCCCN"]], "un": "–NH–(CH₂)₆–NH–CO–(CH₂)₄–CO–", "fu": "C12H22N2O2", "mu": 226, "aguas": 2, "fun": "amida", "d": 1.14, "pf": 264, "cod": null},
      {"k": "kevlar", "nome": "kevlar", "sig": "aramida", "tipo": "condensação", "mon": [["ácido benzeno-1,4-dicarboxílico (tereftálico)", "OC(=O)c1ccc(cc1)C(=O)O"], ["benzeno-1,4-diamina", "Nc1ccc(N)cc1"]], "un": "–CO–C₆H₄–CO–NH–C₆H₄–NH–", "fu": "C14H10N2O2", "mu": 238, "aguas": 2, "fun": "amida", "d": null, "pf": null, "cod": null},
      {"k": "PLA", "nome": "poli(ácido láctico)", "sig": "PLA", "tipo": "condensação", "mon": [["ácido 2-hidroxipropanoico (láctico)", "CC(O)C(=O)O"]], "un": "–O–CH(CH₃)–CO–", "fu": "C3H4O2", "mu": 72, "aguas": 1, "fun": "éster", "d": [1.21, 1.43], "pf": [150, 160], "cod": null},
    ],
    COD: {"1": "PET", "2": "PEAD (polietileno de alta densidade)", "3": "PVC", "4": "PEBD (polietileno de baixa densidade)", "5": "PP", "6": "PS", "7": "outros"},
  };
  /*BIO-FIM*/

  /* ---------- I01: polímeros ---------- */
  /* nome: "Polímeros: do monômero à cadeia" · matéria: Química · tema: I01 */
  SIM.qPolimero = (el, F) => { const P = SIM.BIO.POL, O = SIM.org; let i = 0, n = 1000, ver = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px;min-height:230px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${seletor("monômero(s) de", P.map((p) => p.sig + " · " + p.mon.map((m) => m[0]).join(" + ")))}</div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">unidades na cadeia (n)</p><div class="bts">${botoes([[10, "10"], [100, "100"], [1000, "1 000"], [10000, "10 000"]], "n", n)}</div></div>
      <div><div class="bts"><button class="bt peq" data-v="ver" aria-pressed="false">mostrar o polímero</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const p = P[i]; return { k: p.k, tipo: p.tipo, mu: p.mu, n, massa: n * p.mu, aguas: p.aguas * n, fu: p.fu, d: p.d, cod: p.cod, ver }; };
    const desenha = () => { const p = P[i], e = est(), boia = p.d === null ? null : (Array.isArray(p.d) ? p.d[1] : p.d) < 1 ? "boia" : (Array.isArray(p.d) ? p.d[0] : p.d) > 1 ? "afunda" : "depende do tipo";
      q("[data-v=sv]").innerHTML = O.fig(p.mon.map((m) => ({ smi: m[1], leg: m[0] })), { L: 38, W: 720 }) + (ver ? `<div style="font:700 22px Inter,system-ui,sans-serif;letter-spacing:.5px;margin-top:4px"><span style="color:var(--ink2)">[</span> ${p.un} <span style="color:var(--ink2)">]</span><sub style="font-size:14px">n</sub></div><div style="font-size:12.5px;color:var(--ink2)">${p.nome} · unidade repetitiva ${p.fu.replace(/(\d+)/g, "<sub>$1</sub>")}</div>` : `<div style="font:700 26px Inter,system-ui,sans-serif;color:var(--warn)">?</div>`);
      q("[data-v=lt]").innerHTML = vis("polimerização por", ver ? p.tipo : "?") + vis("massa da unidade", ver ? nt(p.mu, 1) + " g/mol" : "?") + vis("massa molar da cadeia", ver ? nt(e.massa, 0) + " g/mol" : "?") + vis("água liberada", ver ? (p.aguas ? nt(e.aguas, 0) + " moléculas" : "nenhuma") : "?") + vis("densidade (fonte)", faixa(p.d, "g/cm³")) + vis("código de reciclagem", p.cod ? String(p.cod) : p.k === "polietileno" ? "2 (alta) ou 4 (baixa)" : "7 ou sem código");
      q("[data-v=st]").innerHTML = !ver ? "Antes de clicar em <b>mostrar</b>: o monômero tem dupla C=C (adição) ou dois grupos funcionais que reagem entre si (condensação)? Como fica a unidade que se repete?" :
        (p.tipo === "adição" ? `<b>Adição</b>: a ligação π de cada monômero se abre e os monômeros se ligam em fila. Nada sobra: a unidade repetitiva tem a mesma fórmula do monômero (${p.fu.replace(/(\d+)/g, "<sub>$1</sub>")}).` : `<b>Condensação</b>: os grupos funcionais reagem dois a dois e cada ligação nova libera uma molécula de água (${p.aguas} por unidade repetitiva). A cadeia fica com a função <b>${p.fun}</b>.`) + ` Com n = ${nt(n, 0)}, a cadeia pesa cerca de ${nt(e.massa, 0)} g/mol.` + (boia ? ` Na água (1,00 g/cm³), ${boia}.` : "") + " Densidade: dado de tabela (varia com o tipo do material)."; };
    q("[data-v=sel]").addEventListener("change", (ev) => { i = +ev.target.value; ver = false; q("[data-v=ver]").setAttribute("aria-pressed", "false"); desenha(); });
    q("[data-v=ver]").addEventListener("click", () => { ver = !ver; q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); desenha(); });
    liga(el, "n", (v) => { n = +v; desenha(); });
    SIM.qPolimero._ult = { poe: (k, nn = 1000, v = true) => { i = P.findIndex((p) => p.k === k); n = nn; ver = v; q("[data-v=sel]").value = String(i); q("[data-v=ver]").setAttribute("aria-pressed", String(ver)); el.querySelectorAll("[data-n]").forEach((x) => x.setAttribute("aria-pressed", String(+x.dataset.n === n))); desenha(); }, est }; desenha(); };

  //MAIS-LABS
})();
