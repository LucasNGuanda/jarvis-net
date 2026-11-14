/* ==========================================================
   Calculadora 2 do site (β 2.7): no estilo da Casio fx-82LA CW (ClassWiz), a que o Lucas usa.
   Teclas na mesma ordem da calculadora; SHIFT (azul) dá as funções escritas em cima.
   Apps (tecla HOME): Calcular, Estatística (1-Variável e y=a+bx), Tabela (f(x) e g(x)) e Caixa Matemática (dados e moeda).
   Teclas de sistema: CONFIG, VARIABLE, FUNCTION, CATALOG, TOOLS, FORMAT, ↶ (voltar), OK e o "rolar página" (⇑⇓).
   As contas usam o mesmo motor da calculadora 1 (calc.js), com estado próprio.
   Só uma calculadora fica ligada por vez (Configurações → Calculadora).
   ========================================================== */
(function () {
  "use strict";
  const M = window.CALC && window.CALC.motor;
  if (!M) return;
  const CALC2 = (window.CALC2 = {});
  const { Erro, T, FN, POST } = M;
  const ERR = (t) => { throw new Erro(t); };
  const esc = (x) => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;");

  /* estado do motor (o que o calc.js lê em "st") */
  const s2 = { modo: "COMP", cfg: { io: "Math", ang: "D", fmt: { t: "Norm", n: 1 }, frac: "d/c", cx: "a+bi" }, vars: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, X: 0, Y: 0, Z: 0, M: 0 },
    ans: 0, ins: false, hyp: false, forma: null, stat: { tipo: "1VAR", x: [], y: [], cur: { r: 0, c: 0 } }, funcoes: { f: [], g: [] }, mats: {}, vcts: {} };
  const roda = (fn) => M.comEstado(s2, fn);
  /* estado da interface */
  const u = { ligada: true, tela: "home", homeSel: 0, shift: false, io: "MM", virgula: true, ed: M.novoEd(), res: null, hist: [], hpos: -1, menu: null, erro: null, msg: null,
    est: { r: 0, c: 0, buf: M.novoEd(), linhas: null, sel: 0 }, tab: { lin: 0, ini: 1, fim: 5, passo: 1, rows: [], sel: 0, prompt: null, buf: M.novoEd(), edF: null, edG: null },
    cx: { tipo: "dado", n: 1, tent: 10, prompt: null, buf: M.novoEd(), res: null, sel: 0 }, fdef: null };
  CALC2.s2 = s2; CALC2.u = u;
  const APPS = [["calc", "Calcular"], ["est", "Estatística"], ["tab", "Tabela"], ["caixa", "Caixa Matem."]];

  /* ---------------- números no visor ---------------- */
  const virg = (h) => (u.virgula ? h.replace(/(\d)\.(\d)/g, "$1,$2") : h);
  const fmt = (x) => (typeof x !== "number" || !isFinite(x) ? "ERRO" : virg(roda(() => M.formata(x))));
  const tex = (sx) => { try { return window.katex ? katex.renderToString(sx, { throwOnError: false }) : esc(sx); } catch (e) { return esc(sx); } };
  const fracTex = (p, q) => (q === 1 ? String(p) : `${p < 0 ? "-" : ""}\\frac{${Math.abs(p)}}{${q}}`);
  function sexagesimal(x) { const sg = x < 0 ? "−" : ""; x = Math.abs(x); let d = Math.floor(x), m = Math.floor((x - d) * 60), s = +(((x - d) * 60 - m) * 60).toFixed(2); if (s >= 60) { s -= 60; m++; } if (m >= 60) { m -= 60; d++; } return virg(`${sg}${d}°${m}′${s}″`); }
  function primos(n) { if (!Number.isInteger(n) || Math.abs(n) < 2 || Math.abs(n) > 1e10) return null; const f = []; let m = Math.abs(n); for (let p = 2; p * p <= m; p++) { let k = 0; while (m % p === 0) { m /= p; k++; } if (k) f.push(k > 1 ? `${p}^{${k}}` : `${p}`); } if (m > 1) f.push(String(m)); return (n < 0 ? "-" : "") + f.join("\\times "); }
  CALC2._primos = primos;
  /* mostra um resultado no formato pedido (FORMAT) */
  function mostra(r) {
    if (r.bool !== undefined) return r.bool ? "Verdadeiro" : "Falso";
    if (r.par) return r.par.map(([k, x]) => `<div><span class="rot">${k}=</span>${fmt(x)}</div>`).join("");
    const v = r.v, f = r.fmt;
    if (r.simp) return tex(fracTex(r.simp[0], r.simp[1])) + (r.simp[2] ? `<div class="rot">F=${r.simp[2]}</div>` : "");
    if (f === "dec") return fmt(v);
    if (f === "eng") return virg(roda(() => M.formata(v, r.eng || 0)));
    if (f === "sexa") return sexagesimal(v);
    if (f === "primos") { const p = primos(v); return p ? tex(p) : fmt(v); }
    if (f === "imp" || f === "mista") { const q = M.fracao(v); if (!q || q[1] === 1) return fmt(v); if (f === "imp" || Math.abs(q[0]) < q[1]) return tex(fracTex(q[0], q[1])); const i = Math.trunc(q[0] / q[1]), rr = Math.abs(q[0] % q[1]); return tex(`${i}\\,\\frac{${rr}}{${q[1]}}`); }
    /* padrão: depende de Entrada/Saída */
    if (u.io === "MM" && !r.dicas.semExato) { const e = M.exato(v, r.dicas); if (e) return tex(e); }
    if (u.io === "LL") { const q = M.fracao(v); if (q && q[1] > 1 && Math.abs(q[0]) < 1e10) return `${q[0]}⌟${q[1]}`.replace("-", "−"); }
    return fmt(v);
  }

  /* ---------------- editor "de livro" ---------------- */
  function rend(lista, cur, ativo, linear) {
    const temCur = ativo && cur && cur.L === lista, cursor = `<span class="cur${s2.ins ? " ins" : ""}"></span>`;
    let h = "";
    lista.forEach((it, i) => {
      if (temCur && cur.i === i) h += cursor;
      if (it.k === "tpl") h += molde(it, cur, ativo, linear);
      else { const t = it.k === "dig" && it.s === "." ? (u.virgula ? "," : ".") : it.s; h += `<span class="tk${it.k === "var" ? " vr" : ""}">${esc(t)}</span>`; }
    });
    if (temCur && cur.i >= lista.length) h += cursor;
    return lista._tpl && !lista.length && !linear ? `<span class="t-vazio">${h}</span>` : h;
  }
  function molde(t, cur, at, lin) {
    const r = (k) => `<span class="t-slot">${rend(t.slots[k], cur, at, lin)}</span>`;
    if (lin) switch (t.t) {
      case "frac": return `${r(0)}⌟${r(1)}`; case "mista": return `${r(0)}⌟${r(1)}⌟${r(2)}`; case "sqrt": return `√(${r(0)})`; case "root": return `${r(0)}ˣ√(${r(1)})`;
      case "pow": return `^(${r(0)})`; case "logab": return `log(${r(0)};${r(1)})`; case "e10": return `×10^(${r(0)})`;
    }
    const fr = (a, b) => `<span class="t-frac"><span class="t-num">${a}</span><span class="t-den">${b}</span></span>`;
    switch (t.t) {
      case "frac": return fr(r(0), r(1));
      case "mista": return r(0) + fr(r(1), r(2));
      case "sqrt": return `<span class="t-raiz"><span class="t-rs">√</span><span class="t-sob">${r(0)}</span></span>`;
      case "root": return `<span class="t-raiz"><sup class="t-ind">${r(0)}</sup><span class="t-rs">√</span><span class="t-sob">${r(1)}</span></span>`;
      case "pow": return `<sup class="t-sup">${r(0)}</sup>`;
      case "logab": return `log<sub class="t-sub">${r(0)}</sub>(${r(1)})`;
      case "e10": return `<span class="x10">×10</span><sup class="t-sup">${r(0)}</sup>`;
    }
    return "";
  }
  const linha = (ed, ativo = true) => rend(ed.tok, ed.cur, ativo, u.io === "LL" || u.io === "LD");
  const insere = (ed, t) => roda(() => M.ins(ed, t));
  const apaga = (ed) => roda(() => M.apaga(ed));

  /* tecla → token (null = não digita) */
  const VAR = (n, s) => T("var", s, { n });
  function token(id, sh) {
    if (sh) {
      const m = { x: null, frac: { tpl: "mista" }, sqrt: { tpl: "root" }, pow: POST("inv", "⁻¹"), sq: FN("log", "log("), logab: FN("ln", "ln("), sin: FN("asin", "sen⁻¹("), cos: FN("acos", "cos⁻¹("), tan: FN("atan", "tan⁻¹("),
        lp: T("eq", "="), rp: T("comma", ";"), 7: T("pi", "π"), 8: T("e", "e"), 4: VAR("A", "A"), 5: VAR("B", "B"), 6: VAR("C", "C"), 1: VAR("D", "D"), 2: VAR("E", "E"), 3: VAR("F", "F"),
        0: VAR("X", "x"), pt: VAR("Y", "y"), e10: VAR("Z", "z"), div: T("binop", " ÷R ", { o: "divR" }), add: T("dms", "°"), sub: T("neg", "−") };
      return m[id] === undefined ? null : m[id];
    }
    if (/^[0-9]$/.test(id)) return T("dig", id);
    const m = { pt: T("dig", "."), e10: { tpl: "e10" }, add: T("op", "+", { o: "+" }), sub: T("op", "−", { o: "−" }), mul: T("op", "×", { o: "×" }), div: T("op", "÷", { o: "÷" }),
      lp: T("lp", "("), rp: T("rp", ")"), x: VAR("X", "x"), frac: { tpl: "frac" }, sqrt: { tpl: "sqrt" }, pow: { tpl: "pow" }, sq: POST("sq", "²"), logab: { tpl: "logab" },
      sin: FN("sin", "sen("), cos: FN("cos", "cos("), tan: FN("tan", "tan("), ans: T("ans", "Ans") };
    return m[id] || null;
  }

  /* ---------------- cálculo ---------------- */
  function calcula(tok) {
    return roda(() => {
      s2.forma = null;
      const arv = M.analisa(M.serial(tok));
      if (arv.t === "eq") { const a = M.avalia(arv.a), b = M.avalia(arv.b); if (typeof a !== "number" || typeof b !== "number") ERR("Math"); return { bool: Math.abs(a - b) <= 1e-10 * Math.max(1, Math.abs(a), Math.abs(b)) }; }
      let v = M.avalia(arv);
      if (v && v.par) return { par: v.par };
      if (typeof v !== "number" || !isFinite(v) || Math.abs(v) >= 1e100) ERR("Math");
      v = +v.toPrecision(15); if (Object.is(v, -0)) v = 0;
      return { v, dicas: M.dicasDe(tok) };
    });
  }
  CALC2._calcula = calcula;
  function executa(aprox) {
    const tok = u.ed.tok; if (!tok.length) return;
    try {
      const r = calcula(tok);
      r.tok = M.clona(tok); r.fmt = aprox ? "dec" : "padrao";
      if (r.v !== undefined) s2.ans = r.v; else if (r.par) s2.ans = r.par[0][1];
      u.res = r; u.hist.push(M.clona(tok)); if (u.hist.length > 30) u.hist.shift(); u.hpos = u.hist.length - 1; u.tela = "res"; /* hpos aponta para a conta na tela */
    } catch (e) { if (!(e instanceof Erro)) { console.error(e); e = new Erro("Math"); } erro(e.message, "calc"); }
  }
  function erro(tipo, volta) { u.erro = { tipo: /ERRO/.test(tipo) ? tipo : `ERRO ${tipo === "Syntax" ? "de sintaxe" : tipo === "Math" ? "matemático" : tipo === "Stack" ? "de pilha" : tipo}`, volta }; u.tela = "erro"; }
  /* Simp: simplifica a fração da entrada um fator primo por vez (como na ClassWiz) */
  function simp() {
    const r = u.res; if (!r) return;
    let p, q;
    if (r.simp) [p, q] = r.simp;
    else {
      const t = r.tok; if (t.length !== 1 || t[0].k !== "tpl" || t[0].t !== "frac") return msg("Simp: use com uma fração de inteiros, como 12/18.");
      const num = (sl) => (sl.length && sl.every((x) => x.k === "dig" && x.s !== ".") ? +sl.map((x) => x.s).join("") : NaN);
      p = num(t[0].slots[0]); q = num(t[0].slots[1]); if (!Number.isInteger(p) || !Number.isInteger(q) || q === 0) return msg("Simp: use com uma fração de inteiros, como 12/18.");
    }
    let f = 0; for (let k = 2; k <= Math.min(Math.abs(p), Math.abs(q)); k++) if (p % k === 0 && q % k === 0) { f = k; break; }
    if (!f) { r.simp = [p, q, 0]; return msg("A fração já está simplificada."); }
    r.simp = [p / f, q / f, f];
  }
  function msg(t, volta) { u.msg = { t, volta: volta || u.tela }; u.tela = "msg"; }

  /* ---------------- menus ---------------- */
  function menu(titulo, itens, extra = {}) { u.menu = { titulo, itens, sel: 0, volta: u.menu ? { ...u.menu } : null, telaVolta: u.tela === "menu" ? (u.menu && u.menu.telaVolta) : u.tela, ...extra }; u.tela = "menu"; }
  function fechaMenu(tudo = true) { const v = u.menu; if (!v) { u.tela = "calc"; return; } if (!tudo && v.volta) { u.menu = v.volta; return; } u.menu = null; u.tela = v.telaVolta || "calc"; }
  /* o editor da tela atual (conta, f(x), Tabela, dado da Estatística…) */
  function edAtivo() {
    switch (u.tela) {
      case "res": u.ed = M.novoEd(); u.tela = "calc"; return u.ed;
      case "calc": return u.ed;
      case "fdef": return u.fdef.ed;
      case "tabdef": return u.tab.lin ? u.tab.edG : u.tab.edF;
      case "tabprompt": return u.tab.buf;
      case "estdados": return u.est.buf;
    }
    u.menu = null; u.tela = "calc"; return u.ed;
  }
  const insereNaConta = (t) => () => { fechaMenu(); insere(edAtivo(), t); };
  function menuConfig() {
    const op = (nome, lista, atual, aplica) => [nome, () => menu(nome, lista.map(([k, r]) => [(k === atual() ? "◆ " : "  ") + r, () => { aplica(k); fechaMenu(); }]))];
    menu("CONFIG", [
      op("Entrada/Saída", [["MM", "Matem./Matem."], ["MD", "Matem./Decimal"], ["LL", "Linear/Linear"], ["LD", "Linear/Decimal"]], () => u.io, (k) => (u.io = k)),
      op("Unidade angular", [["D", "Grau"], ["R", "Radiano"], ["G", "Grado"]], () => s2.cfg.ang, (k) => (s2.cfg.ang = k)),
      ["Formato número", () => menu("Formato número", [["Norm 1", () => { s2.cfg.fmt = { t: "Norm", n: 1 }; fechaMenu(); }], ["Norm 2", () => { s2.cfg.fmt = { t: "Norm", n: 2 }; fechaMenu(); }], ["Fix (0–9 casas)", () => digito("Fix: casas decimais?", (d) => (s2.cfg.fmt = { t: "Fix", n: d }))], ["Sci (0–9 alg.)", () => digito("Sci: algarismos? (0 = 10)", (d) => (s2.cfg.fmt = { t: "Sci", n: d }))]])],
      op("Separador decimal", [["v", "Vírgula"], ["p", "Ponto"]], () => (u.virgula ? "v" : "p"), (k) => (u.virgula = k === "v")),
      ["Reiniciar tudo", () => menu("Reiniciar tudo?", [["Sim", () => { reiniciaTudo(); fechaMenu(); }], ["Não", () => fechaMenu()]])],
    ]);
  }
  function digito(titulo, fn) { menu(titulo, [], { digito: (d) => { fn(d); fechaMenu(); } }); }
  function reiniciaTudo() { s2.cfg.ang = "D"; s2.cfg.fmt = { t: "Norm", n: 1 }; u.io = "MM"; u.virgula = true; Object.keys(s2.vars).forEach((k) => (s2.vars[k] = 0)); s2.ans = 0; s2.funcoes = { f: [], g: [] }; u.hist = []; u.ed = M.novoEd(); u.res = null; }
  const NOMES_VAR = [["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"], ["F", "F"], ["X", "x"], ["Y", "y"], ["Z", "z"]];
  function menuVariavel() {
    menu("VARIABLE", [...NOMES_VAR.map(([n, s]) => [`${s}=${fmt(s2.vars[n])}`, () => menu(`Variável ${s}`, [["Recuperar", insereNaConta(VAR(n, s))], ["Armazenar Ans", () => { s2.vars[n] = typeof s2.ans === "number" ? s2.ans : 0; fechaMenu(); }]])]), [`Ans=${typeof s2.ans === "number" ? fmt(s2.ans) : ""}`, insereNaConta(T("ans", "Ans"))]]);
  }
  function menuFuncao() {
    const def = (k) => () => { fechaMenu(); u.fdef = { k, ed: M.edDe(s2.funcoes[k]), volta: u.tela === "res" ? "calc" : u.tela }; u.tela = "fdef"; };
    menu("FUNCTION", [["Definir f(x)", def("f")], ["Definir g(x)", def("g")], ["f(", insereNaConta(FN("uf_f", "f("))], ["g(", insereNaConta(FN("uf_g", "g("))]]);
  }
  function menuCatalogo() {
    const I = (rot, t) => [rot, insereNaConta(t)];
    const cat = (nome, itens) => [nome, () => menu(nome, itens)];
    menu("CATALOG", [
      cat("Cálculos de função", [I("Abs(", FN("abs", "Abs(")), I("³√(", FN("cbrt", "³√(")), I("e^(", FN("exp", "e^(")), I("10^(", FN("exp10", "10^(")), I("ln(", FN("ln", "ln(")), I("log(", FN("log", "log("))]),
      cat("Probabilidade", [I("x!", POST("fact", "!")), I("nPr", T("binop", "P", { o: "nPr" })), I("nCr", T("binop", "C", { o: "nCr" })), I("Ran#", T("ran", "Ran#")), I("RanInt#(", FN("ranint", "RanInt#("))]),
      cat("Cálculo numérico", [I("MDC(", FN("gcd", "MDC(")), I("MMC(", FN("lcm", "MMC(")), I("Int(", FN("int", "Int(")), I("Intg(", FN("intg", "Intg(")), I("Rnd(", FN("rnd", "Rnd(")), I("%", POST("pct", "%")), I("÷R", T("binop", " ÷R ", { o: "divR" }))]),
      cat("Ângulo/Coord.", [I("°", POST("deg", "°")), I("ʳ", POST("rad", "ʳ")), I("ᵍ", POST("grad", "ᵍ")), I("Pol(", FN("pol", "Pol(")), I("Rec(", FN("rec", "Rec("))]),
      cat("Hiperbólica", [I("sinh(", FN("sinh", "sinh(")), I("cosh(", FN("cosh", "cosh(")), I("tanh(", FN("tanh", "tanh(")), I("sinh⁻¹(", FN("asinh", "sinh⁻¹(")), I("cosh⁻¹(", FN("acosh", "cosh⁻¹(")), I("tanh⁻¹(", FN("atanh", "tanh⁻¹("))]),
      cat("Outros", [I("π", T("pi", "π")), I("e", T("e", "e")), I("Ans", T("ans", "Ans")), I("f(", FN("uf_f", "f(")), I("g(", FN("uf_g", "g("))]),
    ]);
  }
  function menuFormato() {
    const r = u.res; if (!r || r.v === undefined) return;
    const F = (rot, f) => [rot, () => { fechaMenu(); r.fmt = f; r.simp = null; if (f === "eng") r.eng = 0; }];
    menu("FORMAT", [F("Padrão", "padrao"), F("Decimal", "dec"), F("Fração imprópria", "imp"), F("Fração mista", "mista"), F("Engenharia", "eng"), F("Sexagesimal", "sexa"), F("Fatoração em primos", "primos")]);
  }
  function menuTools() {
    if (u.tela === "estdados" || u.tela === "estres") {
      const par = s2.stat.tipo === "lin";
      return menu("TOOLS", [[par ? "Cálculo 2-Var" : "Cálculo 1-Var", () => { fechaMenu(); resultadosEst(false); }], ...(par ? [["Cálculo de regressão", () => { fechaMenu(); resultadosEst(true); }]] : []), ["Apagar todos os dados", () => { s2.stat.x = []; s2.stat.y = []; u.est.r = 0; fechaMenu(); u.tela = "estdados"; }], ["Tipo de estatística", () => { fechaMenu(); menuTipoEst(); }]]);
    }
    if (u.tela === "tabdef" || u.tela === "tab" || u.tela === "tabprompt") return menu("TOOLS", [["Definir f(x)/g(x)", () => { fechaMenu(); abreTabDef(); }], ["Intervalo da tabela", () => { fechaMenu(); iniciaTabPrompt(); }]]);
    if (u.tela === "cxres" || u.tela === "cxprompt") return menu("TOOLS", [["Lançar de novo", () => { fechaMenu(); lancaCaixa(); }], ["Mudar o experimento", () => { fechaMenu(); menuCaixa(); }]]);
    menu("TOOLS", [["Apagar histórico", () => { u.hist = []; u.hpos = -1; fechaMenu(); }], ["Apagar variáveis", () => { Object.keys(s2.vars).forEach((k) => (s2.vars[k] = 0)); fechaMenu(); }], ["Apagar f(x) e g(x)", () => { s2.funcoes = { f: [], g: [] }; fechaMenu(); }]]);
  }

  /* ---------------- apps ---------------- */
  function irApp(a) {
    u.menu = null; u.shift = false;
    if (a === "calc") { u.tela = "calc"; return; }
    if (a === "est") return menuTipoEst(true);
    if (a === "tab") return abreTabDef();
    if (a === "caixa") return menuCaixa(true);
  }
  /* Estatística */
  function menuTipoEst(doHome) { u.menu = null; u.tela = doHome ? "home" : u.tela; menu("Estatística", [["1-Variável", () => tipoEst("1VAR")], ["y=a+bx", () => tipoEst("lin")]]); }
  function tipoEst(k) { u.menu = null; if (s2.stat.tipo !== k && k === "1VAR") s2.stat.y = []; s2.stat.tipo = k; u.est.r = 0; u.est.c = 0; u.est.buf = M.novoEd(); u.tela = "estdados"; }
  function quartis(v) { const a = [...v].sort((x, y) => x - y), n = a.length, med = (b) => (b.length % 2 ? b[(b.length - 1) / 2] : (b[b.length / 2 - 1] + b[b.length / 2]) / 2); if (n === 1) return [a[0], a[0], a[0]]; const meia = Math.floor(n / 2); return [med(a.slice(0, meia)), med(a), med(a.slice(n - meia))]; }
  CALC2._quartis = quartis;
  function resultadosEst(regressao) {
    try {
      const e = roda(() => window.CALC._.estat());
      const L = [];
      if (regressao) { L.push(["y=a+bx", ""], ["a", e.A], ["b", e.B], ["r", e.r]); }
      else {
        L.push(["x̄", e.xm], ["Σx", e.sx], ["Σx²", e.sx2], ["σ²x", e.ox * e.ox], ["σx", e.ox], ["s²x", e.sxs * e.sxs], ["sx", e.sxs], ["n", e.n]);
        if (s2.stat.tipo === "lin") L.push(["ȳ", e.ym], ["Σy", e.sy], ["Σy²", e.sy2], ["σ²y", e.oy * e.oy], ["σy", e.oy], ["s²y", e.sys * e.sys], ["sy", e.sys], ["Σxy", e.sxy], ["min(x)", e.minX], ["max(x)", e.maxX], ["min(y)", e.minY], ["max(y)", e.maxY]);
        else { const [q1, md, q3] = quartis(s2.stat.x); L.push(["min(x)", e.minX], ["Q₁", q1], ["Med", md], ["Q₃", q3], ["max(x)", e.maxX]); }
      }
      u.est.linhas = L; u.est.sel = 0; u.est.titulo = regressao ? "Cálculo de regressão" : s2.stat.tipo === "lin" ? "Cálculo 2-Var" : "Cálculo 1-Var"; u.tela = "estres";
    } catch (err) { erro(err instanceof Erro ? err.message : "Math", "estdados"); }
  }
  CALC2._resultadosEst = resultadosEst;
  function teclaEstDados(id, sh) {
    const S = s2.stat, E = u.est, par = S.tipo === "lin", n = S.x.length;
    if (id === "up") { E.r = Math.max(0, E.r - 1); return; }
    if (id === "down") { E.r = Math.min(n, E.r + 1); return; }
    if (id === "left" || id === "right") { if (par) E.c = E.c ? 0 : 1; return; }
    if (id === "exe" || id === "ok") {
      if (!E.buf.tok.length) { E.r = Math.min(n, E.r + 1); return; }
      let v; try { const r = calcula(E.buf.tok); if (r.v === undefined) ERR("Math"); v = r.v; } catch (err) { return erro(err instanceof Erro ? err.message : "Math", "estdados"); }
      const col = E.c ? S.y : S.x;
      col[E.r] = v; if (E.c === 0 && par && S.y[E.r] === undefined) S.y[E.r] = undefined; if (E.c === 1 && S.x[E.r] === undefined) S.x[E.r] = 0;
      E.buf = M.novoEd(); if (E.c === 0 || !par) E.r++; else { E.r++; } return;
    }
    if (id === "del" && !E.buf.tok.length) { if (E.r < n) { S.x.splice(E.r, 1); S.y.splice(E.r, 1); } return; }
    if (id === "ac") { E.buf = M.novoEd(); return; }
    teclaEditor(E.buf, id, sh);
  }
  /* Tabela */
  function abreTabDef() { u.menu = null; u.tab.edF = M.edDe(s2.funcoes.f); u.tab.edG = M.edDe(s2.funcoes.g); u.tab.lin = 0; u.tela = "tabdef"; }
  function guardaTabDef() { s2.funcoes.f = M.clona(u.tab.edF.tok); s2.funcoes.g = M.clona(u.tab.edG.tok); }
  function iniciaTabPrompt() { guardaTabDef(); if (!s2.funcoes.f.length && !s2.funcoes.g.length) return msg("Defina f(x) ou g(x) primeiro.", "tabdef"); u.tab.prompt = 0; u.tab.buf = M.novoEd(); u.tela = "tabprompt"; }
  function avaliaF(k, x) { return roda(() => { const v = M.avalia(M.analisa(M.serial(s2.funcoes[k])), { X: x }); if (typeof v !== "number" || !isFinite(v)) ERR("Math"); return v; }); }
  CALC2._avaliaF = avaliaF;
  function montaTabela() {
    const t = u.tab; if (t.passo === 0 || (t.fim - t.ini) / t.passo < 0) return erro("ERRO de intervalo", "tabprompt");
    const n = Math.floor((t.fim - t.ini) / t.passo + 1e-9) + 1; if (n > 45) return erro("ERRO de intervalo (no máximo 45 linhas)", "tabprompt");
    t.rows = []; for (let i = 0; i < n; i++) { const x = +(t.ini + i * t.passo).toPrecision(12), lin = [x]; ["f", "g"].forEach((k) => { if (s2.funcoes[k].length) { try { lin.push(avaliaF(k, x)); } catch (e) { lin.push(NaN); } } else lin.push(undefined); }); t.rows.push(lin); }
    t.sel = 0; u.tela = "tab";
  }
  CALC2._montaTabela = montaTabela;
  /* Caixa Matemática */
  function menuCaixa(doHome) { u.menu = null; if (doHome) u.tela = "home"; menu("Caixa Matemática", [["Lançar dados", () => iniciaCaixa("dado")], ["Lançar moeda", () => iniciaCaixa("moeda")]]); }
  function iniciaCaixa(tipo) { u.menu = null; u.cx.tipo = tipo; u.cx.prompt = 0; u.cx.buf = M.novoEd(); u.tela = "cxprompt"; }
  function lancaCaixa(aleat = Math.random) {
    const c = u.cx, faces = c.tipo === "dado" ? 6 : 2, cont = new Map(), lista = [];
    for (let k = 0; k < c.tent; k++) { let s = 0; for (let j = 0; j < c.n; j++) s += c.tipo === "dado" ? 1 + Math.floor(aleat() * faces) : aleat() < 0.5 ? 1 : 0; lista.push(s); cont.set(s, (cont.get(s) || 0) + 1); }
    const min = c.tipo === "dado" ? c.n : 0, max = c.tipo === "dado" ? 6 * c.n : c.n, tab = []; for (let s = min; s <= max; s++) tab.push([s, cont.get(s) || 0]);
    c.res = { lista, tab }; c.sel = 0; u.tela = "cxres";
  }
  CALC2._lancaCaixa = lancaCaixa;

  /* ---------------- teclas ---------------- */
  function teclaEditor(ed, id, sh) {
    if (id === "left") return roda(() => M.esquerda(ed));
    if (id === "right") return roda(() => M.direita(ed));
    if (id === "up" || id === "down") return roda(() => M.vertical(ed, id === "up" ? "u" : "d"));
    if (id === "del") return apaga(ed);
    const t = token(id, sh); if (t) insere(ed, t);
  }
  function tecla(id) {
    const sh = u.shift;
    if (id === "shift") { u.shift = !u.shift; return; }
    u.shift = false;
    if (!u.ligada) { if (id === "on") { u.ligada = true; u.tela = "home"; } return; }
    if (id === "ac" && sh) { u.ligada = false; return; } /* OFF */
    if (id === "on") { u.menu = null; u.tela = "home"; return; }
    if (id === "home") { u.menu = null; u.tela = "home"; return; }
    if (id === "config") return menuConfig();
    if (id === "var") return menuVariavel();
    if (id === "func") return menuFuncao();
    if (id === "cat") return menuCatalogo();
    if (id === "tools") return menuTools();
    if (id === "del" && sh) { s2.ins = !s2.ins; return; } /* INS */
    if (id === "x" && sh) return msg("QR Code: na calculadora de verdade, gera um código para ver a conta no celular. Aqui no site não tem.");
    switch (u.tela) {
      case "home": {
        if (id === "left") u.homeSel = (u.homeSel + 3) % 4; else if (id === "right") u.homeSel = (u.homeSel + 1) % 4;
        else if (id === "down" && u.homeSel < 3) u.homeSel = 3; else if (id === "up" && u.homeSel === 3) u.homeSel = 0;
        else if (id === "ok" || id === "exe") irApp(APPS[u.homeSel][0]);
        else if (/^[1-4]$/.test(id)) irApp(APPS[+id - 1][0]);
        return;
      }
      case "menu": {
        const Mn = u.menu;
        if (Mn.digito) { if (/^[0-9]$/.test(id)) Mn.digito(+id); else if (id === "back" || id === "ac") fechaMenu(false); return; }
        if (id === "up") Mn.sel = (Mn.sel + Mn.itens.length - 1) % Mn.itens.length;
        else if (id === "down") Mn.sel = (Mn.sel + 1) % Mn.itens.length;
        else if (id === "pgup") Mn.sel = Math.max(0, Mn.sel - 4); else if (id === "pgdn") Mn.sel = Math.min(Mn.itens.length - 1, Mn.sel + 4);
        else if (id === "ok" || id === "exe") Mn.itens[Mn.sel][1]();
        else if (/^[1-9]$/.test(id) && +id <= Mn.itens.length) Mn.itens[+id - 1][1]();
        else if (id === "back") fechaMenu(false);
        else if (id === "ac") fechaMenu(true);
        return;
      }
      case "erro": { if (id === "ac" || id === "back" || id === "ok" || id === "exe") u.tela = u.erro.volta; else if (id === "left" || id === "right") u.tela = u.erro.volta; return; }
      case "msg": { u.tela = u.msg.volta === "msg" ? "calc" : u.msg.volta; return; }
      case "fdef": {
        const D = u.fdef;
        if (id === "exe" || id === "ok") { s2.funcoes[D.k] = M.clona(D.ed.tok); u.tela = D.volta || "calc"; return; }
        if (id === "back") { u.tela = D.volta || "calc"; return; }
        if (id === "ac") { D.ed = M.novoEd(); return; }
        return teclaEditor(D.ed, id, sh);
      }
      case "calc": case "res": return teclaCalc(id, sh);
      case "estdados": if (id === "back") return menuTipoEst(true); return teclaEstDados(id, sh);
      case "estres": { const E = u.est; if (id === "up") E.sel = Math.max(0, E.sel - 1); else if (id === "down") E.sel = Math.min(E.linhas.length - 1, E.sel + 1); else if (id === "pgup") E.sel = Math.max(0, E.sel - 4); else if (id === "pgdn") E.sel = Math.min(E.linhas.length - 1, E.sel + 4); else if (id === "back" || id === "ac") u.tela = "estdados"; return; }
      case "tabdef": {
        const t = u.tab, ed = t.lin ? t.edG : t.edF;
        if (id === "up" || id === "down") { if (!roda(() => M.vertical(ed, id === "up" ? "u" : "d"))) t.lin = id === "down" ? 1 : 0; return; }
        if (id === "exe" || id === "ok") { if (t.lin === 0) { t.lin = 1; return; } return iniciaTabPrompt(); }
        if (id === "back") { guardaTabDef(); u.tela = "home"; return; }
        if (id === "ac") { (t.lin ? (t.edG = M.novoEd()) : (t.edF = M.novoEd())); return; }
        return teclaEditor(ed, id, sh);
      }
      case "tabprompt": {
        const t = u.tab, nomes = ["ini", "fim", "passo"];
        if (id === "exe" || id === "ok") {
          if (t.buf.tok.length) { try { const r = calcula(t.buf.tok); if (r.v === undefined) ERR("Math"); t[nomes[t.prompt]] = r.v; } catch (err) { return erro(err instanceof Erro ? err.message : "Math", "tabprompt"); } }
          t.buf = M.novoEd(); if (t.prompt < 2) { t.prompt++; return; } return montaTabela();
        }
        if (id === "up") { t.prompt = Math.max(0, t.prompt - 1); t.buf = M.novoEd(); return; }
        if (id === "down") { t.prompt = Math.min(2, t.prompt + 1); t.buf = M.novoEd(); return; }
        if (id === "back") { u.tela = "tabdef"; return; }
        if (id === "ac") { t.buf = M.novoEd(); return; }
        return teclaEditor(t.buf, id, sh);
      }
      case "tab": { const t = u.tab; if (id === "up") t.sel = Math.max(0, t.sel - 1); else if (id === "down") t.sel = Math.min(t.rows.length - 1, t.sel + 1); else if (id === "pgup") t.sel = Math.max(0, t.sel - 4); else if (id === "pgdn") t.sel = Math.min(t.rows.length - 1, t.sel + 4); else if (id === "back" || id === "ac") u.tela = "tabdef"; return; }
      case "cxprompt": {
        const c = u.cx;
        if (id === "exe" || id === "ok") {
          if (c.buf.tok.length) { let v; try { v = calcula(c.buf.tok).v; } catch (e) { v = NaN; } const [lo, hi] = c.prompt === 0 ? [1, 3] : [1, 250]; if (!Number.isInteger(v) || v < lo || v > hi) return erro(`ERRO: use um inteiro de ${lo} a ${hi}`, "cxprompt"); if (c.prompt === 0) c.n = v; else c.tent = v; }
          c.buf = M.novoEd(); if (c.prompt === 0) { c.prompt = 1; return; } return lancaCaixa();
        }
        if (id === "back") return menuCaixa(true);
        if (id === "ac") { c.buf = M.novoEd(); return; }
        if (/^[0-9]$/.test(id) || id === "del") return teclaEditor(c.buf, id, sh);
        return;
      }
      case "cxres": { const c = u.cx; if (id === "up") c.sel = Math.max(0, c.sel - 1); else if (id === "down") c.sel = Math.min(c.res.tab.length - 1, c.sel + 1); else if (id === "exe" || id === "ok") lancaCaixa(); else if (id === "back" || id === "ac") menuCaixa(true); return; }
    }
  }
  function teclaCalc(id, sh) {
    const emRes = u.tela === "res";
    if (id === "back") { u.tela = "home"; return; }
    if (id === "format") { if (emRes) menuFormato(); return; }
    if (id === "exe" || id === "ok") { executa(sh && id === "exe"); return; }
    if (id === "ans" && sh) { if (emRes) simp(); return; }
    if (id === "ac") { u.ed = M.novoEd(); u.res = null; u.hpos = u.hist.length; u.tela = "calc"; return; }
    if (id === "pgup" || id === "pgdn" || ((id === "up" || id === "down") && (emRes || !u.ed.tok.length))) {
      if (!u.hist.length) return;
      u.hpos = Math.max(0, Math.min(u.hist.length - 1, u.hpos + (id === "up" || id === "pgup" ? -1 : 1)));
      u.ed = M.edDe(u.hist[u.hpos]); try { const r = calcula(u.ed.tok); r.tok = M.clona(u.ed.tok); r.fmt = "padrao"; u.res = r; u.tela = "res"; } catch (e) { u.tela = "calc"; }
      return;
    }
    if (emRes) {
      if (id === "left" || id === "right") { u.ed = M.edDe(u.res.tok, id === "left"); u.tela = "calc"; return; }
      if (id === "del") { u.ed = M.edDe(u.res.tok); u.tela = "calc"; return; }
      const t = token(id, sh); if (!t) return;
      u.ed = M.novoEd(); u.tela = "calc";
      if (t.k === "op" || t.k === "binop" || t.k === "post" || (t.tpl === "pow")) insere(u.ed, T("ans", "Ans")); /* continua a conta a partir de Ans */
      insere(u.ed, t); return;
    }
    teclaEditor(u.ed, id, sh);
  }

  /* ---------------- desenho do visor ---------------- */
  function barra() {
    const I = [];
    if (u.shift) I.push('<b class="i-s">S</b>');
    I.push({ D: "D", R: "R", G: "G" }[s2.cfg.ang]);
    I.push(u.io[0] === "M" ? "Math" : "Linear");
    if (s2.cfg.fmt.t !== "Norm") I.push(s2.cfg.fmt.t.toUpperCase());
    if (s2.ins) I.push("INS");
    const app = { calc: "Calcular", res: "Calcular", estdados: "Estatística", estres: "Estatística", tabdef: "Tabela", tabprompt: "Tabela", tab: "Tabela", cxprompt: "Caixa", cxres: "Caixa" }[u.tela];
    return I.map((x) => `<span>${x}</span>`).join("") + (app ? `<span class="app">${app}</span>` : "");
  }
  const ICONES = { calc: `<span class="ic-calc">×÷<br>+−</span>`, est: `<span class="ic-est"><i style="height:6px"></i><i style="height:12px"></i><i style="height:9px"></i><i style="height:15px"></i></span>`, tab: `<span class="ic-tab"><i></i><i></i><i></i><i></i></span>`, caixa: `<span class="ic-cx">⚀⚄</span>` };
  function listaMenu(itens, sel, numerar = true) {
    const ini = Math.max(0, Math.min(sel - 1, itens.length - 4));
    return `<div class="c2-lista">${itens.slice(ini, ini + 4).map((it, i) => `<div class="${ini + i === sel ? "sel" : ""}">${numerar ? `<b>${ini + i + 1}:</b>` : ""}${esc(it)}</div>`).join("")}</div>${itens.length > 4 ? `<div class="c2-rol">${sel + 1}/${itens.length}</div>` : ""}`;
  }
  function desenhaVisor() {
    const v = el.querySelector(".c2-lcd");
    if (!u.ligada) { v.innerHTML = ""; v.classList.add("off"); return; }
    v.classList.remove("off");
    let corpo = "";
    switch (u.tela) {
      case "home": corpo = `<div class="c2-home">${APPS.map(([k, nome], i) => `<div class="${i === u.homeSel ? "sel" : ""}">${ICONES[k]}<span>${nome}</span></div>`).join("")}</div>`; break;
      case "calc": corpo = `<div class="c2-ent">${linha(u.ed)}</div><div class="c2-res"></div>`; break;
      case "res": corpo = `<div class="c2-ent">${rend(u.res.tok, null, false, u.io[0] === "L")}</div><div class="c2-res">${mostra(u.res)}</div>`; break;
      case "erro": corpo = `<div class="c2-erro"><b>${esc(u.erro.tipo)}</b><small>[AC] ou [↶]: voltar</small></div>`; break;
      case "msg": corpo = `<div class="c2-msg">${esc(u.msg.t)}<small>qualquer tecla: voltar</small></div>`; break;
      case "menu": {
        const Mn = u.menu;
        corpo = `<div class="c2-tit">${esc(Mn.titulo)}</div>` + (Mn.digito ? `<div class="c2-msg"><small>digite um número de 0 a 9</small></div>` : listaMenu(Mn.itens.map((x) => x[0]), Mn.sel));
        break;
      }
      case "fdef": corpo = `<div class="c2-tit">Definir ${u.fdef.k}(x)</div><div class="c2-ent">${u.fdef.k}(x)=${linha(u.fdef.ed)}</div><div class="c2-dica">use a tecla 𝑥 · [EXE] guarda</div>`; break;
      case "estdados": {
        const S = s2.stat, E = u.est, par = S.tipo === "lin", n = S.x.length, ini = Math.max(0, Math.min(E.r - 1, n + 1 - 3)), L = [];
        for (let i = ini; i < Math.min(n + 1, ini + 3); i++) L.push(`<tr><td>${i + 1}</td><td class="${E.r === i && E.c === 0 ? "sel" : ""}">${S.x[i] !== undefined ? fmt(S.x[i]) : ""}</td>${par ? `<td class="${E.r === i && E.c === 1 ? "sel" : ""}">${S.y[i] !== undefined ? fmt(S.y[i]) : ""}</td>` : ""}</tr>`);
        corpo = `<table class="c2-tab"><tr><th></th><th>x</th>${par ? "<th>y</th>" : ""}</tr>${L.join("")}</table><div class="c2-ent peq">${linha(E.buf)}</div><div class="c2-dica">[TOOLS] calcular</div>`; break;
      }
      case "estres": { const E = u.est; corpo = `<div class="c2-tit">${E.titulo}</div>` + listaMenu(E.linhas.map(([k, x]) => (x === "" ? k : `${k}=${fmt(x).replace(/<[^>]+>/g, (t) => (t === "<sup>" ? "^" : ""))}`)), E.sel, false); break; }
      case "tabdef": { const t = u.tab; corpo = `<div class="c2-ent peq ${t.lin === 0 ? "ativa" : ""}">f(x)=${rend(t.edF.tok, t.edF.cur, t.lin === 0, u.io[0] === "L")}</div><div class="c2-ent peq ${t.lin === 1 ? "ativa" : ""}">g(x)=${rend(t.edG.tok, t.edG.cur, t.lin === 1, u.io[0] === "L")}</div><div class="c2-dica">▲▼ troca · [EXE] continua · deixe g(x) vazio se não precisar</div>`; break; }
      case "tabprompt": { const t = u.tab, nomes = ["Início", "Fim", "Passo"], vals = [t.ini, t.fim, t.passo]; corpo = `<div class="c2-tit">Intervalo da tabela</div><div class="c2-lista">${nomes.map((nm, i) => `<div class="${i === t.prompt ? "sel" : ""}">${nm}: ${i === t.prompt && t.buf.tok.length ? linha(t.buf) : fmt(vals[i])}${i === t.prompt && !t.buf.tok.length ? '<span class="cur"></span>' : ""}</div>`).join("")}</div>`; break; }
      case "tab": {
        const t = u.tab, temF = s2.funcoes.f.length > 0, temG = s2.funcoes.g.length > 0, ini = Math.max(0, Math.min(t.sel - 1, t.rows.length - 3));
        corpo = `<table class="c2-tab"><tr><th></th><th>x</th>${temF ? "<th>f(x)</th>" : ""}${temG ? "<th>g(x)</th>" : ""}</tr>${t.rows.slice(ini, ini + 3).map((r, i) => `<tr class="${ini + i === t.sel ? "sel" : ""}"><td>${ini + i + 1}</td><td>${fmt(r[0])}</td>${temF ? `<td>${isNaN(r[1]) ? "ERRO" : fmt(r[1])}</td>` : ""}${temG ? `<td>${isNaN(r[2]) ? "ERRO" : fmt(r[2])}</td>` : ""}</tr>`).join("")}</table><div class="c2-rol">${t.sel + 1}/${t.rows.length}</div>`; break;
      }
      case "cxprompt": { const c = u.cx, nomes = [c.tipo === "dado" ? "Número de dados (1–3)" : "Número de moedas (1–3)", "Tentativas (1–250)"], vals = [c.n, c.tent]; corpo = `<div class="c2-tit">${c.tipo === "dado" ? "Lançar dados" : "Lançar moeda"}</div><div class="c2-lista">${nomes.map((nm, i) => `<div class="${i === c.prompt ? "sel" : ""}">${nm}: ${i === c.prompt && c.buf.tok.length ? linha(c.buf) : vals[i]}</div>`).join("")}</div><div class="c2-dica">[EXE] confirma e lança</div>`; break; }
      case "cxres": {
        const c = u.cx, R = c.res, ini = Math.max(0, Math.min(c.sel - 1, R.tab.length - 3)), rot = c.tipo === "dado" ? (c.n > 1 ? "soma" : "face") : "caras";
        corpo = `<table class="c2-tab"><tr><th>${rot}</th><th>vezes</th><th>freq. rel.</th></tr>${R.tab.slice(ini, ini + 3).map(([k, n], i) => `<tr class="${ini + i === c.sel ? "sel" : ""}"><td>${k}</td><td>${n}</td><td>${fmt(+(n / c.tent).toFixed(4))}</td></tr>`).join("")}</table><div class="c2-dica">${c.tent} tentativas · [EXE] lança de novo</div>`; break;
      }
    }
    v.innerHTML = `<div class="c2-barra">${barra()}</div><div class="c2-corpo">${corpo}</div>`;
    const c = v.querySelector(".c2-ent .cur"); if (c) c.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  /* ---------------- montagem ---------------- */
  let el = null;
  const K = (id, rot, sh = "", cls = "", aria = "", cel = "") => `<div class="c2-cel ${cel}"><span class="c2-sh">${sh}</span><button type="button" class="c2-k ${cls}" data-k="${id}" aria-label="${esc(aria || rot.replace(/<[^>]+>/g, ""))}">${rot}</button></div>`;
  function monta() {
    el = document.createElement("div");
    el.className = "calc-dock calc2"; el.id = "calculadora2"; el.setAttribute("aria-label", "Calculadora 2 (estilo fx-82LA CW)"); el.hidden = true;
    const topo = `<div class="c2-topo">
        ${K("on", "", "", "c2-on", "ON", "p-on")}${K("home", "⌂", "", "c2-sis", "HOME", "p-home")}
        <div class="c2-dpad"><button type="button" data-k="up" aria-label="para cima">⌃</button><button type="button" data-k="left" aria-label="para a esquerda">‹</button><button type="button" data-k="ok" class="c2-ok" aria-label="OK">OK</button><button type="button" data-k="right" aria-label="para a direita">›</button><button type="button" data-k="down" aria-label="para baixo">⌄</button></div>
        <div class="c2-rolar"><button type="button" data-k="pgup" aria-label="página acima">⇑</button><button type="button" data-k="pgdn" aria-label="página abaixo">⇓</button></div>
        ${K("config", "☰", "", "c2-sis", "CONFIG", "p-config")}${K("back", "↶", "", "c2-sis", "voltar", "p-back")}
      </div>
      <div class="c2-rotulos"><span>ON</span><span>HOME</span><span></span><span></span><span></span><span></span></div>
      <div class="c2-l6 c2-fn">${K("shift", "", "", "c2-shift", "SHIFT")}${K("var", "⇄𝑥", "", "", "VARIABLE")}${K("func", "f(x)", "", "", "FUNCTION")}<div class="c2-cel"></div>${K("cat", "<svg viewBox='0 0 20 14' width='18' height='13'><path d='M10 3C7 1 4 1 1 2v11c3-1 6-1 9 1 3-2 6-2 9-1V2c-3-1-6-1-9 1zM10 3v11' fill='none' stroke='currentColor' stroke-width='1.5'/></svg>", "", "", "CATALOG")}${K("tools", "•••", "", "", "TOOLS")}</div>
      <div class="c2-rot6"><span class="az">SHIFT</span><span>VARIABLE</span><span>FUNCTION</span><span></span><span>CATALOG</span><span>TOOLS</span></div>`;
    const l1 = [K("x", "𝑥", "QR"), K("frac", "<span class='c2-fr'><i></i><i></i></span>", "▭ <span class='c2-fr mini'><i></i><i></i></span>", "", "fração"), K("sqrt", "√▪", "▪√▫", "", "raiz"), K("pow", "▪<sup>▫</sup>", "▪<sup>−1</sup>", "", "potência"), K("sq", "▪<sup>2</sup>", "log", "", "ao quadrado"), K("logab", "log<sub>▪</sub>▫", "ln", "", "log de base")];
    const l2 = [K("ans", "Ans", "Simp"), K("sin", "sen", "Arcsen"), K("cos", "cos", "Arccos"), K("tan", "tan", "Arctan"), K("lp", "(", "="), K("rp", ")", ";")];
    const L5 = [[K("7", "7", "π", "n"), K("8", "8", "<i>e</i>", "n"), K("9", "9", "", "n"), K("del", "⌫", "INS", "n", "apagar"), K("ac", "AC", "OFF", "n")],
      [K("4", "4", "A", "n"), K("5", "5", "B", "n"), K("6", "6", "C", "n"), K("mul", "×", "", "n"), K("div", "÷", "÷R", "n")],
      [K("1", "1", "D", "n"), K("2", "2", "E", "n"), K("3", "3", "F", "n"), K("add", "+", "°′″", "n"), K("sub", "−", "(−)", "n")],
      [K("0", "0", "<i>x</i>", "n"), K("pt", ",", "<i>y</i>", "n", "vírgula"), K("e10", "×10<sup>▪</sup>", "<i>z</i>", "n", "vezes 10 elevado a"), K("format", "<span class='c2-format'>FORMAT</span>", "", "n", "FORMAT"), K("exe", "EXE", "≈", "n")]];
    el.innerHTML = `<button type="button" class="calc-aba" aria-expanded="false" aria-controls="calc2-corpo"><span class="calc-mini c2-mini"></span><span>Calculadora 2 · fx-82LA CW</span><span class="calc-seta">▲</span></button>
      <div class="calc-corpo c2" id="calc2-corpo" tabindex="-1">
        <div class="c2-marca"><b>CASIO</b> <span>fx-82LA CW</span> <em>estilo ClassWiz</em></div>
        <div class="c2-lcd" aria-live="polite"></div>
        <div class="c2-cw">CLASSWIZ</div>
        ${topo}
        <div class="c2-l6">${l1.join("")}</div><div class="c2-l6">${l2.join("")}</div>
        ${L5.map((l) => `<div class="c2-l5">${l.join("")}</div>`).join("")}
      </div>`;
    document.body.appendChild(el);
    el.querySelector(".calc-aba").addEventListener("click", () => abre(!el.classList.contains("aberta")));
    const corpo = el.querySelector(".calc-corpo");
    corpo.addEventListener("click", (ev) => { const b = ev.target.closest("[data-k]"); if (!b) return; aperta(b.dataset.k); corpo.focus({ preventScroll: true }); });
    corpo.addEventListener("keydown", teclado);
    desenha();
  }
  function aperta(id) { try { tecla(id); } catch (e) { if (!(e instanceof Erro)) console.error(e); erro(e instanceof Erro ? e.message : "Math", u.tela === "erro" ? "calc" : u.tela); } desenha(); }
  CALC2.aperta = aperta;
  function desenha() { if (!el) return; desenhaVisor(); el.classList.toggle("modo-shift", u.shift); el.querySelector('[data-k="shift"]').classList.toggle("ligado", u.shift); }
  function teclado(ev) {
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const mapa = { "0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9", ".": "pt", ",": "pt", "+": "add", "-": "sub", "*": "mul", "/": "div", "(": "lp", ")": "rp", "^": "pow", x: "x", Enter: "exe", "=": "exe", Backspace: "del", Delete: "del", Escape: "ac", ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", PageUp: "pgup", PageDown: "pgdn", Home: "home" };
    if (mapa[ev.key]) { ev.preventDefault(); aperta(mapa[ev.key]); }
  }
  function abre(on) { if (!el) return; el.classList.toggle("aberta", on); el.querySelector(".calc-aba").setAttribute("aria-expanded", on); if (on) setTimeout(() => el.querySelector(".calc-corpo").focus({ preventScroll: true }), 300); }
  CALC2.abre = abre;
  function liga(on) {
    if (on && !el) monta();
    if (!el) return;
    if (on) { el.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("visivel"))); }
    else { el.classList.remove("visivel", "aberta"); setTimeout(() => { if (!el.classList.contains("visivel")) el.hidden = true; }, 450); }
  }
  CALC2.liga = liga;
  const CHAVE = "fisica:calculadora2";
  const ler = () => { try { return JSON.parse(localStorage.getItem(CHAVE) || "false"); } catch (e) { return false; } };
  CALC2.ligaSalvo = (on) => { try { localStorage.setItem(CHAVE, JSON.stringify(on)); } catch (e) {} const sw = document.getElementById("cfg-calc2"); if (sw) sw.setAttribute("aria-checked", on); liga(on); };
  document.addEventListener("DOMContentLoaded", () => {
    const sw = document.getElementById("cfg-calc2");
    if (sw) { sw.setAttribute("aria-checked", ler()); sw.addEventListener("click", () => { const on = !ler(); CALC2.ligaSalvo(on); if (on && window.CALC.ligaSalvo) window.CALC.ligaSalvo(false); /* só uma por vez */ }); }
    let calc1 = false; try { calc1 = JSON.parse(localStorage.getItem("fisica:calculadora") || "false"); } catch (e) {}
    if (ler()) { if (calc1) CALC2.ligaSalvo(false); else liga(true); }
  });
})();
