/* Russo · aspecto verbal (RG13): laboratórios.
   Dados: SIM.RU.VERB (aspecto, par e tabelas de cada verbo) e SIM.RU.PARES_ASP (pares em que um verbete do Wiktionary aponta para o outro).
   O "tipo de formação" do par (SIM.ruTipoPar) é calculado comparando as letras dos dois infinitivos; não é dado de fonte, e a tela diz isso. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const emb = (lista, r) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const AC = "́", sem = (s) => String(s).split(AC).join(""), GRANDE = "font:700 46px/1.15 Inter,system-ui,sans-serif;letter-spacing:1px";
  /* como o perfectivo se relaciona, nas letras, com o imperfectivo */
  SIM.ruTipoPar = (impf, pf) => (pf.endsWith(impf) && pf.length > impf.length ? { t: "prefixo", nome: "o perfectivo é o imperfectivo com um prefixo na frente (" + pf.slice(0, pf.length - impf.length) + "-)" } : { t: "outro", nome: "os dois verbos diferem no radical, no sufixo ou vêm de raízes diferentes (não é só um prefixo a mais)" });
  /* as formas de um verbo com o tempo de cada uma: presente só existe no imperfectivo */
  SIM.ruTempos = (w) => { const v = SIM.RU.VERB[w], o = []; v.pres.forEach((f, i) => o.push({ w, forma: f[0], tempo: v.asp === "impf" ? "presente" : "futuro", i })); v.pass.forEach((f, i) => { if (f.length) o.push({ w, forma: f[0], tempo: "passado", i }); }); if (v.fut) v.fut.forEach((f, i) => o.push({ w, forma: f[0], tempo: "futuro", i })); return o; };
  SIM.ruVerbosAsp = () => { const s = new Set(); SIM.RU.PARES_ASP.forEach(([a, b]) => { s.add(a); s.add(b); }); return [...s]; };
  /* mapa mental de um par: o que cada aspecto tem */
  SIM.ruMapaPar = (impf, pf) => { const a = SIM.RU.VERB[impf], b = SIM.RU.VERB[pf], f = (x) => x[0];
    return { centro: a.ac + " / " + b.ac, sub: a.pt, ramos: [
      { nome: "imperf.: presente", sub: "ação em andamento", folhas: [{ rot: "я", forma: f(a.pres[0]) }, { rot: "он", forma: f(a.pres[2]) }] },
      { nome: "imperf.: passado", sub: "processo, repetição", folhas: [{ rot: "он", forma: f(a.pass[0]) }, { rot: "она", forma: f(a.pass[1]) }] },
      { nome: "imperf.: futuro", sub: "буду + infinitivo", folhas: [{ rot: "я", forma: a.fut ? f(a.fut[0]) : null }, { rot: "он", forma: a.fut ? f(a.fut[2]) : null }] },
      { nome: "perf.: presente", sub: "não existe", folhas: [{ rot: "", forma: "—" }] },
      { nome: "perf.: passado", sub: "ação concluída", folhas: [{ rot: "он", forma: f(b.pass[0]) }, { rot: "она", forma: f(b.pass[1]) }] },
      { nome: "perf.: futuro", sub: "terminações de pessoa", folhas: [{ rot: "я", forma: f(b.pres[0]) }, { rot: "он", forma: f(b.pres[2]) }] }] }; };

  /* nome: "Que tempo é esta forma? O aspecto decide" · matéria: Russo · tema: RG13 */
  SIM.ruQueTempo = (el, F) => { const T = ["presente", "passado", "futuro"]; let r = rng(1), fila = [], x = null, clic = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${T.map((t) => `<button class="bt peq" data-t="${t}">${t}</button>`).join("")}<button class="bt peq" data-v="prox">outra forma</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), base = () => SIM.ruVerbosAsp().flatMap((w) => SIM.ruTempos(w));
    const prox = () => { if (!fila.length) fila = emb(base(), r); x = fila.pop(); clic = null; desenha(); };
    const clica = (t) => { if (clic !== null) return; clic = t; feitos++; if (t === x.tempo) certos++; desenha(); };
    const est = () => ({ ...x, asp: SIM.RU.VERB[x.w].asp, clic, certos, feitos });
    const desenha = () => { const v = SIM.RU.VERB[x.w]; el.querySelectorAll("[data-t]").forEach((b) => { b.setAttribute("aria-pressed", String(clic === b.dataset.t)); b.style.borderColor = clic === null ? "" : b.dataset.t === x.tempo ? "var(--ok)" : b.dataset.t === clic ? "var(--bad, #e06666)" : ""; });
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${x.forma}</div><div style="font-size:13px;color:var(--ink2);margin-top:8px">do verbo ${v.ac} (${v.pt}), que é <b>${v.asp === "pf" ? "perfectivo" : "imperfectivo"}</b></div>`;
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : clic === x.tempo ? "certo" : "ainda não") + vis("tempo", clic === null ? "?" : x.tempo) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = clic === null ? "Uma forma com terminação de pessoa (-ю, -ешь, -ет...) é presente se o verbo for imperfectivo, e futuro se for perfectivo. Olhe o aspecto antes de responder." : `${x.forma}: <b>${x.tempo}</b>. ${x.tempo === "futuro" && v.asp === "pf" ? "O verbo é perfectivo: não tem presente, e as terminações de pessoa dão o futuro." : x.tempo === "futuro" ? "Futuro composto: forma de быть mais o infinitivo, só nos imperfectivos." : x.tempo === "presente" ? "O verbo é imperfectivo: as terminações de pessoa dão o presente." : "Passado: as marcas -л, -ла, -ло, -ли valem para os dois aspectos."} Formas: tabela de conjugação do Wiktionary em inglês.`; };
    el.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.t))); q("[data-v=prox]").addEventListener("click", prox); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => x.forma);
    SIM.ruQueTempo._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, clica, prox, est }; prox(); };

  /* nome: "Jogo de pares: imperfectivo e perfectivo" · matéria: Russo · tema: RG13, RG14 */
  SIM.ruParesAsp = (el, F, op = {}) => { const P = op.pares || SIM.RU.PARES_ASP, N = Math.min(6, P.length), ROT = op.rot || ["imperfectivo", "perfectivo"]; let r = rng(1), esq = [], dir = [], selE = null, selD = null, feitos = new Set(), tent = 0, erro = null;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="novo">novos pares</button></div></div></div><div data-v="mesa" style="display:grid;grid-template-columns:1fr 1fr;gap:8px 28px;max-width:620px;margin:10px auto"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), V = SIM.RU.VERB;
    const novo = () => { const ps = emb(P, r).slice(0, N); esq = ps.map((p) => p[0]); dir = emb(ps.map((p) => p[1]), r); selE = selD = null; feitos = new Set(); tent = 0; erro = null; desenha(); };
    const parDe = (impf) => P.find((p) => p[0] === impf)[1];
    const tenta = () => { if (selE === null || selD === null) return; tent++; if (parDe(esq[selE]) === dir[selD]) { feitos.add(esq[selE]); erro = null; } else erro = [selE, selD]; selE = selD = null; };
    const clica = (lado, i) => { if (lado === "e") { if (feitos.has(esq[i])) return; selE = i; } else { if ([...feitos].some((k) => parDe(k) === dir[i])) return; selD = i; } erro = null; tenta(); desenha(); };
    const est = () => ({ esq: esq.slice(), dir: dir.slice(), feitos: feitos.size, tent, fim: feitos.size === N, erro, certoDe: esq.map(parDe) });
    const carta = (lado, i, txt, ok) => { const sel = (lado === "e" ? selE : selD) === i, ruim = erro && erro[lado === "e" ? 0 : 1] === i; return `<button type="button" data-c="${lado}${i}" ${ok ? "disabled" : ""} style="padding:9px 10px;border-radius:9px;cursor:${ok ? "default" : "pointer"};font:600 20px Inter,system-ui,sans-serif;color:var(--ink);background:${ok ? "color-mix(in srgb,var(--ok) 18%,var(--card2))" : "var(--card2)"};border:2px solid ${ok ? "var(--ok)" : ruim ? "var(--bad, #e06666)" : sel ? "var(--mod)" : "var(--line)"};opacity:${ok ? 0.75 : 1}">${txt}</button>`; };
    const desenha = () => { q("[data-v=mesa]").innerHTML = `<div style="font-size:12.5px;color:var(--ink2);text-align:center">${ROT[0]}</div><div style="font-size:12.5px;color:var(--ink2);text-align:center">${ROT[1]}</div>` + esq.map((k, i) => carta("e", i, V[k].ac, feitos.has(k)) + carta("d", i, V[dir[i]].ac, [...feitos].some((z) => parDe(z) === dir[i]))).join("");
      q("[data-v=mesa]").querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.c[0], +b.dataset.c.slice(1))));
      q("[data-v=lt]").innerHTML = vis("pares certos", `${feitos.size} de ${N}`) + vis("tentativas", tent);
      q("[data-v=st]").innerHTML = feitos.size === N ? `Fechou os ${N} pares em ${tent} tentativas. Sentidos: ${esq.map((k) => V[k].ac + " (" + V[k].pt + ")").join(", ")}.` : (op.ajuda || "Clique num imperfectivo e depois no perfectivo que faz par com ele. Os pares são os que o dicionário indica (um verbete aponta para o outro)."); };
    q("[data-v=novo]").addEventListener("click", novo);
    SIM.ruParesAsp._ult = { semente: (n) => { r = rng(n); novo(); }, clica, est }; novo(); };

  /* nome: "Mapa do par: o que cada aspecto tem" · matéria: Russo · tema: RG13 */
  SIM.ruMapaParLab = (el, F) => { const L = SIM.RU.PARES_ASP; let k = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">par</p><div class="bts"><select data-v="sel" class="bt peq" style="font-size:15px;padding:5px 8px">${L.map((p, i) => `<option value="${i}">${p[0]} / ${p[1]}</option>`).join("")}</select><button class="bt peq" data-v="ant">anterior</button><button class="bt peq" data-v="prox">próximo</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0;overflow-x:auto"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => ({ par: L[k], tipo: SIM.ruTipoPar(L[k][0], L[k][1]), mapa: SIM.ruMapaPar(L[k][0], L[k][1]), total: L.length });
    const desenha = () => { const e = est(); q("[data-v=sel]").value = String(k); q("[data-v=pal]").innerHTML = SIM.ruMapaSvg(e.mapa, Array(20).fill(true)).svg;
      q("[data-v=st]").innerHTML = `Formação deste par, pelas letras: <b>${e.tipo.nome}</b> (classificação calculada pelo site comparando os dois infinitivos; não vem do dicionário). O imperfectivo tem os três tempos; o perfectivo não tem presente. Formas e pares: verbetes do Wiktionary em inglês.`; };
    q("[data-v=sel]").addEventListener("change", (ev) => { k = +ev.target.value; desenha(); }); q("[data-v=ant]").addEventListener("click", () => { k = (k + L.length - 1) % L.length; desenha(); }); q("[data-v=prox]").addEventListener("click", () => { k = (k + 1) % L.length; desenha(); });
    SIM.ruMapaParLab._ult = { poe: (i) => { k = i; desenha(); }, est }; desenha(); };
})();
