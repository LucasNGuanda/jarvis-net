/* Russo · como ler um enunciado (RL06): laboratórios.
   Dados: SIM.RU.VEN (20 verbos de pedido e de descrição, com as tabelas do Wiktionary em inglês, no mesmo formato de SIM.RU.VERB), SIM.RU.EST
   (13 palavras de estrutura: verbetes) e SIM.RU.ENUN (18 frases com cara de enunciado: Tatoeba e exemplos de verbetes).
   Medida: a regra do imperativo do RG17 (SIM.ruImperativoRegra), que foi ajustada olhando os verbos do banco, aplicada a verbos que ela nunca viu
   (SIM.ruPlacarImp(lista)): é um teste de generalização, calculado na hora. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const emb = (lista, r) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const AC = "́", sem = (s) => String(s).split(AC).join(""), GRANDE = "font:700 44px/1.15 Inter,system-ui,sans-serif;letter-spacing:.5px";
  SIM.ruPedidos = () => Object.keys(SIM.RU.VEN).filter((w) => SIM.RU.VEN[w].grp === "pedido" && SIM.RU.VEN[w].imp[1].length);
  SIM.ruVenLista = () => Object.keys(SIM.RU.VEN).filter((w) => SIM.RU.VEN[w].imp[0].length && SIM.ruImperativoRegra(w));
  /* textos do leitor e lista de treino (no formato do vocabulário) */
  SIM.ruTextosEnun = () => SIM.RU.ENUN.map((x) => ({ id: "en:" + x.id + x.ru.slice(0, 6), tit: x.ru, ru: [x.ru], pt: [x.pt], en: [x.en], cred: x.lic === "verbete" ? "exemplo de verbete do Wiktionary em inglês; tradução para o português do site" : `Tatoeba, frase ${x.id}, de ${x.autor} (${x.lic}); tradução para o português do site` }));
  SIM.ruListaEnun = () => Object.entries(SIM.RU.VEN).map(([w, v]) => ({ w, ac: v.ac, pt: v.pt, grp: v.grp === "pedido" ? "verbos de pedido" : "verbos de descrição", cl: "v", en: v.tit || "" })).concat(SIM.RU.EST.map((x) => ({ w: x.w, ac: x.ac, pt: x.pt, grp: "palavras de estrutura", cl: "e", en: x.en, papel: x.papel })));

  /* nome: "O que o enunciado pede? Leia o imperativo" · matéria: Russo · tema: RL06 */
  SIM.ruOQuePede = (el, F) => { let r = rng(1), fila = [], x = null, clic = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts" data-v="ops"></div><div class="bts"><button class="bt peq" data-v="prox">outro</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), V = () => SIM.RU.VEN;
    const prox = () => { if (!fila.length) fila = emb(SIM.ruPedidos(), r); const w = fila.pop(), v = V()[w]; x = { w, forma: v.imp[1][0], pt: v.pt, ops: emb([v.pt].concat(emb([...new Set(SIM.ruPedidos().filter((y) => V()[y].pt !== v.pt).map((y) => V()[y].pt))], r).slice(0, 3)), r) }; clic = null; desenha(); };
    const clica = (o) => { if (clic !== null) return; clic = o; feitos++; if (o === x.pt) certos++; desenha(); };
    const est = () => ({ ...x, clic, certos, feitos });
    const desenha = () => { const v = V()[x.w]; q("[data-v=ops]").innerHTML = x.ops.map((o, i) => `<button class="bt peq" data-o="${i}" style="font-size:15px;border-color:${clic === null ? "" : o === x.pt ? "var(--ok)" : o === clic ? "var(--bad, #e06666)" : ""}">${o}</button>`).join(""); q("[data-v=ops]").querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => clica(x.ops[+b.dataset.o])));
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${x.forma}</div><div style="font-size:14px;color:var(--ink2);margin-top:8px">${clic === null ? "imperativo, forma de «вы»" : `de ${v.ac} (${v.pt}), ${v.asp === "pf" ? "perfectivo" : "imperfectivo"}${v.par ? "; par de aspecto: " + v.par : ""}`}</div>`;
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : clic === x.pt ? "certo" : "ainda não") + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = clic === null ? "A terminação -те diz que é uma instrução para «вы». Tire-a e a terminação do imperativo para chegar ao verbo." : `<b>${x.forma}</b>: "${x.pt}" (pedido a vocês). Forma e sentido: verbete de ${sem(v.ac)} no Wiktionary em inglês.`; };
    q("[data-v=prox]").addEventListener("click", prox); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => x.forma);
    SIM.ruOQuePede._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, clica, prox, est }; prox(); };

  /* nome: "Escreva o pedido: imperativo para «вы»" · matéria: Russo · tema: RL06 */
  SIM.ruEscreveImp = (el, F) => { let r = rng(1), fila = [], x = null, res = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="prox">outro verbo</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir (depois de conferir)</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div>
      <div style="display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap"><input type="text" data-v="inp" lang="ru" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="escreva o imperativo em cirílico" style="font:600 24px Inter,system-ui,sans-serif;padding:6px 10px;min-width:300px;background:var(--card2);color:var(--ink);border:1.5px solid var(--line);border-radius:9px"><button class="bt peq" data-v="conf">conferir</button></div>
      <div style="display:flex;justify-content:center">${F.tecladoRu()}</div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), inp = q("[data-v=inp]"), V = () => SIM.RU.VEN;
    const prox = () => { if (!fila.length) fila = emb(SIM.ruPedidos(), r); x = { w: fila.pop() }; res = null; inp.value = ""; desenha(); };
    const resp = () => V()[x.w].imp[1], confere = () => { const v = F.normTxt(inp.value); if (!v) return; res = resp().map((p) => F.normTxt(p)).includes(v); feitos++; if (res) certos++; desenha(); };
    const est = () => ({ ...x, resp: resp(), res, certos, feitos });
    const desenha = () => { const v = V()[x.w], rg = SIM.ruImperativoRegra(x.w); q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${v.ac}</div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${v.pt} · eles: <b>${v.pres[5][0]}</b> · eu: <b>${v.pres[0][0]}</b> · escreva o imperativo para <b>вы</b></div>`; inp.style.borderColor = res === null ? "var(--line)" : res ? "var(--ok)" : "var(--bad, #e06666)";
      q("[data-v=lt]").innerHTML = vis("resultado", res === null ? "?" : res ? "certo" : "ainda não") + vis("forma do dicionário", res === null ? "?" : resp().join(" ou ")) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = res === null ? "Radical de «eles», terminação -й, -и ou -ь, e depois -те. O acento não precisa ser digitado." : `${resp().join(" ou ")}. Pela regra: radical ${rg.st}-; ${rg.txt}; a regra daria ${rg.pl}${SIM.ruImpBate(x.w) ? "" : " (aqui ela erra)"}.`; };
    q("[data-v=prox]").addEventListener("click", prox); q("[data-v=conf]").addEventListener("click", confere); inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); confere(); } }); F.ligaTecladoRu(el, inp); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => (res === null ? "" : resp()[0]));
    SIM.ruEscreveImp._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, digita: (s) => { inp.value = s; }, confere, prox, est }; prox(); };
})();
