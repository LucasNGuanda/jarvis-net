/* Simulações e desenhos da Química, módulo H (Química orgânica).
   SIM.org: núcleo que lê um SMILES simples e devolve o grafo da molécula, a fórmula molecular, a massa molar, o índice de deficiência de hidrogênio
   e um desenho em SVG (fórmula de traços, com os carbonos escritos como CH₃, CH₂... ou em bastão).
   SMILES aceito (subconjunto): átomos C N O S F Cl Br I e aromáticos c n o; colchetes simples com carga ou H explícito ([O-], [NH4+], [Na+]);
     ligações - = #; ramificações com parênteses; fechamento de anel com um dígito; estereoquímica (@, /, \) é ignorada no desenho.
   Hidrogênios implícitos pela valência normal: C 4, N 3, O 2, S 2, halogênios 1 (átomo aromático conta uma ligação a mais).
   Massas atômicas de prova (SIM.MA). Conferência: tools/quimica/confere-organica.py compara fórmula e massa de cada SMILES usado nos temas com o RDKit. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const VAL = { C: 4, N: 3, O: 2, S: 2, F: 1, Cl: 1, Br: 1, I: 1, H: 1, P: 3 };
  const MA = () => SIM.MA || { H: 1, C: 12, N: 14, O: 16, F: 19, S: 32, Cl: 35.5, Br: 80, I: 127, Na: 23, K: 39, P: 31 };
  const SUB = (n) => String(n).split("").map((c) => "₀₁₂₃₄₅₆₇₈₉"[+c]).join("");

  /* ---------- leitura do SMILES ---------- */
  const parse = (smi) => {
    const at = [], bd = [], pilha = [], aneis = {}; let ant = -1, ordem = 1, i = 0;
    const liga = (a, b, o) => bd.push({ a, b, o });
    const novo = (el, arom, carga = 0, hExp = null) => { at.push({ el, arom, carga, hExp, viz: [] }); const k = at.length - 1; if (ant >= 0) liga(ant, k, ordem === 1 && arom && at[ant].arom ? 1.5 : ordem); ant = k; ordem = 1; return k; };
    while (i < smi.length) { const c = smi[i];
      if (c === "(") { pilha.push(ant); i++; } else if (c === ")") { ant = pilha.pop(); i++; }
      else if (c === "=") { ordem = 2; i++; } else if (c === "#") { ordem = 3; i++; } else if (c === "-" || c === "/" || c === "\\" || c === "@") { i++; }
      else if (c === ".") { ant = -1; i++; }
      else if (/\d/.test(c)) { if (aneis[c] !== undefined) { const o = aneis[c]; liga(o.k, ant, o.o !== 1 ? o.o : ordem !== 1 ? ordem : at[o.k].arom && at[ant].arom ? 1.5 : 1); delete aneis[c]; ordem = 1; } else { aneis[c] = { k: ant, o: ordem }; ordem = 1; } i++; }
      else if (c === "[") { const f = smi.indexOf("]", i), m = smi.slice(i + 1, f).match(/^([A-Z][a-z]?|[cnos])(@*)(H(\d?))?([+-]\d?|[+-]+)?$/); if (!m) throw new Error("SMILES: colchete não entendido em " + smi); const ar = /[cnos]/.test(m[1]), el = ar ? m[1].toUpperCase() : m[1], cg = m[5] ? (m[5].length > 1 && /\d/.test(m[5][1]) ? +m[5][1] : m[5].length) * (m[5][0] === "+" ? 1 : -1) : 0; novo(el, ar, cg, m[3] ? (m[4] ? +m[4] : 1) : 0); i = f + 1; }
      else { const dois = smi.slice(i, i + 2); if (dois === "Cl" || dois === "Br") { novo(dois, false); i += 2; } else if (/[CNOSFIP]/.test(c)) { novo(c, false); i++; } else if (/[cnos]/.test(c)) { novo(c.toUpperCase(), true); i++; } else throw new Error("SMILES: caractere não entendido '" + c + "' em " + smi); } }
    bd.forEach((b, k) => { at[b.a].viz.push([b.b, k]); at[b.b].viz.push([b.a, k]); });
    at.forEach((a) => { if (a.hExp !== null) { a.h = a.hExp; return; } const s = a.viz.reduce((t, [, k]) => t + (bd[k].o === 1.5 ? 1 : bd[k].o), 0) + (a.arom ? 1 : 0), v = (VAL[a.el] || 0) + (a.el === "N" && a.carga > 0 ? 1 : 0) - (a.el === "O" && a.carga < 0 ? 1 : 0); a.h = Math.max(0, v - s); });
    return { at, bd, smi };
  };
  const conta = (g) => { const c = {}; g.at.forEach((a) => { c[a.el] = (c[a.el] || 0) + 1; if (a.h) c.H = (c.H || 0) + a.h; }); return c; };
  /* fórmula molecular no sistema de Hill (C, H, depois ordem alfabética) */
  const formula = (smi, modo = "txt") => { const c = conta(parse(smi)), ord = [...(c.C ? ["C", "H"] : []), ...Object.keys(c).filter((k) => !(c.C && (k === "C" || k === "H"))).sort()].filter((k) => c[k]); return ord.map((k) => k + (c[k] > 1 ? (modo === "txt" ? SUB(c[k]) : modo === "ce" ? c[k] : "_{" + c[k] + "}") : "")).join(""); };
  const massa = (smi) => { const c = conta(parse(smi)), m = MA(); return Object.keys(c).reduce((t, k) => t + c[k] * m[k], 0); };
  /* índice de deficiência de hidrogênio: (2C + 2 + N − H − X) / 2 */
  const idh = (smi) => { const c = conta(parse(smi)), X = (c.F || 0) + (c.Cl || 0) + (c.Br || 0) + (c.I || 0); return (2 * (c.C || 0) + 2 + (c.N || 0) - (c.H || 0) - X) / 2; };
  /* classificação de cada carbono: primário, secundário, terciário, quaternário (número de carbonos vizinhos) */
  const classes = (smi) => { const g = parse(smi); return g.at.map((a) => (a.el === "C" ? a.viz.filter(([v]) => g.at[v].el === "C").length : null)); };

  /* ---------- disposição em 2D ---------- */
  const layout = (g, L = 38) => { const n = g.at.length, pos = Array(n).fill(null), feito = Array(n).fill(false);
    /* anel (um só por componente, o suficiente para benzeno, cicloexano etc.): acha um ciclo por busca em profundidade */
    const ciclo = (ini) => { const pai = {}, vis = new Set(); let achou = null; const dfs = (u, p) => { vis.add(u); for (const [v] of g.at[u].viz) { if (v === p) continue; if (vis.has(v)) { if (!achou) { const c = [u]; let x = u; while (x !== v && pai[x] !== undefined) { x = pai[x]; c.push(x); } if (x === v) achou = c; } } else { pai[v] = u; dfs(v, u); if (achou) return; } } }; dfs(ini, -1); return achou; };
    const cresce = (u, dir, lado) => { feito[u] = true; const filhos = g.at[u].viz.map(([v]) => v).filter((v) => !feito[v] && pos[v] === null); if (!filhos.length) return;
      const tot = g.at[u].viz.length; let angs;
      if (filhos.length === 1) angs = [dir + lado * 60]; else if (filhos.length === 2) angs = tot >= 4 ? [dir + 90, dir - 90] : [dir + lado * 60, dir - lado * 60]; else angs = [dir, dir + 90, dir - 90];
      /* ligação tripla ou alenos: em linha reta */
      filhos.forEach((v, k) => { let a = angs[k]; const o = g.bd[g.at[u].viz.find(([x]) => x === v)[1]].o; if (o === 3 || g.at[u].viz.some(([x, kb]) => x !== v && g.bd[kb].o === 3)) a = dir; pos[v] = [pos[u][0] + L * Math.cos((a * Math.PI) / 180), pos[u][1] - L * Math.sin((a * Math.PI) / 180)]; });
      filhos.forEach((v, k) => { let a = angs[k]; const o = g.bd[g.at[u].viz.find(([x]) => x === v)[1]].o; if (o === 3 || g.at[u].viz.some(([x, kb]) => x !== v && g.bd[kb].o === 3)) a = dir; cresce(v, a, k === 0 ? -lado : lado); }); };
    let x0 = 0;
    for (let s = 0; s < n; s++) { if (pos[s] !== null) continue; const c = ciclo(s);
      if (c) { const m = c.length, R = L / (2 * Math.sin(Math.PI / m)); c.forEach((u, k) => { const a = (90 + (360 * k) / m) * (Math.PI / 180); pos[u] = [x0 + R * Math.cos(a), -R * Math.sin(a)]; }); c.forEach((u) => (feito[u] = true)); c.forEach((u, k) => { const dir = 90 + (360 * k) / m, fora = g.at[u].viz.map(([v]) => v).filter((v) => pos[v] === null); fora.forEach((v, j) => { const a = fora.length === 1 ? dir : dir + (j ? -35 : 35); pos[v] = [pos[u][0] + L * Math.cos((a * Math.PI) / 180), pos[u][1] - L * Math.sin((a * Math.PI) / 180)]; }); fora.forEach((v, j) => cresce(v, fora.length === 1 ? dir : dir + (j ? -35 : 35), 1)); }); }
      else { /* começa por uma ponta (átomo com um vizinho), para a cadeia sair em zigue-zague da esquerda para a direita */ const comp = []; const junta = (u) => { if (comp.includes(u)) return; comp.push(u); g.at[u].viz.forEach(([v]) => junta(v)); }; junta(s); const ponta = comp.find((u) => g.at[u].viz.length <= 1) ?? s; pos[ponta] = [x0, 0]; cresce(ponta, -30, 1); }
      const xs = pos.filter((p) => p).map((p) => p[0]); x0 = Math.max(...xs) + 2.2 * L; }
    return pos; };

  /* ---------- desenho ---------- */
  const rotulo = (a, modo) => { if (a.el === "C" && modo === "bastao" && !a.carga) return null; const cg = a.carga ? (Math.abs(a.carga) > 1 ? "⁰¹²³"[Math.abs(a.carga)] : "") + (a.carga > 0 ? "⁺" : "⁻") : ""; return { el: a.el, h: a.h, cg }; };
  /* opts: modo "cond" (carbonos escritos) ou "bastao"; destaque: índices de átomos a realçar; nums: mostra a numeração dada {índice: número}; w, h máximos */
  const svg = (smi, o = {}) => { const g = typeof smi === "string" ? parse(smi) : smi, L = o.L || 38, P = layout(g, L), modo = o.modo || "cond", pad = 26;
    const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]), minx = Math.min(...xs) - pad, miny = Math.min(...ys) - pad, W = Math.max(...xs) - minx + pad, H = Math.max(...ys) - miny + pad, X = (k) => P[k][0] - minx, Y = (k) => P[k][1] - miny;
    let s = "";
    g.bd.forEach((b) => { const x1 = X(b.a), y1 = Y(b.a), x2 = X(b.b), y2 = Y(b.b), dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy), nx = (-dy / d) * 3, ny = (dx / d) * 3, ln = (ox, oy, extra = "") => `<line x1="${(x1 + ox).toFixed(1)}" y1="${(y1 + oy).toFixed(1)}" x2="${(x2 + ox).toFixed(1)}" y2="${(y2 + oy).toFixed(1)}" style="stroke:var(--ink);stroke-width:1.7;${extra}"/>`;
      if (b.o === 2) s += ln(nx, ny) + ln(-nx, -ny); else if (b.o === 3) s += ln(0, 0) + ln(nx * 1.6, ny * 1.6) + ln(-nx * 1.6, -ny * 1.6); else s += ln(0, 0); });
    /* anel aromático: círculo no meio */
    const arom = g.at.map((a, k) => (a.arom ? k : -1)).filter((k) => k >= 0); if (arom.length >= 5) { const cx = arom.reduce((t, k) => t + X(k), 0) / arom.length, cy = arom.reduce((t, k) => t + Y(k), 0) / arom.length; s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(L * 0.55).toFixed(1)}" style="fill:none;stroke:var(--ink);stroke-width:1.4"/>`; }
    g.at.forEach((a, k) => { const r = rotulo(a, modo), dest = o.destaque && o.destaque.includes(k); if (!r) { if (dest) s += `<circle cx="${X(k).toFixed(1)}" cy="${Y(k).toFixed(1)}" r="7" style="fill:var(--warn);opacity:.55"/>`; return; }
      /* o H vai do lado oposto à média dos vizinhos */
      const vx = a.viz.reduce((t, [v]) => t + (P[v][0] - P[k][0]), 0), esq = vx > 2 && r.h > 0, txtH = r.h ? "H" + (r.h > 1 ? SUB(r.h) : "") : "", txt = esq ? txtH + r.el + r.cg : r.el + txtH + r.cg, larg = 9.5 * (r.el.length + (r.h ? 1 : 0) + (r.h > 1 ? 0.6 : 0) + (r.cg ? 0.6 : 0)) + 4, lel = 9.5 * r.el.length, desl = r.h ? (esq ? -(larg - lel) / 2 + 1 : (larg - lel) / 2 - 1) : 0;
      s += `<rect x="${(X(k) + desl - larg / 2).toFixed(1)}" y="${(Y(k) - 9).toFixed(1)}" width="${larg.toFixed(1)}" height="18" rx="4" style="fill:${dest ? "var(--warn)" : "var(--card, var(--bg))"}"/><text x="${(X(k) + desl).toFixed(1)}" y="${(Y(k) + 5).toFixed(1)}" text-anchor="middle" style="font:600 14px Inter,system-ui,sans-serif;fill:${dest ? "#10151c" : a.el === "O" ? "#e5604d" : a.el === "N" ? "#5b8dee" : a.el === "C" ? "var(--ink)" : "#3fae7a"}">${txt}</text>`;
      if (o.nums && o.nums[k] !== undefined) s += `<text x="${X(k).toFixed(1)}" y="${(Y(k) - 13).toFixed(1)}" text-anchor="middle" style="font:500 11px Inter,system-ui,sans-serif;fill:var(--ink2)">${o.nums[k]}</text>`; });
    return { svg: s, w: W, h: H }; };
  /* figura pronta, centralizada numa caixa de largura fixa; várias moléculas lado a lado com legenda embaixo de cada uma */
  const fig = (lista, o = {}) => { const itens = (Array.isArray(lista) ? lista : [lista]).map((x) => (typeof x === "string" ? { smi: x } : x)), des = itens.map((it) => svg(it.smi, { ...o, ...it })), gap = 34, tot = des.reduce((t, d) => t + d.w, 0) + gap * (des.length - 1), hmax = Math.max(...des.map((d) => d.h)), temLeg = itens.some((it) => it.leg), Wf = o.W || 560, Hf = hmax + (temLeg ? 22 : 0) + 8, esc = Math.min(1, (Wf - 20) / tot);
    let x = (Wf - tot * esc) / 2, s = ""; des.forEach((d, k) => { s += `<g transform="translate(${x.toFixed(1)},${(4 + (hmax - d.h) / 2).toFixed(1)}) scale(${esc.toFixed(3)})">${d.svg}</g>`; if (itens[k].leg) s += `<text x="${(x + (d.w * esc) / 2).toFixed(1)}" y="${(hmax * esc + 20).toFixed(1)}" text-anchor="middle" class="tx2">${itens[k].leg}</text>`; x += (d.w + gap) * esc; });
    return `<svg class="figura" viewBox="0 0 ${Wf} ${(Hf * (esc < 1 ? Math.max(esc, 0.6) : 1) + (temLeg ? 6 : 0)).toFixed(0)}" width="${Wf}" role="img" aria-label="fórmula estrutural">${s}</svg>`; };

  SIM.org = { parse, conta, formula, massa, idh, classes, layout, svg, fig };
})();
