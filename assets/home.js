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
    cirilico: `<svg viewBox="0 0 32 32" aria-hidden="true"><text x="16" y="23" text-anchor="middle" style="font:700 19px var(--f-text);fill:currentColor">Я</text><path d="M6 27h20" style="stroke:var(--mT)" stroke-width="2" stroke-linecap="round"/></svg>`,
  };
  /* globo de arame girando, inclinado, com um anel em órbita (desenho do Lucas: "fica rodando") */
  /* globo de arame girando, inclinado, com um anel em órbita (desenho do Lucas: "fica rodando").
     Animado por requestAnimationFrame (β 3.0): a animação SVG (SMIL) parava quando a tela inicial era desenhada de novo. */
  const R = 92, MERIDIANOS = 6, GIRO = Math.PI / 9, ORBITA = (2 * Math.PI) / 7;
  function globo() {
    let mer = "";
    for (let k = 0; k < MERIDIANOS; k++) mer += `<ellipse cx="0" cy="0" rx="${R}" ry="${R}" class="jv-mer"/>`;
    let lat = "";
    [-60, -30, 0, 30, 60].forEach((g) => { const y = R * Math.sin((g * Math.PI) / 180), rx = R * Math.cos((g * Math.PI) / 180); lat += `<ellipse cx="0" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${(rx * 0.16).toFixed(1)}" class="jv-lat"/>`; });
    return `<svg class="jv-globo" viewBox="-160 -130 320 260" role="img" aria-label="Globo girando com um anel em órbita">
      <defs><radialGradient id="jv-luz" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="var(--jv3)" stop-opacity=".22"/><stop offset="1" stop-color="var(--jv2)" stop-opacity="0"/></radialGradient></defs>
      <g transform="rotate(-23)">
        <circle r="${R}" fill="url(#jv-luz)" class="jv-borda"/>
        ${lat}${mer}
        <g transform="rotate(18)"><ellipse rx="150" ry="34" class="jv-anel"/><circle r="5" cx="150" cy="0" class="jv-lua"/></g>
      </g>
    </svg>`;
  }
  /* desenha o quadro no instante t (s); devolve false se o globo saiu da página */
  function quadro(sv, t) {
    if (!sv.isConnected) return false;
    sv.querySelectorAll(".jv-mer").forEach((e, k) => e.setAttribute("rx", (R * Math.abs(Math.cos((k * Math.PI) / MERIDIANOS + GIRO * t))).toFixed(1)));
    const a = ORBITA * t, lua = sv.querySelector(".jv-lua");
    lua.setAttribute("cx", (150 * Math.cos(a)).toFixed(1)); lua.setAttribute("cy", (34 * Math.sin(a)).toFixed(1));
    lua.style.opacity = Math.sin(a) < 0 && Math.abs(150 * Math.cos(a)) < R ? 0.3 : 1; /* atrás do globo fica apagadinha */
    return true;
  }
  function anima(sv) {
    let parado = false; try { parado = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    const t0 = performance.now();
    if (parado) { quadro(sv, 2); return; }
    const laco = (agora) => { if (quadro(sv, (agora - t0) / 1000)) requestAnimationFrame(laco); };
    requestAnimationFrame(laco);
  }
  J._quadro = quadro;

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
      <div class="jv-ilu">${globo()}</div>
      <div class="jv-linha">${J.botaoAdesivos ? J.botaoAdesivos() : ""}<form class="jv-pergunta" onsubmit="return false" aria-label="Perguntar ao ${esc(P.nome)} (em breve)">
        <input type="text" disabled placeholder="Perguntar algo ao ${esc(P.nome)}…" aria-label="Pergunta (em breve)">
        <button type="submit" disabled aria-label="Enviar (em breve)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
        <span class="jv-breve">em breve</span>
      </form></div>
    </div>`;
    seletorCor(el.querySelector(".jv"));
    anima(el.querySelector(".jv-globo"));
    if (J.adesivos) J.adesivos(el); /* adesivos (β 3.6): camada atrás da interface + painel da engrenagem */
  };
  /* rota de uma matéria registrada que ainda não existe (ex.: #/quimica/inicio): nunca tela em branco */
  J.emBreve = (el, m) => {
    el.innerHTML = `<div class="jv jv-so"><span class="jv-ic grande" style="color:var(${esc(m.cor)})">${ICONE[m.icone] || ""}</span><h1>${esc(m.nome)}</h1><p class="jv-breve">em breve</p><p class="jv-volta"><a href="#/home">← voltar para a tela inicial</a></p></div>`;
  };
  J.materia = (id) => (window.MATERIAS || []).find((m) => m.id === id);
})();
