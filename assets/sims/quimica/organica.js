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
  /* classificação de cada carbono: 1 primário (ligado a um carbono ou a nenhum, como nos livros brasileiros), 2 secundário, 3 terciário, 4 quaternário */
  const classes = (smi) => { const g = parse(smi); return g.at.map((a) => (a.el === "C" ? Math.max(1, a.viz.filter(([v]) => g.at[v].el === "C").length) : null)); };

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
      if (o.nums && o.nums[k] !== undefined) s += `<text x="${(X(k) - 17).toFixed(1)}" y="${(Y(k) - 11).toFixed(1)}" text-anchor="middle" style="font:600 11px Inter,system-ui,sans-serif;fill:var(--warn)">${o.nums[k]}</text>`; });
    return { svg: s, w: W, h: H }; };
  /* figura pronta, centralizada numa caixa de largura fixa; várias moléculas lado a lado com legenda embaixo de cada uma */
  const fig = (lista, o = {}) => { const itens = (Array.isArray(lista) ? lista : [lista]).map((x) => (typeof x === "string" ? { smi: x } : x)), des = itens.map((it) => svg(it.smi, { ...o, ...it })), gap = 30, temLeg = itens.some((it) => it.leg), Wf = o.W || 560;
    /* cada molécula ocupa uma faixa da largura dela ou da legenda, a que for maior */
    const faixa = des.map((d, k) => Math.max(d.w, itens[k].leg ? itens[k].leg.length * 6.6 + 8 : 0)), tot = faixa.reduce((t, f) => t + f, 0) + gap * (des.length - 1), hmax = Math.max(...des.map((d) => d.h)), esc = Math.min(1, (Wf - 16) / tot), fonte = Math.max(10, 13 * esc);
    let x = (Wf - tot * esc) / 2, s = ""; des.forEach((d, k) => { const cx = x + (faixa[k] * esc) / 2; s += `<g transform="translate(${(cx - (d.w * esc) / 2).toFixed(1)},${(4 + ((hmax - d.h) * esc) / 2).toFixed(1)}) scale(${esc.toFixed(3)})">${d.svg}</g>`; if (itens[k].leg) s += `<text x="${cx.toFixed(1)}" y="${(hmax * esc + 20).toFixed(1)}" text-anchor="middle" class="tx2" style="font-size:${fonte.toFixed(1)}px">${itens[k].leg}</text>`; x += (faixa[k] + gap) * esc; });
    return `<svg class="figura" viewBox="0 0 ${Wf} ${(hmax * esc + (temLeg ? 30 : 8)).toFixed(0)}" width="${Wf}" role="img" aria-label="fórmula estrutural">${s}</svg>`; };

  /* hibridização de cada carbono: sp3 (só simples), sp2 (uma dupla ou aromático), sp (uma tripla ou duas duplas) */
  const hib = (smi) => { const g = parse(smi); return g.at.map((a) => { if (a.el !== "C") return null; const os = a.viz.map(([, k]) => g.bd[k].o), d = os.filter((o) => o === 2).length, t = os.filter((o) => o === 3).length; return t || d === 2 ? "sp" : d === 1 || a.arom ? "sp2" : "sp3"; }); };
  /* ligações sigma e pi da molécula inteira (contando as C–H e as outras com H) */
  const sigmapi = (smi) => { const g = parse(smi), nh = g.at.reduce((t, a) => t + a.h, 0); let sg = nh, pi = 0, ar = 0; g.bd.forEach((b) => { sg += 1; if (b.o === 2) pi += 1; if (b.o === 3) pi += 2; if (b.o === 1.5) ar += 1; }); return { sigma: sg, pi: pi + Math.round(ar / 2) }; };
  /* classificação da cadeia carbônica, como nos livros brasileiros */
  const cadeia = (smi) => { const g = parse(smi), C = g.at.map((a, k) => (a.el === "C" ? k : -1)).filter((k) => k >= 0), nC = C.length, lig = g.bd.filter((b) => g.at[b.a].el === "C" && g.at[b.b].el === "C");
    /* ciclos: ligações − átomos + componentes, no grafo inteiro (anel com heteroátomo também fecha a cadeia) */
    const comp = (() => { const v = new Set(); let c = 0; g.at.forEach((_, k) => { if (v.has(k)) return; c++; const f = [k]; while (f.length) { const u = f.pop(); if (v.has(u)) continue; v.add(u); g.at[u].viz.forEach(([x]) => f.push(x)); } }); return c; })(), ciclos = g.bd.length - g.at.length + comp;
    const emAnel = (() => { const r = new Set(); if (!ciclos) return r; g.bd.forEach((b, kb) => { /* a ligação está num anel se, tirando-a, as pontas continuam ligadas */ const v = new Set(), f = [b.a]; while (f.length) { const u = f.pop(); if (v.has(u)) continue; v.add(u); g.at[u].viz.forEach(([x, k2]) => { if (k2 !== kb) f.push(x); }); } if (v.has(b.b)) { r.add(b.a); r.add(b.b); } }); return r; })();
    const arom = g.at.some((a) => a.arom), insat = lig.some((b) => b.o !== 1);
    /* heteroátomo ENTRE carbonos (ligado a pelo menos dois carbonos) */
    const hetero = g.at.some((a) => a.el !== "C" && a.viz.filter(([v]) => g.at[v].el === "C").length >= 2);
    /* ramificada: cadeia aberta com carbono terciário ou quaternário; cadeia fechada com carbono fora do anel */
    const ram = ciclos ? C.some((k) => !emAnel.has(k)) : C.some((k) => g.at[k].viz.filter(([v]) => g.at[v].el === "C").length >= 3);
    return { nC, aberta: !ciclos, ciclos, aromatica: arom, saturada: !insat, homogenea: !hetero, ramificada: ram, mista: ciclos > 0 && C.some((k) => !emAnel.has(k)) }; };
  /* ---------- nomenclatura IUPAC (recomendações de 1993, como nos livros brasileiros) de hidrocarbonetos de cadeia aberta com ramificações metil e etil ----------
     Regras aplicadas, nesta ordem: (1) a cadeia principal contém todas as duplas e triplas; (2) é a mais longa; (3) entre as de mesmo tamanho, a mais ramificada;
     (4) numeração que dá os menores números às insaturações; (5) depois, os menores números às ramificações; (6) no empate, o menor número ao grupo citado primeiro
     em ordem alfabética. Devolve null se a molécula sai desse universo (anel, heteroátomo, ramificação maior que etil).
     Conferência (tools/quimica/confere-nomes.py): gera todos os alcanos de C4 a C8 por construção, compara com o RDKit e exige um nome por molécula, nomes diferentes
     para moléculas diferentes e o número de isômeros de tabela (2, 3, 5, 9, 18). */
  const PREF = ["", "met", "et", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec", "undec", "dodec"], MULT = ["", "", "di", "tri", "tetra", "penta", "hexa"];
  const analisa = (smi) => { const g = typeof smi === "string" ? parse(smi) : smi; if (g.at.some((a) => a.el !== "C" || a.carga) || g.bd.length !== g.at.length - 1) return null;
    const n = g.at.length, viz = g.at.map((a) => a.viz.map(([v, k]) => [v, g.bd[k].o])); if (n === 1) return { cadeia: [0], ins: [], subs: [], n: 1 };
    const multi = g.bd.filter((b) => b.o > 1), folhas = [...Array(n).keys()].filter((k) => viz[k].length === 1), caminhos = [];
    const anda = (u, vis, cam) => { cam.push(u); vis.add(u); let fim = true; for (const [v] of viz[u]) if (!vis.has(v)) { fim = false; anda(v, vis, cam); } if (fim) caminhos.push([...cam]); cam.pop(); vis.delete(u); };
    folhas.forEach((f) => anda(f, new Set(), []));
    const cands = [];
    for (const c of caminhos) { const pos = new Map(c.map((u, i) => [u, i + 1])); if (!multi.every((b) => pos.has(b.a) && pos.has(b.b))) continue;
      const ins = multi.map((b) => [Math.min(pos.get(b.a), pos.get(b.b)), b.o]).sort((x, y) => x[0] - y[0]); let okc = true; const subs = [];
      for (const u of c) for (const [v] of viz[u]) { if (pos.has(v)) continue; const outros = viz[v].filter(([w]) => w !== u); if (outros.length === 0) subs.push([pos.get(u), "metil"]); else if (outros.length === 1 && viz[outros[0][0]].length === 1 && outros[0][1] === 1) subs.push([pos.get(u), "etil"]); else okc = false; }
      if (okc) cands.push({ cadeia: c, ins, subs: subs.sort((x, y) => x[0] - y[0] || (x[1] < y[1] ? -1 : 1)), n: c.length }); }
    if (!cands.length) return null;
    const lex = (a, b) => { for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i]; return a.length - b.length; }, alfa = (c) => [...c.subs].sort((x, y) => (x[1] < y[1] ? -1 : x[1] > y[1] ? 1 : x[0] - y[0])).map((x) => x[0]);
    cands.sort((A, B) => B.n - A.n || B.subs.length - A.subs.length || lex(A.ins.map((x) => x[0]), B.ins.map((x) => x[0])) || lex(A.ins.filter((x) => x[1] === 2).map((x) => x[0]), B.ins.filter((x) => x[1] === 2).map((x) => x[0])) || lex(A.subs.map((x) => x[0]), B.subs.map((x) => x[0])) || lex(alfa(A), alfa(B)));
    return cands[0]; };
  const nome = (smi) => { const c = analisa(smi); return c ? formata(c) : null; };
  /* escreve o nome de uma descrição {n, ins: [[posição, ordem]], subs: [[posição, tipo]]} tal como foi dada (sem conferir se é a escolha IUPAC) */
  const formata = (c) => { const n = c.n, du = c.ins.filter((x) => x[1] === 2).map((x) => x[0]), tr = c.ins.filter((x) => x[1] === 3).map((x) => x[0]);
    /* ramificações em ordem alfabética (etil antes de metil), com di, tri... */
    const tipos = [...new Set(c.subs.map((x) => x[1]))].sort(), soUm = n <= 3 || (n === 4 && false), partes = tipos.map((t) => { const ls = c.subs.filter((x) => x[1] === t).map((x) => x[0]); return (n === 3 ? "" : ls.join(",") + "-") + MULT[ls.length] + t; });
    let raiz = PREF[n], suf;
    const loc = (ls) => (n <= 3 && ls.length === 1 && !(n === 3 && c.subs.length === 0 && false) ? "" : "-" + ls.join(",") + "-");
    if (!du.length && !tr.length) suf = "ano";
    else { const semLoc = n === 2 || (n === 3 && du.length + tr.length === 1); const pd = du.length ? (semLoc ? "" : "-" + du.join(",") + "-") + MULT[du.length] + "en" : "", pt = tr.length ? (semLoc ? "" : "-" + tr.join(",") + "-") + MULT[tr.length] + "in" : ""; if (du.length > 1 || tr.length > 1) raiz += "a"; suf = pd + pt + "o"; if (du.length && tr.length) suf = pd + pt + "o"; }
    const prefixo = partes.join("-"), junta = prefixo && raiz[0] === "h" ? "-" : "";
    return prefixo + junta + raiz + suf; };
  /* construtor: cadeia principal de n carbonos, insaturações [[posição, ordem]], ramificações [[posição, "metil" | "etil"]] → SMILES */
  const monta = (n, ins = [], subs = []) => { let s = ""; for (let i = 1; i <= n; i++) { s += "C"; subs.filter((x) => x[0] === i).forEach((x) => (s += x[1] === "etil" ? "(CC)" : "(C)")); const b = ins.find((x) => x[0] === i); if (b && i < n) s += b[1] === 3 ? "#" : "="; } return s; };
  SIM.org = { parse, conta, formula, massa, idh, classes, hib, sigmapi, cadeia, layout, svg, fig, analisa, nome, formata, monta };


  /* ---------- H01 · leitor de cadeias ---------- */
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  SIM.org.ui = { vis, botoes, liga };
  /* nome: "Leitor de cadeias: classifique cada carbono e a cadeia inteira" · matéria: Química · tema: H01 */
  SIM.qCadeia = (el, F) => {
    const MOL = [["butano", "CCCC"], ["metilpropano", "CC(C)C"], ["2,2,4-trimetilpentano", "CC(C)CC(C)(C)C"], ["propeno", "C=CC"], ["but-2-ino", "CC#CC"], ["buta-1,3-dieno", "C=CC=C"], ["cicloexano", "C1CCCCC1"], ["benzeno", "c1ccccc1"], ["metilbenzeno", "Cc1ccccc1"], ["etanol", "CCO"], ["etoxietano", "CCOCC"], ["ácido etanoico", "CC(=O)O"], ["dimetilamina", "CNC"], ["metilciclopentano", "CC1CCCC1"]];
    let k = 0, modo = "classe";
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="min-height:190px;display:flex;align-items:center;justify-content:center"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(MOL.map((m, i) => [i, m[0]]), "k", k)}</div></div><div><div class="bts">${botoes([["classe", "tipo de carbono"], ["hib", "hibridização"], ["nada", "só a estrutura"]], "m", modo)}</div><div class="bts" style="margin-top:8px">${botoes([["cond", "com os carbonos escritos"], ["bastao", "em bastão"]], "d", "cond")}</div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s); let des = "cond";
    const CL = ["metila (0)", "primário", "secundário", "terciário", "quaternário"], COR = ["#8b95a3", "#4a9fe8", "#3fae7a", "#e0a13a", "#e5604d"], CH = { sp3: "#4a9fe8", sp2: "#e0a13a", sp: "#e5604d" };
    const est = () => { const smi = MOL[k][1], c = SIM.org.cadeia(smi), cls = SIM.org.classes(smi), hb = SIM.org.hib(smi), sp = SIM.org.sigmapi(smi), cnt = [0, 1, 2, 3, 4].map((n) => cls.filter((x) => x === n).length); return { nome: MOL[k][0], smi, ...c, cls, hb, cnt, formula: SIM.org.formula(smi), idh: SIM.org.idh(smi), ...sp }; };
    const desenha = () => { const e = est(), g = SIM.org.parse(e.smi), d = SIM.org.svg(g, { modo: des, L: 46 });
      /* bolinhas coloridas atrás de cada carbono, pela classe ou pela hibridização */
      const P = SIM.org.layout(g, 46), xs = P.map((p) => p[0]), ys = P.map((p) => p[1]), minx = Math.min(...xs) - 26, miny = Math.min(...ys) - 26;
      const halos = modo === "nada" ? "" : g.at.map((a, i) => (a.el !== "C" ? "" : `<circle cx="${(P[i][0] - minx).toFixed(1)}" cy="${(P[i][1] - miny).toFixed(1)}" r="17" style="fill:${modo === "classe" ? COR[e.cls[i]] : CH[e.hb[i]]};opacity:.38"/>`)).join("");
      q("[data-v=sv]").innerHTML = `<svg viewBox="0 0 ${d.w.toFixed(0)} ${d.h.toFixed(0)}" width="${Math.min(640, d.w * 1.5).toFixed(0)}" role="img" aria-label="fórmula estrutural">${halos}${d.svg}</svg>`;
      const leg = modo === "classe" ? [1, 2, 3, 4].filter((n) => e.cnt[n]).map((n) => `<span style="color:${COR[n]}">●</span> ${CL[n]}: ${e.cnt[n]}`).join(" &nbsp; ")  : modo === "hib" ? ["sp3", "sp2", "sp"].filter((h) => e.hb.includes(h)).map((h) => `<span style="color:${CH[h]}">●</span> ${h.replace("3", "³").replace("2", "²")}: ${e.hb.filter((x) => x === h).length}`).join(" &nbsp; ") : "";
      q("[data-v=lt]").innerHTML = vis("fórmula molecular", e.formula) + vis("insaturações (IDH)", String(e.idh).replace(".", ",")) + vis("ligações σ", String(e.sigma)) + vis("ligações π", String(e.pi)) + vis("cadeia", [e.aberta ? "aberta" : e.aromatica ? "aromática" : "fechada", e.ramificada ? "ramificada" : "normal", e.saturada ? "saturada" : "insaturada", e.homogenea ? "homogênea" : "heterogênea"].join(", "));
      q("[data-v=st]").innerHTML = (leg ? leg + "<br>" : "") + (modo === "classe" ? "Carbono <b>primário</b> está ligado a um só carbono (ou a nenhum); <b>secundário</b>, a dois; <b>terciário</b>, a três; <b>quaternário</b>, a quatro. Conta-se só carbono vizinho: oxigênio, nitrogênio e hidrogênio não entram." : modo === "hib" ? "Só ligações simples: <b>sp³</b> (tetraédrico, 109,5°). Uma dupla, ou carbono de anel aromático: <b>sp²</b> (trigonal plano, 120°). Uma tripla ou duas duplas: <b>sp</b> (linear, 180°)." : "Cada traço é um par de elétrons compartilhado. Na fórmula em bastão, cada ponta e cada vértice é um carbono, com os hidrogênios subentendidos.") + (e.homogenea ? "" : " Esta cadeia é <b>heterogênea</b>: há um átomo diferente de carbono <b>entre</b> dois carbonos."); };
    liga(el, "k", (v) => { k = +v; desenha(); }); liga(el, "m", (v) => { modo = v; desenha(); }); liga(el, "d", (v) => { des = v; desenha(); });
    SIM.qCadeia._ult = { poe: (i, m) => { k = i; modo = m || modo; desenha(); }, est, MOL }; desenha(); };


  /* ---------- funções orgânicas ----------
     SIM.org.funcoes(smi) devolve a lista dos grupos funcionais achados, cada um {f: nome da função, at: índices dos átomos do grupo, cls: classe (álcool e amina: 1, 2, 3)}.
     Conferência: tools/quimica/confere-organica.py compara a contagem de cada função com padrões SMARTS do RDKit, para todo SMILES dos temas e da tabela COMP. */
  const funcoes = (smi) => { const g = typeof smi === "string" ? parse(smi) : smi, A = g.at, r = [], usado = new Set();
    const viz = (k) => A[k].viz.map(([v, b]) => [v, g.bd[b].o]), eC = (k) => A[k].el === "C", HAL = ["F", "Cl", "Br", "I"];
    const carbonila = (k) => eC(k) && viz(k).find(([v, o]) => A[v].el === "O" && o === 2);
    A.forEach((a, k) => { if (!eC(k)) return; const co = carbonila(k); if (!co) return; const O2 = co[0], outros = viz(k).filter(([v]) => v !== O2), oh = outros.find(([v, o]) => A[v].el === "O" && o === 1 && A[v].h > 0), om = outros.find(([v, o]) => A[v].el === "O" && o === 1 && A[v].carga < 0), or = outros.find(([v, o]) => A[v].el === "O" && o === 1 && A[v].h === 0 && !A[v].carga && viz(v).filter(([w]) => eC(w)).length === 2), n = outros.find(([v]) => A[v].el === "N"), x = outros.find(([v]) => HAL.includes(A[v].el));
      if (oh) { r.push({ f: "ácido carboxílico", at: [k, O2, oh[0]] }); usado.add(oh[0]); } else if (om) { r.push({ f: "carboxilato", at: [k, O2, om[0]] }); usado.add(om[0]); } else if (or) { /* anidrido: o O de ponte liga duas carbonilas */ const outroC = viz(or[0]).map(([w]) => w).find((w) => w !== k); if (carbonila(outroC)) { if (k < outroC) r.push({ f: "anidrido", at: [k, O2, or[0], outroC] }); } else r.push({ f: "éster", at: [k, O2, or[0]] }); usado.add(or[0]); }
      else if (n) { const ns = outros.filter(([v]) => A[v].el === "N").map(([v]) => v); r.push({ f: "amida", at: [k, O2, ...ns] }); ns.forEach((v) => usado.add(v)); } else if (x) { r.push({ f: "haleto de acila", at: [k, O2, x[0]] }); usado.add(x[0]); }
      else if (a.h >= 1) r.push({ f: "aldeído", at: [k, O2] }); else r.push({ f: "cetona", at: [k, O2] }); usado.add(O2); });
    A.forEach((a, k) => { if (usado.has(k)) return; const cs = viz(k).filter(([v]) => eC(v));
      if (a.el === "O" && !a.carga) { if (a.h > 0 && cs.length === 1) { const c = cs[0][0], cls = viz(c).filter(([v]) => eC(v)).length; if (A[c].arom) r.push({ f: "fenol", at: [k] }); else if (viz(c).some(([, o]) => o === 2)) r.push({ f: "enol", at: [k] }); else r.push({ f: "álcool", at: [k], cls: Math.max(1, cls) }); } else if (cs.length === 2 && viz(k).length === 2) r.push({ f: "éter", at: [k] }); }
      else if (a.el === "N") { if (viz(k).some(([v, o]) => o === 3)) r.push({ f: "nitrila", at: [k, viz(k)[0][0]] }); else if (viz(k).filter(([v]) => A[v].el === "O").length === 2) r.push({ f: "nitrocomposto", at: [k, ...viz(k).filter(([v]) => A[v].el === "O").map(([v]) => v)] }); else if (cs.length >= 1 && viz(k).every(([, o]) => o === 1)) r.push(a.carga > 0 ? { f: "amônio", at: [k] } : { f: "amina", at: [k], cls: cs.length }); }
      else if (HAL.includes(a.el) && cs.length === 1) r.push({ f: A[cs[0][0]].arom ? "haleto de arila" : "haleto de alquila", at: [k], cls: Math.max(1, viz(cs[0][0]).filter(([v]) => eC(v)).length) });
      else if (a.el === "S" && a.h > 0) r.push({ f: "tiol", at: [k] }); });
    return r; };
  SIM.org.funcoes = funcoes;
  /* compostos dos temas H03 a H06: [nome em português, nome IUPAC em inglês usado na consulta ao PubChem, SMILES].
     A correspondência nome em inglês ↔ estrutura é conferida no PubChem por tools/quimica/confere-pubchem.py (respostas guardadas em tools/quimica/pubchem-nomes.json).
     O nome em português é a tradução sistemática do inglês: -ol, -al, -one → -ona, -oic acid → ácido -oico, alkyl alkanoate → alcanoato de alquila, alkoxy → alcóxi. */
  SIM.org.COMP = [
    ["metanol", "methanol", "CO"], ["etanol", "ethanol", "CCO"], ["propan-1-ol", "propan-1-ol", "CCCO"], ["propan-2-ol", "propan-2-ol", "CC(C)O"], ["butan-1-ol", "butan-1-ol", "CCCCO"], ["butan-2-ol", "butan-2-ol", "CCC(C)O"], ["2-metilpropan-2-ol", "2-methylpropan-2-ol", "CC(C)(C)O"], ["2-metilpropan-1-ol", "2-methylpropan-1-ol", "CC(C)CO"], ["etano-1,2-diol", "ethane-1,2-diol", "OCCO"], ["propano-1,2,3-triol", "propane-1,2,3-triol", "OCC(O)CO"], ["cicloexanol", "cyclohexanol", "OC1CCCCC1"],
    ["fenol", "phenol", "Oc1ccccc1"],
    ["metoximetano", "methoxymethane", "COC"], ["metoxietano", "methoxyethane", "CCOC"], ["etoxietano", "ethoxyethane", "CCOCC"], ["metoxibenzeno", "methoxybenzene", "COc1ccccc1"],
    ["metanal", "methanal", "C=O"], ["etanal", "ethanal", "CC=O"], ["propanal", "propanal", "CCC=O"], ["butanal", "butanal", "CCCC=O"], ["2-metilpropanal", "2-methylpropanal", "CC(C)C=O"], ["benzaldeído", "benzaldehyde", "O=Cc1ccccc1"],
    ["propanona", "propan-2-one", "CC(C)=O"], ["butanona", "butan-2-one", "CCC(C)=O"], ["pentan-2-ona", "pentan-2-one", "CCCC(C)=O"], ["pentan-3-ona", "pentan-3-one", "CCC(=O)CC"], ["cicloexanona", "cyclohexanone", "O=C1CCCCC1"],
    ["ácido metanoico", "methanoic acid", "OC=O"], ["ácido etanoico", "ethanoic acid", "CC(=O)O"], ["ácido propanoico", "propanoic acid", "CCC(=O)O"], ["ácido butanoico", "butanoic acid", "CCCC(=O)O"], ["ácido benzoico", "benzoic acid", "OC(=O)c1ccccc1"], ["ácido etanodioico", "ethanedioic acid", "OC(=O)C(=O)O"], ["ácido 2-hidroxipropanoico", "2-hydroxypropanoic acid", "CC(O)C(=O)O"],
    ["metanoato de metila", "methyl methanoate", "COC=O"], ["etanoato de metila", "methyl ethanoate", "COC(C)=O"], ["etanoato de etila", "ethyl ethanoate", "CCOC(C)=O"], ["propanoato de metila", "methyl propanoate", "CCC(=O)OC"], ["butanoato de etila", "ethyl butanoate", "CCCC(=O)OCC"], ["etanoato de pentila", "pentyl ethanoate", "CCCCCOC(C)=O"], ["benzoato de metila", "methyl benzoate", "COC(=O)c1ccccc1"],
    ["metanamina", "methanamine", "CN"], ["etanamina", "ethanamine", "CCN"], ["propan-2-amina", "propan-2-amine", "CC(C)N"], ["N-metilmetanamina", "N-methylmethanamine", "CNC"], ["N,N-dimetilmetanamina", "N,N-dimethylmethanamine", "CN(C)C"], ["anilina", "aniline", "Nc1ccccc1"],
    ["metanamida", "methanamide", "NC=O"], ["etanamida", "ethanamide", "CC(N)=O"], ["propanamida", "propanamide", "CCC(N)=O"], ["N-metiletanamida", "N-methylacetamide", "CNC(C)=O"], ["ureia", "urea", "NC(N)=O"],
    ["etanonitrila", "ethanenitrile", "CC#N"], ["propanonitrila", "propanenitrile", "CCC#N"], ["nitrometano", "nitromethane", "C[N+](=O)[O-]"], ["nitrobenzeno", "nitrobenzene", "O=[N+]([O-])c1ccccc1"],
    ["clorometano", "chloromethane", "CCl"], ["diclorometano", "dichloromethane", "ClCCl"], ["triclorometano", "trichloromethane", "ClC(Cl)Cl"], ["tetraclorometano", "tetrachloromethane", "ClC(Cl)(Cl)Cl"], ["cloroetano", "chloroethane", "CCCl"], ["bromoetano", "bromoethane", "CCBr"], ["2-cloropropano", "2-chloropropane", "CC(C)Cl"], ["2-bromo-2-metilpropano", "2-bromo-2-methylpropane", "CC(C)(C)Br"], ["clorobenzeno", "chlorobenzene", "Clc1ccccc1"], ["cloreto de etanoíla", "ethanoyl chloride", "CC(Cl)=O"],
    ["ácido acetilsalicílico", "aspirin", "CC(=O)Oc1ccccc1C(=O)O"], ["paracetamol", "paracetamol", "CC(=O)Nc1ccc(O)cc1"], ["vanilina", "vanillin", "COc1cc(C=O)ccc1O"], ["ácido salicílico", "salicylic acid", "OC(=O)c1ccccc1O"], ["alanina", "alanine", "CC(N)C(=O)O"], ["glicina", "glycine", "NCC(=O)O"], ["anidrido etanoico", "ethanoic anhydride", "CC(=O)OC(C)=O"],
    ["1-metoxipropano", "1-methoxypropane", "CCCOC"], ["2-metoxipropano", "2-methoxypropane", "COC(C)C"], ["propan-1-amina", "propan-1-amine", "CCCN"], ["N-metiletanamina", "N-methylethanamine", "CCNC"], ["1-cloropropano", "1-chloropropane", "CCCCl"], ["1-clorobutano", "1-chlorobutane", "CCCCCl"], ["2-clorobutano", "2-chlorobutane", "CCC(C)Cl"], ["1-cloro-2-metilpropano", "1-chloro-2-methylpropane", "CC(C)CCl"], ["2-cloro-2-metilpropano", "2-chloro-2-methylpropane", "CC(C)(C)Cl"],
    ["prop-2-en-1-ol", "prop-2-en-1-ol", "C=CCO"], ["metoxieteno", "methoxyethene", "C=COC"], ["oxetano", "oxetane", "C1COC1"], ["2-metiloxirano", "2-methyloxirane", "CC1CO1"], ["ciclopropanol", "cyclopropanol", "OC1CC1"],
    ["ciclobutano", "cyclobutane", "C1CCC1"], ["metilciclopropano", "methylcyclopropane", "CC1CC1"], ["ciclopentano", "cyclopentane", "C1CCCC1"], ["metilciclobutano", "methylcyclobutane", "CC1CCC1"], ["etilciclopropano", "ethylcyclopropane", "CCC1CC1"], ["1,1-dimetilciclopropano", "1,1-dimethylcyclopropane", "CC1(C)CC1"], ["1,2-dimetilciclopropano", "1,2-dimethylcyclopropane", "CC1CC1C"], ["cicloexano", "cyclohexane", "C1CCCCC1"], ["benzeno", "benzene", "c1ccccc1"], ["metilbenzeno", "toluene", "Cc1ccccc1"],
    ["ácido cloroetanoico", "chloroacetic acid", "OC(=O)CCl"], ["ácido tricloroetanoico", "trichloroacetic acid", "OC(=O)C(Cl)(Cl)Cl"], ["ácido trifluoroetanoico", "trifluoroacetic acid", "OC(=O)C(F)(F)F"],
  ];
  SIM.org.smi = (nomePt) => { const c = SIM.org.COMP.find((x) => x[0] === nomePt); if (!c) throw new Error("composto fora da tabela: " + nomePt); return c[2]; };

  /* pontos de ebulição a 1 atm, em °C (tools/quimica/dadosH.json): alcanos lineares da Tabela 20.1 do OpenStax Chemistry 2e; os outros, das caixas de dados da Wikipedia */
  SIM.org.PE = { metano: -161.5, etano: -88.6, propano: -42.1, butano: -0.5, pentano: 36.1, hexano: 68.7, heptano: 98.4, octano: 125.7, decano: 174.0, metilpropano: -11.8, "2-metilbutano": 28, dimetilpropano: 9.5, "2,2,4-trimetilpentano": 99.3, cicloexano: 80.7, eteno: -103.7, propeno: -47.6, "but-1-eno": -6.5, "cis-but-2-eno": 3.7, "trans-but-2-eno": 0.8, benzeno: 80.1, metilbenzeno: 110.6, naftaleno: 218.0 };

  /* ---------- H02 · monte o nome ---------- */
  /* nome: "Nomenclatura: monte a cadeia e confira o nome" · matéria: Química · tema: H02 */
  SIM.qNomenclatura = (el, F) => {
    const sl = (rot, c, min, max, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="1" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
    let n = 5, tipo = 0, pi = 1, subs = [[2, "metil"]], ps = 2;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="min-height:190px;display:flex;align-items:center;justify-content:center"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${sl("Carbonos na cadeia", "n", 1, 8, n)}<div class="bts" style="margin:6px 0">${botoes([[0, "só simples"], [2, "uma dupla"], [3, "uma tripla"]], "t", tipo)}</div>${sl("Insaturação no carbono", "pi", 1, 7, pi)}</div>
        <div>${sl("Ramificação no carbono", "ps", 1, 8, ps)}<div class="bts" style="margin-top:6px"><button class="bt peq" data-a="metil">+ metil</button><button class="bt peq" data-a="etil">+ etil</button><button class="bt peq" data-a="tira">tirar a última</button><button class="bt peq" data-a="limpa">limpar</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const ins = tipo && n >= 2 ? [[Math.min(pi, n - 1), tipo]] : [], sb = subs.filter((x) => x[0] <= n), smi = SIM.org.monta(n, ins, sb), g = SIM.org.parse(smi), val = g.at.map((a) => a.viz.reduce((t, [, k]) => t + g.bd[k].o, 0)), imp = val.some((v) => v > 4);
      const seu = SIM.org.formata({ n, ins, subs: [...sb].sort((x, y) => x[0] - y[0]) }), an = imp ? null : SIM.org.analisa(g), iupac = an ? SIM.org.formata(an) : null;
      let motivo = ""; if (imp) motivo = "impossivel"; else if (iupac !== seu) motivo = an.n > n ? "cadeia" : an.n === n ? "numeracao" : "cadeia";
      return { n, ins, subs: sb, smi, seu, iupac, igual: iupac === seu, motivo, nPrinc: an ? an.n : null, formula: imp ? "—" : SIM.org.formula(smi), imp }; };
    const desenha = () => { const e = est(); q("[data-o=n]").textContent = n; q("[data-o=pi]").textContent = tipo ? Math.min(pi, Math.max(1, n - 1)) : "—"; q("[data-o=ps]").textContent = Math.min(ps, n);
      const g = SIM.org.parse(e.smi), nums = {}; let k = 0; for (let i = 1; i <= n; i++) { nums[k] = i; k += 1 + e.subs.filter((x) => x[0] === i).reduce((t, x) => t + (x[1] === "etil" ? 2 : 1), 0); }
      const d = SIM.org.svg(g, { L: 46, nums }); q("[data-v=sv]").innerHTML = `<svg viewBox="0 0 ${d.w.toFixed(0)} ${d.h.toFixed(0)}" width="${Math.min(640, d.w * 1.45).toFixed(0)}" role="img" aria-label="fórmula estrutural">${d.svg}</svg>`;
      q("[data-v=lt]").innerHTML = vis("o nome que você montou", e.seu) + vis("nome IUPAC desta molécula", e.imp ? "não existe" : e.iupac) + vis("fórmula molecular", e.formula) + vis("confere?", e.imp ? "impossível" : e.igual ? "sim ✓" : "não");
      q("[data-v=st]").innerHTML = e.motivo === "impossivel" ? "Algum carbono ficou com <b>mais de quatro ligações</b>: essa molécula não existe. Carbono de tripla não aceita ramificação; carbono de dupla aceita uma só." : e.igual ? "O nome que você montou é o nome oficial. A cadeia escolhida é a mais longa (e contém a insaturação), e a numeração dá os menores números possíveis." : e.motivo === "cadeia" ? `A molécula existe, mas o nome está errado: a <b>cadeia principal</b> não é a de ${n} carbonos que você numerou. Contando pelo caminho mais longo (que contenha a insaturação), ela tem <b>${e.nPrinc}</b> carbonos. Uma ramificação na ponta, ou um etil no carbono 2, só estica a cadeia.` : "A cadeia está certa, mas a <b>numeração</b> não: começando pela outra ponta, a insaturação (ou, sem ela, as ramificações) recebe números menores. O nome oficial usa sempre os menores números."; };
    liga(el, "t", (v) => { tipo = +v; desenha(); }); [["n", (v) => (n = v)], ["pi", (v) => (pi = v)], ["ps", (v) => (ps = v)]].forEach(([c, fn]) => q(`[data-c=${c}]`).addEventListener("input", (e) => { fn(+e.target.value); desenha(); }));
    el.addEventListener("click", (e) => { const b = e.target.closest("[data-a]"); if (!b) return; const a = b.dataset.a; if (a === "limpa") subs = []; else if (a === "tira") subs.pop(); else if (subs.length < 5) subs.push([Math.min(ps, n), a]); desenha(); });
    SIM.qNomenclatura._ult = { poe: (nn, t, p, sb) => { n = nn; tipo = t; pi = p; subs = sb.map((x) => [...x]); q("[data-c=n]").value = nn; q("[data-c=pi]").value = p; el.querySelectorAll("[data-t]").forEach((x) => x.setAttribute("aria-pressed", +x.dataset.t === tipo)); desenha(); }, est }; desenha(); };

  /* ---------- H03 (e H04) · caça às funções ---------- */
  const CORF = { "álcool": "#4a9fe8", "fenol": "#7a6ff0", "enol": "#4a9fe8", "éter": "#3fae7a", "aldeído": "#e0a13a", "cetona": "#e5604d", "ácido carboxílico": "#d94f9b", "éster": "#b07cf0", "anidrido": "#b07cf0", "amina": "#3fb8c9", "amida": "#c9a23f", "nitrila": "#8fb84a", "nitrocomposto": "#e07a3a", "haleto de alquila": "#55b88a", "haleto de arila": "#55b88a", "haleto de acila": "#c97a55", "carboxilato": "#d94f9b", "tiol": "#c9c23f", "amônio": "#3fb8c9" };
  SIM.org.CORF = CORF;
  /* nome: "Caça às funções: ache os grupos funcionais da molécula" · matéria: Química · tema: H03 */
  SIM.qFuncoes = (el, F, o = {}) => {
    const MOL = o.mol || ["etanol", "fenol", "etoxietano", "propanal", "propanona", "ácido etanoico", "etanoato de etila", "ácido 2-hidroxipropanoico", "ácido acetilsalicílico", "vanilina", "ácido salicílico", "propano-1,2,3-triol"], OPC = o.opc || ["álcool", "fenol", "éter", "aldeído", "cetona", "ácido carboxílico", "éster"];
    let k = 0, marc = new Set(), visto = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="min-height:200px;display:flex;align-items:center;justify-content:center"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 6px;font-size:13.5px;color:var(--ink2)">Molécula (o nome aparece depois de conferir):</p><div class="bts">${botoes(MOL.map((m, i) => [i, String(i + 1)]), "k", k)}</div></div><div><p style="margin:0 0 6px;font-size:13.5px;color:var(--ink2)">Marque as funções que você vê e confira:</p><div class="bts">${OPC.map((f) => `<button class="bt peq" data-f="${f}" aria-pressed="false">${f}</button>`).join("")}</div><div class="bts" style="margin-top:8px"><button class="bt" data-a="confere">conferir</button><button class="bt peq" data-a="mostra">mostrar os grupos</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const smi = SIM.org.smi(MOL[k]), fs = SIM.org.funcoes(smi), tem = [...new Set(fs.map((x) => x.f))], certo = tem.length === marc.size && tem.every((f) => marc.has(f)); return { nome: MOL[k], smi, fs, tem, marc: [...marc], certo, formula: SIM.org.formula(smi) }; };
    const desenha = (msg) => { const e = est(), g = SIM.org.parse(e.smi), P = SIM.org.layout(g, 44), xs = P.map((p) => p[0]), ys = P.map((p) => p[1]), minx = Math.min(...xs) - 26, miny = Math.min(...ys) - 26, d = SIM.org.svg(g, { L: 44 });
      const halos = visto ? e.fs.map((x) => x.at.map((a) => `<circle cx="${(P[a][0] - minx).toFixed(1)}" cy="${(P[a][1] - miny).toFixed(1)}" r="16" style="fill:${CORF[x.f]};opacity:.4"/>`).join("")).join("") : "";
      q("[data-v=sv]").innerHTML = `<svg viewBox="0 0 ${d.w.toFixed(0)} ${d.h.toFixed(0)}" width="${Math.min(640, d.w * 1.4).toFixed(0)}" role="img" aria-label="fórmula estrutural">${halos}${d.svg}</svg>`;
      q("[data-v=lt]").innerHTML = vis("molécula", visto ? e.nome : "?") + vis("fórmula molecular", e.formula) + vis("grupos funcionais", visto ? String(e.fs.length) : "?");
      q("[data-v=st]").innerHTML = msg || (visto ? e.tem.map((f) => `<span style="color:${CORF[f]}">●</span> ${f}${e.fs.filter((x) => x.f === f).length > 1 ? " (" + e.fs.filter((x) => x.f === f).length + ")" : ""}`).join(" &nbsp; ") : "Olhe para cada oxigênio (ou nitrogênio) e para o carbono em que ele está preso: é isso que define a função. Marque e confira; ou peça para mostrar."); };
    liga(el, "k", (v) => { k = +v; marc = new Set(); visto = false; el.querySelectorAll("[data-f]").forEach((b) => b.setAttribute("aria-pressed", "false")); desenha(); });
    el.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { const f = b.dataset.f; marc.has(f) ? marc.delete(f) : marc.add(f); b.setAttribute("aria-pressed", marc.has(f)); }));
    el.addEventListener("click", (ev) => { const b = ev.target.closest("[data-a]"); if (!b) return; visto = true; const e = est(); if (b.dataset.a === "mostra") return desenha(); const falt = e.tem.filter((f) => !marc.has(f)), sobra = [...marc].filter((f) => !e.tem.includes(f)); desenha(e.certo ? `<b>Certo.</b> ${e.nome}: ${e.tem.join(", ")}.` : `Ainda não. ${falt.length ? "Faltou: <b>" + falt.join(", ") + "</b>. " : ""}${sobra.length ? "Não tem: <b>" + sobra.join(", ") + "</b>. " : ""}Veja os grupos destacados: ${e.tem.map((f) => `<span style="color:${CORF[f]}">●</span> ${f}`).join(" &nbsp; ")}.`); });
    SIM.qFuncoes._ult = { poe: (i, ms) => { k = i; marc = new Set(ms || []); visto = false; desenha(); }, est, MOL, confere: () => q("[data-a=confere]").click() }; desenha(); };

  /* ---------- H04 · caça às funções com nitrogênio e halogênio ---------- */
  /* nome: "Caça às funções: nitrogênio e halogênios" · matéria: Química · tema: H04 */
  SIM.qFuncoesN = (el, F) => { SIM.qFuncoes(el, F, { mol: ["etanamina", "N-metilmetanamina", "N,N-dimetilmetanamina", "anilina", "etanamida", "N-metiletanamida", "etanonitrila", "nitrobenzeno", "2-cloropropano", "clorobenzeno", "cloreto de etanoíla", "alanina", "paracetamol", "ureia"], opc: ["amina", "amida", "nitrila", "nitrocomposto", "haleto de alquila", "haleto de arila", "haleto de acila", "ácido carboxílico", "fenol"] }); SIM.qFuncoesN._ult = SIM.qFuncoes._ult; };

  /* ---------- H05 · forças entre moléculas e propriedades físicas ---------- */
  SIM.org.HC = { metano: "C", etano: "CC", propano: "CCC", butano: "CCCC", metilpropano: "CC(C)C", pentano: "CCCCC", "2-metilbutano": "CCC(C)C", dimetilpropano: "CC(C)(C)C", hexano: "CCCCCC", heptano: "CCCCCCC", octano: "CCCCCCCC", decano: "CCCCCCCCCC", cicloexano: "C1CCCCC1", benzeno: "c1ccccc1", metilbenzeno: "Cc1ccccc1" };
  SIM.org.smiDe = (n) => SIM.org.HC[n] || SIM.org.smi(n);
  const ZAT = { H: 1, C: 6, N: 7, O: 8, F: 9, S: 16, Cl: 17, Br: 35, I: 53 };
  /* forças entre moléculas iguais, deduzidas da estrutura: London sempre; dipolo permanente se há heteroátomo (menos nos casos simétricos, de momento dipolar zero);
     ligação de hidrogênio se há H preso em O ou N. ne = número de elétrons (tamanho da nuvem). */
  SIM.org.forcas = (smi) => { const g = parse(smi), c = conta(g), ne = Object.keys(c).reduce((t, k) => t + c[k] * (ZAT[k] || 0), 0), het = g.at.some((a) => a.el !== "C"), don = g.at.filter((a) => (a.el === "O" || a.el === "N") && a.h > 0).reduce((t, a) => t + a.h, 0), acc = g.at.filter((a) => a.el === "O" || a.el === "N").length, sim = smi === "ClC(Cl)(Cl)Cl"; return { ne, london: true, dipolo: het && !sim, lh: don > 0, don, acc }; };
  /* nome: "Forças entre moléculas: compare duas substâncias" · matéria: Química · tema: H05 */
  SIM.qPropFisicas = (el, F) => {
    const FAM = { "hidrocarbonetos": ["metano", "propano", "butano", "metilpropano", "pentano", "2-metilbutano", "dimetilpropano", "hexano", "octano", "cicloexano", "benzeno"], "álcoois e fenol": ["metanol", "etanol", "propan-1-ol", "propan-2-ol", "butan-1-ol", "2-metilpropan-2-ol", "etano-1,2-diol", "propano-1,2,3-triol", "fenol"], "éteres, aldeídos e cetonas": ["metoximetano", "etoxietano", "metanal", "etanal", "propanal", "propanona", "butanona"], "ácidos e ésteres": ["ácido metanoico", "ácido etanoico", "ácido propanoico", "ácido butanoico", "etanoato de metila", "etanoato de etila"], "aminas e amida": ["metanamina", "etanamina", "N-metilmetanamina", "N,N-dimetilmetanamina", "anilina", "etanamida"], "haletos": ["clorometano", "diclorometano", "triclorometano", "tetraclorometano", "cloroetano", "bromoetano"] };
    let A = "etanol", B = "metoximetano", slot = "A", fam = "álcoois e fenol";
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="min-height:210px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes([["A", "escolher a substância A"], ["B", "escolher a substância B"]], "s", slot)}</div><div class="bts" style="margin-top:8px">${botoes(Object.keys(FAM).map((f) => [f, f]), "f", fam)}</div></div><div><div class="bts" data-v="cs"></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), PR = SIM.org.PROP;
    const info = (n) => { const smi = SIM.org.smiDe(n); return { n, smi, M: SIM.org.massa(smi), ...SIM.org.forcas(smi), eb: PR[n].eb, sol: PR[n].sol, formula: SIM.org.formula(smi) }; };
    const est = () => { const a = info(A), b = info(B), maior = a.eb > b.eb ? a : b, menor = maior === a ? b : a; let motivo; if (maior.lh && !menor.lh) motivo = "lh"; else if (maior.lh && menor.lh && maior.don !== menor.don && Math.abs(maior.ne - menor.ne) < 12) motivo = "maislh"; else if (maior.dipolo && !menor.dipolo && Math.abs(maior.ne - menor.ne) < 10) motivo = "dipolo"; else if (maior.ne > menor.ne * 1.12) motivo = "london"; else if (maior.formula === menor.formula) motivo = "formato"; else motivo = "misto"; return { a, b, maior: maior.n, menor: menor.n, motivo, dif: maior.eb - menor.eb }; };
    const solT = (s) => (s === null ? "sem dado" : typeof s === "string" ? s : (s >= 100 ? s.toFixed(0) : s >= 1 ? s.toFixed(1) : String(+s.toPrecision(2))).replace(".", ",") + " g/L");
    const lista = () => { q("[data-v=cs]").innerHTML = FAM[fam].map((n) => `<button class="bt peq" data-n="${n}" aria-pressed="${n === (slot === "A" ? A : B)}">${n}</button>`).join(""); };
    const desenha = () => { const e = est(), dA = SIM.org.fig([{ smi: e.a.smi, leg: "A: " + e.a.n }, { smi: e.b.smi, leg: "B: " + e.b.n }], { W: 430 });
      /* termômetro horizontal de −170 a 300 °C */
      const X = (t) => 40 + ((Math.max(-170, Math.min(300, t)) + 170) / 470) * 600, marca = (o, cor, y) => `<line x1="${X(o.eb).toFixed(1)}" y1="26" x2="${X(o.eb).toFixed(1)}" y2="50" style="stroke:${cor};stroke-width:3"/><text x="${X(o.eb).toFixed(1)}" y="${y}" text-anchor="middle" class="tx2" style="fill:${cor};font-weight:700">${(o === e.a ? "A" : "B")}: ${String(o.eb).replace(".", ",").replace("-", "−")} °C</text>`;
      const term = `<svg viewBox="0 0 680 84" width="680" role="img" aria-label="pontos de ebulição"><line x1="40" y1="38" x2="640" y2="38" style="stroke:var(--ink2);stroke-width:2"/>${[-150, -100, -50, 0, 50, 100, 150, 200, 250, 300].map((t) => `<line x1="${X(t)}" y1="34" x2="${X(t)}" y2="42" style="stroke:var(--ink2)"/><text x="${X(t)}" y="62" text-anchor="middle" class="tx2">${String(t).replace("-", "−")}</text>`).join("")}<line x1="${X(25)}" y1="20" x2="${X(25)}" y2="46" style="stroke:var(--ink3);stroke-dasharray:3 3"/><text x="${X(25)}" y="78" text-anchor="middle" class="tx2">25 °C</text>${marca(e.a, "var(--mod)", 16)}${marca(e.b, "var(--warn)", Math.abs(X(e.a.eb) - X(e.b.eb)) < 90 ? 84 : 16)}</svg>`;
      q("[data-v=sv]").innerHTML = `<div style="display:flex;justify-content:center">${dA}</div><div style="display:flex;justify-content:center">${term}</div>`;
      const fr = (o) => ["London", o.dipolo ? "dipolo" : null, o.lh ? "ligação de H" : null].filter(Boolean).join(" + ");
      q("[data-v=lt]").innerHTML = vis("A: massa · elétrons", `${String(e.a.M).replace(".", ",")} g/mol · ${e.a.ne}`) + vis("A: forças", fr(e.a)) + vis("A: em água", solT(e.a.sol)) + vis("B: massa · elétrons", `${String(e.b.M).replace(".", ",")} g/mol · ${e.b.ne}`) + vis("B: forças", fr(e.b)) + vis("B: em água", solT(e.b.sol));
      const T = { lh: `O ${e.maior} tem H preso em O ou N e faz <b>ligações de hidrogênio</b> entre as suas moléculas; o ${e.menor} não. É a força mais intensa das três, e por isso a diferença é de ${Math.round(e.dif)} °C.`, maislh: `Os dois fazem ligações de hidrogênio, mas o ${e.maior} tem <b>mais</b> grupos O–H ou N–H por molécula: mais pontos de amarração.`, dipolo: `Tamanhos parecidos; o ${e.maior} tem <b>dipolo permanente</b> e o ${e.menor} é apolar.`, london: `O ${e.maior} tem a nuvem eletrônica <b>maior</b> (mais elétrons, mais área de contato): forças de London mais fortes. Entre moléculas de tamanhos bem diferentes, o tamanho costuma ganhar.`, formato: `Mesma fórmula, mesmas forças: decide o <b>formato</b>. A molécula menos ramificada encosta melhor nas vizinhas.`, misto: `Aqui as tendências competem (tamanho, polaridade, ligações de hidrogênio), e só a medida decide: o ${e.maior} ferve ${Math.round(e.dif)} °C acima.` };
      q("[data-v=st]").innerHTML = T[e.motivo] + " Pontos de ebulição e solubilidades são de tabela (caixas de dados da Wikipedia); as forças são deduzidas da estrutura."; };
    liga(el, "s", (v) => { slot = v; lista(); }); liga(el, "f", (v) => { fam = v; lista(); });
    el.addEventListener("click", (ev) => { const b = ev.target.closest("[data-n]"); if (!b) return; if (slot === "A") A = b.dataset.n; else B = b.dataset.n; lista(); desenha(); });
    SIM.qPropFisicas._ult = { poe: (a, b) => { A = a; B = b; lista(); desenha(); }, est }; lista(); desenha(); };

  /* ---------- H06 · escada de acidez ---------- */
  /* estrutura do ácido de cada linha da tabela SIM.org.PKA (os "íons ...amônio" são os ácidos conjugados das aminas) */
  SIM.org.ACID = { etano: "CC", eteno: "C=C", etino: "C#C", "2-metilpropan-2-ol": "CC(C)(C)O", etanol: "CCO", metanol: "CO", propanona: "CC(C)=O", fenol: "Oc1ccccc1", "ácido etanoico": "CC(=O)O", "ácido metanoico": "OC=O", "ácido propanoico": "CCC(=O)O", "ácido butanoico": "CCCC(=O)O", "ácido benzoico": "OC(=O)c1ccccc1", "ácido cloroetanoico": "OC(=O)CCl", "ácido tricloroetanoico": "OC(=O)C(Cl)(Cl)Cl", "ácido trifluoroetanoico": "OC(=O)C(F)(F)F", "ácido 2-hidroxipropanoico": "CC(O)C(=O)O", "íon amônio": "[NH4+]", "íon metilamônio": "C[NH3+]", "íon etilamônio": "CC[NH3+]", "íon anilínio": "[NH3+]c1ccccc1", "íon dimetilamônio": "C[NH2+]C", "íon trimetilamônio": "C[NH+](C)C" };
  /* fração na forma desprotonada (base conjugada) num dado pH: 1 / (1 + 10^(pKa − pH)) */
  SIM.org.fracBase = (pKa, pH) => 1 / (1 + Math.pow(10, pKa - pH));
  /* nome: "Escada de acidez: compare pKa e veja a forma em cada pH" · matéria: Química · tema: H06 */
  SIM.qAcidez = (el, F) => {
    const L = ["ácido trifluoroetanoico", "ácido tricloroetanoico", "ácido cloroetanoico", "ácido metanoico", "ácido benzoico", "ácido etanoico", "íon anilínio", "íon amônio", "fenol", "íon metilamônio", "metanol", "etanol", "2-metilpropan-2-ol", "etino", "eteno", "etano"], PK = SIM.org.PKA; let A = "ácido etanoico", B = "etanol", slot = "A", pH = 7;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 700 250" width="700" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes([["A", "escolher o ácido A"], ["B", "escolher o ácido B"]], "s", slot)}</div><div class="bts" style="margin-top:8px" data-v="cs"></div></div><div><div class="ctrl"><label>pH do meio</label><input type="range" min="0" max="14" step="0.5" value="7" data-c="ph"><output data-o="ph"></output></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), nfp = (v, d = 2) => (+v).toFixed(d).replace(".", ",").replace("-", "−");
    const est = () => { const pa = PK[A], pb = PK[B], fa = SIM.org.fracBase(pa, pH), fb = SIM.org.fracBase(pb, pH); return { A, B, pH, pa, pb, fa, fb, forte: pa < pb ? A : B, fator: Math.abs(pa - pb) }; };
    const lista = () => { q("[data-v=cs]").innerHTML = L.map((n) => `<button class="bt peq" data-n="${n}" aria-pressed="${n === (slot === "A" ? A : B)}">${n}</button>`).join(""); };
    const desenha = () => { const e = est(), X = (p) => 40 + (Math.max(-1, Math.min(51, p)) + 1) / 52 * 620; q("[data-o=ph]").textContent = nfp(pH, 1);
      let h = `<line x1="40" y1="120" x2="660" y2="120" style="stroke:var(--ink2);stroke-width:2"/>` + [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((p) => `<line x1="${X(p)}" y1="116" x2="${X(p)}" y2="124" style="stroke:var(--ink2)"/><text x="${X(p)}" y="142" text-anchor="middle" class="tx2">${p}</text>`).join("") + D.txt(40, 162, "← ácidos mais fortes", "tx2", "start") + D.txt(660, 162, "ácidos mais fracos →", "tx2", "end") + D.txt(350, 162, "pKa", "tx2");
      L.forEach((n) => { if (n !== A && n !== B) h += `<circle cx="${X(PK[n]).toFixed(1)}" cy="120" r="4" style="fill:var(--ink3)"/>`; });
      const marca = (n, cor, y, r) => `<circle cx="${X(PK[n]).toFixed(1)}" cy="120" r="7" style="fill:${cor};stroke:var(--bg);stroke-width:2"/><line x1="${X(PK[n]).toFixed(1)}" y1="112" x2="${X(PK[n]).toFixed(1)}" y2="${y + 6}" style="stroke:${cor}"/><text x="${Math.max(120, Math.min(580, X(PK[n]))).toFixed(1)}" y="${y}" text-anchor="middle" class="tx2" style="fill:${cor};font-weight:700">${r}: ${n} (pKa ${nfp(PK[n], PK[n] > 20 ? 0 : 2)})</text>`;
      h += marca(A, "var(--mod)", 70, "A") + marca(B, "var(--warn)", 40, "B");
      h += `<line x1="${X(pH)}" y1="96" x2="${X(pH)}" y2="186" style="stroke:var(--ok);stroke-width:2;stroke-dasharray:4 3"/><text x="${X(pH)}" y="200" text-anchor="middle" class="tx2" style="fill:var(--ok);font-weight:700">pH do meio: ${nfp(pH, 1)}</text>` + D.txt(350, 232, "à esquerda da linha verde: o ácido já perdeu o H⁺ (pKa < pH); à direita: ainda está com ele", "tx2");
      q("[data-v=sv]").innerHTML = h;
      const pc = (f) => (f > 0.999 ? "> 99,9%" : f < 0.001 ? "< 0,1%" : nfp(100 * f, 1) + "%");
      q("[data-v=lt]").innerHTML = vis("pKa de A", nfp(e.pa, e.pa > 20 ? 0 : 2)) + vis("pKa de B", nfp(e.pb, e.pb > 20 ? 0 : 2)) + vis("mais ácido", e.pa === e.pb ? "iguais" : e.forte) + vis("razão entre os Ka", "10^" + nfp(e.fator, 1)) + vis("A sem o H⁺ neste pH", pc(e.fa)) + vis("B sem o H⁺ neste pH", pc(e.fb));
      q("[data-v=st]").innerHTML = `Quanto <b>menor</b> o pKa, mais forte o ácido; cada unidade vale um fator 10 no Ka. ${e.pa === e.pb ? "" : `O ${e.forte} é 10^${nfp(e.fator, 1)} vezes mais ácido que o outro.`} Num meio de pH ${nfp(pH, 1)}, um ácido está metade ionizado quando pH = pKa; uma unidade de pH acima, 91%; uma abaixo, 9%. Os "íons ...amônio" são os ácidos conjugados das aminas: quanto <b>maior</b> o pKa deles, mais forte a amina como base. Valores de tabela (OpenStax Organic Chemistry e Wikipedia), em água a 25 °C.`; };
    liga(el, "s", (v) => { slot = v; lista(); }); q("[data-c=ph]").addEventListener("input", (ev) => { pH = +ev.target.value; desenha(); });
    el.addEventListener("click", (ev) => { const b = ev.target.closest("[data-n]"); if (!b) return; if (slot === "A") A = b.dataset.n; else B = b.dataset.n; lista(); desenha(); });
    SIM.qAcidez._ult = { poe: (a, b, p) => { A = a; B = b; pH = p; q("[data-c=ph]").value = p; lista(); desenha(); }, est }; lista(); desenha(); };

  /* ---------- H07 · isomeria constitucional ---------- */
  /* tipo de isomeria plana entre dois isômeros da tabela SIM.org.ISO (cada um [SMILES, esqueleto de carbonos, nome]):
     funções diferentes → função; mesma função, com heteroátomo entre carbonos e pedaços de carbono diferentes → compensação (metameria);
     mesma função e esqueletos de carbono diferentes → cadeia; mesmo esqueleto → posição. */
  SIM.org.tipoIso = (a, b) => { const fa = [...new Set(funcoes(a[0]).map((x) => x.f))].sort().join("+"), fb2 = [...new Set(funcoes(b[0]).map((x) => x.f))].sort().join("+"); if (a[0] === b[0]) return "mesma";
    if (fa !== fb2) return "função"; const ca = cadeia(a[0]), cb = cadeia(b[0]); if (a[1] !== b[1]) return !ca.homogenea && !cb.homogenea && ca.ciclos === cb.ciclos ? "compensação" : "cadeia"; return "posição"; };
  /* nome: "Isômeros: todas as estruturas de uma fórmula" · matéria: Química · tema: H07 */
  SIM.qIsomeros = (el, F) => {
    const FS = ["C4H10", "C5H12", "C6H14", "C4H8", "C5H10", "C2H6O", "C3H8O", "C4H10O", "C3H6O", "C3H7Cl", "C4H9Cl", "C3H9N"], subf = (f) => f.replace(/(\d+)/g, (x) => x.split("").map((c) => "₀₁₂₃₄₅₆₇₈₉"[+c]).join(""));
    let f = "C4H10O", sel = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="sv" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px"></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(FS.map((x) => [x, subf(x)]), "f", f)}</div></div><div><p style="margin:0;font-size:13.5px;color:var(--ink2)">Clique em duas estruturas para saber que tipo de isomeria existe entre elas.</p></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const L = SIM.org.ISO[f], a = sel.length === 2 ? L[sel[0]] : null, b = sel.length === 2 ? L[sel[1]] : null; return { f, n: L.length, sel: [...sel], tipo: a ? SIM.org.tipoIso(a, b) : null, nomes: a ? [a[2], b[2]] : [], idh: SIM.org.idh(L[0][0]) }; };
    const TX = { "função": "Os átomos estão ligados de modo a formar <b>grupos funcionais diferentes</b>: isomeria de <b>função</b>. São substâncias de famílias diferentes, com propriedades bem distintas.", cadeia: "A função é a mesma, mas o <b>esqueleto de carbonos</b> muda (reta × ramificada, ou aberta × fechada): isomeria de <b>cadeia</b>.", "posição": "Mesma função e mesmo esqueleto; muda o <b>lugar</b> do grupo funcional, da insaturação ou da ramificação: isomeria de <b>posição</b>.", "compensação": "Mesma função, com um heteroátomo no meio da cadeia; muda o <b>tamanho dos pedaços</b> de cada lado dele: isomeria de <b>compensação</b> (metameria)." };
    const desenha = () => { const L = SIM.org.ISO[f], e = est();
      q("[data-v=sv]").innerHTML = L.map((it, i) => { const d = SIM.org.svg(it[0], { L: 34 }), on = sel.includes(i); return `<button type="button" data-i="${i}" aria-pressed="${on}" style="background:${on ? "color-mix(in srgb,var(--mod) 22%,transparent)" : "transparent"};border:1.5px solid ${on ? "var(--mod)" : "var(--line,#2a3140)"};border-radius:10px;padding:6px 4px;cursor:pointer;color:inherit;font:inherit"><svg viewBox="0 0 ${d.w.toFixed(0)} ${d.h.toFixed(0)}" style="max-width:100%;height:84px" role="img" aria-label="${it[2] || "isômero"}">${d.svg}</svg><div style="font-size:12.5px;color:var(--ink2);margin-top:2px">${it[2] || ""}</div></button>`; }).join("");
      q("[data-v=lt]").innerHTML = vis("fórmula molecular", subf(f)) + vis("isômeros constitucionais", String(e.n)) + vis("insaturações (IDH)", String(e.idh)) + vis("isomeria entre os dois", e.tipo ? (e.tipo === "mesma" ? "é a mesma" : "de " + e.tipo) : "escolha dois");
      q("[data-v=st]").innerHTML = e.tipo && e.tipo !== "mesma" ? `<b>${e.nomes[0]}</b> e <b>${e.nomes[1]}</b>: ${TX[e.tipo]}` : `São <b>todas</b> as estruturas possíveis com essa fórmula (geradas por computador e conferidas; ficam de fora só as instáveis, como enóis e peróxidos). Isômeros de posição cis e trans contam como um só aqui: isso é assunto da estereoisomeria.`; };
    liga(el, "f", (v) => { f = v; sel = []; desenha(); });
    el.addEventListener("click", (ev) => { const b = ev.target.closest("[data-i]"); if (!b) return; const i = +b.dataset.i; if (sel.includes(i)) sel = sel.filter((x) => x !== i); else { sel.push(i); if (sel.length > 2) sel.shift(); } desenha(); });
    SIM.qIsomeros._ult = { poe: (ff, a, b) => { f = ff; const L = SIM.org.ISO[f]; sel = a ? [L.findIndex((x) => x[2] === a), L.findIndex((x) => x[2] === b)] : []; el.querySelectorAll("[data-f]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.f === f)); desenha(); }, est }; desenha(); };

  /*PROP-INI*/ /* GERADO por tools/quimica/gera-prop-organica.py a partir de dadosH.json: não editar à mão. eb em °C (1 atm); sol em g/L de água, ou "miscível", ou "imiscível" (palavra da fonte), ou null (sem dado conversível) */
  SIM.org.PROP = {
    "metano": { eb: -161.49, sol: 0.0227 },
    "etano": { eb: -88.5, sol: 0.0568 },
    "propano": { eb: -42.1, sol: 0.047 },
    "butano": { eb: 0.0, sol: 0.061 },
    "metilpropano": { eb: -11.78, sol: 0.0489 },
    "pentano": { eb: 36.1, sol: 0.04 },
    "2-metilbutano": { eb: 28.0, sol: null },
    "dimetilpropano": { eb: 9.5, sol: 0.0332 },
    "hexano": { eb: 68.8, sol: 0.0095 },
    "heptano": { eb: 98.38, sol: "imiscível" },
    "octano": { eb: 125.6, sol: null },
    "decano": { eb: 174.1, sol: null },
    "cicloexano": { eb: 80.74, sol: "imiscível" },
    "benzeno": { eb: 80.1, sol: 1.53 },
    "metilbenzeno": { eb: 110.6, sol: 0.54 },
    "metanol": { eb: 64.7, sol: "miscível" },
    "etanol": { eb: 78.23, sol: "miscível" },
    "propan-1-ol": { eb: 97.5, sol: "miscível" },
    "propan-2-ol": { eb: 82.6, sol: "miscível" },
    "butan-1-ol": { eb: 117.7, sol: 73 },
    "butan-2-ol": { eb: 99.0, sol: 390 },
    "2-metilpropan-2-ol": { eb: 82.5, sol: "miscível" },
    "etano-1,2-diol": { eb: 197.3, sol: "miscível" },
    "propano-1,2,3-triol": { eb: 290, sol: "miscível" },
    "fenol": { eb: 181.7, sol: 83.0 },
    "metoximetano": { eb: -24, sol: 71 },
    "etoxietano": { eb: 34.6, sol: 60.5 },
    "metanal": { eb: -19, sol: 400 },
    "etanal": { eb: 20.2, sol: "miscível" },
    "propanal": { eb: 48.0, sol: 200 },
    "propanona": { eb: 56.08, sol: "miscível" },
    "butanona": { eb: 79.64, sol: 275.0 },
    "ácido metanoico": { eb: 100.8, sol: "miscível" },
    "ácido etanoico": { eb: 118.5, sol: "miscível" },
    "ácido propanoico": { eb: 141.15, sol: "miscível" },
    "ácido butanoico": { eb: 163.75, sol: "miscível" },
    "ácido benzoico": { eb: 250, sol: 1.7 },
    "etanoato de metila": { eb: 56.9, sol: null },
    "etanoato de etila": { eb: 77.1, sol: 83.0 },
    "metanamina": { eb: -6.3, sol: 1008 },
    "N-metilmetanamina": { eb: 8.0, sol: 1540.0 },
    "N,N-dimetilmetanamina": { eb: 5.0, sol: "miscível" },
    "etanamina": { eb: 18.0, sol: "miscível" },
    "anilina": { eb: 184.13, sol: 36.0 },
    "etanamida": { eb: 221.2, sol: 2000 },
    "clorometano": { eb: -23.8, sol: 5.325 },
    "diclorometano": { eb: 39.6, sol: 25.6 },
    "triclorometano": { eb: 61.15, sol: 10.62 },
    "tetraclorometano": { eb: 76.72, sol: 0.97 },
    "cloroetano": { eb: 12.27, sol: 4.47 },
    "bromoetano": { eb: 38.4, sol: 10.67 },
  };
  /* pKa em água, 25 °C. Ácidos e álcoois: OpenStax Organic Chemistry (Tabelas 20.3, 17.1 e B1) ou caixa de dados da Wikipedia; "íon ...amônio": pKa do ácido conjugado da amina (OpenStax), ou 14 − pKb (Wikipedia) */
  SIM.org.PKA = {
    "etano": 50,
    "eteno": 44,
    "etino": 25,
    "2-metilpropan-2-ol": 18.0,
    "etanol": 16.0,
    "metanol": 15.5,
    "propanona": 19.3,
    "fenol": 9.89,
    "ácido etanoico": 4.76,
    "ácido metanoico": 3.75,
    "ácido propanoico": 4.87,
    "ácido butanoico": 4.82,
    "ácido benzoico": 4.19,
    "ácido cloroetanoico": 2.86,
    "ácido tricloroetanoico": 0.66,
    "ácido trifluoroetanoico": 0.23,
    "ácido 2-hidroxipropanoico": 3.86,
    "íon amônio": 9.26,
    "íon metilamônio": 10.64,
    "íon etilamônio": 10.75,
    "íon anilínio": 4.63,
    "íon dimetilamônio": 10.71,
    "íon trimetilamônio": 9.81,
  };
  /*PROP-FIM*/

  /*ISO-INI*/ /* GERADO por tools/quimica/gera-isomeros.py (RDKit): não editar à mão. Cada isômero: [SMILES, esqueleto de carbonos, nome ou null] */
  SIM.org.ISO = {
    "C4H10": [["CC(C)C", "CC(C)C", "metilpropano"], ["CCCC", "CCCC", "butano"]],
    "C5H12": [["CC(C)(C)C", "CC(C)(C)C", "dimetilpropano"], ["CCC(C)C", "CCC(C)C", "2-metilbutano"], ["CCCCC", "CCCCC", "pentano"]],
    "C6H14": [["CC(C)C(C)C", "CC(C)C(C)C", "2,3-dimetilbutano"], ["CCC(C)(C)C", "CCC(C)(C)C", "2,2-dimetilbutano"], ["CCC(C)CC", "CCC(C)CC", "3-metilpentano"], ["CCCC(C)C", "CCCC(C)C", "2-metilpentano"], ["CCCCCC", "CCCCCC", "hexano"]],
    "C4H8": [["C1CCC1", "C1CCC1", "ciclobutano"], ["C=C(C)C", "CC(C)C", "metilpropeno"], ["C=CCC", "CCCC", "but-1-eno"], ["CC1CC1", "CC1CC1", "metilciclopropano"], ["CC=CC", "CCCC", "but-2-eno"]],
    "C5H10": [["C1CCCC1", "C1CCCC1", "ciclopentano"], ["C=C(C)CC", "CCC(C)C", "2-metilbut-1-eno"], ["C=CC(C)C", "CCC(C)C", "3-metilbut-1-eno"], ["C=CCCC", "CCCCC", "pent-1-eno"], ["CC1(C)CC1", "CC1(C)CC1", "1,1-dimetilciclopropano"], ["CC1CC1C", "CC1CC1C", "1,2-dimetilciclopropano"], ["CC1CCC1", "CC1CCC1", "metilciclobutano"], ["CC=C(C)C", "CCC(C)C", "2-metilbut-2-eno"], ["CC=CCC", "CCCCC", "pent-2-eno"], ["CCC1CC1", "CCC1CC1", "etilciclopropano"]],
    "C2H6O": [["CCO", "CC", "etanol"], ["COC", "C.C", "metoximetano"]],
    "C3H8O": [["CC(C)O", "CCC", "propan-2-ol"], ["CCCO", "CCC", "propan-1-ol"], ["CCOC", "C.CC", "metoxietano"]],
    "C4H10O": [["CC(C)(C)O", "CC(C)C", "2-metilpropan-2-ol"], ["CC(C)CO", "CC(C)C", "2-metilpropan-1-ol"], ["CCC(C)O", "CCCC", "butan-2-ol"], ["CCCCO", "CCCC", "butan-1-ol"], ["CCCOC", "C.CCC", "1-metoxipropano"], ["CCOCC", "CC.CC", "etoxietano"], ["COC(C)C", "C.CCC", "2-metoxipropano"]],
    "C3H6O": [["C1COC1", "CCC", "oxetano"], ["C=CCO", "CCC", "prop-2-en-1-ol"], ["C=COC", "C.CC", "metoxieteno"], ["CC(C)=O", "CCC", "propanona"], ["CC1CO1", "CCC", "2-metiloxirano"], ["CCC=O", "CCC", "propanal"], ["OC1CC1", "C1CC1", "ciclopropanol"]],
    "C3H7Cl": [["CC(C)Cl", "CCC", "2-cloropropano"], ["CCCCl", "CCC", "1-cloropropano"]],
    "C4H9Cl": [["CC(C)(C)Cl", "CC(C)C", "2-cloro-2-metilpropano"], ["CC(C)CCl", "CC(C)C", "1-cloro-2-metilpropano"], ["CCC(C)Cl", "CCCC", "2-clorobutano"], ["CCCCCl", "CCCC", "1-clorobutano"]],
    "C3H9N": [["CC(C)N", "CCC", "propan-2-amina"], ["CCCN", "CCC", "propan-1-amina"], ["CCNC", "C.CC", "N-metiletanamina"], ["CN(C)C", "C.C.C", "N,N-dimetilmetanamina"]],
  };
  /*ISO-FIM*/
})();
