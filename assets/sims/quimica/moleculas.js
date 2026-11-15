/* Simulações da Química, aba Moléculas: visualizador de moléculas em 3D e construtor VSEPR.
   DADOS: assets/moleculas-dados.js (GERADO por tools/moleculas/gera-moleculas.py, com RDKit, FORA do site). Só é baixado quando a página do visualizador
     ou do construtor abre (carrega()); o site não fica mais lento por causa dele.
   DESENHO: código próprio, em canvas 2D. Projeção com perspectiva leve, átomos e meias-ligações ordenados por profundidade. Nenhuma biblioteca.
   MODELO, não medida: as coordenadas vêm de campo de força (RDKit) ou das direções ideais do VSEPR. A ficha mostra o ângulo calculado nas coordenadas
     e, ao lado, o valor de livro, com a fonte. Nada é ajustado à mão para "bater".
   PARES ISOLADOS: quantidade = (elétrons de valência − carga − soma das ordens de ligação) / 2. Posição: a do VSEPR em volta de cada átomo
     (1 vizinho + 3 pares: tetraédrica; 1 vizinho + 2 pares: trigonal, no plano do vizinho; 2 vizinhos + 2 pares: tetraédrica; 2 ou 3 vizinhos + 1 par: oposto à soma).
     No átomo central das espécies de octeto expandido, as direções vêm prontas do gerador (campo "pares").
   DIPOLO (construtor): soma vetorial dos dipolos de ligação, cada um com tamanho Δχ = χ(ligante) − χ(central) (Pauling, da tabela periódica do site)
     e apontando para o átomo mais eletronegativo. É qualitativo: não leva em conta o comprimento das ligações nem a contribuição dos pares isolados.
   Conferido em Python (tools/moleculas/confere.py): ângulos das 13 geometrias e soma dos dipolos de CO₂, BF₃, CH₄, CCl₄ (zero), H₂O, NH₃, CHCl₃, CH₂Cl₂, SF₄, ClF₃ (não zero), XeF₂, XeF₄ (zero). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const COR = { H: "#e9edf2", C: "#8b93a1", N: "#5b86f5", O: "#ef5350", F: "#8fd96a", Cl: "#3ec25a", Br: "#b3563a", I: "#9a57c9", S: "#e9c53f", P: "#f0903a", B: "#f2a892", Be: "#bfe36a", Si: "#d9b08c", Xe: "#56b9cf", Na: "#a985f2" };
  const VAL = { H: 1, Be: 2, B: 3, C: 4, Si: 4, N: 5, P: 5, O: 6, S: 6, F: 7, Cl: 7, Br: 7, I: 7, Xe: 8, Na: 1 };
  const NOMEEL = { H: "hidrogênio", Be: "berílio", B: "boro", C: "carbono", N: "nitrogênio", O: "oxigênio", F: "flúor", P: "fósforo", S: "enxofre", Cl: "cloro", Br: "bromo", I: "iodo", Xe: "xenônio", Na: "sódio", Si: "silício" };
  const rDes = (el) => (el === "H" ? 0.24 : "CNOFB".includes(el) && el.length === 1 || el === "Be" ? 0.36 : 0.43);
  const n1 = (v, d = 1) => (+v).toFixed(d).replace(".", ",").replace("-", "−");
  const soma = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], dif = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], esc = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const pe = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], mod = (a) => Math.hypot(a[0], a[1], a[2]), uni = (a) => { const m = mod(a) || 1; return esc(a, 1 / m); };
  const pv = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const perp = (a) => uni(pv(a, Math.abs(a[0]) < 0.8 ? [1, 0, 0] : [0, 1, 0]));
  const angulo = (u, v) => (Math.acos(Math.max(-1, Math.min(1, pe(uni(u), uni(v))))) * 180) / Math.PI;
  const mm = (A, B) => A.map((l) => [0, 1, 2].map((j) => l[0] * B[0][j] + l[1] * B[1][j] + l[2] * B[2][j]));
  const mv = (A, v) => A.map((l) => l[0] * v[0] + l[1] * v[1] + l[2] * v[2]);
  const rotX = (a) => [[1, 0, 0], [0, Math.cos(a), -Math.sin(a)], [0, Math.sin(a), Math.cos(a)]], rotY = (a) => [[Math.cos(a), 0, Math.sin(a)], [0, 1, 0], [-Math.sin(a), 0, Math.cos(a)]];
  const R0 = () => mm(rotX(-0.35), rotY(0.6));
  const escuro = (hex, k) => { const n = parseInt(hex.slice(1), 16); return `rgb(${Math.round(((n >> 16) & 255) * k)},${Math.round(((n >> 8) & 255) * k)},${Math.round((n & 255) * k)})`; };
  const SUB = "₀₁₂₃₄₅₆₇₈₉", SUP = { "+": "⁺", "-": "⁻", 1: "", 2: "²", 3: "³", 4: "⁴" };
  const fBonita = (f) => { const m = f.match(/^(.*?)(?:\^(\d))?([+-])?$/); return m[1].replace(/\d/g, (d) => SUB[+d]) + (m[3] ? (m[2] ? SUP[m[2]] : "") + SUP[m[3]] : ""); };
  const reduz = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ---------- dados: só chegam quando alguém abre a página ---------- */
  let prom = null;
  const carrega = () => prom || (prom = new Promise((ok, erro) => { if (window.MOLECULAS) return ok(window.MOLECULAS); const s = document.createElement("script"); s.src = "assets/moleculas-dados.js"; s.onload = () => ok(window.MOLECULAS); s.onerror = () => { prom = null; erro(new Error("catálogo não carregou")); }; document.head.appendChild(s); }));
  SIM.qMolCarrega = carrega;

  /* ---------- modelo: do registro do catálogo para o que o desenho usa ---------- */
  const vizinhos = (m, i) => m.ligs.filter((l) => l[0] === i || l[1] === i).map((l) => (l[0] === i ? l[1] : l[0]));
  /* pares isolados de todos os átomos: [{i, d:[x,y,z]}] */
  const pares = (m) => {
    const out = [], prontos = new Set();
    (m.pares || []).forEach((p) => { out.push({ i: p[0], d: [p[1], p[2], p[3]] }); prontos.add(p[0]); });
    m.atomos.forEach((a, i) => {
      if (prontos.has(i) || VAL[a.el] === undefined) return;
      const viz = vizinhos(m, i), ord = m.ligs.reduce((t, l) => t + (l[0] === i || l[1] === i ? l[2] : 0), 0), k = Math.floor((VAL[a.el] - (a.q || 0) - ord) / 2 + 1e-9);
      if (k <= 0 || !viz.length || viz.length + k > 4) return;
      const u = viz.map((j) => uni(dif(m.atomos[j].p, a.p))), s = u.reduce(soma, [0, 0, 0]);
      if (viz.length === 1) {
        if (k === 1) return out.push({ i, d: esc(u[0], -1) });
        const outros = vizinhos(m, viz[0]).filter((j) => j !== i); let w = perp(u[0]);
        if (outros.length) { const t = dif(m.atomos[outros[0]].p, m.atomos[viz[0]].p), tp = dif(t, esc(u[0], pe(t, u[0]))); if (mod(tp) > 0.05) w = uni(tp); }
        const w2 = pv(u[0], w), ang = k === 2 ? 120 : 109.47, c = Math.cos((ang * Math.PI) / 180), sn = Math.sin((ang * Math.PI) / 180);
        for (let n = 0; n < k; n++) { const f = k === 2 ? n * Math.PI : (n * 2 * Math.PI) / 3 + Math.PI / 3; out.push({ i, d: uni(soma(esc(u[0], c), soma(esc(w, sn * Math.cos(f)), esc(w2, sn * Math.sin(f))))) }); }
      } else if (k === 1) { out.push({ i, d: mod(s) > 0.15 ? uni(esc(s, -1)) : uni(pv(u[0], u[1])) }); }
      else if (viz.length === 2 && k === 2) { const b = uni(esc(s, -1)), n = uni(pv(u[0], u[1])), h = (54.74 * Math.PI) / 180; out.push({ i, d: uni(soma(esc(b, Math.cos(h)), esc(n, Math.sin(h)))) }, { i, d: uni(soma(esc(b, Math.cos(h)), esc(n, -Math.sin(h)))) }); }
    });
    return out;
  };
  SIM.qMolPares = (reg) => pares(modelo(reg)).length;
  function modelo(reg) {
    const m = { reg, atomos: reg.atomos.map((a) => ({ el: a[0], p: [a[1], a[2], a[3]], q: a[4] || 0 })), ligs: reg.ligs.map((l) => l.slice()), pares: reg.pares, rotulo: reg.nome };
    m.lp = pares(m); m.nH = m.atomos.filter((a) => a.el === "H").length; m.pesados = m.atomos.length - m.nH; return m;
  }
  /* composto iônico: os íons separados (em escala, pelos raios iônicos) e um pedaço 3 × 3 × 3 do retículo do tipo NaCl */
  function modelosIonicos(reg) {
    const [c, a] = reg.ions, d = reg.reticulo.d, sep = c[2] + a[2] + 1.6;
    const par = { reg, ionico: true, atomos: [{ el: c[0], p: [-sep / 2, 0, 0], q: c[1], r: c[2] }, { el: a[0], p: [sep / 2, 0, 0], q: a[1], r: a[2] }], ligs: [], lp: [], rotulo: "os íons, separados (raios iônicos em escala)", nH: 0, pesados: 2 };
    const at = [], id = {}, ligs = [];
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) { const cat = (i + j + k) % 2 === 0; id[[i, j, k]] = at.length; at.push({ el: cat ? c[0] : a[0], p: [i * d, j * d, k * d], q: cat ? c[1] : a[1], r: (cat ? c[2] : a[2]) * 0.45 }); }
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach((v) => { const o = id[[i + v[0], j + v[1], k + v[2]]]; if (o !== undefined) ligs.push([id[[i, j, k]], o, 0.5]); });
    return [par, { reg, ionico: true, atomos: at, ligs, lp: [], rotulo: "pedaço do retículo cristalino (27 íons)", nH: 0, pesados: 27 }];
  }

  /* ---------- desenho ---------- */
  function cena(ctx, x0, y0, w, h, m, R, zoom, op, tinta) {
    const vis = m.atomos.map((a, i) => !(op.semH && a.el === "H" && m.pesados > 1) && !(op.esq && a.el === "H" && vizinhos(m, i).every((j) => m.atomos[j].el === "C") && m.pesados > 1));
    const rmax = Math.max(1.2, ...m.atomos.map((a) => mod(a.p) + (a.r || 0.5))) + (op.seta ? 0.4 : 0), s0 = (0.44 * Math.min(w, h) / rmax) * zoom, cx = x0 + w / 2, cy = y0 + h / 2 + 8;
    const P = m.atomos.map((a) => { const v = mv(R, a.p), f = 1 + v[2] * 0.035; return { x: cx + v[0] * s0 * f, y: cy - v[1] * s0 * f, z: v[2], s: s0 * f }; });
    const pt = (p) => { const v = mv(R, p), f = 1 + v[2] * 0.035; return { x: cx + v[0] * s0 * f, y: cy - v[1] * s0 * f, z: v[2], s: s0 * f }; };
    const itens = [];
    m.ligs.forEach(([i, j, ord]) => { if (!vis[i] || !vis[j]) return; const a = P[i], b = P[j], mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, n = Math.hypot(dx, dy) || 1, ox = -dy / n, oy = dx / n;
      [[a, i], [b, j]].forEach(([p, k]) => itens.push({ z: (p.z * 2 + (a.z + b.z) / 2) / 3 - 0.01, f: () => { const el = m.atomos[k].el, cor = escuro(COR[el] || "#aaaaaa", 0.82), esp = (op.esq ? 0.07 : 0.11) * p.s;
        const linha = (o, tr, alfa) => { ctx.beginPath(); ctx.moveTo(p.x + ox * o, p.y + oy * o); ctx.lineTo(mx + ox * o, my + oy * o); ctx.lineWidth = Math.max(1.2, esp); ctx.strokeStyle = cor; ctx.globalAlpha = alfa; ctx.setLineDash(tr ? [esp * 1.1, esp * 0.9] : []); ctx.lineCap = tr ? "butt" : "round"; ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; };
        const g = 0.105 * p.s;
        if (ord === 0.5) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my); ctx.lineWidth = 1.3; ctx.strokeStyle = tinta.ink3; ctx.globalAlpha = 0.7; ctx.stroke(); ctx.globalAlpha = 1; }
        else if (ord === 2) { linha(-g, false, 1); linha(g, false, 1); } else if (ord === 3) { linha(-1.7 * g, false, 1); linha(0, false, 1); linha(1.7 * g, false, 1); } else if (ord === 1.5) { linha(-g, false, 1); linha(g, true, 0.9); } else linha(0, false, 1); } })); });
    m.atomos.forEach((a, i) => { if (!vis[i]) return; const p = P[i], r = (a.r || rDes(a.el)) * p.s, cor = COR[a.el] || "#aaaaaa";
      itens.push({ z: p.z, f: () => {
        if (op.esq && !m.ionico) { if (a.el !== "C") { ctx.font = `700 ${Math.round(0.36 * p.s)}px Inter, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; const t = a.el + (a.el !== "H" && vizinhos(m, i).some((j) => m.atomos[j].el === "H" && !vis[j]) ? "H" : ""); ctx.fillStyle = tinta.card; ctx.beginPath(); ctx.arc(p.x, p.y, 0.26 * p.s, 0, 7); ctx.fill(); ctx.fillStyle = cor; ctx.fillText(t, p.x, p.y + 1); } return; }
        const g = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.4, r * 0.08, p.x, p.y, r); g.addColorStop(0, "#ffffff"); g.addColorStop(0.28, cor); g.addColorStop(1, escuro(cor, 0.5));
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.stroke();
        if (a.q) { ctx.font = `700 ${Math.max(11, Math.round(Math.min(r * 0.9, 0.3 * p.s)))}px Inter, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#10141c"; ctx.fillText((Math.abs(a.q) > 1 ? Math.abs(a.q) : "") + (a.q > 0 ? "+" : "−"), p.x, p.y + 1); }
        else if (m.ionico || op.letras) { ctx.font = `700 ${Math.round(r * 0.9)}px Inter, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#10141c"; ctx.fillText(a.el, p.x, p.y + 1); } } }); });
    if (op.pares) m.lp.forEach((l) => { if (!vis[l.i]) return; const a = m.atomos[l.i], c = pt(soma(a.p, esc(l.d, rDes(a.el) + 0.3))), r = 0.2 * c.s, t = uni(mv(R, perp(l.d)));
      itens.push({ z: c.z, f: () => { ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, 7); ctx.fillStyle = "rgba(240,200,60,.34)"; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = "rgba(240,200,60,.9)"; ctx.stroke(); [-1, 1].forEach((sg) => { ctx.beginPath(); ctx.arc(c.x + sg * t[0] * r * 0.42, c.y - sg * t[1] * r * 0.42, Math.max(1.6, r * 0.2), 0, 7); ctx.fillStyle = tinta.ink; ctx.fill(); }); } }); });
    itens.sort((a, b) => a.z - b.z).forEach((it) => it.f());
    /* por cima de tudo: ângulos e seta do dipolo */
    if (op.ang !== undefined && op.ang !== null && m.atomos[op.ang] && vis[op.ang]) { const c = m.atomos[op.ang], viz = vizinhos(m, op.ang).filter((j) => vis[j]), pares2 = [];
      for (let a = 0; a < viz.length; a++) for (let b = a + 1; b < viz.length; b++) pares2.push([viz[a], viz[b]]);
      pares2.slice(0, 6).forEach(([i, j]) => { const u = uni(dif(m.atomos[i].p, c.p)), v = uni(dif(m.atomos[j].p, c.p)), th = (angulo(u, v) * Math.PI) / 180; let w = dif(v, esc(u, pe(u, v))); w = mod(w) > 1e-3 ? uni(w) : perp(u);
        ctx.beginPath(); for (let k = 0; k <= 14; k++) { const t = (th * k) / 14, q = pt(soma(c.p, esc(soma(esc(u, Math.cos(t)), esc(w, Math.sin(t))), 0.62))); k ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); } ctx.lineWidth = 1.6; ctx.strokeStyle = tinta.warn; ctx.stroke();
        const q = pt(soma(c.p, esc(soma(esc(u, Math.cos(th / 2)), esc(w, Math.sin(th / 2))), 0.98))), tx = n1(angulo(u, v)) + "°"; ctx.font = "600 13px Inter, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; const lw = ctx.measureText(tx).width + 8; ctx.fillStyle = tinta.card; ctx.globalAlpha = 0.85; ctx.fillRect(q.x - lw / 2, q.y - 9, lw, 18); ctx.globalAlpha = 1; ctx.fillStyle = tinta.warn; ctx.fillText(tx, q.x, q.y + 1); });
    }
    if (op.seta && mod(op.seta) > 1e-6) { const a = pt([0, 0, 0]), b = pt(op.seta), dx = b.x - a.x, dy = b.y - a.y, n = Math.hypot(dx, dy);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.strokeStyle = tinta.warn; ctx.stroke();
      if (n > 6) { const ux = dx / n, uy = dy / n; ctx.beginPath(); ctx.moveTo(b.x + ux * 12, b.y + uy * 12); ctx.lineTo(b.x - uy * 8, b.y + ux * 8); ctx.lineTo(b.x + uy * 8, b.y - ux * 8); ctx.closePath(); ctx.fillStyle = tinta.warn; ctx.fill(); }
      ctx.font = "700 14px Inter, sans-serif"; ctx.fillStyle = tinta.warn; ctx.textAlign = "center"; ctx.fillText("μ", b.x + (n > 6 ? (dx / n) * 26 : 0), b.y + (n > 6 ? (dy / n) * 26 : -16)); }
    if (m.rotulo) { ctx.font = "600 14px Inter, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = tinta.ink2; ctx.fillText(m.rotulo, x0 + w / 2, y0 + 24); }
    return P.map((p, i) => ({ x: p.x, y: p.y, z: p.z, r: (m.atomos[i].r || rDes(m.atomos[i].el)) * p.s, vis: vis[i] }));
  }
  /* palco: um canvas com um ou mais modelos lado a lado, girando juntos. Arrastar gira, rodinha aproxima, dois cliques recentra. */
  function palco(cv, F, aoClicar) {
    const ctx = cv.getContext("2d"); let R = R0(), zoom = 1, mods = [], op = {}, vivo = true, sujo = true, arr = null, ult = [], t0 = 0, girar = !reduz();
    const tinta = () => { const c = getComputedStyle(cv); const v = (n, d) => c.getPropertyValue(n).trim() || d; return { ink: v("--ink", "#e6e9ef"), ink2: v("--ink2", "#aab2c0"), ink3: v("--ink3", "#7a8394"), card: v("--card", "#161b26"), warn: v("--warn", "#f0b429"), line: v("--line", "#2a3140") }; };
    const mede = () => { const d = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight; if (w && (cv.width !== Math.round(w * d) || cv.height !== Math.round(h * d))) { cv.width = Math.round(w * d); cv.height = Math.round(h * d); } return d; };
    const pinta = () => { const d = mede(), w = cv.width / d, h = cv.height / d, t = tinta(); ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, w, h); const n = mods.length || 1, lw = w / n;
      ult = mods.map((m, k) => { if (k) { ctx.beginPath(); ctx.moveTo(k * lw, 12); ctx.lineTo(k * lw, h - 12); ctx.lineWidth = 1; ctx.strokeStyle = t.line; ctx.stroke(); } ctx.save(); ctx.beginPath(); ctx.rect(k * lw, 0, lw, h); ctx.clip(); const P = cena(ctx, k * lw, 0, lw, h, m, R, zoom, Object.assign({}, op, { ang: op.angs ? op.angs[k] : null, seta: m.seta }), t); ctx.restore(); return P; }); };
    const q = (ts) => { if (!vivo) return; const dt = Math.min(0.05, (ts - t0) / 1000 || 0); t0 = ts; if (girar && !arr) { R = mm(rotY(dt * 0.45), R); sujo = true; } if (sujo) { pinta(); sujo = false; } requestAnimationFrame(q); };
    const pos = (e) => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    cv.addEventListener("pointerdown", (e) => { arr = { p: pos(e), andou: 0 }; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", (e) => { if (!arr) return; const p = pos(e), dx = p[0] - arr.p[0], dy = p[1] - arr.p[1]; arr.andou += Math.abs(dx) + Math.abs(dy); arr.p = p; R = mm(mm(rotY(dx * 0.01), rotX(dy * 0.01)), R); sujo = true; });
    const solta = (e) => { if (!arr) return; const clique = arr.andou < 4, p = arr.p; arr = null; if (clique && aoClicar) { const lw = cv.clientWidth / (mods.length || 1), k = Math.min(mods.length - 1, Math.floor(p[0] / lw)); let melhor = -1, mz = -1e9; (ult[k] || []).forEach((a, i) => { if (a.vis && Math.hypot(a.x - p[0], a.y - p[1]) <= Math.max(a.r, 9) && a.z > mz) { mz = a.z; melhor = i; } }); aoClicar(k, melhor); } };
    cv.addEventListener("pointerup", solta); cv.addEventListener("pointercancel", () => (arr = null));
    cv.addEventListener("wheel", (e) => { e.preventDefault(); zoom = Math.max(0.4, Math.min(3, zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1))); sujo = true; }, { passive: false });
    cv.addEventListener("dblclick", () => { R = R0(); zoom = 1; sujo = true; });
    const ro = window.ResizeObserver ? new ResizeObserver(() => (sujo = true)) : null; if (ro) ro.observe(cv);
    F.aoSair(() => { vivo = false; if (ro) ro.disconnect(); }); requestAnimationFrame(q);
    return { mostra: (ms) => { mods = ms; sujo = true; }, op: (o) => { Object.assign(op, o); sujo = true; }, girar: (v) => { girar = v; }, zoom: (k) => { zoom = Math.max(0.4, Math.min(3, zoom * k)); sujo = true; }, recentra: () => { R = R0(); zoom = 1; sujo = true; }, estado: () => ({ R, zoom, girar, n: mods.length, atomos: ult.map((u) => u.filter((a) => a.vis).length), pontos: ult }), gira: (m) => { R = m; sujo = true; }, pintaJa: () => { pinta(); sujo = false; } };
  }

  /* ---------- busca: nome (em português ou inglês), fórmula ou SMILES; sem acento, sem diferença de maiúscula, com erro de digitação ---------- */
  const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[₀-₉]/g, (d) => SUB.indexOf(d)).replace(/\s+/g, " ").trim();
  const conta = (f) => { if (!/^(?:[A-Z][a-z]?\d*)+$/.test(f)) return null; const d = {}; f.replace(/([A-Z][a-z]?)(\d*)/g, (_, e, n) => { d[e] = (d[e] || 0) + (+n || 1); }); return Object.keys(d).sort().map((e) => e + d[e]).join(" "); };
  const lev = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
  SIM.qMolBusca = (lista, texto) => {
    const cru = String(texto || "").trim(); if (!cru) return { itens: [], porFormula: [] };
    const semEsp = cru.replace(/\s+/g, ""), fq = norm(semEsp).replace(/\^/g, ""), cq = conta(semEsp.replace(/[₀-₉]/g, (d) => SUB.indexOf(d))), achou = new Map();
    const poe = (m, como) => { if (!achou.has(m.id)) achou.set(m.id, { m, como }); };
    const porFormula = lista.filter((m) => norm(m.formula).replace(/\^/g, "") === fq || (cq && cq === conta(m.formula)));
    porFormula.forEach((m) => poe(m, "fórmula"));
    lista.filter((m) => m.smiles === cru).forEach((m) => poe(m, "SMILES"));
    const tq = norm(cru).split(/[^a-z0-9α-ω]+/).filter(Boolean), texto2 = (m) => norm(m.nome + " " + m.en);
    if (tq.length) { lista.filter((m) => texto2(m).split(/[^a-z0-9α-ω]+/).some((p) => p.startsWith(tq[0])) && tq.every((t) => texto2(m).includes(t))).forEach((m) => poe(m, "nome"));
      lista.filter((m) => tq.every((t) => texto2(m).includes(t))).forEach((m) => poe(m, "nome"));
      lista.filter((m) => tq.every((t) => t.length >= 4 && texto2(m).split(/[^a-z0-9α-ω]+/).some((p) => lev(t, p) <= (t.length >= 8 ? 2 : 1)))).forEach((m) => poe(m, "nome parecido")); }
    return { itens: [...achou.values()], porFormula };
  };

  const CSS = `.mv{display:grid;grid-template-columns:minmax(0,1fr) 286px;gap:0;border-bottom:1px solid var(--line)}
  .mv-esq{min-width:0;padding:12px 14px 12px 16px}.mv-palco{position:relative;aspect-ratio:1/1;background:radial-gradient(circle at 50% 42%,color-mix(in srgb,var(--mod) 9%,var(--bg)),var(--bg) 72%);border:1px solid var(--line);border-radius:12px;overflow:hidden}
  .mv-palco canvas{position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab;touch-action:none}.mv-palco canvas:active{cursor:grabbing}
  .mv-msg{position:absolute;left:0;right:0;bottom:8px;text-align:center;font-size:12.5px;color:var(--ink3);pointer-events:none}
  .mv-bts{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
  .mv-dir{border-left:1px solid var(--line);background:var(--card2);display:flex;flex-direction:column;min-height:0;max-height:640px}
  .mv-busca{padding:12px 12px 8px}.mv-busca label{display:block;font-size:12.5px;color:var(--ink2);margin-bottom:5px}
  .mv-busca input{width:100%;box-sizing:border-box;background:var(--bg);color:var(--ink);border:1px solid var(--line2);border-radius:8px;padding:8px 10px;font:500 14px var(--f-text)}.mv-busca input:focus{outline:2px solid var(--mod);outline-offset:1px}
  .mv-nota{font-size:12px;color:var(--ink3);line-height:1.4;margin-top:6px}.mv-achou{font-size:12.5px;color:var(--ink2);padding:0 12px 6px}.mv-achou b{color:var(--warn)}
  .mv-lista{overflow:auto;padding:0 8px 10px;flex:1}.mv-grupo{font:600 11px var(--f-text);text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);padding:10px 4px 4px}
  .mv-it{display:flex;gap:8px;align-items:baseline;width:100%;text-align:left;background:none;border:1px solid transparent;border-radius:7px;padding:5px 7px;color:var(--ink);font:500 13.5px var(--f-text);cursor:pointer}
  .mv-it:hover{background:var(--card)}.mv-it[aria-pressed=true]{background:color-mix(in srgb,var(--mod) 20%,var(--card));border-color:var(--mod)}
  .mv-it .f{min-width:74px;font-weight:650;font-variant-numeric:tabular-nums}.mv-it .n{color:var(--ink2);font-size:12.5px;line-height:1.3}.mv-it small{color:var(--warn);font-size:11px;margin-left:auto;white-space:nowrap}
  .mv-ficha{padding:12px 18px 4px;display:grid;gap:12px}.mv-ficha.dupla{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
  .mv-fc h4{margin:0 0 6px;font-size:17px}.mv-fc h4 span{font-weight:500;color:var(--ink3);font-size:13.5px;margin-left:6px}
  .mv-fc dl{display:grid;grid-template-columns:150px 1fr;gap:4px 12px;margin:0;font-size:14px}.mv-fc dt{color:var(--ink3)}.mv-fc dd{margin:0}.mv-fc code{font-size:13px;background:var(--bg);padding:1px 6px;border-radius:5px;word-break:break-all}
  .mv-aviso{border:1px solid color-mix(in srgb,var(--warn) 55%,transparent);background:color-mix(in srgb,var(--warn) 10%,transparent);border-radius:9px;padding:8px 12px;font-size:14px;margin-top:8px}
  .mv-modelo{color:var(--ink2);font-size:13px;margin-top:6px}
  .vc{display:grid;grid-template-columns:minmax(0,1fr) 300px;border-bottom:1px solid var(--line)}.vc-dir{border-left:1px solid var(--line);background:var(--card2);padding:12px 14px;display:flex;flex-direction:column;gap:12px}
  .vc-dir h5{margin:0 0 5px;font:600 12px var(--f-text);color:var(--ink2)}.vc-pos{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.vc-pos select{width:100%;background:var(--bg);color:var(--ink);border:1px solid var(--line2);border-radius:7px;padding:5px 4px;font:500 13px var(--f-text)}`;
  const estilo = () => { if (!document.getElementById("mv-css")) { const s = document.createElement("style"); s.id = "mv-css"; s.textContent = CSS; document.head.appendChild(s); } };
  const escrito = (cod) => (window.CATALOGO || []).some((md) => /^(Q|EQ)/.test(md.id) && md.temas.some((t) => t[0] === cod && t[3]));
  const bt = (k, nome, on) => `<button class="bt peq" data-b="${k}" aria-pressed="${!!on}">${nome}</button>`;

  /* ---------- visualizador ---------- */
  /* nome: "Visualizador de moléculas em 3D" · matéria: Química · tema: MV01 */
  SIM.qMoleculas = (el, F) => {
    estilo();
    el.insertAdjacentHTML("beforeend", `<div class="mv"><div class="mv-esq"><div class="mv-palco"><canvas aria-label="molécula em três dimensões"></canvas><div class="mv-msg" data-v="msg">carregando o catálogo…</div></div>
      <div class="mv-bts">${bt("g", "girar", !reduz())}${bt("h", "hidrogênios", true)}${bt("e", "só o esqueleto", false)}${bt("p", "pares isolados", false)}${bt("a", "ângulos de ligação", false)}<button class="bt peq" data-z="-">−</button><button class="bt peq" data-z="+">+</button><button class="bt peq" data-z="0">recentrar</button></div></div>
      <aside class="mv-dir"><div class="mv-busca"><label for="mv-q">Buscar por nome, fórmula ou SMILES</label><input id="mv-q" type="search" placeholder="água, H2O, ethanol, C2H6O, CCO…" autocomplete="off" spellcheck="false"><div class="mv-nota" data-v="nota"></div></div><div class="mv-achou" data-v="achou"></div><div class="mv-lista" data-v="lista"></div></aside></div>
      <div class="mv-ficha" data-v="ficha"></div>
      <div class="status">Arraste para girar, use a rodinha (ou os botões − e +) para aproximar e dê dois cliques para recentrar. Com <b>ângulos de ligação</b> ligado, clique num átomo para ver os ângulos em volta dele. As cores são as usuais: H branco, C cinza, N azul, O vermelho, F e Cl verdes, S amarelo, P laranja.</div>`);
    const q = (s) => el.querySelector(s), cv = q("canvas"); let dados = null, abertos = [], mods = [], angs = [], op = { h: true, e: false, p: false, a: false };
    const pal = palco(cv, F, (k, i) => { if (op.a && i >= 0 && vizinhos(mods[k], i).length >= 2) { angs[k] = i; pal.op({ angs: angs.slice() }); } });
    const centroPadrao = (m) => { const an = m.reg.angulo; let c = -1; if (an && !m.ionico) c = m.atomos.findIndex((a, i) => a.el === (an.rot.split("–")[1] || "") && vizinhos(m, i).length >= 2); if (c < 0) { let best = 1; m.atomos.forEach((a, i) => { const n = vizinhos(m, i).length; if (n > best && !m.ionico) { best = n; c = i; } }); } return c < 0 ? null : c; };
    const aplica = () => { pal.op({ semH: !op.h, esq: op.e, pares: op.p, angs: op.a ? angs.slice() : null }); const m0 = mods[0], ion = m0 && m0.ionico; q("[data-b=h]").disabled = ion || !mods.some((m) => m.nH && m.pesados > 1); q("[data-b=e]").disabled = ion; q("[data-b=p]").disabled = ion || !mods.some((m) => m.lp.length); q("[data-b=a]").disabled = ion || !mods.some((m) => centroPadrao(m) !== null);
      q("[data-v=msg]").textContent = ion ? "íons e retículo: não é uma molécula" : op.a ? "clique num átomo para ver os ângulos em volta dele" : mods.length > 1 ? "isômeros: mesma fórmula, arranjos diferentes" : ""; };
    const linha = (r, v) => (v ? `<dt>${r}</dt><dd>${v}</dd>` : "");
    const ficha = (m) => { const an = m.angulo, ion = m.tipo === "ionico", iso = m.isomeros && dados.lista.find((x) => x.id === m.isomeros);
      const ang = an && an.calc && an.calc.length ? `${an.calc.map((x) => n1(x) + "°").join(", ")} <span style="color:var(--ink3)">(${an.rot}, calculado nas coordenadas do modelo)</span>` : "";
      const ref = an ? (an.ref !== null && an.ref !== undefined ? `${n1(an.ref)}° <span style="color:var(--ink3)">(${an.fonte})</span>` : an.fonte) : "";
      return `<div class="mv-fc" data-id="${m.id}"><h4>${m.nome}<span>${m.en}</span></h4><dl>${linha("fórmula", `<b>${fBonita(m.formula)}</b>`)}${linha("SMILES", `<code>${m.smiles.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code>`)}${linha("geometria", m.geometria)}${linha("ângulo no modelo", ang)}${linha("ângulo de livro", ref)}${linha("usos", (m.usos || []).join("; "))}${linha("de onde vem o desenho", m.origem)}</dl>
        ${ang && ref ? `<div class="mv-modelo">Os dois ângulos não precisam coincidir: o desenho é um <b>modelo</b>, e modelo é aproximação. O valor de livro é o medido.</div>` : ""}
        ${m.nota ? `<div class="mv-aviso">${m.nota}${ion ? ` No sólido, cada íon fica cercado por 6 vizinhos de carga oposta.${escrito("EQ18") ? ` <a href="${F.href("EQ18", "quimica")}">Monte o retículo no experimento EQ18.</a>` : " O experimento EQ18 (monte o retículo) ainda está em breve."}` : ""}</div>` : ""}
        ${iso && abertos.length === 1 ? `<p style="margin:8px 0 0"><button class="bt peq" data-iso="${m.id},${iso.id}">ver ao lado do isômero: ${iso.nome}</button></p>` : ""}</div>`; };
    const abre = (ids) => { abertos = ids.slice(0, 3).map((id) => dados.lista.find((m) => m.id === id)).filter(Boolean); if (!abertos.length) return;
      mods = abertos.length === 1 && abertos[0].tipo === "ionico" ? modelosIonicos(abertos[0]) : abertos.filter((m) => m.tipo !== "ionico").map(modelo); if (abertos.length > 1) mods.forEach((m) => (m.rotulo = m.reg.nome)); else if (!mods[0].ionico) mods[0].rotulo = "";
      angs = mods.map(centroPadrao); pal.mostra(mods); aplica(); const f = q("[data-v=ficha]"); f.classList.toggle("dupla", abertos.length > 1); f.innerHTML = abertos.map(ficha).join("");
      el.querySelectorAll(".mv-it").forEach((b) => b.setAttribute("aria-pressed", abertos.some((m) => m.id === b.dataset.id))); el.dataset.abertos = abertos.map((m) => m.id).join(","); };
    const lista = (itens, busca) => { let h = "", g = ""; itens.forEach(({ m, como }) => { if (!busca && m.grupo !== g) { g = m.grupo; h += `<div class="mv-grupo">${g}</div>`; } h += `<button class="mv-it" data-id="${m.id}" aria-pressed="${abertos.some((x) => x.id === m.id)}"><span class="f">${fBonita(m.formula)}</span><span class="n">${m.nome}</span>${busca ? `<small>${como}</small>` : ""}</button>`; }); q("[data-v=lista]").innerHTML = h || `<div class="mv-nota" style="padding:10px 4px">Nada no catálogo com esse nome, fórmula ou SMILES.</div>`; };
    const busca = () => { const t = q("#mv-q").value, r = SIM.qMolBusca(dados.lista, t), a = q("[data-v=achou]");
      if (!t.trim()) { a.innerHTML = ""; return lista(dados.lista.map((m) => ({ m })), false); }
      lista(r.itens, true);
      if (r.porFormula.length > 1) { a.innerHTML = `<b>${r.porFormula.length} isômeros</b> com a fórmula ${fBonita(r.porFormula[0].formula)}: mesma fórmula, moléculas diferentes. Estão lado a lado.`; abre(r.porFormula.map((m) => m.id)); }
      else { a.innerHTML = r.itens.length ? `${r.itens.length} ${r.itens.length === 1 ? "resultado" : "resultados"}` : ""; if (r.itens.length === 1 || r.porFormula.length === 1) abre([(r.porFormula[0] || r.itens[0].m).id]); } };
    el.addEventListener("click", (e) => { const it = e.target.closest(".mv-it"); if (it) return abre([it.dataset.id]); const iso = e.target.closest("[data-iso]"); if (iso) return abre(iso.dataset.iso.split(","));
      const z = e.target.closest("[data-z]"); if (z) return z.dataset.z === "0" ? pal.recentra() : pal.zoom(z.dataset.z === "+" ? 1.2 : 1 / 1.2);
      const b = e.target.closest("[data-b]"); if (!b || b.disabled) return; const k = b.dataset.b, on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); if (k === "g") return pal.girar(on); op[k] = on; aplica(); });
    q("#mv-q").addEventListener("input", () => dados && busca());
    SIM.qMoleculas._ult = { pal, abre: (ids) => abre(ids), estado: () => ({ abertos: abertos.map((m) => m.id), mods: mods.length, op: Object.assign({}, op), angs: angs.slice(), lp: mods.map((m) => m.lp.length) }) };
    carrega().then((d) => { dados = d; q("[data-v=nota]").innerHTML = `A busca por SMILES só encontra moléculas <b>deste catálogo</b> (${d.lista.length} por enquanto), e só quando o SMILES é escrito como está na ficha. Ela não desenha molécula nova.`; lista(d.lista.map((m) => ({ m })), false); abre(["h2o"]); }).catch(() => { q("[data-v=msg]").textContent = "O catálogo de moléculas não carregou. Recarregue a página."; });
  };

  /* ---------- construtor VSEPR ---------- */
  const s8 = Math.sqrt(8) / 3, c3 = (k) => [Math.cos((k * 2 * Math.PI) / 3), Math.sin((k * 2 * Math.PI) / 3)];
  /* mesmas direções e mesma convenção do gerador e do laboratório do C04: os pares isolados ocupam as PRIMEIRAS posições */
  const GEO = { 2: [[1, 0, 0], [-1, 0, 0]], 3: [[0, 1, 0], [-Math.sqrt(3) / 2, -0.5, 0], [Math.sqrt(3) / 2, -0.5, 0]], 4: [[0, 1, 0], ...[0, 1, 2].map((k) => [s8 * c3(k)[0], -1 / 3, s8 * c3(k)[1]])], 5: [...[0, 1, 2].map((k) => [c3(k)[0], 0, c3(k)[1]]), [0, 1, 0], [0, -1, 0]], 6: [[0, -1, 0], [0, 1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]] };
  const AXE = { "2,0": ["linear", "linear", "180°", "CO₂, BeCl₂"], "3,0": ["trigonal plana", "trigonal plana", "120°", "BF₃, SO₃"], "2,1": ["trigonal plana", "angular", "um pouco menor que 120°", "SO₂, O₃"], "4,0": ["tetraédrica", "tetraédrica", "109,5°", "CH₄, NH₄⁺"], "3,1": ["tetraédrica", "piramidal", "um pouco menor que 109,5°", "NH₃, PCl₃"], "2,2": ["tetraédrica", "angular", "um pouco menor que 109,5°", "H₂O, H₂S"],
    "5,0": ["bipirâmide trigonal", "bipirâmide trigonal", "90°, 120° e 180°", "PCl₅"], "4,1": ["bipirâmide trigonal", "gangorra", "cerca de 90°, 120° e 180°", "SF₄"], "3,2": ["bipirâmide trigonal", "forma de T", "cerca de 90° e 180°", "ClF₃"], "2,3": ["bipirâmide trigonal", "linear", "180°", "XeF₂, I₃⁻"], "6,0": ["octaédrica", "octaédrica", "90° e 180°", "SF₆"], "5,1": ["octaédrica", "pirâmide de base quadrada", "cerca de 90°", "BrF₅"], "4,2": ["octaédrica", "quadrada plana", "90° e 180°", "XeF₄"] };
  const CENTRAIS = ["Be", "B", "C", "N", "O", "P", "S", "Cl", "Xe"], LIGANTES = ["H", "F", "Cl", "Br", "I", "O"];
  const chi = (el) => { const t = window.TABELA_DADOS && window.TABELA_DADOS.elementos.find((e) => e && e.s === el); return t && typeof t.en === "number" ? t.en : null; };
  /* conta do construtor, separada do desenho (é o que o teste e o Python conferem) */
  SIM.qVseprConta = (central, ligs, E, raios) => { const X = ligs.length, dirs = GEO[X + E], chiC = chi(central); let mu = [0, 0, 0], sem = chiC === null;
    const atomos = [{ el: central, p: [0, 0, 0], q: 0 }], lg = [];
    ligs.forEach((l, k) => { const d = dirs[E + k], dist = ((raios && raios[central]) || 0.9) + ((raios && raios[l]) || 0.7); atomos.push({ el: l, p: esc(d, dist), q: 0 }); lg.push([0, k + 1, l === "O" ? 2 : 1]); const c = chi(l); if (c === null) sem = true; else if (!sem) mu = soma(mu, esc(d, c - chiC)); });
    const angs = []; for (let a = 0; a < X; a++) for (let b = a + 1; b < X; b++) angs.push(Math.round(angulo(dirs[E + a], dirs[E + b]) * 10) / 10);
    return { atomos, ligs: lg, pares: dirs.slice(0, E).map((d) => [0, d[0], d[1], d[2]]), mu: sem ? null : mu, modMu: sem ? null : mod(mu), angs: [...new Set(angs)].sort((a, b) => a - b), nome: AXE[X + "," + E] }; };
  /* nome: "Construtor VSEPR: geometria e dipolo" · matéria: Química · tema: MV02 */
  SIM.qVsepr3d = (el, F) => {
    estilo(); let central = "C", X = 4, E = 0, ligs = ["H", "H", "H", "H"], raios = null, verPares = true;
    const sub = (n) => (n === 1 ? "" : String(n).split("").map((c) => SUB[+c]).join(""));
    el.insertAdjacentHTML("beforeend", `<div class="vc"><div class="mv-esq"><div class="mv-palco"><canvas aria-label="geometria montada, em três dimensões"></canvas><div class="mv-msg" data-v="msg"></div></div><div class="mv-bts">${bt("g", "girar", !reduz())}${bt("p", "pares isolados", true)}${bt("d", "seta do dipolo", true)}<button class="bt peq" data-z="-">−</button><button class="bt peq" data-z="+">+</button><button class="bt peq" data-z="0">recentrar</button></div></div>
      <aside class="vc-dir"><div><h5>Átomo central</h5><div class="bts" data-v="cen"></div></div><div><h5>Átomos ligados (X)</h5><div class="bts" data-v="nx"></div></div><div><h5>Pares isolados no átomo central (E)</h5><div class="bts" data-v="ne"></div></div><div><h5>Quem é cada átomo ligado</h5><div class="vc-pos" data-v="pos"></div><p class="mv-nota">Troque um só e veja a seta do dipolo aparecer: CH₄ → CH₃Cl.</p></div></aside></div>
      <div class="leitor" data-v="lt"></div>
      <div class="status">O construtor monta o que você pedir, mesmo que a molécula não exista: ele mostra a geometria que o modelo VSEPR prevê para aquele número de regiões de elétrons, com os ângulos <b>ideais</b>. A seta μ é a soma dos dipolos das ligações (cada um do tamanho da diferença de eletronegatividade, apontando para o átomo mais eletronegativo): se ela some, os dipolos se cancelam e a molécula é apolar. É uma conta <b>qualitativa</b>: os pares isolados também contribuem para o dipolo real (por isso NH₃ é bem mais polar que NF₃), e isso a seta não mostra.</div>`);
    const q = (s) => el.querySelector(s), pal = palco(q("canvas"), F, null); let verSeta = true;
    const monta = () => { const r = SIM.qVseprConta(central, ligs, E, raios), m = { reg: {}, atomos: r.atomos, ligs: r.ligs, pares: r.pares, rotulo: "" }; m.lp = pares(m); m.nH = 0; m.pesados = 9;
      const max = 1.8; m.seta = verSeta && r.mu && r.modMu > 0.02 ? esc(uni(r.mu), Math.min(2.6, 0.9 + (r.modMu / max) * 1.4)) : null; pal.mostra([m]); pal.op({ pares: verPares, letras: true });
      q("[data-v=cen]").innerHTML = CENTRAIS.map((c) => `<button class="bt peq" data-c="${c}" aria-pressed="${c === central}" title="${NOMEEL[c]}">${c}</button>`).join("");
      q("[data-v=nx]").innerHTML = [2, 3, 4, 5, 6].map((n) => `<button class="bt peq" data-x="${n}" aria-pressed="${n === X}">${n}</button>`).join("");
      q("[data-v=ne]").innerHTML = [0, 1, 2, 3].map((n) => `<button class="bt peq" data-e="${n}" aria-pressed="${n === E}" ${AXE[X + "," + n] ? "" : "disabled"}>${n}</button>`).join("");
      q("[data-v=pos]").innerHTML = ligs.map((l, k) => `<select data-k="${k}" aria-label="átomo ligado ${k + 1}">${LIGANTES.map((o) => `<option value="${o}" ${o === l ? "selected" : ""}>${o === "O" ? "O (dupla)" : o}</option>`).join("")}</select>`).join("");
      const cont = {}; ligs.forEach((l) => (cont[l] = (cont[l] || 0) + 1)); const form = central + Object.keys(cont).map((l) => l + sub(cont[l])).join(""), vis = (a, b) => `<div class="vis"><small>${a}</small><b>${b}</b></div>`;
      const polar = r.modMu === null ? "sem dado de eletronegatividade" : r.modMu > 0.02 ? "não se cancelam: <span style=\"color:var(--warn)\">polar</span>" : "se cancelam: apolar";
      q("[data-v=lt]").innerHTML = vis("espécie montada", form) + vis("notação", "AX" + sub(X) + (E ? "E" + sub(E) : "")) + vis("arranjo dos elétrons", r.nome[0]) + vis("geometria molecular", r.nome[1]) + vis("ângulos ideais entre ligações", r.angs.map((a) => n1(a, a % 1 ? 1 : 0) + "°").join(", ")) + vis("soma dos dipolos (em Δχ)", r.modMu === null ? "—" : n1(r.modMu, 2)) + vis("dipolos das ligações", polar) + vis("exemplo real dessa geometria", r.nome[3]);
      q("[data-v=msg]").textContent = r.nome[2].startsWith("cerca") || r.nome[2].startsWith("um pouco") ? "na molécula real, os pares isolados apertam os ângulos: " + r.nome[2] : ""; el.dataset.geo = r.nome[1]; el.dataset.mu = r.modMu === null ? "" : r.modMu.toFixed(3); };
    el.addEventListener("click", (e) => { const t = e.target.closest("button"); if (!t || t.disabled) return;
      if (t.dataset.c) central = t.dataset.c; else if (t.dataset.x) { X = +t.dataset.x; const base = ligs[0] || "H"; ligs = Array.from({ length: X }, (_, k) => ligs[k] || base); if (!AXE[X + "," + E]) E = 0; } else if (t.dataset.e) E = +t.dataset.e;
      else if (t.dataset.z) return t.dataset.z === "0" ? pal.recentra() : pal.zoom(t.dataset.z === "+" ? 1.2 : 1 / 1.2);
      else if (t.dataset.b) { const on = t.getAttribute("aria-pressed") !== "true"; t.setAttribute("aria-pressed", on); if (t.dataset.b === "g") return pal.girar(on); if (t.dataset.b === "p") verPares = on; if (t.dataset.b === "d") verSeta = on; } else return; monta(); });
    el.addEventListener("change", (e) => { const s = e.target.closest("select[data-k]"); if (!s) return; ligs[+s.dataset.k] = s.value; monta(); });
    SIM.qVsepr3d._ult = { pal, poe: (c, l, e) => { central = c; ligs = l.slice(); X = l.length; E = e; monta(); } };
    monta(); carrega().then((d) => { raios = d.raios; monta(); }).catch(() => {});
  };

  /* desenho da página inicial da aba: metano de arame, girando devagar */
  const animMolecula = (el) => { el.innerHTML = `<svg viewBox="-170 -150 340 300" aria-label="molécula tetraédrica girando"><g class="g"></g></svg>`; const g = el.querySelector(".g"); let vivo = true; const t0 = performance.now(), parado = reduz();
    const q = (t) => { if (!vivo) return; const R = mm(rotX(-0.3), rotY(parado ? 0.6 : (t - t0) / 2600)), P = GEO[4].map((d) => { const v = mv(R, d), f = 1 + v[2] * 0.12; return [v[0] * 104 * f, -v[1] * 104 * f, v[2]]; }); let h = "";
      P.map((p, k) => [p, k]).sort((a, b) => a[0][2] - b[0][2]).forEach(([p]) => { h += `<line x1="0" y1="0" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" style="stroke:var(--ink2);stroke-width:${(3 + p[2]).toFixed(1)}"/><circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(15 + 4 * p[2]).toFixed(1)}" style="fill:var(--card);stroke:var(--materia);stroke-width:2.4"/>`; });
      g.innerHTML = `<circle r="118" style="fill:none;stroke:var(--materia);stroke-width:1.2;stroke-dasharray:3 7;opacity:.4"/>` + h + `<circle r="24" style="fill:var(--card);stroke:var(--mN);stroke-width:2.6"/>`; if (!parado) requestAnimationFrame(q); };
    requestAnimationFrame(q); if (window.F && window.F.aoSair) window.F.aoSair(() => (vivo = false)); };
  document.addEventListener("DOMContentLoaded", () => { if (window.F && window.F.ANIM) window.F.ANIM.molecula = animMolecula; });
})();
