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
  function globo() {
    const R = 92, meridianos = 6, amostras = 13;
    let mer = "";
    for (let k = 0; k < meridianos; k++) {
      const fase = (k * Math.PI) / meridianos, vals = [];
      for (let i = 0; i < amostras; i++) vals.push((R * Math.abs(Math.cos(fase + (i * Math.PI) / (amostras - 1)))).toFixed(1));
      mer += `<ellipse cx="0" cy="0" rx="${vals[0]}" ry="${R}" class="jv-mer"><animate attributeName="rx" dur="9s" repeatCount="indefinite" values="${vals.join(";")}"/></ellipse>`;
    }
    let lat = "";
    [-60, -30, 0, 30, 60].forEach((g) => { const y = R * Math.sin((g * Math.PI) / 180), rx = R * Math.cos((g * Math.PI) / 180); lat += `<ellipse cx="0" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${(rx * 0.16).toFixed(1)}" class="jv-lat"/>`; });
    return `<svg class="jv-globo" viewBox="-160 -130 320 260" role="img" aria-label="Globo girando com um anel em órbita">
      <defs><radialGradient id="jv-luz" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="var(--mO)" stop-opacity=".22"/><stop offset="1" stop-color="var(--mA)" stop-opacity="0"/></radialGradient></defs>
      <g transform="rotate(-23)">
        <circle r="${R}" fill="url(#jv-luz)" class="jv-borda"/>
        ${lat}${mer}
        <ellipse rx="150" ry="34" class="jv-anel" transform="rotate(18)"/>
        <circle r="5" class="jv-lua"><animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path="M150 0 A150 34 0 1 1 -150 0 A150 34 0 1 1 150 0" transform="rotate(18)"/></circle>
      </g>
    </svg>`;
  }
  function cartao(m) {
    const conteudo = `<span class="jv-ic" style="color:var(${esc(m.cor)})">${ICONE[m.icone] || ""}</span><span class="jv-nome">${esc(m.nome)}</span><span class="jv-desc">${esc(m.desc || "")}</span>${m.pronta ? "" : `<span class="jv-breve">em breve</span>`}`;
    return m.pronta
      ? `<a class="jv-mat" href="${esc(m.rota)}" style="--cor:var(${esc(m.cor)})" data-materia="${esc(m.id)}">${conteudo}</a>`
      : `<div class="jv-mat desativada" aria-disabled="true" title="${esc(m.nome)}: em breve" style="--cor:var(${esc(m.cor)})" data-materia="${esc(m.id)}">${conteudo}</div>`;
  }
  J.home = (el) => {
    const P = window.PROJETO || { nome: "Jarvis", subtitulo: "" }, mats = window.MATERIAS || [];
    el.innerHTML = `<div class="jv">
      <header class="jv-cab"><h1>${esc(P.nome)}</h1><p>${esc(P.subtitulo)}</p></header>
      <nav class="jv-materias" aria-label="Matérias">${mats.map(cartao).join("")}</nav>
      <div class="jv-ilu">${globo()}</div>
      <form class="jv-pergunta" onsubmit="return false" aria-label="Perguntar ao ${esc(P.nome)} (em breve)">
        <input type="text" disabled placeholder="Perguntar algo ao ${esc(P.nome)}…" aria-label="Pergunta (em breve)">
        <button type="submit" disabled aria-label="Enviar (em breve)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
        <span class="jv-breve">em breve</span>
      </form>
    </div>`;
    const sv = el.querySelector(".jv-globo");
    try { if (sv && window.matchMedia("(prefers-reduced-motion: reduce)").matches) sv.pauseAnimations(); } catch (e) {}
  };
  /* rota de uma matéria registrada que ainda não existe (ex.: #/quimica/inicio): nunca tela em branco */
  J.emBreve = (el, m) => {
    el.innerHTML = `<div class="jv jv-so"><span class="jv-ic grande" style="color:var(${esc(m.cor)})">${ICONE[m.icone] || ""}</span><h1>${esc(m.nome)}</h1><p class="jv-breve">em breve</p><p class="jv-volta"><a href="#/home">← voltar para a tela inicial</a></p></div>`;
  };
  J.materia = (id) => (window.MATERIAS || []).find((m) => m.id === id);
})();
