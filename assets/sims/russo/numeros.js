/* Russo · numerais e tempo (RG16): regras medidas e laboratórios.
   Dados: SIM.RU.NUM (cardinais: verbetes do Wiktionary em inglês; 600 a 900 só da tabela da Wikipedia), SIM.RU.ORD, SIM.RU.TEMPO (palavras de tempo
   com a tabela de declinação), SIM.RU.QUANDO (expressões "em tal dia", "em tal mês", "todo tal dia" dos verbetes) e SIM.RU.EX_NUM (exemplos de
   numeral + substantivo das fontes). As regras abaixo são MODELOS e cada uma é comparada com a fonte; os placares saem de SIM.ruPlacarNum(), na hora:
   (1) formação de 11 a 19, das dezenas e das centenas a partir das unidades (regra ingênua, de propósito: mostra onde o russo foge do padrão);
   (2) nome de um número composto: palavras em fila, sem conjunção (Russian declension, Wikipedia);
   (3) forma do substantivo depois do número, decidida pela última palavra do numeral (mesma fonte); час e год têm forma própria (notas do Wiktionary);
   (4) "em tal dia" = в + acusativo; "em tal mês" = в + preposicional; "todo tal dia" = по + dativo plural (comparada com os 26 exemplos dos verbetes). */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const emb = (lista, r) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const AC = "́", sem = (s) => String(s).split(AC).join(""), GRANDE = "font:700 46px/1.15 Inter,system-ui,sans-serif;letter-spacing:1px";
  const nv = (s) => [...sem(s)].filter((c) => "аеёиоуыэюя".includes(c.toLowerCase())).length, igual = (a, b) => a === b || (sem(a) === sem(b) && nv(a) <= 1);
  const N = (n) => SIM.RU.NUM.find((x) => x.n === n);
  /* (2) nome do número (0 a 999, e 1000): palavras do dicionário em fila; 1 e 2 concordam em gênero com o substantivo */
  SIM.ruNumNome = (n, g = "m") => { if (n === 0 || n === 1000) return N(n).ac; if (!(n > 0 && n < 1000) || n % 1) return null; const o = [], c = Math.floor(n / 100) * 100, r = n % 100;
    if (c) o.push(N(c).ac); if (r >= 11 && r <= 19) o.push(N(r).ac); else { const d = Math.floor(r / 10) * 10, u = r % 10; if (d) o.push(N(d).ac); if (u) { const x = N(u); o.push(u <= 2 && g === "f" ? x.f : u === 1 && g === "n" ? x.nt : x.ac); } }
    return o.join(" "); };
  /* (3) caso e número do substantivo depois do número (numeral no nominativo ou no acusativo) */
  SIM.ruDepoisDe = (n) => { const r = n % 100, u = n % 10; return r >= 11 && r <= 14 ? { caso: "gen", num: 1 } : u === 1 ? { caso: "nom", num: 0 } : u >= 2 && u <= 4 ? { caso: "gen", num: 0 } : { caso: "gen", num: 1 }; };
  SIM.ruTabSubst = (w) => { const R = SIM.RU; return R.TEMPO[w] ? { ac: R.TEMPO[w].casos.nom[0], pt: R.TEMPO[w].pt, g: R.TEMPO[w].g, f: (c, k) => R.TEMPO[w].casos[c][k], cont: R.TEMPO[w].cont } : R.DECL[w] ? { ac: R.DECL[w].ac, pt: R.DECL[w].pt, g: R.DECL[w].g, f: (c, k) => R.DECL[w].casos[c][k][0] || null } : null; };
  SIM.ruSubstDepois = (n, w) => { const t = SIM.ruTabSubst(w), d = SIM.ruDepoisDe(n); if (!t) return null; if (t.cont && d.caso === "gen") { if (d.num === 0 && t.cont.sg) return t.cont.sg; if (d.num === 1 && t.cont.pl) return t.cont.pl; } return t.f(d.caso, d.num); };
  /* (1) formação ingênua a partir da unidade */
  const semMole = (s) => (s.endsWith("ь") ? s.slice(0, -1) : s);
  SIM.ruFormaRegra = (n) => { const u = (k) => N(k).w; if (n >= 11 && n <= 19) return semMole(u(n - 10)) + "надцать"; if (n >= 20 && n <= 90 && n % 10 === 0) return n <= 30 ? u(n / 10) + "дцать" : u(n / 10) + "десят"; if (n >= 200 && n <= 900 && n % 100 === 0) return n <= 400 ? u(n / 100) + "ста" : u(n / 100) + "сот"; return null; };
  /* (4) quando? */
  SIM.ruQuandoRegra = (w, tipo) => { const t = SIM.RU.TEMPO[w]; return tipo === "todo" ? "по " + t.casos.dat[1] : "в " + (t.tipo === "dia" ? t.casos.acc[0] : t.casos.prep[0]); };
  SIM.ruPlacarNum = () => { const R = SIM.RU, o = { forma: { ok: 0, n: 0, erros: [] }, nome: { ok: 0, n: 0, erros: [] }, subst: { ok: 0, n: 0, erros: [] }, quando: { ok: 0, n: 0, erros: [] } };
    R.NUM.forEach((x) => { const r = SIM.ruFormaRegra(x.n); if (r === null) return; o.forma.n++; if (r === x.w) o.forma.ok++; else o.forma.erros.push({ n: x.n, regra: r, dic: x.ac }); });
    R.EX_NUM.forEach((x) => { const u = x.n % 10, r = x.n % 100, precisaG = (u === 1 || u === 2) && !(r >= 11 && r <= 19); if (!(precisaG && !x.g)) { const nm = SIM.ruNumNome(x.n, x.g || "m"); o.nome.n++; if (sem(nm) === sem(x.nome)) o.nome.ok++; else o.nome.erros.push({ n: x.n, regra: nm, dic: x.nome }); }
      if (x.w) { const s = SIM.ruSubstDepois(x.n, x.w); o.subst.n++; if (s && igual(s, x.subst)) o.subst.ok++; else o.subst.erros.push({ n: x.n, regra: s, dic: x.subst }); } });
    R.QUANDO.forEach((q) => { const r = SIM.ruQuandoRegra(q.w, q.tipo); o.quando.n++; if (igual(r.split(" ")[1], q.ru.split(" ")[1]) && r.split(" ")[0] === q.ru.split(" ")[0]) o.quando.ok++; else o.quando.erros.push({ regra: r, dic: q.ru }); });
    return o; };
  SIM.ruSubstNum = () => ["час", "минута", "секунда", "день", "неделя", "месяц", "год", "книга", "окно", "мальчик", "стол", "яблоко", "задача", "слово"].filter((w) => SIM.ruTabSubst(w));

  /* nome: "Do algarismo ao nome: número e substantivo" · matéria: Russo · tema: RG16 */
  SIM.ruNumLab = (el, F) => { const L = SIM.ruSubstNum(); let n = 23, w = "час", ver = false, r = rng(1);
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">número (0 a 999) e substantivo</p><div class="bts"><input type="number" data-v="n" min="0" max="999" value="23" class="bt peq" style="width:88px;font-size:15px"><select data-v="w" class="bt peq" style="font-size:15px;padding:5px 8px">${L.map((x) => `<option value="${x}">${x} (${SIM.ruTabSubst(x).pt})</option>`).join("")}</select><button class="bt peq" data-v="sort">sortear</button><button class="bt peq" data-v="ver">mostrar</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), NC = SIM.ruNomeCaso;
    const est = () => { const t = SIM.ruTabSubst(w), d = SIM.ruDepoisDe(n); return { n, w, ver, nome: SIM.ruNumNome(n, t.g), subst: SIM.ruSubstDepois(n, w), caso: d.caso, num: d.num }; };
    const poe = (nn, ww) => { n = Math.max(0, Math.min(999, Math.round(+nn) || 0)); if (ww) w = ww; ver = false; desenha(); }, mostra = () => { ver = true; desenha(); };
    const desenha = () => { const e = est(), t = SIM.ruTabSubst(w); q("[data-v=n]").value = String(n); q("[data-v=w]").value = w;
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${n} + ${t.ac}</div><div style="font:600 24px/1.3 Inter,system-ui,sans-serif;margin-top:12px;color:${ver ? "var(--ink)" : "var(--ink3)"}">${ver ? e.nome + " " + (e.subst || "sem dado") : "?"}</div>`;
      q("[data-v=lt]").innerHTML = vis("última palavra do número", ver ? e.nome.split(" ").pop() : "?") + vis("substantivo no", ver ? NC[e.caso] + (e.num ? " plural" : " singular") : "?");
      q("[data-v=st]").innerHTML = ver ? `Quem manda é a última palavra do numeral: ${e.caso === "nom" ? "termina em \"um\" → nominativo singular" : e.num === 0 ? "termina em \"dois\", \"três\" ou \"quatro\" → genitivo singular" : "qualquer outro final, inclusive 11 a 14 e os terminados em zero → genitivo plural"}.${t.cont && e.caso === "gen" && ((e.num === 0 && t.cont.sg) || (e.num === 1 && t.cont.pl)) ? " Esta palavra tem forma própria depois de número (nota de uso do verbete)." : ""} Nome montado pelo site com as palavras do dicionário; regra da Wikipedia em inglês (Russian declension), que vale para o numeral no nominativo ou no acusativo.` : "Diga em voz alta o número e o substantivo na forma certa. Depois clique em \"mostrar\"."; };
    q("[data-v=n]").addEventListener("change", (ev) => poe(ev.target.value)); q("[data-v=w]").addEventListener("change", (ev) => poe(n, ev.target.value)); q("[data-v=ver]").addEventListener("click", mostra);
    q("[data-v=sort]").addEventListener("click", () => poe(Math.floor(r() * 1000), L[Math.floor(r() * L.length)])); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => { const e = est(); return e.nome + " " + e.subst; });
    SIM.ruNumLab._ult = { poe, mostra, est, semente: (k) => { r = rng(k); } }; desenha(); };

  /* nome: "As regras dos números contra a fonte" · matéria: Russo · tema: RG16 */
  SIM.ruNumPlacar = (el, F) => { const ROT = { forma: "formar 11 a 19, dezenas e centenas", nome: "nome do número composto", subst: "substantivo depois do número", quando: "em tal dia, em tal mês" }; let k = "forma";
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${Object.keys(ROT).map((x) => `<button class="bt peq" data-k="${x}">${ROT[x]}</button>`).join("")}</div></div></div><div class="leitor" data-v="lt"></div><div class="palco" data-v="pal" style="padding:10px 14px"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => ({ k, ...SIM.ruPlacarNum()[k] });
    const TX = { forma: "Regra ingênua: unidade + -надцать (11 a 19); unidade + -дцать (20, 30) ou + -десят (40 a 90); unidade + -ста (200 a 400) ou + -сот (500 a 900). Comparada, letra por letra, com os verbetes.", nome: "Regra: centena, dezena e unidade em fila, sem conjunção; 1 e 2 concordam em gênero. Comparada com os numerais dos exemplos das fontes (sem olhar o acento).", subst: "Regra: final \"um\" → nominativo singular; finais 2, 3, 4 → genitivo singular; o resto, inclusive 11 a 14 → genitivo plural; час e год com a forma própria das notas de uso. Comparada com os exemplos das fontes cujo substantivo está no banco.", quando: "Regra: dia da semana, в + acusativo; mês, в + preposicional; \"todo tal dia\", по + dativo plural. Comparada com os exemplos dos verbetes dos sete dias e dos doze meses." };
    const desenha = () => { const e = est(); el.querySelectorAll("[data-k]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === k)));
      q("[data-v=lt]").innerHTML = vis("a regra acerta", `${e.ok} de ${e.n}`) + vis("erros", e.erros.length);
      q("[data-v=pal]").innerHTML = e.erros.length ? `<table style="margin:0 auto;border-collapse:collapse;font-size:15px"><tr><th style="padding:3px 14px;color:var(--ink2);font-weight:500">a regra dá</th><th style="padding:3px 14px;color:var(--ink2);font-weight:500">a fonte dá</th></tr>${e.erros.map((x) => `<tr><td style="padding:3px 14px;color:var(--bad, #e06666)">${x.regra}</td><td style="padding:3px 14px;font-weight:600">${x.dic}</td></tr>`).join("")}</table>` : `<p style="text-align:center;color:var(--ink2);margin:6px 0">Nenhuma diferença nesta amostra.</p>`;
      q("[data-v=st]").innerHTML = TX[k] + " Placar calculado agora, no seu navegador."; };
    el.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => { k = b.dataset.k; desenha(); }));
    SIM.ruNumPlacar._ult = { poe: (x) => { k = x; desenha(); }, est }; desenha(); };

  /* nome: "Quantos? Escolha a forma do substantivo" · matéria: Russo · tema: RG16 */
  SIM.ruQuantos = (el, F) => { const L = SIM.ruSubstNum(); let r = rng(1), x = null, clic = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts" data-v="ops"></div><div class="bts"><button class="bt peq" data-v="prox">outro</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), NC = SIM.ruNomeCaso;
    const prox = () => { const w = L[Math.floor(r() * L.length)], n = [1, 2, 3, 4, 5, 7, 10, 11, 12, 14, 20, 21, 22, 25, 31, 43, 100, 101, 112][Math.floor(r() * 19)], t = SIM.ruTabSubst(w), certa = SIM.ruSubstDepois(n, w); const ops = emb([...new Set([t.f("nom", 0), (t.cont && t.cont.sg) || t.f("gen", 0), (t.cont && t.cont.pl) || t.f("gen", 1), t.f("nom", 1)].filter(Boolean))], r); x = { n, w, certa, ops }; clic = null; desenha(); };
    const clica = (o) => { if (clic !== null) return; clic = o; feitos++; if (o === x.certa) certos++; desenha(); };
    const est = () => ({ ...x, clic, certos, feitos });
    const desenha = () => { const t = SIM.ruTabSubst(x.w), d = SIM.ruDepoisDe(x.n);
      q("[data-v=ops]").innerHTML = x.ops.map((o) => `<button class="bt peq" data-o="${o}" style="font-size:17px;border-color:${clic === null ? "" : o === x.certa ? "var(--ok)" : o === clic ? "var(--bad, #e06666)" : ""}">${o}</button>`).join(""); q("[data-v=ops]").querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.o)));
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${x.n} + ${t.ac}</div><div style="font-size:14px;color:var(--ink2);margin-top:8px">${t.pt}${clic === null ? "" : " · " + SIM.ruNumNome(x.n, t.g) + " " + x.certa}</div>`;
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : clic === x.certa ? "certo" : "ainda não") + vis("forma", clic === null ? "?" : NC[d.caso] + (d.num ? " plural" : " singular")) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = clic === null ? "Olhe como o número termina quando é dito por extenso: 21 termina em \"um\", 12 não termina em \"dois\"." : `${x.n}: ${NC[d.caso]} ${d.num ? "plural" : "singular"}. Regra da Wikipedia em inglês; formas da tabela do Wiktionary.`; };
    q("[data-v=prox]").addEventListener("click", prox);
    SIM.ruQuantos._ult = { semente: (n) => { r = rng(n); certos = feitos = 0; prox(); }, clica, prox, est }; prox(); };

  /* nome: "Escreva por extenso: número, dia ou mês" · matéria: Russo · tema: RG16 */
  SIM.ruEscreveNum = (el, F) => { let modo = "num", r = rng(1), x = null, res = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-m="num">número por extenso</button><button class="bt peq" data-m="quando">em que dia? em que mês?</button><button class="bt peq" data-v="prox">outro</button><button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button></div><div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div>
      <div style="display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap"><input type="text" data-v="inp" lang="ru" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="escreva em cirílico" style="font:600 24px Inter,system-ui,sans-serif;padding:6px 10px;min-width:340px;background:var(--card2);color:var(--ink);border:1.5px solid var(--line);border-radius:9px"><button class="bt peq" data-v="conf">conferir</button></div>
      <div style="display:flex;justify-content:center">${F.tecladoRu()}</div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), inp = q("[data-v=inp]");
    const prox = () => { if (modo === "num") { const n = [Math.floor(r() * 20), Math.floor(r() * 100), Math.floor(r() * 1000)][Math.floor(r() * 3)]; x = { n, resp: [SIM.ruNumNome(n, "m")], mostra: String(n), sub: "escreva o número por extenso (masculino)" }; } else { const Q = SIM.RU.QUANDO, k = Q[Math.floor(r() * Q.length)], t = SIM.RU.TEMPO[k.w]; x = { w: k.w, resp: [k.ru], mostra: t.ac, sub: `${t.pt} · escreva "${k.tipo === "todo" ? "toda semana, nesse dia" : t.tipo === "dia" ? "nesse dia" : "nesse mês"}": preposição e palavra` }; } res = null; inp.value = ""; desenha(); };
    const confere = () => { const v = F.normTxt(inp.value).replace(/\s+/g, " "); if (!v) return; res = x.resp.map((p) => F.normTxt(p)).includes(v); feitos++; if (res) certos++; desenha(); };
    const est = () => ({ ...x, modo, res, certos, feitos });
    const desenha = () => { el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.m === modo)));
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${x.mostra}</div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${x.sub}</div>`; inp.style.borderColor = res === null ? "var(--line)" : res ? "var(--ok)" : "var(--bad, #e06666)";
      q("[data-v=lt]").innerHTML = vis("resultado", res === null ? "?" : res ? "certo" : "ainda não") + vis("resposta", res === null ? "?" : x.resp.join(" ou ")) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = res === null ? "Use a tecla de espaço do teclado da tela entre as palavras. O acento não precisa ser digitado." : modo === "num" ? `${x.mostra} = ${x.resp[0]}. Nome montado pelo site com as palavras do dicionário, em fila e sem conjunção.` : `${x.resp[0]}: exemplo do verbete (Wiktionary em inglês).`; };
    el.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { modo = b.dataset.m; prox(); })); q("[data-v=prox]").addEventListener("click", prox); q("[data-v=conf]").addEventListener("click", confere); inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); confere(); } });
    F.ligaTecladoRu(el, inp); if (SIM.ruBotaoOuvir) SIM.ruBotaoOuvir(el, () => x.resp[0]);
    SIM.ruEscreveNum._ult = { semente: (n) => { r = rng(n); certos = feitos = 0; prox(); }, modo: (m) => { modo = m; prox(); }, digita: (s) => { inp.value = s; }, confere, prox, est }; prox(); };
})();
