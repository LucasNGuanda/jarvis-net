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
  /* β 3.8: cada matéria guarda o seu progresso com o seu prefixo (MATERIAS[].prefixo: fisica, mat, qui, rus).
     A física continua em "fisica:" (nada muda no que já está salvo). As configurações do site inteiro também ficam em "fisica:". */
  const PFX = "fisica:";
  const GLOBAIS = new Set(["tema", "idioma", "mostrarBreve", "menuAbertos", "codigos"]);
  F.pfx = () => { const mid = F.materia ? F.materia() : "fisica", m = (window.MATERIAS || []).find((x) => x.id === mid); return mid === "fisica" || !m || !m.prefixo ? PFX : m.prefixo + ":"; };
  const chave = (k) => (GLOBAIS.has(k) ? PFX : F.pfx()) + k;
  F.PREFIXOS = () => ["fisica:", "jarvis:"].concat((window.MATERIAS || []).filter((m) => m.id !== "fisica" && m.prefixo).map((m) => m.prefixo + ":"));
  /* β 4.0: a aba Cálculo (27 temas) saiu da física e foi para a matemática. Migração ÚNICA e NÃO destrutiva:
     COPIA de fisica: para mat: o progresso desses temas (feitos, marca:COD-n, resultado:COD-n, chefao:COD) e o "continuar de onde parei"
     da aba (ultimo:calculo → ultimo:matcalc). Nada é apagado de fisica: — a versão antiga do site continua achando tudo.
     Antes de copiar, guarda um retrato de todo o progresso em jarvis:backup:antes-calculo (entra no "Exportar progresso"). */
  const CALCULO = new Set([].concat(Array.from({ length: 9 }, (_, i) => "CI0" + (i + 1)), Array.from({ length: 8 }, (_, i) => "CII0" + (i + 1)), ["CE01", "CE02", "CE03", "TE01", "TE02", "TE03", "TE04", "TE05", "SC01", "SC02"]));
  F.CALCULO = CALCULO;
  F.migraCalculo = (sempre) => {
    try {
      if (!sempre && localStorage.getItem("mat:migrou-calculo")) return 0;
      const ls = localStorage, chaves = []; for (let i = 0; i < ls.length; i++) chaves.push(ls.key(i));
      if (!ls.getItem("jarvis:backup:antes-calculo")) { const foto = {}; chaves.filter((k) => /^(fisica|mat|qui|rus|jarvis):/.test(k)).forEach((k) => (foto[k] = ls.getItem(k))); ls.setItem("jarvis:backup:antes-calculo", JSON.stringify({ quando: new Date().toISOString(), chaves: foto })); }
      let n = 0;
      chaves.forEach((k) => { const m = /^fisica:((?:marca|resultado):([A-Za-z0-9]+)-\d+|chefao:([A-Za-z0-9]+))$/.exec(k); if (!m || !CALCULO.has(m[2] || m[3])) return; if (ls.getItem("mat:" + m[1]) === null) { ls.setItem("mat:" + m[1], ls.getItem(k)); n++; } });
      const fv = JSON.parse(ls.getItem("fisica:feitos") || "{}"), mv = JSON.parse(ls.getItem("mat:feitos") || "{}");
      Object.keys(fv).forEach((c) => { if (CALCULO.has(c) && !(c in mv)) { mv[c] = fv[c]; n++; } });
      ls.setItem("mat:feitos", JSON.stringify(mv));
      if (ls.getItem("fisica:ultimo:calculo") !== null && ls.getItem("mat:ultimo:matcalc") === null) { ls.setItem("mat:ultimo:matcalc", ls.getItem("fisica:ultimo:calculo")); n++; }
      ls.setItem("mat:migrou-calculo", "1");
      return n;
    } catch (e) { return -1; }
  };
  F.store = {
    get(k, d) { try { const v = localStorage.getItem(chave(k)); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(chave(k), JSON.stringify(v)); } catch (e) {} },
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
  F.migraCalculo(); /* β 4.0: depois da troca de códigos antiga, para copiar já com os códigos atuais */

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
  /* número limpo para TEXTO comum (fora do $...$): 2,5 em vez de 2{,}5 */
  F.nt = (v, d = 4) => F.n(v, d).replace("{,}", ",").replace(/^-/, "−");
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
  F.ret = (cod) => { const t = F.achar(cod), ok = t && t.pronto; return `<a class="selo ret${ok ? "" : " breve"}" href="${t ? F.href(t.cod, t.mat) : "#/" + cod}" title="retoma ${t ? t.nome : cod}${ok ? "" : " (em breve: ainda não escrito)"}">[${t ? t.cod : cod}]←</a>`; };
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
  const lerNumero = (s) => { s = String(s).trim().replace(/\s/g, "").replace(/−/g, "-").replace(/[×·]10\^?/g, "e"); if (/^-?\d{1,3}(\.\d{3}){2,}(,\d+)?$/.test(s) || /^-?\d{1,3}(\.\d{3})+,\d+$/.test(s)) s = s.replace(/\./g, ""); /* "1.000.000" ou "1.234,5": ponto de milhar; um ponto sozinho é decimal */ s = s.replace(",", "."); const v = Number(s); return s !== "" && isFinite(v) ? v : NaN; };
  F.lerNumero = lerNumero;
  const fmtNum = (v) => String(+(+v).toPrecision(4)).replace(".", ",").replace("-", "−");
  /* β 5.3: campo opcional gerar(primeiro) → devolve os campos que mudam (enun, fig, alts, certa, num, dicas, resp, sol): o exercício ganha o botão
     "Me dá um parecido", que sorteia outra versão. Só a versão que abre com a página (gerar(true)) entra no mapa de erros; as sorteadas são treino.
     Para os testes: o elemento guarda a versão atual em el._d (num.v, certa e, se houver, py = a mesma conta escrita como expressão Python). */
  F.exercicio = (e) => {
    const chave = `marca:${temaAtual}-${e.n}`, chaveRes = `resultado:${temaAtual}-${e.n}`;
    const d0 = e.gerar ? Object.assign({}, e, e.gerar(true)) : e;
    exercicios.push(chave);
    const id = F.id("ex");
    const corpo = (d) => {
      const auto = !!(d.certa || d.num);
      const alts = d.alts ? (d.certa
        ? `<ol class="alts clicaveis">${d.alts.map((a, i) => `<li><button type="button" class="alt" data-l="${String.fromCharCode(65 + i)}"><b>${String.fromCharCode(65 + i)})</b><span>${a}</span></button></li>`).join("")}</ol>`
        : `<ol class="alts">${d.alts.map((a, i) => `<li><b>${String.fromCharCode(65 + i)})</b>${a}</li>`).join("")}</ol>`) : "";
      const campo = d.num ? `<div class="ex-num"><label>sua resposta <input type="text" inputmode="decimal" autocomplete="off" aria-label="sua resposta numérica"></label>${d.num.un ? `<span class="un">${d.num.un}</span>` : ""}<button type="button" class="bt peq">Conferir</button></div>` : "";
      const correcao = auto ? `${campo}<div class="ex-fb" aria-live="polite"></div><div class="ex-prim"></div>` : "";
      const rev = F.revela([...(d.dicas || []).map((x, i) => ({ rot: `Dica ${i + 1}`, html: x })), { rot: "Resposta e resolução", html: `<p><b>Resposta:</b> ${d.resp}</p>${d.sol}`, resp: true }]);
      return `<div>${d.enun}</div>${d.fig ? F.fig(d.fig) : ""}${alts}${correcao}${rev}${e.gerar ? `<div class="bts" style="margin-top:10px"><button type="button" class="bt peq ex-par">${F.ic("dado")} Me dá um parecido</button></div>` : ""}`;
    };
    F.depois(() => {
      const el = document.getElementById(id);
      const bs = $$(".certeza button", el);
      const pinta = () => { const v = F.store.get(chave, ""); bs.forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === v)); };
      bs.forEach((b) => b.addEventListener("click", () => { const v = F.store.get(chave, ""); F.store.set(chave, v === b.dataset.m ? "" : b.dataset.m); pinta(); F.evento("marca"); }));
      pinta();
      const liga = (d, treino) => {
        el._d = d;
        const par = $(".ex-par", el); if (par) par.addEventListener("click", () => { const nd = Object.assign({}, e, e.gerar(false)), c = $(".ex-corpo", el); c.innerHTML = corpo(nd); F.math(c); liga(nd, true); });
        if (!(d.certa || d.num)) return;
        const fb = $(".ex-fb", el);
        const registra = (certo, dada) => { if (treino) return; if (!F.store.get(chaveRes, null)) F.store.set(chaveRes, { r: certo ? "certo" : "errado", dada }); F.evento("resultado"); };
        const avisa = (certo, txt) => { fb.className = "ex-fb " + (certo ? "certo" : "errado"); fb.innerHTML = txt; };
        const ant = F.store.get(chaveRes, null);
        if (treino) $(".ex-prim", el).textContent = "Versão sorteada: é treino, não entra no mapa de erros.";
        else if (ant) $(".ex-prim", el).textContent = `Primeira tentativa: ${ant.dada} (${ant.r}).`;
        if (d.certa) $$(".alt", el).forEach((b) => b.addEventListener("click", () => {
          const certo = b.dataset.l === d.certa;
          $$(".alt", el).forEach((x) => x.classList.remove("certa", "errada"));
          b.classList.add(certo ? "certa" : "errada");
          avisa(certo, certo ? "Certo!" : "Ainda não. Tente de novo ou abra uma dica.");
          registra(certo, b.dataset.l);
        }));
        if (d.num) {
          const inp = $(".ex-num input", el), confere = () => {
            const v = lerNumero(inp.value); if (isNaN(v)) { avisa(false, "Escreva só o número (vírgula ou ponto; 3,2e5 para 3,2 × 10⁵)."); return; }
            const tol = d.num.tol ?? 0.02, alvo = d.num.v, certo = alvo === 0 ? Math.abs(v) <= (d.num.abs ?? 1e-9) : Math.abs(v - alvo) <= tol * Math.abs(alvo);
            avisa(certo, certo ? "Certo!" : "Ainda não. Confira a conta e as unidades, ou abra uma dica.");
            registra(certo, fmtNum(v));
          };
          $(".ex-num button", el).addEventListener("click", confere);
          inp.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); confere(); } });
        }
      };
      liga(d0, false);
    });
    return `<div class="ex" id="${id}">
      <div class="ex-cab"><span class="num">${temaAtual}.${String(e.n).padStart(2, "0")}</span>${e.nivel ? `<span class="nivel ${e.nivel === "Máximo" ? "max" : "fis"}">${e.nivel}</span>` : ""}<span class="marcas">${F.selos(e.marcas)}</span>
        <span class="certeza" title="● certeza · X dúvida · / chutei">sua marcação <button data-m="●">●</button><button data-m="X">X</button><button data-m="/">/</button></span></div>
      <div class="ex-corpo">${corpo(d0)}</div>
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
  /* β 3.8: códigos de tema são únicos DENTRO de cada matéria (a química tem A01, a física também). F.achar procura na matéria pedida
     (padrão: a matéria atual); "quimica/A01" também funciona. chave = id interno do tema (física: "A01"; outras: "quimica/A01"). */
  const areaDe = (m) => m.area || "fisica";
  const AREA = (id) => AREAS.find((a) => a.id === id) || AREAS[0];
  const materiaDoMod = (m) => AREA(areaDe(m)).materia || "fisica";
  F.materia = () => AREA(F.area).materia || "fisica";
  F.achar = (cod, mid) => { if (cod && cod.includes("/")) [mid, cod] = cod.split("/"); mid = mid || F.materia(); for (const m of CATALOGO) { if (materiaDoMod(m) !== mid) continue; for (const t of m.temas) if (t[0] === cod) return { cod, nome: t[1], marcas: t[2] || [], pronto: !!t[3], mod: m, mat: mid, chave: mid === "fisica" ? cod : mid + "/" + cod }; } return null; };
  /* link de um tema: física nas rotas antigas (#/A01), as outras com a matéria na frente (#/quimica/A01) */
  F.href = (cod, de, anc) => { const mid = typeof de === "string" ? de : de ? materiaDoMod(de) : F.materia(); return "#/" + (mid === "fisica" ? "" : mid + "/") + cod + (anc ? "/" + anc : ""); };
  F.area = "fisica";
  const feitos = () => F.store.get("feitos", {});

  /* ---------- menu ---------- */
  function montaMenu() {
    const menu = $("#menu-mods");
    const abertos = F.store.get("menuAbertos", ["C"]);
    menu.innerHTML = CATALOGO.map((m) => `<div class="mod ${abertos.includes(m.id) ? "aberto" : ""} ${m.temas.some((t) => t[3]) ? "" : "vazio"}" data-mod="${m.id}" data-area="${areaDe(m)}" style="--c:var(${m.cor})">
      <button aria-expanded="${abertos.includes(m.id)}" class="${m.temas.some((t) => t[3]) ? "" : "vazio"}"><span class="letra${[...m.letra].length > 1 ? " longa" : ""}">${m.letra}</span><span class="nome">${m.nome}</span>${(() => { const k = m.temas.filter((t) => t[3]).length; return `<span class="conta" title="${k} de ${m.temas.length} temas escritos${k ? "" : " (em breve)"}">${k}/${m.temas.length}</span>`; })()}<span class="seta">›</span></button>
      <ul>${m.temas.map((t) => `<li><a href="${F.href(t[0], m)}" data-cod="${t[0]}" class="${t[3] ? "" : "breve"}" ${t[3] ? "" : 'title="Ainda não escrito" aria-disabled="true"'}><span class="cod">${t[0]}</span><span class="nome">${t[1]}</span>${t[3] ? '<span class="bola"></span>' : '<span class="breve-tag">em breve</span>'}</a></li>`).join("")}</ul></div>`).join("");
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
  /* abas do topo: Home + as áreas da matéria atual (AREAS em assets/catalogo*.js); a cor da matéria vai para --materia */
  let materiaAbas = null;
  const materiaDe = (areaId) => AREA(areaId).materia || "fisica";
  function abasTopo() {
    const mid = materiaDe(F.area); materiaAbas = mid; /* β 4.1: refeitas sempre, porque o acesso pode ter mudado */
    const box = $(".topo .abas-materia"); if (box) box.innerHTML = AREAS.filter((a) => (a.materia || "fisica") === mid).map((a) => `<a class="aba" data-area="${a.id}" href="#/${a.inicio}" aria-label="${a.nome}">${a.icone || ""}<span class="aba-txt">${a.nome}</span></a>`).join("");
    const mat = (window.MATERIAS || []).find((m) => m.id === mid); document.body.style.setProperty("--materia", mat ? `var(${mat.cor})` : "var(--mA)"); document.body.dataset.materia = mid;
    if (window.ACESSO && box) box.querySelectorAll(".aba").forEach((a) => { if (!ACESSO.area(a.dataset.area)) ACESSO.trancar(a); });
    if (window.JARVIS && JARVIS.pintaVersao) JARVIS.pintaVersao();
  }
  function pintaMenu() {
    abasTopo();
    document.body.classList.toggle("area-vazia", !CATALOGO.some((m) => areaDe(m) === F.area && m.temas.some((t) => t[3]))); /* nada escrito ainda: o menu mostra os módulos mesmo assim */
    const f = feitos();
    $$("#menu-mods .mod").forEach((m) => m.classList.toggle("outra-area", m.dataset.area !== F.area));
    $$(".topo .aba").forEach((a) => a.classList.toggle("atual", a.dataset.area === F.area));
    const ar = AREA(F.area);
    $(".topo nav.links a").setAttribute("href", "#/" + ar.inicio);
    $$("#menu-mods .mod:not(.outra-area) a[data-cod]").forEach((a) => {
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
    const continuar = ui && ui.pronto ? `<a class="continuar" href="${F.href(ui.cod, ui.mat, ult.secao)}" style="--c:var(${ui.mod.cor})"><span class="letra">${ui.mod.letra}</span><span><small>Continuar de onde parei</small><b>${ui.cod} · ${ui.nome}</b></span>${F.ic("seta")}</a>` : "";
    el.innerHTML = `<div class="hero2"><div><h1>${ar.titulo}</h1>${continuar}</div><div class="anim" id="${anim}"></div></div>
      <div class="cartao"><div class="tit"><span class="tag">Progresso</span>${nfeitos} de ${total} temas feitos · ${prontos} já escritos</div>
        <div class="barra" style="--c:var(--ok)"><i style="width:${total ? (100 * nfeitos) / total : 0}%"></i></div></div>${ar.extra || ""}
      <h2 style="margin-top:32px">Módulos</h2>${mods.length ? "" : `<div class="vazio" style="margin-top:12px"><b>Em breve</b>Os módulos desta aba ainda vão ser criados.</div>`}
      <div class="mods">${mods.map((m) => { const n = m.temas.length, k = m.temas.filter((t) => f[t[0]]).length; const prim = m.temas.find((t) => t[3]) || m.temas[0] || [ar.inicio]; /* módulo ainda sem temas: o cartão fica "em breve" e não leva a lugar nenhum */
        const esc = m.temas.filter((t) => t[3]).length;
        return `<a class="modc ${esc ? "" : "breve"}" href="${m.temas.length ? F.href(prim[0], m) : "#/" + ar.inicio}" style="--c:var(${m.cor})"><div class="letra${[...m.letra].length > 1 ? " longa" : ""}">${m.letra}</div><h3>${m.nome}</h3><p>${m.desc}</p><div class="barra"><i style="width:${n ? (100 * k) / n : 0}%"></i></div><p style="margin-top:6px">${esc ? `${k}/${n} feitos · ${esc} ${esc === 1 ? "escrito" : "escritos"}` : "em breve"}</p></a>`; }).join("")}</div>
      <h2 style="margin-top:36px">Como usar</h2>
      <div class="grade2" style="margin-top:12px">
        <div class="cartao"><b>Ordem de um tema</b><ol style="margin:8px 0 0;padding-left:1.2em;color:var(--ink2)"><li>Pergunta de abertura</li><li>Laboratório (chute antes de mexer)</li><li>A ideia, com números</li><li>Teoria completa e demonstrações</li><li>Exemplos passo a passo</li><li>Resumo, exercícios e chefão</li></ol></div>
        <div class="cartao"><b>Marcação de certeza</b><p style="color:var(--ink2);margin:8px 0 0">Em cada exercício marque <b>●</b> certeza, <b>X</b> dúvida ou <b>/</b> chutei. Fica salvo neste navegador. O chefão destrava quando todos estiverem marcados. Dicas e respostas só abrem se você clicar.</p></div>
      </div>`;
    (F.ANIM[ar.anim] || animAtomo)(document.getElementById(anim));
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

  /* experimentos: pêndulo duplo (pequeno, só enfeite) com rastro. Tem uma surpresa escondida (ver PROGRESSO.md, β 3.4). */
  function animPendulo(el) {
    const idF = F.id("fx"), idG = F.id("gx");
    el.innerHTML = `<svg viewBox="-225 -225 450 450" aria-label="pêndulo duplo animado"><defs><filter id="${idF}" x="-60%" y="-60%" width="220%" height="220%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="ru"/><feDisplacementMap in="SourceGraphic" in2="ru" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter><radialGradient id="${idG}"><stop offset="52%" stop-color="#ffd98a" stop-opacity="0"/><stop offset="60%" stop-color="#ffe2a0"/><stop offset="76%" stop-color="#ff8a3d" stop-opacity=".85"/><stop offset="100%" stop-color="#ff4a3a" stop-opacity="0"/></radialGradient></defs><g class="r"></g><g class="p"></g><g class="x"></g></svg>`;
    let s = [2.2, 2.6, 0, 0], vivo = true, tr = []; const L = 1, g = 9.8;
    const f = ([a1, a2, w1, w2]) => { const d = a1 - a2, den = 3 - Math.cos(2 * d); return [w1, w2, (-g * 3 * Math.sin(a1) - g * Math.sin(a1 - 2 * a2) - 2 * Math.sin(d) * (w2 * w2 + w1 * w1 * Math.cos(d))) / den, (2 * Math.sin(d) * (2 * w1 * w1 + 2 * g * Math.cos(a1) + w2 * w2 * Math.cos(d))) / den]; };
    const rk = (st, h) => { const k1 = f(st), k2 = f(st.map((v, i) => v + (h / 2) * k1[i])), k3 = f(st.map((v, i) => v + (h / 2) * k2[i])), k4 = f(st.map((v, i) => v + h * k3[i])); return st.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); };
    let t0 = performance.now(); const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const svg = el.querySelector("svg"), gx = el.querySelector(".x");
    let pos = [0, 0, 0, 0], ev = null, achou = !!F.store.get("segredo:x", 0);
    const C = [0, 40]; /* centro do "x" */
    const fim = () => { ev = null; s = [2.2, 2.6, 0, 0]; tr = []; gx.innerHTML = ""; };
    svg.addEventListener("pointermove", (e) => {
      if (ev || reduz) return;
      const m = svg.getScreenCTM(); if (!m) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      if (Math.hypot(p.x - pos[2], p.y - pos[3]) < 8) { ev = { t: 0, p0: pos.slice() }; if (!achou) { achou = true; F.store.set("segredo:x", 1); } }
    });
    svg.addEventListener("click", (e) => { if (!ev) return; if (e.target.closest && e.target.closest(".gx-gato")) { location.hash = "#/EP17"; return; } if (ev.t > 3) fim(); });
    function cena(dt) {
      ev.t += dt; const t = ev.t, [cx, cy] = C;
      const cresce = Math.min(1, t / 0.6) * (t > 5.2 ? Math.max(0, 1 - (t - 5.2) / 0.8) : 1), ang = t * 140;
      let o = "";
      if (cresce > 0) {
        /* luz das estrelas de fundo passando perto e se curvando (desvio ∝ 1/b), com uma leve distorção */
        o += `<g filter="url(#${idF})" style="opacity:${(0.85 * cresce).toFixed(2)}">`;
        for (let k = -3; k <= 3; k++) { if (!k) continue; const b = k * 26, dsv = Math.min(0.75 * Math.abs(b), 900 / Math.abs(b)) * Math.sign(b) * cresce; /* desvio ∝ 1/b, limitado para não cruzar */ o += `<path d="M-220 ${cy + b} Q${cx} ${cy + b - dsv} 220 ${cy + b}" style="fill:none;stroke:#cfe0ff;stroke-width:1;opacity:.55"/>`; }
        o += `<circle cx="${cx}" cy="${cy}" r="${46 * cresce}" style="fill:none;stroke:#ffe9b8;stroke-width:2;opacity:.8"/></g>`;
        o += `<g transform="translate(${cx} ${cy}) scale(${cresce.toFixed(3)})"><g transform="scale(1 .32) rotate(${ang.toFixed(1)})"><circle r="92" style="fill:url(#${idG})"/><path d="M-80 0 A80 80 0 0 1 80 0" style="fill:none;stroke:#fff3d6;stroke-width:3;opacity:.6"/></g><circle r="28" style="fill:#000;stroke:#ffcf7a;stroke-width:1.5"/><g transform="scale(1 .32) rotate(${ang.toFixed(1)})"><path d="M-92 0 A92 92 0 0 0 92 0" style="fill:none;stroke:url(#${idG});stroke-width:26;opacity:.9"/></g></g>`;
      }
      /* o pêndulo é puxado espiralando e esticado na direção radial */
      if (t < 2.6) {
        const u = Math.max(0, Math.min(1, (t - 0.5) / 2)), pt = (x, y) => { const r0 = Math.hypot(x - cx, y - cy), a0 = Math.atan2(y - cy, x - cx), r = r0 * Math.pow(1 - u, 1.6), a = a0 + 7 * u * u; return [cx + r * Math.cos(a), cy + r * Math.sin(a), a]; };
        const [x1, y1, a1] = pt(ev.p0[0], ev.p0[1]), [x2, y2, a2] = pt(ev.p0[2], ev.p0[3]), op = (1 - u * u).toFixed(2), est = (k) => 10 + 46 * u * k, fin = (k) => Math.max(0.6, 10 * (1 - u * k));
        o += `<g style="opacity:${op}"><line x1="-40" y1="0" x2="40" y2="0" style="stroke:var(--ink3);stroke-width:3"/><path d="M0 0 L${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" style="stroke:var(--ink);stroke-width:${(2.2 * (1 - u)).toFixed(2)};fill:none"/><ellipse cx="${x1.toFixed(1)}" cy="${y1.toFixed(1)}" rx="${est(0.8).toFixed(1)}" ry="${fin(0.9).toFixed(1)}" transform="rotate(${((a1 * 180) / Math.PI).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)})" style="fill:var(--mA)"/><ellipse cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" rx="${est(1).toFixed(1)}" ry="${fin(1).toFixed(1)}" transform="rotate(${((a2 * 180) / Math.PI).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)})" style="fill:var(--mU)"/></g>`;
      }
      if (t > 2.6 && t < 3.1) o += `<circle cx="${cx}" cy="${cy}" r="${30 + (t - 2.6) * 300}" style="fill:none;stroke:#ffe2a0;stroke-width:3;opacity:${(1 - (t - 2.6) * 2).toFixed(2)}"/>`;
      /* sai o gato: voa, cai de pé e se espreguiça */
      if (t > 2.8 && window.GATO) {
        const tc = t - 2.8, chao = 168, y0 = cy, vy0 = -330, gg = 900; let x = cx + Math.min(tc, 0.9) * 70, y = y0 + vy0 * tc + 0.5 * gg * tc * tc, esc = Math.min(0.62, 0.15 + tc * 0.9), rot = 0;
        if (y > chao) y = chao; else rot = Math.max(0, 1 - tc / 0.9) * 360;
        o += `<g class="gx-gato" style="cursor:pointer" transform="translate(${x.toFixed(1)} ${(y - 30).toFixed(1)}) rotate(${rot.toFixed(0)}) scale(${esc.toFixed(3)})"><rect x="-90" y="-70" width="180" height="140" style="fill:transparent"/>${GATO.svg("acordado", tc)}</g>`;
      }
      gx.innerHTML = o;
      if (t > 11) fim();
    }
    function q(t) {
      if (!vivo) return; const dt = Math.min(0.03, (t - t0) / 1000); t0 = t;
      if (ev) { el.querySelector(".r").innerHTML = ""; el.querySelector(".p").innerHTML = ""; cena(dt); requestAnimationFrame(q); return; }
      if (!reduz) for (let k = 0; k < 20; k++) s = rk(s, dt / 20);
      const e = 105, x1 = e * Math.sin(s[0]), y1 = e * Math.cos(s[0]), x2 = x1 + e * Math.sin(s[1]), y2 = y1 + e * Math.cos(s[1]); pos = [x1, y1, x2, y2];
      tr.push([x2, y2]); if (tr.length > 220) tr.shift();
      el.querySelector(".r").innerHTML = tr.map((p, i) => (i ? `<line x1="${tr[i - 1][0].toFixed(1)}" y1="${tr[i - 1][1].toFixed(1)}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" style="stroke:var(--warn);stroke-width:1.6;opacity:${(i / tr.length).toFixed(2)}"/>` : "")).join("");
      el.querySelector(".p").innerHTML = `<line x1="-40" y1="0" x2="40" y2="0" style="stroke:var(--ink3);stroke-width:3"/><path d="M0 0 L${x1} ${y1} L${x2} ${y2}" style="stroke:var(--ink);stroke-width:2.2;fill:none"/><circle cx="${x1}" cy="${y1}" r="10" style="fill:var(--mA)"/><circle cx="${x2}" cy="${y2}" r="10" style="fill:var(--mU)"/>` + (achou ? `<path d="M206 -212 l2.4 5 l5.4 .7 l-4 3.7 l1 5.4 l-4.8 -2.7 l-4.8 2.7 l1 -5.4 l-4 -3.7 l5.4 -.7 Z" style="fill:var(--ink3);opacity:.7"/>` : "");
      if (!reduz) requestAnimationFrame(q);
    }
    requestAnimationFrame(q); F.aoSair(() => (vivo = false));
    document.addEventListener("click", function fora(e) { if (!vivo) { document.removeEventListener("click", fora); return; } if (ev && ev.t > 3 && !el.contains(e.target)) fim(); });
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

  /* ---------- desenhos das páginas iniciais das outras matérias (β 3.7), no mesmo estilo do átomo: SVG redesenhado a cada quadro ---------- */
  /* Matemática: icosaedro em arame girando (arestas da frente fortes, as de trás apagadas).
     β 3.8: guarda também o segundo segredo do site (ver PROGRESSO.md, β 3.8; nunca mencionar em texto do site). */
  function animSolido(el) {
    const idL = F.id("luz");
    el.innerHTML = `<svg viewBox="-170 -150 340 300" aria-label="sólido platônico girando"><defs><filter id="${idL}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g class="g"></g><g class="sl"></g></svg>`;
    const f = (1 + Math.sqrt(5)) / 2, V = [];
    [-1, 1].forEach((a) => [-f, f].forEach((b) => V.push([0, a, b], [a, b, 0], [b, 0, a])));
    const A = []; for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) if (Math.abs(Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]) - 2) < 1e-9) A.push([i, j]);
    /* hipercubo: 16 vértices (±1, ±1, ±1, ±1); aresta = vértices que diferem numa coordenada só (32 arestas) */
    const H = []; for (let k = 0; k < 16; k++) H.push([0, 1, 2, 3].map((b) => ((k >> b) & 1 ? 1 : -1)));
    const HA = []; for (let i = 0; i < 16; i++) for (let j = i + 1; j < 16; j++) if (H[i].filter((v, k) => v !== H[j][k]).length === 1) HA.push([i, j, H[i].findIndex((v, k) => v !== H[j][k])]);
    const cores = ["var(--mK2)", "var(--mC)", "var(--mA)"], svg = el.querySelector("svg"), g = el.querySelector(".g"), sl = el.querySelector(".sl");
    let vivo = true, ev = null, cliques = [], achou = !!F.store.get("segredo:t", 0); const t0 = performance.now(), reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const selo = () => (sl.innerHTML = achou ? `<path d="M152 -140 l2.4 5 l5.4 .7 l-4 3.7 l1 5.4 l-4.8 -2.7 l-4.8 2.7 l1 -5.4 l-4 -3.7 l5.4 -.7 Z" style="fill:var(--ink3);opacity:.7"/>` : "");
    selo();
    /* 4 cliques seguidos (no máximo 0,7 s entre um e outro) */
    svg.addEventListener("click", (e) => { if (ev || reduz) return; const agora = performance.now(); cliques = cliques.filter((x) => agora - x < 700 * 4).concat(agora); for (let k = cliques.length - 1; k > 0; k--) if (cliques[k] - cliques[k - 1] > 700) { cliques = cliques.slice(k); break; } if (cliques.length >= 4) { cliques = []; dispara(); } });
    const pr = document.querySelector(".principal");
    function falha() { /* chuva de caracteres verdes com ruído e linhas tremendo (~2 s), numa tela por cima de tudo e sem receber clique */
      const cv = document.createElement("canvas"), esc = 0.5, W = Math.ceil(innerWidth * esc), Hh = Math.ceil(innerHeight * esc); cv.width = W; cv.height = Hh; cv.className = "falha-tela"; document.body.appendChild(cv);
      const c = cv.getContext("2d"), CH = "0123456789αβγδεζηθλμνξπρσφψωΣΔΩΦΨ∫∑∏∂∇∞≈≠≤≥√±×÷∈∀∃⊂∪∩", T = 9, cols = Math.ceil(W / T), y = Array.from({ length: cols }, () => -Math.random() * Hh), t1 = performance.now();
      c.fillStyle = "#020604"; c.fillRect(0, 0, W, Hh); c.font = `${T}px monospace`;
      const quadro = (agora) => { const u = (agora - t1) / 1000; if (u > 2 || !cv.isConnected) { cv.remove(); if (pr) pr.style.transform = ""; return; }
        cv.style.opacity = String(Math.min(1, u / 0.15, (2 - u) / 0.3));
        c.fillStyle = "rgba(2,6,4,0.18)"; c.fillRect(0, 0, W, Hh);
        for (let k = 0; k < cols; k++) { const ch = CH[(Math.random() * CH.length) | 0]; c.fillStyle = "#c8ffd8"; c.fillText(ch, k * T, y[k]); c.fillStyle = "#2bd96a"; c.fillText(CH[(Math.random() * CH.length) | 0], k * T, y[k] - T); y[k] += T * (0.6 + Math.random() * 0.6); if (y[k] > Hh && Math.random() > 0.96) y[k] = 0; }
        for (let k = 0; k < 40; k++) { c.fillStyle = `rgba(160,255,190,${Math.random() * 0.25})`; c.fillRect(Math.random() * W, Math.random() * Hh, 1 + Math.random() * 2, 1); }
        for (let k = 0; k < 3; k++) { const yy = (Math.random() * Hh) | 0, hh = 1 + ((Math.random() * 6) | 0), dx = ((Math.random() - 0.5) * 24) | 0; const fx = c.getImageData(0, yy, W, hh); c.putImageData(fx, dx, yy); c.fillStyle = "rgba(120,255,170,.18)"; c.fillRect(0, yy, W, 1); }
        if (pr) pr.style.transform = Math.random() < 0.35 ? `translate(${((Math.random() - 0.5) * 8).toFixed(1)}px, ${((Math.random() - 0.5) * 3).toFixed(1)}px)` : "";
        requestAnimationFrame(quadro); };
      requestAnimationFrame(quadro);
    }
    function dispara() { ev = { t: 0 }; if (!achou) { achou = true; F.store.set("segredo:t", 1); } falha(); }
    const fim = () => { ev = null; selo(); };
    function tesserato(t) { /* gira em 4D nos planos xw e yz, projeta 4D → 3D → tela; o cubo de dentro vira o de fora e vice-versa */
      const a = 0.62 * t, b = 0.38 * t, d4 = 3, d3 = 6, R = 46, ty = 0.55, tx = 0.32;
      const P = H.map(([x, y, z, w]) => { [x, w] = [x * Math.cos(a) - w * Math.sin(a), x * Math.sin(a) + w * Math.cos(a)]; [y, z] = [y * Math.cos(b) - z * Math.sin(b), y * Math.sin(b) + z * Math.cos(b)]; const k = d4 / (d4 - w); x *= k; y *= k; z *= k;
        [x, z] = [x * Math.cos(ty) + z * Math.sin(ty), -x * Math.sin(ty) + z * Math.cos(ty)]; [y, z] = [y * Math.cos(tx) - z * Math.sin(tx), y * Math.sin(tx) + z * Math.cos(tx)]; const q = d3 / (d3 - z); return [R * x * q, R * y * q - 8]; });
      const cor = (i, j, eixo) => (eixo === 3 ? "var(--mC)" : H[i][3] > 0 ? "var(--mK2)" : "var(--mA)");
      let h = `<g filter="url(#${idL})">` + HA.map(([i, j, e]) => `<line x1="${P[i][0].toFixed(1)}" y1="${P[i][1].toFixed(1)}" x2="${P[j][0].toFixed(1)}" y2="${P[j][1].toFixed(1)}" style="stroke:${cor(i, j, e)};stroke-width:1.3;opacity:.95"/>`).join("") + P.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" style="fill:#fff;opacity:.85"/>`).join("") + `</g>`;
      const op = Math.max(0, Math.min(1, (t - 0.4) / 0.6, (5.5 - t) / 1));
      if (op > 0) h += `<text x="0" y="142" text-anchor="middle" style="font:12px var(--f-text);fill:var(--ink2);opacity:${op.toFixed(2)}">tesserato, o cubo de 4 dimensões</text>`;
      return h;
    }
    let ult = performance.now();
    function q(t) {
      if (!vivo) return;
      const dt = Math.min(0.05, (t - ult) / 1000); ult = t;
      if (ev) { ev.t += dt; if (ev.t > 12) fim(); }
      if (ev && ev.t > 2) { g.innerHTML = tesserato(ev.t - 2); sl.innerHTML = ""; requestAnimationFrame(q); return; }
      const s = reduz ? 1 : (t - t0) / 1000, a = 0.45 * s, b = 0.27 * s + 0.4, R = 72, tr = ev ? (Math.random() - 0.5) * 10 : 0;
      const P = V.map(([x, y, z]) => { const x1 = x * Math.cos(a) + z * Math.sin(a), z1 = -x * Math.sin(a) + z * Math.cos(a), y2 = y * Math.cos(b) - z1 * Math.sin(b), z2 = y * Math.sin(b) + z1 * Math.cos(b); return [R * x1 + tr, R * y2, z2]; });
      g.innerHTML = `<ellipse cx="0" cy="128" rx="110" ry="10" style="fill:var(--materia);opacity:.12"/>` + A.map(([i, j], k) => { const z = (P[i][2] + P[j][2]) / 2, frente = z > -0.2; return `<line x1="${P[i][0].toFixed(1)}" y1="${P[i][1].toFixed(1)}" x2="${P[j][0].toFixed(1)}" y2="${P[j][1].toFixed(1)}" style="stroke:${cores[k % 3]};stroke-width:${frente ? 2.4 : 1.3};opacity:${frente ? 0.9 : 0.3}${frente ? "" : ";stroke-dasharray:4 5"}"/>`; }).join("") + P.map(([x, y, z]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${z > 0 ? 5 : 3.2}" style="fill:${z > 0 ? "var(--ink)" : "var(--ink3)"};stroke:var(--bg);stroke-width:1.5"/>`).join("");
      if (!reduz || ev) requestAnimationFrame(q);
    }
    requestAnimationFrame(q); F.aoSair(() => { vivo = false; const c = document.querySelector(".falha-tela"); if (c) c.remove(); if (pr) pr.style.transform = ""; });
    document.addEventListener("click", function fora(e) { if (!vivo) { document.removeEventListener("click", fora); return; } if (ev && ev.t > 2.5 && !el.contains(e.target)) fim(); });
    J_SEGREDO.t = () => ev; /* para os testes */
  }
  /* Olimpíada: demonstração sem palavras 1 + 3 + 5 + … + (2n − 1) = n², com as camadas em L aparecendo uma a uma */
  function animImpares(el) {
    el.innerHTML = `<svg viewBox="0 0 340 300" aria-label="soma dos ímpares é um quadrado"><g class="g"></g></svg>`;
    const g = el.querySelector(".g"), N = 6, L = 34, x0 = 68, y0 = 262, cores = ["var(--mK5)", "var(--mC)", "var(--mA)", "var(--mN)", "var(--mU)", "var(--mK1)"];
    let vivo = true; const t0 = performance.now(), reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function q(t) {
      if (!vivo) return;
      const s = reduz ? 99 : (t - t0) / 1000, ciclo = 1.1 * (N + 2), u = s % ciclo, n = Math.min(N, Math.floor(u / 1.1) + 1), fr = Math.min(1, (u - 1.1 * (n - 1)) / 0.45);
      let h = "";
      for (let k = 1; k <= n; k++) { const op = k < n ? 1 : fr; for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) { if (i < k - 1 && j < k - 1) continue; h += `<rect x="${x0 + i * L + 2}" y="${y0 - (j + 1) * L + 2}" width="${L - 4}" height="${L - 4}" rx="5" style="fill:color-mix(in srgb,${cores[k - 1]} 30%,transparent);stroke:${cores[k - 1]};stroke-width:1.6;opacity:${op.toFixed(2)}"/>`; } }
      const soma = Array.from({ length: n }, (_, k) => 2 * k + 1).join(" + ");
      h += `<text x="170" y="34" text-anchor="middle" style="font:600 16px var(--f-text);fill:var(--ink)">${soma} = ${n}²</text><text x="170" y="56" text-anchor="middle" style="font:13px var(--f-text);fill:var(--ink2)">cada L tem 2k − 1 quadradinhos</text>`;
      g.innerHTML = h;
      if (!reduz) requestAnimationFrame(q);
    }
    requestAnimationFrame(q); F.aoSair(() => (vivo = false));
  }
  /* Química: benzeno girando devagar, com as ligações duplas trocando de lugar (as duas estruturas de ressonância de Kekulé) */
  function animBenzeno(el) {
    el.innerHTML = `<svg viewBox="-170 -150 340 300" aria-label="molécula de benzeno com ressonância"><g class="g"></g></svg>`;
    const g = el.querySelector(".g");
    let vivo = true; const t0 = performance.now(), reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function q(t) {
      if (!vivo) return;
      const s = reduz ? 0 : (t - t0) / 1000, rot = 0.12 * s, w = 0.5 + 0.5 * Math.cos(1.3 * s), RC = 70, RH = 122;
      const ang = (k) => rot - Math.PI / 2 + (k * Math.PI) / 3, C = [0, 1, 2, 3, 4, 5].map((k) => [RC * Math.cos(ang(k)), RC * Math.sin(ang(k))]), H = [0, 1, 2, 3, 4, 5].map((k) => [RH * Math.cos(ang(k)), RH * Math.sin(ang(k))]);
      let h = `<circle r="38" style="fill:none;stroke:var(--materia);stroke-width:1.5;stroke-dasharray:3 6;opacity:.45"/>`;
      C.forEach((p, k) => { const q2 = C[(k + 1) % 6], dupla = k % 2 === 0 ? w : 1 - w, mx = -(q2[1] - p[1]), my = q2[0] - p[0], n = Math.hypot(mx, my), sg = (mx * (p[0] + q2[0]) + my * (p[1] + q2[1])) > 0 ? 1 : -1, ox = sg * (mx / n) * 9, oy = sg * (my / n) * 9, enc = 0.16, ax = p[0] + (q2[0] - p[0]) * enc - ox, ay = p[1] + (q2[1] - p[1]) * enc - oy, bx = q2[0] - (q2[0] - p[0]) * enc - ox, by = q2[1] - (q2[1] - p[1]) * enc - oy;
        h += `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q2[0].toFixed(1)}" y2="${q2[1].toFixed(1)}" style="stroke:var(--ink2);stroke-width:3"/><line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" style="stroke:var(--mN);stroke-width:3;opacity:${dupla.toFixed(2)}"/>`;
        h += `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${H[k][0].toFixed(1)}" y2="${H[k][1].toFixed(1)}" style="stroke:var(--ink3);stroke-width:2.2"/>`; });
      C.forEach(([x, y]) => (h += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" style="fill:var(--card);stroke:var(--mN);stroke-width:2.4"/><text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle" style="font:700 13px var(--f-text);fill:var(--ink)">C</text>`));
      H.forEach(([x, y]) => (h += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" style="fill:var(--card);stroke:var(--ink3);stroke-width:1.8"/><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" style="font:600 11px var(--f-text);fill:var(--ink2)">H</text>`));
      g.innerHTML = h;
      if (!reduz) requestAnimationFrame(q);
    }
    requestAnimationFrame(q); F.aoSair(() => (vivo = false));
  }
  /* Experimentos de química: béquer com bolhas subindo (cada bolha sobe, balança de leve e estoura na superfície) */
  function animBequer(el) {
    el.innerHTML = `<svg viewBox="0 0 340 300" aria-label="béquer com bolhas"><g class="g"></g></svg>`;
    const g = el.querySelector(".g"), bolhas = Array.from({ length: 14 }, (_, i) => ({ x: 120 + ((i * 37) % 100), r: 3 + ((i * 7) % 5), v: 22 + ((i * 13) % 18), f: (i * 0.71) % 1 }));
    let vivo = true; const t0 = performance.now(), reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function q(t) {
      if (!vivo) return;
      const s = reduz ? 2 : (t - t0) / 1000, topo = 132, fundo = 246;
      let h = `<path d="M106 120 L106 238 Q106 254 122 254 L218 254 Q234 254 234 238 L234 120" style="fill:none;stroke:var(--ink2);stroke-width:3;stroke-linejoin:round"/><path d="M98 112 L112 120 M242 112 L228 120" style="stroke:var(--ink2);stroke-width:3;stroke-linecap:round"/>`;
      h += `<path d="M108 ${topo} Q140 ${topo - 3 + 2 * Math.sin(s * 2)} 170 ${topo} T232 ${topo} L232 238 Q232 252 218 252 L122 252 Q108 252 108 238 Z" style="fill:color-mix(in srgb,var(--mN) 24%,transparent)"/>`;
      for (let k = 0; k < 5; k++) h += `<line x1="108" x2="${k % 2 ? 118 : 124}" y1="${148 + k * 20}" y2="${148 + k * 20}" style="stroke:var(--ink3);stroke-width:1.5"/>`;
      bolhas.forEach((b) => { const u = ((s * b.v) / (fundo - topo) + b.f) % 1, y = fundo - u * (fundo - topo), x = b.x + 4 * Math.sin(3 * s + b.f * 9); h += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(b.r * (0.6 + 0.4 * u)).toFixed(1)}" style="fill:none;stroke:var(--mN);stroke-width:1.6;opacity:${(u > 0.92 ? (1 - u) / 0.08 : 0.9).toFixed(2)}"/>`; });
      h += `<path d="M150 104 q-6 -12 2 -22 q6 -8 0 -18" style="fill:none;stroke:var(--ink3);stroke-width:1.6;stroke-linecap:round;opacity:${(0.35 + 0.25 * Math.sin(s * 1.5)).toFixed(2)}"/><path d="M190 100 q6 -12 -2 -22 q-6 -8 0 -18" style="fill:none;stroke:var(--ink3);stroke-width:1.6;stroke-linecap:round;opacity:${(0.35 + 0.25 * Math.cos(s * 1.3)).toFixed(2)}"/>`;
      g.innerHTML = h;
      if (!reduz) requestAnimationFrame(q);
    }
    requestAnimationFrame(q); F.aoSair(() => (vivo = false));
  }
  /* Russo · Gramática: três matrioskas na prateleira, balançando de leve, cada uma no seu ritmo */
  function animMatrioska(el) {
    el.innerHTML = `<svg viewBox="0 0 340 300" aria-label="matrioskas balançando"><g class="g"></g></svg>`;
    const g = el.querySelector(".g"), M = [[66, 246, 0.86, "var(--mK5)", 0.0], [158, 246, 1.18, "var(--mR)", 1.3], [268, 246, 1.55, "var(--mT)", 2.4]];
    const boneca = (c) => `<path d="M50 8C36 8 32 20 34 31C24 42 22 70 28 85Q50 95 72 85C78 70 76 42 66 31C68 20 64 8 50 8Z" style="fill:color-mix(in srgb,${c} 30%,var(--card));stroke:${c};stroke-width:2.4"/><circle cx="50" cy="25" r="10" style="fill:var(--card);stroke:${c};stroke-width:1.8"/><circle cx="46" cy="24" r="1.3" style="fill:var(--ink)"/><circle cx="54" cy="24" r="1.3" style="fill:var(--ink)"/><circle cx="44" cy="29" r="1.8" style="fill:${c};opacity:.5"/><circle cx="56" cy="29" r="1.8" style="fill:${c};opacity:.5"/><path d="M47.5 30.5Q50 32.5 52.5 30.5" style="fill:none;stroke:var(--ink);stroke-width:1.1"/><path d="M35 38Q50 44 65 38" style="fill:none;stroke:${c};stroke-width:1.8"/><ellipse cx="50" cy="64" rx="15" ry="18" style="fill:var(--card);stroke:${c};stroke-width:1.6"/><circle cx="50" cy="62" r="3.5" style="fill:var(--mO)"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${(50 + 7 * Math.cos((i * Math.PI) / 3)).toFixed(1)}" cy="${(62 + 7 * Math.sin((i * Math.PI) / 3)).toFixed(1)}" r="2.6" style="fill:none;stroke:${c};stroke-width:1.2"/>`).join("");
    let vivo = true; const t0 = performance.now(), reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function q(t) {
      if (!vivo) return;
      const s = reduz ? 0 : (t - t0) / 1000;
      g.innerHTML = `<path d="M18 ${M[0][1] + 6}H322" style="stroke:var(--ink3);stroke-width:2;stroke-linecap:round"/>` + M.map(([x, y, k, c, f]) => `<g transform="translate(${x} ${y}) rotate(${(5 * Math.sin(1.5 * s + f)).toFixed(2)}) scale(${k}) translate(-50 -92)">${boneca(c)}</g>`).join("");
      if (!reduz) requestAnimationFrame(q);
    }
    requestAnimationFrame(q); F.aoSair(() => (vivo = false));
  }
  /* Russo · Leitura: a letra Я girando em torno do eixo vertical (de costas ela vira um R) e letras cirílicas subindo */
  /* letra girando em torno do eixo vertical, com letras do alfabeto subindo (β 4.1: generalizada para russo, alemão e sânscrito) */
  const DEVA = "'Noto Sans Devanagari','Nirmala UI','Mangal','FreeSans',sans-serif";
  function animLetra(el, letra, alfabeto, cor, fonte = "var(--f-text)", tam = 170) {
    el.innerHTML = `<svg viewBox="0 0 340 300" aria-label="letra girando"><g class="g"></g></svg>`;
    const g = el.querySelector(".g"), L = [...alfabeto], bolhas = Array.from({ length: 12 }, (_, i) => ({ x: 30 + ((i * 53) % 280), f: (i * 0.37) % 1, c: L[(i * 7) % L.length], v: 0.08 + ((i * 3) % 5) * 0.015 }));
    let vivo = true; const t0 = performance.now(), reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function q(t) {
      if (!vivo) return;
      const s = reduz ? 0.4 : (t - t0) / 1000, k = Math.cos(0.9 * s);
      let h = bolhas.map((b) => { const u = (s * b.v + b.f) % 1; return `<text x="${b.x}" y="${(280 - u * 250).toFixed(1)}" text-anchor="middle" style="font:600 18px ${fonte};fill:var(${cor});opacity:${(0.35 * Math.sin(Math.PI * u)).toFixed(2)}">${b.c}</text>`; }).join("");
      h += `<ellipse cx="170" cy="250" rx="${(70 * Math.max(0.25, Math.abs(k))).toFixed(1)}" ry="8" style="fill:var(--materia);opacity:.15"/>`;
      h += `<g transform="translate(170 150) scale(${k.toFixed(3)} 1)"><text x="0" y="62" text-anchor="middle" style="font:800 ${tam}px ${fonte};fill:color-mix(in srgb,var(${cor}) ${Math.round(55 + 35 * Math.abs(k))}%,var(--card));stroke:var(${cor});stroke-width:2">${letra}</text></g>`;
      g.innerHTML = h;
      if (!reduz) requestAnimationFrame(q);
    }
    requestAnimationFrame(q); F.aoSair(() => (vivo = false));
  }
  const animLetraYa = (el) => animLetra(el, "Я", "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЫЭЮ", "--mR");
  /* Alemão · Leitura: portão de Brandemburgo em traço simples, com a luz passando entre as colunas */
  function animPortao(el) {
    el.innerHTML = `<svg viewBox="0 0 340 300" aria-label="portão em traço simples"><g class="g"></g></svg>`;
    const g = el.querySelector(".g"); let vivo = true; const t0 = performance.now(), reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cols = [62, 104, 146, 194, 236, 278];
    function q(t) {
      if (!vivo) return; const s = reduz ? 1 : (t - t0) / 1000;
      let h = `<path d="M40 250H300M48 112H292M56 96H284L262 70H78Z" style="fill:none;stroke:var(--mDE);stroke-width:3;stroke-linejoin:round"/>`;
      cols.forEach((x, k) => { h += `<path d="M${x - 7} 112V250M${x + 7} 112V250" style="stroke:var(--ink2);stroke-width:2.4"/>`; if (k < 5) { const cx = (x + cols[k + 1]) / 2, a = 0.12 + 0.18 * Math.max(0, Math.sin(s * 1.4 - k * 0.7)); h += `<rect x="${cx - 12}" y="116" width="24" height="130" style="fill:var(--mDE);opacity:${a.toFixed(2)}"/>`; } });
      /* quadriga de frente (β 4.2): quatro cavalos (dois de cada lado) e a Vitória no meio, com o estandarte */
      [128, 146, 194, 212].forEach((x, k) => { const sob = 2 * Math.sin(s * 2.2 + k); h += `<path d="M${x} 70V${(52 + sob).toFixed(1)}" style="stroke:var(--mDE);stroke-width:4;stroke-linecap:round"/><circle cx="${x}" cy="${(46 + sob).toFixed(1)}" r="5.5" style="fill:var(--mDE)"/>`; });
      h += `<path d="M160 70L170 44L180 70M170 44V14M162 20H178" style="fill:none;stroke:var(--mDE);stroke-width:2.6;stroke-linejoin:round;stroke-linecap:round"/><circle cx="170" cy="9" r="5" style="fill:none;stroke:var(--mO);stroke-width:2"/>`;
      g.innerHTML = h; if (!reduz) requestAnimationFrame(q);
    }
    requestAnimationFrame(q); F.aoSair(() => (vivo = false));
  }
  /* Sânscrito · Leitura: ॐ pulsando devagar, com um anel de luz */
  function animOm(el) {
    el.innerHTML = `<svg viewBox="0 0 340 300" aria-label="sílaba om pulsando"><g class="g"></g></svg>`;
    const g = el.querySelector(".g"); let vivo = true; const t0 = performance.now(), reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function q(t) {
      if (!vivo) return; const s = reduz ? 1 : (t - t0) / 1000, p = 0.5 + 0.5 * Math.sin(s * 1.3);
      /* lótus aberto em volta do ॐ (β 4.2): pétalas saindo da base, respirando devagar */
      const pet = (ang, comp, larg) => `<path d="M0 0C${larg} ${-comp * 0.3} ${larg * 0.55} ${-comp * 0.85} 0 ${-comp}C${-larg * 0.55} ${-comp * 0.85} ${-larg} ${-comp * 0.3} 0 0Z" transform="translate(170 262) rotate(${ang})" style="fill:color-mix(in srgb,var(--mSA) 14%,transparent);stroke:var(--mSA);stroke-width:2.2;stroke-linejoin:round"/>`;
      const ab = 1 + 0.04 * p, lotus = [[-74, 150, 44], [74, 150, 44], [-40, 200, 50], [40, 200, 50], [0, 230, 54]].map(([a, c, l]) => pet(a * ab, c, l)).join("");
      g.innerHTML = `<circle cx="170" cy="150" r="${(98 + 8 * p).toFixed(1)}" style="fill:none;stroke:var(--mSA);stroke-width:2;opacity:${(0.35 + 0.4 * p).toFixed(2)}"/><circle cx="170" cy="150" r="${(118 + 14 * p).toFixed(1)}" style="fill:none;stroke:var(--mO);stroke-width:1.2;stroke-dasharray:3 9;opacity:${(0.3 + 0.3 * p).toFixed(2)}" transform="rotate(${(s * 12).toFixed(1)} 170 150)"/>${lotus}<text x="170" y="178" text-anchor="middle" style="font:700 104px ${DEVA};fill:color-mix(in srgb,var(--mSA) ${Math.round(60 + 30 * p)}%,var(--card));stroke:var(--card);stroke-width:8px;paint-order:stroke">ॐ</text>`;
      if (!reduz) requestAnimationFrame(q);
    }
    requestAnimationFrame(q); F.aoSair(() => (vivo = false));
  }
  /* desenho de cada página inicial: o nome vem do campo anim da área (AREAS) */
  F.ANIM = { atomo: animAtomo, calculo: animCalculo, pendulo: animPendulo, calculadora: animCalculadora, solido: animSolido, impares: animImpares, benzeno: animBenzeno, bequer: animBequer, matrioska: animMatrioska, letraYa: animLetraYa, letraEszett: (el) => animLetra(el, "ß", "ÄÖÜẞABCDEFGHIJKLMNOPRSTUVWZ", "--mDE"), letraSam: (el) => animLetra(el, "सं", "अआइईउऊऋएऐओऔकखगघचजटडतदनपबमयरलवशसह", "--mSA", DEVA, 150), portao: animPortao, om: animOm };
  const J_SEGREDO = (F._seg = F._seg || {});

  function pgSumario(el) {
    el.innerHTML = `<div class="cab-tema"><div class="sobre">Mapa</div><h1>Sumário em árvore</h1><p style="color:var(--ink2)">Temas já escritos têm link para a teoria e para os exercícios.</p></div>` +
      CATALOGO.filter((m) => areaDe(m) === F.area).map((m) => `<h3 style="margin:24px 0 8px;color:var(${m.cor})">${m.letra} · ${m.nome}</h3><pre style="font:14px/1.7 var(--f-text);margin:0;white-space:pre-wrap">${m.temas.map((t) => t[3]
        ? `● <a href="${F.href(t[0], m)}">${t[0]} ${t[1]}</a>\n |___> <a href="${F.href(t[0], m, "teoria")}">teoria</a>  <a href="${F.href(t[0], m, "exercicios")}">[exercícios]</a>`
        : `<span style="color:var(--ink3)">○ ${t[0]} ${t[1]}</span> <span class="breve-tag" style="margin-left:4px">em breve</span>`).join("\n")}</pre>`).join("");
  }

  /* ---------- tema ---------- */
  F.registrar = (cod, def) => { F.temas = F.temas || {}; F.temas[cod] = def; if (pendente === cod) { pendente = null; rota(); } };
  let pendente = null;
  /* física: temas/<COD>.js com F.registrar("COD", …); outras matérias: temas/<matéria>/<COD>.js com F.registrar("<matéria>/COD", …) */
  function carregaTema(info) {
    const k = info.chave, arq = info.mat === "fisica" ? `temas/${info.cod}.js` : `temas/${info.mat}/${info.cod}.js`;
    if (F.temas && F.temas[k]) return true;
    pendente = k;
    const s = document.createElement("script");
    s.src = arq;
    s.onerror = () => { $("#pagina").innerHTML = `<p>Não achei o arquivo <code>${arq}</code>.</p>`; };
    document.body.appendChild(s);
    return false;
  }
  function pgTema(el, info, ancora) {
    const def = F.temas[info.chave];
    temaAtual = info.cod; exercicios = []; fila = [];
    document.documentElement.style.setProperty("--mod", `var(${info.mod.cor})`);
    const corpo = def.html(F);
    el.innerHTML = `<div class="cab-tema"><div class="sobre"><span>${info.mod.letra} · ${info.mod.nome}</span></div>
      <h1>${info.cod} · ${info.nome}</h1><div class="marcas">${F.selos(info.marcas)}${(def.retoma || []).map(F.ret).join("")}</div>
      <nav class="indice" id="indice"></nav></div>${corpo}
      <div class="fim"><div><b>Terminou o tema?</b><div style="color:var(--ink2);font-size:14px">Marca como feito e a bolinha do menu fica verde.</div></div><span class="esp"></span><button class="bt pri" id="bt-feito"></button></div>`;
    $("#indice").innerHTML = $$(".secao", el).map((s) => `<a href="${F.href(info.cod, info.mat, s.id)}">${s.querySelector("h2").textContent.replace(/^\d+/, "")}</a>`).join("");
    const bf = $("#bt-feito");
    const pinta = () => { bf.textContent = feitos()[info.cod] ? "✓ Feito (desmarcar)" : "Marcar como feito"; };
    bf.addEventListener("click", () => { const f = feitos(); if (f[info.cod]) delete f[info.cod]; else f[info.cod] = Date.now(); F.store.set("feitos", f); pinta(); pintaMenu(); });
    pinta();
    F.math(el);
    folhaDeFormulas(el, info);
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
  function folhaDeFormulas(el, info) {
    const fs = $$(".formula", el).filter((f) => !f.closest(".lab, .exemplo, .ex, .chefao, .rev-painel"));
    if (fs.length < 2 || el.querySelector("#resumo")) return; /* temas que já têm "Resumo" escrito à mão não precisam */
    const sec = document.createElement("section");
    sec.className = "secao folha"; sec.id = "formulas";
    sec.innerHTML = `<h2>Folha de fórmulas</h2><p class="folha-sub">As fórmulas em destaque deste tema, juntas, para revisar antes dos exercícios.</p><div class="folha-grade"></div>`;
    const grade = sec.querySelector(".folha-grade");
    fs.forEach((f) => { const c = f.cloneNode(true); c.removeAttribute("id"); grade.appendChild(c); });
    const alvo = el.querySelector("#desafios, #exercicios") || el.querySelector(".fim");
    alvo.parentNode.insertBefore(sec, alvo);
    const ind = $("#indice"); if (ind) { const a = document.createElement("a"); a.href = F.href(info.cod, info.mat, "formulas"); a.textContent = "Folha de fórmulas"; const ref = ind.querySelector(`a[href$="/desafios"], a[href$="/exercicios"]`); ind.insertBefore(a, ref); }
  }

  /* ---------- rotas ---------- */
  let paradas = [], renderizado = null;
  F.aoSair = (fn) => paradas.push(fn); // simulações registram como parar a animação
  function rota() {
    {
      const h0 = (location.hash || "#/home").slice(2).split("/"), ns = !!(h0[1] && window.MATERIAS && MATERIAS.some((m) => m.id === h0[0] && m.id !== "fisica")), b0 = ns ? h0[0] + "/" + h0[1] : h0[0], a0 = ns ? h0[2] : h0[1];
      if (b0 === renderizado && a0 && achaAncora(a0)) { achaAncora(a0).scrollIntoView(); return; }
    }
    paradas.forEach((fn) => { try { fn(); } catch (e) {} }); paradas = [];
    gaveta(false);
    const h = (location.hash || "#/home").slice(2).split("/");
    const pag = $("#pagina");
    let cod = h[0] || "home", anc = h[1], mid = "fisica";
    renderizado = null;
    temaAtual = null;
    document.documentElement.style.removeProperty("--mod");
    /* tela inicial do projeto e matérias registradas em assets/materias.js (docs/MODELO_DE_DADOS.md) */
    const J = window.JARVIS, mat = J ? J.materia(cod) : null;
    document.body.classList.toggle("modo-home", !!J && (cod === "home" || cod === "codigos" || (!!mat && !mat.pronta)));
    if (J && cod === "codigos" && J.codigos) { J.codigos(pag); window.scrollTo(0, 0); return; } /* β 4.1: página de códigos de acesso */
    if (J && cod === "home") { J.home(pag); window.scrollTo(0, 0); return; }
    if (mat && !mat.pronta) { J.emBreve(pag, mat); window.scrollTo(0, 0); return; }
    if (mat && mat.pronta && (!h[1] || h[1] === "inicio") && mat.rota !== "#/" + (h[1] ? cod + "/" + h[1] : cod)) { location.replace(mat.rota); return; } /* só o id da matéria: #/fisica → #/inicio; link antigo #/quimica/inicio → #/quimica */
    if (mat && mat.id === "fisica" && h[1] && h[1] !== "inicio") { location.replace("#/" + h.slice(1).join("/")); return; } /* #/fisica/A01 → #/A01 */
    if (mat && mat.id !== "fisica" && h[1]) { mid = mat.id; cod = h[1]; anc = h[2]; } /* tema de outra matéria: #/quimica/A01[/âncora] */
    if (mid === "fisica" && cod === "calculo") { location.replace("#/matematica-calculo"); return; } /* β 4.0: a aba Cálculo foi para a matemática */
    if (mid === "fisica" && CALCULO.has(cod)) { location.replace("#/matematica/" + cod + (anc ? "/" + anc : "")); return; } /* link antigo #/CI07 → #/matematica/CI07 */
    const arIni = mid === "fisica" ? AREAS.find((a) => a.inicio === cod) : null;
    /* β 4.1: acesso por código. Página de matéria ou aba trancada → "sem acesso" (com o caminho para os códigos) */
    if (window.ACESSO && J && J.bloqueado) {
      const infoAc = arIni ? null : cod === "sumario" || cod === "legenda" ? null : F.achar(cod, mid), aid = arIni ? arIni.id : infoAc ? areaDe(infoAc.mod) : cod === "sumario" ? F.area : null;
      if (aid && !ACESSO.area(aid)) { const ar = AREA(aid), m = (window.MATERIAS || []).find((x) => x.id === (ar.materia || "fisica")); document.body.classList.add("modo-home"); J.bloqueado(pag, m ? m.nome : ar.titulo); window.scrollTo(0, 0); return; }
    }
    if (arIni) { F.area = arIni.id; pgInicio(pag, F.area); }
    else if (cod === "legenda") { location.replace("#/" + AREA(F.area).inicio); setTimeout(() => { const d = $("#detalhes"); if (d) d.classList.add("aberto"); }, 50); return; } /* a legenda agora fica só no painel do topo */
    else if (cod === "sumario") pgSumario(pag);
    else {
      const info = F.achar(cod, mid);
      if (info) F.area = areaDe(info.mod); /* antes de desenhar: o progresso é lido com o prefixo da matéria */
      if (!info && mid === "fisica" && RENOMEADOS[cod]) { location.replace("#/" + RENOMEADOS[cod] + (anc ? "/" + anc : "")); return; } /* link antigo (ex.: #/B12) */
      if (!info) pag.innerHTML = `<p>Tema ${cod} não existe.</p>`;
      else if (!info.pronto) pag.innerHTML = `<div class="cab-tema"><div class="sobre" style="color:var(${info.mod.cor})">${info.mod.letra} · ${info.mod.nome}</div><h1>${info.cod} · ${info.nome}</h1></div><p style="color:var(--ink2)">Este tema ainda não foi escrito.</p>`;
      else if (carregaTema(info)) { pgTema(pag, info, anc); renderizado = info.chave; }
      else pag.innerHTML = `<p style="color:var(--ink2)">Carregando…</p>`;
      if (info) temaAtual = info.cod;
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
      const tudo = F.store.tudo(), outros = F.PREFIXOS().filter((x) => x !== PFX); /* + tela inicial (jarvis:) e as outras matérias (mat:, qui:, rus:) */
      try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (outros.some((x) => k.startsWith(x))) tudo[k] = localStorage.getItem(k); } } catch (e) {}
      const blob = new Blob([JSON.stringify(tudo, null, 1)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "progresso-fisica-" + new Date().toISOString().slice(0, 10) + ".json"; a.click();
    });
    $("#bt-imp").addEventListener("click", () => $("#arq-imp").click());
    $("#arq-imp").addEventListener("change", async (ev) => {
      const f = ev.target.files[0]; if (!f) return;
      try {
        let o = JSON.parse(await f.text());
        const outros = F.PREFIXOS().filter((x) => x !== PFX);
        if (!o || typeof o !== "object" || !Object.keys(o).some((k) => k.startsWith(PFX) || outros.some((x) => k.startsWith(x)))) throw new Error("formato");
        const jv = {}; Object.keys(o).forEach((k) => { if (outros.some((x) => k.startsWith(x))) { jv[k] = o[k]; delete o[k]; } }); /* tela inicial e outras matérias: fora da migração de códigos da física */
        if (Object.keys(o).some((k) => k.startsWith(PFX)) && +(o[PFX + "codigos"] || 1) < VERSAO_CODIGOS) o = F.migraDados(o); /* backup feito antes da troca de códigos */
        Object.entries(jv).forEach(([k, v]) => localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v)));
        Object.entries(o).forEach(([k, v]) => {
          if (!k.startsWith(PFX)) return;
          v = typeof v === "string" ? v : JSON.stringify(v);
          if (k === PFX + "feitos") { try { v = JSON.stringify(Object.assign(JSON.parse(localStorage.getItem(k) || "{}"), JSON.parse(v))); } catch (e) {} } /* soma, não apaga o que já estava feito */
          localStorage.setItem(k, v);
        });
        F.migraCalculo(true); /* backup feito antes da mudança do Cálculo: o progresso desses temas também vai para a matemática */
        alert("Progresso importado."); location.reload();
      }
      catch (e) { alert("Não consegui ler esse arquivo. Ele precisa ser o .json exportado por este site."); }
    });
  }

  document.addEventListener("DOMContentLoaded", () => { const v = document.getElementById("versao"); if (v) v.textContent = "Jarvis " + VERSAO; tema(); montaMenu(); montaGaveta(); topo(); backup(); if (window.montaDetalhes) montaDetalhes(F); window.addEventListener("hashchange", rota); rota(); });
})();
