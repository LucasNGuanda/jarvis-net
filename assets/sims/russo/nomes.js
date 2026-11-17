/* Russo · laboratórios do tema RG03 (substantivos: gênero e número).
   Dados: SIM.RU.NOM (assets/sims/russo/dados.js, GERADO a partir de tools/russo/dadosR3.json: gênero e plural de cada palavra vêm do Wiktionary em inglês).
   As REGRAS programadas aqui (gênero pela terminação, SIM.ruGeneroRegra; nominativo plural, SIM.ruPluralRegra) resumem "Russian declension",
   "Russian grammar", "Russian orthography" e "Russian spelling rules" (Wikipedia em inglês). Elas NÃO são dadas como certas: o laboratório e o
   teste (tests/tlabsR.js) comparam com o dicionário, palavra por palavra, e a tela mostra o placar medido e as exceções. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const emb = (lista, r) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const AC = "́", sem = (s) => String(s).split(AC).join(""), VOG = "аеёиоуыэюя", SETE = "гкхжчшщ", CHIA = "жчшщ";
  const GRANDE = "font:700 54px/1.1 Inter,system-ui,sans-serif;letter-spacing:2px";
  const GEN = { m: ["masculino", "var(--mod)"], f: ["feminino", "var(--warn)"], n: ["neutro", "var(--ok)"] };
  SIM.ruGen = GEN;
  /* terminação do nominativo singular */
  SIM.ruTermina = (w) => { const p = sem(w).toLowerCase(), u = p.slice(-1); if (p.endsWith("мя")) return "мя"; if (u === "ь" || u === "й" || "аяое".includes(u)) return u; if (!VOG.includes(u)) return "cons"; return "outra"; };
  /* gênero pela terminação (resumo da fonte). g null = a terminação não decide */
  SIM.ruGeneroRegra = (w) => { const t = SIM.ruTermina(w), p = sem(w).toLowerCase();
    if (t === "мя") return { g: "n", t, motivo: "termina em -мя: neutro (grupo pequeno e irregular)" };
    if (t === "cons") return { g: "m", t, motivo: "termina em consoante: masculino" };
    if (t === "й") return { g: "m", t, motivo: "termina em -й: masculino" };
    if (t === "а" || t === "я") return { g: "f", t, motivo: "termina em -" + t + ": feminino (há masculinos com essa terminação, como па́па e дя́дя)" };
    if (t === "о" || t === "е") return { g: "n", t, motivo: "termina em -" + t + ": neutro" };
    if (t === "ь") return CHIA.includes(p.slice(-2, -1)) ? { g: "f", t, motivo: "chiante (ж, ч, ш, щ) + ь no fim: feminino; o masculino não leva o ь" } : { g: null, t, motivo: "termina em -ь: pode ser masculino ou feminino; a terminação não decide" };
    return { g: null, t, motivo: "terminação fora do padrão (palavra estrangeira): a terminação não decide" }; };
  /* nominativo plural pela regra (sem acento); null = a regra não prevê */
  SIM.ruPluralRegra = (w, g) => { const p = sem(w).toLowerCase(), t = SIM.ruTermina(w), rad = p.slice(0, -1), yi = (base) => base + (SETE.includes(base.slice(-1)) ? "и" : "ы");
    if (t === "мя") return rad.slice(0, -1) + "мена";
    if (t === "cons") return yi(p);
    if (t === "й" || t === "ь" || t === "я") return rad + "и";
    if (t === "а") return yi(rad);
    if (t === "о") return rad + "а";
    if (t === "е") return rad + "я";
    return null; };
  const usaveis = () => SIM.RU.NOM.filter((x) => !x.indecl && !x.soPl);
  SIM.ruPlacarNomes = () => { const G = { n: 0, ok: 0, semRegra: [], erradas: [] }, Pl = { n: 0, ok: 0, erradas: [] };
    usaveis().forEach((x) => { const r = SIM.ruGeneroRegra(x.w); if (r.g === null) G.semRegra.push(x.w); else { G.n++; if (x.gs.includes(r.g)) G.ok++; else G.erradas.push(x.w); }
      if (x.pl.length) { const pr = SIM.ruPluralRegra(x.w, x.gs[0]); Pl.n++; if (pr && x.pl.map(sem).includes(pr)) Pl.ok++; else Pl.erradas.push(x.w); } });
    return { genero: G, plural: Pl }; };

  /* nome: "De que gênero é? Decida pela terminação" · matéria: Russo · tema: RG03 */
  SIM.ruGeneroQuiz = (el, F) => { let r = rng(1), fila = [], x = null, clic = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-g="m">masculino</button><button class="bt peq" data-g="f">feminino</button><button class="bt peq" data-g="n">neutro</button><button class="bt peq" data-v="prox">outra palavra</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), base = () => SIM.RU.NOM.filter((y) => !y.soPl);
    const prox = () => { if (!fila.length) fila = emb(base(), r); x = fila.pop(); clic = null; desenha(); };
    const clica = (g) => { if (clic !== null) return; clic = g; feitos++; if (x.gs.includes(g)) certos++; desenha(); };
    const est = () => ({ w: x.w, gs: x.gs, regra: SIM.ruGeneroRegra(x.w), clic, certos, feitos });
    const desenha = () => { const rg = SIM.ruGeneroRegra(x.w), certo = clic !== null && x.gs.includes(clic);
      el.querySelectorAll("[data-g]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.g === clic)));
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE};color:${clic === null ? "var(--ink)" : GEN[x.gs[0]][1]}">${x.ac}</div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${x.pt}</div>`;
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : certo ? "certo" : "ainda não") + vis("dicionário", clic === null ? "?" : x.gs.map((g) => GEN[g][0]).join(" ou ")) + vis("pela terminação", clic === null ? "?" : rg.g ? GEN[rg.g][0] : "não decide") + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = clic === null ? "Olhe a última letra e decida. Algumas palavras são exceção, e algumas terminações não decidem: nesses casos, só a memória resolve." : `${x.ac}: ${rg.motivo}. No dicionário: <b>${x.gs.map((g) => GEN[g][0]).join(" ou ")}</b>${x.indecl ? " (palavra indeclinável)" : ""}${rg.g && !x.gs.includes(rg.g) ? ". É uma <b>exceção</b> à regra da terminação" : ""}. Gênero: verbete do Wiktionary em inglês.`; };
    el.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.g))); q("[data-v=prox]").addEventListener("click", prox);
    SIM.ruGeneroQuiz._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, poe: (w) => { x = SIM.RU.NOM.find((y) => y.w === w); clic = null; desenha(); }, clica, prox, est }; prox(); };

  /* nome: "A regra do plural contra o dicionário" · matéria: Russo · tema: RG03 */
  SIM.ruPluralLab = (el, F) => { const L = usaveis().filter((x) => x.pl.length); let k = Math.max(0, L.findIndex((x) => x.w === "книга")), ver = false, r = rng(1);
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="ant">anterior</button><button class="bt peq" data-v="prox">próxima</button><button class="bt peq" data-v="sort">sortear</button><button class="bt peq" data-v="ver" aria-pressed="false">comparar com o dicionário</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => { const x = L[k], regra = SIM.ruPluralRegra(x.w, x.gs[0]); return { ...x, k, total: L.length, ver, regra, bate: !!regra && x.pl.map(sem).includes(regra), placar: SIM.ruPlacarNomes().plural }; };
    const desenha = () => { const e = est(); q("[data-v=ver]").setAttribute("aria-pressed", String(ver));
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${e.ac} <span style="color:var(--ink3)">→</span> <span style="color:${ver ? (e.bate ? "var(--ok)" : "var(--warn)") : "var(--ink3)"}">${ver ? e.pl.join(" / ") : "?"}</span></div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${e.pt} · ${GEN[e.gs[0]][0]}</div>`;
      q("[data-v=lt]").innerHTML = vis("palavra", (e.k + 1) + " de " + e.total) + vis("pela regra", ver ? e.regra || "sem previsão" : "?") + vis("dicionário", ver ? e.pl.join(" ou ") : "?") + vis("a regra acertou?", ver ? (e.bate ? "sim" : "não: irregular") : "?") + vis("placar da regra", ver ? `${e.placar.ok} de ${e.placar.n}` : "?");
      q("[data-v=st]").innerHTML = (ver ? `Placar medido agora: a regra acerta a grafia de <b>${e.placar.ok} de ${e.placar.n}</b> plurais. ${e.bate ? "" : "Esta palavra é das que fogem da regra: o plural tem de ser aprendido junto com ela. "}${e.plRaro.length ? "O dicionário registra ainda, como forma arcaica ou fora do padrão: " + e.plRaro.join(", ") + ". " : ""}A comparação olha só as letras: a regra não prevê para onde vai o acento. ` : "Forme o plural de cabeça e só então compare. ") + "Plural: verbete do Wiktionary em inglês."; };
    q("[data-v=ant]").addEventListener("click", () => { k = (k + L.length - 1) % L.length; ver = false; desenha(); }); q("[data-v=prox]").addEventListener("click", () => { k = (k + 1) % L.length; ver = false; desenha(); });
    q("[data-v=sort]").addEventListener("click", () => { let n = k; while (n === k) n = Math.floor(r() * L.length); k = n; ver = false; desenha(); }); q("[data-v=ver]").addEventListener("click", () => { ver = !ver; desenha(); });
    SIM.ruPluralLab._ult = { semente: (n) => { r = rng(n); }, sorteia: () => q("[data-v=sort]").click(), poe: (w, v = false) => { k = L.findIndex((x) => x.w === w); ver = v; desenha(); }, compara: (v = true) => { ver = v; desenha(); }, est }; desenha(); };

  /* nome: "Escreva o plural" · matéria: Russo · tema: RG03 */
  SIM.ruEscrevePlural = (el, F) => { let r = rng(1), fila = [], x = null, res = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button><button class="bt peq" data-v="prox">outra palavra</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div>
      <div style="display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap"><input type="text" data-v="inp" lang="ru" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="escreva o plural em cirílico" style="font:600 24px Inter,system-ui,sans-serif;padding:6px 10px;min-width:280px;background:var(--card2);color:var(--ink);border:1.5px solid var(--line);border-radius:9px"><button class="bt peq" data-v="conf">conferir</button></div>
      <div style="display:flex;justify-content:center">${F.tecladoRu()}</div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), inp = q("[data-v=inp]"), base = () => usaveis().filter((y) => y.pl.length);
    const prox = () => { if (!fila.length) fila = emb(base(), r); x = fila.pop(); res = null; inp.value = ""; desenha(); };
    const confere = () => { const v = F.normTxt(inp.value); if (!v) return; res = x.pl.map((p) => F.normTxt(p)).includes(v); feitos++; if (res) certos++; desenha(); };
    const est = () => ({ w: x.w, pl: x.pl, res, certos, feitos, digitado: inp.value });
    const desenha = () => { q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${x.ac}</div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${x.pt} · ${GEN[x.gs[0]][0]} · escreva o nominativo plural</div>`;
      inp.style.borderColor = res === null ? "var(--line)" : res ? "var(--ok)" : "var(--bad, #e06666)";
      q("[data-v=lt]").innerHTML = vis("resultado", res === null ? "?" : res ? "certo" : "ainda não") + vis("plural", res === null ? "?" : x.pl.join(" ou ")) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = res === null ? "Entram plurais regulares e irregulares, misturados. O acento não precisa ser digitado; o ё precisa." : res ? `Certo: ${x.ac} → ${x.pl.join(" ou ")}.` : `Você escreveu "${inp.value}"; o dicionário dá ${x.pl.join(" ou ")}.`; };
    q("[data-v=prox]").addEventListener("click", prox); q("[data-v=conf]").addEventListener("click", confere); inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); confere(); } });
    F.ligaTecladoRu(el, inp); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => (res === null ? x.w : x.pl[0]));
    SIM.ruEscrevePlural._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, digita: (t) => { inp.value = t; }, confere, prox, est }; prox(); };
})();
