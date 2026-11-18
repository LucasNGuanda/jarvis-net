/* Russo · aba Leitura e tradução: vocabulário de matemática (RL04) e de física (RL05).
   Dados: SIM.RU.VOCM e SIM.RU.VOCF (verbetes do Wiktionary em inglês; a tradução para o português é do site, presa a uma palavra em inglês da
   definição; "rot" diz se essa definição traz rótulo de domínio, como "(mathematics)", no dicionário; os grupos são divisão do site).
   Treino na hora, com placar só da sessão: nada aqui é repetição espaçada nem guarda vocabulário (isso fica no Anki).
   Medida: a regra do gênero pela terminação (RG03, SIM.ruGeneroRegra) aplicada aos substantivos novos; SIM.ruPlacarVoc calcula na hora. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const emb = (lista, r) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const AC = "́", sem = (s) => String(s).split(AC).join(""), GRANDE = "font:700 44px/1.15 Inter,system-ui,sans-serif;letter-spacing:.5px", GEN = { m: "masculino", f: "feminino", n: "neutro" };
  const grupos = (L) => [...new Set(L.map((x) => x.grp))], botoesGrupo = (L) => `<select data-v="grp" class="bt peq" style="font-size:15px;padding:5px 8px"><option value="">todos os grupos</option>${grupos(L).map((g) => `<option value="${g}">${g}</option>`).join("")}</select>`;
  SIM.ruGenNome = GEN;
  /* regra do gênero (RG03) nos substantivos de uma lista: quantos ela decide, quantos acerta, e o subgrupo em -ость */
  SIM.ruPlacarVoc = (L) => { const S = L.filter((x) => x.cl === "s" && x.g), o = { n: S.length, decide: 0, ok: 0, erros: [], mole: 0, ost: 0, ostF: 0 }; S.forEach((x) => { const r = SIM.ruGeneroRegra(x.w); if (x.w.endsWith("ь")) o.mole++; if (x.w.endsWith("ость")) { o.ost++; if (x.g === "f") o.ostF++; } if (r && r.g) { o.decide++; if (r.g === x.g) o.ok++; else o.erros.push(x.w); } }); return o; };
  /* mapa mental de um grupo: cada ramo é uma tradução, a folha é a palavra russa (para esconder e lembrar) */
  SIM.ruVocMapa = (L, grp, pag = 0) => { const G = L.filter((x) => x.grp === grp), P = G.slice(pag * 8, pag * 8 + 8); return { centro: grp, sub: `${G.length} palavras`, ramos: P.map((x) => ({ nome: x.pt.split(/[,;(]/)[0].trim().slice(0, 18), sub: x.cl === "s" ? GEN[x.g] || "" : x.cl === "a" ? "adjetivo" : x.cl === "v" ? "verbo" : "", folhas: [{ rot: "", forma: sem(x.ac).length > 17 ? x.w : x.ac }] })), paginas: Math.ceil(G.length / 8) }; };

  /* nome: "Cartões: palavra, sentido, gênero" · matéria: Russo · tema: RL04, RL05 */
  SIM.ruVocCartoes = (el, F, op = {}) => { const L = op.lista; let r = rng(1), fila = [], x = null, ver = false, sabia = 0, vistos = 0, grp = "";
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${botoesGrupo(L)}<button class="bt peq" data-v="ver">mostrar</button><button class="bt peq" data-v="sim">eu sabia</button><button class="bt peq" data-v="nao">não sabia</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), base = () => L.filter((y) => !grp || y.grp === grp);
    const prox = () => { if (!fila.length) fila = emb(base(), r); x = fila.pop(); ver = false; desenha(); };
    const mostra = () => { ver = true; desenha(); }, marca = (s) => { if (!ver) return; vistos++; if (s) sabia++; prox(); };
    const est = () => ({ ...x, ver, sabia, vistos, grupo: grp });
    const desenha = () => { q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${x.ac}</div><div style="font:600 22px/1.3 Inter,system-ui,sans-serif;margin-top:10px;color:${ver ? "var(--ink)" : "var(--ink3)"}">${ver ? x.pt : "?"}</div>`;
      q("[data-v=lt]").innerHTML = vis("classe", ver ? (x.cl === "s" ? "substantivo " + (GEN[x.g] || "") : x.cl === "a" ? "adjetivo" : x.cl === "v" ? "verbo" : x.cl) : "?") + (x.cl === "s" ? vis("genitivo · plural", ver ? `${x.gen || "sem dado"} · ${x.pl || "sem dado"}` : "?") : "") + vis("nesta sessão", `sabia ${sabia} de ${vistos}`);
      q("[data-v=st]").innerHTML = ver ? `Grupo: ${x.grp}. Definição do dicionário usada: "${x.en}". ${x.rot ? "O dicionário marca esse sentido com rótulo de domínio." : "O dicionário dá esse sentido sem rótulo de matemática ou de física: é o sentido geral da palavra, que serve também no enunciado."} Fonte: Wiktionary em inglês.` : "Diga o sentido em voz alta, clique em \"mostrar\" e depois marque se sabia. O placar vale só para esta sessão; para decorar a longo prazo, use o Anki."; };
    q("[data-v=grp]").addEventListener("change", (ev) => { grp = ev.target.value; fila = []; prox(); }); q("[data-v=ver]").addEventListener("click", mostra); q("[data-v=sim]").addEventListener("click", () => marca(true)); q("[data-v=nao]").addEventListener("click", () => marca(false)); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => x.ac);
    SIM.ruVocCartoes._ult = { semente: (n) => { r = rng(n); fila = []; sabia = vistos = 0; prox(); }, mostra, marca, prox, est, grupo: (g) => { grp = g; fila = []; prox(); } }; prox(); };

  /* nome: "Jogo de pares: termo e tradução" · matéria: Russo · tema: RL04, RL05 */
  SIM.ruVocPares = (el, F, op = {}) => { const L = op.lista, N = 6; let r = rng(1), esq = [], dir = [], selE = null, selD = null, feitos = new Set(), tent = 0, erro = null, grp = "";
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${botoesGrupo(L)}<button class="bt peq" data-v="novo">novas palavras</button></div></div></div><div data-v="mesa" style="display:grid;grid-template-columns:1fr 1fr;gap:8px 28px;max-width:680px;margin:10px auto"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), W = (w) => L.find((x) => x.w === w);
    const novo = () => { const pts = new Set(); esq = []; emb(L.filter((y) => !grp || y.grp === grp), r).forEach((x) => { if (esq.length < N && !pts.has(x.pt)) { esq.push(x.w); pts.add(x.pt); } }); dir = emb(esq, r); selE = selD = null; feitos = new Set(); tent = 0; erro = null; desenha(); };
    const tenta = () => { if (selE === null || selD === null) return; tent++; if (esq[selE] === dir[selD]) { feitos.add(esq[selE]); erro = null; } else erro = [selE, selD]; selE = selD = null; };
    const clica = (lado, i) => { if (lado === "e") { if (feitos.has(esq[i])) return; selE = i; } else { if (feitos.has(dir[i])) return; selD = i; } erro = null; tenta(); desenha(); };
    const est = () => ({ esq: esq.slice(), dir: dir.slice(), feitos: feitos.size, tent, fim: feitos.size === esq.length, erro });
    const carta = (lado, i, txt, ok, t) => { const sel = (lado === "e" ? selE : selD) === i, ruim = erro && erro[lado === "e" ? 0 : 1] === i; return `<button type="button" data-c="${lado}${i}" ${ok ? "disabled" : ""} style="padding:9px 10px;border-radius:9px;cursor:${ok ? "default" : "pointer"};font:600 ${t}px Inter,system-ui,sans-serif;color:var(--ink);background:${ok ? "color-mix(in srgb,var(--ok) 18%,var(--card2))" : "var(--card2)"};border:2px solid ${ok ? "var(--ok)" : ruim ? "var(--bad, #e06666)" : sel ? "var(--mod)" : "var(--line)"};opacity:${ok ? 0.75 : 1}">${txt}</button>`; };
    const desenha = () => { q("[data-v=mesa]").innerHTML = esq.map((k, i) => carta("e", i, W(k).ac, feitos.has(k), 19) + carta("d", i, W(dir[i]).pt, feitos.has(dir[i]), 15)).join("");
      q("[data-v=mesa]").querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.c[0], +b.dataset.c.slice(1))));
      q("[data-v=lt]").innerHTML = vis("pares certos", `${feitos.size} de ${esq.length}`) + vis("tentativas", tent);
      q("[data-v=st]").innerHTML = feitos.size === esq.length ? `Fechou os ${esq.length} pares em ${tent} tentativas.` : "Clique numa palavra russa e depois na tradução dela."; };
    q("[data-v=grp]").addEventListener("change", (ev) => { grp = ev.target.value; novo(); }); q("[data-v=novo]").addEventListener("click", novo);
    SIM.ruVocPares._ult = { semente: (n) => { r = rng(n); novo(); }, clica, est }; novo(); };

  /* nome: "Escreva o termo em russo" · matéria: Russo · tema: RL04, RL05 */
  SIM.ruVocEscreve = (el, F, op = {}) => { const L = op.lista; let r = rng(1), fila = [], x = null, res = null, certos = 0, feitos = 0, grp = "", dica = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${botoesGrupo(L)}<button class="bt peq" data-v="dica">dica: mais uma letra</button><button class="bt peq" data-v="prox">outra</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir (depois de conferir)</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div>
      <div style="display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap"><input type="text" data-v="inp" lang="ru" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="escreva o termo em cirílico" style="font:600 24px Inter,system-ui,sans-serif;padding:6px 10px;min-width:320px;background:var(--card2);color:var(--ink);border:1.5px solid var(--line);border-radius:9px"><button class="bt peq" data-v="conf">conferir</button></div>
      <div style="display:flex;justify-content:center">${F.tecladoRu()}</div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), inp = q("[data-v=inp]");
    const resp = () => L.filter((y) => y.pt === x.pt).map((y) => y.w);
    const prox = () => { if (!fila.length) fila = emb(L.filter((y) => !grp || y.grp === grp), r); x = fila.pop(); res = null; dica = 0; inp.value = ""; desenha(); };
    const confere = () => { const v = F.normTxt(inp.value); if (!v) return; res = resp().map((p) => F.normTxt(p)).includes(v); feitos++; if (res) certos++; desenha(); };
    const est = () => ({ ...x, resp: resp(), res, certos, feitos, dica });
    const desenha = () => { q("[data-v=pal]").innerHTML = `<div style="font:700 32px/1.2 Inter,system-ui,sans-serif">${x.pt}</div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${x.grp} · ${[...x.w].length} letras${dica ? " · começa por <b>" + x.w.slice(0, dica) + "</b>" : ""}</div>`; inp.style.borderColor = res === null ? "var(--line)" : res ? "var(--ok)" : "var(--bad, #e06666)";
      q("[data-v=lt]").innerHTML = vis("resultado", res === null ? "?" : res ? "certo" : "ainda não") + vis("no dicionário", res === null ? "?" : x.ac) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = res === null ? "Escreva a palavra russa (forma do dicionário). O acento não precisa ser digitado; o ё precisa." : res ? `Certo: ${x.ac}.` : `Você escreveu "${inp.value}"; o dicionário dá ${x.ac}.`; };
    q("[data-v=grp]").addEventListener("change", (ev) => { grp = ev.target.value; fila = []; prox(); }); q("[data-v=dica]").addEventListener("click", () => { if (res === null && dica < [...x.w].length - 1) { dica++; desenha(); } }); q("[data-v=prox]").addEventListener("click", prox); q("[data-v=conf]").addEventListener("click", confere); inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); confere(); } });
    F.ligaTecladoRu(el, inp); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => (res === null ? "" : x.ac));
    SIM.ruVocEscreve._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, digita: (s) => { inp.value = s; }, confere, prox, est }; prox(); };

  /* nome: "Mapa mental do vocabulário, grupo por grupo" · matéria: Russo · tema: RL04, RL05 */
  SIM.ruVocMapaLab = (el, F, op = {}) => { const L = op.lista, G = grupos(L); let g = G[0], pag = 0, ver = true, visto = [];
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><select data-v="g" class="bt peq" style="font-size:15px;padding:5px 8px">${G.map((x) => `<option value="${x}">${x}</option>`).join("")}</select><button class="bt peq" data-v="pag">próximas palavras</button><button class="bt peq" data-v="esc">esconder e lembrar</button></div></div></div><div class="palco" data-v="pal" style="padding:6px 0;overflow-x:auto"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), mapa = () => SIM.ruVocMapa(L, g, pag), nf = () => mapa().ramos.length;
    const poe = (gg, pp) => { g = gg; pag = pp; visto = Array(nf()).fill(ver); desenha(); }, esconde = () => { ver = !ver; visto = Array(nf()).fill(ver); desenha(); }, revela = (i) => { visto[i] = true; desenha(); };
    const est = () => ({ g, pag, mapa: mapa(), folhas: nf(), vistas: visto.filter(Boolean).length, escondido: !ver });
    const desenha = () => { const m = mapa(); q("[data-v=g]").value = g; q("[data-v=esc]").textContent = ver ? "esconder e lembrar" : "mostrar tudo"; q("[data-v=pal]").innerHTML = SIM.ruMapaSvg(m, visto).svg;
      q("[data-v=pal]").querySelectorAll("[data-folha]").forEach((x) => x.addEventListener("click", () => revela(+x.dataset.folha)));
      q("[data-v=st]").innerHTML = `Grupo "${g}", parte ${pag + 1} de ${m.paginas}. ${ver ? "Cada ramo é o sentido; a folha é a palavra russa." : "Diga a palavra russa de cada sentido e clique no ponto de interrogação para conferir."} A divisão em grupos é do site; palavras e sentidos: Wiktionary em inglês.`; };
    q("[data-v=g]").addEventListener("change", (ev) => poe(ev.target.value, 0)); q("[data-v=pag]").addEventListener("click", () => poe(g, (pag + 1) % mapa().paginas)); q("[data-v=esc]").addEventListener("click", esconde);
    SIM.ruVocMapaLab._ult = { poe, esconde, revela, est }; poe(g, 0); };

  /* página inteira de um tema de vocabulário (RL04 e RL05 usam a mesma, com listas diferentes) */
  SIM.ruPaginaVocab = (F, D, cfg) => { const R = String.raw, L = cfg.lista, S = L.filter((x) => x.cl === "s" && x.g), A = L.filter((x) => x.cl === "a"), P = SIM.ruPlacarVoc(L), G = grupos(L), cap = (s) => s[0].toUpperCase() + s.slice(1);
    const ru = (w, t = 20) => `<span style="font-size:${t}px;font-weight:600">${w}</span>`;
    const cart = (w, sub = "") => { const n = [...sem(w)].length, t = Math.min(48, Math.floor(820 / Math.max(n, 6))); return D.svg(560, 116, `<rect x="30" y="8" width="500" height="78" rx="12" style="fill:var(--card2);stroke:var(--line)"/><text x="280" y="${50 + t * 0.34}" text-anchor="middle" style="font:700 ${t}px Inter,system-ui,sans-serif;fill:var(--ink);letter-spacing:.5px">${w}</text>` + (sub ? D.txt(280, 106, sub, "tx2", "middle") : ""), "figura"); };
    const tabGrupo = (g) => { const X = L.filter((x) => x.grp === g), m = Math.ceil(X.length / 2), curto = (s) => { let c = s.split(/;| \(/)[0].trim(); if (c.length > 22) c = c.split(",")[0].trim(); return c; }, lin = Array.from({ length: m }, (_, i) => [X[i].ac, curto(X[i].pt), X[i + m] ? X[i + m].ac : "", X[i + m] ? curto(X[i + m].pt) : ""]); return D.svg(560, 40 + 22 * (m + 1), SIM.dq.tab(5, 22, [125, 150, 125, 150], [["russo", "português", "russo", "português"], ...lin]), "figura"); };
    const doisDe = (x) => (x.g === "f" ? SIM.RU.NUM.find((y) => y.n === 2).f : SIM.RU.NUM.find((y) => y.n === 2).ac) + " " + x.gen, ALT_G = ["Masculino.", "Feminino.", "Neutro."], iGn = { m: 0, f: 1, n: 2 }, comGen = S.filter((x) => x.gen && x.pl);
    const outrosPt = (x) => [...new Set(L.filter((y) => y.pt !== x.pt).map((y) => cap(y.pt) + "."))], outrosRu = (x) => L.filter((y) => y.pt !== x.pt).map((y) => y.w + ".");
    const mapaG = SIM.ruMapaSvg(SIM.ruVocMapa(L, G[0], 0), Array(20).fill(true)).svg;

    const exemplos = F.exemplo({ titulo: "Do termo à frase", casos: [
      { nome: "Fácil: o gênero pela terminação", gerar: (p) => { const x = p ? S.find((y) => SIM.ruGeneroRegra(y.w).g) : F.escolha(S), r = SIM.ruGeneroRegra(x.w);
        return { enun: R`<p>Qual é o gênero de ${ru(x.ac)} (${x.pt})?</p>`, fig: cart(x.ac, "gênero?"), passos: [R`<p>(i) Olhe a última letra da forma do dicionário: -${r.t || x.w.slice(-1)}.</p>`, R`<p>(ii) ${r.g ? "A regra do tema dos substantivos decide: " + GEN[r.g] + "." : cap(r.motivo) + "."}</p>`, R`<p>(iii) O dicionário dá: <b>${GEN[x.g]}</b>${x.w.endsWith("ость") ? " (e todas as palavras em -ость desta lista são femininas)" : ""}.</p>`], resp: GEN[x.g] }; } },
      { nome: "Médio: dois de cada", gerar: (p) => { const x = p ? comGen[0] : F.escolha(comGen);
        return { enun: R`<p>Como se diz "dois/duas + ${x.pt}" com ${ru(x.ac)}?</p>`, fig: cart("2 + " + x.ac, "número + termo"), passos: [R`<p>(i) Gênero de ${x.ac}: ${GEN[x.g]}; o "dois" ${x.g === "f" ? "vira две" : "fica два"}.</p>`, R`<p>(ii) Depois de 2, 3 e 4, genitivo singular. O verbete dá o genitivo: ${ru(x.gen)}.</p>`, R`<p>(iii) Resposta: <b>${doisDe(x)}</b>.</p>`], resp: doisDe(x) }; } },
      { nome: "Difícil: adjetivo + substantivo", gerar: (p) => { const a = p ? A[0] : F.escolha(A), s = p ? S[0] : F.escolha(S), col = { m: 0, n: 1, f: 2 }[s.g], f = SIM.ruAdjRegra(a.w, "nom", col);
        return { enun: R`<p>Faça o adjetivo ${ru(a.ac)} (${a.pt}) concordar com ${ru(s.ac)} (${s.pt}), no nominativo.</p>`, fig: cart(a.ac + " + " + s.ac, "concordância"), passos: [R`<p>(i) Gênero do substantivo: ${GEN[s.g]}.</p>`, R`<p>(ii) Terminação do adjetivo no nominativo ${GEN[s.g]}, pela regra medida no tema dos adjetivos: <b>${f}</b> (sem acento, porque sai da regra e não de uma tabela).</p>`, R`<p>(iii) Juntando: ${f} ${sem(s.ac)}. A combinação é montada pelo site para treinar a concordância; não é citação de fonte.</p>`], resp: f + " " + sem(s.ac) }; } }] });

    const exs = [
      F.exercicio({ n: 1, nivel: "Físico", gerar: (p) => { const x = SIM.pega(L, p, 3), a5 = SIM.alt5(cap(x.pt) + ".", outrosPt(x), p); return { enun: R`<p>O que quer dizer o termo abaixo?</p>`, fig: cart(x.ac, cfg.area), ...a5, resp: x.pt, dicas: [R`<p>Grupo: ${x.grp}.</p>`], sol: R`<p>${ru(x.ac)} = <b>${x.pt}</b>.</p>` }; } }),
      F.exercicio({ n: 2, nivel: "Físico", gerar: (p) => { const x = SIM.pega(L, p, 17), a5 = SIM.alt5(x.w + ".", outrosRu(x), p); return { enun: R`<p>Como se diz <b>${x.pt}</b> em russo? Alternativas sem acento.</p>`, fig: cart("?", x.pt), ...a5, resp: x.ac, dicas: [R`<p>Grupo: ${x.grp}; ${[...x.w].length} letras.</p>`], sol: R`<p><b>${x.ac}</b>.</p>` }; } }),
      F.exercicio({ n: 3, nivel: "Físico", gerar: (p) => { const x = SIM.pega(S, p, 5); return { enun: R`<p>Qual é o gênero de ${ru(x.ac)} (${x.pt})?</p>`, fig: cart(x.ac, "gênero?"), alts: ALT_G, certa: "ABC"[iGn[x.g]], resp: GEN[x.g], dicas: [R`<p>${x.w.endsWith("ь") ? "Termina em -ь: a terminação não decide; lembre do genitivo (" + x.gen + ")." : "A última letra decide."}</p>`], sol: R`<p><b>${cap(GEN[x.g])}</b> (genitivo: ${x.gen}).</p>` }; } }),
      F.exercicio({ n: 4, nivel: "Físico", gerar: (p) => { const g = p ? G[0] : F.escolha(G.filter((y) => y !== "adjetivos")), fora = F.escolha(L.filter((y) => y.grp !== g && y.grp !== "adjetivos" && y.cl === "s")), x = p ? L.find((y) => y.grp !== g && y.cl === "s") : fora, a5 = SIM.alt5(x.w + ".", L.filter((y) => y.grp === g).map((y) => y.w + "."), p);
        return { enun: R`<p>Quatro destas palavras são do grupo "<b>${g}</b>" e uma não é. Qual é a intrusa?</p>`, fig: cart("grupo: " + g, "ache a intrusa"), ...a5, resp: x.ac, dicas: [R`<p>Traduza as cinco.</p>`], sol: R`<p><b>${x.ac}</b> (${x.pt}) é do grupo "${x.grp}".</p>` }; } }),
      F.exercicio({ n: 5, nivel: "Máximo", gerar: (p) => { let q = p ? S.slice(0, 5) : []; while (q.length < 5) { const y = F.escolha(S); if (!q.includes(y)) q.push(y); } const v = q.filter((y) => y.g === "f").length;
        return { enun: R`<p>Na tabela, cinco termos com a tradução. Quantos deles são <b>femininos</b>?</p>`, fig: D.svg(560, 150, SIM.dq.tab(60, 22, [200, 240], [["termo", "tradução"], ...q.map((y) => [y.ac, y.pt.split(/;| \(/)[0].trim()])]), "figura"), num: { v, tol: 0.001, un: "", abs: 0.001 }, py: `${v}`, resp: String(v), dicas: [R`<p>Femininas: as em -а, -я, e (nesta lista) todas as em -ость.</p>`], sol: R`<p>Gênero de cada um: ${q.map((y) => `${y.w}, ${GEN[y.g]}`).join("; ")}. Femininos: <b>${v}</b>.</p>` }; } }),
      F.exercicio({ n: 6, nivel: "Físico", gerar: (p) => { const x = SIM.pega(comGen, p, 8), certo = sem(doisDe(x)), err = [sem((x.g === "f" ? "два" : "две") + " " + x.gen), sem((x.g === "f" ? "две" : "два") + " " + x.ac), sem((x.g === "f" ? "две" : "два") + " " + x.pl), sem((x.g === "f" ? "два" : "две") + " " + x.ac), sem((x.g === "f" ? "два" : "две") + " " + x.pl)], a5 = SIM.alt5(certo + ".", [...new Set(err)].filter((y) => y !== certo).map((y) => y + "."), p);
        return { enun: R`<p>Como se diz "dois/duas + ${x.pt}" com ${ru(x.ac)} (${GEN[x.g]})? Alternativas sem acento.</p>`, fig: cart("2 + " + x.ac, "número + termo"), ...a5, resp: doisDe(x), dicas: [R`<p>Feminino pede две; depois de 2 vem o genitivo singular (${x.gen}).</p>`], sol: R`<p><b>${doisDe(x)}</b>.</p>` }; } }),
      F.exercicio({ n: 7, nivel: "Físico", gerar: (p) => { const x = SIM.pega(A, p, 2), a5 = SIM.alt5(cap(x.pt) + ".", [...new Set(A.filter((y) => y.pt !== x.pt).map((y) => cap(y.pt) + "."))], p); return { enun: R`<p>O que quer dizer o adjetivo abaixo?</p>`, fig: cart(x.ac, "adjetivo"), ...a5, resp: x.pt, dicas: [R`<p>Vários são parecidos com o português.</p>`], sol: R`<p>${ru(x.ac)} = <b>${x.pt}</b>.</p>` }; } }),
      F.exercicio({ n: 8, nivel: "Máximo", gerar: (p) => { const x = SIM.pega(comGen.filter((y) => sem(y.pl) !== sem(y.gen)), p, 4), certo = sem(x.pl), a5 = SIM.alt5(certo + ".", [...new Set([sem(x.gen), x.w, x.w + "ы", x.w + "и", x.w.slice(0, -1) + "ов", x.w + "а"])].filter((y) => y !== certo).map((y) => y + "."), p);
        return { enun: R`<p>Qual é o nominativo plural de ${ru(x.ac)} (${x.pt})? Alternativas sem acento.</p>`, fig: cart(x.ac + " → plural", GEN[x.g]), ...a5, resp: x.pl, dicas: [R`<p>O genitivo singular é ${x.gen}; o plural é outra forma.</p>`], sol: R`<p><b>${x.pl}</b> (forma do verbete).</p>` }; } }),
      F.exercicio({ n: 9, nivel: "Físico", gerar: (p) => { const g = p ? G[1] : F.escolha(G), X = L.filter((y) => y.grp === g), x = p ? X[0] : F.escolha(X), a5 = SIM.alt5(cap(x.pt) + ".", outrosPt(x), p); return { enun: R`<p>Do grupo "${g}": o que quer dizer o termo abaixo?</p>`, fig: cart(x.ac, g), ...a5, resp: x.pt, dicas: [R`<p>${x.cl === "s" ? "Substantivo " + GEN[x.g] + "." : "Não é substantivo."}</p>`], sol: R`<p>${ru(x.ac)} = <b>${x.pt}</b>.</p>` }; } }),
      F.exercicio({ n: 10, nivel: "Máximo", gerar: (p) => { const x = SIM.pega(S.filter((y) => SIM.ruGeneroRegra(y.w).g === null), p, 1);
        return { enun: R`<p>${ru(x.ac)} (${x.pt}) termina em -ь, e a terminação não decide o gênero. Sabendo que o genitivo é ${ru(x.gen)}, qual é o gênero?</p>`, fig: cart(x.ac + " · " + x.gen, "gênero de palavra em -ь"), alts: ["Masculino (genitivo em -я).", "Feminino (genitivo em -и)."], certa: x.g === "m" ? "A" : "B", resp: GEN[x.g], dicas: [R`<p>Lembre das declinações: день → дня (masculino); ночь → ночи (feminino).</p>`], sol: R`<p><b>${cap(GEN[x.g])}</b>: o genitivo ${x.gen} mostra a declinação.</p>` }; } }),
      ...[[11, 0, "Físico"], [12, 2, "Físico"], [13, 3, "Máximo"], [14, 5, "Máximo"]].map(([n, gi, nv]) => F.exercicio({ n, nivel: nv, gerar: (p) => { const g = G[gi % G.length], X = L.filter((y) => y.grp === g && L.filter((z) => z.pt === y.pt).length === 1), x = SIM.pega(X, p, n);
        return { enun: R`<p>Escreva, em cirílico, o termo do grupo "${g}" que quer dizer <b>${x.pt}</b>.</p>`, fig: cart("?", x.pt), txt: { v: x.w, teclado: "ru", rot: "termo" }, resp: x.ac, dicas: [R`<p>Tem ${[...x.w].length} letras e começa por ${ru(x.w[0])}.</p>`, R`<p>Começa por ${ru(x.w.slice(0, 3))}.</p>`], sol: R`<p><b>${x.ac}</b>.</p>` }; } })),
    ];
    const ch = cfg.chefao.map((w) => L.find((x) => x.w === w)).filter(Boolean);
    const chefao = F.chefao({ titulo: "Glossário relâmpago",
      enun: R`<p>Sem consultar as tabelas: ${ch.map((x) => ru(x.ac)).join(", ")}. (a) Traduza os ${ch.length} termos. (b) Dê o gênero de cada substantivo. (c) Diga "dois/duas" de cada substantivo. (d) Em quais deles a terminação não decide o gênero, e como você descobre? (e) O site aplicou a regra do gênero aos ${P.n} substantivos desta lista: em quantos ela decide, e em quantos acerta? Por que isso não é 100% da lista? (f) ${cfg.chefaoF}</p>`,
      fig: cart(ch.slice(0, 3).map((x) => x.ac).join(" · "), "glossário"),
      dicas: [R`<p>(c) Feminino: две + genitivo singular.</p>`, R`<p>(e) Os números estão na caixa "Pense como quem mede".</p>`],
      sol: R`<p><b>(a)</b> ${ch.map((x) => `${x.w}: ${x.pt}`).join("; ")}.</p>
        <p><b>(b)</b> ${ch.filter((x) => x.g).map((x) => `${x.w}: ${GEN[x.g]}`).join("; ")}.</p>
        <p><b>(c)</b> ${ch.filter((x) => x.g && x.gen).map(doisDe).join("; ")}.</p>
        <p><b>(d)</b> ${ch.filter((x) => x.g && x.w.endsWith("ь")).map((x) => x.w).join(", ") || "em nenhum destes"}: terminam em -ь; descobre-se pelo genitivo (ou decorando; as em -ость são femininas nesta lista).</p>
        <p><b>(e)</b> Decide em ${P.decide} de ${P.n} e acerta ${P.ok} dos que decide. Os outros ${P.n - P.decide} terminam em -ь, em que a regra se recusa a decidir.</p>
        <p><b>(f)</b> ${cfg.chefaoFsol}</p>` });

    return [
      F.secao("abertura", "Pergunta", R`<div class="abertura"><div class="det">Leitura e tradução</div><div class="q">${cfg.pergunta}</div>${cfg.abertura}</div>
        ${F.chute(cfg.chute)}`),
      F.secao("laboratorio", "Laboratório: cartões", R`<p>Uma palavra por vez. Diga o sentido, confira, marque se sabia.</p><div id="lab-cartoes"></div>`),
      F.secao("listas", "As palavras, grupo por grupo", R`<p>${L.length} termos em ${G.length} grupos. A tradução é do site, presa a uma palavra da definição em inglês do dicionário; ${L.filter((x) => x.rot).length} dessas definições trazem rótulo de domínio no dicionário, e as outras são o sentido geral da palavra.</p>
        ${G.map((g) => `<h3 style="margin:18px 0 4px">${cap(g)}</h3>` + F.fig(tabGrupo(g), `Grupo "${g}". Palavras e sentidos: Wiktionary em inglês; a divisão em grupos é do site.`)).join("")}
        ${F.formula(R`\text{termo novo} \;\rightarrow\; \text{sentido} + \text{gênero} + \text{genitivo}`, "O que guardar de cada substantivo")}
        ${F.formula(R`\text{2, 3, 4} + \text{genitivo singular}\qquad\qquad \text{adjetivo concorda em gênero, número e caso}`, "Para usar o termo numa frase")}
        ${F.demo(cfg.demoTitulo, cfg.demo)}`),
      F.secao("pares", "Jogo de pares", R`<p>Seis termos e seis traduções. Escolha um grupo ou misture todos.</p><div id="lab-pares"></div>
        ${F.caixa("fisico", R`<p>Os termos novos obedecem à regra do gênero do tema dos substantivos? O site aplicou a regra aos ${P.n} substantivos desta lista: ela <b>decide em ${P.decide}</b> e, desses, <b>acerta ${P.ok}</b>${P.erros.length ? " (erra: " + P.erros.join(", ") + ")" : ""}. Os outros ${P.mole} terminam em -ь, onde a regra não decide. Mas há um padrão dentro deles: ${P.ost} terminam em -ость, e ${P.ostF === P.ost ? "todos são femininos" : P.ostF + " são femininos"}. É uma contagem desta lista, não uma lei da língua.</p>`, "Pense como quem mede")}
        ${F.caixa("pegadinha", cfg.pegadinha)}`),
      F.secao("escrever", "Escreva o termo", R`<p>Do português para o russo, com o teclado da tela. Há um botão de dica que entrega uma letra por vez.</p><div id="lab-escreve"></div>`),
      F.secao("mapa", "Mapa mental", R`<p>Um grupo por vez: os ramos são os sentidos e as folhas, as palavras. Use "esconder e lembrar".</p><div id="lab-mapa"></div>
        ${F.fig(mapaG, `Mapa mental do grupo "${G[0]}" (primeira parte).`)}
        ${F.caixa("olimpiada", cfg.olimpiada)}
        ${F.caixa("ponte", cfg.ponte)}`),
      F.secao("exemplos", "Exemplos resolvidos", exemplos),
      F.secao("desafios", "Exercícios", exs.join("") + chefao),
    ].join(""); };
})();
