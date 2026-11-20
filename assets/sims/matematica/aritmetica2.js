/* Matemática · módulo AR (Aritmética): laboratórios do TN02 (indução), TN03 (aritmética modular) e BN01 (bases de numeração).
   Acrescenta ao núcleo SIM.ar: IND (afirmações para testar caso a caso), potmod, inverso, relogio (figura do "relógio" de restos), base/deBase (mudança de base).
   Contas conferidas em Python (tools/matematica/confere-ar.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, R = SIM.ar, { vis, T, mn } = A, sl = R.sl;
  const fatBig = (n) => { let f = 1n; for (let i = 2n; i <= BigInt(n); i++) f *= i; return f; };
  const pt = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, " "), SUPN = (n) => String(n).split("").map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]).join(""); R.sup = SUPN;

  /* ---------- TN02 ---------- */
  /* afirmações sobre n: e(n) = lado esquerdo, d(n) = lado direito, rel = como comparar. "vale" diz a partir de onde é verdadeira (null = falha em algum ponto). */
  R.IND = [
    { id: "soma", nome: "1 + 2 + … + n = n(n + 1)/2", e: (n) => { let s = 0n; for (let k = 1n; k <= BigInt(n); k++) s += k; return s; }, d: (n) => (BigInt(n) * BigInt(n + 1)) / 2n, rel: "=", min: 1, max: 60, vale: 1 },
    { id: "impares", nome: "1 + 3 + … + (2n − 1) = n²", e: (n) => { let s = 0n; for (let k = 1n; k <= BigInt(n); k++) s += 2n * k - 1n; return s; }, d: (n) => BigInt(n) ** 2n, rel: "=", min: 1, max: 60, vale: 1 },
    { id: "quadrados", nome: "1² + 2² + … + n² = n(n + 1)(2n + 1)/6", e: (n) => { let s = 0n; for (let k = 1n; k <= BigInt(n); k++) s += k * k; return s; }, d: (n) => (BigInt(n) * BigInt(n + 1) * BigInt(2 * n + 1)) / 6n, rel: "=", min: 1, max: 60, vale: 1 },
    { id: "pot", nome: "2ⁿ > n²", e: (n) => 2n ** BigInt(n), d: (n) => BigInt(n) ** 2n, rel: ">", min: 1, max: 30, vale: 5 },
    { id: "fat", nome: "n! > 2ⁿ", e: (n) => fatBig(n), d: (n) => 2n ** BigInt(n), rel: ">", min: 1, max: 25, vale: 4 },
    { id: "primo", nome: "n² + n + 41 é primo", e: (n) => BigInt(n * n + n + 41), d: () => null, rel: "primo", min: 0, max: 45, vale: null },
  ];
  R.indVale = (a, n) => (a.rel === "=" ? a.e(n) === a.d(n) : a.rel === ">" ? a.e(n) > a.d(n) : R.primo(Number(a.e(n))));

  /* nome: "Dominós: a base derruba o primeiro, o passo derruba o seguinte" · matéria: Matemática · tema: TN02 */
  SIM.arDomino = (el, F) => { let n = 14, base = true, falha = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-b="base" aria-pressed="true">empurrar o primeiro (base)</button>${sl("f", "o passo falha depois da peça", 0, 14, 0, 160)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const caem = !base ? 0 : falha === 0 ? n : Math.min(n, falha); return { n, base, falha, caem, todas: caem === n }; };
    const poe = (o) => { ({ base, falha } = { base, falha, ...o }); base = !!base; falha = Math.max(0, Math.min(n, Math.round(+falha))); desenha(); };
    const desenha = () => { const e = est(); q("[data-b=base]").setAttribute("aria-pressed", base); q("[data-v=f]").value = String(falha); q("[data-r=f]").textContent = falha === 0 ? "nunca" : falha;
      let s = `<line x1="30" y1="150" x2="530" y2="150" style="stroke:var(--ink3)"/>`; for (let k = 1; k <= n; k++) { const x = 14 + k * 31, caiu = k <= e.caem, vao = falha && k === falha;
        s += caiu ? `<g transform="rotate(62 ${x + 5} 150)"><rect x="${x}" y="78" width="10" height="72" rx="2" style="fill:var(--mod)"/></g>` : `<rect x="${x}" y="78" width="10" height="72" rx="2" style="fill:var(--card2);stroke:var(--ink3)"/>`;
        s += T(x + 5, 170, k, { f: 11, c: "var(--ink3)" }); if (vao && k < n) s += T(x + 21, 68, "✕", { f: 16, c: "var(--bad)", w: 700 }); }
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 180" style="width:100%;max-width:560px;display:block;margin:0 auto">${s}</svg>`;
      q("[data-v=lt]").innerHTML = vis("peças", n) + vis("caíram", e.caem) + vis("todas?", e.todas ? "sim" : "não");
      q("[data-v=st]").innerHTML = !base ? "Sem a base nada acontece: o passo garante que cada peça derruba a seguinte, mas ninguém derrubou a primeira. Passo sem base não prova nada." : falha === 0 ? "Base (a 1ª cai) e passo (toda peça que cai derruba a seguinte): caem todas, por mais comprida que seja a fila. É exatamente a indução: P(1) e, para todo k, P(k) ⇒ P(k + 1)." : `A peça ${falha} cai, mas não alcança a ${Math.min(n, falha + 1)}: o passo falhou num ponto só, e daí em diante nada está garantido. O passo precisa valer para TODO k, não para "quase todo".`; };
    q("[data-b=base]").addEventListener("click", () => poe({ base: !base })); q("[data-v=f]").addEventListener("input", (ev) => poe({ falha: ev.target.value }));
    SIM.arDomino._ult = { poe, est }; desenha(); };

  /* nome: "Testar não é provar: confira a afirmação caso a caso" · matéria: Matemática · tema: TN02 */
  SIM.arTesta = (el, F) => { let id = "soma", n = 6;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts escolha">${R.IND.map((a) => `<button class="bt peq" data-a="${a.id}" aria-pressed="${a.id === id}">${a.nome}</button>`).join("")}</div><div class="bts" style="margin-top:8px">${sl("n", "n", 0, 60, n, 260)}</div></div></div><div class="leitor" data-v="lt"></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), af = () => R.IND.find((a) => a.id === id);
    const est = () => { const a = af(), ok = R.indVale(a, n), falhas = []; for (let k = a.min; k <= a.max; k++) if (!R.indVale(a, k)) falhas.push(k); return { id, n, esq: String(a.e(n)), dir: a.d(n) === null ? null : String(a.d(n)), ok, falhas, min: a.min, max: a.max }; };
    const poe = (o) => { ({ id, n } = { id, n, ...o }); const a = af(); n = Math.max(a.min, Math.min(a.max, Math.round(+n))); desenha(); };
    const desenha = () => { const a = af(), e = est(), sn = q("[data-v=n]"); sn.min = a.min; sn.max = a.max; sn.value = String(n); q("[data-r=n]").textContent = n; el.querySelectorAll("[data-a]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.a === id));
      q("[data-v=lt]").innerHTML = (a.rel === "primo" ? vis("n² + n + 41", pt(e.esq)) + vis("fatoração", M.fatTxt(Number(e.esq))) : vis("lado esquerdo", pt(e.esq)) + vis("lado direito", pt(e.dir))) + vis(`vale para n = ${n}?`, e.ok ? "sim" : "não");
      const vals = []; for (let k = a.min; k <= a.max; k++) vals.push(k);
      q("[data-v=pal]").innerHTML = R.fichas(vals, null, { larg: 30, marca: vals.filter((k) => !R.indVale(a, k)) });
      q("[data-v=st]").innerHTML = a.rel === "primo" ? `De n = 0 a n = 39 o resultado é primo, quarenta vezes seguidas. Em n = 40 dá 1681 = 41 · 41, e em n = 41 dá 1763 = 41 · 43. <b>Quarenta casos certos não provam nada.</b> As fichas marcadas são os valores de n em que a afirmação falha.` : e.falhas.length ? `A afirmação falha em n = ${e.falhas.join(", ")} e vale daí em diante: a base da indução, neste caso, é n = ${a.vale}, não n = 1. As fichas marcadas são as falhas.` : `Vale em todos os ${a.max - a.min + 1} valores testados. Isso é um bom sinal, mas ainda não é uma prova: a prova é a indução, que cobre os infinitos casos de uma vez.`; };
    el.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => poe({ id: b.dataset.a }))); q("[data-v=n]").addEventListener("input", (ev) => poe({ n: ev.target.value }));
    SIM.arTesta._ult = { poe, est }; desenha(); };

  /* ---------- TN03 ---------- */
  R.mod = (a, m) => ((a % m) + m) % m;
  R.potmod = (a, e, m) => { let r = 1 % m, b = R.mod(a, m); while (e > 0) { if (e % 2) r = (r * b) % m; b = (b * b) % m; e = Math.floor(e / 2); } return r; };
  /* inverso de a módulo m (null se não existe) */
  R.inverso = (a, m) => { const [x, , g] = R.bezout(R.mod(a, m), m); return g === 1 ? R.mod(x, m) : null; };
  /* potências sucessivas a¹, a², … módulo m até repetir: { lista, pre (quantas antes de entrar no ciclo), periodo } */
  R.ciclo = (a, m) => { const visto = new Map(), lista = []; let v = R.mod(a, m), k = 1; while (!visto.has(v)) { visto.set(v, k); lista.push(v); v = (v * R.mod(a, m)) % m; k++; } return { lista, pre: visto.get(v) - 1, periodo: k - visto.get(v) }; };
  /* relógio de m marcas; o = { marca: [restos destacados], seta: [de, para], h } */
  R.relogio = (m, D, o = {}) => { const W = 560, H = o.h || 220, cx = W / 2, cy = H / 2, r = H / 2 - 28, P = (k, q = r) => [cx + q * Math.sin((2 * Math.PI * k) / m), cy - q * Math.cos((2 * Math.PI * k) / m)]; let s = `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:none;stroke:var(--line2);stroke-width:2"/>`;
    for (let k = 0; k < m; k++) { const [x, y] = P(k), [tx, ty] = P(k, r + 15), on = (o.marca || []).includes(k); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${on ? 7 : 4}" style="fill:${on ? "var(--mod)" : "var(--ink3)"}"/>` + (m <= 24 ? T(tx, ty + 4, k, { f: 11, c: on ? "var(--ink)" : "var(--ink3)", w: on ? 700 : 500 }) : ""); }
    if (o.seta) { const [x1, y1] = P(o.seta[0], r - 12), [x2, y2] = P(o.seta[1], r - 12); s += `<line x1="${cx}" y1="${cy}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" style="stroke:var(--ink3);stroke-width:2;stroke-dasharray:4 4"/><line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" style="stroke:var(--warn);stroke-width:3;stroke-linecap:round"/><circle cx="${cx}" cy="${cy}" r="4" style="fill:var(--ink2)"/>`; }
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`; };

  /* nome: "O relógio de restos: somar e multiplicar dando voltas" · matéria: Matemática · tema: TN03 */
  SIM.arRelogio = (el, F) => { let m = 12, a = 9, b = 7, op = "+";
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("m", "módulo m", 2, 24, m, 130)}${sl("a", "a", 0, 99, a, 130)}${sl("b", "b", 0, 99, b, 130)}</div><div class="bts escolha" style="margin-top:8px"><button class="bt peq" data-o="+" aria-pressed="true">somar</button><button class="bt peq" data-o="×" aria-pressed="false">multiplicar</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const v = op === "+" ? a + b : a * b, ra = a % m, rb = b % m, pelos = op === "+" ? (ra + rb) % m : (ra * rb) % m; return { m, a, b, op, valor: v, resto: v % m, ra, rb, pelosRestos: pelos, voltas: Math.floor(v / m) }; };
    const poe = (o) => { ({ m, a, b, op } = { m, a, b, op, ...o }); m = Math.max(2, Math.min(24, Math.round(+m))); a = Math.max(0, Math.min(99, Math.round(+a))); b = Math.max(0, Math.min(99, Math.round(+b))); if (op !== "×") op = "+"; desenha(); };
    const desenha = () => { const e = est(); ["m", "a", "b"].forEach((k) => { q(`[data-v=${k}]`).value = String({ m, a, b }[k]); q(`[data-r=${k}]`).textContent = { m, a, b }[k]; }); el.querySelectorAll("[data-o]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.o === op));
      q("[data-v=pal]").innerHTML = R.relogio(m, null, { marca: [e.resto], seta: [e.ra, e.resto], h: 240 });
      q("[data-v=lt]").innerHTML = vis(`${a} ${op} ${b}`, e.valor) + vis(`resto por ${m}`, e.resto) + vis("voltas completas", e.voltas) + vis("só com os restos", `${e.ra} ${op} ${e.rb} → ${e.pelosRestos}`);
      q("[data-v=st]").innerHTML = `${a} deixa resto ${e.ra} e ${b} deixa resto ${e.rb} na divisão por ${m}. Fazendo a conta só com os restos, ${e.ra} ${op} ${e.rb} = ${op === "+" ? e.ra + e.rb : e.ra * e.rb}, que cai na marca ${e.pelosRestos}: a mesma marca de ${a} ${op} ${b} = ${e.valor} (${e.voltas} ${e.voltas === 1 ? "volta" : "voltas"} e mais ${e.resto}). O relógio esquece as voltas e guarda só onde o ponteiro para: por isso pode-se trocar cada número pelo seu resto <b>antes</b> de somar ou multiplicar.`; };
    ["m", "a", "b"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value }))); el.querySelectorAll("[data-o]").forEach((x) => x.addEventListener("click", () => poe({ op: x.dataset.o })));
    SIM.arRelogio._ult = { poe, est }; desenha(); };

  /* nome: "O ciclo das potências: os restos se repetem" · matéria: Matemática · tema: TN03 */
  SIM.arCiclo = (el, F) => { let a = 3, m = 7, n = 100;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("a", "base a", 2, 30, a, 130)}${sl("m", "módulo m", 2, 30, m, 130)}${sl("n", "expoente n", 1, 300, n, 170)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const c = R.ciclo(a, m), pos = n <= c.pre ? n : c.pre + ((n - c.pre - 1) % c.periodo) + 1; return { a, m, n, lista: c.lista, pre: c.pre, periodo: c.periodo, pos, resto: c.lista[pos - 1], direto: R.potmod(a, n, m), coprimos: M.mdc(a, m) === 1, primo: R.primo(m) }; };
    const poe = (o) => { ({ a, m, n } = { a, m, n, ...o }); a = Math.max(2, Math.min(30, Math.round(+a))); m = Math.max(2, Math.min(30, Math.round(+m))); n = Math.max(1, Math.min(300, Math.round(+n))); desenha(); };
    const desenha = () => { const e = est(); ["a", "m", "n"].forEach((k) => { q(`[data-v=${k}]`).value = String({ a, m, n }[k]); q(`[data-r=${k}]`).textContent = { a, m, n }[k]; });
      const W = 560, w = Math.min(44, Math.floor(500 / e.lista.length)), x0 = (W - w * e.lista.length) / 2; let s = "";
      e.lista.forEach((v, i) => { const ciclo = i >= e.pre, aqui = i === e.pos - 1; s += `<rect x="${x0 + i * w + 2}" y="26" width="${w - 4}" height="34" rx="6" style="fill:${aqui ? "var(--warn)" : ciclo ? "color-mix(in srgb,var(--mod) 28%,var(--card2))" : "var(--card2)"};stroke:${ciclo ? "var(--mod)" : "var(--line)"}"/>` + T(x0 + i * w + w / 2, 48, v, { f: w < 26 ? 10 : 14, w: 700, c: aqui ? "#111" : "var(--ink)" }) + T(x0 + i * w + w / 2, 18, w < 20 ? "" : `${a}${SUPN(i + 1)}`, { f: 10, c: "var(--ink3)" }); });
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 ${W} 70" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`;
      q("[data-v=lt]").innerHTML = vis("período do ciclo", e.periodo) + vis(`resto de ${a}${SUPN(n)} por ${m}`, e.resto) + vis("mdc(a, m)", M.mdc(a, m));
      q("[data-v=st]").innerHTML = `Os restos de ${a}¹, ${a}², ${a}³… na divisão por ${m} só podem ser ${m} valores, então em algum momento repetem, e daí em diante andam em ciclo de tamanho ${e.periodo}${e.pre ? ` (depois de ${e.pre} ${e.pre === 1 ? "valor" : "valores"} de entrada)` : ""}. Para o expoente ${n}, basta saber em que casa do ciclo ele cai: a de número ${e.pos}, resto ${e.resto}. ${e.primo && e.coprimos ? `Como ${m} é primo e não divide ${a}, o pequeno teorema de Fermat garante ${a}${SUPN(m - 1)} ≡ 1: o período (${e.periodo}) divide ${m - 1}.` : !e.coprimos ? `Aqui ${a} e ${m} têm fator comum (mdc ${M.mdc(a, m)}): o resto 1 nunca aparece.` : ""}`; };
    ["a", "m", "n"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.arCiclo._ult = { poe, est }; desenha(); };
})();
