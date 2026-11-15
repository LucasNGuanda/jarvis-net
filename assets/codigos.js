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
        if (!r.ok) { msg.textContent = "código não reconhecido"; msg.className = "cod-msg erro"; clearTimeout(msg._t); msg._t = setTimeout(() => (msg.textContent = ""), 3000); return; } /* sem pista e sem animação */
        inp.value = ""; msg.textContent = ""; pinta();
        if (r.chave === "adm" || r.chave === "tester") animLivro(r.chave);
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
  J.pintaVersao = () => { const s = AC() ? AC().sufixo() : "", v = document.getElementById("versao"); if (v) v.textContent = "Jarvis " + (window.VERSAO || "") + s; const j = document.querySelector(".jv-ver .jv-suf"); if (j && !j.dataset.segura) j.textContent = s; };

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

  /* ---------- ANIMAÇÃO ADM / TESTER: o livro ---------- */
  function livroSVG(o, brilho, cor) { /* livro centrado em (0,0); o = abertura 0…1; brilho = 0…1 */
    const xc = 80 * Math.cos(Math.PI * o), lev = 8 * Math.sin(Math.PI * o);
    const capa = `<path d="M0 -56L${f1(xc)} ${f1(-56 - lev)}L${f1(xc)} ${f1(56 - lev)}L0 56Z" style="fill:#3a2a1c;stroke:${cor};stroke-width:2.5"/>`;
    const linhas = (x0, w) => Array.from({ length: 7 }, (_, k) => `<line x1="${f1(x0 + 8)}" x2="${f1(x0 + w - 8)}" y1="${-36 + k * 12}" y2="${-36 + k * 12}" style="stroke:#b9a27a;stroke-width:1.3;opacity:${(0.25 + 0.5 * o).toFixed(2)}"/>`).join("");
    const pagD = `<rect x="0" y="-50" width="76" height="100" rx="2" style="fill:#f6ecd4"/>${linhas(0, 76)}`;
    const pagE = o > 0.02 ? `<rect x="${f1(-76 * o)}" y="-50" width="${f1(76 * o)}" height="100" rx="2" style="fill:#f6ecd4"/>${o > 0.5 ? linhas(-76 * o, 76 * o) : ""}` : "";
    const luz = brilho > 0 ? `<ellipse cx="0" cy="-6" rx="${f1(70 + 50 * brilho)}" ry="${f1(55 + 40 * brilho)}" style="fill:${cor};opacity:${(0.55 * brilho).toFixed(2)};filter:url(#fx-blur)"/><rect x="${f1(-76 * o)}" y="-50" width="${f1(76 * (1 + o))}" height="100" style="fill:#fff;opacity:${(0.75 * brilho * o).toFixed(2)}"/>` : "";
    return `<rect x="-6" y="-56" width="12" height="112" rx="3" style="fill:#2b1f15"/>` + (o < 0.5 ? pagD + pagE + capa : capa + pagD + pagE) + luz;
  }
  function animLivro(tipo) {
    const adm = tipo === "adm", p = palco(true), { W, H } = p, cx = W / 2, cy = H * 0.56;
    const corFeixe = adm ? ["#ffffff", "#ffe08a", "#ffb84d"] : ["#e6ffef", "#5dff9b", "#16b85a"], corLivro = adm ? "#ffd36b" : "#4dff8f", flash = adm ? "#fff8e6" : "#ecfff2";
    const part = Array.from({ length: 38 }, (_, i) => ({ x: (((i * 37) % 100) / 100 - 0.5) * 120, v: 40 + ((i * 53) % 60), f: (i * 0.618) % 1, r: 1.2 + ((i * 7) % 4) * 0.6 }));
    const chuva = Array.from({ length: 44 }, (_, i) => ({ x: (((i * 41) % 100) / 100 - 0.5) * 210, v: 160 + ((i * 29) % 140), f: (i * 0.37) % 1, c: GLIFOS[(i * 7) % GLIFOS.length] }));
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
    const defs = `<defs><linearGradient id="fx-feixe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${corFeixe[0]}" stop-opacity=".95"/><stop offset=".6" stop-color="${corFeixe[1]}" stop-opacity=".8"/><stop offset="1" stop-color="${corFeixe[2]}" stop-opacity=".55"/></linearGradient><filter id="fx-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter><filter id="fx-blur2" x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation="6"/></filter></defs>`;
    const vaiParaHome = () => { if (location.hash !== "#/home") location.hash = "#/home"; };
    const seguraSufixo = () => { const s = document.querySelector(".jv-ver .jv-suf"); if (s && s !== sufixo) { sufixo = s; s.dataset.segura = "1"; s.textContent = ""; } };
    const revela = () => { const s = document.querySelector(".jv-ver .jv-suf"); if (s) { delete s.dataset.segura; s.textContent = AC().sufixo(); s.classList.remove("chega"); void s.offsetWidth; s.classList.add("chega"); } J.pintaVersao(); };
    const desenha = (t) => {
      let h = defs;
      const fundo = t < 5.5 ? suave(t / 0.6) * 0.94 : 0.94 * (1 - suave((t - 5.5) / 0.6));
      if (fundo > 0) h += `<rect width="${W}" height="${H}" style="fill:#03040a;opacity:${fundo.toFixed(3)}"/>`;
      if (t < 5.6) {
        const ap = suave((t - 0.4) / 0.8), o = suave((t - 1.2) / 1.4), cresce = suave((t - 2.2) / 0.8), brilho = suave((t - 2.8) / 2.2);
        if (cresce > 0) { /* feixe de luz descendo do alto e se despejando no livro */
          const hb = (cy - 60) * cresce, lw = 90 + 50 * brilho;
          h += `<rect x="${f1(cx - lw)}" y="0" width="${f1(2 * lw)}" height="${f1(hb)}" style="fill:url(#fx-feixe);opacity:${(0.35 + 0.4 * brilho).toFixed(2)};filter:url(#fx-blur2)"/><rect x="${f1(cx - lw * 0.35)}" y="0" width="${f1(lw * 0.7)}" height="${f1(hb)}" style="fill:${corFeixe[0]};opacity:${(0.5 + 0.4 * brilho).toFixed(2)};filter:url(#fx-blur2)"/>`;
          if (!adm) chuva.forEach((c) => { const y = ((t * c.v + c.f * cy) % (cy - 20)); if (y < hb) h += `<text x="${f1(cx + c.x)}" y="${f1(y)}" text-anchor="middle" style="font:800 26px monospace;fill:#ffffff;stroke:#04381a;stroke-width:5px;paint-order:stroke;opacity:${(0.7 + 0.3 * Math.sin(t * 9 + c.f * 7) ** 2).toFixed(2)}">${GLIFOS[(Math.floor(t * 12) + c.c.charCodeAt(0)) % GLIFOS.length]}</text>`; });
        }
        if (brilho > 0) part.forEach((pt) => { const u = (t * pt.v / 140 + pt.f) % 1; h += `<circle cx="${f1(cx + pt.x * 1.6 * (0.4 + u))}" cy="${f1(cy - 70 - u * 260 * brilho)}" r="${pt.r}" style="fill:${corFeixe[1]};opacity:${((1 - u) * brilho).toFixed(2)}"/>`; });
        h += `<g transform="translate(${f1(cx)} ${f1(cy)}) scale(${(1.7 * (0.6 + 0.4 * ap)).toFixed(3)})" style="opacity:${ap.toFixed(2)}">${livroSVG(o, brilho, corLivro)}</g>`;
      }
      if (t >= 5.0 && t < 6.4) { const fl = t < 5.5 ? suave((t - 5.0) / 0.5) : 1 - suave((t - 5.5) / 0.9); h += `<rect width="${W}" height="${H}" style="fill:${flash};opacity:${fl.toFixed(3)}"/>`; }
      if (t >= 5.45 && !rota) { rota = 1; vaiParaHome(); }
      if (t >= 5.5) seguraSufixo();
      if (t >= 5.6 && !voo) voo = prepVoo();
      if (voo && t >= 5.6 && t < 8.3) { /* o livro voa até a versão */
        const u = suave((t - 5.7) / 2.5), [x, y] = ponto(u), [x2, y2] = ponto(Math.min(1, u + 0.01)), ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI * 0.15, s = 0.55 - 0.33 * u;
        for (let k = 1; k <= 8; k++) { const [tx, ty] = ponto(Math.max(0, u - k * 0.018)); h += `<circle cx="${f1(tx)}" cy="${f1(ty)}" r="${f1(3.2 - k * 0.3)}" style="fill:${corFeixe[1]};opacity:${(0.6 - k * 0.07).toFixed(2)}"/>`; }
        h += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)}) scale(${s.toFixed(3)})">${livroSVG(1, 0.35, corLivro)}</g>`;
      }
      if (voo && t >= 8.2) { /* colisão: brilhinho de impacto e o sufixo aparece */
        if (!desenha.bateu) { desenha.bateu = 1; revela(); }
        const b = suave((t - 8.2) / 0.8), [x, y] = voo.P2;
        h += Array.from({ length: 12 }, (_, k) => { const a = (k / 12) * 2 * Math.PI, r0 = 6 + 34 * b, r1 = r0 + 10 * (1 - b); return `<line x1="${f1(x + r0 * Math.cos(a))}" y1="${f1(y + r0 * Math.sin(a))}" x2="${f1(x + r1 * Math.cos(a))}" y2="${f1(y + r1 * Math.sin(a))}" style="stroke:${corFeixe[1]};stroke-width:2.4;stroke-linecap:round;opacity:${(1 - b).toFixed(2)}"/>`; }).join("") + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(4 + 20 * b)}" style="fill:${corFeixe[0]};opacity:${(0.7 * (1 - b)).toFixed(2)}"/>`;
      }
      p.sv.innerHTML = h;
    };
    roda(p, 9.1, desenha, () => { vaiParaHome(); setTimeout(() => { revela(); J.pintaVersao(); }, 60); });
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
  };
  function animAvulso(chave, fim) {
    const fab = AVULSAS[chave]; if (!fab) { fim && fim(); return; }
    const p = palco(false), desenha = fab(p.W, p.H);
    roda(p, 2.65, (t) => (p.sv.innerHTML = desenha(t)), fim);
  }
  J._anim = { livro: animLivro, avulso: animAvulso }; /* para os testes e para rever as animações */
})();
