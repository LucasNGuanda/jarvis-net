/* Matemática · módulo AL (Álgebra): matrizes, determinantes e sistemas lineares (MD01 a MD03).
   Acrescenta a SIM.al: mat (operações com matrizes de inteiros ou frações: soma, esc, mul, T, id, pot, igual, tr), mTex (matriz em TeX)
   e mFig (matrizes e símbolos desenhados em SVG, com colchetes e células destacadas).
   MD01: SIM.alMatMul (linha vezes coluna, elemento por elemento), SIM.alMatPlano (a matriz 2 × 2 que mexe no plano) e SIM.alMatDim (dá para multiplicar?).
   MD02: mat.det, mat.inv2, mat.sarrus; SIM.alDetArea, SIM.alSarrus, SIM.alInversa2.
   MD03: eqT, eqS, escalona, cramer, sisSorteia; SIM.alDiscute, SIM.alEscalona, SIM.alCramer.
   Contas conferidas em Python (tools/matematica/confere-al.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, { vis, rng, mn } = A;
  const mat = (A.mat = {});
  mat.dim = (m) => [m.length, m[0].length];
  mat.soma = (a, b) => a.map((l, i) => l.map((v, j) => v + b[i][j]));
  mat.esc = (k, a) => a.map((l) => l.map((v) => k * v));
  mat.mul = (a, b) => (a[0].length !== b.length ? null : a.map((l) => b[0].map((_, j) => l.reduce((s, v, k) => s + v * b[k][j], 0))));
  mat.T = (a) => a[0].map((_, j) => a.map((l) => l[j]));
  mat.id = (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  mat.pot = (a, n) => { let r = mat.id(a.length); for (let k = 0; k < n; k++) r = mat.mul(r, a); return r; };
  mat.igual = (a, b) => a.length === b.length && a.every((l, i) => l.length === b[i].length && l.every((v, j) => v === b[i][j]));
  mat.tr = (a) => a.reduce((s, l, i) => s + l[i], 0);
  mat.sorteia = (r, l, c, lo = -3, hi = 5) => Array.from({ length: l }, () => Array.from({ length: c }, () => lo + Math.floor(r() * (hi - lo + 1))));
  A.mTex = (m) => `\\begin{pmatrix} ${m.map((l) => l.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
  /* desenho: itens = matrizes (listas de listas) ou textos (símbolos). o.dest = { índiceDoItem: [[i, j, cor], ...] } pinta células */
  A.mFig = (itens, D, o = {}) => { const cw = o.cw || 38, ch = 28, pad = 8; let w = 0; const larg = itens.map((it) => (Array.isArray(it) ? it[0].length * cw + 2 * pad : String(it).length * 9 + 16)), nl = Math.max(...itens.map((it) => (Array.isArray(it) ? it.length : 1))), H = nl * ch + 24 + (o.sub ? 18 : 0), tot = larg.reduce((x, y) => x + y, 0); let x = (560 - tot) / 2, s = "";
    itens.forEach((it, k) => { if (!Array.isArray(it)) { s += A.T(x + larg[k] / 2, 12 + (nl * ch) / 2 + 5, it, { w: 700, f: 16 }); x += larg[k]; return; } const h = it.length * ch, y0 = 12 + (nl * ch - h) / 2, x1 = x + larg[k];
      s += `<path d="M${x + 7} ${y0} h-5 v${h} h5 M${x1 - 7} ${y0} h5 v${h} h-5" style="fill:none;stroke:var(--ink);stroke-width:2"/>`;
      it.forEach((l, i) => l.forEach((v, j) => { const d = ((o.dest || {})[k] || []).find((q) => q[0] === i && q[1] === j); if (d) s += `<rect x="${x + pad + j * cw + 2}" y="${y0 + i * ch + 2}" width="${cw - 4}" height="${ch - 4}" rx="4" style="fill:${d[2] || "var(--mod)"};opacity:.3"/>`; s += A.T(x + pad + j * cw + cw / 2, y0 + i * ch + ch / 2 + 5, typeof v === "number" ? mn(v) : v, { w: 600, f: String(v).length > 4 ? 11 : 14 }); })); x += larg[k]; });
    if (o.sub) s += A.T(280, H - 6, o.sub, { f: 12, c: "var(--ink2)" });
    return D ? D.svg(560, H, s, "figura") : `<svg viewBox="0 0 560 ${H}" width="100%" style="max-width:560px">${s}</svg>`; };

  /* ---------- MD01 ---------- */
  /* nome: "Linha vezes coluna: o produto de matrizes, elemento por elemento" · matéria: Matemática · tema: MD01 */
  SIM.alMatMul = (el, F) => { let r = rng(6), P = [[2, -1, 3], [0, 4, 1]], Q = [[1, 2], [3, 0], [-2, 5]], passo = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="novo">outras matrizes</button><button class="bt peq" data-v="prox">próximo elemento</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const C = mat.mul(P, Q), k = Math.min(passo, 4) - 1, i = k < 0 ? -1 : Math.floor(k / 2), j = k < 0 ? -1 : k % 2; return { P, Q, C, passo, i, j, parcelas: k < 0 ? [] : P[i].map((v, t) => [v, Q[t][j]]), mostrados: Math.min(passo, 4) }; };
    const novo = () => { P = mat.sorteia(r, 2, 3); Q = mat.sorteia(r, 3, 2); passo = 0; desenha(); };
    const avanca = () => { if (passo < 4) passo++; desenha(); };
    const desenha = () => { const e = est(), R0 = e.C.map((l, i) => l.map((v, j) => (i * 2 + j < e.mostrados ? v : "?"))), dest = {}; if (e.i >= 0) { dest[0] = [0, 1, 2].map((t) => [e.i, t, "var(--mod)"]); dest[2] = [0, 1, 2].map((t) => [t, e.j, "var(--ok)"]); dest[4] = [[e.i, e.j, "var(--warn)"]]; }
      q("[data-v=pal]").innerHTML = A.mFig([P, "×", Q, "=", R0], null, { dest });
      q("[data-v=lt]").innerHTML = e.i < 0 ? vis("ordens", "2 × 3 vezes 3 × 2 dá 2 × 2") : vis(`elemento da linha ${e.i + 1}, coluna ${e.j + 1}`, e.parcelas.map(([a, b]) => `${a < 0 ? "(" + mn(a) + ")" : a} · ${b < 0 ? "(" + mn(b) + ")" : b}`).join(" + ") + ` = ${mn(e.C[e.i][e.j])}`);
      q("[data-v=st]").innerHTML = e.i < 0 ? `Cada elemento do produto usa uma <b>linha inteira</b> da primeira matriz e uma <b>coluna inteira</b> da segunda. Antes de clicar, calcule o elemento da linha 1, coluna 1.` : `Para o elemento da linha ${e.i + 1} e coluna ${e.j + 1}: percorre-se a linha ${e.i + 1} da primeira (roxa) e a coluna ${e.j + 1} da segunda (verde) ao mesmo tempo, multiplicando par a par e somando. Por isso o número de colunas da primeira tem de ser igual ao número de linhas da segunda.` + (passo >= 4 ? " Produto completo." : ""); q("[data-v=prox]").disabled = passo >= 4; };
    q("[data-v=novo]").addEventListener("click", novo); q("[data-v=prox]").addEventListener("click", avanca);
    SIM.alMatMul._ult = { est, novo, avanca, poe: (o) => { P = o.P; Q = o.Q; passo = 0; desenha(); }, semente: (s) => { r = rng(s); novo(); } }; desenha(); };

  A.FORMA = [[0, 0], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2]];
  A.PRESET = [["identidade", [1, 0, 0, 1]], ["dobra tudo", [2, 0, 0, 2]], ["espelho no eixo y", [-1, 0, 0, 1]], ["gira 90°", [0, -1, 1, 0]], ["inclina", [1, 1, 0, 1]], ["achata numa reta", [1, 2, 0.5, 1]]];
  /* nome: "A matriz que mexe no plano" · matéria: Matemática · tema: MD01 */
  SIM.alMatPlano = (el, F) => { let m = [1, 1, 0, 1];
    const sl = (k, v) => `<label style="font-size:13px;color:var(--ink2)">${"abcd"[k]} <input type="range" data-k="${k}" min="-2" max="2" step="0.5" value="${v}" style="vertical-align:middle;width:100px"> <b data-r="${k}" style="color:var(--ink);display:inline-block;width:30px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${A.PRESET.map((p, k) => `<button class="bt peq" data-p="${k}">${p[0]}</button>`).join("")}</div><div class="bts" style="margin-top:6px">${m.map((v, k) => sl(k, v)).join("")}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), ap = (p) => [m[0] * p[0] + m[1] * p[1], m[2] * p[0] + m[3] * p[1]];
    const est = () => ({ m: m.slice(), e1: ap([1, 0]), e2: ap([0, 1]), det: m[0] * m[3] - m[1] * m[2], pts: A.FORMA.map(ap), aplica: ap });
    const poe = (o) => { m = (o.m || m).map((v) => Math.max(-2, Math.min(2, Math.round(+v * 2) / 2))); desenha(); };
    const pol = (pts, cor, tr) => pts.map((p, k) => { const n = pts[(k + 1) % pts.length]; return { x1: p[0], y1: p[1], x2: n[0], y2: n[1], cor, tr, w: 2.2 }; });
    const desenha = () => { const e = est(); m.forEach((v, k) => { el.querySelector(`[data-k="${k}"]`).value = String(v); el.querySelector(`[data-r="${k}"]`).textContent = F.nt(v, 1); });
      q("[data-v=pal]").innerHTML = A.plano({ x: [-6, 6], y: [-6, 6], h: 330, iso: true, fs: [], segs: [...pol(A.FORMA, "var(--ink3)", true), ...pol(e.pts, "var(--mod)", false), { x1: 0, y1: 0, x2: e.e1[0], y2: e.e1[1], cor: "var(--ok)", tr: false, w: 3 }, { x1: 0, y1: 0, x2: e.e2[0], y2: e.e2[1], cor: "var(--warn)", tr: false, w: 3 }], pts: [{ x: e.e1[0], y: e.e1[1], cor: "var(--ok)", r: 4 }, { x: e.e2[0], y: e.e2[1], cor: "var(--warn)", r: 4 }] });
      q("[data-v=lt]").innerHTML = vis("matriz", `[ ${F.nt(m[0], 1)}  ${F.nt(m[1], 1)} ; ${F.nt(m[2], 1)}  ${F.nt(m[3], 1)} ]`) + vis("(1, 0) vai para", `(${F.nt(e.e1[0], 1)}; ${F.nt(e.e1[1], 1)})`) + vis("(0, 1) vai para", `(${F.nt(e.e2[0], 1)}; ${F.nt(e.e2[1], 1)})`) + vis("ad − bc", F.nt(e.det, 2));
      q("[data-v=st]").innerHTML = `Multiplicar a matriz pelo ponto (x, y), escrito como coluna, leva cada ponto da figura tracejada à figura roxa. As <b>colunas</b> da matriz são os destinos de (1, 0), em verde, e de (0, 1), em laranja: quem sabe para onde vão esses dois sabe para onde vai tudo. ` + (e.det === 0 ? `Aqui ad − bc = 0: a figura foi <b>esmagada</b> numa reta (ou num ponto), e não há como desfazer.` : `O número ad − bc = ${F.nt(e.det, 2)} diz por quanto a área foi multiplicada${e.det < 0 ? " (o sinal negativo indica que a figura foi virada do avesso)" : ""}; ele é o assunto do próximo tema.`); };
    el.querySelectorAll("[data-k]").forEach((s) => s.addEventListener("input", (ev) => { const n = m.slice(); n[+s.dataset.k] = ev.target.value; poe({ m: n }); })); el.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => poe({ m: A.PRESET[+b.dataset.p][1] })));
    SIM.alMatPlano._ult = { poe, est }; desenha(); };

  /* nome: "Dá para multiplicar? As ordens das matrizes" · matéria: Matemática · tema: MD01 */
  SIM.alMatDim = (el, F) => { let r = rng(4), it = null, resp = -1, pontos = 0, feitas = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco" data-v="pal" style="text-align:center;padding:14px 10px"></div><div class="ctrls"><div><div class="bts" data-v="ops" style="justify-content:center"></div><div class="bts" style="margin-top:6px;justify-content:center"><button class="bt peq" data-v="novo">outro par</button></div></div></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), ri = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    const novo = () => { const mm = ri(1, 4), n = ri(1, 4), pp = r() < 0.6 ? n : ri(1, 4), qq = ri(1, 4), existe = n === pp, certa = existe ? `${mm} × ${qq}` : "não existe", cand = [`${mm} × ${qq}`, `${n} × ${pp}`, `${pp} × ${n}`, `${qq} × ${mm}`, `${mm} × ${n}`, "não existe"].filter((t, k, a2) => t !== certa && a2.indexOf(t) === k).slice(0, 3), ops = [certa, ...cand].map((t, k) => [t, k === 0, r()]).sort((x, y) => x[2] - y[2]); it = { m: mm, n, p: pp, q: qq, existe, ops: ops.map((o) => o[0]), certa: ops.findIndex((o) => o[1]) }; resp = -1; desenha(); };
    const responde = (k) => { if (resp >= 0) return; resp = k; feitas++; if (k === it.certa) pontos++; desenha(); };
    const est = () => ({ ...it, resp, pontos, feitas });
    const desenha = () => { q("[data-v=pal]").innerHTML = `<div style="font:700 30px/1.4 Inter,system-ui,sans-serif">A é ${it.m} × ${it.n}  e  B é ${it.p} × ${it.q}</div><div style="font-size:15px;color:var(--ink2)">Qual é a ordem do produto AB?</div>`;
      q("[data-v=ops]").innerHTML = it.ops.map((t, k) => `<button class="bt peq" data-o="${k}" style="font-size:15px${resp >= 0 && k === it.certa ? ";border-color:var(--ok);color:var(--ok)" : resp === k ? ";border-color:var(--warn);color:var(--warn)" : ""}">${t}</button>`).join("");
      el.querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => responde(+b.dataset.o)));
      q("[data-v=lt]").innerHTML = vis("acertos nesta sessão", `${pontos} de ${feitas}`);
      q("[data-v=st]").innerHTML = resp < 0 ? `Escreva as ordens lado a lado: (${it.m} × ${it.n})(${it.p} × ${it.q}). Olhe os dois números de dentro.` : (resp === it.certa ? "Certo. " : "Ainda não: a certa está marcada. ") + (it.existe ? `Os números de dentro são iguais (${it.n} e ${it.p}): o produto existe, e a ordem é dada pelos de fora, ${it.m} × ${it.q}.` : `Os números de dentro são diferentes (${it.n} e ${it.p}): cada linha de A tem ${it.n} ${it.n === 1 ? "elemento" : "elementos"} e cada coluna de B tem ${it.p}; não dá para emparelhar. O produto não existe.`); };
    q("[data-v=novo]").addEventListener("click", novo);
    SIM.alMatDim._ult = { est, novo, responde, semente: (s) => { r = rng(s); pontos = 0; feitas = 0; novo(); } }; novo(); };

  /* ---------- MD02 ---------- */
  /* determinante por expansão na primeira linha (qualquer ordem pequena) e inversa 2 × 2 com frações exatas */
  mat.det = (a) => (a.length === 1 ? a[0][0] : a.length === 2 ? a[0][0] * a[1][1] - a[0][1] * a[1][0] : a[0].reduce((s, v, j) => s + (j % 2 ? -1 : 1) * v * mat.det(a.slice(1).map((l) => l.filter((_, k) => k !== j))), 0));
  mat.inv2 = (a) => { const d = mat.det(a); return d === 0 ? null : [[M.fr(a[1][1], d), M.fr(-a[0][1], d)], [M.fr(-a[1][0], d), M.fr(a[0][0], d)]]; };
  /* Sarrus: as três diagonais que somam e as três que subtraem, com as posições das células */
  mat.sarrus = (a) => { const pos = [0, 1, 2].map((k) => [[0, k], [1, (k + 1) % 3], [2, (k + 2) % 3]]), neg = [0, 1, 2].map((k) => [[0, k], [1, (k + 2) % 3], [2, (k + 1) % 3]]), val = (c) => c.reduce((s, [i, j]) => s * a[i][j], 1); return { pos, neg, vp: pos.map(val), vn: neg.map(val), det: pos.map(val).reduce((x, y) => x + y, 0) - neg.map(val).reduce((x, y) => x + y, 0) }; };

  /* nome: "O determinante é uma área (com sinal)" · matéria: Matemática · tema: MD02 */
  SIM.alDetArea = (el, F) => { let m = [3, 1, 1, 2];
    const sl = (k, v) => `<label style="font-size:13px;color:var(--ink2)">${["a", "b", "c", "d"][k]} <input type="range" data-k="${k}" min="-4" max="4" step="1" value="${v}" style="vertical-align:middle;width:100px"> <b data-r="${k}" style="color:var(--ink);display:inline-block;width:24px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${m.map((v, k) => sl(k, v)).join("")}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    /* colunas u = (a, c) e v = (b, d); área do paralelogramo pela fórmula do "cadarço" */
    const est = () => { const [a, b, c, d] = m, det = a * d - b * c, P = [[0, 0], [a, c], [a + b, c + d], [b, d]], cad = P.reduce((s, p, k) => { const n = P[(k + 1) % 4]; return s + p[0] * n[1] - n[0] * p[1]; }, 0) / 2; return { m: m.slice(), det, area: Math.abs(cad), cadarco: cad, sentido: det > 0 ? "anti-horário" : det < 0 ? "horário" : "alinhados" }; };
    const poe = (o) => { m = (o.m || m).map((v) => Math.max(-4, Math.min(4, Math.round(+v)))); desenha(); };
    const desenha = () => { const e = est(), [a, b, c, d] = m; m.forEach((v, k) => { el.querySelector(`[data-k="${k}"]`).value = String(v); el.querySelector(`[data-r="${k}"]`).textContent = mn(v); });
      q("[data-v=pal]").innerHTML = A.plano({ x: [-9, 9], y: [-9, 9], h: 320, iso: true, px: 2, py: 2, fs: [], segs: [{ x1: a, y1: c, x2: a + b, y2: c + d, cor: "var(--ink3)" }, { x1: b, y1: d, x2: a + b, y2: c + d, cor: "var(--ink3)" }, { x1: 0, y1: 0, x2: a, y2: c, cor: "var(--ok)", tr: false, w: 3 }, { x1: 0, y1: 0, x2: b, y2: d, cor: "var(--warn)", tr: false, w: 3 }], pts: [{ x: a, y: c, cor: "var(--ok)", r: 4, rot: "1ª coluna" }, { x: b, y: d, cor: "var(--warn)", r: 4, rot: "2ª coluna", dx: -9 }] });
      q("[data-v=lt]").innerHTML = vis("matriz", `[ ${mn(a)}  ${mn(b)} ; ${mn(c)}  ${mn(d)} ]`) + vis("ad − bc", mn(e.det)) + vis("área do paralelogramo", F.nt(e.area, 2)) + vis("da 1ª para a 2ª coluna", e.sentido);
      q("[data-v=st]").innerHTML = e.det === 0 ? `As duas colunas estão na mesma reta: o paralelogramo <b>achatou</b>, e a área é zero. Determinante nulo é isso: uma coluna é múltipla da outra.` : `O paralelogramo formado pelas duas colunas tem área ${F.nt(e.area, 2)}, que é o <b>módulo</b> do determinante. O sinal diz o sentido: ${e.det > 0 ? "positivo, porque se vai da 1ª coluna para a 2ª girando no sentido anti-horário" : "negativo, porque se vai da 1ª coluna para a 2ª girando no sentido horário"}. Troque as duas colunas de lugar e o sinal inverte.`; };
    el.querySelectorAll("[data-k]").forEach((s) => s.addEventListener("input", (ev) => { const n = m.slice(); n[+s.dataset.k] = ev.target.value; poe({ m: n }); }));
    SIM.alDetArea._ult = { poe, est }; desenha(); };

  /* nome: "A regra de Sarrus, diagonal por diagonal" · matéria: Matemática · tema: MD02 */
  SIM.alSarrus = (el, F) => { let r = rng(8), P = [[2, 1, 3], [0, -1, 4], [1, 2, 5]], passo = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="novo">outra matriz</button><button class="bt peq" data-v="prox">próxima diagonal</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const z = mat.sarrus(P); return { P, passo, ...z, parcial: z.vp.slice(0, Math.min(passo, 3)).reduce((x, y) => x + y, 0) - z.vn.slice(0, Math.max(0, passo - 3)).reduce((x, y) => x + y, 0), laplace: mat.det(P) }; };
    const novo = () => { P = mat.sorteia(r, 3, 3, -2, 4); passo = 0; desenha(); };
    const avanca = () => { if (passo < 6) passo++; desenha(); };
    const desenha = () => { const e = est(), k = passo - 1, diag = k < 0 ? null : k < 3 ? e.pos[k] : e.neg[k - 3], cor = k < 3 ? "var(--ok)" : "var(--warn)", prod = (c) => c.map(([i, j]) => (P[i][j] < 0 ? `(${mn(P[i][j])})` : P[i][j])).join(" · ");
      q("[data-v=pal]").innerHTML = A.mFig([P], null, { dest: diag ? { 0: diag.map(([i, j]) => [i, j, cor]) } : {}, cw: 46 });
      q("[data-v=lt]").innerHTML = vis("diagonais que somam", e.vp.map((v, i) => (i < passo ? mn(v) : "?")).join(" ; ")) + vis("diagonais que subtraem", e.vn.map((v, i) => (i + 3 < passo ? mn(v) : "?")).join(" ; ")) + vis("determinante", passo >= 6 ? mn(e.det) : "?");
      q("[data-v=st]").innerHTML = k < 0 ? `São seis produtos de três números, um de cada linha e um de cada coluna: três diagonais "descendo para a direita", que somam, e três "descendo para a esquerda", que subtraem. Antes de clicar, calcule o primeiro: a diagonal principal.` : `${k < 3 ? "Soma" : "Subtrai"}: ${prod(diag)} = ${mn((k < 3 ? e.vp : e.vn)[k % 3])}.` + (passo >= 6 ? ` Determinante: (${e.vp.map(mn).join(" + ")}) − (${e.vn.map(mn).join(" + ")}) = ${mn(e.det)}.` : " As diagonais \"dão a volta\": quando acabam as colunas, continuam na primeira."); q("[data-v=prox]").disabled = passo >= 6; };
    q("[data-v=novo]").addEventListener("click", novo); q("[data-v=prox]").addEventListener("click", avanca);
    SIM.alSarrus._ult = { est, novo, avanca, poe: (o) => { P = o.P; passo = 0; desenha(); }, semente: (s) => { r = rng(s); novo(); } }; desenha(); };

  /* nome: "A inversa 2 × 2 em quatro passos" · matéria: Matemática · tema: MD02 */
  SIM.alInversa2 = (el, F) => { let r = rng(3), P = [[2, 1], [5, 3]], passo = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="novo">outra matriz</button><button class="bt peq" data-v="sing">uma sem inversa</button><button class="bt peq" data-v="prox">próximo passo</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const d = mat.det(P), inv = mat.inv2(P); let prod = null; if (inv) prod = [0, 1].map((i) => [0, 1].map((j) => M.txt(M.soma(M.mul(M.fr(P[i][0]), inv[0][j]), M.mul(M.fr(P[i][1]), inv[1][j]))))); return { P, passo, det: d, inv: inv && inv.map((l) => l.map(M.txt)), prod, tem: d !== 0 }; };
    const novo = (sing) => { do { P = mat.sorteia(r, 2, 2, -3, 5); if (sing) { const k = [2, -1, 3][Math.floor(r() * 3)]; P[1] = P[0].map((v) => k * v); } } while (sing ? P[0][0] === 0 && P[0][1] === 0 : mat.det(P) === 0); passo = 0; desenha(); };
    const avanca = () => { if (passo < (mat.det(P) === 0 ? 1 : 4)) passo++; desenha(); };
    const desenha = () => { const e = est(), [[a, b], [c, d]] = P, adj = [[d, -b], [-c, a]], itens = ["A =", P]; if (e.tem && passo >= 2) itens.push(passo >= 3 ? "  troca e sinais:" : "  troca a diagonal:", passo >= 3 ? adj : [[d, b], [c, a]]); if (e.tem && passo >= 4) itens.push("  A⁻¹ =", e.inv);
      q("[data-v=pal]").innerHTML = A.mFig(itens, null, { cw: 44 });
      q("[data-v=lt]").innerHTML = vis("determinante", passo >= 1 ? mn(e.det) : "?") + vis("tem inversa?", passo >= 1 ? (e.tem ? "sim" : "não") : "?") + (e.tem && passo >= 4 ? vis("A · A⁻¹", `[ ${e.prod[0].join("  ")} ; ${e.prod[1].join("  ")} ]`) : "");
      q("[data-v=st]").innerHTML = ["Primeiro passo de toda inversa: o determinante. Calcule ad − bc antes de clicar.", e.tem ? `ad − bc = ${mn(a * d)} − ${b * c < 0 ? "(" + mn(b * c) + ")" : mn(b * c)} = ${mn(e.det)}, diferente de zero: a inversa existe.` : `ad − bc = ${mn(e.det)}. Determinante zero: <b>não existe inversa</b>. Uma linha é múltipla da outra; como transformação, a matriz esmaga o plano numa reta, e isso não tem volta.`, "Troque de lugar os dois elementos da diagonal principal.", "Troque o sinal dos outros dois (sem mudá-los de lugar).", `Divida tudo pelo determinante (${mn(e.det)}). Conferência: o produto A · A⁻¹ tem de dar a identidade.`][passo]; q("[data-v=prox]").disabled = passo >= (e.tem ? 4 : 1); };
    q("[data-v=novo]").addEventListener("click", () => novo(false)); q("[data-v=sing]").addEventListener("click", () => novo(true)); q("[data-v=prox]").addEventListener("click", avanca);
    SIM.alInversa2._ult = { est, novo, avanca, poe: (o) => { P = o.P; passo = 0; desenha(); }, semente: (s, sing) => { r = rng(s); novo(!!sing); } }; desenha(); };

  /* ---------- MD03 ---------- */
  /* equação linear escrita sem "1x", sem "+ −" e sem termo nulo: eqT em TeX, eqS em texto */
  const eqLado = (co, vs, tex) => { let s = ""; co.forEach((c, i) => { if (c === 0) return; const a = Math.abs(c), t = (a === 1 ? "" : String(a)) + vs[i]; s += s === "" ? (c < 0 ? (tex ? "-" : "−") : "") + t : (c < 0 ? (tex ? " - " : " − ") : " + ") + t; }); return s === "" ? "0" : s; };
  A.eqT = (co, b, vs = ["x", "y", "z"]) => `${eqLado(co, vs, true)} = ${b}`;
  A.eqS = (co, b, vs = ["x", "y", "z"]) => `${eqLado(co, vs, false)} = ${typeof b === "number" ? mn(b) : b}`;
  /* escalonamento com frações exatas; aug = matriz aumentada n × (n + 1) de inteiros.
     Devolve os passos (operação e matriz depois dela), o tipo (SPD, SPI, SI) e, no SPD, a solução. */
  A.escalona = (aug) => { let m = aug.map((l) => l.map((v) => M.fr(v))); const n = m.length, passos = [], copia = () => m.map((l) => l.slice()), z = (v) => M.val(v) === 0; let lin = 0; const piv = [];
    for (let c = 0; c < n && lin < n; c++) { let p = lin; while (p < n && z(m[p][c])) p++; if (p === n) continue;
      if (p !== lin) { [m[p], m[lin]] = [m[lin], m[p]]; passos.push({ tipo: "troca", i: lin, k: p, op: `troca L${lin + 1} com L${p + 1}`, m: copia() }); }
      for (let i = lin + 1; i < n; i++) { const f = M.div(m[i][c], m[lin][c]); if (z(f)) continue; const base = m[lin]; m[i] = m[i].map((v, j) => M.sub(v, M.mul(f, base[j]))); passos.push({ tipo: "soma", i, k: lin, f, op: `L${i + 1} ← L${i + 1} ${M.val(f) < 0 ? "+" : "−"} ${M.txt(M.fr(Math.abs(f.n), f.d)).replace(/^1$/, "")}${Math.abs(M.val(f)) === 1 ? "" : " · "}L${lin + 1}`, m: copia() }); }
      piv.push(c); lin++; }
    const nula = (l) => l.slice(0, n).every(z), tipo = m.some((l) => nula(l) && !z(l[n])) ? "SI" : piv.length === n ? "SPD" : "SPI"; let sol = null;
    if (tipo === "SPD") { sol = Array(n); for (let i = n - 1; i >= 0; i--) { let s = m[i][n]; for (let j = i + 1; j < n; j++) s = M.sub(s, M.mul(m[i][j], sol[j])); sol[i] = M.div(s, m[i][i]); } }
    return { passos, tipo, sol, fim: m }; };
  /* Cramer: D e os determinantes com a coluna trocada */
  A.cramer = (co, b) => { const D = mat.det(co), Ds = co[0].map((_, j) => mat.det(co.map((l, i) => l.map((v, k) => (k === j ? b[i] : v))))); return { D, Ds, sol: D === 0 ? null : Ds.map((d) => M.fr(d, D)) }; };
  /* sistema sorteado n × n de solução inteira; tipo "SPD", "SPI" (última linha = soma das outras) ou "SI" (idem, com o termo independente errado) */
  A.sisSorteia = (r, n, tipo = "SPD") => { const ri = (a, b) => a + Math.floor(r() * (b - a + 1)); let co, sol, b;
    do { co = mat.sorteia(r, n, n, -2, 3); if (tipo !== "SPD") co[n - 1] = co[0].map((_, j) => co.slice(0, n - 1).reduce((s, l) => s + l[j], 0)); } while (tipo === "SPD" ? mat.det(co) === 0 || co.some((l) => l.every((v) => v === 0)) : co.slice(0, n - 1).some((l) => l.every((v) => v === 0)) || (n === 3 && co[0][0] * co[1][1] - co[0][1] * co[1][0] === 0));
    sol = Array.from({ length: n }, () => ri(-3, 4)); b = co.map((l) => l.reduce((s, v, j) => s + v * sol[j], 0)); if (tipo === "SI") b[n - 1] += ri(1, 3); return { co, b, sol: tipo === "SPD" ? sol : null, aug: co.map((l, i) => [...l, b[i]]) }; };
  const fT = (v) => M.txt(v);

  /* nome: "Duas retas, um parâmetro: uma, nenhuma ou infinitas soluções" · matéria: Matemática · tema: MD03 */
  SIM.alDiscute = (el, F) => { let k = 1, m = 6;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">k <input type="range" data-v="k" min="-4" max="6" step="1" value="1" style="vertical-align:middle;width:170px"> <b data-v="kr" style="color:var(--ink);display:inline-block;width:24px"></b></label><label style="font-size:13px;color:var(--ink2)">m <input type="range" data-v="m" min="0" max="12" step="1" value="6" style="vertical-align:middle;width:170px"> <b data-v="mr" style="color:var(--ink);display:inline-block;width:24px"></b></label></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    /* x + 2y = 4 e 2x + ky = m: determinante k − 4 */
    const est = () => { const s = M.sis(1, 2, 4, 2, k, m); return { k, m, det: s.det, tipo: s.tipo, x: s.x && M.val(s.x), y: s.y && M.val(s.y), xs: s.x && M.txt(s.x), ys: s.y && M.txt(s.y) }; };
    const poe = (o) => { if (o.k !== undefined) k = Math.max(-4, Math.min(6, Math.round(+o.k))); if (o.m !== undefined) m = Math.max(0, Math.min(12, Math.round(+o.m))); desenha(); };
    const desenha = () => { const e = est(); q("[data-v=k]").value = String(k); q("[data-v=m]").value = String(m); q("[data-v=kr]").textContent = mn(k); q("[data-v=mr]").textContent = mn(m);
      const r2 = k === 0 ? { x1: m / 2, y1: -7, x2: m / 2, y2: 7, cor: "var(--warn)", tr: false, w: 2.4 } : null, vis2 = e.tipo === "uma" && Math.abs(e.x) <= 7.5 && Math.abs(e.y) <= 5.5;
      q("[data-v=pal]").innerHTML = A.plano({ x: [-8, 8], y: [-6, 6], h: 300, iso: true, px: 2, py: 2, fs: [{ f: (x) => (4 - x) / 2, cor: "var(--ok)" }, ...(k === 0 ? [] : [{ f: (x) => (m - 2 * x) / k, cor: "var(--warn)", tr: e.tipo === "infinitas" }])], segs: r2 ? [r2] : [], pts: vis2 ? [{ x: e.x, y: e.y, r: 5, rot: `(${e.xs}; ${e.ys})` }] : [] });
      q("[data-v=lt]").innerHTML = vis("verde", "x + 2y = 4") + vis("laranja", A.eqS([2, k], m)) + vis("determinante", `${mn(k)} − 4 = ${mn(e.det)}`) + vis("soluções", e.tipo === "uma" ? "uma" : e.tipo);
      q("[data-v=st]").innerHTML = e.tipo === "uma" ? `Determinante diferente de zero: as retas têm inclinações diferentes e se cruzam num único ponto, (${e.xs}; ${e.ys})${vis2 ? "" : ", que caiu fora da janela do desenho"}. Sistema <b>possível e determinado</b>. Mexer em m só desloca a reta laranja; não muda o tipo.` : e.tipo === "infinitas" ? `Determinante zero e a segunda equação é a primeira multiplicada por 2: é a <b>mesma reta</b> desenhada duas vezes. Todo ponto dela é solução. Sistema <b>possível e indeterminado</b>.` : `Determinante zero: as retas têm a mesma inclinação, mas são retas diferentes. <b>Paralelas</b>: nenhum ponto em comum. Sistema <b>impossível</b>. Só m = 8 faria as duas coincidirem.`; };
    q("[data-v=k]").addEventListener("input", (ev) => poe({ k: ev.target.value })); q("[data-v=m]").addEventListener("input", (ev) => poe({ m: ev.target.value }));
    SIM.alDiscute._ult = { poe, est }; desenha(); };

  /* nome: "Escalonamento, uma operação por vez" · matéria: Matemática · tema: MD03 */
  SIM.alEscalona = (el, F) => { let r = rng(4), S = { aug: [[1, 1, 1, 3], [2, 1, -1, 9], [1, -2, 2, -8]] }, E = A.escalona(S.aug), passo = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="spd">outro sistema</button><button class="bt peq" data-v="si">um impossível</button><button class="bt peq" data-v="spi">um indeterminado</button><button class="bt peq" data-v="prox">próxima operação</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), total = () => E.passos.length + 1, atual = () => { const i = Math.min(passo, E.passos.length); return i === 0 ? S.aug.map((l) => l.map((v) => M.fr(v))) : E.passos[i - 1].m; };
    const est = () => ({ aug: S.aug, passo, total: total(), tipo: E.tipo, sol: E.sol && E.sol.map(M.val), ops: E.passos.map((x) => x.op), atual: atual().map((l) => l.map(M.val)) });
    const novo = (tipo) => { S = A.sisSorteia(r, 3, tipo || "SPD"); E = A.escalona(S.aug); passo = 0; desenha(); };
    const avanca = () => { if (passo < total()) passo++; desenha(); };
    const desenha = () => { const fim = passo >= total(), mAt = atual(), co = mAt.map((l) => l.slice(0, 3).map(fT)), b = mAt.map((l) => [fT(l[3])]), pa = passo >= 1 && passo <= E.passos.length ? E.passos[passo - 1] : null;
      q("[data-v=pal]").innerHTML = A.mFig([co, "|", b], null, { cw: 50, dest: pa ? { 0: [0, 1, 2].map((j) => [pa.i, j, "var(--warn)"]), 2: [[pa.i, 0, "var(--warn)"]] } : {}, sub: "coeficientes de x, y, z | termos independentes" });
      q("[data-v=lt]").innerHTML = vis("operação", pa ? pa.op : passo === 0 ? "nenhuma ainda" : "terminou") + vis("passo", `${Math.min(passo, total())} de ${total()}`) + vis("tipo", fim ? E.tipo : "?") + (fim && E.sol ? vis("solução (x; y; z)", `(${E.sol.map(fT).join("; ")})`) : "");
      q("[data-v=st]").innerHTML = passo === 0 ? `Cada linha é uma equação: os três primeiros números são os coeficientes de x, y e z, e o último é o termo independente. Objetivo: zerar tudo abaixo da diagonal, somando a uma linha um múltiplo de outra. Antes de clicar, diga qual operação zera o primeiro número da segunda linha.` : !fim ? `${pa.tipo === "troca" ? "Trocar duas equações de lugar não muda o sistema." : "A linha destacada foi trocada por ela mesma mais um múltiplo de outra: as soluções continuam as mesmas."} Operação: <b>${pa.op}</b>.` : E.tipo === "SPD" ? `Forma de escada: a última linha dá z; a segunda, com z, dá y; a primeira dá x. Solução única: (${E.sol.map(fT).join("; ")}). Sistema <b>possível e determinado</b>.` : E.tipo === "SI" ? `Apareceu uma linha com os três coeficientes nulos e o termo independente diferente de zero: ela diz "0 = número não nulo". Sistema <b>impossível</b>.` : `Uma linha virou só zeros ("0 = 0"): era uma equação repetida disfarçada. Sobram menos equações que incógnitas. Sistema <b>possível e indeterminado</b>: infinitas soluções.`; q("[data-v=prox]").disabled = fim; };
    q("[data-v=spd]").addEventListener("click", () => novo("SPD")); q("[data-v=si]").addEventListener("click", () => novo("SI")); q("[data-v=spi]").addEventListener("click", () => novo("SPI")); q("[data-v=prox]").addEventListener("click", avanca);
    SIM.alEscalona._ult = { est, novo, avanca, poe: (o) => { S = { aug: o.aug }; E = A.escalona(S.aug); passo = 0; desenha(); }, semente: (s, tipo) => { r = rng(s); novo(tipo); } }; desenha(); };

  /* nome: "Regra de Cramer: trocando uma coluna por vez" · matéria: Matemática · tema: MD03 */
  SIM.alCramer = (el, F) => { let r = rng(6), S = { co: [[3, 2], [5, -2]], b: [12, 4] }, passo = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="n2">outro 2 × 2</button><button class="bt peq" data-v="n3">outro 3 × 3</button><button class="bt peq" data-v="prox">próximo determinante</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), n = () => S.co.length, vs = ["x", "y", "z"];
    const est = () => ({ ...A.cramer(S.co, S.b), co: S.co, b: S.b, passo, total: n() + 1, solN: A.cramer(S.co, S.b).sol.map(M.val) });
    const novo = (k) => { const t = A.sisSorteia(r, k, "SPD"); S = { co: t.co, b: t.b }; passo = 0; desenha(); };
    const avanca = () => { if (passo < n() + 1) passo++; desenha(); };
    const desenha = () => { const e = A.cramer(S.co, S.b), j = passo - 2, tro = j >= 0 ? S.co.map((l, i) => l.map((v, k) => (k === j ? S.b[i] : v))) : S.co;
      q("[data-v=pal]").innerHTML = A.mFig([passo <= 1 ? "D:" : `D${vs[j]}:`, tro], null, { cw: 46, dest: j >= 0 ? { 1: S.co.map((_, i) => [i, j, "var(--warn)"]) } : {}, sub: S.co.map((l, i) => A.eqS(l, S.b[i], vs.slice(0, n()))).join("   ;   ") });
      q("[data-v=lt]").innerHTML = vis("D", passo >= 1 ? mn(e.D) : "?") + S.co.map((_, i) => vis("D" + vs[i], passo >= i + 2 ? mn(e.Ds[i]) : "?") + vis(vs[i], passo >= i + 2 ? fT(e.sol[i]) : "?")).join("");
      q("[data-v=st]").innerHTML = passo === 0 ? `As equações estão embaixo da matriz. Primeiro, D: o determinante dos coeficientes. Calcule antes de clicar.` : passo === 1 ? `D = ${mn(e.D)}, diferente de zero: solução única. Agora troque a coluna de x pelos termos independentes e calcule Dx.` : `Coluna de ${vs[j]} trocada pelos termos independentes (em destaque): D${vs[j]} = ${mn(e.Ds[j])}, e ${vs[j]} = D${vs[j]} / D = ${fT(e.sol[j])}.` + (passo >= n() + 1 ? ` Solução: (${e.sol.map(fT).join("; ")}). Confira substituindo na primeira equação.` : ""); q("[data-v=prox]").disabled = passo >= n() + 1; };
    q("[data-v=n2]").addEventListener("click", () => novo(2)); q("[data-v=n3]").addEventListener("click", () => novo(3)); q("[data-v=prox]").addEventListener("click", avanca);
    SIM.alCramer._ult = { est, novo, avanca, poe: (o) => { S = { co: o.co, b: o.b }; passo = 0; desenha(); }, semente: (s, k) => { r = rng(s); novo(k || 2); } }; desenha(); };
})();
