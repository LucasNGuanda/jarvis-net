/* Matemática · módulo AL (Álgebra): binômio de Newton e números complexos (BW01, NCP01 a NCP04).
   Acrescenta a SIM.al: comb (número binomial), pascal (linhas do triângulo), binCoefs (coeficientes de (px + q)ⁿ), pascalFig (triângulo desenhado)
   e caminhos (número de caminhos numa grade).
   BW01: SIM.alPascal (o triângulo, a relação de Stifel e a paridade), SIM.alBinomio ((px + q)ⁿ termo a termo) e SIM.alCaminhos (caminhos numa grade).
   NCP01: cx (complexos como pares [a, b]: soma, sub, mul, div exata, conj, mod2, pot, ipot, tex, txt, pt, vet), planoC (plano de Argand-Gauss);
          SIM.alGiraI (multiplicar por i é girar 90°), SIM.alDeltaNeg (as raízes quando Δ fica negativo) e SIM.alCicloI (quiz de iⁿ).
   Contas conferidas em Python (tools/matematica/confere-al.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, { vis, rng, mn } = A;

  /* ---------- BW01 ---------- */
  /* número binomial com inteiros (exato até onde os números comuns são exatos: n ≤ 50 sobra) */
  A.comb = (n, k) => { if (k < 0 || k > n) return 0; k = Math.min(k, n - k); let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
  A.fat = (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
  A.pascal = (n) => Array.from({ length: n + 1 }, (_, i) => Array.from({ length: i + 1 }, (_, j) => A.comb(i, j)));
  /* coeficientes de (px + q)ⁿ, da maior potência de x para a menor */
  A.binCoefs = (p, q, n) => Array.from({ length: n + 1 }, (_, k) => A.comb(n, k) * p ** (n - k) * q ** k);
  /* triângulo de Pascal até a linha n; o.dest = { "i,j": cor }, o.oculta = ["i,j"] (vira "?"), o.rot = false tira os rótulos das linhas */
  A.pascalFig = (n, D, o = {}) => { const rh = o.rh || 26, cw = o.cw || Math.min(46, 500 / (n + 1)), H = (n + 1) * rh + 16, T = A.pascal(n); let s = "";
    T.forEach((l, i) => { if (o.rot !== false) s += A.T(22, 14 + i * rh + 9, "n=" + i, { f: 10, c: "var(--ink3)" });
      l.forEach((v, j) => { const x = 290 + (j - i / 2) * cw, y = 14 + i * rh, ch = i + "," + j, cor = (o.dest || {})[ch], oc = (o.oculta || []).includes(ch), t = String(v);
        if (cor) s += `<rect x="${x - cw / 2 + 2}" y="${y - 6}" width="${cw - 4}" height="${rh - 4}" rx="5" style="fill:${cor};opacity:.32"/>`;
        s += `<g data-c="${ch}" style="cursor:${o.clique ? "pointer" : "default"}"><rect x="${x - cw / 2}" y="${y - 8}" width="${cw}" height="${rh}" style="fill:transparent"/>${A.T(x, y + 9, oc ? "?" : t, { w: cor ? 700 : 500, f: t.length > 4 ? 9.5 : t.length > 3 ? 11 : 13 })}</g>`; }); });
    return D ? D.svg(560, H, s, "figura") : `<svg viewBox="0 0 560 ${H}" width="100%" style="max-width:560px">${s}</svg>`; };
  /* caminhos numa grade: de (0, 0) até (i, j), andando só para a direita ou para cima */
  A.caminhos = (i, j) => { const g = Array.from({ length: i + 1 }, () => Array(j + 1).fill(1)); for (let a = 1; a <= i; a++) for (let b = 1; b <= j; b++) g[a][b] = g[a - 1][b] + g[a][b - 1]; return g[i][j]; };
  A.gradeFig = (L, Hh, D, o = {}) => { const c = o.c || 40, W = 560, x0 = (W - L * c) / 2, H = Hh * c + 46, y0 = H - 22; let s = "";
    for (let i = 0; i <= L; i++) s += `<line x1="${x0 + i * c}" y1="${y0}" x2="${x0 + i * c}" y2="${y0 - Hh * c}" style="stroke:var(--line);stroke-width:1.5"/>`;
    for (let j = 0; j <= Hh; j++) s += `<line x1="${x0}" y1="${y0 - j * c}" x2="${x0 + L * c}" y2="${y0 - j * c}" style="stroke:var(--line);stroke-width:1.5"/>`;
    if (o.rota) { let d = `M${x0} ${y0}`, x = 0, y = 0; o.rota.split("").forEach((m) => { if (m === "D") x++; else y++; d += ` L${x0 + x * c} ${y0 - y * c}`; }); s += `<path d="${d}" style="fill:none;stroke:var(--warn);stroke-width:3.5;stroke-linejoin:round;stroke-linecap:round"/>`; }
    if (o.nums) for (let i = 0; i <= L; i++) for (let j = 0; j <= Hh; j++) { const al = o.alvo && o.alvo[0] === i && o.alvo[1] === j; s += `<g data-p="${i},${j}" style="cursor:pointer"><circle cx="${x0 + i * c}" cy="${y0 - j * c}" r="${al ? 13 : 11}" style="fill:${al ? "var(--mod)" : "var(--card2)"};stroke:var(--line)"/>${A.T(x0 + i * c, y0 - j * c + 4, o.nums(i, j), { f: 10.5, w: al ? 700 : 500, c: al ? "#fff" : "var(--ink)" })}</g>`; }
    else { s += `<circle cx="${x0}" cy="${y0}" r="6" style="fill:var(--ok)"/><circle cx="${x0 + L * c}" cy="${y0 - Hh * c}" r="6" style="fill:var(--mod)"/>` + A.T(x0 - 14, y0 + 5, "A", { w: 700, f: 13 }) + A.T(x0 + L * c + 14, y0 - Hh * c + 5, "B", { w: 700, f: 13 }); }
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:560px">${s}</svg>`; };
  const supN = (n) => String(n).split("").map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]).join("");

  /* nome: "O triângulo de Pascal: clique num número" · matéria: Matemática · tema: BW01 */
  SIM.alPascal = (el, F) => { let n = 8, sel = [4, 2], modo = "stifel";
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">linhas <input type="range" data-v="n" min="4" max="12" step="1" value="8" style="vertical-align:middle;width:150px"> <b data-v="nr" style="color:var(--ink);display:inline-block;width:24px"></b></label><button class="bt peq" data-m="stifel">de onde vem</button><button class="bt peq" data-m="linha">soma da linha</button><button class="bt peq" data-m="par">pares e ímpares</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const [i, j] = sel, v = A.comb(i, j), pais = [j > 0 ? A.comb(i - 1, j - 1) : 0, j < i ? A.comb(i - 1, j) : 0], linha = A.pascal(n)[i]; return { n, sel: sel.slice(), modo, v, pais, soma: linha.reduce((x, y) => x + y, 0), impares: A.pascal(n).flat().filter((x) => x % 2).length, total: ((n + 1) * (n + 2)) / 2 }; };
    const poe = (o) => { if (o.n !== undefined) { n = Math.max(4, Math.min(12, Math.round(+o.n))); if (sel[0] > n) sel = [n, Math.min(sel[1], n)]; } if (o.sel) sel = [Math.min(o.sel[0], n), Math.min(o.sel[1], o.sel[0])]; if (o.modo) modo = o.modo; desenha(); };
    const desenha = () => { const e = est(), [i, j] = sel, dest = {}; q("[data-v=n]").value = String(n); q("[data-v=nr]").textContent = String(n);
      if (modo === "stifel") { dest[i + "," + j] = "var(--mod)"; if (i > 0 && j > 0) dest[i - 1 + "," + (j - 1)] = "var(--ok)"; if (i > 0 && j < i) dest[i - 1 + "," + j] = "var(--ok)"; }
      else if (modo === "linha") for (let k = 0; k <= i; k++) dest[i + "," + k] = "var(--warn)"; else A.pascal(n).forEach((l, a) => l.forEach((v, b) => { if (v % 2) dest[a + "," + b] = "var(--mod)"; }));
      q("[data-v=pal]").innerHTML = A.pascalFig(n, null, { dest, clique: true });
      el.querySelectorAll("[data-m]").forEach((b) => b.classList.toggle("on", b.dataset.m === modo));
      q("[data-v=lt]").innerHTML = modo === "par" ? vis("ímpares (pintados)", e.impares) + vis("números no triângulo", e.total) : vis("posição", `linha ${i}, coluna ${j}`) + vis("valor", mn(e.v)) + (modo === "stifel" ? vis("os dois de cima", i === 0 ? "não há" : j === 0 || j === i ? "só um: 1" : `${e.pais[0]} + ${e.pais[1]}`) : vis(`soma da linha ${i}`, `${e.soma} = 2${supN(i)}`));
      q("[data-v=st]").innerHTML = modo === "stifel" ? (i === 0 || j === 0 || j === i ? `As bordas valem sempre 1: há um único jeito de escolher nada (coluna 0) ou de escolher tudo. Clique num número de dentro.` : `O número da linha ${i}, coluna ${j} é a soma dos dois que estão logo acima dele: ${e.pais[0]} + ${e.pais[1]} = ${e.v}. Essa é a relação de Stifel, e é ela que constrói o triângulo inteiro a partir das bordas.`) : modo === "linha" ? `A linha ${i} soma ${e.soma}, que é 2${supN(i)}: cada linha soma o dobro da anterior, porque cada número de cima é usado duas vezes na linha de baixo (uma vez à esquerda, uma à direita).` : `Pintando só os ímpares aparece um desenho de triângulos dentro de triângulos. Aumente o número de linhas: nas linhas 3, 7 (e 15, se coubesse) todos os números são ímpares.`;
      el.querySelectorAll("[data-c]").forEach((g) => g.addEventListener("click", () => { const [a, b] = g.dataset.c.split(",").map(Number); poe({ sel: [a, b] }); })); };
    q("[data-v=n]").addEventListener("input", (ev) => poe({ n: ev.target.value })); el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => poe({ modo: b.dataset.m })));
    SIM.alPascal._ult = { poe, est }; desenha(); };

  /* nome: "Expandindo (px + q)ⁿ, termo a termo" · matéria: Matemática · tema: BW01 */
  SIM.alBinomio = (el, F) => { let p = 2, qq = 3, n = 4, passo = 0;
    const sl = (k, r, lo, hi, v) => `<label style="font-size:13px;color:var(--ink2)">${r} <input type="range" data-v="${k}" min="${lo}" max="${hi}" step="1" value="${v}" style="vertical-align:middle;width:110px"> <b data-v="${k}r" style="color:var(--ink);display:inline-block;width:24px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("p", "p", 1, 3, 2)}${sl("q", "q", -3, 3, 3)}${sl("n", "n", 2, 6, 4)}<button class="bt peq" data-v="prox">próximo termo</button><button class="bt peq" data-v="zera">recomeçar</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const cs = A.binCoefs(p, qq, n); return { p, q: qq, n, passo, coefs: cs, soma: cs.reduce((x, y) => x + y, 0), valor: (x) => cs.reduce((s, c, k) => s + c * x ** (n - k), 0) }; };
    const poe = (o) => { if (o.p !== undefined) p = Math.max(1, Math.min(3, Math.round(+o.p))); if (o.q !== undefined) { qq = Math.max(-3, Math.min(3, Math.round(+o.q))); if (qq === 0) qq = 1; } if (o.n !== undefined) n = Math.max(2, Math.min(6, Math.round(+o.n))); passo = o.passo === undefined ? 0 : Math.min(o.passo, n + 1); desenha(); };
    const avanca = () => { if (passo < n + 1) passo++; desenha(); };
    const desenha = () => { const e = est(), k = passo - 1, mono = (c, g) => (g === 0 ? mn(Math.abs(c)) : (Math.abs(c) === 1 ? "" : mn(Math.abs(c))) + "x" + (g === 1 ? "" : supN(g))); [["p", p], ["q", qq], ["n", n]].forEach(([a, v]) => { q(`[data-v=${a}]`).value = String(v); q(`[data-v=${a}r]`).textContent = mn(v); });
      const dest = {}; if (k >= 0) dest[n + "," + k] = "var(--warn)"; for (let j = 0; j <= n; j++) if (j !== k) dest[n + "," + j] = "var(--ok)";
      const bin = `(${M.polTxt([p, qq])})${supN(n)}`, feito = e.coefs.slice(0, passo).map((c, j) => (j === 0 ? (c < 0 ? "−" : "") : c < 0 ? " − " : " + ") + mono(c, n - j)).join("");
      q("[data-v=pal]").innerHTML = A.pascalFig(n, null, { dest, rot: false, rh: 24 }) + `<div style="text-align:center;font-size:17px;font-weight:650;margin-top:6px;color:var(--ink)">${bin} = ${feito || ""}${passo <= n ? (feito ? " + " : "") + "…" : ""}</div>`;
      q("[data-v=lt]").innerHTML = vis("termo", passo === 0 ? "nenhum ainda" : `${passo}º (k = ${k})`) + vis("C(n, k)", k >= 0 ? A.comb(n, k) : "?") + vis("conta", k >= 0 ? `${A.comb(n, k)} · ${p < 0 ? "(" + mn(p) + ")" : p}${supN(n - k)} · ${qq < 0 ? "(" + mn(qq) + ")" : qq}${supN(k)} = ${mn(e.coefs[k])}` : "?") + vis("soma dos coeficientes", passo > n ? `${mn(e.soma)} = (${mn(p + qq)})${supN(n)}` : "?");
      q("[data-v=st]").innerHTML = passo === 0 ? `Os coeficientes binomiais são a linha ${n} do triângulo (em destaque). Cada termo é: número da linha, vezes (${p === 1 ? "" : p}x) com expoente descendo de ${n} a 0, vezes ${qq < 0 ? "(" + mn(qq) + ")" : qq} com expoente subindo de 0 a ${n}. Calcule o primeiro termo antes de clicar.` : passo <= n ? `Termo ${passo}: C(${n}, ${k}) · (${p === 1 ? "" : p}x)${supN(n - k)} · ${qq < 0 ? "(" + mn(qq) + ")" : qq}${supN(k)} = ${(e.coefs[k] < 0 ? "−" : "") + mono(e.coefs[k], n - k)}. Os expoentes de x e de ${mn(qq)} somam sempre ${n}.${qq < 0 ? " Com q negativo, os sinais se alternam." : ""}` : `Pronto: ${n + 1} termos. Trocando x por 1, a soma dos coeficientes tem de dar (${mn(p)} + ${qq < 0 ? "(" + mn(qq) + ")" : qq})${supN(n)} = ${mn(e.soma)}: é um jeito rápido de conferir uma expansão.`; q("[data-v=prox]").disabled = passo > n; };
    ["p", "q", "n"].forEach((a) => q(`[data-v=${a}]`).addEventListener("input", (ev) => poe({ [a]: ev.target.value }))); q("[data-v=prox]").addEventListener("click", avanca); q("[data-v=zera]").addEventListener("click", () => poe({}));
    SIM.alBinomio._ult = { poe, est, avanca }; desenha(); };

  /* nome: "Caminhos numa grade: por que aparece C(n, k)" · matéria: Matemática · tema: BW01 */
  SIM.alCaminhos = (el, F) => { let alvo = [3, 2], r = rng(9), rota = "DDCDC";
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="outra">outro caminho até o ponto</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), L = 6, Hh = 4;
    const sorteia = () => { const [i, j] = alvo, m = [..."D".repeat(i) + "C".repeat(j)]; for (let k = m.length - 1; k > 0; k--) { const t = Math.floor(r() * (k + 1)); [m[k], m[t]] = [m[t], m[k]]; } rota = m.join(""); };
    const est = () => ({ alvo: alvo.slice(), rota, n: alvo[0] + alvo[1], k: alvo[0], caminhos: A.caminhos(alvo[0], alvo[1]), comb: A.comb(alvo[0] + alvo[1], alvo[0]) });
    const poe = (o) => { if (o.alvo) alvo = [Math.max(0, Math.min(L, o.alvo[0])), Math.max(0, Math.min(Hh, o.alvo[1]))]; if (o.semente !== undefined) r = rng(o.semente); sorteia(); desenha(); };
    const desenha = () => { const e = est(), [i, j] = alvo;
      q("[data-v=pal]").innerHTML = A.gradeFig(L, Hh, null, { rota, alvo, nums: (a, b) => A.caminhos(a, b), c: 46 });
      q("[data-v=lt]").innerHTML = vis("ponto", `${i} para a direita, ${j} para cima`) + vis("um caminho", rota || "(parado)") + vis("caminhos até ele", e.caminhos) + vis(`C(${e.n}, ${e.k})`, e.comb);
      q("[data-v=st]").innerHTML = i + j === 0 ? `Clique num ponto da grade.` : `Cada ponto mostra quantos caminhos chegam nele saindo do canto de baixo, à esquerda, e andando só para a direita (D) ou para cima (C). Até o ponto escolhido, todo caminho tem ${e.n} passos, dos quais ${i} são D: escolher um caminho é escolher <b>em quais</b> dos ${e.n} passos se vai para a direita. São C(${e.n}, ${e.k}) = ${e.comb} escolhas. E cada número é a soma do vizinho da esquerda com o de baixo: a relação de Stifel de novo.`;
      el.querySelectorAll("[data-p]").forEach((g) => g.addEventListener("click", () => { const [a, b] = g.dataset.p.split(",").map(Number); poe({ alvo: [a, b] }); })); };
    q("[data-v=outra]").addEventListener("click", () => { sorteia(); desenha(); });
    SIM.alCaminhos._ult = { poe, est, outra: () => { sorteia(); desenha(); } }; desenha(); };

  /* ---------- NCP01 ---------- */
  /* núcleo de complexos: um complexo é [a, b] = a + bi, com a e b números comuns (inteiros nos temas) */
  const cx = (A.cx = {});
  cx.soma = (z, w) => [z[0] + w[0], z[1] + w[1]]; cx.sub = (z, w) => [z[0] - w[0], z[1] - w[1]];
  cx.mul = (z, w) => [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]];
  cx.conj = (z) => [z[0], -z[1]]; cx.mod2 = (z) => z[0] * z[0] + z[1] * z[1]; cx.ig = (z, w) => z[0] === w[0] && z[1] === w[1];
  cx.pot = (z, n) => { let r = [1, 0]; for (let k = 0; k < n; k++) r = cx.mul(r, z); return r; };
  /* iⁿ para qualquer inteiro n (inclusive negativo): depende só do resto de n por 4 */
  cx.ipot = (n) => [[1, 0], [0, 1], [-1, 0], [0, -1]][((n % 4) + 4) % 4];
  /* escrita de a + bi sem "1i", sem "+ −" e sem termo nulo; em TeX (tex) e em texto (txt). Aceita frações do SIM.mb */
  const cxEscr = (z, t) => { const ehFr = (v) => typeof v === "object", val = (v) => (ehFr(v) ? M.val(v) : v), abs = (v) => (ehFr(v) ? M.fr(Math.abs(v.n), v.d) : Math.abs(v)), sh = (v) => (ehFr(v) ? (t ? M.tex(v) : M.txt(v)) : t ? String(v) : mn(v)), [a, b] = z, va = val(a), vb = val(b), me = t ? "-" : "−";
    if (vb === 0) return sh(a); const fracB = ehFr(b) && b.d !== 1, ib = Math.abs(vb) === 1 ? "i" : fracB && !t ? `(${sh(abs(b))})i` : `${sh(abs(b))}i`;
    return va === 0 ? (vb < 0 ? me : "") + ib : `${sh(a)} ${vb < 0 ? me : "+"} ${ib}`; };
  cx.tex = (z) => cxEscr(z, true); cx.txt = (z) => cxEscr(z, false);
  /* divisão exata: (a + bi)/(c + di), com frações */
  cx.div = (z, w) => { const d = cx.mod2(w), n = cx.mul(z, cx.conj(w)); return d === 0 ? null : [M.fr(n[0], d), M.fr(n[1], d)]; };
  /* plano de Argand-Gauss: o mesmo A.plano, com os eixos Re e Im e escala igual nos dois */
  A.planoC = (o, D) => A.plano({ iso: true, rx: "Re", ry: "Im", fs: [], ...o }, D);
  cx.pt = (z, o = {}) => ({ x: z[0], y: z[1], r: 5, rot: o.rot === undefined ? cx.txt(z) : o.rot, ...o });
  cx.vet = (z, cor) => ({ x1: 0, y1: 0, x2: z[0], y2: z[1], cor: cor || "var(--warn)", tr: false, w: 2.4 });

  /* nome: "Multiplicar por i é girar 90°" · matéria: Matemática · tema: NCP01 */
  SIM.alGiraI = (el, F) => { let z0 = [3, 1], n = 0;
    const sl = (k, r, v) => `<label style="font-size:13px;color:var(--ink2)">${r} <input type="range" data-v="${k}" min="-4" max="4" step="1" value="${v}" style="vertical-align:middle;width:110px"> <b data-v="${k}r" style="color:var(--ink);display:inline-block;width:24px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("a", "a", 3)}${sl("b", "b", 1)}<button class="bt peq" data-v="vez">multiplicar por i</button><button class="bt peq" data-v="zera">voltar ao começo</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const f = cx.ipot(n), z = cx.mul(z0, f); return { z0: z0.slice(), n, fator: f, z, mod2: cx.mod2(z), escalar: z0[0] * cx.mul(z0, [0, 1])[0] + z0[1] * cx.mul(z0, [0, 1])[1] }; };
    const poe = (o) => { if (o.a !== undefined) z0[0] = Math.max(-4, Math.min(4, Math.round(+o.a))); if (o.b !== undefined) z0[1] = Math.max(-4, Math.min(4, Math.round(+o.b))); n = o.n === undefined ? 0 : o.n; desenha(); };
    const vez = () => { n++; desenha(); };
    const desenha = () => { const e = est(), cores = ["var(--ok)", "var(--warn)", "var(--mod)", "var(--ink2)"], vistos = Math.min(n, 3); q("[data-v=a]").value = String(z0[0]); q("[data-v=b]").value = String(z0[1]); q("[data-v=ar]").textContent = mn(z0[0]); q("[data-v=br]").textContent = mn(z0[1]);
      const segs = [], pts = []; for (let k = 0; k <= vistos; k++) { const w = cx.mul(z0, cx.ipot(n - vistos + k)), atual = k === vistos; segs.push({ ...cx.vet(w, atual ? "var(--warn)" : "var(--ink3)"), w: atual ? 3 : 1.6, tr: atual ? false : undefined }); pts.push(cx.pt(w, { cor: atual ? "var(--warn)" : "var(--ink3)", r: atual ? 5 : 3.5, rot: atual ? cx.txt(w) : "" })); }
      q("[data-v=pal]").innerHTML = A.planoC({ x: [-6, 6], y: [-5, 5], h: 300, segs, pts, circs: cx.mod2(z0) ? [{ x: 0, y: 0, r: Math.sqrt(cx.mod2(z0)) }] : [] });
      q("[data-v=lt]").innerHTML = vis("z", cx.txt(z0)) + vis("vezes multiplicado por i", n) + vis(`i${supN(n)}`, cx.txt(e.fator)) + vis(`z · i${supN(n)}`, cx.txt(e.z));
      q("[data-v=st]").innerHTML = cx.mod2(z0) === 0 ? `O zero não sai do lugar: 0 · i = 0. Escolha outro z.` : n === 0 ? `O ponto laranja é z = ${cx.txt(z0)}: parte real no eixo horizontal, parte imaginária no vertical. Antes de clicar: para onde ele vai quando for multiplicado por i?` : `(${cx.txt(cx.mul(z0, cx.ipot(n - 1)))}) · i = ${cx.txt(e.z)}: o ponto girou 90° no sentido anti-horário, sem mudar a distância até a origem (continua na circunferência tracejada). ${n % 4 === 0 ? "Quatro giros de 90° dão uma volta inteira: i⁴ = 1, e o ponto voltou ao começo." : n % 4 === 2 ? "Dois giros de 90° são meia-volta: i² = −1, e o ponto está no oposto de z." : "Mais dois cliques e ele chega ao lado oposto."}`; };
    q("[data-v=a]").addEventListener("input", (ev) => poe({ a: ev.target.value })); q("[data-v=b]").addEventListener("input", (ev) => poe({ b: ev.target.value })); q("[data-v=vez]").addEventListener("click", vez); q("[data-v=zera]").addEventListener("click", () => poe({}));
    SIM.alGiraI._ult = { poe, est, vez }; desenha(); };

  /* nome: "Para onde vão as raízes quando Δ fica negativo" · matéria: Matemática · tema: NCP01 */
  SIM.alDeltaNeg = (el, F) => { let b = -4, c = 3;
    const sl = (k, r, lo, hi, v) => `<label style="font-size:13px;color:var(--ink2)">${r} <input type="range" data-v="${k}" min="${lo}" max="${hi}" step="1" value="${v}" style="vertical-align:middle;width:150px"> <b data-v="${k}r" style="color:var(--ink);display:inline-block;width:24px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("b", "b", -6, 6, -4)}${sl("c", "c", -4, 13, 3)}</div></div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><div class="palco" data-v="p1" style="flex:1 1 300px;padding:6px 0"></div><div class="palco" data-v="p2" style="flex:1 1 300px;padding:6px 0"></div></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    /* x² + bx + c = 0: raízes (−b ± √Δ)/2; com Δ < 0, −b/2 ± i·√(−Δ)/2 */
    const est = () => { const d = b * b - 4 * c, re = -b / 2, rz = Math.sqrt(Math.abs(d)) / 2, r = d >= 0 ? [[re + rz, 0], [re - rz, 0]] : [[re, rz], [re, -rz]], ex = M.quad(1, b, c); return { b, c, delta: d, raizes: r, soma: r[0][0] + r[1][0], produto: d >= 0 ? r[0][0] * r[1][0] : re * re + rz * rz, tipo: d > 0 ? "duas reais" : d === 0 ? "uma real (dupla)" : "duas complexas", exato: ex }; };
    const poe = (o) => { if (o.b !== undefined) b = Math.max(-6, Math.min(6, Math.round(+o.b))); if (o.c !== undefined) c = Math.max(-4, Math.min(13, Math.round(+o.c))); desenha(); };
    const escr = (e) => { if (e.delta >= 0) return e.raizes.map((r) => F.nt(r[0], 2)).filter((v, i, l) => l.indexOf(v) === i).join(" e "); const s = M.raiz(-e.delta), im = s.m === 1 ? M.txt(M.fr(s.k, 2)) : null, re = M.txt(M.fr(-b, 2)); return im ? `${re === "0" ? "" : re + " "}± ${im === "1" ? "" : im}i` : `${re === "0" ? "" : re + " "}± ${F.nt(e.raizes[0][1], 2)}i`; };
    const desenha = () => { const e = est(); q("[data-v=b]").value = String(b); q("[data-v=c]").value = String(c); q("[data-v=br]").textContent = mn(b); q("[data-v=cr]").textContent = mn(c);
      q("[data-v=p1]").innerHTML = A.plano({ x: [-6, 6], y: [-6, 14], h: 300, py: 2, px: 2, fs: [{ f: (x) => x * x + b * x + c, cor: "var(--ok)" }], pts: e.delta >= 0 ? e.raizes.map((r) => ({ x: r[0], y: 0, r: 5 })) : [], sub: `y = ${M.polTxt([1, b, c])}` });
      q("[data-v=p2]").innerHTML = A.planoC({ x: [-6, 6], y: [-4.5, 4.5], h: 300, px: 2, py: 2, pts: e.raizes.map((r) => ({ x: r[0], y: r[1], r: 5 })), segs: e.delta < 0 ? [{ x1: e.raizes[0][0], y1: e.raizes[0][1], x2: e.raizes[1][0], y2: e.raizes[1][1] }] : [], sub: "as raízes no plano complexo" });
      q("[data-v=lt]").innerHTML = vis("Δ = b² − 4c", mn(e.delta)) + vis("raízes", escr(e)) + vis("tipo", e.tipo) + vis("soma ; produto", `${F.nt(e.soma, 2)} ; ${F.nt(e.produto, 2)}`);
      q("[data-v=st]").innerHTML = e.delta > 0 ? `Δ positivo: a parábola corta o eixo x em dois pontos, e as duas raízes estão no eixo real do plano da direita. Aumente c devagar e veja as duas se aproximarem.` : e.delta === 0 ? `Δ = 0: a parábola encosta no eixo x, e as duas raízes se encontraram num ponto só. Aumente c mais um pouco.` : `Δ negativo: a parábola não toca o eixo x, e as raízes <b>não sumiram</b>: saíram do eixo real, uma para cima e outra para baixo, na mesma vertical (parte real −b/2 = ${F.nt(-b / 2, 2)}). São conjugadas: ${escr(e)}. A soma continua −b = ${mn(-b)} e o produto continua c = ${mn(c)}.`; };
    q("[data-v=b]").addEventListener("input", (ev) => poe({ b: ev.target.value })); q("[data-v=c]").addEventListener("input", (ev) => poe({ c: ev.target.value }));
    SIM.alDeltaNeg._ult = { poe, est }; desenha(); };

  /* nome: "Quanto vale iⁿ? Treino contra o ciclo de 4" · matéria: Matemática · tema: NCP01 */
  SIM.alCicloI = (el, F) => { let r = rng(12), n = 23, pontos = 0, feitas = 0, resp = null;
    const OPS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts" data-v="ops"></div></div><div><div class="bts"><button class="bt peq" data-v="novo">outro expoente</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => ({ n, resto: ((n % 4) + 4) % 4, certa: ((n % 4) + 4) % 4, valor: cx.ipot(n), pontos, feitas, resp });
    const novo = () => { n = 10 + Math.floor(r() * 990); if (r() < 0.2) n = -n; resp = null; desenha(); };
    const responde = (k) => { if (resp !== null) return; resp = k; feitas++; if (k === est().certa) pontos++; desenha(); };
    const desenha = () => { const e = est();
      q("[data-v=ops]").innerHTML = OPS.map((z, k) => `<button class="bt peq" data-k="${k}" ${resp !== null ? "disabled" : ""} style="${resp !== null && k === e.certa ? "border-color:var(--ok);color:var(--ok)" : resp === k ? "border-color:var(--bad, #e06c75);color:var(--bad, #e06c75)" : ""}">${cx.txt(z)}</button>`).join("");
      q("[data-v=pal]").innerHTML = `<div style="text-align:center;font-size:30px;font-weight:700;padding:14px 0;color:var(--ink)">i${supN(Math.abs(n)).replace(/^/, n < 0 ? "⁻" : "")} = ?</div>`;
      q("[data-v=lt]").innerHTML = vis("expoente", mn(n)) + vis("resto na divisão por 4", resp === null ? "?" : e.resto) + vis("acertos", `${pontos} de ${feitas}`);
      q("[data-v=st]").innerHTML = resp === null ? `Só os dois últimos algarismos do expoente importam para o resto por 4 (porque 100 é múltiplo de 4).${n < 0 ? " Expoente negativo: some múltiplos de 4 até ficar positivo; o valor não muda, porque i⁴ = 1." : ""}` : `${resp === e.certa ? "Certo." : "Não."} ${mn(n)} deixa resto ${e.resto} na divisão por 4, então i${supN(Math.abs(n)).replace(/^/, n < 0 ? "⁻" : "")} = i${supN(e.resto)} = ${cx.txt(e.valor)}.`;
      el.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => responde(+b.dataset.k))); };
    q("[data-v=novo]").addEventListener("click", novo);
    SIM.alCicloI._ult = { est, novo, responde, semente: (s) => { r = rng(s); novo(); }, poe: (o) => { n = o.n; resp = null; desenha(); } }; desenha(); };

  /* ---------- NCP02 ---------- */
  const slC = (k, r, v, lo = -5, hi = 5) => `<label style="font-size:13px;color:var(--ink2)">${r} <input type="range" data-v="${k}" min="${lo}" max="${hi}" step="1" value="${v}" style="vertical-align:middle;width:92px"> <b data-v="${k}r" style="color:var(--ink);display:inline-block;width:22px"></b></label>`;
  const lim = (v, lo = -5, hi = 5) => Math.max(lo, Math.min(hi, Math.round(+v)));
  const par = (z) => `(${cx.txt(z)})`;

  /* nome: "Soma e subtração: a regra do paralelogramo" · matéria: Matemática · tema: NCP02 */
  SIM.alSomaC = (el, F) => { let z = [3, 1], w = [1, 3], op = "soma";
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${slC("a", "z: a", 3)}${slC("b", "b", 1)}${slC("c", "w: c", 1)}${slC("d", "d", 3)}<button class="bt peq" data-o="soma">z + w</button><button class="bt peq" data-o="sub">z − w</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const r = op === "soma" ? cx.soma(z, w) : cx.sub(z, w); return { z: z.slice(), w: w.slice(), op, r, dist2: cx.mod2(cx.sub(z, w)) }; };
    const poe = (o) => { if (o.z) z = o.z.map((v) => lim(v)); if (o.w) w = o.w.map((v) => lim(v)); if (o.op) op = o.op; desenha(); };
    const desenha = () => { const e = est(), mw = [-w[0], -w[1]], outro = op === "soma" ? w : mw; [["a", z[0]], ["b", z[1]], ["c", w[0]], ["d", w[1]]].forEach(([k, v]) => { q(`[data-v=${k}]`).value = String(v); q(`[data-v=${k}r]`).textContent = mn(v); });
      el.querySelectorAll("[data-o]").forEach((b) => b.classList.toggle("on", b.dataset.o === op));
      q("[data-v=pal]").innerHTML = A.planoC({ x: [-14, 14], y: [-10.5, 10.5], h: 330, px: 2, py: 2, segs: [{ x1: z[0], y1: z[1], x2: e.r[0], y2: e.r[1] }, { x1: outro[0], y1: outro[1], x2: e.r[0], y2: e.r[1] }, cx.vet(z, "var(--ok)"), cx.vet(w, "var(--mod)"), ...(op === "sub" ? [{ ...cx.vet(mw, "var(--mod)"), tr: undefined, w: 1.6 }] : []), { ...cx.vet(e.r), w: 3 }], pts: [cx.pt(z, { cor: "var(--ok)", rot: "z" }), cx.pt(w, { cor: "var(--mod)", rot: "w" }), ...(op === "sub" ? [cx.pt(mw, { cor: "var(--mod)", rot: "−w", r: 3.5 })] : []), cx.pt(e.r, { rot: op === "soma" ? "z + w" : "z − w" })] });
      q("[data-v=lt]").innerHTML = vis("z", cx.txt(z)) + vis("w", cx.txt(w)) + vis(op === "soma" ? "z + w" : "z − w", cx.txt(e.r)) + (op === "sub" ? vis("|z − w|²", e.dist2) : "");
      q("[data-v=st]").innerHTML = op === "soma" ? `Soma-se parte real com parte real e imaginária com imaginária: ${par(z)} + ${par(w)} = ${cx.txt(e.r)}. No plano, z + w é a ponta do paralelogramo de lados z e w: é a soma de vetores da física.` : `Subtrair w é somar −w, o oposto de w (o ponto tracejado): ${par(z)} − ${par(w)} = ${cx.txt(e.r)}. O tamanho de z − w é a <b>distância</b> entre os pontos z e w: aqui, √${e.dist2}.`; };
    ["a", "b", "c", "d"].forEach((k, i) => q(`[data-v=${k}]`).addEventListener("input", (ev) => { const t = [z[0], z[1], w[0], w[1]]; t[i] = ev.target.value; poe({ z: t.slice(0, 2), w: t.slice(2) }); })); el.querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => poe({ op: b.dataset.o })));
    SIM.alSomaC._ult = { poe, est }; desenha(); };

  /* nome: "Conjugado e módulo: o espelho e a distância" · matéria: Matemática · tema: NCP02 */
  SIM.alConjMod = (el, F) => { let z = [4, 3];
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${slC("a", "a", 4, -6, 6)}${slC("b", "b", 3, -6, 6)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const c = cx.conj(z), m2 = cx.mod2(z), s = M.raiz(m2); return { z: z.slice(), conj: c, mod2: m2, mod: Math.sqrt(m2), modTxt: m2 === 0 ? "0" : M.rzTxt(s.k, s.m), prod: cx.mul(z, c), soma: cx.soma(z, c), dif: cx.sub(z, c) }; };
    const poe = (o) => { if (o.z) z = o.z.map((v) => lim(v, -6, 6)); desenha(); };
    const desenha = () => { const e = est(); q("[data-v=a]").value = String(z[0]); q("[data-v=b]").value = String(z[1]); q("[data-v=ar]").textContent = mn(z[0]); q("[data-v=br]").textContent = mn(z[1]);
      q("[data-v=pal]").innerHTML = A.planoC({ x: [-12, 12], y: [-9, 9], h: 320, px: 2, py: 2, circs: e.mod2 ? [{ x: 0, y: 0, r: e.mod }] : [], segs: [{ x1: z[0], y1: z[1], x2: z[0], y2: -z[1] }, cx.vet(z, "var(--ok)"), cx.vet(e.conj, "var(--mod)")], pts: [cx.pt(z, { cor: "var(--ok)", rot: "z = " + cx.txt(z) }), ...(z[1] ? [cx.pt(e.conj, { cor: "var(--mod)", rot: "conjugado = " + cx.txt(e.conj), dy: 18 })] : [])] });
      q("[data-v=lt]").innerHTML = vis("z", cx.txt(z)) + vis("conjugado", cx.txt(e.conj)) + vis("|z|", e.modTxt) + vis("z · conjugado", cx.txt(e.prod)) + vis("z + conjugado", cx.txt(e.soma));
      q("[data-v=st]").innerHTML = z[1] === 0 ? `Um número real é o seu próprio conjugado: está em cima do espelho (o eixo real). ${e.mod2 ? "O módulo é a distância até a origem, como o valor absoluto dos reais." : ""}` : `O conjugado é o reflexo de z no eixo real: troca o sinal da parte imaginária. Os dois estão à mesma distância da origem (a circunferência tracejada): |z| = √(${mn(z[0])}² + ${z[1] < 0 ? "(" + mn(z[1]) + ")" : z[1]}²) = ${e.modTxt}. Multiplicados, dão um número real, que é o módulo ao quadrado: ${e.mod2}. Somados, dão o dobro da parte real.`; };
    q("[data-v=a]").addEventListener("input", (ev) => poe({ z: [ev.target.value, z[1]] })); q("[data-v=b]").addEventListener("input", (ev) => poe({ z: [z[0], ev.target.value] }));
    SIM.alConjMod._ult = { poe, est }; desenha(); };

  /* nome: "Divisão de complexos em quatro passos" · matéria: Matemática · tema: NCP02 */
  SIM.alDivC = (el, F) => { let r = rng(14), z = [3, 2], w = [1, -2], passo = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="novo">outra divisão</button><button class="bt peq" data-v="prox">próximo passo</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const c = cx.conj(w), n = cx.mul(z, c), d = cx.mod2(w), res = cx.div(z, w); return { z: z.slice(), w: w.slice(), passo, conj: c, num: n, den: d, res: [M.val(res[0]), M.val(res[1])], resTxt: cx.txt(res), volta: [M.val(res[0]) * w[0] - M.val(res[1]) * w[1], M.val(res[0]) * w[1] + M.val(res[1]) * w[0]] }; };
    const novo = () => { const ri = (a, b) => a + Math.floor(r() * (b - a + 1)), nzr = () => { let v; do v = ri(-4, 4); while (v === 0); return v; }; z = [ri(-5, 5), nzr()]; w = [nzr(), nzr()]; passo = 0; desenha(); };
    const avanca = () => { if (passo < 4) passo++; desenha(); };
    const desenha = () => { const e = est(), fr = (a, b) => `<span style="display:inline-block;vertical-align:middle;text-align:center"><span style="display:block;border-bottom:2px solid var(--ink);padding:0 8px 3px">${a}</span><span style="display:block;padding:3px 8px 0">${b}</span></span>`;
      const partes = [fr(cx.txt(z), cx.txt(w))]; if (passo >= 1) partes.push(fr(`${par(z)} · ${par(e.conj)}`, `${par(w)} · ${par(e.conj)}`)); if (passo >= 2) partes.push(fr(cx.txt(e.num), passo >= 3 ? e.den : `${par(w)} · ${par(e.conj)}`)); if (passo >= 4) partes.push(e.resTxt);
      q("[data-v=pal]").innerHTML = `<div style="text-align:center;font-size:17px;font-weight:650;color:var(--ink);padding:12px 0;line-height:1.3">${partes.join(' <span style="margin:0 8px">=</span> ')}</div>`;
      q("[data-v=lt]").innerHTML = vis("conjugado do denominador", passo >= 1 ? cx.txt(e.conj) : "?") + vis("numerador novo", passo >= 2 ? cx.txt(e.num) : "?") + vis("denominador novo", passo >= 3 ? e.den : "?") + vis("resultado", passo >= 4 ? e.resTxt : "?");
      q("[data-v=st]").innerHTML = ["O problema é o i no denominador. A ideia: multiplicar em cima e embaixo por um número que deixe o denominador real. Qual? Pense antes de clicar.", `Multiplique em cima e embaixo pelo <b>conjugado do denominador</b>, ${cx.txt(e.conj)}. O valor da fração não muda (é multiplicar por 1).`, `Em cima, distributiva e i² = −1: ${par(z)} · ${par(e.conj)} = ${cx.txt(e.num)}.`, `Embaixo, um número vezes o seu conjugado é o módulo ao quadrado: ${mn(w[0])}² + ${w[1] < 0 ? "(" + mn(w[1]) + ")" : w[1]}² = ${e.den}. O i sumiu do denominador.`, `Agora é só dividir a parte real e a imaginária por ${e.den}: ${e.resTxt}. Conferência: multiplique o resultado pelo denominador original e veja voltar ${cx.txt(z)}.`][passo]; q("[data-v=prox]").disabled = passo >= 4; };
    q("[data-v=novo]").addEventListener("click", novo); q("[data-v=prox]").addEventListener("click", avanca);
    SIM.alDivC._ult = { est, novo, avanca, poe: (o) => { z = o.z; w = o.w; passo = 0; desenha(); }, semente: (s) => { r = rng(s); novo(); } }; desenha(); };

  /* ---------- NCP03 ---------- */
  /* ângulos notáveis: cos g = sinal · √m / 2, com m em {0, 1, 2, 3, 4}; só múltiplos de 30° e de 45° */
  const COSM = { 0: [4, 1], 30: [3, 1], 45: [2, 1], 60: [1, 1], 90: [0, 1], 120: [1, -1], 135: [2, -1], 150: [3, -1], 180: [4, -1], 210: [3, -1], 225: [2, -1], 240: [1, -1], 270: [0, 1], 300: [1, 1], 315: [2, 1], 330: [3, 1] };
  const norm = (g) => ((g % 360) + 360) % 360, rad = (g) => (g * Math.PI) / 180;
  cx.norm = norm; cx.NOTAVEIS = Object.keys(COSM).map(Number);
  cx.cosm = (g) => COSM[norm(g)]; cx.senm = (g) => COSM[norm(g - 90)];
  /* ρ · (sinal · √m / 2) escrito de forma exata: em TeX (t = true) ou em texto */
  const termo = (rho, [m, s], t) => { if (m === 0) return { z: true, neg: false, s: "0" }; const neg = s < 0, f = m === 4 ? M.fr(rho) : M.fr(rho, 2), rz = m === 2 || m === 3 ? (t ? `\\sqrt{${m}}` : `√${m}`) : ""; let c;
    if (f.d === 1) c = (f.n === 1 && rz ? "" : String(f.n)) + rz; else c = t ? `\\dfrac{${f.n === 1 && rz ? "" : f.n}${rz}}{${f.d}}` : `${f.n === 1 && rz ? "" : f.n}${rz}/${f.d}`; return { z: false, neg, s: c, um: f.d === 1 && f.n === 1 && !rz }; };
  /* forma algébrica exata de ρ(cos g + i sen g), g notável */
  cx.exato = (rho, g, t = true) => { const a = termo(rho, cx.cosm(g), t), b = termo(rho, cx.senm(g), t), me = t ? "-" : "−", ib = b.um ? "i" : !t && /\//.test(b.s) ? `(${b.s})i` : `${b.s}i`; if (b.z) return (a.neg ? me : "") + a.s; if (a.z) return (b.neg ? me : "") + ib; return `${a.neg ? me : ""}${a.s} ${b.neg ? me : "+"} ${ib}`; };
  /* ρ cos g e ρ sen g exatos, em TeX */
  cx.cosT = (g, rho = 1) => { const a = termo(rho, cx.cosm(g), true); return (a.neg ? "-" : "") + a.s; };
  cx.senT = (g, rho = 1) => { const a = termo(rho, cx.senm(g), true); return (a.neg ? "-" : "") + a.s; };
  cx.dePolar = (rho, g) => [rho * Math.cos(rad(g)), rho * Math.sin(rad(g))];
  cx.polar = (z) => ({ rho: Math.hypot(z[0], z[1]), g: norm((Math.atan2(z[1], z[0]) * 180) / Math.PI) });
  /* as n raízes n-ésimas de ρ(cos g + i sen g): módulo ρ^(1/n), argumentos (g + 360k)/n */
  cx.raizes = (rho, g, n) => Array.from({ length: n }, (_, k) => ({ rho: Math.pow(rho, 1 / n), g: (norm(g) + 360 * k) / n }));
  cx.trigT = (rho, g) => `${rho === 1 ? "" : rho}${rho === 1 ? "" : "("}\\cos ${g}^\\circ + i\\operatorname{sen} ${g}^\\circ${rho === 1 ? "" : ")"}`;
  cx.trigS = (rho, g) => `${rho === 1 ? "" : mn(rho) + " "}(cos ${mn(g)}° + i sen ${mn(g)}°)`;
  /* arco de circunferência como uma lista de segmentos, para o A.plano */
  cx.arco = (r, g0, g1, cor) => { const n = Math.max(2, Math.ceil(Math.abs(g1 - g0) / 8)), s = []; for (let k = 0; k < n; k++) { const a = rad(g0 + ((g1 - g0) * k) / n), b = rad(g0 + ((g1 - g0) * (k + 1)) / n); s.push({ x1: r * Math.cos(a), y1: r * Math.sin(a), x2: r * Math.cos(b), y2: r * Math.sin(b), cor: cor || "var(--warn)", tr: false, w: 2 }); } return s; };
  const slG = (k, r, lo, hi, st, v, w = 130) => `<label style="font-size:13px;color:var(--ink2)">${r} <input type="range" data-v="${k}" min="${lo}" max="${hi}" step="${st}" value="${v}" style="vertical-align:middle;width:${w}px"> <b data-v="${k}r" style="color:var(--ink);display:inline-block;width:38px"></b></label>`;
  const n2 = (F, v) => F.nt(Math.abs(v) < 5e-10 ? 0 : v, 2);
  const algN = (F, z) => { const a = Math.abs(z[0]) < 5e-10 ? 0 : z[0], b = Math.abs(z[1]) < 5e-10 ? 0 : z[1]; return b === 0 ? F.nt(a, 2) : a === 0 ? `${F.nt(b, 2)}i` : `${F.nt(a, 2)} ${b < 0 ? "−" : "+"} ${F.nt(Math.abs(b), 2)}i`; };

  /* nome: "Módulo e argumento: o endereço polar de z" · matéria: Matemática · tema: NCP03 */
  SIM.alPolar = (el, F) => { let rho = 2, g = 60;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${slG("rho", "módulo ρ", 1, 5, 1, 2)}${slG("g", "argumento θ", 0, 345, 15, 60, 200)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const z = cx.dePolar(rho, g), notavel = cx.NOTAVEIS.includes(g); return { rho, g, z, notavel, exato: notavel ? cx.exato(rho, g, false) : null, quadrante: g % 90 === 0 ? "sobre um eixo" : `${Math.floor(g / 90) + 1}º` }; };
    const poe = (o) => { if (o.rho !== undefined) rho = Math.max(1, Math.min(5, Math.round(+o.rho))); if (o.g !== undefined) g = Math.max(0, Math.min(345, Math.round(+o.g / 15) * 15)); desenha(); };
    const desenha = () => { const e = est(); q("[data-v=rho]").value = String(rho); q("[data-v=g]").value = String(g); q("[data-v=rhor]").textContent = String(rho); q("[data-v=gr]").textContent = g + "°";
      q("[data-v=pal]").innerHTML = A.planoC({ x: [-8, 8], y: [-5.6, 5.6], h: 310, circs: [{ x: 0, y: 0, r: rho }], segs: [{ x1: e.z[0], y1: e.z[1], x2: e.z[0], y2: 0 }, { x1: e.z[0], y1: e.z[1], x2: 0, y2: e.z[1] }, ...cx.arco(0.8, 0, g, "var(--mod)"), cx.vet(e.z, "var(--warn)")], pts: [{ x: e.z[0], y: e.z[1], r: 5, rot: "z" }] });
      q("[data-v=lt]").innerHTML = vis("forma trigonométrica", cx.trigS(rho, g)) + vis("a = ρ cos θ", n2(F, e.z[0])) + vis("b = ρ sen θ", n2(F, e.z[1])) + vis("forma algébrica", e.exato || algN(F, e.z)) + vis("quadrante", e.quadrante);
      q("[data-v=st]").innerHTML = `O ponto z fica a distância ρ = ${rho} da origem (o módulo), na direção que faz ${g}° com o eixo real positivo, medidos no sentido anti-horário (o argumento, o arco roxo). As duas coordenadas saem do triângulo retângulo tracejado: a = ρ cos θ e b = ρ sen θ.${e.notavel ? "" : " Este ângulo não é notável: os valores estão arredondados."}`; };
    q("[data-v=rho]").addEventListener("input", (ev) => poe({ rho: ev.target.value })); q("[data-v=g]").addEventListener("input", (ev) => poe({ g: ev.target.value }));
    SIM.alPolar._ult = { poe, est }; desenha(); };

  /* nome: "Multiplicar é girar e esticar" · matéria: Matemática · tema: NCP03 */
  SIM.alProdPolar = (el, F) => { let r1 = 2, g1 = 30, r2 = 1.5, g2 = 60, op = "mul";
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${slG("r1", "|z|", 0.5, 3, 0.5, 2, 90)}${slG("g1", "arg z", 0, 345, 15, 30, 150)}${slG("r2", "|w|", 0.5, 3, 0.5, 1.5, 90)}${slG("g2", "arg w", 0, 345, 15, 60, 150)}<button class="bt peq" data-o="mul">z · w</button><button class="bt peq" data-o="div">z ÷ w</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const z = cx.dePolar(r1, g1), w = cx.dePolar(r2, g2), rr = op === "mul" ? r1 * r2 : r1 / r2, gg = norm(op === "mul" ? g1 + g2 : g1 - g2), d = w[0] * w[0] + w[1] * w[1], direto = op === "mul" ? [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]] : [(z[0] * w[0] + z[1] * w[1]) / d, (z[1] * w[0] - z[0] * w[1]) / d]; return { r1, g1, r2, g2, op, rho: rr, g: gg, z, w, res: cx.dePolar(rr, gg), direto }; };
    const poe = (o) => { const lr = (v) => Math.max(0.5, Math.min(3, Math.round(+v * 2) / 2)), lg = (v) => Math.max(0, Math.min(345, Math.round(+v / 15) * 15)); if (o.r1 !== undefined) r1 = lr(o.r1); if (o.r2 !== undefined) r2 = lr(o.r2); if (o.g1 !== undefined) g1 = lg(o.g1); if (o.g2 !== undefined) g2 = lg(o.g2); if (o.op) op = o.op; desenha(); };
    const desenha = () => { const e = est(); [["r1", r1, ""], ["g1", g1, "°"], ["r2", r2, ""], ["g2", g2, "°"]].forEach(([k, v, u]) => { q(`[data-v=${k}]`).value = String(v); q(`[data-v=${k}r]`).textContent = F.nt(v) + u; });
      el.querySelectorAll("[data-o]").forEach((b) => b.classList.toggle("on", b.dataset.o === op));
      q("[data-v=pal]").innerHTML = A.planoC({ x: [-13, 13], y: [-9.3, 9.3], h: 330, px: 2, py: 2, circs: [{ x: 0, y: 0, r: e.rho }], segs: [cx.vet(e.z, "var(--ok)"), cx.vet(e.w, "var(--mod)"), { ...cx.vet(e.res), w: 3 }, ...cx.arco(Math.min(1.6, e.rho * 0.6), 0, e.g, "var(--warn)")], pts: [{ x: e.z[0], y: e.z[1], r: 4.5, cor: "var(--ok)", rot: "z" }, { x: e.w[0], y: e.w[1], r: 4.5, cor: "var(--mod)", rot: "w" }, { x: e.res[0], y: e.res[1], r: 5, rot: op === "mul" ? "z · w" : "z ÷ w" }] });
      q("[data-v=lt]").innerHTML = vis("módulos", `${F.nt(r1)} ${op === "mul" ? "·" : "÷"} ${F.nt(r2)} = ${F.nt(e.rho, 2)}`) + vis("argumentos", `${g1}° ${op === "mul" ? "+" : "−"} ${g2}° = ${mn(op === "mul" ? g1 + g2 : g1 - g2)}°${(op === "mul" ? g1 + g2 : g1 - g2) !== e.g ? ` → ${e.g}°` : ""}`) + vis(op === "mul" ? "z · w" : "z ÷ w", algN(F, e.res));
      q("[data-v=st]").innerHTML = op === "mul" ? `No produto, os módulos se <b>multiplicam</b> e os argumentos se <b>somam</b>: multiplicar por w gira z de ${g2}° e estica (ou encolhe) ${F.nt(r2)} vez(es). Ponha |w| = 1 e veja um giro puro; ponha arg w = 0° e veja só o esticão.` : `Na divisão, os módulos se <b>dividem</b> e os argumentos se <b>subtraem</b>: dividir por w desfaz o que multiplicar por w faria (gira ${g2}° no sentido horário e divide o tamanho por ${F.nt(r2)}).`; };
    ["r1", "g1", "r2", "g2"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value }))); el.querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => poe({ op: b.dataset.o })));
    SIM.alProdPolar._ult = { poe, est }; desenha(); };

  /* nome: "As n raízes de um número complexo" · matéria: Matemática · tema: NCP03 */
  SIM.alRaizes = (el, F) => { let n = 3, rho = 8, g = 0, sel = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${slG("n", "n", 2, 8, 1, 3, 100)}${slG("rho", "|w|", 1, 16, 1, 8, 110)}${slG("g", "arg w", 0, 345, 15, 0, 150)}<button class="bt peq" data-v="prox">outra raiz</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const pot = (z, k) => { let r = [1, 0]; for (let i = 0; i < k; i++) r = [r[0] * z[0] - r[1] * z[1], r[0] * z[1] + r[1] * z[0]]; return r; };
    const est = () => { const rs = cx.raizes(rho, g, n), pts = rs.map((r) => cx.dePolar(r.rho, r.g)); return { n, rho, g, sel, raizes: rs, pts, w: cx.dePolar(rho, g), volta: pts.map((z) => pot(z, n)), soma: pts.reduce((s, z) => [s[0] + z[0], s[1] + z[1]], [0, 0]), passo: 360 / n }; };
    const poe = (o) => { if (o.n !== undefined) n = Math.max(2, Math.min(8, Math.round(+o.n))); if (o.rho !== undefined) rho = Math.max(1, Math.min(16, Math.round(+o.rho))); if (o.g !== undefined) g = Math.max(0, Math.min(345, Math.round(+o.g / 15) * 15)); sel = o.sel === undefined ? Math.min(sel, n - 1) : o.sel % n; desenha(); };
    const desenha = () => { const e = est(), r = e.raizes[0].rho; [["n", n, ""], ["rho", rho, ""], ["g", g, "°"]].forEach(([k, v, u]) => { q(`[data-v=${k}]`).value = String(v); q(`[data-v=${k}r]`).textContent = v + u; });
      q("[data-v=pal]").innerHTML = A.planoC({ x: [-3.7, 3.7], y: [-2.65, 2.65], h: 330, circs: [{ x: 0, y: 0, r }], segs: [...e.pts.map((z, k) => ({ x1: z[0], y1: z[1], x2: e.pts[(k + 1) % n][0], y2: e.pts[(k + 1) % n][1], cor: "var(--mod)", tr: false, w: 1.6 })), cx.vet(e.pts[sel]), ...cx.arco(0.45, 0, e.raizes[sel].g, "var(--warn)")], pts: e.pts.map((z, k) => ({ x: z[0], y: z[1], r: k === sel ? 5.5 : 4, cor: k === sel ? "var(--warn)" : "var(--ok)", rot: k === sel ? "k = " + k : "" })) });
      q("[data-v=lt]").innerHTML = vis("w", cx.trigS(rho, g)) + vis("módulo das raízes", `${rho}^(1/${n}) = ${F.nt(r, 3)}`) + vis(`raiz k = ${sel}`, `argumento ${F.nt(e.raizes[sel].g, 2)}°`) + vis(`ela elevada a ${n}`, algN(F, e.volta[sel])) + vis("entre vizinhas", `${F.nt(e.passo, 2)}°`);
      q("[data-v=st]").innerHTML = `São exatamente ${n} números que, elevados a ${n}, dão w. Todos têm o mesmo módulo (a raiz ${n}-ésima de ${rho}) e ficam igualmente espaçados na circunferência, de ${F.nt(e.passo, 2)}° em ${F.nt(e.passo, 2)}°: ${n === 2 ? "dois pontos opostos" : `os vértices de um polígono regular de ${n} lados`}. O primeiro argumento é o de w dividido por ${n}: ${g}° ÷ ${n} = ${F.nt(g / n, 2)}°. Elevar a ${n} multiplica o argumento por ${n}: ${F.nt(e.raizes[sel].g, 2)}° · ${n} = ${F.nt(e.raizes[sel].g * n, 2)}°, que é ${g}° mais ${sel} volta(s).`; };
    ["n", "rho", "g"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value }))); q("[data-v=prox]").addEventListener("click", () => poe({ sel: sel + 1 }));
    SIM.alRaizes._ult = { poe, est }; desenha(); };
})();
