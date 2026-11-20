/* Matemática · módulo AR (Aritmética): laboratórios do EF01 (porcentagem), EF02 (juros), EF03 (estatística) e EF04 (desigualdade das médias).
   Acrescenta ao núcleo SIM.ar: fatorP (fator de uma variação percentual), cadeia (valores depois de variações em sequência), desfaz (percentual que desfaz outro),
   colunas (gráfico de colunas simples em SVG) e pc (escreve um percentual com vírgula).
   Contas conferidas em Python (tools/matematica/confere-ar.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb, A = SIM.al, R = SIM.ar, { vis, T, mn } = A, sl = R.sl;
  const nt = (v, d = 2) => (+(+v).toFixed(d)).toLocaleString("pt-BR", { maximumFractionDigits: d }).replace("-", "−");
  R.nt = nt; R.pc = (v, d = 2) => nt(v, d) + "%";

  /* ---------- EF01 ---------- */
  R.fatorP = (p) => 1 + p / 100;
  R.cadeia = (v0, ps) => ps.reduce((l, p) => l.concat([l[l.length - 1] * R.fatorP(p)]), [v0]);
  /* variação (em %) que, aplicada depois de p%, devolve o valor inicial */
  R.desfaz = (p) => (100 / (100 + p) - 1) * 100;
  /* colunas: o = { vals, rots, h, cores, max, un } */
  R.colunas = (o, D) => { const W = 560, H = o.h || 200, n = o.vals.length, mx = o.max || Math.max(...o.vals, 1e-9), bw = Math.min(90, Math.floor(440 / n) - 14), x0 = (W - n * (bw + 14) + 14) / 2, y0 = H - 30, e = (y0 - 26) / mx; let s = `<line x1="40" y1="${y0}" x2="${W - 40}" y2="${y0}" style="stroke:var(--ink3)"/>`;
    o.vals.forEach((v, i) => { const x = x0 + i * (bw + 14), h = Math.max(0, v * e); s += `<rect x="${x}" y="${(y0 - h).toFixed(1)}" width="${bw}" height="${h.toFixed(1)}" rx="4" style="fill:${(o.cores && o.cores[i]) || "var(--mod)"};fill-opacity:.8"/>` + T(x + bw / 2, y0 - h - 6, (o.txt && o.txt[i]) || nt(v), { f: 12, w: 700 }) + T(x + bw / 2, y0 + 16, (o.rots && o.rots[i]) || "", { f: 11, c: "var(--ink2)" }); });
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`; };

  /* nome: "Variações em sequência: os fatores se multiplicam" · matéria: Matemática · tema: EF01 */
  SIM.arFatores = (el, F) => { let p1 = 20, p2 = -20, p3 = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("p1", "1ª variação (%)", -60, 100, p1, 150)}${sl("p2", "2ª variação (%)", -60, 100, p2, 150)}${sl("p3", "3ª variação (%)", -60, 100, p3, 150)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), sinal = (p) => (p >= 0 ? "+" : "−") + Math.abs(p) + "%";
    const est = () => { const vals = R.cadeia(100, [p1, p2, p3]), fator = R.fatorP(p1) * R.fatorP(p2) * R.fatorP(p3); return { p1, p2, p3, vals, fator, total: (fator - 1) * 100, soma: p1 + p2 + p3, final: vals[3] }; };
    const poe = (o) => { ({ p1, p2, p3 } = { p1, p2, p3, ...o }); [p1, p2, p3] = [p1, p2, p3].map((v) => Math.max(-60, Math.min(100, Math.round(+v)))); desenha(); };
    const desenha = () => { const e = est(); ["p1", "p2", "p3"].forEach((k) => { q(`[data-v=${k}]`).value = String({ p1, p2, p3 }[k]); q(`[data-r=${k}]`).textContent = mn({ p1, p2, p3 }[k]); });
      q("[data-v=pal]").innerHTML = R.colunas({ vals: e.vals, rots: ["início", sinal(p1), sinal(p2), sinal(p3)], max: Math.max(...e.vals, 100) * 1.05, cores: ["var(--ink3)", "var(--mod)", "var(--mod)", "var(--ok)"] }, null);
      q("[data-v=lt]").innerHTML = vis("fatores", [p1, p2, p3].map((p) => nt(R.fatorP(p))).join(" · ")) + vis("fator total", nt(e.fator, 4)) + vis("variação total", (e.total >= 0 ? "+" : "") + R.pc(e.total)) + vis("somando os %", (e.soma >= 0 ? "+" : "") + mn(e.soma) + "%");
      q("[data-v=st]").innerHTML = `Partindo de 100: ${e.vals.map((v) => nt(v)).join(" → ")}. Cada variação age sobre o valor <b>que encontra</b>, não sobre o valor inicial; por isso multiplicam-se os fatores em vez de somar os percentuais. ${Math.abs(e.total - e.soma) < 1e-9 ? "Aqui as duas contas coincidem (só uma variação é diferente de zero)." : `Somar daria ${e.soma >= 0 ? "+" : ""}${mn(e.soma)}%, mas o resultado real é ${e.total >= 0 ? "+" : ""}${R.pc(e.total)}.`} ${p1 === -p2 && p3 === 0 && p1 !== 0 ? `Subir ${Math.abs(p1)}% e descer ${Math.abs(p1)}% não empata: sobra uma perda de ${nt((p1 * p1) / 100)}%, em qualquer ordem.` : ""}`; };
    ["p1", "p2", "p3"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.arFatores._ult = { poe, est }; desenha(); };

  /* nome: "Quanto precisa descer para desfazer uma subida?" · matéria: Matemática · tema: EF01 */
  SIM.arDesfaz = (el, F) => { let p = 25;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("p", "variação inicial (%)", -80, 200, p, 230)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const meio = 100 * R.fatorP(p), d = R.desfaz(p); return { p, meio, volta: d, final: meio * R.fatorP(d), ingenuo: meio * R.fatorP(-p) }; };
    const poe = (o) => { ({ p } = { p, ...o }); p = Math.max(-80, Math.min(200, Math.round(+p))); desenha(); };
    const desenha = () => { const e = est(); q("[data-v=p]").value = String(p); q("[data-r=p]").textContent = mn(p);
      q("[data-v=pal]").innerHTML = R.colunas({ vals: [100, e.meio, e.final, e.ingenuo], rots: ["início", `${p >= 0 ? "+" : "−"}${Math.abs(p)}%`, `depois de ${e.volta >= 0 ? "+" : "−"}${nt(Math.abs(e.volta))}%`, `se fosse ${p >= 0 ? "−" : "+"}${Math.abs(p)}%`], max: Math.max(100, e.meio, e.ingenuo) * 1.08, cores: ["var(--ink3)", "var(--mod)", "var(--ok)", "var(--bad)"] }, null);
      q("[data-v=lt]").innerHTML = vis("depois da 1ª variação", nt(e.meio)) + vis("variação que desfaz", (e.volta >= 0 ? "+" : "") + R.pc(e.volta)) + vis("com o mesmo % ao contrário", nt(e.ingenuo));
      q("[data-v=st]").innerHTML = p === 0 ? "Sem variação, nada a desfazer." : `Depois de ${p > 0 ? "subir" : "descer"} ${Math.abs(p)}%, o valor é ${nt(e.meio)}. Para voltar a 100 é preciso ${p > 0 ? "descer" : "subir"} ${nt(Math.abs(100 - e.meio))}, mas agora <b>sobre ${nt(e.meio)}</b>: ${nt(Math.abs(100 - e.meio))} ÷ ${nt(e.meio)} = ${R.pc(Math.abs(e.volta))}. O percentual da volta é ${p > 0 ? "menor" : "maior"} que o da ida, porque a base mudou. Usar ${Math.abs(p)}% na volta levaria a ${nt(e.ingenuo)}, não a 100.`; };
    q("[data-v=p]").addEventListener("input", (ev) => poe({ p: ev.target.value }));
    SIM.arDesfaz._ult = { poe, est }; desenha(); };
})();
