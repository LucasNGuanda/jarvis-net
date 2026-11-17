/* Russo · laboratórios do tema RG02 (ortografia e acento tônico).
   Dados: SIM.RU (assets/sims/russo/dados.js, GERADO a partir de tools/russo/dadosR.json).
   A REGRA de redução das vogais átonas programada aqui (SIM.ruReduz) é um resumo das páginas "Russian phonology" e "Vowel reduction in Russian"
   da Wikipedia em inglês. Ela NÃO é dada como certa: o laboratório e o teste (tests/tlabsR.js) comparam a previsão, vogal por vogal,
   com a pronúncia do dicionário (Wiktionary), e a tela mostra o placar medido. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const AC = "́", VOG = "аеёиоуыэюя", SEMPRE_DURA = "жшц", SEMPRE_MOLE = "чщй";
  const CLASSE = { tonica: ["tônica", "var(--ok)"], pre: ["logo antes da tônica", "var(--warn)"], ini: ["começo da palavra", "var(--warn)"], outra: ["longe da tônica", "var(--ink3)"], mole: ["depois de consoante mole ou de /j/", "var(--mod)"], dura: ["depois de ж, ш ou ц", "var(--mod)"], alta: ["vogal alta: quase não muda", "var(--ink3)"], fim: ["fim de palavra: varia", "var(--ink3)"], semregra: ["sem regra neste tema", "var(--ink3)"] };
  SIM.ruClasse = CLASSE;
  /* vogais de uma palavra acentuada: letra, posição, se é a tônica. Sem acento marcado: ё é a tônica; palavra de uma vogal só, essa vogal. */
  SIM.ruVogais = (ac) => { const cs = [...ac], pl = [], ton = []; cs.forEach((c) => { if (c === AC) ton[pl.length - 1] = true; else pl.push(c); }); const vs = pl.map((c, i) => ({ c: c.toLowerCase(), i, ant: i ? pl[i - 1].toLowerCase() : null, ton: !!ton[i], fim: i === pl.length - 1 })).filter((x) => VOG.includes(x.c)); if (!vs.some((x) => x.ton)) { const yo = vs.find((x) => x.c === "ё"); if (yo) yo.ton = true; else if (vs.length === 1) vs[0].ton = true; } return vs; };
  /* previsão do som de cada vogal átona (resumo das regras da fonte); som null = a regra deste tema não prevê */
  SIM.ruReduz = (ac) => { const vs = SIM.ruVogais(ac), jt = vs.findIndex((x) => x.ton); return vs.map((x, j) => { const o = { ...x, j };
      if (x.ton) return { ...o, cl: "tonica", som: null, aceita: null };
      const iot = "еёюя".includes(x.c), semCons = x.ant === null || VOG.includes(x.ant) || x.ant === "ь" || x.ant === "ъ";
      const em = (s) => x.ant !== null && s.includes(x.ant), mole = iot || x.c === "и" ? !em(SEMPRE_DURA) : em(SEMPRE_MOLE);
      if (x.c === "у" || x.c === "ю") return { ...o, cl: "alta", som: "ʊ", aceita: ["ʊ", "u", "ʉ"] };
      if (x.c === "ы") return { ...o, cl: "alta", som: "ɨ", aceita: ["ɨ"] };
      if (x.c === "и") return mole ? { ...o, cl: "alta", som: "ɪ", aceita: ["ɪ", "i"] } : { ...o, cl: "dura", som: "ɨ", aceita: ["ɨ"] };
      if (x.c === "э" || x.c === "ё") return { ...o, cl: "semregra", som: null, aceita: null };
      if (x.c === "а" || x.c === "о") { if (mole && x.fim) return { ...o, cl: "fim", som: null, aceita: null }; if (mole) return { ...o, cl: "mole", som: "ɪ", aceita: ["ɪ"] }; if (x.ant === null) return { ...o, cl: "ini", som: "ɐ", aceita: ["ɐ", "ʌ"] }; if (j === jt - 1) return { ...o, cl: "pre", som: "ɐ", aceita: ["ɐ", "ʌ"] }; return { ...o, cl: "outra", som: "ə", aceita: ["ə"] }; }
      /* е, я */
      if (x.fim) return { ...o, cl: "fim", som: null, aceita: null };
      if (!mole && !semCons) return { ...o, cl: "dura", som: "ɨ", aceita: ["ɨ"] };
      return { ...o, cl: "mole", som: "ɪ", aceita: ["ɪ"] }; }); };
  /* vogais de uma transcrição do dicionário, na ordem (o que está entre parênteses é opcional e sai) */
  SIM.ruVogaisIpa = (ipa) => [...String(ipa || "").replace(/\([^)]*\)/g, "")].filter((c) => "aɐəoɵeɛiɪɨuʊʉæʌ".includes(c));
  /* compara a previsão com o dicionário: n = vogais átonas com previsão; ok = quantas batem */
  SIM.ruCompara = (ac, ipa) => { const r = SIM.ruReduz(ac), d = SIM.ruVogaisIpa(ipa); if (d.length !== r.length) return { comparavel: false, n: 0, ok: 0, itens: r.map((x) => ({ ...x, dic: null, bate: null })) }; const itens = r.map((x, k) => ({ ...x, dic: d[k], bate: x.aceita ? x.aceita.includes(d[k]) : null })); return { comparavel: true, n: itens.filter((x) => x.bate !== null).length, ok: itens.filter((x) => x.bate).length, itens }; };
  /* palavras do laboratório: as do dicionário com duas ou mais vogais e os exemplos da fonte sobre redução */
  SIM.ruListaRed = () => { const R = SIM.RU, o = []; Object.entries(R.PAL).forEach(([w, x]) => { if (SIM.ruVogais(x.ac).length >= 2 && x.ipa) o.push({ ac: x.ac, ipa: x.ipa, pt: x.pt, fonte: "Wiktionary" }); }); R.RED.akanye.concat(...R.RED.mole, ...R.RED.ikanye).forEach((x) => { if (SIM.ruVogais(x.ac).length >= 2 && !o.some((y) => y.ac === x.ac)) o.push({ ac: x.ac, ipa: x.ipa, pt: x.pt, fonte: "Wikipedia" }); }); return o; };
  SIM.ruPlacar = () => { let n = 0, ok = 0, pal = 0, fora = 0; const erradas = []; SIM.ruListaRed().forEach((x) => { const c = SIM.ruCompara(x.ac, x.ipa); if (!c.comparavel) return fora++; pal++; n += c.n; ok += c.ok; if (c.ok < c.n) erradas.push(x.ac); }); return { n, ok, pal, fora, erradas }; };
  /* ortografia: depois da consoante c, a vogal v pode ser escrita? (tabela-resumo da fonte; só vale para os pares ы/и, ю/у, я/а) */
  SIM.ruPode = (c, v) => { const linha = SIM.RU.REG.find((r) => r.letras.includes(c.toLowerCase())), col = { ы: 0, и: 0, у: 1, ю: 1, а: 2, я: 2 }[v.toLowerCase()]; if (!linha || col === undefined) return true; return linha.cols[col].includes(v.toLowerCase()); };
  SIM.ruSurda = (c) => { const p = SIM.RU.SONS.find((x) => x[0] === c.toUpperCase()); return p ? p[1].toLowerCase() : null; };
  const marca = (ac, cor = "var(--ok)") => { const cs = [...ac]; return cs.map((c, i) => (c === AC ? "" : cs[i + 1] === AC ? `<span style="color:${cor}">${c}${AC}</span>` : c)).join(""); };
  SIM.ruMarca = marca;

  /* nome: "Mesmas letras, outro acento, outra palavra" · matéria: Russo · tema: RG02 */
  SIM.ruAcento = (el, F) => { const P = SIM.RU.PAR; let k = 0, lado = "a", ver = false;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">letras</p><div class="bts">${botoes(P.map((x, i) => [i, x.ru]), "k", k)}</div></div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">acento</p><div class="bts">${botoes([["a", "forma 1"], ["b", "forma 2"]], "lado", lado)}<button class="bt peq" data-v="ver" aria-pressed="false">mostrar o sentido</button></div></div></div>
      <div class="palco" data-v="pal" style="text-align:center;padding:20px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => { const x = P[k][lado], c = SIM.ruCompara(x.ac, x.ipa); return { ru: P[k].ru, lado, ver, ...x, silaba: SIM.ruVogais(x.ac).findIndex((v) => v.ton) + 1, vogais: c.itens.map((v) => ({ c: v.c, ton: v.ton, dic: v.dic })) }; };
    const desenha = () => { const e = est(); q("[data-v=ver]").setAttribute("aria-pressed", String(ver));
      q("[data-v=pal]").innerHTML = `<div style="font:700 62px/1.1 Inter,system-ui,sans-serif;letter-spacing:2px">${marca(e.ac)}</div><div style="margin-top:10px;display:flex;gap:10px;justify-content:center">${e.vogais.map((v) => `<div style="min-width:74px;padding:6px 8px;border-radius:9px;border:1.5px solid ${v.ton ? "var(--ok)" : "var(--line)"};background:var(--card2)"><div style="font:600 20px Inter,system-ui,sans-serif">${v.c}</div><div style="font-size:12px;color:var(--ink2)">${v.ton ? "tônica" : "átona"}</div><div style="font:600 17px Inter,system-ui,sans-serif;color:${v.ton ? "var(--ok)" : "var(--warn)"}">[${v.dic}]</div></div>`).join("")}</div>`;
      q("[data-v=lt]").innerHTML = vis("sílaba tônica", e.silaba + "ª") + vis("pronúncia (AFI)", e.ipa) + vis("leitura", e.tr) + vis("sentido", ver ? e.pt : "?");
      q("[data-v=st]").innerHTML = `As letras são as mesmas nas duas formas; só o acento muda de lugar, e com ele o som das vogais que ficam fora da tônica. Na escrita comum o acento não aparece: as duas formas ficam idênticas. ${ver ? "" : "Antes de clicar em mostrar: você sabe qual das duas formas quer dizer o quê? "}Acento e pronúncia: verbete "${e.ru}" do Wiktionary em inglês.`; };
    liga(el, "k", (v) => { k = +v; ver = false; desenha(); }); liga(el, "lado", (v) => { lado = v; ver = false; desenha(); }); q("[data-v=ver]").addEventListener("click", () => { ver = !ver; desenha(); });
    SIM.ruAcento._ult = { poe: (i, l, v = false) => { k = i; lado = l; ver = v; [["k", k], ["lado", lado]].forEach(([a, x]) => el.querySelectorAll(`[data-${a}]`).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset[a] === String(x))))); desenha(); }, est }; desenha(); };

  /* nome: "A regra das vogais átonas contra o dicionário" · matéria: Russo · tema: RG02 */
  SIM.ruReducao = (el, F) => { const L = SIM.ruListaRed(); let k = Math.max(0, L.findIndex((x) => x.ac.replace(AC, "") === "молоко")), ver = false, r = rng(1);
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="ant">anterior</button><button class="bt peq" data-v="prox">próxima</button><button class="bt peq" data-v="sort">sortear</button><button class="bt peq" data-v="ver" aria-pressed="false">comparar com o dicionário</button></div></div></div>
      <div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => { const x = L[k], c = SIM.ruCompara(x.ac, x.ipa); return { ...x, k, total: L.length, ver, ...c, placar: SIM.ruPlacar() }; };
    const desenha = () => { const e = est(); q("[data-v=ver]").setAttribute("aria-pressed", String(ver));
      q("[data-v=pal]").innerHTML = `<div style="font:700 54px/1.1 Inter,system-ui,sans-serif;letter-spacing:2px">${marca(e.ac)}</div><div style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">${e.itens.map((v) => { const cl = SIM.ruClasse[v.cl]; return `<div style="width:128px;padding:6px 6px;border-radius:9px;border:1.5px solid ${cl[1]};background:var(--card2)"><div style="font:600 20px Inter,system-ui,sans-serif">${v.c}</div><div style="font-size:11.5px;color:var(--ink2);min-height:30px">${cl[0]}</div><div style="font:600 16px Inter,system-ui,sans-serif">${v.ton ? "som cheio" : v.som ? "regra: [" + v.som + "]" : "regra: —"}</div><div style="font:600 16px Inter,system-ui,sans-serif;color:${v.bate === false ? "var(--bad, #e06666)" : "var(--ok)"};min-height:22px">${ver ? (e.comparavel ? "dic.: [" + v.dic + "]" + (v.bate === null ? "" : v.bate ? " ✓" : " ✗") : "") : ""}</div></div>`; }).join("")}</div>`;
      q("[data-v=lt]").innerHTML = vis("palavra", (e.k + 1) + " de " + e.total) + vis("sentido", e.pt) + vis("dicionário (AFI)", ver ? e.ipa : "?") + vis("nesta palavra", ver ? (e.comparavel ? `${e.ok} de ${e.n} átonas` : "não comparável") : "?") + vis("placar da regra", ver ? `${e.placar.ok} de ${e.placar.n}` : "?");
      q("[data-v=st]").innerHTML = (ver ? (e.comparavel ? "" : "Nesta palavra o número de vogais da transcrição não bate com o de letras de vogal: fica fora da comparação. ") + `Placar medido agora, em ${e.placar.pal} palavras: a regra acerta <b>${e.placar.ok} de ${e.placar.n}</b> vogais átonas${e.placar.fora ? ` (${e.placar.fora} palavras ficaram fora da comparação)` : ""}. Onde ela erra, vale o dicionário. ` : "Preveja o som de cada vogal fora da tônica e só então compare. ") + `A regra é um resumo de "Russian phonology" e "Vowel reduction in Russian" (Wikipedia em inglês); a pronúncia vem do ${e.fonte}. Vogais do fim da palavra (е, я) e a letra э ficam sem previsão.`; };
    q("[data-v=ant]").addEventListener("click", () => { k = (k + L.length - 1) % L.length; ver = false; desenha(); }); q("[data-v=prox]").addEventListener("click", () => { k = (k + 1) % L.length; ver = false; desenha(); });
    q("[data-v=sort]").addEventListener("click", () => { let n = k; while (n === k) n = Math.floor(r() * L.length); k = n; ver = false; desenha(); }); q("[data-v=ver]").addEventListener("click", () => { ver = !ver; desenha(); });
    SIM.ruReducao._ult = { semente: (n) => { r = rng(n); }, sorteia: () => q("[data-v=sort]").click(), poe: (ac, v = false) => { k = L.findIndex((x) => x.ac === ac || x.ac.replace(AC, "") === ac); ver = v; desenha(); }, compara: (v = true) => { ver = v; desenha(); }, est }; desenha(); };
})();
