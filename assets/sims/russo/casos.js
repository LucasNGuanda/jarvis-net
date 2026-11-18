/* Russo · laboratórios dos temas de casos (RG04 em diante).
   Dados: SIM.RU.DECL, PRON, VERB e FRASES (assets/sims/russo/dados.js, GERADO a partir de tools/russo/dadosR4.json: tabelas do Wiktionary em inglês).
   A REGRA do acusativo programada aqui (SIM.ruAcusativoRegra) resume "Russian grammar", "Russian declension", "Accusative case" e "Animacy"
   (Wikipedia em inglês) e é MEDIDA contra as tabelas do dicionário (SIM.ruPlacarCaso): o placar da tela é calculado na hora. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const emb = (lista, r) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const AC = "́", sem = (s) => String(s).split(AC).join(""), GRANDE = "font:700 50px/1.1 Inter,system-ui,sans-serif;letter-spacing:1.5px";
  const NOME = { nom: "nominativo", acc: "acusativo", gen: "genitivo", dat: "dativo", ins: "instrumental", prep: "preposicional" };
  SIM.ruNomeCaso = NOME;
  /* acusativo pela regra. num: 0 singular, 1 plural. Devolve { formas (da tabela, do caso a que a regra manda igualar) ou construída, motivo } */
  SIM.ruAcusativoRegra = (w, num) => { const d = SIM.RU.DECL[w], c = d.casos, p = sem(w);
    if (num === 1) return d.an === "anim" ? { formas: c.gen[1], igual: "gen", motivo: "plural de substantivo animado: igual ao genitivo plural" } : { formas: c.nom[1], igual: "nom", motivo: "plural de substantivo inanimado: igual ao nominativo plural" };
    if (!p.endsWith("мя") && /[ая]$/.test(p)) return { formas: [p.slice(0, -1) + (p.endsWith("а") ? "у" : "ю")], igual: null, motivo: "singular em -" + p.slice(-1) + ": troca por -" + (p.endsWith("а") ? "у" : "ю") };
    if (d.g === "m" && d.an === "anim") return { formas: c.gen[0], igual: "gen", motivo: "masculino animado: igual ao genitivo singular" };
    return { formas: c.nom[0], igual: "nom", motivo: (d.g === "n" ? "neutro" : d.g === "f" ? "feminino em -ь" : "masculino inanimado") + ": igual ao nominativo" }; };
  const itens = () => { const o = []; Object.entries(SIM.RU.DECL).forEach(([w, d]) => { if (!d.soPl && d.casos.acc[0].length) o.push({ w, num: 0 }); if (d.casos.acc[1].length) o.push({ w, num: 1 }); }); return o; };
  SIM.ruBate = (prev, dic) => prev.some((x) => dic.map(sem).includes(sem(x)));
  SIM.ruPlacarCaso = () => { let n = 0, ok = 0; const erradas = []; itens().forEach(({ w, num }) => { n++; const r = SIM.ruAcusativoRegra(w, num); if (SIM.ruBate(r.formas, SIM.RU.DECL[w].casos.acc[num])) ok++; else erradas.push(w + (num ? " (plural)" : "")); }); return { n, ok, erradas }; };

  /* nome: "Quem faz e quem recebe? Clique na palavra" · matéria: Russo · tema: RG04 */
  SIM.ruQuemFaz = (el, F) => { const L = SIM.RU.FRASES; let k = 0, alvo = "suj", clic = null, certos = 0, feitos = 0, r = rng(1), fila = [];
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="prox">outra frase</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), limpa = (t) => t.replace(/[.,!?]/g, "");
    const pares = () => { const o = []; L.forEach((f, i) => { if (f.suj) o.push([i, "suj"]); if (f.obj) o.push([i, "obj"]); }); return o; };
    const prox = () => { if (!fila.length) fila = emb(pares(), r); [k, alvo] = fila.pop(); clic = null; desenha(); };
    const certa = () => L[k][alvo], clica = (t) => { if (clic !== null) return; clic = t; feitos++; if (limpa(t) === certa()) certos++; desenha(); };
    const est = () => ({ ...L[k], alvo, certa: certa(), clic, certos, feitos, palavras: L[k].ru.split(" ").map(limpa) });
    const desenha = () => { const f = L[k], c = certa();
      q("[data-v=pal]").innerHTML = `<div style="font-size:14px;color:var(--ink2);margin-bottom:10px">clique ${alvo === "suj" ? "no <b>sujeito</b> (quem faz: nominativo)" : "no <b>objeto direto</b> (quem recebe a ação: acusativo)"}</div><div style="${GRANDE}">${f.ru.split(" ").map((t) => `<button type="button" data-t="${t}" style="font:inherit;letter-spacing:0;padding:0 4px;margin:0 3px;border-radius:8px;cursor:pointer;background:transparent;border:2px dashed ${clic === null ? "var(--line)" : "transparent"};color:${clic === null ? "var(--ink)" : limpa(t) === c ? "var(--ok)" : t === clic ? "var(--bad, #e06666)" : "var(--ink)"}">${t}</button>`).join("")}</div>`;
      q("[data-v=pal]").querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.t)));
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : limpa(clic) === c ? "certo" : "ainda não") + vis("tradução", clic === null ? "?" : f.pt) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = clic === null ? "A ordem das palavras não decide: em russo, quem diz quem é o sujeito e quem é o objeto é a forma da palavra." : `${alvo === "suj" ? "Sujeito" : "Objeto direto"}: <b>${c}</b>${f.suj && f.obj ? ` (sujeito ${f.suj}, objeto ${f.obj})` : ""}. Frase de exemplo do verbete "${f.de}" do Wiktionary em inglês; tradução para o português feita a partir da tradução em inglês da fonte (<i>${f.en}</i>).`; };
    q("[data-v=prox]").addEventListener("click", prox); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => L[k].ru);
    SIM.ruQuemFaz._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, clica, prox, est }; prox(); };

  /* nome: "A regra do acusativo contra o dicionário" · matéria: Russo · tema: RG04 */
  SIM.ruAcusativoLab = (el, F) => { const L = itens(); let k = Math.max(0, L.findIndex((x) => x.w === "брат" && x.num === 0)), ver = false, r = rng(1);
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="ant">anterior</button><button class="bt peq" data-v="prox">próxima</button><button class="bt peq" data-v="sort">sortear</button><button class="bt peq" data-v="ver" aria-pressed="false">comparar com o dicionário</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => { const x = L[k], d = SIM.RU.DECL[x.w], regra = SIM.ruAcusativoRegra(x.w, x.num), dic = d.casos.acc[x.num]; return { ...x, ac: d.casos.nom[x.num][0], pt: d.pt, genPt: d.genPt, regra, dic, bate: SIM.ruBate(regra.formas, dic), ver, total: L.length, k, placar: SIM.ruPlacarCaso() }; };
    const desenha = () => { const e = est(); q("[data-v=ver]").setAttribute("aria-pressed", String(ver));
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${e.ac} <span style="color:var(--ink3)">→</span> <span style="color:${ver ? (e.bate ? "var(--ok)" : "var(--warn)") : "var(--ink3)"}">${ver ? e.dic.join(" / ") : "?"}</span></div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${e.pt} · ${e.genPt} · nominativo ${e.num ? "plural" : "singular"} → acusativo ${e.num ? "plural" : "singular"}</div>`;
      q("[data-v=lt]").innerHTML = vis("item", (e.k + 1) + " de " + e.total) + vis("pela regra", ver ? e.regra.formas.map(sem).join(" / ") : "?") + vis("dicionário", ver ? e.dic.join(" ou ") : "?") + vis("a regra acertou?", ver ? (e.bate ? "sim" : "não") : "?") + vis("placar da regra", ver ? `${e.placar.ok} de ${e.placar.n}` : "?");
      q("[data-v=st]").innerHTML = (ver ? `Regra usada: ${e.regra.motivo}. Placar medido agora: <b>${e.placar.ok} de ${e.placar.n}</b> acusativos (singular e plural)${e.placar.erradas.length ? "; fora da regra: " + e.placar.erradas.join(", ") : ""}. ` : "Antes de comparar: a palavra é animada ou inanimada? De que gênero? Com que letra termina? ") + "Formas: tabela de declinação do Wiktionary em inglês. A comparação olha só as letras, não o acento."; };
    q("[data-v=ant]").addEventListener("click", () => { k = (k + L.length - 1) % L.length; ver = false; desenha(); }); q("[data-v=prox]").addEventListener("click", () => { k = (k + 1) % L.length; ver = false; desenha(); });
    q("[data-v=sort]").addEventListener("click", () => { let n = k; while (n === k) n = Math.floor(r() * L.length); k = n; ver = false; desenha(); }); q("[data-v=ver]").addEventListener("click", () => { ver = !ver; desenha(); });
    SIM.ruAcusativoLab._ult = { semente: (n) => { r = rng(n); }, sorteia: () => q("[data-v=sort]").click(), poe: (w, num = 0, v = false) => { k = L.findIndex((x) => x.w === w && x.num === num); ver = v; desenha(); }, compara: (v = true) => { ver = v; desenha(); }, est }; desenha(); };

  /* nome: "Escreva a palavra no caso pedido" · matéria: Russo · tema: RG04, RG05, RG06, RG07, RG08 */
  SIM.ruEscreveCaso = (el, F, op = {}) => { const casos = op.casos || ["acc"]; let r = rng(1), fila = [], x = null, res = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button><button class="bt peq" data-v="prox">outra palavra</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div>
      <div style="display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap"><input type="text" data-v="inp" lang="ru" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="escreva a forma em cirílico" style="font:600 24px Inter,system-ui,sans-serif;padding:6px 10px;min-width:280px;background:var(--card2);color:var(--ink);border:1.5px solid var(--line);border-radius:9px"><button class="bt peq" data-v="conf">conferir</button></div>
      <div style="display:flex;justify-content:center">${F.tecladoRu()}</div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), inp = q("[data-v=inp]");
    const base = () => { const o = []; Object.entries(SIM.RU.DECL).forEach(([w, d]) => casos.forEach((c) => [0, 1].forEach((num) => { if (d.casos[c][num].length && d.casos.nom[num].length && !(num === 0 && d.soPl)) o.push({ w, c, num }); }))); return o; };
    const prox = () => { if (!fila.length) fila = emb(base(), r); x = fila.pop(); res = null; inp.value = ""; desenha(); };
    const resp = () => SIM.RU.DECL[x.w].casos[x.c][x.num], confere = () => { const v = F.normTxt(inp.value); if (!v) return; res = resp().map((p) => F.normTxt(p)).includes(v); feitos++; if (res) certos++; desenha(); };
    const est = () => ({ ...x, resp: resp(), res, certos, feitos, digitado: inp.value });
    const desenha = () => { const d = SIM.RU.DECL[x.w];
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${d.casos.nom[x.num][0]}</div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${d.pt} · ${d.genPt} · escreva o <b>${NOME[x.c]} ${x.num ? "plural" : "singular"}</b></div>`;
      inp.style.borderColor = res === null ? "var(--line)" : res ? "var(--ok)" : "var(--bad, #e06666)";
      q("[data-v=lt]").innerHTML = vis("resultado", res === null ? "?" : res ? "certo" : "ainda não") + vis("forma do dicionário", res === null ? "?" : resp().join(" ou ")) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = res === null ? "A palavra aparece no nominativo. O acento não precisa ser digitado; o ё precisa." : res ? `Certo: ${resp().join(" ou ")}.` : `Você escreveu "${inp.value}"; a tabela do dicionário dá ${resp().join(" ou ")}.`; };
    q("[data-v=prox]").addEventListener("click", prox); q("[data-v=conf]").addEventListener("click", confere); inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); confere(); } });
    F.ligaTecladoRu(el, inp); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => (res === null ? SIM.RU.DECL[x.w].casos.nom[x.num][0] : resp()[0]));
    SIM.ruEscreveCaso._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, digita: (t) => { inp.value = t; }, confere, prox, est }; prox(); };
})();
