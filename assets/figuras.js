/* Figuras centrais da tela inicial (β 3.9). CADASTRO: para acrescentar uma figura, acrescente um objeto em FIGURAS.
   Campos: id (único e permanente: fica salvo em jarvis:figura), nome (aparece no painel da engrenagem), padrao (só uma),
   svg(uid) → um <svg> com viewBox "-160 -130 320 260" (uid serve para ids internos: a miniatura do painel usa outro),
   quadro(sv, t) → desenha o instante t (em segundos de figura: já vem multiplicado pela velocidade escolhida).
   Estilo: arame luminoso, sem preenchimento pesado. Cores SEMPRE com var(--fg1), var(--fg2), var(--fg3): elas acompanham
   a cor do tema (o degradê do título) ou a cor escolhida no painel. */
(function () {
  "use strict";
  const f1 = (v) => v.toFixed(1);
  /* ---------- planeta com anel (o desenho original do Lucas: "fica rodando") ---------- */
  const R = 92, MERIDIANOS = 6, GIRO = Math.PI / 9, ORBITA = (2 * Math.PI) / 7;
  const planeta = {
    id: "planeta", nome: "Planeta com anel", padrao: true,
    svg(uid) {
      let mer = "", lat = "";
      for (let k = 0; k < MERIDIANOS; k++) mer += `<ellipse cx="0" cy="0" rx="${R}" ry="${R}" class="jv-mer"/>`;
      [-60, -30, 0, 30, 60].forEach((g) => { const y = R * Math.sin((g * Math.PI) / 180), rx = R * Math.cos((g * Math.PI) / 180); lat += `<ellipse cx="0" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(rx * 0.16)}" class="jv-lat"/>`; });
      return `<svg class="jv-fig jv-globo" viewBox="-160 -130 320 260" role="img" aria-label="Planeta girando com um anel em órbita">
        <defs><radialGradient id="luz-${uid}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="var(--fg3)" stop-opacity=".22"/><stop offset="1" stop-color="var(--fg2)" stop-opacity="0"/></radialGradient></defs>
        <g transform="rotate(-23)"><circle r="${R}" fill="url(#luz-${uid})" class="jv-borda"/>${lat}${mer}
        <g transform="rotate(18)"><ellipse rx="150" ry="34" class="jv-anel"/><circle r="5" cx="150" cy="0" class="jv-lua"/></g></g></svg>`;
    },
    quadro(sv, t) {
      sv.querySelectorAll(".jv-mer").forEach((e, k) => e.setAttribute("rx", f1(R * Math.abs(Math.cos((k * Math.PI) / MERIDIANOS + GIRO * t)))));
      const a = ORBITA * t, lua = sv.querySelector(".jv-lua");
      lua.setAttribute("cx", f1(150 * Math.cos(a))); lua.setAttribute("cy", f1(34 * Math.sin(a)));
      lua.style.opacity = Math.sin(a) < 0 && Math.abs(150 * Math.cos(a)) < R ? 0.3 : 1; /* atrás do planeta fica apagadinha */
    },
  };
  /* ---------- galáxia espiral: dois braços em espiral logarítmica (r = a·e^(bφ)), estrelas ao longo deles e núcleo brilhante ----------
     O desenho dos braços gira como um corpo rígido (é o "padrão" de onda de densidade, que gira com velocidade própria). */
  const A0 = 11, B0 = 0.22, PHI = 3.6 * Math.PI;
  const espiral = (fase, dr = 0) => { let d = ""; for (let k = 0; k <= 120; k++) { const p = (k / 120) * PHI, r = A0 * Math.exp(B0 * p) + dr; d += (k ? "L" : "M") + f1(r * Math.cos(p + fase)) + " " + f1(r * Math.sin(p + fase)); } return d; };
  let semente = 7; const aleat = () => ((semente = (semente * 16807) % 2147483647) / 2147483647); /* sorteio fixo: as estrelas são sempre as mesmas */
  const ESTRELAS = []; for (let b = 0; b < 2; b++) for (let k = 0; k < 34; k++) { const p = 0.3 + aleat() * (PHI - 0.4), r = A0 * Math.exp(B0 * p), j = (aleat() - 0.5) * 0.35 * r; ESTRELAS.push([(r + j) * Math.cos(p + b * Math.PI), (r + j) * Math.sin(p + b * Math.PI), 0.7 + aleat() * 1.3]); }
  for (let k = 0; k < 26; k++) { const a = aleat() * 2 * Math.PI, r = 24 + aleat() * 132; ESTRELAS.push([r * Math.cos(a), r * Math.sin(a), 0.5 + aleat() * 0.8]); }
  const galaxia = {
    id: "galaxia", nome: "Galáxia espiral",
    svg(uid) {
      return `<svg class="jv-fig jv-galaxia" viewBox="-160 -130 320 260" role="img" aria-label="Galáxia espiral girando devagar">
        <defs><radialGradient id="nuc-${uid}"><stop offset="0" stop-color="var(--fg3)" stop-opacity=".9"/><stop offset=".35" stop-color="var(--fg2)" stop-opacity=".35"/><stop offset="1" stop-color="var(--fg2)" stop-opacity="0"/></radialGradient></defs>
        <g transform="rotate(-18) scale(1 .6)"><g class="jv-gal-gira">
          <path d="${espiral(0)}" class="jv-braco"/><path d="${espiral(Math.PI)}" class="jv-braco"/>
          <path d="${espiral(0.32, -3)}" class="jv-braco2"/><path d="${espiral(Math.PI + 0.32, -3)}" class="jv-braco2"/>
          ${ESTRELAS.map(([x, y, r]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r.toFixed(2)}" class="jv-estrela"/>`).join("")}
          <circle r="34" fill="url(#nuc-${uid})"/><circle r="4.5" class="jv-nucleo"/></g></g></svg>`;
    },
    quadro(sv, t) { sv.querySelector(".jv-gal-gira").setAttribute("transform", `rotate(${f1((-8 * t) % 360)})`); },
  };
  /* ---------- buraco negro: disco de acreção girando (anéis de dentro mais rápidos, Ω ∝ r^-3/2, como Kepler), centro escuro e o anel de luz
     curvado por cima (a parte de trás do disco, desviada pela gravidade) e por baixo. A parte do disco atrás do centro fica escondida. ---------- */
  const ANEIS = [60, 76, 94, 114, 136];
  const per = (rx, ry) => 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2);
  const buraco = {
    id: "buraconegro", nome: "Buraco negro",
    svg(uid) {
      return `<svg class="jv-fig jv-bn" viewBox="-160 -130 320 260" role="img" aria-label="Buraco negro com disco de acreção girando">
        <defs><mask id="mk-${uid}" maskUnits="userSpaceOnUse" x="-160" y="-130" width="320" height="260"><rect x="-160" y="-130" width="320" height="260" fill="#fff"/><path d="M-39 0A39 39 0 0 1 39 0Z" fill="#000"/></mask></defs>
        <g transform="rotate(-10)">
          <path d="M-60 1C-60 -80 60 -80 60 1" class="jv-bn-lente"/><path d="M-60 1C-60 -70 60 -70 60 1" class="jv-bn-lente3"/><path d="M-47 5C-47 52 47 52 47 5" class="jv-bn-lente2"/>
          <circle r="35" class="jv-bn-centro"/><circle r="37.5" class="jv-bn-foton"/>
          <g mask="url(#mk-${uid})">${ANEIS.map((rx, k) => `<ellipse rx="${rx}" ry="${f1(rx * 0.2)}" class="jv-bn-anel" style="stroke-width:${(1.7 - k * 0.2).toFixed(2)};opacity:${(0.95 - k * 0.12).toFixed(2)}" data-l="${f1(per(rx, rx * 0.2))}"/>`).join("")}</g>
        </g></svg>`;
    },
    quadro(sv, t) {
      sv.querySelectorAll(".jv-bn-anel").forEach((e, k) => { const rx = ANEIS[k], L = +e.dataset.l, w = 1.4 * Math.pow(ANEIS[0] / rx, 1.5); e.style.strokeDashoffset = f1(-(((w * t) / (2 * Math.PI)) * L) % L); });
    },
  };
  const FIGURAS = (window.FIGURAS = [planeta, galaxia, buraco]);
  FIGURAS.porId = (id) => FIGURAS.find((f) => f.id === id) || FIGURAS.find((f) => f.padrao);
})();
