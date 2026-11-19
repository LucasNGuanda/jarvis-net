/* Matemática · módulo AL (Álgebra): matrizes, determinantes e sistemas lineares (MD01 a MD03).
   Acrescenta a SIM.al: mat (operações com matrizes de inteiros ou frações: soma, esc, mul, T, id, pot, igual, tr), mTex (matriz em TeX)
   e mFig (matrizes e símbolos desenhados em SVG, com colchetes e células destacadas).
   MD01: SIM.alMatMul (linha vezes coluna, elemento por elemento), SIM.alMatPlano (a matriz 2 × 2 que mexe no plano) e SIM.alMatDim (dá para multiplicar?).
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
})();
