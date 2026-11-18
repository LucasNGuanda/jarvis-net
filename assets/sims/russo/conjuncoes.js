/* Russo · conjunções e orações subordinadas (RG18): laboratórios.
   Dados: SIM.RU.CONJ (conjunções: verbetes do Wiktionary em inglês; o grupo das coordenativas é o de "Syntax", Russian grammar, Wikipedia),
   SIM.RU.FRC (frases dos verbetes e da Wikipedia com a conjunção marcada) e SIM.RU.KOT (tabela de declinação de который).
   Medida: который se declina como adjetivo? SIM.ruPlacarKot compara as formas da tabela com a regra dos adjetivos do RG09 (SIM.ruAdjRegra). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const emb = (lista, r) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const AC = "́", sem = (s) => String(s).split(AC).join(""), CAS = ["nom", "acc", "gen", "dat", "ins", "prep"], GRANDE = "font:700 46px/1.15 Inter,system-ui,sans-serif;letter-spacing:1px";
  const GR = { soma: "coordenação: soma", opos: "coordenação: oposição", alt: "coordenação: alternativa", sub: "subordinação" };
  SIM.ruGruposConj = GR;
  SIM.ruPlacarKot = () => { let n = 0, ok = 0; const er = []; CAS.forEach((c) => [0, 1, 2, 3].forEach((col) => [false, true].forEach((an) => { if (an && c !== "acc") return; n++; const d = SIM.ruAdjDic("который", c, col, an).map(sem), r = SIM.ruAdjRegra("который", c, col, an); if (d.includes(r)) ok++; else er.push({ regra: r, dic: d.join(" ou ") }); }))); return { ok, n, erros: er }; };
  /* a frase com a conjunção trocada por um traço */
  const troca = (x, f) => x.ru.split(" ").map((p) => { const m = p.match(/^([«"(]*)(.*?)([.,!?;:»")]*)$/); return m && m[2] === x.forma ? m[1] + f(m[2]) + m[3] : p; }).join(" ");
  SIM.ruComLacuna = (x) => troca(x, () => "_____");
  /* forma de который para um substantivo antecedente (gênero e número dele) e um papel na oração (caso) */
  SIM.ruKotDe = (n, caso, plural = false) => { const d = SIM.RU.DECL[n], col = plural ? 3 : { m: 0, n: 1, f: 2 }[d.g]; return SIM.ruAdjDic("который", caso, col, d.an === "anim")[0]; };
  const PAPEL = [["nom", "que faz a ação (sujeito)", "que está aqui"], ["acc", "que sofre a ação (objeto direto)", "que eu vejo"], ["gen", "que não existe; do qual", "que não há"], ["dat", "ao qual", "ao qual eu ajudo"], ["ins", "com o qual (с + instrumental)", "com o qual eu trabalho"], ["prep", "sobre o qual (о + preposicional)", "sobre o qual eu penso"]];
  SIM.ruPapeisKot = PAPEL;

  /* nome: "Qual conjunção falta na frase?" · matéria: Russo · tema: RG18 */
  SIM.ruQueConj = (el, F) => { let r = rng(1), fila = [], x = null, clic = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts" data-v="ops"></div><div class="bts"><button class="bt peq" data-v="prox">outra frase</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir (depois da resposta)</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const prox = () => { if (!fila.length) fila = emb(SIM.RU.FRC, r); const f = fila.pop(), outras = emb([...new Set(SIM.RU.CONJ.map((c) => c.w))].filter((w) => w !== f.w && w !== "который" && (f.w !== "который")), r).slice(0, 3); x = { ...f, ops: f.w === "который" ? emb([sem(f.forma).toLowerCase(), "который", "которое", "которую"].filter((y, i, a) => a.indexOf(y) === i), r) : emb([f.w].concat(outras), r), certa: f.w === "который" ? sem(f.forma).toLowerCase() : f.w }; clic = null; desenha(); };
    const clica = (o) => { if (clic !== null) return; clic = o; feitos++; if (o === x.certa) certos++; desenha(); };
    const est = () => ({ ...x, clic, certos, feitos });
    const desenha = () => { const n = [...x.ru].length;
      q("[data-v=ops]").innerHTML = x.ops.map((o) => `<button class="bt peq" data-o="${o}" style="font-size:17px;border-color:${clic === null ? "" : o === x.certa ? "var(--ok)" : o === clic ? "var(--bad, #e06666)" : ""}">${o}</button>`).join(""); q("[data-v=ops]").querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.o)));
      q("[data-v=pal]").innerHTML = `<div style="font:700 ${n > 36 ? 21 : 28}px/1.3 Inter,system-ui,sans-serif">${clic === null ? SIM.ruComLacuna(x) : troca(x, (w) => `<span style="color:var(--mod)">${w}</span>`)}</div><div style="font-size:14px;color:var(--ink2);margin-top:8px">${x.pt}</div>`;
      const c = SIM.RU.CONJ.find((y) => y.w === x.w);
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : clic === x.certa ? "certo" : "ainda não") + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = clic === null ? "A tradução está à vista; escolha a palavra que liga as duas partes." : `<b>${c.ac}</b>: ${c.pt} (${GR[c.grupo]}; ${c.fun}). Frase: exemplo de verbete do Wiktionary ou de Russian grammar (Wikipedia em inglês).`; };
    q("[data-v=prox]").addEventListener("click", prox); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => (clic === null ? "" : x.ru));
    SIM.ruQueConj._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, clica, prox, est }; prox(); };

  /* nome: "Coordena ou subordina? Classifique a conjunção" · matéria: Russo · tema: RG18 */
  SIM.ruGrupoConj = (el, F) => { const T = Object.keys(GR); let r = rng(1), fila = [], x = null, clic = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${T.map((k) => `<button class="bt peq" data-t="${k}">${GR[k]}</button>`).join("")}<button class="bt peq" data-v="prox">outra</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const prox = () => { if (!fila.length) fila = emb(SIM.RU.CONJ, r); x = fila.pop(); clic = null; desenha(); };
    const clica = (t) => { if (clic !== null) return; clic = t; feitos++; if (t === x.grupo) certos++; desenha(); };
    const est = () => ({ ...x, clic, certos, feitos });
    const desenha = () => { el.querySelectorAll("[data-t]").forEach((b) => { b.setAttribute("aria-pressed", String(clic === b.dataset.t)); b.style.borderColor = clic === null ? "" : b.dataset.t === x.grupo ? "var(--ok)" : b.dataset.t === clic ? "var(--bad, #e06666)" : ""; });
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${x.ac}</div><div style="font-size:14px;color:var(--ink2);margin-top:8px">${x.pt}</div>`;
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : clic === x.grupo ? "certo" : "ainda não") + vis("função", clic === null ? "?" : x.fun) + vis("placar", `${certos} de ${feitos}`);
      const ex = SIM.RU.FRC.find((f) => f.w === x.w);
      q("[data-v=st]").innerHTML = clic === null ? "Coordenar é ligar duas partes do mesmo nível (soma, oposição, alternativa); subordinar é pendurar uma oração na outra (causa, condição, tempo, finalidade...)." : `<b>${x.ac}</b>: ${GR[x.grupo]} (${x.fun}).${ex ? ` Exemplo da fonte: ${ex.ru} (${ex.pt})` : ""} Grupos das coordenativas: Russian grammar (Wikipedia em inglês).`; };
    el.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.t))); q("[data-v=prox]").addEventListener("click", prox);
    SIM.ruGrupoConj._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, clica, prox, est }; prox(); };

  /* nome: "который: concorde com o antecedente, decline pelo papel" · matéria: Russo · tema: RG18 */
  SIM.ruKotLab = (el, F) => { const L = ["стол", "книга", "окно", "друг", "сестра", "письмо", "город", "задача"].filter((w) => SIM.RU.DECL[w]); let n = "книга", k = 0, pl = false, ver = false;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">antecedente e papel de "que" dentro da oração</p><div class="bts"><select data-v="n" class="bt peq" style="font-size:15px;padding:5px 8px">${L.map((w) => `<option value="${w}">${w} (${SIM.RU.DECL[w].pt})</option>`).join("")}</select><select data-v="k" class="bt peq" style="font-size:15px;padding:5px 8px">${PAPEL.map((p, i) => `<option value="${i}">${p[1]}</option>`).join("")}</select><button class="bt peq" data-v="pl">singular</button><button class="bt peq" data-v="ver">mostrar</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:14px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), NC = () => SIM.ruNomeCaso;
    const est = () => { const d = SIM.RU.DECL[n], c = PAPEL[k][0]; return { n, caso: c, pl, ver, forma: SIM.ruKotDe(n, c, pl), ant: d.casos.nom[pl ? 1 : 0][0], g: d.g, an: d.an, placar: SIM.ruPlacarKot() }; };
    const poe = (nn, kk, pp) => { n = nn; k = kk; pl = !!pp; ver = false; desenha(); }, mostra = () => { ver = true; desenha(); };
    const desenha = () => { const e = est(), d = SIM.RU.DECL[n]; q("[data-v=n]").value = n; q("[data-v=k]").value = String(k); q("[data-v=pl]").textContent = pl ? "plural" : "singular";
      q("[data-v=pal]").innerHTML = `<div style="font:700 34px/1.25 Inter,system-ui,sans-serif">${e.ant}, <span style="color:${ver ? "var(--mod)" : "var(--ink3)"}">${ver ? e.forma : "?"}</span> ...</div><div style="font-size:14px;color:var(--ink2);margin-top:8px">${d.pt}${pl ? " (plural)" : ""}, ${PAPEL[k][2]}</div>`;
      q("[data-v=lt]").innerHTML = vis("gênero e número", ver ? (pl ? "plural" : d.genPt.split(",")[0]) : "?") + vis("caso", ver ? NC()[e.caso] : "?") + vis("regra dos adjetivos × tabela", `${e.placar.ok} de ${e.placar.n}`);
      q("[data-v=st]").innerHTML = ver ? `Gênero e número vêm do antecedente (${e.ant}); o caso vem do papel de "que" dentro da oração dele (${NC()[e.caso]})${e.caso === "acc" && (d.g === "m" || pl) ? ", e no acusativo masculino e plural conta ainda se o antecedente é animado" : ""}. Forma: tabela de кото́рый no Wiktionary em inglês. Só o pronome é mostrado: o resto da oração fica por sua conta.` : "Dois passos: gênero e número de quem vem antes; caso pelo papel dentro da oração. Diga a forma e clique em \"mostrar\"."; };
    q("[data-v=n]").addEventListener("change", (ev) => poe(ev.target.value, k, pl)); q("[data-v=k]").addEventListener("change", (ev) => poe(n, +ev.target.value, pl)); q("[data-v=pl]").addEventListener("click", () => poe(n, k, !pl)); q("[data-v=ver]").addEventListener("click", mostra);
    SIM.ruKotLab._ult = { poe, mostra, est }; desenha(); };

  /* nome: "Escreva a conjunção" · matéria: Russo · tema: RG18 */
  SIM.ruEscreveConj = (el, F) => { let r = rng(1), fila = [], x = null, res = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="prox">outra</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div>
      <div style="display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap"><input type="text" data-v="inp" lang="ru" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="escreva a conjunção em cirílico" style="font:600 24px Inter,system-ui,sans-serif;padding:6px 10px;min-width:280px;background:var(--card2);color:var(--ink);border:1.5px solid var(--line);border-radius:9px"><button class="bt peq" data-v="conf">conferir</button></div>
      <div style="display:flex;justify-content:center">${F.tecladoRu()}</div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), inp = q("[data-v=inp]"), base = () => SIM.RU.CONJ.filter((c) => c.w !== "который");
    const resp = () => SIM.RU.CONJ.filter((c) => c.pt === x.pt || (c.fun === x.fun && c.grupo === x.grupo && c.pt.split(",")[0] === x.pt.split(",")[0])).map((c) => c.w);
    const prox = () => { if (!fila.length) fila = emb(base(), r); x = fila.pop(); res = null; inp.value = ""; desenha(); };
    const confere = () => { const v = F.normTxt(inp.value).replace(/\s+/g, " "); if (!v) return; res = resp().map((p) => F.normTxt(p)).includes(v); feitos++; if (res) certos++; desenha(); };
    const est = () => ({ ...x, resp: resp(), res, certos, feitos });
    const desenha = () => { q("[data-v=pal]").innerHTML = `<div style="font:700 34px/1.2 Inter,system-ui,sans-serif">${x.pt}</div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${GR[x.grupo]} · ${x.fun} · ${[...x.w].length} letras${x.w.includes(" ") ? " (duas palavras)" : ""}</div>`; inp.style.borderColor = res === null ? "var(--line)" : res ? "var(--ok)" : "var(--bad, #e06666)";
      q("[data-v=lt]").innerHTML = vis("resultado", res === null ? "?" : res ? "certo" : "ainda não") + vis("resposta", res === null ? "?" : resp().join(" ou ")) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = res === null ? "Escreva a conjunção russa. O acento não precisa ser digitado." : `${resp().join(" ou ")}: ${x.pt}. Verbete do Wiktionary em inglês.`; };
    q("[data-v=prox]").addEventListener("click", prox); q("[data-v=conf]").addEventListener("click", confere); inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); confere(); } }); F.ligaTecladoRu(el, inp);
    SIM.ruEscreveConj._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, digita: (s) => { inp.value = s; }, confere, prox, est }; prox(); };
})();
