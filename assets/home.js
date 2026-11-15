/* Tela inicial do projeto (rota #/home): título, ilustração girando, um botão por matéria (lidos de assets/materias.js)
   e o campo de pergunta (só o visual, "em breve"). Não mexe em nada do site de física: o botão Física só leva para #/inicio. */
(function () {
  "use strict";
  const J = (window.JARVIS = {});
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const ICONE = {
    atomo: `<svg viewBox="0 0 32 32" fill="none" stroke-width="1.6" aria-hidden="true"><ellipse cx="16" cy="16" rx="13" ry="5" style="stroke:var(--mC)"/><ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(60 16 16)" style="stroke:var(--mA)"/><ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(120 16 16)" style="stroke:var(--mU)"/><circle cx="16" cy="16" r="2.4" fill="currentColor"/></svg>`,
    frasco: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 4h8M13.5 4v8L6 25.5A2 2 0 0 0 7.8 28.5h16.4a2 2 0 0 0 1.8-3L18.5 12V4"/><path d="M9.5 20h13" style="stroke:var(--mN)"/><circle cx="14" cy="23.5" r="1.3" style="fill:var(--mN);stroke:none"/><circle cx="18.5" cy="24.5" r="1" style="fill:var(--mN);stroke:none"/></svg>`,
    integral: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M19.5 4.5c-2 0-2.6 1.8-2.9 4L14.4 23.5c-.3 2.2-.9 4-2.9 4" style="stroke:var(--mK2)" stroke-width="2.2" stroke-linecap="round"/><path d="M21 13l6 6M27 13l-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    cirilico: `<svg viewBox="0 0 32 32" aria-hidden="true"><text x="16" y="23" text-anchor="middle" style="font:700 19px var(--f-text);fill:currentColor">Я</text><path d="M6 27h20" style="stroke:var(--mR)" stroke-width="2" stroke-linecap="round"/></svg>`,
  };
  /* figura central (β 3.9): o desenho escolhido no painel da engrenagem, com cor e velocidade. Cadastro em assets/figuras.js.
     Guardada em jarvis:figura = { id, hue (null = acompanha a cor do tema), vel (0 = parado … 2) }; entra no exportar/importar. */
  const CHAVE_FIG = "jarvis:figura";
  const lerFig = () => { try { const o = JSON.parse(localStorage.getItem(CHAVE_FIG)); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } };
  J.figuraCfg = () => { const o = lerFig(), F = window.FIGURAS; return { id: F ? F.porId(o.id).id : "planeta", hue: typeof o.hue === "number" ? o.hue : null, vel: typeof o.vel === "number" ? Math.max(0, Math.min(2, o.vel)) : 1 }; };
  const tons = (h) => [`hsl(${h - 12}, 85%, 66%)`, `hsl(${h}, 80%, 60%)`, `hsl(${h + 14}, 88%, 56%)`]; /* os mesmos três tons do título */
  J.corFigura = (el, hue) => { if (hue === null) ["--fg1", "--fg2", "--fg3"].forEach((v) => el.style.removeProperty(v)); else tons(hue).forEach((c, k) => el.style.setProperty(`--fg${k + 1}`, c)); };
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
  const lerCor = () => { try { const v = JSON.parse(localStorage.getItem(CHAVE_COR)); return typeof v === "number" ? v : null; } catch (e) { return null; } };
  const gravarCor = (h) => { try { if (h === null) localStorage.removeItem(CHAVE_COR); else localStorage.setItem(CHAVE_COR, JSON.stringify(h)); } catch (e) {} };
  function aplicaCor(raiz, h) {
    if (h === null) { ["--jv1", "--jv2", "--jv3"].forEach((v) => raiz.style.removeProperty(v)); raiz.classList.remove("cor-propria"); return; }
    /* degradê com três tons vizinhos da cor escolhida */
    raiz.style.setProperty("--jv1", `hsl(${h - 12}, 85%, 66%)`);
    raiz.style.setProperty("--jv2", `hsl(${h}, 80%, 60%)`);
    raiz.style.setProperty("--jv3", `hsl(${h + 14}, 88%, 56%)`);
    raiz.classList.add("cor-propria");
  }
  J._aplicaCor = aplicaCor;
  function seletorCor(raiz) {
    const t = raiz.querySelector(".jv-titulo"), inp = raiz.querySelector(".jv-cor input"), bt = raiz.querySelector(".jv-cor button");
    const h0 = lerCor(); if (h0 !== null) inp.value = h0;
    aplicaCor(raiz, h0);
    inp.addEventListener("input", () => { const h = +inp.value; aplicaCor(raiz, h); gravarCor(h); });
    bt.addEventListener("click", () => { aplicaCor(raiz, null); gravarCor(null); inp.value = 50; });
    /* no celular não há "passar o mouse": tocar no título abre e fecha o seletor */
    t.querySelector("h1").addEventListener("click", () => t.classList.toggle("aberto"));
  }
  /* tocar fora do título fecha o seletor (um ouvinte só, para a página toda) */
  document.addEventListener("click", (ev) => { const t = document.querySelector(".jv-titulo.aberto"); if (t && !t.contains(ev.target)) t.classList.remove("aberto"); });
  function cartao(m) {
    const conteudo = `<span class="jv-ic" style="color:var(${esc(m.cor)})">${ICONE[m.icone] || ""}</span><span class="jv-nome">${esc(m.nome)}</span><span class="jv-desc">${esc(m.desc || "")}</span>${m.pronta ? "" : `<span class="jv-breve">em breve</span>`}`;
    return m.pronta
      ? `<a class="jv-mat" href="${esc(m.rota)}" style="--cor:var(${esc(m.cor)})" data-materia="${esc(m.id)}">${conteudo}</a>`
      : `<div class="jv-mat desativada" aria-disabled="true" title="${esc(m.nome)}: em breve" style="--cor:var(${esc(m.cor)})" data-materia="${esc(m.id)}">${conteudo}</div>`;
  }
  J.home = (el) => {
    const P = window.PROJETO || { nome: "Jarvis" }, mats = window.MATERIAS || [];
    el.innerHTML = `<div class="jv">
      <header class="jv-cab"><div class="jv-titulo" tabindex="-1"><h1 title="Passe o mouse para mudar a cor">${esc(P.nome)}${window.VERSAO ? `<span class="jv-ver">${esc(window.VERSAO)}</span>` : ""}</h1>
        <div class="jv-cor" role="group" aria-label="Cor do ${esc(P.nome)}"><label>cor<input type="range" min="0" max="${MATIZ_MAX}" step="1" value="50" aria-label="Cor, do vermelho ao lilás"></label><button type="button">voltar à cor original</button></div></div></header>
      <nav class="jv-materias" aria-label="Matérias">${mats.map(cartao).join("")}</nav>
      <div class="jv-ilu"></div>
      <div class="jv-linha">${J.botaoAdesivos ? J.botaoAdesivos() : ""}<form class="jv-pergunta" onsubmit="return false" aria-label="Perguntar ao ${esc(P.nome)} (em breve)">
        <input type="text" disabled placeholder="Perguntar algo ao ${esc(P.nome)}…" aria-label="Pergunta (em breve)">
        <button type="submit" disabled aria-label="Enviar (em breve)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
        <span class="jv-breve">em breve</span>
      </form></div>
    </div>`;
    seletorCor(el.querySelector(".jv"));
    J.desenhaFigura(el.querySelector(".jv-ilu"));
    if (J.adesivos) J.adesivos(el); /* adesivos (β 3.6): camada atrás da interface + painel da engrenagem */
  };
  /* rota de uma matéria registrada que ainda não existe (ex.: #/quimica/inicio): nunca tela em branco */
  J.emBreve = (el, m) => {
    el.innerHTML = `<div class="jv jv-so"><span class="jv-ic grande" style="color:var(${esc(m.cor)})">${ICONE[m.icone] || ""}</span><h1>${esc(m.nome)}</h1><p class="jv-breve">em breve</p><p class="jv-volta"><a href="#/home">← voltar para a tela inicial</a></p></div>`;
  };
  J.materia = (id) => (window.MATERIAS || []).find((m) => m.id === id);
})();
