/* ==========================================================
   Calculadora científica do site (β 2.2).
   Teclas na mesma ordem de uma calculadora científica comum de vestibular (a do Lucas):
   SHIFT (dourado) e ALPHA (rosa) dão as funções escritas em cima das teclas.
   Modos: COMP, CMPLX, STAT, BASE-N, EQN, MATRIX, TABLE, VECTOR. Também CONST, CONV, CALC, SOLVE, ∫, d/dx, Σ.
   Entrada linear (com cursor); resultado em forma exata (fração, √, π) ou decimal (S⇔D troca).
   Liga e desliga na engrenagem (Configurações → Calculadora).
   ========================================================== */
(function () {
  "use strict";
  const CALC = (window.CALC = {});
  class Erro extends Error {}
  const ERR = (t) => { throw new Erro(t); };

  /* ---------------- constantes (CODATA 2018) e conversões, na ordem das listas CONST e CONV ---------------- */
  const CONST = [
    ["mp", "massa do próton", 1.67262192369e-27, "kg"], ["mn", "massa do nêutron", 1.67492749804e-27, "kg"], ["me", "massa do elétron", 9.1093837015e-31, "kg"],
    ["mμ", "massa do múon", 1.883531627e-28, "kg"], ["a0", "raio de Bohr", 5.29177210903e-11, "m"], ["h", "constante de Planck", 6.62607015e-34, "J·s"],
    ["μN", "magnéton nuclear", 5.0507837461e-27, "J/T"], ["μB", "magnéton de Bohr", 9.2740100783e-24, "J/T"], ["ħ", "Planck reduzida", 1.054571817e-34, "J·s"],
    ["α", "estrutura fina", 7.2973525693e-3, ""], ["re", "raio clássico do elétron", 2.8179403262e-15, "m"], ["λc", "comprimento de Compton", 2.42631023867e-12, "m"],
    ["γp", "razão giromagnética do próton", 2.6752218744e8, "1/(s·T)"], ["λcp", "Compton do próton", 1.32140985539e-15, "m"], ["λcn", "Compton do nêutron", 1.31959090581e-15, "m"],
    ["R∞", "constante de Rydberg", 10973731.56816, "1/m"], ["u", "unidade de massa atômica", 1.6605390666e-27, "kg"], ["μp", "momento magnético do próton", 1.41060679736e-26, "J/T"],
    ["μe", "momento magnético do elétron", -9.2847647043e-24, "J/T"], ["μn", "momento magnético do nêutron", -9.6623651e-27, "J/T"], ["μμ", "momento magnético do múon", -4.4904483e-26, "J/T"],
    ["F", "constante de Faraday", 96485.33212, "C/mol"], ["e", "carga elementar", 1.602176634e-19, "C"], ["NA", "número de Avogadro", 6.02214076e23, "1/mol"],
    ["k", "constante de Boltzmann", 1.380649e-23, "J/K"], ["Vm", "volume molar (273,15 K; 100 kPa)", 0.02271095464, "m³/mol"], ["R", "constante dos gases", 8.314462618, "J/(mol·K)"],
    ["C0", "velocidade da luz", 299792458, "m/s"], ["C1", "1ª constante de radiação", 3.741771852e-16, "W·m²"], ["C2", "2ª constante de radiação", 0.01438776877, "m·K"],
    ["σ", "Stefan–Boltzmann", 5.670374419e-8, "W/(m²·K⁴)"], ["ε0", "permissividade do vácuo", 8.8541878128e-12, "F/m"], ["μ0", "permeabilidade do vácuo", 1.25663706212e-6, "N/A²"],
    ["φ0", "quantum de fluxo magnético", 2.067833848e-15, "Wb"], ["g", "gravidade padrão", 9.80665, "m/s²"], ["G0", "quantum de condutância", 7.748091729e-5, "S"],
    ["Z0", "impedância do vácuo", 376.730313668, "Ω"], ["t", "temperatura Celsius (0 °C)", 273.15, "K"], ["G", "constante gravitacional", 6.6743e-11, "N·m²/kg²"],
    ["atm", "atmosfera padrão", 101325, "Pa"],
  ];
  const lin = (k) => [(x) => x * k, (x) => x / k];
  const CONVBASE = [["in", "cm", 2.54], ["ft", "m", 0.3048], ["yd", "m", 0.9144], ["mile", "km", 1.609344], ["n mile", "m", 1852], ["acre", "m²", 4046.8564224],
    ["gal(US)", "ℓ", 3.785411784], ["gal(UK)", "ℓ", 4.54609], ["pc", "km", 3.0856775814913673e13], ["km/h", "m/s", 1 / 3.6], ["oz", "g", 28.349523125], ["lb", "kg", 0.45359237],
    ["atm", "Pa", 101325], ["mmHg", "Pa", 133.322387415], ["hp", "kW", 0.745699872], ["kgf/cm²", "Pa", 98066.5], ["kgf·m", "J", 9.80665], ["lbf/in²", "kPa", 6.894757293168361]];
  const CONV = [];
  CONVBASE.forEach(([a, b, k]) => { const [ida, volta] = lin(k); CONV.push([`${a}▸${b}`, ida], [`${b}▸${a}`, volta]); });
  CONV.push(["°F▸°C", (x) => ((x - 32) * 5) / 9], ["°C▸°F", (x) => (x * 9) / 5 + 32], ["J▸cal", (x) => x / 4.184], ["cal▸J", (x) => x * 4.184]);
  CALC.CONST = CONST; CALC.CONV = CONV;

  /* ---------------- estado ---------------- */
  const novoEd = () => ({ tok: [], cur: 0 });
  const st = {
    modo: "COMP", tela: "edit", shift: false, alpha: false, hyp: false, sto: false, rcl: false, ins: false,
    ed: novoEd(), buf: novoEd(), hist: [], hpos: -1,
    cfg: { io: "Math", ang: "D", fmt: { t: "Norm", n: 1 }, frac: "d/c", cx: "a+bi" },
    vars: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, X: 0, Y: 0, M: 0 }, ans: 0,
    res: null, menu: null, prompt: null, erro: null, base: "DEC",
    stat: { tipo: null, x: [], y: [], cur: { r: 0, c: 0 } },
    eqn: { tipo: null, coef: [], cur: { r: 0, c: 0 }, sol: null, si: 0 },
    mats: { A: null, B: null, C: null, Ans: null }, vcts: { A: null, B: null, C: null, Ans: null }, med: null,
    tab: { f: novoEd(), ini: 1, fim: 5, passo: 1, linhas: [], cur: 0 },
  };
  CALC.st = st;

  /* ---------------- números ---------------- */
  const isC = (v) => v && typeof v === "object" && "re" in v;
  const isM = (v) => v && typeof v === "object" && "m" in v;
  const isV = (v) => v && typeof v === "object" && "v" in v;
  const cx = (re, im) => ({ re, im });
  const toC = (v) => (isC(v) ? v : cx(v, 0));
  const simpC = (v) => (isC(v) && Math.abs(v.im) < 1e-14 * Math.max(1, Math.abs(v.re)) ? v.re : v);
  const cMul = (a, b) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const cDiv = (a, b) => { const d = b.re * b.re + b.im * b.im; if (d === 0) ERR("Math"); return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
  const cAbs = (a) => Math.hypot(a.re, a.im);
  const cExp = (a) => cx(Math.exp(a.re) * Math.cos(a.im), Math.exp(a.re) * Math.sin(a.im));
  const cLog = (a) => cx(Math.log(cAbs(a)), Math.atan2(a.im, a.re));
  const real = (v) => { if (isC(v)) { const s = simpC(v); if (isC(s)) ERR("Math"); return s; } if (typeof v !== "number") ERR("Math"); return v; };
  const chk = (v) => { if (typeof v === "number" && !isFinite(v)) ERR("Math"); if (isC(v) && (!isFinite(v.re) || !isFinite(v.im))) ERR("Math"); return v; };
  const cplxOK = () => st.modo === "CMPLX";

  function add(a, b) {
    if (isM(a) && isM(b)) { if (a.m.length !== b.m.length || a.m[0].length !== b.m[0].length) ERR("Dimension"); return { m: a.m.map((r, i) => r.map((x, j) => x + b.m[i][j])) }; }
    if (isV(a) && isV(b)) { if (a.v.length !== b.v.length) ERR("Dimension"); return { v: a.v.map((x, i) => x + b.v[i]) }; }
    if (isM(a) || isM(b) || isV(a) || isV(b)) ERR("Dimension");
    if (isC(a) || isC(b)) { a = toC(a); b = toC(b); return simpC(cx(a.re + b.re, a.im + b.im)); }
    return a + b;
  }
  const neg = (a) => (isM(a) ? { m: a.m.map((r) => r.map((x) => -x)) } : isV(a) ? { v: a.v.map((x) => -x) } : isC(a) ? cx(-a.re, -a.im) : -a);
  const sub = (a, b) => add(a, neg(b));
  function mul(a, b) {
    if (isM(a) && isM(b)) { if (a.m[0].length !== b.m.length) ERR("Dimension"); return { m: a.m.map((r) => b.m[0].map((_, j) => r.reduce((s, x, k) => s + x * b.m[k][j], 0))) }; }
    if (isV(a) && isV(b)) { /* × entre vetores = produto vetorial */ if (a.v.length !== 3 || b.v.length !== 3) ERR("Dimension"); const [x, y, z] = a.v, [u, v, w] = b.v; return { v: [y * w - z * v, z * u - x * w, x * v - y * u] }; }
    if (isM(a) && isV(b)) { if (a.m[0].length !== b.v.length) ERR("Dimension"); return { v: a.m.map((r) => r.reduce((s, x, k) => s + x * b.v[k], 0)) }; }
    if (isM(a) || isV(a)) { const k = real(b); return isM(a) ? { m: a.m.map((r) => r.map((x) => x * k)) } : { v: a.v.map((x) => x * k) }; }
    if (isM(b) || isV(b)) return mul(b, a);
    if (isC(a) || isC(b)) return simpC(cMul(toC(a), toC(b)));
    return a * b;
  }
  function div(a, b) {
    if (isM(b) || isV(b)) ERR("Math");
    if (isM(a) || isV(a)) { const k = real(b); if (k === 0) ERR("Math"); return mul(a, 1 / k); }
    if (isC(a) || isC(b)) return simpC(cDiv(toC(a), toC(b)));
    if (b === 0) ERR("Math");
    return a / b;
  }
  function inv(a) {
    if (isM(a)) {
      const n = a.m.length; if (n !== a.m[0].length) ERR("Dimension");
      const M = a.m.map((r, i) => [...r, ...r.map((_, j) => (i === j ? 1 : 0))]);
      for (let c = 0; c < n; c++) {
        let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
        if (Math.abs(M[p][c]) < 1e-14) ERR("Math"); [M[c], M[p]] = [M[p], M[c]];
        const d = M[c][c]; M[c] = M[c].map((x) => x / d);
        for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c]; M[r] = M[r].map((x, k) => x - f * M[c][k]); }
      }
      return { m: M.map((r) => r.slice(n)) };
    }
    return div(1, a);
  }
  function det(a) {
    if (!isM(a)) ERR("Math"); const n = a.m.length; if (n !== a.m[0].length) ERR("Dimension");
    const M = a.m.map((r) => [...r]); let d = 1;
    for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r; if (M[p][c] === 0) return 0; if (p !== c) { [M[c], M[p]] = [M[p], M[c]]; d = -d; } d *= M[c][c]; for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k < n; k++) M[r][k] -= f * M[c][k]; } }
    return d;
  }
  function pow(a, b) {
    if (isM(a)) { const n = real(b); if (!Number.isInteger(n) || n < 1) ERR("Math"); let r = a; for (let k = 1; k < n; k++) r = mul(r, a); return r; }
    if (isV(a) || isM(b) || isV(b)) ERR("Math");
    if (isC(a) || isC(b) || (cplxOK() && a < 0 && !Number.isInteger(b))) {
      a = toC(a); b = toC(b);
      if (b.im === 0 && Number.isInteger(b.re) && Math.abs(b.re) <= 1000) { let r = cx(1, 0); const n = Math.abs(b.re); for (let k = 0; k < n; k++) r = cMul(r, a); return simpC(b.re < 0 ? cDiv(cx(1, 0), r) : r); }
      if (a.re === 0 && a.im === 0) return 0;
      return simpC(cExp(cMul(b, cLog(a))));
    }
    if (a < 0 && !Number.isInteger(b)) {
      /* raiz ímpar de negativo: (−8)^(1/3) = −2, como na calculadora */
      const q = fracao(b, 99); if (q && q[1] % 2 === 1) { const r = Math.pow(-a, Math.abs(b)); return (q[0] % 2 ? -1 : 1) * (b < 0 ? 1 / r : r); }
      ERR("Math");
    }
    if (a === 0 && b < 0) ERR("Math");
    return Math.pow(a, b);
  }

  /* ---------------- ângulos ---------------- */
  const paraRad = (x) => (st.cfg.ang === "D" ? (x * Math.PI) / 180 : st.cfg.ang === "G" ? (x * Math.PI) / 200 : x);
  const deRad = (x) => (st.cfg.ang === "D" ? (x * 180) / Math.PI : st.cfg.ang === "G" ? (x * 200) / Math.PI : x);
  const limpaTrig = (v) => (Math.abs(v) < 1e-13 ? 0 : Math.abs(Math.abs(v) - 1) < 1e-13 ? Math.sign(v) : v);
  function trig(f, x) {
    x = real(x);
    const meiaVolta = st.cfg.ang === "D" ? 180 : st.cfg.ang === "G" ? 200 : Math.PI;
    if (f === "tan") { const k = x / meiaVolta - 0.5; if (st.cfg.ang !== "R" && Math.abs(k - Math.round(k)) < 1e-12) ERR("Math"); }
    if (st.cfg.ang !== "R") { /* múltiplos exatos (sen 180° = 0) */ const k = x / (meiaVolta / 2); if (Math.abs(k - Math.round(k)) < 1e-12) { const n = ((Math.round(k) % 4) + 4) % 4; if (f === "sin") return [0, 1, 0, -1][n]; if (f === "cos") return [1, 0, -1, 0][n]; if (f === "tan") return 0; } }
    return limpaTrig(Math[f](paraRad(x)));
  }
  function trigInv(f, x) { x = real(x); if ((f === "asin" || f === "acos") && Math.abs(x) > 1) ERR("Math"); return deRad(Math[f](x)); }

  /* ---------------- tokens ---------------- */
  const T = (k, s, x = {}) => ({ k, s, ...x });
  const FN = (f, s, x = {}) => T("fn", s, { f, ...x });
  const POST = (p, s, x = {}) => T("post", s, { p, ...x });
  const contem = (tok, pred) => tok.some(pred);

  /* ---------------- análise (tokens → árvore) ---------------- */
  function analisa(tokens) {
    /* junta os dígitos em números */
    const L = [], N = tokens.length, ehDig = (t) => t && (t.k === "dig" || (t.k === "hexd" && st.modo === "BASE"));
    for (let i = 0; i < N; i++) {
      const t = tokens[i];
      if (ehDig(t) || t.k === "E") {
        let s = "";
        while (i < N && ehDig(tokens[i])) s += tokens[i++].s;
        if (st.modo !== "BASE" && i < N && tokens[i].k === "E") {
          if (!s) s = "1"; s += "e"; i++;
          if (i < N && tokens[i].k === "neg") { s += "-"; i++; }
          let ex = ""; while (i < N && tokens[i].k === "dig" && tokens[i].s !== ".") ex += tokens[i++].s;
          if (!ex) ERR("Syntax"); s += ex;
        }
        i--;
        if (!s) ERR("Syntax");
        L.push(T("numero", s));
      } else L.push(t);
    }
    let p = 0;
    const olha = () => L[p], pega = () => L[p++];
    const fimOuFecha = () => { if (olha() && olha().k === "rp") p++; };
    const comeca = (t) => t && ["numero", "var", "ans", "pi", "e", "i", "const", "svar", "mat", "vct", "lp", "fn", "ran", "basep"].includes(t.k);
    function eq() { const a = logica(); if (olha() && olha().k === "eq") { p++; return { t: "eq", a, b: logica() }; } return a; }
    function logica() { let a = eLog(); while (olha() && olha().k === "binop" && ["or", "xor", "xnor"].includes(olha().o)) { const o = pega().o; a = { t: "bin", o, a, b: eLog() }; } return a; }
    function eLog() { let a = soma(); while (olha() && olha().k === "binop" && olha().o === "and") { p++; a = { t: "bin", o: "and", a, b: soma() }; } return a; }
    function soma() { let a = produto(); while (olha() && olha().k === "op" && (olha().o === "+" || olha().o === "−")) { const o = pega().o; a = { t: "bin", o, a, b: produto() }; } return a; }
    function produto() { let a = perm(); while (olha() && olha().k === "op" && (olha().o === "×" || olha().o === "÷")) { const o = pega().o; a = { t: "bin", o, a, b: perm() }; } return a; }
    function perm() { let a = angulo(); while (olha() && olha().k === "binop" && (olha().o === "nPr" || olha().o === "nCr")) { const o = pega().o; a = { t: "bin", o, a, b: angulo() }; } return a; }
    function angulo() { let a = implicita(); while (olha() && olha().k === "ang") { p++; a = { t: "polar", r: a, th: implicita() }; } return a; }
    function implicita() { let a = unario(); while (comeca(olha())) a = { t: "bin", o: "×", a, b: unario(true) }; return a; }
    function unario(semNeg) { if (!semNeg && olha() && olha().k === "neg") { p++; return { t: "neg", a: unario() }; } return fracao_(); }
    function fracao_() { const a = potencia(); if (olha() && olha().k === "frac") { p++; const b = potencia(); if (olha() && olha().k === "frac") { p++; const c = potencia(); return { t: "mista", a, b, c }; } return { t: "bin", o: "÷", a, b, frac: true }; } return a; }
    function potencia() {
      let a = pos();
      while (olha() && (olha().k === "pow" || olha().k === "root")) {
        const k = pega().k; const b = eq(); fimOuFecha();
        a = posfixos(k === "pow" ? { t: "pow", a, b } : { t: "root", n: a, x: b });
      }
      return a;
    }
    function pos() { return posfixos(primario()); }
    function posfixos(a) { while (olha() && olha().k === "post") a = { t: "post", p: olha().p, x: pega(), a }; return a; }
    function primario() {
      const t = pega();
      if (!t) ERR("Syntax");
      switch (t.k) {
        case "numero": {
          let v = st.modo === "BASE" ? lerBase(t.s, st.base) : +t.s;
          if (st.modo !== "BASE" && isNaN(v)) ERR("Syntax");
          if (olha() && olha().k === "dms") { /* graus°minutos°segundos° */
            p++; let fator = 1 / 60;
            while (olha() && olha().k === "numero" && L[p + 1] && L[p + 1].k === "dms" && fator > 1e-4) { v += +pega().s * fator; p++; fator /= 60; }
          }
          return { t: "num", v };
        }
        case "basep": { const n = pega(); if (!n || n.k !== "numero") ERR("Syntax"); return { t: "num", v: lerBase(n.s, t.b) }; }
        case "var": return { t: "var", n: t.n };
        case "ans": return { t: "ans" };
        case "pi": return { t: "num", v: Math.PI, pi: true };
        case "e": return { t: "num", v: Math.E };
        case "i": if (!cplxOK()) ERR("Syntax"); return { t: "i" };
        case "const": return { t: "num", v: CONST[t.i][2] };
        case "svar": return { t: "svar", n: t.n };
        case "mat": return { t: "mat", n: t.n };
        case "vct": return { t: "vct", n: t.n };
        case "ran": return { t: "ran" };
        case "lp": { const e = eq(); fimOuFecha(); return e; }
        case "fn": { const args = [eq()]; while (olha() && olha().k === "comma") { p++; args.push(eq()); } fimOuFecha(); return { t: "fn", f: t.f, args }; }
        default: ERR("Syntax");
      }
    }
    const arv = eq();
    if (p < L.length) ERR("Syntax");
    return arv;
  }

  /* ---------------- avaliação ---------------- */
  const fat = (n) => { n = real(n); if (!Number.isInteger(n) || n < 0 || n > 69) ERR("Math"); let r = 1; for (let k = 2; k <= n; k++) r *= k; return r; };
  function avalia(n, env = {}) {
    switch (n.t) {
      case "num": return n.v;
      case "i": return cx(0, 1);
      case "var": return n.n in env ? env[n.n] : st.vars[n.n];
      case "ans": return st.ans;
      case "ran": return Math.round(Math.random() * 1000) / 1000;
      case "svar": return varEst(n.n);
      case "mat": { const m = st.mats[n.n]; if (!m) ERR("Dimension"); return m; }
      case "vct": { const v = st.vcts[n.n]; if (!v) ERR("Dimension"); return v; }
      case "neg": return neg(avalia(n.a, env));
      case "polar": { if (!cplxOK()) ERR("Syntax"); const r = real(avalia(n.r, env)), th = paraRad(real(avalia(n.th, env))); return simpC(cx(r * Math.cos(th), r * Math.sin(th))); }
      case "mista": { const a = real(avalia(n.a, env)), b = real(avalia(n.b, env)), c = real(avalia(n.c, env)); if (c === 0) ERR("Math"); return a + (a < 0 ? -1 : 1) * (b / c); }
      case "pow": return chk(pow(avalia(n.a, env), avalia(n.b, env)));
      case "root": { const k = real(avalia(n.n, env)); if (k === 0) ERR("Math"); return chk(pow(avalia(n.x, env), 1 / k)); }
      case "eq": return sub(avalia(n.a, env), avalia(n.b, env));
      case "bin": {
        const a = avalia(n.a, env), b = avalia(n.b, env);
        if (st.modo === "BASE") return base32(opBase(n.o, a, b));
        switch (n.o) {
          case "+": return chk(add(a, b)); case "−": return chk(sub(a, b)); case "×": return chk(mul(a, b)); case "÷": return chk(div(a, b));
          case "nPr": case "nCr": { const x = real(a), y = real(b); if (!Number.isInteger(x) || !Number.isInteger(y) || y < 0 || x < 0 || y > x) ERR("Math"); let r = 1; for (let k = 0; k < y; k++) r = (r * (x - k)) / (n.o === "nCr" ? k + 1 : 1); return Math.round(r); }
          default: ERR("Syntax");
        }
      }
      case "post": return posfixo(n, avalia(n.a, env));
      case "fn": return funcao(n, env);
    }
    ERR("Syntax");
  }
  function posfixo(n, a) {
    switch (n.p) {
      case "sq": return chk(pow(a, 2));
      case "cube": return chk(pow(a, 3));
      case "inv": return chk(inv(a));
      case "fact": return fat(a);
      case "pct": return div(a, 100);
      case "deg": return real(a) * (st.cfg.ang === "D" ? 1 : st.cfg.ang === "R" ? Math.PI / 180 : 200 / 180);
      case "rad": return deRad(real(a));
      case "grad": return deRad((real(a) * Math.PI) / 200);
      case "conv": return CONV[n.x.i][1](real(a));
      case "yhat": return regYhat(real(a));
      case "xhat": return regXhat(real(a), 0);
      case "x1hat": return regXhat(real(a), 1);
      case "x2hat": return regXhat(real(a), 2);
      case "tval": { const e = estat(); if (!e.sx) ERR("Math"); return (real(a) - e.xm) / e.ox; }
      case "rth": st.forma = "r∠θ"; return a;
      case "abi": st.forma = "a+bi"; return a;
    }
    ERR("Syntax");
  }
  const integral = (f, a, b) => {
    /* Gauss–Kronrod adaptativo (7–15 pontos) */
    const xk = [0.991455371120813, 0.949107912342759, 0.864864423359769, 0.741531185599394, 0.586087235467691, 0.405845151377397, 0.207784955007898, 0];
    const wk = [0.022935322010529, 0.063092092629979, 0.104790010322250, 0.140653259715525, 0.169004726639267, 0.190350578064785, 0.204432940075298, 0.209482141084728];
    const wg = [0.129484966168870, 0.279705391489277, 0.381830050505119, 0.417959183673469];
    const gk = (a, b) => { const c = (a + b) / 2, h = (b - a) / 2; let K = wk[7] * f(c), G = wg[3] * f(c); for (let j = 0; j < 7; j++) { const fx = f(c - h * xk[j]) + f(c + h * xk[j]); K += wk[j] * fx; if (j % 2 === 1) G += wg[(j - 1) / 2] * fx; } return [K * h, Math.abs((K - G) * h)]; };
    let total = 0, n = 0;
    const rec = (a, b, tol, prof) => { const [v, e] = gk(a, b); n++; if (e <= tol || prof > 40 || n > 4000) return v; const m = (a + b) / 2; return rec(a, m, tol / 2, prof + 1) + rec(m, b, tol / 2, prof + 1); };
    total = rec(a, b, 1e-11 * Math.max(1, Math.abs(b - a)), 0);
    return total;
  };
  function funcao(n, env) {
    const A = (k) => avalia(n.args[k], env), R = (k) => real(A(k)), nargs = n.args.length;
    const fx = (k) => (x) => real(avalia(n.args[k], { ...env, X: x }));
    switch (n.f) {
      case "sin": case "cos": case "tan": return trig(n.f, A(0));
      case "asin": case "acos": case "atan": return trigInv(n.f, A(0));
      case "sinh": case "cosh": case "tanh": case "asinh": case "atanh": return chk(Math[n.f](R(0)));
      case "acosh": { const x = R(0); if (x < 1) ERR("Math"); return Math.acosh(x); }
      case "log": { if (nargs === 2) { const b = R(0), x = R(1); if (b <= 0 || b === 1 || x <= 0) ERR("Math"); return Math.log(x) / Math.log(b); } const x = A(0); if (isC(x)) return simpC(cDiv(cLog(x), cx(Math.LN10, 0))); if (x <= 0) ERR("Math"); return Math.log10(x); }
      case "ln": { const x = A(0); if (isC(x)) return simpC(cLog(x)); if (x <= 0) ERR("Math"); return Math.log(x); }
      case "sqrt": { const x = A(0); if (isC(x) || (cplxOK() && x < 0)) return pow(x, 0.5); if (x < 0) ERR("Math"); return Math.sqrt(x); }
      case "cbrt": return Math.cbrt(R(0));
      case "exp10": return chk(pow(10, A(0)));
      case "exp": { const x = A(0); return chk(isC(x) ? cExp(x) : Math.exp(x)); }
      case "abs": { const x = A(0); if (isC(x)) return cAbs(x); if (isV(x)) return Math.hypot(...x.v); if (isM(x)) return { m: x.m.map((r) => r.map(Math.abs)) }; return Math.abs(x); }
      case "pol": { if (nargs !== 2) ERR("Syntax"); const x = R(0), y = R(1); const r = Math.hypot(x, y), th = deRad(Math.atan2(y, x)); st.vars.X = r; st.vars.Y = th; return { par: [["r", r], ["θ", th]] }; }
      case "rec": { if (nargs !== 2) ERR("Syntax"); const r = R(0), th = paraRad(R(1)); const x = limpaTrig(r * Math.cos(th)), y = limpaTrig(r * Math.sin(th)); st.vars.X = x; st.vars.Y = y; return { par: [["X", x], ["Y", y]] }; }
      case "rnd": return arredondaVisor(R(0));
      case "ranint": { const a = R(0), b = R(1); if (!Number.isInteger(a) || !Number.isInteger(b) || a > b) ERR("Math"); return a + Math.floor(Math.random() * (b - a + 1)); }
      case "integ": { if (nargs !== 3) ERR("Syntax"); const a = R(1), b = R(2); const f = fx(0); return chk(integral(f, a, b)); }
      case "deriv": {
        if (nargs !== 2) ERR("Syntax"); const f = fx(0), x0 = R(1);
        /* diferença central com extrapolação de Richardson */
        let h = 1e-2 * Math.max(1, Math.abs(x0)); const D = [];
        for (let i = 0; i < 6; i++) { D.push([(f(x0 + h) - f(x0 - h)) / (2 * h)]); for (let j = 1; j <= i; j++) D[i].push(D[i][j - 1] + (D[i][j - 1] - D[i - 1][j - 1]) / (Math.pow(4, j) - 1)); h /= 2; }
        return chk(D[5][5]);
      }
      case "sum": { if (nargs !== 3) ERR("Syntax"); const a = R(1), b = R(2); if (!Number.isInteger(a) || !Number.isInteger(b) || b < a || b - a > 1e6) ERR("Math"); let s = 0; const f = fx(0); for (let k = a; k <= b; k++) s += f(k); return chk(s); }
      case "det": return det(A(0));
      case "trn": { const m = A(0); if (!isM(m)) ERR("Math"); return { m: m.m[0].map((_, j) => m.m.map((r) => r[j])) }; }
      case "dot": { const a = A(0), b = A(1); if (!isV(a) || !isV(b) || a.v.length !== b.v.length) ERR("Dimension"); return a.v.reduce((s, x, i) => s + x * b.v[i], 0); }
      case "arg": { const z = toC(A(0)); return deRad(Math.atan2(z.im, z.re)); }
      case "conjg": { const z = toC(A(0)); return simpC(cx(z.re, -z.im)); }
      case "not": return base32(~R(0));
      case "negb": return base32(-R(0));
      case "P": return phi(R(0));
      case "Q": return phi(R(0)) - 0.5;
      case "R": return 1 - phi(R(0));
    }
    ERR("Syntax");
  }
  /* normal padrão acumulada (erf com precisão de máquina) */
  function phi(t) { const z = Math.abs(t) / Math.SQRT2; const tt = 1 / (1 + 0.5 * z); const y = tt * Math.exp(-z * z - 1.26551223 + tt * (1.00002368 + tt * (0.37409196 + tt * (0.09678418 + tt * (-0.18628806 + tt * (0.27886807 + tt * (-1.13520398 + tt * (1.48851587 + tt * (-0.82215223 + tt * 0.17087277))))))))); const erf = 1 - y; return 0.5 * (1 + (t >= 0 ? erf : -erf)); }

  /* ---------------- BASE-N (inteiros de 32 bits) ---------------- */
  const BASES = { DEC: 10, HEX: 16, BIN: 2, OCT: 8, d: 10, h: 16, b: 2, o: 8 };
  function lerBase(s, b) { const r = BASES[b]; if (s.includes(".")) ERR("Syntax"); const v = parseInt(s, r); if (isNaN(v) || [...s.toLowerCase()].some((c) => isNaN(parseInt(c, r)))) ERR("Syntax"); return base32(v); }
  const base32 = (v) => { if (!isFinite(v)) ERR("Math"); return (Math.trunc(v) | 0); };
  function opBase(o, a, b) { a = real(a); b = real(b); switch (o) { case "+": return a + b; case "−": return a - b; case "×": return a * b; case "÷": if (b === 0) ERR("Math"); return Math.trunc(a / b); case "and": return a & b; case "or": return a | b; case "xor": return a ^ b; case "xnor": return ~(a ^ b); } ERR("Syntax"); }
  function mostraBase(v, b) { if (b === "DEC") return String(v); const r = BASES[b]; const u = v >>> 0; return u.toString(r).toUpperCase(); }

  /* ---------------- estatística ---------------- */
  const TIPOS_EST = [["1VAR", "1-VAR"], ["lin", "A+BX"], ["quad", "_+CX²"], ["ln", "ln X"], ["eexp", "e^X"], ["abexp", "A·B^X"], ["pot", "A·X^B"], ["inv", "1/X"]];
  function estat() {
    const s = st.stat, X = s.x.filter((_, i) => s.x[i] !== undefined), n = X.length, par = s.tipo !== "1VAR";
    if (!n) ERR("Math");
    const Y = par ? s.y.slice(0, n) : [];
    const S = (f) => X.reduce((t, x, i) => t + f(x, Y[i]), 0);
    const e = { n, sx: S((x) => x), sx2: S((x) => x * x), sx3: S((x) => x ** 3), sx4: S((x) => x ** 4), minX: Math.min(...X), maxX: Math.max(...X) };
    e.xm = e.sx / n; e.ox = Math.sqrt(Math.max(0, e.sx2 / n - e.xm * e.xm)); e.sxs = n > 1 ? Math.sqrt(Math.max(0, (e.sx2 - n * e.xm * e.xm) / (n - 1))) : NaN;
    if (par) {
      if (Y.some((y) => y === undefined)) ERR("Math");
      Object.assign(e, { sy: S((x, y) => y), sy2: S((x, y) => y * y), sxy: S((x, y) => x * y), sx2y: S((x, y) => x * x * y), minY: Math.min(...Y), maxY: Math.max(...Y) });
      e.ym = e.sy / n; e.oy = Math.sqrt(Math.max(0, e.sy2 / n - e.ym * e.ym)); e.sys = n > 1 ? Math.sqrt(Math.max(0, (e.sy2 - n * e.ym * e.ym) / (n - 1))) : NaN;
      const tr = { lin: [(x) => x, (y) => y], ln: [Math.log, (y) => y], eexp: [(x) => x, Math.log], abexp: [(x) => x, Math.log], pot: [Math.log, Math.log], inv: [(x) => 1 / x, (y) => y] }[s.tipo];
      if (s.tipo === "quad") {
        const M = [[n, e.sx, e.sx2], [e.sx, e.sx2, e.sx3], [e.sx2, e.sx3, e.sx4]], b = [e.sy, e.sxy, e.sx2y];
        const sol = resolveLinear(M, b); if (!sol) ERR("Math"); [e.A, e.B, e.C] = sol;
      } else {
        const u = X.map(tr[0]), w = Y.map(tr[1]); if ([...u, ...w].some((v) => !isFinite(v))) ERR("Math");
        const um = u.reduce((a, b) => a + b) / n, wm = w.reduce((a, b) => a + b) / n;
        const Suu = u.reduce((t, x) => t + (x - um) ** 2, 0), Sww = w.reduce((t, x) => t + (x - wm) ** 2, 0), Suw = u.reduce((t, x, i) => t + (x - um) * (w[i] - wm), 0);
        if (Suu === 0) ERR("Math");
        let B = Suw / Suu, A = wm - B * um; e.r = Sww === 0 ? NaN : Suw / Math.sqrt(Suu * Sww);
        if (s.tipo === "eexp" || s.tipo === "pot") A = Math.exp(A);
        if (s.tipo === "abexp") { A = Math.exp(A); B = Math.exp(B); }
        e.A = A; e.B = B;
      }
    }
    return e;
  }
  function varEst(nome) {
    if (!st.stat.tipo || st.modo !== "STAT") ERR("Syntax");
    const e = estat(), mapa = { n: e.n, xm: e.xm, ox: e.ox, sxs: e.sxs, sx: e.sx, sx2: e.sx2, sx3: e.sx3, sx4: e.sx4, ym: e.ym, oy: e.oy, sys: e.sys, sy: e.sy, sy2: e.sy2, sxy: e.sxy, sx2y: e.sx2y, minX: e.minX, maxX: e.maxX, minY: e.minY, maxY: e.maxY, A: e.A, B: e.B, C: e.C, r: e.r };
    const v = mapa[nome]; if (v === undefined || !isFinite(v)) ERR("Math"); return v;
  }
  function regYhat(x) {
    const e = estat(), t = st.stat.tipo;
    switch (t) { case "lin": return e.A + e.B * x; case "quad": return e.A + e.B * x + e.C * x * x; case "ln": if (x <= 0) ERR("Math"); return e.A + e.B * Math.log(x); case "eexp": return e.A * Math.exp(e.B * x); case "abexp": return e.A * Math.pow(e.B, x); case "pot": return e.A * Math.pow(x, e.B); case "inv": if (x === 0) ERR("Math"); return e.A + e.B / x; }
    ERR("Syntax");
  }
  function regXhat(y, raiz) {
    const e = estat(), t = st.stat.tipo;
    switch (t) {
      case "lin": if (e.B === 0) ERR("Math"); return (y - e.A) / e.B;
      case "quad": { const d = e.B * e.B - 4 * e.C * (e.A - y); if (d < 0 || e.C === 0) ERR("Math"); return (-e.B + (raiz === 2 ? -1 : 1) * Math.sqrt(d)) / (2 * e.C); }
      case "ln": return Math.exp((y - e.A) / e.B);
      case "eexp": return Math.log(y / e.A) / e.B;
      case "abexp": return Math.log(y / e.A) / Math.log(e.B);
      case "pot": return Math.pow(y / e.A, 1 / e.B);
      case "inv": return e.B / (y - e.A);
    }
    ERR("Syntax");
  }
  function resolveLinear(A, b) {
    const n = b.length, M = A.map((r, i) => [...r, b[i]]);
    for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r; if (Math.abs(M[p][c]) < 1e-12) return null; [M[c], M[p]] = [M[p], M[c]]; for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; } }
    return M.map((r, i) => r[n] / M[i][i]);
  }

  /* ---------------- EQN ---------------- */
  const TIPOS_EQN = [["2x2", "anX+bnY=cn", 2, 3], ["3x3", "anX+bnY+cnZ=dn", 3, 4], ["quad", "aX²+bX+c=0", 1, 3], ["cub", "aX³+bX²+cX+d=0", 1, 4]];
  function resolveEqn() {
    const q = st.eqn, [tipo] = TIPOS_EQN[q.tipo], C = q.coef;
    if (tipo === "2x2" || tipo === "3x3") {
      const n = tipo === "2x2" ? 2 : 3, A = C.map((r) => r.slice(0, n)), b = C.map((r) => r[n]);
      const s = resolveLinear(A, b);
      if (!s) { /* sem solução única: confere se é sistema possível */ const posto = (M) => { const X = M.map((r) => [...r]); let rk = 0; for (let c = 0; c < X[0].length && rk < X.length; c++) { let p = rk; while (p < X.length && Math.abs(X[p][c]) < 1e-12) p++; if (p === X.length) continue; [X[rk], X[p]] = [X[p], X[rk]]; for (let r = 0; r < X.length; r++) if (r !== rk) { const f = X[r][c] / X[rk][c]; for (let k = c; k < X[0].length; k++) X[r][k] -= f * X[rk][k]; } rk++; } return rk; }; return [["", posto(A) < posto(C) ? "No-Solution" : "Infinite Sol"]]; }
      return s.map((v, i) => [["X", "Y", "Z"][i], v]);
    }
    const [a, b, c, d] = C[0];
    if (a === 0) ERR("Math");
    if (tipo === "quad") {
      const D = b * b - 4 * a * c, xv = -b / (2 * a), yv = c - (b * b) / (4 * a);
      const raizes = D >= 0 ? [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)] : [cx(xv, Math.sqrt(-D) / (2 * Math.abs(a))), cx(xv, -Math.sqrt(-D) / (2 * Math.abs(a)))];
      const lista = D === 0 ? [["X", raizes[0]]] : [["X1", raizes[0]], ["X2", raizes[1]]];
      lista.push([a > 0 ? "X-Value Minimum" : "X-Value Maximum", xv], [a > 0 ? "Y-Value Minimum" : "Y-Value Maximum", yv]);
      return lista;
    }
    /* cúbica: Durand–Kerner, depois limpa as partes imaginárias pequenas */
    let z = [cx(0.4, 0.9), cx(-0.65, 0.72), cx(0.81, -0.33)];
    const P = (w) => { const p1 = cMul(w, w), p2 = cMul(p1, w); return cx(p2.re + (b / a) * p1.re + (c / a) * w.re + d / a, p2.im + (b / a) * p1.im + (c / a) * w.im); };
    for (let it = 0; it < 500; it++) { z = z.map((zi, i) => { let den = cx(1, 0); z.forEach((zj, j) => { if (i !== j) den = cMul(den, cx(zi.re - zj.re, zi.im - zj.im)); }); const q = cDiv(P(zi), den); return cx(zi.re - q.re, zi.im - q.im); }); }
    z = z.map((w) => { if (Math.abs(w.im) < 1e-9 * Math.max(1, Math.abs(w.re))) { let x = w.re; for (let k = 0; k < 5; k++) { const f = ((a * x + b) * x + c) * x + d, df = (3 * a * x + 2 * b) * x + c; if (df) x -= f / df; } return x; } return w; });
    z.sort((u, v) => (isC(u) ? 1 : 0) - (isC(v) ? 1 : 0) || (isC(u) ? 0 : v - u));
    return z.map((w, i) => [`X${i + 1}`, w]);
  }

  /* ---------------- SOLVE ---------------- */
  function resolveSolve(arv, nomeVar, x0) {
    const f = (x) => real(avalia(arv, { [nomeVar]: x }));
    const tenta = (x) => { try { const v = f(x); return isFinite(v) ? v : NaN; } catch (e) { return NaN; } };
    let x = x0;
    for (let it = 0; it < 200; it++) {
      const fx = tenta(x); if (isNaN(fx)) break;
      if (Math.abs(fx) < 1e-15) return [x, fx];
      const h = 1e-7 * Math.max(1, Math.abs(x)), d = (tenta(x + h) - tenta(x - h)) / (2 * h);
      if (!isFinite(d) || d === 0) break;
      let nx = x - fx / d; if (!isFinite(nx)) break;
      if (Math.abs(nx - x) < 1e-13 * Math.max(1, Math.abs(x))) { x = nx; return [x, tenta(x)]; }
      x = nx;
    }
    /* procura uma troca de sinal perto do chute e faz bissecção */
    let a = x0, fa = tenta(a), passo = 0.1 * Math.max(1, Math.abs(x0));
    for (let k = 0; k < 120; k++) {
      for (const bb of [x0 + passo, x0 - passo]) {
        const fb = tenta(bb);
        if (!isNaN(fa) && !isNaN(fb) && fa * fb <= 0) {
          let lo = Math.min(a, bb), hi = Math.max(a, bb), flo = tenta(lo);
          for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2, fm = tenta(m); if (isNaN(fm)) break; if (flo * fm <= 0) hi = m; else { lo = m; flo = fm; } }
          const r = (lo + hi) / 2; return [r, tenta(r)];
        }
      }
      passo *= 1.3;
    }
    ERR("Can't Solve");
  }

  /* ---------------- formatação do visor ---------------- */
  function fracao(x, maxDen = 10000) {
    if (!isFinite(x)) return null;
    const s = x < 0 ? -1 : 1; x = Math.abs(x);
    let h0 = 0, h1 = 1, k0 = 1, k1 = 0, b = x;
    for (let i = 0; i < 40; i++) {
      const a = Math.floor(b), h = a * h1 + h0, k = a * k1 + k0;
      if (k > maxDen) break;
      if (Math.abs(x - h / k) <= 1e-12 * Math.max(1, x)) return [s * h, k];
      h0 = h1; h1 = h; k0 = k1; k1 = k;
      if (b - a < 1e-15) break; b = 1 / (b - a);
    }
    return null;
  }
  const SQFREE = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 29, 30, 31, 33, 34, 35, 37, 38, 39, 41, 42, 43, 46, 47, 51, 53, 55, 57, 58, 59, 61, 62, 65, 66, 67, 69, 70, 71, 73, 74, 77, 78, 79, 82, 83, 85, 86, 87, 89, 91, 93, 94, 95, 97];
  function exato(x, dicas) {
    if (typeof x !== "number" || !isFinite(x) || x === 0) return null;
    if (Math.abs(x - Math.round(x)) < 1e-9 * Math.max(1, Math.abs(x))) return null;
    const fr = (p, q, extra = "") => { const sg = p < 0 ? "-" : ""; p = Math.abs(p); if (q === 1) return `${sg}${p === 1 && extra ? "" : p}${extra}`; return `${sg}\\frac{${p === 1 && extra ? "" : p}${extra}}{${q}}`; };
    const r = fracao(x); if (r && Math.abs(r[0]) < 1e10 && r[1] > 1) return fr(r[0], r[1]);
    if (dicas.raiz) for (const c of SQFREE) { const q = fracao(x / Math.sqrt(c), 1000); if (q && Math.abs(q[0]) < 1000) return fr(q[0], q[1], `\\sqrt{${c}}`); }
    if (dicas.raiz) { /* (a + b√c)/d, como 1/3 + √2 = (1 + 3√2)/3 */
      for (let d = 1; d <= 60; d++) for (const c of SQFREE.slice(0, 30)) for (let bb = -30; bb <= 30; bb++) {
        if (!bb) continue; const a = x * d - bb * Math.sqrt(c), ar = Math.round(a);
        if (ar !== 0 && Math.abs(ar) < 1000 && Math.abs(a - ar) < 1e-9 * Math.max(1, Math.abs(a))) {
          let g = (m, n) => (n ? g(n, m % n) : Math.abs(m)); const k = g(g(ar, bb), d); const A = ar / k, Bb = bb / k, D = d / k;
          const num = `${A}${Bb < 0 ? "-" : "+"}${Math.abs(Bb) === 1 ? "" : Math.abs(Bb)}\\sqrt{${c}}`;
          return D === 1 ? num : `\\frac{${num}}{${D}}`;
        }
      }
    }
    if (dicas.pi) { const q = fracao(x / Math.PI, 1000); if (q && Math.abs(q[0]) < 1000) return fr(q[0], q[1], "\\pi"); }
    return null;
  }
  function partesSci(x, sig) { let e = Math.floor(Math.log10(Math.abs(x))); let m = +(x / Math.pow(10, e)).toPrecision(sig); if (Math.abs(m) >= 10) { m /= 10; e++; } return [m, e]; }
  const sci = (m, e) => `${m}<span class="x10">×10</span><sup>${e}</sup>`;
  function formata(x, eng = null) {
    if (typeof x !== "number") return "";
    if (Object.is(x, -0) || x === 0) return st.cfg.fmt.t === "Fix" ? (0).toFixed(st.cfg.fmt.n) : st.cfg.fmt.t === "Sci" ? sci((0).toFixed(Math.max(0, (st.cfg.fmt.n || 10) - 1)), 0) : "0";
    const ax = Math.abs(x), f = st.cfg.fmt;
    if (eng !== null && eng !== undefined) { const e = Math.floor(Math.log10(ax) / 3) * 3 + 3 * eng; const m = +(x / Math.pow(10, e)).toPrecision(10); return sci(m, e); }
    if (f.t === "Fix") { if (ax >= 1e10) { const [m, e] = partesSci(x, 10); return sci(m, e); } const s = x.toFixed(f.n); return /^-0\.?0*$/.test(s) ? s.slice(1) : s; }
    if (f.t === "Sci") { const n = f.n || 10; const [m, e] = partesSci(x, n); return sci(m.toFixed(n - 1), e); }
    const lim = f.n === 2 ? 1e-9 : 1e-2;
    if (ax >= 1e10 || ax < lim) { const [m, e] = partesSci(x, 10); return sci(+m.toPrecision(10), e); }
    const s = String(+x.toPrecision(10)); return s.includes("e") ? sci(...partesSci(x, 10)) : s;
  }
  function arredondaVisor(x) { const f = st.cfg.fmt; if (f.t === "Fix") return +x.toFixed(f.n); if (f.t === "Sci") return +x.toPrecision(f.n || 10); return +x.toPrecision(10); }
  function dms(x) { const s = x < 0 ? "-" : ""; x = Math.abs(x); let d = Math.floor(x), m = Math.floor((x - d) * 60), sg = +(((x - d) * 60 - m) * 60).toFixed(2); if (sg >= 60) { sg -= 60; m++; } if (m >= 60) { m -= 60; d++; } return `${s}${d}°${m}°${String(sg).replace(/^(\d)(\.|$)/, "$1$2")}°`; }

  /* ---------------- teclas ---------------- */
  /* cada tecla: [id, rótulo, shift, alpha, classe]. A ordem é a da calculadora. */
  const LINHAS = [
    [["calc", "CALC", "SOLVE", "="], ["integ", "∫▭", "d/dx", ":"], ["DPAD"], ["inv", "x⁻¹", "x!", ""], ["logab", "logₐb", "Σ", ""]],
    [["frac", "▭⁄▭", "▭▭⁄▭", ""], ["sqrt", "√▭", "∛▭", ""], ["sq", "x²", "x³", "", "", "DEC"], ["pow", "xʸ", "ˣ√▭", "", "", "HEX"], ["log", "log", "10ˣ", "", "", "BIN"], ["ln", "ln", "eˣ", "", "", "OCT"]],
    [["neg", "(−)", "∠", "A"], ["dms", "°′″", "←", "B"], ["hyp", "hyp", "Abs", "C"], ["sin", "sin", "sin⁻¹", "D"], ["cos", "cos", "cos⁻¹", "E"], ["tan", "tan", "tan⁻¹", "F"]],
    [["rcl", "RCL", "STO", ""], ["eng", "ENG", "←", "i"], ["lp", "(", "%", ""], ["rp", ")", ",", "X"], ["sd", "S⇔D", "ab/c", "Y"], ["mplus", "M+", "M−", "M"]],
    [["7", "7", "CONST", "", "num"], ["8", "8", "CONV", "", "num"], ["9", "9", "CLR", "", "num"], ["del", "DEL", "INS", "", "acao"], ["ac", "AC", "OFF", "", "acao"]],
    [["4", "4", "MATRIX", "", "num"], ["5", "5", "VECTOR", "", "num"], ["6", "6", "", "", "num"], ["mul", "×", "nPr", "", "num"], ["div", "÷", "nCr", "", "num"]],
    [["1", "1", "STAT", "", "num"], ["2", "2", "CMPLX", "", "num"], ["3", "3", "BASE", "", "num"], ["add", "+", "Pol", "", "num"], ["sub", "−", "Rec", "", "num"]],
    [["0", "0", "Rnd", "", "num"], ["pt", ".", "Ran#", "RanInt", "num"], ["e10", "×10ˣ", "π", "e", "num"], ["ans", "Ans", "DRG▸", "", "num"], ["igual", "=", "", "", "num igual"]],
  ];
  const LETRA = { neg: "A", dms: "B", hyp: "C", sin: "D", cos: "E", tan: "F", rp: "X", sd: "Y", mplus: "M" };
  const HEXD = { neg: "A", dms: "B", hyp: "C", sin: "D", cos: "E", tan: "F" };

  /* ---------------- edição ---------------- */
  function ins(ed, t) {
    if (st.ins && ed.cur < ed.tok.length) ed.tok.splice(ed.cur, 1, t); else ed.tok.splice(ed.cur, 0, t);
    ed.cur++;
    if (ed.tok.length > 199) { ed.tok.length = 199; ed.cur = Math.min(ed.cur, 199); }
  }
  function apaga(ed) { if (st.ins && ed.cur < ed.tok.length) ed.tok.splice(ed.cur, 1); else if (ed.cur > 0) { ed.tok.splice(ed.cur - 1, 1); ed.cur--; } }

  /* tecla → token (no modo atual); null = não é de digitar */
  function tokenDe(id, sh, al) {
    const m = st.modo;
    if (m === "BASE") {
      if (!sh && !al && HEXD[id]) return T("hexd", HEXD[id]);
      if (["sin", "cos", "tan", "hyp", "dms", "neg", "sqrt", "frac", "integ", "inv", "logab", "eng", "sd", "pt", "e10"].includes(id) && !al) return null;
    }
    if (al) {
      if (LETRA[id]) return T("var", LETRA[id], { n: LETRA[id] });
      if (id === "calc") return T("eq", "=");
      if (id === "pt") return FN("ranint", "RanInt#(");
      if (id === "e10") return T("e", "e");
      if (id === "eng" && m === "CMPLX") return T("i", "i");
      return null;
    }
    if (sh) {
      switch (id) {
        case "integ": return FN("deriv", "d/dx(");
        case "inv": return POST("fact", "!");
        case "logab": return FN("sum", "Σ(");
        case "frac": return T("frac", "⌟");
        case "sqrt": return FN("cbrt", "∛(");
        case "sq": return POST("cube", "³");
        case "pow": return T("root", "ˣ√(");
        case "log": return FN("exp10", "10^(");
        case "ln": return FN("exp", "e^(");
        case "neg": return m === "CMPLX" ? T("ang", "∠") : null;
        case "hyp": return FN("abs", "Abs(");
        case "sin": return FN(st.hyp ? "asinh" : "asin", st.hyp ? "sinh⁻¹(" : "sin⁻¹(");
        case "cos": return FN(st.hyp ? "acosh" : "acos", st.hyp ? "cosh⁻¹(" : "cos⁻¹(");
        case "tan": return FN(st.hyp ? "atanh" : "atan", st.hyp ? "tanh⁻¹(" : "tan⁻¹(");
        case "lp": return POST("pct", "%");
        case "rp": return T("comma", ",");
        case "mul": return T("binop", "P", { o: "nPr" });
        case "div": return T("binop", "C", { o: "nCr" });
        case "add": return FN("pol", "Pol(");
        case "sub": return FN("rec", "Rec(");
        case "0": return FN("rnd", "Rnd(");
        case "pt": return T("ran", "Ran#");
        case "e10": return T("pi", "π");
      }
      return null;
    }
    if (/^[0-9]$/.test(id)) return T("dig", id);
    switch (id) {
      case "pt": return T("dig", ".");
      case "e10": return T("E", "ᴇ");
      case "add": return T("op", "+", { o: "+" }); case "sub": return T("op", "−", { o: "−" });
      case "mul": return T("op", "×", { o: "×" }); case "div": return T("op", "÷", { o: "÷" });
      case "lp": return T("lp", "("); case "rp": return T("rp", ")");
      case "neg": return T("neg", "-");
      case "frac": return T("frac", "⌟");
      case "sqrt": return FN("sqrt", "√(");
      case "sq": return POST("sq", "²");
      case "pow": return T("pow", "^(");
      case "log": return FN("log", "log(");
      case "logab": return FN("log", "log(");
      case "ln": return FN("ln", "ln(");
      case "inv": return POST("inv", "⁻¹");
      case "integ": return FN("integ", "∫(");
      case "sin": case "cos": case "tan": return FN(st.hyp ? id + "h" : id, (st.hyp ? id + "h" : id) + "(");
      case "dms": return T("dms", "°");
      case "ans": return T("ans", "Ans");
      case "eng": return m === "CMPLX" ? T("i", "i") : null;
    }
    return null;
  }

  /* ---------------- calcular ---------------- */
  function dicasDe(tok) { return { raiz: contem(tok, (t) => t.f === "sqrt" || t.k === "root" || t.p === "inv" || t.k === "frac"), pi: contem(tok, (t) => t.k === "pi" || (st.cfg.ang === "R" && /^a(sin|cos|tan)$/.test(t.f || ""))), semExato: contem(tok, (t) => ["integ", "deriv", "ranint"].includes(t.f) || t.k === "ran" || t.k === "E") };
  }
  function executa(tok) {
    st.forma = null;
    const arv = analisa(tok);
    if (arv.t === "eq") ERR("Syntax");
    let v = avalia(arv);
    if (typeof v === "number") { if (!isFinite(v)) ERR("Math"); if (Math.abs(v) >= 1e100) ERR("Math"); v = +v.toPrecision(15); if (Object.is(v, -0)) v = 0; }
    const limpa = (x) => { const y = +x.toPrecision(13); return Object.is(y, -0) ? 0 : y; };
    if (isM(v)) v = { m: v.m.map((r) => r.map(limpa)) };
    if (isV(v)) v = { v: v.v.map(limpa) };
    if (isC(v)) { let re = +v.re.toPrecision(15), im = +v.im.toPrecision(15); const esc = Math.max(Math.abs(re), Math.abs(im)); if (Math.abs(re) < 1e-12 * esc) re = 0; if (Math.abs(im) < 1e-12 * esc) im = 0; v = im === 0 ? re : cx(re, im); }
    return v;
  }
  function igual() {
    const tok = st.ed.tok;
    if (!tok.length) return;
    try {
      const v = executa(tok);
      guardaResultado(v, tok);
    } catch (e) { if (!(e instanceof Erro)) { console.error(e); e = new Erro("Math"); } mostraErro(e.message); }
  }
  function guardaResultado(v, tok) {
    if (v && v.par) { st.res = { par: v.par, tok: [...tok] }; st.ans = v.par[0][1]; }
    else {
      st.ans = v;
      if (isM(v)) st.mats.Ans = v;
      if (isV(v)) st.vcts.Ans = v;
      st.res = { v, tok: [...tok], exato: st.cfg.io === "Math", misto: false, dms: false, eng: null, forma: st.forma };
    }
    if (!st.hist.length || st.hist[st.hist.length - 1] !== tok) st.hist.push([...tok]);
    if (st.hist.length > 30) st.hist.shift();
    st.hpos = st.hist.length;
    st.tela = isM(v) ? "matres" : isV(v) ? "vctres" : "res";
  }
  function mostraErro(tipo) { st.erro = { tipo: tipo + (/ERROR|Solve|Sol/.test(tipo) ? "" : " ERROR"), volta: st.tela === "res" ? "edit" : st.tela }; st.tela = "erro"; }

  /* ---------------- menus ---------------- */
  function menu(titulo, itens, extra = {}) { st.menu = { titulo, itens, pag: 0, dig: "", volta: st.tela, ...extra }; st.tela = "menu"; }
  const fechaMenu = () => { st.tela = st.menu && st.menu.volta && st.menu.volta !== "menu" ? st.menu.volta : "edit"; st.menu = null; };
  function menuModo() {
    menu("MODE", [["COMP", () => trocaModo("COMP")], ["CMPLX", () => trocaModo("CMPLX")], ["STAT", () => menuTipoEst()], ["BASE-N", () => trocaModo("BASE")], ["EQN", () => menuTipoEqn()], ["MATRIX", () => { trocaModo("MATRIX"); menuEscolheMat("dim"); }], ["TABLE", () => { trocaModo("TABLE"); st.tela = "tabf"; }], ["VECTOR", () => { trocaModo("VECTOR"); menuEscolheVct("dim"); }]]);
  }
  function trocaModo(m) { st.modo = m; st.ed = novoEd(); st.res = null; st.tela = "edit"; st.base = "DEC"; st.hyp = false; }
  function menuSetup() {
    const c = st.cfg;
    menu("SETUP", [["MthIO", () => { c.io = "Math"; fechaMenu(); }], ["LineIO", () => { c.io = "Line"; fechaMenu(); }], ["Deg", () => { c.ang = "D"; fechaMenu(); }], ["Rad", () => { c.ang = "R"; fechaMenu(); }], ["Gra", () => { c.ang = "G"; fechaMenu(); }],
      ["Fix", () => menuDigito("Fix 0~9?", (d) => (c.fmt = { t: "Fix", n: d }))], ["Sci", () => menuDigito("Sci 0~9?", (d) => (c.fmt = { t: "Sci", n: d || 10 }))], ["Norm", () => menuDigito("Norm 1~2?", (d) => { if (d === 1 || d === 2) c.fmt = { t: "Norm", n: d }; })],
      ["ab/c", () => { c.frac = "ab/c"; fechaMenu(); }], ["d/c", () => { c.frac = "d/c"; fechaMenu(); }], ["CMPLX a+bi", () => { c.cx = "a+bi"; fechaMenu(); }], ["CMPLX r∠θ", () => { c.cx = "r∠θ"; fechaMenu(); }]], { porPag: 8 });
  }
  function menuDigito(titulo, fn) { const volta = st.menu ? st.menu.volta : st.tela; st.menu = { titulo, itens: [], pag: 0, dig: "", volta, digito: (d) => { fn(d); fechaMenu(); } }; st.tela = "menu"; }
  function menuClr() {
    const conf = (fn) => { const volta = st.menu.volta; st.menu = { titulo: "Reset?", itens: [], volta, confirma: () => { fn(); fechaMenu(); } }; };
    menu("CLR", [["Setup", () => conf(() => { st.cfg = { io: "Math", ang: "D", fmt: { t: "Norm", n: 1 }, frac: "d/c", cx: "a+bi" }; })], ["Memory", () => conf(() => { Object.keys(st.vars).forEach((k) => (st.vars[k] = 0)); st.ans = 0; })], ["All", () => conf(() => { Object.keys(st.vars).forEach((k) => (st.vars[k] = 0)); st.ans = 0; st.cfg = { io: "Math", ang: "D", fmt: { t: "Norm", n: 1 }, frac: "d/c", cx: "a+bi" }; st.stat = { tipo: null, x: [], y: [], cur: { r: 0, c: 0 } }; st.mats = { A: null, B: null, C: null, Ans: null }; st.vcts = { A: null, B: null, C: null, Ans: null }; trocaModo("COMP"); })]]);
  }
  const insere = (t) => () => { fechaMenu(); if (st.tela === "res") { st.ed = novoEd(); st.tela = "edit"; } ins(st.ed, t); };
  function menuConst() { menu("CONST", CONST.map((c, i) => [`${c[0]}`, insere(T("const", c[0], { i })), c[1]]), { dois: true, porPag: 3 }); }
  function menuConv() { menu("CONV", CONV.map((c, i) => [c[0], insere(POST("conv", c[0], { i }))]), { dois: true, porPag: 3 }); }
  function menuDrg() { menu("DRG▸", [["°", insere(POST("deg", "°"))], ["r", insere(POST("rad", "ʳ"))], ["g", insere(POST("grad", "ᵍ"))]]); }
  /* STAT */
  function menuTipoEst(soTrocar) { menu("STAT", TIPOS_EST.map(([k, nome]) => [nome, () => { if (!soTrocar || st.modo !== "STAT") trocaModo("STAT"); const par = st.stat.tipo && st.stat.tipo !== "1VAR"; st.stat.tipo = k; if (!soTrocar) { st.stat.x = []; st.stat.y = []; } if (k === "1VAR" || !par) st.stat.y.length = 0; st.stat.cur = { r: 0, c: 0 }; st.buf = novoEd(); st.tela = "estdados"; st.menu = null; }])); }
  function menuEst() {
    if (st.modo !== "STAT") return;
    const um = st.stat.tipo === "1VAR", sv = (n, s) => [s, insere(T("svar", s, { n }))];
    const soma = um ? [sv("sx2", "Σx²"), sv("sx", "Σx")] : [sv("sx2", "Σx²"), sv("sx", "Σx"), sv("sy2", "Σy²"), sv("sy", "Σy"), sv("sxy", "Σxy"), sv("sx3", "Σx³"), sv("sx2y", "Σx²y"), sv("sx4", "Σx⁴")];
    const vari = [sv("n", "n"), sv("xm", "x̄"), sv("ox", "σx"), sv("sxs", "sx"), ...(um ? [] : [sv("ym", "ȳ"), sv("oy", "σy"), sv("sys", "sy")])];
    const quad = st.stat.tipo === "quad";
    const reg = quad ? [sv("A", "A"), sv("B", "B"), sv("C", "C"), ["x̂₁", insere(POST("x1hat", "x̂₁"))], ["x̂₂", insere(POST("x2hat", "x̂₂"))], ["ŷ", insere(POST("yhat", "ŷ"))]] : [sv("A", "A"), sv("B", "B"), sv("r", "r"), ["x̂", insere(POST("xhat", "x̂"))], ["ŷ", insere(POST("yhat", "ŷ"))]];
    const distr = [["P(", insere(FN("P", "P("))], ["Q(", insere(FN("Q", "Q("))], ["R(", insere(FN("R", "R("))], ["▸t", insere(POST("tval", "▸t"))]];
    const minmax = um ? [sv("minX", "minX"), sv("maxX", "maxX")] : [sv("minX", "minX"), sv("maxX", "maxX"), sv("minY", "minY"), sv("maxY", "maxY")];
    const sub = (t, it) => () => { const volta = st.menu.volta; st.menu = { titulo: t, itens: it, pag: 0, dig: "", volta }; };
    menu("STAT", [["Type", () => menuTipoEst(true)], ["Data", () => { st.menu = null; st.tela = "estdados"; st.buf = novoEd(); }], ["Sum", sub("Sum", soma)], ["Var", sub("Var", vari)], um ? ["Distr", sub("Distr", distr)] : ["Reg", sub("Reg", reg)], ["MinMax", sub("MinMax", minmax)]]);
  }
  /* EQN */
  function menuTipoEqn() { menu("EQN", TIPOS_EQN.map(([k, nome, l, c], i) => [nome, () => { trocaModo("EQN"); st.eqn = { tipo: i, coef: Array.from({ length: l }, () => Array(c).fill(0)), cur: { r: 0, c: 0 }, sol: null, si: 0 }; st.buf = novoEd(); st.tela = "eqn"; st.menu = null; }])); }
  /* MATRIX e VECTOR */
  const DIMS = [[3, 3], [3, 2], [3, 1], [2, 3], [2, 2], [2, 1], [1, 3], [1, 2]];
  function menuEscolheMat(acao) {
    menu(acao === "dim" ? "Matrix?" : "Data?", ["A", "B", "C"].map((n) => [`Mat${n}`, () => {
      if (acao === "dim") { const volta = st.menu.volta === "menu" ? "edit" : st.menu.volta; st.menu = { titulo: `Mat${n}  (m×n)`, itens: DIMS.map(([r, c]) => [`${r}×${c}`, () => { st.mats[n] = { m: Array.from({ length: r }, () => Array(c).fill(0)) }; abreEditor("mat", n); }]), pag: 0, dig: "", volta }; }
      else { if (!st.mats[n]) { menuEscolheMat("dim"); return; } abreEditor("mat", n); }
    }]));
  }
  function menuEscolheVct(acao) {
    menu(acao === "dim" ? "Vector?" : "Data?", ["A", "B", "C"].map((n) => [`Vct${n}`, () => {
      if (acao === "dim") { const volta = st.menu.volta === "menu" ? "edit" : st.menu.volta; st.menu = { titulo: `Vct${n}  (m)`, itens: [["3", () => { st.vcts[n] = { v: [0, 0, 0] }; abreEditor("vct", n); }], ["2", () => { st.vcts[n] = { v: [0, 0] }; abreEditor("vct", n); }]], pag: 0, dig: "", volta }; }
      else { if (!st.vcts[n]) { menuEscolheVct("dim"); return; } abreEditor("vct", n); }
    }]));
  }
  function abreEditor(tipo, n) { st.menu = null; st.med = { tipo, n, r: 0, c: 0 }; st.buf = novoEd(); st.tela = "medit"; }
  function menuMatriz() {
    if (st.modo !== "MATRIX") return;
    const m = (n) => [`Mat${n}`, insere(T("mat", `Mat${n}`, { n }))];
    menu("MATRIX", [["Dim", () => menuEscolheMat("dim")], ["Data", () => menuEscolheMat("data")], m("A"), m("B"), m("C"), m("Ans"), ["det(", insere(FN("det", "det("))], ["Trn(", insere(FN("trn", "Trn("))]]);
  }
  function menuVetor() {
    if (st.modo !== "VECTOR") return;
    const v = (n) => [`Vct${n}`, insere(T("vct", `Vct${n}`, { n }))];
    menu("VECTOR", [["Dim", () => menuEscolheVct("dim")], ["Data", () => menuEscolheVct("data")], v("A"), v("B"), v("C"), v("Ans"), ["Dot(", insere(FN("dot", "Dot("))]]);
  }
  function menuCplx() { if (st.modo !== "CMPLX") return; menu("CMPLX", [["arg(", insere(FN("arg", "arg("))], ["Conjg(", insere(FN("conjg", "Conjg("))], ["▸r∠θ", insere(POST("rth", "▸r∠θ"))], ["▸a+bi", insere(POST("abi", "▸a+bi"))]]); }
  function menuBase() { if (st.modo !== "BASE") return; const b = (o, s) => [s, insere(T("binop", ` ${s} `, { o }))]; menu("BASE", [b("and", "and"), b("or", "or"), b("xnor", "xnor"), b("xor", "xor"), ["Not(", insere(FN("not", "Not("))], ["Neg(", insere(FN("negb", "Neg("))], ["d", insere(T("basep", "d", { b: "d" }))], ["h", insere(T("basep", "h", { b: "h" }))], ["b", insere(T("basep", "b", { b: "b" }))], ["o", insere(T("basep", "o", { b: "o" }))]], { porPag: 6 }); }

  /* ---------------- CALC e SOLVE (perguntas de variável) ---------------- */
  const ORDEM_VARS = ["A", "B", "C", "D", "E", "F", "X", "Y", "M"];
  function iniciaPerguntas(modo) {
    const tok = st.tela === "res" && st.res && st.res.tok ? st.res.tok : st.ed.tok;
    if (!tok.length) return;
    st.ed = { tok: [...tok], cur: tok.length };
    const nomes = []; tok.forEach((t) => { if (t.k === "var" && !nomes.includes(t.n)) nomes.push(t.n); });
    if (modo === "solve") { if (!nomes.length) { mostraErro("Syntax"); return; } const alvo = nomes.includes("X") ? "X" : nomes[0]; nomes.splice(nomes.indexOf(alvo), 1); nomes.push(alvo); st.prompt = { modo, nomes, i: 0, alvo }; }
    else { if (!nomes.length) { igual(); return; } st.prompt = { modo, nomes, i: 0 }; }
    st.buf = novoEd(); st.tela = "prompt";
  }
  function respondePergunta() {
    const P = st.prompt, nome = P.nomes[P.i];
    try { if (st.buf.tok.length) st.vars[nome] = real(executa(st.buf.tok)); } catch (e) { mostraErro(e instanceof Erro ? e.message : "Math"); return; }
    P.i++; st.buf = novoEd();
    if (P.i < P.nomes.length) return;
    if (P.modo === "calc") { try { const v = executa(st.ed.tok); guardaResultado(v, st.ed.tok); st.res.calc = true; } catch (e) { mostraErro(e instanceof Erro ? e.message : "Math"); } return; }
    try {
      const arv = analisa(st.ed.tok), alvo = P.alvo;
      const [x, resid] = resolveSolve(arv, alvo, st.vars[alvo]);
      st.vars[alvo] = +x.toPrecision(15); st.ans = st.vars[alvo];
      st.res = { solve: true, nome: alvo, v: st.vars[alvo], lr: resid, tok: [...st.ed.tok] }; st.tela = "res";
    } catch (e) { mostraErro(e instanceof Erro ? e.message : "Can't Solve"); }
  }

  /* ---------------- TABLE ---------------- */
  function perguntasTabela() { st.prompt = { modo: "tab", nomes: ["Start", "End", "Step"], i: 0, val: [st.tab.ini, st.tab.fim, st.tab.passo] }; st.buf = novoEd(); st.tela = "prompt"; }
  function respondeTabela() {
    const P = st.prompt;
    try { if (st.buf.tok.length) P.val[P.i] = real(executa(st.buf.tok)); } catch (e) { mostraErro("Math"); return; }
    P.i++; st.buf = novoEd();
    if (P.i < 3) return;
    const [a, b, h] = P.val;
    if (h === 0 || (b - a) / h < 0) { mostraErro("Math"); return; }
    const n = Math.floor((b - a) / h + 1e-9) + 1; if (n > 30) { mostraErro("Insufficient MEM"); return; }
    Object.assign(st.tab, { ini: a, fim: b, passo: h, cur: 0 });
    try { const arv = analisa(st.tab.f.tok); st.tab.linhas = Array.from({ length: n }, (_, i) => { const x = +(a + i * h).toPrecision(12); let y; try { y = real(avalia(arv, { X: x })); } catch (e) { y = NaN; } return [x, y]; }); }
    catch (e) { mostraErro("Syntax"); return; }
    st.tela = "tab";
  }

  /* ---------------- tecla apertada ---------------- */
  function tecla(id) {
    if (id === "shift") { st.shift = !st.shift; st.alpha = false; return; }
    if (id === "alpha") { st.alpha = !st.alpha; st.shift = false; return; }
    const sh = st.shift, al = st.alpha; st.shift = st.alpha = false;
    const hypAntes = st.hyp; if (id !== "hyp") st.hyp = false;
    if (id === "on") { st.tela = st.modo === "TABLE" ? "tabf" : st.modo === "EQN" ? "eqn" : "edit"; st.ed = novoEd(); st.menu = null; st.erro = null; st.sto = st.rcl = false; return; }
    if (id === "ac" && sh) { fecha(); return; }
    if (id === "mode" && sh) { menuSetup(); return; }
    if (id === "mode") { menuModo(); return; }
    if (sh && id === "9") { menuClr(); return; }

    /* STO e RCL esperam a letra */
    if (st.sto || st.rcl) {
      const L = LETRA[id]; const era = st.sto ? "sto" : "rcl"; st.sto = st.rcl = false;
      if (!L) return;
      if (era === "sto") { try { const v = st.ed.tok.length && st.tela !== "res" ? executa(st.ed.tok) : st.ans; st.vars[L] = real(v); st.ans = st.vars[L]; st.res = { v: st.vars[L], tok: [T("var", L, { n: L })], exato: st.cfg.io === "Math", rotulo: `${L}=` }; st.tela = "res"; } catch (e) { mostraErro(e instanceof Erro ? e.message : "Math"); } }
      else { st.res = { v: st.vars[L], tok: [T("var", L, { n: L })], exato: st.cfg.io === "Math", rotulo: `${L}=` }; st.tela = "res"; }
      return;
    }

    switch (st.tela) {
      case "menu": return teclaMenu(id);
      case "erro": if (id === "ac") { st.tela = st.erro.volta === "erro" ? "edit" : st.erro.volta; if (st.tela === "res") st.tela = "edit"; st.erro = null; if (st.tela === "edit") st.ed = novoEd(); } else if (id === "left" || id === "right") { st.tela = st.erro.volta === "prompt" ? "prompt" : st.erro.volta === "tabf" ? "tabf" : st.erro.volta === "estdados" || st.erro.volta === "eqn" || st.erro.volta === "medit" ? st.erro.volta : "edit"; st.erro = null; } return;
      case "prompt": return teclaEditor(st.buf, id, sh, al, hypAntes, () => (st.prompt.modo === "tab" ? respondeTabela() : respondePergunta()), () => { st.tela = st.prompt.modo === "tab" ? "tabf" : "edit"; st.prompt = null; });
      case "tabf": return teclaEditor(st.tab.f, id, sh, al, hypAntes, () => perguntasTabela(), () => { st.tab.f = novoEd(); });
      case "tab": if (id === "up") st.tab.cur = Math.max(0, st.tab.cur - 1); else if (id === "down") st.tab.cur = Math.min(st.tab.linhas.length - 1, st.tab.cur + 1); else if (id === "ac") st.tela = "tabf"; return;
      case "estdados": return teclaEstDados(id, sh, al, hypAntes);
      case "eqn": return teclaEqn(id, sh, al, hypAntes);
      case "eqnsol": if (id === "down" || id === "igual") { if (st.eqn.si < st.eqn.sol.length - 1) st.eqn.si++; else if (id === "igual") st.tela = "eqn"; } else if (id === "up") st.eqn.si = Math.max(0, st.eqn.si - 1); else if (id === "ac") st.tela = "eqn"; return;
      case "medit": return teclaMatEditor(id, sh, al, hypAntes);
      case "matres": case "vctres": if (id === "ac") { st.tela = "edit"; st.ed = novoEd(); } else if (["left", "right", "up", "down"].includes(id)) { st.tela = "edit"; } else { st.tela = "res"; teclaPrincipal(id, sh, al, hypAntes); } return;
    }
    teclaPrincipal(id, sh, al, hypAntes);
  }

  function teclaPrincipal(id, sh, al, hypAntes) {
    const ed = st.ed, emRes = st.tela === "res";
    /* teclas que mudam a base no BASE-N */
    if (st.modo === "BASE" && !sh && !al && { sq: 1, pow: 1, log: 1, ln: 1 }[id]) { st.base = { sq: "DEC", pow: "HEX", log: "BIN", ln: "OCT" }[id]; return; }
    if (sh) {
      const menus = { 7: menuConst, 8: menuConv, 1: menuEst, 2: menuCplx, 3: menuBase, 4: menuMatriz, 5: menuVetor, ans: menuDrg };
      if (menus[id]) { menus[id](); return; }
      if (id === "rcl") { st.sto = true; return; }
      if (id === "calc") { iniciaPerguntas("solve"); return; }
      if (id === "del") { st.ins = !st.ins; return; }
      if (id === "sd" && emRes && st.res.v !== undefined) { st.res.misto = !st.res.misto; st.res.exato = true; return; }
      if (id === "dms" && emRes) { st.res.dms = !st.res.dms; return; }
      if (id === "eng" && emRes && typeof st.res.v === "number") { st.res.eng = st.res.eng == null ? 0 : st.res.eng + 1; return; }
      if (id === "mplus") { memoria(-1); return; }
    } else if (!al) {
      if (id === "hyp" && st.modo !== "BASE") { st.hyp = !hypAntes; return; }
      if (id === "rcl") { st.rcl = true; return; }
      if (id === "calc") { iniciaPerguntas("calc"); return; }
      if (id === "sd" && emRes && st.res.v !== undefined && typeof st.res.v === "number") { st.res.exato = !st.res.exato; return; }
      if (id === "dms" && emRes && typeof st.res.v === "number") { st.res.dms = !st.res.dms; return; }
      if (id === "eng" && emRes && typeof st.res.v === "number" && st.modo !== "CMPLX") { st.res.eng = st.res.eng == null ? 0 : st.res.eng - 1; return; }
      if (id === "mplus") { memoria(1); return; }
    }
    teclaEditor(ed, id, sh, al, hypAntes, igual, () => { st.ed = novoEd(); st.tela = "edit"; }, emRes);
  }
  function memoria(sinal) {
    try { const v = st.tela === "res" && st.res ? st.ans : executa(st.ed.tok); st.vars.M = add(st.vars.M, sinal * real(v)); st.ans = real(v); guardaResultado(real(v), st.tela === "res" && st.res ? st.res.tok : st.ed.tok); st.res.rotulo = sinal > 0 ? "M+" : "M−"; } catch (e) { mostraErro(e instanceof Erro ? e.message : "Math"); }
  }

  /* editor genérico: tok + cur. emRes = o visor está mostrando um resultado */
  function teclaEditor(ed, id, sh, al, hypAntes, aoIgual, aoAC, emRes) {
    if (id === "igual") { aoIgual(); return; }
    if (id === "ac") { aoAC(); return; }
    if (id === "left" || id === "right") {
      if (emRes) { st.ed = { tok: [...(st.res.tok || [])], cur: id === "left" ? (st.res.tok || []).length : 0 }; st.tela = "edit"; return; }
      ed.cur = id === "left" ? (ed.cur > 0 ? ed.cur - 1 : ed.tok.length) : ed.cur < ed.tok.length ? ed.cur + 1 : 0; return;
    }
    if (id === "up" || id === "down") {
      if (ed !== st.ed || !st.hist.length) return;
      st.hpos = Math.max(0, Math.min(st.hist.length - 1, st.hpos + (id === "up" ? -1 : 1)));
      st.ed = { tok: [...st.hist[st.hpos]], cur: st.hist[st.hpos].length }; st.tela = "edit"; return;
    }
    if (id === "del") { if (emRes) { st.ed = { tok: [...(st.res.tok || [])], cur: (st.res.tok || []).length }; st.tela = "edit"; return; } apaga(ed); return; }
    if (id === "hyp" && !sh && !al) { st.hyp = !hypAntes; return; }
    if (id === "hyp" && !sh) return;
    if (hypAntes && !sh && !al && ["sin", "cos", "tan"].includes(id)) st.hyp = true;
    if (hypAntes && sh && ["sin", "cos", "tan"].includes(id)) st.hyp = true;
    const t = tokenDe(id, sh, al); st.hyp = false;
    if (!t) return;
    if (emRes) {
      /* depois de um resultado: operador continua do Ans; número começa conta nova */
      const continua = (t.k === "op" || t.k === "post" || t.k === "pow" || t.k === "root" || t.k === "binop" || t.k === "frac" || t.k === "ang") && !(t.k === "op" && false);
      st.ed = novoEd(); st.tela = "edit";
      if (continua) ins(st.ed, T("ans", "Ans"));
      ins(st.ed, t); return;
    }
    ins(ed, t);
  }

  function teclaMenu(id) {
    const M = st.menu;
    if (id === "ac") { st.tela = M.volta && M.volta !== "menu" ? M.volta : "edit"; st.menu = null; return; }
    if (M.confirma) { if (id === "igual") M.confirma(); return; }
    if (M.digito) { if (/^[0-9]$/.test(id)) M.digito(+id); return; }
    const por = M.porPag || 8, pags = Math.ceil(M.itens.length / por);
    if (id === "down") { M.pag = Math.min(pags - 1, M.pag + 1); return; }
    if (id === "up") { M.pag = Math.max(0, M.pag - 1); return; }
    if (!/^[0-9]$/.test(id)) return;
    if (M.dois) { M.dig += id; if (M.dig.length < 2) return; const k = +M.dig - 1; M.dig = ""; if (M.itens[k]) M.itens[k][1](); return; }
    const k = M.pag * por + (+id - 1); if (M.itens[k]) M.itens[k][1]();
  }

  /* STAT: editor de dados (colunas X e Y) */
  function teclaEstDados(id, sh, al, hypAntes) {
    const S = st.stat, par = S.tipo !== "1VAR", cols = par ? 2 : 1, n = S.x.length;
    if (id === "ac") { if (st.buf.tok.length) st.buf = novoEd(); else { st.tela = "edit"; st.ed = novoEd(); } return; }
    if (sh && id === "1") { menuEst(); return; }
    if (id === "up") { S.cur.r = Math.max(0, S.cur.r - 1); st.buf = novoEd(); return; }
    if (id === "down") { S.cur.r = Math.min(n, S.cur.r + 1); st.buf = novoEd(); return; }
    if (id === "left" || id === "right") { S.cur.c = (S.cur.c + (id === "right" ? 1 : cols - 1)) % cols; st.buf = novoEd(); return; }
    if (id === "del" && !st.buf.tok.length) { if (S.cur.r < n) { S.x.splice(S.cur.r, 1); S.y.splice(S.cur.r, 1); } return; }
    if (id === "igual") {
      if (!st.buf.tok.length) { S.cur.r = Math.min(n, S.cur.r + 1); return; }
      try { const v = real(executa(st.buf.tok)); const col = S.cur.c ? S.y : S.x; col[S.cur.r] = v; if (S.cur.r >= S.x.length) S.x[S.cur.r] = S.x[S.cur.r] ?? 0; if (par && S.y[S.cur.r] === undefined) S.y[S.cur.r] = 0; if (!par) S.y.length = 0; st.buf = novoEd(); if (S.x.length > 40) { S.x.length = 40; S.y.length = Math.min(S.y.length, 40); } S.cur.r = Math.min(S.x.length, S.cur.r + 1); }
      catch (e) { mostraErro(e instanceof Erro ? e.message : "Math"); }
      return;
    }
    teclaEditor(st.buf, id, sh, al, hypAntes, () => {}, () => {});
  }
  function teclaEqn(id, sh, al, hypAntes) {
    const q = st.eqn, L = q.coef.length, C = q.coef[0].length;
    if (id === "ac") { st.buf = novoEd(); return; }
    if (["up", "down", "left", "right"].includes(id) && !st.buf.tok.length) { if (id === "up") q.cur.r = (q.cur.r + L - 1) % L; if (id === "down") q.cur.r = (q.cur.r + 1) % L; if (id === "left") q.cur.c = (q.cur.c + C - 1) % C; if (id === "right") q.cur.c = (q.cur.c + 1) % C; return; }
    if (id === "igual") {
      if (st.buf.tok.length) { try { q.coef[q.cur.r][q.cur.c] = real(executa(st.buf.tok)); st.buf = novoEd(); if (q.cur.c < C - 1) q.cur.c++; else if (q.cur.r < L - 1) { q.cur.r++; q.cur.c = 0; } } catch (e) { mostraErro(e instanceof Erro ? e.message : "Math"); } return; }
      try { q.sol = resolveEqn(); q.si = 0; st.tela = "eqnsol"; } catch (e) { mostraErro(e instanceof Erro ? e.message : "Math"); }
      return;
    }
    teclaEditor(st.buf, id, sh, al, hypAntes, () => {}, () => {});
  }
  function teclaMatEditor(id, sh, al, hypAntes) {
    const E = st.med, obj = E.tipo === "mat" ? st.mats[E.n] : st.vcts[E.n];
    const R = E.tipo === "mat" ? obj.m.length : 1, C = E.tipo === "mat" ? obj.m[0].length : obj.v.length;
    if (id === "ac") { if (st.buf.tok.length) st.buf = novoEd(); else { st.tela = "edit"; st.med = null; } return; }
    if (sh && id === "4" && E.tipo === "mat") { menuMatriz(); return; }
    if (sh && id === "5" && E.tipo === "vct") { menuVetor(); return; }
    if (["up", "down", "left", "right"].includes(id) && !st.buf.tok.length) { if (id === "up") E.r = (E.r + R - 1) % R; if (id === "down") E.r = (E.r + 1) % R; if (id === "left") E.c = (E.c + C - 1) % C; if (id === "right") E.c = (E.c + 1) % C; return; }
    if (id === "igual") {
      if (!st.buf.tok.length) return;
      try { const v = real(executa(st.buf.tok)); if (E.tipo === "mat") obj.m[E.r][E.c] = v; else obj.v[E.c] = v; st.buf = novoEd(); if (E.c < C - 1) E.c++; else if (E.r < R - 1) { E.r++; E.c = 0; } } catch (e) { mostraErro(e instanceof Erro ? e.message : "Math"); }
      return;
    }
    teclaEditor(st.buf, id, sh, al, hypAntes, () => {}, () => {});
  }

  /* ---------------- desenho do visor ---------------- */
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  function linhaEd(ed, ativo = true) {
    let h = "";
    ed.tok.forEach((t, i) => { if (ativo && i === ed.cur) h += `<span class="cur${st.ins ? " ins" : ""}"></span>`; h += `<span class="tk${t.k === "var" || t.k === "svar" ? " vr" : ""}">${esc(t.s)}</span>`; });
    if (ativo && ed.cur >= ed.tok.length) h += `<span class="cur${st.ins ? " ins" : ""}"></span>`;
    return h;
  }
  const tex = (s) => { try { return window.katex ? katex.renderToString(s, { throwOnError: false }) : esc(s); } catch (e) { return esc(s); } };
  function mostraNumero(v, r) {
    if (st.modo === "BASE") return mostraBase(v, st.base);
    if (isC(v)) {
      const polar = (r && r.forma === "r∠θ") || (!(r && r.forma === "a+bi") && st.cfg.cx === "r∠θ");
      if (polar) return `${formata(cAbs(v))}∠${formata(deRad(Math.atan2(v.im, v.re)))}`;
      const im = Math.abs(v.im) === 1 ? "" : formata(Math.abs(v.im));
      return `${v.re !== 0 ? formata(v.re) : ""}${v.re !== 0 ? (v.im < 0 ? " − " : " + ") : v.im < 0 ? "−" : ""}${im}<i>i</i>`;
    }
    if (typeof v !== "number") return "";
    if (r && r.dms) return dms(v);
    if (r && r.eng !== null && r.eng !== undefined) return formata(v, r.eng);
    if (r && r.exato) {
      const d = dicasDe(r.tok || []);
      if (!d.semExato) {
        let e = exato(v, d);
        if (e && r.misto) { const fr = fracao(v); if (fr && Math.abs(fr[0]) > fr[1]) { const int = Math.trunc(fr[0] / fr[1]), resto = Math.abs(fr[0] % fr[1]); e = `${int}\\,\\frac{${resto}}{${fr[1]}}`; } }
        if (e) return st.cfg.io === "Math" ? tex(e) : esc(e.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1⌟$2").replace(/\\sqrt\{(\d+)\}/g, "√$1").replace(/\\pi/g, "π").replace(/\\,/g, "⌟"));
      }
    }
    return formata(v);
  }
  function mostraMatriz(o) { const linhas = isM(o) ? o.m : [o.v]; return `<table class="lcd-mat">${linhas.map((r) => `<tr>${r.map((x) => `<td>${formata(+x.toPrecision(10))}</td>`).join("")}</tr>`).join("")}</table>`; }
  function indicadores() {
    const I = [];
    if (st.shift) I.push('<b class="i-s">S</b>'); if (st.alpha) I.push('<b class="i-a">A</b>');
    if (st.vars.M !== 0) I.push("M"); if (st.sto) I.push("STO"); if (st.rcl) I.push("RCL"); if (st.hyp) I.push("hyp");
    const nm = { CMPLX: "CMPLX", STAT: "STAT", BASE: st.base, EQN: "EQN", MATRIX: "MAT", TABLE: "TABLE", VECTOR: "VCT" }[st.modo]; if (nm) I.push(nm);
    I.push(st.cfg.ang); if (st.cfg.fmt.t !== "Norm") I.push(st.cfg.fmt.t.toUpperCase()); if (st.cfg.io === "Math") I.push("Math"); if (st.ins) I.push("INS");
    return I.map((x) => `<span>${x}</span>`).join("");
  }
  function desenhaVisor() {
    const v = el.querySelector(".lcd");
    let cima = "", baixo = "";
    switch (st.tela) {
      case "edit": cima = linhaEd(st.ed); break;
      case "res": {
        const r = st.res; cima = linhaEd({ tok: r.tok || [], cur: -1 }, false);
        if (r.par) baixo = r.par.map(([k, x]) => `<div>${k}=${formata(x)}</div>`).join("");
        else if (r.solve) baixo = `<div class="sol">${r.nome}= ${mostraNumero(r.v, { tok: [] })}</div><div class="lr">L−R= ${formata(+r.lr.toPrecision(10))}</div>`;
        else baixo = (r.rotulo ? `<span class="rot">${r.rotulo}</span> ` : "") + mostraNumero(r.v, r);
        break;
      }
      case "matres": case "vctres": cima = `<span class="tit">${st.tela === "matres" ? "MatAns" : "VctAns"}</span>`; baixo = mostraMatriz(st.ans); break;
      case "erro": cima = `<span class="erro">${esc(st.erro.tipo)}</span>`; baixo = `<div class="dica">[AC] cancelar &nbsp; [◀][▶] voltar e corrigir</div>`; break;
      case "menu": {
        const M = st.menu;
        if (M.confirma) { cima = `<span class="tit">${M.titulo}</span>`; baixo = `<div class="dica">[=] sim &nbsp; [AC] cancelar</div>`; break; }
        if (M.digito) { cima = `<span class="tit">${M.titulo}</span>`; break; }
        const por = M.porPag || 8, ini = M.pag * por, pags = Math.ceil(M.itens.length / por);
        cima = `<span class="tit">${M.titulo}</span>${pags > 1 ? `<span class="pag">${M.pag + 1}/${pags} ▲▼</span>` : ""}`;
        baixo = `<div class="lcd-menu${M.dois ? " um" : ""}">${M.itens.slice(ini, ini + por).map((it, i) => `<div><b>${M.dois ? String(ini + i + 1).padStart(2, "0") : ini + i + 1}:</b>${esc(it[0])}${it[2] ? `<small> ${esc(it[2])}</small>` : ""}</div>`).join("")}</div>${M.dois ? `<div class="dica">digite os 2 números${M.dig ? ": " + M.dig + "_" : ""}</div>` : ""}`;
        break;
      }
      case "prompt": { const P = st.prompt, nome = P.nomes[P.i]; const atual = P.modo === "tab" ? P.val[P.i] : st.vars[nome]; cima = `<span class="tit">${nome}?</span>`; baixo = st.buf.tok.length ? `<div class="ed">${linhaEd(st.buf)}</div>` : `<div class="ed">${formata(atual)}<span class="cur"></span></div>`; break; }
      case "tabf": cima = `<span class="tit">f(X)=</span>${linhaEd(st.tab.f)}`; baixo = `<div class="dica">use ALPHA ) para o X; depois [=]</div>`; break;
      case "tab": { const L = st.tab.linhas, c = st.tab.cur, ini = Math.max(0, Math.min(c - 1, L.length - 3)); cima = `<table class="lcd-tab"><tr><th></th><th>X</th><th>F(X)</th></tr>${L.slice(ini, ini + 3).map((r, i) => `<tr class="${ini + i === c ? "sel" : ""}"><td>${ini + i + 1}</td><td>${formata(r[0])}</td><td>${isNaN(r[1]) ? "ERROR" : formata(r[1])}</td></tr>`).join("")}</table>`; break; }
      case "estdados": {
        const S = st.stat, par = S.tipo !== "1VAR", n = S.x.length, c = S.cur, ini = Math.max(0, Math.min(c.r - 1, n + 1 - 3));
        const linhas = []; for (let i = ini; i < Math.min(n + 1, ini + 3); i++) linhas.push(`<tr><td>${i + 1}</td><td class="${c.r === i && c.c === 0 ? "sel" : ""}">${S.x[i] !== undefined ? formata(S.x[i]) : ""}</td>${par ? `<td class="${c.r === i && c.c === 1 ? "sel" : ""}">${S.y[i] !== undefined ? formata(S.y[i]) : ""}</td>` : ""}</tr>`);
        cima = `<table class="lcd-tab"><tr><th></th><th>X</th>${par ? "<th>Y</th>" : ""}</tr>${linhas.join("")}</table>`;
        baixo = `<div class="ed">${linhaEd(st.buf)}</div>`; break;
      }
      case "eqn": {
        const q = st.eqn, nomes = "abcd", L = q.coef.length, C = q.coef[0].length;
        cima = `<span class="tit">${TIPOS_EQN[q.tipo][1]}</span><table class="lcd-tab">${L > 1 ? `<tr><th></th>${[...nomes.slice(0, C)].map((x) => `<th>${x}</th>`).join("")}</tr>` : `<tr>${[...nomes.slice(0, C)].map((x) => `<th>${x}</th>`).join("")}</tr>`}${q.coef.map((r, i) => `<tr>${L > 1 ? `<td>${i + 1}</td>` : ""}${r.map((x, j) => `<td class="${q.cur.r === i && q.cur.c === j ? "sel" : ""}">${formata(x)}</td>`).join("")}</tr>`).join("")}</table>`;
        baixo = `<div class="ed">${linhaEd(st.buf)}</div>`; break;
      }
      case "eqnsol": { const [k, x] = st.eqn.sol[st.eqn.si]; cima = `<span class="tit">${esc(k)}=</span>${st.eqn.sol.length > 1 ? `<span class="pag">${st.eqn.si + 1}/${st.eqn.sol.length} ▼</span>` : ""}`; baixo = typeof x === "string" ? x : mostraNumero(x, { tok: [], exato: st.cfg.io === "Math" }); break; }
      case "medit": {
        const E = st.med, o = E.tipo === "mat" ? st.mats[E.n] : st.vcts[E.n], linhas = E.tipo === "mat" ? o.m : [o.v];
        cima = `<span class="tit">${E.tipo === "mat" ? "Mat" : "Vct"}${E.n}</span><table class="lcd-mat">${linhas.map((r, i) => `<tr>${r.map((x, j) => `<td class="${E.r === i && E.c === j ? "sel" : ""}">${formata(x)}</td>`).join("")}</tr>`).join("")}</table>`;
        baixo = `<div class="ed">${linhaEd(st.buf)}</div>`; break;
      }
    }
    v.innerHTML = `<div class="lcd-ind">${indicadores()}</div><div class="lcd-cima">${cima}</div><div class="lcd-baixo">${baixo}</div>`;
    const c = v.querySelector(".lcd-cima .cur"); if (c) c.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  /* ---------------- montagem na página ---------------- */
  let el = null;
  function botao([id, rot, shf = "", alp = "", cls = "", base = ""]) {
    return `<div class="k-cel"><div class="k-sup"><span class="k-sh">${esc(shf)}</span><span class="k-al">${esc(alp)}</span>${base ? `<span class="k-bs">${base}</span>` : ""}</div><button type="button" class="k ${cls}" data-k="${id}" aria-label="${esc(rot)}">${esc(rot)}</button></div>`;
  }
  function monta() {
    el = document.createElement("div");
    el.className = "calc-dock"; el.id = "calculadora"; el.setAttribute("aria-label", "Calculadora científica");
    const dpad = `<div class="k-dpad" aria-label="setas"><button type="button" data-k="up" aria-label="para cima">▲</button><button type="button" data-k="left" aria-label="para a esquerda">◀</button><button type="button" data-k="right" aria-label="para a direita">▶</button><button type="button" data-k="down" aria-label="para baixo">▼</button></div>`;
    const topo = `<div class="k-topo"><div class="k-cel"><div class="k-sup"></div><button type="button" class="k k-shift" data-k="shift">SHIFT</button></div><div class="k-cel"><div class="k-sup"></div><button type="button" class="k k-alpha" data-k="alpha">ALPHA</button></div>${dpad}<div class="k-cel"><div class="k-sup"><span class="k-sh">SETUP</span></div><button type="button" class="k" data-k="mode">MODE</button></div><div class="k-cel"><div class="k-sup"></div><button type="button" class="k" data-k="on">ON</button></div></div>`;
    const lin1 = LINHAS[0].map((k) => (k[0] === "DPAD" ? `<div class="k-vazio"></div>` : botao(k))).join("");
    el.innerHTML = `<button type="button" class="calc-aba" aria-expanded="false" aria-controls="calc-corpo"><span class="calc-mini"></span><span>Calculadora</span><span class="calc-seta">▲</span></button>
      <div class="calc-corpo" id="calc-corpo" tabindex="-1">
        <div class="lcd" aria-live="polite"></div>
        <div class="k-blocoA">${topo}<div class="k-linha k-linha1">${lin1}</div></div>
        <div class="k-blocoB">${LINHAS.slice(1, 4).map((l) => `<div class="k-linha k6">${l.map(botao).join("")}</div>`).join("")}</div>
        <div class="k-blocoC">${LINHAS.slice(4).map((l) => `<div class="k-linha k5">${l.map(botao).join("")}</div>`).join("")}</div>
      </div>`;
    document.body.appendChild(el);
    el.querySelector(".calc-aba").addEventListener("click", () => abre(!el.classList.contains("aberta")));
    el.querySelector(".calc-corpo").addEventListener("click", (ev) => { const b = ev.target.closest("[data-k]"); if (!b) return; aperta(b.dataset.k); el.querySelector(".calc-corpo").focus({ preventScroll: true }); });
    el.querySelector(".calc-corpo").addEventListener("keydown", teclado);
    desenha();
  }
  function aperta(id) { try { tecla(id); } catch (e) { if (!(e instanceof Erro)) console.error(e); mostraErro(e instanceof Erro ? e.message : "Math"); } desenha(); }
  CALC.aperta = aperta;
  function desenha() {
    if (!el) return;
    desenhaVisor();
    el.querySelector('[data-k="shift"]').classList.toggle("ligado", st.shift);
    el.querySelector('[data-k="alpha"]').classList.toggle("ligado", st.alpha);
    el.classList.toggle("modo-shift", st.shift); el.classList.toggle("modo-alpha", st.alpha);
  }
  function teclado(ev) {
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const k = ev.key, mapa = { "0": "0", "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9", ".": "pt", ",": "pt", "+": "add", "-": "sub", "*": "mul", "/": "div", "(": "lp", ")": "rp", "^": "pow", Enter: "igual", "=": "igual", Backspace: "del", Delete: "del", Escape: "ac", ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
    if (mapa[k]) { ev.preventDefault(); aperta(mapa[k]); }
  }
  function abre(on) { if (!el) return; el.classList.toggle("aberta", on); el.querySelector(".calc-aba").setAttribute("aria-expanded", on); if (on) setTimeout(() => el.querySelector(".calc-corpo").focus({ preventScroll: true }), 300); }
  function fecha() { abre(false); }
  CALC.abre = abre;
  /* liga e desliga (interruptor nas configurações) */
  function liga(on) {
    if (on && !el) monta();
    if (!el) return;
    if (on) { el.classList.remove("saindo"); el.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("visivel"))); }
    else { el.classList.remove("visivel", "aberta"); setTimeout(() => { if (!el.classList.contains("visivel")) el.hidden = true; }, 450); }
  }
  CALC.liga = liga;

  document.addEventListener("DOMContentLoaded", () => {
    const sw = document.getElementById("cfg-calc");
    const ler = () => { try { return JSON.parse(localStorage.getItem("fisica:calculadora") || "false"); } catch (e) { return false; } };
    const pinta = () => { const on = ler(); if (sw) sw.setAttribute("aria-checked", on); };
    if (sw) sw.addEventListener("click", () => { const on = !ler(); try { localStorage.setItem("fisica:calculadora", JSON.stringify(on)); } catch (e) {} pinta(); liga(on); });
    pinta(); if (ler()) liga(true);
  });

  /* para testes */
  CALC._ = { analisa, avalia, executa, formata, exato, fracao, resolveEqn, estat, tokenDe, T };
})();
