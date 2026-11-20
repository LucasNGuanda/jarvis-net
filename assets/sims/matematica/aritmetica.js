/* Matemática · módulo AR (Aritmética): núcleo comum e laboratórios do TN01.
   SIM.ar: divs (divisores), nd (quantos divisores), sd (soma dos divisores), primo, euclides (as divisões sucessivas), bezout (x, y com ax + by = mdc),
   legendre (expoente de um primo em n!), figEuclides (retângulo cortado em quadrados) e fichas (lista de números em fichas, para figuras).
   Usa SIM.mb (mdc, mmc, fat, fatTxt, cartao, tabela) e SIM.al (vis, T, mn, ri, nz, opS, opT).
   Laboratórios: SIM.arEuclides (o algoritmo de Euclides em quadrados) e SIM.arDivisores (os divisores de n e a fatoração).
   Contas conferidas em Python (tools/matematica/confere-ar.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, R = (SIM.ar = {}), { vis, T, mn } = A;
  const CORES = ["var(--mod)", "var(--ok)", "var(--warn)", "var(--mC)", "var(--mK3)", "var(--mK5)", "var(--ink3)"];
  R.divs = (n) => { n = Math.abs(Math.round(n)); const a = [], b = []; for (let d = 1; d * d <= n; d++) if (n % d === 0) { a.push(d); if (d * d !== n) b.unshift(n / d); } return a.concat(b); };
  R.nd = (n) => M.fat(n).reduce((t, [, e]) => t * (e + 1), 1);
  R.sd = (n) => R.divs(n).reduce((t, d) => t + d, 0);
  R.primo = (n) => n >= 2 && M.fat(n).length === 1 && M.fat(n)[0][1] === 1;
  /* divisões sucessivas: [[a, b, q, r], …] até o resto 0; o mdc é o último divisor */
  R.euclides = (a, b) => { const p = []; a = Math.abs(a); b = Math.abs(b); while (b) { p.push([a, b, Math.floor(a / b), a % b]); [a, b] = [b, a % b]; } return p; };
  /* [x, y, g] com a·x + b·y = g = mdc(a, b) (Euclides estendido) */
  R.bezout = (a, b) => { let [x0, y0, x1, y1] = [1, 0, 0, 1]; while (b) { const q = Math.floor(a / b); [a, b] = [b, a - q * b]; [x0, x1] = [x1, x0 - q * x1]; [y0, y1] = [y1, y0 - q * y1]; } return [x0, y0, a]; };
  /* expoente do primo p na fatoração de n! */
  R.legendre = (n, p) => { let t = 0, k = p; while (k <= n) { t += Math.floor(n / k); k *= p; } return t; };
  /* retângulo a × b cortado em quadrados pelo algoritmo de Euclides. o = { h, semNum (não escreve os lados dos quadrados) }. Devolve { svg, quadrados } */
  R.cortes = (a, b) => { const q = []; let x = 0, y = 0, w = Math.max(a, b), h = Math.min(a, b), k = 0; while (h > 0) { const horiz = w >= h, l = horiz ? h : w, n = Math.floor((horiz ? w : h) / l); for (let i = 0; i < n; i++) { q.push({ x, y, l, k }); if (horiz) x += l; else y += l; } if (horiz) w -= n * l; else h -= n * l; k++; if (w === 0 || h === 0) break; } return q; };
  R.figEuclides = (a, b, D, o = {}) => { const W = 560, H = o.h || 200, L = Math.max(a, b), S = Math.min(a, b), e = Math.min((W - 80) / L, (H - 44) / S), x0 = (W - L * e) / 2, y0 = 14, qs = R.cortes(a, b);
    let s = qs.map((q) => `<rect x="${(x0 + q.x * e).toFixed(1)}" y="${(y0 + q.y * e).toFixed(1)}" width="${(q.l * e).toFixed(1)}" height="${(q.l * e).toFixed(1)}" rx="2" style="fill:${CORES[q.k % CORES.length]};fill-opacity:.55;stroke:var(--bg);stroke-width:1.5"/>` + (!o.semNum && q.l * e >= 20 ? T(x0 + (q.x + q.l / 2) * e, y0 + (q.y + q.l / 2) * e + 4, q.l, { f: Math.min(15, Math.max(10, q.l * e * 0.3)), w: 700 }) : "")).join("");
    s += T(W / 2, y0 + S * e + 20, o.rotL === undefined ? L : o.rotL, { f: 12, c: "var(--ink2)" }) + T(x0 - 8, y0 + (S * e) / 2 + 4, o.rotS === undefined ? S : o.rotS, { f: 12, c: "var(--ink2)", a: "end" });
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`; };
  /* fichas: números em caixinhas, uma linha (ou mais). o = { marca: [valores destacados], interroga: [índices trocados por "?"], larg } */
  R.fichas = (vals, D, o = {}) => { const W = 560, w = o.larg || Math.max(34, Math.min(64, Math.floor(500 / Math.min(vals.length, 12)) - 6)), porL = Math.max(1, Math.floor(500 / (w + 6))), linhas = Math.ceil(vals.length / porL), H = 16 + linhas * 40; let s = "";
    vals.forEach((v, i) => { const l = Math.floor(i / porL), c = i % porL, nL = Math.min(porL, vals.length - l * porL), x = (W - nL * (w + 6) + 6) / 2 + c * (w + 6), y = 8 + l * 40, m = (o.marca || []).includes(v), q = (o.interroga || []).includes(i);
      s += `<rect x="${x}" y="${y}" width="${w}" height="32" rx="7" style="fill:${m ? "color-mix(in srgb,var(--mod) 30%,var(--card2))" : "var(--card2)"};stroke:${m ? "var(--mod)" : "var(--line)"}"/>` + T(x + w / 2, y + 21, q ? "?" : mn(v), { f: String(v).length > 5 ? 11 : 14, w: 600, c: q ? "var(--warn)" : "var(--ink)" }); });
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`; };
  const sl = (k, t, lo, hi, v, w = 150) => `<label style="font-size:13px;color:var(--ink2)">${t} <input type="range" data-v="${k}" min="${lo}" max="${hi}" step="1" value="${v}" style="vertical-align:middle;width:${w}px"> <b data-r="${k}" style="color:var(--ink);display:inline-block;width:34px"></b></label>`;
  R.sl = sl;

  /* ---------- TN01 ---------- */
  /* nome: "Euclides em quadrados: o maior ladrilho que cobre o retângulo" · matéria: Matemática · tema: TN01 */
  SIM.arEuclides = (el, F) => { let a = 21, b = 15;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("a", "lado a", 1, 60, a)}${sl("b", "lado b", 1, 60, b)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const p = R.euclides(Math.max(a, b), Math.min(a, b)), g = M.mdc(a, b), cs = R.cortes(a, b); return { a, b, passos: p, mdc: g, mmc: M.mmc(a, b), quadrados: cs.length, menor: cs[cs.length - 1].l, area: cs.reduce((t, c) => t + c.l * c.l, 0), ladrilhos: (a * b) / (g * g) }; };
    const poe = (o) => { ({ a, b } = { a, b, ...o }); a = Math.max(1, Math.min(60, Math.round(+a))); b = Math.max(1, Math.min(60, Math.round(+b))); desenha(); };
    const desenha = () => { const e = est(); q("[data-v=a]").value = String(a); q("[data-v=b]").value = String(b); q("[data-r=a]").textContent = a; q("[data-r=b]").textContent = b;
      q("[data-v=pal]").innerHTML = R.figEuclides(a, b, null, { h: 250 });
      q("[data-v=lt]").innerHTML = vis("mdc", e.mdc) + vis("mmc", e.mmc) + vis("mdc × mmc", e.mdc * e.mmc) + vis("a × b", a * b);
      q("[data-v=st]").innerHTML = (e.passos.length ? "Divisões: " + e.passos.map(([x, y, k, r]) => `${x} = ${k} · ${y} + ${r}`).join("; ") + ". " : "") + `Tire do retângulo o maior quadrado que couber, quantas vezes der; com a sobra, repita. O último quadrado, de lado ${e.mdc}, é o maior que ladrilha o retângulo inteiro sem sobra (${e.ladrilhos} ladrilhos): é o mdc(${a}, ${b}). ${e.mdc === 1 ? "Aqui o mdc é 1: os dois números são primos entre si." : ""}`; };
    ["a", "b"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.arEuclides._ult = { poe, est }; desenha(); };

  /* nome: "Os divisores de n: da fatoração à contagem" · matéria: Matemática · tema: TN01 */
  SIM.arDivisores = (el, F) => { let n = 72;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("n", "n", 1, 360, n, 220)}<button class="bt peq" data-b="-">−1</button><button class="bt peq" data-b="+">+1</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const f = M.fat(n), d = R.divs(n); return { n, fat: f, divs: d, nd: d.length, formula: R.nd(n), soma: R.sd(n), primo: R.primo(n), quadrado: Number.isInteger(Math.sqrt(n)) }; };
    const poe = (o) => { ({ n } = { n, ...o }); n = Math.max(1, Math.min(360, Math.round(+n))); desenha(); };
    const desenha = () => { const e = est(); q("[data-v=n]").value = String(n); q("[data-r=n]").textContent = n;
      q("[data-v=pal]").innerHTML = R.fichas(e.divs, null, { larg: 40 });
      q("[data-v=lt]").innerHTML = vis("fatoração", n === 1 ? "1" : M.fatTxt(n)) + vis("divisores", e.nd) + vis("é primo?", e.primo ? "sim" : "não");
      q("[data-v=st]").innerHTML = n === 1 ? "O 1 tem um divisor só (ele mesmo) e não é primo: primo precisa ter exatamente dois divisores." : e.primo ? `${n} é primo: os únicos divisores são 1 e ${n}.` : `Cada divisor escolhe, para cada primo, um expoente de 0 até o da fatoração: ${e.fat.map(([p, x]) => `${x + 1} escolhas para o ${p}`).join(", ")}. Total: ${e.fat.map(([, x]) => x + 1).join(" · ")} = ${e.formula} divisores.${e.quadrado ? " A quantidade é ímpar porque " + n + " é quadrado perfeito: o divisor " + Math.sqrt(n) + " faz par com ele mesmo." : " Os divisores andam em pares de produto " + n + " (1 com " + n + ", " + e.divs[1] + " com " + n / e.divs[1] + "…)."}`; };
    q("[data-v=n]").addEventListener("input", (ev) => poe({ n: ev.target.value })); el.querySelectorAll("[data-b]").forEach((b) => b.addEventListener("click", () => poe({ n: n + (b.dataset.b === "+" ? 1 : -1) })));
    SIM.arDivisores._ult = { poe, est }; desenha(); };
})();
