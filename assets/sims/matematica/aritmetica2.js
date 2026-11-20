/* Matemática · módulo AR (Aritmética): laboratórios do TN02 (indução), TN03 (aritmética modular) e BN01 (bases de numeração).
   Acrescenta ao núcleo SIM.ar: IND (afirmações para testar caso a caso), potmod, inverso, relogio (figura do "relógio" de restos), base/deBase (mudança de base).
   Contas conferidas em Python (tools/matematica/confere-ar.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, R = SIM.ar, { vis, T, mn } = A, sl = R.sl;
  const fatBig = (n) => { let f = 1n; for (let i = 2n; i <= BigInt(n); i++) f *= i; return f; };
  const pt = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

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
})();
