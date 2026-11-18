/* Russo · verbos de movimento (RG14): laboratórios.
   Dados: SIM.RU.MOV (pares uma direção / várias direções: a nota de uso do Wiktionary de cada verbo diz a direção e aponta para o outro, e o par está
   na tabela da Wikipedia), SIM.RU.PREF (prefixos: linha da tabela "Prefixed verbs of motion" da Wikipedia; pares dos verbetes) e SIM.RU.FRM (frases da
   seção "Verbs of motion" de Russian grammar, que vêm sem acento). Formas: tabelas do Wiktionary (SIM.RU.VERB). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const emb = (lista, r) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const NOME = { uni: "uma direção", multi: "várias direções", pf: "perfectivo (по-)" };
  SIM.ruNomeDir = NOME;
  /* direção de um verbo sem prefixo, pela tabela de pares */
  SIM.ruDirDe = (w) => { const m = SIM.RU.MOV.find((x) => x.uni === w || x.multi === w); return m ? (m.uni === w ? "uni" : "multi") : null; };
  /* mapa mental de um par de movimento: uma direção, várias direções e o perfectivo com по- */
  SIM.ruMapaMov = (m) => { const V = SIM.RU.VERB, a = V[m.uni], b = V[m.multi], c = m.pf ? V[m.pf] : null, f = (x) => (x && x.length ? x[0] : null);
    return { centro: a.ac + " / " + b.ac, sub: a.pt, ramos: [
      { nome: "uma direção", sub: a.ac + ": agora, para lá", folhas: [{ rot: "я", forma: f(a.pres[0]) }, { rot: "он", forma: f(a.pres[2]) }, { rot: "они", forma: f(a.pres[5]) }] },
      { nome: "uma direção: passado", sub: "estava indo", folhas: [{ rot: "он", forma: f(a.pass[0]) }, { rot: "она", forma: f(a.pass[1]) }] },
      { nome: "perfectivo по-", sub: c ? c.ac + ": partiu" : "sem dado", folhas: [{ rot: "он (passado)", forma: c ? f(c.pass[0]) : null }, { rot: "он (futuro)", forma: c ? f(c.pres[2]) : null }] },
      { nome: "várias direções", sub: b.ac + ": hábito, ida e volta", folhas: [{ rot: "я", forma: f(b.pres[0]) }, { rot: "он", forma: f(b.pres[2]) }, { rot: "они", forma: f(b.pres[5]) }] },
      { nome: "várias: passado", sub: "foi e voltou; ia sempre", folhas: [{ rot: "он", forma: f(b.pass[0]) }, { rot: "она", forma: f(b.pass[1]) }] }] }; };

  /* nome: "Uma direção ou várias? Leia a frase" · matéria: Russo · tema: RG14 */
  SIM.ruUmaOuVarias = (el, F) => { const T = ["uni", "multi", "pf"]; let r = rng(1), fila = [], x = null, clic = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${T.map((t) => `<button class="bt peq" data-t="${t}">${NOME[t]}</button>`).join("")}<button class="bt peq" data-v="prox">outra frase</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const prox = () => { if (!fila.length) fila = emb(SIM.RU.FRM, r); x = fila.pop(); clic = null; desenha(); };
    const clica = (t) => { if (clic !== null) return; clic = t; feitos++; if (t === x.tipo) certos++; desenha(); };
    const est = () => ({ ...x, clic, certos, feitos });
    const desenha = () => { const v = SIM.RU.VERB[x.inf]; el.querySelectorAll("[data-t]").forEach((b) => { b.setAttribute("aria-pressed", String(clic === b.dataset.t)); b.style.borderColor = clic === null ? "" : b.dataset.t === x.tipo ? "var(--ok)" : b.dataset.t === clic ? "var(--bad, #e06666)" : ""; });
      q("[data-v=pal]").innerHTML = `<div style="font:700 30px/1.25 Inter,system-ui,sans-serif">${x.ru.split(" ").map((w) => (w.replace(/[.,?]/g, "") === x.forma ? `<span style="color:var(--mod)">${w}</span>` : w)).join(" ")}</div><div style="font-size:14px;color:var(--ink2);margin-top:8px">${x.pt}</div>`;
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : clic === x.tipo ? "certo" : "ainda não") + vis("verbo", clic === null ? "?" : v.ac) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = clic === null ? "O verbo em destaque é de uma direção, de várias direções, ou um perfectivo com по-? A tradução ajuda: repare se o movimento está em curso, se é hábito, ou se houve ida e volta." : `${x.forma} é forma de <b>${v.ac}</b> (${v.pt}): <b>${NOME[x.tipo]}</b>. Uso, segundo a fonte: ${x.uso}. Frase e explicação: seção "Verbs of motion" de Russian grammar (Wikipedia em inglês), que escreve os exemplos sem acento.`; };
    el.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.t))); q("[data-v=prox]").addEventListener("click", prox); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => x.ru);
    SIM.ruUmaOuVarias._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, clica, prox, est }; prox(); };

  /* nome: "Mapa do par de movimento: uma direção, várias e o perfectivo" · matéria: Russo · tema: RG14 */
  SIM.ruMapaMovLab = (el, F) => { const L = SIM.RU.MOV; let k = 0, ver = true, visto = [];
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">par</p><div class="bts"><select data-v="sel" class="bt peq" style="font-size:15px;padding:5px 8px">${L.map((m, i) => `<option value="${i}">${m.uni} / ${m.multi}</option>`).join("")}</select><button class="bt peq" data-v="prox">próximo</button><button class="bt peq" data-v="esc">esconder e lembrar</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0;overflow-x:auto"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), mapa = () => SIM.ruMapaMov(L[k]), nf = () => mapa().ramos.reduce((s, r) => s + r.folhas.length, 0);
    const poe = (i) => { k = i; visto = Array(nf()).fill(ver); desenha(); };
    const esconde = () => { ver = !ver; visto = Array(nf()).fill(ver); desenha(); };
    const revela = (i) => { visto[i] = true; desenha(); };
    const est = () => ({ par: L[k], mapa: mapa(), folhas: nf(), vistas: visto.filter(Boolean).length, total: L.length, escondido: !ver });
    const desenha = () => { const m = L[k], V = SIM.RU.VERB; q("[data-v=sel]").value = String(k); q("[data-v=esc]").textContent = ver ? "esconder e lembrar" : "mostrar tudo"; q("[data-v=pal]").innerHTML = SIM.ruMapaSvg(mapa(), visto).svg;
      q("[data-v=pal]").querySelectorAll("[data-folha]").forEach((g) => g.addEventListener("click", () => revela(+g.dataset.folha)));
      q("[data-v=lt]").innerHTML = vis("sentido", V[m.uni].pt) + vis("formas à vista", `${visto.filter(Boolean).length} de ${nf()}`);
      q("[data-v=st]").innerHTML = ver ? `Os dois verbos são imperfectivos e querem dizer a mesma coisa; muda o jeito de ver o movimento. O perfectivo é o que o verbete de ${V[m.uni].ac} indica. Formas: tabelas do Wiktionary em inglês.` : "Diga a forma em voz alta e clique no ponto de interrogação para conferir."; };
    q("[data-v=sel]").addEventListener("change", (ev) => poe(+ev.target.value)); q("[data-v=prox]").addEventListener("click", () => poe((k + 1) % L.length)); q("[data-v=esc]").addEventListener("click", esconde);
    SIM.ruMapaMovLab._ult = { poe, esconde, revela, est }; poe(0); };

  /* nome: "Prefixo e direção: o que cada prefixo faz" · matéria: Russo · tema: RG14 */
  SIM.ruPrefixos = (el, F) => { const L = SIM.RU.PREF; let k = 0, ver = false;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">prefixo</p><div class="bts">${L.map((p, i) => `<button class="bt peq" data-p="${i}" style="font-size:16px">${p.pre}</button>`).join("")}<button class="bt peq" data-v="ver">mostrar o sentido</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:14px 10px"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), V = SIM.RU.VERB;
    const poe = (i) => { k = i; ver = false; desenha(); }, mostra = () => { ver = true; desenha(); }, est = () => ({ ...L[k], ver });
    const desenha = () => { const p = L[k]; el.querySelectorAll("[data-p]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.p === k)));
      q("[data-v=pal]").innerHTML = `<div style="font:700 26px/1.3 Inter,system-ui,sans-serif">${p.ru}</div><div style="font-size:14px;color:var(--ink2);margin-top:6px">${ver ? p.frPt : "?"}</div><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px">${p.pares.map(([pf, impf]) => `<div style="border:1.5px solid var(--line);border-radius:10px;padding:8px 14px;background:var(--card2)"><div style="font:600 19px Inter,system-ui,sans-serif">${V[pf].ac}${impf ? " / " + V[impf].ac : ""}</div><div style="font-size:12.5px;color:var(--ink2)">${ver ? V[pf].pt : "?"} · ${impf ? "perfectivo / imperfectivo" : "perfectivo"}</div></div>`).join("")}</div>`;
      q("[data-v=st]").innerHTML = ver ? `<b>${p.pre}</b> ${p.pt}. Preposições que a tabela da fonte dá para esse prefixo: ${p.prep || "nenhuma indicada"} (acc. = acusativo, gen. = genitivo, dat. = dativo). Sentido, frase e preposições: tabela "Prefixed verbs of motion" de Russian grammar (Wikipedia em inglês); pares: verbetes do Wiktionary.` : "Leia a frase e os verbos e tente dizer o que o prefixo acrescenta. Depois clique em \"mostrar o sentido\"."; };
    el.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => poe(+b.dataset.p))); q("[data-v=ver]").addEventListener("click", mostra);
    SIM.ruPrefixos._ult = { poe, mostra, est }; desenha(); };
})();
