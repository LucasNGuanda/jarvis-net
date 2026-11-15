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
  /* ---------- buraco negro (β 4.4: o MESMO desenho da animação do ADM; window.BURACO é usado pelas duas) ----------
     Disco de acreção: faixa contínua desfocada (gás quente) + riscos finos girando na velocidade de Kepler (Ω ∝ r^-1,5, os de dentro
     mais rápidos); anel de fótons; a parte de trás do disco curvada por cima da sombra (lente gravitacional) e um arco fraco por baixo.
     Cores fixas, quentes (como na animação); a "cor própria" do painel gira o matiz inteiro (filtro hue-rotate). */
  const CORES_BN = ["#fff7e0", "#ffe08a", "#ffc04d", "#ff9a2e", "#ff7a1a", "#e85a10", "#b83a08"];
  const velBN = (rx, R) => 190 / Math.pow(rx / R, 1.5);
  const BURACO = (window.BURACO = {
    /* centro (x, y), raio do horizonte R, instante t (s), brilho b (0…1), uid = sufixo dos ids internos (cada desenho na página usa um) */
    svg(x, y, R, t, b, uid = "a") {
      const meia = (lado) => `<g clip-path="url(#bn-${lado}-${uid})"><g style="filter:url(#bn-f-${uid})">` + Array.from({ length: 10 }, (_, k) => { const rx = R * (1.28 + 0.19 * k), c = CORES_BN[Math.min(6, Math.round(k * 0.7))];
          return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(rx * 0.24)}" style="fill:none;stroke:${c};stroke-width:${f1(R * 0.22)};opacity:${(b * 0.5 * (1 - k / 11)).toFixed(2)}"/>`; }).join("") + `</g>` +
        CORES_BN.map((c, k) => { const rx = R * (1.35 + 0.27 * k), v = velBN(rx, R);
          return `<ellipse class="bn-risco" data-v="${f1(v)}" cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(rx * 0.24)}" style="fill:none;stroke:${k < 2 ? "#fffaf0" : c};stroke-width:${f1(Math.max(1, R * 0.07))};stroke-linecap:round;stroke-dasharray:${f1(rx * 0.55)} ${f1(rx * 0.22)} ${f1(rx * 0.18)} ${f1(rx * 0.3)};stroke-dashoffset:${f1(-t * v)};opacity:${(b * 0.75 * (1 - 0.08 * k)).toFixed(2)}"/>`; }).join("") + `</g>`;
      return `<defs><radialGradient id="bn-g-${uid}"><stop offset="0" stop-color="#ffd27a" stop-opacity="${(0.6 * b).toFixed(2)}"/><stop offset=".45" stop-color="#ff9a2e" stop-opacity="${(0.22 * b).toFixed(2)}"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>
          <clipPath id="bn-cima-${uid}"><rect x="${f1(x - R * 6)}" y="${f1(y - R * 6)}" width="${f1(R * 12)}" height="${f1(R * 6)}"/></clipPath><clipPath id="bn-baixo-${uid}"><rect x="${f1(x - R * 6)}" y="${f1(y)}" width="${f1(R * 12)}" height="${f1(R * 6)}"/></clipPath>
          <filter id="bn-f-${uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${f1(Math.max(0.6, R * 0.07))}"/></filter></defs>
        <circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R * 4.2)}" style="fill:url(#bn-g-${uid})"/>
        ${meia("cima")}
        <ellipse cx="${f1(x)}" cy="${f1(y - R * 0.05)}" rx="${f1(R * 1.5)}" ry="${f1(R * 1.26)}" clip-path="url(#bn-cima-${uid})" style="fill:none;stroke:#ffd27a;stroke-width:${f1(R * 0.24)};opacity:${(0.85 * b).toFixed(2)};filter:url(#bn-f-${uid})"/>
        <ellipse cx="${f1(x)}" cy="${f1(y + R * 0.03)}" rx="${f1(R * 1.3)}" ry="${f1(R * 1.12)}" clip-path="url(#bn-baixo-${uid})" style="fill:none;stroke:#ffb04d;stroke-width:${f1(R * 0.1)};opacity:${(0.55 * b).toFixed(2)}"/>
        <circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R)}" style="fill:#000"/>
        <circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R * 1.05)}" style="fill:none;stroke:#fff3cf;stroke-width:${f1(Math.max(1.2, R * 0.035))};opacity:${(0.5 + 0.5 * b).toFixed(2)}"/>
        ${meia("baixo")}`;
    },
    /* gira um desenho já montado (só mexe nos riscos: barato para a figura que roda o tempo todo) */
    gira(raiz, t) { raiz.querySelectorAll(".bn-risco").forEach((e) => { e.style.strokeDashoffset = f1(-t * +e.dataset.v); }); },
  });
  const buraco = {
    id: "buraconegro", nome: "Buraco negro",
    svg(uid) { return `<svg class="jv-fig jv-bn" viewBox="-160 -130 320 260" role="img" aria-label="Buraco negro com disco de acreção girando">${BURACO.svg(0, 0, 40, 2, 0.95, uid)}</svg>`; },
    quadro(sv, t) { BURACO.gira(sv, t * 0.6); },
  };
  const FIGURAS = (window.FIGURAS = [planeta, galaxia, buraco]);
  FIGURAS.porId = (id) => FIGURAS.find((f) => f.id === id) || FIGURAS.find((f) => f.padrao);
})();
