/* Russo · imperativo e condicional (RG17): regra medida e laboratórios.
   Dados: SIM.RU.VERB (tabelas do Wiktionary em inglês: imperativo, presente ou futuro, passado), SIM.RU.FRI (frases dos verbetes e da Wikipedia) e
   SIM.RU.COND_WP (tabela do condicional de сказать, Russian grammar, Wikipedia).
   A regra do imperativo (SIM.ruImperativoRegra) é a que as fontes descrevem ("Moods" de Russian grammar e "Imperative mood", Wikipedia em inglês):
   radical = 3ª pessoa do plural sem a terminação; radical em vogal → -й; senão, terminação tônica na 1ª pessoa OU radical em duas consoantes → -и;
   senão → -ь; plural = singular + -те. É um MODELO: o placar contra o dicionário sai de SIM.ruPlacarImp(), calculado na hora.
   O condicional (SIM.ruCondicional) é passado + бы; é comparado com as dez formas da tabela da Wikipedia. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const emb = (lista, r) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const AC = "́", sem = (s) => String(s).split(AC).join(""), VOG = "аеёиоуыэюя", GRANDE = "font:700 46px/1.15 Inter,system-ui,sans-serif;letter-spacing:1px";
  const PASSO = { vogal: "o radical termina em vogal → -й", tonica: "a terminação da 1ª pessoa é tônica → -и", duas: "o radical termina em duas consoantes → -и", mole: "terminação átona e uma consoante só → -ь" };
  const VB = (w) => SIM.RU.VERB[w] || (SIM.RU.VEN || {})[w]; /* verbo do banco ou verbo de enunciado (RL06): mesmo formato */
  SIM.ruImperativoRegra = (w) => { const v = VB(w); if (!v || !v.pres[5].length || !v.pres[0].length) return null; const refl = w.endsWith("ся") || w.endsWith("сь"); let p3 = sem(v.pres[5][0]), p1 = v.pres[0][0]; if (refl) { p3 = p3.slice(0, -2); p1 = p1.slice(0, -2); }
    const st = p3.slice(0, -2), ult = st.slice(-1), s1 = sem(p1), iAc = p1.indexOf(AC), nv = [...s1].filter((c) => VOG.includes(c)).length, tonFinal = s1.endsWith("ё") ? false : iAc < 0 ? nv <= 1 : iAc === p1.length - 1;
    let sg, passo; if (VOG.includes(ult)) { sg = st + "й"; passo = "vogal"; } else { const pen = st.slice(-2, -1), duas = st.length >= 2 && !VOG.includes(pen) && !"ьъ".includes(pen); if (tonFinal) { sg = st + "и"; passo = "tonica"; } else if (duas) { sg = st + "и"; passo = "duas"; } else { sg = st + "ь"; passo = "mole"; } }
    const pl = sg + "те"; return { p3: v.pres[5][0], p1: v.pres[0][0], st, passo, txt: PASSO[passo], sg: refl ? sg + (sg.endsWith("и") ? "сь" : "ся") : sg, pl: refl ? pl + "сь" : pl }; };
  SIM.ruImpVerbos = () => Object.keys(SIM.RU.VERB).filter((w) => w !== "быть" && SIM.RU.VERB[w].imp[0].length && SIM.ruImperativoRegra(w));
  SIM.ruImpBate = (w) => { const r = SIM.ruImperativoRegra(w), d = VB(w).imp; return d[0].map(sem).includes(r.sg) && d[1].map(sem).includes(r.pl); };
  SIM.ruPlacarImp = (lista) => { const L = lista || SIM.ruImpVerbos(), er = L.filter((w) => !SIM.ruImpBate(w)); return { ok: L.length - er.length, n: L.length, erros: er.map((w) => ({ w, regra: SIM.ruImperativoRegra(w).sg, dic: VB(w).imp[0].join(" ou ") })) }; };
  SIM.ruVerboDe = VB;
  /* condicional: sujeito + бы + passado (g: 0 masc., 1 fem., 2 neutro, 3 plural) */
  const SUJ = [["я", 0, "eu (homem)"], ["я", 1, "eu (mulher)"], ["ты", 0, "tu, você (homem)"], ["ты", 1, "tu, você (mulher)"], ["он", 0, "ele"], ["она́", 1, "ela"], ["оно́", 2, "ele, ela (neutro)"], ["мы", 3, "nós"], ["вы", 3, "vocês"], ["они́", 3, "eles, elas"]];
  SIM.ruSujeitos = SUJ;
  SIM.ruCondicional = (w, k) => { const v = SIM.RU.VERB[w], s = SUJ[k]; return v && v.pass[s[1]].length ? s[0] + " бы " + v.pass[s[1]][0] : null; };
  SIM.ruPlacarCond = () => { const T = SIM.RU.COND_WP; let ok = 0; T.forEach(([p, f]) => { if (SUJ.some((s, k) => sem(s[0]) === p && SIM.ruCondicional("сказать", k) === f)) ok++; }); return { ok, n: T.length }; };

  /* nome: "A regra do imperativo contra o dicionário" · matéria: Russo · tema: RG17, RL06 */
  SIM.ruImperativoLab = (el, F, op = {}) => { const L = op.lista || SIM.ruImpVerbos(); let k = Math.max(0, L.indexOf("говорить")), ver = false;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">verbo</p><div class="bts"><select data-v="sel" class="bt peq" style="font-size:15px;padding:5px 8px">${L.map((w, i) => `<option value="${i}">${w} (${VB(w).pt})</option>`).join("")}</select><button class="bt peq" data-v="prox">próximo</button><button class="bt peq" data-v="erro">próximo que a regra erra</button><button class="bt peq" data-v="ver">comparar</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:14px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => { const w = L[k]; return { w, ver, regra: SIM.ruImperativoRegra(w), dic: VB(w).imp, bate: SIM.ruImpBate(w), placar: SIM.ruPlacarImp(op.lista) }; };
    const poe = (i) => { k = (i + L.length) % L.length; ver = false; desenha(); }, compara = () => { ver = true; desenha(); };
    const desenha = () => { const e = est(), v = VB(e.w), r = e.regra; q("[data-v=sel]").value = String(k);
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${v.ac}</div><div style="font-size:14px;color:var(--ink2);margin-top:8px">${v.pt} · eles: <b>${r.p3}</b> · eu: <b>${r.p1}</b></div><div style="font:600 24px/1.3 Inter,system-ui,sans-serif;margin-top:12px;color:${ver ? (e.bate ? "var(--ok)" : "var(--bad, #e06666)") : "var(--ink3)"}">${ver ? "a regra dá: " + r.sg + ", " + r.pl : "ты ? · вы ?"}</div>`;
      q("[data-v=lt]").innerHTML = vis("dicionário", ver ? e.dic[0].join(" ou ") + " · " + e.dic[1].join(" ou ") : "?") + vis("neste verbo", ver ? (e.bate ? "a regra acerta" : "a regra erra") : "?") + vis(op.lista ? "nesta lista" : "no banco inteiro", `${e.placar.ok} de ${e.placar.n}`);
      q("[data-v=st]").innerHTML = ver ? `Radical (3ª do plural sem a terminação): <b>${r.st}-</b>; ${r.txt}. ${e.bate ? "" : "Este é um dos imperativos que a regra não prevê: decore. "}A comparação não olha o acento. Regra: Russian grammar e Imperative mood (Wikipedia em inglês); formas: Wiktionary.` : "Tire a terminação da forma de \"eles\", veja onde cai o acento na forma de \"eu\" e diga o imperativo. Depois clique em \"comparar\"."; };
    q("[data-v=sel]").addEventListener("change", (ev) => poe(+ev.target.value)); q("[data-v=prox]").addEventListener("click", () => poe(k + 1)); q("[data-v=ver]").addEventListener("click", compara);
    q("[data-v=erro]").addEventListener("click", () => { for (let i = 1; i <= L.length; i++) if (!SIM.ruImpBate(L[(k + i) % L.length])) return poe(k + i); });
    SIM.ruImperativoLab._ult = { poe: (w) => poe(L.indexOf(w)), compara, est }; desenha(); };

  /* nome: "Do passado ao condicional: ponha o бы" · matéria: Russo · tema: RG17 */
  SIM.ruCondLab = (el, F) => { const L = Object.keys(SIM.RU.VERB).filter((w) => SIM.RU.VERB[w].pass[0].length); let w = "сказать", k = 0, ver = false;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">verbo e sujeito</p><div class="bts"><select data-v="w" class="bt peq" style="font-size:15px;padding:5px 8px">${L.map((x) => `<option value="${x}">${x} (${SIM.RU.VERB[x].pt})</option>`).join("")}</select><select data-v="k" class="bt peq" style="font-size:15px;padding:5px 8px">${SUJ.map((s, i) => `<option value="${i}">${sem(s[0])} · ${s[2]}</option>`).join("")}</select><button class="bt peq" data-v="ver">mostrar</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:14px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => ({ w, k, ver, pass: SUJ[k][0] + " " + SIM.RU.VERB[w].pass[SUJ[k][1]][0], cond: SIM.ruCondicional(w, k), placar: SIM.ruPlacarCond() });
    const poe = (ww, kk) => { w = ww; k = kk; ver = false; desenha(); }, mostra = () => { ver = true; desenha(); };
    const desenha = () => { const e = est(), v = SIM.RU.VERB[w]; q("[data-v=w]").value = w; q("[data-v=k]").value = String(k);
      q("[data-v=pal]").innerHTML = `<div style="font-size:13px;color:var(--ink2)">passado (aconteceu)</div><div style="font:700 34px/1.2 Inter,system-ui,sans-serif">${e.pass}</div><div style="font-size:13px;color:var(--ink2);margin-top:12px">condicional (aconteceria, teria acontecido)</div><div style="font:700 34px/1.2 Inter,system-ui,sans-serif;color:${ver ? "var(--ink)" : "var(--ink3)"}">${ver ? e.cond : "?"}</div>`;
      q("[data-v=lt]").innerHTML = vis("verbo", v.ac + " · " + v.pt) + vis("contra a tabela da fonte", `${e.placar.ok} de ${e.placar.n}`);
      q("[data-v=st]").innerHTML = ver ? `O verbo fica igual ao passado, concordando em gênero e número; só entra a partícula бы. As fontes divergem sobre o lugar dela: uma diz "depois da palavra que marca o sujeito" (${e.cond}), outra diz que ela "costuma vir depois do verbo" (${e.pass} бы). As duas ordens aparecem nos exemplos. Tabela de comparação: condicional de сказать em Russian grammar (Wikipedia em inglês).` : "Diga a frase com бы e clique em \"mostrar\"."; };
    q("[data-v=w]").addEventListener("change", (ev) => poe(ev.target.value, k)); q("[data-v=k]").addEventListener("change", (ev) => poe(w, +ev.target.value)); q("[data-v=ver]").addEventListener("click", mostra); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => est().cond);
    SIM.ruCondLab._ult = { poe, mostra, est }; desenha(); };

  /* nome: "Ordem, convite, suposição ou hipótese?" · matéria: Russo · tema: RG17 */
  SIM.ruQueModo = (el, F) => { const T = [["imp", "ordem ou pedido a você(s)"], ["davai", "convite: vamos..."], ["pust", "que ele...; seja..."], ["cond", "hipótese (бы)"]], EXP = { imp: "imperativo de 2ª pessoa: a forma do verbo já é a ordem", davai: "давай (a uma pessoa) ou давайте (a várias, ou formal) mais infinitivo imperfectivo ou futuro perfectivo", pust: "пусть mais sujeito e verbo conjugado; em matemática, é o \"seja\" das hipóteses", cond: "passado mais бы (ou чтобы com passado): algo que não é fato" }; let r = rng(1), fila = [], x = null, clic = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${T.map(([k, n]) => `<button class="bt peq" data-t="${k}">${n}</button>`).join("")}</div><div class="bts"><button class="bt peq" data-v="prox">outra frase</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const prox = () => { if (!fila.length) fila = emb(SIM.RU.FRI, r); x = fila.pop(); clic = null; desenha(); };
    const clica = (t) => { if (clic !== null) return; clic = t; feitos++; if (t === x.tipo) certos++; desenha(); };
    const est = () => ({ ...x, clic, certos, feitos });
    const desenha = () => { el.querySelectorAll("[data-t]").forEach((b) => { b.setAttribute("aria-pressed", String(clic === b.dataset.t)); b.style.borderColor = clic === null ? "" : b.dataset.t === x.tipo ? "var(--ok)" : b.dataset.t === clic ? "var(--bad, #e06666)" : ""; });
      const n = [...x.ru].length; q("[data-v=pal]").innerHTML = `<div style="font:700 ${n > 34 ? 22 : 30}px/1.25 Inter,system-ui,sans-serif">${x.ru}</div><div style="font-size:14px;color:var(--ink2);margin-top:8px">${clic === null ? "a tradução aparece depois da resposta" : x.pt}</div>`;
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : clic === x.tipo ? "certo" : "ainda não") + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = clic === null ? "Procure a palavra que denuncia a construção: a forma do verbo, давай, пусть ou бы." : `<b>${T.find((t) => t[0] === x.tipo)[1]}</b>: ${EXP[x.tipo]}. Frase: exemplo de verbete do Wiktionary ou da Wikipedia em inglês.`; };
    el.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.t))); q("[data-v=prox]").addEventListener("click", prox); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => x.ru);
    SIM.ruQueModo._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, clica, prox, est }; prox(); };
})();
