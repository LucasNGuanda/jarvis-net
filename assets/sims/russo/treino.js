/* Russo · técnicas de treino (β 6.7): escrever em cirílico, jogo de pares, leitura contra o relógio, achar a sílaba tônica e ouvir a palavra.
   Todas as palavras, leituras, acentos e traduções vêm de SIM.RU (GERADO a partir de tools/russo/dadosR.json). Todo sorteio aceita semente.
   Áudio: usa a voz russa do próprio navegador (speechSynthesis), se houver. O site não traz gravação nenhuma; sem voz russa instalada, o botão avisa. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const emb = (lista, r) => { const a = lista.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const AC = "́", norm = (s) => String(s || "").normalize("NFC").split(AC).join("").trim().toLowerCase();
  const GRANDE = "font:700 56px/1.1 Inter,system-ui,sans-serif;letter-spacing:2px";
  SIM.ruNorm = norm;

  /* ---------- voz ---------- */
  /* β 7.0: a voz pode ser escolhida e ajustada (laboratório "Voz russa" do RG01); a escolha fica em rus:voz, neste navegador */
  const cfgVoz = () => { try { return Object.assign({ nome: "", vel: 0.85, acento: false }, JSON.parse(localStorage.getItem("rus:voz") || "{}")); } catch (e) { return { nome: "", vel: 0.85, acento: false }; } };
  SIM.ruVozCfg = (novo) => { if (novo) { try { localStorage.setItem("rus:voz", JSON.stringify(Object.assign(cfgVoz(), novo))); } catch (e) {} } return cfgVoz(); };
  SIM.ruVozes = () => { try { const s = window.speechSynthesis; return s ? s.getVoices().filter((v) => /^ru\b/i.test(v.lang)) : []; } catch (e) { return []; } };
  /* sem escolha feita: prefere as vozes "naturais" ou de rede, que costumam soar melhor que a voz básica do sistema */
  SIM.ruVoz = () => { const vs = SIM.ruVozes(), c = cfgVoz(); return vs.find((v) => v.name === c.nome) || vs.find((v) => /natural|online|neural|google|premium|enhanced/i.test(v.name)) || vs[0] || null; };
  const diz = (texto, voz) => { const c = cfgVoz(), u = new SpeechSynthesisUtterance(c.acento ? String(texto) : String(texto).split(AC).join("")); u.voice = voz; u.lang = voz.lang; u.rate = c.vel; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); };
  /* alguns navegadores só entregam a lista de vozes um instante depois do primeiro pedido: nesse caso espera a lista e fala em seguida */
  SIM.ruFala = (texto) => { const voz = SIM.ruVoz(); if (voz) { diz(texto, voz); return true; } try { const s = window.speechSynthesis; if (s && s.addEventListener && !s._ruEspera) { s._ruEspera = true; s.addEventListener("voiceschanged", () => { s._ruEspera = false; const v2 = SIM.ruVoz(); if (v2) diz(texto, v2); }, { once: true }); } } catch (e) {} return false; };
  SIM.ruBotaoOuvir = (raiz, pegaTexto) => { const b = raiz.querySelector("[data-v=ouvir]"), aviso = raiz.querySelector("[data-v=semvoz]"); if (!b) return; b.addEventListener("click", () => { const ok = SIM.ruFala(pegaTexto()); if (aviso) aviso.textContent = ok ? "" : "Este navegador não tem voz russa instalada: sem áudio aqui. (O site não traz gravações; ele usa a voz do sistema.)"; }); };
  const OUVIR = `<button class="bt peq" data-v="ouvir" title="voz russa do navegador, se houver">ouvir</button>`, SEMVOZ = `<div data-v="semvoz" style="font-size:12.5px;color:var(--warn);min-height:16px"></div>`;

  /* nome: "Escreva em cirílico" · matéria: Russo · tema: RG01 */
  SIM.ruDigita = (el, F) => { const MOD = [["copiar", "copiar a palavra"], ["leitura", "a partir da leitura"], ["sentido", "a partir do sentido"]]; let modo = "copiar", r = rng(1), fila = [], w = null, res = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">o que aparece</p><div class="bts">${botoes(MOD, "m", modo)}</div></div><div><div class="bts">${OUVIR}<button class="bt peq" data-v="prox">outra palavra</button></div>${SEMVOZ}</div></div>
      <div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div>
      <div style="display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap"><input type="text" data-v="inp" lang="ru" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="escreva a palavra em cirílico" style="font:600 24px Inter,system-ui,sans-serif;padding:6px 10px;min-width:280px;background:var(--card2);color:var(--ink);border:1.5px solid var(--line);border-radius:9px"><button class="bt peq" data-v="conf">conferir</button></div>
      <div style="display:flex;justify-content:center">${F.tecladoRu()}</div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), P = SIM.RU.PAL, inp = q("[data-v=inp]"), lista = () => SIM.RU.LISTA.todas.filter((k) => [...k].length <= 8);
    const prox = () => { if (!fila.length) fila = emb(lista(), r); w = fila.pop(); res = null; inp.value = ""; desenha(); };
    const confere = () => { if (!norm(inp.value)) return; res = norm(inp.value) === norm(w); feitos++; if (res) certos++; desenha(); };
    const est = () => ({ palavra: w, modo, res, certos, feitos, digitado: inp.value, ...P[w] });
    const desenha = () => { const p = P[w];
      q("[data-v=pal]").innerHTML = modo === "copiar" ? `<div style="${GRANDE}">${w}</div><div style="font-size:13px;color:var(--ink2);margin-top:6px">copie, letra por letra</div>` : modo === "leitura" ? `<div style="${GRANDE}">${p.tr}</div><div style="font-size:13px;color:var(--ink2);margin-top:6px">leitura (convenção do Wiktionary) · quer dizer: ${p.pt}</div>` : `<div style="${GRANDE}">${p.pt}</div><div style="font-size:13px;color:var(--ink2);margin-top:6px">escreva a palavra russa</div>`;
      inp.style.borderColor = res === null ? "var(--line)" : res ? "var(--ok)" : "var(--bad, #e06666)";
      q("[data-v=lt]").innerHTML = vis("resultado", res === null ? "?" : res ? "certo" : "ainda não") + vis("resposta", res === null ? "?" : p.ac) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = res === null ? "Use o teclado russo do computador, se tiver, ou o teclado da tela. Maiúsculas e o acento da sílaba tônica não contam." : res ? `Certo: ${p.ac} (${p.tr}), ${p.pt}.` : `Compare letra por letra: você escreveu "${inp.value}", a palavra é ${p.ac} (${p.tr}).`; };
    liga(el, "m", (v) => { modo = v; res = null; inp.value = ""; desenha(); }); q("[data-v=prox]").addEventListener("click", prox); q("[data-v=conf]").addEventListener("click", confere);
    inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); confere(); } }); F.ligaTecladoRu(el, inp); SIM.ruBotaoOuvir(el, () => w);
    SIM.ruDigita._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, modo: (m) => { modo = m; el.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.m === m))); res = null; desenha(); }, digita: (t) => { inp.value = t; }, tecla: (c) => el.querySelector(`[data-tecla="${c}"]`).click(), confere, prox, est }; prox(); };

  /* nome: "Jogo de pares: palavra e sentido" · matéria: Russo · tema: RG01 */
  SIM.ruPares = (el, F) => { const N = 6; let r = rng(1), esq = [], dir = [], selE = null, selD = null, feitos = new Set(), tent = 0, erro = null;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="novo">novas palavras</button></div></div></div><div data-v="mesa" style="display:grid;grid-template-columns:1fr 1fr;gap:8px 28px;max-width:620px;margin:10px auto"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), P = SIM.RU.PAL;
    const novo = () => { const base = emb(SIM.RU.LISTA.todas.filter((k) => P[k].cl !== "pronome"), r), pts = new Set(); esq = []; base.forEach((k) => { if (esq.length < N && !pts.has(P[k].pt)) { esq.push(k); pts.add(P[k].pt); } }); dir = emb(esq, r); selE = selD = null; feitos = new Set(); tent = 0; erro = null; desenha(); };
    const tenta = () => { if (selE === null || selD === null) return; tent++; if (esq[selE] === dir[selD]) { feitos.add(esq[selE]); erro = null; } else erro = [selE, selD]; selE = selD = null; };
    const clica = (lado, i) => { if (lado === "e") { if (feitos.has(esq[i])) return; selE = i; } else { if (feitos.has(dir[i])) return; selD = i; } erro = null; tenta(); desenha(); };
    const est = () => ({ esq: esq.slice(), dir: dir.slice(), feitos: feitos.size, tent, fim: feitos.size === N, erro });
    const carta = (lado, i, txt, k) => { const ok = feitos.has(k), sel = (lado === "e" ? selE : selD) === i, ruim = erro && erro[lado === "e" ? 0 : 1] === i; return `<button type="button" data-c="${lado}${i}" ${ok ? "disabled" : ""} style="padding:9px 10px;border-radius:9px;cursor:${ok ? "default" : "pointer"};font:600 ${lado === "e" ? 21 : 16}px Inter,system-ui,sans-serif;color:var(--ink);background:${ok ? "color-mix(in srgb,var(--ok) 18%,var(--card2))" : "var(--card2)"};border:2px solid ${ok ? "var(--ok)" : ruim ? "var(--bad, #e06666)" : sel ? "var(--mod)" : "var(--line)"};opacity:${ok ? 0.75 : 1}">${txt}</button>`; };
    const desenha = () => { q("[data-v=mesa]").innerHTML = esq.map((k, i) => carta("e", i, k, k) + carta("d", i, P[dir[i]].pt, dir[i])).join("");
      q("[data-v=mesa]").querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => clica(b.dataset.c[0], +b.dataset.c.slice(1))));
      q("[data-v=lt]").innerHTML = vis("pares certos", `${feitos.size} de ${N}`) + vis("tentativas", tent);
      q("[data-v=st]").innerHTML = feitos.size === N ? `Fechou os ${N} pares em ${tent} tentativas${tent === N ? ": sem nenhum erro" : ""}. Clique em "novas palavras".` : "Clique numa palavra russa e depois no sentido dela (ou na ordem contrária). Par certo fica verde; par errado pisca em vermelho e volta."; };
    q("[data-v=novo]").addEventListener("click", novo);
    SIM.ruPares._ult = { semente: (n) => { r = rng(n); novo(); }, clica, est }; novo(); };

  /* nome: "Leitura contra o relógio" · matéria: Russo · tema: RG01 */
  SIM.ruRelogio = (el, F) => { const DUR = 60; let r = rng(1), w = null, ops = [], t = 0, rodando = false, certos = 0, erros = 0, ult = null, timer = null, fila = [];
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-v="ini">começar (60 s)</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div><div data-v="ops" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:560px;margin:0 auto 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), P = SIM.RU.PAL, base = () => SIM.RU.LISTA.todas;
    const nova = () => { if (!fila.length) fila = emb(base(), r); w = fila.pop(); const outras = emb(base().filter((k) => P[k].pt !== P[w].pt), r).slice(0, 3); ops = emb([w, ...outras], r); };
    const para = () => { rodando = false; if (timer) clearInterval(timer); timer = null; };
    const tique = (dt) => { if (!rodando) return; t = Math.max(0, t - dt); if (t <= 0) para(); desenha(); };
    const inicia = (relogio = true) => { para(); t = DUR; certos = erros = 0; ult = null; rodando = true; fila = []; nova(); if (relogio) timer = setInterval(() => tique(0.25), 250); desenha(); };
    const responde = (i) => { if (!rodando) return; const ok = ops[i] === w; ult = { palavra: w, ok, certa: P[w].pt }; ok ? certos++ : erros++; nova(); desenha(); };
    const est = () => ({ palavra: w, ops: ops.slice(), certaI: ops.indexOf(w), t, rodando, certos, erros, ult });
    const desenha = () => { q("[data-v=pal]").innerHTML = rodando ? `<div style="${GRANDE}">${w}</div>` : `<div style="font-size:15px;color:var(--ink2)">${t <= 0 && certos + erros ? "Tempo esgotado." : "Em 60 segundos, quantas palavras você lê e reconhece?"}</div>`;
      q("[data-v=ops]").innerHTML = rodando ? ops.map((k, i) => `<button type="button" class="bt" data-o="${i}" style="padding:10px;font-size:16px">${P[k].pt}</button>`).join("") : "";
      q("[data-v=ops]").querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => responde(+b.dataset.o)));
      q("[data-v=lt]").innerHTML = vis("tempo", Math.ceil(t) + " s") + vis("certas", certos) + vis("erradas", erros);
      q("[data-v=st]").innerHTML = ult ? (ult.ok ? `Certo: ${ult.palavra} = ${ult.certa}.` : `Não: ${ult.palavra} = ${ult.certa}.`) + (rodando ? "" : ` Resultado: ${certos} certas e ${erros} erradas em 60 s. O número só serve para comparar com você mesmo, de um dia para o outro.`) : "Aparece uma palavra russa e quatro sentidos. Clique no certo, o mais rápido que conseguir ler."; };
    q("[data-v=ini]").addEventListener("click", () => inicia(true)); F.aoSair(para);
    SIM.ruRelogio._ult = { semente: (n) => { r = rng(n); }, inicia: () => inicia(false), responde, tique, est }; desenha(); };

  /* nome: "Onde cai o acento? Clique na vogal tônica" · matéria: Russo · tema: RG02 */
  SIM.ruTonica = (el, F) => { let r = rng(1), fila = [], x = null, clic = null, certos = 0, feitos = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts">${OUVIR}<button class="bt peq" data-v="prox">outra palavra</button></div>${SEMVOZ}</div></div><div class="palco" data-v="pal" style="text-align:center;padding:18px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), base = () => SIM.ruListaRed().filter((y) => !y.ac.includes("ё") && SIM.ruVogais(y.ac).length >= 2);
    const prox = () => { if (!fila.length) fila = emb(base(), r); x = fila.pop(); clic = null; desenha(); };
    const certa = () => SIM.ruVogais(x.ac).find((v) => v.ton).i;
    const clica = (i) => { if (clic !== null) return; clic = i; feitos++; if (i === certa()) certos++; desenha(); };
    const est = () => ({ ac: x.ac, plano: x.ac.split(AC).join(""), certaI: certa(), clic, certos, feitos, vogais: SIM.ruVogais(x.ac).map((v) => v.i) });
    const desenha = () => { const pl = [...x.ac.split(AC).join("")], vs = new Set(SIM.ruVogais(x.ac).map((v) => v.i)), c = certa();
      q("[data-v=pal]").innerHTML = `<div style="${GRANDE}">${pl.map((ch, i) => (vs.has(i) ? `<button type="button" data-i="${i}" style="font:inherit;letter-spacing:0;padding:0 3px;border-radius:8px;cursor:pointer;color:${clic === null ? "var(--mod)" : i === c ? "var(--ok)" : i === clic ? "var(--bad, #e06666)" : "var(--ink)"};background:transparent;border:2px dashed ${clic === null ? "var(--line)" : "transparent"}">${ch}${clic !== null && i === c ? AC : ""}</button>` : ch)).join("")}</div><div style="font-size:13px;color:var(--ink2);margin-top:8px">${x.pt}</div>`;
      q("[data-v=pal]").querySelectorAll("[data-i]").forEach((b) => b.addEventListener("click", () => clica(+b.dataset.i)));
      q("[data-v=lt]").innerHTML = vis("resultado", clic === null ? "?" : clic === c ? "certo" : "ainda não") + vis("pronúncia (AFI)", clic === null ? "?" : x.ipa) + vis("placar", `${certos} de ${feitos}`);
      q("[data-v=st]").innerHTML = clic === null ? "A palavra está sem o acento, como num texto comum. Clique na vogal que você acha que é a tônica. Não há regra que resolva: é memória de cada palavra, e é por isso que vale treinar." : `A tônica é a vogal em verde: ${x.ac} ${x.ipa}. Fonte: ${x.fonte}.`; };
    q("[data-v=prox]").addEventListener("click", prox); SIM.ruBotaoOuvir(el, () => x.ac);
    SIM.ruTonica._ult = { semente: (n) => { r = rng(n); fila = []; certos = feitos = 0; prox(); }, clica, prox, est }; prox(); };
  /* nome: "Voz russa: escolha e ajuste" · matéria: Russo · tema: RG01 */
  SIM.ruVozLab = (el, F) => { const TESTE = ["молоко́", "здра́вствуйте", "хорошо́"].filter((w) => SIM.RU.PAL[w.split(AC).join("")]);
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">voz</p><select data-v="voz" class="bt peq" style="font-size:14px;padding:5px 8px;max-width:360px"></select></div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">velocidade: <b data-v="velr"></b></p><input type="range" data-v="vel" min="0.5" max="1.2" step="0.05" style="width:180px"></div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">acento</p><div class="bts"><button class="bt peq" data-v="ac" aria-pressed="false">mandar o acento marcado para a voz</button></div></div></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">testar</p><div class="bts">${TESTE.map((w, i) => `<button class="bt peq" data-t="${i}">${w}</button>`).join("")}</div></div></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => ({ ...SIM.ruVozCfg(), vozes: SIM.ruVozes().map((v) => v.name), usada: (SIM.ruVoz() || {}).name || null });
    const desenha = () => { const c = SIM.ruVozCfg(), vs = SIM.ruVozes(), usada = SIM.ruVoz();
      q("[data-v=voz]").innerHTML = vs.length ? vs.map((v) => `<option value="${v.name.replace(/"/g, "&quot;")}" ${usada && v.name === usada.name ? "selected" : ""}>${v.name} (${v.lang})</option>`).join("") : `<option>nenhuma voz russa neste navegador</option>`;
      q("[data-v=vel]").value = String(c.vel); q("[data-v=velr]").textContent = String(c.vel).replace(".", ","); q("[data-v=ac]").setAttribute("aria-pressed", String(c.acento));
      q("[data-v=st]").innerHTML = (vs.length ? `Este navegador tem <b>${vs.length}</b> voz(es) russa(s). Se o som estiver estranho, troque de voz (as de nome "Natural", "Online" ou "Google" costumam ser melhores que a básica do sistema), reduza a velocidade e experimente ligar o acento: algumas vozes usam a marca para acertar a sílaba tônica, outras tropeçam nela. ` : "Este navegador não tem voz russa instalada. Ela se instala nas configurações de fala (texto para fala) do sistema; outra saída é abrir o site num navegador que traga voz russa própria. ") + "O site não traz gravações: o som é o da voz do seu sistema, e por isso não foi possível testá-lo daqui. A escolha fica salva neste navegador."; };
    q("[data-v=voz]").addEventListener("change", (ev) => { SIM.ruVozCfg({ nome: ev.target.value }); desenha(); }); q("[data-v=vel]").addEventListener("input", (ev) => { SIM.ruVozCfg({ vel: +ev.target.value }); desenha(); });
    q("[data-v=ac]").addEventListener("click", () => { SIM.ruVozCfg({ acento: !SIM.ruVozCfg().acento }); desenha(); }); el.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => SIM.ruFala(TESTE[+b.dataset.t])));
    try { if (window.speechSynthesis && window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener("voiceschanged", desenha); } catch (e) {}
    SIM.ruVozLab._ult = { est, desenha }; desenha(); };
})();
