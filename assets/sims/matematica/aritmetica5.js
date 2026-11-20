/* Matemática · módulo AR (Aritmética): laboratórios da combinatória, CB01 (princípio fundamental da contagem).
   Acrescenta ao núcleo SIM.ar: fat (fatorial), arr (arranjos), cmb (combinações), prod, arvore (árvore de possibilidades em SVG),
   casas (casinhas com o número de opções de cada posição) e senha (contagem de sequências de algarismos com ou sem repetição e uma restrição).
   Contas conferidas em Python (tools/matematica/confere-ar.py) e, no teste, por enumeração de todas as sequências. */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, R = SIM.ar, { vis, T, mn } = A, sl = R.sl, nt = R.nt;
  const svg = (W, H, s, D) => (D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`);

  /* ---------- CB01 ---------- */
  R.prod = (v) => v.reduce((a, b) => a * b, 1);
  R.fat = (n) => { let f = 1; for (let k = 2; k <= n; k++) f *= k; return f; };
  R.arr = (n, k) => { if (k > n || k < 0) return 0; let f = 1; for (let j = 0; j < k; j++) f *= n - j; return f; };
  R.cmb = (n, k) => { if (k > n || k < 0) return 0; k = Math.min(k, n - k); let f = 1; for (let j = 1; j <= k; j++) f = (f * (n - k + j)) / j; return Math.round(f); };
  /* árvore de possibilidades: ns = [opções na 1ª escolha, na 2ª, …]; o = { rots: [[…], […]], tit: [títulos das etapas], h } */
  R.arvore = (ns, D, o = {}) => { const L = ns.length, folhas = R.prod(ns), W = 560, H = o.h || Math.max(150, Math.min(430, folhas * 15 + 50)), y0 = 34, y1 = H - 12, xs = Array.from({ length: L + 1 }, (_, j) => 46 + (j * 430) / L), rots = o.rots || [];
    const yF = (i) => (folhas === 1 ? (y0 + y1) / 2 : y0 + (i * (y1 - y0)) / (folhas - 1)); let s = "";
    (o.tit || []).forEach((t, j) => (s += T((xs[j] + xs[j + 1]) / 2, 14, t, { f: 10, c: "var(--ink3)" })));
    /* nó (nível j, índice i entre os nós do nível): cobre um bloco de folhas */
    const no = (j, i) => { const bloco = R.prod(ns.slice(j)), a = i * bloco, b = a + bloco - 1; return { x: xs[j], y: (yF(a) + yF(b)) / 2 }; };
    for (let j = 0; j < L; j++) { const nNos = R.prod(ns.slice(0, j)), passoY = (y1 - y0) / Math.max(1, R.prod(ns.slice(0, j + 1)) - 1 || 1); for (let i = 0; i < nNos; i++) { const p = no(j, i); for (let c = 0; c < ns[j]; c++) { const f = no(j + 1, i * ns[j] + c); s += `<line x1="${p.x}" y1="${p.y.toFixed(1)}" x2="${f.x}" y2="${f.y.toFixed(1)}" style="stroke:var(--ink3);stroke-width:1.2"/><circle cx="${f.x}" cy="${f.y.toFixed(1)}" r="${j === L - 1 ? 3.2 : 4}" style="fill:${j === L - 1 ? "var(--warn)" : "var(--mod)"}"/>`; const r = rots[j] && rots[j][c]; if (r && (R.prod(ns.slice(0, j + 1)) === 1 || passoY >= 11)) s += j === L - 1 ? T(f.x + 8, f.y + 3.5, r, { f: 10, c: "var(--ink2)", a: "start" }) : T(f.x, f.y - 7, r, { f: 10, w: 700, c: "var(--ink)" }); } } }
    s += `<circle cx="${xs[0]}" cy="${no(0, 0).y.toFixed(1)}" r="5" style="fill:var(--ink2)"/>`;
    return svg(W, H, s, D); };
  /* casinhas: vals = textos de dentro ("5", "?"); o = { rots: legenda embaixo de cada casa, ordem: número da ordem de preenchimento, total: texto depois do "=" } */
  R.vagas = (vals, D, o = {}) => { const n = vals.length, w = Math.min(64, Math.floor((o.total !== undefined ? 400 : 480) / n) - 22), W = 560, tot = n * w + (n - 1) * 22 + (o.total !== undefined ? 90 : 0), x0 = (W - tot) / 2, H = (o.rots ? 92 : 70) + (o.ordem ? 14 : 0), y = o.ordem ? 24 : 10; let s = "";
    vals.forEach((v, i) => { const x = x0 + i * (w + 22); s += `<rect x="${x}" y="${y}" width="${w}" height="46" rx="6" style="fill:var(--mod);fill-opacity:.14;stroke:var(--mod);stroke-width:1.6"/>` + T(x + w / 2, y + (String(v).length > 3 ? 28 : 30), v, { f: String(v).length > 3 ? 12 : 18, w: 700 }) + (i < n - 1 ? T(x + w + 11, y + 29, "×", { f: 15, c: "var(--ink3)" }) : "") + (o.rots && o.rots[i] ? T(x + w / 2, y + 62, o.rots[i], { f: 10, c: "var(--ink3)" }) : "") + (o.ordem ? T(x + w / 2, 14, o.ordem[i] + "ª a preencher", { f: 9, c: "var(--warn)" }) : ""); });
    if (o.total !== undefined) s += T(x0 + n * (w + 22) - 6, y + 29, "=", { f: 15, c: "var(--ink3)" }) + T(x0 + n * (w + 22) + 10, y + 30, o.total, { f: 18, w: 700, c: "var(--warn)", a: "start" });
    return svg(W, H, s, D); };
  /* sequências de k algarismos tirados de 0 … n − 1. rep: pode repetir; restr: "nenhuma" | "zero" (não começa com 0) | "par" (termina em algarismo par).
     Devolve as opções de cada casa (da esquerda para a direita), a ordem de preenchimento e o total. */
  R.senha = (n, k, rep, restr) => { const pares = Math.ceil(n / 2); let casas, ordem;
    if (restr === "par") { const resto = Array.from({ length: k - 1 }, (_, j) => (rep ? n : Math.max(0, n - 1 - j))); casas = resto.concat([pares]); ordem = resto.map((_, j) => j + 2).concat([1]); }
    else if (restr === "zero") { casas = Array.from({ length: k }, (_, j) => (j === 0 ? n - 1 : rep ? n : Math.max(0, n - j))); ordem = casas.map((_, j) => j + 1); }
    else { casas = Array.from({ length: k }, (_, j) => (rep ? n : Math.max(0, n - j))); ordem = casas.map((_, j) => j + 1); }
    return { casas, ordem, total: R.prod(casas) }; };

  /* nome: "Árvore de possibilidades: cada escolha multiplica os galhos" · matéria: Matemática · tema: CB01 */
  SIM.arArvore = (el, F) => { let a = 2, b = 3, c = 1;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("a", "opções na 1ª escolha", 1, 4, a, 110)}${sl("b", "na 2ª escolha", 1, 4, b, 110)}${sl("c", "na 3ª escolha", 1, 3, c, 110)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), L1 = ["A", "B", "C", "D"], L2 = ["1", "2", "3", "4"], L3 = ["x", "y", "z"];
    const est = () => ({ a, b, c, total: a * b * c, folhas: el.querySelectorAll("[data-v=pal] circle[r='3.2']").length, soma: a + b + c });
    const poe = (o) => { ({ a, b, c } = { a, b, c, ...o }); a = Math.max(1, Math.min(4, Math.round(+a))); b = Math.max(1, Math.min(4, Math.round(+b))); c = Math.max(1, Math.min(3, Math.round(+c))); desenha(); };
    const desenha = () => { ["a", "b", "c"].forEach((k) => { q(`[data-v=${k}]`).value = String({ a, b, c }[k]); q(`[data-r=${k}]`).textContent = { a, b, c }[k]; });
      q("[data-v=pal]").innerHTML = R.arvore([a, b, c], null, { rots: [L1, L2, L3], tit: ["1ª escolha", "2ª escolha", "3ª escolha"] });
      q("[data-v=lt]").innerHTML = vis("conta", `${a} × ${b} × ${c}`) + vis("caminhos (pontas da árvore)", a * b * c);
      q("[data-v=st]").innerHTML = `Cada ponto da 1ª escolha abre ${b} galho${b > 1 ? "s" : ""}; cada um desses abre ${c}. No fim há ${a} × ${b} × ${c} = <b>${a * b * c}</b> pontas, uma para cada jeito de fazer as três escolhas em sequência. Repare: os galhos se <b>multiplicam</b>; somar (${a} + ${b} + ${c} = ${a + b + c}) contaria as opções soltas, não os caminhos.`; };
    ["a", "b", "c"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.arArvore._ult = { poe, est }; desenha(); };

  /* nome: "Monte a senha: casas, repetição e restrição" · matéria: Matemática · tema: CB01 */
  SIM.arSenha = (el, F) => { let n = 10, k = 3, rep = true, restr = "nenhuma"; const RS = ["nenhuma", "zero", "par"], RT = { nenhuma: "nenhuma", zero: "não começa com 0", par: "termina em algarismo par" };
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("n", "algarismos disponíveis (0 a n − 1)", 2, 10, n, 130)}${sl("k", "casas", 1, 5, k, 110)}</div><div class="bts" style="margin-top:6px"><button class="bt peq" data-b="rep"></button><button class="bt peq" data-b="restr"></button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => Object.assign({ n, k, rep, restr }, R.senha(n, k, rep, restr));
    const poe = (o) => { ({ n, k, rep, restr } = { n, k, rep, restr, ...o }); n = Math.max(2, Math.min(10, Math.round(+n))); k = Math.max(1, Math.min(5, Math.round(+k))); rep = !!rep; if (!RS.includes(restr)) restr = "nenhuma"; desenha(); };
    const desenha = () => { const e = est(); ["n", "k"].forEach((c) => { q(`[data-v=${c}]`).value = String({ n, k }[c]); q(`[data-r=${c}]`).textContent = { n, k }[c]; });
      q("[data-b=rep]").textContent = "repetir algarismo: " + (rep ? "pode" : "não pode"); q("[data-b=restr]").textContent = "restrição: " + RT[restr];
      q("[data-v=pal]").innerHTML = R.vagas(e.casas.map(String), null, { rots: e.casas.map((_, i) => i + 1 + "ª casa"), ordem: restr === "par" && k > 1 ? e.ordem : null, total: nt(e.total, 0) });
      q("[data-v=lt]").innerHTML = vis("conta", e.casas.join(" × ")) + vis("senhas possíveis", nt(e.total, 0));
      const alg = `os algarismos de 0 a ${n - 1}`;
      q("[data-v=st]").innerHTML = (restr === "par" ? `Comece pela casa que tem restrição, a <b>última</b>: só servem os pares (${Array.from({ length: Math.ceil(n / 2) }, (_, j) => 2 * j).join(", ")}), ${Math.ceil(n / 2)} opções. ` : restr === "zero" ? `A 1ª casa não aceita o 0: sobram ${n - 1} opções. ` : `Sem restrição, a 1ª casa aceita ${alg}: ${n} opções. `) + (rep ? "Como pode repetir, as outras casas continuam com todas as opções." : `Como não pode repetir, cada casa preenchida tira uma opção das seguintes${restr === "zero" && k > 1 ? " (mas a 2ª casa recebe o 0 de volta: por isso ela também tem " + (n - 1) + ")" : ""}.`) + ` Total: ${e.casas.join(" × ")} = <b>${nt(e.total, 0)}</b>.` + (e.total === 0 ? " Zero: não há algarismos suficientes para preencher sem repetir." : ""); };
    ["n", "k"].forEach((c) => q(`[data-v=${c}]`).addEventListener("input", (ev) => poe({ [c]: ev.target.value })));
    q("[data-b=rep]").addEventListener("click", () => poe({ rep: !rep })); q("[data-b=restr]").addEventListener("click", () => poe({ restr: RS[(RS.indexOf(restr) + 1) % 3] }));
    SIM.arSenha._ult = { poe, est }; desenha(); };
})();
