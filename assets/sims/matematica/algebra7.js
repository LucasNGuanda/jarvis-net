/* Matemática · módulo AL (Álgebra): polinômios, equações algébricas e introdução ao cálculo (PL01 a PL04, IC01).
   Acrescenta a SIM.al: pl (polinômios como listas de coeficientes, da maior potência para a menor: grau, val, horner, soma, sub, mul, esc, div com frações,
   deriv, deRaizes, igual), ruffiniFig (o dispositivo de Briot-Ruffini desenhado) e plGraf (gráfico com janela automática).
   PL01: SIM.alPolGraf (coeficientes, gráfico e valor numérico), SIM.alHorner (valor numérico passo a passo) e SIM.alIdentidade (ache A e B).
   Contas conferidas em Python (tools/matematica/confere-al.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, { vis, rng, mn } = A;

  /* ---------- PL01 ---------- */
  const pl = (A.pl = {});
  pl.limpa = (p) => { p = p.slice(); while (p.length > 1 && p[0] === 0) p.shift(); return p; };
  pl.grau = (p) => { p = pl.limpa(p); return p.length === 1 && p[0] === 0 ? -1 : p.length - 1; }; /* polinômio nulo: −1 (não tem grau) */
  pl.val = (p, x) => p.reduce((s, c) => s * x + c, 0);
  /* linha de baixo do Briot-Ruffini: o último número é P(x) */
  pl.horner = (p, x) => { const l = [p[0]]; for (let k = 1; k < p.length; k++) l.push(l[k - 1] * x + p[k]); return l; };
  const alinha = (p, n) => Array(n - p.length).fill(0).concat(p);
  pl.soma = (p, q) => { const n = Math.max(p.length, q.length), a = alinha(p, n), b = alinha(q, n); return pl.limpa(a.map((v, i) => v + b[i])); };
  pl.esc = (k, p) => pl.limpa(p.map((v) => k * v)); pl.sub = (p, q) => pl.soma(p, pl.esc(-1, q));
  pl.mul = (p, q) => { const r = Array(p.length + q.length - 1).fill(0); p.forEach((a, i) => q.forEach((b, j) => (r[i + j] += a * b))); return pl.limpa(r); };
  pl.pot = (p, n) => { let r = [1]; for (let k = 0; k < n; k++) r = pl.mul(r, p); return r; };
  pl.deriv = (p) => (p.length === 1 ? [0] : p.slice(0, -1).map((c, i) => c * (p.length - 1 - i)));
  pl.igual = (p, q) => { const a = pl.limpa(p), b = pl.limpa(q); return a.length === b.length && a.every((v, i) => v === b[i]); };
  pl.deRaizes = (rs, a = 1) => rs.reduce((p, r) => pl.mul(p, [1, -r]), [a]);
  /* divisão com frações exatas: P = D·Q + R, grau R < grau D. Devolve os coeficientes como frações do SIM.mb e, se todos inteiros, também como números */
  pl.div = (p, d) => { p = pl.limpa(p); d = pl.limpa(d); let r = p.map((v) => M.fr(v)); const q = [], gd = d.length - 1; if (pl.grau(d) < 0) return null;
    while (r.length - 1 >= gd && r.length) { const c = M.div(r[0], M.fr(d[0])); q.push(c); for (let i = 0; i <= gd; i++) r[i] = M.sub(r[i], M.mul(c, M.fr(d[i]))); r.shift(); }
    if (!q.length) q.push(M.fr(0)); while (r.length > 1 && M.val(r[0]) === 0) r.shift(); if (!r.length) r = [M.fr(0)];
    const int = (l) => (l.every((v) => v.d === 1) ? l.map((v) => v.n) : null); return { q, r, qi: int(q), ri: int(r) }; };
  /* escrita: inteiros pelo M.pol; frações por conta própria */
  pl.tex = (p, v = "x") => M.pol(pl.limpa(p), v); pl.txt = (p, v = "x") => M.polTxt(pl.limpa(p), v);
  pl.texF = (p, v = "x") => { let s = ""; const n = p.length - 1; p.forEach((c, i) => { const val = M.val(c); if (val === 0) return; const g = n - i, a = M.fr(Math.abs(c.n), c.d), mono = g === 0 ? M.tex(a) : (M.val(a) === 1 ? "" : M.tex(a)) + v + (g === 1 ? "" : `^{${g}}`); s += s === "" ? (val < 0 ? "-" : "") + mono : (val < 0 ? " - " : " + ") + mono; }); return s === "" ? "0" : s; };
  /* gráfico com janela automática em y (ou a que for pedida) */
  pl.graf = (p, D, o = {}) => { const x = o.x || [-4, 4], vs = Array.from({ length: 81 }, (_, k) => pl.val(p, x[0] + ((x[1] - x[0]) * k) / 80)), L = o.L || Math.min(40, Math.max(4, ...vs.map(Math.abs).sort((a, b) => a - b).slice(0, 60))) * 1.15; return A.plano({ x, y: o.y || [-L, L], h: o.h || 230, py: Math.max(1, Math.ceil(L / 5)), fs: [{ f: (t) => pl.val(p, t), cor: o.cor || "var(--ok)" }, ...(o.fs || [])], pts: o.pts || [], segs: o.segs || [], sub: o.sub }, D); };
  /* dispositivo de Briot-Ruffini: a | coeficientes ; embaixo, a linha de resultados (o.ate: quantos já aparecem; os outros viram "?"); a última casa é o resto */
  A.ruffiniFig = (p, a, D, o = {}) => { const n = p.length, cw = o.cw || 52, ch = 30, x0 = (560 - (n + 1) * cw) / 2, l = pl.horner(p, a), ate = o.ate === undefined ? n : o.ate, sh = (v) => (typeof v === "number" ? mn(v) : v); let s = "";
    s += A.T(x0 + cw / 2, 14 + ch / 2 + 5, o.semA ? "?" : sh(a), { w: 700, f: 15, c: "var(--warn)" }) + `<line x1="${x0 + cw}" y1="8" x2="${x0 + cw}" y2="${14 + 2 * ch}" style="stroke:var(--ink);stroke-width:2"/><line x1="${x0 + cw}" y1="${14 + ch}" x2="${x0 + (n + 1) * cw}" y2="${14 + ch}" style="stroke:var(--ink);stroke-width:2"/>`;
    p.forEach((c, i) => { s += A.T(x0 + (i + 1.5) * cw, 14 + ch / 2 + 5, sh(c), { f: 14, w: 600 }); const ult = i === n - 1, mostra = i < ate; if (ult) s += `<rect x="${x0 + (i + 1) * cw + 6}" y="${14 + ch + 5}" width="${cw - 12}" height="${ch - 8}" rx="5" style="fill:${mostra ? "var(--warn)" : "var(--card2)"};opacity:${mostra ? 0.3 : 1};stroke:var(--line)"/>`; s += A.T(x0 + (i + 1.5) * cw, 14 + ch + ch / 2 + 6, mostra ? sh(l[i]) : "?", { f: 14, w: ult ? 700 : 600, c: i === o.dest ? "var(--warn)" : "var(--ink)" }); });
    if (o.sub) s += A.T(280, 14 + 2 * ch + 18, o.sub, { f: 12, c: "var(--ink2)" }); const H = 14 + 2 * ch + (o.sub ? 26 : 8);
    return D ? D.svg(560, H, s, "figura") : `<svg viewBox="0 0 560 ${H}" width="100%" style="max-width:560px">${s}</svg>`; };
  pl.sorteia = (r, g, lo = -4, hi = 4) => { const p = Array.from({ length: g + 1 }, () => lo + Math.floor(r() * (hi - lo + 1))); if (p[0] === 0) p[0] = 1; return p; };
  const slP = (k, r, v, lo, hi, st = 1, w = 86) => `<label style="font-size:13px;color:var(--ink2)">${r} <input type="range" data-v="${k}" min="${lo}" max="${hi}" step="${st}" value="${v}" style="vertical-align:middle;width:${w}px"> <b data-v="${k}r" style="color:var(--ink);display:inline-block;width:26px"></b></label>`;
  const supP = (n) => String(n).split("").map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]).join("");

  /* nome: "Coeficientes, gráfico e valor numérico" · matéria: Matemática · tema: PL01 */
  SIM.alPolGraf = (el, F) => { let p = [1, 0, -3, 1], x0 = 2;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${[3, 2, 1, 0].map((g, i) => slP("c" + i, g === 0 ? "termo independente" : `coef. de x${g === 1 ? "" : supP(g)}`, p[i], -3, 3)).join("")}</div></div><div><div class="bts">${slP("x0", "calcular em x =", 2, -3, 3, 0.5, 150)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => ({ p: p.slice(), x0, grau: pl.grau(p), v: pl.val(p, x0), p0: pl.val(p, 0), p1: pl.val(p, 1), somaCoef: p.reduce((s, c) => s + c, 0), dominante: pl.limpa(p)[0], raiz: pl.val(p, x0) === 0 && pl.grau(p) >= 0 });
    const poe = (o) => { if (o.p) p = o.p.map((v) => Math.max(-3, Math.min(3, Math.round(+v)))); if (o.x0 !== undefined) x0 = Math.max(-3, Math.min(3, Math.round(+o.x0 * 2) / 2)); desenha(); };
    const desenha = () => { const e = est(); p.forEach((c, i) => { q(`[data-v=c${i}]`).value = String(c); q(`[data-v=c${i}r]`).textContent = mn(c); }); q("[data-v=x0]").value = String(x0); q("[data-v=x0r]").textContent = F.nt(x0);
      q("[data-v=pal]").innerHTML = pl.graf(p, null, { x: [-3.5, 3.5], y: [-12, 12], h: 300, pts: Math.abs(e.v) <= 12 ? [{ x: x0, y: e.v, r: 5, rot: `P(${F.nt(x0)}) = ${F.nt(e.v, 3)}` }] : [], segs: Math.abs(e.v) <= 12 ? [{ x1: x0, y1: 0, x2: x0, y2: e.v }] : [], sub: `P(x) = ${pl.txt(p)}` });
      q("[data-v=lt]").innerHTML = vis("grau", e.grau < 0 ? "não tem" : e.grau) + vis(`P(${F.nt(x0)})`, F.nt(e.v, 3)) + vis("P(0)", mn(e.p0)) + vis("P(1)", mn(e.p1)) + vis("soma dos coeficientes", mn(e.somaCoef));
      q("[data-v=st]").innerHTML = e.grau < 0 ? `Todos os coeficientes são zero: é o <b>polinômio nulo</b>, que vale 0 para todo x e não tem grau.` : `O grau é o maior expoente com coeficiente diferente de zero: ${e.grau}. ${e.raiz ? `Em x = ${F.nt(x0)} o valor é zero: esse número é uma <b>raiz</b> do polinômio (o gráfico toca o eixo x ali).` : `O valor numérico em x = ${F.nt(x0)} é ${F.nt(e.v, 3)}${Math.abs(e.v) > 12 ? " (fora da janela)" : ""}.`} Repare: P(0) é sempre o termo independente, e P(1) é sempre a soma dos coeficientes. Zere o coeficiente de x³ e veja o grau cair.`; };
    [0, 1, 2, 3].forEach((i) => q(`[data-v=c${i}]`).addEventListener("input", (ev) => { const n = p.slice(); n[i] = ev.target.value; poe({ p: n }); })); q("[data-v=x0]").addEventListener("input", (ev) => poe({ x0: ev.target.value }));
    SIM.alPolGraf._ult = { poe, est }; desenha(); };

  /* nome: "Valor numérico sem potências: multiplica e soma" · matéria: Matemática · tema: PL01 */
  SIM.alHorner = (el, F) => { let r = rng(21), p = [2, -3, 0, 5], a = 2, passo = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="novo">outro polinômio</button><button class="bt peq" data-v="prox">próximo passo</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => ({ p: p.slice(), a, passo, linha: pl.horner(p, a), valor: pl.val(p, a), direto: p.reduce((s, c, i) => s + c * a ** (p.length - 1 - i), 0) });
    const novo = () => { p = pl.sorteia(r, 3); do a = -3 + Math.floor(r() * 7); while (a === 0); passo = 0; desenha(); };
    const avanca = () => { if (passo < p.length) passo++; desenha(); };
    const desenha = () => { const e = est(), k = passo - 1, pa = (v) => (v < 0 ? `(${mn(v)})` : mn(v));
      q("[data-v=pal]").innerHTML = A.ruffiniFig(p, a, null, { ate: passo, dest: k, sub: `P(x) = ${pl.txt(p)}, calculado em x = ${mn(a)}` });
      q("[data-v=lt]").innerHTML = vis("passo", `${passo} de ${p.length}`) + vis("conta deste passo", k <= 0 ? (k === 0 ? "copia o primeiro" : "?") : `${pa(e.linha[k - 1])} · ${pa(a)} + ${pa(p[k])} = ${mn(e.linha[k])}`) + vis(`P(${mn(a)})`, passo >= p.length ? mn(e.valor) : "?");
      q("[data-v=st]").innerHTML = passo === 0 ? `Em vez de calcular cada potência, escreve-se o polinômio como ((${p[0] === 1 ? "" : p[0] === -1 ? "−" : mn(p[0])}x${p[1] < 0 ? "−" : "+"} ${Math.abs(p[1])})x ${p[2] < 0 ? "−" : "+"} ${Math.abs(p[2])})x ${p[3] < 0 ? "−" : "+"} ${Math.abs(p[3])}: só multiplicações por x e somas. Na tabela: os coeficientes em cima, o número x = ${mn(a)} à esquerda. Primeiro passo: copiar o primeiro coeficiente para baixo.` : passo < p.length ? `Regra de todo passo: pegue o último número de baixo, <b>multiplique</b> por ${mn(a)} e <b>some</b> o próximo coeficiente de cima.${k === 0 ? " (O primeiro só desce.)" : ""}` : `O último número, ${mn(e.valor)}, é o valor numérico P(${mn(a)}). Conferindo do jeito comprido: ${p.map((c, i) => `${pa(c)}${p.length - 1 - i ? " · " + pa(a) + (p.length - 1 - i > 1 ? supP(p.length - 1 - i) : "") : ""}`).join(" + ")} = ${mn(e.direto)}. Esse esquema é o dispositivo de Briot-Ruffini, que no próximo tema também faz divisões.`; q("[data-v=prox]").disabled = passo >= p.length; };
    q("[data-v=novo]").addEventListener("click", novo); q("[data-v=prox]").addEventListener("click", avanca);
    SIM.alHorner._ult = { est, novo, avanca, poe: (o) => { p = o.p; a = o.a; passo = 0; desenha(); }, semente: (s) => { r = rng(s); novo(); } }; desenha(); };

  /* nome: "Identidade de polinômios: ache A e B" · matéria: Matemática · tema: PL01 */
  SIM.alIdentidade = (el, F) => { let r = rng(33), u = 1, v = -2, alvo = [5, -4], Aa = 1, Bb = 1;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${slP("A", "A", 1, -6, 6, 1, 150)}${slP("B", "B", 1, -6, 6, 1, 150)}<button class="bt peq" data-v="novo">outro</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), bn = (k) => `(x ${k < 0 ? "−" : "+"} ${Math.abs(k)})`;
    /* A(x + u) + B(x + v) ≡ alvo: (A + B)x + (Au + Bv) */
    const est = () => { const esq = [Aa + Bb, Aa * u + Bb * v], det = v - u; return { u, v, alvo: alvo.slice(), A: Aa, B: Bb, esq, identico: esq[0] === alvo[0] && esq[1] === alvo[1], sol: [(alvo[0] * v - alvo[1]) / det, (alvo[1] - alvo[0] * u) / det], iguaisEm: [-2, 0, 1, 3].filter((x) => esq[0] * x + esq[1] === alvo[0] * x + alvo[1]).length }; };
    const novo = () => { do { u = -4 + Math.floor(r() * 9); v = -4 + Math.floor(r() * 9); } while (u === v || u === 0 || v === 0); const sa = -5 + Math.floor(r() * 11), sb = -5 + Math.floor(r() * 11); alvo = [sa + sb, sa * u + sb * v]; Aa = 1; Bb = 1; if (est().identico) Aa = 2; desenha(); };
    const poe = (o) => { if (o.A !== undefined) Aa = Math.max(-6, Math.min(6, Math.round(+o.A))); if (o.B !== undefined) Bb = Math.max(-6, Math.min(6, Math.round(+o.B))); if (o.u !== undefined) { u = o.u; v = o.v; alvo = o.alvo; } desenha(); };
    const desenha = () => { const e = est(); q("[data-v=A]").value = String(Aa); q("[data-v=B]").value = String(Bb); q("[data-v=Ar]").textContent = mn(Aa); q("[data-v=Br]").textContent = mn(Bb);
      q("[data-v=pal]").innerHTML = `<div style="text-align:center;font-size:18px;font-weight:650;color:var(--ink);padding:6px 0">A·${bn(u)} + B·${bn(v)} &nbsp;≡&nbsp; ${M.polTxt(alvo)}</div>` + A.plano({ x: [-6, 6], y: [-20, 20], h: 250, py: 5, px: 2, fs: [{ f: (x) => alvo[0] * x + alvo[1], cor: "var(--ok)" }, { f: (x) => e.esq[0] * x + e.esq[1], cor: "var(--warn)", tr: !e.identico }], sub: "verde: o lado direito · laranja: o lado esquerdo com os seus A e B" });
      q("[data-v=lt]").innerHTML = vis("lado esquerdo", M.polTxt(e.esq)) + vis("lado direito", M.polTxt(alvo)) + vis("coeficiente de x", e.esq[0] === alvo[0] ? "igual" : "diferente") + vis("termo independente", e.esq[1] === alvo[1] ? "igual" : "diferente");
      q("[data-v=st]").innerHTML = e.identico ? `Os dois lados têm os <b>mesmos coeficientes</b>: são o mesmo polinômio, e as duas retas coincidem. Valem o mesmo para todo x, não só para alguns.` : `Identidade (≡) quer dizer igual para <b>todo</b> x. As retas se cruzam em no máximo um ponto, então igualar em um valor de x não basta: é preciso igualar os coeficientes. Coeficiente de x: A + B = ${mn(alvo[0])}. Termo independente: ${u === 1 ? "" : u === -1 ? "−" : mn(u)}A ${v < 0 ? "−" : "+"} ${Math.abs(v) === 1 ? "" : Math.abs(v)}B = ${mn(alvo[1])}. Um sistema de duas equações.`; };
    q("[data-v=A]").addEventListener("input", (ev) => poe({ A: ev.target.value })); q("[data-v=B]").addEventListener("input", (ev) => poe({ B: ev.target.value })); q("[data-v=novo]").addEventListener("click", novo);
    SIM.alIdentidade._ult = { est, novo, poe, semente: (s) => { r = rng(s); novo(); } }; desenha(); };

  /* ---------- PL02 ---------- */
  /* divisão por x − a pelo dispositivo: quociente e resto */
  pl.ruffini = (p, a) => { const l = pl.horner(p, a); return { linha: l, q: l.length > 1 ? l.slice(0, -1) : [0], r: l[l.length - 1] }; };
  /* método da chave com divisor mônico (coeficientes inteiros): cada passo traz o termo do quociente, o que se subtrai e o resto parcial */
  pl.divPassos = (p, d) => { let r = pl.limpa(p); d = pl.limpa(d); const gd = d.length - 1, passos = [], q = []; if (d[0] !== 1) return null;
    while (r.length - 1 >= gd && pl.grau(r) >= 0) { const c = r[0], g = r.length - 1 - gd, sub = d.map((v) => c * v).concat(Array(g).fill(0)), novo = pl.limpa(r.map((v, i) => v - sub[i]).slice(1)); q.push([c, g]); passos.push({ c, g, sub, antes: r, resto: novo }); /* se o grau cair mais de 1, os termos pulados do quociente são zero */ r = novo; }
    const Q = Array((p.length - 1 - gd >= 0 ? p.length - 1 - gd : 0) + 1).fill(0); q.forEach(([c, g]) => (Q[Q.length - 1 - g] = c)); return { passos, q: pl.limpa(Q), r }; };
  pl.monoTxt = (c, g) => (g === 0 ? mn(c) : (c === 1 ? "" : c === -1 ? "−" : mn(c)) + "x" + (g === 1 ? "" : supP(g)));

  /* nome: "Divisão pelo método da chave, um termo por vez" · matéria: Matemática · tema: PL02 */
  SIM.alDivChave = (el, F) => { let r = rng(27), P = [2, 1, -4, 3], Dv = [1, -1, 2], passo = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="novo">outra divisão</button><button class="bt peq" data-v="prox">próximo passo</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const d = pl.divPassos(P, Dv); return { P: P.slice(), D: Dv.slice(), passo, total: d.passos.length, q: d.q, r: d.r, passos: d.passos, volta: pl.soma(pl.mul(Dv, d.q), d.r) }; };
    const novo = () => { const gd = 1 + Math.floor(r() * 2); Dv = [1, ...pl.sorteia(r, gd - 1, -3, 3)]; if (gd === 1 && Dv[1] === 0) Dv[1] = -2; P = pl.sorteia(r, gd + 2, -4, 4); passo = 0; desenha(); };
    const avanca = () => { if (passo < est().total) passo++; desenha(); };
    const desenha = () => { const e = est(), fim = passo >= e.total, feitos = e.passos.slice(0, passo), parcial = passo === 0 ? P : feitos[passo - 1].resto, qTxt = feitos.map((s, i) => (i === 0 ? pl.monoTxt(s.c, s.g) : (s.c < 0 ? " − " : " + ") + pl.monoTxt(Math.abs(s.c), s.g))).join("") || "?";
      const linhas = [`<div><b>${pl.txt(P)}</b> &nbsp;÷&nbsp; <b>${pl.txt(Dv)}</b></div>`]; feitos.forEach((s) => { linhas.push(`<div style="color:var(--warn)">− (${pl.txt(s.sub)}) &nbsp;<span style="color:var(--ink3);font-size:13px">← ${pl.monoTxt(s.c, s.g)} · (${pl.txt(Dv)})</span></div><div style="border-top:1.5px solid var(--ink3);display:inline-block;padding-top:3px">${pl.txt(s.resto)}</div>`); });
      q("[data-v=pal]").innerHTML = `<div style="font-size:16px;font-weight:600;color:var(--ink);padding:8px 16px;line-height:1.9;text-align:center">${linhas.join("")}</div>`;
      q("[data-v=lt]").innerHTML = vis("quociente", fim ? pl.txt(e.q) : qTxt + (passo ? " …" : "")) + vis(fim ? "resto" : "resto parcial", pl.txt(parcial)) + vis("passo", `${passo} de ${e.total}`);
      q("[data-v=st]").innerHTML = passo === 0 ? `Cada passo: divida o <b>primeiro termo</b> do que sobrou pelo primeiro termo do divisor; o resultado é o próximo termo do quociente. Multiplique o divisor inteiro por ele e subtraia. Antes de clicar: ${pl.monoTxt(P[0], P.length - 1)} dividido por ${pl.monoTxt(1, Dv.length - 1)} dá quanto?` : !fim ? `${pl.monoTxt(feitos[passo - 1].antes[0], feitos[passo - 1].antes.length - 1)} ÷ ${pl.monoTxt(1, Dv.length - 1)} = ${pl.monoTxt(feitos[passo - 1].c, feitos[passo - 1].g)}. Subtraindo ${pl.monoTxt(feitos[passo - 1].c, feitos[passo - 1].g)} vezes o divisor, o termo de maior grau some. O que sobrou ainda tem grau maior ou igual ao do divisor: continua.` : `O que sobrou tem grau <b>menor</b> que o do divisor: acabou. Quociente ${pl.txt(e.q)}, resto ${pl.txt(e.r)}. Conferência: divisor · quociente + resto = ${pl.txt(e.volta)}, que é o dividendo.`; q("[data-v=prox]").disabled = fim; };
    q("[data-v=novo]").addEventListener("click", novo); q("[data-v=prox]").addEventListener("click", avanca);
    SIM.alDivChave._ult = { est, novo, avanca, poe: (o) => { P = o.P; Dv = o.D; passo = 0; desenha(); }, semente: (s) => { r = rng(s); novo(); } }; desenha(); };

  /* nome: "Briot-Ruffini: dividir por x − a" · matéria: Matemática · tema: PL02 */
  SIM.alRuffini = (el, F) => { let r = rng(29), P = [2, -3, -8, 7], a = 3, passo = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${slP("a", "dividir por x − a, com a =", 3, -4, 4, 1, 150)}<button class="bt peq" data-v="novo">outro polinômio</button><button class="bt peq" data-v="prox">próximo passo</button><button class="bt peq" data-v="tudo">mostrar tudo</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), n = () => P.length;
    const est = () => { const d = pl.ruffini(P, a); return { P: P.slice(), a, passo, q: d.q, r: d.r, linha: d.linha, pa: pl.val(P, a), volta: pl.soma(pl.mul([1, -a], d.q), [d.r]), divisor: pl.txt([1, -a]) }; };
    const novo = () => { P = pl.sorteia(r, 3 + Math.floor(r() * 2), -5, 5); passo = 0; desenha(); };
    const poe = (o) => { if (o.a !== undefined) a = Math.max(-4, Math.min(4, Math.round(+o.a))); if (o.P) P = o.P; passo = o.passo === undefined ? 0 : Math.min(o.passo, n()); desenha(); };
    const desenha = () => { const e = est(), fim = passo >= n(), k = passo - 1, pa = (v) => (v < 0 ? `(${mn(v)})` : mn(v)); q("[data-v=a]").value = String(a); q("[data-v=ar]").textContent = mn(a);
      q("[data-v=pal]").innerHTML = A.ruffiniFig(P, a, null, { ate: passo, dest: k, sub: `(${pl.txt(P)}) ÷ (${e.divisor})` });
      q("[data-v=lt]").innerHTML = vis("conta deste passo", k <= 0 ? (k === 0 ? "desce o primeiro" : "?") : `${pa(e.linha[k - 1])} · ${pa(a)} + ${pa(P[k])} = ${mn(e.linha[k])}`) + vis("quociente", fim ? pl.txt(e.q) : "?") + vis("resto", fim ? mn(e.r) : "?") + vis(`P(${mn(a)})`, fim ? mn(e.pa) : "?");
      q("[data-v=st]").innerHTML = passo === 0 ? `À esquerda vai o número a, a <b>raiz do divisor</b> x − a (para dividir por ${e.divisor}, a = ${mn(a)}). Em cima, os coeficientes do dividendo, com zero nas potências que faltam. Cada passo: multiplica o último de baixo por a e soma o próximo de cima.` : !fim ? `Na linha de baixo estão aparecendo os coeficientes do <b>quociente</b>, que tem um grau a menos que o dividendo. A última casa, destacada, vai ser o resto.` : `Quociente: ${pl.txt(e.q)} (um grau a menos). Resto: ${mn(e.r)}, que é exatamente P(${mn(a)}): o <b>teorema do resto</b>. ${e.r === 0 ? `Resto zero: ${mn(a)} é raiz e (${e.divisor}) é um fator do polinômio.` : `Como o resto não é zero, ${mn(a)} não é raiz. Mexa em a até o resto zerar.`}`; q("[data-v=prox]").disabled = fim; };
    q("[data-v=a]").addEventListener("input", (ev) => poe({ a: ev.target.value, passo: passo >= n() ? n() : 0 })); q("[data-v=novo]").addEventListener("click", novo); q("[data-v=prox]").addEventListener("click", () => { if (passo < n()) passo++; desenha(); }); q("[data-v=tudo]").addEventListener("click", () => { passo = n(); desenha(); });
    SIM.alRuffini._ult = { est, novo, poe, avanca: () => { if (passo < n()) passo++; desenha(); }, semente: (s) => { r = rng(s); novo(); } }; desenha(); };

  /* nome: "O teorema do resto no gráfico" · matéria: Matemática · tema: PL02 */
  SIM.alRestoGraf = (el, F) => { let k = 0, a = 2; const LISTA = [[1, 0, -7, 6], [1, -2, -5, 6], [1, 1, -4, -4], [2, -3, -3, 2], [1, 0, -3, 2]];
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${slP("a", "a", 2, -4, 4, 0.5, 220)}<button class="bt peq" data-v="novo">outro polinômio</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const P = LISTA[k], l = pl.horner(P, a), Q = l.slice(0, -1), R = l[l.length - 1]; return { P, a, q: Q, r: R, pa: pl.val(P, a), raiz: R === 0, confere: [-3, -1, 0.5, 2, 4].every((x) => Math.abs((x - a) * pl.val(Q, x) + R - pl.val(P, x)) < 1e-9) }; };
    const poe = (o) => { if (o.a !== undefined) a = Math.max(-4, Math.min(4, Math.round(+o.a * 2) / 2)); if (o.k !== undefined) k = ((o.k % LISTA.length) + LISTA.length) % LISTA.length; desenha(); };
    const desenha = () => { const e = est(), dentro = Math.abs(e.r) <= 20; q("[data-v=a]").value = String(a); q("[data-v=ar]").textContent = F.nt(a);
      q("[data-v=pal]").innerHTML = pl.graf(e.P, null, { x: [-4.5, 4.5], y: [-20, 20], h: 300, pts: dentro ? [{ x: a, y: e.r, r: 5, cor: e.raiz ? "var(--ok)" : "var(--warn)", rot: `resto = ${F.nt(e.r, 3)}` }] : [], segs: dentro ? [{ x1: a, y1: 0, x2: a, y2: e.r, cor: "var(--warn)", tr: false, w: 2.4 }] : [], sub: `P(x) = ${pl.txt(e.P)}` });
      q("[data-v=lt]").innerHTML = vis("divisor", `x ${a < 0 ? "+" : "−"} ${F.nt(Math.abs(a))}`.replace("− 0", "").replace("+ 0", "")) + vis("coeficientes do quociente", e.q.map((c) => F.nt(c, 3)).join(" ; ")) + vis("resto", F.nt(e.r, 3)) + vis(`P(${F.nt(a)})`, F.nt(e.pa, 3)) + vis("a é raiz?", e.raiz ? "sim" : "não");
      q("[data-v=st]").innerHTML = e.raiz ? `Aqui o gráfico corta o eixo x: P(${F.nt(a)}) = 0. O resto da divisão é zero, e x ${a < 0 ? "+" : "−"} ${F.nt(Math.abs(a))} é um <b>fator</b> de P. Raiz, resto zero e fator são três jeitos de dizer a mesma coisa.` : `O segmento laranja é o resto da divisão de P por x ${a < 0 ? "+" : "−"} ${F.nt(Math.abs(a))}, e é também a altura do gráfico em x = ${F.nt(a)}: resto = P(a). Arraste a até o segmento desaparecer: você terá achado uma raiz.${dentro ? "" : " (Agora o ponto está fora da janela.)"}`; };
    q("[data-v=a]").addEventListener("input", (ev) => poe({ a: ev.target.value })); q("[data-v=novo]").addEventListener("click", () => poe({ k: k + 1 }));
    SIM.alRestoGraf._ult = { poe, est, LISTA }; desenha(); };
})();
