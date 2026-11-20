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

  /* ---------- EF02 ---------- */
  R.simples = (C, i, t) => C * (1 + (i / 100) * t);
  R.compostos = (C, i, t) => C * (1 + i / 100) ** t;
  /* valor hoje de um pagamento F feito daqui a t períodos, à taxa i% por período */
  R.presente = (Fv, i, t) => Fv / (1 + i / 100) ** t;
  /* primeiro número inteiro de períodos em que o montante composto chega a k vezes o capital */
  R.tempoMult = (i, k) => { let t = 0, m = 1; while (m < k - 1e-12 && t < 100000) { m *= 1 + i / 100; t++; } return t; };
  /* duas curvas em degraus (pontos ligados): o = { series: [{ vals, cor, rot }], h, rx } */
  R.linhas = (o, D) => { const W = 560, H = o.h || 220, x0 = 56, x1 = W - 20, y0 = H - 30, y1 = 16, n = o.series[0].vals.length - 1, mx = Math.max(...o.series.flatMap((s) => s.vals)) * 1.05, mnv = o.zero === false ? Math.min(...o.series.flatMap((s) => s.vals)) * 0.95 : 0, X = (k) => x0 + (k / Math.max(1, n)) * (x1 - x0), Y = (v) => y0 - ((v - mnv) / (mx - mnv)) * (y0 - y1); let s = `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" style="stroke:var(--ink3)"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" style="stroke:var(--ink3)"/>`;
    const passo = Math.max(1, Math.ceil(n / 12)); for (let k = 0; k <= n; k += passo) s += T(X(k), y0 + 15, k, { f: 10, c: "var(--ink3)" });
    [mnv, (mnv + mx) / 2, mx / 1.05].forEach((v) => (s += (o.semY ? "" : T(x0 - 6, Y(v) + 4, nt(v, 0), { f: 10, c: "var(--ink3)", a: "end" })) + `<line x1="${x0}" y1="${Y(v)}" x2="${x1}" y2="${Y(v)}" style="stroke:var(--line);stroke-dasharray:3 4"/>`));
    o.series.forEach((sr) => { s += `<polyline points="${sr.vals.map((v, k) => X(k).toFixed(1) + "," + Y(v).toFixed(1)).join(" ")}" style="fill:none;stroke:${sr.cor};stroke-width:2.4"/>` + sr.vals.map((v, k) => (n <= 24 ? `<circle cx="${X(k).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3" style="fill:${sr.cor}"/>` : "")).join("") + T(x1 - 4, Y(sr.vals[n]) - 8, sr.rot, { f: 11, w: 700, c: sr.cor, a: "end" }); });
    s += T((x0 + x1) / 2, H - 2, o.rx || "períodos", { f: 10, c: "var(--ink3)" });
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`; };

  /* nome: "Juros simples × juros compostos: a reta e a curva" · matéria: Matemática · tema: EF02 */
  SIM.arJuros = (el, F) => { let C = 1000, i = 10, t = 10;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("C", "capital (reais)", 100, 5000, C, 150)}${sl("i", "taxa por período (%)", 1, 30, i, 130)}${sl("t", "períodos", 1, 40, t, 130)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const ks = Array.from({ length: t + 1 }, (_, k) => k), s = ks.map((k) => R.simples(C, i, k)), c = ks.map((k) => R.compostos(C, i, k)); return { C, i, t, simples: s, compostos: c, Ms: s[t], Mc: c[t], diferenca: c[t] - s[t], dobraS: Math.ceil(100 / i), dobraC: R.tempoMult(i, 2) }; };
    const poe = (o) => { ({ C, i, t } = { C, i, t, ...o }); C = Math.max(100, Math.min(5000, Math.round(+C / 100) * 100)); i = Math.max(1, Math.min(30, Math.round(+i))); t = Math.max(1, Math.min(40, Math.round(+t))); desenha(); };
    const desenha = () => { const e = est(); q("[data-v=C]").step = "100"; ["C", "i", "t"].forEach((k) => { q(`[data-v=${k}]`).value = String({ C, i, t }[k]); q(`[data-r=${k}]`).textContent = { C, i, t }[k]; });
      q("[data-v=pal]").innerHTML = R.linhas({ series: [{ vals: e.simples, cor: "var(--ok)", rot: "simples" }, { vals: e.compostos, cor: "var(--warn)", rot: "compostos" }], h: 240 }, null);
      q("[data-v=lt]").innerHTML = vis("montante simples", nt(e.Ms)) + vis("montante composto", nt(e.Mc)) + vis("diferença", nt(e.diferenca)) + vis("dobra em (simples / compostos)", `${e.dobraS} / ${e.dobraC}`);
      q("[data-v=st]").innerHTML = `Juros simples: todo período rende o mesmo, ${nt((C * i) / 100)} reais (${i}% do capital <b>inicial</b>): os montantes formam uma PA e o gráfico é uma reta. Juros compostos: cada período rende ${i}% do montante <b>do momento</b>, juros sobre juros: os montantes formam uma PG e o gráfico se curva para cima. ${t === 1 ? "Com um período só, os dois dão exatamente o mesmo." : `Em ${t} períodos a diferença já é de ${nt(e.diferenca)} reais.`}`; };
    ["C", "i", "t"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.arJuros._ult = { poe, est }; desenha(); };

  /* nome: "À vista ou em duas vezes? Trazer tudo para hoje" · matéria: Matemática · tema: EF02 */
  SIM.arPresente = (el, F) => { let d = 5, i = 2, P = 1000;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("d", "desconto à vista (%)", 0, 20, d, 150)}${sl("i", "meu dinheiro rende (% ao mês)", 0, 10, i, 150)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const avista = P * (1 - d / 100), p1 = P / 2, p2 = P / 2, hoje2 = R.presente(p2, i, 1), prazo = p1 + hoje2; return { d, i, P, avista, prazoHoje: prazo, segundaHoje: hoje2, melhor: Math.abs(avista - prazo) < 1e-9 ? "empate" : avista < prazo ? "à vista" : "a prazo", sobra: prazo - avista }; };
    const poe = (o) => { ({ d, i } = { d, i, ...o }); d = Math.max(0, Math.min(20, Math.round(+d))); i = Math.max(0, Math.min(10, Math.round(+i))); desenha(); };
    const desenha = () => { const e = est(); ["d", "i"].forEach((k) => { q(`[data-v=${k}]`).value = String({ d, i }[k]); q(`[data-r=${k}]`).textContent = { d, i }[k]; });
      q("[data-v=pal]").innerHTML = R.colunas({ vals: [e.avista, P / 2, e.segundaHoje], rots: ["à vista, hoje", "1ª parcela, hoje", "2ª parcela, trazida para hoje"], cores: ["var(--ok)", "var(--mod)", "var(--mod)"], max: P * 1.05 }, null);
      q("[data-v=lt]").innerHTML = vis("à vista", nt(e.avista)) + vis("a prazo, em valor de hoje", nt(e.prazoHoje)) + vis("melhor", e.melhor);
      q("[data-v=st]").innerHTML = `O produto custa ${nt(P)} reais em duas parcelas de ${nt(P / 2)} (uma hoje, outra em 30 dias), ou ${nt(e.avista)} à vista. Não se somam reais de datas diferentes: a segunda parcela, de ${nt(P / 2)}, vale <b>hoje</b> só ${nt(e.segundaHoje)}, porque essa quantia, rendendo ${i}% ao mês, vira ${nt(P / 2)} daqui a um mês. Em valor de hoje, o plano a prazo custa ${nt(e.prazoHoje)}. ${e.melhor === "empate" ? "As duas opções empatam." : e.melhor === "à vista" ? `À vista sai ${nt(e.sobra)} reais mais barato.` : `A prazo sai ${nt(-e.sobra)} reais mais barato.`}`; };
    ["d", "i"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.arPresente._ult = { poe, est }; desenha(); };

  /* ---------- EF03 ---------- */
  /* resumo de uma lista de números (variância e desvio padrão POPULACIONAIS: divide-se por n) */
  R.est = (v) => { const n = v.length, o = v.slice().sort((a, b) => a - b), soma = v.reduce((a, b) => a + b, 0), media = soma / n, mediana = n % 2 ? o[(n - 1) / 2] : (o[n / 2 - 1] + o[n / 2]) / 2, cont = new Map(); v.forEach((x) => cont.set(x, (cont.get(x) || 0) + 1)); const mx = Math.max(...cont.values()), modas = mx === 1 ? [] : [...cont.entries()].filter(([, c]) => c === mx).map(([x]) => x).sort((a, b) => a - b);
    const dm = v.reduce((t, x) => t + Math.abs(x - media), 0) / n, vari = v.reduce((t, x) => t + (x - media) ** 2, 0) / n; return { n, soma, ord: o, media, mediana, modas, freqMax: mx, amp: o[n - 1] - o[0], dm, var: vari, dp: Math.sqrt(vari), desvios: v.map((x) => x - media) }; };
  /* o mesmo, a partir de valores e frequências */
  R.estF = (xs, fs) => R.est(xs.flatMap((x, i) => Array(fs[i]).fill(x)));
  /* pontos empilhados sobre uma reta, com a média (triângulo) e a mediana (traço). o = { min, max, media, mediana, h, semMarcas } */
  R.pontosFig = (v, D, o = {}) => { const W = 560, H = o.h || 150, x0 = 40, x1 = 520, mn0 = o.min === undefined ? Math.floor(Math.min(...v)) - 1 : o.min, mx0 = o.max === undefined ? Math.ceil(Math.max(...v)) + 1 : o.max, X = (x) => x0 + ((x - mn0) / (mx0 - mn0)) * (x1 - x0), y0 = H - 40, pilha = new Map(); let s = `<line x1="${x0 - 10}" y1="${y0}" x2="${x1 + 10}" y2="${y0}" style="stroke:var(--ink2);stroke-width:1.5"/>`;
    const passo = Math.max(1, Math.ceil((mx0 - mn0) / 20)); for (let k = Math.ceil(mn0); k <= mx0; k += passo) s += `<line x1="${X(k)}" y1="${y0 - 3}" x2="${X(k)}" y2="${y0 + 3}" style="stroke:var(--ink3)"/>` + T(X(k), y0 + 16, mn(k), { f: 10, c: "var(--ink3)" });
    v.forEach((x) => { const k = pilha.get(x) || 0; pilha.set(x, k + 1); s += `<circle cx="${X(x).toFixed(1)}" cy="${y0 - 10 - k * 15}" r="6.5" style="fill:var(--mod);fill-opacity:.85;stroke:var(--bg);stroke-width:1.5"/>`; });
    if (!o.semMarcas) { const e = R.est(v); s += `<polygon points="${X(e.media)},${y0 + 20} ${X(e.media) - 8},${y0 + 34} ${X(e.media) + 8},${y0 + 34}" style="fill:var(--warn)"/>` + T(X(e.media) + 12, y0 + 34, "média", { f: 10, c: "var(--warn)", a: "start" }) + `<line x1="${X(e.mediana)}" y1="${y0 - 6}" x2="${X(e.mediana)}" y2="${12}" style="stroke:var(--ok);stroke-width:2;stroke-dasharray:5 4"/>` + T(X(e.mediana), 10, "mediana", { f: 10, c: "var(--ok)" }); }
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`; };

  /* nome: "Seis números: mexa num e veja o que muda" · matéria: Matemática · tema: EF03 */
  SIM.arDados = (el, F) => { let v = [2, 4, 4, 5, 7, 8];
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${v.map((x, i) => sl("x" + i, "x" + R.sub(i + 1), 0, 20, x, 90)).join("")}</div><div class="bts" style="margin-top:6px"><button class="bt peq" data-b="mais">somar 3 a todos</button><button class="bt peq" data-b="vezes">dobrar todos</button><button class="bt peq" data-b="zera">voltar ao começo</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => Object.assign({ v: v.slice() }, R.est(v));
    const poe = (o) => { if (o.v) v = o.v.slice(0, 6); v = v.map((x) => Math.max(0, Math.min(20, Math.round(+x)))); while (v.length < 6) v.push(0); desenha(); };
    const desenha = () => { const e = est(); v.forEach((x, i) => { q(`[data-v=x${i}]`).value = String(x); q(`[data-r=x${i}]`).textContent = x; });
      q("[data-v=pal]").innerHTML = R.pontosFig(v, null, { min: 0, max: 20, h: 170 });
      q("[data-v=lt]").innerHTML = vis("média", nt(e.media)) + vis("mediana", nt(e.mediana)) + vis("moda", e.modas.length ? e.modas.join(" e ") : "não há") + vis("amplitude", nt(e.amp)) + vis("desvio médio", nt(e.dm)) + vis("variância", nt(e.var)) + vis("desvio padrão", nt(e.dp));
      q("[data-v=st]").innerHTML = `Em ordem: ${e.ord.join(", ")}. A média (${nt(e.media)}) é o ponto de equilíbrio: os desvios ${e.desvios.map((d) => (d > 0 ? "+" : d < 0 ? "−" : "") + nt(Math.abs(d))).join(", ")} somam zero. A mediana (${nt(e.mediana)}) deixa três valores de cada lado. Amplitude é a distância entre o maior e o menor; desvio médio é a distância média <b>até a média</b>: são coisas diferentes. Puxe um valor para longe: a média vai atrás, a mediana quase não se mexe.`; };
    v.forEach((_, i) => q(`[data-v=x${i}]`).addEventListener("input", (ev) => { const n = v.slice(); n[i] = ev.target.value; poe({ v: n }); }));
    el.querySelectorAll("[data-b]").forEach((b) => b.addEventListener("click", () => poe({ v: b.dataset.b === "mais" ? v.map((x) => x + 3) : b.dataset.b === "vezes" ? v.map((x) => x * 2) : [2, 4, 4, 5, 7, 8] })));
    SIM.arDados._ult = { poe, est }; desenha(); };

  /* nome: "Tabela de frequências: média e variância com pesos" · matéria: Matemática · tema: EF03 */
  SIM.arFreq = (el, F) => { const xs = [4, 5, 6, 7, 8, 9]; let fs = [1, 3, 6, 5, 3, 2];
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${xs.map((x, i) => sl("f" + i, `nota ${x}: quantos`, 0, 12, fs[i], 80)).join("")}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const n = fs.reduce((a, b) => a + b, 0); if (!n) return { fs: fs.slice(), n: 0, vazio: true }; const e = R.estF(xs, fs), sxf = xs.reduce((t, x, i) => t + x * fs[i], 0), sx2f = xs.reduce((t, x, i) => t + x * x * fs[i], 0); return Object.assign({ fs: fs.slice(), xs, sxf, sx2f, atalho: sx2f / n - (sxf / n) ** 2 }, e); };
    const poe = (o) => { if (o.fs) fs = o.fs.slice(0, 6); fs = fs.map((x) => Math.max(0, Math.min(12, Math.round(+x)))); desenha(); };
    const desenha = () => { const e = est(); fs.forEach((f, i) => { q(`[data-v=f${i}]`).value = String(f); q(`[data-r=f${i}]`).textContent = f; });
      q("[data-v=pal]").innerHTML = R.colunas({ vals: fs, rots: xs.map((x) => "nota " + x), max: Math.max(...fs, 1) * 1.15, txt: fs.map(String) }, null);
      q("[data-v=lt]").innerHTML = e.vazio ? vis("alunos", 0) : vis("alunos", e.n) + vis("soma das notas", e.sxf) + vis("média", nt(e.media)) + vis("mediana", nt(e.mediana)) + vis("moda", e.modas.length ? e.modas.join(" e ") : "não há") + vis("variância", nt(e.var)) + vis("desvio padrão", nt(e.dp));
      q("[data-v=st]").innerHTML = e.vazio ? "Ponha pelo menos um aluno." : `Cada nota conta tantas vezes quantos alunos a tiraram: soma = ${xs.map((x, i) => (fs[i] ? `${x} · ${fs[i]}` : null)).filter(Boolean).join(" + ")} = ${e.sxf}, e a média é ${e.sxf} ÷ ${e.n} = ${nt(e.media)}. Divide-se pelo número de <b>alunos</b> (${e.n}), não pelo número de linhas da tabela (6). Para a variância, o atalho: média dos quadrados menos o quadrado da média = ${nt(e.sx2f / e.n)} − ${nt(e.media ** 2)} = ${nt(e.atalho)}.`; };
    xs.forEach((_, i) => q(`[data-v=f${i}]`).addEventListener("input", (ev) => { const n = fs.slice(); n[i] = ev.target.value; poe({ fs: n }); }));
    SIM.arFreq._ult = { poe, est }; desenha(); };

  /* ---------- EF04 ---------- */
  /* as quatro médias de uma lista de números positivos */
  R.medias = (v) => { const n = v.length; return { ma: v.reduce((a, b) => a + b, 0) / n, mg: Math.pow(v.reduce((a, b) => a * b, 1), 1 / n), mh: n / v.reduce((a, b) => a + 1 / b, 0), mq: Math.sqrt(v.reduce((a, b) => a + b * b, 0) / n) }; };
  /* semicírculo de diâmetro a + b: o raio é a média aritmética e a altura no ponto de emenda é a geométrica. o = { semNum } */
  R.semiFig = (a, b, D, o = {}) => { const W = 560, H = o.h || 240, d = a + b, k = 360 / d, x0 = 100, y0 = H - 40, r = (d / 2) * k, cx = x0 + r, px = x0 + a * k, hg = Math.sqrt(a * b) * k, ma = d / 2, mg = Math.sqrt(a * b), e = 1, Y = (h) => y0 - h * e;
    let s = `<path d="M ${x0} ${y0} A ${r} ${r * e} 0 0 1 ${x0 + 2 * r} ${y0}" style="fill:var(--mod);fill-opacity:.08;stroke:var(--ink3);stroke-width:1.5"/><line x1="${x0}" y1="${y0}" x2="${x0 + 2 * r}" y2="${y0}" style="stroke:var(--ink2);stroke-width:1.5"/>`;
    s += `<line x1="${px}" y1="${y0}" x2="${px}" y2="${Y(hg)}" style="stroke:var(--warn);stroke-width:3"/><line x1="${cx}" y1="${y0}" x2="${cx}" y2="${Y(r)}" style="stroke:var(--ok);stroke-width:3"/><circle cx="${px}" cy="${y0}" r="3.5" style="fill:var(--ink2)"/>`;
    s += T((x0 + px) / 2, y0 + 18, o.semNum ? "a" : "a = " + nt(a), { f: 12, c: "var(--ink2)" }) + T((px + x0 + 2 * r) / 2, y0 + 18, o.semNum ? "b" : "b = " + nt(b), { f: 12, c: "var(--ink2)" });
    const lado = px <= cx ? -1 : 1; s += T(cx - lado * 8, Y(r / 2), o.semNum ? "raio" : "raio = " + nt(ma), { f: 11, w: 700, c: "var(--ok)", a: lado < 0 ? "start" : "end" }) + (Math.abs(px - cx) > 4 || o.semNum ? T(px + lado * 8, Y(hg / 2), o.semNum ? "altura" : "altura = " + nt(mg), { f: 11, w: 700, c: "var(--warn)", a: lado < 0 ? "end" : "start" }) : "");
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`; };
  /* retângulo com os lados rotulados. o = { rw, rh, esc (unidades que cabem na largura), fantasma: lado do quadrado tracejado, dentro } */
  R.retFig = (w, h, D, o = {}) => { const W = 560, H = o.H || 190, k = Math.min(400 / (o.esc || w), (H - 50) / (o.escH || h)), rw = w * k, rh = h * k, x = (W - rw) / 2, y = (H - 30 - rh) / 2 + 4; let s = "";
    if (o.fantasma) { const q = o.fantasma * k; s += `<rect x="${(W - q) / 2}" y="${(H - 30 - q) / 2 + 4}" width="${q}" height="${q}" rx="3" style="fill:none;stroke:var(--ok);stroke-width:1.5;stroke-dasharray:6 5"/>`; }
    s += `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" rx="3" style="fill:var(--mod);fill-opacity:.22;stroke:var(--mod);stroke-width:2"/>` + T(W / 2, Math.max(y + rh, o.fantasma ? (H - 30 + o.fantasma * k) / 2 + 4 : 0) + 17, o.rw === undefined ? nt(w) : o.rw, { f: 12, c: "var(--ink2)" }) + T(Math.min(x, o.fantasma ? (W - o.fantasma * k) / 2 : x) - 8, y + rh / 2 + 4, o.rh === undefined ? nt(h) : o.rh, { f: 12, c: "var(--ink2)", a: "end" }) + (o.dentro ? T(W / 2, y + rh / 2 + 4, o.dentro, { f: 12, w: 700, c: "var(--ink)" }) : "");
    return D ? D.svg(W, H, s, "figura") : `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;display:block;margin:0 auto">${s}</svg>`; };

  /* nome: "Semicírculo das médias: o raio nunca perde da altura" · matéria: Matemática · tema: EF04 */
  SIM.arMedias = (el, F) => { let a = 4, b = 16;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("a", "a", 1, 20, a, 160)}${sl("b", "b", 1, 20, b, 160)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => Object.assign({ a, b, iguais: a === b }, R.medias([a, b]));
    const poe = (o) => { ({ a, b } = { a, b, ...o }); a = Math.max(1, Math.min(20, Math.round(+a))); b = Math.max(1, Math.min(20, Math.round(+b))); desenha(); };
    const desenha = () => { const e = est(); ["a", "b"].forEach((k) => { q(`[data-v=${k}]`).value = String({ a, b }[k]); q(`[data-r=${k}]`).textContent = { a, b }[k]; });
      q("[data-v=pal]").innerHTML = R.semiFig(a, b, null);
      q("[data-v=lt]").innerHTML = vis("harmônica", nt(e.mh)) + vis("geométrica", nt(e.mg)) + vis("aritmética", nt(e.ma)) + vis("quadrática", nt(e.mq));
      q("[data-v=st]").innerHTML = `O diâmetro mede a + b = ${a + b}, então o raio é a média <b>aritmética</b>, ${nt(e.ma)}. A altura levantada no ponto que separa a de b mede √(a · b) = √${a * b}, a média <b>geométrica</b>, ${nt(e.mg)}. Nenhuma altura dentro do semicírculo passa do raio: ${e.iguais ? "com a = b a altura está no centro e <b>é</b> o raio. As quatro médias coincidem." : `por isso ${nt(e.mg)} &lt; ${nt(e.ma)}. Na ordem: harmônica &lt; geométrica &lt; aritmética &lt; quadrática. Aproxime a de b e veja as quatro se juntarem.`}`; };
    ["a", "b"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.arMedias._ult = { poe, est }; desenha(); };

  /* nome: "Soma fixa: qual retângulo tem a maior área?" · matéria: Matemática · tema: EF04 */
  SIM.arSomaFixa = (el, F) => { let S = 20, x = 4;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${sl("S", "soma dos dois lados", 4, 40, S, 160)}${sl("x", "largura", 1, 39, x, 220)}</div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => ({ S, x, y: S - x, area: x * (S - x), maxima: (S * S) / 4, falta: (S / 2 - x) ** 2, perimetro: 2 * S, quadrado: 2 * x === S });
    const poe = (o) => { ({ S, x } = { S, x, ...o }); S = Math.max(4, Math.min(40, Math.round(+S))); x = Math.max(1, Math.min(S - 1, Math.round(+x))); desenha(); };
    const desenha = () => { const e = est(); q("[data-v=x]").max = String(S - 1); ["S", "x"].forEach((k) => { q(`[data-v=${k}]`).value = String({ S, x }[k]); q(`[data-r=${k}]`).textContent = { S, x }[k]; });
      q("[data-v=pal]").innerHTML = R.retFig(x, e.y, null, { esc: S, escH: S, H: 250, fantasma: S / 2, dentro: "área " + nt(e.area) });
      q("[data-v=lt]").innerHTML = vis("lados", `${x} e ${e.y}`) + vis("perímetro", e.perimetro) + vis("área", nt(e.area)) + vis("área do quadrado", nt(e.maxima)) + vis("quanto falta", nt(e.falta));
      q("[data-v=st]").innerHTML = `Os dois lados somam sempre ${S} (perímetro ${e.perimetro}). A área é ${x} · ${e.y} = ${nt(e.area)}. O quadrado tracejado, de lado ${nt(S / 2)}, tem área ${nt(e.maxima)}. ${e.quadrado ? "O retângulo <b>é</b> o quadrado: a área não passa disso." : `Faltam ${nt(e.falta)}, que é exatamente o quadrado da distância da largura até ${nt(S / 2)}: (${nt(S / 2)} − ${x})² = ${nt(e.falta)}. Quanto mais perto do quadrado, maior a área.`}`; };
    ["S", "x"].forEach((k) => q(`[data-v=${k}]`).addEventListener("input", (ev) => poe({ [k]: ev.target.value })));
    SIM.arSomaFixa._ult = { poe, est }; desenha(); };
})();
