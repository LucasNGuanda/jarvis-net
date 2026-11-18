/* Matemática · módulo MB: razão, proporção e porcentagem (MB04).
   Acrescenta a SIM.mb: tabela (tabela simples em SVG), partes (divisão em partes direta ou inversamente proporcionais, com frações exatas),
   fator (fator multiplicativo de uma sequência de aumentos e descontos) e fitaPartes (barra cortada em partes).
   Laboratórios: SIM.mbProporcao (direta ou inversa: tabela, gráfico e o que fica constante), SIM.mbDivide (dividir em partes proporcionais)
   e SIM.mbPorcento (aumentos e descontos em sequência). Contas conferidas em Python (tools/matematica/confere-mb.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb;
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const T = (x, y, s, o) => `<text x="${x}" y="${y}" text-anchor="${(o && o.a) || "middle"}" style="font:${(o && o.w) || 500} ${(o && o.f) || 13}px Inter,system-ui,sans-serif;fill:${(o && o.c) || "var(--ink)"}">${s}</text>`;
  /* tabela: cab = títulos das linhas (à esquerda), cols = colunas de valores (cada uma, um vetor com um valor por linha) */
  M.tabela = (cab, cols, D, o) => { const L = (o && o.larg) || 150, w = Math.min((o && o.w) || 70, (500 - L) / cols.length), x0 = (560 - L - w * cols.length) / 2, h = 34; let s = "";
    cab.forEach((c, i) => { s += `<rect x="${x0}" y="${8 + i * h}" width="${L}" height="${h}" style="fill:var(--card2);stroke:var(--line)"/>` + T(x0 + L / 2, 30 + i * h, c, { w: 600, c: "var(--ink2)" }); cols.forEach((col, j) => { s += `<rect x="${x0 + L + j * w}" y="${8 + i * h}" width="${w}" height="${h}" style="fill:none;stroke:var(--line)"/>` + T(x0 + L + j * w + w / 2, 30 + i * h, col[i], { w: 600, f: 15 }); }); });
    return D.svg(560, 16 + cab.length * h, s, "figura"); };
  /* partes: divide o total em partes proporcionais aos pesos (ou aos inversos deles); devolve frações exatas */
  M.partes = (total, pesos, inv) => { const w = pesos.map((p) => (inv ? M.fr(1, p) : M.fr(p, 1))), s = w.reduce((a, b) => M.soma(a, b)); return w.map((x) => M.mul(M.fr(total, 1), M.div(x, s))); };
  /* fator de uma sequência de variações percentuais: fator([20, -20]) = 24/25 */
  M.fator = (ps) => ps.reduce((f, p) => M.mul(f, M.fr(100 + p, 100)), M.fr(1, 1));
  /* barra cortada em partes: rots em cima de cada parte */
  M.fitaPartes = (vals, rots, D, o) => { const tot = vals.reduce((a, b) => a + b, 0); let x = 40, s = ""; vals.forEach((v, i) => { const w = (v / tot) * 480; s += `<rect x="${x}" y="26" width="${w}" height="38" rx="4" style="fill:${M.COR[i % M.COR.length]};opacity:.82;stroke:var(--bg);stroke-width:2"/>` + T(x + w / 2, 50, rots[i], { w: 700, f: 14, c: "#fff" }); x += w; });
    return D.svg(560, (o && o.sub ? 96 : 76), s + (o && o.topo ? T(280, 16, o.topo, { c: "var(--ink2)" }) : "") + (o && o.sub ? T(280, 86, o.sub, { c: "var(--ink2)" }) : ""), "figura"); };

  /* nome: "Direta ou inversa: o que fica constante?" · matéria: Matemática · tema: MB04 */
  SIM.mbProporcao = (el, F) => { let tipo = "dir", k = 3, x = 2;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-t="dir">diretamente proporcional</button><button class="bt peq" data-t="inv">inversamente proporcional</button><label style="font-size:13px;color:var(--ink2)">x <input type="range" data-v="x" min="1" max="12" step="1" value="2" style="vertical-align:middle;width:200px"></label></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const v = tipo === "dir" ? k * x : 36 / x; return { tipo, k: tipo === "dir" ? k : 36, x, y: v, quoc: v / x, prod: v * x }; };
    const poe = (o) => { ({ tipo, x } = { tipo, x, ...o }); x = Math.max(1, Math.min(12, Math.round(+x))); desenha(); };
    const desenha = () => { const e = est(), ymax = 40, X = (v) => 60 + (v / 12) * 440, Y = (v) => 190 - (Math.min(v, ymax) / ymax) * 170; q("[data-v=x]").value = String(x); el.querySelectorAll("[data-t]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.t === tipo)));
      let o = `<line x1="60" y1="190" x2="510" y2="190" style="stroke:var(--ink3);stroke-width:1.4"/><line x1="60" y1="190" x2="60" y2="14" style="stroke:var(--ink3);stroke-width:1.4"/>` + T(520, 194, "x", { c: "var(--ink2)" }) + T(60, 10, "y", { c: "var(--ink2)" });
      for (let v = 10; v <= 40; v += 10) o += `<line x1="56" y1="${Y(v)}" x2="500" y2="${Y(v)}" style="stroke:var(--line2);stroke-dasharray:3 4"/>` + T(50, Y(v) + 4, v, { a: "end", f: 11, c: "var(--ink2)" });
      let d = ""; for (let v = tipo === "dir" ? 0 : 0.9; v <= 12.001; v += 0.1) { const yy = tipo === "dir" ? k * v : 36 / v; d += `${d ? "L" : "M"}${X(v).toFixed(1)} ${Y(yy).toFixed(1)}`; }
      o += `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2;opacity:.55"/>`;
      for (let v = 1; v <= 12; v++) { const yy = tipo === "dir" ? k * v : 36 / v; o += (yy <= ymax ? `<circle cx="${X(v)}" cy="${Y(yy)}" r="${v === x ? 7 : 3.5}" style="fill:${v === x ? "var(--warn)" : "var(--mod)"}"/>` : "") + T(X(v), 206, v, { f: 11, c: v === x ? "var(--warn)" : "var(--ink2)", w: v === x ? 700 : 500 }); }
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 214" width="100%" style="max-width:560px">${o}</svg>`;
      q("[data-v=lt]").innerHTML = vis("x", x) + vis("y", F.nt(e.y, 2)) + vis("y ÷ x", F.nt(e.quoc, 3)) + vis("x · y", F.nt(e.prod, 2));
      q("[data-v=st]").innerHTML = tipo === "dir" ? `Diretamente proporcional: o <b>quociente</b> y ÷ x não muda (aqui, sempre ${k}). Dobrando x, y dobra; o gráfico é uma reta que passa pela origem. Já o produto x · y muda a cada passo.` : `Inversamente proporcional: o <b>produto</b> x · y não muda (aqui, sempre 36). Dobrando x, y cai para a metade; o gráfico é uma curva que desce sem nunca tocar o eixo. Já o quociente y ÷ x muda a cada passo.`; };
    el.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => poe({ tipo: b.dataset.t }))); q("[data-v=x]").addEventListener("input", (ev) => poe({ x: ev.target.value }));
    SIM.mbProporcao._ult = { poe, est }; desenha(); };

  /* nome: "Divida em partes proporcionais" · matéria: Matemática · tema: MB04 */
  SIM.mbDivide = (el, F) => { let total = 120, p = [1, 2, 3], inv = false;
    const sel = (i) => `<select data-p="${i}" class="bt peq" style="font-size:15px">${[1, 2, 3, 4, 5, 6].map((v) => `<option>${v}</option>`).join("")}</select>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">total <input type="number" data-v="t" min="1" max="9999" value="120" class="bt peq" style="width:72px;font-size:15px"></label><span style="font-size:13px;color:var(--ink2)">pesos</span>${sel(0)}${sel(1)}${sel(2)}</div><div class="bts" style="margin-top:6px"><button class="bt peq" data-m="0">direta</button><button class="bt peq" data-m="1">inversa</button></div></div></div><div class="palco" data-v="pal" style="padding:8px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const pt = M.partes(total, p, inv); return { total, p: p.slice(), inv, partes: pt.map(M.txt), val: pt.map(M.val), soma: M.txt(pt.reduce((a, b) => M.soma(a, b))) }; };
    const poe = (o) => { ({ total, p, inv } = { total, p, inv, ...o }); total = Math.max(1, Math.min(9999, Math.round(+total) || 1)); p = p.map((v) => Math.max(1, Math.min(6, Math.round(+v) || 1))); inv = !!inv; desenha(); };
    const desenha = () => { const e = est(); q("[data-v=t]").value = String(total); el.querySelectorAll("[data-p]").forEach((s, i) => (s.value = String(p[i]))); el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(!!+b.dataset.m === inv)));
      let x = 40, o = ""; e.val.forEach((v, i) => { const w = (v / total) * 480; o += `<rect x="${x}" y="30" width="${w}" height="44" rx="4" style="fill:${M.COR[i % M.COR.length]};opacity:.85;stroke:var(--bg);stroke-width:2"/>` + T(x + w / 2, 58, F.nt(v, 2), { w: 700, f: w < 60 ? 11 : 15, c: "#fff" }) + T(x + w / 2, 20, `peso ${p[i]}`, { f: 12, c: "var(--ink2)" }); x += w; });
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 84" width="100%" style="max-width:560px">${o}</svg>`;
      q("[data-v=lt]").innerHTML = e.partes.map((t, i) => vis(`parte ${i + 1}`, t)).join("") + vis("soma", e.soma);
      const sp = p.reduce((a, b) => a + b, 0);
      q("[data-v=st]").innerHTML = inv ? `Inversamente proporcional: quem tem o maior peso recebe a <b>menor</b> parte. Divide-se em partes proporcionais aos inversos, 1/${p[0]}, 1/${p[1]} e 1/${p[2]}; as partes continuam somando ${total}.` : `Diretamente proporcional: ${p.join(" + ")} = ${sp} cotas iguais. Cada cota vale ${total} ÷ ${sp} = ${F.nt(total / sp, 2)}, e cada parte recebe tantas cotas quanto o seu peso.`; };
    q("[data-v=t]").addEventListener("change", (ev) => poe({ total: ev.target.value })); el.querySelectorAll("[data-p]").forEach((s, i) => s.addEventListener("change", (ev) => { const n = p.slice(); n[i] = ev.target.value; poe({ p: n }); })); el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => poe({ inv: !!+b.dataset.m })));
    SIM.mbDivide._ult = { poe, est }; desenha(); };

  /* nome: "Aumentos e descontos em sequência" · matéria: Matemática · tema: MB04 */
  SIM.mbPorcento = (el, F) => { let p1 = 20, p2 = -20;
    const sl = (i, v) => `<label style="font-size:13px;color:var(--ink2)">${i}ª variação <input type="range" data-p="${i}" min="-50" max="100" step="5" value="${v}" style="vertical-align:middle;width:170px"> <b data-r="${i}" style="color:var(--ink);display:inline-block;width:52px"></b></label>`;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl(1, 20)}${sl(2, -20)}</div></div></div><div class="palco" data-v="pal" style="padding:8px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), pc = (v) => (v > 0 ? "+" : v < 0 ? "−" : "") + F.nt(Math.abs(v), 2) + "%";
    const est = () => { const f = M.fator([p1, p2]), meio = 100 + p1, fim = M.val(f) * 100; return { p1, p2, fator: M.txt(f), meio, fim, total: fim - 100, ingenuo: p1 + p2 }; };
    const poe = (o) => { ({ p1, p2 } = { p1, p2, ...o }); const aj = (v) => Math.max(-50, Math.min(100, Math.round(+v / 5) * 5)); p1 = aj(p1); p2 = aj(p2); desenha(); };
    const desenha = () => { const e = est(); q("[data-p='1']").value = String(p1); q("[data-p='2']").value = String(p2); q("[data-r='1']").textContent = pc(p1); q("[data-r='2']").textContent = pc(p2);
      const W = (v) => (v / 400) * 420; let o = ""; [["começo", 100], ["depois da 1ª", e.meio], ["depois da 2ª", e.fim]].forEach(([r, v], i) => { o += T(118, 30 + i * 40, r, { a: "end", f: 12, c: "var(--ink2)" }) + `<rect x="126" y="14" width="${W(v)}" height="24" rx="4" transform="translate(0 ${i * 40})" style="fill:${M.COR[i]};opacity:.85"/>` + T(132 + W(v), 31 + i * 40, F.nt(v, 2), { a: "start", w: 700 }); });
      o += `<line x1="${126 + W(100)}" y1="8" x2="${126 + W(100)}" y2="128" style="stroke:var(--ink3);stroke-dasharray:3 4"/>`;
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 134" width="100%" style="max-width:560px">${o}</svg>`;
      q("[data-v=lt]").innerHTML = vis("fator total", F.nt(e.fim / 100, 4)) + vis("variação real", pc(e.total)) + vis("somando as taxas", pc(e.ingenuo));
      const dif = Math.abs(e.total - e.ingenuo) > 1e-9;
      q("[data-v=st]").innerHTML = `Cada variação multiplica o valor por um fator: ${F.nt(1 + p1 / 100, 2)} e depois ${F.nt(1 + p2 / 100, 2)}. O produto é ${F.nt(e.fim / 100, 4)}, isto é, ${pc(e.total)} no total. ` + (dif ? `Somar as taxas daria ${pc(e.ingenuo)}, que está <b>errado</b>: a segunda taxa incide sobre o valor já alterado, não sobre o do começo.` : `Aqui somar as taxas dá o mesmo, porque uma das variações é zero.`) + (p1 === -p2 && p1 !== 0 ? ` Subir e depois descer a mesma taxa não devolve o valor: perde-se ${F.nt((p1 * p1) / 100, 2)}%.` : ""); };
    el.querySelectorAll("[data-p]").forEach((s) => s.addEventListener("input", (ev) => poe(s.dataset.p === "1" ? { p1: ev.target.value } : { p2: ev.target.value })));
    SIM.mbPorcento._ult = { poe, est }; desenha(); };
})();
