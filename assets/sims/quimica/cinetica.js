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
})();
