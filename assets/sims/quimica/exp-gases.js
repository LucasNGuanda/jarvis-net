/* Química · aba Experimentos, módulo Gases (EQ01 a EQ04): simulações de partículas que se mexem, com controles.
   Tudo aqui é MODELO em duas dimensões, com unidades da própria simulação (dito na tela de cada um). O que é dado de tabela vem de fora:
   massas molares de SIM.GASM e constantes de van der Waals de SIM.VDW (assets/sims/quimica/gases.js, com fonte em tools/quimica/dadosE.json).
   Motor comum (SIM.expGas): gerador de números com semente (para os testes darem sempre o mesmo resultado), velocidades térmicas (gaussianas),
   colisão elástica de discos de massas diferentes.
   EQ01 SIM.eqDifusao: difusão (duas metades, tira-se a parede) e efusão (furo para o vácuo; lei de Graham: taxa ∝ 1/√M).
   EQ02 SIM.eqPistao: gás ideal 2D sob um pistão que se move de verdade (massa, peso, colisões); P·V = N·kT medido pelas batidas no pistão.
   EQ03 SIM.eqMaxwell: discos rígidos que começam todos com a mesma velocidade e, só por colisões, chegam à distribuição de Maxwell-Boltzmann (2D).
   EQ04 SIM.eqReal: dinâmica molecular de Lennard-Jones em 2D (unidades reduzidas); Z = P/(ρT) medido pelo virial, contra o gás ideal (Z = 1)
     e contra o segundo coeficiente do virial B₂(T), integrado numericamente.
   Conferido em Python (tools/quimica/confere-exp-gases.py): ⟨v⟩/v_rms = √π/2 = 0,8862 na distribuição 2D; B₂ de Lennard-Jones 2D com corte em 2,5σ;
     Graham: √(32/2) = 4; √(44/28) = 1,2536; v_rms do N₂ a 300 K = √(3·8,314·300/0,028) = 517 m/s. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const T = (x, y, s, a = "middle", c = "tx2", t = 12) => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}" style="font-size:${t}px">${s}</text>`;

  const G = (SIM.expGas = {});
  /* gerador com semente (mulberry32): mesma semente, mesma simulação */
  G.rng = (s) => () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  G.gauss = (rnd) => Math.sqrt(-2 * Math.log(1 - rnd() * 0.999999)) * Math.cos(2 * Math.PI * rnd());
  /* desvio padrão de cada componente da velocidade (px/s) para um gás de massa molar M (g/mol) à temperatura T (K): ∝ √(T/M) */
  G.sigma = (Tk, M) => 70 * Math.sqrt(Tk / 300) * Math.sqrt(28 / M);
  /* colisões elásticas entre discos (massas m, raios r); só entra quem tem c(p) verdadeiro. Devolve o número de colisões. */
  G.colide = (ps, c) => { let n = 0; for (let i = 0; i < ps.length; i++) { const a = ps[i]; if (c && !c(a)) continue; for (let j = i + 1; j < ps.length; j++) { const b = ps[j]; if (c && !c(b)) continue; const dx = b.x - a.x, dy = b.y - a.y, R = a.r + b.r; if (Math.abs(dx) > R || Math.abs(dy) > R) continue; const d2 = dx * dx + dy * dy; if (d2 >= R * R || d2 === 0) continue; const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (vn >= 0) continue; const J = (2 * a.m * b.m / (a.m + b.m)) * vn; a.vx += (J / a.m) * nx; a.vy += (J / a.m) * ny; b.vx -= (J / b.m) * nx; b.vy -= (J / b.m) * ny; n++; } } return n; };
  /* velocidades reais de um gás (m/s): mais provável, média e quadrática média (3D), com R = 8,314 J/(mol·K) e M em g/mol */
  G.vReal = (Tk, M) => { const k = 8.314 * Tk / (M / 1000); return { vp: Math.sqrt(2 * k), vm: Math.sqrt(8 * k / Math.PI), vrms: Math.sqrt(3 * k) }; };
  const COR = ["var(--mA)", "var(--warn)"];

  /* ---------- EQ01 · difusão e efusão ---------- */
  /* nome: "Difusão e efusão: o gás leve chega primeiro" · matéria: Química · tema: EQ01 */
  SIM.eqDifusao = (el, F) => { const GM = SIM.GASM, W = 680, H = 290, bx = 20, by = 20, bw = 440, bh = 240, meio = bx + bw / 2, furo = 26, r = 4, Tk = 300;
    let rnd = Math.random, modo = "dif", gA = "H2", gB = "O2", aberta = false, denso = false, ps = [], fant = [], t = 0, cA = 0, cB = 0, hist = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">experimento</p><div class="bts">${botoes([["dif", "difusão (tirar a parede)"], ["ef", "efusão (furo para o vácuo)"]], "m", modo)}</div>
        <div class="bts" style="margin-top:8px"><button class="bt pri" data-a="abre">Tirar a parede</button><button class="bt" data-a="den" aria-pressed="false">Gás denso (com choques)</button><button class="bt" data-a="re">Recomeçar</button></div></div>
      <div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">gás A (azul)</p><div class="bts">${botoes(Object.keys(GM).map((k) => [k, GM[k][0]]), "ga", gA)}</div><p style="margin:8px 0 4px;font-size:13px;color:var(--ink2)">gás B (laranja)</p><div class="bts">${botoes(Object.keys(GM).map((k) => [k, GM[k][0]]), "gb", gB)}</div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), MA = () => GM[gA][1], MB = () => GM[gB][1];
    const nova = (tipo, x0, x1) => { const M = tipo ? MB() : MA(), s = G.sigma(Tk, M); return { tipo, m: M, r, x: x0 + r + rnd() * (x1 - x0 - 2 * r), y: by + r + rnd() * (bh - 2 * r), vx: G.gauss(rnd) * s, vy: G.gauss(rnd) * s }; };
    const reinicia = () => { ps = []; fant = []; t = 0; cA = 0; cB = 0; hist = []; aberta = false; const n = modo === "dif" ? 40 : 60;
      for (let i = 0; i < n; i++) { ps.push(nova(0, bx, modo === "dif" ? meio : meio)); ps.push(nova(1, modo === "dif" ? meio : bx, modo === "dif" ? bx + bw : meio)); }
      q("[data-a=abre]").style.display = modo === "dif" ? "" : "none"; q("[data-a=den]").style.display = modo === "ef" ? "" : "none"; };
    const medida = () => { const A = ps.filter((p) => !p.tipo), B = ps.filter((p) => p.tipo), aD = A.filter((p) => p.x > meio).length / A.length, bE = B.filter((p) => p.x < meio).length / B.length; return { aD, bE, mist: 1 - Math.abs((1 - aD) - bE) }; };
    const passo = (dt) => { const n = 4, h = dt / n, y0 = by + bh / 2 - furo / 2, y1 = y0 + furo;
      for (let k = 0; k < n; k++) { for (const p of ps) { const xa = p.x; p.x += p.vx * h; p.y += p.vy * h;
          const ef = modo === "ef", sg = ef ? G.sigma(Tk, p.m) : 0, nrm = () => sg * Math.sqrt(-2 * Math.log(1 - rnd() * 0.999999)), tg = () => G.gauss(rnd) * sg;
          if (p.y < by + r) { p.y = 2 * (by + r) - p.y; p.vy = -p.vy; if (ef) { p.vy = nrm(); p.vx = tg(); } } if (p.y > by + bh - r) { p.y = 2 * (by + bh - r) - p.y; p.vy = -p.vy; if (ef) { p.vy = -nrm(); p.vx = tg(); } }
          if (p.x < bx + r) { p.x = 2 * (bx + r) - p.x; p.vx = -p.vx; if (ef) { p.vx = nrm(); p.vy = tg(); } } if (p.x > bx + bw - r) { p.x = 2 * (bx + bw - r) - p.x; p.vx = -p.vx; }
          if (modo === "dif") { if (!aberta && (xa < meio) !== (p.x < meio)) { p.x = 2 * meio - p.x; p.vx = -p.vx; } }
          else if (xa < meio && p.x >= meio) { if (p.y > y0 + r && p.y < y1 - r) { p.tipo ? cB++ : cA++; fant.push({ tipo: p.tipo, x: p.x, y: p.y, vx: p.vx, vy: p.vy }); Object.assign(p, nova(p.tipo, bx, meio)); } else { p.x = 2 * meio - p.x; p.vx = -nrm(); p.vy = tg(); } } }
        if (modo === "dif" || denso) G.colide(ps); }
      for (const f of fant) { f.x += f.vx * dt; f.y += f.vy * dt; if (f.y < by + r || f.y > by + bh - r) f.vy = -f.vy; } fant = fant.filter((f) => f.x < bx + bw - r && f.x > meio - 1);
      t += dt; if (modo === "dif" && aberta && (!hist.length || t - hist[hist.length - 1][0] > 0.25) && hist.length < 400) { const m = medida(); hist.push([t, m.aD, m.bE]); } };
    const est = () => ({ modo, denso, gA, gB, MA: MA(), MB: MB(), aberta, t, cA, cB, razao: cB ? cA / cB : null, graham: Math.sqrt(MB() / MA()), ...medida() });
    const desenha = () => { const e = est(), y0 = by + bh / 2 - furo / 2, y1 = y0 + furo;
      let s = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
      if (modo === "dif") { if (!aberta) s += `<line x1="${meio}" x2="${meio}" y1="${by}" y2="${by + bh}" style="stroke:var(--ink2);stroke-width:4"/>`; }
      else s += `<line x1="${meio}" x2="${meio}" y1="${by}" y2="${y0}" style="stroke:var(--ink2);stroke-width:4"/><line x1="${meio}" x2="${meio}" y1="${y1}" y2="${by + bh}" style="stroke:var(--ink2);stroke-width:4"/>` + T(meio + bw / 4, by + 16, "vácuo");
      ps.forEach((p) => (s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r}" style="fill:${COR[p.tipo]}"/>`)); fant.forEach((p) => (s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r}" style="fill:${COR[p.tipo]};opacity:.75"/>`));
      const gx = 500, gy = 250, gw = 160, gh = 200; s += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" style="stroke:var(--ink3)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" style="stroke:var(--ink3)"/>`;
      if (modo === "dif") { const tm = Math.max(10, hist.length ? hist[hist.length - 1][0] : 10), X = (v) => gx + gw * v / tm, Y = (v) => gy - gh * v / 0.6, lin = (k, cor) => hist.length > 1 ? `<path d="${hist.map((p, i) => (i ? "L" : "M") + X(p[0]).toFixed(1) + "," + Y(Math.min(0.6, p[k])).toFixed(1)).join("")}" style="fill:none;stroke:${cor};stroke-width:2"/>` : "";
        s += `<line x1="${gx}" y1="${Y(0.5)}" x2="${gx + gw}" y2="${Y(0.5)}" style="stroke:var(--ink3);stroke-dasharray:4 4"/>` + T(gx - 4, Y(0.5) + 4, "50%", "end", "tx2", 10) + lin(1, COR[0]) + lin(2, COR[1]) + T(gx + gw / 2, 16, "quanto já passou para o outro lado", "middle", "tx2", 11) + T(gx + gw / 2, gy + 16, "tempo", "middle", "tx2", 10); }
      else { const mx = Math.max(10, cA, cB), bar = (x, v, cor, rot) => `<rect x="${x}" y="${gy - gh * v / mx}" width="46" height="${gh * v / mx}" style="fill:color-mix(in srgb,${cor} 55%,transparent);stroke:${cor}"/>` + T(x + 23, gy + 16, rot, "middle", "tx2", 11) + T(x + 23, gy - gh * v / mx - 5, v, "middle", "tx", 12);
        s += bar(gx + 20, cA, COR[0], GM[gA][0]) + bar(gx + 94, cB, COR[1], GM[gB][0]) + T(gx + gw / 2, 16, "moléculas que escaparam", "middle", "tx2", 11); }
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = modo === "dif" ? vis(`${GM[gA][0]} (${MA()} g/mol) do lado direito`, n2(100 * e.aD, 0) + " %") + vis(`${GM[gB][0]} (${MB()} g/mol) do lado esquerdo`, n2(100 * e.bE, 0) + " %") + vis("mistura (100% = uniforme)", n2(100 * e.mist, 0) + " %") + vis("tempo da simulação", n2(e.t, 1) + " s")
        : vis(`${GM[gA][0]} que escaparam`, cA) + vis(`${GM[gB][0]} que escaparam`, cB) + vis("razão medida A/B", e.razao ? n2(e.razao, 2) : "—") + vis("lei de Graham: √(M_B/M_A)", n2(e.graham, 2));
      q("[data-v=st]").innerHTML = (modo === "dif" ? `Os dois gases estão à mesma temperatura, logo têm a mesma energia cinética média; o mais leve é mais rápido (velocidade ∝ 1/√M). Tire a parede e veja qual curva sobe primeiro. As moléculas se chocam o tempo todo, e por isso a mistura demora bem mais que uma travessia em linha reta. ` : `Os dois gases estão misturados à esquerda, em quantidades iguais, e escapam por um furo pequeno para o vácuo. Cada molécula que sai é reposta, para a mistura não mudar. ${denso ? "Gás denso: as moléculas se chocam muitas vezes antes de achar o furo, a saída vira um escoamento e a vantagem do gás leve diminui. A razão fica <b>abaixo</b> da de Graham." : "Gás rarefeito: as moléculas quase não se chocam (aqui, não se chocam), que é a condição para a lei de Graham valer. A razão entre as contagens tende a √(M_B/M_A); no começo ela oscila muito, porque são poucas moléculas. Deixe correr."} `) + "Modelo em duas dimensões, a 300 K; velocidades em escala, não em m/s."; };
    liga(el, "m", (v) => { modo = v; reinicia(); }); liga(el, "ga", (v) => { gA = v; reinicia(); }); liga(el, "gb", (v) => { gB = v; reinicia(); });
    q("[data-a=abre]").addEventListener("click", () => { aberta = true; }); q("[data-a=re]").addEventListener("click", reinicia); q("[data-a=den]").addEventListener("click", (ev) => { denso = !denso; ev.target.setAttribute("aria-pressed", String(denso)); reinicia(); });
    reinicia(); anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqDifusao._ult = { semente: (n) => { rnd = G.rng(n); reinicia(); }, poe: (m, a, b) => { modo = m; gA = a; gB = b; [["m", m], ["ga", a], ["gb", b]].forEach(([k, x]) => el.querySelectorAll(`[data-${k}]`).forEach((bt) => bt.setAttribute("aria-pressed", String(bt.dataset[k] === x)))); reinicia(); }, abre: () => { aberta = true; }, denso: (v) => { denso = !!v; q("[data-a=den]").setAttribute("aria-pressed", String(denso)); reinicia(); }, avanca: (seg) => { for (let i = 0; i < Math.round(seg * 60); i++) passo(1 / 60); desenha(); }, est }; };

  /* ---------- EQ02 · pistão que se move de verdade ---------- */
  /* nome: "Pistão vivo: pressão são batidas" · matéria: Química · tema: EQ02 */
  SIM.eqPistao = (el, F) => { const W = 680, H = 300, x0 = 60, L = 240, chao = 270, r = 3, Mp = 12, hmax = 240;
    let rnd = Math.random, ps = [], h = 120, V = 0, livre = true, Tk = 300, N = 60, peso = 4050, imp = 0, Pm = null, t = 0, hm = null, kTm = null, hist = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${sl("temperatura da base (K)", "T", 150, 600, 10, 300)}${sl("número de moléculas", "N", 20, 120, 5, 60)}</div>
      <div><div class="bts">${botoes([["1", "pistão livre (pressão fixa)"], ["0", "pistão travado (volume fixo)"]], "l", "1")}</div>${sl("peso sobre o pistão", "F", 2000, 9000, 50, 4050)}${sl("altura do pistão travado", "h", 50, 230, 2, 120)}</div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), val = (c) => +q(`[data-c=${c}]`).value, sig = () => 90 * Math.sqrt(Tk / 300);
    const nova = () => { const s = sig(); return { x: x0 + rnd() * L, y: rnd() * h, vx: G.gauss(rnd) * s, vy: G.gauss(rnd) * s }; };
    const acerta = () => { while (ps.length < N) ps.push(nova()); ps.length = N; };
    const reinicia = () => { ps = []; V = 0; imp = 0; Pm = null; hm = null; kTm = null; t = 0; hist = []; h = livre ? Math.min(hmax, N * sig() * sig() / peso) : val("h"); acerta(); };
    /* y = altura acima do chão. Chão: termostato (a molécula volta com velocidade sorteada na temperatura da base). Pistão: massa Mp, colisão elástica. */
    const kT = () => ps.reduce((a, p) => a + p.vx * p.vx + p.vy * p.vy, 0) / (2 * ps.length);
    const passo = (dt) => { const n = 4, dh = dt / n, s = sig();
      for (let k = 0; k < n; k++) { if (livre) { V += (-peso / Mp) * dh; V *= Math.exp(-0.6 * dh); h += V * dh; if (h < 20) { h = 20; V = Math.abs(V) * 0.3; } if (h > hmax) { h = hmax; V = -Math.abs(V) * 0.3; } } else V = 0;
        for (const p of ps) { p.x += p.vx * dh; p.y += p.vy * dh;
          if (p.x < x0) { p.x = 2 * x0 - p.x; p.vx = -p.vx; } if (p.x > x0 + L) { p.x = 2 * (x0 + L) - p.x; p.vx = -p.vx; }
          if (p.y < 0) { p.y = 0; p.vy = s * Math.sqrt(-2 * Math.log(1 - rnd() * 0.999999)); p.vx = G.gauss(rnd) * s; }
          if (p.y > h) { p.y = h; if (p.vy > V) { if (livre) { const v1 = ((1 - Mp) * p.vy + 2 * Mp * V) / (1 + Mp), V1 = ((Mp - 1) * V + 2 * p.vy) / (1 + Mp); imp += p.vy - v1; p.vy = v1; V = V1; } else { imp += 2 * p.vy; p.vy = -p.vy; } } } } }
      t += dt; const P = imp / dt / L; imp = 0; const a = Math.min(1, dt / 3); Pm = Pm === null ? P : Pm + a * (P - Pm); hm = hm === null ? h : hm + a * (h - hm); const kk = kT(); kTm = kTm === null ? kk : kTm + a * (kk - kTm);
      if (!hist.length || t - hist[hist.length - 1][0] > 0.2) { hist.push([t, h]); if (hist.length > 300) hist.shift(); } };
    const est = () => { const k = kTm || kT(); return { livre, Tk, N, peso, h, hm, V, Pm, kT: k, kTbase: sig() * sig(), Pideal: N * k / (L * (hm || h)), razao: Pm * L * (hm || h) / (N * k), hTeor: N * sig() * sig() / peso, Pext: peso / L }; };
    const desenha = () => { const e = est(), yp = chao - h; q("[data-o=T]").textContent = Tk + " K"; q("[data-o=N]").textContent = N; q("[data-o=F]").textContent = n2(peso / 4050, 2) + " ×"; q("[data-o=h]").textContent = n2(val("h"), 0);
      q("[data-c=F]").disabled = !livre; q("[data-c=h]").disabled = livre;
      const quente = Math.round(Math.min(60, 10 + (Tk - 150) / 9));
      let s = `<path d="M${x0},${chao - hmax - 16} V${chao} H${x0 + L} V${chao - hmax - 16}" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="${x0 - 6}" y="${chao}" width="${L + 12}" height="9" style="fill:color-mix(in srgb,var(--bad) ${quente}%,var(--ink3))"/>` + T(x0 + L / 2, chao + 24, "base a " + Tk + " K", "middle", "tx2", 11);
      s += `<rect x="${x0 + 1}" y="${yp - 10}" width="${L - 2}" height="10" style="fill:var(--ink2)"/><line x1="${x0 + L / 2}" y1="${yp - 10}" x2="${x0 + L / 2}" y2="${yp - 26}" style="stroke:var(--ink2);stroke-width:4"/>`;
      if (livre) { const k = Math.round(peso / 1000); for (let i = 0; i < k; i++) s += `<rect x="${x0 + L / 2 - 30 + (i % 3) * 21}" y="${yp - 40 - Math.floor(i / 3) * 13}" width="18" height="11" rx="2" style="fill:color-mix(in srgb,var(--warn) 55%,transparent);stroke:var(--warn)"/>`; }
      else s += `<path d="M${x0 - 8},${yp - 5} h8 M${x0 + L},${yp - 5} h8" style="stroke:var(--warn);stroke-width:4"/>`;
      ps.forEach((p) => (s += `<circle cx="${Math.min(x0 + L - r, Math.max(x0 + r, p.x)).toFixed(1)}" cy="${(chao - Math.min(Math.max(h - r, r), Math.max(r, p.y))).toFixed(1)}" r="${r}" style="fill:var(--mA)"/>`));
      const gx = 380, gy = 250, gw = 270, gh = 200; s += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" style="stroke:var(--ink3)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" style="stroke:var(--ink3)"/>` + T(gx + gw / 2, 30, "altura do pistão ao longo do tempo", "middle", "tx2", 11);
      if (hist.length > 1) { const t0 = hist[0][0], t1 = Math.max(t0 + 10, hist[hist.length - 1][0]); s += `<path d="${hist.map((p, i) => (i ? "L" : "M") + (gx + gw * (p[0] - t0) / (t1 - t0)).toFixed(1) + "," + (gy - gh * p[1] / hmax).toFixed(1)).join("")}" style="fill:none;stroke:var(--mA);stroke-width:2"/>`; }
      if (livre) s += `<line x1="${gx}" y1="${gy - gh * Math.min(hmax, e.hTeor) / hmax}" x2="${gx + gw}" y2="${gy - gh * Math.min(hmax, e.hTeor) / hmax}" style="stroke:var(--warn);stroke-dasharray:5 4"/>` + T(gx + gw, 48, "tracejado: previsto por PV = NkT", "end", "tx2", 10);
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("pressão medida (batidas no pistão)", Pm === null ? "—" : n2(Pm, 1)) + vis("pressão do gás ideal, NkT/V", n2(e.Pideal, 1)) + vis("PV / NkT", Pm === null ? "—" : n2(e.razao, 2)) + vis("volume (altura × largura)", n2((hm || h) * L / 1000, 1)) + vis("temperatura do gás (média)", n2(300 * e.kT / 8100, 0) + " K");
      q("[data-v=st]").innerHTML = (livre ? "O pistão não está preso: tem massa, um peso em cima e leva milhares de batidas por segundo. Ele para onde a pressão do gás equilibra o peso. Aqueça a base (o volume cresce: Charles), ponha mais peso (o volume cai: Boyle) ou mais moléculas (Avogadro). A linha tracejada é a altura prevista por PV = NkT. O pistão tem um pouco de atrito, que rouba energia do gás: ele fica uns 3% mais frio que a base, e a altura média, um pouco abaixo da linha. " : "Com o pistão travado, o volume não muda. Aqueça a base e veja a pressão medida subir junto com a temperatura (Gay-Lussac); a razão PV/NkT fica em torno de 1. ") + "Modelo: gás ideal em duas dimensões (as moléculas não se enxergam), unidades da simulação. A pressão medida oscila porque são poucas moléculas."; };
    const le = () => { Tk = val("T"); N = val("N"); peso = val("F"); if (!livre) { h = val("h"); for (const p of ps) if (p.y > h) p.y = h; } acerta(); };
    el.querySelectorAll("input[type=range]").forEach((i) => i.addEventListener("input", le)); liga(el, "l", (v) => { livre = v === "1"; if (!livre) { q("[data-c=h]").value = Math.round(h); h = val("h"); } V = 0; Pm = null; hm = null; });
    reinicia(); anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqPistao._ult = { semente: (n) => { rnd = G.rng(n); reinicia(); }, poe: (o) => { if (o.livre !== undefined) { livre = o.livre; el.querySelectorAll("[data-l]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.l === (livre ? "1" : "0")))); } [["T", o.T], ["N", o.N], ["F", o.peso], ["h", o.h]].forEach(([c, v]) => { if (v !== undefined) q(`[data-c=${c}]`).value = v; }); Tk = val("T"); N = val("N"); peso = val("F"); reinicia(); }, avanca: (seg) => { for (let i = 0; i < Math.round(seg * 60); i++) passo(1 / 60); desenha(); }, est }; };

  /* ---------- EQ03 · distribuição de Maxwell-Boltzmann nascendo das colisões ---------- */
  /* nome: "Maxwell-Boltzmann: a curva que nasce das colisões" · matéria: Química · tema: EQ03 */
  SIM.eqMaxwell = (el, F) => { const GM = SIM.GASM, W = 680, H = 300, bx = 20, by = 20, bw = 300, bh = 250, r = 3.5, N = 150, NB = 24;
    let rnd = Math.random, ps = [], gas = "N2", Tk = 300, cols = 0, t = 0, acum = new Array(NB).fill(0), nac = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">gás</p><div class="bts">${botoes(Object.keys(GM).map((k) => [k, GM[k][0]]), "g", gas)}</div>${sl("temperatura (K)", "T", 100, 1000, 10, 300)}</div>
      <div><div class="bts"><button class="bt pri" data-a="re">Todas com a mesma velocidade</button><button class="bt" data-a="q">Aquecer</button><button class="bt" data-a="f">Esfriar</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), sig = () => 55 * Math.sqrt(Tk / 300);
    const reinicia = () => { ps = []; cols = 0; t = 0; acum.fill(0); nac = 0; const v = sig() * Math.SQRT2, lado = Math.ceil(Math.sqrt(N * bw / bh)), dx = bw / lado, dy = bh / Math.ceil(N / lado);
      for (let i = 0; i < N; i++) { const a = rnd() * 2 * Math.PI; ps.push({ m: 1, r, x: bx + dx * (0.5 + (i % lado)), y: by + dy * (0.5 + Math.floor(i / lado)), vx: v * Math.cos(a), vy: v * Math.sin(a) }); } };
    const escala = (f) => { for (const p of ps) { p.vx *= f; p.vy *= f; } acum.fill(0); nac = 0; };
    const stats = () => { let s1 = 0, s2 = 0; for (const p of ps) { const v = Math.hypot(p.vx, p.vy); s1 += v; s2 += v * v; } return { vm: s1 / N, vrms: Math.sqrt(s2 / N) }; };
    const passo = (dt) => { const n = 3, h = dt / n; for (let k = 0; k < n; k++) { for (const p of ps) { p.x += p.vx * h; p.y += p.vy * h;
          if (p.x < bx + r) { p.x = 2 * (bx + r) - p.x; p.vx = -p.vx; } if (p.x > bx + bw - r) { p.x = 2 * (bx + bw - r) - p.x; p.vx = -p.vx; } if (p.y < by + r) { p.y = 2 * (by + r) - p.y; p.vy = -p.vy; } if (p.y > by + bh - r) { p.y = 2 * (by + bh - r) - p.y; p.vy = -p.vy; } }
        cols += G.colide(ps); }
      t += dt; const vr = stats().vrms, vmax = 3 * vr; if (nac > 240) { for (let i = 0; i < NB; i++) acum[i] *= 0.5; nac *= 0.5; } for (const p of ps) { const b = Math.floor(Math.hypot(p.vx, p.vy) / vmax * NB); if (b < NB) acum[b]++; } nac++; };
    const est = () => { const s = stats(), M = GM[gas][1]; return { gas, M, Tk, t, cols, ...s, razao: s.vm / s.vrms, teor2D: Math.sqrt(Math.PI) / 2, real: G.vReal(Tk * (s.vrms * s.vrms / 2) / (sig() * sig()), M), Tef: Tk * (s.vrms * s.vrms / 2) / (sig() * sig()), hist: acum.map((x) => x / Math.max(1, nac) / N) }; };
    const desenha = () => { const e = est(), vmax = 3 * e.vrms, s2 = e.vrms * e.vrms / 2; q("[data-o=T]").textContent = Tk + " K";
      let s = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
      ps.forEach((p) => { const v = Math.hypot(p.vx, p.vy) / e.vrms; s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r}" style="fill:${v > 1.3 ? "var(--bad)" : v < 0.6 ? "var(--mA)" : "var(--ink2)"}"/>`; });
      const gx = 360, gy = 250, gw = 300, gh = 200, bwid = gw / NB, pico = 0.6065 / Math.sqrt(s2) * (vmax / NB), esc = gh / (1.6 * pico);
      s += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" style="stroke:var(--ink3)"/>`;
      e.hist.forEach((f, i) => { const hh = Math.min(gh, f * esc); s += `<rect x="${(gx + i * bwid).toFixed(1)}" y="${(gy - hh).toFixed(1)}" width="${(bwid - 1).toFixed(1)}" height="${hh.toFixed(1)}" style="fill:color-mix(in srgb,var(--mA) 50%,transparent)"/>`; });
      let d = ""; for (let i = 0; i <= 90; i++) { const v = vmax * i / 90, f = (v / s2) * Math.exp(-v * v / (2 * s2)) * (vmax / NB); d += (i ? "L" : "M") + (gx + gw * i / 90).toFixed(1) + "," + (gy - Math.min(gh, f * esc)).toFixed(1); }
      s += `<path d="${d}" style="fill:none;stroke:var(--warn);stroke-width:2"/>` + T(gx + gw / 2, 16, "quantas moléculas em cada faixa de velocidade", "middle", "tx2", 11) + T(gx + gw - 2, 34, "curva: Maxwell-Boltzmann (2D)", "end", "tx2", 10);
      const R = e.real;
      s += [0, 1, 2, 3].map((k) => T(gx + gw * k / 3, gy + 15, n2(k * R.vrms, 0), "middle", "tx2", 10)).join("") + T(gx + gw / 2, gy + 32, "velocidade (m/s), na escala do " + GM[gas][0], "middle", "tx2", 10);
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("v média / v rms na caixa", n2(e.razao, 3)) + vis("valor de Maxwell-Boltzmann (2D)", n2(e.teor2D, 3)) + vis("colisões até agora", cols) + vis(`${GM[gas][0]} de verdade a ${n2(e.Tef, 0)} K: mais provável`, n2(R.vp, 0) + " m/s") + vis("média", n2(R.vm, 0) + " m/s") + vis("quadrática média", n2(R.vrms, 0) + " m/s");
      q("[data-v=st]").innerHTML = "Todas as moléculas começam com a mesma velocidade (só a direção é sorteada): a razão entre a velocidade média e a quadrática média é 1,000. Ninguém impõe curva nenhuma; as colisões redistribuem a energia e, em poucos segundos, o histograma encosta na curva de Maxwell-Boltzmann, com muitas moléculas perto do pico e uma cauda de rápidas (vermelhas). Aquecer alarga e abaixa a curva; trocar o gás muda a escala em m/s (∝ 1/√M). A caixa é um modelo em duas dimensões, e por isso a curva comparada é a de 2D; os três números em m/s são os do gás real em três dimensões."; };
    liga(el, "g", (v) => { gas = v; }); q("[data-c=T]").addEventListener("input", () => { const a = Tk; Tk = +q("[data-c=T]").value; escala(Math.sqrt(Tk / a)); });
    q("[data-a=re]").addEventListener("click", reinicia); q("[data-a=q]").addEventListener("click", () => { const a = Tk; Tk = Math.min(1000, Math.round(Tk * 1.2 / 10) * 10); q("[data-c=T]").value = Tk; escala(Math.sqrt(Tk / a)); }); q("[data-a=f]").addEventListener("click", () => { const a = Tk; Tk = Math.max(100, Math.round(Tk / 1.2 / 10) * 10); q("[data-c=T]").value = Tk; escala(Math.sqrt(Tk / a)); });
    reinicia(); anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqMaxwell._ult = { semente: (n) => { rnd = G.rng(n); reinicia(); }, poe: (g, Tn) => { gas = g; Tk = Tn; q("[data-c=T]").value = Tn; el.querySelectorAll("[data-g]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.g === g))); reinicia(); }, avanca: (seg) => { for (let i = 0; i < Math.round(seg * 60); i++) passo(1 / 60); desenha(); }, energia: () => ps.reduce((a, p) => a + p.vx * p.vx + p.vy * p.vy, 0), est }; };

  /* ---------- EQ04 · gás real × gás ideal: dinâmica molecular de Lennard-Jones ---------- */
  /* segundo coeficiente do virial em 2D, B₂(T) = −π ∫ (e^(−u/T) − 1) r dr, com u = 4(r⁻¹² − r⁻⁶) cortado em rc */
  G.B2 = (Tr, rc = 2.5) => { let s = 0; const n = 5000, h = rc / n; for (let i = 0; i < n; i++) { const x = (i + 0.5) * h, u = 4 * (Math.pow(x, -12) - Math.pow(x, -6)); s += (Math.exp(-u / Tr) - 1) * x * h; } return -Math.PI * s; };
  /* nome: "Gás real × gás ideal: moléculas que se atraem e ocupam espaço" · matéria: Química · tema: EQ04 */
  SIM.eqReal = (el, F) => { const W = 680, H = 300, N = 64, rc = 2.5, dtm = 0.004, bx = 20, by = 20, lado = 250;
    let rnd = Math.random, ps = [], rho = 0.2, Tr = 1, Lc = Math.sqrt(N / rho), vir = 0, Zm = null, trilha = [], t = 0, nm = 0, sZ = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${sl("densidade (moléculas por área)", "r", 0.03, 0.6, 0.01, 0.2)}${sl("temperatura (em unidades de ε/k)", "T", 0.7, 4, 0.05, 1)}</div>
      <div><div class="bts"><button class="bt" data-a="lz">Limpar o gráfico</button></div><p style="margin:8px 0 0;font-size:13.5px;color:var(--ink2)" data-v="dica"></p></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const forcas = () => { vir = 0; for (const p of ps) { p.fx = 0; p.fy = 0; } for (let i = 0; i < N; i++) { const a = ps[i]; for (let j = i + 1; j < N; j++) { const b = ps[j]; let dx = a.x - b.x, dy = a.y - b.y; dx -= Lc * Math.round(dx / Lc); dy -= Lc * Math.round(dy / Lc); const r2 = dx * dx + dy * dy; if (r2 > rc * rc) continue; const i2 = 1 / Math.max(r2, 0.49), i6 = i2 * i2 * i2, ff = 24 * i2 * i6 * (2 * i6 - 1); a.fx += ff * dx; a.fy += ff * dy; b.fx -= ff * dx; b.fy -= ff * dy; vir += ff * r2; } } };
    const kT = () => ps.reduce((s, p) => s + p.vx * p.vx + p.vy * p.vy, 0) / (2 * N);
    const zera = () => { Zm = null; nm = 0; sZ = 0; };
    const reinicia = () => { Lc = Math.sqrt(N / rho); ps = []; const k = 8, a = Lc / k, s = Math.sqrt(Tr); for (let i = 0; i < N; i++) ps.push({ x: a * (0.5 + (i % k)), y: a * (0.5 + Math.floor(i / k)), vx: G.gauss(rnd) * s, vy: G.gauss(rnd) * s, fx: 0, fy: 0 }); forcas(); zera(); t = 0; };
    const reescala = () => { const L1 = Math.sqrt(N / rho), f = L1 / Lc; for (const p of ps) { p.x *= f; p.y *= f; } Lc = L1; forcas(); zera(); };
    /* Verlet com velocidades; termostato: reescala suave das velocidades para a temperatura pedida */
    const passo = (dt) => { const n = Math.max(1, Math.round(dt / (1 / 60) * 8)); for (let k = 0; k < n; k++) { for (const p of ps) { p.vx += 0.5 * dtm * p.fx; p.vy += 0.5 * dtm * p.fy; p.x += dtm * p.vx; p.y += dtm * p.vy; p.x -= Lc * Math.floor(p.x / Lc); p.y -= Lc * Math.floor(p.y / Lc); } forcas(); for (const p of ps) { p.vx += 0.5 * dtm * p.fx; p.vy += 0.5 * dtm * p.fy; }
        const Ta = kT(), f = Math.sqrt(1 + 0.02 * (Tr / Ta - 1)); for (const p of ps) { p.vx *= f; p.vy *= f; }
        t += dtm; if (t > 4) { sZ += 1 + vir / (2 * N * Tr); nm++; } } if (nm) Zm = sZ / nm; };
    const est = () => ({ rho, Tr, Z: Zm, nm, t, kT: kT(), B2: G.B2(Tr, rc), Zvirial: 1 + G.B2(Tr, rc) * rho, vizinhos: (() => { let c = 0; for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { let dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y; dx -= Lc * Math.round(dx / Lc); dy -= Lc * Math.round(dy / Lc); if (dx * dx + dy * dy < 1.69) c++; } return 2 * c / N; })() });
    const desenha = () => { const e = est(), esc = lado / Lc, rr = Math.max(1.5, 0.5 * esc); q("[data-o=r]").textContent = n2(rho, 2); q("[data-o=T]").textContent = n2(Tr, 2);
      let s = `<rect x="${bx}" y="${by}" width="${lado}" height="${lado}" style="fill:none;stroke:var(--ink2);stroke-width:2"/><clipPath id="cx-real"><rect x="${bx}" y="${by}" width="${lado}" height="${lado}"/></clipPath><g clip-path="url(#cx-real)">`;
      const perto = new Array(N).fill(0); for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { let dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y; dx -= Lc * Math.round(dx / Lc); dy -= Lc * Math.round(dy / Lc); if (dx * dx + dy * dy < 1.69) { perto[i]++; perto[j]++; } }
      ps.forEach((p, i) => (s += `<circle cx="${(bx + p.x * esc).toFixed(1)}" cy="${(by + p.y * esc).toFixed(1)}" r="${rr.toFixed(1)}" style="fill:${perto[i] >= 2 ? "var(--warn)" : "var(--mA)"};opacity:.9"/>`)); s += "</g>";
      const gx = 330, gy = 262, gw = 320, gh = 220, X = (v) => gx + gw * v / 0.6, Y = (v) => gy - gh * Math.max(0, Math.min(2.6, v)) / 2.6;
      s += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" style="stroke:var(--ink3)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" style="stroke:var(--ink3)"/><line x1="${gx}" y1="${Y(1)}" x2="${gx + gw}" y2="${Y(1)}" style="stroke:var(--ink2);stroke-dasharray:5 4"/>` + T(gx + gw - 2, Y(1) - 5, "gás ideal: Z = 1", "end", "tx2", 10) + [0, 1, 2].map((k) => T(gx - 5, Y(k) + 4, k, "end", "tx2", 10)).join("") + [0, 0.2, 0.4, 0.6].map((k) => T(X(k), gy + 14, n2(k, 1), "middle", "tx2", 10)).join("") + T(gx + gw / 2, gy + 30, "densidade", "middle", "tx2", 10) + T(gx + 6, gy - gh - 4, "Z = P/(ρkT)", "start", "tx2", 11);
      s += `<line x1="${X(0)}" y1="${Y(1)}" x2="${X(0.25)}" y2="${Y(1 + e.B2 * 0.25)}" style="stroke:var(--warn);stroke-width:1.6"/>` + T(X(0.25) + 4, Y(1 + e.B2 * 0.25) + 4, "1 + B₂ρ", "start", "tx2", 10);
      trilha.forEach((p) => (s += `<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="3" style="fill:${p[2] === Tr ? "var(--mA)" : "var(--ink3)"}"/>`));
      if (Zm !== null) s += `<circle cx="${X(rho)}" cy="${Y(Zm)}" r="5.5" style="fill:var(--bad);stroke:var(--bg);stroke-width:1.5"/>`;
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("Z medido (média no tempo)", Zm === null ? "medindo…" : n2(Zm, 2)) + vis("gás ideal", "1,00") + vis("quem ganha", Zm === null ? "—" : Zm < 0.97 ? "atração (Z < 1)" : Zm > 1.03 ? "repulsão (Z > 1)" : "empate") + vis("vizinhas coladas, em média", n2(e.vizinhos, 1));
      q("[data-v=dica]").textContent = "Cada ponto azul no gráfico é uma medida já feita nesta temperatura; os cinza são de outras temperaturas.";
      q("[data-v=st]").innerHTML = "As moléculas se atraem de longe e se repelem quando encostam (potencial de Lennard-Jones). A pressão é medida somando as forças entre elas (virial), e Z = P/(ρkT) compara com o gás ideal. Frio e pouco denso: a atração segura as moléculas (ficam laranja quando andam coladas) e a pressão cai, Z &lt; 1. Muito denso: falta espaço, a repulsão manda e Z &gt; 1. Bem quente: a atração quase não conta. A reta laranja é a previsão para baixas densidades, 1 + B₂(T)·ρ. Modelo em duas dimensões e unidades reduzidas: não é um gás específico; o que corresponde às constantes a e b de van der Waals é a atração e o tamanho das moléculas."; };
    const guarda = () => { if (Zm !== null && nm > 800) trilha.push([rho, Zm, Tr]); if (trilha.length > 60) trilha.shift(); };
    q("[data-c=r]").addEventListener("input", () => { guarda(); rho = +q("[data-c=r]").value; reescala(); t = 2; }); q("[data-c=T]").addEventListener("input", () => { guarda(); Tr = +q("[data-c=T]").value; zera(); t = 2; });
    q("[data-a=lz]").addEventListener("click", () => { trilha = []; });
    reinicia(); anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqReal._ult = { semente: (n) => { rnd = G.rng(n); reinicia(); }, poe: (r, Tn) => { rho = r; Tr = Tn; q("[data-c=r]").value = r; q("[data-c=T]").value = Tn; reinicia(); }, avanca: (unid) => { const n = Math.round(unid / dtm / 8); for (let i = 0; i < n; i++) passo(1 / 60); desenha(); }, est }; };
})();
