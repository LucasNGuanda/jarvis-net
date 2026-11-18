/* Busca do Jarvis (β 4.2). SEM inteligência artificial, SEM API, SEM chave: só procura dentro do próprio site.
   Fontes: os catálogos (matérias, abas, módulos, temas, inclusive os "em breve") + assets/indice-busca.js (GERADO por
   tools/gera-indice.js: seções, fórmulas e termos de cada tema escrito). Configuração: assets/jarvis-config.js.
   Acesso: só aparece o que o nível de quem busca pode abrir (ACESSO.area). Nada trancado vaza: nem nome, nem trecho, nem código;
   se só houver coisa trancada, a resposta é "existe, mas você ainda não tem acesso · ir para códigos?".
   Atalho: Ctrl K (⌘ K) em qualquer página. */
(function () {
  "use strict";
  const J = window.JARVIS || (window.JARVIS = {});
  const CFG = () => window.JARVIS_CFG || { sinonimos: {}, navegacao: [], frases: ["Está em {lugar}."], palavrasVazias: [] };
  const AC = () => window.ACESSO;
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const semAcento = (c) => c.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const norm = (s) => semAcento(String(s || "").toLowerCase()).replace(/[^a-z0-9α-ως]+/g, " ").trim();
  const VAZIAS = () => (B.vazias = B.vazias || new Set(CFG().palavrasVazias.map(norm)));
  const toks = (s, tiraVazias = true) => norm(s).split(" ").filter((w) => w && (!tiraVazias || !VAZIAS().has(w)));
  const B = {}; /* estado interno */

  /* ---------- índice em memória ---------- */
  function materiaDe(areaId) { const a = (window.AREAS || []).find((x) => x.id === areaId); return (a && a.materia) || "fisica"; }
  function nomeMat(mid) { const m = (window.MATERIAS || []).find((x) => x.id === mid); return m ? m.nome : mid; }
  function constroi() {
    const IDX = (window.INDICE_BUSCA && window.INDICE_BUSCA.temas) || {}, F = window.F;
    const un = [], voc = new Map(), formulas = [];
    const poe = (u, campos) => { const i = un.push(u) - 1; u.i = i; campos.forEach(([txt, w]) => { for (const t of toks(txt, false)) { if (t.length < 2 && !/\d/.test(t)) continue; let m = voc.get(t); if (!m) voc.set(t, (m = new Map())); const a = m.get(i); if (!a || a[0] < w) m.set(i, [w, 1]); else if (a[0] === w) a[1]++; } }); }; /* [peso do campo, quantas vezes aparece nele] */
    for (const mid of (window.MATERIAS || []).map((m) => m.id)) { const m = window.MATERIAS.find((x) => x.id === mid); poe({ tipo: "materia", grupo: "mat:" + mid, mat: mid, area: null, titulo: m.nome, href: m.rota }, [[m.nome, 6]]); }
    for (const a of window.AREAS || []) poe({ tipo: "aba", grupo: "aba:" + a.id, mat: a.materia || "fisica", area: a.id, titulo: a.titulo, aba: a.nome, href: "#/" + a.inicio }, [[a.nome, 4], [a.titulo, 4]]);
    for (const m of window.CATALOGO || []) {
      const mat = materiaDe(m.area), ar = (window.AREAS || []).find((x) => x.id === m.area) || {};
      poe({ tipo: "modulo", grupo: "mod:" + m.id, mat, area: m.area, mod: m, titulo: m.nome, href: m.temas.length ? F.href(m.temas[0][0], mat) : "#/" + (ar.inicio || "home") }, [[m.nome, 5], [m.desc || "", 1], [m.id, 2]]);
      for (const t of m.temas) {
        const chave = mat === "fisica" ? t[0] : mat + "/" + t[0], ix = IDX[chave], base = { tipo: "tema", grupo: "tema:" + chave, chave, mat, area: m.area, mod: m, cod: t[0], nome: t[1], pronto: !!t[3], href: F.href(t[0], mat) };
        poe(Object.assign({}, base), [[t[0], 4], [t[1], 7], [m.nome, 1.2], [ix ? ix.termos.join(" · ") : "", 2.5]]);
        if (ix) {
          ix.secoes.forEach(([id, tit, txt]) => poe(Object.assign({}, base, { secao: id, secaoTit: tit, texto: txt, href: F.href(t[0], mat, id) }), [[tit, 3.5], [txt, 1]]));
          ix.formulas.forEach((tex) => formulas.push({ base, tex, compacto: compacta(tex) }));
        }
      }
    }
    B.un = un; B.voc = voc; B.palavras = [...voc.keys()].sort(); B.formulas = formulas; B.comIndice = !!window.INDICE_BUSCA;
  }
  const pronto = () => { if (!B.un || (!B.comIndice && window.INDICE_BUSCA)) constroi(); };
  /* TeX → forma compacta para comparar fórmulas digitadas ("pV = nRT" acha "pV = nRT"; "E=mc^2" acha "E = mc^2") */
  function compacta(tex) { return semAcento(String(tex).replace(/\\(?:vec|mathrm|text|mathbf|left|right|,|;|!|quad|qquad|displaystyle)/g, "").replace(/\\cdot|\\times/g, "*").replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)").replace(/[{}\s\\]/g, "").replace(/\*\*/g, "^").toLowerCase()); }
  J.carregaIndice = () => new Promise((ok) => {
    if (window.INDICE_BUSCA) return ok(true);
    if (B.carregando) return B.carregando.push(ok);
    B.carregando = [ok]; const s = document.createElement("script"); s.src = "assets/indice-busca.js";
    const fim = (v) => { const l = B.carregando; B.carregando = null; l.forEach((f) => f(v)); };
    s.onload = () => fim(true); s.onerror = () => fim(false); document.head.appendChild(s);
  });

  /* ---------- distância de edição (com corte: desiste cedo se passar de k) ---------- */
  function lev(a, b, k) {
    if (Math.abs(a.length - b.length) > k) return k + 1;
    let ant = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) { const cur = [i]; let menor = i;
      for (let j = 1; j <= b.length; j++) { let v = Math.min(ant[j] + 1, cur[j - 1] + 1, ant[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); cur.push(v); if (v < menor) menor = v; }
      if (menor > k) return k + 1; ant = cur; }
    return ant[b.length];
  }
  /* palavras do índice parecidas com t: [palavra, fator] */
  function parecidas(t, folga = 0) {
    const r = [], P = B.palavras;
    if (B.voc.has(t)) r.push([t, 1]);
    if (t.length >= 3) { let lo = 0, hi = P.length; while (lo < hi) { const m = (lo + hi) >> 1; if (P[m] < t) lo = m + 1; else hi = m; } for (let i = lo; i < P.length && P[i].startsWith(t); i++) if (P[i] !== t) r.push([P[i], t.length <= 3 ? 0.45 : 0.8]); } /* "mol" não deve valer o mesmo que "molas" */
    if (t.length >= 4 && !/^\d+$/.test(t)) { const k = (t.length <= 6 ? 1 : 2) + folga; for (const w of P) { if (w === t || Math.abs(w.length - t.length) > k || w.length < 3) continue; const d = lev(t, w, k); if (d <= k) r.push([w, d === 1 ? 0.75 : 0.6]); } }
    return r;
  }

  /* ---------- busca (pura: sem mexer na tela) ---------- */
  function variantes(q) {
    const qn = " " + norm(q) + " ", vs = [{ t: toks(q), peso: 1 }];
    for (const [k, lista] of Object.entries(CFG().sinonimos || {})) { const kn = norm(k); if (kn && qn.includes(" " + kn + " ")) lista.forEach((e) => vs.push({ t: toks(qn.replace(" " + kn + " ", " " + e + " ")), peso: 0.9 })); }
    return vs.filter((v) => v.t.length);
  }
  function pontua(q, folga = 0) {
    pronto(); const grupos = new Map();
    for (const v of variantes(q)) {
      const porUn = new Map(); /* unidade → [soma, acertos, palavras] */
      v.t.forEach((t) => { const melhor = new Map();
        for (const [w, f] of parecidas(t, folga)) for (const [i, [peso, vezes]] of B.voc.get(w)) { const s = peso * f * (1 + 0.3 * Math.log(vezes)); /* aparecer mais vezes desempata */ const a = melhor.get(i); if (!a || a[0] < s) melhor.set(i, [s, w]); }
        for (const [i, [s, w]] of melhor) { const a = porUn.get(i) || [0, 0, []]; a[0] += s; a[1]++; a[2].push(w); porUn.set(i, a); } });
      const n = v.t.length, minimo = folga ? 0.5 : n <= 2 ? 1 : 0.6, frase = v.t.join(" ");
      for (const [i, [s, ac, ws]] of porUn) {
        const cob = ac / n; if (cob < minimo) continue; const u = B.un[i];
        let nota = s * cob * cob * v.peso; if (n > 1 && norm([u.titulo, u.nome, u.secaoTit].join(" ")).includes(frase)) nota *= 1.5; if (u.tipo === "tema" && !u.pronto) nota *= 0.85;
        const g = grupos.get(u.grupo); if (!g) grupos.set(u.grupo, { u, nota, palavras: ws, soma: nota }); else { g.soma += nota; if (g.nota < nota) Object.assign(g, { u, nota, palavras: ws }); }
      }
    }
    /* fórmulas digitadas */
    const qc = compacta(q); if (/[=^]/.test(q) && qc.length >= 3) for (const f of B.formulas) if (f.compacto.includes(qc)) { const g = grupos.get(f.base.grupo), nota = 9 + qc.length / 4; if (!g || g.nota < nota) grupos.set(f.base.grupo, { u: f.base, nota, palavras: [], formula: f.tex }); }
    for (const g of grupos.values()) if (g.soma) g.nota += 0.3 * Math.min(g.soma - g.nota, 2 * g.nota); /* o tema que fala do assunto em várias seções sobe um pouco */
    return [...grupos.values()].sort((a, b) => b.nota - a.nota);
  }
  const livre = (u) => { const A = AC(); if (!A) return true; return u.area ? A.area(u.area) : A.materia(u.mat); };
  J.buscar = (q, opc = {}) => { const todos = pontua(q, opc.folga || 0), livres = todos.filter((r) => livre(r.u)); return { livres: livres.slice(0, opc.max || 12), temTrancado: todos.length > livres.length, total: livres.length }; };

  /* ---------- classificação da pergunta ---------- */
  const ehCodigo = (q) => /^[a-z]{1,4}\d{2}[a-z]?$/i.test(q.trim().replace(/\s+/g, ""));
  const RE_DUVIDA = /^(como (?:e que )?(?:se )?(?:resolv|calcul|deriv|integr|ach|encontr|demonstr|prov|fac|faz)|qual (?:e )?(?:a |o )?(?:formula|resposta|resultado|valor|derivada|integral|equacao|conta)|quanto (?:vale|da|e)\b|o que (?:e|sao|significa)\b|por ?que\b|pq\b|me (?:explica|ensina|responde|ajuda)|explica\b|resolv|calcul[ae]\b|derive|integre|demonstre|prove)/;
  const PISTA_NAV = /\b(onde|cade|como|qual|fica|ficam|acho|abro|abrir|ligo|ligar|mudo|mudar|troco|trocar|exporto|importo|vejo|uso|usar)\b/;
  function navegacaoDe(q) {
    const qn = " " + norm(q) + " "; let achou = null, tam = 0;
    for (const n of CFG().navegacao || []) for (const c of n.chaves) { const cn = norm(c); if (qn.includes(" " + cn + " ") && cn.length > tam) { achou = n; tam = cn.length; } }
    if (!achou) return null;
    const resto = toks(q).filter((w) => !achou.chaves.some((c) => toks(c, false).includes(w)));
    return PISTA_NAV.test(norm(q)) || !resto.length ? achou : null;
  }
  J.classifica = (q) => (ehCodigo(q) ? "codigo" : navegacaoDe(q) ? "navegacao" : RE_DUVIDA.test(norm(q)) ? "duvida" : "busca");

  /* ---------- resposta (pura): o que mostrar para uma pergunta ---------- */
  function lugar(u) { const ar = (window.AREAS || []).find((a) => a.id === u.area), mn = nomeMat(u.mat), aba = ar && ar.nome !== mn ? `, aba ${ar.nome}` : ""; return u.tipo === "tema" ? `${mn}${aba}, ${u.cod}` : `${mn}${aba}`; }
  J.lugar = lugar;
  J.responder = (q) => {
    q = String(q || "").trim(); if (!q) return { tipo: "vazio" };
    const cls = J.classifica(q);
    if (cls === "codigo") {
      pronto(); const c = q.replace(/\s+/g, "").toLowerCase(), achados = B.un.filter((u) => u.tipo === "tema" && !u.secao && u.cod.toLowerCase() === c), livres = achados.filter(livre);
      if (livres.length === 1) return { tipo: "codigo", alvo: livres[0], href: livres[0].href };
      if (livres.length > 1) { /* mesmo código em duas matérias (ex.: A08 na Física e na Química): vai para o da matéria atual; na tela inicial, a Física */
        const aqui = window.F && document.querySelector(".jv") ? "fisica" : window.F ? window.F.materia() : "fisica", um = livres.find((u) => u.mat === aqui) || livres.find((u) => u.mat === "fisica");
        if (um) return { tipo: "codigo", alvo: um, href: um.href, outros: livres.filter((u) => u !== um) };
        return { tipo: "lista", livres: livres.map((u) => ({ u, nota: 10, palavras: [] })), temTrancado: false }; }
      if (achados.length) return { tipo: "trancado" };
    }
    if (cls === "navegacao") return { tipo: "navegacao", nav: navegacaoDe(q) };
    const r = J.buscar(q);
    if (cls === "duvida") {
      const temas = r.livres.filter((x) => x.u.tipo === "tema"), top = temas[0] || r.livres[0];
      if (top) { const fr = CFG().frases, k = Math.floor(Math.random() * fr.length); const resto = r.livres.filter((x) => x !== top), perto = resto.filter((x) => x.u.tipo === "tema").concat(resto.filter((x) => x.u.tipo !== "tema")).slice(0, 3); /* os três TEMAS mais próximos */
        return { tipo: "duvida", frase: fr[k], fraseN: k, alvo: top, perto }; }
    }
    if (r.livres.length) return { tipo: "lista", livres: r.livres, temTrancado: r.temTrancado };
    if (r.temTrancado) return { tipo: "trancado" };
    const perto = J.buscar(q, { folga: 1, max: 3 });
    return { tipo: "nada", perto: perto.livres, temTrancado: perto.temTrancado && !perto.livres.length };
  };

  /* ---------- tela ---------- */
  function trecho(r) {
    const u = r.u, txt = u.texto; if (!txt) return "";
    let n = "", mapa = []; for (let i = 0; i < txt.length; i++) { const c = semAcento(txt[i].toLowerCase()); for (const ch of c) { n += /[a-z0-9α-ως]/.test(ch) ? ch : " "; mapa.push(i); } }
    let pos = -1, fim = -1; for (const w of r.palavras) { const re = new RegExp("(^|[^a-z0-9])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), m = re.exec(n); if (m && (pos < 0 || m.index < pos)) { pos = m.index + m[1].length; fim = pos + w.length; } }
    if (pos < 0) return esc(txt.slice(0, 140)) + (txt.length > 140 ? "…" : "");
    const a = mapa[pos], b = (mapa[fim - 1] || a) + 1, ini = Math.max(0, a - 60), fin = Math.min(txt.length, b + 80);
    return (ini > 0 ? "…" : "") + esc(txt.slice(ini, a)) + "<mark>" + esc(txt.slice(a, b)) + "</mark>" + esc(txt.slice(b, fin)) + (fin < txt.length ? "…" : "");
  }
  const texHtml = (tex) => { try { if (window.katex) return window.katex.renderToString(tex, { throwOnError: false, displayMode: false }); } catch (e) {} return esc(tex); };
  function item(r, k) {
    const u = r.u, mn = nomeMat(u.mat);
    const onde = u.tipo === "tema" ? `${esc(mn)} · ${esc(u.mod.nome)} · <b>${esc(u.cod)}</b>` : u.tipo === "modulo" ? `${esc(mn)} · módulo <b>${esc(u.mod.id)}</b>` : u.tipo === "aba" ? `${esc(mn)} · aba` : "matéria";
    const nome = u.tipo === "tema" ? u.nome : u.tipo === "aba" ? u.aba + (u.titulo !== u.aba ? " · " + u.titulo : "") : u.titulo;
    const sub = u.secaoTit ? `<span class="jb-secao">§ ${esc(u.secaoTit)}</span>` : "", tr = r.formula ? `<span class="jb-trecho jb-tex">${texHtml(r.formula)}</span>` : u.texto ? `<span class="jb-trecho">${trecho(r)}</span>` : "";
    return `<a class="jb-item" href="${esc(u.href)}" data-k="${k}" role="option"><span class="jb-onde">${onde}${u.tipo === "tema" && !u.pronto ? ` <i class="jb-breve">em breve</i>` : ""}</span><span class="jb-nome">${esc(nome)}</span>${sub}${tr}</a>`;
  }
  const TRANCADO = `<p class="jb-msg jb-tranc">existe, mas você ainda não tem acesso · <a href="#/codigos">ir para códigos?</a></p>`;
  function htmlResposta(res, q) {
    if (res.tipo === "vazio") return "";
    if (res.tipo === "trancado") return TRANCADO;
    if (res.tipo === "navegacao") return `<p class="jb-msg">${esc(res.nav.resposta)}</p>`;
    if (res.tipo === "duvida") { const u = res.alvo.u, link = `<a href="${esc(u.href)}" class="jb-lugar">${esc(lugar(u))}${u.tipo === "tema" ? " · " + esc(u.nome) : ""}</a>`;
      return `<p class="jb-msg jb-pers"><span class="jb-simb">${J.simboloJarvis ? J.simboloJarvis() : ""}</span><span>${esc(res.frase).replace("{lugar}", link)}</span></p>${res.perto.length ? `<div class="jb-rot">mais perto, se estiver com pressa</div>${res.perto.map(item).join("")}` : ""}`; }
    if (res.tipo === "lista") return res.livres.map(item).join("");
    if (res.tipo === "nada") return `<p class="jb-msg">Não achei nada sobre “${esc(q)}”.${res.perto.length ? " O mais perto que eu tenho:" : res.temTrancado ? "" : " Nem parecido: pode ser que ainda não exista no site."}</p>${res.perto.map(item).join("")}${res.temTrancado ? TRANCADO : ""}`;
    return "";
  }
  /* histórico curto (jarvis:buscas, entra no exportar) */
  const HIST = "jarvis:buscas";
  const hist = () => { try { const v = JSON.parse(localStorage.getItem(HIST)); return Array.isArray(v) ? v : []; } catch (e) { return []; } };
  const guardaHist = (q) => { q = q.trim(); if (!q) return; try { localStorage.setItem(HIST, JSON.stringify([q].concat(hist().filter((x) => x !== q)).slice(0, 8))); } catch (e) {} };
  /* vai para o destino de uma pergunta de navegação */
  function destino(nav) {
    if (nav.nivel && AC() && !AC().engrenagem(nav.nivel)) return { msg: nav.resposta + " Isso pede o código de configurações.", href: "#/codigos" };
    if (nav.ir !== "materia") return { href: nav.ir };
    const ar = (window.AREAS || []).find((a) => !AC() || AC().area(a.id));
    if (!ar) return { msg: nav.resposta + " Só que você ainda não tem acesso a nenhuma matéria.", href: "#/codigos" };
    if (nav.rota && window.F) window.F.area = ar.id; /* sumário e legenda são os da aba atual: a primeira que a pessoa pode abrir */
    return { href: nav.rota ? "#/" + nav.rota : "#/" + ar.inicio, area: ar };
  }
  function avisa(txt) { document.querySelectorAll(".jb-toast").forEach((t) => t.remove()); const t = document.createElement("div"); t.className = "jb-toast"; t.setAttribute("role", "status"); t.innerHTML = `<span class="jb-simb">${J.simboloJarvis ? J.simboloJarvis() : ""}</span><span>${esc(txt)}</span>`; document.body.appendChild(t); setTimeout(() => t.classList.add("sai"), 6500); setTimeout(() => t.remove(), 7200); }
  function pisca(sel) { if (!sel) return; setTimeout(() => { const e = document.querySelector(sel); if (e) { e.classList.add("jb-pisca"); e.scrollIntoView({ block: "nearest" }); setTimeout(() => e.classList.remove("jb-pisca"), 2600); } }, 450); }

  /* monta a busca num formulário (.jv-pergunta): "home" = painel abre para cima; "modal" = para baixo */
  J.busca = {
    monta(form, modo) {
      if (!form || form.dataset.busca) return; form.dataset.busca = "1";
      const inp = form.querySelector("input"), painel = document.createElement("div"); painel.className = "jb-painel" + (modo === "home" ? " cima" : ""); painel.setAttribute("role", "listbox"); painel.hidden = true; form.appendChild(painel);
      let sel = -1, t = null;
      const mostra = (html) => { painel.innerHTML = html; painel.hidden = !html; sel = -1; };
      const historico = () => { const h = hist(); mostra(h.length ? `<div class="jb-rot">buscas recentes</div>` + h.map((x) => `<button type="button" class="jb-hist">${esc(x)}</button>`).join("") : `<div class="jb-rot">digite um tema, uma fórmula, um cientista ou um código (A08, CI07…)</div>`); };
      const sugere = () => { const q = inp.value.trim(); if (!q) return historico(); const r = J.buscar(q, { max: 8 }); mostra(r.livres.length ? r.livres.map(item).join("") : r.temTrancado ? TRANCADO : `<p class="jb-msg">nada ainda… Enter para eu procurar melhor</p>`); };
      const responde = () => {
        const q = inp.value.trim(); if (!q) return historico(); guardaHist(q);
        const res = J.responder(q);
        if (res.tipo === "codigo") { fecha(); location.hash = res.href; return; }
        if (res.tipo === "navegacao") { const d = destino(res.nav); if (d.href) { if (d.msg) { mostra(`<p class="jb-msg">${esc(d.msg)} <a href="${esc(d.href)}">ir</a></p>`); return; } fecha(); if (location.hash !== d.href) location.hash = d.href; avisa(res.nav.resposta); pisca(res.nav.destaque); return; } }
        mostra(htmlResposta(res, q));
      };
      const fecha = () => { mostra(""); if (modo === "modal") J.busca.fechar(); };
      J.carregaIndice().then(() => { B.un = null; if (!painel.hidden && inp.value.trim()) sugere(); });
      inp.addEventListener("input", () => { clearTimeout(t); t = setTimeout(sugere, 110); });
      inp.addEventListener("focus", () => { if (painel.hidden) inp.value.trim() ? sugere() : historico(); });
      form.addEventListener("submit", (e) => { e.preventDefault(); clearTimeout(t); responde(); });
      inp.addEventListener("keydown", (e) => {
        const itens = [...painel.querySelectorAll(".jb-item, .jb-hist")];
        if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (!itens.length) return; sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + itens.length) % itens.length; itens.forEach((x, k) => x.classList.toggle("sel", k === sel)); itens[sel].scrollIntoView({ block: "nearest" }); }
        else if (e.key === "Enter" && sel >= 0 && itens[sel]) { e.preventDefault(); itens[sel].click(); }
        else if (e.key === "Escape") { e.preventDefault(); fecha(); inp.blur(); }
      });
      painel.addEventListener("mousedown", (e) => e.preventDefault()); /* clicar no painel não tira o foco do campo */
      painel.addEventListener("click", (e) => { const h = e.target.closest(".jb-hist"); if (h) { inp.value = h.textContent; responde(); return; } const a = e.target.closest("a"); if (a) { guardaHist(inp.value); fecha(); } });
      document.addEventListener("click", (e) => { if (modo === "home" && !form.contains(e.target)) mostra(""); });
      return { inp, painel, responde, sugere };
    },
    abrir() {
      if (!AC() || !AC().jarvis()) return false;
      const campo = document.querySelector(".jv .jv-busca-ativa input"); if (campo) { campo.focus(); campo.select(); return true; }
      if (document.querySelector(".jb-modal")) { document.querySelector(".jb-modal input").focus(); return true; }
      const m = document.createElement("div"); m.className = "jb-modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-label", "Buscar no Jarvis");
      m.innerHTML = `<div class="jb-caixa"><form class="jv-pergunta jv-busca-ativa" role="search"><span class="jv-simb">${J.simboloJarvis ? J.simboloJarvis() : ""}</span><input type="text" placeholder="Perguntar algo ao Jarvis…" aria-label="Buscar no Jarvis" autocomplete="off" spellcheck="false"><kbd class="jv-atalho">Esc</kbd><button type="submit" aria-label="Buscar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button></form></div>`;
      document.body.appendChild(m); m.addEventListener("mousedown", (e) => { if (e.target === m) J.busca.fechar(); });
      J.busca.monta(m.querySelector("form"), "modal"); m.querySelector("input").focus(); return true;
    },
    fechar() { document.querySelectorAll(".jb-modal").forEach((m) => m.remove()); },
  };
  document.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === "k" || e.key === "K")) { if (AC() && AC().jarvis()) { e.preventDefault(); J.busca.abrir(); } } });
  window.addEventListener("hashchange", () => J.busca.fechar());
  J._busca = B; /* para os testes */
})();
