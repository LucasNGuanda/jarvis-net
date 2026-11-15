/* Simulações da Química, módulo B (Atomística), temas B01 a B08. Conferido em Python e em tests (ver PROGRESSO):
   B01 SIM.atomo: monte o átomo (prótons 1 a 20, nêutrons, elétrons); A = Z + N; carga = Z − elétrons.
   B02 SIM.isotopos: massa atômica como média ponderada. Dados (números de massa e abundância do mais leve): Li 6/7 7,6%; B 10/11 19,9%; Cl 35/37 75,8%;
       Cu 63/65 69,2%; Br 79/81 50,7%. Média = x·m₁ + (1 − x)·m₂ (com os números de massa: Cl 35,48; valor de tabela 35,45).
   B03 SIM.rutherford: partículas alfa num núcleo. Distância de máxima aproximação frontal d = 2Z·1,44 MeV·fm/E (ouro, 5 MeV: 45,5 fm);
       desvio θ = 2·atan(d/2b) para o parâmetro de impacto b (b = d/2 → 90°); as trajetórias são integradas numericamente (aceleração v₀²d/(2r²)).
       No modelo de Thomson a carga positiva está espalhada no átomo inteiro e o desvio é desprezível (trajetórias retas no desenho).
   B04 SIM.orbitais: distribuição eletrônica pelo diagrama de Pauling até Z = 36, com as exceções do cromo (4s¹3d⁵) e do cobre (4s¹3d¹⁰), e regra de Hund.
   B05 SIM.hibridos: direções dos orbitais híbridos sp (180°), sp² (120°), sp³ (109,47° = arccos(−1/3)), girando em 3D.
   B06 SIM.tabela: tabela periódica clicável (118 elementos): grupo, período, bloco, tipo e estado físico a 25 °C.
   B07 SIM.tendencias: raio atômico (pm), eletronegatividade de Pauling e 1ª energia de ionização (kJ/mol) contra Z, de 1 a 36 (valores de tabela; o raio só
       para os elementos representativos, e varia com a definição usada).
   B08 SIM.decaimento: caminhe pela série de decaimento com emissões α (Z − 2, A − 4) e β⁻ (Z + 1, A igual). U-238 → Pb-206: 8 α e 6 β. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const SIMB = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og".split(" ");
  const NOME = "hidrogênio hélio lítio berílio boro carbono nitrogênio oxigênio flúor neônio sódio magnésio alumínio silício fósforo enxofre cloro argônio potássio cálcio escândio titânio vanádio cromo manganês ferro cobalto níquel cobre zinco gálio germânio arsênio selênio bromo criptônio rubídio estrôncio ítrio zircônio nióbio molibdênio tecnécio rutênio ródio paládio prata cádmio índio estanho antimônio telúrio iodo xenônio césio bário lantânio cério praseodímio neodímio promécio samário európio gadolínio térbio disprósio hólmio érbio túlio itérbio lutécio háfnio tântalo tungstênio rênio ósmio irídio platina ouro mercúrio tálio chumbo bismuto polônio astato radônio frâncio rádio actínio tório protactínio urânio netúnio plutônio amerício cúrio berquélio califórnio einstênio férmio mendelévio nobélio laurêncio rutherfórdio dúbnio seabórgio bóhrio hássio meitnério darmstádtio roentgênio copernício nihônio fleróvio moscóvio livermório tennesso oganessônio".split(" ");
  SIM.ELEM = { simb: SIMB, nome: NOME };
  const sob = (n) => String(n).split("").map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]).join(""), sub = (n) => String(n).split("").map((c) => "₀₁₂₃₄₅₆₇₈₉"[+c]).join("");

  /* ---------- B01 · monte o átomo ---------- */
  SIM.atomo = (el, F) => {
    const W = 680, H = 300;
    let p = 6, n = 6, e = 6, tt = 0;
    SIM.atomo._conta = (p, n, e) => ({ Z: p, A: p + n, carga: p - e, tipo: p === e ? "átomo neutro" : p > e ? "cátion" : "ânion", simb: SIMB[p - 1], nome: NOME[p - 1] });
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("prótons", "p", 1, 20, 1, 6)}${sl("nêutrons", "n", 0, 24, 1, 6)}${sl("elétrons", "e", 0, 20, 1, 6)}
        <div class="bts"><button class="bt" data-a="neutro">Deixar neutro</button></div></div>
      <div class="status">Mexa em cada partícula e veja o que muda. <b>Prótons</b> mudam o elemento (o nome e o símbolo). <b>Nêutrons</b> mudam só a massa: o elemento continua o mesmo (são isótopos). <b>Elétrons</b> mudam só a carga: o átomo vira um íon. O desenho não está em escala: num átomo de verdade o núcleo é cerca de cem mil vezes menor que o átomo, e as "órbitas" são só um jeito de mostrar as camadas. O laboratório aceita qualquer número de nêutrons, mas só algumas combinações existem na natureza.</div>`);
    const q = (s) => el.querySelector(s), val = (c) => +q(`[data-c=${c}]`).value;
    q("[data-a=neutro]").addEventListener("click", () => { q("[data-c=e]").value = val("p"); });
    anima(el, F, (dt) => {
      tt += dt; p = val("p"); n = val("n"); e = val("e");
      const c = SIM.atomo._conta(p, n, e);
      ["p", "n", "e"].forEach((k) => (q(`[data-o=${k}]`).textContent = val(k)));
      const cx = 190, cy = 150;
      let sv = "";
      /* camadas K, L, M, N: 2, 8, 8, 2 (até 20 elétrons) */
      const cap = [2, 8, 8, 2]; let resto = e;
      cap.forEach((m, i) => { const k = Math.min(m, resto); resto -= k; const r = 46 + i * 26; sv += `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:none;stroke:var(--line2);stroke-dasharray:3 4"/>`; for (let j = 0; j < k; j++) { const a = (j / k) * 6.283 + tt * (0.5 - i * 0.1) + i; sv += `<circle cx="${(cx + r * Math.cos(a)).toFixed(1)}" cy="${(cy + r * Math.sin(a)).toFixed(1)}" r="4.5" style="fill:var(--mA)"/>`; } });
      /* núcleo: espiral de prótons (vermelhos) e nêutrons (cinza) */
      const tot = p + n; for (let i = 0; i < tot; i++) { const r = 4.2 * Math.sqrt(i), a = i * 2.399, prot = Math.round(((i + 1) * p) / tot) > Math.round((i * p) / tot); sv += `<circle cx="${(cx + r * Math.cos(a)).toFixed(1)}" cy="${(cy + r * Math.sin(a)).toFixed(1)}" r="4.6" style="fill:${prot ? "var(--bad)" : "var(--ink3)"};stroke:var(--bg);stroke-width:.8"/>`; }
      /* notação */
      const carga = c.carga === 0 ? "" : (Math.abs(c.carga) === 1 ? "" : Math.abs(c.carga)) + (c.carga > 0 ? "+" : "−");
      sv += D.txt(470, 132, c.simb, "tx", "middle", 'style="font-size:64px;font-weight:700"') + D.txt(430 - (c.simb.length > 1 ? 16 : 0), 100, String(c.A), "tx", "end", 'style="font-size:22px"') + D.txt(430 - (c.simb.length > 1 ? 16 : 0), 138, String(c.Z), "tx", "end", 'style="font-size:22px"') + D.txt(510 + (c.simb.length > 1 ? 16 : 0), 100, carga, "tx", "start", 'style="font-size:22px"') + D.txt(470, 176, c.nome, "tx2") + D.txt(380, 96, "A →", "tx2", "end") + D.txt(380, 134, "Z →", "tx2", "end") + D.txt(470, 220, "vermelho: próton · cinza: nêutron · azul: elétron", "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("número atômico Z", String(c.Z)) + vis("número de massa A = Z + N", String(c.A)) + vis("carga = Z − elétrons", (c.carga > 0 ? "+" : "") + String(c.carga).replace("-", "−")) + vis("é um", c.tipo + (c.tipo === "átomo neutro" ? "" : " de " + c.nome));
    });
  };

  /* ---------- B02 · massa atômica como média ponderada ---------- */
  SIM.isotopos = (el, F) => {
    const W = 680, H = 280, EL = { Li: [6, 7, 7.6, 6.94, "lítio"], B: [10, 11, 19.9, 10.81, "boro"], Cl: [35, 37, 75.8, 35.45, "cloro"], Cu: [63, 65, 69.2, 63.55, "cobre"], Br: [79, 81, 50.7, 79.9, "bromo"] };
    let k = "Cl";
    SIM.isotopos._media = (m1, m2, x) => (x * m1 + (100 - x) * m2) / 100;
    SIM.isotopos._dados = () => EL;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("abundância do isótopo mais leve (%)", "x", 0, 100, 0.1, 50)}
        <div><div class="bts">${botoes(Object.keys(EL).map((s) => [s, EL[s][4]]), "el", "Cl")}</div></div>
        <div class="bts"><button class="bt pri" data-a="real">Usar a abundância da natureza</button></div></div>
      <div class="status">As duas barras são os dois isótopos do elemento, como num espectro de massas: a altura é a abundância. O triângulo é a <b>massa atômica</b>, a média ponderada das massas. Ela não é a média simples, e quase nunca coincide com a massa de algum átomo de verdade: fica mais perto do isótopo mais abundante, como o ponto de equilíbrio de uma gangorra. Tente acertar a abundância que leva o triângulo ao valor da tabela periódica antes de apertar o botão. Aqui a massa de cada isótopo é aproximada pelo número de massa.</div>`);
    const q = (s) => el.querySelector(s), val = (c) => +q(`[data-c=${c}]`).value;
    liga(el, "el", (s) => (k = s));
    q("[data-a=real]").addEventListener("click", () => { q("[data-c=x]").value = EL[k][2]; });
    anima(el, F, () => {
      const [m1, m2, real, tabela, nome] = EL[k], x = val("x"), med = SIM.isotopos._media(m1, m2, x);
      q("[data-o=x]").textContent = n2(x, 1) + "%";
      const X = (m) => 160 + ((m - m1) / (m2 - m1)) * 360, base = 200, hmax = 140;
      let sv = `<line x1="100" x2="580" y1="${base}" y2="${base}" style="stroke:var(--ink2);stroke-width:2"/>`;
      [[m1, x], [m2, 100 - x]].forEach(([m, a]) => { const h = (a / 100) * hmax; sv += `<rect x="${X(m) - 26}" y="${base - h}" width="52" height="${h}" style="fill:color-mix(in srgb,var(--mod) 45%,transparent);stroke:var(--mod);stroke-width:2"/>` + D.txt(X(m), base - h - 8, n2(a, 1) + "%", "tx2") + D.txt(X(m), base + 20, sob(m) + k, "tx", "middle", 'style="font-weight:700"') + D.txt(X(m), base + 38, "massa ≈ " + m, "tx2"); });
      sv += `<path d="M${X(med)} ${base + 46} l-10 16 l20 0 Z" style="fill:var(--warn)"/>` + D.txt(X(med), base + 78, "média: " + n2(med, 2), "tx2", "middle", 'style="fill:var(--warn)"') + `<line x1="${X(tabela)}" x2="${X(tabela)}" y1="${base - hmax - 16}" y2="${base}" style="stroke:var(--ok);stroke-width:1.6;stroke-dasharray:5 4"/>` + D.txt(X(tabela), base - hmax - 22, "tabela: " + n2(tabela, 2), "tx2", "middle", 'style="fill:var(--ok)"') + D.txt(60, 60, nome, "tx", "start", 'style="font-weight:700"');
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("conta", n2(x / 100, 3) + " · " + m1 + " + " + n2(1 - x / 100, 3) + " · " + m2) + vis("massa atômica média", n2(med, 2) + " u") + vis("valor da tabela", n2(tabela, 2) + " u") + vis("diferença", n2(med - tabela, 2) + " u");
    });
  };

  /* ---------- B03 · Rutherford: partículas alfa contra uma folha de metal ---------- */
  SIM.rutherford = (el, F) => {
    const W = 680, H = 300, ALVO = { au: ["ouro", 79], ag: ["prata", 47], al: ["alumínio", 13] };
    let alvo = "au", modelo = "r", cache = "", tt = 0, caminhos = [];
    SIM.rutherford._d = (Z, E) => (2 * Z * 1.44) / E;
    SIM.rutherford._theta = (b, d) => (b === 0 ? 180 : (2 * Math.atan(d / (2 * Math.abs(b))) * 180) / Math.PI);
    /* trajetória numérica em unidades de fm, velocidade inicial 1 ao longo de +x */
    SIM.rutherford._traj = (b, d, X = 320) => { let x = -X, y = b, vx = 1, vy = 0; const pts = [[x, y]], dt = 0.5; for (let i = 0; i < 4000; i++) { const r2 = x * x + y * y, r = Math.sqrt(r2), a = d / (2 * r2), passo = Math.max(0.02, Math.min(dt, r / 40)); vx += (a * x / r) * passo; vy += (a * y / r) * passo; x += vx * passo; y += vy * passo; if (i % 3 === 0) pts.push([x, y]); if (Math.abs(x) > X + 5 || Math.abs(y) > 160) break; } pts.push([x, y]); return { pts, ang: (Math.atan2(vy, vx) * 180) / Math.PI }; };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("energia das partículas alfa (MeV)", "E", 2, 10, 0.1, 5)}
        <div><div class="bts">${botoes(Object.keys(ALVO).map((k) => [k, "folha de " + ALVO[k][0]]), "alvo", "au")}</div></div>
        <div><div class="bts">${botoes([["r", "modelo de Rutherford (núcleo)"], ["t", "modelo de Thomson (pudim)"]], "mod", "r")}</div></div></div>
      <div class="status" data-v="msg"></div>`);
    const q = (s) => el.querySelector(s), val = (c) => +q(`[data-c=${c}]`).value;
    liga(el, "alvo", (k) => (alvo = k)); liga(el, "mod", (k) => (modelo = k));
    anima(el, F, (dt) => {
      tt += dt; const E = val("E"), Z = ALVO[alvo][1], d = SIM.rutherford._d(Z, E);
      q("[data-o=E]").textContent = n2(E, 1) + " MeV";
      const chave = alvo + E + modelo;
      if (chave !== cache) { cache = chave; caminhos = []; for (let i = -10; i <= 10; i++) { const b = i * 14 + 3; caminhos.push(modelo === "r" ? SIM.rutherford._traj(b, d) : { pts: [[-320, b], [325, b]], ang: 0 }); } }
      const cx = 340, cy = 150, esc = 0.95, PX = ([x, y]) => (cx + x * esc).toFixed(1) + " " + (cy - y * esc).toFixed(1);
      let sv = modelo === "t" ? `<circle cx="${cx}" cy="${cy}" r="130" style="fill:color-mix(in srgb,var(--bad) 10%,transparent);stroke:var(--bad);stroke-dasharray:5 5"/>` + D.txt(cx, cy + 5, "carga positiva espalhada pelo átomo inteiro", "tx2") : `<circle cx="${cx}" cy="${cy}" r="${Math.max(3, 7 * esc)}" style="fill:var(--bad)"/><circle cx="${cx}" cy="${cy}" r="${(d * esc).toFixed(1)}" style="fill:none;stroke:var(--bad);stroke-dasharray:3 4;opacity:.7"/>`;
      caminhos.forEach((c, i) => { const volta = Math.abs(c.ang) > 90; sv += `<path d="M${c.pts.map(PX).join(" L")}" style="fill:none;stroke:${volta ? "var(--warn)" : "var(--mA)"};stroke-width:${volta ? 2 : 1.3};opacity:.85"/>`; const s = (tt * 0.25 + i * 0.07) % 1, j = Math.min(c.pts.length - 1, Math.floor(s * c.pts.length)), pt = c.pts[j]; sv += `<circle cx="${(cx + pt[0] * esc).toFixed(1)}" cy="${(cy - pt[1] * esc).toFixed(1)}" r="3" style="fill:var(--ink)"/>`; });
      sv += D.seta(20, 20, 70, 20, "var(--mA)", 1.6) + D.txt(78, 24, "partículas alfa", "tx2", "start") + D.txt(W - 20, 24, "campo de visão: 670 fm", "tx2", "end");
      q("[data-v=sv]").innerHTML = sv;
      const voltam = caminhos.filter((c) => Math.abs(c.ang) > 90).length;
      q("[data-v=lt]").innerHTML = vis("máxima aproximação frontal d", modelo === "r" ? n2(d, 1) + " fm" : "—") + vis("desvio de 90° exige b =", modelo === "r" ? n2(d / 2, 1) + " fm" : "—") + vis("voltam para trás (de 21)", String(voltam)) + vis("raio do átomo ÷ d", modelo === "r" ? n2(144000 / d, 0) : "—");
      q("[data-v=msg]").innerHTML = modelo === "r" ? "Toda a carga positiva está num núcleo minúsculo. A partícula alfa que passa longe quase não desvia; a que passa perto é jogada para o lado, e a que vem de frente volta (em amarelo). O círculo tracejado é a distância de máxima aproximação <b>d</b>, o mais perto que uma alfa consegue chegar: o núcleo tem de ser menor que isso. Diminua a energia e o círculo cresce; troque o metal e veja o efeito da carga do núcleo. O campo de visão é de 670 fm, e o átomo de ouro tem 144 000 fm de raio: quase todas as alfas de verdade passam muito mais longe do que estas e seguem retas." : "No pudim de Thomson a carga positiva está espalhada por todo o átomo, e os elétrons, leves, não seguram uma partícula alfa. O empurrão para um lado é quase cancelado pelo do outro: todas passam quase retas, e <b>nenhuma volta</b>. Foi isso que a experiência desmentiu.";
    });
  };

  /* ---------- B04 · preencha os orbitais (diagrama de Pauling, Hund e Pauli) ---------- */
  SIM.orbitais = (el, F) => {
    const W = 680, H = 300, ORD = [["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6], ["4s", 2], ["3d", 10], ["4p", 6]];
    SIM.orbitais._config = (Z) => { const oc = {}; let r = Z; ORD.forEach(([s, c]) => { const k = Math.min(c, r); oc[s] = k; r -= k; }); if (Z === 24) { oc["4s"] = 1; oc["3d"] = 5; } if (Z === 29) { oc["4s"] = 1; oc["3d"] = 10; } return oc; };
    SIM.orbitais._texto = (Z) => { const oc = SIM.orbitais._config(Z); return ORD.filter(([s]) => oc[s]).map(([s]) => s + sob(oc[s])).join(" "); };
    SIM.orbitais._desemp = (Z) => { const oc = SIM.orbitais._config(Z); return ORD.reduce((t, [s, c]) => { const k = oc[s], n = c / 2; return t + (k <= n ? k : c - k); }, 0); };
    SIM.orbitais._valencia = (Z) => { const oc = SIM.orbitais._config(Z), nmax = Math.max(...ORD.filter(([s]) => oc[s]).map(([s]) => +s[0])); return { n: nmax, e: ORD.filter(([s]) => +s[0] === nmax).reduce((t, [s]) => t + oc[s], 0) }; };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("número atômico Z", "Z", 1, 36, 1, 8)}</div>
      <div class="status">Cada caixinha é um orbital, e cabe nela no máximo dois elétrons, de spins opostos (setas para cima e para baixo: princípio de Pauli). Os subníveis são preenchidos de baixo para cima em energia, na ordem do diagrama de Pauling: repare que o 4s vem <b>antes</b> do 3d. Dentro de um mesmo subnível, os elétrons primeiro ocupam orbitais vazios, todos com o mesmo spin, e só depois emparelham (regra de Hund). Passe devagar pelo 24 (cromo) e pelo 29 (cobre): são as duas exceções desta faixa.</div>`);
    const q = (s) => el.querySelector(s);
    anima(el, F, () => {
      const Z = +q("[data-c=Z]").value, oc = SIM.orbitais._config(Z), v = SIM.orbitais._valencia(Z);
      q("[data-o=Z]").textContent = Z + " (" + SIMB[Z - 1] + ")";
      const Y = { "1s": 270, "2s": 228, "2p": 204, "3s": 162, "3p": 138, "4s": 100, "3d": 78, "4p": 44 }, X0 = { s: 120, p: 220, d: 380 };
      let sv = D.seta(60, 280, 60, 30, "var(--ink2)", 1.4) + D.txt(54, 24, "energia", "tx2", "start");
      ORD.forEach(([s, c]) => { const n = c / 2, k = oc[s], x0 = X0[s[1]], y = Y[s]; sv += D.txt(x0 - 14, y + 5, s, "tx2", "end", k ? 'style="fill:var(--ink);font-weight:700"' : ""); for (let i = 0; i < n; i++) { const up = k > i, dn = k > n + i, x = x0 + i * 30; sv += `<rect x="${x}" y="${y - 12}" width="26" height="24" rx="3" style="fill:${up ? "color-mix(in srgb,var(--mod) 18%,transparent)" : "none"};stroke:${up ? "var(--mod)" : "var(--ink3)"};stroke-width:1.5"/>` + (up ? D.seta(x + 9, y + 9, x + 9, y - 9, "var(--ink)", 1.6) : "") + (dn ? D.seta(x + 17, y - 9, x + 17, y + 9, "var(--warn)", 1.6) : ""); } });
      sv += D.txt(560, 60, SIMB[Z - 1], "tx", "middle", 'style="font-size:52px;font-weight:700"') + D.txt(560, 90, NOME[Z - 1], "tx2") + (Z === 24 || Z === 29 ? D.txt(560, 120, "exceção!", "tx", "middle", 'style="fill:var(--warn);font-weight:700"') : "");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("distribuição (ordem de energia)", SIM.orbitais._texto(Z)) + vis("camada de valência", "n = " + v.n + ", com " + v.e + " elétron" + (v.e > 1 ? "s" : "")) + vis("elétrons desemparelhados", String(SIM.orbitais._desemp(Z)));
    });
  };

  /* ---------- B05 · orbitais híbridos girando ---------- */
  SIM.hibridos = (el, F) => {
    const W = 680, H = 300, T = Math.sqrt(8) / 3;
    const TIPOS = { sp: { n: 2, dir: [[1, 0, 0], [-1, 0, 0]], ang: "180°", geo: "linear", ex: "BeH₂, CO₂, C₂H₂ (cada carbono)", p: 2 }, sp2: { n: 3, dir: [[1, 0, 0], [-0.5, 0, 0.866], [-0.5, 0, -0.866]], ang: "120°", geo: "trigonal plana", ex: "BF₃, C₂H₄ (cada carbono)", p: 1 }, sp3: { n: 4, dir: [[0, 1, 0], [T, -1 / 3, 0], [-T / 2, -1 / 3, T * 0.866], [-T / 2, -1 / 3, -T * 0.866]], ang: "109,5°", geo: "tetraédrica", ex: "CH₄, NH₃, H₂O", p: 0 } };
    let tipo = "sp3", ang = 0.6, puros = true;
    SIM.hibridos._angulo = (n) => (Math.acos(-1 / (n - 1)) * 180) / Math.PI;
    SIM.hibridos._dir = (k) => TIPOS[k].dir;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("velocidade do giro", "v", 0, 2, 0.1, 0.6)}
        <div><div class="bts">${botoes([["sp", "sp"], ["sp2", "sp²"], ["sp3", "sp³"]], "t", "sp3")}</div></div>
        <div class="bts"><button class="bt" data-a="p" aria-pressed="true">mostrar os orbitais p que sobraram</button></div></div>
      <div class="status">Cada lóbulo colorido é um orbital híbrido, que aponta para onde vai uma ligação sigma (ou um par de elétrons livre). Orbitais equivalentes se afastam o máximo possível uns dos outros: dois ficam em linha (180°), três num plano (120°), quatro nos vértices de um tetraedro (109,5°). Os lóbulos cinza são os orbitais p puros que <b>não</b> entraram na mistura: é com eles que se fazem as ligações pi. O desenho mostra só as direções e o formato aproximado dos lóbulos.</div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "t", (k) => (tipo = k));
    q("[data-a=p]").addEventListener("click", (ev) => { puros = !puros; ev.target.setAttribute("aria-pressed", puros); });
    anima(el, F, (dt) => {
      const v = +q("[data-c=v]").value; q("[data-o=v]").textContent = n2(v, 1); ang += dt * v;
      const t = TIPOS[tipo], cx = 250, cy = 150, R = 105, ca = Math.cos(ang), sa = Math.sin(ang), incl = 0.35, ci = Math.cos(incl), si = Math.sin(incl);
      const proj = ([x, y, z]) => { const x1 = x * ca + z * sa, z1 = -x * sa + z * ca, y1 = y * ci - z1 * si, z2 = y * si + z1 * ci; return [x1, y1, z2]; };
      const lobos = t.dir.map((d, i) => ({ d: proj(d), cor: ["var(--mod)", "var(--ok)", "var(--warn)", "var(--bad)"][i], op: 0.75 }));
      if (puros) { const P = tipo === "sp" ? [[0, 1, 0], [0, 0, 1]] : tipo === "sp2" ? [[0, 1, 0]] : []; P.forEach((d) => { lobos.push({ d: proj(d), cor: "var(--ink3)", op: 0.45, fino: true }); lobos.push({ d: proj(d.map((c) => -c)), cor: "var(--ink3)", op: 0.45, fino: true }); }); }
      lobos.sort((a, b) => a.d[2] - b.d[2]);
      let sv = "";
      lobos.forEach((l) => { const [x, y, z] = l.d, comp = Math.hypot(x, y), a = (Math.atan2(-y, x) * 180) / Math.PI, L = R * comp * (l.fino ? 0.8 : 1), larg = (l.fino ? 20 : 30) * (0.75 + 0.25 * (z + 1) / 2); sv += `<g transform="translate(${cx} ${cy}) rotate(${a.toFixed(1)})"><ellipse cx="${(L / 2).toFixed(1)}" cy="0" rx="${Math.max(6, L / 2).toFixed(1)}" ry="${larg.toFixed(1)}" style="fill:color-mix(in srgb,${l.cor} 55%,transparent);stroke:${l.cor};stroke-width:1.5;opacity:${l.op}"/></g>`; });
      sv += `<circle cx="${cx}" cy="${cy}" r="7" style="fill:var(--ink)"/>` + D.txt(520, 70, tipo.replace("2", "²").replace("3", "³"), "tx", "middle", 'style="font-size:48px;font-weight:700"') + D.txt(520, 104, "1 orbital s + " + (t.n - 1) + " orbita" + (t.n > 2 ? "is" : "l") + " p", "tx2") + D.txt(520, 126, "→ " + t.n + " orbitais híbridos iguais", "tx2") + D.txt(520, 160, "sobram " + t.p + " orbita" + (t.p === 1 ? "l" : "is") + " p puro" + (t.p === 1 ? "" : "s"), "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("ângulo entre os híbridos", t.ang) + vis("geometria", t.geo) + vis("ligações pi possíveis", String(t.p)) + vis("exemplos", t.ex);
    });
  };

  /* ---------- B06 · tabela periódica clicável ---------- */
  const pos = (Z) => { if (Z === 1) return [1, 1]; if (Z === 2) return [1, 18]; if (Z <= 4) return [2, Z - 2]; if (Z <= 10) return [2, Z + 8]; if (Z <= 12) return [3, Z - 10]; if (Z <= 18) return [3, Z]; if (Z <= 36) return [4, Z - 18]; if (Z <= 54) return [5, Z - 36]; if (Z <= 56) return [6, Z - 54]; if (Z <= 71) return [8, Z - 54]; if (Z <= 86) return [6, Z - 68]; if (Z <= 88) return [7, Z - 86]; if (Z <= 103) return [9, Z - 86]; return [7, Z - 100]; };
  const info = (Z) => { const [lin, col] = pos(Z), f = lin > 7, periodo = f ? lin - 2 : lin, grupo = f ? null : col, bloco = f ? "f" : Z === 2 ? "s" : col <= 2 ? "s" : col <= 12 ? "d" : "p";
    const gas = [1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86], liq = [35, 80], ametal = [1, 6, 7, 8, 9, 15, 16, 17, 34, 35, 53, 2, 10, 18, 36, 54, 86, 118], semi = [5, 14, 32, 33, 51, 52];
    const fam = grupo === 1 && Z > 1 ? "metal alcalino" : grupo === 2 ? "metal alcalinoterroso" : grupo === 16 ? "calcogênio" : grupo === 17 ? "halogênio" : grupo === 18 ? "gás nobre" : f ? (periodo === 6 ? "lantanídeo" : "actinídeo") : bloco === "d" ? "metal de transição" : Z === 1 ? "hidrogênio (à parte)" : "grupo " + grupo;
    return { Z, lin, col, periodo, grupo, bloco, fam, estado: gas.includes(Z) ? "gás" : liq.includes(Z) ? "líquido" : "sólido", tipo: ametal.includes(Z) ? "ametal" : semi.includes(Z) ? "semimetal" : "metal", simb: SIMB[Z - 1], nome: NOME[Z - 1] }; };
  SIM.posTabela = pos; SIM.infoElemento = info;
  /* desenha a tabela: cor(Z) → cor CSS; devolve o SVG (células de 32 × 30) */
  const desenhaTabela = (cor, sel, x0 = 46, y0 = 16, cw = 33, ch = 28) => { let s = ""; for (let Z = 1; Z <= 118; Z++) { const [l, c] = pos(Z), x = x0 + (c - 1) * cw, y = y0 + (l - 1) * ch + (l > 7 ? 10 : 0); s += `<g data-z="${Z}" style="cursor:pointer"><rect x="${x}" y="${y}" width="${cw - 2}" height="${ch - 2}" rx="3" style="fill:${cor(Z)};stroke:${Z === sel ? "var(--ink)" : "var(--bg)"};stroke-width:${Z === sel ? 2.5 : 1}"/><text x="${x + (cw - 2) / 2}" y="${y + 18}" text-anchor="middle" style="font:600 12px var(--f-text);fill:#10131a;pointer-events:none">${SIMB[Z - 1]}</text></g>`; } for (let g = 1; g <= 18; g++) s += D.txt(x0 + (g - 1) * cw + (cw - 2) / 2, y0 - 4, String(g), "tx2"); for (let p = 1; p <= 7; p++) s += D.txt(x0 - 8, y0 + (p - 1) * ch + 18, String(p), "tx2", "end"); return s; };
  SIM.desenhaTabela = desenhaTabela;
  SIM.tabela = (el, F) => {
    const W = 680, H = 300, COR = { bloco: { s: "#ef8a80", p: "#f1d36b", d: "#7fb0f5", f: "#8fd6a8" }, tipo: { metal: "#7fb0f5", semimetal: "#8fd6a8", ametal: "#f1d36b" }, estado: { sólido: "#aeb9cc", líquido: "#7fb0f5", gás: "#f1d36b" } };
    let modo = "bloco", sel = 11;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div style="grid-column:1/-1"><div class="bts">${botoes([["bloco", "colorir por bloco (s, p, d, f)"], ["tipo", "metal, semimetal ou ametal"], ["estado", "estado físico a 25 °C"]], "modo", "bloco")}</div></div></div>
      <div class="status" data-v="msg"></div>`);
    const q = (s) => el.querySelector(s);
    const desenha = () => {
      const i = info(sel);
      q("[data-v=sv]").innerHTML = desenhaTabela((Z) => COR[modo][info(Z)[modo]], sel) + Object.keys(COR[modo]).map((k, j) => `<rect x="${122 + j * (modo === "bloco" ? 78 : 104)}" y="62" width="14" height="14" rx="3" style="fill:${COR[modo][k]}"/>` + D.txt(142 + j * (modo === "bloco" ? 78 : 104), 74, modo === "bloco" ? "bloco " + k : k, "tx2", "start")).join("");
      q("[data-v=sv]").querySelectorAll("[data-z]").forEach((g) => g.addEventListener("click", () => { sel = +g.dataset.z; desenha(); }));
      q("[data-v=lt]").innerHTML = vis("elemento", i.simb + " · " + i.nome) + vis("número atômico", String(i.Z)) + vis("período · grupo", i.periodo + " · " + (i.grupo || "—")) + vis("bloco", i.bloco) + vis("família", i.fam) + vis("a 25 °C é", i.tipo + ", " + i.estado);
      q("[data-v=msg]").innerHTML = "Clique num elemento. O <b>período</b> (linha) é o número de camadas com elétrons; o <b>grupo</b> (coluna) junta elementos com a mesma configuração na camada de valência, e por isso com química parecida. As duas linhas de baixo (lantanídeos e actinídeos) pertencem aos períodos 6 e 7: ficam fora só para a tabela caber na página. Os estados físicos dos elementos mais pesados, que só existem por instantes, são previsões.";
    };
    liga(el, "modo", (k) => { modo = k; desenha(); });
    desenha();
  };

  /* ---------- B07 · tendências periódicas, de Z = 1 a 36 ---------- */
  SIM.tendencias = (el, F) => {
    const W = 680, H = 300;
    const EN = [2.2, null, 0.98, 1.57, 2.04, 2.55, 3.04, 3.44, 3.98, null, 0.93, 1.31, 1.61, 1.9, 2.19, 2.58, 3.16, null, 0.82, 1.0, 1.36, 1.54, 1.63, 1.66, 1.55, 1.83, 1.88, 1.91, 1.9, 1.65, 1.81, 2.01, 2.18, 2.55, 2.96, 3.0];
    const EI = [1312, 2372, 520, 900, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 786, 1012, 1000, 1251, 1521, 419, 590, 633, 659, 651, 653, 717, 762, 760, 737, 745, 906, 579, 762, 947, 941, 1140, 1351];
    const RA = [37, null, 152, 112, 85, 77, 75, 73, 72, null, 186, 160, 143, 118, 110, 103, 100, null, 227, 197, null, null, null, null, null, null, null, null, null, null, 135, 122, 120, 119, 114, null];
    const PR = { ra: ["raio atômico (pm)", RA, 250], en: ["eletronegatividade (Pauling)", EN, 4.2], ei: ["1ª energia de ionização (kJ/mol)", EI, 2500] };
    let k = "ei", sel = 11;
    SIM.tendencias._dados = () => ({ EN, EI, RA });
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("elemento em destaque (Z)", "Z", 1, 36, 1, 11)}
        <div><div class="bts">${botoes([["ra", "raio atômico"], ["en", "eletronegatividade"], ["ei", "energia de ionização"]], "pr", "ei")}</div></div></div>
      <div class="status">O gráfico mostra a propriedade escolhida contra o número atômico. As faixas alternadas são os períodos. Procure o desenho que se repete: dentro de um período a energia de ionização e a eletronegatividade <b>sobem</b> e o raio <b>cai</b> (mais prótons puxando a mesma camada); ao começar um período novo, tudo dá um salto para trás (camada nova, mais longe do núcleo). Os picos da energia de ionização são os gases nobres e os vales são os metais alcalinos. Valores de tabela; o raio só aparece para os elementos representativos e depende de como é definido; gases nobres não têm eletronegatividade de Pauling atribuída aqui.</div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "pr", (x) => (k = x));
    anima(el, F, () => {
      sel = +q("[data-c=Z]").value; q("[data-o=Z]").textContent = sel + " (" + SIMB[sel - 1] + ")";
      const [rot, dados, ymax] = PR[k], x0 = 70, y0 = 250, w = 570, h = 200, X = (Z) => x0 + ((Z - 0.5) / 36.5) * w, Y = (v) => y0 - (v / ymax) * h;
      let sv = "";
      [[1, 2], [3, 10], [11, 18], [19, 36]].forEach(([a, b], i) => (sv += `<rect x="${X(a - 0.5)}" y="${y0 - h}" width="${X(b + 0.5) - X(a - 0.5)}" height="${h}" style="fill:${i % 2 ? "color-mix(in srgb,var(--ink) 5%,transparent)" : "color-mix(in srgb,var(--mod) 7%,transparent)"}"/>` + D.txt((X(a) + X(b)) / 2, y0 - h - 6, (i + 1) + "º" + (i > 1 ? " período" : ""), "tx2")));
      sv += D.seta(x0, y0, x0 + w + 12, y0, "var(--ink2)", 1.4) + D.seta(x0, y0, x0, y0 - h - 14, "var(--ink2)", 1.4) + D.txt(x0 + w / 2, y0 + 38, "número atômico Z", "tx2") + D.txt(x0 + w, y0 - h - 22, rot, "tx2", "end");
      [0.25, 0.5, 0.75, 1].forEach((f) => (sv += `<line x1="${x0}" x2="${x0 + w}" y1="${Y(ymax * f)}" y2="${Y(ymax * f)}" style="stroke:var(--line2);stroke-dasharray:3 4"/>` + D.txt(x0 - 6, Y(ymax * f) + 4, n2(ymax * f, ymax < 10 ? 1 : 0), "tx2", "end")));
      let d = "", ant = false; dados.forEach((v, i) => { if (v === null) { ant = false; return; } d += (ant ? "L" : "M") + X(i + 1).toFixed(1) + " " + Y(v).toFixed(1) + " "; ant = true; });
      sv += `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2"/>`;
      dados.forEach((v, i) => { if (v === null) return; const Z = i + 1; sv += `<circle cx="${X(Z)}" cy="${Y(v)}" r="${Z === sel ? 6 : 3}" style="fill:${Z === sel ? "var(--warn)" : "var(--mod)"}"/>`; });
      for (let Z = 1; Z <= 36; Z++) sv += D.txt(X(Z), y0 + 15, SIMB[Z - 1], "tx2", "middle", `style="font-size:10px${Z === sel ? ";fill:var(--warn);font-weight:700" : ""}"`);
      q("[data-v=sv]").innerHTML = sv;
      const i = info(sel);
      q("[data-v=lt]").innerHTML = vis(SIMB[sel - 1] + " · " + NOME[sel - 1], "período " + i.periodo + ", grupo " + i.grupo) + vis("raio atômico", RA[sel - 1] === null ? "—" : RA[sel - 1] + " pm") + vis("eletronegatividade", EN[sel - 1] === null ? "—" : n2(EN[sel - 1], 2)) + vis("1ª energia de ionização", EI[sel - 1] + " kJ/mol");
    });
  };

  /* ---------- B08 · caminhe pela série de decaimento ---------- */
  SIM.decaimento = (el, F) => {
    const W = 680, H = 300, INI = { u238: [92, 238, [82, 206]], th232: [90, 232, [82, 208]], u235: [92, 235, [82, 207]] };
    let k = "u238", cam = [], msg = "";
    SIM.decaimento._alfa = ([Z, A]) => [Z - 2, A - 4]; SIM.decaimento._beta = ([Z, A]) => [Z + 1, A];
    SIM.decaimento._conta = (Z0, A0, Z1, A1) => { const a = (A0 - A1) / 4; return { alfa: a, beta: Z1 - (Z0 - 2 * a) }; };
    const nome = ([Z, A]) => sob(A) + sub(Z) + SIMB[Z - 1];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div style="grid-column:1/-1"><div class="bts">${botoes([["u238", "começar no urânio-238"], ["th232", "tório-232"], ["u235", "urânio-235"]], "ini", "u238")}</div></div>
        <div class="bts"><button class="bt pri" data-a="alfa">Emitir α</button><button class="bt pri" data-a="beta">Emitir β⁻</button><button class="bt" data-a="volta">Desfazer</button></div></div>
      <div class="status" data-v="msg"></div>`);
    const q = (s) => el.querySelector(s);
    const desenha = () => {
      const [Z0, A0, alvo] = INI[k], at = cam[cam.length - 1], na = cam.filter((c, i) => i && c[1] !== cam[i - 1][1]).length, nb = cam.length - 1 - na, fim = at[0] === alvo[0] && at[1] === alvo[1];
      /* carta: x = número de nêutrons N (120 a 148), y = Z (78 a 94) */
      const X = (N) => 60 + ((N - 120) / 28) * 580, Y = (Z) => 270 - ((Z - 78) / 16) * 240;
      let sv = "";
      for (let Z = 78; Z <= 94; Z += 2) sv += `<line x1="60" x2="640" y1="${Y(Z)}" y2="${Y(Z)}" style="stroke:var(--line2);stroke-dasharray:2 5"/>` + D.txt(52, Y(Z) + 4, Z + " " + SIMB[Z - 1], "tx2", "end");
      for (let N = 120; N <= 148; N += 4) sv += D.txt(X(N), 290, String(N), "tx2");
      sv += D.txt(350, 14, "número de nêutrons N (embaixo) × número atômico Z (à esquerda)", "tx2") + `<circle cx="${X(alvo[1] - alvo[0])}" cy="${Y(alvo[0])}" r="9" style="fill:none;stroke:var(--ok);stroke-width:2.5"/>` + D.txt(X(alvo[1] - alvo[0]) + 12, Y(alvo[0]) + 16, "chegada: " + nome(alvo), "tx2", "start", 'style="fill:var(--ok)"');
      cam.forEach((c, i) => { if (i) { const a = cam[i - 1], alfa = c[1] !== a[1]; sv += D.seta(X(a[1] - a[0]), Y(a[0]), X(c[1] - c[0]), Y(c[0]), alfa ? "var(--warn)" : "var(--mA)", 1.8); } });
      cam.forEach((c) => (sv += `<circle cx="${X(c[1] - c[0])}" cy="${Y(c[0])}" r="4" style="fill:var(--ink)"/>`));
      sv += `<circle cx="${X(at[1] - at[0])}" cy="${Y(at[0])}" r="7" style="fill:var(--bad)"/>` + D.txt(X(at[1] - at[0]) + 10, Y(at[0]) - 8, nome(at), "tx", "start", 'style="font-weight:700"');
      q("[data-v=sv]").innerHTML = sv;
      const prev = SIM.decaimento._conta(Z0, A0, alvo[0], alvo[1]);
      q("[data-v=lt]").innerHTML = vis("núcleo atual", nome(at) + " (" + NOME[at[0] - 1] + ")") + vis("emissões α até aqui", String(na)) + vis("emissões β⁻ até aqui", String(nb)) + vis("prótons · nêutrons", at[0] + " · " + (at[1] - at[0]));
      q("[data-v=msg]").innerHTML = (msg ? msg + " " : "") + (fim ? `<b class="ok">Chegou ao chumbo estável com ${na} emissões α e ${nb} emissões β⁻.</b> Confira com a conta: α = (${A0} − ${alvo[1]}) ÷ 4 = ${prev.alfa}; β = ${alvo[0]} − (${Z0} − 2·${prev.alfa}) = ${prev.beta}. A ordem das emissões pode mudar o caminho, mas não esses dois números. ` : "") + "Cada <b>α</b> (seta amarela) tira 2 prótons e 2 nêutrons: Z cai 2 e A cai 4. Cada <b>β⁻</b> (seta azul) transforma um nêutron em próton: Z sobe 1 e A não muda. Tente chegar ao círculo verde. O laboratório aceita qualquer ordem; a natureza segue uma ordem definida para cada série, que não é mostrada aqui.";
    };
    const comeca = (x) => { k = x; cam = [[INI[k][0], INI[k][1]]]; msg = ""; desenha(); };
    liga(el, "ini", comeca);
    const passo = (fn, rot) => { const at = cam[cam.length - 1], nv = fn(at), N = nv[1] - nv[0]; if (nv[0] < 78 || nv[0] > 94 || N < 120 || N > 148) { msg = `<b class="warn">Esse passo sairia da carta.</b>`; desenha(); return; } cam.push(nv); msg = rot + ": " + nome(at) + " → " + nome(nv) + "."; desenha(); };
    q("[data-a=alfa]").addEventListener("click", () => passo(SIM.decaimento._alfa, "Emissão α"));
    q("[data-a=beta]").addEventListener("click", () => passo(SIM.decaimento._beta, "Emissão β⁻"));
    q("[data-a=volta]").addEventListener("click", () => { if (cam.length > 1) cam.pop(); msg = ""; desenha(); });
    SIM.decaimento._estado = () => ({ cam: cam.map((c) => c.slice()) });
    comeca("u238");
  };
})();
