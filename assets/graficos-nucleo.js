/* Gráficos de funções (β 11.5): NÚCLEO, sem tela. Leitor de expressões próprio (sem eval e sem new Function), avaliador,
   escrita em TeX e a análise numérica (descontinuidades, raízes, extremos, interseções, derivada e integral).
   Serve ao navegador (window.GRAF) e ao Node (module.exports), para os testes conferirem as contas fora da página.

   Gramática (da menor para a maior precedência):
     expressão = termo { (+ | −) termo }
     termo     = unário { (· | × | * | / | ÷ | :) unário  |  unário colado (multiplicação implícita: 2x, 3(x+1), x sen x) }
     unário    = (− | +) unário | potência            → −x² = −(x²)
     potência  = pós [ ^ unário ]                     → associa à direita: x^2^3 = x^(2^3); 2^−x vale
     pós       = átomo { ² ³ … | ! não existe }
     átomo     = número | x | n | parâmetro | π | e | ( expressão ) | |expressão| | função
     função    = nome ( argumentos )  |  nome átomo-colado   (sen x, sen 2x = sen(2x))  |  nome^k(…)  |  log_b(…)  |  log(b; x)
   Fora do domínio (log de não positivo, raiz de negativo, divisão por zero) o valor é NaN: o ponto simplesmente não é desenhado. */
