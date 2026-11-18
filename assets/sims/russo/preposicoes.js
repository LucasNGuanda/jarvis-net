/* Russo · preposições e o caso que cada uma pede (RG15): laboratórios.
   Dados: SIM.RU.PREP (uso a uso: preposição, caso marcado na definição do Wiktionary em inglês, sentido e exemplo do verbete), SIM.RU.ONDE (exemplos
   dos verbetes para onde? / para onde? / de onde?) e SIM.RU.PARES_PREP (preposição + substantivo: combinação montada pelo site; a forma vem da tabela
   do substantivo). O caso de cada uso foi cruzado com as listas por caso de "Russian grammar" (Wikipedia). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const emb = (lista, r) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const CS = ["acc", "gen", "dat", "ins", "prep"], GRANDE = "font:700 46px/1.15 Inter,system-ui,sans-serif;letter-spacing:1px";
  const N = () => SIM.ruNomeCaso;
  /* preposições de um caso (sem repetir) e casos de uma preposição */
  SIM.ruPrepsDe = (caso) => [...new Set(SIM.RU.PREP.filter((x) => x.caso === caso).map((x) => x.p))];
  SIM.ruCasosDe = (p) => [...new Set(SIM.RU.PREP.filter((x) => x.p === p).map((x) => x.caso))];
  /* mapa mental: as preposições por caso (folhas de até 17 letras, para caber no desenho) */
  SIM.ruMapaPreps = () => ({ centro: "preposições", sub: "cada uma pede um caso", ramos: CS.map((c) => { const L = SIM.ruPrepsDe(c), f = []; let s = ""; L.forEach((w) => { if (s && (s + ", " + w).length > 17) { f.push({ rot: "", forma: s }); s = w; } else s = s ? s + ", " + w : w; }); if (s) f.push({ rot: "", forma: s }); return { nome: N()[c], sub: L.length + " preposições", folhas: f }; }) });

  /* nome: "Que caso esta preposição pede?" · matéria: Russo · tema: RG15 */
  SIM.ruPrepCaso = (el, F) => { let r = rng(1), fila = [], x = null, clic = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${CS.map((c) => `<button class="bt peq" data-c="${c}">${N()[c]}</button>`).join("")}<button class="bt peq" data-v="prox">outra</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const prox = () => { if (!fila.length) fila = emb(SIM.RU.PREP, r); x = fila.pop(); clic = null; desenha(); };
    const clica = (c) => { if (clic !== null) return; clic = c; feitos++; if (c === x.caso) certos++; desenha(); };
    const est = () => ({ ...x, clic, certos, feitos });
    const desenha = () => { el.querySelectorAll("[data-c]").forEach((b) => { b.setAttribute("aria-pressed", String(clic === b.dataset.c)); b.style.borderColor = clic === null ? "" : b.dataset.c === x.caso ? "var(--ok)" : b.dataset.c === clic ? "var(--bad, #e06666)" : ""; });
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${x.ac}</div><div style="font-size:14px;color:var(--ink2);margin-top:8px">no sentido de: <b>${x.pt}</b></div>`;
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : clic === x.caso ? "certo" : "ainda não") + vis("caso", clic === null ? "?" : N()[x.caso]) + vis("placar", `${certos} de ${feitos}`);
      const outros = SIM.ruCasosDe(x.p).filter((c) => c !== x.caso);
      q("[data-v=st]").innerHTML = clic === null ? "Algumas preposições pedem um caso só; outras mudam de caso conforme o sentido, e por isso o sentido aparece junto." : `<b>${x.ac}</b> (${x.pt}) pede o <b>${N()[x.caso]}</b>.${x.ex ? ` Exemplo do verbete: ${x.ex[0]} (${x.ex[1]}).` : ""}${outros.length ? ` Com outro sentido, a mesma preposição pede também: ${outros.map((c) => N()[c]).join(", ")}.` : ""} Fonte: definições do Wiktionary em inglês, que marcam o caso de cada sentido.`; };
    el.querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.c))); q("[data-v=prox]").addEventListener("click", prox);
    SIM.ruPrepCaso._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, clica, prox, est }; prox(); };

  /* nome: "Onde? Para onde? De onde?" · matéria: Russo · tema: RG15 */
  SIM.ruOnde = (el, F) => { const T = [["onde", "onde? (lugar)"], ["para", "para onde? (destino)"], ["de", "de onde? (origem)"]]; let r = rng(1), fila = [], x = null, clic = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${T.map(([k, n]) => `<button class="bt peq" data-t="${k}">${n}</button>`).join("")}<button class="bt peq" data-v="prox">outro exemplo</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const prox = () => { if (!fila.length) fila = emb(SIM.RU.ONDE, r); x = fila.pop(); clic = null; desenha(); };
    const clica = (t) => { if (clic !== null) return; clic = t; feitos++; if (t === x.perg) certos++; desenha(); };
    const est = () => ({ ...x, clic, certos, feitos });
    const desenha = () => { el.querySelectorAll("[data-t]").forEach((b) => { b.setAttribute("aria-pressed", String(clic === b.dataset.t)); b.style.borderColor = clic === null ? "" : b.dataset.t === x.perg ? "var(--ok)" : b.dataset.t === clic ? "var(--bad, #e06666)" : ""; });
      q("[data-v=pal]").innerHTML = `<div style="font:700 36px/1.2 Inter,system-ui,sans-serif">${x.ru}</div><div style="font-size:14px;color:var(--ink2);margin-top:8px">${clic === null ? "a tradução aparece depois da resposta" : x.pt}</div>`;
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : clic === x.perg ? "certo" : "ainda não") + vis("caso", clic === null ? "?" : N()[x.caso]) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = clic === null ? "Olhe a terminação do substantivo: é ela, e não a preposição, que diz se é lugar ou destino." : `${x.ru}: <b>${T.find((t) => t[0] === x.perg)[1]}</b>, com ${x.p} + ${N()[x.caso]}. Exemplo e caso: verbete de ${x.p} no Wiktionary em inglês.`; };
    el.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.t))); q("[data-v=prox]").addEventListener("click", prox); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => x.ru);
    SIM.ruOnde._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, clica, prox, est }; prox(); };

  /* nome: "Mapa mental: as preposições por caso" · matéria: Russo · tema: RG15 */
  SIM.ruMapaPrepLab = (el, F) => { let ver = true, visto = [];
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="esc">esconder e lembrar</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0;overflow-x:auto"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), mapa = () => SIM.ruMapaPreps(), nf = () => mapa().ramos.reduce((s, r) => s + r.folhas.length, 0);
    const esconde = () => { ver = !ver; visto = Array(nf()).fill(ver); desenha(); }, revela = (i) => { visto[i] = true; desenha(); };
    const est = () => ({ mapa: mapa(), folhas: nf(), vistas: visto.filter(Boolean).length, escondido: !ver });
    const desenha = () => { q("[data-v=esc]").textContent = ver ? "esconder e lembrar" : "mostrar tudo"; q("[data-v=pal]").innerHTML = SIM.ruMapaSvg(mapa(), visto).svg;
      q("[data-v=pal]").querySelectorAll("[data-folha]").forEach((g) => g.addEventListener("click", () => revela(+g.dataset.folha)));
      q("[data-v=st]").innerHTML = ver ? "Uma preposição aparece em mais de um ramo quando muda de caso conforme o sentido (в, на, с, за, под). O genitivo é o caso com mais preposições. Casos: definições do Wiktionary em inglês." : "Diga as preposições de cada caso em voz alta e clique nos pontos de interrogação para conferir."; };
    q("[data-v=esc]").addEventListener("click", esconde);
    SIM.ruMapaPrepLab._ult = { esconde, revela, est }; visto = Array(nf()).fill(true); desenha(); };
})();
