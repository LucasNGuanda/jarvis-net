/* ==========================================================
   Física — motor do site: rotas, menu, progresso e componentes.
   Os temas ficam em temas/<cod>.js e chamam F.registrar(cod, def).
   ========================================================== */
(function () {
  "use strict";
  const F = (window.F = window.F || {});
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  F.$ = $; F.$$ = $$;

  /* ---------- armazenamento (sempre com try/catch) ---------- */
  const PFX = "fisica:";
  F.store = {
    get(k, d) { try { const v = localStorage.getItem(PFX + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(PFX + k, JSON.stringify(v)); } catch (e) {} },
    tudo() { const o = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(PFX)) o[k] = localStorage.getItem(k); } } catch (e) {} return o; },
  };

  /* ---------- códigos renomeados na β 2.0 (Termodinâmica B → T, Ondas e Óptica B → O, MHS B15 → A20, Experimentos na ordem do menu) ---------- */
  const RENOMEADOS = {
    B01: "T01", B02: "T02", B03: "T03", B04: "T04", B04b: "T04b", B05: "T05", B05b: "T05b", B06: "T06", B07: "T07", B08: "T08", B08b: "T08b",
    B16: "O01", B17: "O02", B18: "O03", B19: "O04", B09: "O05", B10: "O06", B11: "O07", B12: "O08", B13: "O09", B14: "O10", B14b: "O10b",
    B15: "A20", EP08: "EP03", EP03: "EP04", EP09: "EP08", EP04: "EP09",
  };
  const MODS_RENOMEADOS = { B: "T" };
  F.RENOMEADOS = RENOMEADOS;
  const VERSAO_CODIGOS = 2;
  /* recebe {chave completa: texto guardado} no formato antigo e devolve no formato novo (chamar UMA vez por conjunto de dados) */
  F.migraDados = (o) => {
    const novo = {}, cod = (c) => RENOMEADOS[c] || c;
    for (const [k, v] of Object.entries(o)) {
      let k2 = k, v2 = v;
      let m = k.match(/^(fisica:(?:marca|chefao):)([A-Z]+[0-9]+[a-z]?)(-\d+)?$/);
      if (m) k2 = m[1] + cod(m[2]) + (m[3] || "");
      else if (k === PFX + "feitos") { try { const f = JSON.parse(v), g = {}; for (const [c, t] of Object.entries(f)) g[cod(c)] = t; v2 = JSON.stringify(g); } catch (e) {} }
      else if (k === PFX + "menuAbertos") { try { v2 = JSON.stringify(JSON.parse(v).map((x) => MODS_RENOMEADOS[x] || x)); } catch (e) {} }
      novo[k2] = v2;
    }
    novo[PFX + "codigos"] = String(VERSAO_CODIGOS);
    return novo;
  };
  try {
    if (+(localStorage.getItem(PFX + "codigos") || 1) < VERSAO_CODIGOS) {
      const velho = F.store.tudo(), novo = F.migraDados(velho);
      Object.keys(velho).forEach((k) => localStorage.removeItem(k));
      Object.entries(novo).forEach(([k, v]) => localStorage.setItem(k, v));
    }
  } catch (e) {}

  /* ---------- números em português ---------- */
  // F.t(9.1234, 2) -> "9,12" (texto)   F.m(...) -> "9{,}12" (dentro de $...$)
  F.t = (v, d = 2) => { if (!isFinite(v)) return "—"; let s = (+v).toFixed(d); if (/^-0[.,]?0*$/.test(s)) s = s.slice(1); return s.replace("-", "−").replace(".", ","); };
  F.m = (v, d = 2) => F.t(v, d).replace(",", "{,}").replace("−", "-");
  /* número "limpo" para LaTeX: tira zeros à direita (2,50 → 2,5; 3,00 → 3) */
  F.n = (v, d = 4) => { const r = +(+v).toFixed(d); const casas = (String(r).split(".")[1] || "").length; return F.m(r, Math.min(d, casas)); };
  /* coeficiente na frente de uma letra: 1 → "", −1 → "-", resto → número limpo */
  F.c = (c, d = 4) => (c === 1 ? "" : c === -1 ? "-" : F.n(c, d));
  // algarismos significativos, com notação científica quando precisa: F.sig(0.000123,2) -> "1,2 × 10⁻⁴" (texto)
  F.sigM = (v, n = 3) => {
    if (v === 0) return "0";
    let e = Math.floor(Math.log10(Math.abs(v)));
    if (Math.abs(+(v / Math.pow(10, e)).toFixed(n - 1)) >= 10) e++; /* 9,996 × 10⁶ arredonda para 1,00 × 10⁷, não para 10,0 × 10⁶ */
    if (e >= -2 && e <= 4) return F.m(v, Math.max(0, n - 1 - e));
    const mant = v / Math.pow(10, e);
    return F.m(mant, n - 1) + "\\times 10^{" + e + "}";
  };
  /* igual ao sigM, mas sem zeros à direita na mantissa: 3,0 × 10⁻⁵ → 3 × 10⁻⁵, 0,010 → 0,01 */
  F.sigL = (v, n = 3) => F.sigM(v, n).replace(/(\{,\}\d*?)0+(?=\\times|$)/, "$1").replace(/\{,\}(?=\\times|$)/, "");
  /* notação científica para texto (fora do KaTeX): F.cient(64168764, 2) -> "6,42 × 10⁷" */
  F.cient = (v, d = 2) => {
    if (!isFinite(v)) return "—";
    if (v === 0) return "0";
    let e = Math.floor(Math.log10(Math.abs(v))), mant = +(v / Math.pow(10, e)).toFixed(d);
    if (Math.abs(mant) >= 10) { mant /= 10; e++; }
    if (e >= -2 && e <= 3) return F.t(v, Math.max(0, d - e));
    const sup = String(e).replace("-", "⁻").replace(/[0-9]/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]);
    return F.t(mant, d) + " × 10" + sup;
  };
  F.sorteio = (a, b, passo = 1) => { const n = Math.round((b - a) / passo); return +(a + passo * Math.floor(Math.random() * (n + 1))).toFixed(6); };
  F.escolha = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ---------- KaTeX ---------- */
  F.math = (el) => {
    if (!window.renderMathInElement) return;
    renderMathInElement(el, {
      delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
      throwOnError: false, macros: { "\\gf": "\\mathord{\\htmlClass{gf}{\\kern0.6em}}" }, trust: (c) => c.command === "\\htmlClass", ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "svg"],
    });
    /* fórmulas ficam fora do tradutor automático do navegador */
    el.querySelectorAll(".katex").forEach((x) => { x.setAttribute("translate", "no"); x.classList.add("notranslate"); });
  };

  /* ---------- fila de montagem dos componentes ---------- */
  let fila = [], uid = 0;
  F.id = (p = "c") => p + "-" + (++uid);
  F.depois = (fn) => fila.push(fn);
  F.gf = (cls = "") => `<span class="gf ${cls}" role="img" aria-label="gam fresco"></span>`;
  /* glifo do gam fresco dentro de SVG: canto superior esquerdo em (x, y), altura h */
  F.gfSvg = (x, y, h, cor = "currentColor") => `<g transform="translate(${x},${y}) scale(${h / 60})" style="fill:none;stroke:${cor};stroke-width:3.8;stroke-linecap:round;stroke-linejoin:round"><path d="M5 17 C9 14 13 16 16.5 22"/><path d="M16.5 22 L32 8"/><path d="M28.5 4.5 L35 11"/><path d="M16.5 22 C16.5 32 14.5 40 14.5 47 C14.5 55 20 57 24 51"/></g>`;

  /* ---------- ícones (traço, cor do texto; no lugar dos emojis, que mudam de cara em cada sistema) ---------- */
  const ICONES = {
    fisico: '<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)"/>',
    pegadinha: '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.3" r=".6" fill="currentColor"/>',
    olimpiada: '<path d="M8 2.5h8l-2.2 6.2h-3.6z"/><circle cx="12" cy="15" r="6"/><path d="m12 12 1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z"/>',
    ponte: '<path d="M2 17h20M4 17v-4M20 17v-4M2 13h20"/><path d="M4 13c2-5 14-5 16 0"/><path d="M8 13V10.3M12 13V9.4M16 13v-2.7"/>',
    ideia: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    caveira: '<path d="M12 2.8c-4.6 0-7.8 3.2-7.8 7.6 0 2.6 1.2 4.4 3 5.4V19h9.6v-3.2c1.8-1 3-2.8 3-5.4 0-4.4-3.2-7.6-7.8-7.6z"/><circle cx="9" cy="11" r="1.8" fill="currentColor"/><circle cx="15" cy="11" r="1.8" fill="currentColor"/><path d="M12 13.6 11 15.6h2zM9.8 19v2.2M12 19v2.2M14.2 19v2.2"/>',
    cadeado: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.2" fill="currentColor"/>',
    alvo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    dado: '<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
    baixar: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    subir: '<path d="M12 20V9M7 13.5l5-5 5 5M5 4h14"/>',
    seta: '<path d="M5 12h13M13 7l5 5-5 5"/>',
    livro: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  };
  F.ic = (nome, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nome] || ""}</svg>`;

  /* ---------- blocos de HTML ---------- */
  F.secao = (id, titulo, html, n) => `<section class="secao" id="${id}"><h2>${n ? `<span class="n">${n}</span>` : ""}${titulo}</h2>${html}</section>`;
  F.formula = (tex, rot) => `<div class="formula">${rot ? `<div class="rot">${rot}</div>` : ""}$$${tex}$$</div>`;
  const CX = { fisico: "Pense como físico", pegadinha: "Pegadinha", olimpiada: "Nível olimpíada", ponte: "Ponte para a universidade", ideia: "Ideia", demo: "" };
  F.CX = CX;
  F.caixa = (tipo, html, titulo) => `<div class="caixa ${tipo}"><div class="cab">${ICONES[tipo] ? F.ic(tipo) : ""}${titulo || CX[tipo]}</div>${html}</div>`;
  F.demo = (titulo, html) => `<div class="caixa demo"><div class="cab">${titulo ? "&nbsp;· " + titulo : ""}</div>${html}<span class="qed">∎</span><div style="clear:both"></div></div>`;
  F.fig = (svg, leg) => `<figure class="fig" style="margin:14px 0">${svg}${leg ? `<figcaption>${leg}</figcaption>` : ""}</figure>`;
  F.ret = (cod) => { const t = F.achar(cod), ok = t && t.pronto; return `<a class="selo ret${ok ? "" : " breve"}" href="#/${cod}" title="retoma ${t ? t.nome : cod}${ok ? "" : " (em breve: ainda não escrito)"}">[${cod}]←</a>`; };
  F.selos = (arr = []) => arr.map((m) => `<span class="selo" title="${LEG[m] || ""}">${m}</span>`).join("");
  const LEG = { "★": "cai muito em OBF/ITA", "!": "difícil", "!!": "muito difícil", "?": "confuso, não bobear", "∫": "exige cálculo", ITA: "cobrado no ITA", IME: "cobrado no IME", MIT: "MIT Integration Bee", USP: "prova da USP", RU: "aparece em olimpíada russa" };
  F.LEG = LEG;

  /* chuta antes de ver */
  F.chute = (cfg) => {
    const id = F.id("chute");
    F.depois(() => {
      const el = document.getElementById(id);
      $$(".op", el).forEach((b) => b.addEventListener("click", () => {
        if (el.classList.contains("feito")) return;
        el.classList.add("feito");
        $$(".op", el).forEach((o) => { const i = +o.dataset.i; if (i === cfg.certa) o.classList.add("certa"); else if (o === b) o.classList.add("errada"); o.disabled = true; });
        if (cfg.aoResponder) cfg.aoResponder(+b.dataset.i);
      }));
    });
    return `<div class="chute" id="${id}"><div class="q">${F.ic("alvo")} Chuta antes de ver: ${cfg.q}</div><div class="ops">${cfg.ops.map((o, i) => `<button class="bt op" data-i="${i}">${String.fromCharCode(65 + i)}) ${o}</button>`).join("")}</div><div class="exp">${cfg.exp}</div></div>`;
  };

  /* exemplo passo a passo: casos = [{nome, gerar(): {enun, fig, passos:[html]}}] */
  F.exemplo = (cfg) => {
    const id = F.id("exemplo");
    F.depois(() => {
      const el = document.getElementById(id);
      let caso = 0, dados = null, mostrados = 0;
      const enun = $(".enun", el), figEl = $(".efig", el), passosEl = $(".passos", el);
      const bProx = $("[data-a=prox]", el), bTudo = $("[data-a=tudo]", el), bPar = $("[data-a=par]", el);
      function novo(primeiro) {
        const c = cfg.casos[caso];
        dados = c.gerar(primeiro);
        mostrados = 0;
        enun.innerHTML = dados.enun;
        figEl.innerHTML = dados.fig || "";
        passosEl.innerHTML = "";
        F.math(enun);
        atual();
      }
      function atual() {
        bProx.disabled = bTudo.disabled = mostrados >= dados.passos.length;
        bProx.textContent = mostrados === 0 ? "Começar" : "Próximo passo";
      }
      function mostra() {
        const div = document.createElement("div");
        div.className = "passo";
        const ult = mostrados === dados.passos.length - 1;
        div.innerHTML = `<div class="np">${ult ? "Resultado" : "Passo " + (mostrados + 1)}</div>${dados.passos[mostrados]}`;
        passosEl.appendChild(div);
        F.math(div);
        mostrados++;
        atual();
      }
      bProx.addEventListener("click", mostra);
      bTudo.addEventListener("click", () => { while (mostrados < dados.passos.length) mostra(); });
      bPar.addEventListener("click", () => novo(false));
      $$(".escolha .bt", el).forEach((b) => b.addEventListener("click", () => {
        caso = +b.dataset.i;
        $$(".escolha .bt", el).forEach((x) => x.setAttribute("aria-pressed", x === b));
        novo(true);
      }));
      novo(true);
    });
    return `<div class="cartao exemplo" id="${id}">
      <div class="tit"><span class="tag">Exemplário</span>${cfg.titulo || "Exemplos passo a passo"}</div>
      <div class="bts escolha">${cfg.casos.map((c, i) => `<button class="bt peq" data-i="${i}" aria-pressed="${i === 0}">${c.nome}</button>`).join("")}</div>
      <div class="enun"></div><div class="efig fig"></div><div class="passos"></div>
      <div class="bts" style="margin-top:12px"><button class="bt pri" data-a="prox">Começar</button><button class="bt" data-a="tudo">Mostrar tudo</button><button class="bt" data-a="par">${F.ic("dado")} Me dá um parecido</button></div>
    </div>`;
  };

  /* dicas e resposta: uma linha de botões; cada um abre o seu painel embaixo (independentes, todos fechados no começo) */
  F.revela = (itens) => {
    const id = F.id("rev");
    return `<div class="revela" id="${id}"><div class="rev-bts">${itens.map((it, i) => `<button class="rev-bt${it.resp ? " resp" : ""}" type="button" aria-expanded="false" aria-controls="${id}-${i}">${it.rot}</button>`).join("")}</div>${itens.map((it, i) => `<div class="rev-painel${it.resp ? " resp" : ""}" id="${id}-${i}" hidden><div class="rev-tit">${it.rot}</div>${it.html}</div>`).join("")}</div>`;
  };
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest(".rev-bt"); if (!b) return;
    const painel = document.getElementById(b.getAttribute("aria-controls")); if (!painel) return;
    const abre = painel.hidden; painel.hidden = !abre; b.setAttribute("aria-expanded", abre);
  });

  /* exercício estático: {n, nivel, marcas, enun, fig, alts?, dicas:[..], resp, sol}
     Correção automática (opcional, β 3.1): certa: "B" (com alts) deixa as alternativas clicáveis;
     num: {v, tol?, un?} mostra um campo para a resposta numérica (tol = tolerância relativa, padrão 2%).
     A primeira tentativa fica em resultado:COD-n = {r: "certo"|"errado", dada} (mapa de erros, docs/MODELO_DE_DADOS.md §6).
     nivel: "Físico" ou "Máximo" (selo no cabeçalho). */
  let temaAtual = null, exercicios = [];
  const lerNumero = (s) => { s = String(s).trim().replace(/\s/g, "").replace(/−/g, "-").replace(/[×·]10\^?/g, "e"); if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, ""); s = s.replace(",", "."); const v = Number(s); return s !== "" && isFinite(v) ? v : NaN; };
  F.lerNumero = lerNumero;
  const fmtNum = (v) => String(+(+v).toPrecision(4)).replace(".", ",").replace("-", "−");
  F.exercicio = (e) => {
    const chave = `marca:${temaAtual}-${e.n}`, chaveRes = `resultado:${temaAtual}-${e.n}`, auto = !!(e.certa || e.num);
    exercicios.push(chave);
    const id = F.id("ex");
    F.depois(() => {
      const el = document.getElementById(id);
      const bs = $$(".certeza button", el);
      const pinta = () => { const v = F.store.get(chave, ""); bs.forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === v)); };
      bs.forEach((b) => b.addEventListener("click", () => { const v = F.store.get(chave, ""); F.store.set(chave, v === b.dataset.m ? "" : b.dataset.m); pinta(); F.evento("marca"); }));
      pinta();
      if (!auto) return;
      const fb = $(".ex-fb", el);
      const registra = (certo, dada) => { if (!F.store.get(chaveRes, null)) F.store.set(chaveRes, { r: certo ? "certo" : "errado", dada }); F.evento("resultado"); };
      const avisa = (certo, txt) => { fb.className = "ex-fb " + (certo ? "certo" : "errado"); fb.innerHTML = txt; };
      const ant = F.store.get(chaveRes, null);
      if (ant) $(".ex-prim", el).textContent = `Primeira tentativa: ${ant.dada} (${ant.r}).`;
      if (e.certa) $$(".alt", el).forEach((b) => b.addEventListener("click", () => {
        const certo = b.dataset.l === e.certa;
        $$(".alt", el).forEach((x) => x.classList.remove("certa", "errada"));
        b.classList.add(certo ? "certa" : "errada");
        avisa(certo, certo ? "Certo!" : "Ainda não. Tente de novo ou abra uma dica.");
        registra(certo, b.dataset.l);
      }));
      if (e.num) {
        const inp = $(".ex-num input", el), confere = () => {
          const v = lerNumero(inp.value); if (isNaN(v)) { avisa(false, "Escreva só o número (vírgula ou ponto; 3,2e5 para 3,2 × 10⁵)."); return; }
          const tol = e.num.tol ?? 0.02, alvo = e.num.v, certo = alvo === 0 ? Math.abs(v) <= (e.num.abs ?? 1e-9) : Math.abs(v - alvo) <= tol * Math.abs(alvo);
          avisa(certo, certo ? "Certo!" : "Ainda não. Confira a conta e as unidades, ou abra uma dica.");
          registra(certo, fmtNum(v));
        };
        $(".ex-num button", el).addEventListener("click", confere);
        inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); confere(); } });
      }
    });
    const alts = e.alts ? (e.certa
      ? `<ol class="alts clicaveis">${e.alts.map((a, i) => `<li><button type="button" class="alt" data-l="${String.fromCharCode(65 + i)}"><b>${String.fromCharCode(65 + i)})</b><span>${a}</span></button></li>`).join("")}</ol>`
      : `<ol class="alts">${e.alts.map((a, i) => `<li><b>${String.fromCharCode(65 + i)})</b>${a}</li>`).join("")}</ol>`) : "";
    const campo = e.num ? `<div class="ex-num"><label>sua resposta <input type="text" inputmode="decimal" autocomplete="off" aria-label="sua resposta numérica"></label>${e.num.un ? `<span class="un">${e.num.un}</span>` : ""}<button type="button" class="bt peq">Conferir</button></div>` : "";
    const correcao = auto ? `${campo}<div class="ex-fb" aria-live="polite"></div><div class="ex-prim"></div>` : "";
    const rev = F.revela([...(e.dicas || []).map((d, i) => ({ rot: `Dica ${i + 1}`, html: d })), { rot: "Resposta e resolução", html: `<p><b>Resposta:</b> ${e.resp}</p>${e.sol}`, resp: true }]);
    return `<div class="ex" id="${id}">
      <div class="ex-cab"><span class="num">${temaAtual}.${String(e.n).padStart(2, "0")}</span>${e.nivel ? `<span class="nivel ${e.nivel === "Máximo" ? "max" : "fis"}">${e.nivel}</span>` : ""}<span class="marcas">${F.selos(e.marcas)}</span>
        <span class="certeza" title="● certeza · X dúvida · / chutei">sua marcação <button data-m="●">●</button><button data-m="X">X</button><button data-m="/">/</button></span></div>
      <div>${e.enun}</div>${e.fig ? F.fig(e.fig) : ""}${alts}${correcao}
      ${rev}
    </div>`;
  };

  /* chefão Impossível 99: destrava quando todos os exercícios têm marcação ● X / */
  F.chefao = (c) => {
    const id = F.id("chefao");
    F.depois(() => {
      const el = document.getElementById(id);
      const chave = `chefao:${temaAtual}`;
      const confere = () => {
        const feitos = exercicios.filter((k) => F.store.get(k, "")).length;
        const livre = F.store.get(chave, false) || feitos >= exercicios.length;
        el.classList.toggle("trancado", !livre);
        $(".falta", el).textContent = `${feitos} de ${exercicios.length} exercícios marcados`;
      };
      $("[data-a=forca]", el).addEventListener("click", () => { F.store.set(chave, true); confere(); });
      F.ouvir("marca", confere);
      confere();
    });
    return `<div class="chefao trancado" id="${id}">
      <div class="cab"><span class="cv">${F.ic("caveira")}</span><div><small>Chefão · Impossível 99</small><h3>${c.titulo}</h3></div></div>
      <div class="tranca"><p>${F.ic("cadeado")} Trancado. Ele destrava quando você marcar ● X ou / em todos os exercícios do tema (<span class="falta"></span>).</p>
        <button class="bt peq" data-a="forca">Já fiz os exercícios no caderno: destravar</button></div>
      <div class="conteudo">${c.enun}${c.fig ? F.fig(c.fig) : ""}
        ${F.revela([...c.dicas.map((d, i) => ({ rot: `Dica ${i + 1}`, html: d })), { rot: "Solução completa (tem certeza?)", html: c.sol, resp: true }])}
      </div></div>`;
  };

  /* laboratório: moldura padrão */
  F.lab = (titulo, corpoId) => `<div class="lab" id="${corpoId}"><div class="lab-cab"><span class="tag">Laboratório</span><b>${titulo}</b></div></div>`;

  /* eventos simples */
  const ouvintes = {};
  F.ouvir = (n, fn) => (ouvintes[n] = ouvintes[n] || []).push(fn);
  F.evento = (n) => (ouvintes[n] || []).forEach((fn) => fn());

  /* ---------- catálogo ---------- */
  F.achar = (cod) => { for (const m of CATALOGO) for (const t of m.temas) if (t[0] === cod) return { cod, nome: t[1], marcas: t[2] || [], pronto: !!t[3], mod: m }; return null; };
  const areaDe = (m) => m.area || "fisica";
  const AREA = (id) => AREAS.find((a) => a.id === id) || AREAS[0];
  F.area = "fisica";
  const feitos = () => F.store.get("feitos", {});

  /* ---------- menu ---------- */
  function montaMenu() {
    const menu = $("#menu-mods");
    const abertos = F.store.get("menuAbertos", ["C"]);
    menu.innerHTML = CATALOGO.map((m) => `<div class="mod ${abertos.includes(m.id) ? "aberto" : ""} ${m.temas.some((t) => t[3]) ? "" : "vazio"}" data-mod="${m.id}" data-area="${areaDe(m)}" style="--c:var(${m.cor})">
      <button aria-expanded="${abertos.includes(m.id)}" class="${m.temas.some((t) => t[3]) ? "" : "vazio"}"><span class="letra">${m.letra}</span><span class="nome">${m.nome}</span>${(() => { const k = m.temas.filter((t) => t[3]).length; return `<span class="conta" title="${k} de ${m.temas.length} temas escritos${k ? "" : " (em breve)"}">${k}/${m.temas.length}</span>`; })()}<span class="seta">›</span></button>
      <ul>${m.temas.map((t) => `<li><a href="#/${t[0]}" data-cod="${t[0]}" class="${t[3] ? "" : "breve"}" ${t[3] ? "" : 'title="Ainda não escrito" aria-disabled="true"'}><span class="cod">${t[0]}</span><span class="nome">${t[1]}</span>${t[3] ? '<span class="bola"></span>' : '<span class="breve-tag">em breve</span>'}</a></li>`).join("")}</ul></div>`).join("");
        $$(".mod>button", menu).forEach((b) => b.addEventListener("click", () => {
      const m = b.parentElement; m.classList.toggle("aberto"); b.setAttribute("aria-expanded", m.classList.contains("aberto"));
      F.store.set("menuAbertos", $$(".mod.aberto", menu).map((x) => x.dataset.mod));
    }));
    const filtro = $("#bt-breve"), pintaFiltro = () => { const v = F.store.get("mostrarBreve", false); document.body.classList.toggle("mostra-breve", v); filtro.setAttribute("aria-pressed", v); filtro.textContent = v ? "Esconder temas em breve" : "Mostrar temas em breve"; };
    filtro.addEventListener("click", () => { F.store.set("mostrarBreve", !F.store.get("mostrarBreve", false)); pintaFiltro(); });
    pintaFiltro();
    $("#busca").addEventListener("input", (ev) => {
      const q = ev.target.value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      menu.classList.toggle("buscando", !!q); /* buscando: mostra também os temas em breve */
      if (!q) { const ab = F.store.get("menuAbertos", ["C"]); $$(".mod", menu).forEach((m) => { m.classList.toggle("aberto", ab.includes(m.dataset.mod)); m.style.display = ""; m.querySelectorAll("li").forEach((li) => (li.style.display = "")); }); return; } /* busca vazia: o menu volta como estava */
      $$(".mod", menu).forEach((m) => {
        let algum = false;
        $$("li", m).forEach((li) => { const s = li.textContent.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); const ok = !q || s.includes(q); li.style.display = ok ? "" : "none"; algum = algum || ok; });
        m.style.display = algum ? "" : "none";
        if (q && algum) m.classList.add("aberto");
      });
    });
    pintaMenu();
  }
  function pintaMenu() {
    const f = feitos();
    $$("#menu-mods .mod").forEach((m) => m.classList.toggle("outra-area", m.dataset.area !== F.area));
    $$(".topo .aba").forEach((a) => a.classList.toggle("atual", a.dataset.area === F.area));
    const ar = AREA(F.area);
    $(".topo nav.links a").setAttribute("href", "#/" + ar.inicio);
    $$("#menu-mods a[data-cod]").forEach((a) => {
      const bola = a.querySelector(".bola"); if (bola) bola.classList.toggle("feito", !!f[a.dataset.cod]);
      a.classList.toggle("atual", a.dataset.cod === temaAtual);
    });
  }

  /* ---------- páginas fixas ---------- */
  function pgInicio(el, areaId) {
    const f = feitos(), ar = AREA(areaId);
    const mods = CATALOGO.filter((m) => areaDe(m) === areaId);
    let total = 0, prontos = 0, nfeitos = 0;
    mods.forEach((m) => m.temas.forEach((t) => { total++; if (t[3]) prontos++; if (f[t[0]]) nfeitos++; }));
    const anim = F.id("anim");
    const ult = F.store.get("ultimo:" + areaId, null), ui = ult && F.achar(ult.cod);
    const continuar = ui && ui.pronto ? `<a class="continuar" href="#/${ui.cod}${ult.secao ? "/" + ult.secao : ""}" style="--c:var(${ui.mod.cor})"><span class="letra">${ui.mod.letra}</span><span><small>Continuar de onde parei</small><b>${ui.cod} · ${ui.nome}</b></span>${F.ic("seta")}</a>` : "";
    el.innerHTML = `<div class="hero2"><div><h1>${ar.titulo}</h1>${continuar}</div><div class="anim" id="${anim}"></div></div>
      <div class="cartao"><div class="tit"><span class="tag">Progresso</span>${nfeitos} de ${total} temas feitos · ${prontos} já escritos</div>
        <div class="barra" style="--c:var(--ok)"><i style="width:${total ? (100 * nfeitos) / total : 0}%"></i></div></div>
      <h2 style="margin-top:32px">Módulos</h2>
      <div class="mods">${mods.map((m) => { const n = m.temas.length, k = m.temas.filter((t) => f[t[0]]).length; const prim = m.temas.find((t) => t[3]) || m.temas[0];
        const esc = m.temas.filter((t) => t[3]).length;
        return `<a class="modc ${esc ? "" : "breve"}" href="#/${prim[0]}" style="--c:var(${m.cor})"><div class="letra">${m.letra}</div><h3>${m.nome}</h3><p>${m.desc}</p><div class="barra"><i style="width:${(100 * k) / n}%"></i></div><p style="margin-top:6px">${esc ? `${k}/${n} feitos · ${esc} ${esc === 1 ? "escrito" : "escritos"}` : "em breve"}</p></a>`; }).join("")}</div>
      <h2 style="margin-top:36px">Como usar</h2>
      <div class="grade2" style="margin-top:12px">
        <div class="cartao"><b>Ordem de um tema</b><ol style="margin:8px 0 0;padding-left:1.2em;color:var(--ink2)"><li>Pergunta de abertura</li><li>Laboratório (chute antes de mexer)</li><li>A ideia, com números</li><li>Teoria completa e demonstrações</li><li>Exemplos passo a passo</li><li>Resumo, exercícios e chefão</li></ol></div>
        <div class="cartao"><b>Marcação de certeza</b><p style="color:var(--ink2);margin:8px 0 0">Em cada exercício marque <b>●</b> certeza, <b>X</b> dúvida ou <b>/</b> chutei. Fica salvo neste navegador. O chefão destrava quando todos estiverem marcados. Dicas e respostas só abrem se você clicar.</p></div>
      </div>`;
    ({ calculo: animCalculo, exp: animPendulo, lab: animCalculadora }[areaId] || animAtomo)(document.getElementById(anim));
  }

  /* átomo girando: 3 órbitas com elétrons (com rastro); o conjunto precessa devagar */
  function animAtomo(el) {
    const NS = "http://www.w3.org/2000/svg";
    el.innerHTML = `<svg viewBox="-170 -150 340 300" aria-label="átomo animado"><defs><radialGradient id="nuc"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><g class="orb"></g><g class="nucleo"></g><g class="ele"></g></svg>`;
    const cores = ["var(--mC)", "var(--mA)", "var(--mU)"], RX = 150, RY = 52;
    const nuc = [[0, 0, "var(--mM)"], [9, 4, "var(--mA)"], [-8, 6, "var(--mM)"], [3, -9, "var(--mA)"], [-5, -6, "var(--mM)"], [7, -4, "var(--mA)"], [-2, 9, "var(--mA)"]];
    el.querySelector(".nucleo").innerHTML = `<circle r="34" fill="url(#nuc)" opacity=".18"/>` + nuc.map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7.5" style="fill:${c};stroke:var(--bg);stroke-width:1.5"/>`).join("");
    const ele = el.querySelector(".ele"), orb = el.querySelector(".orb");
    const bolas = cores.map((c) => [0, 1, 2, 3].map((k) => { const b = document.createElementNS(NS, "circle"); b.setAttribute("r", k ? 6 - 1.3 * k : 6.5); b.setAttribute("opacity", k ? 0.5 - 0.12 * k : 1); b.style.fill = c; ele.appendChild(b); return b; }));
    const vel = [1.0, 1.35, 0.8], fase0 = [0, 2.1, 4.2];
    let vivo = true;
    const t0 = performance.now();
    const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function q(t) {
      if (!vivo) return;
      const s = reduz ? 1.2 : (t - t0) / 1000, prec = 0.15 * s;
      orb.innerHTML = cores.map((c, j) => `<ellipse rx="${RX}" ry="${RY}" transform="rotate(${(j * 60 + (prec * 180) / Math.PI).toFixed(2)})" style="fill:none;stroke:${c};stroke-width:2;opacity:.75"/>`).join("");
      cores.forEach((c, j) => {
        const ang = (j * Math.PI) / 3 + prec, ca = Math.cos(ang), sa = Math.sin(ang);
        bolas[j].forEach((b, k) => {
          const u = fase0[j] + vel[j] * 2 * s - 0.13 * k, x = RX * Math.cos(u), y = RY * Math.sin(u);
          b.setAttribute("cx", (x * ca - y * sa).toFixed(1)); b.setAttribute("cy", (x * sa + y * ca).toFixed(1));
        });
      });
      if (!reduz) requestAnimationFrame(q);
    }
    requestAnimationFrame(q);
    F.aoSair(() => (vivo = false));
  }

  /* física experimental: uma calculadorazinha com as teclas sendo apertadas e o resultado saindo no visor */
  function animCalculadora(el) {
    const TECLAS = [["√", "x²", "π", "AC"], ["7", "8", "9", "÷"], ["4", "5", "6", "×"], ["1", "2", "3", "−"], ["0", ".", "=", "+"]];
    const CONTAS = [
      { leg: "g = 4π²ℓ/T² (pêndulo: ℓ = 0,750 m, T = 1,776 s)", seq: ["4", "π", "x²", "×", "0", ".", "7", "5", "÷", "1", ".", "7", "7", "6", "x²", "="], res: "9.387178522" },
      { leg: "incerteza combinada: √(0,02² + 0,03²)", seq: ["√", "0", ".", "0", "2", "x²", "+", "0", ".", "0", "3", "x²", "="], res: "0.036055512" },
    ];
    const W = 220, H = 300, x0 = 60, kw = 44, kh = 28, gx = 8, gy = 7, ky0 = 106;
    let svg = `<svg viewBox="0 0 340 300" aria-label="calculadora fazendo uma conta"><rect x="${x0 - 14}" y="6" width="${W + 28 - 20}" height="${H - 12}" rx="18" style="fill:#1b212c;stroke:#39424f"/>
      <rect x="${x0}" y="22" width="${W - 20}" height="70" rx="6" style="fill:#c9d3c3;stroke:#10141b;stroke-width:3"/>
      <text class="c-exp" x="${x0 + 8}" y="46" style="font:600 13px var(--f-text);fill:#1d241b"></text>
      <text class="c-res" x="${x0 + W - 28}" y="80" text-anchor="end" style="font:700 19px var(--f-text);fill:#1d241b"></text>`;
    TECLAS.forEach((linha, i) => linha.forEach((t, j) => {
      const x = x0 + j * (kw + gx), y = ky0 + i * (kh + gy), num = /[0-9.]/.test(t);
      svg += `<g class="c-k" data-t="${t}"><rect x="${x}" y="${y}" width="${kw}" height="${kh}" rx="6" style="fill:${num ? "#3b4455" : t === "=" ? "#4c5a72" : t === "AC" ? "#3d6fd6" : "#2e3644"}"/><text x="${x + kw / 2}" y="${y + kh / 2 + 5}" text-anchor="middle" style="font:600 14px var(--f-text);fill:#e8ecf3;pointer-events:none">${t}</text></g>`;
    }));
    svg += `</svg><div class="calc-leg"></div>`;
    el.innerHTML = svg;
    const exp = el.querySelector(".c-exp"), res = el.querySelector(".c-res"), leg = el.querySelector(".calc-leg");
    const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let vivo = true, timers = [];
    const depois = (ms, fn) => timers.push(setTimeout(() => vivo && fn(), ms));
    const mostra = (s) => { exp.textContent = s.length > 21 ? "…" + s.slice(-20) : s; };
    function roda(k) {
      const c = CONTAS[k % CONTAS.length]; let texto = "";
      leg.textContent = c.leg; res.textContent = ""; mostra("");
      if (reduz) { mostra(c.seq.slice(0, -1).map((t) => (t === "√" ? "√(" : t === "x²" ? "²" : t)).join("")); res.textContent = c.res; return; }
      c.seq.forEach((t, i) => depois(400 + i * 330, () => {
        const g = el.querySelector(`.c-k[data-t="${t}"] rect`); if (g) { const cor = g.style.fill; g.style.fill = "#e3b04a"; depois(170, () => (g.style.fill = cor)); }
        if (t === "=") res.textContent = c.res; else { texto += t === "√" ? "√(" : t === "x²" ? "²" : t; mostra(texto); }
      }));
      depois(400 + c.seq.length * 330 + 2600, () => { const ac = el.querySelector('.c-k[data-t="AC"] rect'); if (ac) { ac.style.fill = "#e3b04a"; depois(170, () => (ac.style.fill = "#3d6fd6")); } depois(350, () => roda(k + 1)); });
    }
    roda(0);
    F.aoSair(() => { vivo = false; timers.forEach(clearTimeout); });
  }

  /* experimentos: pêndulo duplo (pequeno, só enfeite) com rastro */
  function animPendulo(el) {
    el.innerHTML = `<svg viewBox="-225 -225 450 450" aria-label="pêndulo duplo animado"><g class="r"></g><g class="p"></g></svg>`;
    let s = [2.2, 2.6, 0, 0], vivo = true, tr = []; const L = 1, g = 9.8;
    const f = ([a1, a2, w1, w2]) => { const d = a1 - a2, den = 3 - Math.cos(2 * d); return [w1, w2, (-g * 3 * Math.sin(a1) - g * Math.sin(a1 - 2 * a2) - 2 * Math.sin(d) * (w2 * w2 + w1 * w1 * Math.cos(d))) / den, (2 * Math.sin(d) * (2 * w1 * w1 + 2 * g * Math.cos(a1) + w2 * w2 * Math.cos(d))) / den]; };
    const rk = (st, h) => { const k1 = f(st), k2 = f(st.map((v, i) => v + (h / 2) * k1[i])), k3 = f(st.map((v, i) => v + (h / 2) * k2[i])), k4 = f(st.map((v, i) => v + h * k3[i])); return st.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); };
    let t0 = performance.now(); const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function q(t) {
      if (!vivo) return; const dt = Math.min(0.03, (t - t0) / 1000); t0 = t; if (!reduz) for (let k = 0; k < 20; k++) s = rk(s, dt / 20);
      const e = 105, x1 = e * Math.sin(s[0]), y1 = e * Math.cos(s[0]), x2 = x1 + e * Math.sin(s[1]), y2 = y1 + e * Math.cos(s[1]);
      tr.push([x2, y2]); if (tr.length > 220) tr.shift();
      el.querySelector(".r").innerHTML = tr.map((p, i) => (i ? `<line x1="${tr[i - 1][0].toFixed(1)}" y1="${tr[i - 1][1].toFixed(1)}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" style="stroke:var(--warn);stroke-width:1.6;opacity:${(i / tr.length).toFixed(2)}"/>` : "")).join("");
      el.querySelector(".p").innerHTML = `<line x1="-40" y1="0" x2="40" y2="0" style="stroke:var(--ink3);stroke-width:3"/><path d="M0 0 L${x1} ${y1} L${x2} ${y2}" style="stroke:var(--ink);stroke-width:2.2;fill:none"/><circle cx="${x1}" cy="${y1}" r="10" style="fill:var(--mA)"/><circle cx="${x2}" cy="${y2}" r="10" style="fill:var(--mU)"/>`;
      if (!reduz) requestAnimationFrame(q);
    }
    requestAnimationFrame(q); F.aoSair(() => (vivo = false));
  }

  /* cálculo: somas de Riemann (pela esquerda) convergindo para a integral, com o erro + reta tangente passeando pela curva */
  function animCalculo(el) {
    el.innerHTML = `<svg viewBox="0 0 340 280" aria-label="somas de Riemann e reta tangente"><g class="g"></g></svg><div class="calc-leg"></div>`;
    const f = (x) => 1.1 + 0.8 * Math.sin(1.25 * x) + 0.22 * x, df = (x) => 1.0 * Math.cos(1.25 * x) + 0.22;
    const a = 0.2, b = 4.6, x0 = 26, y0 = 250, sx = (x) => x0 + (x / 4.8) * 300, sy = (y) => y0 - (y / 2.9) * 225;
    let I = 0; const NN = 2000;
    for (let k = 0; k < NN; k++) { const x = a + ((k + 0.5) * (b - a)) / NN; I += f(x) * ((b - a) / NN); }
    let curva = "";
    for (let k = 0; k <= 160; k++) { const x = (4.8 * k) / 160; curva += (k ? "L" : "M") + sx(x).toFixed(1) + " " + sy(f(x)).toFixed(1); }
    const ns = [2, 4, 8, 16, 32, 64, 128];
    const g = el.querySelector(".g"), leg = el.querySelector(".calc-leg");
    let vivo = true;
    const t0 = performance.now();
    const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function q(t) {
      if (!vivo) return;
      const s = reduz ? 5 : (t - t0) / 1000;
      const ciclo = Math.floor(s / 1.4) % (2 * ns.length - 2), idx = ciclo < ns.length ? ciclo : 2 * ns.length - 2 - ciclo, n = ns[idx];
      const h = (b - a) / n;
      let soma = 0, ret = "";
      for (let k = 0; k < n; k++) {
        const xl = a + k * h, y = f(xl); soma += y * h; /* soma pela esquerda: a altura é f no canto esquerdo */
        ret += `<rect x="${sx(xl).toFixed(1)}" y="${sy(y).toFixed(1)}" width="${(sx(xl + h) - sx(xl)).toFixed(2)}" height="${(y0 - sy(y)).toFixed(1)}" style="fill:color-mix(in srgb,var(--mK1) 28%,transparent);stroke:var(--mK1);stroke-width:${n > 32 ? 0.4 : 1}"/>`;
      }
      const xt = a + (b - a) * (0.5 + 0.5 * Math.sin(s * 0.7)), yt = f(xt), m = df(xt), dx = 0.75;
      g.innerHTML = `<defs><clipPath id="clipcalc"><rect x="${x0}" y="10" width="305" height="${y0 - 10}"/></clipPath></defs>` + ret + `<line x1="${x0}" y1="${y0}" x2="${x0 + 305}" y2="${y0}" style="stroke:var(--ink2);stroke-width:1.4"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="18" style="stroke:var(--ink2);stroke-width:1.4"/>
        <path d="${curva}" style="fill:none;stroke:var(--ink);stroke-width:2.4"/>
        <line x1="${sx(xt - dx)}" y1="${sy(yt - m * dx)}" x2="${sx(xt + dx)}" y2="${sy(yt + m * dx)}" clip-path="url(#clipcalc)" style="stroke:var(--mK2);stroke-width:2.6;stroke-linecap:round"/>
        <circle cx="${sx(xt)}" cy="${sy(yt)}" r="5.5" style="fill:var(--mK2);stroke:var(--bg);stroke-width:2"/>
        <text x="${x0 + 8}" y="30" class="tx2">n = ${n} retângulos</text>`;
      leg.innerHTML = `soma = ${F.t(soma, 4)} &nbsp;·&nbsp; ∫ = ${F.t(I, 4)} &nbsp;·&nbsp; erro = ${F.t(soma - I, 4)}<br>inclinação da tangente f′ = ${F.t(m, 2)}`;
      if (!reduz) requestAnimationFrame(q);
    }
    requestAnimationFrame(q);
    F.aoSair(() => (vivo = false));
  }

  function pgSumario(el) {
    el.innerHTML = `<div class="cab-tema"><div class="sobre">Mapa</div><h1>Sumário em árvore</h1><p style="color:var(--ink2)">Temas já escritos têm link para a teoria e para os exercícios.</p></div>` +
      CATALOGO.filter((m) => areaDe(m) === F.area).map((m) => `<h3 style="margin:24px 0 8px;color:var(${m.cor})">${m.letra} · ${m.nome}</h3><pre style="font:14px/1.7 var(--f-text);margin:0;white-space:pre-wrap">${m.temas.map((t) => t[3]
        ? `● <a href="#/${t[0]}">${t[0]} ${t[1]}</a>\n |___> <a href="#/${t[0]}/teoria">teoria</a>  <a href="#/${t[0]}/exercicios">[exercícios]</a>`
        : `<span style="color:var(--ink3)">○ ${t[0]} ${t[1]}</span> <span class="breve-tag" style="margin-left:4px">em breve</span>`).join("\n")}</pre>`).join("");
  }

  /* ---------- tema ---------- */
  F.registrar = (cod, def) => { F.temas = F.temas || {}; F.temas[cod] = def; if (pendente === cod) { pendente = null; rota(); } };
  let pendente = null;
  function carregaTema(cod) {
    if (F.temas && F.temas[cod]) return true;
    pendente = cod;
    const s = document.createElement("script");
    s.src = `temas/${cod}.js`;
    s.onerror = () => { $("#pagina").innerHTML = `<p>Não achei o arquivo <code>temas/${cod}.js</code>.</p>`; };
    document.body.appendChild(s);
    return false;
  }
  function pgTema(el, info, ancora) {
    const def = F.temas[info.cod];
    temaAtual = info.cod; exercicios = []; fila = [];
    document.documentElement.style.setProperty("--mod", `var(${info.mod.cor})`);
    const corpo = def.html(F);
    el.innerHTML = `<div class="cab-tema"><div class="sobre"><span>${info.mod.letra} · ${info.mod.nome}</span></div>
      <h1>${info.cod} · ${info.nome}</h1><div class="marcas">${F.selos(info.marcas)}${(def.retoma || []).map(F.ret).join("")}</div>
      <nav class="indice" id="indice"></nav></div>${corpo}
      <div class="fim"><div><b>Terminou o tema?</b><div style="color:var(--ink2);font-size:14px">Marca como feito e a bolinha do menu fica verde.</div></div><span class="esp"></span><button class="bt pri" id="bt-feito"></button></div>`;
    $("#indice").innerHTML = $$(".secao", el).map((s) => `<a href="#/${info.cod}/${s.id}">${s.querySelector("h2").textContent.replace(/^\d+/, "")}</a>`).join("");
    const bf = $("#bt-feito");
    const pinta = () => { bf.textContent = feitos()[info.cod] ? "✓ Feito (desmarcar)" : "Marcar como feito"; };
    bf.addEventListener("click", () => { const f = feitos(); if (f[info.cod]) delete f[info.cod]; else f[info.cod] = Date.now(); F.store.set("feitos", f); pinta(); pintaMenu(); });
    pinta();
    F.math(el);
    folhaDeFormulas(el, info.cod);
    const q = fila; fila = []; q.forEach((fn) => fn());
    lembraUltimo(info);
    if (def.montar) def.montar(F, el);
    if (ancora) { const a = achaAncora(ancora); if (a) setTimeout(() => a.scrollIntoView(), 30); }
  }

  /* âncoras genéricas usadas no sumário: #/COD/teoria e #/COD/exercicios valem em todo tema, mesmo que a seção tenha outro nome */
  function achaAncora(anc) {
    let a = document.getElementById(anc);
    if (a) return a;
    const secs = $$("#pagina .secao");
    if (anc === "exercicios") a = document.getElementById("desafios") || ($(".ex") && $(".ex").closest(".secao"));
    else if (anc === "teoria") a = secs.find((s) => !["abertura", "pergunta"].includes(s.id)) || secs[0];
    return a || null;
  }

  /* último tema aberto em cada área (para o "continuar de onde parei" do início), com a seção que estava na tela */
  let vigia = null;
  function lembraUltimo(info) {
    const area = areaDe(info.mod), salva = (secao) => F.store.set("ultimo:" + area, { cod: info.cod, secao, t: Date.now() });
    salva(null);
    if (vigia) window.removeEventListener("scroll", vigia);
    let pend = null;
    vigia = () => { clearTimeout(pend); pend = setTimeout(() => { if (temaAtual !== info.cod) return; const s = $$("#pagina .secao").filter((x) => x.getBoundingClientRect().top < 200).pop(); salva(s && s.id !== "abertura" ? s.id : null); }, 400); };
    window.addEventListener("scroll", vigia, { passive: true });
  }

  /* folha de fórmulas: junta, no fim do tema, todas as fórmulas em destaque da página (resumo para revisar) */
  function folhaDeFormulas(el, cod) {
    const fs = $$(".formula", el).filter((f) => !f.closest(".lab, .exemplo, .ex, .chefao, .rev-painel"));
    if (fs.length < 2 || el.querySelector("#resumo")) return; /* temas que já têm "Resumo" escrito à mão não precisam */
    const sec = document.createElement("section");
    sec.className = "secao folha"; sec.id = "formulas";
    sec.innerHTML = `<h2>Folha de fórmulas</h2><p class="folha-sub">As fórmulas em destaque deste tema, juntas, para revisar antes dos exercícios.</p><div class="folha-grade"></div>`;
    const grade = sec.querySelector(".folha-grade");
    fs.forEach((f) => { const c = f.cloneNode(true); c.removeAttribute("id"); grade.appendChild(c); });
    const alvo = el.querySelector("#desafios, #exercicios") || el.querySelector(".fim");
    alvo.parentNode.insertBefore(sec, alvo);
    const ind = $("#indice"); if (ind) { const a = document.createElement("a"); a.href = `#/${cod}/formulas`; a.textContent = "Folha de fórmulas"; const ref = ind.querySelector(`a[href$="/desafios"], a[href$="/exercicios"]`); ind.insertBefore(a, ref); }
  }

  /* ---------- rotas ---------- */
  let paradas = [], renderizado = null;
  F.aoSair = (fn) => paradas.push(fn); // simulações registram como parar a animação
  function rota() {
    {
      const h0 = (location.hash || "#/home").slice(2).split("/");
      if (h0[0] === renderizado && h0[1] && achaAncora(h0[1])) { achaAncora(h0[1]).scrollIntoView(); return; }
    }
    paradas.forEach((fn) => { try { fn(); } catch (e) {} }); paradas = [];
    gaveta(false);
    const h = (location.hash || "#/home").slice(2).split("/");
    const pag = $("#pagina");
    const cod = h[0] || "home", anc = h[1];
    renderizado = null;
    temaAtual = null;
    document.documentElement.style.removeProperty("--mod");
    /* tela inicial do projeto e matérias registradas em assets/materias.js (docs/MODELO_DE_DADOS.md) */
    const J = window.JARVIS, mat = J ? J.materia(cod) : null;
    document.body.classList.toggle("modo-home", !!J && (cod === "home" || (!!mat && !mat.pronta)));
    if (J && cod === "home") { J.home(pag); window.scrollTo(0, 0); return; }
    if (mat && !mat.pronta) { J.emBreve(pag, mat); window.scrollTo(0, 0); return; }
    if (mat && mat.pronta && !h[1] && mat.rota !== "#/" + cod) { location.replace(mat.rota); return; } /* só o id da matéria: #/fisica → #/inicio */
    if (cod === "inicio" || cod === "calculo" || cod === "experimentos" || cod === "experimental") { F.area = { calculo: "calculo", experimentos: "exp", experimental: "lab" }[cod] || "fisica"; pgInicio(pag, F.area); }
    else if (cod === "legenda") { location.replace("#/" + AREA(F.area).inicio); setTimeout(() => { const d = $("#detalhes"); if (d) d.classList.add("aberto"); }, 50); return; } /* a legenda agora fica só no painel do topo */
    else if (cod === "sumario") pgSumario(pag);
    else {
      const info = F.achar(cod);
      if (!info && RENOMEADOS[cod]) { location.replace("#/" + RENOMEADOS[cod] + (anc ? "/" + anc : "")); return; } /* link antigo (ex.: #/B12) */
      if (!info) pag.innerHTML = `<p>Tema ${cod} não existe.</p>`;
      else if (!info.pronto) pag.innerHTML = `<div class="cab-tema"><div class="sobre" style="color:var(${info.mod.cor})">${info.mod.letra} · ${info.mod.nome}</div><h1>${info.cod} · ${info.nome}</h1></div><p style="color:var(--ink2)">Este tema ainda não foi escrito.</p>`;
      else if (carregaTema(cod)) { pgTema(pag, info, anc); renderizado = cod; }
      else pag.innerHTML = `<p style="color:var(--ink2)">Carregando…</p>`;
      if (info) { temaAtual = info.cod; F.area = areaDe(info.mod); }
    }
    pintaMenu();
    if (!anc) window.scrollTo(0, 0);
  }

  /* ---------- menu em gaveta (celular) ---------- */
  function gaveta(abre) {
    const b = $("#bt-menu"), v = $("#veu"); if (!b) return;
    document.body.classList.toggle("menu-aberto", abre);
    b.setAttribute("aria-expanded", abre); v.hidden = !abre;
    if (abre) { const a = $("#menu a.atual") || $("#busca"); if (a && a.scrollIntoView) a.scrollIntoView({ block: "center" }); }
  }
  function montaGaveta() {
    $("#bt-menu").addEventListener("click", () => gaveta(!document.body.classList.contains("menu-aberto")));
    $("#veu").addEventListener("click", () => gaveta(false));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") gaveta(false); });
    $("#menu-mods").addEventListener("click", (e) => { if (e.target.closest("a")) gaveta(false); });
  }

  /* ---------- topo que some ---------- */
  function topo() {
    let ult = window.scrollY, acum = 0;
    const t = $(".topo");
    window.addEventListener("scroll", () => {
      const y = window.scrollY, d = y - ult; ult = y;
      if (y < 60) { t.classList.remove("escondido"); acum = 0; return; }
      acum = Math.sign(d) === Math.sign(acum) ? acum + d : d;
      if (acum > 30) t.classList.add("escondido");
      else if (acum < -25) t.classList.remove("escondido");
    }, { passive: true });
  }

  /* ---------- configurações (engrenagem): aparência e idioma ---------- */
  function tema() {
    const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;
    const aplica = () => {
      const v = F.store.get("tema", "escuro"), claro = v === "claro" || (v === "sistema" && mq && mq.matches);
      if (claro) document.documentElement.setAttribute("data-tema", "claro"); else document.documentElement.removeAttribute("data-tema");
      F.evento("tema");
    };
    aplica();
    if (mq && mq.addEventListener) mq.addEventListener("change", () => { if (F.store.get("tema", "escuro") === "sistema") aplica(); });
    const box = $("#config"), bt = $("#bt-config");
    if (!box) return;
    const pinta = () => {
      const tv = F.store.get("tema", "escuro"), idi = F.store.get("idioma", "pt");
      $$("[data-cfg=tema] .bt", box).forEach((b) => b.setAttribute("aria-pressed", b.dataset.v === tv));
      $$("[data-cfg=idioma] .bt", box).forEach((b) => b.setAttribute("aria-pressed", b.dataset.v === idi));
      $("#nota-idioma").hidden = idi !== "en";
    };
    const abre = (on) => { box.classList.toggle("aberto", on); bt.setAttribute("aria-expanded", on); };
    bt.addEventListener("click", (e) => { e.stopPropagation(); abre(!box.classList.contains("aberto")); });
    document.addEventListener("click", (e) => { if (!box.contains(e.target)) abre(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") abre(false); });
    $$("[data-cfg=tema] .bt", box).forEach((b) => b.addEventListener("click", () => { F.store.set("tema", b.dataset.v); aplica(); pinta(); }));
    $$("[data-cfg=idioma] .bt", box).forEach((b) => b.addEventListener("click", () => { F.store.set("idioma", b.dataset.v); pinta(); }));
    pinta();
  }

  /* ---------- exportar / importar progresso ---------- */
  function backup() {
    $("#bt-exp").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(F.store.tudo(), null, 1)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "progresso-fisica-" + new Date().toISOString().slice(0, 10) + ".json"; a.click();
    });
    $("#bt-imp").addEventListener("click", () => $("#arq-imp").click());
    $("#arq-imp").addEventListener("change", async (ev) => {
      const f = ev.target.files[0]; if (!f) return;
      try {
        let o = JSON.parse(await f.text());
        if (!o || typeof o !== "object" || !Object.keys(o).some((k) => k.startsWith(PFX))) throw new Error("formato");
        if (+(o[PFX + "codigos"] || 1) < VERSAO_CODIGOS) o = F.migraDados(o); /* backup feito antes da troca de códigos */
        Object.entries(o).forEach(([k, v]) => {
          if (!k.startsWith(PFX)) return;
          v = typeof v === "string" ? v : JSON.stringify(v);
          if (k === PFX + "feitos") { try { v = JSON.stringify(Object.assign(JSON.parse(localStorage.getItem(k) || "{}"), JSON.parse(v))); } catch (e) {} } /* soma, não apaga o que já estava feito */
          localStorage.setItem(k, v);
        });
        alert("Progresso importado."); location.reload();
      }
      catch (e) { alert("Não consegui ler esse arquivo. Ele precisa ser o .json exportado por este site."); }
    });
  }

  document.addEventListener("DOMContentLoaded", () => { const v = document.getElementById("versao"); if (v) v.textContent = "Jarvis " + VERSAO; tema(); montaMenu(); montaGaveta(); topo(); backup(); if (window.montaDetalhes) montaDetalhes(F); window.addEventListener("hashchange", rota); rota(); });
})();
