/* Adesivos da tela inicial (β 3.6): camada atrás da interface + modo de edição (painel aberto pela engrenagem).
   Cadastro dos adesivos em assets/adesivos.js. Salvo em localStorage "jarvis:adesivos" (entra no exportar/importar progresso).
   Posição salva: x = distância (px) do centro horizontal da camada; y = distância (px) do topo; s = lado (px); r = giro (graus).
   Fora do modo de edição a camada fica atrás de tudo e com pointer-events: none. Nada se mexe: adesivos são estáticos. */
(function () {
  "use strict";
  const J = window.JARVIS || (window.JARVIS = {});
  const CHAVE = "jarvis:adesivos", S_MIN = 36, S_MAX = 280, S_NOVO = 96, FOLGA = 6, MIOLO = 0.9; /* o desenho ocupa ~90% da caixa */
  const PROIBIDO = ".jv-titulo h1, .jv-cor, .jv-mat, .jv-pergunta, .jv-engrenagem, .jv-painel";
  const INTERATIVO = "a[href], button, input, select, textarea, label, [role=button], [tabindex]:not([tabindex='-1'])";
  const ler = () => { try { const o = JSON.parse(localStorage.getItem(CHAVE)); return o && Array.isArray(o.itens) ? o.itens : []; } catch (e) { return []; } };
  const gravar = (itens) => { try { localStorage.setItem(CHAVE, JSON.stringify({ v: 1, itens })); } catch (e) {} };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const GEAR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 2.6h3.4l.5 2.6a7.4 7.4 0 0 1 1.9 1.1l2.5-.9 1.7 2.9-2 1.7a7.6 7.6 0 0 1 0 2.2l2 1.7-1.7 2.9-2.5-.9a7.4 7.4 0 0 1-1.9 1.1l-.5 2.6h-3.4l-.5-2.6a7.4 7.4 0 0 1-1.9-1.1l-2.5.9-1.7-2.9 2-1.7a7.6 7.6 0 0 1 0-2.2l-2-1.7 1.7-2.9 2.5.9a7.4 7.4 0 0 1 1.9-1.1z"/><circle cx="12" cy="12" r="3"/></svg>`;
  J.botaoAdesivos = () => `<button type="button" class="jv-engrenagem" aria-label="Adesivos: personalizar a tela inicial" aria-pressed="false" title="Adesivos">${GEAR}</button>`;

  /* ---------- geometria (exportada em J.adGeo para os testes) ---------- */
  const caixa = (st) => { const a = (st.r * Math.PI) / 180, h = ((st.s * MIOLO) / 2) * (Math.abs(Math.cos(a)) + Math.abs(Math.sin(a))); return { x0: st.cx - h, x1: st.cx + h, y0: st.cy - h, y1: st.cy + h }; };
  const cruza = (b, z) => b.x0 < z.x1 && b.x1 > z.x0 && b.y0 < z.y1 && b.y1 > z.y0;
  const valida = (st, zonas, W, H) => { const b = caixa(st); return b.x0 >= 0 && b.y0 >= 0 && b.x1 <= W && b.y1 <= H && !zonas.some((z) => cruza(b, z)); };
  /* posição válida mais próxima: círculos crescentes em volta do ponto pedido (passo de 6 px) */
  const maisProxima = (st, zonas, W, H) => { if (valida(st, zonas, W, H)) return st; for (let rho = 6; rho < 2400; rho += 6) { const n = Math.max(8, Math.round((2 * Math.PI * rho) / 6)); let melhor = null; for (let k = 0; k < n; k++) { const a = (2 * Math.PI * k) / n, c = { ...st, cx: st.cx + rho * Math.cos(a), cy: st.cy + rho * Math.sin(a) }; if (valida(c, zonas, W, H)) { melhor = c; break; } } if (melhor) return melhor; } return null; };
  J.adGeo = { caixa, cruza, valida, maisProxima };

  J.adesivos = (el) => {
    const A = window.ADESIVOS; if (!A) return;
    const raiz = el.querySelector(".jv"), camada = document.createElement("div");
    camada.className = "jv-adesivos"; camada.setAttribute("aria-hidden", "true"); el.prepend(camada);
    const gear = el.querySelector(".jv-engrenagem");
    let itens = ler().filter((it) => A.porId(it.id) && (!window.ACESSO || window.ACESSO.adesivo(it.id))), editando = false, sel = null, painel = null, lado = "dir", ativo = null; /* ativo: o que está sendo arrastado segue o mouse, sem empurrão */

    /* zonas proibidas em coordenadas da camada (com folga) */
    const zonas = () => { const L = camada.getBoundingClientRect(), z = []; const add = (e) => { if (e.closest(".jv-adesivos")) return; const cs = getComputedStyle(e); if (cs.display === "none") return; e.getClientRects().length && [...e.getClientRects()].forEach((r) => { if (r.width && r.height) z.push({ x0: r.left - L.left - FOLGA, x1: r.right - L.left + FOLGA, y0: r.top - L.top - FOLGA, y1: r.bottom - L.top + FOLGA }); }); };
      document.querySelectorAll(PROIBIDO).forEach(add);
      document.querySelectorAll(INTERATIVO).forEach((e) => { if (e.closest(".jv-painel")) return; const cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none" || e.offsetParent === null && cs.position !== "fixed") return; add(e); });
      return z; };
    const dim = () => { const L = camada.getBoundingClientRect(); return { W: L.width, H: L.height, L }; };
    const emCamada = (it, W) => ({ ...it, cx: W / 2 + it.x, cy: it.y });
    const deCamada = (st, W) => ({ x: Math.round(st.cx - W / 2), y: Math.round(st.cy) });

    /* desenha todos; quem estiver em área proibida (ex.: a janela encolheu) aparece empurrado para a área válida mais próxima, sem mudar o que está salvo */
    const desenha = () => { const { W, H } = dim(), Z = zonas(); let h = "";
      itens.forEach((it) => { const a = A.porId(it.id); let st = emCamada(it, W); const ok = it.u === ativo ? null : maisProxima(st, Z, W, H); if (ok) st = ok; it._cx = st.cx; it._cy = st.cy;
        const ruim = it.u === ativo && !valida(st, Z, W, H);
        h += `<div class="jv-ad${sel === it.u ? " sel" : ""}${ruim ? " invalido" : ""}" data-u="${it.u}" title="${editando ? a.nome : ""}" style="left:${(st.cx - it.s / 2).toFixed(1)}px;top:${(st.cy - it.s / 2).toFixed(1)}px;width:${it.s}px;height:${it.s}px;transform:rotate(${it.r}deg)">${A.svg(a)}${editando && sel === it.u ? `<span class="jv-ad-h giro" data-h="giro" title="girar (Shift: de 15° em 15°)"></span><span class="jv-ad-h tam" data-h="tam" title="redimensionar"></span><button type="button" class="jv-ad-h x" data-h="x" title="remover" aria-label="remover adesivo">×</button>` : ""}</div>`; });
      camada.innerHTML = h + (camada.classList.contains("arrastando") ? zonasHTML : ""); };
    let zonasHTML = "";
    const mostraZonas = (on) => { camada.classList.toggle("arrastando", on); zonasHTML = on ? zonas().map((z) => `<div class="jv-proibida" style="left:${z.x0}px;top:${z.y0}px;width:${z.x1 - z.x0}px;height:${z.y1 - z.y0}px"></div>`).join("") : ""; };

    /* ---------- painel (modo de edição) ---------- */
    const montaPainel = () => { painel = document.createElement("div"); painel.className = "jv-painel " + lado; painel.setAttribute("role", "dialog"); painel.setAttribute("aria-label", "Personalizar a tela inicial");
      const FIG = !window.ACESSO || window.ACESSO.engrenagem("figura") ? (window.FIGURAS || []).filter((f) => !window.ACESSO || window.ACESSO.figura(f.id)) : [], /* β 4.3: o buraco negro só aparece para o ADM (nem silhueta) */ cfg = J.figuraCfg ? J.figuraCfg() : { id: "planeta", hue: null, vel: 1 }, rotVel = (v) => (v === 0 ? "parado" : String(v).replace(".", ",") + "×");
      const secFig = FIG.length ? `<div class="jv-painel-cat jv-painel-fig"><div class="jv-painel-tit">Figura central</div><div class="jv-painel-figs">${FIG.map((f) => `<button type="button" class="jv-painel-figbt" data-fig="${f.id}" aria-pressed="${cfg.id === f.id}" title="${f.nome}"><span class="jv-painel-mini">${f.svg("m-" + f.id)}</span><span class="jv-painel-fignome">${f.nome}</span></button>`).join("")}</div>
        <label class="jv-painel-linha"><input type="checkbox" data-f="tema"${cfg.hue === null ? " checked" : ""}> acompanhar a cor do tema</label>
        <label class="jv-painel-linha jv-painel-cor"><span>cor</span><input type="range" min="0" max="285" step="1" data-f="cor" value="${cfg.hue === null ? 210 : cfg.hue}"${cfg.hue === null ? " disabled" : ""} aria-label="Cor da figura central"></label>
        <label class="jv-painel-linha"><span>velocidade</span><input type="range" min="0" max="2" step="0.25" data-f="vel" value="${cfg.vel}" aria-label="Velocidade de rotação da figura central"><output data-f="velt">${rotVel(cfg.vel)}</output></label></div>` : "";
      painel.innerHTML = `<div class="jv-painel-cab"><b>Personalizar</b><span class="esp"></span><button type="button" class="bt peq" data-p="lado" title="Mudar o painel de lado">⇄</button><button type="button" class="bt peq pri" data-p="fim">Concluir</button></div>
        ${secFig}<div class="jv-painel-secao"><div class="jv-painel-tit">Adesivos</div><button type="button" class="bt peq" data-p="limpar">Limpar tudo</button></div>
        <p class="jv-painel-dica">Arraste um adesivo para a tela (ou clique nele). Clique num adesivo da tela para mover, girar, redimensionar ou remover. Eles não podem ficar em cima de nada clicável.</p>` +
        A.categorias.map((k) => { const lista = A.lista.filter((a) => a.cat === k.id && (!window.ACESSO || window.ACESSO.adesivo(a.id))); return lista.length ? `<div class="jv-painel-cat"><div class="jv-painel-tit" style="color:${k.cor}">${k.nome}</div><div class="jv-painel-grade">${lista.map((a) => `<button type="button" class="jv-painel-ad" data-id="${a.id}" title="${a.nome}" aria-label="Pôr adesivo: ${a.nome}">${A.svg(a)}</button>`).join("")}</div></div>` : ""; }).join("");
      el.appendChild(painel);
      ligaFigura(painel, rotVel);
      painel.querySelector("[data-p=fim]").addEventListener("click", () => modo(false));
      painel.querySelector("[data-p=lado]").addEventListener("click", () => { lado = lado === "dir" ? "esq" : "dir"; painel.className = "jv-painel " + lado; desenha(); });
      painel.querySelector("[data-p=limpar]").addEventListener("click", () => { if (!itens.length || !confirm("Tirar todos os adesivos da tela inicial?")) return; itens = []; sel = null; gravar(ocultos); desenha(); });
      painel.querySelectorAll(".jv-painel-ad").forEach((b) => b.addEventListener("pointerdown", (ev) => arrastaNovo(ev, b.dataset.id)));
      painel.querySelectorAll(".jv-painel-ad").forEach((b) => b.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); colocaLivre(b.dataset.id); } })); };
    /* seção "Figura central" (β 3.9): miniaturas paradas, cor e velocidade; tudo salvo em jarvis:figura pelo J.figura */
    const ligaFigura = (pn, rotVel) => {
      const box = pn.querySelector(".jv-painel-fig"); if (!box || !J.figura) return;
      const pintaMinis = () => { const ilu = document.querySelector(".jv-ilu"); if (!ilu) return; const cs = getComputedStyle(ilu); ["--fg1", "--fg2", "--fg3"].forEach((v) => box.style.setProperty(v, cs.getPropertyValue(v).trim())); };
      box.querySelectorAll(".jv-painel-figbt").forEach((b) => { const f = window.FIGURAS.porId(b.dataset.fig), sv = b.querySelector("svg"); if (sv) f.quadro(sv, 1.6);
        b.addEventListener("click", () => { J.figura({ id: b.dataset.fig }); box.querySelectorAll(".jv-painel-figbt").forEach((x) => x.setAttribute("aria-pressed", x === b)); }); });
      const tema = box.querySelector("[data-f=tema]"), cor = box.querySelector("[data-f=cor]"), vel = box.querySelector("[data-f=vel]"), velt = box.querySelector("[data-f=velt]");
      tema.addEventListener("change", () => { cor.disabled = tema.checked; J.figura({ hue: tema.checked ? null : +cor.value }); pintaMinis(); });
      cor.addEventListener("input", () => { J.figura({ hue: +cor.value }); pintaMinis(); });
      vel.addEventListener("input", () => { J.figura({ vel: +vel.value }); velt.textContent = rotVel(+vel.value); });
      pintaMinis();
    };
    const modo = (on) => { editando = on; sel = null; gear.setAttribute("aria-pressed", on); camada.classList.toggle("editando", on); raiz.classList.toggle("jv-editando", on);
      if (on) montaPainel(); else if (painel) { painel.remove(); painel = null; } desenha(); };
    gear.addEventListener("click", () => modo(!editando));

    const ocultos = ler().filter((it) => !itens.some((x) => x.u === it.u)); /* acesso (β 4.1): adesivos que esta pessoa não vê continuam salvos */
    const salvar = () => gravar(itens.map(({ u, id, x, y, s, r }) => ({ u, id, x, y, s, r })).concat(ocultos));
    /* clique sem arrastar (ou Enter): põe o adesivo no lugar livre mais perto da esquerda do globo */
    const colocaLivre = (id) => { const { W, H } = dim(), Z = zonas().concat(itens.map((o) => { const b = caixa({ cx: o._cx ?? W / 2 + o.x, cy: o._cy ?? o.y, s: o.s, r: o.r }); return { x0: b.x0 - 4, x1: b.x1 + 4, y0: b.y0 - 4, y1: b.y1 + 4 }; })), st = maisProxima({ cx: W / 2 - 300, cy: Math.min(H - 80, 330), s: S_NOVO, r: 0 }, Z, W, H); if (!st) return; const it = { u: uid(), id, s: S_NOVO, r: 0, ...deCamada(st, W) }; itens.push(it); sel = it.u; salvar(); desenha(); };

    /* ---------- arrastar, girar, redimensionar ---------- */
    const pos = (ev) => { const { L } = dim(); return { px: ev.clientX - L.left, py: ev.clientY - L.top }; };
    const arrastaNovo = (ev, id) => { ev.preventDefault(); const x0 = ev.clientX, y0 = ev.clientY; let it = null, ultimo = null, Z = null, W, H;
      const mover = (e) => { if (!it) { if (Math.hypot(e.clientX - x0, e.clientY - y0) < 5) return; ({ W, H } = dim()); mostraZonas(true); Z = zonas(); it = { u: uid(), id, s: S_NOVO, r: 0, x: 0, y: 0 }; itens.push(it); sel = it.u; ativo = it.u; }
        const { px, py } = pos(e), st = { cx: px, cy: py, s: it.s, r: 0 }; Object.assign(it, deCamada(st, W)); if (valida(st, Z, W, H)) ultimo = { x: it.x, y: it.y }; desenha(); };
      const soltar = () => { document.removeEventListener("pointermove", mover); document.removeEventListener("pointerup", soltar); mostraZonas(false); ativo = null;
        if (!it) { colocaLivre(id); return; } /* foi só um clique */
        const st = emCamada(it, W); if (!valida(st, Z, W, H)) { if (ultimo) Object.assign(it, ultimo); else { itens = itens.filter((x) => x !== it); sel = null; } } salvar(); desenha(); };
      document.addEventListener("pointermove", mover); document.addEventListener("pointerup", soltar); };
    camada.addEventListener("pointerdown", (ev) => { if (!editando) return; const d = ev.target.closest(".jv-ad"); if (!d) return; ev.preventDefault(); ev.stopPropagation();
      const it = itens.find((x) => x.u === d.dataset.u); if (!it) return; const h = ev.target.closest("[data-h]")?.dataset.h;
      if (h === "x") { itens = itens.filter((x) => x !== it); sel = null; salvar(); desenha(); return; }
      if (sel !== it.u) { sel = it.u; desenha(); }
      const { W, H } = dim(); mostraZonas(true); const Z = zonas(); const p0 = pos(ev), c0 = { cx: it._cx, cy: it._cy }; let ultimo = { x: it.x, y: it.y, s: it.s, r: it.r };
      Object.assign(it, deCamada(c0, W)); ativo = it.u; /* se estava empurrado, passa a valer a posição mostrada */
      const mover = (e) => { const p = pos(e); let st;
        if (h === "giro") { let r = (Math.atan2(p.py - c0.cy, p.px - c0.cx) * 180) / Math.PI + 90; if (e.shiftKey) r = Math.round(r / 15) * 15; it.r = Math.round(((r % 360) + 360) % 360); st = emCamada(it, W); }
        else if (h === "tam") { it.s = Math.round(Math.max(S_MIN, Math.min(S_MAX, Math.SQRT2 * Math.hypot(p.px - c0.cx, p.py - c0.cy)))); st = emCamada(it, W); }
        else { st = { cx: c0.cx + p.px - p0.px, cy: c0.cy + p.py - p0.py, s: it.s, r: it.r }; Object.assign(it, deCamada(st, W)); }
        if (valida(st, Z, W, H)) ultimo = { x: it.x, y: it.y, s: it.s, r: it.r }; desenha(); };
      const soltar = () => { document.removeEventListener("pointermove", mover); document.removeEventListener("pointerup", soltar); mostraZonas(false); ativo = null;
        if (!valida(emCamada(it, W), Z, W, H)) Object.assign(it, ultimo); /* soltou em área proibida: volta para a última posição válida */
        salvar(); desenha(); };
      document.addEventListener("pointermove", mover); document.addEventListener("pointerup", soltar); });
    /* clique fora: tira a seleção; Delete remove; Esc sai do modo de edição */
    const fora = (ev) => { if (!camada.isConnected) return limpa(); if (!editando || !sel) return; if (ev.target.closest(".jv-ad, .jv-painel")) return; sel = null; desenha(); };
    const tecla = (ev) => { if (!camada.isConnected) return limpa(); if (!editando) return; if (ev.key === "Escape") modo(false); else if ((ev.key === "Delete" || ev.key === "Backspace") && sel && !/input|textarea/i.test(ev.target.tagName)) { itens = itens.filter((x) => x.u !== sel); sel = null; salvar(); desenha(); } };
    document.addEventListener("pointerdown", fora); document.addEventListener("keydown", tecla);
    let pend = false; const redesenha = () => { if (pend) return; pend = true; requestAnimationFrame(() => { pend = false; if (camada.isConnected) desenha(); else limpa(); }); };
    const ro = new ResizeObserver(redesenha); ro.observe(raiz); window.addEventListener("resize", redesenha);
    const limpa = () => { ro.disconnect(); window.removeEventListener("resize", redesenha); document.removeEventListener("pointerdown", fora); document.removeEventListener("keydown", tecla); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(redesenha);
    desenha();
    J._ad = { itens: () => itens, modo, desenha, zonas, dim }; /* para os testes */
  };
})();
