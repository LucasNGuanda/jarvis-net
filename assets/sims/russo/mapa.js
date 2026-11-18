/* Russo · mapa mental de uma palavra (ideia do Lucas, 17/11/2026): uma palavra no centro e todas as formas dela em volta.
   Verbo: infinitivo e aspecto, presente (ou futuro), passado, imperativo. Substantivo: os seis casos, no singular e no plural.
   Todas as formas vêm de SIM.RU.DECL e SIM.RU.VERB (assets/sims/russo/dados.js, GERADO a partir das tabelas do Wiktionary em inglês).
   Nada é conjugado ou declinado por regra aqui: o mapa só desenha o que a tabela da fonte traz; célula vazia na fonte aparece como "sem dado". */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const CASOS = [["nom", "nominativo", "quem? o quê?"], ["acc", "acusativo", "objeto direto"], ["gen", "genitivo", "de quem? de quê?"], ["dat", "dativo", "a quem?"], ["ins", "instrumental", "com quê? com quem?"], ["prep", "preposicional", "sobre o quê? onde?"]];
  const PESS = ["я", "ты", "он, она", "мы", "вы", "они"];
  const CORES = ["var(--mod)", "var(--warn)", "var(--ok)", "var(--mC, #c58af9)", "var(--mA, #5fb3f5)", "var(--mT, #f08a5d)"];
  SIM.ruCasos = CASOS;
  const junta = (f) => (f && f.length ? f.join(" / ") : null);
  /* estrutura do mapa de uma palavra: { centro, sub, tipo, ramos: [{ nome, sub, folhas: [{ rot, forma }] }] } */
  SIM.ruMapaDe = (w, op = {}) => { const R = SIM.RU, v = R.VERB && R.VERB[w], d = R.DECL && R.DECL[w];
    if (v) return { w, centro: v.ac, sub: v.pt, tipo: "verbo", ramos: [
      { nome: "infinitivo", sub: v.asp === "impf" ? "imperfectivo" : v.asp === "pf" ? "perfectivo" : "", folhas: [{ rot: "forma do dicionário", forma: v.ac }].concat(v.par ? [{ rot: "par de aspecto", forma: v.par }] : []) },
      { nome: v.tempo, sub: "muda com a pessoa", folhas: PESS.map((p, i) => ({ rot: p, forma: junta(v.pres[i]) })) },
      { nome: "passado", sub: "muda com o gênero", folhas: [["он", 0], ["она", 1], ["оно", 2], ["они", 3]].map(([p, i]) => ({ rot: p, forma: junta(v.pass[i]) })) },
      { nome: "imperativo", sub: "ordem ou pedido", folhas: [["ты", 0], ["вы", 1]].map(([p, i]) => ({ rot: p, forma: junta(v.imp[i]) })) }] };
    if (d) return { w, centro: d.ac, sub: d.pt + " · " + d.genPt, tipo: "substantivo", ramos: CASOS.map(([k, nome, perg]) => ({ nome, sub: perg, folhas: [{ rot: "singular", forma: junta(d.casos[k][0]) }, { rot: "plural", forma: junta(d.casos[k][1]) }] })) };
    const pr = R.PRON && R.PRON[w];
    if (pr && !op.semPron) return { w, centro: w, sub: pr.pt, tipo: "pronome", ramos: CASOS.map(([k, nome, perg]) => ({ nome, sub: perg, folhas: (pr.casos[k].length ? pr.casos[k] : [null]).map((f, i) => ({ rot: !i || !f ? "" : ["он", "она", "оно", "они"].includes(w) && f[0] === "н" ? "depois de preposição" : "variante", forma: f })) })) };
    const a = (R.ADJ && R.ADJ[w]) || (R.POSS && R.POSS[w]);
    if (a) return { w, centro: a.ac, sub: a.pt, tipo: "adjetivo", ramos: CASOS.map(([k, nome, perg]) => ({ nome, sub: k === "acc" ? "com substantivo inanimado" : perg, folhas: ["masc.", "neutro", "fem.", "plural"].map((rot, i) => ({ rot, forma: a.casos[k][i].length ? a.casos[k][i][0] : null })) })) };
    return null; };
  SIM.ruMapaLista = (tipo) => { const R = SIM.RU, v = Object.keys(R.VERB || {}), s = Object.keys(R.DECL || {}), a = Object.keys(R.ADJ || {}); return tipo === "verbo" ? v : tipo === "substantivo" ? s : tipo === "adjetivo" ? a : tipo === "pronome" ? Object.keys(R.PRON || {}).concat(Object.keys(R.POSS || {})) : v.concat(s, a); };
  /* desenho: metade dos ramos à direita, metade à esquerda; folhas em coluna; visto[] diz quais folhas estão reveladas */
  SIM.ruMapaSvg = (m, visto) => { const W = 900, n = m.ramos.length, dir = m.ramos.slice(0, Math.ceil(n / 2)), esq = m.ramos.slice(Math.ceil(n / 2)), LH = 25, alt = (r) => r.folhas.length * LH + 30;
    const H = Math.max(260, Math.max(dir.reduce((s, r) => s + alt(r), 0), esq.reduce((s, r) => s + alt(r), 0)) + 30), cx = W / 2, cy = H / 2; let k = 0, o = "";
    const lado = (ramos, s, base) => { let y = (H - ramos.reduce((t, r) => t + alt(r), 0)) / 2; ramos.forEach((r, i) => { const cor = CORES[(base + i) % CORES.length], h = alt(r), ry = y + h / 2, rx = cx + s * 178, fx = cx + s * 274;
        o += `<path d="M${cx + s * 70},${cy} C${cx + s * 120},${cy} ${rx - s * 110},${ry} ${rx - s * 76},${ry}" style="fill:none;stroke:${cor};stroke-width:2.4;opacity:.85"/>`;
        o += `<rect x="${rx - 76}" y="${ry - 21}" width="152" height="42" rx="12" style="fill:color-mix(in srgb,${cor} 20%,var(--card2));stroke:${cor};stroke-width:1.8"/><text x="${rx}" y="${ry - 2}" text-anchor="middle" style="font:700 14.5px Inter,system-ui,sans-serif;fill:var(--ink)">${esc(r.nome)}</text><text x="${rx}" y="${ry + 13}" text-anchor="middle" style="font:400 10.5px Inter,system-ui,sans-serif;fill:var(--ink2)">${esc(r.sub || "")}</text>`;
        r.folhas.forEach((f, j) => { const fy = y + 15 + j * LH + LH / 2, idx = k++, ver = visto[idx], txt = f.forma === null ? "sem dado" : ver ? f.forma : "?";
          o += `<path d="M${rx + s * 76},${ry} C${rx + s * 90},${ry} ${fx - s * 20},${fy - 4} ${fx - s * 4},${fy - 4}" style="fill:none;stroke:${cor};stroke-width:1.3;opacity:.6"/>`;
          o += `<g data-folha="${idx}" style="cursor:pointer"><rect x="${s > 0 ? fx - 2 : fx - 186}" y="${fy - 17}" width="188" height="24" rx="6" style="fill:transparent"/><text x="${fx}" y="${fy}" text-anchor="${s > 0 ? "start" : "end"}" style="font:400 12px Inter,system-ui,sans-serif;fill:var(--ink2)">${s > 0 ? esc(f.rot) + "  " : ""}<tspan style="font:600 16px Inter,system-ui,sans-serif;fill:${f.forma === null ? "var(--ink3)" : ver ? "var(--ink)" : cor}">${esc(txt)}</tspan>${s > 0 ? "" : "  " + esc(f.rot)}</text></g>`; });
        y += h; }); };
    lado(dir, 1, 0); lado(esq, -1, dir.length);
    o += `<rect x="${cx - 88}" y="${cy - 34}" width="176" height="68" rx="18" style="fill:var(--card2);stroke:var(--ink);stroke-width:2.2"/><text x="${cx}" y="${cy + 1}" text-anchor="middle" style="font:700 ${Math.min(23, Math.floor(260 / Math.max(1, [...m.centro.split("\u0301").join("")].length)))}px Inter,system-ui,sans-serif;fill:var(--ink)">${esc(m.centro)}</text><text x="${cx}" y="${cy + 20}" text-anchor="middle" style="font:400 11.5px Inter,system-ui,sans-serif;fill:var(--ink2)">${esc(m.sub)}</text>`;
    return { svg: `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px" role="img" aria-label="mapa mental de ${esc(m.centro)}">${o}</svg>`, folhas: k }; };

  /* nome: "Mapa mental: uma palavra em todas as formas" · matéria: Russo · tema: RG04, RG05, RG06, RG07, RG08, RG09, RG10, RG11, RG12, RL01, RL02, RL03 */
  SIM.ruMapa = (el, F, op = {}) => { const tipo = op.tipo || "todos", L = (op.palavras || SIM.ruMapaLista(tipo)).filter((w) => SIM.ruMapaDe(w)); let k = Math.max(0, L.indexOf(op.inicio || L[0])), visto = [], m = null, treino = false;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">palavra</p><div class="bts"><select data-v="sel" class="bt peq" style="font-size:15px;padding:5px 8px">${L.map((w, i) => `<option value="${i}">${w}</option>`).join("")}</select><button class="bt peq" data-v="ant">anterior</button><button class="bt peq" data-v="prox">próxima</button></div></div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">modo</p><div class="bts"><button class="bt peq" data-v="ver" aria-pressed="true">ver tudo</button><button class="bt peq" data-v="trn" aria-pressed="false">esconder e lembrar</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div>
      <div class="palco" data-v="pal" style="padding:6px 0;overflow-x:auto"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), nF = () => m.ramos.reduce((s, r) => s + r.folhas.length, 0);
    const carrega = () => { m = SIM.ruMapaDe(L[k]); visto = Array(nF()).fill(!treino); q("[data-v=sel]").value = String(k); desenha(); };
    const est = () => ({ w: L[k], tipo: m.tipo, ramos: m.ramos.map((r) => ({ nome: r.nome, folhas: r.folhas.map((f) => f.forma) })), folhas: nF(), vistas: visto.filter(Boolean).length, treino, total: L.length });
    const desenha = () => { const d = SIM.ruMapaSvg(m, visto); q("[data-v=pal]").innerHTML = d.svg; q("[data-v=ver]").setAttribute("aria-pressed", String(!treino)); q("[data-v=trn]").setAttribute("aria-pressed", String(treino));
      q("[data-v=pal]").querySelectorAll("[data-folha]").forEach((g) => g.addEventListener("click", () => { const i = +g.dataset.folha; visto[i] = !visto[i]; desenha(); }));
      q("[data-v=st]").innerHTML = (treino ? `Modo de lembrar: diga a forma em voz alta e clique no "?" para conferir. Reveladas: <b>${visto.filter(Boolean).length} de ${nF()}</b>. ` : "Clique numa forma para escondê-la, ou use \"esconder e lembrar\" para testar a memória do mapa inteiro. ") + `Formas: tabela de ${m.tipo === "verbo" ? "conjugação" : "declinação"} do verbete "${L[k]}" do Wiktionary em inglês; nada aqui é formado por regra.`; };
    q("[data-v=sel]").addEventListener("change", (ev) => { k = +ev.target.value; carrega(); }); q("[data-v=ant]").addEventListener("click", () => { k = (k + L.length - 1) % L.length; carrega(); }); q("[data-v=prox]").addEventListener("click", () => { k = (k + 1) % L.length; carrega(); });
    q("[data-v=ver]").addEventListener("click", () => { treino = false; visto = visto.map(() => true); desenha(); }); q("[data-v=trn]").addEventListener("click", () => { treino = true; visto = visto.map(() => false); desenha(); });
    if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => m.centro);
    SIM.ruMapa._ult = { poe: (w) => { k = L.indexOf(w); carrega(); }, treino: (v = true) => { treino = v; visto = visto.map(() => !v); desenha(); }, clica: (i) => { visto[i] = !visto[i]; desenha(); }, est }; carrega(); };
})();
