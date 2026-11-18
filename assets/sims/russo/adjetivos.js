/* Russo · adjetivos (RG09): regra de declinação medida, laboratórios e exercícios.
   Dados: SIM.RU.ADJ (declinação completa de cada adjetivo: tabelas do Wiktionary em inglês), SIM.RU.DECL (substantivos) e SIM.RU.PARES_AS
   (pares adjetivo + substantivo montados para os laboratórios: a combinação é do site, as formas são das tabelas da fonte).
   A REGRA programada aqui (SIM.ruAdjRegra) resume as tabelas de terminações de "Russian grammar" e "Russian declension" (Wikipedia em inglês)
   e é MEDIDA contra o dicionário (SIM.ruPlacarAdj): o placar da tela é calculado na hora. A comparação olha só as letras, não o acento. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const emb = (lista, r) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const AC = "́", sem = (s) => String(s).split(AC).join(""), GRANDE = "font:700 44px/1.15 Inter,system-ui,sans-serif;letter-spacing:1px";
  const COL = ["masculino", "neutro", "feminino", "plural"], CASOS = ["nom", "acc", "gen", "dat", "ins", "prep"], NOME = { nom: "nominativo", acc: "acusativo", gen: "genitivo", dat: "dativo", ins: "instrumental", prep: "preposicional" };
  SIM.ruCol = COL;
  /* tipo do adjetivo pela última consoante do radical e pela terminação do dicionário */
  SIM.ruAdjTipo = (w) => { const p = sem(w), fim = p.slice(-2), ult = p.slice(-3, -2); if ("гкх".includes(ult)) return { t: "velar", o: "о", y: "и", a: "ая", u: "ую", nome: "radical em г, к, х" }; if ("жчшщ".includes(ult)) return fim === "ой" ? { t: "chiaO", o: "о", y: "и", a: "ая", u: "ую", nome: "radical em chiante, terminação tônica" } : { t: "chia", o: "е", y: "и", a: "ая", u: "ую", nome: "radical em chiante" }; if (fim === "ий") return { t: "mole", o: "е", y: "и", a: "яя", u: "юю", nome: "mole (-ий)" }; return { t: "duro", o: "о", y: "ы", a: "ая", u: "ую", nome: fim === "ой" ? "duro, terminação tônica (-ой)" : "duro (-ый)" }; };
  /* forma pela regra: caso (nom, acc, gen, dat, ins, prep), coluna 0..3 (m, n, f, pl), animado (só muda o acusativo de m e pl) */
  SIM.ruAdjRegra = (w, c, col, anim = false) => { const p = sem(w), b = p.slice(0, -2), T = SIM.ruAdjTipo(w), nom = [p, b + T.o + "е", b + T.a, b + T.y + "е"];
    const T4 = { gen: [T.o + "го", T.o + "го", T.o + "й", T.y + "х"], dat: [T.o + "му", T.o + "му", T.o + "й", T.y + "м"], ins: [T.y + "м", T.y + "м", T.o + "й", T.y + "ми"], prep: [T.o + "м", T.o + "м", T.o + "й", T.y + "х"] };
    if (c === "nom") return nom[col]; if (c === "acc") return col === 1 ? nom[1] : col === 2 ? b + T.u : anim ? b + T4.gen[col] : nom[col]; return b + T4[c][col]; };
  const B = (w) => SIM.RU.ADJ[w] || (SIM.RU.POSS || {})[w] || (SIM.RU.KOT || {})[w]; /* adjetivo ou possessivo/demonstrativo: mesmas tabelas */
  const dic = (w, c, col, anim) => B(w).casos[c === "acc" && anim ? "accA" : c][col];
  SIM.ruAdjDic = dic;
  SIM.ruPlacarAdj = () => { let n = 0, ok = 0; const erradas = []; Object.keys(SIM.RU.ADJ).forEach((w) => { let tudo = true; CASOS.forEach((c) => [0, 1, 2, 3].forEach((col) => [false, true].forEach((an) => { if (an && c !== "acc") return; n++; if (dic(w, c, col, an).map(sem).includes(SIM.ruAdjRegra(w, c, col, an))) ok++; else tudo = false; }))); if (!tudo) erradas.push(w); }); return { n, ok, erradas, adj: Object.keys(SIM.RU.ADJ).length }; };
  const genCol = (n, num) => (num ? 3 : { m: 0, n: 1, f: 2 }[SIM.RU.DECL[n].g]);
  /* par no caso c e número num: { adj: [formas], subst: [formas] } */
  SIM.ruPar = (a, n, c, num) => { const d = SIM.RU.DECL[n], an = d.an === "anim"; return { adj: dic(a, c, genCol(n, num), an), subst: d.casos[c][num], col: genCol(n, num) }; };

  /* nome: "Concorde o adjetivo com o substantivo" · matéria: Russo · tema: RG09, RG10 */
  SIM.ruConcorda = (el, F, op = {}) => { let r = rng(1), fila = [], x = null, clic = null, certos = 0, feitos = 0, ops = []; const NA = op.pares ? "possessivo ou demonstrativo" : "adjetivo";
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="prox">outro par</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div><div data-v="ops" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:560px;margin:0 auto 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), base = () => { const o = []; (op.pares || SIM.RU.PARES_AS).forEach(([a, n]) => [0, 1].forEach((num) => { if (SIM.RU.DECL[n].casos.nom[num].length) o.push({ a, n, num }); })); return o; };
    const prox = () => { if (!fila.length) fila = emb(base(), r); x = fila.pop(); ops = emb([0, 1, 2, 3], r); clic = null; desenha(); };
    const certa = () => genCol(x.n, x.num), clica = (col) => { if (clic !== null) return; clic = col; feitos++; if (col === certa()) certos++; desenha(); };
    const est = () => ({ ...x, certa: certa(), forma: B(x.a).casos.nom[certa()][0], subst: SIM.RU.DECL[x.n].casos.nom[x.num][0], clic, certos, feitos, ops: ops.slice() });
    const desenha = () => { const A = B(x.a), d = SIM.RU.DECL[x.n], c = certa(), s = d.casos.nom[x.num][0];
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}"><span style="color:var(--ink3)">${clic === null ? "____" : A.casos.nom[c][0]}</span> ${s}</div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${A.pt} + ${d.pt}${x.num ? " (plural)" : ""} · ${NA} do dicionário: ${A.ac}</div>`;
      q("[data-v=ops]").innerHTML = ops.map((col) => `<button type="button" class="bt" data-o="${col}" style="padding:10px;font-size:19px;font-weight:600;border-color:${clic === null ? "" : col === c ? "var(--ok)" : col === clic ? "var(--bad, #e06666)" : ""}">${A.casos.nom[col][0]}</button>`).join("");
      q("[data-v=ops]").querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => clica(+b.dataset.o)));
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : clic === c ? "certo" : "ainda não") + vis("o substantivo é", clic === null ? "?" : x.num ? "plural" : d.genPt.split(",")[0]) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = clic === null ? `O ${NA} copia o gênero e o número do substantivo. Descubra o gênero pela terminação (ou pela memória) e escolha a forma.` : `${A.casos.nom[c][0]} ${s}: o substantivo é ${x.num ? "plural (no plural não há distinção de gênero)" : d.genPt.split(",")[0]}, e o ${NA} vai para a forma de ${COL[c]}. O par foi montado para o laboratório; as duas formas vêm das tabelas do Wiktionary em inglês.`; };
    q("[data-v=prox]").addEventListener("click", prox); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => B(x.a).casos.nom[certa()][0] + " " + SIM.RU.DECL[x.n].casos.nom[x.num][0]);
    SIM.ruConcorda._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, clica, prox, est }; prox(); };

  /* nome: "A declinação do adjetivo contra o dicionário" · matéria: Russo · tema: RG09 */
  SIM.ruAdjLab = (el, F) => { const L = Object.keys(SIM.RU.ADJ); let k = Math.max(0, L.indexOf("новый")), ver = false, r = rng(1);
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="ant">anterior</button><button class="bt peq" data-v="prox">próximo</button><button class="bt peq" data-v="sort">sortear</button><button class="bt peq" data-v="ver" aria-pressed="false">comparar com o dicionário</button></div></div></div><div class="palco" data-v="pal" style="padding:10px;overflow-x:auto"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => { const w = L[k], A = SIM.RU.ADJ[w]; let n = 0, ok = 0; CASOS.forEach((c) => [0, 1, 2, 3].forEach((col) => { n++; if (dic(w, c, col, false).map(sem).includes(SIM.ruAdjRegra(w, c, col, false))) ok++; })); return { w, ac: A.ac, pt: A.pt, tipo: SIM.ruAdjTipo(w), n, ok, ver, k, total: L.length, placar: SIM.ruPlacarAdj() }; };
    const desenha = () => { const e = est(), A = SIM.RU.ADJ[e.w]; q("[data-v=ver]").setAttribute("aria-pressed", String(ver));
      q("[data-v=pal]").innerHTML = `<div style="text-align:center;${GRANDE}">${e.ac}</div><div style="text-align:center;font-size:13px;color:var(--ink2);margin:6px 0 10px">${e.pt} · ${ver ? e.tipo.nome : "de que tipo é?"}</div><table style="margin:0 auto;border-collapse:collapse;font-size:15px"><tr><th style="padding:3px 10px;color:var(--ink2);font-weight:600"></th>${COL.map((c) => `<th style="padding:3px 12px;color:var(--ink2);font-weight:600">${c}</th>`).join("")}</tr>${CASOS.map((c) => `<tr><td style="padding:3px 10px;color:var(--ink2)">${NOME[c]}${c === "acc" ? " (inan.)" : ""}</td>${[0, 1, 2, 3].map((col) => { const d = dic(e.w, c, col, false), b = d.map(sem).includes(SIM.ruAdjRegra(e.w, c, col, false)); return `<td style="padding:3px 12px;font-weight:600;color:${!ver ? "var(--ink3)" : b ? "var(--ink)" : "var(--warn)"}">${ver ? d[0] : c === "nom" && col === 0 ? d[0] : "?"}</td>`; }).join("")}</tr>`).join("")}</table>`;
      q("[data-v=lt]").innerHTML = vis("adjetivo", (e.k + 1) + " de " + e.total) + vis("a regra acertou", ver ? `${e.ok} de ${e.n} formas` : "?") + vis("placar da regra", ver ? `${e.placar.ok} de ${e.placar.n}` : "?");
      q("[data-v=st]").innerHTML = (ver ? `Tipo: ${e.tipo.nome}. Placar medido agora, nos ${e.placar.adj} adjetivos do banco: a regra acerta <b>${e.placar.ok} de ${e.placar.n}</b> formas${e.placar.erradas.length ? "; há alguma forma fora da regra em: " + e.placar.erradas.join(", ") : ""}. Forma em amarelo = a regra não acertou. O acusativo de masculino e de plural muda quando o substantivo é animado (fica igual ao genitivo). ` : "Diga a tabela inteira em voz alta, caso por caso, e só então compare. ") + "Formas: tabela de declinação do Wiktionary em inglês (quando a célula tem duas formas, aparece a primeira)."; };
    q("[data-v=ant]").addEventListener("click", () => { k = (k + L.length - 1) % L.length; ver = false; desenha(); }); q("[data-v=prox]").addEventListener("click", () => { k = (k + 1) % L.length; ver = false; desenha(); });
    q("[data-v=sort]").addEventListener("click", () => { let n = k; while (n === k) n = Math.floor(r() * L.length); k = n; ver = false; desenha(); }); q("[data-v=ver]").addEventListener("click", () => { ver = !ver; desenha(); });
    SIM.ruAdjLab._ult = { semente: (n) => { r = rng(n); }, sorteia: () => q("[data-v=sort]").click(), poe: (w, v = false) => { k = L.indexOf(w); ver = v; desenha(); }, compara: (v = true) => { ver = v; desenha(); }, est }; desenha(); };

  /* nome: "Escreva o par: adjetivo e substantivo no caso pedido" · matéria: Russo · tema: RG09 */
  SIM.ruEscrevePar = (el, F, op = {}) => { const casos = op.casos || CASOS; let r = rng(1), fila = [], x = null, res = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button><button class="bt peq" data-v="prox">outro par</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div>
      <div style="display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap"><input type="text" data-v="inp" lang="ru" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="escreva o adjetivo e o substantivo em cirílico" style="font:600 22px Inter,system-ui,sans-serif;padding:6px 10px;min-width:340px;background:var(--card2);color:var(--ink);border:1.5px solid var(--line);border-radius:9px"><button class="bt peq" data-v="conf">conferir</button></div>
      <div style="display:flex;justify-content:center">${F.tecladoRu()}</div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), inp = q("[data-v=inp]");
    const base = () => { const o = []; (op.pares || SIM.RU.PARES_AS).forEach(([a, n]) => casos.forEach((c) => [0, 1].forEach((num) => { const d = SIM.RU.DECL[n]; if (d.casos[c][num].length && d.casos.nom[num].length) o.push({ a, n, c, num }); }))); return o; };
    const resp = () => { const p = SIM.ruPar(x.a, x.n, x.c, x.num), o = []; p.adj.forEach((a) => p.subst.forEach((s) => o.push(a + " " + s))); return o; };
    const prox = () => { if (!fila.length) fila = emb(base(), r); x = fila.pop(); res = null; inp.value = ""; desenha(); };
    const confere = () => { const t = F.normTxt(inp.value); if (!t) return; res = resp().map((p) => F.normTxt(p)).includes(t); feitos++; if (res) certos++; desenha(); };
    const est = () => ({ ...x, resp: resp(), res, certos, feitos });
    const desenha = () => { const A = B(x.a), d = SIM.RU.DECL[x.n];
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${A.ac} + ${d.ac}</div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${A.pt} + ${d.pt} (${d.genPt}) · escreva as duas palavras no <b>${NOME[x.c]} ${x.num ? "plural" : "singular"}</b></div>`;
      inp.style.borderColor = res === null ? "var(--line)" : res ? "var(--ok)" : "var(--bad, #e06666)";
      q("[data-v=lt]").innerHTML = vis("resultado", res === null ? "?" : res ? "certo" : "ainda não") + vis("resposta", res === null ? "?" : resp()[0]) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = res === null ? "Primeiro decline o substantivo; depois ponha o adjetivo no mesmo gênero, número e caso. Escreva as duas palavras, com um espaço. O acento não precisa ser digitado." : res ? `Certo: ${resp()[0]}.` : `Você escreveu "${inp.value}"; as tabelas dão ${resp()[0]}.`; };
    q("[data-v=prox]").addEventListener("click", prox); q("[data-v=conf]").addEventListener("click", confere); inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); confere(); } });
    F.ligaTecladoRu(el, inp);
    if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => (res === null ? B(x.a).ac + " " + SIM.RU.DECL[x.n].ac : resp()[0]));
    SIM.ruEscrevePar._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, digita: (t) => { inp.value = t; }, confere, prox, est }; prox(); };
})();
