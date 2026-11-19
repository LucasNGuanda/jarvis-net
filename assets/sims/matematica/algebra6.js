/* Matemática · módulo AL (Álgebra): binômio de Newton e números complexos (BW01, NCP01 a NCP04).
   Acrescenta a SIM.al: comb (número binomial), pascal (linhas do triângulo), binCoefs (coeficientes de (px + q)ⁿ), pascalFig (triângulo desenhado)
   e caminhos (número de caminhos numa grade).
   BW01: SIM.alPascal (o triângulo, a relação de Stifel e a paridade), SIM.alBinomio ((px + q)ⁿ termo a termo) e SIM.alCaminhos (caminhos numa grade).
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
})();
