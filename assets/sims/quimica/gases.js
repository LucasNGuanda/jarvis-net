/* Simulações da Química, módulo E (Físico-química I), parte dos gases: E01 a E04. (E02: ver os comentários junto de cada laboratório.)
   Unidades de trabalho: P em atm, V em L, T em K, n em mol; R = 0,082 atm·L/(mol·K) (o valor de prova, dito na tela).
   E01 SIM.qPistao: gás ideal num cilindro com êmbolo, PV = nRT. O aluno escolhe qual par fica travado e mexe numa variável só:
     Boyle (T e n travados; mexe em V, lê P), Charles (P e n; mexe em T, lê V), Gay-Lussac (V e n; mexe em T, lê P), Avogadro (P e T; mexe em n, lê V).
     Conferido em Python (tools/quimica/confere-gases.py): 1 mol, 273 K, 1 atm → 22,39 L; 1 mol, 300 K, 24,6 L → 1,00 atm; dobrar T a V fixo dobra P;
     reduzir V à metade a T fixo dobra P; PV/(nT) = 0,082 em todos os pontos. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const R = 0.082;
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const f1 = (x) => x.toFixed(1);
  SIM.RGAS = R;
  SIM.gasIdeal = { P: (n, T, V) => (n * R * T) / V, V: (n, T, P) => (n * R * T) / P };

  /* ---------- E01 · pistão: uma lei de cada vez ---------- */
  /* nome: "Pistão: uma lei dos gases de cada vez" · matéria: Química · tema: E01 */
  SIM.qPistao = (el, F) => {
    const W = 700, H = 300;
    /* cada lei: [nome, variável que o aluno mexe, variável lida, o que fica travado, eixo x, eixo y] */
    const LEIS = { boyle: ["Boyle: T e n travados", "V", "P", "temperatura e quantidade de gás"], charles: ["Charles: P e n travados", "T", "V", "pressão e quantidade de gás"], gay: ["Gay-Lussac: V e n travados", "T", "P", "volume e quantidade de gás"], avo: ["Avogadro: P e T travados", "n", "V", "pressão e temperatura"] };
    const FAIXA = { V: [5, 60, 0.5], T: [100, 600, 5], n: [0.2, 3, 0.1] }, UN = { P: "atm", V: "L", T: "K", n: "mol" };
    let lei = "boyle", st = { P: 1, V: 24.6, T: 300, n: 1 }, parts = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(Object.keys(LEIS).map((k) => [k, LEIS[k][0].split(":")[0]]), "lei", lei)}</div><p data-v="trava" style="margin:8px 0 0;font-size:13.5px;color:var(--ink2)"></p></div><div data-v="sl"></div></div>
      <div class="status">O cilindro tem um gás ideal: <i>PV = nRT</i>, com R = 0,082 atm·L/(mol·K). Escolha uma lei: duas variáveis ficam <b>travadas</b>, você mexe numa e lê a outra. O gráfico mostra a curva inteira daquela lei e o ponto em que o gás está. Repare no último mostrador: PV/(nT) não muda nunca. No gráfico de Charles e no de Gay-Lussac, a reta só passa pela origem porque a temperatura está em <b>kelvin</b>.</div>`);
    const q = (s) => el.querySelector(s);
    const calc = () => { const L = LEIS[lei]; if (L[2] === "P") st.P = (st.n * R * st.T) / st.V; else st.V = (st.n * R * st.T) / st.P; };
    const monta = () => { const L = LEIS[lei], x = L[1], fx = FAIXA[x];
      if (lei === "boyle") { st.T = 300; st.n = 1; st.V = 24.6; } if (lei === "charles") { st.P = 1; st.n = 1; st.T = 300; } if (lei === "gay") { st.V = 24.6; st.n = 1; st.T = 300; } if (lei === "avo") { st.P = 1; st.T = 300; st.n = 1; }
      calc(); q("[data-v=trava]").innerHTML = `Travado: <b>${L[3]}</b>. Você mexe em <b>${x}</b> e lê <b>${L[2]}</b>.`;
      q("[data-v=sl]").innerHTML = sl({ V: "Volume (L)", T: "Temperatura (K)", n: "Quantidade de gás (mol)" }[x], "x", fx[0], fx[1], fx[2], st[x]);
      q("[data-c=x]").addEventListener("input", (e) => { st[x] = +e.target.value; calc(); }); };
    liga(el, "lei", (v) => { lei = v; monta(); });
    SIM.qPistao._ult = { st: () => Object.assign({ lei }, st), poe: (l, x) => { lei = l; el.querySelectorAll("[data-lei]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lei === l)); monta(); st[LEIS[l][1]] = x; q("[data-c=x]").value = x; calc(); } };
    monta();
    anima(el, F, (dt) => {
      const L = LEIS[lei], x = L[1], y = L[2], fx = FAIXA[x];
      /* cilindro: a altura do gás acompanha V (60 L = 200 px) */
      const cx = 60, cw = 150, base = 262, hg = Math.max(8, (Math.min(st.V, 66) / 66) * 215), topo = base - hg, np = Math.max(1, Math.round(st.n * 18));
      while (parts.length < np) parts.push({ x: Math.random(), y: Math.random(), a: Math.random() * 6.28 }); parts.length = np;
      const vel = 0.5 * Math.sqrt(st.T / 300);
      parts.forEach((p) => { p.x += (Math.cos(p.a) * vel * dt * 150) / cw; p.y += (Math.sin(p.a) * vel * dt * 150) / hg; if (p.x < 0 || p.x > 1) { p.a = Math.PI - p.a; p.x = Math.min(1, Math.max(0, p.x)); } if (p.y < 0 || p.y > 1) { p.a = -p.a; p.y = Math.min(1, Math.max(0, p.y)); } });
      let s = `<rect x="${cx}" y="${f1(topo)}" width="${cw}" height="${f1(hg)}" style="fill:color-mix(in srgb,var(--mod) ${Math.round(Math.min(34, 8 + (st.T - 100) / 20))}%,transparent)"/><path d="M${cx} 32 L${cx} ${base} L${cx + cw} ${base} L${cx + cw} 32" style="fill:none;stroke:var(--ink2);stroke-width:2.5"/><rect x="${cx + 2}" y="${f1(topo - 12)}" width="${cw - 4}" height="12" rx="2" style="fill:var(--ink3)"/><line x1="${cx + cw / 2}" y1="${f1(topo - 12)}" x2="${cx + cw / 2}" y2="${f1(Math.max(8, topo - 46))}" style="stroke:var(--ink3);stroke-width:5"/>`;
      parts.forEach((p) => (s += `<circle cx="${f1(cx + 5 + p.x * (cw - 10))}" cy="${f1(topo + 4 + p.y * (hg - 8))}" r="3.4" style="fill:var(--mod)"/>`));
      s += D.txt(cx + cw / 2, base + 20, `${n2(st.V, 1)} L · ${n2(st.T, 0)} K`, "tx2");
      /* gráfico da lei */
      const gx = 320, gy = 250, gw = 330, gh = 200, xmax = x === "V" ? 66 : x === "T" ? 660 : 3.3, fy = (xx) => { const t = Object.assign({}, st); t[x] = xx; return y === "P" ? (t.n * R * t.T) / t.V : (t.n * R * t.T) / t.P; };
      const ymax = y === "P" ? (lei === "boyle" ? 5.5 : 2.4) : 66, X = (v) => gx + (v / xmax) * gw, Y = (v) => gy - (Math.min(v, ymax) / ymax) * gh;
      s += D.seta(gx, gy, gx + gw + 14, gy, "var(--ink2)", 1.4) + D.seta(gx, gy, gx, gy - gh - 14, "var(--ink2)", 1.4) + D.txt(gx + gw + 10, gy + 18, `${x} (${UN[x]})`, "tx2", "end") + D.txt(gx - 8, gy - gh - 2, `${y} (${UN[y]})`, "tx2", "end");
      let d = ""; const x0 = lei === "boyle" ? 4.5 : 0; for (let k = 0; k <= 80; k++) { const xx = x0 + ((xmax - x0) * k) / 80, yy = fy(xx); if (yy > ymax * 1.02 || !isFinite(yy)) continue; d += (d ? "L" : "M") + f1(X(xx)) + " " + f1(Y(yy)); }
      s += `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.2;${lei === "boyle" ? "" : ""}"/>`;
      if (lei !== "boyle") s += `<path d="M${gx} ${gy} L${f1(X(fx[0]))} ${f1(Y(fy(fx[0])))}" style="fill:none;stroke:var(--mod);stroke-width:1.6;stroke-dasharray:4 5;opacity:.7"/>`;
      [0.25, 0.5, 0.75].forEach((k) => { s += D.txt(X(xmax * k), gy + 16, n2(xmax * k, x === "n" ? 1 : 0), "tx2") + D.txt(gx - 6, Y(ymax * k) + 4, n2(ymax * k, y === "P" ? 1 : 0), "tx2", "end"); });
      s += `<line x1="${f1(X(st[x]))}" y1="${gy}" x2="${f1(X(st[x]))}" y2="${f1(Y(st[y]))}" style="stroke:var(--ink3);stroke-dasharray:3 4"/><line x1="${gx}" y1="${f1(Y(st[y]))}" x2="${f1(X(st[x]))}" y2="${f1(Y(st[y]))}" style="stroke:var(--ink3);stroke-dasharray:3 4"/><circle cx="${f1(X(st[x]))}" cy="${f1(Y(st[y]))}" r="6" style="fill:var(--warn);stroke:var(--bg);stroke-width:2"/>`;
      s += D.txt(gx + gw / 2, 26, { boyle: "isoterma: P = constante / V", charles: "isóbara: V = constante · T", gay: "isócora: P = constante · T", avo: "V = constante · n" }[lei], "tx2", "middle", 'style="fill:var(--ink);font-weight:700"');
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("pressão", n2(st.P, 2) + " atm") + vis("volume", n2(st.V, 1) + " L") + vis("temperatura", n2(st.T, 0) + " K = " + n2(st.T - 273, 0) + " °C") + vis("quantidade", n2(st.n, 1) + " mol") + vis("PV / (nT)", n2((st.P * st.V) / (st.n * st.T), 3));
      const o = q("[data-o=x]"); if (o) o.textContent = n2(st[x], x === "T" ? 0 : 1) + " " + UN[x];
    });
  };

  /* ---------- E02 · distribuição de velocidades ao vivo ----------
     Discos iguais num plano, com colisões elásticas entre si e com as paredes. Todos começam com a MESMA velocidade (em direções sorteadas); as colisões
     espalham as velocidades e o histograma tende à distribuição de Maxwell em duas dimensões, f(v) = (v/s²)·exp(−v²/2s²), com s² = <v²>/2.
     Nessa distribuição (2D): v mais provável = s; v média = s·√(π/2) = 1,253 s; v quadrática média = s·√2 = 1,414 s.
     No gás de verdade (3D) as razões são 1 : 1,128 : 1,225 e v_rms = √(3RT/M): o mostrador dá esse valor para o gás e a temperatura escolhidos.
     O controle de temperatura reescala as velocidades (a energia cinética média é proporcional a T). Conferido em Python (tools/quimica/confere-gases.py):
     v_rms a 300 K: H₂ 1934 m/s; He 1368; N₂ 517; O₂ 484; CO₂ 412 (com R = 8,314). */
  const GASES_CIN = { H2: ["H₂", 2], He: ["He", 4], N2: ["N₂", 28], O2: ["O₂", 32], CO2: ["CO₂", 44] };
  SIM.vrms = (T, M) => Math.sqrt((3 * 8.314 * T) / (M / 1000));
  /* nome: "Distribuição de velocidades: do caos nasce uma curva" · matéria: Química · tema: E02 */
  SIM.qMaxwellGas = (el, F) => {
    const W = 700, H = 280, BX = 14, BY = 14, BW = 290, BH = 250, N = 140, RAIO = 4;
    let T = 300, gas = "N2", ps = [], hist = new Array(24).fill(0), pausado = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><canvas width="${W * 2}" height="${H * 2}" style="width:${W}px;height:${H}px"></canvas></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${sl("Temperatura (K)", "T", 100, 900, 10, T)}<div class="bts" style="margin-top:8px">${botoes(Object.keys(GASES_CIN).map((k) => [k, GASES_CIN[k][0]]), "g", gas)}</div></div><div><div class="bts"><button class="bt peq" data-a="re">recomeçar: todas com a mesma velocidade</button></div><p style="margin:8px 0 0;font-size:13.5px;color:var(--ink2)">Barras: as velocidades das bolinhas agora. Curva: a distribuição de Maxwell para essa temperatura.</p></div></div>
      <div class="status">No começo, todas as moléculas têm a <b>mesma</b> velocidade. Bastam alguns choques para as velocidades se espalharem, e o histograma se encaixa na curva de Maxwell: poucas lentas, poucas muito rápidas, a maioria no meio. Aqueça: a curva <b>achata e anda para a direita</b>. Troque de gás: moléculas leves são mais rápidas à mesma temperatura. A caixa é plana (duas dimensões); o valor em m/s do mostrador é o do gás de verdade, v = √(3RT/M).</div>`);
    const q = (s) => el.querySelector(s), cv = q("canvas"), cx = cv.getContext("2d"); cx.scale(2, 2);
    const esc = () => 62 * Math.sqrt((T / 300) * (28 / GASES_CIN[gas][1])) * 0.55; /* px/s da velocidade quadrática média */
    const inicia = () => { ps = []; const v = esc(); for (let i = 0; i < N; i++) { const a = Math.random() * 6.283; ps.push({ x: BX + RAIO + Math.random() * (BW - 2 * RAIO), y: BY + RAIO + Math.random() * (BH - 2 * RAIO), vx: v * Math.cos(a), vy: v * Math.sin(a) }); } hist.fill(0); };
    const v2m = () => ps.reduce((t, p) => t + p.vx * p.vx + p.vy * p.vy, 0) / ps.length;
    const reescala = () => { const k = esc() / Math.sqrt(v2m()); ps.forEach((p) => { p.vx *= k; p.vy *= k; }); };
    const css = (n) => getComputedStyle(el).getPropertyValue(n).trim();
    inicia();
    q("[data-c=T]").addEventListener("input", (e) => { T = +e.target.value; reescala(); });
    liga(el, "g", (v) => { gas = v; reescala(); });
    q("[data-a=re]").addEventListener("click", inicia);
    SIM.qMaxwellGas._ult = { est: () => { const v = ps.map((p) => Math.hypot(p.vx, p.vy)), m = v.reduce((a, b) => a + b, 0) / v.length, r = Math.sqrt(v2m()); return { T, gas, media: m, rms: r, razao: r / m, iguais: Math.max(...v) - Math.min(...v) < 1e-6 }; }, poe: (t, g) => { T = t; gas = g; q("[data-c=T]").value = t; reescala(); }, passos: (k) => { for (let i = 0; i < k; i++) passo(1 / 120); }, inicia };
    function passo(dt) {
      ps.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; if (p.x < BX + RAIO) { p.x = BX + RAIO; p.vx = Math.abs(p.vx); } if (p.x > BX + BW - RAIO) { p.x = BX + BW - RAIO; p.vx = -Math.abs(p.vx); } if (p.y < BY + RAIO) { p.y = BY + RAIO; p.vy = Math.abs(p.vy); } if (p.y > BY + BH - RAIO) { p.y = BY + BH - RAIO; p.vy = -Math.abs(p.vy); } });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const a = ps[i], b = ps[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy; if (d2 > 4 * RAIO * RAIO || d2 === 0) continue; const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, vr = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (vr >= 0) continue; /* massas iguais: trocam a componente ao longo da linha dos centros (conserva momento e energia) */ a.vx += vr * nx; a.vy += vr * ny; b.vx -= vr * nx; b.vy -= vr * ny; const s = (2 * RAIO - d) / 2; a.x -= s * nx; a.y -= s * ny; b.x += s * nx; b.y += s * ny; }
    }
    anima(el, F, (dt) => {
      if (!pausado) { passo(dt / 2); passo(dt / 2); }
      const ink2 = css("--ink2"), ink3 = css("--ink3"), mod = css("--mod"), warn = css("--warn");
      cx.clearRect(0, 0, W, H); cx.strokeStyle = ink3; cx.lineWidth = 1.5; cx.strokeRect(BX, BY, BW, BH);
      cx.fillStyle = mod; ps.forEach((p) => { cx.beginPath(); cx.arc(p.x, p.y, RAIO, 0, 7); cx.fill(); });
      /* histograma (média móvel, para não tremer) e curva teórica */
      const gx = 350, gy = 244, gw = 320, gh = 205, vmax = 62 * 0.55 * Math.sqrt(900 / 300) * Math.sqrt(28 / 2) * 0.62, nb = hist.length, agora = new Array(nb).fill(0), s2 = v2m() / 2;
      const vx = Math.max(160, Math.sqrt(2 * s2) * 2.6); ps.forEach((p) => { const k = Math.floor((Math.hypot(p.vx, p.vy) / vx) * nb); if (k < nb) agora[k]++; });
      for (let k = 0; k < nb; k++) hist[k] = 0.9 * hist[k] + 0.1 * agora[k];
      const dv = vx / nb, fmax = (1 / Math.sqrt(s2)) * Math.exp(-0.5), ymax = fmax * 1.5;
      cx.strokeStyle = ink2; cx.lineWidth = 1.3; cx.beginPath(); cx.moveTo(gx, gy - gh - 8); cx.lineTo(gx, gy); cx.lineTo(gx + gw + 8, gy); cx.stroke();
      cx.fillStyle = "rgba(120,160,255,.35)"; for (let k = 0; k < nb; k++) { const f = hist[k] / (N * dv), h = Math.min(gh, (f / ymax) * gh); cx.fillRect(gx + (k * gw) / nb + 1, gy - h, gw / nb - 2, h); }
      cx.strokeStyle = warn; cx.lineWidth = 2.2; cx.beginPath(); for (let k = 0; k <= 100; k++) { const v = (vx * k) / 100, f = (v / s2) * Math.exp(-(v * v) / (2 * s2)), X = gx + (gw * k) / 100, Y = gy - Math.min(gh, (f / ymax) * gh); k ? cx.lineTo(X, Y) : cx.moveTo(X, Y); } cx.stroke();
      cx.fillStyle = ink2; cx.font = "13px Inter"; cx.textAlign = "right"; cx.fillText("velocidade →", gx + gw + 6, gy + 18); cx.textAlign = "left"; cx.fillText("fração das moléculas", gx + 8, gy - gh - 2);
      const e = SIM.qMaxwellGas._ult.est(), vr = SIM.vrms(T, GASES_CIN[gas][1]);
      q("[data-v=lt]").innerHTML = vis("gás e temperatura", GASES_CIN[gas][0] + " a " + T + " K") + vis("v quadrática média (gás real, 3D)", n2(vr, 0) + " m/s") + vis("na caixa: v_rms / v_média", n2(e.razao, 3) + " (Maxwell 2D: 1,128)") + vis("energia cinética média", "∝ T");
      const o = q("[data-o=T]"); if (o) o.textContent = T + " K";
    });
  };

  /* ---------- E02 · gás ideal × gás real (van der Waals) ----------
     P_real = RT/(Vm − b) − a/Vm²; P_ideal = RT/Vm; Z = P_real·Vm/(RT). Constantes a e b: Wikipedia, "Van der Waals constants (data page)",
     lidas por script (tools/quimica/dadosE.json); lá estão em L²·bar/mol² e L/mol, e aqui a é convertido para atm (÷ 1,01325).
     A temperatura mínima de cada gás no controle fica 5% acima da temperatura crítica do próprio modelo, Tc = 8a/(27Rb), para a curva não entrar na região
     em que o gás liquefaz. Conferido em Python: CO₂ a 320 K e Vm = 0,2 L/mol: ideal 131,2 atm; van der Waals 78,0 atm; Z = 0,594.
     He a 300 K e Vm = 0,2: ideal 123,0; real 138,8; Z = 1,128. Qualquer gás com Vm = 50 L/mol: Z entre 0,997 e 1,001. */
  SIM.VDW = { He: ["He", 0.0346, 0.0238], H2: ["H₂", 0.2476, 0.02661], N2: ["N₂", 1.37, 0.0387], CH4: ["CH₄", 2.283, 0.04278], CO2: ["CO₂", 3.6, 0.04267], NH3: ["NH₃", 4.225, 0.0371] };
  SIM.vdw = (g, T, Vm) => { const a = SIM.VDW[g][1] / 1.01325, b = SIM.VDW[g][2], Pi = (R * T) / Vm, Pr = (R * T) / (Vm - b) - a / (Vm * Vm); return { Pi, Pr, Z: (Pr * Vm) / (R * T), Tc: (8 * a) / (27 * R * b) }; };
  /* nome: "Gás ideal × gás real: onde a conta ideal falha" · matéria: Química · tema: E02 */
  SIM.qRealIdeal = (el, F) => {
    const W = 700, H = 300; let g = "CO2", T = 320, lv = Math.log10(0.2);
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(Object.keys(SIM.VDW).map((k) => [k, SIM.VDW[k][0]]), "g", g)}</div><p data-v="tc" style="margin:8px 0 0;font-size:13.5px;color:var(--ink2)"></p></div><div>${sl("Temperatura (K)", "T", 100, 900, 5, T)}${sl("Volume de 1 mol (L): aperte o gás", "v", -1.33, 1.7, 0.01, lv)}</div></div>
      <div class="status">O fator de compressibilidade Z = PV/(nRT) vale <b>1 para o gás ideal</b>, sempre. No gás real (modelo de van der Waals), duas coisas mexem em Z: a <b>atração</b> entre as moléculas puxa a pressão para baixo (Z &lt; 1) e o <b>tamanho</b> delas rouba espaço e empurra a pressão para cima (Z &gt; 1). Com o gás rarefeito (volume grande, pressão baixa) as duas somem e a linha encosta em 1. Aperte o gás e veja o desvio crescer. Compare o CO₂ com o hélio na mesma temperatura.</div>`);
    const q = (s) => el.querySelector(s);
    const tmin = () => Math.max(100, Math.ceil((SIM.vdw(g, 300, 1).Tc * 1.05) / 5) * 5);
    const ajusta = () => { const m = tmin(); q("[data-c=T]").min = m; if (T < m) { T = m; q("[data-c=T]").value = m; } q("[data-v=tc]").innerHTML = `Neste modelo, o ${SIM.VDW[g][0]} só liquefaz abaixo de <b>${n2(SIM.vdw(g, 300, 1).Tc, 0)} K</b>; o controle começa em ${m} K.`; };
    liga(el, "g", (v) => { g = v; ajusta(); }); q("[data-c=T]").addEventListener("input", (e) => { T = +e.target.value; }); q("[data-c=v]").addEventListener("input", (e) => { lv = +e.target.value; });
    SIM.qRealIdeal._ult = { poe: (gg, t, vm) => { g = gg; ajusta(); T = Math.max(t, tmin()); lv = Math.log10(vm); q("[data-c=T]").value = T; q("[data-c=v]").value = lv; }, est: () => Object.assign({ g, T, Vm: Math.pow(10, lv) }, SIM.vdw(g, T, Math.pow(10, lv))) };
    ajusta();
    anima(el, F, () => {
      const Vm = Math.pow(10, lv), r = SIM.vdw(g, T, Vm), gx = 70, gy = 258, gw = 590, gh = 215, pmax = 600, zmax = 2.2, X = (p) => gx + (Math.min(p, pmax) / pmax) * gw, Y = (z) => gy - (Math.min(z, zmax) / zmax) * gh;
      let s = D.seta(gx, gy, gx + gw + 14, gy, "var(--ink2)", 1.4) + D.seta(gx, gy, gx, gy - gh - 14, "var(--ink2)", 1.4) + D.txt(gx + gw + 10, gy + 30, "pressão do gás real (atm)", "tx2", "end") + D.txt(gx - 8, gy - gh - 4, "Z", "tx2", "end");
      [100, 200, 300, 400, 500].forEach((p) => (s += D.txt(X(p), gy + 16, p, "tx2"))); [0.5, 1, 1.5, 2].forEach((z) => (s += D.txt(gx - 6, Y(z) + 4, n2(z, 1), "tx2", "end")));
      s += `<line x1="${gx}" y1="${f1(Y(1))}" x2="${gx + gw}" y2="${f1(Y(1))}" style="stroke:var(--ink2);stroke-dasharray:6 5;stroke-width:1.6"/>` + D.txt(gx + gw - 4, Y(1) - 7, "gás ideal: Z = 1", "tx2", "end");
      let d = ""; for (let k = 0; k <= 160; k++) { const v = Math.pow(10, 1.7 - (3.03 * k) / 160), o = SIM.vdw(g, T, v); if (v <= SIM.VDW[g][2] * 1.02 || o.Pr > pmax || o.Pr < 0 || o.Z > zmax) continue; d += (d ? "L" : "M") + f1(X(o.Pr)) + " " + f1(Y(o.Z)); }
      s += `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.4"/>`;
      if (r.Pr <= pmax && r.Pr > 0 && r.Z <= zmax) s += `<circle cx="${f1(X(r.Pr))}" cy="${f1(Y(r.Z))}" r="6" style="fill:var(--warn);stroke:var(--bg);stroke-width:2"/>`;
      else s += D.txt(gx + gw / 2, gy - gh + 10, "o ponto saiu do gráfico: volume pequeno demais", "tx2", "middle", 'style="fill:var(--warn)"');
      s += D.txt(gx + gw / 2, 22, `${SIM.VDW[g][0]} a ${T} K`, "tx2", "middle", 'style="fill:var(--ink);font-weight:700"');
      q("[data-v=sv]").innerHTML = s;
      const dz = (r.Pr / r.Pi - 1) * 100;
      q("[data-v=lt]").innerHTML = vis("volume de 1 mol", n2(Vm, Vm < 1 ? 3 : 1) + " L") + vis("pressão pela conta ideal", n2(r.Pi, r.Pi < 10 ? 2 : 1) + " atm") + vis("pressão do gás real", n2(r.Pr, r.Pr < 10 ? 2 : 1) + " atm") + vis("Z = PV/(nRT)", n2(r.Z, 3)) + vis("erro da conta ideal", (Math.abs(dz) < 0.05 ? "menos de 0,1" : n2(-dz / (1 + dz / 100), 1)) + " %");
      q("[data-o=T]").textContent = T + " K"; q("[data-o=v]").textContent = n2(Vm, Vm < 1 ? 3 : 1) + " L";
    });
  };

  /* ---------- E03 · mistura de dois gases: pressões parciais ----------
     Lei de Dalton: cada gás faz a pressão que faria sozinho no recipiente, P_i = n_i·RT/V; a total é a soma. Fração molar x_i = n_i/n; P_i = x_i·P.
     Massa molar média M = x_A·M_A + x_B·M_B; densidade d = P·M/(RT). Conferido em Python: 1 mol + 1 mol, 300 K, 24,6 L → 1,00 atm cada, 2,00 atm no total;
     3 mol de N₂ + 1 mol de O₂, 300 K, 49,2 L: P(N₂) = 1,50; P(O₂) = 0,50; x = 0,75 e 0,25; M = 29,0 g/mol; d = 2,36 g/L.
     Pressão de vapor da água (SIM.PVAGUA, em mmHg): Wikipedia, "Vapour pressure of water", lida por script (tools/quimica/dadosE.json), arredondada a 0,1. */
  SIM.PVAGUA = { 10: 9.2, 20: 17.5, 25: 23.8, 30: 31.9, 40: 55.4, 50: 92.6, 60: 149.6, 70: 234.0, 80: 355.6, 90: 526.4, 100: 760.7 };
  SIM.GASM = { H2: ["H₂", 2], He: ["He", 4], N2: ["N₂", 28], O2: ["O₂", 32], Ar: ["Ar", 40], CO2: ["CO₂", 44] };
  SIM.mistura = (nA, MA, nB, MB, T, V) => { const n = nA + nB, PA = (nA * R * T) / V, PB = (nB * R * T) / V, xA = n ? nA / n : 0, xB = n ? nB / n : 0, M = xA * MA + xB * MB; return { PA, PB, P: PA + PB, xA, xB, M, d: n ? ((PA + PB) * M) / (R * T) : 0 }; };
  /* nome: "Mistura de dois gases: quem faz quanto da pressão" · matéria: Química · tema: E03 */
  SIM.qMistura = (el, F) => {
    const W = 700, H = 290; let gA = "N2", gB = "O2", nA = 1, nB = 1, T = 300, V = 24.6, parts = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">gás A: ${botoes(Object.keys(SIM.GASM).map((k) => [k, SIM.GASM[k][0]]), "ga", gA)}</div>${sl("Quantidade de A (mol)", "nA", 0, 3, 0.1, nA)}<div class="bts" style="margin-top:8px">gás B: ${botoes(Object.keys(SIM.GASM).map((k) => [k, SIM.GASM[k][0]]), "gb", gB)}</div>${sl("Quantidade de B (mol)", "nB", 0, 3, 0.1, nB)}</div><div>${sl("Temperatura (K)", "T", 200, 600, 10, T)}${sl("Volume do recipiente (L)", "V", 10, 60, 0.2, V)}</div></div>
      <div class="status">Cada gás se comporta como se estivesse <b>sozinho</b> no recipiente: a pressão parcial dele é a que ele faria sem o outro, e a pressão total é a soma (lei de Dalton). Acrescente gás B e veja que a pressão parcial de A <b>não muda</b>; o que muda é a fração molar. Troque o gás B por outro com a mesma quantidade: as pressões não mudam (a pressão conta moléculas, não massa), mas a massa molar média e a densidade mudam. R = 0,082 atm·L/(mol·K).</div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "ga", (v) => (gA = v)); liga(el, "gb", (v) => (gB = v));
    [["nA", (v) => (nA = v)], ["nB", (v) => (nB = v)], ["T", (v) => (T = v)], ["V", (v) => (V = v)]].forEach(([c, fn]) => q(`[data-c=${c}]`).addEventListener("input", (e) => fn(+e.target.value)));
    SIM.qMistura._ult = { poe: (a, na, b, nb, t, v) => { gA = a; gB = b; nA = na; nB = nb; T = t; V = v; }, est: () => SIM.mistura(nA, SIM.GASM[gA][1], nB, SIM.GASM[gB][1], T, V) };
    anima(el, F, (dt) => {
      const r = SIM.mistura(nA, SIM.GASM[gA][1], nB, SIM.GASM[gB][1], T, V), cx = 40, cy = 30, ch = 220, cw = 90 + (V / 60) * 190, na = Math.round(nA * 14), nb = Math.round(nB * 14);
      while (parts.length < na + nb) parts.push({ x: Math.random(), y: Math.random(), a: Math.random() * 6.28 }); parts.length = na + nb;
      const vel = 0.45 * Math.sqrt(T / 300);
      parts.forEach((p) => { p.x += (Math.cos(p.a) * vel * dt * 150) / cw; p.y += (Math.sin(p.a) * vel * dt * 150) / ch; if (p.x < 0 || p.x > 1) { p.a = Math.PI - p.a; p.x = Math.min(1, Math.max(0, p.x)); } if (p.y < 0 || p.y > 1) { p.a = -p.a; p.y = Math.min(1, Math.max(0, p.y)); } });
      let s = `<rect x="${cx}" y="${cy}" width="${f1(cw)}" height="${ch}" rx="10" style="fill:color-mix(in srgb,var(--mod) 6%,transparent);stroke:var(--ink2);stroke-width:2.2"/>`;
      parts.forEach((p, k) => (s += `<circle cx="${f1(cx + 6 + p.x * (cw - 12))}" cy="${f1(cy + 6 + p.y * (ch - 12))}" r="${k < na ? 4 : 4}" style="fill:${k < na ? "var(--mA)" : "var(--bad)"}"/>`));
      s += D.txt(cx + cw / 2, cy + ch + 20, `${n2(V, 1)} L · ${T} K`, "tx2");
      /* barras empilhadas: a total é a soma das parciais */
      const bx = 400, by = 250, bh = 200, pmax = 8, hY = (v) => (Math.min(v, pmax) / pmax) * bh, col = (x, v, cor, rot, val) => `<rect x="${x}" y="${f1(by - hY(v))}" width="56" height="${f1(hY(v))}" rx="3" style="fill:${cor};opacity:.8"/>` + D.txt(x + 28, by + 17, rot, "tx2") + D.txt(x + 28, by - hY(v) - 6, val, "tx2", "middle", 'style="fill:var(--ink);font-weight:700"');
      s += `<line x1="${bx - 16}" y1="${by}" x2="${bx + 260}" y2="${by}" style="stroke:var(--ink2);stroke-width:1.4"/>` + col(bx, r.PA, "var(--mA)", "P de " + SIM.GASM[gA][0], n2(r.PA, 2)) + col(bx + 84, r.PB, "var(--bad)", "P de " + SIM.GASM[gB][0], n2(r.PB, 2));
      s += `<rect x="${bx + 168}" y="${f1(by - hY(r.PA))}" width="56" height="${f1(hY(r.PA))}" rx="3" style="fill:var(--mA);opacity:.8"/><rect x="${bx + 168}" y="${f1(by - hY(r.PA) - hY(r.PB))}" width="56" height="${f1(hY(r.PB))}" rx="3" style="fill:var(--bad);opacity:.8"/>` + D.txt(bx + 196, by + 17, "P total", "tx2") + D.txt(bx + 196, by - hY(r.PA) - hY(r.PB) - 6, n2(r.P, 2) + " atm", "tx2", "middle", 'style="fill:var(--ink);font-weight:700"');
      s += D.txt(bx + 110, 24, "pressões (atm)", "tx2", "middle", 'style="fill:var(--ink);font-weight:700"');
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = nA + nB === 0 ? vis("recipiente", "vazio") : vis("fração molar de " + SIM.GASM[gA][0], n2(r.xA, 3)) + vis("fração molar de " + SIM.GASM[gB][0], n2(r.xB, 3)) + vis("x(A) · P total", n2(r.xA * r.P, 2) + " atm") + vis("massa molar média", n2(r.M, 1) + " g/mol") + vis("densidade", n2(r.d, 2) + " g/L");
      q("[data-o=nA]").textContent = n2(nA, 1) + " mol"; q("[data-o=nB]").textContent = n2(nB, 1) + " mol"; q("[data-o=T]").textContent = T + " K"; q("[data-o=V]").textContent = n2(V, 1) + " L";
    });
  };

  /* ---------- E04 · diagrama de fases navegável ----------
     Pontos conferidos em fonte (tools/quimica/dadosE.json; Wikipedia "Triple point", "Critical point (thermodynamics)", "Properties of water", "Carbon dioxide"):
       água: ponto triplo 273,16 K e 611,657 Pa (0,00604 atm); ponto crítico 647,096 K e 22,064 MPa (217,75 atm); fusão a 1 atm: 0,00 °C; ebulição a 1 atm: 100 °C.
       CO₂: ponto triplo 216,592 K e 0,51795 MPa (5,112 atm); ponto crítico 304,128 K e 7,3773 MPa (72,81 atm); sublimação a 1 atm: 194,69 K (−78,46 °C).
     CURVAS: são MODELO, traçadas pelos pontos acima. Entre dois pontos de uma curva de vaporização ou de sublimação, ln P varia linearmente com 1/T
       (forma integrada de Clausius–Clapeyron com entalpia constante). Água: vaporização em dois trechos (triplo → ebulição normal → crítico); CO₂: um trecho (triplo → crítico);
       sublimação do CO₂: pelo ponto de 1 atm e pelo triplo. A curva de fusão é uma reta: na água, pelos dois pontos conferidos (triplo e fusão a 1 atm), o que dá
       inclinação NEGATIVA (−99 atm/K); no CO₂ e na sublimação da água NÃO há segundo ponto conferido: a inclinação é só um esboço (positiva no CO₂), e a tela avisa.
     Conferido em Python (tools/quimica/confere-gases.py): o modelo dá 22,7 mmHg para a água a 25 °C (tabela: 23,8) e 63,9 atm para o CO₂ líquido a 25 °C. */
  const ATM = 101325;
  SIM.FASES = {
    H2O: { nome: "água", f: "H₂O", Tt: 273.16, Pt: 611.657 / ATM, Tc: 647.096, Pc: 22.064e6 / ATM, vap: [[273.16, 611.657 / ATM], [373.15, 1], [647.096, 22.064e6 / ATM]], sub: null, fus: [273.15, 1], tmin: 200, tmax: 700, anomala: true },
    CO2: { nome: "dióxido de carbono", f: "CO₂", Tt: 216.592, Pt: 0.51795e6 / ATM, Tc: 304.128, Pc: 7.3773e6 / ATM, vap: [[216.592, 0.51795e6 / ATM], [304.128, 7.3773e6 / ATM]], sub: [194.6855, 1], fus: null, tmin: 150, tmax: 360, anomala: false },
  };
  const cc = (a, b, T) => { const B = Math.log(b[1] / a[1]) / (1 / a[0] - 1 / b[0]); return a[1] * Math.exp(B * (1 / a[0] - 1 / T)); }; /* ln P linear em 1/T, pelos pontos a e b */
  SIM.fases = {
    pvap: (s, T) => { const v = SIM.FASES[s].vap; for (let k = 0; k < v.length - 1; k++) if (T <= v[k + 1][0] || k === v.length - 2) return cc(v[k], v[k + 1], T); },
    psub: (s, T) => { const o = SIM.FASES[s]; if (o.sub) return cc(o.sub, [o.Tt, o.Pt], T); const v = o.vap, B = 1.13 * (Math.log(v[1][1] / v[0][1]) / (1 / v[0][0] - 1 / v[1][0])); return o.Pt * Math.exp(B * (1 / o.Tt - 1 / T)); }, /* água: esboço */
    incl: (s) => { const o = SIM.FASES[s]; return o.fus ? (o.fus[1] - o.Pt) / (o.fus[0] - o.Tt) : 45; }, /* atm/K; CO₂: esboço */
    tfus: (s, P) => SIM.FASES[s].Tt + (P - SIM.FASES[s].Pt) / SIM.fases.incl(s),
    estado: (s, T, P) => { const o = SIM.FASES[s]; if (T >= o.Tc) return P >= o.Pc ? "fluido supercrítico" : "gás"; if (P >= o.Pt) { if (T < SIM.fases.tfus(s, P)) return "sólido"; if (T < o.Tt) return "líquido"; /* só acontece na água: entre a curva de fusão, inclinada para a esquerda, e a temperatura do ponto triplo */ return P > SIM.fases.pvap(s, T) ? "líquido" : "gás"; } if (T < o.Tt) return P > SIM.fases.psub(s, T) ? "sólido" : "gás"; return "gás"; },
    /* a P fixa, aquecendo: [temperatura de fusão, de ebulição] ou [null, sublimação] */
    trans: (s, P) => { const o = SIM.FASES[s], inv = (fn, a, b) => { for (let k = 0; k < 60; k++) { const m = (a + b) / 2; fn(m) < P ? (a = m) : (b = m); } return (a + b) / 2; };
      if (P < o.Pt) return { sub: inv((T) => SIM.fases.psub(s, T), 100, o.Tt) }; if (P >= o.Pc) return { fus: SIM.fases.tfus(s, P), critico: true }; return { fus: SIM.fases.tfus(s, P), eb: inv((T) => SIM.fases.pvap(s, T), o.Tt, o.Tc) }; },
  };
  /* nome: "Diagrama de fases navegável: arraste o ponto" · matéria: Química · tema: E04 */
  SIM.qFases = (el, F) => {
    const W = 700, H = 330, gx = 70, gy = 290, gw = 590, gh = 255, LMIN = -3.3, LMAX = 3.2; let s = "H2O", T = 298, lp = 0, arr = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv" style="touch-action:none;cursor:crosshair"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes([["H2O", "água"], ["CO2", "CO₂"]], "s", s)}</div><div class="bts" style="margin-top:8px"><button class="bt peq" data-ir="amb">25 °C e 1 atm</button><button class="bt peq" data-ir="tri">ponto triplo</button><button class="bt peq" data-ir="cri">ponto crítico</button><button class="bt peq" data-ir="ano">apertar o gelo</button></div></div><div>${sl("Temperatura (K)", "T", 200, 700, 1, T)}${sl("Pressão (escala de potências de 10)", "p", LMIN, LMAX, 0.01, lp)}</div></div>
      <div class="status" data-v="st"></div>`);
    const q = (x) => el.querySelector(x), o = () => SIM.FASES[s];
    const X = (t) => gx + ((t - o().tmin) / (o().tmax - o().tmin)) * gw, Y = (P) => gy - ((Math.log10(P) - LMIN) / (LMAX - LMIN)) * gh;
    const ajusta = () => { const sT = q("[data-c=T]"); sT.min = o().tmin; sT.max = o().tmax; T = Math.min(o().tmax, Math.max(o().tmin, T)); sT.value = T; q("[data-c=p]").value = lp; q("[data-ir=ano]").hidden = !o().anomala;
      q("[data-v=st]").innerHTML = `Arraste o ponto amarelo (ou use os controles): o mostrador diz em que estado a substância está. As três curvas são fronteiras: em cima de uma delas, duas fases convivem em equilíbrio. No <b>ponto triplo</b> convivem as três; depois do <b>ponto crítico</b> não existe mais diferença entre líquido e gás. ${s === "H2O" ? "Na água, a fronteira sólido-líquido é inclinada <b>para a esquerda</b>: apertando o gelo, ele derrete. É a anomalia da água, e vem de o gelo ser menos denso que a água líquida. A curva de sublimação da água é um esboço: só o ponto triplo dela foi conferido em fonte." : "No CO₂, a pressão do ponto triplo é 5,1 atm: a 1 atm o líquido <b>não existe</b>, e o sólido (gelo-seco) passa direto a gás, a −78,5 °C. A inclinação da fronteira sólido-líquido do CO₂ é um esboço (o sentido, para a direita, é o certo); os pontos triplo, crítico e de sublimação foram conferidos em fonte."} As curvas são um modelo traçado por esses pontos. A escala de pressão é de potências de 10.`; };
    liga(el, "s", (v) => { s = v; T = v === "H2O" ? 298 : 250; lp = 0; ajusta(); });
    q("[data-c=T]").addEventListener("input", (e) => (T = +e.target.value)); q("[data-c=p]").addEventListener("input", (e) => (lp = +e.target.value));
    el.querySelectorAll("[data-ir]").forEach((b) => b.addEventListener("click", () => { const k = b.dataset.ir; if (k === "amb") { T = 298.15; lp = 0; } if (k === "tri") { T = o().Tt; lp = Math.log10(o().Pt); } if (k === "cri") { T = o().Tc; lp = Math.log10(o().Pc); } if (k === "ano") { T = 272.9; lp = Math.log10(60); } ajusta(); }));
    const sv = q("[data-v=sv]"), mexe = (e) => { const b = sv.getBoundingClientRect(), x = ((e.clientX - b.left) / b.width) * W, y = ((e.clientY - b.top) / b.height) * H; T = Math.round(Math.min(o().tmax, Math.max(o().tmin, o().tmin + ((x - gx) / gw) * (o().tmax - o().tmin)))); lp = Math.min(LMAX, Math.max(LMIN, LMIN + ((gy - y) / gh) * (LMAX - LMIN))); q("[data-c=T]").value = T; q("[data-c=p]").value = lp; };
    sv.addEventListener("pointerdown", (e) => { arr = true; sv.setPointerCapture(e.pointerId); mexe(e); }); sv.addEventListener("pointermove", (e) => arr && mexe(e)); sv.addEventListener("pointerup", () => (arr = false)); sv.addEventListener("pointercancel", () => (arr = false));
    SIM.qFases._ult = { poe: (ss, t, P) => { s = ss; T = t; lp = Math.log10(P); ajusta(); }, est: () => ({ s, T, P: Math.pow(10, lp), estado: SIM.fases.estado(s, T, Math.pow(10, lp)) }) };
    ajusta();
    anima(el, F, () => {
      const f = o(), P = Math.pow(10, lp), est = SIM.fases.estado(s, T, P), COR = { "sólido": "var(--mA)", "líquido": "var(--ok)", "gás": "var(--bad)", "fluido supercrítico": "var(--warn)" };
      let h = D.seta(gx, gy, gx + gw + 14, gy, "var(--ink2)", 1.4) + D.seta(gx, gy, gx, gy - gh - 14, "var(--ink2)", 1.4) + D.txt(gx + gw + 10, gy + 32, "temperatura (K)", "tx2", "end") + D.txt(gx - 6, gy - gh - 6, "P (atm)", "tx2", "end");
      for (let e = -3; e <= 3; e++) h += D.txt(gx - 6, Y(Math.pow(10, e)) + 4, e < 0 ? "0," + "0".repeat(-e - 1) + "1" : String(Math.pow(10, e)), "tx2", "end") + `<line x1="${gx}" y1="${f1(Y(Math.pow(10, e)))}" x2="${gx + gw}" y2="${f1(Y(Math.pow(10, e)))}" style="stroke:var(--line2);stroke-dasharray:2 5"/>`;
      for (let t = Math.ceil(f.tmin / 50) * 50; t <= f.tmax; t += s === "H2O" ? 100 : 50) h += D.txt(X(t), gy + 16, t, "tx2");
      const curva = (fn, a, b, cor) => { let d = ""; for (let k = 0; k <= 70; k++) { const t = a + ((b - a) * k) / 70, p = fn(t); if (p < Math.pow(10, LMIN) || p > Math.pow(10, LMAX)) continue; d += (d ? "L" : "M") + f1(X(t)) + " " + f1(Y(p)); } return `<path d="${d}" style="fill:none;stroke:${cor};stroke-width:2.4"/>`; };
      h += curva((t) => SIM.fases.psub(s, t), f.tmin, f.Tt, "var(--ink)") + curva((t) => SIM.fases.pvap(s, t), f.Tt, f.Tc, "var(--ink)");
      const pTop = Math.pow(10, LMAX), tTop = SIM.fases.tfus(s, pTop); h += `<line x1="${f1(X(f.Tt))}" y1="${f1(Y(f.Pt))}" x2="${f1(X(tTop))}" y2="${f1(Y(pTop))}" style="stroke:var(--ink);stroke-width:2.4"/>`;
      h += `<line x1="${gx}" y1="${f1(Y(1))}" x2="${gx + gw}" y2="${f1(Y(1))}" style="stroke:var(--mod);stroke-dasharray:7 5;stroke-width:1.3"/>` + D.txt(gx + gw - 4, Y(1) - 6, "1 atm", "tx2", "end", 'style="fill:var(--mod)"');
      h += `<line x1="${f1(X(f.Tc))}" y1="${f1(Y(f.Pc))}" x2="${f1(X(f.Tc))}" y2="${gy - gh}" style="stroke:var(--ink3);stroke-dasharray:3 5"/><line x1="${f1(X(f.Tc))}" y1="${f1(Y(f.Pc))}" x2="${gx + gw}" y2="${f1(Y(f.Pc))}" style="stroke:var(--ink3);stroke-dasharray:3 5"/>`;
      h += `<circle cx="${f1(X(f.Tt))}" cy="${f1(Y(f.Pt))}" r="5" style="fill:var(--ink)"/>` + D.txt(X(f.Tt) + 8, Y(f.Pt) + 16, "ponto triplo", "tx2", "start") + `<circle cx="${f1(X(f.Tc))}" cy="${f1(Y(f.Pc))}" r="5" style="fill:var(--ink)"/>` + D.txt(X(f.Tc) - 8, Y(f.Pc) - 8, "ponto crítico", "tx2", "end");
      const lab = (t, p, txt, cor) => D.txt(X(t), Y(p), txt, "tx2", "middle", `style="fill:${cor};font-weight:700;font-size:14px;opacity:.85"`);
      h += lab(f.tmin + 0.12 * (f.tmax - f.tmin) * (s === "H2O" ? 1 : 1.3), 300, "SÓLIDO", COR["sólido"]) + lab((f.Tt + f.Tc) / 2 - (s === "H2O" ? 40 : 2), Math.sqrt(f.Pc * 1000) * (s === "H2O" ? 0.6 : 1), "LÍQUIDO", COR["líquido"]) + lab(f.tmin + 0.72 * (f.tmax - f.tmin), 0.004, "GÁS", COR["gás"]) + lab((f.Tc + f.tmax) / 2, Math.min(900, f.Pc * 3), "SUPERCRÍTICO", COR["fluido supercrítico"]);
      h += `<circle cx="${f1(X(T))}" cy="${f1(Y(P))}" r="8" style="fill:var(--warn);stroke:var(--bg);stroke-width:2.5"/>`;
      sv.innerHTML = h;
      const tr = SIM.fases.trans(s, P), c = (k) => n2(k - 273.15, Math.abs(k - 273.15) < 5 ? 2 : 1) + " °C", pf = (v) => (v >= 100 ? n2(v, 0) : v >= 1 ? n2(v, 2) : v >= 0.01 ? n2(v, 3) : n2(v, 4));
      q("[data-v=lt]").innerHTML = vis("substância", f.f) + vis("temperatura", T.toFixed(T % 1 ? 2 : 0).replace(".", ",") + " K = " + c(T)) + vis("pressão", pf(P) + " atm") + `<div class="vis"><small>estado</small><b style="color:${COR[est]}">${est}</b></div>` + vis("aquecendo a esta pressão", tr.sub !== undefined ? "sublima a " + c(tr.sub) : tr.critico ? "funde a " + c(tr.fus) + "; não ferve (acima da pressão crítica)" : "funde a " + c(tr.fus) + "; ferve a " + c(tr.eb));
      q("[data-o=T]").textContent = Math.round(T) + " K"; q("[data-o=p]").textContent = pf(P) + " atm";
    });
  };
})();
