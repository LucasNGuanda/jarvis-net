/* Matemática · módulo AL (Álgebra): núcleo comum e laboratórios do FX01.
   SIM.al: plano (plano cartesiano em SVG com curvas, pontos e segmentos), lin (ax + b em TeX, sem "1x" e sem "+ −"), ajudantes de sorteio
   e de alternativas usados pelos temas (ri, nz, ps, sn, mn, opT, opS) e vis/rng/T para os laboratórios dos outros arquivos de álgebra.
   Laboratórios: SIM.alMaquina (a função como máquina) e SIM.alRetaVertical (o teste da reta vertical).
   Contas conferidas em Python (tools/matematica/confere-al.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = (SIM.al = {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const T = (x, y, s, o) => `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" text-anchor="${(o && o.a) || "middle"}" style="font:${(o && o.w) || 500} ${(o && o.f) || 13}px Inter,system-ui,sans-serif;fill:${(o && o.c) || "var(--ink)"}">${s}</text>`;
  const mn = (v) => String(v).replace("-", "−");
  Object.assign(A, { vis, rng, T, mn, COR: ["var(--mod)", "var(--ok)", "var(--warn)", "var(--mC)"] });
  /* sorteio e escrita */
  A.ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  A.nz = (a, b, fora = [0]) => { let v; do { v = A.ri(a, b); } while (fora.includes(v)); return v; };
  A.ps = (v) => (v < 0 ? `(${v})` : String(v));
  A.sn = (v) => (v < 0 ? `- ${-v}` : `+ ${v}`);
  /* ax + b em TeX (v = nome da variável) e em texto */
  A.lin = (a, b, v = "x") => { const X = a === 0 ? "" : (a === 1 ? "" : a === -1 ? "-" : String(a)) + v; if (!X) return String(b); return X + (b === 0 ? "" : b > 0 ? ` + ${b}` : ` - ${-b}`); };
  A.linT = (a, b, v = "x") => A.lin(a, b, v).replace(/-/g, "−");
  /* alternativas: opT recebe TeX, opS recebe texto já pronto */
  A.opT = (certo, erradas, p) => SIM.alt5(`$${certo}$.`, [...new Set(erradas)].filter((e) => e !== certo).map((e) => `$${e}$.`), p);
  A.opS = (certo, erradas, p) => SIM.alt5(certo, [...new Set(erradas)].filter((e) => e !== certo), p);
  /* plano cartesiano. o = { x: [x0, x1], y: [y0, y1], h, fs: [{ f, cor, tr, dom: [a, b] }], pts: [{ x, y, rot, cor, oco, dx, dy }], segs: [{ x1, y1, x2, y2, cor, tr }],
     px, py (passo das marcas), semNum, sub, rx, ry }. Com D devolve a figura do tema; sem D devolve o <svg> cru, para laboratório. */
  let nClip = 0;
  A.plano = (o, D) => { const W = 560, H = o.h || 230, mt = 14, mb = o.sub ? 34 : 16, [x0, x1] = o.x, [y0, y1] = o.y, id = "alc" + ++nClip, mx = o.iso ? (W - ((H - mt - mb) / (y1 - y0)) * (x1 - x0)) / 2 : 44; /* iso: mesma escala nos dois eixos (círculo sai redondo) */
    const X = (x) => mx + ((x - x0) / (x1 - x0)) * (W - 2 * mx), Y = (y) => H - mb - ((y - y0) / (y1 - y0)) * (H - mt - mb), ex = Math.min(Math.max(0, y0), y1), ey = Math.min(Math.max(0, x0), x1);
    let s = `<defs><clipPath id="${id}"><rect x="${mx}" y="${mt}" width="${W - 2 * mx}" height="${H - mt - mb}"/></clipPath></defs>`;
    const px = o.px || (x1 - x0 > 14 ? 2 : 1), py = o.py || (y1 - y0 > 40 ? 10 : y1 - y0 > 14 ? 2 : 1);
    if (!o.semNum) { for (let v = Math.ceil(x0 / px) * px; v <= x1 + 1e-9; v += px) if (Math.abs(v) > 1e-9) s += `<line x1="${X(v).toFixed(1)}" y1="${Y(ex) - 3}" x2="${X(v).toFixed(1)}" y2="${Y(ex) + 3}" style="stroke:var(--ink3)"/>` + T(X(v), Y(ex) + 15, mn(+v.toFixed(2)), { f: 10, c: "var(--ink3)" });
      for (let v = Math.ceil(y0 / py) * py; v <= y1 + 1e-9; v += py) if (Math.abs(v) > 1e-9) s += `<line x1="${X(ey) - 3}" y1="${Y(v).toFixed(1)}" x2="${X(ey) + 3}" y2="${Y(v).toFixed(1)}" style="stroke:var(--ink3)"/>` + T(X(ey) - 7, Y(v) + 3.5, mn(+v.toFixed(2)), { f: 10, c: "var(--ink3)", a: "end" }); }
    s += `<line x1="${mx - 6}" y1="${Y(ex)}" x2="${W - mx + 8}" y2="${Y(ex)}" style="stroke:var(--ink2);stroke-width:1.4"/><line x1="${X(ey)}" y1="${H - mb + 4}" x2="${X(ey)}" y2="${mt - 6}" style="stroke:var(--ink2);stroke-width:1.4"/>` + T(W - mx + 16, Y(ex) + 4, o.rx || "x", { f: 12, c: "var(--ink2)" }) + T(X(ey) + 10, mt + 2, o.ry || "y", { f: 12, c: "var(--ink2)" });
    (o.fs || []).forEach((c, i) => { const [a, b] = c.dom || [x0, x1], n = 360; let d = "", on = false, ant = null; for (let k = 0; k <= n; k++) { const x = a + ((b - a) * k) / n, y = c.f(x), fora = !Number.isFinite(y) || y > y1 + (y1 - y0) || y < y0 - (y1 - y0) || (ant !== null && Math.abs(y - ant) > (y1 - y0) * 0.9); if (fora) { on = false; ant = null; continue; } d += `${on ? "L" : "M"}${X(x).toFixed(1)} ${Y(y).toFixed(1)}`; on = true; ant = y; }
      s += `<path d="${d}" clip-path="url(#${id})" style="fill:none;stroke:${c.cor || A.COR[i % 4]};stroke-width:2.4${c.tr ? ";stroke-dasharray:6 5" : ""}"/>`; });
    (o.segs || []).forEach((g) => (s += `<line x1="${X(g.x1).toFixed(1)}" y1="${Y(g.y1).toFixed(1)}" x2="${X(g.x2).toFixed(1)}" y2="${Y(g.y2).toFixed(1)}" style="stroke:${g.cor || "var(--ink3)"};stroke-width:${g.w || 1.4}${g.tr === false ? "" : ";stroke-dasharray:4 4"}"/>`));
    /* pols: regiões pintadas (polígonos cortados na janela), para semiplanos e faixas */
    (o.pols || []).forEach((c) => (s += `<polygon points="${c.pts.map(([x, y]) => X(x).toFixed(1) + "," + Y(y).toFixed(1)).join(" ")}" clip-path="url(#${id})" style="fill:${c.cor || "var(--mod)"};fill-opacity:.16;fill-rule:evenodd;stroke:none"/>`));
    /* circs: circunferências (só fazem sentido com iso: true); pinta: true preenche o disco */
    (o.circs || []).forEach((c) => (s += `<circle cx="${X(c.x).toFixed(1)}" cy="${Y(c.y).toFixed(1)}" r="${Math.abs(X(c.r) - X(0)).toFixed(1)}" clip-path="url(#${id})" style="fill:${c.pinta ? c.cor || "var(--mod)" : "none"};fill-opacity:.18;stroke:${c.cor || "var(--ink3)"};stroke-width:${c.w || 1.6}${c.tr === false ? "" : ";stroke-dasharray:5 4"}"/>`));
    (o.pts || []).forEach((q) => (s += `<circle cx="${X(q.x).toFixed(1)}" cy="${Y(q.y).toFixed(1)}" r="${q.r || 5}" style="fill:${q.oco ? "var(--card)" : q.cor || "var(--warn)"};stroke:${q.cor || "var(--warn)"};stroke-width:2"/>` + (q.rot ? T(X(q.x) + (q.dx ?? 9), Y(q.y) + (q.dy ?? -8), q.rot, { a: (q.dx ?? 9) < 0 ? "end" : "start", w: 600, f: 12 }) : "")));
    if (o.sub) s += T(W / 2, H - 6, o.sub, { c: "var(--ink2)", f: 12 });
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px">${s}</svg>`; };

  /* ---------- FX01 ---------- */
  A.REGRAS = [
    { n: "dobra e soma 3", tx: "f(x) = 2x + 3", f: (x) => 2 * x + 3, dom: "todos os reais" },
    { n: "eleva ao quadrado", tx: "f(x) = x²", f: (x) => x * x, dom: "todos os reais" },
    { n: "quadrado menos 4", tx: "f(x) = x² − 4", f: (x) => x * x - 4, dom: "todos os reais" },
    { n: "inverso", tx: "f(x) = 1/x", f: (x) => (x === 0 ? NaN : 1 / x), dom: "x ≠ 0" },
    { n: "raiz quadrada", tx: "f(x) = √x", f: (x) => (x < 0 ? NaN : Math.sqrt(x)), dom: "x ≥ 0" },
    { n: "módulo menos 2", tx: "f(x) = |x| − 2", f: (x) => Math.abs(x) - 2, dom: "todos os reais" }];
  /* nome: "A máquina de funções: entra x, sai f(x)" · matéria: Matemática · tema: FX01 */
  SIM.alMaquina = (el, F) => { let i = 0, x = 2;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">regra <select data-v="r" class="bt peq" style="font-size:14px">${A.REGRAS.map((r, k) => `<option value="${k}">${r.n}</option>`).join("")}</select></label><label style="font-size:13px;color:var(--ink2)">entrada x <input type="range" data-v="x" min="-5" max="5" step="0.5" value="2" style="vertical-align:middle;width:200px"></label></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const r = A.REGRAS[i], y = r.f(x); return { i, regra: r.tx, x, y: Number.isFinite(y) ? y : null, dom: r.dom }; };
    const poe = (o) => { ({ i, x } = { i, x, ...o }); i = Math.max(0, Math.min(A.REGRAS.length - 1, Math.round(+i))); x = Math.max(-5, Math.min(5, Math.round(+x * 2) / 2)); desenha(); };
    const desenha = () => { const e = est(), r = A.REGRAS[i]; q("[data-v=r]").value = String(i); q("[data-v=x]").value = String(x);
      q("[data-v=pal]").innerHTML = A.plano({ x: [-5.5, 5.5], y: [-6, 14], h: 240, py: 2, fs: [{ f: r.f }], pts: e.y === null || e.y > 14 || e.y < -6 ? [] : [{ x, y: e.y }], segs: e.y === null || e.y > 14 || e.y < -6 ? [] : [{ x1: x, y1: 0, x2: x, y2: e.y }, { x1: 0, y1: e.y, x2: x, y2: e.y }] });
      q("[data-v=lt]").innerHTML = vis("regra", r.tx) + vis("entra x", F.nt(x, 1)) + vis("sai f(x)", e.y === null ? "não existe" : F.nt(e.y, 3)) + vis("domínio", r.dom);
      q("[data-v=st]").innerHTML = e.y === null ? `A máquina trava: ${F.nt(x, 1)} está <b>fora do domínio</b> desta regra (${r.dom}). Não é que a resposta seja zero: não há resposta.` : `Entrou ${F.nt(x, 1)}, saiu ${F.nt(e.y, 3)}. Para cada entrada do domínio, a máquina devolve <b>uma única</b> saída: é isso que faz dela uma função. O ponto (${F.nt(x, 1)}; ${F.nt(e.y, 3)}) é um ponto do gráfico.`; };
    q("[data-v=r]").addEventListener("change", (ev) => poe({ i: ev.target.value })); q("[data-v=x]").addEventListener("input", (ev) => poe({ x: ev.target.value }));
    SIM.alMaquina._ult = { poe, est }; desenha(); };

  /* curvas do teste da reta vertical: cada uma é uma lista de ramos y = r(x) (NaN onde o ramo não existe) */
  const rz = (v) => (v < 0 ? NaN : Math.sqrt(v));
  A.CURVAS = [
    { n: "reta inclinada", r: [(x) => 0.5 * x + 1] },
    { n: "parábola em pé", r: [(x) => 0.5 * x * x - 3] },
    { n: "circunferência", r: [(x) => rz(9 - x * x), (x) => -rz(9 - x * x)] },
    { n: "parábola deitada", r: [(x) => rz(x + 3), (x) => -rz(x + 3)] },
    { n: "curva em S", r: [(x) => (x * x * x) / 6 - x] },
    { n: "letra X", r: [(x) => x, (x) => -x] },
    { n: "letra V", r: [(x) => Math.abs(x) - 2] },
    { n: "duas retas deitadas", r: [(x) => 2 + 0 * x, (x) => -1 + 0 * x] }];
  A.cortes = (c, x) => { const ys = []; c.r.forEach((r) => { const y = r(x); if (Number.isFinite(y) && !ys.some((v) => Math.abs(v - y) < 1e-9)) ys.push(y); }); return ys; };
  A.ehFuncao = (c) => { for (let x = -5; x <= 5.0001; x += 0.01) if (A.cortes(c, x).length > 1) return false; return true; };
  A.figCurva = (c, D, o = {}) => A.plano({ x: [-5, 5], y: [-4.5, 4.5], h: 230, iso: true, semNum: true, fs: c.r.map((f) => ({ f, cor: "var(--mod)" })), ...o }, D);
  /* nome: "É função? O teste da reta vertical" · matéria: Matemática · tema: FX01 */
  SIM.alRetaVertical = (el, F) => { let i = 2, x = 1, resp = null, pontos = 0, feitas = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">curva <select data-v="c" class="bt peq" style="font-size:14px">${A.CURVAS.map((c, k) => `<option value="${k}">${c.n}</option>`).join("")}</select></label><label style="font-size:13px;color:var(--ink2)">reta vertical <input type="range" data-v="x" min="-4.5" max="4.5" step="0.25" value="1" style="vertical-align:middle;width:180px"></label></div><div class="bts" style="margin-top:6px"><button class="bt peq" data-r="1">é função</button><button class="bt peq" data-r="0">não é função</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const c = A.CURVAS[i], ys = A.cortes(c, x); return { i, nome: c.n, x, cortes: ys.length, ehFuncao: A.ehFuncao(c), resp, pontos, feitas }; };
    const poe = (o) => { if (o.i !== undefined && +o.i !== i) resp = null; ({ i, x } = { i, x, ...o }); i = Math.max(0, Math.min(A.CURVAS.length - 1, Math.round(+i))); x = Math.max(-4.5, Math.min(4.5, +x)); desenha(); };
    const responde = (v) => { if (resp !== null) return; resp = !!v; feitas++; if (resp === A.ehFuncao(A.CURVAS[i])) pontos++; desenha(); };
    const desenha = () => { const e = est(), c = A.CURVAS[i], ys = A.cortes(c, x); q("[data-v=c]").value = String(i); q("[data-v=x]").value = String(x);
      q("[data-v=pal]").innerHTML = A.plano({ x: [-5, 5], y: [-4.5, 4.5], h: 290, iso: true, fs: c.r.map((f) => ({ f, cor: "var(--mod)" })), segs: [{ x1: x, y1: -4.5, x2: x, y2: 4.5, cor: "var(--warn)", w: 2, tr: false }], pts: ys.filter((y) => Math.abs(y) <= 4.5).map((y) => ({ x, y })) });
      q("[data-v=lt]").innerHTML = vis("reta em x =", F.nt(x, 2)) + vis("cortes nesta posição", e.cortes) + vis("acertos nesta sessão", `${pontos} de ${feitas}`);
      q("[data-v=st]").innerHTML = resp === null ? `Passeie com a reta vertical pela curva inteira e conte os cortes. Depois responda: esta curva é o gráfico de uma função y = f(x)?` : (resp === e.ehFuncao ? "Certo. " : "Ainda não. ") + (e.ehFuncao ? `Em nenhuma posição a reta corta a curva mais de uma vez: cada x tem no máximo um y. <b>É função.</b>` : `Há posições em que a reta corta a curva em dois pontos: o mesmo x teria dois valores de y. <b>Não é função</b> de x.`); };
    q("[data-v=c]").addEventListener("change", (ev) => poe({ i: ev.target.value })); q("[data-v=x]").addEventListener("input", (ev) => poe({ x: ev.target.value })); el.querySelectorAll("[data-r]").forEach((b) => b.addEventListener("click", () => responde(+b.dataset.r)));
    SIM.alRetaVertical._ult = { poe, est, responde }; desenha(); };
})();
