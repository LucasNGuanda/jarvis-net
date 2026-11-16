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
      if (o.nums && o.nums[k] !== undefined) s += `<text x="${X(k).toFixed(1)}" y="${(Y(k) - 13).toFixed(1)}" text-anchor="middle" style="font:500 11px Inter,system-ui,sans-serif;fill:var(--ink2)">${o.nums[k]}</text>`; });
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

})();
