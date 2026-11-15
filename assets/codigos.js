/* Página de códigos (#/codigos), página "sem acesso" e as animações de liberação (β 4.1).
   Quem vê o quê: assets/acesso-config.js. Motor: assets/acesso.js.
   Toda animação: um único SVG por cima da tela, redesenhado por requestAnimationFrame; dá para pular (botão ou Esc);
   com "reduzir movimento" do sistema, pula direto para o fim. */
(function () {
  "use strict";
  const J = window.JARVIS || (window.JARVIS = {});
  const AC = () => window.ACESSO;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const reduz = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  const f1 = (v) => (+v).toFixed(1);
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const suave = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
  const GLIFOS = "0123456789αβγδεζηθλμνξπρσφψωΣΔΩΦ∫∑∏∂∇∞≈≠≤≥√±×÷∈∀∃";
  const CIRIL = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ";

  /* ---------- página de códigos ---------- */
  const LINHAS = [
    { id: "adm", titulo: "Liberação ADM", sub: "destrava tudo" },
    { id: "tester", titulo: "Beta tester", sub: "destrava a Física inteira" },
    { id: "avulso", titulo: "Códigos avulsos", sub: "cada código destrava uma parte" },
  ];
  J.codigos = (el) => {
    el.innerHTML = `<div class="jv jv-codigos">
      <header class="cod-cab"><a class="cod-volta" href="#/home">← tela inicial</a><h1>Códigos de acesso</h1><p>Digite um código para destravar partes do ${esc((window.PROJETO || {}).nome || "Jarvis")}.</p></header>
      ${LINHAS.map((l, k) => `<section class="cod-linha" data-linha="${l.id}"><div class="cod-tit"><span class="cod-n">${k + 1}</span><b>${l.titulo}</b><small>${l.sub}</small></div>
        <form class="cod-form" autocomplete="off"><input type="text" spellcheck="false" autocapitalize="off" aria-label="Código: ${l.titulo}" placeholder="código"><button type="submit" class="bt pri">Liberar</button></form>
        <p class="cod-msg" aria-live="polite"></p></section>`).join("")}
      <section class="cod-estado"><div><b>Destravado agora</b><div class="cod-chips"></div></div><button type="button" class="bt" data-a="zerar">Voltar a visitante</button></section>
    </div>`;
    const pinta = () => { const ch = AC().chaves(); el.querySelector(".cod-chips").innerHTML = ch.length ? ch.map((k) => `<span class="cod-chip">${esc(AC().nome(k))}</span>`).join("") : `<span class="cod-chip vazio">nada (visitante)</span>`; J.pintaVersao(); };
    pinta();
    el.querySelectorAll(".cod-linha").forEach((sec) => {
      const inp = sec.querySelector("input"), msg = sec.querySelector(".cod-msg");
      sec.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        const r = AC().tentar(sec.dataset.linha, inp.value);
        if (!r.ok) { msg.textContent = r.usado ? "código já usado" : "código não reconhecido"; msg.className = "cod-msg erro"; clearTimeout(msg._t); msg._t = setTimeout(() => (msg.textContent = ""), 3000); return; } /* sem pista e sem animação */
        inp.value = ""; msg.textContent = ""; pinta();
        if (r.chave === "adm") animBuraco(); /* β 4.3: o ADM tem o buraco negro; o tester continua com o livro e o feixe verde */
        else if (r.chave === "tester") animLivro("tester");
        else animAvulso(r.chave, () => toast("acesso liberado · " + AC().nome(r.chave)));
      });
    });
    el.querySelector("[data-a=zerar]").addEventListener("click", () => { AC().zerar(); pinta(); toast("você voltou a visitante"); });
  };
  /* página de algo trancado (rota direta, link antigo…) */
  J.bloqueado = (el, nome) => {
    el.innerHTML = `<div class="jv jv-so jv-bloq"><span class="jv-ic grande">${AC().CADEADO}</span><h1>${esc(nome || "Trancado")}</h1><p class="jv-breve">${AC().visitante() ? "sem acesso" : "em construção"}</p>
      <p class="jv-volta"><a class="bt pri" href="#/codigos">ir para códigos</a> &nbsp; <a href="#/home">← tela inicial</a></p></div>`;
  };
  /* versão com o sufixo do acesso (".ADM", ".tester") na tela inicial e no topo */
  J.pintaVersao = () => { const s = AC() ? AC().sufixo() : "", v = document.getElementById("versao"); if (v) v.textContent = "Jarvis " + (window.VERSAO || "") + s; const j = document.querySelector(".jv-ver .jv-suf"); if (j && !j.dataset.segura) { j.textContent = s; j.classList.toggle("adm", s === ".ADM"); j.classList.toggle("tester", s === ".tester"); } }; /* β 4.4: ".ADM" dourado; β 4.5: ".tester" verde */

  /* ---------- aviso "acesso liberado" ---------- */
  function toast(txt) {
    const t = document.createElement("div"); t.className = "toast-acesso"; t.setAttribute("role", "status"); t.textContent = txt; document.body.appendChild(t);
    setTimeout(() => t.classList.add("sai"), 2600); setTimeout(() => t.remove(), 3200);
  }
  J.toastAcesso = toast;

  /* ---------- palco comum das animações ---------- */
  function palco(opaco) {
    const d = document.createElement("div"); d.className = "anim-acesso" + (opaco ? " cheia" : ""); d.setAttribute("aria-hidden", "true");
    d.innerHTML = `<svg width="100%" height="100%"></svg><button type="button" class="anim-pular" aria-label="Pular a animação">pular ⏭</button>`;
    document.body.appendChild(d);
    return { d, sv: d.querySelector("svg"), W: innerWidth, H: innerHeight };
  }
  /* roda desenha(t) até duracao; pular() vai direto para o fim. fim() é chamado uma vez só */
  function roda(p, duracao, desenha, fim) {
    let t0 = null, acabou = false;
    const termina = () => { if (acabou) return; acabou = true; document.removeEventListener("keydown", tecla); p.d.remove(); fim && fim(); };
    const tecla = (e) => { if (e.key === "Escape") termina(); };
    document.addEventListener("keydown", tecla); p.d.querySelector(".anim-pular").addEventListener("click", termina);
    if (reduz()) { termina(); return termina; }
    const q = (agora) => { if (acabou) return; if (t0 === null) t0 = agora; const t = (agora - t0) / 1000; try { desenha(t); } catch (e) { termina(); return; } if (t >= duracao) termina(); else requestAnimationFrame(q); };
    requestAnimationFrame(q);
    return termina;
  }
  J._rodaAnim = roda; /* para os testes */

  /* ---------- ANIMAÇÃO DO TESTER: o livro (até a β 4.2 era também a do ADM) ---------- */
  function livroSVG(o, brilho, cor) { /* livro centrado em (0,0); o = abertura 0…1; brilho = 0…1 */
    const xc = 80 * Math.cos(Math.PI * o), lev = 8 * Math.sin(Math.PI * o);
    const capa = `<path d="M0 -56L${f1(xc)} ${f1(-56 - lev)}L${f1(xc)} ${f1(56 - lev)}L0 56Z" style="fill:#3a2a1c;stroke:${cor};stroke-width:2.5"/>`;
    const linhas = (x0, w) => Array.from({ length: 7 }, (_, k) => `<line x1="${f1(x0 + 8)}" x2="${f1(x0 + w - 8)}" y1="${-36 + k * 12}" y2="${-36 + k * 12}" style="stroke:#b9a27a;stroke-width:1.3;opacity:${(0.25 + 0.5 * o).toFixed(2)}"/>`).join("");
    const pagD = `<rect x="0" y="-50" width="76" height="100" rx="2" style="fill:#f6ecd4"/>${linhas(0, 76)}`;
    const pagE = o > 0.02 ? `<rect x="${f1(-76 * o)}" y="-50" width="${f1(76 * o)}" height="100" rx="2" style="fill:#f6ecd4"/>${o > 0.5 ? linhas(-76 * o, 76 * o) : ""}` : "";
    const luz = brilho > 0 ? `<ellipse cx="0" cy="-6" rx="${f1(70 + 50 * brilho)}" ry="${f1(55 + 40 * brilho)}" style="fill:${cor};opacity:${(0.55 * brilho).toFixed(2)};filter:url(#fx-blur)"/><rect x="${f1(-76 * o)}" y="-50" width="${f1(76 * (1 + o))}" height="100" style="fill:#fff;opacity:${(0.75 * brilho * o).toFixed(2)}"/>` : "";
    return `<rect x="-6" y="-56" width="12" height="112" rx="3" style="fill:#2b1f15"/>` + (o < 0.5 ? pagD + pagE + capa : capa + pagD + pagE) + luz;
  }
  /* β 4.5 · TESTER: o livro já aparece ABERTO, num círculo de energia girando; os símbolos verdes chegam de TODOS os lados da tela,
     fazendo uma curva leve e encolhendo até entrar nas páginas; as páginas viram sozinhas e o livro brilha mais a cada símbolo
     absorvido; no auge sobe uma coluna de luz verde, clarão, tela do Jarvis e o livro voa até a versão (o mesmo caminho de antes). */
  function animLivro(tipo) {
    const p = palco(true), { W, H } = p, cx = W / 2, cy = H * 0.56, ESC = 1.7;
    const corFeixe = ["#e6ffef", "#5dff9b", "#16b85a"], corLivro = "#4dff8f", flash = "#ecfff2";
    const part = Array.from({ length: 38 }, (_, i) => ({ x: (((i * 37) % 100) / 100 - 0.5) * 120, v: 40 + ((i * 53) % 60), f: (i * 0.618) % 1, r: 1.2 + ((i * 7) % 4) * 0.6 }));
    const Rl = Math.hypot(W, H) * 0.52, N = 260, VERDES_COR = ["#eafff0", "#b6ffd0", "#7dffb2", "#d8fff0"];
    /* cada símbolo com o seu ritmo de troca (fr) e o seu tom de verde: nada de todos mudarem juntos */
    const verdes = Array.from({ length: N }, (_, i) => ({ a0: (((i * 137.508) % 360) * Math.PI) / 180, ts: 0.5 + (4.0 * i) / N + (((i * 13) % 10) / 10) * 0.2, T: 1.15 + (((i * 29) % 10) / 10) * 0.75, gira: (((i * 7) % 2) ? 1 : -1) * (0.35 + ((i * 11) % 10) / 25), c: (i * 31 + i * i * 7) % GLIFOS.length, fr: 3 + ((i * 17) % 7), cor: VERDES_COR[i % 4], tam: 20 + ((i * 11) % 16), R0: Rl * (0.95 + ((i * 17) % 10) / 50) }));
    let rota = null, voo = null, sufixo = null;
    const prepVoo = () => { /* caminho: do buraco negro (embaixo, à esquerda) → entre Química e Matemática → até a versão */
      const ilu = document.querySelector(".jv-ilu"), q = document.querySelector('.jv-mat[data-materia="quimica"]'), m = document.querySelector('.jv-mat[data-materia="matematica"]'), v = document.querySelector(".jv-ver");
      if (!ilu || !q || !m || !v) return null;
      const a = ilu.getBoundingClientRect(), qr = q.getBoundingClientRect(), mr = m.getBoundingClientRect(), vr = v.getBoundingClientRect();
      const P0 = [a.left + a.width * 0.2, a.top + a.height * 0.78], P1 = [(qr.right + mr.left) / 2, (qr.top + qr.bottom) / 2], P2 = [vr.right + 4, vr.top + vr.height * 0.55];
      return { P0, C1: [P0[0] - 150, (P0[1] + P1[1]) / 2 + 30], P1, C2: [P1[0] + 30, P2[1] + 60], P2 };
    };
    const bez = (A, C, B, u) => [(1 - u) * (1 - u) * A[0] + 2 * (1 - u) * u * C[0] + u * u * B[0], (1 - u) * (1 - u) * A[1] + 2 * (1 - u) * u * C[1] + u * u * B[1]];
    const ponto = (u) => (u < 0.5 ? bez(voo.P0, voo.C1, voo.P1, u * 2) : bez(voo.P1, voo.C2, voo.P2, (u - 0.5) * 2));
    const defs = `<defs><linearGradient id="fx-feixe" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${corFeixe[0]}" stop-opacity=".95"/><stop offset=".55" stop-color="${corFeixe[1]}" stop-opacity=".6"/><stop offset="1" stop-color="${corFeixe[2]}" stop-opacity="0"/></linearGradient><filter id="fx-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter><filter id="fx-blur2" x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation="6"/></filter></defs>`;
    const vaiParaHome = () => { if (location.hash !== "#/home") location.hash = "#/home"; };
    const seguraSufixo = () => { const s = document.querySelector(".jv-ver .jv-suf"); if (s && s !== sufixo) { sufixo = s; s.dataset.segura = "1"; s.textContent = ""; } };
    const revela = () => { const s = document.querySelector(".jv-ver .jv-suf"); if (s) { delete s.dataset.segura; s.textContent = AC().sufixo(); s.classList.toggle("tester", AC().sufixo() === ".tester"); s.classList.remove("chega"); void s.offsetWidth; s.classList.add("chega"); } J.pintaVersao(); };
    /* trajeto de um símbolo: da borda até o livro, com uma curva leve (gira) e acelerando no fim */
    const trajeto = (g, u) => { const r = 30 + (g.R0 - 30) * (1 - Math.pow(u, 1.8)), a = g.a0 + g.gira * u; return [cx + r * Math.cos(a), cy - 10 + r * Math.sin(a) * 0.9, r]; };
    /* página virando por cima do livro aberto (coordenadas do livro, antes da escala): fase 0…1 da direita para a esquerda */
    const pagina = (f) => { const c = Math.cos(Math.PI * f), w = 76 * Math.abs(c), lev = 14 * Math.sin(Math.PI * f), x = c >= 0 ? 0 : -w;
      return `<path d="M${f1(x)} ${f1(-50 - lev * (c >= 0 ? 0 : 1))}L${f1(x + w)} ${f1(-50 - lev * (c >= 0 ? 1 : 0))}L${f1(x + w)} ${f1(50 - lev * (c >= 0 ? 1 : 0))}L${f1(x)} ${f1(50 - lev * (c >= 0 ? 0 : 1))}Z" style="fill:#fbf6e6;stroke:#c9e9d2;stroke-width:1;opacity:.96"/>`; };
    const desenha = (t) => {
      let h = defs;
      const fundo = t < 5.5 ? suave(t / 0.6) * 0.94 : 0.94 * (1 - suave((t - 5.5) / 0.6));
      if (fundo > 0) h += `<rect width="${W}" height="${H}" style="fill:#020a06;opacity:${fundo.toFixed(3)}"/>`;
      if (t < 5.6) {
        const ap = suave((t - 0.25) / 0.7), absorvido = verdes.filter((g) => t >= g.ts + g.T).length / N, auge = suave((t - 4.3) / 0.7);
        const brilho = Math.min(1, 0.15 + 0.85 * absorvido + 0.3 * auge) * ap;
        /* círculo de energia no chão do livro: dois anéis tracejados girando em sentidos opostos e símbolos em volta */
        const Rc = 150 + 30 * brilho;
        h += `<g style="opacity:${(ap * (0.45 + 0.55 * brilho)).toFixed(2)}"><ellipse cx="${f1(cx)}" cy="${f1(cy + 70)}" rx="${f1(Rc)}" ry="${f1(Rc * 0.28)}" style="fill:none;stroke:#5dff9b;stroke-width:2;stroke-dasharray:14 8;stroke-dashoffset:${f1(t * 60)}"/><ellipse cx="${f1(cx)}" cy="${f1(cy + 70)}" rx="${f1(Rc * 0.78)}" ry="${f1(Rc * 0.22)}" style="fill:none;stroke:#16b85a;stroke-width:1.6;stroke-dasharray:4 10;stroke-dashoffset:${f1(-t * 45)}"/>`;
        for (let k = 0; k < 12; k++) { const a = (k / 12) * 2 * Math.PI + t * 0.5; h += `<text x="${f1(cx + Rc * 0.9 * Math.cos(a))}" y="${f1(cy + 70 + Rc * 0.25 * Math.sin(a))}" text-anchor="middle" dominant-baseline="central" style="font:700 12px monospace;fill:#8dffb5;opacity:${(0.4 + 0.5 * (Math.sin(a) + 1) / 2).toFixed(2)}">${GLIFOS[(k * 5 + Math.floor(t * 3)) % GLIFOS.length]}</text>`; }
        h += `</g>`;
        /* no auge: coluna de luz verde subindo do livro */
        if (auge > 0) { const hb = (cy - 40) * auge, lw = 70 + 40 * auge; h += `<rect x="${f1(cx - lw)}" y="${f1(cy - 40 - hb)}" width="${f1(2 * lw)}" height="${f1(hb)}" style="fill:url(#fx-feixe);opacity:${(0.6 * auge).toFixed(2)};filter:url(#fx-blur2)"/>`; }
        /* os símbolos verdes chegando de todos os lados */
        verdes.forEach((g) => { const u = (t - g.ts) / g.T; if (u <= 0 || u >= 1) return; const [x, y, r] = trajeto(g, u), op = Math.min(1, u / 0.1) * cl((r - 34) / 60), tam = g.tam * (0.42 + 0.58 * Math.min(1, r / 280));
          if (op <= 0.01) return; const ch = GLIFOS[(g.c + Math.floor(t * g.fr)) % GLIFOS.length];
          for (let k = 2; k >= 1; k--) { const [xr, yr] = trajeto(g, Math.max(0, u - k * 0.035)); h += `<text x="${f1(xr)}" y="${f1(yr)}" text-anchor="middle" dominant-baseline="central" style="font:800 ${f1(tam * (1 - 0.15 * k))}px monospace;fill:#2ee59d;opacity:${(op * (0.32 - 0.12 * k)).toFixed(2)}">${ch}</text>`; } /* rastro curto */
          h += `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" dominant-baseline="central" style="font:800 ${f1(tam)}px monospace;fill:${g.cor};stroke:#06401f;stroke-width:${f1(tam * 0.2)}px;paint-order:stroke;opacity:${op.toFixed(2)}">${ch}</text>`; });
        if (brilho > 0.2) part.forEach((pt) => { const u = (t * pt.v / 140 + pt.f) % 1; h += `<circle cx="${f1(cx + pt.x * 1.6 * (0.4 + u))}" cy="${f1(cy - 70 - u * 260 * brilho)}" r="${pt.r}" style="fill:${corFeixe[1]};opacity:${((1 - u) * brilho).toFixed(2)}"/>`; });
        /* o livro, já aberto, com as páginas virando sozinhas (uma a cada 0,55 s) */
        const fase = t > 1.0 && t < 5.0 ? ((t - 1.0) / 0.55) % 1 : -1;
        h += `<g transform="translate(${f1(cx)} ${f1(cy)}) scale(${(ESC * (0.55 + 0.45 * ap)).toFixed(3)})" style="opacity:${ap.toFixed(2)}">${livroSVG(1, brilho, corLivro)}${fase >= 0 ? pagina(fase) : ""}</g>`;
      }
      if (t >= 5.0 && t < 6.4) { const fl = t < 5.5 ? suave((t - 5.0) / 0.5) : 1 - suave((t - 5.5) / 0.9); h += `<rect width="${W}" height="${H}" style="fill:${flash};opacity:${fl.toFixed(3)}"/>`; }
      if (t >= 5.45 && !rota) { rota = 1; vaiParaHome(); }
      if (t >= 5.5) seguraSufixo();
      if (t >= 5.6 && !voo) voo = prepVoo();
      if (voo && t >= 5.6 && t < 8.3) { /* o livro voa até a versão (caminho de sempre) */
        const u = suave((t - 5.7) / 2.5), [x, y] = ponto(u), [x2, y2] = ponto(Math.min(1, u + 0.01)), ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI * 0.15, sc = 0.55 - 0.33 * u;
        for (let k = 1; k <= 10; k++) { const [tx, ty] = ponto(Math.max(0, u - k * 0.016)); h += `<text x="${f1(tx)}" y="${f1(ty)}" text-anchor="middle" dominant-baseline="central" style="font:700 ${f1(13 - k * 0.7)}px monospace;fill:${corFeixe[1]};opacity:${(0.75 - k * 0.065).toFixed(2)}">${GLIFOS[(k * 7 + Math.floor(t * 12)) % GLIFOS.length]}</text>`; }
        h += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)}) scale(${sc.toFixed(3)})">${livroSVG(1, 0.5, corLivro)}</g>`;
      }
      if (voo && t >= 8.2) { /* colisão: brilhinho de impacto e o ".tester" aparece */
        if (!desenha.bateu) { desenha.bateu = 1; revela(); }
        const b = suave((t - 8.2) / 0.8), [x, y] = voo.P2;
        h += Array.from({ length: 14 }, (_, k) => { const a = (k / 14) * 2 * Math.PI, r0 = 6 + 36 * b, r1 = r0 + 11 * (1 - b); return `<line x1="${f1(x + r0 * Math.cos(a))}" y1="${f1(y + r0 * Math.sin(a))}" x2="${f1(x + r1 * Math.cos(a))}" y2="${f1(y + r1 * Math.sin(a))}" style="stroke:${k % 2 ? corFeixe[1] : corFeixe[0]};stroke-width:2.4;stroke-linecap:round;opacity:${(1 - b).toFixed(2)}"/>`; }).join("") + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(4 + 22 * b)}" style="fill:${corFeixe[0]};opacity:${(0.7 * (1 - b)).toFixed(2)}"/>`;
      }
      p.sv.innerHTML = h;
    };
    roda(p, 9.1, desenha, () => { vaiParaHome(); setTimeout(() => { revela(); J.pintaVersao(); }, 60); });
  }

  /* ---------- ANIMAÇÃO ADM (β 4.3): o buraco negro que engole todo o conhecimento ----------
     0–0,6 s a tela escurece · 0,3–1,3 s o buraco negro aparece (disco de acreção girando, anel de fótons, estrelas em volta
     desviadas pela lente gravitacional) · 1,0–5,2 s símbolos de todas as matérias chegam de todos os lados, espiralando
     (θ = θ₀ + 2,6·ln(R₀/r): giram mais rápido quanto mais perto) e esticando na direção do movimento; cada um engolido deixa o
     buraco maior e mais brilhante · 5,0–6,4 s clarão e tela do Jarvis · 5,6–7,0 s (β 4.4) o buraco negro desce até o meio e toma
     o lugar da figura central (que passa a ser o buraco negro, salvo) · 7,0 s EXPLOSÃO: clarão, ondas de choque, faíscas e cacos
     de símbolos, tela tremendo · a onda chega à versão e acende o ".ADM" dourado. */
  const SABER = [
    ...["Я", "Ж", "Щ", "Ф", "Ы", "Э", "Ю", "Б", "Д", "Л"].map((c) => [c, "#a9d8ff"]),
    ...["∫", "∑", "∮", "∂", "∇", "√", "∞", "∏", "∬"].map((c) => [c, "#e3c6ff"]),
    ...["E=mc²", "F=ma", "pV=nRT", "ħω", "λ=h/p", "∇·E=ρ/ε₀", "v=√(2gh)", "ΔS≥0", "F=GMm/r²", "p=mv", "ΔxΔp≥ħ/2"].map((c) => [c, "#ffe08a"]),
    ...["H₂O", "NaCl", "CO₂", "CH₄", "C₆H₁₂O₆", "2H₂+O₂→2H₂O", "NH₃", "H₂SO₄", "Fe³⁺"].map((c) => [c, "#a8f0c8"]),
    ...["ॐ", "क", "ज्ञ", "स", "ध", "श", "ऋ", "अ", "गी"].map((c) => [c, "#ffb48a"]),
    ...["0", "1", "2", "3", "5", "7", "8", "π", "φ", "α", "β", "Ω", "Σ", "λ", "μ", "e", "i"].map((c) => [c, "#ffffff"]),
  ];
  const buracoSVG = (x, y, R, t, b) => (window.BURACO ? window.BURACO.svg(x, y, R, t, b, "anim") : ""); /* desenho comum: assets/figuras.js (β 4.4) */
  function animBuraco() {
    const p = palco(true), { W, H } = p, cx = W / 2, cy = H * 0.5, Rb = Math.min(W, H) * 0.07, Rlonge = Math.hypot(W, H) * 0.46; /* nascem na borda da tela */
    const est = Array.from({ length: 170 }, (_, i) => ({ x: ((i * 7919) % 1000) / 1000 * W, y: ((i * 104729) % 997) / 997 * H, r: 0.5 + ((i * 31) % 10) / 8, f: (i * 0.37) % 6.28 }));
    const N = 220, sab = Array.from({ length: N }, (_, i) => { const [c, cor] = SABER[(i * 37) % SABER.length]; return { c, cor, ts: 0.7 + (3.8 * i) / N + (((i * 13) % 10) / 10) * 0.25, T: 1.4 + (((i * 29) % 10) / 10) * 0.8, a0: (((i * 61) % 360) * Math.PI) / 180, R0: Rlonge * (0.9 + ((i * 17) % 10) / 40), tam: 15 + ((i * 11) % 12) }; });
    const cacos = Array.from({ length: 46 }, (_, i) => { const [c, cor] = SABER[(i * 23) % SABER.length]; return { c, cor, a: (i / 46) * 2 * Math.PI + ((i * 7) % 10) * 0.05, v: 380 + ((i * 53) % 10) * 70, tam: 13 + ((i * 7) % 10) }; });
    let rota = null, alvo = null, sufixo = null, chegou = false, revelou = false;
    const R_FIM = Rb * 1.5; /* raio do buraco negro no auge (0,25 + 0,75)·(1 + 0,35 + 0,15) */
    /* β 4.4: o buraco negro vai para o MEIO da tela do Jarvis e toma o lugar da figura central; lá ele explode e a onda acende o ".ADM" */
    const prepAlvo = () => {
      const ilu = document.querySelector(".jv-ilu"), sv = ilu && ilu.querySelector("svg"), v = document.querySelector(".jv-ver"); if (!ilu || !sv) return null;
      const r = sv.getBoundingClientRect(), esc = Math.min(r.width / 320, r.height / 260), vr = v ? v.getBoundingClientRect() : null;
      ilu.style.visibility = "hidden"; /* a figura de antes some: quem ocupa o lugar é o buraco negro que está chegando */
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      return { ilu, x, y, R: 40 * esc, ver: vr ? [vr.right - 10, vr.top + vr.height * 0.55] : [x, 40] };
    };
    const assenta = () => { /* o buraco negro vira a figura central (fica salvo; dá para trocar na engrenagem) */
      if (J.figura) J.figura({ id: "buraconegro" }); const ilu = document.querySelector(".jv-ilu"); if (ilu) ilu.style.visibility = ""; };
    const vaiParaHome = () => { if (location.hash !== "#/home") location.hash = "#/home"; };
    const seguraSufixo = () => { const s = document.querySelector(".jv-ver .jv-suf"); if (s && s !== sufixo) { sufixo = s; s.dataset.segura = "1"; s.textContent = ""; } };
    const revela = () => { const s = document.querySelector(".jv-ver .jv-suf"); if (s) { delete s.dataset.segura; s.textContent = AC().sufixo(); s.classList.toggle("adm", AC().sufixo() === ".ADM"); s.classList.remove("chega"); void s.offsetWidth; s.classList.add("chega"); } J.pintaVersao(); };
    const treme = (k) => { const pg = document.getElementById("pagina"); if (pg) pg.style.transform = k ? `translate(${f1((Math.random() - 0.5) * 8 * k)}px, ${f1((Math.random() - 0.5) * 8 * k)}px)` : ""; };
    const espiral = (g, u, Rh) => { const r = Rh * 0.95 + (g.R0 - Rh * 0.95) * (1 - Math.pow(u, 2.4)), a = g.a0 + 2.6 * Math.log(g.R0 / r); return [cx + r * Math.cos(a), cy + r * Math.sin(a) * 0.8, r]; };
    const desenha = (t) => {
      let h = "";
      const fundo = t < 5.5 ? suave(t / 0.6) * 0.96 : 0.96 * (1 - suave((t - 5.5) / 0.6));
      if (fundo > 0) h += `<rect width="${W}" height="${H}" style="fill:#020309;opacity:${fundo.toFixed(3)}"/>`;
      if (t < 5.6) {
        const ap = suave((t - 0.3) / 1.0), comido = sab.filter((g) => t >= g.ts + g.T).length / N, auge = suave((t - 4.4) / 0.7);
        const R = Rb * (0.25 + 0.75 * ap) * (1 + 0.35 * comido + 0.15 * auge), b = Math.min(1, (0.35 + 0.65 * comido + 0.3 * auge) * ap) * (0.92 + 0.08 * Math.sin(t * 11));
        /* estrelas: cada uma aparece onde a lente gravitacional a desvia (imagem principal, empurrada para fora, e a secundária, do outro lado) */
        const tE = R * 2.3;
        est.forEach((e) => { const dx = e.x - cx, dy = e.y - cy, d = Math.hypot(dx, dy) || 1, raiz = Math.sqrt(d * d + 4 * tE * tE), d1 = (d + raiz) / 2, d2 = (d - raiz) / 2, br = (0.35 + 0.35 * Math.sin(t * 2 + e.f)) * fundo;
          h += `<circle cx="${f1(cx + (dx / d) * d1)}" cy="${f1(cy + (dy / d) * d1)}" r="${f1(e.r)}" style="fill:#dfe8ff;opacity:${br.toFixed(2)}"/>`;
          if (-d2 > R * 1.08 && -d2 < R * 3) h += `<circle cx="${f1(cx + (dx / d) * d2)}" cy="${f1(cy + (dy / d) * d2)}" r="${f1(e.r * 0.7)}" style="fill:#fff2d0;opacity:${(br * 0.6).toFixed(2)}"/>`; });
        /* o conhecimento sendo sugado */
        sab.forEach((g) => { const u = (t - g.ts) / g.T; if (u <= 0 || u >= 1) return;
          const [x, y, r] = espiral(g, u, R), [x2, y2] = espiral(g, Math.min(0.999, u + 0.01), R), ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
          const estica = Math.min(7, 1 + 5 * Math.pow((R * 1.7) / r, 1.5)), op = Math.min(1, u / 0.08) * cl((r - R * 1.05) / (R * 0.9)), tam = g.tam * (0.55 + 0.45 * Math.min(1, r / (R * 6)));
          if (op <= 0.01) return;
          h += `<text transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)}) scale(${estica.toFixed(2)} ${(1 / Math.sqrt(estica)).toFixed(2)})" text-anchor="middle" dominant-baseline="central" style="font:700 ${f1(tam)}px var(--f-text);fill:${g.cor};opacity:${op.toFixed(2)}">${g.c}</text>`; });
        h += buracoSVG(cx, cy, R, t, b);
      }
      if (t >= 5.0 && t < 6.4) { const fl = t < 5.5 ? suave((t - 5.0) / 0.5) : 1 - suave((t - 5.5) / 0.9); h += `<rect width="${W}" height="${H}" style="fill:#fff8e6;opacity:${fl.toFixed(3)}"/>`; }
      if (t >= 5.45 && !rota) { rota = 1; vaiParaHome(); }
      if (t >= 5.5) seguraSufixo();
      if (t >= 5.6 && !alvo) alvo = prepAlvo();
      if (alvo && t >= 5.6 && t < 7.0) { /* desce do meio da tela até o lugar da figura central, ajustando o tamanho */
        const u = suave((t - 5.6) / 1.4), x = cx + (alvo.x - cx) * u, y = cy + (alvo.y - cy) * u - 40 * Math.sin(Math.PI * u), R = R_FIM + (alvo.R - R_FIM) * u;
        h += buracoSVG(x, y, R, t, 1);
      }
      if (alvo && t >= 7.0) {
        if (!chegou) { chegou = true; assenta(); }
        const e = t - 7.0, { x, y } = alvo, Rmax = Math.hypot(W, H);
        if (e < 1.6) { /* EXPLOSÃO: clarão, três ondas de choque, faíscas e cacos de símbolos voando para fora, tela tremendo */
          const cl0 = 1 - suave(e / 0.55);
          h += `<rect width="${W}" height="${H}" style="fill:#fff2c8;opacity:${(0.75 * cl0).toFixed(3)}"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(30 + 160 * suave(e / 0.4))}" style="fill:#fffbe8;opacity:${(0.9 * cl0).toFixed(2)}"/>`;
          [0, 0.18, 0.36].forEach((d, k) => { const u = (e - d) / 1.3; if (u <= 0 || u >= 1) return; h += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(Rmax * suave(u))}" style="fill:none;stroke:${["#ffffff", "#ffd27a", "#ff9a2e"][k]};stroke-width:${f1(10 - 6 * u)};opacity:${(0.85 * (1 - u)).toFixed(2)}"/>`; });
          for (let k = 0; k < 40; k++) { const a = (k / 40) * 2 * Math.PI + k * 0.37, r0 = 20 + 700 * suave(e / 1.1) * (0.6 + ((k * 13) % 10) / 25), r1 = r0 + 26 * (1 - e / 1.6); h += `<line x1="${f1(x + r0 * Math.cos(a))}" y1="${f1(y + r0 * Math.sin(a))}" x2="${f1(x + r1 * Math.cos(a))}" y2="${f1(y + r1 * Math.sin(a))}" style="stroke:${k % 3 ? "#ffd27a" : "#ffffff"};stroke-width:2.2;stroke-linecap:round;opacity:${(1 - e / 1.6).toFixed(2)}"/>`; }
          cacos.forEach((c) => { const r = 40 + c.v * e * (1 - 0.25 * e); h += `<text x="${f1(x + r * Math.cos(c.a))}" y="${f1(y + r * Math.sin(c.a))}" text-anchor="middle" dominant-baseline="central" style="font:700 ${c.tam}px var(--f-text);fill:${c.cor};opacity:${(1 - e / 1.6).toFixed(2)}">${c.c}</text>`; });
          treme(e < 0.5 ? 1 - e / 0.5 : 0);
        } else treme(0);
        /* a onda de choque chega à versão: ".ADM" acende, dourado, com um brilho de impacto */
        const dV = Math.hypot(alvo.ver[0] - x, alvo.ver[1] - y), tV = 0.15 + 1.3 * 0.55 * (dV / Rmax); /* quando a primeira onda passa por lá (aprox.) */
        if (e >= tV && !revelou) { revelou = true; revela(); }
        if (revelou) { const b = suave((e - tV) / 0.9), [vx, vy] = alvo.ver; if (b < 1) h += `<circle cx="${f1(vx)}" cy="${f1(vy)}" r="${f1(6 + 34 * b)}" style="fill:#ffe9a8;opacity:${(0.6 * (1 - b)).toFixed(2)}"/>` + Array.from({ length: 12 }, (_, k) => { const a = (k / 12) * 2 * Math.PI, r0 = 6 + 30 * b, r1 = r0 + 10 * (1 - b); return `<line x1="${f1(vx + r0 * Math.cos(a))}" y1="${f1(vy + r0 * Math.sin(a))}" x2="${f1(vx + r1 * Math.cos(a))}" y2="${f1(vy + r1 * Math.sin(a))}" style="stroke:#ffd27a;stroke-width:2.2;stroke-linecap:round;opacity:${(1 - b).toFixed(2)}"/>`; }).join(""); }
      }
      p.sv.innerHTML = h;
    };
    roda(p, 9.0, desenha, () => { treme(0); if (!chegou) { chegou = true; if (J.figura) J.figura({ id: "buraconegro" }); } vaiParaHome(); setTimeout(() => { const ilu = document.querySelector(".jv-ilu"); if (ilu) ilu.style.visibility = ""; revela(); J.pintaVersao(); }, 60); });
  }

  /* ---------- ANIMAÇÕES DOS CÓDIGOS AVULSOS (2,6 s, sem tela cheia) ---------- */
  const AVULSAS = {
    /* maçã cai, bate e vira um átomo cujas órbitas se expandem pela tela e somem */
    fisica(W, H) { const cx = W / 2, cy = H * 0.5, R = Math.hypot(W, H) * 0.6;
      return (t) => { let h = "";
        if (t < 0.75) { const y = -40 + (cy + 40) * (t / 0.75) ** 2; h += `<g transform="translate(${f1(cx)} ${f1(y)})"><path d="M0 -6C-8 -14 -22 -9 -21 4C-20 16 -9 24 0 20C9 24 20 16 21 4C22 -9 8 -14 0 -6Z" style="fill:#e5484d;stroke:#ffb4b4;stroke-width:1.5"/><path d="M0 -6Q1 -14 5 -18" style="stroke:#7a4b2a;stroke-width:2.5;fill:none"/><path d="M3 -12Q11 -20 17 -14Q10 -8 3 -12Z" style="fill:#4caf50"/></g>`; }
        else { const u = suave((t - 0.75) / 1.85), r = 26 + (R - 26) * u, op = 1 - suave((t - 1.4) / 1.2);
          if (t < 1.0) h += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(30 + 120 * (t - 0.75))}" style="fill:none;stroke:#fff;stroke-width:2;opacity:${(1 - (t - 0.75) * 4).toFixed(2)}"/>`;
          [0, 60, 120].forEach((g, k) => { const cor = ["var(--mC)", "var(--mA)", "var(--mU)"][k]; h += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(r)}" ry="${f1(r * 0.36)}" transform="rotate(${g + t * 40} ${f1(cx)} ${f1(cy)})" style="fill:none;stroke:${cor};stroke-width:2.4;opacity:${op.toFixed(2)}"/>`;
            const a = t * (3 + k), ex = r * Math.cos(a), ey = r * 0.36 * Math.sin(a), gr = ((g + t * 40) * Math.PI) / 180; h += `<circle cx="${f1(cx + ex * Math.cos(gr) - ey * Math.sin(gr))}" cy="${f1(cy + ex * Math.sin(gr) + ey * Math.cos(gr))}" r="6" style="fill:${cor};opacity:${op.toFixed(2)}"/>`; });
          h += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="12" style="fill:var(--mM);opacity:${op.toFixed(2)}"/>`; }
        return h; }; },
    /* espiral áurea se desenhando do centro, com números e símbolos aparecendo ao longo dela */
    matematica(W, H) { const cx = W / 2, cy = H / 2, b = Math.log((1 + Math.sqrt(5)) / 2) / (Math.PI / 2), a = 3, tmax = Math.log(Math.min(W, H) * 0.55 / a) / b, SIMB = ["1", "1", "2", "3", "5", "8", "φ", "π", "∑", "∫", "√2", "e", "∞"];
      return (t) => { const th = tmax * suave(t / 1.9), op = 1 - suave((t - 2.0) / 0.6); let d = "";
        for (let k = 0; k <= 160; k++) { const q = (th * k) / 160, r = a * Math.exp(b * q); d += (k ? "L" : "M") + f1(cx + r * Math.cos(q)) + " " + f1(cy - r * Math.sin(q)); }
        let h = `<path d="${d}" style="fill:none;stroke:var(--mK2);stroke-width:3;stroke-linecap:round;opacity:${op.toFixed(2)}"/>`;
        SIMB.forEach((s, k) => { const q = ((k + 1) * Math.PI) / 2.2; if (q > th) return; const r = a * Math.exp(b * q); h += `<text x="${f1(cx + (r + 16) * Math.cos(q))}" y="${f1(cy - (r + 16) * Math.sin(q))}" text-anchor="middle" style="font:700 ${f1(14 + Math.min(24, r / 14))}px var(--f-text);fill:var(--mC);opacity:${op.toFixed(2)}">${s}</text>`; });
        return h; }; },
    /* líquido sobe enchendo a tela, com bolhas, e muda de cor no meio (a titulação virando) */
    quimica(W, H) { const bol = Array.from({ length: 34 }, (_, i) => ({ x: ((i * 61) % 100) / 100, v: 120 + ((i * 37) % 160), f: (i * 0.41) % 1, r: 3 + ((i * 7) % 6) }));
      return (t) => { const n = suave(t / 1.5), top = H * (1 - n), vira = suave((t - 0.9) / 0.5), op = 1 - suave((t - 1.95) / 0.65);
        const c1 = [120, 205, 255], c2 = [255, 79, 179], c = c1.map((x, k) => Math.round(x + (c2[k] - x) * vira)), cor = `rgb(${c.join(",")})`;
        let onda = `M0 ${f1(top)}`; for (let x = 0; x <= W; x += 24) onda += `L${x} ${f1(top + 7 * Math.sin(x / 50 + t * 6))}`;
        let h = `<path d="${onda}L${W} ${H}L0 ${H}Z" style="fill:${cor};opacity:${(0.42 * op).toFixed(2)}"/><path d="${onda}" style="fill:none;stroke:${cor};stroke-width:2.5;opacity:${op.toFixed(2)}"/>`;
        bol.forEach((b) => { const y = H - ((t * b.v + b.f * H) % H); if (y > top + 8) h += `<circle cx="${f1(b.x * W + 6 * Math.sin(t * 5 + b.f * 9))}" cy="${f1(y)}" r="${b.r}" style="fill:none;stroke:#fff;stroke-width:1.4;opacity:${(0.6 * op).toFixed(2)}"/>`; });
        return h; }; },
    /* letras cirílicas caem como neve e se juntam no centro formando o Я, que brilha e some */
    idiomas(W, H) { const cx = W / 2, cy = H / 2, L = Array.from({ length: 46 }, (_, i) => ({ x: ((i * 53) % 100) / 100 * W, y0: -40 - ((i * 31) % 100) / 100 * H * 0.6, v: 90 + ((i * 17) % 80), c: CIRIL[(i * 7) % CIRIL.length], s: 16 + ((i * 11) % 18) }));
      return (t) => { const junta = suave((t - 0.9) / 0.8), ya = suave((t - 1.4) / 0.4), some = suave((t - 2.05) / 0.55); let h = "";
        L.forEach((l) => { const xn = l.x + 18 * Math.sin(t * 2 + l.s), yn = l.y0 + l.v * t, x = xn + (cx - xn) * junta, y = yn + (cy - yn) * junta; h += `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" style="font:600 ${l.s}px var(--f-text);fill:var(--mR);opacity:${(0.85 * (1 - ya)).toFixed(2)}">${l.c}</text>`; });
        if (ya > 0) h += `<circle cx="${f1(cx)}" cy="${f1(cy - 30)}" r="${f1(70 + 40 * ya)}" style="fill:var(--mR);opacity:${(0.25 * ya * (1 - some)).toFixed(2)};filter:url(#fx-b)"/><text x="${f1(cx)}" y="${f1(cy + 40)}" text-anchor="middle" style="font:800 ${f1(120 + 40 * ya)}px var(--f-text);fill:#fff;stroke:var(--mR);stroke-width:3;opacity:${(ya * (1 - some)).toFixed(2)}">Я</text>`;
        return `<defs><filter id="fx-b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter></defs>` + h; }; },
    /* a tela vira uma cartela de adesivos; vários caem e grudam, depois somem */
    config(W, H) { const A = window.ADESIVOS, lista = A ? ["maca", "atomo", "pi", "benzeno", "matrioska", "gato", "medalha", "koch"].map((id) => A.porId(id)).filter(Boolean) : [];
      const cw = Math.min(W * 0.62, 640), ch = Math.min(H * 0.6, 420), x0 = (W - cw) / 2, y0 = (H - ch) / 2, cols = 4, lado = Math.min(cw / cols, ch / 2) * 0.7;
      return (t) => { const ap = suave(t / 0.35), some = suave((t - 2.0) / 0.6), op = ap * (1 - some);
        let h = `<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(cw)}" height="${f1(ch)}" rx="22" style="fill:var(--card);stroke:var(--line2);stroke-width:2;opacity:${(0.96 * op).toFixed(2)}"/>`;
        for (let k = 0; k < 8; k++) { const sx = x0 + (cw / cols) * ((k % cols) + 0.5), sy = y0 + (ch / 2) * (Math.floor(k / cols) + 0.5); h += `<rect x="${f1(sx - lado / 2 - 6)}" y="${f1(sy - lado / 2 - 6)}" width="${f1(lado + 12)}" height="${f1(lado + 12)}" rx="12" style="fill:none;stroke:var(--line2);stroke-dasharray:5 5;opacity:${op.toFixed(2)}"/>`; }
        lista.forEach((a, k) => { const sx = x0 + (cw / cols) * ((k % cols) + 0.5), sy = y0 + (ch / 2) * (Math.floor(k / cols) + 0.5), ti = 0.35 + k * 0.12, u = suave((t - ti) / 0.45); if (u <= 0) return;
          const y = sy - (1 - u) * (sy + lado), quica = u >= 1 ? 1 : 1 + 0.12 * Math.sin(u * Math.PI), rot = ((k * 37) % 21) - 10;
          h += `<g transform="translate(${f1(sx)} ${f1(y)}) rotate(${rot}) scale(${quica.toFixed(3)})" style="opacity:${(1 - some).toFixed(2)}"><svg x="${f1(-lado / 2)}" y="${f1(-lado / 2)}" width="${f1(lado)}" height="${f1(lado)}" viewBox="0 0 100 100">${a.desenho(A.cor(a))}</svg></g>`; });
        return h; }; },
    /* β 4.2 · alemão: três engrenagens se encaixam e giram (dentes engrenados de verdade: R₁·ω₁ = R₂·ω₂), com letras góticas aparecendo e sumindo */
    alemao(W, H) { const cx = W / 2, cy = H / 2, m = Math.min(W, H) / 64, FR = "'UnifrakturMaguntia',serif";
      try { document.fonts && document.fonts.load("40px UnifrakturMaguntia"); } catch (e) {}
      const eng = (x, y, n, th) => { const R = (m * n) / 2, Ro = R + m, Rr = R - 1.25 * m, st = (2 * Math.PI) / n; let d = "";
        for (let k = 0; k < n; k++) { const a0 = th + k * st; [[Rr, 0.2], [Ro, 0.35], [Ro, 0.65], [Rr, 0.8]].forEach(([r, f], j) => { d += (k || j ? "L" : "M") + f1(x + r * Math.cos(a0 + f * st)) + " " + f1(y + r * Math.sin(a0 + f * st)); }); }
        return d + `Z M${f1(x + R * 0.28)} ${f1(y)}A${f1(R * 0.28)} ${f1(R * 0.28)} 0 1 0 ${f1(x - R * 0.28)} ${f1(y)}A${f1(R * 0.28)} ${f1(R * 0.28)} 0 1 0 ${f1(x + R * 0.28)} ${f1(y)}`; };
      const n1 = 24, n2 = 14, n3 = 16, R1 = (m * n1) / 2, R2 = (m * n2) / 2, R3 = (m * n3) / 2, f2 = -0.35, f3 = Math.PI + 0.75;
      const fg = 0.2 * m, x2 = cx + (R1 + R2 + fg) * Math.cos(f2), y2 = cy + (R1 + R2 + fg) * Math.sin(f2), x3 = cx + (R1 + R3 + fg) * Math.cos(f3), y3 = cy + (R1 + R3 + fg) * Math.sin(f3); /* folga de 0,2 módulo: conferido em Python, nenhuma ponta de dente invade a outra engrenagem em 300 instantes (sem folga, os dentes retos raspavam) */
      const par = (th1, n, f) => f + Math.PI - (n1 / n) * (th1 + (0.5 * 2 * Math.PI) / n1 - f); /* o dente de uma cai no vão da outra */
      const LET = "DeutschÄÖÜßGrammatikWortLesen".split("").filter((c) => c.trim()), pos = LET.map((c, i) => ({ c, x: W * (0.12 + 0.76 * (((i * 47) % 100) / 100)), y: H * (0.15 + 0.7 * (((i * 71) % 100) / 100)), t0: 0.2 + (i % 14) * 0.13, s: 52 + ((i * 13) % 46) }));
      return (t) => { const ap = suave(t / 0.45), some = suave((t - 2.05) / 0.6), op = ap * (1 - some), th1 = 1.6 * t * t * 0.6 + 0.2;
        let h = `<defs><filter id="fx-g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>`;
        pos.forEach((l) => { const u = (t - l.t0) / 0.75; if (u <= 0 || u >= 1) return; h += `<text x="${f1(l.x)}" y="${f1(l.y)}" text-anchor="middle" style="font:400 ${l.s}px ${FR};fill:var(--mDE);opacity:${(0.95 * Math.sin(Math.PI * u) * (1 - some)).toFixed(2)}">${l.c}</text>`; });
        [[cx, cy, n1, th1], [x2, y2, n2, par(th1, n2, f2)], [x3, y3, n3, par(th1, n3, f3)]].forEach(([x, y, n, th], k) => { const d = eng(x, y, n, th), e = suave((t - k * 0.12) / 0.4);
          h += `<g style="opacity:${(op * e).toFixed(2)}"><path d="${d}" style="fill:none;stroke:var(--mDE);stroke-width:6;opacity:.45;filter:url(#fx-g)" fill-rule="evenodd"/><path d="${d}" style="fill:color-mix(in srgb,var(--mDE) 16%,transparent);stroke:var(--mDE);stroke-width:2.2;stroke-linejoin:round" fill-rule="evenodd"/></g>`; });
        return h; }; },
    /* β 4.2 · sânscrito: as pétalas do lótus se abrem uma a uma e, no centro, o ॐ acende e brilha */
    sanscrito(W, H) { const cx = W / 2, cy = H / 2, L = Math.min(W, H) * 0.3, DEVA = "'Noto Sans Devanagari','Nirmala UI','Mangal',sans-serif";
      try { document.fonts && document.fonts.load("700 40px 'Noto Sans Devanagari'", "ॐ"); } catch (e) {}
      const petala = (comp, larg) => `M0 0C${f1(larg)} ${f1(-comp * 0.3)} ${f1(larg * 0.55)} ${f1(-comp * 0.85)} 0 ${f1(-comp)}C${f1(-larg * 0.55)} ${f1(-comp * 0.85)} ${f1(-larg)} ${f1(-comp * 0.3)} 0 0Z`;
      const fora = Array.from({ length: 8 }, (_, k) => ({ a: k * 45, t0: 0.1 + k * 0.11 })), dentro = Array.from({ length: 8 }, (_, k) => ({ a: k * 45 + 22.5, t0: 0.55 + k * 0.08 }));
      return (t) => { const some = suave((t - 2.05) / 0.6), om = suave((t - 1.25) / 0.45), pulsa = 0.5 + 0.5 * Math.sin(t * 9);
        let h = `<defs><filter id="fx-o" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="14"/></filter></defs>`;
        [[fora, 1, 0.42], [dentro, 0.68, 0.36]].forEach(([lista, esc, larg]) => lista.forEach((p) => { const u = suave((t - p.t0) / 0.45); if (u <= 0) return;
          h += `<path d="${petala(L * esc * (0.45 + 0.55 * u), L * larg * esc * (0.5 + 0.5 * u))}" transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(p.a * u)})" style="fill:color-mix(in srgb,var(--mSA) ${Math.round(14 + 14 * u)}%,transparent);stroke:var(--mSA);stroke-width:2.2;opacity:${(u * (1 - some)).toFixed(2)}"/>`; }));
        if (om > 0) h += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(L * 0.42)}" style="fill:var(--mSA);opacity:${((0.35 + 0.25 * pulsa) * om * (1 - some)).toFixed(2)};filter:url(#fx-o)"/><text x="${f1(cx)}" y="${f1(cy + L * 0.2)}" text-anchor="middle" style="font:700 ${f1(L * 0.62)}px ${DEVA};fill:#fff;stroke:var(--mSA);stroke-width:2;opacity:${(om * (1 - some)).toFixed(2)}">ॐ</text>`;
        return h; }; },
    /* β 4.2 · Jarvis: o símbolo pisca como uma luz que acorda (falha, falha, acende) e os anéis giram */
    jarvis(W, H) { const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.16, liga = [[0.15, 0.22, 0.5], [0.3, 0.36, 0.25], [0.5, 0.62, 0.8], [0.72, 9, 1]];
      return (t) => { let luz = 0; liga.forEach(([a, b, v]) => { if (t >= a && t < b) luz = v; }); const some = suave((t - 2.05) / 0.6), gira = suave((t - 0.72) / 0.6), op = luz * (1 - some);
        return `<defs><filter id="fx-j" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="18"/></filter></defs><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R * 1.3)}" style="fill:var(--acc);opacity:${(0.3 * op * (0.7 + 0.3 * Math.sin(t * 7))).toFixed(2)};filter:url(#fx-j)"/>` +
          `<g transform="translate(${f1(cx)} ${f1(cy)}) scale(${f1(R / 12)})" style="opacity:${op.toFixed(2)}"><g transform="rotate(${f1(gira * 120 + t * 30)})">${J.simboloJarvis ? J.simboloJarvis(true) : ""}</g></g>`; }; },
  };
  /* símbolo do Jarvis (β 4.2): anel em 6 arcos + anel interno + olho. Centrado em (0,0), raio 12. "solto" = sem o <svg> em volta */
  J.simboloJarvis = (solto) => { let arcos = ""; for (let k = 0; k < 6; k++) { const a = (k * 60 + 8) * Math.PI / 180, b = (k * 60 + 52) * Math.PI / 180; arcos += `M${f1(11 * Math.cos(a))} ${f1(11 * Math.sin(a))}A11 11 0 0 1 ${f1(11 * Math.cos(b))} ${f1(11 * Math.sin(b))}`; }
    const g = `<path d="${arcos}" style="fill:none;stroke:var(--acc);stroke-width:2;stroke-linecap:round"/><circle r="6.6" style="fill:none;stroke:var(--acc);stroke-width:1.3;opacity:.8"/><circle r="2.8" style="fill:var(--acc)"/>`;
    return solto ? g : `<svg viewBox="-13 -13 26 26" aria-hidden="true">${g}</svg>`; };
  function animAvulso(chave, fim) {
    const fab = AVULSAS[chave]; if (!fab) { fim && fim(); return; }
    const p = palco(false), desenha = fab(p.W, p.H);
    roda(p, 2.65, (t) => (p.sv.innerHTML = desenha(t)), fim);
  }
  J._anim = { livro: animLivro, buraco: animBuraco, avulso: animAvulso }; /* para os testes e para rever as animações */
})();
