/* Motor do acesso por código (β 4.1). A CONFIGURAÇÃO (quem vê o quê e os códigos) fica em assets/acesso-config.js.
   Guardado em jarvis:acesso = { chaves: ["adm"] | ["tester", "quimica", …] } (entra no exportar/importar progresso).
   Não é segurança de verdade: o site é estático e tudo fica legível no código-fonte. */
(function () {
  "use strict";
  const CHAVE = "jarvis:acesso";
  const C = () => window.ACESSO_CFG || { codigos: { adm: [], tester: [], avulsos: {} }, materias: {}, abas: {}, engrenagem: {}, adesivos: {}, avisos: {}, nomes: {} };
  const norm = (s) => String(s || "").trim().normalize("NFD").replace(/[̀-ͯ]/g, ""); /* física = fisica */
  const A = (window.ACESSO = {});
  A.chaves = () => { try { const o = JSON.parse(localStorage.getItem(CHAVE)); return o && Array.isArray(o.chaves) ? o.chaves : []; } catch (e) { return []; } };
  const grava = (ch) => { try { if (ch.length) localStorage.setItem(CHAVE, JSON.stringify({ chaves: ch })); else localStorage.removeItem(CHAVE); } catch (e) {} };
  A.adm = () => A.chaves().includes("adm");
  A.visitante = () => !A.chaves().length;
  /* nível: "visitante" | "tester" | "adm" | nome de código avulso | lista deles */
  A.tem = (nivel) => {
    if (A.adm()) return true;
    if (nivel === undefined || nivel === null) return false;
    const lista = Array.isArray(nivel) ? nivel : [nivel], ch = A.chaves();
    return lista.some((n) => n === "visitante" || ch.includes(n));
  };
  A.materia = (id) => A.tem(C().materias[id] === undefined ? "adm" : C().materias[id]);
  A.area = (areaId) => { const ab = C().abas || {}; if (ab[areaId] !== undefined) return A.tem(ab[areaId]); const ar = (window.AREAS || []).find((a) => a.id === areaId); return A.materia(ar ? ar.materia || "fisica" : "fisica"); };
  A.engrenagem = (parte) => A.tem((C().engrenagem || {})[parte] === undefined ? "adm" : C().engrenagem[parte]);
  A.adesivo = (id) => { const ad = C().adesivos || {}; return ad[id] !== undefined ? A.tem(ad[id]) : A.engrenagem("adesivos"); };
  /* β 4.3: EXCLUSIVOS DO ADM, fixos aqui no motor de propósito: nenhum nível do acesso-config.js (nem "config", nem avulso,
     nem tester) consegue liberar. Pedido do Lucas: "nem agora nem depois". */
  const SO_ADM = { figuras: ["buraconegro"] };
  A.figura = (id) => (SO_ADM.figuras.includes(id) ? A.adm() : A.engrenagem("figura")); /* figura central do painel da engrenagem */
  A.tituloDourado = () => A.adm(); /* efeito dourado do título "Jarvis" */
  A.tituloEsmeralda = () => A.adm() || A.chaves().includes("tester"); /* β 4.5: cor esmeralda (título + figura), exclusiva do beta tester; o ADM também tem */
  A.jarvis = () => A.tem(C().jarvis === undefined ? "adm" : C().jarvis); /* β 4.2: busca do Jarvis */
  A.idiomas = () => A.tem(C().seletorIdioma === undefined ? "adm" : C().seletorIdioma);
  A.aviso = () => (A.visitante() ? (C().avisos || {}).visitante : (C().avisos || {}).comAcesso) || "sem acesso · ir para códigos? duplo clique";
  A.sufixo = () => (A.adm() ? ".ADM" : A.chaves().includes("tester") ? ".tester" : "");
  A.nome = (k) => (C().nomes || {})[k] || k;
  /* tenta um código numa linha ("adm", "tester" ou "avulso"); devolve { ok, chave } e grava se der certo.
     Cada código vale uma vez (β 4.2): se a chave já estiver gravada, devolve { ok: false, usado: true } e não roda animação. */
  A.tentar = (linha, texto) => {
    const t = norm(texto), cod = C().codigos || {}; if (!t) return { ok: false };
    const bate = (lista) => (lista || []).some((c) => norm(c) === t);
    let chave = null;
    if (linha === "adm" && bate(cod.adm)) chave = "adm";
    else if (linha === "tester" && bate(cod.tester)) chave = "tester";
    else if (linha === "avulso") chave = Object.keys(cod.avulsos || {}).find((k) => bate(cod.avulsos[k])) || null;
    if (!chave) return { ok: false };
    const ch = A.chaves(); if (ch.includes(chave)) return { ok: false, usado: true, chave };
    ch.push(chave); grava(ch);
    return { ok: true, chave };
  };
  A.zerar = () => grava([]);
  /* tranca um elemento da página: sem clique, dica ao passar o mouse e duplo clique leva aos códigos */
  A.trancar = (el) => {
    if (!el || el.dataset.trancado) return; el.dataset.trancado = "1"; el.classList.add("trancado"); el.setAttribute("data-dica", A.aviso()); el.setAttribute("aria-disabled", "true");
    el.addEventListener("click", (e) => { e.preventDefault(); e.stopImmediatePropagation(); }, true);
    el.addEventListener("dblclick", (e) => { e.preventDefault(); e.stopImmediatePropagation(); location.hash = "#/codigos"; }, true);
  };
  A.CADEADO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.3" fill="currentColor"/></svg>`;
})();