(function (raiz) {
  "use strict";
  const G = {};
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", SUB = "₀₁₂₃₄₅₆₇₈₉";
  /* nomes de função aceitos → nome interno */
  const FUN = { sen: "sin", sin: "sin", cos: "cos", tg: "tan", tan: "tan", ln: "ln", log: "log", raiz: "sqrt", sqrt: "sqrt", abs: "abs", exp: "exp",
    arcsen: "asin", asen: "asin", asin: "asin", arcsin: "asin", arccos: "acos", acos: "acos", arctg: "atan", atg: "atan", atan: "atan", arctan: "atan", cotg: "cot", cot: "cot", sec: "sec", cossec: "csc", csc: "csc" };
  const NOMES = Object.keys(FUN).sort((a, b) => b.length - a.length); /* o mais comprido primeiro: "arcsen" antes de "sen" */
  const ehLetra = (c) => /[A-Za-zΑ-ωА-Яа-яЁё]/.test(c);
  const ehDig = (c) => c >= "0" && c <= "9";
  function Erro(msg, pos, tam) { const e = new Error(msg); e.graf = true; e.pos = pos; e.tam = Math.max(1, tam || 1); return e; }
  G.Erro = Erro;

  /* ---------- 1. separar em pedaços (tokens) ---------- */
  function pedacos(s) {
    const t = []; let i = 0; const n = s.length;
    const poe = (tipo, v, pos, tam) => t.push({ tipo, v, pos, tam });
    while (i < n) { const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (ehDig(c) || ((c === "." || c === ",") && ehDig(s[i + 1] || ""))) { let j = i, viu = false; while (j < n && (ehDig(s[j]) || ((s[j] === "." || s[j] === ",") && !viu && ehDig(s[j + 1] || "")))) { if (s[j] === "." || s[j] === ",") viu = true; j++; }
        poe("num", parseFloat(s.slice(i, j).replace(",", ".")), i, j - i); i = j; continue; }
      if (SUP.includes(c) || c === "⁻") { let j = i, neg = false; if (s[j] === "⁻") { neg = true; j++; } let v = ""; while (j < n && SUP.includes(s[j])) v += SUP.indexOf(s[j++]); if (!v) throw Erro("Depois do sinal de menos elevado falta o número do expoente.", i, 1); poe("sup", (neg ? -1 : 1) * parseInt(v, 10), i, j - i); i = j; continue; }
      if (c === "π") { poe("id", "pi", i, 1); i++; continue; }
      if (c === "√") { poe("fun", "sqrt", i, 1); i++; continue; }
      if (ehLetra(c)) { const resto = s.slice(i).toLowerCase(); const f = NOMES.find((k) => resto.startsWith(k));
        if (f) { /* log_b e log₂ */ let j = i + f.length; if (FUN[f] === "log" && (s[j] === "_" || SUB.includes(s[j] || "§"))) { poe("fun", "logb", i, f.length); i = j; if (s[i] === "_") i++; let v = ""; const p0 = i; while (i < n && SUB.includes(s[i])) v += SUB.indexOf(s[i++]); if (v) poe("base", parseInt(v, 10), p0, i - p0); else t.push({ tipo: "basev", pos: i, tam: 1 }); continue; }
          poe("fun", FUN[f], i, f.length); i = j; continue; }
        if (resto.startsWith("pi")) { poe("id", "pi", i, 2); i += 2; continue; }
        poe("id", c, i, 1); i++; continue; }
      if ("+-−–*·×∙⋅/÷:^()|;=<>_!".includes(c) || c === ",") { const m = { "−": "-", "–": "-", "·": "*", "×": "*", "∙": "*", "⋅": "*", "÷": "/", ":": "/", ",": ";" }; poe("op", m[c] || c, i, 1); i++; continue; }
      throw Erro(`Não conheço o símbolo "${c}".`, i, 1);
    }
    return t;
  }

  /* ---------- 2. montar a árvore ---------- */
  /* nós: {t:"num",v} {t:"var",n} (x ou n) {t:"par",n} {t:"cte",n} {t:"neg",a} {t:"bin",op,a,b} {t:"fun",f,a,[b]} {t:"abs",a} */
  function arvore(toks, s, variavel) {
    let k = 0, barras = 0; const fim = s.length;
    const olha = () => toks[k], ehOp = (v) => toks[k] && toks[k].tipo === "op" && toks[k].v === v;
    const falta = (o) => Erro(o, toks[k] ? toks[k].pos : fim, toks[k] ? toks[k].tam : 1);
    /* começa um fator colado? (para a multiplicação implícita) */
    const comeca = () => { const p = olha(); if (!p) return false; if (p.tipo === "num" || p.tipo === "id" || p.tipo === "fun") return true; if (p.tipo === "op" && p.v === "(") return true; if (p.tipo === "op" && p.v === "|" && barras === 0) return true; return false; };
    function expressao() { let a = termo(); while (ehOp("+") || ehOp("-")) { const op = toks[k++]; if (!olha() || (olha().tipo === "op" && (");".includes(olha().v) || (olha().v === "|" && barras > 0)))) throw Erro(`Falta alguma coisa depois do "${op.v === "-" ? "−" : "+"}".`, op.pos, 1); a = { t: "bin", op: op.v, a, b: termo() }; } return a; }
    function termo() { let a = unario();
      for (;;) { if (ehOp("*") || ehOp("/")) { const op = toks[k++]; if (!olha() || (olha().tipo === "op" && (");*/^".includes(olha().v) || (olha().v === "|" && barras > 0)))) throw Erro(`Falta alguma coisa depois do "${op.v === "*" ? "·" : "/"}".`, op.pos, 1); a = { t: "bin", op: op.v, a, b: unario() }; }
        else if (comeca()) a = { t: "bin", op: "*", a, b: potencia(), impl: true };
        else return a; } }
    function unario() { if (ehOp("-")) { const op = toks[k++]; if (!olha()) throw Erro('Falta alguma coisa depois do "−".', op.pos, 1); return { t: "neg", a: unario() }; } if (ehOp("+")) { k++; return unario(); } return potencia(); }
    function potencia() { let a = pos(); if (ehOp("^")) { const op = toks[k++]; if (!olha()) throw Erro('Falta o expoente depois do "^".', op.pos, 1); a = { t: "bin", op: "^", a, b: unario() }; } return a; }
    function pos() { let a = atomo(); while (olha() && olha().tipo === "sup") a = { t: "bin", op: "^", a, b: { t: "num", v: toks[k++].v } }; return a; }
    function parenteses() { const ab = toks[k++]; if (ehOp(")")) throw Erro("Estes parênteses estão vazios.", ab.pos, 2); const guarda = barras; barras = 0; const a = expressao(); barras = guarda; if (!ehOp(")")) throw Erro('Este parêntese foi aberto e não foi fechado: falta um ")".', ab.pos, 1); k++; return a; }
    function argumentos() { /* ( a ) ou ( a ; b ) */ const ab = toks[k++]; if (ehOp(")")) throw Erro("Falta o que vai dentro dos parênteses da função.", ab.pos, 2); const guarda = barras; barras = 0; const l = [expressao()]; while (ehOp(";")) { k++; l.push(expressao()); } barras = guarda; if (!ehOp(")")) throw Erro('Este parêntese foi aberto e não foi fechado: falta um ")".', ab.pos, 1); k++; return l; }
    function funcao(p) {
      let expo = null, base = null;
      if (p.v === "logb") { const b = toks[k]; if (b && b.tipo === "base") { k++; base = { t: "num", v: b.v }; } else if (b && b.tipo === "basev") { k++; const q = olha(); if (!q) throw Erro("Falta a base do logaritmo depois de log_.", p.pos, p.tam + 1); if (q.tipo === "num") { k++; base = { t: "num", v: q.v }; } else if (q.tipo === "id") { base = atomo(); } else if (q.tipo === "op" && q.v === "(") base = parenteses(); else throw Erro("Não entendi a base do logaritmo: escreva log_2(x) ou log_b(x).", q.pos, q.tam); } }
      else if (ehOp("^")) { /* sen^2(x) = (sen x)² */ k++; const q = olha(); if (!q) throw Erro('Falta o expoente depois do "^".', p.pos, p.tam + 1); if (q.tipo === "num") { k++; expo = { t: "num", v: q.v }; } else if (q.tipo === "op" && q.v === "(") expo = parenteses(); else throw Erro("Depois de " + s.slice(p.pos, p.pos + p.tam) + "^ eu esperava um número, como em sen^2(x).", q.pos, q.tam); }
      else if (olha() && olha().tipo === "sup") expo = { t: "num", v: toks[k++].v };
      let args;
      if (ehOp("(")) args = argumentos();
      else { /* sem parênteses: o argumento é o que vem colado (sen x, sen 2x, ln x²) */ if (!comeca()) throw Erro(`Falta o argumento de ${s.slice(p.pos, p.pos + p.tam)}: escreva, por exemplo, ${s.slice(p.pos, p.pos + p.tam)}(x).`, p.pos, p.tam); let a = potencia(); while (comeca() && olha().tipo !== "fun") a = { t: "bin", op: "*", a, b: potencia(), impl: true }; args = [a]; }
      let no;
      if (p.v === "logb") { if (!base) throw Erro("Falta a base do logaritmo depois de log_.", p.pos, p.tam); if (args.length !== 1) throw Erro("log_b(x) recebe um valor só dentro dos parênteses.", p.pos, p.tam); no = { t: "fun", f: "logb", a: args[0], b: base }; }
      else if (p.v === "log" && args.length === 2) no = { t: "fun", f: "logb", a: args[1], b: args[0] }; /* log(b; x) */
      else { if (args.length !== 1) throw Erro(`${s.slice(p.pos, p.pos + p.tam)} recebe um valor só${p.v === "log" ? " (ou dois: log(base; x))" : ""}. Para número com vírgula dentro de log(b, x), ponha um espaço depois da vírgula ou use ponto e vírgula.`, p.pos, p.tam); no = { t: "fun", f: p.v, a: args[0] }; }
      return expo ? { t: "bin", op: "^", a: no, b: expo, fexp: true } : no;
    }
    function atomo() { const p = olha();
      if (!p) throw Erro(k ? "A expressão acabou antes da hora: falta alguma coisa no fim." : "Escreva uma função, por exemplo y = x² − 3x + 2.", fim, 1);
      if (p.tipo === "num") { k++; return { t: "num", v: p.v }; }
      if (p.tipo === "fun") { k++; return funcao(p); }
      if (p.tipo === "id") { k++; if (p.v === "X") p.v = "x"; if (p.v === "pi") return { t: "cte", n: "pi" }; if (p.v === "e") return { t: "cte", n: "e" }; if (p.v === variavel) return { t: "var", n: variavel };
        if (p.v === "x" || p.v === "n" || p.v === "y") { if (p.v === "y") throw Erro('O "y" só pode aparecer antes do sinal de igual (y = …).', p.pos, 1); if (variavel === "n") throw Erro('Numa sequência (aₙ = …) a variável é "n", não "x".', p.pos, 1); if (p.v === "n") return { t: "par", n: "n" }; }
        return { t: "par", n: p.v }; }
      if (p.tipo === "op" && p.v === "(") return parenteses();
      if (p.tipo === "op" && p.v === "|") { k++; if (ehOp("|") && (!toks[k + 1] || (toks[k + 1].tipo === "op" && ")*/^+;".includes(toks[k + 1].v)))) throw Erro("Estas barras de módulo estão vazias.", p.pos, 2); barras++; const a = expressao(); barras--; if (!ehOp("|")) throw Erro('Esta barra de módulo foi aberta e não foi fechada: falta um "|".', p.pos, 1); k++; return { t: "abs", a }; }
      if (p.tipo === "op" && p.v === ")") throw Erro('Há um ")" sobrando: ele fecha um parêntese que não foi aberto.', p.pos, 1);
      if (p.tipo === "op" && (p.v === "*" || p.v === "/" || p.v === "^")) throw Erro(`Falta alguma coisa antes do "${p.v === "*" ? "·" : p.v}".`, p.pos, 1);
      if (p.tipo === "sup") throw Erro("Este expoente não está em cima de nada.", p.pos, p.tam);
      if (p.tipo === "op" && p.v === "=") throw Erro('Só pode haver um sinal de igual, e antes dele vai "y", "f(x)" ou "aₙ".', p.pos, 1);
      if (p.tipo === "op" && p.v === ";") throw Erro("Esta vírgula (ou ponto e vírgula) está fora de lugar: ela só separa os dois valores de log(b; x).", p.pos, 1);
      throw Erro(`Não esperava "${s.slice(p.pos, p.pos + p.tam)}" aqui.`, p.pos, p.tam);
    }
    const a = expressao();
    if (k < toks.length) { const p = toks[k]; if (p.tipo === "op" && p.v === ")") throw Erro('Há um ")" sobrando: ele fecha um parêntese que não foi aberto.', p.pos, 1); if (p.tipo === "op" && p.v === "|") throw Erro('Há uma barra "|" sobrando.', p.pos, 1); if (p.tipo === "op" && p.v === "=") throw Erro('Só pode haver um sinal de igual, e antes dele vai "y", "f(x)" ou "aₙ".', p.pos, 1); if (p.tipo === "op" && p.v === ";") throw Erro("Esta vírgula (ou ponto e vírgula) está fora de lugar: ela só separa os dois valores de log(b; x). Número com vírgula se escreve sem espaço: 2,5.", p.pos, 1);
      throw Erro(`Não esperava "${s.slice(p.pos, p.pos + p.tam)}" aqui.`, p.pos, p.tam); }
    return a;
  }

  /* ---------- 3. ler uma linha inteira: "y = …", "f(x) = …", "aₙ = …" ou só a expressão ---------- */
  G.le = (texto) => {
    const s = String(texto == null ? "" : texto);
    if (!s.trim()) throw Erro("Escreva uma função, por exemplo y = x² − 3x + 2.", 0, 1);
    if (s.length > 300) throw Erro("Expressão comprida demais (o limite é de 300 caracteres).", 300, 1);
    let ini = 0, tipo = "funcao", nome = "y";
    const ig = s.indexOf("=");
    if (ig >= 0) { const esq = s.slice(0, ig).replace(/\s+/g, "");
      if (/^[yY]$/.test(esq)) nome = "y";
      else if (/^[A-Za-zА-Яа-яЁёΑ-ω]\(x\)$/.test(esq)) nome = esq[0] + "(x)";
      else if (/^[A-Za-zА-Яа-яЁё](_n|ₙ|_\{n\}|\(n\))$/.test(esq)) { tipo = "sequencia"; nome = esq[0]; }
      else if (!esq) throw Erro('Falta o que vem antes do sinal de igual: "y", "f(x)" ou "aₙ".', 0, ig + 1);
      else throw Erro('Antes do sinal de igual eu só entendo "y", "f(x)" (ou outra letra) e "a_n" para sequência. Equação com x dos dois lados não é desenhada aqui.', 0, ig);
      ini = ig + 1; if (!s.slice(ini).trim()) throw Erro("Falta a expressão depois do sinal de igual.", ig, 1); }
    const variavel = tipo === "sequencia" ? "n" : "x";
    let toks; try { toks = pedacos(s.slice(ini)); } catch (e) { if (e.graf) e.pos += ini; throw e; }
    toks.forEach((p) => (p.pos += ini));
    const no = arvore(toks, s, variavel);
    const ps = []; (function anda(a) { if (!a) return; if (a.t === "par" && !ps.includes(a.n)) ps.push(a.n); anda(a.a); anda(a.b); })(no);
    return { texto: s, tipo, nome, variavel, no, params: ps };
  };

  /* ---------- 4. calcular ---------- */
  const inteiro = (v) => Number.isFinite(v) && Math.round(v) === v;
  /* expoente escrito como fração de inteiros com denominador ímpar (x^(1/3), x^(2/3)): vale para base negativa */
  const fracImpar = (b) => { let sinal = 1, n = b; while (n.t === "neg") { sinal = -sinal; n = n.a; } if (n.t === "bin" && n.op === "/" && n.a.t === "num" && n.b.t === "num" && inteiro(n.a.v) && inteiro(n.b.v) && n.b.v % 2 !== 0 && n.b.v !== 0) return { p: sinal * n.a.v, q: n.b.v }; return null; };
  const pot = (a, b) => { if (a === 0 && b < 0) return NaN; if (a === 0 && b === 0) return NaN; const r = Math.pow(a, b); return Number.isFinite(r) ? r : NaN; };
  const FN = {
    sin: Math.sin, cos: Math.cos, exp: (v) => { const r = Math.exp(v); return Number.isFinite(r) ? r : NaN; }, abs: Math.abs,
    tan: (v) => { const c = Math.cos(v); return Math.abs(c) < 1e-15 ? NaN : Math.sin(v) / c; },
    cot: (v) => { const q = Math.sin(v); return Math.abs(q) < 1e-15 ? NaN : Math.cos(v) / q; },
    sec: (v) => { const c = Math.cos(v); return Math.abs(c) < 1e-15 ? NaN : 1 / c; },
    csc: (v) => { const q = Math.sin(v); return Math.abs(q) < 1e-15 ? NaN : 1 / q; },
    ln: (v) => (v > 0 ? Math.log(v) : NaN), log: (v) => (v > 0 ? Math.log10(v) : NaN), sqrt: (v) => (v >= 0 ? Math.sqrt(v) : NaN),
    asin: (v) => (v >= -1 && v <= 1 ? Math.asin(v) : NaN), acos: (v) => (v >= -1 && v <= 1 ? Math.acos(v) : NaN), atan: Math.atan,
  };
  /* devolve uma função (x, parâmetros) → número. É uma árvore de funções pequenas: nenhum texto vira código. */
  function monta(a) {
    switch (a.t) {
      case "num": { const v = a.v; return () => v; }
      case "cte": { const v = a.n === "pi" ? Math.PI : Math.E; return () => v; }
      case "var": return (x) => x;
      case "par": { const n = a.n; return (x, P) => { const v = P ? P[n] : undefined; return typeof v === "number" ? v : NaN; }; }
      case "neg": { const f = monta(a.a); return (x, P) => -f(x, P); }
      case "abs": { const f = monta(a.a); return (x, P) => Math.abs(f(x, P)); }
      case "fun": { const f = monta(a.a);
        if (a.f === "logb") { const g = monta(a.b); return (x, P) => { const v = f(x, P), b = g(x, P); return v > 0 && b > 0 && b !== 1 ? Math.log(v) / Math.log(b) : NaN; }; }
        const h = FN[a.f]; return (x, P) => h(f(x, P)); }
      case "bin": { const f = monta(a.a), g = monta(a.b);
        if (a.op === "+") return (x, P) => f(x, P) + g(x, P);
        if (a.op === "-") return (x, P) => f(x, P) - g(x, P);
        if (a.op === "*") return (x, P) => f(x, P) * g(x, P);
        if (a.op === "/") return (x, P) => { const d = g(x, P); return d === 0 ? NaN : f(x, P) / d; };
        const fr = fracImpar(a.b);
        if (fr) return (x, P) => { const b = f(x, P); if (b >= 0) return pot(b, fr.p / fr.q); const r = Math.pow(-b, Math.abs(fr.p) / Math.abs(fr.q)), s = Math.abs(fr.p) % 2 ? -r : r, v = fr.p / fr.q < 0 ? (s === 0 ? NaN : 1 / s) : s; return Number.isFinite(v) ? v : NaN; };
        return (x, P) => pot(f(x, P), g(x, P)); }
    }
    throw new Error("nó desconhecido");
  }
  G.funcao = (lida) => { const f = monta(lida.no); return (x, P) => { const v = f(x, P); return Number.isFinite(v) ? v : NaN; }; };
  G.calcula = (texto, x, P) => G.funcao(G.le(texto))(x, P || {});

  /* ---------- 5. escrever em TeX ---------- */
  const TEXF = { sin: "\\operatorname{sen}", cos: "\\cos", tan: "\\operatorname{tg}", cot: "\\operatorname{cotg}", sec: "\\sec", csc: "\\operatorname{cossec}", ln: "\\ln", log: "\\log", exp: "\\exp", asin: "\\operatorname{arcsen}", acos: "\\arccos", atan: "\\operatorname{arctg}" };
  const numTex = (v) => { if (!Number.isFinite(v)) return "?"; let s = String(v); if (/e/.test(s)) { const [m, e] = s.split("e"); return m.replace(".", "{,}") + "\\cdot 10^{" + (+e) + "}"; } return s.replace(".", "{,}"); };
  const letraTex = (n) => (/[A-Za-z]/.test(n) ? n : /[Α-ω]/.test(n) ? n : "\\text{" + n + "}"); /* cirílico vai como texto: o KaTeX não tem cirílico no modo matemático */
  const prec = (a) => (a.t === "bin" ? (a.op === "+" || a.op === "-" ? 1 : a.op === "*" ? 2 : a.op === "/" ? 3 : 4) : a.t === "neg" ? 1.5 : 9);
  function tex(a) {
    const par = (b, min) => (prec(b) < min ? "\\left(" + tex(b) + "\\right)" : tex(b));
    switch (a.t) {
      case "num": return numTex(a.v);
      case "cte": return a.n === "pi" ? "\\pi" : "e";
      case "var": return a.n;
      case "par": return letraTex(a.n);
      case "neg": return "-" + par(a.a, 2);
      case "abs": return "\\left|" + tex(a.a) + "\\right|";
      case "fun": if (a.f === "sqrt") return "\\sqrt{" + tex(a.a) + "}"; if (a.f === "abs") return "\\left|" + tex(a.a) + "\\right|"; if (a.f === "logb") return "\\log_{" + tex(a.b) + "}\\left(" + tex(a.a) + "\\right)"; return TEXF[a.f] + "\\left(" + tex(a.a) + "\\right)";
      case "bin":
        if (a.op === "+") return tex(a.a) + "+" + par(a.b, 1.5);
        if (a.op === "-") return tex(a.a) + "-" + par(a.b, 2);
        if (a.op === "/") return "\\dfrac{" + tex(a.a) + "}{" + tex(a.b) + "}";
        if (a.op === "*") { const e = par(a.a, 2), d = par(a.b, 2); /* 2x, 2π e a·x sem ponto; número × número e o resto com ponto */ const junta = a.a.t === "num" && (a.b.t === "var" || a.b.t === "par" || a.b.t === "cte" || a.b.t === "fun" || a.b.t === "abs" || (a.b.t === "bin" && (a.b.op === "^" && a.b.a.t !== "num" || prec(a.b) < 2))) || ((a.a.t === "par" || a.a.t === "var" || a.a.t === "cte") && a.b.t === "bin" && prec(a.b) < 2); return e + (junta ? "" : "\\cdot ") + d; }
        if (a.op === "^") { if (a.fexp && a.a.t === "fun" && TEXF[a.a.f]) return TEXF[a.a.f] + "^{" + tex(a.b) + "}\\left(" + tex(a.a.a) + "\\right)"; const b = a.a.t === "num" && a.a.v >= 0 || a.a.t === "var" || a.a.t === "par" || a.a.t === "cte" || a.a.t === "abs" ? tex(a.a) : "\\left(" + tex(a.a) + "\\right)"; return b + "^{" + tex(a.b).replace(/\\dfrac/g, "\\frac") + "}"; }
    }
    return "?";
  }
  G.tex = (lida) => (lida.tipo === "sequencia" ? letraTex(lida.nome) + "_n" : lida.nome === "y" ? "y" : letraTex(lida.nome[0]) + "(x)") + " = " + tex(lida.no);
  G.texNo = tex;

  /* ---------- 6. análise numérica ---------- */
  /* Há um salto (descontinuidade) entre x0 e x1? Corta o intervalo ao meio 40 vezes, indo sempre para a metade onde a função mais varia.
     Numa função contínua a variação some com o intervalo; num salto (tg x, 1/x, degrau) ela não some. Ponto fora do domínio no caminho também conta. */
  G.salto = (f, x0, x1, y0, y1) => {
    if (y0 === undefined) y0 = f(x0); if (y1 === undefined) y1 = f(x1);
    if (!Number.isFinite(y0) || !Number.isFinite(y1)) return true;
    const d0 = Math.abs(y1 - y0); if (d0 === 0) { const m = f((x0 + x1) / 2); return !Number.isFinite(m); }
    let a = x0, b = x1, ya = y0, yb = y1;
    for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (m === a || m === b) break; const ym = f(m); if (!Number.isFinite(ym)) return true; if (Math.abs(ym - ya) >= Math.abs(yb - ym)) { b = m; yb = ym; } else { a = m; ya = ym; } }
    if (Math.abs(yb - ya) > 1e-3 * d0 + 1e-9 * (Math.abs(ya) + Math.abs(yb))) return true;
    return G.assintota(f, x0, x1, y0, y1);
  };
  /* amostras para desenhar: lista de trechos contínuos [[x,y],…]. limY = altura em unidades (para decidir quando vale a pena testar um salto). */
  G.trechos = (f, xmin, xmax, n, limY) => {
    const tr = []; let at = null; const dx = (xmax - xmin) / n; let xa = NaN, ya = NaN;
    for (let i = 0; i <= n; i++) { const x = xmin + i * dx, y = f(x);
      if (!Number.isFinite(y)) { at = null; xa = x; ya = NaN; continue; }
      if (at && Number.isFinite(ya)) { const pulo = Math.abs(y - ya); if (pulo > (limY || 1) * 0.05 && G.salto(f, xa, x, ya, y)) at = null; }
      if (!at) { at = []; tr.push(at); /* começo de trecho: procura a borda do domínio para a curva não parar antes da hora (√x em 0, ln x perto de 0) */
        if (i > 0 && !Number.isFinite(ya)) { let a = xa, b = x; for (let j = 0; j < 30; j++) { const m = (a + b) / 2; if (Number.isFinite(f(m))) b = m; else a = m; } if (b < x) at.push([b, f(b)]); } }
      at.push([x, y]); xa = x; ya = y;
      if (i < n) { const yp = f(x + dx); if (!Number.isFinite(yp)) { let a = x, b = x + dx; for (let j = 0; j < 30; j++) { const m = (a + b) / 2; if (Number.isFinite(f(m))) a = m; else b = m; } if (a > x) at.push([a, f(a)]); } }
    }
    return tr.filter((t) => t.length > 0);
  };
  const bissecao = (f, a, b, fa, fb) => { for (let i = 0; i < 80; i++) { const m = (a + b) / 2; if (m === a || m === b) break; const fm = f(m); if (!Number.isFinite(fm)) return NaN; if (fm === 0) return m; if ((fm < 0) === (fa < 0)) { a = m; fa = fm; } else { b = m; fb = fm; } } return (a + b) / 2; };
  /* raízes de f em [xmin, xmax] (mudança de sinal sem salto, ou zero exato) */
  G.raizes = (f, xmin, xmax, n) => {
    n = n || 2000; const r = [], dx = (xmax - xmin) / n; let xa = xmin, ya = f(xa); const poe = (x) => { if (Number.isFinite(x) && !r.some((v) => Math.abs(v - x) < dx * 1e-3 + 1e-12)) r.push(x); };
    for (let i = 1; i <= n; i++) { const x = xmin + i * dx, y = f(x);
      if (ya === 0) poe(xa);
      else if (Number.isFinite(ya) && Number.isFinite(y) && y !== 0 && (ya < 0) !== (y < 0)) { const z = bissecao(f, xa, x, ya, y); if (Number.isFinite(z)) { const e = Math.max(Math.abs(xmax - xmin) * 1e-9, 1e-12), v = Math.abs(f(z)), viz = Math.max(Math.abs(f(z - e) || 0), Math.abs(f(z + e) || 0)); if (v <= 1e-6 * (1 + Math.min(Math.abs(ya), Math.abs(y))) && viz < 1e3 * (Math.abs(ya) + Math.abs(y)) && !G.salto(f, xa, x, ya, y)) poe(z); } }
      xa = x; ya = y; }
    if (ya === 0) poe(xa);
    if (r.length > 200) return []; /* função nula num trecho inteiro, ou oscilação fina demais para a tela: não marca nada */
    return r.sort((a, b) => a - b);
  };
  /* extremos locais: amostra mais alta (ou mais baixa) que as vizinhas, refinada por seção áurea; descarta saltos e bordas do domínio */
  const AUREA = (Math.sqrt(5) - 1) / 2;
  const aurea = (f, a, b, maximo) => { const g = maximo ? f : (x) => -f(x); let c = b - AUREA * (b - a), d = a + AUREA * (b - a), fc = g(c), fd = g(d); for (let i = 0; i < 90; i++) { if (!(Number.isFinite(fc) && Number.isFinite(fd))) return NaN; if (fc > fd) { b = d; d = c; fd = fc; c = b - AUREA * (b - a); fc = g(c); } else { a = c; c = d; fc = fd; d = a + AUREA * (b - a); fd = g(d); } if (Math.abs(b - a) < 1e-13 * (1 + Math.abs(a))) break; } return (a + b) / 2; };
  G.extremos = (f, xmin, xmax, n) => {
    n = n || 2000; const r = [], dx = (xmax - xmin) / n; const ys = []; for (let i = 0; i <= n; i++) ys.push(f(xmin + i * dx));
    for (let i = 1; i < n; i++) { const a = ys[i - 1], b = ys[i], c = ys[i + 1]; if (!(Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c))) continue;
      const mx = b > a && b >= c, mn = b < a && b <= c; if (!mx && !mn) continue; const x0 = xmin + (i - 1) * dx, x2 = xmin + (i + 1) * dx, x1 = xmin + i * dx;
      if (G.salto(f, x0, x1, a, b) || G.salto(f, x1, x2, b, c)) continue;
      /* refino: zero da derivada numérica (mais preciso que a seção áurea, que para em ~1e-8) */
      let x = aurea(f, x0, x2, mx); if (!Number.isFinite(x)) continue; if (x - x0 < dx * 1e-6 || x2 - x < dx * 1e-6) continue;
      const h = Math.max(1e-6, Math.abs(x) * 1e-6), d = (t) => (f(t + h) - f(t - h)) / (2 * h); const da = d(x0 + h), db = d(x2 - h); if (Number.isFinite(da) && Number.isFinite(db) && da !== 0 && db !== 0 && (da < 0) !== (db < 0)) { const z = bissecao(d, x0 + h, x2 - h, da, db); if (Number.isFinite(z) && Math.abs(z - x) < 1e-4 * (1 + Math.abs(x))) x = z; }
      const y = f(x); if (!Number.isFinite(y)) continue; if (!r.some((p) => Math.abs(p.x - x) < dx * 0.5)) r.push({ x, y, tipo: mx ? "max" : "min" }); }
    if (r.length > 200) return [];
    return r;
  };
  G.intersecoes = (f, g, xmin, xmax, n) => { const h = (x) => f(x) - g(x); return G.raizes(h, xmin, xmax, n).map((x) => ({ x, y: f(x) })); };
  /* derivada numérica (diferença central com dois passos e extrapolação de Richardson) */
  G.derivada = (f) => (x, P) => { const h = 1e-4 * Math.max(1, Math.abs(x)), a = f(x + h, P), b = f(x - h, P), c = f(x + 2 * h, P), d = f(x - 2 * h, P), y0 = f(x, P); if (!(Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c) && Number.isFinite(d) && Number.isFinite(y0))) return NaN; const v = (8 * (a - b) - (c - d)) / (12 * h); return Number.isFinite(v) ? v : NaN; };
  /* integral definida por Simpson, dobrando os intervalos até estabilizar. Devolve {v, ok, erro, motivo}. */
  G.integral = (f, a, b) => {
    if (!(Number.isFinite(a) && Number.isFinite(b))) return { v: NaN, ok: false, motivo: "limites" };
    if (a === b) return { v: 0, ok: true, erro: 0 };
    const s = a < b ? 1 : -1, lo = Math.min(a, b), hi = Math.max(a, b);
    /* domínio e saltos: 400 amostras; qualquer ponto fora do domínio ou assíntota dentro do intervalo invalida */
    const N0 = 400, dx = (hi - lo) / N0; let ya = f(lo); if (!Number.isFinite(ya)) return { v: NaN, ok: false, motivo: "dominio" };
    for (let i = 1; i <= N0; i++) { const x = lo + i * dx, y = f(x); if (!Number.isFinite(y)) return { v: NaN, ok: false, motivo: "dominio" }; if (Math.abs(y - ya) > 0 && G.salto(f, x - dx, x, ya, y) && G.assintota(f, x - dx, x)) return { v: NaN, ok: false, motivo: "assintota" }; /* salto finito (degrau) ainda tem integral; assíntota não */ ya = y; }
    const simpson = (n) => { const h = (hi - lo) / n; let t = f(lo) + f(hi); for (let i = 1; i < n; i++) t += (i % 2 ? 4 : 2) * f(lo + i * h); return (t * h) / 3; };
    let n = 256, v0 = simpson(n), v1 = v0, erro = Infinity;
    for (let k = 0; k < 8; k++) { n *= 2; v1 = simpson(n); erro = Math.abs(v1 - v0) / 15; if (erro <= 1e-10 * (1 + Math.abs(v1))) break; v0 = v1; }
    if (!Number.isFinite(v1)) return { v: NaN, ok: false, motivo: "dominio" };
    return { v: s * v1, ok: true, erro };
  };
  /* a função cresce sem limite dentro de (a, b)? (assíntota vertical, inclusive a que não troca de sinal, como 1/x²)
     Sobe o morro de |f|: fica sempre com a metade que contém o maior |f| visto. Num polo, |f| explode; numa função contínua, para num máximo comum. */
  G.assintota = (f, a, b, ya, yb) => { if (ya === undefined) ya = f(a); if (yb === undefined) yb = f(b); if (!Number.isFinite(ya) || !Number.isFinite(yb)) return true; const base = 1 + Math.abs(ya) + Math.abs(yb);
    for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (m === a || m === b) break; const ym = f(m); if (!Number.isFinite(ym)) return true; const A = Math.abs(ya), M = Math.abs(ym), B = Math.abs(yb);
      if (M >= A && M >= B) { /* o meio é o mais alto: o pico está de um dos lados; olha um ponto de cada lado */ const e = f((a + m) / 2), d = f((m + b) / 2); if (!Number.isFinite(e) || !Number.isFinite(d)) return true; if (Math.abs(e) >= Math.abs(d)) { b = m; yb = ym; } else { a = m; ya = ym; } }
      else if (A >= B) { b = m; yb = ym; } else { a = m; ya = ym; }
      if (Math.max(Math.abs(ya), Math.abs(yb)) > 1e6 * base) return true; }
    return false; };

  /* ---------- 7. números para a tela ---------- */
  /* reconhece múltiplos simples de π (π/2, 3π/4, 2π…) para mostrar ao lado do decimal */
  G.emPi = (v) => { if (!Number.isFinite(v) || Math.abs(v) < 1e-9) return null; for (const q of [1, 2, 3, 4, 6]) { const p = (v * q) / Math.PI, r = Math.round(p); if (r !== 0 && Math.abs(p - r) < 1e-7 * Math.max(1, Math.abs(p)) && Math.abs(r) <= 24) { const g = (function mdc(a, b) { return b ? mdc(b, a % b) : a; })(Math.abs(r), q), n = r / g, d = q / g; return (n === 1 ? "" : n === -1 ? "−" : String(n).replace("-", "−")) + "π" + (d === 1 ? "" : "/" + d); } } return null; };
  G.num = (v, casas) => { if (!Number.isFinite(v)) return "—"; if (Math.abs(v) < 5e-10) v = 0; const a = Math.abs(v); let s; if (a !== 0 && (a >= 1e7 || a < 1e-4)) { const e = Math.floor(Math.log10(a)), m = v / Math.pow(10, e); s = m.toFixed(3).replace(/\.?0+$/, "") + "·10^" + e; } else { const r = Math.round(v); s = Math.abs(v - r) < 1e-7 * Math.max(1, a) ? String(r) : v.toFixed(casas === undefined ? 4 : casas).replace(/\.?0+$/, ""); if (s === "-0") s = "0"; } return s.replace(".", ",").replace("-", "−"); };
  /* passo "bonito" (1, 2 ou 5 × potência de 10) para os números dos eixos */
  G.passo = (bruto) => { const e = Math.pow(10, Math.floor(Math.log10(bruto))), m = bruto / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; };

  if (typeof module !== "undefined" && module.exports) module.exports = G; else raiz.GRAF = G;
})(typeof window !== "undefined" ? window : globalThis);
