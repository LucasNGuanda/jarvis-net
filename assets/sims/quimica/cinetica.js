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
})();
