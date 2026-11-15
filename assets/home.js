/* Tela inicial do projeto (rota #/home): título, ilustração girando, um botão por matéria (lidos de assets/materias.js)
   e o campo de pergunta (β 4.2: busca do Jarvis, sem IA, em assets/jarvis-busca.js; sem o código fica "em breve"). Não mexe em nada do site de física: o botão Física só leva para #/inicio. */
(function () {
  "use strict";
  const J = (window.JARVIS = {});
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const ICONE = {
    atomo: `<svg viewBox="0 0 32 32" fill="none" stroke-width="1.6" aria-hidden="true"><ellipse cx="16" cy="16" rx="13" ry="5" style="stroke:var(--mC)"/><ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(60 16 16)" style="stroke:var(--mA)"/><ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(120 16 16)" style="stroke:var(--mU)"/><circle cx="16" cy="16" r="2.4" fill="currentColor"/></svg>`,
    frasco: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 4h8M13.5 4v8L6 25.5A2 2 0 0 0 7.8 28.5h16.4a2 2 0 0 0 1.8-3L18.5 12V4"/><path d="M9.5 20h13" style="stroke:var(--mN)"/><circle cx="14" cy="23.5" r="1.3" style="fill:var(--mN);stroke:none"/><circle cx="18.5" cy="24.5" r="1" style="fill:var(--mN);stroke:none"/></svg>`,
    integral: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M19.5 4.5c-2 0-2.6 1.8-2.9 4L14.4 23.5c-.3 2.2-.9 4-2.9 4" style="stroke:var(--mK2)" stroke-width="2.2" stroke-linecap="round"/><path d="M21 13l6 6M27 13l-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    /* β 4.2: portão de Brandemburgo com a quadriga (de frente) e ॐ dentro do lótus aberto; traço luminoso como o átomo */
    portao: `<svg viewBox="0 0 32 32" fill="none" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true" style="filter:drop-shadow(0 0 1.4px var(--mDE))"><path d="M3.5 28.5h25M5 14h22M5.5 12h21l-1.2-2.3H6.7z" style="stroke:var(--mDE)" stroke-width="1.3"/><path d="M7 14v14.5M10.5 14v14.5M14 14v14.5M18 14v14.5M21.5 14v14.5M25 14v14.5" style="stroke:currentColor" stroke-width="1.25"/><path d="M11.2 9.7V7.4M13.2 9.7V7.4M18.8 9.7V7.4M20.8 9.7V7.4" style="stroke:var(--mDE)" stroke-width="1.3"/><circle cx="11.2" cy="6.6" r=".85" style="fill:var(--mDE)"/><circle cx="13.2" cy="6.6" r=".85" style="fill:var(--mDE)"/><circle cx="18.8" cy="6.6" r=".85" style="fill:var(--mDE)"/><circle cx="20.8" cy="6.6" r=".85" style="fill:var(--mDE)"/><path d="M14.6 9.7L16 6.2l1.4 3.5M16 6.2V2.4M14.6 3.4h2.8" style="stroke:var(--mDE)" stroke-width="1.1"/><circle cx="16" cy="1.9" r=".75" style="stroke:var(--mDE)" stroke-width=".9"/></svg>`,
    om: `<svg viewBox="0 0 32 32" fill="none" stroke-linejoin="round" aria-hidden="true" style="filter:drop-shadow(0 0 1.4px var(--mSA))"><g style="stroke:var(--mSA);fill:color-mix(in srgb,var(--mSA) 10%,transparent)" stroke-width="1.15"><path d="M16 29.5C5.5 29 1.6 23.5 1.2 16.8C7 18 12.8 22 16 29.5Z"/><path d="M16 29.5C26.5 29 30.4 23.5 30.8 16.8C25 18 19.2 22 16 29.5Z"/><path d="M16 29.5C7.4 26.6 4.6 18.6 6.2 9.6C11.4 12.8 15.2 19.6 16 29.5Z"/><path d="M16 29.5C24.6 26.6 27.4 18.6 25.8 9.6C20.6 12.8 16.8 19.6 16 29.5Z"/><path d="M16 29.5C10.2 23.6 10.2 11.4 16 3.6C21.8 11.4 21.8 23.6 16 29.5Z"/></g><text x="16" y="23.2" text-anchor="middle" style="font:700 13px 'Noto Sans Devanagari','Nirmala UI','Mangal',sans-serif;fill:currentColor;stroke:var(--card);stroke-width:2.2px;paint-order:stroke">ॐ</text></svg>`,
    cirilico: `<svg viewBox="0 0 32 32" aria-hidden="true"><text x="16" y="23" text-anchor="middle" style="font:700 19px var(--f-text);fill:currentColor">Я</text><path d="M6 27h20" style="stroke:var(--mR)" stroke-width="2" stroke-linecap="round"/></svg>`,
  };
  /* figura central (β 3.9): o desenho escolhido no painel da engrenagem, com cor e velocidade. Cadastro em assets/figuras.js.
     Guardada em jarvis:figura = { id, hue (null = acompanha a cor do tema), vel (0 = parado … 2) }; entra no exportar/importar. */
  const CHAVE_FIG = "jarvis:figura";
  const lerFig = () => { try { const o = JSON.parse(localStorage.getItem(CHAVE_FIG)); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } };
  J.figuraCfg = () => { const o = window.ACESSO && !window.ACESSO.engrenagem("figura") ? {} : lerFig(), F = window.FIGURAS; /* sem acesso: a figura padrão */
    let id = F ? F.porId(o.id).id : "planeta"; if (window.ACESSO && !window.ACESSO.figura(id)) id = "planeta"; /* β 4.3: o buraco negro é só do ADM (salvo antes por um ADM que voltou a visitante → planeta) */
    return { id, hue: typeof o.hue === "number" ? o.hue : null, vel: typeof o.vel === "number" ? Math.max(0, Math.min(2, o.vel)) : 1 }; };
  const tons = (h) => [`hsl(${h - 12}, 85%, 66%)`, `hsl(${h}, 80%, 60%)`, `hsl(${h + 14}, 88%, 56%)`]; /* os mesmos três tons do título */
  J.corFigura = (el, hue) => { if (hue === null) ["--fg1", "--fg2", "--fg3", "--fg-hue"].forEach((v) => el.style.removeProperty(v)); else { tons(hue).forEach((c, k) => el.style.setProperty(`--fg${k + 1}`, c)); el.style.setProperty("--fg-hue", hue); } }; /* --fg-hue: o buraco negro (cores fixas) gira o matiz */
  let est = null, velAtual = 1;
  const reduz = () => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  function laco(agora) {
    const e = est; if (!e || !e.sv.isConnected) { est = null; return; }
    const dt = e.ult == null ? 0 : Math.min(0.1, (agora - e.ult) / 1000); e.ult = agora; e.t += dt * velAtual; e.fig.quadro(e.sv, e.t);
    if (velAtual > 0 && !reduz()) requestAnimationFrame(laco); else e.rodando = false; /* parado: desenha uma vez e desliga o laço */
  }
  const liga = () => { if (est && !est.rodando) { est.rodando = true; est.ult = null; requestAnimationFrame(laco); } };
  J.desenhaFigura = (ilu) => {
    if (!ilu || !window.FIGURAS) return;
    const cfg = J.figuraCfg(), fig = window.FIGURAS.porId(cfg.id);
    ilu.innerHTML = fig.svg("c"); J.corFigura(ilu, cfg.hue); velAtual = cfg.vel;
    est = { sv: ilu.querySelector("svg"), fig, t: est && est.fig === fig ? est.t : 2, ult: null, rodando: false };
    fig.quadro(est.sv, est.t); liga();
  };
  /* muda a escolha (só o que vier em parcial) e aplica na hora */
  J.figura = (parcial) => {
    const atual = J.figuraCfg(), novo = Object.assign({}, atual, parcial);
    try { localStorage.setItem(CHAVE_FIG, JSON.stringify(novo)); } catch (e) {}
    const ilu = document.querySelector(".jv-ilu"); if (!ilu) return novo;
    if (novo.id !== atual.id) J.desenhaFigura(ilu);
    if (novo.hue !== atual.hue) J.corFigura(ilu, novo.hue);
    if (novo.vel !== atual.vel) { velAtual = novo.vel; if (est) est.fig.quadro(est.sv, est.t); liga(); }
    return novo;
  };

  /* cor do Jarvis: o título e o planeta mudam juntos. Guardada em jarvis:cor (docs/MODELO_DE_DADOS.md, seção 5). */
  const CHAVE_COR = "jarvis:cor", MATIZ_MAX = 285; /* 0 = vermelho … 285 = lilás */
  /* β 4.3: além do número (matiz), jarvis:cor pode valer "dourado" (efeito exclusivo do ADM; para os outros vale a cor original) */
  const lerCor = () => { try { const v = JSON.parse(localStorage.getItem(CHAVE_COR)); return typeof v === "number" ? v : v === "dourado" && window.ACESSO && window.ACESSO.tituloDourado() ? "dourado" : null; } catch (e) { return null; } };
  const gravarCor = (h) => { try { if (h === null) localStorage.removeItem(CHAVE_COR); else localStorage.setItem(CHAVE_COR, JSON.stringify(h)); } catch (e) {} };
  function aplicaCor(raiz, h) {
    raiz.classList.toggle("dourado", h === "dourado"); if (h === "dourado") { ["--jv1", "--jv2", "--jv3"].forEach((v) => raiz.style.removeProperty(v)); raiz.classList.remove("cor-propria"); J.ouroTitulo(raiz); return; }
    if (h === null) { ["--jv1", "--jv2", "--jv3"].forEach((v) => raiz.style.removeProperty(v)); raiz.classList.remove("cor-propria"); return; }
    /* degradê com três tons vizinhos da cor escolhida */
    raiz.style.setProperty("--jv1", `hsl(${h - 12}, 85%, 66%)`);
    raiz.style.setProperty("--jv2", `hsl(${h}, 80%, 60%)`);
    raiz.style.setProperty("--jv3", `hsl(${h + 14}, 88%, 56%)`);
    raiz.classList.add("cor-propria");
  }
  J._aplicaCor = aplicaCor;
  /* β 4.3 · título dourado (só ADM): o degradê anda pelas letras (CSS) e, de dentro de "Jarvis", sobem símbolos pequenininhos.
     Leve: no máximo 7 de cada vez, um a cada ~0,45 s, cada um some sozinho; para quando sai da tela inicial ou da opção. */
  const OURO_SIMB = ["∫", "∮", "∑", "∂", "∇", "E=mc²", "F=ma", "pV=nRT", "ħω", "λ=h/p", "H₂O", "CO₂", "NaCl", "CH₄", "Я", "Ж", "Ф", "Щ", "ॐ", "क", "स", "ज्ञ", "α", "β", "λ", "Ω", "π", "φ", "Δ"];
  J.ouroTitulo = (raiz) => {
    if (raiz._ouro) return; const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches; if (reduz) return;
    const tit = raiz.querySelector(".jv-titulo"), h1 = tit && tit.querySelector("h1"); if (!h1) return;
    raiz._ouro = setInterval(() => {
      if (!document.body.contains(raiz) || !raiz.classList.contains("dourado")) { clearInterval(raiz._ouro); raiz._ouro = null; return; }
      if (document.hidden || tit.querySelectorAll(".jv-ouro-p").length >= 7) return;
      const txt = [...h1.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim()); if (!txt) return;
      const rg = document.createRange(); rg.selectNodeContents(txt); const r = rg.getBoundingClientRect(), b = tit.getBoundingClientRect();
      const s = document.createElement("span"); s.className = "jv-ouro-p"; s.setAttribute("aria-hidden", "true"); s.textContent = OURO_SIMB[Math.floor(Math.random() * OURO_SIMB.length)];
      s.style.left = (r.left - b.left + r.width * (0.06 + 0.88 * Math.random())).toFixed(1) + "px"; s.style.top = (r.top - b.top + r.height * (0.35 + 0.4 * Math.random())).toFixed(1) + "px";
      s.style.setProperty("--dx", ((Math.random() - 0.5) * 16).toFixed(1) + "px"); s.style.fontSize = (9 + Math.random() * 3).toFixed(1) + "px";
      s.addEventListener("animationend", () => s.remove()); tit.appendChild(s);
    }, 450);
  };
  function seletorCor(raiz) {
    const t = raiz.querySelector(".jv-titulo"), inp = raiz.querySelector(".jv-cor input"), bt = raiz.querySelector(".jv-cor button:not(.jv-ouro-bt)");
    const livre = !window.ACESSO || window.ACESSO.engrenagem("corTitulo"); /* acesso (β 4.1): sem ele, a cor original e sem seletor */
    if (!livre) { const c = raiz.querySelector(".jv-cor"); if (c) c.remove(); aplicaCor(raiz, null); return; }
    const h0 = lerCor(); if (typeof h0 === "number") inp.value = h0;
    if (window.ACESSO && window.ACESSO.tituloDourado()) { const ob = document.createElement("button"); ob.type = "button"; ob.className = "jv-ouro-bt"; ob.textContent = "dourado ✦"; ob.title = "Título dourado (só do ADM)"; bt.after(ob); ob.addEventListener("click", () => { aplicaCor(raiz, "dourado"); gravarCor("dourado"); }); }
    aplicaCor(raiz, h0);
    inp.addEventListener("input", () => { const h = +inp.value; aplicaCor(raiz, h); gravarCor(h); });
    bt.addEventListener("click", () => { aplicaCor(raiz, null); gravarCor(null); inp.value = 50; });
    /* no celular não há "passar o mouse": tocar no título abre e fecha o seletor */
    t.querySelector("h1").addEventListener("click", () => t.classList.toggle("aberto"));
  }
  /* tocar fora do título fecha o seletor (um ouvinte só, para a página toda) */
  document.addEventListener("click", (ev) => { const t = document.querySelector(".jv-titulo.aberto"); if (t && !t.contains(ev.target)) t.classList.remove("aberto"); });
  const AC = () => window.ACESSO;
  const pode = (f, x) => !AC() || AC()[f](x); /* sem o motor de acesso carregado, tudo aberto (como antes da β 4.1) */
  /* idioma ativo no cartão de idiomas (β 4.1): jarvis:lingua = id de uma matéria com idioma: true (russo, alemão, sânscrito…) */
  const IDIOMAS = () => (window.MATERIAS || []).filter((m) => m.idioma);
  J.lingua = () => { let v = null; try { v = JSON.parse(localStorage.getItem("jarvis:lingua")); } catch (e) {} if (IDIOMAS().find((m) => m.id === v)) return v;
    const livre = IDIOMAS().find((m) => pode("materia", m.id)); return (livre || IDIOMAS()[0] || {}).id; }; /* β 4.2: sem escolha salva, o primeiro idioma com acesso */
  J.trocaLingua = (id) => { try { localStorage.setItem("jarvis:lingua", JSON.stringify(id)); } catch (e) {} const pag = document.getElementById("pagina"); if (pag && document.querySelector(".jv")) J.home(pag); };
  function cartao(m) {
    const livre = pode("materia", m.id);
    const conteudo = `<span class="jv-ic" style="color:var(${esc(m.cor)})">${ICONE[m.icone] || ""}</span><span class="jv-nome">${esc(m.nome)}</span><span class="jv-desc">${esc(m.desc || "")}</span>${m.pronta ? "" : `<span class="jv-breve">em breve</span>`}${livre ? "" : `<span class="jv-tranca">${AC().CADEADO}</span>`}`;
    return m.pronta
      ? `<a class="jv-mat${livre ? "" : " sem-acesso"}" href="${esc(m.rota)}" style="--cor:var(${esc(m.cor)})" data-materia="${esc(m.id)}">${conteudo}</a>`
      : `<div class="jv-mat desativada" aria-disabled="true" title="${esc(m.nome)}: em breve" style="--cor:var(${esc(m.cor)})" data-materia="${esc(m.id)}">${conteudo}</div>`;
  }
  J.home = (el) => {
    const jarvisLivre = !!(AC() && AC().jarvis() && J.busca); /* β 4.2: busca do Jarvis só com o código (ou ADM) */
    const P = window.PROJETO || { nome: "Jarvis" }, ling = J.lingua(), mats = (window.MATERIAS || []).filter((m) => !m.idioma || m.id === ling), suf = AC() ? AC().sufixo() : "";
    const seletor = IDIOMAS().length > 1 && pode("idiomas") ? `<div class="jv-linguas" role="group" aria-label="Idioma da matéria de línguas">${IDIOMAS().map((m) => `<button type="button" data-lingua="${esc(m.id)}" aria-pressed="${m.id === ling}" title="${esc(m.nome)}${pode("materia", m.id) ? "" : " (trancado)"}"${pode("materia", m.id) ? "" : ` class="tranca"`} style="--cor:var(${esc(m.cor)})">${esc(m.letra || m.nome[0])}</button>`).join("")}</div>` : "";
    el.innerHTML = `<div class="jv">
      <header class="jv-cab"><div class="jv-titulo" tabindex="-1"><h1 title="Passe o mouse para mudar a cor">${esc(P.nome)}${window.VERSAO ? `<span class="jv-ver">${esc(window.VERSAO)}<span class="jv-suf${suf === ".ADM" ? " adm" : ""}">${esc(suf)}</span></span>` : ""}</h1>
        <div class="jv-cor" role="group" aria-label="Cor do ${esc(P.nome)}"><label>cor<input type="range" min="0" max="${MATIZ_MAX}" step="1" value="50" aria-label="Cor, do vermelho ao lilás"></label><button type="button">voltar à cor original</button></div></div></header>
      <nav class="jv-materias" aria-label="Matérias">${mats.map((m) => (m.idioma ? `<div class="jv-mat-idioma">${cartao(m)}${seletor}</div>` : cartao(m))).join("")}</nav>
      <div class="jv-ilu"></div>
      <div class="jv-linha">${AC() ? `<a class="jv-cadeado" href="#/codigos" aria-label="Códigos de acesso" title="Códigos de acesso">${AC().CADEADO}</a>` : ""}${J.botaoAdesivos ? J.botaoAdesivos() : ""}${jarvisLivre ? `<form class="jv-pergunta jv-busca-ativa" role="search" aria-label="Buscar no ${esc(P.nome)}">
        <span class="jv-simb">${J.simboloJarvis ? J.simboloJarvis() : ""}</span><input type="text" placeholder="Perguntar algo ao ${esc(P.nome)}…" aria-label="Buscar no ${esc(P.nome)}" autocomplete="off" spellcheck="false"><kbd class="jv-atalho" title="atalho em qualquer página">Ctrl K</kbd>
        <button type="submit" aria-label="Buscar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
      </form>` : `<form class="jv-pergunta" onsubmit="return false" aria-label="Perguntar ao ${esc(P.nome)} (em breve)">
        <input type="text" disabled placeholder="Perguntar algo ao ${esc(P.nome)}…" aria-label="Pergunta (em breve)">
        <button type="submit" disabled aria-label="Enviar (em breve)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
        <span class="jv-breve">em breve</span>
      </form>`}</div>
    </div>`;
    seletorCor(el.querySelector(".jv"));
    J.desenhaFigura(el.querySelector(".jv-ilu"));
    if (J.adesivos) J.adesivos(el); /* adesivos (β 3.6): camada atrás da interface + painel da engrenagem */
    /* acesso (β 4.1): matérias e engrenagem trancadas mostram o aviso e o duplo clique leva aos códigos */
    if (AC()) { el.querySelectorAll(".jv-mat.sem-acesso").forEach(AC().trancar); if (!pode("engrenagem", "painel")) AC().trancar(el.querySelector(".jv-engrenagem")); }
    el.querySelectorAll(".jv-linguas [data-lingua]").forEach((b) => b.addEventListener("click", () => J.trocaLingua(b.dataset.lingua)));
    if (jarvisLivre) J.busca.monta(el.querySelector(".jv-pergunta"), "home");
  };
  /* rota de uma matéria registrada que ainda não existe (ex.: #/quimica/inicio): nunca tela em branco */
  J.emBreve = (el, m) => {
    el.innerHTML = `<div class="jv jv-so"><span class="jv-ic grande" style="color:var(${esc(m.cor)})">${ICONE[m.icone] || ""}</span><h1>${esc(m.nome)}</h1><p class="jv-breve">em breve</p><p class="jv-volta"><a href="#/home">← voltar para a tela inicial</a></p></div>`;
  };
  J.materia = (id) => (window.MATERIAS || []).find((m) => m.id === id);
})();
