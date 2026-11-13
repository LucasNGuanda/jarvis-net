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

  /* ---------- números em português ---------- */
  // F.t(9.1234, 2) -> "9,12" (texto)   F.m(...) -> "9{,}12" (dentro de $...$)
  F.t = (v, d = 2) => { if (!isFinite(v)) return "—"; let s = (+v).toFixed(d); if (/^-0[.,]?0*$/.test(s)) s = s.slice(1); return s.replace("-", "−").replace(".", ","); };
  F.m = (v, d = 2) => F.t(v, d).replace(",", "{,}").replace("−", "-");
  // algarismos significativos, com notação científica quando precisa: F.sig(0.000123,2) -> "1,2 × 10⁻⁴" (texto)
  F.sigM = (v, n = 3) => {
    if (v === 0) return "0";
    const e = Math.floor(Math.log10(Math.abs(v)));
    if (e >= -2 && e <= 4) return F.m(v, Math.max(0, n - 1 - e));
    const mant = v / Math.pow(10, e);
    return F.m(mant, n - 1) + "\\times 10^{" + e + "}";
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
  };

  /* ---------- fila de montagem dos componentes ---------- */
  let fila = [], uid = 0;
  F.id = (p = "c") => p + "-" + (++uid);
  F.depois = (fn) => fila.push(fn);
  F.gf = (cls = "") => `<span class="gf ${cls}" role="img" aria-label="gam fresco"></span>`;
  /* glifo do gam fresco dentro de SVG: canto superior esquerdo em (x, y), altura h */
  F.gfSvg = (x, y, h, cor = "currentColor") => `<g transform="translate(${x},${y}) scale(${h / 60})" style="fill:none;stroke:${cor};stroke-width:3.8;stroke-linecap:round;stroke-linejoin:round"><path d="M5 17 C9 14 13 16 16.5 22"/><path d="M16.5 22 L32 8"/><path d="M28.5 4.5 L35 11"/><path d="M16.5 22 C16.5 32 14.5 40 14.5 47 C14.5 55 20 57 24 51"/></g>`;

  /* ---------- blocos de HTML ---------- */
  F.secao = (id, titulo, html, n) => `<section class="secao" id="${id}"><h2>${n ? `<span class="n">${n}</span>` : ""}${titulo}</h2>${html}</section>`;
  F.formula = (tex, rot) => `<div class="formula">${rot ? `<div class="rot">${rot}</div>` : ""}$$${tex}$$</div>`;
  const CX = { fisico: "🧠 Pense como físico", pegadinha: "⚠️ Pegadinha", olimpiada: "🏅 Nível olimpíada", ponte: "🌉 Ponte para a universidade", ideia: "💡 Ideia", demo: "" };
  F.caixa = (tipo, html, titulo) => `<div class="caixa ${tipo}"><div class="cab">${titulo || CX[tipo]}</div>${html}</div>`;
  F.demo = (titulo, html) => `<div class="caixa demo"><div class="cab">${titulo ? "&nbsp;· " + titulo : ""}</div>${html}<span class="qed">∎</span><div style="clear:both"></div></div>`;
  F.fig = (svg, leg) => `<figure class="fig" style="margin:14px 0">${svg}${leg ? `<figcaption>${leg}</figcaption>` : ""}</figure>`;
  F.ret = (cod) => { const t = F.achar(cod); return `<a class="selo ret" href="#/${cod}" title="retoma ${t ? t.nome : cod}">[${cod}]←</a>`; };
  F.selos = (arr = []) => arr.map((m) => `<span class="selo" title="${LEG[m] || ""}">${m}</span>`).join("");
  const LEG = { "★": "cai muito em OBF/ITA", "!": "difícil", "!!": "muito difícil", "?": "confuso, não bobear", "∫": "exige cálculo", ITA: "cobrado no ITA", RU: "aparece em olimpíada russa" };
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
    return `<div class="chute" id="${id}"><div class="q">🎯 Chuta antes de ver: ${cfg.q}</div><div class="ops">${cfg.ops.map((o, i) => `<button class="bt op" data-i="${i}">${String.fromCharCode(65 + i)}) ${o}</button>`).join("")}</div><div class="exp">${cfg.exp}</div></div>`;
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
      <div class="bts" style="margin-top:12px"><button class="bt pri" data-a="prox">Começar</button><button class="bt" data-a="tudo">Mostrar tudo</button><button class="bt" data-a="par">🎲 Me dá um parecido</button></div>
    </div>`;
  };

  /* exercício estático: {n, nivel, marcas, enun, fig, alts?, dicas:[..], resp, sol} */
  let temaAtual = null, exercicios = [];
  F.exercicio = (e) => {
    const chave = `marca:${temaAtual}-${e.n}`;
    exercicios.push(chave);
    const id = F.id("ex");
    F.depois(() => {
      const el = document.getElementById(id);
      const bs = $$(".certeza button", el);
      const pinta = () => { const v = F.store.get(chave, ""); bs.forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === v)); };
      bs.forEach((b) => b.addEventListener("click", () => { const v = F.store.get(chave, ""); F.store.set(chave, v === b.dataset.m ? "" : b.dataset.m); pinta(); F.evento("marca"); }));
      pinta();
    });
    const alts = e.alts ? `<ol class="alts">${e.alts.map((a, i) => `<li><b>${String.fromCharCode(65 + i)})</b>${a}</li>`).join("")}</ol>` : "";
    const dicas = (e.dicas || []).map((d, i) => `<details><summary>Dica ${i + 1}</summary><div class="corpo">${d}</div></details>`).join("");
    return `<div class="ex" id="${id}">
      <div class="ex-cab"><span class="num">${temaAtual}.${String(e.n).padStart(2, "0")}</span><span class="marcas">${F.selos(e.marcas)}</span>
        <span class="certeza" title="● certeza · X dúvida · / chutei">sua marcação <button data-m="●">●</button><button data-m="X">X</button><button data-m="/">/</button></span></div>
      <div>${e.enun}</div>${e.fig ? F.fig(e.fig) : ""}${alts}
      <div class="revela">${dicas}<details class="resp"><summary>Mostrar resposta e resolução</summary><div class="corpo"><p><b>Resposta:</b> ${e.resp}</p>${e.sol}</div></details></div>
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
      <div class="cab"><span class="cv">💀</span><div><small>Chefão · Impossível 99</small><h3>${c.titulo}</h3></div></div>
      <div class="tranca"><p>🔒 Trancado. Ele destrava quando você marcar ● X ou / em todos os exercícios do tema (<span class="falta"></span>).</p>
        <button class="bt peq" data-a="forca">Já fiz os exercícios no caderno: destravar</button></div>
      <div class="conteudo">${c.enun}${c.fig ? F.fig(c.fig) : ""}
        <div class="revela">${c.dicas.map((d, i) => `<details><summary>Dica ${i + 1}</summary><div class="corpo">${d}</div></details>`).join("")}
        <details class="resp"><summary>Mostrar solução completa (tem certeza?)</summary><div class="corpo">${c.sol}</div></details></div>
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
    menu.innerHTML = CATALOGO.map((m) => `<div class="mod ${abertos.includes(m.id) ? "aberto" : ""}" data-mod="${m.id}" data-area="${areaDe(m)}" style="--c:var(${m.cor})">
      <button><span class="letra">${m.letra}</span><span>${m.nome}</span><span class="seta">›</span></button>
      <ul>${m.temas.map((t) => `<li><a href="#/${t[0]}" data-cod="${t[0]}" class="${t[3] ? "" : "breve"}" title="${t[3] ? "" : "ainda não feito"}"><span class="cod">${t[0]}</span><span>${t[1]}</span><span class="bola"></span></a></li>`).join("")}</ul></div>`).join("");
    $$(".mod>button", menu).forEach((b) => b.addEventListener("click", () => {
      const m = b.parentElement; m.classList.toggle("aberto");
      F.store.set("menuAbertos", $$(".mod.aberto", menu).map((x) => x.dataset.mod));
    }));
    $("#busca").addEventListener("input", (ev) => {
      const q = ev.target.value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
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
    $(".topo nav:not(.abas) a").setAttribute("href", "#/" + ar.inicio);
    $$("#menu-mods a[data-cod]").forEach((a) => {
      a.querySelector(".bola").classList.toggle("feito", !!f[a.dataset.cod]);
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
    el.innerHTML = `<div class="hero2"><h1>${ar.titulo}</h1><div class="anim" id="${anim}"></div></div>
      <div class="cartao"><div class="tit"><span class="tag">Progresso</span>${nfeitos} de ${total} temas feitos · ${prontos} já escritos</div>
        <div class="barra" style="--c:var(--ok)"><i style="width:${total ? (100 * nfeitos) / total : 0}%"></i></div></div>
      <h2 style="margin-top:32px">Módulos</h2>
      <div class="mods">${mods.map((m) => { const n = m.temas.length, k = m.temas.filter((t) => f[t[0]]).length; const prim = m.temas.find((t) => t[3]) || m.temas[0];
        return `<a class="modc" href="#/${prim[0]}" style="--c:var(${m.cor})"><div class="letra">${m.letra}</div><h3>${m.nome}</h3><p>${m.desc}</p><div class="barra"><i style="width:${(100 * k) / n}%"></i></div><p style="margin-top:6px">${k}/${n} temas</p></a>`; }).join("")}</div>
      <h2 style="margin-top:36px">Como usar</h2>
      <div class="grade2" style="margin-top:12px">
        <div class="cartao"><b>Ordem de um tema</b><ol style="margin:8px 0 0;padding-left:1.2em;color:var(--ink2)"><li>Pergunta de abertura</li><li>Laboratório (chute antes de mexer)</li><li>A ideia, com números</li><li>Teoria completa e demonstrações</li><li>Exemplos passo a passo</li><li>Resumo, exercícios e chefão</li></ol></div>
        <div class="cartao"><b>Marcação de certeza</b><p style="color:var(--ink2);margin:8px 0 0">Em cada exercício marque <b>●</b> certeza, <b>X</b> dúvida ou <b>/</b> chutei. Fica salvo neste navegador. O chefão destrava quando todos estiverem marcados. Dicas e respostas só abrem se você clicar.</p></div>
      </div>`;
    (areaId === "calculo" ? animCalculo : areaId === "exp" ? animPendulo : animAtomo)(document.getElementById(anim));
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

  /* cálculo: somas de Riemann convergindo para a integral + reta tangente passeando pela curva */
  function animCalculo(el) {
    el.innerHTML = `<svg viewBox="0 0 340 280" aria-label="somas de Riemann e reta tangente"><g class="g"></g></svg><div class="calc-leg"></div>`;
    const f = (x) => 1.1 + 0.8 * Math.sin(1.25 * x) + 0.22 * x, df = (x) => 1.0 * Math.cos(1.25 * x) + 0.22;
    const a = 0.2, b = 4.6, x0 = 26, y0 = 250, sx = (x) => x0 + (x / 4.8) * 300, sy = (y) => y0 - (y / 2.9) * 225;
    let I = 0; const NN = 2000;
    for (let k = 0; k < NN; k++) { const x = a + ((k + 0.5) * (b - a)) / NN; I += f(x) * ((b - a) / NN); }
    let curva = "";
    for (let k = 0; k <= 160; k++) { const x = (4.8 * k) / 160; curva += (k ? "L" : "M") + sx(x).toFixed(1) + " " + sy(f(x)).toFixed(1); }
    const ns = [2, 4, 8, 16, 32, 64];
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
        const xl = a + k * h, y = f(xl + h / 2); soma += y * h;
        ret += `<rect x="${sx(xl).toFixed(1)}" y="${sy(y).toFixed(1)}" width="${(sx(xl + h) - sx(xl)).toFixed(2)}" height="${(y0 - sy(y)).toFixed(1)}" style="fill:color-mix(in srgb,var(--mK1) 28%,transparent);stroke:var(--mK1);stroke-width:${n > 32 ? 0.4 : 1}"/>`;
      }
      const xt = a + (b - a) * (0.5 + 0.5 * Math.sin(s * 0.7)), yt = f(xt), m = df(xt), dx = 0.75;
      g.innerHTML = `<defs><clipPath id="clipcalc"><rect x="${x0}" y="10" width="305" height="${y0 - 10}"/></clipPath></defs>` + ret + `<line x1="${x0}" y1="${y0}" x2="${x0 + 305}" y2="${y0}" style="stroke:var(--ink2);stroke-width:1.4"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="18" style="stroke:var(--ink2);stroke-width:1.4"/>
        <path d="${curva}" style="fill:none;stroke:var(--ink);stroke-width:2.4"/>
        <line x1="${sx(xt - dx)}" y1="${sy(yt - m * dx)}" x2="${sx(xt + dx)}" y2="${sy(yt + m * dx)}" clip-path="url(#clipcalc)" style="stroke:var(--mK2);stroke-width:2.6;stroke-linecap:round"/>
        <circle cx="${sx(xt)}" cy="${sy(yt)}" r="5.5" style="fill:var(--mK2);stroke:var(--bg);stroke-width:2"/>
        <text x="${x0 + 8}" y="30" class="tx2">n = ${n} retângulos</text>`;
      leg.innerHTML = `soma = ${F.t(soma, 3)} → ∫ = ${F.t(I, 3)} &nbsp;·&nbsp; inclinação f′ = ${F.t(m, 2)}`;
      if (!reduz) requestAnimationFrame(q);
    }
    requestAnimationFrame(q);
    F.aoSair(() => (vivo = false));
  }

  function pgLegenda(el) {
    el.innerHTML = `<div class="cab-tema"><div class="sobre">Referência</div><h1>Legenda das marcações</h1></div>
      <table class="tb"><tr><th>Marca</th><th>Significado</th></tr>
      <tr><td><span class="selo ret">[n]←</span></td><td>retoma o tema n (clique para ir até ele)</td></tr>
      ${Object.entries(LEG).map(([k, v]) => `<tr><td><span class="selo">${k}</span></td><td>${v}</td></tr>`).join("")}
      <tr><td><b>●</b> · <b>X</b> · <b>/</b></td><td>sua marcação nos exercícios: certeza · dúvida · chutei</td></tr>
      <tr><td>💀</td><td>Chefão Impossível 99: nível máximo, destrava depois dos exercícios</td></tr></table>
      <h3 style="margin-top:28px">Caixas</h3>
      ${F.caixa("fisico", "<p>Aproximações, análise dimensional, casos limite.</p>")}
      ${F.caixa("pegadinha", "<p>Erros clássicos de prova.</p>")}
      ${F.caixa("olimpiada", "<p>Truques de OBF, ITA e olimpíadas russas.</p>")}
      ${F.caixa("ponte", "<p>Onde aquilo reaparece na universidade.</p>")}`;
  }
  function pgSumario(el) {
    el.innerHTML = `<div class="cab-tema"><div class="sobre">Mapa</div><h1>Sumário em árvore</h1><p style="color:var(--ink2)">Temas já escritos têm link para a teoria e para os exercícios.</p></div>` +
      CATALOGO.filter((m) => areaDe(m) === F.area).map((m) => `<h3 style="margin:24px 0 8px;color:var(${m.cor})">${m.letra} · ${m.nome}</h3><pre style="font:14px/1.7 var(--f-text);margin:0;white-space:pre-wrap">${m.temas.map((t) => t[3]
        ? `● <a href="#/${t[0]}">${t[0]} ${t[1]}</a>\n |___> <a href="#/${t[0]}/teoria">teoria</a>  <a href="#/${t[0]}/exercicios">[exercícios]</a>`
        : `<span style="color:var(--ink3)">○ ${t[0]} ${t[1]}</span>`).join("\n")}</pre>`).join("");
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
    const q = fila; fila = []; q.forEach((fn) => fn());
    if (def.montar) def.montar(F, el);
    if (ancora) { const a = document.getElementById(ancora); if (a) setTimeout(() => a.scrollIntoView(), 30); }
  }

  /* ---------- rotas ---------- */
  let paradas = [], renderizado = null;
  F.aoSair = (fn) => paradas.push(fn); // simulações registram como parar a animação
  function rota() {
    {
      const h0 = (location.hash || "#/inicio").slice(2).split("/");
      if (h0[0] === renderizado && h0[1] && document.getElementById(h0[1])) { document.getElementById(h0[1]).scrollIntoView(); return; }
    }
    paradas.forEach((fn) => { try { fn(); } catch (e) {} }); paradas = [];
    const h = (location.hash || "#/inicio").slice(2).split("/");
    const pag = $("#pagina");
    const cod = h[0] || "inicio", anc = h[1];
    renderizado = null;
    temaAtual = null;
    document.documentElement.style.removeProperty("--mod");
    if (cod === "inicio" || cod === "calculo" || cod === "experimentos") { F.area = cod === "calculo" ? "calculo" : cod === "experimentos" ? "exp" : "fisica"; pgInicio(pag, F.area); }
    else if (cod === "legenda") pgLegenda(pag);
    else if (cod === "sumario") pgSumario(pag);
    else {
      const info = F.achar(cod);
      if (!info) pag.innerHTML = `<p>Tema ${cod} não existe.</p>`;
      else if (!info.pronto) pag.innerHTML = `<div class="cab-tema"><div class="sobre" style="color:var(${info.mod.cor})">${info.mod.letra} · ${info.mod.nome}</div><h1>${info.cod} · ${info.nome}</h1></div><p style="color:var(--ink2)">Este tema ainda não foi escrito.</p>`;
      else if (carregaTema(cod)) { pgTema(pag, info, anc); renderizado = cod; }
      else pag.innerHTML = `<p style="color:var(--ink2)">Carregando…</p>`;
      if (info) { temaAtual = info.cod; F.area = areaDe(info.mod); }
    }
    pintaMenu();
    if (!anc) window.scrollTo(0, 0);
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

  /* ---------- tema claro/escuro ---------- */
  function tema() {
    const set = (v) => { if (v === "claro") document.documentElement.setAttribute("data-tema", "claro"); else document.documentElement.removeAttribute("data-tema"); };
    set(F.store.get("tema", "escuro"));
    $("#bt-tema").addEventListener("click", () => { const v = F.store.get("tema", "escuro") === "escuro" ? "claro" : "escuro"; F.store.set("tema", v); set(v); F.evento("tema"); });
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
      try { const o = JSON.parse(await f.text()); Object.entries(o).forEach(([k, v]) => { if (k.startsWith(PFX)) localStorage.setItem(k, v); }); alert("Progresso importado."); location.reload(); }
      catch (e) { alert("Não consegui ler esse arquivo. Ele precisa ser o .json exportado por este site."); }
    });
  }

  document.addEventListener("DOMContentLoaded", () => { const v = document.getElementById("versao"); if (v) v.textContent = "Site Física " + VERSAO; tema(); montaMenu(); topo(); backup(); if (window.montaDetalhes) montaDetalhes(F); window.addEventListener("hashchange", rota); rota(); });
})();
