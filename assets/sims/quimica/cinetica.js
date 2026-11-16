/* Simulações da Química, módulo F (Físico-química II), parte de cinética e equilíbrio: F04 a F07.
   F04 SIM.qColisoes: teoria das colisões numa caixa plana. Discos A (azuis) com colisões elásticas; quando dois A se chocam com energia cinética relativa,
     ao longo da linha dos centros, maior ou igual à barreira Ea, o choque é EFETIVO e os dois viram produto (verdes, que não reagem mais).
     Unidades da caixa: a energia é medida em unidades de RT a 300 K (a barreira real de uma reação, dezenas de kJ/mol, daria uma fração de choques efetivos
     pequena demais para se ver; a tela avisa que a barreira da caixa é baixa de propósito). Catalisador: multiplica a barreira por 0,5 (outro caminho).
     Modelo de linha dos centros: a fração de choques com energia ≥ Ea é exp(−Ea/RT). Conferido na própria caixa (tests/tlabsF.js) SEM reação (barreira altíssima,
     contando os choques que passariam de 1 e de 2,5 RT): 0,372 e 0,081, para 0,368 e 0,082 previstos. COM a reação andando a fração medida fica uns 20% abaixo,
     porque as moléculas rápidas reagem primeiro e o reagente que sobra fica, por instantes, mais frio que a média (efeito real, dito na tela).
     SIM.arrhenius: k₂/k₁ = exp[(Ea/R)(1/T₁ − 1/T₂)], R = 8,314 J/(mol·K). Conferido em Python (tools/quimica/confere-fq2.py):
     Ea = 50 kJ/mol, 300 → 310 K: 1,91; Ea = 53,6 kJ/mol: 2,00 (a "regra" de dobrar a cada 10 °C); Ea = 100 kJ/mol, 300 → 310 K: 3,64. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const f1 = (x) => x.toFixed(1);
  SIM.arrhenius = (Ea, T1, T2) => Math.exp(((Ea * 1000) / 8.314) * (1 / T1 - 1 / T2));

  /* ---------- F04 · colisões e energia de ativação ---------- */
  /* nome: "Colisões: só reage quem bate com energia" · matéria: Química · tema: F04 */
  SIM.qColisoes = (el, F) => {
    const W = 700, H = 290, BX = 14, BY = 14, BW = 300, BH = 250, RAIO = 5;
    let T = 300, Ea = 2, cat = false, N = 80, ps = [], efet = 0, total = 0, tempo = 0, hist = []; const diag = { n: 0, s2: 0, c1: 0, c25: 0 };
    el.insertAdjacentHTML("beforeend", `<div class="palco"><canvas width="${W * 2}" height="${H * 2}" style="width:${W}px;height:${H}px"></canvas></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${sl("Temperatura (K)", "T", 200, 900, 10, T)}${sl("Barreira (em RT a 300 K)", "Ea", 0.5, 6, 0.1, Ea)}</div><div>${sl("Moléculas no começo", "N", 20, 140, 10, N)}<div class="bts" style="margin-top:8px"><button class="bt peq" data-a="cat" aria-pressed="false">catalisador</button><button class="bt peq" data-a="re">recomeçar</button></div></div></div>
      <div class="status">Bolinhas azuis: reagente. Quando duas se chocam com energia <b>igual ou maior que a barreira</b>, o choque é <b>efetivo</b> e elas viram produto (verdes). A maioria dos choques não é efetiva: as moléculas só ricocheteiam. Esquente: mais choques por segundo e, principalmente, uma <b>fração maior</b> deles passa da barreira. Ponha mais moléculas: mais choques. Ligue o catalisador: ele abre um caminho de barreira menor, sem mudar a temperatura. Com a reação andando, a fração medida fica um pouco <b>abaixo</b> da prevista: as moléculas mais rápidas reagem primeiro, e o reagente que sobra fica, por instantes, mais "frio" que a média. A barreira desta caixa é baixa de propósito, para a reação caber em alguns segundos; numa reação real, a fração de choques efetivos é muitíssimo menor.</div>`);
    const q = (s) => el.querySelector(s), cv = q("canvas"), cx = cv.getContext("2d"); cx.scale(2, 2);
    const vT = () => 90 * Math.sqrt(T / 300), barreira = () => Ea * (cat ? 0.5 : 1);
    const inicia = () => { ps = []; const v = vT(); for (let i = 0; i < N; i++) { const a = Math.random() * 6.283, m = v * Math.sqrt(-Math.log(1 - Math.random() * 0.999)); ps.push({ x: BX + RAIO + Math.random() * (BW - 2 * RAIO), y: BY + RAIO + Math.random() * (BH - 2 * RAIO), vx: m * Math.cos(a), vy: m * Math.sin(a), p: false }); } { const k = Math.sqrt((v * v) / (ps.reduce((t, p) => t + p.vx * p.vx + p.vy * p.vy, 0) / ps.length)); ps.forEach((p) => { p.vx *= k; p.vy *= k; }); } /* acerta a energia média do sorteio exatamente na temperatura pedida */ efet = 0; total = 0; tempo = 0; hist = [[0, N]]; };
    const v2m = () => ps.reduce((t, p) => t + p.vx * p.vx + p.vy * p.vy, 0) / ps.length;
    const reescala = () => { const k = (vT() * vT()) / v2m(); ps.forEach((p) => { p.vx *= Math.sqrt(k); p.vy *= Math.sqrt(k); }); };
    const css = (n) => getComputedStyle(el).getPropertyValue(n).trim();
    function passo(dt) {
      tempo += dt;
      ps.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; if (p.x < BX + RAIO) { p.x = BX + RAIO; p.vx = Math.abs(p.vx); } if (p.x > BX + BW - RAIO) { p.x = BX + BW - RAIO; p.vx = -Math.abs(p.vx); } if (p.y < BY + RAIO) { p.y = BY + RAIO; p.vy = Math.abs(p.vy); } if (p.y > BY + BH - RAIO) { p.y = BY + BH - RAIO; p.vy = -Math.abs(p.vy); } });
      const kT300 = 0.5 * 90 * 90; /* energia de referência: (1/2)·v² com v = velocidade típica a 300 K, massa 1; a energia relativa de um par usa a massa reduzida 1/2 */
      for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) { const a = ps[i], b = ps[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy; if (d2 > 4 * RAIO * RAIO || d2 === 0) continue; const d = Math.sqrt(d2), wx = b.vx - a.vx, wy = b.vy - a.vy; if (dx * wx + dy * wy >= 0) continue;
        /* o choque é percebido com os discos já um pouco sobrepostos; volta-se ao instante exato do contato (|Δr + w·τ| = 2R, τ ≤ 0) para pegar a normal certa.
           Sem isso, a componente da velocidade ao longo da linha dos centros sai subestimada nos choques de raspão, e a fração efetiva fica uns 30% abaixo de exp(−Ea/RT). */
        const rw = dx * wx + dy * wy, w2 = wx * wx + wy * wy, disc = rw * rw - w2 * (d2 - 4 * RAIO * RAIO), tau = disc > 0 && w2 > 0 ? (-rw - Math.sqrt(disc)) / w2 : 0, cxn = dx + wx * tau, cyn = dy + wy * tau, cn = Math.hypot(cxn, cyn) || 1, nx = cxn / cn, ny = cyn / cn, vr = wx * nx + wy * ny; if (vr >= 0) continue;
        if (!a.p && !b.p) { total++; diag.n++; diag.s2 += vr * vr; if (0.25 * vr * vr >= kT300) diag.c1++; if (0.25 * vr * vr >= 2.5 * kT300) diag.c25++; if (0.25 * vr * vr >= barreira() * kT300) { efet++; a.p = b.p = true; } }
        a.vx += vr * nx; a.vy += vr * ny; b.vx -= vr * nx; b.vy -= vr * ny; const s = (2 * RAIO - d) / 2; a.x -= s * nx; a.y -= s * ny; b.x += s * nx; b.y += s * ny; }
      if (tempo - hist[hist.length - 1][0] > 0.2) hist.push([tempo, ps.filter((p) => !p.p).length]);
    }
    inicia();
    q("[data-c=T]").addEventListener("input", (e) => { T = +e.target.value; reescala(); }); q("[data-c=Ea]").addEventListener("input", (e) => (Ea = +e.target.value)); q("[data-c=N]").addEventListener("input", (e) => { N = +e.target.value; inicia(); });
    q("[data-a=cat]").addEventListener("click", (e) => { cat = !cat; e.currentTarget.setAttribute("aria-pressed", cat); }); q("[data-a=re]").addEventListener("click", inicia);
    SIM.qColisoes._diag = diag; SIM.qColisoes._ult = { poe: (t, ea, c, n) => { T = t; Ea = ea; cat = c; N = n; inicia(); }, passos: (k) => { for (let i = 0; i < k; i++) passo(1 / 120); }, est: () => ({ T, Ea, cat, efet, total, fr: total ? efet / total : 0, reag: ps.filter((p) => !p.p).length, teor: Math.exp((-barreira() * 300) / T) }) };
    anima(el, F, (dt) => {
      passo(dt / 2); passo(dt / 2);
      const ink2 = css("--ink2"), ink3 = css("--ink3"), mA = css("--mA"), ok = css("--ok"), warn = css("--warn"), bad = css("--bad");
      cx.clearRect(0, 0, W, H); cx.strokeStyle = ink3; cx.lineWidth = 1.5; cx.strokeRect(BX, BY, BW, BH);
      ps.forEach((p) => { cx.fillStyle = p.p ? ok : mA; cx.beginPath(); cx.arc(p.x, p.y, RAIO, 0, 7); cx.fill(); });
      /* gráfico: reagente contra o tempo */
      const gx = 360, gy = 128, gw = 300, gh = 100, tmax = Math.max(12, tempo); cx.strokeStyle = ink2; cx.lineWidth = 1.3; cx.beginPath(); cx.moveTo(gx, gy - gh - 6); cx.lineTo(gx, gy); cx.lineTo(gx + gw + 6, gy); cx.stroke();
      cx.strokeStyle = mA; cx.lineWidth = 2.2; cx.beginPath(); hist.forEach((h, k) => { const X = gx + (h[0] / tmax) * gw, Y = gy - (h[1] / N) * gh; k ? cx.lineTo(X, Y) : cx.moveTo(X, Y); }); cx.stroke();
      cx.fillStyle = ink2; cx.font = "13px Inter"; cx.textAlign = "left"; cx.fillText("reagente que resta", gx + 8, gy - gh - 2); cx.textAlign = "right"; cx.fillText("tempo →", gx + gw + 4, gy + 16);
      /* diagrama de energia: reagentes, barreira (com e sem catalisador), produtos */
      const dx0 = 360, dy0 = 268, dw = 300, eb = Ea, esc = 13, yR = dy0 - 30, yP = dy0 - 12, pico = (b) => yR - b * esc;
      const caminho = (b, cor, tr) => { cx.strokeStyle = cor; cx.lineWidth = 2; cx.setLineDash(tr ? [5, 4] : []); cx.beginPath(); cx.moveTo(dx0, yR); cx.lineTo(dx0 + 60, yR); cx.bezierCurveTo(dx0 + 110, yR, dx0 + 110, pico(b), dx0 + 150, pico(b)); cx.bezierCurveTo(dx0 + 190, pico(b), dx0 + 190, yP, dx0 + 240, yP); cx.lineTo(dx0 + dw, yP); cx.stroke(); cx.setLineDash([]); };
      caminho(eb, cat ? ink3 : warn, cat); if (cat) caminho(eb * 0.5, warn, false);
      cx.fillStyle = ink2; cx.textAlign = "left"; cx.fillText("reagentes", dx0, yR + 16); cx.textAlign = "right"; cx.fillText("produtos", dx0 + dw, yP + 16); cx.textAlign = "center"; cx.fillStyle = warn; cx.fillText("barreira" + (cat ? " (com catalisador)" : ""), dx0 + 150, pico(barreira()) - 6);
      cx.fillStyle = bad; cx.textAlign = "left";
      const e = SIM.qColisoes._ult.est();
      q("[data-v=lt]").innerHTML = vis("reagente / produto", e.reag + " / " + (ps.length - e.reag)) + vis("choques entre reagentes", e.total) + vis("choques efetivos", e.efet + (e.total > 20 ? " (" + n2(e.fr * 100, 0) + " %)" : "")) + vis("fração prevista, exp(−Ea/RT)", n2(e.teor * 100, 0) + " %");
      q("[data-o=T]").textContent = T + " K"; q("[data-o=Ea]").textContent = n2(Ea, 1) + (cat ? " → " + n2(Ea * 0.5, 2) : ""); q("[data-o=N]").textContent = N;
    });
  };

  /* ---------- F05 · ordem de reação: três gráficos, uma reta ----------
     A → produtos, com v = k[A]^n. Leis integradas: n = 0: [A] = [A]₀ − kt; n = 1: [A] = [A]₀·e^(−kt); n = 2: 1/[A] = 1/[A]₀ + kt.
     Meia-vida: n = 0: [A]₀/(2k); n = 1: ln2/k (não depende de [A]₀); n = 2: 1/(k[A]₀).
     Conferido em Python (tools/quimica/confere-fq2.py), com [A]₀ = 1,00 mol/L e k = 0,100: meias-vidas 5,00 s; 6,93 s; 10,0 s; em t = 10 s: 0; 0,368; 0,500 mol/L. */
  SIM.ordem = { conc: (n, A0, k, t) => (n === 0 ? Math.max(0, A0 - k * t) : n === 1 ? A0 * Math.exp(-k * t) : 1 / (1 / A0 + k * t)), meia: (n, A0, k) => (n === 0 ? A0 / (2 * k) : n === 1 ? Math.LN2 / k : 1 / (k * A0)), un: ["mol/(L·s)", "1/s", "L/(mol·s)"] };
  /* nome: "Ordem de reação: qual gráfico vira reta?" · matéria: Química · tema: F05 */
  SIM.qOrdem = (el, F) => {
    const W = 700, H = 250; let n = 1, A0 = 1, k = 0.1;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes([[0, "ordem zero"], [1, "primeira ordem"], [2, "segunda ordem"]], "n", n)}</div><p style="margin:8px 0 0;font-size:13.5px;color:var(--ink2)">Os três gráficos mostram os <b>mesmos</b> dados. Só um deles é uma reta: é assim que se descobre a ordem.</p></div><div>${sl("Concentração inicial (mol/L)", "A0", 0.2, 2, 0.05, A0)}${sl("Constante de velocidade k", "k", 0.02, 0.3, 0.01, k)}</div></div>
      <div class="status">A reação é A → produtos, com velocidade v = k[A]ⁿ. Troque a ordem e veja qual dos três gráficos fica reto: [A] contra o tempo (ordem zero), ln [A] contra o tempo (primeira ordem) ou 1/[A] contra o tempo (segunda ordem). As linhas tracejadas marcam as <b>meias-vidas</b> sucessivas. Na primeira ordem elas são todas iguais; mude a concentração inicial e confira que a meia-vida não se mexe. Nas outras ordens, mexe.</div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "n", (v) => (n = +v)); q("[data-c=A0]").addEventListener("input", (e) => (A0 = +e.target.value)); q("[data-c=k]").addEventListener("input", (e) => (k = +e.target.value));
    SIM.qOrdem._ult = { poe: (nn, a, kk) => { n = nn; A0 = a; k = kk; }, est: () => ({ n, A0, k, meia: SIM.ordem.meia(n, A0, k), c10: SIM.ordem.conc(n, A0, k, 10) }) };
    anima(el, F, () => {
      const tmax = 40, c = (t) => SIM.ordem.conc(n, A0, k, t), fim = n === 0 ? A0 / k : tmax;
      const painel = (x0, tit, fy, ymin, ymax, reta) => { const y0 = 205, w = 185, h = 150, X = (t) => x0 + (t / tmax) * w, Y = (v) => y0 - ((v - ymin) / (ymax - ymin)) * h; let d = "";
        for (let t = 0; t <= Math.min(tmax, fim * 0.985); t += 0.5) { const v = fy(c(t)); if (!isFinite(v) || v < ymin - 1e-9 || v > ymax + 1e-9) continue; d += (d ? "L" : "M") + f1(X(t)) + " " + f1(Y(v)); }
        let s2 = `<rect x="${x0 - 8}" y="${y0 - h - 26}" width="${w + 20}" height="${h + 52}" rx="8" style="fill:${reta ? "color-mix(in srgb,var(--ok) 9%,transparent)" : "none"};stroke:${reta ? "var(--ok)" : "var(--line2)"}"/>` + D.seta(x0, y0, x0 + w + 6, y0, "var(--ink2)", 1.2) + D.seta(x0, y0, x0, y0 - h - 6, "var(--ink2)", 1.2) + D.txt(x0 + w / 2, y0 - h - 10, tit + (reta ? ": reta" : ""), "tx2", "middle", `style="fill:${reta ? "var(--ok)" : "var(--ink)"};font-weight:700"`) + D.txt(x0 + w, y0 + 16, "tempo", "tx2", "end") + `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2.3"/>`;
        return s2; };
      const lmin = Math.log(Math.max(1e-3, c(tmax) || 1e-3)), imax = 1 / Math.max(c(Math.min(tmax, fim * 0.98)), 0.02);
      let h = painel(40, "[A]", (v) => v, 0, A0 * 1.05, n === 0) + painel(265, "ln [A]", (v) => Math.log(v), Math.min(lmin, Math.log(A0) - 0.5), Math.log(A0) + 0.1, n === 1) + painel(490, "1 / [A]", (v) => 1 / v, 0, Math.min(imax, 60) * 1.05, n === 2);
      /* meias-vidas no primeiro painel */
      let t = 0, a = A0; for (let j = 0; j < 4; j++) { const m = SIM.ordem.meia(n, a, k); t += m; a /= 2; if (t > tmax) break; const X = 40 + (t / tmax) * 185, Y = 205 - (a / (A0 * 1.05)) * 150; h += `<line x1="${f1(X)}" y1="205" x2="${f1(X)}" y2="${f1(Y)}" style="stroke:var(--warn);stroke-dasharray:3 3"/><circle cx="${f1(X)}" cy="${f1(Y)}" r="3.5" style="fill:var(--warn)"/>`; }
      q("[data-v=sv]").innerHTML = h;
      const m1 = SIM.ordem.meia(n, A0, k), m2 = SIM.ordem.meia(n, A0 / 2, k);
      q("[data-v=lt]").innerHTML = vis("lei de velocidade", "v = k" + ["", "[A]", "[A]²"][n]) + vis("unidade de k", SIM.ordem.un[n]) + vis("1ª meia-vida", n2(m1, 2) + " s") + vis("2ª meia-vida", n2(m2, 2) + " s") + vis("[A] em t = 10 s", n2(c(10), 3) + " mol/L");
      q("[data-o=A0]").textContent = n2(A0, 2) + " mol/L"; q("[data-o=k]").textContent = n2(k, 2) + " " + SIM.ordem.un[n];
    });
  };

  /* ---------- F06 · equilíbrio dinâmico: A ⇌ B ----------
     Cada molécula A vira B com probabilidade kd·dt; cada B vira A com ki·dt (duas reações de primeira ordem, uma contra a outra).
     Velocidades: v_direta = kd·[A]; v_inversa = ki·[B]. No equilíbrio são iguais: [B]/[A] = kd/ki = K. Fração de B no equilíbrio: kd/(kd + ki) = K/(1 + K).
     Curva lisa (a prevista): [B](t) = B_eq + (B₀ − B_eq)·e^(−(kd + ki)t). As bolinhas flutuam em volta dela, porque são poucas (200).
     Conferido em Python (tools/quimica/confere-fq2.py): kd = 0,30 e ki = 0,10 → K = 3,0; 75% de B, partindo só de A ou só de B; tempo característico 1/(kd + ki) = 2,5 s. */
  SIM.eqAB = { K: (kd, ki) => kd / ki, frB: (kd, ki) => kd / (kd + ki), B: (kd, ki, b0, t) => kd / (kd + ki) + (b0 - kd / (kd + ki)) * Math.exp(-(kd + ki) * t) };
  /* nome: "Equilíbrio dinâmico: a reação não para, empata" · matéria: Química · tema: F06 */
  SIM.qEquilibrio = (el, F) => {
    const W = 700, H = 280, BX = 14, BY = 14, BW = 270, BH = 240, N = 200; let kd = 0.3, ki = 0.1, ps = [], t = 0, b0 = 0, hist = [], idas = 0, voltas = 0, janela = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><canvas width="${W * 2}" height="${H * 2}" style="width:${W}px;height:${H}px"></canvas></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${sl("Constante da reação direta (A → B)", "kd", 0.02, 0.6, 0.01, kd)}${sl("Constante da reação inversa (B → A)", "ki", 0.02, 0.6, 0.01, ki)}</div><div><div class="bts"><button class="bt peq" data-ini="0">começar só com A</button><button class="bt peq" data-ini="1">começar só com B</button><button class="bt peq" data-ini="0.5">metade de cada</button></div><p style="margin:8px 0 0;font-size:13.5px;color:var(--ink2)">Linha lisa: o previsto. Linha tremida: as 200 moléculas da caixa.</p></div></div>
      <div class="status">Azul: A. Vermelho: B. As duas reações acontecem o tempo todo: A vira B e B vira A. No começo uma ganha; a concentração do reagente dela cai, ela freia, e a outra acelera, até as <b>duas velocidades empatarem</b>. A partir daí as concentrações param de mudar, mas as moléculas continuam trocando de cor: o equilíbrio é <b>dinâmico</b>. Comece só com A e depois só com B: o ponto de chegada é o mesmo. No equilíbrio, [B]/[A] = K, que é a razão das duas constantes de velocidade.</div>`);
    const q = (s) => el.querySelector(s), cv = q("canvas"), cx = cv.getContext("2d"); cx.scale(2, 2);
    const inicia = (fb) => { b0 = fb; ps = []; for (let i = 0; i < N; i++) { const a = Math.random() * 6.283; ps.push({ x: BX + 6 + Math.random() * (BW - 12), y: BY + 6 + Math.random() * (BH - 12), vx: 40 * Math.cos(a), vy: 40 * Math.sin(a), b: i < Math.round(fb * N) }); } t = 0; hist = [[0, fb]]; idas = voltas = 0; janela = []; };
    const css = (n) => getComputedStyle(el).getPropertyValue(n).trim();
    function passo(dt) { let i1 = 0, v1 = 0; ps.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; if (p.x < BX + 5 || p.x > BX + BW - 5) { p.vx = -p.vx; p.x = Math.max(BX + 5, Math.min(BX + BW - 5, p.x)); } if (p.y < BY + 5 || p.y > BY + BH - 5) { p.vy = -p.vy; p.y = Math.max(BY + 5, Math.min(BY + BH - 5, p.y)); } if (!p.b && Math.random() < kd * dt) { p.b = true; i1++; } else if (p.b && Math.random() < ki * dt) { p.b = false; v1++; } }); t += dt; idas += i1; voltas += v1; janela.push([t, i1, v1]); while (janela.length && janela[0][0] < t - 3) janela.shift(); if (t - hist[hist.length - 1][0] > 0.15) hist.push([t, ps.filter((p) => p.b).length / N]); }
    inicia(0);
    q("[data-c=kd]").addEventListener("input", (e) => { kd = +e.target.value; inicia(b0); }); q("[data-c=ki]").addEventListener("input", (e) => { ki = +e.target.value; inicia(b0); });
    el.querySelectorAll("[data-ini]").forEach((b) => b.addEventListener("click", () => inicia(+b.dataset.ini)));
    SIM.qEquilibrio._ult = { poe: (a, b, f) => { kd = a; ki = b; inicia(f); }, passos: (k) => { for (let i = 0; i < k; i++) passo(1 / 60); }, est: () => { const fb = ps.filter((p) => p.b).length / N, vi = janela.reduce((s, j) => s + j[1], 0), vv = janela.reduce((s, j) => s + j[2], 0); return { kd, ki, t, fb, K: kd / ki, Q: fb / (1 - fb), idas3: vi, voltas3: vv, prev: SIM.eqAB.frB(kd, ki) }; } };
    anima(el, F, (dt) => {
      passo(dt); const ink2 = css("--ink2"), ink3 = css("--ink3"), mA = css("--mA"), bad = css("--bad"), warn = css("--warn");
      cx.clearRect(0, 0, W, H); cx.strokeStyle = ink3; cx.lineWidth = 1.5; cx.strokeRect(BX, BY, BW, BH); ps.forEach((p) => { cx.fillStyle = p.b ? bad : mA; cx.beginPath(); cx.arc(p.x, p.y, 4, 0, 7); cx.fill(); });
      const gx = 330, gy = 240, gw = 330, gh = 200, tmax = Math.max(25, t), X = (x) => gx + (x / tmax) * gw, Y = (v) => gy - v * gh;
      cx.strokeStyle = ink2; cx.lineWidth = 1.3; cx.beginPath(); cx.moveTo(gx, gy - gh - 8); cx.lineTo(gx, gy); cx.lineTo(gx + gw + 8, gy); cx.stroke();
      const curva = (f, cor, w) => { cx.strokeStyle = cor; cx.lineWidth = w; cx.beginPath(); for (let k = 0; k <= 100; k++) { const x = (tmax * k) / 100, y = f(x); k ? cx.lineTo(X(x), Y(y)) : cx.moveTo(X(x), Y(y)); } cx.stroke(); };
      cx.globalAlpha = 0.5; curva((x) => SIM.eqAB.B(kd, ki, b0, x), bad, 1.6); curva((x) => 1 - SIM.eqAB.B(kd, ki, b0, x), mA, 1.6); cx.globalAlpha = 1;
      const tr = (sel, cor) => { cx.strokeStyle = cor; cx.lineWidth = 2.2; cx.beginPath(); hist.forEach((h, k) => (k ? cx.lineTo(X(h[0]), Y(sel(h[1]))) : cx.moveTo(X(h[0]), Y(sel(h[1]))))); cx.stroke(); }; tr((v) => v, bad); tr((v) => 1 - v, mA);
      cx.fillStyle = ink2; cx.font = "13px Inter"; cx.textAlign = "left"; cx.fillText("fração das moléculas", gx + 8, gy - gh - 4); cx.textAlign = "right"; cx.fillText("tempo →", gx + gw + 6, gy + 17); cx.fillStyle = bad; cx.fillText("B", gx + gw, Y(hist[hist.length - 1][1]) - 6); cx.fillStyle = mA; cx.fillText("A", gx + gw, Y(1 - hist[hist.length - 1][1]) - 6);
      const e = SIM.qEquilibrio._ult.est();
      q("[data-v=lt]").innerHTML = vis("A / B agora", Math.round((1 - e.fb) * N) + " / " + Math.round(e.fb * N)) + vis("A → B nos últimos 3 s", e.idas3) + vis("B → A nos últimos 3 s", e.voltas3) + vis("Q = [B]/[A] agora", e.fb < 1 ? n2(e.Q, 2) : "∞") + vis("K = k direta / k inversa", n2(e.K, 2));
      q("[data-o=kd]").textContent = n2(kd, 2) + " s⁻¹"; q("[data-o=ki]").textContent = n2(ki, 2) + " s⁻¹";
    });
  };

  /* ---------- F07 · Le Chatelier no N₂O₄ ⇌ 2 NO₂ ----------
     Dados de fonte (tools/quimica/dadosF.json): Kc = 6,53·10⁻³ a 25 °C (LibreTexts); ΔH = +57,23 kJ/mol (Wikipedia, "Dinitrogen tetroxide"): endotérmica para a direita.
     K em outra temperatura (modelo: van 't Hoff com ΔH constante, aplicado a Kp = Kc·RT): ln[Kp(T)/Kp(298)] = (ΔH/R)(1/298 − 1/T), R = 8,314 J/(mol·K).
     Cinética só para animar a volta ao equilíbrio (não é dado de fonte): d[N₂O₄]/dt = −kf[N₂O₄] + kr[NO₂]², com kf = Kc·kr; o catalisador multiplica kf e kr por 5.
     Equilíbrio exato (para os testes): com n₀ mols "de N₂O₄" no total (n₀ = n(N₂O₄) + n(NO₂)/2) num volume V: 4x² + K·V·x − K·V·n₀ = 0, x = mols dissociados.
     Conferido em Python (tools/quimica/confere-fq2.py): 0,100 mol em 1,00 L a 298 K: 12,0% dissociado; em 2,00 L: 16,5%; em 0,50 L: 8,6%;
       a 318 K: Kc = 2,61·10⁻² e 22,5% dissociado; a 278 K: Kc = 1,33·10⁻³ e 5,6%. */
  SIM.n2o4 = {
    Kc: (T) => { const Kp298 = 6.53e-3 * 0.082 * 298.15, Kp = Kp298 * Math.exp((57230 / 8.314) * (1 / 298.15 - 1 / T)); return Kp / (0.082 * T); },
    eq: (n0, V, T) => { const K = SIM.n2o4.Kc(T), x = (-K * V + Math.sqrt(K * K * V * V + 16 * K * V * n0)) / 8; return { x, alfa: x / n0, n1: n0 - x, n2: 2 * x, K }; },
  };
  /* nome: "Le Chatelier: perturbe o equilíbrio e veja a resposta" · matéria: Química · tema: F07 */
  SIM.qLeChatelier = (el, F) => {
    const W = 700, H = 280; let na = 0.088, nb = 0.024, V = 1, T = 298.15, cat = false, t = 0, hist = [], marcas = [], inerte = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts"><button class="bt peq" data-a="mais1">+ N₂O₄</button><button class="bt peq" data-a="mais2">+ NO₂</button><button class="bt peq" data-a="menos2">tirar NO₂</button></div><div class="bts" style="margin-top:8px"><button class="bt peq" data-a="comp">comprimir (V ÷ 2)</button><button class="bt peq" data-a="exp">expandir (V × 2)</button></div></div>
        <div><div class="bts"><button class="bt peq" data-a="quente">esquentar 20 °C</button><button class="bt peq" data-a="frio">esfriar 20 °C</button></div><div class="bts" style="margin-top:8px"><button class="bt peq" data-a="cat" aria-pressed="false">catalisador</button><button class="bt peq" data-a="inerte">+ gás inerte (V fixo)</button><button class="bt peq" data-a="zera">recomeçar</button></div></div></div>
      <div class="status" data-v="st">O êmbolo tem N₂O₄ (incolor) em equilíbrio com NO₂ (castanho): quanto mais escuro, mais NO₂. A reação para a direita absorve calor e aumenta o número de moléculas de gás. Aperte um botão e acompanhe <b>Q</b>: a perturbação tira Q de cima de K (ou muda o próprio K, no caso da temperatura), e a reação anda até os dois se encontrarem de novo.</div>`);
    const q = (s) => el.querySelector(s), K = () => SIM.n2o4.Kc(T), Q = () => ((nb / V) * (nb / V)) / (na / V);
    const marca = (txt) => { marcas.push([t, txt]); if (marcas.length > 6) marcas.shift(); };
    const zera = () => { const e = SIM.n2o4.eq(0.1, 1, 298.15); na = e.n1; nb = e.n2; V = 1; T = 298.15; t = 0; hist = []; marcas = []; inerte = 0; };
    const MSG = { mais1: ["+ N₂O₄", "Entrou reagente: Q caiu abaixo de K. A reação anda para a <b>direita</b> e gasta parte do N₂O₄ que entrou."], mais2: ["+ NO₂", "Entrou produto: Q subiu acima de K. A reação anda para a <b>esquerda</b> e consome parte do NO₂ que entrou."], menos2: ["− NO₂", "Saiu produto: Q caiu abaixo de K. A reação anda para a <b>direita</b>, repondo parte do NO₂."], comp: ["V ÷ 2", "Volume menor: todas as concentrações dobraram, e Q (que tem [NO₂]² em cima) dobrou. A reação anda para a <b>esquerda</b>, o lado com <b>menos</b> moléculas de gás. Na hora o gás escurece (está mais concentrado); depois clareia um pouco."], exp: ["V × 2", "Volume maior: Q caiu pela metade. A reação anda para a <b>direita</b>, o lado com <b>mais</b> moléculas de gás."], quente: ["+20 °C", "Esquentou: o <b>K aumentou</b> (a reação para a direita absorve calor). Q ficou abaixo do novo K: anda para a <b>direita</b>, e o gás escurece."], frio: ["−20 °C", "Esfriou: o <b>K diminuiu</b>. Q ficou acima do novo K: anda para a <b>esquerda</b>, e o gás clareia."], cat: ["catalisador", "O catalisador não muda K nem Q: acelera a ida e a volta igualmente. A posição do equilíbrio é a <b>mesma</b>; só se chega nela mais depressa."], inerte: ["+ inerte", "Gás inerte a volume constante: a pressão total sobe, mas as <b>concentrações</b> de N₂O₄ e de NO₂ não mudam. Q continua igual a K: <b>nada acontece</b>."] };
    el.addEventListener("click", (e) => { const b = e.target.closest("[data-a]"); if (!b) return; const a = b.dataset.a; if (a === "zera") { zera(); q("[data-v=st]").innerHTML = "Recomeçou: 0,100 mol no total, 1,00 L, 25 °C."; return; }
      if (a === "mais1") na += 0.05; if (a === "mais2") nb += 0.05; if (a === "menos2") nb *= 0.3; if (a === "comp") V = Math.max(0.125, V / 2); if (a === "exp") V = Math.min(8, V * 2); if (a === "quente") T = Math.min(398.15, T + 20); if (a === "frio") T = Math.max(238.15, T - 20); if (a === "cat") { cat = !cat; b.setAttribute("aria-pressed", cat); } if (a === "inerte") inerte += 0.1;
      marca(MSG[a][0]); q("[data-v=st]").innerHTML = MSG[a][1]; });
    const passo = (dt) => { const kr = 6 * (cat ? 5 : 1), kf = K() * kr, sub = 20; for (let k = 0; k < sub; k++) { const c1 = na / V, c2 = nb / V, r = (kf * c1 - kr * c2 * c2) * (dt / sub) * V; const dr = Math.max(-nb / 2 * 0.5, Math.min(na * 0.5, r)); na -= dr; nb += 2 * dr; } t += dt; hist.push([t, na / V, nb / V]); if (hist.length > 900) hist.shift(); };
    SIM.qLeChatelier._ult = { acao: (a) => q(`[data-a=${a}]`).click(), passos: (k) => { for (let i = 0; i < k; i++) passo(1 / 60); }, est: () => ({ n1: na, n2: nb, V, T, K: K(), Q: Q(), c1: na / V, c2: nb / V, alfa: (nb / 2) / (na + nb / 2), n0: na + nb / 2 }), zera };
    zera();
    anima(el, F, (dt) => {
      passo(dt); const c2 = nb / V, c1 = na / V, k = K(), qq = Q();
      /* seringa: largura proporcional ao volume (escala logarítmica suave) */
      const sx = 30, sy = 60, sw = 60 + 46 * (Math.log2(V) + 3), sh = 90, tom = Math.min(0.85, 0.06 + c2 * 9);
      let h = `<rect x="${sx}" y="${sy}" width="${f1(sw)}" height="${sh}" rx="6" style="fill:rgba(176,106,44,${tom.toFixed(2)});stroke:var(--ink2);stroke-width:2"/><rect x="${f1(sx + sw)}" y="${sy - 6}" width="10" height="${sh + 12}" style="fill:var(--ink3)"/><line x1="${f1(sx + sw + 10)}" y1="${sy + sh / 2}" x2="${f1(sx + sw + 44)}" y2="${sy + sh / 2}" style="stroke:var(--ink3);stroke-width:6"/>`;
      h += D.txt(sx + sw / 2, sy - 12, `${n2(V, V < 1 ? 3 : 2)} L · ${n2(T - 273.15, 0)} °C`, "tx2") + D.txt(sx + sw / 2, sy + sh + 20, cat ? "com catalisador" : "", "tx2") + (inerte ? D.txt(sx + sw / 2, sy + sh + 38, `+ ${n2(inerte, 1)} mol de gás inerte`, "tx2") : "");
      /* barra Q × K (escala log) */
      const bx = 30, by = 212, bw = 300, lmin = -4.5, lmax = 0.5, X = (v) => bx + ((Math.max(lmin, Math.min(lmax, Math.log10(v))) - lmin) / (lmax - lmin)) * bw;
      h += `<line x1="${bx}" y1="${by}" x2="${bx + bw}" y2="${by}" style="stroke:var(--ink2);stroke-width:1.4"/><line x1="${f1(X(k))}" y1="${by - 14}" x2="${f1(X(k))}" y2="${by + 14}" style="stroke:var(--ok);stroke-width:3"/><circle cx="${f1(X(qq))}" cy="${by}" r="6.5" style="fill:var(--warn);stroke:var(--bg);stroke-width:2"/>` + D.txt(X(k), by - 20, "K", "tx2", "middle", 'style="fill:var(--ok);font-weight:700"') + D.txt(X(qq), by + 30, "Q", "tx2", "middle", 'style="fill:var(--warn);font-weight:700"') + D.txt(bx, by + 48, "← mais reagente", "tx2", "start") + D.txt(bx + bw, by + 48, "mais produto →", "tx2", "end");
      /* gráfico das concentrações */
      const gx = 390, gy = 240, gw = 250, gh = 190, t0 = hist.length ? hist[0][0] : 0, t1 = Math.max(t0 + 8, t), cmax = Math.max(0.12, ...hist.map((p) => Math.max(p[1], p[2]))) * 1.1, GX = (x) => gx + ((x - t0) / (t1 - t0)) * gw, GY = (v) => gy - (v / cmax) * gh;
      h += D.seta(gx, gy, gx + gw + 10, gy, "var(--ink2)", 1.3) + D.seta(gx, gy, gx, gy - gh - 10, "var(--ink2)", 1.3) + D.txt(gx + 6, gy - gh - 2, "concentração (mol/L)", "tx2", "start") + D.txt(gx + gw + 6, gy + 16, "tempo", "tx2", "end");
      marcas.forEach((m) => { if (m[0] >= t0) h += `<line x1="${f1(GX(m[0]))}" y1="${gy}" x2="${f1(GX(m[0]))}" y2="${gy - gh}" style="stroke:var(--ink3);stroke-dasharray:3 4"/>` + D.txt(GX(m[0]) + 3, gy - gh + 12, m[1], "tx2", "start"); });
      const tr = (i, cor) => `<path d="${hist.map((p, j) => (j ? "L" : "M") + f1(GX(p[0])) + " " + f1(GY(p[i]))).join("")}" style="fill:none;stroke:${cor};stroke-width:2.2"/>`;
      h += tr(1, "var(--mA)") + tr(2, "#c9853d") + D.txt(gx + gw + 4, GY(c1) + 4, "N₂O₄", "tx2", "start", 'style="fill:var(--mA)"') + D.txt(gx + gw + 4, GY(c2) + 4, "NO₂", "tx2", "start", 'style="fill:#c9853d"');
      q("[data-v=sv]").innerHTML = h;
      const sent = Math.abs(qq - k) < 0.02 * k ? "em equilíbrio" : qq < k ? "→ para a direita" : "← para a esquerda";
      q("[data-v=lt]").innerHTML = vis("[N₂O₄]", n2(c1, 4) + " mol/L") + vis("[NO₂]", n2(c2, 4) + " mol/L") + vis("Q agora", (qq * 1000).toFixed(2).replace(".", ",") + "·10⁻³") + vis("K a " + n2(T - 273.15, 0) + " °C", (k * 1000).toFixed(2).replace(".", ",") + "·10⁻³") + vis("a reação anda", sent);
    });
  };
})();
