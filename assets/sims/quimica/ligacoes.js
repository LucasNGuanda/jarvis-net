/* Simulações da Química, módulo C (Ligações químicas).
   C01 SIM.ionica: monte o composto iônico. Fórmula pela neutralidade (menor proporção inteira em que as cargas se cancelam) e energia de Coulomb
     de UM par de íons encostados, E = −1,44·|q₊q₋|/d eV, com d = r₊ + r₋ em nm (ke² = 1,44 eV·nm). Raios iônicos (pm), de tabela:
     Na⁺ 102, K⁺ 138, Mg²⁺ 72, Ca²⁺ 100, Al³⁺ 54; F⁻ 133, Cl⁻ 181, O²⁻ 140, S²⁻ 184.
     Conferido em Python: NaCl 283 pm, −5,09 eV; NaF 235 pm, −6,13 eV; KCl 319 pm, −4,51 eV; MgO 212 pm, −27,17 eV; CaO 240 pm, −24,00 eV; Al₂O₃ 194 pm, −44,54 eV.
     É a energia de um par isolado, não a energia reticular do cristal (que soma todos os vizinhos); serve para comparar compostos. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sub = (n) => (n === 1 ? "" : String(n).split("").map((c) => "₀₁₂₃₄₅₆₇₈₉"[+c]).join(""));
  const mdc = (a, b) => (b ? mdc(b, a % b) : a);

  /* ---------- C01 · monte o composto iônico ---------- */
  SIM.ionica = (el, F) => {
    const W = 680, H = 260, CAT = { Na: ["Na⁺", 1, 102, "sódio"], K: ["K⁺", 1, 138, "potássio"], Mg: ["Mg²⁺", 2, 72, "magnésio"], Ca: ["Ca²⁺", 2, 100, "cálcio"], Al: ["Al³⁺", 3, 54, "alumínio"] }, ANI = { F: ["F⁻", 1, 133, "fluoreto"], Cl: ["Cl⁻", 1, 181, "cloreto"], O: ["O²⁻", 2, 140, "óxido"], S: ["S²⁻", 2, 184, "sulfeto"] };
    let c = "Na", a = "Cl";
    SIM.ionica._conta = (c, a) => { const qc = CAT[c][1], qa = ANI[a][1], g = mdc(qc, qa), nc = qa / g, na = qc / g, d = CAT[c][2] + ANI[a][2]; return { nc, na, formula: c + sub(nc) + a + sub(na), d, E: (-1.44 * qc * qa) / (d / 1000) }; };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(Object.keys(CAT).map((k) => [k, CAT[k][0]]), "c", "Na")}</div></div><div><div class="bts">${botoes(Object.keys(ANI).map((k) => [k, ANI[k][0]]), "a", "Cl")}</div></div></div>
      <div class="status">Escolha um cátion e um ânion. O composto tem de ser <b>neutro</b>: o laboratório junta o menor número de íons de cada tipo em que as cargas positivas e negativas se cancelam, e daí sai a fórmula. Os círculos estão em escala (raios iônicos de tabela). A energia mostrada é a de <b>um par</b> de íons encostados, pela lei de Coulomb: cresce com o produto das cargas e diminui com a distância. Ela não é a energia do cristal inteiro, mas ordena os compostos do mesmo jeito: quanto mais negativa, mais difícil separar os íons, e maior tende a ser o ponto de fusão.</div>`);
    const q = (s) => el.querySelector(s);
    const desenha = () => {
      const r = SIM.ionica._conta(c, a), esc = 0.2, rc = CAT[c][2] * esc, ra = ANI[a][2] * esc, lista = [];
      for (let i = 0; i < Math.max(r.nc, r.na); i++) { if (i < r.nc) lista.push("c"); if (i < r.na) lista.push("a"); }
      let x = 340 - lista.reduce((t, k) => t + 2 * (k === "c" ? rc : ra), 0) / 2, sv = "";
      lista.forEach((k) => { const rr = k === "c" ? rc : ra; x += rr; sv += `<circle cx="${x.toFixed(1)}" cy="110" r="${rr.toFixed(1)}" style="fill:color-mix(in srgb,${k === "c" ? "var(--mA)" : "var(--bad)"} 40%,transparent);stroke:${k === "c" ? "var(--mA)" : "var(--bad)"};stroke-width:2"/>` + D.txt(x, 115, k === "c" ? CAT[c][0] : ANI[a][0], "tx2", "middle", 'style="fill:var(--ink);font-weight:700"'); x += rr; });
      sv += D.txt(340, 30, r.formula, "tx", "middle", 'style="font-size:34px;font-weight:700"') + D.txt(340, 54, ANI[a][3] + " de " + CAT[c][3], "tx2") + D.txt(340, 200, "cargas: " + r.nc + " × (+" + CAT[c][1] + ") + " + r.na + " × (−" + ANI[a][1] + ") = 0", "tx2") + D.txt(340, 226, "azul: cátion · vermelho: ânion · tamanhos em escala", "tx2");
      q("[data-v=sv]").innerHTML = sv;
      q("[data-v=lt]").innerHTML = vis("fórmula", r.formula) + vis("proporção cátion : ânion", r.nc + " : " + r.na) + vis("distância entre os centros", r.d + " pm") + vis("energia de um par (Coulomb)", n2(r.E, 1) + " eV");
    };
    liga(el, "c", (k) => { c = k; desenha(); }); liga(el, "a", (k) => { a = k; desenha(); });
    desenha();
  };
  /* ---------- C02 · estruturas de Lewis e ressonância ----------
     Biblioteca de estruturas (SIM.molLewis) e desenhador (SIM.desLewis), usados também pelos temas C02, C04 e C05.
     Átomo: [x, y, símbolo, pares isolados]; ligação: [i, j, ordem]. A carga formal NÃO é digitada: é calculada (CF = V − 2·pares − soma das ordens).
     Conferido em Node (tests da sessão): em toda estrutura, 2·(pares ligantes + pares isolados) = elétrons de valência − carga, e a soma das cargas formais = carga. */
  const VAL = { H: 1, Be: 2, B: 3, C: 4, N: 5, O: 6, F: 7, P: 5, S: 6, Cl: 7, Br: 7, I: 7, Xe: 8 };
  SIM.cargaFormal = (s, pares, ordens) => VAL[s] - 2 * pares - ordens;
  const tri = (c, x, pc = 0) => [0, 1, 2].map((k) => ({ at: [[0, 4, c, pc], [0, -42, x, k === 0 ? 2 : 3], [-40, 27, x, k === 1 ? 2 : 3], [40, 27, x, k === 2 ? 2 : 3]], lig: [[0, 1, k === 0 ? 2 : 1], [0, 2, k === 1 ? 2 : 1], [0, 3, k === 2 ? 2 : 1]] }));
  const ang = (c, x) => [0, 1].map((k) => ({ at: [[0, -10, c, 1], [-42, 16, x, k === 0 ? 2 : 3], [42, 16, x, k === 1 ? 2 : 3]], lig: [[0, 1, k === 0 ? 2 : 1], [0, 2, k === 1 ? 2 : 1]] }));
  const benz = [0, 1].map((k) => { const at = [], lig = []; for (let i = 0; i < 6; i++) { const t = ((90 + 60 * i) * Math.PI) / 180; at.push([38 * Math.cos(t), -38 * Math.sin(t), "C", 0]); } for (let i = 0; i < 6; i++) { const t = ((90 + 60 * i) * Math.PI) / 180; at.push([74 * Math.cos(t), -74 * Math.sin(t), "H", 0]); lig.push([i, (i + 1) % 6, (i + k) % 2 ? 1 : 2], [i, 6 + i, 1]); } return { at, lig }; });
  const um = (at, lig) => [{ at, lig }];
  const BIB = {
    H2: { f: um([[-18, 0, "H", 0], [18, 0, "H", 0]], [[0, 1, 1]]) }, Cl2: { f: um([[-24, 0, "Cl", 3], [24, 0, "Cl", 3]], [[0, 1, 1]]) }, HCl: { f: um([[-22, 0, "H", 0], [22, 0, "Cl", 3]], [[0, 1, 1]]) },
    O2: { f: um([[-22, 0, "O", 2], [22, 0, "O", 2]], [[0, 1, 2]]) }, N2: { f: um([[-22, 0, "N", 1], [22, 0, "N", 1]], [[0, 1, 3]]) }, CO: { f: um([[-22, 0, "C", 1], [22, 0, "O", 1]], [[0, 1, 3]]) },
    H2O: { f: um([[0, -8, "O", 2], [-36, 18, "H", 0], [36, 18, "H", 0]], [[0, 1, 1], [0, 2, 1]]) }, NH3: { f: um([[0, -8, "N", 1], [-38, 14, "H", 0], [0, 34, "H", 0], [38, 14, "H", 0]], [[0, 1, 1], [0, 2, 1], [0, 3, 1]]) },
    CH4: { f: um([[0, 0, "C", 0], [0, -40, "H", 0], [-40, 0, "H", 0], [40, 0, "H", 0], [0, 40, "H", 0]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]]) }, NH4: { c: 1, f: um([[0, 0, "N", 0], [0, -40, "H", 0], [-40, 0, "H", 0], [40, 0, "H", 0], [0, 40, "H", 0]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]]) },
    CO2: { f: um([[0, 0, "C", 0], [-48, 0, "O", 2], [48, 0, "O", 2]], [[0, 1, 2], [0, 2, 2]]) }, CO2b: { f: um([[0, 0, "C", 0], [-48, 0, "O", 1], [48, 0, "O", 3]], [[0, 1, 3], [0, 2, 1]]) },
    HCN: { f: um([[-44, 0, "H", 0], [0, 0, "C", 0], [46, 0, "N", 1]], [[0, 1, 1], [1, 2, 3]]) }, H2CO: { f: um([[0, 4, "C", 0], [0, -42, "O", 2], [-38, 28, "H", 0], [38, 28, "H", 0]], [[0, 1, 2], [0, 2, 1], [0, 3, 1]]) },
    BF3: { f: um([[0, 4, "B", 0], [0, -42, "F", 3], [-40, 27, "F", 3], [40, 27, "F", 3]], [[0, 1, 1], [0, 2, 1], [0, 3, 1]]) },
    N2O: { f: [um([[-48, 0, "N", 2], [0, 0, "N", 0], [48, 0, "O", 2]], [[0, 1, 2], [1, 2, 2]])[0], um([[-48, 0, "N", 1], [0, 0, "N", 0], [48, 0, "O", 3]], [[0, 1, 3], [1, 2, 1]])[0], um([[-48, 0, "N", 3], [0, 0, "N", 0], [48, 0, "O", 1]], [[0, 1, 1], [1, 2, 3]])[0]] },
    NON: { f: um([[-48, 0, "N", 2], [0, 0, "O", 0], [48, 0, "N", 2]], [[0, 1, 2], [1, 2, 2]]) },
    O3: { f: ang("O", "O") }, SO2: { f: ang("S", "O") }, SO2x: { f: um([[0, -10, "S", 1], [-42, 16, "O", 2], [42, 16, "O", 2]], [[0, 1, 2], [0, 2, 2]]) }, NO2m: { c: -1, f: ang("N", "O") },
    NO3: { c: -1, f: tri("N", "O") }, CO3: { c: -2, f: tri("C", "O") }, C6H6: { f: benz },
  };
  SIM.molLewis = (nome, k = 0) => BIB[nome].f[k];
  SIM.contaLewis = (nome, k = 0) => { const m = BIB[nome], { at, lig } = m.f[k], c = m.c || 0, so = at.map(() => 0); lig.forEach(([i, j, o]) => { so[i] += o; so[j] += o; }); const cf = at.map((a, i) => SIM.cargaFormal(a[2], a[3], so[i])), n = m.f.length, med = lig.map((l, q) => m.f.reduce((t, f) => t + f.lig[q][2], 0) / n);
    return { carga: c, val: at.reduce((t, a) => t + VAL[a[2]], 0) - c, lig: lig.reduce((t, l) => t + l[2], 0), isol: at.reduce((t, a) => t + a[3], 0), cf, formas: n, med, hibrido: { at: at.map((a) => [a[0], a[1], a[2], 0]), lig: lig.map((l, q) => [l[0], l[1], med[q]]) } }; };
  SIM.desLewis = (at, lig, o = {}) => {
    const { dx = 0, dy = 0, pares = true, cf = true, cor = "var(--ink)" } = o, dir = at.map(() => []), so = at.map(() => 0); let s = "";
    lig.forEach(([i, j, od = 1]) => { const [x1, y1] = at[i], [x2, y2] = at[j], L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, r1 = at[i][2].length > 1 ? 14 : 11, r2 = at[j][2].length > 1 ? 14 : 11, a = [x1 + ux * r1 + dx, y1 + uy * r1 + dy], b = [x2 - ux * r2 + dx, y2 - uy * r2 + dy];
      dir[i].push(Math.atan2(uy, ux)); dir[j].push(Math.atan2(-uy, -ux)); so[i] += od; so[j] += od;
      const frac = od % 1 !== 0, desl = frac ? (od < 2 ? [-3, 3] : [-5, 0, 5]) : od === 1 ? [0] : od === 2 ? [-3, 3] : [-5, 0, 5];
      s += desl.map((d, q) => `<line x1="${(a[0] - uy * d).toFixed(1)}" y1="${(a[1] + ux * d).toFixed(1)}" x2="${(b[0] - uy * d).toFixed(1)}" y2="${(b[1] + ux * d).toFixed(1)}" style="stroke:${frac && q === desl.length - 1 ? "var(--warn)" : cor};stroke-width:1.8${frac && q === desl.length - 1 ? ";stroke-dasharray:4 3" : ""}"/>`).join(""); });
    at.forEach(([x, y, sb, np = 0], i) => { s += D.txt(x + dx, y + dy + 6, sb, "tx", "middle", 'style="font-weight:700"'); const A = dir[i], usados = A.slice();
      if (pares && np) { let rx = 0, ry = 0; A.forEach((t) => { rx += Math.cos(t); ry += Math.sin(t); }); const R = Math.hypot(rx, ry), base = R > 0.2 ? Math.atan2(-ry, -rx) : A.length ? A[0] + Math.PI / 2 : -Math.PI / 2;
        const gr = Math.PI / 180, offs = A.length <= 1 ? (np === 1 ? [0] : np === 2 ? [-60 * gr, 60 * gr] : np === 3 ? [-90 * gr, 0, 90 * gr] : [-135 * gr, -45 * gr, 45 * gr, 135 * gr]) : R <= 0.2 ? (np === 1 ? [0] : [0, Math.PI]) : np === 1 ? [0] : np === 2 ? [-40 * gr, 40 * gr] : [-70 * gr, 0, 70 * gr], rr = sb.length > 1 ? 18 : 15;
        offs.forEach((d) => { const t = base + d, cx = x + dx + rr * Math.cos(t), cy = y + dy + rr * Math.sin(t), px = -Math.sin(t) * 3.4, py = Math.cos(t) * 3.4; usados.push(t); s += `<circle cx="${(cx + px).toFixed(1)}" cy="${(cy + py).toFixed(1)}" r="2.1" style="fill:var(--mod)"/><circle cx="${(cx - px).toFixed(1)}" cy="${(cy - py).toFixed(1)}" r="2.1" style="fill:var(--mod)"/>`; }); }
      const q = pares && cf ? SIM.cargaFormal(sb, np, so[i]) : 0;
      if (q) { let melhor = 0, dm = -1; for (let k = 0; k < 24; k++) { const t = (k * 15 * Math.PI) / 180, m = Math.min(...usados.map((u) => Math.abs(Math.atan2(Math.sin(t - u), Math.cos(t - u)))), 9); if (m > dm + 1e-9) { dm = m; melhor = t; } } const cx = x + dx + 24 * Math.cos(melhor), cy = y + dy + 24 * Math.sin(melhor); s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="7.5" style="fill:var(--bg);stroke:var(--warn);stroke-width:1.2"/>` + D.txt(cx, cy + 3.6, (Math.abs(q) > 1 ? Math.abs(q) : "") + (q > 0 ? "+" : "−"), "tx2", "middle", 'style="font-size:10px;fill:var(--warn);font-weight:700"'); } });
    return s;
  };
  SIM.ressonancia = (el, F) => {
    const W = 680, H = 250, M = [["H2O", "H₂O", "água", "96 pm"], ["CO2", "CO₂", "dióxido de carbono", "116 pm"], ["N2", "N₂", "nitrogênio", "110 pm"], ["O3", "O₃", "ozônio", "128 pm"], ["NO3", "NO₃⁻", "íon nitrato", "124 pm"], ["CO3", "CO₃²⁻", "íon carbonato", "129 pm"], ["C6H6", "C₆H₆", "benzeno", "140 pm (C–C)"]];
    let m = "O3", k = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(M.map((x) => [x[0], x[1]]), "m", "O3")}</div></div><div><div class="bts" data-v="fs"></div></div></div>
      <div class="status">Escolha a espécie e, quando houver mais de uma estrutura de Lewis possível, passe pelas <b>formas de ressonância</b> e pelo <b>híbrido</b>. Pontos roxos: pares isolados. Bolinhas amarelas: carga formal, calculada pelo laboratório (elétrons de valência do átomo livre menos os que "são dele" na estrutura). A espécie de verdade é <b>uma só</b>, o híbrido: as ligações que mudam de uma forma para outra são todas iguais, com ordem de ligação intermediária (a linha tracejada). Ela não fica pulando de uma forma para a outra.</div>`);
    const q = (s) => el.querySelector(s);
    const desenha = () => {
      const c = SIM.contaLewis(m, Math.min(k, 9) === 9 ? 0 : k), hib = k === 9, d = M.find((x) => x[0] === m), e = hib ? c.hibrido : SIM.molLewis(m, k), muda = c.med.filter((v) => v % 1 !== 0);
      q("[data-v=sv]").innerHTML = D.txt(340, 26, d[1] + " · " + d[2] + (c.formas > 1 ? (hib ? " · híbrido de ressonância" : " · forma " + (k + 1) + " de " + c.formas) : " · uma única estrutura"), "tx2") + `<g transform="translate(340 132) scale(1.25)">${SIM.desLewis(e.at, e.lig, { pares: !hib })}</g>` + (hib ? D.txt(340, 240, "linha tracejada: ligação parcial, igual em todas as posições", "tx2") : "");
      q("[data-v=lt]").innerHTML = vis("elétrons de valência", c.val) + vis("pares ligantes", c.lig) + vis("pares isolados", c.isol) + vis("ordem de ligação", muda.length ? n2(muda[0], 2) + " (média)" : "inteira") + vis("comprimento medido", d[3]);
    };
    const formas = () => { const n = SIM.contaLewis(m).formas; q("[data-v=fs]").innerHTML = n > 1 ? botoes([...Array(n)].map((_, i) => [i, "forma " + (i + 1)]).concat([[9, "híbrido"]]), "k", k) : `<span class="tx2">sem ressonância: uma estrutura basta</span>`; liga(el, "k", (v) => { k = +v; desenha(); }); };
    liga(el, "m", (v) => { m = v; k = 0; formas(); desenha(); });
    formas(); desenha();
  };
  /* ---------- C03 · mar de elétrons ----------
     Modelo QUALITATIVO da ligação metálica: cátions fixos na rede (vibram mais com a temperatura) e elétrons livres em movimento desordenado.
     Com tensão, soma-se uma deriva para um lado. Corrente relativa = tensão / (1 + α·(T − 20)), com α = 0,004 por °C (ordem de grandeza do cobre):
     é a lei de Ohm com a resistência de um metal crescendo linearmente com a temperatura. Conferido: 20 °C, 1,00; 270 °C, 1/2; 520 °C, 1/3.
     "Martelar" desloca as fileiras de cima de uma posição: os cátions continuam mergulhados nos mesmos elétrons, e a ligação não se rompe. */
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  SIM.metal = (el, F) => {
    const W = 680, H = 250, NX = 12, NY = 4, PX = 50, X0 = 65, Y0 = 50, PY = 50;
    SIM.metal._corrente = (V, T) => V / (1 + 0.004 * (T - 20));
    let V = 0, T = 20, desl = 0, alvo = 0, t = 0;
    const es = [...Array(40)].map(() => ({ x: X0 - 25 + Math.random() * (NX * PX), y: Y0 - 25 + Math.random() * (NY * PY), vx: (Math.random() - 0.5) * 160, vy: (Math.random() - 0.5) * 160 }));
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls">${sl("tensão", "v", 0, 10, 1, 0)}${sl("temperatura (°C)", "t", 20, 520, 50, 20)}<div class="bts"><button class="bt peq" data-b="m">martelar</button></div></div>
      <div class="status">Círculos azuis: os cátions do metal, presos na rede. Pontos amarelos: os elétrons de valência, que não pertencem a nenhum átomo e correm pelo cristal inteiro. Sem tensão, o movimento é desordenado e não há corrente. Com tensão, eles ganham uma deriva para um lado (aqui, exagerada: a de verdade é de frações de milímetro por segundo). Aquecer faz os cátions vibrarem mais, os elétrons esbarram mais e a corrente cai. <b>Martelar</b> desliza as fileiras de cima: os cátions mudam de vizinhos e continuam mergulhados no mesmo mar de elétrons, por isso o metal amassa em vez de quebrar. Modelo qualitativo.</div>`);
    const q = (s) => el.querySelector(s);
    el.querySelectorAll("input[data-c]").forEach((i) => i.addEventListener("input", () => { if (i.dataset.c === "v") V = +i.value; else T = +i.value; saida(); }));
    q("[data-b=m]").addEventListener("click", () => { alvo = alvo ? 0 : PX; });
    const saida = () => { q("[data-o=v]").textContent = V + " V"; q("[data-o=t]").textContent = T + " °C"; q("[data-v=lt]").innerHTML = vis("corrente relativa", n2(SIM.metal._corrente(V, T), 2)) + vis("resistência relativa", n2(1 + 0.004 * (T - 20), 2)) + vis("fileiras de cima", alvo ? "deslocadas" : "no lugar"); };
    saida();
    anima(el, F, (dt) => {
      t += dt; desl += (alvo - desl) * Math.min(1, dt * 5); const amp = 1 + 5 * Math.sqrt((T - 20) / 500), deriva = 22 * SIM.metal._corrente(V, T); let sv = `<rect x="${X0 - 30}" y="${Y0 - 30}" width="${NX * PX + 10}" height="${NY * PY + 10}" rx="8" style="fill:color-mix(in srgb,var(--warn) 7%,transparent);stroke:var(--ink3)"/>`;
      for (let j = 0; j < NY; j++) for (let i = 0; i < NX - 1; i++) { const x = X0 + i * PX + (j < 2 ? desl : 0) + amp * Math.sin(t * 23 + i * 1.7 + j * 2.9), y = Y0 + j * PY + amp * Math.cos(t * 19 + i * 2.3 + j * 1.1); sv += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15" style="fill:color-mix(in srgb,var(--mA) 40%,transparent);stroke:var(--mA);stroke-width:1.6"/>` + D.txt(x, y + 4, "+", "tx2", "middle", 'style="fill:var(--ink);font-weight:700"'); }
      es.forEach((e) => { e.x += (e.vx + deriva) * dt; e.y += e.vy * dt; if (Math.random() < dt * 3) { const a = Math.random() * 6.283; e.vx = 110 * Math.cos(a); e.vy = 110 * Math.sin(a); } const xa = X0 - 25, xb = X0 - 25 + NX * PX, ya = Y0 - 25, yb = Y0 - 25 + NY * PY; if (e.x > xb) e.x -= xb - xa; if (e.x < xa) e.x += xb - xa; if (e.y > yb) { e.y = yb; e.vy = -Math.abs(e.vy); } if (e.y < ya) { e.y = ya; e.vy = Math.abs(e.vy); } sv += `<circle cx="${e.x.toFixed(1)}" cy="${e.y.toFixed(1)}" r="3" style="fill:var(--warn)"/>`; });
      if (V) sv += D.seta(250, 238, 430, 238, "var(--warn)", 1.8) + D.txt(340, 232, "deriva dos elétrons", "tx2");
      q("[data-v=sv]").innerHTML = sv; if (Math.abs(alvo - desl) > 0.5) saida();
    });
  };
  /* ---------- C04 · geometria molecular (VSEPR) ----------
     SIM.GEO[n]: direções (vetores unitários) que afastam ao máximo n regiões de elétrons em volta do átomo central.
     Conferido em Node: ângulos entre vizinhos 180° (2); 120° (3); 109,47° (4, cos = −1/3); 90° e 120° (5); 90° (6).
     SIM.AXE["X,E"]: X átomos ligados e E pares isolados. Os pares isolados ocupam as PRIMEIRAS posições de SIM.GEO, escolhidas para dar a geometria observada:
     na bipirâmide, as equatoriais (menos vizinhos a 90°); no octaedro, posições opostas. SIM.desGeo desenha em projeção ortográfica (gira em torno do eixo vertical). */
  const s8 = Math.sqrt(8) / 3, c3 = (k) => [Math.cos((k * 2 * Math.PI) / 3), Math.sin((k * 2 * Math.PI) / 3)];
  SIM.GEO = { 2: [[1, 0, 0], [-1, 0, 0]], 3: [[0, 1, 0], [-Math.sqrt(3) / 2, -0.5, 0], [Math.sqrt(3) / 2, -0.5, 0]], 4: [[0, 1, 0], ...[0, 1, 2].map((k) => [s8 * c3(k)[0], -1 / 3, s8 * c3(k)[1]])], 5: [...[0, 1, 2].map((k) => [c3(k)[0], 0, c3(k)[1]]), [0, 1, 0], [0, -1, 0]], 6: [[0, -1, 0], [0, 1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]] };
  SIM.AXE = { "2,0": ["linear", "linear", "180°", "CO₂, BeCl₂"], "3,0": ["trigonal plana", "trigonal plana", "120°", "BF₃, SO₃"], "2,1": ["trigonal plana", "angular", "menor que 120°", "SO₂ (119°)"], "4,0": ["tetraédrica", "tetraédrica", "109,5°", "CH₄, NH₄⁺"], "3,1": ["tetraédrica", "piramidal", "menor que 109,5°", "NH₃ (107°)"], "2,2": ["tetraédrica", "angular", "menor que 109,5°", "H₂O (104,5°)"],
    "5,0": ["bipirâmide trigonal", "bipirâmide trigonal", "90° e 120°", "PCl₅"], "4,1": ["bipirâmide trigonal", "gangorra", "menores que 90° e 120°", "SF₄"], "3,2": ["bipirâmide trigonal", "forma de T", "menor que 90°", "ClF₃ (87,5°)"], "2,3": ["bipirâmide trigonal", "linear", "180°", "XeF₂, I₃⁻"],
    "6,0": ["octaédrica", "octaédrica", "90°", "SF₆"], "5,1": ["octaédrica", "pirâmide de base quadrada", "menor que 90°", "BrF₅"], "4,2": ["octaédrica", "quadrada plana", "90°", "XeF₄"] };
  SIM.desGeo = (X, E, o = {}) => {
    const { cx = 0, cy = 0, L = 56, fi = 0.5, incl = 0.3, c = "A", x = "X", pares = true } = o, cf = Math.cos(fi), sf = Math.sin(fi), ct = Math.cos(incl), st = Math.sin(incl);
    const its = SIM.GEO[X + E].map((v, i) => { const a = v[0] * cf + v[2] * sf, z0 = -v[0] * sf + v[2] * cf, b = v[1] * ct - z0 * st, z = v[1] * st + z0 * ct; return { px: a, py: -b, z, par: i < E, rot: Array.isArray(x) ? x[i - E] : x }; }).sort((p, q) => p.z - q.z);
    const des = (t) => { if (t.par) { if (!pares) return ""; const m = Math.hypot(t.px, t.py), ang = (Math.atan2(t.py, t.px) * 180) / Math.PI, rx = 0.2 * L * m + 9, d = 0.36 * L + rx * 0.5, ex = cx + t.px * (0.5 * L + (m > 0.05 ? rx * 0.6 / m * m : 0)), ey = cy + t.py * (0.5 * L + (m > 0.05 ? rx * 0.6 / m * m : 0)), ux = m > 0.05 ? -t.py / m : 0, uy = m > 0.05 ? t.px / m : 1;
        return `<ellipse cx="${(cx + t.px * d).toFixed(1)}" cy="${(cy + t.py * d).toFixed(1)}" rx="${rx.toFixed(1)}" ry="10" transform="rotate(${ang.toFixed(1)} ${(cx + t.px * d).toFixed(1)} ${(cy + t.py * d).toFixed(1)})" style="fill:color-mix(in srgb,var(--warn) ${t.z > 0 ? 34 : 20}%,transparent);stroke:var(--warn);stroke-width:1.2"/><circle cx="${(ex + ux * 3.5).toFixed(1)}" cy="${(ey + uy * 3.5).toFixed(1)}" r="2" style="fill:var(--warn)"/><circle cx="${(ex - ux * 3.5).toFixed(1)}" cy="${(ey - uy * 3.5).toFixed(1)}" r="2" style="fill:var(--warn)"/>`; }
      const r = 11 + 3 * t.z, ax = cx + t.px * L, ay = cy + t.py * L;
      return `<line x1="${cx}" y1="${cy}" x2="${ax.toFixed(1)}" y2="${ay.toFixed(1)}" style="stroke:var(--ink2);stroke-width:${(3 + 1.6 * t.z).toFixed(1)};stroke-linecap:round"/><circle cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="${r.toFixed(1)}" style="fill:color-mix(in srgb,var(--mod) ${t.z > 0 ? 55 : 30}%,var(--bg));stroke:var(--mod);stroke-width:1.5"/>` + D.txt(ax, ay + 4, t.rot, "tx2", "middle", 'style="fill:var(--ink);font-weight:700"'); };
    return its.filter((t) => t.z < 0).map(des).join("") + `<circle cx="${cx}" cy="${cy}" r="14" style="fill:color-mix(in srgb,var(--bad) 45%,var(--bg));stroke:var(--bad);stroke-width:1.5"/>` + D.txt(cx, cy + 4, c, "tx2", "middle", 'style="fill:var(--ink);font-weight:700"') + its.filter((t) => t.z >= 0).map(des).join("");
  };
  SIM.vsepr = (el, F) => {
    const W = 680, H = 270, K = Object.keys(SIM.AXE); let k = "4,0", fi = 0.5, gira = true, pares = true;
    const nome = (q) => { const [X, E] = q.split(",").map(Number); return "AX" + sub(X) + (E ? "E" + sub(E) : ""); };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(K.map((q) => [q, nome(q)]), "k", k)}</div></div><div><div class="bts"><button class="bt peq" data-b="g" aria-pressed="true">girar</button><button class="bt peq" data-b="p" aria-pressed="true">pares isolados</button></div></div></div>
      <div class="status">A = átomo central; X = átomo ligado; E = par isolado (amarelo). As regiões de elétrons em volta do átomo central se repelem e ficam o mais longe possível umas das outras: isso fixa o <b>arranjo eletrônico</b>. A <b>geometria molecular</b> é o desenho formado só pelos átomos. Esconda os pares isolados para ver a forma que dá nome à molécula, e compare espécies com o mesmo arranjo (AX₄, AX₃E, AX₂E₂). Os ângulos do desenho são os ideais; nas moléculas reais, os pares isolados apertam um pouco os ângulos entre as ligações.</div>`);
    const q = (s) => el.querySelector(s);
    const leitor = () => { const [X, E] = k.split(",").map(Number), d = SIM.AXE[k]; q("[data-v=lt]").innerHTML = vis("regiões de elétrons", X + E) + vis("arranjo eletrônico", d[0]) + vis("geometria molecular", d[1]) + vis("ângulo entre ligações", d[2]) + vis("exemplo", d[3]); };
    liga(el, "k", (v) => { k = v; leitor(); });
    q("[data-b=g]").addEventListener("click", (e) => { gira = !gira; e.target.setAttribute("aria-pressed", gira); }); q("[data-b=p]").addEventListener("click", (e) => { pares = !pares; e.target.setAttribute("aria-pressed", pares); });
    leitor();
    anima(el, F, (dt) => { if (gira) fi += dt * 0.7; const [X, E] = k.split(",").map(Number); q("[data-v=sv]").innerHTML = D.txt(340, 24, nome(k), "tx", "middle", 'style="font-size:20px;font-weight:700"') + SIM.desGeo(X, E, { cx: 340, cy: 145, L: 84, fi, pares }); });
  };
})();
