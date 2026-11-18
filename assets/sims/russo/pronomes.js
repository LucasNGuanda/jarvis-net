/* Russo · pronomes (RG10): laboratórios.
   Dados: SIM.RU.PRON (pronomes pessoais e interrogativos nos seis casos), SIM.RU.POSS (possessivos e demonstrativos, com a declinação completa),
   SIM.RU.DONO e DONO3 (qual possessivo corresponde a cada pessoa), todos GERADOS a partir das tabelas do Wiktionary em inglês.
   Aqui não há regra de formação: os pronomes são poucos e irregulares, e o que se treina é a tabela. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const emb = (lista, r) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const AC = "́", sem = (s) => String(s).split(AC).join(""), GRANDE = "font:700 50px/1.15 Inter,system-ui,sans-serif;letter-spacing:1px";
  const NOME = { nom: "nominativo", acc: "acusativo", gen: "genitivo", dat: "dativo", ins: "instrumental", prep: "preposicional" }, PESSOAIS = ["я", "ты", "он", "она", "оно", "мы", "вы", "они"];
  SIM.ruPessoais = PESSOAIS;
  /* possessivo de cada pessoa: [pronome, possessivo] */
  SIM.ruDonos = () => SIM.RU.DONO.map(([p, f]) => [p, SIM.RU.POSS[f].ac]).concat(SIM.RU.DONO3);

  /* nome: "De quem é? Do pronome ao possessivo" · matéria: Russo · tema: RG10 */
  SIM.ruDono = (el, F) => { let r = rng(1), fila = [], x = null, clic = null, certos = 0, feitos = 0, ops = [];
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="prox">outro</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div><div data-v="ops" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:620px;margin:0 auto 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), D = () => SIM.ruDonos();
    const prox = () => { if (!fila.length) fila = emb(D().map((y, i) => i), r); x = fila.pop(); ops = emb(D().map((y) => y[1]), r); clic = null; desenha(); };
    const clica = (f) => { if (clic !== null) return; clic = f; feitos++; if (f === D()[x][1]) certos++; desenha(); };
    const est = () => ({ pron: D()[x][0], certa: D()[x][1], clic, certos, feitos, ops: ops.slice() });
    const desenha = () => { const [p, c] = D()[x], P = SIM.RU.PRON[p];
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${p} <span style="color:var(--ink3)">→</span> <span style="color:${clic === null ? "var(--ink3)" : "var(--ok)"}">${clic === null ? "?" : c}</span></div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${P.pt} · qual é o possessivo dessa pessoa?</div>`;
      q("[data-v=ops]").innerHTML = ops.map((f) => `<button type="button" class="bt" data-o="${f}" style="padding:9px;font-size:19px;font-weight:600;border-color:${clic === null ? "" : f === c ? "var(--ok)" : f === clic ? "var(--bad, #e06666)" : ""}">${f}</button>`).join("");
      q("[data-v=ops]").querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.o)));
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : clic === c ? "certo" : "ainda não") + vis("possessivo", clic === null ? "?" : c) + vis("placar", `${certos} de ${feitos}`);
      const terceira = ["он", "она", "они"].includes(p);
      q("[data-v=st]").innerHTML = clic === null ? "Para eu, tu, nós e vocês há um possessivo próprio, que concorda com a coisa possuída. Para ele, ela e eles, o russo usa outra solução." : terceira ? `${p} → <b>${c}</b>: é o genitivo do próprio pronome pessoal ("dele", "dela", "deles"). Não muda nunca, seja qual for a coisa possuída.` : `${p} → <b>${c}</b>: possessivo que se declina como um adjetivo e concorda com a coisa possuída: ${SIM.RU.POSS[sem(c)].casos.nom.map((g) => g[0]).join(", ")}.`; };
    q("[data-v=prox]").addEventListener("click", prox);
    SIM.ruDono._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, clica, prox, est }; prox(); };

  /* nome: "Escreva o pronome no caso pedido" · matéria: Russo · tema: RG10 */
  SIM.ruEscrevePron = (el, F) => { let r = rng(1), fila = [], x = null, res = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="prox">outro</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div>
      <div style="display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap"><input type="text" data-v="inp" lang="ru" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="escreva o pronome em cirílico" style="font:600 24px Inter,system-ui,sans-serif;padding:6px 10px;min-width:260px;background:var(--card2);color:var(--ink);border:1.5px solid var(--line);border-radius:9px"><button class="bt peq" data-v="conf">conferir</button></div>
      <div style="display:flex;justify-content:center">${F.tecladoRu()}</div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), inp = q("[data-v=inp]");
    const base = () => { const o = []; PESSOAIS.concat(["кто", "что"]).forEach((p) => ["acc", "gen", "dat", "ins", "prep"].forEach((c) => { if (SIM.RU.PRON[p].casos[c].length) o.push({ p, c }); })); return o; };
    const resp = () => SIM.RU.PRON[x.p].casos[x.c], prox = () => { if (!fila.length) fila = emb(base(), r); x = fila.pop(); res = null; inp.value = ""; desenha(); };
    const confere = () => { const t = F.normTxt(inp.value); if (!t) return; res = resp().map((f) => F.normTxt(f)).includes(t); feitos++; if (res) certos++; desenha(); };
    const est = () => ({ ...x, resp: resp(), res, certos, feitos });
    const desenha = () => { const P = SIM.RU.PRON[x.p];
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${x.p}</div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${P.pt} · escreva no <b>${NOME[x.c]}</b></div>`;
      inp.style.borderColor = res === null ? "var(--line)" : res ? "var(--ok)" : "var(--bad, #e06666)";
      q("[data-v=lt]").innerHTML = vis("resultado", res === null ? "?" : res ? "certo" : "ainda não") + vis("forma da tabela", res === null ? "?" : resp().join(" ou ")) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = res === null ? "Vale qualquer forma que a tabela do dicionário traz para esse caso (nos de terceira pessoa, com ou sem o н- do começo). O acento não precisa ser digitado; o ё precisa." : res ? `Certo: ${resp().join(" ou ")}.` : `Você escreveu "${inp.value}"; a tabela dá ${resp().join(" ou ")}.`; };
    q("[data-v=prox]").addEventListener("click", prox); q("[data-v=conf]").addEventListener("click", confere); inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); confere(); } }); F.ligaTecladoRu(el, inp);
    SIM.ruEscrevePron._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, digita: (t) => { inp.value = t; }, confere, prox, est }; prox(); };
})();
