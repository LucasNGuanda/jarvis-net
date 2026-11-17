/* Russo · laboratórios dos temas RG01 (alfabeto) e RG02 (ortografia e acento).
   Todos os dados (letras, nomes, sons, transliteração, palavras, acento, tradução) vêm de SIM.RU, em assets/sims/russo/dados.js,
   que é GERADO por tools/russo/gera-russo.py a partir de tools/russo/dadosR.json (valor, fonte e trecho de cada dado). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const GRUPO = { amiga: ["amigas", "var(--ok)", "mesma forma e mesmo som de uma letra latina"], falsa: ["falsas amigas", "var(--warn)", "forma de letra latina, som de outra"], nova: ["novas", "var(--mod)", "forma que o alfabeto latino não tem"] };
  const TIPO = { vogal: "vogal", consoante: "consoante", semivogal: "semivogal", sinal: "sinal (sem som próprio)" };
  const DM = { "Hard": "dura", "Soft": "mole", "Always hard": "sempre dura", "Always soft": "sempre mole", "Either hard (default) or soft": "dura ou mole" };
  SIM.ruGrupo = GRUPO; SIM.ruLetra = (l) => SIM.RU.ALF.find((x) => x.M === l || x.m === l);
  /* palavra com uma letra destacada (todas as ocorrências, maiúscula ou minúscula) */
  SIM.ruDestaca = (pal, letra) => [...pal].map((c) => (c.toLowerCase() === letra.toLowerCase() ? `<b style="color:var(--mod)">${c}</b>` : c)).join("");

  /* nome: "As 33 letras: clique e conheça" · matéria: Russo · tema: RG01 */
  SIM.ruAlfabeto = (el, F) => { const A = SIM.RU.ALF; let sel = "А", filtro = "todas";
    const FILT = [["todas", "todas"], ["amiga", "amigas"], ["falsa", "falsas amigas"], ["nova", "novas"], ["vogal", "vogais"], ["consoante", "consoantes"], ["sinal", "sinais"]];
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">destacar</p><div class="bts">${botoes(FILT, "f", filtro)}</div></div></div>
      <div style="display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start;padding:10px 0"><div data-v="grade" style="display:grid;grid-template-columns:repeat(7,58px);gap:6px"></div><div data-v="ficha" style="flex:1;min-width:300px"></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), passa = (l) => filtro === "todas" || l.grupo === filtro || l.tipo === filtro || (filtro === "consoante" && l.tipo === "semivogal");
    const est = () => { const l = SIM.ruLetra(sel); return { ...l, filtro, acesas: A.filter(passa).map((x) => x.M) }; };
    const desenha = () => { const l = SIM.ruLetra(sel);
      q("[data-v=grade]").innerHTML = A.map((x) => { const g = GRUPO[x.grupo], on = passa(x); return `<button type="button" data-l="${x.M}" title="${x.M} ${x.m}" aria-pressed="${x.M === sel}" style="height:52px;border-radius:9px;cursor:pointer;font:600 21px Inter,system-ui,sans-serif;color:var(--ink);background:${x.M === sel ? "color-mix(in srgb," + g[1] + " 30%,var(--card2))" : "var(--card2)"};border:2px solid ${on ? g[1] : "var(--line)"};opacity:${on ? 1 : 0.32}">${x.M}<span style="font-weight:400;margin-left:3px">${x.m}</span></button>`; }).join("");
      q("[data-v=grade]").querySelectorAll("[data-l]").forEach((b) => b.addEventListener("click", () => { sel = b.dataset.l; desenha(); }));
      const g = GRUPO[l.grupo];
      q("[data-v=ficha]").innerHTML = `<div style="display:flex;gap:16px;align-items:center;margin-bottom:8px"><div style="font:700 78px/1 Inter,system-ui,sans-serif;color:${g[1]}">${l.M}<span style="font-weight:400;font-size:64px;margin-left:8px">${l.m}</span></div><div><div style="font-size:13px;color:var(--ink2)">letra ${l.n} de 33</div><div style="font-weight:700;color:${g[1]}">${g[0].replace(/s$/, "").replace("falsas amiga", "falsa amiga")}</div><div style="font-size:13px;color:var(--ink2)">${g[2]}</div></div></div>
        <div class="leitor">${vis("nome da letra", l.nome + (l.nomeTr ? " (" + l.nomeTr + ")" : ""))}${vis("som (AFI)", l.ipa)}${vis("transliteração", l.trs)}${vis("tipo", TIPO[l.tipo])}${l.dm ? vis("dura ou mole", DM[l.dm] || l.dm) : ""}</div>
        ${l.ex ? `<p style="margin:10px 0 0">Exemplo da tabela: <span style="font-size:22px;font-weight:600">${SIM.ruDestaca(l.ex.ru, l.m)}</span> <span style="color:var(--ink2)">(${l.ex.tr})</span> = ${l.ex.pt}</p>` : ""}`;
      q("[data-v=st]").innerHTML = `Borda <b style="color:var(--ok)">verde</b>: letra amiga. Borda <b style="color:var(--warn)">amarela</b>: falsa amiga. Borda na cor do módulo: letra nova. A divisão em três grupos compara a forma da letra de imprensa com as letras latinas e é só um apoio de memória; nome, som, transliteração e exemplo vêm da tabela "Letters" da Wikipedia em inglês ("Russian alphabet"). O som entre colchetes está no Alfabeto Fonético Internacional.`; };
    liga(el, "f", (v) => { filtro = v; desenha(); });
    SIM.ruAlfabeto._ult = { poe: (l, f) => { sel = SIM.ruLetra(l).M; if (f) { filtro = f; el.querySelectorAll("[data-f]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === f))); } desenha(); }, est }; desenha(); };

  /* nome: "Leia a palavra antes de ver a resposta" · matéria: Russo · tema: RG01 */
  SIM.ruLeitura = (el, F) => { const NIV = [["cognatas", "parecidas com o português"], ["curtas", "curtas do dia a dia"], ["todas", "todas"]]; let niv = "cognatas", r = rng(1), fila = [], atual = null, verTr = false, verPt = false, vistas = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">palavras</p><div class="bts">${botoes(NIV, "n", niv)}</div></div>
      <div><div class="bts"><button class="bt peq" data-v="tr" aria-pressed="false">mostrar a leitura</button><button class="bt peq" data-v="pt" aria-pressed="false">mostrar a tradução</button><button class="bt peq" data-v="prox">próxima palavra</button></div></div></div>
      <div class="palco" data-v="pal" style="text-align:center;padding:22px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), lista = () => SIM.RU.LISTA[niv];
    const enche = () => { fila = lista().slice(); for (let i = fila.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [fila[i], fila[j]] = [fila[j], fila[i]]; } if (atual && fila.length > 1 && fila[fila.length - 1] === atual) fila.unshift(fila.pop()); };
    const prox = () => { if (!fila.length) enche(); atual = fila.pop(); verTr = verPt = false; vistas++; desenha(); };
    const est = () => { const p = SIM.RU.PAL[atual]; return { palavra: atual, ...p, verTr, verPt, vistas, niv, n: lista().length }; };
    const desenha = () => { const p = SIM.RU.PAL[atual]; q("[data-v=tr]").setAttribute("aria-pressed", String(verTr)); q("[data-v=pt]").setAttribute("aria-pressed", String(verPt));
      q("[data-v=pal]").innerHTML = `<div style="font:700 64px/1.1 Inter,system-ui,sans-serif;letter-spacing:2px">${verTr ? p.ac : atual}</div><div style="margin-top:8px;font-size:13px;color:var(--ink2)">${[...atual].length} letras${verTr ? " · o acento marca a sílaba tônica (na escrita comum ele não aparece)" : ""}</div>`;
      q("[data-v=lt]").innerHTML = vis("leitura (transliteração)", verTr ? p.tr : "?") + vis("pronúncia (AFI)", verTr ? p.ipa || "sem dado" : "?") + vis("tradução", verPt ? p.pt : "?") + vis("classe", verPt ? p.cl : "?");
      q("[data-v=st]").innerHTML = !verTr && !verPt ? "Leia em voz alta, letra por letra, e só depois clique em mostrar. Onde você acha que cai a sílaba forte?" : `Acento, transliteração e pronúncia: verbete "${atual}" do Wiktionary em inglês. A tradução para o português foi feita a partir da definição em inglês do verbete${verPt && p.en ? ` (<i>${p.en}</i>)` : ""}.`; };
    liga(el, "n", (v) => { niv = v; fila = []; prox(); });
    q("[data-v=tr]").addEventListener("click", () => { verTr = !verTr; desenha(); }); q("[data-v=pt]").addEventListener("click", () => { verPt = !verPt; desenha(); }); q("[data-v=prox]").addEventListener("click", prox);
    SIM.ruLeitura._ult = { semente: (n) => { r = rng(n); fila = []; atual = null; vistas = 0; prox(); }, prox, mostra: (a = true, b = true) => { verTr = a; verPt = b; desenha(); }, nivel: (v) => { niv = v; el.querySelectorAll("[data-n]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.n === v))); fila = []; prox(); }, est }; prox(); };
})();
